import * as _ from 'lodash';

import { GetDEBUG } from "../app";
import { SetGameState, GameState } from "./gamestate";
import { Gui } from "./gui";
import { Input } from "./input";
import { GAME, TimeStep } from "./GAME";
import { StatusEffect } from "./statuseffect";
import { Text } from "./text";
import { Abilities } from "./abilities";
import { SetCurEncounter, SetEnemyParty, EnemyParty, SetCurrentActiveChar, CurrentActiveChar } from "./combat-data";
import { Party } from './party';
import { Entity } from './entity';

// Create encounter with a Party() containing enemies
export class Encounter {
	canRun : boolean;
	onEncounter : any;
	onTick : any;
	enemy : Party;
	combatOrder : any[];
	Callstack : any[];
	uniqueID : number;

	constructor(enemy : Party) {
		this.canRun = true;
		
		this.onEncounter = null;
		this.onTick = null;
		
		// Party filled with entitys
		this.enemy = enemy;
		// Array filled with {entity: Entity, isEnemy: bool, initiative: number }
		this.combatOrder = new Array();
		// Used for fancy trickery
		this.Callstack = [];
	}
	
	static InitiativeSorter(a : any, b : any) {
		if(a.entity.Incapacitated() && b.entity.Incapacitated()) return 0;
		if(b.entity.Incapacitated()) return -1;
		if(a.entity.Incapacitated()) return 1;
		return (a.initiative > b.initiative) ? -1 : 1;
	}

	RunLevel() {
		return this.enemy.Get(0).level;
	}

	Start() {
		SetGameState(GameState.Event, Gui);
		
		if(this.onEncounter)
			this.onEncounter();
		else
			this.PrepCombat();
	}

	// Set up the fight
	PrepCombat() {
		SetGameState(GameState.Combat, Gui);
		
		SetCurEncounter(this);
		
		if(GAME().party.members.length == 0)
			throw "Errol: no members in party";
		if(this.enemy.members.length == 0)
			throw "Errol: no enemy to fight";
			
		// Set up combat order
		for(let ent of GAME().party.members)
			this.combatOrder.push({
				entity  : ent,
				isEnemy : false});
		for(let ent of this.enemy.members)
			this.combatOrder.push({
				entity  : ent, 
				isEnemy : true,
				aggro   : []});
				
		for(let ent of this.combatOrder) {
			ent.initiative   = Math.random() * 5;
			// Fill aggro table
			if(ent.isEnemy) {
				ent.entity.GetSingleTarget(this, ent);
			}
		}

		SetEnemyParty(this.enemy);
		//Add a unique name property to each enemy entity
		for(let i=0; i < EnemyParty().NumTotal(); i++) {
			this.GenerateUniqueName(EnemyParty().Get(i));
		}
		
		Gui.Callstack.push(function() {
			for(let ent of GAME().party.members) {
				// Ressurect fallen
				if(ent.curHp < 1) ent.curHp = 1;
			}
			Gui.PrintDefaultOptions();
		});

		// Start the combat
		this.CombatTick();
	}

	GenerateUniqueName(entity : Entity) {
		this.uniqueID = this.uniqueID || 0;
		this.uniqueID++;
		entity.uniqueName = entity.name+" ["+this.uniqueID+"]";
	}


	GetLiveEnemyArray() {
		let e = new Array();
		for(let ent of this.enemy.members) {
			if(!ent.Incapacitated())
				e.push(ent);
		}
		return e;
	}

	GetDownedEnemyArray() {
		let e = new Array();
		for(let ent of this.enemy.members) {
			if(ent.Incapacitated())
				e.push(ent);
		}
		return e;
	}

	GetLivePartyArray() {
		let p = new Array();
		for(let ent of GAME().party.members) {
			if(!ent.Incapacitated())
				p.push(ent);
		}
		return p;
	}

	GetDownedPartyArray() {
		let p = new Array();
		for(let ent of GAME().party.members) {
			if(ent.Incapacitated())
				p.push(ent);
		}
		return p;
	}

	GetEnemyArray() {
		let e = new Array();
		for(let ent of this.enemy.members)
			e.push(ent);
		return e;
	}

	GetPartyArray() {
		let p = new Array();
		for(let ent of GAME().party.members)
			p.push(ent);
		return p;
	}

	// TODO
	SetButtons(activeChar : any, combatScreen : any) {
		let entity = activeChar.entity;
		let encounter = this;
		
		let BasePrompt = function() {
			Gui.ClearButtons();
			Input.buttons[0].SetFromAbility(encounter, entity, Abilities.Attack, BasePrompt);

			Input.buttons[1].SetFromAbility(encounter, entity, Abilities.Seduction.Tease, BasePrompt);
			
			if(entity.currentJob && entity.currentJob.abilities.Empty() == false)
				Input.buttons[2].SetFromAbility(encounter, entity, entity.currentJob.abilities, BasePrompt);
			if(entity.abilities["Special"].Empty() == false)
				Input.buttons[3].SetFromAbility(encounter, entity, entity.abilities["Special"], BasePrompt);
			if(entity.abilities["Skills"].Empty() == false)
				Input.buttons[4].SetFromAbility(encounter, entity, entity.abilities["Skills"], BasePrompt);
			if(entity.abilities["Spells"].Empty() == false)
				Input.buttons[5].SetFromAbility(encounter, entity, entity.abilities["Spells"], BasePrompt);
			if(entity.abilities["Support"].Empty() == false)
				Input.buttons[6].SetFromAbility(encounter, entity, entity.abilities["Support"], BasePrompt);
			if(entity.abilities["Seduce"].Empty() == false)
				Input.buttons[7].SetFromAbility(encounter, entity, entity.abilities["Seduce"], BasePrompt);
			Input.buttons[8].SetFromAbility(encounter, entity, Abilities.Wait, BasePrompt);
			Input.buttons[9].Setup("Item", function() {
				GAME().party.inventory.CombatInventory(encounter, entity, BasePrompt);
			}, true);
			Input.buttons[10].Setup("Submit", function() {
				encounter.onLoss();
			}, true);		
			Input.buttons[11].SetFromAbility(encounter, entity, Abilities.Run, BasePrompt);
			
			if(GetDEBUG()) {
				Input.navButtons[2].Setup("Cheat", function() {
					encounter.onVictory();
				}, true);
			}
			combatScreen();
		}
		
		BasePrompt();
	}


	Cleanup() {
		for(let ent of this.enemy.members) {
			ent.ClearCombatBonuses();
			ent.combatStatus.EndOfCombat();
			ent.uniqueName = null;
		}
		for(let ent of GAME().party.members) {
			ent.ClearCombatBonuses();
			ent.combatStatus.EndOfCombat();
			ent.uniqueName = null;
		}
		SetCurEncounter(null);
	}

	onRun() {
		this.Cleanup();
		
		// TEMP TODO
		TimeStep({hour: 1});
		
		Gui.NextPrompt(function() {
			SetGameState(GameState.Event, Gui);
			Gui.PrintDefaultOptions();
		});
	}

	// Default loss condition: party is downed
	LossCondition() {
		let downed = true;
		for(let ent of GAME().party.members) {
			if(ent.Incapacitated() == false) downed = false;
		}
		return downed;
	}

	onLoss() {
		Text.Clear();
		Text.Add("Defeat!");
		// TODO: XP loss? 
		
		this.Cleanup();
		
		// TEMP TODO
		TimeStep({hour: 1});
		
		Text.Flush();
		Gui.NextPrompt(function() {
			SetGameState(GameState.Event, Gui);
			Gui.PrintDefaultOptions();
		});
	}

	// Default win condition: enemy party is downed
	VictoryCondition() {
		let downed = true;
		for(let ent of this.enemy.members) {
			if(ent.Incapacitated() == false) downed = false;
		}
		return downed;
	}

	onVictory() {
		Text.Clear();
		Text.Add("Victory!");
		Text.NL();

		let exp = 0, coin = 0;
		for(let i = 0; i < this.enemy.NumTotal(); i++) {
			let e = this.enemy.Get(i);
			exp  += e.combatExp;
			coin += e.coinDrop;
			
			let drops = e.DropTable();
			for(let drop of drops) {
				let it  = drop.it;
				let num = drop.num || 1;
				
				Text.Add("The party finds " + num + "x " + it.name + ".<br>");
				GAME().party.inventory.AddItem(it, num);
			}
		}
		
		Text.Add("The party gains " + exp + " experience and " + coin + " coins.");
		
		for(let ent of GAME().party.members) {
			// Don't give exp to fallen characters
			if(ent.Incapacitated()) continue;
			ent.AddExp(exp);
		}
		// Reward xp to passive characters
		for(let ent of GAME().party.reserve) {
			ent.AddExp(exp * 0.75, true);
		}
		
		// ADD COIN TO PURSE
		GAME().party.coin += coin;
		
		this.Cleanup();
		
		// TEMP TODO
		TimeStep({hour: 1});
		
		Text.Flush();
		Gui.NextPrompt(function() {
			SetGameState(GameState.Event, Gui);
			Gui.PrintDefaultOptions();
		});
	}

	OnIncapacitate(entity : Entity) {
		for(let ent of this.combatOrder){
			let e = ent.entity;
			if(e == entity) {
				// Check for sleep
				if(e.combatStatus.stats[StatusEffect.Sleep] != null) {
					e.combatStatus.stats[StatusEffect.Sleep] = null;
				}
				// Check for confuse
				if(e.combatStatus.stats[StatusEffect.Confuse] != null) {
					e.combatStatus.stats[StatusEffect.Confuse].OnFade(this, e);
				}
				break;
			}
		}
	}

	CombatTick() {
		let enc = this;
		
		let e = enc.Callstack.pop();
		if(e) {
			e(enc);
			return;
		}
		
		SetCurrentActiveChar(null);
		
		if(enc.onTick) {
			enc.onTick();
		}
		
		if(enc.LossCondition()) {
			enc.onLoss();
		}
		else if(enc.VictoryCondition()) {
			enc.onVictory();
		}
		else {
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
			while(!found) {
				_.each(enc.combatOrder, function(c) {
					if(!c.entity.Incapacitated()) {
						if(c.initiative >= 100) {
							found = true;
							return false;
						}
					}
				});
				
				if(found) break;
				
				_.each(enc.combatOrder, function(c) {
					if(!c.entity.Incapacitated())
						c.initiative += c.entity.Initiative();
				});
			}
			
			enc.combatOrder.sort(Encounter.InitiativeSorter);
			let activeChar = enc.combatOrder[0];
			
			SetCurrentActiveChar(activeChar.entity);
			
			let casting = activeChar.casting;
			activeChar.casting = null;
			
			let ini = 100;
			
			// Freeze, slow down character
			let freeze = CurrentActiveChar().combatStatus.stats[StatusEffect.Freeze];
			if(freeze) {
				if(Math.random() < freeze.proc) {
					ini *= freeze.str;
				}
			}
			
			activeChar.initiative -= ini;
			
			// Add lust
			_.each(enc.combatOrder, function(c) {
				if(!c.entity.Incapacitated())
					c.entity.AddLustOverTime(0.02);
			});
			
			// Tick status effects
			CurrentActiveChar().combatStatus.Tick(CurrentActiveChar());
			if(CurrentActiveChar().Incapacitated()) {
				enc.CombatTick();
				return;
			}
			
			// Numb, stun character
			let numb = CurrentActiveChar().combatStatus.stats[StatusEffect.Numb];
			if(numb) {
				if(Math.random() < numb.proc) {
					Text.Add("[name] [is] stunned and cannot move!",
						{name: CurrentActiveChar().NameDesc(), is: CurrentActiveChar().is()});
					Text.Flush();
					Gui.NextPrompt(function() {
						enc.CombatTick();
					});
					return;
				}
			}
			
			// Sleep
			let sleep = CurrentActiveChar().combatStatus.stats[StatusEffect.Sleep];
			if(sleep) {
				Text.Add("[name] [is] asleep and cannot act!",
					{name: CurrentActiveChar().NameDesc(), is: CurrentActiveChar().is()});
				Text.Flush();
				Gui.NextPrompt(function() {
					enc.CombatTick();
				});
				return;
			}

			let combatScreen = function() {
				Text.Clear();
				// TODO: DEBUG ?
				let entityName = CurrentActiveChar().uniqueName ? CurrentActiveChar().uniqueName : CurrentActiveChar().name;
				Text.Add("Turn order:<br>", null, 'bold');
				Text.Add(entityName + "<br>", null, 'bold');
				
				let tempParty : any[] = [];
				_.each(enc.combatOrder, function(c) {
					if(!c.entity.Incapacitated()) {
						entityName = c.entity.uniqueName ? c.entity.uniqueName : c.entity.name;
						tempParty.push({entry: c, name: entityName, ini: c.initiative, inc: c.entity.Initiative()});
					}
				});
				
				_.times(8, function() {
					let found : any = null;
					while(!found) {
						_.each(tempParty, function(c) {
							if(c.ini >= 100) {
								found = c;
								return false;
							}
						});					
						if(found) break;
						_.each(tempParty, function(c) {
							c.ini += c.inc;
						});
					}
					
					found.ini -= 100; //TODO cast time for predict
					let tempCasting = found.entry.casting ? " (casting...)" : "";
					Text.Add(found.name + tempCasting + "<br>");
				});
				Text.NL();
				
				if(activeChar.entity == GAME().player)
					Text.Add("It's your turn.");
				else
					Text.Add(activeChar.entity.Possessive() + " turn.");
				Text.NL();
				Text.Flush();
			}
			
			combatScreen();

			if(casting) {
				let ability = casting.ability;
				ability.CastInternal(enc, activeChar.entity, casting.target);
			}
			else {
				// Reduce cooldowns
				if(activeChar.cooldown) {
					_.each(activeChar.cooldown, function(c) {
						c.cooldown--;
					});
					activeChar.cooldown = _.filter(activeChar.cooldown, function(c) {
						return c.cooldown > 0;
					});
				}
				
				if(Math.random() < activeChar.entity.LustCombatTurnLossChance()) {
				Text.Add("[name] is too aroused to do anything worthwhile!", {name: activeChar.entity.name});
					Text.Flush();
					Gui.NextPrompt(function() {
						enc.CombatTick();
					});
				}
				else {
					// TODO: Confuse? Is this correctly implemented?
					if(activeChar.isEnemy) {
						activeChar.entity.Act(enc, activeChar);
					}
					else {
						// Confuse
						let confuse = CurrentActiveChar().combatStatus.stats[StatusEffect.Confuse];
						if(confuse) {
							if(confuse.func)
								confuse.func(enc, activeChar);
							else
								activeChar.entity.Act(enc, activeChar);
						}
						else
							enc.SetButtons(activeChar, combatScreen);
					}
					Text.Flush();
				}
			}
		}
	}

}
