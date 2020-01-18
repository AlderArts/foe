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
import { GAME, NAV, WORLD, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { IStorage } from "../../istorage";
import { ILocation } from "../../location";
import { Stat } from "../../stat";
import { Text } from "../../text";
import { TF } from "../../tf";
import { ITime, Time } from "../../time";
import { AdrianFlags } from "./adrian-flags";

export class Adrian extends Entity {
	public jealousy: Stat;
	public interactTimer: Time;
	public workTimer: Time;

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

		this.SetLevelBonus();
		this.RestFull();

		const that = this;
		this.jealousy = new Stat(0);
		this.jealousy.debug = () => that.name + ".jealousy";

		this.flags.Met = AdrianFlags.Met.NotMet;
		this.flags.Flags = 0;
		this.flags.EPlus = AdrianFlags.EPlus.NotStarted;
		// Talk progression
		this.flags.TalkWork = 0;
		this.flags.SeduceCnt = 0;

		this.interactTimer = new Time();
		this.workTimer = new Time();

		if (storage) { this.FromStorage(storage); }

		this.SetCock();
	}

	public FromStorage(storage: any) {
		this.body.FromStorage(storage.body);
		this.LoadPersonalityStats(storage);

		this.jealousy.base = parseInt(storage.jealousy, 10) || this.jealousy.base;

		// Load flags
		this.LoadFlags(storage);

		this.interactTimer.FromStorage(storage.iTimer);
		this.workTimer.FromStorage(storage.wTimer);
	}

	public ToStorage() {
		const storage: any = {};

		this.SaveBodyPartial(storage, {ass: true}); // Cock stored in State, don't need to load here
		this.SavePersonalityStats(storage);

		if (this.jealousy.base !== 0) { storage.jealousy = this.jealousy.base.toFixed(); }

		this.SaveFlags(storage);
		storage.iTimer = this.interactTimer.ToStorage();
		storage.wTimer = this.workTimer.ToStorage();

		return storage;
	}

	public Update(step: ITime) {
		super.Update(step);
		this.interactTimer.Dec(step);
		this.workTimer.Dec(step);
	}

	public SetCock() {
		const Dom = this.flags.Met === AdrianFlags.Met.Dom;
		if (Dom) {
			this.FirstCock().length.base    = 40;
			this.FirstCock().thickness.base = 6;
			this.Balls().cumCap.base        = 15;
			this.Balls().size.base          = 8;
		} else {
			this.FirstCock().length.base    = 32;
			this.FirstCock().thickness.base = 5;
			this.Balls().cumCap.base        = 10;
			this.Balls().size.base          = 6;
		}
		this.Balls().count.base         = 2;
	}

	public Jealousy() {
		return this.jealousy.Get();
	}

	public Timeout(): boolean {
		return !this.interactTimer.Expired();
	}

	public IsAsleep() {
		return (WorldTime().hour >= 22 || WorldTime().hour < 5);
	}

	// Schedule
	public IsAtLocation(location?: ILocation) {
		if (this.Timeout()) {
			return false;
		}

		const world = WORLD();
		// Workday (Fields)
		if (location === world.loc.Farm.Fields) {
			return (WorldTime().hour >= 5  && WorldTime().hour < 15);
		// Workday (Barn)
		} else if (location === world.loc.Farm.Barn) {
			return true;
		}
		return false;
	}
}
