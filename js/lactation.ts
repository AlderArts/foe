/*
 * Lactation handler
 */

import { Stat } from "./stat";

export class LactationHandler {
	public entity: any;
	public lactating: boolean;
	public lactationRate: Stat;
	public milkProduction: Stat;
	public milkCap: Stat;
	public milk: Stat;

	constructor(entity: any, storage?: any) {
		this.entity = entity;

		const debugName = () => entity.name + ".body";

		this.lactating      = false;
		this.lactationRate  = new Stat(0);
		this.lactationRate.debug = () => debugName() + ".lactationRate";
		this.milkProduction = new Stat(0);
		this.milkProduction.debug = () => debugName() + ".milkProduction";
		this.milkCap        = new Stat(0);
		this.milkCap.debug = () => debugName() + ".milkCap";
		this.milk           = new Stat(0);

		if (storage) { this.FromStorage(storage); }
	}

	public ToStorage() {
		const storage: any = {};

		storage.lact  = this.lactating ? 1 : 0;
		storage.lactR = this.lactationRate.base;
		storage.milk  = this.milk.base;
		storage.milkP = this.milkProduction.base;
		storage.milkC = this.milkCap.base;

		return storage;
	}

	public FromStorage(storage: any = {}) {
		this.lactating           = parseInt(storage.lact, 10) === 1;
		this.lactationRate.base  = parseFloat(storage.lactR) || this.lactationRate.base;
		this.milk.base           = parseFloat(storage.milk)  || this.milk.base;
		this.milkProduction.base = parseFloat(storage.milkP) || this.milkProduction.base;
		this.milkCap.base        = parseFloat(storage.milkC) || this.milkCap.base;
	}

	public CanLactate() {
		const body = this.entity.body;
		if (body.breasts.length === 0) {
			return false;
		} else if (body.breasts[0].Size() < 2) {
			return false;
 		} else {
			return true;
 		}
	}
	public Lactation() {
		return this.CanLactate() && this.lactating;
	}
	public Rate() {
		return this.lactationRate.Get();
	}
	public Production() {
		return this.milkProduction.Get();
	}
	public Milk() {
		return this.milk.Get();
	}
	// TODO Balance
	public MilkCap() {
		const body = this.entity.body;
		let cap  = this.milkCap.Get();
		for (const breast of body.breasts) {
			cap += breast.Size();
		}
		return cap;
	}
	public MilkLevel() {
		const cap = this.MilkCap();
		if (cap !== 0) {
			return this.Milk() / cap;
		} else {
			return 0;
		}
	}

	public Update(hours: number) {
		let inc = this.milkProduction.Get() * hours;
		if (this.Lactation()) {
			inc -= this.lactationRate.Get() * hours;
		}

		const oldMilk = this.MilkLevel();
		if (inc > 0) {
			this.milk.IncreaseStat(this.MilkCap(), inc, true);

		} else if (inc < 0) {
			this.milk.DecreaseStat(0, -inc, true);
		}
		const newMilk = this.MilkLevel();

		if (this.Milk() >= this.MilkCap()) {
			this.entity.MilkFull();
		}
		if (this.Lactation()) {
			if (this.Milk() <= 0) {
				this.entity.MilkDrained();
			}
		}

		this.entity.LactationProgress(oldMilk, newMilk, this.Rate());
	}

	public MilkDrain(drain: number) {
		return this.milk.DecreaseStat(0, drain);
	}
	public MilkDrainFraction(fraction: number) {
		fraction = fraction || 1;
		return this.milk.DecreaseStat(0, this.MilkCap() * fraction);
	}
	public FillMilk(fraction: number) {
		fraction = fraction || 1;
		this.milk.IncreaseStat(this.MilkCap(), this.MilkCap() * fraction);
	}
	public MilkDrained() {
		this.lactating = false;
	}
	public MilkFull() {
		this.lactating = true;
	}
}
