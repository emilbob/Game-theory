import { BOTS, consistentBots, type Role, type RoundResult } from '../game'

interface Props {
  log: RoundResult[]
  role: Role
}

/** Detective panel: shows which strategies still fit the opponent's play. */
export default function Suspects({ log, role }: Props) {
  // log is newest-first; replay needs chronological order.
  const chrono = [...log].reverse().map((r) => ({ you: r.you, bot: r.bot }))
  const possible = new Set(consistentBots(chrono, role).map((b) => b.key))

  // Many strategies open by playing Z, so passive Z-vs-Z play tells them apart slowly.
  // Nudge the player to probe with their favoured letter to force a tell.
  const favoured = role === 'A' ? 'X' : 'Y'

  return (
    <details className="suspects">
      <summary>🔍 Who could it be? — {possible.size} left</summary>
      {possible.size > 1 && (
        <div className="suspect-tip">
          Stuck? Play your favoured letter (<b>{favoured}</b>) instead of Z — copycats and learners
          react differently, which narrows the field fast.
        </div>
      )}
      <div className="suspect-list">
        {BOTS.map((b) => {
          const out = !possible.has(b.key)
          return (
            <div key={b.key} className={'suspect' + (out ? ' out' : '')}>
              <b>{b.name}</b>
              <span>{b.desc}</span>
            </div>
          )
        })}
      </div>
    </details>
  )
}
