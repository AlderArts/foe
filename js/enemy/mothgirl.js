/*
 * 
 * Mothgirl, lvl 4-6
 * 
 */

function Mothgirl() {
	Entity.call(this);
	
	this.avatar.combat     = Images.mothgirl;
	this.name              = "Mothgirl";
	this.monsterName       = "the mothgirl";
	this.MonsterName       = "The mothgirl";
	this.body.DefFemale();
	/*
	if(Math.random() < 0.9)
		this.FirstVag().virgin = false;
		*/
	
	this.maxHp.base        = 120;
	this.maxSp.base        = 40;
	this.maxLust.base      = 45;
	// Main stats
	this.strength.base     = 15;
	this.stamina.base      = 14;
	this.dexterity.base    = 25;
	this.intelligence.base = 18;
	this.spirit.base       = 13;
	this.libido.base       = 20;
	this.charisma.base     = 20;
	
	this.level             = 4 + Math.floor(Math.random() * 4);
	this.sexlevel          = 3;
	
	this.combatExp         = 5 + this.level;
	this.coinDrop          = 2 + this.level * 4;
	
	this.body.SetBodyColor(Color.white);
	
	this.body.SetEyeColor(Color.red);
	
	TF.SetAppendage(this.Back(), AppendageType.wing, Race.moth, Color.purple);
	TF.SetAppendage(this.Appendages(), AppendageType.antenna, Race.moth, Color.purple);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Mothgirl.prototype = new Entity();
Mothgirl.prototype.constructor = Mothgirl;

Mothgirl.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Lepida });
	if(Math.random() < 0.5)  drops.push({ it: Items.MWing });
	if(Math.random() < 0.5)  drops.push({ it: Items.FruitSeed });
	if(Math.random() < 0.5)  drops.push({ it: Items.MAntenna });
	return drops;
}

Mothgirl.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! Bounce bounce!");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.5)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.7 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.Pierce.Use(encounter, this, t);
	else if(choice < 0.9 && Abilities.Seduction.Distract.enabledCondition(encounter, this))
		Abilities.Seduction.Distract.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}
