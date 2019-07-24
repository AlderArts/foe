/*
 * 
 * Define Vaughn
 * 
 */
import { Entity } from '../../entity';
import { Color } from '../../body/color';
import { Race } from '../../body/race';
import { Time } from '../../time';

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

Vaughn.Met = {
	NotAvailable : 0,
	Met : 1,
	//Task 1
	OnTaskLockpicks : 2,
	LockpicksElodie : 3,
	CompletedLockpicks : 4,
	//Task 2
	OnTaskSnitch : 5,
	SnitchMirandaSuccess : 6,
	SnitchWatchhousFail : 7,
	SnitchWatchhousSuccess : 8,
	CompletedSnitch : 10,
	//Task 3
	OnTaskPoisoning : 11,
	PoisoningFail : 12,
	PoisoningSucceed : 13,
	CompletedPoisoning : 14
	//TODO: tasks
};
Vaughn.Talk = { //Bitmask
	Himself : 1,
	Past    : 2,
	Fiancee : 4,
	Sex     : 8,
	Confront : 16,
	ConfrontFollowup : 32
};
Vaughn.TalkWar = {
	Beginnings : 1,
	Wartime    : 2,
	Desertion  : 3,
	Afterwards : 4
};
Vaughn.Sex = {
	Titfuck : 1
};

Vaughn.prototype.Met = function() {
	return this.flags["Met"] >= Vaughn.Met.Met;
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
	location = location || party.location;
	if(location == world.loc.Outlaws.Camp)
		return (world.time.hour >= 18 || world.time.hour < 6);
	return false;
}

//Trigger after having completed either outlaws into Rigard
// TODO OR after Belindaquest has been done (in the case the PC ignores the outlaws all the way up till then).
//Also requires that player have access to castle grounds.
Vaughn.prototype.IntroAvailable = function() {
	if(this.Met()) return false;
	if(!outlaws.CompletedPathIntoRigard()) return false;
	if(!rigard.RoyalAccess()) return false;
	return true;
}

export { Vaughn };
