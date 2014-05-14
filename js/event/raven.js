/*
 * 
 * Define Raven mother
 * 
 */

function RavenMother(storage) {
	Entity.call(this);
	
	this.name              = "RavenMother";
	this.maxHp.base        = 3000;
	this.maxSp.base        = 500;
	this.maxLust.base      = 500;
	// Main stats
	this.strength.base     = 100;
	this.stamina.base      = 120;
	this.dexterity.base    = 150;
	this.intelligence.base = 90;
	this.spirit.base       = 100;
	this.libido.base       = 100;
	this.charisma.base     = 80;
	
	this.level             = 20;
	this.sexlevel          = 15;
	
	this.combatExp         = 800;
	this.coinDrop          = 1500;
	
	this.body.DefMale();
	// TODO: Special avatar
	//this.avatar.combat     = Images.lago_male;
	
	this.Butt().buttSize.base = 2;
	
	this.body.SetRace(Race.avian);
	
	TF.SetAppendage(this.Back(), AppendageType.wing, Race.avian, Color.black);
	
	this.body.SetBodyColor(Color.white);
	
	this.body.SetEyeColor(Color.green);
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Stage"] = 0;
	
	if(storage) this.FromStorage(storage);
}
RavenMother.prototype = new Entity();
RavenMother.prototype.constructor = RavenMother;

RavenMother.Stage = {
	ravenstage2 : 8,
	ravenstage3 : 12
}

RavenMother.prototype.Ravenness = function() {
	return Math.floor(this.flags["Stage"] / 100);
}

// Increase ravenness and return trigger
RavenMother.prototype.RavenTrigger = function() {
	var oldVal = this.Ravenness();
	this.flags["Stage"] += Math.floor(10 + Math.random() * 70);
	var newVal = this.Ravenness();
	
	return newVal > oldVal;
}

RavenMother.prototype.FromStorage = function(storage) {
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

RavenMother.prototype.ToStorage = function() {
	var storage = {};
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	
	return storage;
}