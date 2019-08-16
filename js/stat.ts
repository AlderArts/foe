import { GetDEBUG } from "../app";
import { Text } from "./text";

export class Stat {
	public base: number;
	public bonus: number;
	public level: number;
	public temp: number;
	public cheat: number;
	public growth: number;
	public growthStep: number;
	public growthBase: number;
	public debug: any;

	constructor(base?: number, growth?: number, growthStep?: number) {
		this.base   = base || 0; // Base stat, increased by levelling and TFs
		this.bonus  = 0; // Bonuses got by equipment/auras/perks etc
		this.level  = 0; // Bonuses got from levels
		this.temp   = 0; // Bonuses or penalties that are cleared after end of each combat
		this.cheat  = 0; // Bonuses got by DEBUG flag etc
		this.growth = growth || 1;
		this.growthStep = growthStep || 0.1;
		this.growthBase = this.growth;
	}

	static get growthPerPoint() { return 0.1; }
	static get growthPointsPerLevel() { return 3; }

	public Get() { return this.base + this.bonus + this.level + this.temp + this.cheat; }
	public Clear() { this.bonus = 0; this.temp = 0; }
	public GrowthRank() {
		return Math.round(((this.growth - this.growthBase) / this.growthStep) + 1); // , -1);
	}
	// Changes _ONE_ stat, closing in on the ideal
	// Cap the change to a maximum value
	// Returns the applied difference, unless the diff is zero
	public IdealStat(ideal: number, maxChange?: number, fraction?: boolean) {
		ideal = ideal || 0;
		maxChange = maxChange || 1;
		let diff = ideal - this.base;
		if (diff < 0) { maxChange *= -1; }
		diff = (Math.abs(diff) <= Math.abs(maxChange)) ? diff : maxChange;

		const old = this.base;
		this.base += diff;
		if (GetDEBUG() && this.debug) {
			Text.NL();
			if (diff > 0) {
				Text.Add("DEBUG: " + this.debug() + " " + old + " -> " + this.base + " (ideal: " + ideal + ")", undefined, "blue bold");
			} else if (diff === 0) {
				Text.Add("DEBUG: " + this.debug() + " " + old + " capped (ideal: " + ideal + ")", undefined, "bold");
 			} else {
				Text.Add("DEBUG: " + this.debug() + " " + old + " -> " + this.base + " (ideal: " + ideal + ")", undefined, "red bold");
 			}
			Text.NL();
			Text.Flush();
		}
		if (fraction) {
			return this.base - old;
		} else {
			return Math.floor(this.base) - Math.floor(old);
		}
	}
	// Changes _ONE_ stat, closing in on the ideal (ONLY INC)
	// Cap the change to a maximum value
	// Returns the applied difference (positive), unless the diff is zero
	public IncreaseStat(ideal: number, maxChange?: number, fraction?: boolean) {
		ideal = ideal || 0;
		maxChange = maxChange || 1;
		let diff = ideal - this.base;
		if (diff < 0) { return undefined; }
		diff = (diff <= maxChange) ? diff : maxChange;

		const old = this.base;
		this.base += diff;
		if (GetDEBUG() && this.debug) {
			Text.NL();
			if (diff === 0) {
				Text.Add("DEBUG: " + this.debug() + " " + old + " capped (ideal: " + ideal + ")", undefined, "black bold");
			} else {
				Text.Add("DEBUG: " + this.debug() + " " + old + " -> " + this.base + " (max: " + ideal + ")", undefined, "blue bold");
			}
			Text.NL();
			Text.Flush();
		}
		if (fraction) {
			return this.base - old;
		} else {
			return Math.floor(this.base) - Math.floor(old);
		}
	}
	// Changes _ONE_ stat, closing in on the ideal (ONLY DEC)
	// Cap the change to a maximum value
	// Returns the applied difference (positive), unless the diff is zero
	public DecreaseStat(ideal: number, maxChange?: number, fraction?: boolean) {
		ideal = ideal || 0;
		maxChange = maxChange || 1;
		let diff = this.base - ideal;
		if (diff < 0) { return undefined; }
		diff = (diff <= maxChange) ? diff : maxChange;

		const old = this.base;
		this.base -= diff;
		if (GetDEBUG() && this.debug) {
			Text.NL();
			if (diff === 0) {
				Text.Add("DEBUG: " + this.debug() + " " + old + " capped (ideal: " + ideal + ")", undefined, "black bold");
			} else {
				Text.Add("DEBUG: " + this.debug() + " " + old + " -> " + this.base + " (min: " + ideal + ")", undefined, "red bold");
			}
			Text.NL();
			Text.Flush();
		}
		if (fraction) {
			return this.base - old;
		} else {
			return Math.floor(this.base) - Math.floor(old);
		}
	}

}
