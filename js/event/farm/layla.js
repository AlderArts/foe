/*
 * 
 * Define Layla
 * 
 */
function Layla(storage) {
	Entity.call(this);

	// Character stats
	this.name = "Layla";
	
	//this.avatar.combat = Images.maria;
	
	/* TODO
	this.maxHp.base        = 100;
	this.maxSp.base        = 80;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 22;
	this.dexterity.base    = 16;
	this.intelligence.base = 17;
	this.spirit.base       = 15;
	this.libido.base       = 20;
	this.charisma.base     = 18;
	
	this.level = 5;
	this.sexlevel = 3;
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 5;
	this.SetSkinColor(Color.brown);
	this.SetHairColor(Color.black);
	this.SetEyeColor(Color.blue);
	*/
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = Layla.Met.NotMet;

	if(storage) this.FromStorage(storage);
}
Layla.prototype = new Entity();
Layla.prototype.constructor = Layla;

Layla.Met = {
	NotMet : 0,
	Met : 1
};

Scenes.Layla = {};

Layla.prototype.FromStorage = function(storage) {
	this.FirstVag().virgin   = parseInt(storage.virgin) == 1;
	this.Butt().virgin       = parseInt(storage.avirgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Layla.prototype.ToStorage = function() {
	var storage = {
		virgin  : this.FirstVag().virgin ? 1 : 0,
		avirgin : this.Butt().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule
Layla.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Farm.Fields)
		return (world.time.hour >= 7 && world.time.hour < 22);
	return false;
}
