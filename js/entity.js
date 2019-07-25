
// Basic game entity
// Enemies and player inherit from Entity

import { Stat } from './stat';
import { StatusList } from './statuslist';
import { Body } from './body/body';
import { PregnancyHandler } from './pregnancy';
import { LactationHandler } from './lactation';
import { AbilityCollection, DamageType } from './ability';
import { GetDEBUG } from '../app';
import { EntityCombat } from './entity-combat';
import { EntityMenu } from './entity-menu';
import { EntitySave } from './entity-save';
import { EntityDict } from './entity-dict';
import { EntityDesc, LowerBodyType } from './entity-desc';
import { EntityGrammar } from './entity-grammar';
import { EntitySex } from './entity-sex';
import { Time } from './time';

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

/* COMBAT RELATED FUNTIONS */
Entity.prototype.Act = EntityCombat.Act;
Entity.prototype.FinishCastInternal = EntityCombat.FinishCastInternal;
Entity.prototype.CanBeInterrupted = EntityCombat.CanBeInterrupted;
Entity.prototype.GetCombatEntry = EntityCombat.GetCombatEntry;
Entity.prototype.GetPartyTarget = EntityCombat.GetPartyTarget;
Entity.prototype.GetSingleTarget = EntityCombat.GetSingleTarget;
Entity.prototype.HP = EntityCombat.HP;
Entity.prototype.SP = EntityCombat.SP;
Entity.prototype.Lust = EntityCombat.Lust;
Entity.prototype.MinLust = EntityCombat.MinLust;
Entity.prototype.Str = EntityCombat.Str;
Entity.prototype.Sta = EntityCombat.Sta;
Entity.prototype.Dex = EntityCombat.Dex;
Entity.prototype.Int = EntityCombat.Int;
Entity.prototype.Spi = EntityCombat.Spi;
Entity.prototype.Lib = EntityCombat.Lib;
Entity.prototype.Cha = EntityCombat.Cha;
Entity.prototype.Incapacitated = EntityCombat.Incapacitated;
Entity.prototype.Inhibited = EntityCombat.Inhibited;
Entity.prototype.AddHPFraction = EntityCombat.AddHPFraction;
Entity.prototype.AddSPFraction = EntityCombat.AddSPFraction;
Entity.prototype.AddLustFraction = EntityCombat.AddLustFraction;
Entity.prototype.PhysDmgHP = EntityCombat.PhysDmgHP;
Entity.prototype.AddHPAbs = EntityCombat.AddHPAbs;
Entity.prototype.AddSPAbs = EntityCombat.AddSPAbs;
Entity.prototype.AddLustAbs = EntityCombat.AddLustAbs;
Entity.prototype.RestFull = EntityCombat.RestFull;
Entity.prototype.Sleep = EntityCombat.Sleep;
Entity.prototype.HPLevel = EntityCombat.HPLevel;
Entity.prototype.SPLevel = EntityCombat.SPLevel;
Entity.prototype.LustLevel = EntityCombat.LustLevel;
Entity.prototype.ClearCombatBonuses = EntityCombat.ClearCombatBonuses;
Entity.prototype.BalanceStats = EntityCombat.BalanceStats;
Entity.prototype.AddLustOverTime = EntityCombat.AddLustOverTime;
Entity.prototype.LustCombatEfficiencyLevel = EntityCombat.LustCombatEfficiencyLevel;
Entity.prototype.LustCombatTurnLossChance = EntityCombat.LustCombatTurnLossChance;
Entity.prototype.Initiative = EntityCombat.Initiative;
Entity.prototype.PAttack = EntityCombat.PAttack;
Entity.prototype.PDefense = EntityCombat.PDefense;
Entity.prototype.PHit = EntityCombat.PHit;
Entity.prototype.PEvade = EntityCombat.PEvade;
Entity.prototype.MAttack = EntityCombat.MAttack;
Entity.prototype.MDefense = EntityCombat.MDefense;
Entity.prototype.MHit = EntityCombat.MHit;
Entity.prototype.MEvade = EntityCombat.MEvade;
Entity.prototype.LAttack = EntityCombat.LAttack;
Entity.prototype.LDefense = EntityCombat.LDefense;
Entity.prototype.LHit = EntityCombat.LHit;
Entity.prototype.LEvade = EntityCombat.LEvade;
Entity.prototype.Resistance = EntityCombat.Resistance;
Entity.prototype.AddResistanceWear = EntityCombat.AddResistanceWear;

/* ENTITY MENU */
Entity.prototype.InteractDefault = EntityMenu.InteractDefault;
Entity.prototype.LevelUpPrompt = EntityMenu.LevelUpPrompt;
Entity.prototype.EquipPrompt = EntityMenu.EquipPrompt;
Entity.prototype.JobPrompt = EntityMenu.JobPrompt;

/* ENTITY SAVE */
Entity.prototype.SaveSexFlags = EntitySave.SaveSexFlags;
Entity.prototype.SaveCombatStats = EntitySave.SaveCombatStats;
Entity.prototype.SaveStatusEffects = EntitySave.SaveStatusEffects;
Entity.prototype.SavePersonalityStats = EntitySave.SavePersonalityStats;
Entity.prototype.SaveFlags = EntitySave.SaveFlags;
Entity.prototype.SavePerks = EntitySave.SavePerks;
Entity.prototype.SaveRecipes = EntitySave.SaveRecipes;
Entity.prototype.SaveJobs = EntitySave.SaveJobs;
Entity.prototype.SaveEquipment = EntitySave.SaveEquipment;
Entity.prototype.SavePregnancy = EntitySave.SavePregnancy;
Entity.prototype.SaveLactation = EntitySave.SaveLactation;
Entity.prototype.SaveBodyPartial = EntitySave.SaveBodyPartial;
Entity.prototype.ToStorage = EntitySave.ToStorage;
Entity.prototype.LoadCombatStats = EntitySave.LoadCombatStats;
Entity.prototype.LoadStatusEffects = EntitySave.LoadStatusEffects;
Entity.prototype.LoadPersonalityStats = EntitySave.LoadPersonalityStats;
Entity.prototype.LoadRecipes = EntitySave.LoadRecipes;
Entity.prototype.LoadJobs = EntitySave.LoadJobs;
Entity.prototype.LoadEquipment = EntitySave.LoadEquipment;
Entity.prototype.LoadFlags = EntitySave.LoadFlags;
Entity.prototype.LoadSexFlags = EntitySave.LoadSexFlags;
Entity.prototype.LoadPerks = EntitySave.LoadPerks;
Entity.prototype.LoadPregnancy = EntitySave.LoadPregnancy;
Entity.prototype.LoadLactation = EntitySave.LoadLactation;
Entity.prototype.FromStorage = EntitySave.FromStorage;
Entity.prototype.RecallAbilities = EntitySave.RecallAbilities;

/* ENTITY DICT */
Entity.prototype.UniqueId = EntityDict.UniqueId;
Entity.IdToEntity = EntityDict.IdToEntity;

/* ENTITY DESC */
Entity.prototype.PrintDescription = EntityDesc.PrintDescription;

// TODO: affect with lust/perks?
Entity.prototype.SubDom = function() {
	return this.subDom.Get();
}
Entity.prototype.Relation = function() {
	return this.relation.Get();
}
Entity.prototype.Slut = function() {
	return this.slut.Get();
}

Entity.prototype.Gender = function() {
	return this.body.Gender();
}
Entity.prototype.Race = function() {
	return this.body.torso.race;
}

Entity.prototype.MuscleTone = function() {
	return this.body.muscleTone.Get();
}
Entity.prototype.BodyMass = function() {
	return this.body.bodyMass.Get();
}

Entity.prototype.Height = function() {
	return this.body.height.Get();
}
Entity.prototype.Weigth = function() {
	return this.body.weigth.Get();
}

Entity.prototype.Humanity = function() {
	var racescore = new RaceScore(this.body);
	var humanScore = new RaceScore();
	humanScore.score[Race.Human.id] = 1;
	return racescore.Compare(humanScore);
}
Entity.prototype.RaceCompare = function(race) {
	var racescore = new RaceScore(this.body);
	return racescore.SumScore(race);
}
Entity.prototype.Femininity = function() {
	return this.body.femininity.Get();
}
Entity.prototype.FaceDesc = function() {
	return this.body.FaceDesc();
}
Entity.prototype.SkinDesc = function() {
	return this.body.SkinDesc();
}
Entity.prototype.SkinType = function() {
	return this.body.torso.race;
}
Entity.prototype.LipsDesc = function() {
	return this.body.LipsDesc();
}
Entity.prototype.TongueDesc = function() {
	return this.body.TongueDesc();
}
Entity.prototype.TongueTipDesc = function() {
	return this.body.TongueTipDesc();
}
Entity.prototype.LongTongue = function() {
	return this.body.LongTongue();
}
Entity.prototype.Hair = function() {
	return this.body.head.hair;
}
Entity.prototype.HasHair = function() {
	return this.body.head.hair.Bald() == false;
}
Entity.prototype.HasLongHair = function() {
	return this.body.head.hair.Bald() == false; //TODO
}
Entity.prototype.Face = function() {
	return this.body.head;
}
Entity.prototype.Mouth = function() {
	return this.body.head.mouth;
}
Entity.prototype.Tongue = function() {
	return this.body.head.mouth.tongue;
}
Entity.prototype.Eyes = function() {
	return this.body.head.eyes;
}
Entity.prototype.EyeDesc = function() {
	return this.body.EyeDesc();
}
Entity.prototype.Ears = function() {
	return this.body.head.ears;
}
Entity.prototype.EarDesc = function() {
	return this.body.EarDesc();
}
Entity.prototype.HasFlexibleEars = function() {
	return this.body.HasFlexibleEars();
}
Entity.prototype.HasMuzzle = function() {
	return this.body.HasMuzzle();
}
Entity.prototype.HasLongSnout = function() {
	return this.body.HasLongSnout();
}
Entity.prototype.Arms = function() {
	return this.body.arms;
}
Entity.prototype.MultiArm = function() {
	return this.body.arms.count > 2;
}
Entity.prototype.Legs = function() {
	return this.body.legs;
}
Entity.prototype.LowerBodyType = function() {
	if     (this.body.legs.count <  2) return LowerBodyType.Single;
	else if(this.body.legs.count == 2) return LowerBodyType.Humanoid;
	else                               return LowerBodyType.Taur;
}
Entity.prototype.NumLegs = function() {
	return this.body.legs.count;
}
Entity.prototype.Humanoid = function() {
	return this.LowerBodyType() == LowerBodyType.Humanoid;
}
Entity.prototype.HasLegs = function() {
	return (this.body.legs.count >= 2);
}
Entity.prototype.IsNaga = function() {
	return (this.body.legs.count < 2) &&
		(this.body.legs.race.isRace(Race.Snake));
}
Entity.prototype.IsTaur = function() {
	return this.LowerBodyType() == LowerBodyType.Taur;
}
Entity.prototype.IsGoo = function() {
	return (this.body.legs.race.isRace(Race.Goo));
}
Entity.prototype.IsFlexible = function() {
	return this.body.IsFlexible(); //TODO Perks
}
Entity.prototype.Butt = function() {
	return this.body.ass;
}
Entity.prototype.HasBalls = function() {
	return this.Balls().count.Get() > 0;
}
Entity.prototype.Balls = function() {
	return this.body.balls;
}
Entity.prototype.BallsDesc = function() {
	return this.Balls().Short();
}
Entity.prototype.Virility = function() {
	return this.body.balls.fertility.Get();
}
Entity.prototype.HasFur = function() {
	return this.body.HasFur();
}
Entity.prototype.HasSkin = function() {
	return this.body.HasSkin();
}
Entity.prototype.HasScales = function() {
	return this.body.HasScales();
}

Entity.prototype.LactationDesc = function(parse) {
	
}
Entity.prototype.StomachDesc = function() {
	var bellysize = this.pregHandler.BellySize();
	return this.body.StomachDesc(bellysize);
}
Entity.prototype.HipDesc = function() {
	return this.body.HipsDesc();
}
Entity.prototype.HipsDesc = function() {
	return this.body.HipsDesc(true);
}
Entity.prototype.HipSize = function() {
	return this.body.HipSize();
}
// TODO
Entity.prototype.ArmDesc = function() {
	return this.body.ArmDesc();
}
Entity.prototype.HandDesc = function() {
	return this.body.HandDesc();
}
Entity.prototype.PalmDesc = function() {
	return this.body.PalmDesc();
}
Entity.prototype.LegDesc = function() {
	return this.body.LegDesc();
}
Entity.prototype.LegsDesc = function() {
	return this.body.LegsDesc();
}
Entity.prototype.ThighDesc = function() {
	return this.body.ThighDesc();
}
Entity.prototype.ThighsDesc = function() {
	return this.body.ThighsDesc();
}
Entity.prototype.KneeDesc = function() {
	return this.body.KneesDesc();
}
Entity.prototype.KneesDesc = function() {
	return this.body.KneesDesc(true);
}
Entity.prototype.FeetDesc = function() {
	return this.body.FeetDesc();
}
Entity.prototype.FootDesc = function() {
	return this.body.FootDesc();
}
Entity.prototype.Appendages = function() {
	return this.body.head.appendages;
}
Entity.prototype.HasNightvision = function() {
	return this.body.HasNightvision();
}
Entity.prototype.HasHorns = function() {
	for(var i = 0; i < this.body.head.appendages.length; i++)
		if(this.body.head.appendages[i].type == AppendageType.horn)
			return this.body.head.appendages[i];
	return null;
}
Entity.prototype.HasAntenna = function() {
	for(var i = 0; i < this.body.head.appendages.length; i++)
		if(this.body.head.appendages[i].type == AppendageType.antenna)
			return this.body.head.appendages[i];
	return null;
}
Entity.prototype.Back = function() {
	return this.body.backSlots;
}
Entity.prototype.HasTail = function() {
	for(var i = 0; i < this.body.backSlots.length; i++)
		if(this.body.backSlots[i].type == AppendageType.tail)
			return this.body.backSlots[i];
	return null;
}
Entity.prototype.HasPrehensileTail = function() {
	var found = false;
	for(var i = 0; i < this.body.backSlots.length; i++)
		if(this.body.backSlots[i].type == AppendageType.tail)
			found = found || this.body.backSlots[i].Prehensile();
	return found;
}
Entity.prototype.HasWings = function() {
	for(var i = 0; i < this.body.backSlots.length; i++)
		if(this.body.backSlots[i].type == AppendageType.wing)
			return this.body.backSlots[i];
	return null;
}
Entity.prototype.NumAttributes = function(race) {
	return this.body.NumAttributes(race);
}

// TODO
Entity.prototype.Weapon = function() {
	return this.weaponSlot;
}
// TODO
Entity.prototype.WeaponDesc = function() {
	return this.weaponSlot ? this.weaponSlot.sDesc() : "stick";
}
// TODO
Entity.prototype.WeaponDescLong = function() {
	return this.weaponSlot ? this.weaponSlot.lDesc() : "a stick";
}
// TODO
Entity.prototype.Armor = function() {
	return this.topArmorSlot;
}
// TODO
Entity.prototype.LowerArmor = function() {
	return this.botArmorSlot;
}
// TODO
Entity.prototype.LowerArmorDesc = function() {
	return this.botArmorSlot ? this.botArmorSlot.sDesc() : this.ArmorDesc();
}
// TODO
Entity.prototype.LowerArmorDescLong = function() {
	return this.botArmorSlot ? this.botArmorSlot.lDesc() : this.ArmorDescLong();
}
// TODO
Entity.prototype.ArmorDesc = function() {
	return this.topArmorSlot ? this.topArmorSlot.sDesc() : "comfortable clothes";
}
Entity.prototype.ArmorDescLong = function() {
	return this.topArmorSlot ? this.topArmorSlot.lDesc() : "a set of comfortable clothes";
}
Entity.prototype.Accessories = function() {
	return [this.acc1Slot, this.acc2Slot];
}

/* ENTITY GRAMMAR */
Entity.prototype.nameDesc = EntityGrammar.nameDesc;
Entity.prototype.NameDesc = EntityGrammar.NameDesc;
Entity.prototype.possessive = EntityGrammar.possessive;
Entity.prototype.Possessive = EntityGrammar.Possessive;
Entity.prototype.possessivePlural = EntityGrammar.possessivePlural;
Entity.prototype.PossessivePlural = EntityGrammar.PossessivePlural;
Entity.prototype.heshe = EntityGrammar.heshe;
Entity.prototype.HeShe = EntityGrammar.HeShe;
Entity.prototype.himher = EntityGrammar.himher;
Entity.prototype.HimHer = EntityGrammar.HimHer;
Entity.prototype.hisher = EntityGrammar.hisher;
Entity.prototype.HisHer = EntityGrammar.HisHer;
Entity.prototype.hishers = EntityGrammar.hishers;
Entity.prototype.has = EntityGrammar.has;
Entity.prototype.is = EntityGrammar.is;
Entity.prototype.plural = EntityGrammar.plural;
Entity.prototype.mfFem = EntityGrammar.mfFem;
Entity.prototype.mfTrue = EntityGrammar.mfTrue;
Entity.prototype.ParserPronouns = EntityGrammar.ParserPronouns;
Entity.prototype.ParserTags = EntityGrammar.ParserTags;
Entity.prototype.toString = EntityGrammar.toString;
Entity.prototype.Appearance = EntityGrammar.Appearance;

/* ENTITY SEX */
Entity.prototype.Genitalia = EntitySex.Genitalia;
Entity.prototype.VagCap = EntitySex.VagCap;
Entity.prototype.OralCap = EntitySex.OralCap;
Entity.prototype.AnalCap = EntitySex.AnalCap;
Entity.prototype.ResetVirgin = EntitySex.ResetVirgin;
Entity.prototype.NumCocks = EntitySex.NumCocks;
Entity.prototype.FirstCock = EntitySex.FirstCock;
Entity.prototype.FirstClitCockIdx = EntitySex.FirstClitCockIdx;
Entity.prototype.BiggestCock = EntitySex.BiggestCock;
Entity.prototype.CocksThatFit = EntitySex.CocksThatFit;
Entity.prototype.AllCocksCopy = EntitySex.AllCocksCopy;
Entity.prototype.AllCocks = EntitySex.AllCocks;
Entity.prototype.MultiCockDesc = EntitySex.MultiCockDesc;
Entity.prototype.NumVags = EntitySex.NumVags;
Entity.prototype.FirstVag = EntitySex.FirstVag;
Entity.prototype.VagsThatFit = EntitySex.VagsThatFit;
Entity.prototype.AllVags = EntitySex.AllVags;
Entity.prototype.UnfertilezedWomb = EntitySex.UnfertilezedWomb;
Entity.prototype.NumBreastRows = EntitySex.NumBreastRows;
Entity.prototype.FirstBreastRow = EntitySex.FirstBreastRow;
Entity.prototype.AllBreastRows = EntitySex.AllBreastRows;
Entity.prototype.BiggestBreasts = EntitySex.BiggestBreasts;
Entity.prototype.SmallestBreasts = EntitySex.SmallestBreasts;
Entity.prototype.BiggestNips = EntitySex.BiggestNips;
Entity.prototype.SmallestNips = EntitySex.SmallestNips;
Entity.prototype.NipplesThatFitLen = EntitySex.NipplesThatFitLen;
Entity.prototype.AllOrfices = EntitySex.AllOrfices;
Entity.prototype.AllPenetrators = EntitySex.AllPenetrators;
Entity.prototype.Lactation = EntitySex.Lactation;
Entity.prototype.Milk = EntitySex.Milk;
Entity.prototype.MilkCap = EntitySex.MilkCap;
Entity.prototype.LactationProgress = EntitySex.LactationProgress;
Entity.prototype.Fuck = EntitySex.Fuck;
Entity.prototype.FuckOral = EntitySex.FuckOral;
Entity.prototype.FuckAnal = EntitySex.FuckAnal;
Entity.prototype.FuckVag = EntitySex.FuckVag;
Entity.prototype.Sexed = EntitySex.Sexed;
Entity.prototype.RestoreCum = EntitySex.RestoreCum;
Entity.prototype.Cum = EntitySex.Cum;
Entity.prototype.CumOutput = EntitySex.CumOutput;
Entity.prototype.OrgasmCum = EntitySex.OrgasmCum;

export { Entity, DrunkLevel };
