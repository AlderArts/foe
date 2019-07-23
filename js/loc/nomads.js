
import { Event, Link } from '../event';
import { Maze } from '../maze';
import { GetDEBUG } from '../../app';
import { Halloween, HalloweenScenes } from '../event/halloween';
import { GlobalScenes } from '../event/global';
import { MomoScenes } from '../event/momo';
import { NurseryScenes } from '../event/nursery';
import { ChiefScenes } from '../event/nomads/chief';
import { CaleScenes } from '../event/nomads/cale-scenes';
import { EstevanScenes } from '../event/nomads/estevan';
import { MagnusScenes } from '../event/nomads/magnus';
import { RosalinScenes } from '../event/nomads/rosalin';
import { PatchworkScenes } from '../event/nomads/patchwork';

//
// Nomads
//
let world = null;

export function InitNomads(w) {
	world = w;
	world.SaveSpots["NomadsTent"] = NomadsLoc.Tent;
};

let NomadsLoc = {
	Tent       : new Event("Tent"), // Start area
	Fireplace  : new Event("Nomads: Fireplace"),
	Nursery    : new Event("Nomads: Nursery")
};

NomadsLoc.Tent.SaveSpot = "NomadsTent";
NomadsLoc.Tent.safe = function() { return true; };
NomadsLoc.Tent.description = function() {
	var light;
	if     (world.time.hour >= 6 && world.time.hour < 19) light = "sunlight";
	else if(world.time.hour >= 19 || world.time.hour < 2) light = "firelight";
	else light = "moonlight";
	
	Text.Add("The interior of the tent is dim, with little of the [light] reaching inside. Various pots, pans and other cooking utensils are packed away in an open wooden chest, should you want to prepare some food. There is little actual furniture besides that; a few rugs rolled out to protect bare feet and a set of bed rolls are free for you to use.", {light: light});
	Text.NL();
}

NomadsLoc.Tent.links.push(new Link(
	"Outside", true, true,
	function() {
		var light;
		if     (world.time.hour >= 6 && world.time.hour < 19) light = "sunlight";
		else if(world.time.hour >= 19 || world.time.hour < 2) light = "firelight";
		else light = "moonlight";
		
		Text.Add("Outside, the [light] illuminates several other tents that are similar to the one you are in now. ", {light: light});
	},
	function() {
		MoveToLocation(NomadsLoc.Fireplace, {minute: 5});
	}
));


//TODO TEST --------------
let MazeTest = new Maze();

MazeTest.AddRoom(3,3);
MazeTest.AddRoom(3,4);
MazeTest.AddRoom(3,5);
MazeTest.AddRoom(2,5);
MazeTest.AddRoom(4,5);
MazeTest.AddRoom(5,5);
MazeTest.GetRoom(5,5).description = function() {
	var parse = {};
	
	Text.Add("Sample desc", parse);
	Text.NL();
}
MazeTest.GetRoom(5,5).events.push(new Link(
	"Escape", true, true,
	function() {
		Text.Add("Here's the exit.");
	},
	function() {
		MoveToLocation(NomadsLoc.Tent);
	}
));
MazeTest.AddRoom(1,1);

//TODO TEST
NomadsLoc.Tent.links.push(new Link(
	"Maze", function() { return GetDEBUG(); }, true,
	null,
	function() {
		MoveToLocation(MazeTest.GetRoom(3,3));
	}
));
//TODO /TEST --------------


//Trigger this on stepping into the Nomads’ for the first time when season is active.
NomadsLoc.Fireplace.onEntry = function() {
	if(!(gameCache.flags["HW"] & Halloween.State.Intro) &&
		(GetDEBUG() || Halloween.IsSeason()) &&
		(world.time.hour >= 8) &&
		(world.time.hour < 22))
		HalloweenScenes.PieIntro();
	else
		PrintDefaultOptions();
}

NomadsLoc.Fireplace.description = function() {
	Text.Add("The nomad camp is currently set up in the middle of a wide grassland spreading out in all directions. [TreeFar] In the middle of the gathering of disparate tents that make up the nomad camp - about twenty in total - is a large fire pit.", {TreeFar: world.TreeFarDesc()});
	Text.NL();
	if(world.time.hour >= 7 && world.time.hour < 19)
		Text.Add("Currently it is unlit. Not many people are around, most likely seeing to their daily chores.");
	else if(world.time.hour >= 19 || world.time.hour < 2)
		Text.Add("A roaring fire reaches toward the dark skies, sparks swirling around in the breeze. Most of the adult population in the camp has gathered by the fireplace for the night's festivities.");
	else
		Text.Add("The smoldering ashes from last night's fire still glow faintly. Most of the camp is sleeping at the current hour.");
	Text.NL();
}
NomadsLoc.Fireplace.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.Add("A faint trail leads out across the plains toward a low outcropping where several larger paths cross. ");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));
NomadsLoc.Fireplace.links.push(new Link(
	"Tent", true, true,
	function() {
		Text.Add("Your own tent is nearby, should you need rest.");
		Text.NL();
	},
	function() {
		MoveToLocation(NomadsLoc.Tent, {minute: 5});
	}
));
NomadsLoc.Fireplace.links.push(new Link(
	"Nursery", function() {
		if(GlobalScenes.PortalsOpen()) return false;
		return nursery.TotalKids() > 0;
	}, true,
	function() {
		if(GlobalScenes.PortalsOpen()) return;
		if(nursery.TotalKids() > 0) {
			Text.Add("The nursery, where your kids are being taken care of, is nearby.");
			Text.NL();
		}
	},
	function() {
		NurseryScenes.Nomads();
	}
));

NomadsLoc.Fireplace.events.push(new Link(
	"Chief", function() { return (world.time.hour >= 8 && world.time.hour < 22); }, true,
	function() {
		if(!(world.time.hour >= 8 && world.time.hour < 22)) return;
		ChiefScenes.Desc();
	},
	ChiefScenes.Interact
));
NomadsLoc.Fireplace.events.push(new Link(
	function() { return cale.name; }, 
	function() { return cale.IsAtLocation(NomadsLoc.Fireplace); }, true,
	function() {
		if(cale.IsAtLocation(NomadsLoc.Fireplace))
			CaleScenes.Desc();
	},
	CaleScenes.Interact
));
NomadsLoc.Fireplace.events.push(new Link(
	function() { return (estevan.flags["Met"] == 0) ? "Satyr" : "Estevan"; }, function() { return estevan.IsAtLocation(); }, true,
	function() {
		if(estevan.IsAtLocation())
			EstevanScenes.Desc();
	},
	EstevanScenes.Interact
));
NomadsLoc.Fireplace.events.push(new Link(
	function() {
		return magnus.flags["Met"] == 0 ? "Scholar" : "Magnus";
	}, function() { return (world.time.hour >= 8 && world.time.hour < 22); }, true,
	function() {
		if(!(world.time.hour >= 8 && world.time.hour < 22)) return;
		MagnusScenes.Desc();
	},
	MagnusScenes.Interact
));
NomadsLoc.Fireplace.events.push(new Link(
	function() { return rosalin.flags["Met"] == 0 ? "Alchemist" : "Rosalin"; },
	function() { return rosalin.IsAtLocation(NomadsLoc.Fireplace); }, true,
	function() {
		if(!rosalin.IsAtLocation(NomadsLoc.Fireplace)) return;
		RosalinScenes.Desc();
	},
	RosalinScenes.Interact
	/*,
	function() { return rosalin.flags["Met"] == 0 ? "Approach the catgirl alchemist." : "Talk with Rosalin the alchemist."; } */
));
NomadsLoc.Fireplace.events.push(new Link(
	"Patchwork", function() { return (world.time.hour >= 8 && world.time.hour < 24); }, true,
	function() {
		if(!(world.time.hour >= 8 && world.time.hour < 24)) return;
		PatchworkScenes.Desc();
	},
	PatchworkScenes.Interact
));

NomadsLoc.Fireplace.events.push(new Link(
	"Momo", 
	function() { return momo.IsAtLocation(NomadsLoc.Fireplace); }, true,
	function() {
		if(momo.AtCamp()) {
			Text.Add("A rather tatty tent has been set up close by the central cookfires for Momo, the dragon-girl.");
			if(!momo.IsAtLocation())
				Text.Add(" The tent's flaps are closed, its owner having retired for the night.");
			Text.NL();
		}
	},
	MomoScenes.Interact
));
//#add “pie” option to nomads’ camp from 17-22 pm when Halloween season/debug is active.
NomadsLoc.Fireplace.events.push(new Link(
	"Pumpkin Pie", function() {
		if(!(gameCache.flags["HW"] & Halloween.State.Intro)) return false;
		// Correct time of day
		if((world.time.hour < 17) || (world.time.hour >= 22)) return false;
		
		return Halloween.IsSeason();
	}, true,
	null,
	function() {
		HalloweenScenes.PumpkinPie();
	}
));

NomadsLoc.Fireplace.switchSpot = function() {
	return !GlobalScenes.PortalsOpen();
}

export { NomadsLoc };
