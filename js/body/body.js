
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
Gender.Noun = function(gender) {
	var r;
	switch(gender) {
	case Gender.male: return "man";
	case Gender.female: return "woman";
	case Gender.herm: r = Rand(2);
		if(r == 0) return "herm";
		else return "herm";
	default: return "neuter";
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
	snake    : 21,
	goo      : 22,
	insect   : 23,
	
	// TODO: Keep updated!
	numRaces : 24
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
	case Race.rabbit: r = Rand(3);
		if     (r == 0) return "rabbit";
		else if(r == 1) return "lapine";
		else            return "lagomorph";
	case Race.demon: return "demon";
	case Race.dragon: return "dragon";
	case Race.dryad: r = Rand(2);
		if(r == 0) return "dryad";
		else       return "fawn";
	case Race.satyr: r = Rand(2);
		if(r == 0) return "satyr";
		else       return "faun";
	case Race.elf: return "elf";
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
	case Race.snake: r = Rand(2);
		if(r == 0) return "snake";
		else       return "naga";
	case Race.goo: return "goo";
	case Race.insect: return "insect";
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
	case Race.rabbit: r = Rand(3);
		if     (r == 0) return "a rabbit";
		else if(r == 1) return "a lapine";
		else            return "a lagomorph";
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
	case Race.snake: r = Rand(2);
		if(r == 0) return "a snake-like";
		else       return "a serpentine";
	case Race.goo: return "a gelatinous";
	case Race.insect: return "an insectoid";
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
	this.entity = ent;
	var debugName = function() { return ent.name + ".body"; };
	// Body stats
	this.muscleTone = new Stat(0);
	this.muscleTone.debug = function() { return debugName() + ".muscleTone"; }
	this.bodyMass   = new Stat(0);
	this.bodyMass.debug = function() { return debugName() + ".bodyMass"; }
	this.height     = new Stat(175); // cm
	this.height.debug = function() { return debugName() + ".height"; }
	// TODO: fix?
	this.weigth     = new Stat(65); // kg
	this.weigth.debug = function() { return debugName() + ".weigth"; }
	
	this.femininity = new Stat(0);
	this.femininity.debug = function() { return debugName() + ".femininity"; }
	
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
	this.torso.hipSize.debug = function() { return debugName() + ".hipSize"; }
	// Add slots for wings, tails and such
	this.backSlots     = new Array();
	
	// Genetalia
	this.cock = new Array();
	this.balls = new Balls();
	
	this.vagina = new Array();
	this.ass = new Butt();
	
	this.breasts = new Array();
	this.breasts.push(new Breasts());
	
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
		tone   : this.muscleTone.base.toFixed(2),
		mass   : this.bodyMass.base.toFixed(2),
		height : this.height.base.toFixed(2),
		weigth : this.weigth.base.toFixed(2),
		fem    : this.femininity.base.toFixed(2)
	};
	
	storage.head = {
		race : this.head.race.toFixed(),
		col  : this.head.color.toFixed()
	};
	storage.head.mouth = {
		cap  : this.head.mouth.capacity.base.toFixed(2),
		ton  : {race : this.head.mouth.tongue.race.toFixed(), col : this.head.mouth.tongue.color.toFixed()},
		tonL : this.head.mouth.tongueLength.base.toFixed(2)
	};
	storage.head.hair = {
		race  : this.head.hair.race.toFixed(),
		col   : this.head.hair.color.toFixed(),
		len   : this.head.hair.length.base.toFixed(2),
		style : this.head.hair.style.toFixed()
	};
	storage.head.eyes = {
		race  : this.head.eyes.race.toFixed(),
		col   : this.head.eyes.color.toFixed(),
		count : this.head.eyes.count.base.toFixed()
	};
	storage.head.ears = {
		race : this.head.ears.race.toFixed(),
		col  : this.head.ears.color.toFixed()
	};
	if(this.head.appendages.length > 0) {
		storage.head.app = new Array();
		for(var i = 0; i < this.head.appendages.length; i++) {
			storage.head.app.push(this.head.appendages[i].ToStorage());
		}
	}
	storage.torso = {
		race : this.torso.race.toFixed(),
		col  : this.torso.color.toFixed(),
		hip  : this.torso.hipSize.base.toFixed(2)
	};
	if(this.backSlots.length > 0) {
		storage.back = new Array();
		for(var i = 0; i < this.backSlots.length; i++) {
			storage.back.push(this.backSlots[i].ToStorage());
		}
	}
	// Genetalia
	if(this.cock.length > 0) {
		storage.cock = new Array();
		for(var i = 0; i < this.cock.length; i++) {
			var a = this.cock[i];
			var c = a.ToStorage(true);
			if(a.vag)
				c.ccIdx = this.vagina.indexOf(a.vag);
			storage.cock.push(c);
		}
	}
	storage.balls = this.balls.ToStorage(true);
	
	if(this.vagina.length > 0) {
		storage.vag = new Array();
		for(var i = 0; i < this.vagina.length; i++) {
			storage.vag.push(this.vagina[i].ToStorage(true));
		}
	}
	
	storage.ass = this.ass.ToStorage(true);
	
	if(this.breasts.length > 0) {
		storage.breasts = new Array();
		for(var i = 0; i < this.breasts.length; i++) {
			storage.breasts.push(this.breasts[i].ToStorage(true));
		}
	}
	
	// Arms and legs
	storage.arms = {
		race  : this.arms.race.toFixed(),
		col   : this.arms.color.toFixed(),
		count : this.arms.count.toFixed()
	};
	
	storage.legs = {
		race  : this.legs.race.toFixed(),
		col   : this.legs.color.toFixed(),
		count : this.legs.count.toFixed()
	};

	return storage;
}

Body.prototype.ToStoragePartial = function(opts) {
	var storage = {};
	if(opts.cock && this.cock.length > 0) {
		var cock = [];
		for(var i = 0; i < this.cock.length; ++i) {
			cock.push(this.cock[i].ToStorage(opts.full));
		}
		storage.cock = cock;
	}
	if(opts.balls) {
		storage.balls = this.balls.ToStorage(opts.full);
	}
	if(opts.vag && this.vagina.length > 0) {
		var vag = [];
		for(var i = 0; i < this.vagina.length; ++i) {
			vag.push(this.vagina[i].ToStorage(opts.full));
		}
		storage.vag = vag;
	}
	if(opts.ass) {
		storage.ass = this.ass.ToStorage(opts.full);
	}
	if(opts.breasts && this.breasts.length > 0) {
		var breasts = [];
		for(var i = 0; i < this.breasts.length; ++i) {
			breasts.push(this.breasts[i].ToStorage(opts.full));
		}
		storage.breasts = breasts;
	}
	return storage;
}

Body.prototype.FromStorage = function(storage) {
	storage = storage || {};
	
	this.muscleTone.base = parseFloat(storage.tone)   || this.muscleTone.base;
	this.bodyMass.base   = parseFloat(storage.mass)   || this.bodyMass.base;
	this.height.base     = parseFloat(storage.height) || this.height.base;
	this.weigth.base     = parseFloat(storage.weigth) || this.weigth.base;
	this.femininity.base = parseFloat(storage.fem)    || this.femininity.base;
	
	if(storage.head) {
		this.head.race   = parseInt(storage.head.race) || this.head.race;
		this.head.color  = parseInt(storage.head.col)  || this.head.color;
		
		if(storage.head.mouth) {
			this.head.mouth.tongue.race       = parseInt(storage.head.mouth.ton.race) || this.head.mouth.tongue.race;
			this.head.mouth.tongue.color      = parseInt(storage.head.mouth.ton.col)  || this.head.mouth.tongue.color;
			this.head.mouth.capacity.base     = parseFloat(storage.head.mouth.cap)    || this.head.mouth.capacity.base;
			this.head.mouth.tongueLength.base = parseFloat(storage.head.mouth.tonL)   || this.head.mouth.tongueLength.base;
		}
		if(storage.head.hair) {
			this.head.hair.race        = parseInt(storage.head.hair.race)  || this.head.hair.race;
			this.head.hair.color       = parseInt(storage.head.hair.col)   || this.head.hair.color;
			this.head.hair.length.base = parseInt(storage.head.hair.len)   || this.head.hair.length.base;
			this.head.hair.style       = parseInt(storage.head.hair.style) || this.head.hair.style;
		}
		if(storage.head.eyes) {
			this.head.eyes.race        = parseInt(storage.head.eyes.race)  || this.head.eyes.race;
			this.head.eyes.color       = parseInt(storage.head.eyes.col)   || this.head.eyes.color;
			this.head.eyes.count.base  = parseInt(storage.head.eyes.count) || this.head.eyes.count.base;
		}
		if(storage.head.ears) {
			this.head.ears.race        = parseInt(storage.head.ears.race)  || this.head.ears.race;
			this.head.ears.color       = parseInt(storage.head.ears.col)   || this.head.ears.color;
		}
		
		if(storage.head.app) {
			this.head.appendages = new Array();
			for(var i = 0; i < storage.head.app.length; i++) {
				var newApp = new Appendage();
				newApp.FromStorage(storage.head.app[i]);
				this.head.appendages.push(newApp);
			}
		}
	}
	
	if(storage.torso) {
		this.torso.race         = parseInt(storage.torso.race) || this.torso.race;
		this.torso.color        = parseInt(storage.torso.col)  || this.torso.color;
		this.torso.hipSize.base = parseFloat(storage.torso.hip)  || this.torso.hipSize.base;
	}
	
	if(storage.back) {
		this.backSlots = new Array();
		for(var i = 0; i < storage.back.length; i++) {
			var newApp = new Appendage();
			newApp.FromStorage(storage.back[i]);
			this.backSlots.push(newApp);
		}
	}
	
	if(storage.cock) {
		this.cock = new Array();
		for(var i = 0; i < storage.cock.length; i++) {
			var c = new Cock();
			c.FromStorage(storage.cock[i]);
			this.cock.push(c);
		}
	}
	
	this.balls.FromStorage(storage.balls);
	
	if(storage.vag) {
		this.vagina = new Array();
		for(var i = 0; i < storage.vag.length; i++) {
			var v = new Vagina();
			v.FromStorage(storage.vag[i]);
			this.vagina.push(v);
		}
	}
	
	// Restore clitcocks
	if(storage.cock) {
		for(var i = 0; i < storage.cock.length; i++) {
			var a     = storage.cock[i];
			var ccIdx = parseInt(a.ccIdx);
			
			if(ccIdx >= 0 && ccIdx < this.vagina.length) {
				var v      = this.vagina[ccIdx];
				v.clitCock = this.cock[i];
				this.cock[i].vag = v;
			}
		}
	}

	this.ass.FromStorage(storage.ass);
	
	if(storage.breasts) {
		this.breasts = new Array();
		for(var i = 0; i < storage.breasts.length; i++) {
			var b = new Breasts();
			b.FromStorage(storage.breasts[i]);
			this.breasts.push(b);
		}
	}
	if(storage.arms) {
		this.arms = new BodyPart();
		var a = storage.arms;
		this.arms.race  = parseInt(a.race)  || this.torso.race;
		this.arms.color = parseInt(a.col)   || this.torso.color;
		this.arms.count = parseInt(a.count) || 2;
	}
	
	if(storage.legs) {
		this.legs = new BodyPart();
		var a = storage.legs;
		this.legs.race  = parseInt(a.race)  || this.torso.race;
		this.legs.color = parseInt(a.col)   || this.torso.color;
		this.legs.count = parseInt(a.count) || 2;
	}
}

Body.prototype.HandleStretchOverTime = function(hours) {
	for(var i = 0; i < this.vagina.length; i++)
		this.vagina[i].HandleStretchOverTime(hours);
	this.ass.HandleStretchOverTime(hours);
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


BodyPart.prototype.Feathered = function() {
	var race = this.race;
	switch(race) {
		case Race.avian: return true;
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
Body.prototype.SkinDesc = function(part) {
	var col = Color.Desc(this.torso.color);
	part = part || this.torso.race;
	switch(part) {
		case Race.lizard:
		case Race.snake:
		case Race.dragon: return col + " scales";
		
		case Race.avian: return col + " feathers";
		
		case Race.cow:
		case Race.horse: return col + " hide";
		
		case Race.ferret:
		case Race.wolf:
		case Race.sheep:
		case Race.goat:
		case Race.cat:
		case Race.dog:
		case Race.fox:
		case Race.rabbit: return col + " fur";
		
		case Race.goo: return col + " slime";
		
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
		case Race.snake:
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
		case Race.human:  return "face";
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
		case Race.snake:
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
		case Race.snake:
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
		
		case Race.snake:
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

Body.prototype.HasNightvision = function() {
	switch(this.head.eyes.race) {
		case Race.dragon:
		case Race.demon:
		case Race.wolf:
		case Race.fox:
		case Race.cat:
		return true;
		
		case Race.horse:
		case Race.cow:
		case Race.lizard:
		case Race.snake:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.elf:
		case Race.dryad:
		case Race.rabbit:
		case Race.dog:
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
	if(!legs || legs.count == 0) return "lower body";
	
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
	if(!legs || legs.count == 0) return "lower body";
	
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
	if(!legs || legs.count == 0) return "lower body";
	
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
	if(!legs || legs.count == 0) return "lower body";
	
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
Body.prototype.KneesDesc = function(plural) {
	var legs = this.legs;
	if(!legs) return "body";
	if(legs.count == 0) {
		if(legs.race == Race.snake)
			return "snake-like tail";
		return "body";
	}
	
	var adj = "";
	switch(legs.race) {
		case Race.dragon:
		case Race.lizard:
			adj += "scaled "; break;
		
		case Race.cow:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.horse:
		case Race.ferret:
		case Race.rabbit:
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cat:
			adj += "furred "; break;
		
		case Race.elf:
		case Race.human:
		case Race.demon:
		case Race.dryad:
		
		default:
	}
	
	return adj + plural ? "knees" : "knee";
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

//TODO
Body.prototype.LipsDesc = function() {
	return "lips";
}

// TODO: Color, length
Body.prototype.TongueDesc = function() {
	var tongue = this.head.mouth.tongue;
	switch(tongue.race) {
		case Race.cow:
		case Race.horse: return "broad tongue";
		
		case Race.dragon:
		case Race.snake:
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

// TODO: Color, length
Body.prototype.TongueTipDesc = function() {
	var tongue = this.head.mouth.tongue;
	switch(tongue.race) {
		case Race.fox:
		case Race.wolf:
		case Race.dog:
		case Race.cow:
		case Race.horse: return "broad tip";
		
		case Race.dragon:
		case Race.snake:
		case Race.lizard:
		case Race.demon: return "forked tip";
		
		case Race.cat: return "barbed tip";
		
		case Race.ferret:
		case Race.rabbit:
		case Race.goat:
		case Race.sheep:
		case Race.satyr:
		case Race.dryad:
		case Race.elf:
		case Race.human:
		default: return "tip";
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
		if(this.femininity.Get() > 0)
			adjs.push("girly");
		adjs.push("unnoticable");
	}
	if(size >= 5 && size < 10) {
		adjs.push("noticeable");
		adjs.push("pleasant");
		adjs.push("waspish");
		adjs.push("flared");
	}
	if(size >= 8 && size < 17) {
		if(this.femininity.Get() > 0) {
			adjs.push("womanly");
			adjs.push("voluptuous");
		}
		adjs.push("wide");
		adjs.push("thick");
	}
	if(size >= 15) {
		adjs.push("absurdly wide");
		adjs.push("cow-like");
		if(this.femininity.Get() > 0)
			adjs.push("broodmother");
	}
	var adj = adjs[Rand(adjs.length)];
	
	return adj + (plural ? " hips" : " hip");
}

// TODO: Preggo belly (use bellysize)
Body.prototype.StomachDesc = function(bellysize) {
	var nouns = [];
	
	var size = 0;
	if(this.entity) {
		size = this.entity.PregHandler().BellySize();
	}
	
	//TODO use belly size
	
	nouns.push("belly");
	nouns.push("stomach");
	nouns.push("tummy");
	if(this.muscleTone.Get() > 0.5)
		nouns.push("abs");
	var noun = nouns[Rand(nouns.length)];
	return noun;
}

