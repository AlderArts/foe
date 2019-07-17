
//***************************************************//
//                                                   //
//               Exploration functions               //
//                                                   //
//***************************************************//

import { Gui } from './gui';

let LastSubmenu = null;

function PrintDefaultOptions(preventClear) {
	var e = Gui.Callstack.pop();
	if(e) {
		e();
		return;
	}

	Gui.ClearButtons();

	if(!preventClear)
		Text.Clear();

	if(party.location == null) {
		Text.Add("ERROR, LOCATION IS NULL");
		Text.Flush();
		return;
	}

	SetGameState(GameState.Game);

	if(LastSubmenu)
		LastSubmenu.func(preventClear);
	else
		Explore();
}

let ExploreButtonIndex = {
	Explore : 0,
	Party   : 1,
	Items   : 2,
	Ability : 3,
	Alchemy : 4,
	Quests  : 5,
	Hunt    : 6,

	Wait    : 8,
	Sleep   : 9,
	Look    : 10
};

function SetExploreButtons() {
	var waitLocation = party.location.wait();
	// At safe locations you can sleep and save
	var safeLocation = party.location.safe();

	Input.exploreButtons[ExploreButtonIndex.Explore].Setup("Explore", Explore, true);

	if(!Intro.active) {
		Input.exploreButtons[ExploreButtonIndex.Party].enabledImage = (party.location.switchSpot()) ? Images.imgButtonEnabled2 : Images.imgButtonEnabled;
		Input.exploreButtons[ExploreButtonIndex.Party].Setup("Party", PartyInteraction, true);
		if(party.members.length == 0) Input.exploreButtons[ExploreButtonIndex.Party].SetEnabled(false);

		Input.exploreButtons[ExploreButtonIndex.Items].Setup("Items", ShowInventory, true);

		Input.exploreButtons[ExploreButtonIndex.Ability].Setup("Abilities", ShowAbilities, true);
		if(player.alchemyLevel > 0)
			Input.exploreButtons[ExploreButtonIndex.Alchemy].Setup("Alchemy", ShowAlchemy, true);
		Input.exploreButtons[ExploreButtonIndex.Quests].Setup("Quests", ShowQuests, true);
		if(DEBUG) // TODO
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

Gui.SavePromptText = function() {
	Text.Clear();
	Text.Add("Fall of Eden saves using JavaScript localStorage (also known as Web Storage). Exactly how and where this will put your save is up to browser implementation, but the standard ensures at least 5MB of storage space, more than enough for 12 full save slots.");
	Text.NL();
	Text.Add("IMPORTANT: Saves are kept by your browser, for the specific domain you are playing in atm. If you clear browsing history or the domain changes, you may lose saves. See these saves as temporary, ALWAYS use Save to File to backup if you want to ensure not losing your progress!", null, 'bold');
	Text.NL();
	Text.Add("You can only save at 'safe' locations in the world (the same places you can sleep), but you can load/start a new game from anywhere.");
	Text.NL();
	Text.Add("<b>NEW:</b> Use the save to text if you are having problems using save to file. Copy the text that appears into a text file, and save it. You will be able to use it with load from file.");
	Text.Flush();
}

function LimitedDataPrompt(backFunc) {
	SetGameState(GameState.Event);

	Gui.ClearButtons();

	Gui.SavePromptText();

	Input.buttons[0].Setup("Save game", function() {
		Saver.SavePrompt(function() {
			LimitedDataPrompt(backFunc);
		});
	}, online);

	Input.buttons[2].Setup("Save file", Saver.SaveToFile, true);

	Input.buttons[6].Setup("Save text", function() {
		GameToCache();
		var seen = [];
		var data = JSON.stringify(gameCache,
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

function DataPrompt() {
	SetGameState(GameState.Event);
	// At safe locations you can sleep and save
	var safeLocation = party.location.safe();

	Gui.ClearButtons();

	Gui.SavePromptText();

	Input.buttons[0].Setup("Save game", function() {
		Saver.SavePrompt(DataPrompt);
	}, online && safeLocation);

	Input.buttons[1].Setup("Load game", function() {
		Saver.LoadPrompt(DataPrompt);
	}, Saver.HasSaves());

	Input.buttons[2].Setup("Save file", Saver.SaveToFile, safeLocation);

	Input.buttons[3].Setup("Load file", function() {
		loadfileOverlay();
	}, true);

	Input.buttons[4].Setup("Toggle debug", function() {
		DEBUG = !DEBUG;
		if(DEBUG) Gui.debug.show(); else Gui.debug.hide();
		for(var i = 0; i < party.members.length; i++) {
			party.members[i].DebugMode(DEBUG);
		}
	}, true);

	Input.buttons[5].Setup("Quit game", SplashScreen, true);

	Input.buttons[6].Setup("Save text", function() {
		GameToCache();
		var seen = [];
		var data = JSON.stringify(gameCache,
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
		if(online)
			localStorage["ShortcutsVisible"] = Gui.ShortcutsVisible ? 1 : 0;
		DataPrompt();
	}, true);

	Input.buttons[8].Setup("Set bg color", function() {
		Gui.BgColorPicker(DataPrompt);
	}, true);

	Input.buttons[9].Setup("Set font", function() {
		Gui.FontPicker(DataPrompt);
	}, true);

	Input.buttons[10].Setup(RENDER_PICTURES ? "Pics: On" : "Pics: Off", function() {
		RENDER_PICTURES = !RENDER_PICTURES;

		DataPrompt();
	}, true);

	Input.buttons[11].Setup("Back", PrintDefaultOptions, true);
}

//***************************************************//
//                                                   //
//               Exploration functions               //
//                                                   //
//***************************************************//

function Explore(preventClear) {
	if(!preventClear)
		Text.Clear();

	if(party.location == null) {
		Text.Add("ERROR, LOCATION IS NULL");
		Text.Flush();
		return;
	}

	party.location.SetButtons();
	party.location.PrintDesc();
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Explore];

	SetExploreButtons();
}

function PartyInteraction(preventClear) {
	party.Interact(preventClear, party.location.switchSpot());
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Party];

	SetExploreButtons();
}

function Fight(preventClear) {
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
		SetGameState(GameState.Game);
	}
}

function ShowInventory(preventClear) {
	if(!preventClear)
		Text.Clear();
	if(party.inventory == null) {
		Text.Add("ERROR, INVENTORY IS NULL");
		Text.Flush();
		return;
	}
	Gui.ClearButtons();

	party.inventory.ShowInventory(preventClear);
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Items];

	SetExploreButtons();
}

function ShowAbilities(preventClear) {
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();

	party.ShowAbilities();
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Ability];

	SetExploreButtons();
}

function ShowAlchemy(preventClear) {
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();

	Alchemy.AlchemyPrompt(player, party.inventory);
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Alchemy];

	SetExploreButtons();
}

function ShowQuests(preventClear) {
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();

	Quests.Print();
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Quests];

	SetExploreButtons();
}

function ShowHunting(preventClear) {
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();

	party.location.SetButtons(party.location.hunt);
	party.location.PrintDesc();

	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Hunt];

	SetExploreButtons();
}

export { PrintDefaultOptions };
