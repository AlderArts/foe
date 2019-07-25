/**
 * @author alder
 */

import { DamageType } from './ability';
import { CurEncounter } from './combat-data';

let Status = {};

let StatusEffect = {
	Burn     : 0, //OK
	Freeze   : 1, //OK
	Numb     : 2, //OK
	Petrify  : 3,
	Venom    : 4, //OK
	Blind    : 5, //OK
	Siphon   : 6, //OK
	Seal     : 7,
	Sleep    : 8, //OK
	Enrage   : 9,
	Fatigue  : 10,
	Bleed    : 11, //OK
	Haste    : 12, //OK
	Slow     : 13, //OK
	Regen    : 14,
	Boon     : 15,
	Horny    : 16, //OK
	Aroused  : 17, //WIP
	Limp     : 18, //OK
	Bimbo    : 19,
	Decoy    : 20, //OK
	Counter  : 21, //OK
	Confuse  : 22, //OK
	Full     : 23, //OK
	Weakness : 24, //OK
	Buff     : 25, //OK
	Curse    : 26, 

	LAST     : 27
};

Status.Keys = Object.keys(StatusEffect);

Status.Venom = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for poison resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Venom));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Venom, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Venom] = 0;
	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply poison
	target.combatStatus.stats[StatusEffect.Venom] = {
		turns   : turns,
		str     : opts.str || 1,
		dmg     : opts.dmg || 0,
		oocDmg  : opts.oocDmg,
		Tick    : Status.Venom.Tick
	};

	return true;
}
//TODO fix formula
Status.Venom.Tick = function(target) {
	var damageType = new DamageType({mNature : this.str});
	var atkRand = 0.05 * (Math.random() - 0.5) + 1;
	var dmg = this.dmg * atkRand * target.HP();
	dmg = damageType.ApplyDmgType(target.elementDef, dmg);
	dmg = Math.floor(dmg);

	target.AddHPAbs(-dmg);

	this.turns--;
	// Remove venom effect
	if(this.turns <= 0 || target.curHp <= 0) {
		target.combatStatus.stats[StatusEffect.Venom] = null;
	}
}


Status.Burn = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for burn resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Burn));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Burn, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Burn] = 0;
	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply effect
	target.combatStatus.stats[StatusEffect.Burn] = {
		turns   : turns,
		str     : opts.str || 1,
		dmg     : opts.dmg || 0,
		oocDmg  : opts.oocDmg,
		Tick    : Status.Burn.Tick
	};

	return true;
}
//TODO fix formula
Status.Burn.Tick = function(target) {
	var damageType = new DamageType({mFire : this.str});
	var atkRand = 0.05 * (Math.random() - 0.5) + 1;
	var dmg = this.dmg * atkRand * target.HP();
	dmg = damageType.ApplyDmgType(target.elementDef, dmg);
	dmg = Math.floor(dmg);

	target.AddHPAbs(-dmg);

	this.turns--;
	// Remove burn effect
	if(this.turns <= 0 || target.curHp <= 0) {
		target.combatStatus.stats[StatusEffect.Burn] = null;
	}
}


Status.Freeze = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for freeze resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Freeze));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Freeze, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Freeze] = 0;
	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply effect
	target.combatStatus.stats[StatusEffect.Freeze] = {
		turns   : turns,
		str     : opts.str || 1,
		proc    : opts.proc || 1,
		Tick    : Status.Freeze.Tick
	};

	return true;
}
Status.Freeze.Tick = function(target) {
	this.turns--;
	// Remove freeze effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Freeze] = null;
	}
}


Status.Numb = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for numb resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Numb));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Numb, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Numb] = 0;
	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply effect
	target.combatStatus.stats[StatusEffect.Numb] = {
		turns   : turns,
		proc    : opts.proc || 1,
		Tick    : Status.Numb.Tick
	};

	return true;
}
Status.Numb.Tick = function(target) {
	this.turns--;
	// Remove numb effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Numb] = null;
	}
}


Status.Blind = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for blind resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Blind));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Blind, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Blind] = 0;
	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	var str = opts.str || 0;
	// Apply effect
	target.combatStatus.stats[StatusEffect.Blind] = {
		turns   : turns,
		str     : str,
		Tick    : Status.Blind.Tick
	};

	return true;
}
Status.Blind.Tick = function(target) {
	this.turns--;
	// Remove blind effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Blind] = null;
	}
}


Status.Siphon = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for siphon resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Siphon));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Siphon, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Siphon] = 0;
	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply effect
	target.combatStatus.stats[StatusEffect.Siphon] = {
		turns   : turns,
		hp      : opts.hp || 0,
		sp      : opts.sp || 0,
		lp      : opts.lp || 0,
		caster  : opts.caster || null,
		Tick    : Status.Siphon.Tick
	};

	return true;
}
Status.Siphon.Tick = function(target) {
	this.turns--;

	var hp = target.AddHPAbs(-this.hp);
	var sp = target.AddSPAbs(-this.sp);
	var lp = target.AddLustAbs(-this.lp);
	if(this.caster) {
		this.caster.AddHPAbs(-hp);
		this.caster.AddSPAbs(-sp);
		this.caster.AddLustAbs(-lp);
	}

	// Remove siphon effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Siphon] = null;
	}
}

Status.Sleep = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for sleep resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Sleep));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Sleep, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Sleep] = 0;
	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply effect
	target.combatStatus.stats[StatusEffect.Sleep] = {
		turns   : turns,
		Tick    : Status.Sleep.Tick
	};

	return true;
}
Status.Sleep.Tick = function(target) {
	this.turns--;
	// Remove sleep effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Sleep] = null;
	}
}


Status.Bleed = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for poison resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Bleed));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Bleed, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Bleed] = 0;
	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply poison
	target.combatStatus.stats[StatusEffect.Bleed] = {
		turns   : turns,
		dmg     : opts.dmg || 0,
		oocDmg  : opts.oocDmg,
		Tick    : Status.Bleed.Tick
	};

	return true;
}
//TODO fix formula
Status.Bleed.Tick = function(target) {
	var atkRand = 0.05 * (Math.random() - 0.5) + 1;
	var dmg = this.dmg * atkRand * target.HP();
	dmg = Math.floor(dmg);

	target.AddHPAbs(-dmg);

	this.turns--;
	// Remove bleed effect
	if(this.turns <= 0 || target.curHp <= 0) {
		target.combatStatus.stats[StatusEffect.Bleed] = null;
	}
}


// TODO: Use as heal of slow?
Status.Haste = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	var factor = opts.factor || 2;
	// Apply effect
	target.combatStatus.stats[StatusEffect.Haste] = {
		turns   : turns,
		factor  : factor,
		Tick    : Status.Haste.Tick
	};

	return true;
}
Status.Haste.Tick = function(target) {
	this.turns--;
	// Remove haste effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Haste] = null;
	}
}


// TODO: Remove haste?
Status.Slow = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for slow resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Slow));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Slow, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Slow] = 0;

	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	var factor = opts.factor || 2;
	// Apply effect
	target.combatStatus.stats[StatusEffect.Slow] = {
		turns   : turns,
		factor  : factor,
		Tick    : Status.Slow.Tick
	};

	return true;
}
Status.Slow.Tick = function(target) {
	this.turns--;
	// Remove slow effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Slow] = null;
	}
}


Status.Horny = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for horny resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Horny));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Horny, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Horny] = 0;
	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply horny (lust poison)
	target.combatStatus.stats[StatusEffect.Horny] = {
		turns   : turns,
		str     : opts.str || 1,
		dmg     : opts.dmg || 0,
		oocDmg  : opts.oocDmg,
		Tick    : Status.Horny.Tick
	};

	return true;
}
//TODO fix formula?
Status.Horny.Tick = function(target) {
	var damageType = new DamageType({lust : this.str});
	var atkRand = 0.05 * (Math.random() - 0.5) + 1;
	var dmg = this.dmg * atkRand * target.Lust();
	dmg = damageType.ApplyDmgType(target.elementDef, dmg);
	dmg = Math.floor(dmg);
	target.AddLustAbs(dmg);

	this.turns--;
	// Remove horny effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Horny] = null;
	}
}

//All modifiers are multipliers, so 1.05 means 5% extra.
Status.Aroused = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	var old = target.combatStatus.stats[StatusEffect.Aroused];

	var hours = opts.hours || 0;
	var fer   = opts.fer   || 0;

	if(old) {
		hours = Math.max(old.hours, hours);
		fer   = Math.max(old.fer, fer);
	}
	// Apply weakness
	target.combatStatus.stats[StatusEffect.Aroused] = {
		hours     : hours,

		fer       : fer,

		Update    : Status.Aroused.Update,
		ToStorage : Status.Aroused.ToStorage
	};
	// Heals limp
	if(target.combatStatus.stats[StatusEffect.Limp])
		target.combatStatus.stats[StatusEffect.Limp] = null;

	return true;
}
Status.Aroused.Update = function(target, step) {
	this.hours -= step;
	if(this.hours <= 0) {
		target.combatStatus.stats[StatusEffect.Aroused] = null;
	}
}
Status.Aroused.ToStorage = function() {
	var ret = {};
	if(this.hours) ret["hours"] = this.hours.toFixed(2);

	if(this.fer != 0) ret["fer"] = this.fer.toFixed(2);

	return ret;
}
Status.Aroused.FromStorage = function(storage) {
	storage = storage || {};
	var obj = {};
	if(storage["hours"]) obj.hours = parseFloat(storage["hours"]);

	if(storage["fer"]) obj.fer = parseFloat(storage["fer"]);
	else obj.fer = 0;

	obj.Update    = Status.Aroused.Update;
	obj.ToStorage = Status.Limp.ToStorage;

	return obj;
}

//All modifiers are multipliers, so 1.05 means 5% extra.
Status.Limp = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	var old = target.combatStatus.stats[StatusEffect.Limp];

	var hours = opts.hours || 0;
	var fer   = opts.fer   || 0;

	if(old) {
		hours = Math.max(old.hours, hours);
		fer   = Math.min(old.fer, fer);
	}
	// Apply weakness
	target.combatStatus.stats[StatusEffect.Limp] = {
		hours     : hours,

		fer       : fer,

		Update    : Status.Limp.Update,
		ToStorage : Status.Limp.ToStorage
	};

	// Heals aroused
	if(target.combatStatus.stats[StatusEffect.Aroused])
		target.combatStatus.stats[StatusEffect.Aroused] = null;

	return true;
}
Status.Limp.Update = function(target, step) {
	this.hours -= step;
	if(this.hours <= 0) {
		target.combatStatus.stats[StatusEffect.Limp] = null;
	}
}
Status.Limp.ToStorage = function() {
	var ret = {};
	if(this.hours) ret["hours"] = this.hours.toFixed(2);

	if(this.fer != 0) ret["fer"] = this.fer.toFixed(2);

	return ret;
}
Status.Limp.FromStorage = function(storage) {
	storage = storage || {};
	var obj = {};
	if(storage["hours"]) obj.hours = parseFloat(storage["hours"]);

	if(storage["fer"]) obj.fer = parseFloat(storage["fer"]);
	else obj.fer = 0;

	obj.Update    = Status.Limp.Update;
	obj.ToStorage = Status.Limp.ToStorage;

	return obj;
}

Status.Decoy = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Apply decoy
	target.combatStatus.stats[StatusEffect.Decoy] = {
		copies  : opts.copies,
		func    : opts.func
	};

	return true;
}

/*
 * OnHit = function(enc, target, attacker, dmg)
 */
Status.Counter = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	var hits  = opts.hits || 0;
	// Apply counter
	target.combatStatus.stats[StatusEffect.Counter] = {
		turns : turns,
		hits  : hits,
		OnHit : opts.OnHit,
		Tick  : Status.Counter.Tick
	};

	return true;
}
Status.Counter.Tick = function(target) {
	this.turns--;
	// Remove counter effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Counter] = null;
	}
}

// opts.exp is a modifier that adds extra exp. 1.05 means 5% extra, rounded up.
Status.Full = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Apply decoy
	target.combatStatus.stats[StatusEffect.Full] = {
		hours     : opts.hours,
		exp       : opts.exp,

		Update    : Status.Full.Update,
		ToStorage : Status.Full.ToStorage
	};

	return true;
}
Status.Full.Update = function(target, step) {
	this.hours -= step;
	// Remove full effect
	if(this.hours <= 0) {
		target.combatStatus.stats[StatusEffect.Full] = null;
	}
}
Status.Full.ToStorage = function() {
	var ret = {};
	if(this.hours) ret["hours"] = this.hours.toFixed(2);
	if(this.exp)   ret["exp"]   = this.exp.toFixed(2);

	return ret;
}
Status.Full.FromStorage = function(storage) {
	storage = storage || {};
	var obj = {};
	if(storage["hours"]) obj.hours = parseFloat(storage["hours"]);
	if(storage["exp"])   obj.exp   = parseFloat(storage["exp"]);

	obj.Update    = Status.Full.Update;
	obj.ToStorage = Status.Full.ToStorage;
	return obj;
}

/*
 * func = function(encounter, activeChar)
 */
Status.Confuse = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for confuse resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Confuse));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Confuse, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Confuse] = 0;

	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply confuse
	target.combatStatus.stats[StatusEffect.Confuse] = {
		turns  : turns,
		func   : opts.func || null,
		Tick   : Status.Confuse.Tick,
		OnFade : opts.fade || Status.Confuse.OnFade
	};

	// cleanup
	for(var i=0,j=CurEncounter().combatOrder.length; i<j; i++){
		var c = CurEncounter().combatOrder[i];
		if(c.entity == target) {
			c.aggro = [];
			break;
		}
	}

	return true;
}
Status.Confuse.Tick = function(target) {
	this.turns--;
	// Remove confuse effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Confuse] = null;
	}
}
Status.Confuse.OnFade = function(encounter, entity) {
	// cleanup
	for(var i=0,j=encounter.combatOrder.length; i<j; i++){
		var c = encounter.combatOrder[i];
		if(c.entity == entity) {
			c.aggro = [];
			break;
		}
	}
	// Remove confuse effect
	entity.combatStatus.stats[StatusEffect.Confuse] = null;
}

Status.Weakness = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for weakness resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Weakness));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Weakness, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Weakness] = 0;

	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply weakness
	target.combatStatus.stats[StatusEffect.Weakness] = {
		turns : turns,
		str   : opts.str || 1,
		Tick  : Status.Weakness.Tick
	};

	return true;
}
Status.Weakness.Tick = function(target) {
	this.turns--;
	// Remove weakness effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Weakness] = null;
	}
}

//All modifiers are multipliers, so 1.05 means 5% extra.
Status.Buff = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	var hours = opts.hours || 0;
	// Apply buff
	target.combatStatus.stats[StatusEffect.Buff] = {
		hours     : hours,

		Str       : opts.Str,
		Sta       : opts.Sta,
		Dex       : opts.Dex,
		Int       : opts.Int,
		Spi       : opts.Spi,
		Lib       : opts.Lib,
		Cha       : opts.Cha,
		HP        : opts.HP,
		SP        : opts.SP,
		LP        : opts.LP,

		Update    : Status.Buff.Update,
		ToStorage : Status.Buff.ToStorage
	};

	return true;
}
Status.Buff.Update = function(target, step) {
	this.hours -= step;
	if(this.hours <= 0) {
		target.combatStatus.stats[StatusEffect.Buff] = null;
	}
}
Status.Buff.ToStorage = function() {
	var ret = {};
	if(this.hours) ret["hours"] = this.hours.toFixed(2);

	if(this.Str) ret["Str"] = this.Str.toFixed(2);
	if(this.Sta) ret["Sta"] = this.Sta.toFixed(2);
	if(this.Dex) ret["Dex"] = this.Dex.toFixed(2);
	if(this.Int) ret["Int"] = this.Int.toFixed(2);
	if(this.Spi) ret["Spi"] = this.Spi.toFixed(2);
	if(this.Lib) ret["Lib"] = this.Lib.toFixed(2);
	if(this.Cha) ret["Cha"] = this.Cha.toFixed(2);
	if(this.HP)  ret["HP"]  = this.HP.toFixed(2);
	if(this.SP)  ret["SP"]  = this.SP.toFixed(2);
	if(this.LP)  ret["LP"]  = this.LP.toFixed(2);
	return ret;
}
Status.Buff.FromStorage = function(storage) {
	storage = storage || {};
	var obj = {};
	if(storage["hours"]) obj.hours = parseFloat(storage["hours"]);

	if(storage["Str"]) obj.Str = parseFloat(storage["Str"]);
	if(storage["Sta"]) obj.Sta = parseFloat(storage["Sta"]);
	if(storage["Dex"]) obj.Dex = parseFloat(storage["Dex"]);
	if(storage["Int"]) obj.Int = parseFloat(storage["Int"]);
	if(storage["Spi"]) obj.Spi = parseFloat(storage["Spi"]);
	if(storage["Lib"]) obj.Lib = parseFloat(storage["Lib"]);
	if(storage["Cha"]) obj.Cha = parseFloat(storage["Cha"]);
	if(storage["HP"])  obj.HP  = parseFloat(storage["HP"]);
	if(storage["SP"])  obj.SP  = parseFloat(storage["SP"]);
	if(storage["LP"])  obj.LP  = parseFloat(storage["LP"]);

	obj.Update    = Status.Buff.Update;
	obj.ToStorage = Status.Buff.ToStorage;

	return obj;
}


Status.Curse = function(target, opts) {
	if(!target) return;
	opts = opts || {};

	// Check for curse resist
	var odds = (opts.hit || 1) * (1 - target.Resistance(StatusEffect.Curse));
	if(Math.random() > odds) {
		target.AddResistanceWear(StatusEffect.Curse, opts.hit);
		return false;
	}
	target.statusWear[StatusEffect.Curse] = 0;
	// Number of turns effect lasts (static + random factor)
	var turns = opts.turns || 0;
	turns += Math.random() * (opts.turnsR || 0);
	// Apply effect
	target.combatStatus.stats[StatusEffect.Curse] = {
		turns   : turns,
		str     : opts.str || 1,
		Tick    : Status.Curse.Tick
	};

	return true;
}
Status.Curse.Tick = function(target) {
	this.turns--;
	// Remove curse effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Curse] = null;
	}
}

export { Status, StatusEffect };
