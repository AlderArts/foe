/*
 *
 * Guards
 *
 */

import { Abilities } from "../abilities";
import { Images } from "../assets";
import { Color } from "../body/color";
import { Race } from "../body/race";
import { Entity, ICombatEncounter, ICombatOrder } from "../entity";
import { AlchemyItems } from "../items/alchemy";
import { IngredientItems } from "../items/ingredients";
import { Text } from "../text";
import { Rand } from "../utility";

export class Footman extends Entity {
	constructor(levelbonus?: number) {
		super();

		this.ID = "footman";

		this.monsterName       = "the footman";
		this.MonsterName       = "The footman";

		this.avatar.combat     = Images.knight;
		this.name              = "Footman(M)";
		this.body.DefMale();

		this.maxHp.base        = 50;
		this.maxSp.base        = 20;
		this.maxLust.base      = 25;
		// Main stats
		this.strength.base     = 35;
		this.stamina.base      = 30;
		this.dexterity.base    = 20;
		this.intelligence.base = 13;
		this.spirit.base       = 14;
		this.libido.base       = 13;
		this.charisma.base     = 13;

		this.level             = 10;
		this.level             += levelbonus || 0;
		this.sexlevel          = 2;

		this.combatExp         = this.level + 5;
		this.coinDrop          = this.level * 6;

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

		// TODO gear

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	// TODO drops
	public DropTable() {
		const drops = [];
		if (Math.random() < 0.05) { drops.push({ it: AlchemyItems.Homos }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.Hummus }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.SpringWater }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.Letter }); }

		if (Math.random() < 0.2) {  drops.push({ it: IngredientItems.Trinket }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.HorseShoe }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.RabbitFoot }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.GoatMilk }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.CowMilk }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.SheepMilk }); }

		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.Lettuce }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.DogBiscuit }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.DogBone }); }
		return drops;
	}

	public Act(encounter: ICombatEncounter, activeChar: ICombatOrder) {
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
		if (choice < 0.4 && Abilities.Physical.DAttack.enabledCondition(encounter, this)) {
			Abilities.Physical.DAttack.CastInternal(encounter, this, t);
		} else if (choice < 0.6 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this)) {
			Abilities.Physical.CrushingStrike.CastInternal(encounter, this, t);
		} else if (choice < 0.8 && Abilities.Physical.Pierce.enabledCondition(encounter, this)) {
			Abilities.Physical.Pierce.CastInternal(encounter, this, t);
		} else {
			Abilities.Attack.CastInternal(encounter, this, t);
		}
	}

}
