/*
 * 
 * Drake lvl 60-70
 * 
 */

function Drake() {
	Entity.call(this);
	
	this.avatar.combat     = Images.drake;
	this.name              = "Drake";
	this.monsterName       = "the drake";
	this.MonsterName       = "The drake";
	this.body.DefMale();
	
	this.maxHp.base        = 50000;
	this.maxSp.base        = 10000;
	this.maxLust.base      = 6000;
	// Main stats
	this.strength.base     = 500;
	this.stamina.base      = 600;
	this.dexterity.base    = 380;
	this.intelligence.base = 300;
	this.spirit.base       = 320;
	this.libido.base       = 200;
	this.charisma.base     = 240;
	
	this.level             = 60 + Math.floor(Math.random() * 10);
	this.sexlevel          = 30;
	
	this.combatExp         = 6000 + this.level * 60;
	this.coinDrop          = 4000 + this.level * 40;
	
	this.body.SetBodyColor(Color.green);
	
	this.body.SetEyeColor(Color.white);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.dragon, Color.green);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Drake.prototype = new Entity();
Drake.prototype.constructor = Drake;

Drake.prototype.PoisonResist = function() {
	return 1;
}
Drake.prototype.BurnResist = function() {
	return 1;
}

Drake.prototype.DropTable = function() {
	var drops = [];
	/*
	if(Math.random() < 0.05) drops.push({ it: Items.Stinger });
	if(Math.random() < 0.5)  drops.push({ it: Items.Stinger });
	if(Math.random() < 0.5)  drops.push({ it: Items.SVenom });
	if(Math.random() < 0.5)  drops.push({ it: Items.SClaw });
	*/
	return drops;
}

Drake.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! ROOOAR!");
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
		Abilities.Black.ThunderStorm.Use(encounter, this, party);
	else if(choice < 0.4 && Abilities.Black.WindShear.enabledCondition(encounter, this))
		Abilities.Black.WindShear.Use(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.QAttack.enabledCondition(encounter, this))
		Abilities.Physical.QAttack.Use(encounter, this, t);
	else if(choice < 0.7 && Abilities.Physical.Frenzy.enabledCondition(encounter, this))
		Abilities.Physical.Frenzy.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Black.Hellfire.enabledCondition(encounter, this))
		Abilities.Black.Hellfire.Use(encounter, this, party);
	else if(choice < 0.9 && Abilities.Seduction.Rut.enabledCondition(encounter, this))
		Abilities.Seduction.Rut.Use(encounter, this, t);
	else
		Abilities.Attack.Use(encounter, this, t);
}


// FUCK YOU ENCOUNTER
world.loc.DragonDen.Entry.enc.AddEnc(function() {
 	var enemy    = new Party();
	enemy.AddMember(new Drake());
	var enc      = new Encounter(enemy);
	
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}, 1.0);
