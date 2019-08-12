/*
 * 
 * Lake area
 * 
 */

import { Event, Link } from '../event';
import { EncounterTable } from '../encountertable';
import { MoveToLocation, TimeStep, WORLD, GAME } from '../GAME';
import { Gui } from '../gui';
import { Text } from '../text';
import { MomoScenes } from '../event/momo';
import { QuestItems } from '../items/quest';
import { BurrowsFlags } from './burrows-flags';
import { Party } from '../party';

// Create namespace
let LakeLoc = {
	Shore         : new Event("Shore")
}

//
// Shore
//
LakeLoc.Shore.description = function() {
	Text.Add("You are standing on the shore of the great lake in which the river that passes Rigard pours its waters. Further upstream, you can see the slums and docks of the great city spread out. Despite this, the lake looks pristine; you figure there must be multiple sources of its waters. Further out, you spot an island, and beyond that Eden ends, and the cloudy void begins.");
}

LakeLoc.Shore.links.push(new Link(
	"Slums", true, true,
	null,
	function() {
		MoveToLocation(WORLD().loc.Rigard.Slums.Gate, {minute: 45});
	}
));

LakeLoc.Shore.enc = new EncounterTable();
LakeLoc.Shore.enc.AddEnc(function() {
	return MomoScenes.MomoEnc;
}, 1.0, function() { return GAME().momo.Wandering(); });

LakeLoc.Shore.enc.AddEnc(function() {
	return function() {
		let party : Party = GAME().party;
		let burrows = GAME().burrows;
		var parse : any = {
			
		};
		
		Text.Clear();
		Text.Add("Walking along the shore of the lake, you spot a patch of the red algae that Ophelia was looking for. Luckily enough, there seems to be plenty of it, and you are able to gather all of what she needs in a single go.", parse);
		Text.NL();
		Text.Add("<b>Received three samples of red algae!</b>", parse);
		Text.Flush();
		
		party.Inv().AddItem(QuestItems.RedAlgae, 3);
		burrows.flags["BrainyTrait"] = BurrowsFlags.TraitFlags.Gathered;
		Text.NL();
		Text.Add("You think you've gathered enough of these for now, you should return them to Ophelia.", parse);
		Text.Flush();
		
		TimeStep({minute: 15});
		
		Gui.NextPrompt();
	};
}, 1.0, function() {
	let burrows = GAME().burrows;
	return burrows.Access() && burrows.flags["BrainyTrait"] == BurrowsFlags.TraitFlags.Inactive;
});

export { LakeLoc };
