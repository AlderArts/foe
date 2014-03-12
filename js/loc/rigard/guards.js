





//
// Gate house
//
world.loc.Rigard.Gate.description = function() {
	Text.AddOutput("You are standing just inside the city gates. Three larger roads head off into different areas of the city.<br/>");
}


world.loc.Rigard.Gate.enc = new EncounterTable();
world.loc.Rigard.Gate.enc.AddEnc(function() { return Scenes.Rigard.Chatter;});
world.loc.Rigard.Gate.enc.AddEnc(function() { return Scenes.Rigard.CityHistory;}, 1.0, function() { return rigard.flags["CityHistory"] == 0; });
world.loc.Rigard.Gate.onEntry = function() {
	if(Math.random() < 0.2)
		Scenes.Rigard.Chatter(true);
	else
		PrintDefaultOptions();
}

world.loc.Rigard.Gate.links.push(new Link(
	"Gate", true, false
));
world.loc.Rigard.Gate.links.push(new Link(
	"Residential", true, true,
	function() {
		Text.AddOutput("To the right, a street lead to the seedier part of time, where the residential area is located.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Residental.street, {minute: 10});
	}
));
world.loc.Rigard.Gate.links.push(new Link(
	"Merchants", true, true,
	function() {
		Text.AddOutput("To the left a broad street heads to the merchant district.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 10});
	}
));
world.loc.Rigard.Gate.links.push(new Link(
	"Plaza", true, true,
	function() {
		Text.AddOutput("The largest street seems to lead to the richer part of town. In the distance, you can spy a castle.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Plaza, {minute: 20});
	}
));
world.loc.Rigard.Gate.links.push(new Link(
	"Leave", true, function() { return (world.time.hour >= 6 && world.time.hour < 22); },
	function() {
		Text.AddOutput("Just outside the city walls are the expansive plains.");
		if(!(world.time.hour >= 6 && world.time.hour < 22)) // Nighttime
		{
			Text.AddOutput(" It looks like the gates are shut for the night, you can't leave the city until dawn.");
		}
		Text.AddOutput("<br/>");
	},
	function() {
		MoveToLocation(world.loc.Plains.Gate, {minute: 5});
	}
));
world.loc.Rigard.Gate.links.push(new Link(
	"Barracks", true, true,
	function() {
		Text.AddOutput("A large blocky building connects directly to the gate house. Judging from the military look, this should be the barracks of the city guard.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Barracks.common, {minute: 5});
	}
));

world.loc.Rigard.Gate.endDescription = function() {
	Text.AddOutput("Nothing else to see here.<br/>");
}




//
// Barracks
//
world.loc.Rigard.Barracks.common.description = function() {
	Text.AddOutput("You are at the barracks common room.<br/>");
}

world.loc.Rigard.Barracks.common.links.push(new Link(
	"Gate", true, true,
	function() {
		Text.AddOutput("The gate is just outside.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
	}
));
world.loc.Rigard.Barracks.common.links.push(new Link(
	"Yard", true, true,
	function() {
		Text.AddOutput("Sparring yard.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Barracks.sparring);
	}
));
world.loc.Rigard.Barracks.common.links.push(new Link(
	"Captains", true, true,
	function() {
		Text.AddOutput("The captains quarters.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Barracks.captains);
	}
));

world.loc.Rigard.Barracks.common.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}



world.loc.Rigard.Barracks.sparring.description = function() {
	Text.AddOutput("You are at sparring yard.<br/>");
}

world.loc.Rigard.Barracks.sparring.links.push(new Link(
	"Commons", true, true,
	function() {
		Text.AddOutput("Commons is inside.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Barracks.common);
	}
));

world.loc.Rigard.Barracks.sparring.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}



world.loc.Rigard.Barracks.captains.description = function() {
	Text.AddOutput("You are at captains quarters.<br/>");
}

world.loc.Rigard.Barracks.captains.links.push(new Link(
	"Commons", true, true,
	function() {
		Text.AddOutput("Commons is outside.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Barracks.common);
	}
));

world.loc.Rigard.Barracks.captains.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}


