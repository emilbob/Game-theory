# The Standoff

A repeated two-player *battle-of-the-sexes* game, with a Rust strategy engine and a
React/Vite web game. Two players repeatedly choose moves and only score when their choices
line up — but they each prefer a *different* match to win. The challenge is reading your
rival and steering them toward your outcome over many rounds.

## The Game

|   | X      | Y      | Z       |
|---|--------|--------|---------|
| X | 150,50 | 0,0    | 0,0     |
| Y | 0,0    | 50,150 | 0,0     |
| Z | 0,0    | 0,0    | 100,100 |

Each cell is the points scored by Player A and Player B respectively for a combination
of choices. Columns are Player A's move, rows are Player B's.

**Example**: if both players choose X, Player A gains 150 points and Player B gets 50.

Players only score when they match (the diagonal), but their interests conflict over
*which* match. Crucially, **every match splits the same 200-point pie**: Z divides it fairly
(100/100), while X and Y split it 150/50 in one player's favour. A miss destroys the pie
entirely (0/0).

Because fighting can't grow the pie — only shift who gets it, while risking the whole
thing — the fair **Z is the smart default**. This is the classic *battle of the sexes*:
both want to coordinate, neither wants to give in. The edge comes from reading your opponent
and pushing for the 150 only when they'll actually concede.

### The web game

In the web version you face one of six secret AI strategies, hidden until the end. A
"suspects" panel narrows down who it could be as you watch them play, and naming your rival
correctly at the end earns a points bonus — so reading the opponent literally pays off.

## Project Layout

- `src/` — the Rust strategy crate (`strategy.rs` holds the strategy implementation).
- `web/` — a React + Vite frontend that visualizes matchups round by round.
- `questions/` — accompanying theory questions.

## Running

### Rust strategy

From the repo root:

```bash
cargo run     # build & run
cargo test    # run the tests
cargo build   # compile only
```

### Web visualization

```bash
cd web
npm install   # first time only
npm run dev   # start the dev server (http://localhost:5173)
```

Other scripts: `npm run build` (production build into `web/dist`) and `npm run preview`
(serve the built output).

## Writing a Strategy

A strategy implements the `Strategy` trait — `play_for_favoured_move` returns the move to
play each round, and `handle_last_round` lets you react to what happened last round. A
minimal example:

```rust
use strategies::*;

#[derive(Named)]
struct MyStrategy {}

impl Strategy for MyStrategy {
    fn play_for_favoured_move(&mut self, favoured_move: Move) -> Move {
        // Always play my favoured move
        favoured_move
    }

    fn handle_last_round(&mut self, round: Round, favoured_move: Move) {
        // React to the previous round here
    }
}
```

A strategy must never `panic!` and each function should return quickly (under ~100ms).
Run `cargo test` to verify it compiles and behaves correctly.
