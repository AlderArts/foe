/*
 *
 * Define Uru
 *
 */
import { Images } from "../../assets";
import { AppendageType } from "../../engine/entity/body/appendage";
import { Color } from "../../engine/entity/body/color";
import { Race } from "../../engine/entity/body/race";
import { Entity } from "../../engine/entity/entity";
import { IStorage } from "../../engine/entity/istorage";
import { TF } from "../../engine/entity/tf";
import { ILocation } from "../../engine/navigation/location";

export class Uru extends Entity {
	constructor(storage?: IStorage) {
		super();

		this.ID = "uru";

		// Character stats
		this.name = "Uru";

		this.avatar.combat = Images.uru1;

		this.maxHp.base        = 6000;
		this.maxSp.base        = 1500;
		this.maxLust.base      = 500;
		// Main stats
		this.strength.base     = 90;
		this.stamina.base      = 110;
		this.dexterity.base    = 100;
		this.intelligence.base = 200;
		this.spirit.base       = 500;
		this.libido.base       = 300;
		this.charisma.base     = 100;

		this.level = 50;
		this.sexlevel = 50;
		this.SetExpToLevel();

		this.body.DefHerm(false);
		this.FirstBreastRow().size.base = 16;
		this.Butt().buttSize.base = 9;
		this.FirstCock().thickness.base = 6;
		this.FirstCock().length.base    = 32;
		this.body.SetRace(Race.Demon);
		this.body.SetBodyColor(Color.red);
		this.body.SetHairColor(Color.black);
		this.body.SetEyeColor(Color.orange);

		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Demon, Color.red);
		TF.SetAppendage(this.Appendages(), AppendageType.horn, Race.Demon, Color.black);

		this.FirstVag().virgin = false;
		this.Butt().virgin = false;

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Intro = 0;

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

	// Schedule
	public IsAtLocation(location?: ILocation) {
		return true;
	}

}

// Flags
export namespace UruFlags {
	export enum Intro {
		LostToImps         = 1,
		ToldUruAboutMirror = 2,
		FuckedUru          = 4,
		FuckedByUru        = 8,
		GotClitcock        = 16,
	}
}

export namespace UruScenes {

}
