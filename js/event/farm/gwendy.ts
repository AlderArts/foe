/*
 *
 * Define Gwendy
 *
 */
import * as _ from "lodash";

import { Images } from "../../assets";
import { Color } from "../../body/color";
import { HairStyle } from "../../body/hair";
import { Entity } from "../../entity";
import { GAME, NAV, TimeStep, WORLD, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { IStorage } from "../../istorage";
import { IChoice } from "../../link";
import { ILocation } from "../../location";
import { Text } from "../../text";
import { ITime, Time } from "../../time";
import { GwendyFlags } from "./gwendy-flags";

// TODO: FIX STATS
export class Gwendy extends Entity {
	public cleanTimer: Time;

	constructor(storage?: IStorage) {
		super();

		this.ID = "gwendy";
		// Character stats
		this.name = "Gwendy";

		this.avatar.combat     = Images.gwendy;

		this.maxHp.base        = 80;
		this.maxSp.base        = 50;
		this.maxLust.base      = 20;
		// Main stats
		this.strength.base     = 10;
		this.stamina.base      = 11;
		this.dexterity.base    = 14;
		this.intelligence.base = 18;
		this.spirit.base       = 20;
		this.libido.base       = 13;
		this.charisma.base     = 13;

		this.level = 1;
		this.sexlevel = 1;
		this.SetExpToLevel();

		// Note, since kia has no fixed gender, create body later
		this.body.DefFemale();
		this.FirstBreastRow().size.base = 11;
		this.Butt().buttSize.base  = 8;
		this.body.height.base      = 173;
		this.body.weigth.base      = 65;
		this.body.head.hair.color  = Color.blonde;
		this.body.head.hair.length.base = 90;
		this.body.head.hair.style  = HairStyle.braid;
		this.body.head.eyes.color  = Color.blue;

		this.FirstVag().virgin = false;
		this.Butt().virgin = false;

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Met  = 0;
		this.flags.Market = 0;
		this.flags.Toys = GwendyFlags.Toys.None; // seen/used toys
		this.flags.Bailout = GwendyFlags.Bailout.Init;

		this.cleanTimer = new Time();

		// Talk rotations
		this.flags.RotChildhood = 0;
		this.flags.RotParents = 0;

		this.flags.WorkMilked = 0;
		this.flags.WorkFeed   = 0;
		// Note: refers to how many times the player won/lost
		this.flags.WonChallenge  = 0;
		this.flags.LostChallenge = 0;
		// Refers to number of scenes unlocked
		this.flags.ChallengeWinScene  = 0;
		this.flags.ChallengeLostScene = 0;

		if (storage) { this.FromStorage(storage); }
	}

	public Sexed() {
		_.forIn (this.sex, (value) => {
			if (value !== 0) {
				return true;
			}
		});
		if (this.flags.ChallengeWinScene  !== 0) { return true; }
		if (this.flags.ChallengeLostScene !== 0) { return true; }
		return false;
	}

	public FromStorage(storage: any) {
		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);

		this.cleanTimer.FromStorage(storage.ct);
	}

	public ToStorage() {
		const storage: any = {};

		this.SavePersonalityStats(storage);

		this.SaveFlags(storage);
		this.SaveSexFlags(storage);

		storage.ct = this.cleanTimer.ToStorage();

		return storage;
	}

	public Update(step: ITime) {
		super.Update(step);
		this.cleanTimer.Dec(step);
	}

	public EPlus(): boolean {
		return this.FirstCock() !== undefined;
	}

	public UsedDDildo(): boolean {
		return (this.flags.Toys & GwendyFlags.Toys.DDildo) !== 0;
	}

	public IsCleaning(): boolean {
		return !this.cleanTimer.Expired();
	}

	// Schedule
	public IsAtLocation(location: ILocation) {
		if (this.IsCleaning()) {
			return false;
		}

		const world = WORLD();
		// Numbers/slacking/sleep
		if     (location === world.loc.Farm.Loft) {
			return (WorldTime().hour >= 19 || WorldTime().hour < 5);
		// Morning routine
		} else if (location === world.loc.Farm.Barn) {
			return (WorldTime().hour >= 5  && WorldTime().hour < 9);
		// Workday
		} else if (location === world.loc.Farm.Fields) {
			return (WorldTime().hour >= 9 && WorldTime().hour < 19);
		} // TODO conditional?
		return false;
	}

	public IsAsleep() {
		return (WorldTime().hour >= 23 || WorldTime().hour < 5);
	}

	// Party interaction
	public Interact(switchSpot: boolean) {
		const gwendy: Gwendy = GAME().gwendy;
		Text.Clear();
		const that = gwendy;

		that.PrintDescription();

		const options: IChoice[] = [
			{ nameStr: "Release",
				func() {
					Text.Clear();
					Text.Add("[Placeholder] Gwendy masturbates fiercely, cumming buckets.");

					TimeStep({minute : 10});

					that.AddLustFraction(-1);
					Text.Flush();
					Gui.NextPrompt(() => {
						that.Interact(switchSpot);
					});
				}, enabled : true,
				tooltip : "Pleasure yourself.",
			},
		];
		// Equip, stats, job, switch
		that.InteractDefault(options, switchSpot, true, true, true, true);

		Gui.SetButtonsFromList(options, true, NAV().PartyInteraction);
	}

}
