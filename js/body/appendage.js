
import { BodyPart } from './bodypart';

let AppendageType = {
	horn    : 0,
	antenna : 1,
	tail    : 2,
	wing    : 3,
	abdomen : 4
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
		race  : this.race.id.toFixed(),
		col   : this.color.toFixed(),
		type  : this.type.toFixed(),
		count : this.count.toFixed()
	};
	return storage;
}

Appendage.prototype.FromStorage = function(storage) {
	storage = storage || {};
	this.race   = RaceDesc.IdToRace[parseInt(storage.race)] || this.race;
	this.color  = parseInt(storage.col)    || this.color;
	this.type   = parseInt(storage.type)   || this.type;
	this.count  = parseInt(storage.count)  || this.count;
}

Appendage.prototype.Short = function() {
	var noun;
	if(this.count > 1) {
		if     (this.type == AppendageType.horn) {
			if(this.race.isRace(Race.Deer))
				noun = "antlers";
			else
				noun = "horns";
		}
		else if(this.type == AppendageType.antenna) noun = "antennas";
		else if(this.type == AppendageType.tail)    noun = "tails";
		else if(this.type == AppendageType.wing)    noun = "wings";
		else if(this.type == AppendageType.abdomen) noun = "abdomen";
	}
	else {
		if     (this.type == AppendageType.horn) {
			if(this.race.isRace(Race.Deer))
				noun = "antler";
			else
				noun = "horn";
		}
		else if(this.type == AppendageType.antenna) noun = "antenna";
		else if(this.type == AppendageType.tail)    noun = "tail";
		else if(this.type == AppendageType.wing)    noun = "wing";
		else if(this.type == AppendageType.abdomen) noun = "abdomen";
	}
	return noun;
}
// Is the appendage prehensile or not?
Appendage.prototype.Prehensile = function() {
	if(this.type == AppendageType.tail) {
		if(this.race.isRace(Race.Reptile)) return true;
		if(this.race.isRace(Race.Demon)) return true;
	}
	return false;
}

Appendage.prototype.Long = function() {
	var count = Text.Quantify(this.count);
	var desc = this.race.qShort();
	if     (this.type == AppendageType.horn) {
		switch(this.race.id) {
			case Race.Deer.id: return count + " of antlers";
			default: return count + " of " + desc + " horns";
		}
	}
	else if(this.type == AppendageType.antenna) {
		switch(this.race.id) {
			case Race.Moth.id:   return count + " moth-like antenna";
			default: return count + " of strange antenna";
		}
	}
	else if(this.type == AppendageType.tail) {
		switch(this.race.id) {
			case Race.Avian.id:  return "tail feathers";
			case Race.Scorpion.id: return "segmented tail, with a stinger";
			default: return desc + " tail";
		}
	}
	else if(this.type == AppendageType.wing) {
		return count + " of " + desc + " wings";
	}
	else if(this.type == AppendageType.abdomen) {
		return desc + " abdomen";
	}
	else return "strange growth";
}

export { Appendage, AppendageType };
