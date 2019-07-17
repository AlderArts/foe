
/*
 * Superclass for all entity genitalia. Handles things that
 * affect all genitalia as a group.
 */

function Genitalia(body, storage) {
	this.body   = body;
	this.cover  = Genitalia.Cover.NoCover;
	
	if(storage) this.FromStorage(storage);
}

Genitalia.Cover = {
	NoCover : 0,
	Sheath  : 1,
	Slit    : 2
};

Genitalia.prototype.ToStorage = function() {
	var storage = {
		c : this.cover.toFixed()
	}
	return storage;
}

Genitalia.prototype.FromStorage = function(storage) {
	storage = storage || {};
	this.cover = parseInt(storage.c) || this.cover;
}

Genitalia.prototype.NoCover = function() {
	if(this.body.NumCocks() == 0) return true;
	return this.cover == Genitalia.Cover.NoCover;
}
Genitalia.prototype.Sheath = function() {
	if(this.body.NumCocks() == 0) return false;
	return this.cover == Genitalia.Cover.Sheath;
}
Genitalia.prototype.Slit = function() {
	if(this.body.NumCocks() == 0) return false;
	return this.cover == Genitalia.Cover.Slit;
}

//TODO use in scenes (might need a lot of rewriting in places)
Genitalia.prototype.InternalBalls = function() {
	//TODO other factors?
	return this.cover == Genitalia.Cover.Slit;
}

//TODO logic specific to changing cover?
Genitalia.prototype.SetCover = function(cover) {
	if     (cover == Genitalia.Cover.NoCover) {
		
	}
	else if(cover == Genitalia.Cover.Sheath) {
		
	}
	else if(cover == Genitalia.Cover.Slit) {
		
	}
	else {
		//Invalid type
		return;
	}
	this.cover = cover;
}

//TODO functions for clitcock growth

export { Genitalia };
