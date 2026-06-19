import { MOVES, payoutFor, type Move, type Role, type RoundResult } from '../game'
import Suspects from './Suspects'

interface Props {
  round: number
  rounds: number
  role: Role
  oppName: string
  youScore: number
  oppScore: number
  last: RoundResult | null
  log: RoundResult[]
  busy: boolean
  onPlay: (m: Move) => void
  onQuit: () => void
}

export default function Board({
  round,
  rounds,
  role,
  oppName,
  youScore,
  oppScore,
  last,
  log,
  busy,
  onPlay,
  onQuit,
}: Props) {
  return (
    <div className="panel">
      <div className="topbar">
        <span className="pill">
          Round <b>{round}</b> / {rounds}
        </span>
        <span className="pill alt">
          You are <span className="role">Player {role}</span> · vs <span className="role">???</span>
        </span>
      </div>

      <div className="scoreboard">
        <div className="score you">
          <div className="who">You</div>
          <div className="pts">{youScore}</div>
        </div>
        <div className="score opp">
          <div className="who">{oppName} <span className="mask">?</span></div>
          <div className="pts">{oppScore}</div>
        </div>
      </div>

      <div className="lbl-head">Make your pick!</div>
      <div className="moves">
        {MOVES.map((m) => {
          const gain = payoutFor(role, m)
          const fav = gain === 150 ? ' fav' : ''
          const cls = last
            ? last.you === m && last.matched
              ? ' win'
              : last.you === m && !last.matched
                ? ' lose'
                : ''
            : ''
          return (
            <button
              key={m}
              className={'move' + fav + cls}
              disabled={busy}
              onClick={() => onPlay(m)}
            >
              {fav && <span className="fav-tag">YOUR LETTER</span>}
              <span className="ltr">{m}</span>
              <span className="gain">+{gain}</span>
            </button>
          )
        })}
      </div>

      <div className="readout">
        {!last ? (
          <div className="banner idle">Pick a move to begin…</div>
        ) : last.matched ? (
          <div className="banner match">
            ★ Match on {last.you}!
            <small>
              You +{last.youGain} · {oppName} +{last.oppGain}
            </small>
          </div>
        ) : (
          <div className="banner miss">
            ✕ Miss!
            <small>
              You {last.you} · {oppName} {last.bot} · nobody scores
            </small>
          </div>
        )}
      </div>

      <div className="log">
        {log.map((r) => (
          <div className={'log-row' + (r.matched ? ' match' : '')} key={r.round}>
            <span><span className="ix">R{r.round}</span> &nbsp;you {r.you} vs {r.bot}</span>
            <span>+{r.youGain} / +{r.oppGain}</span>
          </div>
        ))}
      </div>

      {log.length > 0 && <Suspects log={log} role={role} />}

      <div style={{ marginTop: 18, textAlign: 'center' }}>
        <button className="btn ghost" onClick={onQuit}>Quit to menu</button>
      </div>
    </div>
  )
}
