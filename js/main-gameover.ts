import { Tooltip } from "./button";
import { Gui } from "./gui";
import { Input } from "./input";

let SplashScreen: () => void;
export function InitGameOver(splashScreen: () => void) {
    SplashScreen = splashScreen;
}

export function SetGameOverButton(text?: Tooltip) {
	text = text || "This is where your journey comes to an end.";
	Gui.ClearButtons();
	Input.buttons[0].Setup("Game Over", GameOver, true, undefined, text);
}

// TODO: Stats, newgame+ etc
const GameOver = () => {
	Gui.Callstack = [];
	SplashScreen();
};
