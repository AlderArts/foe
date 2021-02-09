/*
 *
 * Wait
 *
 */
import { Ability, TargetMode } from "../../engine/combat/ability";
import { Encounter } from "../../engine/combat/combat";
import { Entity } from "../../engine/entity/entity";
import { Text } from "../../engine/parser/text";

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
