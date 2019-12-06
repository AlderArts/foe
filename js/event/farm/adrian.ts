/*
 *
 * Define Adrian
 *
 */
import { GetDEBUG } from "../../../app";
import { AppendageType } from "../../body/appendage";
import { Color } from "../../body/color";
import { Race } from "../../body/race";
import { Entity } from "../../entity";
import { GAME, NAV } from "../../GAME";
import { Gui } from "../../gui";
import { IStorage } from "../../istorage";
import { ILocation } from "../../location";
import { Text } from "../../text";
import { TF } from "../../tf";

export class Adrian extends Entity {
	constructor(storage?: IStorage) {
		super();

		this.ID = "adrian";

		// Character stats
		this.name = "Adrian";

		// this.avatar.combat = new Image();
		// this.avatar.combat.src = "assets/img/adrian_avatar.png";

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

		this.body.DefMale();
		this.body.SetRace(Race.Horse);
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Horse, Color.brown);

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

		this.SaveBodyPartial(storage, {ass: true});
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
		const adrian = GAME().adrian;
		Text.Clear();
		Text.Add("Rawr Imma horse.");

		if (GetDEBUG()) {
			Text.NL();
			Text.Out(`<b>DEBUG: relation: ${adrian.relation.Get()}

			DEBUG: subDom: ${adrian.subDom.Get()}

			DEBUG: slut: ${adrian.slut.Get()}</b>`);
			Text.NL();
		}

		Text.Flush();
		Gui.NextPrompt(NAV().PartyInteraction);
	}
}
