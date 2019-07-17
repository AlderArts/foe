
import { Orifice } from './orifice';
import { Stat } from '../stat';

function Vagina() {
	Orifice.call(this);
	this.clit          = new Stat(0.5);
	this.clitCock      = null;
}
Vagina.prototype = new Orifice();
Vagina.prototype.constructor = Vagina;


Vagina.prototype.ToStorage = function(full) {
	var storage = Orifice.prototype.ToStorage.call(this, full);
	if(full) {
		storage.clit = this.clit.base.toFixed(2);
	}
	return storage;
}

Vagina.prototype.FromStorage = function(storage) {
	storage = storage || {};
	Orifice.prototype.FromStorage.call(this, storage);
	this.clit.base    = parseFloat(storage.clit) || this.clit.base;
}

// Create a clitcock from a vagina
// Returns the cock
Vagina.prototype.CreateClitcock = function() {
	var cc = new Cock();
	this.clitCock = cc;
	cc.vag = this;
	return cc;
}

Vagina.prototype.noun = function() {
	var nouns = [];
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
Vagina.prototype.nounPlural = function() {
	var nouns = [];
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
Vagina.prototype.Desc = function() {
	var vagArea = this.capacity.Get() * this.stretch.Get();
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
Vagina.prototype.Short = function() {
	var desc = this.Desc();
	var v = this.virgin ? " virgin " : " ";
	return desc.adj + v + this.noun();
}
// TODO
Vagina.prototype.ClitShort = function() {
	if(this.clitCock)
		return "clit-cock";
	else
		return "clit";
}
Vagina.prototype.holeDesc = function() {
	return this.noun();
}

export { Vagina };
