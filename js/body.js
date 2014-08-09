
Gender = {
	male   : 0,
	female : 1,
	herm   : 2,
	none   : 3,
	LAST   : 4
}
Gender.Desc = function(gender) {
	var r;
	switch(gender) {
	case Gender.male: return "male";
	case Gender.female: return "female";
	case Gender.herm: r = Rand(2);
		if(r == 0) return "hermaphrodite";
		else return "herm";
	default: return "genderless";
	}
}
Gender.Short = function(gender) {
	var r;
	switch(gender) {
	case Gender.male: return "M";
	case Gender.female: return "F";
	case Gender.herm: return "H";
	default: return "-";
	}
}
Gender.Rand = function(odds) {
	odds = odds || [1, 1, 1];
	var sum = 0;
	for(var i = 0; i < Gender.LAST; i++) {
		if(odds[i]) sum += odds[i];
	}
	
	var step = Math.random() * sum;
	
	for(var i = 0; i < Gender.LAST; i++) {
		if(odds[i])
			step -= odds[i];
		if(step <= 0.0)
			return i;
	}
	return Gender.none;
}

// TODO: Palette instead?
Color = {
	white    : 0,
	olive    : 1,
	black    : 2,
	red      : 3,
	green    : 4,
	blue     : 5,
	silver   : 6,
	gold     : 7,
	bronze   : 8,
	orange   : 9,
	light    : 10,
	dark     : 11,
	gray     : 12,
	brown    : 13,
	yellow   : 14,
	blonde   : 15,
	platinum : 16,
	purple   : 17,
	pink     : 18,
	teal     : 19,
	
	
	numColors: 20
}
Color.Desc = function(col) {
	switch(col) {
	case Color.white:    return "white";
	case Color.light:    return "light";
	case Color.dark:     return "dark";
	case Color.gray:     return "gray";
	case Color.olive:    return "olive";
	case Color.black:    return "black";
	case Color.red:      return "red";
	case Color.green:    return "green";
	case Color.blue:     return "blue";
	case Color.silver:   return "silver";
	case Color.gold:     return "gold";
	case Color.bronze:   return "bronze";
	case Color.orange:   return "orange";
	case Color.brown:    return "brown";
	case Color.yellow:   return "yellow";
	case Color.blonde:   return "blonde";
	case Color.platinum: return "platinum";
	case Color.purple:   return "purple";
	case Color.pink:     return "pink";
	case Color.teal:     return "teal";
	
	default:             return "colorless";
	}
}

Race = {
	human    : 0,
	horse    : 1,
	cat      : 2,
	dog      : 3,
	fox      : 4,
	lizard   : 5,
	rabbit   : 6,
	demon    : 7,
	dragon   : 8,
	dryad    : 9,
	elf      : 10,
	satyr    : 11,
	sheep    : 12,
	goat     : 13,
	cow      : 14,
	wolf     : 15,
	avian    : 16,
	moth     : 17,
	scorpion : 18,
	ferret   : 19,
	plant    : 20,
	
	// TODO: Keep updated!
	numRaces : 21
}
Race.Desc = function(race) {
	var r;
	switch(race) {
	case Race.human: return "human";
	case Race.horse: r = Rand(2);
		if(r == 0) return "horse";
		else       return "equine";
	case Race.cat: r = Rand(2);
		if(r == 0) return "cat";
		else       return "feline";
	case Race.dog: r = Rand(2);
		if(r == 0) return "dog";
		else       return "canine";
	case Race.fox: r = Rand(3);
		if     (r == 0) return "fox";
		else if(r == 1) return "fennec";
		else            return "vulpine";
	case Race.lizard: return "lizard";
	case Race.rabbit: r = Rand(2);
		if(r == 0) return "rabbit";
		else       return "lapine";
	case Race.demon: r = Rand(2);
		if     (r == 0) return "demon";
		else if(r == 1) return "hellish";
		else            return "infernal";
	case Race.dragon: r = Rand(2);
		if(r == 0) return "dragon";
		else       return "draconian";
	case Race.dryad: r = Rand(2);
		if(r == 0) return "dryad";
		else       return "fawn";
	case Race.satyr: r = Rand(2);
		if(r == 0) return "satyr";
		else       return "faun";
	case Race.elf: r = Rand(2);
		if(r == 0) return "elf";
		else       return "elfin";
	case Race.sheep: r = Rand(2);
		if(r == 0) return "sheep";
		else       return "ovine";
	case Race.goat:  return "goat";
	case Race.cow: r = Rand(2);
		if(r == 0) return "cow";
		else       return "bovine";
	case Race.wolf: r = Rand(2);
		if(r == 0) return "wolf";
		else       return "lupine";
	case Race.avian: r = Rand(2);
		if(r == 0) return "avian";
		else       return "bird";
	case Race.moth: return "moth";
	case Race.scorpion: return "scorpion";
	case Race.ferret: return "ferret";
	case Race.plant: return "plant";
	default: return "undefined";
	}
}

Race.Quantifier = function(race) {
	var r;
	switch(race) {
	case Race.human: return "a human";
	case Race.horse: r = Rand(2);
		if(r == 0) return "a horse";
		else       return "an equine";
	case Race.cat: r = Rand(2);
		if(r == 0) return "a cat";
		else       return "a feline";
	case Race.dog: r = Rand(2);
		if(r == 0) return "a dog";
		else       return "a canine";
	case Race.fox: r = Rand(3);
		if     (r == 0) return "a fox";
		else if(r == 1) return "a fennec";
		else            return "a vulpine";
	case Race.lizard: return "a lizard";
	case Race.rabbit: r = Rand(2);
		if(r == 0) return "a rabbit";
		else       return "a lapine";
	case Race.demon: r = Rand(2);
		if     (r == 0) return "a demon";
		else if(r == 1) return "a hellish";
		else            return "an infernal";
	case Race.dragon: r = Rand(2);
		if(r == 0) return "a dragon";
		else       return "a draconian";
	case Race.dryad: r = Rand(2);
		if(r == 0) return "a dryad";
		else       return "a fawn";
	case Race.satyr: r = Rand(2);
		if(r == 0) return "a satyr";
		else       return "a faun";
	case Race.elf: r = Rand(2);
		if(r == 0) return "an elf";
		else       return "an elfin";
	case Race.sheep: r = Rand(2);
		if(r == 0) return "a sheep";
		else       return "an ovine";
	case Race.goat:  return "a goat";
	case Race.cow: r = Rand(2);
		if(r == 0) return "a cow";
		else       return "a bovine";
	case Race.wolf: r = Rand(2);
		if(r == 0) return "a wolf";
		else       return "a lupine";
	case Race.avian: r = Rand(2);
		if(r == 0) return "an avian";
		else       return "a bird";
	case Race.moth: return "a moth";
	case Race.scorpion: return "a scorpion";
	case Race.ferret: return "a ferret";
	case Race.plant: return "a plant-like";
	default: return "an undefined";
	}
}

function BodyPart(race, color) {
	race       = race  || Race.human;
	color      = color || Color.white;
	this.race  = race;
	this.color = color;
}

BodyPartType = {
	cock   : 0,
	vagina : 1,
	ass    : 2,
	nipple : 3,
	mouth  : 4
}

// Describe a standard humanoid-ish body
function Body(ent) {
	var debugName = ent + ".body";
	// Body stats
	this.muscleTone = new Stat(0);
	this.muscleTone.debug = function() { return debugName + ".muscleTone"; }
	this.bodyMass   = new Stat(0);
	this.bodyMass.debug = function() { return debugName + ".bodyMass"; }
	this.height     = new Stat(175); // cm
	this.height.debug = function() { return debugName + ".height"; }
	// TODO: fix?
	this.weigth     = new Stat(65); // kg
	this.weigth.debug = function() { return debugName + ".weigth"; }
	
	this.femininity = new Stat(0);
	this.femininity.debug = function() { return debugName + ".femininity"; }
	
	// BODYPARTS
	// Head
	this.head = new BodyPart();
	this.head.mouth = {
		capacity     : new Stat(30),
		tongue       : new BodyPart(),
		tongueLength : new Stat(7)
	}
	this.head.hair = new Hair();
	this.head.eyes = new BodyPart();
	this.head.eyes.count = new Stat(2);
	this.head.ears = new BodyPart();
	// Appendages (antenna etc)
	this.head.appendages = new Array();
	
	// Torso
	this.torso         = new BodyPart();
	this.torso.hipSize = new Stat(1); // TODO: Default
	this.torso.hipSize.debug = function() { return debugName + ".hipSize"; }
	// Add slots for wings, tails and such
	this.backSlots     = new Array();
	
	// Genetalia
	this.cock = new Array();
	this.balls = new Balls();
	
	this.pubes = {
		color  : Color.white,
		amount : new Stat(0)
	}
	this.vagina = new Array();
	this.ass = new Butt();
	
	this.breasts = new Array();
	this.breasts.push(new Breasts());
	
	// TODO: Defaults
	this.milkProduction = new Stat(0);
	this.milkCap        = new Stat(0);
	this.milk           = new Stat(0);
	
	// Arms and legs
	this.arms = new BodyPart();
	this.arms.count = 2;
	this.legs = new BodyPart();
	this.legs.count = 2;
	
	// TODO: Hands/Feet?
}


Body.prototype.SetRace = function(race) {
	this.head.race              = race;
	this.head.mouth.tongue.race = race;
	this.head.eyes.race         = race;
	this.head.ears.race         = race;
	this.torso.race             = race;
	for(var i = 0; i < this.cock.length; i++)
		this.cock[i].race = race;
	this.balls.race = race;
	this.arms.race = race;
	this.legs.race = race;
}

Body.prototype.NumAttributes = function(race) {
	var sum = 0;
	if(this.head.race == race)              sum++;
	if(this.head.mouth.tongue.race == race) sum++;
	if(this.head.eyes.race == race)         sum++;
	if(this.head.ears.race == race)         sum++;
	if(this.torso.race == race)             sum++;
	if(this.arms.race == race)              sum++;
	if(this.legs.race == race)              sum++;
	for(var i = 0; i < this.cock.length; i++)
		if(this.cock[i].race == race) sum++;
	if(this.balls.race == race && this.balls.count.Get() > 0) sum++;
	for(var i = 0; i < this.backSlots.length; i++)
		if(this.backSlots[i].race == race) sum++;
	for(var i = 0; i < this.head.appendages.length; i++)
		if(this.head.appendages[i].race == race) sum++;
	return sum;
}


Body.prototype.ToStorage = function() {
	var storage = {
		tone   : this.muscleTone.base,
		mass   : this.bodyMass.base,
		height : this.height.base,
		weigth : this.weigth.base,
		fem    : this.femininity.base
	};
	
	storage.head = {
		race : this.head.race,
		col  : this.head.color
	};
	storage.head.mouth = {
		cap  : this.head.mouth.capacity.base,
		ton  : {race : this.head.mouth.tongue.race, col : this.head.mouth.tongue.color},
		tonL : this.head.mouth.tongueLength.base
	};
	storage.head.hair = {
		race  : this.head.hair.race,
		col   : this.head.hair.color,
		len   : this.head.hair.length.base,
		style : this.head.hair.style
	};
	storage.head.eyes = {
		race  : this.head.eyes.race,
		col   : this.head.eyes.color,
		count : this.head.eyes.count.base
	};
	storage.head.ears = {
		race : this.head.ears.race,
		col  : this.head.ears.color
	};
	storage.head.app = new Array();
	for(var i = 0; i < this.head.appendages.length; i++) {
		var a = this.head.appendages[i];
		storage.head.app.push({
			race  : a.race,
			col   : a.color,
			type  : a.type,
			count : a.count
		});
	}
	storage.torso = {
		race : this.torso.race,
		col  : this.torso.color,
		hip  : this.torso.hipSize.base
	};
	storage.back = new Array();
	for(var i = 0; i < this.backSlots.length; i++) {
		var a = this.backSlots[i];
		storage.back.push({
			race  : a.race,
			col   : a.color,
			type  : a.type,
			count : a.count
		});
	}
	// Genetalia
	storage.cock = new Array();
	for(var i = 0; i < this.cock.length; i++) {
		var a = this.cock[i];
		var c = {
			race  : a.race,
			col   : a.color,
			type  : a.type,
			len   : a.length.base,
			thk   : a.thickness.base,
			knot  : a.knot,
			sheath: a.sheath
		};
		if(a.vag)
			c.ccIdx = this.vagina.indexOf(a.vag);
		storage.cock.push(c);
	}
	storage.balls = {
		race  : this.balls.race,
		col   : this.balls.color,
		count : this.balls.count.base,
		size  : this.balls.size.base,
		cum   : this.balls.cum.base,
		cumP  : this.balls.cumProduction.base,
		cumC  : this.balls.cumCap.base,
		fer   : this.balls.fertility.base
	};
	storage.pubes = {
		col : this.pubes.color,
		am  : this.pubes.amount.base
	};
	storage.vag = new Array();
	for(var i = 0; i < this.vagina.length; i++) {
		var a = this.vagina[i];
		var v = {
			col    : a.color,
			cap    : a.capacity.base,
			str    : a.stretch.base,
			wet    : a.wetness.base,
			clitT  : a.clitThickness.base,
			clitL  : a.clitLength.base,
			virgin : a.virgin ? 1 : 0
		};
		storage.vag.push(v);
	}
	storage.ass = {
		cap    : this.ass.capacity.base,
		str    : this.ass.stretch.base,
		size   : this.ass.buttSize.base,
		virgin : this.ass.virgin ? 1 : 0
	};
	storage.breasts = new Array();
	for(var i = 0; i < this.breasts.length; i++) {
		var a = this.breasts[i];
		var b = {
			col     : a.color,
			race    : a.race,
			nipC    : a.nippleCount,
			size    : a.size.base,
			nipThk  : a.nippleThickness.base,
			nipLen  : a.nippleLength.base,
			aerS    : a.aerolaSize.base,
			nipType : a.nippleType,
			lactR   : a.lactationRate.base
		};
		storage.breasts.push(b);
	}
	
	storage.milk  = this.milk.base;
	storage.milkP = this.milkProduction.base;
	storage.milkC = this.milkCap.base;
	
	// Arms and legs
	storage.arms = {
		race  : this.arms.race,
		col   : this.arms.color,
		count : this.arms.count
	};
	
	storage.legs = {
		race  : this.legs.race,
		col   : this.legs.color,
		count : this.legs.count
	};

	return storage;
}

Body.prototype.FromStorage = function(storage) {
	
	this.muscleTone.base = parseFloat(storage.tone)   || this.muscleTone.base;
	this.bodyMass.base   = parseFloat(storage.mass)   || this.bodyMass.base;
	this.height.base     = parseFloat(storage.height) || this.height;
	this.weigth.base     = parseFloat(storage.weigth) || this.weigth;
	this.femininity.base = parseFloat(storage.fem)    || this.femininity;
	
	this.head.race   = parseInt(storage.head.race) || this.head.race;
	this.head.color  = parseInt(storage.head.col)  || this.head.color;
	this.head.mouth.tongue.race       = parseInt(storage.head.mouth.ton.race) || this.head.mouth.tongue.race;
	this.head.mouth.tongue.color      = parseInt(storage.head.mouth.ton.col)  || this.head.mouth.tongue.color;
	this.head.mouth.capacity.base     = parseFloat(storage.head.mouth.cap)    || this.head.mouth.capacity.base;
	this.head.mouth.tongueLength.base = parseFloat(storage.head.mouth.tonL)   || this.head.mouth.tongueLength.base;
	
	this.head.hair.race        = parseInt(storage.head.hair.race)  || this.head.hair.race;
	this.head.hair.color       = parseInt(storage.head.hair.col)   || this.head.hair.color;
	this.head.hair.length.base = parseInt(storage.head.hair.len)   || this.head.hair.length.base;
	this.head.hair.style       = parseInt(storage.head.hair.style) || this.head.hair.style;
	
	this.head.eyes.race        = parseInt(storage.head.eyes.race)  || this.head.eyes.race;
	this.head.eyes.color       = parseInt(storage.head.eyes.col)   || this.head.eyes.color;
	this.head.eyes.count.base  = parseInt(storage.head.eyes.count) || this.head.eyes.count.base;
	
	this.head.ears.race        = parseInt(storage.head.ears.race)  || this.head.ears.race;
	this.head.ears.color       = parseInt(storage.head.ears.col)   || this.head.ears.color;
	
	this.head.appendages = new Array();
	for(var i = 0; i < storage.head.app.length; i++) {
		var a = storage.head.app[i];
		var newApp = new Appendage(
			parseInt(a.type),
			parseInt(a.race),
			parseInt(a.col),
			parseInt(a.count));
		
		this.head.appendages.push(newApp);
	}
	
	this.torso.race         = parseInt(storage.torso.race) || this.torso.race;
	this.torso.color        = parseInt(storage.torso.col)  || this.torso.color;
	this.torso.hipSize.base = parseFloat(storage.torso.hip)  || this.torso.hipSize.base;
	
	this.backSlots = new Array();
	for(var i = 0; i < storage.back.length; i++) {
		var a = storage.back[i];
		var newApp = new Appendage(
			parseInt(a.type),
			parseInt(a.race),
			parseInt(a.col),
			parseInt(a.count));
		
		this.backSlots.push(newApp);
	}
	
	this.cock = new Array();
	for(var i = 0; i < storage.cock.length; i++) {
		var a = storage.cock[i];
		var c = new Cock();
		c.race           = parseInt(a.race)   || c.race;
		c.color          = parseInt(a.col)    || c.color;
		c.type           = parseInt(a.type)   || c.type;
		c.length.base    = parseFloat(a.len)  || c.length.base;
		c.thickness.base = parseFloat(a.thk)  || c.thickness.base;
		c.knot           = parseInt(a.knot)   || c.knot;
		c.sheath         = parseInt(a.sheath) || c.sheath;
		this.cock.push(c);
	}
	
	this.balls.race               = parseInt(storage.balls.race)   || this.balls.race;
	this.balls.color              = parseInt(storage.balls.col)    || this.balls.color;
	this.balls.count.base         = parseInt(storage.balls.count)  || this.balls.count.base;
	this.balls.size.base          = parseFloat(storage.balls.size) || this.balls.size.base;
	this.balls.cum.base           = parseFloat(storage.balls.cum)  || this.balls.cum.base;
	this.balls.cumProduction.base = parseFloat(storage.balls.cumP) || this.balls.cumProduction.base;
	this.balls.cumCap.base        = parseFloat(storage.balls.cumC) || this.balls.cumCap.base;
	this.balls.fertility.base     = parseFloat(storage.balls.fer)  || this.balls.fertility.base;
	
	this.pubes.color              = parseInt(storage.pubes.col)    || this.pubes.color;
	this.pubes.amount.base        = parseFloat(storage.pubes.am)   || this.pubes.amount.base;
	
	this.vagina = new Array();
	for(var i = 0; i < storage.vag.length; i++) {
		var a = storage.vag[i];
		var v = new Vagina();
		v.color              = parseInt(a.col)     || v.color;
		v.capacity.base      = parseFloat(a.cap)   || v.capacity.base;
		v.stretch.base       = parseFloat(a.str)   || v.stretch.base;
		v.wetness.base       = parseFloat(a.wet)   || v.wetness.base;
		v.clitThickness.base = parseFloat(a.clitT) || v.clitThickness.base;
		v.clitLength.base    = parseFloat(a.clitL) || v.clitLength.base;
		v.virgin             = parseInt(a.virgin) == 1;
		
		this.vagina.push(v);
	}
	
	// Restore clitcocks
	for(var i = 0; i < storage.cock.length; i++) {
		var a     = storage.cock[i];
		var ccIdx = parseInt(a.ccIdx);
		
		if(ccIdx >= 0 && ccIdx < this.vagina.length) {
			var v      = this.vagina[ccIdx];
			v.clitCock = this.cock[i];
			this.cock[i].vag = v;
		}
	}

	this.ass = new Butt();
	this.ass.capacity.base = parseFloat(storage.ass.cap)  || this.ass.capacity.base;
	this.ass.stretch.base  = parseFloat(storage.ass.str)  || this.ass.stretch.base;
	this.ass.buttSize.base = parseFloat(storage.ass.size) || this.ass.buttSize.base;
	this.ass.virgin        = parseInt(storage.ass.virgin) == 1;
	
	this.breasts = new Array();
	for(var i = 0; i < storage.breasts.length; i++) {
		var a = storage.breasts[i];
		var b = new Breasts();
		b.color                = parseInt(a.col)      || b.color;
		b.race                 = parseInt(a.race)     || b.race;
		b.nippleCount          = parseInt(a.nipC)     || b.nippleCount;
		b.size.base            = parseFloat(a.size)   || b.size.base;
		b.nippleThickness.base = parseFloat(a.nipThk) || b.nippleThickness.base;
		b.nippleLength.base    = parseFloat(a.nipLen) || b.nippleLength.base;
		b.aerolaSize.base      = parseFloat(a.aerS)   || b.aerolaSize.base;
		b.nippleType           = parseInt(a.nipType)  || b.nippleType;
		b.lactationRate.base   = parseFloat(a.lactR)  || b.lactationRate.base;
		
		this.breasts.push(b);
	}
	
	this.milk.base           = parseFloat(storage.milk)  || this.milk.base;
	this.milkProduction.base = parseFloat(storage.milkP) || this.milkProduction.base;
	this.milkCap.base        = parseFloat(storage.milkC) || this.milkCap.base;

	this.arms = new BodyPart();
	{
		var a = storage.arms;
		this.arms.race  = parseInt(a.race)  || this.torso.race;
		this.arms.color = parseInt(a.col)   || this.torso.color;
		this.arms.count = parseInt(a.count) || 2;
	}
	this.legs = new BodyPart();
	{
		var a = storage.legs;
		this.legs.race  = parseInt(a.race)  || this.torso.race;
		this.legs.color = parseInt(a.col)   || this.torso.color;
		this.legs.count = parseInt(a.count) || 2;
	}
}


Body.prototype.NumCocks = function() {
	return this.cock.length;
}
Body.prototype.NumVags = function() {
	return this.vagina.length;
}
Body.prototype.NumBreastRows = function() {
	return this.breasts.length;
}
Body.prototype.Gender = function() {
	var cocks = this.cock.length;
	var vags  = this.vagina.length;
	
	if(cocks > 0 && vags == 0)
		return Gender.male;
	else if(cocks == 0 && vags > 0)
		return Gender.female;
	else if(cocks > 0 && vags > 0)
		return Gender.herm;
	else
		return Gender.none;
}
Body.prototype.GenderStr = function() {
	return Gender.Desc(this.Gender());
}

// TODO: Calculate race
Body.prototype.Race = function() {
	return this.torso.race;
}
Body.prototype.RaceStr = function() {
	return Race.Desc(this.Race());
}


// TODO: Face desc based on head type
Body.prototype.FaceDesc = function() {
	return "face";
}

AppendageType = {
	horn    : 0,
	antenna : 1,
	tail    : 2,
	wing    : 3
}

function Appendage(type, race, color, count) {
	BodyPart.call(this, race, color);
	this.type  = type || AppendageType.horn;
	this.count = count || 1;
}
Appendage.prototype = new BodyPart();
Appendage.prototype.constructor = Appendage;

Appendage.prototype.Short = function() {
	var noun;
	if(this.count > 1) {
		if     (this.type == AppendageType.horn)    noun = "horns";
		else if(this.type == AppendageType.antenna) noun = "antennas";
		else if(this.type == AppendageType.tail)    noun = "tails";
		else if(this.type == AppendageType.wing)    noun = "wings";
	}
	else {
		if     (this.type == AppendageType.horn)    noun = "horn";
		else if(this.type == AppendageType.antenna) noun = "antenna";
		else if(this.type == AppendageType.tail)    noun = "tail";
		else if(this.type == AppendageType.wing)    noun = "wing";
	}
	return noun;
}
// Is the appendage prehensile or not?
Appendage.prototype.Prehensile = function() {
	if(this.type == AppendageType.tail) {
		switch(this.race) {
			case Race.lizard:
			case Race.dragon:
			case Race.demon:
			return true;
			
			default: return false;
		}
	}
	return false;
}
/*
Race = {
	human  : 0,
	horse  : 1,
	cat    : 2,
	dog    : 3,
	fox    : 4,
	lizard : 5,
	rabbit : 6,
	demon  : 7,
	dragon : 8,
	dryad  : 9,
	elf    : 10
	satyr  : 11,
	sheep  : 12,
	goat   : 13,
	cow    : 14,
	wolf   : 15,
	avian  : 16
}
 */
Appendage.prototype.Long = function() {
	var count = Text.Quantify(this.count);
	if     (this.type == AppendageType.horn) {
		switch(this.race) {
			case Race.demon:  return count + " of demonic horns";
			case Race.dragon: return count + " of draconian horns";
			case Race.dryad:  return count + " of antlers";
			case Race.goat:
			case Race.satyr:  return count + " of goat-like horns";
			case Race.sheep:  return count + " of sheep-like horns";
			case Race.cow:    return count + " of bovine horns";
			default: return count + " of strange horns";
		}
	}
	else if(this.type == AppendageType.antenna) {
		switch(this.race) {
			case Race.moth:   return count + " moth-like antenna";
			default: return count + " of strange antenna";
		}
	}
	else if(this.type == AppendageType.tail) {
		switch(this.race) {
			case Race.horse:  return "horse tail";
			case Race.cow:    return "long thin tail, ending in a furred tip";
			case Race.cat:    return "long thin feline tail";
			case Race.dog:    return "fluffy canid tail";
			case Race.wolf:   return "fluffy wolf tail";
			case Race.fox:    return "large fluffy fox tail";
			case Race.lizard: return "long, scaled lizard-like tail";
			case Race.demon:  return "long, thin demonic tail, with a spaded tip";
			case Race.dragon: return "long, scaled draconic tail";
			case Race.ferret: return "long, fluffy ferret tail";
			
			case Race.avian:  return "tail feathers";
			
			case Race.scorpion: return "segmented tail, with a stinger";
			
			case Race.rabbit:
			case Race.dryad:
			case Race.sheep:
			case Race.goat:
			case Race.satyr:  return "small fluffy tail";
			default: return "strange tail";
		}
	}
	else if(this.type == AppendageType.wing) {
		switch(this.race) {
			case Race.avian:  return count + " of bird-like wings";
			case Race.demon:  return count + " of bat-like, demonic wings";
			case Race.dragon: return count + " of large draconic wings";
			case Race.moth:   return count + " of flimsy insectoid wings";
			default: return count + " of strange wings";
		}
	}
	else return "strange growth";
}

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
Vagina.prototype.Fits = function(cock) {
	return cock.length.Get() <= this.capacity.Get();
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

HairStyle = {
	straight : 0,
	wavy     : 1,
	ponytail : 2,
	shaggy   : 3,
	curly    : 4,
	braid    : 5
}

function Hair(color) {
	BodyPart.call(this, null, color);
	this.length = new Stat(5);
	this.style = HairStyle.straight;
}
Hair.prototype = new BodyPart();
Hair.prototype.constructor = Hair;
// TODO: Length and style
Hair.prototype.Bald = function() {
	return this.length.Get() == 0;
}
Hair.prototype.Short = function() {
	if(this.length == 0) return "bald scalp";
	else return Color.Desc(this.color) + " hair";
}
Hair.prototype.Long = function() {
	if(this.length == 0) return "bald scalp";
	else {
		var color = Color.Desc(this.color);
		var style;
		switch(this.style) {
			case HairStyle.straight: style = "straight " + color + " hair"; break;
			case HairStyle.wavy:     style = "wavy " + color + " hair"; break;
			case HairStyle.ponytail: style = color + " hair, which is kept in a ponytail"; break;
			case HairStyle.shaggy:   style = "shaggy " + color + " hair"; break;
			case HairStyle.curly:    style = "curly " + color + " hair"; break;
			case HairStyle.braid:    style = color + " hair, which is kept in a braid"; break;
			default:                 style = "unkempt hair"; break;
		}
		
		var len = this.length.Get();
		
		if     (len < 1)
			return color + " stubble";
		else if(len < 5)
			return "short " + color + " hair";
		else if(len < 10)
			return "short " + style;
		else if(len < 20)
			return "medium length, " + style;
		else if(len < 30)
			return "shoulder-length, " + style;
		else if(len < 50)
			return "long, " + style;
		else if(len < 70)
			return "waist-length, " + style;
		else if(len < 100)
			return "ass-length, " + style;
		else if(len < 140)
			return "knee-length, " + style;
		else
			return "ground-dragging, " + style;
	}
}

function Butt() {
	this.capacity = new Stat(25);
	this.stretch  = new Stat(1);
	this.buttSize = new Stat(1); // TODO: Default
	// This is a special case for anal pregnancy
	// Only appliable for incubation/eggs
	this.womb     = new Womb();
	
	this.virgin   = true;
}
Butt.prototype.Pregnant = function() {
	return this.womb.pregnant;
}
// TODO
Butt.prototype.Fits = function(cock) {
	return cock.length.Get() <= this.capacity.Get();
}
Butt.prototype.noun = function() {
	var size = this.buttSize.Get();
	var nouns = new Array();
	nouns.push("butt");
	nouns.push("rear");
	nouns.push("rump");
	nouns.push("tush");
	nouns.push("posterior");
	nouns.push("flank");
	return nouns[Rand(nouns.length)];
}
Butt.prototype.adj = function() {
	var size = this.buttSize.Get();
	var adjs = [];
	if(size < 2) {
		adjs.push("flat");
		adjs.push("non-existent");
		adjs.push("tight");
		adjs.push("firm");
	}
	if(size >= 2 && size < 5) {
		adjs.push("delicate");
		adjs.push("soft");
		adjs.push("dainty");
	}
	if(size >= 4 && size < 8) {
		adjs.push("ample");
		adjs.push("full");
		adjs.push("shapely");
		adjs.push("plump");
	}
	if(size >= 6 && size < 12) {
		adjs.push("juicy");
		adjs.push("squeezable");
		adjs.push("gropable");
	}
	if(size >= 10) {
		adjs.push("jiggly");
		adjs.push("expansive");
		adjs.push("massive");
		adjs.push("huge");
	}
	if(size >= 15) {
		adjs.push("immense");
		adjs.push("gargantuan");
		adjs.push("humonguous");
		adjs.push("enormous");
		adjs.push("titanic");
	}
	return adjs[Rand(adjs.length)];
}
Butt.prototype.analNoun = function() {
	var noun;
	r = Rand(7);
	if     (r == 0) noun = "pucker";
	else if(r == 1) noun = "anus";
	else if(r == 2) noun = "anal opening";
	else if(r == 3) noun = "asshole";
	else if(r == 4) noun = "colon";
	else if(r == 5) noun = "sphincter";
	else            noun = "ass"; // sligthly higher prio
	return noun;
}
Butt.prototype.AnalDesc = function() {
	var area = this.capacity.Get() * this.stretch.Get();
	if     (area <= 5  ) ret = {a:"an", adj: "extremely tight"};
	else if(area <= 10 ) ret = {a:"a", adj: "very tight"};
	else if(area <= 20 ) ret = {a:"a", adj: "tight"};
	else if(area <= 30 ) ret = {a:"a", adj: "well-proportioned"};
	else if(area <= 40 ) ret = {a:"a", adj: "flexible"};
	else if(area <= 50 ) ret = {a:"a", adj: "very flexible"};
	else if(area <= 70 ) ret = {a:"a", adj: "loose"};
	else if(area <= 100) ret = {a:"a", adj: "slutty"};
	else                    ret = {a:"a", adj: "gaping"};
	return ret;
}
// TODO
Butt.prototype.Short = function() {
	return Text.Parse("[adj] [noun]", {adj: this.adj(), noun: this.noun()});
}
// TODO: a
Butt.prototype.Long = function() {
	return Text.Parse("a [adj] [noun]", {adj: this.adj(), noun: this.noun()});
}
Butt.prototype.AnalShort = function() {
	var desc = this.AnalDesc();
	var v = this.virgin ? " virgin " : " ";
	return desc.adj + v + this.analNoun();
}
Butt.prototype.AnalLong = function() {
	var desc = this.AnalDesc();
	var v = this.virgin ? " virgin " : " ";
	return desc.a + " " + desc.adj + v + this.analNoun();
}


CockType = {
	ordinary : 0,
	clitcock : 1,
	tentacle : 2
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

Cock.prototype.Clone = function() {
	var cock            = new Cock(this.race, this.color);
	cock.thickness.base = this.thickness.base;
	cock.length.base    = this.length.base;
	cock.knot           = this.knot;
	cock.sheath         = this.sheath;
	return cock;
}

Cock.prototype.Size = function() {
	return this.thickness.Get() * this.length.Get();
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


function Balls(race, color) {
	BodyPart.call(this, race, color);
	this.count         = new Stat(0);
	this.size          = new Stat(3);
	this.cumProduction = new Stat(1);
	this.cumCap        = new Stat(10); // Maximum cum
	this.cum           = new Stat(0); // Current accumulated cum
	this.fertility     = new Stat(0.3); // 0..1
}
Balls.prototype = new BodyPart();
Balls.prototype.constructor = Balls;

Balls.prototype.noun = function() {
	var count = this.count.Get();
	var nouns = new Array();
	if(Math.random() < 0.5) {
		nouns.push("ball");
		if(count == 4)
			nouns.push("quad");
	}
	else {
		nouns.push("teste");
		nouns.push("gonad");
		nouns.push("nut");
		nouns.push("testicle");
	}
	var noun = nouns[Rand(nouns.length)];
	if(count > 1) noun += "s";
	return noun;
}

Balls.prototype.adj = function() {
	var size = this.size.Get();
	var adjs = [];
	if(size < 2) {
		adjs.push("small");
		adjs.push("diminitive");
		adjs.push("petite");
		adjs.push("tiny");
	}
	if(size >= 2 && size < 5) {
		adjs.push("well-proportioned");
	}
	if(size >= 4 && size < 8) {
		adjs.push("large");
	}
	if(size >= 8) {
		adjs.push("expansive");
		adjs.push("massive");
		adjs.push("huge");
	}
	if(size >= 16) {
		adjs.push("immense");
		adjs.push("gargantuan");
		adjs.push("humonguous");
		adjs.push("enormous");
		adjs.push("titanic");
	}
	
	if(size >= 4  && size < 5)  adjs.push("baseball-sized");
	if(size >= 5  && size < 7)  adjs.push("apple-sized");
	if(size >= 7  && size < 9)  adjs.push("grapefruit-sized");
	if(size >= 9  && size < 12) adjs.push("cantaloupe-sized");
	if(size >= 12 && size < 15) adjs.push("soccerball-sized");
	if(size >= 15 && size < 18) adjs.push("basketball-sized");
	if(size >= 18 && size < 22) adjs.push("watermelon-sized");
	if(size >= 22 && size < 27) adjs.push("beachball-sized");
	if(size >= 27)              adjs.push("hideously swollen and oversized");
	
	return adjs[Rand(adjs.length)];
}

Balls.prototype.adj2 = function() {
	var adjs = [];
	if(this.cum.Get() / this.cumCap.Get() > 0.8) {
		adjs.push("overflowing ");
		adjs.push("swollen ");
		adjs.push("engorged ");
		adjs.push("cum-engorged ");
	}
	if(this.cum.Get() / this.cumCap.Get() > 0.5) {
		adjs.push("eager ");
		adjs.push("full ");
		adjs.push("needy ");
		adjs.push("desperate ");
		adjs.push("throbbing ");
		adjs.push("heated ");
	}
	else return "";
	
	return adjs[Rand(adjs.length)];
}

Balls.prototype.Short = function() {
	var count = this.count.Get();
	if(count == 0) return "prostate";
	
	var str = "";
	if(Math.random() > 0.5) {
		str += Text.Quantify(count);
		if(count > 1) str += " of ";
		else          str += " ";
	}
	if(Math.random() > 0.5)
		str += this.adj() + " ";
	if(Math.random() > 0.5)
		str += this.adj2();
	str += this.noun();
	
	return str;
}

Balls.prototype.Long = function() {
	var count = this.count.Get();
	if(count == 0) return "prostate";
	
	var str = "";
	str += "a " + Text.Quantify(count);
	if(count > 1) str += " of ";
	else          str += " ";
	str += this.adj() + " ";
	str += this.adj2();
	str += this.noun();
	
	return str;
}

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
	this.aerolaSize      = new Stat(2);
	// Milk
	this.lactationRate   = new Stat();
}
Breasts.prototype = new BodyPart();
Breasts.prototype.constructor = Breasts;
Breasts.prototype.Size = function() {
	return this.size.Get();
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
	else if(size <= 2.5  ) cup = "A-cup";
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
	
	var sizeStr = (MEASUREUNIT == Unit.american) ?
		Unit.CmToInch(size) + " inches" :
		size + " cms";
	
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
	
	var nipLen = (MEASUREUNIT == Unit.american) ?
		Unit.CmToInch(this.nippleLength.Get()) + " inches" :
		this.nippleLength.Get() + " cms";
	var nipThickness = (MEASUREUNIT == Unit.american) ?
		Unit.CmToInch(this.nippleThickness.Get()) + " inches" :
		this.nippleThickness.Get() + " cms";
	
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

// TODO: Lactation
Body.prototype.Lactation = function() {
	if(this.breasts.length == 0)
		return false;
	else
		return this.breasts[0].lactationRate.Get() > 0;
}

// For pregnancies
// TODO: Needs some timers/callbacks
function Womb() {
	// In progress offspring
	this.litterSize = 0;
	this.litterRace = Race.human;
	this.pregnant   = false;
	// TODO: TIMER
	this.progress     = 0;
	this.hoursToBirth = 0;
	this.triggered    = false;
}
Womb.prototype.Short = function() {
	return "womb";
}
Womb.prototype.Desc = function() {
	
}

/*
Race = {
	human  : 0,
	horse  : 1,
	cat    : 2,
	dog    : 3,
	fox    : 4,
	lizard : 5,
	rabbit : 6,
	demon  : 7,
	dragon : 8,
	dryad  : 9,
	elf    : 10,
	satyr  : 11,
	sheep  : 12,
	goat   : 13,
	cow    : 14,
	wolf   : 15,
	avian  : 16
}
*/
Body.prototype.SkinDesc = function() {
	var col = Color.Desc(this.torso.color);
	switch(this.torso.race) {
		case Race.lizard:
		case Race.dragon: return "a body covered with " + col + " scales";
		
		case Race.avian: return col + " feathers";
		
		case Race.cow:
		case Race.horse: return "a thick " + col + "hide";
		
		case Race.ferret:
		case Race.wolf:
		case Race.sheep:
		case Race.goat:
		case Race.cat:
		case Race.dog:
		case Race.fox:
		case Race.rabbit: return col + " fur";
		
		case Race.human:
		case Race.elf:
		case Race.demon:
		case Race.dryad:
		default: return col + " skin";
	}
}

Body.prototype.HasFur = function() {
	switch(this.torso.race) {
		case Race.wolf:
		case Race.sheep:
		case Race.goat:
		case Race.cat:
		case Race.dog:
		case Race.fox:
		case Race.rabbit:
		case Race.ferret:
			return true;
		default:
			return false;
	}
}
Body.prototype.HasScales = function() {
	switch(this.torso.race) {
		case Race.lizard:
		case Race.dragon:
			return true;
		default:
			return false;
	}
}
Body.prototype.HasSkin = function() {
	switch(this.torso.race) {
		case Race.human:
		case Race.elf:
		case Race.demon:
		case Race.dryad:
			return true;
		default:
			return false;
	}
}

// TODO
Body.prototype.FaceDesc = function() {
	switch(this.head.race) {
		case Race.human:  return "human face";
		case Race.horse:  return "horse-like face";
		case Race.cat:    return "feline face";
		case Race.ferret: return "pointed, ferret-like face";
		case Race.rabbit: return "narrow, rabbit-like face";
		case Race.fox:
		case Race.wolf:
		case Race.dog:    return "canid face";
		case Race.lizard: return "lizard-like face";
			
		case Race.elf:    return "elven face";
		default:          return "face";
	}
}
Body.prototype.FaceDescLong = function() {
	switch(this.head.race) {
		case Race.human:  return "a human face with smooth skin";
		case Race.horse:  return "a long, flat, horse-like face";
		case Race.cat:    return "a triangular face with feline properties";
		case Race.ferret: return "a pointed, ferret-like face";
		case Race.rabbit: return "a narrow, rabbit-like face";
		case Race.fox:
		case Race.wolf:
		case Race.dog:    return "a canid face";
			
		case Race.elf:    return "an elven face, the delicate features showing an ageless grace";
		default:          return "a face";
	}
}
Body.prototype.EyeDesc = function() {
	var eyes = this.head.eyes;
	switch(eyes.race) {
		case Race.lizard:
		case Race.dragon: return "reptilian eye";
		
		case Race.demon: return "demonic eye";
		
		case Race.ferret:
		case Race.cat:
		case Race.fox:
		case Race.wolf:
		case Race.dog: return "feral eye";
			
		case Race.human:
		case Race.horse:
		case Race.rabbit:
		case Race.elf:
		case Race.dryad:
		default: return "eye";
	}
}

Body.prototype.EarDesc = function() {
	var ears = this.head.ears;
	switch(ears.race) {
		case Race.lizard:
		case Race.dragon: return "pointed, scaled ears";
		
		case Race.elf:
		case Race.dryad:
		case Race.demon: return "pointed elfin ears";
		
		case Race.horse: return "long equine ears";
		
		case Race.ferret: return "furred ferret ears";
		case Race.cat: return "fuzzy feline ears";
		case Race.fox: return "fuzzy vulpine ears";
		case Race.wolf:
		case Race.dog: return "furred canine ears";
			
		case Race.rabbit: return "floppy rabbit ears";
		
		case Race.human: 
		default: return "ears";
	}
}

Body.prototype.HasFlexibleEars = function() {
	var ears = this.head.ears;
	switch(ears.race) {
		case Race.horse:
		case Race.cat:
		case Race.dog:
		case Race.fox:
		case Race.rabbit:
		case Race.sheep:
		case Race.goat:
		case Race.cow:
		case Race.wolf:
		case Race.ferret:
			return true;
		default: return false;
	}
}

/*
Race = {
	human  : 0,
	horse  : 1,
	cat    : 2,
	dog    : 3,
	fox    : 4,
	lizard : 5,
	rabbit : 6,
	demon  : 7,
	dragon : 8,
	dryad  : 9,
	elf    : 10,
	satyr  : 11,
	sheep  : 12,
	goat   : 13,
	cow    : 14,
	wolf   : 15,
	avian  : 16
}
 */
Body.prototype.HasLongSnout = function() {
	switch(this.head.race) {
		case Race.horse:
		case Race.dragon:
		case Race.cow:
		case Race.lizard:
		return true;
		
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.elf:
		case Race.dryad:
		case Race.demon:
		case Race.rabbit:
		case Race.fox:
		case Race.dog:
		case Race.wolf:
		case Race.cat:
		case Race.human:
		case Race.avian:
		case Race.ferret:
		default:
		return false;
	}
}

Body.prototype.SoftFeet = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) return false;
	
	switch(legs.race) {
		case Race.cow:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.horse: return false;
		
		case Race.avian:
		case Race.dragon:
		case Race.lizard:
		case Race.demon:
		
		case Race.ferret:
		case Race.rabbit:
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cat:
		
		case Race.elf:
		case Race.human:
		default: return true;
	}
}

Body.prototype.FeetDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) return "body";
	
	switch(legs.race) {
		case Race.cow:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.horse: return "hoofs";
		
		case Race.avian:
		case Race.dragon:
		case Race.lizard:
		case Race.demon: return "clawed feet";
		
		case Race.ferret:
		case Race.rabbit:
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cat: return "paws";
		
		case Race.elf:
		case Race.human:
		default: return "feet";
	}
}
Body.prototype.FootDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) return "body";
	
	switch(legs.race) {
		case Race.cow:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.horse: return "hoof";
		
		case Race.avian:
		case Race.dragon:
		case Race.lizard:
		case Race.demon: return "clawed foot";
		
		case Race.ferret:
		case Race.rabbit:
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cat: return "paw";
		
		case Race.elf:
		case Race.human:
		default: return "foot";
	}
}

// TODO
Body.prototype.LegDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) return "body";
	
	switch(legs.race) {
		case Race.cow:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.horse:
		
		case Race.dragon:
		case Race.lizard:
		case Race.demon:
		
		case Race.ferret:
		case Race.rabbit:
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cat:
		
		case Race.elf:
		case Race.human:
		default: return "leg";
	}
}
// TODO
Body.prototype.LegsDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) return "body";
	
	switch(legs.race) {
		case Race.cow:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.horse:
		
		case Race.dragon:
		case Race.lizard:
		case Race.demon:
		
		case Race.ferret:
		case Race.rabbit:
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cat:
		
		case Race.elf:
		case Race.human:
		
		default: return "legs";
	}
}
// TODO
Body.prototype.ThighDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) return "body";
	
	switch(legs.race) {
		case Race.cow:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.horse:
		
		case Race.dragon:
		case Race.lizard:
		case Race.demon:
		
		case Race.ferret:
		case Race.rabbit:
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cat:
		
		case Race.elf:
		case Race.human:
		default: return "thigh";
	}
}
// TODO
Body.prototype.ThighsDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) return "body";
	
	switch(legs.race) {
		case Race.cow:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.horse:
		
		case Race.dragon:
		case Race.lizard:
		case Race.demon:
		
		case Race.ferret:
		case Race.rabbit:
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cat:
		
		case Race.elf:
		case Race.human:
		
		default: return "thighs";
	}
}
// TODO
Body.prototype.ArmDesc = function() {
	var arm = this.arms;
	if(!arm) return "body";
	
	switch(arm.race) {
		case Race.cow:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.horse:
		
		case Race.dragon:
		case Race.lizard:
		case Race.demon:
		
		case Race.ferret:
		case Race.rabbit:
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cat:
		
		case Race.elf:
		case Race.human:
		default: return "arm";
	}
}

// TODO
Body.prototype.HandDesc = function() {
	var arm = this.arms;
	if(!arm) return "body";
	
	switch(arm.race) {
		case Race.ferret:
		case Race.rabbit:
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cat: return "paw";
		
		case Race.cow:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.horse:
		
		case Race.dragon:
		case Race.lizard:
		case Race.demon:
		
		case Race.elf:
		case Race.human:
		default: return "hand";
	}
}

// TODO: Color, length
Body.prototype.TongueDesc = function() {
	var tongue = this.head.mouth.tongue;
	switch(tongue.race) {
		case Race.cow:
		case Race.horse: return "broad tongue";
		
		case Race.dragon:
		case Race.lizard:
		case Race.demon: return "forked tongue";
		
		case Race.fox:
		case Race.wolf:
		case Race.dog: return "animalistic tongue";
		
		case Race.cat: return "barbed tongue";
		
		case Race.ferret:
		case Race.rabbit:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.elf:
		case Race.human:
		default: return "tongue";
	}
}

// TODO
Body.prototype.HipsDesc = function(plural) {
	var size = this.torso.hipSize.Get();
	
	var adjs = [];
	if(size < 2) {
		adjs.push("bony");
		adjs.push("thin");
		adjs.push("slender");
		adjs.push("boyish");
		if(this.muscleTone.Get() > 0.2)
			adjs.push("tight");
	}
	if(size >= 2 && size < 5) {
		adjs.push("well-proportioned");
		if(this.femininity.Get() < 0)
			adjs.push("girly");
		adjs.push("unnoticable");
	}
	if(size >= 5 && size < 10) {
		adjs.push("noticable");
		adjs.push("pleasant");
		adjs.push("waspish");
		adjs.push("flared");
	}
	if(size >= 8 && size < 17) {
		if(this.femininity.Get() < 0) {
			adjs.push("womanly");
			adjs.push("vulptous");
		}
		adjs.push("wide");
		adjs.push("thick");
	}
	if(size >= 15) {
		adjs.push("absurdly wide");
		adjs.push("cow-like");
		if(this.femininity.Get() < 0)
			adjs.push("broodmother");
	}
	var adj = adjs[Rand(adjs.length)];
	
	return adj + (plural ? " hips" : "hip");
}


// TODO: Preggo belly (use bellysize)
Body.prototype.StomachDesc = function(bellysize) {
	var nouns = [];
	nouns.push("belly");
	nouns.push("stomach");
	nouns.push("tummy");
	if(this.muscleTone.Get() > 0.5)
		nouns.push("abs");
	var noun = nouns[Rand(nouns.length)];
	return noun;
}

