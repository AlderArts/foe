/*
 * 
 * Define Lagon
 * 
 */

Scenes.Lagon = {};



function Lagon(storage) {
	Entity.call(this);
	
	this.sexlevel          = 8;
	
	if(storage) this.FromStorage(storage);
}
Lagon.prototype = new Entity();
Lagon.prototype.constructor = Lagon;

Lagon.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Lagon.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

//For first fights
function LagonRegular() {
	Entity.call(this);
	
	this.name              = "Lagon";
	
	this.avatar.combat     = Images.lagon_r;
	
	this.maxHp.base        = 2000;
	this.maxSp.base        = 500;
	this.maxLust.base      = 500;
	// Main stats
	this.strength.base     = 100;
	this.stamina.base      = 120;
	this.dexterity.base    = 150;
	this.intelligence.base = 90;
	this.spirit.base       = 100;
	this.libido.base       = 100;
	this.charisma.base     = 80;
	
	this.level             = 15;
	this.sexlevel          = 8;
	
	this.combatExp         = 200;
	this.coinDrop          = 500;
	
	this.body.DefMale();
	
	this.FirstCock().thickness.base = 7;
	this.FirstCock().length.base = 38;
	this.Balls().size.base = 6;
	
	this.Butt().buttSize.base = 2;
	
	this.body.SetRace(Race.rabbit);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	this.body.SetBodyColor(Color.white);
	this.body.SetEyeColor(Color.blue);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagonRegular.prototype = new Entity();
LagonRegular.prototype.constructor = LagonRegular;

//TODO
LagonRegular.prototype.DropTable = function() {
	var drops = [];
	drops.push({ it: Items.Leporine });
	return drops;
}

//TODO
LagonRegular.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.6)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.DAttack.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}

//For final fight
function LagonBrute() {
	Entity.call(this);
	
	this.name              = "Lagon";
	
	this.avatar.combat     = Images.lagon_b;
	
	this.maxHp.base        = 4000;
	this.maxSp.base        = 700;
	this.maxLust.base      = 500;
	// Main stats
	this.strength.base     = 180;
	this.stamina.base      = 150;
	this.dexterity.base    = 100;
	this.intelligence.base = 60;
	this.spirit.base       = 80;
	this.libido.base       = 100;
	this.charisma.base     = 60;
	
	this.level             = 20;
	this.sexlevel          = 8;
	
	this.combatExp         = 500;
	this.coinDrop          = 1000;
	
	this.body.DefMale();
	
	this.FirstCock().thickness.base = 11;
	this.FirstCock().length.base = 60;
	this.Balls().size.base = 10;
	
	this.Butt().buttSize.base = 2;
	
	this.body.SetRace(Race.rabbit);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	this.body.SetBodyColor(Color.white);
	this.body.SetEyeColor(Color.red);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagonBrute.prototype = new Entity();
LagonBrute.prototype.constructor = LagonBrute;

//TODO
LagonBrute.prototype.DropTable = function() {
	var drops = [];
	drops.push({ it: Items.Leporine });
	return drops;
}

//TODO
LagonBrute.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.6)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.DAttack.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}
