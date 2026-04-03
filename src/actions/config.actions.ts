'use server'

import { db, prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Blok } from '@prisma/client'
import { categorySchema, bankAccountSchema, initialBalanceSchema } from '@/lib/validations/transaction'
import type { CategoryInput, BankAccountInput, InitialBalanceInput } from '@/lib/validations/transaction'

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

// ==================== SYSTEM CONFIG ====================

export async function getSystemConfigsAction() {
  return db.systemConfig.findMany({
    orderBy: [
      { group: 'asc' },
      { key: 'asc' },
    ],
  })
}

export async function getConfigValueAction(key: string): Promise<string | null> {
  const config = await db.systemConfig.findUnique({
    where: { key },
  })
  return config?.value ?? null
}

export async function updateSystemConfigAction(
  key: string,
  value: string,
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (currentUser.role !== 'SUPERADMIN') {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  await db.systemConfig.update({
    where: { key },
    data: { value },
  })

  revalidatePath('/dashboard/settings')
  return { success: true, message: 'Konfigurasi berhasil diperbarui' }
}

export async function createSystemConfigAction(
  input: {
    key: string
    value: string
    label: string
    type?: string
    group?: string
  },
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (currentUser.role !== 'SUPERADMIN') {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const existing = await db.systemConfig.findUnique({
    where: { key: input.key },
  })

  if (existing) {
    return { success: false, message: 'Key sudah ada' }
  }

  await db.systemConfig.create({
    data: {
      key: input.key,
      value: input.value,
      label: input.label,
      type: input.type || 'text',
      group: input.group || 'general',
    },
  })

  revalidatePath('/dashboard/settings')
  return { success: true, message: 'Konfigurasi berhasil ditambahkan' }
}

// ==================== FINANCIAL CATEGORY ====================

export async function getCategoriesAction(currentUser: CurrentUser, blok?: Blok) {
  if (!['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK', 'KETUART'].includes(currentUser.role)) {
    return []
  }

  const where: any = {}

  if (currentUser.role !== 'SUPERADMIN') {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return db.financialCategory.findMany({
    where,
    orderBy: [
      { type: 'asc' },
      { name: 'asc' },
    ],
  })
}

export async function createCategoryAction(
  input: CategoryInput & { blok: Blok },
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  if (!canAccessBlok(currentUser, input.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  const validation = categorySchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: 'Data tidak valid' }
  }

  const existing = await db.financialCategory.findFirst({
    where: {
      blok: input.blok,
      name: input.name,
      type: input.type,
    },
  })

  if (existing) {
    return { success: false, message: 'Kategori dengan nama dan tipe yang sama sudah ada' }
  }

  await db.financialCategory.create({
    data: {
      blok: input.blok,
      name: input.name,
      type: input.type,
      description: input.description,
    },
  })

  revalidatePath('/dashboard/finance/kategori')
  return { success: true, message: 'Kategori berhasil ditambahkan' }
}

export async function updateCategoryAction(
  id: string,
  input: Partial<CategoryInput>,
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const category = await db.financialCategory.findUnique({
    where: { id },
  })

  if (!category) {
    return { success: false, message: 'Kategori tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, category.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  await db.financialCategory.update({
    where: { id },
    data: input,
  })

  revalidatePath('/dashboard/finance/kategori')
  return { success: true, message: 'Kategori berhasil diperbarui' }
}

export async function toggleCategoryActiveAction(id: string, currentUser: CurrentUser): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const category = await db.financialCategory.findUnique({
    where: { id },
  })

  if (!category) {
    return { success: false, message: 'Kategori tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, category.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  await db.financialCategory.update({
    where: { id },
    data: { isActive: !category.isActive },
  })

  revalidatePath('/dashboard/finance/kategori')
  return { success: true, message: 'Status kategori berhasil diperbarui' }
}

// ==================== BANK ACCOUNT ====================

export async function getBankAccountsAction(currentUser: CurrentUser, blok?: Blok) {
  const where: any = {}

  if (currentUser.role !== 'SUPERADMIN') {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return db.bankAccount.findMany({
    where,
    orderBy: { bankName: 'asc' },
  })
}

export async function createBankAccountAction(
  input: BankAccountInput & { blok: Blok },
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  if (!canAccessBlok(currentUser, input.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  const validation = bankAccountSchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: 'Data tidak valid' }
  }

  await db.bankAccount.create({
    data: {
      blok: input.blok,
      bankName: input.bankName,
      accountNumber: input.accountNumber,
      accountHolder: input.accountHolder,
    },
  })

  revalidatePath('/dashboard/finance/rekening')
  return { success: true, message: 'Rekening berhasil ditambahkan' }
}

export async function updateBankAccountAction(
  id: string,
  input: Partial<BankAccountInput>,
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const account = await db.bankAccount.findUnique({
    where: { id },
  })

  if (!account) {
    return { success: false, message: 'Rekening tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, account.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  await db.bankAccount.update({
    where: { id },
    data: input,
  })

  revalidatePath('/dashboard/finance/rekening')
  return { success: true, message: 'Rekening berhasil diperbarui' }
}

export async function toggleBankAccountActiveAction(id: string, currentUser: CurrentUser): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const account = await db.bankAccount.findUnique({
    where: { id },
  })

  if (!account) {
    return { success: false, message: 'Rekening tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, account.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  await db.bankAccount.update({
    where: { id },
    data: { isActive: !account.isActive },
  })

  revalidatePath('/dashboard/finance/rekening')
  return { success: true, message: 'Status rekening berhasil diperbarui' }
}

// ==================== INITIAL BALANCE ====================

export async function getInitialBalancesAction(currentUser: CurrentUser, blok?: Blok) {
  if (!['SUPERADMIN', 'BENDAHARA', 'KETUART', 'ADMINBLOK'].includes(currentUser.role)) {
    return []
  }

  const where: any = {}

  if (currentUser.role !== 'SUPERADMIN') {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return db.initialBalance.findMany({
    where,
    orderBy: [
      { year: 'desc' },
      { blok: 'asc' },
    ],
  })
}

export async function upsertInitialBalanceAction(
  input: InitialBalanceInput & { blok: Blok },
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (!['SUPERADMIN', 'BENDAHARA'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  if (!canAccessBlok(currentUser, input.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  const validation = initialBalanceSchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: 'Data tidak valid' }
  }

  await db.initialBalance.upsert({
    where: {
      blok_year: {
        blok: input.blok,
        year: input.year,
      },
    },
    update: {
      amount: input.amount,
      notes: input.notes,
    },
    create: {
      blok: input.blok,
      year: input.year,
      amount: input.amount,
      notes: input.notes,
    },
  })

  revalidatePath('/dashboard/finance/saldo-awal')
  return { success: true, message: 'Saldo awal berhasil disimpan' }
}
