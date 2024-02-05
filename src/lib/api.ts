import { db } from '~/server/db'

export async function validateUserWithApi(apiKey: string) {
  const key = await db.apiKey.findFirst({ where: { value: apiKey }, include: { createdBy: true } })
  if (!key) {
    return null
  }

  await db.apiKey.update({
    where: { id: key.id },
    data: { usage: { increment: 1 } },
  })

  return key.createdBy
}
