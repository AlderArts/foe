/*
 *
 * Lake area
 *
 */

import { GAME, MoveToLocation, TimeStep, WORLD } from "../../engine/GAME";
import { QuestItems } from "../../engine/inventory/items/quest";
import { EncounterTable } from "../../engine/navigation/encountertable";
import { Event } from "../../engine/navigation/event";
import { Link } from "../../engine/navigation/link";
import { ILocLake } from "../../engine/navigation/location";
import { Party } from "../../engine/navigation/party";
import { Text } from "../../engine/parser/text";
import { Gui } from "../../gui/gui";
import { MomoScenes } from "../event/momo";
import { Burrows } from "./burrows";
import { BurrowsFlags } from "./burrows-flags";

// Create namespace
const LakeLoc: ILocLake = {
	Shore         : new Event("Shore"),
};

//
// Shore
//
LakeLoc.Shore.description = () => {
	Text.Out(`You are standing on the shore of the great lake in which the river that passes Rigard pours its waters. Further upstream, you can see the slums and docks of the great city spread out. Despite this, the lake looks pristine; you figure there must be multiple sources of its waters. Further out, you spot an island, and beyond that Eden ends, and the cloudy void begins.`);
};

LakeLoc.Shore.links.push(new Link(
	"Slums", true, true,
	undefined,
	() => {
		MoveToLocation(WORLD().loc.Rigard.Slums.Gate, {minute: 45});
	},
));

LakeLoc.Shore.enc = new EncounterTable();
LakeLoc.Shore.enc.AddEnc(() => {
	return MomoScenes.MomoEnc;
}, 1.0, () => GAME().momo.Wandering());

LakeLoc.Shore.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;
		const burrows: Burrows = GAME().burrows;

		Text.Clear();
		Text.Out(`Walking along the shore of the lake, you spot a patch of the red algae that Ophelia was looking for. Luckily enough, there seems to be plenty of it, and you are able to gather all of what she needs in a single go.

		<b>Received three samples of red algae!</b>`);

		party.Inv().AddItem(QuestItems.RedAlgae, 3);
		burrows.flags.BrainyTrait = BurrowsFlags.TraitFlags.Gathered;

		Text.NL();
		Text.Out(`You think you've gathered enough of these for now, you should return them to Ophelia.`);
		Text.Flush();

		TimeStep({minute: 15});

		Gui.NextPrompt();
	};
}, 1.0, () => {
	const burrows: Burrows = GAME().burrows;
	return burrows.Access() && burrows.flags.BrainyTrait === BurrowsFlags.TraitFlags.Inactive;
});

export { LakeLoc };
