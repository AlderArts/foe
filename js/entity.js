
// Basic game entity
// Enemies and player inherit from Entity

function Stat(base) {
	this.base   = base || 0; // Base stat, increased by levelling and TFs
	this.bonus  = 0; // Bonuses got by equipment/auras/perks etc
	this.level  = 0; // Bonuses got from levels
	this.temp   = 0; // Bonuses or penalties that are cleared after end of each combat
	this.cheat  = 0; // Bonuses got by DEBUG flag etc
	this.growth = 1;
	this.debug  = null;
}
Stat.prototype.Get = function() { return this.base + this.bonus + this.level + this.temp + this.cheat; }
Stat.prototype.Clear = function() { this.bonus = 0; this.temp = 0; }
Stat.prototype.GrowthRank = function() { return Math.floor((this.growth * 10) - 9); }
// Changes _ONE_ stat, closing in on the ideal
// Cap the change to a maximum value
// Returns the applied difference, unless the diff is zero
Stat.prototype.IdealStat = function(ideal, maxChange) {
	maxChange = maxChange || 1;
	if(ideal) {
		var diff = ideal - this.base;
		if(diff < 0) maxChange *= -1;
		diff = (Math.abs(diff) <= Math.abs(maxChange)) ? diff : maxChange;
		
		var old = this.base;
		this.base += diff;
		if(DEBUG && this.debug && diff != 0) {
			Text.Newline();
			if(diff > 0)
				Text.AddOutput(Text.BoldColor("DEBUG: " + this.debug() + " " + old + " -> " + this.base, "blue"));
			else
				Text.AddOutput(Text.BoldColor("DEBUG: " + this.debug() + " " + old + " -> " + this.base, "red"));
			Text.Newline();
		}
		
		return Math.floor(this.base) - Math.floor(old);
	}
}
// Changes _ONE_ stat, closing in on the ideal (ONLY INC)
// Cap the change to a maximum value
// Returns the applied difference (positive), unless the diff is zero
Stat.prototype.IncreaseStat = function(ideal, maxChange) {
	maxChange = maxChange || 1;
	if(ideal) {
		var diff = ideal - this.base;
		if(diff <= 0) return null;
		diff = (diff <= maxChange) ? diff : maxChange;
		
		var old = this.base;
		this.base += diff;
		if(DEBUG && this.debug) {
			Text.Newline();
			Text.AddOutput(Text.BoldColor("DEBUG: " + this.debug() + " " + old + " -> " + this.base, "blue"));
			Text.Newline();
		}
		
		return Math.floor(this.base) - Math.floor(old);
	}
}
// Changes _ONE_ stat, closing in on the ideal (ONLY DEC)
// Cap the change to a maximum value
// Returns the applied difference (positive), unless the diff is zero
Stat.prototype.DecreaseStat = function(ideal, maxChange) {
	maxChange = maxChange || 1;
	if(ideal) {
		var diff = this.base - ideal;
		if(diff <= 0) return null; 
		diff = (diff <= maxChange) ? diff : maxChange;
		
		var old = this.base;
		this.base -= diff;
		if(DEBUG && this.debug) {
			Text.Newline();
			Text.AddOutput(Text.BoldColor("DEBUG: " + this.debug() + " " + old + " -> " + this.base, "red"));
			Text.Newline();
		}
		
		return Math.floor(this.base) - Math.floor(old);
	}
}

var growthPerPoint = 0.1;
var growthPointsPerLevel = 3;

// TODO: Should have shared features, such as combat stats. Body representation
function Entity() {
	// Names and grammar
	this.name         = "ENTITY";
	this.monsterName  = undefined;
	this.MonsterName  = undefined;
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
	this.expToLevel        = 15;
	// Sexperience is gained by having sex
	// Sex leves reward sex perks and skills, and affect sexual based bonuses
	this.sexperience  = 0;
	this.sexlevel     = 1;
	this.sexpToLevel  = 30;
	
	// Base stats
	var that = this;
	
	// Health stat and functions
	this.curHp        = 0;
	this.maxHp        = new Stat(10); this.maxHp.growth        = 10;
	this.maxHp.debug = function() { return that.name + ".maxHp"; }
	// SP
	this.curSp        = 0;
	this.maxSp        = new Stat(10); this.maxSp.growth        = 5;
	this.maxSp.debug = function() { return that.name + ".maxSp"; }

	// Lust stat and functions
	this.curLust      = 0;
	this.maxLust      = new Stat(10); this.maxLust.growth      = 5;
	this.maxLust.debug = function() { return that.name + ".maxLust"; }
	
	// Main stats
	this.strength     = new Stat(0); this.strength.growth     = 1;
	this.strength.debug = function() { return that.name + ".strength"; }
	this.stamina      = new Stat(0); this.stamina.growth      = 1;
	this.stamina.debug = function() { return that.name + ".stamina"; }
	this.dexterity    = new Stat(0); this.dexterity.growth    = 1;
	this.dexterity.debug = function() { return that.name + ".dexterity"; }
	this.intelligence = new Stat(0); this.intelligence.growth = 1;
	this.intelligence.debug = function() { return that.name + ".intelligence"; }
	this.spirit       = new Stat(0); this.spirit.growth       = 1;
	this.spirit.debug = function() { return that.name + ".spirit"; }
	this.libido       = new Stat(0); this.libido.growth       = 1;
	this.libido.debug = function() { return that.name + ".libido"; }
	this.charisma     = new Stat(0); this.charisma.growth     = 1;
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
	
	// Body representation
	this.body         = new Body(this.name);
	
	this.drunkLevel   = 0.0;
	
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
	
	this.effects = [];
	this.aggro   = [];
	
	// Personality stats
	this.subDom   = new Stat(0); // sub = low, dom = high
	this.subDom.debug = function() { return that.name + ".subDom"; }
	this.slut     = new Stat(0);
	this.slut.debug = function() { return that.name + ".slut"; }
	this.relation = new Stat(0);
	this.relation.debug = function() { return that.name + ".relation"; }
}

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

Entity.prototype.SaveSexStats = function() {
	var sex = {};
	if(this.sex.rBlow != 0) sex.rBlow = this.sex.rBlow;
	if(this.sex.gBlow != 0) sex.gBlow = this.sex.gBlow;
	if(this.sex.rCunn != 0) sex.rCunn = this.sex.rCunn;
	if(this.sex.gCunn != 0) sex.gCunn = this.sex.gCunn;
	if(this.sex.rAnal != 0) sex.rAnal = this.sex.rAnal;
	if(this.sex.gAnal != 0) sex.gAnal = this.sex.gAnal;
	if(this.sex.rVag  != 0) sex.rVag  = this.sex.rVag;
	if(this.sex.gVag  != 0) sex.gVag  = this.sex.gVag;
	if(this.sex.sired != 0) sex.sired = this.sex.sired;
	if(this.sex.birth != 0) sex.birth = this.sex.birth;
	return sex;
}

// Convert to a format easy to write to/from memory
Entity.prototype.ToStorage = function() {
	var storage = {
		name    : this.name,
		exp     : this.experience,
		points  : this.pendingStatPoints,
		exp2lvl : this.expToLevel,
		lvl     : this.level,
		sexp    : this.sexperience,
		sxp2lvl : this.sexpToLevel,
		slvl    : this.sexlevel,
		alvl    : this.alchemyLevel,
		curHp   : this.curHp,
		maxHp   : this.maxHp.base,
		curSp   : this.curSp,
		maxSp   : this.maxSp.base,
		curLust : this.curLust,
		maxLust : this.maxLust.base,
		// Main stats
		str     : this.strength.base,
		sta     : this.stamina.base,
		dex     : this.dexterity.base,
		inte    : this.intelligence.base,
		spi     : this.spirit.base,
		lib     : this.libido.base,
		cha     : this.charisma.base,
		// Growth
		maxHpG   : this.maxHp.growth,
		maxSpG   : this.maxSp.growth,
		maxLustG : this.maxLust.growth,
		strG     : this.strength.growth,
		staG     : this.stamina.growth,
		dexG     : this.dexterity.growth,
		inteG    : this.intelligence.growth,
		spiG     : this.spirit.growth,
		libG     : this.libido.growth,
		chaG     : this.charisma.growth
	};
	
	// Personality stats
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	if(this.drunkLevel    != 0) storage.drunk  = this.drunkLevel;
	
	if(this.recipes) {
		storage.recipes = [];
		for(var i = 0; i < this.recipes.length; i++)
			storage.recipes.push(this.recipes[i].id);
	}
	
	if(this.effects) {
		storage.effects = [];
		for(var i = 0; i < this.effects.length; i++)
			storage.effects.push(this.effects[i].ToStorage());
	}
	
	storage.jobs = {};
	for(var job in this.jobs) {
		var jd = this.jobs[job];
		var jobStorage = jd.ToStorage();
		if(jobStorage)
			storage.jobs[job] = jobStorage;
	}
	if(this.currentJob)
		storage.curJob = this.currentJob.name;
	
	// Equipment
	if(this.weaponSlot)   storage.wep    = this.weaponSlot.id;
	if(this.topArmorSlot) storage.toparm = this.topArmorSlot.id;
	if(this.botArmorSlot) storage.botarm = this.botArmorSlot.id;
	if(this.acc1Slot)     storage.acc1   = this.acc1Slot.id;
	if(this.acc2Slot)     storage.acc2   = this.acc2Slot.id;
	
	if(this.strapOn)      storage.toy    = this.strapOn.id;
	
	storage.flags = this.flags;
	storage.sex   = this.SaveSexStats();
	
	if(this.monsterName) storage.mName = this.monsterName;
	if(this.MonsterName) storage.MName = this.MonsterName;
	
	storage.body = this.body.ToStorage();
	
	// TODO
	/*
	// Timers, updated in Update()
	// Timers should be in the format {timer: 10, callback: function() {}}
	// Where timer = 10 is the amount of ticks until the timer runs out, and
	// callback is the function to call (use closures)
	this.timers = new Array();
	*/	
	return storage;
}

Entity.prototype.FromStorage = function(storage) {
	this.name              = storage.name  || this.name;
	this.monsterName       = storage.mName || this.monsterName;
	this.MonsterName       = storage.MName || this.MonsterName;
	
	this.experience        = parseInt(storage.exp)     || this.experience;
	this.level             = parseInt(storage.lvl)     || this.level;
	this.pendingStatPoints = parseInt(storage.points)  || this.pendingStatPoints;
	this.expToLevel        = parseInt(storage.exp2lvl) || this.expToLevel;
	this.sexperience       = parseInt(storage.sexp)    || this.sexperience;
	this.sexpToLevel       = parseInt(storage.sxp2lvl) || this.sexpToLevel;
	this.sexlevel          = parseInt(storage.slvl)    || this.sexlevel;
	this.alchemyLevel      = parseInt(storage.alvl)    || this.alchemyLevel;
	this.curHp             = parseFloat(storage.curHp)   || this.curHp;
	this.maxHp.base        = parseFloat(storage.maxHp)   || this.maxHp.base;
	this.curSp             = parseFloat(storage.curSp)   || this.curSp;
	this.maxSp.base        = parseFloat(storage.maxSp)   || this.maxSp.base;
	this.curLust           = parseFloat(storage.curLust) || this.curLust;
	this.maxLust.base      = parseFloat(storage.maxLust) || this.maxLust.base;
	// Main stats
	this.strength.base     = parseFloat(storage.str)     || this.strength.base;
	this.stamina.base      = parseFloat(storage.sta)     || this.stamina.base;
	this.dexterity.base    = parseFloat(storage.dex)     || this.dexterity.base;
	this.intelligence.base = parseFloat(storage.inte)    || this.intelligence.base;
	this.spirit.base       = parseFloat(storage.spi)     || this.spirit.base;
	this.libido.base       = parseFloat(storage.lib)     || this.libido.base;
	this.charisma.base     = parseFloat(storage.cha)     || this.charisma.base;
	// Growth
	this.maxHp.growth        = parseFloat(storage.maxHpG)   || this.maxHp.growth;
	this.maxSp.growth        = parseFloat(storage.maxSpG)   || this.maxSp.growth;
	this.maxLust.growth      = parseFloat(storage.maxLustG) || this.maxLust.growth;
	this.strength.growth     = parseFloat(storage.strG)     || this.strength.growth;
	this.stamina.growth      = parseFloat(storage.staG)     || this.stamina.growth;
	this.dexterity.growth    = parseFloat(storage.dexG)     || this.dexterity.growth;
	this.intelligence.growth = parseFloat(storage.inteG)    || this.intelligence.growth;
	this.spirit.growth       = parseFloat(storage.spiG)     || this.spirit.growth;
	this.libido.growth       = parseFloat(storage.libG)     || this.libido.growth;
	this.charisma.growth     = parseFloat(storage.chaG)     || this.charisma.growth;
	
	// Personality stats
	this.subDom.base         = parseFloat(storage.subDom)  || this.subDom.base;
	this.slut.base           = parseFloat(storage.slut)    || this.slut.base;
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	this.drunkLevel          = parseFloat(storage.drunk)   || this.drunkLevel;
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
	for(var flag in storage.sex)
		this.sex[flag] = parseInt(storage.sex[flag]);
	
	if(storage.recipes) {
		this.recipes = [];
		for(var i = 0; i < storage.recipes.length; i++)
			this.recipes.push(ItemIds[storage.recipes[i]]);
	}
	
	if(storage.effects) {
		this.effects = [];
		for(var i = 0; i < storage.effects.length; i++) {
			this.effects.push(EffectFromStorage(storage.effects[i]));
		}
	}
	
	if(storage.jobs) {
		for(job in this.jobs) {
			var jd = this.jobs[job];
			jd.FromStorage(storage.jobs[jd.job.name]);
		}
	}
	if(storage.curJob)
		this.currentJob = Jobs[storage.curJob];
	
	if(storage.wep)    this.weaponSlot   = ItemIds[storage.wep];
	if(storage.toparm) this.topArmorSlot = ItemIds[storage.toparm];
	if(storage.botarm) this.botArmorSlot = ItemIds[storage.botarm];
	if(storage.acc1)   this.acc1Slot     = ItemIds[storage.acc1];
	if(storage.acc2)   this.acc2Slot     = ItemIds[storage.acc2];
	
	if(storage.toy)    this.strapOn      = ItemIds[storage.toy];
	
	if(storage.body) {
		this.body = new Body();
		this.body.FromStorage(storage.body);
	}
	
	this.RecallAbilities(); // TODO: Implement for special abilitiy sources (flag dependent)
	this.SetLevelBonus();
	this.Equip();
	
	// TODO
	/*	
	// Timers, updated in Update()
	// Timers should be in the format {timer: 10, callback: function() {}}
	// Where timer = 10 is the amount of ticks until the timer runs out, and
	// callback is the function to call (use closures)
	this.timers = new Array();
	*/
}

Entity.prototype.RecallAbilities = function() {
	for(job in this.jobs) {
		var jd = this.jobs[job];
		for(var i = 0; i < jd.level - 1; i++) {
			if(i >= jd.job.levels.length) break;
			var skills = jd.job.levels[i].skills;
			// Teach new skills
			if(skills) {
				// [ { ab: Ablities.Black.Fireball, set: "Spells" }, ... ]
				for(var j = 0; j < skills.length; j++) {
					var sd      = skills[j];
					var ability = sd.ab;
					var set     = sd.set;
					this.abilities[set].AddAbility(ability);
				}
			}
		}
	}
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
	
	if(this.weaponSlot   && this.weaponSlot.Equip)   this.weaponSlot.Equip(this);
	if(this.topArmorSlot && this.topArmorSlot.Equip) this.topArmorSlot.Equip(this);
	if(this.botArmorSlot && this.botArmorSlot.Equip) this.botArmorSlot.Equip(this);
	if(this.acc1Slot     && this.acc1Slot.Equip)     this.acc1Slot.Equip(this);
	if(this.acc2Slot     && this.acc2Slot.Equip)     this.acc2Slot.Equip(this);
	
	this.BalanceStats();
}

Entity.prototype.AddExp = function(exp) {
	if(DEBUG) {
		Text.NL();
		Text.Add(Text.BoldColor("[name] gains [x] xp."), {name: this.name, x: exp});
		Text.NL();
		Text.Flush();
	}
	
	this.experience += exp;
	if(this.currentJob) {
		this.currentJob.AddExp(this, exp);
	}
	
	// Check for level up
	while(this.experience >= this.expToLevel) {
		this.experience        -= this.expToLevel;
		this.expToLevel        *= 1.2;
		this.level++;
		this.pendingStatPoints += growthPointsPerLevel;
		
		this.SetLevelBonus();
		
		if(DEBUG) {
			Text.NL();
			Text.Add(Text.BoldColor("[name] gains a level! Now at [x]."), {name: this.name, x: this.level});
			Text.NL();
			Text.Flush();
		}
	}
}

Entity.prototype.AddSexExp = function(sexp) {
	if(DEBUG) {
		Text.NL();
		Text.Add(Text.BoldColor("[name] gains [x] sex exp."), {name: this.name, x: sexp});
		Text.NL();
		Text.Flush();
	}
	
	this.sexperience += sexp;
	// Check for level up
	while(this.sexperience >= this.sexpToLevel) {
		this.sexperience       -= this.sexpToLevel;
		this.sexpToLevel       *= 2;
		this.sexlevel++;
		//this.pendingStatPoints += 5;
		
		if(DEBUG) {
			Text.NL();
			Text.Add(Text.BoldColor("[name] gains a sex level! Now at [x]."), {name: this.name, x: this.sexlevel});
			Text.NL();
			Text.Flush();
		}
	}
}

Entity.prototype.IsAtLocation = function(location) {
	return (this.location == location);
}

Entity.prototype.HP = function() {
	return Math.floor(this.maxHp.Get() + Math.pow((this.strength.Get() + this.stamina.Get())/2, 1.3));
}

Entity.prototype.SP = function() {
	return Math.floor(this.maxSp.Get() + Math.pow((this.spirit.Get() + this.intelligence.Get() + this.stamina.Get())/3, 1.3));
}

Entity.prototype.Lust = function() {
	return Math.floor(this.maxLust.Get() + Math.pow(this.libido.Get(), 1.3));
}

Entity.prototype.MinLust = function() {
	return 0; // TODO: Implement
}

// STATS
Entity.prototype.Str = function() {
	return this.strength.Get();
}
Entity.prototype.Sta = function() {
	return this.stamina.Get();
}
Entity.prototype.Dex = function() {
	return this.dexterity.Get();
}
Entity.prototype.Int = function() {
	return this.intelligence.Get();
}
Entity.prototype.Spi = function() {
	return this.spirit.Get();
}
Entity.prototype.Lib = function() {
	return this.libido.Get();
}
Entity.prototype.Cha = function() {
	return this.charisma.Get();
}

// TODO: Certain status effects like paralyze should also count as incapacitated
Entity.prototype.Incapacitated = function() {
	return this.curHp <= 0; // || this.curLust >= this.Lust();
}

Entity.prototype.AddHPFraction = function(fraction) {
	fraction = fraction || 0;
	this.curHp += fraction * this.HP();
	if(this.curHp > this.HP()) this.curHp = this.HP();
	if(this.curHp < 0) this.curHp = 0;
}
Entity.prototype.AddSPFraction = function(fraction) {
	fraction = fraction || 0;
	this.curSp += fraction * this.SP();
	if(this.curSp > this.SP()) this.curSp = this.SP();
	if(this.curSp < 0) this.curSp = 0;
}
Entity.prototype.AddLustFraction = function(fraction) { // 0..1
	fraction = fraction || 0;
	this.curLust += fraction * this.Lust();
	if(this.curLust > this.Lust()) this.curLust = this.Lust();
	if(this.curLust < 0) this.curLust = 0;
}

Entity.prototype.AddHPAbs = function(val) {
	val = val || 0;
	this.curHp += val;
	if(this.curHp > this.HP()) this.curHp = this.HP();
	if(this.curHp < 0) this.curHp = 0;
}
Entity.prototype.AddSPAbs = function(val) {
	val = val || 0;
	this.curSp += val;
	if(this.curSp > this.SP()) this.curSp = this.SP();
	if(this.curSp < 0) this.curSp = 0;
}
Entity.prototype.AddLustAbs = function(val) {
	val = val || 0;
	this.curLust += val;
	if(this.curLust > this.Lust()) this.curLust = this.Lust();
	if(this.curLust < 0) this.curLust = 0;
}

Entity.prototype.RestFull = function() {
	this.curHp = this.HP();
	this.curSp = this.SP();
	this.curLust = this.MinLust();
	
	this.combatStatus.Clear();
}

Entity.prototype.Sleep = function() {
	this.curHp = this.HP();
	this.curSp = this.SP();
}


// HP function (returns range 0..1)
Entity.prototype.HPLevel = function() {
	return this.curHp / this.HP();
}

// SP function (returns range 0..1)
Entity.prototype.SPLevel = function() {
	return this.curSp / this.SP();
}

// Lust function (returns range 0..1)
Entity.prototype.LustLevel = function() {
	return this.curLust / this.Lust();
}


// Clear combat effects, called at end of encounters
Entity.prototype.ClearCombatBonuses = function() {
	this.maxHp.temp        = 0;
	this.maxSp.temp        = 0;
	this.maxLust.temp      = 0;
	this.strength.temp     = 0;
	this.stamina.temp      = 0;
	this.dexterity.temp    = 0;
	this.intelligence.temp = 0;
	this.spirit.temp       = 0;
	this.libido.temp       = 0;
	this.charisma.temp     = 0;
	
	this.BalanceStats();
}

// Balance mana, lust and hp
Entity.prototype.BalanceStats = function() {
	if(this.curHp < 0)
		this.curHp = 0;
	else if(this.curHp > this.HP())
		this.curHp = this.HP();
	
	if(this.curSp < 0)
		this.curSp = 0;
	else if(this.curSp > this.SP())
		this.curSp = this.SP();
		
	if(this.curLust < 0)
		this.curLust = 0;
	else if(this.curLust > this.Lust())
		this.curLust = this.Lust();
}

// Grammar
Entity.prototype.nameDesc = function() {
	return this.monsterName || this.name;
}
Entity.prototype.NameDesc = function() {
	return this.MonsterName || this.name;
}
Entity.prototype.possessive = function() {
	var name = this.monsterName || this.name || "the entity";
	var letter = name[name.length-1];
	var s = (letter == 's' || letter == 'x') ? "'" : "'s";
	return name + s;
}
Entity.prototype.Possessive = function() {
	var name = this.MonsterName || this.name || "The entity";
	var letter = name[name.length-1];
	var s = (letter == 's' || letter == 'x') ? "'" : "'s";
	return name + s;
}
Entity.prototype.heshe = function() {
	var gender = this.body.Gender();
	if(gender == Gender.male) return "he";
	else if(gender == Gender.female) return "she";
	else if(gender == Gender.herm) return "she";
	else return "they";
}
Entity.prototype.HeShe = function() {
	var gender = this.body.Gender();
	if(gender == Gender.male) return "He";
	else if(gender == Gender.female) return "She";
	else if(gender == Gender.herm) return "She";
	else return "They";
}
Entity.prototype.himher = function() {
	var gender = this.body.Gender();
	if(gender == Gender.male) return "him";
	else if(gender == Gender.female) return "her";
	else if(gender == Gender.herm) return "her";
	else return "them";
}
Entity.prototype.hisher = function() {
	var gender = this.body.Gender();
	if(gender == Gender.male) return "his";
	else if(gender == Gender.female) return "her";
	else if(gender == Gender.herm) return "her";
	else return "their";
}
Entity.prototype.HisHer = function() {
	var gender = this.body.Gender();
	if(gender == Gender.male) return "His";
	else if(gender == Gender.female) return "Her";
	else if(gender == Gender.herm) return "Her";
	else return "Their";
}
Entity.prototype.hishers = function() {
	var gender = this.body.Gender();
	if(gender == Gender.male) return "his";
	else if(gender == Gender.female) return "hers";
	else if(gender == Gender.herm) return "hers";
	else return "theirs";
}
Entity.prototype.has = function() {
	if(this.body.Gender() == Gender.none) return "have";
	return "has";
}
Entity.prototype.is = function() {
	if(this.body.Gender() == Gender.none) return "are";
	return "is";
}
Entity.prototype.plural = function() {
	return (this.body.Gender() == Gender.none);
}
Entity.prototype.mfFem = function(male, female) {
	return this.body.femininity.Get() > 0 ? female : male;
}
Entity.prototype.mfTrue = function(male, female) {
	return (this.body.Gender() == Gender.male) ? male : female;
}
Entity.prototype.Gender = function() {
	return this.body.Gender();
}
Entity.prototype.Race = function() {
	return this.body.torso.race;
}

Entity.prototype.toString = function() {
	return this.name;
}

Entity.prototype.Appearance = function() {
	return this.FullName()
	+ " is a "
	+ this.body.GenderStr() + " "
	+ this.body.RaceStr() + ".";
}

Entity.prototype.AddLustOverTime = function(hours) {
	// TODO: Function
	var lustRate = this.libido.Get() / this.spirit.Get();
	lustRate /= 48;
	var slutFactor = (this.slut.Get() + 1);
	
	this.AddLustFraction(hours * lustRate * slutFactor);
}

Entity.prototype.LustCombatEfficiencyLevel = function() {
	var lustFactor = (this.LustLevel() - 0.5) * 2;
	if(lustFactor < 0) lustFactor = 0;
	// linear for now
	return 1.0 - 0.25 * lustFactor;
}

Entity.prototype.LustCombatTurnLossChance = function() {
	var lustFactor = this.LustLevel() - 0.5;
	if(lustFactor < 0) lustFactor = 0;
	return lustFactor; // linear for now
}

Entity.prototype.Initiative = function() {
	return Math.sqrt(2 * this.dexterity.Get() + this.intelligence.Get());
}

// Combat functions (calculated)
Entity.prototype.PAttack = function() {
	// Stat based
	var atkStat = (this.strength.Get() * 3 + this.stamina.Get() + this.dexterity.Get()) / 2;
	// Weapon strength based
	var atkWep = this.atkMod;
	
	// Currently range the attack between 0.9 and 1.1
	var atkRand = 0.2 * (Math.random() - 0.5) + 1;
	
	return atkStat * atkWep * atkRand;
}

// TODO: Add perk/elemental/special effects
Entity.prototype.PDefense = function() {
	// Stat based
	var defStat = this.stamina.Get() * 3 + this.spirit.Get();
	if(defStat < 0) defStat = 0;
	// Defense based on armour
	var defArmour = this.defMod;
	// Reduce effect of armour due to armour penetration (TODO)
	
	// Currently range the attack between 0.9 and 1.1
	var defRand = 0.2 * (Math.random() - 0.5) + 1;
	
	// Combine the result
	return defStat * defArmour * defRand;
}

// TODO temp
Entity.prototype.PHit = function() {
	var hitStat = 3 * this.dexterity.Get() + this.intelligence.Get() + this.charisma.Get();
	
	return hitStat;
}

// TODO temp
Entity.prototype.PEvade = function(attack) {
	var evadeStat = 3 * this.dexterity.Get() + this.intelligence.Get() + this.charisma.Get();
	
	return evadeStat;
}

// TODO temp
Entity.prototype.MAttack = function() {
	var magStat = (3 * this.intelligence.Get() + this.spirit.Get() + this.charisma.Get()) / 2;
	
	var magRand = 0.2 * (Math.random() - 0.5) + 1;
	
	return magStat * magRand;
}

// TODO temp
Entity.prototype.MDefense = function() {
	var magDef = this.stamina.Get() + 3 * this.spirit.Get();
	if(magDef < 0) magDef = 0;
	
	var magRand = 0.2 * (Math.random() - 0.5) + 1;
	
	return magDef * magRand;
}

Entity.prototype.LAttack = function() {
	// Stat based
	var sedStat = (this.dexterity.Get() + 2 * this.libido.Get() + 2 * this.charisma.Get()) / 2;
	/*
	var sedLust = this.LustLevel();
	*/
	// Armour sluttiness based (TODO)
	var sedArmour = 1;
	
	// Currently range the attack between 0.9 and 1.1
	var sedRand = 0.2 * (Math.random() - 0.5) + 1;
	
	return sedStat /* * sedLust*/ * sedArmour * sedRand;
}

Entity.prototype.LDefense = function() {
	// Stat based
	var comStat = 2 * this.stamina.Get() + 2 * this.spirit.Get();
	if(comStat < 0) comStat = 0;

	// Lust and libido based
//	var comLust = this.libido.Get() + this.LustLevel();
	
	
	// Currently range the attack between 0.9 and 1.1
	var comRand = 0.2 * (Math.random() - 0.5) + 1;
	
	return comStat /* * comLust*/ * comRand;
}

// TODO: How to handle resistances?
Entity.prototype.PoisonResist = function() {
	return 0;
}
Entity.prototype.BurnResist = function() {
	return 0;
}
Entity.prototype.FreezeResist = function() {
	return 0;
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
		this.AccumulateMilkOverTime(hours);
		this.PregnancyOverTime(hours);
		this.HandleDrunknessOverTime(hours);
		
		for(var i = 0; i < this.effects.length; i++)
			this.effects[i].timer.Dec(step);
	}
}

Entity.prototype.HandleTimers = function() {
	for(var i = 0; i < this.effects.length; i++) {
		var effect = this.effects[i];
		
		if(effect.timer.Expired()) {
			var result = false;
			if(effect.func) {
				result = effect.func(effect.obj);
			}
			this.effects.remove(i--);
			if(result) return true;
		}
	}
	return false;
}
//TODO
Entity.prototype.AccumulateCumOverTime = function(hours) {
	var balls = this.Balls();
	
	var inc = balls.cumProduction.Get() * hours;

	// Max out
	balls.cum.IncreaseStat(balls.cumCap.Get(), inc);
}
//TODO
Entity.prototype.AccumulateMilkOverTime = function(hours) {
	var inc = this.body.milkProduction.Get() * hours;
	
	this.body.milk.IncreaseStat(this.body.milkCap.Get(), inc);
}
//TODO
Entity.prototype.PregnancyOverTime = function(hours) {
	
}

Entity.prototype.RenderHealthbar = function(context, glowColor) {
	var barStart = 85;
	var barWidth = 145;
	var barHeigth = 35;
	var border = 3;
	var barOffset = 3;
	
	if(glowColor) {
		RenderGlow(context, {w:100, h:100}, 10, glowColor);
		if(!RENDER_PICTURES) {
			context.fillStyle = glowColor;
			context.fillRect(0,0,100,100);
		}
	}
	if(RENDER_PICTURES && this.avatar && this.avatar.combat)
		context.drawImage(this.avatar.combat, 0, 0);
	else {
		barWidth = 200;
		barStart = 30;
	}
	
	this.combatStatus.Render(context);
	/*
	context.save();
	
	context.translate(barStart, 20);
	
	context.font = DEFAULT_FONT;
	context.textAlign = 'right';
	context.strokeStyle = "black";
	context.lineWidth = 4;
	
	context.fillStyle = "black";
	context.fillRect(0,0,barWidth,barHeigth);
	var hp = Math.floor(this.curHp) / Math.floor(this.HP());
	context.fillStyle = "red";
	context.fillRect(border,border,hp*(barWidth-2*border),barHeigth-2*border);
	var hpText = Math.floor(this.curHp) + "/" + Math.floor(this.HP());
	context.strokeText(hpText, barWidth-10, 23);
	context.fillStyle = "white";
	context.fillText(hpText, barWidth-10, 23);
	
	context.translate(barOffset, 25);
	
	context.fillStyle = "black";
	context.fillRect(0,0,barWidth,barHeigth);
	var sp = Math.floor(this.curSp) / Math.floor(this.SP());
	context.fillStyle = "blue";
	context.fillRect(border,border,sp*(barWidth-2*border),barHeigth-2*border);
	var spText = Math.floor(this.curSp) + "/" + Math.floor(this.SP());
	context.strokeText(spText, barWidth-10, 23);
	context.fillStyle = "white";
	context.fillText(spText, barWidth-10, 23);
	
	context.translate(barOffset, 25);
	
	context.fillStyle = "black";
	context.fillRect(0,0,barWidth,barHeigth);
	var lust = Math.floor(this.curLust) / Math.floor(this.Lust());
	context.fillStyle = "pink";
	context.fillRect(border,border,lust*(barWidth-2*border),barHeigth-2*border);
	var lustText = Math.floor(this.curLust) + "/" + Math.floor(this.Lust());
	context.strokeText(lustText, barWidth-10, 23);
	context.fillStyle = "white";
	context.fillText(lustText, barWidth-10, 23);
	
	context.restore();
	
	context.font = LARGE_FONT;
	context.textAlign = 'start';
	context.lineWidth = 4;
	context.strokeText(this.name, -10, 15);
	context.fillStyle = "white";
	context.fillText(this.name, -10, 15);
	
	context.font = SMALL_FONT;
	context.textAlign = 'left';
	context.strokeStyle = "black";
	context.lineWidth = 4;
	context.fillStyle = this.pendingStatPoints > 0 ? "green" : "white";
	
	var levelText = "Lvl " + this.level + "/" + this.sexlevel;
	if(this.currentJob) {
		var jd  = this.jobs[this.currentJob.name];
		if(jd) {
			// Check for maxed out job
			var master   = jd.job.Master(this);
			if(master) levelText += "/*";
			else       levelText += "/" + jd.level;
		}
	}
	
	context.strokeText(levelText, -10, 105);
	context.fillText(levelText, -10, 105);
	*/
}

DrunkLevel = {
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

// TODO: affect with lust/perks
Entity.prototype.SubDom = function() {
	return this.subDom.Get();
}
Entity.prototype.Relation = function() {
	return this.relation.Get();
}
Entity.prototype.Slut = function() {
	return this.slut.Get();
}

Entity.prototype.MuscleTone = function() {
	return this.body.muscleTone.Get();
}
Entity.prototype.BodyMass = function() {
	return this.body.bodyMass.Get();
}

// TODO: affect with things such as stretch, lust, perks etc
Entity.prototype.VagCap = function() {
	return this.FirstVag().capacity.Get();
}
Entity.prototype.OralCap = function() {
	return this.Mouth().capacity.Get();
}
Entity.prototype.AnalCap = function() {
	return this.Butt().capacity.Get();
}

// Convenience functions, cock
Entity.prototype.NumCocks = function() {
	return this.body.cock.length;
}
Entity.prototype.FirstCock = function() {
	return this.body.cock[0];
}
Entity.prototype.FirstClitCockIdx = function() {
	for(var i=0,j=this.body.cock.length; i<j; i++) {
		var c = this.body.cock[i];
		if(c.type == CockType.clitcock)
			return i;
	}
	return -1;
}
Entity.prototype.BiggestCock = function() {
	var c = this.body.cock[0];
	if(c) {
		var cSize = this.body.cock[0].length.Get() * this.body.cock[0].thickness.Get();
		for(var i=1,j=this.body.cock.length; i<j; i++) {
			var newSize = this.body.cock[i].length.Get() * this.body.cock[i].thickness.Get();
			if(newSize > cSize) {
				cSize = newSize;
				c = this.body.cock[i];
			}
		};
	}
	return c;
}
Entity.prototype.CocksThatFitLen = function(capacity) {
	ret = new Array();
	for(var i=0,j=this.body.cock.length; i<j; i++) {
		var size = this.body.cock[i].length.Get();
		if(size <= capacity)
			ret.push(this.body.cock[i]);
	};
	return ret;
}
Entity.prototype.CocksThatFitThk = function(capacity) {
	ret = new Array();
	for(var i=0,j=this.body.cock.length; i<j; i++) {
		var size = this.body.cock[i].thickness.Get();
		if(size <= capacity)
			ret.push(this.body.cock[i]);
	};
	return ret;
}
Entity.prototype.AllCocks = function() {
	return this.body.cock;
}
// TODO: Race too
Entity.prototype.MultiCockDesc = function() {
	if(this.body.cock.length == 0) return "[NO COCKS]";
	else if(this.body.cock.length == 1)
		return this.FirstCock().Short();
	else
		return Text.Quantify(this.body.cock.length) + " of " + this.body.cock[0].Desc().adj + " " + this.body.cock[0].nounPlural();
}



// Convenience functions, vag
Entity.prototype.NumVags = function() {
	return this.body.vagina.length;
}
Entity.prototype.FirstVag = function() {
	return this.body.vagina[0];
}
Entity.prototype.VagsThatFit = function(capacity) {
	for(var i=0,j=this.body.vagina.length; i<j; i++) {
		var size = this.body.vagina[i].capacity.Get();
		if(size >= capacity)
			return this.body.vagina[i];
	};
	return null;
}
Entity.prototype.AllVags = function() {
	return this.body.vagina;
}
Entity.prototype.UnfertilezedWomb = function() {
	var ret = new Array();
	for(var i=0,j=this.body.vagina.length; i<j; i++){
		var womb = this.body.vagina[i].womb;
		if(womb.pregnant == false)
			ret.push(womb);
	};
	return ret;
}


// Convenience functions, breasts
Entity.prototype.NumBreastRows = function() {
	return this.body.breasts.length;
}
Entity.prototype.BiggestBreasts = function() {
	var c = this.body.breasts[0];
	var cSize = this.body.breasts[0].size.Get();
	for(var i=1,j=this.body.breasts.length; i<j; i++) {
		var newSize = this.body.breasts[i].size.Get();
		if(newSize > cSize) {
			cSize = newSize;
			c = this.body.breasts[i];
		}
	};
	return c;
}
Entity.prototype.FirstBreastRow = function() {
	return this.body.breasts[0];
}
Entity.prototype.NipplesThatFitLen = function(capacity) {
	var ret = new Array();
	for(var i=0,j=this.body.breasts.length; i<j; i++) {
		var row = this.body.breasts[i];
		if(row.nippleType == NippleType.lipple ||
			row.nippleType == NippleType.cunt) {
			if(row.nippleThickness.Get() * row.nippleLength.Get() >= capacity)
				ret.push(row);
		}
	};
	return ret;
}
Entity.prototype.AllBreastRows = function() {
	return this.body.breasts;
}



Entity.prototype.AllOrfices = function(capacity) {
	capacity = capacity || 0;
	var ret = new Array();
	
	var vags = this.VagsThatFit(capacity);
	for(var i=0,j=vags.length; i<j; i++)
		ret.push({type: BodyPartType.vagina, obj: vags[i]});
	var nips = this.NipplesThatFitLen(capacity);
	for(var i=0,j=nips.length; i<j; i++)
		ret.push({type: BodyPartType.nipple, obj: nips[i]});
	if(this.body.ass.capacity.Get() >= capacity)
		ret.push({type: BodyPartType.ass, obj: this.body.ass});
	if(this.body.head.mouth.capacity.Get() >= capacity)
		ret.push({type: BodyPartType.mouth, obj: this.body.head.mouth});
	
	return ret;
}

Entity.prototype.AllPenetrators = function(capacity) {
	capacity = capacity || Infinity;
	var ret = new Array();
	
	var cocks = this.CocksThatFitLen(capacity);
	for(var i=0,j=cocks.length; i<j; i++)
		ret.push({type: BodyPartType.cock, obj: cocks[i]});
	// TODO: Tongue, Nipple-cock, Clitcock
	
	return ret;
}

Entity.prototype.Fuck = function(cock, expMult) {
	expMult = expMult || 1;
	this.AddSexExp(expMult);
	// TODO: Stretch
}

// Fuck entitys mouth (vag, cock)
Entity.prototype.FuckOral = function(mouth, cock, expMult) {
	expMult = expMult || 1;
	this.AddSexExp(expMult);
	// TODO: Stretch
}

// Fuck entitys anus (anus, cock)
Entity.prototype.FuckAnal = function(butt, cock, expMult) {
	expMult = expMult || 1;
	if(butt.virgin) {
		butt.virgin = false;
		Text.Add("<b>[name] [has] lost [hisher] anal virginity.</b>",
		{ name : this.NameDesc(), has : this.has(), hisher : this.hisher() });
		Text.NL();
		Text.Flush();
		this.AddSexExp(5 * expMult);
	}
	else
		this.AddSexExp(expMult);
	
	// TODO: Stretch
}

// Fuck entitys vagina (vag, cock)
Entity.prototype.FuckVag = function(vag, cock, expMult) {
	expMult = expMult || 1;
	if(vag.virgin) {
		vag.virgin = false;
		Text.Add("<b>[name] [has] lost [hisher] virginity.</b>",
		{ name : this.NameDesc(), has : this.has(), hisher : this.hisher() });
		Text.NL();
		Text.Flush();
		this.AddSexExp(5 * expMult);
	}
	else
		this.AddSexExp(expMult);
	
	// TODO: Stretch
}

/*
 * New Sex functions
 */
Sex = {};

Sex.Cunnilingus = function(giver, reciever) {
	if(giver)    giver.sex.gCunn++;
	if(reciever) reciever.sex.rCunn++;
}
Sex.Blowjob = function(giver, reciever) {
	if(giver)    giver.sex.gBlow++;
	if(reciever) reciever.sex.rBlow++;
}
Sex.Vaginal = function(giver, reciever) {
	if(giver)    giver.sex.gVag++;
	if(reciever) reciever.sex.rVag++;
}
Sex.Anal = function(giver, reciever) {
	if(giver)    giver.sex.gAnal++;
	if(reciever) reciever.sex.rAnal++;
}
Sex.Preg = function(father, mother, num) {
	num = num || 1;
	if(father) father.sex.sired += num;
	if(mother) mother.sex.birth += num;
}

Entity.prototype.Height = function() {
	return this.body.height.Get();
}
Entity.prototype.Weigth = function() {
	return this.body.weigth.Get();
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
Entity.prototype.TongueDesc = function() {
	return this.body.TongueDesc();
}
Entity.prototype.Hair = function() {
	return this.body.head.hair;
}
Entity.prototype.Mouth = function() {
	return this.body.head.mouth;
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
Entity.prototype.Arms = function() {
	return this.body.arms;
}
Entity.prototype.MultiArm = function() {
	return this.body.arms.count > 2;
}
Entity.prototype.Legs = function() {
	return this.body.legs;
}
LowerBodyType = {
	Single   : 0,
	Humanoid : 1,
	Taur     : 2
};
Entity.prototype.LowerBodyType = function() {
	if     (this.body.legs.count < 2)  return LowerBodyType.Single;
	else if(this.body.legs.count == 2) return LowerBodyType.Humanoid;
	else                               return LowerBodyType.Taur;
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
Entity.prototype.HasFur = function() {
	return this.body.HasFur();
}
Entity.prototype.HasSkin = function() {
	return this.body.HasSkin();
}
Entity.prototype.HasScales = function() {
	return this.body.HasScales();
}
// TODO
Entity.prototype.CumOutput = function(mult) {
	mult = mult || 1;
	var balls = this.Balls();
	var cum = mult * balls.cumCap.Get() / 4;
	cum *= this.LustLevel() + 0.5;
	
	cum = Math.min(cum, balls.cum.Get());
	return cum;
}
// TODO
Entity.prototype.OrgasmCum = function(mult) {
	mult = mult || 1;
	var balls = this.Balls();
	var cumQ = this.CumOutput(mult);
	
	balls.cum.DecreaseStat(0, cumQ);
	
	this.AddLustFraction(-1);
	return cumQ;
}
// TODO
Entity.prototype.StomachDesc = function() {
	return this.body.StomachDesc();
}
Entity.prototype.HipsDesc = function() {
	return this.body.HipsDesc();
}
// TODO
Entity.prototype.ArmDesc = function() {
	return this.body.ArmDesc();
}
Entity.prototype.HandDesc = function() {
	return this.body.HandDesc();
}
Entity.prototype.LegDesc = function() {
	return this.body.LegDesc();
}
Entity.prototype.LegsDesc = function() {
	return this.body.LegsDesc();
}
Entity.prototype.FeetDesc = function() {
	return this.body.FeetDesc();
}
Entity.prototype.StomachDesc = function() {
	return this.body.StomachDesc();
}
Entity.prototype.Appendages = function() {
	return this.body.head.appendages;
}
Entity.prototype.HasHorns = function() {
	for(var i = 0; i < this.body.head.appendages.length; i++)
		if(this.body.head.appendages[i].type == AppendageType.horn)
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
Entity.prototype.NumAttributes = function(race) {
	return this.body.NumAttributes(race);
}

Entity.prototype.SetEyeColor = function(color) {
	this.body.head.eyes.color = color;
}
Entity.prototype.SetHairColor = function(color) {
	this.body.head.hair.color = color;
	this.body.pubes.color = color;
}
Entity.prototype.SetSkinColor = function(color) {
	this.body.torso.color = color;
}

Entity.prototype.ResetVirgin = function() {
	this.Butt().virgin = true;
	var vags = this.AllVags();
	for(var i = 0; i < vags.length; i++)
		vags[i].virgin = true;
}

Entity.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! Rawr!");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	Abilities.Attack.CastInternal(encounter, this, t);
}

Entity.prototype.LevelUpPrompt = function(backFunc) {
	Text.Clear();
	
	Text.Add("[name] has [points] stat points pending.",
		{name: this.name, points: this.pendingStatPoints != 0 ? Text.BoldColor(this.pendingStatPoints) : "no"});
	
	Text.NL();
	
	this.SetLevelBonus();
	
	Text.Add("Level: "        + Math.floor(this.level) + "<br/>");
	Text.Add("Exp: "          + Math.floor(this.experience) + "/" + Math.floor(this.expToLevel) + "<br/>");
	Text.Add("Sex level: "    + Math.floor(this.sexlevel) + "<br/>");
	Text.Add("S.Exp: "        + Math.floor(this.sexperience) + "/" + Math.floor(this.sexpToLevel));
	if(this.currentJob) {
		var jd  = this.jobs[this.currentJob.name];
		if(jd) {
			Text.Add("<br/>");
			
			var parse = {
				job        : jd.job.Short(this),
				lvl        : jd.level,
				maxlvl     : jd.job.levels.length + 1
			};
			
			// Check for maxed out job
			var master   = jd.job.Master(this);
			var toLevel;
			if(!master) {
				var newLevel = jd.job.levels[jd.level-1];
				toLevel      = newLevel.expToLevel * jd.mult;
			}
			
			if(master)
				Text.Add("[job] <b>(MASTER)</b>", parse);
			else
				Text.Add("[job]: level [lvl]/[maxlvl] (exp " + Math.floor(jd.experience) + "/" + Math.floor(toLevel) + ")", parse);
		}
	}
	
	Text.NL();
	Text.Add("Strength: "     + Math.floor(this.strength.Get()) + " (Rank " + this.strength.GrowthRank() + ")<br/>");
	Text.Add("Stamina: "      + Math.floor(this.stamina.Get()) + " (Rank " + this.stamina.GrowthRank() + ")<br/>");
	Text.Add("Dexterity: "    + Math.floor(this.dexterity.Get()) + " (Rank " + this.dexterity.GrowthRank() + ")<br/>");
	Text.Add("Intelligence: " + Math.floor(this.intelligence.Get()) + " (Rank " + this.intelligence.GrowthRank() + ")<br/>");
	Text.Add("Spirit: "       + Math.floor(this.spirit.Get()) + " (Rank " + this.spirit.GrowthRank() + ")<br/>");
	Text.Add("Libido: "       + Math.floor(this.libido.Get()) + " (Rank " + this.libido.GrowthRank() + ")<br/>");
	Text.Add("Charisma: "     + Math.floor(this.charisma.Get()) + " (Rank " + this.charisma.GrowthRank() + ")<br/>");
	Text.NL();
	
	if(this.currentJob) {
		Text.Add(Text.BoldColor("Job abilities:<br/>"));
		var abSet = this.currentJob.abilities;
		
		for(var i = 0; i < abSet.AbilitySet.length; i++) {
			var ability = abSet.AbilitySet[i];
			Text.Add("[ability] ([cost]): [desc]<br/>",
				{ability: ability.name, cost: ability.CostStr(), desc: ability.Short()});
		}
		Text.Add("<br/>");
	}
	Text.Add(Text.BoldColor("Known abilities:<br/>"));
	for(set in this.abilities) {
		var abSet = this.abilities[set];
		
		for(var i = 0; i < abSet.AbilitySet.length; i++) {
			var ability = abSet.AbilitySet[i];
			Text.Add("[ability] ([cost]): [desc]<br/>",
				{ability: ability.name, cost: ability.CostStr(), desc: ability.Short()});
		}
	}

	Text.Flush();
	
	var that = this;
	
	if(this.pendingStatPoints <= 0) {
		Gui.NextPrompt(backFunc);
		return;
	}
	
	var options = new Array();
	options.push({ nameStr: "Strength",
		func : function() {
			that.strength.growth += growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true
	});
	options.push({ nameStr: "Stamina",
		func : function() {
			that.stamina.growth += growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true
	});
	options.push({ nameStr: "Dexterity",
		func : function() {
			that.dexterity.growth += growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true
	});
	options.push({ nameStr: "Intelligence",
		func : function() {
			that.intelligence.growth += growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true
	});
	options.push({ nameStr: "Spirit",
		func : function() {
			that.spirit.growth += growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true
	});
	options.push({ nameStr: "Libido",
		func : function() {
			that.libido.growth += growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true
	});
	options.push({ nameStr: "Charisma",
		func : function() {
			that.charisma.growth += growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, true, backFunc);
}

Entity.prototype.EquipPrompt = function(backfunc) {
	var that = this;
	var parse = {
		name    : that.NameDesc(),
		isAre   : that.is(),
		HeShe   : function() { return that.HeShe(); },
		heshe   : function() { return that.heshe(); },
		HisHer  : function() { return that.HisHer(); },
		hisher  : function() { return that.hisher(); },
		himher  : function() { return that.himher(); },
		hishers : function() { return that.hishers(); },
		es      : function() { return that.plural() ? "" : "es"; }
	};
	
	var equipFunc = function() {
		parse["wep"]  = that.weaponSlot   ? that.weaponSlot.Short()   : "<i>None</i>";
		parse["top"]  = that.topArmorSlot ? that.topArmorSlot.Short() : "<i>None</i>";
		parse["bot"]  = that.botArmorSlot ? that.botArmorSlot.Short() : "<i>None</i>";
		parse["acc1"] = that.acc1Slot     ? that.acc1Slot.Short()     : "<i>None</i>";
		parse["acc2"] = that.acc2Slot     ? that.acc2Slot.Short()     : "<i>None</i>";
		parse["toy"]  = that.strapOn      ? that.strapOn.Short()      : "<i>None</i>";
		
		Text.Clear();
		
		Text.Add("[name] [isAre] currently equipped with:", parse);
		Text.NL();
		Text.Add("<b>Weapon:</b> [wep]", parse);
		Text.NL();
		Text.Add("<b>Top armor:</b> [top]", parse);
		Text.NL();
		Text.Add("<b>Bottom armor:</b> [bot]", parse);
		Text.NL();
		Text.Add("<b>Accessory:</b> [acc1]", parse);
		Text.NL();
		Text.Add("<b>Accessory:</b> [acc2]", parse);
		Text.NL();
		Text.Add("<b>Toy:</b> [toy]", parse);
		Text.Flush();
		
		var options = new Array();
		options.push({ nameStr : "Weapon",
			func : function() {
				Text.NL();
				Text.Add("<i>What weapon do[es] [heshe] equip?</i>", parse);
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemType.Weapon, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		options.push({ nameStr : "Top",
			func : function() {
				Text.NL();
				Text.Add("<i>What primary armor do[es] [heshe] equip?</i>", parse);
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemType.TopArmor, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		options.push({ nameStr : "Bottom",
			func : function() {
				Text.NL();
				Text.Add("<i>What secondary armor do[es] [heshe] equip?</i>", parse);
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemType.BotArmor, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		options.push({ nameStr : "Acc.1",
			func : function() {
				Text.NL();
				Text.Add("<i>What primary accessory do[es] [heshe] equip?</i>", parse);
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemType.Acc1, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		options.push({ nameStr : "Acc.2",
			func : function() {
				Text.NL();
				Text.Add("<i>What secondary accessory do[es] [heshe] equip?</i>", parse);
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemType.Acc2, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		options.push({ nameStr : "Toy",
			func : function() {
				Text.NL();
				Text.Add("<i>What secondary accessory do[es] [heshe] equip?</i>", parse);
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemType.StrapOn, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		Gui.SetButtonsFromList(options, true, backfunc);
	}
	equipFunc();
}

Entity.prototype.JobPrompt = function(backfunc) {
	var that = this;
	Text.Clear();
	// Fallback for bugs
	if(this.currentJob == null) {
		Text.Add("ERROR, NO ACTIVE JOB");
		Text.Flush();
		Gui.NextPrompt(backfunc);
		return;
	}
	
	var jd  = this.jobs[this.currentJob.name];
	if(jd == null) {
		Text.Add("ERROR, NO JOB DESCRIPTOR");
		Text.Flush();
		Gui.NextPrompt(backfunc);
		return;
	}
	
	var parse = {
		name       : this.NameDesc(),
		has        : this.has(),
		Possessive : this.Possessive(),
		job        : jd.job.Short(this),
		lvl        : jd.level,
		maxlvl     : jd.job.levels.length + 1
	};
	
	// Check for maxed out job
	var master   = jd.job.Master(this);
	var toLevel;
	if(!master) {
		var newLevel = jd.job.levels[jd.level-1];
		toLevel      = newLevel.expToLevel * jd.mult;
	}
	
	Text.Add("[Possessive] current job is a level [lvl]/[maxlvl] <b>[job]</b>.", parse);
	Text.NL();
	if(jd.job.Long) {
		Text.Add(jd.job.Long(this));
		Text.NL();
	}
	if(master)
		Text.Add("[name] [has] mastered this job.", parse);
	else
		Text.Add("Exp: " + Math.floor(jd.experience) + "/" + Math.floor(toLevel));
	Text.NL();
	Text.Add("Available jobs:<br/>");
	
	var options = [];
	
	for(var jobName in this.jobs) {
		var jd = this.jobs[jobName];
		
		if(!jd.job.Unlocked(this)) continue;
		
		parse.job = jd.job.Short(this);
		parse.lvl = jd.level;
		// Check for maxed out job
		var master   = jd.job.Master(this);
		var toLevel;
		if(!master) {
			var newLevel = jd.job.levels[jd.level-1];
			toLevel      = newLevel.expToLevel * jd.mult;
		}
		
		if(jd.job.Available(this)) {
			if(master)
				Text.Add("[job] <b>(MASTER)</b><br/>", parse);
			else
				Text.Add("[job]: level [lvl] (exp " + Math.floor(jd.experience) + "/" + Math.floor(toLevel) + ")<br/>", parse);
		}
		else
		{
			Text.Add("[job]: Requires", parse);
			for(var i = 0; i < jd.job.preqs.length; i++) {
				var preq = jd.job.preqs[i];
				var job  = preq.job;
				var lvl  = preq.lvl || 1;
				Text.Add(" [job2] lvl [lvl2]", {job2: job.Short(this), lvl2: lvl});
			}
			Text.Add(".<br/>");
		}
		
		options.push({ nameStr : jd.job.Short(this),
			func : function(obj) {
				parse.job = obj.Short(this);
				Text.Clear();
				Text.Add("[Possessive] current job is <b>[job]</b>.", parse);
				Text.NL();
				Text.Flush();
				
				that.currentJob = obj;
				
				Gui.NextPrompt(backfunc);
			}, enabled : jd.job.Available(this),
			obj : jd.job, 
			tooltip : jd.job.Long ? jd.job.Long(this) : ""
		});
	}
	
	Text.Flush();
	
	Gui.SetButtonsFromList(options, true, backfunc);
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

Entity.prototype.PrintDescription = function() {
	
	var parse = {
		name     : this.NameDesc(),
		hisher   : this.hisher(),
		HisHer   : this.HisHer(),
		HeShe    : this.HeShe(),
		heshe    : this.heshe(),
		possesive: this.possessive(),
		height   : Math.floor(this.body.height.Get()),
		weigth   : Math.floor(this.body.weigth.Get()),
		race     : this.body.RaceStr(),
		gender   : this.body.GenderStr(),
		skinDesc : this.body.SkinDesc(),
		faceDesc : this.body.FaceDescLong(),
		eyeCount : Text.NumToText(this.body.head.eyes.count.Get()),
		eyeColor : Color.Desc(this.body.head.eyes.color),
		eyeDesc  : this.body.EyeDesc(),
		eyeS     : this.body.head.eyes.count.Get() == 1 ? "" : "s",
		earDesc  : this.body.EarDesc(),
		hairDesc : this.body.head.hair.Long(),
		buttDesc : this.Butt().Long(),
		hipsDesc : this.HipsDesc(),
		anusDesc : this.Butt().AnalLong(),
		ballsDesc: this.Balls().Long(),
		has      : this.has(),
		is       : this.is(),
		armor    : this.ArmorDescLong(),
		larmor   : this.LowerArmorDescLong(),
		weapon   : this.WeaponDescLong()
	};
	
	Text.Add("[name] [is] a [gender] [race], [height]cm tall and weighing around [weigth]kg. [HeShe] [has] [skinDesc]. ", parse);
	Text.Add("[HeShe] [is] wearing [armor].", parse);
	if(this.LowerArmor()) Text.Add(" [HeShe] [is] wearing [larmor].", parse);
	if(this.Weapon()) Text.Add(" [HeShe] [is] wielding [weapon].", parse);
	// TODO Body appearance, skin color
	Text.NL();
	Text.Add("[HeShe] [has] [faceDesc]. [HisHer] [eyeCount] [eyeColor] [eyeDesc][eyeS] observe the surroundings. ", parse);
	Text.Add("A pair of [earDesc] stick out from [possesive] [hairDesc]. ", parse);
	
	for(i = 0; i < this.body.head.appendages.length; i++) {
		var a = this.body.head.appendages[i];
		parse.appDesc = a.Long();
		Text.Add("On [hisher] head, [heshe] [has] a [appDesc]. ", parse);
	}
	
	Text.NL();
	var bs = false;
	// Back slots
	for(i = 0; i < this.body.backSlots.length; i++) {
		var b = this.body.backSlots[i];
		parse.appDesc = b.Long();
		Text.Add("On [hisher] back, [heshe] [has] a [appDesc]. ", parse);
		bs = true;
	}
	if(bs) Text.NL();
	
	// TODO: Arms/Legs
	/*
		armDesc  : this.body.ArmDesc(),
		legDesc  : this.body.LegDesc()
	*/
	Text.Add("[name] [has] arms and legs.", parse);
	Text.NL();
	
	// TODO: Hips/butt
	Text.Add("[name] [has] [hipsDesc], and [buttDesc].", parse);
	Text.NL();
	
	// TODO: Breasts
	var breasts = this.body.breasts;
	if(breasts.length == 1) {
		parse.breastDesc = breasts[0].Long();
		Text.Add("[HeShe] [has] [breastDesc].", parse);
	}
	else if(breasts.length > 1) {
		var breast = breasts[0];
		var breastDesc = breast.Desc();
		parse.breastDesc = breasts[0].Short();
		parse.breastSize = breastDesc.size;
		Text.Add("Multiple rows of " + breast.nounPlural() + " sprout from [hisher] chest. [HisHer] first pair of [breastDesc] are [breastSize] in circumference.", parse);
		for(i = 1; i < breasts.length; i++) {
			Text.Add("<br/>Another two breasts.");
		}
	}
	else {
		Text.Add("[name] have a featureless smooth chest.", parse);
	}
	Text.NL();
	
	// Genetalia
	var cocks = this.body.cock;
	var vags = this.body.vagina;
	
	if(cocks.length == 1) {
		var cock = cocks[0];
		parse.cockDesc = cock.aLong();
		Text.Add("[name] [has] [cockDesc].", parse);
	}
	else if(cocks.length > 1) {
		var cock = cocks[0];
		parse.cockDesc = cock.aLong();
		parse.numCocks = Text.NumToText(cocks.length);
		Text.Add("[name] [has] a brace of [numCocks] " + cock.nounPlural() + ".", parse);
		for(i = 0; i < cocks.length; i++) {
			var cock = cocks[i];
			parse.cockDesc = cock.aLong();
			Text.NL();
			Text.Add("[name] [has] [cockDesc].", parse);
		}
	}
	if(cocks[0])
		Text.NL();
	
	// TODO: balls
	if(this.HasBalls())
	{
		if(cocks.length > 0 || vags.length > 0) {
			Text.Add("Beneath [hisher] other genetalia, [ballsDesc] hang.", parse);
		}
		else {
			// Weird, no genetalia, just balls
			Text.Add("Strangely, [ballsDesc] hang from [hisher] otherwise flat crotch.", parse);
		}
		Text.NL();
	}
	else if(cocks.length == 0 && vags.length == 0) {
		// Genderless, no balls
		Text.Add("[name] [has] a smooth, featureless crotch.", parse);
		Text.NL();
	}
	
	// TODO: vagina
	if(vags.length == 1) {
		var vag = vags[0];
		var vagDesc = vag.Desc();
		Text.Add("[name] [has] " + vagDesc.a + " " + vagDesc.adj + " " + vag.noun() + ".", parse);
	}
	else if(vags.length > 1) {
		var vag = vags[0];
		Text.Add("[name] [has] multiple " + vag.nounPlural() + ". [HisHer] first " + vag.noun() + " is slutty.<br/>", parse);
		for(i = 1; i < vags.length; i++) {
			Text.Add("<br/>Another of [hisher] " + vag.nounPlural() + " is slutty.", parse);
		}
	}
	if(vags[0])
		Text.NL();
	
	// TODO TEMP
	var balls = this.Balls();
	Text.Add("Cum: " + balls.cum.Get() + " / " + balls.cumCap.Get());
	Text.NL();
	Text.Add("Milk: " + this.body.milk.Get() + " / " + this.body.milkCap.Get());
	Text.NL();
	
	// TODO: Ass
	Text.Add("[name] [has] [anusDesc].", parse);
	
	if(DEBUG) {
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: relation: " + this.relation.Get()));
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: subDom: " + this.subDom.Get()));
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: slut: " + this.slut.Get()));
		Text.NL();
	}
	
	var drunk = this.DrunkStr();
	if(drunk) {
		Text.NL();
		Text.Add(drunk);
	}
	
	Text.Flush();
}

// TODO
Entity.prototype.Weapon = function() {
	return this.weaponSlot;
}
// TODO
Entity.prototype.WeaponDesc = function() {
	return this.weaponSlot ? this.weaponSlot.Short() : "stick";
}
// TODO
Entity.prototype.WeaponDescLong = function() {
	return this.weaponSlot ? this.weaponSlot.Long() : "a stick";
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
	return this.botArmorSlot ? this.botArmorSlot.Short() : this.ArmorDesc();
}
// TODO
Entity.prototype.LowerArmorDescLong = function() {
	return this.botArmorSlot ? this.botArmorSlot.Long() : this.ArmorDescLong();
}
// TODO
Entity.prototype.ArmorDesc = function() {
	return this.topArmorSlot ? this.topArmorSlot.Short() : "comfortable clothes";
}
Entity.prototype.ArmorDescLong = function() {
	return this.topArmorSlot ? this.topArmorSlot.Long() : "a set of comfortable clothes";
}
Entity.prototype.Accessories = function() {
	return [this.acc1Slot, this.acc2Slot];
}

TargetStrategy = {
	None : 0
};

GetAggroEntry = function(activeChar, entity) {
	for(var j = 0; j < activeChar.aggro.length; j++) {
		if(activeChar.aggro[j].entity == entity) {
			return activeChar.aggro[j];
		}
	}
}

Entity.prototype.GetSingleTarget = function(encounter, activeChar, strategy) {
	// Fetch all potential targets
	var targets;
	if(activeChar.isEnemy)
		targets = encounter.GetLivePartyArray();
	else
		targets = encounter.GetLiveEnemyArray();
	strategy = strategy || TargetStrategy.None;
	
	// cleanup
	for(var i = 0; i < activeChar.aggro.length; i++) {
		if(activeChar.aggro[i].entity.Incapacitated())
			activeChar.aggro.remove(i);
	}
	// adding new aggro targets
	for(var i = 0; i < targets.length; i++) {
		if(!GetAggroEntry(activeChar, targets[i]))
			activeChar.aggro.push({entity: targets[i], aggro: 1});
	}
	
	// Pick a random target
	// TODO: more complex targetting (low hp etc)
	switch(strategy) {
	default:
	case TargetStrategy.None:
		break;
	}
	
	// Weigthed random selection
	var sum = 0;
	for(var i = 0; i < activeChar.aggro.length; i++)
		sum += activeChar.aggro[i].aggro;
	
	// Pick a target
	var step = Math.random() * sum;
	
	for(var i = 0; i < activeChar.aggro.length; i++) {
		step -= activeChar.aggro[i].aggro;
		if(step <= 0.0) return activeChar.aggro[i].entity;
	}
}


