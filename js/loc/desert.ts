/*
 * 
 * Desert area
 * 
 */

import { Event, Link } from '../event';
import { EncounterTable } from '../encountertable';
import { MoveToLocation, TimeStep, GAME, WORLD } from '../GAME';
import { Text } from '../text';
import { Gui } from '../gui';
import { MomoScenes } from '../event/momo';
import { OasisScenes } from './oasis';
import { QuestItems } from '../items/quest';
import { RoamingScenes } from '../event/roaming';
import { LizardsScenes } from '../enemy/lizard';
import { NagaScenes } from '../enemy/naga';
import { ScorpionScenes } from '../enemy/scorp';
import { BurrowsFlags } from './burrows-flags';
import { Party } from '../party';

// Create namespace
let DesertLoc = {
	Drylands         : new Event("Drylands")
}

//
// Den entrance
//
DesertLoc.Drylands.description = function() {
	Text.Add("You’re standing in the drylands, the border between the fertile plains and the barren desert. Beyond here, you’d need the help of the desert dwellers to cross; venturing into the sandy wastes on your own would be foolhardy.");
}

DesertLoc.Drylands.enc = new EncounterTable();

DesertLoc.Drylands.enc.AddEnc(function() {
	return MomoScenes.MomoEnc;
}, 1.0, function() { return GAME().momo.Wandering(); });

DesertLoc.Drylands.enc.AddEnc(function() {
	return OasisScenes.DesertCaravanEncounter;
}, 1.0, function() { return true; });

DesertLoc.Drylands.enc.AddEnc(function() {
	return function() {
		let party : Party = GAME().party;
		let burrows = GAME().burrows;

		let parse : any = {
			
		};
		
		Text.Clear();
		Text.Add("Wandering the desert, you find a tiny, spiky turtle slowly crawling across the sands. Taking care to avoid the prickly needles on its back, you pick up the thing and put it in your inventory.", parse);
		Text.NL();
		Text.Add("<b>Received a cactoid!</b>", parse);
		
		party.Inv().AddItem(QuestItems.Cactoid);
		
		if(party.Inv().QueryNum(QuestItems.Cactoid) >= 3) {
			burrows.flags["BruteTrait"] = BurrowsFlags.TraitFlags.Gathered;
			Text.NL();
			Text.Add("You think you've gathered enough of these for now, you should return them to Ophelia.", parse);
		}
		Text.Flush();
		
		TimeStep({minute: 15});
		
		Gui.NextPrompt();
	};
}, 1.0, function() {
	let burrows = GAME().burrows;
	return burrows.Access() && burrows.flags["BruteTrait"] == BurrowsFlags.TraitFlags.Inactive;
});

DesertLoc.Drylands.links.push(new Link(
	"Crossroads", true, true,
	null,
	function() {
		MoveToLocation(WORLD().loc.Plains.Crossroads, {hour: 2});
	}
));

DesertLoc.Drylands.enc.AddEnc(function() {
	return RoamingScenes.FindSomeCoins;
}, 0.5, function() { return true; });

DesertLoc.Drylands.AddEncounter({
	nameStr : "Lizard",
	func    : function() {
		return LizardsScenes.GroupEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true
});

DesertLoc.Drylands.AddEncounter({
	nameStr : "Naga",
	func    : function() {
		return NagaScenes.LoneEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true
});

DesertLoc.Drylands.AddEncounter({
	nameStr : "Scorpion",
	func    : function() {
		return ScorpionScenes.LoneEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true
});

export { DesertLoc };
