import { useEffect, useRef, useState } from 'react'
import { clamp } from '~/lib/color-picker'

type Position = {
  x: number
  y: number
}

export function useInteractivePosition<C extends HTMLElement>(
  containerRef: React.MutableRefObject<C | null>,
  initialValue?: Position,
) {
  const [position, setPosition] = useState(initialValue ?? { x: 0, y: 0 })

  const isDragging = useRef(false)
  const measurement = useRef<DOMRect | null>(null)

  useEffect(
    function addClickHandler() {
      function calculatePosition(event: MouseEvent) {
        if (!measurement.current) return

        const pageX = event.pageX
        const pageY = event.pageY
        const x = clamp(pageX - (measurement.current.left + window.scrollX), 0, measurement.current.width)
        const y = clamp(pageY - (measurement.current.top + window.scrollY), 0, measurement.current.height)
        setPosition({ x: x / measurement.current.width, y: y / measurement.current.height })
      }

      function handleMouseDown(event: MouseEvent) {
        const target = event.target as HTMLElement
        if (target === containerRef.current || containerRef.current?.contains(target)) {
          isDragging.current = true
          measurement.current = containerRef.current?.getBoundingClientRect() ?? null
          calculatePosition(event)
        }
      }

      function handleMouseUp() {
        isDragging.current = false
      }

      function handleMouseMove(event: MouseEvent) {
        if (isDragging.current) {
          calculatePosition(event)
        }
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
          window.removeEventListener('mousedown', handleMouseUp)
          window.removeEventListener('mouseup', handleMouseUp)
          window.removeEventListener('mousemove', handleMouseMove)
        }
      }
    },
    [containerRef, measurement],
  )

  return { position, setPosition }
}
