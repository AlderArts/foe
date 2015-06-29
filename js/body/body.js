/*
 * Body
 */

function BodyPart(race, color) {
	this.race  = race || Race.Human;
	this.color = color || Color.white;
}

BodyPart.HasFur = function(race) {
	return race.isRace(
		Race.Canine,
		Race.Feline,
		Race.Goat,
		Race.Sheep,
		Race.Musteline,
		Race.Rabbit);
}
BodyPart.HasScales = function(race) {
	return race.isRace(Race.Reptile);
}
BodyPart.HasSkin = function(race) {
	return race.isRace(
		Race.Human,
		Race.Elf,
		Race.Demon,
		Race.Dryad);
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
		race : this.head.race.id.toFixed(),
		col  : this.head.color.toFixed()
	};
	storage.head.mouth = {
		cap  : this.head.mouth.capacity.base.toFixed(2),
		ton  : {race : this.head.mouth.tongue.race.id.toFixed(), col : this.head.mouth.tongue.color.toFixed()},
		tonL : this.head.mouth.tongueLength.base.toFixed(2)
	};
	storage.head.hair = {
		race  : this.head.hair.race.id.toFixed(),
		col   : this.head.hair.color.toFixed(),
		len   : this.head.hair.length.base.toFixed(2),
		style : this.head.hair.style.toFixed()
	};
	storage.head.eyes = {
		race  : this.head.eyes.race.id.toFixed(),
		col   : this.head.eyes.color.toFixed(),
		count : this.head.eyes.count.base.toFixed()
	};
	storage.head.ears = {
		race : this.head.ears.race.id.toFixed(),
		col  : this.head.ears.color.toFixed()
	};
	if(this.head.appendages.length > 0) {
		storage.head.app = new Array();
		for(var i = 0; i < this.head.appendages.length; i++) {
			storage.head.app.push(this.head.appendages[i].ToStorage());
		}
	}
	storage.torso = {
		race : this.torso.race.id.toFixed(),
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
		race  : this.arms.race.id.toFixed(),
		col   : this.arms.color.toFixed(),
		count : this.arms.count.toFixed()
	};
	
	storage.legs = {
		race  : this.legs.race.id.toFixed(),
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
		this.head.race   = RaceDesc.IdToRace[parseInt(storage.head.race)] || this.head.race;
		this.head.color  = parseInt(storage.head.col)  || this.head.color;
		
		if(storage.head.mouth) {
			this.head.mouth.tongue.race       = RaceDesc.IdToRace[parseInt(storage.head.mouth.ton.race)] || this.head.mouth.tongue.race;
			this.head.mouth.tongue.color      = parseInt(storage.head.mouth.ton.col)  || this.head.mouth.tongue.color;
			this.head.mouth.capacity.base     = parseFloat(storage.head.mouth.cap)    || this.head.mouth.capacity.base;
			this.head.mouth.tongueLength.base = parseFloat(storage.head.mouth.tonL)   || this.head.mouth.tongueLength.base;
		}
		if(storage.head.hair) {
			this.head.hair.race        = RaceDesc.IdToRace[parseInt(storage.head.hair.race)]  || this.head.hair.race;
			this.head.hair.color       = parseInt(storage.head.hair.col)   || this.head.hair.color;
			this.head.hair.length.base = parseInt(storage.head.hair.len)   || this.head.hair.length.base;
			this.head.hair.style       = parseInt(storage.head.hair.style) || this.head.hair.style;
		}
		if(storage.head.eyes) {
			this.head.eyes.race        = RaceDesc.IdToRace[parseInt(storage.head.eyes.race)]  || this.head.eyes.race;
			this.head.eyes.color       = parseInt(storage.head.eyes.col)   || this.head.eyes.color;
			this.head.eyes.count.base  = parseInt(storage.head.eyes.count) || this.head.eyes.count.base;
		}
		if(storage.head.ears) {
			this.head.ears.race        = RaceDesc.IdToRace[parseInt(storage.head.ears.race)]  || this.head.ears.race;
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
		this.torso.race         = RaceDesc.IdToRace[parseInt(storage.torso.race)] || this.torso.race;
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
		this.arms.race  = RaceDesc.IdToRace[parseInt(a.race)]  || this.torso.race;
		this.arms.color = parseInt(a.col)   || this.torso.color;
		this.arms.count = parseInt(a.count) || 2;
	}
	
	if(storage.legs) {
		this.legs = new BodyPart();
		var a = storage.legs;
		this.legs.race  = RaceDesc.IdToRace[parseInt(a.race)]  || this.torso.race;
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
	return this.Race().Short();
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
	return this.race.isRace(Race.Avian);
}

Body.prototype.SkinDesc = function(part) {
	var col = Color.Desc(this.torso.color);
	part = part ? part.race : this.torso.race;
	
	if(part.isRace(Race.Reptile)) return col + " scales";
	if(part.isRace(Race.Avian)) return col + " feathers";
	if(part.isRace(Race.Cow, Race.Horse)) return col + " hide";
	if(part.isRace(Race.Canine, Race.Feline, Race.Goat, Race.Sheep, Race.Musteline, Race.Rabbit)) return col + " fur";
	if(part.isRace(Race.Goo)) return col + " slime";
	return col + " skin";
}

Body.prototype.HasFur = function(race) {
	return BodyPart.HasFur(this.torso.race);
}
Body.prototype.HasScales = function(race) {
	return BodyPart.HasScales(this.torso.race);
}
Body.prototype.HasSkin = function(race) {
	return BodyPart.HasSkin(this.torso.race);
}

// TODO
Body.prototype.FaceDesc = function() {
	var desc = this.head.race.qShort();
	if(this.head.race.isRace(Race.Human)) return "face";
	else return desc + " face";
}
Body.prototype.FaceDescLong = function() {
	return this.head.race.aqShort() + " face";
}
Body.prototype.EyeDesc = function() {
	var eyes = this.head.eyes.race;
	return eyes.qShort() + " eye";
}

Body.prototype.EarDesc = function() {
	var ears = this.head.ears.race;
	if(ears.isRace(Race.Reptile)) return "pointed, scaled ears";
	if(ears.isRace(Race.Elf, Race.Dryad, Race.Demon)) return "pointed elfin ears";
	if(ears.isRace(Race.Rabbit)) return "floppy rabbit ears";
	if(ears.isRace(Race.Human)) return "ears";
	return ears.qShort() + " ears";
}

Body.prototype.HasFlexibleEars = function() {
	var ears = this.head.ears.race;
	return ears.isRace(
		Race.Horse,
		Race.Feline,
		Race.Canine,
		Race.Rabbit,
		Race.Sheep,
		Race.Cow,
		Race.Goat,
		Race.Musteline
	);
}

Body.prototype.HasMuzzle = function() {
	return this.head.race.isRace(
		Race.Horse,
		Race.Reptile,
		Race.Cow,
		Race.Goat,
		Race.Sheep,
		Race.Musteline,
		Race.Canine,
		Race.Feline,
		Race.Rabbit
	);
}

Body.prototype.HasLongSnout = function() {
	return this.head.race.isRace(
		Race.Horse,
		Race.Reptile,
		Race.Cow,
		Race.Goat,
		Race.Sheep
	);
}

Body.prototype.HasNightvision = function() {
	return this.head.eyes.race.isRace(
		Race.Dragon,
		Race.Demon,
		Race.Wolf,
		Race.Fox,
		Race.Feline
	);
}

Body.prototype.SoftFeet = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) return false;
	
	return !legs.race.isRace(
		Race.Cow,
		Race.Goat,
		Race.Sheep,
		Race.Dryad,
		Race.Horse
	);
}

Body.prototype.FeetDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) {
		if(legs.race.isRace(Race.Snake))
			return "tail";
		else
			return "lower body";
	}
	
	if(legs.race.isRace(Race.Cow, Race.Goat, Race.Sheep, Race.Dryad, Race.Horse)) return "hoofs";
	if(legs.race.isRace(Race.Gryphon)) return "taloned feet";
	if(legs.race.isRace(Race.Avian, Race.Reptile, Race.Demon)) return "clawed feet";
	if(legs.race.isRace(Race.Musteline, Race.Rabbit, Race.Canine, Race.Feline)) return "paws";
	
	return "feet";
}
Body.prototype.FootDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) {
		if(legs.race.isRace(Race.Snake))
			return "tail";
		else
			return "lower body";
	}
	
	if(legs.race.isRace(Race.Cow, Race.Goat, Race.Sheep, Race.Dryad, Race.Horse)) return "hoof";
	if(legs.race.isRace(Race.Avian, Race.Reptile, Race.Demon)) return "clawed foot";
	if(legs.race.isRace(Race.Musteline, Race.Rabbit, Race.Canine, Race.Feline)) return "paw";
		
	return "foot";
}

// TODO
Body.prototype.LegDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) {
		if(legs.race.isRace(Race.Snake))
			return "tail";
		else
			return "lower body";
	}
	
	return "leg";
}
// TODO
Body.prototype.LegsDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) {
		if(legs.race.isRace(Race.Snake))
			return "tail";
		else
			return "lower body";
	}
	
	return "legs";
}
// TODO
Body.prototype.ThighDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) return "body";
	
	return "thigh";
}
// TODO
Body.prototype.ThighsDesc = function() {
	var legs = this.legs;
	if(!legs || legs.count == 0) return "body";
	
	return "thighs";
}
// TODO
Body.prototype.KneesDesc = function(plural) {
	var legs = this.legs;
	if(!legs) return "body";
	if(legs.count == 0) {
		if(legs.race.isRace(Race.Reptile))
			return "snake-like tail";
		return "body";
	}
	
	var adj = "";
	if(BodyPart.HasScales(legs.race)) adj += "scaled ";
	else if(BodyPart.HasFur(legs.race)) adj += "furred ";
	
	return adj + plural ? "knees" : "knee";
}
// TODO
Body.prototype.ArmDesc = function() {
	var arm = this.arms;
	if(!arm) return "body";
	
	return "arm";
}

// TODO
Body.prototype.HandDesc = function() {
	var arm = this.arms;
	if(!arm) return "body";
	
	if(arm.race.isRace(
		Race.Musteline,
		Race.Rabbit,
		Race.Feline,
		Race.Canine)) return "paw";
	else return "hand";
}

//TODO
Body.prototype.LipsDesc = function() {
	return "lips";
}

// TODO: Color, length
Body.prototype.TongueDesc = function() {
	var tongue = this.head.mouth.tongue;
	if(tongue.race.isRace(Race.Cow, Race.Horse)) return "broad tongue";
	if(tongue.race.isRace(Race.Reptile, Race.Demon)) return "forked tongue";
	if(tongue.race.isRace(Race.Canine)) return "animalistic tongue";
	if(tongue.race.isRace(Race.Feline)) return "barbed tongue";
	return "tongue";
}

// TODO: Color, length
Body.prototype.TongueTipDesc = function() {
	var tongue = this.head.mouth.tongue;
	if(tongue.race.isRace(Race.Canine, Race.Cow, Race.Horse)) return "broad tip";
	if(tongue.race.isRace(Race.Demon, Race.Reptile)) return "forked tip";
	if(tongue.race.isRace(Race.Feline)) return "barbed tip";
	return "tip";
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

