/*
 *
 * Attack magic
 *
 */
import { Ability, TargetMode } from "../ability";
import { Encounter } from "../combat";
import { Entity } from "../entity";
import { Status } from "../statuseffect";
import { Text } from "../text";
import { Defaults } from "./default";
import { AbilityNode } from "./node";

const surge = new Ability("Surge");
surge.Short = () => "Weak non-elemental magic, single target.";
surge.cost = { hp: undefined, sp: 5, lp: undefined};
surge.castTree.push(AbilityNode.Template.Magical({
	damageType: {mVoid: 1},
	onAbsorb: [Defaults.Black._onAbsorb],
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] call[notS] on a surge of pure magical energy which bursts forth in a flash of light from [hisher] outstretched [hand]s.", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Black._onDamage],
	onMiss: [Defaults.Black._onMiss],
}));

const fireball = new Ability("Fireball");
fireball.Short = () => "Fire magic, single target.";
fireball.cost = { hp: undefined, sp: 10, lp: undefined};
fireball.castTime = 75;
fireball.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2,
	damageType: {mFire: 1},
	onAbsorb: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the flames, gaining " + Text.Heal(dmg) + " health!", parse);
		Text.NL();
	}],
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] make[notS] mystic incantations, waving [hisher] [hand]s in the air. Fiery glyphs appear in front of [himher], coalescing in a large fireball forming between [hisher] outstretched [hand]s. With a great roar, the molten ball of magic surges toward [tname]!", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Black._onDamage],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Burn(target, { hit : 0.2, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
			Text.Add("[tName] [thas] been burned!", parse);
			Text.NL();
		}
	}],
	onMiss: [Defaults.Black._onMiss],
}));

const freeze = new Ability("Freeze");
freeze.Short = () => "Ice magic, single target.";
freeze.cost = { hp: undefined, sp: 10, lp: undefined};
freeze.castTime = 70;
freeze.castTree.push(AbilityNode.Template.Magical({
	atkMod: 1.9,
	damageType: {mIce: 1},
	onAbsorb: [Defaults.Black._onAbsorb],
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The temperature drops in the air around [tname] as [name] call[notS] on the power of ice. There is a loud crackle as the cold snap hits, forming icicles on [tname]!", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Black._onDamage],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Freeze(target, { hit : 0.2, turns : 3, turnsR : 5, proc : 0.5, str : 1.2 })) {
			Text.Add("[tName] [thas] been afflicted with freeze!", parse);
			Text.NL();
		}
	}],
	onMiss: [Defaults.Black._onMiss],
}));

const bolt = new Ability("Bolt");
bolt.Short = () => "Thunder magic, single target.";
bolt.cost = { hp: undefined, sp: 10, lp: undefined};
bolt.castTime = 60;
bolt.castTree.push(AbilityNode.Template.Magical({
	atkMod: 1.8,
	damageType: {mThunder: 1},
	onAbsorb: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.Heal(dmg) + " health!", parse);
		Text.NL();
	}],
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. There is a great crackle and a blinding flash of light as a bolt of lightning strikes [tname]!", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Black._onDamage],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Numb(target, { hit : 0.2, turns : 3, turnsR : 5, proc : 0.25 })) {
			Text.Add("[tName] [thas] been afflicted with numb!", parse);
			Text.NL();
		}
	}],
	onMiss: [Defaults.Black._onMiss],
}));

const gust = new Ability("Gust");
gust.Short = () => "Slashing wind magic, single target.";
gust.cost = { hp: undefined, sp: 10, lp: undefined};
gust.castTime = 50;
gust.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWind: 0.7, pSlash: 0.3},
	atkMod: 1.5,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] make[notS] a sweeping gesture, calling on the power of wind to do [hisher] bidding. Erratic gusts of wind dance around, focusing into a single burst homing in on [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const spire = new Ability("Spire");
spire.Short = () => "Bashing earth magic, single target.";
spire.cost = { hp: undefined, sp: 10, lp: undefined};
spire.castTime = 70;
spire.castTree.push(AbilityNode.Template.Magical({
	damageType: {mEarth: 0.7, pBlunt: 0.3},
	atkMod: 1.9,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("There is a loud rumble as the ground shakes, forced from its natural state by the power of [poss] magic. A pillar of rock bursts from the earth below, slamming into [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage, AbilityNode.Template.Cancel()],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const spray = new Ability("Spray");
spray.Short = () => "Water magic, single target.";
spray.cost = { hp: undefined, sp: 10, lp: undefined};
spray.castTime = 50;
spray.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWater: 1},
	atkMod: 1.9,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Moisture from the air coalesce into a sphere of water between [poss] [hand]s, summoned by the power of [hisher] magic. In a rapid surge, the water slams into [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const shimmer = new Ability("Shimmer");
shimmer.Short = () => "Blinding light magic, single target.";
shimmer.cost = { hp: undefined, sp: 15, lp: undefined};
shimmer.castTime = 75;
shimmer.castTree.push(AbilityNode.Template.Magical({
	damageType: {mLight: 1},
	atkMod: 1.9,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("A brilliant sphere of blinding light forms between [poss] [hand]s, summoned by the power of [hisher] magic. At the uttering of a single word, it speeds toward [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Blind(target, { hit : 0.8, str : 0.5, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] become[tnotS] blinded by the light!", parse);
			Text.NL();
		}
	}],
}));

const shade = new Ability("Shade");
shade.Short = () => "Dark shadow magic, single target.";
shade.cost = { hp: undefined, sp: 15, lp: undefined};
shade.castTime = 85;
shade.castTree.push(AbilityNode.Template.Magical({
	damageType: {mDark: 1},
	atkMod: 2.2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Poss] [hand]s are wreathed in shadow, summoned by the power of [hisher] dark magic. Quick as lightning, the shade darts across the ground, wrapping itself around [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Weakness(target, { hit : 0.2, turns : 2, turnsR : 2, str: 0.15 })) {
			Text.Add("[tName] [thas] been weakened!", parse);
			Text.NL();
		}
	}],
}));

const thorn = new Ability("Thorn");
thorn.Short = () => "Constricting nature magic, single target.";
thorn.cost = { hp: undefined, sp: 15, lp: undefined};
thorn.castTime = 75;
thorn.castTree.push(AbilityNode.Template.Magical({
	damageType: {mNature: 1},
	atkMod: 2.0,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.skin = target.SkinDesc();
		Text.Add("[Name] call[notS] on the power of nature, summoning prickly vines that snake around [tname], the sharp thorns raking [thisher] [skin]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] get[tnotS] tangled by the vines, slowing [thimher]!", parse);
			Text.NL();
		}
	}],
}));

const windShear = new Ability("WindShear");
windShear.Short = () => "Wind magic, single target.";
windShear.cost = { hp: undefined, sp: 45, lp: undefined};
windShear.castTime = 120;
windShear.castTree.push(AbilityNode.Template.Magical({
	damageType: {pSlash: 1, mWind: 1},
	atkMod: 1.5,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Poss] [hand]s weave back and forth, summoning a powerful gale of shrieking winds. A frenzy of cutting and slicing air surges toward [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const stalagmite = new Ability("Stalagmite");
stalagmite.Short = () => "Earth magic, single target.";
stalagmite.cost = { hp: undefined, sp: 30, lp: undefined};
stalagmite.castTime = 120;
stalagmite.castTree.push(AbilityNode.Template.Magical({
	damageType: {pBlunt: 0.5, mEarth: 1},
	atkMod: 2.5,
	defMod: 0.8,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The earth rumbles as a large pillar of rock bursts from the ground, raised with [poss] magic.", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The great stalagmite throws [tname] to the ground! ", parse);
		Text.NL();
	}, AbilityNode.Template.Cancel()],
}));

const whirlwind = new Ability("Whirlwind");
whirlwind.Short = () => "Wind magic, targets all enemies.";
whirlwind.cost = { hp: undefined, sp: 35, lp: undefined};
whirlwind.targetMode = TargetMode.Enemies;
whirlwind.castTime = 120;
whirlwind.castTree.push(AbilityNode.Template.Magical({
	damageType: {pSlash: 0.3, mWind: 1},
	atkMod: 1.9,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Poss] [hand]s raise a large torrent of wind, throwing things every which way. The huge whirlwind envelops the opposing party, cutting and slashing!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const eruption = new Ability("Eruption");
eruption.Short = () => "Fire magic, targets all enemies.";
eruption.cost = { hp: undefined, sp: 30, lp: undefined};
eruption.targetMode = TargetMode.Enemies;
eruption.castTime = 110;
eruption.castTree.push(AbilityNode.Template.Magical({
	damageType: {mFire: 1.2},
	atkMod: 2.1,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] a wave of fire and smoke, boiling forth from the ground. The flames envelop the opposing party!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const spread = new Ability("Spread");
spread.Short = () => "Water magic, targets all enemies.";
spread.cost = { hp: undefined, sp: 40, lp: undefined};
spread.targetMode = TargetMode.Enemies;
spread.castTime = 110;
spread.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWater: 1.3},
	atkMod: 2.1,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] a wave of rushing water, sprouting forth from the ground. The great torrent sweeps over the opposing party!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const shock = new Ability("Shock");
shock.Short = () => "Thunder magic, single target. Moderate chance of stunning the enemy.";
shock.cost = { hp: undefined, sp: 25, lp: undefined};
shock.castTime = 80;
shock.castTree.push(AbilityNode.Template.Magical({
	damageType: {mThunder: 1},
	atkMod: 3.0,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. There is a great crackle and a blinding flash of light as a surge of electricity flows through [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.Heal(dmg) + " health!", parse);
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Math.random() < 0.5) {
			target.GetCombatEntry(encounter).initiative -= 25;
			Text.Add("The shock slightly stuns [thimher]!", parse);
			Text.NL();
		}
	}],
}));

const thunderStorm = new Ability("ThunderStorm");
thunderStorm.Short = () => "Thunder magic, targets all enemies. Moderate chance of stunning the enemy.";
thunderStorm.cost = { hp: undefined, sp: 50, lp: undefined};
thunderStorm.targetMode = TargetMode.Enemies;
thunderStorm.castTime = 100;
thunderStorm.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2.2,
	damageType: {mThunder: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. Great stormclouds gather, as nature unleashes an enormous amount of pent-up energy, enveloping the opposing party in a jagged cage of electricity!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.Heal(dmg) + " health!", parse);
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Math.random() < 0.5) {
			target.GetCombatEntry(encounter).initiative -= 25;
			Text.Add(" The shock slightly stuns [thimher]!", parse);
			Text.NL();
		}
	}],
}));

const venom = new Ability("Venom");
venom.Short = () => "Poisons single target.";
venom.cost = { hp: undefined, sp: 15, lp: undefined};
venom.castTime = 50;
venom.castTree.push(AbilityNode.Template.Magical({
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Toxic slime drips from [poss] [hand]s as [heshe] point[notS] them toward [tname].", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Venom(target, { hit : 0.9, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
			Text.Add("[tName] [thas] been poisoned!", parse);
		} else {
			Text.Add("[tName] resist[tnotS] the attack!", parse);
		}
		Text.NL();
	}],
	toDamage: undefined,
}));

const ivy = new Ability("Ivy");
ivy.Short = () => "Nature magic, targets all enemies.";
ivy.cost = { hp: undefined, sp: 40, lp: undefined};
ivy.targetMode = TargetMode.Enemies;
ivy.castTime = 100;
ivy.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2,
	damageType: {mNature: 1.3},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] a mass of writhing thorn and ivy, sprouting forth from the ground to entangle the opposing party!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const hellfire = new Ability("Hellfire");
hellfire.Short = () => "Demon magic, targets all enemies.";
hellfire.targetMode = TargetMode.Enemies;
hellfire.cost = { hp: undefined, sp: 500, lp: undefined};
hellfire.castTime = 200;
hellfire.cooldown = 3;
hellfire.castTree.push(AbilityNode.Template.Magical({
	atkMod: 3,
	damageType: {mFire: 3, mDark: 3},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] the most vile of magic, unleashing a sea of dark fire on [hisher] enemies!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const scream = new Ability("Scream");
scream.Short = () => "Unleash the destructive power of your voice, damaging all foes on the field.";
scream.targetMode = TargetMode.Enemies;
scream.cost = { hp: undefined, sp: 30, lp: 30 };
scream.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWind: 0.5, pBlunt: 0.5},
	atkMod: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Poss] let[notS] out a ear-splitting shriek, the sheer force of [hisher] voice rippling through the air.", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] [tis] severely buffeted by the sudden burst of sound, taking " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
	}],
	onAbsorb: [Defaults.Black._onAbsorb],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] [tis] struck by the sudden piercing screech, but manage[tnotS] to resist its effects.", parse);
		Text.NL();
	}],
}));

const dischord = new Ability("Dischord");
dischord.Short = () => "Attempt to unnerve a foe with your music, hampering their ability to defend themselves. Effectiveness increases with the target’s lust, which is drained in the process.";
dischord.cost = { hp: undefined, sp: 20, lp: 30 };
const dischordOnMiss = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] manage[tnotS] to resist the chaotic discordance of [poss] song.", parse);
	Text.NL();
};
dischord.castTree.push(AbilityNode.Template.Magical({
	toDamage: undefined,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] direct[notS] [hisher] voice at [tname], singing a verse rich with dark, subtle undertones. ", parse);
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Weakness(target, { hit : 0.8, turns : 3, turnsR : 3, str: 0.25 })) {
			Text.Add("The sheer discordance of [poss] voice grips [tname], crippling [thisher] ability to defend [thimher]self!", parse);
			Text.NL();
		} else {
			dischordOnMiss(ability, encounter, caster, target);
		}
	}],
	onMiss: [dischordOnMiss],
}));

const drainingTouch = new Ability("Drain touch");
drainingTouch.Short = () => "Magical darkness attack. Damage dealt is returned to the caster as HP.";
drainingTouch.cost = { hp: undefined, sp: 25, lp: undefined};
drainingTouch.castTime = 75;
drainingTouch.castTree.push(AbilityNode.Template.Magical({
	atkMod: 1,
	damageType: {mDark: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] conjure[notS] up a wreath of shadowy tendrils that race towards [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The tendrils wrap themselves about [tname], leeching " + Text.Damage(-dmg) + " health from [thimher]!", parse);
		Text.NL();
		caster.AddHPAbs(-dmg);
	}],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const hailstorm = new Ability("Hailstorm");
hailstorm.Short = () => "Ice magic, targets all enemies. Low chance of freezing targets.";
hailstorm.cost = { hp: undefined, sp: 50, lp: undefined};
hailstorm.targetMode = TargetMode.Enemies;
hailstorm.castTime = 100;
hailstorm.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2.2,
	damageType: {mIce: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] conjure[notS] up a cone of icy wind and pointed hailstones, directing it towards the enemy party!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Freeze(target, { hit : 0.2, turns : 3, turnsR : 2, proc : 0.5, str : 1.2 })) {
			Text.Add("[tName] [thas] been afflicted with freeze!", parse);
			Text.NL();
		}
	}],
}));

const quake = new Ability("Quake");
quake.Short = () => "Earth magic, targets all enemies.";
quake.cost = { hp: undefined, sp: 40, lp: undefined};
quake.targetMode = TargetMode.Enemies;
quake.castTime = 90;
quake.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2,
	damageType: {mEarth: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("Muttering under [hisher] breath and gesturing at the ground, [name] suddenly summon[notS] a small earthquake under the enemy party!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const prismaticBurst = new Ability("Prism Burst");
prismaticBurst.Short = () => "A powerful shower of multi-elemental energy. Not likely to be wholly effective, but also not likely to be wholly ineffective, either.";
prismaticBurst.cost = { hp: undefined, sp: 70, lp: undefined};
prismaticBurst.targetMode = TargetMode.Enemies;
prismaticBurst.castTime = 130;
prismaticBurst.castTree.push(AbilityNode.Template.Magical({
	atkMod: 1.5,
	damageType: {mEarth: 0.5, mFire: 0.5, mIce: 0.5, mThunder: 0.5},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] weave[notS] [hisher] [hand]s about, summoning streamers of colored light that dart towards the enemy party!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
}));

const lifetap = new Ability("Lifetap");
lifetap.Short = () => "Convert one fifth of your max HP to SP. While it cannot reduce your HP below 1, be careful!";
lifetap.cost = { hp: undefined, sp: undefined, lp: undefined};
lifetap.targetMode = TargetMode.Self;
lifetap.cooldown = 2;
lifetap.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);

	const hp = Math.floor(Math.min(caster.HP() / 5, caster.curHp - 1));

	caster.AddHPAbs(-hp);
	caster.AddSPAbs(hp);

	Text.Add("[Name] focus[notEs] inwards, drawing upon [hisher] own life force to power [hisher] abilities! [Name] gain[notS] " + Text.Mana(hp) + " SP!", parse);
	Text.NL();
});

const entropicFortune = new Ability("E.Fortune");
entropicFortune.Short = () => "Curse a target with bad luck, causing debuffs to land more easily.";
entropicFortune.cost = { hp: undefined, sp: 35, lp: undefined};
entropicFortune.cooldown = 2;
entropicFortune.castTree.push(AbilityNode.Template.Magical({
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Gathering thoughts of malice and ill-will, [name] begin[notS] to weave a hex directed at [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Curse(target, { hit : 1.0, str : 0.5, turns : 15, turnsR : 5 })) {
			Text.Add("[tName] [tis] gripped by the curse, rendering [thimher] far more susceptible to misfortune!", parse);
			Text.NL();
		}
	}],
	toDamage: undefined,
}));

const taintedVitality = new Ability("T.Vitality");
taintedVitality.Short = () => "Twist a foe’s vitality, reducing their defense and inflicting a strong poison.";
taintedVitality.cost = { hp: undefined, sp: 35, lp: undefined};
taintedVitality.cooldown = 3;
taintedVitality.castTree.push(AbilityNode.Template.Magical({
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Focusing dark power, [name] direct[notS] a stream of twisted, malicious energy at [tname]!", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] shrug[tnotS] off the malicious influence.", parse);
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		let sick;
		let weak;
		if (Status.Venom(target, { hit : 0.6, turns : 1, str : 1, dmg : 0.35 })) {
			sick = true;
		}
		if (Status.Weakness(target, { hit : 0.75, turns : 3, turnsR : 3, str: 0.2 })) {
			weak = true;
		}
		if (sick || weak) {
			let w = "";
			if (sick) { w += "sicker"; }
			if (sick && weak) { w += " and "; }
			if (weak) { w += "weaker"; }
			parse.w = w;
			Text.Add("[tName] [tis] struck by the energy and looks distinctly <b>[w]</b>!", parse);
		} else {
			Text.Add("[tName] shrug[tnotS] off the malicious influence.", parse);
		}
		Text.NL();
	}],
	toDamage: undefined,
}));

export namespace BlackAb {
	export const Surge = surge;
	export const Fireball = fireball;
	export const Freeze = freeze;
	export const Bolt = bolt;
	export const Gust = gust;
	export const Spire = spire;
	export const Spray = spray;
	export const Shimmer = shimmer;
	export const Shade = shade;
	export const Thorn = thorn;
	export const WindShear = windShear;
	export const Stalagmite = stalagmite;
	export const Whirlwind = whirlwind;
	export const Eruption = eruption;
	export const Spread = spread;
	export const Shock = shock;
	export const ThunderStorm = thunderStorm;
	export const Venom = venom;
	export const Ivy = ivy;
	export const Hellfire = hellfire;
	export const Scream = scream;
	export const Dischord = dischord;
	export const DrainingTouch = drainingTouch;
	export const Hailstorm = hailstorm;
	export const Quake = quake;
	export const PrismaticBurst = prismaticBurst;
	export const Lifetap = lifetap;
	export const EntropicFortune = entropicFortune;
	export const TaintedVitality = taintedVitality;
}
