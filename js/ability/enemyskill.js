
Abilities.EnemySkill = {};

Abilities.EnemySkill.Sting = new AttackPhysical();
Abilities.EnemySkill.Sting.name = "Sting";
Abilities.EnemySkill.Sting.Short = function() { return "Tail attack with chance of poisoning the target."; }
Abilities.EnemySkill.Sting.cost = { hp: null, sp: 10, lp: null};
Abilities.EnemySkill.Sting.atkMod = 1.2;
Abilities.EnemySkill.Sting.hitMod = 0.8;
Abilities.EnemySkill.Sting.damageType.pPierce = 1;
Abilities.EnemySkill.Sting.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), y : caster.plural() ? "y" : "ies", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] read[y] [hisher] stinger, aiming it at [tName]!", parse);
	Text.Newline();
}
Abilities.EnemySkill.Sting.OnHit = function(encounter, caster, target, dmg) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : target.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", notS : caster.plural() ? "s" : "", tName : target.nameDesc() };
	
	Text.AddOutput("[name] sting[notS] [tName] for " + Text.BoldColor(dmg, "#800000") + " damage!", parse);
	Text.Newline();
}
Abilities.EnemySkill.Sting.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Venom(target, { hit : 0.6, turns : 3, turnsR : 3, str : 1, dmg : 0.15 })) {
		Text.AddOutput("[target] [has] been poisoned! ", parse);
	}
}
