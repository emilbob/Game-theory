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
#[allow(dead_code)]
pub fn answer_5() -> (u16, u16) {
	(0,0) // todo!(4400, 4400) - on purpose error - due to rust syntax
}

/// ## Question 6
///
/// Assume Player 1 and Player 2 plays X with 50% probability, Y with 20% probability and Z with 30% probability and then always plays whatever the other player played in the previous round. What would be the expected points after 100 rounds?
///
///
#[allow(dead_code)]
pub fn answer_6() -> (u16, u16) {
	(0,0, // todo!(7350, 3150)- on purpose error - due to rust syntax
}
