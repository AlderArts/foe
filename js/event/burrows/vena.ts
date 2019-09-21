/*
 *
 * Define Vena
 *
 */

import { AppendageType } from "../../body/appendage";
import { Color } from "../../body/color";
import { Race } from "../../body/race";
import { Entity } from "../../entity";
import { IStorage } from "../../istorage";
import { TF } from "../../tf";

export class Vena extends Entity {
	constructor(storage?: IStorage) {
		super();

		this.ID = "vena";

		this.name              = "Vena";

		this.body.DefFemale();

		// TODO hermification

		this.Butt().virgin = false;
		this.FirstVag().virgin = false;
		this.Butt().buttSize.base = 15;

		this.body.SetRace(Race.Rabbit);

		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Rabbit, Color.white);

		this.body.SetBodyColor(Color.white);

		this.body.SetEyeColor(Color.blue);

		this.flags.Met = 0; // bitmask
		this.flags.Sex = 0; // bitmask

		if (storage) { this.FromStorage(storage); }
	}

	public FromStorage(storage: IStorage) {
		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
	}

	public ToStorage() {
		const storage: IStorage = {};

		this.SavePersonalityStats(storage);

		this.SaveFlags(storage);

		return storage;
	}
}
