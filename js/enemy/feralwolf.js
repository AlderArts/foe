/*
 * 
 * Mothgirl, lvl 4-6
 * 
 */

function FeralWolf() {
	Entity.call(this);
	
	this.avatar.combat     = Images.wolf;
	this.name              = "Wolf";
	this.monsterName       = "the wolf";
	this.MonsterName       = "The wolf";
	this.body.DefMale(); // TODO: Feral form
	
	this.maxHp.base        = 200;
	this.maxSp.base        = 60;
	this.maxLust.base      = 45;
	// Main stats
	this.strength.base     = 25;
	this.stamina.base      = 20;
	this.dexterity.base    = 19;
	this.intelligence.base = 15;
	this.spirit.base       = 19;
	this.libido.base       = 18;
	this.charisma.base     = 14;
	
	this.level             = 4 + Math.floor(Math.random() * 4);
	this.sexlevel          = 2;
	
	this.combatExp         = 5 + this.level;
	this.coinDrop          = 2 + this.level * 4;
	
	this.body.SetRace(Race.wolf);
	this.body.SetBodyColor(Color.gray);
	
	this.body.SetEyeColor(Color.gold);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.wolf, Color.gray);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
FeralWolf.prototype = new Entity();
FeralWolf.prototype.constructor = FeralWolf;

FeralWolf.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Lobos });
	if(Math.random() < 0.5)  drops.push({ it: Items.WolfFang });
	if(Math.random() < 0.5)  drops.push({ it: Items.WolfPelt });
	if(Math.random() < 0.5)  drops.push({ it: Items.CanisRoot });
	return drops;
}

FeralWolf.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! Growl!");
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
	else if(choice < 0.95 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this))
		Abilities.Physical.CrushingStrike.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}
