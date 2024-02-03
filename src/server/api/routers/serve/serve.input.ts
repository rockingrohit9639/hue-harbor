import { z } from 'zod'
import { SLUG_REGEX } from '~/lib/constants'

export const serveRawInput = z.object({
  paletteSlug: z.string().regex(SLUG_REGEX, 'Invalid palette slug provided'),
})
export type ServeRawInput = z.infer<typeof serveRawInput>
