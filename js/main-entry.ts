import { assetsOverlay, LoadImages } from "./assets";
import { NAV } from "./engine/GAME";
import { setOnline } from "./engine/gamestate";
import { InitWorld } from "./engine/navigation/world";
import { Gui } from "./gui/gui";
import { Input } from "./gui/input";
import { Saver } from "./gui/saver";
import { InitGameOver } from "./main-gameover";
import { SplashScreen } from "./main-splash";

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
	   LoadImages(() => {
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
