import * as _ from "lodash";

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
		const storage: any = super.ToStorage(full);
		if (full) {
			storage.size = this.buttSize.base.toFixed(2);
		}
		return storage;
	}

	public FromStorage(storage: any) {
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
			adjs.push("flat");
			adjs.push("non-existent");
			adjs.push("tight");
			adjs.push("firm");
		}
		if (size >= 2 && size < 5) {
			adjs.push("delicate");
			adjs.push("soft");
			adjs.push("dainty");
		}
		if (size >= 4 && size < 8) {
			adjs.push("ample");
			adjs.push("full");
			adjs.push("shapely");
			adjs.push("plump");
		}
		if (size >= 6 && size < 12) {
			adjs.push("juicy");
			adjs.push("squeezable");
			adjs.push("gropable");
		}
		if (size >= 10) {
			adjs.push("jiggly");
			adjs.push("expansive");
			adjs.push("massive");
			adjs.push("huge");
		}
		if (size >= 15) {
			adjs.push("immense");
			adjs.push("gargantuan");
			adjs.push("humonguous");
			adjs.push("enormous");
			adjs.push("titanic");
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
		if     (area <= 2 ) { ret = {a: "an", adj: "extremely tight"}; } else if (area <= 3 ) { ret = {a: "a", adj: "very tight"}; } else if (area <= 4 ) { ret = {a: "a", adj: "tight"}; } else if (area <= 5 ) { ret = {a: "a", adj: "well-proportioned"}; } else if (area <= 7 ) { ret = {a: "a", adj: "flexible"}; } else if (area <= 9 ) { ret = {a: "a", adj: "very flexible"}; } else if (area <= 11) { ret = {a: "a", adj: "loose"}; } else if (area <= 15) { ret = {a: "a", adj: "slutty"}; } else {                ret = {a: "a", adj: "gaping"}; }
		return ret;
	}
	// TODO
	public Short() {
		return Text.Parse("[adj] [noun]", {adj: this.adj(), noun: this.noun()});
	}
	// TODO: a
	public Long() {
		return Text.Parse("a [adj] [noun]", {adj: this.adj(), noun: this.noun()});
	}
	public AnalShort() {
		const desc = this.AnalDesc();
		const v = this.virgin ? " virgin " : " ";
		return desc.adj + v + this.analNoun();
	}
	public AnalLong() {
		const desc = this.AnalDesc();
		const v = this.virgin ? " virgin " : " ";
		return desc.a + " " + desc.adj + v + this.analNoun();
	}

	public holeDesc() {
		return this.analNoun();
	}

}
