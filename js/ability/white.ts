/*
 *
 * Healing
 *
 */

import { Ability, TargetMode } from "../ability";
import { Encounter } from "../combat";
import { Entity } from "../entity";
import { Gui } from "../gui";
import { Party } from "../party";
import { StatusEffect } from "../statuseffect";
import { Text } from "../text";
import { AbilityNode } from "./node";

const WhiteAb: any = {};
WhiteAb._onHeal = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
	if (dmg <= 0) { return; }
	const parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("It heals [tname] for " + Text.Heal(dmg) + " damage!", parse);
	Text.NL();
};

WhiteAb.FirstAid = new Ability("First aid");
WhiteAb.FirstAid.Short = () => "Heals minor damage, single target.";
WhiteAb.FirstAid.targetMode = TargetMode.Ally;
WhiteAb.FirstAid.cost = { hp: undefined, sp: 5, lp: undefined};
WhiteAb.FirstAid.OOC = true;
WhiteAb.FirstAid.castTree.push(AbilityNode.Template.Heal({
	atkMod: 1,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.skin = target.SkinDesc();
		Text.Add("[Name] prepare[notS] some soothing salves, gently applying it to [tposs] [skin] with [hisher] [hand]s.", parse);
		Text.NL();
	}],
	onAbsorb: [WhiteAb._onHeal],
}));

WhiteAb.Heal = new Ability("Heal");
WhiteAb.Heal.Short = () => "Heals some damage, single target.";
WhiteAb.Heal.targetMode = TargetMode.Ally;
WhiteAb.Heal.cost = { hp: undefined, sp: 10, lp: undefined};
WhiteAb.Heal.OOC = true;
WhiteAb.Heal.castTree.push(AbilityNode.Template.Heal({
	atkMod: 1.5,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a healing spell, forming a sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[notS] the enchantment on [tname]", parse);
		Text.NL();
	}],
	onAbsorb: [WhiteAb._onHeal],
}));

WhiteAb.Recover = new Ability("Recover");
WhiteAb.Recover.Short = () => "Heals moderate damage, single target.";
WhiteAb.Recover.targetMode = TargetMode.Ally;
WhiteAb.Recover.cost = { hp: undefined, sp: 30, lp: undefined};
WhiteAb.Recover.OOC = true;
WhiteAb.Recover.castTree.push(AbilityNode.Template.Heal({
	atkMod: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a powerful healing spell, forming a glowing sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[notS] the enchantment on [tname]", parse);
		Text.NL();
	}],
	onAbsorb: [WhiteAb._onHeal],
}));

// TODO: Flavor text, status effects
// TODO REPLACE
WhiteAb.Cheer = new Ability();
WhiteAb.Cheer.name = "Cheer";
WhiteAb.Cheer.Short = () => "Boosts party morale, raising spirit and stamina slightly (doesn't stack).";
WhiteAb.Cheer.targetMode = TargetMode.Party;
WhiteAb.Cheer.cost = { hp: undefined, sp: 30, lp: undefined};
WhiteAb.Cheer.CastInternal = (encounter: Encounter, caster: Entity, target: Party) => {
	// TODO: Make more flavor text
	const parse: any = {
		name : caster.name,
		s : caster.plural() ? "" : "s",
	};

	Text.Add("[name] cheer[s] the party on, raising morale!", parse);
	Text.NL();

	for (const e of target.members) {
		e.stamina.temp = Math.max(e.stamina.temp, caster.MAttack() / 5);
		e.spirit.temp = Math.max(e.spirit.temp, caster.MAttack() / 5);
	}
	Text.NL();
	encounter.CombatTick();
};

// TODO: Flavor text, status effects
// TODO REPLACE
WhiteAb.Pinpoint = new Ability();
WhiteAb.Pinpoint.name = "Pinpoint";
WhiteAb.Pinpoint.Short = () => "Buffs accuracy of one target (doesn't stack).";
WhiteAb.Pinpoint.targetMode = TargetMode.Ally;
WhiteAb.Pinpoint.cost = { hp: undefined, sp: 10, lp: undefined};
WhiteAb.Pinpoint.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
	target.dexterity.temp = Math.max(target.dexterity.temp, caster.MAttack() / 5);

	const parse = AbilityNode.DefaultParser(caster, target);

	// TODO: Make more flavor text
	Text.Add("[Name] cast[notS] pinpoint on [tname], making [thimher] more limber!", parse);
	Text.NL();
	encounter.CombatTick();
};

/*
 * TODO: Remake into a status effect?
 */
// TODO REPLACE
WhiteAb.Toughen = new Ability();
WhiteAb.Toughen.name = "Toughen";
WhiteAb.Toughen.Short = () => "Buffs stamina of one target (doesn't stack).";
WhiteAb.Toughen.targetMode = TargetMode.Ally;
WhiteAb.Toughen.cost = { hp: undefined, sp: 10, lp: undefined};
WhiteAb.Toughen.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
	target.stamina.temp = Math.max(target.stamina.temp, caster.MAttack() / 5);

	const parse = AbilityNode.DefaultParser(caster, target);

	// TODO: Make more flavor text
	Text.Add("[Name] cast[notS] toughen on [tname], protecting [thimher] from harm!", parse);
	Text.NL();
	encounter.CombatTick();
};

/*
 * TODO: Remake into a status effect?
 */
// TODO REPLACE
WhiteAb.Empower = new Ability();
WhiteAb.Empower.name = "Empower";
WhiteAb.Empower.Short = () => "Buffs strength of one target (doesn't stack).";
WhiteAb.Empower.targetMode = TargetMode.Ally;
WhiteAb.Empower.cost = { hp: undefined, sp: 10, lp: undefined};
WhiteAb.Empower.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
	target.strength.temp = Math.max(target.strength.temp, caster.MAttack() / 5);

	const parse = AbilityNode.DefaultParser(caster, target);

	// TODO: Make more flavor text
	Text.Add("[Name] cast[notS] empower on [tname], filling [thimher] with strength!", parse);
	Text.NL();
	encounter.CombatTick();
};

WhiteAb.Tirade = new Ability("Tirade");
WhiteAb.Tirade.name = "Tirade";
WhiteAb.Tirade.Short = () => "Attempt to bore the enemy with meaningless drivel. Drain enemy SP.";
WhiteAb.Tirade.cost = { hp: undefined, sp: 10, lp: undefined};
WhiteAb.Tirade.cooldown = 1;
WhiteAb.Tirade._onMiss = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(undefined, target);
	Text.Add(", but [tname] [tis]n't very impressed!", parse);
};
WhiteAb.Tirade.castTree.push(AbilityNode.Template.Magical({
	hitMod: 0.7,
	atkMod: 0.5,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	damagePool: [AbilityNode.DamagePool.Magical],
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] start[notS] rambling about petty things", parse);
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add(" in an attempt to distract [tname]. It seems to be working, [theshe] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.Mana(-dmg) + " SP from [tname]!", parse);
	}],
	onAbsorb: [WhiteAb.Tirade._onMiss],
	onMiss: [WhiteAb.Tirade._onMiss],
}));

WhiteAb.Preach = new Ability("Preach");
WhiteAb.Preach.Short = () => "Attempt to bore the enemy with pompous religious drivel. Drain enemy SP.";
WhiteAb.Preach.cost = { hp: undefined, sp: 20, lp: undefined};
WhiteAb.Preach.cooldown = 2;
WhiteAb.Preach._onMiss = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(undefined, target);
	Text.Add("However, [tname] [tis]n't very impressed!", parse);
	Text.NL();
};
WhiteAb.Preach.castTree.push(AbilityNode.Template.Magical({
	hitMod: 1,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	damagePool: [AbilityNode.DamagePool.Magical],
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] start[notS] preaching to [tname]. ", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("It seems to be working, [tname] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.Mana(-dmg) + " SP from [tname]!", parse);
		Text.NL();
	}],
	onAbsorb: [WhiteAb.Preach._onMiss],
	onMiss: [WhiteAb.Preach._onMiss],
}));

WhiteAb.Sermon = new Ability("Sermon");
WhiteAb.Sermon.Short = () => "Attempt to bore the enemy party with religious proselytizing. Drain enemy SP.";
WhiteAb.Sermon.targetMode = TargetMode.Enemies;
WhiteAb.Sermon.cost = { hp: undefined, sp: 50, lp: undefined};
WhiteAb.Sermon.cooldown = 3;
WhiteAb.Sermon.castTree.push(AbilityNode.Template.Magical({
	hitMod: 1,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	damagePool: [AbilityNode.DamagePool.Magical],
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] start[notS] proselytizing to the enemy party. Somehow, [heshe] manage[notS] to sound extremely condescending and immensly boring at the same time!", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("It seems to be working, [tname] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.Mana(-dmg) + " SP from [tname]!", parse);
		Text.NL();
	}],
	onAbsorb: [WhiteAb.Preach._onMiss],
	onMiss: [WhiteAb.Preach._onMiss],
}));

WhiteAb.Cleanse = new Ability();
WhiteAb.Cleanse.name = "Cleanse";
WhiteAb.Cleanse.Short = () => "Remove a negative physical status effect from an ally or a positive physical status effect from an enemy.";
WhiteAb.Cleanse.targetMode = TargetMode.All;
WhiteAb.Cleanse.cost = { hp: undefined, sp: 20, lp: undefined};
WhiteAb.Cleanse.cooldown = 2;
WhiteAb.Cleanse.casttime = 25;
WhiteAb.Cleanse.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);

	let ally = true;

	const casterentry = caster.GetCombatEntry(encounter);
	const targetentry = target.GetCombatEntry(encounter);
	if (casterentry && targetentry) {
		ally = (casterentry.isEnemy === targetentry.isEnemy);
	}
	const confuse = caster.combatStatus.stats[StatusEffect.Confuse];
	if (confuse) {
		ally = !ally;
	}

	Text.Add("[Name] prepare[notS] a wave of cleansing magic. ", parse);
	// TODO
	if (ally) {
		Text.Add("[tName] [tis] healed of any physically debilitating effects!", parse);
		target.combatStatus.stats[StatusEffect.Burn]   = undefined;
		target.combatStatus.stats[StatusEffect.Freeze] = undefined;
		target.combatStatus.stats[StatusEffect.Numb]   = undefined;
		target.combatStatus.stats[StatusEffect.Venom]  = undefined;
		target.combatStatus.stats[StatusEffect.Blind]  = undefined;
		target.combatStatus.stats[StatusEffect.Sleep]  = undefined;
		target.combatStatus.stats[StatusEffect.Bleed]  = undefined;
	} else {
		Text.Add("[tName] [tis] stripped of any physically strengthening effects!", parse);
	}
	Text.NL();
	encounter.CombatTick();
};

WhiteAb.Dispel = new Ability();
WhiteAb.Dispel.name = "Dispel";
WhiteAb.Dispel.Short = () => "Remove a negative magical status effect from an ally or a positive magical status effect from an enemy.";
WhiteAb.Dispel.targetMode = TargetMode.All;
WhiteAb.Dispel.cost = { hp: undefined, sp: 20, lp: undefined};
WhiteAb.Dispel.cooldown = 2;
WhiteAb.Dispel.casttime = 25;
WhiteAb.Dispel.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);

	let ally = true;

	const casterentry = caster.GetCombatEntry(encounter);
	const targetentry = target.GetCombatEntry(encounter);
	if (casterentry && targetentry) {
		ally = (casterentry.isEnemy === targetentry.isEnemy);
	}
	const confuse = caster.combatStatus.stats[StatusEffect.Confuse];
	if (confuse) {
		ally = !ally;
	}

	Text.Add("[Name] start[notS] casting a counter magic spell. ", parse);
	// TODO
	if (ally) {
		Text.Add("[tName] [tis] healed of any magical debilitating effects!", parse);
		target.combatStatus.stats[StatusEffect.Curse]    = undefined;
		target.combatStatus.stats[StatusEffect.Slow]     = undefined;
		target.combatStatus.stats[StatusEffect.Siphon]   = undefined;
		target.combatStatus.stats[StatusEffect.Weakness] = undefined;
		target.combatStatus.stats[StatusEffect.Petrify]  = undefined;
		target.combatStatus.stats[StatusEffect.Seal]     = undefined;
	} else {
		Text.Add("[tName] [tis] stripped of any magical bolstering effects!", parse);
		target.combatStatus.stats[StatusEffect.Decoy] = undefined;
		target.combatStatus.stats[StatusEffect.Haste] = undefined;
		target.combatStatus.stats[StatusEffect.Regen] = undefined;
		target.combatStatus.stats[StatusEffect.Boon]  = undefined;
	}
	Text.NL();
	encounter.CombatTick();
};

WhiteAb.Purify = new Ability();
WhiteAb.Purify.name = "Purify";
WhiteAb.Purify.Short = () => "Remove a negative lust-based status effect from an ally or a positive lust-based status effect from an enemy.";
WhiteAb.Purify.targetMode = TargetMode.All;
WhiteAb.Purify.cost = { hp: undefined, sp: 20, lp: undefined};
WhiteAb.Purify.cooldown = 2;
WhiteAb.Purify.casttime = 25;
WhiteAb.Purify.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);

	let ally = true;

	const casterentry = caster.GetCombatEntry(encounter);
	const targetentry = target.GetCombatEntry(encounter);
	if (casterentry && targetentry) {
		ally = (casterentry.isEnemy === targetentry.isEnemy);
	}
	const confuse = caster.combatStatus.stats[StatusEffect.Confuse];
	if (confuse) {
		ally = !ally;
	}

	Text.Add("[Name] cast[notS] a purifying spell. ", parse);
	// TODO
	if (ally) {
		Text.Add("[tName] [tis] healed of any lust-based debilitating effects!", parse);
		target.combatStatus.stats[StatusEffect.Horny]   = undefined;
		target.combatStatus.stats[StatusEffect.Limp]    = undefined;
		target.combatStatus.stats[StatusEffect.Confuse] = undefined;
	} else {
		Text.Add("[tName] [tis] stripped of any lust-based enhancing effects!", parse);
	}
	Text.NL();
	encounter.CombatTick();
};

export { WhiteAb };
