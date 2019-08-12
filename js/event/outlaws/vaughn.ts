/*
 * 
 * Define Vaughn
 * 
 */
import { Entity } from '../../entity';
import { Color } from '../../body/color';
import { Race } from '../../body/race';
import { Time } from '../../time';
import { WorldTime, GAME, WORLD } from '../../GAME';
import { VaughnFlags } from './vaughn-flags';
import { VaughnScenes } from './vaughn-scenes';

export class Vaughn extends Entity {
	taskTimer : Time;

	constructor(storage? : any) {
		super();

		this.ID = "vaughn";

		// Character stats
		this.name = "Vaughn";
		
		this.body.DefMale();
		this.SetSkinColor(Color.brown);
		this.SetHairColor(Color.brown);
		this.SetEyeColor(Color.brown);
		
		this.body.SetRace(Race.Fox);
		
		this.SetLevelBonus();
		this.RestFull();
		
		this.flags["Met"]  = 0;
		this.flags["Talk"] = 0; //Bitmask
		this.flags["TWar"] = 0;
		this.flags["Sex"]  = 0;
		
		this.flags["T3"] = 0; //Bitmask
		
		this.taskTimer = new Time();
		
		if(storage) this.FromStorage(storage);
	}

	Met() {
		return this.flags["Met"] >= VaughnFlags.Met.Met;
	}
	
	FromStorage(storage : any) {
		// Load flags
		this.LoadFlags(storage);
		
		this.taskTimer.FromStorage(storage.Ttime);
	}
	
	ToStorage() {
		var storage  : any = {
		};
		
		this.SaveFlags(storage);
		
		storage.Ttime = this.taskTimer.ToStorage();
		
		return storage;
	}
	
	
	Update(step : number) {
		super.Update(step);
		if(VaughnScenes.Tasks.OnTask())
			this.taskTimer.Dec(step);
	}
	
	// Schedule
	IsAtLocation(location? : any) {
		location = location || GAME().party.location;
		if(location == WORLD().loc.Outlaws.Camp)
			return (WorldTime().hour >= 18 || WorldTime().hour < 6);
		return false;
	}
	
	//Trigger after having completed either outlaws into Rigard
	// TODO OR after Belindaquest has been done (in the case the PC ignores the outlaws all the way up till then).
	//Also requires that player have access to castle grounds.
	IntroAvailable() {
		let rigard = GAME().rigard;
		let outlaws = GAME().outlaws;
		if(this.Met()) return false;
		if(!outlaws.CompletedPathIntoRigard()) return false;
		if(!rigard.RoyalAccess()) return false;
		return true;
	}
	
	SexTime() {
		return WorldTime().hour < 12;
	}
	
	HaveDoneTerryRoleplay() {
		return false; //TODO
	}
	
	Confronted() {
		return this.flags["Talk"] & VaughnFlags.Talk.ConfrontFollowup;
	}	
}
