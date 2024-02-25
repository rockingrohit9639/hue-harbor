/* eslint-disable no-console */
import chalk from 'chalk'
import { nanoid } from 'nanoid'
import { variablesSchema } from '~/schema/palette'
import { db } from '~/server/db'

const DEFAULT_THEME = {
  id: nanoid(),
  name: 'Default',
  identifier: ':root',
}

export default async function seedDefaultTheme() {
  console.log(chalk.green('*** Starting seed theme script ***'))

  const palettes = await db.palette.findMany()
  const paletteWithoutThemes = palettes.filter((palette) => palette.themes.length === 0)

  if (paletteWithoutThemes.length === 0) return

  console.log(chalk.blue(`*** Found total ${paletteWithoutThemes.length} palettes without themes **`))

  let seededPalettes = 1
  for (const palette of paletteWithoutThemes) {
    const result = variablesSchema.safeParse(palette.variables)

    if (result.success) {
      try {
        const variablesWithTheme = result.data.map((variable) => ({ ...variable, theme: DEFAULT_THEME.id }))

        await db.palette.update({
          where: { id: palette.id },
          data: {
            themes: [DEFAULT_THEME],
            variables: variablesWithTheme,
          },
        })

        console.log(
          chalk.green(
            `*** [${seededPalettes}/${paletteWithoutThemes.length}] Seeded theme in palette - ${palette.id} ***`,
          ),
        )
        seededPalettes += 1
      } catch {
        console.log(chalk.red(`Something went wrong while seeding data for palette - ${palette.id}`))
      }
    }
  }

  console.log(palettes)
}
