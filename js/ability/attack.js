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
		Text.Add("[name] attack[s] [tname], but the blow misses!", parse);
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[name] attack[s] [tname] for " + Text.BoldColor(-dmg, "#800000") + " damage! Waagh!", parse);
	}],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[name] attack[s] [tname], but [theshe] absorb[ts] the blow for " + Text.BoldColor(dmg, "#008000") + " damage!");
	}]
}));