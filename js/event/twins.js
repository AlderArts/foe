/*
 * 
 * Define Twins (fighting entity)
 * 
 */
function Twins(storage) {
	this.rumi = new Rumi();
	this.rani = new Rani();
	
	this.flags = {};
	this.flags["Met"] = 0;
	
	if(storage) this.FromStorage(storage);
}

Twins.prototype.FromStorage = function(storage) {
	if(storage.rumi) this.rumi.FromStorage(storage.rumi);
	if(storage.rani) this.rani.FromStorage(storage.rani);
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Twins.prototype.ToStorage = function() {
	var storage = {
	};
	storage.rumi  = this.rumi.ToStorage();
	storage.rani  = this.rani.ToStorage();
	storage.flags = this.flags;
	
	return storage;
}

Scenes.Twins = {};

// Schedule
Twins.prototype.IsAtLocation = function(location) {
	return true;
}






function Rumi() {
	Entity.call(this);
	
	
}
Rumi.prototype = new Entity();
Rumi.prototype.constructor = Rumi;

Rumi.prototype.FromStorage = function(storage) {
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Rumi.prototype.ToStorage = function() {
	var storage = {
		
	};
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	
	return storage;
}

function Rani() {
	Entity.call(this);
	
	
}
Rani.prototype = new Entity();
Rani.prototype.constructor = Rani;

Rani.prototype.FromStorage = function(storage) {
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Rani.prototype.ToStorage = function() {
	var storage = {
		
	};
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	
	return storage;
}
