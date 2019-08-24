/*
 *
 * Healing
 *
 */

import { Ability, TargetMode } from "../ability";
import { Encounter } from "../combat";
import { Entity } from "../entity";
import { Party } from "../party";
import { StatusEffect } from "../statuseffect";
import { Text } from "../text";
import { AbilityNode } from "./node";

const whiteOnHeal = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
	if (dmg <= 0) { return; }
	const parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("It heals [tname] for " + Text.Heal(dmg) + " damage!", parse);
	Text.NL();
};

const firstAid = new Ability("First aid");
firstAid.Short = () => "Heals minor damage, single target.";
firstAid.targetMode = TargetMode.Ally;
firstAid.cost = { hp: undefined, sp: 5, lp: undefined};
firstAid.OOC = true;
firstAid.castTree.push(AbilityNode.Template.Heal({
	atkMod: 1,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.skin = target.SkinDesc();
		Text.Add("[Name] prepare[notS] some soothing salves, gently applying it to [tposs] [skin] with [hisher] [hand]s.", parse);
		Text.NL();
	}],
	onAbsorb: [whiteOnHeal],
}));

const heal = new Ability("Heal");
heal.Short = () => "Heals some damage, single target.";
heal.targetMode = TargetMode.Ally;
heal.cost = { hp: undefined, sp: 10, lp: undefined};
heal.OOC = true;
heal.castTree.push(AbilityNode.Template.Heal({
	atkMod: 1.5,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a healing spell, forming a sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[notS] the enchantment on [tname].", parse);
		Text.NL();
	}],
	onAbsorb: [whiteOnHeal],
}));

const recover = new Ability("Recover");
recover.Short = () => "Heals moderate damage, single target.";
recover.targetMode = TargetMode.Ally;
recover.cost = { hp: undefined, sp: 30, lp: undefined};
recover.OOC = true;
recover.castTree.push(AbilityNode.Template.Heal({
	atkMod: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a powerful healing spell, forming a glowing sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[notS] the enchantment on [tname].", parse);
		Text.NL();
	}],
	onAbsorb: [whiteOnHeal],
}));

const raise = new Ability("Raise");
raise.Short = () => "Raises an ally that has been knocked out.";
raise.targetMode = TargetMode.AllyFallen;
raise.cost = { hp: undefined, sp: 150, lp: undefined};
raise.cooldown = 2;
raise.castTime = 100;
raise.castTree.push(AbilityNode.Template.Heal({
	hitFallen: true,
	atkMod: 0.5,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] start[notS] casting a restorative spell, aiming to get [tname] back into the fight!", parse);
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] groan[tnotS] weakly on the ground as [name] release[notS] a powerful healing spell. The magic eases [tposs] wounds, allowing [thimher] to return to the battle.", parse);
		Text.NL();
	}],
	onAbsorb: [whiteOnHeal],
}));

// TODO: Flavor text, status effects
// TODO REPLACE
const cheer = new Ability();
cheer.name = "Cheer";
cheer.Short = () => "Boosts party morale, raising spirit and stamina slightly (doesn't stack).";
cheer.targetMode = TargetMode.Party;
cheer.cost = { hp: undefined, sp: 30, lp: undefined};
cheer.CastInternal = (encounter: Encounter, caster: Entity, target: Party) => {
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
const pinpoint = new Ability();
pinpoint.name = "Pinpoint";
pinpoint.Short = () => "Buffs accuracy of one target (doesn't stack).";
pinpoint.targetMode = TargetMode.Ally;
pinpoint.cost = { hp: undefined, sp: 10, lp: undefined};
pinpoint.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
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
const toughen = new Ability();
toughen.name = "Toughen";
toughen.Short = () => "Buffs stamina of one target (doesn't stack).";
toughen.targetMode = TargetMode.Ally;
toughen.cost = { hp: undefined, sp: 10, lp: undefined};
toughen.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
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
const empower = new Ability();
empower.name = "Empower";
empower.Short = () => "Buffs strength of one target (doesn't stack).";
empower.targetMode = TargetMode.Ally;
empower.cost = { hp: undefined, sp: 10, lp: undefined};
empower.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
	target.strength.temp = Math.max(target.strength.temp, caster.MAttack() / 5);

	const parse = AbilityNode.DefaultParser(caster, target);

	// TODO: Make more flavor text
	Text.Add("[Name] cast[notS] empower on [tname], filling [thimher] with strength!", parse);
	Text.NL();
	encounter.CombatTick();
};

const tirade = new Ability("Tirade");
tirade.name = "Tirade";
tirade.Short = () => "Attempt to bore the enemy with meaningless drivel. Drain enemy SP.";
tirade.cost = { hp: undefined, sp: 10, lp: undefined};
tirade.cooldown = 1;
const tiradeOnMiss = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(undefined, target);
	Text.Add(", but [tname] [tis]n't very impressed!", parse);
};
tirade.castTree.push(AbilityNode.Template.Magical({
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
	onAbsorb: [tiradeOnMiss],
	onMiss: [tiradeOnMiss],
}));

const preach = new Ability("Preach");
preach.Short = () => "Attempt to bore the enemy with pompous religious drivel. Drain enemy SP.";
preach.cost = { hp: undefined, sp: 20, lp: undefined};
preach.cooldown = 2;
const preachOnMiss = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(undefined, target);
	Text.Add("However, [tname] [tis]n't very impressed!", parse);
	Text.NL();
};
preach.castTree.push(AbilityNode.Template.Magical({
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
	onAbsorb: [preachOnMiss],
	onMiss: [preachOnMiss],
}));

const sermon = new Ability("Sermon");
sermon.Short = () => "Attempt to bore the enemy party with religious proselytizing. Drain enemy SP.";
sermon.targetMode = TargetMode.Enemies;
sermon.cost = { hp: undefined, sp: 50, lp: undefined};
sermon.cooldown = 3;
sermon.castTree.push(AbilityNode.Template.Magical({
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
	onAbsorb: [preachOnMiss],
	onMiss: [preachOnMiss],
}));

const cleanse = new Ability();
cleanse.name = "Cleanse";
cleanse.Short = () => "Remove a negative physical status effect from an ally or a positive physical status effect from an enemy.";
cleanse.targetMode = TargetMode.All;
cleanse.cost = { hp: undefined, sp: 20, lp: undefined};
cleanse.cooldown = 2;
cleanse.castTime = 25;
cleanse.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
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

const dispel = new Ability();
dispel.name = "Dispel";
dispel.Short = () => "Remove a negative magical status effect from an ally or a positive magical status effect from an enemy.";
dispel.targetMode = TargetMode.All;
dispel.cost = { hp: undefined, sp: 20, lp: undefined};
dispel.cooldown = 2;
dispel.castTime = 25;
dispel.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
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

const purify = new Ability();
purify.name = "Purify";
purify.Short = () => "Remove a negative lust-based status effect from an ally or a positive lust-based status effect from an enemy.";
purify.targetMode = TargetMode.All;
purify.cost = { hp: undefined, sp: 20, lp: undefined};
purify.cooldown = 2;
purify.castTime = 25;
purify.CastInternal = (encounter: Encounter, caster: Entity, target: Entity) => {
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

export namespace WhiteAb {
	export const FirstAid = firstAid;
	export const Heal = heal;
	export const Recover = recover;
	export const Raise = raise;
	export const Cheer = cheer;
	export const Pinpoint = pinpoint;
	export const Toughen = toughen;
	export const Empower = empower;
	export const Tirade = tirade;
	export const Preach = preach;
	export const Sermon = sermon;
	export const Cleanse = cleanse;
	export const Dispel = dispel;
	export const Purify = purify;
}
