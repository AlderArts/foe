/*
 *
 * Define Asche
 *
 */

import { Race } from "../body/race";
import { Entity } from "../entity";
import { IStorage } from "../istorage";
import { AscheFlags } from "./asche-flags";

export class Asche extends Entity {
	constructor(storage?: IStorage) {
		super();

		this.ID = "asche";

		// Character stats
		this.name = "Asche";

		this.body.DefFemale();
		this.FirstBreastRow().size.base = 12.5;
		this.Butt().buttSize.base = 6;
		this.body.SetRace(Race.Jackal);

		this.FirstVag().virgin = false;
		this.Butt().virgin = false;

		this.flags.Met   = AscheFlags.Met.NotMet;
		this.flags.Talk  = 0; // Bitmask
		this.flags.Magic = 0;
		this.flags.Tasks = 0; // Bitmask

		if (storage) { this.FromStorage(storage); }
	}

	public MagicBoxCost() {
		return 100;
	}

	public FromStorage(storage: IStorage) {
		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);
	}

	public ToStorage() {
		const storage: IStorage = {};

		this.SavePersonalityStats(storage);

		this.SaveFlags(storage);
		this.SaveSexFlags(storage);

		return storage;
	}
}
