/*
 * 
 * Define Layla
 * 
 */

import { Entity } from '../../entity';
import { JobDesc, Jobs } from '../../job';
import { Time } from '../../time';
import { Images } from '../../assets';
import { Color } from '../../body/color';
import { WorldTime } from '../../GAME';
import { Text } from '../../text';

function Layla(storage) {
	Entity.call(this);
	this.ID = "layla";

	// Character stats
	this.name = "Layla";
	
	this.avatar.combat = Images.layla;
	
	this.currentJob = Jobs.Fighter;
	this.jobs["Fighter"]   = new JobDesc(Jobs.Fighter);   this.jobs["Fighter"].mult   = 1.2;
	this.jobs["Scholar"]   = new JobDesc(Jobs.Scholar);   this.jobs["Scholar"].mult   = 1.2;
	this.jobs["Courtesan"] = new JobDesc(Jobs.Courtesan); this.jobs["Courtesan"].mult = 1.2;

	this.jobs["Bruiser"]   = new JobDesc(Jobs.Bruiser); this.jobs["Bruiser"].mult = 1.2;
	this.jobs["Rogue"]     = new JobDesc(Jobs.Rogue);   this.jobs["Rogue"].mult   = 1.2;
	this.jobs["Ranger"]    = new JobDesc(Jobs.Ranger);  this.jobs["Ranger"].mult  = 1.2;
	
	this.jobs["Mage"]      = new JobDesc(Jobs.Mage);   this.jobs["Mage"].mult   = 1.2;
	this.jobs["Mystic"]    = new JobDesc(Jobs.Mystic); this.jobs["Mystic"].mult = 1.2;
	this.jobs["Healer"]    = new JobDesc(Jobs.Healer); this.jobs["Healer"].mult = 1.2;
	
	this.jobs["Elementalist"] = new JobDesc(Jobs.Elementalist); this.jobs["Elementalist"].mult = 1.2;
	this.jobs["Warlock"]      = new JobDesc(Jobs.Warlock);      this.jobs["Warlock"].mult = 1.2;
	this.jobs["Hypnotist"]    = new JobDesc(Jobs.Hypnotist);    this.jobs["Hypnotist"].mult = 1.2;
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 60;
	this.maxLust.base      = 80;
	// Main stats
	this.strength.base     = 20; this.strength.growth     = 1.3;
	this.stamina.base      = 22; this.stamina.growth      = 1.4;
	this.dexterity.base    = 30; this.dexterity.growth    = 1.5;
	this.intelligence.base = 30; this.intelligence.growth = 1.5;
	this.spirit.base       = 35; this.spirit.growth       = 1.8;
	this.libido.base       = 30; this.libido.growth       = 1.6;
	this.charisma.base     = 25; this.charisma.growth     = 1.5;
	
	this.level = 12;
	this.sexlevel = 1;
	this.SetExpToLevel();
	
	this.body.DefHerm();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 5;
	this.SetSkinColor(Color.blue);
	this.SetHairColor(Color.black);
	this.SetEyeColor(Color.red);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = Layla.Met.NotMet;
	this.flags["Take"] = 0;
	this.flags["Skin"] = 0;
	this.flags["Talk"] = 0; //Bitmask

	this.farmTimer = new Time();

	if(storage) this.FromStorage(storage);
}
Layla.prototype = new Entity();
Layla.prototype.constructor = Layla;


Layla.Met = {
	NotMet : 0,//Never seen
	First  : 1,//Met at least once, not defeated
	Won    : 2,//Defeated
	Farm   : 3,//Talked to at farm, not in party
	Party  : 4,//Recruited to party
	Talked : 5 //Talked to her in party
};

Layla.Talk = {
	Sex    : 1, //Talked about sex
	Origin : 2
};


Layla.prototype.FromStorage = function(storage) {
	storage = storage || {};
	
	this.body.FromStorage(storage.body);
	this.LoadPersonalityStats(storage);
	this.LoadFlags(storage);
	
	this.LoadPregnancy(storage);
	this.LoadSexFlags(storage);
	this.LoadCombatStats(storage);
	this.LoadPersonalityStats(storage);
	
	this.LoadJobs(storage);
	
	this.RecallAbilities();
	this.SetLevelBonus();
	
	this.farmTimer.FromStorage(storage.ft);
}

Layla.prototype.ToStorage = function() {
	var storage = {};
	
	this.SaveBodyPartial(storage, {ass: true, vag: true, balls: true});
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);

	this.SavePregnancy(storage);
	this.SaveSexFlags(storage);
	this.SaveCombatStats(storage);
	this.SavePersonalityStats(storage);
	
	this.SaveJobs(storage);
	
	storage.ft = this.farmTimer.ToStorage();
	
	return storage;
}

Layla.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	this.farmTimer.Dec(step);
}

// Schedule
Layla.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Farm.Fields)
		return (WorldTime().hour >= 7 && WorldTime().hour < 22);
	return false;
}

Layla.prototype.Virgin = function() {
	return this.FirstVag().virgin;
}


/* TODO
 * Act AI
 */

function LaylaMob() {
	Entity.call(this);

	// Character stats
	this.name = "Creature";
	this.monsterName       = "the creature";
	this.MonsterName       = "The creature";
	
	this.avatar.combat = Images.layla_f;
	
	// TODO
	this.maxHp.base        = 1000;
	this.maxSp.base        = 200;
	this.maxLust.base      = 350;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 22;
	this.dexterity.base    = 30;
	this.intelligence.base = 32;
	this.spirit.base       = 40;
	this.libido.base       = 34;
	this.charisma.base     = 25;
	
	this.level = 12;
	this.sexlevel = 1;
	
	this.body.DefHerm();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 5;
	this.SetSkinColor(Color.blue);
	this.SetHairColor(Color.black);
	this.SetEyeColor(Color.red);
	
	this.SetLevelBonus();
	this.RestFull();
}
LaylaMob.prototype = new Entity();
LaylaMob.prototype.constructor = LaylaMob;

LaylaMob.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.MonsterName + " acts! Rawr!");
	Text.NL();
	Text.Flush();
	
	// Pick a random target (go for lowest abs HP)
	var t = this.GetSingleTarget(encounter, activeChar, TargetStrategy.LowAbsHp);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.6)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.Use(encounter, this, t);
}


// Party interaction
Layla.prototype.Interact = function(switchSpot) {
	LaylaScenes.PartyRegular(switchSpot);
}


export { Layla };
