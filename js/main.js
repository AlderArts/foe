import * as $ from 'jquery';
import { Images, LoadImages } from './assets';
import { world } from './world';
import { Gui } from './gui';

// Prevent selection
$(function() {
	$('canvas').mousedown(function(event) { event.preventDefault() });
});

let online = false;

// Set the main entrypoint of the application
function EntryPoint() {
	try {
		online = localStorage ? true : false;
	}
	catch(ex) {
		online = false;
	}
	finally {
		// Setup the application
		Setup();
	}
}
// Make sure that this loads
window.onload = EntryPoint;

// Gamestate
let GameState = {
	Credits   : 0,
	Game      : 1,
	Combat    : 2,
	Event     : 3,
	Cavalcade : 4,
	Alchemy   : 5,
	Hunting   : 6
}

let gameState = GameState.Credits;

let SetGameState = function(state) {
	gameState = state;
	Gui.SetGameState(state);
}

let SetGameOverButton = function(text) {
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
	console.log("SPLASH");
	SetGameState(GameState.Credits);
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
		gameCache = {}
		CacheToGame();
		Intro.Start();
	}, true);

	Input.buttons[1].Setup("Load game", function() {
		Saver.LoadPrompt(SplashScreen);
	}, Saver.HasSaves());

	Input.buttons[2].Setup("Load file", function() {
		loadfileOverlay();
	}, true);

	Input.buttons[3].Setup("Credits", CreditsScreen, true);

	Input.buttons[4].Setup("Toggle debug", function() {
		DEBUG = !DEBUG;
		if(DEBUG) Gui.debug.show(); else Gui.debug.hide();
	}, true);


	Input.buttons[7].Setup(Gui.ShortcutsVisible ? "Keys: On" : "Keys: Off", function() {
		Gui.ShortcutsVisible = !Gui.ShortcutsVisible;
		if(online)
			localStorage["ShortcutsVisible"] = Gui.ShortcutsVisible ? 1 : 0;
		SplashScreen();
	}, true);

	Input.buttons[8].Setup("Set bg color", function() {
		Gui.BgColorPicker(SplashScreen);
	}, true);

	Input.buttons[9].Setup("Set font", function() {
		Gui.FontPicker(SplashScreen);
	}, true);

	Input.buttons[10].Setup(RENDER_PICTURES ? "Pics: On" : "Pics: Off", function() {
		RENDER_PICTURES = !RENDER_PICTURES;
		SplashScreen();
	}, true);

	Input.buttons[11].Setup("Clear saves", function() {
		Saver.Clear();
		SplashScreen();
	}, online, null, "Warning! This will clear up old saves by removing the save0-11 and savedata0-11 localstorage slots.");

	Text.NL();
	if(online && Saver.HasSaves())
		Text.Add("DEBUG: localStorage usage: " + JSON.stringify(localStorage).length / 2636625);
	Text.Flush();
}




// Animation loop Rendering
function Render() {
	world.Render();
	Gui.Render();
}

function Setup() {
	// Load assets
	LoadImages();

	// Intialize GUI (set key shortcuts, buttons etc)
	Gui.Init();

	Render();
}

export { online, GameState, gameState, SetGameState, Render };
