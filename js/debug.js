import { GAME, WORLD } from "./engine/GAME";
import { SCENES } from "./SCENES";

export function InitDebugObjects() {
    window.game = GAME();
    window.world = WORLD();
    window.scenes = SCENES();
}
