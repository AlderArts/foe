/*
 * 
 * Lust attacks
 * 
 */
Abilities.Seduction = {};

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
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
// Default messages
TeaseSkill.prototype.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.AddOutput("[tName] become[s] aroused, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust!", parse);
	Text.Newline();
}
TeaseSkill.prototype.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", is : target.is() };
	Text.AddOutput("[tName] [is] turned off, losing " + Text.BoldColor(dmg, "#000060") + " lust!", parse);
	Text.Newline();
}






Abilities.Seduction.Rut = new Ability();
Abilities.Seduction.Rut.name = "Rut";
Abilities.Seduction.Rut.Short = function() { return "Hump away at target, dealing damage."; }
Abilities.Seduction.Rut.cost = { hp: null, sp: null, lp: 10};
Abilities.Seduction.Rut.CastInternal = function(encounter, caster, target) {
	var atkDmg = caster.LAttack();
	var def = target.LDefense();

	var dmg = Ability.Damage(atkDmg, def, caster.level, target.level);
	if(dmg < 0) dmg = 0;
	var atkType = new DamageType({pBlunt : 0.2, lust : 0.8});
	dmg = atkType.ApplyDmgType(target.elementDef, dmg);
	dmg = Math.floor(dmg);
			
	target.AddHPAbs(-dmg);
	target.AddLustAbs(dmg*0.25);
	
	var parse = {
		name : caster.name,
		tName : target.name
	}

	// TODO: Make more flavor text	
	Text.AddOutput("[name] ruts against [tName] for " + Text.BoldColor(dmg, "#800000") + " damage! Sexy!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

Abilities.Seduction.Fantasize = new Ability();
Abilities.Seduction.Fantasize.name = "Fantasize";
Abilities.Seduction.Fantasize.Short = function() { return "Raise own lust."; }
Abilities.Seduction.Fantasize.targetMode = TargetMode.Self;
Abilities.Seduction.Fantasize.CastInternal = function(encounter, caster) {
	var dmg = 1 * caster.LAttack();
	dmg = Math.floor(dmg);
	
	caster.AddLustAbs(dmg);
	
	var parse = {
		name : caster.name
	}

	// TODO: Make more flavor text	
	Text.AddOutput("[name] fantasizes, building " + Text.BoldColor(dmg, "#FF8080") + " lust! Sexy!", parse);
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

Abilities.Seduction.Distract = new TeaseSkill();
Abilities.Seduction.Distract.name = "Distract";
Abilities.Seduction.Distract.Short = function() { return "Raise enemy lust and lower their initiative."; }
Abilities.Seduction.Distract.cost = { hp: null, sp: 10, lp: 20};
Abilities.Seduction.Distract.atkMod = 0.8;
Abilities.Seduction.Distract.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] distract[s] [tName], shaking [hisher] [hipsDesc]! ", parse);
}
Abilities.Seduction.Distract.OnHit = function(encounter, caster, target, dmg) {
	for(var i = 0; i < encounter.combatOrder.length; i++) {
		if(encounter.combatOrder[i].entity == target)
			encounter.combatOrder[i].initiative -= 25;
	}
	
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s", HeShe : target.HeShe() };
	Text.AddOutput("[tName] become[s] aroused, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust! [HeShe] become[s] distracted.", parse);
	Text.Newline();
}


Abilities.Seduction.Charm = new TeaseSkill();
Abilities.Seduction.Charm.name = "Charm";
Abilities.Seduction.Charm.Short = function() { return "Try to dissuade the enemy from attacking you."; }
Abilities.Seduction.Charm.cost = { hp: null, sp: 10, lp: 10};
Abilities.Seduction.Charm.atkMod = 0.3;
Abilities.Seduction.Charm.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] charm[s] [tName], shaking [hisher] [hipsDesc]! ", parse);
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
	Text.AddOutput("[tName] become[s] charmed, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust! [HeShe] become[s] less aggressive towards [name].", parse);
	Text.Newline();
}


Abilities.Seduction.Allure = new TeaseSkill();
Abilities.Seduction.Allure.name = "Allure";
Abilities.Seduction.Allure.Short = function() { return "Try to dissuade the enemy from attacking you."; }
Abilities.Seduction.Allure.cost = { hp: null, sp: 30, lp: 60};
Abilities.Seduction.Allure.atkMod = 1;
Abilities.Seduction.Allure.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] charm[s] [tName], shaking [hisher] [hipsDesc]! ", parse);
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
	Text.AddOutput("[tName] become[s] charmed, gaining " + Text.BoldColor(dmg, "#FF8080") + " lust! [HeShe] become[s] less aggressive towards [name].", parse);
	Text.Newline();
}
