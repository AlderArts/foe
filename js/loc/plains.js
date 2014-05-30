/*
 * 
 * Plains area that can be explored (starting area?)
 * 
 */

// Create namespace
world.loc.Plains = {
	Nomads         :
	{
		Tent       : new Event("Tent"), // Start area
		Fireplace  : new Event("Fireplace")
	},
	Crossroads     : new Event("Crossroads"),
	Gate           : new Event("Town gates"),
	Burrows        :
	{
		Enterance  : new Event("Burrows enterance"),
		Burrows    : new Event("Burrows"),
		Pit        : new Event("Mating pit")
	}
}


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
	
	Text.AddOutput("The interior of the tent is dim, with little of the [light] reaching inside. Various pots, pans and other cooking utensils are packed away in an open wooden chest, should you want to prepare some food. There is little actual furniture besides that; a few rugs rolled out to protect bared feet and a set of bed rolls are free for you to use.", {light: light});
	Text.Newline();
}

world.loc.Plains.Nomads.Tent.links.push(new Link(
	"Outside", true, true,
	function() {
		var light;
		if     (world.time.hour >= 6 && world.time.hour < 19) light = "sunlight";
		else if(world.time.hour >= 19 || world.time.hour < 2) light = "firelight";
		else light = "moonlight";
		
		Text.AddOutput("Outside, the [light] illuminates several other tents that are similar to the one you are in now. ", {light: light});
	},
	function() {
		MoveToLocation(world.loc.Plains.Nomads.Fireplace, {minute: 5});
	}
));
world.loc.Plains.Nomads.Tent.endDescription = function() {
	Text.AddOutput("You weigh your options.<br/>");
}

world.loc.Plains.Nomads.Fireplace.description = function() {
	Text.AddOutput("The nomad camp is currently set up in the middle of a wide grassland spreading out in all directions. [TreeFar] In the middle of the gathering of disparate tents that make up the nomad camp - about twenty in total - is a large fire pit.", {TreeFar: world.TreeFarDesc()});
	Text.Newline();
	if(world.time.hour >= 7 && world.time.hour < 19)
		Text.AddOutput("Currently it is unlit. Not many people are around, most likely seeing to their daily chores.");
	else if(world.time.hour >= 19 || world.time.hour < 2)
		Text.AddOutput("A roaring fire reaches toward the dark skies, sparks swirling around in the breeze. Most of the adult population in the camp has gathered by the fireplace for the night's festivities.");
	else
		Text.AddOutput("The smoldering ashes from last night's fire still glow faintly. Most of the camp is sleeping at the current hour.");
	Text.Newline();
}
world.loc.Plains.Nomads.Fireplace.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.AddOutput("A faint trail leads out across the plains toward a low outcropping where several larger paths cross. ");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));
world.loc.Plains.Nomads.Fireplace.links.push(new Link(
	"Tent", true, true,
	function() {
		Text.AddOutput("Your own tent is nearby, should you need rest.");
		Text.Newline();
	},
	function() {
		MoveToLocation(world.loc.Plains.Nomads.Tent, {minute: 5});
	}
));

// TODO TEMP CAVALCADE
world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	"Cavalcade", true, true,
	function() {
		Text.Add(Text.BoldColor("PLACEHOLDER: You can play Cavalcade (temporary test for a minigame, will be fleshed out later)."));
		Text.NL();
		Text.Flush();
	},
	function() {
		Text.Clear();
		
		Text.Add(Text.BoldColor("PLACEHOLDER TEXT"));
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
		Text.Add(Text.BoldColor("END PLACEHOLDER TEXT"));
		Text.NL();
		
		var players = [player, rosalin, wolfie];
		var g = new Cavalcade(players, {bet: 5});
		g.PrepGame();
	}
));

/*
// TODO TEMP CAVALCADE
world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	"Preggo", true, true,
	function() {
		Text.Add(Text.BoldColor("PLACEHOLDER: Get preggo!"));
		Text.NL();
		Text.Flush();
	},
	function() {
		Text.Clear();
		
		Text.Add(Text.BoldColor("PLACEHOLDER TEXT. Got preggo. Mother = Unknown"));
		Text.NL();
		Text.Flush();
		
		player.effects.push(new Effect(EffectFuncCodes.PregnancyRegular, {day: 1}, {mother: "unknown"}));
		Gui.NextPrompt();
	}
));
*/

world.loc.Plains.Nomads.Fireplace.endDescription = function() {
	Text.AddOutput("You weigh your options.<br/>");
}



//
// Crossroads
//
world.loc.Plains.Crossroads.description = function() {
	Text.AddOutput("You are at the crossroads.");
	Text.Newline();
}

world.loc.Plains.Crossroads.enc = new EncounterTable();

world.loc.Plains.Crossroads.enc.AddEnc(function() {
 	var enemy = new Party();
 	var r = Math.random();
 	if(r < 0.2) {
		enemy.AddMember(new Wildcat(Gender.herm));
		enemy.AddMember(new Wildcat(Gender.male));
		enemy.AddMember(new Wildcat(Gender.female));
	}
	else if(r < 0.4) {
		enemy.AddMember(new Wildcat(Gender.male));
		enemy.AddMember(new Wildcat(Gender.female));
		enemy.AddMember(new Wildcat(Gender.female));
		enemy.AddMember(new Wildcat(Gender.female));
	}
	else {
		enemy.AddMember(new Wildcat(Gender.Rand([3,4,1])));
		for(var i = 0; i < 3; i++) {
			if(Math.random() < 0.2)
				enemy.AddMember(new Wildcat(Gender.Rand([3,4,1])));
		}
	}
	var enc = new Encounter(enemy);
	
	enc.onEncounter = Scenes.Felines.Intro;
	enc.onVictory   = Scenes.Felines.WinPrompt;
	enc.onLoss      = Scenes.Felines.LossRegular;
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}, 1.0);

world.loc.Plains.Crossroads.links.push(new Link(
	"Nomads", true, true,
	function() {
		Text.AddOutput("Go to the nomad camp? ");
	},
	function() {
		MoveToLocation(world.loc.Plains.Nomads.Fireplace, {minute: 15});
	}
));

world.loc.Plains.Crossroads.links.push(new Link(
	"Rigard", true, true,
	function() {
		Text.AddOutput("There is a large city in the distance. ");
	},
	function() {
		MoveToLocation(world.loc.Plains.Gate, {minute: 25});
	}
));
world.loc.Plains.Crossroads.links.push(new Link(
	"Hills", true, true,
	function() {
		Text.AddOutput("A set of low hills rise in the distance. ");
	},
	function() {
		MoveToLocation(world.loc.Highlands.Hills, {minute: 15});
	}
));
world.loc.Plains.Crossroads.links.push(new Link(
	"Forest", true, true,
	function() {
		Text.AddOutput("The large forest is off in the distance. ");
	},
	function() {
		MoveToLocation(world.loc.Forest.Outskirts, {minute: 15});
	}
));
world.loc.Plains.Crossroads.links.push(new Link(
	"Desert", true, true,
	function() {
		Text.AddOutput("There is a desert. ");
	},
	function() {
		MoveToLocation(world.loc.Desert.Drylands, {minute: 15});
	}
));
world.loc.Plains.Crossroads.endDescription = function() {
	Text.AddOutput("You weigh your options.<br/>");
}

//
// Gate house
//

world.loc.Plains.Gate.onEntry = function() {
	if(miranda.flags["Met"] == 0)
		Scenes.Miranda.WelcomeToRigard();
	else
		PrintDefaultOptions();
}
world.loc.Plains.Gate.description = function() {
	Text.Add("You stand on a stone paved road leading up to Rigard.");
	Text.NL();
	
	if(miranda.IsAtLocation())
		Scenes.Miranda.RigardGatesDesc();
	else {
		Text.Add("There is a guard you don’t know stationed at the gates. They greet you, with a bored look on their face.");
		Text.NL();
	}
	
	// Town reaction if been there before
	
	// Town events
	
	Text.Add("There is a deep forest to the north, some of the trees creeping quite close to the walls. You spy a lake to the south.");
	Text.NL();
	Text.Flush();
}
world.loc.Plains.Gate.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.AddOutput("Go back to the crossroads? ");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));
world.loc.Plains.Gate.links.push(new Link(
	"Rigard", true, true,
	function() {
		Text.AddOutput("Enter the city? ");
	},
	function() {
		// TODO
		Text.Clear();
		if(miranda.IsAtLocation()) {
			Scenes.Miranda.RigardGatesEnter();
		}
		else {
			if(!rigard.GatesOpen()) {
				Text.Add("The guard explains to you that no-one enters or leaves the city during the night hours. You try to argue for a bit, but they are quite adamant. The open hours are between eight and five in the evening.");
				Text.NL();
			}
			else if(rigard.Visa()) {
				if(Math.random() < 0.1) {
					Text.Add("The guard holds you up for way longer than necessary, checking your papers and asking questions as to your purpose in the city. By the time you’re done, your head feels like mush from the continuous barrage of repetitive questioning. Finally, you are allowed inside the city.");
					world.TimeStep({hour:2});
				}
				else
					Text.Add("You show your visa to the guard, who nods and waves you through.");
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
				});
				return;
			}
			else {
				Text.Add("The guard explains that you need a pass to enter the city. When you confront them with how you are supposed to get one if the only way is to apply for one within the city, they just shrug.");
				Text.NL();
			}
			Text.Flush();
			PrintDefaultOptions(true);
		}
	}
));
world.loc.Plains.Gate.links.push(new Link(
	"Slums", true, true,
	function() {
		Text.AddOutput("Go to the slums outside the walls? ");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 15});
	}
));
world.loc.Plains.Gate.events.push(new Link(
	"Miranda", function() { return miranda.IsAtLocation(); }, true,
	null,
	function() {
		Scenes.Miranda.RigardGatesInteract();
	}
))
world.loc.Plains.Gate.endDescription = function() {
	Text.AddOutput("You weigh your options.<br/>");
}

