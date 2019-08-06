import { Body } from "./body/body";
import { PerkIds } from "./perks";
import { ItemIds } from "./item";
import { Jobs } from "./job";

let EntitySave = {
	SaveSexFlags : function(storage) {
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
		storage.sex = sex;
	},

	SaveCombatStats : function(storage) {
		storage = storage || {};
		
		storage.name     = this.name;
		storage.exp      = this.experience.toFixed();
		storage.points   = this.pendingStatPoints.toFixed();
		storage.exp2lvl  = this.expToLevel.toFixed();
		storage.lvl      = this.level.toFixed();
		storage.sexp     = this.sexperience.toFixed();
		storage.sxp2lvl  = this.sexpToLevel.toFixed();
		storage.slvl     = this.sexlevel.toFixed();
		storage.alvl     = this.alchemyLevel.toFixed();
		storage.curHp    = this.curHp.toFixed(1);
		storage.maxHp    = this.maxHp.base.toFixed(1);
		storage.curSp    = this.curSp.toFixed(1);
		storage.maxSp    = this.maxSp.base.toFixed(1);
		storage.curLust  = this.curLust.toFixed(1);
		storage.maxLust  = this.maxLust.base.toFixed(1);
		// Main stats
		storage.str      = this.strength.base.toFixed(1);
		storage.sta      = this.stamina.base.toFixed(1);
		storage.dex      = this.dexterity.base.toFixed(1);
		storage.inte     = this.intelligence.base.toFixed(1);
		storage.spi      = this.spirit.base.toFixed(1);
		storage.lib      = this.libido.base.toFixed(1);
		storage.cha      = this.charisma.base.toFixed(1);
		// Growth
		storage.maxHpG   = this.maxHp.growth.toFixed(1);
		storage.maxSpG   = this.maxSp.growth.toFixed(1);
		storage.maxLustG = this.maxLust.growth.toFixed(1);
		storage.strG     = this.strength.growth.toFixed(1);
		storage.staG     = this.stamina.growth.toFixed(1);
		storage.dexG     = this.dexterity.growth.toFixed(1);
		storage.inteG    = this.intelligence.growth.toFixed(1);
		storage.spiG     = this.spirit.growth.toFixed(1);
		storage.libG     = this.libido.growth.toFixed(1);
		storage.chaG     = this.charisma.growth.toFixed(1);
		
		if(this.monsterName) storage.mName = this.monsterName;
		if(this.MonsterName) storage.MName = this.MonsterName;
		
		this.SaveStatusEffects(storage);
	},

	SaveStatusEffects : function(storage) {
		storage = storage || {};
		var s = this.combatStatus.ToStorage();
		if(s)
			storage.stat = s;
	},

	SavePersonalityStats : function(storage) {
		storage = storage || {};
		
		// Personality stats
		if(this.subDom.base   != 0) storage.subDom = this.subDom.base.toFixed();
		if(this.slut.base     != 0) storage.slut   = this.slut.base.toFixed();
		if(this.relation.base != 0) storage.rel    = this.relation.base.toFixed();
		if(this.drunkLevel    != 0) storage.drunk  = this.drunkLevel.toFixed(2);
	},

	SaveFlags : function(storage) {
		var flags = {};
		for(var flag in this.flags) {
			if(this.flags[flag] != 0)
				flags[flag] = this.flags[flag];
		}
		storage.flags = flags;
	},

	SavePerks : function(storage) {
		var perks = [];
		for(var i = 0; i < this.perks.length; ++i) {
			perks.push(this.perks[i].id);
		}
		storage.perks = perks;
	},

	SaveRecipes : function(storage) {
		storage = storage || {};
		
		if(this.recipes) {
			storage.recipes = [];
			for(var i = 0; i < this.recipes.length; i++)
				storage.recipes.push(this.recipes[i].id);
		}
	},

	SaveJobs : function(storage) {
		storage = storage || {};
		
		storage.jobs = {};
		for(var job in this.jobs) {
			var jd = this.jobs[job];
			var jobStorage = jd.ToStorage();
			if(jobStorage)
				storage.jobs[job] = jobStorage;
		}
		if(this.currentJob)
			storage.curJob = this.currentJob.name;
	},

	SaveEquipment : function(storage) {
		storage = storage || {};
		
		// Equipment
		if(this.weaponSlot)   storage.wep    = this.weaponSlot.id;
		if(this.topArmorSlot) storage.toparm = this.topArmorSlot.id;
		if(this.botArmorSlot) storage.botarm = this.botArmorSlot.id;
		if(this.acc1Slot)     storage.acc1   = this.acc1Slot.id;
		if(this.acc2Slot)     storage.acc2   = this.acc2Slot.id;
		
		if(this.strapOn)      storage.toy    = this.strapOn.id;
	},

	SavePregnancy : function(storage) {
		storage.preg = this.pregHandler.ToStorage();
	},

	SaveLactation : function(storage) {
		storage.lact = this.lactHandler.ToStorage();
	},

	//Only saves some stats from body
	/*
	* opts: cock
	*       balls
	*       vag
	*       ass
	*       breasts
	*       full
	*/
	SaveBodyPartial : function(storage, opts) {
		storage.body = this.body.ToStoragePartial(opts);
	},

	// Convert to a format easy to write to/from memory
	ToStorage : function() {
		var storage = {};
		
		storage.body = this.body.ToStorage();
		
		this.SaveCombatStats(storage);
		this.SavePersonalityStats(storage);
		this.SaveRecipes(storage);
		this.SaveJobs(storage);
		this.SaveEquipment(storage);
		this.SavePregnancy(storage);
		this.SaveLactation(storage);

		this.SaveFlags(storage);
		this.SaveSexFlags(storage);
		this.SavePerks(storage);
		
		return storage;
	},

	LoadCombatStats : function(storage) {
		this.name              = storage.name  || this.name;
		this.monsterName       = storage.mName || this.monsterName;
		this.MonsterName       = storage.MName || this.MonsterName;
		
		this.experience        = !isNaN(parseInt(storage.exp))     ? parseInt(storage.exp) : this.experience;
		this.level             = !isNaN(parseInt(storage.lvl))     ? parseInt(storage.lvl) : this.level;
		this.pendingStatPoints = !isNaN(parseInt(storage.points))  ? parseInt(storage.points) : this.pendingStatPoints;
		this.expToLevel        = !isNaN(parseInt(storage.exp2lvl)) ? parseInt(storage.exp2lvl) : this.expToLevel;
		this.sexperience       = !isNaN(parseInt(storage.sexp))    ? parseInt(storage.sexp) : this.sexperience;
		this.sexpToLevel       = !isNaN(parseInt(storage.sxp2lvl)) ? parseInt(storage.sxp2lvl) : this.sexpToLevel;
		this.sexlevel          = !isNaN(parseInt(storage.slvl))    ? parseInt(storage.slvl) : this.sexlevel;
		this.alchemyLevel      = !isNaN(parseInt(storage.alvl))    ? parseInt(storage.alvl) : this.alchemyLevel;
		this.curHp             = !isNaN(parseFloat(storage.curHp))   ? parseFloat(storage.curHp) : this.curHp;
		this.maxHp.base        = !isNaN(parseFloat(storage.maxHp))   ? parseFloat(storage.maxHp) : this.maxHp.base;
		this.curSp             = !isNaN(parseFloat(storage.curSp))   ? parseFloat(storage.curSp) : this.curSp;
		this.maxSp.base        = !isNaN(parseFloat(storage.maxSp))   ? parseFloat(storage.maxSp) : this.maxSp.base;
		this.curLust           = !isNaN(parseFloat(storage.curLust)) ? parseFloat(storage.curLust) : this.curLust;
		this.maxLust.base      = !isNaN(parseFloat(storage.maxLust)) ? parseFloat(storage.maxLust) : this.maxLust.base;
		// Main stats
		this.strength.base     = !isNaN(parseFloat(storage.str))     ? parseFloat(storage.str) : this.strength.base;
		this.stamina.base      = !isNaN(parseFloat(storage.sta))     ? parseFloat(storage.sta) : this.stamina.base;
		this.dexterity.base    = !isNaN(parseFloat(storage.dex))     ? parseFloat(storage.dex) : this.dexterity.base;
		this.intelligence.base = !isNaN(parseFloat(storage.inte))    ? parseFloat(storage.inte) : this.intelligence.base;
		this.spirit.base       = !isNaN(parseFloat(storage.spi))     ? parseFloat(storage.spi) : this.spirit.base;
		this.libido.base       = !isNaN(parseFloat(storage.lib))     ? parseFloat(storage.lib) : this.libido.base;
		this.charisma.base     = !isNaN(parseFloat(storage.cha))     ? parseFloat(storage.cha) : this.charisma.base;
		// Growth
		this.maxHp.growth        = !isNaN(parseFloat(storage.maxHpG))   ? parseFloat(storage.maxHpG) : this.maxHp.growth;
		this.maxSp.growth        = !isNaN(parseFloat(storage.maxSpG))   ? parseFloat(storage.maxSpG) : this.maxSp.growth;
		this.maxLust.growth      = !isNaN(parseFloat(storage.maxLustG)) ? parseFloat(storage.maxLustG) : this.maxLust.growth;
		this.strength.growth     = !isNaN(parseFloat(storage.strG))     ? parseFloat(storage.strG) : this.strength.growth;
		this.stamina.growth      = !isNaN(parseFloat(storage.staG))     ? parseFloat(storage.staG) : this.stamina.growth;
		this.dexterity.growth    = !isNaN(parseFloat(storage.dexG))     ? parseFloat(storage.dexG) : this.dexterity.growth;
		this.intelligence.growth = !isNaN(parseFloat(storage.inteG))    ? parseFloat(storage.inteG) : this.intelligence.growth;
		this.spirit.growth       = !isNaN(parseFloat(storage.spiG))     ? parseFloat(storage.spiG) : this.spirit.growth;
		this.libido.growth       = !isNaN(parseFloat(storage.libG))     ? parseFloat(storage.libG) : this.libido.growth;
		this.charisma.growth     = !isNaN(parseFloat(storage.chaG))     ? parseFloat(storage.chaG) : this.charisma.growth;

		this.LoadStatusEffects(storage);
	},

	LoadStatusEffects : function(storage) {
		if(storage.stat) {
			this.combatStatus.FromStorage(storage.stat);
		}
	},

	LoadPersonalityStats : function(storage) {
		// Personality stats
		this.subDom.base         = parseInt(storage.subDom)  || this.subDom.base;
		this.slut.base           = parseInt(storage.slut)    || this.slut.base;
		this.relation.base       = parseInt(storage.rel)     || this.relation.base;
		this.drunkLevel          = parseFloat(storage.drunk) || this.drunkLevel;
	},

	LoadRecipes : function(storage) {
		if(storage.recipes) {
			this.recipes = [];
			for(var i = 0; i < storage.recipes.length; i++)
				this.recipes.push(ItemIds[storage.recipes[i]]);
		}
	},

	LoadJobs : function(storage) {
		if(storage.jobs) {
			for(var job in this.jobs) {
				var jd = this.jobs[job];
				jd.FromStorage(storage.jobs[jd.job.name]);
			}
		}
		if(storage.curJob)
			this.currentJob = Jobs[storage.curJob];
	},

	LoadEquipment : function(storage) {
		if(storage.wep)    this.weaponSlot   = ItemIds[storage.wep];
		if(storage.toparm) this.topArmorSlot = ItemIds[storage.toparm];
		if(storage.botarm) this.botArmorSlot = ItemIds[storage.botarm];
		if(storage.acc1)   this.acc1Slot     = ItemIds[storage.acc1];
		if(storage.acc2)   this.acc2Slot     = ItemIds[storage.acc2];
		
		if(storage.toy)    this.strapOn      = ItemIds[storage.toy];
	},

	LoadFlags : function(storage) {
		for(var flag in storage.flags)
			this.flags[flag] = parseInt(storage.flags[flag]);
	},

	LoadSexFlags : function(storage) {
		for(var flag in storage.sex)
			this.sex[flag] = parseInt(storage.sex[flag]);
	},

	LoadPerks : function(storage) {
		if(storage.perks) {
			this.perks = [];
			for(var i = 0; i < storage.perks.length; i++) {
				this.perks.push(PerkIds[storage.perks[i]]);
			}
		}
	},

	LoadPregnancy : function(storage) {
		this.pregHandler.FromStorage(storage.preg);
	},

	LoadLactation : function(storage) {
		this.lactHandler.FromStorage(storage.lact);
	},

	FromStorage : function(storage) {
		storage = storage || {};
		
		if(storage.body) {
			this.body = new Body(this);
			this.body.FromStorage(storage.body);
		}
		this.LoadPregnancy(storage);
		this.LoadLactation(storage);
		
		// Load flags
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);
		this.LoadCombatStats(storage);
		this.LoadPersonalityStats(storage);
		
		this.LoadRecipes(storage);
		this.LoadJobs(storage);
		this.LoadEquipment(storage);
		this.LoadPerks(storage);
		
		this.RecallAbilities(); // TODO: Implement for special abilitiy sources (flag dependent)
		this.SetLevelBonus();
		this.Equip();
	},

	RecallAbilities : function() {
		for(var job in this.jobs) {
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
	},
};

export { EntitySave };
