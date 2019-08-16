import * as _ from "lodash";

// Encounter table for combat
export class EncounterTable {
	public encounters: any[];
	public hunt: any[];

	constructor() {
		// encounter { func, odds }
		// Random encounters
		this.encounters = [];
		// TODO: Hunting
		this.hunt = [];
	}

	// Setup phase
	public AddEnc(Func: any, Odds?: any, Cond?: any, Obj?: any) {
		this.encounters.push({func: Func, odds: Odds, cond: Cond, obj: Obj});
	}

	public Num(): number {
		return this.encounters.length;
	}

	// Get a fight
	public Get() {
		const scenes = [];

		// Calculate total scale of odds
		let sum = 0;
		for (const e of this.encounters) {
			let canFind = e.cond;
			if (canFind === undefined) { canFind = true; }
			if (canFind) {
				if (_.isFunction(canFind)) { canFind = canFind(); }
				if (canFind) {
					let odds = e.odds;
					if (odds === undefined) { odds = 1.0; }
					if (_.isFunction(odds)) { odds = odds(); }
					scenes.push({func: e.func, odds, obj: e.obj});
					sum += odds;
				}
			}
		}

		// Pick an encounter
		let step = Math.random() * sum;

		for (const enc of scenes) {
			step -= enc.odds;
			// If chosen, create an encounter from the supplied function
			if (step <= 0.0) {
				return enc.func ? enc.func(enc.obj) : undefined;
			}
		}
		// No encounters will default to undefined
		return undefined;
	}
}

/*
 Example code for adding encounters:

 encs.AddEnc(function() {
	let enemy = new Party();
	enemy.AddMember(new IntroDemon());
	enemy.AddMember(new Imp());
	enemy.AddMember(new Imp());
	let enc = new Encounter(enemy);

	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...

	return enc;
 }, 1.0);

 */
