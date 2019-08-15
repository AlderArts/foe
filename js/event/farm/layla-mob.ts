import { Abilities } from "../../abilities";
import { Images } from "../../assets";
import { Color } from "../../body/color";
import { Entity, TargetStrategy } from "../../entity";
import { Text } from "../../text";

/* TODO
 * Act AI
 */

export class LaylaMob extends Entity {
	constructor() {
		super();

		// Character stats
		this.name = "Creature";
		this.monsterName       = "the creature";
		this.MonsterName       = "The creature";

		this.avatar.combat = Images.layla_f;

		// TODO
		this.maxHp.base        = 1000;
		this.maxSp.base        = 200;
		this.maxLust.base      = 350;
		// Main stats
		this.strength.base     = 20;
		this.stamina.base      = 22;
		this.dexterity.base    = 30;
		this.intelligence.base = 32;
		this.spirit.base       = 40;
		this.libido.base       = 34;
		this.charisma.base     = 25;

		this.level = 12;
		this.sexlevel = 1;

		this.body.DefHerm();
		this.FirstBreastRow().size.base = 12.5;
		this.Butt().buttSize.base = 5;
		this.SetSkinColor(Color.blue);
		this.SetHairColor(Color.black);
		this.SetEyeColor(Color.red);

		this.SetLevelBonus();
		this.RestFull();
	}

	public Act(encounter: any, activeChar: any) {
		// TODO: Very TEMP
		Text.Add(this.MonsterName + " acts! Rawr!");
		Text.NL();
		Text.Flush();

		// Pick a random target (go for lowest abs HP)
		const t = this.GetSingleTarget(encounter, activeChar, TargetStrategy.LowAbsHp);

		const parseVars = {
			name   : this.name,
			hisher : this.hisher(),
			tName  : t.name,
		};

		const choice = Math.random();
		if (choice < 0.6) {
			Abilities.Attack.Use(encounter, this, t);
		} else if (choice < 0.8 && Abilities.Physical.Bash.enabledCondition(encounter, this)) {
			Abilities.Physical.Bash.Use(encounter, this, t);
 		}
	}

}
