/*
 * 
 * Zebra Shaman
 * 
 */

Scenes.ZebraShaman = {};

function ZebraShaman(levelbonus) {
	Entity.call(this);
	
	//this.avatar.combat     = Images.wolf;
	this.name              = "Shaman";
	this.monsterName       = "the zebra shaman";
	this.MonsterName       = "The zebra shaman";
	this.body.DefMale();
	this.FirstCock().thickness.base = 7;
	this.FirstCock().length.base = 35;
	this.Balls().size.base = 6;
	
	this.maxHp.base        = 250;
	this.maxSp.base        = 150;
	this.maxLust.base      = 80;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 30;
	this.dexterity.base    = 16;
	this.intelligence.base = 30;
	this.spirit.base       = 35;
	this.libido.base       = 16;
	this.charisma.base     = 18;
	
	this.level             = 6 + Math.floor(Math.random() * 4);
	this.sexlevel          = 2;
	if(levelbonus)
		this.level += levelbonus;
	
	this.combatExp         = 6 + this.level;
	this.coinDrop          = 8 + this.level * 4;
	//TODO
	this.body.SetRace(Race.horse);
	this.body.SetBodyColor(Color.gray);
	
	this.body.SetEyeColor(Color.blue);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.horse, Color.black);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
ZebraShaman.prototype = new Entity();
ZebraShaman.prototype.constructor = ZebraShaman;

ZebraShaman.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Equinium });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseCum });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseHair });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseShoe });
	return drops;
}

ZebraShaman.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.name + " acts!");
	Text.NL();
	Text.Flush();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	//TODO
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

Scenes.ZebraShaman.LoneEnc = function() {
 	var enemy = new Party();
	enemy.AddMember(new ZebraShaman());
	var enc = new Encounter(enemy);
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}
