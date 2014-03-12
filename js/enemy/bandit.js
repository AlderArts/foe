/*
 * 
 * Street urchin encounter
 * 
 */

function StreetUrchin() {
	Entity.call(this);
	this.name              = "Street urchin";
	this.monsterName       = "the bandit";
	this.MonsterName       = "The bandit";
	this.maxHp.base        = 20;
	this.maxSp.base        = 10;
	this.maxLust.base      = 10;
	// Main stats
	this.strength.base     = 15;
	this.stamina.base      = 12;
	this.dexterity.base    = 11;
	this.intelligence.base = 9;
	this.spirit.base       = 8;
	this.libido.base       = 14;
	this.charisma.base     = 8;
	
	this.level             = 1;
	this.sexlevel          = 1;
	
	this.combatExp         = 1;
	this.coinDrop          = 2;
	
	var gender = Math.random();
	if(gender < 0.6)
		this.body.DefMale();
	else if(gender < 0.95) {
		this.body.DefFemale();
		if(Math.random() < 0.8)
			this.FirstVag().virgin = false;
	}
	else {
		this.body.DefHerm(Math.random() < 0.5);
		if(Math.random() < 0.8)
			this.FirstVag().virgin = false;
	}
	
	this.body.SetRace(Race.human);
	
	var col = Math.random();
	if(col < 0.6)
		this.body.SetBodyColor(Color.white);
	else if(col < 0.7)
		this.body.SetBodyColor(Color.light);
	else if(col < 0.8)
		this.body.SetBodyColor(Color.dark);
	else if(col < 0.9)
		this.body.SetBodyColor(Color.olive);
	else
		this.body.SetBodyColor(Color.black);
	
	var hairCol = Math.random();
	if(hairCol < 0.4)
		this.body.SetHairColor(Color.black);
	else if(hairCol < 0.7)
		this.body.SetHairColor(Color.brown);
	else
		this.body.SetHairColor(Color.blonde);
	
	this.body.SetEyeColor(Rand(Color.numColors));
	
	var r = Math.random();
	if(r < 0.7)
		;
	else if(r < 0.8) { // dog-morph
		this.body.head.ears.race = Race.dog;
		this.body.head.ears.color = this.body.head.hair.color;
	}
	else if(r < 0.9) { // cat-morph
		this.body.head.ears.race = Race.cat;
		this.body.head.ears.color = this.body.head.hair.color;
	}
	else { // equine
		this.body.head.ears.race = Race.horse;
		this.body.head.ears.color = this.body.head.hair.color;
	}
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
StreetUrchin.prototype = new Entity();
StreetUrchin.prototype.constructor = StreetUrchin;
