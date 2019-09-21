/*
 *
 * Define Vaughn
 *
 */
import { Color } from "../../body/color";
import { Race } from "../../body/race";
import { Entity } from "../../entity";
import { GAME, WORLD, WorldTime } from "../../GAME";
import { ILocation } from "../../location";
import { ITime, Time } from "../../time";
import { VaughnFlags } from "./vaughn-flags";
import { VaughnTasksScenes } from "./vaughn-tasks";

export class Vaughn extends Entity {
	public taskTimer: Time;

	constructor(storage?: any) {
		super();

		this.ID = "vaughn";

		// Character stats
		this.name = "Vaughn";

		this.body.DefMale();
		this.SetSkinColor(Color.brown);
		this.SetHairColor(Color.brown);
		this.SetEyeColor(Color.brown);

		this.body.SetRace(Race.Fox);

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Met  = 0;
		this.flags.Talk = 0; // Bitmask
		this.flags.TWar = 0;
		this.flags.Sex  = 0;

		this.flags.T3 = 0; // Bitmask

		this.taskTimer = new Time();

		if (storage) { this.FromStorage(storage); }
	}

	public Met() {
		return this.flags.Met >= VaughnFlags.Met.Met;
	}

	public FromStorage(storage: any) {
		// Load flags
		this.LoadFlags(storage);

		this.taskTimer.FromStorage(storage.Ttime);
	}

	public ToStorage() {
		const storage: any = {
		};

		this.SaveFlags(storage);

		storage.Ttime = this.taskTimer.ToStorage();

		return storage;
	}

	public Update(step: ITime) {
		super.Update(step);
		if (VaughnTasksScenes.OnTask()) {
			this.taskTimer.Dec(step);
		}
	}

	// Schedule
	public IsAtLocation(location?: ILocation) {
		location = location || GAME().party.location;
		if (location === WORLD().loc.Outlaws.Camp) {
			return (WorldTime().hour >= 18 || WorldTime().hour < 6);
		}
		return false;
	}

	// Trigger after having completed either outlaws into Rigard
	// TODO OR after Belindaquest has been done (in the case the PC ignores the outlaws all the way up till then).
	// Also requires that player have access to castle grounds.
	public IntroAvailable() {
		const rigard = GAME().rigard;
		const outlaws = GAME().outlaws;
		if (this.Met()) { return false; }
		if (!outlaws.CompletedPathIntoRigard()) { return false; }
		if (!rigard.RoyalAccess()) { return false; }
		return true;
	}

	public SexTime() {
		return WorldTime().hour < 12;
	}

	public HaveDoneTerryRoleplay() {
		return false; // TODO
	}

	public Confronted() {
		return this.flags.Talk & VaughnFlags.Talk.ConfrontFollowup;
	}
}
