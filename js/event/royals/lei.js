/*
 * 
 * Define Lei
 * 
 */
// TODO: FIX STATS
function Lei(storage) {
	Entity.call(this);
	// Character stats
	this.name = "Lei";
	
	//TODO: avatar
	this.avatar.combat     = Images.lei;
	
	this.maxHp.base        = 460;
	this.maxSp.base        = 200;
	this.maxLust.base      = 220;
	// Main stats
	this.strength.base     = 35;
	this.stamina.base      = 31;
	this.dexterity.base    = 44;
	this.intelligence.base = 28;
	this.spirit.base       = 30;
	this.libido.base       = 19;
	this.charisma.base     = 35;
	
	this.level    = 15;
	this.sexlevel = 5;
	
	this.body.DefMale();
	this.body.height.base      = 181;
	this.body.weigth.base      = 80;
	this.body.head.hair.color  = Color.black;
	this.body.head.hair.length.base = 20;
	this.body.head.hair.style  = HairStyle.ponytail;
	this.body.head.eyes.color  = Color.black;
	
	this.Butt().virgin = true;
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = Lei.Met.NotMet;
	this.flags["ToldOrvin"] = 0;
	this.flags["HeardOf"] = 0;
	this.flags["Fought"] = Lei.Fight.No;
	
	this.timeout = new Time();
	
	if(storage) this.FromStorage(storage);
}
Lei.prototype = new Entity();
Lei.prototype.constructor = Lei;

Lei.PartyStrength = {
	LEVEL_WEAK   : 5,
	LEVEL_STRONG : 10
};
Lei.Met = {
	NotMet    : 0,
	SeenInn   : 1,
	SeenGates : 2,
	KnowName  : 3
}
Lei.Fight = {
	No         : 0,
	Submission : 1,
	Loss       : 2,
	Win        : 3
};
Lei.Rel = {
	L1 : 20,
	L2 : 40,
	L3 : 60,
	L4 : 80
};

Lei.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	
	this.timeout.Dec(step);
}

Lei.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	this.timeout.FromStorage(storage.timeout);
	
	// Load flags
	this.LoadFlags(storage);
}

Lei.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	storage.timeout = this.timeout.ToStorage();
	
	return storage;
}

Scenes.Lei = {};

// Schedule
Lei.prototype.IsAtLocation = function(location) {
	// Numbers/slacking/sleep
	if(location == world.loc.Rigard.Inn.common && lei.timeout.Expired())
		return (world.time.hour >= 14 && world.time.hour < 23);
	return false;
}

// Party interaction
Lei.prototype.Interact = function() {
	Text.Clear();
	Text.AddOutput("Rawr Imma stabbitystab.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + lei.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + lei.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + lei.slut.Get()));
		Text.Newline();
	}
	
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
}

Scenes.Lei.InnPromptRepeatApproach = function() {
	var parse = {
		
	};
	
	if(party.Two())
		parse["comp"] = ", motioning for "+party.Get(1).name+" to take a seat nearby";
	else if(!party.Alone())
		parse["comp"] = ", motioning for your companions to take seats nearby";
	else
		parse["comp"] = "";
		
	Text.Clear();
	Text.Add("You walk over to Lei’s table, and pull up a chair[comp]. He ", parse);
	if(lei.Relation() < Lei.Rel.L2)
		Text.Add("glances at you for a moment, and inclines his head fractionally before resuming his survey of the room.", parse);
	else if(lei.Relation() < Lei.Rel.L4)
		Text.Add("looks over at you and nods, the hint of a smile on his lips.", parse);
	else
		Text.Add("greets you with a smile, evidently pleased to see you.", parse);
	Text.Flush();
	
	Scenes.Lei.InnPromptRepeat();
}

Scenes.Lei.InnPromptRepeat = function() {
	var parse = {
		
	};
	
	//[name]
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
	if(rigard.Krawitz["Q"] >= Rigard.KrawitzQ.Started && rigard.Krawitz["Q"] < Rigard.KrawitzQ.HeistDone) {
		options.push({ nameStr : "Krawitz",
			func : function() {
				Text.Clear();
				
				//rigard.Krawitz["Duel"] = 0; // 0 = no, 1 = superwin, 2 = win, 3 = loss
				var duel  = rigard.Krawitz["Duel"];
				var hired = rigard.Krawitz["Work"] == 1;
				
				parse["progress"] = ((duel != 0) || hired) ? ", telling him about your progress so far" : "";
				
				Text.Add("You ask Lei if he has any ideas for dealing with Krawitz[progress].", parse);
				Text.NL();
				if(duel > 0) {
					if(duel == 1) {
						Text.Add("Lei stares at you, his normally impassive face transfigured with surprise. <i>“Wow. I have to say that even I am impressed. Very artfully done, my friend.”</i>", parse);
						Text.NL();
						Text.Add("<i>“I expect Krawitz will remember that humiliation for a good long time - as will the rest of the city. Still, if you have set your mind to really getting him, there is much else you can do.”</i>", parse);
					}
					else if(duel == 2) {
						Text.Add("Lei raises his eyebrows. <i>“Well done! It takes a good bit of skill to beat a master at his own weapon, even if he is rather old. That will probably sting his pride for some time.”</i>", parse);
						Text.NL();
						Text.Add("<i>“Still, there is much else you can do.”</i>", parse);
					}
					else { // loss
						Text.Add("Lei shrugs. <i>“So, you challenged him to a duel and lost. It happens,”</i> he says, then glances to the side, <i>“I am given to understand, anyway. He had the advantage of practice and extreme familiarity with the weapon. If you wanted to beat him, you needed to have incredible raw skill.”</i>", parse);
						Text.NL();
						Text.Add("<i>“But no matter, there are other avenues for you to explore.”</i>", parse);
					}
					Text.NL();
				}
				else if(duel == 0) { // not fought
					Text.Add("<i>“Perhaps the first, and safest step you can take is to confront Krawitz in public. Find some pretext to challenge him to a duel, and beat him in front of everyone. Humiliate him if you can,”</i> Lei suggests, a predatory grin on his lips.", parse);
					Text.NL();
					Text.Add("<i>“Most nobles go out into the Plaza from time to time, so if you look around you should be able to find him. Be warned, however, that it is no easy task to beat a specialist with his own weapon. ", parse);
					if(player.Dex() < 40)
						Text.Add("In fact, though you may attempt the deed, I feel you would fall short.”</i>", parse);
					else
						Text.Add("Though I suspect you may be able to pull off the feat.”</i>", parse);
					Text.NL();
					Text.Add("<i>“There are more... personal avenues you can pursue as well once you are done with that as well.”</i>", parse);
					Text.NL();
				}
				Text.Add("Lei pauses, thinking for a moment. ", parse);
				if(hired)
					Text.Add("<i>“You already have a route into estate, so now all you need to do is go. Have courage and be prepared to improvise once you’re inside.", parse);
				else {
					Text.Add("<i>“You will need to find a way into his estate. It is, of course, always possible to simply climb in during the night, but it is often simpler to find a legitimate pretext for being there if you can.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Once you are inside, my best advice is to have courage and be prepared to improvise.", parse);
				}
				Text.Add(" Often, it is most effective to use a man’s own tools and followers against him.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Obtain information you can from Krawitz’s servants and guards, determine how to exploit and emphasize his weaknesses, and execute your plan. Of course, make sure your plan is as good as you can make it, as you probably won’t get two chances at it.”</i>", parse);
				Text.NL();
				Text.Add("You listen attentively, and nod at his explanation. It sounds reasonable, and he’s speaking as if he’s done this sort of thing plenty of times. Which, realistically, he may very well have.", parse);
				Text.NL();
				Text.Add("<i>“And that is all. Once you have done everything you wish to do, leave the estate, and report back to my young protégés. The more you accomplish, the happier they will probably be.”</i>", parse);
				Text.Flush();
			}, enabled : true,
			tooltip : "Ask for advice for dealing with Krawitz."
		});
	}
	Gui.SetButtonsFromList(options, true);
}

Scenes.Lei.InnPrompt = function() {
	var parse = {
		
	};
	
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	
	Text.Clear();
	var first = false;
	
	if(lei.flags["Met"] < Lei.Met.KnowName) {
		world.TimeStep({minute: 5});
		Text.Add("You approach the stranger. He definitely looks like the man you saw following the pair of hooded nobles earlier. His cloak is the same dusky shade, and he has the hood drawn up, casting his face into shadow, raising your suspicions. Up close, you notice that underneath he’s wearing some sort of black form-fitting armor, nicely emphasizing his well-muscled body. When you reach his table, he looks up at you, running his eyes over you methodically.", parse);
		Text.NL();
		Text.Add("Normally, if a man examined you so closely, eyes poring over every detail, you would think that he's checking you, but something in the stranger's eyes make this examination different... it feels like he's not examining you as a potential mate, so much as potential prey, assessing whether you're worth noticing.", parse);
		Text.NL();
		Text.Add("You cough, shifting uncomfortably under his gaze, and ask if he minds if you join him. After a moment, you realize you were supposed to ask him about the couple he was following, but the thought slipped your mind when met with his stare.", parse);
		Text.NL();
		// TODO: more complex strength assessment
		var playerLevel = player.level;
		var strongestLevel = player.level;
		var strongestMember = player;
		for(var i = 1; i < party.members.length; i++) {
			if(party.members[i].level > strongestLevel) {
				strongestLevel = party.members[i].level;
				strongestMember = party.members[i];
			}
		}
		
		if(playerLevel < Lei.PartyStrength.LEVEL_WEAK && strongestLevel >= Lei.PartyStrength.LEVEL_STRONG) {
			parse["heshe"] = strongestMember.heshe();
			parse["name"] = strongestMember.name;
			Text.Add("The stranger seems to hesitate before finally deciding. <i>“Very well, you may sit. Not for your sake, but [heshe] appears interesting,”</i> he says, nodding toward [name].", parse);
		}
		else if(playerLevel < Lei.PartyStrength.LEVEL_WEAK && strongestLevel < Lei.PartyStrength.LEVEL_WEAK) {
			Text.Add("<i>“I have no interest in you,”</i> the man replies, his voice husky, yet flowing. <i>“You should go, I have no patience for the weak.”</i>", parse);
			Text.NL();
			Text.Add("You glare at the man. You? Weak? You do get a weird sense of danger just from talking to him, but there’s a reason you’re here. You’re not going to be deterred that easily.", parse);
		}
		else if(playerLevel < Lei.PartyStrength.LEVEL_STRONG)
			Text.Add("<i>“Very well, you appear to have some potential,”</i> the man replies, his voice husky, yet flowing. <i>“You may sit if you like.”</i>", parse);
		else
			Text.Add("<i>“You <b>are</b> an interesting one,”</i> the man replies, almost purring. <i>“Please, sit.”</i>", parse);
		Text.NL();
		if(party.Alone())
			Text.Add("You pull up a chair and sit down across from the stranger.", parse);
		else
			Text.Add("There's barely enough space at the man's table for you to pull up a single chair across from him, so you tell your party to sit down at a table a few paces away while you talk with the stranger.", parse);
		Text.NL();
		Text.Add("<i>“There is no need to sit so far from me,”</i> he tells you, indicating a spot beside him at the small table. Your eyebrows shoot up in surprise. <i>“You're blocking my view,”</i> he clarifies.", parse);
		Text.NL();
		if(playerLevel >= Lei.PartyStrength.LEVEL_STRONG) {
			Text.Add("You scoot over, the stranger's eyes fixed on you the whole time. <i>“Well then, what can I do for you?”</i> he asks.", parse);
			Text.NL();
			Text.Add("Somehow you feel awkward just blurting out your accusation. You decide you should at least start off politely, and ", parse);
		}
		else {
			Text.Add("You scoot over to the side of the table, and he resumes watching the room, seemingly paying you no further mind. After half a minute of awkward silence, you decide you should make the first move even if you have to speak to the side of his head. Perhaps simply blurting out your accusation wouldn’t be a great idea...", parse);
			Text.NL();
			Text.Add("You ");
		}

		parse["adv"] = party.Alone() ? "an adventurer" : "adventurers";
		parse["s"]   = party.Alone() ? "" : "s";
		Text.Add("introduce yourself[comp], and tell him you are [adv] of a sort.", parse);
		Text.NL();
		Text.Add("<i>“Adventurer[s]...”</i> he muses, <i>“a description given if one has a goal too complicated to say in a few words or too sensitive to divulge. A goal which probably involves violence.”</i> A slight smile creases his lips.", parse);
		Text.NL();
		Text.Add("<i>“No matter. I am Lei.”</i> He pauses, apparently watching for whether the name is familiar to you. ", parse);
		if(lei.flags["HeardOf"] == 0)
			Text.Add("<i>“A simple seeker of strength and fortune. Nothing more. Nothing less.”</i>", parse);
		// TODO: ELSE (Rumors etc, party members?)
		Text.NL();
		Text.Add("Lei’s eloquence is apparently exhausted, so maybe it’s a good time to ask him the things you wanted.", parse);
		Text.Flush();
		
		lei.flags["Met"] = Lei.Met.KnowName;
		first = true;
	}
	else { // lei.flags["Met"] == Lei.Met.KnowName;
		Text.Add("Lei’s back to his old seat. Now might be a good time to figure out why he was following the couple from the royal district, or see if you can get a lead to actually finding them.", parse);
 		Text.Flush();
 	}
 	
	var options = new Array();
	options.push({ nameStr : "Confront",
		func : function() {
			Text.Clear();
			
			if(party.Two())
				parse["comp"] = party.Get(1).name + " a reassuring presence behind you, ";
			else if(!party.Alone())
				parse["comp"] = "your companions a reassuring presence behind you, ";
			else
				parse["comp"] = "";
			if(first) {
				Text.Add("You clear your throat, and are rewarded with a flicker of the eyes from Lei, before he resumes his vigil over the room. Steeling yourself, you tell him that you saw him stalking a couple wearing grey cloaks after they left the castle grounds, and that you want an explanation.", parse);
				Text.NL();
				Text.Add("<i>“No.”</i> You look at him incredulously.", parse);
				Text.NL();
				Text.Add("You demand if that’s all he’s going to say for himself.", parse);
				Text.NL();
				Text.Add("<i>“It is,”</i> he tells you. <i>“Now, unless you intend to force me, you should perhaps be on your way.”</i>", parse);
			}
			else {
				Text.Add("You approach Lei, [comp]but even when you're a few tables away he seems to take no notice of you. When you stand directly before him, he finally looks up.", parse);
				Text.NL();
				if(playerLevel < Lei.PartyStrength.LEVEL_STRONG) {
					Text.Add("<i>“You're blocking my view again.”</i>", parse);
					Text.NL();
					Text.Add("Your emotions rise a little at his dismissive tone, but you keep yourself under control. Refusing to move, you ", parse);
				}
				else {
					Text.Add("<i>“I appreciate you coming to see me again,”</i> he says, smiling slightly, <i>“but please stop blocking my view.”</i>", parse);
					Text.NL();
					Text.Add("You're a little annoyed with him for mentioning trivialities when you have a serious concern, and refuse to move. You ", parse);
				}
				Text.Add("tell him that you saw him stalking the man and woman as they exited the inn, and that you want an explanation.", parse);
				Text.NL();
				Text.Add("<i>“No.”</i> You look at him incredulously. You demand if that's all he's going to say for himself. <i>“It is,”</i> he tells you. <i>“Now, unless you intend to force me, please stop blocking my view.”</i>", parse);
			}
			
			Text.Add(" He raises one eyebrow quizzically.", parse);
			lei.relation.DecreaseStat(-15, 1);
			Text.Flush();
			
			//[Fight][Bribe][Observe]
			var FightPrompt = function() {
				var options = new Array();
				options.push({ nameStr : "Fight",
					func : function() {
						Text.Clear();
						Text.Add("You tell him that you <i>will</i> use force if that's what it's going to take.", parse);
						Text.NL();
						if(player.level < Lei.PartyStrength.LEVEL_WEAK) {
							Text.Add("<i>“Very well, let's get this over with.”</i> Lei looks bored, like your challenge has just made him sleepier. <i>“I warn you, <b>you will lose</b>.”</i> The last words ring oddly as he speaks them, making the air tremble as if they had the force of an avalanche, instead of being spoken softly as they had been to your ears.", parse);
							Text.Flush();
							
							//[Fight][Observe]
							var options = new Array();
							options.push({ nameStr : "Fight",
								func : function() {
									Text.NL();
									Text.Add("You decide it doesn't matter how menacing he makes himself sound. You'll take him on and make him tell you what you want to know.", parse);
									Text.NL();
									
									Scenes.Lei.BarFight();
								}, enabled : true,
								tooltip : "His confidence only serves to anger you further, and you resolve to fight."
							});
							options.push({ nameStr : "Observe",
								func : function() {
									Text.Clear();
									Text.Add("You decide that perhaps discretion is the better part of valor after all. Your cheeks flushing with shame, you tell him that you will bow to his judgement in this, and decline to fight him after all.", parse);
									Text.NL();
									Text.Add("He pauses for a moment, before deciding. <i>“That is wise. The weak live longest when they are cowardly.”</i>", parse);
									Text.NL();
									Text.Add("You stalk off from him, trying to contain your embarrassment and your fury, and decide that you'll watch him for now and ferret out whatever his secret might be that way.", parse);
									Text.NL();
									
									Scenes.Lei.ObserveMain();
								}, enabled : true,
								tooltip : "You decide that watching him might be better than trying to fight."
							});
							Gui.SetButtonsFromList(options);
						}
						else if(player.level < Lei.PartyStrength.LEVEL_STRONG) {
							Text.Add("<i>“It is perhaps not a wise choice that you make, but I could use some light exercise while I wait.”</i> You grit your teeth at his flippant words and resolve that you'll make him tell you everything that you want to know.", parse);
							Text.NL();
							Scenes.Lei.BarFight();
						}
						else {
							Text.Add("Lei's eyes seem to light up as you challenge him, and you see a smile spread over his shadowed face. <i>“Yes, this should be interesting.”</i> He seems downright excited. You're not sure he even cares what the fight is about.", parse);
							Text.NL();
							Scenes.Lei.BarFight();
						}
					}, enabled : true,
					tooltip : "Challenge Lei to a fight to get an explanation."
				});
				options.push({ nameStr : "Bribe",
					func : function() {
						Text.Clear();
						Text.Add("You recall that one of the things Lei said he valued was money, so you swallow your pride and offer to pay him for an explanation.", parse);
						Text.NL();
						Text.Add("<i>“How unexpected,”</i> he remarks. <i>“Very well, I will accept four hundred coins in exchange for an explanation that will resolve your concerns regarding the couple one way or the other.”</i>", parse);
						Text.Flush();
						
						//[Pay][Nevermind][Observe]
						var options = new Array();
						options.push({ nameStr : "Pay",
							func : function() {
								Text.NL();
								Text.Add("Grudgingly, you accept his price, and hand over the coins. He accepts them without counting, and nods at you slightly.", parse);
								party.coin -= 400;
								lei.relation.IncreaseStat(100, 2);
								Text.Flush();
								Gui.NextPrompt(Scenes.Lei.ExplanationMain);
							}, enabled : party.coin >= 400,
							tooltip : "Pay 400 coins for the explanation."
						});
						options.push({ nameStr : "Nevermind",
							func : function() {
								Text.NL();
								Text.Add("You decide that you aren't willing to pay quite that much for a simple explanation, and reconsider your options.", parse);
								Text.Flush();
								FightPrompt();
							}, enabled : true,
							tooltip : "That's more than you're willing to pay."
						});
						options.push({ nameStr : "Nah",
							func : function() {
								Text.Clear();
								Text.Add("He's asking an outrageous amount! You decide that you'll find out for yourself, and resolve to watch him for now.", parse);
								Text.NL();
								Scenes.Lei.ObserveMain();
							}, enabled : true,
							tooltip : "Decline to pay. You’ll instead wait and see what Lei does for now."
						});
						Gui.SetButtonsFromList(options);
					}, enabled : true,
					tooltip : "Offer to pay Lei for an explanation."
				});
				options.push({ nameStr : "Observe",
					func : function() {
						Text.Clear();
						Text.Add("You decide it’s going to be too troublesome to get an answer out of him directly, and stalk away, pretending frustration. Mostly pretending, anyway.", parse);
						Text.NL();
						Scenes.Lei.ObserveMain();
					}, enabled : true,
					tooltip : "Wait and see what Lei does for now. If he’s following the couple, maybe they’ll show up here too."
				});
				Gui.SetButtonsFromList(options);
			}
			FightPrompt();
		}, enabled : true,
		tooltip : "Confront Lei about following the couple."
	});
	options.push({ nameStr : "Observe",
		func : function() {
			Text.Clear();
			Scenes.Lei.ObserveMain(first);
		}, enabled : true,
		tooltip : "Just wait and see what Lei does for now. If he’s following the couple, maybe they’ll show up here too."
	});
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("On second thought, you decide, it's probably not worth bothering with him just now. The issue of him and the couple can wait until later.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You don’t feel quite ready to deal with his stalking yet. Perhaps you’ll come back to it another time."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Lei.ExplanationMain = function() {
	var parse = {
		
	};
	
	Text.Clear();
	
	Text.Add("<i>“Ask what you will,”</i> Lei tells you.", parse);
	Text.NL();
	Text.Add("Deciding to get right to the point, you ask him why he was following the couple when they left the inner district.", parse);
	Text.NL();
	Text.Add("<i>“I am their bodyguard,”</i> he answers simply. <i>“And, I suppose, their... chaperone.”</i>", parse);
	Text.NL();
	Text.Add("You nod at his explanation. It does sort of make sense, and ", parse);
	if(lei.flags["HeardOf"] == 0) {
		Text.Add("he doesn't look like he's lying - ", parse);
		if(player.Int() > 30)
			Text.Add(" you're pretty confident that you could tell if he was.", parse);
		else
			Text.Add(" although you suspect he could bluff you if he wanted.", parse);
	}
	else
		Text.Add("you have heard that Lei always speaks only the truth.", parse);
	Text.NL();
	Text.Add("You ask why he was following so far away from them then.", parse);
	Text.NL();
	Text.Add("<i>“That much distance is not a problem for me,”</i> he says", parse);
	if(lei.flags["Fought"] != Lei.Fight.No)
		Text.Add(", and having fought him, you have no trouble believing that.", parse);
	else
		Text.Add(".", parse);
	Text.Add(" <i>“They wished for discretion, and apparently they think I stand out.”</i> He gestured over his sculpted, vaguely menacing figure, and the large sword he always has with him, as if he can’t understand why anyone would believe that.", parse);
	Text.NL();
	Text.Add("You ask him who they are, anyway.", parse);
	Text.NL();
	parse["paid"] = (lei.flags["Fought"] == Lei.Fight.No) ? "paid enough" : "fought a hard enough bout";
	Text.Add("<i>“You have not [paid] for that answer. If you wish to know, you might try asking them when they come down.”</i> Saying that, Lei turns away from you, his explanation apparently concluded, and resumes his watch over the tavern.", parse);
	Text.NL();
	Text.Add("You decide you’re not going to get any more out of him, and leave him to his duty, wondering at his vigilance in this high class area of the city. You’re both relieved and a little disappointed that the couple was safe all along. It seems like you won’t have the chance to do them an easy favor, but perhaps they could still assist you.", parse);
	Text.NL();
	Text.Add("You also can’t help but wonder who they are to merit such a guardian.", parse);
	Text.Flush();
	
	//[Wait][Nah]
	var options = new Array();
	options.push({ nameStr : "Wait",
		func : function() {
			Text.Clear();
			Text.Add("You decide you might as well get it over with, and settle in to wait for the couple to come. You sit beside Lei, careful not to block his view, and the two of you drink in almost companionable silence while you wait.", parse);
			Text.NL();
			Text.Add("Sitting at the table by the wall, your only warning is the sound of two people’s steps before a red-headed couple emerge from the stairway. The way they walk, backs held straight, close enough that they are almost touching, seems familiar. Lei’s instant shift in attention towards them is enough to confirm your guess that this is the pair you were looking for.", parse);
			Text.NL();
			Text.Add("To your surprise, you find that the young man and woman are wearing modest clothes - grey woolens better suited to poor commoners rather than the rich dress you expected to see. Perhaps they really are trying to be discrete, as Lei had said. If so, it’s not working very well, as the dull clothes provide a cute contrast to their blazing red hair, making them stand out all the more.", parse);
			Text.NL();
			Text.Add("As they pass the table, Lei rises, and you follow suit and accompany him to the door.", parse);
			Text.NL();
			Text.Add("Once you are outside, Lei whistles piercingly, and you look at him in puzzlement. <i>“If you want to meet them, let us get it over with, instead of having you trail after us like a stray puppy.”</i>", parse);
			Text.NL();
			parse["paid"] = (lei.flags["Fought"] == Lei.Fight.No) ? "bribed" : "fought";
			Text.Add("Ahead of you, the couple turns down a narrow alleyway and you follow after them along with Lei. They look at him in question and he explains that you wanted to meet them, and how you had [paid] him for an explanation. To your surprise, he even provides a short summary of what you told him about yourself, and why you wanted to see them.", parse);
			Text.NL();
			
			// TODO: Twins relationship ++
			
			Text.Add("<i>“Oh, I see, I see!”</i> the man exclaims, his voice light and melodious. <i>“So now you're really curious who would have someone like Lei for a guard.”</i> He pauses for a few moments, thinking, tapping his finger against his lips cutely. Now probably wouldn’t be the best time to say that you actually just wanted to see if they could get you into the castle grounds. <i>“Well, I can't very well just tell you when Lei got <b>his</b> price from you.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Tell you what, prove that you're worthy of trust, and we'll tell you who we are. And maybe we'll have a few small jobs for you afterward, and, of course, we are always happy to recompense someone who helps us... whether with money, or-”</i> he gives his companion's rump a playful squeeze, and she lets out a squeal, <i>“-favors.”</i>", parse);
			Text.NL();
			Text.Add("You have to admit that that sounds intriguing, and ask if one of the favors could include getting into the Castle Grounds past the royal guards.", parse);
			Text.NL();
			Text.Add("The young man grins. <i>“Of course, that is certainly a possibility. We can do many things for our friends.”</i>", parse);
			Text.NL();
			Text.Add("Well, it’s not quite a promise, but it seems like a good lead. Besides, your curiosity is still unsatisfied, so you ask him what it is that he would have you do.", parse);
			Text.Flush();
			Gui.NextPrompt(Scenes.Lei.RequestMain);
		}, enabled : true,
		tooltip : "Wait for the well-dressed couple you saw earlier and try to meet them."
	});
	/*
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("You decide that with at least the small mystery of what Lei was doing resolved, you can return to your other affairs for now. Trying to get into the castle can wait a bit.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : false, //TODO TEMP
		tooltip : "The couple is safe, and you have other things to do. Maybe you'll meet them another time."
	});
	*/
	Gui.SetButtonsFromList(options);
}

Scenes.Lei.ObserveMain = function(first) {
	var parse = {
		drink : party.Alone() ? "a drink" : "some drinks"
	};
	
	if(party.Two()) {
		parse["comp"]  = " with " + party.Get(1).name;
		parse["comp2"] = ", while chatting idly with " + party.Get(1).name;
	}
	else if(!party.Alone()) {
		parse["comp"]  = " with your companions";
		parse["comp2"] = ", while chatting idly with your companions";
	}
	else {
		parse["comp"]  = "";
		parse["comp2"] = "";
	}
	
	if(first) {
		Text.Add("Somehow, after talking to the man, you don’t feel like asking him after all. He probably wouldn’t answer anyway - it’ll be easier to find out for yourself.", parse);
		Text.NL();
		Text.Add("You murmur a goodbye and leave Lei’s table, making your way towards the middle of the common room. You pick out a seat at an empty table and settle in[comp]. It might be a little obvious you’re keeping track of him, but you figure there’s not much he can do about it.", parse);
		Text.NL();
		Text.Add("You", parse);
	}
	else {
		Text.Add("Taking a seat, you settle in to wait for Lei to make a move, and", parse);
	}
	
	Text.Add(" order [drink]. Some time passes, while you keep watch of his general vicinity to make sure he hasn't moved[comp2]. You aren't quite sure if he's noticed you observing him or not, as his eyes keep drifting generally over the crowd in an unchanged pattern.", parse);
	Text.NL();

	// TODO #-drinks cost

	Text.Add("Eventually, as you're beginning to wonder if this is really worth your time, your eyes snap up to the staircase and you see a red-haired couple descending. The way they walk, backs held straight, close enough that they are almost touching, seems familiar, and Lei’s instant shift in attention towards them is enough to confirm your suspicion that this is the pair you were looking for.", parse);
	Text.NL();
	Text.Add("To your surprise, you find that the young man and woman are wearing modest clothes - grey woolens better suited to poor commoners rather than the rich garments you expected to see. Despite that, their proud bearing and the unusual blazing red of their hair somehow makes you feel like they’re more than their dress suggests.", parse);
	Text.NL();
	
	if(party.Two())
		parse["comp"] = "and your companion ";
	else if(!party.Alone())
		parse["comp"] = "and your companions ";
	else
		parse["comp"] = "";
	//{and your companions }
	
	Text.Add("As they pass by Lei, he again follows. By the time you remember you were supposed to talk to them and perhaps warn them about their stalker, they are most of the way to the door, and you hurry to catch up, pushing through the crowded common room.", parse);
	Text.NL();
	Text.Add("You make it through the door a little after Lei, and, spotting him walking down the street towards the lower sections of the city, hurry after him. You consider rushing past him towards the pair, but feel a tinge of worry at the idea. He would probably try to stop you, and you’re not sure you want to cross him without a good reason. Better to watch for now.", parse);
	Text.NL();
	Text.Add("You keep going in this odd little procession. Out front, the red-haired couple leads, Lei follows thirty paces behind them, and finally you [comp]trail another thirty paces behind him. Fortunately, there are still quite a few people out and about, so the fact that you’re following shouldn’t be too blatant.", parse);
	Text.NL();
	Text.Add("You begin to wonder just where the couple is going, as you pass through the market, walking past the closed stalls, and down into the residential area. The houses here are noticeably shabbier, and smells whose origins you have no desire to know assail your nostrils. Ahead of you, you see the couple turning down a narrow street, barely more than an alley, and Lei follows them soon after. You rush after him, fearing to once again lose them in the warren of buildings.", parse);
	Text.NL();
	Text.Add("As you round the corner, you find yourself face to face with the red-haired pair, who examine you quizzically, Lei leaning against the building wall a few steps behind them.", parse);
	Text.NL();
	Text.Add("<i>“You went to so much trouble to follow us,”</i> the man addresses you, his voice light and melodious, almost stirring desire within you despite the innocuous words, <i>“so what is it that you'd like?”</i> You see his left hand rubbing slowly over his companion's rear, and he grins at you mischievously.", parse);
	Text.NL();
	Text.Add("You glance away awkwardly, and explain that you saw Lei following them and wanted to make sure they were safe. With Lei leaning calmly against the wall, the explanation sounds a little lame, even to your ears.", parse);
	Text.NL();
	Text.Add("<i>“So noble of you! But, well, as you can see, Lei is actually quite tame.”</i> He grins at you, though you have trouble imagining the menacing shadow of Lei behind him being ‘tame'.", parse);
	Text.NL();
	Text.Add("You mutter some excuse for bothering them, wondering if you can really ask about getting into the castle grounds like this, but he interrupts you. <i>“Don’t worry, that’s quite alright, nobility, after all, is a virtue.”</i> He pauses for a moment, biting his lower lip, which looks oddly attractive with his somewhat feminine features, before deciding.", parse);
	Text.NL();
	Text.Add("<i>“In fact, we could use someone trustworthy to help us out, my lover and I.”</i> At the word ‘lover' he gives a firm squeeze to his companions buttocks, and she lets out a cute squeal. <i>“Tell you what, do us a small favor to prove that you are reliable as well as noble, and we will have some real work for you. And, of course, whenever you help us out, we'll be happy to compensate with money, or if you like, favors.”</i> His lewd smile on the word ‘favors' leaves you with little doubt just what kind he has in mind.", parse);
	Text.NL();
	Text.Add("Despite his poor clothes and lecherous behavior, the man still has the bearing of a king - an incongruous contrast. You hesitantly ask him if one of the favors might include a pass into the castle grounds.", parse);
	Text.NL();
	Text.Add("The young man grins, looking unsurprised. Lei probably told him about your conversation earlier. <i>“Of course, that is certainly a possibility. We can do many things for our friends.”</i>", parse);
	Text.NL();
	Text.Add("Well, it’s not quite a promise, but it seems like a good lead. Besides, you can’t help but feel curious as to who these two are. You ask what he wants you to do for this trial errand.", parse);
	Text.Flush();
	
	Gui.NextPrompt(Scenes.Lei.RequestMain);
}

Scenes.Lei.RequestMain = function() {
	Text.Clear();
	
	var parse = {
		
	};
	
	Text.Add("<i>“Well, we have this fencing tutor, you see. Lord Krawitz is his name, and he's always been a pompous old goat, but lately he's become simply intolerable. Just the other day my... ah, lover,”</i> he says, correcting himself at the last moment, <i>“asked him what the proper response to a Metrind parry was, and he launched into a half hour rant about how the proper response to everything was focus. That fencing is an art of the mind, not simple patterns of the body.”</i> He waves his hands in disgust and dismissal.", parse);
	Text.NL();
	Text.Add("<i>“Unfortunately, we can't tell the stuck-up jackass what we think of him to his face, so, I'd like you to get us a little payback for all the annoyance he's caused us over the years. Nothing drastic mind you, but I want him to suffer.”</i> The man's grin looks a little scary as he says this. <i>“To be humiliated publicly, shamed, have his reputation destroyed, that sort of thing.”</i> At his side, his companion seems to smile shyly and give a slight nod at the idea.", parse);
	Text.NL();
	Text.Add("You say that you'll think about it, although it might take you some time to figure out what to do.", parse);
	Text.NL();
	Text.Add("He inclines his head slightly, accepting that, and asks if there's anything you'd like to know about Lord Krawitz.", parse);
	Text.Flush();
	
	var talkedPersonality = false;
	var talkedStatus = false;
	var TalkPrompt = function() {
		
		//[Personality][Status][Nothing else]
		var options = new Array();
		if(!talkedPersonality) {
			options.push({ nameStr : "Personality",
				func : function() {
					Text.Clear();
					Text.Add("You ask just what makes Krawitz so annoying.", parse);
					Text.NL();
					Text.Add("The red-haired man lets out a moan of disgust. <i>“Just about everything. Let's see, he thinks he's important because...”</i> he hesitates, <i>“of various reasons. But he's really not, so he just comes off as supremely arrogant. He's long-winded, boring, and a hardcore human purist to boot.”</i>", parse);
					Text.NL();
					Text.Add("You ask what he means by human purist.", parse);
					Text.NL();
					Text.Add("<i>“He hates morphs. Thinks they shouldn't be allowed within five meters of standard humans, and sometimes goes on rants on how they should be thrown out of the city outright. Oh, don't think that stops him from having a full staff of morph servants, though. He's too much of a cheapskate to actually pay for pure humans, no matter what he claims his beliefs are.”</i>", parse);
					Text.NL();
					Text.Add("You nod at the explanation and wonder if that could be used to your advantage somehow.", parse);
					Text.Flush();
					
					talkedPersonality = true;
					TalkPrompt();
				}, enabled : true,
				tooltip : "Ask what kind of person Lord Krawitz is."
			});
		}
		if(!talkedStatus) {
			options.push({ nameStr : "Status",
				func : function() {
					Text.Clear();
					Text.Add("You can't help but notice the ‘Lord' part of Krawitz's monicker, and ask if it's really okay for you to offend someone like that.", parse);
					Text.NL();
					Text.Add("<i>“Don't worry about it,”</i> the man tells you. <i>“He might be a lord, but his only major property is a house in the plaza district. He has no real power to speak of, although I think he deludes himself into thinking he does. Most of the other nobles laugh at him behind his back. If anything, you'll probably end up winning friends in the upper classes.”</i>", parse);
					Text.NL();
					Text.Add("You wonder who the pair is that they are so well acquainted with the ways of the upper classes, but decide to focus on your task for now.", parse);
					Text.Flush();
					
					talkedStatus = true;
					TalkPrompt();
				}, enabled : true,
				tooltip : "Ask about Lord Krawitz's social status and power."
			});
		}
		options.push({ nameStr : "Nothing else",
			func : function() {
				Text.Clear();
				Text.Add("You decide that you've learned the basics of the situation, so it's time to get going. The man tells you the location of Krawitz's house, and says that you should come find Lei in the Lady's Blessing tavern when you're done, and you part ways.", parse);
				Text.NL();
				Text.Add("As you're about to head off, Lei approaches you, letting the couple gain a little distance from him.", parse);
				Text.NL();
				Text.Add("<i>“If you would like some advice on this, visit me at the Lady's Blessing later,”</i> he tells you, before turning around and following after his charges.", parse);
				Text.NL();
				Text.Add("You briefly wonder if he actually likes you before going on your way.", parse);
				Text.Flush();

				twins.flags["Met"] = Twins.Met.Met;
				// Start KrawitzQ
				rigard.Krawitz["Q"] = Rigard.KrawitzQ.Started;
				party.location = world.loc.Rigard.Plaza;
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You know enough for now."
		});
		Gui.SetButtonsFromList(options);
	}
	TalkPrompt();
}

/* TODO Unused?
Scenes.Lei.InnFirstPrompt = function() {
	var parse = {
		
	};
	
	world.TimeStep({minute: 5});
	
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	
	var options = new Array();
	if(Scenes.Lei.InnFirstTalkedCastle == 0) {
		options.push({ nameStr : "Castle",
			func : function() {
				Text.Clear();
				Text.Add("You tell Lei that you have business in the castle, and wonder if he knows how one would get inside.", parse);
				Text.NL();
				Text.Add("<i>“One must be invited to gain entrance.”</i> He glances at you, clearly doubtful that you would receive such an invitation. <i>“And not by me. You might try to come to the attention of some royal personage, or of a major noble. Or, I suppose, you could try to gain favor with the guards themselves, so that they permit you entry on trust and respect. There might be some other, more hidden, paths as well, but I am unfamiliar with them.”</i>", parse);
				Text.NL();
				Text.Add("Although that wasn't very useful, you still thank him for the information.", parse);
				Text.NL();
				Text.Flush();
				Scenes.Lei.InnFirstTalkedCastle = 1;
				Scenes.Lei.InnFirstPrompt();
			}, enabled : true,
			tooltip : "Ask him if he knows how to get into the castle."
		});
	}
	if(Scenes.Lei.InnFirstTalkedJoin == 0) {
		options.push({ nameStr : "Join",
			func : function() {
				Text.Clear();
				Text.Add("He seems quite strong, and although you don't know much about him, it wouldn't hurt to test the waters. You ask him if he'll accompany you on your travels.", parse);
				
				if(player.level >= Lei.PartyStrength.LEVEL_STRONG)
					Text.Add("He looks at you with apparent interest. <i>“Perhaps... There is a chance that I may be interested in travelling with you. Unfortunately, just now I am preoccupied with other duties,”</i> he tells you, sounding genuinely regretful. <i>“Come and ask me again some time, and we will discuss it if you like.”</i>", parse);
				else
					Text.Add("<i>“As I said,”</i> he tells you, sounding bored, <i>“I am interested in but two things. Fortune and strength. I am not sure which it is that you think you can offer me.”</i> He pauses, looking you over again. <i>“Well, I do see some spark of potential within you,”</i> he continues, his tone softening. <i>“Perhaps we can speak of this again some other time. For now, I am preoccupied with other duties.”</i>", parse);
				Text.NL();
				Text.Add("You have no choice but to accept his refusal for now, and resolve to ask him again when you next meet him.", parse);
				Text.NL();
				Text.Flush();
				Scenes.Lei.InnFirstTalkedJoin = 1;
				Scenes.Lei.InnFirstPrompt();
			}, enabled : true,
			tooltip : "Ask him if he's willing to help out on your travels."
		});
	}
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("You decide you have better things to do than drag words out of him if he has no desire to speak.", parse);
			Text.NL();
			Scenes.Lei.InnFirstLeaving();
		}, enabled : true,
		tooltip : "Nevermind, the man seems more trouble than he's worth."
	});
	if(options.length > 1) {
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("You run out of questions and decide to leave him to whatever it is he's doing for now. Maybe he'll be more talkative next time.", parse);
		Text.Flush();
		Gui.NextPrompt(function() {
			Text.Clear();
			Scenes.Lei.InnFirstLeaving();
		});
	}
}
*/

world.loc.Rigard.Inn.common.events.push(new Link(
	function() {
		return lei.flags["Met"] >= Lei.Met.KnowName ? "Lei" : "Stranger";
	}, function() { return lei.IsAtLocation(world.loc.Rigard.Inn.common); }, function() { return rigard.flags["RoyalAccessTalk"] > 0; },
	function() {
		if(lei.IsAtLocation(world.loc.Rigard.Inn.common)) {
			if(lei.flags["Met"] < Lei.Met.SeenGates) {
				Text.Add("You notice a man sitting in the corner of the room on his own, a hood covering his face. There are a few others alone, a few others concealing their faces, but what draws your eye the most is his stillness. Whereas all others in the tavern are motion, he sits completely still, his only movements the occasional tilt of his head, as he seems to scan the room, and the movement of his hand as he nurses some drink in a dark glass. Everything about him works to pique your curiosity, but you can’t quite come up with a reason to approach him.");
				lei.flags["Met"] = Lei.Met.SeenInn;
			}
			else if(lei.flags["Met"] == Lei.Met.SeenGates)
				Text.Add("You notice a man sitting in the corner of the room on his own, a hood hiding his face. His clothes are the same dark shade as that of the man you saw following the couple earlier, and something about his still watchfulness makes you suspicious. Perhaps you should approach him and investigate.");
			else if(lei.flags["Met"] == Lei.Met.KnowName)
				Text.Add("You see Lei back at his table in the corner of the room. He seems to be scanning the room much as he was last time. Perhaps it’s time to make a concerted effort to find out what his connection is with that couple.");
			else
				Text.Add("You see Lei sitting in the corner of the room, nursing his habitual drink. He seems vigilant, as always, scanning the room slowly between sips.");
			Text.NL();
		}
		else if(lei.flags["Met"] >= Lei.Met.KnowName) {
			Text.Add("Lei is not in his usual spot.");
			Text.NL();
		}
		Text.Flush();
	},
	function() {
		if(rigard.Krawitz["Q"] < Rigard.KrawitzQ.Started) {
			Scenes.Lei.InnPrompt();
		}
		else {
			Scenes.Lei.InnPromptRepeatApproach();
		}
	}
));

Scenes.Lei.BarFight = function() {
	var parse = {
		time     : world.time.DayTime(),
		feetDesc : function() { return player.FeetDesc(); },
		p1name   : function() { return party.Get(1).name; }
	};
	parse["temperature"] = world.time.season == Season.Summer ? "warm" :
		                   world.time.season == Season.Winter ? "cold" :
		                   "cool";

	Text.Add("You follow him outside the tavern and step out into the [temperature] [time]. He walks on a little up the street away from the tavern's entrance and he turns around to face you.", parse);
	Text.NL();
	Text.Add("<i>“Since it is a small thing you ask, it will be but a small fight. My sword will remain sheathed, and you need only prove your mettle to persuade me, not defeat me outright.”</i>", parse);
	Text.NL();
	Text.Add("You nod at his concession, though a part of you wishes you could fight the arrogant man fully, and prepare yourself.", parse);
	Text.NL();
	if(party.Alone())
		Text.Add("<i>“Now, come at me!”</i>", parse);
	else
		Text.Add("<i>“Now, all of you come at me together!”</i>", parse);
	Text.Flush();
	
 	var enemy = new Party();
	enemy.AddMember(lei);
	var enc = new Encounter(enemy);
	
	lei.RestFull();
	
	enc.canRun = false;
	enc.onLoss = function() {
		lei.RestFull();
		party.RestFull();
		SetGameState(GameState.Event);
		
		var downed = true;
		for(var i = 0; i < party.members.length; i++) {
			var e = party.members[i];
			if(e.Incapacitated() == false) downed = false;
		}
		
		Text.Clear();
		if(downed) {
			Text.Add("<i>“You challenge me and then you give up? Pathetic.”</i> Throwing the word at you like a verdict, Lei stalks off, returning to the tavern.", parse);
			Text.Flush();
			lei.flags["Fought"] = Lei.Fight.Submission;
			lei.relation.DecreaseStat(-100, 5);
			Gui.NextPrompt();
		}
		else {
			lei.flags["Fought"] = Lei.Fight.Loss;
			parse["anyof"] = party.Alone() ? "" : "any of ";
			parse["s"]     = party.Alone() ? "" : "s";
			parse["comp"]  = party.Two()    ? " and " + party.Get(1).name : 
			                 !party.Alone() ? " and your companions" :
			                 "";
			Text.Add("Lei steps back from you and raises his hand. <i>“That is enough - I have no wish to kill [anyof]you. You have lost.”</i>", parse);
			Text.NL();
			Text.Add("As you[comp] are catching your breath[s], he turns to leave without saying anything further. You feel a bitter taste in your mouth, and it is not the blood from the blows he dealt you. Starting after him, you resolve that you <i>will</i> find out what the man is up to.", parse);
			Text.Flush();
			
			var observe = { nameStr : "Observe",
				func : function() {
					Text.Clear();
					Text.Add("You swallow your pride and have to admit that there's no way you're beating him head-on. Still, returning to the tavern, you decide that if you just wait and see, there's nothing he can do to stop you from doing that.", parse);
					Text.NL();
					Text.Flush();
					Scenes.Lei.ObserveMain();
				}, enabled : true,
				tooltip : "Go back to the tavern and watch him to see what he does."
			}
			
			//[Attack][Observe] strike 1
			var options = new Array();
			options.push({ nameStr : "Attack",
				func : function() {
					Text.Clear();
					Text.Add("You charge after Lei, aiming to land a telling blow while his back is turned. Somehow, as you're a step behind him, and start your lunge, he simultaneously slips to the side, without turning, making it look like you were aiming at air. You stumble and get to your feet, glaring at him.", parse);
					Text.NL();
					Text.Add("<i>“I say to you once,”</i> Lei says, sounding oddly formal, <i>“the fight is over. Desist.”</i>", parse);
					Text.NL();
					Text.Add("You glare at him, anger boiling up at the man.", parse);
					Text.Flush();
					
					lei.relation.DecreaseStat(-100, 2);
					
					//[Attack][Observe] strike 2
					var options = new Array();
					options.push({ nameStr : "Attack",
						func : function() {
							Text.Clear();
							Text.Add("A snarl of rage escapes you and you charge at him, swinging wildly at his head, but, again, he side-steps, as if you have the speed of a child.", parse);
							Text.NL();
							Text.Add("Rain begins to drizzle from the skies.", parse);
							Text.NL();
							Text.Add("<i>“I say to you twice,”</i> he intones, <i>“the fight is over. <b>If your persist, you will die.</b>”</i> His words ring oddly hollow in the air, sending cold running through your veins.", parse);
							Text.Flush();
							
							lei.relation.DecreaseStat(-100, 2);
							
							//[Attack][Observe] strike 3
							var options = new Array();
							options.push({ nameStr : "Attack",
								func : function() {
									Text.Clear();
									Text.Add("With a roar of outrage, you charge at Lei once more, your [feetDesc] finding even better purchase than before on the slightly damp cobblestones. Beyond the ability to form any coherent plans, you simply launch yourself at the man from three steps away, intending to simply hurl him down to the ground, and pound his head into the stones.", parse);
									Text.NL();
									Text.Add("<i>“So be it,”</i> his soft words seem to drift to you mid-jump, making your eyes go wide, your blood turning to ice, and your stomach lurching inside you. For a split moment, clarity seems to return to your thinking, and you wonder what it is you're doing, but you already see Lei drifting aside. He looks slow, languid even, his movements the gradual flow of a gentle stream as both his hands drift towards the hilt of his sword, and your momentum carries you slowly forward through the air.", parse);
									Text.NL();
									Text.Add("Lei's left hand reaches the pommel of his large bastard sword, and reverses course, pulling it upwards, as if it weighs nothing. His right, grips the hilt, accelerating the motion, and already imparting to the blade a soft circular spin before it even leaves the scabbard.", parse);
									Text.NL();
									Text.Add("Finally, the long dark blade emerges fully from its sheath, already tracing the arc it had begun, moving towards a yet-empty spot in the air like inevitability. As its trajectory and yours intersect, the blade passes through your neck too fast for you to feel anything, too fast for even a droplet of blood to cling to it, as it runs its course and returns smoothly to the scabbard.", parse);
									Text.NL();
									Text.Add("Momentarily, your vision continues flowing in the same arc, before turning black. You see nothing, hear nothing, as the sensation of an object touching your neck finally reaches your fading mind. There is no time to think anything, and then, for you, there is no time.", parse);
									Text.NL();
									Text.Add("<i>“I say to you thrice,”</i> Lei speaks, sounding a little sad, <i>“the fight is over.”</i> He steps past your body, and walks back towards the tavern.", parse);
									Text.NL();
									
									if(party.Two())
										Text.Add("[p1name] stands over you, looking down in mute horror", parse);
									else if(!party.Alone())
										Text.Add("Your companions gather around you, looking down in mute horror");
									else
										Text.Add("Your blood flows out over the cobblestones");
									Text.Add(", as the rain becomes a downpour.");
									Text.NL();
									Text.NL();
									Text.NL();
									Text.Add("<b>You have perished.</b>", parse);
									Text.Flush();
									
									Gui.ClearButtons();
									Input.buttons[0].Setup("Game Over", GameOver, true, null, "This is where your journey comes to an end.");
								}, enabled : true,
								tooltip : "You don't care what he threatens, attacking this man is the only thing that matters."
							});
							options.push(observe);
							Gui.SetButtonsFromList(options);
						}, enabled : true,
						tooltip : "You've still got a bit of strength in you, even if it's head-on, you simply have to land a good hit."
					});
					options.push(observe);
					Gui.SetButtonsFromList(options);
				}, enabled : true,
				tooltip : "It might be outside the rules he set, but if you can beat him now, you can force him to tell you anyway."
			});
			options.push(observe);
			Gui.SetButtonsFromList(options);
		}
	};
	enc.VictoryCondition = function() {
		return lei.HPLevel() < 0.65;
	}
	enc.onVictory = function() {
		lei.RestFull();
		party.RestFull();
		SetGameState(GameState.Event);
		
		lei.flags["Fought"] = Lei.Fight.Win;
		lei.relation.IncreaseStat(100, 2);
		
		parse["talk"] = player.level < Lei.PartyStrength.LEVEL_STRONG ? "I did not think you had it in you, to be honest. I am impressed," : "You are as strong as I had hoped... maybe stronger,";
		
		Text.Clear();
		Text.Add("<i>“Mm... that's good enough for now. Wonderful,”</i> Lei almost purrs, smiling widely at you. <i>“[talk]”</i> he says, clearly pleased. <i>“Some day, we must fight in earnest.”</i>", parse);
		Text.NL();
		Text.Add("He leads you back inside the Lady's Blessing, returning to his habitual table.", parse);
		Text.Flush();
		Gui.NextPrompt(Scenes.Lei.ExplanationMain);
	}
	
	Gui.NextPrompt(function() {
		enc.Start();
	});
}

