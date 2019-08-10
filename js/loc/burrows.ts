/*
 * 
 * The Burrows, Lagomorph dungeon
 * 
 */


import { Event } from '../event';
import { EncounterTable } from '../encountertable';
import { Gender } from '../body/gender';
import { GAME, WORLD } from '../GAME';
import { LagonFlags } from '../event/burrows/lagon-flags';
import { VenaFlags } from '../event/burrows/vena-flags';
import { BurrowsFlags } from './burrows-flags';
import { Lagomorph, LagomorphAlpha } from '../enemy/rabbit';

// Class to handle global flags and logic for dungeon
export class Burrows {
	flags : any;

	constructor(storage? : any) {
		this.flags = {};
		
		this.flags["Access"]      = BurrowsFlags.AccessFlags.Unknown;
		this.flags["BruteTrait"]  = BurrowsFlags.TraitFlags.Inactive;
		this.flags["HermTrait"]   = BurrowsFlags.TraitFlags.Inactive;
		this.flags["BrainyTrait"] = BurrowsFlags.TraitFlags.Inactive;
		
		this.flags["Felinix"]   = 0;
		this.flags["Lacertium"] = 0;
		this.flags["Equinium"]  = 0;
		
		if(storage) this.FromStorage(storage);
	}
	
	Access() {
		return this.flags["Access"] >= BurrowsFlags.AccessFlags.Visited;
	}

	BruteActive() {
		return this.flags["BruteTrait"] >= BurrowsFlags.TraitFlags.Active;
	}
	HermActive() {
		return this.flags["HermTrait"] >= BurrowsFlags.TraitFlags.Active;
	}
	BrainyActive() {
		return this.flags["BrainyTrait"] >= BurrowsFlags.TraitFlags.Active;
	}
	LagonDefeated() {
		return GAME().lagon.flags["Usurp"] & LagonFlags.Usurp.Defeated;
	}
	LagonChallenged() {
		return GAME().lagon.flags["Usurp"] & LagonFlags.Usurp.FirstFight;
	}
	LagonAlly() {
		return GAME().lagon.flags["Usurp"] & LagonFlags.Usurp.SidedWith;
	}
	//TODO
	LagonChained() {
		return GAME().burrows.LagonDefeated(); //TODO
	}
	LagonJudged() {
		let vena = GAME().vena;
		return vena.flags["Met"] & VenaFlags.Met.Judgement;
	}
	//TODO
	LagonPit() {
		return false;
	}
	VenaRestored() {
		let vena = GAME().vena;
		return vena.flags["Met"] & VenaFlags.Met.Restored;
	}

	ToStorage() {
		var storage : any = {};
		
		storage.flags = this.flags;
		
		return storage;
	}

	FromStorage(storage : any) {
		// Load flags
		for(var flag in storage.flags)
			this.flags[flag] = parseInt(storage.flags[flag]);
	}

	GenerateLagomorph(gender? : Gender) {
		if(gender == null) {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				gender = Gender.male;
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				gender = Gender.female;
			}, 1.0, function() { return true; });
			scenes.Get();
		}
		
		return new Lagomorph(gender);
	}
	
	GenerateLagomorphAlpha(gender? : Gender) {
		if(gender == null) {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				gender = Gender.male;
			}, 3.0, function() { return true; });
			scenes.AddEnc(function() {
				gender = Gender.female;
			}, 2.0, function() { return true; });
			scenes.Get();
		}
		
		return new LagomorphAlpha(gender);
	}	
}

