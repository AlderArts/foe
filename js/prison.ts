/*
 *
 * "Prison" minigame. Used for Pit and Miranda dungeon.
 *
 */

import { Entity } from "./entity";
import { GAME } from "./GAME";
import { GameState, SetGameState } from "./gamestate";
import { Gui } from "./gui";
import { Party } from "./party";
import { IParse, Text } from "./text";

/*
 * opts {
 *  party : [player, kiakai...],  - only used for setup
 *  enemy : Party(),
 *  TODO options
 * }
 *
 */
export class PrisonMinigame {
	public party: Entity[];
	public enemy: Party;

	constructor(opts?: any) {
		opts = opts || {};
		this.party = opts.party || [];
		this.enemy = opts.enemy || new Party();
		// TODO dynamic lists for available actions
	}

	public Prep() {
		const party: Party = GAME().party;

		party.SaveActiveParty();
		party.ClearActiveParty();
		for (const p of this.party) {
			party.SwitchIn(p);
		}

		// TODO maybe use a new one, check rendering
		SetGameState(GameState.Combat, Gui);
	}

	public Cleanup() {
		const party: Party = GAME().party;

		for (const e of this.enemy.members) {
			e.ClearCombatBonuses();
			e.combatStatus.EndOfCombat();
		}
		for (const e of party.members) {
			e.ClearCombatBonuses();
			e.combatStatus.EndOfCombat();
		}

		party.LoadActiveParty();

		SetGameState(GameState.Event, Gui);
	}

	// TODO
	public Tick() {
		const parse: IParse = {

		};

		Text.Clear();
		Text.Add("", parse);
		Text.NL();
		Text.Flush();

		// TODO Set up choices
		Gui.ClearButtons();
	}
}
