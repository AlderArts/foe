/*
 * 
 * Define Uru
 * 
 */
function Uru(storage) {
	Entity.call(this);
	
	
	// Character stats
	this.name = "Uru";
	
	this.maxHp.base        = 6000;
	this.maxSp.base        = 1500;
	this.maxLust.base      = 500;
	// Main stats
	this.strength.base     = 90;
	this.stamina.base      = 110;
	this.dexterity.base    = 100;
	this.intelligence.base = 200;
	this.spirit.base       = 500;
	this.libido.base       = 300;
	this.charisma.base     = 100;
	
	this.level = 50;
	this.sexlevel = 50;
	
	this.body.DefHerm(false);
	this.FirstBreastRow().size.base = 16;
	this.Butt().buttSize.base = 9;
	this.FirstCock().thickness.base = 8;
	this.FirstCock().length.base    = 40;
	this.body.SetRace(Race.demon);
	this.body.SetBodyColor(Color.red);
	this.body.SetHairColor(Color.black);
	this.body.SetEyeColor(Color.orange);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.demon, Color.red);
	TF.SetAppendage(this.Appendages(), AppendageType.horn, Race.demon, Color.black);
	
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	
	this.SetLevelBonus();
	this.RestFull();

	if(storage) this.FromStorage(storage);
}
Uru.prototype = new Entity();
Uru.prototype.constructor = Uru;

Uru.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Uru.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Flags

// Schedule
Uru.prototype.IsAtLocation = function(location) {
	return true;
}
