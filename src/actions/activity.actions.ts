'use server'

import { db, prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Blok } from '@prisma/client'
import { activitySchema } from '@/lib/validations/activity'

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

// Get activities for user's blok + general activities
export async function getActivitiesAction(currentUser: CurrentUser, blok?: Blok, limit?: number) {
  const where: any = {
    OR: [
      { blok: null }, // General activities
      { blok: currentUser.role === 'SUPERADMIN' ? blok : currentUser.blok },
    ],
  }

  // If superadmin and no blok filter, show all
  if (currentUser.role === 'SUPERADMIN' && !blok) {
    delete where.OR
  }

  const activities = await db.activity.findMany({
    where,
    include: {
      author: {
        select: {
          namaLengkap: true,
          jabatan: true,
          fotoProfil: true,
        },
      },
    },
    orderBy: [
      { isPinned: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
  })

  return activities
}

// Get single activity by ID
export async function getActivityByIdAction(id: string) {
  return db.activity.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          namaLengkap: true,
          jabatan: true,
          fotoProfil: true,
        },
      },
    },
  })
}

// Create a new activity
export async function createActivityAction(
  input: {
    title: string
    content: string
    imageUrl?: string
    blok?: Blok | null
    isPinned?: boolean
  },
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (!['SUPERADMIN', 'ADMINBLOK', 'KETUART'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const validation = activitySchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: 'Data tidak valid' }
  }

  // Non-superadmin can only create for their own blok or general
  let activityBlok = input.blok
  if (currentUser.role !== 'SUPERADMIN') {
    if (input.blok && input.blok !== currentUser.blok) {
      return { success: false, message: 'Anda hanya dapat membuat kegiatan untuk blok Anda' }
    }
    // Set to user's blok if not specified
    if (input.blok === undefined) {
      activityBlok = currentUser.blok as Blok
    }
  }

  await db.activity.create({
    data: {
      title: input.title,
      content: input.content,
      imageUrl: input.imageUrl,
      blok: activityBlok,
      authorId: currentUser.id,
      isPinned: input.isPinned || false,
    },
  })

  revalidatePath('/dashboard/kegiatan')
  revalidatePath('/dashboard')
  return { success: true, message: 'Kegiatan berhasil ditambahkan' }
}

// Update an activity
export async function updateActivityAction(
  id: string,
  input: {
    title?: string
    content?: string
    imageUrl?: string
    isPinned?: boolean
  },
  currentUser: CurrentUser
): Promise<ActionResult> {
  if (!['SUPERADMIN', 'ADMINBLOK', 'KETUART'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const activity = await db.activity.findUnique({
    where: { id },
  })

  if (!activity) {
    return { success: false, message: 'Kegiatan tidak ditemukan' }
  }

  // Non-superadmin can only edit their blok's activities
  if (currentUser.role !== 'SUPERADMIN' && activity.blok && activity.blok !== currentUser.blok) {
    return { success: false, message: 'Akses ditolak' }
  }

  await db.activity.update({
    where: { id },
    data: input,
  })

  revalidatePath('/dashboard/kegiatan')
  revalidatePath('/dashboard')
  return { success: true, message: 'Kegiatan berhasil diperbarui' }
}

// Delete an activity
export async function deleteActivityAction(id: string, currentUser: CurrentUser): Promise<ActionResult> {
  if (!['SUPERADMIN', 'ADMINBLOK', 'KETUART'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const activity = await db.activity.findUnique({
    where: { id },
  })

  if (!activity) {
    return { success: false, message: 'Kegiatan tidak ditemukan' }
  }

  if (currentUser.role !== 'SUPERADMIN' && activity.blok && activity.blok !== currentUser.blok) {
    return { success: false, message: 'Akses ditolak' }
  }

  await db.activity.delete({
    where: { id },
  })

  revalidatePath('/dashboard/kegiatan')
  revalidatePath('/dashboard')
  return { success: true, message: 'Kegiatan berhasil dihapus' }
}

// Toggle pin status
export async function toggleActivityPinAction(id: string, currentUser: CurrentUser): Promise<ActionResult> {
  if (!['SUPERADMIN', 'ADMINBLOK', 'KETUART'].includes(currentUser.role)) {
    return { success: false, message: 'Anda tidak memiliki akses' }
  }

  const activity = await db.activity.findUnique({
    where: { id },
  })

  if (!activity) {
    return { success: false, message: 'Kegiatan tidak ditemukan' }
  }

  if (currentUser.role !== 'SUPERADMIN' && activity.blok && activity.blok !== currentUser.blok) {
    return { success: false, message: 'Akses ditolak' }
  }

  await db.activity.update({
    where: { id },
    data: { isPinned: !activity.isPinned },
  })

  revalidatePath('/dashboard/kegiatan')
  revalidatePath('/dashboard')
  return { success: true, message: activity.isPinned ? 'Kegiatan dilepas dari pin' : 'Kegiatan disematkan' }
}
