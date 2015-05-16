/*
 * 
 * Attack magic
 * 
 */
Abilities.Black = {};

// Default messages
Abilities.Black._onDamage = function(ability, encounter, caster, target, dmg) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("It hits [tname] for " + Text.BoldColor(-dmg, "#800000") + " damage!", parse);
	Text.NL();
}
Abilities.Black._onAbsorb = function(ability, encounter, caster, target, dmg) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] absorb[tnotS] the spell, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
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
	atkMod: 0.5,
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
Abilities.Black.Fireball.castTree.push(AbilityNode.Template.Magical({
	damageType: {mFire: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] make[notS] mystic incantations, waving [hisher] [hand]s in the air. Fiery glyphs appear in front of [himher], coalescing in a large fireball forming between [hisher] outstretched [hand]s. With a great roar, the molten ball of magic surge toward [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the flames, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
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
Abilities.Black.Freeze.castTree.push(AbilityNode.Template.Magical({
	damageType: {mIce: 1},
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
Abilities.Black.Bolt.castTree.push(AbilityNode.Template.Magical({
	damageType: {mThunder: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. There is a great crackle and a blinding flash of light as a bolt of lightning strikes [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
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
Abilities.Black.Gust.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWind: 0.7, pSlash: 0.3},
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
Abilities.Black.Spire.castTree.push(AbilityNode.Template.Magical({
	damageType: {mEarth: 0.7, pBlunt: 0.3},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("There is a loud rumble as the ground shakes, forced from its natural state by the power of [poss] magic. A pillar of rock bursts from the earth below, slamming into [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Spray = new Ability("Spray");
Abilities.Black.Spray.Short = function() { return "Water magic, single target."; }
Abilities.Black.Spray.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Spray.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWater: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Moisture from the air coalesce into a sphere of water between [poss] [hand]s, summoned by the power of [hisher] magic. In a rapid surge, the water slams into [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Shimmer = new Ability("Shimmer");
Abilities.Black.Shimmer.Short = function() { return "Light magic, single target."; }
Abilities.Black.Shimmer.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Shimmer.castTree.push(AbilityNode.Template.Magical({
	damageType: {mLight: 1},
	atkMod: 1.1,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("A brilliant sphere of blinding light forms between [poss] [hand]s, summoned by the power of [hisher] magic. At the uttering of a single word, it speeds toward [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Shade = new Ability("Shade");
Abilities.Black.Shade.Short = function() { return "Dark magic, single target."; }
Abilities.Black.Shade.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Shade.castTree.push(AbilityNode.Template.Magical({
	damageType: {mDark: 1},
	atkMod: 1.1,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Poss] [hand]s are wreathed in shadow, summoned by the power of [hisher] dark magic. Quick as lightning, the shade darts across the ground, wrapping itself around [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Thorn = new Ability("Thorn");
Abilities.Black.Thorn.Short = function() { return "Nature magic, single target."; }
Abilities.Black.Thorn.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Thorn.castTree.push(AbilityNode.Template.Magical({
	damageType: {mNature: 1},
	atkMod: 1.1,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["skin"] = target.SkinDesc();
		Text.Add("[Name] call[notS] on the power of nature, summoning prickly vines that snake around [tname], the sharp thorns raking [thisher] [skin]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.WindShear = new Ability("WindShear");
Abilities.Black.WindShear.Short = function() { return "Wind magic, single target."; }
Abilities.Black.WindShear.cost = { hp: null, sp: 45, lp: null};
Abilities.Black.WindShear.castTree.push(AbilityNode.Template.Magical({
	damageType: {pSlash: 1, mWind: 1},
	atkMod: 1.1,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Poss] [hand]s weave back and forth, summoning a powerful gale of shreaking winds. A frenzy of cutting and slicing air surge toward [tname]! ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [Abilities.Black._onAbsorb]
}));


Abilities.Black.Stalagmite = new Ability("Stalagmite");
Abilities.Black.Stalagmite.Short = function() { return "Earth magic, single target."; }
Abilities.Black.Stalagmite.cost = { hp: null, sp: 30, lp: null};
Abilities.Black.Stalagmite.castTree.push(AbilityNode.Template.Magical({
	damageType: {pBlunt: 0.5, mEarth: 1},
	atkMod: 1.5,
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
	}]
}));


Abilities.Black.Whirlwind = new Ability("Whirlwind");
Abilities.Black.Whirlwind.Short = function() { return "Wind magic, targets all enemies."; }
Abilities.Black.Whirlwind.cost = { hp: null, sp: 35, lp: null};
Abilities.Black.Whirlwind.targetMode = TargetMode.Enemies;
Abilities.Black.Whirlwind.castTree.push(AbilityNode.Template.Magical({
	damageType: {pSlash: 0.3, mWind: 1},
	atkMod: 1.1,
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
Abilities.Black.Eruption.castTree.push(AbilityNode.Template.Magical({
	damageType: {mFire: 1},
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
Abilities.Black.Spread.castTree.push(AbilityNode.Template.Magical({
	damageType: {mWater: 1.3},
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
Abilities.Black.Shock.castTree.push(AbilityNode.Template.Magical({
	damageType: {mThunder: 1},
	atkMod: 1.3,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The air tingles as [name] call[notS] on the power of thunder. There is a great crackle and a blinding flash of light as a surge of electricity flows through [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Black._onMiss],
	onDamage: [Abilities.Black._onDamage],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
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
Abilities.Black.ThunderStorm.castTree.push(AbilityNode.Template.Magical({
	atkMod: 1.3,
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
		Text.Add("[tName] absorb[tnotS] the shock, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
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
Abilities.Black.Venom.castTree.push(AbilityNode.Template.Magical({
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Toxic slime drips from [poss] [hand]s as [heshe] points them toward [tname]. ", parse);
	}],
	onMiss: [Abilities.Black._onMiss],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		if(Status.Venom(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
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
Abilities.Black.Ivy.castTree.push(AbilityNode.Template.Magical({
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
Abilities.Black.Hellfire.castTime = 150;
Abilities.Black.Hellfire.cooldown = 3;
Abilities.Black.Hellfire.castTree.push(AbilityNode.Template.Magical({
	atkMod: 1.5,
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
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Poss] lets out a ear-splitting shriek, the sheer force of [hisher] voice rippling through the air.", parse);
		Text.NL();
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] [tis] severely buffeted by the sudden burst of sound, taking " + Text.BoldColor(-dmg, "#800000") + " damage!", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.Black._onAbsorb],
	onMiss: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] [tis] struck by the sudden piercing screech, but manage[tnotS] to resist its effects.", parse);
		Text.NL();
	}]
}));
