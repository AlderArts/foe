/*
 *
 * Wait
 *
 */
import { Ability, TargetMode } from "../ability";
import { Encounter } from "../combat";
import { Entity } from "../entity";
import { Text } from "../text";

const WaitAb = new Ability();
WaitAb.name = "Wait";
WaitAb.Short = () => "Wait a while.";
WaitAb.targetMode = TargetMode.Self;
WaitAb.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
	Text.Add("[name] does nothing!", {name: caster.name});
	Text.NL();
	caster.GetCombatEntry(encounter).initiative += 50;
});

export { WaitAb };
