
import { Event, Link } from '../event';
import { Maze } from '../maze';
import { GetDEBUG } from '../../app';
import { Halloween } from '../event/halloween';

//
// Nomads
//
let world = null;

let Nomads = {
	Tent       : new Event("Tent"), // Start area
	Fireplace  : new Event("Nomads: Fireplace"),
	Nursery    : new Event("Nomads: Nursery")
};

world.SaveSpots["NomadsTent"] = Nomads.Tent;
Nomads.Tent.SaveSpot = "NomadsTent";
Nomads.Tent.safe = function() { return true; };
Nomads.Tent.description = function() {
	var light;
	if     (world.time.hour >= 6 && world.time.hour < 19) light = "sunlight";
	else if(world.time.hour >= 19 || world.time.hour < 2) light = "firelight";
	else light = "moonlight";
	
	Text.Add("The interior of the tent is dim, with little of the [light] reaching inside. Various pots, pans and other cooking utensils are packed away in an open wooden chest, should you want to prepare some food. There is little actual furniture besides that; a few rugs rolled out to protect bare feet and a set of bed rolls are free for you to use.", {light: light});
	Text.NL();
}

Nomads.Tent.links.push(new Link(
	"Outside", true, true,
	function() {
		var light;
		if     (world.time.hour >= 6 && world.time.hour < 19) light = "sunlight";
		else if(world.time.hour >= 19 || world.time.hour < 2) light = "firelight";
		else light = "moonlight";
		
		Text.Add("Outside, the [light] illuminates several other tents that are similar to the one you are in now. ", {light: light});
	},
	function() {
		MoveToLocation(Nomads.Fireplace, {minute: 5});
	}
));


//TODO TEST --------------
Scenes.MazeTest = new Maze();
Scenes.MazeTest.AddRoom(3,3);
Scenes.MazeTest.AddRoom(3,4);
Scenes.MazeTest.AddRoom(3,5);
Scenes.MazeTest.AddRoom(2,5);
Scenes.MazeTest.AddRoom(4,5);
Scenes.MazeTest.AddRoom(5,5);
Scenes.MazeTest.GetRoom(5,5).description = function() {
	var parse = {};
	
	Text.Add("Sample desc", parse);
	Text.NL();
}
Scenes.MazeTest.GetRoom(5,5).events.push(new Link(
	"Escape", true, true,
	function() {
		Text.Add("Here's the exit.");
	},
	function() {
		MoveToLocation(Nomads.Tent);
	}
));
Scenes.MazeTest.AddRoom(1,1);

//TODO TEST
Nomads.Tent.links.push(new Link(
	"Maze", function() { return GetDEBUG(); }, true,
	null,
	function() {
		MoveToLocation(Scenes.MazeTest.GetRoom(3,3));
	}
));
//TODO /TEST --------------


//Trigger this on stepping into the Nomads’ for the first time when season is active.
Nomads.Fireplace.onEntry = function() {
	if(!(gameCache.flags["HW"] & Halloween.State.Intro) &&
		(GetDEBUG() || Halloween.IsSeason()) &&
		(world.time.hour >= 8) &&
		(world.time.hour < 22))
		Scenes.Halloween.PieIntro();
	else
		PrintDefaultOptions();
}

Nomads.Fireplace.description = function() {
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
Nomads.Fireplace.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.Add("A faint trail leads out across the plains toward a low outcropping where several larger paths cross. ");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));
Nomads.Fireplace.links.push(new Link(
	"Tent", true, true,
	function() {
		Text.Add("Your own tent is nearby, should you need rest.");
		Text.NL();
	},
	function() {
		MoveToLocation(Nomads.Tent, {minute: 5});
	}
));
Nomads.Fireplace.links.push(new Link(
	"Nursery", function() {
		if(Scenes.Global.PortalsOpen()) return false;
		return nursery.TotalKids() > 0;
	}, true,
	function() {
		if(Scenes.Global.PortalsOpen()) return;
		if(nursery.TotalKids() > 0) {
			Text.Add("The nursery, where your kids are being taken care of, is nearby.");
			Text.NL();
		}
	},
	function() {
		Scenes.Nursery.Nomads();
	}
));

Nomads.Fireplace.events.push(new Link(
	"Chief", function() { return (world.time.hour >= 8 && world.time.hour < 22); }, true,
	function() {
		if(!(world.time.hour >= 8 && world.time.hour < 22)) return;
		Scenes.Chief.Desc();
	},
	Scenes.Chief.Interact
));
Nomads.Fireplace.events.push(new Link(
	function() { return cale.name; }, 
	function() { return cale.IsAtLocation(Nomads.Fireplace); }, true,
	function() {
		if(cale.IsAtLocation(Nomads.Fireplace))
			Scenes.Cale.Desc();
	},
	Scenes.Cale.Interact
));
Nomads.Fireplace.events.push(new Link(
	function() { return (estevan.flags["Met"] == 0) ? "Satyr" : "Estevan"; }, function() { return estevan.IsAtLocation(); }, true,
	function() {
		if(estevan.IsAtLocation())
			Scenes.Estevan.Desc();
	},
	Scenes.Estevan.Interact
));
Nomads.Fireplace.events.push(new Link(
	function() {
		return magnus.flags["Met"] == 0 ? "Scholar" : "Magnus";
	}, function() { return (world.time.hour >= 8 && world.time.hour < 22); }, true,
	function() {
		if(!(world.time.hour >= 8 && world.time.hour < 22)) return;
		Scenes.Magnus.Desc();
	},
	Scenes.Magnus.Interact
));
Nomads.Fireplace.events.push(new Link(
	function() { return rosalin.flags["Met"] == 0 ? "Alchemist" : "Rosalin"; },
	function() { return rosalin.IsAtLocation(Nomads.Fireplace); }, true,
	function() {
		if(!rosalin.IsAtLocation(Nomads.Fireplace)) return;
		Scenes.Rosalin.Desc();
	},
	Scenes.Rosalin.Interact
	/*,
	function() { return rosalin.flags["Met"] == 0 ? "Approach the catgirl alchemist." : "Talk with Rosalin the alchemist."; } */
));
Nomads.Fireplace.events.push(new Link(
	"Patchwork", function() { return (world.time.hour >= 8 && world.time.hour < 24); }, true,
	function() {
		if(!(world.time.hour >= 8 && world.time.hour < 24)) return;
		Scenes.Patchwork.Desc();
	},
	Scenes.Patchwork.Interact
));

Nomads.Fireplace.events.push(new Link(
	"Momo", 
	function() { return momo.IsAtLocation(Nomads.Fireplace); }, true,
	function() {
		if(momo.AtCamp()) {
			Text.Add("A rather tatty tent has been set up close by the central cookfires for Momo, the dragon-girl.");
			if(!momo.IsAtLocation())
				Text.Add(" The tent's flaps are closed, its owner having retired for the night.");
			Text.NL();
		}
	},
	Scenes.Momo.Interact
));
//#add “pie” option to nomads’ camp from 17-22 pm when Halloween season/debug is active.
Nomads.Fireplace.events.push(new Link(
	"Pumpkin Pie", function() {
		if(!(gameCache.flags["HW"] & Halloween.State.Intro)) return false;
		// Correct time of day
		if((world.time.hour < 17) || (world.time.hour >= 22)) return false;
		
		return Halloween.IsSeason();
	}, true,
	null,
	function() {
		Scenes.Halloween.PumpkinPie();
	}
));

Nomads.Fireplace.switchSpot = function() {
	return !Scenes.Global.PortalsOpen();
}

export { Nomads };
