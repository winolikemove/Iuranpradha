'use server'

import { db, prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Blok, PaymentStatus } from '@prisma/client'
import { CONFIG_KEYS } from '@/lib/constants'

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

export type PaymentPeriod = {
  month: number
  year: number
}

// Create a new payment submission
export async function createPaymentSubmissionAction(
  input: {
    periods: PaymentPeriod[]
    bankAccountId: string
    evidenceUrl: string
  },
  currentUser: CurrentUser
): Promise<ActionResult> {
  // Get tarif iuran from config
  const tarifConfig = await db.systemConfig.findUnique({
    where: { key: CONFIG_KEYS.TARIF_IURAN },
  })

  const tarifIuran = tarifConfig ? parseFloat(tarifConfig.value) : 50000

  // Verify bank account belongs to user's blok
  const bankAccount = await db.bankAccount.findUnique({
    where: { id: input.bankAccountId },
  })

  if (!bankAccount || bankAccount.blok !== currentUser.blok) {
    return { success: false, message: 'Rekening bank tidak valid' }
  }

  // Check for existing approved payments for the same periods
  for (const period of input.periods) {
    const existingApproved = await db.paymentItem.findFirst({
      where: {
        periodMonth: period.month,
        periodYear: period.year,
        submission: {
          profileId: currentUser.id,
          status: 'APPROVED',
        },
      },
    })

    if (existingApproved) {
      return {
        success: false,
        message: `Periode ${period.month}/${period.year} sudah dibayar`,
      }
    }
  }

  const totalAmount = input.periods.length * tarifIuran

  try {
    await db.paymentSubmission.create({
      data: {
        profileId: currentUser.id,
        blok: currentUser.blok as Blok,
        totalAmount,
        status: 'PENDING',
        evidenceUrl: input.evidenceUrl,
        bankAccountId: input.bankAccountId,
        items: {
          create: input.periods.map(period => ({
            periodMonth: period.month,
            periodYear: period.year,
            amount: tarifIuran,
          })),
        },
      },
    })

    revalidatePath('/dashboard')
    return { success: true, message: 'Pembayaran berhasil dikirim' }
  } catch (error) {
    console.error('Create payment error:', error)
    return { success: false, message: 'Gagal mengirim pembayaran' }
  }
}

// Approve a payment
export async function approvePaymentAction(submissionId: string, currentUser: CurrentUser): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const submission = await db.paymentSubmission.findUnique({
    where: { id: submissionId },
    include: {
      profile: true,
      items: true,
    },
  })

  if (!submission) {
    return { success: false, message: 'Pembayaran tidak ditemukan' }
  }

  if (currentUser.role !== 'SUPERADMIN' && submission.blok !== currentUser.blok) {
    return { success: false, message: 'Akses ditolak' }
  }

  if (submission.status !== 'PENDING') {
    return { success: false, message: 'Pembayaran sudah diproses' }
  }

  // Get iuran category for auto-creating transaction
  const iuranCategoryName = await db.systemConfig.findUnique({
    where: { key: CONFIG_KEYS.IURAN_CATEGORY_NAME },
  })

  const iuranCategory = await db.financialCategory.findFirst({
    where: {
      blok: submission.blok,
      name: iuranCategoryName?.value || 'Iuran Bulanan Warga',
      type: 'INCOME',
    },
  })

  if (!iuranCategory) {
    return { success: false, message: 'Kategori iuran tidak ditemukan' }
  }

  try {
    await db.$transaction(async (tx) => {
      // Update submission status
      await tx.paymentSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'APPROVED',
          processedAt: new Date(),
          processedById: currentUser.id,
        },
      })

      // Create income transaction
      const periodDesc = submission.items
        .map(i => `${i.periodMonth}/${i.periodYear}`)
        .join(', ')

      const transaction = await tx.transaction.create({
        data: {
          blok: submission.blok,
          type: 'INCOME',
          categoryId: iuranCategory.id,
          amount: submission.totalAmount,
          description: `Iuran ${submission.profile.namaLengkap} - ${submission.profile.nomorRumah} (${periodDesc})`,
          evidenceUrl: submission.evidenceUrl,
          transactionDate: new Date(),
          createdById: currentUser.id,
          paymentSubmissionId: submissionId,
        },
      })

      // Create journal entries
      const kasAccount = `Kas RT Blok ${submission.blok}`
      await tx.journalEntry.createMany({
        data: [
          { transactionId: transaction.id, accountName: kasAccount, debit: submission.totalAmount, credit: 0 },
          { transactionId: transaction.id, accountName: 'Pendapatan Iuran', debit: 0, credit: submission.totalAmount },
        ],
      })
    })

    revalidatePath('/dashboard/finance/pembayaran')
    return { success: true, message: 'Pembayaran berhasil disetujui' }
  } catch (error) {
    console.error('Approve payment error:', error)
    return { success: false, message: 'Gagal menyetujui pembayaran' }
  }
}

// Reject a payment
export async function rejectPaymentAction(
  submissionId: string,
  reason: string,
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const submission = await db.paymentSubmission.findUnique({
    where: { id: submissionId },
  })

  if (!submission) {
    return { success: false, message: 'Pembayaran tidak ditemukan' }
  }

  if (currentUser.role !== 'SUPERADMIN' && submission.blok !== currentUser.blok) {
    return { success: false, message: 'Akses ditolak' }
  }

  if (submission.status !== 'PENDING') {
    return { success: false, message: 'Pembayaran sudah diproses' }
  }

  await db.paymentSubmission.update({
    where: { id: submissionId },
    data: {
      status: 'REJECTED',
      processedAt: new Date(),
      processedById: currentUser.id,
      rejectReason: reason,
    },
  })

  revalidatePath('/dashboard/finance/pembayaran')
  return { success: true, message: 'Pembayaran berhasil ditolak' }
}

// Get current user's payments
export async function getMyPaymentsAction(currentUser: CurrentUser) {
  return db.paymentSubmission.findMany({
    where: { profileId: currentUser.id },
    include: {
      items: true,
      bankAccount: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Get pending payments for approval
export async function getPendingPaymentsAction(currentUser: CurrentUser, blok?: Blok) {
  if (!['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'].includes(currentUser.role)) {
    return []
  }

  const where: any = {
    status: 'PENDING',
  }

  if (currentUser.role !== 'SUPERADMIN') {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return db.paymentSubmission.findMany({
    where,
    include: {
      profile: {
        select: {
          namaLengkap: true,
          nomorRumah: true,
          blok: true,
        },
      },
      items: true,
      bankAccount: true,
    },
    orderBy: { createdAt: 'asc' },
  })
}

// Get payment history
export async function getPaymentHistoryAction(currentUser: CurrentUser, blok: Blok, year: number) {
  if (!['SUPERADMIN', 'BENDAHARA', 'KETUART', 'ADMINBLOK'].includes(currentUser.role)) {
    return []
  }

  if (currentUser.role !== 'SUPERADMIN' && blok !== currentUser.blok) {
    return []
  }

  return db.paymentSubmission.findMany({
    where: {
      blok,
      items: {
        some: {
          periodYear: year,
        },
      },
    },
    include: {
      profile: {
        select: {
          namaLengkap: true,
          nomorRumah: true,
        },
      },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Get paid periods for a profile
export async function getPaidPeriodsAction(profileId: string) {
  return db.paymentItem.findMany({
    where: {
      submission: {
        profileId,
        status: 'APPROVED',
      },
    },
    select: {
      periodMonth: true,
      periodYear: true,
    },
  })
}

// Get all payments for management
export async function getAllPaymentsAction(currentUser: CurrentUser, params?: { blok?: Blok; status?: PaymentStatus }) {
  if (!['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'].includes(currentUser.role)) {
    return []
  }

  const where: any = {}

  if (currentUser.role !== 'SUPERADMIN') {
    where.blok = currentUser.blok
  } else if (params?.blok) {
    where.blok = params.blok
  }

  if (params?.status) {
    where.status = params.status
  }

  return db.paymentSubmission.findMany({
    where,
    include: {
      profile: {
        select: {
          namaLengkap: true,
          nomorRumah: true,
          blok: true,
        },
      },
      items: true,
      bankAccount: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}
