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


Abilities.Seduction.Sleep = new Ability();
Abilities.Seduction.Sleep.name = "Sleep";
Abilities.Seduction.Sleep.Short = function() { return "Put one enemy to sleep for a short while with magical charms."; }
Abilities.Seduction.Sleep.cost = { hp: null, sp: 20, lp: null};
Abilities.Seduction.Sleep.CastInternal = function(encounter, caster, target) {
	var parse = {
		Name   : caster.NameDesc(),
		poss   : caster.possessive(),
		notS   : caster.plural() ? "" : "s",
		hisher : caster.hisher(),
		hand   : caster.HandDesc(),
		tname  : target.nameDesc(),
		tName  : target.NameDesc(),
		is     : target.is(),
		has    : target.has(),
		tnotS  : target.plural() ? "" : "s"
	};
	
	Text.Add("[Name] weave[notS] [hisher] [hand]s in alluring patterns, winking seductively at [tname]. ", parse);
	if(Status.Sleep(target, { hit : 0.6, turns : 2, turnsR : 2 })) {
		Text.Add("[tName] [is] unable to resist looking at the hypnotic display, and fall[tnotS] into a slumber. [tName] [has] been afflicted with sleep!", parse);
	}
	else {
		Text.Add("[tName] manage[notS] to shake off [poss] enchantment, resisting its drowsing effect.", parse);
	}
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.Seduction.TIllusion = new Ability();
Abilities.Seduction.TIllusion.name = "T.Illusion";
Abilities.Seduction.TIllusion.Short = function() { return "Terrifies your foes by creating frightening phantasms that soak up any attacks directed at you."; }
Abilities.Seduction.TIllusion.cost = { hp: null, sp: 25, lp: 10};
Abilities.Seduction.TIllusion.targetMode = TargetMode.Self;
Abilities.Seduction.TIllusion.CastInternal = function(encounter, caster) {
	var parse = {
		name   : caster.nameDesc(),
		poss   : caster.possessive(),
		notS   : caster.plural() ? "" : "s",
		hisher : caster.hisher(),
		hand   : caster.HandDesc()
	};
	var num = 2;
	num += Math.random() * 3;
	parse["num"] = Text.NumToText(num);
	
	Text.Add("Weaving [hisher] [hand]s in exotic patterns, [name] create[notS] [num] terrifying apparitions, which rise from purple smoke; bellowing in rage while drawing their phantasmal weapons.", parse);
	Status.Decoy(caster, { copies : num, func : function(attacker) {
		var decoy = caster.combatStatus.stats[StatusEffect.Decoy];
		var num = decoy.copies;
		decoy.copies--;
		if(decoy.copies <= 0)
			caster.combatStatus.stats[StatusEffect.Decoy] = null;
		var parse = {
			p : num > 1 ? "One of " + caster.possessive() : caster.Possessive(),
			s : num > 1 ? "s" : "",
			aposs   : attacker.possessive(),
			aName   : attacker.NameDesc(),
			ahisher : attacker.hisher(),
			ahas    : attacker.has(),
			anotS   : attacker.plural() ? "" : "s"
		};
		Text.AddOutput("[p] spectral servant[s] quickly moves in the way of [aposs] attack, flowing into [ahisher] body with a spine-chilling screech, vanishing. ", parse);
		if(Status.Siphon(attacker, {turns: 1, turnsR: 2, hp: 25, sp: 5, caster: caster})) {
			Text.AddOutput("[aName] stagger[anotS], the remnant of the revenant draining the energy from [ahisher] body. [aName] [ahas] been afflicted with siphon!", parse);
		}
		else {
			Text.AddOutput("[aName] shrug[anotS] off the phantom’s chill.", parse);
		}
		return false;
	} });
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.Seduction.SIllusion = new Ability();
Abilities.Seduction.SIllusion.name = "S.Illusion";
Abilities.Seduction.SIllusion.Short = function() { return "Arouses your foes by creating a harem of alluring mirages."; }
Abilities.Seduction.SIllusion.cost = { hp: null, sp: 10, lp: 25};
Abilities.Seduction.SIllusion.targetMode = TargetMode.Self;
Abilities.Seduction.SIllusion.CastInternal = function(encounter, caster) {
	var parse = {
		name   : caster.nameDesc(),
		poss   : caster.possessive(),
		notS   : caster.plural() ? "" : "s",
		hisher : caster.hisher(),
		hand   : caster.HandDesc()
	};
	var num = 2;
	num += Math.random() * 3;
	parse["num"] = Text.NumToText(num);
	
	Text.Add("Weaving [hisher] [hand]s in exotic patterns, [name] create[notS] [num] mesmerising and utterly lewd images which strut about invitingly; offering comfort and release with throaty groans and soft, alluring gasps.", parse);
	Status.Decoy(caster, { copies : num, func : function(attacker) {
		var decoy = caster.combatStatus.stats[StatusEffect.Decoy];
		var num = decoy.copies;
		decoy.copies--;
		if(decoy.copies <= 0)
			caster.combatStatus.stats[StatusEffect.Decoy] = null;
		var parse = {
			p : num > 1 ? "One of " + caster.possessive() : caster.Possessive(),
			s : num > 1 ? "s" : "",
			aposs   : attacker.possessive(),
			aName   : attacker.NameDesc(),
			ahimher : attacker.himher(),
			ahisher : attacker.hisher(),
			ahas    : attacker.has(),
			anotS   : attacker.plural() ? "" : "s"
		};
		Text.AddOutput("[p] titillating apparition[s] quickly moves in the way of [aposs] attack, flowing into [ahimher] with an orgasmic cry. ", parse);
		if(Status.Horny(attacker, { hit : 0.75, turns : 1, turnsR : 2, str : 1, dmg : 0.2 })) {
			Text.AddOutput("[aName] stagger[anotS], flustered with visions of obscene acts. [aName] [ahas] been afflicted with horny!", parse);
		}
		else {
			Text.AddOutput("[aName] resist[anotS], reigning in [ahisher] urges.", parse);
		}
		return false;
	} });
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
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
