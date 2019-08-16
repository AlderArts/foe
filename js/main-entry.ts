import { assetsOverlay, LoadImages } from "./assets";
import { NAV } from "./GAME";
import { setOnline } from "./gamestate";
import { Gui } from "./gui";
import { Input } from "./input";
import { InitGameOver } from "./main-gameover";
import { SplashScreen } from "./main-splash";
import { Saver } from "./saver";
import { InitWorld } from "./world";

// Set the main entrypoint of the application
function EntryPoint() {
	try {
		setOnline(localStorage ? true : false);
	} catch (ex) {
		setOnline(false);
	} finally {
		// Setup the application
		Setup();
	}
}
// Make sure that this loads
window.onload = EntryPoint;

function Setup() {
    InitGameOver(SplashScreen);

	// Load assets
	   LoadImages(function() {
		assetsOverlay();

		// Go to credits screen
		SplashScreen();
		// Render first frame
		setTimeout(Gui.Render, 100);
	});

	   InitWorld();

	// Intialize GUI (set key shortcuts, buttons etc)
	   Gui.Init();
	   Saver.Init();

	// Basic menu
	   Input.menuButtons[0].Setup("Data", NAV().DataPrompt, true);

	   Gui.Render();
}
