
CockType = {
	ordinary : 0,
	clitcock : 1,
	tentacle : 2,
	ovipositor : 3
}

function Cock(race, color) {
	BodyPart.call(this, race, color);
	this.thickness = new Stat(3);
	this.length    = new Stat(15);
	this.type      = CockType.ordinary;
	this.vag       = null; // For clitcock
	this.knot      = 0;
	this.sheath    = 0;
	this.isStrapon = false;
}
Cock.prototype = new BodyPart();
Cock.prototype.constructor = Cock;

Cock.prototype.ToStorage = function() {
	var storage = {
		race   : this.race.toFixed(),
		col    : this.color.toFixed(),
		len    : this.length.base.toFixed(2),
		thk    : this.thickness.base.toFixed(2)
	};
	if(this.type != CockType.ordinary)
		storage.type = this.type.toFixed();
	if(this.knot != 0)
		storage.knot = this.knot.toFixed();
	if(this.sheath != 0)
		storage.sheath = this.sheath.toFixed();
	return storage;
}

Cock.prototype.FromStorage = function(storage) {
	this.race           = parseInt(storage.race)   || this.race;
	this.color          = parseInt(storage.col)    || this.color;
	this.type           = parseInt(storage.type)   || this.type;
	this.length.base    = parseFloat(storage.len)  || this.length.base;
	this.thickness.base = parseFloat(storage.thk)  || this.thickness.base;
	this.knot           = parseInt(storage.knot)   || this.knot;
	this.sheath         = parseInt(storage.sheath) || this.sheath;
}

Cock.prototype.Clone = function() {
	var cock            = new Cock(this.race, this.color);
	cock.thickness.base = this.thickness.base;
	cock.length.base    = this.length.base;
	cock.knot           = this.knot;
	cock.sheath         = this.sheath;
	return cock;
}

Cock.prototype.Len = function() {
	return this.length.Get();
}
Cock.prototype.Thickness = function() {
	return this.thickness.Get();
}
Cock.prototype.Size = function() {
	return this.thickness.Get() * this.length.Get();
}
Cock.prototype.Volume = function() {
	var r = this.thickness.Get() / 2;
	return Math.PI * r * r * this.length.Get();
}

Cock.prototype.noun = function() {
	var noun;
	if(this.type == CockType.clitcock) {
		var r = Rand(2);
		if     (r == 0) noun = "clit-cock";
		else if(r == 1) noun = "girl-cock";
	}
	else if(this.type == CockType.tentacle) {
		var r = Rand(2);
		if     (r == 0) noun = "tentacle";
		else if(r == 1) noun = "tentacle-cock";
	}
	else if(this.type == CockType.ovipositor) {
		var r = Rand(2);
		if     (r == 0) noun = "ovipositor";
		else if(r == 1) noun = "egg-layer";
	}
	else {
		var r = Rand(11);
		if     (r == 0) noun = "cock";
		else if(r == 1) noun = "dick";
		else if(r == 2) noun = "manhood";
		else if(r == 3) noun = "member";
		else if(r == 4) noun = "slab of meat";
		else if(r == 5) noun = "penis";
		else if(r == 6) noun = "phallus";
		else if(r == 7) noun = "prick";
		else if(r == 8) noun = "rod";
		else if(r == 9) noun = "shaft";
		else            noun = "dong";	
	}
	return noun;
}
Cock.prototype.nounPlural = function() {
	var noun;
	if(this.type == CockType.clitcock) {
		var r = Rand(2);
		if     (r == 0) noun = "clit-cocks";
		else if(r == 1) noun = "girl-cocks";
	}
	else {
		var r = Rand(11);
		if     (r == 0) noun = "cocks";
		else if(r == 1) noun = "dicks";
		else if(r == 2) noun = "manhoods";
		else if(r == 3) noun = "members";
		else if(r == 4) noun = "slabs of meat";
		else if(r == 5) noun = "penises";
		else if(r == 6) noun = "phalluses";
		else if(r == 7) noun = "pricks";
		else if(r == 8) noun = "rods";
		else if(r == 9) noun = "shafts";
		else            noun = "dongs";
	}
	return noun;
}
Cock.prototype.Desc = function() {
	var ret;
	var cockArea = this.thickness.Get() * this.length.Get();
	if     (cockArea <= 10 ) ret = {a:"a", adj: "tiny"};
	else if(cockArea <= 20 ) ret = {a:"a", adj: "small"};
	else if(cockArea <= 30 ) ret = {a:"a", adj: "below average"};
	else if(cockArea <= 40 ) ret = {a:"a", adj: "well-proportioned"};
	else if(cockArea <= 50 ) ret = {a:"a", adj: "strapping"};
	else if(cockArea <= 70 ) ret = {a:"a", adj: "big"};
	else if(cockArea <= 90 ) ret = {a:"a", adj: "large"};
	else if(cockArea <= 120) ret = {a:"a", adj: "huge"};
	else if(cockArea <= 200) ret = {a:"an", adj: "enormous"};
	else if(cockArea <= 400) ret = {a:"an", adj: "immense"};
	else if(cockArea <= 800) ret = {a:"a", adj: "gargantuan"};
	else                     ret = {a:"a", adj: "titanic"};
	
	ret.len = (MEASUREUNIT == Unit.american) ?
		Unit.CmToInch(this.length.Get()) + " inches" :
		this.length.Get() + " cms";
	ret.thickness = (MEASUREUNIT == Unit.american) ?
		Unit.CmToInch(this.thickness.Get()) + " inches" :
		this.thickness.Get() + " cms";
	
	return ret;
}
Cock.prototype.Short = function() {
	var desc = this.Desc();
	var noun = this.noun();
	var knotted = this.knot   != 0 && Math.random() < 0.5 ? ", knotted"  : "";
	var sheath  = this.sheath != 0 && Math.random() < 0.5 ? ", sheathed" : "";
	var race = " ";
	if(this.race == Race.human && Math.random() < 0.1) race += Race.Desc(this.race);
	if(this.race != Race.human && Math.random() < 0.5) race += Race.Desc(this.race);
	return desc.adj + knotted + sheath + race + " " + noun;
}
// TODO
Cock.prototype.TipShort = function() {
	var qualifier = "";
	
	switch(this.race) {
		case Race.horse: qualifier = "flared "; break;
		
		case Race.wolf:
		case Race.dragon:
		case Race.lizard:
		case Race.fox:
		case Race.dog: qualifier = "tapered "; break;
		
		case Race.cat: qualifier = "barbed "; break;
		
		case Race.ferret:
		case Race.demon:
		case Race.cow:
		case Race.rabbit:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.elf:
		case Race.human:
		default: break;
	}
	
	var nouns = [
	"tip",
	"head"
	];
	var noun = nouns[Math.floor(Math.random() * nouns.length)];
	
	return qualifier + noun;
}
// TODO (knot size?)
Cock.prototype.KnotShort = function() {
	return "knot";
}
// TODO: Better descriptions
Cock.prototype.aLong = function() {
	var desc    = this.Desc();
	var noun    = this.noun();
	var knotted = this.knot   != 0 ? ", knotted" : "";
	var sheath  = this.sheath != 0 ? ", sheathed" : "";
	return desc.a + " " + desc.adj + knotted + sheath + " " + Race.Desc(this.race) + " " + noun + ", " + desc.len + " long and " + desc.thickness + " thick";
}
// TODO: Better descriptions
Cock.prototype.Long = function() {
	var desc    = this.Desc();
	var noun    = this.noun();
	var knotted = this.knot   != 0 ? ", knotted" : "";
	var sheath  = this.sheath != 0 ? ", sheathed" : "";
	return desc.adj + knotted + sheath + " " + Race.Desc(this.race) + " " + cock.noun() + ", " + desc.len + " long and " + desc.thickness + " thick";
}
