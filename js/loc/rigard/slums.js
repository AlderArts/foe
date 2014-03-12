





//
// Slums
//
world.loc.Rigard.Slums.gate.description = function() {
	Text.AddOutput(Text.BoldColor("Placeholder area.") + " You are in slums.");
	Text.Newline();
}

world.loc.Rigard.Slums.gate.enc = new EncounterTable();
world.loc.Rigard.Slums.gate.enc.AddEnc(function() { return Scenes.Rigard.Chatter;});
world.loc.Rigard.Slums.gate.enc.AddEnc(function() { return Scenes.Rigard.CityHistory;}, 1.0, function() { return rigard.flags["CityHistory"] == 0; });
world.loc.Rigard.Slums.gate.onEntry = function() {
	if(Math.random() < 0.2)
		Scenes.Rigard.Chatter(true);
	else
		PrintDefaultOptions();
}

world.loc.Rigard.Slums.gate.links.push(new Link(
	"Residential", true, function() { return DEBUG; },
	function() {
		Text.AddOutput("Enter the city? ");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Residental.street, {minute: 10});
	}
));
world.loc.Rigard.Slums.gate.links.push(new Link(
	"Main gate", true, true,
	function() {
		Text.AddOutput("Go to the main gate? ");
	},
	function() {
		MoveToLocation(world.loc.Plains.Gate, {minute: 10});
	}
));
world.loc.Rigard.Slums.gate.links.push(new Link(
	"Tavern", true, true,
	function() {
		Text.AddOutput("Go to the tavern? ");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Tavern.common, {minute: 10});
	}
));

world.loc.Rigard.Slums.gate.endDescription = function() {
	Text.AddOutput("Nothing else to see here.<br/>");
}
