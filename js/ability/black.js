/*
 * 
 * Attack magic
 * 
 */
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
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
// Default messages
AttackSpell.prototype.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tName : target.nameDesc() };
	Text.AddOutput("It hits [tName] for " + Text.BoldColor(dmg, "#800000") + " damage!", parse);
	Text.Newline();
}
AttackSpell.prototype.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.AddOutput("[tName] absorb[s] the spell, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.Newline();
}

Abilities.Black = {};

Abilities.Black.Surge = new AttackSpell();
Abilities.Black.Surge.name = "Surge";
Abilities.Black.Surge.Short = function() { return "Weak non-elemental magic, single target."; }
Abilities.Black.Surge.cost = { hp: null, sp: 5, lp: null};
Abilities.Black.Surge.atkMod = 0.5;
Abilities.Black.Surge.damageType.mVoid = 1;
Abilities.Black.Surge.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] call[s] on a surge of pure magical energy, brusting forth in a flash of light from [hisher] outstretched [hand]s. ", parse);
}

Abilities.Black.Fireball = new AttackSpell();
Abilities.Black.Fireball.name = "Fireball";
Abilities.Black.Fireball.Short = function() { return "Fire magic, single target."; }
Abilities.Black.Fireball.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Fireball.damageType.mFire = 1;
Abilities.Black.Fireball.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] make[s] mystic incantations, waving [hisher] [hand]s in the air. Fiery glyphs appear in front of [himher], coalascing in a large fireball forming between [hisher] outstretched [hand]s. With a great roar, the molten ball of magic surge towards [tName]! ", parse);
}
Abilities.Black.Fireball.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.AddOutput("[tName] absorb[s] the flames, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.Newline();
}
Abilities.Black.Fireball.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Burn(target, { hit : 0.2, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
		Text.AddOutput("[target] [has] been burned!", parse);
		Text.Newline();
	}
}

Abilities.Black.Freeze = new AttackSpell();
Abilities.Black.Freeze.name = "Freeze";
Abilities.Black.Freeze.Short = function() { return "Ice magic, single target."; }
Abilities.Black.Freeze.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Freeze.damageType.mIce = 1;
Abilities.Black.Freeze.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.nameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("The temperature drops in the air around [tName], as [name] call[s] on the power of ice. There is a loud crackle as the cold snap hits, forming icicles on [tName]! ", parse);
}
Abilities.Black.Freeze.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Freeze(target, { hit : 0.2, turns : 3, turnsR : 5, proc : 0.5, str : 1.2 })) {
		Text.AddOutput("[target] [has] been afflicted with freeze!", parse);
		Text.Newline();
	}
}

Abilities.Black.Bolt = new AttackSpell();
Abilities.Black.Bolt.name = "Bolt";
Abilities.Black.Bolt.Short = function() { return "Thunder magic, single target."; }
Abilities.Black.Bolt.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Bolt.damageType.mThunder = 1;
Abilities.Black.Bolt.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.nameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("The air tingles as [name] call[s] on the power of thunder. There is a great crackle and a blinding flash of light as a bolt of lightning strikes [tName]! ", parse);
}
Abilities.Black.Bolt.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.AddOutput("[tName] absorb[s] the shock, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.Newline();
}
Abilities.Black.Bolt.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has() };
	if(Status.Numb(target, { hit : 0.2, turns : 3, turnsR : 5, proc : 0.25 })) {
		Text.AddOutput("[target] [has] been afflicted with numb!", parse);
		Text.Newline();
	}
}

Abilities.Black.Gust = new AttackSpell();
Abilities.Black.Gust.name = "Gust";
Abilities.Black.Gust.Short = function() { return "Slashing wind magic, single target."; }
Abilities.Black.Gust.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Gust.damageType.mWind = 0.7;
Abilities.Black.Gust.damageType.mSlash = 0.3;
Abilities.Black.Gust.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] make[s] a sweeping gesture, calling on the power of wind to do [hisher] bidding. Erratic gusts of wind dance around, focusing into a single burst homing in on [tName]! ", parse);
}

Abilities.Black.Spire = new AttackSpell();
Abilities.Black.Spire.name = "Spire";
Abilities.Black.Spire.Short = function() { return "Bashing earth magic, single target."; }
Abilities.Black.Spire.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Spire.damageType.mEarth = 0.7;
Abilities.Black.Spire.damageType.mBlunt = 0.3;
Abilities.Black.Spire.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("There is a loud rumble as the ground shakes, forced from its natural state by the power of [possessive] magic. A pillar of rock bursts from the earth below, slamming into [tName]! ", parse);
}

Abilities.Black.Spray = new AttackSpell();
Abilities.Black.Spray.name = "Spray";
Abilities.Black.Spray.Short = function() { return "Water magic, single target."; }
Abilities.Black.Spray.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Spray.damageType.mWater = 1;
Abilities.Black.Spray.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("Moisture from the air coalesce into a sphere of water between [possessive] [hand]s, summoned by the power of [hisher] magic. In a rapid surge, the water slams into [tName]! ", parse);
}

Abilities.Black.Shimmer = new AttackSpell();
Abilities.Black.Shimmer.name = "Shimmer";
Abilities.Black.Shimmer.Short = function() { return "Light magic, single target."; }
Abilities.Black.Shimmer.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Shimmer.damageType.mLight = 1;
Abilities.Black.Shimmer.atkMod = 1.1;
Abilities.Black.Shimmer.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("A brilliant sphere of blinding light forms between [possessive] [hand]s, summoned by the power of [hisher] magic. At the uttering of a single word, it speeds towards [tName]! ", parse);
}

Abilities.Black.Shade = new AttackSpell();
Abilities.Black.Shade.name = "Shade";
Abilities.Black.Shade.Short = function() { return "Dark magic, single target."; }
Abilities.Black.Shade.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Shade.damageType.mDark = 1;
Abilities.Black.Shade.atkMod = 1.1;
Abilities.Black.Shade.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[Possessive] [hand]s are wreathed in shadow, summoned by the power of [hisher] dark magic. Quick as lightning, the shade darts across the ground, wrapping itself around [tName]! ", parse);
}

Abilities.Black.Thorn = new AttackSpell();
Abilities.Black.Thorn.name = "Thorn";
Abilities.Black.Thorn.Short = function() { return "Nature magic, single target."; }
Abilities.Black.Thorn.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Thorn.damageType.mNature = 1;
Abilities.Black.Thorn.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : target.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc(), skin : target.SkinDesc() };
	Text.AddOutput("[name] call[s] on the power of nature, summoning prickly vines that snake around [tName], the sharp thorns raking [hisher] [skin]! ", parse);
}

Abilities.Black.WindShear = new AttackSpell();
Abilities.Black.WindShear.name = "WindShear";
Abilities.Black.WindShear.Short = function() { return "Wind magic, single target."; }
Abilities.Black.WindShear.cost = { hp: null, sp: 65, lp: null};
Abilities.Black.WindShear.damageType.pSlash = 1;
Abilities.Black.WindShear.damageType.mWind = 1;
Abilities.Black.WindShear.atkMod = 1.1;
Abilities.Black.WindShear.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[Possessive] [hand]s weave back and forth, summoning a powerful gale of shreaking winds. A frenzy of cutting and slicing air surge towards [tName]! ", parse);
}

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
	Text.AddOutput("The earth rumble, as a large pillar of rock bursts from the ground, raised with [possessive] magic. The great stalagmite throws [tName] to the ground! ", parse);
}

Abilities.Black.Whirlwind = new AttackSpell();
Abilities.Black.Whirlwind.name = "Whirlwind";
Abilities.Black.Whirlwind.Short = function() { return "Wind magic, targets all enemies."; }
Abilities.Black.Whirlwind.targetMode = TargetMode.Enemies;
Abilities.Black.Whirlwind.cost = { hp: null, sp: 35, lp: null};
Abilities.Black.Whirlwind.damageType.mWind = 1;
Abilities.Black.Whirlwind.damageType.mSlash = 0.3;
Abilities.Black.Whirlwind.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[Possessive] [hand]s raise a large torrent of wind, throwing things every which way. The huge whirlwind envelops the opposing party, cutting and slashing! ", parse);
}

Abilities.Black.Eruption = new AttackSpell();
Abilities.Black.Eruption.name = "Eruption";
Abilities.Black.Eruption.Short = function() { return "Fire magic, targets all enemies."; }
Abilities.Black.Eruption.cost = { hp: null, sp: 30, lp: null};
Abilities.Black.Eruption.targetMode = TargetMode.Enemies;
Abilities.Black.Eruption.damageType.mFire = 1;
Abilities.Black.Eruption.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] summon[s] a wave of fire and smoke, boiling forth from the ground. The flames envelop the opposing party! ", parse);
}

Abilities.Black.Spread = new AttackSpell();
Abilities.Black.Spread.name = "Spread";
Abilities.Black.Spread.Short = function() { return "Water magic, targets all enemies."; }
Abilities.Black.Spread.cost = { hp: null, sp: 40, lp: null};
Abilities.Black.Spread.targetMode = TargetMode.Enemies;
Abilities.Black.Spread.damageType.mWater = 1.3;
Abilities.Black.Spread.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] summon[s] a wave of rushing water, sprouting forth from the ground. The great torrent sweeps over the opposing party! ", parse);
}

Abilities.Black.Shock = new AttackSpell();
Abilities.Black.Shock.name = "Shock";
Abilities.Black.Shock.Short = function() { return "Thunder magic, single target. Moderate chance of stunning the enemy."; }
Abilities.Black.Shock.cost = { hp: null, sp: 25, lp: null};
Abilities.Black.Shock.atkMod = 1.3;
Abilities.Black.Shock.damageType.mThunder = 1;
Abilities.Black.Shock.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.nameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("The air tingles as [name] call[s] on the power of thunder. There is a great crackle and a blinding flash of light as a surge of electricity flows through [tName]! ", parse);
}
Abilities.Black.Shock.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.AddOutput("[tName] absorb[s] the shock, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.Newline();
}
Abilities.Black.Shock.TargetEffect = function(encounter, caster, target) {
	if(Math.random() < 0.5) {
		for(var i = 0; i < encounter.combatOrder.length; i++) {
			if(encounter.combatOrder[i].entity == target)
				encounter.combatOrder[i].initiative -= 25;
		}
		Text.AddOutput("The shock slightly stuns [himher]!", {himher : target.himher()});
		Text.Newline();
	}
}

Abilities.Black.ThunderStorm = new AttackSpell();
Abilities.Black.ThunderStorm.name = "T.Storm";
Abilities.Black.ThunderStorm.Short = function() { return "Thunder magic, targets all enemies. Moderate chance of stunning the enemy."; }
Abilities.Black.ThunderStorm.cost = { hp: null, sp: 50, lp: null};
Abilities.Black.ThunderStorm.targetMode = TargetMode.Enemies;
Abilities.Black.ThunderStorm.atkMod = 1.3;
Abilities.Black.ThunderStorm.damageType.mThunder = 1;
Abilities.Black.ThunderStorm.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.nameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("The air tingles as [name] call[s] on the power of thunder. Great stormclouds gather, as nature unleashes an enormous amount of pent-up energy, enveloping the opposing party in a jagged cage of electricity!", parse);
}
Abilities.Black.ThunderStorm.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.AddOutput(" [tName] absorb[s] the shock, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.Newline();
}
Abilities.Black.ThunderStorm.TargetEffect = function(encounter, caster, target) {
	if(Math.random() < 0.5) {
		for(var i = 0; i < encounter.combatOrder.length; i++) {
			if(encounter.combatOrder[i].entity == target)
				encounter.combatOrder[i].initiative -= 25;
		}
		Text.AddOutput(" The shock slightly stuns [himher]!", {himher : target.himher()});
		Text.Newline();
	}
}


Abilities.Black.Venom = new AttackSpell();
Abilities.Black.Venom.name = "Venom";
Abilities.Black.Venom.Short = function() { return "Poisons single target."; }
Abilities.Black.Venom.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Venom.OnHit = null;
Abilities.Black.Venom.OnAbsorb = null;
Abilities.Black.Venom.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), target : target.nameDesc(), heshe : caster.heshe(), hand : caster.HandDesc() };
	Text.AddOutput("Toxic slime drips from [possessive] [hand]s as [heshe] points them towards [target]. ", parse);
}
Abilities.Black.Venom.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Venom(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
		Text.AddOutput("[target] [has] been poisoned! ", parse);
	}
	else {
		Text.AddOutput("[target] resist[s] the attack! ", parse);
	}
}


Abilities.Black.Ivy = new AttackSpell();
Abilities.Black.Ivy.name = "Ivy";
Abilities.Black.Ivy.Short = function() { return "Nature magic, targets all enemies."; }
Abilities.Black.Ivy.cost = { hp: null, sp: 40, lp: null};
Abilities.Black.Ivy.targetMode = TargetMode.Enemies;
Abilities.Black.Ivy.damageType.mWater = 1.3;
Abilities.Black.Ivy.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] summon[s] a mass of writhing thorn and ivy, sprouting forth from the ground to entangle the opposing party! ", parse);
}

Abilities.Black.Hellfire = new AttackSpell();
Abilities.Black.Hellfire.name = "Hellfire";
Abilities.Black.Hellfire.Short = function() { return "Demon magic, targets all enemies."; }
Abilities.Black.Hellfire.targetMode = TargetMode.Enemies;
Abilities.Black.Hellfire.cost = { hp: null, sp: 500, lp: null};
Abilities.Black.Hellfire.damageType.mFire = 3;
Abilities.Black.Hellfire.damageType.mFire = 3;
Abilities.Black.Hellfire.atkMod = 1.5;
Abilities.Black.Hellfire.OnCast = function(encounter, caster, target) {
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == caster)
			encounter.combatOrder[i].initiative -= 100;
	}
	
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s"};
	Text.AddOutput("[name] summons the most vile of magic, unleashing a sea of dark fire on [hisher] enemies! ", parse);
}
