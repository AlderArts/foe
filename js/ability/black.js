/*
 * 
 * Attack magic
 * 
 */
import { AbilityNode } from './node';
import { Ability, Abilities, TargetMode } from '../ability';

Abilities.Black = {};

// Default messages
Abilities.Black._onDamage = function(ability, encounter, caster, target, dmg) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("It hits [tname] for " + Text.Damage(-dmg) + " damage!", parse);
	Text.NL();
}
Abilities.Black._onAbsorb = function(ability, encounter, caster, target, dmg) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] absorb[tnotS] the spell, gaining " + Text.Heal(dmg) + " health!", parse);
	Text.NL();
}
Abilities.Black._onMiss = function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] manage[tnotS] to resist the effects of the spell!", parse);
	Text.NL();
}


Abilities.Black.Surge = new Ability("Surge");
Abilities.Black.Surge.Short = function() { return "Weak non-elemental magic, single target."; }
Abilities.Black.Surge.cost = { hp: null, sp: 5, lp: null};
Abilities.Black.Surge.castTree.push(AbilityNode.Template.Magical({
	damageType: {mVoid: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] call[notS] on a surge of pure magical energy which bursts forth in a flash of light from [hisher] outstretched [hand]s. ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Fireball = new Ability("Fireball");
Abilities.Black.Fireball.Short = function() { return "Fire magic, single target."; }
Abilities.Black.Fireball.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Fireball.castTime = 75;
Abilities.Black.Fireball.castTree.push(AbilityNode.Template.Magical({
	damageType: {mFire: 1},
	atkMod: 2,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] make[notS] mystic incantations, waving [hisher] [hand]s in the air. Fiery glyphs appear in front of [himher], coalescing in a large fireball forming between [hisher] outstretched [hand]s. With a great roar, the molten ball of magic surges toward [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the flames, gaining " + Text.Heal(dmg) + " health!", parse);
	}],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Burn(target, { hit : 0.2, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
			Text.NL();
			Text.Add("[tName] [thas] been burned!", parse);
		}
	}]
}));


Abilities.Black.Freeze = new Ability("Freeze");
Abilities.Black.Freeze.Short = function() { return "Ice magic, single target."; }
Abilities.Black.Freeze.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Freeze.castTime = 70;
Abilities.Black.Freeze.castTree.push(AbilityNode.Template.Magical({
	damageType: {mIce: 1},
	atkMod: 1.9,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The temperature drops in the air around [tname] as [name] call[notS] on the power of ice. There is a loud crackle as the cold snap hits, forming icicles on [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Freeze(target, { hit : 0.2, turns : 3, turnsR : 5, proc : 0.5, str : 1.2 })) {
			Text.NL();
			Text.Add("[tName] [thas] been afflicted with freeze!", parse);
		}
	}]
}));


Abilities.Black.Bolt = new Ability("Bolt");
Abilities.Black.Bolt.Short = function() { return "Thunder magic, single target."; }
Abilities.Black.Bolt.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Bolt.castTime = 60;
Abilities.Black.Bolt.castTree.push(AbilityNode.Template.Magical({
	damageType: {mThunder: 1},
	atkMod: 1.8,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. There is a great crackle and a blinding flash of light as a bolt of lightning strikes [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.Heal(dmg) + " health!", parse);
	}],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Numb(target, { hit : 0.2, turns : 3, turnsR : 5, proc : 0.25 })) {
			Text.NL();
			Text.Add("[tName] [thas] been afflicted with numb!", parse);
		}
	}]
}));


Abilities.Black.Gust = new Ability("Gust");
Abilities.Black.Gust.Short = function() { return "Slashing wind magic, single target."; }
Abilities.Black.Gust.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Gust.castTime = 50;
Abilities.Black.Gust.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWind: 0.7, pSlash: 0.3},
	atkMod: 1.5,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] make[notS] a sweeping gesture, calling on the power of wind to do [hisher] bidding. Erratic gusts of wind dance around, focusing into a single burst homing in on [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Spire = new Ability("Spire");
Abilities.Black.Spire.Short = function() { return "Bashing earth magic, single target."; }
Abilities.Black.Spire.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Spire.castTime = 70;
Abilities.Black.Spire.castTree.push(AbilityNode.Template.Magical({
	damageType: {mEarth: 0.7, pBlunt: 0.3},
	atkMod: 1.9,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("There is a loud rumble as the ground shakes, forced from its natural state by the power of [poss] magic. A pillar of rock bursts from the earth below, slamming into [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage, AbilityNode.Template.Cancel()],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Spray = new Ability("Spray");
Abilities.Black.Spray.Short = function() { return "Water magic, single target."; }
Abilities.Black.Spray.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Spray.castTime = 50;
Abilities.Black.Spray.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWater: 1},
	atkMod: 1.9,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Moisture from the air coalesce into a sphere of water between [poss] [hand]s, summoned by the power of [hisher] magic. In a rapid surge, the water slams into [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Shimmer = new Ability("Shimmer");
Abilities.Black.Shimmer.Short = function() { return "Blinding light magic, single target."; }
Abilities.Black.Shimmer.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Shimmer.castTime = 75;
Abilities.Black.Shimmer.castTree.push(AbilityNode.Template.Magical({
	damageType: {mLight: 1},
	atkMod: 1.9,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("A brilliant sphere of blinding light forms between [poss] [hand]s, summoned by the power of [hisher] magic. At the uttering of a single word, it speeds toward [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Blind(target, { hit : 0.8, str : 0.5, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] become[tnotS] blinded by the light!", parse);
		}
	}]
}));


Abilities.Black.Shade = new Ability("Shade");
Abilities.Black.Shade.Short = function() { return "Dark shadow magic, single target."; }
Abilities.Black.Shade.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Shade.castTime = 85;
Abilities.Black.Shade.castTree.push(AbilityNode.Template.Magical({
	damageType: {mDark: 1},
	atkMod: 2.2,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Poss] [hand]s are wreathed in shadow, summoned by the power of [hisher] dark magic. Quick as lightning, the shade darts across the ground, wrapping itself around [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Weakness(target, { hit : 0.2, turns : 2, turnsR : 2, str: 0.15 })) {
			Text.NL();
			Text.Add("[tName] [thas] been weakened!", parse);
		}
	}]
}));


Abilities.Black.Thorn = new Ability("Thorn");
Abilities.Black.Thorn.Short = function() { return "Constricting nature magic, single target."; }
Abilities.Black.Thorn.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Thorn.castTime = 75;
Abilities.Black.Thorn.castTree.push(AbilityNode.Template.Magical({
	damageType: {mNature: 1},
	atkMod: 2.0,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["skin"] = target.SkinDesc();
		Text.Add("[Name] call[notS] on the power of nature, summoning prickly vines that snake around [tname], the sharp thorns raking [thisher] [skin]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 })) {
			Text.Add("[tName] get[tnotS] tangled by the vines, slowing [thimher]!", parse);
		}
	}]
}));


Abilities.Black.WindShear = new Ability("WindShear");
Abilities.Black.WindShear.Short = function() { return "Wind magic, single target."; }
Abilities.Black.WindShear.cost = { hp: null, sp: 45, lp: null};
Abilities.Black.WindShear.castTime = 120;
Abilities.Black.WindShear.castTree.push(AbilityNode.Template.Magical({
	damageType: {pSlash: 1, mWind: 1},
	atkMod: 1.5,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Poss] [hand]s weave back and forth, summoning a powerful gale of shrieking winds. A frenzy of cutting and slicing air surges toward [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Stalagmite = new Ability("Stalagmite");
Abilities.Black.Stalagmite.Short = function() { return "Earth magic, single target."; }
Abilities.Black.Stalagmite.cost = { hp: null, sp: 30, lp: null};
Abilities.Black.Stalagmite.castTime = 120;
Abilities.Black.Stalagmite.castTree.push(AbilityNode.Template.Magical({
	damageType: {pBlunt: 0.5, mEarth: 1},
	atkMod: 2.5,
	defMod: 0.8,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The earth rumbles as a large pillar of rock bursts from the ground, raised with [poss] magic. ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The great stalagmite throws [tname] to the ground! ", parse);
	}, AbilityNode.Template.Cancel()]
}));


Abilities.Black.Whirlwind = new Ability("Whirlwind");
Abilities.Black.Whirlwind.Short = function() { return "Wind magic, targets all enemies."; }
Abilities.Black.Whirlwind.cost = { hp: null, sp: 35, lp: null};
Abilities.Black.Whirlwind.targetMode = TargetMode.Enemies;
Abilities.Black.Whirlwind.castTime = 120;
Abilities.Black.Whirlwind.castTree.push(AbilityNode.Template.Magical({
	damageType: {pSlash: 0.3, mWind: 1},
	atkMod: 1.9,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Poss] [hand]s raise a large torrent of wind, throwing things every which way. The huge whirlwind envelops the opposing party, cutting and slashing! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Eruption = new Ability("Eruption");
Abilities.Black.Eruption.Short = function() { return "Fire magic, targets all enemies."; }
Abilities.Black.Eruption.cost = { hp: null, sp: 30, lp: null};
Abilities.Black.Eruption.targetMode = TargetMode.Enemies;
Abilities.Black.Eruption.castTime = 110;
Abilities.Black.Eruption.castTree.push(AbilityNode.Template.Magical({
	damageType: {mFire: 1.2},
	atkMod: 2.1,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] a wave of fire and smoke, boiling forth from the ground. The flames envelop the opposing party! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Spread = new Ability("Spread");
Abilities.Black.Spread.Short = function() { return "Water magic, targets all enemies."; }
Abilities.Black.Spread.cost = { hp: null, sp: 40, lp: null};
Abilities.Black.Spread.targetMode = TargetMode.Enemies;
Abilities.Black.Spread.castTime = 110;
Abilities.Black.Spread.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWater: 1.3},
	atkMod: 2.1,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] a wave of rushing water, sprouting forth from the ground. The great torrent sweeps over the opposing party! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Shock = new Ability("Shock");
Abilities.Black.Shock.Short = function() { return "Thunder magic, single target. Moderate chance of stunning the enemy."; }
Abilities.Black.Shock.cost = { hp: null, sp: 25, lp: null};
Abilities.Black.Shock.castTime = 80;
Abilities.Black.Shock.castTree.push(AbilityNode.Template.Magical({
	damageType: {mThunder: 1},
	atkMod: 3.0,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. There is a great crackle and a blinding flash of light as a surge of electricity flows through [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.Heal(dmg) + " health!", parse);
	}],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Math.random() < 0.5) {
			target.GetCombatEntry(encounter).initiative -= 25;
			Text.NL();
			Text.Add("The shock slightly stuns [thimher]!", parse);
		}
	}]
}));


Abilities.Black.ThunderStorm = new Ability("ThunderStorm");
Abilities.Black.ThunderStorm.Short = function() { return "Thunder magic, targets all enemies. Moderate chance of stunning the enemy."; }
Abilities.Black.ThunderStorm.cost = { hp: null, sp: 50, lp: null};
Abilities.Black.ThunderStorm.targetMode = TargetMode.Enemies;
Abilities.Black.ThunderStorm.castTime = 100;
Abilities.Black.ThunderStorm.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2.2,
	damageType: {mThunder: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. Great stormclouds gather, as nature unleashes an enormous amount of pent-up energy, enveloping the opposing party in a jagged cage of electricity!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.Heal(dmg) + " health!", parse);
		Text.NL();
	}],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Math.random() < 0.5) {
			target.GetCombatEntry(encounter).initiative -= 25;
			Text.Add(" The shock slightly stuns [thimher]!", parse);
			Text.NL();
		}
	}]
}));


Abilities.Black.Venom = new Ability("Venom");
Abilities.Black.Venom.Short = function() { return "Poisons single target."; }
Abilities.Black.Venom.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Venom.castTime = 50;
Abilities.Black.Venom.castTree.push(AbilityNode.Template.Magical({
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Toxic slime drips from [poss] [hand]s as [heshe] point[notS] them toward [tname]. ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onHit: [function(ability, encounter, caster, target) {
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


Abilities.Black.Ivy = new Ability("Ivy");
Abilities.Black.Ivy.Short = function() { return "Nature magic, targets all enemies."; }
Abilities.Black.Ivy.cost = { hp: null, sp: 40, lp: null};
Abilities.Black.Ivy.targetMode = TargetMode.Enemies;
Abilities.Black.Ivy.castTime = 100;
Abilities.Black.Ivy.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2,
	damageType: {mNature: 1.3},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] a mass of writhing thorn and ivy, sprouting forth from the ground to entangle the opposing party!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Hellfire = new Ability("Hellfire");
Abilities.Black.Hellfire.Short = function() { return "Demon magic, targets all enemies."; }
Abilities.Black.Hellfire.targetMode = TargetMode.Enemies;
Abilities.Black.Hellfire.cost = { hp: null, sp: 500, lp: null};
Abilities.Black.Hellfire.castTime = 200;
Abilities.Black.Hellfire.cooldown = 3;
Abilities.Black.Hellfire.castTree.push(AbilityNode.Template.Magical({
	atkMod: 3,
	damageType: {mFire: 3, mDark: 3},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] summon[notS] the most vile of magic, unleashing a sea of dark fire on [hisher] enemies!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Scream = new Ability("Scream");
Abilities.Black.Scream.Short = function() { return "Unleash the destructive power of your voice, damaging all foes on the field."; }
Abilities.Black.Scream.targetMode = TargetMode.Enemies;
Abilities.Black.Scream.cost = { hp: null, sp: 30, lp: 30 };
Abilities.Black.Scream.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWind: 0.5, pBlunt: 0.5},
	atkMod: 2,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Poss] let[notS] out a ear-splitting shriek, the sheer force of [hisher] voice rippling through the air.", parse);
		Text.NL();
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] [tis] severely buffeted by the sudden burst of sound, taking " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.Black._onAbsorb],
	onMiss: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] [tis] struck by the sudden piercing screech, but manage[tnotS] to resist its effects.", parse);
		Text.NL();
	}]
}));


Abilities.Black.Dischord = new Ability("Dischord");
Abilities.Black.Dischord.Short = function() { return "Attempt to unnerve a foe with your music, hampering their ability to defend themselves. Effectiveness increases with the target’s lust, which is drained in the process."; }
Abilities.Black.Dischord.cost = { hp: null, sp: 20, lp: 30 };
Abilities.Black.Dischord._onMiss = function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] manage[tnotS] to resist the chaotic discordance of [poss] song.", parse);
}
Abilities.Black.Dischord.castTree.push(AbilityNode.Template.Magical({
	toDamage: null,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] direct[notS] [hisher] voice at [tname], singing a verse rich with dark, subtle undertones. ", parse);
	}],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Weakness(target, { hit : 0.8, turns : 3, turnsR : 3, str: 0.25 })) {
			Text.Add("The sheer discordance of [poss] voice grips [tname], crippling [thisher] ability to defend [thimher]self!", parse);
		}
		else {
			Abilities.Black.Dischord._onMiss(ability, encounter, caster, target);
		}
	}],
	onMiss: [Abilities.Black.Dischord._onMiss]
}));


Abilities.Black.DrainingTouch = new Ability("Drain touch");
Abilities.Black.DrainingTouch.Short = function() { return "Magical darkness attack. Damage dealt is returned to the caster as HP."; }
Abilities.Black.DrainingTouch.cost = { hp: null, sp: 25, lp: null};
Abilities.Black.DrainingTouch.castTime = 75;
Abilities.Black.DrainingTouch.castTree.push(AbilityNode.Template.Magical({
	atkMod: 1,
	damageType: {mDark: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] conjure[notS] up a wreath of shadowy tendrils that race towards [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The tendrils wrap themselves about [tname], leeching " + Text.Damage(-dmg) + " health from [thimher]!", parse);
		Text.NL();
		caster.AddHPAbs(-dmg);
	}],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Hailstorm = new Ability("Hailstorm");
Abilities.Black.Hailstorm.Short = function() { return "Ice magic, targets all enemies. Low chance of freezing targets."; }
Abilities.Black.Hailstorm.cost = { hp: null, sp: 50, lp: null};
Abilities.Black.Hailstorm.targetMode = TargetMode.Enemies;
Abilities.Black.Hailstorm.castTime = 100;
Abilities.Black.Hailstorm.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2.2,
	damageType: {mIce: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] conjure[notS] up a cone of icy wind and pointed hailstones, directing it towards the enemy party!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Freeze(target, { hit : 0.2, turns : 3, turnsR : 2, proc : 0.5, str : 1.2 })) {
			Text.NL();
			Text.Add("[tName] [thas] been afflicted with freeze!", parse);
		}
	}]
}));


Abilities.Black.Quake = new Ability("Quake");
Abilities.Black.Quake.Short = function() { return "Earth magic, targets all enemies."; }
Abilities.Black.Quake.cost = { hp: null, sp: 40, lp: null};
Abilities.Black.Quake.targetMode = TargetMode.Enemies;
Abilities.Black.Quake.castTime = 90;
Abilities.Black.Quake.castTree.push(AbilityNode.Template.Magical({
	atkMod: 2,
	damageType: {mEarth: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("Muttering under [hisher] breath and gesturing at the ground, [name] suddenly summon[notS] a small earthquake under the enemy party!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.PrismaticBurst = new Ability("Prism Burst");
Abilities.Black.PrismaticBurst.Short = function() { return "A powerful shower of multi-elemental energy. Not likely to be wholly effective, but also not likely to be wholly ineffective, either."; }
Abilities.Black.PrismaticBurst.cost = { hp: null, sp: 70, lp: null};
Abilities.Black.PrismaticBurst.targetMode = TargetMode.Enemies;
Abilities.Black.PrismaticBurst.castTime = 130;
Abilities.Black.PrismaticBurst.castTree.push(AbilityNode.Template.Magical({
	atkMod: 1.5,
	damageType: {mEarth: 0.5, mFire: 0.5, mIce: 0.5, mThunder: 0.5},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] weave[notS] [hisher] [hand]s about, summoning streamers of colored light that dart towards the enemy party!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Lifetap = new Ability("Lifetap");
Abilities.Black.Lifetap.Short = function() { return "Convert one fifth of your max HP to SP. While it cannot reduce your HP below 1, be careful!"; }
Abilities.Black.Lifetap.cost = { hp: null, sp: null, lp: null};
Abilities.Black.Lifetap.targetMode = TargetMode.Self;
Abilities.Black.Lifetap.cooldown = 2;
Abilities.Black.Lifetap.castTree.push(function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster);
	
	var hp = Math.floor(Math.min(caster.HP() / 5, caster.curHp-1));
	
	caster.AddHPAbs(-hp);
	caster.AddSPAbs(hp);
	
	Text.Add("[Name] focus[notEs] inwards, drawing upon [hisher] own life force to power [hisher] abilities! [Name] gain[notS] " + Text.Mana(hp) + " SP!", parse);
	Text.NL();
});


Abilities.Black.EntropicFortune = new Ability("E.Fortune");
Abilities.Black.EntropicFortune.Short = function() { return "Curse a target with bad luck, causing debuffs to land more easily."; }
Abilities.Black.EntropicFortune.cost = { hp: null, sp: 35, lp: null};
Abilities.Black.EntropicFortune.cooldown = 2;
Abilities.Black.EntropicFortune.castTree.push(AbilityNode.Template.Magical({
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Gathering thoughts of malice and ill-will, [name] begin[notS] to weave a hex directed at [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Black._onMiss],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Curse(target, { hit : 1.0, str : 0.5, turns : 15, turnsR : 5 })) {
			Text.Add("[tName] [tis] gripped by the curse, rendering [thimher] far more susceptible to misfortune!", parse);
		}
	}],
	toDamage: null
}));


Abilities.Black.TaintedVitality = new Ability("T.Vitality");
Abilities.Black.TaintedVitality.Short = function() { return "Twist a foe’s vitality, reducing their defense and inflicting a strong poison."; }
Abilities.Black.TaintedVitality.cost = { hp: null, sp: 35, lp: null};
Abilities.Black.TaintedVitality.cooldown = 3;
Abilities.Black.TaintedVitality.castTree.push(AbilityNode.Template.Magical({
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Focusing dark power, [name] direct[notS] a stream of twisted, malicious energy at [tname]!", parse);
		Text.NL();
	}],
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] shrug[tnotS] off the malicious influence.", parse);
	}],
	onHit: [function(ability, encounter, caster, target) {
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
