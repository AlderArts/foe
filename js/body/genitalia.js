
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


