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
			var def = e.PDefense();
			var hit = hitMod * caster.PHit();
			var evade = e.PEvade();
			var toHit = this.ToHit(hit, evade);
			if(Math.random() < toHit) {
				//var dmg = atkDmg - def;
				var dmg = this.Damage(atkDmg, def, caster.level, e.level);
				if(dmg < 0) dmg = 0;
				
				dmg = damageType.ApplyDmgType(e.elementDef, dmg);
				dmg = Math.floor(dmg);
			
				e.AddHPAbs(-dmg);
				
				if(dmg >= 0) {
					if(this.OnHit) this.OnHit(encounter, caster, e, dmg);
				}
				else {
					if(this.OnAbsorb) this.OnAbsorb(encounter, caster, e, -dmg);
				}
				if(this.TargetEffect) this.TargetEffect(encounter, caster, e);
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
	Text.AddOutput("The attack norrowly misses [tName], dealing no damage!", parse);
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
	Text.AddOutput("[name] read[y] a powerful blow, aiming to stun [tName]!", parse);
	Text.Newline();
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
	Text.AddOutput("[name] read[y] a powerful blow, aiming to stun any who stand in [hisher] way!", parse);
	Text.Newline();
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
	Text.AddOutput("[name] aims [hisher] strike on a weak point in [tPossessive] guard!", parse);
	Text.Newline();
}



Abilities.Physical.Rrocket = new AttackPhysical();
Abilities.Physical.Rrocket.name = "Rock Rocket";
Abilities.Physical.Rrocket.Short = function() { return "I kick this rock and you catch it with your face, hits a single enemy."; }
Abilities.Physical.Rrocket.cost = { hp: null, sp: 50, lp: null};
Abilities.Physical.Rrocket.atkMod = 1.9;
Abilities.Physical.Rrocket.damageType.pBlunt = 1.2;
Abilities.Physical.Rrocket.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] thrust[s] [hisher] hands into the ground, pulling out a large boulder. [name] toss[es] the large boulder into the air, [name] position[s] [himher]self as the large boulder falls to the ground, before the large boulder hits the ground, [name] pull[s] [hisher] foot back and kick[s] the boulder with all [hisher] might, sending the boulder speeding towards [tName]!", parse);
	Text.Newline();
}


Abilities.Physical.FocusStrike = new AttackPhysical();
Abilities.Physical.FocusStrike.name = "FocusStrike";
Abilities.Physical.FocusStrike.Short = function() { return "Bypass defences at ease."; }
Abilities.Physical.FocusStrike.cost = { hp: null, sp: 50, lp: null};
Abilities.Physical.FocusStrike.defMod = 0.2;
Abilities.Physical.FocusStrike.damageType.pPierce = 1.5;
Abilities.Physical.FocusStrike.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tPossessive : target.possessive() };
	Text.AddOutput("[name] aims [hisher] strike on a weak point in [tPossessive] guard!", parse);
	Text.Newline();
}


Abilities.Physical.Foblivion = new AttackPhysical();
Abilities.Physical.Foblivion.name = "Fury of Oblivion";
Abilities.Physical.Foblivion.Short = function() { return "Fury of the oblivion."; }
Abilities.Physical.Foblivion.cost = { hp: null, sp: 450, lp: null};
Abilities.Physical.Foblivion.damageType = null;
Abilities.Physical.Foblivion.atkMod = 0.150;
Abilities.Physical.Foblivion.nrAttacks = 75;
Abilities.Physical.Foblivion.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] utter[s] a loud battle cry that can be heard even in the mountains, [name] charge[s] towards [tName], [name] jump[s] into the air and focus[es] all of [hisher] teachings, memories, pains and happiness into [hisher]self, as [name] closely approaches [tName], [name] release[s] all that focus onto [tName]!", parse);
	Text.Newline();
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
	Text.AddOutput("[name] perform[s] three attacks against [tName] in rapid succession!", parse);
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
	Text.AddOutput("[name] perform[s] a wild assault against [tName]!", parse);
	Text.Newline();
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


Abilities.Physical.PileDriver = new AttackPhysical();
Abilities.Physical.PileDriver.name = "PileDriver";
Abilities.Physical.PileDriver.Short = function() { return "Slam an enemy's head so hard, they disappear into oblivion."; }
Abilities.Physical.PileDriver.cost = { hp: 350, sp: 350, lp: 150};
Abilities.Physical.PileDriver.damageType = null;
Abilities.Physical.PileDriver.atkMod = 9.5;
Abilities.Physical.PileDriver.hitMod = 0.9;
Abilities.Physical.PileDriver.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] Charge[s] towards [tName], grabbing [tName] from the behind, stomping [hisher] feet, [name] and [tName] both fly to the sky. as [name] and [tName] fall[s] to the ground, [name] spin[s] with immense speed as if though a top. upon impact, [tName]'s head collides with the ground causing it to break and shatter!", parse);
	Text.Newline();
}
Abilities.Physical.PileDriver.OnHit = function(encounter, caster, target, dmg) {
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


Abilities.Physical.Buppercut = new AttackPhysical();
Abilities.Physical.Buppercut.name = "Burning uppercut";
Abilities.Physical.Buppercut.Short = function() { return "Does a powerful uppercut to an opponent, has a chance of burning the opponent."; }
Abilities.Physical.Buppercut.cost = { hp: null, sp: 90, lp: null};
Abilities.Physical.Buppercut.atkMod = 1.5;
Abilities.Physical.Buppercut.hitMod = 0.7;
Abilities.Physical.Buppercut.damageType.mFire = 1.5;
Abilities.Physical.Buppercut.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), y : caster.plural() ? "y" : "ies", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[tName] attacks [name] but [name] dodge[s] the attack and counter[s] it with a powerful uppercut!", parse);
	Text.Newline();
}
Abilities.Black.Buppercut.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Burn(target, { hit : 0.2, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
		Text.AddOutput("[target] [has] been burned! ", parse);
Text.Newline();

		}
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

Abilities.Physical.Mock = new AttackPhysical();
Abilities.Physical.Mock.name = "Mock";
Abilities.Physical.Mock.Short = function() { return "Mock the enemy to focus on you. Single target."; }
Abilities.Physical.Mock.cost = { hp: null, sp: 17, lp: null};
Abilities.Physical.Mock.atkMod = 0.9;
Abilities.Physical.Mock.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] Mock[s] [tName]! ", parse);
}
Abilities.Physical.Mock.OnHit = function(encounter, caster, target, dmg) {
	var activeChar;
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == target)
			activeChar = encounter.combatOrder[i];
	}
	var aggroEntry = GetAggroEntry(activeChar, caster);
	if(aggroEntry)
		aggroEntry.aggro += 5;
	
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.AddOutput("[tName] has became embarrassed , [tName] is now very aggressive towards [name]!", parse);
	Text.Newline();
}
Abilities.Physical.Mock.OnAbsorb = Abilities.Physical.Mock.OnHit;
Abilities.Physical.Mock.OnMiss = function(encounter, caster, target) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() , hisher : target.hisher() };
	Text.AddOutput("[tName] is laughing [hisher] ass out.", parse);
	Text.Newline();
}

