/*
 *
 * Define Maria
 *
 */
import { Abilities } from "../../abilities";
import { Images } from "../../assets";
import { Color } from "../../body/color";
import { Entity } from "../../entity";
import { GAME, WORLD, WorldTime } from "../../GAME";
import { CombatItems } from "../../items/combatitems";
import { ILocation } from "../../location";
import { StatusEffect } from "../../statuseffect";
import { Text } from "../../text";
import { ITime, Time } from "../../time";
import { OutlawsFlags } from "./outlaws-flags";

export class Maria extends Entity {
	public DDtimer: Time;
	public pots: number;

	constructor(storage?: any) {
		super();

		this.ID = "maria";

		// Character stats
		this.name = "Maria";

		this.avatar.combat = Images.maria;

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
		this.FirstVag().virgin = false;
		this.FirstBreastRow().size.base = 12.5;
		this.Butt().buttSize.base = 5;
		this.SetSkinColor(Color.brown);
		this.SetHairColor(Color.black);
		this.SetEyeColor(Color.blue);

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Met = 0; // Initial meeting. Bitmask
		this.flags.DD = 0; // Dead drops. Bitmask
		this.flags.Ranger = 0;

		this.DDtimer = new Time();

		if (storage) { this.FromStorage(storage); }
	}

	public FromStorage(storage: any) {
		this.Butt().virgin       = parseInt(storage.avirgin, 10) === 1;

		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);

		this.DDtimer.FromStorage(storage.DDtime);
	}

	public ToStorage() {
		const storage: any = {
			avirgin : this.Butt().virgin ? 1 : 0,
		};

		this.SavePersonalityStats(storage);

		this.SaveFlags(storage);

		storage.DDtime = this.DDtimer.ToStorage();

		return storage;
	}

	public Update(step: ITime) {
		super.Update(step);
		this.DDtimer.Dec(step);
	}

	// Schedule
	public IsAtLocation(location?: ILocation) {
		location = location || GAME().party.location;
		if (location === WORLD().loc.Outlaws.Camp) {
			return (WorldTime().hour >= 7 && WorldTime().hour < 22);
		}
		return false;
	}

	public EligableForDeaddropAlert() {
		const outlaws = GAME().outlaws;
		const maria: Maria = GAME().maria;
		// Only in the initial phase
		if (maria.flags.DD !== 0) { return false; }
		// Only when meeting the correct conditions
		if (outlaws.flags.Met < OutlawsFlags.Met.Bouqet) { return false; }
		// Only when meeting total Outlaws rep
		return true;
	}

	public Act(encounter: any, activeChar: any) {
		// TODO: AI!
		Text.Add("The huntress hops around nimbly.");
		Text.NL();

		// Pick a random target
		const t = this.GetSingleTarget(encounter, activeChar);

		const choice = Math.random();

		const trap = this.combatStatus.stats[StatusEffect.Counter];

		if (this.HPLevel() < 0.3 && this.pots > 0) {
			this.pots--;
			CombatItems.HPotion.combat.Use(encounter, this, this);
		} else if (choice < 0.2 && Abilities.Physical.SetTrap.enabledCondition(encounter, this) && trap === undefined) {
			Abilities.Physical.SetTrap.Use(encounter, this, this);
 		} else if (choice < 0.4 && Abilities.Physical.Hamstring.enabledCondition(encounter, this)) {
			Abilities.Physical.Hamstring.Use(encounter, this, t);
 		} else if (choice < 0.6 && Abilities.Physical.FocusStrike.enabledCondition(encounter, this)) {
			Abilities.Physical.FocusStrike.Use(encounter, this, t);
 		} else if (choice < 0.8 && Abilities.Physical.Ensnare.enabledCondition(encounter, this)) {
			Abilities.Physical.Ensnare.Use(encounter, this, t);
 		} else {
			Abilities.Attack.Use(encounter, this, t);
 		}
	}
}
