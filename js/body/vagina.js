
function Vagina() {
	this.color         = Color.pink;
	
	this.capacity      = new Stat(20);
	this.stretch       = new Stat(1);
	this.wetness       = new Stat(1);
	this.clitThickness = new Stat(0.5);
	this.clitLength    = new Stat(0.5);
	this.clitCock      = null;
	
	this.womb          = new Womb();
	
	this.virgin        = true;
}
Vagina.prototype.Pregnant = function() {
	return this.womb.pregnant;
}
// TODO
Vagina.prototype.Fits = function(cock, extension) {
	extension = extension || 0;
	return cock.length.Get() <= (this.capacity.Get() + extension);
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
