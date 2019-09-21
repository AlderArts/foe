import * as _ from "lodash";

import { IStorage } from "../istorage";
import { Stat } from "../stat";
import { Cock } from "./cock";
import { Orifice } from "./orifice";

export class Vagina extends Orifice {
	public clit: Stat;
	public clitCock: Cock;

	constructor() {
		super();
		this.clit          = new Stat(0.5);
	}

	public ToStorage(full: boolean) {
		const storage = super.ToStorage(full);
		if (full) {
			storage.clit = this.clit.base.toFixed(2);
		}
		return storage;
	}

	public FromStorage(storage: IStorage) {
		storage = storage || {};
		super.FromStorage(storage);
		this.clit.base    = parseFloat(storage.clit) || this.clit.base;
	}

	// Create a clitcock from a vagina
	// Returns the cock
	public CreateClitcock() {
		const cc = new Cock();
		this.clitCock = cc;
		cc.vag = this;
		return cc;
	}

	public noun() {
		const nouns = [];
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
	public nounPlural() {
		const nouns = [];
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
	public Desc() {
		let ret;
		const vagArea = this.capacity.Get() * this.stretch.Get();
		if     (vagArea <= 3 ) {
			ret = {a: "an", adj: "extremely tight"};
		} else if (vagArea <= 4 ) {
			ret = {a: "a", adj: "very tight"};
		} else if (vagArea <= 5 ) {
			ret = {a: "a", adj: "tight"};
		} else if (vagArea <= 6 ) {
			ret = {a: "a", adj: "well-proportioned"};
		} else if (vagArea <= 8 ) {
			ret = {a: "a", adj: "flexible"};
		} else if (vagArea <= 10) {
			ret = {a: "a", adj: "very flexible"};
		} else if (vagArea <= 12) {
			ret = {a: "a", adj: "loose"};
		} else if (vagArea <= 15) {
			ret = {a: "a", adj: "slutty"};
		} else {
			ret = {a: "a", adj: "gaping"};
		}
		return ret;
	}
	// TODO
	public Short() {
		const desc = this.Desc();
		const v = this.virgin ? " virgin " : " ";
		return `${desc.adj}${v}${this.noun()}`;
	}
	// TODO
	public ClitShort() {
		if (this.clitCock) {
			return "clit-cock";
		} else {
			return "clit";
		}
	}
	public holeDesc() {
		return this.noun();
	}

}
