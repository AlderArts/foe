import { Entity } from './entity';
import { StatusEffect } from './statuseffect';

Entity.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.name + " acts! Rawr!");
	Text.NL();
	Text.Flush();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	Abilities.Attack.Use(encounter, this, t);
}


//TODO Structure
Entity.prototype.FinishCastInternal = function(ability, encounter, caster, targets) {
	Text.Flush();
	
	Gui.NextPrompt(function() {
		if(encounter)
			encounter.CombatTick();
		else
			PrintDefaultOptions();
	});
}

// Can be overrided to allow for selective cancellation
Entity.prototype.CanBeInterrupted = function(ability, encounter, caster, result) {
	return true;
}

//Note: bitmask in order to stack multiple
let TargetStrategy = {
	None      : 0, //Not used
	NearDeath : 1,
	LowHp     : 2,
	LowAbsHp  : 4,
	HighHp    : 8,
	HighAbsHp : 16,
	Leader    : 32,
	SPHunt    : 64,
	LPHunt    : 128
};

Entity.prototype.GetCombatEntry = function(encounter) {
	var ent = this;
	var found;
	_.each(encounter.combatOrder, function(it) {
		if(it.entity == ent) {
			found = it;
			return false;
		}
	});
	return found;
}

function GetAggroEntry(activeChar, entity) {
	var found;
	_.each(activeChar.aggro, function(it) {
		if(it.entity == entity) {
			found = it;
			return false;
		}
	});
	return found;
}

Entity.prototype.GetPartyTarget = function(encounter, activeChar, ally) {
	var isEnemy = activeChar.isEnemy;
	var confuse = activeChar.entity.combatStatus.stats[StatusEffect.Confuse];
	if(confuse)
		isEnemy = !isEnemy;
	if(ally)
		isEnemy = !isEnemy;
	
	if(isEnemy)
		return party;
	else
		return encounter.enemy;
}

Entity.prototype.GetSingleTarget = function(encounter, activeChar, strategy, ally) {
	var isEnemy = activeChar.isEnemy;
	var confuse = activeChar.entity.combatStatus.stats[StatusEffect.Confuse];
	if(confuse)
		isEnemy = !isEnemy;
	if(ally)
		isEnemy = !isEnemy;
	
	// Fetch all potential targets
	var targets;
	if(isEnemy)
		targets = encounter.GetLivePartyArray();
	else
		targets = encounter.GetLiveEnemyArray();
	
	strategy = strategy || TargetStrategy.None;
	
	var aggro;
	if(ally) {
		// cleanup
		activeChar.aggroAllies = _.reject(activeChar.aggroAllies, function(it) {
			return it.entity.Incapacitated();
		});

		// adding new aggro targets
		_.each(targets, function(t) {
			if(!GetAggroEntry(activeChar, t))
				activeChar.aggroAllies.push({entity: t, aggro: 1});
		});

		// make a temporary aggro array
		aggro = _.clone(activeChar.aggroAllies);
	}
	else {
		// cleanup
		activeChar.aggro = _.reject(activeChar.aggro, function(it) {
			return it.entity.Incapacitated();
		});

		// adding new aggro targets
		_.each(targets, function(t) {
			if(!GetAggroEntry(activeChar, t))
				activeChar.aggro.push({entity: t, aggro: 1});
		});

		// make a temporary aggro array
		aggro = _.clone(activeChar.aggro);
	}
	
	// Strategies
	if(strategy & TargetStrategy.NearDeath) {
		_.each(aggro, function(a) {
			var hp  = 1 - a.entity.HPLevel();
			hp *= hp;
			a.aggro *= hp;
		});
	}
	if(strategy & TargetStrategy.LowHp) {
		_.each(aggro, function(a) {
			var hp  = 1 - a.entity.HPLevel();
			a.aggro *= hp;
		});
	}
	if(strategy & TargetStrategy.HighHp) {
		_.each(aggro, function(a) {
			var hp  = a.entity.HPLevel();
			a.aggro *= hp;
		});
	}
	
	// Normalize hp
	var min = _.min(aggro.length, function(a) {
		return a.entity.curHp;
	});
	var max = _.max(aggro.length, function(a) {
		return a.entity.curHp;
	});
	
	var span = max - min;
	if(strategy & TargetStrategy.LowAbsHp) {
		_.each(aggro, function(a) {
			var hp = (a.entity.curHp - min) / span;
			var hp  = 1 - hp;
			a.aggro *= hp;
		});
	}
	if(strategy & TargetStrategy.HighAbsHp) {
		_.each(aggro, function(a) {
			var hp = (a.entity.curHp - min) / span;
			a.aggro *= hp;
		});
	}
	
	if(strategy & TargetStrategy.Leader) { //Test, this might be wrong
		if(aggro.length > 0)
			aggro[0].aggro *= 5;
	}
	if(strategy & TargetStrategy.SPHunt) {
		for(var i = 0; i < aggro.length; i++) {
			var sp = Math.log(aggro[i].entity.SP());
			aggro[i].aggro *= sp;
		}
	}
	if(strategy & TargetStrategy.LPHunt) {
		for(var i = 0; i < aggro.length; i++) {
			var lp = Math.log(aggro[i].entity.Lust());
			aggro[i].aggro *= lp;
		}
	}
	
	// TODO: more complex targetting
	/*
	if(strategy & TargetStrategy.None) {
		var val = this.effect.statusDef[i];
		val
			var mod = "+";
			if(val < 0) mod = "-"; 
	}val*100 + ""% + mod
	*/
	
	// Weigthed random selection
	var sum = _.sum(aggro, function(a) {
		return a.aggro;
	});
	
	// Pick a target
	var step = Math.random() * sum;
	
	for(var i = 0; i < aggro.length; i++) {
		step -= aggro[i].aggro;
		if(step <= 0.0) return aggro[i].entity;
	}
	
	return _.sample(aggro).entity;
}

//STATS
Entity.prototype.HP = function() {
	var buff = this.combatStatus.stats[StatusEffect.Buff];
	var mod = (buff && buff.HP) ? buff.HP : 1;
	return Math.ceil((this.maxHp.Get() + Math.pow((this.strength.Get() + this.stamina.Get())/2, 1.3)) * mod);
}

Entity.prototype.SP = function() {
	var buff = this.combatStatus.stats[StatusEffect.Buff];
	var mod = (buff && buff.SP) ? buff.SP : 1;
	return Math.ceil((this.maxSp.Get() + Math.pow((this.spirit.Get() + this.intelligence.Get() + this.stamina.Get())/3, 1.3)) * mod);
}

Entity.prototype.Lust = function() {
	var buff = this.combatStatus.stats[StatusEffect.Buff];
	var mod = (buff && buff.LP) ? buff.LP : 1;
	return Math.ceil((this.maxLust.Get() + Math.pow(this.libido.Get(), 1.3)) * mod);
}

Entity.prototype.MinLust = function() {
	return 0; // TODO: Implement
}

// STATS
Entity.prototype.Str = function() {
	var buff = this.combatStatus.stats[StatusEffect.Buff];
	if(buff && buff.Str)
		return this.strength.Get() * buff.Str;
	else
		return this.strength.Get();
}
Entity.prototype.Sta = function() {
	var buff = this.combatStatus.stats[StatusEffect.Buff];
	if(buff && buff.Sta)
		return this.stamina.Get() * buff.Sta;
	else
		return this.stamina.Get();
}
Entity.prototype.Dex = function() {
	var buff = this.combatStatus.stats[StatusEffect.Buff];
	if(buff && buff.Dex)
		return this.dexterity.Get() * buff.Dex;
	else
		return this.dexterity.Get();
}
Entity.prototype.Int = function() {
	var buff = this.combatStatus.stats[StatusEffect.Buff];
	if(buff && buff.Int)
		return this.intelligence.Get() * buff.Int;
	else
		return this.intelligence.Get();
}
Entity.prototype.Spi = function() {
	var buff = this.combatStatus.stats[StatusEffect.Buff];
	if(buff && buff.Spi)
		return this.spirit.Get() * buff.Spi;
	else
		return this.spirit.Get();
}
Entity.prototype.Lib = function() {
	var buff = this.combatStatus.stats[StatusEffect.Buff];
	if(buff && buff.Lib)
		return this.libido.Get() * buff.Lib;
	else
		return this.libido.Get();
}
Entity.prototype.Cha = function() {
	var buff = this.combatStatus.stats[StatusEffect.Buff];
	if(buff && buff.Cha)
		return this.charisma.Get() * buff.Cha;
	else
		return this.charisma.Get();
}

// TODO: Certain status effects like paralyze should also count as incapacitated
Entity.prototype.Incapacitated = function() {
	return this.curHp <= 0; // || this.curLust >= this.Lust();
}
Entity.prototype.Inhibited = function() {
	if(this.combatStatus.stats[StatusEffect.Freeze]  != null) return true;
	if(this.combatStatus.stats[StatusEffect.Numb]    != null) return true;
	if(this.combatStatus.stats[StatusEffect.Petrify] != null) return true;
	if(this.combatStatus.stats[StatusEffect.Blind]   != null) return true;
	if(this.combatStatus.stats[StatusEffect.Sleep]   != null) return true;
	if(this.combatStatus.stats[StatusEffect.Enrage]  != null) return true;
	if(this.combatStatus.stats[StatusEffect.Fatigue] != null) return true;
	if(this.combatStatus.stats[StatusEffect.Limp]    != null) return true;
	
	return false;
}

Entity.prototype.AddHPFraction = function(fraction) {
	fraction = fraction || 0;
	var old = this.curHp;
	this.curHp += fraction * this.HP();
	if(this.curHp > this.HP()) this.curHp = this.HP();
	if(this.curHp < 0) {
		this.curHp = 0;
		if(curEncounter)
			curEncounter.OnIncapacitate(this);
	}
	
	if(fraction > 0 && this.combatStatus.stats[StatusEffect.Bleed])
		this.combatStatus.stats[StatusEffect.Bleed] = null;
	return this.curHp - old;
}
Entity.prototype.AddSPFraction = function(fraction) {
	fraction = fraction || 0;
	var old = this.curSp;
	this.curSp += fraction * this.SP();
	if(this.curSp > this.SP()) this.curSp = this.SP();
	if(this.curSp < 0) this.curSp = 0;
	return this.curSp - old;
}
Entity.prototype.AddLustFraction = function(fraction) { // 0..1
	fraction = fraction || 0;
	var old = this.curLust;
	this.curLust += fraction * this.Lust();
	if(this.curLust > this.Lust()) this.curLust = this.Lust();
	if(this.curLust < 0) this.curLust = 0;
	return this.curLust - old;
}

Entity.prototype.PhysDmgHP = function(encounter, caster, val) {
	var parse = {
		possessive : this.possessive()
	};
	var ent = this;
	
	//Healing
	if(val >= 0) return true;
	
	// Check for sleep
	if(this.combatStatus.stats[StatusEffect.Sleep] != null) {
		this.combatStatus.stats[StatusEffect.Sleep] = null;
	}
	// Check for confuse
	if(this.combatStatus.stats[StatusEffect.Confuse] != null) {
		this.combatStatus.stats[StatusEffect.Confuse].OnFade(encounter, this);
	}
	
	// Check for counter
	if(this.combatStatus.stats[StatusEffect.Counter] != null) {
		var onhit = this.combatStatus.stats[StatusEffect.Counter].OnHit;
		
		this.combatStatus.stats[StatusEffect.Counter].hits--;
		if(this.combatStatus.stats[StatusEffect.Counter].hits <= 0)
			this.combatStatus.stats[StatusEffect.Counter] = null;

		var ret;
		if(onhit)
			ret = onhit(encounter, this, caster, val);

		return ret;
	}
	// Check for decoy
	var decoy = this.combatStatus.stats[StatusEffect.Decoy];
	if(decoy != null) {
		var num  = decoy.copies;
		var toHit = 1 / (num + 1);
		if(Math.random() < toHit)
			return true;
		
		var func = decoy.func || function() {
			parse["oneof"] = num > 1 ? " one of" : "";
			parse["copy"]  = num > 1 ? "copies" : "copy";
			Text.Add("The attack is absorbed by[oneof] [possessive] [copy]!", parse);
			Text.NL();
			ent.combatStatus.stats[StatusEffect.Decoy].copies--;
			if(ent.combatStatus.stats[StatusEffect.Decoy].copies <= 0)
				ent.combatStatus.stats[StatusEffect.Decoy] = null;
			Text.Flush();
			return false;
		}
		return func(caster, val);
	}
	
	return true;
}
Entity.prototype.AddHPAbs = function(val) {
	val = val || 0;
	var old = this.curHp;
	this.curHp += val;
	if(this.curHp > this.HP()) this.curHp = this.HP();
	if(this.curHp < 0) {
		this.curHp = 0;
		if(curEncounter)
			curEncounter.OnIncapacitate(this);
	}
	
	if(val > 0 && this.combatStatus.stats[StatusEffect.Bleed])
		this.combatStatus.stats[StatusEffect.Bleed] = null;
	return this.curHp - old;
}
Entity.prototype.AddSPAbs = function(val) {
	val = val || 0;
	var old = this.curSp;
	this.curSp += val;
	if(this.curSp > this.SP()) this.curSp = this.SP();
	if(this.curSp < 0) this.curSp = 0;
	return this.curSp - old;
}
Entity.prototype.AddLustAbs = function(val) {
	val = val || 0;
	var old = this.curLust;
	this.curLust += val;
	if(this.curLust > this.Lust()) this.curLust = this.Lust();
	if(this.curLust < 0) this.curLust = 0;
	return this.curLust - old;
}

Entity.prototype.RestFull = function() {
	this.curHp = this.HP();
	this.curSp = this.SP();
	this.curLust = this.MinLust();
	
	//this.combatStatus.Clear();
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
	
	this.statusWear = [];
}

// Balance mana, lust and hp
let BalanceStats = function() {
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

Entity.prototype.AddLustOverTime = function(hours) {
	// TODO: Function
	var lustRate = this.libido.Get() / this.spirit.Get();
	lustRate /= 48;
	var slutFactor = ((this.slut.Get()/100) + 1);
	
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
	var ini = Math.sqrt(2 * this.Dex() + this.Int());
	var haste = this.combatStatus.stats[StatusEffect.Haste];
	if(haste) ini *= haste.factor;
	var slow  = this.combatStatus.stats[StatusEffect.Slow];
	if(slow)  ini /= slow.factor;
	return ini;
}

// Combat functions (calculated)
Entity.prototype.PAttack = function() {
	// Stat based
	var atkStat = (this.Str() * 3 + this.Sta() + this.Dex()) / 2;
	// Weapon strength based
	var atkWep = this.atkMod;
	
	// Currently range the attack between 0.9 and 1.1
	var atkRand = _.random(0.9, 1.1);
	
	return atkStat * atkWep * atkRand;
}

// TODO: Add perk/elemental/special effects
Entity.prototype.PDefense = function() {
	// Stat based
	var defStat = this.Sta() * 3 + this.Spi();
	if(defStat < 0) defStat = 0;
	// Defense based on armor
	var defArmor = this.defMod;
	// Reduce effect of armor due to armor penetration (TODO)
	
	// Currently range the attack between 0.9 and 1.1
	var defRand = _.random(0.9, 1.1);
	
	// Combine the result
	return defStat * defArmor * defRand;
}

// TODO temp
Entity.prototype.PHit = function() {
	var hitStat = 3 * this.Dex() + this.Int() + this.Cha();
	
	var blind = this.combatStatus.stats[StatusEffect.Blind];
	if(blind) {
		hitStat *= (1 - blind.str);
	}
	
	return hitStat;
}

// TODO temp
Entity.prototype.PEvade = function(attack) {
	var evadeStat = 3 * this.Dex() + this.Int() + this.Cha();
	
	return evadeStat;
}

// TODO temp
Entity.prototype.MAttack = function() {
	var magStat = (3 * this.Int() + this.Spi() + this.Cha()) / 2;
	
	var magRand = _.random(0.9, 1.1);
	
	return magStat * magRand;
}

// TODO temp
Entity.prototype.MDefense = function() {
	var magDef = this.Sta() + 3 * this.Spi();
	if(magDef < 0) magDef = 0;
	
	var magRand = _.random(0.9, 1.1);
	
	return magDef * magRand;
}

Entity.prototype.MHit = function() {
	var hitStat = 3 * this.Int() + this.Spi() + this.Cha();
	
	return hitStat;
}

// TODO temp
Entity.prototype.MEvade = function(attack) {
	var evadeStat = 3 * this.Spi() + this.Int() + this.Dex();
	
	return evadeStat;
}

Entity.prototype.LAttack = function() {
	// Stat based
	var sedStat = (this.Dex() + 2 * this.Lib() + 2 * this.Cha()) / 2;
	/*
	var sedLust = this.LustLevel();
	*/
	// Armor sluttiness based (TODO)
	var sedArmor = 1;
	
	// Currently range the attack between 0.9 and 1.1
	var sedRand = _.random(0.9, 1.1);
	
	return sedStat /* * sedLust*/ * sedArmor * sedRand;
}

Entity.prototype.LDefense = function() {
	// Stat based
	var comStat = 2 * this.Sta() + this.Spi() + this.Cha();
	if(comStat < 0) comStat = 0;

	// Lust and libido based
//	var comLust = this.libido.Get() + this.LustLevel();
	
	
	// Currently range the attack between 0.9 and 1.1
	var comRand = _.random(0.9, 1.1);
	
	return comStat /* * comLust*/ * comRand;
}

// TODO temp
Entity.prototype.LHit = function() {
	var hitStat = 3 * this.Lib() + 2 * this.Cha();
	
	return hitStat;
}

// TODO temp
Entity.prototype.LEvade = function(attack) {
	var evadeStat = 3 * this.Spi() + this.Sta() + this.Int();
	
	var blind = this.combatStatus.stats[StatusEffect.Blind];
	if(blind) {
		evadeStat *= (1 + blind.str);
	}
	
	return evadeStat;
}




Entity.prototype.Resistance = function(type) {
	var res   = this.statusDef[type]     || 0;
	var gear  = this.statusDefGear[type] || 0;
	var wear  = this.statusWear[type]    || 0;
	var curse = this.combatStatus.stats[StatusEffect.Curse];
	var total = res + gear - wear;
	if(curse) {
		total -= curse.str;
	}
	//TODO other factors
	return total;
}

Entity.prototype.AddResistanceWear = function(type, wear) {
	wear = wear || 0;
	if(this.statusWear[type]) {
		this.statusWear[type] += wear;
	}
	else {
		this.statusWear[type] = wear;
	}
}

export { TargetStrategy, BalanceStats };
