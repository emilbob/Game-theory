[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/9swhKSyE)
# DO THIS FIRST BEFORE ANYTHING ELSE

- Replace `STUDENT_GITHUB_USERNAME` with your github username in the following files:
    - `./src/strategy.rs`
    - `./cargo.toml`

**Failure to do so will result in your strategy being ignored and a score of 0**

---

# Comprehension questions

Answer the [questions](questions/src/questions.rs) by replacing the todos with your answers.

---

# Assignment: A Tournament

## Introduction

Welcome to our strategic challenge! In this assignment, you're tasked with devising a strategy for a two-player game.
This game isn't a one-time event; it's repeated, offering a chance to adapt and evolve your tactics. Below you will find
the payout matrix that defines the potential outcomes of your decisions.

## The Game

|   | X      | Y      | Z       |
|---|--------|--------|---------|
| X | 250,50 | 0,0    | 0,0     |
| Y | 0,0    | 50,250 | 0,0     |
| Z | 0,0    | 0,0    | 100,100 |

Each cell in the matrix represents the points scored by Player A and Player B, respectively, for each combination of
choices. The columns correspond to Player A's moves, while the rows are Player B's.

**Example**: If both players opt for X, Player A gains 250 points, while Player B gets 50 points.

## The Process

We're hosting a thrilling tournament where your strategy will face off against those of your peers—and your own! Each
pair of strategies will battle it out over an unspecified but fixed number of rounds. Your goal is to maximize your
total score, both within each game and cumulatively across all matchups.

**The other players**: There are two parallel leagues in this tournament: one exclusively for onsite students, the other
for those attending remotely. You'll only compete within your respective league.

**Matchup**: Every strategy submitted plays against every other strategy submitted and itself. At the beginning of every
matchup the game engine determines whether you (your strategy) will be playing as Player A or Player B. Your role
remains fixed for the whole matchup (but is determined again in the next matchup). It is important to note that we use
an algorithm unknown to students to determine which of the two strategies will be Player A or B. The game engine,
however, will provide each player with whether they are Player A or Player B before the first round of each matchup.

**Number of rounds**: The number of rounds that each matchup has is fixed and the same for all players in the tournament
but they are not known to students before. The number of rounds is more than 101 and less than 501 and will be uneven. Note, that this number is fixed for both leagues and every matchup and does not change.

## Your Submission

```rust
use core::cell::RefCell;
use std::rc::Rc;

use strategies::*;
use strategies::ParticipantType::{Onsite, Remote};

#[derive(Named)]  // This will make it so the strategy's name is the struct name, you can replace this with your own implementation of `Named`
struct MyStrategy {}

impl Strategy for MyStrategy {
    fn play_for_favoured_move(&mut self, favoured_move: Move) -> Move {
        // I always play my favoured move
        favoured_move
    }

    fn handle_last_round(&mut self, round: Round, favoured_move: Move) {
        // Whatever, I always play my favoured move
    }
}

submit_strategy!(
    MyStrategy {}, // Initialize your strategy
    Onsite, // `Onsite` for onsite students, `Remote` for remote
    "STUDENT_GITHUB_USERNAME", // DO NOT CHANGE THIS!, if you do, your strategy will be rejected. This will identify your strategy internally and won't be shown to others
    "my public name" // This is the name used to identify you in the leaderboard, please keep it civil.
);
```

## IMPORTANT: Submission Dos and Don'ts
- Your strategy must NEVER `panic!`. panicking strategies will be excluded from the game and get a failing score
- YOU MUST use the `submit_strategy` macro as described above
- YOU MUST use the `Onsite` or `Remote` participant type based on whether you are an onsite or remote student
- DO NOT use the `System` participant type, failing to do so will result in test failures and failing score
- Your strategy functions must return in under 100ms
- The `submit_strategy` macro will add tests to check the above conditions, you can run cargo test to verify that you
  adhere to them
- DO NOT change any of the file names
- DO NOT change any of the existing function names

## The Leaderboard

Post-tournament, we'll release a leaderboard ranking all the strategies by their total points scored. To maintain
privacy while allowing you to spot your own cunning strategy, we'll list each entry by the nickname you've chosen.

## Grading

This assignment contributes to your final grade for the Economics module. The grading system differs slightly between remote and onsite students.

### Remote Students

The grading for this assignment combines absolute and relative grading. Points can be earned through competing in the game and by correctly answering the comprehension questions of this assignment. Each correct answer yields 1000 points, which are added to the score obtained from your strategy in the game.

| Points         | Grade | 
|----------------|-------|
| 0 - 999        | 0     | 
| 1000 - 2000    | 1     | 
| 2001 - 3000    | 2     | 
| 3001 - 4000    | 3     | 
| 4001 - 5000    | 4     | 
| 5001 - 6000    | 5     | 
| 6001 and above | relative to others | 

If you scored more than 6001 points, your grade is determined relative to other students that obtained more than 6001 points according to the following table.

| Quantile      | Grade |
|---------------|-------|
| Top 5%        | 10    | 
| Next 15%      | 9     | 
| Next 30%      | 8     | 
| Next 35%      | 7     | 
| Bottom 15%    | 6     |

### Onsite Students

Onsite students receive a performance factor that influences their total points in the Module Exam. Each correctly answered comprehension question in this assignment earns 1000 points, which are then added to the points obtained from your strategy in the game. The final score in the Module Exam is adjusted by the following factors based on the following scheme.

**Relative Performance Factors:**

| Quantile      | Factor |
|---------------|--------|
| Top 5%        | 1.10   | 
| Next 15%      | 1.07   | 
| Next 30%      | 1.05   | 
| Next 35%      | 1.03   | 
| Bottom 15%    | 1.00   |

Additionally, student's that fail to make a submission or submit non-working code (e.g., cargo test failure) obtain a factor of 0.9.

Important: Note that the grading details might be subject to change if unexpected circumstances occur.

## Good luck, and may the best strategies win!
