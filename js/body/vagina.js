
Capacity = {
	tight  : 2,
	loose  : 5,
	gaping : 10
};

function Vagina() {
	this.color         = Color.pink;
	
	this.capacity      = new Stat(5);
	this.stretch       = new Stat(1);
	this.wetness       = new Stat(1);
	this.clitThickness = new Stat(0.5);
	this.clitLength    = new Stat(0.5);
	this.clitCock      = null;
	
	this.womb          = new Womb();
	
	this.virgin        = true;
}

Vagina.prototype.ToStorage = function() {
	var storage = {
		col    : this.color.toFixed(),
		cap    : this.capacity.base.toFixed(2),
		str    : this.stretch.base.toFixed(2),
		wet    : this.wetness.base.toFixed(2),
		clitT  : this.clitThickness.base.toFixed(2),
		clitL  : this.clitLength.base.toFixed(2),
		virgin : this.virgin ? 1 : 0
	};
	return storage;
}

Vagina.prototype.FromStorage = function(storage) {
	this.color              = parseInt(storage.col)     || this.color;
	this.capacity.base      = parseFloat(storage.cap)   || this.capacity.base;
	this.stretch.base       = parseFloat(storage.str)   || this.stretch.base;
	this.wetness.base       = parseFloat(storage.wet)   || this.wetness.base;
	this.clitThickness.base = parseFloat(storage.clitT) || this.clitThickness.base;
	this.clitLength.base    = parseFloat(storage.clitL) || this.clitLength.base;
	this.virgin             = parseInt(storage.virgin) == 1;
}

Vagina.prototype.Cap = function() {
	return this.capacity.Get() * this.stretch.Get();
}
Vagina.prototype.Pregnant = function() {
	return this.womb.pregnant;
}
// TODO
Vagina.prototype.Fits = function(cock, extension) {
	extension = extension || 0;
	return cock.length.Thickness() <= (this.Cap() + extension);
}
Vagina.prototype.Tightness = function() {
	return this.stretch.Get();
}
Vagina.Tightness = {
	tight  : 1,
	loose  : 2,
	gaping : 3
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
	if     (vagArea <= 5  ) ret = {a:"an", adj: "extremely tight"};
	else if(vagArea <= 10 ) ret = {a:"a", adj: "very tight"};
	else if(vagArea <= 20 ) ret = {a:"a", adj: "tight"};
	else if(vagArea <= 30 ) ret = {a:"a", adj: "well-proportioned"};
	else if(vagArea <= 40 ) ret = {a:"a", adj: "flexible"};
	else if(vagArea <= 50 ) ret = {a:"a", adj: "very flexible"};
	else if(vagArea <= 70 ) ret = {a:"a", adj: "loose"};
	else if(vagArea <= 100) ret = {a:"a", adj: "slutty"};
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
