/*
 *
 * "Prison" minigame. Used for Pit and Miranda dungeon.
 *
 */

import { Party } from './party';
import { GameState, SetGameState } from './gamestate';
import { Text } from './text';

/*
 * opts {
 *  party : [player, kiakai...],  - only used for setup
 *  enemy : Party(),
 *  TODO options
 * }
 *
 */
function PrisonMinigame(opts) {
	opts = opts || {};
	this.party = opts.party || [];
	this.enemy = opts.enemy || new Party();
	//TODO dynamic lists for available actions
}

PrisonMinigame.prototype.Prep = function() {
	party.SaveActiveParty();
	party.ClearActiveParty();
	for(var i = 0; i < this.party.length; i++)
		party.SwitchIn(this.party[i]);

	//TODO maybe use a new one, check rendering
	SetGameState(GameState.Combat, Gui);
}


PrisonMinigame.prototype.Cleanup = function() {
	for(var i = 0; i < this.enemy.members.length; i++) {
		var e = this.enemy.members[i];
		e.ClearCombatBonuses();
		e.combatStatus.EndOfCombat();
	}
	for(var i = 0; i < party.members.length; i++) {
		var e = party.members[i];
		e.ClearCombatBonuses();
		e.combatStatus.EndOfCombat();
	}

	party.LoadActiveParty();

	SetGameState(GameState.Event, Gui);
}

//TODO
PrisonMinigame.prototype.Tick = function() {
	var parse = {

	};

	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();

	//TODO Set up choices
	Gui.ClearButtons();
}

export { PrisonMinigame };
