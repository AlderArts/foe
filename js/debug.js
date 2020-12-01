import { GAME, WORLD } from "./GAME";
import { SCENES } from "./SCENES";

export function InitDebugObjects() {
    window.game = GAME();
    window.world = WORLD();
    window.scenes = SCENES();
}
