'use server'

import { db, prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Role, UserStatus, Blok } from '@prisma/client'

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

// Approve a pending user
export async function approveUserAction(profileId: string, currentUser: CurrentUser): Promise<ActionResult> {
  if (!['SUPERADMIN', 'ADMINBLOK'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const profile = await db.profile.findUnique({
    where: { id: profileId },
  })

  if (!profile) {
    return { success: false, message: 'Profil tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, profile.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  if (profile.status !== 'PENDINGAPPROVAL') {
    return { success: false, message: 'Status user bukan pending approval' }
  }

  await db.profile.update({
    where: { id: profileId },
    data: {
      status: 'ACTIVE',
      approvedAt: new Date(),
      approvedBy: currentUser.id,
    },
  })

  revalidatePath('/dashboard/pendaftaran')
  return { success: true, message: 'User berhasil disetujui' }
}

// Reject a pending user
export async function rejectUserAction(profileId: string, reason: string | undefined, currentUser: CurrentUser): Promise<ActionResult> {
  if (!['SUPERADMIN', 'ADMINBLOK'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const profile = await db.profile.findUnique({
    where: { id: profileId },
  })

  if (!profile) {
    return { success: false, message: 'Profil tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, profile.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  if (profile.status !== 'PENDINGAPPROVAL') {
    return { success: false, message: 'Status user bukan pending approval' }
  }

  await db.profile.update({
    where: { id: profileId },
    data: {
      status: 'REJECTED',
      rejectedAt: new Date(),
      rejectReason: reason,
    },
  })

  revalidatePath('/dashboard/pendaftaran')
  return { success: true, message: 'User berhasil ditolak' }
}

// Update user role
export async function updateProfileRoleAction(
  profileId: string,
  role: Role,
  jabatan: string,
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (!['SUPERADMIN', 'ADMINBLOK'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const profile = await db.profile.findUnique({
    where: { id: profileId },
  })

  if (!profile) {
    return { success: false, message: 'Profil tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, profile.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  // Only SUPERADMIN can assign SUPERADMIN role
  if (role === 'SUPERADMIN' && currentUser.role !== 'SUPERADMIN') {
    return { success: false, message: 'Hanya Super Admin yang dapat menetapkan role Super Admin' }
  }

  await db.profile.update({
    where: { id: profileId },
    data: { role, jabatan },
  })

  revalidatePath('/dashboard/warga')
  return { success: true, message: 'Role berhasil diperbarui' }
}

// Toggle signatory status
export async function toggleSignatoryAction(profileId: string, currentUser: CurrentUser): Promise<ActionResult> {
  if (!['SUPERADMIN', 'ADMINBLOK'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const profile = await db.profile.findUnique({
    where: { id: profileId },
  })

  if (!profile) {
    return { success: false, message: 'Profil tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, profile.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  await db.profile.update({
    where: { id: profileId },
    data: { isSignatory: !profile.isSignatory },
  })

  revalidatePath('/dashboard/warga')
  return { success: true, message: 'Status penanda tangan berhasil diperbarui' }
}

// Get pending users
export async function getPendingUsersAction(currentUser: CurrentUser, blok?: Blok) {
  if (!['SUPERADMIN', 'ADMINBLOK'].includes(currentUser.role)) {
    return []
  }

  const where: any = {
    status: 'PENDINGAPPROVAL',
  }

  // Filter by blok unless superadmin
  if (currentUser.role !== 'SUPERADMIN') {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return db.profile.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

// Get all warga (active users)
export async function getWargaListAction(currentUser: CurrentUser, blok?: Blok) {
  if (!['SUPERADMIN', 'ADMINBLOK', 'BENDAHARA', 'KETUART'].includes(currentUser.role)) {
    return []
  }

  const where: any = {
    status: 'ACTIVE',
  }

  if (currentUser.role !== 'SUPERADMIN') {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return db.profile.findMany({
    where,
    orderBy: [
      { role: 'asc' },
      { namaLengkap: 'asc' },
    ],
  })
}

// Get pengurus (officers) for a blok
export async function getPengurusAction(blok: Blok) {
  return db.profile.findMany({
    where: {
      blok,
      status: 'ACTIVE',
      role: {
        in: ['KETUART', 'ADMINBLOK', 'BENDAHARA'],
      },
    },
    orderBy: {
      role: 'asc',
    },
  })
}

// Get profile by ID
export async function getProfileByIdAction(profileId: string) {
  return db.profile.findUnique({
    where: { id: profileId },
  })
}

// Update own profile
export async function updateOwnProfileAction(
  profileId: string,
  data: { namaLengkap?: string; noTelepon?: string; fotoProfil?: string },
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (currentUser.id !== profileId) {
    return { success: false, message: 'Anda hanya dapat mengubah profil sendiri' }
  }

  await db.profile.update({
    where: { id: profileId },
    data,
  })

  revalidatePath('/dashboard')
  return { success: true, message: 'Profil berhasil diperbarui' }
}
