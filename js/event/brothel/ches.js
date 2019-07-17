/*
 * 
 * Define Ches
 * 
 */
import { Scenes } from '../../event';
import { Entity } from '../../entity';

function Ches(storage) {
	Entity.call(this);
	this.ID = "ches";
	
	// Character stats
	this.name = "Ches";
	
	this.body.DefMale();
	
	this.flags["Met"] = Ches.Met.NotMet;
	
	if(storage) this.FromStorage(storage);
}
Ches.prototype = new Entity();
Ches.prototype.constructor = Ches;

Ches.Met = {
	NotMet : 0
};

Ches.prototype.Met = function() {
	return this.flags["Met"] != Ches.Met.NotMet;
}

Ches.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Ches.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Flags

// Schedule
Ches.prototype.IsAtLocation = function(location) {
	return true;
}
