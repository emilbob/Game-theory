import { describe, it, expect } from 'vitest'
import {
  payoff,
  payoutFor,
  resolveRound,
  getBot,
  consistentBots,
  BOTS,
  type Move,
  type Role,
} from './game'

describe('payoff matrix', () => {
  it('only scores on a match (the diagonal)', () => {
    const moves: Move[] = ['X', 'Y', 'Z']
    for (const a of moves)
      for (const b of moves)
        if (a !== b) expect(payoff(a, b)).toEqual([0, 0])
  })

  it('splits the same 200-point pie on every match', () => {
    for (const m of ['X', 'Y', 'Z'] as Move[]) {
      const [a, b] = payoff(m, m)
      expect(a + b).toBe(200)
    }
  })

  it('X favours A, Y favours B, Z is even', () => {
    expect(payoff('X', 'X')).toEqual([150, 50])
    expect(payoff('Y', 'Y')).toEqual([50, 150])
    expect(payoff('Z', 'Z')).toEqual([100, 100])
  })

  it('payoutFor reads the right side of the pie per role', () => {
    expect(payoutFor('A', 'X')).toBe(150)
    expect(payoutFor('B', 'X')).toBe(50)
    expect(payoutFor('A', 'Z')).toBe(100)
    expect(payoutFor('B', 'Y')).toBe(150)
  })
})

describe('resolveRound role mapping', () => {
  it('credits the human correctly when they are Player A', () => {
    const r = resolveRound('Z', 'Z', 'A', 1)
    expect(r).toMatchObject({ youGain: 100, oppGain: 100, matched: true })
  })

  it('credits the human correctly when they are Player B', () => {
    // Match on X favours A — so as Player B you only collect the small half.
    const r = resolveRound('X', 'X', 'B', 1)
    expect(r).toMatchObject({ you: 'X', bot: 'X', youGain: 50, oppGain: 150, matched: true })
  })

  it('a miss scores nothing for either side', () => {
    const r = resolveRound('X', 'Y', 'A', 1)
    expect(r).toMatchObject({ youGain: 0, oppGain: 0, matched: false })
  })
})

describe('bot strategies', () => {
  const ctx = (myRole: Role, history: { opp: Move }[] = []) => ({
    round: history.length + 1,
    myRole,
    history,
  })

  it('Pax always offers the fair Z', () => {
    const pax = getBot('fair')
    expect(pax.fn(ctx('A'))).toBe('Z')
    expect(pax.fn(ctx('B', [{ opp: 'X' }]))).toBe('Z')
  })

  it('Midas always demands its own best letter', () => {
    const midas = getBot('greedy')
    expect(midas.fn(ctx('A'))).toBe('X')
    expect(midas.fn(ctx('B'))).toBe('Y')
  })

  it('Echo opens with its letter then copies the human', () => {
    const echo = getBot('mirror')
    expect(echo.fn(ctx('A'))).toBe('X') // round 1: its own letter
    expect(echo.fn(ctx('A', [{ opp: 'Z' }]))).toBe('Z') // then mirrors last human move
    expect(echo.fn(ctx('A', [{ opp: 'Y' }]))).toBe('Y')
  })

  it('Solomon concedes only after three identical demands', () => {
    const sol = getBot('generous')
    expect(sol.fn(ctx('B', [{ opp: 'X' }, { opp: 'X' }]))).toBe('Z') // not yet
    expect(sol.fn(ctx('B', [{ opp: 'X' }, { opp: 'X' }, { opp: 'X' }]))).toBe('X') // gives in
    // A repeated Z demand is not a "demand" to concede to.
    expect(sol.fn(ctx('B', [{ opp: 'Z' }, { opp: 'Z' }, { opp: 'Z' }]))).toBe('Z')
  })

  it('Dice only ever returns a legal move', () => {
    const dice = getBot('random')
    for (let i = 0; i < 50; i++) expect(['X', 'Y', 'Z']).toContain(dice.fn(ctx('A')))
  })
})

describe('Talion ↔ Rust MyStrategy parity', () => {
  it('reproduces the Rust move sequence against a relentless grabber', () => {
    // Rust `MyStrategy` vs an opponent that always plays X yields: Z, Z, X, X, Y
    // (open fair, turn the cheek once, then retaliate and alternate).
    const talion = getBot('talion')
    const history: { opp: Move }[] = []
    const seq: Move[] = []
    for (let r = 1; r <= 5; r++) {
      seq.push(talion.fn({ round: r, myRole: 'B', history: [...history] }))
      history.push({ opp: 'X' })
    }
    expect(seq).toEqual(['Z', 'Z', 'X', 'X', 'Y'])
  })

  it('keeps cooperating against a fair opponent', () => {
    const talion = getBot('talion')
    const history: { opp: Move }[] = []
    for (let r = 1; r <= 6; r++) {
      expect(talion.fn({ round: r, myRole: 'A', history: [...history] })).toBe('Z')
      history.push({ opp: 'Z' })
    }
  })
})

describe('consistentBots (suspect elimination)', () => {
  it('keeps strategies that fit and drops those that do not', () => {
    // Observed: the bot played Z both rounds while the human pushed X.
    const rounds = [
      { you: 'X' as Move, bot: 'Z' as Move },
      { you: 'X' as Move, bot: 'Z' as Move },
    ]
    const keys = new Set(consistentBots(rounds, 'A').map((b) => b.key))
    expect(keys.has('fair')).toBe(true) // always-Z fits
    expect(keys.has('greedy')).toBe(false) // would have demanded Y
    expect(keys.has('mirror')).toBe(false) // would have opened with its own letter
  })

  it('can never rule out the random bot', () => {
    const rounds = [{ you: 'X' as Move, bot: 'X' as Move }]
    const keys = new Set(consistentBots(rounds, 'A').map((b) => b.key))
    expect(keys.has('random')).toBe(true)
  })

  it('with no rounds observed, every strategy is still a suspect', () => {
    expect(consistentBots([], 'A')).toHaveLength(BOTS.length)
  })
})
