import { z } from 'zod'

const basicVariableSchema = z.object({
  id: z.string(),
  name: z.string(),
  identifier: z.string(),
})
export const variableSchema = z.discriminatedUnion('type', [
  basicVariableSchema.extend({
    type: z.literal('color'),
    value: z.string(),
  }),
  basicVariableSchema.extend({
    type: z.literal('number'),
    value: z.number(),
  }),
])

export type Variable = z.infer<typeof variableSchema>
export type VariableType = Variable['type']
