/*
 * Body
 */
import * as _ from "lodash";

import { Stat } from "../stat";
import { Appendage } from "./appendage";
import { Balls } from "./balls";
import { BodyPart } from "./bodypart";
import { Breasts } from "./breasts";
import { Butt } from "./butt";
import { Cock } from "./cock";
import { Color } from "./color";
import { DefBody } from "./defbody";
import { Gender } from "./gender";
import { Genitalia } from "./genitalia";
import { Head } from "./head";
import { IBody } from "./ibody";
import { Race, RaceDesc } from "./race";
import { Vagina } from "./vagina";

export enum HipSize {
	Thin     =  2,
	Medium   =  5,
	Wide     = 10,
	VeryWide = 15,
}

export enum LowerBodyType {
	Single   = 0,
	Humanoid = 1,
	Taur     = 2,
}

export class Torso extends BodyPart {
	public hipSize: Stat;

	constructor(debugName: () => string) {
		super();
		this.hipSize = new Stat(1); // TODO: Default
		this.hipSize.debug = () => debugName() + ".hipSize";
	}
}

export class Limbs extends BodyPart {
	public count: number;
	constructor() {
		super();
		this.count = 2;
	}
}

// Describe a standard humanoid-ish body
export class Body implements IBody {
	public entity: any;
	public muscleTone: Stat;
	public bodyMass: Stat;
	public height: Stat;
	public weigth: Stat;
	public femininity: Stat;
	public head: Head;
	public torso: Torso;
	public backSlots: Appendage[];
	public gen: Genitalia;
	public cock: Cock[];
	public balls: Balls;
	public vagina: Vagina[];
	public ass: Butt;
	public breasts: Breasts[];
	public arms: Limbs;
	public legs: Limbs;

	/* DEFBODY */
	public DefFemale = DefBody.DefFemale;
	public DefMale = DefBody.DefMale;
	public DefHerm = DefBody.DefHerm;
	public SetRace = DefBody.SetRace;
	public SetBodyColor = DefBody.SetBodyColor;
	public SetHairColor = DefBody.SetHairColor;
	public SetEyeColor = DefBody.SetEyeColor;

	constructor(ent: any) {
		this.entity = ent;
		const debugName = () => ent.name + ".body";
		// Body stats
		this.muscleTone = new Stat(0);
		this.muscleTone.debug = () => debugName() + ".muscleTone";
		this.bodyMass   = new Stat(0);
		this.bodyMass.debug = () => debugName() + ".bodyMass";
		this.height     = new Stat(175); // cm
		this.height.debug = () => debugName() + ".height";
		// TODO: fix?
		this.weigth     = new Stat(65); // kg
		this.weigth.debug = () => debugName() + ".weigth";

		this.femininity = new Stat(0);
		this.femininity.debug = () => debugName() + ".femininity";

		// BODYPARTS
		// Head
		this.head = new Head();

		// Torso
		this.torso         = new Torso(debugName);
		// Add slots for wings, tails and such
		this.backSlots     = new Array();

		// Genetalia
		this.gen = new Genitalia(this);
		this.cock = new Array();
		this.balls = new Balls();

		this.vagina = new Array();
		this.ass = new Butt();

		this.breasts = new Array();
		this.breasts.push(new Breasts());

		// Arms and legs
		this.arms = new Limbs();
		this.legs = new Limbs();
	}

	public ToStorage() {
		const storage: any = {
			fem    : this.femininity.base.toFixed(2),
			height : this.height.base.toFixed(2),
			mass   : this.bodyMass.base.toFixed(2),
			tone   : this.muscleTone.base.toFixed(2),
			weigth : this.weigth.base.toFixed(2),
		};

		storage.head = this.head.ToStorage();

		storage.torso = {
			col  : this.torso.color.toFixed(),
			hip  : this.torso.hipSize.base.toFixed(2),
			race : this.torso.race.id.toFixed(),
		};
		if (this.backSlots.length > 0) {
			storage.back = new Array();
			for (const backSlot of this.backSlots) {
				storage.back.push(backSlot.ToStorage());
			}
		}
		// Genetalia
		storage.gen = this.gen.ToStorage();
		if (this.cock.length > 0) {
			storage.cock = new Array();
			for (const a of this.cock) {
				const c = a.ToStorage(true);
				if (a.vag) {
					c.ccIdx = this.vagina.indexOf(a.vag).toString();
				}
				storage.cock.push(c);
			}
		}
		storage.balls = this.balls.ToStorage(true);

		if (this.vagina.length > 0) {
			storage.vag = new Array();
			for (const vag of this.vagina) {
				storage.vag.push(vag.ToStorage(true));
			}
		}

		storage.ass = this.ass.ToStorage(true);

		if (this.breasts.length > 0) {
			storage.breasts = new Array();
			for (const breast of this.breasts) {
				storage.breasts.push(breast.ToStorage(true));
			}
		}

		// Arms and legs
		storage.arms = {
			col   : this.arms.color.toFixed(),
			count : this.arms.count.toFixed(),
			race  : this.arms.race.id.toFixed(),
		};

		storage.legs = {
			col   : this.legs.color.toFixed(),
			count : this.legs.count.toFixed(),
			race  : this.legs.race.id.toFixed(),
		};

		return storage;
	}

	public ToStoragePartial(opts: any) {
		const storage: any = {};
		if (opts.cock && this.cock.length > 0) {
			const cock = [];
			for (const c of this.cock) {
				cock.push(c.ToStorage(opts.full));
			}
			storage.cock = cock;
		}
		if (opts.balls) {
			storage.balls = this.balls.ToStorage(opts.full);
		}
		if (opts.vag && this.vagina.length > 0) {
			const vag = [];
			for (const v of this.vagina) {
				vag.push(v.ToStorage(opts.full));
			}
			storage.vag = vag;
		}
		if (opts.ass) {
			storage.ass = this.ass.ToStorage(opts.full);
		}
		if (opts.breasts && this.breasts.length > 0) {
			const breasts = [];
			for (const b of this.breasts) {
				breasts.push(b.ToStorage(opts.full));
			}
			storage.breasts = breasts;
		}
		return storage;
	}

	public FromStorage(storage: any) {
		storage = storage || {};

		this.muscleTone.base = (storage.tone === undefined) ? this.muscleTone.base : parseFloat(storage.tone);
		this.bodyMass.base   = (storage.mass === undefined) ? this.bodyMass.base : parseFloat(storage.mass);
		this.height.base     = (storage.height === undefined) ? this.height.base : parseFloat(storage.height);
		this.weigth.base     = (storage.weigth === undefined) ? this.weigth.base : parseFloat(storage.weigth);
		this.femininity.base = (storage.fem === undefined) ? this.femininity.base : parseFloat(storage.fem);

		this.head.FromStorage(storage.head);

		if (storage.torso) {
			this.torso.race         = (storage.torso.race === undefined) ? this.torso.race : RaceDesc.IdToRace[parseInt(storage.torso.race, 10)];
			this.torso.color        = (storage.torso.col === undefined) ? this.torso.color : parseInt(storage.torso.col, 10);
			this.torso.hipSize.base = (storage.torso.hip === undefined) ? this.torso.hipSize.base : parseFloat(storage.torso.hip);
		}

		if (storage.back) {
			this.backSlots = new Array();
			for (const back of storage.back) {
				const newApp = new Appendage();
				newApp.FromStorage(back);
				this.backSlots.push(newApp);
			}
		}

		this.gen.FromStorage(storage.gen);

		if (storage.cock) {
			this.cock = new Array();
			for (const cock of storage.cock) {
				const c = new Cock();
				c.FromStorage(cock);
				this.cock.push(c);
			}
		}

		this.balls.FromStorage(storage.balls);

		if (storage.vag) {
			this.vagina = new Array();
			for (const vag of storage.vag) {
				const v = new Vagina();
				v.FromStorage(vag);
				this.vagina.push(v);
			}
		}

		// Restore clitcocks
		if (storage.cock) {
			for (let i = 0; i < storage.cock.length; i++) {
				const a     = storage.cock[i];
				const ccIdx = parseInt(a.ccIdx, 10);

				if (ccIdx >= 0 && ccIdx < this.vagina.length) {
					const v      = this.vagina[ccIdx];
					v.clitCock = this.cock[i];
					this.cock[i].vag = v;
				}
			}
		}

		this.ass.FromStorage(storage.ass);

		if (storage.breasts) {
			this.breasts = new Array();
			for (const breasts of storage.breasts) {
				const b = new Breasts();
				b.FromStorage(breasts);
				this.breasts.push(b);
			}
		}
		if (storage.arms) {
			this.arms = new Limbs();
			const a = storage.arms;
			this.arms.race  = (a.race === undefined) ? this.torso.race : RaceDesc.IdToRace[parseInt(a.race, 10)];
			this.arms.color = (a.col === undefined) ? this.torso.color : parseInt(a.col, 10);
			this.arms.count = (a.count === undefined) ? 2 : parseInt(a.count, 10);
		}

		if (storage.legs) {
			this.legs = new Limbs();
			const a = storage.legs;
			this.legs.race  = (a.race === undefined) ? this.torso.race : RaceDesc.IdToRace[parseInt(a.race, 10)];
			this.legs.color = (a.col === undefined) ? this.torso.color : parseInt(a.col, 10);
			this.legs.count = (a.count === undefined) ? 2 : parseInt(a.count, 10);
		}
	}

	public NumAttributes(race: RaceDesc) {
		let sum = 0;
		sum += this.head.NumAttributes(race);
		if (this.torso.race === race) { sum++; }
		if (this.arms.race === race) { sum++; }
		if (this.legs.race === race) { sum++; }
		for (const cock of this.cock) {
			if (cock.race === race) { sum++; }
		}
		if (this.balls.race === race && this.balls.count.Get() > 0) { sum++; }
		for (const backSlot of this.backSlots) {
			if (backSlot.race === race) { sum++; }
		}
		return sum;
	}

	public HandleStretchOverTime(hours: number) {
		for (const vag of this.vagina) {
			vag.HandleStretchOverTime(hours);
		}
		this.ass.HandleStretchOverTime(hours);
	}

	public NumCocks() {
		return this.cock.length;
	}
	public NumVags() {
		return this.vagina.length;
	}
	public NumBreastRows() {
		return this.breasts.length;
	}
	public Gender() {
		const cocks = this.cock.length;
		const vags  = this.vagina.length;

		if (cocks > 0 && vags === 0) {
			return Gender.male;
		} else if (cocks === 0 && vags > 0) {
			return Gender.female;
 } else if (cocks > 0 && vags > 0) {
			return Gender.herm;
 } else {
			return Gender.none;
 }
	}
	public GenderStr() {
		return Gender.Desc(this.Gender());
	}

	// TODO: Calculate race
	public Race() {
		return this.torso.race;
	}
	public RaceStr() {
		return this.Race().Short();
	}

	public SkinDesc(part?: BodyPart) {
		let ret = "";

		const col = Color.Desc(this.torso.color);
		if (Math.random() < 0.3 && this.HasSkin()) { ret += "bare "; }
		if (Math.random() < 0.3) { ret += col + " "; }
		const race = part ? part.race : this.torso.race;

		if (race.isRace(Race.Reptile)) { return ret + "scales"; }
		if (race.isRace(Race.Avian)) {   return ret + "feathers"; }
		if (race.isRace(Race.Cow, Race.Horse)) { return ret + "hide"; }
		if (race.isRace(Race.Canine, Race.Feline, Race.Goat, Race.Sheep, Race.Musteline, Race.Rabbit)) { return ret + "fur"; }
		if (race.isRace(Race.Goo)) {     return ret + "slime"; }
		return ret + "skin";
	}

	public HasFur() {
		return BodyPart.HasFur(this.torso.race);
	}
	public HasScales() {
		return BodyPart.HasScales(this.torso.race);
	}
	public HasSkin() {
		return BodyPart.HasSkin(this.torso.race);
	}

	public IsFlexible() {
		return this.torso.race.isRace(Race.Feline, Race.Ferret, Race.Reptile);
	}

	// TODO
	public FaceDesc() {
		const desc = this.head.race.qShort();
		if (this.head.race.isRace(Race.Human)) { return "face"; } else { return desc + " face"; }
	}
	public FaceDescLong() {
		return this.head.race.aqShort() + " face";
	}
	public EyeDesc() {
		const eyes = this.head.eyes.race;
		return eyes.qShort() + " eye";
	}

	public EarDesc(plural?: boolean) {
		let ret;
		const ears = this.head.ears.race;
		if (ears.isRace(Race.Reptile)) { ret = "pointed, scaled ear"; } else if (ears.isRace(Race.Elf, Race.Dryad, Race.Demon)) { ret = "pointed elfin ear"; } else if (ears.isRace(Race.Rabbit)) {  ret = "floppy rabbit ear"; } else if (ears.isRace(Race.Human)) {   ret = "ear"; } else { ret = ears.qShort() + " ear"; }

		if (plural) { ret += "s"; }
		return ret;
	}

	public HasFlexibleEars() {
		const ears = this.head.ears.race;
		return ears.isRace(
			Race.Horse,
			Race.Feline,
			Race.Canine,
			Race.Rabbit,
			Race.Sheep,
			Race.Cow,
			Race.Goat,
			Race.Musteline,
		);
	}

	public HasMuzzle() {
		return this.head.race.isRace(
			Race.Horse,
			Race.Reptile,
			Race.Cow,
			Race.Goat,
			Race.Sheep,
			Race.Musteline,
			Race.Canine,
			Race.Feline,
			Race.Rabbit,
		);
	}

	public HasLongSnout() {
		return this.head.race.isRace(
			Race.Horse,
			Race.Reptile,
			Race.Cow,
			Race.Goat,
			Race.Sheep,
		);
	}

	public HasNightvision() {
		return this.head.eyes.race.isRace(
			Race.Dragon,
			Race.Demon,
			Race.Wolf,
			Race.Fox,
			Race.Feline,
		);
	}

	public SoftFeet() {
		const legs = this.legs;
		if (!legs || legs.count < 2) { return false; }

		return !legs.race.isRace(
			Race.Cow,
			Race.Goat,
			Race.Sheep,
			Race.Deer,
			Race.Horse,
		);
	}

	public FeetDesc() {
		const legs = this.legs;
		if (!legs || legs.count < 2) {
			if (legs.race.isRace(Race.Snake)) {
				return "tail";
			} else {
				return "lower body";
			}
		}

		if (legs.race.isRace(Race.Cow, Race.Goat, Race.Sheep, Race.Deer, Race.Horse)) { return "hoofs"; }
		if (legs.race.isRace(Race.Gryphon)) { return "taloned feet"; }
		if (legs.race.isRace(Race.Avian, Race.Reptile, Race.Demon)) { return "clawed feet"; }
		if (legs.race.isRace(Race.Musteline, Race.Rabbit, Race.Canine, Race.Feline)) { return "paws"; }

		return "feet";
	}
	public FootDesc() {
		const legs = this.legs;
		if (!legs || legs.count < 2) {
			if (legs.race.isRace(Race.Snake)) {
				return "tail";
			} else {
				return "lower body";
			}
		}

		if (legs.race.isRace(Race.Cow, Race.Goat, Race.Sheep, Race.Deer, Race.Horse)) { return "hoof"; }
		if (legs.race.isRace(Race.Avian, Race.Reptile, Race.Demon)) { return "clawed foot"; }
		if (legs.race.isRace(Race.Musteline, Race.Rabbit, Race.Canine, Race.Feline)) { return "paw"; }

		return "foot";
	}

	// TODO
	public LegDesc() {
		const legs = this.legs;
		if (!legs || legs.count < 2) {
			if (legs.race.isRace(Race.Snake)) {
				return "tail";
			} else {
				return "lower body";
			}
		}

		return "leg";
	}
	// TODO
	public LegsDesc() {
		const legs = this.legs;
		if (!legs || legs.count < 2) {
			if (legs.race.isRace(Race.Snake)) {
				return "tail";
			} else {
				return "lower body";
			}
		}

		return "legs";
	}
	// TODO
	public ThighDesc() {
		const legs = this.legs;
		if (!legs || legs.count < 2) { return "body"; }

		return "thigh";
	}
	// TODO
	public ThighsDesc() {
		const legs = this.legs;
		if (!legs || legs.count < 2) { return "body"; }

		return "thighs";
	}
	// TODO
	public KneesDesc(plural?: boolean) {
		const legs = this.legs;
		if (!legs) { return "body"; }
		if (legs.count === 0) {
			if (legs.race.isRace(Race.Reptile)) {
				return "snake-like tail";
			}
			return "body";
		}

		let adj = "";
		if (BodyPart.HasScales(legs.race)) { adj += "scaled "; } else if (BodyPart.HasFur(legs.race)) { adj += "furred "; }

		return adj + plural ? "knees" : "knee";
	}
	// TODO
	public ArmDesc() {
		const arm = this.arms;
		if (!arm) { return "body"; }

		return "arm";
	}

	// TODO
	public HandDesc() {
		const arm = this.arms;
		if (!arm) { return "body"; }

		if (arm.race.isRace(
			Race.Musteline,
			Race.Rabbit,
			Race.Feline,
			Race.Canine)) { return "paw"; } else { return "hand"; }
	}
	// TODO
	public PalmDesc() {
		const arm = this.arms;
		if (!arm) { return "body"; }

		if (arm.race.isRace(
			Race.Musteline,
			Race.Rabbit,
			Race.Feline,
			Race.Canine)) { return "paw pad"; } else { return "palm"; }
	}

	// TODO
	public LipsDesc() {
		return "lips";
	}

	// TODO: Color, variation
	public TongueDesc() {
		const tongue = this.head.mouth.tongue;
		if (tongue.race.isRace(Race.Cow, Race.Horse)) { return "broad tongue"; }
		if (tongue.race.isRace(Race.Reptile, Race.Demon)) { return "forked tongue"; }
		if (tongue.race.isRace(Race.Canine)) { return "animalistic tongue"; }
		if (tongue.race.isRace(Race.Feline)) { return "barbed tongue"; }
		if (tongue.race.isRace(Race.Moth)) {   return "long tongue"; }
		if (tongue.race.isRace(Race.Plant)) {  return "tentacle-tongue"; }
		return "tongue";
	}

	// TODO: Color
	public TongueTipDesc() {
		const tongue = this.head.mouth.tongue;
		if (tongue.race.isRace(Race.Canine, Race.Cow, Race.Horse)) { return "broad tip"; }
		if (tongue.race.isRace(Race.Demon, Race.Reptile)) { return "forked tip"; }
		if (tongue.race.isRace(Race.Feline)) { return "barbed tip"; }
		if (tongue.race.isRace(Race.Moth)) {   return "thin tip"; }
		if (tongue.race.isRace(Race.Plant)) {  return "vine tip"; }
		return "tip";
	}

	public LongTongue() {
		const tongue = this.head.mouth.tongue;
		if (tongue.race.isRace(
			Race.Demon,
			Race.Reptile,
			Race.Moth,
			Race.Goo,
			Race.Plant)) { return true; }
		return false;
	}

	public HipSize() {
		return this.torso.hipSize.Get();
	}

	// TODO
	public HipsDesc(plural?: boolean) {
		const size = this.HipSize();

		const adjs = [];
		if (size < HipSize.Thin) {
			adjs.push("bony");
			adjs.push("thin");
			adjs.push("slender");
			adjs.push("slim");
			adjs.push("boyish");
			if (this.muscleTone.Get() > 0.2) {
				adjs.push("tight");
			}
		}
		if (size >= HipSize.Thin && size < HipSize.Medium) {
			adjs.push("well-proportioned");
			adjs.push("noticeable");
			adjs.push("shapely");
			if (this.femininity.Get() > 0) {
				adjs.push("girly");
			}
		}
		if (size >= HipSize.Medium && size < HipSize.Wide) {
			adjs.push("burgeoning");
			adjs.push("pleasant");
			adjs.push("waspish");
			adjs.push("flared");
		}
		if (size >= HipSize.Wide - 2 && size < HipSize.VeryWide + 2) {
			if (this.femininity.Get() > 0) {
				adjs.push("womanly");
				adjs.push("voluptuous");
			}
			adjs.push("wide");
			adjs.push("thick");
		}
		if (size >= HipSize.VeryWide) {
			adjs.push("absurdly wide");
			adjs.push("cow-like");
			if (this.femininity.Get() > 0) {
				adjs.push("broodmother");
			}
		}
		const adj = Math.random() < 0.5 ? (_.sample(adjs) + " ") : "";

		return adj + (plural ? "hips" : "hip");
	}

	public StomachDesc(bellysize: number) {
		const nouns = [];

		nouns.push("belly");
		nouns.push("stomach");
		nouns.push("tummy");
		if (this.muscleTone.Get() > 0.5) {
			nouns.push("abs");
		}
		let noun = _.sample(nouns);

		// Belly size
		const adjs = [];
		if (this.entity) {
			const size = this.entity.PregHandler().BellySize();

			if (size < 0.2) {
				adjs.push("flat");
				adjs.push("trim");
				adjs.push("even");
			} else if (size < 0.5) {
				adjs.push("gently rounded");
				adjs.push("slightly swollen");
				adjs.push("noticeable");
			} else if (size < 0.8) {
				adjs.push("increasingly pregnant");
				adjs.push("showing");
				adjs.push("growing");
			} else if (size < 1.2) {
				adjs.push("generous");
				adjs.push("full");
				adjs.push("cradleable");
				adjs.push("gravid");
			} else if (size < 1.6) {
				adjs.push("huggable");
				adjs.push("burgeoning");
				adjs.push("overdue-looking");
			} else if (size < 2.0) {
				adjs.push("weighty");
				adjs.push("bulging");
				adjs.push("bloated");
				adjs.push("heavy");
			} else if (size < 3.0) {
				adjs.push("massive");
				adjs.push("immense");
				adjs.push("very heavy");
				adjs.push("considerably gravid");
			} else {
				adjs.push("monstrous");
				adjs.push("gargantuan");
				adjs.push("impossibly pregnant");
				adjs.push("almost immobilizing");
			}

			const adj = _.sample(adjs) + " ";
			if (size < 0.2) {
				if (Math.random() < 0.2) { noun = adj + noun; }
			} else if (size < 0.8) {
				if (Math.random() < 0.5) { noun = adj + noun; }
			} else if (size < 1.6) {
				if (Math.random() < 0.8) { noun = adj + noun; }
			} else {
				noun = adj + noun;
			}
		}

		return noun;
	}
}
