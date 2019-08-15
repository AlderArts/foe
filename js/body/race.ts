import * as _ from "lodash";

import { Gender } from "./gender";

// Contains references to descriptors
const Race: any = {};

// TODO Need to fix numbering to something automatic, or at least ordered

// Contains a set of Id,RaceDesc pairs
const idToRace: any = {};
let numInternal = 0;

export class RaceDesc {
	public name: string;
	public superclass: any;
	public children: any[];
	public desc: any[];
	public descMale: any[];
	public descFemale: any[];
	public quantify: any[];
	public quantifyMale: any[];
	public quantifyFemale: any[];
	public geneSize: any;
	public id: number;

	constructor(name: string, id: number, opts?: any, superclass?: any) {
		opts = opts || {};
		this.name = name || "RACE";
		this.superclass = superclass;
		this.children = [];
		if (superclass) {
			superclass.children.push(this);
		}

		this.desc           = opts.desc           || [];
		this.descMale       = opts.descMale       || [];
		this.descFemale     = opts.descFemale     || [];
		this.quantify       = opts.quantify       || [];
		this.quantifyMale   = opts.quantifyMale   || [];
		this.quantifyFemale = opts.quantifyFemale || [];
		this.geneSize       = opts.geneSize;

		this.id = id;
		RaceDesc.Num++;
		RaceDesc.IdToRace[this.id] = this;
	}

	static get Num() { return numInternal; }
	static set Num(value: number) { numInternal = value; }
	static get IdToRace() { return idToRace; }

	public GeneSize() {
		if (this.geneSize) {
			return this.geneSize;
		} else if (this.superclass) {
			return this.superclass.GeneSize();
 } else {
			return 1;
 }
	}

	public Desc(gender?: Gender) {
		let desc = this.desc;
		if (_.isNumber(gender)) {
			if (gender === Gender.male) {
				desc = desc.concat(this.descMale);
			} else {
				desc = desc.concat(this.descFemale);
			}
		}
		if (this.superclass) { desc = desc.concat(this.superclass.Desc(gender)); }
		return desc;
	}

	// Checks if this race (or any of its parents)
	public isRace(...args: RaceDesc[]) {
		for (const arg of args) {
			if (this === arg) {
				return true;
			}
		}
		if (this.superclass) { return RaceDesc.prototype.isRace.apply(this.superclass, args); }
		return false;
	}
	// Checks if this race (not parents)
	public isRaceNotParent(...args: RaceDesc[]) {
		for (const arg of args) {
			if (this === arg) {
				return true;
			}
		}
		return false;
	}

	public Short(gender?: Gender) {
		const desc = _.sample(this.Desc(gender));
		return desc ? desc.noun : ("ERROR in " + this.name + ".Short()");
	}
	public CShort(gender?: Gender) {
		const desc = _.sample(this.Desc(gender));
		return desc ? _.capitalize(desc.noun) : ("ERROR in " + this.name + ".CShort()");
	}
	public aShort(gender?: Gender) {
		const desc = _.sample(this.Desc(gender));
		return desc ? (desc.a + " " + desc.noun) : ("ERROR in " + this.name + ".aShort()");
	}

	public Quantifier(gender?: Gender) {
		let quantify = this.quantify;
		if (_.isNumber(gender)) {
			if (gender === Gender.male) {
				quantify = quantify.concat(this.quantifyMale);
			} else {
				quantify = quantify.concat(this.quantifyFemale);
			}
		}
		if (this.superclass) { quantify = quantify.concat(this.superclass.Quantifier(gender)); }
		return quantify;
	}

	public qShort(gender?: Gender) {
		const desc = _.sample(this.Quantifier(gender));
		return desc ? desc.noun : ("ERROR in " + this.name + ".qShort()");
	}
	public qCShort(gender?: Gender) {
		const desc = _.sample(this.Quantifier(gender));
		return desc ? _.capitalize(desc.noun) : ("ERROR in " + this.name + ".qCShort()");
	}
	public aqShort(gender?: Gender) {
		const desc = _.sample(this.Quantifier(gender));
		return desc ? (desc.a + " " + desc.noun) : ("ERROR in " + this.name + ".aqShort()");
	}

}

export class RaceScore {
	public score: number[];
	public len: number;

	constructor(body?: any) {
		this.score = [];
		// Init
		for (let race = 0; race < RaceDesc.Num; race++) {
			this.score[race] = 0;
		}

		this.len = 1;

		// If init values
		if (body) {
			// Generic attributes
			this.score[body.head.race.id]++;
			this.score[body.head.mouth.tongue.race.id]++;
			this.score[body.head.eyes.race.id]++;
			this.score[body.head.ears.race.id]++;
			this.score[body.torso.race.id]++;
			this.score[body.arms.race.id]++;
			this.score[body.legs.race.id]++;

			for (const cock of body.cock) {
				this.score[cock.race.id]++;
			}
			if (body.balls.count.Get() > 0) { this.score[body.balls.race.id]++; }
			for (const backSlot of body.backSlots) {
				this.score[backSlot.race.id]++;
			}
			for (const app of body.head.appendages) {
				this.score[app.race.id]++;
			}

			// Specific attributes
			// KNOT (CANID)
			for (const cock of body.cock) {
				if (cock.knot) {
					this.score[Race.Canine.id]++;
				}
			}
			// IF 2 COCKS
			if (body.cock.length === 2) {
				this.score[Race.Lizard.id]++;
			}

			// Human-ish looks
			if (body.arms.count === 2) { this.score[Race.Human.id] += 2; }
			if (body.legs.count === 2) { this.score[Race.Human.id] += 2; }

			this.len = 0;
			// EQUALIZE
			for (let race = 0; race < RaceDesc.Num; race++) {
				this.len += Math.pow(this.score[race], 2);
			}
			this.len = Math.sqrt(this.len);
		}
	}

	// Produces a value between 0 and 1 for how similar the vectors are
	public Compare(racescore: RaceScore) {
		let dot = 0;
		for (let race = 0; race < RaceDesc.Num; race++) {
			dot += this.score[race] * racescore.score[race];
		}
		// Euclidian dot product
		return dot / (this.len * racescore.len);
	}

	public SumRace(race: RaceDesc) {
		const that = this;
		let sum = that.score[race.id];
		_.each(race.children, (r) => {
			sum += that.SumRace(r);
		});
		return sum;
	}

	// Produces a value between 0 and 1 for how close to a certain race the racescore is. Checks for children
	public SumScore(race: RaceDesc) {
		// Euclidian dot product
		return this.SumRace(race) / this.len;
	}

	public Sorted() {
		const copiedScore = [];
		const sorted = [];
		for (let i = 0; i < RaceDesc.Num; i++) {
			copiedScore[i] = this.score[i];
		}

		for (let num = 0; num < RaceDesc.Num; num++) {
			let highest    = -1;
			let highestIdx =  0;
			for (let i = 0; i < RaceDesc.Num; i++) {
				if (copiedScore[i] > highest) {
					highest    = copiedScore[i];
					highestIdx = i;
				}
			}

			sorted[num] = highestIdx;
			copiedScore[highestIdx] = -1;
		}

		return sorted;
	}

}

// TODO Current max 44

// {a:"", noun:""}
Race.Human = new RaceDesc("human", 0, {
	desc: [{a: "a", noun: "human"}],
	descMale: [{a: "a", noun: "man"}],
	descFemale: [{a: "a", noun: "woman"}],
	quantify: [{a: "a", noun: "human"}],
	quantifyMale: [{a: "a", noun: "male"}],
	quantifyFemale: [{a: "a", noun: "female"}],
	geneSize : 1,
});
Race.Horse = new RaceDesc("horse", 1, {
	desc: [{a: "a", noun: "horse"}, {a: "an", noun: "equine"}],
	descMale: [{a: "a", noun: "stallion"}],
	descFemale: [{a: "a", noun: "mare"}],
	quantify: [{a: "an", noun: "equine"}],
	geneSize : 1.3,
});
Race.Zebra = new RaceDesc("zebra", 39, {
	desc: [{a: "a", noun: "zebra"}],
}, Race.Horse);
Race.Feline = new RaceDesc("feline", 2, {
	desc: [{a: "a", noun: "cat"}, {a: "a", noun: "feline"}],
	descMale: [{a: "a", noun: "tom"}],
	descFemale: [{a: "a", noun: "pussy"}],
	quantify: [{a: "a", noun: "feline"}],
	geneSize : 0.8,
});
Race.Tiger = new RaceDesc("tiger", 25, {
	desc: [{a: "a", noun: "tiger"}],
	descFemale: [{a: "a", noun: "tigress"}],
	quantify: [{a: "a", noun: "tigrine"}],
	geneSize : 1,
}, Race.Feline);
Race.Panther = new RaceDesc("panther", 26, {
	desc: [{a: "a", noun: "panther"}],
	descFemale: [{a: "a", noun: "panthress"}],
	quantify: [{a: "a", noun: "pantherine"}],
}, Race.Feline);
Race.Jaguar = new RaceDesc("jaguar", 27, {
	desc: [{a: "a", noun: "jaguar"}],
}, Race.Feline);
Race.Puma = new RaceDesc("puma", 28, {
	desc: [{a: "a", noun: "puma"}],
}, Race.Feline);
Race.Lynx = new RaceDesc("lynx", 29, {
	desc: [{a: "a", noun: "lynx"}],
}, Race.Feline);
Race.Lion = new RaceDesc("lion", 30, {
	descMale: [{a: "a", noun: "lion"}],
	descFemale: [{a: "a", noun: "lioness"}],
	quantify: [{a: "a", noun: "leonine"}],
	geneSize : 1,
}, Race.Feline);
Race.Canine = new RaceDesc("canine", 31, {
	desc: [{a: "a", noun: "canine"}, {a: "a", noun: "canid"}],
	descFemale: [{a: "a", noun: "bitch"}],
	quantify: [{a: "a", noun: "canine"}, {a: "a", noun: "canid"}],
});
Race.Dog = new RaceDesc("dog", 3, {
	desc: [{a: "a", noun: "dog"}],
}, Race.Canine);
Race.Fox = new RaceDesc("fox", 4, {
	desc: [{a: "a", noun: "fox"}],
	descFemale: [{a: "a", noun: "vixen"}],
	quantify: [{a: "a", noun: "vulpine"}],
	quantifyFemale: [{a: "a", noun: "foxy"}],
}, Race.Canine);
Race.Wolf = new RaceDesc("wolf", 15, {
	desc: [{a: "a", noun: "wolf"}],
	descFemale: [{a: "a", noun: "she-wolf"}],
	quantify: [{a: "a", noun: "lupine"}],
}, Race.Canine);
Race.Jackal = new RaceDesc("jackal", 24, {
	desc: [{a: "a", noun: "jackal"}],
	descMale: [{a: "a", noun: "anubis"}],
	descFemale: [{a: "a", noun: "jackaless"}],
}, Race.Canine);
Race.Reptile = new RaceDesc("reptile", 32, {
	desc: [{a: "a", noun: "reptile"}],
	quantify: [{a: "a", noun: "reptilian"}],
});
Race.Snake = new RaceDesc("snake", 21, {
	desc: [{a: "a", noun: "snake"}, {a: "a", noun: "serpent"}, {a: "a", noun: "naga"}],
	quantify: [{a: "a", noun: "serpentine"}, {a: "a", noun: "naga"}],
	geneSize : 1.8, // Naga
}, Race.Reptile);
Race.Lizard = new RaceDesc("lizard", 5, {
	desc: [{a: "a", noun: "lizard"}],
}, Race.Reptile);
Race.Dragon = new RaceDesc("dragon", 8, {
	desc: [{a: "a", noun: "dragon"}],
	descMale: [{a: "a", noun: "drake"}],
	descFemale: [{a: "a", noun: "dragoness"}],
	quantify: [{a: "a", noun: "draconic"}],
	geneSize : 2,
}, Race.Reptile);
Race.Avian = new RaceDesc("avian", 16, {
	desc: [{a: "an", noun: "avian"}, {a: "a", noun: "bird"}],
	quantify: [{a: "an", noun: "avian"}],
});
Race.Gryphon = new RaceDesc("gryphon", 40, {
	desc: [{a: "a", noun: "gryphon"}],
	geneSize : 1.2,
}, Race.Avian);
Race.Insect = new RaceDesc("insect", 23, {
	desc: [{a: "an", noun: "insect"}],
	quantify: [{a: "an", noun: "insectoid"}],
});
Race.Moth = new RaceDesc("moth", 17, {
	desc: [{a: "a", noun: "moth"}],
}, Race.Insect);
Race.Gol = new RaceDesc("gol", 33, {
	desc: [{a: "a", noun: "Gol"}],
	geneSize : 2,
}, Race.Insect);
Race.Bee = new RaceDesc("bee", 36, {
	desc: [{a: "a", noun: "bee"}],
	geneSize : 0.1,
}, Race.Insect);
Race.Cow = new RaceDesc("cow", 14, {
	desc: [{a: "a", noun: "bovine"}],
	descMale: [{a: "a", noun: "bull"}],
	descFemale: [{a: "a", noun: "cow"}],
	quantify: [{a: "a", noun: "bovine"}],
	geneSize : 1.4,
});
Race.Goat = new RaceDesc("goat", 13, {
	desc: [{a: "a", noun: "goat"}, {a: "a", noun: "caprine"}],
	descMale: [{a: "a", noun: "buck"}],
	descFemale: [{a: "a", noun: "doe"}],
	quantify: [{a: "a", noun: "caprine"}],
});
Race.Deer = new RaceDesc("deer", 41, {
	desc: [{a: "a", noun: "deer"}, {a: "a", noun: "cervine"}, {a: "a", noun: "fawn"}],
	descMale: [{a: "a", noun: "stag"}, {a: "a", noun: "buck"}, {a: "a", noun: "hart"}],
	descFemale: [{a: "a", noun: "doe"}, {a: "a", noun: "hind"}],
	quantify: [{a: "a", noun: "cervine"}],
	geneSize : 0.9,
});
Race.Satyr = new RaceDesc("satyr", 11, {
	desc: [{a: "a", noun: "satyr"}, {a: "a", noun: "faun"}],
	quantify: [{a: "a", noun: "satyr"}, {a: "a", noun: "faun"}],
}, Race.Goat);
Race.Sheep = new RaceDesc("sheep", 12, {
	desc: [{a: "a", noun: "sheep"}, {a: "an", noun: "ovine"}],
	descMale: [{a: "a", noun: "ram"}],
	descFemale: [{a: "a", noun: "ewe"}],
	quantify: [{a: "an", noun: "ovine"}],
});
Race.Elf = new RaceDesc("elf", 10, {
	desc: [{a: "an", noun: "elf"}],
	quantify: [{a: "an", noun: "elven"}, {a: "an", noun: "elfin"}, {a: "an", noun: "elvish"}],
});
Race.Demon = new RaceDesc("demon", 7, {
	desc: [{a: "a", noun: "demon"}],
	descMale: [{a: "an", noun: "incubus"}],
	descFemale: [{a: "a", noun: "demoness"}, {a: "a", noun: "succubus"}],
	quantify: [{a: "a", noun: "demonic"}, {a: "an", noun: "infernal"}],
	geneSize : 1.5,
});
Race.Arachnid = new RaceDesc("arachnid", 34, {
	desc: [{a: "an", noun: "arachnid"}],
	quantify: [{a: "an", noun: "arachnoid"}, {a: "an", noun: "arachnine"}],
	geneSize : 0.1,
});
Race.Spider = new RaceDesc("spider", 35, {
	desc: [{a: "a", noun: "spider"}],
}, Race.Arachnid);
Race.Scorpion = new RaceDesc("scorpion", 18, {
	desc: [{a: "a", noun: "scorpion"}],
}, Race.Arachnid);
Race.Rabbit = new RaceDesc("rabbit", 6, {
	desc: [{a: "a", noun: "rabbit"}, {a: "a", noun: "bunny"}, {a: "a", noun: "lapin"}],
	descMale: [{a: "a", noun: "jack"}],
	descFemale: [{a: "a", noun: "jill"}],
	quantify: [{a: "a", noun: "leporine"}, {a: "a", noun: "lapine"}],
	geneSize : 0.6,
});
Race.Dryad = new RaceDesc("dryad", 9, {
	desc: [{a: "a", noun: "dryad"}, {a: "a", noun: "fawn"}],
	quantify: [{a: "a", noun: "dryad"}, {a: "a", noun: "fawn"}],
}, Race.Deer);
Race.Musteline = new RaceDesc("musteline", 37, {
	quantify: [{a: "a", noun: "musteline"}],
});
Race.Ferret = new RaceDesc("ferret", 19, {
	desc: [{a: "a", noun: "ferret"}],
	geneSize : 0.8,
}, Race.Musteline);
Race.Badger = new RaceDesc("badger", 38, {
	desc: [{a: "a", noun: "badger"}],
	geneSize : 1.1,
}, Race.Musteline);
Race.Plant = new RaceDesc("plant", 20, {
	desc: [{a: "a", noun: "plant"}],
	quantify: [{a: "a", noun: "floral"}],
});
Race.Goo = new RaceDesc("goo", 22, {
	desc: [{a: "a", noun: "goo"}],
	quantify: [{a: "a", noun: "gelatinous"}],
});
Race.Chimera = new RaceDesc("chimera", 42, {
	desc: [{a: "a", noun: "chimera"}],
	quantify: [{a: "a", noun: "chimerous"}],
});
Race.Salamander = new RaceDesc("salamander", 43, {
	desc: [{a: "a", noun: "salamander"}],
}, Race.Reptile);
Race.Hyena = new RaceDesc("hyena", 44, {
	desc: [{a: "a", noun: "hyena"}],
	quantify: [{a: "a", noun: "hyenalike"}],
});

export { Race };
