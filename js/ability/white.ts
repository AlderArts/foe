/*
 * 
 * Healing
 * 
 */

import { AbilityNode } from './node';
import { Ability, TargetMode } from '../ability';
import { Text } from '../text';
import { Encounter } from '../combat';
import { Entity } from '../entity';
import { Gui } from '../gui';
import { StatusEffect } from '../statuseffect';
import { Party } from '../party';

let WhiteAb : any = {};
WhiteAb._onHeal = function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
	if(dmg <= 0) return;
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("It heals [tname] for " + Text.Heal(dmg) + " damage!", parse);
	Text.NL();
}


WhiteAb.FirstAid = new Ability("First aid");
WhiteAb.FirstAid.Short = function() { return "Heals minor damage, single target."; }
WhiteAb.FirstAid.targetMode = TargetMode.Ally;
WhiteAb.FirstAid.cost = { hp: null, sp: 5, lp: null};
WhiteAb.FirstAid.OOC = true;
WhiteAb.FirstAid.castTree.push(AbilityNode.Template.Heal({
	atkMod: 1,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["skin"] = target.SkinDesc();
		Text.Add("[Name] prepare[notS] some soothing salves, gently applying it to [tposs] [skin] with [hisher] [hand]s.", parse);
		Text.NL();
	}],
	onAbsorb: [WhiteAb._onHeal]
}));


WhiteAb.Heal = new Ability("Heal");
WhiteAb.Heal.Short = function() { return "Heals some damage, single target."; }
WhiteAb.Heal.targetMode = TargetMode.Ally;
WhiteAb.Heal.cost = { hp: null, sp: 10, lp: null};
WhiteAb.Heal.OOC = true;
WhiteAb.Heal.castTree.push(AbilityNode.Template.Heal({
	atkMod: 1.5,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a healing spell, forming a sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[notS] the enchantment on [tname]", parse);
		Text.NL();
	}],
	onAbsorb: [WhiteAb._onHeal]
}));


WhiteAb.Recover = new Ability("Recover");
WhiteAb.Recover.Short = function() { return "Heals moderate damage, single target."; }
WhiteAb.Recover.targetMode = TargetMode.Ally;
WhiteAb.Recover.cost = { hp: null, sp: 30, lp: null};
WhiteAb.Recover.OOC = true;
WhiteAb.Recover.castTree.push(AbilityNode.Template.Heal({
	atkMod: 2,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a powerful healing spell, forming a glowing sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[notS] the enchantment on [tname]", parse);
		Text.NL();
	}],
	onAbsorb: [WhiteAb._onHeal]
}));



// TODO: Flavor text, status effects
//TODO REPLACE
WhiteAb.Cheer = new Ability();
WhiteAb.Cheer.name = "Cheer";
WhiteAb.Cheer.Short = function() { return "Boosts party morale, raising spirit and stamina slightly (doesn't stack)."; }
WhiteAb.Cheer.targetMode = TargetMode.Party;
WhiteAb.Cheer.cost = { hp: null, sp: 30, lp: null};
WhiteAb.Cheer.CastInternal = function(encounter : Encounter, caster : Entity, target : Party) {
	// TODO: Make more flavor text
	var parse : any = {
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
WhiteAb.Pinpoint = new Ability();
WhiteAb.Pinpoint.name = "Pinpoint";
WhiteAb.Pinpoint.Short = function() { return "Buffs accuracy of one target (doesn't stack)."; }
WhiteAb.Pinpoint.targetMode = TargetMode.Ally;
WhiteAb.Pinpoint.cost = { hp: null, sp: 10, lp: null};
WhiteAb.Pinpoint.CastInternal = function(encounter : Encounter, caster : Entity, target : Entity) {
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
WhiteAb.Toughen = new Ability();
WhiteAb.Toughen.name = "Toughen";
WhiteAb.Toughen.Short = function() { return "Buffs stamina of one target (doesn't stack)."; }
WhiteAb.Toughen.targetMode = TargetMode.Ally;
WhiteAb.Toughen.cost = { hp: null, sp: 10, lp: null};
WhiteAb.Toughen.CastInternal = function(encounter : Encounter, caster : Entity, target : Entity) {
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
WhiteAb.Empower = new Ability();
WhiteAb.Empower.name = "Empower";
WhiteAb.Empower.Short = function() { return "Buffs strength of one target (doesn't stack)."; }
WhiteAb.Empower.targetMode = TargetMode.Ally;
WhiteAb.Empower.cost = { hp: null, sp: 10, lp: null};
WhiteAb.Empower.CastInternal = function(encounter : Encounter, caster : Entity, target : Entity) {
	target.strength.temp = Math.max(target.strength.temp, caster.MAttack() / 5);
	
	var parse = AbilityNode.DefaultParser(caster, target);

	// TODO: Make more flavor text
	Text.Add("[Name] cast[notS] empower on [tname], filling [thimher] with strength!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


WhiteAb.Tirade = new Ability("Tirade");
WhiteAb.Tirade.name = "Tirade";
WhiteAb.Tirade.Short = function() { return "Attempt to bore the enemy with meaningless drivel. Drain enemy SP."; }
WhiteAb.Tirade.cost = { hp: null, sp: 10, lp: null};
WhiteAb.Tirade.cooldown = 1;
WhiteAb.Tirade._onMiss = function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
	var parse = AbilityNode.DefaultParser(null, target);
	Text.Add(", but [tname] [tis]n't very impressed!", parse);
}
WhiteAb.Tirade.castTree.push(AbilityNode.Template.Magical({
	hitMod: 0.7,
	atkMod: 0.5,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	damagePool: [AbilityNode.DamagePool.Magical],
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] start[notS] rambling about petty things", parse);
	}],
	onDamage: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add(" in an attempt to distract [tname]. It seems to be working, [theshe] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.Mana(-dmg) + " SP from [tname]!", parse);
	}],
	onAbsorb: [WhiteAb.Tirade._onMiss],
	onMiss: [WhiteAb.Tirade._onMiss]
}));


WhiteAb.Preach = new Ability("Preach");
WhiteAb.Preach.Short = function() { return "Attempt to bore the enemy with pompous religious drivel. Drain enemy SP."; }
WhiteAb.Preach.cost = { hp: null, sp: 20, lp: null};
WhiteAb.Preach.cooldown = 2;
WhiteAb.Preach._onMiss = function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
	var parse = AbilityNode.DefaultParser(null, target);
	Text.Add("However, [tname] [tis]n't very impressed!", parse);
	Text.NL();
}
WhiteAb.Preach.castTree.push(AbilityNode.Template.Magical({
	hitMod: 1,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	damagePool: [AbilityNode.DamagePool.Magical],
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] start[notS] preaching to [tname]. ", parse);
		Text.NL();
	}],
	onDamage: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("It seems to be working, [tname] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.Mana(-dmg) + " SP from [tname]!", parse);
		Text.NL();
	}],
	onAbsorb: [WhiteAb.Preach._onMiss],
	onMiss: [WhiteAb.Preach._onMiss]
}));


WhiteAb.Sermon = new Ability("Sermon");
WhiteAb.Sermon.Short = function() { return "Attempt to bore the enemy party with religious proselytizing. Drain enemy SP."; }
WhiteAb.Sermon.targetMode = TargetMode.Enemies;
WhiteAb.Sermon.cost = { hp: null, sp: 50, lp: null};
WhiteAb.Sermon.cooldown = 3;
WhiteAb.Sermon.castTree.push(AbilityNode.Template.Magical({
	hitMod: 1,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	damagePool: [AbilityNode.DamagePool.Magical],
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] start[notS] proselytizing to the enemy party. Somehow, [heshe] manage[notS] to sound extremely condescending and immensly boring at the same time!", parse);
		Text.NL();
	}],
	onDamage: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("It seems to be working, [tname] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.Mana(-dmg) + " SP from [tname]!", parse);
		Text.NL();
	}],
	onAbsorb: [WhiteAb.Preach._onMiss],
	onMiss: [WhiteAb.Preach._onMiss]
}));


WhiteAb.Cleanse = new Ability();
WhiteAb.Cleanse.name = "Cleanse";
WhiteAb.Cleanse.Short = function() { return "Remove a negative physical status effect from an ally or a positive physical status effect from an enemy."; }
WhiteAb.Cleanse.targetMode = TargetMode.All;
WhiteAb.Cleanse.cost = { hp: null, sp: 20, lp: null};
WhiteAb.Cleanse.cooldown = 2;
WhiteAb.Cleanse.casttime = 25;
WhiteAb.Cleanse.CastInternal = function(encounter : Encounter, caster : Entity, target : Entity) {
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


WhiteAb.Dispel = new Ability();
WhiteAb.Dispel.name = "Dispel";
WhiteAb.Dispel.Short = function() { return "Remove a negative magical status effect from an ally or a positive magical status effect from an enemy."; }
WhiteAb.Dispel.targetMode = TargetMode.All;
WhiteAb.Dispel.cost = { hp: null, sp: 20, lp: null};
WhiteAb.Dispel.cooldown = 2;
WhiteAb.Dispel.casttime = 25;
WhiteAb.Dispel.CastInternal = function(encounter : Encounter, caster : Entity, target : Entity) {
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


WhiteAb.Purify = new Ability();
WhiteAb.Purify.name = "Purify";
WhiteAb.Purify.Short = function() { return "Remove a negative lust-based status effect from an ally or a positive lust-based status effect from an enemy."; }
WhiteAb.Purify.targetMode = TargetMode.All;
WhiteAb.Purify.cost = { hp: null, sp: 20, lp: null};
WhiteAb.Purify.cooldown = 2;
WhiteAb.Purify.casttime = 25;
WhiteAb.Purify.CastInternal = function(encounter : Encounter, caster : Entity, target : Entity) {
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

export { WhiteAb };
