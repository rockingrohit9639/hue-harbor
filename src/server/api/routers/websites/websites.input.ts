import { z } from 'zod'

export const createWebsiteInput = z.object({
  name: z
    .string({ required_error: 'Please enter the name of your website' })
    .min(5, 'Please enter at least 5 characters')
    .max(100, 'Please enter at most 100 characters'),
  description: z.string().optional(),
  url: z
    .string({ invalid_type_error: 'Please enter a valid URL' })
    .min(1, 'Please enter the URL')
    .url({ message: 'Please enter a valid URL' }),
})

export type CreateWebsiteInput = z.infer<typeof createWebsiteInput>

export const updateWebsiteInput = createWebsiteInput.partial().extend({ id: z.string() })
export type UpdateWebsiteInput = z.infer<typeof updateWebsiteInput>
