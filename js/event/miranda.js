/*
 * 
 * Define Miranda
 * 
 */
function Miranda(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Miranda";
	
	this.avatar.combat = Images.miranda;
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 10;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 23;
	this.stamina.base      = 19;
	this.dexterity.base    = 19;
	this.intelligence.base = 12;
	this.spirit.base       = 11;
	this.libido.base       = 24;
	this.charisma.base     = 14;
	
	this.level    = 1;
	this.sexlevel = 1;
	
	this.body.DefHerm(true);
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 7;
	this.FirstCock().length.base = 28;
	this.FirstCock().thickness.base = 7;
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	this.body.SetRace(Race.dog);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]      = 0;
	this.flags["Attitude"] = Miranda.Attitude.Neutral;
	this.flags["Thief"]    = 0;
	this.flags["RotGuard"] = 0;
	this.flags["Forest"]   = 0;
	
	//Peasants' gate antics
	this.flags["gBJ"]      = 0;
	this.flags["gAnal"]    = 0;

	if(storage) this.FromStorage(storage);
}
Miranda.prototype = new Entity();
Miranda.prototype.constructor = Miranda;

Miranda.Attitude = {
	Hate    : -2,
	Dismiss : -1,
	Neutral : 0,
	Nice    : 1
};

Miranda.prototype.Attitude = function() {
	return this.flags["Attitude"];
}

Miranda.prototype.FromStorage = function(storage) {
	this.subDom.base         = parseFloat(storage.subDom)  || this.subDom.base;
	this.slut.base           = parseFloat(storage.slut)    || this.slut.base;
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Miranda.prototype.ToStorage = function() {
	var storage = {};
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	
	return storage;
}


// Schedule
Miranda.prototype.IsAtLocation = function(location) {
	if(party.InParty(miranda)) return false;
	location = location || party.location;
	if(world.time.hour >= 7 && world.time.hour < 19) {
		//Work
		if(world.time.day % 2)
			return (location == world.loc.Plains.Gate) || (location == world.loc.Rigard.Gate);
		else
			return (location == world.loc.Rigard.Slums.gate);
	}
	else if(world.time.hour >= 19 || world.time.hour < 2)
		return (location == world.loc.Rigard.Tavern.common);
	else
		return (location == world.loc.Rigard.Residental.miranda);
}

Miranda.prototype.OnPatrol = function() {
	if(party.InParty(this))
		return false;
	else
		return (world.time.hour >= 7 && world.time.hour < 17);
}

// Party interaction
Miranda.prototype.Interact = function() {
	Text.Clear();
	Text.AddOutput("Woof Imma doggie.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + miranda.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + miranda.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + miranda.slut.Get()));
		Text.Newline();
	}
	
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
}

// Events
Scenes.Miranda = {};

Scenes.Miranda.RigardGatesDesc = function() {
	Text.Add("<i>”Ho!”</i> Miranda greets you as you approach the gate. The dog-morph is lounging beside the gatehouse, ");
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("toying with the pommel of her sword.");
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("stretching out sore muscles.");
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("sneaking a drink from a small hip flask while the commanding officer isn’t looking.");
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("her bored gaze drifting over the scenery.");
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
}

Scenes.Miranda.RigardGatesInteract = function() {
	var parse = {};
	
	Text.Clear();
	if(rigard.flags["Visa"] == 0) {
		Text.Add("<i>”Still no luck getting a pass? Sorry, but you know I can’t let you in without one,”</i> Miranda tells you bluntly.", parse);
		Text.NL();
	}
	
	if(miranda.Attitude() > Miranda.Attitude.Neutral)
		Text.Add("<i>”If you feel brave enough, I could treat you to another night on the town,”</i> the guardswoman suggests, winking at you. <i>”Meet me at the tavern in the slums after dark and we’ll party hard!”</i>", parse);
	else if(miranda.Attitude() < Miranda.Attitude.Neutral)
		Text.Add("<i>”So you come crawling back here, eh?”</i> The guardswoman looks at you dismissively. <i>”I really don’t have the time for you right now, but meet me in the slums later if you are feeling brave. Brave or stupid.”</i>", parse);
	else
		Text.Add("<i>”Head over to the Maidens’ Bane tavern in the slums once in a while, we can have a drink and chat a bit.”</i>", parse);
	Text.Flush();
	
	// TODO: Add interactions (sex)
	Gui.NextPrompt();
}

Scenes.Miranda.RigardGatesEnter = function() {
	var parse = {
		playername : player.name
	};
	
	if(miranda.Attitude() < Miranda.Attitude.Neutral) { // bad
		Text.Add("<i>”What now?”</i> Miranda asks shortly as you approach the gates.", parse);
		if(miranda.Relation() < 25)
			Text.Add(" She doesn’t look too happy to see you.");
		if(rigard.GatesOpen())
			Text.Add(" <i>”You are not getting inside the city during night hours, pass or no pass,”</i> she growls. <i>”Not through this gate.”</i>", parse);
		else if(rigard.Visa()) {
			Text.Add("You show her your visa to enter the city, but she seems unwilling to let you in either way. <i>”Come over here, standard procedure,”</i> she growls. During the next hour or so, she hounds you with questions about your business in the city, though you can tell she is clearly just fucking with you and wasting time.", parse);
			Text.NL();
			Text.Add("Something tells you that you are lucky though, as you suspect that if not for the other guard posted there, you’d be up for a cavity search. Eventually, the vindictive guardswoman lets you through the gates into Rigard.", parse);
			Text.NL();
			Text.Add("<i>”Why not come by the peasants’ gate more?”</i> Miranda calls after you. <i>”It’s a much more… comfortable environment.”</i>", parse);
			if(miranda.flags["gBJ"] > 0)
				Text.Add(" Your cheeks burn, but at least she let you inside, and with less humiliation than usual.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Gate, {hour: 1});
			});
			return;
		}
		else {
			Text.Add("<i>”You know damn well you aren’t getting through here without a pass,”</i> she growls. There is a dangerous glint in her eyes as she adds: <i>”Come by the slum-side gate when I’m on duty sometime, I might show mercy on you.”</i>", parse);
		}
	}
	else if(miranda.Attitude() > Miranda.Attitude.Neutral) { // good
		Text.Add("<i>”Heading in?”</i> Miranda asks you as you approach the gates. <i>”Don’t be a stranger now!”</i>", parse);
		Text.NL();
		if(rigard.Visa()) {
			if(rigard.GatesOpen()) {
				Text.Add("The guardswoman waves you through, feeling you up familiarly as you pass her. <i>”Come join me for a drink or two later, okay?”</i>", parse);
			}
			else { // !open
				Text.Add("The guardswoman looks around her quickly, studying her half asleep companion. She quickly gestures for you to come with her, leading you to a side gate. <i>”Don’t tell anyone I let you in, okay? The gates are supposed to be shut at this hour.”</i>", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
			});
			return;
		}
		else
			Text.Add("<i>”Sorry, I can’t let you through without a pass, [playername]. Come by the pub when I’m off duty, perhaps I can help you get one.”</i>", parse);
	}
	else { // neutral
		if(rigard.GatesOpen()) {
			Text.Add("<i>”Pass please,”</i> the guardswoman drones as you inquire about entry to the city.", parse);
			if(rigard.Visa()) {
				Text.Add("<i>”All seem to be in order, welcome to Rigard.”</i> She ushers you through the gates, already busy with the next person in line.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
				});
				return;
			}
			else
				Text.Add("<i>”No pass, no entry. Sorry, those are the rules.”</i> She adds that she’s still up for a drink after work at the pub.", parse);
		}
		else
			Text.Add("<i>”Gates are closed, ‘m afraid. Come back during daytime. Check in between eight in the morning and five in the evening.”</i>", parse);
	}
	Text.NL();
	Text.Flush();
	PrintDefaultOptions(true);
}

Scenes.Miranda.WelcomeToRigard = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	miranda.flags["Met"] = 1;
	
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";

	Text.Clear();
	Text.AddOutput("You set out toward the large city of Rigard, announced by a weathered sign next to the road. The city is built on a tall hill, and a wide river snakes its way past the far side. On the top of the hill stands a castle, its thick walls jutting out from the bedrock and reaching for the heavens. The city itself spreads out below it, divided into several levels by the steep slope.", parse);
	Text.Newline();
	Text.AddOutput("Though you see stone walls surrounding Rigard, you notice that there is a large number of residencies beyond their limits, especially toward the waterfront, where a sprawling slum stretches along the river.", parse);
	Text.Newline();
	if(party.InParty(kiakai)) {
		Text.AddOutput("As you walk, [name] brings you up to date on the city. Rigard is the largest city on Eden, and the capital of the kingdom holding sway over a large part of the island.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"I have heard that there is some difficulty entering the city,\"</i> the elf informs you, <i>\"but since I am a servant of Lady Aria, there should be no problem getting in. The rulers of the kingdom have always been good friends of the order.\"</i>", parse);
	}
	else {
		Text.AddOutput("While you don't really know much of the Rigard, other than it seems to be the largest city you have seen so far, possibly the largest on Eden, it is probably a good place to gather information.", parse);
	}
	Text.Newline();
	if(rosalin.flags["Met"] != 0) {
		Text.AddOutput("If you could get inside the city, there is a possibility you could get a hold of Rosalin's former teacher, a person who sounds like she could help you out with the gemstone.", parse);
		Text.Newline();
	}
	if(world.time.hour >= 22 || world.time.hour < 6)
		Text.AddOutput("As you come closer, you are guided by the light of torches, illuminating a large gate in the wall surrounding the city. It is currently shut for the night. You spot torches drifting along the top of the walls, carried by patrolling guards, another two of whom are posted outside the gatehouse.", parse);
	else // 6-22
		Text.AddOutput("As you come closer, you spot a short line of people, most of them farmers, waiting to be let into the city. There are a few guards posted on top of the walls, and another group guarding the gate. You patiently await your turn, as the last wagon in front of you is inspected and allowed inside.", parse);
	Text.Newline();
	Text.AddOutput("One of the guards, a striking female dog-morph with short dark fur, steps forward to meet you, toying with the pommel of a short sword strapped to her hip. She flicks a lock of black hair out of her eyes, looking you over curiously.", parse);
	Text.Newline();
	Text.AddOutput("<i>\"Reason for visiting Rigard? Carrying any illegal substances? Planning to kill any important officials?\"</i> she drones mechanically, going through her routine while allowing her gaze to unabashedly roam your body. Not to be outdone, you return the gesture.", parse);
	Text.Newline();
	Text.AddOutput("She is tall and athletic, her movements suggesting powerful muscles beneath her short fur - mostly black or dark brown, with patches of a bright orange on her hands, legs, chest and face. Her long black hair is pulled back in a loose braid hanging down to her waist. Strangely enough, you note that it is held together by a pink ribbon, very much at odds with her otherwise martial outfit.", parse);
	Text.Newline();
	Text.AddOutput("Said outfit does a poor job of containing her generous bust, which seems to be ready to spring out at any moment. Her uniform is made from tight-fitting studded leather, with a short leather skirt that ends just above the knees. As the guardswoman shifts her hips, something seems to move under the skirt.", parse);
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.AddOutput("<i>\"Hey, eyes up here,\"</i> she barks sharply, slightly amused. <i>\"Well?\"</i> she challenges, holding out her hand. A bit embarrassed, you realize that you completely spaced out for a second there. <i>\"Visitor's pass?\"</i> she repeats her question.", parse);
		Text.Newline();
		
		if(party.InParty(kiakai)) {
			Text.AddOutput("<i>\"Ah, madam, excuse me?\"</i> [name] piques in. The guardswoman turn her icy stare on the elf. [HeShe] shrinks back a little, swallowing. <i>\"Um, you see, I am from the order-\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Do you have a pass?\"</i> the dog-morph cuts [himher] off. The elf looks crestfallen, shaking [hisher] head miserably. <i>\"Then I'm afraid I can't let you in.\"</i>", parse);
		}
		else
			Text.AddOutput("You shake your head, bewildered. This is the first you've heard of this.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Look, I'm sorry,\"</i> the guard apologizes. <i>\"New directives from above, I can't let anyone into the city without a valid pass.\"</i> You ask her where one would get such a pass. <i>\"From the identification bureau, corner of Bankers' and Minstrel street.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("What? It is <i>inside</i> the city?", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Look, I didn't say it made sense, but it's the law,\"</i> she sighs, exasperated, <i>\"I'd like to let you in, but I just can't. You've shown up in times of unrest, the royals and noble families are very suspicious of strangers, what with the outlaw insurgency going on.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Is there a problem, Miranda?\"</i> The dog-morph's partner, a muscular guardsman sporting feline ears.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Nosir, no problem sarge,\"</i> the woman - apparently named Miranda - replies languidly. She somehow manages to make this sound mocking. Grumbling, her superior shrugs, heading inside again. The dog-morph rolls her eyes.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Well, you got mine, what's yours?\"</i>", parse);
		Text.Newline();
		Text.AddOutput("Seeing as you don't seem to be getting anywhere, you introduce yourself[comp].", parse);
		Text.Newline();
		Text.AddOutput("<i>\"A pleasure,\"</i> Miranda grins.", parse);

		Scenes.Miranda.WelcomeToRigardPASS    = true;
		Scenes.Miranda.WelcomeToRigardOUTLAWS = true;
		Scenes.Miranda.WelcomeToRigardMIRANDA = true;

		Scenes.Miranda.WelcomeToRigardQnA();
	});
}

Scenes.Miranda.WelcomeToRigardQnA = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer(),
		
		guygirl : player.body.femininity.Get() > 0 ? "girl" : "guy"
	};
		
	//[Pass][Outlaws][Miranda]
	var options = new Array();
	if(Scenes.Miranda.WelcomeToRigardPASS)
		options.push({ nameStr : "Pass",
			func : function() {
				Text.Clear();
				Text.AddOutput("<i>\"As I said, the only way to legitimately obtain a pass is to apply for one inside the city itself. That can be quite a bothersome process, though,\"</i> Miranda explains. <i>\"Another way to get inside is to have someone reputable vouch for you. There are a great number of traders and farmers entering and leaving the city daily, and any one of those could provide you entry.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("She shakes her head at your brightening expression.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Don't get your hopes up too high. Due to the harsh punishment for harboring outlaws, knowingly or not, don't expect people to open up that easily to you. I'm sure you're a nice [guygirl], but these are suspicious times.\"</i>", parse);
				
				Scenes.Miranda.WelcomeToRigardPASS = false;
				Scenes.Miranda.WelcomeToRigardQnA();
			}, enabled : true,
			tooltip : "Ask where one could acquire a pass."
		});
	if(Scenes.Miranda.WelcomeToRigardOUTLAWS)
		options.push({ nameStr : "Outlaws",
			func : function() {
				Text.Clear();
				Text.AddOutput("<i>\"You really aren't from around here, are you?\"</i> the dog-morph looks at you suspiciously. <i>\"I'd have a hard time believing there's someone who isn't familiar with the war and the current tension resulting from it.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"I say war, but it was really more of an insurgency, rich merchant families and their allies standing up against the authority of the king. It was an ugly, ugly mess, and though most of the ringleaders were rounded up, there are still some active today. More than that, others have joined their ranks. Deserters from the army, men with prices on their heads, common criminals and murderers, the list goes on. Most of these ‘freedom fighters' are little more than bandits.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"From what I've heard, there is a large group of them holed up somewhere in the forest,\"</i> she tells you, motioning toward the dark trees off in the distance. <i>\"That said, by the amount of unrest in Rigard right now, you'd almost suspect their base was in the city!\"</i>", parse);
				
				Scenes.Miranda.WelcomeToRigardOUTLAWS = false;
				Scenes.Miranda.WelcomeToRigardQnA();
			}, enabled : true,
			tooltip : "Ask her about this outlaw insurgency she mentioned."
		});
	if(Scenes.Miranda.WelcomeToRigardMIRANDA)
		options.push({ nameStr : "Miranda",
			func : function() {
				Text.Clear();
				Text.AddOutput("<i>\"Me?\"</i> She purses her lips, studying you thoughtfully. <i>\"I'm not anyone that special... well, besides being the best fighter the watch's got.\"</i> Her confident stance and athletic build give you the impression that this isn't just bravado. Still... curiously, you ask why she is posted watching the gates if she is so important?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Nice comeback,\"</i> she grins. <i>\"You could say I haven't exactly made many friends upstairs. That, and people of my kind aren't really appreciated in Rigard as of late.\"</i> People of her... kind?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Fur, ears, tail, tell you nothing?\"</i> she waves at her appearance, a little annoyed. <i>\"I'm a dog-morph, not a human. In Rigard, that makes a large difference.\"</i> Clearly not a topic she wants to linger on, so you drop it.", parse);
	
				Scenes.Miranda.WelcomeToRigardMIRANDA = false;
				Scenes.Miranda.WelcomeToRigardQnA();
			}, enabled : true,
			tooltip : "Ask Miranda about herself."
		});
	
	if(options.length > 0)
		Gui.SetButtonsFromList(options);
	else
		Gui.NextPrompt(Scenes.Miranda.WelcomeToRigardEnd);
}

Scenes.Miranda.WelcomeToRigardEnd = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
		
	Text.Clear();
	Text.AddOutput("<i>\"I enjoyed talking with you, believe it or not, but I've got a job to do here,\"</i> she walks back to her post, looking at you over her shoulder. <i>\"If you'd like to continue this conversation in a more... casual setting,\"</i> she quips, hips swaying suggestively, <i>\"meet me after work in the slums. There is a tavern there called the Maidens' Bane. We can hit the town, get to know each other a bit, eh?\"</i>", parse);
	Text.Newline();
	Text.AddOutput("Quite the bold vixen, Miranda. You say your goodbyes and tell her you'll think about it.", parse);
	Text.Newline();
	Text.AddOutput("Now... how should you proceed? Talking with Miranda has given you a few ideas on how to get into the capital.", parse);
	Text.Newline();
	Text.AddOutput("From what the dog-morph said, farmers should be able to bring in hired help, which might give you temporary access to the city. ", parse);
	if(gameCache.flags["FarmFound"] != 0)
		Text.AddOutput("Perhaps you could ask Gwendy about it.", parse);
	else
		Text.AddOutput("Perhaps you could find a friendly farmer on the great plains.", parse);
	Text.Newline();
	Text.AddOutput("Miranda herself seems like she isn't really the sort to bow to authority. She is at work now, but perhaps she could be persuaded to let you into the city if you meet up with her in the slums during the evening hours.", parse);
	Text.Newline();
	Text.AddOutput("Failing all else, if those outlaws are as crafty as the guardswoman made them out to be, they should have some way of accessing the city. ", parse);
	if(gameCache.flags["OutlawsRep"] != 0)
		Text.AddOutput("Asking Zenith or Maria could perhaps give you a clue on how to proceed.", parse);
	else
		Text.AddOutput("From what Miranda said, they are probably holed up somewhere in the forest... perhaps it's worth seeking them out.", parse);
	world.TimeStep({hour : 1});
	Gui.NextPrompt();
}

Scenes.Miranda.CatchThatThief = function() {
	miranda.flags["Thief"] = 1;

	parse = {};
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	Text.Clear();
	Text.Add("As you[comp] walk down the street, you become aware of a disturbance quickly moving your way. You deftly move out of the way as a man shoulders past you, running at full speed. He is dressed in cheap, dirty commoners clothes, probably just a thug from the waterfront district. In his hands, he is clutching a tightly wrapped bundle.", parse);
	Text.NL();
	Text.Add("Just as you begin to process all of this, three pursuers dash by, dressed in the uniforms of the Rigard city guard. While they look determined, the thief is lighter on his feet, unencumbered by armor as it were. For a while, it seems certain that he will escape their clutches and disappear down some alley, when his hopes are suddenly dashed by a whirling tornado of dark fur and hard muscle.", parse);
	Text.NL();
	Text.Add("Just as the man is passing by a shady passageway, Miranda the dog-morph guardswoman intercepts him, easily wrestling the thief to the ground despite his greater weight. He struggles a bit, but quiets down when the dobie tightens her hold, threatening to dislocate his shoulder.", parse);
	Text.NL();
	Text.Add("<i>”You’ve been a bad boy,”</i> Miranda murmurs, a gleeful smile playing on her lips, <i>”didn’t your mommy tell you not to steal?”</i> The poor thief grunts an unflattering remark, summarily ignored by the guardswoman. Laughing, she hoists the criminal over her shoulder like a sack of grains. As the procession of guards heads towards the barracks, the victor cups a feel on her captive’s butt, shamelessly groping the poor man.", parse);
	Text.NL();
	Text.Add("<i>”Caught red-handed with his fingers in the cookie jar eh?”</i> the guard chuckles. <i>”You are lucky that you weren’t caught by the royal guard, they’d likely have chopped your hands off for this transgression. Now, you’ll just have to endure a few nights in our comfy cells awaiting your trial.”</i> The dobie pats the thief’s bum possessively, ignoring his whimpering protests. <i>”Look forward to a few visits from me. I know <b>just</b> the punishment for bad boys.”</i> You almost feel bad for the guy.", parse);
	Text.NL();
	Text.Add("The group disappear around a corner, their continued conversation muffled by the sounds of the bustling city.", parse);
	Text.Flush();
	
	world.TimeStep({minute : 30});
	
	Gui.NextPrompt();
}

// Add catch thief as explorable event
world.loc.Rigard.Slums.gate.enc.AddEnc(function() { return Scenes.Miranda.CatchThatThief; }, 1.0, function() { return miranda.flags["Thief"] == 0 && miranda.OnPatrol(); });
world.loc.Rigard.Residental.street.enc.AddEnc(function() { return Scenes.Miranda.CatchThatThief; }, 1.0, function() { return miranda.flags["Thief"] == 0 && miranda.OnPatrol(); });
world.loc.Rigard.Gate.enc.AddEnc(function() { return Scenes.Miranda.CatchThatThief; }, 1.0, function() { return miranda.flags["Thief"] == 0 && miranda.OnPatrol(); });
world.loc.Rigard.ShopStreet.street.enc.AddEnc(function() { return Scenes.Miranda.CatchThatThief; }, 1.0, function() { return miranda.flags["Thief"] == 0 && miranda.OnPatrol(); });

Scenes.Miranda.HeyThere = function() {
	var parse = {
		boygirl : function() { return player.mfFem("boy", "girl"); }
	};
	
	miranda.flags["Met"] = 2;
	
	Text.Add("As you walk into the dimly lit bar your eyes find Miranda, the guardswoman, sitting in a corner by herself. The tall and curvy dog-morph is wearing tight leather pants laced with green cloth tucked into her high boots, and a very suggestive top piece exposing a fair amount of her cleavage. She notices you and motions you over, patting the bench beside her.", parse);
	Text.NL();
	Text.Add("You walk over and have a seat, while she calls for some more booze. You talk for a while, as she tells you about herself and her job in town.", parse);
	if(miranda.flags["Thief"] != 0) {
		Text.NL();
		Text.Add("When you mention her aggressive take down of the thief you saw earlier, she blush faintly and avoids your eyes.", parse);
		Text.NL();
		Text.Add("<i>\"Well, he <b>was</b> a thief,\"</i> she says defensively, <i>\"can't be too lenient now, can we.\"</i> She sips a bit at her booze thoughtfully. <i>\"Though I enjoyed that a bit more than what I should have maybe... was a while since I had a really good time,\"</i> she says quizzically. She shifts around uncomfortably in her seat.", parse);
		Text.Flush();
		
		//[Sure][Nah]
		var options = new Array();
		options.push({ nameStr : "Drop it",
			func : function() {
				Text.Clear();
				Text.Add("Moving on...", parse);
				
				Scenes.Miranda.HeyThereCont();
			}, enabled : true,
			tooltip : "Talk about something else."
		});
		options.push({ nameStr : "Inquire",
			func : function() {
				Text.Clear();
				Text.Add("<i>\"What do you mean?\"</i> you ask her. She gives you a long look, weighing you up, before deciding what to say.", parse);
				Text.NL();
				Text.Add("<i>\"It means that I get a bit randy at times and sometimes lose control a bit. Nothing to worry about though.\"</i> She reaches over and squeezes your butt a bit. <i>\"Might be fun though.\"</i> She grins as you blush.", parse);
				
				player.AddLustFraction(0.1);
				miranda.AddLustFraction(0.1);
				
				Scenes.Miranda.HeyThereCont();
			}, enabled : true,
			tooltip : "What does she mean by ‘good time’?"
		});
		options.push({ nameStr : "Flirt",
			func : function() {
				Text.Clear();
				Text.Add("The booze is getting a bit to your head, and you are finding it more difficult to keep your eyes to the more civilized parts of the shapely woman sitting beside you. You shift a bit closer to her until you touch her thigh with you leg, and murmur softly: <i>\"<b>I</b> could show you a good time.\"</i>", parse);
				Text.NL();
				Text.Add("Miranda, in the middle of chugging down a mug of booze, almost chokes as she starts coughing and wheezing uncontrollably. When she eventually winds down, you realize that she is giggling drunkenly. She leans over to get another bottle, the side of her huge breasts brushing against your arm as she reaches past you. ", parse);
				Text.NL();
				Text.Add("<i>\"Down, [boygirl]!\"</i> she says jokingly, <i>\"and be careful what you wish for!\"</i> You can tell she is turned on though, and she doesn't move away from you.", parse);
				
				player.AddLustFraction(0.3);
				miranda.AddLustFraction(0.3);
				
				Scenes.Miranda.HeyThereCont();
			}, enabled : true,
			tooltip : "Make a move on her."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Scenes.Miranda.HeyThereCont();
	}
}

Scenes.Miranda.HeyThereCont = function() {
	var parse = {};
	
	Text.NL();
	Text.Add("The booze starts to stack up as you continue to talk into the night. You tell her a bit about yourself and your adventures so far, while she quips in witty comments and suggestive remarks.", parse);
	Text.NL();
	
	Scenes.Miranda.Chat();
	Gui.Callstack.push(Scenes.Miranda.HeyThereCatPorn);
	Gui.Callstack.push(Scenes.Miranda.Chat);
	Gui.Callstack.push(Scenes.Miranda.Chat);
}

Scenes.Miranda.HeyThereCatPorn = function() {
	var parse = {
		breastDesc    : function() { return player.FirstBreastRow().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		buttDesc      : function() { return player.Butt().Short(); }
	};
	
	parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
	parse["s"]        = player.NumCocks() > 1 ? "s" : "";
	parse["oneof"]    = player.NumCocks() > 1 ? " one of" : "";
	
	Text.Clear();
	
	Text.Add("It is growing late, and more customers are slowly streaming into the bar. In a back room you hear loud sounds of merriment and shouts of encouragement; there seems to be some kind of fight going on. Miranda sighs contently and cups her face in a fuzzy paw and surveys the room. ", parse);
	Text.NL();
	Text.Add("<i>\"I like thish place,\"</i> she expresses loudly, <i>\"sure it’s a shithole, but there is great booze to be had, and good company!\"</i> She coos and points over into a corner. <i>\"And sometimes, raunchy entertainment!\"</i>", parse);
	Text.NL();
	Text.Add("You glance over and see two cat-morphs snuggling in a corner booth, one male and one female. The male cat whispers something in his companions ear which makes her grin excitedly and reach down and squeeze his crotch. The slender feline bites at her lover's ear playfully, then starts to lower herself onto her knees, all the while caressing him. She undoes his pants and reveals his surprisingly large and very excited cock. He blissfully leans back as she starts to work on the shaft with both her hands and her mouth.", parse);
	Text.NL();
	Text.Add("The pair draw a few more spectators as the catgirl really starts to go down on her lover's manhood, deep-throating it while massaging his testicles. You and the dog-morph besides you are both mesmerized by the display. It only lasts for another minute, when the man moans loudly, grabbing the catgirl by her head and shoving it down on his cock. Slurping noises can be heard from across the room as she greedily drinks up load after load of his feline cum.", parse);
	Text.Flush();
	
	player.AddLustFraction(0.3);
	miranda.AddLustFraction(0.3);
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You hear a loud thump behind you as you watch the aftermath of the show. Miranda is squirming in her seat a bit, hands under the table in front of her. She is looking very flushed and <i>very</i> drunk, her orange eyes half closed in bliss. She dizzily gazes your way, muttering below her breath.", parse);
		Text.NL();
		Text.Add("<i>\"Ooh... now you've gonesh and done itsh!\"</i> There is a hungry look in her eyes. The dog-girl is trembling slightly, and her hands are busy below the table, buried between her legs.", parse);
		Text.Flush();
		
		//[Comfort][Check]
		var options = new Array();
		options.push({ nameStr : "Comfort",
			func : function() {
				Text.Clear();
				Text.Add("You shuffle closer and puts an arm around her.", parse);
				Text.NL();
				Text.Add("<i>\"What's wrong?\"</i> you ask innocently.", parse);
				Text.NL();
				Text.Add("<i>\"'s jusht... haaaah... a little hot, dear, I'll be fine,\"</i> she pants, <i>\"all of this made me a bit exschited.\"</i> She is shamelessly pawing herself between her thighs, though her hands are covered in shadows by the dim lighting inside the tavern.", parse);
				Text.NL();
				Text.Add("You are not quite sure what's going on, but you hold onto her as she gasps and rides out her small orgasm. She leans against your chest contently, tired from the ordeal. After she has rested a bit, she reaches up and give your cheek a quick kiss.", parse);
				Text.NL();
				Text.Add("<i>\"Thanks honey, that wash sweet of you,\"</i> she is a bit unsteady on her feet when she gets up, so she leans on your shoulder for support. The two of you walk out into the cool night together.", parse);
				Text.NL();
				Text.Add("The breeze seems to revive Miranda a bit, and she bids you goodbye, heading home.", parse);
				Text.NL();
				Text.Add("<i>\"Ah had a really good time, we should do this again later!\"</i> she exclaims to you. She gives you a last nuzzle, squeeze your arm and unsteadily walks of into the night. A faintly glistening trail of sticky liquid slowly drops down one of her legs, forming small pools behind her.", parse);
				Text.Flush();
				
				miranda.relation.IncreaseStat(100, 5);
				miranda.subDom.DecreaseStat(-100, 5);
				
				world.TimeStep({hour : 4});
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Far be it for you to take advantage of the poor girl."
		});
		options.push({ nameStr : "Check",
			func : function() {
				Text.Clear();
				Text.Add("As you lean in closer, you notice that her hands are moving back and forth between her legs, stroking something. She is gasping now, short on breath and with her tongue sticking out. You drop under the table, curious about what she is doing. At first she squirms a bit and crosses her legs, but then concedes and spreads her legs.", parse);
				Text.NL();
				Text.Add("Even in the dim candlelight of the tavern, it’s quite a sight to behold: Miranda has undone her pants, her dripping vagina free for you to see, but that is not what draws your eyes. Between the distraught dog-girl's thighs is a huge and very erect cock, at least ten inches long and as thick as her arm.", parse);
				Text.NL();
				Text.Add("About a third of it is covered by a furry sheet, but the rest is out in the air, in all its glory. Large veins pulse along the very large member, from the thick knotted base, where her apple-sized testicles hang, heavy with seed, to the pointed tip. Miranda is excitedly pumping on the dick with both hands, her ragged gasps growing exceedingly more urgent. Alarmed, you realize that you are right in the line of fire.", parse);
				Text.NL();
				Text.Add("<b>You now know Miranda is a herm (duh).</b>", parse);
				Text.Flush();
				
				//[Flee!][Watch][Help her]
				var options = new Array();
				options.push({ nameStr : "Flee!",
					func : function() {
						Text.Clear();
						Text.Add("A slightly panicked look on your face, you exclaim that she needs another drink, and hurries over to the bar to get one. When you get back, Miranda has calmed down a little bit, looking slightly annoyed. After finishing half the drink, she declares that she has to go home. She stumbles away from you, heading for the exit.", parse);
						Text.NL();
						Text.Add("As she passes by, you could swear there is a spark of anger in her eyes, though she doesn’t act on it. You let out a ragged sigh of relief and go back to your drink.", parse);
						
						miranda.flags["Attitude"] = Miranda.Attitude.Dismiss;
						miranda.relation.DecreaseStat(-100, 10);
						
						Text.Flush();
						
						world.TimeStep({hour : 4});
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Nope the fuck out of there."
				});
				options.push({ nameStr : "Watch",
					func : function() {
						Text.Clear();
						Text.NL();
						Text.Add("Mesmerized by the bobbing rod in front of you, you can't decide what you should do; move out of the way or throw yourself at it. The slight dribble of drool from your mouth is matched by a growing bead of precum on the tip of Miranda's shaft.", parse);
						Text.NL();
						Text.Add("Dazed, you move in closer and study the massive erection if front of you. Miranda lovingly strokes her member, embarrassed at the show she is giving you, but too far gone to care. You notice that the knot at the base of her cock starts to swell, and that her hands are moving more rapidly.", parse);
						Text.NL();
						parse["hair"] = player.Hair().length.Get() > 3 ? " through your hair" : "";
						Text.Add("A slight moan escapes her lips as you violently get hurled back into reality by the first blast of cum. It hits you full in the face, making you to flinch as it splatters across your upturned features. The next two follow the first one, while the fourth load, as big and as powerful as the previous three, shoots slightly higher and leaves a long streak of canid love juice trailing[hair] and down your back. Miranda moans loudly as the next few blasts land on you chest, thoroughly hosing you.", parse);
						Text.NL();
						Text.Add("After what seems like two minutes, the torrent of semen finally slows down. Miranda looks down blissfully as you experimentally open your mouth and taste the thick substance. It’s salty, and burns on your tongue. A bit unsure of yourself, you look up at the hermaphrodite in front of you. She seems as surprised as you are, but she reaches down and pulls you up. She gives you a sloppy kiss, removing some of the spooge from your face.", parse);
						Text.NL();
						Text.Add("<i>\"Well, you certainly took that better than I expected,\"</i> she murmurs into your ear. Suddenly you realize that everyone in the bar is staring at you. Blushing furiously, the two of you hastily pick yourselves up and head towards the exit. Outside, Miranda gives you a hug and smiles at you.", parse);
						Text.NL();
						Text.Add("<i>\"We have to do that again sometime honey... sometime soon.\"</i> She grins wickedly, <i>\"you should probably get yourself cleaned up for now though.\"</i> She tucks her now softening member back into her tight leather pants, its size making you wonder how it could ever fit there in the first place. She leaves you standing in the dark street, covered in sticky girl-cum.", parse);
						Text.Flush();
						
						miranda.flags["Attitude"] = Miranda.Attitude.Nice;
						miranda.relation.IncreaseStat(100, 5);
						miranda.subDom.IncreaseStat(100, 10);
						
						world.TimeStep({hour : 5});
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "You can’t miss this show."
				});
				options.push({ nameStr : "Help her",
					func : function() {
						Text.Clear();
						Text.Add("In a haze of alcohol and arousal, you lean in closer and softly touch the bulging cock in front of you. After a slight hesitation, you grab it more firmly. Miranda's hands freeze, and she looks down at you, a bit surprised.", parse);
						Text.NL();
						Text.Add("<i>\"Wow, forward, aren’t we?\"</i> She blushes slightly, withdrawing her hands from her crotch. She spread her legs wider to give you room, as you position yourself between her thighs before the rigid monster. First slowly, then more confidently, you start to stroke her shaft, hands moving up and down the massive length, a touch here, a squeeze there.", parse);
						Text.NL();
						Text.Add("You begin to slowly pump her with one hand, while exploring her body with the other. Lovingly, you touch the insides of her thighs, fondle her large balls, play with her sopping pussy and rub her thick knot at the base of her cock. The lustful hermaphrodite is definitely aware of all your efforts, softly goading you on.", parse);
						Text.NL();
						Text.Add("<i>\"Oooh, you are good!\"</i> she huffs, one of her hands starts to play with her large breasts, teasing the nipples below the rough fabric of her dress into alertness. The other one reaches down to you head and gently guides you forward until your lips are touching the tip of her cock. <i>\"Do a girl a favor?\"</i> she looks down at you, her ragged breath making her breasts heave.", parse);
						Text.NL();
						Text.Add("You look into her eyes for a long moment. There is a spark there, but of what? Slowly, you open your mouth and lick the tip. The taste is salty and delicious, raising your own arousal even more. Hungrily you wrap your lips around it and start giving the dog the blowjob of her life.", parse);
						Text.NL();
						
						Sex.Blowjob(player, miranda);
						player.FuckOral(player.Mouth(), miranda.FirstCock(), 3);
						miranda.Fuck(miranda.FirstCock(), 3);
						
						if(player.FirstVag()) {
							Text.Add("The moistness between your thighs is maddening, and you reach down to fondle your nether lips while happily slurping at the cock in front of you. Your fingers play around with your labia for a bit, before finding your clit and massaging it. You moan around the beast in your throat as your masturbation brings you closer to your own climax. Miranda notices you, and pants:", parse);
							Text.NL();
							Text.Add("<i>\"Don't worry about that, honey, I can help you out... just as soon as you are finished down there.\"</i>", parse);
							Text.NL();
						}
						if(player.FirstBreastRow().size.Get() < 3) {
							Text.Add("Your tits heave with your ragged breath as you go down on Miranda. After a while, you stop for a breather, and playfully place the thick cock between your [breastDesc], stroking up and down slowly and drawing soft encouraging moans from Miranda. The dick is so soaked in your saliva that it’s glistening in the soft candlelight.", parse);
							Text.NL();
							Text.Add("After some intense tit-fucking, a hand tilts your chin up. Miranda looks down at you insistently, and you relent and get back down to business, your lips wrapping about her thick dong.", parse);
							Text.NL();
						}
						if(player.FirstCock()) {
							Text.Add("One of your hands sneak down to free your [multiCockDesc] from [itsTheir] confines. You realise that you are just as hard as Miranda is, and begin to pleasure yourself in time with your bobbing head, your hand moving rapidly up and down[oneof] your member[s].", parse);
							Text.NL();
						}
						
						Text.Add("Your continue to suck on her huge dog-dick, hands moving to pleasure the part of her length you simply cannot force down your throat. Dollops of precum leak down your from your lips, while inside your overfull mouth, Miranda's tool begins to swell even more. You can feel the heat radiating from her heaving scrotum and see the growing knot in front of you, and realise she is very close to the edge.", parse);
						Text.NL();
						Text.Add("Repressing your gag reflex, you grab her ample butt and push yourself forward until your nose rests in her furry crotch. Miranda cries out loudly in pleasure - probably alerting the few patrons not already aware of what was going on - and grabs the back of your head, holding you down. In short rapid strokes she fucks your ragged throat mercilessly, until she finally hits her peak.", parse);
						Text.NL();
						Text.Add("As her huge member begins to twitch violently in your mouth, you can feel the thick semen being deposited right into your stomach, load after hot load. Just before you black out from a lack of air, Miranda pulls out enough for you to breathe. You cough as a few more spurts hit your face, but you feel proud that most of her large load now resides in your slightly distended stomach.", parse);
						Text.NL();
						Text.Add("You eagerly lick your lips and gives the cock before you a few more slurps, cleaning it up. Miranda smiles down on you with a very satisfied look on her face as you greedily swallow every ounce of thick sperm you can get your lips on. As you climb up from your kneeling position, you realize that the room is silent and everyone's eyes are honed at the two of you. Quite a few of the patrons are openly stroking themselves.", parse);
						Text.NL();
						Text.Add("<i>\"I think we just outmatched the felines from earlier, honey,\"</i> Miranda says as she leans over, hugging you tightly. One of her hands reach down behind you and grabs your butt, squeezing it tightly. <i>\"You were wonderful dear,\"</i> she murmurs into your ears as she leans against you, wrecked by exhaustion.", parse);
						Text.NL();
						Text.Add("The bartender, a gruff equine clad in a dark tunic, comes over to your table with two jugs of mead.", parse);
						Text.NL();
						Text.Add("<i>\"For the show,\"</i> he explains grinning, <i>\"we could use some more of that around here, it draws a crowd. You think you two can come more often?\"</i> The two of you blush deeply as he returns to the bar, laughing. The conversations starts to pick up again around you.", parse);
						Text.NL();
						if(player.FirstVag())
							Text.Add("<i>”As much as I like an audience, do you think you can hold out until next time?</i> she murmurs, lightly caressing your wet crotch.", parse);
						else
							Text.Add("<i>”Too bad we are the center of attention, I’d love to… continue this,”</i> she grins, caressing your [buttDesc] fondly.", parse);
						Text.NL();
						Text.Add("You snuggle with Miranda for a while longer, enjoying the mead, until the two of you decide to leave for the night. Before the two of you part on the street outside, Miranda pulls you close into a deep kiss, her hands groping your ass roughly. <i>\"I think I'll be seeing more of you, and better sooner than later,\"</i> she announce as she saunters of into the night, <i>\"you know where to find me.\"</i>", parse);
						Text.Flush();
						
						miranda.flags["Attitude"] = Miranda.Attitude.Nice;
						miranda.relation.IncreaseStat(100, 10);
						miranda.subDom.IncreaseStat(100, 15);
						
						world.TimeStep({hour : 5});
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Wow... that looks way too tasty pass on."
				});
				Gui.SetButtonsFromList(options);
				
			}, enabled : true,
			tooltip : "The naughty girl is masturbating! You gotta see this for yourself."
		});
		Gui.SetButtonsFromList(options);
	});
}

Scenes.Miranda.Chat = function() {
	var parse = {};
	Text.NL();
	Text.Add("What do you want to chat with Miranda about?", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	//[Sure][Nah]
	var options = new Array();
	options.push({ nameStr : "Guard",
		func : function() {
			Text.Clear();
			Text.Add("You ask Miranda about her job as a guard.", parse);
			Text.NL();

			var scenes = [];
			
			scenes.push(function() {
				Text.Add("<i>”Walking the beat keeps the coin coming, though it isn’t as exciting as mercenary work. Believe it or not, usually things are pretty quiet here.”</> She shrugs irritably. <i>”I hate doing paper work, give me a thug to beat up any day of the week.”</i>", parse);
				if(miranda.Relation() >= 25) {
					Text.NL();
					Text.Add("She brightens up a bit. <i>\"You could show up at the barracks sometime and keep me company!\"</i> she suggests. <i>\"You know... take my mind of things for a while,\"</i> she grins wickedly.", parse);
					player.AddLustFraction(0.1);
					miranda.AddLustFraction(0.1);
				}
			});
			scenes.push(function() {
				Text.Add("She tells you a few tidbits of information about her comrades in the guard and their peculiarities. You are particularly surprised about that the gruff wolf usually standing guard at the main gates is into writing sleazy erotic poetry, and has quite the following in the female population of the town.", parse);
				Text.NL();
				Text.Add("<i>\"He is way too shy to tell anyone about it though, so he writes under an alias\"</i>, she grins. <i>\"You didn't hear that from me, though.\"</i>", parse);
			});
			scenes.push(function() {
				Text.Add("She tells you a bit more about her guard troupe.", parse);
				Text.NL();
				Text.Add("<i>\"Did you meet the centaur yet?\"</i> she asks you. <i>\"He is the strongest guy around here, and a really good archer too.\"</i> She brings up a few stories about the two of them hunting together in the forest. Seems like a dependable guy.", parse);
			});
			if(miranda.Relation() >= 25) {
				scenes.push(function() {
					Text.Add("<i>\"Well, it has been a lot more entertaining with you around, I'll tell you that!\"</i> she giggles. <i>\"The other guys there are complaining that my mind is not on the job any more, due to... distractions,\"</i> she grins as you blush faintly.", parse);
					Text.NL();
					Text.Add("<i>\"It's not a problem though, I can do this job in my sleep... not that you ever let me sleep, honey,\"</i> she places a big sloppy kiss on your cheek.", parse);
					player.AddLustFraction(0.1);
					miranda.AddLustFraction(0.1);
				});
			}
			
			var sceneId = miranda.flags["RotGuard"];
			if(sceneId >= scenes.length) sceneId = 0;
			
			miranda.flags["RotGuard"] = sceneId + 1;
			
			// Play scene
			scenes[sceneId]();
			
			Text.Flush();
			
			// Force callstack
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Ask her about her job as a city guard."
	});
	options.push({ nameStr : "Forest",
		func : function() {
			Text.Clear();
			// First
			if(miranda.flags["Forest"] == 0) {
				miranda.flags["Forest"] = 1;
				Text.Add("<i>\"You said you have been in the big forest, didn't you?\"</i> She asks you. <i>\"Not that you could miss it, it's practically crawling over our walls.\"</i> You nod and tell her about the various strange creatures you've heard inhabits it. <i>\"It's a very wild place, where one shouldn't walk around unprepared,\"</i> she notes, <i>\you might get some nasty surprises otherwise.\"</i>", parse);
				Text.Flush();
				
				//[Sure][Nah]
				var options = new Array();
				options.push({ nameStr : "Like what?",
					func : function() {
						Text.NL();
						Text.Add("She giggles at you.", parse);
						Text.NL();
						Text.Add("<i>\"There are creatures in that forest who stalks unwitting prey and captures travellers for fun and for their own release.\"</i> She begins to describe more and more extravagant beasts and how they violate passers by, <i>just like you</i>. You gasp at some of the more lurid ones, making her laugh out loud.", parse);
						Text.Flush();
						
						// Force callstack
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Ask her to explain what she means."
				});
				options.push({ nameStr : "Hunting",
					func : function() {
						Text.NL();
						Text.Add("<i>\"I'm a bit different,\"</i> she says, <i>\"I've walked those woods for years hunting game, I know which creatures to avoid.\"</i> She gives you a playful glance and places a hand on your thigh.", parse);
						Text.NL();
						Text.Add("<i>\"...And I know which ones are good in the sack, if you want some tips.\"</i> She howls with laughter at your shocked expression.", parse);
						Text.Flush();
						
						player.AddLustFraction(0.2);
						miranda.AddLustFraction(0.2);
				
						// Force callstack
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "How about her, didn’t she say she hunts?"
				});
				Gui.SetButtonsFromList(options);
			}
			// Repeat
			else {
				Text.Add("You ask Miranda about the creatures of the forest. She grins a bit and fills you in about some of the more exotic ones.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>\"Ok,\"</i> she begins, <i>\"you know those big wolves that prowl around there? Did you know that some of them used to be people?\"</i> She goes on to explain that overuse of certain substances enhancing their animal attributes can change a persons body and mind so much that they lose themselves.", parse);
					Text.NL();
					Text.Add("<i>\"As long as you keep your wits about you you should be fine,\"</i> she finishes, ordering another mug of mead. <i>\"Who knows, I might like having a pet around though...\"</i> she adds teasingly. <i>\"Just be careful ok?\"</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>\"The goblin tribes of the deeper woods are a weird bunch,\"</i> she muses, taking a long draft of the strong mead in her cup. <i>\"They are so constantly mad with lust that they fuck like rabbits. Yet they somehow keep their numbers down with a surprisingly high fatality rate,\"</i> she ponders that a bit. <i>\"It is probably because they are really, really stupid,\"</i> she decides, <i>\"just be careful that they don't gang up on you.\"</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>\"There are some wild feline beasts running around the forest,\"</i> she informs you, <i>\"they may look cute, but be very careful around them. Unlike the domesticated house cats you might see here in the city, these are natural predators, and are very dangerous. Don't head into their territory unless you have some kind of death wish.\"</i>", parse);
				}, 1.0, function() { return true; });
				
				scenes.Get();
				
				Text.Flush();
				// Force callstack
				Gui.NextPrompt();
			}
		}, enabled : true,
		tooltip : "Ask her about the forest surrounding Rigard."
	});
	options.push({ nameStr : "Chat",
		func : function() {
			Text.Clear();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Miranda mentions that she like fish a lot, going on to dreamily explain great fish dishes that she has cooked over time. Funny, you didn't quite look at her like a gourmet cook.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Miranda talks for a while about her biggest hobby, hunting game in the woods. While she usually uses a two-handed blade, she is apparently also really proficient with a bow and arrow. She talks a bit about some of her conquests. You get the feeling that she is searching for something in the forest.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("The two of you chat a bit about the castle town. <i>\"Well, it's a nice enough place,\"</i> Miranda concedes, <i>\"the bar is nice, I have a decent job that brings the dough in.\"</i> She grins widely, <i>\"and though the place might now be as interesting as the feline home town, I have you around now to keep me entertained!\"</i>", parse);
				player.AddLustFraction(0.1);
				miranda.AddLustFraction(0.1);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You ask Miranda about the royal family living in the castle. Her mood darkens immediately, and she spits on the floor besides the table.", parse);
				Text.NL();
				Text.Add("<i>”Rigard may be my home, but don’t think for a second I’ve got anything but scorn for that bunch. Fucking aristocrats...”</i>", parse);
				Text.NL();
				Text.Add("When you ask her why she thinks that way, she gives you a deadpan stare. <i>”Try living in Rigard for a week as a morph, might give you an idea why I left to be a merc.”</i>", parse);
				Text.NL();
				Text.Add("Well, what about the rest of the royals?", parse);
				Text.NL();
				Text.Add("<i>”Heh, they are a right depraved bunch,”</i> Miranda laughs, a wicked grin playing across her features. <i>”There is plenty a rumour about our dear queen, and don’t get me started on the kids. It’s common knowledge they hit the sack together, and you’d have to look hard to find a girlier prince than Rani.”</i>", parse);
				Text.NL();
				Text.Add("<i>”...Still, I’d tap that,”</i> she adds after a thoughtful pause.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>\"You should have a look around the farmlands,\"</i> Miranda tells you, <i>\"there is some work to be had at the farms, if you are into that, and you can also find the rabbit burrows around that area. You could see it like a hub area, from there you can reach every location on the island pretty quickly.\"</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>\"Watch your back if you head to the mountains,\"</i> Miranda warns you, <i>\"I've heard that there are bandits hiding out somewhere there, and it is very close to the boneyard, and that place you should <b>really</b> avoid.\"</i>", parse);
				Text.NL();
			}, 1.0, function() { return true; });
			
			scenes.Get();
			Text.Flush();
			
			// Force callstack
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Just chat for a while."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Miranda.JustOneMore = function() {
	var parse = {
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		buttDesc      : function() { return player.Butt().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		breastDesc    : function() { return player.FirstBreastRow().Short(); },
		stomachDesc   : function() { return player.StomachDesc(); },
		hand          : function() { return player.HandDesc(); },
		lowerArmor    : function() { return player.LowerArmorDesc(); },
		legs          : function() { return player.LegsDesc(); }
	};
	
	
	parse["ItThey"]   = player.NumCocks() > 1 ? "They" : "It";
	parse["itThey"]   = player.NumCocks() > 1 ? "they" : "it";
	parse["isAre"]    = player.NumCocks() > 1 ? "are" : "is";
	parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
	parse["s"]        = player.NumCocks() > 1 ? "s" : "";
	parse["notS"]     = player.NumCocks() > 1 ? "" : "s";
	parse["oneof"]    = player.NumCocks() > 1 ? " one of" : "";
	parse["yourA"]    = player.NumCocks() > 2 ? " a" : "your";
	
	miranda.flags["Met"] = 3;
	
	if(miranda.flags["Attitude"] == Miranda.Attitude.Nice) {
		Text.Add("<i>”Well, I honestly didn't think I would see you again after last time,”</i> she laughs softly as you squirm a bit, then pats the bench beside her. Miranda seems very happy that you decided to return, which she makes more clear as she reaches over and whispers in your ear:", parse);
		Text.NL();
		Text.Add("<i>”If you decided to come back, I guess that means you liked my extra equipment. Perhaps you are yearning for round two?”</i> She gently reaches down into your pants, ", parse);
		if(player.FirstCock())
			Text.Add("fondling your now aroused [multiCockDesc].", parse);
		else if(player.FirstVag())
			Text.Add("lightly rubbing your moist [vagDesc].", parse);
		else
			Text.Add("fondling you.", parse);
		Text.Add(" Her probing fingers traces lower, drawing soft moans from you as she slowly circles your [anusDesc]. She slowly starts to push her middle finger up your rectum, feeling around for a while before withdrawing. She winks at you and pats the hidden monster between her legs.", parse);
		Text.NL();
		Text.Add("<i>”Just know that I'd be more than happy to help you with that, if you ever feel you need to let off some steam.”</i> She chuckles at your discomfort and orders some drinks for you.", parse);
		Text.NL();
		
		miranda.relation.IncreaseStat(100, 5);
		miranda.subDom.IncreaseStat(100, 5);
		player.AddLustFraction(0.5);
		miranda.AddLustFraction(0.5);
		
		Scenes.Miranda.Chat();
		
		// TODO: Push sexy
	}
	else if(miranda.flags["Attitude"] == Miranda.Attitude.Dismiss) {
		Text.Add("<i>”I.. uh.. I'm sorry about last time,”</i> she says, a bit defensively. <i>”Of course you weren't expecting... that, to, uh, show up.”</i> She rolls her shoulders. <i>”Well, that's my little secret, I'm a hermaphrodite, got both parts and all,”</i> she smiles, back to her old assertive self.", parse);
		Text.NL();
		Text.Add("<i>”Twice the fun though, if you care to try it out.”</i> The dog-morph is obviously waiting for you to say something.", parse);
		
		Text.Flush();
		
		//[Apologize][Leave]
		var options = new Array();
		options.push({ nameStr : "Apologize",
			func : function() {
				Text.Clear();
				Text.Add("You apologize to her for running out, giving her a weak smile. Miranda’s expression softens up a bit.", parse);
				Text.NL();
				Text.Add("<i>”You are not such a bad sort, you know,”</i> she says, <i>”I guess I should have hinted at it a bit more, I...”</i> she looks at you admiringly and shyly adds, <i>”I just couldn't help myself, you are quite the catch, you know.”</i> She places a hand your hip and moves in a bit closer.", parse);
				Text.NL();
				Text.Add("<i>”So... now what, pet?”</i> she asks, looking into your eyes. You suggest that the two of you grab a few drinks and have a chat. <i>”Well… a good start, I guess,”</i> she smirks.", parse);
				Text.NL();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Neutral;
				
				miranda.relation.IncreaseStat(100, 5);
				
				Scenes.Miranda.Chat();
			}, enabled : true,
			tooltip : "Apologize for running out on her."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("Murmuring some excuse, you start to shuffle away. There is a slightly hurt look in her eyes.", parse);
				Text.NL();
				Text.Add("<i>”Fine then,”</i> she snaps after you. <i>”Be that way. You’ll regret that if I ever catch you in the streets!”</i> As you glance over your shoulder, she is furiously chugging down a large bottle of booze. She probably won't appreciate seeing you around any more.", parse);
				Text.Flush();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Hate;
				
				miranda.relation.DecreaseStat(-25, 100);
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Not interested. Find an excuse to ditch her."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("Miranda is lost in thought as you grab a seat next to her. She takes a deep breath and turns to you.", parse);
		Text.NL();
		Text.Add("<i>”Look, I haven't been entirely honest with you. I get a feeling that you like me, and there is something that you need to know before we take this any further.”</i> She heads off to an empty back room, motioning for you to follow. Curious, you go with her. She grabs a bottle of booze from the bar on the way, muttering she needs something to brace herself. You notice that she is already pretty drunk.", parse);
		Text.NL();
		Text.Add("<i>”Please close the door, hun,”</i> she tells you over her shoulder, placing the booze on the table. Turning around, she gives you a measuring look. <i>”I think the best way to do this is to show you,”</i> she murmurs with an sultry look on her face. With her eyes still fixed on you, Miranda reaches for her belt and starts undoing it. When she is done, she turns around, slowly pulling down her tight pants over her curvy hips, exposing more and more dark fur.", parse);
		Text.NL();
		Text.Add("You are thoroughly enjoying the show, but is a bit unsure where this is going. With her back to you, she pulls her pants down to her knees, giving you a glimpse of her tight anus and moist pussy lips. Then... she turns around to face you. Between her long fur-clad legs, just above her juicy slit, you see something you definitely didn't expect. Half hidden in a soft sheet is a very large canid cock, complete with a pointed tip, a set of apple-size balls and a thick knot at the base.", parse);
		Text.NL();
		Text.Add("Even soft, it’s still almost nine inches long and as thick as her arm. You unconsciously lick your lips nervously, contemplating this new development. Miranda takes a challenging pose, legs wide and member jutting out aggressively.", parse);
		Text.NL();
		Text.Add("<i>”Well?”</i> she looks at you, cocking her eyebrow.", parse);
		Text.NL();
		Text.Add("<b>You now know Miranda is a herm (duh).</b>", parse);
		Text.Flush();
		
		//[Accept][Leave][Touch it]
		var options = new Array();
		options.push({ nameStr : "Accept",
			func : function() {
				Text.Clear();
				Text.Add("You declare that it doesn’t matter what she has between her legs, you’ll still be her friend, even if her revelation startled you a little bit. Miranda makes a happy yip and gives you a quick hug, her soft member hitting your thigh with a wet slap. A bit embarrassed, she shoves her cock back into her pants, then leads you back to the benches. As you walk she leans on your shoulder and fondles your butt playfully.", parse);
				Text.NL();
				Text.Add("<i>”Friendship accepted,”</i> the guardswoman murmurs. <i>”And who knows, perhaps something more down the line?”</i> she adds playfully.", parse);
				Text.NL();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Neutral;
				
				miranda.relation.IncreaseStat(100, 5);
				
				Scenes.Miranda.Chat();
			}, enabled : true,
			tooltip : "Got no problem with that, you still want to hang out with her."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("Murmuring some excuse, you start to shuffle away. There is a slightly hurt look in her eyes.", parse);
				Text.NL();
				Text.Add("<i>”Fine then,”</i> she snaps after you. <i>”Be that way. You’ll regret that if I ever catch you in the streets!”</i> As you glance over your shoulder, she is furiously chugging down a large bottle of booze. She probably won't appreciate seeing you around any more.", parse);
				Text.Flush();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Hate;
				
				miranda.relation.DecreaseStat(-25, 100);
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Not interested. Find an excuse to ditch her."
		});
		options.push({ nameStr : "Touch it",
			func : function() {
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
				
				Text.Clear();
				Text.Add("Fascinated by the long member, you move closer and study it meticulously.", parse);
				Text.NL();
				Text.Add("You ask her if you can touch it. Almost a bit flustered, she nods and leans back against the wall, shuffling her legs apart a bit to give you room. You get down on your knees to get closer to the object of your study. You softly move your hands up and down the shaft, lightly touching here and there, drawing increasingly loud moans from Miranda. The administrations of your hands seem to bear fruit, as her cock is slowly hardening and rising up.", parse);
				Text.NL();
				Text.Add("Finally you lean back and admire your handiwork. Fully erect, Miranda's huge rod push out eleven inches from her crotch, even without the support of your hands. As you look up at the hermaphrodite, you see that she is very aroused, and is gazing at you with a wicked smile playing on her lips. Satisfied with your survey, you start to rise up to your feet.", parse);
				Text.NL();
				Text.Add("<i>”Oh no. You can't just leave it like that!”</i> she exclaims drunkenly. The guardswoman makes a flailing grab for you, but loses her footing and falls down on top of you. Surprised, you catch her and set her down in your lap.", parse);
				Text.NL();
				Text.Add("<i>”Please!”</i> she pants urgently, her hands paws at you inefficiently. <i>”I need to fuck. <b>Now!</b>”</i>", parse);
				Text.NL();
				Text.Add("What do you do?", parse);
				Text.Flush();
				
				//[Fuck her][Ride her][Let her]
				var options = new Array();
				if(player.FirstCock()) {
					options.push({ nameStr : "Fuck her",
						func : function() {
							Text.Clear();
							Text.Add("You envelop Miranda in your arms, hugging the horny doggy close and playfully nipping at her fluffy ears. She hugs you close as you lift her up so she sits in your lap, facing you. You reach down and pull out your [multiCockDesc] from [itsTheir] confines. [ItThey] [isAre] painfully hard as [itThey] snap[notS] up against her crotch, pressing between her ample testicles.", parse);
							Text.NL();
							Text.Add("The assertive guardswoman looks almost nervous as you adjust your aim, rubbing your [multiCockDesc] against her wet cunt, massaging her butt with your free [hand]. Miranda moans cutely, and you become very aware of the hard erection pressing against your stomach. You grunt a bit as you lift her up, positioning her over[oneof] your member[s].", parse);
							Text.NL();
							Text.Add("The two of you lock lips as Miranda slowly lowers herself down, impaling herself upon your spear[s]. Her raspy tongue plays around in your mouth as she begins to rock her hips slowly, adjusting to the cock[s] stretching her. You firmly grasp her hips and start helping her move up and down, ", parse);
							if(player.NumCocks() > 1)
								Text.Add("one of your dicks penetrating deep into her cunt, while [yourA] second one probes her back passage.", parse);
							else
								Text.Add("your cock pushing up into her cunt.", parse);
							Text.NL();
							
							Sex.Vaginal(player, miranda);
							player.Fuck(player.FirstCock(), 5);
							miranda.FuckVag(miranda.FirstVag(), player.FirstCock(), 5);
							
							if(player.NumCocks() > 1) {
								Sex.Anal(player, miranda);
								player.Fuck(player.FirstCock(), 5);
								miranda.FuckAnal(miranda.Butt(), player.AllCocks()[1], 5);
							}
							
							Text.Add("Miranda moans loudly as you fervently fuck her female genitalia, almost making you worry someone will walk in on the two of you. Her hard cock rubs against your chest", parse);
							if(player.FirstBreastRow().size.Get() > 3)
								Text.Add(", fitting neatly between your [breastDesc]", parse);
							Text.Add(", drooling precum all over you. You speed up your insistent rutting of the poor doggy, who is really starting to lose it. Her engorged penis is slapping wildly against your [stomachDesc], and the knot at her base is beginning to swell.", parse);
							Text.NL();
							parse["butt"] = player.NumCocks() > 1 ? ", simultaneously pouring your spunk inside her twitching colon" : "";
							Text.Add("<i>”I-I'm gonna come!”</i> she gasps. You quickly reach down and grasp her shaft and start jerking her off. As she explodes in a fountain of dog-girl cum, thoroughly drenching the both of you, you glance up and notice that you have a small audience. Seems like two shocked customers just walked in on you, but you are not really in a position to do anything about it. Miranda rams herself down hard, fully impaling herself on your cock[s] as you unload into the depths of her pussy[butt].", parse);
							Text.NL();
							Text.Add("As the both of you ride out your climax, the spectators chuckle to each other and head to another room. They leave the door open for all to see, as you rest in each others arms in an expanding pool of mixed love juices. After resting up a bit, the two of you decide that it is probably best to leave for today. As you walk out into the night, Miranda gives you an peck on the cheek. She seems a bit more demure than her usual abrasive self.", parse);
							Text.NL();
							Text.Add("<i>”That was great, hun...”</i> she whispers into your ear. <i>”You can do that to me again aaanytime you like.”</i> Miranda sways off into the night, leaving you alone.", parse);
							Text.Flush();
							
							miranda.relation.IncreaseStat(100, 10);
							miranda.subDom.DecreaseStat(-100, 10);
							
							player.AddLustFraction(-1);
							miranda.AddLustFraction(-1);
							
							Gui.NextPrompt(function() {
								MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
							});
						}, enabled : true,
						tooltip : "While it might not be what she was hoping for, you got just the thing to fill her."
					});
				}
				options.push({ nameStr : "Ride her",
					func : function() {
						var target = BodyPartType.ass;
						if(player.FirstVag())
							target = BodyPartType.vagina;
						
						if(target == BodyPartType.vagina)
							parse["targetDesc"] = parse["vagDesc"];
						else
							parse["targetDesc"] = parse["anusDesc"];
						
						Text.Clear();
						Text.Add("Blushing slightly, you lay her down on the floor before you, on top of her discarded clothes. Straddling her, you position the tip of her cock at your [targetDesc], wondering if it will even fit inside you. You don't have to wonder very long, as Miranda gathers a bit of strength and pushes you down so far that your entrance touches the fur on her stomach. She grins up at you, growling playfully while you gasp for breath.", parse);
						Text.NL();
						
						if(target == BodyPartType.vagina) {
							Sex.Vaginal(miranda, player);
							miranda.Fuck(miranda.FirstCock(), 5);
							player.FuckVag(player.FirstVag(), miranda.FirstCock(), 5);
						}
						else {
							Sex.Anal(miranda, player);
							miranda.Fuck(miranda.FirstCock(), 5);
							player.FuckAnal(player.Butt(), miranda.FirstCock(), 5);
						}
						
						Text.Add("<i>”See? That wasn't so bad, was it honey?”</i> She slaps your butt drunkenly. <i>”Now, are you going to start moving or will I have to do all the work?”</i> Blushing slightly, you slide up and down her length, your tunnel clenching tightly around the hermaphrodite’s bright red pillar.", parse);
						Text.NL();
						Text.Add("Fuck, she is in so deep! The dog-girl roughly grabs hold of your hips, shoving you down on her member. Before long, you are driven to the edge by the wild romp.", parse);
						if(player.FirstBreastRow())
							Text.Add(" Your breasts heave as you bounce up and down, the pleasure making you moan like crazy.", parse);
						if(player.FirstVag())
							Text.Add(" Juices flow freely from your ravaged cunt, clinging to the sides of her dick as you ride her.", parse);
						if(player.FirstCock())
							Text.Add(" Your cock[s] convulse[notS] and start[notS] pumping semen all over your lover.", parse);
						Text.Add(" She grins as you cum, rocking on top of her.", parse);
						Text.NL();
						parse["butt"] = player.FirstCock() ? ", grinding against your prostate" : "";
						Text.Add("<i>”Oh, I'm not done quite yet, my cute little pet,”</i> she coos. Sitting up and holding you in her lap, she starts to guide you up and down her shaft with her strong hands. Picking up speed, she bounces you wildly[butt].", parse);
						Text.NL();
						Text.Add("Pretty soon you convulse in yet another intense orgasm, making you gasp as she continues to fuck you. You become aware that some of the bar patrons are peeking in through the open door, watching the two of you. Miranda notices them too and grins at them over your shoulder, as she pushes you so far down on her cock that her thick knot pops inside you.", parse);
						Text.NL();
						Text.Add("Your body rests limply against hers as she starts pumping you full of her seed, putting up a show for the audience. As you lean against her, totally exhausted, she whispers in your ear, <i>”Not bad for the first time, I think I’ve found myself a keeper!”</i> Once her knot has shrunk enough and you finally are able to separate, the two of you head out into the night, too tired to keep up the drinking game. Miranda has a thoughtful look on her face.", parse);
						Text.NL();
						Text.Add("<i>”Did you enjoy performing in front of an audience?”</i> she asks playfully. <i>”Maybe I shouldn't have been so greedy, and let them join in?”</i> She laughs loudly at your blushing face and saunters off into the night.", parse);
						Text.NL();
						Text.Add("<i>”See you around, pet!”</i>", parse);
						Text.Flush();
						
						miranda.relation.IncreaseStat(100, 10);
						miranda.subDom.IncreaseStat(100, 10);
						
						player.AddLustFraction(-1);
						miranda.AddLustFraction(-1);
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
						});
					}, enabled : true,
					tooltip : "Give her relief by riding her thick cock."
				});
				options.push({ nameStr : "Let her",
					func : function() {
						Text.Clear();
						Text.Add("You blush a bit, eyeing her throbbing member nervously. Unsure if you are doing the right thing, you ask if she’ll be gentle with you.", parse);
						Text.NL();
						Text.Add("<i>”Gentle?”</i> the dog-morph growls, <i>”I don’t know the meaning of the word!”</i> Before you have time to react, she wrestles you to the ground. Totally surprised by her lunge, you stumble back on your ass as she falls on top of you. Squirming around you somehow end up on your stomach, butt in the air. Faintly alarmed, you try to crawl away, but she has you pinned to the ground, rutting her huge cock against your back. She hungrily pulls off your [lowerArmor], revealing your naked [buttDesc]. She reaches down, whispering in your ear as she starts probing at your back door.", parse);
						Text.NL();
						Text.Add("<i>”I'm sorry, but I <b>need</b> this,”</i> she almost seems a bit embarrassed about her essentially planning to rape you, but she is too aroused to back down now. <i>”You brought this upon yourself you know, my cute little slut,”</i> she moans, trying to justify her actions. <i>”You were practically <b>asking</b> for it!”</i>", parse);
						Text.NL();
						Text.Add("You start to gasp that it wasn't like that, but you are suddenly cut off by a rowdy intruder in your [anusDesc]. Your world is suddenly reduced to your butt, and the huge log stretching it wider and wider. You can feel each bulging vein as the pointy red giant slowly presses deeper and deeper into your bowels, completely disregarding your own opinions on the matter.", parse);
						Text.NL();
						
						Sex.Anal(miranda, player);
						miranda.Fuck(miranda.FirstCock(), 6);
						player.FuckAnal(player.Butt(), miranda.FirstCock(), 6);
						
						parse["butt"] = player.FirstCock() ? " brushing up against your prostate and" : "";
						Text.Add("Finally, the head is firmly lodged inside your [anusDesc]. Your lover sighs in deep contentment as you rasp a few ragged breaths, trying to accommodate for her girth. Miranda is not going to let you have any rest though, as she mercilessly pushes deeper and deeper into your colon,[butt] making you gasp in mixed pleasure and pain.", parse);
						Text.NL();
						Text.Add("<i>”You like that, huh?”</i> the horny dog grunts through her teeth. She gets up on her knees and firmly grab your buttocks, preparing to go down on you in earnest. <i>”Then I think you will just love this,”</i> she murmurs, she slowly pulls out of you, until the widest part of the head stretch your distended anus.", parse);
						if(player.FirstVag())
							Text.Add(" Your cunt is flooding over, but Miranda is too focused on her current target to notice.", parse);
						if(player.FirstCock())
							Text.Add(" Your own [multiCockDesc] [isAre] twitching in anticipation, a small pool of pre forming on the floor beneath you.", parse);
						Text.NL();
						Text.Add("<i>”Here I come, brace yourself, slut!”</i> she roars, thrusting forward hard with her hips. The intense sensation of being completely filled up almost makes you come then and there. You can feel the incessant prodding of her even thicker knot at your back door, demanding entry. She grunts a bit as she realizes that it won't fit the way it is now, but decides that she'll give it her best try anyway. She proceeds to roughly slam your colon, first pulling out almost all the way before ramming it back as deep as it will go.", parse);
						if(player.FirstCock())
							Text.Add(" Your prostate definitely is mashed every time she trusts her hips, making you yelp in unwilling pleasure.", parse);
						Text.NL();
						Text.Add("After what feels like hours of intense fucking, you can't take it any more.", parse);
						if(player.FirstVag())
							Text.Add(" Your cunt sprays juices all over the floor as you collapse, only held up by the hermaphrodite’s strong hands.", parse);
						if(player.FirstCock())
							Text.Add(" Your cock[s] violently erupt[notS] on the hard wooden floor, making you cry out in ecstasy.", parse);
						Text.NL();
						parse["butt"] = player.FirstCock() ? " by repeatedly hitting your prostate" : "";
						Text.Add("Miranda is far from done however, and continues to ram away at your poor abused rectum, quickly building up another anal orgasm for you[butt]. The massive rod moves more easily now, slick with her precum. The constant stretching pain in your butt does not recede, however, and you realize that she is forcing more and more of her knot into you with every push.", parse);
						Text.NL();
						parse["butt"] = player.FirstCock() ? " as a great force is exerted on your prostate" : "";
						Text.Add("<i>”Almost there, pet, almost, almoooost...”</i> she coos, her breath drawing short. Finally she pulls out, only the pointed tip of her cock poking against your stretched taint. She pulls back her hips as you brace yourself again. When she rams into you, she pushes deeper than ever before, making your eyes bulge in pain. Your body is rocked by another heavy orgasm[butt], increasing the size of the pool of love juices between your knees.", parse);
						Text.NL();
						Text.Add("You incredulously realize that she somehow made it, all of her swollen knot is trapped inside your distended bowels, throbbing as it announces her coming orgasm. You try to pull away, but find it impossible, her thick bulge is trapping you and preventing you from moving even a fraction of an inch. The intense pressure causes your rectal muscles to convulse as yet another anal orgasm wrecks your body, the tightness pushing Miranda well past her own limits.", parse);
						Text.NL();
						Text.Add("<i>”FUUUUUUCK!!!”</i> she loudly cries out, as you feel wave after wave of potent cum fill your belly. The knot is preventing any sperm from escaping, leaving her immense load only one way to go. After what feels like an eternity, she is finally spent. Your belly is stretched beyond what you thought possible, making you look heavily pregnant. Miranda collapses on top of you, the weight of her breasts pressing down on your back.", parse);
						Text.NL();
						Text.Add("This, of course, is the time that the bartender decides to check in on you. He surveys the scene clinically: you lie pressed on the floor with your butt sticking out, completely filled by the hermaphrodite dog’s knotted cock. Trickles of the guardswoman’s cum somehow flows past the knot and join the pool of your fluids on the floor. The tall equine sighs and mutters that this will be a mess to clean up, shaking his head as he walks out. The flushed and tired Miranda sits up and pulls you into her lap.", parse);
						Text.NL();
						Text.Add("<i>”Well, I don’t think you have much choice but to stay like this for a while,”</i> she purrs. You have to admit it’s true, the knot is holding you firmly in place. Resigned to your fate, you snuggle up against your canid lover, making the best of the situation. You stay that way for about a quarter of an hour, Miranda whispering dirty pillow talk in your ears. Her words leave you no doubt that she’ll want to do this again, and often. Finally she is able to pull out her softened member from your bowels, releasing a torrent of her cum down your [legs].", parse);
						Text.NL();
						Text.Add("You have a little trouble walking, and don't think you'll be able to sit properly for a few days. The both of you drunkenly stagger out into the night together. Before you part, Miranda pulls you down to your knees, and makes you give her a blowjob right in the middle of the street.", parse);
						Text.NL();
						
						Sex.Blowjob(player, miranda);
						miranda.Fuck(miranda.FirstCock(), 2);
						player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
						
						Text.Add("<i>”Remember that your ass belongs to me now, little slut!”</i> she drunkenly proclaims as she fills your bowels with another batch of dog cum, this time pouring from the other direction. It seems you have brought out a really dominant streak in Miranda.", parse);
						Text.NL();
						Text.Add("<i>”Can't wait for our next fuck, love,”</i> she purrs as she swaggers off into the night.", parse);
						Text.Flush();
						
						miranda.relation.IncreaseStat(100, 15);
						miranda.subDom.IncreaseStat(100, 20);
						
						player.AddLustFraction(-1);
						miranda.AddLustFraction(-1);
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
						});
					}, enabled : true,
					tooltip : "Let her take the lead. Things might get a bit rough."
				});
				Gui.SetButtonsFromList(options);
			}, enabled : true,
			tooltip : "This requires further... investigation."
		});
		Gui.SetButtonsFromList(options);
	}
}

Scenes.Miranda.MaidensBaneTalk = function() {
	Text.Clear();
	
	if(miranda.flags["Met"] == 1) {
		Scenes.Miranda.HeyThere();
	}
	else
	{
		// TODO: Attitude
		if(miranda.flags["Attitude"] >= Miranda.Attitude.Neutral)
			Text.Add("You walk over to Miranda, who is lounging on one of the benches in the shady tavern. She’s already gotten started on her first few drinks, and waves you over when she notices you.");
		else
			Text.Add("You walk over to Miranda, who is lounging on one of the benches in the shady tavern. When she notices you, her eyes narrow dangerously. Looks like she isn't particularly happy about seeing you.");
		Text.NL();
		
		if(miranda.flags["Met"] == 2) {
			Scenes.Miranda.JustOneMore();
		}
		else if(miranda.flags["Attitude"] >= Miranda.Attitude.Neutral) {
			Scenes.Miranda.Chat();
		}
		else {
			Text.Add("[PLACEHOLDER] Bad interactions.");
			Text.Flush();
			
			Gui.NextPrompt();
		}
	}
}

world.loc.Rigard.Tavern.common.events.push(new Link("Miranda", function() { return world.time.hour >= 17 || world.time.hour < 2; }, true,
function() {
	if(world.time.hour >= 17 || world.time.hour < 2)
		Text.AddOutput("Miranda is lounging at a table in the shady tavern. ");
},
Scenes.Miranda.MaidensBaneTalk,
"Miranda is lounging at a table in the shady tavern."));


