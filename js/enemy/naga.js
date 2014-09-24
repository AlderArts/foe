/*
 * 
 * Naga, lvl 4-6
 * 
 */

function Naga() {
	Entity.call(this);
	
	this.avatar.combat     = Images.naga;
	this.name              = "Naga";
	this.monsterName       = "the naga";
	this.MonsterName       = "The naga";
	this.body.cock.push(new Cock());
	this.body.cock.push(new Cock());
	this.body.vagina.push(new Vagina());
	if(Math.random() < 0.1)
	    this.Butt().virgin = false;
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 40;
	this.maxLust.base      = 65;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 18;
	this.dexterity.base    = 23;
	this.intelligence.base = 21;
	this.spirit.base       = 22;
	this.libido.base       = 24;
	this.charisma.base     = 27;
	
	this.level             = 4;
	if(Math.random() > 0.8) this.level = 6;
	this.sexlevel          = 2;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 4;
	
	this.body.SetRace(Race.snake);
	
	this.body.SetBodyColor(Color.olive);
	
	this.body.SetEyeColor(Color.purple);
	this.body.SetHairColor(Color.blue);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Naga.prototype = new Entity();
Naga.prototype.constructor = Naga;

Scenes.Naga = {};

Naga.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Nagazm });
	if(Math.random() < 0.5)  drops.push({ it: Items.SnakeOil });
	if(Math.random() < 0.5)  drops.push({ it: Items.SnakeFang });
	if(Math.random() < 0.5)  drops.push({ it: Items.SnakeSkin });
	return drops;
}

Naga.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! Hiss!");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.4)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.Ensnare.enabledCondition(encounter, this))
		Abilities.Physical.Ensnare.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Pierce.enabledCondition(encounter, this))
		Abilities.Physical.Pierce.Use(encounter, this, t);
	else if(choice < 0.9 && Abilities.Seduction.Distract.enabledCondition(encounter, this))
		Abilities.Seduction.Distract.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}

world.loc.Desert.Drylands.enc.AddEnc(function() {
	var enemy = new Party();
	var enc = new Encounter(enemy);
	
	enemy.AddMember(new Naga());
	/*
	enc.canRun = false;
	enc.VictoryCondition = ...
	enc.onEncounter = Scenes.Naga.DesertEncounter;
	enc.onLoss      = Scenes.Naga.DesertLoss;
	enc.onVictory   = Scenes.Naga.DesertWinPrompt;
	*/
	
	return enc;
}, 1.0);

Scenes.Naga.DesertEncounter = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}

Scenes.Naga.DesertLoss = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}

Scenes.Naga.DesertWinPrompt = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}
