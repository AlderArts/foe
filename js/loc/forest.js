/*
 * 
 * Forest
 * 
 */

// Create namespace
world.loc.Forest = {
	Outskirts         : new Event("Forest outskirts")
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

		Text.AddOutput("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up a particularly fresh bundle of grass. Who knows, could be useful for something.");
		Text.Newline();
		Text.AddOutput(Text.BoldColor("You pick up some fresh grass."));
		party.inventory.AddItem(Items.FreshGrass);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
world.loc.Forest.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.AddOutput("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up a pretty flower. Who knows, could be useful for something.");
		Text.Newline();
		Text.AddOutput(Text.BoldColor("You pick up a Foxglove."));
		party.inventory.AddItem(Items.Foxglove);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
world.loc.Forest.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.AddOutput("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up an odd root. Who knows, could be useful for something.");
		Text.Newline();
		Text.AddOutput(Text.BoldColor("You pick up a Canis root."));
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

world.loc.Forest.Outskirts.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.AddOutput("Behind you is the way back to the crossroads.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));

world.loc.Forest.Outskirts.endDescription = function() {
	Text.AddOutput("What do you do?<br/>");
}
