/*
 * 
 * Define Vaughn
 * 
 */
import { Entity } from '../../entity';
import { Color } from '../../body/color';
import { Race } from '../../body/race';
import { Time } from '../../time';
import { WorldTime, GAME } from '../../GAME';
import { VaughnFlags } from './vaughn-flags';
import { VaughnScenes } from './vaughn-scenes';

function Vaughn(storage) {
	Entity.call(this);
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
Vaughn.prototype = new Entity();
Vaughn.prototype.constructor = Vaughn;

Vaughn.prototype.Met = function() {
	return this.flags["Met"] >= VaughnFlags.Met.Met;
}

Vaughn.prototype.FromStorage = function(storage) {
	// Load flags
	this.LoadFlags(storage);
	
	this.taskTimer.FromStorage(storage.Ttime);
}

Vaughn.prototype.ToStorage = function() {
	var storage = {
	};
	
	this.SaveFlags(storage);
	
	storage.Ttime = this.taskTimer.ToStorage();
	
	return storage;
}


Vaughn.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	if(VaughnScenes.Tasks.OnTask())
		this.taskTimer.Dec(step);
}

// Schedule
Vaughn.prototype.IsAtLocation = function(location) {
	location = location || GAME().party.location;
	if(location == world.loc.Outlaws.Camp)
		return (WorldTime().hour >= 18 || WorldTime().hour < 6);
	return false;
}

//Trigger after having completed either outlaws into Rigard
// TODO OR after Belindaquest has been done (in the case the PC ignores the outlaws all the way up till then).
//Also requires that player have access to castle grounds.
Vaughn.prototype.IntroAvailable = function() {
	let rigard = GAME().rigard;
	let outlaws = GAME().outlaws;
	if(this.Met()) return false;
	if(!outlaws.CompletedPathIntoRigard()) return false;
	if(!rigard.RoyalAccess()) return false;
	return true;
}

Vaughn.prototype.SexTime = function() {
	return WorldTime().hour < 12;
}

Vaughn.prototype.HaveDoneTerryRoleplay = function() {
	return false; //TODO
}

Vaughn.prototype.Confronted = function() {
	return this.flags["Talk"] & VaughnFlags.Talk.ConfrontFollowup;
}


export { Vaughn };
