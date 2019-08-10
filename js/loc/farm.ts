/*
 *
 * Gwendy's farm
 *
 */

/*
 * Structure to hold farm management minigame
 */

export class Farm {
	coin : number;
	flags : any;

	constructor(storage? : any) {
		this.coin = 1000;

		this.flags = {};
		//this.flags["flag"] = 0;
		this.flags["Visit"] = 0;

		if(storage) this.FromStorage(storage);
	}
	
	FromStorage(storage : any) {
		this.coin = parseInt(storage.coin) || this.coin;
		// Load flags
		for(var flag in storage.flags)
			this.flags[flag] = parseInt(storage.flags[flag]);
	}

	ToStorage() {
		var storage : any = {};
		storage.coin  = this.coin;
		storage.flags = this.flags;

		return storage;
	}

	Update(step : number) {
		// TODO: Farm produce etc
	}

	Found() {
		return this.flags["Visit"] != 0;
	}
}

