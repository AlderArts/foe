/*
 * 
 * Healing
 * 
 */


Abilities.White = {};
Abilities.White._onHeal = function(ability, encounter, caster, target, dmg) {
	if(dmg <= 0) return;
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("It heals [tname] for " + Text.BoldColor(dmg, "#008000") + " damage!", parse);
	Text.NL();
}


Abilities.White.FirstAid = new Ability("First aid");
Abilities.White.FirstAid.Short = function() { return "Heals minor damage, single target."; }
Abilities.White.FirstAid.targetMode = TargetMode.Ally;
Abilities.White.FirstAid.cost = { hp: null, sp: 5, lp: null};
Abilities.White.FirstAid.castTree.push(AbilityNode.Template.Heal({
	atkMod: 1,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["skin"] = target.SkinDesc();
		Text.Add("[Name] prepare[notS] some soothing salves, gently applying it to [tposs] [skin] with [hisher] [hand]s.", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.White._onHeal]
}));


Abilities.White.Detox = new Ability("Detox");
Abilities.White.Detox.Short = function() { return "Heals minor venom, single target."; }
Abilities.White.Detox.targetMode = TargetMode.Ally;
Abilities.White.Detox.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Detox.castTree.push(function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	
	var venom = target.combatStatus.stats[StatusEffect.Venom];
	if(venom) {
		Text.Add("[Name] prepare[notS] a purifying spell, purging the venom from [tposs] body.", parse);
		venom.str -= 1;
		if(venom.str <= 0) {
			Text.NL();
			Text.Add("[tPoss] venom has been completely purged!", parse);
			target.combatStatus.stats[StatusEffect.Venom] = null;
		}
	}
	else {
		Text.Add("[Poss] purifying spell has no effect on [tname].", parse);
	}
});


Abilities.White.Cool = new Ability("Cool");
Abilities.White.Cool.Short = function() { return "Heals minor burn, single target."; }
Abilities.White.Cool.targetMode = TargetMode.Ally;
Abilities.White.Cool.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Cool.castTree.push(function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	
	var burn = target.combatStatus.stats[StatusEffect.Burn];
	if(burn) {
		Text.Add("[Name] prepare[notS] a soothing spell, easing the burning sensation from [tposs] body.", parse);
		burn.str -= 1;
		if(burn.str <= 0) {
			Text.NL();
			Text.Add("[tPoss] burn has been completely cooled!", parse);
			target.combatStatus.stats[StatusEffect.Burn] = null;
		}
	}
	else {
		Text.Add("[Poss] cooling spell has no effect on [tname].", parse);
	}
});


Abilities.White.Warm = new Ability("Warm");
Abilities.White.Warm.Short = function() { return "Heals minor freeze, single target."; }
Abilities.White.Warm.targetMode = TargetMode.Ally;
Abilities.White.Warm.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Warm.castTree.push(function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	
	var freeze = target.combatStatus.stats[StatusEffect.Freeze];
	if(freeze) {
		Text.Add("[Name] prepare[notS] a warming spell, heating up [tposs] frozen body.", parse);
		freeze.str -= 1;
		if(freeze.str <= 0) {
			Text.NL();
			Text.Add("[tPoss] freeze has been completely removed!", parse);
			target.combatStatus.stats[StatusEffect.Freeze] = null;
		}
	}
	else {
		Text.Add("[Poss] warming spell has no effect on [tname].", parse);
	}
});


Abilities.White.Heal = new Ability("Heal");
Abilities.White.Heal.Short = function() { return "Heals some damage, single target."; }
Abilities.White.Heal.targetMode = TargetMode.Ally;
Abilities.White.Heal.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Heal.castTree.push(AbilityNode.Template.Heal({
	atkMod: 1.5,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a healing spell, forming a sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[notS] the enchantment on [tname]", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.White._onHeal]
}));


Abilities.White.Recover = new Ability("Recover");
Abilities.White.Recover.Short = function() { return "Heals moderate damage, single target."; }
Abilities.White.Recover.targetMode = TargetMode.Ally;
Abilities.White.Recover.cost = { hp: null, sp: 30, lp: null};
Abilities.White.Recover.castTree.push(AbilityNode.Template.Heal({
	atkMod: 2,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] a powerful healing spell, forming a glowing sphere of soothing white magic between [hisher] [hand]s. [HeShe] cast[notS] the enchantment on [tname]", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.White._onHeal]
}));



// TODO: Flavor text, status effects
//TODO REPLACE
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

	Text.Add("[name] cheer[s] the party on, raising morale!", parse);
	Text.NL();
	
	for(var i = 0; i < target.members.length; i++) {
		var e = target.members[i];
		e.stamina.temp = Math.max(e.stamina.temp, caster.MAttack() / 5);
		e.spirit.temp = Math.max(e.spirit.temp, caster.MAttack() / 5);
	}
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


// TODO: Flavor text, status effects
//TODO REPLACE
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
	Text.Add("[name] cast[s] pinpoint on [tName], making them more limber!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


/*
 * TODO: Remake into a status effect?
 */
//TODO REPLACE
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
	Text.Add("[name] cast[s] toughen on [tName], protecting them from harm!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


/*
 * TODO: Remake into a status effect?
 */
//TODO REPLACE
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
	Text.Add("[name] cast[s] empower on [tName], filling them with strength!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


//TODO REPLACE
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
		
		Text.Add("[name] start[s] rambling about petty things in an attempt to distract [tName]. It seems to be working, [heshe] look[s] slightly annoyed! [name] drain[s] " + Text.BoldColor(dmg, "#000080") + " SP from [tName]!", parse);
	}
	else {
		Text.Add("[name] start[s] rambling about petty things, but [tName] doesn't look very impressed!", parse);
	}
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


//TODO REPLACE
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
		
		Text.Add("[name] start[s] preaching to [tName]. It seems to be working, [heshe] look[s2] slightly drowsy! [name] drain[s] " + Text.BoldColor(dmg, "#000080") + " SP from [tName]!", parse);
	}
	else {
		Text.Add("[name] start[s] preaching, but [tName] doesn't look very impressed!", parse);
	}
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


//TODO REPLACE
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
	
	Text.Add("[name] start[s] proselytizing to the enemy party. [HeShe] somehow manage[s] to sound extremely condensending, but immensly boring at the same time!", parse);

	for(var i = 0; i < target.length; i++) {
		var e = target[i];
		
		parse["s2"] = e.plural() ? "" : "s";
		parse["tName"] = e.nameDesc();
		parse["heshe"] = e.heshe();
		
		var def   = e.MDefense();
	
		//var dmg = atkDmg - def;
		var dmg = Ability.Damage(drain, def, caster.level, e.level);
		if(dmg < 0) dmg = 0;
		dmg = Math.floor(dmg);
	
		if(Math.random() < 0.75) {
			e.AddSPAbs(-dmg);
			
			Text.Add(" It seems to be working, [tName] look[s2] slightly annoyed! [name] drain[s] " + Text.BoldColor(dmg, "#000080") + " SP from [tName]!", parse);
		}
		else {
			Text.Add(" However, [tName] doesn't look very impressed!", parse);
		}
	}
	
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

