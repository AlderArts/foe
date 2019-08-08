import * as _ from 'lodash';
import { Status, StatusEffect } from "./statuseffect";
import { Images } from "./assets";

const NumStatus = 6;

export class StatusList {
	stats : any[];
	
	static get NumStatus() {
		return NumStatus;
	}

	constructor() {
		// Index contains null if status effect is inactive
		// Data in index can contain a degree/timer relevant to the effect
		this.stats = [];
	}

	FromStorage = function(storage : any) {
		if(!_.isArray(storage)) return;
		var that = this;
		_.each(storage, function(stat) {
			var idx = (stat.idx === undefined) ? 0 : parseInt(stat.idx);

			switch(idx) {
				//TODO Add permanent status effects here
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
	}
	ToStorage = function() {
		var storage = [];
		for(var i = 0; i < StatusEffect.LAST; i++) {
			var stat = this.stats[i];
			if(stat && stat.ToStorage) {
				var s = stat.ToStorage() || {};
				s["idx"] = i.toFixed();
				storage.push(s);
			}
		}
		return storage.length > 0 ? storage : null;
	}

	Update = function(ent : any, hours : number) {
		//TODO Add Status effects
		if(this.stats[StatusEffect.Aroused])
			this.stats[StatusEffect.Aroused].Update(ent, hours);
		if(this.stats[StatusEffect.Buff])
			this.stats[StatusEffect.Buff].Update(ent, hours);
		if(this.stats[StatusEffect.Full])
			this.stats[StatusEffect.Full].Update(ent, hours);
		if(this.stats[StatusEffect.Limp])
			this.stats[StatusEffect.Limp].Update(ent, hours);
	}

	Clear = function() {
		for(var i = 0; i < StatusEffect.LAST; i++)
			this.stats[i] = null;
	}

	Render = function(obj : any) {
		var j = 0;

		for(var i = 0; i < StatusEffect.LAST; i++) {
			if(this.stats[i]) {
				if(Images.status[i]) obj[j].attr({src: Images.status[i]});
				j++;
				if(j >= StatusList.NumStatus)
					break;
			}
		}

		for(; j < StatusList.NumStatus; j++) {
			obj[j].hide();
		}
	}

	Tick = function(target : any) {
		for(var i = 0; i < StatusEffect.LAST; i++) {
			if(this.stats[i] && this.stats[i].Tick)
				this.stats[i].Tick(target);
		}
	}

	EndOfCombat = function() {
		this.stats[StatusEffect.Burn]    = null;
		this.stats[StatusEffect.Freeze]  = null;
		this.stats[StatusEffect.Numb]    = null;
		//this.stats[StatusEffect.Petrify] = null;
		this.stats[StatusEffect.Venom]   = null;
		this.stats[StatusEffect.Blind]   = null;
		this.stats[StatusEffect.Siphon]  = null;
		this.stats[StatusEffect.Seal]    = null;
		this.stats[StatusEffect.Sleep]   = null;
		this.stats[StatusEffect.Enrage]  = null;
		//this.stats[StatusEffect.Fatigue] = null;
		this.stats[StatusEffect.Bleed]   = null;
		this.stats[StatusEffect.Haste]   = null;
		this.stats[StatusEffect.Slow]    = null;
		this.stats[StatusEffect.Regen]   = null;
		this.stats[StatusEffect.Boon]    = null;
		this.stats[StatusEffect.Horny]   = null;
		//this.stats[StatusEffect.Aroused] = null;
		//this.stats[StatusEffect.Limp]    = null;
		//this.stats[StatusEffect.Bimbo]   = null;
		this.stats[StatusEffect.Decoy]   = null;
		this.stats[StatusEffect.Counter] = null;
		//this.stats[StatusEffect.Full]    = null;
		this.stats[StatusEffect.Confuse] = null;
		this.stats[StatusEffect.Weakness] = null;
		//this.stats[StatusEffect.Buff]    = null;
		this.stats[StatusEffect.Curse]   = null;
	}

};
