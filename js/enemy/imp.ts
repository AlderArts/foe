/*
 * 
 * Imp
 * 
 */

import { Entity } from '../entity';
import { Images } from '../assets';
import { Element } from '../damagetype';
import { Race } from '../body/race';
import { TF } from '../tf';
import { AppendageType } from '../body/appendage';
import { Color } from '../body/color';

export class Imp extends Entity {
	constructor() {
		super();

		this.ID = "imp";
		
		this.avatar.combat     = Images.imp;
		
		this.name              = "Imp";
		this.monsterName       = "the imp";
		this.MonsterName       = "The imp";
		this.maxHp.base        = 30;
		this.maxSp.base        = 10;
		this.maxLust.base      = 10;
		// Main stats
		this.strength.base     = 6;
		this.stamina.base      = 8;
		this.dexterity.base    = 8;
		this.intelligence.base = 6;
		this.spirit.base       = 8;
		this.libido.base       = 18;
		this.charisma.base     = 4;
		
		this.elementDef.dmg[Element.mFire] = 0.5;
		this.elementDef.dmg[Element.mDark] = 0.5;
		
		this.level             = 1;
		this.sexlevel          = 1;
		
		this.combatExp         = 1;
		this.coinDrop          = 1;
		
		this.body.DefMale();
		this.Butt().virgin = false;
		
		this.body.SetRace(Race.Demon);
		
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Demon, Color.red);
		TF.SetAppendage(this.Appendages(), AppendageType.horn, Race.Demon, Color.red);
		
		var col = Math.random();
		if(col < 0.3)
			this.body.SetBodyColor(Color.red);
		else if(col < 0.7)
			this.body.SetBodyColor(Color.gray);
		else
			this.body.SetBodyColor(Color.green);
		
		this.body.SetEyeColor(Color.yellow);
		
		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}
}
