/*
 * 
 * The Outlaw's camp
 * 
 */

import { world } from '../world';
import { Event, Link, EncounterTable } from '../event';
import { Scenes } from '../scenes';

// Create namespace
let OutlawsLoc = {
	Camp : new Event("Outlaws' camp"),
	Infirmary : new Event("Infirmary")
}

world.SaveSpots["Outlaws"] = OutlawsLoc.Camp;
OutlawsLoc.Camp.SaveSpot = "Outlaws";
OutlawsLoc.Camp.safe = function() { return true; };
//TODO
OutlawsLoc.Camp.description = function() {
	Text.Add("You are in the outlaws' camp.<br>");
	
	if(GetDEBUG()) {
		Text.NL();
		Text.Add("DEBUG: Outlaws rep: " + outlaws.Rep(), null, 'bold');
		Text.NL();
	}
}

OutlawsLoc.Camp.onEntry = function() {
	if(outlaws.Rep() >= 10 && outlaws.flags["Met"] == Outlaws.Met.Bouqet && outlaws.mainQuestTimer.Expired())
		Scenes.Outlaws.PathIntoRigardInitiation();
	else if(outlaws.Rep() >= 15 && rigard.Krawitz["Q"] >= Rigard.KrawitzQ.CaughtTerry && cveta.flags["Met"] < Cveta.Met.MariaTalk)
		Scenes.Cveta.MariaTalkFirst();
	else if(outlaws.Rep() >= 25 && outlaws.flags["Met"] >= Outlaws.Met.MetBelinda && cveta.Relation() >= 60 && outlaws.flags["BullTower"] < Outlaws.BullTowerQuest.Initiated)
		Scenes.BullTower.Initiation();
	else if(outlaws.AlaricSaved() && outlaws.flags["BullTower"] < Outlaws.BullTowerQuest.AlaricFollowup && outlaws.mainQuestTimer.Expired())
		Scenes.BullTower.AftermathAlaric();
	else if(outlaws.BullTowerCanGetReward() && outlaws.flags["BullTower"] < Outlaws.BullTowerQuest.ZenithFollowup && outlaws.mainQuestTimer.Expired())
		Scenes.BullTower.AftermathZenith();
	else if(maria.EligableForDeaddropAlert())
		Scenes.Maria.DeadDrops.Alert();
	else if(vaughn.IntroAvailable())
		Scenes.Vaughn.Introduction();
	else
		PrintDefaultOptions();
}

OutlawsLoc.Camp.links.push(new Link(
	"Forest", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Forest.Outskirts, {hour: 1});
	}
));

OutlawsLoc.Camp.links.push(new Link(
	"Infirmary", true, true,
	null,
	function() {
		MoveToLocation(OutlawsLoc.Infirmary, {minute: 5});
	}
));

OutlawsLoc.Camp.links.push(new Link(
	"Tower", function() {
		return outlaws.flags["BullTower"] == Outlaws.BullTowerQuest.Initiated;
	}, true,
	null,
	function() {
		Scenes.BullTower.MovingOut();
	}
));

OutlawsLoc.Camp.events.push(new Link(
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

OutlawsLoc.Camp.events.push(new Link(
	"Vaughn", function() {
		var time = vaughn.IsAtLocation();
		return time && vaughn.Met();
	}, true,
	function() {
		if(vaughn.Met())
			Scenes.Vaughn.CampDesc();
	},
	function() {
		Scenes.Vaughn.CampApproach();
	}
));

OutlawsLoc.Camp.events.push(new Link(
	"Cveta", function() {
		var met  = cveta.flags["Met"] >= Cveta.Met.Available;
		var time = cveta.WakingTime();
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

OutlawsLoc.Camp.events.push(new Link(
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


OutlawsLoc.Camp.enc = new EncounterTable();
OutlawsLoc.Camp.enc.AddEnc(function() {
	return Scenes.Outlaws.Exploration.ChowTime;
}, 1.0, function() { return world.time.hour >= 5 && world.time.hour < 22; });
OutlawsLoc.Camp.enc.AddEnc(function() {
	return Scenes.Outlaws.Exploration.Cavalcade;
}, 1.0, function() { return Scenes.OutlawsCavalcade.Enabled(); });
OutlawsLoc.Camp.enc.AddEnc(function() {
	return Scenes.Outlaws.Exploration.Archery;
}, 1.0, function() { return outlaws.flags["Met"] >= Outlaws.Met.MetBelinda && world.time.IsDay(); });
OutlawsLoc.Camp.enc.AddEnc(function() {
	return Scenes.Outlaws.Exploration.CampFollowers;
}, 1.0, function() { return !world.time.IsDay(); });
OutlawsLoc.Camp.enc.AddEnc(function() {
	return Scenes.Outlaws.Exploration.Feeding;
}, 1.0, function() { return true; });
OutlawsLoc.Camp.enc.AddEnc(function() {
	return Scenes.Outlaws.Exploration.Carpentry;
}, 1.0, function() { return outlaws.flags["Met"] >= Outlaws.Met.MetBelinda; });
OutlawsLoc.Camp.enc.AddEnc(function() {
	return Scenes.Outlaws.Exploration.FactFinding;
}, 1.0, function() { return outlaws.factTimer.Expired(); });
OutlawsLoc.Camp.enc.AddEnc(function() {
	return Scenes.Outlaws.Exploration.DailyLife;
}, 1.0, function() { return true; });
/* TODO
OutlawsLoc.Camp.enc.AddEnc(function() {
	return function() {
		
	};
}, 1.0, function() { return true; });
*/

OutlawsLoc.Infirmary.description = function() {
	var parse = {
		
	};
	
	Text.Add("This large tent is what passes for an infirmary in the outlaws’ camp. As soon as you step through the open flaps, three rows of simple wooden cots - no more than tough cloth stretched out on wooden frames - greet your eyes; thankfully, only a few of them are filled at any one time. Further to the back, makeshift workbenches and shelves for storing herbs, minerals and medications; besides that, a burner that works away without rest. You note that ", parse);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("it’s currently boiling water in a large tin pot, in which the good surgeon’s scalpel, tweezers and a host of other disturbingly sharp tools are immersed.", parse);
	});
	scenes.AddEnc(function() {
		parse["t"] = party.InParty(terry) ? Text.Parse(", causing Terry to wrinkle [hisher] nose in disgust", { hisher: terry.hisher() }) : "";
		Text.Add("it’s been attached to a flask and a maze of glass tubes, obviously a distillery - spirits go in one end, and purified alcohol comes out the other. The resultant smell that emerges with the steam and fills the air is sharp and harsh[t].", parse);
	});
	scenes.AddEnc(function() {
		Text.Add("the flame has been turned down to slowly warm a crucible filled with fragrant herbs, a pleasant aroma wafting through the air that makes you feel restful and drowsy.", parse);
	});
	scenes.Get();
	
	Text.NL();
	Text.Add("A large, prominently displayed sign declares: <i>“If you’re going to report sick, you’d better damn well be sick.”</i>", parse);
	Text.NL();
	Text.Add("Another corner has been set up with curtains and a large stone table, complete with restraints cobbled together from metal rings and leather straps. Despite the fact that its surface is smooth and great pains have been taken to keep it clean, numerous bloodstains adorn its surface and sides. A number of depressingly grim implements hang from nearby hooks - a large saw, leather strops, what looks like a sharpened butcher’s cleaver…  there’s little doubt that the curtains are there to spare the bedridden the sight of what goes on within by necessity.", parse);
	Text.NL();
	Text.Add("Towards the back, obscured by the shelves and a large bookcase, are Aquilius’ quarters. Although you can’t see them from where you stand, you know they’re as sparse and functional as any of the other outlaws’. A couple of potted, leafy plants have been placed near a window, clearly herbs of some sort; there’s even a damp log on which mushrooms are sprouting in large yellow clumps.", parse);
	Text.NL();
	
	if(world.time.hour >= 7 && world.time.hour < 17)
		Text.Add("Aquilius’ assistants perform the daily grind of seeing to the needs of the injured and bedridden, while the surgeon himself tends to the ignoble task of seeing to those coming in claiming illness or injury.", parse);
	else
		Text.Add("While the surgeon has retired for the night, one of his assistants is still on duty, watching over the infirm by the light of a small, hooded lantern. It’s little wonder that being surgeon for the outlaws is a job that doesn’t guarantee regular rest hours.", parse);
	Text.NL();
	Text.Add("Taking a moment to savor the peace the infirmary affords, you consider what you ought to do next.", parse);
}

OutlawsLoc.Infirmary.onEntry = function() {
	if(aquilius.flags["Met"] == 0)
		Scenes.Aquilius.FirstMeeting();
	else
		PrintDefaultOptions();
}

OutlawsLoc.Infirmary.links.push(new Link(
	"Outside", true, true,
	null,
	function() {
		MoveToLocation(OutlawsLoc.Camp, {minute: 5});
	}
));

OutlawsLoc.Infirmary.events.push(new Link(
	"Aquilius", function() {
		return aquilius.IsAtLocation();
	}, true,
	null,
	function() {
		Scenes.Aquilius.Approach();
	}
));

export { OutlawsLoc };
