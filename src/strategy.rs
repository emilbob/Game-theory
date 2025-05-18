/*
 * Copyright (C) 2024 Ido Flax
 *  See the LICENSE.md file distributed with this work for additional
 *  information regarding copyright ownership.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
/*!
Provide an implementation of the `Strategy` trait and
then submit it using the `submit_strategy!` macro.

Here's an example:

```rust
use core::cell::RefCell;
use std::rc::Rc;

use strategies::*;
use strategies::ParticipantType::{Onsite, Remote};

// This will make it so the strategy's name is the struct name,
// you can replace this with your own implementation of `Named`
#[derive(Named)]
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
	"my_github_username",
	"my public name" // This will be used to identify you in the leaderboard, please keep it civil.
);
```
 */

use core::cell::RefCell;
use std::rc::Rc;

// Keep these uses as is for submit_strategy macro, otherwise you'll have compilation errors
#[allow(unused_imports)]
use strategies::Move::*;
#[allow(unused_imports)]
use strategies::ParticipantType::{Onsite, Remote};
use strategies::Round;
use strategies::*;

#[derive(Named)]
#[allow(dead_code)]
struct MyStrategy {
	last_opponent_move: Option<Move>,
	is_first_move: bool,
	cooperation_count: usize,
	defection_count: usize,
	forgiveness_threshold: usize,
	punitive: bool,
	punitive_move: Move,
}

impl Strategy for MyStrategy {
	fn play_for_favoured_move(&mut self, _favoured_move: Move) -> Move {
		if self.is_first_move {
			self.is_first_move = false;
			Z
		} else {
			if self.punitive {
				if self.last_opponent_move == Some(Z) {
					// Return to cooperation if the opponent cooperates
					self.punitive = false;
					Z
				} else {
					// Alternate punitive move to cover both roles
					let move_to_play = self.punitive_move;
					self.punitive_move = if self.punitive_move == X { Y } else { X };
					move_to_play
				}
			} else {
				match self.last_opponent_move {
					Some(X) | Some(Y) => {
						self.defection_count += 1;
						if self.defection_count > self.forgiveness_threshold {
							// Switch to a punitive strategy if the opponent defects often
							self.punitive = true;
							self.punitive_move = X; // Start with X
							X
						} else {
							Z
						}
					},
					Some(Z) => {
						self.cooperation_count += 1;
						Z
					},
					None => Z,
				}
			}
		}
	}

	fn handle_last_round(&mut self, _round: Round, _favoured_move: Move) {
		self.last_opponent_move = Some(_round.opponent_move);
		// Adjust forgiveness threshold dynamically
		if let Some(opponent_move) = self.last_opponent_move {
			if opponent_move == Z {
				// Forgive past defections gradually if the opponent cooperates
				if self.defection_count > 0 {
					self.defection_count -= 1;
				}
				// Increase forgiveness threshold if the opponent cooperates often
				self.forgiveness_threshold += 1;
			} else {
				// Decrease forgiveness threshold if the opponent defects
				if self.forgiveness_threshold > 1 {
					self.forgiveness_threshold -= 1;
				}
			}
		}
	}
}

submit_strategy!(
	MyStrategy {
		last_opponent_move: None,
		is_first_move: true,
		cooperation_count: 0,
		defection_count: 0,
		forgiveness_threshold: 3, // Initial threshold
		punitive: false,
		punitive_move: X, // Start punitive move with X
	},
	Onsite,
	"emboth",
	"Emil Bob"
);
