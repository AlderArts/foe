import { Gui } from "./gui";
import { Input } from "./input";

let SplashScreen: any;
export function InitGameOver(splashScreen: any) {
    SplashScreen = splashScreen;
}

export function SetGameOverButton(text?: any) {
	text = text || "This is where your journey comes to an end.";
	Gui.ClearButtons();
	Input.buttons[0].Setup("Game Over", GameOver, true, null, text);
}

// TODO: Stats, newgame+ etc
const GameOver = function() {
	Gui.Callstack = [];
	SplashScreen();
};
