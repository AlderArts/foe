/*
 * 
 * Nagagirl, lvl 6-8
 * 
 */

function Nagagirl() {
	Entity.call(this);
	
	this.avatar.combat     = Images.nagagirl;
	this.name              = "Nagagirl";
	this.monsterName       = "the Nagagirl";
	this.MonsterName       = "The Nagagirl";
	this.body.DefFemale();
	/*
	if(Math.random() < 0.9)
		this.FirstVag().virgin = false;
		*/
	
	this.maxHp.base        = 420;
	this.maxSp.base        = 80;
	this.maxLust.base      = 55;
	// Main stats
	this.strength.base     = 40;
	this.stamina.base      = 34;
	this.dexterity.base    = 25;
	this.intelligence.base = 22;
	this.spirit.base       = 17;
	this.libido.base       = 23;
	this.charisma.base     = 22;
	
	this.level             = 6 + Math.floor(Math.random() * 4);
	this.sexlevel          = 6;
	
	this.combatExp         = 7 + this.level;
	this.coinDrop          = 4 + this.level * 9;
	
	this.body.SetBodyColor(Color.white);
	
	this.body.SetEyeColor(Color.red);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.serpent, Color.green);
//	TF.SetAppendage(this.Appendages(), AppendageType.horn, Race.serpent, Color.red);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Nagagirl.prototype = new Entity();
Nagagirl.prototype.constructor = Nagagirl;

Nagagirl.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.755) drops.push({ it: Items.Lepida });
	if(Math.random() < 0.5)  drops.push({ it: Items.MWing });
	if(Math.random() < 0.5)  drops.push({ it: Items.FruitSeed });
	if(Math.random() < 0.5)  drops.push({ it: Items.MAntenna });
	return drops;
}

Nagagirl.prototype.Act = function(encounter, activeChar) {
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
		Abilities.Attack.CastInternal(encounter, this, t);
	else if(choice < 0.7 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.Pierce.CastInternal(encounter, this, t);
	else if(choice < 0.9 && Abilities.Seduction.Distract.enabledCondition(encounter, this))
		Abilities.Seduction.Distract.CastInternal(encounter, this, t);
	else
		Abilities.Seduction.Tease.CastInternal(encounter, this, t);
}
