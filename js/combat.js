
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
}

Encounter.prototype.Start = function() {
	SetGameState(GameState.Event);
	
	if(this.onEncounter)
		this.onEncounter();
	else
		this.PrepCombat();
}

var enemyParty = null;
var currentActiveChar = null;

// Set up the fight
Encounter.prototype.PrepCombat = function() {
	SetGameState(GameState.Combat);
	
	if(party.members.length == 0)
		throw "Errol: no members in party";
	if(this.enemy.members.length == 0)
		throw "Errol: no enemy to fight";
		
	// Set up combat order
	for(var i = 0; i < party.members.length; i++)
		this.combatOrder.push({
			entity: party.members[i],
			isEnemy: false});
	for(var i = 0; i < this.enemy.members.length; i++)
		this.combatOrder.push({
			entity: this.enemy.members[i], 
			isEnemy: true});
			
	for(var i = 0; i < this.combatOrder.length; i++) {
		this.combatOrder[i].initiative   = Math.random() * 5;
		// Fill aggro table
		if(this.combatOrder[i].isEnemy) {
			this.combatOrder[i].aggro = [];
			this.combatOrder[i].entity.GetSingleTarget(this, this.combatOrder[i]);
		}
	}

	enemyParty = this.enemy;

	Gui.Callstack.push(function() {
		for(var i = 0; i < party.members.length; i++) {
			var e = party.members[i];
			// Ressurect fallen
			if(e.curHp < 1) e.curHp = 1;
			if(e.curSp < 1) e.curSp = 1;
		}
		PrintDefaultOptions();
	});

	// Start the combat
	this.CombatTick();
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
		Input.buttons[8].Setup("Submit", function() {
			encounter.onLoss();
		}, true);
		Input.buttons[9].Setup("Item", function() {
			party.inventory.CombatInventory(encounter, entity, BasePrompt);
		}, true);
		
		Input.buttons[10].SetFromAbility(encounter, entity, Abilities.Wait, BasePrompt);
		Input.buttons[11].SetFromAbility(encounter, entity, Abilities.Run, BasePrompt);
		
		combatScreen();
	}
	
	BasePrompt();
}


Encounter.prototype.Cleanup = function() {
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
}

Encounter.prototype.onRun = function() {
	this.Cleanup();
	
	// TEMP TODO
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt(function() {
		SetGameState(GameState.Game);
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
	Text.AddOutput("Defeat!");
	// TODO: XP loss? 
	
	this.Cleanup();
	
	// TEMP TODO
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt(function() {
		SetGameState(GameState.Game);
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
	Text.AddOutput("Victory!");
	Text.Newline();

	var exp = 0, coin = 0;
	for(var i = 0; i < this.enemy.members.length; i++) {
		var e = this.enemy.members[i];
		exp  += e.combatExp;
		coin += e.coinDrop;
		
		var drops = e.DropTable();
		for(var j = 0; j < drops.length; j++) {
			var it  = drops[j].it;
			var num = drops[j].num || 1;
			
			Text.AddOutput("The party finds " + num + "x " + it.name + ".<br/>");
			party.inventory.AddItem(it, num);
		}
	}
	
	Text.AddOutput("The party gains " + exp + " experience and " + coin + " coins.");
	
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
	
	Gui.NextPrompt(function() {
		SetGameState(GameState.Game);
		PrintDefaultOptions();
	});
}

Encounter.prototype.CombatTick = function() {
	currentActiveChar = null;
	var enc = this;
	
	if(enc.onTick)
		enc.onTick();
	
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
			for(var i=0,j=enc.combatOrder.length; i<j; i++) {
				var c = enc.combatOrder[i];
				
				if(!c.entity.Incapacitated()) {
					if(c.initiative >= 100) {
						found = true;
						break;
					}
				}
			}
			
			if(found) break;
			
			for(var i=0,j=enc.combatOrder.length; i<j; i++) {
				var c = enc.combatOrder[i];
				
				if(!c.entity.Incapacitated())
					c.initiative += c.entity.Initiative();
			}
		}
		
		enc.combatOrder.sort(Encounter.InitiativeSorter);
		var activeChar = enc.combatOrder[0];
		
		currentActiveChar = activeChar.entity;
		
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
		for(var i=0,j=enc.combatOrder.length; i<j; i++){
			var c = enc.combatOrder[i];
			if(!c.entity.Incapacitated())
				c.entity.AddLustOverTime(0.02);
		};
		
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
				Text.AddOutput("[name] [is] stunned and cannot move!",
					{name: currentActiveChar.NameDesc(), is: currentActiveChar.is()});
				Gui.NextPrompt(function() {
					enc.CombatTick();
				});
				return;
			}
		}

		var combatScreen = function() {
			Text.Clear();
			// TODO: DEBUG ?
			Text.AddOutput(Text.BoldColor("Turn order:<br/>"));
			Text.AddOutput(Text.BoldColor(currentActiveChar.name + "<br/>"));
			var tempParty = [];
			for(var i=0,j=enc.combatOrder.length; i<j; i++){
				var c = enc.combatOrder[i];
				if(!c.entity.Incapacitated()) {
					tempParty.push({name: c.entity.name, ini: c.initiative, inc: c.entity.Initiative()});
				}
			};
			
			for(var t = 0; t < 8; t++) {
				var found = null;
				while(!found) {
					for(var i=0,j=tempParty.length; i<j; i++) {
						var c = tempParty[i];
						if(c.ini >= 100) {
							found = c;
							break;
						}
					}
					if(found) break;
					for(var i=0,j=tempParty.length; i<j; i++) {
						var c = tempParty[i];
						c.ini += c.inc;
					}
				}
				
				found.ini -= 100;
				Text.AddOutput(found.name + "<br/>");
			}
			Text.Newline();
			
			if(activeChar.entity == player)
				Text.AddOutput("It's your turn.");
			else
				Text.AddOutput(activeChar.entity.Possessive() + " turn.");
			Text.Newline();
		}
		
		combatScreen();

		if(Math.random() < activeChar.entity.LustCombatTurnLossChance()) {
			Text.AddOutput("[name] is too aroused to do anything worthwhile!", {name: activeChar.entity.name});
			Gui.NextPrompt(function() {
				enc.CombatTick();
			});
		}
		else {
			if(activeChar.isEnemy) {
				activeChar.entity.Act(enc, activeChar);
			}
			else {
				// TODO: if in control
				
				enc.SetButtons(activeChar, combatScreen);
			}
		}
	}
}
