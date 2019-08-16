import * as _ from "lodash";

import { Stat } from "../stat";
import { BodyPart } from "./bodypart";
import { Color } from "./color";
import { Gender } from "./gender";
import { Race, RaceDesc } from "./race";
import { Vagina } from "./vagina";

export enum CockType {
	ordinary   = 0,
// 	clitcock   = 1,
	tentacle   = 2,
	ovipositor = 3,
}

export class Cock extends BodyPart {
	public thickness: Stat;
	public length: Stat;
	public type: CockType;
	public vag: Vagina;
	public knot: number;
	public isStrapon: boolean;

	constructor(race?: RaceDesc, color?: Color) {
		super(race, color);
		this.thickness = new Stat(3);
		this.length    = new Stat(12);
		this.type      = CockType.ordinary;
		this.knot      = 0;
		this.isStrapon = false;
	}

	public ToStorage(full: boolean) {
		const storage: any = {
			len    : this.length.base.toFixed(2),
			thk    : this.thickness.base.toFixed(2),
		};
		if (full) {
			storage.race = this.race.id.toFixed();
			storage.col  = this.color.toFixed();
			if (this.type !== CockType.ordinary) { storage.type = this.type.toFixed(); }
			if (this.knot !== 0) { storage.knot = this.knot.toFixed(); }
		}
		return storage;
	}

	public FromStorage(storage: any) {
		storage = storage || {};
		this.race           = RaceDesc.IdToRace[parseInt(storage.race, 10)] || this.race;
		this.color          = parseInt(storage.col, 10)    || this.color;
		this.type           = parseInt(storage.type, 10)   || this.type;
		this.length.base    = parseFloat(storage.len)  || this.length.base;
		this.thickness.base = parseFloat(storage.thk)  || this.thickness.base;
		this.knot           = parseInt(storage.knot, 10)   || this.knot;
	}

	public Clone() {
		const cock            = new Cock(this.race, this.color);
		cock.thickness.base = this.thickness.base;
		cock.length.base    = this.length.base;
		cock.knot           = this.knot;
		return cock;
	}

	public Len() {
		return this.length.Get();
	}
	public Thickness() {
		return this.thickness.Get();
	}
	public Size() {
		return this.thickness.Get() * this.length.Get();
	}
	public Volume() {
		const r = this.thickness.Get() / 2;
		return Math.PI * r * r * this.length.Get();
	}
	public Knot() {
		return this.knot !== 0;
	}
	public Sheath() {
		return this.race.isRace(
			Race.Horse,
			Race.Cow,
			Race.Sheep,
			Race.Goat,
			Race.Feline,
			Race.Canine,
			Race.Musteline,
			Race.Rabbit);
	}
	public Strapon() {
		return this.isStrapon;
	}

	public noun() {
		const noun = [];
		if (this.vag) {
			noun.push("clit-cock");
			noun.push("girl-cock");
		}
		if (this.type === CockType.tentacle) {
			noun.push("tentacle");
			noun.push("tentacle-cock");
		} else if (this.type === CockType.ovipositor) {
			noun.push("ovipositor");
			noun.push("egg-layer");
		} else {
			noun.push("cock");
			noun.push("dick");
			noun.push("manhood");
			noun.push("member");
			noun.push("slab of meat");
			noun.push("penis");
			noun.push("phallus");
			noun.push("prick");
			noun.push("rod");
			noun.push("shaft");
			noun.push("dong");
		}
		return _.sample(noun);
	}
	public nounPlural() {
		const noun = [];
		noun.push("cocks");
		noun.push("dicks");
		noun.push("manhoods");
		noun.push("members");
		noun.push("slabs of meat");
		noun.push("penises");
		noun.push("phalluses");
		noun.push("pricks");
		noun.push("rods");
		noun.push("shafts");
		noun.push("dongs");
		return _.sample(noun);
	}
	public Desc() {
		let ret: any;
		const cockArea = this.thickness.Get() * this.length.Get();
		if     (cockArea <= 10 ) { ret = _.sample([{a: "a", adj: "tiny"}, {a: "a", adj: "pathetic"}, {a: "a", adj: "micro"}, {a: "an", adj: "undersized"}]); } else if (cockArea <= 20 ) { ret = _.sample([{a: "a", adj: "small"}, {a: "a", adj: "petite"}]); } else if (cockArea <= 30 ) { ret = _.sample([{a: "a", adj: "below average"}, {a: "a", adj: "modest"}]); } else if (cockArea <= 40 ) { ret = _.sample([{a: "a", adj: "well-proportioned"}, {a: "an", adj: "average"}]); } else if (cockArea <= 50 ) { ret = _.sample([{a: "a", adj: "strapping"}, {a: "a", adj: "respectable"}, {a: "an", adj: "ample"}]); } else if (cockArea <= 70 ) { ret = _.sample([{a: "a", adj: "big"}]); } else if (cockArea <= 90 ) { ret = _.sample([{a: "a", adj: "large"}, {a: "a", adj: "sizable"}]); } else if (cockArea <= 120) { ret = _.sample([{a: "a", adj: "huge"}, {a: "a", adj: "hefty"}]); } else if (cockArea <= 200) { ret = _.sample([{a: "an", adj: "enormous"}, {a: "a", adj: "massive"}, {a: "a", adj: "humongous"}]); } else if (cockArea <= 400) { ret = _.sample([{a: "an", adj: "immense"}, {a: "a", adj: "colossal"}, {a: "a", adj: "mammoth"}]); } else if (cockArea <= 800) { ret = _.sample([{a: "a", adj: "gargantuan"}, {a: "a", adj: "gigantic"}, {a: "a", adj: "monster sized"}]); } else {                     ret = _.sample([{a: "a", adj: "titanic"}, {a: "a", adj: "vast"}]); }

		ret.len = this.length.Get() / 2 + " inches";
		ret.thickness = this.thickness.Get() / 2 + " inches";

		return ret;
	}
	public Short() {
		const desc = this.Desc();
		const noun = this.noun();
		const adj = (Math.random() < 0.5) ? desc.adj : "";
		let knotted = "";
		if (this.Knot() && (Math.random() < 0.5)) {
			if (adj) { knotted += ", "; }
			knotted += "knotted";
		}
		let sheath = "";
		if (this.Sheath() && (Math.random() < 0.5)) {
			if (adj || knotted) { sheath += ", "; }
			sheath += "sheathed";
		}
		let race = "";
		if ((this.race !== Race.Human) && (Math.random() < 0.5)) { race += " " + this.race.Short(Gender.male); }
		let ret = adj + knotted + sheath + race;
		if (ret) { ret += " "; }
		return ret + noun;
	}
	// TODO
	public TipShort() {
		let adj = "";

		if (this.race.isRace(Race.Horse)) { adj = "flared "; } else if (this.race.isRace(Race.Canine, Race.Reptile)) { adj = "tapered "; } else if (this.race.isRace(Race.Feline)) { adj = "barbed "; }

		const nouns = [
		"tip",
		"head",
		];
		const noun = _.sample(nouns);

		return adj + noun;
	}
	// TODO (knot size?)
	public KnotShort() {
		return "knot";
	}
	// TODO: Better descriptions
	public aLong() {
		const desc    = this.Desc();
		const noun    = this.noun();
		const knotted = this.Knot() ? ", knotted" : "";
		const sheath  = this.Sheath() ? ", sheathed" : "";
		let race = "";
		if (this.race !== Race.Human) {
			race += " " + this.race.Short(Gender.male);
		}
		return desc.a + " " + desc.adj + knotted + sheath + race + " " + noun + ", " + desc.len + " long and " + desc.thickness + " thick";
	}
	// TODO: Better descriptions
	public Long() {
		const desc    = this.Desc();
		const noun    = this.noun();
		const knotted = this.Knot() ? ", knotted" : "";
		const sheath  = this.Sheath() ? ", sheathed" : "";
		return desc.adj + knotted + sheath + " " + this.race.Short(Gender.male) + " " + this.noun() + ", " + desc.len + " long and " + desc.thickness + " thick";
	}

}
