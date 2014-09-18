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

world.loc.Lake.Shore.enc.AddEnc(function() {
	return function() {
		var parse = {
			
		};
		
		Text.Clear();
		Text.Add("Walking along the shore of the lake, you spot a patch of the red algae that Ophelia was looking for. Luckily enough, there seems to be plenty of it, and you are able to gather all of what she needs in a single go.", parse);
		Text.NL();
		Text.Add("<b>Received three samples of red algae!</b>", parse);
		Text.Flush();
		
		party.Inv().AddItem(Items.Quest.RedAlgae, 3);
		burrows.flags["BrainyTrait"] = Burrows.TraitFlags.Gathered;
		Text.NL();
		Text.Add("You think you've gathered enough of these for now, you should return them to Ophelia.", parse);
		Text.Flush();
		
		world.TimeStep({minute: 15});
		
		Gui.NextPrompt();
	};
}, 1.0, function() { return burrows.Access() && burrows.flags["BrainyTrait"] == Burrows.TraitFlags.Inactive; });

world.loc.Lake.Shore.endDescription = function() {
	Text.AddOutput("What do you do?<br/>");
}
