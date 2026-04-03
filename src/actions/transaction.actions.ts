'use server'

import { db, prisma } from '@/lib/db'
import { transactionSchema, type TransactionInput } from '@/lib/validations/transaction'
import { revalidatePath } from 'next/cache'
import { Blok, TransactionType } from '@prisma/client'

export type ActionResult<T = void> = {
  success: boolean
  message: string
  data?: T
}

export type CurrentUser = {
  id: string
  userId: string
  namaLengkap: string
  email: string
  blok: string
  role: string
  status: string
  jabatan: string
  nomorRumah: string
  noTelepon: string
  fotoProfil: string | null
  isSignatory: boolean
}

// Helper to check if user can access a blok
function canAccessBlok(user: CurrentUser, targetBlok: string): boolean {
  if (user.role === 'SUPERADMIN') return true
  return user.blok === targetBlok
}

// Create a new transaction
export async function createTransactionAction(
  input: TransactionInput & { blok: Blok },
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  if (!canAccessBlok(currentUser, input.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  const validation = transactionSchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: 'Data tidak valid' }
  }

  // Verify category belongs to the same blok
  const category = await db.financialCategory.findUnique({
    where: { id: input.categoryId },
  })

  if (!category || category.blok !== input.blok) {
    return { success: false, message: 'Kategori tidak valid untuk blok ini' }
  }

  try {
    await db.$transaction(async (tx) => {
      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          blok: input.blok,
          type: input.type,
          categoryId: input.categoryId,
          amount: input.amount,
          description: input.description,
          transactionDate: input.transactionDate,
          evidenceUrl: input.evidenceUrl,
          createdById: currentUser.id,
        },
      })

      // Create journal entries (double-entry bookkeeping)
      const kasAccount = `Kas RT Blok ${input.blok}`
      const categoryAccount = input.type === 'INCOME'
        ? `Pendapatan - ${category.name}`
        : `Beban - ${category.name}`

      if (input.type === 'INCOME') {
        await tx.journalEntry.createMany({
          data: [
            { transactionId: transaction.id, accountName: kasAccount, debit: input.amount, credit: 0 },
            { transactionId: transaction.id, accountName: categoryAccount, debit: 0, credit: input.amount },
          ],
        })
      } else {
        await tx.journalEntry.createMany({
          data: [
            { transactionId: transaction.id, accountName: categoryAccount, debit: input.amount, credit: 0 },
            { transactionId: transaction.id, accountName: kasAccount, debit: 0, credit: input.amount },
          ],
        })
      }
    })

    revalidatePath('/dashboard/finance/transaksi')
    return { success: true, message: 'Transaksi berhasil ditambahkan' }
  } catch (error) {
    console.error('Create transaction error:', error)
    return { success: false, message: 'Gagal menambahkan transaksi' }
  }
}

// Get transactions with filters
export async function getTransactionsAction(
  currentUser: CurrentUser,
  params: {
    blok?: Blok
    type?: TransactionType
    startDate?: Date
    endDate?: Date
    limit?: number
  }
) {
  if (!['SUPERADMIN', 'BENDAHARA', 'KETUART', 'ADMINBLOK'].includes(currentUser.role)) {
    return []
  }

  const where: any = {}

  // Blok filter
  if (currentUser.role !== 'SUPERADMIN') {
    where.blok = currentUser.blok
  } else if (params.blok) {
    where.blok = params.blok
  }

  // Type filter
  if (params.type) {
    where.type = params.type
  }

  // Date range filter
  if (params.startDate || params.endDate) {
    where.transactionDate = {}
    if (params.startDate) {
      where.transactionDate.gte = params.startDate
    }
    if (params.endDate) {
      where.transactionDate.lte = params.endDate
    }
  }

  return db.transaction.findMany({
    where,
    include: {
      category: true,
      createdBy: {
        select: {
          namaLengkap: true,
        },
      },
    },
    orderBy: { transactionDate: 'desc' },
    take: params.limit,
  })
}

// Get financial summary
export async function getFinancialSummaryAction(
  blok: Blok,
  year: number,
  month?: number,
  currentUser?: CurrentUser
) {
  if (currentUser && !canAccessBlok(currentUser, blok)) {
    throw new Error('Akses ditolak')
  }

  // Get initial balance
  const initialBalance = await db.initialBalance.findUnique({
    where: { blok_year: { blok, year } },
  })

  // Build date range
  let startDate: Date
  let endDate: Date

  if (month) {
    startDate = new Date(year, month - 1, 1)
    endDate = new Date(year, month, 0, 23, 59, 59)
  } else {
    startDate = new Date(year, 0, 1)
    endDate = new Date(year, 11, 31, 23, 59, 59)
  }

  // Get aggregated transactions
  const transactions = await db.transaction.findMany({
    where: {
      blok,
      transactionDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      type: true,
      amount: true,
    },
  })

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const startingBalance = initialBalance?.amount || 0
  const currentBalance = startingBalance + totalIncome - totalExpense

  return {
    initialBalance: startingBalance,
    totalIncome,
    totalExpense,
    currentBalance,
    period: { year, month },
  }
}

// Get transaction by ID
export async function getTransactionByIdAction(id: string) {
  return db.transaction.findUnique({
    where: { id },
    include: {
      category: true,
      journalEntries: true,
      createdBy: {
        select: {
          namaLengkap: true,
        },
      },
    },
  })
}

// Delete transaction
export async function deleteTransactionAction(id: string, currentUser: CurrentUser): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const transaction = await db.transaction.findUnique({
    where: { id },
  })

  if (!transaction) {
    return { success: false, message: 'Transaksi tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, transaction.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  try {
    // Journal entries will be deleted by cascade
    await db.transaction.delete({
      where: { id },
    })

    revalidatePath('/dashboard/finance/transaksi')
    return { success: true, message: 'Transaksi berhasil dihapus' }
  } catch (error) {
    console.error('Delete transaction error:', error)
    return { success: false, message: 'Gagal menghapus transaksi' }
  }
}
