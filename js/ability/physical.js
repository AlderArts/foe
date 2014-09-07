/*
 * 
 * Physical attacks
 * 
 */
AttackPhysical = function() {
	this.damageType   = {}; // Set to null to use weapon attack
	this.targetMode   = TargetMode.Enemy;
	
	this.OnCast       = null;
	this.TargetEffect = null;
}
AttackPhysical.prototype = new Ability();
AttackPhysical.prototype.constructor = AttackPhysical;

AttackPhysical.prototype.CastInternal = function(encounter, caster, target) {
	var atkMod     = this.atkMod || 1;
	var defMod     = this.defMod || 1;
	var hitMod     = this.hitMod || 1;
	var nrAttacks  = this.nrAttacks || 1;
	var targetMode = this.targetMode || TargetMode.Enemy;
	
	var damageType = caster.elementAtk;
	if(this.damageType)
		damageType = new DamageType(this.damageType);

	if(this.OnCast)
		this.OnCast(encounter, caster, target);
	
	var targets;
	if(targetMode == TargetMode.Enemies)
		targets = target.members;
	else //(targetMode == TargetMode.Enemy)
		targets = [target];
	
	for(var i = 0; i < targets.length; i++) {
		var e   = targets[i];
		
		for(var j = 0; j < nrAttacks; j++) {
			var atkDmg     = atkMod * caster.PAttack();
			var def = defMod * e.PDefense();
			var hit = hitMod * caster.PHit();
			var evade = e.PEvade();
			var toHit = Ability.ToHit(hit, evade);
			if(Math.random() < toHit) {
				//var dmg = atkDmg - def;
				var dmg = Ability.Damage(atkDmg, def, caster.level, e.level);
				if(dmg < 0) dmg = 0;
				
				dmg = damageType.ApplyDmgType(e.elementDef, dmg);
				dmg = Math.floor(dmg);
				
				if(e.PhysDmgHP(encounter, caster, dmg)) {
					e.AddHPAbs(-dmg);
					
					if(dmg >= 0) {
						if(this.OnHit) this.OnHit(encounter, caster, e, dmg);
					}
					else {
						if(this.OnAbsorb) this.OnAbsorb(encounter, caster, e, -dmg);
					}
					if(this.TargetEffect) this.TargetEffect(encounter, caster, e);
				}
			}
			else
				if(this.OnMiss) this.OnMiss(encounter, caster, e);
		}
	}
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
// Default messages
AttackPhysical.prototype.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tName : target.nameDesc() };
	Text.AddOutput("The attack hits [tName] for " + Text.BoldColor(dmg, "#800000") + " damage!", parse);
	Text.Newline();
}
AttackPhysical.prototype.OnMiss = function(encounter, caster, target) {
	var parse = { tName : target.nameDesc() };
	Text.AddOutput("The attack narrowly misses [tName], dealing no damage!", parse);
	Text.Newline();
}
AttackPhysical.prototype.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.AddOutput("[tName] absorb[s] the attack, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.Newline();
}




Abilities.Physical = {};

Abilities.Physical.Bash = new AttackPhysical();
Abilities.Physical.Bash.name = "Bash";
Abilities.Physical.Bash.Short = function() { return "Stun effect, low accuracy."; }
Abilities.Physical.Bash.cost = { hp: null, sp: 10, lp: null};
Abilities.Physical.Bash.atkMod = 1.1;
Abilities.Physical.Bash.hitMod = 0.9;
Abilities.Physical.Bash.damageType.pBlunt = 1;
Abilities.Physical.Bash.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), y : caster.plural() ? "y" : "ies", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] read[y] a powerful blow, aiming to stun [tName]! ", parse);
}
Abilities.Physical.Bash.OnHit = function(encounter, caster, target, dmg) {
	if(Math.random() < 0.5) {
		for(var i = 0; i < encounter.combatOrder.length; i++) {
			if(encounter.combatOrder[i].entity == target)
				encounter.combatOrder[i].initiative -= 50;
		}
	}
	
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : target.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	
	Text.AddOutput("[name] bash[es] [tName] for " + Text.BoldColor(dmg, "#800000") + " damage, staggering [himher]!", parse);
	Text.Newline();
}

Abilities.Physical.GrandSlam = new AttackPhysical();
Abilities.Physical.GrandSlam.name = "Grand Slam";
Abilities.Physical.GrandSlam.Short = function() { return "Stun effect, low accuracy to multiple targets."; }
Abilities.Physical.GrandSlam.cost = { hp: null, sp: 50, lp: null};
Abilities.Physical.GrandSlam.atkMod = 1.1;
Abilities.Physical.GrandSlam.hitMod = 0.9;
Abilities.Physical.GrandSlam.damageType.pBlunt = 1;
Abilities.Physical.GrandSlam.targetMode = TargetMode.Enemies;
Abilities.Physical.GrandSlam.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), y : caster.plural() ? "y" : "ies", s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] read[y] a powerful blow, aiming to stun any who stand in [hisher] way! ", parse);
}
Abilities.Physical.GrandSlam.OnHit = function(encounter, caster, target, dmg) {
	if(Math.random() < 0.5) {
		for(var i = 0; i < encounter.combatOrder.length; i++) {
			if(encounter.combatOrder[i].entity == target)
				encounter.combatOrder[i].initiative -= 50;
		}
	}
	
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : target.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	
	Text.AddOutput("[name] slam[s] [tName] for " + Text.BoldColor(dmg, "#800000") + " damage, staggering [himher]!", parse);
	Text.Newline();
}

Abilities.Physical.Pierce = new AttackPhysical();
Abilities.Physical.Pierce.name = "Pierce";
Abilities.Physical.Pierce.Short = function() { return "Bypass defenses."; }
Abilities.Physical.Pierce.cost = { hp: null, sp: 10, lp: null};
Abilities.Physical.Pierce.defMod = 0.5;
Abilities.Physical.Pierce.damageType.pPierce = 1;
Abilities.Physical.Pierce.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tPossessive : target.possessive() };
	Text.AddOutput("[name] aims [hisher] strike on a weak point in [tPossessive] guard! ", parse);
}


Abilities.Physical.DirtyBlow = new AttackPhysical();
Abilities.Physical.DirtyBlow.name = "Dirty Blow";
Abilities.Physical.DirtyBlow.Short = function() { return "Bypass defenses, low chance of stun."; }
Abilities.Physical.DirtyBlow.cost = { hp: null, sp: 20, lp: null};
Abilities.Physical.DirtyBlow.defMod = 0.3;
Abilities.Physical.DirtyBlow.damageType.pPierce = 1.1;
Abilities.Physical.DirtyBlow.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), s : target.plural() ? "" : "s", name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tPossessive : target.possessive() };
	Text.AddOutput("[name] throw[s] a low blow, striking a weak point in [tPossessive] guard! ", parse);
}
Abilities.Physical.DirtyBlow.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has() };
	if(Status.Numb(target, { hit : 0.2, turns : 3, turnsR : 3, proc : 0.25 })) {
		Text.AddOutput("[target] [has] been afflicted with numb! ", parse);
		Text.Newline();
	}
}


Abilities.Physical.Hamstring = new AttackPhysical();
Abilities.Physical.Hamstring.name = "Hamstring";
Abilities.Physical.Hamstring.Short = function() { return "Nicks the target, making a lingering wound."; }
Abilities.Physical.Hamstring.cost = { hp: null, sp: 20, lp: null};
Abilities.Physical.Hamstring.atkMod = 0.5;
Abilities.Physical.Hamstring.damageType.pPierce = 1;
Abilities.Physical.Hamstring.OnCast = function(encounter, caster, target) {
	var parse = {
		tname : target.nameDesc(),
		Possessive : caster.Possessive(),
		name : caster.NameDesc(),
		y : caster.plural() ? "y" : "ies"
	};
	Text.AddOutput("[name] tr[y] [tname] with a light attack, aiming to wound! ", parse);
}
Abilities.Physical.Hamstring.OnHit = function(encounter, caster, target, dmg) {
	var parse = { name : caster.NameDesc(), s : caster.plural() ? "" : "s", tname : target.nameDesc(), tName : target.NameDesc(), has : target.has() };
	
	Text.AddOutput("[name] deal[s] " + Text.BoldColor(dmg, "#800000") + " damage to [tname]!", parse);
	Text.Newline();
	
	if(Status.Bleed(target, { hit : 0.75, turns : 3, turnsR : 3, dmg : 0.15 })) {
		Text.AddOutput("[tName] [has] been afflicted with bleed! ", parse);
		Text.Newline();
	}
}


Abilities.Physical.Kicksand = new AttackPhysical();
Abilities.Physical.Kicksand.name = "Kick sand";
Abilities.Physical.Kicksand.Short = function() { return "Kick dirt in the enemy's eyes, blinding them. Single target."; }
Abilities.Physical.Kicksand.cost = { hp: null, sp: 15, lp: null};
Abilities.Physical.Kicksand.atkMod = 0.05;
Abilities.Physical.Kicksand.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] kick[s] some dirt toward [tName]! ", parse);
}
Abilities.Physical.Kicksand.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", himher : target.himher(), name : caster.nameDesc() };
	if(Status.Blind(target, { hit : 0.8, str : 0.5, turns : 3, turnsR : 3 })) {
		Text.AddOutput("[tName] get[s] a face-full of dirt, blinding [himher]!", parse);
	}
	Text.Newline();
}
Abilities.Physical.Kicksand.OnAbsorb = Abilities.Physical.Kicksand.OnHit;
Abilities.Physical.Kicksand.OnMiss = function(encounter, caster, target) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.AddOutput("[tName] easily avoid[s] the attack.", parse);
	Text.Newline();
}


Abilities.Physical.Swift = new Ability();
Abilities.Physical.Swift.name = "Swift";
Abilities.Physical.Swift.Short = function() { return "Briefly boosts the caster's speed."; }
Abilities.Physical.Swift.targetMode = TargetMode.Self;
Abilities.Physical.Swift.cost = { hp: null, sp: 25, lp: null};
Abilities.Physical.Swift.CastInternal = function(encounter, caster) {
	var parse = {
		name : caster.NameDesc(),
		es : caster.plural() ? "" : "es",
		hisher : caster.hisher()
	}

	Status.Haste(caster, { turns : 3, turnsR : 3, factor : 2 });

	Text.AddOutput("[name] focus[es], briefly boosting [hisher] speed!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.Physical.SetTrap = new Ability();
Abilities.Physical.SetTrap.name = "Set trap";
Abilities.Physical.SetTrap.Short = function() { return "Sets a trap for an enemy."; }
Abilities.Physical.SetTrap.targetMode = TargetMode.Self;
Abilities.Physical.SetTrap.cost = { hp: null, sp: 50, lp: null};
Abilities.Physical.SetTrap.CastInternal = function(encounter, caster) {
	var parse = {
		name : caster.NameDesc(),
		poss : caster.possessive(),
		s    : caster.plural() ? "" : "s",
		hisher : caster.hisher()
	}
	// Takes a long time to cast
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == caster)
			encounter.combatOrder[i].initiative -= 100;
	}
	// Reduce everyones aggro towards trapper
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		var activeChar = encounter.combatOrder[i];
		var aggroEntry = GetAggroEntry(activeChar, caster);
		if(aggroEntry)
			aggroEntry.aggro /= 2;
	}

	Status.Counter(caster, { turns : 999, hits : 1, OnHit :
		function(enc, target, attacker, dmg) {
			parse["atk"] = attacker.NameDesc();
			parse["s2"]  = attacker.plural() ? "" : "s";
			parse["HeShe"] = attacker.HeShe();
			
			Text.AddOutput("[atk] spring[s2] [poss] trap! ", parse);
			
			var atkDmg = target.PAttack();
			var def    = attacker.PDefense();
			var hit    = target.PHit();
			var evade  = attacker.PEvade();
			var toHit  = Ability.ToHit(hit, evade);
			if(Math.random() < toHit) {
				var dmg = Ability.Damage(atkDmg, def, target.level, attacker.level);
				if(dmg < 0) dmg = 0;
				
				dmg = target.elementAtk.ApplyDmgType(attacker.elementDef, dmg);
				dmg = Math.floor(dmg);
				
				if(attacker.PhysDmgHP(encounter, target, dmg)) {
					attacker.AddHPAbs(-dmg);
					Text.AddOutput("[HeShe] take[s2] " + Text.BoldColor(dmg, "#800000") + " damage!", parse);
				}
			}
			else {
				Text.AddOutput("[HeShe] narrowly avoid[s2] taking damage!", parse);
			}
			Text.Newline();
			return false;
		}
	});

	Text.AddOutput("[name] set[s] a trap!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.Physical.Backstab = new AttackPhysical();
Abilities.Physical.Backstab.name = "Backstab";
Abilities.Physical.Backstab.Short = function() { return "Deal high damage against a disabled target."; }
Abilities.Physical.Backstab.cost = { hp: null, sp: 30, lp: null};
Abilities.Physical.Backstab.atkMod = 2;
Abilities.Physical.Backstab.defMod = 0.75;
Abilities.Physical.Backstab.hitMod = 2;
Abilities.Physical.Backstab.damageType = null;
Abilities.Physical.Backstab.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tname : target.nameDesc() };
	Text.AddOutput("[name] dance[s] around [tname], dealing a crippling backstab! ", parse);
}
Abilities.Physical.Backstab.enabledTargetCondition = function(encounter, caster, target) {
	return target.Inhibited();
}


Abilities.Physical.Ensnare = new AttackPhysical();
Abilities.Physical.Ensnare.name = "Ensnare";
Abilities.Physical.Ensnare.Short = function() { return "Slows down an enemy by throwing a net at them."; }
Abilities.Physical.Ensnare.cost = { hp: null, sp: 20, lp: null};
Abilities.Physical.Ensnare.atkMod = 0;
Abilities.Physical.Ensnare.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] throw[s] a net toward [tName]! ", parse);
}
Abilities.Physical.Ensnare.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", himher : target.himher(), name : caster.nameDesc() };
	if(Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 })) {
		Text.AddOutput("[tName] get[s] caught in the net, slowing [himher]!", parse);
	}
	Text.Newline();
}
Abilities.Physical.Ensnare.OnAbsorb = Abilities.Physical.Ensnare.OnHit;
Abilities.Physical.Ensnare.OnMiss = function(encounter, caster, target) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.AddOutput("[tName] easily avoid[s] the attack.", parse);
	Text.Newline();
}


Abilities.Physical.FocusStrike = new AttackPhysical();
Abilities.Physical.FocusStrike.name = "FocusStrike";
Abilities.Physical.FocusStrike.Short = function() { return "Bypass defenses."; }
Abilities.Physical.FocusStrike.cost = { hp: null, sp: 50, lp: null};
Abilities.Physical.FocusStrike.defMod = 0.2;
Abilities.Physical.FocusStrike.damageType.pPierce = 1.5;
Abilities.Physical.FocusStrike.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tPossessive : target.possessive() };
	Text.AddOutput("[name] aim[s] [hisher] strike on a weak point in [tPossessive] guard! ", parse);
}


Abilities.Physical.DAttack = new AttackPhysical();
Abilities.Physical.DAttack.name = "D.Attack";
Abilities.Physical.DAttack.Short = function() { return "Perform two low accuracy hits."; }
Abilities.Physical.DAttack.cost = { hp: null, sp: 25, lp: null};
Abilities.Physical.DAttack.damageType = null;
Abilities.Physical.DAttack.hitMod = 0.75;
Abilities.Physical.DAttack.nrAttacks = 2;
Abilities.Physical.DAttack.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] perform[s] two attacks against [tName] in rapid succession!", parse);
	Text.Newline();
}


Abilities.Physical.TAttack = new AttackPhysical();
Abilities.Physical.TAttack.name = "T.Attack";
Abilities.Physical.TAttack.Short = function() { return "Perform three low accuracy hits."; }
Abilities.Physical.TAttack.cost = { hp: null, sp: 60, lp: null};
Abilities.Physical.TAttack.damageType = null;
Abilities.Physical.TAttack.hitMod = 0.75;
Abilities.Physical.TAttack.nrAttacks = 3;
Abilities.Physical.TAttack.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] perform[s] three attacks against [tName] in rapid succession! ", parse);
	Text.Newline();
}


Abilities.Physical.QAttack = new AttackPhysical();
Abilities.Physical.QAttack.name = "Q.Attack";
Abilities.Physical.QAttack.Short = function() { return "Perform four low accuracy hits."; }
Abilities.Physical.QAttack.cost = { hp: null, sp: 100, lp: null};
Abilities.Physical.QAttack.damageType = null;
Abilities.Physical.QAttack.hitMod = 0.75;
Abilities.Physical.QAttack.nrAttacks = 4;
Abilities.Physical.QAttack.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] perform[s] four attacks against [tName] in rapid succession!", parse);
	Text.Newline();
}


Abilities.Physical.Frenzy = new AttackPhysical();
Abilities.Physical.Frenzy.name = "Frenzy";
Abilities.Physical.Frenzy.Short = function() { return "Perform a flurry of five strikes, leaving you exhausted."; }
Abilities.Physical.Frenzy.cost = { hp: 100, sp: 80, lp: null};
Abilities.Physical.Frenzy.damageType = null;
Abilities.Physical.Frenzy.hitMod = 1;
Abilities.Physical.Frenzy.nrAttacks = 5;
Abilities.Physical.Frenzy.OnCast = function(encounter, caster, target) {
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == caster)
			encounter.combatOrder[i].initiative -= 150;
	}
		
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] perform[s] a frenzied assault, attacking [tName] with five rapid blows!", parse);
	Text.Newline();
}


Abilities.Physical.CrushingStrike = new AttackPhysical();
Abilities.Physical.CrushingStrike.name = "Crushing.S";
Abilities.Physical.CrushingStrike.Short = function() { return "Crushing strike that deals massive damage, with high chance of stunning. Slight recoil effect."; }
Abilities.Physical.CrushingStrike.cost = { hp: 25, sp: 10, lp: null};
Abilities.Physical.CrushingStrike.damageType = null;
Abilities.Physical.CrushingStrike.atkMod = 1.5;
Abilities.Physical.CrushingStrike.hitMod = 0.9;
Abilities.Physical.CrushingStrike.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] perform[s] a wild assault against [tName]! ", parse);
}
Abilities.Physical.CrushingStrike.OnHit = function(encounter, caster, target, dmg) {
	if(Math.random() < 0.8) {
		for(var i = 0; i < encounter.combatOrder.length; i++) {
			if(encounter.combatOrder[i].entity == target)
				encounter.combatOrder[i].initiative -= 75;
		}
	}
	
	var parse = { name : caster.NameDesc(), himher : target.himher(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	
	Text.AddOutput("[name] deliver[s] a crushing blow to [tName] for " + Text.BoldColor(dmg, "#800000") + " damage, staggering [himher]!", parse);
	Text.Newline();
}


Abilities.Physical.Provoke = new AttackPhysical();
Abilities.Physical.Provoke.name = "Provoke";
Abilities.Physical.Provoke.Short = function() { return "Try to provoke the enemy to focus on you. Single target."; }
Abilities.Physical.Provoke.cost = { hp: null, sp: 15, lp: null};
Abilities.Physical.Provoke.atkMod = 0.1;
Abilities.Physical.Provoke.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] taunt[s] [tName]! ", parse);
}
Abilities.Physical.Provoke.OnHit = function(encounter, caster, target, dmg) {
	var activeChar;
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == target)
			activeChar = encounter.combatOrder[i];
	}
	var aggroEntry = GetAggroEntry(activeChar, caster);
	if(aggroEntry)
		aggroEntry.aggro += 1;
	
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.AddOutput("[tName] become[s] agitated, becoming more aggressive towards [name]!", parse);
	Text.Newline();
}
Abilities.Physical.Provoke.OnAbsorb = Abilities.Physical.Provoke.OnHit;
Abilities.Physical.Provoke.OnMiss = function(encounter, caster, target) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.AddOutput("[tName] doesn't look very impressed.", parse);
	Text.Newline();
}


Abilities.Physical.Taunt = new AttackPhysical();
Abilities.Physical.Taunt.name = "Taunt";
Abilities.Physical.Taunt.Short = function() { return "Try to taunt the enemy to focus on you. Single target."; }
Abilities.Physical.Taunt.cost = { hp: null, sp: 15, lp: null};
Abilities.Physical.Taunt.atkMod = 0.5;
Abilities.Physical.Taunt.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] taunt[s] [tName]! ", parse);
}
Abilities.Physical.Taunt.OnHit = function(encounter, caster, target, dmg) {
	var activeChar;
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == target)
			activeChar = encounter.combatOrder[i];
	}
	var aggroEntry = GetAggroEntry(activeChar, caster);
	if(aggroEntry)
		aggroEntry.aggro += 3;
	
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.AddOutput("[tName] become[s] agitated, becoming more aggressive towards [name]!", parse);
	Text.Newline();
}
Abilities.Physical.Taunt.OnAbsorb = Abilities.Physical.Taunt.OnHit;
Abilities.Physical.Taunt.OnMiss = function(encounter, caster, target) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.AddOutput("[tName] doesn't look very impressed.", parse);
	Text.Newline();
}

