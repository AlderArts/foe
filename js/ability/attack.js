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
		var parse = {name: caster.NameDesc(), tName: target.nameDesc(), s: caster.plural() ? "" : "s"};
		Text.Add("[name] attack[s] [tName], but the blow misses!", parse);
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = {name: caster.NameDesc(), tName: target.nameDesc(), s: caster.plural() ? "" : "s"};
		Text.Add("[name] attack[s] [tName] for " + Text.BoldColor(-dmg, "#800000") + " damage! Waagh!", parse);
	}],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = {name: caster.NameDesc(), tName: target.nameDesc(), theshe: target.heshe(), s: caster.plural() ? "" : "s", ts: target.plural() ? "" : "s"};
		Text.Add("[name] attack[s] [tName], but [theshe] absorb[ts] the blow for " + Text.BoldColor(dmg, "#008000") + " damage!");
	}]
}));
