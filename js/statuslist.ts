import * as _ from "lodash";
import { Images } from "./assets";
import { Status, StatusEffect } from "./statuseffect";

const NumStatus = 6;

export class StatusList {
	public stats: any[];

	static get NumStatus() {
		return NumStatus;
	}

	constructor() {
		// Index contains undefined if status effect is inactive
		// Data in index can contain a degree/timer relevant to the effect
		this.stats = [];
	}

	public FromStorage = function(storage: any) {
		if (!_.isArray(storage)) { return; }
		const that = this;
		_.each(storage, (stat) => {
			const idx = (stat.idx === undefined) ? 0 : parseInt(stat.idx, 10);

			switch (idx) {
				// TODO Add permanent status effects here
				case StatusEffect.Aroused:
					that.stats[StatusEffect.Aroused] = Status.Aroused.FromStorage(stat);
					break;
				case StatusEffect.Buff:
					that.stats[StatusEffect.Buff] = Status.Buff.FromStorage(stat);
					break;
				case StatusEffect.Full:
					that.stats[StatusEffect.Full] = Status.Full.FromStorage(stat);
					break;
				case StatusEffect.Limp:
					that.stats[StatusEffect.Limp] = Status.Limp.FromStorage(stat);
					break;

				default:
					break;
			}
		});
	};
	public ToStorage = function() {
		const storage = [];
		for (let i = 0; i < StatusEffect.LAST; i++) {
			const stat = this.stats[i];
			if (stat && stat.ToStorage) {
				const s = stat.ToStorage() || {};
				s.idx = i.toFixed();
				storage.push(s);
			}
		}
		return storage.length > 0 ? storage : undefined;
	};

	public Update = function(ent: any, hours: number) {
		// TODO Add Status effects
		if (this.stats[StatusEffect.Aroused]) {
			this.stats[StatusEffect.Aroused].Update(ent, hours);
		}
		if (this.stats[StatusEffect.Buff]) {
			this.stats[StatusEffect.Buff].Update(ent, hours);
		}
		if (this.stats[StatusEffect.Full]) {
			this.stats[StatusEffect.Full].Update(ent, hours);
		}
		if (this.stats[StatusEffect.Limp]) {
			this.stats[StatusEffect.Limp].Update(ent, hours);
		}
	};

	public Clear = function() {
		for (let i = 0; i < StatusEffect.LAST; i++) {
			this.stats[i] = undefined;
		}
	};

	public Render = function(obj: any[]) {
		let j = 0;

		for (let i = 0; i < StatusEffect.LAST; i++) {
			if (this.stats[i]) {
				if (Images.status[i]) { obj[j].attr({src: Images.status[i]}); }
				j++;
				if (j >= StatusList.NumStatus) {
					break;
				}
			}
		}

		for (; j < StatusList.NumStatus; j++) {
			obj[j].hide();
		}
	};

	public Tick = function(target: any) {
		for (let i = 0; i < StatusEffect.LAST; i++) {
			if (this.stats[i] && this.stats[i].Tick) {
				this.stats[i].Tick(target);
			}
		}
	};

	public EndOfCombat = function() {
		this.stats[StatusEffect.Burn]    = undefined;
		this.stats[StatusEffect.Freeze]  = undefined;
		this.stats[StatusEffect.Numb]    = undefined;
		// this.stats[StatusEffect.Petrify] = undefined;
		this.stats[StatusEffect.Venom]   = undefined;
		this.stats[StatusEffect.Blind]   = undefined;
		this.stats[StatusEffect.Siphon]  = undefined;
		this.stats[StatusEffect.Seal]    = undefined;
		this.stats[StatusEffect.Sleep]   = undefined;
		this.stats[StatusEffect.Enrage]  = undefined;
		// this.stats[StatusEffect.Fatigue] = undefined;
		this.stats[StatusEffect.Bleed]   = undefined;
		this.stats[StatusEffect.Haste]   = undefined;
		this.stats[StatusEffect.Slow]    = undefined;
		this.stats[StatusEffect.Regen]   = undefined;
		this.stats[StatusEffect.Boon]    = undefined;
		this.stats[StatusEffect.Horny]   = undefined;
		// this.stats[StatusEffect.Aroused] = undefined;
		// this.stats[StatusEffect.Limp]    = undefined;
		// this.stats[StatusEffect.Bimbo]   = undefined;
		this.stats[StatusEffect.Decoy]   = undefined;
		this.stats[StatusEffect.Counter] = undefined;
		// this.stats[StatusEffect.Full]    = undefined;
		this.stats[StatusEffect.Confuse] = undefined;
		this.stats[StatusEffect.Weakness] = undefined;
		// this.stats[StatusEffect.Buff]    = undefined;
		this.stats[StatusEffect.Curse]   = undefined;
	};

}
