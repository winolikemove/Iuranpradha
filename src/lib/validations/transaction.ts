import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'Pilih kategori'),
  amount: z.number().positive('Nominal harus lebih dari 0'),
  description: z.string().min(3, 'Deskripsi minimal 3 karakter'),
  transactionDate: z.date(),
  evidenceUrl: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z.string().optional(),
})

export const bankAccountSchema = z.object({
  bankName: z.string().min(2, 'Nama bank minimal 2 karakter'),
  accountNumber: z.string().min(5, 'Nomor rekening minimal 5 digit'),
  accountHolder: z.string().min(3, 'Nama pemilik minimal 3 karakter'),
})

export const initialBalanceSchema = z.object({
  year: z.number().min(2020).max(2100),
  amount: z.number().min(0, 'Saldo tidak boleh negatif'),
  notes: z.string().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type BankAccountInput = z.infer<typeof bankAccountSchema>
export type InitialBalanceInput = z.infer<typeof initialBalanceSchema>
