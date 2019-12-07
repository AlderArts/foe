/*
 *
 * Define Adrian
 *
 */
import { GetDEBUG } from "../../../app";
import { AppendageType } from "../../body/appendage";
import { Color } from "../../body/color";
import { BodyTypeMale } from "../../body/defbody";
import { Race } from "../../body/race";
import { Entity } from "../../entity";
import { GAME, NAV } from "../../GAME";
import { Gui } from "../../gui";
import { IStorage } from "../../istorage";
import { ILocation } from "../../location";
import { Text } from "../../text";
import { TF } from "../../tf";
import { AdrianFlags } from "./adrian-flags";

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
		this.sexlevel = 2;
		this.SetExpToLevel();

		this.body.DefMale(BodyTypeMale.Muscular);
		this.body.SetRace(Race.Horse);
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Horse, Color.brown);

		this.body.height.base      = 205;
		this.body.weigth.base      = 100;
		this.body.muscleTone.base  = 1;

		this.FirstCock().length.base    = 32;
		this.FirstCock().thickness.base = 5;
		this.Balls().cumCap.base        = 10;
		this.Balls().size.base          = 6;
		this.Balls().count.base         = 2;

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Met = AdrianFlags.Met.NotMet;

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
