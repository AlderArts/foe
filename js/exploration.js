
//***************************************************//
//                                                   //
//               Exploration functions               //
//                                                   //
//***************************************************//

LastSubmenu = null;

PrintDefaultOptions = function(preventClear) {
	var e = Gui.Callstack.pop();
	if(e) {	
		e();
		return;
	}
	
	Gui.ClearButtons();
	
	if(!preventClear)
		Text.Clear();
	
	if(world.HandleTimers())
		return;
	
	if(party.location == null) {
		Text.AddOutput("ERROR, LOCATION IS NULL");
		Text.Newline();
		return;
	}
	
	SetGameState(GameState.Game);
	
	if(LastSubmenu)
    	LastSubmenu.func(preventClear);
    else
    	Explore();
}

ExploreButtonIndex = {
	Explore : 0,
	Party   : 1,
	Items   : 2,
	Ability : 3,
	Alchemy : 4,
	Quests  : 5,
	
	Wait    : 8,
	Sleep   : 9,
	Look    : 10
};

SetExploreButtons = function() {
	// TODO
	var waitLocation = true;
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

LimitedDataPrompt = function(backFunc) {
	SetGameState(GameState.Event);
	
	Text.Clear();
	Gui.ClearButtons();
	
	Text.AddOutput("Fall of Eden saves using JavaScript localStorage (also known as Web Storage). Exactly how and where this will put your save is up to browser implementation, but the standard ensures at least 5MB of storage space, more than enough for 12 full save slots.");
	Text.Newline();
	Text.AddOutput("You can only save at 'safe' locations in the world (the same places you can sleep), but you can load/start a new game from anywhere.");
	Text.Newline();
	Text.AddOutput("<b>NEW:</b> Use the save to text if you are having problems using save to file. Copy the text that appears into a text file, and save it. You will be able to use it with load from file.");
	
	Input.buttons[0].Setup("Save game", function() {
		Saver.SavePrompt(LimitedDataPrompt);
    }, true);
    
    Input.buttons[2].Setup("Save file", function() {
    	var filename = prompt("SAVE TO FILE WILL NOT WORK IN OFFLINE MODE!\n\n Enter name of save file.");
    	if(filename && filename != "") {
    		GameToCache();
			var seen = [];
    		GenerateFile({filename: filename, content: JSON.stringify(gameCache,
    			function(key, val) {
				   if (typeof val == "object") {
				        if (seen.indexOf(val) >= 0)
				            return;
				        seen.push(val);
				    }
				    return val;
				})
			});
		}
	}, true);
    
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
		Text.AddOutput(data);
		Gui.NextPrompt(function() {
			LimitedDataPrompt(backFunc);
		});
	}, true);
	
    Input.buttons[11].Setup("Back", backFunc, true);
}

DataPrompt = function() {
	SetGameState(GameState.Event);
	// At safe locations you can sleep and save
	var safeLocation = party.location.safe();
    	
	Text.Clear();
	Gui.ClearButtons();
	
	Text.AddOutput("Fall of Eden saves using JavaScript localStorage (also known as Web Storage). Exactly how and where this will put your save is up to browser implementation, but the standard ensures at least 5MB of storage space, more than enough for 12 full save slots.");
	Text.Newline();
	Text.AddOutput("You can only save at 'safe' locations in the world (the same places you can sleep), but you can load/start a new game from anywhere.");
	Text.Newline();
	Text.AddOutput("<b>NEW:</b> Use the save to text if you are having problems using save to file. Copy the text that appears into a text file, and save it. You will be able to use it with load from file.");
	
	Input.buttons[0].Setup("Save game", function() {
		Saver.SavePrompt(DataPrompt);
    }, safeLocation);
    
    Input.buttons[1].Setup("Load game", function() {
    	Saver.LoadPrompt(DataPrompt);
    }, true);
    
    Input.buttons[2].Setup("Save file", function() {
    	var filename = prompt("SAVE TO FILE WILL NOT WORK IN OFFLINE MODE!\n\n Enter name of save file.");
    	if(filename && filename != "") {
    		GameToCache();
			var seen = [];
    		GenerateFile({filename: filename, content: JSON.stringify(gameCache,
    			function(key, val) {
				   if (typeof val == "object") {
				        if (seen.indexOf(val) >= 0)
				            return;
				        seen.push(val);
				    }
				    return val;
				})
			});
		}
	}, safeLocation);
	
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
		Text.AddOutput(data);
		Gui.NextPrompt(DataPrompt);
	}, safeLocation);
	
	Input.buttons[7].Setup(Gui.ShortcutsVisible ? "Keys: On" : "Keys: Off", function() {
    	Gui.ShortcutsVisible = !Gui.ShortcutsVisible;
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

Explore = function(preventClear) {
	if(!preventClear)
		Text.Clear();
	
	if(party.location == null) {
		Text.AddOutput("ERROR, LOCATION IS NULL");
		Text.Newline();
		return;
	}
	
	var arr = [];
	for(var i = 0; i < party.location.links.length; i++) {
		var evt = party.location.links[i];
		evt.image = Images.imgButtonEnabled2;
		arr.push(evt);
	}
	for(var i = 0; i < party.location.events.length; i++) {
		arr.push(party.location.events[i]);
	}
	
	party.location.SetButtons(arr);
	party.location.PrintDesc();
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Explore];
	
	SetExploreButtons();
}

PartyInteraction = function(preventClear) {
	party.Interact(preventClear, party.location.switchSpot());
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Party];
	
	SetExploreButtons();
}

Fight = function(preventClear) {
	if(!preventClear)
		Text.Clear();
	if(party.location == null) {
		Text.AddOutput("ERROR, LOCATION IS NULL");
		Text.Newline();
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
		Text.AddOutput("You didn't find anything.");
		SetGameState(GameState.Game);
	}
}

ShowInventory = function(preventClear) {
	if(!preventClear)
		Text.Clear();
	if(party.inventory == null) {
		Text.AddOutput("ERROR, INVENTORY IS NULL");
		Text.Newline();
		return;
	}
	Gui.ClearButtons();
	
	party.inventory.ShowInventory(preventClear);
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Items];
	
	SetExploreButtons();
}

ShowAbilities = function(preventClear) {
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();
	
	party.ShowAbilities();
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Ability];
	
	SetExploreButtons();
}

ShowAlchemy = function(preventClear) {
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();
	
	Alchemy.AlchemyPrompt(player, party.inventory);
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Alchemy];
	
	SetExploreButtons();
}

ShowQuests = function(preventClear) {
	if(!preventClear)
		Text.Clear();
	Gui.ClearButtons();
	
	Quests.Print();
	LastSubmenu = Input.exploreButtons[ExploreButtonIndex.Quests];
	
	SetExploreButtons();
}
