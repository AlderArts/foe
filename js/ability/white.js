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


Abilities.White.Tirade = new Ability("Tirade");
Abilities.White.Tirade.name = "Tirade";
Abilities.White.Tirade.Short = function() { return "Attempt to bore the enemy with meaningless drivel. Drain enemy SP."; }
Abilities.White.Tirade.cost = { hp: null, sp: 10, lp: null};
Abilities.White.Tirade.cooldown = 1;
Abilities.White.Tirade._onMiss = function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(null, target);
	Text.Add(", but [tname] [tis]n't very impressed!", parse);
}
Abilities.White.Tirade.castTree.push(AbilityNode.Template.Magical({
	hitMod: 0.7,
	atkMod: 0.5,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] start[notS] rambling about petty things", parse);
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add(" in an attempt to distract [tname]. It seems to be working, [theshe] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.BoldColor(-dmg, "#000080") + " SP from [tname]!", parse);
	}],
	onAbsorb: [Abilities.White.Tirade._onMiss],
	onMiss: [Abilities.White.Tirade._onMiss]
}));


Abilities.White.Preach = new Ability("Preach");
Abilities.White.Preach.Short = function() { return "Attempt to bore the enemy with pompous religious drivel. Drain enemy SP."; }
Abilities.White.Preach.cost = { hp: null, sp: 20, lp: null};
Abilities.White.Preach.cooldown = 2;
Abilities.White.Preach._onMiss = function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(null, target);
	Text.Add("However, [tname] [tis]n't very impressed!", parse);
	Text.NL();
}
Abilities.White.Preach.castTree.push(AbilityNode.Template.Magical({
	hitMod: 1,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] start[notS] preaching to [tname]. ", parse);
		Text.NL();
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("It seems to be working, [tname] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.BoldColor(-dmg, "#000080") + " SP from [tname]!", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.White.Preach._onMiss],
	onMiss: [Abilities.White.Preach._onMiss]
}));


Abilities.White.Sermon = new Ability("Sermon");
Abilities.White.Sermon.Short = function() { return "Attempt to bore the enemy party with religious proselytizing. Drain enemy SP."; }
Abilities.White.Sermon.targetMode = TargetMode.Enemies;
Abilities.White.Sermon.cost = { hp: null, sp: 50, lp: null};
Abilities.White.Sermon.cooldown = 3;
Abilities.White.Sermon.castTree.push(AbilityNode.Template.Magical({
	hitMod: 1,
	damageFunc: AbilityNode.DamageFunc.Magical,
	damageType: {mVoid: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		Text.Add("[Name] start[notS] proselytizing to the enemy party. [HeShe] somehow manage[notS] to sound extremely condensending, but immensly boring at the same time!", parse);
		Text.NL();
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("It seems to be working, [tname] look[tnotS] slightly annoyed! [Name] drain[notS] " + Text.BoldColor(-dmg, "#000080") + " SP from [tname]!", parse);
		Text.NL();
	}],
	onAbsorb: [Abilities.White.Preach._onMiss],
	onMiss: [Abilities.White.Preach._onMiss]
}));
