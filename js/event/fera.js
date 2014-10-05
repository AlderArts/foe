/*
 * 
 * Define Fera
 * 
 */
function Fera(storage) {
	Entity.call(this);

	// Character stats
	this.name = "Fera";
	
	// TODO: Set body
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 6;
	this.Butt().buttSize.base = 4;
	this.body.SetRace(Race.cat);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.cat, Color.brown);
	
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
	
	storage.flags   = this.flags;
	
	return storage;
}

Scenes.Fera = {};

// Schedule
Fera.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction
Scenes.Fera.Interact = function() {
	Text.Clear();
	
	if(!Scenes.Rigard.ClothShop.IsOpen()) {
		Text.AddOutput("The shop is closing, and you are asked to leave.");
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.ShopStreet.street);
		});
		return;
	}
	
	var cat = new RaceScore();
	cat.score[Race.cat] = 1;
	var catScore = cat.Compare(new RaceScore(player.body));
	
	var parse = {
		playername : player.name,
		sirmiss    : player.body.Gender() == Gender.male ? "sir" : "miss",
		breastDesc : function() { return player.FirstBreastRow().Short(); },
		
		fbreastDesc : function() { return fera.FirstBreastRow().Short(); }
	};
	
	Text.Clear();
	Text.AddOutput("Fera is a cute little catgirl. She has large blue eyes and short chestnut hair, brown fur with white spots, and large catlike ears and a tail. She is wearing a very nice looking pink dress with short sleeves and little ruffles along the edges. It is cut above her knees and shows off her slender form very nicely. Her chest is large for her overall size, but it is nothing compared to Miss Nexelle's. Her dress is cut around her [fbreastDesc] so that her cleavage is clearly visible.", parse);
	Text.Newline();
	
	if(fera.flags["Met"] == 0) {
		fera.flags["Met"] = 1;
		
		if(catScore > 0.2) {
			Text.AddOutput("Fera looks at you as you walk over to her and her big blue eyes go wide. Apparently she rarely sees other cat-morphs. She gets up and hurries over to meet you. <i>“Oh! Um... hello there. I'm Fera and I can help you if you need anything.”</i> she says cheerfully.", parse);
			fera.relation.IncreaseStat(100, 6);
		}
		else {
			Text.AddOutput("She stops working and turns to you as you approach her. <i>“Hello, [sirmiss], welcome to Silken Delights. My name is Fera; please let me know if I can help you with something.”</i>", parse);
		}
		Text.Newline();
		Text.AddOutput("You introduce yourself to her.", parse);
	}
	else {
		if(fera.relation.Get() > 25)
			Text.AddOutput("As you turn toward her, Fera has already hurried over. She jumps into your arms, and kisses you deeply. She seems very happy to see you...", parse);
		else if(fera.relation.Get() > 15)
			Text.AddOutput("As soon as she can see you, Fera smiles and runs over. She jumps into your arms and purrs softly as she rubs her head against your [breastDesc].", parse);
		else if(fera.relation.Get() > 5)
			Text.AddOutput("Fera looks happy to see you and quickly finishes what she was doing as you get closer. <i>“Hi [playername], how are you? Can I do something for you?”</i> she asks, looking at you intently.", parse);
		else if(fera.relation.Get() >= 0)
			Text.AddOutput("<i>“Oh, hello again, [playername]. Do you need something?”</i> she asks as you walk up to her.", parse);
		else
			Text.AddOutput("Fera quickly looks away, saying nothing, obviously angry at you.", parse);
	}
	//[Nexelle] [Fera] [Mother] [Shop] [City] [Touch] [Assistance] [Back]
	var options = new Array();
	options.push({ nameStr : "Nexelle",
		func : function() {
			// Set timer
			fera.nexelleTimer = new Time(0, 0, 0, 24 - world.time.hour);
			
			Text.Clear();
			Text.AddOutput("You ask the cute catgirl about her employer.", parse);
			Text.Newline();
			Text.AddOutput("<i>“Um... Miss Nexelle takes care of me and makes very nice clothes and she's usually very nice to people she likes. I just wish she wouldn't hit me so much. I do the best I can... it's not my fault I keep dropping and tearing things...”</i>", parse);
			Text.Newline();
					
			//[Encourage][Scold][Ignore]
			var options = new Array();
			options.push({ nameStr : "Encourage",
				func : function() {
					Text.AddOutput("You pat Fera on the head and tell her she does a good job and just needs to be more careful. Her face lights up in response to your praise.", parse);
					fera.relation.IncreaseStat(100, 1);
					Gui.NextPrompt(Scenes.Fera.Interact);
				}, enabled : true,
				tooltip : "Reassure Fera about her work."
			});
			options.push({ nameStr : "Scold",
				func : function() {
					Text.AddOutput("You tell Fera she should be ashamed to say such things about her caretaker and that it is her fault for constantly messing up. She looks down and seems saddened by your words.", parse);
					fera.relation.DecreaseStat(-100, 1);
					Gui.NextPrompt(Scenes.Fera.Interact);
				}, enabled : true,
				tooltip : "Scold her for badmouthing her beautiful employer."
			});
			options.push({ nameStr : "Ignore",
				func : function() {
					Scenes.Fera.Interact();
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
			Text.AddOutput("You ask Fera about herself.", parse);
			Text.Newline();
			if(fera.relation.Get() > 10)	
				Text.AddOutput("<i>“I um... really enjoy helping people try on things. I could help you if you want...”</i> she says innocently, letting her eyes roam over your body unabashedly. From her blush, it seems like she appreciates what she sees.", parse);
			else
				Text.AddOutput("<i>“Me? Um... I like milk, cream, and soft things. I've worked here for as long as I can remember. I carried things when I was small, and I sewed when I got bigger. I sometimes do errands for Miss Nexelle, thats the only time I really get to go out...”</i> she says sadly.", parse);
			Gui.NextPrompt(Scenes.Fera.Interact);
		}, enabled : true,
		tooltip : "Ask Fera about herself."
	});
	if(fera.flags["Mom"] == 1) {
		options.push({ nameStr : "Mother",
			func : function() {
				Text.Clear();
				Text.AddOutput("You ask Fera to tell you about her mother.", parse);
				Text.Newline();
				Text.AddOutput("Her eyes start to tear up at the question. <i>“My mom used to work here with Miss Nexelle, back when her mother ran the store. She was just as good if not better at making clothes. Even Miss Nexelle was nice to me back when my mom was here...”</i> she sniffles.", parse);
				Text.Newline();
				Text.AddOutput("<i>“But...she left one day and never came back. So I didn't have any other choice but to stay with Miss Nexelle, even though she hits me sometimes. I guess I should be grateful, but I miss her so much...”</i> You can see tears rolling down her cheeks.", parse);
				Text.Newline();
				
				//[Hold her] [Apologize] [Scoff] [Ignore]
				var options = new Array();
				options.push({ nameStr : "Hold her",
					func : function() {
						Text.AddOutput("You put an arm around Fera and stroke her head with your other hand. She winces slightly as you brush against a bruise on her scalp, but seems to relax as you pat her hair, soothing the pain. Her sobbing stops after a while and she looks up at you. <i>“Thank you... I'm so sorry about this, I just get so lonely...”</i>", parse);
						fera.relation.IncreaseStat(100,5);
						fera.flags["Mom"] = 2;
						Gui.NextPrompt(Scenes.Fera.Interact);
					}, enabled : true,
					tooltip : "Hold the poor lonely catgirl."
				});
				options.push({ nameStr : "Apologize",
					func : function() {
						Text.AddOutput("You apologize to Fera for making her cry. <i>“Its ok...”</i> she sniffs. <i>“I should get back before I get in trouble again...”</i>", parse);
						fera.relation.IncreaseStat(100,1);
						fera.flags["Mom"] = 2;
						Gui.NextPrompt(Scenes.Fera.Interact);
					}, enabled : true,
					tooltip : "Apologize for bringing up her mother."
				});
				options.push({ nameStr : "Scoff",
					func : function() {
						Text.AddOutput("Scoffing at her tears, you tell her that you find her whole situation and manner pathetic. You say that if she were stronger, none of these things would bother her. <i>“<b>You are so mean!</b>”</i> she yells as she starts to cry harder. Before you can say anything else, she runs off and heads behind the counter.", parse);
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
						Scenes.Fera.Interact();
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
			Text.AddOutput("<i>“We sell the nicest clothes!”</i> she exclaims. <i>“Everything here is so soft and nice...”</i> she purrs as she rubs her head against a nearby robe. <i>“Miss Nexelle makes such nice clothes... I wish I could make such nice things...”</i>", parse);
			Text.Newline();
			
			//[Encourage] [Realistic] [Ignore]
			var options = new Array();
			options.push({ nameStr : "Encourage",
				func : function() {
					Text.AddOutput("You smile and tell her that she could be that good if she works at it really hard. <i>“Really? You really think so, [playername]?”</i> She smiles and seems very happy that you believe in her.", parse);
					fera.relation.IncreaseStat(100,1);
					Gui.NextPrompt(Scenes.Fera.Interact);
				}, enabled : true,
				tooltip : "Encourage Fera."
			});
			options.push({ nameStr : "Realistic",
				func : function() {
					Text.AddOutput("You explain that Miss Nexelle has worked and practiced for years to be so good and that it is unlikely that she would get that good anytime soon. <i>“I know... I just wish I wasn't so clumsy...”</i> she says sadly.", parse);
					fera.relation.DecreaseStat(-100,1);
					Gui.NextPrompt(Scenes.Fera.Interact);
				}, enabled : true,
				tooltip : "Tell her not to get her hopes up."
			});
			options.push({ nameStr : "Ignore",
				func : function() {
					Scenes.Fera.Interact();
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
			Text.AddOutput("You ask Fera what she thinks of the city. <i>“Umm... I think morphs should be treated better. Many people in town are so mean to us just because we look different. It's not fair...”</i> she pouts.", parse);
			Text.Newline();
			
			
			//[Agree] [Disagree] [Ignore]
			var options = new Array();
			options.push({ nameStr : "Agree",
				func : function() {
					Text.AddOutput("You tell the cute catgirl that you agree with her that morphs should be treated better. <i>“I'm so glad you agree, [playername],”</i> she says with a smile.", parse);
					fera.relation.IncreaseStat(100,1);
					Gui.NextPrompt(Scenes.Fera.Interact);
				}, enabled : true,
				tooltip : "Agree with her."
			});
			options.push({ nameStr : "Disagree",
				func : function() {
					Text.AddOutput("Shaking your head, you tell her that you don't think its likely or possible for different creatures to be treated as well as humans. You explain that creatures who are different should be treated different. Unsurprisingly, she looks very angry at your words and hurries off, saying nothing.", parse);
					fera.relation.DecreaseStat(-100,2);
					Gui.NextPrompt(Scenes.Fera.Interact);
				}, enabled : true,
				tooltip : "Disagree with her."
			});
			options.push({ nameStr : "Ignore",
				func : function() {
					Scenes.Fera.Interact();
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
		func : Scenes.Fera.TouchPrompt, enabled : fera.fondleTimer.Expired(),
		tooltip : "Attempt to touch the cute catgirl."
	});
	options.push({ nameStr : "Assistance",
		func : Scenes.Fera.SexPrompt, enabled : true,
		tooltip : "Ask Fera to 'assist' you in the dressing room."
	});
	Gui.SetButtonsFromList(options, true);
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + fera.relation.Get()));
		Text.Newline();
	}
}

Scenes.Fera.TouchPrompt = function() {
	var parse = {
		breastDesc     : function() { return player.FirstBreastRow().Short(); },
		multiCockDesc  : function() { return player.MultiCockDesc(); },
		ballsDesc      : function() { return player.BallsDesc(); },
		vagDesc        : function() { return player.FirstVag().Short(); },
		lowerArmorDesc : function() { return player.LowerArmorDesc(); },
		against        : (player.FirstBreastRow().size.Get() > 3) ? "between" : "against",
		fbreastDesc    : function() { return fera.FirstBreastRow().Short(); },
		fnipsDesc       : function() { return fera.FirstBreastRow().NipsShort(); }
	};
	
	//[Cuddle][Fondle]
	var options = new Array();
	options.push({ nameStr : "Cuddle",
		func : function() {
			Text.Clear();
			if(fera.relation.Get() >= 5) {
				Text.AddOutput("Fera comes close and purrs as you pull her into your arms. She puts her arms around you and rubs her head [against] your [breastDesc] in return. Clearly she appreciates someone being kind to her.", parse);
				Gui.NextPrompt(Scenes.Fera.Interact);
				player.AddLustFraction(0.1);
			}
			else if(fera.relation.Get() >= 0) {
				Text.AddOutput("Fera looks up at you as you embrace her, looking very confused about why you're doing this. She doesn't seem to dislike it though.", parse);
				Gui.NextPrompt(Scenes.Fera.Interact);
				player.AddLustFraction(0.1);
			}
			else { // Negative
				Text.AddOutput("Fera quickly backs away as you try to hold her, staring at you angrily.", parse);
				fera.relation.DecreaseStat(-100, 3);
				// Set timer
				fera.timeout = new Time(0, 0, 0, 24 - world.time.hour);
				Gui.NextPrompt();
			}
			world.TimeStep({minute: 10});
		}, enabled : true,
		tooltip : "Hold Fera."
	});
	options.push({ nameStr : "Fondle",
		func : function() {
			Text.Clear();
			
			if(fera.relation.Get() >= 8) {
				Text.AddOutput("Taking Fera's hand, you lead her behind a large rack of clothes and have her turn around. Pulling down her dress, you pop out her [fbreastDesc]. You cup one of her [fbreastDesc] in each hand and proceed to massage them from behind. Fera purrs and moans as you squeeze her [fbreastDesc]. Shifting your hands up a bit, you rub her [fnipsDesc] with your fingers.", parse);
				Text.Newline();
				var noble = false;
				if(Math.random() < 0.25 && (world.time.hour >= 13 && world.time.hour < 17)) {
					noble = true;
					Text.AddOutput("A young noblewoman walks around the rack you are hiding behind and sees what you two are doing. She gasps quietly and quickly walks back the way she came. Before she gets very far, however, you hear her footsteps stop, and spot her head barely poking around the corner. Clearly she wants to watch the rest and you have no intention of disappointing her.", parse);
					Text.Newline();
				}
				if(player.FirstCock()) {
					Text.AddOutput("As you continue to play with her [fnipsDesc], you feel a hand on your [lowerArmorDesc], feeling for your [multiCockDesc]. She finds what she is looking for, her hand rubbing up and down your [multiCockDesc] as you continue to play with her [fbreastDesc]. As you fondle her [fbreastDesc] harder, she accelerates her pace on your [multiCockDesc]. The two of you moan almost in unison as you please each other.", parse);
					Text.Newline();
				}
				if(player.HasBalls())
					Text.AddOutput("Fera's slender hand moves down to your [ballsDesc], cupping them as best she can through your [lowerArmorDesc]. She massages them as firmly as she can, and you squeeze her [fnipsDesc] in return. You give one of her ears a gentle nip as you continue to fondle each other. After a short while you whisper for her to stop - she is doing a very good job and you don't want to soil your [lowerArmorDesc].", parse);
				else if(player.FirstVag())
					Text.AddOutput("You feel Fera's hand reaching around your [lowerArmorDesc] until she finds the folds of your [vagDesc]. You squeeze her [fbreastDesc] tighter as you feel her fingers rub up and down your [vagDesc]. She responds by trying to force her finger inside you through your [lowerArmorDesc]. The sudden sensation causes you to pinch her [fnipsDesc], which only makes her push harder. You both moan softly as you do your best to please each other.", parse);
				Text.Newline();
				Text.AddOutput("After this continues for a few minutes she whispers, <i>“I should get back to work, Miss Nexelle might notice...”</i> You reluctantly let go of her and Fera fixes her dress then turns around, gives you a quick kiss and hurries back to work.", parse);
				if(noble)
					Text.AddOutput(" You look over, but can no longer see the noblewoman. You hope she enjoyed the show.", parse);

				fera.relation.IncreaseStat(100,2);
				player.AddLustFraction(0.3);
				Gui.NextPrompt(Scenes.Fera.Interact);
			}
			else if(fera.relation.Get() >= 0) {
				Text.AddOutput("You lead Fera behind one of the large clothing racks, hiding the two of you from view. The cute catgirl lets out a quiet gasp and she blushes when you grab hold of her [fbreastDesc] and start to play with them through her clothes. She looks up at you with tears in her big blue eyes and a frightened face. Feeling a little guilty, you let go of her [fbreastDesc] and Fera runs off without saying a word.", parse);
				// Set timer
				fera.fondleTimer = new Time(0, 0, 0, 24 - world.time.hour);
				player.AddLustFraction(0.1);
				Gui.NextPrompt();
			}
			else {
				Text.AddOutput("Fera quickly backs away as you approach her. She glares at you angrily.", parse);
				
				fera.relation.DecreaseStat(-100, 3);
				// Set timer
				fera.timeout = new Time(0, 0, 0, 24 - world.time.hour);
				Gui.NextPrompt();
			}
			world.TimeStep({minute: 10});
			
		}, enabled : true,
		tooltip : "Play with her breasts."
	});
	
	Gui.SetButtonsFromList(options, true, Scenes.Fera.Interact);
}

Scenes.Fera.SexPrompt = function() {
	var cocksInVag = player.CocksThatFit(fera.FirstVag());
	var cocksInAss = player.CocksThatFit(fera.Butt());
	
	var p1Cock = player.BiggestCock(cocksInVag);
	
	var parse = {
		playername     : player.name,
		lowerArmorDesc : player.LowerArmorDesc(),
		cockDesc       : function() { return p1Cock.Short(); },
		cockDesc2      : function() { return player.AllCocks()[1].Short(); },
		cockTip        : function() { return p1Cock.TipShort(); },
		multiCockDesc  : function() { return player.MultiCockDesc(); },
		breastDesc     : function() { return player.FirstBreastRow().Short(); },
		nipsDesc       : function() { return player.FirstBreastRow().NipsShort(); },
		ballsDesc      : function() { return player.BallsDesc(); },
		vagDesc        : function() { return player.FirstVag().Short(); },
		clitDesc       : function() { return player.FirstVag().ClitShort(); },
		tongueDesc     : function() { return player.TongueDesc(); },
		eyeDesc        : function() { return player.EyeDesc(); },
		fbreastDesc    : function() { return fera.FirstBreastRow().Short(); },
		fnipsDesc      : function() { return fera.FirstBreastRow().NipsShort(); },
		fvagDesc       : function() { return fera.FirstVag().Short(); },
		fclitDesc      : function() { return fera.FirstVag().ClitShort(); },
		fbuttDesc      : function() { return fera.Butt().Short(); },
		fanusDesc      : function() { return fera.Butt().AnalShort(); }
	};
	
	if(player.body.Gender() != Gender.male && Math.random() < 0.5)
		parse["garment"] = "dress";
	else
		parse["garment"] = "robe";
	
	parse["oneof"]     = player.NumCocks() > 1 ? " one of" : "";
	parse["eachof"]    = player.NumCocks() > 1 ? " each of" : "";
	parse["s"]         = player.NumCocks() > 1 ? "s" : "";
	parse["notS"]      = player.NumCocks() > 1 ? "" : "s";
	parse["isAre"]     = player.NumCocks() > 1 ? "are" : "is";
	parse["itThem"]    = player.NumCocks() > 1 ? "them" : "it";
	parse["itsTheir"]  = player.NumCocks() > 1 ? "their" : "its";
	parse["itsTheyre"] = player.NumCocks() > 1 ? "They're" : "It's";
	
	var breasts = player.FirstBreastRow().size.Get() > 3;
	parse["balls"] = player.HasBalls() ? function() { return Text.Parse(" and [ballsDesc]", parse); } : "";
	parse["toparmor"] = (player.Armor() && player.Armor().EquipType != ItemType.FullArmor) ? " and " + player.ArmorDesc() : "";

	Text.Clear();
	Text.AddOutput("You decide you want to have some fun with Fera, and tell her you need some help trying something on.", parse);
	Text.Newline();
	if(fera.relation.Get() >= 20) {
		Text.AddOutput("Before you can say anything else, Fera grabs a [garment] and drags you to the dressing rooms in the back. She opens one and pulls you in, locking the door behind you. Staring at you with lust-filled eyes, there is no question what's on her mind.", parse);
	}
	else if(fera.relation.Get() >= 0) {
		Text.AddOutput("She nods and waits for you to select a garment. After taking a random [garment] off the rack you motion for Fera to follow you. You enter one of the dressing rooms and quietly close the door after she follows you in. She looks at you, waiting for instruction on what to do next.", parse);
	}
	else { // NEGATIVE
		Text.AddOutput("Fera glances at you angrily and says, <i>“I'm busy right now, do it yourself.”</i>", parse);
		fera.relation.DecreaseStat(-100, 1);
		Gui.NextPrompt();
		return;
	}
	Text.Newline();
	Text.AddOutput("Upon arriving in the dressing room, you admire the cute catgirl. You stroke her head gently as you look over her various attributes. Thinking as you stroke her, you consider what to do.", parse);
	
	//[Try on][Give oral][Get oral][Titfuck][Sex][Standing][Behind][Anal][Sitting]
	var options = new Array();
	options.push({ nameStr : "Try on",
		func : function() {
			p1Cock = player.BiggestCock();
			
			Text.Clear();
			Text.AddOutput("You hand Fera the [garment] and tell her you need help trying it on.", parse);
			Text.Newline();
			
			if(fera.relation.Get() < 10) {
				Text.AddOutput("She looks away as you remove your [lowerArmorDesc]. When you are finished she hands you the [garment] and moves behind you to help you get it on.", parse);
				Text.Newline();
				
				if(breasts) {
					Text.AddOutput("You put the [garment] over your head, but pretend to have trouble getting it over your [breastDesc]. Fera reaches around you and tries to help you pull it over them. As she reaches around you, her soft [fbreastDesc] presses against your back.", parse);
					Text.Newline();
					Text.AddOutput("Her hands fondle your [breastDesc] roughly, trying to pull the [garment] down. After a few moments, the [garment] slides down and she gives your [breastDesc] a final cup to make sure the [garment] fits.", parse);
					Text.Newline();
				}
				
				if(player.FirstCock()) {
					Text.AddOutput("As the [garment] goes down over your [multiCockDesc], it gets stuck on[oneof] your member[s]. You tell Fera to help you and she lets out a small whine. She reaches around you with one hand and tries to pull the [garment] down without touching your [multiCockDesc]. It's a futile effort, however.", parse);
					Text.Newline();
					Text.AddOutput("She uses one hand to hold down your [multiCockDesc], while pulling the [garment] over [itThem] with the other. As she pulls the snugly fitting fabric over your member[s], you can feel her [fbreastDesc] pressing into your back. They are soft but firm, and you press back slightly as she pulls the [garment] over your [multiCockDesc].", parse);
					Text.Newline();
				}
				Text.AddOutput("Once you have the tight-fitting [garment] on, you ask Fera how it looks. She shyly inspects you and says: <i>“It looks very nice, [playername].”</i>", parse);
				Text.Newline();
				if(player.FirstCock()) {
					Text.AddOutput("You notice her eyes are focusing on your [multiCockDesc] as she looks at you. Clearly she knows what to look for, even if she won't directly compliment you on [itThem].", parse);
					Text.Newline();
				}
				if(breasts) {
					Text.AddOutput("Letting her gaze wander, she stares intently at your [breastDesc], and turns her head to look at them from every angle. She seems to really like how the [garment] looks on you, in particular around your chest.", parse);
					Text.Newline();
				}
				Text.AddOutput("You thank Fera for helping you and say you will consider buying the [garment]. She nods happily and move behind you again to help you take to [garment] off. You purposely press back against her as she lifts the [garment] for you, trying to feel her [fbreastDesc] as well as you can with your back. Once the [garment] is off, she excuses herself and leaves you to get your clothes back on.", parse);
				fera.relation.IncreaseStat(15, 1);
				player.AddLustFraction(0.1);
				world.TimeStep({minute: 15});
			}
			else if(fera.relation.Get() < 20) {
				Text.AddOutput("Fera nods excitedly and helps you remove your [lowerArmorDesc][toparmor].", parse);
				Text.Newline();
				
				if(p1Cock) {
					parse["br"] = breasts ? Text.Parse(" and [breastDesc]", parse) : ""
					Text.AddOutput("She takes the time to feel your [multiCockDesc][br] as much as she can while you strip. You can also feel her [fbreastDesc] rubbing against you constantly, along with her stiff [fnipsDesc]. She helps you put the [garment] over your head and then begins to pull it down. Running her hands over your [breastDesc], she feels for a good fit.", parse);
					Text.Newline();
					Text.AddOutput("The [garment] slides down to your [multiCockDesc], forcing her to reach down to help get it past the obstruction[s]. She holds your [multiCockDesc] down while stroking them gently and pulls the [garment] down with her other hand. While she does this, her stiff [fnipsDesc] dig into your back a little as she holds you tight. She then rubs her hands over your [multiCockDesc] a few times, massaging [itThem] firmly while making sure that the [garment] fits.", parse);
					Text.Newline();
					Text.AddOutput("The catgirl then moves back and admires how nice the [garment] looks on you. You notice her eyes tend to stay on your [multiCockDesc] however, but you let her stare for a while. A few moments later, you ask her to help you take the [garment] off again, and she quickly gets behind you.", parse);
					Text.Newline();
					Text.AddOutput("She rubs her [fbreastDesc] against you repeatedly while she pulls the [garment] off your body. Once it is off, she puts it aside and helps you put your [lowerArmorDesc][toparmor] back on. You give the cute catgirl a big hug as you leave together.", parse);
				}
				else {
					Text.AddOutput("She presses against you constantly as she helps you disrobe, rubbing her [fbreastDesc] against you as much as she can. You then raise your arms and try to put the [garment] on. She pulls it down for you, still pressing her firm [fbreastDesc] against your back. You can feel her stiff [fnipsDesc] press into you as she does and you press back gently.", parse);
					Text.Newline();
					Text.AddOutput("Once the [garment] is on, she circles around you and begins to fondle you gently. She feels up your [breastDesc] and rubs them a bit, making sure the [garment] fits well. Her hands soon descend to your hips, and she feels along them while tugging the [garment] gently. Seemingly happy, she sits back and admires you for a moment. You run your hands along your body while she does, and you hear her purr softly.", parse);
					Text.Newline();
					Text.AddOutput("After telling her you like it, you ask for help taking the [garment] off, and she takes her position behind you. She begins to lift the [garment] , but does so slowly and takes time to feel every curve of your body. As she lifts the [garment] over your head she presses against you once again, and you feel her [fbreastDesc].", parse);
					Text.Newline();
					Text.AddOutput("The catgirl then helps you get dressed, again taking her time and touching you far more than necessary. You thank Fera and you both leave the dressing room.", parse);
				}
				
				player.AddLustFraction(0.2);
				fera.relation.IncreaseStat(20, 2);
				world.TimeStep({minute: 15});
			}
			else { // >= 20
				Text.AddOutput("Fera tilts her head at your shallow attempt at feigning decency and stares at you knowingly. She clearly knows what you really want. Realizing that there is no reason to pretend anymore, you sit on the bench and remove your [lowerArmorDesc][toparmor]. The cute catgirl stares at your body lustfully and pulls her dress down, revealing her [fbreastDesc].", parse);
				Text.Newline();
				
				if(player.FirstCock()) {
					Text.AddOutput("As she walks over to you, Fera pulls up her dress before sitting in your lap. She gives you a big kiss and your feel her [fbreastDesc] pressing against your [breastDesc]. Her [fnipsDesc] are hard, and she rubs them around your [breastDesc] to stimulate you as kiss her. You can feel her [fvagDesc] rubbing along your [multiCockDesc] through her wet panties.", parse);
					Text.Newline();
					Text.AddOutput("After a while she scoots back a bit, and you feel a hand on your [multiCockDesc]. She strokes your [multiCockDesc] gently while rubbing [itThem] against her wet panties. You can feel the warm lips for her [fvagDesc] through the wet silk, and it only stimulates you more. She leans over a bit to kiss you deeper, and her [fbreastDesc] push firmly against your [breastDesc].", parse);
					Text.Newline();
					Text.AddOutput("You reach under and cup her [fbreastDesc], and begin to massage them as she stimulates your [multiCockDesc]. After a few minutes, you feel your climax approaching and Fera quickly gets up and kneels before your [multiCockDesc]. She puts the head of[oneof] your [multiCockDesc] into her mouth and begins to stroke it rapidly.", parse);
					Text.Newline();
					
					if(player.CumOutput() > 3) {
						Text.AddOutput("Your [multiCockDesc] spray[notS] [itsTheir] seed, and the catgirl struggles to try and swallow your enitre load. ", parse);
						if(player.NumCocks() > 1)
							Text.AddOutput("As she gulps futilely, your other [multiCockDesc] cum all over the floor and make a mess. ", parse);
						Text.AddOutput("She pulls your [cockDesc] out of her mouth, wiping it as she catches her breath.", parse);
						Text.Newline();
						Text.AddOutput("Afterwards, the catgirl licks[eachof] your [multiCockDesc][balls] as well as her hands clean. She gives your softening [multiCockDesc] a few playful strokes as she kisses you one more time. Fera then helps you get dressed and you help her clean up before she leads out of the dressing room.", parse);
					}
					else {
						Text.AddOutput("The catgirl eagerly gulps down your cum as your [multiCockDesc] blow[notS] [itsTheir] load[s]. Once she finishes, Fera licks her lips happily and proceeds to lick[eachof] your [multiCockDesc][balls] clean with her rough tongue.", parse);
						Text.Newline();
						Text.AddOutput("She fetches a rag and wipes up the mess, while your get your [lowerArmorDesc][toparmor] back on. You give the cute catgirl a passionate kiss and walk her out of the dressing room.", parse);
					}
				}
				else if(player.FirstVag()) {
					Text.AddOutput("You stand up and walk toward the catgirl only to have her eagerly push you up against the wall of the dressing room. She gives your face a long lick as she fondles your [breastDesc] lovingly. Feeling a need to return the favor, you grab her [fbreastDesc] and massage them firmly.", parse);
					Text.Newline();
					Text.AddOutput("As you play with each other, she leans in to kiss you. At the same time, you feel one of her hands move to your [vagDesc] and begin to rub her fingers along it. You moan quietly as you feel her push inside your [vagDesc]. She then begins to rub your inner walls with one of her fingers, rubbing against your [clitDesc] with her tiny palm.", parse);
					Text.Newline();
					Text.AddOutput("Unable to do much else, you squeeze her [fbreastDesc] harder and rub her [fnipsDesc] with your fingers as she pleasures you. She presses against your harder, and you can feel her [fbreastDesc] against your stomach.", parse);
					Text.Newline();
					Text.AddOutput("She puts another finger into your [vagDesc] and she spreads your wet folds with her digits. You can feel her nails digging into your [vagDesc] slightly as she spreads you wide open, and you let out a small whine. She looks into your eyes, and you can see she is enjoying teasing you immensely.", parse);
					Text.Newline();
					Text.AddOutput("<i>“You want me to keep going? I can stop if you want...”</i> she says with a smirk. You nod desperately, and she smiles and resumes fingering your [vagDesc]. As you continue to please each other, you can see her tail swishing excitedly.", parse);
					Text.Newline();
					Text.AddOutput("A few minutes later you can take no more, and your body tenses as you orgasm. Fera pulls her wet fingers out of your [vagDesc] and helps you remain standing as you legs weaken slightly. Your breathing slows as you cuddle with her for a moment.", parse);
					Text.Newline();
					Text.AddOutput("Afterwards, she helps you get dressed and leads you out.", parse);
				}
				
				world.TimeStep({minute: 30});
				player.AddSexExp(1);
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(20, 2);
			}
			
			Gui.NextPrompt(Scenes.Fera.Interact);
		}, enabled : true,
		tooltip : "Have Fera help you try something on."
	});
	// GIVE ORAL
	if(fera.relation.Get() >= 10) {
		options.push({ nameStr : "Give oral",
			func : function() {
				Text.Clear();
				Text.AddOutput("You instruct Fera to sit on the small bench, spread her legs and lift up her dress. She does as you command, the dress' pink ruffles bunched around her waist, and you kneel on the floor in front of her. Pushing aside her white silk panties, you reveal her [fvagDesc]. Pulling in close, you begin to lick it gently, tasting her sweet folds with your [tongueDesc].", parse);
				Text.Newline();
				Text.AddOutput("Her juices are already flowing freely from her opening, coating her lower lips in a salty, but not unpleasant moisture. She begins to moan softly as you gently play with her [fclitDesc], which only encourages you more.  Licking harder, you push your tongue against her slit, running it all the way up and down her [fvagDesc].", parse);
				Text.Newline();
				Text.AddOutput("Barely getting started, you spread her [fvagDesc] with your fingers. A thin strand of her juices connecting the sides of her enticing opening. You push your [tongueDesc] inside, the firm walls pressing in around you. Fera begins panting lustfully, clearly enjoying your efforts.", parse);
				Text.Newline();
				Text.AddOutput("Wanting more, she puts a hand on your head, gently pushing you in closer, your nose pressing against her cute clit. Obliging, you respond by sticking your [tongueDesc] inside her as far as it will go, tasting her deepest parts. <i>“Please...”</i> she moans.", parse);
				Text.Newline();
				Text.AddOutput("Understanding her desire, you continue your pleasurable assault. She begins to purr with each lick of your [tongueDesc], encouraging you to lick faster. After a few minutes she pushes you down hard, shoving your face into her nethers. You feel her body tense, a shudder running through her. Reaching her climax, the catgirl mewls softly as she rides out her orgasm.", parse);
				Text.Newline();
				Text.AddOutput("<i>“Thanks, [playername]. That felt really good...”</i> she says as she fixes her dress. You kiss and head back into the store.", parse);
				
				world.TimeStep({minute: 30});
				player.AddSexExp(1);
				player.AddLustFraction(0.3);
				fera.relation.IncreaseStat(30, 2);
				Gui.NextPrompt(Scenes.Fera.Interact);
			}, enabled : true,
			tooltip : "Eat out Fera."
		});
		// GET ORAL
		options.push({ nameStr : "Get oral",
			func : function() {
				Text.Clear();
				if(player.FirstCock()) {
					p1Cock = player.BiggestCock();
					
					parse["balls"] = player.HasBalls() ? function() { return Text.Parse(" and [ballsDesc]", parse); } : "";
					parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
					
					Text.AddOutput("Whispering quietly, you tell Fera to please your [multiCockDesc] with her mouth. She smiles and nods as she waits for you to undress. You sit on the small bench and take off your [lowerArmorDesc], revealing your [multiCockDesc][balls].", parse);
					Text.Newline();
					
					if(player.FirstCock().length.Get() > 25) {
						Text.AddOutput("Upon seeing your [multiCockDesc], the cute catgirl's eyes widen in shock. <i>“[itsTheyre] <b>huge</b>, [playername]! But I'll try my best...”</i> Fera says with a nervous smile. You give her a gentle push, telling her to assume a kneeling position in front of you. Clearly, she's intimidated by your sheer size.", parse);
						Text.Newline();
					}
					
					Text.AddOutput("Obediently, Fera kneels in front of you and takes[oneof] your [multiCockDesc] in her hands, beginning to stroke it gently. She licks the salty pre off the head of your [cockDesc], with her rough, catlike tongue.", parse);
					Text.Newline();
					Text.AddOutput("The sensation is incredible and you shudder as she begins to lick up and down the entire length of[oneof] your [multiCockDesc]. She puts as much as she can of your [cockDesc] into her warm mouth and begins to suck, while her tongue laps up and down the bottom of your shaft. Looking up at you to see how she is faring, she seems pleased with the look of ecstasy on your face.", parse);
					Text.Newline();
					if(player.NumCocks() == 2) {
						Text.AddOutput("You feel her hand on your other [cockDesc2], jerking it roughly as she continues to lick your [cockDesc] lovingly. She proceeds to switch cocks and puts the second of your [multiCockDesc] into her mouth while she strokes the first. The cute catgirl goes back and forth between your [multiCockDesc], paying each equal attention.", parse);
						Text.Newline();
					}
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.AddOutput("Realizing she's been neglecting your other parts, she takes your [ballsDesc] into her hand and begins to massage them firmly. She continues to lovingly suck your [cockDesc], using her tongue to stimulate the head of your [cockDesc]. Squeezing your [ballsDesc] tightly, Fera makes you shudder from the combined stimulation.", parse);
						Text.Newline();
					}, 1.0, function() { return player.HasBalls(); });
					scenes.AddEnc(function() {
						parse["twoof"] = player.NumCocks() > 3 ? " two of" : "";
						Text.AddOutput("Fera shifts her hands onto[twoof] your other cocks, and begins to jerk them roughly. Her mouth pops off your [cockDesc], and she takes a different one into her mouth. Clearly she wants to please as much of you as she can, and she takes turns sucking and jerking each of your [multiCockDesc]. You cannot help but admire her passionate efforts.", parse);
						Text.Newline();
					}, 1.0, function() { return player.NumCocks() > 2; });
					scenes.Get();
					
					if(fera.flags["Blowjob"] > 3) {
						Text.AddOutput("Her experience with your [multiCockDesc] shows, as you are just barely able to restrain yourself. She has clearly learned what you like, and has become adept at pleasing you. The cute catigrl loves sucking your [multiCockDesc], and loves the taste of your cum even more. She takes your [cockDesc] as far into her throat as she can, trying to speed up the delivery of her favorite salty treat.", parse);
					}
					else {
						Text.AddOutput("Despite her inexperience, she is surprisingly good at this, perhaps in part due to her catgirl nature. She is trying very hard to please you, and you got to admire her dedication. Placing a hand on her head, you gently stroke her hair. She closes her eyes as she continues sucking your [cockDesc] and purrs softly.", parse);
					}
					
					Text.Newline();
					
					if(player.CumOutput() > 3) {
						Text.AddOutput("Finally, you are unable to hold back any longer and you cum hard. Fera tries her best to swallow your load, but it is too much for her and it starts to spurt out of her mouth, spreading all over the floor.", parse);
						if(player.NumCocks() > 1) {
							parse["s"]    = player.NumCocks() > 1 ? "s" : "";
							parse["notS"] = player.NumCocks() > 1 ? "" : "s";
							Text.AddOutput(" Your other member[s] also erupt[notS], hosing the walls of the dressing room and making a big mess.", parse);
						}
						Text.AddOutput(" She licks up as much as she can off your [multiCockDesc][balls], completely entranced.", parse);
						Text.Newline();
						Text.AddOutput("She grabs a large rag from a pile under the bench and quickly wipes the floor more-or-less clean. <i>“Was it good for you?”</i> she anxiously asks, as she finishes cleaning up, a worried look in her large eyes. You nod empathetically, putting your [lowerArmorDesc] back on and follow her out of the dressing room.", parse);
					}
					else {
						Text.AddOutput("You soon reach your limit under her passionate service, cumming hard. She swallows your load greedily, gently licking your [multiCockDesc][balls] clean. <i>“Your cum tastes so good, [playername]...”</i> she murmurs, licking her lips. Gently patting her head, you promise to give her more later. She purrs happily, handing you your [lowerArmorDesc]. Putting it back on, you leave the dressing room together.", parse);
					}
					
					fera.flags["Blowjob"]++;
				}
				else { // Vag
					Text.AddOutput("You sit down on the small bench and remove your [lowerArmorDesc], spreading your legs to reveal your [vagDesc]. Fera gets on her knees and begins to lick it tenderly with her rough, catlike tongue. It feels incredible, and you cannot help but moan at the intense pleasure running up your spine.", parse);
					Text.Newline();
					Text.AddOutput("The cute catgirl seems to be enjoying herself as well, and you can see her blue eyes looking up at you as she licks your [vagDesc] enthusiastically. Her fingers shift to play with your [clitDesc], pinching it while she continues licking. Fera's tongue reaches deeper inside your [vagDesc], its roughness pleasant against your walls.", parse);
					Text.Newline();
					if(player.FirstBreastRow().size.Get() > 3) {
						Text.AddOutput("You grab hold of your [breastDesc], and begin to fondle them roughly[toparmor]. Using your fingers to twist and stimulate your [nipsDesc], you enjoy the catgirl's tongue as it licks your inner walls. Moaning softly, you squeeze your [breastDesc] harder with each lick. The sensations of your body are so intense that you can't take much more.", parse);
						Text.Newline();
					}
					Text.AddOutput("She pulls open the folds of your [vagDesc] and sticks her tongue into your depths. You feel her cute nose rub against your [clitDesc] as she licks as deeply as she possibly can. The sensations from her tongue in your depths sends you over the edge. Your body tenses as you reach orgasm, and you cum hard. Fera smiles and looks very pleased as she licks your juices off her lips. She helps you get dressed and you give her a big kiss before walking back out to the shop.", parse);
				}
				
				player.AddSexExp(1);
				
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(20, 2);
				Gui.NextPrompt(Scenes.Fera.Interact);
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
				Text.AddOutput("You sit on the small bench and take off your [lowerArmorDesc], revealing your [multiCockDesc][balls]. Speaking quietly so as to not alert the tailor, you tell Fera that you want her to use her [fbreastDesc] to pleasure your [multiCockDesc].", parse);
				Text.Newline();
				Text.AddOutput("She nods and pulls her dress down revealing her [fbreastDesc] and erect [fnipsDesc], kneeling in front of you. The catgirl rubs[oneof] your [multiCockDesc] with her hands, and puts it between her soft [fbreastDesc]. She gives your [cockDesc] a gentle squeeze with her [fbreastDesc] and leans down to lick up all of your salty pre. Fera starts moving up and down slowly, massaging your [cockDesc] wih her [fbreastDesc]. Each time it nears her face, she gives your [cockDesc] a little kiss before continuing to rub it with her [fbreastDesc].", parse);
				Text.Newline();
				Text.AddOutput("You moan softly as she pleasures you, which only encourages the cute catgirl more. After a few minutes she stops moving, and squeezes down hard on your [multiCockDesc] with her [fbreastDesc]. Sticking out her tongue, she takes the [cockTip] of[oneof] your [multiCockDesc] into her mouth and licks around it with her rough tongue. She passionately licks around the [cockTip] of your [cockDesc], some of her saliva escaping her mouth and starting to drip down your [cockDesc]. You shudder at her ministrations, which only makes her squeeze all the harder.", parse);
				Text.Newline();
				Text.AddOutput("Finally you near your limit and your [multiCockDesc] begin[notS] to twitch, prompting her to lick faster, pressing her tongue more firmly against your [cockDesc]. The catgirl moves up and down, clamping down on you as hard as possible.", parse);
				Text.Newline();
				
				player.AddSexExp(1);
					
				parse["s"]        = player.NumCocks() > 2 ? "s" : "";
				parse["notS"]     = player.NumCocks() > 2 ? "" : "s";
				parse["itsTheir"] = player.NumCocks() > 2 ? "their" : "its";
				
				if(player.CumOutput() > 3) {
					Text.AddOutput("You cum violently, and she struggles to swallow it all", parse);
					if(player.NumCocks() > 1) {
						Text.AddOutput(", while your other cock[s] spray[notS] [itsTheir] load all over the walls of the dressing room", parse);
					}
					Text.AddOutput(". However, your seed soon starts to leak out from her mouth and run down your [multiCockDesc] and all over her [fbreastDesc], although, cupping her hands, she barely manages to keep most of it off her dress.", parse);
					Text.Newline();
					Text.AddOutput("She happily licks up as much as she can off your [multiCockDesc] and herself, and grabs a rag from under the bench to clean up the rest. You put your [lowerArmorDesc] back on, and help her clean. After fixing her dress as best you can, you give Fera a quick hug and lead her out into the store.", parse);
				}
				else  {
					Text.AddOutput("Your [multiCockDesc] spurt[notS] forcefully as you cum, filling her mouth with your seed", parse);
					if(player.NumCocks() > 1) {
						Text.AddOutput(", while your other cock[s] shoot[notS] your seed onto the walls", parse);
					}
					Text.AddOutput(". With small gulps she slowly swallows it all, taking time to savor her favorite salty treat. After she's done, she licks the rest of your [multiCockDesc][balls] clean, and grabs one of the rags under the small bench to wipe off the walls. You get your [lowerArmorDesc] back on, and give her a kiss. Together, you exit the dressing room.", parse);
				}
				
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(20, 2);
				Gui.NextPrompt(Scenes.Fera.Interact);
			}, enabled : player.FirstCock(),
			tooltip : Text.Parse("Have Fera please you with her [fbreastDesc].", parse)
		});
	}
	if(fera.relation.Get() >= 20 && fera.FirstVag().virgin) {
		options.push({ nameStr : "Sex",
			func : function() {
				Text.Clear();
				Text.AddOutput("You hold her tightly and ask Fera if she wants to have sex with you.", parse);
				Text.Newline();
				Text.AddOutput("<i>“Um... I've never...”</i> she stammers. Pulling her face up to meet yours, you ask again if she wants to. She looks deeply into your [eyeDesc]s. <i>“You are the only person I have ever wanted to do this with, [playername]. I'll try my best...”</i>", parse);
				Text.Newline();
				Text.AddOutput("With a smile you tell Fera to sit on the bench, lift up her dress and remove her panties. She does as you ask while you take off your [lowerArmorDesc]. Her eyes stare intently at your [multiCockDesc] as you pull down her dress to reveal her [fbreastDesc].", parse);
				Text.Newline();
				if(p1Cock.length.Get() >= 18) {
					Text.AddOutput("<i>“You're so big, [playername]... will it fit?”</i> the cute catgirl asks nervously. Sensing her apprehension, you put a hand on her head and stroke her as you promise that everything will be fine.", parse);
					Text.Newline();
				}
				Text.AddOutput("You kiss her deeply and your [tongueDesc] intertwines with hers as you fondle her [fbreastDesc] roughly.", parse);
				Text.Newline();
				Text.AddOutput("She reaches down and grabs[oneof] your [multiCockDesc], stroking it slowly. After a minute, you interrupt her, and pull back, telling her to lick your [cockDesc] instead. She gently licks the entire length of your [cockDesc], coating it in her saliva. You ready yourself to fuck her as she stares at you nervously.", parse);
				Text.Newline();
				Text.AddOutput("Stroking her cheek, you ask her if she's ready. The cute catgirl nods slightly, and you move down between her legs, rubbing the head of your [cockDesc] against her [fvagDesc] gently. You push inside slowly, trying to be gentle with her, but she still winces as your tip forces itself inside her opening. You see a trickle of blood from from her tearing hymen, as she mewls slightly in pain.", parse);
				Text.Newline();
				
				fera.FuckVag(fera.FirstVag(), p1Cock);
				player.Fuck(p1Cock, 5);
				
				Text.AddOutput("You reassure her that it will get better, and she'll feel good soon, and she nods shyly for you to continue, biting her lower lip.", parse);
				Text.Newline();
				Text.AddOutput("Her entrance is very warm and tight, and the feeling on your [cockDesc] is fantastic. Soon, you are as deep as you can go, and start making short, gentle thrusts. As you lean over to kiss her, she reaches up toward you and puts her arms around you. You hug her back without stopping your thrusts. With your caresses, she quickly starts to relax and it gets easier to move inside her, letting you accelerate your pace.", parse);
				Text.Newline();
				Text.AddOutput("A quiet moan escapes her, and she squeezes you tighter. The moan is followed by more, and they grow louder, as she clamps down on you with her legs. You figure it is finally starting to feel good for her and pound harder into her warm depths.", parse);
				Text.Newline();
				
				parse["s"]        = player.NumCocks() > 2 ? "s" : "";
				parse["notS"]     = player.NumCocks() > 2 ? "" : "s";
				
				if(player.NumCocks() === 0) {
					Text.AddOutput("You can tell she's getting close and as you bury yourself as deep as you can she clamps down on your [cockDesc] and struggles to keep her voice down.", parse);
					Text.Newline();
					Text.AddOutput("You pull out your [cockDesc], and look to see Fera breathing heavily and looking tired, but pleased.", parse);
					Text.Newline();
					Text.AddOutput("You help each other get dressed and you kiss her again before you leave. <i>“If you want to do it again... let me know,”</i> she says quietly. The two of you exit the dressing room together and return to the main area of the store.", parse);
				}
				else {
					if(player.CumOutput() > 3) {
						Text.AddOutput("You feel yourself going over the edge, and give one last hard thrust, burying yourself as deep as you can. You cum hard, and your huge load fills up her [fvagDesc]", parse);
						if(player.NumCocks() > 1)
							Text.AddOutput(", as your other cock[s] spurt[notS] cum all over the floor and walls, making a big mess", parse);
						Text.AddOutput(". However there is not enough room in her [fvagDesc] for your load and it starts to gush out and drip down your [multiCockDesc]. Pulling out your [cockDesc], you see the cute catgirl is panting heavily, looking up happily at you.", parse);
						Text.Newline();
						Text.AddOutput("You help Fera clean up and fix her clothes, and she helps you with your [lowerArmorDesc]. She comes close and embraces you. <i>“We can do it again sometime... if you want...”</i> she says while rubbing her head against your [breastDesc]. You open the dressing room door and let Fera return to work.", parse);
					}
					else {
						Text.AddOutput("As you reach your limit, you push yourself in to the hilt. You shoot your load deep inside her [fvagDesc]", parse);
						if(player.NumCocks() > 1)
							Text.AddOutput(" as your other cock[s] spurt[notS] your cum all over the floor", parse);
						Text.AddOutput(". As you pull out your [cockDesc], you look to see Fera breathing heavily and looking tired, but pleased.", parse);
						Text.Newline();
						Text.AddOutput("You help each other get dressed and you kiss her again before you leave. <i>“If you want to do it again... let me know,”</i> she says quietly. The two of you exit the dressing room together and return to the main area of the store.", parse);
					}
				}
			
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(100, 3);
				Gui.NextPrompt(Scenes.Fera.Interact);
			}, enabled : cocksInVag.length >= 1,
			tooltip : "Have sex with Fera."
		});
	}
	if(fera.relation.Get() >= 20 && !fera.FirstVag().virgin) {
		options.push({ nameStr : "Standing",
			func : function() {
				Text.Clear();
				Text.AddOutput("As you begin to remove your [lowerArmorDesc], you tell Fera to pull up her dress and remove her panties. She does as you ask and stares intently at you, occasionally glancing down at your [multiCockDesc][balls].", parse);
				Text.Newline();
				Text.AddOutput("You motion to her to get down and lick your [multiCockDesc]. She eagerly kneels down and turns her attention to your [cockDesc], running her tongue along its length", parse);
				if(player.NumCocks() > 1) {
					parse["s"] = player.NumCocks() > 2 ? "s" : "";
					Text.AddOutput(", while stroking your other dick[s] with her hands", parse);
				}
				Text.AddOutput(".", parse);
				Text.Newline();
				if(p1Cock.length.Get() >= 18) {
					Text.AddOutput("<i>“[itsTheyre] so big, [playername].”</i> she purrs as she licks your [multiCockDesc].", parse);
					Text.Newline();
				}
				Text.AddOutput("Once your [cockDesc] is coated in her saliva, you tell her that's enough for now. She stands up, waiting for your instructions, and you gently push her against the side wall of the dressing room. You kiss her roughly as you pull down her dress to reveal her [fbreastDesc] and begin to play with them. She purrs softly and pulls you closer.", parse);
				Text.Newline();
				Text.AddOutput("After playing with her [fbreastDesc] for a few minutes, you stand back slightly, and raise one of her legs. The cute catgirl breathes heavily as the tip of your [cockDesc] touches her moist [fvagDesc]. As you push inside her, she lets out a desperate moan and leans over to kiss you again.", parse);
				Text.Newline();
				
				player.Fuck(p1Cock, 3);
				
				Text.AddOutput("Unable to hold back any longer, you piston into her, as she grabs one of her [fbreastDesc] and begins to squeeze it, eager for more pleasure. Her insides are warm and tight, and feel amazing around your [cockDesc].", parse);
				Text.Newline();
				
				if(fera.flags["Standing"] >= 3) {
					Text.AddOutput("The cute catgirl moans lustfully with each thrust of your [cockDesc], and has clearly grown to love this. You grab her other [fbreastDesc] and fondle it roughly as you continue to kiss the catgirl. She puts her free arm around you and holds you tight.", parse);
					Text.Newline();
					Text.AddOutput("As you press against her, your [cockDesc] goes deeper and the catgirl purrs at the sensation. You thrust even harder, urged on by her tightly squeezing [fvagDesc]. Her nails dig into the back of your neck a little with each forceful thrust.", parse);
				}
				else {
					Text.AddOutput("Fera lets out quiet moans as you push into her [fvagDesc]. She stares into your [eyeDesc]s, with a pleased look on her face. After a while you decide to thrust faster, making the catgirl moan even louder. She quickly grabs her other [fbreastDesc] and begins to play with her [fnipsDesc]. Fera is clearly enjoying this, despite having little experience. She pinches her stiff [fnipsDesc] and begins to twist them gently as she plays with her [fbreastDesc].", parse);
				}
				Text.Newline();

				if(player.NumCocks() === 0) {
					Text.AddOutput("Seeing her this turned on is a particularly satisfying treat. Her smile vanishes in surprise when you push your [cockDesc] as deep into her [fvagDesc] as it can go. She gasps in pleasure and cums soundlessly.",parse);
					Text.Newline();
					Text.AddOutput("You pull out of her, and she kneels down, licking the remaining juices from your [multiCockDesc], gulping them down greedily. <i>“Thanks so much, [playername]...”</i> she says after licking her lips.", parse);
					Text.AddOutput(" You put your [lowerArmorDesc] back on, and help her fix her dress. You open the door and you both head back out to the store.", parse);
				}
				else {
					if(player.CumOutput() > 3) {
						parse["mc"] = player.NumCocks() > 1 ? Text.Parse(" as your other member[s] spurt[notS] all over the wall and her legs", parse) : "";
						Text.AddOutput("After a while, you feel yourself approaching your limit. You push inside her as you cum, filling her [fvagDesc] with your load[mc]. You stay inside her for a moment and kiss her again, before pulling your [cockDesc] out of her [fvagDesc].", parse);
						Text.Newline();
						Text.AddOutput("A small stream of your seed flows out of her, forming a large puddle on the floor. Taking one of the rags from under the bench, and handing Fera the other, you help her wipe up the mess. She kneels down and cleans your [multiCockDesc][balls] with her tongue as you grab your [lowerArmorDesc]. You help each other get dressed and leave the dressing room.", parse);
					}
					else {
						Text.AddOutput("Despite your best efforts to hold back, you soon feel your [multiCockDesc] begin to twich uncontrollably thrust as far inside her [fvagDesc] as you can. Your [cockDesc] spurts deep into her [fvagDesc]", parse);
						if(player.NumCocks() > 1)
							Text.AddOutput(" while your other cock[s] spray[notS] spunk onto the walls", parse);
						Text.AddOutput(".", parse);
						Text.Newline();
						Text.AddOutput("You pull out of her, and she kneels down, licking the remaining juices from your [multiCockDesc], gulping them down greedily. <i>“Thanks so much, [playername]...”</i> she says after licking her lips.", parse);
						if(player.NumCocks() > 1)
							Text.AddOutput(" Before getting back up, she grabs a small rag and uses it to wipe off the walls.", parse);
						Text.AddOutput(" You put your [lowerArmorDesc] back on, and help her fix her dress. You open the door and you both head back out to the store.", parse);
					}
				}
				
				fera.flags["Standing"]++;
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(100, 2);
				Gui.NextPrompt(Scenes.Fera.Interact);
			}, enabled : cocksInVag.length >= 1,
			tooltip : "Do it while standing."
		});
		options.push({ nameStr : "Behind",
			func : function() {
				Text.Clear();
				Text.AddOutput("As you quietly remove your [lowerArmorDesc], your [multiCockDesc] flop out. Fera stares intently at your equipment as you tell her to pull her dress up and pull down her panties. With her mound now exposed, you press against her, putting your [multiCockDesc] between her legs. You begin to push back and forth, rubbing your [multiCockDesc] against the wet lips of her [fvagDesc].", parse);
				Text.Newline();
				parse["balls"] = player.HasBalls() ? Text.Parse(" and begin to drip down your [ballsDesc]", parse) : "";
				Text.AddOutput("She purrs and pulls down her dress, presenting her [fbreastDesc] to you. Knowing what she wants, you grab her [fbreastDesc] and firmly squeeze them. The cute catgirl begins to squeeze her thighs together, increasing the stimulation on your [multiCockDesc]. Her juices coat your [multiCockDesc] as you thrust between her legs[balls].", parse);
				Text.Newline();
				if(p1Cock.length.Get() >= 18)
					Text.AddOutput("<i>“Your cock[s] [isAre] so big, [playername]...I can't wait anymore...”</i> Fera moans needily. ", parse);
				Text.AddOutput("You kiss Fera deeply and pull your [multiCockDesc] out from between her legs. Turning her around, you tell her to lean against the wall and spread her legs.", parse);
				Text.Newline();
				if(fera.flags["Behind"] >= 3) {
					Text.AddOutput("Fera spreads her legs eagerly for you, leaning against the wall of the dressing room. She shakes her hips, inviting your [multiCockDesc] inside. From this angle, you can easily see her juices dripping from her [fvagDesc] and down her legs. You walk over to her and playfully ask what she wants, your hand patting her exposed [fbuttDesc].", parse);
					Text.Newline();
					Text.AddOutput("She flicks her tail, shaking her hips faster and lets out a whine. <i>“I want... your [cockDesc], [playername].”</i> Acting unconvinced, you press the tip of your [cockDesc] against the wet lips of her [fvagDesc] and rub it gently. <i>“Please, [playername]... I want you inside me...”</i> she begs. Deciding she's had enough teasing, you push into her [fvagDesc] forcefully, and are answered by a loud moan.", parse);
					Text.Newline();
					
					player.Fuck(p1Cock, 3);
					
					parse["balls"] = player.HasBalls() ? Text.Parse(" and onto your [ballsDesc]", parse) : "";
					Text.AddOutput("You reward her begging by thrusting hard, smacking her ass with each thrust. She purrs and moans as she begins to thrust back at you passionately. Fera takes one hand off the wall and begins to fondle one of her [fbreastDesc], as you increase the speed of your thrusts. Her juices are now flowing out and down your [cockDesc][balls].", parse);
				}
				else {
					Text.AddOutput("<i>“Okay...”</i> she says as she presses her hands against the wall. As she spreads her legs, you can see her [fvagDesc] glistening with her juices. Not wanting to keep her waiting, you press your [cockDesc] against her opening and push inside. She purrs softly and her tail swishes from side to side in excitement.", parse);
					Text.Newline();
					
					player.Fuck(p1Cock, 3);
					
					Text.AddOutput("Leaning over as you thrust into her, you reach around and grab her [fbreastDesc]. Fera moans quietly as you squeeze her [fbreastDesc], and ram your [cockDesc] deep inside her. The catgirl pants and moans as you fuck her, and you think you feel her thrusting back a little. Your hands move up her [fbreastDesc], and you playfully twist her [fnipsDesc]. Thrusting harder, you can feel the warmth radiating from her [fvagDesc], and a steady drip of her fluids hitting the floor.", parse);
				}
				Text.Newline();
				
				parse["s"]        = player.NumCocks() > 2 ? "s" : "";
				parse["notS"]     = player.NumCocks() > 2 ? "" : "s";
				parse["balls"]    = player.HasBalls() ? function() { return Text.Parse(" and [ballsDesc]", parse); } : "";
				
				if(player.NumCocks() === 0) {
						Text.AddOutput("She mewls softly with each thrust, eventually pushing back into you firmly.", parse);
						Text.Newline();
						Text.AddOutput("You wrap your hands around her slender frame and press your [cockDesc] deep into her [fvagDesc] as she cums around you.", parse);
						Text.Newline();
						Text.AddOutput("Your [cockDesc] slides out of her as she slumps against the wall breathing in short gasps. <i>“[playername] that was incredible!”</i>, she exhales, <i>“I may get addicted at this rate...”</i>", parse);
						Text.AddOutput("When has regained her composure, she rises shakily to her feet, tosses you your [lowerArmorDesc], and begins to get dressed. You help her fix her dress, give her a kiss, and follow her out to the main area of the store.", parse);
				}
				else {
					if(player.CumOutput() > 3) {
						Text.AddOutput("With the intense stimulation of her tunnel, you can't help but near orgasm. With one final thrust, you push your [cockDesc] deep into the cute catgirl's warm depths. As you cum, your [cockDesc] fills her [fvagDesc] with your seed", parse);
						if(player.NumCocks() > 1)
							Text.AddOutput(" as your other member[s] spurt[notS] all over the floor and walls, making a huge, sticky mess", parse);
						Text.AddOutput(". She purrs as your cum begins to leak out of her [fvagDesc] and down her legs and the length of your [cockDesc].", parse);
						Text.Newline();
						Text.AddOutput("You pull your [cockDesc] out of her with a loud slurping sound and a wad of your spunk gushes out of her, splattering on the floor. Spent, you sit on the bench for a moment, feeling her rough tongue on your [multiCockDesc][balls]. She purrs in pleasure as she diligently licks up your cum, careful not to waste a single drop.", parse);
						Text.Newline();
						Text.AddOutput("When she is finished, she reaches under the bench to grab a rag and tosses you your [lowerArmorDesc]. She wipes up the mess as you get dressed. You help her fix her dress, give her a kiss, and follow her out.", parse);
					}
					else {
						Text.AddOutput("It doesn't take long until you feel you are about to cum, and you thrust firmly into her [fvagDesc]. Your [multiCockDesc] erupt[notS], filling her hungry snatch with your spunk", parse);
						if(player.NumCocks() > 1)
							Text.AddOutput(" as your other prick[s] spurt[notS] onto the floor", parse);
						Text.AddOutput(". She mewls softly as you pull out your [cockDesc], greedily wanting more.", parse);
						Text.Newline();
						Text.AddOutput("A little of your seed leaks out of her [fvagDesc] and she kneels to lovingly clean your [multiCockDesc][balls] with her tongue. After she is finished, you help her fix her dress and grab your [lowerArmorDesc]. You get dressed as she grabs a rag to clean up. Before you leave you give the cute catgirl a hug and you leave the dressing room together.", parse);
						Text.Newline();
					}
				}
				
				fera.flags["Behind"]++;
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				fera.relation.IncreaseStat(100, 2);
				Gui.NextPrompt(Scenes.Fera.Interact);
			}, enabled : cocksInVag.length >= 1,
			tooltip : "Fuck her from behind."
		});
		if(fera.relation.Get() > 25)
		{
			options.push({ nameStr : "Anal",
				func : function() {
					p1Cock = player.BiggestCock(cocksInAss);
					Text.Clear();
					Text.AddOutput("You order Fera to lift up her dress and take off her panties. Meanwhile, you take off your [lowerArmorDesc], letting your [multiCockDesc][balls] hang free. She watches you unabashedly, waiting to hear what you have planned. Pressing her tightly against you, you reach around and grab her ass firmly. You tell her you are going to fuck her [fanusDesc].", parse);
					Text.Newline();
					Text.AddOutput("Purring softly, she looks into your [eyeDesc]s, her gaze filled with lust. Kneeling down, she licks your [cockDesc] passionately, the long strokes of her tongue thoroughly coating it in her saliva.", parse);
					Text.Newline();
					if(fera.relation.Get() >= 18) {
						Text.AddOutput("<i>“I can't wait to have[oneof] your big cock[s] in my ass, [playername]...”</i> she says with a lusty look after a particularly long lick.", parse);
						Text.Newline();
					}
					
					if(fera.Butt().virgin) {
						Text.AddOutput("She stands back up and you kiss her again, running your tongue over her lips. You tell her to turn around, promising you'll be gentle. She nods at your request, smiling bashfully, and leans against the wall, spreading her legs. Licking two of your fingers, you spread her ass with your hands revealing her [fanusDesc].", parse);
						Text.Newline();
						Text.AddOutput("You stick in one of your fingers slowly, probing her [fanusDesc]. As you stick in your second finger, she tightens up and squeezes. You move your fingers in and out a few times, spreading her [fanusDesc] wide with them. She lets out a quiet moan as you pull them out, readying your [cockDesc].", parse);
						Text.Newline();
						Text.AddOutput("You press the tip against her [fanusDesc], and push in firmly. She gasps quietly, and you can hear her breathing heavily. Her [fanusDesc] is warm and very tight, almost too much so, as you struggle to move inside her. You tell her to relax, but it does little good. You do the best you can and make short thrusts, the tightness and warmth giving you most of the pleasure.", parse);
						Text.Newline();
						
						fera.FuckAnal(fera.Butt(), p1Cock);
						player.Fuck(p1Cock, 3);
					}
					else if(fera.flags["Anal"] <= 3) {
						Text.AddOutput("As she stands up, you motion for her to take her position and she turns around, spreading her legs while leaning against the wall. Whispering to her, you tell her to relax, and massage her [fbuttDesc] as you ready your [cockDesc]. You push the tip of your [cockDesc] into her [fanusDesc] and take it out again a few times to loosen her up a little.", parse);
						Text.Newline();
						Text.AddOutput("<i>“Just put it in already... don't tease me like this...”</i> she whines quietly. Eager to satisfy her request, you push inside her [fanusDesc] and are soon as deep as you can get.", parse);
						Text.Newline();
						
						player.Fuck(p1Cock, 3);
						
						Text.AddOutput("You thrust slowly but firmly, savoring the feeling of her [fanusDesc] on your [cockDesc]. She pants loudly as you fuck her, clearly enjoying it. As you thrust inside her, you she squeezes down on your [cockDesc], sending a wave of pleasure through you. In response, you pound into her harder, and she moans with each thrust of your [cockDesc]. She reaches down with one hand and begins to play with her [fbreastDesc], as she makes small thrusts back at you.", parse);
						Text.Newline();
					}
					else {
						Text.AddOutput("She quickly stands back up and eagerly leans against the wall, spreading her legs wide. Her tail swishes back and forth in excitement as you press the tip of your [cockDesc] against her [fanusDesc]. You push in forcefully, and she easily takes your entire length. Her experience with anal sex shows, as her passage accommodates you much more easily now.", parse);
						Text.Newline();
						
						player.Fuck(p1Cock, 3);
						
						Text.AddOutput("Her [fanusDesc] is still tight and warm, but loose enough for you to move easily. Taking advantage of her obvious desire, you pound her hard and fast, and are rewarded by her desperate moans growing louder.", parse);
						Text.Newline();
						Text.AddOutput("<i>“Yes...”</i> she whispers, panting, <i>“more...”</i> As enjoyable as this is, you decide to make things more interesting. Grabbing hold of her tail, you give it a firm tug, causing her [fanusDesc] to clamp down hard on your [cockDesc], as a startled mew escapes from her mouth. Despite any pain from you tugging on her tail, the catgirl seems to enjoy it immensely, and pants heavily.", parse);
						Text.Newline();
						Text.AddOutput("You thrust harder and harder into her tight ass, doing your best to please you both.", parse);
						if(player.HasBalls())
							Text.AddOutput(" As you roughly pound her, your [ballsDesc] repeatedly smack against her [fvagDesc], sending shivers of pleasure through her.", parse);
						Text.AddOutput(" Between moans, she mewls encouragements at you, begging you to keep going, to take her harder and deeper.", parse);
						Text.Newline();
					}
					
					parse["s"]        = player.NumCocks() > 2 ? "s" : "";
					parse["notS"]     = player.NumCocks() > 2 ? "" : "s";
					
					if(player.NumCocks() === 0) {
						Text.AddOutput("As she nears orgasm, you thrust deep inside her [fanusDesc], bottoming out. she climaxes, and her shaking body slides off your [cockDesc].", parse);
						Text.Newline();
						Text.AddOutput("She turns and kisses you sweetly. She lingers for awhile as your tongues dance and her warm lips embrace yours. You both regain your composure as you get dressed and follow her into the main store area.",parse);
					}
					else {
						if(player.CumOutput() > 3) {
							Text.AddOutput("After a while, you near your limit and push your [cockDesc] inside her with a forceful thrust. Your feel your [multiCockDesc][notS] twitch violently as you climax. She mewls loudly as you fill her ass with your seed", parse);
							if(player.NumCocks() > 1)
								Text.AddOutput(" while your other cock[s] splatter[notS] the wall with your cum", parse);
							Text.AddOutput(". Soon, however, her [fanusDesc] starts to overflow, and your cum spills out of her [fanusDesc]. Some drips down your [cockDesc], but much ends up on the floor.", parse);
							Text.Newline();
							Text.AddOutput("You pull out of her ass, unplugging her, and a wave of your spunk flows out of her between her legs as she happily kneels in front of you and licks your [multiCockDesc][balls] clean. When you are clean, she gets a large rag from the pile underneath the bench and wipes up the mess. You help each other get dressed and quickly kiss before leaving.", parse);
						}
						else {
							Text.AddOutput("As you near your orgasm, thrusting deep inside her [fanusDesc], bottoming out. You climax, and fill her ass with your seed", parse);
							if(player.NumCocks() > 1)
								Text.AddOutput(" as your other prick[s] splatter[notS] the wall with your seed", parse);
							Text.AddOutput(". You pull out, and a large dollop of cum drips out of her ass, splattering on the floor.", parse);
							Text.Newline();
							Text.AddOutput("She licks any remaining cum off of your [multiCockDesc][balls], and grabs a rag to clean up. After helping each other get dressed you kiss before walking out into the store.", parse);
						}
					}

					fera.flags["Anal"]++;
					world.TimeStep({minute: 30});
					player.AddLustFraction(-1);
					fera.relation.IncreaseStat(100, 2);
					Gui.NextPrompt(Scenes.Fera.Interact);
				}, enabled : cocksInAss.length >= 1,
				tooltip : "Fuck Fera's ass."
			});
		}
		if(fera.relation.Get() > 30) {
			options.push({ nameStr : "Sitting",
				func : function() {
					Text.Clear();
					Text.AddOutput("You sit down on the small bench and take off your [lowerArmorDesc], showing off your [multiCockDesc][balls]. Fera waits impatiently in front of you, one of her hands pressing against her dress to massage her [fbreastDesc], while the other snakes inside her skirt, playing coyly with her nethers. She stares at you, a desperate look of lust in her eyes as she rubs herself.", parse);
					Text.Newline();
					Text.AddOutput("You gaze at her playfully, enjoying the show, and decide to watch for a while, letting the catgirl drive herself into an ever deeper heat. As she fondles herself harder she falls to her knees and moans softly, letting out little whines. Clearly she wants your [multiCockDesc], eager to taste your cum again.", parse);
					Text.Newline();
					Text.AddOutput("Watching her toy with herself is quite arousing and you begin to feel heat coursing through your body. Feeling your restraint eroding, you tell her that she's done enough, and that as a reward for being so good, she gets to put it in herself. Fera's big blue eyes light up as she pulls down the top of her dress, exposing her [fbreastDesc]. She stands up and hurries over to you, hurriedly exposing her lower body.", parse);
					Text.Newline();
					Text.AddOutput("Fera jumps into your lap, kissing you roughly while rubbing your [multiCockDesc] with her [fvagDesc]. You can feel her warm, wet lips through her soaked panties as she rubs back and forth against you. The catgirl's juices have completely stained her white silk panties and are running down both of her legs. Her soft [fbreastDesc] press against your [breastDesc], and you feel her stiff [fnipsDesc] push against you.", parse);
					Text.Newline();
					Text.AddOutput("As she squeezes you tighter, you feel her juices thoroughly coating your [multiCockDesc] even through her panties", parse);
					if(player.HasBalls())
						Text.AddOutput(", and dripping down your [ballsDesc] onto the bench", parse);
					Text.AddOutput(". After a little while, she stops, and lifts herself up while grabbing[oneof] your [multiCockDesc]. She uses the head of your [cockDesc] to push her wet panties aside and puts the tip into her [fvagDesc]. With the obstruction gone, Fera sits back down, shoving your entire length inside her [fvagDesc] in one motion.", parse);
					Text.Newline();
					
					player.Fuck(p1Cock, 3);
					
					Text.AddOutput("The initial sensation is intense, and her snatch feels warmer and wetter than usual. She looks into your [eyeDesc]s, kissing you deeply as she begins to bounce in your lap.", parse);
					Text.Newline();
					if(p1Cock.length.Get() >= 18) {
						Text.AddOutput("<i>“Oh, [playername]... it's so big... it's wonderful...”</i> Fera moans as she squeezes around your [cockDesc].", parse);
						Text.Newline();
					}
					Text.AddOutput("Taking turns bouncing and grinding, she does her best to stimulate your [cockDesc]. You shudder at the pleasure running through you, and grab her [fbreastDesc] to try and return the favor.", parse);
					Text.Newline();
					Text.AddOutput("You squeeze her [fbreastDesc] firmly and begin to fondle her, your fingers occasionally pausing to circle and twist her [fnipsDesc], as she kisses you again. You try to hold your voices back to avoid discovery, but the sensation is too much, and loud moans escape both of you, as Fera bounces desperately in your lap.", parse);
					Text.Newline();
					
					if(player.NumCocks() === 0) {
						Text.AddOutput("You squeeze her tightly as she cums, and she presses into your lap, grinding your [cockDesc] deep inside her [fvagDesc]. ", parse);
							Text.AddOutput("As her orgasm subsides she purrs and draws you close to give you a big kiss. <i>“I love you, [playername]... more than anyone else...”</i> she whispers with tears in her big blue eyes.", parse);
							Text.Newline();
							Text.AddOutput("You squeeze her, kissing her, and tell her that you love her too. Smiling, she gets up, letting your [cockDesc] flop out of her [fvagDesc] and hit the bench with a wet slap. Wanting to taste her favorite treat, she grabs your [multiCockDesc] and gently licks up her cum, the sight of it alone almost makes you want to go for a second round.", parse);
							Text.Newline();
							Text.AddOutput("Once you're clean, you grab a rag and help her clean up, grabbing your [lowerArmorDesc][toparmor]. After helping each other get dressed, you hug the cute catgirl tightly. <i>“Come visit again soon, [playername],”</i> she tells you as you leave the dressing room with her.", parse);
					}
					else {
						if(player.CumOutput() > 3) {
							Text.AddOutput("You moan as your [multiCockDesc] begin[notS] to spurt [itsTheir] load[s]. Feeling your release, Fera presses down hard to take as much of you inside her as she can,", parse);
							if(player.NumCocks() > 1) {
								parse["s"]        = player.NumCocks() > 2 ? "s" : "";
								parse["notS"]     = player.NumCocks() > 2 ? "" : "s";
								Text.AddOutput(" while your other cock[s] erupt[notS] all over the bench and floor", parse);
							}
							Text.AddOutput(". She purrs loudly as you fill her needy hole and squeezes you tight, digging her nails into your back.", parse);
							Text.Newline();
							Text.AddOutput("You hold her close and kiss her roughly as your excess seed begins to leak out of her and onto both your legs. <i>“I love you so much [playername]...”</i> she whispers softly. Squeezing her tight, you tell her that you love her too. You see tears in her eyes as she gets up.", parse);
							Text.Newline();
							Text.AddOutput("As she stands, your [cockDesc] slides out of her with a loud slurping sound. A combined steam of your spunk and her juices flow out of her [fvagDesc] and add to the mess already on the floor. She kneels down and leans in to lick your [multiCockDesc][balls] clean as always. Once you're clean, and she's licked up the stray strands of cum from her lips, you reach under the bench and throw her one of the larger rags, taking another one for yourself. You clean up the floor and bench, and she helps you get your [lowerArmorDesc][toparmor] back on.", parse);
							Text.Newline();
							Text.AddOutput("While you fix her dress for her, Fera kisses you one more time before leading you out. <i>“Come back soon,”</i> she tells you as you leave.", parse);
						}
						else {
							Text.AddOutput("You squeeze her tightly as you cum, and she presses into your lap, taking your seed deep into her womb. ", parse);
							if(player.NumCocks() > 1) {
								parse["s"]        = player.NumCocks() > 2 ? "s" : "";
								parse["notS"]     = player.NumCocks() > 2 ? "" : "s";
								Text.AddOutput("Your other member[s] squirt[notS] onto the bench and the floor in front of you. ", parse);
							}
							Text.AddOutput("As you fill her with your spunk, she purrs and draws you close to give you a big kiss. <i>“I love you, [playername]... more than anyone else...”</i> she whispers with tears in her big blue eyes.", parse);
							Text.Newline();
							Text.AddOutput("You squeeze her, kissing her, and tell her that you love her too. Smiling, she gets up, letting your [cockDesc] flop out of her [fvagDesc] and hit the bench with a wet slap. Wanting to taste her favorite treat, she grabs your [multiCockDesc] and gently licks up the cum, almost making you want to go for a second round.", parse);
							Text.Newline();
							Text.AddOutput("Once you're clean, you grab a rag and help her clean up, grabbing your [lowerArmorDesc][toparmor]. After helping each other get dressed, you hug the cute catgirl tightly. <i>“Come visit again soon, [playername],”</i> she tells you as you leave the dressing room with her.", parse);
						}
					}
					world.TimeStep({minute: 30});
					player.AddLustFraction(-1);
					fera.relation.IncreaseStat(100, 2);
					Gui.NextPrompt(Scenes.Fera.Interact);
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

