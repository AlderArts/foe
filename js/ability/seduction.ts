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

const SeductionAb: any = {};

SeductionAb.Sleep = new Ability("Sleep");
SeductionAb.Sleep.Short = () => "Put one enemy to sleep for a short while with magical charms.";
SeductionAb.Sleep.cost = { hp: undefined, sp: 20, lp: undefined};
SeductionAb.Sleep.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);

	Text.Add("[Name] weave[notS] [hisher] [hand]s in alluring patterns, winking seductively at [tname]. ", parse);
	if (Status.Sleep(target, { hit : 0.6, turns : 2, turnsR : 2 })) {
		Text.Add("[tName] [tis] unable to resist looking at the hypnotic display, and fall[tnotS] into a slumber. [tName] [thas] been afflicted with sleep!", parse);
	} else {
		Text.Add("[tName] manage[notS] to shake off [poss] enchantment, resisting its drowsing effect.", parse);
	}
	Text.NL();
});

SeductionAb.TIllusion = new Ability("T.Illusion");
SeductionAb.TIllusion.Short = () => "Terrifies your foes by creating frightening phantasms that soak up any attacks directed at you.";
SeductionAb.TIllusion.cost = { hp: undefined, sp: 25, lp: 10};
SeductionAb.TIllusion.targetMode = TargetMode.Self;
SeductionAb.TIllusion.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
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

SeductionAb.SIllusion = new Ability("S.Illusion");
SeductionAb.SIllusion.Short = () => "Arouses your foes by creating a harem of alluring mirages.";
SeductionAb.SIllusion.cost = { hp: undefined, sp: 10, lp: 25};
SeductionAb.SIllusion.targetMode = TargetMode.Self;
SeductionAb.SIllusion.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
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

SeductionAb.Confuse = new Ability("Confuse");
SeductionAb.Confuse.Short = () => "Fuck a single opponent’s mind, temporarily drawing them to your side.";
SeductionAb.Confuse.cost = { hp: undefined, sp: 30, lp: 20};
SeductionAb.Confuse.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);

	Text.Add("[Name] perform[notS] a hypnotising dance, blending in [hisher] alluring magic and attempting to assume control of [tname]. ", parse);

	if (Status.Confuse(target, {hit: 0.75, turns: 3, turnsR: 3})) {
		Text.Add("[tName] [tis] unable to resist [poss] power, and utterly falls under [hisher] control.", parse);
	} else {
		Text.Add("[tName] manage[tnotS] to compose [thimher]self, resisting [poss] unnatural influence.", parse);
	}
	Text.NL();
});

SeductionAb.Rut = new Ability("Rut");
SeductionAb.Rut.Short = () => "Hump away at target, dealing damage.";
SeductionAb.Rut.cost = { hp: undefined, sp: undefined, lp: 10};
SeductionAb.Rut.castTree.push(AbilityNode.Template.Lust({
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
SeductionAb.Fantasize = new Ability("Fantasize");
SeductionAb.Fantasize.Short = () => "Raise own lust.";
SeductionAb.Fantasize.targetMode = TargetMode.Self;
SeductionAb.Fantasize.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
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

SeductionAb.Soothe = new Ability("Soothe");
SeductionAb.Soothe.cost = { hp: undefined, sp: 20, lp: undefined};
SeductionAb.Soothe.Short = () => "Calm the wayward thoughts of your allies with the gentle touch of your voice.";
SeductionAb.Soothe.targetMode = TargetMode.Party;
SeductionAb.Soothe.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Party) => {
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

SeductionAb.Captivate = new Ability("Captivate");
SeductionAb.Captivate.cost = { hp: undefined, sp: undefined, lp: 40};
SeductionAb.Captivate.Short = () => "Attempt to immobilize and slow a foe with a captivating song. Success rate dependent on your charisma and the target’s lust. If it fails, the target is nevertheless slowed.";
SeductionAb.Captivate._onMiss = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] manage[tnotS] to resist the brunt of the mesmerizing melody, but still finds [thisher] movements slowed.", parse);
	Text.NL();
};
SeductionAb.Captivate.castTree.push(AbilityNode.Template.Lust({
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
			SeductionAb.Captivate._onMiss(ability, encounter, caster, target);
		}
	}],
	onMiss: [SeductionAb.Captivate._onMiss],
}));

// TODO Tweak
SeductionAb.Lull = new Ability("Lull");
SeductionAb.Lull.cost = { hp: undefined, sp: 10, lp: 10};
SeductionAb.Lull.Short = () => "Put the foe to sleep with a soothing song.";
SeductionAb.Lull.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
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

SeductionAb.Tease = new Ability("Tease");
SeductionAb.Tease.Short = () => "Raises the lust of target.";
SeductionAb.Tease.castTree.push(AbilityNode.Template.Lust({
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

SeductionAb.Seduce = new Ability("Seduce");
SeductionAb.Seduce.Short = () => "Raises the lust of target.";
SeductionAb.Seduce.cost = { hp: undefined, sp: 10, lp: 10};
SeductionAb.Seduce.castTree.push(AbilityNode.Template.Lust({
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

SeductionAb.StripTease = new Ability("StripTease");
SeductionAb.StripTease.Short = () => "Raises the lust of enemy party.";
SeductionAb.StripTease.cost = { hp: undefined, sp: 40, lp: 40};
SeductionAb.StripTease.cooldown = 2;
SeductionAb.StripTease.targetMode = TargetMode.Enemies;
SeductionAb.StripTease.castTree.push(AbilityNode.Template.Lust({
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

SeductionAb.Distract = new Ability("Distract");
SeductionAb.Distract.Short = () => "Raise enemy lust and lower their initiative.";
SeductionAb.Distract.cost = { hp: undefined, sp: 10, lp: 20};
SeductionAb.Distract.cooldown = 1;
SeductionAb.Distract.castTree.push(AbilityNode.Template.Lust({
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

SeductionAb.Charm = new Ability("Charm");
SeductionAb.Charm.Short = () => "Try to dissuade the enemy from attacking you.";
SeductionAb.Charm.cost = { hp: undefined, sp: 10, lp: 10};
SeductionAb.Charm.cooldown = 1;
SeductionAb.Charm.castTree.push(AbilityNode.Template.Lust({
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
		const aggroEntry: any = GetAggroEntry(target.GetCombatEntry(encounter), caster);
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

SeductionAb.Allure = new Ability("Allure");
SeductionAb.Allure.Short = () => "Try to dissuade the enemy from attacking you.";
SeductionAb.Allure.cost = { hp: undefined, sp: 30, lp: 60};
SeductionAb.Allure.cooldown = 2;
SeductionAb.Allure.castTree.push(AbilityNode.Template.Lust({
	damageType: {lust: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.hips = caster.HipsDesc();
		Text.Add("[Name] charm[notS] [tname], shaking [hisher] [hips]! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Seduction._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const aggroEntry: any = GetAggroEntry(target.GetCombatEntry(encounter), caster);
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

SeductionAb.Inflame = new Ability("Inflame");
SeductionAb.Inflame.Short = () => "Greatly arouse the passions of a single foe with the power of song.";
SeductionAb.Inflame.cost = { hp: undefined, sp: undefined, lp: 25};
SeductionAb.Inflame.castTree.push(AbilityNode.Template.Lust({
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

export { SeductionAb };
