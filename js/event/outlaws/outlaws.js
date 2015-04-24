/*
 * Outlaws flags
 */

Scenes.Outlaws = {};

// Class to handle global flags and logic for outlaws
function Outlaws(storage) {
	this.flags = {};
	
	this.flags["BT"] = 0; // Bitmask
	this.flags["BullTower"] = 0;
	
	this.relation = new Stat(0);
	
	this.BTRewardTimer = new Time();
	
	if(storage) this.FromStorage(storage);
}

Outlaws.prototype.ToStorage = function() {
	var storage = {};
	
	storage.flags = this.flags;
	if(this.relation.base != 0)
		storage.rep = this.relation.base.toFixed();
	
	storage.BTtime = this.BTRewardTimer.ToStorage();
	
	return storage;
}

Outlaws.prototype.FromStorage = function(storage) {
	storage = storage || {};
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
	this.relation.base = !isNaN(parseInt(storage.rep)) ? parseInt(storage.rep) : this.relation.base;
	
	this.BTRewardTimer.FromStorage(storage.BTtime);
}

Outlaws.prototype.Update = function(step) {
	this.BTRewardTimer.Dec(step);
}


// TODO
Outlaws.prototype.TurnedInBinder = function() {
	return false;
}

Outlaws.prototype.BullTowerCompleted = function() {
	return this.flags["BullTower"] >= Outlaws.BullTowerQuest.Completed;
}

Outlaws.prototype.AlaricSaved = function() {
	return this.BullTowerCompleted() && (this.flags["BT"] & Outlaws.BullTower.AlaricFreed);
}

Outlaws.prototype.BullTowerCanGetReward = function() {
	return this.AlaricSaved() && (this.flags["BT"] & Outlaws.BullTower.ContrabandStolen) && (this.flags["BT"] & Outlaws.BullTower.SafeLooted);
}
Outlaws.prototype.Rep = function() {
	return this.relation.Get();
}


