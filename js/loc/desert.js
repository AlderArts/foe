/*
 * 
 * Desert area
 * 
 */

// Create namespace
world.loc.Desert = {
	Drylands         : new Event("Drylands")
}

//
// Den entrance
//
world.loc.Desert.Drylands.description = function() {
	Text.AddOutput("The grass is dried here. It seems like you are at the edge of a large desert.<br/>");
}

world.loc.Desert.Drylands.enc = new EncounterTable();

world.loc.Desert.Drylands.enc.AddEnc(function() {
	return Scenes.Momo.MomoEnc;
}, 1.0, function() { return momo.Wandering(); });

world.loc.Desert.Drylands.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.AddOutput("Behind you is the way back to the crossroads.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));

world.loc.Desert.Drylands.endDescription = function() {
	Text.AddOutput("Going into the desert unprepared is probably a bad idea.<br/>");
}
