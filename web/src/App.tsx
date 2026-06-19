import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BOTS,
  getBot,
  resolveRound,
  GUESS_BONUS,
  type Move,
  type Role,
  type RoundResult,
} from './game'
import Setup from './components/Setup'
import Board from './components/Board'
import Guess from './components/Guess'
import Final from './components/Final'

type Phase = 'setup' | 'playing' | 'guess' | 'final'

export default function App() {
  // setup choices
  const [rounds, setRounds] = useState(15)
  const [roleChoice, setRoleChoice] = useState<'random' | 'A' | 'B'>('random')

  // game state
  const [phase, setPhase] = useState<Phase>('setup')
  // The opponent is secretly chosen at random each game and hidden until the end.
  const [botKey, setBotKey] = useState(BOTS[0].key)
  const [role, setRole] = useState<Role>('A')
  const [round, setRound] = useState(1)
  const [youScore, setYouScore] = useState(0)
  const [oppScore, setOppScore] = useState(0)
  const [log, setLog] = useState<RoundResult[]>([])
  const [last, setLast] = useState<RoundResult | null>(null)
  const [busy, setBusy] = useState(false)
  // end-game deduction
  const [guessKey, setGuessKey] = useState<string | null>(null)
  const [bonus, setBonus] = useState(0)

  const bot = getBot(botKey)
  // Keep a live ref of the human-move history for the bot's decisions.
  const historyRef = useRef<{ opp: Move }[]>([])

  const start = useCallback(() => {
    // Secretly assign a random opponent — the player must figure it out.
    setBotKey(BOTS[Math.floor(Math.random() * BOTS.length)].key)
    const r: Role = roleChoice === 'random' ? (Math.random() < 0.5 ? 'A' : 'B') : roleChoice
    setRole(r)
    setRound(1)
    setYouScore(0)
    setOppScore(0)
    setLog([])
    setLast(null)
    setBusy(false)
    setGuessKey(null)
    setBonus(0)
    historyRef.current = []
    setPhase('playing')
  }, [roleChoice])

  // Lock in the player's guess, award the bonus if correct, then reveal.
  const submitGuess = useCallback(
    (key: string) => {
      const correct = key === botKey
      const award = correct ? GUESS_BONUS : 0
      setGuessKey(key)
      // Kept separate from youScore: the matchup verdict is decided by coordination
      // points alone; the bonus is a detective reward shown on its own.
      setBonus(award)
      setPhase('final')
    },
    [botKey],
  )

  const play = useCallback(
    (human: Move) => {
      if (busy || phase !== 'playing') return
      setBusy(true)

      const botMove = bot.fn({
        round,
        myRole: role === 'A' ? 'B' : 'A',
        history: historyRef.current,
      })
      const result = resolveRound(human, botMove, role, round)
      historyRef.current = [...historyRef.current, { opp: human }]

      setYouScore((s) => s + result.youGain)
      setOppScore((s) => s + result.oppGain)
      setLast(result)
      setLog((l) => [result, ...l])

      const isLast = round >= rounds
      window.setTimeout(() => {
        if (isLast) {
          setPhase('guess')
        } else {
          setRound((n) => n + 1)
          setBusy(false)
        }
      }, isLast ? 700 : 550)
    },
    [busy, phase, bot, round, role, rounds],
  )

  // keyboard support: X / Y / Z
  useEffect(() => {
    if (phase !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase()
      if (k === 'X' || k === 'Y' || k === 'Z') play(k as Move)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, play])

  return (
    <div className="app">
      <div className="masthead">
        <div className="kicker">Game Theory · Battle of the Sexes</div>
        <h1>The Standoff</h1>
        <div className="sub">
          You and a <b>mystery rival</b> both pick <b>X</b>, <b>Y</b>, or <b>Z</b> at the same
          time — you only score when you <b>match</b>, but you each want a <b>different</b> letter
          to win. The fair <b>Z</b> (100 each) is the safe play; gambling for your <b>150</b> risks
          a 0/0 standoff. Read their play, figure them out!
        </div>
      </div>

      {phase === 'setup' && (
        <Setup
          rounds={rounds}
          setRounds={setRounds}
          role={roleChoice}
          setRole={setRoleChoice}
          onStart={start}
        />
      )}

      {phase === 'playing' && (
        <Board
          round={round}
          rounds={rounds}
          role={role}
          oppName="Opponent"
          youScore={youScore}
          oppScore={oppScore}
          last={last}
          log={log}
          busy={busy}
          onPlay={play}
          onQuit={() => setPhase('setup')}
        />
      )}

      {phase === 'guess' && (
        <Guess log={log} role={role} onGuess={submitGuess} />
      )}

      {phase === 'final' && (
        <Final
          oppName={bot.name}
          oppDesc={bot.desc}
          role={role}
          youScore={youScore}
          oppScore={oppScore}
          log={log}
          guessName={guessKey ? getBot(guessKey).name : null}
          guessCorrect={guessKey === botKey}
          bonus={bonus}
          onAgain={() => setPhase('setup')}
        />
      )}

      <div className="footer">
        A <b>battle-of-the-sexes</b> game — every match splits the same 200-point pie. Z divides
        it fairly (100/100); X favours Player A and Y favours Player B with a lopsided 150/50.
        A miss destroys the pie (0/0), so Z is the safe default — push for the 150 only when you
        can read your rival and steer them your way.
      </div>
    </div>
  )
}
