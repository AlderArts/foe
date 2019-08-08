import { Rand } from "../utility";

enum Gender {
	male   = 0,
	female = 1,
	herm   = 2,
	none   = 3,
	LAST   = 4,
}

namespace Gender {
	export function Desc(gender : Gender) {
		var r;
		switch(gender) {
		case Gender.male: return "male";
		case Gender.female: return "female";
		case Gender.herm: r = Rand(2);
			if(r == 0) return "hermaphrodite";
			else return "herm";
		default: return "genderless";
		}
	}
	export function Noun(gender : Gender) {
		var r;
		switch(gender) {
		case Gender.male: return "man";
		case Gender.female: return "woman";
		case Gender.herm: r = Rand(2);
			if(r == 0) return "herm";
			else return "herm";
		default: return "neuter";
		}
	}
	export function Short(gender : Gender) {
		var r;
		switch(gender) {
		case Gender.male: return "M";
		case Gender.female: return "F";
		case Gender.herm: return "H";
		default: return "-";
		}
	}
	export function Random(odds? : any[]) {
		odds = odds || [1, 1, 1];
		var sum = 0;
		for(var i = 0; i < Gender.LAST; i++) {
			if(odds[i]) sum += odds[i];
		}
		
		var step = Math.random() * sum;
		
		for(var i = 0; i < Gender.LAST; i++) {
			if(odds[i])
				step -= odds[i];
			if(step <= 0.0)
				return i;
		}
		return Gender.none;
	}
}

export { Gender };
