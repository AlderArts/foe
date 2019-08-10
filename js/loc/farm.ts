/*
 *
 * Gwendy's farm
 *
 */

import { Event, Link } from '../event';
import { EncounterTable } from '../encountertable';
import { GwendyScenes } from '../event/farm/gwendy-scenes';
import { LaylaScenes } from '../event/farm/layla-scenes';
import { WorldTime, MoveToLocation, TimeStep, GAME, WORLD } from '../GAME';
import { SetGameState, GameState } from '../gamestate';
import { Gui } from '../gui';
import { Text } from '../text';
import { IngredientItems } from '../items/ingredients';
import { Season } from '../time';
import { RoamingScenes } from '../event/roaming';
import { DreamsScenes } from '../event/dreams';

export function InitFarm() {
	WORLD().SaveSpots["GwendysLoft"] = FarmLoc.Loft;
};

/*
 * Structure to hold farm management minigame
 */

export class Farm {
	coin : number;
	flags : any;

	constructor(storage? : any) {
		this.coin = 1000;

		this.flags = {};
		//this.flags["flag"] = 0;
		this.flags["Visit"] = 0;

		if(storage) this.FromStorage(storage);
	}
	
	FromStorage(storage : any) {
		this.coin = parseInt(storage.coin) || this.coin;
		// Load flags
		for(var flag in storage.flags)
			this.flags[flag] = parseInt(storage.flags[flag]);
	}

	ToStorage() {
		var storage : any = {};
		storage.coin  = this.coin;
		storage.flags = this.flags;

		return storage;
	}

	Update(step : number) {
		// TODO: Farm produce etc
	}

	Found() {
		return this.flags["Visit"] != 0;
	}
}














// Create namespace
let FarmLoc = {
	Fields : new Event("Plains: Gwendy's farm"),
	Barn   : new Event("The barn"),
	Loft   : new Event("Gwendy's loft")
}


FarmLoc.Loft.events.push(new Link(
	"Gwendy", function() {
		let gwendy = GAME().gwendy;
		return gwendy.IsAtLocation(FarmLoc.Loft);
	}, true,
	function() {
		let gwendy = GAME().gwendy;
		if(gwendy.IsAtLocation(FarmLoc.Loft)) {
			Text.Add("Gwendy is here.");
		}
		else
			Text.Add("Gwendy doesn't seem to be in at the moment.");			
		Text.NL();
	},
	GwendyScenes.LoftPrompt
));
FarmLoc.Barn.events.push(new Link(
	"Gwendy", function() {
		let gwendy = GAME().gwendy;
		return gwendy.IsAtLocation(FarmLoc.Barn);
	}, true,
	function() {
		let gwendy = GAME().gwendy;
		if(gwendy.IsAtLocation(FarmLoc.Barn)) {
			Text.Add("Gwendy is here.");
		}
		else
			Text.Add("Gwendy doesn't seem to be here at the moment.");			
		Text.NL();
	},
	GwendyScenes.BarnPrompt
));
FarmLoc.Fields.events.push(new Link(
	"Gwendy", function() {
		let gwendy = GAME().gwendy;
		return gwendy.IsAtLocation(FarmLoc.Fields);
	}, true,
	function() {
		let gwendy = GAME().gwendy;
		if(gwendy.IsAtLocation(FarmLoc.Fields)) {
			Text.Add("Gwendy is here.");
		}
		else
			Text.Add("Gwendy doesn't seem to be here at the moment.");			
		Text.NL();
	},
	GwendyScenes.FieldsPrompt
));


//
// Gwendy's farm, the fields
//
FarmLoc.Fields.description = function() {
	Text.Add("Fields.");
	Text.NL();
}

// Set up Layla events
FarmLoc.Fields.onEntry = function(x : any, from : any) {
	if(from == WORLD().loc.Plains.Crossroads) {
		if(LaylaScenes.FarmMeetingTrigger(true)) return;
	}
	Gui.PrintDefaultOptions();
}

FarmLoc.Fields.enc = new EncounterTable();
FarmLoc.Fields.enc.AddEnc(function() {
	return function() {
		let party = GAME().party;
		Text.Clear();

		Text.Add("Not having much else to do, you wander the fields for a few minutes. You pick up a particularly fresh bundle of grass. Who knows, could be useful for something.");
		Text.NL();
		Text.Add("You pick up some fresh grass.", null, 'bold');
		party.inventory.AddItem(IngredientItems.FreshGrass);

		TimeStep({minute: 15});
		Text.Flush();
		Gui.NextPrompt();
	};
}, 1.0, function() { return WorldTime().season != Season.Winter; });

FarmLoc.Fields.enc.AddEnc(function() {
	return RoamingScenes.FlowerPetal;
}, 1.0, function() { return WorldTime().season != Season.Winter; });

FarmLoc.Fields.enc.AddEnc(function() {
	return function() {
		let party = GAME().party;
		Text.Clear();

		Text.Add("Not having much else to do, you wander the fields for a few minutes. You pick up a pretty flower. Who knows, could be useful for something.");
		Text.NL();
		Text.Add("You pick up a Foxglove.", null, 'bold');
		party.inventory.AddItem(IngredientItems.Foxglove);

		TimeStep({minute: 15});

		Text.Flush();
		Gui.NextPrompt();
	};
}, 1.0, function() { return WorldTime().season != Season.Winter; });

FarmLoc.Fields.links.push(new Link(
	"Crossroads", true, true,
	null,
	function() {
		MoveToLocation(WORLD().loc.Plains.Crossroads, {minute: 30});
	}
));
FarmLoc.Fields.links.push(new Link(
	"Barn", true, true,
	null,
	function() {
		MoveToLocation(FarmLoc.Barn, {minute: 5});
	}
));

//
// Gwendy's barn
//
FarmLoc.Barn.description = function() {
	Text.Add("Barn.");
	Text.NL();
}
FarmLoc.Barn.links.push(new Link(
	"Fields", true, true,
	null,
	function() {
		MoveToLocation(FarmLoc.Fields, {minute: 5});
	}
));
FarmLoc.Barn.links.push(new Link(
	"Loft", true, true,
	null,
	function() {
		MoveToLocation(FarmLoc.Loft, {minute: 5});
	}
));

//
// Gwendy's loft
//
FarmLoc.Loft.SaveSpot   = "GwendysLoft";
FarmLoc.Loft.safe       = function() { return true; };
FarmLoc.Loft.description = function() {
	Text.Add("Gwendy's loft. ");
	Text.NL();
}
FarmLoc.Loft.links.push(new Link(
	"Climb down", true, true,
	null,
	function() {
		MoveToLocation(FarmLoc.Barn, {minute: 5});
	}
));

FarmLoc.Loft.SleepFunc = function() {
	let party = GAME().party;

	var parse = {

	};

	SetGameState(GameState.Event, Gui);

	Text.Clear();

	//TODO
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("You head off to bed", parse);
	Text.NL();
	Text.Add("", parse);

	Text.Flush();

	var func = function(dream : any) {
		TimeStep({hour: 8});
		party.Sleep();

		if(LaylaScenes.FarmMeetingTrigger()) return;

		//TODO
		Text.Add("You wake up, feeling rested and refreshed.", parse);

		Text.Flush();
		Gui.PrintDefaultOptions(true);
	}

	Gui.NextPrompt(function() {
		Text.Clear();

		DreamsScenes.Entry(func);
	});
}

export { FarmLoc };
