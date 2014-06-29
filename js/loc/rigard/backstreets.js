




//
// Brothel
//
world.loc.Rigard.Brothel.brothel.description = function() {
	Text.AddOutput("You are in brothel (Shadow Lady).<br/>");
}

world.loc.Rigard.Brothel.brothel.links.push(new Link(
	"Outside", true, true,
	function() {
		Text.AddOutput("Go outside?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Residental.street);
	}
));

world.loc.Rigard.Brothel.brothel.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}



//
// Residential area
//
world.loc.Rigard.Residental.street.description = function() {
	Text.AddOutput("The common residential area is clearly a shadier part of the town. The closely spaced buildings here are shabbier than you would see elsewhere, hardly letting you see the sky for all the laundry hanging out on display for all to see.<br/>");
}

world.loc.Rigard.Residental.street.enc = new EncounterTable();
world.loc.Rigard.Residental.street.enc.AddEnc(function() { return Scenes.Rigard.Chatter;});
world.loc.Rigard.Residental.street.enc.AddEnc(function() { return Scenes.Rigard.CityHistory;}, 1.0, function() { return rigard.flags["CityHistory"] == 0; });

world.loc.Rigard.Residental.street.onEntry = function() {
	
	// TODO
	// During nighttime, sometimes groups of bandits will try to attack!
	/*
	if(!(world.time.hour >= 6 && world.time.hour < 22)) // Nighttime
	{
		if(Math.random() < 0.2) {
			Text.AddOutput("You come across a group of bandits!");
			
			Gui.NextPrompt(function() {
				var enemy = new Party();
				var numE = Rand(2)+2;
				for(var i = 0; i < numE; i++)
					enemy.AddMember(new StreetUrchin());
				var enc = new Encounter(enemy);
				enc.Start();
			});
			return;
		}
	}
	*/
	if(Math.random() < 0.2)
		Scenes.Rigard.Chatter(true);
	else
		PrintDefaultOptions();
}

world.loc.Rigard.Residental.street.links.push(new Link(
	"Gate", true, true,
	function() {
		Text.AddOutput("Go gate?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Gate, {minute: 10});
	}
));
world.loc.Rigard.Residental.street.links.push(new Link(
	"Residential", true, false
));
world.loc.Rigard.Residental.street.links.push(new Link(
	"Merchants", true, true,
	function() {
		Text.AddOutput("Go merchants?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 20});
	}
));
world.loc.Rigard.Residental.street.links.push(new Link(
	"Plaza", true, true,
	function() {
		Text.AddOutput("Go plaza?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Plaza, {minute: 10});
	}
));

world.loc.Rigard.Residental.street.links.push(new Link(
	"Slums", true, function() { return rigard.Krawitz["Q"] != Rigard.KrawitzQ.HuntingTerry; },
	function() {
		Text.AddOutput("Go slums?<br/>");
	},
	function() {
		if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HeistDone)
			Scenes.Rigard.Lockdown();
		else
			MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 10});
	}
));
world.loc.Rigard.Residental.street.links.push(new Link(
	"Brothel", true, true,
	function() {
		Text.AddOutput("Brothel is over there.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Brothel.brothel);
	}
));
world.loc.Rigard.Residental.street.links.push(new Link(
	"Miranda's", true, false,
	function() {
		Text.AddOutput("Go to Miranda's place?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Residental.miranda);
	}
));

world.loc.Rigard.Residental.street.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}
