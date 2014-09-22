/*
 * 
 * Define Lucille
 * 
 */
function Lucille(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Lucille";
	
	this.body.DefFemale();
	
	if(storage) this.FromStorage(storage);
}
Lucille.prototype = new Entity();
Lucille.prototype.constructor = Lucille;

Lucille.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Lucille.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Flags

// Schedule
Lucille.prototype.IsAtLocation = function(location) {
	return true;
}
