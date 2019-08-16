/*
 *
 * Town area that can be explored
 *
 */
import * as _ from "lodash";

// Create namespace
const TreeCityLoc: any = {};
const TreeCityScenes: any = {};

// Class to handle global flags and logic for town
export class TreeCity {
	public flags: any;

	constructor(storage?: any) {
		this.flags = {};

		// Have been to tree city
		this.flags.Access = 0;

		if (storage) { this.FromStorage(storage); }
	}

	public ToStorage() {
		const storage: any = {};

		storage.flags = this.flags;

		return storage;
	}

	public FromStorage(storage: any) {
		// Load flags
		_.forIn(storage.flags, (value, key) => {
			this.flags[key] = parseInt(value, 10);
		});
	}

}

export { TreeCityLoc, TreeCityScenes };
