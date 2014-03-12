

world.loc.Rigard.Castle = {
	Grounds   : new Event("Royal grounds"),
	MageTower : new Event("Mage's tower"),
	Court     : new Event("Royal court"),
	Dungeon   : new Event("Dungeons")
}



//
// Castle: Grounds
//
world.loc.Rigard.Castle.Grounds.description = function() {
	Text.AddOutput("You are in the royal grounds.<br/>");
}

world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Plaza", true, true,
	function() {
		Text.AddOutput("Return to the plaza?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Plaza);
	}
));
world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Court", true, false, // TODO
	function() {
		Text.AddOutput("Go to castle?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Castle.Court);
	}
));
world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Tower", true, true,
	function() {
		Text.AddOutput("Go to mage tower?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Castle.MageTower);
	}
));
world.loc.Rigard.Castle.Grounds.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}



//
// Castle: Mage tower
//
world.loc.Rigard.Castle.MageTower.description = function() {
	Text.AddOutput("You are in the mage's tower.<br/>");
}

world.loc.Rigard.Castle.MageTower.links.push(new Link(
	"Grounds", true, true,
	function() {
		Text.AddOutput("Return outside?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Castle.Grounds);
	}
));
world.loc.Rigard.Castle.MageTower.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}
