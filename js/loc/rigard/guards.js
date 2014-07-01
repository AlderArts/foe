



/*
 * 


 */

//
// Gate house
//
world.loc.Rigard.Gate.description = function() {
	Text.Add("The gate area is where most of the merchandise enters the city. It houses a stable for mounts and several checkpoints where you’re supposed to have your cargo inspected, though not everyone is ordered to head there. You wonder if there is an actual process for screening out shady sorts or if the watch simply chooses at random. Overall this place seems well guarded, and you have a slight suspicion that the fact the Watch’s Barracks are located nearby might have something to do with it.");
	Text.NL();
	Text.Add("Ahead of you the path splits into three. One path leads to the residential district, where most of the citizens live. Another path leads you to the merchant district, where most of the commerce is handled, and the merchant warehouses are located. The last path leads you toward Rigard’s richer areas - toward the Castle, which seems to be even more fortified than the front gates.");
	Text.NL();
	
	if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry) {
		Text.Add("With the lockdown, the whole place is in a near-riot, the usual commotion and clamour amplified tenfold as caravans try and fail to get past the blockade in either direction and merchants and guards argue with one another, devolving into screaming matches as much to try and be heard over the noise as from sheer frustration.");
		Text.NL();
		Text.Add("The gates certainly won't be opening anytime soon, but this is still a pretty good place for a thief to try hiding. All this chaos will easily cover someone sneaking around.");
	}
	else {
		Text.Add("Just outside the city walls are the expansive plains.");
		if(!(world.time.hour >= 6 && world.time.hour < 22)) // Nighttime
		{
			Text.Add(" It looks like the gates are shut for the night, you can't leave the city until dawn.");
		}
	}
}


world.loc.Rigard.Gate.enc = new EncounterTable();
world.loc.Rigard.Gate.enc.AddEnc(function() { return Scenes.Rigard.Chatter;});
world.loc.Rigard.Gate.enc.AddEnc(function() { return Scenes.Rigard.CityHistory;}, 1.0, function() { return rigard.flags["CityHistory"] == 0; });
world.loc.Rigard.Gate.enc.AddEnc(function() { return Scenes.Terry.ExploreGates; }, 1000000.0, function() { return rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry; });
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
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Residental.street, {minute: 10});
	}
));
world.loc.Rigard.Gate.links.push(new Link(
	"Merchants", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 10});
	}
));
world.loc.Rigard.Gate.links.push(new Link(
	"Plaza", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Plaza, {minute: 20});
	}
));
world.loc.Rigard.Gate.links.push(new Link(
	"Leave", true, function() { return (world.time.hour >= 6 && world.time.hour < 22) && !rigard.UnderLockdown(); },
	null,
	function() {
		if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HeistDone)
			Scenes.Rigard.Lockdown();
		else
			MoveToLocation(world.loc.Plains.Gate, {minute: 5});
	}
));
world.loc.Rigard.Gate.links.push(new Link(
	"Barracks", true, function() { return !rigard.UnderLockdown(); },
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Barracks.common, {minute: 5});
	}
));

world.loc.Rigard.Gate.endDescription = function() {
	Text.Flush();
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


