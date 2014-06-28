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
	
	this.flags["Met"] = 0;
	this.flags["ToldOrvin"] = 0;
	this.flags["HeardOf"] = 0;
	this.flags["Fought"] = LeiFight.No;
	
	this.timeout = new Time();
	
	if(storage) this.FromStorage(storage);
}
Lei.prototype = new Entity();
Lei.prototype.constructor = Lei;

LeiStrength = {
	LEVEL_WEAK   : 5,
	LEVEL_STRONG : 10
};
LeiFight = {
	No         : 0,
	Submission : 1,
	Loss       : 2,
	Win        : 3
};

Lei.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	
	this.timeout.Dec(step);
}

Lei.prototype.FromStorage = function(storage) {
	// Personality stats
	this.subDom.base         = parseFloat(storage.subDom)  || this.subDom.base;
	this.slut.base           = parseFloat(storage.slut)    || this.slut.base;
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	
	this.timeout.FromStorage(storage.timeout);
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Lei.prototype.ToStorage = function() {
	var storage = {};
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	
	storage.timeout = this.timeout.ToStorage();
	
	return storage;
}

Scenes.Lei = {};

// Schedule
Lei.prototype.IsAtLocation = function(location) {
	// Numbers/slacking/sleep
	if     (location == world.loc.Rigard.Inn.common && lei.timeout.Expired()) return (world.time.hour >= 14 && world.time.hour < 23);
	return false;
}

// Party interaction
Lei.prototype.Interact = function() {
	Text.Clear();
	Text.AddOutput("Rawr Imma stabbitystab.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + gwendy.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + gwendy.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + gwendy.slut.Get()));
		Text.Newline();
	}
	
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
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
	
	if(lei.flags["Met"] < 3) {
		world.TimeStep({minute: 5});
		Text.Add("You approach the stranger. Up close, you notice that underneath a dusky cloak that covers his back and whose hood hides his face in shadow, the man is wearing some sort of black form-fitting armor, nicely emphasizing his well-muscled body. When you reach his table, he looks up at you, running his eyes over you carefully.", parse);
		Text.NL();
		Text.Add("Normally, if a man examined you so closely, eyes poring over every detail, you would think that he's checking you, but something in the stranger's eyes make this examination different... it feels like he's not examining you as a potential mate, so much as potential prey, assessing whether you're worth noticing.", parse);
		Text.NL();
		Text.Add("You cough, shifting uncomfortably under his gaze, and ask if you he minds if you join him.", parse);
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
		
		if(playerLevel <= LeiStrength.LEVEL_WEAK && strongestLevel > LeiStrength.LEVEL_STRONG) {
			parse["heshe"] = strongestMember.heshe();
			parse["name"] = strongestMember.name;
			Text.Add("The stranger seems to hesitate before finally deciding. <i>\"Very well, you may sit. Not for your sake, but [heshe] appears interesting,\"</i> he says, nodding toward [name].", parse);
		}
		else if(playerLevel <= LeiStrength.LEVEL_WEAK && strongestLevel <= LeiStrength.LEVEL_WEAK) {
			Text.Add("<i>\"I have no interest in you,\"</i> the man replies, his voice husky, yet flowing. <i>\"Begone, I do not have time for the weak.\"</i>", parse);
			Text.NL();
			Text.Add("You glare at the man. You? Weak? You are momentarily tempted to challenge him there and then over the insult, but an odd shiver runs down your spine as you're about to move. Gritting your teeth, you stalk off in annoyance.", parse);
			Text.Flush();
			Gui.NextPrompt();
			return;
		}
		else if(playerLevel <= LeiStrength.LEVEL_STRONG)
			Text.Add("<i>\"Very well, you appear to have some potential,\"</i> the man replies, his voice husky, yet flowing. <i>\"You may sit if you like.\"</i>", parse);
		else
			Text.Add("<i>\"You <b>are</b> an interesting one,\"</i> the man replies, almost purring. <i>\"Please, sit.\"</i>", parse);
		Text.NL();
		if(party.Alone())
			Text.Add("You pull up a chair and sit down across from the stranger.", parse);
		else
			Text.Add("There's barely enough space at the man's table for you to pull up a single chair across from him, so you tell your party to sit down at a table a meter or two away while you talk with the stranger.", parse);
		Text.NL();
		Text.Add("<i>\"Come, there is no need to sit so far from me,\"</i> he tells you, indicating a spot beside him at the small table. Your eyebrows shoot up in surprise. <i>\"You're blocking my view,\"</i> he clarifies.", parse);
		Text.NL();
		if(playerLevel > LeiStrength.LEVEL_STRONG) {
			Text.Add("You scoot over, the stranger's eyes fixated on you the whole time. <i>\"Well then, what can I do for you?\"</i> he asks.", parse);
			Text.NL();
			Text.Add("You decide introductions are in order first, and ", parse);
		}
		else
			Text.Add("You scoot over to the side of the table, and he resumes watching the room, seemingly paying you no further mind. After half a minute of awkward silence, you decide you should make the first move even if you have to speak to the side of his head. You ", parse);

		parse["adv"] = party.Alone() ? "an adventurer" : "adventurers";
		parse["s"]   = party.Alone() ? "" : "s";
		Text.Add("introduce yourself[comp], and tell him you are [adv] of a sort.", parse);
		Text.NL();
		Text.Add("<i>\"Adventurer[s]...\"</i> he muses, <i>\"a description given if one has a goal too complicated to say in a few words or too sensitive to divulge. A goal which probably involves violence.\"</i> A slight smile creases his lips.", parse);
		Text.NL();
		Text.Add("<i>\"No matter. I am Lei.\"</i> He pauses, apparently watching for whether the name is familiar to you. ", parse);
		if(lei.flags["HeardOf"] == 0)
			Text.Add("<i>\"A simple seeker of strength and fortune. Nothing more. Nothing less.\"</i>", parse);
		// TODO: ELSE (Rumors etc, party members?)
		Text.NL();
		Text.Add("Lei's eloquence is apparently exhausted, so maybe it's time to ask him whatever it was you wanted.", parse);
		Text.Flush();
		
		// Init temporary flags
		Scenes.Lei.InnFirstTalkedCastle = 0;
		Scenes.Lei.InnFirstTalkedJoin = 0;
		Scenes.Lei.InnFirstPrompt();
		
		lei.flags["Met"] = 3;
	}
	else if(lei.flags["Met"] == 3) {
		Text.Add("You see Lei back at the same corner table he had occupied before. You feel a mixture of relief and worry that nothing seems different. He still looks out at the room with the same hollow, yet vigilant, eyes, his face still concealed in the shadows of his cloak.", parse);
		Text.NL();
		Text.Add("You wonder whether you should simply walk up to him and demand an explanation of why he was following the red-headed couple. Or perhaps you should only watch him for now and see what he does.", parse);
 		Text.Flush();
 		
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
				
				Text.Add("You approach Lei, [comp]but even when you're a few tables away he seems to take no notice of you. When you stand directly before him, he finally looks up.", parse);
				Text.NL();
				if(playerLevel < LeiStrength.LEVEL_STRONG) {
					Text.Add("<i>\"You're blocking my view again.\"</i>", parse);
					Text.NL();
					Text.Add("Your emotions rise a little at his dismissive tone, but you keep yourself under control. Refusing to move, you ", parse);
				}
				else {
					Text.Add("<i>\"I appreciate you coming to see me again,\"</i> he says, smiling slightly, <i>\"but please stop blocking my view.\"</i>", parse);
					Text.NL();
					Text.Add("You're a little annoyed with him for mentioning trivialities when you have a serious concern, and refuse to move. You ", parse);
				}
				Text.Add("tell him that you saw him stalking the man and woman as they exited the inn, and that you want an explanation.", parse);
				Text.NL();
				Text.Add("<i>\"No.\"</i> You look at him incredulously. You demand if that's all he's going to say for himself. <i>\"It is,\"</i> he tells you. <i>\"Now, unless you intend to force me, please move out of the way.\"</i> He raises one eyebrow quizzically.", parse);
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
							if(player.level < LeiStrength.LEVEL_WEAK) {
								Text.Add("<i>\"Very well, let's get this over with.\"</i> Lei looks bored, like your challenge has just made him sleepier. <i>\"I warn you, <b>you will lose</b>.\"</i> The last words ring oddly as he speaks them, making the air tremble as if they had the force of an avalanche, instead of being spoken softly as they had been to your ears.", parse);
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
										Text.Add("He pauses for a moment, before deciding. <i>\"That is wise. The weak live longest when they are cowardly.\"</i>", parse);
										Text.NL();
										Text.Add("You stalk off from him, trying to contain your embarrassment and your fury, and decide that you'll watch him for now and ferret out whatever his secret might be that way.", parse);
										Text.NL();
										
										Scenes.Lei.ObserveMain();
									}, enabled : true,
									tooltip : "You decide that watching him might be better than trying to fight."
								});
								Gui.SetButtonsFromList(options);
							}
							else if(player.level < LeiStrength.LEVEL_STRONG) {
								Text.Add("<i>\"It is perhaps not a wise choice that you make, but I could use some light exercise while I wait.\"</i> You grit your teeth at his flippant words and resolve that you'll make him tell you everything that you want to know.", parse);
								Text.NL();
								Scenes.Lei.BarFight();
							}
							else {
								Text.Add("Lei's eyes seem to light up as you challenge him, and you see a smile spread over his shadowed face. <i>\"Yes, this should be interesting.\"</i> He seems downright excited. You're not sure he even cares what the fight is about.", parse);
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
							Text.Add("<i>\"How unexpected,\"</i> he remarks. <i>\"Very well, I will accept four hundred coins in exchange for an explanation that will resolve your fears one way or the other.\"</i>", parse);
							Text.Flush();
							
							//[Pay][Nevermind][Observe]
							var options = new Array();
							options.push({ nameStr : "Pay",
								func : function() {
									Text.NL();
									Text.Add("Grudgingly, you accept his price, and hand over the coins. He accepts them without counting, and nods at you slightly.", parse);
									party.coin -= 400;
									lei.relation.IncreseStat(100, 2);
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
								tooltip : "Decline to pay, and instead wait and see what Lei does for now."
							});
							Gui.SetButtonsFromList(options);
						}, enabled : true,
						tooltip : "Offer to pay Lei for an explanation."
					});
					options.push({ nameStr : "Observe",
						func : function() {
							Text.Clear();
							Text.Add("You decide it's going to be too troublesome to get an answer out of him, but hopefully his actions will betray him.", parse);
							Text.NL();
							Scenes.Lei.ObserveMain();
						}, enabled : true,
						tooltip : "Wait and see what Lei does for now."
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
				Scenes.Lei.ObserveMain();
			}, enabled : true,
			tooltip : "Wait and see what Lei does for now."
		});
		options.push({ nameStr : "Forget it",
			func : function() {
				Text.Clear();
				Text.Add("On second thought, you decide, it's probably not worth bothering with him just now. The issue of him and the couple can wait until later.", parse);
				Text.NL();
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Leave him alone for now, and focus on the tavern."
		});
		Gui.SetButtonsFromList(options);
	}
	// TODO: LEI REPEAT STUFF
	else {
		Text.Add("PLACEHOLDER", parse);
		Text.NL();
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
		
		// TODO
		/*
		if(twins.flags["Met"] == 0) {
			// TWINS STUFF INTRO
			twins.flags["Met"] = 1;
		}
		else {
			// KNOW ABOUT THE TWINS
		}
		*/

		Text.Flush();
	}	
}

Scenes.Lei.ExplanationMain = function() {
	var parse = {
		
	};
	
	lei.flags["Met"] = 4;
	
	Text.Clear();
	
	Text.Add("<i>\"Ask what you will,\"</i> Lei tells you.", parse);
	Text.NL();
	Text.Add("Deciding to get right to the point, you ask him why he was following the red-headed couple after the last time you spoke to him.", parse);
	Text.NL();
	Text.Add("<i>\"I am their bodyguard,\"</i> he answers simply. <i>\"And, I suppose, their... chaperone.\"</i>", parse);
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
	Text.Add("<i>\"That much distance is not a problem for me,\"</i> he says", parse);
	if(lei.flags["Fought"] != LeiFight.No)
		Text.Add(", and having fought him, you have no trouble believing him.", parse);
	else
		Text.Add(".", parse);
	Text.Add(" <i>\"They wished for discretion, and apparently they think I stand out.\"</i> He gestured over his sculpted, vaguely menacing figure, and the large sword he always has with him, as if he can't understand why they would think that.", parse);
	Text.NL();
	Text.Add("You ask him who they are, anyway.", parse);
	Text.NL();
	parse["paid"] = (lei.flags["Fought"] == LeiFight.No) ? "paid enough" : "fought a hard enough bout";
	Text.Add("<i>\"You have not [paid] for that answer. If you wish to know, you might try asking them when they come down.\"</i> Saying that, Lei turns away from you, his explanation apparently concluded, and resumes his watch over the tavern.", parse);
	Text.NL();
	Text.Add("You decide you're not going to get any more out of him, and leave him to his duty, wondering at his vigilance in this high class area of the city. The couple you saw was apparently safe, but you <i>are</i> left wondering who they are to merit such a guardian.", parse);
	Text.Flush();
	
	//[Wait][Nah]
	var options = new Array();
	options.push({ nameStr : "Wait",
		func : function() {
			Text.Clear();
			Text.Add("Your curiosity gets the better of you, and you decide to settle in and wait for the couple to come. You sit beside Lei, careful not to block his view, and drink in almost companionable silence while you wait.", parse);
			Text.NL();
			Text.Add("Sitting at the table by the wall, your only warning is the sound of two people's steps before you see the red-headed couple emerge from the stairway. Or at least, you're quite sure it is them, since you have but rarely seen red hair in the city, and their height seems to match what you remember. However, this time they are clothed far more modestly, wearing grey woolens more suited to poorer commoners instead of the elegant dress they had worn when you had previously seen them.", parse);
			Text.NL();
			Text.Add("The change does seem to somewhat confirm Lei's words about their desire for discretion, and as he rises, you follow suit and accompany him to the door.", parse);
			Text.NL();
			Text.Add("Once you are outside, Lei lets out a shrill whistle, and you look at him in puzzlement. <i>\"If you want to meet them, let us get it over with, instead of having you trail after us like a stray puppy.\"</i>", parse);
			Text.NL();
			parse["paid"] = (lei.flags["Fought"] == LeiFight.No) ? "bribed" : "fought";
			Text.Add("Ahead of you, the couple turns down a narrow alleyway and you follow in after them along with Lei. They look at him in question and he explains that you wanted to meet them, and how you had [paid] him for an explanation. To your surprise, he even remembers the things you had told him the first time you had met.", parse);
			Text.NL();
			
			// TODO: Twins relationship ++
			
			Text.Add("<i>\"Oh, I see, I see!\"</i> the man exclaims, his voice light and melodious. <i>\"So now you're really curious who would have someone like Lei for a guard.\"</i> He pauses for a few moments, thinking, tapping his finger against his lips cutely. <i>\"Well, I can't very well just tell you when Lei got <b>his</b> price from you.\"</i>", parse);
			Text.NL();
			Text.Add("<i>\"Tell you what, prove that you're worthy of trust, and we'll tell you who we are. And maybe we'll have a few small jobs for you afterward, and, of course, we are always happy to recompense someone who helps us... whether with money, or-\"</i> he gives his companion's rump a playful squeeze, and she lets out a squeal, <i>\"-favors.\"</i>", parse);
			Text.NL();
			Text.Add("You have to admit that that sounds intriguing, and your curiosity is still unsatisfied, so you ask him what it is that he would have you do.", parse);
			Text.Flush();
			Gui.NextPrompt(Scenes.Lei.RequestMain);
		}, enabled : true,
		tooltip : "Wait for the well-dressed couple you saw earlier and try to meet them."
	});
	options.push({ nameStr : "Forget it",
		func : function() {
			Text.Clear();
			Text.Add("You decide that with at least the small mystery of what Lei was doing resolved, you can return to your own affairs. Perhaps later you'll speak with Lei again and find out who the pair he is guarding is.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "The couple is safe, and you have other things to do. Maybe you'll meet them another time."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Lei.ObserveMain = function() {
	var parse = {
		drink : party.Alone() ? "a drink" : "some drinks"
	};
	
	lei.flags["Met"] = 4;
	
	if(party.Two())
		parse["comp"] = ", while chatting idly with " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = ", while chatting idly with your companions";
	else
		parse["comp"] = "";
					
	Text.Add("You sit down and settle in to wait for Lei to make a move, ordering [drink]. Some time passes, while you keep watch in his general direction to make sure he hasn't moved[comp]. You aren't quite sure if he's noticed you or not, as his eyes keep drifting generally over the crowd in an unchanged pattern.", parse);
	Text.NL();

	// TODO #-drinks cost

	Text.Add("Eventually, as you're beginning to wonder if this is really worth your time, your eyes snap up to the staircase and you see what is unmistakably the same couple coming down. For some reason, this time they are clothed far more modestly, wearing grey woolens more suited to poorer commoners instead of the elegant dress they had worn when you had previously seen them. Their hair still blazes the same red, and their bearing, and obvious affection for each other make them impossible to mistake, however.", parse);
	Text.NL();
	Text.Add("Your relief at seeing them safe is tinged with confusion, as you wonder if perhaps Lei had robbed them and given them poorer clothes, or something equally bizarre. As they pass by Lei, he again follows, and this time you rise quickly and walk after him, barely even caring if he notices you trailing in his steps.", parse);
	Text.NL();
	
	if(party.Two())
		parse["comp"] = "and your companion ";
	else if(!party.Alone())
		parse["comp"] = "and your companions ";
	else
		parse["comp"] = "";
	//{and your companions }
	
	Text.Add("You follow Lei out the door, and, spotting him walking down the street towards the lower sections of the city, hurry after him. You keep going in an odd little procession. Out front, the red-haired couple leads, Lei follows about half a block behind them, and finally you [comp]trail another half a block behind him. Fortunately, there are still quite a few people out and about, so the fact that you're following shouldn't be too blatant.", parse);
	Text.NL();
	Text.Add("You begin to wonder just where the couple is going, as you pass through the market, walking past the closed stalls, and down into the back streets area. The houses here are noticeably shabbier, and smells whose origins you have no desire to know assail your nose. Ahead of you, you see the couple turning down a narrow street, barely more than an alley, and Lei follows them soon after. You rush after him, fearing to lose them in the warren of buildings.", parse);
	Text.NL();
	Text.Add("As you round the corner, you find yourself face to face with the red-haired pair, who examine you quizzically, Lei leaning against the building wall a few steps behind them.", parse);
	Text.NL();
	Text.Add("<i>\"You went to so much trouble to follow us,\"</i> the man addresses you, his voice light and melodious, almost stirring desire within you despite the innocuous words, <i>\"so what is it that you'd like?\"</i> You see his left hand rubbing slowly over his companion's rear, and he grins at you mischievously.", parse);
	Text.NL();
	Text.Add("You glance away awkwardly, and explain that you saw Lei following them and wanted to make sure they were safe. With Lei leaning calmly against the wall, the explanation sounds a little lame, even to your ears.", parse);
	Text.NL();
	Text.Add("<i>\"So noble of you! But, well, as you can see, Lei is actually quite tame.\"</i> He grins at you, though you have trouble imagining the menacing shadow of Lei in the background being ‘tame'.", parse);
	Text.NL();
	Text.Add("You mutter some excuse for bothering them, but he interrupts you. <i>\"Don't worry, that's quite alright, nobility, after all, is a virtue.\"</i> He pauses for a moment, biting his lower lip, which looks oddly attractive with his somewhat feminine features, before deciding.", parse);
	Text.NL();
	Text.Add("<i>\"In fact, we could use someone trustworthy to help us out, my lover and I.\"</i> At the word ‘lover' he gives a firm squeeze to his companions buttocks, and she lets out a cute squeal. <i>\"Tell you what, do us a small favor to prove that you are reliable as well as noble, and we will have some real work for you. And, of course, whenever you help us out, we'll be happy to compensate with money, or if you like, favors.\"</i> His lewd smile on the word ‘favors' leaves you with little doubt just what kind he has in mind.", parse);
	Text.NL();
	Text.Add("Despite his poor clothes and lecherous behavior, the man still has the bearing of a king - an incongruous contrast. You hesitantly ask him what he wants you to do for this trial errand.", parse);
	Text.Flush();
	
	Gui.NextPrompt(Scenes.Lei.RequestMain);
}

Scenes.Lei.RequestMain = function() {
	Text.Clear();
	
	var parse = {
		
	};
	
	Text.Add("<i>\"Well, we have this fencing tutor, you see. Lord Krawitz is his name, and he's always been a pompous old goat, but lately he's become simply intolerable. Just the other day my... ah, lover,\"</i> he says, correcting himself at the last moment, <i>\"asked him what the proper response to a Metrind parry was, and he launched into a half hour rant about how the proper response to everything was focus. That fencing is an art of the mind, not simple patterns of the body.\"</i> He waves his hands in disgust and dismissal.", parse);
	Text.NL();
	Text.Add("<i>\"Unfortunately, we can't tell the stuck-up jackass what we think of him to his face, so, I'd like you to get us a little payback for all the annoyance he's caused us over the years. Nothing drastic mind you, but I want him to suffer.\"</i> The man's grin looks a little scary as he says this. <i>\"To be humiliated publicly, shamed, have his reputation destroyed, that sort of thing.\"</i> At his side, his companion seems to smile shyly and give a slight nod at the idea.", parse);
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
					Text.Add("The red-haired man lets out a moan of disgust. <i>\"Just about everything. Let's see, he thinks he's important because...\"</i> he hesitates, <i>\"of various reasons. But he's really not, so he just comes off as supremely arrogant. He's long-winded, boring, and a hardcore human purist to boot.\"</i>", parse);
					Text.NL();
					Text.Add("You ask what he means by human purist.", parse);
					Text.NL();
					Text.Add("<i>\"He hates morphs. Thinks they shouldn't be allowed within five meters of standard humans, and sometimes goes on rants on how they should be thrown out of the city outright. Oh, don't think that stops him from having a full staff of morph servants, though. He's too much of a cheapskate to actually pay for pure humans, no matter what he claims his beliefs are.\"</i>", parse);
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
					Text.Add("<i>\"Don't worry about it,\"</i> the man tells you. <i>\"He might be a lord, but his only estates is a house in the plaza district. He has no real power to speak of, although I think he deludes himself into thinking he does. Most of the other nobles laugh at him behind his back. If anything, you'll probably end up winning friends in the upper classes.\"</i>", parse);
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
				Text.Add("<i>\"If you would like some advice on this, visit me at the Lady's Blessing later,\"</i> he tells you, before turning around and following after his charges.", parse);
				Text.NL();
				Text.Add("You briefly wonder if he actually likes you before going on your way.", parse);
				Text.Flush();

				twins.flags["Met"] = 1;
				// Start KrawitzQ
				rigard.Krawitz["Q"] = 1;
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You know enough for now."
		});
		Gui.SetButtonsFromList(options);
	}
	TalkPrompt();
}

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
				Text.Add("<i>\"One must be invited to gain entrance.\"</i> He glances at you, clearly doubtful that you would receive such an invitation. <i>\"And not by me. You might try to come to the attention of some royal personage, or of a major noble. Or, I suppose, you could try to gain favor with the guards themselves, so that they permit you entry on trust and respect. There might be some other, more hidden, paths as well, but I am unfamiliar with them.\"</i>", parse);
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
				
				if(player.level > LeiStrength.LEVEL_STRONG)
					Text.Add("He looks at you with apparent interest. <i>\"Perhaps... There is a chance that I may be interested in travelling with you. Unfortunately, just now I am preoccupied with other duties,\"</i> he tells you, sounding genuinely regretful. <i>\"Come and ask me again some time, and we will discuss it if you like.\"</i>", parse);
				else
					Text.Add("<i>\"As I said,\"</i> he tells you, sounding bored, <i>\"I am interested in but two things. Fortune and strength. I am not sure which it is that you think you can offer me.\"</i> He pauses, looking you over again. <i>\"Well, I do see some spark of potential within you,\"</i> he continues, his tone softening. <i>\"Perhaps we can speak of this again some other time. For now, I am preoccupied with other duties.\"</i>", parse);
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

Scenes.Lei.InnFirstLeaving = function() {
	var parse = {
		playername : player.name,
		name       : kiakai.name
	};
	
	if(party.Two())
		parse["comp"] = " with " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " with your companions";
	else
		parse["comp"] = "";
		
	Text.Add("You tell him you are going, and he nods at your words, seemingly already having forgotten your presence.", parse);
	Text.NL();
	Text.Add("As you find an empty table to sit at[comp], you glance back at Lei, and, to your surprise, find him looking toward the staircase that leads to the rooms.", parse);
	Text.NL();
	Text.Add("As your own eyes are also drawn toward it, you see a couple descending, holding hands. The two look quite young and are of a height. The man is wearing the slightly baggy style of clothes popular among the merchants, with plenty of lace along the cuffs, his partner wearing an elegant dress, and blushing prettily. The hair of both is an unusual shade of red you've only rarely seen in the city.", parse);
	Text.NL();
	Text.Add("They pass Lei's table, apparently unaware of his presence, as he follows them with his gaze. After they're a few tables past him, you see him stand up and follow them, apparently being careful to keep his distance.", parse);
	Text.NL();
	Text.Add("Suspicions swirl in your mind. You didn't think he was here to do anything bad, but perhaps your impression was wrong. What does he intend? Was he only sitting there because he was waiting for those two to ambush them for some reason? You shift in indecision, wondering whether your should follow him.", parse);
	Text.Flush();
	
	
	if(party.Two())
		parse["comp"] = ", motioning for " + party.Get(1).name + " to follow,";
	else if(!party.Alone())
		parse["comp"] = ", motioning for your companions to follow,";
	else
		parse["comp"] = "";
	
	//[Sure][Nah]
	var options = new Array();
	options.push({ nameStr : "Follow",
		func : function() {
			Text.Clear();
			Text.Add("You decide that you really should make sure that the cute-looking couple is alright. Besides, your curiosity is a piqued by Lei's sneaky behavior. Even if there's nothing to it, you might learn something to your advantage.", parse);
			Text.NL();
			Text.Add("You stand up, and[comp] head out the door. Unfortunately, it took you a little while to decide, and it takes you a few extra moments to push through the crowded inn. By the time you pull open the door and step outside, there is no sign of either Lei or the pair you had seen him following. You curse silently to yourself, but decide it would be fruitless to run searching for them down the streets. You resolve to investigate further the next time you see either him or them, and return to the inn for now.", parse);
			if(party.InParty(kiakai)) {
				Text.NL();
				Text.Add("<i>\"I do hope they are alright, [playername],\"</i> [name] speaks up beside you. <i>\"It was good of you to wish to check on them.\"</i>", parse);
				kiakai.relation.IncreaseStat(100,2);
			}
			// TODO other reactions
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Follow Lei to see what he's up to."
	});
	options.push({ nameStr : "Stay",
		func : function() {
			Text.Clear();
			Text.Add("You decide it's not worth the trouble following Lei. It's unlikely the couple will be in any danger in the middle of the city, and you suspect it could be dangerous to oppose Lei in any case.", parse);
			if(party.InParty(gwendy)) {
				Text.NL();
				Text.Add("Gwendy reaches over and pats you on the shoulder. <i>\"It's not worth following that man,\"</i> she says. <i>\"He looks way too dangerous for us to go sticking our necks out for some strangers.\"</i>", parse);
				gwendy.relation.IncreaseStat(100,2);
			}
			// TODO other reactions
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Let Lei go, it's not worth the trouble."
	});
	Gui.SetButtonsFromList(options);
	
	// lock encounter until next day
	lei.timeout = new Time(0, 0, 0, 24 - world.time.hour);
}

world.loc.Rigard.Inn.common.events.push(new Link(
	function() {
		return lei.flags["Met"] >= 3 ? "Lei" : "Stranger";
	}, function() { return lei.IsAtLocation(world.loc.Rigard.Inn.common) && rigard.flags["RoyalAccessTalk"] > 0; }, true,
	function() {
		if(lei.IsAtLocation(world.loc.Rigard.Inn.common)) {
			if(lei.flags["Met"] < 2) {
				Text.Add("You notice a man sitting in the corner of the room on his own, a hood covering his face. There are a few others alone, a few others concealing their faces, but what seems to draw your eye the most is his stillness. Whereas all others in the tavern are motion, he sits completely still, his only movements the occasional tilt of his head, as he seems to scan the room, and the movement of his hand as he nurses some drink in a dark glass. Everything about him works to pique your curiosity.");
				lei.flags["Met"] = 1;
			}
			else if(lei.flags["Met"] == 2)
				Text.Add("Again, you see the same stranger at his former table. You still do not see his face, but this time you spot a long sword resting against his chair, mostly hidden by the table and his body. You wonder if he's someone who could assist you.");
			else if(lei.flags["Met"] == 3)
				Text.Add("You see Lei back at his table in the corner of the room. He seems to be scanning the room much as he was last time. You quietly wonder to yourself what happened between him and that couple.");
			else
				Text.Add("You see Lei sitting in the corner of the room, nursing his habitual drink. He seems vigilant, as always, scanning the room slowly between sips.");
			Text.NL();
		}
		else if(lei.flags["Met"] >= 3) {
			Text.Add("Lei is not in his usual spot.");
			Text.NL();
		}
		Text.Flush();
	},
	Scenes.Lei.InnPrompt
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
	Text.Add("<i>\"Since it is a small thing you ask, it will be but a small fight. My sword will remain sheathed, and you need only prove your mettle to persuade me, not defeat me outright.\"</i>", parse);
	Text.NL();
	Text.Add("You nod at his concession, though a part of you wishes you could fight the arrogant man fully, and prepare yourself.", parse);
	Text.NL();
	if(party.Alone())
		Text.Add("<i>\"Now, come at me!\"</i>", parse);
	else
		Text.Add("<i>\"Now, all of you come at me together!\"</i>", parse);
	Text.Flush();
	
 	var enemy = new Party();
	enemy.AddMember(lei);
	var enc = new Encounter(enemy);
	
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
			Text.Add("<i>\"You challenge me and then you give up? Pathetic.\"</i> Throwing the word at you like a verdict, Lei stalks off, returning to the tavern.", parse);
			Text.Flush();
			lei.flags["Fought"] = LeiFight.Submission;
			lei.relation.DecreaseStat(-100, 5);
			Gui.NextPrompt();
		}
		else {
			lei.flags["Fought"] = LeiFight.Loss;
			parse["anyof"] = party.Alone() ? "" : "any of ";
			parse["s"]     = party.Alone() ? "" : "s";
			parse["comp"]  = party.Two()    ? " and " + party.Get(1).name : 
			                 !party.Alone() ? " and your companions" :
			                 "";
			Text.Add("Lei steps back from you and raises his hand. <i>\"That is enough - I have no wish to kill [anyof]you. You have lost.\"</i>", parse);
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
					Text.Add("<i>\"I say to you once,\"</i> Lei says, sounding oddly formal, <i>\"the fight is over. Desist.\"</i>", parse);
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
							Text.Add("<i>\"I say to you twice,\"</i> he intones, <i>\"the fight is over. <b>If your persist, you will die.</b>\"</i> His words ring oddly hollow in the air, sending cold running through your veins.", parse);
							Text.Flush();
							
							lei.relation.DecreaseStat(-100, 2);
							
							//[Attack][Observe] strike 3
							var options = new Array();
							options.push({ nameStr : "Attack",
								func : function() {
									Text.Clear();
									Text.Add("With a roar of outrage, you charge at Lei once more, your [feetDesc] finding even better purchase than before on the slightly damp cobblestones. Beyond the ability to form any coherent plans, you simply launch yourself at the man from three steps away, intending to simply hurl him down to the ground, and pound his head into the stones.", parse);
									Text.NL();
									Text.Add("<i>\"So be it,\"</i> his soft words seem to drift to you mid-jump, making your eyes go wide, your blood turning to ice, and your stomach lurching inside you. For a split moment, clarity seems to return to your thinking, and you wonder what it is you're doing, but you already see Lei drifting aside. He looks slow, languid even, his movements the gradual flow of a gentle stream as both his hands drift towards the hilt of his sword, and your momentum carries you slowly forward through the air.", parse);
									Text.NL();
									Text.Add("Lei's left hand reaches the pommel of his large bastard sword, and reverses course, pulling it upwards, as if it weighs nothing. His right, grips the hilt, accelerating the motion, and already imparting to the blade a soft circular spin before it even leaves the scabbard.", parse);
									Text.NL();
									Text.Add("Finally, the long dark blade emerges fully from its sheath, already tracing the arc it had begun, moving towards a yet-empty spot in the air like inevitability. As its trajectory and yours intersect, the blade passes through your neck too fast for you to feel anything, too fast for even a droplet of blood to cling to it, as it runs its course and returns smoothly to the scabbard.", parse);
									Text.NL();
									Text.Add("Momentarily, your vision continues flowing in the same arc, before turning black. You see nothing, hear nothing, as the sensation of an object touching your neck finally reaches your fading mind. There is no time to think anything, and then, for you, there is no time.", parse);
									Text.NL();
									Text.Add("<i>\"I say to you thrice,\"</i> Lei speaks, sounding a little sad, <i>\"the fight is over.\"</i> He steps past your body, and walks back towards the tavern.", parse);
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
									
									Gui.NextPrompt(GameOver);
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
		
		lei.flags["Fought"] = LeiFight.Win;
		lei.relation.IncreaseStat(100, 2);
		
		parse["talk"] = player.level < LeiStrength.LEVEL_STRONG ? "I did not think you had it in you, to be honest. I am impressed," : "You are as strong as I had hoped... maybe stronger,";
		
		Text.Clear();
		Text.Add("<i>\"Mm... wonderful,\"</i> Lei almost purrs, smiling widely at you. <i>\"[talk]\"</i> he says, clearly pleased. <i>\"Some day, we must fight in earnest.\"</i>", parse);
		Text.NL();
		Text.Add("He leads you back inside the Lady's Blessing, returning to his habitual table.", parse);
		Text.Flush();
		Gui.NextPrompt(Scenes.Lei.ExplanationMain);
	}
	
	Gui.NextPrompt(function() {
		enc.Start();
	});
}

