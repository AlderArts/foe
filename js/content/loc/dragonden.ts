/*
 *
 * Dragon den area, closed off for now
 *
 */

import { MoveToLocation, WORLD } from "../../engine/GAME";
import { EncounterTable } from "../../engine/navigation/encountertable";
import { Event } from "../../engine/navigation/event";
import { Link } from "../../engine/navigation/link";
import { ILocDragonDen } from "../../engine/navigation/location";
import { Text } from "../../engine/parser/text";
import { DrakeScenes } from "../enemy/drake";

// Create namespace
const DragonDenLoc: ILocDragonDen = {
	Entry         : new Event("Den entrance"),
};

//
// Den entrance
//
DragonDenLoc.Entry.description = () => {
	Text.Add("The ground around you is slowly turning barren as you trudge closer to the low hills. In the middle of a large cliffside, an ominous crevice snakes into the darkness. The whole area reeks of sulfur, smoke and dead things. The ground outside the entrance is littered with white bones, the flesh gnawed clean off them.<br>");
};

DragonDenLoc.Entry.links.push(new Link(
	"Hills", true, true,
	() => {
		Text.Add("Behind you is the way back to the hills.<br>");
	},
	() => {
		MoveToLocation(WORLD().loc.Highlands.Hills, {minute: 15});
	},
));

DragonDenLoc.Entry.endDescription = () => {
	Text.Add("This is likely a very bad place to be, you should leave for now.");
};

DragonDenLoc.Entry.enc = new EncounterTable();

// FUCK YOU ENCOUNTER
DragonDenLoc.Entry.AddEncounter({
	nameStr : "Drake",
	func() {
		return DrakeScenes.DrakeEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true,
});

export { DragonDenLoc };
