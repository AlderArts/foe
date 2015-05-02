

AbilityNode = function(opts) {
	this.onCast   = opts.onCast   || [];
	this.onHit    = opts.onHit    || [];
	this.onMiss   = opts.onMiss   || [];
	this.onDamage = opts.onDamage || [];
	this.onAbsorb = opts.onAbsorb || [];
	
	this.hitFallen = opts.hitFallen || false;
	
	this.cost = { hp: null, sp: null, lp: null};
	
	// A node can be a regular function too, so set things up this way
	return _.bind(AbilityNode.Run, this);
}

// TODO Damage pool target
// TODO Damage type (source)


AbilityNode.Run = function(ability, encounter, caster, target, result) {
	_.each(this.onCast, function(node) {
		node(ability, encounter, caster, target);
	});
	
	// TODO: This may not work... no checks if it's actually possible to cast
	if(this.cost.hp) caster.curHp   -= this.cost.hp;
	if(this.cost.sp) caster.curSp   -= this.cost.sp;
	if(this.cost.lp) caster.curLust -= this.cost.lp;
	
	var targets;
	if(_.has(target, 'members'))
		targets = target.members;
	else
		targets = [target];
	
	//TODO variables
	var atkMod     = this.atkMod || 1;
	var defMod     = this.defMod || 1;
	var damageType = new DamageType(this.damageType);
	var nrAttacks  = this.nrAttacks || 1;
	
	for(var i = 0; i < targets.length; i++) {
		var e      = targets[i];
		if(!this.hitFallen && e.Incapacitated()) continue;
		
		for(var j = 0; j < nrAttacks; j++) {
			var atkDmg     = atkMod * caster.PAttack();
			var def = defMod * e.PDefense();
			var hit = hitMod * caster.PHit();
			var evade = e.PEvade();
			var toHit = Ability.ToHit(hit, evade);
			if(Math.random() < toHit) {
				var atkDmg = atkMod * caster.MAttack();
				var def    = defMod * e.MDefense();
				
				//var dmg = atkDmg - def;
				var dmg = Ability.Damage(atkDmg, def, caster.level, e.level);
				if(dmg < 0) dmg = 0;
				
				dmg = damageType.ApplyDmgType(e.elementDef, dmg);
				dmg = Math.floor(dmg);
			
				e.AddHPAbs(-dmg);
				
				if(dmg >= 0) {
					_.each(this.onDamage, function(node) {
						node(ability, encounter, caster, e, dmg);
					});
				}
				else {
					_.each(this.onAbsorb, function(node) {
						node(ability, encounter, caster, e, -dmg);
					});
				}
				_.each(this.onHit, function(node) {
					node(ability, encounter, caster, e, dmg);
				});
			}
			else {
				_.each(this.onMiss, function(node) {
					node(ability, encounter, caster, e);
				});
			}
		}
	}
	Text.Flush();
}
