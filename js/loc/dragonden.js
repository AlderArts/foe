/*
 * 
 * Dragon den area, closed off for now
 * 
 */

// Create namespace
world.loc.DragonDen = {
	Entry         : new Event("Den entrance")
}

//
// Den entrance
//
world.loc.DragonDen.Entry.description = function() {
	Text.AddOutput("The ground around you is slowly turning barren as you trudge closer to the low hills. In the middle of a large cliffside, an ominous crevice snakes into the darkness. The whole area reeks of sulfur, smoke and dead things. The ground outside the entrance is littered with white bones, the flesh gnawed clean off them.<br/>");
}

world.loc.DragonDen.Entry.links.push(new Link(
	"Hills", true, true,
	function() {
		Text.AddOutput("Behind you is the way back to the hills.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Highlands.Hills, {minute: 15});
	}
));

world.loc.DragonDen.Entry.endDescription = function() {
	Text.AddOutput("This is likely a very bad place to be, you should leave for now.<br/>");
}

world.loc.DragonDen.Entry.enc = new EncounterTable();

// FUCK YOU ENCOUNTER
world.loc.DragonDen.Entry.enc.AddEnc(function() {
 	var enemy    = new Party();
	enemy.AddMember(new Drake());
	var enc      = new Encounter(enemy);
	
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}, 1.0);



world.loc.DragonDen.Entry.enc.AddEnc(function() {
 	var enemy = new Party();
	enemy.AddMember(new AlphaDemon());
	enemy.AddMember(new Imp());
	enemy.AddMember(new Imp());
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
