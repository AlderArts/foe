/*
 * 
 * The Outlaw's camp
 * 
 */

// Create namespace
world.loc.Outlaws = {
	Camp : new Event("Outlaws' camp")
}

world.SaveSpots["Outlaws"] = world.loc.Outlaws.Camp;
world.loc.Outlaws.Camp.SaveSpot = "Outlaws";
world.loc.Outlaws.Camp.safe = function() { return true; };
//TODO
world.loc.Outlaws.Camp.description = function() {
	Text.Add("You are in the outlaws' camp.<br/>");
}

world.loc.Outlaws.Camp.onEntry = function() {
	if(rigard.Krawitz["Q"] >= Rigard.KrawitzQ.CaughtTerry && cveta.flags["Met"] < Cveta.Met.MariaTalk)
		Scenes.Cveta.MariaTalkFirst();
		
		/* TODO
		 * #Initiates when Cveta is at 60 rel. (Consider rel requirements for Zenith as well?)
		 * #Triggers when the player enters the outlaw camp in the evening.
		 */
	else if(DEBUG && outlaws.flags["BullTower"] < Outlaws.BullTowerQuest.Initiated) //TODO
		Scenes.BullTower.Initiation();
	else
		PrintDefaultOptions();
}

world.loc.Outlaws.Camp.links.push(new Link(
	"Forest", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Forest.Outskirts, {hour: 1});
	}
));

world.loc.Outlaws.Camp.links.push(new Link(
	"Tower", function() {
		return outlaws.flags["BullTower"] == Outlaws.BullTowerQuest.Initiated;
	}, true,
	null,
	function() {
		Scenes.BullTower.MovingOut();
	}
));

world.loc.Outlaws.Camp.events.push(new Link(
	"Maria", function() {
		var time = maria.IsAtLocation();
		return time;
	}, true,
	function() {
		//TODO
	},
	function() {
		Scenes.Maria.CampInteract();
	}
));

world.loc.Outlaws.Camp.events.push(new Link(
	"Cveta", function() {
		var met  = cveta.flags["Met"] >= Cveta.Met.Available;
		var time = cveta.InTent();
		return met && time;
	}, true,
	function() {
		if(cveta.flags["Met"] >= Cveta.Met.FirstMeeting)
			Scenes.Cveta.CampDesc();
	},
	function() {
		Scenes.Cveta.Approach();
	}
));

world.loc.Outlaws.Camp.events.push(new Link(
	"Performance", function() {
		var met  = cveta.flags["Met"] >= Cveta.Met.FirstMeeting;
		var time = cveta.PerformanceTime();
		return met && time;
	}, true,
	null,
	function() {
		Scenes.Cveta.Performance();
	}
));
