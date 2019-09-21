
import { Stat } from "../stat";
import { Appendage } from "./appendage";
import { BodyPart } from "./bodypart";
import { Hair } from "./hair";
import { RaceDesc } from "./race";

export interface IMouth {
	capacity: Stat;
	tongue: BodyPart;
}

class Eyes extends BodyPart {
	public count: Stat;
	constructor() {
		super();
		this.count = new Stat(2);
	}
}

export class Head extends BodyPart {
	public mouth: IMouth;
	public hair: Hair;
	public eyes: Eyes;
	public ears: BodyPart;
	public appendages: Appendage[];

	constructor() {
		super();

		this.mouth = {
			capacity     : new Stat(30),
			tongue       : new BodyPart(),
		};
		this.hair = new Hair();
		this.eyes = new Eyes();
		this.ears = new BodyPart();
		// Appendages (antenna etc)
		this.appendages = [];
	}

	public ToStorage() {
		const storage: any = {
			col  : this.color.toFixed(),
			race : this.race.id.toFixed(),
		};
		storage.mouth = {
			cap  : this.mouth.capacity.base.toFixed(2),
			ton  : {race : this.mouth.tongue.race.id.toFixed(), col : this.mouth.tongue.color.toFixed()},
		};
		storage.hair = this.hair.ToStorage();
		storage.eyes = {
			col   : this.eyes.color.toFixed(),
			count : this.eyes.count.base.toFixed(),
			race  : this.eyes.race.id.toFixed(),
		};
		storage.ears = {
			col  : this.ears.color.toFixed(),
			race : this.ears.race.id.toFixed(),
		};
		if (this.appendages.length > 0) {
			storage.app = new Array();
			for (const app of this.appendages) {
				storage.app.push(app.ToStorage());
			}
		}

		return storage;
	}

	public FromStorage(storage?: any) {
		storage = storage || {};

		this.race   = (storage.race === undefined) ? this.race : RaceDesc.IdToRace[parseInt(storage.race, 10)];
		this.color  = (storage.col === undefined) ? this.color : parseInt(storage.col, 10);

		if (storage.mouth) {
			this.mouth.tongue.race       = (storage.mouth.ton.race === undefined) ? this.mouth.tongue.race : RaceDesc.IdToRace[parseInt(storage.mouth.ton.race, 10)];
			this.mouth.tongue.color      = (storage.mouth.ton.col === undefined) ? this.mouth.tongue.color : parseInt(storage.mouth.ton.col, 10);
			this.mouth.capacity.base     = (storage.mouth.cap === undefined) ? this.mouth.capacity.base : parseFloat(storage.mouth.cap);
		}
		if (storage.hair) {
			this.hair.FromStorage(storage.hair);
		}
		if (storage.eyes) {
			this.eyes.race        = (storage.eyes.race === undefined) ? this.eyes.race : RaceDesc.IdToRace[parseInt(storage.eyes.race, 10)];
			this.eyes.color       = (storage.eyes.col === undefined) ? this.eyes.color : parseInt(storage.eyes.col, 10);
			this.eyes.count.base  = (storage.eyes.count === undefined) ? this.eyes.count.base : parseInt(storage.eyes.count, 10);
		}
		if (storage.ears) {
			this.ears.race        = (storage.ears.race === undefined) ? this.ears.race : RaceDesc.IdToRace[parseInt(storage.ears.race, 10)];
			this.ears.color       = (storage.ears.col === undefined) ? this.ears.color : parseInt(storage.ears.col, 10);
		}

		if (storage.app) {
			this.appendages = new Array();
			for (const app of storage.app) {
				const newApp = new Appendage();
				newApp.FromStorage(app);
				this.appendages.push(newApp);
			}
		}
	}

	public SetRace(race: RaceDesc) {
		this.race              = race;
		this.mouth.tongue.race = race;
		this.eyes.race         = race;
		this.ears.race         = race;
	}

	public NumAttributes(race: RaceDesc) {
		let sum = 0;
		if (this.race === race) {              sum++; }
		if (this.mouth.tongue.race === race) { sum++; }
		if (this.eyes.race === race) {         sum++; }
		if (this.ears.race === race) {         sum++; }
		for (const app of this.appendages) {
			if (app.race === race) { sum++;
		} }
		return sum;
	}

}
