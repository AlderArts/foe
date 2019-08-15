
import { Stat } from "../stat";
import { Text } from "../text";
import { Rand } from "../utility";
import { BodyPart } from "./bodypart";
import { Color } from "./color";
import { RaceDesc } from "./race";

export class Balls extends BodyPart {
	public count: Stat;
	public size: Stat;
	public cumProduction: Stat;
	public cumCap: Stat;
	public cum: Stat;
	public fertility: Stat;

	constructor(race?: RaceDesc, color?: Color) {
		super(race, color);
		this.count         = new Stat(0);
		this.size          = new Stat(3);
		this.cumProduction = new Stat(1);
		this.cumCap        = new Stat(5); // Maximum cum
		this.cum           = new Stat(0); // Current accumulated cum
		this.fertility     = new Stat(0.3); // 0..1
	}

	public BallSize() {
		return this.size.Get();
	}
	public SackSize() {
		return this.size.Get() * this.count.Get();
	}

	public ToStorage(full: boolean) {
		const storage: any = {
			cum   : this.cum.base.toFixed(2),
			cumC  : this.cumCap.base.toFixed(2),
			cumP  : this.cumProduction.base.toFixed(2),
			fer   : this.fertility.base.toFixed(2),
			size  : this.size.base.toFixed(2),
		};
		if (full) {
			storage.race  = this.race.id.toFixed();
			storage.col   = this.color.toFixed();
			storage.count = this.count.base.toFixed();
		}
		return storage;
	}

	public FromStorage(storage: any) {
		storage = storage || {};
		this.race               = RaceDesc.IdToRace[parseInt(storage.race, 10)] || this.race;
		this.color              = parseInt(storage.col, 10)    || this.color;
		this.count.base         = parseInt(storage.count, 10)  || this.count.base;
		this.size.base          = parseFloat(storage.size) || this.size.base;
		this.cum.base           = parseFloat(storage.cum)  || this.cum.base;
		this.cumProduction.base = parseFloat(storage.cumP) || this.cumProduction.base;
		this.cumCap.base        = parseFloat(storage.cumC) || this.cumCap.base;
		this.fertility.base     = parseFloat(storage.fer)  || this.fertility.base;
	}

	public CumCap() {
		const num = this.count.Get();
		let cap = this.cumCap.Get();
		cap += num * this.size.Get();
		return cap;
	}

	public noun() {
		const count = this.count.Get();
		const nouns = new Array();
		if (Math.random() < 0.5) {
			nouns.push("ball");
			if (count === 4) {
				nouns.push("quad");
			}
		} else {
			nouns.push("teste");
			nouns.push("gonad");
			nouns.push("nut");
			nouns.push("testicle");
		}
		let noun = nouns[Rand(nouns.length)];
		if (count > 1) { noun += "s"; }
		return noun;
	}

	public adj() {
		const size = this.size.Get();
		const adjs = [];
		if (size < 2) {
			adjs.push("small");
			adjs.push("diminitive");
			adjs.push("petite");
			adjs.push("tiny");
		}
		if (size >= 2 && size < 5) {
			adjs.push("well-proportioned");
		}
		if (size >= 4 && size < 8) {
			adjs.push("large");
		}
		if (size >= 8) {
			adjs.push("expansive");
			adjs.push("massive");
			adjs.push("huge");
		}
		if (size >= 16) {
			adjs.push("immense");
			adjs.push("gargantuan");
			adjs.push("humonguous");
			adjs.push("enormous");
			adjs.push("titanic");
		}

		if (size >= 4  && size < 5) {  adjs.push("baseball-sized"); }
		if (size >= 5  && size < 7) {  adjs.push("apple-sized"); }
		if (size >= 7  && size < 9) {  adjs.push("grapefruit-sized"); }
		if (size >= 9  && size < 12) { adjs.push("cantaloupe-sized"); }
		if (size >= 12 && size < 15) { adjs.push("soccerball-sized"); }
		if (size >= 15 && size < 18) { adjs.push("basketball-sized"); }
		if (size >= 18 && size < 22) { adjs.push("watermelon-sized"); }
		if (size >= 22 && size < 27) { adjs.push("beachball-sized"); }
		if (size >= 27) {              adjs.push("hideously swollen and oversized"); }

		return adjs[Rand(adjs.length)];
	}

	public adj2() {
		const adjs = [];
		if (this.cum.Get() / this.CumCap() > 0.8) {
			adjs.push("overflowing ");
			adjs.push("swollen ");
			adjs.push("engorged ");
			adjs.push("cum-engorged ");
		}
		if (this.cum.Get() / this.CumCap() > 0.5) {
			adjs.push("eager ");
			adjs.push("full ");
			adjs.push("needy ");
			adjs.push("desperate ");
			adjs.push("throbbing ");
			adjs.push("heated ");
		} else { return ""; }

		return adjs[Rand(adjs.length)];
	}

	public Short() {
		const count = this.count.Get();
		if (count === 0) { return "prostate"; }

		let str = "";
		if (Math.random() > 0.5) {
			str += Text.Quantify(count);
			if (count > 1) { str += " of "; } else {          str += " "; }
		}
		if (Math.random() > 0.5) {
			str += this.adj() + " ";
		}
		if (Math.random() > 0.5) {
			str += this.adj2();
		}
		str += this.noun();

		return str;
	}

	public Long() {
		const count = this.count.Get();
		if (count === 0) { return "prostate"; }

		let str = "";
		str += "a " + Text.Quantify(count);
		if (count > 1) { str += " of "; } else {          str += " "; }
		str += this.adj() + " ";
		str += this.adj2();
		str += this.noun();

		return str;
	}
}
