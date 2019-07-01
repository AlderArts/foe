
NippleType = {
	ordinary : 0,
	inverted : 1,
	lipple   : 2,
	cunt     : 3,
	cock     : 4
}

// Defines a PAIR of breasts (or row)
function Breasts(race, color) {
	BodyPart.call(this, race, color);
	this.nippleCount     = 1; // Nipples/aerola
	this.nippleType      = NippleType.ordinary;
	this.size            = new Stat(1);
	this.nippleThickness = new Stat(0.5);
	this.nippleLength    = new Stat(0.5);
}
Breasts.prototype = new BodyPart();
Breasts.prototype.constructor = Breasts;

Breasts.prototype.ToStorage = function(full) {
	var storage = {
		size    : this.size.base.toFixed(2)
	};
	if(full) {
		storage.nipC    = this.nippleCount.toFixed();
		storage.col     = this.color.toFixed();
		storage.race    = this.race.id.toFixed();
		storage.nipThk  = this.nippleThickness.base.toFixed(2);
		storage.nipLen  = this.nippleLength.base.toFixed(2);
		storage.nipType = this.nippleType.toFixed();
	}
	return storage;
}

Breasts.prototype.FromStorage = function(storage) {
	storage = storage || {};
	this.color                = parseInt(storage.col)      || this.color;
	this.race                 = RaceDesc.IdToRace[parseInt(storage.race)] || this.race;
	this.nippleCount          = parseInt(storage.nipC)     || this.nippleCount;
	this.size.base            = parseFloat(storage.size)   || this.size.base;
	this.nippleThickness.base = parseFloat(storage.nipThk) || this.nippleThickness.base;
	this.nippleLength.base    = parseFloat(storage.nipLen) || this.nippleLength.base;
	this.nippleType           = parseInt(storage.nipType)  || this.nippleType;
}

Breasts.prototype.Size = function() {
	return this.size.Get();
}
Breasts.prototype.NipSize = function() {
	return this.nippleThickness.Get() * this.nippleLength.Get();
}
Breasts.prototype.noun = function() {
	var size = this.size.Get();
	var nouns = new Array();
	if(size <= 2) nouns.push("pec");
	nouns.push("breast");
	if(size >= 3) {
		nouns.push("boob");
		nouns.push("mound");
		nouns.push("mammary");
		nouns.push("globe");
		nouns.push("tit");
		nouns.push("can");
	}
	if(size >= 15) {
		nouns.push("jug");
		nouns.push("dug");
		nouns.push("melon");
		nouns.push("hooter");
		nouns.push("pillow");
	}
	return nouns[Rand(nouns.length)];
}
Breasts.prototype.nounPlural = function() {
	var size = this.size.Get();
	var nouns = new Array();
	if(size <= 2) nouns.push("pecs");
	nouns.push("breasts");
	if(size >= 3) {
		nouns.push("boobs");
		nouns.push("mounds");
		nouns.push("mammaries");
		nouns.push("globes");
		nouns.push("tits");
		nouns.push("cans");
	}
	if(size >= 15) {
		nouns.push("jugs");
		nouns.push("dugs");
		nouns.push("melons");
		nouns.push("hooters");
		nouns.push("pillows");
	}
	return nouns[Rand(nouns.length)];
}
Breasts.prototype.Desc = function() {
	var size = this.size.Get();
	
	var adjs = [];
	if(size <= 2) {
		adjs.push("manly");
		adjs.push("flat");
	}
	if(size > 2 && size <= 5) {
		adjs.push("tiny");
		adjs.push("petite");
		adjs.push("budding");
		adjs.push("small");
	}
	if(size > 5 && size <= 10) {
		adjs.push("well-proportioned");
		adjs.push("perky");
		adjs.push("ample");
		adjs.push("pert");
	}
	if(size > 10 && size <= 20) {
		adjs.push("large");
		adjs.push("huge");
		adjs.push("hefty");
		adjs.push("plentiful");
		adjs.push("bountiful");
	}
	if(size > 20 && size <= 40) {
		adjs.push("massive");
		adjs.push("immense");
		adjs.push("enormous");
	}
	if(size > 30 && size <= 50) {
		adjs.push("ridiculously large");
		adjs.push("ludicrous");
		adjs.push("gargantuan");
	}
	if(size > 40) {
		adjs.push("titanic");
		adjs.push("inhumanly large");
		adjs.push("monstrous");
		adjs.push("Jacques-sized");
	}
	var adj = adjs[Rand(adjs.length)];
	
	var cup;
	if     (size <= 1    ) cup = "manly";
	else if(size <= 2    ) cup = "AA-cup";
	else if(size <= 3    ) cup = "A-cup";
	else if(size <= 5    ) cup = "B-cup";
	else if(size <= 7.5  ) cup = "C-cup";
	else if(size <= 10   ) cup = "D-cup";
	else if(size <= 12.5 ) cup = "E-cup";
	else if(size <= 15   ) cup = "F-cup";
	else if(size <= 17.5 ) cup = "G-cup";
	else if(size <= 20   ) cup = "H-cup";
	else if(size <= 22.5 ) cup = "I-cup";
	else if(size <= 25   ) cup = "J-cup";
	else if(size <= 27.5 ) cup = "K-cup";
	else if(size <= 30   ) cup = "L-cup";
	else if(size <= 32.5 ) cup = "M-cup";
	else if(size <= 35   ) cup = "N-cup";
	else if(size <= 37.5 ) cup = "O-cup";
	else if(size <= 40   ) cup = "P-cup";
	else if(size <= 42.5 ) cup = "Q-cup";
	else if(size <= 45   ) cup = "R-cup";
	else if(size <= 47.5 ) cup = "S-cup";
	else if(size <= 50   ) cup = "T-cup";
	else if(size <= 52.5 ) cup = "U-cup";
	else if(size <= 55   ) cup = "V-cup";
	else if(size <= 57.5 ) cup = "W-cup";
	else if(size <= 60   ) cup = "X-cup";
	else if(size <= 70   ) cup = "XX-cup";
	else if(size <= 80   ) cup = "XXX-cup";
	else if(size <= 90   ) cup = "Y-cup";
	else if(size <= 100  ) cup = "YY-cup";
	else if(size <= 110  ) cup = "YYY-cup";
	else if(size <= 120  ) cup = "Z-cup";
	else if(size <= 130  ) cup = "ZZ-cup";
	else                   cup = "ZZZ-cup";
	
	var sizeStr = size / 2 + " inches";
	
	return {a:"a pair of", adj: adj, cup: cup, size: sizeStr};
}
Breasts.prototype.nipNoun = function() {
	// TODO
	return "nipple";
}
Breasts.prototype.nipNounPlural = function() {
	// TODO
	return "nipples";
}
Breasts.prototype.nipDesc = function() {
	// TODO
	var adj = "perky";
	
	var nipLen = this.nippleLength.Get() / 2 + " inches";
	var nipThickness = this.nippleThickness.Get() / 2 + " inches";
	
	return {a: "a", adj: adj, len: nipLen, thickness: nipThickness};
}
Breasts.prototype.NipShort = function() {
	var desc = this.nipDesc();
	return desc.adj + " " + this.nipNoun();
}
Breasts.prototype.NipsShort = function() {
	var desc = this.nipDesc();
	return desc.adj + " " + this.nipNounPlural();
}
Breasts.prototype.Short = function() {
	var desc = this.Desc();
	return desc.adj + " " + this.nounPlural();
}
Breasts.prototype.ShortCup = function() {
	var desc = this.Desc();
	return desc.cup + " " + this.nounPlural();
}
// TODO: lactation
Breasts.prototype.Long = function() {
	var desc = this.Desc();
	return desc.a + " " + desc.adj + " " + this.nounPlural();
}
