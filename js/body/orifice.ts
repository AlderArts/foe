
import { Stat } from '../stat';
import { Womb } from '../pregnancy';
import { Text } from '../text';
import { Cock } from './cock';

export enum Capacity {
	tight  = 2,
	loose  = 5,
	gaping = 10,
};

enum TightnessEnum {
	tight    = 1,
	flexible = 2,
	loose    = 3,
	gaping   = 4,
};

export class Orifice {
	capacity : Stat;
	minStretch : Stat;
	stretch : Stat;
	womb : any; // todo
	virgin : boolean;
	
	constructor() {
		this.capacity   = new Stat(6);
		this.minStretch = new Stat(1);
		this.stretch    = new Stat(1);
		this.womb       = new Womb();
		this.virgin     = true;
	}
	
	static get Tightness() { return TightnessEnum; }

	ToStorage(full? : boolean) {
		var storage : any = {
			cap    : this.capacity.base.toFixed(2),
			str    : this.stretch.base.toFixed(2),
			virgin : this.virgin ? 1 : 0
		};
		if(full) {
			storage.mstr = this.minStretch.base.toFixed(2);
		}
		return storage;
	}

	FromStorage(storage : any) {
		storage = storage || {};
		this.capacity.base   = parseFloat(storage.cap)  || this.capacity.base;
		this.minStretch.base = parseFloat(storage.mstr) || this.minStretch.base;
		this.stretch.base    = parseFloat(storage.str)  || this.stretch.base;
		this.virgin          = storage.hasOwnProperty("virgin") ? parseInt(storage.virgin) == 1 : this.virgin;
	}

	Capacity() {
		return this.capacity.Get();
	}
	Cap() {
		return this.capacity.Get() * this.stretch.Get();
	}
	Pregnant() {
		return this.womb.pregnant;
	}
	// TODO
	Fits(cock : Cock, extension? : number) {
		extension = extension || 0;
		return cock.Thickness() <= (this.Cap() + extension);
	}
	Tightness() {
		return this.stretch.Get();
	}
	HandleStretchOverTime(hours : number) {
		//TODO rate
		this.stretch.DecreaseStat(this.minStretch.Get(), hours * 0.05);
	}

	StretchOrifice(entity : any, cock : Cock, silent? : boolean) {
		var parse : any = {
			poss : entity.Possessive(),
			or   : this.holeDesc()
		};
		
		var stretch = this.Tightness();
		var thk     = cock.Thickness();
		var cap     = this.Cap();
		var ratio   = thk / cap;
		
		if(ratio < 0.5)
			this.stretch.IncreaseStat(Orifice.Tightness.flexible, 0.25);
		else if(ratio < 1)
			this.stretch.IncreaseStat(Orifice.Tightness.loose, 0.5);
		else
			this.stretch.IncreaseStat(Orifice.Tightness.gaping, 0.75);
		
		if(!silent) {
			var stretch2 = this.Tightness();
			if(stretch < Orifice.Tightness.flexible && stretch2 >= Orifice.Tightness.flexible) {
				Text.Add("<b>[poss] [or] has become loose.</b>", parse);
				Text.NL();
			}
			if(stretch < Orifice.Tightness.loose && stretch2 >= Orifice.Tightness.loose) {
				Text.Add("<b>[poss] [or] has become gaping.</b>", parse);
				Text.NL();
			}
		}
	}

	//Should be overridden
	holeDesc() {
		return "ORIFICE";
	}

}
