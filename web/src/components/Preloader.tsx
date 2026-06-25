import { useEffect, useRef, useState } from 'react'

const LETTERS = ['X', 'Y', 'Z'] as const
type Letter = (typeof LETTERS)[number]

const PHASES = ['Shuffling suspects', 'Dealing the standoff', 'Reading your rival', 'Splitting the pie']

/**
 * Thematic loading screen: two players face off, slot-machine through X/Y/Z,
 * then snap into a coordinated Z "match" as the bar fills — the game in miniature.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [you, setYou] = useState<Letter>('X')
  const [rival, setRival] = useState<Letter>('Y')
  const [locked, setLocked] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const DURATION = reduce ? 600 : 1900

    let raf = 0
    const timers: number[] = []
    const start = performance.now()

    // Slot-machine flicker — both players hunt for a move.
    const flick = reduce
      ? 0
      : window.setInterval(() => {
          setYou(LETTERS[Math.floor(Math.random() * 3)])
          setRival(LETTERS[Math.floor(Math.random() * 3)])
        }, 85)

    const finish = () => {
      if (flick) window.clearInterval(flick)
      // They coordinate on the fair Z — the safe default.
      setYou('Z')
      setRival('Z')
      setLocked(true)
      timers.push(window.setTimeout(() => setLeaving(true), 640))
      timers.push(window.setTimeout(() => doneRef.current(), 1140))
    }

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out
      setPct(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      if (flick) window.clearInterval(flick)
      timers.forEach(window.clearTimeout)
    }
  }, [])

  const phase = locked ? 'Match — game on' : PHASES[Math.min(PHASES.length - 1, Math.floor((pct / 100) * PHASES.length))]

  return (
    <div className={`preload${leaving ? ' leaving' : ''}`} role="status" aria-live="polite" aria-label="Loading The Standoff">
      <div className="pl-inner">
        <div className="kicker">Game Theory · Battle of the Sexes</div>
        <h1 className="pl-title">The Standoff</h1>

        <div className="pl-stage">
          <div className={`pl-card you${locked ? ' lock' : ''}`}>
            <span className="pl-who">You</span>
            <span className="pl-ltr">{you}</span>
          </div>
          <div className="pl-vs">{locked ? '=' : 'vs'}</div>
          <div className={`pl-card rival${locked ? ' lock' : ''}`}>
            <span className="pl-who">Rival</span>
            <span className="pl-ltr">{rival}</span>
          </div>
          {locked && <div className="pl-stamp">Match</div>}
        </div>

        <div className="pl-bar">
          <div className="pl-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="pl-status">
          <span>{phase}…</span>
          <b>{pct}%</b>
        </div>
      </div>
    </div>
  )
}
