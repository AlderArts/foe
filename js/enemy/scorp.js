/*
 *
 * Scorpion girl, lvl 5-8
 *
 */

import { Entity } from '../entity';
import { Scenes } from '../event';

Scenes.Scorpion = {};

function Scorpion() {
	Entity.call(this);
	this.ID = "scorpion";

	this.avatar.combat     = Images.scorp;
	this.name              = "Scorpion";
	this.monsterName       = "the scorpion";
	this.MonsterName       = "The scorpion";
	this.body.DefFemale();
	/*
	if(Math.random() < 0.9)
		this.FirstVag().virgin = false;
		*/

	this.maxHp.base        = 140;
	this.maxSp.base        = 60;
	this.maxLust.base      = 60;
	// Main stats
	this.strength.base     = 25;
	this.stamina.base      = 20;
	this.dexterity.base    = 30;
	this.intelligence.base = 20;
	this.spirit.base       = 19;
	this.libido.base       = 19;
	this.charisma.base     = 23;

	this.elementAtk.dmg[Element.pPierce] =  0.5;
	this.elementAtk.dmg[Element.mNature] =  0.5;
	this.elementDef.dmg[Element.mNature] =  0.5;
	this.elementDef.dmg[Element.mFire]   =  0.5;
	this.elementDef.dmg[Element.mIce]    =   -1;
	this.elementDef.dmg[Element.mWater]  = -0.5;
	
	this.statusDef[StatusEffect.Venom]   = 1;

	this.level             = 5 + Math.floor(Math.random() * 4);
	this.sexlevel          = 3;

	this.combatExp         = 6 + this.level;
	this.coinDrop          = 4 + this.level * 4;

	this.body.SetBodyColor(Color.white);

	this.body.SetEyeColor(Color.yellow);

	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Scorpion, Color.black);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Scorpion.prototype = new Entity();
Scorpion.prototype.constructor = Scorpion;

Scorpion.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Scorpius });
	if(Math.random() < 0.5)  drops.push({ it: Items.Stinger });
	if(Math.random() < 0.5)  drops.push({ it: Items.SVenom });
	if(Math.random() < 0.5)  drops.push({ it: Items.SClaw });
	//Apparently a bone collector...
	if(Math.random() < 0.1)  drops.push({ it: Items.DogBone });
	if(Math.random() < 0.1)  drops.push({ it: Items.WolfFang });
	if(Math.random() < 0.1)  drops.push({ it: Items.SnakeFang });
	if(Math.random() < 0.1)  drops.push({ it: Items.AntlerChip });
	if(Math.random() < 0.1)  drops.push({ it: Items.CatClaw });
	if(Math.random() < 0.1)  drops.push({ it: Items.LizardScale });
	if(Math.random() < 0.1)  drops.push({ it: Items.LizardEgg });
	if(Math.random() < 0.1)  drops.push({ it: Items.RawHoney });
	if(Math.random() < 0.1)  drops.push({ it: Items.BeeChitin });

	if(Math.random() < 0.01) drops.push({ it: Items.Lacertium });
	if(Math.random() < 0.01) drops.push({ it: Items.Nagazm });
	return drops;
}

Scorpion.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.name + " acts! Stab stab hiss!");
	Text.NL();

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
	else if(choice < 0.7 && Abilities.EnemySkill.Sting.enabledCondition(encounter, this))
		Abilities.EnemySkill.Sting.Use(encounter, this, t);
	else if(choice < 0.9 && Abilities.Seduction.Distract.enabledCondition(encounter, this))
		Abilities.Seduction.Distract.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}

// FEMALE ENCOUNTER
Scenes.Scorpion.LoneEnc = function() {
	var enemy    = new Party();
	enemy.AddMember(new Scorpion());
	var enc      = new Encounter(enemy);

	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}
