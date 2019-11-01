import * as _ from "lodash";

import { Images } from "./assets";
import { EncounterTable } from "./encountertable";
import { DreamsScenes } from "./event/dreams";
import { GAME, StepToHour, TimeStep } from "./GAME";
import { GameState, SetGameState } from "./gamestate";
import { Gui } from "./gui";
import { IChoice, Link } from "./link";
import { ILocation, ILocationEnc } from "./location";
import { IParse, Text } from "./text";

/*
 *
 * Event/Location. Is used as a template to set up
 * locations or events that can be navigated.
 *
 * When used as a location, "links" can be used for exploration and "events" for people
 *
 */

export class Event implements ILocation {
	public nameFunc: string|(() => string);
	public description: () => void;
	public endDescription: () => void;
	public links: Link[];
	public events: Link[];
	public hunt: Link[];
	public onEntry: () => void;
	public enc: EncounterTable;
	public SaveSpot: string;

	constructor(nameFunc: string|(() => string), opts?: any) {
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
		this.enc = opts.enc || undefined;
	}

	public AddEncounter(opts?: ILocationEnc) {
		opts = opts || {};
		const nameStr = opts.nameStr || "";
		const desc    = opts.desc;
		const func    = opts.func;
		const cond    = opts.cond;
		const visible = opts.visible;
		const enabled = opts.enabled;
		const odds    = opts.odds;
		const obj     = opts.obj;

		if (opts.enc) {
			this.enc.AddEnc(func, odds, cond, obj);
		}
		if (opts.hunt) {
			this.hunt.push(new Link(
				nameStr, visible, enabled,
				desc,
				() => {
					const enc = func(obj);
					if (enc) {
						if (enc.Start) {
							enc.Start();
						} else {
							enc();
						}
					}
				},
			));
		}
	}

	public wait(): boolean {
		return true;
	}
	public safe(): boolean {
		return false;
	}
	public switchSpot(): boolean {
		return false;
	}

	public SleepFunc() {
		SetGameState(GameState.Event, Gui);
		Text.NL();
		Text.Add("You sleep for 8 hours.");
		Text.Flush();
		Gui.NextPrompt(() => {
			Text.Clear();
			const func = () => {
				TimeStep({hour: 8});
				GAME().party.Sleep();

				Gui.PrintDefaultOptions();
			};

			DreamsScenes.Entry(func);
		});
	}

	public WaitFunc() {
		SetGameState(GameState.Event, Gui);
		Text.Clear();
		Text.Add("How long do you want to wait?");
		Text.Flush();

		const options: IChoice[] = [];
		options.push({ nameStr : "Half hour",
			tooltip : "Wait for half an hour.",
			func() {
				TimeStep({minute: 30});
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "One hour",
			tooltip : "Wait for one hour.",
			func() {
				TimeStep({hour: 1});
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Two hours",
			tooltip : "Wait for two hours.",
			func() {
				TimeStep({hour: 2});
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Four hours",
			tooltip : "Wait for four hours.",
			func() {
				TimeStep({hour: 4});
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Eight hours",
			tooltip : "Wait for eight hours.",
			func() {
				TimeStep({hour: 8});
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "A day",
			tooltip : "Wait for a day.",
			func() {
				TimeStep({day: 1});
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Until 4:00",
			tooltip : "Wait until early morning.",
			func() {
				StepToHour(4);
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Until 8:00",
			tooltip : "Wait until morning.",
			func() {
				StepToHour(8);
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Until 12:00",
			tooltip : "Wait until midday.",
			func() {
				StepToHour(12);
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Until 16:00",
			tooltip : "Wait until afternoon.",
			func() {
				StepToHour(16);
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Until 20:00",
			tooltip : "Wait until evening.",
			func() {
				StepToHour(20);
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Until 00:00",
			tooltip : "Wait until midnight.",
			func() {
				StepToHour(0);
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		Gui.SetButtonsFromList(options, true, () => {
			Gui.PrintDefaultOptions();
		});
	}

	public DrunkHandler() {
		const parse: IParse = {};
		const comp = GAME().party.GetRandom();
		Text.Clear();
		if (comp) {
			parse.name  = comp.name;
			parse.HeShe = comp.HeShe();
			parse.heshe = comp.heshe();
			Text.Add("With some effort, you open your eyes and find a concerned [name] standing above you. [HeShe] helps you to your feet, but you flinch as [heshe] starts to speak, as a splitting pain thunders through your head. As you draw in a sharp breath, you notice that something smells of vomit, although thankfully you look clean.", parse);
		} else {
			Text.Add("With some effort you open your eyes and drag yourself to your feet. You really don’t feel so good. Your head feels like it’s about to split open, and something smells of vomit.", parse);
		}
		Text.NL();
		Text.Add("Some of the decisions that led you to this state were probably not the best. Still, there’s a dark whisper in your mind asking if perhaps you’d feel better if you had just one more drink...", parse);
		Text.Flush();

		Gui.NextPrompt();
	}

	public SetButtons(links: Link[]) {
		const list: IChoice[] = [];

		if (!links) {
			links = [];
			_.each(this.links, (link) => {
				link.image = Images.imgButtonEnabled2;
				links.push(link);
			});
			_.each(this.events, (evt) => {
				links.push(evt);
			});
		}

		for (const link of links) {
			const visible = _.isFunction(link.visibleCondition) ? link.visibleCondition() : link.visibleCondition;
			if (!visible) { continue; }
			const enabled = _.isFunction(link.enabledCondition) ? link.enabledCondition() : link.enabledCondition;
			const nameStr = _.isFunction(link.name) ? link.name() : link.name;
			const tooltip = _.isFunction(link.tooltip) ? link.tooltip() : link.tooltip;

			list.push({nameStr, func: link.func, enabled, tooltip, image: link.image});
			// Input.buttons[i].Setup(nameStr, link.func, enabled);
		}
		// list.sort( (a, b) => { return a.nameStr > b.nameStr; } );

		Gui.SetButtonsFromList(list, undefined, undefined, GameState.Event);
	}

	// Shows
	public PrintDesc() {
		if (this.description) {
			if (_.isFunction(this.description)) {
				this.description();
			} else {
				Text.Add(this.description);
			}
		}

		for (const link of this.links) {
			if (link.print) {
				if (_.isFunction(link.print)) {
					link.print();
				} else {
					Text.Add(link.print);
				}
			}
		}

		for (const e of this.events) {
			if (e.print) {
				if (_.isFunction(e.print)) {
					e.print();
				} else {
					Text.Add(e.print);
				}
			}
		}

		if (this.endDescription) {
			if (_.isFunction(this.endDescription)) {
				this.endDescription();
			} else {
				Text.Add(this.endDescription);
			}
		}

		// At safe locations you can sleep and save
		if (GAME().party.location.safe()) {
			Text.NL();
			Text.Add("<b>This is a safe location, you can sleep and save here.</b>");
			Text.NL();
		}
		Text.Flush();
	}

}
