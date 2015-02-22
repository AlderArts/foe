/*
 * Aquilius, Outlaw Avian healer
 */

function Aquilius(storage) {
	Entity.call(this);

	// Character stats
	this.name = "Aquilius";
		
	this.body.DefMale();
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = 0;

	if(storage) this.FromStorage(storage);
}
Aquilius.prototype = new Entity();
Aquilius.prototype.constructor = Aquilius;

Scenes.Aquilius = {};

Aquilius.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Aquilius.prototype.ToStorage = function() {
	var storage = {
		
	};
	
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule TODO
Aquilius.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Outlaws.Camp)
		return (world.time.hour >= 7 && world.time.hour < 22);
	return false;
}
