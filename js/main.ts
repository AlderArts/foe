import { Images } from './assets';
import { Gui } from './gui';
import { VERSION_STRING, GetRenderPictures, SetRenderPictures, GetDEBUG, SetDEBUG } from '../app';
import { Input } from './input';
import { Saver } from './saver';
import { CreditsScreen } from './credits';
import { CacheToGame } from './gamecache';
import { GameState, isOnline, SetGameState } from './gamestate';
import { Text } from './text';
import { Intro } from './event/introduction';
import { SetGameCache } from './GAME';
import { loadfileOverlay } from './fileoverlay';

let SetGameOverButton = function(text? : any) {
	text = text || "This is where your journey comes to an end.";
	Gui.ClearButtons();
	Input.buttons[0].Setup("Game Over", GameOver, true, null, text);
}

// TODO: Stats, newgame+ etc
let GameOver = function() {
	Gui.Callstack = [];
	SplashScreen();
}

let SplashScreen = function() {
	SetGameState(GameState.Credits, Gui);
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("<span style=\"font-size: 26pt; font-family:Calibri;\">" + VERSION_STRING + "</span>");
	Text.NL();

	Text.Add(Text.InsertImage(Images.gwendy)); // TEMP
	Text.Add("<i>Game developed by <a href=\"http://www.furaffinity.net/user/aldergames/\">Alder</a></i>");
	Text.NL();
	Text.Add("Editors: MrKrampus, Del, Johnathan Roberts, Ryous, CalmKhaos. Thanks a bunch for your hard work!")
	Text.NL();
	Text.Add("Thanks to <a href=\"http://www.fenoxo.com/\">Fenoxo</a> for hosting this and for the inspiration. This game would never have been created if not for CoC!");
	Text.NL();
	Text.Add("<b>This game contains adult content. By playing you confirm that you are 18 years or older. Also, beware furries and futas.</b>");
	Text.NL();
	Text.Add("This game has hotkeys enabled, you can use 1-5, q-t, a-g");

	Input.buttons[0].Setup("New game", function() {
		// Init game
		SetGameCache({});
		CacheToGame();
		Intro.Start();
	}, true);

	Input.buttons[1].Setup("Load game", function() {
		Saver.LoadPrompt(SplashScreen);
	}, Saver.HasSaves());

	Input.buttons[2].Setup("Load file", function() {
		loadfileOverlay();
	}, true);

	Input.buttons[3].Setup("Credits", function() {
		CreditsScreen(SplashScreen);
	}, true);

	Input.buttons[4].Setup("Toggle debug", function() {
		SetDEBUG(!GetDEBUG());
		if(GetDEBUG()) Gui.debug.show(); else Gui.debug.hide();
	}, true);


	Input.buttons[7].Setup(Gui.ShortcutsVisible ? "Keys: On" : "Keys: Off", function() {
		Gui.ShortcutsVisible = !Gui.ShortcutsVisible;
		if(isOnline())
			localStorage["ShortcutsVisible"] = Gui.ShortcutsVisible ? 1 : 0;
		SplashScreen();
	}, true);

	Input.buttons[8].Setup("Set bg color", function() {
		Gui.BgColorPicker(SplashScreen);
	}, true);

	Input.buttons[9].Setup("Set font", function() {
		Gui.FontPicker(SplashScreen);
	}, true);

	Input.buttons[10].Setup(GetRenderPictures() ? "Pics: On" : "Pics: Off", function() {
		SetRenderPictures(!GetRenderPictures());
		SplashScreen();
	}, true);

	Input.buttons[11].Setup("Clear saves", function() {
		Saver.Clear();
		SplashScreen();
	}, isOnline(), null, "Warning! This will clear up old saves by removing the save0-11 and savedata0-11 localstorage slots.");

	Text.NL();
	if(isOnline() && Saver.HasSaves())
		Text.Add("DEBUG: localStorage usage: " + JSON.stringify(localStorage).length / 2636625);
	Text.Flush();
}

export { SetGameOverButton, SplashScreen };
