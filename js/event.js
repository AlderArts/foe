
/*
 * 
 * Event/Location. Is used as a template to set up
 * locations or events that can be navigated.
 * 
 * When used as a location, "links" can be used for exploration and "events" for people
 *
 */

var Scenes = {};

function Event(nameFunc) {
	// Returns the name of the location/event
	this.nameFunc = nameFunc;
	// A function describing the event (alternatively unconditional strings)
	this.description = null;
	this.endDescription = null;
	// When at the location, these possible exploration options are available
	this.links = new Array();
	// When at the location, these persons/events are available
	this.events = new Array();
	//
	this.onEntry = PrintDefaultOptions;
	// Encounter table
	this.enc = null;
}

Event.prototype.safe = function() {
	return false;
}
Event.prototype.switchSpot = function() {
	return false;
}

MoveToLocation = function(location, timestep) {
	party.location = location;

	// Step time
	timestep = timestep || new Time();
	world.TimeStep(timestep);
	
	location.onEntry();
}

Event.prototype.SleepFunc = function() {
	SetGameState(GameState.Event);
	Text.Newline();
	Text.AddOutput("You sleep for 8 hours.");
	Gui.NextPrompt(function() {
		Text.Clear();
		var func = function() {
			world.TimeStep({hour: 8});
			party.Sleep();
			
			PrintDefaultOptions();
		}
		
		Scenes.Dreams.Entry(func);
	});
}

Event.prototype.WaitFunc = function() {
	SetGameState(GameState.Event);
	Text.Newline();
	Text.AddOutput("You wait for 1 hour.");
	Gui.NextPrompt(function() {
		world.TimeStep({hour: 1});
		PrintDefaultOptions();
	});
}

Event.prototype.DrunkHandler = function() {
	var parse = {};
	var comp = party.GetRandom();
	Text.Clear();
	if(comp) {
		parse["name"]  = comp.name;
		parse["HeShe"] = comp.HeShe();
		parse["heshe"] = comp.heshe();
		Text.Add("With some effort, you open your eyes and find a concerned [name] standing above you. [HeShe] helps you to your feet, but you flinch as [heshe] starts to speak, as a splitting pain thunders through your head. As you draw in a sharp breath, you notice that something smells of vomit, although thankfully you look clean.", parse);
	}
	else {
		Text.Add("With some effort you open your eyes and drag yourself to your feet. You really don’t feel so good. Your head feels like it’s about to split open, and something smells of vomit.", parse);
	}
	Text.NL();
	Text.Add("Some of the decisions that led you to this state were probably not the best. Still, there’s a dark whisper in your mind asking if perhaps you’d feel better if you had just one more drink...", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}

Event.prototype.SetButtons = function(links) {
	var list = new Array();
	
	for(var i = 0; i < links.length; i++) {
		var link = links[i];
		
		var visible = isFunction(link.visibleCondition) ? link.visibleCondition() : link.visibleCondition;
		if(!visible) continue;
		var enabled = isFunction(link.enabledCondition) ? link.enabledCondition() : link.enabledCondition;
		var nameStr = isFunction(link.name) ? link.name() : link.name;
		
		list.push({nameStr: nameStr, func: link.func, enabled: enabled, tooltip: link.tooltip, image: link.image});
		//Input.buttons[i].Setup(nameStr, link.func, enabled);
	}
	//list.sort( function(a, b) { return a.nameStr > b.nameStr; } );
	
	Gui.SetButtonsFromList(list, null, null, GameState.Event);
}

// Shows 
Event.prototype.PrintDesc = function() {
	if(this.description) {
		if(isFunction(this.description))
			this.description();
		else
			Text.AddOutput(this.description);
	}
	
	for(var i = 0; i < this.links.length; i++) {
		var link = this.links[i];
		if(link.print) {
			if(isFunction(link.print))
				link.print();
			else
				Text.AddOutput(link.print);
		}
	}
	
	for(var i = 0; i < this.events.length; i++) {
		var e = this.events[i];
		if(e.print) {
			if(isFunction(e.print))
				e.print();
			else
				Text.AddOutput(e.print);
		}
	}
	
	if(this.endDescription) {
		if(isFunction(this.endDescription))
			this.endDescription();
		else
			Text.AddOutput(this.endDescription);
	}
	
	// At safe locations you can sleep and save
	if(party.location.safe()) {
		Text.Newline();
		Text.AddOutput("<b>This is a safe location, you can sleep and save here.</b>");
		Text.Newline();
	}
}

function Link(name, visibleCondition, enabledCondition, print, func, tooltip) {
	// String or function that returns string
	this.name = name;
	// This can be set to true, or to a function
	// Both enabled and visible must be true for the option to be shown and active
	this.visibleCondition = visibleCondition;
	this.enabledCondition = enabledCondition;
	// This is called when the location is printed (can be an unconditional string)
	this.print = print;
	// This function is called when the player choses the option
	this.func = func;
	this.tooltip = tooltip;
}

// Encounter table for combat
function EncounterTable() {
	// encounter { func, odds }
	// Random encounters
	this.encounters = new Array();
	// TODO: Hunting
	this.hunt = new Array();
}

/*
 Example code for adding encounters:
  
 encs.AddEnc(function() {
 	var enemy = new Party();
	enemy.AddMember(new IntroDemon());
	enemy.AddMember(new Imp());
	enemy.AddMember(new Imp());
	var enc = new Encounter(enemy);
	
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	
	return enc;
 }, 1.0);
 
 */

// Setup phase
EncounterTable.prototype.AddEnc = function(Func, Odds, Cond, Obj) {
	this.encounters.push({func: Func, odds: Odds || 1.0, cond: Cond || true, obj: Obj});
}

EncounterTable.prototype.Num = function() {
	return this.encounters.length;
}

// Get a fight
EncounterTable.prototype.Get = function() {
	var scenes = [];
	
	// Calculate total scale of odds
	var sum = 0;
	for(var i = 0; i < this.encounters.length; i++) {
		var e = this.encounters[i];
		var canFind = e.cond;
		if(canFind) {
			if(isFunction(canFind)) canFind = canFind();
			if(canFind) {
				var odds = e.odds;
				if(isFunction(odds)) odds = odds(); 
				scenes.push({func: e.func, odds: odds, obj: e.obj});
				sum += odds;
			}
		}
	}
	
	// Pick an encounter
	var step = Math.random() * sum;
	
	for(var i = 0; i < scenes.length; i++) {
		var enc = scenes[i];
		step -= enc.odds;
		// If chosen, create an encounter from the supplied function
		if(step <= 0.0)
			return enc.func ? enc.func(enc.obj) : null;
	}
	// No encounters will default to null
	return null;
}
