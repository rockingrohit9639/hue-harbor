'use client'

import { useState } from 'react'
import ColorPicker from '~/components/color-picker'
import Container from '~/components/ui/container'
import { ColorPickerValue } from '~/types/color-picker'

export default function Home() {
  const [color, setColor] = useState<ColorPickerValue>({
    type: 'color',
    color: '#000000',
    opacity: 100,
  })

  return (
    <Container
      className="flex min-h-screen flex-col items-center justify-center"
      style={{
        backgroundColor: color.type === 'color' ? color.color : undefined,
      }}
    >
      <ColorPicker value={color} onChange={setColor} />
    </Container>
  )
}
