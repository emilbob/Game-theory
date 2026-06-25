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

/// # Questions
///
/// **This exam is to be completed without accessing the internet, books, class notes
///  or any other resources.**
///

/// ## Question 1
///
/// Which game is this?
/// - a. Public Good Game
/// - b. Prisoner's Dilemma Game
/// - c. Coordination Game
/// - d. Chicken Game
///
#[allow(dead_code)]
pub fn answer_1() -> char {
	'c'
}

/// ## Question 2
///
/// What is the number of equilibria in the games?
///
#[allow(dead_code)]
pub fn answer_2() -> u8 {
	3
}

/// ## Question 3
///
/// Assume Player 1 always plays X and Player 2 always plays Y. What is the expected score after 100 rounds?
///
#[allow(dead_code)]
pub fn answer_3() -> (u16, u16) {
	(0, 0)
}

/// ## Question 4
///
/// Assume Player 1 always plays Z and Player 2 always plays Z. What is the expected score after 100 rounds?
///
#[allow(dead_code)]
pub fn answer_4() -> (u16, u16) {
	(10000, 10000)
}

/// ## Question 5
///
///  Assume Player 1 starts with X and Player 2 with Z, and afterward both players choose their strategies randomly in each subsequent round. What is the expected number of points for each player after 100 rounds?
///
/// Round 1 (X vs Z) is a guaranteed miss → 0. Each of the remaining 99 rounds is
/// uniform-random for both players: any given letter matches with probability 1/9,
/// so the expected score per round is (150 + 50 + 100) / 9 = 300/9 for *each*
/// player (the pie is symmetric across the three matches). 99 × 300/9 = 3300.
#[allow(dead_code)]
pub fn answer_5() -> (u16, u16) {
	(3300, 3300)
}

/// ## Question 6
///
/// Assume Player 1 and Player 2 plays X with 50% probability, Y with 20% probability and Z with 30% probability and then always plays whatever the other player played in the previous round. What would be the expected points after 100 rounds?
///
/// Copying the opponent only ever swaps the two moves, so equality is preserved:
/// the players match on every one of the 100 rounds iff their independent round-1
/// picks were equal, and never match otherwise. With P(both X) = .25, P(both Y) =
/// .04, P(both Z) = .09:
///   P1: .25·100·150 + .04·100·50 + .09·100·100 = 4850
///   P2: .25·100·50  + .04·100·150 + .09·100·100 = 2750
#[allow(dead_code)]
pub fn answer_6() -> (u16, u16) {
	(4850, 2750)
}

#[cfg(test)]
mod tests {
	use super::*;

	/// Points (Player 1, Player 2) for a single round given both moves.
	/// Only a matching pair scores; the matched letter decides the split of the
	/// 200-point pie (X favours P1, Y favours P2, Z is even).
	fn payoff(p1: char, p2: char) -> (u16, u16) {
		if p1 != p2 {
			return (0, 0);
		}
		match p1 {
			'X' => (150, 50),
			'Y' => (50, 150),
			'Z' => (100, 100),
			_ => (0, 0),
		}
	}

	#[test]
	fn q1_is_a_coordination_game() {
		assert_eq!(answer_1(), 'c');
	}

	#[test]
	fn q2_has_three_pure_equilibria() {
		// One Nash equilibrium per matching diagonal cell: (X,X), (Y,Y), (Z,Z).
		assert_eq!(answer_2(), 3);
	}

	#[test]
	fn q3_constant_mismatch_never_scores() {
		// P1 always X, P2 always Y -> the players never match.
		assert_eq!(payoff('X', 'Y'), (0, 0));
		assert_eq!(answer_3(), (0, 0));
	}

	#[test]
	fn q4_both_always_z_split_the_pie_evenly() {
		let (a, b) = payoff('Z', 'Z');
		assert_eq!((a * 100, b * 100), (10000, 10000));
		assert_eq!(answer_4(), (10000, 10000));
	}

	#[test]
	fn q5_one_miss_then_99_uniform_random_rounds() {
		// Each letter matches with probability 1/9 when both play uniformly.
		let per_round = f64::from(150 + 50 + 100) / 9.0;
		let expected = (per_round * 99.0).round() as u16; // round 1 (X vs Z) scores 0
		assert_eq!(expected, 3300);
		assert_eq!(answer_5(), (expected, expected));
	}

	#[test]
	fn q6_copying_preserves_round_one_equality() {
		// Copying the opponent merely swaps moves each round, so the pair matches
		// on all 100 rounds exactly when their independent round-1 picks were equal.
		let dist = [('X', 0.5_f64), ('Y', 0.2), ('Z', 0.3)];
		let (mut p1, mut p2) = (0.0_f64, 0.0);
		for (letter, prob) in dist {
			let (a, b) = payoff(letter, letter);
			p1 += prob * prob * 100.0 * f64::from(a);
			p2 += prob * prob * 100.0 * f64::from(b);
		}
		assert_eq!((p1.round() as u16, p2.round() as u16), (4850, 2750));
		assert_eq!(answer_6(), (4850, 2750));
	}
}
