/*
 *
 * Gwendy's farm
 *
 */
import * as _ from "lodash";
import { IStorage } from "../istorage";
import { ITime } from "../time";

/*
 * Structure to hold farm management minigame
 */

export class Farm {
	public coin: number;
	public flags: any;

	constructor(storage?: IStorage) {
		this.coin = 1000;

		this.flags = {};
		// this.flags["flag"] = 0;
		this.flags.Visit = 0;

		if (storage) { this.FromStorage(storage); }
	}

	public FromStorage(storage: IStorage) {
		this.coin = parseInt(storage.coin, 10) || this.coin;
		// Load flags
		_.forIn(storage.flags, (value, key) => {
			this.flags[key] = parseInt(value as string, 10);
		});
	}

	public ToStorage() {
		const storage: IStorage = {};
		storage.coin  = this.coin.toString();
		storage.flags = this.flags;

		return storage;
	}

	public Update(step: ITime) {
		// TODO: Farm produce etc
	}

	public Found() {
		return this.flags.Visit !== 0;
	}
}
