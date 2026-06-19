import { BOTS, consistentBots, GUESS_BONUS, type Role, type RoundResult } from '../game'

interface Props {
  log: RoundResult[]
  role: Role
  onGuess: (key: string) => void
}

/**
 * End-game deduction: the player names the rival before the reveal.
 * A correct guess is worth a bonus, so reading the opponent actually pays off.
 * Strategies already ruled out by their play are disabled — you can't pick them.
 */
export default function Guess({ log, role, onGuess }: Props) {
  // log is newest-first; replay needs chronological order.
  const chrono = [...log].reverse().map((r) => ({ you: r.you, bot: r.bot }))
  const possible = new Set(consistentBots(chrono, role).map((b) => b.key))

  return (
    <div className="panel guess">
      <div className="lbl-head">Who were you up against?</div>
      <div className="sub" style={{ marginBottom: 14 }}>
        Name your rival for a <b>+{GUESS_BONUS}</b> bonus. Greyed-out strategies don't fit how
        they played, so they're off the table.
      </div>
      <div className="guess-list">
        {BOTS.map((b) => {
          const out = !possible.has(b.key)
          return (
            <button
              key={b.key}
              className={'suspect guess-pick' + (out ? ' out' : '')}
              disabled={out}
              onClick={() => onGuess(b.key)}
            >
              <b>{b.name}</b>
              <span>{b.desc}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
