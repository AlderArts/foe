/*
 * 
 * Combat ability template
 * 
 */

TargetMode = {
	Self        : 1,
	Ally        : 2,
	Enemy       : 3,
	Party       : 4,
	Enemies     : 5,
	AllyNotSelf : 6,
	AllyFallen  : 7
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
	}
}

Element = {
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

DamageType = function(type) {
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

Abilities = {};

Ability = function() {
	this.targetMode = TargetMode.Enemy;
	this.name = "ABILITY";
	//TODO: Tooltip
	this.cost = { hp: null, sp: null, lp: null};
		
	//this.CastInternalOOC = function(caster, target) {
	//	Gui.NextPrompt(ShowAbilities);
	//}
	
}

Ability.prototype.Short = function() {
	return "NO DESC";
}

Ability.prototype.CastInternal = function(encounter, caster, target) {
	var parse = {
		name : caster.name,
		ability : this.name,
		target : TargetMode.ToString(this.targetMode)
		}
	
	Text.AddOutput("[name] used [ability] on [target] (not implemented).", parse);
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

// Used as entrypoint for PC/Party (active selection)
Ability.prototype.OnSelect = function(encounter, caster, backPrompt) {
	var ability = this;
	// TODO: Buttons (use portraits for target?)
	if(this.targetMode == TargetMode.Self) {
		this.Use(encounter, caster);
	}
	else if(this.targetMode == TargetMode.Ally) {
		var target = new Array();
		for(var i=0,j=party.members.length; i<j; i++){
			var t = party.members[i];
			if(t.Incapacitated()) continue;
			target.push({
			  	nameStr : t.name,
			  	func    : function(t) {
			  		ability.Use(encounter, caster, t);
			  	},
			  	enabled : ability.enabledTargetCondition(encounter, caster, t),
			  	obj     : t
			});
		};
		
		Gui.SetButtonsFromList(target, true, backPrompt);
	}
	else if(this.targetMode == TargetMode.AllyNotSelf) {
		var target = new Array();
		for(var i=0,j=party.members.length; i<j; i++){
			var t = party.members[i];
			// Skip self
			if(t == caster) continue;
			if(t.Incapacitated()) continue;
			target.push({
			  	nameStr : t.name,
			  	func    : function(t) {
			  		ability.Use(encounter, caster, t);
			  	},
			  	enabled : ability.enabledTargetCondition(encounter, caster, t),
			  	obj     : t
			});
		};
		
		Gui.SetButtonsFromList(target, true, backPrompt);
	}
	else if(this.targetMode == TargetMode.AllyFallen) {
		var target = new Array();
		for(var i=0,j=party.members.length; i<j; i++){
			var t = party.members[i];
			// Skip self (as you are obviously not fallen)
			if(t == caster) continue;
			if(!t.Incapacitated()) continue;
			target.push({
			  	nameStr : t.name,
			  	func    : function(t) {
			  		ability.Use(encounter, caster, t);
			  	},
			  	enabled : ability.enabledTargetCondition(encounter, caster, t),
			  	obj     : t
			});
		};
		
		Gui.SetButtonsFromList(target, true, backPrompt);
	}
	else if(this.targetMode == TargetMode.Enemy) {
		var enemies = encounter.enemy.members;
		var target = new Array();
		for(var i=0,j=enemies.length; i<j; i++){
			var t = enemies[i];
			if(t.Incapacitated()) continue;
			target.push({
			  	nameStr : t.name,
			  	func    : function(t) {
			  		ability.Use(encounter, caster, t);
			  	},
			  	enabled : ability.enabledTargetCondition(encounter, caster, t),
			  	obj     : t
			});
		};
		
		Gui.SetButtonsFromList(target, true, backPrompt);
	}
	else if(this.targetMode == TargetMode.Party) {
		this.Use(encounter, caster, party);
	}
	else if(this.targetMode == TargetMode.Enemies) {
		this.Use(encounter, caster, encounter.enemy);
	}
	// Fallback
	else
		encounter.CombatTick();
}

Ability.prototype.Use = function(encounter, caster, target) {
	if(this.cost.hp) caster.curHp -= this.cost.hp;
	if(this.cost.sp) caster.curSp -= this.cost.sp;
	if(this.cost.lp) caster.curLust -= this.cost.lp;
	
	this.CastInternal(encounter, caster, target);
}

Ability.prototype.UseOutOfCombat = function(caster, target) {
	if(this.cost.hp) caster.curHp -= this.cost.hp;
	if(this.cost.sp) caster.curSp -= this.cost.sp;
	if(this.cost.lp) caster.curLust -= this.cost.lp;
	
	this.CastInternalOOC(null, caster, target);
}

Ability.prototype.enabledCondition = function(encounter, caster) {
	if(this.cost.hp && this.cost.hp > caster.curHp) return false;
	if(this.cost.sp && this.cost.sp > caster.curSp) return false;
	if(this.cost.lp && this.cost.lp > caster.curLust) return false;
	return true;
}

Ability.prototype.enabledTargetCondition = function(encounter, caster, target) {
	return true;
}

Ability.prototype.CostStr = function() {
	var str = "";
	if(this.cost.hp || this.cost.sp || this.cost.lp) {
		if(this.cost.hp) str += Text.BoldColor(this.cost.hp + "HP ", "red");
		if(this.cost.sp) str += Text.BoldColor(this.cost.sp + "SP ", "blue");
		if(this.cost.lp) str += Text.BoldColor(this.cost.lp + "LP ", "pink");
	}
	else
		return "free";
	
	return str;
}

Ability.ToHit = function(hit, evade) {
	return 2 / (1+Math.exp(-2.5*hit/evade)) - 1;
}

/*
Ability.prototype.Damage = function(atk, def) {
	return atk * (atk / (2.2*def+30));
}
*/

Ability.Damage = function(atk, def, casterLvl, targetLvl) {
	// Safeguard
	casterLvl = casterLvl || 1;
	targetLvl = targetLvl || 1;
	
	var maxDefense = (2+growthPerPoint*growthPointsPerLevel*(targetLvl-1)) * (targetLvl+9)*2 + 100;
	var modRatio = Math.pow(maxDefense/def, 1.3);
	var logistics = 1/(1+Math.exp(-1*modRatio));
	var defFactor = 2*logistics-1;
	
	var levelFactor = 1.8 - 16/(5*Math.PI) * Math.atan((targetLvl+10)/(casterLvl+10));
	
	return defFactor * atk * levelFactor;
}

AbilityCollection = function(name) {
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
	var prompt = function() {
		Text.Clear();
		
		for(var i = 0; i < collection.AbilitySet.length; i++) {
			var ability = collection.AbilitySet[i];
			Text.AddOutput("[ability] ([cost]): [desc]<br/>",
				{ability: ability.name, cost: ability.CostStr(), desc: ability.Short()});
		}
	};
	
	var ret = function() {
		collection.OnSelect(encounter, caster, backPrompt);
		prompt();
	}
	
	prompt();
	Gui.SetButtonsFromCollection(encounter, caster, this.AbilitySet, ret, backPrompt);
}
