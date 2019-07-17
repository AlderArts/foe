
import { Scenes } from '../event';

Scenes.Miranda.DatingEntry = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	if(miranda.flags["Dates"] == 0) { // first
		if(miranda.Attitude() >= Miranda.Attitude.Neutral)
			Text.Add("<i>“You coming on to me, [playername]?”</i> Miranda looks amused, but nods. <i>“Sure, I’m game. Let’s ditch this place.”</i> Saying so, she drains her beer in one go, slamming the empty cup to the table.", parse);
		else {
			Text.Add("<i>“You are certainly singing a different tune now than when we first met.”</i> Miranda growls suspiciously. <i>“What’s your game?”</i> Grudgingly, she agrees to go with you, draining her beer and slamming the empty cup to the table.", parse);
			if(miranda.flags["gBJ"] > 0) {
				Text.NL();
				Text.Add("<i>“If nothing else, at least I’ll get to fuck you at the end of it,”</i> she mutters to herself.", parse);
			}
		}
		Text.NL();
		Text.Add("<i>“I’m quite picky with who I date, you should know. Put on your best face, or whatever other bodypart you’d like to flaunt.”</i>", parse);
		Text.NL();
		Text.Add("You leave the sordid tavern behind, walking aimlessly through the picturesque slums of the large city. For once, Miranda isn’t very talkative, seeming to be preoccupied with her own thoughts. Just when the silence is starting to get uncomfortable, she yips in surprised joy.", parse);
		Text.NL();
		Text.Add("<i>“Oh, this place! Haven’t been through here in a while.”</i> You follow the excited canine through an archway into what looks like a small secluded park of sorts, containing a few trees and bushes, a cracked stone table and a few simple wooden benches. The small space would easily fit inside the common room of the Maidens’ Bane.", parse);
		Text.NL();
		Text.Add("<i>“This is the place I lost my virginity,”</i> Miranda gestures around the place with sparkling eyes like if it were a grand ball room. <i>“Oh how young I was… Both me and my boyfriend were rather drunk. Still, I enjoyed myself greatly.”</i> She looks thoughtful for a moment. <i>“My boyfriend, not so much.”</i>", parse);
		Text.NL();
		if(miranda.Sexed()) {
			Text.Add("<i>“As you may have noticed, I have a hard time holding back,”</i> the herm blushes faintly. You’ve sort of gotten that impression.", parse);
			Text.NL();
		}
		Text.Add("<i>“So, what do you think, [playername]?”</i>", parse);
		
		party.location = world.loc.Rigard.Slums.gate;
		world.TimeStep({minute: 20});
		
		Text.Flush();
		
		Scenes.Miranda.DatingScore = miranda.Attitude();
		
		//[Polite][Rude][Sultry]
		var options = new Array();
		options.push({ nameStr : "Polite",
			func : function() {
				Text.Clear();
				Text.Add("You rather guardedly tell her it’s a nice place, not really sure what she’s expecting you to say.", parse);
				Text.NL();
				Text.Add("<i>“Aww, you are no fun.”</i> Miranda looks disappointed.", parse);
				Text.NL();
				Scenes.Miranda.DatingFirstDocks();
			}, enabled : true,
			tooltip : "Very nice. No, really."
		});
		options.push({ nameStr : "Rude",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Nostalgia is what it is. I have some good memories here, and I’m not ashamed of that.”</i> Miranda looks grumpy at your reaction.", parse);
				Text.NL();
				
				miranda.relation.DecreaseStat(-100, 2);
				Scenes.Miranda.DatingScore--;
				
				Scenes.Miranda.DatingFirstDocks();
			}, enabled : true,
			tooltip : "A rather crude place to take someone on a date, isn’t it?"
		});
		options.push({ nameStr : "Sultry",
			func : function() {
				Text.Clear();
				Text.Add("Rather than being taken aback, Miranda takes your counter in a stride.", parse);
				Text.NL();
				Text.Add("<i>“Several times. My first relationship didn’t last very long, but me and my boyfriend stole back here quite often while it did.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Was a while since last time, though. You offering?”</i> Before you can respond, she shakes her head, grinning at you. <i>“My tastes have refined over time. I’d prefer to ram you in my own bed instead. Consider it an offer.”</i>", parse);
				Text.NL();
				if(miranda.flags["gAnal"] != 0) {
					Text.Add("<i>“Who knows, perhaps you’ll prefer it over a dirty alleyway,”</i> she adds, jabbing you in the ribs with her elbow.", parse);
					Text.NL();
				}
				
				miranda.relation.IncreaseStat(100, 3);
				Scenes.Miranda.DatingScore++;
				
				Scenes.Miranda.DatingFirstDocks();
			}, enabled : true,
			tooltip : "So… she took her first here, has she repeated the feat?"
		});
		Gui.SetButtonsFromList(options);
	}
	else if(miranda.flags["Dates"] == 1) {
		Scenes.Miranda.DatingScore = miranda.Attitude();
		
		if(miranda.flags["dLock"] == 1) {
			Text.Add("<i>“What, changed your mind? Ready to become my bitch?”</i> Miranda nods toward her crotch pointedly. <i>“Blow me. Right here, right now.”</i>", parse);
			Text.Flush();
			
			Scenes.Miranda.DatingBlockPrompt();
		}
		else {
			if(miranda.Attitude() >= Miranda.Attitude.Neutral)
				Text.Add("<i>“I’d love to, [playername],”</i> Miranda replies heartily. <i>“I had a good time before… but we need to talk first.”</i>", parse);
			else
				Text.Add("<i>“Just what is your game, [playername]?”</i> Miranda looks genuinely puzzled. <i>“You just don’t seem to take a hint… or maybe you get off on abuse. Is that it? Are you a masochist? Not that I’d mind...”</i>", parse);
			Text.NL();
			Text.Add("The doberherm takes another swig of her mead, sighing contentedly.", parse);
			Text.NL();
			Text.Add("<i>“Look. If you want to hang with me, we need to set out some ground rules. Don’t think that this is going to be your lovey-dovey romance kind of thing. I don’t <b>do</b> relationships, I do fuckbuddies. I do a lot of them. If I want to fuck someone, I’m going to do it, regardless of what you think about it.”</i>", parse);
			Text.NL();
			Text.Add("Guess that is just something you have to accept about Miranda. She doesn’t look like she’s going to budge on it.", parse);
			Text.NL();
			Text.Add("<i>“Second thing. Expect to be on the receiving end of my cock. A lot.”</i> Your eyes unwittingly drift down to the bulge between her legs. When you glance back up, Miranda is grinning widely at you. <i>“I like being on top. Which means you like being my bottom.”</i>", parse);
			Text.NL();
			if(miranda.flags["public"] >= Miranda.Public.Oral) {
				Text.Add("<i>“Not that you seem to have a problem with that. Well then, shall we?”</i>", parse);
				Text.NL();
				Text.Add("You finish your drinks and head out into the slums.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Scenes.Miranda.DatingStage2();		
					miranda.flags["Dates"]++;
				});
			}
			else {
				Text.Add("You squirm a bit under her gaze.", parse);
				Text.NL();
				Text.Add("<i>“I’d like you to show your… dedication, [playername].”</i> Miranda points between her legs imperiously. <i>“Suck.”</i>", parse);
				Text.NL();
				Text.Add("What, here?", parse);
				Text.Flush();
				
				Scenes.Miranda.DatingBlockPrompt();
			}
		}
	}
	else { // 3+
		miranda.flags["Dates"]++;
		Scenes.Miranda.DatingScore = miranda.Attitude();
		
		parse["masterMistress"] = miranda.SubDom() - player.SubDom() > -50 ?
			player.name : player.mfTrue("master", "mistress");
		if(miranda.Attitude() >= Miranda.Attitude.Neutral)
			Text.Add("<i>“Sure, I’d love to, [masterMistress]!”</i> Miranda replies, eagerly draining her tankard.", parse);
		else
			Text.Add("<i>“Just can’t get enough of my cock, can you?”</i> Miranda grins mockingly, draining her tankard. <i>“Sure, I’m game.”</i>", parse);
		Text.NL();
		Scenes.Miranda.DatingStage1();
	}
}

Scenes.Miranda.DatingBlockPrompt = function() {
	var parse = {
		name : miranda.Attitude() >= Miranda.Attitude.Neutral ?
			player.name : "slut"
	};
	
	//[Do it][Refuse]
	var options = new Array();
	options.push({ nameStr : "Do it",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Good, showing your true colors,”</i> Miranda purrs.", parse);
			Text.NL();
			
			Scenes.Miranda.TavernSexPublicBJ();
			
			miranda.flags["dLock"] = 0;
			
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("<i>“Thanks for that, [name],”</i> Miranda stretches languidly. <i>“Shall we go?”</i>", parse);
				Text.NL();
				Text.Add("You finish your drinks and head out into the slums.", parse);
				Text.NL();
				
				miranda.relation.IncreaseStat(100, 5);
				Scenes.Miranda.DatingScore++;
						
				miranda.flags["Dates"]++;
				Scenes.Miranda.DatingStage2();
			});
		}, enabled : true,
		tooltip : "Get down on your knees and give her a blowjob."
	});
	options.push({ nameStr : "Refuse",
		func : function() {
			Text.Clear();
			if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
				Text.Add("<i>“Well, fuck. I’m sure you’ll come around sooner or later.”</i> Miranda sounds determined, if a bit disappointed. <i>“I’m not giving up on this, but you are off the hook until later tonight. Shall we go?”</i>", parse);
				Text.NL();
				Text.Add("You finish your drinks and head out into the slums.", parse);
				Text.NL();
				Scenes.Miranda.DatingScore--;
				miranda.relation.DecreaseStat(0, 5);		
				
				miranda.flags["Dates"]++;
				Scenes.Miranda.DatingStage2();
			}
			else {
				Text.Add("<i>“In that case, you can forget going out with me,”</i> she declares dismissively, going back to her drink. <i>“I don’t date sluts who aren’t honest with themselves.”</i>", parse);
				Text.Flush();
				
				miranda.flags["dLock"] = 1;
				
				Gui.NextPrompt();
			}
		}, enabled : true,
		tooltip : "No! You’re not going to do that!"
	});
	Gui.SetButtonsFromList(options, false, null);
}

// BAR HANGOUT
//TODO
Scenes.Miranda.DatingStage1 = function() {
	var parse = {
		
	};
	
	var contfunc = function() {
		Text.Add("<i>“How about we duck outside for a while?”</i> the guardswoman asks suggestively. Following her, the two of you head out into the slums of Rigard.", parse);
		Text.NL();
		
		Scenes.Miranda.DatingStage2();
	}
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Wanna stick around for a few drinks first?”</i> before you have the opportunity to respond, she calls for another round, asking for the ‘special’. The barkeep comes over with two mugs filled with a clear, colorless substance. <i>“Have a taste of this, it packs quite a punch!”</i> the guardswoman urges you on.", parse);
		Text.Flush();
		
		//[Drink][Don’t]
		var options = new Array();
		options.push({ nameStr : "Drink",
			func : function() {
				Text.Clear();
				Text.Add("You both down your mugs, your head swimming and throat burning from the incredibly strong liquid.", parse);
				Text.NL();
				
				var drunk = player.Drink(2, true); //Supress regular handler
				
				if(drunk) {
					Text.Add("Your vision is starting to blur, and things are becoming kinda fuzzy. Just as you start wondering what the hell was in the drink, you black out.", parse);
					Text.Flush();
					
					var remaining = player.drunkLevel - 0.8;
					var minutes   = Math.floor(remaining / player.DrunkRecoveryRate() * 60);
					
					world.TimeStep({minute: minutes});
					
					Gui.NextPrompt(function() {
						Text.Clear();
						Text.Add("When you finally come to, you are prone on the ground, your head pounding something fierce. You throw a quick accusatory glance at Miranda, who is still sitting at the table.", parse);
						Text.NL();
						Text.Add("<i>“I didn’t do anything to you!”</i> she scoffs, amused. <i>“Not my fault you can’t hold your drink.”</i>", parse);
						Text.NL();
						if(miranda.Nasty())
							Text.Add("<i>“Besides, if I <b>did</b> want to take advantage of you, it’d be much more fun if you were awake for it.”</i> You guess that you can, in a weird way, trust her on that at least.", parse);
						else
							Text.Add("<i>“Well… sorry anyways,</i> she apologizes a bit guiltily.", parse);
						Text.NL();
						Text.Add("<i>“I’ll see you around I guess. I think we can forget about the date until you can walk properly again.”</i>", parse);
						Text.Flush();
						Gui.NextPrompt();
					});
				}
				else {
					Text.Add("<i>“That’s the spirit!”</i> Miranda cheers you on. You somehow manage to keep up with the dobie, but <i>damn</i> she parties hard! The two of you have a few more drinks, but nothing as strong as the first one.", parse);
					Text.NL();
					Scenes.Miranda.DatingScore++;
					contfunc();
				}
			}, enabled : true,
			tooltip : "Bottoms up!"
		});
		options.push({ nameStr : "Don’t",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Come on, don’t be such a pussy,”</i> Miranda growls, downing her own mug in one go. You can almost taste the alcohol in her exhaled breath. <i>“Ahh, that hit the spot.”</i>", parse);
				Text.NL();
				Text.Add("You stay in the tavern for a while, Miranda taking a few more drinks while you politely refuse taking any. Finally, she seems to grow bored.", parse);
				Text.NL();
				Scenes.Miranda.DatingScore--;
				contfunc();
			}, enabled : true,
			tooltip : "Decline. You’re not quite sure what’s in that."
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return true; });
	//TODO
	/*
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/
	//Fallback
	scenes.AddEnc(function() {
		Text.Add("You make some small talk, but Miranda is beginning to look bored.", parse);
		Text.NL();
		contfunc();
	}, 0.2, function() { return true; });
	
	scenes.Get();
}

// TOWN EVENTS
//TODO
Scenes.Miranda.DatingStage2 = function() {
	var parse = {
		
	};
	
	world.TimeStep({hour: 1});
	
	Gui.Callstack.push(function() { //TODO
		Text.Add("After some time, the two of you have made your way to Miranda’s house. The dobie turns to look at you expectantly.", parse);
		Text.NL();
		Scenes.Miranda.DatingStage3();
	});
	
	var talkPrompt = function() {
		//[Her past][Sex stories][Her place]
		var options = new Array();
		options.push({ nameStr : "Her past",
			func : Scenes.Miranda.TalkBackstory, enabled : true,
			tooltip : "Ask her for her story."
		});
		options.push({ nameStr : "Sex stories",
			func : Scenes.Miranda.TalkConquests, enabled : true,
			tooltip : "Ask her for some raunchier stories. She’s bound to have some, right?"
		});
		options.push({ nameStr : "Her place",
			func : function() {
				Text.Clear();
				if(miranda.Nasty())
					Text.Add("<i>“Can hardly wait to get the dick, can you?”</i> Miranda laughs mockingly. <i>“Fine, let’s head to my place so I can bang your brains out, slut.”</i>", parse);
				else
					Text.Add("<i>“My, eager aren’t we?”</i> Miranda laughs, changing direction. <i>“Come along then, lover!”</i>", parse);
				Text.NL();
				Scenes.Miranda.DatingScore++;
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Just cut right to the chase and take her home."
		});
		
		Gui.SetButtonsFromList(options, false, null);
	}
	
	var scenes = new EncounterTable();
	//((Wandering around slums))
	scenes.AddEnc(function() {
		Text.Add("You wander the sprawling slums of the city, Miranda pointing out her various old haunts as a kid, or places you should be wary of. These parts are to the vast majority filled with unfortunate souls, and desperation makes people do unsavoury things.", parse);
		Text.NL();
		Text.Add("The guardswoman walks the streets like if she owns them, confident in her stride. Now would be a good time to talk to her, when her head isn’t deep down a cup of booze.", parse);
		Text.Flush();
		
		talkPrompt();
	}, 1.0, function() { return true; });
	/* TODO
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/
	
	scenes.Get();
}

Scenes.Miranda.TalkBackstory = function(atBar) {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("As you walk, you ask if she could tell you a bit about her past and her life in the city.", parse);
	Text.NL();
	Text.Add("<i>“Talk about myself? I guess… now where to start.”</i>", parse);
	Text.NL();
	
	var scenes = [];
	
	// ((Story of growing up in Rigard))
	scenes.push(function() {
		Text.Add("<i>“Me and my family grew up here in Rigard,”</i> Miranda begins thoughtfully. <i>“We had a pretty nice house in the residential district - nothing posh, but bigger than the one I have now. Nice enough place, though I remember very little of it.”</i>", parse);
		Text.NL();
		if(miranda.flags["bgRotMax"] == 0) {
			Text.Add("You ask her why that is? Did they move?", parse);
			Text.NL();
			Text.Add("<i>“The rebellion is what happened,”</i> she answers shortly. <i>“I have about the same sob story as every other person in the damn city.”</i> You decide not to pry further until she tells you herself.", parse);
			Text.NL();
		}
		Text.Add("<i>“Back then, it was me, my sister Belinda, mom and dad. It was a cute and cozy little family, though I must have been a handful. Bel was always the prim and proper one. The irony of that.”</i> She chuckles bitterly.", parse);
		Text.NL();
		Text.Add("<i>“I guess I was kind of a brat back then, running around town and beating up other kids my age. Now that I think about it, that last part hasn’t changed much. I probably fit in much better in the slums, but my sister loved the city.”</i>", parse);
		Text.NL();
		Text.Add("She trails off a bit, unwilling or unable to go on.", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	if(miranda.Relation() >= 25) {
		// ((Death of her parents))
		scenes.push(function() {
			Text.Add("<i>“Remember what I said about the rebellion? There was all sorts of bad stuff brewing in the city after that. Neither of my parents took part, but the city was rife with anti-morph sentiments. Just about everyone was scared and nobody knew what the recently crowned king was going to do next. Many who probably should have fled the city stayed, perhaps because they simply didn’t know anything else.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I only remember hazy details of it, but me and my family were forced out into the slums, thrown out of our house and put in a small shed, like a kennel for common dogs.”</i>", parse);
			Text.NL();
			Text.Add("<i>“There was a big riot, a large mob of bigoted scum coming down hard on the slums. Bloody miracle the entire city didn’t burn to the ground. Perhaps it would have been better if it did.”</i>", parse);
			Text.NL();
			if(miranda.flags["bgRotMax"] == 1) {
				Text.Add("She is clearly coming up to a particularly painful part of her story, so you refrain from asking any questions for now.", parse);
				Text.NL();
			}
			Text.Add("<i>“Mom and dad were both killed - while blood flowed on the streets as the military clashed with the mob, some thugs broke into our house to take what little we had. My parents… protected me and my sister, but paid a horrible price for it.”</i>", parse);
			Text.NL();
			Text.Add("Miranda hangs her head. <i>“What am I thinking, this is hardly a good story for a date. Sorry, [playername], but my tale is what it is.”</i> You ask her if she’s fine. <i>“Don’t worry about me,”</i> she snaps back. <i>“I’ve gotten over it. No need to dig up old wounds.”</i>", parse);
			Text.NL();
			
			PrintDefaultOptions();
		});
		// ((The slums))
		scenes.push(function() {
			Text.Add("<i>“Life in the slums was tough for two orphaned kids. I don’t think I was older than ten when we had to start fending for ourselves, and my sister only eight. Bel took it particularly hard, so it was up to me to try and protect the little puppy. Fat thanks I got for that,”</i> she grumbles.", parse);
			Text.NL();
			Text.Add("<i>“I think I mentioned it before, but when we first moved to the slums, I spent a lot of time in the docks. I returned there to look for work after we buried our parents, as Bel was fat little use, just running around crying all the time. We were hardly the only ones in the same situation, so there wasn't going to be any charitable benefactor to help us survive. At least, not one that didn’t come with unbearable consequences.”</i>", parse);
			Text.NL();
			Text.Add("You look at her curiously. <i>“Trust me, you are better off not knowing about some of the offers me and my sister were given.”</i>", parse);
			Text.NL();
			Text.Add("<i>“We were able to get by thanks to my work anyways. I was strong for my size even back then, and hauling crates all day sure didn’t change that. I got to hang with the sailors who talked about distant lands on the other side of Eden, the free cities, and even the secret city hidden in the upper branches of the Great Tree. Not that anyone had actually visited the latter, but they all bragged about knowing someone who had.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I used to dream I could go with them, but I couldn’t bring myself to leave my sister all alone.”</i>", parse);
			Text.NL();
			
			PrintDefaultOptions();
		});
		if(miranda.Relation() >= 50) {
			// ((Joining the mercs))
			scenes.push(function() {
				Text.Add("<i>“Years went by in the slums. Both me and Bel grew up into proper ladies - well, Bel did at least. It never quite caught on me,”</i> she grins. <i>“Plus, I had this little addition,”</i> she adds, patting her bulge fondly. <i>“While that sure as hell didn’t help me while growing up, I got a reputation for shutting people up who thought it a fair reason to try and bully me.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Even later, I found… different ways to get back at my tormentors, something that hurt their pride even more than a sound beating would.”</i> She grins lewdly. <i>“The best part is that they were all willing - almost all, after a bit of persuasion. Nothing better than breaking in some cocky ass who thinks the world revolves around him.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Anyways, that was a side note… unless you want to talk more about that, perhaps?”</i> she adds sweetly.", parse);
				Text.Flush();
				
				//[Sure!][No]
				var options = new Array();
				options.push({ nameStr : "Sure!",
				// ((Seduction supreme))
					func : function() {
						Text.Clear();
						parse["guyGirl"] = player.mfTrue("guy", "girl");
						parse["heshe"]   = player.mfTrue("he", "she");
						parse["hisher"]  = player.mfTrue("his", "her");
						parse["himher"]  = player.mfTrue("him", "her");
						
						Text.Add("<i>“Oh really now, then let’s find somewhere to discuss it further, why don’t we?”</i> The two of you walk together, Miranda chatting freely about her past conquests. <i>“You see, there was this [guyGirl], <b>really</b> pretty thing. Met [himher] pretty recently actually, while standing guard at the gates. Knew I had to tap that as soon as I saw [himher], so I invited them over to the Maidens’ Bane.”</i>", parse);
						Text.NL();
						
						var sexedCount = 0;
						for(var flag in miranda.sex)
							sexedCount += miranda.sex[flag];
						
						if(sexedCount >= 25) {
							Text.Add("The guardswoman goes on to describe all the lewd things she and her mystery lover have been up to. Just how would one find the hours in the day for all that?", parse);
						}
						else {
							Text.Add("<i>“Haven’t gotten [himher] in bed as much as I’d like yet, but I’m pretty certain I’m going to, <b>real</b> soon. ", parse);
							if(miranda.Nice())
								Text.Add("You wouldn’t believe the kind of stuff [heshe]’s into. Well, perhaps you would, at that.”</i>", parse);
							else
								Text.Add("Pretty sure they can’t wait to get fucked either, for all that they are playing coy.”</i>", parse);
						}
						Text.NL();
						parse["soon"] = sexedCount >= 25 ? " soon-to-be" : "";
						Text.Add("You are almost starting to feel a bit intimidated by this mystery flirt that she’s apparently courting on the side. And just where is this[soon] lover of hers, you ask a bit grumpily?", parse);
						Text.NL();
						Text.Add("<i>“Standing on my front porch, wearing a stupid look on [hisher] face,”</i> Miranda grins. With a start, you realize that you’ve arrived at her home.", parse);
						Text.NL();
						
						Scenes.Miranda.DatingScore++;
						
						Gui.Callstack.pop();
						Scenes.Miranda.DatingStage3();
						
						// Don't forward the convo until it has been revealed
						if(miranda.flags["bgRotMax"] == 3)
							sceneId--;
					}, enabled : true,
					tooltip : "That sounds interesting!"
				});
				options.push({ nameStr : "No",
					func : function() {
						Text.Clear();
						Text.Add("Seeing the trap coming from a mile away, you politely decline, asking her to continue the story.", parse);
						Text.NL();
						Text.Add("<i>“Bah, you are no fun!”</i> Miranda complains. <i>“...Where was I?”</i> Collecting her thoughts, she starts over again.", parse);
						Text.NL();
						Text.Add("<i>“As I said, me and Bel, grew up and filled out. It opened up new job opportunities for both of us. My body was built like a bar of iron, forged by working the docks. Hanging out with the sailors toned my tongue pretty damn rough too. Not to mention I could carry myself in a fight pretty well.”</i>", parse);
						Text.NL();
						Text.Add("<i>“I had grown pretty sick of the city, wanted to try new horizons, you know? Bel seemed to be able to handle herself, and there was a local mercenary guild that was hiring. Got a few complainers about a wee little girl joining their tough guy club, but a few broken teeth sorted that out well enough.”</i>", parse);
						Text.NL();
						Text.Add("<i>“The guild was the Black Hounds - I believe I showed you the guild hall earlier. Fucking scum the entire lot of them, but I sure as hell got what I wanted out of it.”</i>", parse);
						Text.NL();
						
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Ah… no, you are fine. Please continue the story."
				});
				Gui.SetButtonsFromList(options, false, null);
			});
			// ((Time with the mercs))
			scenes.push(function() {
				Text.Add("<i>“The Black Hounds were a rowdy bunch, both on and off duty. How they still get contracts after some of the shit we did is beyond me. We usually got the job done either way, and it wasn’t like we had much competition in our price class.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I got to spend a lot of time outside Rigard at the very least, traveling all over Eden. I’ve seen the free cities, visited the desert oasis, spent time among the highland tribes. Wherever there was trouble, the Black Hounds were there. Sometimes even before the fact.”</i>", parse);
				Text.NL();
				Text.Add("<i>“There are a lot of stories I could tell you about that time… We’d occasionally return to Rigard for some RnR, and I’d check in on my sister, drop off some money and so on. The rest of the gang burnt all their money on booze and whores as quickly as they could.”</i>", parse);
				Text.NL();
				Text.Add("Not her though?", parse);
				Text.NL();
				Text.Add("<i>“Sure, I may have taken a drink or two from time to time-”</i> Now that sounds like an understatement if ever you heard one. <i>“I’ve never had to pay for sex though. I just have this way with the ladies. With men too, actually. I saw plenty of that kind of action on our missions abroad.”</i>", parse);
				Text.NL();
				
				PrintDefaultOptions();
			});
			// ((Joining the guard))
			scenes.push(function() {
				Text.Add("<i>“Finally, I grew sick of the Hounds. One can only stand so much shit before seeking another line of work… but beating the crap out of people was kinda my thing. Still is. I looked around for something more… respectable, is perhaps the word.”</i> She doesn’t sound like she uses it very much. <i>“I found the guard. Marginally better, perhaps, but they pay well and I don’t have to feel guilty about the people I beat up.”</i>", parse);
				Text.NL();
				if(miranda.flags["bgRotMax"] == 5) {
					Text.Add("You hadn’t exactly suspected Miranda to have a conscience about the things she did, but the more you know.", parse);
					Text.NL();
				}
				Text.Add("<i>“With a nice little premium I got for joining, I was finally able to move out of the slums and back into the city proper. I kinda like my new place, it’s clean if nothing else. By that time, Belinda had already moved into the city, so there wasn’t really anything keeping me in that hovel anyways.”</i>", parse);
				Text.NL();
				if(miranda.flags["bgRotMax"] == 5) {
					Text.Add("You take note that she doesn’t mention where her sister got the money to do so, but you assume she would tell you if it was important.", parse);
					Text.NL();
				}
				Text.Add("<i>“Sure, it’s not very glamorous, but it’s about as good a job as a morph can get in this fucking town. Plus, it lets me do what I’m good at without me getting in trouble for it.”</i>", parse);
				Text.NL();
				Text.Add("Somehow you doubt that her career has been entirely without trouble. Call it a hunch.", parse);
				Text.NL();
				
				PrintDefaultOptions();
			});
			// ((Life in the guard))
			scenes.push(function() {
				Text.Add("<i>“I’ve been walking the streets of Rigard in uniform for years, cracking down hard on crime in this town,”</i> Miranda tells you, stretching languidly. <i>“Given my background, I’m privy to certain information most are not, namely an insight in how the lower layers of society <b>work</b> in this city. Makes me able to predict certain people’s behavior, and prevent any of their shenanigans. Or at the very least catch them in the act, so to speak.”</i> She grins. <i>“Always easier to slam them into a cell when they got a bag of loot slung over their shoulder. Makes people less likely to ask about why they’re walking funny too.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Rising to the upper ranks is pretty much impossible for someone like me; not that I’d want to be stuck pushing papers, mind you. If not for the fact that I’m a morph, I’m not a pushover who bends over backwards for every stupid order from above. Still, it keeps me just where I want to be, prowling the streets. They might think I’m difficult to handle, but I’m just too damn good at what I do to get rid of.”</i>", parse);
				Text.NL();
				Text.Add("<i>“The higher ups don’t like me, but I’ve got respect where it matters. Not to mention that my current comrades are a hell of a better sort than my previous ones. Some of them are even nice people. I don’t really mind having a bit of city-backed authority either.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I dunno what to say more, I think I’ll stick around with this for a while longer, don’t really have a reason to quit.”</i>", parse);
				Text.NL();
				
				PrintDefaultOptions();
			});
			if(miranda.Relation() >= 75) {
				// ((Belinda))
				scenes.push(function() {
					if(miranda.flags["bgRotMax"] == 7) {
						Text.Add("The guardswoman looks unusually thoughtful as she ponders where to pick up the story.", parse);
						Text.NL();
						Text.Add("<i>“Look, [playername], I haven’t been entirely honest with you. I think it’s time I tell you the whole story, without leaving out the bits about my sister. I rarely dwell on the past, and it’s a bit embarrassing, so I didn’t think it important. Thinking over things, I can’t really tell my story without it, though.”</i>", parse);
						Text.NL();
					}
					Text.Add("<i>“Like I said, both me and Bel found new work once we grew up. I joined the mercs and left my sister with enough cash to scrape by. Whenever I visited her, she seemed to be doing just fine, but I heard some strange rumors going around about her hanging out with strange sorts, and disappearing for long periods of time.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Little Belinda had grown up into a beautiful flower, and while I had been away, someone had plucked her. Quite a few someones, actually. My little sister had gone into prostitution.”</i> Her voice is a mixture of many emotions; anger, bitterness and more than a little guilt. <i>“We had a big fight when I confronted her about it, and next time I returned to the city, she had moved inside the walls. It was around this time I finally gave up on the Hounds and decided to join the guard.”</i>", parse);
					Text.NL();
					Text.Add("<i>“I… don’t really talk to my sister anymore. She’s working at some fancy brothel in the inner city and at least seems relatively well off.”</i> Miranda sighs. <i>“I guess I don’t really get her, talking to her just gets frustrating… least I can do is keep the streets clean.”</i>", parse);
					Text.NL();
					Text.Add("The dobie seems to have turned rather melancholy, and trails off.", parse);
					Text.NL();
					
					PrintDefaultOptions();
				});
				// ((Her feelings))
				scenes.push(function() {
					Text.Add("<i>“To be honest, I’m not sure what else to tell you,”</i> the dog-morph confesses. <i>“Spilling the beans about Belinda isn’t something I usually do with people, just so you know. Not that it’s a secret, exactly, but I never bring it up. And if they bring it up? Most likely it’ll earn them a punch in the face.”</i>", parse);
					Text.NL();
					Text.Add("<i>“It’s… frustrating, sure, but in the end she’s her own woman and can make her own decisions. She’s sure as hell better off than I am, in either case. I’m not entirely sure what I was thinking when I joined the guard; perhaps I wanted to clean up the streets to keep my little sister safe, but that isn’t really an issue anymore.”</i>", parse);
					Text.NL();
					Text.Add("<i>“I guess that as long as I can do what I like doing - drinking, fighting and having sex - it doesn’t really matter what job I have.”</i> She scratches her head. <i>“Well, this got all reflective and shit. Not really what I intended. Up for some of that sex perhaps?”</i>", parse);
					Text.NL();
					
					PrintDefaultOptions();
				});
			}
		}
	}
	
	var sceneId = miranda.flags["bgRot"];
	if(sceneId >= scenes.length) sceneId = 0;
	
	miranda.flags["bgRot"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	if(miranda.flags["bgRotMax"] < sceneId)
		miranda.flags["bgRotMax"] = sceneId;
}
Scenes.Miranda.TalkConquests = function(atBar) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("<i>“You’d like to hear about some of my lovers? I don’t really mind but… wouldn’t you feel jealous?”</i> she asks, grinning suggestively. You assure her that you wouldn’t. <i>“Who to talk about then… so many to choose from.”</i>", parse);
	Text.NL();
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		Text.Add("<i>“Remember when I told you about my first time? This would be back in the slums, before I joined the mercs. I was working down by the docks, hauling crates onto ships and so on. He was a cabin boy about my age on one of the ships that pulled in - pretty little thing too - so he wasn’t aware of my ‘extras’.”</i> She grins wolfishly.", parse);
		Text.NL();
		Text.Add("<i>“It was really nice to have someone hit on me for a change. The ship came in from the free cities, so he didn’t really have anything against morphs. Not against cocks either, as it turned out. Well, I had to persuade him a bit, but he eventually came around to seeing things my way. We tried many things together, but I found myself liking pitching way more than I did receiving.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Our thing didn’t last very long, as his ship returned home after a few weeks - I think they made a few short voyages out to the lake fishing or something. Doesn’t really matter. I wasn’t interested in why they were there anyways.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Pretty sure I had a large impact on him… if nothing else, I have fond memories of him. Couldn’t remember his name for the life of me though.”</i>", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	scenes.push(function() {
		Text.Add("<i>“After my first time, I kept a steady stream of girlfriends and boyfriends. I was hooked on sex, but I could never keep myself in a relationship very long. Perhaps I’m not cut out for them. Even when I stuck together with someone for a longer period of time, I had flings on the side.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Wasn’t very long until I had my first threesome. Actually, there was a girl I had been fucking for a while - a cute catgirl, but a real beast in bed. I caught her cheating on me with some boy, and much to their surprise, rather than being angry with them, I joined in.”</i>", parse);
		Text.NL();
		Text.Add("The herm sighs, reminiscing of better times. <i>“Kept them up most of the night too; and when we had fucked the kitty silly for hours, using just about every hole she had, I switched over to her boyfriend.”</i> She gives you an evil grin. <i>“Neither of them were walking right the next day, let me tell you.”</i>", parse);
		Text.NL();
		Text.Add("And tell you she does, at some length and with flowery detail.", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	scenes.push(function() {
		Text.Add("<i>“I’m usually quite forward about my sexuality, domineering even. It took quite a while until I really let someone else lead… not until I had joined the mercs.”</i> She sees your look and waves it off. <i>“No, not one of the Hounds. We were out on a mission to one of the free cities; don’t remember which one. I think it had a port.”</i>", parse);
		Text.NL();
		Text.Add("<i>“We had just pushed back a party of raiders, and had captured their leader. He was a minotaur of some kind - damn he was a big fellow, and in more ways than one! The elders wanted to throw him in prison, but I thought that it would be a waste… I had talked to him on the way back to the city, ”</i> Miranda explained. <i>“He wasn’t such a bad sort, really. He and his tribe had been driven out of the mountains, and were just trying to survive. He was quite impressed by the beating I had given him, and told me as much.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Since he was my catch, the others didn’t complain when I told the town elders to fuck off and kept him for myself instead. Having suffered public defeat, he had no reason to go back to his tribe, so he decided to follow the one who had beaten him instead. Man, what a beast tho!”</i> she whistles in appreciation. <i>“Our nights were like battles unto themselves, even I had trouble keeping him in check. I was quite surprised when he managed to overpower me and bend me over on all fours, shoving that immense cock of his into my poor pussy. My ass too, actually, he liked to experiment.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I found myself going easy on him on purpose, just to see what it felt like to be the one being dominated, for once. Can’t say that I didn’t enjoy being filled by a stud like him… not that it prevented me from returning the favor on occasion.”</i>", parse);
		Text.NL();
		Text.Add("<i>“We parted ways when our party eventually returned to Rigard. I assume he returned to the mountains to try and create a new tribe.”</i>", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	scenes.push(function() {
		
		parse["foxvixen"] = terry.mfPronoun("fox", "vixen");
		parse = terry.ParserPronouns(parse);
		
		Text.Add("<i>“My promiscuity hasn’t exactly decreased since I joined the watch.”</i> Somehow, that seems an understatement. Had she been even hornier when she was younger, you doubt she would’ve been able to function. <i>“Being the law in town has its perks… I’ve let more than one criminal off easy in exchange for a few favors.”</i>", parse);
		Text.NL();
		Text.Add("She studies your reaction to this. <i>“Understand, I’m not going around letting murderers loose for blowjobs. I wouldn’t release anyone dangerous… but I’ve found that a thorough reaming provides <b>much</b> more incentive for a thief to stay on the right side of the law than a small fine. That, and they know that <b>I</b> know how to find them again.”</i>", parse);
		Text.NL();
		
		if(miranda.FuckedTerry()) {
			if(atBar && party.InParty(terry)) {
				Text.Add("<i>“Speaking of… you’ve been keeping in line lately, haven’t you, pet?”</i> Miranda throws Terry a wide grin. <i>“No minor transgression you’d like to confess to?”</i>", parse);
				Text.NL();
				if(terry.Slut() >= 60) {
					Text.Add("Much to your surprise, the [foxvixen] just shrugs with a smirk. <i>“A lousy lay like yourself couldn’t hope to satisfy me. Takes someone better to keep me in check.”</i>", parse);
					Text.NL();
					Text.Add("<i>“That a challenge, slut?”</i> Miranda shoots back, an evil glint in her eye.", parse);
					Text.NL();
					Text.Add("Terry glares right back at her. <i>“Maybe. Maybe I should give you some ‘corrective measures’.", parse);
					if(terry.HorseCock())
						Text.Add(" Bet you could use a real dick up your ass to replace the stick that’s firmly lodged inside. And I have more than enough meat for a lapdog like yourself.”</i>", parse);
					else if(terry.FirstCock())
						Text.Add(" Bet you don’t get any action on your girl-parts, that’s why you’re so grumpy. But fear not, I can loosen that tight cunt of yours for you.”</i>", parse);
					else
						Text.Add("”</i>", parse);
					Text.NL();
					Text.Add("<i>“You seem to be having some miscomprehension about who’s going to nail whom, fucktoy,”</i> Miranda retorts, giving her package a pat. <i>“Remember how it went down the last time you tried to fight me?”</i>", parse);
					Text.NL();
					Text.Add("<i>“Ha! That was two on one. This time it’d be just you and me. I can dance circles around and have you knocked on your pretty ass before you could think to strike!”</i> the [foxvixen] boasts proudly.", parse);
				}
				else {
					Text.Add("The [foxvixen] ears flatten as [heshe] growls at the doberman. <i>“What I do or don’t do is none of your business, dirty lapdog!”</i> [heshe] barks at her. It’s clear that [heshe]’s still not over the fact Miranda had [hisher] way with [himher].", parse);
					Text.NL();
					Text.Add("<i>“If you do it in <b>my</b> city, it is <b>my</b> business,”</i> the guardswoman retorts, <i>“and you can expect to be on the receiving end of <b>my</b> cock. Not that I’m sure you’d take it as punishment.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Figures that the only thing you’re good for is as a walking prick. You couldn’t even catch me on your own last time, what makes you think you’d have a chance against me? Plus last time I checked, you’re just a lowly watch-dog. The ones really running this town are the Royal Guards,”</i> Terry shoots back with a defiant glare.", parse);
				}
				Text.NL();
				Text.Add("<i>“Yip yip says the little pet,”</i> Miranda shrugs. <i>“Run that mouth for long enough and I’ll give it something better to do.”</i>", parse);
				Text.NL();
				Text.Add("Seriously, just get a room you horny canines...", parse);
				Text.NL();
				Text.Add("You stop Terry before [heshe] has a chance to talk back. It’s best if [heshe] doesn’t try, because you know Miranda will keep her end of the bargain, and Terry has no chance while [heshe]’s still wearing that collar.", parse);
			}
			else {
				Text.Add("<i>“Case in point, Terry,”</i> Miranda stretches luxuriously. <i>“[HeShe]’s been nice and pliant since I had a go at [himher], no?”</i>", parse);
				Text.NL();
				Text.Add("You think that she’s probably not the only reason for that, but keep the observation to yourself.", parse);
				Text.NL();
				Text.Add("<i>“Just tell me if the little [foxvixen] starts acting tough, I’ll set [himher] straight again.”</i>", parse);
			}
			Text.NL();
		}
		else if(atBar && party.InParty(terry)) {
			parse["thimher"] = terry.mfTrue("him", "her");
			Text.Add("<i>“I’m sure your little foxy friend could attest to the effectiveness of my methods, if you’d let me educate [thimher],”</i> Miranda adds, grinning wolfishly at Terry.", parse);
			Text.NL();
			Text.Add("<i>“In your dreams, lapdog!”</i> Terry replies. <i>“You might’ve had me back then, but that was two on one. If it’s just you, I can run circles around you.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Run all you want, pet, I got more stamina than you do. Besides, I’ll have that tight butt bobbing in front of me to keep me motivated,”</i> Miranda shoots back, unconcerned.", parse);
			Text.NL();
			Text.Add("Terry growls at Miranda, surprisingly brave despite [hisher] predicament and the doberman’s obvious superiority in both height and strength. Seem like [heshe]’s forgetting that with that collar around [hisher] neck, any attempt at running would just wind up [himher] getting caught.", parse);
			Text.NL();
			Text.Add("The guardswoman just laughs, taking another swig at her drink. <i>“You call me a lapdog, yet I only see one of us wearing a collar.”</i>", parse);
			Text.NL();
			Text.Add("You intervene before the [foxvixen] has a chance to talk back, telling [himher] to stand down before [heshe] gets in trouble. ", parse);
			
			var dom = miranda.SubDom() - player.SubDom();
			
			if(dom < -25)
				Text.Add("Same goes for Miranda, if she keeps provoking Terry, you’ll have to punish her.", parse);
			else if(dom < 25)
				Text.Add("Terry is under your protection now, so you’d really appreciate if Miranda didn’t push [hisher] buttons.", parse);
			else
				Text.Add("You give the dommy dobie a pleading look, hoping she’ll let Terry off the hook.", parse);
			Text.NL();
			Text.Add("<i>“Right, right, don’t get your panties tied up in a bunch,”</i> Miranda replies, shrugging.", parse);
			Text.NL();
		}
		else if(terry.flags["Met"] >= Terry.Met.Caught) {
			var req = terry.flags["Saved"] >= Terry.Saved.Saved;
			parse["t"] = req ? " - Terry, was it" : "";
			Text.Add("<i>“Case in point, remember that thief that we caught[t]?”</i> You nod. <i>“No one really gives a shit about Krawitz; he’s a small time noble without any real influence. He doesn’t exactly have a clear conscience himself, considering the things that were found when searching his mansion. I only intended to show him some… corrective action, perhaps throw him in a cell for a few days as payback for that note. That’d make sure he didn’t stir up trouble in my city again. The little fox would’ve been far better off in my care than in that of the Royal Guard, believe me.”</i>", parse);
			Text.NL();
			if(req)
				Text.Add("You’re not sure Terry would agree with that, but you let it slide. To be sure, he wasn’t in a very happy place when you let him out of prison, but you aren’t sure if he’d be much happier being fucked by Miranda for days on end.", parse);
			else
				Text.Add("You aren’t really sure if the fox would agree to that. Then again, if what she’s saying is true, he wouldn’t be locked in jail right now - potentially on death row.", parse);
			Text.NL();
		}
		Text.Add("<i>“It’s a peculiar kind of justice, for sure, but it works.”</i> Somehow, you suspect that Miranda is overstating her exploits at bit; if nothing else, you are really doubtful that anyone would let her keep her job for this long if she went around and raped the entire underworld of Rigard on a regular basis.", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	/* TODO
	scenes.push(function() {
		Text.Add("", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	*/
	Scenes.Miranda.DatingScore++;
	player.AddLustFraction(0.3);
	
	var sceneId = miranda.flags["ssRot"];
	if(sceneId >= scenes.length) sceneId = 0;
	
	miranda.flags["ssRot"] = sceneId + 1;
	
	if(miranda.flags["ssRotMax"] < sceneId)
		miranda.flags["ssRotMax"] = sceneId;
	
	// Play scene
	scenes[sceneId]();
}

// HOMECOMING
//TODO
Scenes.Miranda.DatingStage3 = function() {
	var dom = miranda.SubDom() - player.SubDom();
	
	var parse = {
		playername : player.name,
		stud : dom >= 50 ? player.mfTrue("master", "mistress") : player.mfTrue("stud", "beautiful")
	};
	
	world.TimeStep({hour: 1});
	
	if(Scenes.Miranda.DatingScore > 1) {
		Text.Add("<i>“Mm… I can’t wait to get my paws on you, sexy,”</i> Miranda purrs. <i>“Get inside, [stud]! This doggie’s got a bone for you to pick. Any way you want to roll, I’ll roll.”</i>", parse);
		Text.Flush();
		
		//[Take charge][Passive][Decline]
		var options = new Array();
		options.push({ nameStr : "Take charge",
			func : function() {
				Text.Clear();
				Text.Add("You catch the surprised Miranda in a deep kiss, fumbling with the door as you grope her. You twirl her around, giving her crotch a familiar grope before you push her into the house, closing the door behind you.", parse);
				
				miranda.relation.IncreaseStat(50, 2);
				
				Scenes.Miranda.HomeDommySex();
			}, enabled : miranda.SubDom() - (miranda.Relation() + player.SubDom()) < 0,
			tooltip : "You can’t wait to get a piece of her."
		});
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("<i>“In a subby mood today, pet?”</i> Miranda grins as you let yourself be led inside, pushing you through the open doorway. <i>“That’s how I like them.”</i> You can feel her stiff member poking you in the back, and suspect you might get into even closer contact with it shortly.", parse);
				
				miranda.relation.IncreaseStat(60, 2);
				
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Let Miranda call the shots."
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>“That’s really a shame,”</i> Miranda pouts. <i>“Now how am I going to keep concentration on patrol tomorrow? Not even a quickie?”</i>", parse);
				Text.NL();
				Text.Add("You shake your head, saying your goodbyes. The herm heads back inside, probably making a beeline for her toy collection. ", parse);
				if(party.Alone()) {
					Text.Add("You are left standing in the street, wondering what to do next.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}
				else {
					parse["name"]   = party.Two() ? party.Get(1).name     : "your party";
					parse["himher"] = party.Two() ? party.Get(1).himher() : "them";
					Text.Add("First, you need to rendezvous with [name]. You make your way outside the inner walls and meet up with [himher] outside the dingy old tavern.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
					});
				}
			}, enabled : true,
			tooltip : "Not tonight."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else if(Scenes.Miranda.DatingScore >= -1) {
		Text.Add("<i>“You gotta step up your game, [playername]. Tell you what, you still have a shot at saving this date. It involves you, wrapped around my cock,”</i> the dommy herm gives you a sly grin.", parse);
		Text.Flush();
		
		//[Passive][Decline]
		var options = new Array();
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("You let yourself be led inside, pushed through the open door with Miranda close in tow. You can feel her stiff member poking you in the back, and suspect you might get into even closer contact with it shortly.", parse);
				
				miranda.relation.IncreaseStat(60, 1);
				
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Follow her lead."
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>“If that’s the way you want it, fine. Come see me at the bar when you change your mind.”</i> With that, she turns and slams the door behind her, leaving you on the street outside.", parse);
				miranda.relation.DecreaseStat(0, 1);
				
				if(party.Alone()) {
					Text.Flush();
					Gui.NextPrompt();
				}
				else {
					parse["name"]   = party.Two() ? party.Get(1).name     : "your party";
					parse["himher"] = party.Two() ? party.Get(1).himher() : "them";
					Text.NL();
					Text.Add("First, you need to rendezvous with [name]. You make your way outside the inner walls and meet up with [himher] outside the dingy old tavern.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
					});
				}
			}, enabled : true,
			tooltip : "...No."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“I have something <b>very</b> special in mind for you tonight, my little slut,”</i> Miranda growls through a grin that’s all teeth. <i>“I’m going to give you a ride your body isn’t likely to forget for weeks… are you coming?”</i>", parse);
		Text.Flush();
		
		//[Follow][Decline]
		var options = new Array();
		options.push({ nameStr : "Follow",
			func : function() {
				Text.Clear();
				Text.Add("You back away, shaking your head. ", parse);
				if(miranda.flags["subCellar"] != 0) {
					Text.Add("…It’s probably nothing, you tell yourself. And you are about to score, all right! Miranda leads you inside, smiling encouragingly. You have a few moments to look around the room before the floor rushes to meet you, and everything goes black.", parse);
				}
				else {
					Text.Add("Gulping, you meet her eyes and nod. There is a flicker of surprise in Miranda’s expression, quickly replaced by a wide predatory grin as she invites you inside. You both know what’s going to happen next.", parse);
					miranda.relation.IncreaseStat(60, 2);
				}
				Text.Flush();
				
				Scenes.Miranda.HomeSubbyDungeon();
			}, enabled : true,
			tooltip : miranda.flags["subCellar"] != 0 ? "You know very well what’s going to happen… and you look forward to it." : "Sure... what could go wrong?"
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				if(miranda.flags["subCellar"] != 0)
					Text.Add("You’re not going back into her cellar again, no way!", parse);
				else
					Text.Add("You’re not really sure what she’s up to, but it’s bound to be bad news for you.", parse);
				Text.NL();
				Text.Add("<i>“Spoilsport,”</i> Miranda grunts, stepping inside and shutting the door behind her as you book it.", parse);
				
				miranda.relation.DecreaseStat(0, 2);
				
				if(party.Alone()) {
					Text.Flush();
					Gui.NextPrompt();
				}
				else {
					parse["name"]   = party.Two() ? party.Get(1).name     : "your party";
					parse["himher"] = party.Two() ? party.Get(1).himher() : "them";
					Text.NL();
					Text.Add("First, you need to rendezvous with [name]. You make your way outside the inner walls and meet up with [himher] outside the dingy old tavern.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
					});
				}
			}, enabled : true,
			tooltip : "It’s a trap! Flee!"
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

Scenes.Miranda.DatingFirstDocks = function() {
	
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Slums.docks;
	world.TimeStep({minute: 20});
	
	Text.Add("Leaving the small garden behind, the two of you head down a well-trodden road, not quite deserted, even at this hour. After a while, you begin to notice the smell of brine and fish, as your steps takes you closer to the dock area. There are large crates lining the sides of large warehouses, mostly empty but sure to be filled with a new catch the next morning. Along the riverside, a minor fleet of small fishing boats lie tied.", parse);
	Text.NL();
	Text.Add("<i>“Fish is a major food supply for Rigard,”</i> Miranda explains. <i>“Not only that, but the river provides other treasures.”</i> She points toward a larger barge moored near a giant warehouse, bustling with activity. <i>“It is one of the safer ways to reach the other nations on Eden, and the ocean cities. Traders make regular journeys there, though with the recent surge in attacks from outlaws, they need to hire escorts.”</i>", parse);
	Text.NL();
	Text.Add("The guardswoman looks to be in her element. <i>“I used to run around here all the time when I was a kid, talking with the sailors and exploring abandoned warehouses. Such good adventures!”</i>", parse);
	Text.Flush();
	
	//[Polite][Rude][Sultry]
	var options = new Array();
	options.push({ nameStr : "Polite",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Hey, you making fun of me?”</i> Miranda growls playfully, nudging you. <i>“I know it doesn’t look like much, but for a kid, there was so much to see and learn. The sailors may seem a bit rough around the edges, but they had much to teach.”</i>", parse);
			Text.NL();
			Text.Add("She certainly seems to have picked up their language.", parse);
			Text.NL();
			
			miranda.relation.IncreaseStat(100, 2);
			Scenes.Miranda.DatingScore++;
			
			Scenes.Miranda.DatingFirstMercs();
		}, enabled : true,
		tooltip : "Seems like a nice place to grow up."
	});
	options.push({ nameStr : "Rude",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Well… true,”</i> Miranda grudgingly admits. <i>“Still, it’s not that bad. For a little eight-year old, this place was cool as fuck.”</i>", parse);
			Text.NL();
			Scenes.Miranda.DatingFirstMercs();
		}, enabled : true,
		tooltip : "It stinks of fish and worse."
	});
	options.push({ nameStr : "Sultry",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Hey… I think of things other than sex, you know.”</i> Miranda frowns at you. <i>“’Sides, I was just a kid at the time.”</i> Seems like you upset her a bit.", parse);
			Text.NL();

			miranda.relation.DecreaseStat(-100, 2);
			Scenes.Miranda.DatingScore--;
			
			Scenes.Miranda.DatingFirstMercs();
		}, enabled : true,
		tooltip : "You’re sure she had some ‘adventures’ here, alright."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Miranda.DatingFirstMercs = function() {
	var parse = {
		
	};
	
	world.TimeStep({minute: 20});
	
	Text.Add("<i>“I mentioned escorts, didn’t I?”</i> Miranda murmurs thoughtfully. <i>“Which brings us to this place.”</i> You are standing before a large two-story building at the edge of the docks district, far enough away from it to alleviate the smell slightly, but close enough to have the local water holes within close distance. It looks to be in relatively good shape for the slums, though the thick wooden door is marred with what looks like sword slashes.", parse);
	Text.NL();
	Text.Add("<i>“This is home to one of the larger mercenary guilds in Rigard, the Black Hounds. I used to work for them, before I became all nice and proper.”</i> Proper? What was she like before? <i>“As you can see, it’s a rough business. Pay is decent and you get to travel a lot though. All in all, this building probably holds some of the worst scum Rigard has to offer.”</i> You can tell that she means it, but there is a small touch of fondness and pride in her voice.", parse);
	Text.Flush();
	
	//[Polite][Rude][Sultry]
	var options = new Array();
	options.push({ nameStr : "Polite",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Nice?”</i> Miranda scoffs. <i>“Did you listen to a word I just said? This place is a cesspool for the lowest criminal scum in the city, anyone who can handle a weapon is welcome to join. Only reason they didn’t try to rape the pretty young doggie’s brains out when she entered was that I had already gotten a bit of a reputation at that point. Anyone brave enough to assault me would end up with a broken arm or two, and be unable to sit properly for a few weeks. I was strong, even back then.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I was glad to leave this shithole behind when better opportunities opened up.”</i>", parse);
			Text.NL();
			
			miranda.relation.DecreaseStat(-100, 1);
			Scenes.Miranda.DatingScore--;
			
			Scenes.Miranda.DatingFirstCity();
		}, enabled : true,
		tooltip : "How come she left if this is such a nice place?"
	});
	options.push({ nameStr : "Rude",
		func : function() {
			Text.Clear();
			Text.Add("<i>“My thoughts exactly. It was nice work. Shame about the crowd I had to hang with though.”</i> There is a wicked smile playing on Miranda’s lips. <i>“I still bump into some of them these days, but usually in work-related matters. Being the law has its perks at times.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Let’s ditch this place anyways, I got better things to do than chat about the old days.”</i>", parse);
			Text.NL();
			
			miranda.relation.IncreaseStat(100, 3);
			Scenes.Miranda.DatingScore++;
			
			Scenes.Miranda.DatingFirstCity();
		}, enabled : true,
		tooltip : "What a dungheap."
	});
	options.push({ nameStr : "Sultry",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Very funny, asshole,”</i> she chuckles. <i>“True, though. Not much else to do between missions. Of course, I gave as much as I took, if not more.”</i> The guardswoman looks thoughtful.", parse);
			Text.NL();
			Text.Add("<i>“Then there was the matter of the reward for finished jobs. Coming from the slums, I didn’t really have a good hand with money anyways, so I tended to accept substitutes at times.”</i> She grins widely at your raised eyebrow. <i>“Got problems with bandits? I’ll fuck them up. Then I’ll come back and fuck you… probably a lot more and a lot rougher than you were hoping for.”</i>", parse);
			Text.NL();
			
			miranda.relation.IncreaseStat(100, 1);
			
			Scenes.Miranda.DatingFirstCity();
		}, enabled : true,
		tooltip : " Lots of travel with a rowdy band of thugs? So she’s been around, so to speak?"
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Miranda.DatingFirstCity = function() {
	var parse = {
		boyGirl : player.mfTrue("boy", "girl"),
		tongueDesc : function() { return player.TongueDesc(); },
		breastDesc : function() { return player.FirstBreastRow().Short(); }
	};
	
	party.location = world.loc.Rigard.Residential.street;
	world.TimeStep({minute: 20});
	
	Text.Add("<i>“Seen enough of the slums to last you for tonight?”</i> The two of you are nearing the outer walls of Rigard, close to the peasants’ gate. ", parse);
	if(rigard.Visa()) {
		if(miranda.Attitude() < Miranda.Attitude.Neutral)
			Text.Add("<i>“That piece of paper they give you won’t help at this hour, but I know a way.”</i> Miranda grins. <i>“’Course, if we run into a patrol, you are on your own buddy.”</i>", parse);
		else
			Text.Add("<i>“You have a pass, right? Not that it matters at this hour. Don’t worry, we’ll use a back gate, bypass the security.”</i>", parse);
	}
	else {
		if(miranda.Attitude() < Miranda.Attitude.Neutral)
			Text.Add("<i>“You’ll be an interloper, prowling around town illegally,”</i> Miranda almost purrs, a dangerous glint in her eyes. <i>“One could say you are at my mercy...”</i>", parse);
		else
			Text.Add("<i>“I’ll sneak you in. Don’t worry about the guards, I know a gate that isn’t guarded at this time.”</i>", parse);
	}
	Text.Add(" The guardswoman seems excited as she covertly leads you through a small inconspicuous door - one which you would have never found on your own. A short twisting tunnel later, you make your way into the inner city.", parse);
	Text.NL();
	Text.Add("<i>“One of the perks of working for the city watch is that I can afford a house inside the walls. Saves me from most of the regular thugs and thieves that prowl the slums. Then again, the inner city houses a different class of thugs and thieves. Worst of em all up there.”</i> The herm points to the castle looming atop the hill at the center of the city.", parse);
	Text.NL();
	Text.Add("<i>“It ain’t easy to get a posh job in a town like this as a morph, but I happen to be very good at what I do. And what I do is take out the trash.”</i> She flashes an evil grin full of sharp, pointy teeth. <i>“’Course, someone like me could never get work as an officer. Not that I’d want to sit at a desk pushing papers all day anyways.”</i>", parse);
	Text.NL();
	if(DEBUG) {
		Text.Add("<b>TOTAL SCORE: [x]</b>", {x: Scenes.Miranda.DatingScore});
		Text.NL();
	}
	
	if(rigard.Visa()) {
		Text.Add("The two of you wander through the town, heading toward the residential district. Miranda points out a few local watering holes, and some places that serve decent food.", parse);
		Text.Flush();
		
		Gui.NextPrompt(Scenes.Miranda.DatingFirstHome);
	}
	else {
		if(miranda.Attitude() < Miranda.Attitude.Neutral) {
			if(Scenes.Miranda.DatingScore > 0) {
				Text.Add("<i>“Listen, I might have been a bit harsh on you before,”</i> Miranda grudgingly admits. <i>“I don’t take negative feedback very well… You think I could make it up to you by getting you a city visa? The procedure is rather quick. We can save the fun stuff for later.”</i> She smiles, winking at you.", parse);
				
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
			}
			else {
				Text.Add("<i>“Now I’ve got you here, deep within the city and without a visa,”</i> Miranda grins evilly at you. <i>“Wouldn’t it just be a shame if one of the guards caught word of this? A good thing you have such a <b>nice</b> friend as me helping you out, isn’t it?”</i>", parse);
			}
		}
		else { // Nice
			if(Scenes.Miranda.DatingScore < 0) {
				Text.Add("<i>“I had planned on getting you a city visa while we were here, but I’ve been thinking,”</i> Miranda tells you bluntly. <i>“I’m not really impressed by your performance so far. Frankly, I think you’re a bit of an ass. You can still salvage this if you want to, though.”</i>", parse);
			}
			else {
				Text.Add("<i>“While we are passing through, I’ll help you get a city visa. It’ll allow you to pass the guards into the city any time you want. The procedure is rather quick. We can save the fun stuff for later.”</i> She smiles, winking at you.", parse);
			}
		}
		Text.NL();
		Text.Add("The two of you arrive at a small booth, manned by a bored-looking city official. A sign beside it announces it as a city identification office. You find it rather curious that it would be open at this hour, but shrug it off as an oddity of the city administration.", parse);
		Text.NL();
		if(miranda.Attitude() >= Miranda.Attitude.Neutral && Scenes.Miranda.DatingScore >= 0) {
			Text.Add("The guardswoman explains that she’s brought you here to get you a pass, and that she’ll vouch for you. The administrator eyes you curtly, disapproval clear in his furrowed brow. In the end you get your pass, though it takes some time for all the necessary papers to be filled out.", parse);
			Text.NL();
			Text.Add("<b>Acquired citizen’s visa!</b>");
			rigard.flags["Visa"] = 1;
			Text.NL();
			Text.Add("<i>“Now, be sure to come visit often,”</i> your friendly guide urges you. <i>“Lets head somewhere more… comfortable, shall we?”</i>", parse);
			Text.Flush();
			
			Gui.NextPrompt(Scenes.Miranda.DatingFirstHome);
		}
		else { // nasty or bad score
			Text.Add("Rather than leading you to the booth, Miranda pulls you into a nearby alleyway. She steps in close, trapping you with her full breasts, a dangerous glint in her eyes.", parse);
			Text.NL();
			Text.Add("<i>“Now, listen close. If you’d like me to do you this favor, you’d better do <b>me</b> a favor.”</i> the herm grabs hold of your hand and moves it to her crotch. You can feel her thick cock straining against the leather of her pants.", parse);
			Text.NL();
			if(miranda.Attitude() >= Miranda.Attitude.Neutral && Scenes.Miranda.DatingScore < 0) {
				Text.Add("<i>“Last chance to get on my good side, [boyGirl],”</i> she whispers through clenched teeth, grinding against you. <i>“Get down on your knees and suck like a good little slut, and all is forgiven.”</i>", parse);
			}
			else {
				Text.Add("<i>“You know what I want, my little slut,”</i> she whispers through clenched teeth, grinding against you. <i>“If you ever hope to get that visa, why don’t you try to convince me of your good intentions? Don’t bother with words, your mouth can be put to far better use.”</i>", parse);
			}
			Text.Flush();
			
			//[Blow her][Fuck no]
			var options = new Array();
			options.push({ nameStr : "Blow her",
				func : function() {
					Text.Clear();
					Text.Add("<i>“That’s the spirit,”</i> Miranda purrs as you lower yourself into position. <i>“Swallow your pride. Swallow a lot more.”</i> As she’s talking, she undoes her britches, releasing her stiff red cock. You gulp, getting second thoughts. It looks a lot bigger up close…", parse);
					Text.NL();
					Text.Add("The dommy herm doesn’t give you a lot of time to contemplate your hastily made choice, quickly prying the pointed tip of her shaft past your lips. <i>“Now, suck!”</i> Not that you have much say in the matter. She inches her cock further in, leaving a trail of salty pre along your [tongueDesc]. Though you can sense that she’s eager to go all out and fuck your throat, she eases up, letting you do the work.", parse);
					Text.NL();
					
					Sex.Blowjob(player, miranda);
					miranda.Fuck(miranda.FirstCock(), 2);
					player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
					
					Text.Add("You dutifully bob your head up and down Miranda’s dick, struggling slightly with her girth. <i>“Yeees, keep it up my little slut. You do want your reward, don’t you? Suck that cock like you mean it!”</i> She keeps up a steady stream of mocking commentary, a bit louder than necessary. You suddenly realize that considering how close you are, the administrator can probably hear everything that she’s saying.", parse);
					Text.NL();
					Text.Add("<i>“Feel how it throbs?”</i> the guardswoman moans softly, breathing heavily. <i>“I’ve got a big fat load stored up in these balls of mine, bet you want it, don’t you?”</i> She’s not lying. Her large sack is hot to the touch, her cream ready to shoot down your throat. Her shaft is rock hard, twitching as she approaches the height of pleasure. <i>“...Too bad for you!”</i>", parse);
					Text.NL();
					Text.Add("Before you have time to react, Miranda withdraws from your mouth, grabbing the back of your head with one hand and jerking herself off with the other. The first blast splashes onto your [tongueDesc], but the following stream is less discriminatory, drenching your face and splattering on your [breastDesc]. The herm rubs the last drops of cum off the tip of her cock on your cheek, before hastily pulling up her pants again.", parse);
					
					var mCum = miranda.OrgasmCum();
					
					Text.NL();
					Text.Add("Huffing slightly, Miranda pulls you out of the alleyway, smiling disarmingly at the city official as she drags you over to the booth. The guardswoman talks as if nothing is amiss, explaining that you need a visa and that she’ll vouch for you. When the flustered administrator starts to protest, she shows her identification as a member of the city watch, which speeds up the process considerably. From the burning in your cheeks, you are probably wearing a blush at least as deep as the clerk - though you doubt he can see it through the thick layer of cum dripping down your face.", parse);
					Text.NL();
					Text.Add("<b>Acquired citizen’s visa!</b>");
					rigard.flags["Visa"] = 1;
					Text.NL();
					Text.Add("<i>“Here you go, a city visa with Miranda’s compliments.”</i> The guardswoman hands over your prize, grinning mockingly. <i>“There is more where that came from too.”</i> Showing mercy on the poor official, she drags you off, heading toward the residential district. Swallowing your shame, you wipe off your face - though after this, you’ll need a long shower before you feel clean again.", parse);
					Text.Flush();
					
					Scenes.Miranda.DatingScore++;
					
					Gui.NextPrompt(Scenes.Miranda.DatingFirstHome);
				}, enabled : true,
				tooltip : "Fine, lets do this."
			});
			options.push({ nameStr : "Fuck no",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Your choice.”</i> She shrugs, stepping back. <i>“Just for your information, it was the wrong one.”</i> Looking disappointed, the guardswoman heads off, motioning for you to follow her. Still affronted, you follow her into the residential district.", parse);
					Text.Flush();
					
					Scenes.Miranda.DatingScore--;
					
					miranda.flags["Attitude"] = Miranda.Attitude.Hate;
					
					Gui.NextPrompt(Scenes.Miranda.DatingFirstHome);
				}, enabled : true,
				tooltip : "What does she think you are, a whore?"
			});
			Gui.SetButtonsFromList(options);
		}
	}
}

Scenes.Miranda.DatingFirstHome = function() {
	var parse = {
		guyGirl : player.mfTrue("guy", "girl"),
		playername : player.name
	};
	
	world.TimeStep({minute: 30});
	
	miranda.flags["Dates"]++;
	
	Text.Clear();
	Text.Add("After walking for a while longer, Miranda leads you down a cramped alleyway, stopping in front of a wooden doorway. Apparently, this is where the dog-morph lives. Your heart beats a bit faster.", parse);
	Text.NL();
	
	var options = new Array();
	
	if(Scenes.Miranda.DatingScore > 2) {
		Text.Add("<i>“All good nights come to an end, but this one doesn’t have to end here.”</i> Miranda looks at you suggestively. <i>“You are my kind of [guyGirl], [playername]. Would you like to come inside for a bit of fun?”</i>", parse);
		Text.Flush();
		
		//[Take charge][Passive][Decline]
		options.push({ nameStr : "Take charge",
			func : function() {
				Text.Clear();
				Text.Add("In response, you go in for a kiss, pushing the surprised woman inside. <i>“I wouldn’t do this for just anyone, you know,”</i> Miranda huffs, a faint blush visible on her cheeks. You close the door with your shoulder, glancing around the room.", parse);
				Scenes.Miranda.HomeDommySex();
			}, enabled : miranda.SubDom() - (miranda.Relation() + player.SubDom()) < 0,
			tooltip : "Heck yeah! Take her for a ride she won’t forget."
		});
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("You nod, smiling demurely and waiting for her to make a move. <i>“Just what I want to hear,”</i> Miranda grins as she pulls you inside, slamming the door behind you.", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Let her call the shots."
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You don’t know what you’re missing.”</i> Miranda gives you a kiss before seeing you off, adding: <i>“You know where to find me, should you change your mind. I had a good time tonight, [playername], I want to show you my appreciation...”</i>", parse);
				Text.NL();
				if(party.Alone())
					parse["comp"] = "";
				else if(party.Two()) {
					parse["comp"] = ", joining up with " + party.Get(1).name;
				}
				else
					parse["comp"] = ", joining up with your companions";
				Text.Add("You decide to leave the inner city[comp], returning to the slums for time being.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
				});
			}, enabled : true,
			tooltip : "Thank her for the evening, but politely decline her invitation."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(Scenes.Miranda.DatingScore >= -2) {
		Text.Add("<i>“I don’t know about you, but I’m up for a romp. How do you feel about biting the pillow for a few hours?”</i> For all of her nasty talk, you guess she still likes you enough to fuck you. Or perhaps she wants another chance to humiliate you, who knows.", parse);
		Text.Flush();
		
		//[Get fucked][Decline]
		var options = new Array();
		options.push({ nameStr : "Get fucked",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Of course you are.”</i> She grins as she pulls you inside, slamming the door behind her. <i>“Had you pinned for a bitch from the moment I saw you.”</i>", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "If she’s offering, you’re willing."
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You are no fun,”</i> she huffs, <i>“as if I wanted to hang out with you just for your company. Well, fuck off then.”</i> With that, she slams the door in your face. From what you can tell, she’s not used to being turned down.", parse);
				Text.NL();
				if(party.Alone()) {
					Text.Add("You are left standing in the street, wondering what to do next.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}
				else {
					parse["name"]   = party.Two() ? party.Get(1).name     : "your party";
					parse["himher"] = party.Two() ? party.Get(1).himher() : "them";
					Text.Add("First, you need to rendezvous with [name]. You make your way outside the inner walls and meet up with [himher] outside the dingy old tavern.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
					});
				}
			}, enabled : true,
			tooltip : "No thanks."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("<i>“You know, I think I’ve actually changed my mind about you,”</i> Miranda declares, smiling sweetly. <i>“I’ve had <b>such</b> a <b>good</b> time tonight, I’d just <b>love</b> to have you stay over.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I’m so horny right now,”</i> she breathes, pulling you close, <i>“get inside and make love to me, make me scream!”</i> Her cock is straining against her insufficient clothes, rubbing against your thigh.", parse);
		Text.NL();
		Text.Add("You’d have to be dead drunk, or perhaps straight up dead, to miss the malevolence in the herm’s eyes. This could end really badly…", parse);
		Text.Flush();
		
		//[Follow][Decline]
		var options = new Array();
		options.push({ nameStr : "Follow",
			func : function() {
				Text.Clear();
				Text.Add("…It’s probably nothing, you tell yourself. And you are about to score, all right! Miranda leads you inside, smiling encouragingly. You have a few moments to look around the room before the floor rushes to meet you, and everything goes black.", parse);
				Scenes.Miranda.HomeDommyDungeonFirst();
			}, enabled : true,
			tooltip : "She is begging for it. After all, what could she do, knock you out and tie you up in her cellar?"
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Well this was a lousy day,”</i> Miranda grumbles. <i>“Ditched on my own doorstep. Well, fuck you too.”</i> She slams the door in your face, leaving you alone on the street. That could have gone better, you suppose. You’re just about to walk off, a bit unfamiliar with the neighborhood, when you hear a bell ringing loudly. Glancing up, you see that Miranda is watching you from her window, grinning widely as she clangs a small brass bell.", parse);
				Text.NL();
				Text.Add("<i>“Bit of a send-off gift,”</i> she purrs. <i>“I’d say the guard will be here in a minute or two. You still got a bit of a head start, if you don’t want to spend the night in a cell.”</i> ", parse);
				if(rigard.Visa())
					Text.Add("Even if you’ve done no wrong, better not take the chance of having to put your word against hers. You suspect the guards would be rather biased on the point.", parse);
				else
					Text.Add("Shit! You realize that since you don’t have a visa, the guards could well lock you up for wandering the city.", parse);
				Text.NL();
				Text.Add("Deciding that the best thing to do at the moment is to leg it, you leave the laughing dog behind, heading for the gates. It takes a bit of weaving into cramped alleyways to avoid your pursuers, but you are somehow able to find the door you entered through, and make your way outside the walls.", parse);
				Text.NL();
				Text.Add("Back in the relative safety of the slums, you allow yourself to rest for a bit. Most likely the exit you used will be locked or better guarded from now on.", parse);
				if(!party.Alone()) {
					parse["name"]   = party.Two() ? party.Get(1).name     : "your companions";
					parse["himher"] = party.Two() ? party.Get(1).himher() : "them";
					Text.Add(" You are able to reunite with [name] shortly after, though you don’t feel particularly inclined to tell [himher] about tonight’s escapades.", parse);
				}
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
				});
			}, enabled : true,
			tooltip : "You are getting seriously bad vibes here, better get out while you still can."
		});
		Gui.SetButtonsFromList(options);
	}
}
