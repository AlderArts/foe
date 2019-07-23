/*
 * 
 * Wait
 * 
 */
import { Ability, TargetMode } from '../ability';

let WaitAb = new Ability();
WaitAb.name = "Wait";
WaitAb.Short = function() { return "Wait a while."; }
WaitAb.targetMode = TargetMode.Self;
WaitAb.castTree.push(function(ability, encounter, caster) {
	Text.Add("[name] does nothing!", {name: caster.name});
	caster.GetCombatEntry(encounter).initiative += 50;
});

export { WaitAb };
