import { z } from 'zod'

export const activitySchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  content: z.string().min(10, 'Konten minimal 10 karakter'),
  imageUrl: z.string().optional(),
  blok: z.enum(['A', 'B']).nullable().optional(),
  isPinned: z.boolean().optional(),
})

export type ActivityInput = z.infer<typeof activitySchema>
