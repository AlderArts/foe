/*
 * 
 * Define Vena
 * 
 */

import { Entity } from '../../entity';
import { Race } from '../../body/race';
import { TF } from '../../tf';
import { AppendageType } from '../../body/appendage';
import { Color } from '../../body/color';

export class Vena extends Entity {
	constructor(storage? : any) {
		super();

		this.ID = "vena";
		
		this.name              = "Vena";
		
		this.body.DefFemale();
		
		//TODO hermification
		
		this.Butt().virgin = false;
		this.FirstVag().virgin = false;
		this.Butt().buttSize.base = 15;
		
		this.body.SetRace(Race.Rabbit);
		
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Rabbit, Color.white);
		
		this.body.SetBodyColor(Color.white);
		
		this.body.SetEyeColor(Color.blue);
		
		this.flags["Met"] = 0; // bitmask
		this.flags["Sex"] = 0; // bitmask
		
		if(storage) this.FromStorage(storage);
	}

	FromStorage(storage : any) {
		this.LoadPersonalityStats(storage);
		
		// Load flags
		this.LoadFlags(storage);
	}

	ToStorage() {
		var storage = {};
		
		this.SavePersonalityStats(storage);
		
		this.SaveFlags(storage);
		
		return storage;
	}
}
