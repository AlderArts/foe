
// Prevent selection
$(function() {
    $('canvas').mousedown(function(event) { event.preventDefault() });
});

localStorage = {bgcolor: "temp"};

// Set the main entrypoint of the application
function EntryPoint() {
	// Setup the application
	Setup();
}
// Make sure that this loads
window.onload = EntryPoint;

// Gamestate
GameState = {
	Credits   : 0,
	Game      : 1,
	Combat    : 2,
	Event     : 3,
	Cavalcade : 4,
	Alchemy   : 5,
	Hunting   : 6
}

var gameState = GameState.Credits;

SetGameState = function(state) {
	gameState = state;
	Gui.SetGameState(state);
}

// TODO: Stats, newgame+ etc
GameOver = function() {
	SplashScreen();
}

SplashScreen = function() {
	SetGameState(GameState.Credits);
	Text.Clear();
	Gui.ClearButtons();
	
	Text.AddOutput("<span style=\"font-size: 26pt; font-family:Calibri;\">" + VERSION_STRING + "</span>");
	Text.Newline();
	
	Text.AddOutput(Text.InsertImage("data/avatar_gwendy.png")); // TEMP
	Text.AddOutput("<i>Game developed by <a href=\"http://www.furaffinity.net/user/aldergames/\">Alder</a></i>");
	Text.Newline();
	Text.AddOutput("Editors: MrKrampus, Del, Snarbolax. Thanks a bunch for your hard work!")
	Text.Newline();
	Text.AddOutput("WARNING: Due to structural changes in the save format, versions prior to 0.2j are incompatible (or wonky). I've introduced a save version to the save code, that will be able to upgrade saves, but it will only work for 0.2j and forward.");
	Text.Newline();
	Text.Newline();
	Text.AddOutput("Thanks to <a href=\"http://www.fenoxo.com/\">Fenoxo</a> for hosting this and for the inspiration. This game would never have been created if not for CoC!");
	Text.Newline();
	Text.AddOutput("<b>This game contains adult content. By playing you confirm that you are 18 years or older. Also, beware furries and futas.</b>");
	Text.Newline();
	Text.AddOutput("This game has hotkeys enabled, you can use 1-5, q-t, a-g");
	
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
    }, true, null, "Warning! This will clear up old saves by removing the save0-11 and savedata0-11 localstorage slots.");
    
    Text.Newline();
    if(Saver.HasSaves())
    	Text.AddOutput("DEBUG: localStorage usage: " + JSON.stringify(localStorage).length / 2636625);
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
