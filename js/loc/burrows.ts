/*
 *
 * The Burrows, Lagomorph dungeon
 *
 */
import * as _ from "lodash";

import { Gender } from "../body/gender";
import { EncounterTable } from "../encountertable";
import { Lagomorph, LagomorphAlpha } from "../enemy/rabbit";
import { LagonFlags } from "../event/burrows/lagon-flags";
import { Vena } from "../event/burrows/vena";
import { VenaFlags } from "../event/burrows/vena-flags";
import { GAME } from "../GAME";
import { IStorage } from "../istorage";
import { BurrowsFlags } from "./burrows-flags";

// Class to handle global flags and logic for dungeon
export class Burrows {
	public flags: any;

	constructor(storage?: IStorage) {
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
		return (GAME().lagon.flags.Usurp & LagonFlags.Usurp.Defeated) > 0;
	}
	public LagonChallenged() {
		return (GAME().lagon.flags.Usurp & LagonFlags.Usurp.FirstFight) > 0;
	}
	public LagonAlly() {
		return (GAME().lagon.flags.Usurp & LagonFlags.Usurp.SidedWith) > 0;
	}
	// TODO
	public LagonChained() {
		return GAME().burrows.LagonDefeated(); // TODO
	}
	public LagonJudged() {
		const vena: Vena = GAME().vena;
		return (vena.flags.Met & VenaFlags.Met.Judgement) > 0;
	}
	// TODO
	public LagonPit() {
		return false;
	}
	public VenaRestored() {
		const vena: Vena = GAME().vena;
		return (vena.flags.Met & VenaFlags.Met.Restored) > 0;
	}

	public ToStorage() {
		const storage: IStorage = {};

		storage.flags = this.flags;

		return storage;
	}

	public FromStorage(storage: IStorage) {
		// Load flags
		_.forIn(storage.flags, (value, key) => {
			this.flags[key] = parseInt(value as string, 10);
		});
	}

	public GenerateLagomorph(gender?: Gender) {
		if (gender === undefined) {
			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				gender = Gender.male;
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				gender = Gender.female;
			}, 1.0, () => true);
			scenes.Get();
		}

		return new Lagomorph(gender);
	}

	public GenerateLagomorphAlpha(gender?: Gender) {
		if (gender === undefined) {
			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				gender = Gender.male;
			}, 3.0, () => true);
			scenes.AddEnc(() => {
				gender = Gender.female;
			}, 2.0, () => true);
			scenes.Get();
		}

		return new LagomorphAlpha(gender);
	}
}
