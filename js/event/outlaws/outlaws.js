/*
 * Outlaws flags
 */

Scenes.Outlaws = {};

// Class to handle global flags and logic for outlaws
function Outlaws(storage) {
	this.flags = {};
	
	this.flags["BT"] = 0; // Bitmask
	
	this.relation = new Stat(0);
	
	if(storage) this.FromStorage(storage);
}

Outlaws.prototype.ToStorage = function() {
	var storage = {};
	
	storage.flags = this.flags;
	if(this.relation.base != 0)
		storage.rep = this.relation.base.toFixed();
	
	return storage;
}

Outlaws.prototype.FromStorage = function(storage) {
	storage = storage || {};
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
	this.relation.base = !isNaN(parseInt(storage.rep)) ? parseInt(storage.rep) : this.relation.base;
}

Outlaws.prototype.Update = function(step) {
	
}


// TODO
Outlaws.prototype.TurnedInBinder = function() {
	return false;
}

Outlaws.prototype.Rep = function() {
	return this.relation.Get();
}


