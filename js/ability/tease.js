

/*
 * 
 * Basic tease
 * 
 */
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
		var atkDmg = atkMod * caster.LAttack();
		var def    = defMod * e.LDefense();
		
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


Abilities.Seduction.Tease = new TeaseSkill();
Abilities.Seduction.Tease.name = "Tease";
Abilities.Seduction.Tease.Short = function() { return "Raises the lust of target."; }
Abilities.Seduction.Tease.atkMod = 0.5;
Abilities.Seduction.Tease.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.Add("[name] tease[s] [tName], shaking [hisher] [hipsDesc]! ", parse);
}


Abilities.Seduction.Seduce = new TeaseSkill();
Abilities.Seduction.Seduce.name = "Seduce";
Abilities.Seduction.Seduce.cost = { hp: null, sp: 10, lp: 10};
Abilities.Seduction.Seduce.Short = function() { return "Raises the lust of target."; }
Abilities.Seduction.Seduce.atkMod = 1;
Abilities.Seduction.Seduce.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.Add("[name] tease[s] [tName], shaking [hisher] [hipsDesc]! ", parse);
}


Abilities.Seduction.StripTease = new TeaseSkill();
Abilities.Seduction.StripTease.name = "StripTease";
Abilities.Seduction.StripTease.Short = function() { return "Raises the lust of enemy party."; }
Abilities.Seduction.StripTease.cost = { hp: null, sp: 50, lp: 50};
Abilities.Seduction.StripTease.atkMod = 1.5;
Abilities.Seduction.StripTease.targetMode = TargetMode.Enemies;
Abilities.Seduction.StripTease.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.Add("[name] tease[s] the enemy party, shaking [hisher] [hipsDesc]! ", parse);
}


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
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == target)
			encounter.combatOrder[i].initiative -= 25;
	}
	
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe() };
	Text.Add("[tName] become[s] aroused, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust! [HeShe] become[s] distracted.", parse);
	Text.NL();
}


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
	var activeChar;
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == target)
			activeChar = encounter.combatOrder[i];
	}
	var aggroEntry = GetAggroEntry(activeChar, caster);
	if(aggroEntry) {
		aggroEntry.aggro -= 0.4;
		if(aggroEntry.aggro < 0) aggroEntry.aggro = 0;
	}
	
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.Add("[tName] become[s] charmed, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust! [HeShe] become[s] less aggressive toward [name].", parse);
	Text.NL();
}


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
	var activeChar;
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == target)
			activeChar = encounter.combatOrder[i];
	}
	var aggroEntry = GetAggroEntry(activeChar, caster);
	if(aggroEntry) {
		aggroEntry.aggro -= 0.8;
		if(aggroEntry.aggro < 0) aggroEntry.aggro = 0;
	}
	
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe(), name : caster.nameDesc() };
	Text.Add("[tName] become[s] charmed, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust! [HeShe] become[s] less aggressive toward [name].", parse);
	Text.NL();
}


Abilities.Seduction.Inflame = new TeaseSkill();
Abilities.Seduction.Inflame.name = "Inflame";
Abilities.Seduction.Inflame.cost = { hp: null, sp: null, lp: 25};
Abilities.Seduction.Inflame.Short = function() { return "Greatly arouse the passions of a single foe with the power of song."; }
Abilities.Seduction.Inflame.atkMod = 2;
Abilities.Seduction.Inflame.OnCast = function(encounter, caster, target) {
	var parse = { Name: caster.NameDesc(), s: caster.plural() ? "" : "s", hisher: caster.hisher(), tname: target.nameDesc() };
	Text.Add("[Name] slowly sing[s] a few verses of a soft, sensual melody, projecting [hisher] rich voice at [tname]. ", parse);
}
Abilities.Seduction.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.Add("[tName] squirm[s] at the subtle undertones of the song, becoming greatly aroused. [tName] gain[s] " + Text.BoldColor(dmg, "#FF8080") + " lust!", parse);
	Text.NL();
}
Abilities.Seduction.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", poss: caster.possessive() };
	Text.Add("[tName] manage[s] to shake off the desire-inducing effects of [poss] voice. ", parse);
	Text.NL();
}
