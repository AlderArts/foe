
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
import { GameCache, WorldTime, MoveToLocation, WORLD, GAME } from '../GAME';
import { Text } from '../text';
import { Gui } from '../gui';
import { NCavalcadeScenes } from '../event/nomads/cavalcade';
import { EstevanFlags } from '../event/nomads/estevan-flags';

//
// Nomads
//
export function InitNomads() {
	WORLD().SaveSpots["NomadsTent"] = NomadsLoc.Tent;
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
	if     (WorldTime().hour >= 6 && WorldTime().hour < 19) light = "sunlight";
	else if(WorldTime().hour >= 19 || WorldTime().hour < 2) light = "firelight";
	else light = "moonlight";
	
	Text.Add("The interior of the tent is dim, with little of the [light] reaching inside. Various pots, pans and other cooking utensils are packed away in an open wooden chest, should you want to prepare some food. There is little actual furniture besides that; a few rugs rolled out to protect bare feet and a set of bed rolls are free for you to use.", {light: light});
	Text.NL();
}

NomadsLoc.Tent.links.push(new Link(
	"Outside", true, true,
	function() {
		var light;
		if     (WorldTime().hour >= 6 && WorldTime().hour < 19) light = "sunlight";
		else if(WorldTime().hour >= 19 || WorldTime().hour < 2) light = "firelight";
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
	var parse : any = {};
	
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
	if(!(GameCache().flags["HW"] & Halloween.State.Intro) &&
		(GetDEBUG() || Halloween.IsSeason()) &&
		(WorldTime().hour >= 8) &&
		(WorldTime().hour < 22))
		HalloweenScenes.PieIntro();
	else
		Gui.PrintDefaultOptions();
}

NomadsLoc.Fireplace.description = function() {
	Text.Add("The nomad camp is currently set up in the middle of a wide grassland spreading out in all directions. [TreeFar] In the middle of the gathering of disparate tents that make up the nomad camp - about twenty in total - is a large fire pit.", {TreeFar: WORLD().TreeFarDesc()});
	Text.NL();
	if(WorldTime().hour >= 7 && WorldTime().hour < 19)
		Text.Add("Currently it is unlit. Not many people are around, most likely seeing to their daily chores.");
	else if(WorldTime().hour >= 19 || WorldTime().hour < 2)
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
		MoveToLocation(WORLD().loc.Plains.Crossroads, {minute: 15});
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
		return GAME().nursery.TotalKids() > 0;
	}, true,
	function() {
		if(GlobalScenes.PortalsOpen()) return;
		if(GAME().nursery.TotalKids() > 0) {
			Text.Add("The nursery, where your kids are being taken care of, is nearby.");
			Text.NL();
		}
	},
	function() {
		NurseryScenes.Nomads();
	}
));
// TODO TEMP CAVALCADE
NomadsLoc.Fireplace.events.push(new Link(
	"Cavalcade", function() { return NCavalcadeScenes.Enabled(); }, function() { return GAME().party.coin >= NCavalcadeScenes.Bet(); },
	function() {
		let estevan = GAME().estevan;
		if(NCavalcadeScenes.Enabled()) {
			Text.Add("Both Rosalin, Cale and Estevan seem to be around. Perhaps they are up for a game of Cavalcade?");
			if(estevan.flags["Cheat"] == EstevanFlags.Cheat.Setup)
				Text.Add(" You remind yourself that you’ve rigged this coming game together with Estevan in order to play a prank on Cale.");
			Text.NL();
			Text.Flush();
		}
	},
	function() {
		let estevan = GAME().estevan;
		/* Old explanation
		Text.Add("PLACEHOLDER TEXT");
		Text.NL();
		Text.Add("You start up a game of Cavalcade with Rosalin and Wolfie.");
		Text.NL();
		Text.Add("The game works similarily to Texas Hold'Em, but with fewer cards.");
		Text.NL();
		Text.Add("There is a total of three suits: Light, Shadow and Darkness. Each suit contains five named cards numbered from 1 to 5. The <b>lower</b> the number, the <b>better</b> the card is. In other words, there is a total of 15 cards to a deck.");
		Text.NL();
		Text.Add("There are three players to a game. Each player gets two cards, and the house gets three cards, placed down face. Each round of betting, the house reveals another card. The person with the best hand of five cards win. Each round of betting, you may call, raise the bet or fold your hand.");
		Text.NL();
		Text.Add("The hands, in increasing order of value, are as follows: pair, two pairs, three of a kind, mixed Cavalcade (the cards 1 through 5, different suits), full house, partial flush (four cards of the same suit), four of a kind (requires the joker), and full Cavalcade (the cards 1 through 5 of a single suit).");
		Text.NL();
		Text.Add("4 of Shadow, the Shadow Stag, is considered a joker, and can become anything to improve your hand. If the house draws the Stag, the card is discarded and a new one is drawn from the deck, to prevent draws.");
		Text.NL();
		Text.Add("The game is currently very new, so no one plays it very well yet, and you may find your opponents kind of dull-witted.");
		Text.NL();
		Text.Add("The game can currently be abused for cash, since debug mode allows you to see the down-face cards as well.");
		Text.NL();
		Text.Add("END PLACEHOLDER TEXT");
		Text.NL();

		var players = [player, rosalin, cale];
		var g = new Cavalcade(players, {bet: 5});
		g.PrepGame();
		*/

		Text.Clear();
		Text.Add("You round up the mismatched trio and ask them if they are up for a game of Cavalcade.");
		Text.NL();
		if(estevan.flags["Cheat"] == EstevanFlags.Cheat.Setup)
			NCavalcadeScenes.CheatGame();
		else
			NCavalcadeScenes.RegularGame();
	}
));


NomadsLoc.Fireplace.events.push(new Link(
	"Chief", function() { return (WorldTime().hour >= 8 && WorldTime().hour < 22); }, true,
	function() {
		if(!(WorldTime().hour >= 8 && WorldTime().hour < 22)) return;
		ChiefScenes.Desc();
	},
	ChiefScenes.Interact
));
NomadsLoc.Fireplace.events.push(new Link(
	function() { return GAME().cale.name; }, 
	function() { return GAME().cale.IsAtLocation(NomadsLoc.Fireplace); }, true,
	function() {
		if(GAME().cale.IsAtLocation(NomadsLoc.Fireplace))
			CaleScenes.Desc();
	},
	CaleScenes.Interact
));
NomadsLoc.Fireplace.events.push(new Link(
	function() { return (GAME().estevan.flags["Met"] == 0) ? "Satyr" : "Estevan"; }, function() { return GAME().estevan.IsAtLocation(); }, true,
	function() {
		if(GAME().estevan.IsAtLocation())
			EstevanScenes.Desc();
	},
	EstevanScenes.Interact
));
NomadsLoc.Fireplace.events.push(new Link(
	function() {
		return GAME().magnus.flags["Met"] == 0 ? "Scholar" : "Magnus";
	}, function() { return (WorldTime().hour >= 8 && WorldTime().hour < 22); }, true,
	function() {
		if(!(WorldTime().hour >= 8 && WorldTime().hour < 22)) return;
		MagnusScenes.Desc();
	},
	MagnusScenes.Interact
));
NomadsLoc.Fireplace.events.push(new Link(
	function() { return GAME().rosalin.flags["Met"] == 0 ? "Alchemist" : "Rosalin"; },
	function() { return GAME().rosalin.IsAtLocation(NomadsLoc.Fireplace); }, true,
	function() {
		if(!GAME().rosalin.IsAtLocation(NomadsLoc.Fireplace)) return;
		RosalinScenes.Desc();
	},
	RosalinScenes.Interact
	/*,
	function() { return rosalin.flags["Met"] == 0 ? "Approach the catgirl alchemist." : "Talk with Rosalin the alchemist."; } */
));
NomadsLoc.Fireplace.events.push(new Link(
	"Patchwork", function() { return (WorldTime().hour >= 8 && WorldTime().hour < 24); }, true,
	function() {
		if(!(WorldTime().hour >= 8 && WorldTime().hour < 24)) return;
		PatchworkScenes.Desc();
	},
	PatchworkScenes.Interact
));

NomadsLoc.Fireplace.events.push(new Link(
	"Momo", 
	function() { return GAME().momo.IsAtLocation(NomadsLoc.Fireplace); }, true,
	function() {
		let momo = GAME().momo;
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
		if(!(GameCache().flags["HW"] & Halloween.State.Intro)) return false;
		// Correct time of day
		if((WorldTime().hour < 17) || (WorldTime().hour >= 22)) return false;
		
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
