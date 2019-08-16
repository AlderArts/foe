import * as _ from "lodash";

import { GetDEBUG } from "../app";
import { Abilities } from "./abilities";
import { CurrentActiveChar, EnemyParty, SetCurEncounter, SetCurrentActiveChar, SetEnemyParty } from "./combat-data";
import { Entity } from "./entity";
import { GAME, TimeStep } from "./GAME";
import { GameState, SetGameState } from "./gamestate";
import { Gui } from "./gui";
import { Input } from "./input";
import { Party } from "./party";
import { StatusEffect } from "./statuseffect";
import { Text } from "./text";

// Create encounter with a Party() containing enemies
export class Encounter {

	public static InitiativeSorter(a: any, b: any) {
		if (a.entity.Incapacitated() && b.entity.Incapacitated()) { return 0; }
		if (b.entity.Incapacitated()) { return -1; }
		if (a.entity.Incapacitated()) { return 1; }
		return (a.initiative > b.initiative) ? -1 : 1;
	}
	public canRun: boolean;
	public onEncounter: any;
	public onTick: any;
	public enemy: Party;
	public combatOrder: any[];
	public Callstack: any[];
	public uniqueID: number;

	constructor(enemy: Party) {
		this.canRun = true;

		// Party filled with entitys
		this.enemy = enemy;
		// Array filled with {entity: Entity, isEnemy: bool, initiative: number }
		this.combatOrder = new Array();
		// Used for fancy trickery
		this.Callstack = [];
	}

	public RunLevel() {
		return this.enemy.Get(0).level;
	}

	public Start() {
		SetGameState(GameState.Event, Gui);

		if (this.onEncounter) {
			this.onEncounter();
		} else {
			this.PrepCombat();
		}
	}

	// Set up the fight
	public PrepCombat() {
		SetGameState(GameState.Combat, Gui);

		SetCurEncounter(this);

		if (GAME().party.members.length === 0) {
			throw new Error("Errol: no members in party");
		}
		if (this.enemy.members.length === 0) {
			throw new Error("Errol: no enemy to fight");
		}

		// Set up combat order
		for (const ent of GAME().party.members) {
			this.combatOrder.push({
				entity  : ent,
				isEnemy : false});
		}
		for (const ent of this.enemy.members) {
			this.combatOrder.push({
				entity  : ent,
				isEnemy : true,
				aggro   : []});
		}

		for (const ent of this.combatOrder) {
			ent.initiative   = Math.random() * 5;
			// Fill aggro table
			if (ent.isEnemy) {
				ent.entity.GetSingleTarget(this, ent);
			}
		}

		SetEnemyParty(this.enemy);
		// Add a unique name property to each enemy entity
		for (let i = 0; i < EnemyParty().NumTotal(); i++) {
			this.GenerateUniqueName(EnemyParty().Get(i));
		}

		Gui.Callstack.push(() => {
			for (const ent of GAME().party.members) {
				// Ressurect fallen
				if (ent.curHp < 1) { ent.curHp = 1; }
			}
			Gui.PrintDefaultOptions();
		});

		// Start the combat
		this.CombatTick();
	}

	public GenerateUniqueName(entity: Entity) {
		this.uniqueID = this.uniqueID || 0;
		this.uniqueID++;
		entity.uniqueName = entity.name + " [" + this.uniqueID + "]";
	}

	public GetLiveEnemyArray() {
		const e = new Array();
		for (const ent of this.enemy.members) {
			if (!ent.Incapacitated()) {
				e.push(ent);
			}
		}
		return e;
	}

	public GetDownedEnemyArray() {
		const e = new Array();
		for (const ent of this.enemy.members) {
			if (ent.Incapacitated()) {
				e.push(ent);
			}
		}
		return e;
	}

	public GetLivePartyArray() {
		const p = new Array();
		for (const ent of GAME().party.members) {
			if (!ent.Incapacitated()) {
				p.push(ent);
			}
		}
		return p;
	}

	public GetDownedPartyArray() {
		const p = new Array();
		for (const ent of GAME().party.members) {
			if (ent.Incapacitated()) {
				p.push(ent);
			}
		}
		return p;
	}

	public GetEnemyArray() {
		const e = new Array();
		for (const ent of this.enemy.members) {
			e.push(ent);
		}
		return e;
	}

	public GetPartyArray() {
		const p = new Array();
		for (const ent of GAME().party.members) {
			p.push(ent);
		}
		return p;
	}

	// TODO
	public SetButtons(activeChar: any, combatScreen: any) {
		const entity = activeChar.entity;
		const encounter = this;

		const BasePrompt = () => {
			Gui.ClearButtons();
			Input.buttons[0].SetFromAbility(encounter, entity, Abilities.Attack, BasePrompt);

			Input.buttons[1].SetFromAbility(encounter, entity, Abilities.Seduction.Tease, BasePrompt);

			if (entity.currentJob && entity.currentJob.abilities.Empty() === false) {
				Input.buttons[2].SetFromAbility(encounter, entity, entity.currentJob.abilities, BasePrompt);
			}
			if (entity.abilities.Special.Empty() === false) {
				Input.buttons[3].SetFromAbility(encounter, entity, entity.abilities.Special, BasePrompt);
			}
			if (entity.abilities.Skills.Empty() === false) {
				Input.buttons[4].SetFromAbility(encounter, entity, entity.abilities.Skills, BasePrompt);
			}
			if (entity.abilities.Spells.Empty() === false) {
				Input.buttons[5].SetFromAbility(encounter, entity, entity.abilities.Spells, BasePrompt);
			}
			if (entity.abilities.Support.Empty() === false) {
				Input.buttons[6].SetFromAbility(encounter, entity, entity.abilities.Support, BasePrompt);
			}
			if (entity.abilities.Seduce.Empty() === false) {
				Input.buttons[7].SetFromAbility(encounter, entity, entity.abilities.Seduce, BasePrompt);
			}
			Input.buttons[8].SetFromAbility(encounter, entity, Abilities.Wait, BasePrompt);
			Input.buttons[9].Setup("Item", () => {
				GAME().party.inventory.CombatInventory(encounter, entity, BasePrompt);
			}, true);
			Input.buttons[10].Setup("Submit", () => {
				encounter.onLoss();
			}, true);
			Input.buttons[11].SetFromAbility(encounter, entity, Abilities.Run, BasePrompt);

			if (GetDEBUG()) {
				Input.navButtons[2].Setup("Cheat", () => {
					encounter.onVictory();
				}, true);
			}
			combatScreen();
		};

		BasePrompt();
	}

	public Cleanup() {
		for (const ent of this.enemy.members) {
			ent.ClearCombatBonuses();
			ent.combatStatus.EndOfCombat();
			ent.uniqueName = undefined;
		}
		for (const ent of GAME().party.members) {
			ent.ClearCombatBonuses();
			ent.combatStatus.EndOfCombat();
			ent.uniqueName = undefined;
		}
		SetCurEncounter(undefined);
	}

	public onRun() {
		this.Cleanup();

		// TEMP TODO
		TimeStep({hour: 1});

		Gui.NextPrompt(() => {
			SetGameState(GameState.Event, Gui);
			Gui.PrintDefaultOptions();
		});
	}

	// Default loss condition: party is downed
	public LossCondition() {
		let downed = true;
		for (const ent of GAME().party.members) {
			if (ent.Incapacitated() === false) { downed = false; }
		}
		return downed;
	}

	public onLoss() {
		Text.Clear();
		Text.Add("Defeat!");
		// TODO: XP loss?

		this.Cleanup();

		// TEMP TODO
		TimeStep({hour: 1});

		Text.Flush();
		Gui.NextPrompt(() => {
			SetGameState(GameState.Event, Gui);
			Gui.PrintDefaultOptions();
		});
	}

	// Default win condition: enemy party is downed
	public VictoryCondition() {
		let downed = true;
		for (const ent of this.enemy.members) {
			if (ent.Incapacitated() === false) { downed = false; }
		}
		return downed;
	}

	public onVictory() {
		Text.Clear();
		Text.Add("Victory!");
		Text.NL();

		let exp = 0; let coin = 0;
		for (let i = 0; i < this.enemy.NumTotal(); i++) {
			const e = this.enemy.Get(i);
			exp  += e.combatExp;
			coin += e.coinDrop;

			const drops = e.DropTable();
			for (const drop of drops) {
				const it  = drop.it;
				const num = drop.num || 1;

				Text.Add("The party finds " + num + "x " + it.name + ".<br>");
				GAME().party.inventory.AddItem(it, num);
			}
		}

		Text.Add("The party gains " + exp + " experience and " + coin + " coins.");

		for (const ent of GAME().party.members) {
			// Don't give exp to fallen characters
			if (ent.Incapacitated()) { continue; }
			ent.AddExp(exp);
		}
		// Reward xp to passive characters
		for (const ent of GAME().party.reserve) {
			ent.AddExp(exp * 0.75, true);
		}

		// ADD COIN TO PURSE
		GAME().party.coin += coin;

		this.Cleanup();

		// TEMP TODO
		TimeStep({hour: 1});

		Text.Flush();
		Gui.NextPrompt(() => {
			SetGameState(GameState.Event, Gui);
			Gui.PrintDefaultOptions();
		});
	}

	public OnIncapacitate(entity: Entity) {
		for (const ent of this.combatOrder) {
			const e = ent.entity;
			if (e === entity) {
				// Check for sleep
				if (e.combatStatus.stats[StatusEffect.Sleep] !== undefined) {
					e.combatStatus.stats[StatusEffect.Sleep] = undefined;
				}
				// Check for confuse
				if (e.combatStatus.stats[StatusEffect.Confuse] !== undefined) {
					e.combatStatus.stats[StatusEffect.Confuse].OnFade(this, e);
				}
				break;
			}
		}
	}

	public CombatTick() {
		const enc = this;

		const e = enc.Callstack.pop();
		if (e) {
			e(enc);
			return;
		}

		SetCurrentActiveChar(undefined);

		if (enc.onTick) {
			enc.onTick();
		}

		if (enc.LossCondition()) {
			enc.onLoss();
		} else if (enc.VictoryCondition()) {
			enc.onVictory();
		} else {
			/*
			let maxIni = 1;
			// Sort the list after initiative
			for(let i=0,j=this.combatOrder.length; i<j; i++){
				let c = this.combatOrder[i];

				if(!c.entity.Incapacitated()) {
					let ini = c.entity.Initiative();
					c.initiative += ini;
					if(maxIni < ini) maxIni = ini;
				}
			}
			*/

			let found = false;
			while (!found) {
				_.each(enc.combatOrder, (c) => {
					if (!c.entity.Incapacitated()) {
						if (c.initiative >= 100) {
							found = true;
							return false;
						}
					}
				});

				if (found) { break; }

				_.each(enc.combatOrder, (c) => {
					if (!c.entity.Incapacitated()) {
						c.initiative += c.entity.Initiative();
					}
				});
			}

			enc.combatOrder.sort(Encounter.InitiativeSorter);
			const activeChar = enc.combatOrder[0];

			SetCurrentActiveChar(activeChar.entity);

			const casting = activeChar.casting;
			activeChar.casting = undefined;

			let ini = 100;

			// Freeze, slow down character
			const freeze = CurrentActiveChar().combatStatus.stats[StatusEffect.Freeze];
			if (freeze) {
				if (Math.random() < freeze.proc) {
					ini *= freeze.str;
				}
			}

			activeChar.initiative -= ini;

			// Add lust
			_.each(enc.combatOrder, (c) => {
				if (!c.entity.Incapacitated()) {
					c.entity.AddLustOverTime(0.02);
				}
			});

			// Tick status effects
			CurrentActiveChar().combatStatus.Tick(CurrentActiveChar());
			if (CurrentActiveChar().Incapacitated()) {
				enc.CombatTick();
				return;
			}

			// Numb, stun character
			const numb = CurrentActiveChar().combatStatus.stats[StatusEffect.Numb];
			if (numb) {
				if (Math.random() < numb.proc) {
					Text.Add("[name] [is] stunned and cannot move!",
						{name: CurrentActiveChar().NameDesc(), is: CurrentActiveChar().is()});
					Text.Flush();
					Gui.NextPrompt(() => {
						enc.CombatTick();
					});
					return;
				}
			}

			// Sleep
			const sleep = CurrentActiveChar().combatStatus.stats[StatusEffect.Sleep];
			if (sleep) {
				Text.Add("[name] [is] asleep and cannot act!",
					{name: CurrentActiveChar().NameDesc(), is: CurrentActiveChar().is()});
				Text.Flush();
				Gui.NextPrompt(() => {
					enc.CombatTick();
				});
				return;
			}

			const combatScreen = () => {
				Text.Clear();
				// TODO: DEBUG ?
				let entityName = CurrentActiveChar().uniqueName ? CurrentActiveChar().uniqueName : CurrentActiveChar().name;
				Text.Add("Turn order:<br>", undefined, "bold");
				Text.Add(entityName + "<br>", undefined, "bold");

				const tempParty: any[] = [];
				_.each(enc.combatOrder, (c) => {
					if (!c.entity.Incapacitated()) {
						entityName = c.entity.uniqueName ? c.entity.uniqueName : c.entity.name;
						tempParty.push({entry: c, name: entityName, ini: c.initiative, inc: c.entity.Initiative()});
					}
				});

				_.times(8, () => {
					let found: any;
					while (!found) {
						_.each(tempParty, (c) => {
							if (c.ini >= 100) {
								found = c;
								return false;
							}
						});
						if (found) { break; }
						_.each(tempParty, (c) => {
							c.ini += c.inc;
						});
					}

					found.ini -= 100; // TODO cast time for predict
					const tempCasting = found.entry.casting ? " (casting...)" : "";
					Text.Add(found.name + tempCasting + "<br>");
				});
				Text.NL();

				if (activeChar.entity === GAME().player) {
					Text.Add("It's your turn.");
				} else {
					Text.Add(activeChar.entity.Possessive() + " turn.");
				}
				Text.NL();
				Text.Flush();
			};

			combatScreen();

			if (casting) {
				const ability = casting.ability;
				ability.CastInternal(enc, activeChar.entity, casting.target);
			} else {
				// Reduce cooldowns
				if (activeChar.cooldown) {
					_.each(activeChar.cooldown, (c) => {
						c.cooldown--;
					});
					activeChar.cooldown = _.filter(activeChar.cooldown, (c) => {
						return c.cooldown > 0;
					});
				}

				if (Math.random() < activeChar.entity.LustCombatTurnLossChance()) {
				Text.Add("[name] is too aroused to do anything worthwhile!", {name: activeChar.entity.name});
				Text.Flush();
				Gui.NextPrompt(() => {
						enc.CombatTick();
					});
				} else {
					// TODO: Confuse? Is this correctly implemented?
					if (activeChar.isEnemy) {
						activeChar.entity.Act(enc, activeChar);
					} else {
						// Confuse
						const confuse = CurrentActiveChar().combatStatus.stats[StatusEffect.Confuse];
						if (confuse) {
							if (confuse.func) {
								confuse.func(enc, activeChar);
							} else {
								activeChar.entity.Act(enc, activeChar);
							}
						} else {
							enc.SetButtons(activeChar, combatScreen);
						}
					}
					Text.Flush();
				}
			}
		}
	}

}
