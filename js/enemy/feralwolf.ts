/*
 *
 * Mothgirl, lvl 4-6
 *
 */

import { Abilities } from "../abilities";
import { Images } from "../assets";
import { AppendageType } from "../body/appendage";
import { Color } from "../body/color";
import { Race } from "../body/race";
import { Encounter } from "../combat";
import { Entity } from "../entity";
import { AlchemyItems } from "../items/alchemy";
import { IngredientItems } from "../items/ingredients";
import { Party } from "../party";
import { Text } from "../text";
import { TF } from "../tf";

const FeralWolfScenes: any = {};

export class FeralWolf extends Entity {
	constructor(levelbonus?: number) {
		super();

		this.ID = "wolf";

		this.avatar.combat     = Images.wolf;
		this.name              = "Wolf";
		this.monsterName       = "the wolf";
		this.MonsterName       = "The wolf";
		this.body.DefMale(); // TODO: Feral form
		this.FirstCock().thickness.base = 6;
		this.FirstCock().length.base = 28;
		this.Balls().size.base = 5;

		this.maxHp.base        = 200;
		this.maxSp.base        = 60;
		this.maxLust.base      = 45;
		// Main stats
		this.strength.base     = 25;
		this.stamina.base      = 20;
		this.dexterity.base    = 19;
		this.intelligence.base = 15;
		this.spirit.base       = 19;
		this.libido.base       = 18;
		this.charisma.base     = 14;

		this.level             = 4 + Math.floor(Math.random() * 4);
		this.sexlevel          = 2;
		if (levelbonus) {
			this.level += levelbonus;
		}

		this.combatExp         = 5 + this.level;
		this.coinDrop          = 2 + this.level * 4;

		this.body.SetRace(Race.Wolf);
		this.body.SetBodyColor(Color.gray);

		this.body.SetEyeColor(Color.gold);

		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Wolf, Color.gray);

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	public DropTable() {
		const drops = [];
		if (Math.random() < 0.05) { drops.push({ it: AlchemyItems.Lobos }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.WolfFang }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.Wolfsbane }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.CanisRoot }); }

		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.DogBiscuit }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.DogBone }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.FoxBerries }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.Foxglove }); }

		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Canis }); }
		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Vulpinix }); }
		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Testos }); }
		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Virilium }); }
		return drops;
	}

	public Act(encounter: any, activeChar: any) {
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Growl!");
		Text.NL();
		Text.Flush();

		// Pick a random target
		const t = this.GetSingleTarget(encounter, activeChar);

		const parseVars = {
			hisher : this.hisher(),
			name   : this.name,
			tName  : t.name,
		};

		const choice = Math.random();
		if (choice < 0.5) {
			Abilities.Attack.Use(encounter, this, t);
		} else if (choice < 0.7 && Abilities.Physical.DAttack.enabledCondition(encounter, this)) {
			Abilities.Physical.Pierce.Use(encounter, this, t);
 } else if (choice < 0.95 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this)) {
			Abilities.Physical.CrushingStrike.Use(encounter, this, t);
 } else {
			Abilities.Seduction.Tease.Use(encounter, this, t);
 }
	}

}

FeralWolfScenes.LoneEnc = () => {
	const enemy = new Party();
	enemy.AddMember(new FeralWolf());
	const enc = new Encounter(enemy);
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
};

export { FeralWolfScenes };
