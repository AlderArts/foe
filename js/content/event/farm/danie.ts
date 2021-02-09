/*
 *
 * Define Danie
 *
 */
import { GetDEBUG } from "../../../../app";
import { AppendageType } from "../../../engine/entity/body/appendage";
import { Color } from "../../../engine/entity/body/color";
import { Race } from "../../../engine/entity/body/race";
import { Entity } from "../../../engine/entity/entity";
import { IStorage } from "../../../engine/entity/istorage";
import { TF } from "../../../engine/entity/tf";
import { GAME, NAV } from "../../../engine/GAME";
import { ILocation } from "../../../engine/navigation/location";
import { Text } from "../../../engine/parser/text";
import { Gui } from "../../../gui/gui";

export class Danie extends Entity {
	constructor(storage?: IStorage) {
		super();

		this.ID = "danie";

		// Character stats
		this.name = "Danie";

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
		this.body.SetRace(Race.Sheep);
		TF.SetAppendage(this.Appendages(), AppendageType.horn, Race.Sheep, Color.gray, 2);
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Sheep, Color.black);

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Met = 0;

		if (storage) { this.FromStorage(storage); }
	}

	public FromStorage(storage: IStorage) {
		this.body.FromStorage(storage.body);
		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
	}

	public ToStorage() {
		const storage: IStorage = {};

		this.SaveBodyPartial(storage, {ass: true, vag: true});

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
		const danie = GAME().danie;
		Text.Clear();
		Text.Add("Baah Imma sheep.");

		if (GetDEBUG()) {
			Text.NL();
			Text.Out(`<b>DEBUG: relation: ${danie.relation.Get()}

			DEBUG: subDom: ${danie.subDom.Get()}

			DEBUG: slut: ${danie.slut.Get()}</b>`);
			Text.NL();
		}
		Text.Flush();
		Gui.NextPrompt(NAV().PartyInteraction);
	}
}
