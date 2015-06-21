

function Gryphons(storage) {
	Entity.call(this);
	
	this.flags["State"] = Gryphons.State.NotViewed;
	
	if(storage) this.FromStorage(storage);
}
Gryphons.prototype = new Entity();
Gryphons.prototype.constructor = Gryphons;

Gryphons.State = {
	NotViewed : 0,
	S1WorldsEdge : 1,
};

Gryphons.prototype.Cost = function() {
	return 250;
}
Gryphons.prototype.First = function() {
	return this.flags["State"] == Gryphons.State.NotViewed;
}


Gryphons.prototype.FromStorage = function(storage) {
	// Load flags
	this.LoadFlags(storage);
}

Gryphons.prototype.ToStorage = function() {
	var storage = {};
	
	this.SaveFlags(storage);
	
	return storage;
}

Scenes.Brothel.Gryphons = {};

Scenes.Brothel.Gryphons