import * as _ from "lodash";
import { IStorage } from "../istorage";
import { Stat } from "../stat";
import { BodyPart } from "./bodypart";
import { Color } from "./color";
import { RaceDesc } from "./race";

export enum NippleType {
	ordinary = 0,
	inverted = 1,
	lipple   = 2,
	cunt     = 3,
	cock     = 4,
}

export enum BreastSize {
	Small = 3,
}

// Defines a PAIR of breasts (or row)
export class Breasts extends BodyPart {
	public nippleCount: number;
	public nippleType: NippleType;
	public size: Stat;
	public nippleThickness: Stat;
	public nippleLength: Stat;

	constructor(race?: RaceDesc, color?: Color) {
		super(race, color);
		this.nippleCount     = 1; // Nipples/aerola
		this.nippleType      = NippleType.ordinary;
		this.size            = new Stat(1);
		this.nippleThickness = new Stat(0.5);
		this.nippleLength    = new Stat(0.5);
	}

	public ToStorage(full: boolean) {
		const storage: IStorage = {
			size    : this.size.base.toFixed(2),
		};
		if (full) {
			storage.nipC    = this.nippleCount.toFixed();
			storage.col     = this.color.toFixed();
			storage.race    = this.race.id.toFixed();
			storage.nipThk  = this.nippleThickness.base.toFixed(2);
			storage.nipLen  = this.nippleLength.base.toFixed(2);
			storage.nipType = this.nippleType.toFixed();
		}
		return storage;
	}

	public FromStorage(storage: IStorage) {
		storage = storage || {};
		this.color                = parseInt(storage.col, 10)      || this.color;
		this.race                 = RaceDesc.IdToRace[parseInt(storage.race, 10)] || this.race;
		this.nippleCount          = parseInt(storage.nipC, 10)     || this.nippleCount;
		this.size.base            = parseFloat(storage.size)   || this.size.base;
		this.nippleThickness.base = parseFloat(storage.nipThk) || this.nippleThickness.base;
		this.nippleLength.base    = parseFloat(storage.nipLen) || this.nippleLength.base;
		this.nippleType           = parseInt(storage.nipType, 10)  || this.nippleType;
	}

	public Size() {
		return this.size.Get();
	}
	public NipSize() {
		return this.nippleThickness.Get() * this.nippleLength.Get();
	}
	public noun() {
		const size = this.size.Get();
		const nouns = new Array();
		if (size <= 2) { nouns.push("pec"); }
		nouns.push("breast");
		if (size >= 3) {
			nouns.push("boob");
			nouns.push("mound");
			nouns.push("mammary");
			nouns.push("globe");
			nouns.push("tit");
			nouns.push("can");
		}
		if (size >= 15) {
			nouns.push("jug");
			nouns.push("dug");
			nouns.push("melon");
			nouns.push("hooter");
			nouns.push("pillow");
		}
		return _.sample(nouns);
	}
	public nounPlural() {
		const size = this.size.Get();
		const nouns = new Array();
		if (size <= 2) { nouns.push("pecs"); }
		nouns.push("breasts");
		if (size >= 3) {
			nouns.push("boobs");
			nouns.push("mounds");
			nouns.push("mammaries");
			nouns.push("globes");
			nouns.push("tits");
			nouns.push("cans");
		}
		if (size >= 15) {
			nouns.push("jugs");
			nouns.push("dugs");
			nouns.push("melons");
			nouns.push("hooters");
			nouns.push("pillows");
		}
		return _.sample(nouns);
	}
	public Desc() {
		const size = this.size.Get();

		const adjs = [];
		if (size <= 2) {
			adjs.push("manly");
			adjs.push("flat");
		}
		if (size > 2 && size <= 5) {
			adjs.push("tiny");
			adjs.push("petite");
			adjs.push("budding");
			adjs.push("small");
		}
		if (size > 5 && size <= 10) {
			adjs.push("well-proportioned");
			adjs.push("perky");
			adjs.push("ample");
			adjs.push("pert");
		}
		if (size > 10 && size <= 20) {
			adjs.push("large");
			adjs.push("huge");
			adjs.push("hefty");
			adjs.push("plentiful");
			adjs.push("bountiful");
		}
		if (size > 20 && size <= 40) {
			adjs.push("massive");
			adjs.push("immense");
			adjs.push("enormous");
		}
		if (size > 30 && size <= 50) {
			adjs.push("ridiculously large");
			adjs.push("ludicrous");
			adjs.push("gargantuan");
		}
		if (size > 40) {
			adjs.push("titanic");
			adjs.push("inhumanly large");
			adjs.push("monstrous");
			adjs.push("Jacques-sized");
		}
		const adj = _.sample(adjs);
		const sizeStr = size / 2 + " inches";

		return {a: "a pair of", adj, cup: this.Cup(), size: sizeStr};
	}
	public Cup() {
		const size = this.size.Get();
		if (size <= 1) {
			return "manly";
		} else if (size <= 2) {
			return "AA-cup";
		} else if (size <= 3) {
			return "A-cup";
		} else if (size <= 5) {
			return "B-cup";
		} else if (size <= 7.5) {
			return "C-cup";
		} else if (size <= 10) {
			return "D-cup";
		} else if (size <= 12.5) {
			return "E-cup";
		} else if (size <= 15) {
			return "F-cup";
		} else if (size <= 17.5) {
			return "G-cup";
		} else if (size <= 20) {
			return "H-cup";
		} else if (size <= 22.5) {
			return "I-cup";
		} else if (size <= 25) {
			return "J-cup";
		} else if (size <= 27.5) {
			return "K-cup";
		} else if (size <= 30) {
			return "L-cup";
		} else if (size <= 32.5) {
			return "M-cup";
		} else if (size <= 35) {
			return "N-cup";
		} else if (size <= 37.5) {
			return "O-cup";
		} else if (size <= 40) {
			return "P-cup";
		} else if (size <= 42.5) {
			return "Q-cup";
		} else if (size <= 45) {
			return "R-cup";
		} else if (size <= 47.5) {
			return "S-cup";
		} else if (size <= 50) {
			return "T-cup";
		} else if (size <= 52.5) {
			return "U-cup";
		} else if (size <= 55) {
			return "V-cup";
		} else if (size <= 57.5) {
			return "W-cup";
		} else if (size <= 60) {
			return "X-cup";
		} else if (size <= 70) {
			return "XX-cup";
		} else if (size <= 80) {
			return "XXX-cup";
		} else if (size <= 90) {
			return "Y-cup";
		} else if (size <= 100) {
			return "YY-cup";
		} else if (size <= 110) {
			return "YYY-cup";
		} else if (size <= 120) {
			return "Z-cup";
		} else if (size <= 130) {
			return "ZZ-cup";
		} else {
			return "ZZZ-cup";
		}
	}
	public nipNoun() {
		// TODO
		return "nipple";
	}
	public nipNounPlural() {
		// TODO
		return "nipples";
	}
	public nipDesc() {
		// TODO
		const adj = "perky";

		const nipLen = this.nippleLength.Get() / 2 + " inches";
		const nipThickness = this.nippleThickness.Get() / 2 + " inches";

		return {a: "a", adj, len: nipLen, thickness: nipThickness};
	}
	public NipShort() {
		const desc = this.nipDesc();
		return `${desc.adj} ${this.nipNoun()}`;
	}
	public NipsShort() {
		const desc = this.nipDesc();
		return `${desc.adj} ${this.nipNounPlural()}`;
	}
	public Short() {
		const desc = this.Desc();
		return `${desc.adj} ${this.nounPlural()}`;
	}
	public ShortCup() {
		const desc = this.Desc();
		return `${desc.cup} ${this.nounPlural()}`;
	}
	// TODO: lactation
	public Long() {
		const desc = this.Desc();
		return `${desc.a} ${desc.adj}, ${desc.cup} ${this.nounPlural()}`;
	}

}
