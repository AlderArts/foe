/*
 *
 * Define Ches
 *
 */
import { Entity } from "../../../engine/entity/entity";
import { IStorage } from "../../../engine/entity/istorage";
import { ILocation } from "../../../engine/navigation/location";

export namespace ChesFlags {
	export enum Met {
		NotMet = 0,
	}
}

export class Ches extends Entity {
	constructor(storage?: IStorage) {
		super();

		this.ID = "ches";

		// Character stats
		this.name = "Ches";

		this.body.DefMale();

		this.flags.Met = ChesFlags.Met.NotMet;

		if (storage) { this.FromStorage(storage); }
	}

	public Met() {
		return this.flags.Met !== ChesFlags.Met.NotMet;
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

	// Flags

	// Schedule
	public IsAtLocation(location?: ILocation) {
		return true;
	}
}

export namespace ChesScenes {

}
