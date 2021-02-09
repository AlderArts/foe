import * as _ from "lodash";
import { GAME, WorldTime } from "../GAME";
import { Season } from "../navigation/time";

/* Global parser */
export namespace GP {
	export function season(spring: string, summer: string, autumn: string, winter: string) {
		const s = WorldTime().season;
		switch (s) {
			case Season.Spring: return spring;
			case Season.Summer: return summer;
			case Season.Autumn: return autumn;
			default:
			case Season.Winter: return winter;
		}
	}

	export function comps(alone: string, two: string, group: string) {
		const num: number = GAME().party.Num();
		if (num > 2) { // group
			return group;
		} else if (num === 2) { // two
			return two;
		} else { // alone
			return alone;
		}
	}

	export class Plural {
		private cond: boolean;
		constructor(condition: boolean) {
			this.cond = condition;
		}

		public get a() { return this.cond ? "" : " a"; }
		public get s() { return this.cond ? "s" : ""; }
		public get notS() { return this.cond ? "" : "s"; }
		public get es() { return this.cond ? "es" : ""; }
		public get notEs() { return this.cond ? "" : "es"; }
		public get yIes() { return this.cond ? "ies" : "y"; }

		public get isAre() { return this.cond ? "are" : "is"; }
		public get hasHave() { return this.cond ? "have" : "has"; }
		public get wasWere() { return this.cond ? "were" : "was"; }

		public get oneof() { return this.cond ? " one of" : ""; }
		public get bothof() { return this.cond ? " both of" : ""; }
		public get someof() { return this.cond ? " some of" : ""; }
		public get eachof() { return this.cond ? " each of" : ""; }
		public get allof() { return this.cond ? " all of" : ""; }

		public get ItThey() { return this.cond ? "They" : "It"; }
		public get ItsTheyre() { return this.cond ? "They’re" : "It’s"; }

		public get itThey() { return this.cond ? "they" : "it"; }
		public get itThem() { return this.cond ? "them" : "it"; }
		public get itsTheir() { return this.cond ? "their" : "its"; }
		public get itsTheyre() { return this.cond ? "they’re" : "it’s"; }
		public get itsTheyve() { return this.cond ? "they’ve" : "it’s"; }
		public get thisThese() { return this.cond ? "these" : "this"; }
		public get thatThose() { return this.cond ? "those" : "that"; }

		public plural(many: string, one: string) { return this.cond ? many : one; }
	}
}
