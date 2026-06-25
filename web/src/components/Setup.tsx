interface Props {
  rounds: number
  setRounds: (n: number) => void
  role: 'random' | 'A' | 'B'
  setRole: (r: 'random' | 'A' | 'B') => void
  onStart: () => void
}

export default function Setup({ rounds, setRounds, role, setRole, onStart }: Props) {
  return (
    <div className="panel">
      <div className="lbl-head">Your mystery rival</div>
      <div className="mystery">
        <div className="mystery-mark">?</div>
        <div className="mystery-copy">
          <b>One of seven secret strategies.</b>
          <span>
            You both need to match — but you each prefer a different letter to win. Their identity
            is hidden until the final whistle. Read their play, steer them toward your letter, then
            name them for a bonus.
          </span>
        </div>
      </div>

      <div className="row">
        <div style={{ flex: 1, minWidth: 200 }}>
          <label className="fld">Rounds</label>
          <select value={rounds} onChange={(e) => setRounds(Number(e.target.value))}>
            <option value={9}>9 rounds</option>
            <option value={15}>15 rounds</option>
            <option value={25}>25 rounds</option>
            <option value={40}>40 rounds</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label className="fld">Your role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Props['role'])}>
            <option value="random">Random — surprise me</option>
            <option value="A">Player A — X pays you 150</option>
            <option value="B">Player B — Y pays you 150</option>
          </select>
        </div>
      </div>

      <details>
        <summary>Payoff table — [you, them]</summary>
        <table className="matrix">
          <tbody>
            <tr><th></th><th>Them X</th><th>Them Y</th><th>Them Z</th></tr>
            <tr><th>You X</th><td>150, 50</td><td>0, 0</td><td>0, 0</td></tr>
            <tr><th>You Y</th><td>0, 0</td><td>50, 150</td><td>0, 0</td></tr>
            <tr><th>You Z</th><td>0, 0</td><td>0, 0</td><td>100, 100</td></tr>
          </tbody>
        </table>
      </details>

      <button className="btn" onClick={onStart}>
        ▶ Play!
      </button>
    </div>
  )
}
