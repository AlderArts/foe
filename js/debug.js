import { GAME, WORLD } from "./GAME";

export function InitDebugObjects() {
    window.game = GAME();
    window.world = WORLD();
}
