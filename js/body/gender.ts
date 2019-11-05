import * as _ from "lodash";

enum Gender {
	male   = 0,
	female = 1,
	herm   = 2,
	none   = 3,
	LAST   = 4,
}

namespace Gender {
	export function Desc(gender: Gender) {
		switch (gender) {
		case Gender.male: return "male";
		case Gender.female: return "female";
		case Gender.herm:
			return _.sample(["hermaphrodite", "herm"]);
		default: return "genderless";
		}
	}
	export function Noun(gender: Gender) {
		switch (gender) {
		case Gender.male: return "man";
		case Gender.female: return "woman";
		case Gender.herm:
			return _.sample(["hermaphrodite", "herm"]);
		default: return "neuter";
		}
	}
	export function Short(gender: Gender) {
		switch (gender) {
		case Gender.male: return "M";
		case Gender.female: return "F";
		case Gender.herm: return "H";
		default: return "-";
		}
	}
	export function Random(odds?: number[]) {
		odds = odds || [1, 1, 1];
		let sum = 0;
		for (let i = 0; i < Gender.LAST; i++) {
			if (odds[i]) { sum += odds[i]; }
		}

		let step = Math.random() * sum;

		for (let i = 0; i < Gender.LAST; i++) {
			if (odds[i]) {
				step -= odds[i];
			}
			if (step <= 0.0) {
				return i;
			}
		}
		return Gender.none;
	}
}

export { Gender };
