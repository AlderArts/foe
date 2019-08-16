// Gamestate
enum GameState {
	Credits,
	Game,
	Combat,
	Event,
	Cavalcade,
	Alchemy,
	Hunting,
}

let gameState = GameState.Credits;

const SetGameState = function(state: GameState, Gui: any) {
	gameState = state;
	Gui.SetGameState(state);
};

let online: boolean = false;

export function isOnline() {
    return online;
}
export function setOnline(val: boolean) {
    online = val;
}

export { GameState, gameState, SetGameState };
