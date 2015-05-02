

AbilityNode = function(opts) {
	this.cost = opts.cost || { hp: null, sp: null, lp: null};
	
	this.onCast   = opts.onCast   || [];
	this.onHit    = opts.onHit    || [];
	this.onMiss   = opts.onMiss   || [];
	this.onDamage = opts.onDamage || [];
	this.onAbsorb = opts.onAbsorb || [];
	
	this.hitFallen = opts.hitFallen || false;
	
	this.toHit = opts.toHit || AbilityNode.ToHit.Physical;
	
	// A node can be a regular function too, so set things up this way
	return _.bind(AbilityNode.Run, this);
}

AbilityNode.ToHit = {};
AbilityNode.ToHit.Physical = function(caster, target) {
	var hitMod     = this.hitMod || 1;
	var hit = hitMod * caster.PHit();
	var evade = e.PEvade();
	
	return Ability.ToHit(hit, evade);
}

AbilityNode.ToHit.Magical = function(caster, target) {
	var hitMod     = this.hitMod || 1;
	var hit = hitMod * caster.MHit();
	var evade = e.MEvade();
	
	return Ability.ToHit(hit, evade);
}

AbilityNode.ToHit.Lust = function(caster, target) {
	var hitMod     = this.hitMod || 1;
	var hit = hitMod * caster.LHit();
	var evade = e.LEvade();
	
	return Ability.ToHit(hit, evade);
}

// TODO Damage type (source)
AbilityNode.ToDamage = {};
AbilityNode.ToDamage.Physical = function(caster, target) {
	var atkMod     = that.atkMod || 1;
	var defMod     = that.defMod || 1;
	
	var atkDmg     = atkMod * caster.PAttack();
	var def        = defMod * e.PDefense();
	
	//var dmg = atkDmg - def;
	var dmg = Ability.Damage(atkDmg, def, caster.level, e.level);
	if(dmg < 0) dmg = 0;
	
	dmg = damageType.ApplyDmgType(e.elementDef, dmg);
	dmg = Math.floor(dmg);
	
	return dmg;
}

// TODO Damage pool target


AbilityNode.Run = function(ability, encounter, caster, target, result) {
	var that = this;
	_.each(that.onCast, function(node) {
		node(ability, encounter, caster, target);
	});
	
	// Checks if it's actually possible to cast
	if(!Ability.EnabledCost(that, caster)) return;
	// Drain cost	
	Ability.ApplyCost(that, caster);
	
	var targets = _.has(target, 'members') ? target.members : [target];
	
	//TODO variables
	var nrAttacks  = that.nrAttacks || 1;
	var damageType = new DamageType(that.damageType);
	
	_.each(targets, function(e) {
		if(!that.hitFallen && e.Incapacitated()) return;
		
		_.times(nrAttacks, function() {
			
			if(Math.random() < that.toHit(caster, e)) {
				if(that.ToDamage) {
					var dmg = that.ToDamage(caster, e);
					
					//TODO Damage pool targets
					e.AddHPAbs(-dmg);
	
					if(dmg >= 0) {
						_.each(that.onDamage, function(node) {
							node(ability, encounter, caster, e, dmg);
						});
					}
					else {
						_.each(that.onAbsorb, function(node) {
							node(ability, encounter, caster, e, -dmg);
						});
					}
				}
				_.each(that.onHit, function(node) {
					node(ability, encounter, caster, e, dmg);
				});
			}
			else {
				_.each(that.onMiss, function(node) {
					node(ability, encounter, caster, e);
				});
			}
		});
	});
}
