import { z } from 'zod'

export const createPaletteInput = z.object({
  name: z
    .string({ required_error: 'Please enter name for your palette' })
    .min(4, 'Please enter at least 4 characters!')
    .max(100, 'Please enter at most 100 characters!'),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE').optional(),
  backgroundColor: z.string().optional(),
})

export type CreatePaletteInput = z.infer<typeof createPaletteInput>

export const updatePaletteInput = createPaletteInput
  .partial()
  .extend({
    id: z.string(),
    variables: z
      .array(
        z.object({
          name: z.string({ required_error: 'Please provide a name for your variable' }),
          type: z.enum(['COLOR', 'NUMBER']),
          identifier: z.string({ required_error: 'Please provide an identifier for your variable' }),
        }),
      )
      .default([]),
  })
  .superRefine(({ variables }, ctx) => {
    const uniqVariableIdentifies = new Set([...variables.map((v) => v.identifier)])

    if (uniqVariableIdentifies.size !== variables.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'All variable identifiers must be unique in a palette!',
        path: ['variables'],
      })
    }
  })

export type UpdatePaletteInput = z.infer<typeof updatePaletteInput>
