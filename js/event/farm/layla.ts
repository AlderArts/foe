/*
 *
 * Define Layla
 *
 */

import { Images } from "../../assets";
import { Color } from "../../body/color";
import { Entity } from "../../entity";
import { GAME, WORLD, WorldTime } from "../../GAME";
import { JobDesc, Jobs } from "../../job";
import { ILocation } from "../../location";
import { Time } from "../../time";
import { LaylaFlags } from "./layla-flags";
import { LaylaScenes } from "./layla-scenes";

export class Layla extends Entity {
	public farmTimer: Time;

	constructor(storage?: any) {
		super();
		this.ID = "layla";

		// Character stats
		this.name = "Layla";

		this.avatar.combat = Images.layla;

		this.currentJob = Jobs.Fighter;
		this.jobs.Fighter   = new JobDesc(Jobs.Fighter);   this.jobs.Fighter.mult   = 1.2;
		this.jobs.Scholar   = new JobDesc(Jobs.Scholar);   this.jobs.Scholar.mult   = 1.2;
		this.jobs.Courtesan = new JobDesc(Jobs.Courtesan); this.jobs.Courtesan.mult = 1.2;

		this.jobs.Bruiser   = new JobDesc(Jobs.Bruiser); this.jobs.Bruiser.mult = 1.2;
		this.jobs.Rogue     = new JobDesc(Jobs.Rogue);   this.jobs.Rogue.mult   = 1.2;
		this.jobs.Ranger    = new JobDesc(Jobs.Ranger);  this.jobs.Ranger.mult  = 1.2;

		this.jobs.Mage      = new JobDesc(Jobs.Mage);   this.jobs.Mage.mult   = 1.2;
		this.jobs.Mystic    = new JobDesc(Jobs.Mystic); this.jobs.Mystic.mult = 1.2;
		this.jobs.Healer    = new JobDesc(Jobs.Healer); this.jobs.Healer.mult = 1.2;

		this.jobs.Elementalist = new JobDesc(Jobs.Elementalist); this.jobs.Elementalist.mult = 1.2;
		this.jobs.Warlock      = new JobDesc(Jobs.Warlock);      this.jobs.Warlock.mult = 1.2;
		this.jobs.Hypnotist    = new JobDesc(Jobs.Hypnotist);    this.jobs.Hypnotist.mult = 1.2;

		this.maxHp.base        = 100;
		this.maxSp.base        = 60;
		this.maxLust.base      = 80;
		// Main stats
		this.strength.base     = 20; this.strength.growth     = 1.3;
		this.stamina.base      = 22; this.stamina.growth      = 1.4;
		this.dexterity.base    = 30; this.dexterity.growth    = 1.5;
		this.intelligence.base = 30; this.intelligence.growth = 1.5;
		this.spirit.base       = 35; this.spirit.growth       = 1.8;
		this.libido.base       = 30; this.libido.growth       = 1.6;
		this.charisma.base     = 25; this.charisma.growth     = 1.5;

		this.level = 12;
		this.sexlevel = 1;
		this.SetExpToLevel();

		this.body.DefHerm();
		this.FirstBreastRow().size.base = 12.5;
		this.Butt().buttSize.base = 5;
		this.SetSkinColor(Color.blue);
		this.SetHairColor(Color.black);
		this.SetEyeColor(Color.red);

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Met = LaylaFlags.Met.NotMet;
		this.flags.Take = 0;
		this.flags.Skin = 0;
		this.flags.Talk = 0; // Bitmask

		this.farmTimer = new Time();

		if (storage) { this.FromStorage(storage); }
	}

	public FromStorage(storage: any) {
		this.body.FromStorage(storage.body);
		this.LoadPersonalityStats(storage);
		this.LoadFlags(storage);

		this.LoadPregnancy(storage);
		this.LoadSexFlags(storage);
		this.LoadCombatStats(storage);
		this.LoadPersonalityStats(storage);

		this.LoadJobs(storage);

		this.RecallAbilities();
		this.SetLevelBonus();

		this.farmTimer.FromStorage(storage.ft);
	}

	public ToStorage() {
		const storage: any = {};

		this.SaveBodyPartial(storage, {ass: true, vag: true, balls: true});
		this.SavePersonalityStats(storage);
		this.SaveFlags(storage);

		this.SavePregnancy(storage);
		this.SaveSexFlags(storage);
		this.SaveCombatStats(storage);
		this.SavePersonalityStats(storage);

		this.SaveJobs(storage);

		storage.ft = this.farmTimer.ToStorage();

		return storage;
	}

	public Update(step: number) {
		super.Update(step);
		this.farmTimer.Dec(step);
	}

	// Schedule
	public IsAtLocation(location?: ILocation) {
		location = location || GAME().party.location;
		if (location === WORLD().loc.Farm.Fields) {
			return (WorldTime().hour >= 7 && WorldTime().hour < 22);
		}
		return false;
	}

	public Virgin() {
		return this.FirstVag().virgin;
	}

	// Party interaction
	public Interact(switchSpot: boolean) {
		LaylaScenes.PartyRegular(switchSpot);
	}

}
