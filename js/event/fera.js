/*
 * 
 * Define Fera
 * 
 */
import { Entity } from '../entity';
import { GetDEBUG } from '../../app';
import { Gender } from '../body/gender';

let FeraScenes = {};

function Fera(storage) {
	Entity.call(this);
	this.ID = "fera";

	// Character stats
	this.name = "Fera";
	
	// TODO: Set body
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 6;
	this.Butt().buttSize.base = 4;
	this.body.SetRace(Race.Feline);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Feline, Color.brown);
	
	this.flags["Met"] = 0;
	this.flags["Mom"] = 0;
	this.flags["Blowjob"] = 0;
	this.flags["Standing"] = 0;
	this.flags["Behind"] = 0;
	this.flags["Anal"] = 0;
	
	this.nexelleTimer = new Time();
	this.shopTimer    = new Time();
	this.cityTimer    = new Time();
	this.fondleTimer  = new Time();
	this.timeout      = new Time();

	if(storage) this.FromStorage(storage);
}
Fera.prototype = new Entity();
Fera.prototype.constructor = Fera;

Fera.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	
	this.nexelleTimer.Dec(step);
	this.shopTimer.Dec(step);
	this.cityTimer.Dec(step);
	this.fondleTimer.Dec(step);
	this.timeout.Dec(step);
}

Fera.prototype.FromStorage = function(storage) {
	this.Butt().virgin     = parseInt(storage.avirgin) == 1;
	this.FirstVag().virgin = parseInt(storage.virgin)  == 1;
	
	this.LoadPersonalityStats(storage);
	
	this.nexelleTimer.FromStorage(storage.nexTim);
	this.shopTimer.FromStorage(storage.shopTim);
	this.cityTimer.FromStorage(storage.cityTim);
	this.fondleTimer.FromStorage(storage.fonTim);
	this.timeout.FromStorage(storage.timeout);
	// Load flags
	this.LoadFlags(storage);
}

Fera.prototype.ToStorage = function() {
	var storage = {
		avirgin : this.Butt().virgin ? 1 : 0,
		virgin  : this.FirstVag().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	storage.nexTim  = this.nexelleTimer.ToStorage();
	storage.shopTim = this.shopTimer.ToStorage();
	storage.cityTim = this.cityTimer.ToStorage();
	storage.fonTim  = this.fondleTimer.ToStorage();
	storage.timeout = this.timeout.ToStorage();
	
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule
Fera.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction
FeraScenes.Interact = function() {
	Text.Clear();
	
	if(!Scenes.Rigard.ClothShop.IsOpen()) {
		Text.Add("The shop is closing, and you are asked to leave.");
		Text.Flush();
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.ShopStreet.street);
		});
		return;
	}
	
	var cat = new RaceScore();
	cat.score[Race.Feline] = 1;
	var catScore = cat.Compare(new RaceScore(player.body));
	
	var parse = {
		playername : player.name,
		sirmiss    : player.body.Gender() == Gender.male ? "sir" : "miss"
	};
	parse = player.ParserTags(parse);
	parse = fera.ParserTags(parse, "f");
	
	Text.Clear();
	Text.Add("Fera is a cute little catgirl. She has large blue eyes and short chestnut hair, brown fur with white spots, and large catlike ears and a tail. She is wearing a very nice looking pink dress with short sleeves and little ruffles along the edges. It is cut above her knees and shows off her slender form very nicely. Her chest is large for her overall size, but it is nothing compared to Miss Nexelle's. Her dress is cut around her [fbreasts] so that her cleavage is clearly visible.", parse);
	Text.NL();
	
	if(fera.flags["Met"] == 0) {
		fera.flags["Met"] = 1;
		
		if(catScore > 0.2) {
			Text.Add("Fera looks at you as you walk over to her and her big blue eyes go wide. Apparently, she rarely sees other cat-morphs. She gets up and hurries over to meet you. <i>“Oh! Um... hello there. I'm Fera and I can help you if you need anything,”</i> she says cheerfully.", parse);
			fera.relation.IncreaseStat(100, 6);
		}
		else {
			Text.Add("She stops working and turns to you as you approach her. <i>“Hello, [sirmiss], welcome to Silken Delights. My name is Fera; please let me know if I can help you with something.”</i>", parse);
		}
		Text.NL();
		Text.Add("You introduce yourself to her.", parse);
	}
	else {
		if(fera.relation.Get() > 25)
			Text.Add("As you turn toward her, Fera has already hurried over. She jumps into your arms, and kisses you deeply. She seems very happy to see you...", parse);
		else if(fera.relation.Get() > 15)
			Text.Add("As soon as she can see you, Fera smiles and runs over. She jumps into your arms and purrs softly as she rubs her head against your [breasts].", parse);
		else if(fera.relation.Get() > 5)
			Text.Add("Fera looks happy to see you and quickly finishes what she was doing as you get closer. <i>“Hi, [playername], how are you? Can I do something for you?”</i> she asks, looking at you intently.", parse);
		else if(fera.relation.Get() >= 0)
			Text.Add("<i>“Oh, hello again, [playername]. Do you need something?”</i> she asks as you walk up to her.", parse);
		else
			Text.Add("Fera quickly looks away, saying nothing, obviously angry at you.", parse);
	}
	Text.Flush();
	//[Nexelle] [Fera] [Mother] [Shop] [City] [Touch] [Assistance] [Back]
	var options = new Array();
	options.push({ nameStr : "Nexelle",
		func : function() {
			// Set timer
			fera.nexelleTimer = new Time(0, 0, 0, 24 - world.time.hour);
			
			Text.Clear();
			Text.Add("You ask the cute catgirl about her employer.", parse);
			Text.NL();
			Text.Add("<i>“Um... Miss Nexelle takes care of me and makes very nice clothes and she's usually very nice to people she likes. I just wish she wouldn't hit me so much. I do the best I can... it's not my fault I keep dropping and tearing things...”</i>", parse);
			Text.NL();
			Text.Flush();
					
			//[Encourage][Scold][Ignore]
			var options = new Array();
			options.push({ nameStr : "Encourage",
				func : function() {
					Text.Add("You pat Fera on the head and tell her she does a good job and just needs to be more careful. Her face lights up in response to your praise.", parse);
					Text.Flush();
					fera.relation.IncreaseStat(100, 1);
					Gui.NextPrompt(FeraScenes.Interact);
				}, enabled : true,
				tooltip : "Reassure Fera about her work."
			});
			options.push({ nameStr : "Scold",
				func : function() {
					Text.Add("You tell Fera she should be ashamed to say such things about her caretaker and that it is her fault for constantly messing up. She looks down and seems saddened by your words.", parse);
					Text.Flush();
					fera.relation.DecreaseStat(-100, 1);
					Gui.NextPrompt(FeraScenes.Interact);
				}, enabled : true,
				tooltip : "Scold her for badmouthing her beautiful employer."
			});
			options.push({ nameStr : "Ignore",
				func : function() {
					FeraScenes.Interact();
				}, enabled : true,
				tooltip : "Say nothing and move on."
			});
			Gui.SetButtonsFromList(options);
			
		}, enabled : fera.nexelleTimer.Expired(),
		tooltip : "Speak with Fera about Miss Nexelle."
	});
	options.push({ nameStr : "Fera",
		func : function() {
			Text.Clear();
			Text.Add("You ask Fera about herself.", parse);
			Text.NL();
			if(fera.relation.Get() > 10)	
				Text.Add("<i>“I um... really enjoy helping people try on things. I could help you if you want...”</i> she says innocently, letting her eyes roam over your body unabashedly. From her blush, it seems like she appreciates what she sees.", parse);
			else
				Text.Add("<i>“Me? Um... I like milk, cream, and soft things. I've worked here for as long as I can remember. I carried things when I was small, and I sewed when I got bigger. I sometimes do errands for Miss Nexelle, that's the only time I really get to go out...”</i> she says sadly.", parse);
			Text.Flush();
			Gui.NextPrompt(FeraScenes.Interact);
		}, enabled : true,
		tooltip : "Ask Fera about herself."
	});
	if(fera.flags["Mom"] == 1) {
		options.push({ nameStr : "Mother",
			func : function() {
				Text.Clear();
				Text.Add("You ask Fera to tell you about her mother.", parse);
				Text.NL();
				Text.Add("Her eyes start to tear up at the question. <i>“My mom used to work here with Miss Nexelle, back when her mother ran the store. She was just as good - if not better - at making clothes. Even Miss Nexelle was nice to me back when my mom was here...”</i> She sniffles.", parse);
				Text.NL();
				Text.Add("<i>“But... she left one day and never came back, so I didn't have any other choice but to stay with Miss Nexelle, even though she hits me sometimes. I guess I should be grateful, but I miss her so much...”</i> You can see tears rolling down her cheeks.", parse);
				Text.NL();
				Text.Flush();
				
				//[Hold her] [Apologize] [Scoff] [Ignore]
				var options = new Array();
				options.push({ nameStr : "Hold her",
					func : function() {
						Text.Add("You put an arm around Fera and stroke her head with your other hand. She winces slightly as you brush against a bruise on her scalp, but seems to relax as you pat her hair, soothing the pain. Her sobbing stops after a while and she looks up at you. <i>“Thank you... I'm so sorry about this. I just get so lonely...”</i>", parse);
						Text.Flush();
						fera.relation.IncreaseStat(100,5);
						fera.flags["Mom"] = 2;
						Gui.NextPrompt(FeraScenes.Interact);
					}, enabled : true,
					tooltip : "Hold the poor lonely catgirl."
				});
				options.push({ nameStr : "Apologize",
					func : function() {
						Text.Add("You apologize to Fera for making her cry. <i>“It's ok...”</i> she sniffs. <i>“I should get back before I get in trouble again...”</i>", parse);
						Text.Flush();
						fera.relation.IncreaseStat(100,1);
						fera.flags["Mom"] = 2;
						Gui.NextPrompt(FeraScenes.Interact);
					}, enabled : true,
					tooltip : "Apologize for bringing up her mother."
				});
				options.push({ nameStr : "Scoff",
					func : function() {
						Text.Add("Scoffing at her tears, you tell her that you find her whole situation and manner pathetic. You say that if she were stronger, none of these things would bother her. <i>“<b>You are so mean!</b>”</i> she yells as she starts to cry harder. Before you can say anything else, she runs off and heads behind the counter.", parse);
						Text.Flush();
						fera.relation.DecreaseStat(-100,5);
						fera.flags["Mom"] = 3;
						// Set timer
						fera.timeout = new Time(0, 0, 0, 24 - world.time.hour);
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Berate her for being so weak."
				});
				options.push({ nameStr : "Ignore",
					func : function() {
						fera.flags["Mom"] = 3;
						FeraScenes.Interact();
					}, enabled : true,
					tooltip : "Say nothing and move along."
				});
				Gui.SetButtonsFromList(options);
			}, enabled : true,
			tooltip : "Ask Fera about her mother."
		});
	}
	options.push({ nameStr : "Shop",
		func : function() {
			Text.Clear();
			Text.Add("<i>“We sell the nicest clothes!”</i> she exclaims. <i>“Everything here is so soft and nice...”</i> she purrs as she rubs her head against a nearby robe. <i>“Miss Nexelle makes such nice clothes... I wish I could make such nice things...”</i>", parse);
			Text.NL();
			Text.Flush();
			
			//[Encourage] [Realistic] [Ignore]
			var options = new Array();
			options.push({ nameStr : "Encourage",
				func : function() {
					Text.Add("You smile and tell her that she could be that good if she works at it really hard. <i>“Really? You really think so, [playername]?”</i> She smiles and seems very happy that you believe in her.", parse);
					Text.Flush();
					fera.relation.IncreaseStat(100,1);
					Gui.NextPrompt(FeraScenes.Interact);
				}, enabled : true,
				tooltip : "Encourage Fera."
			});
			options.push({ nameStr : "Realistic",
				func : function() {
					Text.Add("You explain that Miss Nexelle has worked and practiced for years to be so good and that it is unlikely that she would get that good anytime soon. <i>“I know... I just wish I wasn't so clumsy...”</i> she says sadly.", parse);
					Text.Flush();
					fera.relation.DecreaseStat(-100,1);
					Gui.NextPrompt(FeraScenes.Interact);
				}, enabled : true,
				tooltip : "Tell her not to get her hopes up."
			});
			options.push({ nameStr : "Ignore",
				func : function() {
					FeraScenes.Interact();
				}, enabled : true,
				tooltip : "Say nothing and move on."
			});
			Gui.SetButtonsFromList(options);
			
			// Set timer
			fera.shopTimer = new Time(0, 0, 0, 24 - world.time.hour);
		}, enabled : fera.shopTimer.Expired(),
		tooltip : "Ask the cute catgirl about Silken Delights."
	});
	options.push({ nameStr : "City",
		func : function() {
			Text.Clear();
			Text.Add("You ask Fera what she thinks of the city. <i>“Umm... I think morphs should be treated better. Many people in town are so mean to us just because we look different. It's not fair...”</i> she pouts.", parse);
			Text.NL();
			Text.Flush();
			
			//[Agree] [Disagree] [Ignore]
			var options = new Array();
			options.push({ nameStr : "Agree",
				func : function() {
					Text.Add("You tell the cute catgirl that you agree with her that morphs should be treated better. <i>“I'm so glad you agree, [playername],”</i> she says with a smile.", parse);
					Text.Flush();
					fera.relation.IncreaseStat(100,1);
					Gui.NextPrompt(FeraScenes.Interact);
				}, enabled : true,
				tooltip : "Agree with her."
			});
			options.push({ nameStr : "Disagree",
				func : function() {
					Text.Add("Shaking your head, you tell her that you don't think it likely or possible for different creatures to be treated as well as humans. You explain that creatures who are different should be treated different. Unsurprisingly, she looks very angry at your words and hurries off, saying nothing.", parse);
					Text.Flush();
					fera.relation.DecreaseStat(-100,2);
					Gui.NextPrompt(FeraScenes.Interact);
				}, enabled : true,
				tooltip : "Disagree with her."
			});
			options.push({ nameStr : "Ignore",
				func : function() {
					FeraScenes.Interact();
				}, enabled : true,
				tooltip : "Say nothing."
			});
			Gui.SetButtonsFromList(options);
			
			// Set timer
			fera.cityTimer = new Time(0, 0, 0, 24 - world.time.hour);
		}, enabled : fera.cityTimer.Expired(),
		tooltip : "Ask the cute catgirl about Rigard."
	});
	options.push({ nameStr : "Touch",
		func : FeraScenes.TouchPrompt, enabled : fera.fondleTimer.Expired(),
		tooltip : "Attempt to touch the cute catgirl."
	});
	options.push({ nameStr : "Assistance",
		func : FeraScenes.SexPrompt, enabled : true,
		tooltip : "Ask Fera to 'assist' you in the dressing room."
	});
	Gui.SetButtonsFromList(options, true);
	
	if(GetDEBUG()) {
		Text.NL();
		Text.Add("DEBUG: relation: " + fera.relation.Get(), null, 'bold');
		Text.NL();
		Text.Flush();
	}
}

FeraScenes.TouchPrompt = function() {
	var parse = {
		against        : (player.FirstBreastRow().size.Get() > 3) ? "between" : "against"
	};
	parse = player.ParserTags(parse);
	parse = fera.ParserTags(parse, "f");
	
	//[Cuddle][Fondle]
	var options = new Array();
	options.push({ nameStr : "Cuddle",
		func : function() {
			Text.Clear();
			if(fera.relation.Get() >= 5) {
				Text.Add("Fera comes close and purrs as you pull her into your arms. She puts her arms around you and rubs her head [against] your [breasts] in return. Clearly, she appreciates someone being kind to her.", parse);
				Gui.NextPrompt(FeraScenes.Interact);
				player.AddLustFraction(0.1);
			}
			else if(fera.relation.Get() >= 0) {
				Text.Add("Fera looks up at you as you embrace her, looking very confused about why you're doing this. She doesn't seem to dislike it though.", parse);
				Gui.NextPrompt(FeraScenes.Interact);
				player.AddLustFraction(0.1);
			}
			else { // Negative
				Text.Add("Fera quickly backs away as you try to hold her, staring at you angrily.", parse);
				fera.relation.DecreaseStat(-100, 3);
				// Set timer
				fera.timeout = new Time(0, 0, 0, 24 - world.time.hour);
				Gui.NextPrompt();
			}
			Text.Flush();
			world.TimeStep({minute: 10});
		}, enabled : true,
		tooltip : "Hold Fera."
	});
	options.push({ nameStr : "Fondle",
		func : function() {
			Text.Clear();
			
			if(fera.relation.Get() >= 8) {
				Text.Add("Taking Fera's hand, you lead her behind a large rack of clothes and have her turn around. Pulling down her dress, you pop out her [fbreasts]. You cup one of her mounds in each hand and proceed to massage them from behind. Fera purrs and moans as you squeeze her breasts. Shifting your [hand]s up a bit, you rub her [fnips] with your fingers.", parse);
				Text.NL();
				var noble = false;
				if(Math.random() < 0.25 && (world.time.hour >= 13 && world.time.hour < 17)) {
					noble = true;
					Text.Add("A young noblewoman walks around the rack you are hiding behind and sees what you two are doing. She gasps quietly and quickly walks back the way she came. Before she gets very far, however, you hear her footsteps stop, and spot her head barely poking around the corner. Clearly, she wants to watch the rest and you have no intention of disappointing her.", parse);
					Text.NL();
				}
				if(player.FirstCock()) {
					Text.Add("As you continue to play with her [fnips], you feel a hand on your [botarmor], feeling for your [cocks]. She finds what she is looking for, her [fhand] rubbing up and down your [cocks] as you continue to play with her [fbreasts]. As you fondle her tits harder, she accelerates her pace on your [cocks]. The two of you moan almost in unison as you please each other.", parse);
					Text.NL();
				}
				if(player.HasBalls())
					Text.Add("Fera's slender hand moves down to your [balls], cupping them as best she can through your [botarmor]. She massages them as firmly as she can, and you squeeze her [fnips] in return. You give one of her ears a gentle nip as you continue to fondle each other. After a short while, you whisper for her to stop - she is doing a very good job and you don't want to soil your [botarmor].", parse);
				else if(player.FirstVag())
					Text.Add("You feel Fera's hand reaching around your [botarmor] until she finds the folds of your [vag]. You squeeze her [fbreasts] tighter as you feel her fingers rub up and down your [vag]. She responds by trying to force her digit inside you through your [botarmor]. The sudden sensation causes you to pinch her [fnips], which only makes her push harder. You both moan softly as you do your best to please each other.", parse);
				Text.NL();
				Text.Add("After this continues for a few minutes, she whispers, <i>“I should get back to work, Miss Nexelle might notice...”</i> You reluctantly let go of her and Fera fixes her dress then turns around, gives you a quick kiss and hurries back to work.", parse);
				if(noble)
					Text.Add(" You look over, but can no longer see the noblewoman. You hope she enjoyed the show.", parse);
				Text.Flush();

				fera.relation.IncreaseStat(100,2);
				player.AddLustFraction(0.3);
				Gui.NextPrompt(FeraScenes.Interact);
			}
			else if(fera.relation.Get() >= 0) {
				Text.Add("You lead Fera behind one of the large clothing racks, hiding the two of you from view. The cute catgirl lets out a quiet gasp and she blushes when you grab hold of her [fbreasts] and start to play with them through her clothes. She looks up at you with tears in her big blue eyes and a frightened face. Feeling a little guilty, you let go of her breasts and Fera runs off without saying a word.", parse);
				Text.Flush();
				// Set timer
				fera.fondleTimer = new Time(0, 0, 0, 24 - world.time.hour);
				player.AddLustFraction(0.1);
				Gui.NextPrompt();
			}
			else {
				Text.Add("Fera quickly backs away as you approach her. She glares at you angrily.", parse);
				Text.Flush();
				fera.relation.DecreaseStat(-100, 3);
				// Set timer
				fera.timeout = new Time(0, 0, 0, 24 - world.time.hour);
				Gui.NextPrompt();
			}
			world.TimeStep({minute: 10});
			
		}, enabled : true,
		tooltip : "Play with her breasts."
	});
	
	Gui.SetButtonsFromList(options, true, FeraScenes.Interact);
}

FeraScenes.SexPrompt = function() {
	var cocksInVag = player.CocksThatFit(fera.FirstVag());
	var cocksInAss = player.CocksThatFit(fera.Butt());
	
	var p1Cock = player.BiggestCock(cocksInVag);
	
	var parse = {
		playername     : player.name,
		cockDesc2      : function() { return player.AllCocks()[1].Short(); }
	};
	parse = player.ParserTags(parse, "", p1Cock);
	parse = fera.ParserTags(parse, "f");
	
	if(player.body.Gender() != Gender.male && Math.random() < 0.5)
		parse["garment"] = "dress";
	else
		parse["garment"] = "robe";
	
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var breasts = player.FirstBreastRow().size.Get() > 3;
	parse["ballsD"] = player.HasBalls() ? function() { return Text.Parse(" and [balls]", parse); } : "";
	
	var armor = "";
	if(player.Armor() || !player.LowerArmor()) armor += "[armor]";
	if(player.Armor() && player.LowerArmor()) armor += " and ";
	if(player.LowerArmor()) armor += "[botarmor]";
	parse["arm"] = Text.Parse(armor, parse);
	
	Text.Clear();
	Text.Add("You decide you want to have some fun with Fera, and tell her you need some help trying something on.", parse);
	Text.NL();
	if(fera.relation.Get() >= 20) {
		Text.Add("Before you can say anything else, Fera grabs a [garment] and drags you to the dressing rooms in the back. She opens one and pulls you in, locking the door behind you. Staring at you with lust-filled eyes, there is no question what's on her mind.", parse);
	}
	else if(fera.relation.Get() >= 0) {
		Text.Add("She nods and waits for you to select a garment. After taking a random [garment] off the rack, you motion for Fera to follow you. You enter one of the dressing rooms and quietly close the door after she follows you in. She looks at you, waiting for instruction on what to do next.", parse);
	}
	else { // NEGATIVE
		Text.Add("Fera glances at you angrily and says, <i>“I'm busy right now; do it yourself.”</i>", parse);
		fera.relation.DecreaseStat(-100, 1);
		Gui.NextPrompt();
		return;
	}
	Text.NL();
	Text.Add("Upon arriving in the dressing room, you admire the cute catgirl. You stroke her head gently as you look over her various attributes. Thinking as you pet her, you consider what to do.", parse);
	Text.Flush();
	
	//[Try on][Give oral][Get oral][Titfuck][Sex][Standing][Behind][Anal][Sitting]
	var options = new Array();
	options.push({ nameStr : "Try on",
		func : function() {
			p1Cock = player.BiggestCock();
			
			Text.Clear();
			Text.Add("You hand Fera the [garment] and tell her you need help trying it on.", parse);
			Text.NL();
			
			if(fera.relation.Get() < 10) {
				Text.Add("She looks away as you remove your [botarmor]. When you are finished, she hands you the [garment] and moves behind you to help you get it on.", parse);
				Text.NL();
				
				if(breasts) {
					Text.Add("You put the [garment] over your head, but pretend to have trouble getting it over your [breasts]. Fera reaches around you and tries to help you pull it over them. As she reaches around you, her soft [fbreasts] press against your back.", parse);
					Text.NL();
					Text.Add("Her hands fondle your [breasts] roughly, trying to pull the [garment] down. After a few moments, the [garment] slides down and she gives your mounds a final cup to make sure the [garment] fits.", parse);
					Text.NL();
				}
				
				if(player.FirstCock()) {
					Text.Add("As the [garment] goes down over your [cocks], it gets stuck on[oneof] your member[s]. You tell Fera to help you and she lets out a small whine. She reaches around you with one hand and tries to pull the [garment] down without touching your [cocks]. It's a futile effort, however.", parse);
					Text.NL();
					Text.Add("She uses one hand to hold down your [cocks] while pulling the [garment] over [itThem] with the other. As she pulls the snugly fitting fabric over your member[s], you can feel her [fbreasts] pressing into your back. They are soft but firm, and you press back slightly as she pulls the [garment] over your [cocks].", parse);
					Text.NL();
				}
				Text.Add("Once you have the tight-fitting [garment] on, you ask Fera how it looks. She shyly inspects you and says, <i>“It looks very nice, [playername].”</i>", parse);
				Text.NL();
				if(player.FirstCock()) {
					Text.Add("You notice her eyes are focusing on your [cocks] as she looks at you. Clearly, she knows what to look for, even if she won't directly compliment you on [itThem].", parse);
					Text.NL();
				}
				if(breasts) {
					Text.Add("Letting her gaze wander, she stares intently at your [breasts], and turns her head to look at them from every angle. She seems to really like how the [garment] looks on you, particularly around your chest.", parse);
					Text.NL();
				}
				Text.Add("You thank Fera for helping you and say you will consider buying the [garment]. She nods happily and moves behind you again to help you take to [garment] off. You purposely press back against her as she lifts the [garment] for you, trying to feel her [fbreasts] as well as you can with your back. Once the [garment] is off, she excuses herself and leaves you to get your clothes back on.", parse);
				fera.relation.IncreaseStat(15, 1);
				player.AddLustFraction(0.1);
				world.TimeStep({minute: 15});
			}
			else if(fera.relation.Get() < 20) {
				Text.Add("Fera nods excitedly and helps you remove your [arm].", parse);
				Text.NL();
				
				if(p1Cock) {
					parse["br"] = breasts ? Text.Parse(" and [breasts]", parse) : ""
					Text.Add("She takes the time to feel your [cocks][br] as much as she can while you strip. You can also feel her [fbreasts] rubbing against you constantly, along with her stiff [fnips]. She helps you put the [garment] over your head and then begins to pull it down. Running her hands over your [breasts], she feels for a good fit.", parse);
					Text.NL();
					Text.Add("The [garment] slides down to your [cocks], forcing her to reach down to help get it past the obstruction[s]. She holds your [cocks] down while stroking [itThem] gently and pulls the [garment] down with her other hand. While she does this, her stiff [fnips] dig into your back a little as she holds you tight. She then rubs her [fhand]s over your [cocks] a few times, massaging [itThem] firmly while making sure that the [garment] fits.", parse);
					Text.NL();
					Text.Add("The catgirl then moves back and admires how nice the [garment] looks on you. You notice her eyes tend to stay on your [cocks], but you let her stare for a while. A few moments later, you ask her to help you take the [garment] off again, and she quickly gets behind you.", parse);
					Text.NL();
					Text.Add("She rubs her [fbreasts] against you repeatedly while she pulls the [garment] off your body. Once it is off, she puts it aside and helps you put your [arm] back on. You give the cute catgirl a big hug as you leave together.", parse);
				}
				else {
					Text.Add("She presses against you constantly as she helps you disrobe, rubbing her [fbreasts] against you as much as she can. You then raise your arms and try to put the [garment] on. She pulls it down for you, still pressing her firm tits against your back. You can feel her stiff [fnips] press into you as she does and press back gently.", parse);
					Text.NL();
					Text.Add("Once the [garment] is on, she circles around you and begins to fondle you gently. She feels up your [breasts] and rubs them a bit, making sure the [garment] fits well. Her hands soon descend to your hips, and she feels along them while tugging the [garment] gently. Seemingly happy, she sits back and admires you for a moment. You run your hands along your body while she does, and you hear her purr softly.", parse);
					Text.NL();
					Text.Add("After telling her you like it, you ask for help taking the [garment] off, and she takes her position behind you. She begins to lift the [garment], but does so slowly and takes time to feel every curve of your body. As she lifts the [garment] over your head, she presses against you once again, and you feel her [fbreasts].", parse);
					Text.NL();
					Text.Add("The catgirl then helps you get dressed, again taking her time and touching you far more than necessary. You thank Fera and you both leave the dressing room.", parse);
				}
				
				player.AddLustFraction(0.2);
				fera.relation.IncreaseStat(20, 2);
				world.TimeStep({minute: 15});
			}
			else { // >= 20
				Text.Add("Fera tilts her head at your shallow attempt at feigning decency and stares at you knowingly. She clearly knows what you really want. Realizing that there is no reason to pretend anymore, you sit on the bench and remove your [arm]. The cute catgirl stares at your body lustfully and pulls her dress down, revealing her [fbreasts].", parse);
				Text.NL();
				
				if(player.FirstCock()) {
					Text.Add("As she walks over to you, Fera pulls up her dress before sitting in your lap. She gives you a big kiss and you feel her [fbreasts] pressing against your [breasts]. Her [fnips] are hard, and she rubs them around your [breasts] to stimulate you as kiss her. You can feel her [fvag] rubbing along your [cocks] through her wet panties.", parse);
					Text.NL();
					Text.Add("After a while, she scoots back a bit and you feel a hand on your [cocks]. She strokes your [cocks] gently while rubbing [itThem] against her wet panties. You can feel the warm lips of her [fvag] through the wet silk, and it only stimulates you more. She leans over a bit to kiss you deeper, and her [fbreasts] push firmly against your [breasts].", parse);
					Text.NL();
					Text.Add("You reach under and cup her [fbreasts], and begin to massage them as she stimulates your [cocks]. After a few minutes, you feel your climax approaching and Fera quickly gets up and kneels before your [cocks]. She puts the head of[oneof] your [cocks] into her mouth and begins to stroke it rapidly.", parse);
					Text.NL();
					
					if(player.CumOutput() > 3) {
						Text.Add("Your [cocks] spray[notS] [itsTheir] seed, and the catgirl struggles to swallow your entire load. ", parse);
						if(player.NumCocks() > 1)
							Text.Add("As she gulps futilely, your other [cocks] cum[notS2] all over the floor and make[notS2] a mess. ", parse);
						Text.Add("She pulls your [cock] out of her mouth, wiping it as she catches her breath.", parse);
						Text.NL();
						Text.Add("Afterward, the catgirl licks[eachof] your [cocks][ballsD] as well as her hands clean. She gives your softening [cocks] a few playful strokes as she kisses you one more time. Fera then helps you get dressed and you help her clean up before she leads out of the dressing room.", parse);
					}
					else {
						Text.Add("The catgirl eagerly gulps down your cum as your [cocks] blow[notS] [itsTheir] load[s]. Once she finishes, Fera licks her lips happily and proceeds to lick[eachof] your [cocks][ballsD] clean with her rough tongue.", parse);
						Text.NL();
						Text.Add("She fetches a rag and wipes up the mess while you get your [arm] back on. You give the cute catgirl a passionate kiss and walk her out of the dressing room.", parse);
					}
				}
				else if(player.FirstVag()) {
					Text.Add("You stand up and walk toward the catgirl only to have her eagerly push you up against the wall of the dressing room. She gives your face a long lick as she fondles your [breasts] lovingly. Feeling a need to return the favor, you grab her [fbreasts] and massage them firmly.", parse);
					Text.NL();
					Text.Add("As you play with each other, she leans in to kiss you. At the same time, you feel one of her hands move to your [vag] and begin to run her fingers along it. You moan quietly as you feel her push inside your [vag]. She then begins to caress your inner walls with one of her digits, rubbing against your [clit] with her tiny palm.", parse);
					Text.NL();
					Text.Add("Unable to do much else, you squeeze her [fbreasts] harder and rub her [fnips] with your fingers as she pleasures you. She presses against you harder, and you can feel her mounds against your stomach.", parse);
					Text.NL();
					Text.Add("She puts another finger into your [vag] and she spreads your wet folds with her digits. You can feel her nails digging into your [vag] slightly as she spreads you wide open, and you let out a small whine. She looks into your eyes, and you can see she is enjoying teasing you immensely.", parse);
					Text.NL();
					Text.Add("<i>“You want me to keep going? I can stop if you want...”</i> she says with a smirk. You nod desperately, and she smiles and resumes fingering your [vag]. As you continue to please each other, you can see her tail swishing excitedly.", parse);
					Text.NL();
					parse["legs"] = function() { return player.LegsDesc(); }
					parse = Text.ParserPlural(parse, player.NumLegs() > 1);
					Text.Add("A few minutes later, you can take no more, and your body tenses as you orgasm. Fera pulls her wet fingers out of your [vag] and helps you remain standing as your [legs] weaken[notS] slightly. Your breathing slows as you cuddle with her for a moment.", parse);
					Text.NL();
					Text.Add("Afterward, she helps you get dressed and leads you out.", parse);
				}
				
				world.TimeStep({minute: 30});
				player.AddSexExp(1);
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(20, 2);
			}
			Text.Flush();
			Gui.NextPrompt(FeraScenes.Interact);
		}, enabled : true,
		tooltip : "Have Fera help you try something on."
	});
	// GIVE ORAL
	if(fera.relation.Get() >= 10) {
		options.push({ nameStr : "Give oral",
			func : function() {
				Text.Clear();
				parse["l"] = player.HasLegs() ? "kneel" : "lower yourself";
				Text.Add("You instruct Fera to sit on the small bench, spread her legs and lift up her dress. She does as you command, the dress' pink ruffles bunched around her waist, and you [l] on the floor in front of her. Pushing aside her white silk panties, you reveal her [fvag]. Pulling in close, you begin to lick it gently, tasting her sweet folds with your [tongue].", parse);
				Text.NL();
				Text.Add("Her juices are already flowing freely from her opening, coating her lower lips in a salty but not unpleasant moisture. She begins to moan softly as you gently play with her [fclit], which only encourages you more.  Licking harder, you push your tongue against her slit, running it all the way up and down her [fvag].", parse);
				Text.NL();
				Text.Add("Barely getting started, you spread her [fvag] with your fingers. A thin strand of her juices connects the sides of her enticing opening. You push your [tongue] inside, the firm walls pressing in around you. Fera begins panting lustfully, clearly enjoying your efforts.", parse);
				Text.NL();
				Text.Add("Wanting more, she puts a hand on your head, gently pushing you in closer, your nose pressing against her cute clit. Obliging, you respond by sticking your [tongue] inside her as far as it will go, tasting her deepest parts. <i>“Please...”</i> she moans.", parse);
				Text.NL();
				Text.Add("Understanding her desire, you continue your pleasurable assault. She begins to purr with each lap of your [tongue], encouraging you to lick faster. After a few minutes, she pushes you down hard, shoving your face into her nethers. You feel her body tense, a shudder running through her. Reaching her climax, the catgirl mewls softly as she rides out her orgasm.", parse);
				Text.NL();
				Text.Add("<i>“Thanks, [playername]. That felt really good...”</i> she says as she fixes her dress. You kiss and head back into the store.", parse);
				Text.Flush();
				world.TimeStep({minute: 30});
				player.AddSexExp(1);
				player.AddLustFraction(0.3);
				fera.relation.IncreaseStat(30, 2);
				Gui.NextPrompt(FeraScenes.Interact);
			}, enabled : true,
			tooltip : "Eat out Fera."
		});
		// GET ORAL
		options.push({ nameStr : "Get oral",
			func : function() {
				Text.Clear();
				if(player.FirstCock()) {
					p1Cock = player.BiggestCock();
					
					parse["ballsD"] = player.HasBalls() ? function() { return Text.Parse(" and [balls]", parse); } : "";
					parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
					
					Text.Add("Whispering quietly, you tell Fera to please your [cocks] with her mouth. She smiles and nods as she waits for you to undress. You sit on the small bench and take off your [botarmor], revealing your [cocks][ballsD].", parse);
					Text.NL();
					
					if(player.FirstCock().length.Get() > 25) {
						Text.Add("Upon seeing your [cocks], the cute catgirl's eyes widen in shock. <i>“[ItsTheyre] <b>huge</b>, [playername]! But I'll try my best...”</i> Fera says with a nervous smile. You give her a gentle push, telling her to assume a kneeling position in front of you. Clearly, she's intimidated by your sheer size.", parse);
						Text.NL();
					}
					
					Text.Add("Obediently, Fera kneels in front of you and takes[oneof] your [cocks] in her hands, beginning to stroke it gently. She licks the salty pre off the head of your [cock] with her rough, catlike tongue.", parse);
					Text.NL();
					Text.Add("The sensation is incredible and you shudder as she begins to lick up and down the entire length of[oneof] your [cocks]. She puts as much as she can of your [cock] into her warm mouth, and begins to suck while her tongue laps up and down the bottom of your shaft. Looking up at you to see how she is faring, she seems pleased with the look of ecstasy on your face.", parse);
					Text.NL();
					if(player.NumCocks() == 2) {
						Text.Add("You feel her hand on your other [cockDesc2], jerking it roughly as she continues to lick your [cock] lovingly. She proceeds to switch dicks and puts the second of your [cocks] into her mouth while she strokes the first. The cute catgirl goes back and forth between your members, paying each equal attention.", parse);
						Text.NL();
					}
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.Add("Realizing she's been neglecting your other parts, she takes your [balls] into her hand and begins to massage them firmly. She continues to lovingly suck your [cock], using her tongue to stimulate the [cockTip]. Squeezing your balls tightly, Fera makes you shudder from the combined stimulation.", parse);
						Text.NL();
					}, 1.0, function() { return player.HasBalls(); });
					scenes.AddEnc(function() {
						parse["twoof"] = player.NumCocks() > 3 ? " two of" : "";
						Text.Add("Fera shifts her hands onto[twoof] your other cocks, and begins to jerk them roughly. Her mouth pops off your [cock], and she takes a different one into her mouth. Clearly, she wants to please as much of you as she can, and she takes turns sucking and jerking each of your [cocks]. You cannot help but admire her passionate efforts.", parse);
						Text.NL();
					}, 1.0, function() { return player.NumCocks() > 2; });
					scenes.Get();
					
					if(fera.flags["Blowjob"] > 3) {
						Text.Add("Her experience with your [cocks] show[notS] as you are just barely able to restrain yourself. She has clearly learned what you like, and has become adept at pleasing you. The cute catgirl loves sucking your [cocks], and loves the taste of your cum even more. She takes your [cock] as far into her throat as she can, trying to speed up the delivery of her favorite salty treat.", parse);
					}
					else {
						Text.Add("Despite her inexperience, she is surprisingly good at this, perhaps in part due to her catgirl nature. She is trying very hard to please you, and you have to admire her dedication. Placing a hand on her head, you gently stroke her hair. She closes her eyes as she continues sucking your [cock] and purrs softly.", parse);
					}
					
					Text.NL();
					
					if(player.CumOutput() > 3) {
						Text.Add("Finally, you are unable to hold back any longer and you cum hard. Fera tries her best to swallow your load, but it is too much for her and it starts to spurt out of her mouth, spreading all over the floor.", parse);
						if(player.NumCocks() > 1) {							
							Text.Add(" Your other member[s2] also erupt[notS2], hosing the walls of the dressing room and making a big mess.", parse);
						}
						Text.Add(" She licks up as much as she can off your [cocks][ballsD], completely entranced.", parse);
						Text.NL();
						Text.Add("She grabs a large rag from a pile under the bench and quickly wipes the floor more-or-less clean. <i>“Was it good for you?”</i> she anxiously asks as she finishes cleaning up, a worried look in her large eyes. You nod empathetically, putting your [botarmor] back on, and follow her out of the dressing room.", parse);
					}
					else {
						Text.Add("You soon reach your limit under her passionate service, cumming hard. She swallows your load greedily, gently lapping your [cocks][ballsD] clean. <i>“Your cum tastes so good, [playername]...”</i> she murmurs, licking her lips. Gently patting her head, you promise to give her more later. She purrs happily, handing you your [botarmor]. Putting it back on, you leave the dressing room together.", parse);
					}
					
					fera.flags["Blowjob"]++;
				}
				else { // Vag
					parse["l2"] = player.HasLegs() ? "spreading your legs" : "presenting your crotch";
					Text.Add("You sit down on the small bench and remove your [botarmor], [l2] to reveal your [vag]. Fera gets on her knees and begins to lick it tenderly with her rough, catlike tongue. It feels incredible, and you cannot help but moan at the intense pleasure running up your spine.", parse);
					Text.NL();
					Text.Add("The cute catgirl seems to be enjoying herself as well, and you can see her blue eyes looking up at you as she licks your [vag] enthusiastically. Her fingers shift to play with your [clit], pinching it while she continues licking. Fera's tongue reaches deeper inside your [vag], its roughness pleasant against your walls.", parse);
					Text.NL();
					if(player.FirstBreastRow().size.Get() > 3) {
						parse["toparmor"] = player.Armor() ? " through your " + player.ArmorDesc() : "";
						Text.Add("You grab hold of your [breasts], and begin to fondle them roughly[toparmor]. Using your fingers to twist and stimulate your [nips], you enjoy the catgirl's tongue as it laps at your inner walls. Moaning softly, you squeeze your [breasts] harder with each lick. The sensations of your body are so intense that you can't take much more.", parse);
						Text.NL();
					}
					Text.Add("She pulls open the folds of your [vag] and sticks her tongue into your depths. You feel her cute nose rub against your [clit] as she licks as deeply as she possibly can. The sensations from her rough, flexible muscle in your depths send you over the edge. Your body tenses as you reach orgasm, and you cum hard. Fera smiles and looks very pleased as she licks your juices off her lips. She helps you get dressed and you give her a big kiss before walking back out to the shop.", parse);
				}
				Text.Flush();
				player.AddSexExp(1);
				
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(20, 2);
				Gui.NextPrompt(FeraScenes.Interact);
			}, enabled : player.FirstVag() || player.FirstCock(),
			tooltip : "Ask Fera to service you."
		});
	}
	// TITJOB
	if(fera.relation.Get() > 15) {
		options.push({ nameStr : "Titfuck",
			func : function() {
				p1Cock = player.BiggestCock();
				
				Text.Clear();
				Text.Add("You sit on the small bench and take off your [botarmor], revealing your [cocks][ballsD]. Speaking quietly so as to not alert the tailor, you tell Fera that you want her to use her [fbreasts] to pleasure your [cocks].", parse);
				Text.NL();
				Text.Add("She nods and pulls her dress down revealing her [fbreasts] and erect [fnips], kneeling in front of you. The catgirl rubs[oneof] your [cocks] with her hands, and puts it between her soft breasts. She gives your [cock] a gentle squeeze with her tits and leans down to lick up all of your salty pre. Fera starts moving up and down slowly, massaging your [cock] with her [fbreasts]. Each time it nears her face, she gives your [cock] a little kiss before continuing to rub it with her mounds.", parse);
				Text.NL();
				Text.Add("You moan softly as she pleasures you, which only encourages the cute catgirl more. After a few minutes, she stops moving, and squeezes down hard on your [cocks] with her [fbreasts]. Sticking out her [ftongue], she takes the [cockTip] of[oneof] your [cocks] into her mouth and licks around it with her rough tongue. She passionately licks around the head of your [cock], some of her saliva escaping her mouth and starting to drip down your dick. You shudder at her ministrations, which only makes her squeeze all the harder.", parse);
				Text.NL();
				Text.Add("Finally, you near your limit and your [cocks] begin[notS] to twitch, prompting her to lick faster, pressing her tongue more firmly against your [cock]. The catgirl moves up and down, clamping down on you as hard as possible.", parse);
				Text.NL();
				
				player.AddSexExp(1);
					
				if(player.CumOutput() > 3) {
					Text.Add("You cum violently, and she struggles to swallow it all", parse);
					if(player.NumCocks() > 1) {
						Text.Add(" while your other cock[s2] spray[notS2] [itsTheir2] load all over the walls of the dressing room", parse);
					}
					Text.Add(". However, your seed soon starts to leak out from her mouth and run down your [cocks] and all over her [fbreasts], although, cupping her hands, she barely manages to keep most of it off her dress.", parse);
					Text.NL();
					Text.Add("She happily licks up as much as she can off your [cocks] and herself, and grabs a rag from under the bench to clean up the rest. You put your [botarmor] back on, and help her clean. After fixing her dress as best you can, you give Fera a quick hug and lead her out into the store.", parse);
				}
				else  {
					Text.Add("Your [cocks] spurt[notS] forcefully as you cum, filling her mouth with your seed", parse);
					if(player.NumCocks() > 1) {
						Text.Add(" while your other cock[s2] shoot[notS2] your load onto the walls", parse);
					}
					Text.Add(". With small gulps, she slowly swallows it all, taking time to savor her favorite salty treat. After she's done, she licks the rest of your [cocks][ballsD] clean, and grabs one of the rags under the small bench to wipe off the walls. You get your [botarmor] back on, and give her a kiss. Together, you exit the dressing room.", parse);
				}
				Text.Flush();
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(20, 2);
				Gui.NextPrompt(FeraScenes.Interact);
			}, enabled : player.FirstCock(),
			tooltip : Text.Parse("Have Fera please you with her [fbreasts].", parse)
		});
	}
	if(fera.relation.Get() >= 20 && fera.FirstVag().virgin) {
		options.push({ nameStr : "Sex",
			func : function() {
				Text.Clear();
				Text.Add("You hold her tightly and ask Fera if she wants to have sex with you.", parse);
				Text.NL();
				Text.Add("<i>“Um... I've never...”</i> she stammers. Pulling her face up to meet yours, you ask again if she wants to. She looks deeply into your [eyes]. <i>“You are the only person I have ever wanted to do this with, [playername]. I'll try my best...”</i>", parse);
				Text.NL();
				Text.Add("With a smile, you tell Fera to sit on the bench, lift up her dress and remove her panties. She does as you ask while you take off your [botarmor]. Her eyes stare intently at your [cocks] as you pull down her dress to reveal her [fbreasts].", parse);
				Text.NL();
				if(p1Cock.length.Get() >= 18) {
					Text.Add("<i>“You're so big, [playername]... will it fit?”</i> the cute catgirl asks nervously. Sensing her apprehension, you put a hand on her head and stroke her as you promise that everything will be fine.", parse);
					Text.NL();
				}
				Text.Add("You kiss her deeply and your [tongue] intertwines with hers as you fondle her [fbreasts] roughly.", parse);
				Text.NL();
				Text.Add("She reaches down and grabs[oneof] your [cocks], stroking it slowly. After a minute, you interrupt her, and pull back, telling her to lick your [cock] instead. She gently laps at the entire length of your [cock], coating it in her saliva. You ready yourself to fuck her as she stares at you nervously.", parse);
				Text.NL();
				Text.Add("Stroking her cheek, you ask her if she's ready. The cute catgirl nods slightly, and you move down between her legs, rubbing the head of your [cock] against her [fvag] gently. You push inside slowly, trying to be gentle with her, but she still winces as your tip forces itself inside her opening. You see a trickle of blood from her tearing hymen as she mewls slightly in pain.", parse);
				Text.NL();
				
				fera.FuckVag(fera.FirstVag(), p1Cock);
				player.Fuck(p1Cock, 5);
				
				Text.Add("You reassure her that it will get better, and she'll feel good soon, and she nods shyly for you to continue, biting her lower lip.", parse);
				Text.NL();
				parse["c"] = player.strapOn ? "" : " very warm and";
				Text.Add("Her entrance is[c] tight, and the feeling on your [cock] is fantastic. Soon, you are as deep as you can go, and start making short, gentle thrusts. As you lean over to kiss her, she reaches up toward you and puts her arms around you. You hug her back without stopping your thrusts. With your caresses, she quickly starts to relax and it gets easier to move inside her, letting you accelerate your pace.", parse);
				Text.NL();
				parse["c2"] = player.strapOn ? "" : " warm";
				Text.Add("A quiet moan escapes her, and she squeezes you tighter. The moan is followed by more, and they grow louder, as she clamps down on you with her legs. You figure it is finally starting to feel good for her and pound harder into her[c2] depths.", parse);
				Text.NL();
				
				if(player.NumCocks() === 0) {
					Text.Add("You can tell she's getting close, and as you bury yourself as deep as you can, she clamps down on your [cock] and struggles to keep her voice down.", parse);
					Text.NL();
					Text.Add("You pull out your [cock], and look to see Fera breathing heavily and looking tired, but pleased.", parse);
					Text.NL();
					Text.Add("You help each other get dressed and you kiss her again before you leave. <i>“If you want to do it again... let me know,”</i> she says quietly. The two of you exit the dressing room together and return to the main area of the store.", parse);
				}
				else {
					if(player.CumOutput() > 3) {
						Text.Add("You feel yourself going over the edge, and give one last hard thrust, burying yourself as deep as you can. You cum hard, and your huge load fills up her [fvag]", parse);
						if(player.NumCocks() > 1)
							Text.Add(" as your other cock[s2] spurt[notS2] cum all over the floor and walls, making a big mess", parse);
						Text.Add(". However, there is not enough room in her [fvag] for your seed and it starts to gush out and drip down your [cocks]. Pulling out your [cock], you see the cute catgirl is panting heavily, looking up happily at you.", parse);
						Text.NL();
						Text.Add("You help Fera clean up and fix her clothes, and she helps you with your [botarmor]. She comes close and embraces you. <i>“We can do it again sometime... if you want...”</i> she says while rubbing her head against your [breasts]. You open the dressing room door and let Fera return to work.", parse);
					}
					else {
						Text.Add("As you reach your limit, you push yourself in to the hilt. You shoot your load deep inside her [fvag]", parse);
						if(player.NumCocks() > 1)
							Text.Add(" as your other cock[s2] spurt[notS2] your cum all over the floor", parse);
						Text.Add(". As you pull out your [cock], you look to see Fera breathing heavily and looking tired, but pleased.", parse);
						Text.NL();
						Text.Add("You help each other get dressed and you kiss her again before you leave. <i>“If you want to do it again... let me know,”</i> she says quietly. The two of you exit the dressing room together and return to the main area of the store.", parse);
					}
				}
				Text.Flush();
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(100, 3);
				Gui.NextPrompt(FeraScenes.Interact);
			}, enabled : cocksInVag.length >= 1,
			tooltip : "Have sex with Fera."
		});
	}
	if(fera.relation.Get() >= 20 && !fera.FirstVag().virgin) {
		options.push({ nameStr : "Standing",
			func : function() {
				Text.Clear();
				Text.Add("As you begin to remove your [botarmor], you tell Fera to pull up her dress and remove her panties. She does as you ask and stares intently at you, occasionally glancing down at your [cocks][ballsD].", parse);
				Text.NL();
				Text.Add("You motion to her to get down and lick your [cocks]. She eagerly kneels down and turns her attention to your [cock], running her tongue along its length", parse);
				if(player.NumCocks() > 1) {
					Text.Add(" while stroking your other dick[s2] with her hands", parse);
				}
				Text.Add(".", parse);
				Text.NL();
				if(p1Cock.length.Get() >= 18) {
					Text.Add("<i>“[ItsTheyre] so big, [playername].”</i> she purrs as she licks your [cocks].", parse);
					Text.NL();
				}
				Text.Add("Once your [cock] is coated in her saliva, you tell her that's enough for now. She stands up, waiting for your instructions, and you gently push her against the side wall of the dressing room. You kiss her roughly as you pull down her dress to reveal her [fbreasts] and begin to play with them. She purrs softly and pulls you closer.", parse);
				Text.NL();
				Text.Add("After playing with her [fbreasts] for a few minutes, you stand back slightly, and raise one of her legs. The cute catgirl breathes heavily as the tip of your [cock] touches her moist [fvag]. As you push inside her, she lets out a desperate moan and leans over to kiss you again.", parse);
				Text.NL();
				
				player.Fuck(p1Cock, 3);
				
				parse["c3"] = player.strapOn ? "tight, and strongly grip" : "warm and tight, and feel amazing";
				Text.Add("Unable to hold back any longer, you piston into her as she grabs one of her [fbreasts] and begins to squeeze it, eager for more pleasure. Her insides are [c3] around your [cock].", parse);
				Text.NL();
				
				if(fera.flags["Standing"] >= 3) {
					Text.Add("The cute catgirl moans lustfully with each thrust of your [cock], and has clearly grown to love this. You grab her other breast and fondle it roughly as you continue to kiss the catgirl. She puts her free arm around you and holds you tight.", parse);
					Text.NL();
					Text.Add("As you press against her, your [cock] goes deeper and the catgirl purrs at the sensation. You thrust even harder, urged on by her tightly squeezing cunny. Her nails dig into the back of your neck a little with each forceful thrust.", parse);
				}
				else {
					Text.Add("Fera lets out quiet moans as you push into her [fvag]. She stares into your [eyes], with a pleased look on her face. After a while, you decide to thrust faster, making the catgirl moan even louder. She quickly grabs her other breast and begins to play with her [fnips]. Fera is clearly enjoying this, despite having little experience. She pinches her stiff [fnips] and begins to twist them gently as she plays with her [fbreasts].", parse);
				}
				Text.NL();

				if(player.NumCocks() === 0) {
					Text.Add("Seeing her this turned on is a particularly satisfying treat. Her smile vanishes in surprise when you push your [cock] as deep into her [fvag] as it can go. She gasps in pleasure and cums soundlessly.",parse);
					Text.NL();
					Text.Add("You pull out of her, and she kneels down, lapping up the remaining juices from your [cock], gulping them down greedily. <i>“Thanks so much, [playername]...”</i> she says after licking her lips.", parse);
					Text.Add(" You put your [botarmor] back on, and help her fix her dress. You open the door and you both head back out to the store.", parse);
				}
				else {
					if(player.CumOutput() > 3) {
						parse["mc"] = player.NumCocks() > 1 ? Text.Parse(" as your other member[s2] spurt[notS2] all over the wall and her legs", parse) : "";
						Text.Add("After a while, you feel yourself approaching your limit. You push inside her as you cum, filling her [fvag] with your load[mc]. You stay inside her for a moment and kiss her again before pulling your [cock] out of her [fvag].", parse);
						Text.NL();
						Text.Add("A small stream of your seed flows out of her, forming a large puddle on the floor. Taking one of the rags from under the bench, and handing Fera the other, you help her wipe up the mess. She kneels down and cleans your [cocks][ballsD] with her tongue as you grab your [botarmor]. You help each other get dressed and leave the dressing room.", parse);
					}
					else {
						Text.Add("Despite your best efforts to hold back, you soon feel your [cocks] begin to twitch uncontrollably, and thrust as far inside her [fvag] as you can. Your [cock] spurts deep into her [fvag]", parse);
						if(player.NumCocks() > 1)
							Text.Add(" while your other cock[s2] spray[notS2] spunk onto the walls", parse);
						Text.Add(".", parse);
						Text.NL();
						Text.Add("You pull out of her, and she kneels down, lapping up the remaining juices from your [cocks], gulping them down greedily. <i>“Thanks so much, [playername]...”</i> she says after licking her lips.", parse);
						if(player.NumCocks() > 1)
							Text.Add(" Before getting back up, she grabs a small rag and uses it to wipe off the walls.", parse);
						Text.Add(" You put your [botarmor] back on, and help her fix her dress. You open the door and you both head back out to the store.", parse);
					}
				}
				Text.Flush();
				fera.flags["Standing"]++;
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(100, 2);
				Gui.NextPrompt(FeraScenes.Interact);
			}, enabled : cocksInVag.length >= 1,
			tooltip : "Do it while standing."
		});
		options.push({ nameStr : "Behind",
			func : function() {
				Text.Clear();
				Text.Add("As you quietly remove your [botarmor], your [cocks] flop[notS] out. Fera stares intently at your equipment as you tell her to pull her dress up and pull down her panties. With her mound now exposed, you press against her, putting your [cocks] between her legs. You begin to push back and forth, rubbing your [cocks] against the wet lips of her [fvag].", parse);
				Text.NL();
				parse["ballsD"] = player.HasBalls() ? Text.Parse(" and begin to drip down your [balls]", parse) : "";
				Text.Add("She purrs and pulls down her dress, presenting her [fbreasts] to you. Knowing what she wants, you grab her breasts and firmly squeeze them. The cute catgirl begins to squeeze her thighs together, increasing the stimulation on your [cocks]. Her juices coat your [cocks] as you thrust between her legs[ballsD].", parse);
				Text.NL();
				if(p1Cock.length.Get() >= 18)
					Text.Add("<i>“Your cock[s] [isAre] so big, [playername]... I can't wait anymore...”</i> Fera moans needily. ", parse);
				Text.Add("You kiss Fera deeply and pull your [cocks] out from between her thighs. Turning her around, you tell her to lean against the wall and spread her legs.", parse);
				Text.NL();
				if(fera.flags["Behind"] >= 3) {
					Text.Add("Fera spreads herself eagerly for you, leaning against the wall of the dressing room. She shakes her hips, inviting your [cocks] inside. From this angle, you can easily see her juices dripping from her [fvag] and down her legs. You walk over to her and playfully ask what she wants, your hand patting her exposed [fbutt].", parse);
					Text.NL();
					Text.Add("She flicks her tail, shaking her hips faster and lets out a whine. <i>“I want... your [cock], [playername].”</i> Acting unconvinced, you press the tip of your [cock] against the wet lips of her [fvag] and rub it gently. <i>“Please, [playername]... I want you inside me...”</i> she begs. Deciding she's had enough teasing, you push into her [fvag] forcefully, and are answered by a loud moan.", parse);
					Text.NL();
					
					player.Fuck(p1Cock, 3);
					
					parse["ballsD"] = player.HasBalls() ? Text.Parse(" and onto your [balls]", parse) : "";
					Text.Add("You reward her begging by thrusting hard, smacking her ass with each plunge. She purrs and moans as she begins to thrust back at you passionately. Fera takes one hand off the wall and begins to fondle one of her [fbreasts], as you increase the speed of your movements. Her juices are now flowing out and down your [cock][ballsD].", parse);
				}
				else {
					Text.Add("<i>“Okay...”</i> she says as she presses her hands against the wall. As she spreads her legs, you can see her [fvag] glistening with her juices. Not wanting to keep her waiting, you press your [cock] against her opening and push inside. She purrs softly and her tail swishes from side to side in excitement.", parse);
					Text.NL();
					
					player.Fuck(p1Cock, 3);
					
					Text.Add("Leaning over as you thrust into her, you reach around and grab her [fbreasts]. Fera moans quietly as you squeeze her tits, and ram your [cock] deep inside her. The catgirl pants and moans as you fuck her, and you think you feel her thrusting back a little. Your hands move up her [fbreasts], and you playfully twist her [fnips]. Thrusting harder, you can feel the warmth radiating from her [fvag], and a steady drip of her fluids hitting the floor.", parse);
				}
				Text.NL();
				
				parse["ballsD"]    = player.HasBalls() ? function() { return Text.Parse(" and [balls]", parse); } : "";
				
				if(player.NumCocks() === 0) {
						Text.Add("She mewls softly with each thrust, eventually pushing back into you firmly.", parse);
						Text.NL();
						Text.Add("You wrap your hands around her slender frame and press your [cock] deep into her [fvag] as she cums around you.", parse);
						Text.NL();
						Text.Add("Your [cock] slides out of her as she slumps against the wall breathing in short gasps. <i>“[playername], that was incredible!”</i>, she exhales, <i>“I may get addicted at this rate...”</i>", parse);
						Text.Add("When has regained her composure, she rises shakily to her feet, tosses you your [botarmor], and begins to get dressed. You help her fix her dress, give her a kiss, and follow her out to the main area of the store.", parse);
				}
				else {
					if(player.CumOutput() > 3) {
						Text.Add("With the intense stimulation of her tunnel, you can't help but near orgasm. With one final thrust, you push your [cock] deep into the cute catgirl's warm depths. As you cum, your [cock] fills her [fvag] with your seed", parse);
						if(player.NumCocks() > 1)
							Text.Add(" as your other member[s2] spurt[notS2] all over the floor and walls, making a huge, sticky mess", parse);
						Text.Add(". She purrs as your cum begins to leak out of her [fvag] and down her legs and the length of your [cock].", parse);
						Text.NL();
						Text.Add("You pull your [cock] out of her with a loud slurping sound and a wad of your spunk gushes out of her, splattering on the floor. Spent, you sit on the bench for a moment, feeling her rough tongue on your [cocks][ballsD]. She purrs in pleasure as she diligently licks up your cum, careful not to waste a single drop.", parse);
						Text.NL();
						Text.Add("When she is finished, she reaches under the bench to grab a rag and tosses you your [botarmor]. She wipes up the mess as you get dressed. You help her fix her dress, give her a kiss, and follow her out.", parse);
					}
					else {
						Text.Add("It doesn't take long until you feel you are about to cum, and you thrust firmly into her [fvag]. Your [cocks] erupt[notS], filling her hungry snatch with your spunk", parse);
						if(player.NumCocks() > 1)
							Text.Add(" as your other prick[s2] spurt[notS2] onto the floor", parse);
						Text.Add(". She mewls softly as you pull out your [cock], greedily wanting more.", parse);
						Text.NL();
						Text.Add("A little of your seed leaks out of her [fvag] and she kneels to lovingly clean your [cocks][ballsD] with her tongue. After she is finished, you help her fix her dress and grab your [botarmor]. You get dressed as she grabs a rag to clean up. Before you leave, you give the cute catgirl a hug and you leave the dressing room together.", parse);
						Text.NL();
					}
				}
				Text.Flush();
				fera.flags["Behind"]++;
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(100, 2);
				Gui.NextPrompt(FeraScenes.Interact);
			}, enabled : cocksInVag.length >= 1,
			tooltip : "Fuck her from behind."
		});
		if(fera.relation.Get() > 25)
		{
			options.push({ nameStr : "Anal",
				func : function() {
					p1Cock = player.BiggestCock(cocksInAss);
					Text.Clear();
					Text.Add("You order Fera to lift up her dress and take off her panties. Meanwhile, you take off your [botarmor], letting your [cocks][ballsD] hang free. She watches you unabashedly, waiting to hear what you have planned. Pressing her tightly against you, you reach around and grab her ass firmly. You tell her you are going to fuck her [fanus].", parse);
					Text.NL();
					Text.Add("Purring softly, she looks into your [eyes], her gaze filled with lust. Kneeling down, she licks your [cock] passionately, the long strokes of her tongue thoroughly coating it in her saliva.", parse);
					Text.NL();
					if(fera.relation.Get() >= 18) {
						Text.Add("<i>“I can't wait to have[oneof] your big cock[s] in my ass, [playername]...”</i> she says with a lusty look after a particularly long lick.", parse);
						Text.NL();
					}
					
					if(fera.Butt().virgin) {
						Text.Add("She stands back up and you kiss her again, running your tongue over her lips. You tell her to turn around, promising you'll be gentle. She nods at your request, smiling bashfully, and leans against the wall, spreading her legs. Licking two of your fingers, you spread her ass with your hands revealing her [fanus].", parse);
						Text.NL();
						Text.Add("You stick in one of your fingers slowly, probing her [fanus]. As you stick in another one, she tightens up and squeezes. You move your digits in and out a few times, spreading her [fanus] wide with them. She lets out a quiet moan as you pull them out, readying your [cock].", parse);
						Text.NL();
						parse["an"] = player.strapOn ? "" : " warm and";
						parse["an2"] =  player.strapOn ? "" : " and warmth";
						Text.Add("You press the tip against her anus, and push in firmly. She gasps quietly, and you can hear her breathing heavily. Her [fanus] is[an] very tight, almost too much so, as you struggle to move inside her. You tell her to relax, but it does little good. You do the best you can and make short thrusts, the tightness[an2] giving you most of the pleasure.", parse);
						Text.NL();
						
						fera.FuckAnal(fera.Butt(), p1Cock);
						player.Fuck(p1Cock, 3);
					}
					else if(fera.flags["Anal"] <= 3) {
						Text.Add("As she stands up, you motion for her to take her position and she turns around, spreading her legs while leaning against the wall. Whispering to her, you tell her to relax, and massage her [fbutt] as you ready your [cock]. You push the tip of your [cock] into her [fanus] and take it out again a few times to loosen her up a little.", parse);
						Text.NL();
						Text.Add("<i>“Just put it in already... don't tease me like this...”</i> she whines quietly. Eager to satisfy her request, you push inside her [fanus] and are soon as deep as you can get.", parse);
						Text.NL();
						
						player.Fuck(p1Cock, 3);
						
						Text.Add("You thrust slowly but firmly, savoring the feeling of her [fanus] on your [cock]. She pants loudly as you fuck her, clearly enjoying it. As you thrust inside her, you she squeezes down on your [cock], sending a wave of pleasure through you. In response, you pound into her harder, and she moans with each thrust of your [cock]. She reaches down with one hand and begins to play with her [fbreasts] as she makes small pushes back at you.", parse);
						Text.NL();
					}
					else {
						Text.Add("She quickly stands back up and eagerly leans against the wall, spreading her legs wide. Her tail swishes back and forth in excitement as you press the tip of your [cock] against her [fanus]. You push in forcefully, and she easily takes your entire length. Her experience with anal sex shows, as her passage accommodates you much more easily now.", parse);
						Text.NL();
						
						player.Fuck(p1Cock, 3);
						parse["an3"] = player.strapOn ? "" : " and warm";
						Text.Add("Her [fanus] is still tight[an3], but loose enough for you to move easily. Taking advantage of her obvious desire, you pound her hard and fast, and are rewarded by her desperate moans growing louder.", parse);
						Text.NL();
						Text.Add("<i>“Yes...”</i> she whispers, panting, <i>“more...”</i> As enjoyable as this is, you decide to make things more interesting. Grabbing hold of her tail, you give it a firm tug, causing her [fanus] to clamp down hard on your [cock], as a startled mew escapes from her mouth. Despite any pain from you tugging on her appendage, the catgirl seems to enjoy it immensely, and pants heavily.", parse);
						Text.NL();
						Text.Add("You thrust harder and harder into her tight ass, doing your best to please you both.", parse);
						if(player.HasBalls())
							Text.Add(" As you roughly pound her, your [balls] repeatedly smack against her [fvag], sending shivers of pleasure through her.", parse);
						Text.Add(" Between moans, she mewls encouragements at you, begging you to keep going, to take her harder and deeper.", parse);
						Text.NL();
					}
					
					if(player.NumCocks() === 0) {
						Text.Add("As she nears orgasm, you thrust deep inside her [fanus], bottoming out. She climaxes, and her shaking body slides off your [cock].", parse);
						Text.NL();
						Text.Add("She turns and kisses you sweetly. She lingers for awhile as your tongues dance and her warm lips embrace yours. You both regain your composure as you get dressed and follow her into the main store area.",parse);
					}
					else {
						if(player.CumOutput() > 3) {
							Text.Add("After a while, you near your limit and push your [cock] inside her with a forceful thrust. Your feel your [cocks] twitch violently as you climax. She mewls loudly as you fill her ass with your seed", parse);
							if(player.NumCocks() > 1)
								Text.Add(" while your other cock[s2] splatter[notS2] the wall with your cum", parse);
							Text.Add(". Soon, however, her [fanus] starts to overflow, and your cum spills out of her [fanus]. Some drips down your [cock], but much ends up on the floor.", parse);
							Text.NL();
							Text.Add("You pull out of her ass, unplugging her, and a wave of your spunk flows out of her between her legs as she happily kneels in front of you and licks your [cocks][ballsD] clean. When you are clean, she gets a large rag from the pile underneath the bench and wipes up the mess. You help each other get dressed and quickly kiss before leaving.", parse);
						}
						else {
							Text.Add("As you near your orgasm, thrusting deep inside her [fanus], bottoming out. You climax, and fill her ass with your seed", parse);
							if(player.NumCocks() > 1)
								Text.Add(" as your other prick[s2] splatter[notS2] the wall with your spunk", parse);
							Text.Add(". You pull out, and a large dollop of cum drips out of her ass, splattering on the floor.", parse);
							Text.NL();
							Text.Add("She licks any remaining cum off of your [cocks][ballsD], and grabs a rag to clean up. After helping each other get dressed, you kiss before walking out into the store.", parse);
						}
					}
					Text.Flush();
					fera.flags["Anal"]++;
					world.TimeStep({minute: 30});
					player.AddLustFraction(-1);
					fera.relation.IncreaseStat(100, 2);
					Gui.NextPrompt(FeraScenes.Interact);
				}, enabled : cocksInAss.length >= 1,
				tooltip : "Fuck Fera's ass."
			});
		}
		if(fera.relation.Get() > 30) {
			options.push({ nameStr : "Sitting",
				func : function() {
					Text.Clear();
					Text.Add("You sit down on the small bench and take off your [botarmor], showing off your [cocks][ballsD]. Fera waits impatiently in front of you, one of her hands pressing against her dress to massage her [fbreasts] while the other snakes inside her skirt, playing coyly with her nethers. She stares at you, a desperate look of lust in her eyes as she rubs herself.", parse);
					Text.NL();
					Text.Add("You gaze at her playfully, enjoying the show, and decide to watch for a while, letting the catgirl drive herself into an ever deeper heat. As she fondles herself harder, she falls to her knees and moans softly, letting out little whines. Clearly, she wants your [cocks], eager to taste your cum again.", parse);
					Text.NL();
					Text.Add("Watching her toy with herself is quite arousing and you begin to feel heat coursing through your body. Feeling your restraint eroding, you tell her that she's done enough, and that as a reward for being so good, she gets to put it in herself. Fera's big blue eyes light up as she pulls down the top of her dress, exposing her [fbreasts]. She stands up and hurries over to you, hurriedly exposing her lower body.", parse);
					Text.NL();
					parse["c4"] = player.strapOn ? " radiating heat to your groin" : "";
					Text.Add("Fera jumps into your lap, kissing you roughly while rubbing your [cocks] with her [fvag]. You can feel her warm, wet lips[c4] through her soaked panties as she rubs back and forth against you. The catgirl's juices have completely stained her white silk panties and are running down both of her legs. Her soft [fbreasts] press against your [breasts], and you feel her stiff [fnips] pushing against you.", parse);
					Text.NL();
					parse["c5"] = player.strapOn ? " dripping on your crotch" : Text.Parse(" thoroughly coating your [cocks]", parse);
					Text.Add("As she squeezes you tighter, you feel her juices[c5] even through her panties", parse);
					if(player.HasBalls())
						Text.Add(", and dripping down your [balls] onto the bench", parse);
					Text.Add(". After a little while, she stops, and lifts herself up while grabbing[oneof] your [cocks]. She uses the head of your [cock] to push her wet panties aside and puts the tip into her [fvag]. With the obstruction gone, Fera sits back down, shoving your entire length inside her [fvag] in one motion.", parse);
					Text.NL();
					
					player.Fuck(p1Cock, 3);
					
					parse["c6"] = player.strapOn ? "" : " warmer and";
					Text.Add("The initial sensation is intense, and her snatch feels[c6] wetter than usual. She looks into your [eyes], kissing you deeply as she begins to bounce in your lap.", parse);
					Text.NL();
					if(p1Cock.length.Get() >= 18) {
						Text.Add("<i>“Oh, [playername]... it's so big... it's wonderful...”</i> Fera moans as she squeezes around your [cock].", parse);
						Text.NL();
					}
					Text.Add("Taking turns bouncing and grinding, she does her best to stimulate your [cock]. You shudder at the pleasure running through you, and grab her [fbreasts] to try and return the favor.", parse);
					Text.NL();
					Text.Add("You squeeze her [fbreasts] firmly and begin to fondle her, your fingers occasionally pausing to circle and twist her [fnips] as she kisses you again. You try to hold your voices back to avoid discovery, but the sensation is too much, and loud moans escape both of you as Fera bounces desperately in your lap.", parse);
					Text.NL();
					
					if(player.NumCocks() === 0) {
						Text.Add("You squeeze her tightly as she cums, and she presses into your lap, grinding your [cock] deep inside her [fvag]. ", parse);
							Text.Add("As her orgasm subsides, she purrs and draws you close to give you a big kiss. <i>“I love you, [playername]... more than anyone else...”</i> she whispers with tears in her big blue eyes.", parse);
							Text.NL();
							Text.Add("You squeeze her, kissing her, and tell her that you love her too. Smiling, she gets up, letting your [cock] flop out of her [fvag] and hit the bench with a wet slap. Wanting to taste her favorite treat, she grabs your [cocks] and gently licks up her juices, the sight of it alone almost makes you want to go for a second round.", parse);
							Text.NL();
							Text.Add("Once you're clean, you grab a rag and help her clean up, grabbing your [arm]. After helping each other get dressed, you hug the cute catgirl tightly. <i>“Come visit again soon, [playername],”</i> she tells you as you leave the dressing room with her.", parse);
					}
					else {
						if(player.CumOutput() > 3) {
							Text.Add("You moan as your [cocks] begin[notS] to spurt [itsTheir] load[s]. Feeling your release, Fera presses down hard to take as much of you inside her as she can", parse);
							if(player.NumCocks() > 1) {
								Text.Add(" while your other cock[s2] erupt[notS2] all over the bench and floor", parse);
							}
							Text.Add(". She purrs loudly as you fill her needy hole and squeezes you tight, digging her nails into your back.", parse);
							Text.NL();
							parse["l3"] = player.HasLegs() ? " both your legs" : Text.Parse(" her legs and your [legs]", parse);
							Text.Add("You hold her close and kiss her roughly as your excess seed begins to leak out of her and onto[l3]. <i>“I love you so much, [playername]...”</i> she whispers softly. Squeezing her tight, you tell her that you love her too. You see tears in her eyes as she gets up.", parse);
							Text.NL();
							Text.Add("As she stands, your [cock] slides out of her with a loud slurping sound. A combined stream of your spunk and her juices flow out of her [fvag] and add to the mess already on the floor. She kneels down and leans in to lick your [cocks][ballsD] clean as always. Once you're clean, and she's licked up the stray strands of cum from her lips, you reach under the bench and throw her one of the larger rags, taking another one for yourself. You clean up the floor and bench, and she helps you get your [arm] back on.", parse);
							Text.NL();
							Text.Add("While you fix her dress for her, Fera kisses you one more time before leading you out. <i>“Come back soon,”</i> she tells you as you leave.", parse);
						}
						else {
							Text.Add("You squeeze her tightly as you cum, and she presses into your lap, taking your seed deep into her womb. ", parse);
							if(player.NumCocks() > 1) {
								Text.Add("Your other member[s2] squirt[notS2] onto the bench and the floor in front of you. ", parse);
							}
							Text.Add("As you fill her with your spunk, she purrs and draws you close to give you a big kiss. <i>“I love you, [playername]... more than anyone else...”</i> she whispers with tears in her big blue eyes.", parse);
							Text.NL();
							Text.Add("You squeeze her, kissing her, and tell her that you love her too. Smiling, she gets up, letting your [cock] flop out of her [fvag] and hit the bench with a wet slap. Wanting to taste her favorite treat, she grabs your [cocks] and gently licks up the cum, almost making you want to go for a second round.", parse);
							Text.NL();
							Text.Add("Once you're clean, you grab a rag and help her clean up, grabbing your [arm]. After helping each other get dressed, you hug the cute catgirl tightly. <i>“Come visit again soon, [playername],”</i> she tells you as you leave the dressing room with her.", parse);
						}
					}
					Text.Flush();
					world.TimeStep({minute: 30});
					player.AddLustFraction(-1);
					fera.relation.IncreaseStat(100, 2);
					Gui.NextPrompt(FeraScenes.Interact);
				}, enabled : cocksInVag.length >= 1,
				tooltip : "Have Fera sit on your lap and ride you."
			});
		}
	}
	if(options.length == 1)
		Gui.NextPrompt(options[0].func);
	else
		Gui.SetButtonsFromList(options);
}

export { Fera, FeraScenes };
