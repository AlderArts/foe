/*
 * 
 * Healing [temp]
 * 
 */
HealingSpell = function() {
	this.OnCast       = null;
	this.TargetEffect = null;
	this.targetMode   = TargetMode.Ally;
}
HealingSpell.prototype = new Ability();
HealingSpell.prototype.constructor = HealingSpell;

HealingSpell.prototype.CastInternal = function(encounter, caster, target) {
	var healMod    = this.healMod || 0;
	var targetMode = this.targetMode || TargetMode.Ally;
	
	if(this.OnCast)
		this.OnCast(encounter, caster, target);
	
	var targets;
	if(targetMode == TargetMode.Party)
		targets = target.members;
	else //(targetMode == TargetMode.Ally)
		targets = [target];
	
	for(var i = 0; i < targets.length; i++) {
		var e      = targets[i];

		var healing = healMod * caster.MAttack();
		if(healing < 0) healing = 0;
		healing = Math.floor(healing);
	
		target.AddHPAbs(healing);
		
		if(this.OnHit) this.OnHit(encounter, caster, e, healing);
		if(this.TargetEffect) this.TargetEffect(encounter, caster, e);
	}
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
HealingSpell.prototype.CastInternalOOC = function(encounter, caster, target) {
	var healMod    = this.healMod || 0;
	var targetMode = this.targetMode || TargetMode.Ally;
	
	if(this.OnCast)
		this.OnCast(encounter, caster, target);
	
	var targets;
	if(targetMode == TargetMode.Party)
		targets = target.members;
	else //(targetMode == TargetMode.Ally)
		targets = [target];
	
	for(var i = 0; i < targets.length; i++) {
		var e      = targets[i];

		var healing = healMod * caster.MAttack();
		if(healing < 0) healing = 0;
		healing = Math.floor(healing);
	
		target.AddHPAbs(healing);
		
		if(this.OnHit) this.OnHit(encounter, caster, e, healing);
		if(this.TargetEffect) this.TargetEffect(encounter, caster, e);
	}
	
	Gui.NextPrompt(ShowAbilities);
}
// Default messages
HealingSpell.prototype.OnHit = function(encounter, caster, target, dmg) {
	if(dmg <= 0) return;
	var parse = { tName : target.nameDesc() };
	Text.AddOutput("It heals [tName] for " + Text.BoldColor(dmg, "#008000") + " damage!", parse);
	Text.Newline();
}








Abilities.White = {};

Abilities.White.FirstAid = new HealingSpell();
Abilities.White.FirstAid.name = "First aid";
Abilities.White.FirstAid.Short = function() { return "Heals minor damage, single target."; }
Abilities.White.FirstAid.targetMode = TargetMode.Ally;
Abilities.White.FirstAid.cost = { hp: null, sp: 5, lp: null};
Abilities.White.FirstAid.healMod = 1;
Abilities.White.FirstAid.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), HeShe : caster.HeShe(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hand : caster.HandDesc(), tName : target.nameDesc(), y : caster.plural() ? "y" : "ies", possessive : target.possessive(), skin : target.SkinDesc()
	}
	Text.AddOutput("[name] prepare[s] some soothing salves, gently applying it to [possessive] [skin] with [hisher] [hand]s.", parse);
	Text.Newline();
}


Abilities.White.Heal = new HealingSpell();
Abilities.White.Heal.name = "Heal";
Abilities.White.Heal.Short = function() { return "Heals some damage, single target."; }
Abilities.White.Heal.targetMode = TargetMode.Ally;
Abilities.White.Heal.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Heal.healMod = 1.5;
Abilities.White.Heal.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), HeShe : caster.HeShe(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hand : caster.HandDesc(), tName : target.nameDesc(), y : caster.plural() ? "y" : "ies"
	}
	Text.AddOutput("[name] read[y] a healing spell, forming a sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[s] the enchantment on [tName]", parse);
	Text.Newline();
}


Abilities.White.Recover = new HealingSpell();
Abilities.White.Recover.name = "Recover";
Abilities.White.Recover.Short = function() { return "Heals moderate damage, single target."; }
Abilities.White.Recover.targetMode = TargetMode.Ally;
Abilities.White.Recover.cost = { hp: null, sp: 30, lp: null};
Abilities.White.Recover.healMod = 2;
Abilities.White.Recover.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), HeShe : caster.HeShe(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hand : caster.HandDesc(), tName : target.nameDesc(), y : caster.plural() ? "y" : "ies"
	}
	Text.AddOutput("[name] read[y] a powerful healing spell, forming a glowing sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[s] the enchantment on [tName]", parse);
	Text.Newline();
}


// TODO: Flavor text, status effects
Abilities.White.Cheer = new Ability();
Abilities.White.Cheer.name = "Cheer";
Abilities.White.Cheer.Short = function() { return "Boosts party morale, raising spirit and stamina slightly (doesn't stack)."; }
Abilities.White.Cheer.targetMode = TargetMode.Party;
Abilities.White.Cheer.cost = { hp: null, sp: 30, lp: null};
Abilities.White.Cheer.CastInternal = function(encounter, caster, target) {
	// TODO: Make more flavor text
	var parse = {
		name : caster.name
	}

	Text.AddOutput("[name] cheers the party on, raising morale!", parse);
	Text.Newline();
	
	for(var i = 0; i < target.members.length; i++) {
		var e = target.members[i];
		e.stamina.temp = Math.max(e.stamina.temp, caster.MAttack() / 5);
		e.spirit.temp = Math.max(e.spirit.temp, caster.MAttack() / 5);
	}
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.White.Springwind = new Ability();
Abilities.White.Springwind.name = "Springwind";
Abilities.White.Springwind.Short = function() { return "Summon the soothing winds to calm everyone's soul, raises spirit and stamina (doesn't stack)."; }
Abilities.White.Springwind.targetMode = TargetMode.Party;
Abilities.White.Springwind.cost = { hp: null, sp: 50, lp: null};
Abilities.White.Springwind.CastInternal = function(encounter, caster, target) {
	var parse = {
		name : caster.name
	}

	Text.AddOutput("[name] summon[s] the winds of spring. The calming wind soothes everyone!", parse);
	Text.Newline();
	
	for(var i = 0; i < target.members.length; i++) {
		var e = target.members[i];
		e.stamina.temp = Math.max(e.stamina.temp, caster.MAttack() / 3);
		e.spirit.temp = Math.max(e.spirit.temp, caster.MAttack() / 3);
	}
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

Abilities.White.Minos = new Ability();
Abilities.White.Minos.name = "Minotaur Sweat";
Abilities.White.Minos.Short = function() { return "Makes an ally drink a vial of minotaur sweat, increases strength and stamina and lust (doesn't stack)."; }
Abilities.White.Minos.targetMode = TargetMode.Ally;
Abilities.White.Minos.cost = { hp: null, sp: 40, lp: null};
Abilities.White.Minos.CastInternal = function(encounter, caster, target) {
	target.stamina.temp = Math.max(target.dexterity.temp, caster.MAttack() / 2.9);
	target.strength.temp = Math.max(target.dexterity.temp, caster.MAttack() / 3);
	target.libido.temp = Math.max(target.dexterity.temp, caster.MAttack() / 2);
	var parse = {
		name : caster.name,
		hisher : caster.hisher(),
		tName : target.name
	}

	// TODO: Make more flavor text
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };

	Text.AddOutput("[name] place[s] [hisher] hand in [hisher] pocket and reveal[s] a vial that has a picture of a minotaur on it (possibly taken from rosalin's stack of potions). [name] toss[es] the vial to [tName], [tName] look[s] at the vial then look[s] at [name] with a lifted eyebrow, [name] force[s] [tName] to drink the vial, [tName] drinks the vial, [tName] feels more powerful and more hornier!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


// TODO: Flavor text, status effects
Abilities.White.Pinpoint = new Ability();
Abilities.White.Pinpoint.name = "Pinpoint";
Abilities.White.Pinpoint.Short = function() { return "Buffs accuracy of one target (doesn't stack)."; }
Abilities.White.Pinpoint.targetMode = TargetMode.Ally;
Abilities.White.Pinpoint.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Pinpoint.CastInternal = function(encounter, caster, target) {
	target.dexterity.temp = Math.max(target.dexterity.temp, caster.MAttack() / 5);
	
	var parse = {
		name : caster.name,
		tName : target.name
	}

	// TODO: Make more flavor text
	Text.AddOutput("[name] cast[s] pinpoint on [tName], making them more limber!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

Abilities.White.Lavaarmor = new Ability();
Abilities.White.Lavaarmor.name = "Lava armor";
Abilities.White.Lavaarmor.Short = function() { return "Become engulfed with lava, increases ally strength (doesn't stack)."; }
Abilities.White.Lavaarmor.targetMode = TargetMode.Ally;
Abilities.White.Lavaarmor.cost = { hp: null, sp: 30, lp: null};
Abilities.White.Lavaarmor.CastInternal = function(encounter, caster, target) {
	target.strength.temp = Math.max(target.strength.temp, caster.MAttack() / 3);
	
	var parse = {
		name : caster.name,
		tName : target.name
	}
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };

	Text.AddOutput("A river of lava emerges from the ground and starts engulfing [tName], the lava then hardens and forms an armor around [tName]!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

/*
 * TODO: Remake into a status effect?
 */
Abilities.White.Toughen = new Ability();
Abilities.White.Toughen.name = "Toughen";
Abilities.White.Toughen.Short = function() { return "Buffs stamina of one target (doesn't stack)."; }
Abilities.White.Toughen.targetMode = TargetMode.Ally;
Abilities.White.Toughen.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Toughen.CastInternal = function(encounter, caster, target) {
	target.stamina.temp = Math.max(target.stamina.temp, caster.MAttack() / 5);
	
	var parse = {
		name : caster.name,
		tName : target.name
	}

	// TODO: Make more flavor text
	Text.AddOutput("[name] casts toughen on [tName], protecting them from harm!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.White.Charge = new Ability();
Abilities.White.Charge.name = "Charge";
Abilities.White.Charge.Short = function() { return "Recharge your ally's batteries, increase ally intelligence  (doesn't stack)."; }
Abilities.White.Charge.targetMode = TargetMode.Ally;
Abilities.White.Charge.cost = { hp: null, sp: 50, lp: null};
Abilities.White.Charge.CastInternal = function(encounter, caster, target) {
	target.intelligence.temp = Math.max(target.intelligence.temp, caster.MAttack() / 2);
	
	var parse = {
		name : caster.name,
		heshe : caster.heshe(),
		hisher : caster.hisher(),
		tName : target.name
	}
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };

	Text.AddOutput("[name] approach[es] [tName] and place[s] [hisher] hands on [tName]'s head, [name] release[s] a powerful electrical current through [hisher] hand to [tName]'s head, the shock increased [tName]'s brain activity, making them smarter!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.White.Bodyofwater = new Ability();
Abilities.White.Bodyofwater.name = "Body of water";
Abilities.White.Bodyofwater.Short = function() { return "Form a bubble around your ally to protect them, increases ally stamina (doesn't stack)."; }
Abilities.White.Bodyofwater.targetMode = TargetMode.Ally;
Abilities.White.Bodyofwater.cost = { hp: null, sp: 50, lp: null};
Abilities.White.Bodyofwater.CastInternal = function(encounter, caster, target) {
	target.stamina.temp = Math.max(target.stamina.temp, caster.MAttack() / 3);
	
	var parse = {
		name : caster.name,
		tName : target.name
	}
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };

	Text.AddOutput("Moisture starts gathering around [tName], slowly forming a protective bubble, protecting them from harm!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}



Abilities.White.Purify = new Ability();
Abilities.White.Purify.name = "Purify";
Abilities.White.Purify.Short = function() { return "Remove the doubts within your ally. Restore ally SP."; }
Abilities.White.Purify.targetMode = TargetMode.Ally;
Abilities.White.Purify.cost = { hp: null, sp: 200, lp: null};
Abilities.White.Purify.CastInternal = function(encounter, caster, target) {
	var restore = caster.MAttack() / 4
	if(restore < 0) restore = 0;
	restore = Math.floor(restore);
	
	var def   = target.MDefense();
	
	//var dmg = atkDmg - def;
	var dmg = this.Damage(restore, def, caster.level, target.level);
	if(dmg < 0) dmg = 0;
	dmg = Math.floor(dmg);

	var parse = {
		name  : caster.NameDesc(),
		s     : caster.plural() ? "" : "s",
		s2    : target.plural() ? "" : "s",
		tName : target.nameDesc(),
		hisher : target.hisher(),
		heshe : target.heshe()
	}

		Text.Newline();
	{	target.AddSPAbs(+dmg);
			var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", s : caster.plural() ? "" : "s", tName : target.nameDesc() };

		Text.AddOutput("A beam of light shines in the heavens, it pierces the clouds and descends upon [tName], [tName] doubts slowly fade away!, [tName] have restored" + Text.BoldColor(dmg, "#000080") + " SP!", parse);
	}
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
	}





/*
 * TODO: Remake into a status effect?
 */
Abilities.White.Empower = new Ability();
Abilities.White.Empower.name = "Empower";
Abilities.White.Empower.Short = function() { return "Buffs strength of one target (doesn't stack)."; }
Abilities.White.Empower.targetMode = TargetMode.Ally;
Abilities.White.Empower.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Empower.CastInternal = function(encounter, caster, target) {
	target.strength.temp = Math.max(target.strength.temp, caster.MAttack() / 5);
	
	var parse = {
		name : caster.name,
		tName : target.name
	}

	// TODO: Make more flavor text
	Text.AddOutput("[name] casts empower on [tName], filling them with strength!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.White.Tirade = new Ability();
Abilities.White.Tirade.name = "Tirade";
Abilities.White.Tirade.Short = function() { return "Attempt to bore the enemy with meaningless drivel. Drain enemy SP."; }
Abilities.White.Tirade.targetMode = TargetMode.Enemy;
Abilities.White.Tirade.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Tirade.CastInternal = function(encounter, caster, target) {
	var drain = caster.MAttack() / 3;
	if(drain < 0) drain = 0;
	drain = Math.floor(drain);
	
	var def   = target.MDefense();
	
	//var dmg = atkDmg - def;
	var dmg = this.Damage(drain, def, caster.level, target.level);
	if(dmg < 0) dmg = 0;
	dmg = Math.floor(dmg);

	var parse = {
		name  : caster.NameDesc(),
		s     : caster.plural() ? "" : "s",
		s2    : target.plural() ? "" : "s",
		tName : target.nameDesc(),
		heshe : target.heshe()
	}

	if(Math.random() < 0.5) {
		target.AddSPAbs(-dmg);
		
		Text.AddOutput("[name] start[s] rambling about petty things in an attempt to distract [tName]. It seems to be working, [heshe] look[s] slightly annoyed! [name] drain[s] " + Text.BoldColor(dmg, "#000080") + " SP from [tName]!", parse);
	}
	else {
		Text.AddOutput("[name] start[s] rambling about petty things, but [tName] doesn't look very impressed!", parse);
	}
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.White.Preach = new Ability();
Abilities.White.Preach.name = "Preach";
Abilities.White.Preach.Short = function() { return "Attempt to bore the enemy with pompous religious drivel. Drain enemy SP."; }
Abilities.White.Preach.targetMode = TargetMode.Enemy;
Abilities.White.Preach.cost = { hp: null, sp: 30, lp: null};
Abilities.White.Preach.CastInternal = function(encounter, caster, target) {
	var drain = caster.MAttack() / 2;
	if(drain < 0) drain = 0;
	drain = Math.floor(drain);
	
	var def   = target.MDefense();
	
	//var dmg = atkDmg - def;
	var dmg = this.Damage(drain, def, caster.level, target.level);
	if(dmg < 0) dmg = 0;
	dmg = Math.floor(dmg);

	var parse = {
		name  : caster.NameDesc(),
		s     : caster.plural() ? "" : "s",
		s2    : target.plural() ? "" : "s",
		tName : target.nameDesc(),
		heshe : target.heshe()
	}

	if(Math.random() < 0.75) {
		target.AddSPAbs(-dmg);
		
		Text.AddOutput("[name] start[s] preaching to [tName]. It seems to be working, [heshe] look[s2] slightly drowsy! [name] drain[s] " + Text.BoldColor(dmg, "#000080") + " SP from [tName]!", parse);
	}
	else {
		Text.AddOutput("[name] start[s] preaching, but [tName] doesn't look very impressed!", parse);
	}
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.White.Sermon = new Ability();
Abilities.White.Sermon.name = "Sermon";
Abilities.White.Sermon.Short = function() { return "Attempt to bore the enemy party with religious proselytizing. Drain enemy SP."; }
Abilities.White.Sermon.targetMode = TargetMode.Enemies;
Abilities.White.Sermon.cost = { hp: null, sp: 70, lp: null};
Abilities.White.Sermon.CastInternal = function(encounter, caster, target) {
	var drain = caster.MAttack();
	if(drain < 0) drain = 0;
	drain = Math.floor(drain);
	
	var parse = {
		name  : caster.NameDesc(),
		s     : caster.plural() ? "" : "s",
		HeShe : caster.HeShe()
	}
	
	Text.AddOutput("[name] start[s] proselytizing to the enemy party. [HeShe] somehow manage[s] to sound extremely condensing, but immensely boring at the same time!", parse);

	for(var i = 0; i < target.length; i++) {
		var e      = target[i];
		
		parse["s2"] = e.plural() ? "" : "s";
		parse["tName"] = e.nameDesc();
		parse["heshe"] = e.heshe();
		
		var def   = e.MDefense();
	
		//var dmg = atkDmg - def;
		var dmg = this.Damage(drain, def, caster.level, e.level);
		if(dmg < 0) dmg = 0;
		dmg = Math.floor(dmg);
	
		if(Math.random() < 0.75) {
			target.AddSPAbs(-dmg);
			
			Text.AddOutput(" It seems to be working, [tName] look[s2] slightly annoyed! [name] drain[s] " + Text.BoldColor(dmg, "#000080") + " SP from [tName]!", parse);
		}
		else {
			Text.AddOutput(" However, [tName] doesn't look very impressed!", parse);
		}
	}
	
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

