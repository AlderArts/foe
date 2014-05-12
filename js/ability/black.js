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
		var dmg = this.Damage(atkDmg, def, caster.level, e.level);
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

//I added Text.Newline() to all of the skills after text.addoutput to separate it from the onhit messages and to make reading the  
//text.addoutput easier to read 



// added Text.Newline()
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
					Text.Newline();

	}
	
//added force, a higher tier of non-element magic, also added Text.Newline()
Abilities.Black.Force = new AttackSpell();
Abilities.Black.Force.name = "Force";
Abilities.Black.Force.Short = function() { return "may the force be with you, single target."; }
Abilities.Black.Force.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Force.atkMod = 0.8;
Abilities.Black.Force.damageType.mVoid = 1;
Abilities.Black.Force.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), tName : target.nameDesc(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] gathers the surrounding magic causing it to engulf [hisher] in a body of pure magic, with great focus, [name] focuses the gathered energy towards [tName]!", parse);
    Text.Newline();
	}
	
//added negative space, a powerful void type magic, added next.newline()
Abilities.Black.NSpace = new AttackSpell();
Abilities.Black.NSpace.name = "Negative space";
Abilities.Black.NSpace.Short = function() { return "stop being so pessimistic, single target."; }
Abilities.Black.NSpace.cost = { hp: null, sp: 100, lp: null};
Abilities.Black.NSpace.atkMod = 1.7;
Abilities.Black.NSpace.damageType.mVoid = 1.2;
Abilities.Black.NSpace.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), tName : target.nameDesc(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] points [hisher] [hand] towards [tName] and forces particles to surround [tName], the particles gather around [tName] forming a bubble, [name] forms a fist and the bubble surrounding [tName] implodes!", parse);
    Text.Newline();
	}
	


	//added Text.Newline()
Abilities.Black.Fireball = new AttackSpell();
Abilities.Black.Fireball.name = "Fireball";
Abilities.Black.Fireball.Short = function() { return "Fire magic, single target."; }
Abilities.Black.Fireball.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Fireball.damageType.mFire = 1;
Abilities.Black.Fireball.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] make[s] mystic incantations, waving [hisher] [hand]s in the air. Fiery glyphs appear in front of [himher], coalascing in a large fireball forming between [hisher] outstretched [hand]s. With a great roar, the molten ball of magic surge towards [tName]! ", parse);
Text.Newline();

	}
Abilities.Black.Fireball.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.AddOutput("[tName] absorb[s] the flames, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.Newline();
}
Abilities.Black.Fireball.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Burn(target, { hit : 0.2, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
		Text.AddOutput("[target] [has] been burned! ", parse);
Text.Newline();

		}
}


//added Text.Newline()
Abilities.Black.Freeze = new AttackSpell();
Abilities.Black.Freeze.name = "Freeze";
Abilities.Black.Freeze.Short = function() { return "Ice magic, single target."; }
Abilities.Black.Freeze.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Freeze.damageType.mIce = 1;
Abilities.Black.Freeze.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.nameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("The temperature drops in the air around [tName], as [name] call[s] on the power of ice. There is a loud crackle as the cold snap hits, forming icicles on [tName]! ", parse);
Text.Newline();

	}
Abilities.Black.Freeze.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Freeze(target, { hit : 0.2, turns : 3, turnsR : 5, proc : 0.5, str : 1.2 })) {
		Text.AddOutput("[target] [has] been afflicted with freeze! ", parse);
Text.Newline();

		}
}

//added Text.Newline()
Abilities.Black.Bolt = new AttackSpell();
Abilities.Black.Bolt.name = "Bolt";
Abilities.Black.Bolt.Short = function() { return "Thunder magic, single target."; }
Abilities.Black.Bolt.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Bolt.damageType.mThunder = 1;
Abilities.Black.Bolt.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.nameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("The air tingles as [name] call[s] on the power of thunder. There is a great crackle and a blinding flash of light as a bolt of lightning strikes [tName]! ", parse);
Text.Newline();

	}
Abilities.Black.Bolt.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.AddOutput("[tName] absorb[s] the shock, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.Newline();
}
Abilities.Black.Bolt.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has() };
	if(Status.Freeze(target, { hit : 0.2, turns : 3, turnsR : 5, proc : 0.25 })) {
		Text.AddOutput("[target] [has] been afflicted with numb! ", parse);
Text.Newline();

		}
}

//added Text.Newline()
Abilities.Black.Gust = new AttackSpell();
Abilities.Black.Gust.name = "Gust";
Abilities.Black.Gust.Short = function() { return "Slashing wind magic, single target."; }
Abilities.Black.Gust.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Gust.damageType.mWind = 0.7;
Abilities.Black.Gust.damageType.mSlash = 0.3;
Abilities.Black.Gust.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] make[s] a sweeping gesture, calling on the power of wind to do [hisher] bidding. Erratic gusts of wind dance around, focusing into a single burst homing in on [tName]! ", parse);
Text.Newline();

	}

//added Text.Newline()
	Abilities.Black.Spire = new AttackSpell();
Abilities.Black.Spire.name = "Spire";
Abilities.Black.Spire.Short = function() { return "Bashing earth magic, single target."; }
Abilities.Black.Spire.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Spire.damageType.mEarth = 0.7;
Abilities.Black.Spire.damageType.mBlunt = 0.3;
Abilities.Black.Spire.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("There is a loud rumble as the ground shakes, forced from its natural state by the power of [possessive] magic. A pillar of rock bursts from the earth below, slamming into [tName]! ", parse);
Text.Newline();
	}


//added Text.Newline()	
Abilities.Black.Spray = new AttackSpell();
Abilities.Black.Spray.name = "Spray";
Abilities.Black.Spray.Short = function() { return "Water magic, single target."; }
Abilities.Black.Spray.cost = { hp: null, sp: 10, lp: null};
Abilities.Black.Spray.damageType.mWater = 1;
Abilities.Black.Spray.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("Moisture from the air coalesce into a sphere of water between [possessive] [hand]s, summoned by the power of [hisher] magic. In a rapid surge, the water slams into [tName]! ", parse);
Text.Newline();

	}

//added Text.Newline()	
Abilities.Black.Shimmer = new AttackSpell();
Abilities.Black.Shimmer.name = "Shimmer";
Abilities.Black.Shimmer.Short = function() { return "Light magic, single target."; }
Abilities.Black.Shimmer.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Shimmer.damageType.mLight = 1;
Abilities.Black.Shimmer.atkMod = 1.1;
Abilities.Black.Shimmer.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("A brilliant sphere of blinding light forms between [possessive] [hand]s, summoned by the power of [hisher] magic. At the uttering of a single word, it speeds towards [tName]! ", parse);
Text.Newline();

	}

	//added Text.Newline()
Abilities.Black.Glow = new AttackSpell();
Abilities.Black.Glow.name = "Glow";
Abilities.Black.Glow.Short = function() { return "A higher tier of light magic, single target."; }
Abilities.Black.Glow.cost = { hp: null, sp: 20, lp: null};
Abilities.Black.Glow.damageType.mLight = 1;
Abilities.Black.Glow.atkMod = 1.4;
Abilities.Black.Glow.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("A light starts forming in the heavens, summoned by the power of [hisher] magic. chanting a rhythmic verse, the blinding light hurdles towards [tName]! ", parse);
Text.Newline();
	}
Abilities.Black.Glow.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has() };
	if(Status.Freeze(target, { hit : 0.4, turns : 3, turnsR : 5, proc : 0.25 })) {
		Text.AddOutput("[target] [has] been blinded by the immense light! ", parse);
Text.Newline();
		}
}


//added Text.Newline()
Abilities.Black.Brightlight = new AttackSpell();
Abilities.Black.Brightlight.name = "Brightlight";
Abilities.Black.Brightlight.Short = function() { return "set the brightness to 100%, hits multiple targets."; }
Abilities.Black.Brightlight.targetMode = TargetMode.Enemies;
Abilities.Black.Brightlight.cost = { hp: null, sp: 55, lp: null};
Abilities.Black.Brightlight.damageType.mLight = 1;
Abilities.Black.Brightlight.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] slam your [hand]s on the ground causing a bright light to appear, blinding the opposing side, while your enemies are blinded, you start chanting and making hand gestures,light start gathering above the opposing side until it forms different shapes of swords, with a flick of your hand, the swords pierces the opposing side!", parse);
Text.Newline();
	}


	//added Text.Newline()
Abilities.Black.Angelshand = new AttackSpell();
Abilities.Black.Angelshand.name = "Angel's hand";
Abilities.Black.Angelshand.Short = function() { return "An angel descends to aid you, single target."; }
Abilities.Black.Angelshand.cost = { hp: null, sp: 90, lp: null};
Abilities.Black.Angelshand.damageType.mLight = 1;
Abilities.Black.Angelshand.atkMod = 1.8;
Abilities.Black.Angelshand.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] claps [hisher] hands together and starts praying, light shines upon [name], a body of light descends from the heavens, the body of light points to [tName], [tName]'s body is then shrouded in light, the body of light then utters eerie sounds, the light surrounding [tName] disappears, revealing that [tName] is heavily scared and burned. ", parse);
Text.Newline();
	}
Abilities.Black.Angelshand.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has() };
	if(Status.Freeze(target, { hit : 0.4, turns : 3, turnsR : 5, proc : 0.25 })) {
		Text.AddOutput("[target] [has] been blinded by the immense light! ", parse);
Text.Newline();
		}
}



// added Text.Newline()
Abilities.Black.Shade = new AttackSpell();
Abilities.Black.Shade.name = "Shade";
Abilities.Black.Shade.Short = function() { return "Dark magic, single target."; }
Abilities.Black.Shade.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Shade.damageType.mDark = 1;
Abilities.Black.Shade.atkMod = 1.1;
Abilities.Black.Shade.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[Possessive] [hand]s are wreathed in shadow, summoned by the power of [hisher] dark magic. Quick as lightning, the shade darts across the ground, wrapping itself around [tName]! ", parse);
Text.Newline();
	}


	//added Text.Newline()
Abilities.Black.Engulf = new AttackSpell();
Abilities.Black.Engulf.name = "Engulf";
Abilities.Black.Engulf.Short = function() { return "A higher tier of dark magic, single target."; }
Abilities.Black.Engulf.cost = { hp: null, sp: 25, lp: null};
Abilities.Black.Engulf.damageType.mDark = 1;
Abilities.Black.Engulf.atkMod = 1.4;
Abilities.Black.Engulf.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] starts performing large body movements and then kneels to the ground, in an instant, the entire area is shrouded with darkness, a tall body hovers close to [tName] and stabs [himher] in the back! ", parse);
Text.Newline();
	}

	//added Text.Newline()
Abilities.Black.Nightmare = new AttackSpell();
Abilities.Black.Nightmare.name = "Nightmare";
Abilities.Black.Nightmare.Short = function() { return "A tier of dark magic that resembles to demon magic, single target."; }
Abilities.Black.Nightmare.cost = { hp: null, sp: 50, lp: null};
Abilities.Black.Nightmare.damageType.mDark = 1;
Abilities.Black.Nightmare.atkMod = 1.7;
Abilities.Black.Nightmare.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("You start glaring [tName] intensely, you then left your [hand] towards [tName], [tName] starts losing their sight until [tName] is completely blind, [tName]'s eyes is now covered with dark matter, the dark matter slowly burrows into [tName]'s skull and dissolves [tName]'s brain. ", parse);
Text.Newline();
	}

//added Text.Newline()
Abilities.Black.Thorn = new AttackSpell();
Abilities.Black.Thorn.name = "Thorn";
Abilities.Black.Thorn.Short = function() { return "Nature magic, single target."; }
Abilities.Black.Thorn.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Thorn.damageType.mNature = 1;
Abilities.Black.Thorn.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : target.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc(), skin : target.SkinDesc() };
	Text.AddOutput("[name] call[s] on the power of nature, summoning prickly vines that snake around [tName], the sharp thorns raking [hisher] [skin]! ", parse);
Text.Newline();
	}

//added Text.Newline()
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
Text.Newline();
	}

//added Text.Newline()
Abilities.Black.Tornado = new AttackSpell();
Abilities.Black.Tornado.name = "Tornado";
Abilities.Black.Tornado.Short = function() { return "no cowgirls were harmed during the tornado, single target."; }
Abilities.Black.Tornado.cost = { hp: null, sp: 85, lp: null};
Abilities.Black.Tornado.damageType.pSlash = 1;
Abilities.Black.Tornado.damageType.mWind = 1;
Abilities.Black.Tornado.atkMod = 1.4;
Abilities.Black.Tornado.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] claps their handing together and starts blowing air into their hands, the howling of the winds can be heard from [name]'s hands, [name] pulls [hisher] hands back and throws onto [tName], the small, tiny wind instantly becomes a giant tornado hurdling toward [tName] and picks [himher] up, slashing [himher] endlessly.", parse);
Text.Newline();
	}

//added Text.Newline()
Abilities.Black.Hurricane = new AttackSpell();
Abilities.Black.Hurricane.name = "Hurricane";
Abilities.Black.Hurricane.Short = function() { return "A wind magic that sweeps you off your feet, single target."; }
Abilities.Black.Hurricane.cost = { hp: null, sp: 85, lp: null};
Abilities.Black.Hurricane.damageType.pSlash = 1;
Abilities.Black.Hurricane.damageType.mWind = 1;
Abilities.Black.Hurricane.atkMod = 1.3;
Abilities.Black.Hurricane.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[Possessive] pulls a strand of hair out of [hisher] head, blowing the strand into [Possessive]'s enemy, the flimsy strand of hair instantly becomes into ferocious shrieking winds that charge towards [tName], lifting them and slashing [tName] endlessly! ", parse);
Text.Newline();
	}

//added Text.Newline()
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
Text.Newline();
	}


//added back-up, a strong earth type attack, added text.newline()
Abilities.Black.Backup = new AttackSpell();
Abilities.Black.Backup.name = "Backup";
Abilities.Black.Backup.Short = function() { return "tag a random stone monster for assistance, single target."; }
Abilities.Black.Backup.cost = { hp: null, sp: 150, lp: null};
Abilities.Black.Backup.damageType.mEarth = 1.4;
Abilities.Black.Backup.atkMod = 1.6;
Abilities.Black.Backup.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] winds-up a big punch and charges to [tName], [name] punches [tName] but the punch had no effect on [tName], [tName] shrugs off the punch and [name] falls on [hisher] back, [name] crawls on [hisher] stomach while [tName] is chasing [himher], [name] raises [hisher] hand and summons a muscular humanoid-shaped stone, [name] tags the stone monster and it immediately attacks [tName] ", parse);
Text.Newline();
	}

	
	

//added Text.Newline()
Abilities.Black.CTitan = new AttackSpell();
Abilities.Black.CTitan.name = "Call a Titan";
Abilities.Black.CTitan.Short = function() { return "call a titan for assistance, no biggie, single target."; }
Abilities.Black.CTitan.cost = { hp: null, sp: 70, lp: null};
Abilities.Black.CTitan.damageType.mEarth = 1;
Abilities.Black.CTitan.atkMod = 1.8;
Abilities.Black.CTitan.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[possessive] grabs the soil beneath [himher], weaves ancient symbols to the soil then tosses it, the soil drifts with the passing winds and in the distance, an odd figure can be seen, as the mysterious figure approaches, each step causes an earth, it was a gigantic being wearing a skull mask, it approaches [tName] and lifts its enormous foot and stomps [tName], leaving a crater upon impact. ", parse);
Text.Newline();
	}


//added Text.Newline()
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
Text.Newline();
	}

//added Text.Newline()
Abilities.Black.Eruption = new AttackSpell();
Abilities.Black.Eruption.name = "Eruption";
Abilities.Black.Eruption.Short = function() { return "Fire magic, targets all enemies."; }
Abilities.Black.Eruption.cost = { hp: null, sp: 30, lp: null};
Abilities.Black.Eruption.targetMode = TargetMode.Enemies;
Abilities.Black.Eruption.damageType.mFire = 1;
Abilities.Black.Eruption.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] summon[s] a wave of fire and smoke, boiling forth from the ground. The flames envelop the opposing party! ", parse);
Text.Newline();
	}

//added Text.Newline() 
Abilities.Black.Spread = new AttackSpell();
Abilities.Black.Spread.name = "Spread";
Abilities.Black.Spread.Short = function() { return "Water magic, targets all enemies."; }
Abilities.Black.Spread.cost = { hp: null, sp: 40, lp: null};
Abilities.Black.Spread.targetMode = TargetMode.Enemies;
Abilities.Black.Spread.damageType.mWater = 1.3;
Abilities.Black.Spread.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] summon[s] a wave of rushing water, sprouting forth from the ground. The great torrent sweeps over the opposing party! ", parse);
Text.Newline();

	}


//added tsunami, a stronger water type magic, also added Text.Newline()
Abilities.Black.Tsunami = new AttackSpell();
Abilities.Black.Tsunami.name = "Tsunami";
Abilities.Black.Tsunami.Short = function() { return "hope you got your swimming shorts, targets all enemies."; }
Abilities.Black.Tsunami.cost = { hp: null, sp: 100, lp: null};
Abilities.Black.Tsunami.targetMode = TargetMode.Enemies;
Abilities.Black.Tsunami.damageType.mWater = 1.9;
Abilities.Black.Tsunami.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), hisher : caster.hisher(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] lefts [hisher] [hand]s in the air and starts performing a circling motion, from afar, you hear the sound of the rampaging tidal wave heading towards the opposing party, the tidal wave crashes into the opposing party with great force!", parse);
Text.Newline();
	}


//added Text.Newline() 
Abilities.Black.Shock = new AttackSpell();
Abilities.Black.Shock.name = "Shock";
Abilities.Black.Shock.Short = function() { return "Thunder magic, single target. Moderate chance of stunning the enemy."; }
Abilities.Black.Shock.cost = { hp: null, sp: 25, lp: null};
Abilities.Black.Shock.atkMod = 1.3;
Abilities.Black.Shock.damageType.mThunder = 1;
Abilities.Black.Shock.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.nameDesc(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("The air tingles as [name] call[s] on the power of thunder. There is a great crackle and a blinding flash of light as a surge of electricity flows through [tName]! ", parse);
Text.Newline();
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

//added Text.Newline()
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
Text.Newline();
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

//added text.newline()
Abilities.Black.Venom = new AttackSpell();
Abilities.Black.Venom.name = "Venom";
Abilities.Black.Venom.Short = function() { return "Poisons single target."; }
Abilities.Black.Venom.cost = { hp: null, sp: 15, lp: null};
Abilities.Black.Venom.OnHit = null;
Abilities.Black.Venom.OnAbsorb = null;
Abilities.Black.Venom.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(), target : target.nameDesc(), heshe : caster.heshe(), hand : caster.HandDesc() };
	Text.AddOutput("Toxic slime drips from [possessive] [hand]s as [heshe] points them towards [target]. ", parse);
Text.Newline();
	}
Abilities.Black.Venom.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Venom(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
		Text.AddOutput("[target] [has] been poisoned! ", parse);
Text.Newline();
		}
	else {
		Text.AddOutput("[target] resist[s] the attack! ", parse);
	Text.Newline();
	}
}





/*
Abilities.Black.Acidrain = new AttackSpell();
Abilities.Black.Acidrain.name = "Acidrain";
Abilities.Black.Acidrain.Short = function() { return "a rain of acid pours on all enemies."; }
Abilities.Black.Acidrain.cost = { hp: null, sp: 25, lp: null};
Abilities.Black.Acidrain.targetMode = TargetMode.Enemies;
Abilities.Black.Acidrain.OnHit = null;
Abilities.Black.Acidrain.OnAbsorb = null;
Abilities.Black.Acidrain.OnCast = function(encounter, caster, target) {
	var parse = { possessive : caster.possessive(),  heshe : caster.heshe(), hand : caster.HandDesc() };
	Text.AddOutput("[name] spit at [possessive] [hand]s and chants, [name] throws the spit and it becomes a large cloud, the cloud hovers over everyone and it rains acid.", parse);
					Text.Newline();
	}
Abilities.Black.Acidrain.TargetEffect = function(encounter, caster) {
	if(Status.Venom(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
		Text.AddOutput("everyone has been poisoned! ");
					Text.Newline();
		}
	else {
		Text.AddOutput("[target] withstood the attack! ", parse);
						Text.Newline();
	}
}
*/

// added text.newline()
Abilities.Black.Ivy = new AttackSpell();
Abilities.Black.Ivy.name = "Ivy";
Abilities.Black.Ivy.Short = function() { return "Nature magic, targets all enemies."; }
Abilities.Black.Ivy.cost = { hp: null, sp: 40, lp: null};
Abilities.Black.Ivy.targetMode = TargetMode.Enemies;
Abilities.Black.Ivy.damageType.mNature = 1.3;
Abilities.Black.Ivy.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] summon[s] a mass of writhing thorn and ivy, sprouting forth from the ground to entangle the opposing party! ", parse);
					Text.Newline();

	}


//added fallingmoon, a powerful dark magic, also added text.newline() 
Abilities.Black.Fallingmoon = new AttackSpell();
Abilities.Black.Fallingmoon.name = "Falling moon";
Abilities.Black.Fallingmoon.Short = function() { return "Its the end of the world as we know it, targets all enemies."; }
Abilities.Black.Fallingmoon.cost = { hp: null, sp: 400, lp: 100};
Abilities.Black.Fallingmoon.targetMode = TargetMode.Enemies;
Abilities.Black.Fallingmoon.damageType.mDark = 2.5;
Abilities.Black.Fallingmoon.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), hisher : caster.hisher(), heshe : caster.heshe(), himher : caster.himher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s" };
	Text.AddOutput("[name] throws [hisher] [hand]s in the air and utters a loud shriek that pierces the sound of [hisher] enemies, after a long silence, the sky's color slowly changes to blood red, a loud trembling sound can be heard, [name]'s enemies look up, the moon is hurdling toward earth!.......enough said.  ", parse);
					Text.Newline();

	}


//added text.newline()
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
					Text.Newline();

	}

//added amaterasu, the strongest light magic in the game, also added text.newline() 
Abilities.Black.Amaterasu = new AttackSpell();
Abilities.Black.Amaterasu.name = "Amaterasu";
Abilities.Black.Amaterasu.Short = function() { return "The strongest light magic of all, targets all enemies."; }
Abilities.Black.Amaterasu.targetMode = TargetMode.Enemies;
Abilities.Black.Amaterasu.cost = { hp: null, sp: 600, lp: null};
Abilities.Black.Amaterasu.damageType.mLight = 3;
Abilities.Black.Amaterasu.damageType.mLight = 3;
Abilities.Black.Amaterasu.atkMod = 3.5;
Abilities.Black.Amaterasu.OnCast = function(encounter, caster, target) {
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == caster)
			encounter.combatOrder[i].initiative -= 100;
	}
	
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s"};
	Text.AddOutput("[name] summons a small orb of light, the orb floats and digs into the ground, [name] performs a ritualistic dance and chants as the orb burrows into the ground, within a few moment, the ground trembles as beams of light start piercing it until a wall of light surrounds [name]'s enemies. In a blink of an eye, the wall forms into a giant sphere and collapse onto [name]'s enemies ! ", parse);
					Text.Newline();

	
	}

// added tsukuyomi, the strongest dark type magic, also added text.newline()
Abilities.Black.Tsukuyomi = new AttackSpell();
Abilities.Black.Tsukuyomi.name = "Tsukuyomi";
Abilities.Black.Tsukuyomi.Short = function() { return "The strongest dark magic of all, targets all enemies."; }
Abilities.Black.Tsukuyomi.targetMode = TargetMode.Enemies;
Abilities.Black.Tsukuyomi.cost = { hp: 50, sp: 650, lp: null};
Abilities.Black.Tsukuyomi.damageType.mDark = 3;
Abilities.Black.Tsukuyomi.damageType.mDark = 3;
Abilities.Black.Tsukuyomi.atkMod = 3.7;
Abilities.Black.Tsukuyomi.OnCast = function(encounter, caster, target) {
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == caster)
			encounter.combatOrder[i].initiative -= 85;
	}
	
	var parse = { possessive : caster.possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), hand : caster.HandDesc(), s : caster.plural() ? "" : "s"};
	Text.AddOutput("[name] cuts [hisher] wrist causing it to drip blood, [name] uses the blood dripping from [hisher] wrist to weave symbols as [heshe] chants an ancient language verse, the symbols materialize and conjoin together to form a black orb, tentacles emerge from the black orb and latch onto [name]'s enemies, dragging them into the black orb, crushing them ", parse);
					Text.Newline();

					}
