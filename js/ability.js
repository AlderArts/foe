/*
 *
 * Combat ability template
 *
 */

let TargetMode = {
	Self        : 1,
	Ally        : 2,
	Enemy       : 3,
	Party       : 4,
	Enemies     : 5,
	AllyNotSelf : 6,
	AllyFallen  : 7,
	All         : 8
}

TargetMode.ToString = function(mode) {
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

let Element = {
	pSlash   : 0,
	pBlunt   : 1,
	pPierce  : 2,
	mVoid    : 3,
	mFire    : 4,
	mIce     : 5,
	mThunder : 6,
	mEarth   : 7,
	mWater   : 8,
	mWind    : 9,
	mLight   : 10,
	mDark    : 11,
	mNature  : 12,
	lust     : 13,

	numElements : 14
}

function DamageType(type) {
	type = type || {};
	this.dmg = [];
	this.dmg[Element.pSlash]   = type.pSlash   || 0;
	this.dmg[Element.pBlunt]   = type.pBlunt   || 0;
	this.dmg[Element.pPierce]  = type.pPierce  || 0;
	this.dmg[Element.mVoid]    = type.mVoid    || 0;
	this.dmg[Element.mFire]    = type.mFire    || 0;
	this.dmg[Element.mIce]     = type.mIce     || 0;
	this.dmg[Element.mThunder] = type.mThunder || 0;
	this.dmg[Element.mEarth]   = type.mEarth   || 0;
	this.dmg[Element.mWater]   = type.mWater   || 0;
	this.dmg[Element.mWind]    = type.mWind    || 0;
	this.dmg[Element.mLight]   = type.mLight   || 0;
	this.dmg[Element.mDark]    = type.mDark    || 0;
	this.dmg[Element.mNature]  = type.mNature  || 0;
	this.dmg[Element.lust]     = type.lust     || 0;
}

DamageType.prototype.Add = function(other) {
	for(var i = 0; i < Element.numElements; i++)
		this.dmg[i] += other.dmg[i];
}

DamageType.prototype.ApplyDmgType = function(def, atkDmg) {
	var ret = 0;
	for(var i = 0; i < Element.numElements; i++) {
		var dmg = this.dmg[i] * atkDmg;
		dmg -= dmg * def.dmg[i];
		ret += dmg;
	}
	return ret;
}

let Abilities = {};

function Ability(name) {
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

Ability.prototype.Short = function() {
	return "NO DESC";
}

Ability.prototype.StartCast = function(encounter, caster, target) {
	Text.NL();
	_.each(this.onCast, function(node) {
		node(this, encounter, caster, target);
	});
}

Ability.prototype.CastInternal = function(encounter, caster, target) {
	Text.NL();
	_.each(this.castTree, function(node) {
		node(this, encounter, caster, target);
	});

	caster.FinishCastInternal(this, encounter, caster, target);
}

// Used as entrypoint for PC/Party (active selection)
Ability.prototype.OnSelect = function(encounter, caster, backPrompt, ext) {
	var ability = this;
	// TODO: Buttons (use portraits for target?)

	var target = [];

	switch(ability.targetMode) {
		case TargetMode.All:
			_.each(party.members, function(t) {
				// Don't add incapacitated
				var incap = t.Incapacitated();
				if(incap) return;

				target.push({
					nameStr : t.name,
					func    : function(t) {
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
					func    : function(t) {
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
					func    : function(t) {
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
					func    : function(t) {
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

Ability.EnabledCost = function(ab, caster) {
	if(_.isObject(ab.cost)) {
		if(ab.cost.hp && ab.cost.hp > caster.curHp) return false;
		if(ab.cost.sp && ab.cost.sp > caster.curSp) return false;
		if(ab.cost.lp && ab.cost.lp > caster.curLust) return false;
	}
	return true;
}

Ability.ApplyCost = function(ab, caster) {
	if(_.isObject(ab.cost)) {
		if(ab.cost.hp) caster.curHp -= ab.cost.hp;
		if(ab.cost.sp) caster.curSp -= ab.cost.sp;
		if(ab.cost.lp) caster.curLust -= ab.cost.lp;
	}
}

Ability.prototype.Use = function(encounter, caster, target) {
	Ability.ApplyCost(this, caster);
	this.StartCast(encounter, caster, target);

	var entry = caster.GetCombatEntry(encounter);

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

Ability.prototype.UseOutOfCombat = function(caster, target) {
	Ability.ApplyCost(this, caster);
	this.StartCast(null, caster, target);
	this.CastInternal(null, caster, target);
}

Ability.prototype.enabledCondition = function(encounter, caster) {
	var onCooldown = encounter ? this.OnCooldown(caster.GetCombatEntry(encounter)) : false;

	return Ability.EnabledCost(this, caster) && !onCooldown;
}

Ability.prototype.OnCooldown = function(casterEntry) {
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

Ability.prototype.enabledTargetCondition = function(encounter, caster, target) {
	return true;
}

Ability.prototype.CostStr = function() {
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

Ability.ToHit = function(hit, evade) {
	return 2 / (1+Math.exp(-2.5*hit/evade)) - 1;
}

/*
Ability.Damage = function(atk, def) {
	return atk * (atk / (2.2*def+30));
}
*/
Ability.Damage = function(atk, def, casterLvl, targetLvl) {
	// Safeguard
	casterLvl = casterLvl || 1;
	targetLvl = targetLvl || 1;

	var maxDefense = (2+Stat.growthPerPoint*Stat.growthPointsPerLevel*(targetLvl-1)) * (targetLvl+9)*2 + 100;
	var modRatio = Math.pow(maxDefense/def, 1.3);
	var logistics = 1/(1+Math.exp(-1*modRatio));
	var defFactor = 2*logistics-1;

	var levelFactor = 1.8 - 16/(5*Math.PI) * Math.atan((targetLvl+10)/(casterLvl+10));

	return defFactor * atk * levelFactor;
}

function AbilityCollection(name) {
	this.name = name;

	this.AbilitySet = [];
	//TODO: Tooltip
}

AbilityCollection.prototype.HasAbility = function(ability) {
	var idx = this.AbilitySet.indexOf(ability); // Is the ability already part of the set?
	return (idx!=-1);
}

AbilityCollection.prototype.AddAbility = function(ability) {
	var idx = this.AbilitySet.indexOf(ability); // Is the ability already part of the set?
	if(idx==-1)
		this.AbilitySet.push(ability);
}

AbilityCollection.prototype.Empty = function() {
	return this.AbilitySet.length == 0;
}

AbilityCollection.prototype.OnSelect = function(encounter, caster, backPrompt) {
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

export { Ability, Abilities, AbilityCollection, DamageType, Element, TargetMode };
