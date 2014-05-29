/*
 * 
 * Lake
 * 
 */

// Create namespace
world.loc.Lake = {
	Outskirts         : new Event("Lake outskirts")
}

//
// Lake
//

world.loc.Lake.Outskirts.description = function() {
	Text.AddOutput("You are at the outskirts of a deep Lake.<br/>");
}

world.loc.Lake.Outskirts.enc = new EncounterTable();
world.loc.Lake.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.AddOutput("Not having much else to do, you wander the outskirts of the Lake for a few minutes.");
		Text.Newline();
		Text.AddOutput(Text.BoldColor("You pick up some fresh grass."));
		party.inventory.AddItem(Items.FreshGrass);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
world.loc.Lake.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.AddOutput("Not having much else to do, you wander the outskirts of the Lake for a few minutes..");
		Text.Newline();
		Text.AddOutput(Text.BoldColor("You pick up a Infernum."));
		party.inventory.AddItem(Items.Infernum);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });
world.loc.Lake.Outskirts.enc.AddEnc(function() {
	return function() {
		Text.Clear();

		Text.AddOutput("Not having much else to do, you wander the outskirts of the Lake for a few minutes.");
		Text.Newline();
		Text.AddOutput(Text.BoldColor("You pick up a Canis root."));
		party.inventory.AddItem(Items.CanisRoot);
		
		world.TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, function() { return world.time.season != Season.Winter; });

// Temp mothgirl enemy
world.loc.Lake.Outskirts.enc.AddEnc(function() {
 	var enemy = new Party();
	enemy.AddMember(new Mothgirl());
	var enc = new Encounter(enemy);
	/*
	enc.canRun = true;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}, 1.0);

// Temp nagagirl enemy
world.loc.Lake.Outskirts.enc.AddEnc(function() {
 	var enemy = new Party();
	enemy.AddMember(new Nagagirl());
	var enc = new Encounter(enemy);
	/*
	enc.canRun = true;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}, 1.0);

world.loc.Lake.Outskirts.enc.AddEnc(function() {
 	var enemy = new Party();
	enemy.AddMember(new FeralWolf(Gender.male));
	enemy.AddMember(new FeralWolf(Gender.female));
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


world.loc.Lake.Outskirts.enc.AddEnc(function() {
 	var enemy = new Party();
	enemy.AddMember(new Imp());
	enemy.AddMember(new Imp());
	enemy.AddMember(new Imp());

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




world.loc.Lake.Outskirts.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.AddOutput("Behind you is the way back to the crossroads.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));

world.loc.Lake.Outskirts.endDescription = function() {
	Text.AddOutput("What do you do?<br/>");
}
