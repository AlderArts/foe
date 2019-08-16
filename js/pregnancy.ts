/*
 * Pregnancy handler
 */
import * as _ from "lodash";

import { GetDEBUG } from "../app";
import { Race, RaceDesc } from "./body/race";
import { Sex } from "./entity-sex";
import { Perks } from "./perks";
import { Stat } from "./stat";
import { StatusEffect } from "./statuseffect";
import { Text } from "./text";

// Progress
export enum PregnancyLevel {
	Level1 = 0.1,
	Level2 = 0.4,
	Level3 = 0.5,
	Level4 = 0.7,
	Level5 = 0.9,
}

export class Womb {
	public litterSize: number;
	public father: any;
	public mother: any;
	public race: RaceDesc;
	public pregnant: boolean;
	public progress: number;
	public hoursToBirth: number;
	public triggered: boolean;

	constructor() {
		// In progress offspring
		this.litterSize = 0;
		this.father = null;
		this.mother = null;
		this.race = Race.Human;

		this.pregnant   = false;
		this.progress     = 0;
		this.hoursToBirth = 0;
		this.triggered    = false;
	}

	public ToStorage() {
		const storage: any = {
			litS : this.litterSize.toFixed(),
			hour : this.hoursToBirth.toFixed(2),
			prog : this.progress.toFixed(4),
		};
		if (this.father) { storage.f = this.father; }
		if (this.mother) { storage.m = this.mother; }
		if (this.race !== Race.Human) { storage.r = this.race.id.toFixed(); }
		return storage;
	}

	public FromStorage(storage: any) {
		this.litterSize   = parseInt(storage.litS, 10)   || this.litterSize;
		this.pregnant     = true;
		this.hoursToBirth = parseFloat(storage.hour) || this.hoursToBirth;
		this.progress     = parseFloat(storage.prog) || this.progress;

		if (storage.m) {  this.mother = storage.m; }
		if (storage.f) {  this.father = storage.f; }
		this.race = (storage.r === undefined) ? this.race : RaceDesc.IdToRace[parseInt(storage.r, 10)];
	}

	public IsEgg() {
		if (this.race.isRace(
			Race.Reptile,
			Race.Avian,
			Race.Gryphon,
		)) {
			return true;
		} else {
			return false;
		}
	}

	public Short() {
		return "womb";
	}
	public Desc() {

	}
	public Size() {
		const geneSize = this.race.GeneSize();

		return this.progress * geneSize * Math.sqrt(this.litterSize);
	}

}

const PHSlot = {
	Vag  : 0,
	Butt : 999,
};

export class PregnancyHandler {
	public entity: any;
	public gestationRate: Stat;
	public fertility: Stat;
	public mpreg: boolean;

	constructor(entity: any, storage?: any) {
		this.entity = entity;

		this.gestationRate = new Stat(1);
		this.fertility     = new Stat(0.3);
		this.mpreg         = false;

		if (storage) { this.FromStorage(storage); }
	}

	static get Slot() { return PHSlot; }

	public ToStorage() {
		const storage: any = {
			gr : this.gestationRate.base.toFixed(2),
			f  : this.fertility.base.toFixed(2),
		};
		if (this.mpreg) {
			storage.mpreg = "on";
		}

		const womb = [];
		const vags = this.entity.AllVags();
		for (let i = 0; i < vags.length; ++i) {
			const w = vags[i].womb;
			if (w && w.pregnant) {
				const s = w.ToStorage();
				s.slot = PregnancyHandler.Slot.Vag + i;
				womb.push(s);
			}
		}
		const w = this.entity.Butt().womb;
		if (w && w.pregnant) {
			const s = w.ToStorage();
			s.slot = PregnancyHandler.Slot.Butt;
			womb.push(s);
		}

		if (womb.length > 0) {
			storage.womb = womb;
		}

		return storage;
	}

	public FromStorage(storage?: any) {
		storage = storage || {};
		if (storage.gr) { this.gestationRate.base = parseFloat(storage.gr); }
		if (storage.f) {  this.fertility.base     = parseFloat(storage.f); }
		if (storage.mpreg) { this.mpreg = true; }

		if (storage.womb) {
			const vags = this.entity.AllVags();

			for (const w of storage.womb) {
				const slot = parseInt(w.slot, 10);
				let wPtr = null;
				if (slot >= PregnancyHandler.Slot.Vag && slot < PregnancyHandler.Slot.Butt) {
					const idx = slot - PregnancyHandler.Slot.Vag;
					if ((idx >= 0) && (idx < vags.length)) {
						wPtr = vags[idx].womb;
					}
				} else if (slot === PregnancyHandler.Slot.Butt) {
					wPtr = this.entity.Butt().womb;
 				}

				if (wPtr) {
					wPtr.FromStorage(w);
				}
			}
		}
	}

	/*
	* opts:
	*  slot   := PregnancyHandler.Slot
	*/
	public Womb(opts?: any) {
		opts = opts || {};
		const slot = opts.slot || PregnancyHandler.Slot.Vag;
		let womb = null;
		if     (slot <  PregnancyHandler.Slot.Butt) {
			const vag = this.entity.AllVags()[slot];
			if (vag) {
				womb = vag.womb;
			}
		} else if (slot === PregnancyHandler.Slot.Butt) { womb = this.entity.Butt().womb; }

		if (womb === null) {  return false; }

		return womb;
	}

	/*
	* Returns an array of pregnant wombs
	*/
	public PregnantWombs() {
		const ret = [];

		const ent = this.entity;

		let womb = null;
		_.each(ent.AllVags(), (vag) => {
			womb = vag.womb;
			if (womb.pregnant) {
				ret.push(womb);
			}
		});
		womb = ent.Butt().womb;
		if (womb.pregnant) {
			ret.push(womb);
		}

		return ret;
	}

	/*
	* opts:
	*  slot   := PregnancyHandler.Slot
	*/
	public IsPregnant(opts?: any) {
		opts = opts || {};
		const slot = opts.slot;
		if (_.isNumber(slot)) {
			return this.Womb(slot).pregnant;
		} else {
			return (this.PregnantWombs().length > 0);
		}
	}

	public MPregEnabled() {
		return this.mpreg;
	}

	/*
	* opts:
	*  slot   := PregnancyHandler.Slot
	*  mother := Entity
	*  father := Entity
	*  race   := RaceDesc
	*  num    := 1,2,3...
	*  numCap := 1,2,3... Maximum number of kids allowed
	*  time   := time to birth in hours
	*  force  := [optional], bypass fertility
	*  load   := [optional], multiply chances of preg
	*/
	public Impregnate(opts?: any) {
		opts = opts || {};
		const mother = opts.mother || this.entity;
		const father = opts.father; // TODO Potential fallback needed
		const race = opts.race || Race.Human;

		const slot = opts.slot || PregnancyHandler.Slot.Vag;
		let womb = null;
		if     (slot <  PregnancyHandler.Slot.Butt) {
			const vag = mother.AllVags()[slot];
			if (vag) {
				womb = vag.womb;
			}
		} else if (slot === PregnancyHandler.Slot.Butt) {
			womb = mother.Butt().womb;
		}

		if (womb === null) { return false; }
		if (womb.pregnant) { return false; }
		if (slot === PregnancyHandler.Slot.Butt && !this.MPregEnabled()) { return false; }

		// TODO: Check for sterility, herbs etc

		let fertility = (this.fertility.Get() * father.Virility() * Math.sqrt(opts.load || 1));
		// Perks etc for mother
		if (mother.HasPerk(Perks.Fertility)) {
			fertility *= 1.5;
		}
		let limp = mother.combatStatus.stats[StatusEffect.Limp];
		if (limp) { fertility *= limp.fer; }
		let aroused = mother.combatStatus.stats[StatusEffect.Aroused];
		if (aroused) { fertility *= aroused.fer; }
		// Perks etc for father
		if (father.HasPerk(Perks.Virility)) {
			fertility *= 1.5;
		}
		limp = father.combatStatus.stats[StatusEffect.Limp];
		if (limp) { fertility *= limp.fer; }
		aroused = father.combatStatus.stats[StatusEffect.Aroused];
		if (aroused) { fertility *= aroused.fer; }

		const chance = Math.random();
		const parse: any = {
			mother : mother.name,
			father : father.name,
			odds   : fertility,
			chance,
		};

		if (opts.force || (chance < fertility)) {

			// Adjust litterSize
			let litterSize = opts.num || 1;
			const litterCap = opts.numCap || 0;

			if (mother.HasPerk(Perks.Breeder) && Math.random() < 0.3) {
				litterSize *= 2;
			}
			if (father.HasPerk(Perks.Breeder) && Math.random() < 0.3) {
				litterSize *= 2;
			}

			litterSize = Math.floor(litterSize);
			litterSize = Math.max(litterSize, 1);
			// Limit number of kids possible
			if (_.isNumber(litterCap) && litterCap > 0 ) {
				litterSize = Math.max(litterSize, litterCap);
			}

			const gestationPeriod = opts.time || 24; // TODO TEMP

			Sex.Preg(father, mother, litterSize);

			// TODO: start pregnancy
			womb.pregnant     = true;
			womb.triggered    = false;
			womb.progress     = 0;
			womb.hoursToBirth = gestationPeriod;
			womb.litterSize   = litterSize;
			if (father) { womb.father = father.ID; }
			womb.mother = mother.ID;
			womb.race = opts.race;

			parse.size = litterSize;
			parse.type = race.name;
			parse.time = gestationPeriod;

			if (GetDEBUG()) {
				Text.NL();
				Text.Add("<b>[father] impregnated [mother], (odds: [chance] < [odds]). Litter size: [size]. Type: [type]. Time: [time] hours.</b>", parse);
				Text.NL();
			}

			return true;
		} else {
			if (GetDEBUG()) {
				Text.NL();
				Text.Add("<b>[father] did not impregnate [mother], (odds: [chance] >= [odds]).</b>", parse);
				Text.NL();
			}
			return false;
		}
	}

	public Update(hours?: number) {
		hours = hours || 0;
		hours *= this.gestationRate.Get();

		const ent = this.entity;

		const wombs = this.PregnantWombs();
		_.each(wombs, (womb) => {
			const slot = ent.Butt().womb === womb ? PregnancyHandler.Slot.Butt : PregnancyHandler.Slot.Vag;

			const oldProgress = womb.progress;
			if (!womb.triggered) {
				womb.progress     += (1 - womb.progress) * hours / womb.hoursToBirth;
				womb.hoursToBirth -= hours;
				// Check for completion
				// Added the clause that you need to be in a safe spot
				if (womb.hoursToBirth <= 0 && ent.CanGiveBirth()) {
					womb.triggered = true;
					ent.PregnancyTrigger(womb, slot);
				} else {
					ent.PregnancyProgess(womb, slot, oldProgress, womb.progress);
				}
			}
		});
	}

	public BellySize() {
		let size = 0;
		const wombs = this.PregnantWombs();

		_.each(wombs, (womb) => {
			size += womb.Size();
		});

		return size;
	}

}
