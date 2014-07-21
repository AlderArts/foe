/*
 * 
 * Define Cale
 * 
 */
function Cale(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Wolfie";
	
	this.body.DefMale();
	this.body.SetRace(Race.wolf);
	this.SetSkinColor(Color.gray);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.wolf, Color.gray);
	this.FirstCock().length.base = 23;
	this.FirstCock().thickness.base = 5;
	
	this.flags["Met"]      = Cale.Met.NotMet;
	this.flags["Met2"]     = 0;
	this.flags["Sexed"]    = 0;
	this.flags["Rogue"]    = 0;
	this.flags["sneakAtk"] = 0;
	
	this.flags["xOut"]     = 0;
	this.flags["xedOut"]   = 0;
	
	this.flags["rotPast"]  = 0;
	
	this.SetLevelBonus();
	this.RestFull();
	
	if(storage) this.FromStorage(storage);
	
	if(this.Slut() >= 60) {
		this.Butt().capacity.base = 90;
	}
	else {
		this.Butt().capacity.base = 35;
	}
}
Cale.prototype = new Entity();
Cale.prototype.constructor = Cale;

Cale.Met = {
	NotMet : 0,
	First  : 1,
	YouTookRosalin  : 1,
	CaleTookRosalin : 2,
	SharedGotFucked : 3,
	SharedFuckedHim : 4,
	SharedOnlyRosie : 5
};
Cale.Met2 = {
	NotMet     : 0,
	Talked     : 1,
	TalkedSlut : 2,
	Goop       : 3
}
Cale.Rogue = {
	Locked : 0,
	First  : 1,
	Ret    : 2,
	Taught : 3
}

Cale.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.virgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	
	if(this.flags["Met2"] != Cale.Met2.NotMet)
		this.name = "Cale";
}

Cale.prototype.ToStorage = function() {
	var storage = {
		virgin : this.Butt().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

Scenes.Cale = {};

// Schedule
Cale.prototype.IsAtLocation = function(location) {
	return true;
}

// interaction
Scenes.Cale.Interact = function() {
	var parse = {
		playername : player.name
	};
	
	if(cale.flags["Met2"] == Cale.Met2.NotMet) {
		cale.name = "Cale";
		cale.flags["Met2"] = Cale.Met2.Talked;
		Scenes.Cale.FirstApproach();
		return;
	}
	else if((cale.flags["Met2"] == Cale.Met2.Talked) && cale.Slut() >= 50) {
		cale.flags["Met2"] = Cale.Met2.TalkedSlut;
		Scenes.Cale.TalkSlut();
		return;
	}
	
	Text.Clear();
	if(cale.Relation() >= 40)
		Text.Add("<i>”Hey there, chief!”</i> Cale greets you excitedly.”</i>", parse);
	else
		Text.Add("<i>”Hey there, [playername],”</i> Cale greets you politely.", parse);
	Text.NL();
	Text.Add("You return the greeting and ask him how he is.", parse);
	Text.NL();
	Text.Add("<i>”I’m fine, thanks for asking,”</i> he replies.", parse);
	Text.NL();
	if(cale.Slut() >= 60)
		Text.Add("He glances at you sideways with an expectant look, a seductive smirk plastered on his canine muzzle. <i>”Everytime I see you around I get a nice tingling in my butt. You here to do something about that or is there something else you want?”</i>", parse);
	else if(cale.Slut() >= 30)
		Text.Add("He averts his gaze for a moment, an awkward silence settling between the two of you before he breaks the ice, <i>”So… you here for another go at me, or is it something else you want?”</i>", parse);
	else
		Text.Add("He glances at you with a smile on his wolfish muzzle. <i>”What’s up? Here for business or pleasure?”</i>", parse);
	
	if(DEBUG) {
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: relation: " + cale.relation.Get()));
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: slut: " + cale.slut.Get()));
		Text.NL();
	}
	Text.Flush();
	
	Scenes.Cale.Prompt();
}

Scenes.Cale.Desc = function() {
	var parse = {
		
	};
	if(cale.flags["Met2"] == 0) {
		Text.Add("The wolf-morph from the time with Rosalin is seated near the fire, staring idly into the flames.", parse);
	}
	else {
		if(cale.Slut() >= 60)
			Text.Add("Cale is sitting by the fire, he looks at you with a lecherous look and an evil smirk. You note that he’s idly pawing his butt, while his tail wags above. The moment he spots you staring, he calls you over with a crooked finger. No doubt he’s thinking about all the fun you’ve had together.", parse);
		else if(cale.Slut() >= 30)
			Text.Add("Cale sits by the fire, idly looking at the flames dance, sometimes he glances your way and when your eyes meet he casts you a lopsided grin.", parse);
		else
			Text.Add("Cale is sitting by the fire, staring idly into the flames.", parse);
	}
	Text.NL();
}




world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	function() { return cale.name; }, function() { return cale.flags["Met"] != 0 }, true,
	function() {
		if(cale.flags["Met"] != 0)
			Scenes.Cale.Desc();
	},
	Scenes.Cale.Interact
));

Scenes.Cale.FirstApproach = function() {
	var parse = {
		playername : player.name,
		guyGal     : player.mfTrue("guy", "gal"),
		thighDesc  : function() { return player.ThighDesc(); },
		hipDesc    : function() { return player.HipDesc(); },
		skinDesc   : function() { return player.SkinDesc(); },
		earDesc    : function() { return player.EarDesc(); },
		buttDesc   : function() { return player.Butt().Short(); }
	};
	
	Text.Clear();
	
	world.TimeStep({minute: 30});
	
	Text.Add("You approach the wolf-morph, calling out a greeting to him as you join him at the fireside.", parse);
	Text.NL();
	if(cale.flags["Met"] == Cale.Met.SharedFuckedHim) {
		Text.Add("Your eyes roam appreciatively over the wolf's form until they focus on the sweet ass you fucked before, and you can't help but lick your lips at the memory.", parse);
		Text.NL();
		Text.Add("He jumps a little at your greeting, looking to sides nervously as he finally lets his gaze settle on you. <i>”Oh, umm… H-Hey there,”</i> he greets you back with a nervous grin. <i>”How you’re doing… err…”</i> He trails off realising he didn’t quite catch your name.", parse);
		Text.NL();
		Text.Add("You tell him that your name is [playername]. So, how about him? How has he been doing since the two of you... met?", parse);
		Text.NL();
		Text.Add("He looks down, a bit flustered. <i>”You know… just thinking,”</i> he offers tentatively.", parse);
		Text.Flush();
		
		//[BeForward] [Neutral] [Comfort]
		var options = new Array();
		options.push({ nameStr : "Be forward",
			func : function() {
				Text.Clear();
				Text.Add("Smirking to yourself, you saunter closer to the wolf-morph, who visibly restrains himself from flinching. Your hand reaches out and presses itself gently against his thigh, feeling the soft fur underneath. With slow, sensuous motions your fingers start to rub up and down, trailing the contour of his nicely muscled legs.", parse);
				Text.NL();
				Text.Add("As you continue stroking his thigh, you casually ask what he was thinking about. You feign ignorance of his growing arousal, but really you are drinking in every reaction, delight flooding you as you see the bulge between his legs growing ever more pronounced.", parse);
				Text.NL();
				
				player.AddLustFraction(0.5);
				
				Text.Add("He swallows audibly, looking at your hand rubbing his thigh. <i>”I was thinking about what we did…”</i> he trails off. <i>”Not with Rosie. That’s run of the mill. But what <b>we</b> did over there. Or rather, what <b>you</b> did to <b>me</b>,”</i> he adds, averting his gaze with a slight frown.", parse);
				Text.NL();
				Text.Add("You know he's not going to say he didn't like it, you declare, your hand slowly creeping inwards, over his thigh and towards his loins. You dexterously flick the button holding his pants closed, exposing the tip of his canine member and drawing a shudder from the wolf. Enjoying every moment of this exchange, you wrap a hand possessively around the warmth of his now-erect cock. Up and down you stroke him in slow, languid pumps, your thumb rubbing circles over his pointy glans.", parse);
				Text.NL();
				Text.Add("He moves his hip in tandem with your stroking, wary of disturbing your pace lest you stop your ministrations. He moans softly as he begins gyrating his hips. <i>”I didn’t… I mean, I didn’t say I didn’t like it,”</i> he replies, humping your hand softly. Considering the way his face is scrunching up in pleasure, you’d guess this simple handjob is feeling nearly as good as Rosalin’s pussy.", parse);
				Text.NL();
				Text.Add("Smirking, you ask if he remembers asking for another go after your last encounter, continuing to pump and rub as you do so. His eyes force themselves open and he looks at you, nodding mutely. In reply, you remove your hand from his dick.", parse);
				Text.NL();
				if(player.FirstCock())
					Text.Add("Before he can protest, you take his hand and place it against your own loins. With a grin, you tell him that you came to grant him his request.", parse);
				else if(player.Strapon())
					Text.Add("Leaning towards him, you stage whisper into his ear that you have just the thing for him, despite your current lack of a cock.", parse);
				else
					Text.Add("Leaning towards him, you stage whisper into his ear that it might not be the same as before, but you're looking for another round yourself.", parse);
				Text.Add(" He begins panting at your declaration. After a quick look around he points to a tent nearby. <i>”That’s my tent,”</i> he says, getting up on his feet and walking over, not caring that his erect wolf prick is bobbing in the wind for all the world to see. He looks over his shoulder to see if you’re coming or not.", parse);
				Text.NL();
				Text.Add("Chuckling, you remark that he’s in quite a hurry to be used isn’t he? Well you’d like to at least know the name of your beta before going any further.", parse);
				Text.NL();
				Text.Add("He slaps his forehead with an open palm. Clearly he forgot his manners in his eagerness to get you inside his tent. <i>”S-Sorry,”</i> he apologizes in embarrassment. <i>”I’m Cale,”</i> he says, tail wagging as he bows slightly. <i>”Umm… [playername].”</i>", parse);
				Text.NL();
				Text.Add("Now, that’s better. You get up on your feet and walk up to him. Offering a hand you lift him to his feet and deftly button up his pants. Can’t have the whole world sizing up your beta now, can you? Then you turn him towards the tent he pointed at earlier, and send him on his way with an audible slap on his butt. He yelps in surprise, but quickly moves to comply as you follow in tow.", parse);
				Text.Flush();
				
				cale.slut.IncreaseStat(100, 5);
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Scenes.Cale.TentSex();
				});
			}, enabled : true,
			tooltip : "Looks like you definitely left the right sort of impression on him. Why not tease him a little?"
		});
		options.push({ nameStr : "Neutral",
			func : function() {
				Text.Clear();
				Text.Add("You ask if he meant what he said before - about wanting to try things your way again.", parse);
				Text.NL();
				Text.Add("He scratches the back of his head, looking more than a little flustered at your bluntness. <i>”I guess I did. I mean… I’ve never done anything like that. Actually, I’d never even considered it, but yeah. I guess it felt pretty good in the end,”</i> he explains. Seems like he’s confused about what to make of this whole situation.", parse);
				Text.NL();
				Text.Add("Shrugging your shoulders, you ask what the problem is then; he enjoyed it, he admits he enjoyed it, he thinks he could enjoy doing it again. What's to worry about it?", parse);
				Text.NL();
				Text.Add("But, anyway, you were hoping he might tell you his name? You didn't catch it when you two were... ‘introduced’ by Rosalin.", parse);
				Text.NL();
				Text.Add("His ears twitch in realisation. <i>”Yeah, that’s right,”</i> he clears his throat. <i>”I’m Cale. I suppose it’s a bit late, but nice to meet you… umm… [playername].”</i> He offers you a hand in a friendly gesture. <i>”I said I’d get you back for what you did when we were with Rosie, but I guess it’s fine. Let bygones be bygones.”</i>", parse);
				Text.NL();
				Text.Add("You reach out and take his hand, shaking it firmly as you return the sentiment.", parse);
				Text.NL();
				Text.Add("<i>”Great, so is there anything you’d like to talk about? Or is there anything I can do for you?”</i>", parse);
				Text.Flush();
				
				Scenes.Cale.Prompt();
			}, enabled : true,
			tooltip : "Let's just cut to the chase."
		});
		options.push({ nameStr : "Comfort",
			func : function() {
				Text.Clear();
				Text.Add("Smiling gently, you ask if he's alright, and apologise for how you treated him that time with Rosalin.", parse);
				Text.NL();
				Text.Add("He looks a bit surprised at the apology. <i>”Huh? Oh, right. Sure, no problem. It’s not like I didn’t enjoy it,”</i> he examines you, a bit unsure of himself. <i>”A bit, just a bit,”</i> he hurriedly adds.", parse);
				Text.NL();
				Text.Add("You tell him that you're glad to hear that; you didn't realise he was a virgin when you picked to take him that way. You'll try to give him more of a choice in the matter in the future. If there is one, you quickly add.", parse);
				Text.NL();
				Text.Add("<i>”Right, though I should hope the terms are different. I’m a guy, and I’m sure I don’t swing that way. My thing is pitching, not catching,”</i> he states, you’re not sure if to reassure you or himself. <i>”I said I’d get you back for doing that to me, but you seem like a pretty cool [guyGal]. So you can forget about that threat,”</i> he adds, tail wagging slightly.", parse);
				Text.NL();
				
				cale.relation.IncreaseStat(100, 10);
				cale.relation.DecreaseStat(0, 10);
				
				Text.Add("You tell him that you're grateful that he's so understanding. Now, since that's behind the two of you; perhaps he wouldn't mind telling you his name? Since he never mentioned it earlier.", parse);
				Text.NL();
				Text.Add("<i>”Oh? Sure, my bad,”</i> he clears his throat, <i>”I’m Cale, and I’ve taken it upon myself to be around anytime Rosie needs a quick shag. Nice to meet you, [playername].”</i> He extends a hand in greeting.", parse);
				Text.NL();
				Text.Add("You grip his hand and tell him that it's nice to meet him as well.", parse);
				Text.NL();
				Text.Add("<i>”Now that we’ve been properly introduced, something I can do for you?”</i>", parse);
				Text.Flush();
				
				Scenes.Cale.Prompt();
			}, enabled : true,
			tooltip : "He's obviously uncertain about how he feels; why not be nice to him?"
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else if(cale.flags["Met"] == Cale.Met.SharedGotFucked) {
		Text.Add("You swallow hard, mind replaying the memories of him as he fucked you earlier, a pang of equal parts lust and intimidation momentarily rocking through you.", parse);
		Text.NL();
		parse["thigh"] = player.LowerBodyType() == LowerBodyType.Single ? parse["hipDesc"] : parse["thighDesc"];
		Text.Add("His ears perk up as he catches your greeting. Looking you over with a big grin. <i>”Hello, how you doing?</i> the wolf asks, wagging his tail. <i>”What brings you my humble spot by the bonfire?”</i> he flirts, placing a hand on your [thigh].", parse);
		Text.NL();
		Text.Add("You wanted to talk to him, you reply, doing your best to ignore his hand as it rests upon your [skinDesc].", parse);
		Text.NL();
		Text.Add("<i>”Well… now you have my undivided attention,”</i> he flirts back with a lopsided smile, as he moves his hand to caress your side.", parse);
		Text.Flush();
		
		//[Reassert] [Ignore] [Enjoy]
		var options = new Array();
		options.push({ nameStr : "Reassert",
			func : function() {
				Text.Clear();
				parse["dom"] = player.SubDom() > 50 ? ", lest he lose it" : "";
				Text.Add("Bristling indignantly, you look the amorous wolf right in the eye and snap at him to remove his paw[dom], glaring fiercely and making it clear from tone and posture that you won't brook any refusal.", parse);
				Text.NL();
				
				player.subDom.IncreaseStat(50, 2);
				player.slut.DecreaseStat(0, 2);
				
				if(player.Femininity() > 0.3)
					Text.Add("<i>”Frisky one, aren’t you? But fair enough. I can take a hint.”</i>", parse);
				else
					Text.Add("<i>”Didn’t like getting done by me, huh?”</i> he chortles. <i>”That’s alright then. I can take a hint.”</i>", parse);
				Text.Add(" He takes a moment clear his throat then offers you a hand. </i>”The name’s Cale. Bit late for greeting, I think, but nice to meetcha,”</i> Cale grins, tail wagging behind him.", parse);
				Text.NL();
				Text.Add("You take his hand and shake it, sharing your own name in turn.", parse);
				Text.NL();
				Text.Add("<i>”So, now that we’ve met. What can I do ya for?</i> he smirks.", parse);
				Text.Flush();
				
				Scenes.Cale.Prompt();
			}, enabled : true,
			tooltip : "Tell him to keep his paws to himself."
		});
		options.push({ nameStr : "Ignore",
			func : function() {
				Text.Clear();
				Text.Add("Your eyes flick casually to his hand, but then you look back at him nonchalantly, making no show of any feelings you may have about it being there.", parse);
				Text.NL();
				Text.Add("<i>”It might be a bit late for introductions, but the name’s Cale. Nice to meetcha,”</i> he gives you a friendly tap on the shoulder.", parse);
				Text.NL();
				Text.Add("You nod in acknowledgement, returning the greeting and providing your own name in return.", parse);
				Text.NL();
				Text.Add("<i>”So, what brings you? Came to take me up on my offer or is there something else you want?</i> he asks with a lopsided grin.", parse);
				Text.Flush();
				
				Scenes.Cale.Prompt();
			}, enabled : true,
			tooltip : "Eh, it's not hurting you, let him rub."
		});
		options.push({ nameStr : "Enjoy",
			func : function() {
				Text.Clear();
				
				parse["ears"] = player.HasFlexibleEars() ? " your [earDesc]s flattened against your skull," : "";
				Text.Add("Eyes sinking half closed in pleasure,[ears] you smile in pleasure and let out a soft coo of delight. You lean deliberately against his hand, stretching slightly to let him touch you however he wants.", parse);
				Text.NL();
				
				player.subDom.DecreaseStat(-50, 2);
				player.slut.IncreaseStat(50, 2);
				
				Text.Add("He chuckles at your reaction, growing bolder as he hooks his arm around your waist and pulls you closer against himself. This close to him, you can easily smell his musk, a mixture of grass, earth and man. Very intoxicating. You find yourself closing your eyes and leaning over him to catch a better whiff of his scent.", parse);
				Text.NL();
				parse["fem"] = player.mfFem("", ", my pretty");
				Text.Add("<i>”Enjoying this, are you?”</i> he asks, chuckling at your submissive demeanor. <i>”I feel like we should at least introduce ourselves before going further though.”</i> He places his hands on your shoulders and pushes you away to look into your eyes, <i>”My name is Cale. What is yours[fem]?”</i>", parse);
				Text.NL();
				Text.Add("You can't help pouting at being pushed away like that, but you smile at the attention he's showing you, chirping your own name in response.", parse);
				Text.NL();
				parse["fem"] = player.mfFem("", ", pretty");
				Text.Add("<i>”[playername], huh? That name suits you. Now tell me[fem], why did you come to my little spot by the bonfire? Maybe you wanted to make good on my offer?”</i> he chuckles. Then he points to a nearby tent. <i>”That’s my tent. Why don’t we head inside and get a bit more comfortable?”</i> he asks, giving your [buttDesc] a slap in the process.", parse);
				Text.Flush();
				
				//[Yes][No]
				var options = new Array();
				options.push({ nameStr : "Yes",
					func : function() {
						Text.Clear();
						
						player.slut.IncreaseStat(100, 3);
						
						Text.Add("<i>”Good. Come with me,”</i> he says, giving your [buttDesc] a quick grope. He gets up, adjusting his trousers to make his bulge just a bit more pronounced. You find your eyes homing in on that bulge and the promise it holds. <i>”My eyes are up here,”</i> he chuckles, breaking you out of your reverie. He extends a hand to help you stand.", parse);
						Text.NL();
						Text.Add("Eagerly you reach out and take it, happily accepting his help and pulling yourself right up against him once you are upright again.", parse);
						Text.NL();
						Text.Add("Looping an arm around your waist to grab your butt and pull you close, he leads you towards his tent. <i>”This is gonna be fun.”</i>", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							Text.Clear();
							Scenes.Cale.TentSex();
						});
					}, enabled : true,
					tooltip : "Well, you were practically asking for it, why not go all the way?"
				});
				options.push({ nameStr : "No",
					func : function() {
						Text.Clear();
						Text.Add("<i>”Too bad. But my offer stands. Come to me whenever you feel like you need some good wuffie lovin,”</i> he chuckles. Slowly, he releases you and gives you some distance. <i>”Now then, since you don’t want to visit my tent, what can I do for you?”</i>", parse);
						Text.Flush();
						
						Scenes.Cale.Prompt();
					}, enabled : true,
					tooltip : "This is getting a little too far, you didn't come here to fuck. Well, not just yet anyway."
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true,
			tooltip : "This feels nice; why not let him see that you're enjoying it?"
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else if(cale.flags["Met"] == Cale.Met.CaleTookRosalin) {
		Text.Add("<i>”Hey there! Didn’t catch your name last time,”</i> the wolf grins, reminiscing of his romp with Rosalin. <i>”I was a bit preoccupied.”</i>", parse);
		Text.NL();
		Text.Add("You introduce yourself, wondering if he and the alchemist are a couple.", parse);
		Text.NL();
		Text.Add("<i>”Rosie? Hah! Nah, she just likes me for my cock.”</i> He certainly seems sure of himself. <i>”Name’s Cale, by the way. A pleasure.”</i> He pats the wooden log he’s sitting on. <i>”Have a seat, [playername].”</i>", parse);
		Text.NL();
		Text.Add("He goes on to explain that he and Rosalin are fuckbuddies, if more by happenstance than design. <i>”I just happened to be around when she went into heat, and she’s consistently come back for more ever since. If you have your eyes set on her I don’t mind, though. She’s a bit crazy, but a really nice fuck.”</i>", parse);
		Text.NL();
		Text.Add("<i>”So, what did you want to talk about?”</i>", parse);
		Text.Flush();
		
		Scenes.Cale.Prompt();
	}
	else { // You took Rosalin
		Text.Add("You explain that you were wondering if he's alright with what happened back with Rosalin.", parse);
		Text.NL();
		Text.Add("He turns to look at you, chuckling, he replies, <i>”Sure. I like Rosie but it’s not like we’re attached on the hips or anything. She just does her thing with whomever is handy at the time,”</i> he shrugs. <i>”I just make sure to be handy most of the time,”</i> he adds with a grin.", parse);
		Text.NL();
		Text.Add("You nod as you digest that fact. Then, prompted by curiosity, you ask how he knows Rosalin - it looks and sounds like the two of them are pretty close.", parse);
		Text.NL();
		Text.Add("<i>”Rosie and I got a thing going… well, I do anyway. But it’s nothing serious. She needs to get laid sometimes, and I like getting laid. She needs a stud, and I like pussy. Simple math. ", parse);
		if(cale.flags["Met"] == Cale.Met.YouTookRosalin)
			Text.Add("Not gonna lie, I’m not happy that you beat me to the punch last time, but I won’t hold it against you either. So rest easy, there’s always next time,”</i> he gives you a lopsided grin.", parse);
		else
			Text.Add("I don’t mind sharing her from time to time. So long as you don’t hog all of her for yourself.”</i> The wolf gives you a lopsided grin.", parse);
		Text.NL();
		Text.Add("You nod to show that you understand what he's saying, and then ask what his name is, politely offering your own in exchange.", parse);
		Text.NL();
		Text.Add("<i>”Oh, yeah. Sorry bout my manners. I’m Cale, pleased to meetcha [playername].”</i> He offers you a friendly hand.", parse);
		Text.NL();
		Text.Add("You take his hand and shake it.", parse);
		Text.NL();
		Text.Add("<i>”So, got any business with me?”</i>", parse);
		Text.Flush();
		
		Scenes.Cale.Prompt();
	}
}

Scenes.Cale.TalkSlut = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("When you approach him, Cale winces visibly. You ask him what’s up.", parse);
	Text.NL();
	Text.Add("<i>”I, uh… you are not planning on fucking me again, are you?”</i> he looks at you apprehensively. What, he’s getting cold feet <i>now</i>? That seems just a little bit too late. <i>”Well, you can, if you want, I guess,”</i> he still looks a bit uncomfortable, so you tell him to just spit it out.", parse);
	Text.NL();
	Text.Add("<i>”Ah, well, it feels good and all, taking you, but I was wondering if there was something for the pain… maybe you could try to find something? It isn’t that bad,”</i> he hurriedly adds, <i>”just at the start.”</i>", parse);
	Text.NL();
	Text.Add("Perhaps you could ask Rosalin about it. Out loud, you tell him that you’ll find something. Cale nods, feeling reassured. <i>”So, what did you want?”</i>", parse);
	Text.Flush();
	
	Scenes.Cale.Prompt();
}

Scenes.Cale.Prompt = function() {
	var parse = {
		
	};
	
	//[Talk][Tent][Sex][Shop][Rogue][Anal]
	var options = new Array();
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add("<i>”Just chat then? Sure, whatcha wanna talk about?”</i>", parse);
			Text.Flush();
			Scenes.Cale.TalkPrompt();
		}, enabled : true,
		tooltip : "Have a chat with Cale."
	});
	options.push({ nameStr : "Tent",
		func : function() {
			Text.Clear();
			if(cale.Slut() >= 60)
				Text.Add("<i>”Why, are you getting shy all of a sudden?”</i> Cale teases you with a grin. <i>”You can take me for a ride anytime, any place.”</i> Eager to get started, the wolf pulls you along, heading for his tent.", parse);
			else if(cale.Slut() >= 30)
				Text.Add("<i>”Sure, I don’t mind,”</i> Cale nods, licking his lips. <i>”my butt is always ready for action!”</i> He motions for you to follow, heading for his tent.", parse);
			else
				Text.Add("<i>”If you’re offering, I’m game,”</i> he replies, grinning. <i>”This dog is always ready for action.”</i> You roll your eyes, but follow him as he heads for his tent.", parse);
			Text.NL();
			Text.Flush();
			
			Scenes.Cale.TentSex();
		}, enabled : true,
		tooltip : "Ask if he’s up for a quick skirmish in his tent."
	});
	options.push({ nameStr : "Sex",
		func : function() {
			Text.Clear();
			Scenes.Cale.OutsideSex();
		}, enabled : true,
		tooltip : "Ask the wolf if he's up for a fuck, right here, right now."
	});
	//TODO: SHOP
	options.push({ nameStr : "Shop",
		func : function() {
			Text.Clear();
			Text.Add("<i>”You're interested in buying what I got, huh? Well, sure, I can let you take a look,”</i> the wolf-morph notes. From his various pockets and pouches, he brings out his most recent gathering results, displaying them for you. <i>”What do you think of these?”</i>", parse);
			Text.Flush();
			
			//TODO: Display inventory (randomize each day?)
			
			//#if purchased item
			Text.Add("<i>”Knew I'd have something you wanted; thanks for buying,”</i> he quips, giving you a toothy grin of appreciation.", parse);
			//#else
			Text.Add("<i>”Nothing there today? Alright, come back tomorrow, I should have some new things then,”</i> he assures you.", parse);
			Text.Flush();
			
			Scenes.Cale.Prompt();
		}, enabled : false, //TODO
		tooltip : "See what alchemical ingredients Cale can offer you today."
	});
	if(cale.flags["Rogue"] > 0) {
		options.push({ nameStr : "Rogue",
			func : Scenes.Cale.Rogue, enabled : true,
			tooltip : "Ask him to teach you about the finer points of being a rogue."
		});
	}
	Gui.SetButtonsFromList(options, true, PrintDefaultOptions);
}

Scenes.Cale.TalkPrompt = function() {
	var parse = {
		playername : player.name,
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cAnusDesc : function() { return cale.Butt().AnalShort(); }
	};
	
	//[Himself][His Past][Goals][Rosalin]
	var options = new Array();
	options.push({ nameStr : "Himself",
		func : function() {
			Text.Clear();
			Text.Add("<i>”Myself? Eh, I’m not really that interesting,”</i> he says nonchalantly.", parse);
			Text.NL();
			Text.Add("You assure him that you still want to hear about him; please, won't he share a little with you?", parse);
			Text.NL();
			Text.Add("Smiling he replies, <i>”Well, if you insist. I’m called Cale, I’m a wolf, and my job is currently Rosie’s fetcher of alchemical goods and convenient fuckbuddy. Though I really go out there to get stuff for Rosie, I set a few interesting catches aside for selling. Rosie doesn’t seem to mind, as long as I meet her demands, so why not make some money on the side, right?”</i>", parse);
			Text.NL();
			Text.Add("You give him a politely neutral response, mentally tucking that little titbit away as being potentially helpful.", parse);
			Text.NL();
			Text.Add("<i>”I’m not a very deep or thoughtful guy. Life is short, so I prefer to live in the moment. My interests lie in eating, drinking, gambling and sex, of course. Then again, who doesn’t enjoy a good shagging, right?”</i> he laughs at his own statement.", parse);
			Text.NL();
			Text.Add("Very few people that you can think of, you confess. Especially here in Eden.", parse);
			Text.NL();
			Text.Add("<i>”Elaborating on the sex part, I like pussy. Wet, tight, slippery and hot pussies. The taste, the scent, the feel and the sound of my dick scraping against their walls as they work to milk me, I simply love it. ", parse);
			if(cale.Slut() >= 60) {
				Text.Add("Though I admit that since you’ve showed me a good time, I’ve been thinking that cocks aren’t so bad either. The way they throb, how hot they are, how hard they are, and how a big, fat dick can stir up my insides...”</i> he shudders in a sudden influx of arousal. <i>” That feeling is just… great. I don’t mind putting out for a good meat if they can show me a good time,”</i> he explains.", parse);
				Text.NL();
				Text.Add("So, he hasn't had any problems with his new kink?", parse);
				Text.NL();
				Text.Add("<i>”Not at all. I’m a sexy wolf. Some people fantasize about my cock tying them up, and filling them up with my hot seed. While others think about my [cAnusDesc] milking their cocks for all its worth as they flood my guts with their hot seed. I can appreciate one just as much as the other. All in all, I should be thanking you for broadening my horizons. I seriously would never have imagined anal would feel this good.”</i>", parse);
				Text.NL();
				Text.Add("You tell him that it's perfectly alright; you're happy to have helped him out. You always knew he'd love catching if he only gave it a try.", parse);
			}
			else if(cale.Slut() >= 30) {
				Text.Add(" I… lately I’ve been thinking that fooling around and getting my ass stuffed might not be so bad. Y’know? Not that I’d rather be stuffed rather than being the stuffee. But… let’s just say it’s not so bad. At least it feels good when we do it.”</i> He coughs awkwardly, trying to mask his bashfulness at broaching the subject.", parse);
				Text.NL();
				Text.Add("You simply smile happily. Sounds like your wolf-slut is coming along nicely; now he's starting to admit he enjoys having your [multiCockDesc] in his ass, it's time to start pushing him to really relish it. A bit more tutelage and he should be a ripe, ready buttslut for you.", parse);
			}
			else {
				Text.Add("I don’t really like men, but if they’re craving some hot wolf stuffing I don’t mind obliging. It’d be a sin to keep all this,”</i> he motions towards himself with a flourish, <i>”off the playing field.”</i> He grins, full of confidence.", parse);
				Text.NL();
				Text.Add("Cocky bastard, isn't he? Of course, you don't say so to his face.", parse);
				if(player.FirstCock())
					Text.Add(" Maybe you should show him that it can be fun to be the stuffed as well as the stuffer; you're certainly equipped for it. Yeah, some proper training with your [multiCockDesc] and you're certain he'll start singing a different tune...", parse);
			}
			Text.NL();
			Text.Add("<i>”I guess that’s pretty much it. Like I said. I’m a simple guy who enjoys simple pleasures. Nothing more. Anything else you wanna talk about or did you have enough Cale for the time being?”</i> he jokingly asks.", parse);
			Text.Flush();
			
			cale.relation.IncreaseStat(100, 2);
			world.TimeStep({minute : 15});
			Scenes.Cale.TalkPrompt();
		}, enabled : true,
		tooltip : "Ask Cale to tell you a little about himself."
	});
	options.push({ nameStr : "His Past",
		func : Scenes.Cale.TalkPast, enabled : true,
		tooltip : "See if Cale will share something about his past with you."
	});
	options.push({ nameStr : "Goals",
		func : function() {
			Text.Clear();
			Text.Add("<i>”I’m sorta a guy living in the moment,”</i> Cale says, scratching his chin. <i>”I guess I don’t really think about stuff like that too much. When you get right down to it, I’m in it for the ladies.”</i> He stretches languidly, flexing his muscles.", parse);
			Text.NL();
			Text.Add("<i>”When you got a body like this, you gotta share, you know?”</i>", parse);
			Text.NL();
			if(cale.sex.rAnal > 0) {
				Text.Add("Yeah, you know a thing or two about him sharing. And not only that cock of his you add, grinning.", parse);
				Text.NL();
				if(cale.Slut() >= 60)
					Text.Add("<i>”You sure do,”</i> Cale purrs. <i>”Cale doesn’t mind sharing all his naughty bits, if you know what I mean.”</i>", parse);
				else if(cale.Slut() >= 30)
					Text.Add("<i>”Heh, guess I swing both ways,”</i> he chuckles. <i>”No one can resist this, am I right?”</i>", parse);
				else
					Text.Add("<i>”Well, gotta try new things, right?”</i> The wolf looks unperturbed.", parse);
				Text.NL();
			}
			Text.Add("<i>”Anyways, I just want to get by. Right now, I’ve got a nice thing going here. Good company, I get food and a place to sleep in exchange for relatively little work… and I got pussy on beck and call.”</i> From his wide grin, you guess that last part is the most important.", parse);
			Text.NL();
			Text.Add("<i>”Not really sure where I want to go from here. I think I’ll stick around for a while.”</i>", parse);
			Text.Flush();
			
			cale.relation.IncreaseStat(100, 1);
			world.TimeStep({minute : 5});
			Scenes.Cale.TalkPrompt();
		}, enabled : true,
		tooltip : "What is he looking for in life?"
	});
	options.push({ nameStr : "Rosalin",
		func : function() {
			Text.Clear();
			Text.Add("<i>”Rosie is a very… carefree girl. She took me in and invited me to her tent when I was wandering the countryside after leaving home. She was nice to me, so I help her out.”</i>", parse);
			Text.NL();
			Text.Add("<i>”Be careful when asking Rosalin to mix something up for you, though.”</i>", parse);
			Text.NL();
			Text.Add("Why would he say that?", parse);
			Text.NL();
			Text.Add("<i>”That's how I became a wolf.”</i>", parse);
			Text.NL();
			Text.Add("Oh...", parse);
			Text.NL();
			Text.Add("<i>”Don't take this the wrong way, I love being a wolf. But I had originally asked just for heightened senses. She likes experimenting; always giving things an ‘extra punch’,”</i> he chuckles, shaking his head. <i>”But in the end, I guess I got what I wanted. But the tail took some getting used to,”</i> he smiles, wagging his tail for emphasis.", parse);
			Text.NL();
			if(cale.Relation() > 30)
				Text.Add("<i>”To tell you the truth, I’ll always have a soft spot for her. She’s kinda crazy, but she has her heart in the right place.”</i>", parse);
			else
				Text.Add("<i>”All in all, she’s harmless. Well, basically harmless. As long as you don’t accept any food or drinks she offers you.”</i>", parse);
			Text.NL();
			if(rosalin.flags["PrefGender"] == Gender.male) {
				Text.Add("He, you point out.", parse);
				Text.NL();
				Text.Add("<i>”Ugh, that’s going to take some time getting used to,”</i> Cale mutters, scratching his head.", parse);
			}
			Text.Flush();
			cale.relation.IncreaseStat(100, 1);
			world.TimeStep({minute : 5});
			Scenes.Cale.TalkPrompt();
		}, enabled : true,
		tooltip : "So, what is the story between him and Rosalin?"
	});
	if(cale.Butt().virgin == false) {
		options.push({ nameStr : "Anal",
			func : function() {
				Text.Clear();
				if(cale.flags["Met2"] == Cale.Met2.TalkedSlut) {
					Text.Add("<i>”Ah, don’t worry about what I said before, I like it, I like it,”</i> the wolf hurriedly assures you. <i>”A lot, actually,”</i> he adds, blushing faintly.", parse);
					Text.NL();
					Text.Add("<i>”...Still, if you could find something for the pain, perhaps some potion…?”</i>", parse);
				}
				else {
					if(cale.Slut() >= 60) {
						Text.Add("<i>”Ever since Rosie gave me that cream, I’ve hardly been able to think of anything else!”</i> Cale moans sultrily. <i>”I go out foraging for ingredients, but all I hope for is to be ambushed by some big-cocked monster who’ll fuck me.”</i> He looks hopeful. <i>”You’ll fuck me, right [playername]?”</i>", parse);
					}
					else if(cale.Slut() >= 30) {
						Text.Add("<i>”That should be obvious by now, I’d think,”</i> Cale grins lecherously. <i>”Never knew being on the receiving end could feel so good, so thanks for showing me that, [playername].”</i>", parse);
						Text.NL();
						Text.Add("You live to serve.", parse);
					}
					else {
						Text.Add("<i>”You just love rubbing it in, don’t you?”</i> Cale growls accusingly. <i>”Guess I can’t complain too much, it’s rather new to me, but it doesn’t feel that bad.”</i> He scratches his bum absently.", parse);
						Text.NL();
						Text.Add("From what you remember of his last romp, ‘not that bad’ is a bit of an understatement. Fine, let him keep his pride, for whatever it’s worth.", parse);
					}
				}
				Text.Flush();
				cale.relation.IncreaseStat(100, 1);
				world.TimeStep({minute : 5});
				Scenes.Cale.TalkPrompt();
			}, enabled : true,
			tooltip : "Ask him about how it feels to be the one on the receiving end."
		});
	}
	Gui.SetButtonsFromList(options, true, Scenes.Cale.Prompt);
}

Scenes.Cale.TalkPast = function() {
	var parse = {
		cbuttDesc : function() { return cale.Butt().Short(); },
		canusDesc : function() { return cale.Butt().AnalShort(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		hand : function() { return player.HandDesc(); }
	};
	
	Text.Clear();
	Text.Add("<i>”My past? Why worry about the past? Better focus on the present, unless you happen to dislike what you see right in front of you.”</i> He puffs his chest. <i>”But we both know that’s impossible. ", parse);
	if(cale.Slut() >= 60) {
		Text.Add("After all the times you’ve plowed my [canusDesc] it’s fair to say that you enjoy me plenty.”</i> He grins confidently. <i>”And you should know I enjoy you a lot too.”</i> He licks his lips with a predatory leer.", parse);
		Text.NL();
		Text.Add("You simply smirk back, reaching around to give his [cbuttDesc] an appreciative slap, squeezing his buttcheek through his pants before removing your hand.", parse);
	}
	else if(cale.Slut() >= 30) {
		Text.Add("Don’t know if I care much for you buggering me, but after all the times you’ve done it. It’d be a lie to say you don’t enjoy a good Cale.”</i>", parse);
		Text.NL();
		Text.Add("You just give him a cocky look back, remembering his ecstatic howls and moans as you ravaged his [canusDesc] with your [multiCockDesc]. ”I don't know if I care much for it?” Hah! He'll be admitting the truth soon enough.", parse);
	}
	else if(cale.Sexed()) {
		Text.Add("We’ve had sex already. You wouldn’t bother if you didn’t find me sexy at all.”</i> He grins confidently.", parse);
		Text.NL();
		Text.Add("A calm, quiet look is all the answer you give him, waiting patiently. You have your reasons for asking, after all.", parse);
	}
	else {
		Text.Add("I’ve even been asked out by guys, y’know?”</i>", parse);
		Text.NL();
		Text.Add("What an ego. Still, you keep your mouth shut, hoping he'll get done with the bluster and tell you what you wished to hear.", parse);
	}
	Text.NL();
	Text.Add("He stretches himself, gazing into the sky for a bit before turning his gaze back to you. You just eye him expectantly.", parse);
	Text.NL();
	Text.Add("<i>”Guess you’re not gonna budge till I blab about my past, are you?”</i>", parse);
	Text.NL();
	Text.Add("You shake your head and confirm that's correct; you wouldn't have asked if you weren't interested, after all.", parse);
	Text.NL();
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		Text.Add("<i>”Okay then, but fair warning, I’m no storyteller. And my past is hardly that interesting. It’s just the story of a guy scraping by and enjoying himself when he could. Now where do I begin...”</i> he furrows his brows in thought.", parse);
		Text.NL();
		Text.Add("<i>”I guess I’ll just go ahead and say that I wasn’t always such a nice guy. Back in the day I was running with some rather… unsavory sorts. Thugs, thieves, robbers and the likes. The wrong crowd, if you will. I wasn’t born in a very golden cradle, in fact I don’t think I actually had a cradle to begin with, but life was good. Or as good as it could be for a kid living in the slums. Never met my mum, and dad worked hard at the docks to keep us fed.”</i> He smiles softly remembering the good old days.", parse);
		Text.NL();
		Text.Add("<i>”But yeah… might be a little cliche, but my dad was involved in an accident. Box full of iron fittings fell right over him. Got his leg smashed to bits. After that life got harder, cuz dad couldn’t work anymore and we didn’t have enough coins to afford a decent healer to look at his leg. So, that’s about when I started looking for work. I should have been so lucky to find actual work… but in my case, work found me.”</i>", parse);
		Text.NL();
		Text.Add("You have two really good ideas about what that 'work' might have been, but you ask him to explain what happened.", parse);
		Text.NL();
		Text.Add("<i>”I was inside a bar, trying to get a job as a dishwasher or something, when a fight broke out. Now this asshole was just about to hit a really pretty lady, and I wasn’t going to have any of that. That was the one lesson my dad made sure I learnt. You must always treat them ladies right. Anyway, big bully was about to punch the girl and I intervened, delivered a kick right on his family jewels.”</i> He grins.", parse);
		Text.NL();
		Text.Add("You can just see Cale doing that, and you give him a nod of recognition at the fact.", parse);
		Text.NL();
		Text.Add("<i>”Then came the surprise. The guy didn’t let out a single peep after I kicked him. He just… fell over on his back. And I was wondering how the fuck could that guy get a kick like that and not even grab his nuts, or at least turn around to deck me right on the face. But as the big bully fell, I saw that he had no less than three knives sticking to his chest. Lady was some kind of gang boss or something. I nearly pissed myself when her eyes darted to me and she smiled.”</i>", parse);
		Text.NL();
		Text.Add("You can't blame him for being surprised in a situation like that.", parse);
		Text.NL();
		Text.Add("<i>”If you think the dead guy was surprising, that’s because you haven’t heard the next part. Lady was standing there, all smiles, after just having killed a guy and I’m frozen in fear as she strides over. She reaches out and pats my head, sayin: Boy, you got fire. I like you. Come work for me.”</i>", parse);
		Text.NL();
		Text.Add("Definitely not how a person would expect to get a job, and certainly not what he must have expected for playing the knight in shining armor.", parse);
		Text.NL();
		Text.Add("<i>”Well I wasn’t about to say anything that could get her mad, so I just nodded and followed after her. And that’s how I started walking with the wrong crowd,”</i> he finishes.", parse);
		Text.NL();
		Text.Add("You nod your head thoughtfully as you digest the tale, and then thank him for sharing it with you.", parse);
		Text.NL();
		Text.Add("<i>”Yeah, maybe I’ll tell you about the rest some other time. Anything else you’d like to talk about?”</i>", parse);
	});
	scenes.push(function() {
		Text.Add("<i>”Where did I leave off last time? I told you about the Lady, didn’t I?”</i> You nod, urging for him to continue the story. <i>”Prettiest woman I’ve ever met, but deadly as a viper. Never got her real name. The underworld is a bit weird like that.”</i>", parse);
		Text.NL();
		Text.Add("<i>”Joining the gang was a spur of the moment thing, but I stayed on for quite a while. Back then, I thought I had hit the jackpot. Suddenly, I had cash I could spend, and people were throwing me fearful glances on the streets. Some proper respect ‘n all, you know?”</i>", parse);
		Text.NL();
		Text.Add("<i>”’Course, dad wanted to know where the money came from, but he didn’t dig too deep. Beggars can’t be choosers, and deep down, I think he suspected what was going on.”</i>", parse);
		Text.NL();
		Text.Add("<i>”At first, things weren’t so bad. Small jobs, like standing guard or fetching things from contacts and so on. I had to shake some people down, but I didn’t hurt anyone, just scared ‘em, you know.”</i>", parse);
		Text.NL();
		Text.Add("<i>”Life got rougher. As I started to become someone on the street, I got into fights with rival gangs. Scuffles, ending in some bruises and perhaps a few knicks. Nothing major. Looking back on it, I think people were scared of the Lady.”</i> He looks troubled. <i>”With good reason.”</i>", parse);
		Text.NL();
		Text.Add("The wolf trails off. <i>”Can we talk about something else for a while?”</i>", parse);
	});
	scenes.push(function() {
		Text.Add("<i>”During the time I was in the gang I made many… I dunno if ‘friends’ is the right word? Comrades. People I could trust not to stab me in the back, you know? One in particular became sort of a mentor to me, a guy called Brawler. Yeah, I know, the silly names again. He taught me how to fight dirty, how to survive on the streets. Pretty good guy, all things considered”</i>", parse);
		Text.NL();
		Text.Add("<i>”I became a common thug in Lady’s gang, as I showed promise as a fighter. A swift kick here, a dagger held to the throat there - I had a knack for ending fights quickly, a talent much appreciated in that business. Still have use of the stuff old Brawler taught me up to this day.”</i>", parse);
		Text.NL();
		Text.Add("<i>”So, anyway, I kept training until the Lady and Brawler decided I was good enough to start going on missions for real. This was more dangerous than the basic grunt-stuff that I had been doing for them before, but it got me noticed. Soon, people would talk about me with respect when they said my name,”</i> he smiles proudly at the thought. <i>”I tell you, nothing felt so good back then as to have people notice me like that and talk about me that way. A lot of muscleheads would have started throwing their weight around, picking fights so they could get more and more of a reputation. Me? I was smarter than that,”</i> he smirks.", parse);
		Text.NL();
		Text.Add("<i>”I never picked a fight just for the hell of it; I realised a pointless fight was just going to get people to see me as another stupid, violent thug. I got more respect for not fighting unless I had to than any of those bad-tempered dimwits ever did,”</i> he brags.", parse);
		Text.NL();
		Text.Add("<i>”Of course, even when I made a name for myself, Brawler would never leave off on his training. He made it a habit to always pick me out to spar with at least once a week, and he just loved to announce a surprise match whenever he could. He always said it was good training, kept me on my toes. Me? I think he just liked fighting,”</i> Cale grins, clearly amused at the memories. <i>”I certainly can’t complain, not with all the moves I picked up because of his little matches.”</i>", parse);
		Text.NL();
		Text.Add("He shakes his head good-naturedly and sighs softly. <i>”Yeah, those were the good times,”</i> he pronounces. <i>”Challenging, yeah, but it always paid off, no matter the risk, and I had real friends at my back when things went down. Yeah, I’d say those were the golden days of my life... but they’re gone now, and they aren’t coming back,”</i> he sighs.", parse);
		Text.NL();
		Text.Add("From the melancholic look on his face, he’s clearly drifting away amongst old memories. Doesn’t look like he’s in any mood to talk further; you’ll need to come back later.", parse);
		
		//Unlock Rogue training
		if(cale.flags["Rogue"] == Cale.Rogue.Locked)
			cale.flags["Rogue"] = Cale.Rogue.First;
	});
	if(cale.Relation() >= 50) {
		scenes.push(function() {
			Text.Add("<i>”Right, where were we? I’d gotten established in the underworld of Rigard, met comrades and someone I still consider my mentor. I was living the life, the money kept flowing and I was on the good side of several girls my age living in the slums.”</i>", parse);
			Text.NL();
			Text.Add("<i>”That’s when things started to turn sour. A new rival gang showed up, invading our turf, quickly turning the streets into a warzone. Real glad I never had to face down their boss, that guy was a monster. Eight feet tall and almost as wide. Meanest scars I’ve ever seen on a guy. Called himself Malice, and wasn’t that a fitting name.”</i>", parse);
			Text.NL();
			Text.Add("<i>”Lost a lot of buddies during that time. Saw a lot of people die. Things came to a head when Lady and a group of her best men were going to raid the enemy hideout, a warehouse in the docks district. Brawler was one of them.”</i> Cale looks troubled.", parse);
			Text.NL();
			Text.Add("<i>”No one ever figured out what really happened that night. There were a few dead bodies, but they were… their wounds were strange, not caused by any weapon I’ve ever seen. They looked like they’d been mauled by some wild animal. Neither Lady nor the rival gang leader were among them, and there were a whole lot of men missing on both sides. To this day, neither hide nor hair has been seen of any of them.”</i>", parse);
			Text.NL();
			Text.Add("<i>”Even the watch were stumped as to what had happened, but with the two largest roughnecks of the slums out of the way, they weren’t exactly complaining. Never saw Brawler after that, either.”</i>", parse);
			Text.NL();
			Text.Add("<i>”Things got kind of chaotic, with everyone in the gang running around like headless chickens, the whole underworld was kinda messed up for a while, with a lot of new folks running in to fill the power gap.”</i>", parse);
			Text.NL();
			Text.Add("<i>”Around that time, I figured that this line of work perhaps wasn’t healthy for me after all.”</i> He trails off, reminiscing about the past.", parse);
			Text.NL();
			Text.Add("You figure this was enough talking for the time being...", parse);
		});
		scenes.push(function() {
			Text.Add("<i>”So, things had just gone south, so to speak.”</i> The wolf clears his throat.", parse);
			Text.NL();
			Text.Add("<i>”Leaderless, my old gang started in-fighting, caught up in who would be the next head-honcho. I didn’t want to get into any of that, so I dropped out during the confusion. Dad was getting older, and he’d fallen ill. Money was suddenly scarce again, and I had to use all my contacts to get work.”</i>", parse);
			Text.NL();
			Text.Add("<i>”At that point, I don’t think there was anything I wouldn’t do, no job I wouldn’t take. I never killed anybody, but I think I might have, if I had to. That was a few really bad years.”</i> Cale looks very different from his usual cock-sure self. <i>”All my efforts turned to nothing when winter came one year. Dad finally kicked the bucket, and I was left without a penny to my name. Figuring things could hardly get any worse, I left Rigard for good.”</i>", parse);
			Text.NL();
			Text.Add("The pain in his voice is still raw, and you guess that this happened only months before you first arrived on Eden. You place a comforting [hand] on his shoulder.", parse);
			Text.NL();
			Text.Add("<i>”Sorry. There is only a little bit left, but could we talk about something else for a bit?”</i> Taking pity on the wolf, you nod understandingly.", parse);
		});
		scenes.push(function() {
			Text.Add("<i>”I drifted for a while, before happening across the nomads. Meeting up with Rosie here was the best thing that had happened to me in years. We hit it off pretty well, and here we are. I might not look the same as when I first came here, but that is a story for another time.”</i>", parse);
			Text.NL();
			Text.Add("<i>”And that is the story of Cale, as it is. A bit of it letdown toward the end, I know. This place isn’t too bad though, I kinda fit in. I found something to do in fetching stuff for Rosalin and helping Estevan hunt, but I mostly just lay around, enjoying the free life.”</i>", parse);
			Text.NL();
			Text.Add("<i>”Things are much simpler here, no gangs, no plots, no killer thugs. As a wolf, I get plenty of pussy too, so life is finally being good to me.”</i>", parse);
			if(cale.Slut() >= 30) {
				Text.NL();
				Text.Add("<i>”After that a certain [playername] came around and showed me the pleasures of buttsex. Not that I’m complaining, mind you. But I have a feeling you already know that story,”</i> he chuckles.", parse);
			}
		});
	}
	
	var sceneId = cale.flags["rotPast"];
	if(sceneId >= scenes.length) sceneId = 0;
	
	cale.flags["rotPast"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	cale.relation.IncreaseStat(100, 3);
	
	Text.Flush();
	
	world.TimeStep({minute : 30});
	
	Scenes.Cale.TalkPrompt();
}

//TODO
Scenes.Cale.TentSex = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Add("The two of you duck inside the small cloth-enclosure, even smaller than your own tent among the nomads. It still holds enough space to house a set of warm bedrolls, which is all you are interested in either way.", parse);
	Text.NL();
	Text.Add("Cale shrugs out of his clothes, pulling you into a close embrace, his fur tickling you. <i>”Why don’t we get started, [playername]?”</i> he murmurs, nipping your neck playfully.", parse);
	Text.Flush();
	
	//[Oral]
	var options = new Array();
	/*
	options.push({ nameStr : "Oral",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	*/
	if(player.FirstVag()) {
		options.push({ nameStr : "Catch Vaginal",
			func : function() {
				Scenes.Cale.SexCatchVag();
			}, enabled : true,
			tooltip : "You want that hot wolf dick inside you, now!"
		});
	}
	options.push({ nameStr : "Catch anal",
		func : function() {
			Scenes.Cale.SexCatchAnal();
		}, enabled : true,
		tooltip : "Because Rogues do it from behind."
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>”What, getting cold feet? Can’t handle the wolf goodness?”</i> Cale seems a bit miffed at you getting him all riled up, but shrugs and follows you outside again.", parse);
		Text.Flush();
		
		Scenes.Cale.Prompt();
	});
}
//TODO
Scenes.Cale.OutsideSex = function() {
	var parse = {
		playername : player.name,
		HeShe : rosalin.HeShe(),
		heshe : rosalin.heshe()
	};
	
	if(cale.Slut() < 60) {
		Text.Add("<i>”I’m front of everyone?”</i> he asks a bit nervously.", parse);
		Text.NL();
		Text.Add("Why not? He doesn’t seem to mind the audience when it’s him and Rosalin making the beast with two backs.", parse);
		Text.NL();
		Text.Add("<i>”Well, Rosie is a bit different. I’m sure you noticed. [HeShe] does whatever [heshe] wants, whenever and wherever [heshe] wants. It’s not a good idea to say no to her, so I don’t really have an option. I just accept it. But you though… wouldn’t it be more comfortable to go back to my tent?”</i>  he offers tentatively.", parse);
		Text.NL();
		Text.Add("You shake your head; no, you want to do it here and now.", parse);
		Text.NL();
		Text.Add("The wolf sighs with a shrug. <i>”Okay, fine. Have it your way. What’re we doing?”</i>", parse);
	}
	else {
		Text.Add("<i>”Feel like putting on a show?”</i> he asks teasingly.", parse);
		Text.NL();
		Text.Add("With a flirtatious smirk, you strike a seductive pose and playfully ask what he thinks the answer is.", parse);
		Text.NL();
		Text.Add("<i>”Well, what are you waiting for? A written invitation?”</i>", parse);
	}
	Text.Flush();
	
	//[Sex] TODO: More options
	var options = new Array();
	if(player.FirstVag()) {
		options.push({ nameStr : "Catch Vaginal",
			func : function() {
				Scenes.Cale.SexCatchVag(true);
			}, enabled : true,
			tooltip : "You want that hot wolf dick inside you, now!"
		});
	}
	options.push({ nameStr : "Catch anal",
		func : function() {
			Scenes.Cale.SexCatchAnal(true);
		}, enabled : true,
		tooltip : "Because Rogues do it from behind."
	});
	/*
	options.push({ nameStr : "Sex",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	*/
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>”You are such a tease, [playername],”</i> Cale complains.", parse);
		Text.Flush();
		
		Scenes.Cale.Prompt();
	});
}

//TODO
Scenes.Cale.SexFuckHim = function(outside) {
	var parse = {
		
	};
	
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	cale.relation.IncreaseStat(100, 3);
	world.TimeStep({hour : 1});
	
	Gui.NextPrompt();
}

//TODO
Scenes.Cale.SexCatchVag = function(outside) {
	var parse = {
		log           : outside ? "log" : "bedroll",
		playername    : player.name,
		skinDesc      : function() { return player.SkinDesc(); },
		tongueDesc    : function() { return player.TongueDesc(); },
		faceDesc      : function() { return player.FaceDesc(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		hipsDesc      : function() { return player.HipsDesc(); }
	};
	
	Text.Clear();
	if(cale.Slut() < 60)
		Text.Add("<i>”Music to my ears.”</i> he says already starting to undo his pants.", parse);
	else
		Text.Add("<i>”Feel like some wolf cock after all the wolf butt you got? I can oblige!”</i> he says, grinning happily as he begins stripping.", parse);
	Text.NL();
	Text.Add("Needing no further encouragement yourself, you start to strip as well, placing your gear side so it’s not likely to get messy or kicked away. By the time you’re finished, Cale is naked and seated with his legs sprawled open, letting you watch him jiggling and stroking his balls, a half-erect wolf-cock bobbing above his sheathe at the motions.", parse);
	Text.NL();
	Text.Add("<i>”How about helping me get prepped for the taking?”</i> He suggests.", parse);
	Text.NL();
	Text.Add("Looks like he needs some priming first... now, what to do...?", parse);
	Text.Flush();
	
	//[Handjob] [Blowjob] [StrokeSelf]
	var options = new Array();
	options.push({ nameStr : "Handjob",
		func : function() {
			Text.Clear();
			Text.Add("With a grin, you saunter towards him and kneel down before him, gently but insistently pushing his hands away before wrapping your own fingers around his dick. The warm semi-turgid flesh pulses gently against your [skinDesc] as you start to rhythmically stroke up and down. You squeeze and release as you go, alternating the pressure in time with your strokes, sliding Cale’s wolfhood through your fingers and across your palm before glancing up and seeing how he’s enjoying this.", parse);
			Text.NL();
			Text.Add("<i>”Yeah… touch my balls too. Get me nice and hard for you,”</i> he says beginning to pant.", parse);
			Text.NL();
			Text.Add("With your free hand, you do as asked, rolling and kneading the full, fluffy orbs against your palm. You can feel his shaft growing harder in your hand, a distinctive roundness at its base signalling his knot coming into play; it’s still deflated, but you and he both know it’s already aching to be used. As wetness starts to dampen your fingers, you smile to yourself, playfully making an idle comment to Cale about him leaking precum already. You keep stroking, letting his fluids seep over your fingers until they drip with it, and then let him go.", parse);
			Text.NL();
			if(player.Slut() >= 25) {
				Text.Add("Holding your hand up so that Cale’s precum glistens on your fingers, you grin at him as you roll it gently back and forth before lifting your palm to your face and starting to lap it clean with your tongue. Eyes half-hooded in desire, you slowly clean your fingers off, noisily sucking them clean until you’ve licked up every drop.", parse);
				Text.NL();
				Text.Add("Cale swallows audibly, and you think you see his cock throb at the sight. <i>”Damn if you don’t know how to get a guy going, [playername]...”</i> he says in admiration.", parse);
			}
			else {
				Text.Add("You idly shake your hand, waving so as to fling the worst of the excess juices aside and make it a little cleaner. Looks like he’s all ready, you note.", parse);
				Text.NL();
				Text.Add("<i>”I sure am.”</i> Cale grins.", parse);
			}
			Text.NL();
			Text.Add("Cale motions to the [log] beside the two of you. <i>”Get comfy and we can get started then.”</i>", parse);
			Text.NL();
			Text.Add("Glancing at the [log], you look back at him and shake your head; you have a different position in mind. You tell him to lay back and get comfortable. Cale tilts his head, looking a little bemused, but shrugs his shoulders and complies readily enough. Rising up, you move to straddle his waist, repositioning him slightly so he’ll be more comfortable, slowly dropping your way down his belly so he fully understands what it is you intend to do, halting just before he can penetrate you.", parse);
			Text.NL();
			
			Scenes.Cale.SexCatchVagEntrypoint(outside);
		}, enabled : true,
		tooltip : "Bat his hands away and show him how it’s done, firsthand."
	});
	options.push({ nameStr : "Blowjob",
		func : function() {
			Text.Clear();
			Text.Add("Smirking seductively, you sashay your way over to Cale and kneel with exaggeratedly demure motions before him. You slowly run your tongue over your lips in a tantalising motion that makes the wolf move his hands, allowing you to lower your [faceDesc] towards his groin.", parse);
			Text.NL();
			Text.Add("Your [tongueDesc] glides out and then slowly strokes up his half-erect shaft, starting just above his sheathe and moving up to his tip. You circle his glans with the tip of your tongue, then release him before applying your tip back at his base and gliding up again, smooth even strokes up and down.", parse);
			Text.NL();
			Text.Add("<i>”Shit! Just don’t go overboard on it. Don’t wanna disappoint and cum before I’ve had a chance at your pussy.”</i>", parse);
			Text.NL();
			Text.Add("You keep that thought in mind, but you’re not done with him yet. You let your tongue trail back down his shaft, licking at the base of his sheath as best you can before moving down to lap at his balls. You trace patterns over them with your tongue-tip, then glide your way back up to his now-dribbling tip, sucking gently at it and letting his precum wash over your senses. When you pull your mouth away, Cale’s cock is sticking out like an accusing finger, pointing straight between your eyes, almost visibly throbbing in arousal.", parse);
			Text.NL();
			Text.Add("<i>”I’m almost sad that you stopped, almost. Now the main course aye?”</i> You nod. <i>”Alright, bend over this [log] yonder, m’lady.”</i> He makes a flourish at the [log] beside the two of you.", parse);
			Text.NL();
			Text.Add("You shake your head with a smile; nope, that’s not how it’s going to work. Standing up, you place a gentle hand on his shoulders and guide him into leaning back against the [log], maneuvering to straddle his waist, your hands still on his shoulders, grinning as you look right into his eyes. As if he needs further explanation of what you have in mind, you start to bend down, resting more of your weight on him, sliding down his trim belly until he can just barely feel the heat of your aroused womanhood on the head of his dick.", parse);
			Text.NL();
			
			Scenes.Cale.SexCatchVagEntrypoint(outside);
		}, enabled : true,
		tooltip : "A little tongue action should get that dick of his nice and ready for you."
	});
	if(cale.Slut() >= 60 && (player.FirstCock() || player.Strapon()))
	{
		options.push({ nameStr : "Stroke self",
			func : function() {
				Text.Clear();
				Text.Add("Grinning cockily back at him, you shift your pose slightly to more prominently display your [multiCockDesc], hands on your [hipsDesc].", parse);
				Text.NL();
				var biggestCock = player.BiggestCock();
				if(biggestCock) {
					parse["cockBiggestDesc"] = function() { return biggestCock.Short(); }
					Text.Add("Curling your thumb and forefinger into a circular pattern, you reach for your [cockBiggestDesc] and slide its glans through the hole of your palm, squeezing softly as you trail down its length until your hand is resting against your groin. You twist your wrist slightly, pulling back against your shaft, and then curl your other hand around your shaft in the same manner, pulling back up your member to your glans.", parse);
					Text.NL();
					parse["s"] = player.NumCocks() > 1 ? "s" : "";
					Text.Add("Your skin tickles at the friction, blood rushing into your shaft[s] as you repeat the milking motion again with your first hand, the second hand taking its place around the base of your dick. With smooth, even strokes you rhythmically pull and stroke, moaning softly in your arousal, eyes hooded in lust as you glance at your wolfy slut and see if he’s enjoying the show.", parse);
				}
				else {
					Text.Add("Adjusting the straps around your loins to make sure it’s properly fixed, you grab your prosthetic [multiCockDesc] and slot it home, checking to see that it’s set properly with slow, purposeful motions. Once satisfied that it’s secure, you smirk at Cale and begin to caress the faux-dick with your fingers, a lewd groan of appreciation bubbling from your lips as they dance up and down across the dildo’s length, acting as if you can truly feel yourself upon the imitation phallus.", parse);
				}
				Text.NL();
				Text.Add("Cale watches the spectacle unfold, tongue lolling out as he pants and strokes his own cock with a hand. His other hand is busy teasing his entrance. The slutty wolf lets out a wanton moan as he finally pierces his tight ring with his middle fingers, masturbating himself as he dreams of your [multiCockDesc] entering him.", parse);
				Text.NL();
				Text.Add("<i>”Damn, [playername]. That’s playing dirty, teasing me with the promise of buttsex,”</i> he says, stifling a moan as he wills himself to stop masturbating. His cock is already throbbing at full mast, the veins bulging out as a droplet of pre slides down his length.", parse);
				Text.NL();
				Text.Add("Maybe so, you concede, but it certainly got him in the mood, now didn’t it? Now, you’ve a hungry pussy here just waiting for some stuffing of its own; if he does a good job, you’ll see about stuffing his ass in turn, you promise.", parse);
				Text.NL();
				Text.Add("<i>”Deal! Now why don’t you see about settling on that [log]-”</i> You stop him with a finger on his lips. Smiling, you shake your head and move to take his shoulders, pushing him down and leaning him back against the [log] before moving to straddle him. Deliberately letting your [multiCockDesc] rest against his chest, you grind your hips into his torso and slowly glide down, until your [vagDesc] is hovering just above his hot erection.", parse);
				Text.NL();
				
				Scenes.Cale.SexCatchVagEntrypoint(outside);
			}, enabled : true,
			tooltip : "You know your wolfy slut loves your dick; playing with it should be all he needs to get him fired up."
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Cale.SexCatchVagEntrypoint = function(outside, fromAnal) {
	var cocksInAss = player.CocksThatFit(cale.Butt(), true);
	var cock = player.BiggestCock(null, true);
	
	var parse = {
		log           : outside ? "log" : "bedroll",
		playername    : player.name,
		guygal        : player.mfTrue("guy", "gal"),
		buttDesc      : function() { return player.Butt().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		legsDesc      : function() { return player.LegsDesc(); },
		feetDesc      : function() { return player.FeetDesc(); },
		breastsDesc   : function() { return player.FirstBreastRow().Short(); },
		nipDesc       : function() { return player.FirstBreastRow().NipShort(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockDesc      : function() { return cock.Short(); },
		cockTip       : function() { return cock.TipShort(); },
		armorDesc     : function() { return player.ArmorDesc(); },
		tailDesc      : function() { return player.HasTail().Short(); },
		ballsDesc     : function() { return player.BallsDesc(); }
	};
	
	Text.Add("Cale grins widely when he sees what you have in mind. ", parse);
	if(cale.Relation() < 40) {
		Text.Add("<i>”Keep doing this and you’ll have a very happy wolf pretty soon,”</i> he comments, licking his lips.", parse);
		Text.NL();
		Text.Add("Maybe so, but let’s see if he can make you a happy [guygal] first, you reply.", parse);
	}
	else {
		Text.Add("<i>”Aw, [playername]. Now you’re just spoiling me,”</i> he says, batting his eyes teasingly at you.", parse);
		Text.NL();
		Text.Add("Grinning back, you reach out and gently pat his head, assuring him that only the best is good enough for your favorite wolf. Your grin widens as you hear an arrhythmic thumping noise; Cale’s tail is wagging so hard he’s drumming on the [log] behind him.", parse);
	}
	Text.NL();
	Text.Add("Now that the foreplay is over with, it’s time to have some real fun. With a final breath, you finish your descent, allowing his cock to close the distance between you and push into your folds. The feeling of him spearing into your needy [vagDesc] sends jolts of both pain and pleasure coursing throughout your body. A groan escapes your throat at the stimulus, only inciting you to sink yourself downwards further, refusing to stop until you have reached to just above his knot.", parse);
	Text.NL();
	
	Sex.Vaginal(cale, player);
	player.FuckVag(player.FirstVag(), cale.FirstCock(), 3);
	cale.Fuck(cale.FirstCock(), 3);
	
	Text.Add("Cale’s hands immediately fly to your hips, and you can see his muscles tense as he works to lift you.", parse);
	Text.NL();
	Text.Add("You push with your [legsDesc], helping Cale to lift you up and down, your breath coming in short pants as you feel his fat dick grinding away inside of you with each rise and fall. Your [vagDesc] clamps down as you rise up his length, clenching him as best you can to make it as hard as possible to remove you, slackening only when gravity starts to bring you back down to delicious fullness.", parse);
	Text.NL();
	Text.Add("It doesn’t take long for you to feel Cale’s cold nose bumping against your [nipDesc], he begins licking you slowly and carefully.", parse);
	if(player.Lactation())
		Text.Add(" When a droplet of your milk touches his tongue, he simply chuckles and envelops your nipple in his wolfish muzzle, and begins draining your [breastsDesc] of their precious milk.", parse);
	Text.NL();
	
	if(outside)
		Scenes.Cale.SexGettingFuckedOutsideComments();
	
	Text.Add("Your excitement building, you don’t even think before upping the pace, lifting and falling with greater enthusiasm until your hips are audibly slapping against his own. Lust and pleasure chase each other through your brain, clouding your vision - but you don’t need eyes to feel that Cale is similarly lost in his pleasure. You can feel his knot, fat and swollen with his arousal, beating against your netherlips with each descent you make, so swollen it’s almost too big to freely slip in and out anymore.", parse);
	Text.NL();
	if(cale.Slut() >= 60 && cock && cock.length.Get() >= 20) {
		Text.Add("The sight of your cock, bobbing in front of him is too much for the slutty wolf, without nary a second thought he leans into your bobbing mast of manflesh and begins lavishing your [cockTip] with licks from his broad tongue.", parse);
		Text.NL();
		Text.Add("You moan unthinkingly as Cale starts to suck your dick. ", parse);
		if(player.FirstCock())
			Text.Add("The pleasurable tingles race down your shaft’s length and crackle up your spine, contrasting most wonderfully with the feelings of your cunt being pounded, stoking your pleasure ever higher with each slurping lick.", parse);
		else
			Text.Add("Though you naturally can’t feel anything from the action itself, the sight of it and the knowledge that this cocky lady-killer is now eagerly sucking your favorite toy for all he’s worth simply goads your pleasure higher and higher.", parse);
		Text.NL();
		Text.Add("He takes your [cockDesc] into his mouth, sucking it like a teat[, draining it of your pre] as you work towards your inevitable high. The ever increasing tempo of your fucking drawing a howling moan from the wolf as he releases your [cockDesc] to let it slap noisily against his chest.", parse);
		Text.NL();
	}
	
	var cum = player.OrgasmCum();
	
	Text.Add("It’s all too much to hold onto anymore, and you echo Cale’s cry with one of your own as you climax, feminine fluids drooling down his shaft and over his balls.", parse);
	if(player.FirstCock()) {
		Text.Add(" Your shaft follows your womanhood in erupting, sending streamers of lady-spunk flying through the air towards Cale’s chest and face. ", parse);
		if(cum > 6) {
			Text.Add("Thick and furious your geyser of semen flies, drenching Cale from head to belly in your spooge, painting him semen-white before you finish. ", parse);
			if(cale.Slut() >= 60)
				Text.Add("Cale opens his mouth eagerly, gulping down the flying feast of seed being blasted all over his face, swallowing until his stomach protests enough to make him settle for simply revelling in his perverse shower.", parse);
			else
				Text.Add("Face screwed up in a grimace, Cale accepts the torrential bath with discontent, trying desperately to keep from swallowing anything as best he can.", parse);
		}
		else if(cum > 3) {
			Text.Add("Great ropes of white smear themselves over Cale’s face, drooling down to paint his neck and shoulders in more of the same.", parse);
			if(cale.Slut() >= 60)
				Text.Add(" He opens his mouth, trying to catch some of the flying treat, playfully catching as much of it as he can.", parse);
		}
		else {
			Text.Add("Pearly strands paint themselves over Cale’s cheeks and throat.", parse);
			if(cale.Slut() >= 60)
				Text.Add(" His tongue unthinkingly darts out to lap some up with a lewd slurp.", parse);
		}
	}
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>”Fuck! I’m gonna blow! Quick, [playername]. Can I knot or not?”</i> he asks, panting in desperation.", parse);
		Text.Flush();
		
		//[Yes] [No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				Text.Add("Cale’s thrusts increase in potency, each slap loosening you just a tiny bit as he works to force that huge knot of his inside. With a triumphant howl, he finally pops it inside and proceeds to dump his considerable load inside you.", parse);
				Text.NL();
				Text.Add("You cry out, deep and low as you feel his thick knot forcing its way through your netherlips, blindly clamping down to wring every last drop from his balls, grinding his knot with the walls of your cunt. Liquid warmth bubbles and seethes inside of you as his seed races up, the seal of his knot so tight that his sperm has nowhere to go but inside your womb, your stomach visibly bulging before he shudders and goes slack.", parse);
				Text.NL();
				Text.Add("Cale collapses, tongue lolling out as he groans due to his recent activities. His knot pulling to lay atop him. <i>”Damn, [playername]. Hell of a pussy you’ve got there,”</i> he compliments you with a lopsided grin.", parse);
				if(cale.Slut() >= 60)
					Text.Add(" <i>”Between this and getting a hard cock up my arse, I dunno what feels better.”</i>", parse);
				Text.NL();
				Text.Add("Smirking back, you thank him for the compliment. He’s not bad himself.", parse);
				Text.NL();
				Text.Add("<i>”Well, we’d better comfy. It’ll be a while before my knot shrinks, till then nothing to do but relax… and enjoy a few extra spurts of Cale goodness,”</i> he adds, groaning as you feel another spurt shooting inside you. <i>”Hope y’don’t mind if I take a short nap?”</i> he asks, suddenly looking pretty worn out.", parse);
				Text.NL();
				Text.Add("Resting yourself comfortably atop him, you yawn softly and tell him that’s fine, if he doesn’t mind letting you take one as well...", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Stretching yourself, enjoying the tingles racing through your nerves, you finish pulling on your [armorDesc], looking back to see Cale just making the final adjustments to his own clothes.", parse);
					Text.NL();
					Text.Add("<i>”Thanks for the awesome ride, [playername]. Glad to play pony for your cowgirl fantasies anytime,”</i> he teases.", parse);
					if(cale.Slut() >= 60)
						Text.Add(" <i>”Tho I hope you’ll let <b>me</b> play cowboy sometime soon,”</i> he adds with a smirk.", parse);
					Text.NL();
					Text.Add("You assure him that the feeling is mutual; you enjoyed every moment of it. Grinning for emphasis, you twitch your hips a little, noting you still feel a tingle from having his knot stretching you out so much. You wave him a final goodbye and set off again.", parse);
					Text.Flush();
					
					cale.relation.IncreaseStat(100, 4);
					world.TimeStep({hour : 2});
					
					Gui.NextPrompt();
				});
			}, enabled : true,
			tooltip : "You want him inside you, all the way; let’s have that knot!"
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("Cale’s thrust double in speed as he becomes a blur, trying his best to not let his knot slip into your used [vagDesc].  With a triumphant howl, the wolf cums! Spurt after spurt of his lupine spunk painting your walls white, even as some of his copious load escapes your entrance to drench his knot and balls. You can feel him throbbing inside, his hips still moving, or perhaps just trembling, in pleasure until he finally collapses in a panting heap of satisfied wolf.", parse);
				Text.NL();
				parse["cum"] = cum > 3 ? " cum-slickened" : "";
				Text.Add("With a great heaving sigh of satisfaction, you allow yourself to slowly sink atop him, cuddling him like a fluffy[cum] pillow as you rest on his form, bathing in your own warm glow of pleasure. Cheek to cheek you nuzzle him softly, content to lay here until you feel like your [legsDesc] won’t just give if you try to stand.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Having finished getting back into your [armorDesc], you turn to Cale and thank him for the nice time, but you have to go now.", parse);
					Text.NL();
					Text.Add("Cale, still nonchalantly naked, simply smiles a crooked smile back and waves a hand lightly. <i>”Sure thing, [playername]. Me, I’m gonna stick around a little longer; enjoy the fresh night air.”</i> He closes his eyes and stretches luxuriantly, a soft groan escaping him, then smirks and gently pats at his balls. <i>”Not to mention the tingles my balls get after a great fuck,”</i> he quips.", parse);
					Text.NL();
					Text.Add("That’s Cale for you; never going to change. You give him a final polite goodbye and then return to your business.", parse);
					Text.Flush();
				
					cale.relation.IncreaseStat(100, 3);
					world.TimeStep({hour : 1});
					
					Gui.NextPrompt();
				});
			}, enabled : true,
			tooltip : "You can’t take the time to wait for it to deflate; make him leave it out."
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return true; });
	if(!fromAnal) {
		scenes.AddEnc(function() {
			Text.Add("Cale’s thrusting slows to a halt, the wolf regarding you for a bit, before a smirk spreads his muzzle.", parse);
			Text.NL();
			Text.Add("Still enjoying the warm fuzz of your afterglow, it takes you a moment to pick up on Cale’s lack of movement. He hasn’t cum yet, so why did he stop? Something wrong?", parse);
			Text.NL();
			Text.Add("<i>”Think I’d like to try another hole.”</i>", parse);
			Text.NL();
			Text.Add("Giving him a slightly dopey grin, you nod and assure him that you’re okay with that idea; you feel far too good to protest the idea of more Sex. Add in that Cale hasn’t cum yet, and, well, that’s even more reason.", parse);
			Text.NL();
			Text.Add("When the wolf attempts to lift you from his lap, you comply as well as you can, using his shoulders to help rise out of his lap. Your [legsDesc] are still too wobbly to have a hope of standing up, but that’s alright; it doesn’t seem like Cale has any plans to move too far, as he helps you to sprawl across the [log] behind him.", parse);
			Text.NL();
			Text.Add("Once you are properly positioned to his liking, he gives your shoulder a friendly pat and moves behind you, where you can feel his hands coming down to rest on your ass.", parse);
			Text.NL();
			Text.Add("<i>”What a nice view we got from back here,”</i> he comments, chuckling as he caresses your [buttDesc].", parse);
			Text.NL();
			if(player.HasPrehensileTail()) {
				Text.Add("You roll your eyes in exaggerated annoyance; does he have to always throw around those cheesy lines of his? Your [tailDesc] flicks around in a half-playful reprimand to slap his cheek, firmly enough that he can feel it, yet not so hard as to actually hurt him.", parse);
				Text.NL();
				Text.Add("<i>”Hey!”</i> he protests weakly at your tail-slap.", parse);
			}
			else
				Text.Add("You don’t even bother trying to hide the fact you are rolling your eyes, heaving an exaggerated sigh at hearing yet another lame line of his. Doesn’t he have any better material than that?", parse);
			Text.NL();
			Text.Add("Clicking your tongue in the iconic tsk-tsk noise, you teasingly ask if he really has to use those same corny lines all the time. If he’s going to be that lame that he has to keep yapping like that, well, then you’re done - you got what you wanted, after all. Smirking to yourself, you start to push yourself up off of the [log] with your arms, as if you’re intent on rising to your [feetDesc] and leaving.", parse);
			Text.NL();
			parse["dudelady"] = player.mfTrue("dude", "lady");
			Text.Add("<i>”W-wait, I’m not done yet!”</i> He grasps your [buttDesc] firmly holding you in position. <i>”Hold on there [dudelady]. Geez, no need to be so pushy, never heard of foreplay?”</i> he teases.", parse);
			Text.NL();
			Text.Add("You wouldn’t call what he was doing foreplay, you promptly shoot back. You have higher standards than that, you declare, a playful smirk on your lips.", parse);
			Text.NL();
			if(player.HasPrehensileTail()) {
				Text.Add("<i>”...somehow that hurts a lot more than the tail-slap you gave me earlier.”</i>", parse);
				if(player.FirstCock()) {
					Text.NL();
					Text.Add("Well, if he didn’t like the tail slap, you could always give him a cock slap instead, you immediately retort.", parse);
					Text.NL();
					if(cale.Slut() >= 60) {
						Text.Add("<i>”That would have actually hurt a lot less, plus it’d give me a chance to sneak a little lick off your meat lollipop,”</i> he chuckles.", parse);
						Text.NL();
						Text.Add("Always the opportunist, isn’t he? Still, you’d be lying if you said you didn’t find the thought enjoyable.", parse);
					}
					else
						Text.Add("<i>”No thanks,”</i> he immediately quips back.", parse);
				}
			}
			else {
				Text.Add("<i>”Ouch! Now you’re just being cruel, [playername].”</i>  He feigns hurt, but you know he’s actually enjoying this. Still… you’d like to get things going, after all you can only humor him for so long. ", parse);
			}
			Text.NL();
			parse["ass"] = cale.Slut() >= 30 ? Text.Parse(" and up your ass crack, making sure to tease your [anusDesc]", parse) : "";
			Text.Add("<i>”Okay then, I suppose there are better things I could do with my mouth than keep talking.”</i> He leans over to give a long lick, over your pussy[ass].", parse);
			Text.NL();
			parse["sf"] = player.body.SoftFeet() ? ", your toes curling at the sensation" : "";
			Text.Add("You groan deep and loud[sf], a shiver of pleasure racing up your spine. ", parse);
			if(player.Slut() >= 50)
				Text.Add("You mewl unabashedly like the whore you are, audibly reveling in the treatment the lupine tongue is giving you.", parse);
			else
				Text.Add("You fight to keep yourself from moaning like a whore in heat at Cale’s ministrations, struggling to retain some dignity under his pleasurable onslaught.", parse);
			Text.NL();
			if(cale.Slut() >= 30)
				Text.Add("Cale has no reservations about sticking his nose up your ass and licking you to stretch and prepare you for his cock. He rims you with gusto, enjoying each squirm or moan of pleasure he manages to draw from you.", parse);
			else
				Text.Add("Cale sets about fingering you, ensuring you’re wet and horny again.", parse);
			Text.Add(" Once he’s done with that, he aligns his cock with your pussy once more and thrusts in, grinding and stirring up your insides to ensure your juices cling to his cock.", parse);
			Text.NL();
			Text.Add("<i>”This should be enough.”</i>  Pulling out, he aligns his cock with your [anusDesc] and grins. <i>”Ready?”</i>", parse);
			Text.NL();
			Text.Add("You grin to yourself and wriggle your ass enticingly at the wolf-morph, playfully asking what he thinks the answer is.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Scenes.Cale.SexCatchAnalEntrypoint(outside, true);
			});
		}, 1.0, function() { return true; });
		
		scenes.AddEnc(function() {
			Text.Add("Without so much as a warning, Cale pulls out of your used vagina and nests his knotty wolf-pecker between the cheeks of your [buttDesc]. He presses the buttcheeks together as he fucks your ass-cleavage, rubbing his length against your rosebud.", parse);
			Text.NL();
			
			Scenes.Cale.SexCaleShowerEntrypoint(outside);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			var p1cock = player.BiggestCock(cocksInAss);
			parse["cockDesc"] = function() { return p1cock.Short(); }
			parse["cockTip"]  = function() { return p1cock.TipShort(); }
			
			Text.Add("<i>”[playername]?”</i>", parse);
			Text.NL();
			Text.Add("You lift your head to look Cale in the eye quizzically, letting out a wordless noise of acknowledgement.", parse);
			Text.NL();
			Text.Add("<i>”Since you’re properly equipped,”</i> he flicks your [cockTip] with a finger, gathering some spunk on his finger. <i>”And you’ve already had your fun, how about throwing me a bone?”</i> he grins, lapping your cum off his finger.", parse);
			Text.NL();
			Text.Add("With a weak grin and a faint chuckle, you point out that the spirit may be willing, but the flesh is weak; indicating your spent [cockDesc], you point out you’re not exactly properly set up to give him his bone.", parse);
			Text.NL();
			Text.Add("<i>”No worry, [playername]. Doncha know that wolves always lick their bones before the grind?”</i> he suggests with a smirk, hands gripping your hips as he slowly moves you off of his shaft and closer to his maw. Realising what he has in mind, smirking back, you wriggle a little to help him bring your dick into reach of his mouth.", parse);
			Text.NL();
			Text.Add("Cale wastes no time and engulfs your cock, quickly lathering it with saliva before pulling out and nosing your [cockTip] while his tongue laps at the underside. Tingles race up your spine, your lips pouting in a soft moan as your already-sensitive flesh responds to his tender licks and suckles. In your state, he has you at half-mast within moments, your dick throbbing in time with your heartbeat as it rests against his tongue.", parse);
			Text.NL();
			if(player.HasBalls()) {
				Text.Add("He moves under your [multiCockDesc] to lap at your [ballsDesc], sucking on them until they’re nice and plump. Then he moves back to your [cockDesc], returning to his mission.", parse);
				Text.NL();
			}
			parse["sh"] = p1cock.sheath != 0 ? "your sheath" : "the base of your cock";
			Text.Add("Cale nuzzles your [cockDesc] giving it an amorous nuzzle, kissing [sh] in the process. Under such treatment, it doesn’t take long for your erection to become as hard as it can get, throbbing and ready for some wolfie ass. <i>”Now ain’t that a sight for sore eyes?”</i> Cale chuckles.", parse);
			Text.NL();
			Text.Add("You simply grin back, happy to let Cale make his bad jokes when you know what’s coming to you. Besides, you have to agree with him a little anyway.", parse);
			Text.NL();
			parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? "legs are spread and your " : "";
			Text.Add("<i>”A’ight, let’s get down to business.”</i> He maneuvers you off him and seats you on the [log], ensuring your [legs][cockDesc] is in plain sight. He saunters up to you and aligns you with his needy boypussy. He grins at you expectantly, daring you to take the next step. Certainly not one to back away from this challenge, you grab his hips for leverage and roughly pull him down, plunging your cock into the wolf’s greedy ass in a single swift, powerful thrust.", parse);
			Text.NL();
			
			Scenes.Cale.SexCaleButtslutEntrypoint(cocksInAss, outside);
		}, 1.0, function() { return cale.Slut() >= 60 && cocksInAss.length > 0; });
	}
	
	scenes.Get();
}

Scenes.Cale.SexCaleShowerEntrypoint = function(outside) {
	var parse = {
		log        : outside ? "log" : "bedroll",
		playername : player.name,
		tailDesc   : function() { return player.HasTail().Short(); },
		wingsDesc  : function() { return player.HasWings().Short(); },
		hairDesc   : function() { return player.Hair().Short(); },
		buttDesc   : function() { return player.Butt().Short(); }
	};
	
	if(player.SubDom() > 0)
		Text.Add("Hey! You’re not done yet! What the hell is he doing?", parse);
	else
		Text.Add("You whimper in protest, asking what’s going on; why did he take his sweet fat dick out of your needy ass?", parse);
	Text.NL();
	Text.Add("<i>”Just feel like showering you with my appreciation, [playername]. Plus you’ve got a really nice butt,”</i> he slaps your butt. <i>”Can ya blame me for wanting to take it for a spin?”</i>", parse);
	Text.NL();
	parse["tail"] = player.HasTail() ? Text.Parse("[tailDesc], ", parse) : "";
	parse["wing"] = player.HasWings() ? Text.Parse("[wingsDesc], ", parse) : "";
	Text.Add("Before you can answer that, with a shudder, the wolf cums right then and there. Jets of hot wolf-jism raining down upon your back, splattering your [tail][wing][hairDesc], and your butt. The wolf pumps in-between your buttcheeks a few times more and showers you with a fresh batch. The process continues until he’s spent and you’re absolutely plastered in white wolf cum.", parse);
	Text.NL();
	Text.Add("<i>”Hehe, that’s a nice look for you,”</i> Cale comments leaning back against the [log] to rest. <i>”You’re now officially marked as my territory.”</i>", parse);
	Text.NL();
	if(player.SubDom() >= 35)
		Text.Add("You bite back an indignant growl; give the cocky bastard an inch and he takes a mile. No point complaining over spilt cum, though. You’ll just have to show him who belongs to who next time...", parse);
	else if(player.SubDom() >= -25)
		Text.Add("You roll your eyes sarcastically. You’d be lying if you said it completely bothered you to get marked this way, but still, you can’t shake the feeling Cale might be starting to get a little big for his proverbial boots...", parse);
	else
		Text.Add("You smile happily, shifting slightly to better let the semen on your back flow down your sides and properly coat your skin. You feel quite content to let a stud like Cale mark you as his own; this is what you were meant for, after all.", parse);
	Text.NL();
	Text.Add("<i>”That sure hit the spot,”</i> Cale chuckles, leaning onto the [log] for a quick rest. ", parse);
	if(cale.Slut() >= 60)
		Text.Add("<i>”Just remember to return the favor sometime. My ass is aching for a decent fuck, and I could use a bath of my own.”</i> He gives you a gentle slap on your [buttDesc].", parse);
	else if(cale.Slut() >= 30)
		Text.Add("<i>”How’d you enjoy your bath? Feels good doesn’t it? I heard it was good for your skin,”</i> Cale teases, chuckling.", parse);
	else
		Text.Add("<i>”You’re my territory now, so I expect to see you around more often. Don’t be a stranger now,”</i> he teases.", parse);
	Text.NL();
	Text.Add("You toss an idle quip back to him, even as you grab your gear. After a moment’s recollection, you head for the nearest stream, intending to clean yourself up before getting dressed.", parse);
	Text.Flush();
	
	cale.relation.IncreaseStat(100, 3);
	world.TimeStep({hour : 1, minute : 30});
	
	Gui.NextPrompt();
}

Scenes.Cale.SexCaleCleanCockEntrypoint = function(cock, outside) {
	var parse = {
		breastsDesc : function() { return player.FirstBreastRow().Short(); },
		cockDesc    : function() { return cock.Short(); },
		ballsDesc   : function() { return player.BallsDesc(); },
		cockTip     : function() { return cock.TipShort(); }
	};
	
	Text.Add("<i>”Hey, let me take care of that for you,”</i> he points at your messy belly and chest. <i>”No sense letting good seed go to waste, right?”</i> he licks his lips.", parse);
	Text.NL();
	Text.Add("No, there most certainly isn’t, you agree, grinning as you lean back to better let him have access to the mess he made.", parse);
	Text.NL();
	Text.Add("Cale immediately sets to work, starting off by cleaning your belly. He licks along your navel, playfully teasing you by inserting his tongue into your belly-button. Then he moves upward, licking your [breastsDesc] of their fine layer of wolf-cum.", parse);
	if(player.Lactation())
		Text.Add(" Course, being the cocky bastard he is, he just can’t resist getting a taste of your nutritious milk along the way. <i>”What? You keep them on display,”</i> he grins.", parse);
	Text.NL();
	Text.Add("As soon as he’s done he moves to lick your [cockDesc]. <i>”Some tasty meat for the big bad wolf,”</i> he quips.", parse);
	Text.NL();
	Text.Add("You roll your eyes at the cheesy pun, noting to yourself that he certainly wasn’t so bad earlier.", parse);
	Text.NL();
	Text.Add("He licks the entirety of your shaft clean", parse);
	if(player.HasBalls())
		Text.Add(", even making a detour to suck on your [ballsDesc]", parse);
	Text.Add(". Not satisfied, he immediately moves to kiss your [cockTip], stimulating your urethra with his tongue and drawing just a tiny bit of extra cum. <i>”Oy! You were holding out of me? That’s not cool!”</i> he playfully chides you.", parse);
	Text.NL();
	Text.Add("Looks like you both missed that bit. You’ll just have to try harder next time.", parse);
	Text.NL();
	Text.Add("He simply chuckles at your reply and gives your cock a parting kiss. <i>”Cale’s seal of approval, good for another run.”</i> He flicks your shaft, letting it sway before his eyes.", parse);
	Text.NL();
	Text.Add("You smirk at him and then pat him on the head, playfully calling him a <i>”good boy.”</i>", parse);
	Text.NL();
	Text.Add("Cale chuckles before replying, <i>”Woof, woof. Where’s my treat?”</i>", parse);
	Text.NL();
	Text.Add("Grinning, you point out he just had one. But, maybe you’ll give him another one later.", parse);
	Text.NL();
	Text.Add("He whines playfully, but acquiesces. <i>”Alright, I’ll hold you to that. Don’t be a stranger,”</i> he replies, gathering his own clothes.", parse);
}

Scenes.Cale.SexCaleButtslutEntrypoint = function(cocks, outside) {
	var p1cock = player.BiggestCock(cocks);
	var knotted = p1cock.knot != 0;
	
	var parse = {
		log        : outside ? "log" : "bedroll",
		playername : player.name,
		tailDesc   : function() { return player.HasTail().Short(); },
		wingsDesc  : function() { return player.HasWings().Short(); },
		hairDesc   : function() { return player.Hair().Short(); },
		buttDesc   : function() { return player.Butt().Short(); },
		cockDesc   : function() { return p1cock.Short(); },
		skinDesc   : function() { return player.SkinDesc(); },
		tongueDesc : function() { return player.TongueDesc(); }
	};
	
	Text.Add("<i>”Hehe, I knew you’d come around. Now why don’t you relax and let me milk your cock of all its tasty spunk? Not that you have to restrain yourself, I like it rough,”</i> he grins.", parse);
	Text.NL();
	Text.Add("Sounds good to you, and your hands slide down Cale’s back so you can squeeze his asscheeks appreciatively, one hand moving to stroke the base of his tail.", parse);
	Text.NL();
	Text.Add("Cale’s legs bulge with exertion as he flexes them in order to rise, letting his quivering sphincter deform around the contour of your [cockDesc]. As soon as only your head remains embedded in his slutty ass Cale stops, there is a brief delay as he lets gravity take over to impale himself back on your flesh pole with a wet squelch. His anal juices cover your shaft with his hot excitement, his trained butt contracts powerfully, giving the impression he’s sucking you in. Cale only stops his descent when he reaches ", parse);
	if(knotted)
		Text.Add("your knot, already fully inflated and ready to tie your bitch.", parse);
	else
		Text.Add("the base of your cock, having nothing more to take inside himself.", parse);
	Text.NL();
	Text.Add("As he stops with a resounding, wet slap, you watch his own shaft bobbing to plop wetly against your belly. Some of his wolfy pre leaving an imprint of his tip on your [skinDesc].", parse);
	Text.NL();
	Text.Add("You’d have to be a fool to deny Cale’s considerable charms when he decides he wants to be the good cockhungry slut you trained him to be. As great as it feels to have him wrapped around your meat, you can’t simply sit back and let him do it all himself. If he wants to be a proper bitch-boy and take it rough, who are you to deny him?", parse);
	Text.NL();
	Text.Add("Sitting up, you wrap your arms around his neck to hold him in place for a wet, rough kiss, bluntly thrusting your [tongueDesc] through his lips to dance and tangle with his own broad, flat tongue. Noisily you slurp and moan into each other’s mouths, before he breaks the kiss with a gasp.", parse);
	Text.NL();
	Text.Add("Playfully your head moves to the crook of his neck and you give him a gentle bite, the wolf shuddering in your arms at the gesture. He starts to lift himself back up off of your cock, and you use the motion to help you plant a trail of soft kisses down his neck and over his broad chest until you are level with the exposed pink nub of his nipple. Your tongue playfully flicks out, trailing circles around its expanse before you carefully close your teeth on it in a pleasure-inducing nip that makes him quake.", parse);
	Text.NL();
	Text.Add("You feel his legs giving out and release your grip on his nipple, hands moving to his hips and pushing down, the combined momentum allowing you to roughly shove yourself inside of Cale’s ass ", parse);
	if(knotted)
		Text.Add("until your knot nearly pops in.", parse);
	else
		Text.Add("as deep as you can.", parse);
	Text.Add(" He moans like a whore, and your hands move to his thighs, lifting at him, coaxing him to rise again until you shove him back down again as hard and fast as before. Cale practically sings in his pleasure as you hammer him up and down upon your dick, rutting the lupine buttslut until you can feel the tension boiling up inside of you. You’re going to blow any moment now, you can feel your [cockDesc] throbbing madly with the need to cum, your breath coming quicker and harder as it grows and builds inside of you...", parse);
	Text.NL();
	Text.Add("<i>”Yeah! Give it to me! Give it to me good, [playername]. Mate me like a bitch in heat!”</i> he shamelessly begs.", parse);
	Text.NL();
	Text.Add("Like you need the encouragement, pounding the wolf’s butt for all you can, increasingly consumed by your need for release.", parse);
	if(knotted)
		Text.Add(" You dimly feel your knot grinding against his tight ring and realise you need to decide what to do with it before you blow your load.", parse);
	Text.Flush();
	
	//[Tie Him][Nah]
	var options = new Array();
	if(knotted) {
		options.push({ nameStr : "Tie Him",
			func : function() {
				Text.Clear();
				Text.Add("With a roar of effort, you drive Cale and your cock together as hard as you possibly can, jamming the swollen bulb of your flesh through his tight boypussy until he is wedged against you. The feel of his flesh enveloping your knot, grinding it fit to burst, is the last straw for you; you are barely aware of Cale’s cries of pleasure, or the warm semen splattering over your chest and running down your [skinDesc] as your own seed erupts inside of him.", parse);
				Text.NL();
				
				var cum = player.OrgasmCum();
				
				if(cum > 6) {
					Text.Add("Like a perverse fountain, your cock explodes, sending a veritable tsunami of semen coursing through Cale’s bowels and into his stomach. With your knot wedged inside of him like it is, what little leaks out is literally a few drips in comparison. His belly bloats outward, like a pregnancy on fast forward, the wolf moaning and shuddering as his skin stretches around his titanic liquid suppository.", parse);
					Text.NL();
					Text.Add("By the time you finally, blessedly, finish, Cale looks ready to drop a whole litter of full-grown pups of his own, rivulets of semen seeping around the ring and running down your thighs, but unnoticeable by comparison.", parse);
					Text.NL();
					Text.Add("<i>”Yesh, letsh have lots of puppiesh, honey,”</i> he says, drunk with pleasure. Then he promptly passes out. You chuckle at his reaction as you get yourself comfortable to wait for your knot to deflate.", parse);
				}
				else if(cum > 3) {
					Text.Add("A titanic torrent of semen floods Cale’s guts, your knot ensuring not a single drop of it escapes from inside of him. With nowhere else to go, it crams itself relentlessly into his stomach, which swells before your very eyes into an almost pregnant-looking swell. By the time you are finished, it bulges blatantly between you, almost pushing you both apart with its considerable girth.", parse);
					Text.NL();
					Text.Add("<i>”Ah, yes… That hit the spot. Thanks a lot, [playername].”</i>", parse);
					Text.NL();
					Text.Add("It was no problems, you assure him; indeed, it was most definitely your pleasure.", parse);
					Text.NL();
					Text.Add("<i>”Y’can come to me whenever you feel like yer gettin case of blue balls and I’ll be happy to milk ‘em for ya. Now if ye’ll excuse me, I’m gonna take a nap.”</i> He nuzzles you and just like that, he’s out like a light.", parse);
					Text.NL();
					Text.Add("You chuckle and playfully rub his ears like the overgrown puppy he resembles before settling back and making yourself comfortable, as you wait for your knot to shrink down again.", parse);
				}
				else {
					Text.Add("Cale’s belly almost visibly bulges from the size of your deposit inside of him, every last warm drop locked away inside of him by your knot.", parse);
					Text.NL();
					Text.Add("<i>”Yeah… Fuck I was really aching for a good shag. Thanks for the treat, [playername].”</i>", parse);
					Text.NL();
					Text.Add("It was your pleasure, you assure him.", parse);
					Text.NL();
					Text.Add("<i>”Really ‘preciate your efforts. But I’m feeling a little worn out. D’you mind if I rest my eyes for a moment?”</i>", parse);
					Text.NL();
					Text.Add("Of course you don’t mind, and you quickly tell him so.", parse);
					Text.NL();
					parse["balls"] = player.HasBalls() ? " balls deep" : "";
					Text.Add("<i>”Thanks.”</i> He nuzzles you and closes his eyes, his breathing stabilizing as he falls asleep. With your cock still buried[balls] inside him.", parse);
					Text.NL();
					Text.Add("You can’t help but smile; that’s Cale for you, alright. Shifting him to be a little more comfortable against you, you then move yourself around to make yourself a little more comfortable as well. Going to take a while for your knot to deflate, after all.", parse);
				}
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("It takes the better part of an hour till your knot’s shrunk down enough to let you unplug Cale’s ass. By then the wolf’s already woken up.", parse);
					Text.NL();
					
					Scenes.Cale.SexCaleCleanCockEntrypoint(p1cock, outside);
					
					Text.Flush();
					
					cale.relation.IncreaseStat(100, 4);
					world.TimeStep({hour : 2});
					
					Gui.NextPrompt();
				});
			}, enabled : true,
			tooltip : "He’s your bitch, treat him as such and give him what he’s begging for."
		});
	}
	options.push({ nameStr : "Nah",
		func : function() {
			Text.Clear();
			Text.Add("You thrust into Cale’s ass as deeply as you can, the two of you crying out in mutual pleasure as your limits are breached and the both of you climax in unison. Cale’s seed sprays across your stomach and [breastsDesc], trickling strands of off-white running down your [skinDesc], even as your own seed floods inside of his ass.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			if(cum > 6) {
				Text.Add("Veritable rivers of semen spurt out around the imperfect seal of your cock, but such is the sheer cascade of your spooge flooding inside of Cale that his stomach still begins to grow and grow, ballooning out into a pregnant looking swell. Even after your member finally goes slack, allowing semen to pour freely between his thighs, he can’t drain fast enough to shrink his new gut.", parse);
				Text.NL();
				Text.Add("<i>”Hehe, someone had a serious case of blue balls… or was it just that good?”</i> he teases.", parse);
				Text.NL();
				Text.Add("Maybe a little from column A and a little from column B, you quip right back, tapping him playfully on his newly expanded stomach.", parse);
			}
			else if(cum > 3) {
				Text.Add("Thick ropes of semen pour into Cale’s stomach, swelling his gut out into a blatant pot belly. Though some of your seed is drawn back down by gravity, oozing sluggishly around the ring of his ass, most of it floods inside of him, leaving him with a nicely pregnant-looking bulge by the time you finish.", parse);
				Text.NL();
				Text.Add("<i>”Ah, nice and sloppy. Just the way I like it,”</i> he grins, gripping your cock with his sphincter.", parse);
				Text.NL();
				Text.Add("You’re glad he approves; you like it nice and sloppy as well, after all.", parse);
			}
			else {
				Text.Add("Your efforts paint Cale’s boypussy with thick, sloppy semen, leaving him nice and goopy with your seed as it rolls and squishes delightfully with each motion either of you make.", parse);
				Text.NL();
				Text.Add("<i>”Hmm, yeah… good enough for round one,”</i> he teases.", parse);
				Text.NL();
				Text.Add("If he’ll give you a moment to catch your breath, you’ll see about round two, you promptly shoot back.", parse);
			}
			
			Text.NL();
			
			Scenes.Cale.SexCaleCleanCockEntrypoint(p1cock, outside);
			
			Text.Flush();
			
			cale.relation.IncreaseStat(100, 3);
			world.TimeStep({hour : 1});
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You don’t feel like being glued to Cale’s boypussy right now, so just finish."
	});
	if(options.length > 1)
		Gui.SetButtonsFromList(options, false, null);
	else
		Gui.NextPrompt(options[0].func);
}

Scenes.Cale.SexCatchAnal = function(outside) {
	var parse = {
		log : outside ? "log" : "bedroll",
		playername : player.name,
		lowerArmorDesc : function() { return player.LowerArmorDesc(); },
		anusDesc : function() { return player.Butt().AnalShort(); }
	};
	
	Text.Clear();
	Text.Add("<i>”It’d be my pleasure,”</i> he says, wagging his tail.", parse);
	Text.NL();
	Text.Add("You start out by approaching him and deftly sticking your hand inside his pants to fondle his rapidly filling sheath and balls. <i>”You got me!”</i> he says jokingly. You simply roll your eyes and begin to undo his garments. He just looks at you with a smile, fumbling with his top. In no time at all the sound of rustling clothes is pointed by the sound of said clothes hitting the ground, and you’re left to look at the athletic wolf in all his naked glory.", parse);
	Text.NL();
	Text.Add("Orange eyes glitter with amusement as he watches you, lips curved in a wolfish grin. His lupine ears flick atop his head in visible impatience, tail wagging over a toned butt. Though his body is covered in dark fur, it isn't dense enough to stop you from making out that he has a trim build; solid and graceful, with some visible muscle, but not swollen and hulking - a runner, more than a weightlifter. Jutting between his legs, his nine-inches of wolf-cock practically throb before your eyes, eager to be buried inside of you.", parse);
	Text.NL();
	Text.Add("Putting an end to your scrutiny, Cale moves to work on your [lowerArmorDesc] himself. You don’t wait to get started on your top, shrugging out of your clothes in record speed. Cale loops an arm around your lower back and motions to the [log]. His intentions clear, you bend over and await the wolf’s next move.", parse);
	Text.NL();
	Text.Add("<i>”Let’s prep you first. I dunno bout you, but I’m not a fan of painful intrusions.”</i> He moves to his discarded top, fumbling about with a pouch to draw a small tube containing what look to be a clear gel.", parse);
	Text.NL();
	Text.Add("You shiver unconsciously as the cool gel oozes over your flesh, tingling against the skin as he applies it. Once he judges the amount sufficient, an expert finger moves to massage the lube into your [anusDesc], slow and deliberate motions stirring it around and around. Once he judges your ring has been sufficiently coated, he starts to work his way inside your pucker with a fingertip, thrusting in and out with the same tantalizing purposefulness. Slowly he adds a second finger, pumping them deeper inside of you as he does, and then, blissfully, he adds a third, painstakingly reaming your ass with all three.", parse);
	Text.NL();
	Text.Add("<i>”How ya doing up there? Feel ready yet?”</i> he asks continuing to pump his three fingers inside you.", parse);
	Text.NL();
	if(player.Slut() >= 60)
		Text.Add("You arch your back and moan in desire, too incoherent with pleasure and anticipation to think of anything more meaningful. Damn, you can't wait for him to get those fingers out and put something more satisfying inside you!", parse);
	else if(player.Slut() >= 30)
		Text.Add("You shudder in pleasure, eyes fluttering unconsciously as he massages your innards, dreamily assuring him that you feel ready for him.", parse);
	else
		Text.Add("Trembling with a cocktail of emotions you can't describe, you slowly confirm that you're ready as you're going to get.", parse);
	Text.NL();
	Text.Add("<i>”Alright let’s get down to business then.”</i> Cale moves to mount you, aligning his canine pecker with your [anusDesc] and gently prodding your entrance. <i>”Hey, [playername]?”</i>", parse);
	Text.NL();
	if(cale.flags["sneakAtk"] < 5) {
		Text.Add("Yes? What is it?", parse);
		Text.NL();
		parse["gen"] = player.HasBalls() ? "own" :
		               player.FirstVag() ? player.FirstVag.Short() :
		               player.ThighsDesc();
		Text.Add("<i>”Sneak Attack!”</i> he yells, shoving all his nine inches inside you in at once, stopping only when you feel his balls slap noisily against your [gen].", parse);
	}
	else if(cale.flags["sneakAtk"] == 5) {
		Text.Add("Ugh, not again. You roll your eyes in contempt and cut him off, telling him to drop the stupid ‘sneak attack’ joke, it's really gotten old. Just stick his dick in your ass and let's get down to what you're both here for.", parse);
		Text.NL();
		Text.Add("<i>”Aw, you’re no fun,”</i> he protests weakly, but complies. After some minor adjusting he spears himself into you, all nine inches, until he’s balls-deep inside your [anusDesc].", parse);
	}
	else {
		Text.Add("<i>”Here I come~”</i> He thrusts into you, burying all of his nine-inch wolfhood balls-deep into your rectum.", parse);
	}
	cale.flags["sneakAtk"]++;
	
	Text.NL();
	
	Scenes.Cale.SexCatchAnalEntrypoint(outside);
}

Scenes.Cale.SexCatchAnalEntrypoint = function(outside, fromVag) {
	var cocksInAss = player.CocksThatFit(cale.Butt(), true);
	
	var parse = {
		log : outside ? "log" : "bedroll",
		playername    : player.name,
		multiCockDesc : function() { return player.MultiCockDesc(); },
		notS          : player.NumCocks() > 1 ? "" : "s",
		oneof         : player.NumCocks() > 1 ? " one of" : "",
		vagDesc       : function() { return player.FirstVag().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		buttDesc      : function() { return player.Butt().Short(); },
		wingsDesc     : function() { return player.HasWings().Short(); },
		legsDesc      : function() { return player.LegsDesc(); },
		thighsDesc    : function() { return player.ThighsDesc(); },
		breastsDesc   : function() { return player.FirstBreastRow().Short(); },
		tongueDesc    : function() { return player.TongueDesc(); },
		armorDesc     : function() { return player.ArmorDesc(); }
	};
	
	Text.Add("You cry out as the wolf's cock so forcibly spears inside of you without hesitation. In seconds he is briskly thrusting back and forth, pumping away at your ass with every ounce of enjoyment, roughly pistoning your [anusDesc] like a man possessed.", parse);
	Text.NL();

	Sex.Anal(cale, player);
	player.FuckAnal(player.Butt(), cale.FirstCock(), 3);
	cale.Fuck(cale.FirstCock(), 3);

	if(outside)
		Scenes.Cale.SexGettingFuckedOutsideComments();

	parse["wings"] = player.HasWings() ? Text.Parse(" being careful with your [wingsDesc],", parse) : "";
	parse["p"] = player.FirstCock() ? ", including your prostate" : "";
	Text.Add("Cale bends over your back,[wings] as he hugs your from behind. His position is reminiscing of a wolf mounting his bitch, a detail that probably passes him by as he’s too busy thrusting away into your ass. The position does allow him to go a bit deeper than before and though erratic, his thrusts manage to hit all the right spots inside you[p].", parse);
	Text.NL();
	Text.Add("You groan and growl, deep and low in your throat as you feel him gyrating and grinding against your inner walls, rough in a good way. Stirred by his efforts, you shift yourself around slightly, allowing you to start meeting his humping with backwards bucks of your own, swallowing each thrusting of his cock with eager ease. Even in your increasingly addled state, you’re away of the thick, swollen girth of his excited knot as it sometimes forces its way inside of you, stretching you a few delicious extra inches when it does.", parse);
	Text.NL();
	Text.Add("<i>”So tight and hot…”</i> you hear Cale comment, his pumping slowly becoming a bit more well paced. Now that you’re actively fucking him back, he doesn’t feel the need to be so… desperate, in his taking of your [anusDesc]. Short strokes become long ones, and with each synced thrust and buck, the resulting impact sends ripples along your [buttDesc]. His knot has inflated enough that he can’t just idly push it inside you anymore, and you can feel its girth whenever Cale grinds into your butt. It feels like he might push in at a moment’s notice, but he always withdraws in the last second.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>”Hey, [playername]. You ready for this?”</i> he asks, grinding against your [anusDesc] so you can feel his inflated knot. <i>”So what about it? Can you take all that Cale has to offer,”</i> he pants, waiting for your reply.", parse);
		Text.NL();
		Text.Add("You realise he’s giving you the final say; you better make a decision quickly...", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				Text.Add("Rather than waste time with words, you let your body do the talking, grinding back against Cale’s hips as best you can from your present position. You will your clenching asshole to open further, stretching yourself out with each centimeter you force yourself back over Cale’s bulging knot. Gritting your teeth from the effort, you strain with all your might, crying out in triumph as you finally force him inside of you to the hilt, anchoring him within your ass.", parse);
				Text.NL();
				Text.Add("<i>”Knew you had it in you.,”</i> he chuckles, switching from his long thrusts to smaller one as his knot stirs your insides. It doesn’t take long before he tightens his grip on your flanks and howls. The distinct warmth of Cale’s hot seed flooding your insides as the wolf orgasms.", parse);
				Text.NL();
				
				var cum = player.OrgasmCum();
				
				Text.Add("Even as Cale’s seed gushes inside of you, your own limit is reached and you cry out, echoing the wolf-morph’s howl of ecstasy as your own body quakes and shudders with orgasm.", parse);
				if(player.FirstCock()) {
					parse["cum"] = cum > 6 ? "flooding" :
					               cum > 3 ? "pooling" :
					               "spattering";
					Text.Add(" Your seed splashes onto the earth below you, [cum] where it lands and filling the air with its distinctive musk.", parse);
				}
				if(player.FirstVag()) {
					Text.Add(" Your womanhood drools its nectar down your [legsDesc], soaking into the thirsty ground below.", parse);
				}
				Text.NL();
				Text.Add("Cale’s seed continues it’s assault, plowing deep inside you to settle in your belly. With nowhere to go, all of it winds up inside you. You can feel his liquid burden stretching your belly, slowly inflating you as his powerful jets are reduced to a faint trickle. <i>”F-Fuck. That’s one sweet ass you got there, [playername]. My balls are even sore now,”</i> he chuckles.", parse);
				Text.NL();
				Text.Add("Like he didn’t enjoy every moment of it, you smirk to yourself. You wriggle a little to better adjust to your new weight, confirming that you are well and truly stuck to his crotch.", parse);
				Text.NL();
				Text.Add("<i>”It’ll be a while before I can let ya go. So let’s get ya in a more comfortable position.”</i> The wolf grabs you around your waist, just below the paunch his seed’s given you and hauls you up and into a sitting position, on his lap. The motions sends the liquids inside you sloshing, and you react by tightening your sphincter around his knot. Cale spurts a fresh rope of wolf-seed in reply.", parse);
				Text.NL();
				Text.Add("You grunt a little at the treatment, your [legsDesc] wobbling a little, but manage to shift in Cale’s lap to find a position that you feel comfortable in. That done, you settle back against his furry chest and allow yourself to relax.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("It takes the better part of an hour for his knot to deflate, a time that he spent being nothing but gentlemanly. Although he’s shrunk enough that he could pull out, he’s too engrossed in his current task to actually do so. The wolf is busy grooming you with licks around your collar bone, drinking in the sweat resulting of your taking.", parse);
					Text.NL();
					Text.Add("Sighing softly, you tell him that as enjoyable as this is, you can’t stay here forever; there’s things you need to do. You allow him a last cuddle and then, once he’s let you go, you pull yourself free of his lap. Naturally, without his cock plugging your ass anymore, a cascade of semen falls down your [legsDesc] and splatters messily over his own crotch before you manage to close your asshole again, but he doesn’t seem to care in the slightest.", parse);
					Text.NL();
					Text.Add("<i>”Y’know where to find me. Anytime you need,”</i> he says with a cocky smile, waving you away and he leans back against the [log], enjoying his afterglow too much to even bother putting his clothes back for now.", parse);
					Text.NL();
					Text.Add("You finish cleaning yourself off as best you can, then grab your [armorDesc] and get dressed again before leaving the happy wolf-morph to his relaxation.", parse);
					Text.Flush();
					
					cale.relation.IncreaseStat(100, 4);
					world.TimeStep({hour : 2});
					
					Gui.NextPrompt();
				});
			}, enabled : true,
			tooltip : "You can take anything he can throw at you!"
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("<i>”Aw, too bad. But it’s alright, I still got a lot. To. Give. You,”</i> he says pointing each word with a rough thrust.", parse);
				Text.NL();
				Text.Add("You groan wordlessly, clenching down against his shaft. He’s picked up his pace to the speed he was using when you began, reaming you hard and fast as he can. You quake and heave, bucking beneath him; you can’t take much more of this...", parse);
				Text.NL();
				Text.Add("With one last push, Cale hilts himself inside you, or as far as he can without pushing his fat knot inside you. He howls and you feel the distinct warmth of his wolf seed painting the walls of your abused ass.", parse);
				Text.NL();
				Text.Add("That’s the last straw for you as well; you sing out as if in counterpoint to his howl of ecstasy as pleasure surges through your body.", parse);
				if(player.FirstCock())
					Text.Add(" Your [multiCockDesc] erupt[notS] in climax, painting the ground beneath you with your seed.", parse);
				if(player.FirstVag())
					Text.Add(" Your neglected womanhood rains down juices, smearing your [thighsDesc] before splattering onto the earth below.", parse);
				Text.NL();
				Text.Add("Without his knot to hold the seed in, most of it wind up leaking around the seal of your ass, splattering your butt with white. Only when the jets are reduced to a trickle does Cale pull away, sputtering a couple weak ropes onto your [buttDesc]. <i>”Ah, that hit the spot. Too bad y’ wouldn’t let me tie,”</i> he says, panting as he sits down beside you and leans on the [log].", parse);
				Text.NL();
				Text.Add("You simply pant, regaining your strength. Once you can move again, you gather your gear and thank Cale for the nice time, already absently looking for a place to properly clean yourself up.", parse);
				Text.NL();
				Text.Add("<i>”You’re welcome, if you want any more y’know where to find me,”</i> he grins waving you away.", parse);
				Text.Flush();
				
				cale.relation.IncreaseStat(100, 3);
				world.TimeStep({hour : 1});
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "He can just forget about shoving that knot up your ass!"
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return true; });
	
	if(fromVag == null) {
		scenes.AddEnc(function() {
			Text.Add("You find yourself growling in frustration, so close to the edge you can nearly taste it. As Cale pulls his hips back again, you find him suddenly withdrawing his cock out entirely, leaving your [anusDesc] squeezing in vain on empty air and you asking what’s wrong - doesn’t he want to finish this?", parse);
			Text.NL();
			Text.Add("<i>”Don’t worry, I wanna get off as much as ya do, just thought I’d mix things up a bit.”</i>", parse);
			Text.NL();
			Text.Add("Twisting around to look back over your shoulder at him, you raise an eyebrow and ask what he has in mind.", parse);
			Text.NL();
			if(cale.Slut() >= 60 && player.FirstCock())
				Text.Add("<i>”Normally I’d home in on this juicy cock of yours,”</i> he says, giving your [multiCockDesc] an appreciative stroke. <i>”But, this time I think I’ll try this bit.”</i> He runs a finger along the moist slit of your [vagDesc].", parse);
			else
				Text.Add("<i>”Well, you got such a pretty pussy down here,”</i> he runs a finger along your moist slit, <i>”that I can’t help but want to give it a shot. So I’mma do just that.”</i> He grins.", parse);
			Text.NL();
			Text.Add("A shiver of appreciation races down your spine at his touch, and you find yourself grinning wickedly. Well, if that’s what he has in mind, why say no? But you think this requires a more... delicate touch.", parse);
			Text.NL();
			Text.Add("You push yourself upright, whirling around to face the startled wolf before pulling him into a possessive kiss, authoritatively thrusting your [tongueDesc] in between his lips and molesting his mouth. His legs slacken at your surprise burst of aggressiveness, and so he offers no resistance as you gently spin him around so that your positions are reversed.", parse);
			Text.NL();
			parse["br"] = player.FirstBreastRow().Size() >= 5 ? ", smothering him in your cleavage" : "";
			Text.Add("Your hands reach for his shoulders and you push down, firmly and insistently, sending him thumping softly to the ground below. You break the kiss at last, leaving him panting for breath, and close the distance between you by straddling him, arms pulling his face against your [breastsDesc][br][, hard [multiCockDesc] rubbing against his belly]. Downwards you slide until you can feel your [vagDesc] in proper alignment with his straining wolfhood, smirking as you look into his eyes. Cale licks his lips, eager to begin.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Scenes.Cale.SexCatchVagEntrypoint(outside, true);
			});
		}, 1.0, function() { return player.FirstVag(); });
		
		scenes.AddEnc(function() {
			Text.Add("Without so much as a warning, Cale pulls out of your abused ass and nests his knotty wolf-pecker between the cheeks of your [buttDesc]. He presses the buttcheeks together as he fucks your ass-cleavage, rubbing his length against your rosebud.", parse);
			Text.NL();
			
			Scenes.Cale.SexCaleShowerEntrypoint(outside);
		}, 1.0, function() { return true; });
		
		scenes.AddEnc(function() {
			Text.Add("<i>”Hey, [playername]?”</i>", parse);
			Text.NL();
			Text.Add("You give Cale an idle grunt of acknowledgement back, more concerned with the feeling of his lupine fuckmeat ploughing your asshole.", parse);
			Text.NL();
			Text.Add("<i>”No offense, but I really need this.”</i>", parse);
			Text.NL();
			Text.Add("That statement is enough to make you blink in surprise. You open your mouth, intending to ask him what he means, but all that escapes you is a drawn-out blissful moan as he smoothly extracts himself from you. This gives way to a surprised grunt he suddenly grabs you by the hips and spins you around, leaving you sitting back against the [log] you were previously leaning over. You shake your head, but any attempt to gather your thoughts are cut off when Cale, having moved to squate over you, suddenly drops ass-first into your lap, audibly squelching wetly as[oneof] your [multiCockDesc] plunges meatily into the well-trained tailhole of your lupine buttslut.", parse);
			Text.NL();
			Text.Add("<i>”Yes! This is the best. Nothing quite like a hard cock to plug up my need behind.”</i>", parse);
			Text.NL();
			Text.Add("Groaning softly as Cale’s not inconsiderable weight smacks into your belly, you can’t resist commenting that this certainly wasn’t what you expected when you offered to let him fuck your ass instead.", parse);
			Text.NL();
			Text.Add("<i>”Hey, for one, it’s your fault for making me like this. Second, did you really think I wouldn’t notice this juicy cock of yours bouncing down below as I took you? Finally, don’t act like you don’t like Cale’s butt,”</i> he teases.", parse);
			Text.NL();
			Text.Add("Reaching your arms around Cale’s waist, you pull him closer, allowing you to nuzzle your face into the crook of his neck. No, you certainly can’t say that you don’t like his butt... his tight, soft, wet, welcoming butt! You buck your hips rhythmically, punctuating each descriptive word with a powerful thrust of your own shaft into Cale’s ass, feeling the slut grip and squeeze you with each motion you make.", parse);
			Text.NL();
			
			Scenes.Cale.SexCaleButtslutEntrypoint(outside, cocksInAss);
		}, 1.0, function() { return cale.Slut() >= 60 && cocksInAss.length > 0; });
	}
	
	scenes.Get();
}

Scenes.Cale.SexGettingFuckedOutsideComments = function() {
	var parse = {
		
	};
	
	var scenes = new EncounterTable();
	/* TODO: Special
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/
	scenes.AddEnc(function() {
		if(cale.flags["xedOut"] >= 15)
			Text.Add("By now, the sight of the two of you going at it is so commonplace that nobody casts so much as a glimpse your way.", parse);
		else if(cale.flags["xedOut"] >= 5)
			Text.Add("Though your actions still attract a few glances and stares, far more people ignore you than pay attention. It seems the novelty or shock value of your sexual escapades is wearing off.", parse);
		else
			Text.Add("You can hear a chorus of whispers, chuckles and comments as the sounds of your fucking draw the attention of others in the camp. You can feel the eyes wandering over your naked forms in a variety of expressions, from desire to appreciation, humor to disapproval, but if Cale feels the slightest shame in being a spectacle, he certainly doesn't let it slow him down.", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	cale.flags["xedOut"]++;
}


Scenes.Cale.Rogue = function() {
	var parse = {
		playername : player.name,
		legsDesc   : function() { return player.LegsDesc(); },
		buttDesc   : function() { return player.Butt().Short(); }
	};
	
	Text.Clear();
	Text.Add("<i>”I never get in a fight unless I can avoid it, and when I do, I fight to win.”</i> The wolf looks a bit more serious than usual. <i>”If the streets taught me anything, it’s that fighting fair doesn’t mean shit if you don’t win, and winning is all that matters. All the nobles and their fancy duels may look impressive, but they aren’t expecting the other guy to jump and shank ‘em when they’re down.”</i>", parse);
	Text.NL();
	
	var cocksInAss = player.CocksThatFit(cale.Butt());
	
	if(cale.flags["Rogue"] == Cale.Rogue.First) {
		cale.flags["Rogue"] = Cale.Rogue.Ret;
		Text.Add("Cale scratches himself thoughtfully. <i>”Teach you, huh? Never was the pedacolalogical type. I guess I could show you a few moves though.”</i> He jumps to his feet, warming up his sinewy limbs to get some flexibility.", parse);
		Text.NL();
		Text.Add("<i>”The key is to do what the opponent doesn’t expect-”</i> ", parse);
		if(Jobs["Rogue"].Unlocked() || player.Int() >= 40) {
			Text.Add("Even if he’s doing his best to hide it, his posture gives his intent away to your perceptive eyes an instant before he springs to action. You barely sidestep the wolf’s lunge, somehow managing to keep your balance. The opportunity is too good to pass up, and you deftly grab his exposed tail and pull, toppling him over.", parse);
			Text.NL();
			Text.Add("Cale curses and sputters as he crashes into a pile, propped over the log with his ass poking out. <i>”G-guess I don’t need to tell you about always keeping a watchful eye,”</i> he chuckles, still a bit out of breath. <i>”Nice work on taking the free shot, didn’t see that one coming… uh, [playername]?”</i>", parse);
			Text.NL();
			Text.Add("With a start, you realize that you still have a firm hold on the base of his tail, your other hand hovering inches from his butt.", parse);
			if(cale.Slut() >= 30)
				Text.Add("<i>”Ah… in the situation that you have your enemy at your mercy - um - the best move would be to deliver the - uh - finishing blow,”</i> Cale quips quickly as he reads the situation, wiggling his butt helpfully.", parse);
			else if(cale.Butt().virgin)
				Text.Add("<i>”Alright, alright, no more funny business, I promise!”</i> Cale tries to wriggle free, but winces as he tries to pull his tail free of your grip. He whimpers, waiting for you to let him go.", parse);
			else
				Text.Add("<i>”N-now, I was just having a bit of fun, I promise!”</i> Cale’s voice falters, not sure if you are going to take advantage of the situation or not.", parse);
			Text.Flush();
			
			//[Let go][Fuck him]
			var options = new Array();
			options.push({ nameStr : "Let go",
				func : function() {
					Text.Clear();
					if(cale.Slut() >= 30) {
						Text.Add("<i>”Ah… okay.”</i> The wolf sounds a bit disappointed.", parse);
						Text.NL();
					}
					Text.Add("<i>”Sorry about that, guess I really don’t have it in me to be a teacher,”</i> Cale groans as he gets back on his feet, rubbing his sore bum. ", parse);
					Scenes.Cale.RogueTeach();
				}, enabled : true,
				tooltip : "Have mercy on him."
			});
			options.push({ nameStr : "Fuck him",
				func : function() {
					Text.Clear();
					Text.Add("You grin widely. The opportunity is just too good to pass up. Wasn’t those his words? All that matters in a fight is that you win? Still keeping a firm grip on his tail, you caress his round butt, sending a shiver up the wolf’s spine. The loser can’t be going expecting the victor to take any mercy on him, now can he?", parse);
					Text.NL();
					if(cale.Slut() >= 30) {
						parse["eager"] = cale.Slut() >= 60 ? " eager" : "";
						Text.Add("<i>”Mmm...”</i> Cale moans, lost in the sensations as you grope him. <i>”N-no mercy!”</i> he yips happily, rubbing back against your hand. He sighs languidly as you hooks your thumb into the hem of his pants, pulling them down and exposing his[eager] rosebud.", parse);
					}
					else {
						parse["virgin"] = cale.Butt().virgin ? " virgin" : "";
						parse["virgin2"] = cale.Butt().virgin ? "perhaps" : "you know from experience";
						Text.Add("<i>”W-what are you doing, [playername]?!”</i> Cale whimpers, trying and failing to scramble away. In one smooth motion, you grab hold of the wolf’s pants and pull them down to his knees, baring his[virgin] rosebud for all to see. You console the struggling morph that you are just following his lesson. Besides, [virgin2] he’ll like it.", parse);
						if(cale.Butt().virgin) {
							Text.NL();
							Text.Add("<i>”I… ah… b-be gentle?”</i> he manages to stammer out. Looks like he actually might secretly want it?", parse);
						}
					}
					Text.NL();
					Text.Add("In the middle of the nomad camp, you might have a bit of an audience, but you don’t really care. What matters now is putting the wolf in his place.", parse);
					Text.NL();
					
					cale.slut.IncreaseStat(50, 10);
					
					Scenes.Cale.SexFuckHim(true);
				}, enabled : (cocksInAss.length > 0),
				tooltip : "All that matters is winning, wasn’t it?"
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else { // He got the drop on you
			Text.Add("Before you can react, the wolf is on you, lunging violently. You brace yourself for impact, but the impact never comes. Cale slides underneath you and kicks your [legsDesc], tripping you and sending you crashing onto the ground. You struggle to get up as fast you can, but the wolf has you pinned down before you can accomplish much. He twists your body in a way that even ", parse);
			if(player.Str() >= 40)
				Text.Add("with your superior strength you can’t break his hold.", parse);
			else
				Text.Add("if you were stronger you wouldn’t be able to break his hold.", parse);
			Text.NL();
			Text.Add("He further subdues you by using your own weight to slam you into the ground. It doesn’t really hurt, but the impact manages to knock the air right out of your lungs. As you gasp to catch your breath, you can feel a distinct bulge grinding against your [buttDesc]. Looks like this little rough-housing’s gotten Cale excited…", parse);
			Text.NL();
			Text.Add("<i>”Now that I have you under control, I would deliver the finishing blow. From this position I could pull a knife and stab you before you had the chance to fight back, or I could choke you to knock you out, or...”</i> he grinds against your butt again, making sure you can feel his growing hardness. <i>”I could take you right here, right now. But since I’m such a nice guy, if you give up now I’ll let you go. How about it?”</i>", parse);
			Text.Flush();
			
			//[Yield][Take it]
			var options = new Array();
			options.push({ nameStr : "Yield",
				func : function() {
					Text.Clear();
					Text.Add("<i>”Good choice,”</i> he comments, releasing you. Relieved from your awkward hold, you take a moment to stretch out and work out the kinks on your muscles before you get back up. <i>”One of the most important rules if you wanna live to see the next day is to know your limits. There’s always someone better than you out there. And surrendering might save your life or give you an opportunity to fight back.”</i> He grins.", parse);
					Text.NL();
					
					Scenes.Cale.RogueTeach();
				}, enabled : true,
				tooltip : "You give, you give."
			});
			options.push({ nameStr : "Take it",
				func : function() {
					Text.Clear();
					Text.Add("Cale chuckles, <i>”Alright then, no mercy it is!”</i> He wrestles with your [lowerArmorDesc] and somehow manages to rip it off your, exposing your naked [anusDesc] [and [vagDesc]] to his appreciative eyes.", parse);
					Text.NL();
					Text.Add("<i>”One final lesson, [playername]. Us rogues do it from behind.”</i> With that, Cale thrusts forward, driving his point and his cock home.", parse);
					Text.NL();
					
					if(player.FirstVag())
						Scenes.Cale.SexCatchVagEntrypoint(true);
					else
						Scenes.Cale.SexCatchAnalEntrypoint(true);
				}, enabled : true,
				tooltip : "It wouldn’t be a proper lesson if he stopped here, would it?"
			});
			Gui.SetButtonsFromList(options, false, null);
		}
	}
	else {
		Text.Add("The two of you spend some time reviewing some dirty fighting techniques, this time without shenanigans, and at the end of it you feel that you have a more solid grasp of the subject.", parse);
		Text.NL();
		
		if(!Jobs["Rogue"].Unlocked()) {
			cale.relation.IncreaseStat(100, 4);
			Text.Add("<b>Unlocked the Rogue job.</b>", parse);
			Text.NL();
		}
		Text.Add("<i>”Just pray you never get into a situation where you have to use this,”</i> Cale concludes.", parse);
		Text.Flush();
		
		cale.relation.IncreaseStat(100, 1);
		world.TimeStep({hour : 1});
		
		cale.flags["Rogue"] = Cale.Rogue.Taught;
		
		Scenes.Cale.Prompt();
	}
}

Scenes.Cale.RogueTeach = function() {
	var parse = {
		
	};
	
	Text.Add("<i>”Thought I’d try show don’t tell, guess that didn’t work out too well.”</i> He flashes you a friendly grin. Well, his intentions were good enough, you suppose. Still, you’ll keep a more careful eye on him from now on.", parse);
	Text.NL();
	Text.Add("The wayward rogue goes on to describe a few other moves in his arsenal, this time without trying to demonstrate them on you.", parse);
	Text.NL();
	if(Jobs["Rogue"].Unlocked()) {
		Text.Add("None of this is news to you, but hearing the techniques described from a new source is enlightening.", parse);
	}
	else {
		Text.Add("You quickly see the advantage of this fighting style, and start musing on how you could incorporate the techniques he’s describing into your own battles. It’ll probably require quite a bit of practice.", parse);
		Text.NL();
		Text.Add("<b>Unlocked the Rogue job.</b>", parse);
	}
	Text.NL();
	Text.Add("<i>”Just pray you never get into a situation where you have to use this,”</i> Cale concludes.", parse);
	Text.Flush();
	
	cale.relation.IncreaseStat(100, 3);
	world.TimeStep({hour : 1});
	
	cale.flags["Rogue"] = Cale.Rogue.Taught;
	
	Scenes.Cale.Prompt();
}
