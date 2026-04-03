'use server'

import { db, prisma } from '@/lib/db'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validations/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export type ActionResult<T = void> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const validation = registerSchema.safeParse(input)
  
  if (!validation.success) {
    return {
      success: false,
      message: 'Validasi gagal',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // Check if NIK already exists
  const existingNIK = await db.profile.findUnique({
    where: { nik: input.nik },
  })

  if (existingNIK) {
    return {
      success: false,
      message: 'NIK sudah terdaftar',
      errors: { nik: ['NIK sudah terdaftar dalam sistem'] },
    }
  }

  // Check if email already exists
  const existingEmail = await db.user.findUnique({
    where: { email: input.email },
  })

  if (existingEmail) {
    return {
      success: false,
      message: 'Email sudah terdaftar',
      errors: { email: ['Email sudah terdaftar dalam sistem'] },
    }
  }

  try {
    // Create user with hashed password
    const hashedPassword = await bcrypt.hash(input.password, 10)
    
    const user = await db.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.namaLengkap,
      },
    })

    // Create profile
    await db.profile.create({
      data: {
        userId: user.id,
        namaLengkap: input.namaLengkap,
        nik: input.nik,
        email: input.email,
        noTelepon: input.noTelepon,
        blok: input.blok,
        nomorRumah: input.nomorRumah,
        role: 'WARGA',
        status: 'PENDINGAPPROVAL',
        jabatan: 'Warga',
      },
    })

    revalidatePath('/login')
    return { success: true, message: 'Pendaftaran berhasil. Silakan tunggu persetujuan admin.' }
  } catch (error) {
    console.error('Register error:', error)
    return { success: false, message: 'Gagal membuat akun. Silakan coba lagi.' }
  }
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { email },
  })
  return !!user
}

export async function checkNIKExists(nik: string): Promise<boolean> {
  const profile = await db.profile.findUnique({
    where: { nik },
  })
  return !!profile
}
