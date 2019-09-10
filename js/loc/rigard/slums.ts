
import { EncounterTable } from "../../encountertable";
import { Event, Link } from "../../event";
import { MirandaScenes } from "../../event/miranda-scenes";
import { LeiScenes } from "../../event/royals/lei-scenes";
import { GAME, MoveToLocation, WORLD, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { ILocRigardSlums } from "../../location";
import { Text } from "../../text";
import { Season } from "../../time";

let RigardScenes: any;
export function InitSlums(rigardScenes: any) {
	RigardScenes = rigardScenes;
}

const SlumsLoc: ILocRigardSlums = {
	Gate     : new Event("Peasants' Gate"),
	Docks    : new Event("Docks"),
};

//
// Slums
//
SlumsLoc.Gate.description = () => {
	const miranda = GAME().miranda;

	Text.Add("The slum of Rigard is a wretched cesspool of bustling activity at all times of the day. The sprawling ghetto spreads out along the riverfront, crawling along the walls of the city as if trying to get inside. Most houses you see are built of sturdy but cheap wood, intended to weather the cold winters but not designed for comfort or aesthetics.");
	Text.NL();
	Text.Add("The ‘streets’ are mostly mud[winter], battered every day by countless feet. The smell of the docks reach you even here, near the gates to the inner city.", {winter: WorldTime().season === Season.Winter ? ", a dirty slush at this time of year" : ""});
	Text.NL();

	if (miranda.IsAtLocation()) {
		MirandaScenes.RigardSlumGatesDesc();
	} else {
		const fucked = miranda.flags.gBJ + miranda.flags.gAnal;
		if (fucked > 10) {
			Text.Add("You recognize almost every guard manning the gates by this point, and they certainly recognize you, having seen you getting used by Miranda on more than one occasion.");
		} else if (fucked > 0 && Math.random() > 0.5) {
			Text.Add("Most of the guards manning the gates look unfamiliar to you, though you hear a snicker indicating that someone recognizes you for your exploits. News travels fast, you guess.");
 		} else {
			Text.Add("The guards regard you with rather disinterested looks, lounging at a table beside the gate.");
 		}
		Text.NL();
	}

	Text.Flush();
};

SlumsLoc.Gate.enc = new EncounterTable();
SlumsLoc.Gate.enc.AddEnc(() => RigardScenes.Chatter);
SlumsLoc.Gate.enc.AddEnc(() => RigardScenes.Chatter2);
SlumsLoc.Gate.enc.AddEnc(() => RigardScenes.CityHistory, 1.0, () => {
	const rigard = GAME().rigard;
	return rigard.flags.CityHistory === 0;
});
SlumsLoc.Gate.enc.AddEnc(() => LeiScenes.GuardStalking, 3.0, () => LeiScenes.GuardStalkingApplicable());
SlumsLoc.Gate.onEntry = () => {
	if (Math.random() < 0.15) {
		RigardScenes.Chatter(true);
	} else if (Math.random() < 0.3) {
		RigardScenes.Chatter2(true);
 } else {
		Gui.PrintDefaultOptions();
 }
};

SlumsLoc.Gate.links.push(new Link(
	"Rigard", true, true,
	() => {
		Text.Add("Enter the city? ");
	},
	() => {
		const rigard = GAME().rigard;
		const miranda = GAME().miranda;
		Text.Clear();
		if (miranda.IsAtLocation()) {
			MirandaScenes.RigardSlumGatesEnter();
		} else {
			if (!rigard.GatesOpen()) {
				Text.Add("One of the guards tells you that the gates are closed for the night, and that you should return at another time. The gates are open between eight in the morning and five in the evening.");
			} else if (rigard.Visa()) {
				Text.Add("The guards lazily check your papers before letting you through the gates into the city. They apparently found no issue, or simply didn’t want to bother with searching you, as the process is quick and painless.");
				Text.Flush();
				Gui.NextPrompt(() => {
					MoveToLocation(WORLD().loc.Rigard.Residential.Street, {minute: 5});
				});
				return;
			} else {
				Text.Add("One of the guards explains that you can’t get through if you don’t have a city issued visa. They don’t seem particularly interested in helping you getting one either.");
			}
			Text.Flush();
			Gui.PrintDefaultOptions(true);
		}
	},
));
SlumsLoc.Gate.links.push(new Link(
	"Main gate", true, true,
	() => {
		Text.Add("Go to the main gate? ");
	},
	() => {
		MoveToLocation(WORLD().loc.Plains.Gate, {minute: 15});
	},
));
SlumsLoc.Gate.links.push(new Link(
	"Tavern", true, true,
	() => {
		Text.Add("Go to the tavern? ");
	},
	() => {
		MoveToLocation(WORLD().loc.Rigard.Tavern.Common, {minute: 10});
	},
));
SlumsLoc.Gate.links.push(new Link(
	"Lake", true, true,
	() => {
		Text.Add("Go to the lake? ");
	},
	() => {
		MoveToLocation(WORLD().loc.Lake.Shore, {minute: 45});
	},
));

SlumsLoc.Gate.events.push(new Link(
	"Miranda", () => {
		const miranda = GAME().miranda;
		return miranda.IsAtLocation();
	}, true,
	undefined,
	() => {
		MirandaScenes.RigardGatesInteract();
	},
));

export { SlumsLoc };
