import * as _ from "lodash";

import { IStorage } from "../istorage";
import { Stat } from "../stat";
import { Text } from "../text";
import { Orifice } from "./orifice";

export class Butt extends Orifice {
	public buttSize: Stat;

	constructor() {
		super();
		this.buttSize   = new Stat(1);
	}

	public ToStorage(full?: boolean) {
		const storage: IStorage = super.ToStorage(full);
		if (full) {
			storage.size = this.buttSize.base.toFixed(2);
		}
		return storage;
	}

	public FromStorage(storage: IStorage) {
		storage = storage || {};
		super.FromStorage(storage);
		this.buttSize.base   = parseFloat(storage.size) || this.buttSize.base;
	}

	public Size() {
		return this.buttSize.Get();
	}

	public noun() {
		const size = this.buttSize.Get();
		const nouns = new Array();
		nouns.push("butt");
		nouns.push("rear");
		nouns.push("rump");
		nouns.push("tush");
		nouns.push("posterior");
		nouns.push("flank");
		return _.sample(nouns);
	}
	public adj() {
		const size = this.buttSize.Get();
		const adjs = [];
		if (size < 2) {
			adjs.push({a: "a", adj: "flat"});
			adjs.push({a: "a", adj: "non-existent"});
			adjs.push({a: "a", adj: "tight"});
			adjs.push({a: "a", adj: "firm"});
		}
		if (size >= 2 && size < 5) {
			adjs.push({a: "a", adj: "delicate"});
			adjs.push({a: "a", adj: "soft"});
			adjs.push({a: "a", adj: "dainty"});
		}
		if (size >= 4 && size < 8) {
			adjs.push({a: "an", adj: "ample"});
			adjs.push({a: "a", adj: "full"});
			adjs.push({a: "a", adj: "shapely"});
			adjs.push({a: "a", adj: "plump"});
		}
		if (size >= 6 && size < 12) {
			adjs.push({a: "a", adj: "juicy"});
			adjs.push({a: "a", adj: "squeezable"});
			adjs.push({a: "a", adj: "gropable"});
		}
		if (size >= 10) {
			adjs.push({a: "a", adj: "jiggly"});
			adjs.push({a: "an", adj: "expansive"});
			adjs.push({a: "a", adj: "massive"});
			adjs.push({a: "a", adj: "huge"});
		}
		if (size >= 15) {
			adjs.push({a: "an", adj: "immense"});
			adjs.push({a: "a", adj: "gargantuan"});
			adjs.push({a: "a", adj: "humonguous"});
			adjs.push({a: "an", adj: "enormous"});
			adjs.push({a: "a", adj: "titanic"});
		}
		return _.sample(adjs);
	}
	public analNoun() {
		const nouns = [];
		nouns.push("pucker");
		nouns.push("anus");
		nouns.push("anal opening");
		nouns.push("asshole");
		nouns.push("colon");
		nouns.push("sphincter");
		nouns.push("ass");
		return _.sample(nouns);
	}
	public AnalDesc() {
		let ret;
		const area = this.capacity.Get() * this.stretch.Get();
		if (area <= 2 ) {
			ret = {a: "an", adj: "extremely tight"};
		} else if (area <= 3 ) {
			ret = {a: "a", adj: "very tight"};
		} else if (area <= 4 ) {
			ret = {a: "a", adj: "tight"};
		} else if (area <= 5 ) {
			ret = {a: "a", adj: "well-proportioned"};
		} else if (area <= 7 ) {
			ret = {a: "a", adj: "flexible"};
		} else if (area <= 9 ) {
			ret = {a: "a", adj: "very flexible"};
		} else if (area <= 11) {
			ret = {a: "a", adj: "loose"};
		} else if (area <= 15) {
			ret = {a: "a", adj: "slutty"};
		} else {
			ret = {a: "a", adj: "gaping"};
		}
		return ret;
	}
	// TODO
	public Short() {
		return `${this.adj().adj} ${this.noun()}`;
	}
	// TODO: a
	public Long() {
		const desc = this.adj();
		return `${desc.a} ${desc.adj} ${this.noun()}`;
	}
	public AnalShort() {
		const desc = this.AnalDesc();
		const v = this.virgin ? " virgin " : " ";
		return `${desc.adj}${v}${this.analNoun()}`;
	}
	public AnalLong() {
		const desc = this.AnalDesc();
		const v = this.virgin ? " virgin " : " ";
		return `${desc.a} ${desc.adj}${v}${this.analNoun()}`;
	}

	public holeDesc() {
		return this.analNoun();
	}

}
