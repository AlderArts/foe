/*
 * 
 * Basic attack
 * 
 */
Abilities.Attack = new Ability();
Abilities.Attack.name = "Attack";
Abilities.Attack.Short = function() { return "Perform a physical attack."; }
Abilities.Attack.castTree.push(AbilityNode.Template.Physical({
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] attack[notS] [tname], but the blow misses!", parse);
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] attack[notS] [tname] for " + Text.BoldColor(-dmg, "#800000") + " damage! Waagh!", parse);
	}],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] attack[notS] [tname], but [theshe] absorb[tnotS] the blow for " + Text.BoldColor(dmg, "#008000") + " damage!");
	}]
}));