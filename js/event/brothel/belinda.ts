/*
 * 
 * Define Belinda
 * 
 */
import { Entity } from '../../entity';
import { Race } from '../../body/race';
import { Color } from '../../body/color';
import { WorldTime, GAME, WORLD } from '../../GAME';

export namespace BelindaFlags {
	export enum Met {
		NotMet = 0,
		Met    = 1
	}
}

export class Belinda extends Entity {
	constructor(storage? : any) {
		super();

		this.ID = "belinda";

		// Character stats
		this.name = "Belinda";
		
		this.sexlevel = 5;
		
		this.body.DefFemale();
		this.FirstVag().virgin   = false;
		this.Butt().virgin       = false;
		this.FirstBreastRow().size.base = 12.5;
		this.Butt().buttSize.base = 7;
		this.body.SetRace(Race.Dog);
		this.SetSkinColor(Color.black);
		this.SetHairColor(Color.blue);
		this.SetEyeColor(Color.green);
		
		this.flags["Met"]      = BelindaFlags.Met.NotMet;

		if(storage) this.FromStorage(storage);
	}

	Met() {
		return this.flags["Met"] >= BelindaFlags.Met.Met;
	}
	
	FromStorage(storage : any) {
		this.LoadPersonalityStats(storage);
		// Load flags
		this.LoadFlags(storage);
	}
	
	ToStorage() {
		let storage : any = {
			
		};
		
		this.SavePersonalityStats(storage);
		
		this.SaveFlags(storage);
		
		return storage;
	}
	
	//TODO
	// Schedule
	IsAtLocation(location : any) {
		location = location || GAME().party.location;
		if(location == WORLD().loc.Rigard.Brothel.brothel)
			return (WorldTime().hour >= 18 || WorldTime().hour < 6);
		return false;
	}	
}

export namespace BelindaScenes {

};
