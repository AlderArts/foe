/*
 * 
 * Forest
 * 
 */

// Create namespace
world.loc.Forest = {
	Outskirts         : new Event("Forest outskirts"),
	Glade             : new Event("Dryads' glade")
}

//
// Forest
//

world.loc.Forest.Outskirts.description = function() {
	Text.AddOutput("You are at the outskirts of a deep forest. With trees and stuff.<br/>");
}

world.loc.Forest.Outskirts.enc = new EncounterTable();
world.loc.Forest.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.Add("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up a particularly fresh bundle of grass. Who knows, could be useful for something.");
		Text.NL();
		Text.Add(Text.BoldColor("You pick up some fresh grass."));
		Text.Flush();
		party.inventory.AddItem(Items.FreshGrass);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
world.loc.Forest.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.Add("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up a pretty flower. Who knows, could be useful for something.");
		Text.NL();
		Text.Add(Text.BoldColor("You pick up a Foxglove."));
		Text.Flush();
		party.inventory.AddItem(Items.Foxglove);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
world.loc.Forest.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.Add("As you trek through the undergrowth of the deep forest, you come across a cluster of small bushes with red berries. Seeing as nothing is trying to kill you at the moment, you spend some time gathering them, figuring they could be of some use.");
		Text.NL();
		Text.Add(Text.BoldColor("<b>You pick some fox berries.</b>"));
		Text.Flush();
		party.inventory.AddItem(Items.FoxBerries);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
world.loc.Forest.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.Add("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up an odd root. Who knows, could be useful for something.");
		Text.NL();
		Text.Add(Text.BoldColor("You pick up a Canis root."));
		Text.Flush();
		party.inventory.AddItem(Items.CanisRoot);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });

// Temp mothgirl enemy
world.loc.Forest.Outskirts.enc.AddEnc(function() {
 	var enemy = new Party();
	enemy.AddMember(new Mothgirl());
	var enc = new Encounter(enemy);
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}, 1.0);

world.loc.Forest.Outskirts.enc.AddEnc(function() {
 	var enemy = new Party();
	enemy.AddMember(new FeralWolf(Gender.male));
	var enc = new Encounter(enemy);
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}, 1.0);

world.loc.Forest.Outskirts.enc.AddEnc(function() {
	return Scenes.Momo.MomoEnc;
}, 1.0, function() { return momo.Wandering(); });


world.loc.Forest.Outskirts.enc.AddEnc(function() {
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


world.loc.Forest.Outskirts.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.AddOutput("Behind you is the way back to the crossroads.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));
world.loc.Forest.Outskirts.links.push(new Link(
	"Glade", function() { return jeanne.flags["Met"] >= 1; }, true,
	null,
	function() {
		MoveToLocation(world.loc.Forest.Glade, {minute: 15});
	}
));

world.loc.Forest.Outskirts.endDescription = function() {
	Text.AddOutput("What do you do?<br/>");
}
