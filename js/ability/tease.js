

/*
 * 
 * Basic tease
 * 
 */
Abilities.Seduction.Tease = new Ability("Tease");
Abilities.Seduction.Tease.Short = function() { return "Raises the lust of target."; }
Abilities.Seduction.Tease.castTree.push(AbilityNode.Template.Lust({
	atkMod: 0.5,
	damageType: {lust: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["hips"] = caster.HipsDesc();
		Text.Add("[Name] tease[notS] [tname], shaking [hisher] [hips]! ", parse);
	}],
	onMiss: [Abilities.Seduction._onMiss],
	onDamage: [Abilities.Seduction._onDamage],
	onAbsorb: [Abilities.Seduction._onAbsorb]
}));


Abilities.Seduction.Seduce = new Ability("Seduce");
Abilities.Seduction.Seduce.Short = function() { return "Raises the lust of target."; }
Abilities.Seduction.Seduce.cost = { hp: null, sp: 10, lp: 10};
Abilities.Seduction.Seduce.castTree.push(AbilityNode.Template.Lust({
	atkMod: 1,
	damageType: {lust: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["hips"] = caster.HipsDesc();
		Text.Add("[Name] tease[notS] [tname], shaking [hisher] [hips]! ", parse);
	}],
	onMiss: [Abilities.Seduction._onMiss],
	onDamage: [Abilities.Seduction._onDamage],
	onAbsorb: [Abilities.Seduction._onAbsorb]
}));


Abilities.Seduction.StripTease = new Ability("StripTease");
Abilities.Seduction.StripTease.Short = function() { return "Raises the lust of enemy party."; }
Abilities.Seduction.StripTease.cost = { hp: null, sp: 40, lp: 40};
Abilities.Seduction.StripTease.cooldown = 2;
Abilities.Seduction.StripTease.targetMode = TargetMode.Enemies;
Abilities.Seduction.StripTease.castTree.push(AbilityNode.Template.Lust({
	atkMod: 1.5,
	damageType: {lust: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster);
		parse["hips"] = caster.HipsDesc();
		Text.Add("[Name] tease[notS] the enemy party, shaking [hisher] [hips]! ", parse);
	}],
	onMiss: [Abilities.Seduction._onMiss],
	onDamage: [Abilities.Seduction._onDamage],
	onAbsorb: [Abilities.Seduction._onAbsorb]
}));


Abilities.Seduction.Distract = new Ability("Distract");
Abilities.Seduction.Distract.Short = function() { return "Raise enemy lust and lower their initiative."; }
Abilities.Seduction.Distract.cost = { hp: null, sp: 10, lp: 20};
Abilities.Seduction.Distract.cooldown = 1;
Abilities.Seduction.Distract.castTree.push(AbilityNode.Template.Lust({
	atkMod: 0.8,
	damageType: {lust: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["hips"] = caster.HipsDesc();
		Text.Add("[Name] distract[notS] [tname], shaking [hisher] [hips]! ", parse);
	}],
	onMiss: [Abilities.Seduction._onMiss],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		target.GetCombatEntry(encounter).initiative -= 25;
		var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] become[tnotS] aroused, gaining " + Text.Lust(-dmg) + " lust! [tHeShe] become[tnotS] distracted.", parse);
	}],
	onAbsorb: [Abilities.Seduction._onAbsorb]
}));


Abilities.Seduction.Charm = new Ability("Charm");
Abilities.Seduction.Charm.Short = function() { return "Try to dissuade the enemy from attacking you."; }
Abilities.Seduction.Charm.cost = { hp: null, sp: 10, lp: 10};
Abilities.Seduction.Charm.cooldown = 1;
Abilities.Seduction.Charm.castTree.push(AbilityNode.Template.Lust({
	atkMod: 0.3,
	damageType: {lust: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["hips"] = caster.HipsDesc();
		Text.Add("[Name] charm[notS] [tname], shaking [hisher] [hips]! ", parse);
	}],
	onMiss: [Abilities.Seduction._onMiss],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var aggroEntry = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if(aggroEntry) {
			aggroEntry.aggro -= 0.4;
			if(aggroEntry.aggro < 0) aggroEntry.aggro = 0;
		}	
		var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] become[tnotS] charmed, gaining " + Text.Lust(-dmg) + " lust! [tHeShe] become[tnotS] less aggressive toward [name].", parse);
	}],
	onAbsorb: [Abilities.Seduction._onAbsorb]
}));


Abilities.Seduction.Allure = new Ability("Allure");
Abilities.Seduction.Allure.Short = function() { return "Try to dissuade the enemy from attacking you."; }
Abilities.Seduction.Allure.cost = { hp: null, sp: 30, lp: 60};
Abilities.Seduction.Allure.cooldown = 2;
Abilities.Seduction.Allure.castTree.push(AbilityNode.Template.Lust({
	damageType: {lust: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		parse["hips"] = caster.HipsDesc();
		Text.Add("[Name] charm[notS] [tname], shaking [hisher] [hips]! ", parse);
	}],
	onMiss: [Abilities.Seduction._onMiss],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var aggroEntry = GetAggroEntry(target.GetCombatEntry(encounter), caster);
		if(aggroEntry) {
			aggroEntry.aggro -= 0.8;
			if(aggroEntry.aggro < 0) aggroEntry.aggro = 0;
		}	
		var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] become[tnotS] charmed, gaining " + Text.Lust(-dmg) + " lust! [tHeShe] become[tnotS] less aggressive toward [name].", parse);
	}],
	onAbsorb: [Abilities.Seduction._onAbsorb]
}));


Abilities.Seduction.Inflame = new Ability("Inflame");
Abilities.Seduction.Inflame.Short = function() { return "Greatly arouse the passions of a single foe with the power of song."; }
Abilities.Seduction.Inflame.cost = { hp: null, sp: null, lp: 25};
Abilities.Seduction.Inflame.castTree.push(AbilityNode.Template.Lust({
	atkMod: 2,
	damageType: {lust: 1},
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] slowly sing[notS] a few verses of a soft, sensual melody, projecting [hisher] rich voice at [tname]. ", parse);
	}],
	onMiss: [Abilities.Seduction._onMiss],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] squirm[tnotS] at the subtle undertones of the song, becoming greatly aroused. [tName] gain[tnotS] " + Text.Lust(-dmg) + " lust!", parse);
	}],
	onAbsorb: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] manage[tnotS] to shake off the desire-inducing effects of [poss] voice.", parse);
	}]
}));

