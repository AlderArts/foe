/*
 * 
 * Basic attack
 * 
 */
Abilities.Attack = new Ability();
Abilities.Attack.name = "Attack";
Abilities.Attack.Short = function() { return "Perform a physical attack."; }
Abilities.Attack.CastInternal = function(encounter, caster, target) {
	var atkDmg = caster.PAttack();
	var def    = target.PDefense();
	
	var hit    = caster.PHit();
	var evade  = target.PEvade();
	
	var toHit  = Ability.ToHit(hit, evade);

	var parse = {
		name  : caster.name,
		tName : target.name
	}
	
	if(Math.random() < toHit) {
		//var dmg = atkDmg - def;
		var dmg = Ability.Damage(atkDmg, def, caster.level, target.level);
		if(dmg < 0) dmg = 0;
		dmg = caster.elementAtk.ApplyDmgType(target.elementDef, dmg);
		dmg = Math.floor(dmg);
		
		if(target.PhysDmgHP(encounter, caster, dmg)) {
			target.AddHPAbs(-dmg);
	
			// TODO: Make more flavor text	
			Text.AddOutput("[name] attacks [tName] for " + Text.BoldColor(dmg, "#800000") + " damage! Waagh!", parse);
		}
	}
	else {
		Text.AddOutput("[name] attacks [tName], but the blow misses!", parse);
	}
	Text.Newline();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
