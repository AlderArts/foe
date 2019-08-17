/*
 *
 * Flee
 *
 */

import { GetDEBUG } from "../../app";
import { Ability, TargetMode } from "../ability";
import { Gui } from "../gui";
import { Perks } from "../perks";
import { Text } from "../text";

const RunAb = new Ability();
RunAb.name = "Run";
RunAb.Short = () => "Run away.";
RunAb.targetMode = TargetMode.Self;
RunAb.enabledCondition = (encounter, caster) => {
	return encounter.canRun;
};
RunAb.CastInternal = (encounter, caster) => {
	const parse: any = {
		Name : caster.NameDesc(),
		was : caster.plural() ? "were" : "was",
		y : caster.plural() ? "y" : "ies",
	};
	// TODO: Make more flavor text
	Text.Add("[Name] tr[y] to run away... ", parse);

	Text.Flush();
	if (encounter.canRun) {
		// TODO: random chance on success (more complex)
		const runlevel = encounter.RunLevel();
		let goal = caster.level / (caster.level + runlevel);
		if (caster.HasPerk(Perks.Fleetfoot)) { goal *= 1.5; }

		if ((Math.random() < goal) || GetDEBUG()) {
			encounter.onRun();
		} else {
			Text.Add("but [was] unable to!", parse);
			Text.NL();
			encounter.CombatTick();
		}
	} else { // Should never happen (ability locked)
		console.error("Something went wrong in Run.CastInternal");
		Text.NL();
		encounter.CombatTick();
	}
};

export { RunAb };
