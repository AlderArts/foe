/*
 *
 * The Burrows, Lagomorph dungeon
 *
 */

import { Gender } from "../body/gender";
import { EncounterTable } from "../encountertable";
import { Lagomorph, LagomorphAlpha } from "../enemy/rabbit";
import { Event } from "../event";
import { LagonFlags } from "../event/burrows/lagon-flags";
import { VenaFlags } from "../event/burrows/vena-flags";
import { GAME, WORLD } from "../GAME";
import { BurrowsFlags } from "./burrows-flags";

// Class to handle global flags and logic for dungeon
export class Burrows {
	public flags: any;

	constructor(storage?: any) {
		this.flags = {};

		this.flags.Access      = BurrowsFlags.AccessFlags.Unknown;
		this.flags.BruteTrait  = BurrowsFlags.TraitFlags.Inactive;
		this.flags.HermTrait   = BurrowsFlags.TraitFlags.Inactive;
		this.flags.BrainyTrait = BurrowsFlags.TraitFlags.Inactive;

		this.flags.Felinix   = 0;
		this.flags.Lacertium = 0;
		this.flags.Equinium  = 0;

		if (storage) { this.FromStorage(storage); }
	}

	public Access() {
		return this.flags.Access >= BurrowsFlags.AccessFlags.Visited;
	}

	public BruteActive() {
		return this.flags.BruteTrait >= BurrowsFlags.TraitFlags.Active;
	}
	public HermActive() {
		return this.flags.HermTrait >= BurrowsFlags.TraitFlags.Active;
	}
	public BrainyActive() {
		return this.flags.BrainyTrait >= BurrowsFlags.TraitFlags.Active;
	}
	public LagonDefeated() {
		return GAME().lagon.flags.Usurp & LagonFlags.Usurp.Defeated;
	}
	public LagonChallenged() {
		return GAME().lagon.flags.Usurp & LagonFlags.Usurp.FirstFight;
	}
	public LagonAlly() {
		return GAME().lagon.flags.Usurp & LagonFlags.Usurp.SidedWith;
	}
	// TODO
	public LagonChained() {
		return GAME().burrows.LagonDefeated(); // TODO
	}
	public LagonJudged() {
		const vena = GAME().vena;
		return vena.flags.Met & VenaFlags.Met.Judgement;
	}
	// TODO
	public LagonPit() {
		return false;
	}
	public VenaRestored() {
		const vena = GAME().vena;
		return vena.flags.Met & VenaFlags.Met.Restored;
	}

	public ToStorage() {
		const storage: any = {};

		storage.flags = this.flags;

		return storage;
	}

	public FromStorage(storage: any) {
		// Load flags
		for (const flag in storage.flags) {
			this.flags[flag] = parseInt(storage.flags[flag]);
		}
	}

	public GenerateLagomorph(gender?: Gender) {
		if (gender == null) {
			const scenes = new EncounterTable();
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

	public GenerateLagomorphAlpha(gender?: Gender) {
		if (gender == null) {
			const scenes = new EncounterTable();
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
