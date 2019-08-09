/*
 * 
 * Attack magic
 * 
 */
import { AbilityNode } from './node';
import { Ability, TargetMode } from '../ability';
import { Defaults } from './default';
import { Text } from '../text';
import { Encounter } from '../combat';
import { Entity } from '../entity';
import { Status } from '../statuseffect';

let BlackAb : any = {};


BlackAb.Surge = new Ability("Surge");
BlackAb.Surge.Short = function() { return "Weak non-elemental magic, single target."; }
BlackAb.Surge.cost = { hp: null, sp: 5, lp: null};
BlackAb.Surge.castTree.push(AbilityNode.Template.Magical({
	damageType: {mVoid: 1},
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] call[notS] on a surge of pure magical energy which bursts forth in a flash of light from [hisher] outstretched [hand]s. ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Fireball = new Ability("Fireball");
BlackAb.Fireball.Short = function() { return "Fire magic, single target."; }
BlackAb.Fireball.cost = { hp: null, sp: 10, lp: null};
BlackAb.Fireball.castTime = 75;
BlackAb.Fireball.castTree.push(AbilityNode.Template.Magical({
	damageType: {mFire: 1},
	atkMod: 2,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] make[notS] mystic incantations, waving [hisher] [hand]s in the air. Fiery glyphs appear in front of [himher], coalescing in a large fireball forming between [hisher] outstretched [hand]s. With a great roar, the molten ball of magic surges toward [tname]! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the flames, gaining " + Text.Heal(dmg) + " health!", parse);
	}],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Burn(target, { hit : 0.2, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
			Text.NL();
			Text.Add("[tName] [thas] been burned!", parse);
		}
	}]
}));


BlackAb.Freeze = new Ability("Freeze");
BlackAb.Freeze.Short = function() { return "Ice magic, single target."; }
BlackAb.Freeze.cost = { hp: null, sp: 10, lp: null};
BlackAb.Freeze.castTime = 70;
BlackAb.Freeze.castTree.push(AbilityNode.Template.Magical({
	damageType: {mIce: 1},
	atkMod: 1.9,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The temperature drops in the air around [tname] as [name] call[notS] on the power of ice. There is a loud crackle as the cold snap hits, forming icicles on [tname]! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Freeze(target, { hit : 0.2, turns : 3, turnsR : 5, proc : 0.5, str : 1.2 })) {
			Text.NL();
			Text.Add("[tName] [thas] been afflicted with freeze!", parse);
		}
	}]
}));


BlackAb.Bolt = new Ability("Bolt");
BlackAb.Bolt.Short = function() { return "Thunder magic, single target."; }
BlackAb.Bolt.cost = { hp: null, sp: 10, lp: null};
BlackAb.Bolt.castTime = 60;
BlackAb.Bolt.castTree.push(AbilityNode.Template.Magical({
	damageType: {mThunder: 1},
	atkMod: 1.8,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. There is a great crackle and a blinding flash of light as a bolt of lightning strikes [tname]! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.Heal(dmg) + " health!", parse);
	}],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Numb(target, { hit : 0.2, turns : 3, turnsR : 5, proc : 0.25 })) {
			Text.NL();
			Text.Add("[tName] [thas] been afflicted with numb!", parse);
		}
	}]
}));


BlackAb.Gust = new Ability("Gust");
BlackAb.Gust.Short = function() { return "Slashing wind magic, single target."; }
BlackAb.Gust.cost = { hp: null, sp: 10, lp: null};
BlackAb.Gust.castTime = 50;
BlackAb.Gust.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWind: 0.7, pSlash: 0.3},
	atkMod: 1.5,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] make[notS] a sweeping gesture, calling on the power of wind to do [hisher] bidding. Erratic gusts of wind dance around, focusing into a single burst homing in on [tname]! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Spire = new Ability("Spire");
BlackAb.Spire.Short = function() { return "Bashing earth magic, single target."; }
BlackAb.Spire.cost = { hp: null, sp: 10, lp: null};
BlackAb.Spire.castTime = 70;
BlackAb.Spire.castTree.push(AbilityNode.Template.Magical({
	damageType: {mEarth: 0.7, pBlunt: 0.3},
	atkMod: 1.9,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("There is a loud rumble as the ground shakes, forced from its natural state by the power of [poss] magic. A pillar of rock bursts from the earth below, slamming into [tname]! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage, AbilityNode.Template.Cancel()],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Spray = new Ability("Spray");
BlackAb.Spray.Short = function() { return "Water magic, single target."; }
BlackAb.Spray.cost = { hp: null, sp: 10, lp: null};
BlackAb.Spray.castTime = 50;
BlackAb.Spray.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWater: 1},
	atkMod: 1.9,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Moisture from the air coalesce into a sphere of water between [poss] [hand]s, summoned by the power of [hisher] magic. In a rapid surge, the water slams into [tname]! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Shimmer = new Ability("Shimmer");
BlackAb.Shimmer.Short = function() { return "Blinding light magic, single target."; }
BlackAb.Shimmer.cost = { hp: null, sp: 15, lp: null};
BlackAb.Shimmer.castTime = 75;
BlackAb.Shimmer.castTree.push(AbilityNode.Template.Magical({
	damageType: {mLight: 1},
	atkMod: 1.9,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("A brilliant sphere of blinding light forms between [poss] [hand]s, summoned by the power of [hisher] magic. At the uttering of a single word, it speeds toward [tname]! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Blind(target, { hit : 0.8, str : 0.5, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] become[tnotS] blinded by the light!", parse);
		}
	}]
}));


BlackAb.Shade = new Ability("Shade");
BlackAb.Shade.Short = function() { return "Dark shadow magic, single target."; }
BlackAb.Shade.cost = { hp: null, sp: 15, lp: null};
BlackAb.Shade.castTime = 85;
BlackAb.Shade.castTree.push(AbilityNode.Template.Magical({
	damageType: {mDark: 1},
	atkMod: 2.2,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Poss] [hand]s are wreathed in shadow, summoned by the power of [hisher] dark magic. Quick as lightning, the shade darts across the ground, wrapping itself around [tname]! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Weakness(target, { hit : 0.2, turns : 2, turnsR : 2, str: 0.15 })) {
			Text.NL();
			Text.Add("[tName] [thas] been weakened!", parse);
		}
	}]
}));


BlackAb.Thorn = new Ability("Thorn");
BlackAb.Thorn.Short = function() { return "Constricting nature magic, single target."; }
BlackAb.Thorn.cost = { hp: null, sp: 15, lp: null};
BlackAb.Thorn.castTime = 75;
BlackAb.Thorn.castTree.push(AbilityNode.Template.Magical({
	damageType: {mNature: 1},
	atkMod: 2.0,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["skin"] = target.SkinDesc();
		Text.Add("[Name] call[notS] on the power of nature, summoning prickly vines that snake around [tname], the sharp thorns raking [thisher] [skin]! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] get[tnotS] tangled by the vines, slowing [thimher]!", parse);
		}
	}]
}));


BlackAb.WindShear = new Ability("WindShear");
BlackAb.WindShear.Short = function() { return "Wind magic, single target."; }
BlackAb.WindShear.cost = { hp: null, sp: 45, lp: null};
BlackAb.WindShear.castTime = 120;
BlackAb.WindShear.castTree.push(AbilityNode.Template.Magical({
	damageType: {pSlash: 1, mWind: 1},
	atkMod: 1.5,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Poss] [hand]s weave back and forth, summoning a powerful gale of shrieking winds. A frenzy of cutting and slicing air surges toward [tname]! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Stalagmite = new Ability("Stalagmite");
BlackAb.Stalagmite.Short = function() { return "Earth magic, single target."; }
BlackAb.Stalagmite.cost = { hp: null, sp: 30, lp: null};
BlackAb.Stalagmite.castTime = 120;
BlackAb.Stalagmite.castTree.push(AbilityNode.Template.Magical({
	damageType: {pBlunt: 0.5, mEarth: 1},
	atkMod: 2.5,
	defMod: 0.8,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The earth rumbles as a large pillar of rock bursts from the ground, raised with [poss] magic. ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The great stalagmite throws [tname] to the ground! ", parse);
	}, AbilityNode.Template.Cancel()]
}));


BlackAb.Whirlwind = new Ability("Whirlwind");
BlackAb.Whirlwind.Short = function() { return "Wind magic, targets all enemies."; }
BlackAb.Whirlwind.cost = { hp: null, sp: 35, lp: null};
BlackAb.Whirlwind.targetMode = TargetMode.Enemies;
BlackAb.Whirlwind.castTime = 120;
BlackAb.Whirlwind.castTree.push(AbilityNode.Template.Magical({
	damageType: {pSlash: 0.3, mWind: 1},
	atkMod: 1.9,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Poss] [hand]s raise a large torrent of wind, throwing things every which way. The huge whirlwind envelops the opposing party, cutting and slashing! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Eruption = new Ability("Eruption");
BlackAb.Eruption.Short = function() { return "Fire magic, targets all enemies."; }
BlackAb.Eruption.cost = { hp: null, sp: 30, lp: null};
BlackAb.Eruption.targetMode = TargetMode.Enemies;
BlackAb.Eruption.castTime = 110;
BlackAb.Eruption.castTree.push(AbilityNode.Template.Magical({
	damageType: {mFire: 1.2},
	atkMod: 2.1,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] a wave of fire and smoke, boiling forth from the ground. The flames envelop the opposing party! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Spread = new Ability("Spread");
BlackAb.Spread.Short = function() { return "Water magic, targets all enemies."; }
BlackAb.Spread.cost = { hp: null, sp: 40, lp: null};
BlackAb.Spread.targetMode = TargetMode.Enemies;
BlackAb.Spread.castTime = 110;
BlackAb.Spread.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWater: 1.3},
	atkMod: 2.1,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] a wave of rushing water, sprouting forth from the ground. The great torrent sweeps over the opposing party! ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Shock = new Ability("Shock");
BlackAb.Shock.Short = function() { return "Thunder magic, single target. Moderate chance of stunning the enemy."; }
BlackAb.Shock.cost = { hp: null, sp: 25, lp: null};
BlackAb.Shock.castTime = 80;
BlackAb.Shock.castTree.push(AbilityNode.Template.Magical({
	damageType: {mThunder: 1},
	atkMod: 3.0,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. There is a great crackle and a blinding flash of light as a surge of electricity flows through [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.Heal(dmg) + " health!", parse);
	}],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Math.random() < 0.5) {
			target.GetCombatEntry(encounter).initiative -= 25;
			Text.NL();
			Text.Add("The shock slightly stuns [thimher]!", parse);
		}
	}]
}));


BlackAb.ThunderStorm = new Ability("ThunderStorm");
BlackAb.ThunderStorm.Short = function() { return "Thunder magic, targets all enemies. Moderate chance of stunning the enemy."; }
BlackAb.ThunderStorm.cost = { hp: null, sp: 50, lp: null};
BlackAb.ThunderStorm.targetMode = TargetMode.Enemies;
BlackAb.ThunderStorm.castTime = 100;
BlackAb.ThunderStorm.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2.2,
	damageType: {mThunder: 1},
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. Great stormclouds gather, as nature unleashes an enormous amount of pent-up energy, enveloping the opposing party in a jagged cage of electricity!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.Heal(dmg) + " health!", parse);
		Text.NL();
	}],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Math.random() < 0.5) {
			target.GetCombatEntry(encounter).initiative -= 25;
			Text.Add(" The shock slightly stuns [thimher]!", parse);
			Text.NL();
		}
	}]
}));


BlackAb.Venom = new Ability("Venom");
BlackAb.Venom.Short = function() { return "Poisons single target."; }
BlackAb.Venom.cost = { hp: null, sp: 15, lp: null};
BlackAb.Venom.castTime = 50;
BlackAb.Venom.castTree.push(AbilityNode.Template.Magical({
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Toxic slime drips from [poss] [hand]s as [heshe] point[notS] them toward [tname]. ", parse);
	}],
	onMiss: [Defaults.Black._onMiss],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Venom(target, { hit : 0.9, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
			Text.Add("[tName] [thas] been poisoned!", parse);
		}
		else {
			Text.Add("[tName] resist[tnotS] the attack!", parse);
		}
	}],
	toDamage: null
}));


BlackAb.Ivy = new Ability("Ivy");
BlackAb.Ivy.Short = function() { return "Nature magic, targets all enemies."; }
BlackAb.Ivy.cost = { hp: null, sp: 40, lp: null};
BlackAb.Ivy.targetMode = TargetMode.Enemies;
BlackAb.Ivy.castTime = 100;
BlackAb.Ivy.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2,
	damageType: {mNature: 1.3},
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] a mass of writhing thorn and ivy, sprouting forth from the ground to entangle the opposing party!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Hellfire = new Ability("Hellfire");
BlackAb.Hellfire.Short = function() { return "Demon magic, targets all enemies."; }
BlackAb.Hellfire.targetMode = TargetMode.Enemies;
BlackAb.Hellfire.cost = { hp: null, sp: 500, lp: null};
BlackAb.Hellfire.castTime = 200;
BlackAb.Hellfire.cooldown = 3;
BlackAb.Hellfire.castTree.push(AbilityNode.Template.Magical({
	atkMod: 3,
	damageType: {mFire: 3, mDark: 3},
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] the most vile of magic, unleashing a sea of dark fire on [hisher] enemies!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Scream = new Ability("Scream");
BlackAb.Scream.Short = function() { return "Unleash the destructive power of your voice, damaging all foes on the field."; }
BlackAb.Scream.targetMode = TargetMode.Enemies;
BlackAb.Scream.cost = { hp: null, sp: 30, lp: 30 };
BlackAb.Scream.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWind: 0.5, pBlunt: 0.5},
	atkMod: 2,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Poss] let[notS] out a ear-splitting shriek, the sheer force of [hisher] voice rippling through the air.", parse);
		Text.NL();
	}],
	onDamage: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] [tis] severely buffeted by the sudden burst of sound, taking " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
	}],
	onAbsorb: [Defaults.Black._onAbsorb],
	onMiss: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] [tis] struck by the sudden piercing screech, but manage[tnotS] to resist its effects.", parse);
		Text.NL();
	}]
}));


BlackAb.Dischord = new Ability("Dischord");
BlackAb.Dischord.Short = function() { return "Attempt to unnerve a foe with your music, hampering their ability to defend themselves. Effectiveness increases with the target’s lust, which is drained in the process."; }
BlackAb.Dischord.cost = { hp: null, sp: 20, lp: 30 };
BlackAb.Dischord._onMiss = function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] manage[tnotS] to resist the chaotic discordance of [poss] song.", parse);
}
BlackAb.Dischord.castTree.push(AbilityNode.Template.Magical({
	toDamage: null,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] direct[notS] [hisher] voice at [tname], singing a verse rich with dark, subtle undertones. ", parse);
	}],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Weakness(target, { hit : 0.8, turns : 3, turnsR : 3, str: 0.25 })) {
			Text.Add("The sheer discordance of [poss] voice grips [tname], crippling [thisher] ability to defend [thimher]self!", parse);
		}
		else {
			BlackAb.Dischord._onMiss(ability, encounter, caster, target);
		}
	}],
	onMiss: [BlackAb.Dischord._onMiss]
}));


BlackAb.DrainingTouch = new Ability("Drain touch");
BlackAb.DrainingTouch.Short = function() { return "Magical darkness attack. Damage dealt is returned to the caster as HP."; }
BlackAb.DrainingTouch.cost = { hp: null, sp: 25, lp: null};
BlackAb.DrainingTouch.castTime = 75;
BlackAb.DrainingTouch.castTree.push(AbilityNode.Template.Magical({
	atkMod: 1,
	damageType: {mDark: 1},
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] conjure[notS] up a wreath of shadowy tendrils that race towards [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The tendrils wrap themselves about [tname], leeching " + Text.Damage(-dmg) + " health from [thimher]!", parse);
		Text.NL();
		caster.AddHPAbs(-dmg);
	}],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Hailstorm = new Ability("Hailstorm");
BlackAb.Hailstorm.Short = function() { return "Ice magic, targets all enemies. Low chance of freezing targets."; }
BlackAb.Hailstorm.cost = { hp: null, sp: 50, lp: null};
BlackAb.Hailstorm.targetMode = TargetMode.Enemies;
BlackAb.Hailstorm.castTime = 100;
BlackAb.Hailstorm.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2.2,
	damageType: {mIce: 1},
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] conjure[notS] up a cone of icy wind and pointed hailstones, directing it towards the enemy party!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Freeze(target, { hit : 0.2, turns : 3, turnsR : 2, proc : 0.5, str : 1.2 })) {
			Text.NL();
			Text.Add("[tName] [thas] been afflicted with freeze!", parse);
		}
	}]
}));


BlackAb.Quake = new Ability("Quake");
BlackAb.Quake.Short = function() { return "Earth magic, targets all enemies."; }
BlackAb.Quake.cost = { hp: null, sp: 40, lp: null};
BlackAb.Quake.targetMode = TargetMode.Enemies;
BlackAb.Quake.castTime = 90;
BlackAb.Quake.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2,
	damageType: {mEarth: 1},
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("Muttering under [hisher] breath and gesturing at the ground, [name] suddenly summon[notS] a small earthquake under the enemy party!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.PrismaticBurst = new Ability("Prism Burst");
BlackAb.PrismaticBurst.Short = function() { return "A powerful shower of multi-elemental energy. Not likely to be wholly effective, but also not likely to be wholly ineffective, either."; }
BlackAb.PrismaticBurst.cost = { hp: null, sp: 70, lp: null};
BlackAb.PrismaticBurst.targetMode = TargetMode.Enemies;
BlackAb.PrismaticBurst.castTime = 130;
BlackAb.PrismaticBurst.castTree.push(AbilityNode.Template.Magical({
	atkMod: 1.5,
	damageType: {mEarth: 0.5, mFire: 0.5, mIce: 0.5, mThunder: 0.5},
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] weave[notS] [hisher] [hand]s about, summoning streamers of colored light that dart towards the enemy party!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onDamage: [Defaults.Black._onDamage],
	onAbsorb: [Defaults.Black._onAbsorb]
}));


BlackAb.Lifetap = new Ability("Lifetap");
BlackAb.Lifetap.Short = function() { return "Convert one fifth of your max HP to SP. While it cannot reduce your HP below 1, be careful!"; }
BlackAb.Lifetap.cost = { hp: null, sp: null, lp: null};
BlackAb.Lifetap.targetMode = TargetMode.Self;
BlackAb.Lifetap.cooldown = 2;
BlackAb.Lifetap.castTree.push(function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
	var parse = AbilityNode.DefaultParser(caster);
	
	var hp = Math.floor(Math.min(caster.HP() / 5, caster.curHp-1));
	
	caster.AddHPAbs(-hp);
	caster.AddSPAbs(hp);
	
	Text.Add("[Name] focus[notEs] inwards, drawing upon [hisher] own life force to power [hisher] abilities! [Name] gain[notS] " + Text.Mana(hp) + " SP!", parse);
	Text.NL();
});


BlackAb.EntropicFortune = new Ability("E.Fortune");
BlackAb.EntropicFortune.Short = function() { return "Curse a target with bad luck, causing debuffs to land more easily."; }
BlackAb.EntropicFortune.cost = { hp: null, sp: 35, lp: null};
BlackAb.EntropicFortune.cooldown = 2;
BlackAb.EntropicFortune.castTree.push(AbilityNode.Template.Magical({
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Gathering thoughts of malice and ill-will, [name] begin[notS] to weave a hex directed at [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Black._onMiss],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Curse(target, { hit : 1.0, str : 0.5, turns : 15, turnsR : 5 })) {
			Text.Add("[tName] [tis] gripped by the curse, rendering [thimher] far more susceptible to misfortune!", parse);
		}
	}],
	toDamage: null
}));


BlackAb.TaintedVitality = new Ability("T.Vitality");
BlackAb.TaintedVitality.Short = function() { return "Twist a foe’s vitality, reducing their defense and inflicting a strong poison."; }
BlackAb.TaintedVitality.cost = { hp: null, sp: 35, lp: null};
BlackAb.TaintedVitality.cooldown = 3;
BlackAb.TaintedVitality.castTree.push(AbilityNode.Template.Magical({
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Focusing dark power, [name] direct[notS] a stream of twisted, malicious energy at [tname]!", parse);
		Text.NL();
	}],
	onMiss: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] shrug[tnotS] off the malicious influence.", parse);
	}],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		var sick, weak;
		if(Status.Venom(target, { hit : 0.6, turns : 1, str : 1, dmg : 0.35 })) {
			sick = true;
		}
		if(Status.Weakness(target, { hit : 0.75, turns : 3, turnsR : 3, str: 0.2 })) {
			weak = true;
		}
		if(sick || weak) {
			var w = "";
			if(sick) w += "sicker";
			if(sick && weak) w += " and ";
			if(weak) w += "weaker";
			parse["w"] = w;
			Text.Add("[tName] [tis] struck by the energy and looks distinctly <b>[w]</b>!", parse);
		}
		else {
			Text.Add("[tName] shrug[tnotS] off the malicious influence.", parse);
		}
	}],
	toDamage: null
}));

export { BlackAb };
