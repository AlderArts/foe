
function CombatItem(id, name) {
	Item.call(this, id, name);
	this.targetMode = TargetMode.Ally;
	this.consume = true;
}
CombatItem.prototype = new Item();
CombatItem.prototype.constructor = CombatItem;

CombatItem.prototype.UseCombat = function(inv, encounter, caster, target) {
	if(inv && this.consume) {
		inv.RemoveItem(this);
	}
	
	this.UseCombatInternal(encounter, caster, target);
}
CombatItem.prototype.UseCombatInternal = function(encounter, caster, target) {
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

AttackItem = function(id, name) {
	CombatItem.call(this, id, name);
	this.damageType   = {}; // Set to null to use weapon attack
	this.targetMode   = TargetMode.Enemy;
	
	this.OnCast       = null;
	this.TargetEffect = null;
}
AttackItem.prototype = new AttackItem();
AttackItem.prototype.constructor = AttackItem;

AttackItem.prototype.UseCombatInternal = function(encounter, caster, target) {
	var atkMod     = this.atkMod || 1;
	var defMod     = this.defMod || 1;
	var hitMod     = this.hitMod || 1;
	var nrAttacks  = this.nrAttacks || 1;
	var targetMode = this.targetMode || TargetMode.Enemy;
	
	var damageType = new DamageType();
	if(this.damageType)
		damageType = new DamageType(this.damageType);

	if(this.OnCast)
		this.OnCast(encounter, caster, target);
	
	var targets;
	if(targetMode == TargetMode.Enemies)
		targets = target.members;
	else //(targetMode == TargetMode.Enemy)
		targets = [target];
	
	for(var i = 0; i < targets.length; i++) {
		var e   = targets[i];
		
		for(var j = 0; j < nrAttacks; j++) {
			var atkDmg = atkMod;
			var def = defMod * e.PDefense();
			var hit = hitMod * caster.PHit();
			var evade = e.PEvade();
			var toHit = Ability.ToHit(hit, evade);
			if(Math.random() < toHit) {
				//var dmg = atkDmg - def;
				var dmg = Ability.Damage(atkDmg, def, caster.level, e.level);
				if(dmg < 0) dmg = 0;
				
				dmg = damageType.ApplyDmgType(e.elementDef, dmg);
				dmg = Math.floor(dmg);
				
				if(e.PhysDmgHP(encounter, caster, dmg)) {
					e.AddHPAbs(-dmg);
					
					if(dmg >= 0) {
						if(this.OnHit) this.OnHit(encounter, caster, e, dmg);
					}
					else {
						if(this.OnAbsorb) this.OnAbsorb(encounter, caster, e, -dmg);
					}
					if(this.TargetEffect) this.TargetEffect(encounter, caster, e);
				}
			}
			else
				if(this.OnMiss) this.OnMiss(encounter, caster, e);
		}
	}
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
// Default messages
AttackPhysical.prototype.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tName : target.nameDesc() };
	Text.AddOutput("The attack hits [tName] for " + Text.BoldColor(dmg, "#800000") + " damage!", parse);
	Text.Newline();
}
AttackPhysical.prototype.OnMiss = function(encounter, caster, target) {
	var parse = { tName : target.nameDesc() };
	Text.AddOutput("The attack narrowly misses [tName], dealing no damage!", parse);
	Text.Newline();
}
AttackPhysical.prototype.OnAbsorb = function(encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.AddOutput("[tName] absorb[s] the attack, gaining " + Text.BoldColor(dmg, "#008000") + " health!", parse);
	Text.Newline();
}



Items.Combat = {};

Items.Combat.HPotion = new CombatItem("pot0", "H.Potion");
Items.Combat.HPotion.price = 25;
Items.Combat.HPotion.Short = function() { return "A health potion."; }
Items.Combat.HPotion.Long = function() { return "A weak health potion."; }
Items.Combat.HPotion.targetMode = TargetMode.Ally;
Items.Combat.HPotion.UseCombatInternal = function(encounter, caster, target) {
	var parse = {
		
	};
	// TODO
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

Items.Combat.SmokeBomb = new CombatItem("esc0", "S.Bomb");
Items.Combat.SmokeBomb.price = 100;
Items.Combat.SmokeBomb.Short = function() { return "A smoke bomb."; }
Items.Combat.SmokeBomb.Long = function() { return "A glass sphere containing an alchemical concoction that disperses in thick, oily smoke when mixed with air. Smashing the bomb creates instant cover."; }
Items.Combat.SmokeBomb.targetMode = TargetMode.Self;
Items.Combat.SmokeBomb.UseCombatInternal = function(encounter, caster) {
	var parse = {
		Name   : caster.NameDesc(),
		es     : caster.plural() ? "" : "es",
		hisher : caster.hisher()
	};
	
	Text.Add("[Name] toss[es] a smoke bomb at the ground. It explodes in a cloud of smoke, covering for [hisher] escape!", parse);
	Text.NL();
	Text.Flush();
	
	encounter.onRun();
}

Items.Combat.DecoyStick = new CombatItem("decoy0", "Decoy");
Items.Combat.DecoyStick.price = 250;
Items.Combat.DecoyStick.Short = function() { return "A decoy stick."; }
Items.Combat.DecoyStick.Long = function() { return "A stick containing the shards of an enchanted mirror, when broken it will generate illusory copies of the user, confusing targets."; }
Items.Combat.DecoyStick.targetMode = TargetMode.Self;
Items.Combat.DecoyStick.UseCombatInternal = function(encounter, caster) {
	var parse = {
		Name  : caster.NameDesc(),
		heshe : caster.heshe(),
		s     : caster.plural() ? "" : "s",
		has   : caster.has()
	};
	
	Text.Clear();
	Text.Add("[Name] grab[s] a decoy stick and breaks it. A flash of light emanates, and when it subsides [heshe] [has] split into four copies.", parse);
	Text.Flush();
	
	Status.Decoy(caster, {copies: 3});
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

Items.Combat.LustDart = new AttackItem("dart0", "Lust darts");
Items.Combat.LustDart.price = 25;
Items.Combat.LustDart.Short = function() { return "Aphrodisiac-tipped darts."; }
Items.Combat.LustDart.Long = function() { return "Throwing darts smeared in potent aphrodisiacs. On a hit, they will charm an enemy."; }
Items.Combat.LustDart.targetMode = TargetMode.Enemy;
Items.Combat.LustDart.OnHit = null;
Items.Combat.LustDart.OnAbsorb = null;
Items.Combat.LustDart.OnCast = function(encounter, caster, target) {
	var parse = {
		Name : caster.NameDesc(),
		s    : caster.plural() ? "" : "s",
		target : target.nameDesc()
	};
	Text.Add("[Name] throw[s] a lust dart at [target].", parse);
	Text.NL();
}
Items.Combat.LustDart.TargetEffect = function(encounter, caster, target) {
	var parse = {
		Name : caster.NameDesc(),
		s    : caster.plural() ? "" : "s",
		himher : target.himher(),
		target : target.nameDesc(),
		Target : target.NameDesc(),
		is     : target.is()
	};
	Text.Add("It strikes [target], inflicting [himher] with charm!", parse);
	Text.NL();
	if(Status.Horny(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
		Text.Add("[Target] [is] charmed!", parse);
	}
	else {
		Text.Add("[Target] resist[s] the aphrodisiac!", parse);
	}
	Text.NL();
}
Items.Combat.LustDart.OnMiss = function(encounter, caster, target) {
	var parse = {
		Name : caster.NameDesc(),
		s    : caster.plural() ? "" : "s",
		target : target.nameDesc()
	};
	Text.Add("[Target] manage[s] to deftly sidestep the dart.", parse);
	Text.NL();
}


Items.Combat.PoisonDart = new AttackItem("dart1", "Poison darts");
Items.Combat.PoisonDart.price = 40;
Items.Combat.PoisonDart.Short = function() { return "Poison-tipped darts."; }
Items.Combat.PoisonDart.Long = function() { return "Throwing darts smeared in a fast-acting venom, making them quite dangerous."; }
Items.Combat.PoisonDart.targetMode = TargetMode.Enemy;
Items.Combat.PoisonDart.OnHit = null;
Items.Combat.PoisonDart.OnAbsorb = null;
Items.Combat.PoisonDart.OnCast = function(encounter, caster, target) {
	var parse = {
		Name : caster.NameDesc(),
		s    : caster.plural() ? "" : "s",
		target : target.nameDesc()
	};
	Text.Add("[Name] throw[s] a poison dart at [target].", parse);
	Text.NL();
}
Items.Combat.PoisonDart.TargetEffect = function(encounter, caster, target) {
	var parse = {
		Name : caster.NameDesc(),
		s    : caster.plural() ? "" : "s",
		himher : target.himher(),
		target : target.nameDesc(),
		Target : target.NameDesc(),
		is     : target.is()
	};
	Text.Add("It strikes [target] inflicting [himher] with poison!", parse);
	Text.NL();
	if(Status.Venom(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
		Text.Add("[Target] [is] poisoned!", parse);
	}
	else {
		Text.Add("[Target] resist[s] the poison!", parse);
	}
	Text.NL();
}
Items.Combat.PoisonDart.OnMiss = function(encounter, caster, target) {
	var parse = {
		Name : caster.NameDesc(),
		s    : caster.plural() ? "" : "s",
		target : target.nameDesc()
	};
	Text.Add("[Target] manage[s] to deftly sidestep the dart.", parse);
	Text.NL();
}


