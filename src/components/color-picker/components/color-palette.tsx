'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import invariant from 'tiny-invariant'
import Color from 'color'
import { ColorPickerValue } from '~/types/color-picker'
import { useInteractivePosition } from '~/hooks/use-interactive-position'
import { useEventCallback } from '~/hooks/use-event-callback'

function getXYFromSV(saturation: number, value: number) {
  const x = saturation / 100
  const y = 1 - value / 100
  return { x, y }
}

function getXYFromHue(hue: number) {
  return { x: hue / 360, y: 0 }
}

function getXYFromOpacity(opacity: number) {
  return { x: opacity / 100, y: 0 }
}

export type ColorPaletteProps = {
  value: ColorPickerValue
  onChange: (type: ColorPickerValue) => void
}

export type ColorPaletteMethods = {
  updateColor: (value: ColorPickerValue) => void
}

const ColorPalette = forwardRef<ColorPaletteMethods, ColorPaletteProps>(({ value, onChange }, ref) => {
  invariant(value.type === 'color', 'ColorPalette only supports color type')

  const propColor = Color(value.color)

  const svContainer = useRef<HTMLDivElement | null>(null)
  const { position: svPosition, setPosition: setSVPosition } = useInteractivePosition(
    svContainer,
    getXYFromSV(propColor.saturationv(), propColor.value()),
  )

  const hContainer = useRef<HTMLDivElement | null>(null)
  const { position: hPosition, setPosition: setHPosition } = useInteractivePosition(
    hContainer,
    getXYFromHue(propColor.hue()),
  )

  const oContainer = useRef<HTMLDivElement | null>(null)
  const { position: oPosition, setPosition: setOPosition } = useInteractivePosition(
    oContainer,
    getXYFromOpacity(value.opacity),
  )

  const stateColor = Color.hsv(hPosition.x * 360, svPosition.x * 100, (1 - svPosition.y) * 100)
  const stateColorString = stateColor.hex().toString()
  const opacity = Math.floor(oPosition.x * 100)

  const onChangeCallback = useEventCallback(onChange)

  useEffect(
    function runOnChangeOnHexColorChange() {
      onChangeCallback({ type: 'color', color: stateColorString, opacity })
    },
    [stateColorString, opacity, onChangeCallback],
  )

  useImperativeHandle(
    ref,
    () => ({
      updateColor: (value) => {
        if (value.type !== 'color') {
          return
        }

        const color = Color(value.color)
        setSVPosition(getXYFromSV(color.saturationv(), color.value()))
        setHPosition(getXYFromHue(color.hue()))
        setOPosition(getXYFromOpacity(value.opacity))
      },
    }),
    [setHPosition, setOPosition, setSVPosition],
  )

  return (
    <div className="w-[200px] space-y-2">
      <div
        ref={svContainer}
        className="relative aspect-square w-full select-none border"
        style={{
          backgroundImage: 'linear-gradient(0deg,#000,transparent),linear-gradient(90deg,#fff,hsla(0,0%,100%,0))',
          backgroundColor: `hsl(${stateColor.hue()}, 100%, 50%)`,
        }}
      >
        <div
          className="absolute left-[var(--left)] top-[var(--top)] h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform select-none rounded-full border"
          style={
            {
              '--left': `${svPosition.x * 100}%`,
              '--top': `${svPosition.y * 100}%`,
            } as React.CSSProperties
          }
        >
          <div
            className="h-full w-full rounded-full border-2 border-white bg-current"
            style={{
              color: stateColor.hex().toString(),
            }}
          />
        </div>
      </div>
      <div
        className="relative h-3 w-full select-none"
        style={{
          background:
            'linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)',
        }}
        ref={hContainer}
      >
        <div
          className="absolute left-[var(--left)] top-1/2 aspect-square h-[calc(100%+4px)] -translate-x-1/2 -translate-y-1/2 transform select-none rounded-full border"
          style={
            {
              '--left': `${hPosition.x * 100}%`,
            } as React.CSSProperties
          }
        >
          <div
            className="aspect-square h-full rounded-full border-2 border-white bg-current"
            style={{
              color: `hsl(${hPosition.x * 360}, 100%, 50%)`,
            }}
          />
        </div>
      </div>
      <div
        className="relative h-3 w-full select-none border border-border/50"
        style={{
          background:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center',
        }}
        ref={oContainer}
      >
        <div
          className="absolute inset-0 h-full w-full select-none"
          style={{ background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)' }}
        />
        <div
          className="absolute left-[var(--left)] top-1/2 aspect-square h-[calc(100%+4px)] -translate-x-1/2 -translate-y-1/2 transform select-none rounded-full border bg-background shadow-lg"
          style={
            {
              '--left': `${oPosition.x * 100}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  )
})

ColorPalette.displayName = 'ColorPalette'
export default ColorPalette
