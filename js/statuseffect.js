/**
 * @author alder
 */

var Status = {};

StatusEffect = {
	Burn    : 0,
	Freeze  : 1,
	Numb    : 2,
	Petrify : 3,
	Venom   : 4,
	Blind   : 5,
	Siphon  : 6,
	Seal    : 7,
	Sleep   : 8,
	Enrage  : 9,
	Fatigue : 10,
	Bleed   : 11,
	Haste   : 12,
	Slow    : 13,
	Regen   : 14,
	Boon    : 15,
	Horny   : 16,
	Aroused : 17,
	Limp    : 18,
	Bimbo   : 19,
	
	LAST    : 20
};

LoadStatusImages = function() {
	Images.status = [];
	for(var i = 0; i < StatusEffect.LAST; i++)
		Images.status[i]  = "";
	
	// Status effects
	Images.status[StatusEffect.Burn]   = "data/status/burn.png";
	Images.status[StatusEffect.Freeze] = "data/status/freeze.png";
	Images.status[StatusEffect.Numb]   = "data/status/numb.png";
	Images.status[StatusEffect.Venom]  = "data/status/venom.png";
}

function StatusList() {
	// Index contains null if status effect is inactive
	// Data in index can contain a degree/timer relevant to the effect
	this.stats = [];
}

StatusList.prototype.Clear = function() {
	for(var i = 0; i < StatusEffect.LAST; i++)
		this.stats[i] = null;
}

StatusList.prototype.Render = function(context) {
	var xOffset = 5;
	for(var i = 0; i < StatusEffect.LAST; i++) {
		if(this.stats[i]) {
			context.drawImage(Images.status[i], xOffset, 70);
			xOffset += 16;
		}
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
	
	// Check for freeze resist
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

