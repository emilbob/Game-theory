import type { Role, RoundResult } from '../game'

interface Props {
  oppName: string
  oppDesc: string
  role: Role
  youScore: number
  oppScore: number
  log: RoundResult[]
  guessName: string | null
  guessCorrect: boolean
  bonus: number
  onAgain: () => void
}

export default function Final({
  oppName,
  oppDesc,
  role,
  youScore,
  oppScore,
  log,
  guessName,
  guessCorrect,
  bonus,
  onAgain,
}: Props) {
  const win = youScore > oppScore
  const lose = youScore < oppScore
  const verdict = win ? '🏆 You Win!' : lose ? 'You Lose 😤' : '🤝 Tie!'
  const cls = win ? 'win' : lose ? 'lose' : 'tie'
  const coordRate = log.length
    ? Math.round((100 * log.filter((r) => r.matched).length) / log.length)
    : 0

  return (
    <div className="panel final">
      <div className="lbl-head">Game over</div>
      <div className={'verdict ' + cls}>{verdict}</div>
      <div className="sub" style={{ marginTop: -2 }}>
        The matchup is decided on <b>coordination points</b> alone.
      </div>

      <div className="reveal">
        <div className="reveal-tag">Your rival was…</div>
        <div className="reveal-name">{oppName}</div>
        <div className="reveal-desc">{oppDesc}</div>
      </div>

      <div className="scoreboard" style={{ marginTop: 18 }}>
        <div className="score you">
          <div className="who">You</div>
          <div className="pts">{youScore}</div>
        </div>
        <div className="score opp">
          <div className="who">{oppName}</div>
          <div className="pts">{oppScore}</div>
        </div>
      </div>

      {guessName && (
        <div className={'deduction ' + (guessCorrect ? 'right' : 'wrong')}>
          {guessCorrect ? (
            <>🔍 You called it — {guessName}. <b>+{bonus}</b> detective bonus!</>
          ) : (
            <>🔍 You guessed {guessName} — wrong. No detective bonus.</>
          )}
        </div>
      )}

      <div className="total">
        Your haul: <b>{youScore}</b> coordination
        {bonus > 0 && <> + <b>{bonus}</b> detective</>} ={' '}
        <b>{youScore + bonus}</b> pts
      </div>

      <div className="sub" style={{ marginTop: 14 }}>
        You matched on <b>{coordRate}%</b> of rounds, as Player {role}.
      </div>

      <button className="btn" onClick={onAgain}>
        ▶ Play Again
      </button>
    </div>
  )
}
