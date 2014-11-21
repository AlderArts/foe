
Scenes.Roaming = {};

Scenes.Roaming.FindSomeCoins = function() {
	var coin = Math.floor(5 + Math.random() * 20);
	
	var parse = {
		year    : Math.floor(world.time.year - (40 + Math.random() * 20)),
		rhisher : Math.random() < 0.5 ? "his" : "her",
		coin    : coin
	};
	
	var loc = world.CurrentLocation();
	
	parse["ground"] = loc == world.Locations.Desert ? "sand" :
	                  loc == world.Locations.Forest ? "undergrowth" :
	                  "grass";
	
	Text.Clear();
	Text.Add("You see something glistening in the [ground] just ahead and walk over curiously. To your surprise, a coin lies on the ground, apparently forgotten. Picking it up and examining it, you find the year [year] stamped on its face - it’s probably been there for some time, but you’ve seen a few even older coins still in use.", parse);
	Text.NL();
	Text.Add("A little further on, you spot another coin, and then another. You follow the trail, depositing your finds into your slowly expanding purse. Most peculiar. Not that you’re objecting.", parse);
	Text.NL();
	Text.Add("Before too long, you find the source of your enrichment. A pile of bones lies in a small hollow in the ground. All the bones you’d expect in a humanoid body seem to be present, but with the way they’ve been snapped and gnawed, it’s a little difficult to call it a skeleton.", parse);
	Text.NL();
	Text.Add("Well, there’s not much to be done about this now, though you were hoping a path of gold would lead to something more pleasant. Or at least that there would be more left in [rhisher] purse.", parse);
	Text.NL();
	Text.Add("<b>You acquire [coin] coins.</b>", parse);
	Text.Flush();
	
	party.coin += coin;
	
	Gui.NextPrompt();
}

Scenes.Roaming.KingdomPatrol = function(entering) {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	if(entering)
		Text.Add("As you make your way to the plains,", parse);
	else
		Text.Add("While you’re looking around,", parse);
	Text.Add(" you spot a squad of a dozen mounted men heading your way. Judging by their uniforms, they’re soldiers from one of the kingdom’s patrols.", parse);
	Text.NL();
	
	var capt = new Entity();
	if(Math.random() < 0.3)
		capt.body.DefFemale();
	else
		capt.body.DefMale();
	var gender = capt.Gender();
	
	parse = capt.ParserPronouns(parse, "r");
	parse["rmanwoman"] = capt.mfTrue("man", "woman");
	
	var scenes = new EncounterTable();
	
	scenes.AddEnc(function() {
		rigard.bandits = Scenes.Roaming.BanditsGen(capt);
		parse["rbanditsdesc"] = rigard.bandits.desc;
		
		Text.Add("The [rmanwoman] at the front of the group waves for [rhisher] companions to wait, and rides up to you on [rhisher] own. [rHeShe] is a young pure human [rmanwoman] and is wearing new looking armor, though dirt staining the tabard points to heavier recent use.", parse);
		Text.NL();
		Text.Add("<i>“We’ve received reports of a few bandits raiding the farms in this area,”</i> [rheshe] says without preamble, <i>“and were sent here to investigate. I have been told it’s [rbanditsdesc]. Have you seen them around here?”</i> [rHeShe] doesn’t sound too happy with the job, glancing around, as if [rheshe] just wants to get this conversation over with.", parse);
		Text.NL();
		Text.Add("You respond that you haven’t seen them, but you’ll keep an eye out.", parse);
		Text.NL();
		Text.Add("<i>“All right, thank you.”</i> [rHeShe] looks almost relieved by your response. <i>“Well, report to us if you find them. We’ll get right on it.”</i>", parse);
		Text.NL();
		Text.Add("You nod, and [rheshe] returns to [rhisher] men, presumably planning to resume their search. The sergeant doesn’t seem all that eager to do the task, but at least [rheshe]’s working on it.", parse);
		Text.NL();
		Text.Add("Perhaps you really should just locate the bandits for them.", parse);
		Text.Flush();
		Gui.NextPrompt();
	}, 2.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("They shout for you to halt, and you decide to comply and wait while they ride up to you. Up close, you see that their armor is covered in scratches and dents, though it seems well maintained for its age. Their leader, a burly [rmanwoman] with grey hairs peeking from underneath [rhisher] helmet dismounts and regards you with a bored expression.", parse);
		Text.NL();
		Text.Add("[rHeShe] introduces [rhimher]self as a sergeant of the armed forces of Rigard before getting down to business. <i>“What are you doing here?”</i> [rheshe] asks. <i>“You’re not farmers, you’re not traders, and judging by your weapons, you’re not laborers.”</i>", parse);
		Text.Flush();
		
		//[Adventurers][Bandits!]
		var options = new Array();
		options.push({ nameStr : "Adventurers",
			func : function() {
				Text.Clear();
				Text.Add("You tell the sergeants that you are adventurers, and you’re here as part of your quest. Okay, it might not be an <i>essential</i> part of your quest, but there’s no reason to tell [rhimher] that.", parse);
				Text.NL();
				Text.Add("The sergeant’s lips curl into a frown. <i>“Really? I know your kind. Think you’re on some goddess-sent mission to restore ancient powers and save the world, I bet.”</i>", parse);
				Text.NL();
				Text.Add("Well… yes, that’s about it, actually.", parse);
				Text.NL();
				Text.Add("<i>“I knew it! I’ve seen plenty like you. Some go into people’s houses and search through their vases and barrels, claiming anything they find. Others just crouch down and snatch up anything lying around whenever their hosts’ backs are turned.”</i>", parse);
				Text.NL();
				Text.Add("<i>“You’re always thinking the whole world is made just for you!”</i> [rheshe] jabs a finger at your chest, glaring. <i>“I’m sorely tempted to have a few men follow you just to make sure you don’t get up to any mischief, but I have none to spare, more’s the pity.”</i>", parse);
				Text.NL();
				
				var racescore = new RaceScore(player.body);
				var humanScore = new RaceScore();
				humanScore.score[Race.human] = 1;
				var humanity = racescore.Compare(humanScore);
				
				parse["human"] = humanity > 0.8 ? " human" : "...";
				Text.Add("[rHeShe] sigh, lowering [rhisher] hand. <i>“So, I guess you can go. <b>Try</b> to be a decent[human] being, though? Please?”</i>", parse);
				Text.NL();
				Text.Add("You nod with some relief, and the sergeant turns to mount and leave. <i>“Oh, and no, I will not have sex with you,”</i> [rheshe] throws back in your direction, before riding off.", parse);
				Text.NL();
				if(party.InParty(terry)) {
					parse["himher"] = terry.himher();
					Text.Add("<i>“I never realized adventurers were so much like thieves!”</i> Terry remarks, grinning. <i>“Sounds like I can put my skills to good use.”</i>", parse);
					Text.NL();
					Text.Add("You tell [himher] that you’ll consider it, at least when you find suitable vases to loot.", parse);
				}
				else if(terry.Recruited()) {
					parse["himher"] = terry.himher();
					Text.Add("You wonder if Terry would appreciate these apparent similarities of [hisher] old profession and the new one.", parse);
				}
				
				var inc = player.charisma.IncreaseStat(30, 1);
				
				if(inc > 0) {
					Text.NL();
					Text.Add("<b>You feel like you’ve learned a little about how not to offend people from the sergeant’s rant, making you a bit more charismatic!</b>", parse);
				}
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : Text.Parse("Tell [rhimher] that you’re adventurers.", parse)
		});
		options.push({ nameStr : "Bandits!",
			func : function() {
				Text.Clear();
				Text.Add("Trying to look nonchalant, you tell the sergeant that you are bandits, here to murder, rape, and kill.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					parse["name"] = kiakai.name;
					parse["himher"] = kiakai.himher();
					Text.Add("<i>“B-but, [playername],”</i> [name] protests, before you wave to shush [himher].", parse);
					Text.NL();
				}, 1.0, function() { return party.InParty(kiakai); });
				scenes.AddEnc(function() {
					parse["hisher"] = terry.himher();
					Text.Add("Terry’s staring wide-eyed from beside you. Looks like an admission of guilt is not to [hisher] taste.", parse);
					Text.NL();
				}, 1.0, function() { return party.InParty(terry); });
				
				scenes.Get();
				
				Text.Add("The sergeant lets out a breath of frustration, looking, if anything, more bored than before. <i>“I’ve run into plenty of bandits before, and I gotta tell you I’ve never once had them tell me that.”</i> [rHeShe] scratches [rhisher] chin. <i>“At least without having the numbers on me. Who I do get that line from is young punks who think they can’t die over a shitty joke.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I’m fining you fifteen coins for wasting my time. I call it the ‘not killing you for being an idiot’ tax.”</i>", parse);
				Text.NL();
				if(party.coin >= 15) {
					Text.Add("You grumble a little, but faced with the [rmanwoman]’s menacing glare, agree to pay up. The coins neatly disappear from your hand into [rhisher] purse.", parse);
					Text.NL();
					Text.Add("<i>“Pleasure doing business with you.”</i> The sergeant says, spitting to the side. <i>“Do respect the bloody soldiers, though. Or don’t, I suppose, I could always use more ale… or a new punching bag.”</i>", parse);
					party.coin -= 15;
				}
				else {
					Text.Add("Feeling a little embarrassed, you tell [rhimher] that you don’t actually have 15 coins.", parse);
					Text.NL();
					Text.Add("<i>“Hold still,”</i> [rheshe] commands. The sergeant pats you down roughly, spending perhaps a moment too long checking your butt. <i>“Hrm. Fine, I’m not in this to rob the broke. You can go, I guess.”</i>", parse);
					Text.NL();
					Text.Add("As you turn to leave, [rheshe] gives you a solid wack upside the head. <i>“Respect the bloody soldiers, though. We’re not here to mess around.”</i>", parse);
				}
				Text.NL();
				Text.Add("Well, that didn’t exactly go well, but there were worse ways that proclaiming yourself a bandit could have ended.", parse);
				if(party.InParty(lei)) {
					Text.NL();
					Text.Add("Lei looks at you with a smug grin on his face. <i>“That was an excellent example of how speaking untruth is a bad idea. Though I must admit that most people who choose to lie at least select lies that are favorable to themselves.”</i>", parse);
					Text.NL();
					Text.Add("You glare at him in annoyance. Looks like someone even got to feel superior.", parse);
				}
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : Text.Parse("Tell [rhimher] that you’re bandits. It might be a terrible idea, but it’s somehow tempting nonetheless.", parse)
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return party.Num() > 1; });
	
	scenes.Get();
}

Scenes.Roaming.BanditsGen = function(capt) {
	var CreateBandit = function() {
		var rand = Math.random();
		var gender = rand < 0.5 ? Gender.male :
		             rand < 0.9 ? Gender.female : Gender.herm;
		return new Bandit(gender);
	};
	
	var colors = ["red", "blue", "green", "beige", "purple", "yellow", "orange", "puce"];
	var color = colors[Math.floor(Math.random() * colors.length)];
	var items = ["bandanas", "overcoats", "bowler hats", "pantaloons", "gloves"];
	var item = items[Math.floor(Math.random() * items.length)];
	
	var rclothing = color + " " + item;
	
	var num = 2 + Math.ceil(Math.random() * 4);
	
	var enemy = new Party();
	var males   = 0;
	var females = 0;
	for(var i = 0; i < num; ++i) {
		var bandit = CreateBandit();
		if(bandit.Gender() == Gender.male)
			males++;
		else
			females++;
		enemy.AddMember(bandit);
	}
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		return "call each other by ridiculous nicknames";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		return "are all men";
	}, 1.0, function() { return females == 0; });
	scenes.AddEnc(function() {
		return "are all women";
	}, 1.0, function() { return males == 0; });
	scenes.AddEnc(function() {
		return "are well armed";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		return "are fond of stealing livestock";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		return "have only recently appeared around here";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		return "have a peculiar smell about them";
	}, 1.0, function() { return true; });
	
	var desc = scenes.Get();
	
	var enc = new Encounter(enemy);
	enc.canRun = false;
	enc.onEncounter = Scenes.Roaming.BanditsOnEncounter;
	/* TODO
	enc.onLoss = ...
	enc.onVictory = ...
	*/
	
	enc.leader = enemy.Get(0);
	enc.desc = Text.Parse("a small group, certainly not more than half a dozen. Apparently they all wear [rclothing] and " + desc, {rclothing : rclothing});
	enc.rclothing = rclothing;
	enc.capt = capt;
	
	return enc;
}

Scenes.Roaming.Bandits = function() {
	var enc = this;
	var bandits = enc.bandits;
	var parse = {
		rclothing : bandits.rclothing
	};
	
	rigard.bandits = null;
	
	Text.Clear();
	Text.Add("As you make your way, the fields around you grow wilder, more unkempt, until after walking for a few minutes more, it’s hard to imagine that anyone works the land here at all. Wild grass reaches almost to your waist, and weeds sprout in prickly bushes.", parse);
	Text.NL();
	Text.Add("You’re not sure why, but it seems that cultivation has been abandoned in this area. A little further, at the top of a small incline, you spot a derelict farmhouse, confirming your guess. Its roof is tilted at an odd angle, and where glass windows must have once been, empty holes gape onto its interior.", parse);
	Text.NL();
	Text.Add("To your surprise however, ", parse);
	if(world.time.hour >= 8 && world.time.hour < 20)
		Text.Add("you notice an orange flicker on the open window shutter.", parse);
	else
		Text.Add("a warm orange glow pours out the windows.", parse);
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"] = party.Num() > 1 ? Text.Parse(", [comp] in tow", parse) : "";
	Text.Add(" Someone’s burning a fire inside. Curious, you approach to investigate[c]. As you get closer, you hear a sheep braying somewhere on the other side of the house. Deciding to take no chances with the sort of desperate men who would live in such a desperate place, you crouch down by the window, and after listening for a moment, peek inside.", parse);
	Text.NL();
	parse["num"] = bandits.enemy.Num() > 3 ? "four" : "three";
	var males   = 0;
	var females = 0;
	var num = Math.min(bandits.enemy.Num(), 4);
	for(var i = 0; i < num; ++i) {
		var bandit = bandits.enemy.Get(i);
		if(bandit.Gender() == Gender.male)
			males++;
		else
			females++;
	}
	parse["genders"] = males == 0 ? "women" :
	                   females == 0 ? "men" :
	                   "men and women";
	Text.Add("You see a dusty room with furniture that’s on the edge of falling apart. Around a table at one end are [num] [genders], conversing conspiratorially. They seem to be discussing something about ", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("the the lay of the land around the local farms, and which farmers have been doing the best.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("which marinade is best for mutton, and whether they can get their hands on some lemons around here.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("who gets to sleep with whom tonight. One of them argues vociferously for one big cuddle pile.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("morality. You mostly zone out through the boring conversation, but you do catch one mentioning getting what’s theirs.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("whether they can keep staying there or need to move.", parse);
	}, 1.0, function() { return true; });
	scenes.Get();
	
	Text.NL();
	Text.Add("Even in this abandoned place, they keep their voices low, so you do not hear many details of what is said.", parse);
	if(num > 4) {
		parse["num2"] = num > 5 ? "two people" : "person";
		Text.Add(" You also notice the sounds of another [num2] moving around in a room in the back.", parse);
	}
	Text.NL();
	Text.Add("Suddenly, your eyes are drawn to the [rclothing] they’re all wearing. Wasn’t that the sign the sergeant told you to watch for? They must be the bandits that have been harassing the local farms!", parse);
	Text.NL();
	Text.Add("You duck back out of sight. Okay, so what should you do about them?", parse);
	Text.Flush();
	
	//[Report][Attack][Extort][Leave]
	var options = new Array();
	options.push({ nameStr : "Report",
		func : function() {
			parse = bandits.capt.ParserPronouns(parse, "r");
			
			Text.Clear();
			Text.Add("You sneak away from the farm, darting glances over your shoulder to make sure you haven’t been noticed. The tall grass lends you some cover, but you still feel like you’re about to get an arrow in the back.", parse);
			Text.NL();
			Text.Add("Once you are away, it does not take you long to find the patrol. You knock on the door of a farm near the spot you met them, hoping the farmer will know where they went, but instead, the sergeant opens the door.", parse);
			Text.NL();
			Text.Add("<i>“Oh, we’ve met, haven’t we?”</i> [rheshe] asks. <i>“We’ve ‘ad to take a break to rest up here, you see. While protecting these farmers, of course.”</i> [rHeShe] glances to the side, [rhisher] cheeks flushing pink. <i>“But what brings you here, in any case?”</i>", parse);
			Text.NL();
			Text.Add("Looking more carefully, you notice that it’s not just [rhisher] cheeks that are flushed. The sergeant’s nose is quite red as well, and a strong smell of liquor assaults your nose. Well, they might not be in the best condition to take on the bandits right now, but they do have a lot more men, so they probably won’t lose, at least.", parse);
			Text.NL();
			Text.Add("Not seeing much of an alternative at this point, you tell the sergeant that you found the bandits, and explain how to locate the abandoned farm. Just in case, you tell [rhisher] second in command as well, who seems a little more sober at least.", parse);
			Text.NL();
			Text.Add("<i>“Thank ye, really,”</i> the sergeant tells you. <i>“That’s quite a help. We’ll get there and clear them out, have no fear! Right after we rest up a li’l more, anyway.”</i> [rHeShe] scratches [rhisher] chin, eyes going out of focus before snapping back. <i>“Oh! Right, here, have a reward for your help.”</i>", parse);
			Text.NL();
			Text.Add("You accept the handful of coins, and transfer them to your pouch, thanking the sergeant. Your task here done, you head out to resume your travels.", parse);
			Text.NL();
			Text.Add("<b>You receive 10 coins as a reward for the information.</b>", parse);
			Text.Flush();
			
			party.coin += 10;
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Your job here is done. You can report their location to the kingdom patrol and they’ll take care of the matter."
	});
	options.push({ nameStr : "Attack",
		func : function() {
			Text.Clear();
			if(party.Num() == 2)
				Text.Add("[name] shadowing your steps, you", {name: party.Get(1).name});
			else if(party.Num() > 2)
				Text.Add("You companions a step behind you, you", parse);
			else
				Text.Add("You", parse);
			Text.Add(" give the door a hard kick, sending it screeching open on rusted hinges. As [num] startled faces look up at you from around the table, you step inside, readying yourself for combat.", parse);
			Text.NL();
			Text.Add("It takes the startled bandits a moment to react, and by then you’re upon them!", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				
			});
		}, enabled : true,
		tooltip : "There’s no need to get help - you’ll take them all out here and now."
	});
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Roaming.BanditsOnEncounter = function() {
	
}
