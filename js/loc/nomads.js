
import { world } from '../world';
import { Link, Scenes } from '../event';
import { Maze } from '../maze';
import { GetDEBUG } from '../../app';

//
// Nomads
//
world.SaveSpots["NomadsTent"] = world.loc.Plains.Nomads.Tent;
world.loc.Plains.Nomads.Tent.SaveSpot = "NomadsTent";
world.loc.Plains.Nomads.Tent.safe = function() { return true; };
world.loc.Plains.Nomads.Tent.description = function() {
	var light;
	if     (world.time.hour >= 6 && world.time.hour < 19) light = "sunlight";
	else if(world.time.hour >= 19 || world.time.hour < 2) light = "firelight";
	else light = "moonlight";
	
	Text.Add("The interior of the tent is dim, with little of the [light] reaching inside. Various pots, pans and other cooking utensils are packed away in an open wooden chest, should you want to prepare some food. There is little actual furniture besides that; a few rugs rolled out to protect bare feet and a set of bed rolls are free for you to use.", {light: light});
	Text.NL();
}

world.loc.Plains.Nomads.Tent.links.push(new Link(
	"Outside", true, true,
	function() {
		var light;
		if     (world.time.hour >= 6 && world.time.hour < 19) light = "sunlight";
		else if(world.time.hour >= 19 || world.time.hour < 2) light = "firelight";
		else light = "moonlight";
		
		Text.Add("Outside, the [light] illuminates several other tents that are similar to the one you are in now. ", {light: light});
	},
	function() {
		MoveToLocation(world.loc.Plains.Nomads.Fireplace, {minute: 5});
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
		MoveToLocation(world.loc.Plains.Nomads.Tent);
	}
));
Scenes.MazeTest.AddRoom(1,1);

//TODO TEST
world.loc.Plains.Nomads.Tent.links.push(new Link(
	"Maze", function() { return GetDEBUG(); }, true,
	null,
	function() {
		MoveToLocation(Scenes.MazeTest.GetRoom(3,3));
	}
));
//TODO /TEST --------------


//Trigger this on stepping into the Nomads’ for the first time when season is active.
world.loc.Plains.Nomads.Fireplace.onEntry = function() {
	if(!(gameCache.flags["HW"] & Halloween.State.Intro) &&
		(GetDEBUG() || Halloween.IsSeason()) &&
		(world.time.hour >= 8) &&
		(world.time.hour < 22))
		Scenes.Halloween.PieIntro();
	else
		PrintDefaultOptions();
}

world.loc.Plains.Nomads.Fireplace.description = function() {
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
world.loc.Plains.Nomads.Fireplace.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.Add("A faint trail leads out across the plains toward a low outcropping where several larger paths cross. ");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));
world.loc.Plains.Nomads.Fireplace.links.push(new Link(
	"Tent", true, true,
	function() {
		Text.Add("Your own tent is nearby, should you need rest.");
		Text.NL();
	},
	function() {
		MoveToLocation(world.loc.Plains.Nomads.Tent, {minute: 5});
	}
));
world.loc.Plains.Nomads.Fireplace.links.push(new Link(
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
world.loc.Plains.Nomads.Fireplace.switchSpot = function() {
	return !Scenes.Global.PortalsOpen();
}
