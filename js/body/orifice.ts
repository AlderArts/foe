
import { IStorage } from "../istorage";
import { Womb } from "../pregnancy";
import { Stat } from "../stat";
import { IParse, Text } from "../text";
import { Cock } from "./cock";

export enum Capacity {
	tight  = 2,
	loose  = 5,
	gaping = 10,
}

enum TightnessEnum {
	tight    = 1,
	flexible = 2,
	loose    = 3,
	gaping   = 4,
}

export class Orifice {
	public capacity: Stat;
	public minStretch: Stat;
	public stretch: Stat;
	public womb: any; // todo
	public virgin: boolean;

	constructor() {
		this.capacity   = new Stat(6);
		this.minStretch = new Stat(1);
		this.stretch    = new Stat(1);
		this.womb       = new Womb();
		this.virgin     = true;
	}

	static get Tightness() { return TightnessEnum; }

	public ToStorage(full?: boolean) {
		const storage: IStorage = {
			cap    : this.capacity.base.toFixed(2),
			str    : this.stretch.base.toFixed(2),
			virgin : (this.virgin ? 1 : 0).toString(),
		};
		if (full) {
			storage.mstr = this.minStretch.base.toFixed(2);
		}
		return storage;
	}

	public FromStorage(storage: IStorage) {
		storage = storage || {};
		this.capacity.base   = parseFloat(storage.cap)  || this.capacity.base;
		this.minStretch.base = parseFloat(storage.mstr) || this.minStretch.base;
		this.stretch.base    = parseFloat(storage.str)  || this.stretch.base;
		this.virgin          = storage.hasOwnProperty("virgin") ? parseInt(storage.virgin, 10) === 1 : this.virgin;
	}

	public Capacity() {
		return this.capacity.Get();
	}
	public Cap() {
		return this.capacity.Get() * this.stretch.Get();
	}
	public Pregnant() {
		return this.womb.pregnant;
	}
	// TODO
	public Fits(cock: Cock, extension?: number) {
		extension = extension || 0;
		return cock.Thickness() <= (this.Cap() + extension);
	}
	public Tightness() {
		return this.stretch.Get();
	}
	public HandleStretchOverTime(hours: number) {
		// TODO rate
		this.stretch.DecreaseStat(this.minStretch.Get(), hours * 0.05);
	}

	public StretchOrifice(entity: any, cock: Cock, silent?: boolean) {
		const parse: IParse = {
			or   : this.holeDesc(),
			poss : entity.Possessive(),
		};

		const stretch = this.Tightness();
		const thk     = cock.Thickness();
		const cap     = this.Cap();
		const ratio   = thk / cap;

		if (ratio < 0.5) {
			this.stretch.IncreaseStat(Orifice.Tightness.flexible, 0.25);
		} else if (ratio < 1) {
			this.stretch.IncreaseStat(Orifice.Tightness.loose, 0.5);
		} else {
					this.stretch.IncreaseStat(Orifice.Tightness.gaping, 0.75);
		}

		if (!silent) {
			const stretch2 = this.Tightness();
			if (stretch < Orifice.Tightness.flexible && stretch2 >= Orifice.Tightness.flexible) {
				Text.Add("<b>[poss] [or] has become loose.</b>", parse);
				Text.NL();
			}
			if (stretch < Orifice.Tightness.loose && stretch2 >= Orifice.Tightness.loose) {
				Text.Add("<b>[poss] [or] has become gaping.</b>", parse);
				Text.NL();
			}
		}
	}

	// Should be overridden
	public holeDesc() {
		return "ORIFICE";
	}

}
