/*
 * 
 * Define Asche
 * 
 */

Scenes.Asche = {};

function Asche(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Asche";
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 6;
	this.body.SetRace(Race.Jackal);
	
	this.SetLevelBonus();
	this.RestFull();
	
	//this.flags["Met"]     = Asche.Met.NotMet;
	
	this.wanderTimer = new Time();

	if(storage) this.FromStorage(storage);
}
Asche.prototype = new Entity();
Asche.prototype.constructor = Asche;

Asche.prototype.Update = function(step) {
	
}

Asche.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	this.body.FromStorage(storage.body);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Asche.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	this.SaveBodyPartial(storage, {ass: true, vag: true});
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}
