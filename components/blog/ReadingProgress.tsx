'use client'

import { useEffect, useRef } from 'react'

interface ReadingProgressProps {
  /** id of the element whose scroll range drives the bar (the article body) */
  targetId: string
}

/**
 * 3px progress bar pinned directly under the fixed navbar (h-16).
 * Uses a transform (no layout) updated in rAF; origin flips for RTL so the
 * bar fills in the same direction the user reads.
 */
export default function ReadingProgress({ targetId }: ReadingProgressProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const el = document.getElementById(targetId)
      const bar = barRef.current
      if (!el || !bar) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.5
      const done = -rect.top + window.innerHeight * 0.25
      const ratio = total > 0 ? Math.min(1, Math.max(0, done / total)) : 0
      bar.style.transform = `scaleX(${ratio})`
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [targetId])

  return (
    <div
      aria-hidden="true"
      className="fixed top-16 inset-x-0 z-40 h-[3px] bg-transparent pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-purple-primary to-purple-gradient origin-left rtl:origin-right rtl:bg-gradient-to-l will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
