/*
 * 
 * Define SixtyNine
 * 
 */
function Room69(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Sixtynine";
	
	this.strength.base = 65;
	this.spirit.base   = 65;
	
	this.level = 0;
	
	this.flags["Rel"]     = Room69.RelFlags.NotMet;
	this.flags["Sexed"]   = 0;
	this.flags["BadStart"] = 0;
	
	this.SetLevelBonus();
	this.RestFull();
	
	if(storage) this.FromStorage(storage);
}
Room69.prototype = new Entity();
Room69.prototype.constructor = Room69;

Room69.RelFlags = {
	NotMet    : 0,
	BrokeDoor : 1,
	BadTerms  : 2,
	GoodTerms : 3
};

Room69.prototype.FromStorage = function(storage) {
	// Personality stats
	this.subDom.base         = parseFloat(storage.subDom)  || this.subDom.base;
	this.slut.base           = parseFloat(storage.slut)    || this.slut.base;
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Room69.prototype.ToStorage = function() {
	var storage = {};
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	
	return storage;
}

Scenes.Room69 = {};

// Schedule (IS a location. Heh)
Room69.prototype.IsAtLocation = function(location) {
	return location == world.loc.Rigard.Inn.room69;
}

// Party interaction
Scenes.Room69.Interact = function() {
	Text.Clear();
	Text.AddOutput("Rawr Imma room.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + room69.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + room69.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + room69.slut.Get()));
		Text.Newline();
	}
}

Scenes.Room69.Discovering69 = function() {
	var parse = {
	};
	
	Text.Clear();
	Text.Add("<i>\"Oh baby,\"</i> a voice drawls, coming from the air all around you, <i>\"you can lean on me, and I’ll hold you up all night.\"</i>", parse);
	Text.NL();
	Text.Add("You glance around, befuddled, trying to figure out if you’re so drunk that you’ve started hallucinating. Everything seems normal enough. There’s a bed, a small table, and a cabinet. They look a little dated, but not particularly out of the ordinary.", parse);
	Text.NL();
	Text.Add("You decide to sit down on the bed just in case - if you’re about to pass out, you might as well do it somewhere comfortable. As your butt touches the covers, however, you feel a gentle pinch, and hop back up with a yelp.", parse);
	Text.NL();
	Text.Add("<i>\"Don’t you worry, my sweet, this is no dream, although by the end of the night you might feel like you’re in heaven.\"</i>", parse);
	Text.NL();
	Text.Add("Convinced that even your hallucinations wouldn’t use lines this corny, you suspiciously demand just what exactly is speaking to you, as you feel yourself rapidly sobering up.", parse);
	Text.NL();
	parse["int"] = player.Int() > 25 ? ", although you smile at that last epithet" : "";
	Text.Add("<i>\"Why, I am the ultimate master-mistress,\"</i> the voice oddly doubles up on the word, as if an echo is saying both at once, <i>\"of the methods of love. The valiant sexual virtuoso, the queen-king of carnality. The scholar of sensuality, the mandarin of menda--\"</i> Your light cough is fortunately enough to interrupt the speaker mid-tirade[int].", parse);
	Text.NL();
	Text.Add("<i>\"In any case, I am all that you see about you. I am room three six nine, but you may call me Sixtynine for short, my dear.\"</i>", parse);
	Text.NL();
	Text.Add("A room?", parse);
	Text.NL();
	Text.Add("<i>\"Do not let my seeming immobility fool you,\"</i> the room says, <i>\"for all the important bits move just fine.\"</i> As if to punctuate the claim, one of the bed’s pillows crawls towards you in apparent invitation.", parse);
	Text.Flush();
	
	Scenes.Room69.introTalkedSentience = false;
	Scenes.Room69.introTriedToLeave    = false;
	
	Scenes.Room69.Discovering69Prompt();
}

Scenes.Room69.Discovering69Prompt = function() {
	var parse = {
	};
	
	//[Sentience][What now][Leave]
	var options = new Array();
	if(Scenes.Room69.introTalkedSentience == false) {
		options.push({ nameStr : "Sentience",
			func : function() {
				Text.Clear();
				Text.Add("You ask how is it that a room can talk and move.", parse);
				Text.NL();
				Text.Add("<i>\"Oh my, it is not polite to ask a lady-gentleman such questions.\"</i> The second part of the echo comes much weaker this time. <i>\"Certainly not on the first date. You must wait until we know each better, sweetling.\"</i>", parse);
				Text.NL();
				Text.Add("As you start thinking of what to do next, Sixtynine adds quietly, <i>\"Besides, from where I-we stand, that is entirely the wrong question to ask.\"</i>", parse);
				Text.Flush();
				
				Scenes.Room69.introTalkedSentience = true;
				Scenes.Room69.Discovering69Prompt();
			}, enabled : true,
			tooltip : "Ask why the room can talk and move."
		});
	}
	if(Scenes.Room69.introTriedToLeave == false) {
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("Without saying a word, you turn around, and head towards the door. You attempt to turn the handle, but it simply refuses to move.", parse);
				Text.NL();
				if(player.Str() < room69.Str()) {
					Text.Add("<i>\"Oh no, no, no,\"</i> the room chides you, sounding almost petulant, <i>\"you should not leave so soon. We have barely begun to get to know each other, dearest.\"</i>", parse);
					Text.NL();
					Text.Add("<i>\"I insist.\"</i>", parse);
					Text.NL();
					Text.Add("You decide you might as well give talking another chance before you contemplate more drastic measures.", parse);
				}
				else {
					Text.Add("You frown at the handle and apply your considerable strength to the task. A groan, and you hear the metal of the handle give, as it bends and cracks, without the latch in the wall budging at all.", parse);
					Text.NL();
					Text.Add("<i>\"Ooh, so strong!\"</i> the room remarks with some heat. <i>\"But you should save that for later - there will be plenty of chances to be rough. I promise,\"</i> it finishes in a sultry whisper.", parse);
					Text.NL();
					Text.Add("You see the handle straighten itself slowly, and decide you’ll listen to what Sixtynine has to say for now.", parse);
				}
				Text.Flush();
				
				Scenes.Room69.introTriedToLeave = true;
				Scenes.Room69.Discovering69Prompt();
			}, enabled : true,
			tooltip : "You need to get out of here. Now."
		});
	}
	options.push({ nameStr : "What now",
		func : function() {
			Text.Clear();
			Text.Add("You ask what the room wants with you.", parse);
			Text.NL();
			Text.Add("<i>\"The downside to being a room is that you just don’t have the same options when it comes to going it alone, and no one’s come to visit me in some time. All I want is for you to stay with me, sweetheart. Play with me.\"</i>", parse);
			Text.NL();
			Text.Add("Given the epithets the room gave itself, you can imagine what it has it mind.", parse);
			Text.Flush();
			
			Scenes.Room69.introTriedForce = false;
			Scenes.Room69.introTriedArgue = false;
			Scenes.Room69.Discovering69WhatNow();
		}, enabled : true,
		tooltip : Scenes.Room69.introTalkedSentience ? "You need to know what it wants from you." : "It doesn’t matter why it can talk, you just need to know what it wants."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Room69.Discovering69WhatNow = function() {
	var parse = {
		
	};
	
	//[Agree][Argue][Force]
	var options = new Array();
	options.push({ nameStr : "Agree",
		func : Scenes.Room69.Discovering69Sex, enabled : true,
		tooltip : "Maybe having some fun with Sixtynine won’t be so bad."
	});
	if(Scenes.Room69.introTriedArgue == false) {
		options.push({ nameStr : "Argue",
			func : function() {
				Text.Clear();
				parse["lust"] = player.LustLevel() >= 0.6 ? ", hoping your arousal is not too obvious" : "";
				Text.Add("Feeling a little silly arguing with an ‘empty’ room, you tell Sixtynine that you are in no mood to play right now[lust]. You explain you are drunk and tired and really in no shape to do anything with it.", parse);
				Text.NL();
				Text.Add("<i>\"Oh, do not worry, once we start, you will forget all about that. I will make it so good for you, babe, that all thoughts of tiredness will be banished from your mind. At least until we’re done.\"</i>", parse);
				Text.NL();
				Text.Add("You explain again that that is just not what you want right now, but the message does not seem to be getting across to the room. You get the feeling you’ll need to take a harsher tone and really get into a fight with Sixtynine to have any chance of getting somewhere.", parse);
				Text.Flush();
				
				Scenes.Room69.introTriedArgue = true;
				Scenes.Room69.Discovering69WhatNow();
			}, enabled : true,
			tooltip : "You are not quite sure if the room can be reasoned with, but you’re willing to try."
		});
	}
	else {
		options.push({ nameStr : "Insist",
			func : function() {
				Text.Clear();
				Text.Add("<i>\"Look, you shabby closet, I am not interested in you. You being coy about it doesn’t change anything. I don’t want to fuck some dusty cobweb-strewn pantry.\"</i>", parse);
				Text.NL();
				Text.Add("The room stays silent for a few moments after your outburst. You can’t tell what it’s thinking at all - it’s pretty inconvenient talking to something with no expressions or body language.", parse);
				Text.NL();
				Text.Add("<i>\"I-I’ll have you know I clean myself every day,\"</i> an almost whimpering voice answers. <i>\"Okay, every month anyway! And if I’m a little small, it’s no fault of mine. Go blame that innkeeper downstairs and his stingy ancestors. I’m still great in all the ways that matter. Won’t you stay with me? Please?\"</i>", parse);
				Text.NL();
				Text.Add("You can’t help but feel a little bad for the room, but you see your chance to drive home your point and get out. <i>\"No way. No how. I think something bit me while I was sitting here, you flea-ridden dump.\"</i>", parse);
				Text.NL();
				Text.Add("<i>\"J-just go. You’re so mean,\"</i> the voice is sounding more feminine and on the verge of tears. The door swings open wide, and as you rise to leave you see the table edging towards you, as if to push you out.", parse);
				Text.NL();
				Text.Add("As you make your way out into the hallway, a petulant <i>\"And don’t come back!\"</i> comes from Sixtynine as the door slams shut behind you.", parse);
				
				if(party.NumTotal() == 2)
					Text.Add(" Glancing around, you are greeted by a relieved [comp].", {comp: party.Get(1).name});
				else if(party.NumTotal() > 2)
					Text.Add(" Glancing around, you are greeted by your relieved companions.");
				Text.Flush();
				
				room69.relation.DecreaseStat(-100, 10);
				room69.flags["Rel"] = Room69.RelFlags.BadTerms;
				room69.flags["BadStart"] = Room69.RelFlags.BadTerms;
				
				Gui.NextPrompt(function() {
					party.location = world.loc.Rigard.Inn.common;
					Text.Clear();
					Scenes.Room69.Discovering69OrvinRant();
					Text.Add(" At his skeptical look, you explain that you managed to talk it into letting you leave, though it was quite unpleasant.", parse);
					Text.NL();
					Text.Add("<i>\"Well, yes, I have to admit, Sixtynine can be a little persistent at times. Still, I hope you weren’t too rough on it - it has a good heart.\"</i> You wonder if the heart is hidden under the floorboards, since all you saw above them was the libido. <i>\"It’s very kind, you know, and always willing to forgive. I recommend you give it another chance, and maybe you’ll become fast friends.\"</i>", parse);
					Text.NL();
					Text.Add("You’re not so sure that will happen, but end up promising the oddly enthusiastic innkeeper that you’ll give it a chance.", parse);
					Text.NL();
					Text.Add("<i>\"Anyway, if you don’t want to meet Sixtynine, just don’t walk into it. It’s pretty simple.\"</i>", parse);
					Text.NL();
					Text.Add("He reminds you what your room number is one more time, and heads back to his post to deal with other customers.", parse);
					Text.Flush();
					Gui.NextPrompt();
				});
			}, enabled : true,
			tooltip : "Maybe a shouting match with the room will convince it to let you out, although Sixtynine probably wouldn’t be happy about it."
		});
	}
	if(Scenes.Room69.introTriedForce == false) {
		options.push({ nameStr : "Force",
			func : function() {
				Text.Clear();
				Text.Add("You decide you don’t appreciate the room’s approach. It’s time to get out.", parse);
				Text.NL();
				if(player.PAttack() < 75 && player.MAttack() < 75) {
					Text.Add("You try to kick and batter down the door, but while it rattles slightly, it shows no signs of giving.", parse);
					if(gameCache.flags["LearnedMagic"] != 0)
						Text.Add(" You attempt to supplement your attack with a few well-placed spells, but they seem to dissolve strangely in the air, as if power is being drained from them before they can fully materialize.", parse);
					Text.Add(" As you pound fruitlessly, you hear Sixtynine humming to itself. <i>\"They can’t even hear you out there, you know,\"</i> it remarks idly.", parse);
					Text.NL();
					if(player.LAttack() > 75) {
						Text.Add("You consider trying your seduction skills on the room, but somehow you doubt they would help the situation.", parse);
						Text.NL();
					}
					Text.Add("Looks like you’ll need to try another approach.", parse);
					Text.Flush();
					
					Scenes.Room69.introTriedForce = true;
					Scenes.Room69.Discovering69WhatNow();
				}
				else if(player.PAttack() < 150 && player.MAttack() < 150) {
					if(player.MAttack() > player.PAttack()) {
						player.AddSPAbs(-15);
						Text.Add("You focus your mind, and conjure a fireball, doing your best to mold it into a thing of force more than fire, channelling it directly at the door. With a loud tearing sound, the hinges split, tearing part way out of the wall, and the door bends outwards, just barely clinging to the frame.", parse);
						Text.NL();
						Text.Add("You attempt to force it the rest of the way open with a kick, but are forced to use another spell to push it out the rest of the way.", parse);
					}
					else {
						Text.Add("You get a running start and deliver a vicious kick to the door. It would’ve probably been enough to knock down a cow, but the door barely shifts.", parse);
						Text.NL();
						Text.Add("Nonetheless, shift it does, and seeing the effect your blow had, you repeat it, hitting the door again and again. The hinges groan under your barrage of strikes, and, as you draw ragged breaths from exertion, the door gives way, and flops outwards, landing in the corridor with a dull thud.", parse);
					}
					Text.Flush();
					
					Scenes.Room69.Discovering69ForceOutro();
				}
				else {
					if(player.MAttack() > player.PAttack()) {
						player.AddSPAbs(-30);
						Text.Add("The room appears to be enchanted in some way, but the magic is weak enough that it barely causes you to slow down. You conjure the image you need, releasing it with a word, and a wave of force flings the door out of its frame, sending it bouncing off the opposite wall.", parse);
					}
					else {
						Text.Add("The room appears to be quite sturdy in its own way, but it is still as wax before your power. With a quick precise blow to the middle of the door, you send it flying outward from its frame, bouncing off the opposite wall.", parse);
					}
					Text.NL();
					Text.Add("You hope no one was standing out there.", parse);
					Text.Flush();
					
					Scenes.Room69.Discovering69ForceOutro();
				}
			}, enabled : true,
			tooltip : "Try to break down the door."
		});
	}
	Gui.SetButtonsFromList(options);
}

Scenes.Room69.Discovering69OrvinRant = function() {
	var parse = {
		
	};
	parse["IkName"] = rigard.LB["Orvin"] == 0 ? "The innkeeper" : "Orvin";
	parse["ikname"] = rigard.LB["Orvin"] == 0 ? "the innkeeper" : "Orvin";
	
	Text.Add("You return downstairs, deciding to confront [ikname] about this trap room. ", parse);
	if(Rigard.LB.OrvinIsInnkeeper())
		Text.Add("As soon as you get his attention and say enough for him to understand what you’re talking about, he leaves the bar, grabbing your hand, and forcibly pulling you behind him to the back room.", parse);
	else
		Text.Add("He’s not in the common room at this time of the night, but you demand to see him, and after a few minutes he finally comes out to meet you. As soon as you say enough for him to understand what you’re talking about, he grabs your hand, and forcibly pulls you behind him to the back room.", parse);
	Text.Add(" The glimpse you caught of his face showed a peculiar mixture of dread and what could be anger.", parse);
	Text.NL();
	
	if(party.NumTotal() <= 1)
		parse["comp"] = "";
	else if(party.NumTotal() == 2)
		parse["comp"] = Text.Parse(", leaving a bemused [comp] to again wait outside", {comp: party.Get(1).name});
	else // (party.NumTotal() > 2)
		parse["comp"] = ", leaving your bemused companions to again wait outside";
	Text.Add("He slams the door shut behind the two of you, spinning to confront you[comp]. <i>\"Look, you, that thing has been here for generations, and no one asked you to go stumbling into a room that’s not your own. It’s harmless enough in its way. It’s never hurt anyone, and... and some have even found pleasure in it.\"</i>", parse);
	Text.NL();
	Text.Add("You are taken momentarily aback by his vehemence, and point out that it was not allowing you to leave. Clearly unacceptable, especially in an inn of all places.", parse);
}

Scenes.Room69.Discovering69ForceOutro = function() {
	var parse = {
		
	};
	parse["IkName"] = rigard.LB["Orvin"] == 0 ? "The innkeeper" : "Orvin";
	parse["ikname"] = rigard.LB["Orvin"] == 0 ? "the innkeeper" : "Orvin";
	
	Text.Clear();
	Text.Add("<i>\"N-no... why would you do that?\"</i> Sixtynine asks, sounding on the edge of tears. <i>\"My door... have you ever lost a limb? I have. It’s just like that. Like where I had a hand before, now there is nothing, an emptiness.\"</i>", parse);
	Text.NL();
	Text.Add("<i>\"I will it to move, but it lies there, dead. Why? What did I do to you?\"</i>", parse);
	Text.NL();
	if(party.NumTotal() <= 1)
		parse["comp"] = "";
	else if(party.NumTotal() == 2)
		parse["comp"] = Text.Parse(", where you are greeted by a relieved [comp]", {comp: party.Get(1).name});
	else // (party.NumTotal() > 2)
		parse["comp"] = ", where you are greeted by your relieved companions";
	Text.Add("You are not sure what to say to the distraught room, and step quietly out into the hallway[comp].", parse);
	Text.NL();
	Text.Add("You hear quiet sobs coming from the empty doorway behind you.", parse);
	Text.Flush();
	
	room69.relation.DecreaseStat(-100, 25);
	room69.flags["Rel"] = Room69.RelFlags.BrokeDoor;
	room69.flags["BadStart"] = Room69.RelFlags.BrokeDoor;
	
	Gui.NextPrompt(function() {
		party.location = world.loc.Rigard.Inn.common;
		Text.Clear();
		
		Scenes.Room69.Discovering69OrvinRant();
		
		Text.Add(" At his skeptical look, you explain that you were forced to break the door down to get out.", parse);
		Text.NL();
		Text.Add("<i>\"You broke the bloody door?\"</i> [ikname] screams. He glares at you, his fists clenched at his side. For a moment, you’re sure that he’s going to take a swing at you, but finally you see him take a deep breath and force his hands to unclench, each finger seemingly only moving through a great exertion of will.", parse);
		Text.NL();
		Text.Add("<i>\"Very well,\"</i> he says at last, sounding exhausted, <i>\"I will replace it myself. I will soothe Sixtynine, so it doesn’t plan some sinister revenge. I will even serve you drinks and do my best to pretend that nothing happened. But your room is revoked, and if you ever hope to stay in this inn again, you will first go and apologize to Sixtynine, and get its forgiveness.\"</i>", parse);
		Text.NL();
		Text.Add("You’re stunned into silence momentarily, and before you can demand if he thinks kidnapping is some trivial thing, he’s pushing you out the door. <i>\"Go. I need some time to sort out the mess you’ve caused.\"</i>", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Plaza, {hour: 1});
		});
	});
}

// Lets get to the sex already!
Scenes.Room69.Discovering69Sex = function() {
	var parse = {
		playername      : function() { return player.name; },
		topArmorDesc    : function() { return player.ArmorDesc(); },
		topitthem       : function() { return player.Armor() ? "it" : "them"; },
		bottomArmorDesc : function() { return player.LowerArmorDesc(); },
		skin            : function() { return player.SkinDesc(); },
		breastsDesc     : function() { return player.FirstBreastRow().Short(); },
		nipsDesc        : function() { return player.FirstBreastRow().NipsShort(); },
		multiCockDesc   : function() { return player.MultiCockDesc(); },
		legsDesc        : function() { return player.LegsDesc(); },
		ballsDesc       : function() { return player.BallsDesc(); },
		vaginaDesc      : function() { return player.FirstVag().Short(); },
		clitDesc        : function() { return player.FirstVag().ClitShort(); },
		stomachDesc     : function() { return player.StomachDesc(); },
		boygirl         : player.mfTrue("boy", "girl"),
		isAre           : player.HasScales() ? "are" : "is",
		IkName          : rigard.LB["Orvin"] == 0 ? "The innkeeper" : "Orvin",
		ikname          : rigard.LB["Orvin"] == 0 ? "the innkeeper" : "Orvin"
	};
	
	if(player.FirstBreastRow().nippleType == NippleType.lipple ||
	   player.FirstBreastRow().nippleType == NippleType.cunt)
		parse["nipType"] = ", slightly gaping";
	else if(player.FirstBreastRow().nippleType == NippleType.cock)
		parse["nipType"] = ", already rigid";
	else
		parse["nipType"] = "";
	
	Text.Clear();
	Text.Add("You’re not sure how this is going to work, but you decide to give it a chance, and agree to the room’s request.", parse);
	Text.NL();
	Text.Add("<i>\"Well then, gorgeous, let me see all of you,\"</i> the voice asks, slithering in your ears. As if showing you an example, the covers peel back from the bed.", parse);
	Text.NL();
	Text.Add("You’ve made your decision, so, hesitating for only a moment, you sit down on the side of the bed, and start taking your [topArmorDesc] off. It actually feels quite comfortable, as if you’re undressing in an empty room by yourself. At least it does until you feel a soft touch on your back, making you jump in surprise.", parse);
	Text.NL();
	Text.Add("<i>\"Shh, don’t worry, it’s just me,\"</i> Sixtynine says, a corner of the bedsheets tracing gently along the curve of your back, sending a tingling sensation up your spine. <i>\"Your [skin] [isAre] so smooth... You feel even better than you look.\"</i>", parse);
	Text.NL();
	if(player.FirstBreastRow().Size() > 3) {
		Text.Add("Before you are even finished removing your top, the sheet snakes around you from behind under your clothes, curving around one of your breasts. <i>\"Sorry, I couldn’t wait. So soft, so lovely...\"</i>", parse);
		Text.NL();
		Text.Add("You bite your lip as the cloth tentacle squeezes your breast gently, and massages it in a circular motion beneath your clothes. You shiver as the tip traces slowly, too slowly, across your breast towards the center, barely brushing your skin. Finally, it twirls softly around your [nipsDesc], squeezing it gently. You gasp quietly, and press forward into the cloth, seeking greater stimulation.", parse);
		Text.NL();
		Text.Add("<i>\"Good [boygirl],\"</i> Sixtynine says, punctuating the praise by gently twisting your nipple, which elicits a louder moan. <i>\"You are so wonderfully sensitive. I’ll take you to heights you can’t imagine. All you have to do is behave.\"</i>", parse);
		Text.NL();
		Text.Add("You feel another brush across your back as a second sheet twists itself under your [topArmorDesc], and gets to work on your other[nipType] nipple. <i>\"Don’t forget about undressing, now,\"</i> the silky voice gently chides. Blushing, you realise that you had done just that, sitting still, your breath coming in soft gasps, all your attention on the sheet tentacles playing with your breasts.", parse);
		Text.NL();
		Text.Add("With a burst of concentration, your [topArmorDesc] comes off, and you throw [topitthem] towards a corner. Your hands are torn between reaching up to help Sixtynine with your breasts and reaching down...", parse);
		Text.NL();
		Text.Add("<i>\"Oh, would you like me to be rougher? You need only ask,\"</i> the room offers.", parse);
		Text.NL();
		Text.Add("Your blush deepens, but you incline your head a fraction in agreement.", parse);
		Text.NL();
		Text.Add("<i>\"I’m sorry, did you move just now? I did not notice. I’m afraid you will have to speak up.\"</i>", parse);
		Text.NL();
		Text.Add("Giving in, you ask for it to be rougher with your breasts, to really play with your nipples, a note of pleading entering your voice.", parse);
		Text.NL();
		Text.Add("<i>\"There’s a good [boygirl]. An honest [boygirl].\"</i> It emphasises each statement with a twist of its cloth feelers around your breasts, squeezing them tight, as it tugs on and twists your [nipsDesc]. It sets a rapid pace, mauling your chest almost painfully, your heart racing in excitement.", parse);
		Text.NL();
		Text.Add("Your hands are left free to roam downward, and that is just what they do, stripping off your [bottomArmorDesc] feverishly.", parse);
	}
	else {
		if(player.MuscleTone() > 0.66)
			parse["muscle"] = "what lovely muscles you have";
		else if(player.MuscleTone() > 0.33)
			parse["muscle"] = "a little soft, but steel underneath. A delicious combination";
		else
			parse["muscle"] = "so ample, so cuddly";
		Text.Add("As you begin removing your [topArmorDesc], the sheet slips lightly along your side, curving around you in a gentle embrace. <i>\"Mm, [muscle]. I think we are going have a lot of fun tonight,\"</i> the voice comments, throaty, almost purring.", parse);
		Text.NL();
		Text.Add("You finish with your [topArmorDesc], tossing it aside, and the encircling sheets take the opportunity to twine up to your nipples, running lightly around them, brushing gently across your skin. An involuntary shiver runs through you, and you bite your lip in excitement. The stimulation is not much in itself, but the playful cloth stirs a wave of images in your mind, showing where it might go next.", parse);
		Text.NL();
		Text.Add("In point of fact, it moves further up, gliding up your chest and caressing your neck. <i>\"You’re beautiful. You take my breath away\"</i>, the room whispers right next to you, as the sheet touches and strokes, teasing your neck, and tracing along the curve of your ear.", parse);
		Text.NL();
		parse["gen"] = Text.Parse("your [skin] tingling with every touch", parse);
		if(player.FirstCock())
			parse["gen"] = Text.Parse("and your [multiCockDesc] stiffening in your [bottomArmorDesc]", parse);
		else if(player.FirstVag())
			parse["gen"] = "and your lower lips growing moist";
		Text.Add("At the sheets’ ministrations, you feel your breathing become heavier, [gen]. Relentlessly, the cloth continues its attentions. Caressing, tickling, brushing, its motions gentle, yet deliberate, driving you further and further in your mindless excitement.", parse);
		Text.NL();
		Text.Add("You reach downwards desperately, not sure how much longer you can endure this endless teasing. The tentacles tighten around your chest momentarily and you wonder if Sixtynine plans to stop you, but they release you just as quickly. <i>\"Yes, you’d better take that off. We won’t be able to get to the real fun with it in the way.\"</i>", parse);
		Text.NL();
		Text.Add("You are only too happy to oblige, stripping off your [bottomArmorDesc] feverishly.", parse);
	}
	if(player.FirstCock() && player.FirstVag())
		parse["gen"] = Text.Parse("wet opening and rigid erection[s]", {s: player.NumCocks() > 1 ? "s" : ""});
	else if(player.FirstCock())
		parse["gen"] = Text.Parse("rigid erection[s]", {s: player.NumCocks() > 1 ? "s" : ""});
	else if(player.FirstVag())
		parse["gen"] = Text.Parse("wet opening", parse);
	Text.Add(" With the path clear, your hands do not hesitate in plunging towards your [gen]. <i>\"Ah-ah,\"</i> Sixtynine interrupts you. <i>\"Just lie back and let me take care of everything. We wouldn’t want your climax to be over too quickly...\"</i>", parse);
	Text.NL();
	Text.Add("The room has been good to you so far, and you decide to give it a chance here. You lie back on the bed, ", parse);
	if(player.FirstBreastRow().Size() > 3)
		Text.Add("and with a little regret feel the sheet tentacles disengage from your breasts and slide downwards along your body.", parse);
	else
		Text.Add("and the sheets uncurl themselves from around you, leaving you feeling oddly exposed with them gone.", parse);
	Text.Add(" You can’t help but giggle as the soft tentacles brush along your [stomachDesc], tickling you.", parse);
	Text.NL();
	parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
	parse["gen"] = player.NumCocks() > 1 ? "members" : player.NumCocks() == 1 ? "member" : player.FirstVag() ? "slit" : "crotch";
	Text.Add("Instead of going for[oneof] your [gen] as you had hoped, ", parse);
	if(player.LowerBodyType() == LowerBodyType.Single)
		Text.Add("the sheets run part way down the length of your [legsDesc], tracing along your [skin] lovingly.", parse);
	else
		Text.Add("the sheets run part way down your legs before returning to trace along the curve of your inner thighs.", parse);
	Text.Add(" You shiver in anticipation, barely able to restrain yourself from indulging your desperate need to get yourself off.", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("Responding to your obvious desire, the silken tendrils move on to the main course. They start at ", parse);
		parse["s"]      = player.NumCocks() > 1 ? "s"    : "";
		parse["notS"]   = player.NumCocks() > 1 ? ""     : "s";
		parse["itThem"] = player.NumCocks() > 1 ? "them" : "it";
		parse["itThey"] = player.NumCocks() > 1 ? "they" : "it";
		parse["largest"] = player.NumCocks() > 1 ? " largest" : "";
		parse["vag"]    = player.FirstVag() ? "above your pussy" : "from your skin";
		if(player.HasBalls())
			Text.Add("your [ballsDesc], brushing the tight skin, squeezing them gently,", parse);
		else
			Text.Add("the base of your shaft[s], circling [itThem], tenderly brushing the spot where [itThey] emerge[notS] smoothly [vag],", parse);
		Text.Add(" before moving on, curling slowly up your[largest] shaft, making sure to explore the entire surface.", parse);
		if(player.NumCocks() > 1) {
			parse["num"] = "";
			if(player.NumCocks() > 2) parse["num"] += " and then another,";
			if(player.NumCocks() > 3) parse["num"] += " and another,";
			if(player.NumCocks() > 2) parse["num"] += " each";
			Text.Add(" Another tentacle emerges,[num] finding a member for itself to play with. <i>\"Multi-tasking like this is a bit hard,\"</i> Sixtynine murmurs, concentrating, <i>\"but I think I can pull it off for you.\"</i>", parse);
		}
		Text.NL();
		parse["first"] = player.NumCocks() > 2 ? " first" : "";
		var largeCock = player.BiggestCock();
		parse["cockTipDesc"] = function() { return largeCock.TipShort(); };
		parse["cockDesc"]    = function() { return largeCock.Short(); };
		Text.Add("When the[first] tentacle reaches the tip, it curls around your [cockTipDesc], playing with the underside of your [cockDesc] until you’re nearly panting with excitement. It pauses and circles back, teasing the opening of your penis, pressing the tiniest way in before withdrawing, watching your reaction. <i>\"Perhaps another time...\"</i>", parse);
		Text.NL();
		parse["all"]     = player.NumCocks() > 2 ? " all" : "";
		parse["ts"]      = player.NumCocks() > 2 ? "s" : "";
		parse["tnotS"]   = player.NumCocks() > 2 ? "" : "s";
		parse["titThey"] = player.NumCocks() > 2 ? "they" : "it";
		parse["hasHave"] = player.NumCocks() > 2 ? "have" : "has";
		Text.Add("You look down, and discover that while you were distracted with the activity at the head of your [cockDesc],[all] the tentacle[ts] [hasHave] been curling around your [multiCockDesc] more and more, like a snake binding its prey. As you watch, [titThey] twist[tnotS] the last few turns, completely enclosing your member[s] in tightly wound silky cloth. <i>\"Time for the fun part, pet,\"</i> the ethereal voice whispers in your ear.", parse);
		Text.NL();
		Text.Add("The tendrils shiver gently, wrapped tightly around your cock[s], sending a small trembling wave across your sensitive skin. Then, apparently gathering themselves, the movements grow stronger, massaging you, first in pulses from base to tip, then changing patterns. Tip to base. Spreading waves of pressure from the middle, reaching the extremes and lapping back. The cloth slithering back and forth, rubbing against your skin.", parse);
		Text.NL();
		Text.Add("The stimulation is strange, unpredictable and completely out of your control, squeezing you, fondling you, sending shivers down your spine as the tentacles rub against every inch of your skin. Your breathing quickens, and you can’t help but thrust with your hips, your expression obviously showing the room you want more.", parse);
		Text.NL();
		if(player.FirstVag() && !player.FirstVag().clitCock) {
			Text.Add("Seeing your desire, Sixtynine seems to remember that there is more of you to play with. A smaller silky tendril emerges from somewhere, and brushes against your [clitDesc] before circling it tentatively and wrapping it in soft light fabric.", parse);
			Text.NL();
		}
		Text.Add("The tentacles’ motion accelerates, some of the movements tugging on you almost painfully, as the squeezing grows more erratic. No longer waves, but sudden grips of unexpected sensation, caressing your [multiCockDesc] in their greedy embrace.", parse);
		Text.NL();
		parse["output"] = "shoots out from";
		if(player.CumOutput() > 6) parse["output"] = "fountains from";
		if(player.CumOutput() > 3) parse["output"] = "explodes from";
		Text.Add("You don’t last long under the intensified assault, and, your mind growing blank, cum [output] your tortured package. The flow catches on the sheets that cover the opening[s], ", parse);
		if(player.CumOutput() > 3)
			Text.Add("but easily shoots through, the geyser only slightly dampened by the thin obstruction. Strings of gooey liquid fall around you and on you, spreading streaks of white across the bed and around the room. <i>\"Ooh, so messy. My sheets are completely drenched. I wonder if that’ll make them feel even better.\"</i>", parse);
		else
			Text.Add("soaking into them, and leaking down over them, to be absorbed into the mass of cloth that is refusing to release you. <i>\"Mm, making my sheets all nice and gooey. I wonder if that will make them feel even better...\"</i>", parse);
		Text.NL();
		parse["clit"] = (player.FirstVag() && !player.FirstVag().clitCock) ? Text.Parse(" and your [clitDesc]", parse) : "";
		var numThings = player.NumCocks();
		if(player.FirstVag() && !player.FirstVag().clitCock) numThings++;
		parse["isAre"]     = numThings > 1 ? "are" : "is";
		parse["ts"]        = numThings > 1 ? "s" : "";
		parse["tnotS"]     = numThings > 1 ? "" : "s";
		parse["titsTheir"] = numThings > 1 ? "their" : "its";
		
		Text.Add("The animate cloth brushes across your skin, as you lie panting from your orgasm, leaving thin trails of liquid that glisten a soft orange in the candlelight. As your breathing begins to calm, the tentacles resume their former positions, apparently having no interest in letting you fully recover. Your [multiCockDesc][clit] [isAre] again locked in a cloth prison. This time, however, the sheets drip from your orgasm, somehow making the contact all the more intimate.", parse);
		Text.NL();
		Text.Add("There is a squelching sound as the tentacle[ts] resume[tnotS] [titsTheir] motion, again rubbing and squeezing, bringing you back to full, slightly painful, erection with impressive speed. The greedy waves of cloth lap at your cock[s], pushing you onward. Your hips buck with desire, but the sheets flow with your motions, denying you any extra stimulation, staying firmly in control.", parse);
		Text.NL();
		parse["cum"] = player.CumOutput() > 6 ? " The room is almost covered in white, and still the sheets keep going." : "";
		Text.Add("You last longer this time, and recover a little more slowly, but before long, another cycle begins, and another.[cum] You lose track more and more, until you feel yourself drift out of consciousness, even as the drenched ropes of cloth continue to toy with you without pause...", parse);
	}
	else if(player.FirstVag()) {
		Text.Add("After an almost painful minute of playing with you, in which your hands practically twitch with their need to act, Sixtynine finally makes its move. Despite your anticipation, the motion still takes you unaware, and you gasp in surprise and excitement as a tentacle brushes lightly against your [clitDesc], while another runs along your nether lips, tracing around the opening.", parse);
		Text.NL();
		parse["wet"] = player.FirstVag().wetness.Get() >= 2 ? "almost fountaining fluids" : "abundantly flowing fluids";
		Text.Add("Despite yourself, you buck your hips, pressing desperately into the cloth, willing it to do more. <i>\"Patience, little one,\"</i> the voice chides you. <i>\"Anticipation is the best part.\"</i> Still, showing mercy, the tentacles advance a little, one circling your clitoris, pressing it gently through the hood, while the other explores your opening, soaking up your [wet].", parse);
		Text.NL();
		Text.Add("Apparently satisfied with the look of desperation on your face, the lower cloth feeler suddenly abandons its slow creeping pace of exploration, and pushes further inside. It penetrates easily, a thin rope of cloth rubbing slowly against just the front wall of your [vaginaDesc]. Once it’s a few inches in, however, it untwists in a flowing silky massage of your interior, as it uncoils and fills you to capacity.", parse);
		Text.NL();
		Text.Add("<i>\"I want to feel all of you. To touch all of you. All of your wonderful pussy.\"</i> You gasp as you feel the tentacle spin out even more, pushing against you, stretching you a little. <i>\"And I want you to really feel it too,\"</i> the room ends, its voice filled with desire.", parse);
		Text.NL();
		Text.Add("You simply moan in acceptance, as you feel the now enormous tentacle press another inch into you, stretching you very pleasantly, if a little painfully. It pushes deeper inside you bit by bit, making your breaths come in ragged gasps, as the mild pain is offset by the pleasure of the second tentacle lightly teasing your sensitive button.", parse);
		Text.NL();
		parse["womb"] = function() { return player.FirstVag().womb.Short(); };
		Text.Add("You arch your back and your eyes roll up in pleasure as the feeler finally bottoms out, barely brushing against the entrance to your [womb]. You feel wonderfully, deliciously full. Your insides are stimulated to capacity and even stretched slightly beyond, all with a surprising almost gentleness.", parse);
		Text.NL();
		Text.Add("That feeling is quickly forgotten, however, when the cloth tentacle starts moving. Already soft due to its material, it is further lubricated by the copious juices it has absorbed from you. It slides inside you smoothly, as if it belongs there, its curves and twists eagerly stimulating every inch.", parse);
		Text.NL();
		Text.Add("Its first few thrusts are slow, pulling out gently before pushing back in, barely faster than its initial entry, and you find yourself longing for more, even as the sensation threatens to send you over the edge. <i>\"I can see what you want, pet, and I do aim to please,\"</i> Sixtynine says. And with the words having barely penetrated into your lust-addled mind, both of the tentacles start moving faster.", parse);
		Text.NL();
		Text.Add("The tentacle on your clit grows rougher, almost mauling your sensitive [clitDesc], keeping you on the edge between pleasure and pain. The other one does not fall behind either, and thrusts faster and faster, rushing almost all the way out of you before plunging back in, pounding you as fast as it can.", parse);
		Text.NL();
		Text.Add("Lewd moans are the only sounds you can make as desire overwhelms your consciousness. As your hips buck with Sixtynine’s thrusts, and your hands eagerly maul your [breastsDesc], demands for more involuntarily escape your lips.", parse);
		Text.NL();
		Text.Add("The room is only too happy to comply, as it somehow comes up with an even greater burst of speed. Its thrusts grow even faster, turning into an almost continuous pulsing sensation of pleasure inside you. It all rapidly proves too much for you, and you feel yourself overwhelmed by an intense orgasm, your whole body shuddering, your inner walls contracting desperately around the cloth tendril.", parse);
		Text.NL();
		Text.Add("Even this does not stop Sixtynine, however, as it simply keeps going, the intense stimulation leading you into a second orgasm, and then a third...", parse);
	}
	Text.Flush();
	
	player.AddLustFraction(-1);
	
	Gui.NextPrompt(function() {
		Text.Clear();
		parse["cock"] = player.FirstCock() ? " At least you hope that’s what that is." : "";
		Text.Add("You feel your consciousness returning, but even your eyelids feel heavy, weighed down with utter exhaustion.[cock] The bed is so comfortable, and it’s so pleasant to simply lie back and do nothing. And besides, you are reluctant to disturb the afterglow of bliss that suffuses your body.", parse);
		Text.NL();
		Text.Add("Now, where did that come from? You recall accepting a ‘play’ session from an animate room, and... oh, that got quite out of hand. Quite pleasantly out of hand. After a few more moments of lying back, thinking nothing, you finally notice a pair of voices arguing somewhere around you.", parse);
		Text.NL();
		
		parse["HeShe"] = player.mfTrue("He", "She");
		parse["heshe"] = player.mfTrue("he", "she");
		parse["hisher"] = player.mfTrue("his", "her");
		parse["himher"] = player.mfTrue("him", "her");
		
		Text.Add("<i>\"...wonderful sex slave,\"</i> a high but clearly masculine voice is saying. <i>\"We will just have the innkeeper deliver food for [himher], and all shall go smoothly. [HeShe] will love it.\"</i>", parse);
		Text.NL();
		Text.Add("<i>\"Will [heshe]?\"</i> a deeper voice retorts. <i>\"Then why don’t we just ask [himher] what [heshe] wants if you’re so sure?\"</i>", parse);
		Text.NL();
		Text.Add("<i>\"Well, what I mean is that [heshe] will love it once the training is complete,\"</i> the first speaker says and giggles. <i>\"Do you not want to have such a cute pet?\"</i>", parse);
		Text.NL();
		parse["comp"] = party.NumTotal() > 1 ? Text.Parse(" [heshe] has companions with [himher], and", parse) : "";
		Text.Add("<i>\"Th-that is of no relevance. We must respect [hisher] freedom, and, anyway,[comp] there will be no end of trouble if we take [himher]. They might even try to destroy us.\"</i>", parse);
		Text.NL();
		Text.Add("At this, a clamor of overlapping alarmed voices rises up, filling the chamber with a quiet din of concern. By the time they finally settle down, the initial two voices are carried away with them as well, and the room returns to temporary silence.", parse);
		Text.NL();
		Text.Add("You lie still for a few more minutes, thinking about what you overheard, before opening your eyes and stretching.", parse);
		Text.NL();
		Text.Add("<i>\"Ah, you’re awake,\"</i> the familiar androgynous voice of Sixtynine greets you. <i>\"Now, you didn’t have such a bad time, did you?\"</i>", parse);
		Text.NL();
		Text.Add("You agree that the experience was very enjoyable, but remark that you really have to return to your own adventures now.", parse);
		Text.NL();
		Text.Add("<i>\"Well, of course, my door is always open to you. I do hope you’ll come again to visit.\"</i>", parse);
		Text.NL();
		if(party.NumTotal() > 2)
			parse["comp"] = "It’s time to find your companions and decide what you’re going to do next.";
		if(party.NumTotal() == 2)
			parse["comp"] = Text.Parse("It’s time to find [name] and decide what you’re going to do next.", {name: party.Get(1).name});
		else
			parse["comp"] = "It’s time to decide what you’re going to do next.";
		Text.Add("You smile, thinking about what kind of ‘visit’ the room has in mind, and hurry outside, finally noticing how oddly clean you are. [comp] Maybe you could ask the innkeeper about the room...", parse);
		Text.Flush();
		world.TimeStep({hour : 3});
		room69.flags["Sexed"]++;
		room69.flags["Rel"] = Room69.RelFlags.GoodTerms;
		
		if(party.NumTotal() <= 1) {
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Inn.common);
			});
		}
		else {
			Gui.NextPrompt(function() {
				Text.Clear();
				parse["s"] = party.NumTotal() > 2 ? "s" : "";
				Text.Add("After wandering through the hallways and seeing no one, you finally head down to ask [ikname] where your companion[s] went.", parse);
				if(party.NumTotal() > 2) {
					parse["comp"]   = "them";
					parse["himher"] = "them";
					parse["hisher"] = "their";
					parse["heshe"]  = "they";
					parse["internal"]  = "";
				}
				else { //if(party.NumTotal() == 2)
					var p1 = party.Get(1);
					parse["comp"] = p1.name;
					parse["himher"] = p1.himher();
					parse["hisher"] = p1.hisher();
					parse["heshe"]  = p1.heshe();
					parse["internal"]  = " internal";
				}
				Text.NL();
				Text.Add("Before you reach the bar, however, you spot [comp] sitting at a table, apparently waiting for you to come down. It turns out that they could not get the door open by normal means, and went down to ask [ikname] for help. He, however, told [himher] that you were perfectly fine and [heshe] should just go to [hisher] room and rest. After some[internal] debate, [heshe] decided the man was probably trustworthy enough.", parse);
				Text.NL();
				Text.Add("You nod at the explanation, only to be met with inquisitive eyes looking across the table at you. Turning a little red, you tell [himher] that you were indeed fine. More than fine, really.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					parse["name"] = kiakai.name;
					if(kiakai.flags["Attitude"] >= Kiakai.Attitude.Neutral)
						parse["reaction"] = "You continue to surprise me!";
					else
						parse["reaction"] = "Nothing you do even surprises me anymore!";
					Text.Add("<i>\"[playername]! [reaction]\"</i> [name] tries to look stern, but the effect is spoiled by an embarrassed blush.", parse);
				}, 1.0, function() { return party.InParty(kiakai); });
				scenes.AddEnc(function() {
					Text.Add("<i>\"You go get ‘em! So tell me, how was she? Or was it a he? Details, details!\"</i> Gwendy demands, literally on the edge of her seat with curiosity.", parse);
				}, 1.0, function() { return party.InParty(gwendy); });
				scenes.AddEnc(function() {
					Text.Add("<i>\"Let’s go. There is real work to be done,\"</i> Lei tells you. He’s acting like he doesn’t care, but you his eyes flicker over you in curiosity.", parse);
				}, 1.0, function() { return party.InParty(lei); });
				scenes.AddEnc(function() {
					Text.Add("<i>\"You could have invited me too, you know,\"</i> Roa blushes prettily.", parse);
				}, 1.0, function() { return party.InParty(roa); });
				/* TODO
				scenes.AddEnc(function() {
					parse["master"] = player.mfTrue("master", "mistress");
					Text.Add("<i>\"Ophelia understand, [master],\"</i> the rabbit nods happily, <i>\"Ophelia also found some nice cocks to fuck her!\"</i>", parse);
				}, 1.0, function() { return party.InParty(ophelia); });
				*/
				scenes.AddEnc(function() {
					Text.Add("<i>\"Having nightly adventures without me eh?\"</i> Miranda grins at your squirming. <i>\"Don’t worry, I know you’re too much of a slut to go without a good fucking for more than five minutes. Just tell me next time, I’ll sate that itch of yours.\"</i>", parse);
				}, 1.0, function() { return party.InParty(miranda); });
				/* TODO: more companions
				scenes.AddEnc(function() {
					Text.Add("", parse);
				}, 1.0, function() { return true; });
				*/
				scenes.Get();
				
				Text.Flush();
				party.location = world.loc.Rigard.Inn.common;
				Gui.NextPrompt();
			});
		}
		
	});
}


/*
Scenes.Room69.Discovering69 = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}
*/
