import * as _ from 'lodash';

import { Gui } from "./gui";
import { Images } from "./assets";
import { GameState, SetGameState } from "./gamestate";
import { GAME, TimeStep, WORLD, StepToHour } from "./GAME";
import { Text } from "./text";
import { DreamsScenes } from './event/dreams';
import { EncounterTable } from './encountertable';

/*
 *
 * Event/Location. Is used as a template to set up
 * locations or events that can be navigated.
 *
 * When used as a location, "links" can be used for exploration and "events" for people
 *
 */

export class Event {
	nameFunc : any;
	description : any;
	endDescription : any;
	links : Link[];
	events : Link[];
	hunt : any[];
	onEntry : any;
	enc : EncounterTable;
	SaveSpot : string;

	constructor(nameFunc : any, opts? : any) {
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
	
	AddEncounter(opts? : any) {
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

	wait() : boolean {
		return true;
	}
	safe() : boolean {
		return false;
	}
	switchSpot() : boolean {
		return false;
	}

	SleepFunc() {
		SetGameState(GameState.Event, Gui);
		Text.NL();
		Text.Add("You sleep for 8 hours.");
		Text.Flush();
		Gui.NextPrompt(function() {
			Text.Clear();
			var func = function() {
				TimeStep({hour: 8});
				GAME().party.Sleep();

				Gui.PrintDefaultOptions();
			}

			DreamsScenes.Entry(func);
		});
	}

	WaitFunc = function() {
		SetGameState(GameState.Event, Gui);
		Text.Clear();
		Text.Add("How long do you want to wait?");
		Text.Flush();

		var options = new Array();
		options.push({ nameStr : "Half hour",
			tooltip : "Wait for half an hour.",
			func : function() {
				TimeStep({minute: 30});
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "One hour",
			tooltip : "Wait for one hour.",
			func : function() {
				TimeStep({hour: 1});
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Two hours",
			tooltip : "Wait for two hours.",
			func : function() {
				TimeStep({hour: 2});
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Four hours",
			tooltip : "Wait for four hours.",
			func : function() {
				TimeStep({hour: 4});
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Eight hours",
			tooltip : "Wait for eight hours.",
			func : function() {
				TimeStep({hour: 8});
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "A day",
			tooltip : "Wait for a day.",
			func : function() {
				TimeStep({day: 1});
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Until 4:00",
			tooltip : "Wait until early morning.",
			func : function() {
				StepToHour(4);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Until 8:00",
			tooltip : "Wait until morning.",
			func : function() {
				StepToHour(8);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Until 12:00",
			tooltip : "Wait until midday.",
			func : function() {
				StepToHour(12);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Until 16:00",
			tooltip : "Wait until afternoon.",
			func : function() {
				StepToHour(16);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Until 20:00",
			tooltip : "Wait until evening.",
			func : function() {
				StepToHour(20);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Until 00:00",
			tooltip : "Wait until midnight.",
			func : function() {
				StepToHour(0);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, true, function() {
			Gui.PrintDefaultOptions();
		});
	}

	DrunkHandler = function() {
		var parse : any = {};
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

	SetButtons(links : any[]) {
		var list = [];

		if(!links) {
			links = [];
			_.each(this.links, function(link : any) {
				link.image = Images.imgButtonEnabled2;
				links.push(link);
			});
			_.each(this.events, function(evt) {
				links.push(evt);
			});
		}

		for(var i = 0; i < links.length; i++) {
			var link = links[i];

			var visible = _.isFunction(link.visibleCondition) ? link.visibleCondition() : link.visibleCondition;
			if(!visible) continue;
			var enabled = _.isFunction(link.enabledCondition) ? link.enabledCondition() : link.enabledCondition;
			var nameStr = _.isFunction(link.name) ? link.name() : link.name;

			list.push({nameStr: nameStr, func: link.func, enabled: enabled, tooltip: link.tooltip, image: link.image});
			//Input.buttons[i].Setup(nameStr, link.func, enabled);
		}
		//list.sort( function(a, b) { return a.nameStr > b.nameStr; } );

		Gui.SetButtonsFromList(list, null, null, GameState.Event);
	}

	// Shows
	PrintDesc() {
		if(this.description) {
			if(_.isFunction(this.description))
				this.description();
			else
				Text.Add(this.description);
		}

		for(var i = 0; i < this.links.length; i++) {
			var link = this.links[i];
			if(link.print) {
				if(_.isFunction(link.print))
					link.print();
				else
					Text.Add(link.print);
			}
		}

		for(var i = 0; i < this.events.length; i++) {
			var e = this.events[i];
			if(e.print) {
				if(_.isFunction(e.print))
					e.print();
				else
					Text.Add(e.print);
			}
		}

		if(this.endDescription) {
			if(_.isFunction(this.endDescription))
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

}

export class Link {
	name : any;
	visibleCondition : any;
	enabledCondition : any;
	print : any;
	func : CallableFunction;
	tooltip : any;

	constructor(name : any, visibleCondition : any, enabledCondition : any, print? : any, func? : CallableFunction, tooltip? : any) {
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
}
