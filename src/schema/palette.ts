import { z } from 'zod'

const basicVariableSchema = z.object({
  id: z.string(),
  name: z.string(),
  identifier: z.string().startsWith('--', 'Please enter a valid css variable identifier!'),
})
export const variableSchema = z.discriminatedUnion('type', [
  basicVariableSchema.extend({
    type: z.literal('color'),
    value: z.string(),
  }),
  basicVariableSchema.extend({
    type: z.literal('number'),
    value: z.number(),
    unit: z.string().optional(),
  }),
])
export const variablesSchema = z.array(variableSchema)

export type Variable = z.infer<typeof variableSchema>
export type VariableType = Variable['type']
export type GetVariableByType<T extends VariableType> = Extract<Variable, { type: T }>
