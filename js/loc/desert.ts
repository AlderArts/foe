/*
 *
 * Desert area
 *
 */

import { EncounterTable } from "../encountertable";
import { LizardsScenes } from "../enemy/lizard";
import { NagaScenes } from "../enemy/naga";
import { ScorpionScenes } from "../enemy/scorp";
import { Event } from "../event";
import { MomoScenes } from "../event/momo";
import { RoamingScenes } from "../event/roaming";
import { GAME, MoveToLocation, TimeStep, WORLD } from "../GAME";
import { Gui } from "../gui";
import { QuestItems } from "../items/quest";
import { Link } from "../link";
import { ILocDesert } from "../location";
import { Party } from "../party";
import { Text } from "../text";
import { Burrows } from "./burrows";
import { BurrowsFlags } from "./burrows-flags";
import { OasisScenes } from "./oasis";

// Create namespace
const DesertLoc: ILocDesert = {
	Drylands         : new Event("Drylands"),
};

//
// Den entrance
//
DesertLoc.Drylands.description = () => {
	Text.Add("You’re standing in the drylands, the border between the fertile plains and the barren desert. Beyond here, you’d need the help of the desert dwellers to cross; venturing into the sandy wastes on your own would be foolhardy.");
};

DesertLoc.Drylands.enc = new EncounterTable();

DesertLoc.Drylands.enc.AddEnc(() => {
	return MomoScenes.MomoEnc;
}, 1.0, () => GAME().momo.Wandering());

DesertLoc.Drylands.enc.AddEnc(() => {
	return OasisScenes.DesertCaravanEncounter;
}, 1.0, () => true);

DesertLoc.Drylands.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;
		const burrows: Burrows = GAME().burrows;

		const parse: any = {

		};

		Text.Clear();
		Text.Add("Wandering the desert, you find a tiny, spiky turtle slowly crawling across the sands. Taking care to avoid the prickly needles on its back, you pick up the thing and put it in your inventory.", parse);
		Text.NL();
		Text.Add("<b>Received a cactoid!</b>", parse);

		party.Inv().AddItem(QuestItems.Cactoid);

		if (party.Inv().QueryNum(QuestItems.Cactoid) >= 3) {
			burrows.flags.BruteTrait = BurrowsFlags.TraitFlags.Gathered;
			Text.NL();
			Text.Add("You think you've gathered enough of these for now, you should return them to Ophelia.", parse);
		}
		Text.Flush();

		TimeStep({minute: 15});

		Gui.NextPrompt();
	};
}, 1.0, () => {
	const burrows: Burrows = GAME().burrows;
	return burrows.Access() && burrows.flags.BruteTrait === BurrowsFlags.TraitFlags.Inactive;
});

DesertLoc.Drylands.links.push(new Link(
	"Crossroads", true, true,
	undefined,
	() => {
		MoveToLocation(WORLD().loc.Plains.Crossroads, {hour: 2});
	},
));

DesertLoc.Drylands.enc.AddEnc(() => {
	return RoamingScenes.FindSomeCoins;
}, 0.5, () => true);

DesertLoc.Drylands.AddEncounter({
	nameStr : "Lizard",
	func() {
		return LizardsScenes.GroupEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true,
});

DesertLoc.Drylands.AddEncounter({
	nameStr : "Naga",
	func() {
		return NagaScenes.LoneEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true,
});

DesertLoc.Drylands.AddEncounter({
	nameStr : "Scorpion",
	func() {
		return ScorpionScenes.LoneEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true,
});

export { DesertLoc };
