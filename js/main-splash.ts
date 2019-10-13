import { GetDEBUG, GetRenderPictures, SetDEBUG, SetRenderPictures, VERSION_STRING } from "../app";
import { Images } from "./assets";
import { CreditsScreen } from "./credits";
import { Intro } from "./event/introduction";
import { loadfileOverlay } from "./fileoverlay";
import { SetGameCache } from "./GAME";
import { CacheToGame } from "./gamecache";
import { GameState, isOnline, SetGameState } from "./gamestate";
import { Gui } from "./gui";
import { Input } from "./input";
import { Saver } from "./saver";
import { Text } from "./text";

const SplashScreen = () => {
	SetGameState(GameState.Credits, Gui);
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("<span style=\"font-size: 26pt; font-family:Calibri;\">" + VERSION_STRING + "</span>");
	Text.NL();

	Text.Add(Text.InsertImage(Images.gwendy)); // TEMP
	Text.Out(`<i>Game developed by <a href="http://www.furaffinity.net/user/aldergames/">Alder</a></i>

		Editors: MrKrampus, Del, Johnathan Roberts, Ryous, CalmKhaos. Thanks a bunch for your hard work!

		Thanks to <a href="http://www.fenoxo.com/">Fenoxo</a> for hosting this and for the inspiration. This game would never have been created if not for CoC!

		<b>This game contains adult content. By playing you confirm that you are 18 years or older. Also, beware furries and futas.</b>

		This game has hotkeys enabled, you can use 1-5, q-t, a-g`);

	Input.buttons[0].Setup("New game", () => {
		// Init game
		SetGameCache({});
		CacheToGame();
		Intro.Start();
	}, true);

	Input.buttons[1].Setup("Load game", () => {
		Saver.LoadPrompt(SplashScreen);
	}, Saver.HasSaves());

	Input.buttons[2].Setup("Load file", () => {
		loadfileOverlay();
	}, true);

	Input.buttons[3].Setup("Credits", () => {
		CreditsScreen(SplashScreen);
	}, true);

	Input.buttons[4].Setup("Toggle debug", () => {
		SetDEBUG(!GetDEBUG());
		if (GetDEBUG()) { Gui.debug.show(); } else { Gui.debug.hide(); }
	}, true);

	Input.buttons[7].Setup(Gui.ShortcutsVisible ? "Keys: On" : "Keys: Off", () => {
		Gui.ShortcutsVisible = !Gui.ShortcutsVisible;
		if (isOnline()) {
			localStorage.ShortcutsVisible = Gui.ShortcutsVisible ? 1 : 0;
		}
		SplashScreen();
	}, true);

	Input.buttons[8].Setup("Set bg color", () => {
		Gui.BgColorPicker(SplashScreen);
	}, true);

	Input.buttons[9].Setup("Set font", () => {
		Gui.FontPicker(SplashScreen);
	}, true);

	Input.buttons[10].Setup(GetRenderPictures() ? "Pics: On" : "Pics: Off", () => {
		SetRenderPictures(!GetRenderPictures());
		SplashScreen();
	}, true);

	Input.buttons[11].Setup("Clear saves", () => {
		Saver.Clear();
		SplashScreen();
	}, isOnline(), undefined, "Warning! This will clear up old saves by removing the save0-11 and savedata0-11 localstorage slots.");

	Text.NL();
	if (isOnline() && Saver.HasSaves()) {
		Text.Add(`DEBUG: localStorage usage: ${JSON.stringify(localStorage).length} characters.`);
	}
	Text.Flush();
};

export { SplashScreen };
