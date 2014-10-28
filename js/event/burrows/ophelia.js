/*
 * 
 * Define Ophelia
 * 
 */

function Ophelia(storage) {
	Entity.call(this);
	
	this.name              = "Ophelia";
	this.body.DefFemale();
	
	this.body.SetRace(Race.rabbit);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	this.body.SetBodyColor(Color.white);
	this.body.SetEyeColor(Color.blue);
	
	if(storage) this.FromStorage(storage);
}
Ophelia.prototype = new Entity();
Ophelia.prototype.constructor = Ophelia;


Ophelia.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Ophelia.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}
