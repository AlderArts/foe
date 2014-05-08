/*
 * 
 * Alpha demon
 * 
 */

function AlphaDemon() {
	BossEntity.call(this);
	
	this.avatar.combat     = Images.alphademon;
	
	this.name              = "Alpha demon";
	this.monsterName       = "the demon";
	this.MonsterName       = "The demon";
	this.maxHp.base        = 4000;
	this.maxSp.base        = 3000;
	this.maxLust.base      = 600;
	// Main stats
	this.strength.base     = 150;
	this.stamina.base      = 180;
	this.dexterity.base    = -10;
	this.intelligence.base = 35;
	this.spirit.base       = 120;
	this.libido.base       = 450;
	this.charisma.base     = 59;
	
	this.level             = 40;
	this.sexlevel          = 35;
	
	this.combatExp         = 600 + this.level * 30;
	this.coinDrop          = 400 + this.level * 20;
	
	this.body              = new Body();
	
	this.body.DefMale();
	
	this.body.SetRace(Race.demon);
	
	this.body.SetBodyColor(Color.red);
	
	this.body.SetEyeColor(Color.purple);
	
	this.turnCounter = 0;

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
AlphaDemon.prototype = new BossEntity();
AlphaDemon.prototype.constructor = AlphaDemon;

AlphaDemon.prototype.PoisonResist = function() {
	return 0.8;
}

AlphaDemon.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Infernum });
	if(Math.random() < 0.5)  drops.push({ it: Items.CorruptPlant });
	if(Math.random() < 0.5)  drops.push({ it: Items.BlackGem });
	if(Math.random() < 0.95)  drops.push({ it: Items.CorruptSeed });
	return drops;
}


AlphaDemon.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! YAHAHAHAHAHAHAHA!");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.2)
		Abilities.Attack.CastInternal(encounter, this, t);
	else if(choice < 0.3 && Abilities.Black.ThunderStorm.enabledCondition(encounter, this))
		Abilities.Black.ThunderStorm.CastInternal(encounter, this, party);
	else if(choice < 0.4 && Abilities.Black.WindShear.enabledCondition(encounter, this))
		Abilities.Black.WindShear.CastInternal(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.QAttack.enabledCondition(encounter, this))
		Abilities.Physical.QAttack.CastInternal(encounter, this, t);
	else if(choice < 0.7 && Abilities.Physical.Frenzy.enabledCondition(encounter, this))
		Abilities.Physical.Frenzy.CastInternal(encounter, this, t);
	else if(choice < 0.8 && Abilities.Black.Hellfire.enabledCondition(encounter, this))
		Abilities.Black.Hellfire.CastInternal(encounter, this, party);
	else if(choice < 0.9 && Abilities.Seduction.Rut.enabledCondition(encounter, this))
		Abilities.Seduction.Rut.CastInternal(encounter, this, t);
	else
		Abilities.Attack.CastInternal(encounter, this, t);
}
