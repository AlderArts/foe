/*
 *
 * Gwendy's farm
 *
 */
import * as _ from "lodash";

/*
 * Structure to hold farm management minigame
 */

export class Farm {
	public coin: number;
	public flags: any;

	constructor(storage?: any) {
		this.coin = 1000;

		this.flags = {};
		// this.flags["flag"] = 0;
		this.flags.Visit = 0;

		if (storage) { this.FromStorage(storage); }
	}

	public FromStorage(storage: any) {
		this.coin = parseInt(storage.coin, 10) || this.coin;
		// Load flags
		_.forIn(storage.flags, (value, key) => {
			this.flags[key] = parseInt(value, 10);
		});
	}

	public ToStorage() {
		const storage: any = {};
		storage.coin  = this.coin;
		storage.flags = this.flags;

		return storage;
	}

	public Update(step: number) {
		// TODO: Farm produce etc
	}

	public Found() {
		return this.flags.Visit !== 0;
	}
}
