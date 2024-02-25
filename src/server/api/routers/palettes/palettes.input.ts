import { PaletteVisibility } from '@prisma/client'
import { z } from 'zod'
import { SLUG_REGEX } from '~/lib/constants'
import { themesSchema, variableSchema } from '~/schema/palette'

export const createPaletteInput = z.object({
  name: z
    .string({ required_error: 'Please enter name for your palette' })
    .min(4, 'Please enter at least 4 characters!')
    .max(100, 'Please enter at most 100 characters!'),
  visibility: z.nativeEnum(PaletteVisibility).default('PRIVATE').optional(),
  backgroundColor: z.string().optional(),
  slug: z.string().regex(SLUG_REGEX, 'Please enter a valid slug!'),
})

export type CreatePaletteInput = z.infer<typeof createPaletteInput>

export const updatePaletteInput = createPaletteInput
  .omit({ slug: true })
  .partial()
  .extend({
    id: z.string(),
    variables: z.array(variableSchema),
    themes: themesSchema,
  })
  .superRefine(({ themes }, ctx) => {
    const uniqThemeIdentifiers = new Set([...themes.map((t) => t.identifier)])
    if (uniqThemeIdentifiers.size !== themes.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'All theme identifiers must be unique in a palette!',
        path: ['themes'],
      })
    }
  })

export type UpdatePaletteInput = z.infer<typeof updatePaletteInput>
