/*
 * 
 * Town area that can be explored
 * 
 */

// Create namespace
let TreeCityLoc : any = {};
let TreeCityScenes : any = {};

// Class to handle global flags and logic for town
export class TreeCity {
	flags : any;

	constructor(storage? : any) {
		this.flags = {};
		
		// Have been to tree city
		this.flags["Access"] = 0;
		
		if(storage) this.FromStorage(storage);
	}
	
	ToStorage() {
		let storage : any = {};
		
		storage.flags = this.flags;
		
		return storage;
	}

	FromStorage(storage : any) {
		// Load flags
		for(var flag in storage.flags)
			this.flags[flag] = parseInt(storage.flags[flag]);
	}

}

export { TreeCityLoc, TreeCityScenes };
