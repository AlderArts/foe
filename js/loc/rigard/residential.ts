
import { EncounterTable } from "../../encountertable";
import { Event, Link } from "../../event";
import { LeiScenes } from "../../event/royals/lei-scenes";
import { TerryScenes } from "../../event/terry-scenes";
import { GAME, MoveToLocation, WORLD } from "../../GAME";
import { Gui } from "../../gui";
import { Party } from "../../party";
import { Text } from "../../text";
import { BrothelScenes } from "./brothel";
import { RigardFlags } from "./rigard-flags";

let RigardScenes: any;
export function InitResidential(rigardScenes: any) {
	RigardScenes = rigardScenes;
}

const ResidentialLoc = {
	Street   : new Event("Residential street"), // Will also contain gate to slums
	Tavern   : new Event("Maidens' bane"),
	Miranda  : new Event("Miranda's house"),
	MDungeon : new Event("Miranda's dungeon"),
};

//
// Residential area
//
ResidentialLoc.Street.description = () => {
	const rigard = GAME().rigard;

	Text.Add("The common residential area is clearly a shadier part of the town. The closely spaced buildings here are shabbier than you would see elsewhere, hardly letting you see the sky for all the laundry hanging out on display for all to see.");
	Text.NL();

	if (rigard.Krawitz.Q === RigardFlags.KrawitzQ.HuntingTerry) {
		Text.Add("Though many residents are still going about their normal business, even here, the lockdown has caused disruptions. There's a sizable group of residents standing near the gate, trying in vain to get past the guards and arguing quite vehemently as they try and make their case. An even larger group is watching the argument; some simply for entertainment, undoubtedly, but most of them are glaring at the guards.");
		Text.NL();
		Text.Add("It's not a very likely hiding place, but there's enough nooks, crannies and people here that a bold or desperate thief could try and conceal themselves.");
		Text.NL();
	}
};

ResidentialLoc.Street.enc = new EncounterTable();
ResidentialLoc.Street.enc.AddEnc(() => RigardScenes.Chatter);
ResidentialLoc.Street.enc.AddEnc(() => RigardScenes.Chatter2);
ResidentialLoc.Street.enc.AddEnc(() => RigardScenes.CityHistory, 1.0, () => {
	const rigard = GAME().rigard;
	return rigard.flags.CityHistory === 0;
});
ResidentialLoc.Street.enc.AddEnc(() => TerryScenes.ExploreResidential, 1000000.0, () => {
	const rigard = GAME().rigard;
	return rigard.Krawitz.Q === RigardFlags.KrawitzQ.HuntingTerry;
});
ResidentialLoc.Street.enc.AddEnc(() => LeiScenes.GuardStalking, 3.0, () => LeiScenes.GuardStalkingApplicable());
ResidentialLoc.Street.onEntry = () => {

	// TODO
	// During nighttime, sometimes groups of bandits will try to attack!
	/*
	if(!(WorldTime().hour >= 6 && WorldTime().hour < 22)) // Nighttime
	{
		if(Math.random() < 0.2) {
			Text.Add("You come across a group of bandits!");

			Gui.NextPrompt(() => {
				var enemy = new Party();
				var numE = Rand(2)+2;
				for(var i = 0; i < numE; i++)
					enemy.AddMember(new StreetUrchin());
				var enc = new Encounter(enemy);
				enc.Start();
			});
			return;
		}
	}
	*/
	if (Math.random() < 0.15) {
		RigardScenes.Chatter(true);
	} else if (Math.random() < 0.3) {
		RigardScenes.Chatter2(true);
 	} else {
		Gui.PrintDefaultOptions();
 	}
};

ResidentialLoc.Street.links.push(new Link(
	"Gate", true, true,
	undefined,
	() => {
		MoveToLocation(WORLD().loc.Rigard.Gate, {minute: 10});
	},
));
ResidentialLoc.Street.links.push(new Link(
	"Residential", true, false,
));
ResidentialLoc.Street.links.push(new Link(
	"Merchants", true, true,
	undefined,
	() => {
		MoveToLocation(WORLD().loc.Rigard.ShopStreet.Street, {minute: 20});
	},
));
ResidentialLoc.Street.links.push(new Link(
	"Plaza", true, true,
	undefined,
	() => {
		MoveToLocation(WORLD().loc.Rigard.Plaza, {minute: 10});
	},
));

ResidentialLoc.Street.links.push(new Link(
	"Slums", true, () => {
		const rigard = GAME().rigard;
		return !rigard.UnderLockdown();
	},
	undefined,
	() => {
		const rigard = GAME().rigard;
		if (rigard.Krawitz.Q === RigardFlags.KrawitzQ.HeistDone) {
			RigardScenes.Lockdown();
		} else {
			MoveToLocation(WORLD().loc.Rigard.Slums.Gate, {minute: 10});
		}
	},
));
ResidentialLoc.Street.links.push(new Link(
	"Brothel", true, () => BrothelScenes.IsOpen(),
	() => {
		Text.Add("A rather discreet sign on a large nearby building invites you to the brothel ‘The Shadow Lady’. The facade is richer than the regular houses of the district, and the establishment is bustling with activity.");
		Text.NL();
	},
	() => {
		MoveToLocation(WORLD().loc.Rigard.Brothel.brothel, {minute: 5});
	},
));
ResidentialLoc.Street.links.push(new Link(
	"Miranda's", true, () => {
		const miranda = GAME().miranda;
		const party: Party = GAME().party;
		return party.InParty(miranda);
	},
	undefined,
	() => {
		MoveToLocation(ResidentialLoc.Miranda);
	},
));

export { ResidentialLoc };
