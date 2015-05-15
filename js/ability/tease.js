

/*
 * 
 * Basic tease
 * 
 */
//TODO REMOVE
TeaseSkill = function() {
	this.damageType   = { lust : 1 };
	this.targetMode   = TargetMode.Enemy;
	
	this.OnCast       = null;
	this.TargetEffect = null;
}
TeaseSkill.prototype = new Ability();
TeaseSkill.prototype.constructor = TeaseSkill;

TeaseSkill.prototype.CastInternal = function(encounter, caster, target) {
	var atkMod     = this.atkMod || 1;
	var defMod     = this.defMod || 1;
	var hitMod     = this.atkMod || 1;
	var nrAttacks  = this.nrAttacks || 1;
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
		
		for(var j = 0; j < nrAttacks; j++) {
			var atkDmg = atkMod * caster.LAttack();
			var def    = defMod * e.LDefense();
			var hit    = hitMod * caster.LHit();
			var evade  = e.LEvade();
			var toHit  = Ability.ToHit(hit, evade);
			
			if(Math.random() < toHit) {
				//var dmg = atkDmg - def;
				var dmg = Ability.Damage(atkDmg, def, caster.level, e.level);
				if(dmg < 0) dmg = 0;
				
				dmg = damageType.ApplyDmgType(e.elementDef, dmg);
				dmg = Math.floor(dmg);
			
				e.AddLustAbs(dmg);
				
				if(dmg >= 0) {
					if(this.OnHit) this.OnHit(encounter, caster, e, dmg);
				}
				else {
					if(this.OnAbsorb) this.OnAbsorb(encounter, caster, e, -dmg);
				}
				if(this.TargetEffect) this.TargetEffect(encounter, caster, e);
			}
			else
				if(this.OnMiss) this.OnMiss(encounter, caster, e);
		}
	}
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
// Default messages
TeaseSkill.prototype.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.Add("[tName] become[s] aroused, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust!", parse);
	Text.NL();
}
TeaseSkill.prototype.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", is : target.is() };
	Text.Add("[tName] [is] turned off, losing " + Text.BoldColor(dmg, "#000060") + " lust!", parse);
	Text.NL();
}
TeaseSkill.prototype.OnMiss = function(encounter, caster, target) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s"};
	Text.Add("[tName] manage[s] to resist the temptation!", parse);
	Text.NL();
}


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


//TODO REPLACE
Abilities.Seduction.Distract = new TeaseSkill();
Abilities.Seduction.Distract.name = "Distract";
Abilities.Seduction.Distract.Short = function() { return "Raise enemy lust and lower their initiative."; }
Abilities.Seduction.Distract.cost = { hp: null, sp: 10, lp: 20};
Abilities.Seduction.Distract.atkMod = 0.8;
Abilities.Seduction.Distract.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.Add("[name] distract[s] [tName], shaking [hisher] [hipsDesc]! ", parse);
}
Abilities.Seduction.Distract.OnHit = function(encounter, caster, target, dmg) {
	target.GetCombatEntry().initiative -= 25;
	
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe() };
	Text.Add("[tName] become[s] aroused, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust! [HeShe] become[s] distracted.", parse);
	Text.NL();
}


//TODO REPLACE
Abilities.Seduction.Charm = new TeaseSkill();
Abilities.Seduction.Charm.name = "Charm";
Abilities.Seduction.Charm.Short = function() { return "Try to dissuade the enemy from attacking you."; }
Abilities.Seduction.Charm.cost = { hp: null, sp: 10, lp: 10};
Abilities.Seduction.Charm.atkMod = 0.3;
Abilities.Seduction.Charm.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.Add("[name] charm[s] [tName], shaking [hisher] [hipsDesc]! ", parse);
}
Abilities.Seduction.Charm.OnHit = function(encounter, caster, target, dmg) {
	var aggroEntry = GetAggroEntry(target.GetCombatEntry(), caster);
	if(aggroEntry) {
		aggroEntry.aggro -= 0.4;
		if(aggroEntry.aggro < 0) aggroEntry.aggro = 0;
	}
	
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.Add("[tName] become[s] charmed, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust! [HeShe] become[s] less aggressive toward [name].", parse);
	Text.NL();
}


//TODO REPLACE
Abilities.Seduction.Allure = new TeaseSkill();
Abilities.Seduction.Allure.name = "Allure";
Abilities.Seduction.Allure.Short = function() { return "Try to dissuade the enemy from attacking you."; }
Abilities.Seduction.Allure.cost = { hp: null, sp: 30, lp: 60};
Abilities.Seduction.Allure.atkMod = 1;
Abilities.Seduction.Allure.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.Add("[name] charm[s] [tName], shaking [hisher] [hipsDesc]! ", parse);
}
Abilities.Seduction.Allure.OnHit = function(encounter, caster, target, dmg) {
	var aggroEntry = GetAggroEntry(target.GetCombatEntry(), caster);
	if(aggroEntry) {
		aggroEntry.aggro -= 0.8;
		if(aggroEntry.aggro < 0) aggroEntry.aggro = 0;
	}
	
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.Add("[tName] become[s] charmed, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust! [HeShe] become[s] less aggressive toward [name].", parse);
	Text.NL();
}


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
		Text.Add("[tName] squirm[tnotS] at the subtle undertones of the song, becoming greatly aroused. [tName] gain[tnotS] " + Text.BoldColor(-dmg, "#FF8080") + " lust!", parse);
	}],
	onAbsorb: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] manage[tnotS] to shake off the desire-inducing effects of [poss] voice.", parse);
	}]
}));

