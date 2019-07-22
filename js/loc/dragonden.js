/*
 * 
 * Dragon den area, closed off for now
 * 
 */

import { world } from '../world';
import { Event, Link, EncounterTable } from '../event';

// Create namespace
let DragonDenLoc = {
	Entry         : new Event("Den entrance")
}

//
// Den entrance
//
DragonDenLoc.Entry.description = function() {
	Text.Add("The ground around you is slowly turning barren as you trudge closer to the low hills. In the middle of a large cliffside, an ominous crevice snakes into the darkness. The whole area reeks of sulfur, smoke and dead things. The ground outside the entrance is littered with white bones, the flesh gnawed clean off them.<br>");
}

DragonDenLoc.Entry.links.push(new Link(
	"Hills", true, true,
	function() {
		Text.Add("Behind you is the way back to the hills.<br>");
	},
	function() {
		MoveToLocation(world.loc.Highlands.Hills, {minute: 15});
	}
));

DragonDenLoc.Entry.endDescription = function() {
	Text.Add("This is likely a very bad place to be, you should leave for now.");
}

DragonDenLoc.Entry.enc = new EncounterTable();

// FUCK YOU ENCOUNTER
DragonDenLoc.Entry.AddEncounter({
	nameStr : "Drake",
	func    : function() {
		return Scenes.Drake.DrakeEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true
});

export { DragonDenLoc };
