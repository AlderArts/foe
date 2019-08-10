import * as _ from 'lodash';
import { Text } from "./text";
import { Gui } from './gui';
import { Stat } from './stat';
import { Encounter } from './combat';
import { Entity } from './entity';
import { GAME } from './GAME';
import { Party } from './party';

/*
 *
 * Combat ability template
 *
 */

enum TargetMode {
	Self        = 1,
	Ally        = 2,
	Enemy       = 3,
	Party       = 4,
	Enemies     = 5,
	AllyNotSelf = 6,
	AllyFallen  = 7,
	All         = 8
}

namespace TargetMode {
	export function ToString(mode : TargetMode) {
		switch(mode) {
			case TargetMode.Self:        return "self";
			case TargetMode.Ally:        return "ally";
			case TargetMode.Enemy:       return "enemy";
			case TargetMode.Party:       return "party";
			case TargetMode.Enemies:     return "enemies";
			case TargetMode.AllyNotSelf: return "ally";
			case TargetMode.AllyFallen:  return "fallen";
			case TargetMode.All:         return "all";
		}
	}
}

export class Ability {
	targetMode : any;
	name : string;
	cost : any;
	castTime : number;
	cancellable : any;
	cooldown : number;
	onCast : any[];
	castTree : any[];
	
	constructor(name? : string) {
		this.targetMode = TargetMode.Enemy;
		this.name = name || "ABILITY";
		//TODO: Tooltip?
		this.cost = { hp: null, sp: null, lp: null};

		this.castTime = 0;
		this.cancellable = true; // can be a function(ability, encounter, caster, target, result)
		this.cooldown = 0; //nr of rounds cooldown

		// Preparation nodes
		this.onCast   = [];
		// Actual cast nodes
		this.castTree = [];

		// Note, if CastInternalOOC is defined, ability will be usable out of combat
		//this.CastInternalOOC = function(caster, target) {
		//	Gui.NextPrompt(ShowAbilities);
		//}
	}
	
	Short() {
		return "NO DESC";
	}

	StartCast(encounter : Encounter, caster : Entity, target : Entity|Party) {
		Text.NL();
		_.each(this.onCast, function(node) {
			node(this, encounter, caster, target);
		});
	}

	CastInternal(encounter : Encounter, caster : Entity, target : Entity|Party) {
		Text.NL();
		_.each(this.castTree, function(node) {
			node(this, encounter, caster, target);
		});

		caster.FinishCastInternal(this, encounter, caster, target);
	}

	// Used as entrypoint for PC/Party (active selection)
	OnSelect(encounter : Encounter, caster : Entity, backPrompt? : any, ext? : any) {
		var ability = this;
		// TODO: Buttons (use portraits for target?)

		var target : any[] = [];
		let party : Party = GAME().party;

		switch(ability.targetMode) {
			case TargetMode.All:
				_.each(party.members, function(t) {
					// Don't add incapacitated
					var incap = t.Incapacitated();
					if(incap) return;

					target.push({
						nameStr : t.name,
						func    : function(t : Entity) {
							ability.Use(encounter, caster, t, ext);
						},
						enabled : ability.enabledTargetCondition(encounter, caster, t),
						obj     : t
					});
				});
				_.each(encounter.enemy.members, function(t) {
					// Don't add incapacitated
					var incap = t.Incapacitated();
					if(incap) return;

					target.push({
						nameStr : t.uniqueName || t.name,
						func    : function(t : Entity) {
							ability.Use(encounter, caster, t, ext);
						},
						enabled : ability.enabledTargetCondition(encounter, caster, t),
						obj     : t
					});
				});

				Gui.SetButtonsFromList(target, true, backPrompt);
				return true;

			case TargetMode.Self:
				ability.Use(encounter, caster, null, ext);
				break;

			case TargetMode.Ally:
			case TargetMode.AllyNotSelf:
			case TargetMode.AllyFallen:
				_.each(party.members, function(t) {
					// Don't add self unless allowed
					if(ability.targetMode == TargetMode.AllyNotSelf && t == caster) return;
					// Don't add incapacitated unless allowed
					var incap = t.Incapacitated();
					if(ability.targetMode == TargetMode.AllyFallen && !t.incap()) return;
					else if(incap) return;

					target.push({
						nameStr : t.name,
						func    : function(t : Entity) {
							ability.Use(encounter, caster, t, ext);
						},
						enabled : ability.enabledTargetCondition(encounter, caster, t),
						obj     : t
					});
				});

				Gui.SetButtonsFromList(target, true, backPrompt);
				return true;

			case TargetMode.Enemy:
				_.each(encounter.enemy.members, function(t) {
					// Don't add incapacitated
					var incap = t.Incapacitated();
					if(incap) return;

					target.push({
						nameStr : t.uniqueName || t.name,
						func    : function(t : Entity) {
							ability.Use(encounter, caster, t, ext);
						},
						enabled : ability.enabledTargetCondition(encounter, caster, t),
						obj     : t
					});
				});

				Gui.SetButtonsFromList(target, true, backPrompt);
				return true;

			case TargetMode.Party:
				ability.Use(encounter, caster, party, ext);
				break;
			case TargetMode.Enemies:
				ability.Use(encounter, caster, encounter.enemy, ext);
				break;
			default:
				encounter.CombatTick();
		}
	}

	Use(encounter : Encounter, caster : Entity, target : Entity|Party, ext? : any) {
		Ability.ApplyCost(this, caster);
		this.StartCast(encounter, caster, target);

		var entry : any = caster.GetCombatEntry(encounter);

		// Set cooldown
		if(this.cooldown) {
			entry.cooldown = entry.cooldown || [];
			entry.cooldown.push({
				cooldown: this.cooldown,
				ability: this
			});
		}

		if(this.castTime > 0) {
			entry.initiative = 100 - this.castTime; //TODO: not really good to have the fixed 100 here...
			entry.casting = {
				ability : this,
				target  : target
			};

			Text.Flush();
			Gui.NextPrompt(function() {
				encounter.CombatTick();
			});
		}
		else {
			this.CastInternal(encounter, caster, target);
		}
	}

	UseOutOfCombat(caster : Entity, target : Entity) {
		Ability.ApplyCost(this, caster);
		this.StartCast(null, caster, target);
		this.CastInternal(null, caster, target);
	}

	enabledCondition(encounter : Encounter, caster : Entity) {
		var onCooldown = encounter ? this.OnCooldown(caster.GetCombatEntry(encounter)) : false;

		return Ability.EnabledCost(this, caster) && !onCooldown;
	}

	OnCooldown(casterEntry : any) {
		var ability = this;
		var onCooldown = false;
		_.each(casterEntry.cooldown, function(c) {
			if(ability == c.ability) {
				onCooldown = c.cooldown;
				return false;
			}
		});
		return onCooldown;
	}

	enabledTargetCondition(encounter : Encounter, caster : Entity, target : Entity) {
		return true;
	}

	CostStr() {
		var str = "";
		if(this.cost.hp || this.cost.sp || this.cost.lp) {
			if(this.cost.hp) str += Text.Damage(this.cost.hp + "HP ");
			if(this.cost.sp) str += Text.Mana(this.cost.sp + "SP ");
			if(this.cost.lp) str += Text.Lust(this.cost.lp + "LP ");
		}
		else
			return Text.Bold("Free");

		return str;
	}

	static EnabledCost(ab : any, caster : Entity) {
		if(_.isObject(ab.cost)) {
			if(ab.cost.hp && ab.cost.hp > caster.curHp) return false;
			if(ab.cost.sp && ab.cost.sp > caster.curSp) return false;
			if(ab.cost.lp && ab.cost.lp > caster.curLust) return false;
		}
		return true;
	}

	static ApplyCost(ab : any, caster : Entity) {
		if(_.isObject(ab.cost)) {
			if(ab.cost.hp) caster.curHp -= ab.cost.hp;
			if(ab.cost.sp) caster.curSp -= ab.cost.sp;
			if(ab.cost.lp) caster.curLust -= ab.cost.lp;
		}
	}

	static ToHit(hit : number, evade : number) {
		return 2 / (1+Math.exp(-2.5*hit/evade)) - 1;
	}

	static Damage(atk : number, def : number, casterLvl : number = 1, targetLvl : number = 1) {
		var maxDefense = (2+Stat.growthPerPoint*Stat.growthPointsPerLevel*(targetLvl-1)) * (targetLvl+9)*2 + 100;
		var modRatio = Math.pow(maxDefense/def, 1.3);
		var logistics = 1/(1+Math.exp(-1*modRatio));
		var defFactor = 2*logistics-1;

		var levelFactor = 1.8 - 16/(5*Math.PI) * Math.atan((targetLvl+10)/(casterLvl+10));

		return defFactor * atk * levelFactor;
	}

}

export class AbilityCollection {
	name : string;
	AbilitySet : any[];
	constructor(name : string) {
		this.name = name;

		this.AbilitySet = [];
		//TODO: Tooltip
	}
	
	HasAbility(ability : Ability) {
		var idx = this.AbilitySet.indexOf(ability); // Is the ability already part of the set?
		return (idx!=-1);
	}

	AddAbility(ability : Ability) {
		var idx = this.AbilitySet.indexOf(ability); // Is the ability already part of the set?
		if(idx==-1)
			this.AbilitySet.push(ability);
	}

	Empty() {
		return this.AbilitySet.length == 0;
	}

	OnSelect(encounter : Encounter, caster : Entity, backPrompt? : any) {
		var collection = this;
		var entry = caster.GetCombatEntry(encounter);
		var prompt = function() {
			Text.Clear();
			_.each(collection.AbilitySet, function(ability) {
				var castTime = ability.castTime != 0 ? ability.castTime : "instant";
				var cooldown = ability.OnCooldown(entry);
				var plural   = (cooldown > 1 ? "s" : "");
				Text.Add("[ability] (Cost: [cost], Cast time: [time][cd]): [desc]<br>",
					{
						ability: ability.name,
						cost: ability.CostStr(),
						time: castTime,
						desc: ability.Short(),
						cd: cooldown ? (", cooling down... " + cooldown + " turn" + plural) : ""
					});
			});
			Text.Flush();
		};

		var ret = function() {
			collection.OnSelect(encounter, caster, backPrompt);
			prompt();
		}

		prompt();
		Gui.SetButtonsFromCollection(encounter, caster, this.AbilitySet, ret, backPrompt);
	}
}

export { TargetMode };
