/*
 * 
 * Forest
 * 
 */

import { world } from '../world';
import { Event, Link, EncounterTable, Scenes } from '../event';
import { GladeLoc } from './glade';

// Create namespace
let ForestLoc = {
	Outskirts         : new Event("Forest outskirts"),
	Glade             : GladeLoc,
}

//
// Forest
//

ForestLoc.Outskirts.description = function() {
	Text.Add("You are at the outskirts of a deep forest. With trees and stuff.<br>");
}

ForestLoc.Outskirts.enc = new EncounterTable();
ForestLoc.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.Add("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up a particularly fresh bundle of grass. Who knows, could be useful for something.");
		Text.NL();
		Text.Add("You pick up some fresh grass.", null, 'bold');
		Text.Flush();
		party.inventory.AddItem(Items.FreshGrass);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
ForestLoc.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.Add("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up a pretty flower. Who knows, could be useful for something.");
		Text.NL();
		Text.Add("You pick up a Foxglove.", null, 'bold');
		Text.Flush();
		party.inventory.AddItem(Items.Foxglove);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
ForestLoc.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.Add("As you trek through the undergrowth of the deep forest, you come across a cluster of small bushes with red berries. Seeing as nothing is trying to kill you at the moment, you spend some time gathering them, figuring they could be of some use.");
		Text.NL();
		Text.Add("You pick some fox berries.", null, 'bold');
		Text.Flush();
		party.inventory.AddItem(Items.FoxBerries);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
ForestLoc.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.Add("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up an odd root. Who knows, could be useful for something.");
		Text.NL();
		Text.Add("You pick up a Canis root.", null, 'bold');
		Text.Flush();
		party.inventory.AddItem(Items.CanisRoot);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
ForestLoc.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.Add("While wandering the forest, you come across a small spring filled with clear water. Figuring you might as well get some in case you grow thirsty, you pick out a vial from your pack.");
		Text.NL();
		Text.Add("You fill a vial with pure spring water.", null, 'bold');
		Text.Flush();
		party.inventory.AddItem(Items.SpringWater);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return true; });
ForestLoc.Outskirts.enc.AddEnc(function() {
	return function() {
		var parse = {
			
		};
		Text.Clear();
		Text.Add("Something catches your eye as you plod along through the undergrowth: a piece of particularly tough tree bark. It doesn’t seem to belong to any of the trees around you; someone or something must have brought it here. You give it a rap with your knuckle. The thing seems pretty resilient… maybe it has some alchemical properties?", parse);
		Text.NL();
		Text.Add("<b>Picked up some tree bark.</b>", parse);
		Text.Flush();
		
		party.inventory.AddItem(Items.TreeBark);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return true; });
ForestLoc.Outskirts.enc.AddEnc(function() {
	return function() {
		var parse = {
			
		};
		Text.Clear();
		Text.Add("As you walk through the forest, you find a small broken piece of a deer antler, perhaps left there in a clash between two battling studs. Well, they won’t be needing it anymore, and perhaps you can find some use for it...", parse);
		Text.NL();
		Text.Add("<b>Picked up part of a deer antler.</b>", parse);
		Text.Flush();
		
		party.inventory.AddItem(Items.AntlerChip);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return true; });
ForestLoc.Outskirts.enc.AddEnc(function() {
	return Scenes.Roaming.FlowerPetal;
}, 1.0, function() { return world.time.season != Season.Winter; });


// Temp mothgirl enemy
ForestLoc.Outskirts.AddEncounter({
	nameStr : "Mothgirl",
	func    : function() {
		return Scenes.Mothgirl.LoneEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true
});

ForestLoc.Outskirts.AddEncounter({
	nameStr : "Wolf",
	func    : function() {
		return Scenes.FeralWolf.LoneEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true
});

ForestLoc.Outskirts.enc.AddEnc(function() {
	return Scenes.Momo.MomoEnc;
}, 1.0, function() { return momo.Wandering(); });

ForestLoc.Outskirts.enc.AddEnc(function() {
	return Scenes.Roaming.FindSomeCoins;
}, 0.5, function() { return true; });

ForestLoc.Outskirts.enc.AddEnc(function() {
	return function() {
		var parse = {
			
		};
		
		Text.Clear();
		Text.Add("You find the remains of some large insect; an immense whitened husk, mostly deteriorated by the passage of time. From what you see, you wouldn’t want to meet a live one face to face. Though its lower body is a mess of chitin and a multitude of legs, the shriveled torso looks oddly human. You’d never mistake the face for that of a human, however.", parse);
		Text.NL();
		Text.Add("Shuddering, you pocket a small part of the chitin that still looks usable.", parse);
		Text.NL();
		Text.Add("<b>Received a Gol husk!</b>", parse);
		Text.Flush();
		
		party.Inv().AddItem(Items.Quest.GolHusk);
		
		if(party.Inv().QueryNum(Items.Quest.GolHusk) >= 3) {
			burrows.flags["HermTrait"] = Burrows.TraitFlags.Gathered;
			Text.NL();
			Text.Add("You think you've gathered enough of these for now, you should return them to Ophelia.", parse);
		}
		Text.Flush();
		
		world.TimeStep({minute: 15});
		
		Gui.NextPrompt();
	};
}, 4.0, function() { return burrows.Access() && burrows.flags["HermTrait"] == Burrows.TraitFlags.Inactive; });


ForestLoc.Outskirts.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.Add("Behind you is the way back to the crossroads.<br>");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {hour: 2});
	}
));
ForestLoc.Outskirts.links.push(new Link(
	"Outlaws", function() { return Scenes.Global.VisitedOutlaws(); }, true,
	null,
	function() {
		MoveToLocation(world.loc.Outlaws.Camp, {hour: 1});
	}
));
ForestLoc.Outskirts.links.push(new Link(
	"Glade", function() { return jeanne.flags["Met"] >= 1; }, true,
	null,
	function() {
		MoveToLocation(ForestLoc.Glade, {minute: 15});
	}
));

ForestLoc.Outskirts.events.push(new Link(
	"Herbs", function() { return aquilius.OnHerbsQuest() && !aquilius.OnHerbsQuestFinished(); }, true,
	null,
	function() {
		Scenes.Aquilius.PickHerbs();
	}
));
ForestLoc.Outskirts.events.push(new Link(
	"Nightshade", function() { return Scenes.Asche.Tasks.Nightshade.IsOn() && !Scenes.Asche.Tasks.Nightshade.IsSuccess(); }, true,
	null,
	function() {
		if(Scenes.Asche.Tasks.Nightshade.HasHelpFromAquilius())
			Scenes.Asche.Tasks.Nightshade.FollowAquilius();
		else
			Scenes.Asche.Tasks.Nightshade.BlindStart();
	}
));

export { ForestLoc };
