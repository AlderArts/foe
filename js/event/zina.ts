/*
 *
 * Define Zina
 *
 */
import { AppendageType } from "../body/appendage";
import { Color } from "../body/color";
import { Race } from "../body/race";
import { Entity } from "../entity";
import { GAME } from "../GAME";
import { IStorage } from "../istorage";
import { ILocation } from "../location";
import { TF } from "../tf";

export class Zina extends Entity {
	constructor(storage?: IStorage) {
		super();

		this.ID = "zina";

		// Character stats
		this.name = "Zina";

		// TODO
		// this.avatar.combat = Images.zina;

		// TODO
		this.maxHp.base        = 140;
		this.maxSp.base        = 30;
		this.maxLust.base      = 50;
		// Main stats
		this.strength.base     = 20;
		this.stamina.base      = 24;
		this.dexterity.base    = 19;
		this.intelligence.base = 16;
		this.spirit.base       = 15;
		this.libido.base       = 20;
		this.charisma.base     = 20;

		this.level = 3;
		this.sexlevel = 2;
		this.SetExpToLevel();

		this.body.DefHerm(true);
		this.FirstBreastRow().size.base = 5;
		this.Butt().buttSize.base = 5;
		this.FirstCock().thickness.base = 4;
		this.FirstCock().length.base    = 18;
		this.Balls().size.base = 2;
		this.Balls().cumProduction.base = 2;
		this.body.SetRace(Race.Hyena);
		this.body.SetBodyColor(Color.brown);
		this.body.SetEyeColor(Color.brown);

		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Hyena, Color.brown);

		this.Butt().virgin = false;

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Met = 0;

		if (storage) { this.FromStorage(storage); }
	}

	// TODO save/load combat stats/preg/etc
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

	// Flags
	public Met() {
		return (this.flags.Met & ZinaFlags.Met.Met) > 0;
	}

	public Recruited() {
		return false; // TODO
	}

	// Schedule
	public IsAtLocation(location?: ILocation) {
		location = location || GAME().party.location;
		return true;
	}
}

export namespace ZinaFlags {
	export enum Met { // Bitmask
		Met  = 1,
		BJ   = 2,
		Cunn = 4,
	}
}

export namespace ZinaScenes {

}
