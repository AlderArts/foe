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

world.loc.Desert.Drylands.enc.AddEnc(function() {
	return function() {
		var parse = {
			
		};
		
		Text.Clear();
		Text.Add("Wandering the desert, you find a tiny spiky turtle slowly crawling across the sands. Taking care to avoid the prickly needles on its back, you pick up the thing and put it in your inventory.", parse);
		Text.NL();
		Text.Add("<b>Received a cactoid!</b>", parse);
		
		party.Inv().AddItem(Items.Quest.Cactoid);
		
		if(party.Inv().QueryNum(Items.Quest.Cactoid) >= 3) {
			burrows.flags["BruteTrait"] = Burrows.TraitFlags.Gathered;
			Text.NL();
			Text.Add("You think you've gathered enough of these for now, you should return them to Ophelia.", parse);
		}
		Text.Flush();
		
		world.TimeStep({minute: 15});
		
		Gui.NextPrompt();
	};
}, 1.0, function() { return burrows.Access() && burrows.flags["BruteTrait"] == Burrows.TraitFlags.Inactive; });

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
