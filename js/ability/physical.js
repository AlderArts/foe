/*
 * 
 * Physical attacks
 * 
 */
import { AbilityNode } from './node';
import { Ability, Abilities, TargetMode } from '../ability';

Abilities.Physical = {};

// Default messages
Abilities.Physical._onDamage = function(ability, encounter, caster, target, dmg) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("The attack hits [tname] for " + Text.Damage(-dmg) + " damage!", parse);
	Text.NL();
}
Abilities.Physical._onMiss = function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("The attack narrowly misses [tname], dealing no damage!", parse);
	Text.NL();
}
Abilities.Physical._onAbsorb = function(ability, encounter, caster, target, dmg) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] absorb[tnotS] the attack, gaining " + Text.Heal(dmg) + " health!", parse);
	Text.NL();
}


Abilities.Physical.Bash = new Ability("Bash");
Abilities.Physical.Bash.Short = function() { return "Stun effect, low accuracy."; }
Abilities.Physical.Bash.cost = { hp: null, sp: 10, lp: null};
Abilities.Physical.Bash.cooldown = 2;
Abilities.Physical.Bash.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.1,
	hitMod: 0.9,
	damageType: {pBlunt: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a powerful blow, aiming to stun [tname]! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		if(Math.random() < 0.5) {
			var entry = target.GetCombatEntry(encounter);
			if(entry) {
				entry.initiative -= 50;
			}
		}
		
		var parse = AbilityNode.DefaultParser(caster, target);
		
		Text.Add("[Name] bash[notEs] [tname] for " + Text.Damage(-dmg) + " damage, staggering [thimher]!", parse);
		Text.NL();
	}, AbilityNode.Template.Cancel()],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));


Abilities.Physical.GrandSlam = new Ability("Grand Slam");
Abilities.Physical.GrandSlam.Short = function() { return "Stun effect, low accuracy to multiple targets."; }
Abilities.Physical.GrandSlam.cost = { hp: null, sp: 50, lp: null};
Abilities.Physical.GrandSlam.targetMode = TargetMode.Enemies;
Abilities.Physical.GrandSlam.cooldown = 3;
Abilities.Physical.GrandSlam.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.1,
	hitMod: 0.8,
	damageType: {pBlunt: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] read[y] a powerful blow, aiming to stun any who stand in [hisher] way! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		if(Math.random() < 0.5) {
			var entry = target.GetCombatEntry(encounter);
			if(entry) {
				entry.initiative -= 50;
			}
		}
		
		var parse = AbilityNode.DefaultParser(caster, target);
		
		Text.Add("[Name] slam[notS] [tname] for " + Text.Damage(-dmg) + " damage, staggering [thimher]!", parse);
		Text.NL();
	}, AbilityNode.Template.Cancel()],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));


Abilities.Physical.Pierce = new Ability("Pierce");
Abilities.Physical.Pierce.Short = function() { return "Bypass defenses."; }
Abilities.Physical.Pierce.cost = { hp: null, sp: 10, lp: null};
Abilities.Physical.Pierce.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.5,
	damageType: {pPierce: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] aim[notS] [hisher] strike on a weak point in [tposs] guard! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));


Abilities.Physical.DirtyBlow = new Ability("Dirty Blow");
Abilities.Physical.DirtyBlow.Short = function() { return "Bypass defenses, low chance of stun."; }
Abilities.Physical.DirtyBlow.cost = { hp: null, sp: 20, lp: null};
Abilities.Physical.DirtyBlow.cooldown = 2;
Abilities.Physical.DirtyBlow.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.3,
	damageType: {pPierce: 1.1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a low blow, striking a weak point in [tposs] guard! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Numb(target, { hit : 0.2, turns : 3, turnsR : 3, proc : 0.25 })) {
			Text.Add("[tName] [thas] been afflicted with numb!", parse);
			Text.NL();
		}
	}]
}));


Abilities.Physical.Hamstring = new Ability("Hamstring");
Abilities.Physical.Hamstring.Short = function() { return "Nicks the target, making a lingering wound."; }
Abilities.Physical.Hamstring.cost = { hp: null, sp: 20, lp: null};
Abilities.Physical.Hamstring.cooldown = 2;
Abilities.Physical.Hamstring.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.5,
	damageType: {pPierce: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] tr[y] to hit [tname] with a light attack, aiming to wound! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Bleed(target, { hit : 0.75, turns : 3, turnsR : 3, dmg : 0.15 })) {
			Text.Add("[tName] [thas] been afflicted with bleed! ", parse);
			Text.NL();
		}
	}]
}));


Abilities.Physical.Kicksand = new Ability("Kick sand");
Abilities.Physical.Kicksand.Short = function() { return "Kick dirt in the enemy's eyes, blinding them. Single target."; }
Abilities.Physical.Kicksand.cost = { hp: null, sp: 15, lp: null};
Abilities.Physical.Kicksand.cooldown = 1;
Abilities.Physical.Kicksand.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.05,
	damageType: {pPierce: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] kick[notS] some dirt toward [tname]! ", parse);
	}],
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] easily avoid[tnotS] the attack.", parse);
	}],
	onDamage: [Abilities.Physical._onDamage],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Blind(target, { hit : 0.8, str : 0.5, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] get[tnotS] a face-full of dirt, blinding [thimher]!", parse);
		}
	}]
}));


Abilities.Physical.Swift = new Ability("Swift");
Abilities.Physical.Swift.Short = function() { return "Briefly boosts the caster's speed."; }
Abilities.Physical.Swift.targetMode = TargetMode.Self;
Abilities.Physical.Swift.cost = { hp: null, sp: 25, lp: null};
Abilities.Physical.Swift.castTree.push(function(ability, encounter, caster) {
	var parse = AbilityNode.DefaultParser(caster);

	Status.Haste(caster, { turns : 3, turnsR : 3, factor : 2 });

	Text.Add("[Name] focus[notEs], briefly boosting [hisher] speed!", parse);
});


Abilities.Physical.SetTrap = new Ability("Set trap");
Abilities.Physical.SetTrap.Short = function() { return "Sets a trap for an enemy."; }
Abilities.Physical.SetTrap.targetMode = TargetMode.Self;
Abilities.Physical.SetTrap.cost = { hp: null, sp: 50, lp: null};
Abilities.Physical.SetTrap.castTime = 100;
Abilities.Physical.SetTrap.cooldown = 3;
Abilities.Physical.SetTrap.onCast = [function(ability, encounter, caster) {
	var parse = AbilityNode.DefaultParser(caster);
	Text.Add("[Name] begin[notS] to set a trap!", parse);
}];
Abilities.Physical.SetTrap.castTree.push(function(ability, encounter, caster) {
	var parse = AbilityNode.DefaultParser(caster);
	Text.Add("[Name] set[notS] a trap!", parse);
	
	// Reduce everyones aggro toward trapper
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		var activeChar = encounter.combatOrder[i];
		var aggroEntry = GetAggroEntry(activeChar, caster);
		if(aggroEntry)
			aggroEntry.aggro /= 2;
	}

	Status.Counter(caster, { turns : 999, hits : 1, OnHit :
		function(enc, caster, attacker, dmg) {
			Abilities.Physical.SpringTrap.Use(encounter, caster, attacker);
			return false;
		}
	});
});
Abilities.Physical.SpringTrap = new Ability("Spring trap");
Abilities.Physical.SpringTrap.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.3,
	atkMod: 1.3,
	hitMod: 2,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] spring[tnotS] [poss] trap! ", parse);
	}],
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tHeShe] narrowly avoid[tnotS] taking damage! ", parse);
	}],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));


Abilities.Physical.Backstab = new Ability("Backstab");
Abilities.Physical.Backstab.Short = function() { return "Deal high damage against a disabled target."; }
Abilities.Physical.Backstab.cost = { hp: null, sp: 30, lp: null};
Abilities.Physical.Backstab.cooldown = 1;
Abilities.Physical.Backstab.castTree.push(AbilityNode.Template.Physical({
	atkMod: 2,
	defMod: 0.75,
	hitMod: 2,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] dance[notS] around [tname], dealing a crippling backstab! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));
Abilities.Physical.Backstab.enabledTargetCondition = function(encounter, caster, target) {
	return target.Inhibited();
}


Abilities.Physical.Ensnare = new Ability("Ensnare");
Abilities.Physical.Ensnare.Short = function() { return "Slows down an enemy by throwing a net at them."; }
Abilities.Physical.Ensnare.cost = { hp: null, sp: 20, lp: null};
Abilities.Physical.Ensnare.cooldown = 3;
Abilities.Physical.Ensnare.castTree.push(AbilityNode.Template.Physical({
	toDamage: null,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a net toward [tname]! ", parse);
	}],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] get[tnotS] caught in the net, slowing [thimher]!", parse);
		}
	}],
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] easily avoid[tnotS] the attack.", parse);
	}]
}));


Abilities.Physical.FocusStrike = new Ability("Focus strike");
Abilities.Physical.FocusStrike.Short = function() { return "Bypass defenses."; }
Abilities.Physical.FocusStrike.cost = { hp: null, sp: 50, lp: null};
Abilities.Physical.FocusStrike.cooldown = 2;
Abilities.Physical.FocusStrike.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.2,
	damageType: {pPierce: 1.5},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] aim[notS] [hisher] strike on a weak point in [tposs] guard! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));


Abilities.Physical.DAttack = new Ability("D.Attack");
Abilities.Physical.DAttack.Short = function() { return "Perform two low accuracy hits."; }
Abilities.Physical.DAttack.cost = { hp: null, sp: 25, lp: null};
Abilities.Physical.DAttack.cooldown = 2;
Abilities.Physical.DAttack.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.75,
	nrAttacks: 2,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] two attacks against [tname] in rapid succession! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));


Abilities.Physical.TAttack = new Ability("T.Attack");
Abilities.Physical.TAttack.Short = function() { return "Perform three low accuracy hits."; }
Abilities.Physical.TAttack.cost = { hp: null, sp: 60, lp: null};
Abilities.Physical.TAttack.cooldown = 3;
Abilities.Physical.TAttack.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.75,
	nrAttacks: 3,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] three attacks against [tname] in rapid succession! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));


Abilities.Physical.QAttack = new Ability("Q.Attack");
Abilities.Physical.QAttack.Short = function() { return "Perform four low accuracy hits."; }
Abilities.Physical.QAttack.cost = { hp: null, sp: 100, lp: null};
Abilities.Physical.QAttack.cooldown = 4;
Abilities.Physical.QAttack.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.75,
	nrAttacks: 4,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] four attacks against [tname] in rapid succession! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));


Abilities.Physical.Frenzy = new Ability("Frenzy");
Abilities.Physical.Frenzy.Short = function() { return "Perform a flurry of five strikes, leaving you exhausted."; }
Abilities.Physical.Frenzy.cost = { hp: 100, sp: 80, lp: null};
Abilities.Physical.Frenzy.cooldown = 5;
Abilities.Physical.Frenzy.castTime = 100;
Abilities.Physical.Frenzy.onCast.push(function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] [is] riling [himher]self up, preparing to launch an onslaught of blows on [tname]! ", parse);
});
Abilities.Physical.Frenzy.castTree.push(AbilityNode.Template.Physical({
	nrAttacks: 5,
	onCast: [function(ability, encounter, caster, target) {
		var entry = caster.GetCombatEntry(encounter);
		if(entry) entry.initiative -= 50;
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] a frenzied assault, attacking [tname] with five rapid blows!", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));


Abilities.Physical.CrushingStrike = new Ability("Crushing.S");
Abilities.Physical.CrushingStrike.Short = function() { return "Crushing strike that deals massive damage, with high chance of stunning. Slight recoil effect."; }
Abilities.Physical.CrushingStrike.cost = { hp: 25, sp: 10, lp: null};
Abilities.Physical.CrushingStrike.cooldown = 2;
Abilities.Physical.CrushingStrike.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.5,
	hitMod: 0.9,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] a wild assault against [tname]! ", parse);
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] deliver[notS] a crushing blow to [tname] for " + Text.Damage(-dmg) + " damage, staggering [thimher]!", parse);
	}],
	onHit: [function(ability, encounter, caster, target) {
		if(Math.random() < 0.8) {
			var entry = target.GetCombatEntry(encounter);
			if(entry) entry.initiative -= 75;
		}
	}],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));


Abilities.Physical.Provoke = new Ability("Provoke");
Abilities.Physical.Provoke.Short = function() { return "Try to provoke the enemy to focus on you. Single target."; }
Abilities.Physical.Provoke.cost = { hp: null, sp: 15, lp: null};
Abilities.Physical.Provoke.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.1,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] taunt[notS] [tname]! ", parse);
	}],
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] doesn't look very impressed.", parse);
	}],
	onDamage: [Abilities.Physical._onDamage],
	onHit: [function(ability, encounter, caster, target) {
		var aggroEntry = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if(aggroEntry)
			aggroEntry.aggro += 1;
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] become[tnotS] agitated, turning more aggressive toward [name]!", parse);
	}]
}));


Abilities.Physical.Taunt = new Ability("Taunt");
Abilities.Physical.Taunt.Short = function() { return "Try to taunt the enemy to focus on you. Single target."; }
Abilities.Physical.Taunt.cost = { hp: null, sp: 30, lp: null};
Abilities.Physical.Taunt.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.5,
	hitMod: 1.1,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] taunt[notS] [tname]! ", parse);
	}],
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] doesn't look very impressed.", parse);
	}],
	onDamage: [Abilities.Physical._onDamage],
	onHit: [function(ability, encounter, caster, target) {
		var aggroEntry = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if(aggroEntry)
			aggroEntry.aggro += 3;
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] become[tnotS] agitated, turning more aggressive toward [name]!", parse);
	}]
}));


Abilities.Physical.Fade = new Ability("Fade");
Abilities.Physical.Fade.Short = function() { return "Fade from the focus of the enemy."; }
Abilities.Physical.Fade.cooldown = 3;
Abilities.Physical.Fade.targetMode = TargetMode.Enemies;
Abilities.Physical.Fade.cost = { hp: null, sp: 50, lp: null};
Abilities.Physical.Fade.castTree.push(AbilityNode.Template.Physical({
	toDamage: null,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] fade[notS] from notice.", parse);
	}],
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.NL();
		Text.Add("[tName] [tis] not very impressed.", parse);
	}],
	onHit: [function(ability, encounter, caster, target) {
		var aggroEntry = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if(aggroEntry)
			aggroEntry.aggro /= 2;
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.NL();
		Text.Add("[tName] become[tnotS] distracted, turning [thisher] attention away from [name]!", parse);
	}]
}));
