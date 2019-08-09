
import { BodyPart } from './bodypart';
import { Stat } from '../stat';
import { Rand } from '../utility';
import { Text } from '../text';
import { RaceDesc } from './race';
import { Color } from './color';

export class Balls extends BodyPart {
	count : Stat;
	size : Stat;
	cumProduction : Stat;
	cumCap : Stat;
	cum : Stat;
	fertility : Stat;

	constructor(race? : RaceDesc, color? : Color) {
		super(race, color);
		this.count         = new Stat(0);
		this.size          = new Stat(3);
		this.cumProduction = new Stat(1);
		this.cumCap        = new Stat(5); // Maximum cum
		this.cum           = new Stat(0); // Current accumulated cum
		this.fertility     = new Stat(0.3); // 0..1
	}

	BallSize() {
		return this.size.Get();
	}
	SackSize() {
		return this.size.Get() * this.count.Get();
	}

	ToStorage(full : boolean) {
		var storage : any = {
			size  : this.size.base.toFixed(2),
			cum   : this.cum.base.toFixed(2),
			cumP  : this.cumProduction.base.toFixed(2),
			cumC  : this.cumCap.base.toFixed(2),
			fer   : this.fertility.base.toFixed(2)
		};
		if(full) {
			storage.race  = this.race.id.toFixed();
			storage.col   = this.color.toFixed();
			storage.count = this.count.base.toFixed();
		}
		return storage;
	}

	FromStorage(storage : any) {
		storage = storage || {};
		this.race               = RaceDesc.IdToRace[parseInt(storage.race)] || this.race;
		this.color              = parseInt(storage.col)    || this.color;
		this.count.base         = parseInt(storage.count)  || this.count.base;
		this.size.base          = parseFloat(storage.size) || this.size.base;
		this.cum.base           = parseFloat(storage.cum)  || this.cum.base;
		this.cumProduction.base = parseFloat(storage.cumP) || this.cumProduction.base;
		this.cumCap.base        = parseFloat(storage.cumC) || this.cumCap.base;
		this.fertility.base     = parseFloat(storage.fer)  || this.fertility.base;
	}

	CumCap() {
		var num = this.count.Get();
		var cap = this.cumCap.Get();
		cap += num * this.size.Get();
		return cap;
	}

	noun() {
		var count = this.count.Get();
		var nouns = new Array();
		if(Math.random() < 0.5) {
			nouns.push("ball");
			if(count == 4)
				nouns.push("quad");
		}
		else {
			nouns.push("teste");
			nouns.push("gonad");
			nouns.push("nut");
			nouns.push("testicle");
		}
		var noun = nouns[Rand(nouns.length)];
		if(count > 1) noun += "s";
		return noun;
	}

	adj() {
		var size = this.size.Get();
		var adjs = [];
		if(size < 2) {
			adjs.push("small");
			adjs.push("diminitive");
			adjs.push("petite");
			adjs.push("tiny");
		}
		if(size >= 2 && size < 5) {
			adjs.push("well-proportioned");
		}
		if(size >= 4 && size < 8) {
			adjs.push("large");
		}
		if(size >= 8) {
			adjs.push("expansive");
			adjs.push("massive");
			adjs.push("huge");
		}
		if(size >= 16) {
			adjs.push("immense");
			adjs.push("gargantuan");
			adjs.push("humonguous");
			adjs.push("enormous");
			adjs.push("titanic");
		}
		
		if(size >= 4  && size < 5)  adjs.push("baseball-sized");
		if(size >= 5  && size < 7)  adjs.push("apple-sized");
		if(size >= 7  && size < 9)  adjs.push("grapefruit-sized");
		if(size >= 9  && size < 12) adjs.push("cantaloupe-sized");
		if(size >= 12 && size < 15) adjs.push("soccerball-sized");
		if(size >= 15 && size < 18) adjs.push("basketball-sized");
		if(size >= 18 && size < 22) adjs.push("watermelon-sized");
		if(size >= 22 && size < 27) adjs.push("beachball-sized");
		if(size >= 27)              adjs.push("hideously swollen and oversized");
		
		return adjs[Rand(adjs.length)];
	}

	adj2() {
		var adjs = [];
		if(this.cum.Get() / this.CumCap() > 0.8) {
			adjs.push("overflowing ");
			adjs.push("swollen ");
			adjs.push("engorged ");
			adjs.push("cum-engorged ");
		}
		if(this.cum.Get() / this.CumCap() > 0.5) {
			adjs.push("eager ");
			adjs.push("full ");
			adjs.push("needy ");
			adjs.push("desperate ");
			adjs.push("throbbing ");
			adjs.push("heated ");
		}
		else return "";
		
		return adjs[Rand(adjs.length)];
	}

	Short() {
		var count = this.count.Get();
		if(count == 0) return "prostate";
		
		var str = "";
		if(Math.random() > 0.5) {
			str += Text.Quantify(count);
			if(count > 1) str += " of ";
			else          str += " ";
		}
		if(Math.random() > 0.5)
			str += this.adj() + " ";
		if(Math.random() > 0.5)
			str += this.adj2();
		str += this.noun();
		
		return str;
	}

	Long() {
		var count = this.count.Get();
		if(count == 0) return "prostate";
		
		var str = "";
		str += "a " + Text.Quantify(count);
		if(count > 1) str += " of ";
		else          str += " ";
		str += this.adj() + " ";
		str += this.adj2();
		str += this.noun();
		
		return str;
	}
}

