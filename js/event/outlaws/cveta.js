/*
 * 
 * Define Cveta
 * 
 */
import { Entity } from '../../entity';
import { JobDesc, Jobs } from '../../job';
import { Images } from '../../assets';
import { Color } from '../../body/color';
import { Time } from '../../time';
import { WorldTime, GAME } from '../../GAME';

function Cveta(storage) {
	Entity.call(this);
	this.ID = "cveta";

	// Character stats
	this.name = "Cveta";
	
	this.avatar.combat = Images.cveta;
	
	// TODO Jobs, multipliers
	this.currentJob = Jobs.Songstress;
	this.jobs["Songstress"] = new JobDesc(Jobs.Songstress);
	this.jobs["Scholar"]   = new JobDesc(Jobs.Scholar);   this.jobs["Scholar"].mult   = 2;
	this.jobs["Courtesan"] = new JobDesc(Jobs.Courtesan);

	this.jobs["Mage"]      = new JobDesc(Jobs.Mage);   this.jobs["Mage"].mult   = 2;
	this.jobs["Mystic"]    = new JobDesc(Jobs.Mystic); this.jobs["Mystic"].mult = 2;
	this.jobs["Healer"]    = new JobDesc(Jobs.Healer); this.jobs["Healer"].mult = 2;
	
	this.jobs["Hypnotist"] = new JobDesc(Jobs.Hypnotist); this.jobs["Hypnotist"].mult = 1.2;
	
	this.maxHp.base        = 80;
	this.maxSp.base        = 80;
	this.maxLust.base      = 80;
	// Main stats
	this.strength.base     = 17; this.strength.growth     = 1.3;
	this.stamina.base      = 20; this.stamina.growth      = 1.4; 
	this.dexterity.base    = 20; this.dexterity.growth    = 1.5;
	this.intelligence.base = 30; this.intelligence.growth = 1.7;
	this.spirit.base       = 30; this.spirit.growth       = 1.5;
	this.libido.base       = 25; this.libido.growth       = 1.3;
	this.charisma.base     = 40; this.charisma.growth     = 1.9;
	
	this.level = 12;
	this.sexlevel = 1;
	this.SetExpToLevel();
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 5;
	this.Butt().buttSize.base = 3;
	this.SetSkinColor(Color.red);
	this.SetHairColor(Color.red);
	this.SetEyeColor(Color.green);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]     = Cveta.Met.NotMet;
	this.flags["Herself"] = Cveta.Herself.None;
	this.flags["Music"]   = Cveta.Music.No;
	this.flags["Singer"]  = Cveta.Singer.No;
	this.flags["Bard"]    = Cveta.Bard.No;
	this.flags["Wings"]   = 0;
	this.flags["Intimate"] = 0; //Bitmask
	this.flags["Date"]    = 0; //Bitmask
	
	this.violinTimer = new Time();
	this.flirtTimer  = new Time();

	if(storage) this.FromStorage(storage);
}
Cveta.prototype = new Entity();
Cveta.prototype.constructor = Cveta;

Cveta.Met = {
	NotMet       : 0,
	MariaTalk    : 1,
	FirstMeeting : 2,
	ViolinQ      : 3,
	ViolinGet    : 4,
	Available    : 5
};
Cveta.Herself = {
	None     : 0,
	Outlaws  : 1,
	Nobility : 2,
	Mandate  : 3
};
Cveta.Music = {
	No     : 0,
	Talked : 1
}
Cveta.Bard = {
	No     : 0,
	Taught : 1
};
Cveta.Singer = {
	No     : 0,
	Taught : 1
};
Cveta.Intimate = { //Bitmask
	Introduced : 1, //seen post-bulltower performance
	Groped : 2
};

Cveta.prototype.Met = function() {
	return this.flags["Met"] >= Cveta.Met.FirstMeeting;
}

Cveta.prototype.FromStorage = function(storage) {
	this.FirstVag().virgin   = parseInt(storage.virgin) == 1;
	this.Butt().virgin       = parseInt(storage.avirgin) == 1;
	
	this.violinTimer.FromStorage(storage.Vtime);
	this.flirtTimer.FromStorage(storage.Ftime);
	
	this.LoadPersonalityStats(storage);
	this.LoadFlags(storage);
	
	if(GAME().outlaws.RetrievedBlueRoses())
		this.avatar.combat = Images.cveta_b;
}

Cveta.prototype.ToStorage = function() {
	var storage = {
		virgin  : this.FirstVag().virgin ? 1 : 0,
		avirgin : this.Butt().virgin ? 1 : 0
	};
	
	storage.Vtime = this.violinTimer.ToStorage();
	storage.Ftime = this.flirtTimer.ToStorage();
	
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule TODO
Cveta.prototype.IsAtLocation = function(location) {
	location = location || GAME().party.location;
	return true;
}

Cveta.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	
	this.violinTimer.Dec(step);
	this.flirtTimer.Dec(step);
}

Cveta.prototype.PerformanceTime = function() {
	return (WorldTime().hour >= 6 && WorldTime().hour < 9) || (WorldTime().hour >= 17 && WorldTime().hour < 20);
}
Cveta.prototype.WakingTime = function() {
	return (WorldTime().hour >= 6 && WorldTime().hour < 20);
}
Cveta.prototype.InTent = function() {
	return (WorldTime().hour >= 6 && WorldTime().hour < 10) || (WorldTime().hour >= 14 && WorldTime().hour < 20);
}
Cveta.prototype.Violin = function() {
	return this.flags["Met"] >= Cveta.Met.Available;
}
Cveta.prototype.BlueRoses = function() { //TODO
	return false;
}

Cveta.Dates = { //Bitmask
	Glade : 1,
	Spring : 2
};

export { Cveta };
