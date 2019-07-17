/*
 * 
 * Healing
 * 
 */

import { AbilityNode } from './node';
import { Ability, Abilities, TargetMode } from '../ability';

Abilities.White = {};
Abilities.White._onHeal = function(ability, encounter, caster, target, dmg) {
	if(dmg <= 0) return;
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("It heals [tname] for " + Text.Heal(dmg) + " damage!", parse);
	Text.NL();
}


Abilities.White.FirstAid = new Ability("First aid");
Abilities.White.FirstAid.Short = function() { return "Heals minor damage, single target."; }
Abilities.White.FirstAid.targetMode = TargetMode.Ally;
Abilities.White.FirstAid.cost = { hp: null, sp: 5, lp: null};
Abilities.White.FirstAid.OOC = true;
Abilities.White.FirstAid.castTree.push(AbilityNode.Template.Heal({
	atkMod: 1,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["skin"] = target.SkinDesc();
		Text.Add("[Name] prepare[notS] some soothing salves, gently applying it to [tposs] [skin] with [hisher] [hand]s.", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.White._onHeal]
}));


Abilities.White.Heal = new Ability("Heal");
Abilities.White.Heal.Short = function() { return "Heals some damage, single target."; }
Abilities.White.Heal.targetMode = TargetMode.Ally;
Abilities.White.Heal.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Heal.OOC = true;
Abilities.White.Heal.castTree.push(AbilityNode.Template.Heal({
	atkMod: 1.5,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a healing spell, forming a sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[notS] the enchantment on [tname]", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.White._onHeal]
}));


Abilities.White.Recover = new Ability("Recover");
Abilities.White.Recover.Short = function() { return "Heals moderate damage, single target."; }
Abilities.White.Recover.targetMode = TargetMode.Ally;
Abilities.White.Recover.cost = { hp: null, sp: 30, lp: null};
Abilities.White.Recover.OOC = true;
Abilities.White.Recover.castTree.push(AbilityNode.Template.Heal({
	atkMod: 2,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a powerful healing spell, forming a glowing sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[notS] the enchantment on [tname]", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.White._onHeal]
}));



// TODO: Flavor text, status effects
//TODO REPLACE
Abilities.White.Cheer = new Ability();
Abilities.White.Cheer.name = "Cheer";
Abilities.White.Cheer.Short = function() { return "Boosts party morale, raising spirit and stamina slightly (doesn't stack)."; }
Abilities.White.Cheer.targetMode = TargetMode.Party;
Abilities.White.Cheer.cost = { hp: null, sp: 30, lp: null};
Abilities.White.Cheer.CastInternal = function(encounter, caster, target) {
	// TODO: Make more flavor text
	var parse = {
		name : caster.name,
		s : caster.plural() ? "" : "s"
	}

	Text.Add("[name] cheer[s] the party on, raising morale!", parse);
	Text.NL();
	
	for(var i = 0; i < target.members.length; i++) {
		var e = target.members[i];
		e.stamina.temp = Math.max(e.stamina.temp, caster.MAttack() / 5);
		e.spirit.temp = Math.max(e.spirit.temp, caster.MAttack() / 5);
	}
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


// TODO: Flavor text, status effects
//TODO REPLACE
Abilities.White.Pinpoint = new Ability();
Abilities.White.Pinpoint.name = "Pinpoint";
Abilities.White.Pinpoint.Short = function() { return "Buffs accuracy of one target (doesn't stack)."; }
Abilities.White.Pinpoint.targetMode = TargetMode.Ally;
Abilities.White.Pinpoint.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Pinpoint.CastInternal = function(encounter, caster, target) {
	target.dexterity.temp = Math.max(target.dexterity.temp, caster.MAttack() / 5);
	
	var parse = AbilityNode.DefaultParser(caster, target);

	// TODO: Make more flavor text
	Text.Add("[Name] cast[notS] pinpoint on [tname], making [thimher] more limber!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


/*
 * TODO: Remake into a status effect?
 */
//TODO REPLACE
Abilities.White.Toughen = new Ability();
Abilities.White.Toughen.name = "Toughen";
Abilities.White.Toughen.Short = function() { return "Buffs stamina of one target (doesn't stack)."; }
Abilities.White.Toughen.targetMode = TargetMode.Ally;
Abilities.White.Toughen.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Toughen.CastInternal = function(encounter, caster, target) {
	target.stamina.temp = Math.max(target.stamina.temp, caster.MAttack() / 5);
	
	var parse = AbilityNode.DefaultParser(caster, target);

	// TODO: Make more flavor text
	Text.Add("[Name] cast[notS] toughen on [tname], protecting [thimher] from harm!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


/*
 * TODO: Remake into a status effect?
 */
//TODO REPLACE
Abilities.White.Empower = new Ability();
Abilities.White.Empower.name = "Empower";
Abilities.White.Empower.Short = function() { return "Buffs strength of one target (doesn't stack)."; }
Abilities.White.Empower.targetMode = TargetMode.Ally;
Abilities.White.Empower.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Empower.CastInternal = function(encounter, caster, target) {
	target.strength.temp = Math.max(target.strength.temp, caster.MAttack() / 5);
	
	var parse = AbilityNode.DefaultParser(caster, target);

	// TODO: Make more flavor text
	Text.Add("[Name] cast[notS] empower on [tname], filling [thimher] with strength!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.White.Tirade = new Ability("Tirade");
Abilities.White.Tirade.name = "Tirade";
Abilities.White.Tirade.Short = function() { return "Attempt to bore the enemy with meaningless drivel. Drain enemy SP."; }
Abilities.White.Tirade.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Tirade.cooldown = 1;
Abilities.White.Tirade._onMiss = function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(null, target);
	Text.Add(", but [tname] [tis]n't very impressed!", parse);
}
Abilities.White.Tirade.castTree.push(AbilityNode.Template.Magical({
	hitMod: 0.7,
	atkMod: 0.5,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	damagePool: [AbilityNode.DamagePool.Magical],
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] start[notS] rambling about petty things", parse);
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add(" in an attempt to distract [tname]. It seems to be working, [theshe] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.Mana(-dmg) + " SP from [tname]!", parse);
	}],
	onAbsorb: [Abilities.White.Tirade._onMiss],
	onMiss: [Abilities.White.Tirade._onMiss]
}));


Abilities.White.Preach = new Ability("Preach");
Abilities.White.Preach.Short = function() { return "Attempt to bore the enemy with pompous religious drivel. Drain enemy SP."; }
Abilities.White.Preach.cost = { hp: null, sp: 20, lp: null};
Abilities.White.Preach.cooldown = 2;
Abilities.White.Preach._onMiss = function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(null, target);
	Text.Add("However, [tname] [tis]n't very impressed!", parse);
	Text.NL();
}
Abilities.White.Preach.castTree.push(AbilityNode.Template.Magical({
	hitMod: 1,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	damagePool: [AbilityNode.DamagePool.Magical],
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] start[notS] preaching to [tname]. ", parse);
		Text.NL();
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("It seems to be working, [tname] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.Mana(-dmg) + " SP from [tname]!", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.White.Preach._onMiss],
	onMiss: [Abilities.White.Preach._onMiss]
}));


Abilities.White.Sermon = new Ability("Sermon");
Abilities.White.Sermon.Short = function() { return "Attempt to bore the enemy party with religious proselytizing. Drain enemy SP."; }
Abilities.White.Sermon.targetMode = TargetMode.Enemies;
Abilities.White.Sermon.cost = { hp: null, sp: 50, lp: null};
Abilities.White.Sermon.cooldown = 3;
Abilities.White.Sermon.castTree.push(AbilityNode.Template.Magical({
	hitMod: 1,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	damagePool: [AbilityNode.DamagePool.Magical],
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] start[notS] proselytizing to the enemy party. Somehow, [heshe] manage[notS] to sound extremely condescending and immensly boring at the same time!", parse);
		Text.NL();
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("It seems to be working, [tname] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.Mana(-dmg) + " SP from [tname]!", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.White.Preach._onMiss],
	onMiss: [Abilities.White.Preach._onMiss]
}));


Abilities.White.Cleanse = new Ability();
Abilities.White.Cleanse.name = "Cleanse";
Abilities.White.Cleanse.Short = function() { return "Remove a negative physical status effect from an ally or a positive physical status effect from an enemy."; }
Abilities.White.Cleanse.targetMode = TargetMode.All;
Abilities.White.Cleanse.cost = { hp: null, sp: 20, lp: null};
Abilities.White.Cleanse.cooldown = 2;
Abilities.White.Cleanse.casttime = 25;
Abilities.White.Cleanse.CastInternal = function(encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	
	var ally = true;
	
	var casterentry = caster.GetCombatEntry(encounter);
	var targetentry = target.GetCombatEntry(encounter);
	if(casterentry && targetentry) {
		ally = (casterentry.isEnemy == targetentry.isEnemy);
	}
	var confuse = caster.combatStatus.stats[StatusEffect.Confuse];
	if(confuse)
		ally = !ally;
	
	Text.Add("[Name] prepare[notS] a wave of cleansing magic. ", parse);
	//TODO
	if(ally) {
		Text.Add("[tName] [tis] healed of any physically debilitating effects!", parse);
		target.combatStatus.stats[StatusEffect.Burn]   = null;
		target.combatStatus.stats[StatusEffect.Freeze] = null;
		target.combatStatus.stats[StatusEffect.Numb]   = null;
		target.combatStatus.stats[StatusEffect.Venom]  = null;
		target.combatStatus.stats[StatusEffect.Blind]  = null;
		target.combatStatus.stats[StatusEffect.Sleep]  = null;
		target.combatStatus.stats[StatusEffect.Bleed]  = null;
	}
	else {
		Text.Add("[tName] [tis] stripped of any physically strengthening effects!", parse);
	}
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.White.Dispel = new Ability();
Abilities.White.Dispel.name = "Dispel";
Abilities.White.Dispel.Short = function() { return "Remove a negative magical status effect from an ally or a positive magical status effect from an enemy."; }
Abilities.White.Dispel.targetMode = TargetMode.All;
Abilities.White.Dispel.cost = { hp: null, sp: 20, lp: null};
Abilities.White.Dispel.cooldown = 2;
Abilities.White.Dispel.casttime = 25;
Abilities.White.Dispel.CastInternal = function(encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	
	var ally = true;
	
	var casterentry = caster.GetCombatEntry(encounter);
	var targetentry = target.GetCombatEntry(encounter);
	if(casterentry && targetentry) {
		ally = (casterentry.isEnemy == targetentry.isEnemy);
	}
	var confuse = caster.combatStatus.stats[StatusEffect.Confuse];
	if(confuse)
		ally = !ally;
	
	Text.Add("[Name] start[notS] casting a counter magic spell. ", parse);
	//TODO
	if(ally) {
		Text.Add("[tName] [tis] healed of any magical debilitating effects!", parse);
		target.combatStatus.stats[StatusEffect.Curse]    = null;
		target.combatStatus.stats[StatusEffect.Slow]     = null;
		target.combatStatus.stats[StatusEffect.Siphon]   = null;
		target.combatStatus.stats[StatusEffect.Weakness] = null;
		target.combatStatus.stats[StatusEffect.Petrify]  = null;
		target.combatStatus.stats[StatusEffect.Seal]     = null;
	}
	else {
		Text.Add("[tName] [tis] stripped of any magical bolstering effects!", parse);
		target.combatStatus.stats[StatusEffect.Decoy] = null;
		target.combatStatus.stats[StatusEffect.Haste] = null;
		target.combatStatus.stats[StatusEffect.Regen] = null;
		target.combatStatus.stats[StatusEffect.Boon]  = null;
	}
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.White.Purify = new Ability();
Abilities.White.Purify.name = "Purify";
Abilities.White.Purify.Short = function() { return "Remove a negative lust-based status effect from an ally or a positive lust-based status effect from an enemy."; }
Abilities.White.Purify.targetMode = TargetMode.All;
Abilities.White.Purify.cost = { hp: null, sp: 20, lp: null};
Abilities.White.Purify.cooldown = 2;
Abilities.White.Purify.casttime = 25;
Abilities.White.Purify.CastInternal = function(encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	
	var ally = true;
	
	var casterentry = caster.GetCombatEntry(encounter);
	var targetentry = target.GetCombatEntry(encounter);
	if(casterentry && targetentry) {
		ally = (casterentry.isEnemy == targetentry.isEnemy);
	}
	var confuse = caster.combatStatus.stats[StatusEffect.Confuse];
	if(confuse)
		ally = !ally;
	
	Text.Add("[Name] cast[notS] a purifying spell. ", parse);
	//TODO
	if(ally) {
		Text.Add("[tName] [tis] healed of any lust-based debilitating effects!", parse);
		target.combatStatus.stats[StatusEffect.Horny]   = null;
		target.combatStatus.stats[StatusEffect.Limp]    = null;
		target.combatStatus.stats[StatusEffect.Confuse] = null;
	}
	else {
		Text.Add("[tName] [tis] stripped of any lust-based enhancing effects!", parse);
	}
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
