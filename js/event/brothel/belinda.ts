/*
 *
 * Define Belinda
 *
 */
import { Color } from "../../body/color";
import { Race } from "../../body/race";
import { Entity } from "../../entity";
import { GAME, WORLD, WorldTime } from "../../GAME";
import { IStorage } from "../../istorage";

export namespace BelindaFlags {
	export enum Met {
		NotMet = 0,
		Met    = 1,
	}
}

export class Belinda extends Entity {
	constructor(storage?: IStorage) {
		super();

		this.ID = "belinda";

		// Character stats
		this.name = "Belinda";

		this.sexlevel = 5;

		this.body.DefFemale();
		this.FirstVag().virgin   = false;
		this.Butt().virgin       = false;
		this.FirstBreastRow().size.base = 12.5;
		this.Butt().buttSize.base = 7;
		this.body.SetRace(Race.Dog);
		this.SetSkinColor(Color.black);
		this.SetHairColor(Color.blue);
		this.SetEyeColor(Color.green);

		this.flags.Met      = BelindaFlags.Met.NotMet;

		if (storage) { this.FromStorage(storage); }
	}

	public Met() {
		return this.flags.Met >= BelindaFlags.Met.Met;
	}

	public FromStorage(storage: IStorage) {
		this.LoadPersonalityStats(storage);
		// Load flags
		this.LoadFlags(storage);
	}

	public ToStorage() {
		const storage: IStorage = {

		};

		this.SavePersonalityStats(storage);

		this.SaveFlags(storage);

		return storage;
	}

	// TODO
	// Schedule
	public IsAtLocation(location: any) {
		location = location || GAME().party.location;
		if (location === WORLD().loc.Rigard.Brothel.Brothel) {
			return (WorldTime().hour >= 18 || WorldTime().hour < 6);
		}
		return false;
	}
}

export namespace BelindaScenes {

}
