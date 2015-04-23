/*
 * Lt Corishev
 */

function Corishev(storage) {
	BossEntity.call(this);
	
	this.avatar.combat     = Images.corishev;
	
	this.name              = "Corishev";
	
	this.maxHp.base        = 1500;
	this.maxSp.base        = 400;
	this.maxLust.base      = 500;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 50;
	this.dexterity.base    = 85;
	this.intelligence.base = 30;
	this.spirit.base       = 40;
	this.libido.base       = 50;
	this.charisma.base     = 30;
	
	this.level             = 12;
	this.sexlevel          = 6;
	
	this.combatExp         = 300;
	this.coinDrop          = 1000;
	
	this.elementDef.dmg[Element.lust] = -1;
	
	this.body              = new Body(this);
	
	this.body.DefMale();
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
	// Start with some lust
	this.AddLustFraction(0.4);

	if(storage) this.FromStorage(storage);
}
Corishev.prototype = new BossEntity();
Corishev.prototype.constructor = Corishev;

Corishev.prototype.DropTable = function() {
	var drops = [];
	drops.push({ it: Items.Weapons.GolWhip });
	drops.push({ it: Items.Combat.LustDart });
	drops.push({ it: Items.Accessories.SimpleCuffs });
	return drops;
}

Corishev.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);
	
	var choice = Math.random();
	
	//TODO
	if(choice < 0.1 && Abilities.EnemySkill.TSnare.enabledCondition(encounter, this))
		Abilities.EnemySkill.TSnare.Use(encounter, this, t);
	else if(choice < 0.2 && Abilities.EnemySkill.TSpray.enabledCondition(encounter, this))
		Abilities.EnemySkill.TSpray.Use(encounter, this, party);
	else if(choice < 0.3 && Abilities.EnemySkill.TVenom.enabledCondition(encounter, this))
		Abilities.EnemySkill.TVenom.Use(encounter, this, t);
	else if(choice < 0.4 && Abilities.EnemySkill.TRavage.enabledCondition(encounter, this))
		Abilities.EnemySkill.TRavage.Use(encounter, this, t);
	else
		Abilities.EnemySkill.TWhip.Use(encounter, this, t);
}
