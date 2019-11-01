/*
 *
 * Define Sylistraxia
 *
 */
import { GetDEBUG } from "../../app";
import { Images } from "../assets";
import { Race } from "../body/race";
import { Entity } from "../entity";
import { GAME, NAV } from "../GAME";
import { Gui } from "../gui";
import { IStorage } from "../istorage";
import { ILocation } from "../location";
import { Text } from "../text";

export class Sylistraxia extends Entity {
	constructor(storage?: IStorage) {
		super();

		this.ID = "sylistraxia";

		// Character stats
		this.name = "Sylistraxia";

		this.avatar.combat = Images.sylistraxia;

		this.maxHp.base        = 500;
		this.maxSp.base        = 300;
		this.maxLust.base      = 150;
		// Main stats
		this.strength.base     = 53;
		this.stamina.base      = 69;
		this.dexterity.base    = 30;
		this.intelligence.base = 62;
		this.spirit.base       = 81;
		this.libido.base       = 24;
		this.charisma.base     = 19;

		this.level = 10;
		this.sexlevel = 10;
		this.SetExpToLevel();

		this.body.DefHerm(false);
		this.FirstBreastRow().size.base = 14;
		this.Butt().buttSize.base = 7;
		this.body.SetRace(Race.Dragon);
		this.FirstVag().virgin = false;
		this.Butt().virgin = false;

		this.SetLevelBonus();
		this.RestFull();

		if (storage) { this.FromStorage(storage); }
	}

	public FromStorage(storage: IStorage) {
		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
	}

	public ToStorage() {
		const storage: IStorage = {};

		this.SavePersonalityStats(storage);

		this.SaveFlags(storage);

		return storage;
	}

	// Schedule
	public IsAtLocation(location?: ILocation) {
		return true;
	}

	// Party interaction
	public Interact() {
		const sylistraxia = GAME().sylistraxia;

		Text.Clear();
		Text.Add("Rawr Imma dragon.");

		if (GetDEBUG()) {
			Text.NL();
			Text.Add("DEBUG: relation: " + sylistraxia.relation.Get(), undefined, "bold");
			Text.NL();
			Text.Add("DEBUG: subDom: " + sylistraxia.subDom.Get(), undefined, "bold");
			Text.NL();
			Text.Add("DEBUG: slut: " + sylistraxia.slut.Get(), undefined, "bold");
			Text.NL();
		}

		Text.Flush();
		Gui.NextPrompt(NAV().PartyInteraction);
	}
}

export namespace SylistraxiaScenes {

}
