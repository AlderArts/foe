import { Gui } from "./gui";

// Gamestate
let GameState = {
	Credits   : 0,
	Game      : 1,
	Combat    : 2,
	Event     : 3,
	Cavalcade : 4,
	Alchemy   : 5,
	Hunting   : 6
}

let gameState = GameState.Credits;

let SetGameState = function(state) {
	gameState = state;
	Gui.SetGameState(state);
}

export { GameState, gameState, SetGameState };
