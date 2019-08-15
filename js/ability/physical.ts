/*
 *
 * Physical attacks
 *
 */
import { Ability, TargetMode } from "../ability";
import { Encounter } from "../combat";
import { Entity } from "../entity";
import { Status } from "../statuseffect";
import { Text } from "../text";
import { Defaults, GetAggroEntry } from "./default";
import { AbilityNode } from "./node";

const PhysicalAb: any = {};

PhysicalAb.Bash = new Ability("Bash");
PhysicalAb.Bash.Short = () => "Stun effect, low accuracy.";
PhysicalAb.Bash.cost = { hp: null, sp: 10, lp: null};
PhysicalAb.Bash.cooldown = 2;
PhysicalAb.Bash.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.1,
	hitMod: 0.9,
	damageType: {pBlunt: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a powerful blow, aiming to stun [tname]! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		if (Math.random() < 0.5) {
			const entry = target.GetCombatEntry(encounter);
			if (entry) {
				entry.initiative -= 50;
			}
		}

		const parse = AbilityNode.DefaultParser(caster, target);

		Text.Add("[Name] bash[notEs] [tname] for " + Text.Damage(-dmg) + " damage, staggering [thimher]!", parse);
		Text.NL();
	}, AbilityNode.Template.Cancel()],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

PhysicalAb.GrandSlam = new Ability("Grand Slam");
PhysicalAb.GrandSlam.Short = () => "Stun effect, low accuracy to multiple targets.";
PhysicalAb.GrandSlam.cost = { hp: null, sp: 50, lp: null};
PhysicalAb.GrandSlam.targetMode = TargetMode.Enemies;
PhysicalAb.GrandSlam.cooldown = 3;
PhysicalAb.GrandSlam.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.1,
	hitMod: 0.8,
	damageType: {pBlunt: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] read[y] a powerful blow, aiming to stun any who stand in [hisher] way! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		if (Math.random() < 0.5) {
			const entry = target.GetCombatEntry(encounter);
			if (entry) {
				entry.initiative -= 50;
			}
		}

		const parse = AbilityNode.DefaultParser(caster, target);

		Text.Add("[Name] slam[notS] [tname] for " + Text.Damage(-dmg) + " damage, staggering [thimher]!", parse);
		Text.NL();
	}, AbilityNode.Template.Cancel()],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

PhysicalAb.Pierce = new Ability("Pierce");
PhysicalAb.Pierce.Short = () => "Bypass defenses.";
PhysicalAb.Pierce.cost = { hp: null, sp: 10, lp: null};
PhysicalAb.Pierce.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.5,
	damageType: {pPierce: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] aim[notS] [hisher] strike on a weak point in [tposs] guard! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

PhysicalAb.DirtyBlow = new Ability("Dirty Blow");
PhysicalAb.DirtyBlow.Short = () => "Bypass defenses, low chance of stun.";
PhysicalAb.DirtyBlow.cost = { hp: null, sp: 20, lp: null};
PhysicalAb.DirtyBlow.cooldown = 2;
PhysicalAb.DirtyBlow.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.3,
	damageType: {pPierce: 1.1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a low blow, striking a weak point in [tposs] guard! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Numb(target, { hit : 0.2, turns : 3, turnsR : 3, proc : 0.25 })) {
			Text.Add("[tName] [thas] been afflicted with numb!", parse);
			Text.NL();
		}
	}],
}));

PhysicalAb.Hamstring = new Ability("Hamstring");
PhysicalAb.Hamstring.Short = () => "Nicks the target, making a lingering wound.";
PhysicalAb.Hamstring.cost = { hp: null, sp: 20, lp: null};
PhysicalAb.Hamstring.cooldown = 2;
PhysicalAb.Hamstring.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.5,
	damageType: {pPierce: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] tr[y] to hit [tname] with a light attack, aiming to wound! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Bleed(target, { hit : 0.75, turns : 3, turnsR : 3, dmg : 0.15 })) {
			Text.Add("[tName] [thas] been afflicted with bleed! ", parse);
			Text.NL();
		}
	}],
}));

PhysicalAb.Kicksand = new Ability("Kick sand");
PhysicalAb.Kicksand.Short = () => "Kick dirt in the enemy's eyes, blinding them. Single target.";
PhysicalAb.Kicksand.cost = { hp: null, sp: 15, lp: null};
PhysicalAb.Kicksand.cooldown = 1;
PhysicalAb.Kicksand.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.05,
	damageType: {pPierce: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] kick[notS] some dirt toward [tname]! ", parse);
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] easily avoid[tnotS] the attack.", parse);
	}],
	onDamage: [Defaults.Physical._onDamage],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Blind(target, { hit : 0.8, str : 0.5, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] get[tnotS] a face-full of dirt, blinding [thimher]!", parse);
		}
	}],
}));

PhysicalAb.Swift = new Ability("Swift");
PhysicalAb.Swift.Short = () => "Briefly boosts the caster's speed.";
PhysicalAb.Swift.targetMode = TargetMode.Self;
PhysicalAb.Swift.cost = { hp: null, sp: 25, lp: null};
PhysicalAb.Swift.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);

	Status.Haste(caster, { turns : 3, turnsR : 3, factor : 2 });

	Text.Add("[Name] focus[notEs], briefly boosting [hisher] speed!", parse);
});

PhysicalAb.SetTrap = new Ability("Set trap");
PhysicalAb.SetTrap.Short = () => "Sets a trap for an enemy.";
PhysicalAb.SetTrap.targetMode = TargetMode.Self;
PhysicalAb.SetTrap.cost = { hp: null, sp: 50, lp: null};
PhysicalAb.SetTrap.castTime = 100;
PhysicalAb.SetTrap.cooldown = 3;
PhysicalAb.SetTrap.onCast = [(ability: Ability, encounter: Encounter, caster: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);
	Text.Add("[Name] begin[notS] to set a trap!", parse);
}];
PhysicalAb.SetTrap.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);
	Text.Add("[Name] set[notS] a trap!", parse);

	// Reduce everyones aggro toward trapper
	for (const activeChar of encounter.combatOrder) {
		const aggroEntry: any = GetAggroEntry(activeChar, caster);
		if (aggroEntry) {
			aggroEntry.aggro /= 2;
		}
	}

	Status.Counter(caster, { turns : 999, hits : 1, OnHit(enc: Encounter, caster: Entity, attacker: Entity, dmg: number) {
			PhysicalAb.SpringTrap.Use(encounter, caster, attacker);
			return false;
		},
	});
});
PhysicalAb.SpringTrap = new Ability("Spring trap");
PhysicalAb.SpringTrap.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.3,
	atkMod: 1.3,
	hitMod: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] spring[tnotS] [poss] trap! ", parse);
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tHeShe] narrowly avoid[tnotS] taking damage! ", parse);
	}],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

PhysicalAb.Backstab = new Ability("Backstab");
PhysicalAb.Backstab.Short = () => "Deal high damage against a disabled target.";
PhysicalAb.Backstab.cost = { hp: null, sp: 30, lp: null};
PhysicalAb.Backstab.cooldown = 1;
PhysicalAb.Backstab.castTree.push(AbilityNode.Template.Physical({
	atkMod: 2,
	defMod: 0.75,
	hitMod: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] dance[notS] around [tname], dealing a crippling backstab! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));
PhysicalAb.Backstab.enabledTargetCondition = (encounter: Encounter, caster: Entity, target: Entity) => {
	return target.Inhibited();
};

PhysicalAb.Ensnare = new Ability("Ensnare");
PhysicalAb.Ensnare.Short = () => "Slows down an enemy by throwing a net at them.";
PhysicalAb.Ensnare.cost = { hp: null, sp: 20, lp: null};
PhysicalAb.Ensnare.cooldown = 3;
PhysicalAb.Ensnare.castTree.push(AbilityNode.Template.Physical({
	toDamage: null,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a net toward [tname]! ", parse);
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] get[tnotS] caught in the net, slowing [thimher]!", parse);
		}
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] easily avoid[tnotS] the attack.", parse);
	}],
}));

PhysicalAb.FocusStrike = new Ability("Focus strike");
PhysicalAb.FocusStrike.Short = () => "Bypass defenses.";
PhysicalAb.FocusStrike.cost = { hp: null, sp: 50, lp: null};
PhysicalAb.FocusStrike.cooldown = 2;
PhysicalAb.FocusStrike.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.2,
	damageType: {pPierce: 1.5},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] aim[notS] [hisher] strike on a weak point in [tposs] guard! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

PhysicalAb.DAttack = new Ability("D.Attack");
PhysicalAb.DAttack.Short = () => "Perform two low accuracy hits.";
PhysicalAb.DAttack.cost = { hp: null, sp: 25, lp: null};
PhysicalAb.DAttack.cooldown = 2;
PhysicalAb.DAttack.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.75,
	nrAttacks: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] two attacks against [tname] in rapid succession! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

PhysicalAb.TAttack = new Ability("T.Attack");
PhysicalAb.TAttack.Short = () => "Perform three low accuracy hits.";
PhysicalAb.TAttack.cost = { hp: null, sp: 60, lp: null};
PhysicalAb.TAttack.cooldown = 3;
PhysicalAb.TAttack.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.75,
	nrAttacks: 3,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] three attacks against [tname] in rapid succession! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

PhysicalAb.QAttack = new Ability("Q.Attack");
PhysicalAb.QAttack.Short = () => "Perform four low accuracy hits.";
PhysicalAb.QAttack.cost = { hp: null, sp: 100, lp: null};
PhysicalAb.QAttack.cooldown = 4;
PhysicalAb.QAttack.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.75,
	nrAttacks: 4,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] four attacks against [tname] in rapid succession! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

PhysicalAb.Frenzy = new Ability("Frenzy");
PhysicalAb.Frenzy.Short = () => "Perform a flurry of five strikes, leaving you exhausted.";
PhysicalAb.Frenzy.cost = { hp: 100, sp: 80, lp: null};
PhysicalAb.Frenzy.cooldown = 5;
PhysicalAb.Frenzy.castTime = 100;
PhysicalAb.Frenzy.onCast.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] [is] riling [himher]self up, preparing to launch an onslaught of blows on [tname]! ", parse);
});
PhysicalAb.Frenzy.castTree.push(AbilityNode.Template.Physical({
	nrAttacks: 5,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const entry = caster.GetCombatEntry(encounter);
		if (entry) { entry.initiative -= 50; }
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] a frenzied assault, attacking [tname] with five rapid blows!", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

PhysicalAb.CrushingStrike = new Ability("Crushing.S");
PhysicalAb.CrushingStrike.Short = () => "Crushing strike that deals massive damage, with high chance of stunning. Slight recoil effect.";
PhysicalAb.CrushingStrike.cost = { hp: 25, sp: 10, lp: null};
PhysicalAb.CrushingStrike.cooldown = 2;
PhysicalAb.CrushingStrike.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.5,
	hitMod: 0.9,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] a wild assault against [tname]! ", parse);
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] deliver[notS] a crushing blow to [tname] for " + Text.Damage(-dmg) + " damage, staggering [thimher]!", parse);
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		if (Math.random() < 0.8) {
			const entry = target.GetCombatEntry(encounter);
			if (entry) { entry.initiative -= 75; }
		}
	}],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

PhysicalAb.Provoke = new Ability("Provoke");
PhysicalAb.Provoke.Short = () => "Try to provoke the enemy to focus on you. Single target.";
PhysicalAb.Provoke.cost = { hp: null, sp: 15, lp: null};
PhysicalAb.Provoke.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.1,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] taunt[notS] [tname]! ", parse);
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] doesn't look very impressed.", parse);
	}],
	onDamage: [Defaults.Physical._onDamage],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const aggroEntry: any = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if (aggroEntry) {
			aggroEntry.aggro += 1;
		}
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] become[tnotS] agitated, turning more aggressive toward [name]!", parse);
	}],
}));

PhysicalAb.Taunt = new Ability("Taunt");
PhysicalAb.Taunt.Short = () => "Try to taunt the enemy to focus on you. Single target.";
PhysicalAb.Taunt.cost = { hp: null, sp: 30, lp: null};
PhysicalAb.Taunt.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.5,
	hitMod: 1.1,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] taunt[notS] [tname]! ", parse);
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] doesn't look very impressed.", parse);
	}],
	onDamage: [Defaults.Physical._onDamage],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const aggroEntry: any = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if (aggroEntry) {
			aggroEntry.aggro += 3;
		}
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] become[tnotS] agitated, turning more aggressive toward [name]!", parse);
	}],
}));

PhysicalAb.Fade = new Ability("Fade");
PhysicalAb.Fade.Short = () => "Fade from the focus of the enemy.";
PhysicalAb.Fade.cooldown = 3;
PhysicalAb.Fade.targetMode = TargetMode.Enemies;
PhysicalAb.Fade.cost = { hp: null, sp: 50, lp: null};
PhysicalAb.Fade.castTree.push(AbilityNode.Template.Physical({
	toDamage: null,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] fade[notS] from notice.", parse);
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.NL();
		Text.Add("[tName] [tis] not very impressed.", parse);
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const aggroEntry: any = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if (aggroEntry) {
			aggroEntry.aggro /= 2;
		}
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.NL();
		Text.Add("[tName] become[tnotS] distracted, turning [thisher] attention away from [name]!", parse);
	}],
}));

export { PhysicalAb };
