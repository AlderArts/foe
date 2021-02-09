/*
 *
 * Define Roa
 *
 */

import { GetDEBUG } from "../../../../app";
import { Images } from "../../../assets";
import { Race } from "../../../engine/entity/body/race";
import { Entity } from "../../../engine/entity/entity";
import { IStorage } from "../../../engine/entity/istorage";
import { GAME, NAV } from "../../../engine/GAME";
import { ILocation } from "../../../engine/navigation/location";
import { Text } from "../../../engine/parser/text";
import { Gui } from "../../../gui/gui";
import { RoaFlags } from "./roa-flags";

export class Roa extends Entity {
	constructor(storage?: IStorage) {
		super();

		this.ID = "roa";

		// Character stats
		this.name = "Roa";

		this.avatar.combat = Images.roa;

		this.maxHp.base        = 30;
		this.maxSp.base        = 40;
		this.maxLust.base      = 20;
		// Main stats
		this.strength.base     = 10;
		this.stamina.base      = 11;
		this.dexterity.base    = 22;
		this.intelligence.base = 17;
		this.spirit.base       = 19;
		this.libido.base       = 18;
		this.charisma.base     = 16;

		this.level = 1;
		this.sexlevel = 1;

		this.body.DefMale();
		this.FirstBreastRow().size.base = 2;
		this.Butt().buttSize.base = 3;
		this.Butt().virgin = false;
		this.body.SetRace(Race.Rabbit);

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Met   = RoaFlags.Met.NotMet;
		this.flags.Lagon = RoaFlags.Lagon.No;
		this.flags.sFuck = 0; // strapon fuck
		this.flags.snug  = 0; // snuggle

		if (storage) { this.FromStorage(storage); }
	}

	// TODO
	public Cost() {
		return 100;
	}

	public Met() {
		return this.flags.Met >= RoaFlags.Met.Met;
	}

	// TODO (Met flag?)
	public Recruited() {
		return false;
	}

	public FromStorage(storage: IStorage) {
		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);
	}

	public ToStorage() {
		const storage: IStorage = {};

		this.SavePersonalityStats(storage);

		this.SaveFlags(storage);
		this.SaveSexFlags(storage);

		return storage;
	}

	// Schedule //TODO
	public IsAtLocation(location?: ILocation) {
		return true;
	}

	// Party interaction //TODO
	public Interact() {
		const roa: Roa = GAME().roa;
		Text.Clear();
		Text.Out(`Rawr Imma bunny.`);

		if (GetDEBUG()) {
			Text.NL();
			Text.Out(`<b>DEBUG: relation: ${roa.relation.Get()}

			DEBUG: subDom: ${roa.subDom.Get()}

			DEBUG: slut: ${roa.slut.Get()}</b>`);
			Text.NL();
		}

		Text.Flush();
		Gui.NextPrompt(NAV().PartyInteraction);
	}

}
