/*
 * 
 * Define Gwendy
 * 
 */
import { Entity } from '../../entity';
import { Images } from '../../assets';
import { Color } from '../../body/color';
import { HairStyle } from '../../body/hair';
import { WorldTime } from '../../worldtime';
import { Text } from '../../text';
import { Gui } from '../../gui';

// TODO: FIX STATS
function Gwendy(storage) {
	Entity.call(this);
	this.ID = "gwendy";
	// Character stats
	this.name = "Gwendy";
	
	this.avatar.combat     = Images.gwendy;
	
	this.maxHp.base        = 80;
	this.maxSp.base        = 50;
	this.maxLust.base      = 20;
	// Main stats
	this.strength.base     = 10;
	this.stamina.base      = 11;
	this.dexterity.base    = 14;
	this.intelligence.base = 18;
	this.spirit.base       = 20;
	this.libido.base       = 13;
	this.charisma.base     = 13;
	
	this.level = 1;
	this.sexlevel = 1;
	this.SetExpToLevel();
	
	// Note, since kia has no fixed gender, create body later
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 11;
	this.Butt().buttSize.base  = 8;
	this.body.height.base      = 173;
	this.body.weigth.base      = 65;
	this.body.head.hair.color  = Color.blonde;
	this.body.head.hair.length.base = 90;
	this.body.head.hair.style  = HairStyle.braid;
	this.body.head.eyes.color  = Color.blue;
	
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]  = 0;
	this.flags["Market"] = 0;
	this.flags["Toys"] = 0; // seen/used toys
	
	this.flags["WorkMilked"] = 0;
	this.flags["WorkFeed"]   = 0;
	// Note: refers to how many times the player won/lost
	this.flags["WonChallenge"]  = 0;
	this.flags["LostChallenge"] = 0;
	// Refers to number of scenes unlocked
	this.flags["ChallengeWinScene"]  = 0;
	this.flags["ChallengeLostScene"] = 0;
	
	if(storage) this.FromStorage(storage);
}
Gwendy.prototype = new Entity();
Gwendy.prototype.constructor = Gwendy;

Gwendy.Market = {
	NotAsked : 0,
	Asked    : 1,
	GoneToMarket : 2
}

Gwendy.Toys = {
	Strapon  : 1,
	RStrapon : 2,
	Beads    : 3,
	DDildo   : 4
}

Gwendy.prototype.Sexed = function() {
	for(var flag in this.sex)
		if(this.sex[flag] != 0)
			return true;
	if(this.flags["ChallengeWinScene"]  != 0) return true;
	if(this.flags["ChallengeLostScene"] != 0) return true;
	return false;
}

Gwendy.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Gwendy.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

// Schedule
Gwendy.prototype.IsAtLocation = function(location) {
	// Numbers/slacking/sleep
	if     (location == world.loc.Farm.Loft)   return (WorldTime().hour >= 19 || WorldTime().hour < 5);
	// Morning routine
	else if(location == world.loc.Farm.Barn)   return (WorldTime().hour >= 5  && WorldTime().hour < 9);
	// Workday
	else if(location == world.loc.Farm.Fields) return (WorldTime().hour >= 9 && WorldTime().hour < 19); //TODO conditional?
	return false;
}

// Party interaction
Gwendy.prototype.Interact = function(switchSpot) {
	Text.Clear();
	var that = gwendy;
	
	that.PrintDescription();
	
	var options = new Array();
	options.push({ nameStr: "Release",
		func : function() {
			Text.Clear();
			Text.Add("[Placeholder] Gwendy masturbates fiercely, cumming buckets.");
			
			world.TimeStep({minute : 10});
			
			that.AddLustFraction(-1);
			Text.Flush();
			Gui.NextPrompt(function() {
				that.Interact(switchSpot);
			});
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	//Equip, stats, job, switch
	that.InteractDefault(options, switchSpot, true, true, true, true);
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}



export { Gwendy };
