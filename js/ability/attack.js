/*
 * 
 * Basic attack
 * 
 */

import { AbilityNode } from './node';
import { Ability } from '../ability';
import { Text } from '../text';

let AttackAb = new Ability("Attack");
AttackAb.Short = function() { return "Perform a physical attack."; }
AttackAb.castTree.push(AbilityNode.Template.Physical({
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] attack[notS] [tname], but the blow misses!", parse);
	}],
	onDamage: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] attack[notS] [tname] for " + Text.Damage(-dmg) + " damage! Waagh!", parse);
	}],
	onAbsorb: [function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] attack[notS] [tname], but [theshe] absorb[tnotS] the blow for " + Text.Heal(dmg) + " damage!");
	}]
}));

export { AttackAb };
