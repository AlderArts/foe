/*
 * 
 * Attack magic
 * 
 */
//TODO REMOVE
AttackSpell = function() {
	this.damageType   = {};
	this.targetMode   = TargetMode.Enemy;
	
	this.OnCast       = null;
	this.TargetEffect = null;
}
AttackSpell.prototype = new Ability();
AttackSpell.prototype.constructor = AttackSpell;

AttackSpell.prototype.CastInternal = function(encounter, caster, target) {
	var atkMod     = this.atkMod || 1;
	var defMod     = this.defMod || 1;
	var targetMode = this.targetMode || TargetMode.Enemy;
	
	
	var damageType = new DamageType(this.damageType);
	
	if(this.OnCast)
		this.OnCast(encounter, caster, target);
	
	var targets;
	if(targetMode == TargetMode.Enemies)
		targets = target.members;
	else //(targetMode == TargetMode.Enemy)
		targets = [target];
	
	for(var i = 0; i < targets.length; i++) {
		var e      = targets[i];
		if(e.Incapacitated()) continue;
		
		var atkDmg = atkMod * caster.MAttack();
		var def    = defMod * e.MDefense();
		
		//var dmg = atkDmg - def;
		var dmg = Ability.Damage(atkDmg, def, caster.level, e.level);
		if(dmg < 0) dmg = 0;
		
		dmg = damageType.ApplyDmgType(e.elementDef, dmg);
		dmg = Math.floor(dmg);
	
		e.AddHPAbs(-dmg);
		
		if(dmg >= 0) {
			if(this.OnHit) this.OnHit(encounter, caster, e, dmg);
		}
		else {
			if(this.OnAbsorb) this.OnAbsorb(encounter, caster, e, -dmg);
		}
		if(this.TargetEffect) this.TargetEffect(encounter, caster, e);
	}
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
// Default messages
AttackSpell.prototype.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tName : target.nameDesc() };
	Text.Add("It hits [tName] for " + Text.BoldColor(dmg, "#800000") + " damage!", parse);
	Text.NL();
}
AttackSpell.prototype.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.Add("[tName] absorb[s] the spell, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.NL();
}

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


//TODO REPLACE
Abilities.Black.WindShear = new AttackSpell();
Abilities.Black.WindShear.name = "WindShear";
Abilities.Black.WindShear.Short = function() { return "Wind magic, single target."; }
Abilities.Black.WindShear.cost = { hp: null, sp: 65, lp: null};
Abilities.Black.WindShear.damageType.pSlash = 1;
Abilities.Black.WindShear.damageType.mWind = 1;
Abilities.Black.WindShear.atkMod = 1.1;
Abilities.Black.WindShear.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.Add("[Possessive] [hand]s weave back and forth, summoning a powerful gale of shreaking winds. A frenzy of cutting and slicing air surge toward [tName]! ", parse);
}

//TODO REPLACE
Abilities.Black.Stalagmite = new AttackSpell();
Abilities.Black.Stalagmite.name = "Stalagmite";
Abilities.Black.Stalagmite.Short = function() { return "Earth magic, single target."; }
Abilities.Black.Stalagmite.cost = { hp: null, sp: 30, lp: null};
Abilities.Black.Stalagmite.damageType.mEarth = 1;
Abilities.Black.Stalagmite.damageType.pBlunt = 0.5;
Abilities.Black.Stalagmite.atkMod = 1.5;
Abilities.Black.Stalagmite.defMod = 0.5;
Abilities.Black.Stalagmite.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.Add("The earth rumbles as a large pillar of rock bursts from the ground, raised with [possessive] magic. ", parse);
	//TODO On hit
	Text.Add("The great stalagmite throws [tName] to the ground! ", parse);
}

//TODO REPLACE
Abilities.Black.Whirlwind = new AttackSpell();
Abilities.Black.Whirlwind.name = "Whirlwind";
Abilities.Black.Whirlwind.Short = function() { return "Wind magic, targets all enemies."; }
Abilities.Black.Whirlwind.targetMode = TargetMode.Enemies;
Abilities.Black.Whirlwind.cost = { hp: null, sp: 35, lp: null};
Abilities.Black.Whirlwind.damageType.mWind = 1;
Abilities.Black.Whirlwind.damageType.mSlash = 0.3;
Abilities.Black.Whirlwind.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.Add("[Possessive] [hand]s raise a large torrent of wind, throwing things every which way. The huge whirlwind envelops the opposing party, cutting and slashing! ", parse);
}

//TODO REPLACE
Abilities.Black.Eruption = new AttackSpell();
Abilities.Black.Eruption.name = "Eruption";
Abilities.Black.Eruption.Short = function() { return "Fire magic, targets all enemies."; }
Abilities.Black.Eruption.cost = { hp: null, sp: 30, lp: null};
Abilities.Black.Eruption.targetMode = TargetMode.Enemies;
Abilities.Black.Eruption.damageType.mFire = 1;
Abilities.Black.Eruption.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.Add("[name] summon[s] a wave of fire and smoke, boiling forth from the ground. The flames envelop the opposing party! ", parse);
}

//TODO REPLACE
Abilities.Black.Spread = new AttackSpell();
Abilities.Black.Spread.name = "Spread";
Abilities.Black.Spread.Short = function() { return "Water magic, targets all enemies."; }
Abilities.Black.Spread.cost = { hp: null, sp: 40, lp: null};
Abilities.Black.Spread.targetMode = TargetMode.Enemies;
Abilities.Black.Spread.damageType.mWater = 1.3;
Abilities.Black.Spread.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.Add("[name] summon[s] a wave of rushing water, sprouting forth from the ground. The great torrent sweeps over the opposing party! ", parse);
}

//TODO REPLACE
Abilities.Black.Shock = new AttackSpell();
Abilities.Black.Shock.name = "Shock";
Abilities.Black.Shock.Short = function() { return "Thunder magic, single target. Moderate chance of stunning the enemy."; }
Abilities.Black.Shock.cost = { hp: null, sp: 25, lp: null};
Abilities.Black.Shock.atkMod = 1.3;
Abilities.Black.Shock.damageType.mThunder = 1;
Abilities.Black.Shock.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.nameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.Add("The air tingles as [name] call[s] on the power of thunder. There is a great crackle and a blinding flash of light as a surge of electricity flows through [tName]! ", parse);
}
Abilities.Black.Shock.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.Add("[tName] absorb[s] the shock, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.NL();
}
Abilities.Black.Shock.TargetEffect = function(encounter, caster, target) {
	if(Math.random() < 0.5) {
		for(var i = 0; i < encounter.combatOrder.length; i++) {
			if(encounter.combatOrder[i].entity == target)
				encounter.combatOrder[i].initiative -= 25;
		}
		Text.Add("The shock slightly stuns [himher]!", {himher : target.himher()});
		Text.NL();
	}
}

//TODO REPLACE
Abilities.Black.ThunderStorm = new AttackSpell();
Abilities.Black.ThunderStorm.name = "T.Storm";
Abilities.Black.ThunderStorm.Short = function() { return "Thunder magic, targets all enemies. Moderate chance of stunning the enemy."; }
Abilities.Black.ThunderStorm.cost = { hp: null, sp: 50, lp: null};
Abilities.Black.ThunderStorm.targetMode = TargetMode.Enemies;
Abilities.Black.ThunderStorm.atkMod = 1.3;
Abilities.Black.ThunderStorm.damageType.mThunder = 1;
Abilities.Black.ThunderStorm.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.nameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.Add("The air tingles as [name] call[s] on the power of thunder. Great stormclouds gather, as nature unleashes an enormous amount of pent-up energy, enveloping the opposing party in a jagged cage of electricity!", parse);
}
Abilities.Black.ThunderStorm.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.Add(" [tName] absorb[s] the shock, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.NL();
}
Abilities.Black.ThunderStorm.TargetEffect = function(encounter, caster, target) {
	if(Math.random() < 0.5) {
		for(var i = 0; i < encounter.combatOrder.length; i++) {
			if(encounter.combatOrder[i].entity == target)
				encounter.combatOrder[i].initiative -= 25;
		}
		Text.Add(" The shock slightly stuns [himher]!", {himher : target.himher()});
		Text.NL();
	}
}


//TODO REPLACE
Abilities.Black.Venom = new AttackSpell();
Abilities.Black.Venom.name = "Venom";
Abilities.Black.Venom.Short = function() { return "Poisons single target."; }
Abilities.Black.Venom.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Venom.OnHit = null;
Abilities.Black.Venom.OnAbsorb = null;
Abilities.Black.Venom.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), target : target.nameDesc(), heshe : caster.heshe(), hand : caster.HandDesc() };
	Text.Add("Toxic slime drips from [possessive] [hand]s as [heshe] points them toward [target]. ", parse);
}
Abilities.Black.Venom.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Venom(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
		Text.Add("[target] [has] been poisoned! ", parse);
	}
	else {
		Text.Add("[target] resist[s] the attack! ", parse);
	}
}


//TODO REPLACE
Abilities.Black.Ivy = new AttackSpell();
Abilities.Black.Ivy.name = "Ivy";
Abilities.Black.Ivy.Short = function() { return "Nature magic, targets all enemies."; }
Abilities.Black.Ivy.cost = { hp: null, sp: 40, lp: null};
Abilities.Black.Ivy.targetMode = TargetMode.Enemies;
Abilities.Black.Ivy.damageType.mWater = 1.3;
Abilities.Black.Ivy.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.Add("[name] summon[s] a mass of writhing thorn and ivy, sprouting forth from the ground to entangle the opposing party! ", parse);
}

//TODO REPLACE
Abilities.Black.Hellfire = new AttackSpell();
Abilities.Black.Hellfire.name = "Hellfire";
Abilities.Black.Hellfire.Short = function() { return "Demon magic, targets all enemies."; }
Abilities.Black.Hellfire.targetMode = TargetMode.Enemies;
Abilities.Black.Hellfire.cost = { hp: null, sp: 500, lp: null};
Abilities.Black.Hellfire.damageType.mFire = 3;
Abilities.Black.Hellfire.damageType.mDark = 3;
Abilities.Black.Hellfire.atkMod = 1.5;
Abilities.Black.Hellfire.OnCast = function(encounter, caster, target) {
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == caster)
			encounter.combatOrder[i].initiative -= 100;
	}
	
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s"};
	Text.Add("[name] summons the most vile of magic, unleashing a sea of dark fire on [hisher] enemies! ", parse);
}

//TODO REPLACE
Abilities.Black.Scream = new AttackSpell();
Abilities.Black.Scream.name = "Scream";
Abilities.Black.Scream.Short = function() { return "Unleash the destructive power of your voice, damaging all foes on the field."; }
Abilities.Black.Scream.targetMode = TargetMode.Enemies;
Abilities.Black.Scream.cost = { hp: null, sp: 30, lp: 30 };
Abilities.Black.Scream.damageType.pBlunt = 0.5;
Abilities.Black.Scream.damageType.mWind = 0.5;
Abilities.Black.Scream.atkMod = 1;
Abilities.Black.Scream.OnCast = function(encounter, caster, target) {
	var parse = { Poss : caster.Possessive(), hisher : caster.hisher() };
	Text.Add("[Poss] lets out a ear-splitting shriek, the sheer force of [hisher] voice rippling through the air. ", parse);
}
Abilities.Black.Scream.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", is: target.is() };
	Text.Add("[tName] [is] severely buffeted by the sudden burst of sound, taking " + Text.BoldColor(dmg, "#008000") + " damage!", parse);
	Text.NL();
}
Abilities.Black.Scream.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", is: target.is() };
	Text.Add("[tName] [is] struck by the sudden piercing screech, but manage[s] to resist its effects.", parse);
	Text.NL();
}
