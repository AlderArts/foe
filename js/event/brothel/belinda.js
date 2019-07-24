/*
 * 
 * Define Belinda
 * 
 */
import { Entity } from '../../entity';
import { Race } from '../../body/race';
import { Color } from '../../body/color';

let BelindaScenes = {};

function Belinda(storage) {
	Entity.call(this);
	this.ID = "belinda";

	// Character stats
	this.name = "Belinda";
	
	this.sexlevel = 5;
	
	this.body.DefFemale();
	this.FirstVag().virgin   = false;
	this.Butt().virgin       = false;
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 7;
	this.body.SetRace(Race.Dog);
	this.SetSkinColor(Color.black);
	this.SetHairColor(Color.blue);
	this.SetEyeColor(Color.green);
	
	this.flags["Met"]      = Belinda.Met.NotMet;

	if(storage) this.FromStorage(storage);
}
Belinda.prototype = new Entity();
Belinda.prototype.constructor = Belinda;

Belinda.Met = {
	NotMet : 0,
	Met    : 1
};

Belinda.prototype.Met = function() {
	return this.flags["Met"] >= Belinda.Met.Met;
}

Belinda.prototype.FromStorage = function(storage) {
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Belinda.prototype.ToStorage = function() {
	var storage = {
		
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

//TODO
// Schedule
Belinda.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Rigard.Brothel.brothel)
		return (world.time.hour >= 18 || world.time.hour < 6);
	return false;
}

export { Belinda, BelindaScenes };
