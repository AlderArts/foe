/*
 * 
 * Wildcat, lvl 1-2
 * 
 */

function Wildcat(gender) {
	Entity.call(this);
	
	if(gender == Gender.male) {
		this.avatar.combat     = Images.wildcat_male;
		this.name              = "Wildcat";
		this.monsterName       = "the wildcat";
		this.MonsterName       = "The wildcat";
		this.body.DefMale();
	}
	else if(gender == Gender.female) {
		this.avatar.combat     = Images.wildcat_fem;
		this.name              = "Wildcat";
		this.monsterName       = "the wildcat";
		this.MonsterName       = "The wildcat";
		this.body.DefFemale();
		if(Math.random() < 0.8)
			this.FirstVag().virgin = false;
	}
	else {
		this.avatar.combat     = Images.wildcat_fem;
		this.name              = "Wildcat";
		this.monsterName       = "the wildcat";
		this.MonsterName       = "The wildcat";
		this.body.DefHerm(true);
		if(Math.random() < 0.6)
			this.FirstVag().virgin = false;
	}
	
	this.maxHp.base        = 40;
	this.maxSp.base        = 20;
	this.maxLust.base      = 25;
	// Main stats
	this.strength.base     = 9;
	this.stamina.base      = 11;
	this.dexterity.base    = 14;
	this.intelligence.base = 11;
	this.spirit.base       = 12;
	this.libido.base       = 17;
	this.charisma.base     = 16;
	
	this.level             = 1;
	if(Math.random() > 0.8) this.level = 2;
	this.sexlevel          = 1;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 4;
	
	this.body.SetRace(Race.cat);
	
	this.body.SetBodyColor(Color.brown);
	
	this.body.SetEyeColor(Color.green);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.cat, Color.brown);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Wildcat.prototype = new Entity();
Wildcat.prototype.constructor = Wildcat;

Wildcat.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Felinix });
	if(Math.random() < 0.5)  drops.push({ it: Items.Whiskers });
	if(Math.random() < 0.5)  drops.push({ it: Items.HairBall });
	if(Math.random() < 0.5)  drops.push({ it: Items.CatClaw });
	return drops;
}

Wildcat.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! Meow!");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.7)
		Abilities.Attack.CastInternal(encounter, this, t);
	else if(choice < 0.9 && Abilities.Physical.Pierce.enabledCondition(encounter, this))
		Abilities.Physical.Pierce.CastInternal(encounter, this, t);
	else
		Abilities.Seduction.Tease.CastInternal(encounter, this, t);
}
