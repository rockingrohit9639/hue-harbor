import { z } from 'zod'

export const createApiKeyInput = z.object({
  name: z.string(),
})
export type CreateApiKeyInput = z.infer<typeof createApiKeyInput>
