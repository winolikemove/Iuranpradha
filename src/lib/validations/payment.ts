import { z } from 'zod'

export const paymentWizardSchema = z.object({
  // Step 1: Confirm data (just checkbox)
  dataConfirmed: z.boolean().refine(val => val === true, 'Konfirmasi data wajib dicentang'),
  
  // Step 2: Select periods
  periods: z.array(z.object({
    month: z.number().min(1).max(12),
    year: z.number().min(2020).max(2100),
  })).min(1, 'Pilih minimal 1 periode'),
  
  // Step 4: Select bank
  bankAccountId: z.string().min(1, 'Pilih rekening tujuan'),
  
  // Step 5: Upload proof
  evidenceUrl: z.string().min(1, 'Upload bukti transfer'),
})

export const paymentApprovalSchema = z.object({
  submissionId: z.string().min(1, 'ID pembayaran wajib diisi'),
  action: z.enum(['approve', 'reject']),
  rejectReason: z.string().optional(),
}).refine((data) => {
  if (data.action === 'reject' && !data.rejectReason) {
    return false
  }
  return true
}, {
  message: 'Alasan penolakan wajib diisi',
  path: ['rejectReason'],
})

export type PaymentWizardInput = z.infer<typeof paymentWizardSchema>
export type PaymentApprovalInput = z.infer<typeof paymentApprovalSchema>
