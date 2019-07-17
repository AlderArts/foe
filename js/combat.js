
// Create encounter with a Party() containing enemies
function Encounter(enemy)
{
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

Encounter.prototype.RunLevel = function() {
	return this.enemy.Get(0).level;
}

Encounter.prototype.Start = function() {
	SetGameState(GameState.Event);
	
	if(this.onEncounter)
		this.onEncounter();
	else
		this.PrepCombat();
}

var curEncounter      = null;
var enemyParty        = null;
var currentActiveChar = null;

// Set up the fight
Encounter.prototype.PrepCombat = function() {
	SetGameState(GameState.Combat);
	
	curEncounter = this;
	
	if(party.members.length == 0)
		throw "Errol: no members in party";
	if(this.enemy.members.length == 0)
		throw "Errol: no enemy to fight";
		
	// Set up combat order
	for(var i = 0; i < party.members.length; i++)
		this.combatOrder.push({
			entity  : party.members[i],
			isEnemy : false});
	for(var i = 0; i < this.enemy.members.length; i++)
		this.combatOrder.push({
			entity  : this.enemy.members[i], 
			isEnemy : true,
			aggro   : []});
			
	for(var i = 0; i < this.combatOrder.length; i++) {
		this.combatOrder[i].initiative   = Math.random() * 5;
		// Fill aggro table
		if(this.combatOrder[i].isEnemy) {
			this.combatOrder[i].entity.GetSingleTarget(this, this.combatOrder[i]);
		}
	}

	enemyParty = this.enemy;
	//Add a unique name property to each enemy entity
	for(var i=0; i < enemyParty.NumTotal(); i++) {
		this.GenerateUniqueName(enemyParty.Get(i));
	}
	
	Gui.Callstack.push(function() {
		for(var i = 0; i < party.members.length; i++) {
			var e = party.members[i];
			// Ressurect fallen
			if(e.curHp < 1) e.curHp = 1;
		}
		PrintDefaultOptions();
	});

	// Start the combat
	this.CombatTick();
}

Encounter.prototype.GenerateUniqueName = function(entity) {
	this.uniqueID = this.uniqueID || 0;
	this.uniqueID++;
	entity.uniqueName = entity.name+" ["+this.uniqueID+"]";
}

Encounter.InitiativeSorter = function(a, b) {
	if(a.entity.Incapacitated() && b.entity.Incapacitated()) return 0;
	if(b.entity.Incapacitated()) return -1;
	if(a.entity.Incapacitated()) return 1;
	return (a.initiative > b.initiative) ? -1 : 1;
}

Encounter.prototype.GetLiveEnemyArray = function() {
	var e = new Array();
	for(var i = 0; i < this.enemy.members.length; i++) {
		var c = this.enemy.members[i];
		if(!c.Incapacitated())
			e.push(c);
	}
	return e;
}

Encounter.prototype.GetDownedEnemyArray = function() {
	var e = new Array();
	for(var i = 0; i < this.enemy.members.length; i++) {
		var c = this.enemy.members[i];
		if(c.Incapacitated())
			e.push(c);
	}
	return e;
}

Encounter.prototype.GetLivePartyArray = function() {
	var p = new Array();
	for(var i = 0; i < party.members.length; i++) {
		var c = party.members[i];
		if(!c.Incapacitated())
			p.push(c);
	}
	return p;
}

Encounter.prototype.GetDownedPartyArray = function() {
	var p = new Array();
	for(var i = 0; i < party.members.length; i++) {
		var c = party.members[i];
		if(c.Incapacitated())
			p.push(c);
	}
	return p;
}

Encounter.prototype.GetEnemyArray = function() {
	var e = new Array();
	for(var i = 0; i < this.enemy.members.length; i++)
		e.push(this.enemy.members[i]);
	return e;
}

Encounter.prototype.GetPartyArray = function() {
	var p = new Array();
	for(var i = 0; i < party.members.length; i++)
		p.push(party.members[i]);
	return p;
}

// TODO
Encounter.prototype.SetButtons = function(activeChar, combatScreen) {
	var entity = activeChar.entity;
	var encounter = this;
	
	var BasePrompt = function() {
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
			party.inventory.CombatInventory(encounter, entity, BasePrompt);
		}, true);
		Input.buttons[10].Setup("Submit", function() {
			encounter.onLoss();
		}, true);		
		Input.buttons[11].SetFromAbility(encounter, entity, Abilities.Run, BasePrompt);
		
		if(DEBUG) {
			Input.navButtons[2].Setup("Cheat", function() {
				encounter.onVictory();
			}, true);
		}
		combatScreen();
	}
	
	BasePrompt();
}


Encounter.prototype.Cleanup = function() {
	for(var i = 0; i < this.enemy.members.length; i++) {
		var e = this.enemy.members[i];
		e.ClearCombatBonuses();
		e.combatStatus.EndOfCombat();
		e.uniqueName = null;
	}
	for(var i = 0; i < party.members.length; i++) {
		var e = party.members[i];
		e.ClearCombatBonuses();
		e.combatStatus.EndOfCombat();
		e.uniqueName = null;
	}
	curEncounter = null;
}

Encounter.prototype.onRun = function() {
	this.Cleanup();
	
	// TEMP TODO
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt(function() {
		SetGameState(GameState.Event);
		PrintDefaultOptions();
	});
}

// Default loss condition: party is downed
Encounter.prototype.LossCondition = function() {
	var downed = true;
	for(var i = 0; i < party.members.length; i++) {
		var e = party.members[i];
		if(e.Incapacitated() == false) downed = false;
	}
	return downed;
}

Encounter.prototype.onLoss = function() {
	Text.Clear();
	Text.Add("Defeat!");
	// TODO: XP loss? 
	
	this.Cleanup();
	
	// TEMP TODO
	world.TimeStep({hour: 1});
	
	Text.Flush();
	Gui.NextPrompt(function() {
		SetGameState(GameState.Event);
		PrintDefaultOptions();
	});
}

// Default win condition: enemy party is downed
Encounter.prototype.VictoryCondition = function() {
	var downed = true;
	for(var i = 0; i < this.enemy.members.length; i++) {
		var e = this.enemy.members[i];
		if(e.Incapacitated() == false) downed = false;
	}
	return downed;
}

Encounter.prototype.onVictory = function() {
	Text.Clear();
	Text.Add("Victory!");
	Text.NL();

	var exp = 0, coin = 0;
	for(var i = 0; i < this.enemy.NumTotal(); i++) {
		var e = this.enemy.Get(i);
		exp  += e.combatExp;
		coin += e.coinDrop;
		
		var drops = e.DropTable();
		for(var j = 0; j < drops.length; j++) {
			var it  = drops[j].it;
			var num = drops[j].num || 1;
			
			Text.Add("The party finds " + num + "x " + it.name + ".<br>");
			party.inventory.AddItem(it, num);
		}
	}
	
	Text.Add("The party gains " + exp + " experience and " + coin + " coins.");
	
	for(var i = 0; i < party.members.length; i++) {
		var e = party.members[i];
		// Don't give exp to fallen characters
		if(e.Incapacitated()) continue;
		e.AddExp(exp);
	}
	// Reward xp to passive characters
	for(var i = 0; i < party.reserve.length; i++) {
		var e = party.reserve[i];
		e.AddExp(exp * 0.75, true);
	}
	
	// ADD COIN TO PURSE
	party.coin += coin;
	
	this.Cleanup();
	
	// TEMP TODO
	world.TimeStep({hour: 1});
	
	Text.Flush();
	Gui.NextPrompt(function() {
		SetGameState(GameState.Event);
		PrintDefaultOptions();
	});
}

Encounter.prototype.OnIncapacitate = function(entity) {
	for(var i=0,j=this.combatOrder.length; i<j; i++){
		var e = this.combatOrder[i].entity;
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

Encounter.prototype.CombatTick = function() {
	var enc = this;
	
	var e = enc.Callstack.pop();
	if(e) {
		e(enc);
		return;
	}
	
	currentActiveChar = null;
	
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
		var maxIni = 1;
		// Sort the list after initiative
		for(var i=0,j=this.combatOrder.length; i<j; i++){
			var c = this.combatOrder[i];
			
			if(!c.entity.Incapacitated()) {
				var ini = c.entity.Initiative();
				c.initiative += ini;
				if(maxIni < ini) maxIni = ini;
			}
		}
		*/
		
		var found = false;
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
		var activeChar = enc.combatOrder[0];
		
		currentActiveChar = activeChar.entity;
		
		var casting = activeChar.casting;
		activeChar.casting = null;
		
		var ini = 100;
		
		// Freeze, slow down character
		var freeze = currentActiveChar.combatStatus.stats[StatusEffect.Freeze];
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
		currentActiveChar.combatStatus.Tick(currentActiveChar);
		if(currentActiveChar.Incapacitated()) {
			enc.CombatTick();
			return;
		}
		
		// Numb, stun character
		var numb = currentActiveChar.combatStatus.stats[StatusEffect.Numb];
		if(numb) {
			if(Math.random() < numb.proc) {
				Text.Add("[name] [is] stunned and cannot move!",
					{name: currentActiveChar.NameDesc(), is: currentActiveChar.is()});
				Text.Flush();
				Gui.NextPrompt(function() {
					enc.CombatTick();
				});
				return;
			}
		}
		
		// Sleep
		var sleep = currentActiveChar.combatStatus.stats[StatusEffect.Sleep];
		if(sleep) {
			Text.Add("[name] [is] asleep and cannot act!",
				{name: currentActiveChar.NameDesc(), is: currentActiveChar.is()});
			Text.Flush();
			Gui.NextPrompt(function() {
				enc.CombatTick();
			});
			return;
		}

		var combatScreen = function() {
			Text.Clear();
			// TODO: DEBUG ?
			var entityName = currentActiveChar.uniqueName ? currentActiveChar.uniqueName : currentActiveChar.name;
			Text.Add("Turn order:<br>", null, 'bold');
			Text.Add(entityName + "<br>", null, 'bold');
			
			var tempParty = [];
			_.each(enc.combatOrder, function(c) {
				if(!c.entity.Incapacitated()) {
					entityName = c.entity.uniqueName ? c.entity.uniqueName : c.entity.name;
					tempParty.push({entry: c, name: entityName, ini: c.initiative, inc: c.entity.Initiative()});
				}
			});
			
			_.times(8, function() {
				var found = null;
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
				var tempCasting = found.entry.casting ? " (casting...)" : "";
				Text.Add(found.name + tempCasting + "<br>");
			});
			Text.NL();
			
			if(activeChar.entity == player)
				Text.Add("It's your turn.");
			else
				Text.Add(activeChar.entity.Possessive() + " turn.");
			Text.NL();
			Text.Flush();
		}
		
		combatScreen();

		if(casting) {
			var ability = casting.ability;
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
					var confuse = currentActiveChar.combatStatus.stats[StatusEffect.Confuse];
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

export { Encounter };
