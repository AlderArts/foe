import * as _ from 'lodash';

// Encounter table for combat
export class EncounterTable {
	encounters : any[];
	hunt : any[];

	constructor() {
		// encounter { func, odds }
		// Random encounters
		this.encounters = [];
		// TODO: Hunting
		this.hunt = [];
	}
	
	// Setup phase
	AddEnc(Func : any, Odds? : any, Cond? : any, Obj? : any) {
		this.encounters.push({func: Func, odds: Odds, cond: Cond, obj: Obj});
	}

	Num() : number {
		return this.encounters.length;
	}

	// Get a fight
	Get() {
		var scenes = [];

		// Calculate total scale of odds
		var sum = 0;
		for(var i = 0; i < this.encounters.length; i++) {
			var e = this.encounters[i];
			var canFind = e.cond;
			if(canFind === undefined) canFind = true;
			if(canFind) {
				if(_.isFunction(canFind)) canFind = canFind();
				if(canFind) {
					var odds = e.odds;
					if(odds === undefined) odds = 1.0;
					if(_.isFunction(odds)) odds = odds();
					scenes.push({func: e.func, odds: odds, obj: e.obj});
					sum += odds;
				}
			}
		}

		// Pick an encounter
		var step = Math.random() * sum;

		for(var i = 0; i < scenes.length; i++) {
			var enc = scenes[i];
			step -= enc.odds;
			// If chosen, create an encounter from the supplied function
			if(step <= 0.0)
				return enc.func ? enc.func(enc.obj) : null;
		}
		// No encounters will default to null
		return null;
	}
}

/*
 Example code for adding encounters:

 encs.AddEnc(function() {
	var enemy = new Party();
	enemy.AddMember(new IntroDemon());
	enemy.AddMember(new Imp());
	enemy.AddMember(new Imp());
	var enc = new Encounter(enemy);

	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...

	return enc;
 }, 1.0);

 */
