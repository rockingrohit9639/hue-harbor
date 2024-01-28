import { z } from 'zod'

export const createWebsiteInput = z.object({
  name: z.string().min(5).max(100),
  description: z.string().optional(),
  url: z.string().min(1).url(),
})

export type CreateWebsiteInput = z.infer<typeof createWebsiteInput>

export const updateWebsiteInput = createWebsiteInput.partial().extend({ id: z.string() })
export type UpdateWebsiteInput = z.infer<typeof updateWebsiteInput>
