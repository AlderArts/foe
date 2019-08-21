import * as _ from "lodash";
import { Ability } from "../ability";
import { Encounter } from "../combat";
import { DamageType } from "../damagetype";
import { Entity } from "../entity";
import { Party } from "../party";
import { StatusEffect } from "../statuseffect";
import { Text } from "../text";

const AbilityNode: any = {};

AbilityNode.DefaultParser = (caster: Entity, target: Entity) => {
	let parse: any = {};

	if (caster) {
		parse         = caster.ParserPronouns(parse);
		parse.name = caster.nameDesc();
		parse.Name = caster.NameDesc();
		parse.poss = caster.possessive();
		parse.Poss = caster.Possessive();
		parse.y    = caster.plural() ? "y" : "ies";
		parse.s    = caster.plural() ? "s" : "";
		parse.es   = caster.plural() ? "es" : "";
		parse.notS = caster.plural() ? "" : "s";
		parse.notEs = caster.plural() ? "" : "es";
		parse.is   = caster.is();
		parse.has  = caster.has();
		parse.hand = () => caster.HandDesc();
	}
	if (target) {
		parse          = target.ParserPronouns(parse, "t");
		parse.tname = target.nameDesc();
		parse.tName = target.NameDesc();
		parse.tposs = target.possessive();
		parse.tPoss = target.Possessive();
		parse.ty    = target.plural() ? "y" : "ies";
		parse.ts    = target.plural() ? "s" : "";
		parse.tes   = target.plural() ? "es" : "";
		parse.tnotS = target.plural() ? "" : "s";
		parse.tnotEs = target.plural() ? "" : "es";
		parse.tis   = target.is();
		parse.thas  = target.has();
	}
	return parse;
};

AbilityNode.Template = {};

AbilityNode.Template.Blank = (node: any = {}) => {
	node.damageType = node.damageType ? new DamageType(node.damageType) : undefined;

	node.cost       = node.cost     || { hp: undefined, sp: undefined, lp: undefined};

	/*
	node.onCast     = node.onCast   || [];
	node.onHit      = node.onHit    || [];
	node.onMiss     = node.onMiss   || [];
	node.onDamage   = node.onDamage || [];
	node.onAbsorb   = node.onAbsorb || [];

	node.hitFallen  = node.hitFallen;
	node.retarget   = node.retarget;

	node.hitMod     = node.hitMod;
	node.atkMod     = node.atkMod;
	node.defMod     = node.defMod;
	*/
	node.toHit      = _.has(node, "toHit")    ? node.toHit    : AbilityNode.ToHit.Regular;
	node.toDamage   = _.has(node, "toDamage") ? node.toDamage : AbilityNode.ToDamage.Regular;
	node.damagePool = node.damagePool || [];

	node.hitFunc    = node.hitFunc    || AbilityNode.HitFunc.Physical;
	node.evadeFunc  = node.evadeFunc  || AbilityNode.EvadeFunc.Physical;
	node.atkFunc    = node.atkFunc    || AbilityNode.AtkFunc.Physical;
	node.defFunc    = node.defFunc    || AbilityNode.DefFunc.Physical;
	node.damageFunc = node.damageFunc || AbilityNode.DamageFunc.Physical;

	return _.bind(AbilityNode.Run, node);
};
AbilityNode.Template.Physical = (node: any = {}) => {
	/*
	node.hitFallen = node.hitFallen;
	node.retarget  = node.retarget;
	*/
	node.damageType = node.damageType ? new DamageType(node.damageType) : undefined;

	node.toHit     = _.has(node, "toHit")    ? node.toHit    : AbilityNode.ToHit.Regular;
	node.toDamage  = _.has(node, "toDamage") ? node.toDamage : AbilityNode.ToDamage.Regular;

	node.hitFunc   = node.hitFunc   || AbilityNode.HitFunc.Physical;
	node.evadeFunc = node.evadeFunc || AbilityNode.EvadeFunc.Physical;
	node.atkFunc   = node.atkFunc   || AbilityNode.AtkFunc.Physical;
	node.defFunc   = node.defFunc   || AbilityNode.DefFunc.Physical;
	node.damageFunc = node.damageFunc || AbilityNode.DamageFunc.Physical;
	node.damagePool = node.damagePool || [AbilityNode.DamagePool.Physical];

	return _.bind(AbilityNode.Run, node);
};
AbilityNode.Template.Magical = (node: any = {}) => {
	/*
	node.hitFallen = node.hitFallen;
	node.retarget  = node.retarget;
	*/
	node.damageType = node.damageType ? new DamageType(node.damageType) : undefined;

	node.toHit     = _.has(node, "toHit")    ? node.toHit    : AbilityNode.ToHit.Regular;
	node.toDamage  = _.has(node, "toDamage") ? node.toDamage : AbilityNode.ToDamage.Regular;

	node.hitFunc   = node.hitFunc   || AbilityNode.HitFunc.Magical;
	node.evadeFunc = node.evadeFunc || AbilityNode.EvadeFunc.Magical;
	node.atkFunc   = node.atkFunc   || AbilityNode.AtkFunc.Magical;
	node.defFunc   = node.defFunc   || AbilityNode.DefFunc.Magical;
	node.damageFunc = node.damageFunc || AbilityNode.DamageFunc.Magical;
	node.damagePool = node.damagePool || [AbilityNode.DamagePool.Physical];

	return _.bind(AbilityNode.Run, node);
};
AbilityNode.Template.Lust = (node: any = {}) => {
	/*
	node.hitFallen = node.hitFallen;
	node.retarget  = node.retarget;
	*/
	node.damageType = node.damageType ? new DamageType(node.damageType) : undefined;

	node.toHit     = _.has(node, "toHit")    ? node.toHit    : AbilityNode.ToHit.Regular;
	node.toDamage  = _.has(node, "toDamage") ? node.toDamage : AbilityNode.ToDamage.Regular;

	node.hitFunc   = node.hitFunc   || AbilityNode.HitFunc.Lust;
	node.evadeFunc = node.evadeFunc || AbilityNode.EvadeFunc.Lust;
	node.atkFunc   = node.atkFunc   || AbilityNode.AtkFunc.Lust;
	node.defFunc   = node.defFunc   || AbilityNode.DefFunc.Lust;
	node.damageFunc = node.damageFunc || AbilityNode.DamageFunc.Lust;
	node.damagePool = node.damagePool || [AbilityNode.DamagePool.Lust];

	return _.bind(AbilityNode.Run, node);
};
AbilityNode.Template.Heal = (node: any = {}) => {
	/*
	node.hitFallen = node.hitFallen;
	node.retarget  = node.retarget;
	*/
	node.toHit     = _.has(node, "toHit")    ? node.toHit    : undefined;
	node.toDamage  = _.has(node, "toDamage") ? node.toDamage : AbilityNode.ToDamage.Heal;
	/*
	node.hitFunc   = node.hitFunc;
	node.evadeFunc = node.evadeFunc;
	node.defFunc   = node.defFunc;
	*/
	node.atkFunc   = node.atkFunc || AbilityNode.AtkFunc.Magical;
	node.damageFunc = node.damageFunc || AbilityNode.DamageFunc.Magical;
	node.damagePool = node.damagePool || [AbilityNode.DamagePool.Physical];

	return _.bind(AbilityNode.Run, node);
};
AbilityNode.Template.Fallthrough = (node: any = {}) => {
	node.onDamage  = node.onDamage || [];
	node.onAbsorb  = node.onAbsorb || [];

	node.fraction = node.fraction || 1;
	node.damageFunc = node.damageFunc || AbilityNode.DamageFunc.Physical;
	node.damagePool = node.damagePool || [AbilityNode.DamagePool.Physical];

	return _.bind(AbilityNode.RunFallthrough, node);
};
AbilityNode.RunFallthrough = function(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, result: any) {
	const that = this;
	const fraction = that.fraction || 1;

	const dmg = fraction * result;

	const onattack = that.damageFunc(caster, target, dmg);

	if (onattack) {
		// On dealing damage (dmg is negative)
		if (dmg <= 0) {
			_.each(that.onDamage, (node) => {
				node(ability, encounter, caster, target, dmg);
			});
		} else {
			_.each(that.onAbsorb, (node) => {
				node(ability, encounter, caster, target, dmg);
			});
		}
	}
};

AbilityNode.Template.AddSpellstack = (node: any = {}) => {
	/*
	node.value = node.value;
	*/
	return _.bind(AbilityNode.RunAddSpellstack, node);
};
AbilityNode.RunAddSpellstack = function(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, result: any) {
	const that = this;

	const value = _.isFunction(that.value) ? that.value() : that.value;

	const entry = target.GetCombatEntry(encounter);
	entry.spellstack = entry.spellstack || [];
	entry.spellstack.push(value);
};

AbilityNode.Template.MatchSpellstack = (node: any = {}) => {
	/*
	node.consume = node.consume;
	 */

	// Stack to match
	node.stack  = node.stack  || [];

	node.onHit  = node.onHit  || [];
	node.onMiss = node.onMiss || [];

	return _.bind(AbilityNode.RunMatchSpellstack, node);
};
AbilityNode.RunMatchSpellstack = function(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, result: any) {
	const that = this;

	const consume = that.consume;
	const entry = target.GetCombatEntry(encounter);
	const spellstack = entry.spellstack || [];
	const stack = that.stack;
	let match = true;
	if (spellstack.length >= stack.length) {
		let first = 0;
		_.each(stack, (spell) => {
			first = _.indexOf(spellstack, spell, first);
			if (first === -1) {
				match = false;
				return false;
			} else {
				first++;
			}
		});
	} else {
		match = false;
	}

	if (match) {
		if (consume) { entry.spellstack = []; }

		_.each(that.onHit, (node) => {
			node(ability, encounter, caster, target, result);
		});
	} else {
		_.each(that.onMiss, (node) => {
			node(ability, encounter, caster, target, result);
		});
	}
};

AbilityNode.Template.Cancel = (node: any = {}) => {
	/*
	node.result = node.result;
	*/
	node.onHit     = node.onHit    || [];
	node.onMiss    = node.onMiss   || [];
	return _.bind(AbilityNode.RunCancel, node);
};
AbilityNode.RunCancel = function(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, result: any) {
	const that = this;
	const entry = target.GetCombatEntry(encounter);
	// Only trigger if target is casting
	if (entry && entry.casting) {
		// Override result
		result = that.result || result;
		// Is casted ability cancellable?
		let cancellable = entry.casting.ability.cancellable;
		// Check if applicable in this situation (for super special cancels)
		if (_.isFunction(cancellable)) {
			cancellable = cancellable(ability, encounter, caster, target, result);
		}
		// When all is said and done, proceed?
		if (cancellable && target.CanBeInterrupted(ability, encounter, caster, result)) {
			const parse = AbilityNode.DefaultParser(caster, target);
			Text.NL();
			Text.Add("[tPoss] concentration is broken!", parse, "bold");
			Text.NL();
			// Cancel casting
			entry.casting = undefined;
			// Apply any additional effects
			_.each(that.onHit, (node) => {
				node(ability, encounter, caster, target, result);
			});
		} else {
			// On miss
			_.each(that.onMiss, (node) => {
				node(ability, encounter, caster, target);
			});
		}
	}
};

AbilityNode.ToHit = {};
AbilityNode.ToHit.StrikeThrough = (caster: Entity, target: Entity) => {
	return true;
};
AbilityNode.ToHit.Regular = function(caster: Entity, target: Entity) {
	const hitMod = this.hitMod || 1;
	const hit    = hitMod * this.hitFunc(caster, target);
	const evade  = this.evadeFunc(caster, target);

	return Ability.ToHit(hit, evade);
};

AbilityNode.HitFunc = {};
AbilityNode.HitFunc.Physical = (caster: Entity, target: Entity) => {
	return caster.PHit();
};
AbilityNode.HitFunc.Magical = (caster: Entity, target: Entity) => {
	return caster.MHit();
};
AbilityNode.HitFunc.Lust = (caster: Entity, target: Entity) => {
	return caster.LHit();
};

AbilityNode.EvadeFunc = {};
AbilityNode.EvadeFunc.Physical = (caster: Entity, target: Entity) => {
	return target.PEvade();
};
AbilityNode.EvadeFunc.Magical = (caster: Entity, target: Entity) => {
	return target.MEvade();
};
AbilityNode.EvadeFunc.Lust = (caster: Entity, target: Entity) => {
	return target.LEvade();
};

AbilityNode.ToDamage = {};
AbilityNode.ToDamage.Regular = function(caster: Entity, target: Entity) {
	const damageType = this.damageType ? this.damageType : caster.elementAtk;
	const atkMod     = this.atkMod || 1;
	const defMod     = this.defMod || 1;

	const atkDmg     = atkMod * this.atkFunc(caster, target);
	const def        = defMod * this.defFunc(caster, target);

	// let dmg = atkDmg - def;
	let dmg = Ability.Damage(atkDmg, def, caster.level, target.level);
	if (dmg < 0) { dmg = 0; }

	dmg = damageType.ApplyDmgType(target.elementDef, dmg);
	dmg = Math.floor(dmg);

	return -dmg;
};
AbilityNode.ToDamage.Heal = function(caster: Entity, target: Entity) {
	const atkMod  = this.atkMod || 1;

	let healing = atkMod * this.atkFunc(caster, target);

	if (healing < 0) { healing = 0; }
	healing = Math.floor(healing);

	return healing;
};

AbilityNode.AtkFunc = {};
AbilityNode.AtkFunc.Physical = (caster: Entity, target: Entity) => {
	return caster.PAttack();
};
AbilityNode.AtkFunc.Magical = (caster: Entity, target: Entity) => {
	return caster.MAttack();
};
AbilityNode.AtkFunc.Lust = (caster: Entity, target: Entity) => {
	return caster.LAttack();
};

AbilityNode.DefFunc = {};
AbilityNode.DefFunc.Physical = (caster: Entity, target: Entity) => {
	return target.PDefense();
};
AbilityNode.DefFunc.Magical = (caster: Entity, target: Entity) => {
	return target.MDefense();
};
AbilityNode.DefFunc.Lust = (caster: Entity, target: Entity) => {
	return target.LDefense();
};

AbilityNode.DamageFunc = {};
AbilityNode.DamageFunc.Physical = (encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
	if (target.PhysDmgHP(encounter, caster, dmg)) {
		// Reduce defense due to bad status effect
		const weakness = target.combatStatus.stats[StatusEffect.Weakness];
		if (weakness) {
			const reduction = target.LustLevel() * weakness.str;
			dmg += dmg * reduction;
			dmg = Math.floor(dmg);
		}

		return dmg;
	} else {
		return undefined;
	}
};
AbilityNode.DamageFunc.Magical = (encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
	return dmg;
};
AbilityNode.DamageFunc.Lust = (encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
	return dmg;
};

AbilityNode.DamagePool = {};
AbilityNode.DamagePool.Physical = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
	target.AddHPAbs(dmg);
};
AbilityNode.DamagePool.Magical = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
	target.AddSPAbs(dmg);
};
AbilityNode.DamagePool.Lust = (ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
	target.AddLustAbs(-dmg);
};

AbilityNode.Run = function(ability: Ability, encounter: Encounter, caster: Entity, target: Entity|Party|any, result: any) {
	const that = this;

	// OnCast, always apply no matter what
	_.each(that.onCast, (node) => {
		node(ability, encounter, caster, target);
	});

	// Checks if it's actually possible to cast
	if (!Ability.EnabledCost(that, caster)) { return; }
	// Drain cost
	Ability.ApplyCost(that, caster);

	const targets = _.has(target, "members") ? target.members : [target];

	let nrAttacks = that.nrAttacks;
	if (_.isFunction(nrAttacks)) {
		nrAttacks = nrAttacks(ability, encounter, caster, target, result);
	} else if (!_.isNumber(nrAttacks)) {
		nrAttacks = 1;
 	}

	// For each target
	_.each(targets, (e) => {
		// Only hit fallen if allowed
		if (!that.hitFallen && e.Incapacitated()) { return; }
		// For x number of strikes
		_.times(nrAttacks, () => {
			const hit = that.toHit ? Math.random() < that.toHit(caster, e) : true;
			// Check if it hits
			if (hit) {
				// If it can damage
				if (that.toDamage) {
					let dmg = that.toDamage(caster, e);

					if (that.damageFunc) {
						dmg = that.damageFunc(encounter, caster, e, dmg);
					}

					if (_.isNumber(dmg)) {
						// Apply damage to pools
						_.each(that.damagePool, (node) => {
							node(ability, encounter, caster, e, dmg);
						});

						// On dealing damage (dmg is negative)
						if (dmg <= 0) {
							_.each(that.onDamage, (node) => {
								node(ability, encounter, caster, e, dmg);
							});
						} else {
							_.each(that.onAbsorb, (node) => {
								node(ability, encounter, caster, e, dmg);
							});
						}
					}
				}

				// Always apply this on hit, no matter what
				_.each(that.onHit, (node) => {
					node(ability, encounter, caster, e, result);
				});
			} else {
				// On miss
				_.each(that.onMiss, (node) => {
					node(ability, encounter, caster, e);
				});
			}
		});
	});
};

export { AbilityNode };
