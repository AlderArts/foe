
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

Appendage.prototype.ToStorage = function() {
	var storage = {
		race  : this.race.toFixed(),
		col   : this.color.toFixed(),
		type  : this.type.toFixed(),
		count : this.count.toFixed()
	};
	return storage;
}

Appendage.prototype.FromStorage = function(storage) {
	storage = storage || {};
	this.race   = parseInt(storage.race)   || this.race;
	this.color  = parseInt(storage.col)    || this.color;
	this.type   = parseInt(storage.type)   || this.type;
	this.count  = parseInt(storage.count)  || this.count;
}

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
