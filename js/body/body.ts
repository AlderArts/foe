/*
 * Body
 */
import * as _ from 'lodash';

import { BodyPart } from './bodypart';
import { Stat } from '../stat';
import { Head } from './head';
import { Genitalia } from './genitalia';
import { Balls } from './balls';
import { Butt } from './butt';
import { Breasts } from './breasts';
import { DefBody } from './defbody';
import { Gender } from './gender';
import { Appendage } from './appendage';
import { RaceDesc, Race } from './race';
import { Color } from './color';
import { Cock } from './cock';
import { Vagina } from './vagina';

export enum HipSize {
	Thin     =  2,
	Medium   =  5,
	Wide     = 10,
	VeryWide = 15
};

export class Torso extends BodyPart {
	hipSize : Stat;

	constructor(debugName : any) {
		super();
		this.hipSize = new Stat(1); // TODO: Default
		this.hipSize.debug = function() { return debugName() + ".hipSize"; }
	}
};

export class Limbs extends BodyPart {
	count : number;
	constructor() {
		super();
		this.count = 2;
	}
}

// Describe a standard humanoid-ish body
export class Body {
	entity : any;
	muscleTone : Stat;
	bodyMass : Stat;
	height : Stat;
	weigth : Stat;
	femininity : Stat;
	head : Head;
	torso : Torso;
	backSlots : Appendage[];
	gen : Genitalia;
	cock : Cock[];
	balls : Balls;
	vagina : Vagina[];
	ass : Butt;
	breasts : Breasts[];
	arms : Limbs;
	legs : Limbs;

	constructor(ent : any) {
		this.entity = ent;
		var debugName = function() { return ent.name + ".body"; };
		// Body stats
		this.muscleTone = new Stat(0);
		this.muscleTone.debug = function() { return debugName() + ".muscleTone"; }
		this.bodyMass   = new Stat(0);
		this.bodyMass.debug = function() { return debugName() + ".bodyMass"; }
		this.height     = new Stat(175); // cm
		this.height.debug = function() { return debugName() + ".height"; }
		// TODO: fix?
		this.weigth     = new Stat(65); // kg
		this.weigth.debug = function() { return debugName() + ".weigth"; }
		
		this.femininity = new Stat(0);
		this.femininity.debug = function() { return debugName() + ".femininity"; }
		
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
	
	ToStorage() {
		var storage : any = {
			tone   : this.muscleTone.base.toFixed(2),
			mass   : this.bodyMass.base.toFixed(2),
			height : this.height.base.toFixed(2),
			weigth : this.weigth.base.toFixed(2),
			fem    : this.femininity.base.toFixed(2)
		};
		
		storage.head = this.head.ToStorage();
		
		storage.torso = {
			race : this.torso.race.id.toFixed(),
			col  : this.torso.color.toFixed(),
			hip  : this.torso.hipSize.base.toFixed(2)
		};
		if(this.backSlots.length > 0) {
			storage.back = new Array();
			for(var i = 0; i < this.backSlots.length; i++) {
				storage.back.push(this.backSlots[i].ToStorage());
			}
		}
		// Genetalia
		storage.gen = this.gen.ToStorage();
		if(this.cock.length > 0) {
			storage.cock = new Array();
			for(var i = 0; i < this.cock.length; i++) {
				var a = this.cock[i];
				var c = a.ToStorage(true);
				if(a.vag)
					c.ccIdx = this.vagina.indexOf(a.vag);
				storage.cock.push(c);
			}
		}
		storage.balls = this.balls.ToStorage(true);
		
		if(this.vagina.length > 0) {
			storage.vag = new Array();
			for(var i = 0; i < this.vagina.length; i++) {
				storage.vag.push(this.vagina[i].ToStorage(true));
			}
		}
		
		storage.ass = this.ass.ToStorage(true);
		
		if(this.breasts.length > 0) {
			storage.breasts = new Array();
			for(var i = 0; i < this.breasts.length; i++) {
				storage.breasts.push(this.breasts[i].ToStorage(true));
			}
		}
		
		// Arms and legs
		storage.arms = {
			race  : this.arms.race.id.toFixed(),
			col   : this.arms.color.toFixed(),
			count : this.arms.count.toFixed()
		};
		
		storage.legs = {
			race  : this.legs.race.id.toFixed(),
			col   : this.legs.color.toFixed(),
			count : this.legs.count.toFixed()
		};

		return storage;
	}

	ToStoragePartial(opts : any) {
		var storage : any = {};
		if(opts.cock && this.cock.length > 0) {
			var cock = [];
			for(var i = 0; i < this.cock.length; ++i) {
				cock.push(this.cock[i].ToStorage(opts.full));
			}
			storage.cock = cock;
		}
		if(opts.balls) {
			storage.balls = this.balls.ToStorage(opts.full);
		}
		if(opts.vag && this.vagina.length > 0) {
			var vag = [];
			for(var i = 0; i < this.vagina.length; ++i) {
				vag.push(this.vagina[i].ToStorage(opts.full));
			}
			storage.vag = vag;
		}
		if(opts.ass) {
			storage.ass = this.ass.ToStorage(opts.full);
		}
		if(opts.breasts && this.breasts.length > 0) {
			var breasts = [];
			for(var i = 0; i < this.breasts.length; ++i) {
				breasts.push(this.breasts[i].ToStorage(opts.full));
			}
			storage.breasts = breasts;
		}
		return storage;
	}

	FromStorage(storage : any) {
		storage = storage || {};
		
		this.muscleTone.base = (storage.tone === undefined) ? this.muscleTone.base : parseFloat(storage.tone);
		this.bodyMass.base   = (storage.mass === undefined) ? this.bodyMass.base : parseFloat(storage.mass);
		this.height.base     = (storage.height === undefined) ? this.height.base : parseFloat(storage.height);
		this.weigth.base     = (storage.weigth === undefined) ? this.weigth.base : parseFloat(storage.weigth);
		this.femininity.base = (storage.fem === undefined) ? this.femininity.base : parseFloat(storage.fem);
		
		this.head.FromStorage(storage.head);
		
		if(storage.torso) {
			this.torso.race         = (storage.torso.race === undefined) ? this.torso.race : RaceDesc.IdToRace[parseInt(storage.torso.race)];
			this.torso.color        = (storage.torso.col === undefined) ? this.torso.color : parseInt(storage.torso.col);
			this.torso.hipSize.base = (storage.torso.hip === undefined) ? this.torso.hipSize.base : parseFloat(storage.torso.hip);
		}
		
		if(storage.back) {
			this.backSlots = new Array();
			for(var i = 0; i < storage.back.length; i++) {
				var newApp = new Appendage();
				newApp.FromStorage(storage.back[i]);
				this.backSlots.push(newApp);
			}
		}
		
		this.gen.FromStorage(storage.gen);
		
		if(storage.cock) {
			this.cock = new Array();
			for(var i = 0; i < storage.cock.length; i++) {
				var c = new Cock();
				c.FromStorage(storage.cock[i]);
				this.cock.push(c);
			}
		}
		
		this.balls.FromStorage(storage.balls);
		
		if(storage.vag) {
			this.vagina = new Array();
			for(var i = 0; i < storage.vag.length; i++) {
				var v = new Vagina();
				v.FromStorage(storage.vag[i]);
				this.vagina.push(v);
			}
		}
		
		// Restore clitcocks
		if(storage.cock) {
			for(var i = 0; i < storage.cock.length; i++) {
				var a     = storage.cock[i];
				var ccIdx = parseInt(a.ccIdx);
				
				if(ccIdx >= 0 && ccIdx < this.vagina.length) {
					var v      = this.vagina[ccIdx];
					v.clitCock = this.cock[i];
					this.cock[i].vag = v;
				}
			}
		}

		this.ass.FromStorage(storage.ass);
		
		if(storage.breasts) {
			this.breasts = new Array();
			for(var i = 0; i < storage.breasts.length; i++) {
				var b = new Breasts();
				b.FromStorage(storage.breasts[i]);
				this.breasts.push(b);
			}
		}
		if(storage.arms) {
			this.arms = new Limbs();
			var a = storage.arms;
			this.arms.race  = (a.race === undefined) ? this.torso.race : RaceDesc.IdToRace[parseInt(a.race)];
			this.arms.color = (a.col === undefined) ? this.torso.color : parseInt(a.col);
			this.arms.count = (a.count === undefined) ? 2 : parseInt(a.count);
		}
		
		if(storage.legs) {
			this.legs = new Limbs();
			var a = storage.legs;
			this.legs.race  = (a.race === undefined) ? this.torso.race : RaceDesc.IdToRace[parseInt(a.race)];
			this.legs.color = (a.col === undefined) ? this.torso.color : parseInt(a.col);
			this.legs.count = (a.count === undefined) ? 2 : parseInt(a.count);
		}
	}

	NumAttributes(race : RaceDesc) {
		var sum = 0;
		sum += this.head.NumAttributes(race);
		if(this.torso.race == race)             sum++;
		if(this.arms.race == race)              sum++;
		if(this.legs.race == race)              sum++;
		for(var i = 0; i < this.cock.length; i++)
			if(this.cock[i].race == race) sum++;
		if(this.balls.race == race && this.balls.count.Get() > 0) sum++;
		for(var i = 0; i < this.backSlots.length; i++)
			if(this.backSlots[i].race == race) sum++;
		return sum;
	}

	HandleStretchOverTime(hours : number) {
		for(var i = 0; i < this.vagina.length; i++)
			this.vagina[i].HandleStretchOverTime(hours);
		this.ass.HandleStretchOverTime(hours);
	}

	NumCocks() {
		return this.cock.length;
	}
	NumVags() {
		return this.vagina.length;
	}
	NumBreastRows() {
		return this.breasts.length;
	}
	Gender() {
		var cocks = this.cock.length;
		var vags  = this.vagina.length;
		
		if(cocks > 0 && vags == 0)
			return Gender.male;
		else if(cocks == 0 && vags > 0)
			return Gender.female;
		else if(cocks > 0 && vags > 0)
			return Gender.herm;
		else
			return Gender.none;
	}
	GenderStr() {
		return Gender.Desc(this.Gender());
	}


	// TODO: Calculate race
	Race() {
		return this.torso.race;
	}
	RaceStr() {
		return this.Race().Short();
	}

	SkinDesc(part? : BodyPart) {
		var ret = "";
		
		var col = Color.Desc(this.torso.color);
		if(Math.random() < 0.3 && this.HasSkin()) ret += "bare ";
		if(Math.random() < 0.3) ret += col + " ";
		let race = part ? part.race : this.torso.race;
		
		if(race.isRace(Race.Reptile)) return ret + "scales";
		if(race.isRace(Race.Avian))   return ret + "feathers";
		if(race.isRace(Race.Cow, Race.Horse)) return ret + "hide";
		if(race.isRace(Race.Canine, Race.Feline, Race.Goat, Race.Sheep, Race.Musteline, Race.Rabbit)) return ret + "fur";
		if(race.isRace(Race.Goo))     return ret + "slime";
		return ret + "skin";
	}

	HasFur() {
		return BodyPart.HasFur(this.torso.race);
	}
	HasScales() {
		return BodyPart.HasScales(this.torso.race);
	}
	HasSkin() {
		return BodyPart.HasSkin(this.torso.race);
	}


	IsFlexible() {
		return this.torso.race.isRace(Race.Feline, Race.Ferret, Race.Reptile);
	}

	// TODO
	FaceDesc() {
		var desc = this.head.race.qShort();
		if(this.head.race.isRace(Race.Human)) return "face";
		else return desc + " face";
	}
	FaceDescLong() {
		return this.head.race.aqShort() + " face";
	}
	EyeDesc() {
		var eyes = this.head.eyes.race;
		return eyes.qShort() + " eye";
	}

	EarDesc(plural : boolean) {
		var ret;
		var ears = this.head.ears.race;
		if(ears.isRace(Race.Reptile)) ret = "pointed, scaled ear";
		else if(ears.isRace(Race.Elf, Race.Dryad, Race.Demon)) ret = "pointed elfin ear";
		else if(ears.isRace(Race.Rabbit))  ret = "floppy rabbit ear";
		else if(ears.isRace(Race.Human))   ret = "ear";
		else ret = ears.qShort() + " ear";
		
		if(plural) ret += "s";
		return ret;
	}

	HasFlexibleEars() {
		var ears = this.head.ears.race;
		return ears.isRace(
			Race.Horse,
			Race.Feline,
			Race.Canine,
			Race.Rabbit,
			Race.Sheep,
			Race.Cow,
			Race.Goat,
			Race.Musteline
		);
	}

	HasMuzzle() {
		return this.head.race.isRace(
			Race.Horse,
			Race.Reptile,
			Race.Cow,
			Race.Goat,
			Race.Sheep,
			Race.Musteline,
			Race.Canine,
			Race.Feline,
			Race.Rabbit
		);
	}

	HasLongSnout() {
		return this.head.race.isRace(
			Race.Horse,
			Race.Reptile,
			Race.Cow,
			Race.Goat,
			Race.Sheep
		);
	}

	HasNightvision() {
		return this.head.eyes.race.isRace(
			Race.Dragon,
			Race.Demon,
			Race.Wolf,
			Race.Fox,
			Race.Feline
		);
	}

	SoftFeet() {
		var legs = this.legs;
		if(!legs || legs.count < 2) return false;
		
		return !legs.race.isRace(
			Race.Cow,
			Race.Goat,
			Race.Sheep,
			Race.Deer,
			Race.Horse
		);
	}

	FeetDesc() {
		var legs = this.legs;
		if(!legs || legs.count < 2) {
			if(legs.race.isRace(Race.Snake))
				return "tail";
			else
				return "lower body";
		}
		
		if(legs.race.isRace(Race.Cow, Race.Goat, Race.Sheep, Race.Deer, Race.Horse)) return "hoofs";
		if(legs.race.isRace(Race.Gryphon)) return "taloned feet";
		if(legs.race.isRace(Race.Avian, Race.Reptile, Race.Demon)) return "clawed feet";
		if(legs.race.isRace(Race.Musteline, Race.Rabbit, Race.Canine, Race.Feline)) return "paws";
		
		return "feet";
	}
	FootDesc() {
		var legs = this.legs;
		if(!legs || legs.count < 2) {
			if(legs.race.isRace(Race.Snake))
				return "tail";
			else
				return "lower body";
		}
		
		if(legs.race.isRace(Race.Cow, Race.Goat, Race.Sheep, Race.Deer, Race.Horse)) return "hoof";
		if(legs.race.isRace(Race.Avian, Race.Reptile, Race.Demon)) return "clawed foot";
		if(legs.race.isRace(Race.Musteline, Race.Rabbit, Race.Canine, Race.Feline)) return "paw";
		
		return "foot";
	}

	// TODO
	LegDesc() {
		var legs = this.legs;
		if(!legs || legs.count < 2) {
			if(legs.race.isRace(Race.Snake))
				return "tail";
			else
				return "lower body";
		}
		
		return "leg";
	}
	// TODO
	LegsDesc() {
		var legs = this.legs;
		if(!legs || legs.count < 2) {
			if(legs.race.isRace(Race.Snake))
				return "tail";
			else
				return "lower body";
		}
		
		return "legs";
	}
	// TODO
	ThighDesc() {
		var legs = this.legs;
		if(!legs || legs.count < 2) return "body";
		
		return "thigh";
	}
	// TODO
	ThighsDesc() {
		var legs = this.legs;
		if(!legs || legs.count < 2) return "body";
		
		return "thighs";
	}
	// TODO
	KneesDesc(plural : boolean) {
		var legs = this.legs;
		if(!legs) return "body";
		if(legs.count == 0) {
			if(legs.race.isRace(Race.Reptile))
				return "snake-like tail";
			return "body";
		}
		
		var adj = "";
		if(BodyPart.HasScales(legs.race)) adj += "scaled ";
		else if(BodyPart.HasFur(legs.race)) adj += "furred ";
		
		return adj + plural ? "knees" : "knee";
	}
	// TODO
	ArmDesc() {
		var arm = this.arms;
		if(!arm) return "body";
		
		return "arm";
	}

	// TODO
	HandDesc() {
		var arm = this.arms;
		if(!arm) return "body";
		
		if(arm.race.isRace(
			Race.Musteline,
			Race.Rabbit,
			Race.Feline,
			Race.Canine)) return "paw";
		else return "hand";
	}
	// TODO
	PalmDesc() {
		var arm = this.arms;
		if(!arm) return "body";
		
		if(arm.race.isRace(
			Race.Musteline,
			Race.Rabbit,
			Race.Feline,
			Race.Canine)) return "paw pad";
		else return "palm";
	}

	//TODO
	LipsDesc() {
		return "lips";
	}

	// TODO: Color, variation
	TongueDesc() {
		var tongue = this.head.mouth.tongue;
		if(tongue.race.isRace(Race.Cow, Race.Horse)) return "broad tongue";
		if(tongue.race.isRace(Race.Reptile, Race.Demon)) return "forked tongue";
		if(tongue.race.isRace(Race.Canine)) return "animalistic tongue";
		if(tongue.race.isRace(Race.Feline)) return "barbed tongue";
		if(tongue.race.isRace(Race.Moth))   return "long tongue";
		if(tongue.race.isRace(Race.Plant))  return "tentacle-tongue";
		return "tongue";
	}

	// TODO: Color
	TongueTipDesc() {
		var tongue = this.head.mouth.tongue;
		if(tongue.race.isRace(Race.Canine, Race.Cow, Race.Horse)) return "broad tip";
		if(tongue.race.isRace(Race.Demon, Race.Reptile)) return "forked tip";
		if(tongue.race.isRace(Race.Feline)) return "barbed tip";
		if(tongue.race.isRace(Race.Moth))   return "thin tip";
		if(tongue.race.isRace(Race.Plant))  return "vine tip";
		return "tip";
	}

	LongTongue() {
		var tongue = this.head.mouth.tongue;
		if(tongue.race.isRace(
			Race.Demon,
			Race.Reptile,
			Race.Moth,
			Race.Goo,
			Race.Plant)) return true;
		return false;
	}

	HipSize() {
		return this.torso.hipSize.Get();
	}

	// TODO
	HipsDesc(plural : boolean) {
		var size = this.HipSize();
		
		var adjs = [];
		if(size < HipSize.Thin) {
			adjs.push("bony");
			adjs.push("thin");
			adjs.push("slender");
			adjs.push("slim");
			adjs.push("boyish");
			if(this.muscleTone.Get() > 0.2)
				adjs.push("tight");
		}
		if(size >= HipSize.Thin && size < HipSize.Medium) {
			adjs.push("well-proportioned");
			adjs.push("noticeable");
			adjs.push("shapely");
			if(this.femininity.Get() > 0)
				adjs.push("girly");
		}
		if(size >= HipSize.Medium && size < HipSize.Wide) {
			adjs.push("burgeoning");
			adjs.push("pleasant");
			adjs.push("waspish");
			adjs.push("flared");
		}
		if(size >= HipSize.Wide-2 && size < HipSize.VeryWide+2) {
			if(this.femininity.Get() > 0) {
				adjs.push("womanly");
				adjs.push("voluptuous");
			}
			adjs.push("wide");
			adjs.push("thick");
		}
		if(size >= HipSize.VeryWide) {
			adjs.push("absurdly wide");
			adjs.push("cow-like");
			if(this.femininity.Get() > 0)
				adjs.push("broodmother");
		}
		var adj = Math.random() < 0.5 ? (_.sample(adjs) + " ") : "";
		
		return adj + (plural ? "hips" : "hip");
	}

	StomachDesc(bellysize : number) {
		var nouns = [];
		
		nouns.push("belly");
		nouns.push("stomach");
		nouns.push("tummy");
		if(this.muscleTone.Get() > 0.5)
			nouns.push("abs");
		var noun = _.sample(nouns);
		
		// Belly size
		var adjs = [];
		if(this.entity) {
			var size = this.entity.PregHandler().BellySize();
			
			if(size < 0.2) {
				adjs.push("flat");
				adjs.push("trim");
				adjs.push("even");
			}
			else if(size < 0.5) {
				adjs.push("gently rounded");
				adjs.push("slightly swollen");
				adjs.push("noticeable");
			}
			else if(size < 0.8) {
				adjs.push("increasingly pregnant");
				adjs.push("showing");
				adjs.push("growing");
			}
			else if(size < 1.2) {
				adjs.push("generous");
				adjs.push("full");
				adjs.push("cradleable");
				adjs.push("gravid");
			}
			else if(size < 1.6) {
				adjs.push("huggable");
				adjs.push("burgeoning");
				adjs.push("overdue-looking");
			}
			else if(size < 2.0) {
				adjs.push("weighty");
				adjs.push("bulging");
				adjs.push("bloated");
				adjs.push("heavy");
			}
			else if(size < 3.0) {
				adjs.push("massive");
				adjs.push("immense");
				adjs.push("very heavy");
				adjs.push("considerably gravid");
			}
			else {
				adjs.push("monstrous");
				adjs.push("gargantuan");
				adjs.push("impossibly pregnant");
				adjs.push("almost immobilizing");
			}
			
			var adj = _.sample(adjs) + " ";
			if(size < 0.2) {
				if(Math.random() < 0.2) noun = adj + noun;
			}
			else if(size < 0.8) {
				if(Math.random() < 0.5) noun = adj + noun;
			}
			else if(size < 1.6) {
				if(Math.random() < 0.8) noun = adj + noun;
			}
			else {
				noun = adj + noun;
			}
		}
		
		return noun;
	}

	/* DEFBODY */
	DefFemale = DefBody.DefFemale;
	DefMale = DefBody.DefMale;
	DefHerm = DefBody.DefHerm;
	SetRace = DefBody.SetRace;
	SetBodyColor = DefBody.SetBodyColor;
	SetHairColor = DefBody.SetHairColor;
	SetEyeColor = DefBody.SetEyeColor;
}
