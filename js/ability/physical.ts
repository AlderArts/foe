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

const bash = new Ability("Bash");
bash.Short = () => "Stun effect, low accuracy.";
bash.cost = { hp: undefined, sp: 10, lp: undefined};
bash.cooldown = 2;
bash.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.1,
	hitMod: 0.9,
	damageType: {pBlunt: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a powerful blow, aiming to stun [tname]! ", parse);
		Text.NL();
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

const grandSlam = new Ability("Grand Slam");
grandSlam.Short = () => "Stun effect, low accuracy to multiple targets.";
grandSlam.cost = { hp: undefined, sp: 50, lp: undefined};
grandSlam.targetMode = TargetMode.Enemies;
grandSlam.cooldown = 3;
grandSlam.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.1,
	hitMod: 0.8,
	damageType: {pBlunt: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] read[y] a powerful blow, aiming to stun any who stand in [hisher] way! ", parse);
		Text.NL();
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

const pierce = new Ability("Pierce");
pierce.Short = () => "Bypass defenses.";
pierce.cost = { hp: undefined, sp: 10, lp: undefined};
pierce.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.5,
	damageType: {pPierce: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] aim[notS] [hisher] strike on a weak point in [tposs] guard! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const dirtyBlow = new Ability("Dirty Blow");
dirtyBlow.Short = () => "Bypass defenses, low chance of stun.";
dirtyBlow.cost = { hp: undefined, sp: 20, lp: undefined};
dirtyBlow.cooldown = 2;
dirtyBlow.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.3,
	damageType: {pPierce: 1.1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a low blow, striking a weak point in [tposs] guard! ", parse);
		Text.NL();
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

const hamstring = new Ability("Hamstring");
hamstring.Short = () => "Nicks the target, making a lingering wound.";
hamstring.cost = { hp: undefined, sp: 20, lp: undefined};
hamstring.cooldown = 2;
hamstring.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.5,
	damageType: {pPierce: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] tr[y] to hit [tname] with a light attack, aiming to wound! ", parse);
		Text.NL();
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

const kicksand = new Ability("Kick sand");
kicksand.Short = () => "Kick dirt in the enemy's eyes, blinding them. Single target.";
kicksand.cost = { hp: undefined, sp: 15, lp: undefined};
kicksand.cooldown = 1;
kicksand.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.05,
	damageType: {pPierce: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] kick[notS] some dirt toward [tname]! ", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] easily avoid[tnotS] the attack.", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Physical._onDamage],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Blind(target, { hit : 0.8, str : 0.5, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] get[tnotS] a face-full of dirt, blinding [thimher]!", parse);
			Text.NL();
		}
	}],
}));

const swift = new Ability("Swift");
swift.Short = () => "Briefly boosts the caster's speed.";
swift.targetMode = TargetMode.Self;
swift.cost = { hp: undefined, sp: 25, lp: undefined};
swift.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);

	Status.Haste(caster, { turns : 3, turnsR : 3, factor : 2 });

	Text.Add("[Name] focus[notEs], briefly boosting [hisher] speed!", parse);
	Text.NL();
});

const setTrap = new Ability("Set trap");
setTrap.Short = () => "Sets a trap for an enemy.";
setTrap.targetMode = TargetMode.Self;
setTrap.cost = { hp: undefined, sp: 50, lp: undefined};
setTrap.castTime = 100;
setTrap.cooldown = 3;
setTrap.onCast = [(ability: Ability, encounter: Encounter, caster: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);
	Text.Add("[Name] begin[notS] to set a trap!", parse);
	Text.NL();
}];
setTrap.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);
	Text.Add("[Name] set[notS] a trap!", parse);

	// Reduce everyones aggro toward trapper
	for (const activeChar of encounter.combatOrder) {
		const aggroEntry = GetAggroEntry(activeChar, caster);
		if (aggroEntry) {
			aggroEntry.aggro /= 2;
		}
	}

	Status.Counter(caster, { turns : 999, hits : 1, OnHit(enc: Encounter, caster2: Entity, attacker: Entity, dmg: number) {
			PhysicalAb.SpringTrap.Use(encounter, caster2, attacker);
			return false;
		},
	});
	Text.NL();
});
const springTrap = new Ability("Spring trap");
springTrap.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.3,
	atkMod: 1.3,
	hitMod: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] spring[tnotS] [poss] trap! ", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tHeShe] narrowly avoid[tnotS] taking damage! ", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const backstab = new Ability("Backstab");
backstab.Short = () => "Deal high damage against a disabled target.";
backstab.cost = { hp: undefined, sp: 30, lp: undefined};
backstab.cooldown = 1;
backstab.castTree.push(AbilityNode.Template.Physical({
	atkMod: 2,
	defMod: 0.75,
	hitMod: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] dance[notS] around [tname], dealing a crippling backstab! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));
backstab.enabledTargetCondition = (encounter: Encounter, caster: Entity, target: Entity) => {
	return target.Inhibited();
};

const ensnare = new Ability("Ensnare");
ensnare.Short = () => "Slows down an enemy by throwing a net at them.";
ensnare.cost = { hp: undefined, sp: 20, lp: undefined};
ensnare.cooldown = 3;
ensnare.castTree.push(AbilityNode.Template.Physical({
	toDamage: undefined,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a net toward [tname]! ", parse);
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] get[tnotS] caught in the net, slowing [thimher]!", parse);
			Text.NL();
		}
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] easily avoid[tnotS] the attack.", parse);
		Text.NL();
	}],
}));

const focusStrike = new Ability("Focus strike");
focusStrike.Short = () => "Bypass defenses.";
focusStrike.cost = { hp: undefined, sp: 50, lp: undefined};
focusStrike.cooldown = 2;
focusStrike.castTree.push(AbilityNode.Template.Physical({
	defMod: 0.2,
	damageType: {pPierce: 1.5},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] aim[notS] [hisher] strike on a weak point in [tposs] guard! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const dAttack = new Ability("D.Attack");
dAttack.Short = () => "Perform two low accuracy hits.";
dAttack.cost = { hp: undefined, sp: 25, lp: undefined};
dAttack.cooldown = 2;
dAttack.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.75,
	nrAttacks: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] two attacks against [tname] in rapid succession! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const tAttack = new Ability("T.Attack");
tAttack.Short = () => "Perform three low accuracy hits.";
tAttack.cost = { hp: undefined, sp: 60, lp: undefined};
tAttack.cooldown = 3;
tAttack.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.75,
	nrAttacks: 3,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] three attacks against [tname] in rapid succession! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const qAttack = new Ability("Q.Attack");
qAttack.Short = () => "Perform four low accuracy hits.";
qAttack.cost = { hp: undefined, sp: 100, lp: undefined};
qAttack.cooldown = 4;
qAttack.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.75,
	nrAttacks: 4,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] four attacks against [tname] in rapid succession! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const frenzy = new Ability("Frenzy");
frenzy.Short = () => "Perform a flurry of five strikes, leaving you exhausted.";
frenzy.cost = { hp: 100, sp: 80, lp: undefined};
frenzy.cooldown = 5;
frenzy.castTime = 100;
frenzy.onCast.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] [is] riling [himher]self up, preparing to launch an onslaught of blows on [tname]! ", parse);
	Text.NL();
});
frenzy.castTree.push(AbilityNode.Template.Physical({
	nrAttacks: 5,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const entry = caster.GetCombatEntry(encounter);
		if (entry) { entry.initiative -= 50; }
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] a frenzied assault, attacking [tname] with five rapid blows!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const crushingStrike = new Ability("Crushing.S");
crushingStrike.Short = () => "Crushing strike that deals massive damage, with high chance of stunning. Slight recoil effect.";
crushingStrike.cost = { hp: 25, sp: 10, lp: undefined};
crushingStrike.cooldown = 2;
crushingStrike.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.5,
	hitMod: 0.9,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] perform[notS] a wild assault against [tname]! ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] deliver[notS] a crushing blow to [tname] for " + Text.Damage(-dmg) + " damage, staggering [thimher]!", parse);
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		if (Math.random() < 0.8) {
			const entry = target.GetCombatEntry(encounter);
			if (entry) { entry.initiative -= 75; }
		}
	}],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const provoke = new Ability("Provoke");
provoke.Short = () => "Try to provoke the enemy to focus on you. Single target.";
provoke.cost = { hp: undefined, sp: 15, lp: undefined};
provoke.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.1,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] taunt[notS] [tname]! ", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] doesn't look very impressed.", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Physical._onDamage],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const aggroEntry = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if (aggroEntry) {
			aggroEntry.aggro += 1;
		}
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] become[tnotS] agitated, turning more aggressive toward [name]!", parse);
		Text.NL();
	}],
}));

const taunt = new Ability("Taunt");
taunt.Short = () => "Try to taunt the enemy to focus on you. Single target.";
taunt.cost = { hp: undefined, sp: 30, lp: undefined};
taunt.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.5,
	hitMod: 1.1,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] taunt[notS] [tname]! ", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] doesn't look very impressed.", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Physical._onDamage],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const aggroEntry = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if (aggroEntry) {
			aggroEntry.aggro += 3;
		}
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] become[tnotS] agitated, turning more aggressive toward [name]!", parse);
		Text.NL();
	}],
}));

const fade = new Ability("Fade");
fade.Short = () => "Fade from the focus of the enemy.";
fade.cooldown = 3;
fade.targetMode = TargetMode.Enemies;
fade.cost = { hp: undefined, sp: 50, lp: undefined};
fade.castTree.push(AbilityNode.Template.Physical({
	toDamage: undefined,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] fade[notS] from notice.", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] [tis] not very impressed.", parse);
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const aggroEntry = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if (aggroEntry) {
			aggroEntry.aggro /= 2;
		}
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] become[tnotS] distracted, turning [thisher] attention away from [name]!", parse);
		Text.NL();
	}],
}));

export namespace PhysicalAb {
	export const Bash = bash;
	export const GrandSlam = grandSlam;
	export const Pierce = pierce;
	export const DirtyBlow = dirtyBlow;
	export const Hamstring = hamstring;
	export const Kicksand = kicksand;
	export const Swift = swift;
	export const SetTrap = setTrap;
	export const SpringTrap = springTrap;
	export const Backstab = backstab;
	export const Ensnare = ensnare;
	export const FocusStrike = focusStrike;
	export const DAttack = dAttack;
	export const TAttack = tAttack;
	export const QAttack = qAttack;
	export const Frenzy = frenzy;
	export const CrushingStrike = crushingStrike;
	export const Provoke = provoke;
	export const Taunt = taunt;
	export const Fade = fade;
}
