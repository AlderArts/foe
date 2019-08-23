/*
 *
 * Define Aria
 *
 */
import { Color } from "../body/color";
import { Entity } from "../entity";

export class Aria extends Entity {
	constructor(storage?: any) {
		super();

		this.ID = "aria";

		// Character stats
		this.name = "Aria";

		this.maxHp.base        = 6400;
		this.maxSp.base        = 1900;
		this.maxLust.base      = 300;
		// Main stats
		this.strength.base     = 80;
		this.stamina.base      = 100;
		this.dexterity.base    = 80;
		this.intelligence.base = 300;
		this.spirit.base       = 700;
		this.libido.base       = 100;
		this.charisma.base     = 130;

		this.level = 50;
		this.sexlevel = 40;
		this.SetExpToLevel();

		this.body.DefFemale();
		this.FirstBreastRow().size.base = 15;
		this.Butt().buttSize.base = 5;
		this.body.SetBodyColor(Color.white);
		this.body.SetHairColor(Color.gold);
		this.body.SetEyeColor(Color.white);

		this.SetLevelBonus();
		this.RestFull();

		if (storage) { this.FromStorage(storage); }
	}

	// Schedule
	public IsAtLocation(location?: any) {
		return true;
	}
}

// Flags

export namespace AriaScenes {

}
