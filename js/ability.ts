import * as _ from "lodash";

import { Encounter } from "./combat";
import { DamageType, IDamageType } from "./damagetype";
import { Entity, ICombatEncounter, ICombatOrder } from "./entity";
import { GAME } from "./GAME";
import { Gui } from "./gui";
import { Party } from "./party";
import { Stat } from "./stat";
import { Text } from "./text";

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
	All         = 8,
}

namespace TargetMode {
	export function ToString(mode: TargetMode) {
		switch (mode) {
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

export interface IAbilityCost {
	hp: number;
	sp: number;
	lp: number;
}
export interface IAbilityNode {
	damageTypeNode?: DamageType;
	damageType?: IDamageType;
	cost?: IAbilityCost;

	onCast?: CallableFunction[];
	onHit?: CallableFunction[];
	onMiss?: CallableFunction[];
	onDamage?: CallableFunction[];
	onAbsorb?: CallableFunction[];

	nrAttacks?: number;
	hitFallen?: boolean;

	toHit?: CallableFunction;
	toDamage?: CallableFunction;
	hitFunc?: CallableFunction;
	evadeFunc?: CallableFunction;
	atkFunc?: CallableFunction;
	defFunc?: CallableFunction;
	damageFunc?: CallableFunction;
	damagePool?: CallableFunction[];

	hitMod?: number;
	atkMod?: number;
	defMod?: number;
	// Run
	fraction?: number;
	// Spellstack
	value?: Ability|CallableFunction;
	stack?: Ability[];
	consume?: boolean;
	// Cancel
	result?: any;
}

export class Ability {

	public static EnabledCost(ab: Ability|IAbilityNode, caster: Entity) {
		if (_.isObject(ab.cost)) {
			if (ab.cost.hp && ab.cost.hp > caster.curHp) { return false; }
			if (ab.cost.sp && ab.cost.sp > caster.curSp) { return false; }
			if (ab.cost.lp && ab.cost.lp > caster.curLust) { return false; }
		}
		return true;
	}

	public static ApplyCost(ab: Ability|IAbilityNode, caster: Entity) {
		if (_.isObject(ab.cost)) {
			if (ab.cost.hp) { caster.curHp -= ab.cost.hp; }
			if (ab.cost.sp) { caster.curSp -= ab.cost.sp; }
			if (ab.cost.lp) { caster.curLust -= ab.cost.lp; }
		}
	}

	public static ToHit(hit: number, evade: number) {
		return 2 / (1 + Math.exp(-2.5 * hit / evade)) - 1;
	}

	public static Damage(atk: number, def: number, casterLvl: number = 1, targetLvl: number = 1) {
		const maxDefense = (2 + Stat.growthPerPoint * Stat.growthPointsPerLevel * (targetLvl - 1)) * (targetLvl + 9) * 2 + 100;
		const modRatio = Math.pow(maxDefense / def, 1.3);
		const logistics = 1 / (1 + Math.exp(-1 * modRatio));
		const defFactor = 2 * logistics - 1;

		const levelFactor = 1.8 - 16 / (5 * Math.PI) * Math.atan((targetLvl + 10) / (casterLvl + 10));

		return defFactor * atk * levelFactor;
	}
	public targetMode: TargetMode;
	public name: string;
	public cost: IAbilityCost;
	public castTime: number;
	public cancellable: any;
	public cooldown: number;
	public onCast: CallableFunction[];
	public castTree: CallableFunction[];
	public OOC: boolean;

	constructor(name?: string) {
		this.targetMode = TargetMode.Enemy;
		this.name = name || "ABILITY";
		// TODO: Tooltip?
		this.cost = { hp: undefined, sp: undefined, lp: undefined };

		this.castTime = 0;
		this.cancellable = true; // can be a function(ability, encounter, caster, target, result)
		this.cooldown = 0; // nr of rounds cooldown

		// Preparation nodes
		this.onCast   = [];
		// Actual cast nodes
		this.castTree = [];

		// Note, if CastInternalOOC is defined, ability will be usable out of combat
		// this.CastInternalOOC = function(caster, target) {
		// 	Gui.NextPrompt(ShowAbilities);
		// }
	}

	public Short() {
		return "NO DESC";
	}

	public StartCast(encounter: ICombatEncounter, caster: Entity, target: Entity|Party) {
		_.each(this.onCast, function(node) {
			node(this, encounter, caster, target);
		});
	}

	public CastInternal(encounter: ICombatEncounter, caster: Entity, target: Entity|Party) {
		_.each(this.castTree, function(node) {
			node(this, encounter, caster, target);
		});

		caster.FinishCastInternal(this, encounter, caster, target);
	}

	// Used as entrypoint for PC/Party (active selection)
	public OnSelect(encounter: ICombatEncounter, caster: Entity, backPrompt?: CallableFunction, ext?: any) {
		const ability = this;
		// TODO: Buttons (use portraits for target?)

		Text.Clear();
		const castTime = ability.castTime !== 0 ? ability.castTime : "instant";
		Text.Add("[ability] (Cost: [cost], Cast time: [time]): [desc]<br>",
			{
				ability: ability.name,
				cost: ability.CostStr(),
				time: castTime,
				desc: ability.Short(),
			});
		Text.Flush();

		const target: any[] = [];
		const party: Party = GAME().party;

		switch (ability.targetMode) {
			case TargetMode.All: {
				const validTarget = (t: Entity) => {
					// Don't add incapacitated
					const incap = t.Incapacitated();
					return !incap;
				};
				const retargetEnemy = (original: Entity) => {
					if (validTarget(original)) { return original; }
					for (const t of encounter.enemy.members) {
						if (validTarget(t)) {
							return t;
						}
					}
					return original;
				};
				const retargetAlly = (original: Entity) => {
					if (validTarget(original)) { return original; }
					for (const t of party.members) {
						if (validTarget(t)) {
							return t;
						}
					}
					return original;
				};

				_.each(party.members, (t) => {
					// Don't add incapacitated
					const incap = t.Incapacitated();
					if (incap) { return; }

					target.push({
						nameStr : t.name,
						func(t: Entity) {
							Text.Clear();
							ability.Use(encounter, caster, t, ext, retargetAlly);
						},
						enabled : ability.enabledTargetCondition(encounter, caster, t),
						obj     : t,
					});
				});
				_.each(encounter.enemy.members, (t) => {
					// Don't add incapacitated
					const incap = t.Incapacitated();
					if (incap) { return; }

					target.push({
						nameStr : t.uniqueName || t.name,
						func(t: Entity) {
							Text.Clear();
							ability.Use(encounter, caster, t, ext, retargetEnemy);
						},
						enabled : ability.enabledTargetCondition(encounter, caster, t),
						obj     : t,
					});
				});

				Gui.SetButtonsFromList(target, true, backPrompt);
				return true;
			}
			case TargetMode.Self:
				Text.Clear();
				ability.Use(encounter, caster, undefined, ext);
				break;

			case TargetMode.Ally:
			case TargetMode.AllyNotSelf:
			case TargetMode.AllyFallen: {
				const validTarget = (t: Entity) => {
					// Don't add self unless allowed
					if (ability.targetMode === TargetMode.AllyNotSelf && t === caster) { return false; }
					// Don't add incapacitated unless allowed
					const incap = t.Incapacitated();
					if (ability.targetMode === TargetMode.AllyFallen) {
						if (!incap) {
							return false;
						}
					} else if (incap) {
						return false;
					}
					return true;
				};

				const retarget = (original: Entity) => {
					if (validTarget(original)) { return original; }
					for (const t of encounter.enemy.members) {
						if (validTarget(t)) {
							return t;
						}
					}
					return original;
				};

				_.each(party.members, (t) => {
					if (validTarget(t)) {
						target.push({
							nameStr : t.name,
							func(t: Entity) {
								Text.Clear();
								ability.Use(encounter, caster, t, ext, retarget);
							},
							enabled : ability.enabledTargetCondition(encounter, caster, t),
							obj     : t,
						});
					}
				});

				Gui.SetButtonsFromList(target, true, backPrompt);
				return true;
			}
			case TargetMode.Enemy: {
				const validTarget = (t: Entity) => {
					// Don't add incapacitated
					const incap = t.Incapacitated();
					return !incap;
				};
				const retarget = (original: Entity) => {
					if (validTarget(original)) { return original; }
					for (const t of encounter.enemy.members) {
						if (validTarget(t)) {
							return t;
						}
					}
					return original;
				};

				_.each(encounter.enemy.members, (t) => {
					if (validTarget(t)) {
						target.push({
							nameStr : t.uniqueName || t.name,
							func(t: Entity) {
								Text.Clear();
								ability.Use(encounter, caster, t, ext, retarget);
							},
							enabled : ability.enabledTargetCondition(encounter, caster, t),
							obj     : t,
						});
					}
				});

				Gui.SetButtonsFromList(target, true, backPrompt);
				return true;
			}
			case TargetMode.Party:
				Text.Clear();
				ability.Use(encounter, caster, party, ext);
				break;
			case TargetMode.Enemies:
				Text.Clear();
				ability.Use(encounter, caster, encounter.enemy, ext);
				break;
			default: // Shouldn't happen
				Text.NL();
				encounter.CombatTick();
		}
	}

	public Use(encounter: ICombatEncounter, caster: Entity, target: Entity|Party, ext?: any, retarget?: CallableFunction) {
		Ability.ApplyCost(this, caster);
		this.StartCast(encounter, caster, target);

		const entry = caster.GetCombatEntry(encounter);

		// Set cooldown
		if (this.cooldown) {
			entry.cooldown = entry.cooldown || [];
			entry.cooldown.push({
				cooldown: this.cooldown,
				ability: this,
			});
		}

		if (this.castTime > 0) {
			entry.initiative = 100 - this.castTime; // TODO: not really good to have the fixed 100 here...
			entry.casting = {
				ability : this,
				target,
				retarget,
			};

			Text.Flush();
			encounter.CombatTick();
		} else {
			this.CastInternal(encounter, caster, target);
		}
	}

	public UseOutOfCombat(caster: Entity, target: Entity) {
		Ability.ApplyCost(this, caster);
		this.StartCast(undefined, caster, target);
		this.CastInternal(undefined, caster, target);
	}

	public enabledCondition(encounter: ICombatEncounter, caster: Entity) {
		const onCooldown = encounter ? this.OnCooldown(caster.GetCombatEntry(encounter)) : false;

		return Ability.EnabledCost(this, caster) && !onCooldown;
	}

	public OnCooldown(casterEntry: ICombatOrder) {
		const ability = this;
		let onCooldown = 0;
		_.each(casterEntry.cooldown, (c) => {
			if (ability === c.ability) {
				onCooldown = c.cooldown;
				return false;
			}
		});
		return onCooldown;
	}

	public enabledTargetCondition(encounter: ICombatEncounter, caster: Entity, target: Entity) {
		return true;
	}

	public CostStr() {
		let str = "";
		if (this.cost.hp || this.cost.sp || this.cost.lp) {
			if (this.cost.hp) { str += Text.Damage(this.cost.hp + "HP "); }
			if (this.cost.sp) { str += Text.Mana(this.cost.sp + "SP "); }
			if (this.cost.lp) { str += Text.Lust(this.cost.lp + "LP "); }
		} else {
			return Text.Bold("Free");
		}

		return str;
	}

}

export class AbilityCollection {
	public name: string;
	public AbilitySet: Ability[];
	constructor(name: string) {
		this.name = name;

		this.AbilitySet = [];
		// TODO: Tooltip
	}

	public HasAbility(ability: Ability) {
		const idx = this.AbilitySet.indexOf(ability); // Is the ability already part of the set?
		return (idx !== -1);
	}

	public AddAbility(ability: Ability) {
		const idx = this.AbilitySet.indexOf(ability); // Is the ability already part of the set?
		if (idx === -1) {
			this.AbilitySet.push(ability);
		}
	}

	public Empty() {
		return this.AbilitySet.length === 0;
	}

	public OnSelect(encounter: Encounter, caster: Entity, backPrompt?: CallableFunction) {
		const collection = this;
		const entry = caster.GetCombatEntry(encounter);

		const ret = () => {
			collection.OnSelect(encounter, caster, backPrompt);
		};

		const prompt = () => {
			Text.Clear();
			_.each(collection.AbilitySet, (ability) => {
				const castTime = ability.castTime !== 0 ? ability.castTime : "instant";
				const cooldown = ability.OnCooldown(entry);
				const plural   = (cooldown > 1 ? "s" : "");
				Text.Add("[ability] (Cost: [cost], Cast time: [time][cd]): [desc]<br>",
					{
						ability: ability.name,
						cost: ability.CostStr(),
						time: castTime,
						desc: ability.Short(),
						cd: cooldown ? (", cooling down... " + cooldown + " turn" + plural) : "",
					});
			});
			Text.Flush();
			Gui.SetButtonsFromCollection(encounter, caster, this.AbilitySet, ret, backPrompt);
		};

		prompt();
	}
}

export { TargetMode };
