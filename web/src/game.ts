// Core game logic for the X/Y/Z battle-of-the-sexes game.
// Players only score when they pick the SAME letter, but each prefers a different match.

export type Move = 'X' | 'Y' | 'Z'
export type Role = 'A' | 'B'

export const MOVES: Move[] = ['X', 'Y', 'Z']

/** Bonus points awarded for correctly identifying your rival at the end. */
export const GUESS_BONUS = 300

/**
 * Payoff for a pair of moves, as [playerA_points, playerB_points].
 * Columns = A's move, rows = B's move. Only matches score.
 *
 * Every match splits the same 200-point pie, so fighting can't grow it — it only
 * shifts the split. Z is the fair division (100/100); X/Y are lopsided (150/50) in
 * one player's favour. A miss destroys the pie entirely (0/0), which makes the safe,
 * focal Z the smart default and pushing for the 150 a genuine gamble.
 */
export function payoff(moveA: Move, moveB: Move): [number, number] {
  if (moveA !== moveB) return [0, 0]
  if (moveA === 'X') return [150, 50]
  if (moveA === 'Y') return [50, 150]
  return [100, 100] // Z
}

/** Points the given role earns when both players match on `letter`. */
export function payoutFor(role: Role, letter: Move): number {
  const [a, b] = payoff(letter, letter)
  return role === 'A' ? a : b
}

export interface BotContext {
  round: number
  myRole: Role
  /** Past rounds from the bot's point of view; `opp` is the human's move. */
  history: { opp: Move }[]
}

export interface Bot {
  key: string
  name: string
  desc: string
  fn: (ctx: BotContext) => Move
}

export const BOTS: Bot[] = [
  {
    key: 'fair',
    name: 'Pax',
    desc: 'Always plays Z. Wants the safe 100/100 split every time.',
    fn: () => 'Z',
  },
  {
    key: 'greedy',
    name: 'Midas',
    desc: 'Always demands its own best letter (X if A, Y if B). Hopes you cave.',
    fn: (ctx) => (ctx.myRole === 'A' ? 'X' : 'Y'),
  },
  {
    key: 'mirror',
    name: 'Echo',
    desc: 'Asks for its own letter first, then copies whatever you played last round.',
    fn: (ctx) =>
      ctx.history.length
        ? ctx.history[ctx.history.length - 1].opp
        : ctx.myRole === 'A'
          ? 'X'
          : 'Y',
  },
  {
    key: 'adaptive',
    name: 'Sage',
    desc: 'Opens by offering your letter, then learns which one earns it the most against you.',
    fn: (ctx) => {
      // Goodwill probe on round 1: offer the opponent's favoured letter.
      if (!ctx.history.length) return ctx.myRole === 'A' ? 'Y' : 'X'
      // Value each letter by what it would have earned the bot historically:
      // how often the human played it, weighted by the bot's payoff for matching.
      const val: Record<Move, number> = { X: 0, Y: 0, Z: 0 }
      for (const h of ctx.history) {
        val[h.opp] += payoutFor(ctx.myRole, h.opp)
      }
      let best: Move = 'Z'
      let bv = -1
      for (const m of MOVES) if (val[m] > bv) { bv = val[m]; best = m }
      return bv === 0 ? 'Z' : best
    },
  },
  {
    key: 'random',
    name: 'Dice',
    desc: 'Picks X, Y, or Z completely at random. Pure chaos.',
    fn: () => MOVES[Math.floor(Math.random() * MOVES.length)],
  },
  {
    key: 'generous',
    name: 'Solomon',
    desc: 'Plays Z, but concedes to you if you keep demanding the same letter.',
    fn: (ctx) => {
      const last3 = ctx.history.slice(-3)
      if (
        last3.length === 3 &&
        last3.every((h) => h.opp === last3[0].opp) &&
        last3[0].opp !== 'Z'
      ) {
        return last3[0].opp // give in to a repeated demand
      }
      return 'Z'
    },
  },
]

export function getBot(key: string): Bot {
  return BOTS.find((b) => b.key === key) ?? BOTS[0]
}

/**
 * Which bots are still consistent with the opponent's observed moves?
 * Replays each deterministic strategy against the human's actual moves and
 * keeps only those whose predicted move matched every round. The random bot
 * can never be ruled out by observation, so it always stays a suspect.
 */
export function consistentBots(rounds: { you: Move; bot: Move }[], humanRole: Role): Bot[] {
  const botRole: Role = humanRole === 'A' ? 'B' : 'A'
  return BOTS.filter((b) => {
    if (b.key === 'random') return true
    const history: { opp: Move }[] = []
    for (let i = 0; i < rounds.length; i++) {
      const predicted = b.fn({ round: i + 1, myRole: botRole, history })
      if (predicted !== rounds[i].bot) return false
      history.push({ opp: rounds[i].you })
    }
    return true
  })
}

export interface RoundResult {
  round: number
  you: Move
  bot: Move
  youGain: number
  oppGain: number
  matched: boolean
}

/** Resolve one round given the human move and bot decision. */
export function resolveRound(
  human: Move,
  bot: Move,
  role: Role,
  round: number,
): RoundResult {
  const moveA = role === 'A' ? human : bot
  const moveB = role === 'A' ? bot : human
  const [pa, pb] = payoff(moveA, moveB)
  const youGain = role === 'A' ? pa : pb
  const oppGain = role === 'A' ? pb : pa
  return { round, you: human, bot, youGain, oppGain, matched: human === bot }
}
