/*
 * 
 * Dryad boss
 * 
 */

Scenes.Orchid = {};

function OrchidBoss(storage) {
	BossEntity.call(this);
	
	this.avatar.combat     = Images.corr_orchid;
	
	this.name              = "Orchid";
	this.monsterName       = "the corrupted dryad";
	this.MonsterName       = "The corrupted dryad";
	
	// TODO Stats
	
	this.maxHp.base        = 500;
	this.maxSp.base        = 100;
	this.maxLust.base      = 100;
	// Main stats
	this.strength.base     = 40;
	this.stamina.base      = 30;
	this.dexterity.base    = 20;
	this.intelligence.base = 5;
	this.spirit.base       = 8;
	this.libido.base       = 30;
	this.charisma.base     = 20;
	
	this.level             = 12;
	this.sexlevel          = 6;
	
	this.combatExp         = 100;
	this.coinDrop          = 100;
	
	this.body              = new Body();
	
	this.body.DefFemale();
	
	this.body.SetRace(Race.dryad);
	this.body.SetBodyColor(Color.green);
	this.body.SetHairColor(Color.green);	
	this.body.SetEyeColor(Color.black);
	
	this.turnCounter = 0;

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();

	if(storage) this.FromStorage(storage);
}
OrchidBoss.prototype = new BossEntity();
OrchidBoss.prototype.constructor = OrchidBoss;

OrchidBoss.prototype.FromStorage = function(storage) {
	// Personality stats
	
	// Load flags
	this.LoadFlags(storage);
}

OrchidBoss.prototype.ToStorage = function() {
	var storage = {};
	this.SaveFlags(storage);
	
	return storage;
}

OrchidBoss.prototype.Act = function(encounter, activeChar) {
	// TODO: AI!
	Text.AddOutput(this.NameDesc() + " squirms and sways her hips.");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);
	
	//TODO
	var choice = Math.random();
	if(choice < 0.2 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.Use(encounter, this, t);
	else if(choice < 0.4 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this))
		Abilities.Physical.CrushingStrike.Use(encounter, this, t);
	else
		Abilities.Attack.Use(encounter, this, t);
}

