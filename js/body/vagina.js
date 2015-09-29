
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
	cc.type = CockType.clitcock;
	this.clitCock = cc;
	cc.vag = this;
	return cc;
}

Vagina.prototype.noun = function() {
	var noun;
	var r = Rand(10);
	if     (r == 0) noun = "pussy";
	else if(r == 1) noun = "box";
	else if(r == 2) noun = "crevice";
	else if(r == 3) noun = "cunny";
	else if(r == 4) noun = "cunt";
	else if(r == 5) noun = "cooch";
	else if(r == 6) noun = "slit";
	else if(r == 7) noun = "snatch";
	else if(r == 8) noun = "vagina";
	else            noun = "fuckhole";
	return noun;
}
Vagina.prototype.nounPlural = function() {
	var noun;
	var r = Rand(9);
	if     (r == 0) noun = "pussies";
	else if(r == 1) noun = "boxes";
	else if(r == 2) noun = "crevices";
	else if(r == 3) noun = "cunnies";
	else if(r == 4) noun = "cunts";
	else if(r == 5) noun = "slits";
	else if(r == 6) noun = "snatches";
	else if(r == 7) noun = "vaginas";
	else            noun = "fuckholes";
	return noun;
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
	else                    ret = {a:"a", adj: "gaping"};
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
