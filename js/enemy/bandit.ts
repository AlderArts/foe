/*
 *
 * Street urchin encounter
 *
 */

import { Abilities } from "../abilities";
import { Images } from "../assets";
import { Color } from "../body/color";
import { Gender } from "../body/gender";
import { Race } from "../body/race";
import { Entity } from "../entity";
import { AlchemyItems } from "../items/alchemy";
import { IngredientItems } from "../items/ingredients";
import { Text } from "../text";
import { Rand } from "../utility";

export class StreetUrchin extends Entity {
	constructor() {
		super();
		this.ID = "urchin";
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

		const gender = Math.random();
		if (gender < 0.6) {
			this.body.DefMale();
		} else if (gender < 0.95) {
			this.body.DefFemale();
			if (Math.random() < 0.8) {
				this.FirstVag().virgin = false;
			}
		} else {
			this.body.DefHerm(Math.random() < 0.5);
			if (Math.random() < 0.8) {
				this.FirstVag().virgin = false;
			}
		}

		this.body.SetRace(Race.Human);

		const col = Math.random();
		if (col < 0.6) {
			this.body.SetBodyColor(Color.white);
		} else if (col < 0.7) {
			this.body.SetBodyColor(Color.light);
		} else if (col < 0.8) {
					this.body.SetBodyColor(Color.dark);
		} else if (col < 0.9) {
					this.body.SetBodyColor(Color.olive);
		} else {
					this.body.SetBodyColor(Color.black);
		}

		const hairCol = Math.random();
		if (hairCol < 0.4) {
			this.body.SetHairColor(Color.black);
		} else if (hairCol < 0.7) {
			this.body.SetHairColor(Color.brown);
		} else {
					this.body.SetHairColor(Color.blonde);
		}

		this.body.SetEyeColor(Rand(Color.numColors));

		const r = Math.random();
		if (r >= 0.7) {
			if (r < 0.8) { // dog-morph
				this.body.head.ears.race = Race.Dog;
				this.body.head.ears.color = this.body.head.hair.color;
			} else if (r < 0.9) { // cat-morph
				this.body.head.ears.race = Race.Feline;
				this.body.head.ears.color = this.body.head.hair.color;
			} else { // equine
				this.body.head.ears.race = Race.Horse;
				this.body.head.ears.color = this.body.head.hair.color;
			}
		}

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}
}

export class Bandit extends Entity {
	constructor(gender: Gender, levelbonus?: number) {
		super();
		this.ID = "bandit";
		this.monsterName       = "the bandit";
		this.MonsterName       = "The bandit";

		if (gender === Gender.male) {
			if (Math.random() < 0.5) {
				this.avatar.combat     = Images.bandit_male1;
			} else {
				this.avatar.combat     = Images.bandit_male2;
			}
			this.name              = "Bandit(M)";
			this.body.DefMale();
		} else if (gender === Gender.female) {
			this.avatar.combat     = Images.bandit_female1;
			this.name              = "Bandit(F)";
			this.body.DefFemale();
			if (Math.random() < 0.8) {
				this.FirstVag().virgin = false;
			}
		} else {
			this.avatar.combat     = Images.bandit_female1;
			this.name              = "Bandit(H)";
			this.body.DefHerm(true);
			if (Math.random() < 0.6) {
				this.FirstVag().virgin = false;
			}
		}

		this.maxHp.base        = 50;
		this.maxSp.base        = 20;
		this.maxLust.base      = 25;
		// Main stats
		this.strength.base     = 15;
		this.stamina.base      = 14;
		this.dexterity.base    = 12;
		this.intelligence.base = 10;
		this.spirit.base       = 12;
		this.libido.base       = 13;
		this.charisma.base     = 13;

		this.level             = 3;
		if (Math.random() > 0.8) { this.level = 4; }
		this.level             += levelbonus || 0;
		this.sexlevel          = 2;

		this.combatExp         = this.level;
		this.coinDrop          = this.level * 4;

		this.body.SetRace(Race.Human);

		const col = Math.random();
		if (col < 0.6) {
			this.body.SetBodyColor(Color.white);
		} else if (col < 0.7) {
			this.body.SetBodyColor(Color.light);
		} else if (col < 0.8) {
					this.body.SetBodyColor(Color.dark);
		} else if (col < 0.9) {
					this.body.SetBodyColor(Color.olive);
		} else {
					this.body.SetBodyColor(Color.black);
		}

		const hairCol = Math.random();
		if (hairCol < 0.4) {
			this.body.SetHairColor(Color.black);
		} else if (hairCol < 0.7) {
			this.body.SetHairColor(Color.brown);
		} else {
					this.body.SetHairColor(Color.blonde);
		}

		this.body.SetEyeColor(Rand(Color.numColors));

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	public DropTable() {
		const drops = [];
		if (Math.random() < 0.05) { drops.push({ it: AlchemyItems.Homos }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.Hummus }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.SpringWater }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.Letter }); }

		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.GoatMilk }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.CowMilk }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.SheepMilk }); }

		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.RabbitFoot }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.Lettuce }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.HorseShoe }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.CowBell }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.SnakeOil }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.FreshGrass }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.DogBiscuit }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.DogBone }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.Trinket }); }

		return drops;
	}

	public Act(encounter: any, activeChar: any) {
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Yah!");
		Text.NL();

		// Pick a random target
		const t = this.GetSingleTarget(encounter, activeChar);

		const parseVars = {
			hisher : this.hisher(),
			name   : this.name,
			tName  : t.name,
		};

		const choice = Math.random();
		if (choice < 0.7) {
			Abilities.Attack.CastInternal(encounter, this, t);
		} else if (choice < 0.9 && Abilities.Physical.Pierce.enabledCondition(encounter, this)) {
			Abilities.Physical.Pierce.CastInternal(encounter, this, t);
		} else {
					Abilities.Attack.CastInternal(encounter, this, t);
		}
	}

}
