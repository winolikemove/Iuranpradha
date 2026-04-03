import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  nik: z.string().length(16, 'NIK harus 16 digit'),
  email: z.string().email('Email tidak valid'),
  noTelepon: z.string().min(10, 'Nomor telepon minimal 10 digit').regex(/^[0-9]+$/, 'Nomor telepon hanya angka'),
  blok: z.enum(['A', 'B'], { required_error: 'Pilih blok' }),
  nomorRumah: z.string().min(1, 'Nomor rumah wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
})

export const profileUpdateSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  noTelepon: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  fotoProfil: z.string().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Password minimal 6 karakter'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
