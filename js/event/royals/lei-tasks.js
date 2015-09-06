
Scenes.Lei.Tasks = {};

Scenes.Lei.Tasks.OnTask = function() { //TODO add tasks
	return Scenes.Lei.Tasks.Escort.OnTask();
}

Scenes.Lei.Tasks.AnyTaskAvailable = function() { //TODO add tasks
	return Scenes.Lei.Tasks.Escort.Available();
}

Scenes.Lei.Tasks.StartTask = function() { //TODO add tasks
	if(Scenes.Lei.Tasks.Escort.Available())
		Scenes.Lei.Tasks.Escort.Start();
}

Scenes.Lei.Tasks.TaskPrompt = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("You ask Lei if he has any contracts for you.", parse);
	Text.NL();
	if(Scenes.Lei.Tasks.Escort.OnTask()) {
		Scenes.Lei.Tasks.Escort.OnTaskText();
	}
	//TODO add tasks
	else if(lei.Annoyance() > 0) {
		Text.Add("<i>“You botched the last job I gave you, so why should I give you any more?”</i> Lei demands. <i>“When you make such gross errors, it’s not only your reputation that suffers, but mine as well, as I made the apparent mistake in recommending you.”</i> He turns away from you in annoyance.", parse);
		Text.NL();
		Text.Add("Perhaps you could prove that your abilities are worthy of his trust by winning one or two spars against him.", parse);
	}
	else if(Scenes.Lei.Tasks.AnyTaskAvailable()) {
		Scenes.Lei.Tasks.StartTask();
	}
	else {
		Text.Add("<i>“I have nothing for you right now,”</i> Lei says. <i>“Perhaps if you check back at a later time.”</i>", parse);
	}
	Text.Flush();
}


Scenes.Lei.Tasks.Escort = {};
Scenes.Lei.Tasks.Escort.Available = function() {
	if(lei.flags["Met"] >= Lei.Met.OnTaskEscort) return false;
	return true;
}
Scenes.Lei.Tasks.Escort.Eligable = function() {
	return player.level >= 6;
}
Scenes.Lei.Tasks.Escort.OnTask = function() {
	return lei.flags["Met"] == Lei.Met.OnTaskEscort;
}
Scenes.Lei.Tasks.Escort.OnTaskText = function() {
	var parse = {
		
	};
	
	if(lei.taskTimer.Expired()) { // aka missed it
		Text.Add("<i>“Since you’re asking now, despite the fact that you were supposed to meet with the contractor between ten and seventeen, I can only assume you missed it.”</i> Lei scowls at you. <i>“Your first job and you embarrass me already.”</i>", parse);
		Text.NL();
		Text.Add("<i>“At least try not to compound your failure. Speak with Ventor Orellos and see if he still needs you, or if you can make it up to him. Beg on your knees if you have to.”</i>", parse);
		Text.NL();
		Text.Add("You nod, and retreat before his glare.", parse);
		
		lei.annoyance.IncreaseStat(1, 1);
	}
	else {
		parse["date"] = lei.taskTimer.ToHours() <= 17 ? "today" : "tomorrow";
		Text.Add("<i>“I’ve already told you your task,”</i> Lei says, looking mildly annoyed. <i>“Report to Ventor Orellos between ten and seventeen [date] and guard him while he collects money. Very simple.”</i>", parse);
		Text.NL();
		Text.Add("Right. You tell him you just wanted to double-check the details, and thank him for the reminder.", parse);
	}
	Text.Flush();
	Scenes.Lei.InnPrompt();
}

Scenes.Lei.Tasks.Escort.Completed = function() {
	return lei.flags["Met"] >= Lei.Met.CompletedTaskEscort;
}

Scenes.Lei.Tasks.Escort.Coin = function() {
	//TODO
	return 150;
}

Scenes.Lei.Tasks.Escort.Start = function() {
	var parse = {
		coin : Text.NumToText(Scenes.Lei.Tasks.Escort.Coin())
	};
	
	if(Scenes.Lei.Tasks.Escort.Eligable()) {
		Text.Add("<i>“In fact, I do. A contact brought a small task for me. I could not take it on, but I informed her that I had someone in mind for it. It’s suitable for a first job.”</i>", parse);
		Text.NL();
		Text.Add("You idly ask if you’re going to have to kill rats in someone’s basement.", parse);
		Text.NL();
		Text.Add("Lei rolls his eyes. <i>“No, nothing so silly as that. Instead, you will be doing simple escort work,”</i> he explains. <i>“It is not glamorous, but little paying work is. There is always some fool volunteering for any job involving glory, and if there is a volunteer, why pay?”</i> You idly wonder if Aria plans to pay you...", parse);
		Text.NL();
		Text.Add("<i>“You are to meet the merchant Ventor Orellos at his home in the Plaza between ten and seventeen tomorrow, and accompany him as he collects his share of the profits from several establishments.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I have been advised that the proceeds may amount to a significant sum of money, so it would not be surprising if he were attacked if anyone learns of his errand. Your pay upon the completion of the job will be [coin] coins.”</i>", parse);
		Text.NL();
		Text.Add("Does he have any more information?", parse);
		Text.NL();
		Text.Add("<i>“No,”</i> Lei replies. <i>“I do not believe any more is essential, though Ventor may have additional details for you when you meet him.”</i>", parse);
		Text.NL();
		Text.Add("You nod in acceptance. It seems straightforward enough.", parse);
		Text.NL();
		Text.Add("<b>You should meet Ventor Orellos at his home in the Plaza between ten and seventeen tomorrow for an escort job. Don’t be late!</b>", parse);
		
		lei.flags["Met"] = Lei.Met.OnTaskEscort;
		
		var step = world.time.TimeToHour(17);
		lei.taskTimer = new Time(0, 0, step.hour < 12 ? 1 : 0, step.hour, step.minute);
	}
	else {
		Text.Add("He looks you over critically, his eyes roving over your body. <i>“I do not believe you are yet strong enough for any of the contracts I have. You will have to train a little more before I am comfortable recommending you to anyone.”</i>", parse);
		Text.NL();
		Text.Add("You purse your lips, but nod in acceptance. Looks like you’ll have to practice some more first.", parse);
		Text.NL();
		Text.Add("<b>This job requires level 6 to unlock.</b>", parse);
	}
	Text.Flush();
	Scenes.Lei.InnPrompt();
}

Scenes.Lei.Tasks.Escort.Estate = function() {
	var parse = {
		sirmadam : player.mfFem("sir", "madam"),
		playername : player.name
	};
	
	var late = lei.taskTimer.Expired();
	
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	
	Text.Clear();
	parse["garden"] = world.time.season == Season.Winter ? "a garden, resting through the winter" : "a lush flower garden";
	Text.Add("You follow Lei’s directions and find yourself in front of a gated estate. Past the ornate entranceway lies [garden], and beyond that, a three-story building. Despite its relatively modest size, the building boasts lavish ornamentation, giving it an appearance of opulence that speaks of significant wealth.", parse);
	Text.NL();
	Text.Add("After a moment’s wait, a pure human footman approaches you from somewhere to the right of the gates. It seems there’s some watch post there you hadn’t noticed.", parse);
	Text.NL();
	Text.Add("<i>“May I assist you, [sirmadam]?”</i> he politely inquires.", parse);
	Text.NL();
	if(late) {
		Text.Add("You explain that you were supposed to escort Ventor Orellos on his rounds, but you missed your appointment, and would like to make up for it.", parse);
		Text.NL();
		Text.Add("The footman does not even bat an eyelash. <i>“Very good, [sirmadam].", parse);
	}
	else {
		Text.Add("You explain that you have a contract to escort Ventor Orellos today.", parse);
		Text.NL();
		Text.Add("<i>“Very good, [sirmadam], I have been told to expect you.", parse);
	}
	Text.Add(" Please, follow me, and I will show you to the master.”</i> The man waits for your nod of acceptance before turning and leading you down the straight cobbled path to the house.", parse);
	Text.NL();
	if(world.time.season == Season.Spring || world.time.season == Season.Summer)
		Text.Add("On both sides, flowers bloom in a carpet of color, a few narrow walk paths snaking through the beds. Toward the sides of the compound, bushes of roses bloom pink and red. They must have a full-time gardener tending the plants.", parse);
	else {
		parse["season"] = world.time.season == Season.Winter ? "in the winter season" : "to the season of falling leaves";
		Text.Add("On both sides, a scattering of flowers still blooms, providing a sprinkling whites and violets [season]. You see some rose bushes toward the sides of the compound, but they stand merely green, the flowers resting, awaiting spring. To have flowers, even in this state, suggests the family likely retains a full time gardener to take care of the plants.", parse);
	}
	Text.NL();
	Text.Add("The house is still and quiet, although looking past the sun reflected in the bay windows, you glimpse a dark-skinned young man pacing in evident agitation. The footman holds the door open for you, and you step inside, passing into a vestibule. Paintings adorn the walls of the chamber, while elaborately patterned carpets cover most of the floor.", parse);
	Text.NL();
	Text.Add("Your guide holds up a hand for you to wait inside the door.", parse);
	if(player.HasLegs())
		Text.Add(" <i>“This is a shoe-free home, [sirmadam],”</i> he says, motioning toward a row of soft brown slippers on a bench beside the door.", parse);
	Text.NL();
	Text.Add("From there, the footman leads you further, passing through a pair of rooms, before reaching your destination. He knocks on the door, and after a moment, you are announced, admitted, and find yourself in a spacious well-lit study. The windows open on a back yard and stables, a pair of carriages parked in one corner. Shelves of books line the paneled walls of the room, and a tall pile of ledgers sits on one edge of the wide desk.", parse);
	Text.NL();
	parse["c"] = party.Num() > 1 ? Text.Parse(", asking [comp] to wait outside", parse) : "";
	Text.Add("The opposite corner is occupied by a dark skinned young woman with a few streaks of green dyed in her pitch black hair. It seems she was talking to the portly man sitting behind the desk, but as you enter[c], she looks up at you with a smile.", parse);
	Text.NL();
	if(late) {
		Text.Add("<i>“Oh, Father has mentioned you!”</i> she says, her voice high but measured. Her eyes roam over your body, not shying away from any detail. <i>“But were you not supposed to be here some time ago? Well, no matter, I’m certainly glad that you came now.”</i> She bites her lower lip cutely.", parse);
		Text.NL();
		Text.Add("The man waves for her to be quiet, before rising with a heave. <i>“When we received Lei’s recommendation, we thought you would be reliable. Lateness costs money - for us, and for you. We had to make alternate arrangements in your absence. Your payment will be half of the agreed upon amount as a penalty.”</i>", parse);
		Text.NL();
		Text.Add("You nod in acceptance. You’re not sure you could show up in front of Lei again if you backed out here.", parse);
		Text.NL();
		Text.Add("<i>“Allow me to introduce myself then,", parse);
		
		lei.annoyance.IncreaseStat(100, 2);
	}
	else { // on time
		Text.Add("<i>“You must be the one Father mentioned,”</i> she says, her voice high but measured. Her eyes roam over your body, not shying away from any detail. <i>“He was quite disappointed when he couldn’t get Lei, you know, but looking at you, I’m sure he was wrong to be.”</i> She bites her lower lip cutely.", parse);
		Text.NL();
		Text.Add("The man waves for her to be quiet, before rising with a heave. <i>“Allow me to introduce myself,", parse);
	}
	Text.Add(" I am Ventor Orellos, and this is my daughter Aliana. A sweet child, though she can be a touch impetuous.”</i> He smiles up at her fondly. <i>“I am glad to make your acquaintance, [playername].”</i>", parse);
	Text.NL();
	Text.Add("You reply politely, and catch Aliana’s eye, smiling. Impetuous isn’t so bad sometimes.", parse);
	Text.NL();
	Text.Add("If the merchant minds - or notices - the exchange, he makes no comment. ", parse);
	Text.NL();
	Text.Add("<i>“I had to remove my regular collector recently, as it had turned out that he was stealing more than I thought,”</i> Ventor explains with a chuckle, <i>“so today I’ll have to make the rounds myself. The man had employed his own guard, so I’ll need your assistance for now, until I straighten out the long term arrangements.”</i>", parse);
	Text.NL();
	if(late)
		Text.Add("You nod in acknowledgement.", parse);
	else
		Text.Add("You nod in acceptance.", parse);
	Text.Add(" That’s about what you had been told.", parse);
	Text.NL();
	Text.Add("Aliana hops off the desk. <i>“I’m coming with you, right, daddy?”</i> she asks the merchant. <i>“I want to see how collection works!”</i> With the way she’s been acting, you have your doubts as to whether that’s really her motivation.", parse);
	Text.NL();
	Text.Add("The older man’s stern face melts into a smile. <i>“Of course, you know I can’t refuse you.”</i> He looks at you over her shoulder. <i>“I will trust you to protect my daughter above all else, [playername]. Do not disappoint me.”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
		Text.Add("It takes another half hour for them to get ready, while you[c] sit in the foyer, idly looking over the garden. When your employer descends from upstairs, he’s wearing dark formal clothes, well-made, but not ostentatious. It seems he decided on an understated style, perhaps to avoid drawing too much attention.", parse);
		Text.NL();
		Text.Add("Aliana, on the other hand, went in the opposite direction. Her outfit hugs her body tightly, emphasizing her cute breasts and curvy butt, drawing the eye to all the right places.", parse);
		Text.Flush();
		
		//[Flirt][Don’t]
		var options = new Array();
		options.push({ nameStr : "Flirt",
			tooltip : "You’re pretty sure she’s showing off for you, so why not compliment her?",
			func : function() {
				Text.Clear();
				Text.Add("You let your eyes roam languidly over Aliana’s body, and she smiles at you, clearly enjoying the attention. When she stands before you, you let your gaze drift up her neck and stop at her lips, and tell her that you quite like her outfit.", parse);
				Text.NL();
				Text.Add("<i>“Why, thank you,”</i> she almost purrs.", parse);
				Text.NL();
				Text.Add("Ventor coughs audibly, looking annoyed with you. <i>“We shall be on our way now. Follow me.”</i>", parse);
				
				//TODO
				//#aliana rel +3
				
				PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Don’t",
			tooltip : "It’s your first job. You’re supposed to remain professional, aren’t you?",
			func : function() {
				Text.Clear();
				Text.Add("You keep your expression tactfully neutral, meeting Ventor’s eyes as he approaches you.", parse);
				Text.NL();
				Text.Add("He inclines his head in acknowledgement to you. <i>“Come, we should be on our way,”</i> he says, motioning for you to follow.", parse);
				
				//TODO
				//#professionalism +1
				
				PrintDefaultOptions();
			}, enabled : true
		});
		
		Gui.Callstack.push(function() {
			Text.Add(" He leads you out a back door to the yard you saw out the window, and Aliana walking beside you, her arm almost rubbing against yours. A pair of horses are harnessed to a solid-looking coach, and the driver awaits your arrival.", parse);
			Text.NL();
			Text.Add("<i>“Did Alten not want to come?”</i> Aliana asks.", parse);
			Text.NL();
			Text.Add("<i>“No,”</i> Ventor says. Both look a little dejected at that.", parse);
			Text.NL();
			//TODO
			party.SaveActiveParty();
			var comp = party.Get(1);
			
			Gui.Callstack.push(function() {
				parse["f"] = player.HasLegs() ? " between your feet" : "";
				parse["comp"] = comp ? comp.name : "";
				parse["c"] = party.Num() > 1 ? Text.Parse("[comp] and Aliana’s father sit", parse) : "her father sits";
				Text.Add("You step inside and Aliana takes a seat beside you on the comfortable upholstery, while [c] across. On the floor[f] rests a solid wooden strongbox - it seems like it’s light enough to carry, but only just. If someone were to steal it, it would give in to a determined assault eventually, but you suspect it would take a good amount of time to break through.", parse);
				Text.NL();
				Text.Add("You pass out of the estate gates, and the coach rides smoothly over the neatly cobbled streets. Along the way, Ventor explains that you’ll be visiting six stores he has large stakes in today. Apparently, two of the stores are run by craftsmen he has invested in, and the rest deal in a variety of trade goods. He has several caravans of his own running the trade routes, but most of the stock for the shops comes from wholesalers.", parse);
				Text.NL();
				if(comp == terry) {
					parse = terry.ParserPronouns(parse);
					Text.Add("You notice Terry eyeing the merchant speculatively out of the corner of [hisher] eye, and give [himher] a warning glare. You are <i>not</i> robbing your employer.", parse);
					Text.NL();
				}
				Text.Add("It does not take long for you to reach the first of the shops in the Merchants’ District. An ornate façade looks out onto the street, large windows displaying beautiful white carvings and elaborately patterned carpets. The carpets aren’t quite as nice as those at the Orellos estate, but you still suspect no one outside the upper classes would be able to afford them.", parse);
				Text.NL();
				Text.Add("Ventor asks you to wait outside while he conducts his business, and Aliana follows him in with an apologetic smile.", parse);
				if(comp == kiakai) {
					parse = kiakai.ParserPronouns(parse);
					Text.NL();
					Text.Add("You remark to [comp] that there’s really some remarkable workmanship on display here.", parse);
					Text.NL();
					Text.Add("<i>“That is true, [playername],”</i> [heshe] replies, <i>“but I cannot help but wonder if this is such a good thing. You have seen the way people live in the slums. Would not some of the wealth spent on carpets be better used to assist those in need?”</i>", parse);
					Text.NL();
					Text.Add("You point out that certainly helping is good, but it is best when those who have the wealth help of their own accord. It’s a difficult thing to force people to give charity.", parse);
					Text.NL();
					Text.Add("You pass an easy twenty minutes in engaging discussion before", parse);
				}
				else if(comp) {
					Text.NL();
					Text.Add("You chat about the goods on display, as well as your employer and his daughter with [comp], almost forgetting why you’re there. Despite the relaxed atmosphere, you still can’t help but feel a little nervous - nothing <i>should</i> go wrong, but you don’t want to mess up your first contract.", parse);
					Text.NL();
					Text.Add("Nonetheless, you pass an easy twenty minutes in engaging discussion before", parse);
				}
				else {
					Text.Add(" You attempt to strike up a conversation with the coachman, but he proves stoically unresponsive, and in the end you resort to sitting beside him in silence, settling in to wait. You glance around from time to time, trying your best to seem guard-like, but notice nothing untoward.", parse);
					Text.NL();
					Text.Add("It’s a good twenty minutes before", parse);
				}
				Text.Add(" father and daughter emerge from the store with a heavy-looking satchel in hand. They are engaged in a lively discussion about what’s selling and what isn’t, and which way prices are likely to go", parse);
				
				var check = Math.max(player.Int(), player.Cha()) + _.random(1, 20);
				var goal = 40;
				
				if(check >= goal) {
					Text.Add(". It’s not something you know much about, but you manage to get a few remarks in, pulling yourself into the discussion. Ventor regards you with renewed interest after a particularly astute comment.", parse);
					//TODO #professionalism +0.5?
				}
				else
					Text.Add(", thoroughly excluding you from the discussion by force of expertise.", parse);
				Text.Add(" From her enthusiasm, it seems Aliana really did come to learn about the business.", parse);
				Text.NL();
				Text.Add("The next four stores are about the same. The two go in, you wait, they come out. During one of the stops, a man approaches the driver and asks who the coach belongs to, but that’s about the extent of unexpected events.", parse);
				Text.NL();
				Text.Add("<i>“We’re almost done!”</i> Aliana says, stretching languidly, as you climb into the carriage to go to the final store. <i>“My eyes are starting to hurt from staring at all those books. Can’t we tell them to write neater, Father?”</i>", parse);
				Text.NL();
				Text.Add("Ventor rubs his chin thoughtfully. <i>“It is an idea, but we’d probably have to pay to have someone teach them. It’s unlikely to be worth the investment, I am sad to say. Though you will be happy to know that the proprietor of the last store has fine handwriting, despite working in the slums.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Ah, that’s a relief,”</i> she says. <i>“Maybe I can get through the day without a headache after all.”</i>", parse);
				Text.NL();
				Text.Add("Aliana slumps back in her seat, rubbing her eyes, and you see Ventor’s shoulders droop, a concession to tiredness you had not expected from the man. You didn’t think fetching money would be this much work. The two didn’t even seem particularly pleased as they deposited satchel after satchel into the lockbox on the floor. How much must they have for collecting these amounts to feel like a menial chore to them?", parse);
				Text.NL();
				Text.Add("The horses neigh suddenly, and the steady drum of their trot turns into a panicked clatter of hoofs as the coach bumps and lurches to the side. Somehow, the horses manage to come to a stop before reaching the wall, but with the way the coach is angled, it would take some work to turn around. And with the side window facing forward, you see what’s ahead.", parse);
				Text.NL();
				Text.Add("A hastily erected barricade of broken furniture and half-rotted timber blocks off the street. It looks flimsy enough that the horses would’ve probably been able to charge through it if it were not for the four men who stand behind it. They glance hesitantly at each other as you come to a stop before raising their weapons and walking toward the disabled coach.", parse);
				Text.NL();
				parse["c"] = party.Num() > 1 ? Text.Parse(", [comp] following close behind", parse) : "";
				Text.Add("Looks like you’re going to have to fight for your pay after all. You push open the door - and shouting for Aliana and Ventor to run - jump out[c]. You stop in the middle of the road and await the approaching assailants. They seem like ordinary enough residents of the quarter. Morphs wearing drab clothes adorned with patches and holes, they are armed with clubs and long knives. Not the deadliest of weapons, but dangerous enough.", parse);
				Text.NL();
				Text.Add("Behind your back, you hear Ventor tell the driver to carry the lockbox, his orders mixed with curses, and then three sets of footsteps hurry off. Your eyes dart between the four ambushers, as they spread out warily around you.", parse);
				Text.NL();
				Text.Add("It’s time to do your job.", parse);
				Text.Flush();
				
				//TODO
				
				/*
#combat encounter
4x enemies, level 6-7, scrapper style (probably tuned to require some decent decision making to win at level 6 with Kiai)
disable submit/run option?
#end combat
				 */
				
			});
			
			if(party.Num() > 2) {
				Text.Add("It seems like there’s only enough space to seat four. You’ll only be able to take one of your companions with you for the job.", parse);
				Text.Flush();
				
				//[Companions]
				var options = new Array();
				for(var i = 1; i < party.members.length; ++i) {
					var p = party.Get(i);
					options.push({ nameStr : p.name,
						tooltip : Text.Parse("Take [name] with you.", {name: p.name}),
						func : function() {
							Text.Clear();
							
							party.ClearActiveParty();
							party.AddMember(player);
							party.AddMember(p);
							comp = p;
							
							PrintDefaultOptions();
						}, enabled : true
					});
				}
				Gui.SetButtonsFromList(options, false, null);
			}
			else {
				PrintDefaultOptions();
			}
		});
		
		Gui.SetButtonsFromList(options, false, null);
	});
}

/*

TODO TIME

 */

/*
 * TODO Combat Win/Loss
 * 
 * 
 */



/*
Scenes.Lei.Tasks.Escort = {};
Scenes.Lei.Tasks.Escort.Available = function() {
	if(lei.flags["Met"] >= Lei.Met.OnTaskEscort) return false;
	return true;
}
Scenes.Lei.Tasks.Escort.Eligable = function() {
	return player.level >= 6;
}
Scenes.Lei.Tasks.Escort.OnTask = function() {
	return lei.flags["Met"] == Lei.Met.OnTaskEscort;
}
Scenes.Lei.Tasks.Escort.OnTaskText = function() {
	var parse = {
		
	};
	
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.Flush();
}
Scenes.Lei.Tasks.Escort.Completed = function() {
	return lei.flags["Met"] >= Lei.Met.CompletedTaskEscort;
}

Scenes.Lei.Tasks.Escort.Start = function() {
	var parse = {
		
	};
	
	if(Scenes.Lei.Tasks.Escort.Eligable()) {
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
	}
	else {
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
	}
	Text.Flush();
	Gui.NextPrompt();
}
 */