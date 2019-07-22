/*
 * 
 * Town area that can be explored
 * 
 */

// Create namespace
let TreeCityLoc = {
}

let TreeCityScenes = {};

// Class to handle global flags and logic for town
function TreeCity(storage) {
	this.flags = {};
	
	// Have been to tree city
	this.flags["Access"] = 0;
	
	if(storage) this.FromStorage(storage);
}

TreeCity.prototype.ToStorage = function() {
	var storage = {};
	
	storage.flags = this.flags;
	
	return storage;
}

TreeCity.prototype.FromStorage = function(storage) {
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

export { TreeCity, TreeCityLoc, TreeCityScenes };
