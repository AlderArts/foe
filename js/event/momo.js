/*
 * 
 * Define Momo
 * 
 */
function Momo(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Momo";
	
	this.avatar.combat = Images.momo;
	
	// TODO Stats
	this.maxHp.base        = 30;
	this.maxSp.base        = 40;
	this.maxLust.base      = 20;
	// Main stats
	this.strength.base     = 10;
	this.stamina.base      = 11;
	this.dexterity.base    = 22;
	this.intelligence.base = 17;
	this.spirit.base       = 19;
	this.libido.base       = 18;
	this.charisma.base     = 16;
	
	this.level = 1;
	this.sexlevel = 1;
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 6;
	this.body.SetRace(Race.dragon);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]  = 0;

	if(storage) this.FromStorage(storage);
}
Momo.prototype = new Entity();
Momo.prototype.constructor = Momo;

Momo.prototype.FromStorage = function(storage) {
	this.Butt().virgin     = parseInt(storage.avirgin) == 1;
	this.FirstVag().virgin = parseInt(storage.virgin)  == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	
	//TODO combat stats
}

Momo.prototype.ToStorage = function() {
	var storage = {
		avirgin : this.Butt().virgin ? 1 : 0,
		virgin  : this.FirstVag().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexStats(storage);
	
	return storage;
}

Scenes.Momo = {};

// Schedule
Momo.prototype.IsAtLocation = function(location) {
	return true;
}