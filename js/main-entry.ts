import { setOnline } from "./gamestate";
import { LoadImages, assetsOverlay } from "./assets";
import { SplashScreen } from "./main";
import { Gui } from "./gui";
import { InitWorld } from "./world";
import { Saver } from "./saver";
import { Input } from "./input";
import { DataPrompt } from "./exploration";

// Set the main entrypoint of the application
function EntryPoint() {
	try {
		setOnline(localStorage ? true : false);
	}
	catch(ex) {
		setOnline(false);
	}
	finally {
		// Setup the application
		Setup();
	}
}
// Make sure that this loads
window.onload = EntryPoint;

function Setup() {
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
	Input.menuButtons[0].Setup("Data", DataPrompt, true);

	Gui.Render();
}
