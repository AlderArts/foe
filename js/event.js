
import { Gui } from "./gui";
import { Images } from "./assets";
import { isFunction } from "./utility";
import { GameState, SetGameState } from "./gamestate";
import { GAME } from "./GAME";

/*
 *
 * Event/Location. Is used as a template to set up
 * locations or events that can be navigated.
 *
 * When used as a location, "links" can be used for exploration and "events" for people
 *
 */

function Event(nameFunc, opts) {
	opts = opts || {};
	// Returns the name of the location/event
	this.nameFunc = nameFunc;
	// A function describing the event (alternatively unconditional strings)
	this.description = opts.description;
	this.endDescription = opts.endDescription;
	// When at the location, these possible exploration options are available
	this.links = opts.links || [];
	// When at the location, these persons/events are available
	this.events = opts.events || [];
	// When at the location, you can try hunting for these enemies
	this.hunt = opts.hunt || [];
	// Function footprint: function(unused, oldLocation)
	this.onEntry = opts.onEntry || Gui.PrintDefaultOptions;
	// Encounter table
	this.enc = opts.enc || null;
}

Event.prototype.AddEncounter = function(opts) {
	opts = opts || {};
	var nameStr = opts.nameStr || "";
	var desc    = opts.desc;
	var func    = opts.func;
	var cond    = opts.cond;
	var visible = opts.visible;
	var enabled = opts.enabled;
	var odds    = opts.odds;
	var obj     = opts.obj;

	if(opts.enc)
		this.enc.AddEnc(func, odds, cond, obj);
	if(opts.hunt) {
		this.hunt.push(new Link(
			nameStr, visible, enabled,
			desc,
			function() {
				var enc = func();
				if(enc) {
					if(enc.Start)
						enc.Start();
					else
						enc();
				}
			}
		));
	}
}

Event.prototype.wait = function() {
	return true;
}
Event.prototype.safe = function() {
	return false;
}
Event.prototype.switchSpot = function() {
	return false;
}

function MoveToLocation(location, timestep, preventClear) {
	var oldLocation = GAME().party.location;
	GAME().party.location = location;

	// Step time
	timestep = timestep || new Time();
	world.TimeStep(timestep);

	location.onEntry(preventClear, oldLocation);
}

Event.prototype.MoveTo = function(timestep, preventClear) {
	MoveToLocation(this, timestep, preventClear);
}

Event.prototype.SleepFunc = function() {
	SetGameState(GameState.Event, Gui);
	Text.NL();
	Text.Add("You sleep for 8 hours.");
	Text.Flush();
	Gui.NextPrompt(function() {
		Text.Clear();
		var func = function() {
			world.TimeStep({hour: 8});
			GAME().party.Sleep();

			Gui.PrintDefaultOptions();
		}

		Scenes.Dreams.Entry(func);
	});
}

Event.prototype.WaitFunc = function() {
	SetGameState(GameState.Event, Gui);
	Text.Clear();
	Text.Add("How long do you want to wait?");
	Text.Flush();

	var options = new Array();
	options.push({ nameStr : "Half hour",
		tooltip : "Wait for half an hour.",
		func : function() {
			world.TimeStep({minute: 30});
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "One hour",
		tooltip : "Wait for one hour.",
		func : function() {
			world.TimeStep({hour: 1});
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Two hours",
		tooltip : "Wait for two hours.",
		func : function() {
			world.TimeStep({hour: 2});
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Four hours",
		tooltip : "Wait for four hours.",
		func : function() {
			world.TimeStep({hour: 4});
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Eight hours",
		tooltip : "Wait for eight hours.",
		func : function() {
			world.TimeStep({hour: 8});
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "A day",
		tooltip : "Wait for a day.",
		func : function() {
			world.TimeStep({day: 1});
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Until 4:00",
		tooltip : "Wait until early morning.",
		func : function() {
			world.StepToHour(4);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Until 8:00",
		tooltip : "Wait until morning.",
		func : function() {
			world.StepToHour(8);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Until 12:00",
		tooltip : "Wait until midday.",
		func : function() {
			world.StepToHour(12);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Until 16:00",
		tooltip : "Wait until afternoon.",
		func : function() {
			world.StepToHour(16);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Until 20:00",
		tooltip : "Wait until evening.",
		func : function() {
			world.StepToHour(20);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Until 00:00",
		tooltip : "Wait until midnight.",
		func : function() {
			world.StepToHour(0);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, true, function() {
		Gui.PrintDefaultOptions();
	});
}

Event.prototype.DrunkHandler = function() {
	var parse = {};
	var comp = GAME().party.GetRandom();
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
	var list = [];

	if(!links) {
		links = [];
		_.each(this.links, function(link) {
			link.image = Images.imgButtonEnabled2;
			links.push(link);
		});
		_.each(this.events, function(evt) {
			links.push(evt);
		});
	}

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
			Text.Add(this.description);
	}

	for(var i = 0; i < this.links.length; i++) {
		var link = this.links[i];
		if(link.print) {
			if(isFunction(link.print))
				link.print();
			else
				Text.Add(link.print);
		}
	}

	for(var i = 0; i < this.events.length; i++) {
		var e = this.events[i];
		if(e.print) {
			if(isFunction(e.print))
				e.print();
			else
				Text.Add(e.print);
		}
	}

	if(this.endDescription) {
		if(isFunction(this.endDescription))
			this.endDescription();
		else
			Text.Add(this.endDescription);
	}

	// At safe locations you can sleep and save
	if(GAME().party.location.safe()) {
		Text.NL();
		Text.Add("<b>This is a safe location, you can sleep and save here.</b>");
		Text.NL();
	}
	Text.Flush();
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
	this.encounters = [];
	// TODO: Hunting
	this.hunt = [];
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
	this.encounters.push({func: Func, odds: Odds, cond: Cond, obj: Obj});
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
		if(canFind === undefined) canFind = true;
		if(canFind) {
			if(isFunction(canFind)) canFind = canFind();
			if(canFind) {
				var odds = e.odds;
				if(odds === undefined) odds = 1.0;
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

export { Event, EncounterTable, Link, MoveToLocation };
