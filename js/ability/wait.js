/*
 * 
 * Wait
 * 
 */
import { Ability, Abilities, TargetMode } from '../ability';

Abilities.Wait = new Ability();
Abilities.Wait.name = "Wait";
Abilities.Wait.Short = function() { return "Wait a while."; }
Abilities.Wait.targetMode = TargetMode.Self;
Abilities.Wait.castTree.push(function(ability, encounter, caster) {
	Text.Add("[name] does nothing!", {name: caster.name});
	caster.GetCombatEntry(encounter).initiative += 50;
});
