import { IChoice } from "./engine/navigation/link";
import { Tooltip } from "./gui/button";
import { Gui } from "./gui/gui";
import { Input } from "./gui/input";

let SplashScreen: () => void;
export function InitGameOver(splashScreen: () => void) {
    SplashScreen = splashScreen;
}

export function SetGameOverButton(text?: Tooltip) {
    const options: IChoice[] = [
        {
            nameStr : `Game Over`,
            func() {
                // TODO: Stats, newgame+ etc
                Gui.Callstack = [];
                SplashScreen();
            }, enabled : true,
            tooltip : text || `This is where your journey comes to an end.`,
        },
    ];
    Gui.SetButtonsFromList(options);
}
