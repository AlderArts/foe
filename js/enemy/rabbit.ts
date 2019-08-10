/*
 * 
 * Rabbit-morph lvl 1-2
 * 
 */

import { Entity } from '../entity';
import { Images } from '../assets';
import { TF } from '../tf';
import { AppendageType } from '../body/appendage';
import { Gender } from '../body/gender';
import { Color } from '../body/color';
import { Race } from '../body/race';
import { Element } from '../damagetype';
import { AlchemyItems } from '../items/alchemy';
import { IngredientItems } from '../items/ingredients';
import { Abilities } from '../abilities';

// TODO: Make base stats depend on Burrows flags (perhaps make a factory function?)

export class Lagomorph extends Entity {
	constructor(gender : Gender) {
		super();
		this.ID = "lagomorph";
		
		this.name              = "Lagomorph";
		this.monsterName       = "the lagomorph";
		this.MonsterName       = "The lagomorph";
		this.maxHp.base        = 30;
		this.maxSp.base        = 10;
		this.maxLust.base      = 5;
		// Main stats
		this.strength.base     = 8;
		this.stamina.base      = 9;
		this.dexterity.base    = 12;
		this.intelligence.base = 8;
		this.spirit.base       = 10;
		this.libido.base       = 17;
		this.charisma.base     = 12;
		
		this.elementDef.dmg[Element.mFire] = -0.5;
		
		this.level             = 1;
		if(Math.random() > 0.8) this.level = 2;
		this.sexlevel          = 3;
		
		this.combatExp         = this.level;
		this.coinDrop          = this.level * 3;
		
		if(gender == Gender.male) {
			this.body.DefMale();
			this.avatar.combat     = Images.lago_male;
		}
		else if(gender == Gender.female) {
			this.body.DefFemale();
			this.avatar.combat     = Images.lago_fem;
			this.FirstBreastRow().size.base = 5;
			this.FirstVag().virgin = false;
		}
		else {
			this.body.DefHerm(true);
			this.avatar.combat     = Images.lago_fem;
			this.FirstBreastRow().size.base = 5;
			if(Math.random() < 0.8)
				this.FirstVag().virgin = false;
		}
		this.Butt().buttSize.base = 2;
		this.Butt().virgin = false;
		
		this.body.SetRace(Race.Rabbit);
		
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Rabbit, Color.white);
		
		this.body.SetBodyColor(Color.white);
		
		this.body.SetEyeColor(Color.blue);

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}
	
	DropTable() {
		var drops = [];
		if(Math.random() < 0.05) drops.push({ it: AlchemyItems.Leporine });
		if(Math.random() < 0.5)  drops.push({ it: IngredientItems.RabbitFoot });
		if(Math.random() < 0.5)  drops.push({ it: IngredientItems.CarrotJuice });
		if(Math.random() < 0.5)  drops.push({ it: IngredientItems.Lettuce });
		
		
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.Whiskers });
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.HorseHair });
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.HorseCum });
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.FruitSeed });
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.FreshGrass });
		
		if(Math.random() < 0.01) drops.push({ it: IngredientItems.CorruptSeed });
		if(Math.random() < 0.01) drops.push({ it: IngredientItems.DemonSeed });
		
		if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Felinix });
		if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Equinium });
		if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Lacertium });
		if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Gestarium });
		return drops;
	}

	Act(encounter : any, activeChar : any) {
		// Pick a random target
		var t = this.GetSingleTarget(encounter, activeChar);

		var parseVars = {
			name   : this.name,
			hisher : this.hisher(),
			tName  : t.name
		};

		var choice = Math.random();
		if(choice < 0.6)
			Abilities.Attack.Use(encounter, this, t);
		else if(choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
			Abilities.Physical.DAttack.Use(encounter, this, t);
		else
			Abilities.Seduction.Tease.Use(encounter, this, t);
	}

}

export class LagomorphAlpha extends Lagomorph {
	constructor(gender : Gender) {
		super(gender);
		
		this.name              = "Alpha";
		this.monsterName       = "the lagomorph alpha";
		this.MonsterName       = "The lagomorph alpha";
		
		this.maxHp.base        *= 2;
		this.maxSp.base        *= 1.2;
		this.maxLust.base      *= 2;
		// Main stats
		this.strength.base     *= 1.4;
		this.stamina.base      *= 1.2;
		this.dexterity.base    *= 1.5;
		this.intelligence.base *= 1.1;
		this.spirit.base       *= 1.2;
		this.libido.base       *= 2;
		this.charisma.base     *= 1.3;
		
		this.level             = Math.floor(this.level * 1.5 + 0.5);
		this.sexlevel          = Math.floor(this.sexlevel * 1.5 + 0.5);
		
		this.combatExp         *= 2;
		this.coinDrop          *= 2;
		
		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}
}

/*
 * TODO Drop table & act for alpha
 */

export class LagomorphElite extends Lagomorph {
	constructor(gender : Gender) {
		super(gender);
		
		this.name              = "Elite";
		this.monsterName       = "the lagomorph elite";
		this.MonsterName       = "The lagomorph elite";
		
		this.maxHp.base        *= 6;
		this.maxSp.base        *= 4;
		this.maxLust.base      *= 4;
		// Main stats
		this.strength.base     *= 4;
		this.stamina.base      *= 4;
		this.dexterity.base    *= 4;
		this.intelligence.base *= 4;
		this.spirit.base       *= 4;
		this.libido.base       *= 4;
		this.charisma.base     *= 4;
		
		this.level             = Math.floor(this.level * 4);
		this.sexlevel          = Math.floor(this.sexlevel * 4);
		
		this.combatExp         *= 4;
		this.coinDrop          *= 4;
		
		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}
}

/*
 * TODO Drop table & act for elite
 */


export class LagomorphBrute extends Lagomorph {
	constructor(gender? : Gender) {
		gender = gender || Gender.male;
		super(gender);
		
		this.name              = "Brute";
		this.monsterName       = "the lagomorph brute";
		this.MonsterName       = "The lagomorph brute";
		
		this.avatar.combat     = Images.lago_brute;
		
		this.maxHp.base        *= 10;
		this.maxSp.base        *= 3;
		this.maxLust.base      *= 2;
		// Main stats
		this.strength.base     *= 5;
		this.stamina.base      *= 4;
		this.dexterity.base    *= 0.9;
		this.intelligence.base *= 0.9;
		this.spirit.base       *= 2;
		this.libido.base       *= 2;
		this.charisma.base     *= 0.9;
		
		this.level             *= 3;
		this.sexlevel          *= 3;
		
		this.combatExp         *= 3;
		this.coinDrop          *= 3;
		
		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	// TODO: Drop table
	Act(encounter : any, activeChar : any) {
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
		else if(choice < 0.6 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this))
			Abilities.Physical.CrushingStrike.Use(encounter, this, t);
		else if(choice < 0.8 && Abilities.Physical.Bash.enabledCondition(encounter, this))
			Abilities.Physical.Bash.Use(encounter, this, t);
		else if(choice < 0.9 && Abilities.Physical.Frenzy.enabledCondition(encounter, this))
			Abilities.Physical.Frenzy.Use(encounter, this, t);
		else
			Abilities.Seduction.Tease.Use(encounter, this, t);
	}

}


export class LagomorphWizard extends Lagomorph {
	constructor(gender? : Gender) {
		gender = gender || Gender.male;
		super(gender);
		
		this.avatar.combat     = Images.lago_brain;
		
		this.name              = "Wizard";
		this.monsterName       = "the lagomorph wizard";
		this.MonsterName       = "The lagomorph wizard";
		
		this.maxHp.base        *= 1.5;
		this.maxSp.base        *= 6;
		this.maxLust.base      *= 2;
		// Main stats
		this.strength.base     *= 1.2;
		this.stamina.base      *= 1.1;
		this.dexterity.base    *= 3;
		this.intelligence.base *= 5;
		this.spirit.base       *= 5;
		this.libido.base       *= 2;
		this.charisma.base     *= 2;
		
		this.level             *= 3;
		this.sexlevel          *= 3;
		
		this.combatExp         *= 3;
		this.coinDrop          *= 3;
		
		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	// TODO: Drop table

	Act(encounter : any, activeChar : any) {
		// Pick a random target
		var t = this.GetSingleTarget(encounter, activeChar);

		var parseVars = {
			name   : this.name,
			hisher : this.hisher(),
			tName  : t.name
		};

		var choice = Math.random();
		if(choice < 0.1)
			Abilities.Attack.Use(encounter, this, t);
		else if(choice < 0.3 && Abilities.Black.Fireball.enabledCondition(encounter, this))
			Abilities.Black.Fireball.Use(encounter, this, t);
		else if(choice < 0.5 && Abilities.Black.Freeze.enabledCondition(encounter, this))
			Abilities.Black.Freeze.Use(encounter, this, t);
		else if(choice < 0.7 && Abilities.Black.Bolt.enabledCondition(encounter, this))
			Abilities.Black.Bolt.Use(encounter, this, t);
		else if(choice < 0.9 && Abilities.Black.Venom.enabledCondition(encounter, this))
			Abilities.Black.Venom.Use(encounter, this, t);
		else
			Abilities.Seduction.Tease.Use(encounter, this, t);
	}

}
