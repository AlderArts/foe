/*
 * 
 * The Outlaw's camp
 * 
 */

// Create namespace
world.loc.Outlaws = {
	Camp : new Event("Outlaws' camp")
}

//TODO
world.loc.Outlaws.Camp.description = function() {
	Text.Add("You are in the outlaws' camp.<br/>");
}

world.loc.Outlaws.Camp.onEntry = function() {
	if(rigard.Krawitz["Q"] >= Rigard.KrawitzQ.CaughtTerry && cveta.flags["Met"] < Cveta.Met.MariaTalk)
		Scenes.Cveta.MariaTalkFirst();
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

world.loc.Outlaws.Camp.events.push(new Link(
	"Cveta", function() {
		var met  = cveta.flags["Met"] >= Cveta.Met.AccessibleTalk;
		var time = cveta.WakingTime();
		return met && time;
	}, true,
	function() {
		if(cveta.flags["Met"] >= Cveta.Met.FirstMeeting)
			Scenes.Cveta.CampDesc();
	},
	function() {
		//TODO
	}
));

world.loc.Outlaws.Camp.events.push(new Link(
	"Princess", function() {
		var met  = cveta.flags["Met"] == Cveta.Met.MariaTalk;
		var time = cveta.WakingTime();
		return met && time;
	}, true,
	function() {
		var met  = cveta.flags["Met"] == Cveta.Met.MariaTalk;
		var time = cveta.WakingTime();
		if(met && time) {
			Text.Add("You remember what Maria talked to you about before. If she really can't sort out this so-called princess, maybe you can.");
			Text.NL();
		}
	},
	function() {
		Scenes.Cveta.MariaTalkRepeat();
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
		//TODO
	}
));

world.loc.Outlaws.Camp.endDescription = function() {
	Text.Add("What do you do?<br/>");
}
