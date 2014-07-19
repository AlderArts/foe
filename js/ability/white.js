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


Abilities.White.Detox = new Ability();
Abilities.White.Detox.name = "Detox";
Abilities.White.Detox.Short = function() { return "Heals minor venom, single target."; }
Abilities.White.Detox.targetMode = TargetMode.Ally;
Abilities.White.Detox.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Detox.CastInternal = function(encounter, caster, target) {
	var parse = { Name : caster.NameDesc(), s : caster.plural() ? "" : "s", tname : target.nameDesc(), Possessive : caster.Possessive(), tPossessive : target.Possessive(), tpossessive : target.possessive()
	}
	
	var venom = target.combatStatus.stats[StatusEffect.Venom];
	if(venom) {
		Text.Add("[Name] prepare[s] a purifying spell, purging the venom from [tpossessive] body.", parse);
		venom.str -= 1;
		if(venom.str <= 0) {
			Text.NL();
			Text.Add("[tPossessive] venom has been completely purged!", parse);
			target.combatStatus.stats[StatusEffect.Venom] = null;
		}
	}
	else {
		Text.Add("[Possessive] purifying spell has no effect on [tname].", parse);
	}
	
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

Abilities.White.Cool = new Ability();
Abilities.White.Cool.name = "Cool";
Abilities.White.Cool.Short = function() { return "Heals minor burn, single target."; }
Abilities.White.Cool.targetMode = TargetMode.Ally;
Abilities.White.Cool.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Cool.CastInternal = function(encounter, caster, target) {
	var parse = { Name : caster.NameDesc(), s : caster.plural() ? "" : "s", tname : target.nameDesc(), Possessive : caster.Possessive(), tPossessive : target.Possessive(), tpossessive : target.possessive()
	}
	
	var burn = target.combatStatus.stats[StatusEffect.Burn];
	if(burn) {
		Text.Add("[Name] prepare[s] a soothing spell, easing the burning sensation from [tpossessive] body.", parse);
		burn.str -= 1;
		if(burn.str <= 0) {
			Text.NL();
			Text.Add("[tPossessive] burn has been completely cooled!", parse);
			target.combatStatus.stats[StatusEffect.Burn] = null;
		}
	}
	else {
		Text.Add("[Possessive] cooling spell has no effect on [tname].", parse);
	}
	
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

Abilities.White.Warm = new Ability();
Abilities.White.Warm.name = "Warm";
Abilities.White.Warm.Short = function() { return "Heals minor freeze, single target."; }
Abilities.White.Warm.targetMode = TargetMode.Ally;
Abilities.White.Warm.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Warm.CastInternal = function(encounter, caster, target) {
	var parse = { Name : caster.NameDesc(), s : caster.plural() ? "" : "s", tname : target.nameDesc(), Possessive : caster.Possessive(), tPossessive : target.Possessive(), tpossessive : target.possessive()
	}
	
	var freeze = target.combatStatus.stats[StatusEffect.Freeze];
	if(freeze) {
		Text.Add("[Name] prepare[s] a warming spell, heating up [tpossessive] frozen body.", parse);
		freeze.str -= 1;
		if(freeze.str <= 0) {
			Text.NL();
			Text.Add("[tPossessive] freeze has been completely removed!", parse);
			target.combatStatus.stats[StatusEffect.Freeze] = null;
		}
	}
	else {
		Text.Add("[Possessive] warming spell has no effect on [tname].", parse);
	}
	
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
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
		name : caster.name,
		s : caster.plural() ? "" : "s"
	}

	Text.AddOutput("[name] cheer[s] the party on, raising morale!", parse);
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
		tName : target.name,
		s : caster.plural() ? "" : "s"
	}

	// TODO: Make more flavor text
	Text.AddOutput("[name] cast[s] pinpoint on [tName], making them more limber!", parse);
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
		tName : target.name,
		s : caster.plural() ? "" : "s"
	}

	// TODO: Make more flavor text
	Text.AddOutput("[name] cast[s] toughen on [tName], protecting them from harm!", parse);
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
		tName : target.name,
		s : caster.plural() ? "" : "s"
	}

	// TODO: Make more flavor text
	Text.AddOutput("[name] cast[s] empower on [tName], filling them with strength!", parse);
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
	var dmg = Ability.Damage(drain, def, caster.level, target.level);
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
	var dmg = Ability.Damage(drain, def, caster.level, target.level);
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
	
	Text.AddOutput("[name] start[s] proselytizing to the enemy party. [HeShe] somehow manage[s] to sound extremely condensending, but immensly boring at the same time!", parse);

	for(var i = 0; i < target.length; i++) {
		var e      = target[i];
		
		parse["s2"] = e.plural() ? "" : "s";
		parse["tName"] = e.nameDesc();
		parse["heshe"] = e.heshe();
		
		var def   = e.MDefense();
	
		//var dmg = atkDmg - def;
		var dmg = Ability.Damage(drain, def, caster.level, e.level);
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

