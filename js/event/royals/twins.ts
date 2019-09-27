/*
 *
 * Define Twins (fighting entity)
 *
 */
import * as _ from "lodash";

import { Entity } from "../../entity";
import { IStorage } from "../../istorage";
import { ILocation } from "../../location";
import { ITime, Time } from "../../time";
import { TwinsFlags } from "./twins-flags";

export class Twins {
	public rumi: Rumi;
	public rani: Rani;
	public flags: any;
	public terryTimer: Time;

	constructor(storage?: IStorage) {
		this.rumi = new Rumi();
		this.rani = new Rani();

		this.flags = {};
		this.flags.Met = TwinsFlags.Met.NotMet;
		this.flags.SexOpen = 0;

		this.terryTimer = new Time();

		if (storage) { this.FromStorage(storage); }
	}

	public Relation() {
		return this.rumi.Relation() + this.rani.Relation();
	}

	public Update(step: ITime) {
		this.rumi.Update(step);
		this.rani.Update(step);
		this.terryTimer.Dec(step);
	}

	public FromStorage(storage: any) {
		if (storage.rumi) { this.rumi.FromStorage(storage.rumi); }
		if (storage.rani) { this.rani.FromStorage(storage.rani); }
		// Load flags
		_.forIn(storage.flags, (value, key) => {
			this.flags[key] = parseInt(value as string, 10);
		});

		this.terryTimer.FromStorage(storage.Ttime);
	}

	public ToStorage() {
		const storage: any = {};
		storage.rumi  = this.rumi.ToStorage();
		storage.rani  = this.rani.ToStorage();
		storage.flags = this.flags;

		storage.Ttime = this.terryTimer.ToStorage();

		return storage;
	}

	// Schedule
	public IsAtLocation(location?: ILocation) {
		return true;
	}
}

export class Rumi extends Entity {
	constructor() {
		super();
		this.ID = "rumi";
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
}

export class Rani extends Entity {
	constructor() {
		super();
		this.ID = "rani";
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
}
