/*
 *
 * Define Jeanne
 *
 */
import { Race } from "../../body/race";
import { Entity } from "../../entity";
import { GAME } from "../../GAME";
import { AlchemyItems } from "../../items/alchemy";
import { AlchemySpecial } from "../../items/alchemyspecial";
import { ILocation } from "../../location";
import { RosalinFlags } from "../nomads/rosalin-flags";

export class Jeanne extends Entity {

	public static ReadyForMagicTeaching() {
		return (GAME().player.jobs.Mage.level +
				GAME().player.jobs.Mystic.level +
				GAME().player.jobs.Healer.level) >= 9;
	}
	constructor(storage?: any) {
		super();

		this.ID = "jeanne";

		// Character stats
		this.name = "Jeanne";
		this.alchemyLevel = 10;

		this.recipes.push(AlchemyItems.Homos);
		this.recipes.push(AlchemyItems.Estros);
		this.recipes.push(AlchemyItems.Testos);
		this.recipes.push(AlchemyItems.Gestarium);
		this.recipes.push(AlchemyItems.GestariumPlus);
		this.recipes.push(AlchemyItems.Virilium);

		// this.avatar.combat = new Image();

		this.maxHp.base        = 100;
		this.maxSp.base        = 80;
		this.maxLust.base      = 50;
		// Main stats
		this.strength.base     = 20;
		this.stamina.base      = 22;
		this.dexterity.base    = 16;
		this.intelligence.base = 17;
		this.spirit.base       = 15;
		this.libido.base       = 20;
		this.charisma.base     = 18;

		this.level = 5;
		this.sexlevel = 3;
		this.SetExpToLevel();

		this.body.DefFemale();
		this.FirstBreastRow().size.base = 9;
		this.Butt().buttSize.base = 7;
		this.body.SetRace(Race.Elf);

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Met = 0;
		this.flags.bg = 0;

		if (storage) { this.FromStorage(storage); }
	}

	public FromStorage(storage: any) {
		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
		if (GAME().rosalin.flags.Anusol >= RosalinFlags.Anusol.ShowedJeanne) {
			this.recipes.push(AlchemySpecial.AnusolPlus);
		}
	}

	public ToStorage() {
		const storage = {};

		this.SavePersonalityStats(storage);

		this.SaveFlags(storage);

		return storage;
	}

	// Schedule
	public IsAtLocation(location?: ILocation) {
		return true;
	}
}
