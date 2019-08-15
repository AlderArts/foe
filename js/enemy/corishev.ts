/*
 * Lt Corishev
 */

import { Abilities } from "../abilities";
import { Images } from "../assets";
import { Body } from "../body/body";
import { Element } from "../damagetype";
import { EncounterTable } from "../encountertable";
import { GAME } from "../GAME";
import { AccItems } from "../items/accessories";
import { AlchemyItems } from "../items/alchemy";
import { CombatItems } from "../items/combatitems";
import { IngredientItems } from "../items/ingredients";
import { WeaponsItems } from "../items/weapons";
import { Party } from "../party";
import { StatusEffect } from "../statuseffect";
import { Text } from "../text";
import { BossEntity } from "./boss";

export class Corishev extends BossEntity {
	constructor() {
		super();

		this.ID = "corishev";

		this.avatar.combat     = Images.corishev;

		this.name              = "Corishev";

		this.maxHp.base        = 1500;
		this.maxSp.base        = 400;
		this.maxLust.base      = 500;
		// Main stats
		this.strength.base     = 20;
		this.stamina.base      = 50;
		this.dexterity.base    = 85;
		this.intelligence.base = 30;
		this.spirit.base       = 40;
		this.libido.base       = 50;
		this.charisma.base     = 30;

		this.level             = 12;
		this.sexlevel          = 6;

		this.combatExp         = 300;
		this.coinDrop          = 1000;

		this.elementDef.dmg[Element.lust] = -1;

		this.statusDef[StatusEffect.Weakness] = 0;

		this.body              = new Body(this);

		this.body.DefMale();

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
		// Start with some lust
		this.AddLustFraction(0.4);
	}

	public DropTable() {
		const drops = [];
		drops.push({ it: WeaponsItems.GolWhip });
		drops.push({ it: CombatItems.LustDart });
		drops.push({ it: AccItems.SimpleCuffs });

		if (Math.random() < 0.1) {  drops.push({ it: AlchemyItems.Homos }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.Letter }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.SpringWater }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.Hummus }); }

		return drops;
	}

	public Act(encounter: any, activeChar: any) {
		const party: Party = GAME().party;

		const parse: any = {

		};

		// Banter
		if (Math.random() < 0.5) {
			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				Text.Add("<i>“I could’ve simply locked the door and let those useless fools sort you out while you tried to break it down,”</i> Corishev says, a giggle escaping his lips. <i>“But this little wimp here is most unsatisfying - he can’t take even the slightest pain before passing out on me. You two should be much more fun.”</i>", parse);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("<i>“Seems like a little birdie has found its way down into my dungeon, does it not?”</i> Corishev giggles, eyeing Cveta up and down. <i>“What kind of birdie are you, I wonder? The kind that will sit in a cage and sing pretty songs? Or the kind that I’ll let the men stuff for their own amusement?”</i>", parse);
				Text.NL();
				Text.Add("<i>“You degenerate,”</i> Cveta spits, putting extra venom in that last word.", parse);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("<i>“I will teach you to embrace suffering. It builds character,”</i> the maddened lieutenant taunts. <i>“You youngsters these days are just too soft and coddled. What can you outlaws hope to do against not just Preston, but those above him?”</i>", parse);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("<i>“Hurt? Hurt? That didn’t even tickle me! I get beaten harder than that at the brothel!”</i>", parse);
			}, 1.0, () => activeChar.entity.HPLevel() < 0.5);
			scenes.AddEnc(() => {
				Text.Add("<i>“When Preston’s done with you outlaws, I’ll have enough of you in the cells to whip every day!”</i> Corishev’s bloodshot eyes dart this way and that; the sheer thought of such must be practically orgasmic for the madman, judging by how his stiff cock is practically drooling pre thanks to the gol venom. <i>“Every day in the palace plaza, one after the other! It will never end!”</i>", parse);
			}, 1.0, () => activeChar.entity.LustLevel() > 0.5);

			scenes.Get();
			Text.NL();
		}

		// Pick a random target
		const t = this.GetSingleTarget(encounter, activeChar);
		let highlust = null;
		for (let i = 0; i < party.Num(); i++) {
			const c = party.Get(i);
			if (c.Incapacitated()) { continue; }

			if (c.LustLevel() >= 0.7) {
				highlust = c;
				break;
			}
		}

		const choice = Math.random();

		if (highlust && Abilities.EnemySkill.Corishev.Punish.enabledCondition(encounter, this)) { // Violate
			Abilities.EnemySkill.Corishev.Punish.Use(encounter, this, highlust);
		} else if (choice < 0.2 && Abilities.EnemySkill.Corishev.Lashing.enabledCondition(encounter, this)) {
			Abilities.EnemySkill.Corishev.Lashing.Use(encounter, this, t);
 } else if (choice < 0.4 && Abilities.EnemySkill.Corishev.WideStrike.enabledCondition(encounter, this)) {
			Abilities.EnemySkill.Corishev.WideStrike.Use(encounter, this, party);
 } else if (choice < 0.8 && activeChar.entity.LustLevel() < 0.5 && Abilities.EnemySkill.Corishev.SelfHarm.enabledCondition(encounter, this)) {
			Abilities.EnemySkill.Corishev.SelfHarm.Use(encounter, this);
 } else {
			Abilities.EnemySkill.Corishev.Whip.Use(encounter, this, t);
 }
	}

}
