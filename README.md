# The Standoff

A repeated two-player *battle-of-the-sexes* game. Two players repeatedly choose moves
and only score when their choices line up — but they each prefer a *different* match to
win. The challenge is reading your rival and steering them toward your outcome over many
rounds.

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

In the web version you face one of seven secret AI strategies, hidden until the end. A
"suspects" panel narrows down who it could be as you watch them play, and naming your rival
correctly at the end earns a points bonus — so reading the opponent literally pays off.
