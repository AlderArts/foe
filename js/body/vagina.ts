import * as _ from 'lodash';

import { Orifice } from './orifice';
import { Stat } from '../stat';
import { Cock } from './cock';

export class Vagina extends Orifice {
	clit : Stat;
	clitCock : Cock;

	constructor() {
		super();
		this.clit          = new Stat(0.5);
		this.clitCock      = null;
	}

	ToStorage(full : any) {
		let storage = super.ToStorage(full);
		if(full) {
			storage.clit = this.clit.base.toFixed(2);
		}
		return storage;
	}

	FromStorage(storage : any) {
		storage = storage || {};
		super.FromStorage(storage);
		this.clit.base    = parseFloat(storage.clit) || this.clit.base;
	}

	// Create a clitcock from a vagina
	// Returns the cock
	CreateClitcock() {
		let cc = new Cock();
		this.clitCock = cc;
		cc.vag = this;
		return cc;
	}

	noun() {
		let nouns = [];
		nouns.push("pussy");
		nouns.push("box");
		nouns.push("crevice");
		nouns.push("cunny");
		nouns.push("cunt");
		nouns.push("cooch");
		nouns.push("slit");
		nouns.push("snatch");
		nouns.push("vagina");
		nouns.push("fuckhole");
		return _.sample(nouns);
	}
	nounPlural() {
		let nouns = [];
		nouns.push("pussies");
		nouns.push("boxes");
		nouns.push("crevices");
		nouns.push("cunnies");
		nouns.push("cunts");
		nouns.push("slits");
		nouns.push("snatches");
		nouns.push("vaginas");
		nouns.push("fuckholes");
		return _.sample(nouns);
	}
	Desc() {
		let ret = null;
		let vagArea = this.capacity.Get() * this.stretch.Get();
		if     (vagArea <= 3 ) ret = {a:"an", adj: "extremely tight"};
		else if(vagArea <= 4 ) ret = {a:"a", adj: "very tight"};
		else if(vagArea <= 5 ) ret = {a:"a", adj: "tight"};
		else if(vagArea <= 6 ) ret = {a:"a", adj: "well-proportioned"};
		else if(vagArea <= 8 ) ret = {a:"a", adj: "flexible"};
		else if(vagArea <= 10) ret = {a:"a", adj: "very flexible"};
		else if(vagArea <= 12) ret = {a:"a", adj: "loose"};
		else if(vagArea <= 15) ret = {a:"a", adj: "slutty"};
		else                   ret = {a:"a", adj: "gaping"};
		return ret;
	}
	// TODO
	Short() {
		let desc = this.Desc();
		let v = this.virgin ? " virgin " : " ";
		return desc.adj + v + this.noun();
	}
	// TODO
	ClitShort() {
		if(this.clitCock)
			return "clit-cock";
		else
			return "clit";
	}
	holeDesc() {
		return this.noun();
	}

}
