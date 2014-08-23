/**
 * @author alder
 */

var Status = {};

StatusEffect = {
	Burn    : 0, //OK
	Freeze  : 1, //OK
	Numb    : 2, //OK
	Petrify : 3,
	Venom   : 4, //OK
	Blind   : 5, //OK
	Siphon  : 6,
	Seal    : 7,
	Sleep   : 8,
	Enrage  : 9,
	Fatigue : 10,
	Bleed   : 11, //OK
	Haste   : 12, //OK
	Slow    : 13, //OK
	Regen   : 14,
	Boon    : 15,
	Horny   : 16, //OK
	Aroused : 17,
	Limp    : 18,
	Bimbo   : 19,
	Decoy   : 20, //OK
	Counter : 21, //OK
	Full    : 22,
	
	LAST    : 23
};

LoadStatusImages = function(ready) {
	Images.status = [];
	for(var i = 0; i < StatusEffect.LAST; i++) {
		Images.status[i]  = "";
	}
	
	// Status effects
	Images.status[StatusEffect.Burn]    = "data/status/burn.png";
	Images.status[StatusEffect.Freeze]  = "data/status/freeze.png";
	Images.status[StatusEffect.Numb]    = "data/status/numb.png";
	Images.status[StatusEffect.Venom]   = "data/status/venom.png";
	Images.status[StatusEffect.Blind]   = "data/status/blind.png";
	Images.status[StatusEffect.Bleed]   = "data/status/bleed.png";
	Images.status[StatusEffect.Haste]   = "data/status/haste.png";
	Images.status[StatusEffect.Slow]    = "data/status/slow.png";
	Images.status[StatusEffect.Horny]   = "data/status/horny.png";
	Images.status[StatusEffect.Decoy]   = "data/status/decoy.png";
	Images.status[StatusEffect.Counter] = "data/status/counter.png";
	Images.status[StatusEffect.Full]    = "data/status/full.png";
	
	for(var i = 0; i < StatusEffect.LAST; i++) {
		if(Images.status[i] == "") continue;
		LoadImage(Images.status[i], ready);
	}
}

function StatusList() {
	// Index contains null if status effect is inactive
	// Data in index can contain a degree/timer relevant to the effect
	this.stats = [];
}

StatusList.NumStatus = 6;

StatusList.prototype.Clear = function() {
	for(var i = 0; i < StatusEffect.LAST; i++)
		this.stats[i] = null;
}

StatusList.prototype.Render = function(obj) {
	var j = 0;
	
	for(var i = 0; i < StatusEffect.LAST; i++) {
		if(this.stats[i]) {
			if(Images.status[i]) obj[j].attr({src: Images.status[i]});
			j++;
		}
	}
	
	for(; j < StatusList.NumStatus; j++) {
		obj[j].hide();
	}
}

StatusList.prototype.Tick = function(target) {
	for(var i = 0; i < StatusEffect.LAST; i++) {
		if(this.stats[i] && this.stats[i].Tick)
			this.stats[i].Tick(target);
	}
}

StatusList.prototype.EndOfCombat = function() {
	this.stats[StatusEffect.Burn]    = null;
	this.stats[StatusEffect.Freeze]  = null;
	this.stats[StatusEffect.Numb]    = null;
	//this.stats[StatusEffect.Petrify] = null;
	this.stats[StatusEffect.Venom]   = null;
	this.stats[StatusEffect.Blind]   = null;
	this.stats[StatusEffect.Siphon]  = null;
	this.stats[StatusEffect.Seal]    = null;
	this.stats[StatusEffect.Sleep]   = null;
	this.stats[StatusEffect.Enrage]  = null;
	//this.stats[StatusEffect.Fatigue] = null;
	this.stats[StatusEffect.Bleed]   = null;
	this.stats[StatusEffect.Haste]   = null;
	this.stats[StatusEffect.Slow]    = null;
	this.stats[StatusEffect.Regen]   = null;
	this.stats[StatusEffect.Boon]    = null;
	this.stats[StatusEffect.Horny]   = null;
	this.stats[StatusEffect.Aroused] = null;
	this.stats[StatusEffect.Limp]    = null;
	//this.stats[StatusEffect.Bimbo]   = null;
	this.stats[StatusEffect.Decoy]   = null;
	this.stats[StatusEffect.Counter] = null;
	//this.stats[StatusEffect.Full]    = null;
}

Status.Venom = function(target, opts) {
	if(!target) return;
	opts = opts || {};
	
	// Check for poison resist
	var odds = (opts.hit || 1) * (1 - target.PoisonResist());
	if(Math.random() > odds) {
		return false;
	}
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
Status.Venom.Tick = function(target) {
	var damageType = new DamageType({mNature : this.str});
	var atkRand = 0.2 * (Math.random() - 0.5) + 1;
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
	var odds = (opts.hit || 1) * (1 - target.BurnResist());
	if(Math.random() > odds) {
		return false;
	}
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
Status.Burn.Tick = function(target) {
	var damageType = new DamageType({mFire : this.str});
	var atkRand = 0.2 * (Math.random() - 0.5) + 1;
	var dmg = this.dmg * atkRand * target.HP();
	dmg = damageType.ApplyDmgType(target.elementDef, dmg);
	dmg = Math.floor(dmg);
	
	target.AddHPAbs(-dmg);
	
	this.turns--;
	// Remove venom effect
	if(this.turns <= 0 || target.curHp <= 0) {
		target.combatStatus.stats[StatusEffect.Burn] = null;
	}
}


Status.Freeze = function(target, opts) {
	if(!target) return;
	opts = opts || {};
	
	// Check for freeze resist
	var odds = (opts.hit || 1) * (1 - target.FreezeResist());
	if(Math.random() > odds) {
		return false;
	}
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
	var odds = (opts.hit || 1) * (1 - target.NumbResist());
	if(Math.random() > odds) {
		return false;
	}
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
	var odds = (opts.hit || 1) * (1 - target.BlindResist());
	if(Math.random() > odds) {
		return false;
	}
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



Status.Bleed = function(target, opts) {
	if(!target) return;
	opts = opts || {};
	
	// Check for poison resist
	var odds = (opts.hit || 1) * (1 - target.BleedResist());
	if(Math.random() > odds) {
		return false;
	}
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
Status.Bleed.Tick = function(target) {
	var atkRand = 0.2 * (Math.random() - 0.5) + 1;
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
	var odds = (opts.hit || 1) * (1 - target.SlowResist());
	if(Math.random() > odds) {
		return false;
	}
	
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
	var odds = (opts.hit || 1) * (1 - target.HornyResist());
	if(Math.random() > odds) {
		return false;
	}
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
Status.Horny.Tick = function(target) {
	var damageType = new DamageType({mLust : this.str});
	var atkRand = 0.2 * (Math.random() - 0.5) + 1;
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

Status.Decoy = function(target, opts) {
	if(!target) return;
	opts = opts || {};
	
	// Apply decoy
	target.combatStatus.stats[StatusEffect.Decoy] = {
		copies  : opts.copies
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
	// Apply decoy
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
	// Remove horny effect
	if(this.turns <= 0) {
		target.combatStatus.stats[StatusEffect.Counter] = null;
	}
}


Status.Full = function(target, opts) {
	if(!target) return;
	opts = opts || {};
	
	// Apply decoy
	target.combatStatus.stats[StatusEffect.Full] = {
		hours  : opts.hours
	};
	
	return true;
}
Status.Full.OverTime = function(target, hours) {
	this.hours -= hours;
	// Remove full effect
	if(this.hours <= 0) {
		target.combatStatus.stats[StatusEffect.Full] = null;
	}
}
