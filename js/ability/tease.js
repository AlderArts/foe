


Abilities.Seduction.Tease = new TeaseSkill();
Abilities.Seduction.Tease.name = "Tease";
Abilities.Seduction.Tease.Short = function() { return "Raises the lust of target."; }
Abilities.Seduction.Tease.atkMod = 0.5;
Abilities.Seduction.Tease.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] tease[s] [tName], shaking [hisher] [hipsDesc]! ", parse);
}


Abilities.Seduction.Seduce = new TeaseSkill();
Abilities.Seduction.Seduce.name = "Seduce";
Abilities.Seduction.Seduce.cost = { hp: null, sp: 10, lp: 10};
Abilities.Seduction.Seduce.Short = function() { return "Raises the lust of target."; }
Abilities.Seduction.Seduce.atkMod = 1;
Abilities.Seduction.Seduce.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] tease[s] [tName], shaking [hisher] [hipsDesc]! ", parse);
}


Abilities.Seduction.StripTease = new TeaseSkill();
Abilities.Seduction.StripTease.name = "StripTease";
Abilities.Seduction.StripTease.Short = function() { return "Raises the lust of enemy party."; }
Abilities.Seduction.StripTease.cost = { hp: null, sp: 50, lp: 50};
Abilities.Seduction.StripTease.atkMod = 1.5;
Abilities.Seduction.StripTease.targetMode = TargetMode.Enemies;
Abilities.Seduction.StripTease.OnCast = function(encounter, caster, target) {
	var parse = { name : caster.NameDesc(), hisher : caster.hisher(), s : caster.plural() ? "" : "s", hipsDesc : caster.HipsDesc(), tName : target.nameDesc() };
	Text.AddOutput("[name] tease[s] the enemy party, shaking [hisher] [hipsDesc]! ", parse);
}
