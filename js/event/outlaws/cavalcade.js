import { Scenes } from '../../event';

Scenes.OutlawsCavalcade = {};

Scenes.OutlawsCavalcade.Bet = function() {
	return 10; //TODO
}
Scenes.OutlawsCavalcade.Enabled = function() {
	return world.time.hour < 4 || world.time.hour >= 14;
}

Scenes.OutlawsCavalcade.PrepRandomCoinGame = function() {
	var onEnd = function() {
		var parse = {
			playername : player.name
		};
		
		SetGameState(GameState.Event);
		
		world.TimeStep({minute: 5});
		
		Text.NL();
		if(Scenes.OutlawsCavalcade.Enabled()) {
			Text.Add("<i>“Do you want to go for another game, [playername]?”</i>", parse);
			Text.Flush();
			
			//[Sure][Nah]
			var options = new Array();
			options.push({ nameStr : "Sure",
				func : function() {
					Text.NL();
					Scenes.OutlawsCavalcade.PrepRandomCoinGame();
				}, enabled : party.coin >= Scenes.OutlawsCavalcade.Bet(),
				tooltip : "Deal another round!"
			});
			options.push({ nameStr : "Nah",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Alright, see you around!”</i> You leave the group, another outlaw soon taking your place.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "Nah, this is enough Cavalcade for now."
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else {
			Text.Add("<i>“It’s getting late, how about we break this up?”</i> the lizan yawns, gathering up the cards. <i>“If you want another game later, just holler.”</i>", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}
	}
	
	player.purse  = party;
	var players = [player];
	
	for(var i = 0; i < 3; i++) {
		var ent = new Entity();
		
		ent.name = "Outlaw";
		ent.purse = { coin: 100 };
		if(Math.random() < 0.5)
			ent.body.DefMale();
		else
			ent.body.DefFemale();
		
		players.push(ent);
	}
	
	var g = new Cavalcade(players, {bet    : Scenes.OutlawsCavalcade.Bet(),
		                            onPost : onEnd});
	g.PrepGame();
	g.NextRound();
}
