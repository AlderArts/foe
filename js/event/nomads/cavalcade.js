/*
 * Specifics for Cavalcade game with Rosalin, Estevan and Cale
 */

Scenes.NomadsCavalcade = {};

Scenes.NomadsCavalcade.Bet = function() {
	return 5;
}

Scenes.NomadsCavalcade.Enabled = function() {
	return cale.IsAtLocation() &&
	       estevan.flags["Met"] != 0 &&
	       estevan.IsAtLocation() &&
	       rosalin.IsAtLocation();
}

// TODO TEMP CAVALCADE
world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	"Cavalcade", function() { return Scenes.NomadsCavalcade.Enabled(); }, function() { return party.coin >= Scenes.NomadsCavalcade.Bet(); },
	function() {
		if(Scenes.NomadsCavalcade.Enabled()) {
			Text.Add("Both Rosalin, Cale and Estevan seem to be around. Perhaps they are up for a game of Cavalcade?");
			if(estevan.flags["Cheat"] == Estevan.Cheat.Setup)
				Text.Add(" You remind yourself that you’ve rigged this coming game together with Estevan in order to play a prank on Cale.");
			Text.NL();
			Text.Flush();
		}
	},
	function() {
		/* Old explanation
		Text.Add(Text.BoldColor("PLACEHOLDER TEXT"));
		Text.NL();
		Text.Add("You start up a game of Cavalcade with Rosalin and Wolfie.");
		Text.NL();
		Text.Add("The game works similarily to Texas Hold'Em, but with fewer cards.");
		Text.NL();
		Text.Add("There is a total of three suits: Light, Shadow and Darkness. Each suit contains five named cards numbered from 1 to 5. The <b>lower</b> the number, the <b>better</b> the card is. In other words, there is a total of 15 cards to a deck.");
		Text.NL();
		Text.Add("There are three players to a game. Each player gets two cards, and the house gets three cards, placed down face. Each round of betting, the house reveals another card. The person with the best hand of five cards win. Each round of betting, you may call, raise the bet or fold your hand.");
		Text.NL();
		Text.Add("The hands, in increasing order of value, are as follows: pair, two pairs, three of a kind, mixed Cavalcade (the cards 1 through 5, different suits), full house, partial flush (four cards of the same suit), four of a kind (requires the joker), and full Cavalcade (the cards 1 through 5 of a single suit).");
		Text.NL();
		Text.Add("4 of Shadow, the Shadow Stag, is considered a joker, and can become anything to improve your hand. If the house draws the Stag, the card is discarded and a new one is drawn from the deck, to prevent draws.");
		Text.NL();
		Text.Add("The game is currently very new, so no one plays it very well yet, and you may find your opponents kind of dull-witted.");
		Text.NL();
		Text.Add("The game can currently be abused for cash, since debug mode allows you to see the down-face cards as well.");
		Text.NL();
		Text.Add(Text.BoldColor("END PLACEHOLDER TEXT"));
		Text.NL();
		
		var players = [player, rosalin, cale];
		var g = new Cavalcade(players, {bet: 5});
		g.PrepGame();
		*/
		
		Text.Clear();
		Text.Add("You round up the mismatched trio and ask them if they are up for a game of Cavalcade.");
		Text.NL();
		if(estevan.flags["Cheat"] == Estevan.Cheat.Setup)
			Scenes.NomadsCavalcade.CheatGame();
		else
			Scenes.NomadsCavalcade.RegularGame();
	}
));

Scenes.NomadsCavalcade.RegularGame = function() {
	var parse = {
		playername : player.name,
		hisher     : rosalin.hisher()
	};
	
	if(estevan.flags["cav"] == 0) {
		estevan.flags["cav"] = 1;
		Text.Add("<i>“Alright, I’m gonna assume this is the first time you are playing this game, [playername],”</i> Estevan says as he pulls out a deck of old cards. He expertly shuffles and flares the deck, showing you the cards. <i>“There are fifteen cards split up into three different suits; Light, Darkness and Shadow.”</i>", parse);
		Text.NL();
		Text.Add("You see that each card has a small picture on it, and a color that indicates its suit. In the corner, you see a number on each card, and you ask the satyr what it means. <i>“Just in case you are like wolfie and have a hard time keeping track of all the cards and how many points your hand is worth, you can use these numbers,”</i> he explains. <i>“The best card of each suit is number one, going down to number five in decreasing value.”</i> Cale growls at the cheap jab, but lets the satyr continuetinue his explanation of the game.", parse);
		Text.NL();
		Text.Add("<i>“You get two cards in your hand. I then place three cards face down, like this,”</i> he explains, handing out two cards to you, Rosalin and Cale each, and placing another three in front of him. <i>“You each place your bets - we usually play for small coins, more for the enjoyment of the game really - and you either call, raise or fold. Each turn of betting, I reveal another card of the house hand.”</i> Saying so, he flips the hidden cards one by one.", parse);
		Text.NL();
		Text.Add("You glance at your hand; one of your cards has the number one on it, and depicts a beautiful lady with blonde hair, wearing a crown and a blue gown - possibly a depiction of Lady Aria. The other one has the number four, and depicts a stag.", parse);
		Text.NL();
		Text.Add("The cards on the ground show a sultry lady with lilac hair and impressive assets, a maiden in white and a strange creature made out of pure energy. <i>“The Harlot of Darkness, D5. The Maiden of Light, L5. The Avatar of Shadow, S1.”</i> For some reason, the last card gives you an unsettling feeling.", parse);
		Text.NL();
		Text.Add("<i>“The name of the game is to have the best hand, and make the most out of it. It’s a game of bluffing, really, but for now lets see your hands so I can explain the scoring.”</i>", parse);
		Text.NL();
		Text.Add("Rosalin and Cale show their cards - Rosalin has three of Shadow (an old man) and two of Light (a knight of some sort), Cale’s got one of Darkness (a red haired queen) and four of Light (a white horse).", parse);
		Text.NL();
		Text.Add("<i>“Rosie’s got nothing of value, so [hisher] hand defaults to the pair of five in the house deck. Not likely to win you anything, as it’s the worst possible hand you can get. Wolfie has more luck, since his Queen of Darkness gives him two pairs.”</i>", parse);
		Text.NL();
		Text.Add("You look at your hand again. If you understand the rules correctly, you have exactly the same hand. <i>“Correct, you both have two pairs of one and five, and a four. Usually, this’d be a draw, but you have a special card, [playername]. The four of Shadow - the Shadow Stag - works as a wildcard. It can morph and take on the shape of any card, in almost all cases giving you a huge advantage.”</i> Estevan puts your cards next to the house hand.", parse);
		Text.NL();
		Text.Add("<i>“In this case, you’d get a threekind of one and the pair of five, giving you a full house and winning you the game.”</i>", parse);
		Text.NL();
		Text.Add("<i>“The scoring is as follows: least is the pair, after that comes two pairs, then threekind, followed by the mixed Cavalcade. That last one is when you have the cards one through five of any suits. Then comes full house - your hand - followed by a mixed flush. This is when you have four cards of the same suit. Next is fourkind - a hand only possibly with the stag - and lastly full Cavalcade, which is when you have all the cards of one suit.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Finally, a hand with the stag is not necessarily a win. If I have a hand that evaluates to a threekind, and you have a pair plus the stag, I will win the hand even if your threekind happens to be better than mine. The Shadow Stag can take on many forms, but is thus weaker than a pure hand.”</i>", parse);
		Text.NL();
		Text.Add("<i>“That’s about it for the rules. The game itself is pretty simple, you just got to be able to quickly evaluate your hand and figure out if it’s worth betting on. Everyone ready?”</i> You all nod.", parse);
	}
	else {
		Text.Add("<i>“Sure, I’m up for it!”</i> Cale rubs his hands together eagerly. Rosalin nods, settling down beside you on the log. Estevan pulls out the deck, shuffling it a few times.", parse);
	}
	Text.NL();
	
	// TODO: Other triggers?
	if(estevan.flags["Cheat"] >= Estevan.Cheat.Talked) {
		Text.Add("<i>“So, what are the stakes?”</i> the satyr asks innocently.", parse);
		Text.Flush();
		
		//[Coin game][Sexy game]
		var options = new Array();
		options.push({ nameStr : "Coin game",
			func : function() {
				Text.Clear();
				Scenes.NomadsCavalcade.PrepCoinGame();
			}, enabled : party.coin >= Scenes.NomadsCavalcade.Bet(),
			tooltip : "Play for coins."
		});
		options.push({ nameStr : "Sexy game",
			func : function() {
				Text.Clear();
				Scenes.NomadsCavalcade.PrepSexyGame();
			}, enabled : true,
			tooltip : "Play for sex."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“Here we go then!”</i> the satyr says as he starts dealing out cards.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Scenes.NomadsCavalcade.PrepCoinGame();
		});
	}
}

Scenes.NomadsCavalcade.PrepCoinGame = function() {
	var onEnd = function() {
		var parse = {
			playername : player.name
		};
		
		SetGameState(GameState.Event);
		
		world.TimeStep({minute: 5});
		
		Text.NL();
		if(Scenes.NomadsCavalcade.Enabled()) {
			Text.Add("<i>“Do you want to go for another game, [playername]?”</i> the satyr asks, shuffling the deck.", parse);
			Text.Flush();
			
			//[Sure][Nah]
			var options = new Array();
			options.push({ nameStr : "Sure",
				func : function() {
					Text.NL();
					Scenes.NomadsCavalcade.PrepCoinGame();
				}, enabled : party.coin >= Scenes.NomadsCavalcade.Bet(),
				tooltip : "Deal another round!"
			});
			options.push({ nameStr : "Nah",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Alright, see you around!”</i> Your group disperses, each person going about their own business.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "Nah, this is enough Cavalcade for now."
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else {
			Text.Add("<i>“It’s getting late, I need to get some sleep if I’m gonna be on time to check my traps tomorrow morning,”</i> Estevan yawns, gathering up the cards. <i>“If you want another game later, just holler.”</i>", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}
	}
	
	player.purse  = party;
	estevan.purse = { coin: 100 };
	cale.purse    = { coin: 100 };
	rosalin.purse = { coin: 100 };
	
	var players = [player, estevan, rosalin, cale];
	var g = new Cavalcade(players, {bet    : Scenes.NomadsCavalcade.Bet(),
		                            onPost : onEnd});
	g.PrepGame();
	g.NextRound();
}

Scenes.NomadsCavalcade.PlayersLeft = function(players) {
	var num = 0;
	for(var i = 0; i < players.length; i++)
		if(!players[i].out)
			num++;
	return num;
}

Scenes.NomadsCavalcade.PrepSexyGame = function() {
	var token = 50;
	
	var parse = {
		playername : player.name,
		coin : Text.NumToText(token)
	};
	
	player.purse  = { coin: token };
	estevan.purse = { coin: token };
	cale.purse    = { coin: token };
	rosalin.purse = { coin: token };
	
	var players = [player, estevan, rosalin, cale];
	
	var onEnd = function() {
		Text.NL();
		world.TimeStep({minute: 5});
		
		var onLoss = function() {
			if(Scenes.NomadsCavalcade.PlayersLeft(players) <= 1)
				onEnd();
			else {
				Text.Add("The satyr starts dealing out cards to the remaining players.", parse);
				Text.NL();
				
				var name;
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					name = estevan.name;
					cale.out    = true;
					rosalin.out = true;
				}, estevan.purse.coin*1.2, function() { return !estevan.out; });
				scenes.AddEnc(function() {
					name = rosalin.name;
					cale.out    = true;
					estevan.out = true;
				}, rosalin.purse.coin*1.1, function() { return !rosalin.out; });
				scenes.AddEnc(function() {
					name = cale.name;
					estevan.out = true;
					rosalin.out = true;
				}, cale.purse.coin, function() { return !cale.out; });
				scenes.Get();
				
				parse["name"] = name;
				world.TimeStep({minute: 15});
				Text.Add("The game goes on for a while longer, eventually ending up with [name] as the winner.", parse);
				
				onEnd();
			}
		}
		
		for(var i = 0; i < players.length; i++) {
			var p = players[i];
			if(p.out) continue;
			
			// Remove bankrupt players
			if(p.purse.coin <= 0) {
				if(p == player) {
					Text.Add("Looks like you lose this game, as you’re out of tokens.", parse);
					Text.NL();
					Text.Add("<i>“Better luck next time!”</i> Cale says, giving you a cocky grin.", parse);
				}
				else if(p == estevan) {
					Text.Add("<i>“Well, looks like that’s it for me,”</i> Estevan says, shrugging.", parse);
				}
				else if(p == rosalin) {
					Text.Add("<i>“Chucks, I’m out of coin-thingies!”</i> Rosalin mutters, pouting.", parse);
				}
				else if(p == cale) {
					Text.Add("<i>“Fuck!”</i> Cale groans as he realises that he’s out of tokens. <i>“I’ll get you next time!”</i>", parse);
				}
				else {
					parse["name"] = p.name;
					Text.Add("THIS IS A BUG. NAME IS: [name]", parse);
				}
				p.out = true;
				Text.NL();
			}
		}
		
		if(Scenes.NomadsCavalcade.PlayersLeft(players) <= 1) {
			var next = null;
			if     (!player.out)  next = Scenes.NomadsCavalcade.SexyPlayerWin;
			else if(!estevan.out) next = Scenes.NomadsCavalcade.SexyEstevanWin;
			else if(!rosalin.out) next = Scenes.NomadsCavalcade.SexyRosalinWin;
			else if(!cale.out)    next = Scenes.NomadsCavalcade.SexyCaleWin;
			else {
				Text.Add("THIS IS A BUG. WINNER IS BROKEN.", parse);
			}
			
			Text.Flush();
			Gui.NextPrompt(function() {
				next(false); // TODO CHEAT
			});
		}
		else if(player.out) {
			onLoss();
		}
		else {
			Text.Add("<i>“Another round then?”</i> Estevan asks.", parse);
			Text.Flush();
			Gui.ClearButtons();
			Input.buttons[0].Setup("Next", function() {
				Text.Clear();
				var bet = Scenes.NomadsCavalcade.Bet() * (5 - Scenes.NomadsCavalcade.PlayersLeft(players));
				var g = new Cavalcade(players, {bet    : bet,
					                            token  : "token",
				                                onPost : onEnd});
				g.PrepGame(true);
				g.NextRound();
			}, true);
			if(DEBUG) {
				Input.buttons[4].Setup("CHEAT", function() {
					Scenes.NomadsCavalcade.SexyPlayerWin(false);
				}, true);
			}
			Input.buttons[8].Setup("Give up", function() {
				player.out = true;
				Text.Clear();
				Text.Add("<i>“Had enough?”</i> Estevan quips. <i>“That counts as an automatic loss, by the way.”</i>", parse);
				Text.NL();
				
				onLoss();
			}, true);
		}
	}
	
	if(estevan.flags["cav"] < 2) {
		Text.Add("<i>“I sure am!”</i> Cale rubs his hands together, eagerly.", parse);
		Text.NL();
		Text.Add("Actually, how about you try something different? Cale raises his eyebrows as you explain the premise of the faux game. <i>“So the winner gets to ask a favor of one of the losers? Sounds interesting.”</i> That’s not all of it. You continue to explain the sexual nature of the favors you had in mind. A slow grin spreads across the wolf’s face.", parse);
		Text.NL();
		Text.Add("<i>“Damn [playername], you got a dirty mind. You up for this, Rosie?”</i> The alchemist nods happily, apparently unperturbed by the nature of the bet.", parse);
		Text.NL();
		estevan.flags["cav"] = 2;
	}
	Text.Add("<i>“Okay. Well play a set of games using these tokens,”</i> Estevan says, handing out the fake coins, [coin] each. <i>“The starting bet goes up each time someone drops out. Last one standing is the winner, and they get to do whatever they want with any one of the losers.”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		
		var g = new Cavalcade(players, {bet    : Scenes.NomadsCavalcade.Bet(),
			                            token  : "token",
		                                onPost : onEnd});
		g.PrepGame();
		g.NextRound();
	});
}

Scenes.NomadsCavalcade.CheatGame = function() {
	var cocksInAss = player.CocksThatFit(cale.Butt());
	var p1cock = player.BiggestCock(cocksInAss);
	
	var racescore = new RaceScore(rosalin.body);
	var compScore = rosalin.origRaceScore.Compare(racescore);
		
	var parse = {
		playername : player.name,
		racedesc   : function() { return rosalin.raceDesc(compScore); },
		cockDesc   : function() { return p1cock.Short(); },
		cockTip    : function() { return p1cock.TipShort(); }
	};
	
	estevan.flags["Cheat"] = Estevan.Cheat.Triggered;
	var virgin = cale.Butt().virgin;
	
	world.TimeStep({hour: 1});
	
	Text.Add("<i>“I sure am!”</i> Cale rubs his hands together, eagerly.", parse);
	Text.NL();
	Text.Add("<i>“Actually, I’ll sit this one out,”</i> Estevan replies, winking at you. <i>“I can deal though.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Scared of being robbed blind, goat-boy?”</i> the wolf mocks the satyr.", parse);
	Text.NL();
	Text.Add("Actually, that won’t be a problem in this game, you hop in. ", parse);
	
	if(estevan.flags["cav"] == 1) {
		Text.Add("Cale raises his eyebrows as you explain the premise of the faux game. <i>“So the winner gets to ask a favor of one of the losers? Sounds interesting.”</i> That’s not all of it. You continue to explain the sexual nature of the favors you had in mind. A slow grin spreads across the wolf’s face.", parse);
		Text.NL();
		Text.Add("<i>“Damn [playername], you got a dirty mind. You up for this, Rosie?”</i> The alchemist nods happily, apparently unperturbed by the nature of the bet. ", parse);
		estevan.flags["cav"] = 2;
	}
	else {
		Text.Add("This will be a sexy game. Cale’s eyes light up. ", parse);
	}
	Text.Add("<i>“Sure you don’t want to join in goat-boy? I’ll take you for a ride you won’t soon forget,”</i> the wolf quips.", parse);
	Text.NL();
	Text.Add("<i>“I’m sure you’ll do just fine without me,”</i> the satyr glibly replies, carefully shuffling the deck. <i>“Let’s go then, shall we?”</i> He hands out a set of tokens to each player, followed by your starting hand.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You are pretty impressed by the way that Estevan handles the game. He doesn’t deal any obvious cheats, and at times you aren’t even dealt a good enough hand to go on with, forcing you to fold. Still, after a while the trend of the game is clear; Rosalin is losing, with Cale having a slight lead over you. The wolf looks very excited, unaware of Estevan’s mocking grin. For a while, you have a creeping feeling that the satyr is making a joke on <i>you</i> instead, but that changes soon enough.", parse);
		Text.NL();
		Text.Add("By the time that Rosalin has to drop out, the game takes a sharp turn in your favor. Even if he’s starting to notice your sometimes outrageous hands, Cale is still too excited with his former advantage to smell foul play until it’s too late. He growls as you get another full Cavalcade, scratching his head in bewilderment.", parse);
		Text.NL();
		Text.Add("On the final round of the game, the wolf lights up again, finally graced with a good by the spirits. Or so he thinks. <i>“There, full Cavalcade!”</i> he snaps, throwing down his cards defiantly. The house hand is the Lady of Light, the Champion of Light and the Maiden of Light. Together with the Shadow Stag and his Steed of Light, he’s got one of the best hands in the game.", parse);
		Text.NL();
		Text.Add("Smiling, you drop your cards, revealing the Priestess of Light and the Stud of Light, trumping him with a true full Cavalcade. <i>“God DAMNIT!”</i> Cale yells, throwing his hands in the air in frustration. <i>“Fine, you win, you win! And here I thought I would get some quality time with Rosie. Fine, she’s yours.”</i>", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("Not so fast. You thoroughly enjoy the wolf’s expression slowly change as you explain exactly what you had in mind. You don’t want Rosalin, you want Cale. And you’ll be the one fucking him. In the butt.", parse);
			Text.NL();
			
			if(virgin) {
				Text.Add("<i>“Wait- WHAT?!”</i> Cale looks around him bewildered. <i>“B-but...”</i> No buts. Just his butt.", parse);
				if(player.Gender() == Gender.female || cocksInAss.length == 0) {
					if(player.Gender() == Gender.female)
						Text.Add(" <i>“B-but you don’t even have a… you know...”</i> he falters.", parse);
					else
						Text.Add(" <i>“B-but that… thing is <b>way</b> too big! It won’t fit!”</i> he stammers.", parse);
					Text.NL();
					if(p1cock)
						Text.Add("Oh, you have that covered. Without skipping a beat, you pull out your trusty [cockDesc].", parse);
					else {
						Text.Add("<i>“Oh, I know! You can have one of mine!”</i> Rosalin quips in to the frustration of the wolf. The [racedesc] scurries away, returning with an immense canine dildo, complete with a knot. <i>“I know you’ll like it, wuffie!”</i> the alchemist exclaims, handing you the toy.", parse);
						var inv = party.inventory;
						if(player.strapOn) inv.AddItem(player.strapOn);
						player.strapOn = Items.StrapOn.CanidStrapon;
						player.Equip();
					}
					Text.NL();
					Text.Add("Grinning, you fasten the straps of the artificial cock, securing them for the rough fucking you are about to dish out.", parse);
				}
				Text.NL();
				Text.Add("<i>“N-now hold on just a minute,”</i> the wolf stammers, a wild look in his eyes.", parse);
				Text.NL();
				Text.Add("<i>“Surely you aren’t about to go back on your word, are you?”</i> Estevan purrs, wearing the biggest shit-eating grin you’ve ever seen.", parse);
				Text.NL();
				Text.Add("<i>“We <b>did</b> decide that the winner could do anything they wanted to the loser, so you don’t really have a say in it, do you?”</i> Rosalin adds.", parse);
				Text.NL();
				Text.Add("Cale swirls back and forth between each one of you, but you’re not going to have him wiggle his way out of this one. Especially since you have to keep his attention away from your last hand…", parse);
				Text.NL();
				Text.Add("Finally, a defeated wolfie lowers his head, muttering something about the world not being fair. Tough luck. Well, not exactly luck, but still.", parse);
				Text.NL();
				Text.Add("<i>“Fine, let’s get this over with,”</i> he sighs. Grinning, you tell him to turn around and bend over the log. <i>“What, here?”</i> he protests, but lowers his head as you sternly remind him about the rules again. <i>“Okay, okay, just be gentle- WILL YOU STOP LAUGHING?”</i> the wolf exclaims, his raw nerves chafing at Estevan’s roaring laughter. It takes a bit of further coaxing, but you finally have Cale propped up over the log, butt sticking up in the air.", parse);
			}
			else if(cale.Slut() < 30) {
				Text.Add("<i>“What? Here?”</i> Cale looks around him furtively, wincing at Estevan. Come on, it’s not like he’s got anything to hide, is there? <i>“I… I suppose not,”</i> he mumbles, scratching his head.", parse);
				if(player.Gender() == Gender.female || cocksInAss.length == 0) {
					if(player.Gender() == Gender.female)
						Text.Add(" <i>“Do you even have, you know...”</i> he falters, looking curious.", parse);
					else
						Text.Add(" <i>“N-no way that will fit,”</i> he says, eyeing your bulge nervously.", parse);
					Text.NL();
					if(p1cock)
						Text.Add("Oh, you have that covered. Without skipping a beat, you pull out your trusty [cockDesc].", parse);
					else {
						Text.Add("<i>“Oh, I know! You can have one of mine!”</i> Rosalin quips in. The [racedesc] scurries away, returning with an immense canine dildo, complete with a knot. <i>“I know you’ll like it, wuffie!”</i> the alchemist exclaims, handing you the toy. Cale blanches a bit at the sight of it.", parse);
						var inv = party.inventory;
						if(player.strapOn) inv.AddItem(player.strapOn);
						player.strapOn = Items.StrapOn.CanidStrapon;
						player.Equip();
					}
					Text.NL();
					Text.Add("Grinning, you fasten the straps of the artificial cock, securing them for the rough fucking you are about to dish out.", parse);
				}
				Text.NL();
				Text.Add("<i>“I just want to say I’m still not very comfortable with this, but a bet is a bet,”</i> the wolf states. <i>“Alright, let’s get this over with,”</i> he sighs, meekly obeying your command to bend over the log.", parse);
			}
			else {
				Text.Add("<i>“So that’s what this is about,”</i> Cale chuckles. <i>“Why didn’t you just say you wanted to tap my ass again?”</i>", parse);
				Text.NL();
				Text.Add("This way was more fun, plus it adds another exciting level to Cavalcade.", parse);
				Text.NL();
				Text.Add("<i>“Guess that’s true,”</i> the wolf agrees. <i>“How do you want me?”</i> You tell him to turn around and bend over. Cale eagerly jumps to obey you, his tail wagging excitedly.", parse);
				if(player.Gender() == Gender.female || cocksInAss.length == 0) {
					if(player.Gender() == Gender.female)
						Text.Add(" <i>“Do you have a nice big cock for me?”</i> he wonders, sounding pretty eager.", parse);
					else
						Text.Add(" <i>“I… ah, sorry, but I don’t think my ass is quite <b>that</b> flexible yet,”</i> he says, regretfully eyeing your bulge.", parse);
					Text.NL();
					if(p1cock)
						Text.Add("Oh, you have that covered. Without skipping a beat, you pull out your trusty [cockDesc].", parse);
					else {
						Text.Add("<i>“Oh, I know! You can have one of mine!”</i> Rosalin quips in. The [racedesc] scurries away, returning with an immense canine dildo, complete with a knot. <i>“I know you’ll like it, wuffie!”</i> the alchemist exclaims, handing you the toy.", parse);
						Text.NL();
						Text.Add("<i>“Thanks, Rosie!”</i> the wolf yips cheerfully.", parse);
						var inv = party.inventory;
						if(player.strapOn) inv.AddItem(player.strapOn);
						player.strapOn = Items.StrapOn.CanidStrapon;
						player.Equip();
					}
					Text.NL();
					Text.Add("Grinning, you fasten the straps of the artificial cock, securing them for the rough fucking you are about to dish out.", parse);
				}
				Text.NL();
				Text.Add("<i>“And here I was wanting to take wolfie down a peg or two, only to find he’s already a total slut,”</i> Estevan mutters, throwing his hands in the air.", parse);
				Text.NL();
				Text.Add("<i>“No one can resist the Cale, you know it goat-boy!”</i> Cale quips mockingly over his shoulder, shaking his ass at you enticingly.", parse);
			}
			
			Text.NL();
			parse["uncertainly"] = cale.Slut() >= 60 ? "eagerly" : "uncertainly";
			Text.Add("Not wasting any time, you pull down his pants, baring his round butt and tight rosebud. The wolf raises his tail [uncertainly], allowing you full access.", parse);
			Text.NL();
			
			Scenes.Cale.SexFuckHim(true, {cavalcade: true, cheat: true});
		});
	});
}


Scenes.NomadsCavalcade.SexyPlayerWin = function(cheat) {
	var parse = {
		playername : player.name
	};
	
	SetGameState(GameState.Event);
	
	Text.Clear();
	Text.Add("<i>“Well played, [playername]!”</i> Estevan congratulates you.", parse);
	Text.NL();
	Text.Add("<i>“Almost had you for a while there,”</i> Cale grumbles.", parse);
	Text.NL();
	Text.Add("<i>“So, what are you going to do for your reward?”</i> Rosalin asks curiously.", parse);
	Text.Flush();
	
	var caleCockInAss = player.CocksThatFit(cale.Butt());
	
	//[Fuck Cale][Nothing]
	var options = new Array();
	/* TODO
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	*/
	if(caleCockInAss.length > 0) {
		options.push({ nameStr : "Fuck Cale",
			func : function() {
				var virgin = cale.Butt().virgin;
				
				cale.flags["cLoss"]++;
				
				Text.Clear();
				if(virgin) {
					Text.Add("<i>“Wait- WHAT?!”</i> Cale looks around him bewildered. <i>“B-but...”</i> No buts. Just his butt.", parse);
					Text.NL();
					Text.Add("<i>“N-now hold on just a minute,”</i> the wolf stammers, a wild look in his eyes.", parse);
					Text.NL();
					Text.Add("<i>“Surely you aren’t about to go back on your word, are you?”</i> Estevan purrs, wearing the biggest shit-eating grin you’ve ever seen.", parse);
					Text.NL();
					Text.Add("<i>“We <b>did</b> decide that the winner could do anything they wanted to the loser, so you don’t really have a say in it, do you?”</i> Rosalin adds.", parse);
					Text.NL();
					Text.Add("Cale swirls back and forth between each one of you, but you’re not going to have him wiggle his way out of this one. Finally, a defeated wolfie lowers his head, muttering something about the world not being fair. Tough luck.", parse);
					Text.NL();
					Text.Add("<i>“Fine, let’s get this over with,”</i> he sighs. Grinning, you tell him to turn around and bend over the log. <i>“What, here?”</i> he protests, but lowers his head as you sternly remind him about the rules again. <i>“Okay, okay, just be gentle- WILL YOU STOP LAUGHING?”</i> the wolf exclaims, his raw nerves chafing at Estevan’s roaring laughter. It takes a bit of further coaxing, but you finally have Cale propped up over the log, butt sticking up in the air.", parse);
				}
				else if(cale.Slut() < 30) {
					Text.Add("<i>“What? Here?”</i> Cale looks around him furtively, wincing at Estevan. Come on, it’s not like he’s got anything to hide, is there? <i>“I… I suppose not,”</i> he mumbles, scratching his head.", parse);
					Text.NL();
					Text.Add("<i>“I just want to say I’m still not very comfortable with this, but a bet is a bet,”</i> the wolf states. <i>“Alright, let’s get this over with,”</i> he sighs, meekly obeying your command to bend over the log.", parse);
				}
				else {
					Text.Add("<i>“So that’s what this is about,”</i> Cale chuckles. <i>“Why didn’t you just say you wanted to tap my ass again?”</i>", parse);
					Text.NL();
					Text.Add("This way was more fun, plus it adds another exciting level to Cavalcade.", parse);
					Text.NL();
					Text.Add("<i>“Guess that’s true,”</i> the wolf agrees. <i>“How do you want me?”</i> You tell him to turn around and bend over. Cale eagerly jumps to obey you, his tail wagging excitedly.", parse);
				}
				Text.NL();
				parse["tight"]       = cale.Slut() >= 60 ? "pliant" : "tight";
				parse["uncertainly"] = cale.Slut() >= 30 ? "eagerly" : "uncertainly";
				Text.Add("Not wasting any time, you pull down his pants, baring his round butt and [tight] rosebud. The wolf raises his tail [uncertainly], allowing you full access.", parse);
				Text.NL();
				
				Scenes.Cale.SexFuckHim(true, {cavalcade : true, cheat: cheat})
			}, enabled : true,
			tooltip : "Bend the wolf over and make him your bitch."
		});
	}
	options.push({ nameStr : "Nothing",
		func : function() {
			Text.Clear();
			Text.Add("<i>“How noble of you, but don’t think it’ll let you off the hook if I win next time,”</i> Estevan quips.", parse);
			Text.NL();
			Text.Add("<i>“Aww, well, see you later!”</i> Rosalin pouts.", parse);
			Text.NL();
			if(cale.Slut() >= 60)
				Text.Add("<i>“Sure you don’t want to take the wolf for a ride?”</i> Cale teases, nudging you in the side playfully. <i>“Here I was, hoping to get some action!”</i>", parse);
			else
				Text.Add("<i>“Alright, I’ll get you next time though, [playername]!”</i> Cale challenges you, nudging you in the side playfully.", parse);
			Text.NL();
			Text.Add("Your group disperses, each person going about their own business.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You are feeling generous for now, let them off the hook."
	});
	Gui.SetButtonsFromList(options, false, null);
}

//TODO
Scenes.NomadsCavalcade.SexyEstevanWin = function(cheat) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	Gui.NextPrompt();
}

//TODO
Scenes.NomadsCavalcade.SexyCaleWin = function(cheat) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	Gui.NextPrompt();
}

//TODO
Scenes.NomadsCavalcade.SexyRosalinWin = function(cheat) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	Gui.NextPrompt();
}
