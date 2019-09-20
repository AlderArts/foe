/*
 *
 * Lust attacks
 *
 */
import * as _ from "lodash";

import { Ability, TargetMode } from "../ability";
import { Encounter } from "../combat";
import { Entity } from "../entity";
import { Party } from "../party";
import { Status, StatusEffect } from "../statuseffect";
import { Text } from "../text";
import { Defaults, GetAggroEntry } from "./default";
import { AbilityNode } from "./node";

const sleep = new Ability("Sleep");
sleep.Short = () => "Put one enemy to sleep for a short while with magical charms.";
sleep.cost = { hp: undefined, sp: 20, lp: undefined};
sleep.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);

	Text.Add("[Name] weave[notS] [hisher] [hand]s in alluring patterns, winking seductively at [tname]. ", parse);
	if (Status.Sleep(target, { hit : 0.6, turns : 2, turnsR : 2 })) {
		Text.Add("[tName] [tis] unable to resist looking at the hypnotic display, and fall[tnotS] into a slumber. [tName] [thas] been afflicted with sleep!", parse);
	} else {
		Text.Add("[tName] manage[notS] to shake off [poss] enchantment, resisting its drowsing effect.", parse);
	}
	Text.NL();
});

const tIllusion = new Ability("T.Illusion");
tIllusion.Short = () => "Terrifies your foes by creating frightening phantasms that soak up any attacks directed at you.";
tIllusion.cost = { hp: undefined, sp: 25, lp: 10};
tIllusion.targetMode = TargetMode.Self;
tIllusion.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);
	let num = 2;
	num += Math.random() * 3;
	parse.num = Text.NumToText(num);

	Text.Add("Weaving [hisher] [hand]s in exotic patterns, [name] create[notS] [num] terrifying apparitions, which rise from purple smoke; bellowing in rage while drawing their phantasmal weapons.", parse);
	Status.Decoy(caster, { copies : num, func : (attacker: Entity) => {
		const decoy = caster.combatStatus.stats[StatusEffect.Decoy];
		const num = decoy.copies;
		decoy.copies--;
		if (decoy.copies <= 0) {
			caster.combatStatus.stats[StatusEffect.Decoy] = undefined;
		}
		const parse: any = {
			p : num > 1 ? "One of " + caster.possessive() : caster.Possessive(),
			s : num > 1 ? "s" : "",
			aposs   : attacker.possessive(),
			aName   : attacker.NameDesc(),
			ahisher : attacker.hisher(),
			ahas    : attacker.has(),
			anotS   : attacker.plural() ? "" : "s",
		};
		Text.Add("[p] spectral servant[s] quickly moves in the way of [aposs] attack, flowing into [ahisher] body with a spine-chilling screech, vanishing. ", parse);
		if (Status.Siphon(attacker, {turns: 1, turnsR: 2, hp: 25, sp: 5, caster})) {
			Text.Add("[aName] stagger[anotS], the remnant of the revenant draining the energy from [ahisher] body. [aName] [ahas] been afflicted with siphon!", parse);
		} else {
			Text.Add("[aName] shrug[anotS] off the phantom’s chill.", parse);
		}
		Text.Flush();
		return false;
	} });
	Text.NL();
});

const sIllusion = new Ability("S.Illusion");
sIllusion.Short = () => "Arouses your foes by creating a harem of alluring mirages.";
sIllusion.cost = { hp: undefined, sp: 10, lp: 25};
sIllusion.targetMode = TargetMode.Self;
sIllusion.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);
	let num = 2;
	num += Math.random() * 3;
	parse.num = Text.NumToText(num);

	Text.Add("Weaving [hisher] [hand]s in exotic patterns, [name] create[notS] [num] mesmerising and utterly lewd images which strut about invitingly; offering comfort and release with throaty groans and soft, alluring gasps.", parse);
	Status.Decoy(caster, { copies : num, func : (attacker: Entity) => {
		const decoy = caster.combatStatus.stats[StatusEffect.Decoy];
		const num = decoy.copies;
		decoy.copies--;
		if (decoy.copies <= 0) {
			caster.combatStatus.stats[StatusEffect.Decoy] = undefined;
		}
		const parse: any = {
			p : num > 1 ? "One of " + caster.possessive() : caster.Possessive(),
			s : num > 1 ? "s" : "",
			aposs   : attacker.possessive(),
			aName   : attacker.NameDesc(),
			ahimher : attacker.himher(),
			ahisher : attacker.hisher(),
			ahas    : attacker.has(),
			anotS   : attacker.plural() ? "" : "s",
		};
		Text.Add("[p] titillating apparition[s] quickly moves in the way of [aposs] attack, flowing into [ahimher] with an orgasmic cry. ", parse);
		if (Status.Horny(attacker, { hit : 0.75, turns : 1, turnsR : 2, str : 1, dmg : 0.2 })) {
			Text.Add("[aName] stagger[anotS], flustered with visions of obscene acts. [aName] [ahas] been afflicted with horny!", parse);
		} else {
			Text.Add("[aName] resist[anotS], reigning in [ahisher] urges.", parse);
		}
		Text.Flush();
		return false;
	} });
	Text.NL();
});

const confuse = new Ability("Confuse");
confuse.Short = () => "Fuck a single opponent’s mind, temporarily drawing them to your side.";
confuse.cost = { hp: undefined, sp: 30, lp: 20};
confuse.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);

	Text.Add("[Name] perform[notS] a hypnotising dance, blending in [hisher] alluring magic and attempting to assume control of [tname]. ", parse);

	if (Status.Confuse(target, {hit: 0.75, turns: 3, turnsR: 3})) {
		Text.Add("[tName] [tis] unable to resist [poss] power, and utterly falls under [hisher] control.", parse);
	} else {
		Text.Add("[tName] manage[tnotS] to compose [thimher]self, resisting [poss] unnatural influence.", parse);
	}
	Text.NL();
});

const rut = new Ability("Rut");
rut.Short = () => "Hump away at target, dealing damage.";
rut.cost = { hp: undefined, sp: undefined, lp: 10};
rut.castTree.push(AbilityNode.Template.Lust({
	damageFunc: AbilityNode.DamageFunc.Physical,
	damagePool: [AbilityNode.DamagePool.Physical],
	damageType: {pBlunt: 0.2, lust: 0.8},
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		target.AddLustAbs(-dmg * 0.25);
	}, (ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] rut[notS] against [tname] for " + Text.Damage(-dmg) + " damage! Sexy!", parse);
		Text.NL();
	}],
}));

// TODO Tweak
const fantasize = new Ability("Fantasize");
fantasize.Short = () => "Raise own lust.";
fantasize.targetMode = TargetMode.Self;
fantasize.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
	let dmg = 1 * caster.LAttack();
	dmg = Math.floor(dmg);

	caster.AddLustAbs(dmg);

	const parse: any = {
		name : caster.NameDesc(),
	};

	// TODO: Make more flavor text
	Text.Add("[name] fantasizes, building " + Text.Lust(dmg) + " lust! Sexy!", parse);
	Text.NL();
});

const soothe = new Ability("Soothe");
soothe.cost = { hp: undefined, sp: 20, lp: undefined};
soothe.Short = () => "Calm the wayward thoughts of your allies with the gentle touch of your voice.";
soothe.targetMode = TargetMode.Party;
soothe.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Party) => {
	const targets = target.members;

	const group = targets.length > 1;
	const parse: any = {
		Poss: caster.Possessive(),
		their: group ? "their" : caster.hisher(),
		himher: group ? caster.hisher() + " party" : caster.himher(),
	};
	Text.Add("[Poss] gentle voice washes over [himher], calming [their] desires.", parse);

	_.each(targets, (e) => {
		if (e.Incapacitated()) { return; }

		const mult = 1 + (Math.random() - 0.5) * 0.2;
		const soothe = Math.floor(caster.Spi() * 3 * mult);

		e.AddLustAbs(-soothe);

		const parse = AbilityNode.DefaultParser(undefined, e);
		Text.NL();
		Text.Add("The music washes over [tposs] mind, leaving [thimher] feeling clean and pristine. [tName] lose[tnotS] " + Text.Soothe(soothe) + " lust!", parse);
	});
	Text.NL();
});

const captivate = new Ability("Captivate");
captivate.cost = { hp: undefined, sp: undefined, lp: 40};
captivate.Short = () => "Attempt to immobilize and slow a foe with a captivating song. Success rate dependent on your charisma and the target’s lust. If it fails, the target is nevertheless slowed.";
const captivateOnMiss = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] manage[tnotS] to resist the brunt of the mesmerizing melody, but still finds [thisher] movements slowed.", parse);
	Text.NL();
};
captivate.castTree.push(AbilityNode.Template.Lust({
	toDamage: undefined,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Fixing [tname] with a piercing gaze, [name] begin[notS] singing, [hisher] song’s captivating undertones ringing through the air. ", parse);
		Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 });
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		if (Status.Numb(target, { hit : 0.8, turns : 2, proc : 1 })) {
			const parse = AbilityNode.DefaultParser(caster, target);
			Text.Add("[tName] is utterly entranced by [poss] song and is slowed to a stop, completely immobilized.", parse);
			Text.NL();
		} else {
			captivateOnMiss(ability, encounter, caster, target);
		}
	}],
	onMiss: [captivateOnMiss],
}));

// TODO Tweak
const lull = new Ability("Lull");
lull.cost = { hp: undefined, sp: 10, lp: 10};
lull.Short = () => "Put the foe to sleep with a soothing song.";
lull.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	/*
	let hit    = caster.LHit();
	let evade  = target.LEvade();
	let toHit  = Ability.ToHit(hit, evade);
	*/
	const parse = AbilityNode.DefaultParser(caster, target);

	Text.Add("[Name] raise[notS] [hisher] voice in a soothing song, lulling [tname] with the haunting tune. ", parse);

	if (Status.Sleep(target, { hit : 0.8, turns : 3, turnsR : 3 })) {
		Text.Add("Overcome by [poss] song, [tname] falls asleep.", parse);
	} else {
		Text.Add("[tName] shrug[ts] it off, managing to stay awake.", parse);
	}
	Text.NL();
});

/*
 *
 * Basic tease
 *
 */

const tease = new Ability("Tease");
tease.Short = () => "Raises the lust of target.";
tease.castTree.push(AbilityNode.Template.Lust({
	atkMod: 0.5,
	damageType: {lust: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.hips = caster.HipsDesc();
		Text.Add("[Name] tease[notS] [tname], shaking [hisher] [hips]! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Seduction._onMiss],
	onDamage: [Defaults.Seduction._onDamage],
	onAbsorb: [Defaults.Seduction._onAbsorb],
}));

const seduce = new Ability("Seduce");
seduce.Short = () => "Raises the lust of target.";
seduce.cost = { hp: undefined, sp: 10, lp: 10};
seduce.castTree.push(AbilityNode.Template.Lust({
	atkMod: 1,
	damageType: {lust: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.hips = caster.HipsDesc();
		Text.Add("[Name] tease[notS] [tname], shaking [hisher] [hips]! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Seduction._onMiss],
	onDamage: [Defaults.Seduction._onDamage],
	onAbsorb: [Defaults.Seduction._onAbsorb],
}));

const stripTease = new Ability("StripTease");
stripTease.Short = () => "Raises the lust of enemy party.";
stripTease.cost = { hp: undefined, sp: 40, lp: 40};
stripTease.cooldown = 2;
stripTease.targetMode = TargetMode.Enemies;
stripTease.castTree.push(AbilityNode.Template.Lust({
	atkMod: 1.5,
	damageType: {lust: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		parse.hips = caster.HipsDesc();
		Text.Add("[Name] tease[notS] the enemy party, shaking [hisher] [hips]! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Seduction._onMiss],
	onDamage: [Defaults.Seduction._onDamage],
	onAbsorb: [Defaults.Seduction._onAbsorb],
}));

const distract = new Ability("Distract");
distract.Short = () => "Raise enemy lust and lower their initiative.";
distract.cost = { hp: undefined, sp: 10, lp: 20};
distract.cooldown = 1;
distract.castTree.push(AbilityNode.Template.Lust({
	atkMod: 0.8,
	damageType: {lust: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.hips = caster.HipsDesc();
		Text.Add("[Name] distract[notS] [tname], shaking [hisher] [hips]! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Seduction._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		target.GetCombatEntry(encounter).initiative -= 25;
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] become[tnotS] aroused, gaining " + Text.Lust(-dmg) + " lust! [tHeShe] become[tnotS] distracted.", parse);
		Text.NL();
	}],
	onAbsorb: [Defaults.Seduction._onAbsorb],
}));

const charm = new Ability("Charm");
charm.Short = () => "Try to dissuade the enemy from attacking you.";
charm.cost = { hp: undefined, sp: 10, lp: 10};
charm.cooldown = 1;
charm.castTree.push(AbilityNode.Template.Lust({
	atkMod: 0.3,
	damageType: {lust: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.hips = caster.HipsDesc();
		Text.Add("[Name] charm[notS] [tname], shaking [hisher] [hips]! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Seduction._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const aggroEntry = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if (aggroEntry) {
			aggroEntry.aggro -= 0.4;
			if (aggroEntry.aggro < 0) { aggroEntry.aggro = 0; }
		}
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] become[tnotS] charmed, gaining " + Text.Lust(-dmg) + " lust! [tHeShe] become[tnotS] less aggressive toward [name].", parse);
		Text.NL();
	}],
	onAbsorb: [Defaults.Seduction._onAbsorb],
}));

const allure = new Ability("Allure");
allure.Short = () => "Try to dissuade the enemy from attacking you.";
allure.cost = { hp: undefined, sp: 30, lp: 60};
allure.cooldown = 2;
allure.castTree.push(AbilityNode.Template.Lust({
	damageType: {lust: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.hips = caster.HipsDesc();
		Text.Add("[Name] charm[notS] [tname], shaking [hisher] [hips]! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Seduction._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const aggroEntry = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if (aggroEntry) {
			aggroEntry.aggro -= 0.8;
			if (aggroEntry.aggro < 0) { aggroEntry.aggro = 0; }
		}
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] become[tnotS] charmed, gaining " + Text.Lust(-dmg) + " lust! [tHeShe] become[tnotS] less aggressive toward [name].", parse);
		Text.NL();
	}],
	onAbsorb: [Defaults.Seduction._onAbsorb],
}));

const inflame = new Ability("Inflame");
inflame.Short = () => "Greatly arouse the passions of a single foe with the power of song.";
inflame.cost = { hp: undefined, sp: undefined, lp: 25};
inflame.castTree.push(AbilityNode.Template.Lust({
	atkMod: 2,
	damageType: {lust: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] slowly sing[notS] a few verses of a soft, sensual melody, projecting [hisher] rich voice at [tname]. ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Seduction._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] squirm[tnotS] at the subtle undertones of the song, becoming greatly aroused. [tName] gain[tnotS] " + Text.Lust(-dmg) + " lust!", parse);
		Text.NL();
	}],
	onAbsorb: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] manage[tnotS] to shake off the desire-inducing effects of [poss] voice.", parse);
		Text.NL();
	}],
}));

export namespace SeductionAb {
	export const Sleep = sleep;
	export const TIllusion = tIllusion;
	export const SIllusion = sIllusion;
	export const Confuse = confuse;
	export const Rut = rut;
	export const Fantasize = fantasize;
	export const Soothe = soothe;
	export const Captivate = captivate;
	export const Lull = lull;
	export const Tease = tease;
	export const Seduce = seduce;
	export const StripTease = stripTease;
	export const Distract = distract;
	export const Charm = charm;
	export const Allure = allure;
	export const Inflame = inflame;
}
