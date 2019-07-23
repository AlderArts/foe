/*
 * 
 * Flee
 * 
 */

import { Ability, TargetMode } from '../ability';
import { Gui } from '../gui';
import { GetDEBUG } from '../../app';

let RunAb = new Ability();
RunAb.name = "Run";
RunAb.Short = function() { return "Run away."; }
RunAb.targetMode = TargetMode.Self;
RunAb.enabledCondition = function(encounter, caster) {
	return encounter.canRun;
}
RunAb.CastInternal = function(encounter, caster) {
	var parse = {
		Name : caster.NameDesc(),
		y : caster.plural() ? "y" : "ies",
		was : caster.plural() ? "were" : "was"
	};
	// TODO: Make more flavor text
	Text.Add("[Name] tr[y] to run away... ", parse);
	
	Text.Flush();
	if(encounter.canRun) {
		// TODO: random chance on success (more complex)
		var runlevel = encounter.RunLevel();
		var goal = caster.level / (caster.level + runlevel);
		if(caster.HasPerk(Perks.Fleetfoot)) goal *= 1.5;
		
		if((Math.random() < goal) || GetDEBUG()) {
			encounter.onRun();
		}
		else {
			Text.Add("but [was] unable to!", parse);
			Text.Flush();
			Gui.NextPrompt(function() {
				encounter.CombatTick();
			});
		}	
	}
	else { //Should never happen (ability locked)
		Gui.NextPrompt(function() {
			encounter.CombatTick();
		});
	}
}

export { RunAb };
