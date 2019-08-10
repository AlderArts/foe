
//***************************************************//
//                                                   //
//               Exploration functions               //
//                                                   //
//***************************************************//

import { SetGameState, GameState, isOnline } from './gamestate';
import { GetRenderPictures, SetRenderPictures, GetDEBUG, SetDEBUG } from '../app';

import { ExploreButtonIndex } from './explorestate';
import { GAME, GameCache, NAV } from './GAME';
import { Text } from './text';
import { Input } from './input';
import { Images } from './assets';
import { loadfileOverlay } from './fileoverlay';
import { GameToCache } from './gamecache';
import { SplashScreen } from './main-splash';
import { Saver } from './saver';
import { Alchemy } from './alchemy';
import { Quests } from './quest';
import { Gui } from './gui';
import { Party } from './party';
//import { Saver } from './saver'; TODO Circular dep
//import { Alchemy } from './alchemy'; TODO Circular dep
//import { Quest } from './quest'; TODO Circular dep

function SetExploreButtons() {
	let player = GAME().player;
	let party : Party = GAME().party;

	var waitLocation = party.location.wait();
	// At safe locations you can sleep and save
	var safeLocation = party.location.safe();

	Input.exploreButtons[ExploreButtonIndex.Explore].Setup("Explore", Explore, true);

	if(!GAME().IntroActive) {
		Input.exploreButtons[ExploreButtonIndex.Party].enabledImage = (party.location.switchSpot()) ? Images.imgButtonEnabled2 : Images.imgButtonEnabled;
		Input.exploreButtons[ExploreButtonIndex.Party].Setup("Party", PartyInteraction, true);
		if(party.members.length == 0) Input.exploreButtons[ExploreButtonIndex.Party].SetEnabled(false);

		Input.exploreButtons[ExploreButtonIndex.Items].Setup("Items", ShowInventory, true);

		Input.exploreButtons[ExploreButtonIndex.Ability].Setup("Abilities", ShowAbilities, true);
		if(player.alchemyLevel > 0)
			Input.exploreButtons[ExploreButtonIndex.Alchemy].Setup("Alchemy", ShowAlchemy, true);
		Input.exploreButtons[ExploreButtonIndex.Quests].Setup("Quests", ShowQuests, true);
		if(GetDEBUG()) // TODO
			Input.exploreButtons[ExploreButtonIndex.Hunt].Setup("Hunt", ShowHunting, true);

		if(safeLocation) { // SLEEP
			Input.exploreButtons[ExploreButtonIndex.Sleep].Setup("", party.location.SleepFunc, waitLocation, null,
				"Sleep until you are fully rested (restores HP/SP).");
		}
		else { // WAIT
			Input.exploreButtons[ExploreButtonIndex.Wait].Setup("", party.location.WaitFunc, waitLocation, null,
				"Wait for a while.");
		}

		// FIGHT/SEARCH
		Input.exploreButtons[ExploreButtonIndex.Look].Setup("", Fight, party.location.enc != null, null,
			"Explore the immediate surroundings, possibly finding enemies, new locations or hidden treasures.", GameState.Event);
	}
}

function LimitedDataPrompt(backFunc : any) {
	SetGameState(GameState.Event, Gui);

	Gui.ClearButtons();

	Gui.SavePromptText();

	Input.buttons[0].Setup("Save game", function() {
		Saver.SavePrompt(function() {
			LimitedDataPrompt(backFunc);
		});
	}, isOnline());

	Input.buttons[2].Setup("Save file", Saver.SaveToFile, true);

	Input.buttons[6].Setup("Save text", function() {
		GameToCache();
		var seen : any[] = [];
		var data = JSON.stringify(GameCache(),
			function(key, val) {
				if (typeof val == "object") {
					if (seen.indexOf(val) >= 0)
						return;
					seen.push(val);
				}
				return val;
			});
		Text.Clear();
		Text.Add(data);
		Text.Flush();
		Gui.NextPrompt(function() {
			LimitedDataPrompt(backFunc);
		});
	}, true);

	Input.buttons[11].Setup("Back", backFunc, true);
}
NAV().LimitedDataPrompt = LimitedDataPrompt;

function DataPrompt() {
	let party : Party = GAME().party;
	SetGameState(GameState.Event, Gui);
	// At safe locations you can sleep and save
	var safeLocation = party.location.safe();

	Gui.ClearButtons();

	Gui.SavePromptText();

	Input.buttons[0].Setup("Save game", function() {
		Saver.SavePrompt(DataPrompt);
	}, isOnline() && safeLocation);

	Input.buttons[1].Setup("Load game", function() {
		Saver.LoadPrompt(DataPrompt);
	}, Saver.HasSaves());

	Input.buttons[2].Setup("Save file", Saver.SaveToFile, safeLocation);

	Input.buttons[3].Setup("Load file", function() {
		loadfileOverlay();
	}, true);

	Input.buttons[4].Setup("Toggle debug", function() {
		SetDEBUG(!GetDEBUG());
		if(GetDEBUG()) Gui.debug.show(); else Gui.debug.hide();
		for(var i = 0; i < party.members.length; i++) {
			party.members[i].DebugMode(GetDEBUG());
		}
	}, true);

	Input.buttons[5].Setup("Quit game", SplashScreen, true);

	Input.buttons[6].Setup("Save text", function() {
		GameToCache();
		var seen : any[] = [];
		var data = JSON.stringify(GameCache(),
			function(key, val) {
				if (typeof val == "object") {
					if (seen.indexOf(val) >= 0)
						return;
					seen.push(val);
				}
				return val;
			});
		Text.Clear();
		Text.Add(data);
		Text.Flush();
		Gui.NextPrompt(DataPrompt);
	}, safeLocation);

	Input.buttons[7].Setup(Gui.ShortcutsVisible ? "Keys: On" : "Keys: Off", function() {
		Gui.ShortcutsVisible = !Gui.ShortcutsVisible;
		if(isOnline())
			localStorage["ShortcutsVisible"] = Gui.ShortcutsVisible ? 1 : 0;
		DataPrompt();
	}, true);

	Input.buttons[8].Setup("Set bg color", function() {
		Gui.BgColorPicker(DataPrompt);
	}, true);

	Input.buttons[9].Setup("Set font", function() {
		Gui.FontPicker(DataPrompt);
	}, true);

	Input.buttons[10].Setup(GetRenderPictures() ? "Pics: On" : "Pics: Off", function() {
		SetRenderPictures(!GetRenderPictures());

		DataPrompt();
	}, true);

	Input.buttons[11].Setup("Back", Gui.PrintDefaultOptions, true);
}
NAV().DataPrompt = DataPrompt;

//***************************************************//
//                                                   //
//               Exploration functions               //
//                                                   //
//***************************************************//

let Explore = function(preventClear : boolean) {
	let party : Party = GAME().party;
	if(!preventClear)
		Text.Clear();

	if(party.location == null) {
		Text.Add("ERROR, LOCATION IS NULL");
		Text.Flush();
		return;
	}

	party.location.SetButtons();
	party.location.PrintDesc();
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Explore]);

	SetExploreButtons();
}
NAV().Explore = Explore;

let PartyInteraction = function(preventClear : boolean) {
	let party : Party = GAME().party;
	party.Interact(preventClear, party.location.switchSpot());
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Party]);

	SetExploreButtons();
}
NAV().PartyInteraction = PartyInteraction;

let Fight = function(preventClear : boolean) {
	let party : Party = GAME().party;
	if(!preventClear)
		Text.Clear();
	if(party.location == null) {
		Text.Add("ERROR, LOCATION IS NULL");
		Text.Flush();
		return;
	}

	var enc = party.location.enc.Get();

	if(enc) {
		if(enc.Start)
			enc.Start();
		else
			enc();
	}
	else {
		Text.Add("You didn't find anything.");
		Text.Flush();
		SetGameState(GameState.Game, Gui);
	}
}
NAV().Fight = Fight;

let ShowInventory = function(preventClear : boolean) {
	let party : Party = GAME().party;
	if(!preventClear)
		Text.Clear();
	if(party.inventory == null) {
		Text.Add("ERROR, INVENTORY IS NULL");
		Text.Flush();
		return;
	}
	Gui.ClearButtons();

	party.inventory.ShowInventory(SetExploreButtons, preventClear);
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Items]);

	SetExploreButtons();
}
NAV().ShowInventory = ShowInventory;

let ShowAbilities = function(preventClear : boolean) {
	let party : Party = GAME().party;
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();

	party.ShowAbilities();
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Ability]);

	SetExploreButtons();
}
NAV().ShowAbilities = ShowAbilities;

let ShowAlchemy = function(preventClear? : boolean) {
	let player = GAME().player;
	let party : Party = GAME().party;
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();

	Alchemy.AlchemyPrompt(player, party.inventory);
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Alchemy]);

	SetExploreButtons();
}
NAV().ShowAlchemy = ShowAlchemy;

let ShowQuests = function(preventClear : boolean) {
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();

	Quests.Print(SetExploreButtons);
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Quests]);

	SetExploreButtons();
}
NAV().ShowQuests = ShowQuests;

let ShowHunting = function(preventClear : boolean) {
	let party : Party = GAME().party;
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();

	party.location.SetButtons(party.location.hunt);
	party.location.PrintDesc();

	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Hunt]);

	SetExploreButtons();
}
NAV().ShowHunting = ShowHunting;
