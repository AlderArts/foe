
// Basic game entity
// Enemies and player inherit from Entity

import { Stat } from './stat';
import { StatusList } from './statuseffect';
import { Body } from './body/body';
import { PregnancyHandler } from './pregnancy';
import { LactationHandler } from './lactation';
import { AbilityCollection, DamageType } from './ability';
import { GetDEBUG } from '../app';

// TODO: Should have shared features, such as combat stats. Body representation
function Entity() {
	// Names and grammar
	this.name         = "ENTITY";
	this.monsterName  = undefined;
	this.MonsterName  = undefined;
	this.groupName    = undefined;
	this.GroupName    = undefined;
	this.ID           = undefined;
	// Titles are achieved by performing feats or by achieving great strength
	this.title        = new Array();
	
	this.avatar       = {};
	
	// Combat
	this.combatExp    = 0;
	this.coinDrop     = 0;
	
	// TODO: Save/Load
	this.abilities             = {};
	this.abilities["Skills"]  = new AbilityCollection("Skills");
	this.abilities["Spells"]  = new AbilityCollection("Spells");
	this.abilities["Support"] = new AbilityCollection("Support");
	this.abilities["Seduce"]  = new AbilityCollection("Seduce");
	this.abilities["Special"] = new AbilityCollection("SPECIAL");
	
	// Alchemy stuff
	this.recipes      = [];
	this.alchemyLevel = 0;
	
	// Jobs //TODO: Save/load
	this.jobs         = {};
	this.currentJob   = null;
	
	// Experience
	// Experience is gained by defeating enemies and completing quests
	// Enough experience will increase level
	// Levels reward perks, skills and stats bonuses
	this.experience        = 0;
	this.level             = 1;
	this.pendingStatPoints = 0;
	this.expToLevel        = this.ExpToLevel;
	// Sexperience is gained by having sex
	// Sex leves reward sex perks and skills, and affect sexual based bonuses
	this.sexperience  = 0;
	this.sexlevel     = 1;
	this.sexpToLevel  = this.SexpToLevel;

	// Base stats
	var that = this;
	
	// Health stat and functions
	this.curHp        = 0;
	this.maxHp        = new Stat(10, 10, 5);
	this.maxHp.debug = function() { return that.name + ".maxHp"; }
	// SP
	this.curSp        = 0;
	this.maxSp        = new Stat(10, 5, 5);
	this.maxSp.debug = function() { return that.name + ".maxSp"; }

	// Lust stat and functions
	this.curLust      = 0;
	this.maxLust      = new Stat(10, 5, 5);
	this.maxLust.debug = function() { return that.name + ".maxLust"; }
	
	// Main stats
	this.strength     = new Stat(0, 1, 0.1);
	this.strength.debug = function() { return that.name + ".strength"; }
	this.stamina      = new Stat(0, 1, 0.1);
	this.stamina.debug = function() { return that.name + ".stamina"; }
	this.dexterity    = new Stat(0, 1, 0.1);
	this.dexterity.debug = function() { return that.name + ".dexterity"; }
	this.intelligence = new Stat(0, 1, 0.1);
	this.intelligence.debug = function() { return that.name + ".intelligence"; }
	this.spirit       = new Stat(0, 1, 0.1);
	this.spirit.debug = function() { return that.name + ".spirit"; }
	this.libido       = new Stat(0, 1, 0.1);
	this.libido.debug = function() { return that.name + ".libido"; }
	this.charisma     = new Stat(0, 1, 0.1);
	this.charisma.debug = function() { return that.name + ".charisma"; }
	
	// Equipment
	this.weaponSlot   = null;
	this.topArmorSlot = null;
	this.botArmorSlot = null;
	this.acc1Slot     = null;
	this.acc2Slot     = null;

	this.strapOn      = null;
	
	this.elementAtk   = new DamageType();
	this.elementDef   = new DamageType();
	
	this.combatStatus = new StatusList();
	this.statusDef    = [];
	this.statusDefGear = [];
	this.statusWear   = [];
	
	// Body representation
	this.body         = new Body(this);
	
	this.drunkLevel   = 0.0;
	
	this.pregHandler  = new PregnancyHandler(this);
	this.lactHandler  = new LactationHandler(this);
	
	// Set hp and sp to full, clear lust to min level
	this.Equip();
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags = {};
	this.sex = {
		rBlow : 0,
		gBlow : 0,
		rCunn : 0,
		gCunn : 0,
		rAnal : 0,
		gAnal : 0,
		rVag  : 0,
		gVag  : 0,
		sired : 0,
		birth : 0
	};
	
	this.perks   = [];
	this.aggro   = [];
	
	// Personality stats
	this.subDom   = new Stat(0); // sub = low, dom = high
	this.subDom.debug = function() { return that.name + ".subDom"; }
	this.slut     = new Stat(0);
	this.slut.debug = function() { return that.name + ".slut"; }
	this.relation = new Stat(0);
	this.relation.debug = function() { return that.name + ".relation"; }
}

Entity.prototype.ExpToLevel  = 15;
Entity.prototype.SexpToLevel = 30;

Entity.prototype.SetLevelBonus = function() {
	this.maxHp.level        = this.level * this.maxHp.growth;
	this.maxSp.level        = this.level * this.maxSp.growth;
	this.maxLust.level      = this.level * this.maxLust.growth;
	this.strength.level     = this.level * this.strength.growth;
	this.stamina.level      = this.level * this.stamina.growth;
	this.dexterity.level    = this.level * this.dexterity.growth;
	this.intelligence.level = this.level * this.intelligence.growth;
	this.spirit.level       = this.level * this.spirit.growth;
	this.libido.level       = this.level * this.libido.growth;
	this.charisma.level     = this.level * this.charisma.growth;
}

Entity.prototype.HasPerk = function(perk) {
	for(var i = 0; i < this.perks.length; ++i) {
		if(this.perks[i] == perk)
			return true;
	}
	return false;
}

Entity.prototype.AddPerk = function(perk) {
	for(var i = 0; i < this.perks.length; ++i) {
		if(this.perks[i] == perk)
			return;
	}
	this.perks.push(perk);
}

Entity.prototype.KnowsRecipe = function(item) {
	var idx = this.recipes.indexOf(item); // Find the index
	return (idx != -1);
}

Entity.prototype.AddAlchemy = function(item) {
	var idx = this.recipes.indexOf(item); // Find the index
	if(idx==-1)
		this.recipes.push(item);
}

Entity.prototype.Equip = function() {
	this.maxHp.bonus        = 0;
	this.maxSp.bonus        = 0;
	this.maxLust.bonus      = 0;
	this.strength.bonus     = 0;
	this.stamina.bonus      = 0;
	this.dexterity.bonus    = 0;
	this.intelligence.bonus = 0;
	this.spirit.bonus       = 0;
	this.libido.bonus       = 0;
	this.charisma.bonus     = 0;
	
	this.atkMod = 1;
	this.defMod = 1;
	
	this.elementAtk = new DamageType();
	if(!this.weaponSlot) this.elementAtk.dmg[Element.pBlunt] = 1;
	this.elementDef = new DamageType();
	
	this.statusDefGear = [];
	
	if(this.weaponSlot   && this.weaponSlot.Equip)   this.weaponSlot.Equip(this);
	if(this.topArmorSlot && this.topArmorSlot.Equip) this.topArmorSlot.Equip(this);
	if(this.botArmorSlot && this.botArmorSlot.Equip) this.botArmorSlot.Equip(this);
	if(this.acc1Slot     && this.acc1Slot.Equip)     this.acc1Slot.Equip(this);
	if(this.acc2Slot     && this.acc2Slot.Equip)     this.acc2Slot.Equip(this);
	
	this.BalanceStats();
}

Entity.prototype.Strip = function() {
	// Remove all equipment (discards it completely and destroys it)
	this.weaponSlot   = null;
	this.topArmorSlot = null;
	this.botArmorSlot = null;
	this.acc1Slot     = null;
	this.acc2Slot     = null;

	this.strapOn      = null;
}

Entity.prototype.ItemUsable = function(item) {
	if(item.isTF)
		return false;
	return true;
}

Entity.prototype.ItemUse = function(item, backPrompt) {
	return {grab : false, consume : true};
}

Entity.prototype.Strapon = function() {
	return this.strapOn;
}

Entity.prototype.AddExp = function(exp, reserve) {
	var buff = this.combatStatus.stats[StatusEffect.Full];
	if(buff && buff.exp) {
		exp = Math.ceil(buff.exp * exp);
	}
	
	if(GetDEBUG()) {
		Text.NL();
		Text.Add("[reserve][name] gains [x] xp.", {reserve: reserve ? "RESERVE: " : "", name: this.name, x: exp}, 'bold');
		Text.NL();
		Text.Flush();
	}
	
	this.experience += exp;
	if(this.currentJob) {
		this.currentJob.AddExp(this, exp, reserve);
	}
	
	// Check for level up
	while(this.experience >= this.expToLevel) {
		this.experience        -= this.expToLevel;
		this.expToLevel         = Math.floor(this.expToLevel * 1.2);
		this.level++;
		this.pendingStatPoints += Stat.growthPointsPerLevel;
		
		this.SetLevelBonus();
		
		if(GetDEBUG()) {
			Text.NL();
			Text.Add("[reserve][name] gains a level! Now at [x].", {reserve: reserve ? "RESERVE: " : "", name: this.name, x: this.level}, 'bold');
			Text.NL();
			Text.Flush();
		}
	}
}

Entity.prototype.AddSexExp = function(sexp) {
	if(GetDEBUG()) {
		Text.NL();
		Text.Add("[name] gains [x] sex exp.", {name: this.name, x: sexp}, 'bold');
		Text.NL();
		Text.Flush();
	}
	
	this.sexperience += sexp;
	// Check for level up
	while(this.sexperience >= this.sexpToLevel) {
		this.sexperience       -= this.sexpToLevel;
		this.sexpToLevel        = Math.floor(this.sexpToLevel * 2);
		this.sexlevel++;
		//this.pendingStatPoints += 5;
		
		if(GetDEBUG()) {
			Text.NL();
			Text.Add("[name] gains a sex level! Now at [x].", {name: this.name, x: this.sexlevel}, 'bold');
			Text.NL();
			Text.Flush();
		}
	}
}

Entity.prototype.SetExpToLevel = function() {
	this.sexpToLevel  = this.SexpToLevel;
	this.expToLevel   = this.ExpToLevel;
	for(var i = 1; i < this.level; i++)
		this.expToLevel  = Math.floor(this.expToLevel * 1.2);
	for(var i = 1; i < this.sexlevel; i++)
		this.sexpToLevel = Math.floor(this.sexpToLevel * 2);
}

Entity.prototype.IsAtLocation = function(location) {
	return (this.location == location);
}

// Should return an array of drops (if any) in the form of {it: Item, num: amount}
Entity.prototype.DropTable = function() {
	return [];
}

Entity.prototype.Update = function(step) {
	if(step) {
		var time = new Time();
		time.Inc(step);
		
		var hours = time.ToHours();
		
		this.AddLustOverTime(hours);
		this.AccumulateCumOverTime(hours);
		this.LactationOverTime(hours);
		this.PregnancyOverTime(hours);
		this.HandleDrunknessOverTime(hours);
		this.HandleStretchOverTime(hours);
		
		this.combatStatus.Update(this, hours);
	}
}

Entity.prototype.HandleStretchOverTime = function(hours) {
	this.body.HandleStretchOverTime(hours);
}

//TODO
Entity.prototype.AccumulateCumOverTime = function(hours) {
	var balls = this.Balls();
	
	var inc = balls.cumProduction.Get() * hours;

	// Max out
	balls.cum.IncreaseStat(balls.CumCap(), inc);
}

Entity.prototype.MilkDrained = function() {
	this.lactHandler.MilkDrained();
	// TODO Output
}
Entity.prototype.MilkFull = function() {
	this.lactHandler.MilkFull();
}
Entity.prototype.MilkDrain = function(drain) {
	return this.LactHandler().MilkDrain(drain);
}
Entity.prototype.MilkDrainFraction = function(fraction) {
	return this.LactHandler().MilkDrainFraction(fraction);
}

Entity.prototype.LactHandler = function() {
	return this.lactHandler;
}

Entity.prototype.LactationOverTime = function(hours) {
	this.lactHandler.Update(hours);
}

Entity.prototype.PregHandler = function() {
	return this.pregHandler;
}

Entity.prototype.PregnancyOverTime = function(hours) {
	this.pregHandler.Update(hours);
}

Entity.prototype.PregnancyProgess = function(womb, slot, oldProgress, progress) {
}

Entity.prototype.PregnancyTrigger = function(womb, slot) {
	// Use unshift instead of push to make sure pregnancy doesn't interfere with scene progression
	Gui.Callstack.unshift(function() {
		womb.pregnant = false;
		
		if(GetDEBUG()) {
			var parse = {
				name : this.name
			};
			
			Text.Clear();
			Text.Add("PLACEHOLDER: [name] gave birth.", parse);
			Text.NL();
			Text.Flush();
			Gui.NextPrompt();
		}
	});
}

Entity.prototype.CanGiveBirth = function() {
	return true;
}

let DrunkLevel = {
	Sober   : 0.25,
	Tipsy   : 0.50,
	Sloshed : 0.75,
	Drunk   : 1.00
};

Entity.prototype.DrunkRecoveryRate = function() {
	var sta = this.Sta();
	if(sta < Math.E) sta = Math.E;
	return Math.log(sta) / 25;
}
Entity.prototype.HandleDrunknessOverTime = function(hours) {
	var oldLevel = this.drunkLevel;
	this.drunkLevel -= this.DrunkRecoveryRate() * hours;
	if(this.drunkLevel < 0) this.drunkLevel = 0;
}
Entity.prototype.Drunk = function() {
	return this.drunkLevel;
}
Entity.prototype.DrunkStr = function() {
	var parse = {
		name : this.NameDesc(),
		isAre : this.is()
	};
	if(this.drunkLevel > DrunkLevel.Drunk)
		return Text.Parse("[name] [isAre] passed out, dead drunk.", parse);
	if(this.drunkLevel > DrunkLevel.Sloshed)
		return Text.Parse("[name] [isAre] reeling, quite drunk.", parse);
	if(this.drunkLevel > DrunkLevel.Tipsy)
		return Text.Parse("[name] [isAre] tipsy, wobbling slighty.", parse);
	if(this.drunkLevel > DrunkLevel.Sober)
		return Text.Parse("[name] [isAre] feeling a bit tipsy.", parse);
	return false;
}
Entity.prototype.Drink = function(drink, suppressText) {
	var sta = this.Sta();
	if(sta < Math.E) sta = Math.E;
	var oldLevel = this.drunkLevel;
	this.drunkLevel += drink / Math.log(sta);
}
// TODO: Implement for companions
Entity.prototype.InnPrompt = function() {
	Text.Clear();
	Text.Add("[PLACEHOLDER]");
	Text.NL();
	Text.Flush();
	Gui.NextPrompt();
}

Entity.prototype.SetEyeColor = function(color) {
	this.body.head.eyes.color = color;
}
Entity.prototype.SetHairColor = function(color) {
	this.body.head.hair.color = color;
}
Entity.prototype.SetSkinColor = function(color) {
	this.body.torso.color = color;
}

Entity.prototype.DebugMode = function(debug) {
	var value = debug ? 50 : 0;
	
	this.maxHp.cheat        = value * 10;
	this.maxSp.cheat        = value * 10;
	this.maxLust.cheat      = value * 10;
	this.strength.cheat     = value;
	this.stamina.cheat      = value;
	this.dexterity.cheat    = value;
	this.intelligence.cheat = value;
	this.spirit.cheat       = value;
	this.libido.cheat       = value;
	this.charisma.cheat     = value;
	
	this.Equip();
	if(debug)
		this.RestFull();
}

export { Entity, DrunkLevel };
