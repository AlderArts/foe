import * as _ from "lodash";

import { Ability } from "../ability";
import { Encounter } from "../combat";
import { Entity, IAggroEntry, ICombatOrder } from "../entity";
import { Text } from "../text";
import { AbilityNode } from "./node";

// Default messages
export namespace Defaults {
    export namespace Black {
        export function _onDamage(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) {
            const parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("It hits [tname] for " + Text.Damage(-dmg) + " damage!", parse);
            Text.NL();
        }
        export function _onAbsorb(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) {
            const parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] absorb[tnotS] the spell, gaining " + Text.Heal(dmg) + " health!", parse);
            Text.NL();
        }
        export function _onMiss(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) {
            const parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] manage[tnotS] to resist the effects of the spell!", parse);
            Text.NL();
        }
    }
    export namespace Physical {
        export function _onDamage(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) {
            const parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("The attack hits [tname] for " + Text.Damage(-dmg) + " damage!", parse);
            Text.NL();
        }
        export function _onMiss(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) {
            const parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("The attack narrowly misses [tname], dealing no damage!", parse);
            Text.NL();
        }
        export function _onAbsorb(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) {
            const parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] absorb[tnotS] the attack, gaining " + Text.Heal(dmg) + " health!", parse);
            Text.NL();
        }
    }
    export namespace Seduction {
        export function _onDamage(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) {
            const parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] become[tnotS] aroused, gaining " + Text.Lust(-dmg) + " lust!", parse);
            Text.NL();
        }
        export function _onAbsorb(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) {
            const parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] [tis] turned off, losing " + Text.Soothe(dmg) + " lust!", parse);
            Text.NL();
        }
        export function _onMiss(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) {
            const parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] manage[tnotS] to resist the temptation!", parse);
            Text.NL();
        }
    }
}

export function GetAggroEntry(activeChar: ICombatOrder, entity: Entity) {
	let found: IAggroEntry;
	_.each(activeChar.aggro, (it) => {
		if (it.entity === entity) {
			found = it;
			return false;
		}
	});
	return found;
}
