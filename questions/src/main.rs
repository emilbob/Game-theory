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

mod questions;
use std::env::args;

fn main() {
	let args = args().collect::<Vec<String>>();
	let q = args[1].parse::<u8>().unwrap();
	match q {
		1 => println!("{}", questions::answer_1()),
		2 => println!("{}", questions::answer_2()),
		3 => print_pair(questions::answer_3()),
		4 => print_pair(questions::answer_4()),
		5 => print_pair(questions::answer_5()),
		6 => print_pair(questions::answer_6()),
		_ => println!("Invalid question number"),
	}
}

fn print_pair(pair: (u16, u16)) {
	println!("{},{}", pair.0, pair.1);
}
