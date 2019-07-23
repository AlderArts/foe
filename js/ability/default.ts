import { AbilityNode } from "./node";
import { Ability } from "../ability";
import { Encounter } from "../combat";
import { Entity } from "../entity";
import { Text } from "../text";

// Default messages
let Defaults = {
    Black : {
        _onDamage : function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
            var parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("It hits [tname] for " + Text.Damage(-dmg) + " damage!", parse);
            Text.NL();
        },
        _onAbsorb : function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
            var parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] absorb[tnotS] the spell, gaining " + Text.Heal(dmg) + " health!", parse);
            Text.NL();
        },
        _onMiss : function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
            var parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] manage[tnotS] to resist the effects of the spell!", parse);
            Text.NL();
        }
    },
    Physical : {
        _onDamage : function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
            var parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("The attack hits [tname] for " + Text.Damage(-dmg) + " damage!", parse);
            Text.NL();
        },
        _onMiss : function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
            var parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("The attack narrowly misses [tname], dealing no damage!", parse);
            Text.NL();
        },
        _onAbsorb : function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
            var parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] absorb[tnotS] the attack, gaining " + Text.Heal(dmg) + " health!", parse);
            Text.NL();
        }
    },
    Seduction : {
        _onDamage : function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
            var parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] become[tnotS] aroused, gaining " + Text.Lust(-dmg) + " lust!", parse);
            Text.NL();
        },
        _onAbsorb : function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
            var parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] [tis] turned off, losing " + Text.Soothe(dmg) + " lust!", parse);
            Text.NL();
        },
        _onMiss : function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
            var parse = AbilityNode.DefaultParser(caster, target);
            Text.Add("[tName] manage[tnotS] to resist the temptation!", parse);
            Text.NL();
        }
    },
};

export { Defaults };
