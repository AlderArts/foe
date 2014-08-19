/*
 * 
 * Highlands area, connects to the mountains and to the dragons' den.
 * Good hunting grounds
 * 
 */

// Create namespace
world.loc.Lake = {
	Shore         : new Event("Shore")
}

//
// Hills, main hunting grounds
//
world.loc.Lake.Shore.description = function() {
	Text.AddOutput("This place looks lakey. Looks fishy.<br/>");
}

world.loc.Lake.Shore.links.push(new Link(
	"Rigard", true, true,
	function() {
		Text.AddOutput("Behind you is the way back to Rigard.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 15});
	}
));

world.loc.Lake.Shore.enc = new EncounterTable();
world.loc.Lake.Shore.enc.AddEnc(function() {
	return Scenes.Momo.MomoEnc;
}, 1.0, function() { return momo.Wandering(); });


world.loc.Lake.Shore.endDescription = function() {
	Text.AddOutput("What do you do?<br/>");
}
