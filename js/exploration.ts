
// ***************************************************//
//                                                   //
//               Exploration functions               //
//                                                   //
// ***************************************************//

import { GetDEBUG, GetRenderPictures, SetDEBUG, SetRenderPictures } from "../app";
import { GameState, isOnline, SetGameState } from "./gamestate";

import { Alchemy } from "./alchemy";
import { Images } from "./assets";
import { ExploreButtonIndex } from "./explorestate";
import { loadfileOverlay } from "./fileoverlay";
import { GAME, GameCache, NAV } from "./GAME";
import { GameToCache } from "./gamecache";
import { Gui } from "./gui";
import { Input } from "./input";
import { SplashScreen } from "./main-splash";
import { Party } from "./party";
import { Quests } from "./quest";
import { Saver } from "./saver";
import { Text } from "./text";
// import { Saver } from './saver'; TODO Circular dep
// import { Alchemy } from './alchemy'; TODO Circular dep
// import { Quest } from './quest'; TODO Circular dep

function SetExploreButtons() {
	const player = GAME().player;
	const party: Party = GAME().party;

	const waitLocation = party.location.wait();
	// At safe locations you can sleep and save
	const safeLocation = party.location.safe();

	Input.exploreButtons[ExploreButtonIndex.Explore].Setup("Explore", Explore, true);

	if (!GAME().IntroActive) {
		Input.exploreButtons[ExploreButtonIndex.Party].enabledImage = (party.location.switchSpot()) ? Images.imgButtonEnabled2 : Images.imgButtonEnabled;
		Input.exploreButtons[ExploreButtonIndex.Party].Setup("Party", PartyInteraction, true);
		if (party.members.length === 0) { Input.exploreButtons[ExploreButtonIndex.Party].SetEnabled(false); }

		Input.exploreButtons[ExploreButtonIndex.Items].Setup("Items", ShowInventory, true);

		Input.exploreButtons[ExploreButtonIndex.Ability].Setup("Abilities", ShowAbilities, true);
		if (player.alchemyLevel > 0) {
			Input.exploreButtons[ExploreButtonIndex.Alchemy].Setup("Alchemy", ShowAlchemy, true);
		}
		Input.exploreButtons[ExploreButtonIndex.Quests].Setup("Quests", ShowQuests, true);
		if (GetDEBUG()) { // TODO
			Input.exploreButtons[ExploreButtonIndex.Hunt].Setup("Hunt", ShowHunting, true);
		}

		if (safeLocation) { // SLEEP
			Input.exploreButtons[ExploreButtonIndex.Sleep].Setup("", party.location.SleepFunc, waitLocation, null,
				"Sleep until you are fully rested (restores HP/SP).");
		} else { // WAIT
			Input.exploreButtons[ExploreButtonIndex.Wait].Setup("", party.location.WaitFunc, waitLocation, null,
				"Wait for a while.");
		}

		// FIGHT/SEARCH
		Input.exploreButtons[ExploreButtonIndex.Look].Setup("", Fight, party.location.enc !== null, null,
			"Explore the immediate surroundings, possibly finding enemies, new locations or hidden treasures.", GameState.Event);
	}
}

function LimitedDataPrompt(backFunc: any) {
	SetGameState(GameState.Event, Gui);

	Gui.ClearButtons();

	Gui.SavePromptText();

	Input.buttons[0].Setup("Save game", () => {
		Saver.SavePrompt(() => {
			LimitedDataPrompt(backFunc);
		});
	}, isOnline());

	Input.buttons[2].Setup("Save file", Saver.SaveToFile, true);

	Input.buttons[6].Setup("Save text", () => {
		GameToCache();
		const seen: any[] = [];
		const data = JSON.stringify(GameCache(),
			(key, val) => {
				if (typeof val === "object") {
					if (seen.indexOf(val) >= 0) {
						return;
					}
					seen.push(val);
				}
				return val;
			});
		Text.Clear();
		Text.Add(data);
		Text.Flush();
		Gui.NextPrompt(() => {
			LimitedDataPrompt(backFunc);
		});
	}, true);

	Input.buttons[11].Setup("Back", backFunc, true);
}
NAV().LimitedDataPrompt = LimitedDataPrompt;

function DataPrompt() {
	const party: Party = GAME().party;
	SetGameState(GameState.Event, Gui);
	// At safe locations you can sleep and save
	const safeLocation = party.location.safe();

	Gui.ClearButtons();

	Gui.SavePromptText();

	Input.buttons[0].Setup("Save game", () => {
		Saver.SavePrompt(DataPrompt);
	}, isOnline() && safeLocation);

	Input.buttons[1].Setup("Load game", () => {
		Saver.LoadPrompt(DataPrompt);
	}, Saver.HasSaves());

	Input.buttons[2].Setup("Save file", Saver.SaveToFile, safeLocation);

	Input.buttons[3].Setup("Load file", () => {
		loadfileOverlay();
	}, true);

	Input.buttons[4].Setup("Toggle debug", () => {
		SetDEBUG(!GetDEBUG());
		if (GetDEBUG()) { Gui.debug.show(); } else { Gui.debug.hide(); }
		for (const member of party.members) {
			member.DebugMode(GetDEBUG());
		}
	}, true);

	Input.buttons[5].Setup("Quit game", SplashScreen, true);

	Input.buttons[6].Setup("Save text", () => {
		GameToCache();
		const seen: any[] = [];
		const data = JSON.stringify(GameCache(),
			(key, val) => {
				if (typeof val === "object") {
					if (seen.indexOf(val) >= 0) {
						return;
					}
					seen.push(val);
				}
				return val;
			});
		Text.Clear();
		Text.Add(data);
		Text.Flush();
		Gui.NextPrompt(DataPrompt);
	}, safeLocation);

	Input.buttons[7].Setup(Gui.ShortcutsVisible ? "Keys: On" : "Keys: Off", () => {
		Gui.ShortcutsVisible = !Gui.ShortcutsVisible;
		if (isOnline()) {
			localStorage.ShortcutsVisible = Gui.ShortcutsVisible ? 1 : 0;
		}
		DataPrompt();
	}, true);

	Input.buttons[8].Setup("Set bg color", () => {
		Gui.BgColorPicker(DataPrompt);
	}, true);

	Input.buttons[9].Setup("Set font", () => {
		Gui.FontPicker(DataPrompt);
	}, true);

	Input.buttons[10].Setup(GetRenderPictures() ? "Pics: On" : "Pics: Off", () => {
		SetRenderPictures(!GetRenderPictures());

		DataPrompt();
	}, true);

	Input.buttons[11].Setup("Back", Gui.PrintDefaultOptions, true);
}
NAV().DataPrompt = DataPrompt;

// ***************************************************//
//                                                   //
//               Exploration functions               //
//                                                   //
// ***************************************************//

const Explore = (preventClear: boolean) => {
	const party: Party = GAME().party;
	if (!preventClear) {
		Text.Clear();
	}

	if (party.location === null) {
		Text.Add("ERROR, LOCATION IS NULL");
		Text.Flush();
		return;
	}

	party.location.SetButtons();
	party.location.PrintDesc();
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Explore]);

	SetExploreButtons();
};
NAV().Explore = Explore;

const PartyInteraction = (preventClear: boolean) => {
	const party: Party = GAME().party;
	party.Interact(preventClear, party.location.switchSpot());
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Party]);

	SetExploreButtons();
};
NAV().PartyInteraction = PartyInteraction;

const Fight = (preventClear: boolean) => {
	const party: Party = GAME().party;
	if (!preventClear) {
		Text.Clear();
	}
	if (party.location === null) {
		Text.Add("ERROR, LOCATION IS NULL");
		Text.Flush();
		return;
	}

	const enc = party.location.enc.Get();

	if (enc) {
		if (enc.Start) {
			enc.Start();
		} else {
			enc();
		}
	} else {
		Text.Add("You didn't find anything.");
		Text.Flush();
		SetGameState(GameState.Game, Gui);
	}
};
NAV().Fight = Fight;

const ShowInventory = (preventClear: boolean) => {
	const party: Party = GAME().party;
	if (!preventClear) {
		Text.Clear();
	}
	if (party.inventory === null) {
		Text.Add("ERROR, INVENTORY IS NULL");
		Text.Flush();
		return;
	}
	Gui.ClearButtons();

	party.inventory.ShowInventory(SetExploreButtons, preventClear);
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Items]);

	SetExploreButtons();
};
NAV().ShowInventory = ShowInventory;

const ShowAbilities = (preventClear: boolean) => {
	const party: Party = GAME().party;
	if (!preventClear) {
		Text.Clear();
	}
	Gui.ClearButtons();

	party.ShowAbilities();
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Ability]);

	SetExploreButtons();
};
NAV().ShowAbilities = ShowAbilities;

const ShowAlchemy = (preventClear?: boolean) => {
	const player = GAME().player;
	const party: Party = GAME().party;
	if (!preventClear) {
		Text.Clear();
	}
	Gui.ClearButtons();

	Alchemy.Prompt(player, party.inventory);
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Alchemy]);

	SetExploreButtons();
};
NAV().ShowAlchemy = ShowAlchemy;

const ShowQuests = (preventClear: boolean) => {
	if (!preventClear) {
		Text.Clear();
	}
	Gui.ClearButtons();

	Quests.Print(SetExploreButtons);
	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Quests]);

	SetExploreButtons();
};
NAV().ShowQuests = ShowQuests;

const ShowHunting = (preventClear: boolean) => {
	const party: Party = GAME().party;
	if (!preventClear) {
		Text.Clear();
	}
	Gui.ClearButtons();

	party.location.SetButtons(party.location.hunt);
	party.location.PrintDesc();

	Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Hunt]);

	SetExploreButtons();
};
NAV().ShowHunting = ShowHunting;
