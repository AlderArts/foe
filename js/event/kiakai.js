/*
 * 
 * Define Kia/Kai
 * 
 */
function Kiakai(storage) {
	Entity.call(this);
	this.ID = "kiakai";
	// Character stats
	this.name = "Kia";
	
	this.avatar.combat     = Images.kiakai;
	
	this.abilities["Special"].name = "Healing";
	
	this.currentJob = Jobs.Acolyte;
	this.jobs["Acolyte"]   = new JobDesc(Jobs.Acolyte);
	
	this.jobs["Fighter"]   = new JobDesc(Jobs.Fighter);   this.jobs["Fighter"].mult = 5;
	this.jobs["Scholar"]   = new JobDesc(Jobs.Scholar);   this.jobs["Scholar"].mult = 3;
	this.jobs["Courtesan"] = new JobDesc(Jobs.Courtesan); this.jobs["Courtesan"].mult = 4;

	this.jobs["Mage"]      = new JobDesc(Jobs.Mage);   this.jobs["Mage"].mult = 2;
	this.jobs["Mystic"]    = new JobDesc(Jobs.Mystic); this.jobs["Mystic"].mult = 2;
	this.jobs["Healer"]    = new JobDesc(Jobs.Healer);
	
	this.jobs["Elementalist"] = new JobDesc(Jobs.Elementalist);
	//Kiai can't be Warlock
	this.jobs["Hypnotist"] = new JobDesc(Jobs.Hypnotist);
	
	this.weaponSlot   = Items.Weapons.WoodenStaff;
	this.topArmorSlot = Items.Armor.SimpleRobes;
	
	this.maxHp.base        = 80;
	this.maxSp.base        = 50;
	this.maxLust.base      = 20;
	// Main stats
	this.strength.base     = 10;
	this.stamina.base      = 11;
	this.dexterity.base    = 14;
	this.intelligence.base = 18;
	this.spirit.base       = 20;
	this.libido.base       = 13;
	this.charisma.base     = 13;
	
	this.level = 1;
	this.sexlevel = 1;
	
	// Note, since kia has no fixed gender, create body later
	this.body                  = new Body(this);
	this.body.head.hair.color  = Color.silver;
	this.body.head.hair.length.base = 15;
	this.body.head.eyes.color  = Color.purple;
	this.body.SetRace(Race.Elf);
	
	this.SetLevelBonus();
	this.RestFull();
	
	// Dialogue rotation
	this.flags["RotGeo"]        = 0;
	this.flags["RotPeople"]     = 0;
	this.flags["RotFactions"]   = 0;
	this.flags["RotElfCulture"] = 0;
	this.flags["RotElfParents"] = 0;
	this.flags["RotElfChild"]   = 0;
	this.flags["RotPrHier"]     = 0;
	this.flags["RotPrDisc"]     = 0;
	this.flags["RotPrAct"]      = 0;
	this.flags["RotPrYrissa"]   = 0;
	this.flags["RotPrAria"]     = 0;
	this.flags["RotPrMeeting"]  = 0;

	this.flags["InitialGender"] = Gender.male;
	this.flags["Attitude"]      = Kiakai.Attitude.Neutral; 
	this.flags["AnalExp"]       = 0; 
	this.flags["Sexed"]         = 0;
	
	this.flags["TalkedSex"]     = 0;
	this.flags["SexPitchAnal"]  = 0;
	this.flags["SexCatchAnal"]  = 0;
	
	// First time dialogue
	this.flags["TalkedWhyLeave"]          = 0; 
	this.flags["TalkedWhyLeaveForce"]     = 0; 
	this.flags["TalkedWhyLeaveLong"]      = 0; 
	this.flags["TalkedWhyLeaveLongReact"] = 0; 
	this.flags["TalkedPriest"]            = 0; 
	this.flags["TalkedElves"]             = 0; 
	this.flags["TalkedAria"]              = 0; 
	this.flags["TalkedUru"]               = 0; 
	this.flags["TalkedUruDA"]             = 0; 
	this.flags["TalkedAlone"]             = 0;
	
	this.flags["TalkedStatue"]            = 0;
	
	if(storage) this.FromStorage(storage);
}
Kiakai.prototype = new Entity();
Kiakai.prototype.constructor = Kiakai;

// Flags
Kiakai.Attitude = {
	Slave   : -3,
	Dom     : -2,
	Naughty : -1,
	Neutral : 0,
	Nice    : 1,
	Friend  : 2,
	Lover   : 3
}

Kiakai.prototype.GiveAnalAllowed = function() {
	return this.flags["SexCatchAnal"] > 0; // TODO > 1?
}
Kiakai.prototype.TakeAnalAllowed = function() {
	return this.flags["SexPitchAnal"] > 0;
}
//TODO
Kiakai.prototype.GiveVaginalAllowed = function() {
	return false;
}
//TODO
Kiakai.prototype.TakeVaginalAllowed = function() {
	return this.FirstVag() && false;
}

Kiakai.prototype.ItemUsable = function(item) {
	return true;
}

Kiakai.prototype.JobDesc = function() {
	return "acolyte";
}

Kiakai.prototype.ArmorDescLong = function() {
	if(this.Armor()) return Entity.prototype.ArmorDescLong.call(this);
	return "a light blue robe of soft cloth with short sleeves, ending just above the knees";
}

Kiakai.prototype.ArmorDesc = function() {
	if(this.Armor()) return Entity.prototype.ArmorDesc.call(this);
	return "light blue robe";
}

// Schedule
Kiakai.prototype.IsAtLocation = function(location) {
	return true;
}

Kiakai.prototype.InitCharacter = function(gender) {
	if(gender == Gender.male) {
		this.body.DefMale();
		this.body.cock[0].length.base = 12;
		
		this.name = "Kai";
		this.body.femininity.base = -0.2;
		this.Butt().buttSize.base = 2;
	}
	else {
		this.body.DefFemale();
		this.body.breasts[0].size.base = 4;
		
		this.name = "Kia";
		this.body.femininity.base = 0.2;
		this.Butt().buttSize.base = 3;
	}
	this.body.torso.hipSize.base    = 3;
	this.body.height.base      = 165;
	this.body.weigth.base      = 52;
}

// Party interaction
Kiakai.prototype.Interact = function(switchSpot) {
	Text.Clear();
	var that = kiakai;
	
	var parse = {
		playername : player.name,
		name       : kiakai.name,
		hisher     : kiakai.hisher()
	};
	
	if(kiakai.flags["Attitude"] == Kiakai.Attitude.Nice) {
		Text.Add("The elf perks up as you approach, giving you a friendly smile. <i>“What is on your mind, [playername]?”</i>", parse);
	}
	else if(kiakai.flags["Attitude"] == Kiakai.Attitude.Naughty) {
		Text.Add("The elf regards your approach with a wary gaze, not sure what you are after. <i>“Yes?”</i>", parse);
	}
	else {
		Text.Add("[Error in Kiakai attitude: " + kiakai.flags["Attitude"] + "]");
	}
	Text.NL();
	
	that.PrintDescription();
	
	Text.Flush();
	
	var options = [];
	
	options.push({ nameStr: "Talk",
		func : function() {
			Text.Clear();
			Text.Add("What do you want to talk with [name] about?", parse);
			Text.Flush();
			that.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr: "Release",
		func : function() {
			Text.Clear();
			Text.Add("[Placeholder] Kiai masturbates fiercely, cumming buckets.");
			
			world.TimeStep({minute : 10});
			
			that.OrgasmCum();
			
			Text.Flush();
			Gui.NextPrompt(function() {
				that.Interact(switchSpot);
			});
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	options.push({ nameStr: "Meditate",
		func : function() {
			Text.Clear();
			Text.Add("Placeholder: [name] sits down and attempts to calm [hisher] thoughts.", parse);
			Text.Flush();
			world.TimeStep({minute : 30});
			
			that.AddLustFraction(-1);
			
			Gui.NextPrompt(that.Interact);
		}, enabled : true,
		tooltip : "Clean impure thoughts."
	});
	options.push({ nameStr: "Healing",
		func : Scenes.Kiakai.Healing, enabled : true,
		tooltip : Text.Parse("Ask [name] to heal your wounds, and perhaps comfort you in other ways.", parse)
	});
	if(kiakai.flags["Sexed"] >= 30) {
		options.push({ nameStr: "Sex",
			func : Scenes.Kiakai.Sex, enabled : kiakai.flags["TalkedSex"] != 1,
			tooltip : Text.Parse("Proposition to have sex with [name].", parse)
		});
	}
	//Equip, stats, job, switch
	that.InteractDefault(options, switchSpot, true, true, true, true);
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}

Kiakai.prototype.TalkPrompt = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	var options = [];
	// TALK ABOUT MAIN QUEST
	options.push({ nameStr: "Quest",
		func : Scenes.Kiakai.TalkQuest, enabled : true,
		tooltip : "Talk about your goals."
	});
	// TALK ABOUT ARIA
	options.push({ nameStr: "Aria",
		func : function() {
			Text.Clear();
			Scenes.Kiakai.TalkAria();
		}, enabled : true,
		tooltip : "Ask about Aria."
	});
	// TALK ABOUT URU
	options.push({ nameStr: "Uru",
		func : function() {
			Text.Clear();
			Scenes.Kiakai.TalkUru();
		}, enabled : true,
		tooltip : "Ask about Uru."
	});
	// TALK ABOUT EDEN
	options.push({ nameStr: "Eden",
		func : function() {
			Text.Clear();
			Scenes.Kiakai.TalkEden();
		}, enabled : true,
		tooltip : "Ask about the land of Eden and its people."
	});
	// TALK ABOUT ELVES
	options.push({ nameStr: "Elves",
		func : function() {
			Text.Clear();
			Scenes.Kiakai.TalkElves();
		}, enabled : true,
		tooltip : Text.Parse("Ask [name] about [hisher] childhood with the elves.", parse)
	});
	// TALK ABOUT PRIESTHOOD
	options.push({ nameStr: "Priesthood",
		func : function() {
			Text.Clear();
			Scenes.Kiakai.TalkPriest();
		}, enabled : true,
		tooltip : "Ask about the priests of Aria."
	});
	// TALK RAVENS
	var r = ravenmother.Ravenness();
	if(r >= RavenMother.Stage.ravenstage2 + 2 &&
	   ravenmother.flags["Met"] == 0) {
		options.push({ nameStr : "Ravens",
			func : function() {
				Scenes.Kiakai.RavenDreams();
				kiakai.TalkPrompt();
			}, enabled : true,
			tooltip : Text.Parse("Ask [name] if [heshe] knows anything about the ravens that have been appearing in your dreams.", parse)
		});
	}
	/*
	options.push({nameStr : kiakai.name,
		func : function() {
			// TODO ROMANCE
			
		}, enabled : true,
		tooltip : "Talk about personal things."
	});
	*/
	
	Gui.SetButtonsFromList(options, true, kiakai.Interact);
}

Scenes.Kiakai = {};

Scenes.Kiakai.RavenDreams = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Clear();
	Text.Add("You briefly tell [name] about the ravens you’ve noticed watching you in your dreams.", parse);
	Text.NL();
	Text.Add("<i>“That is very strange, [playername],”</i> [heshe] responds. <i>“Of course there are legends of demons and spirits appearing in people’s dreams, but I have never thought that anyone but Lady Aria could actually do so. Yet I admit that what you say does not sound like a coincidence - it must be some form of powerful magic. You must be careful, [playername]!”</i>", parse);
	Text.NL();
	Text.Add("<i>“As to ravens themselves, there is something peculiar about them. There is a connection that elves feel with almost all life on Eden, with all the plants, and all the animals. Somehow, that connection is not present with ravens.”</i> [name] rubs [hisher] chin pensively. <i>“I have heard that in some of our oldest scrolls, a time is mentioned when ravens simply appeared in the world.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Where they came from or how they came to be here, even those scrolls do not say. It may be that this is somehow connected with what is happening in your dreams, but I am afraid you will have to find how for yourself.”</i>", parse);
	Text.NL();
	Text.Add("You thank the elf for [hisher] help, your curiosity piqued by the information. There really is something strange about the ravens in this world. You’ll just have to find out what it is.", parse);
	Text.Flush();
}

Scenes.Kiakai.TalkQuest = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Clear();
	// Initial stage
	if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
		Text.Add("You ask what you are to do with the gem.", parse);
		Text.NL();
		Text.Add("<i>“Lady Aria has told me that the gem holds great power. If you are able to wield it, maybe it can be used to stop Uru before it is too late.”</i> [name] looks at you suspiciously, clearly wondering if that's what you'd really do with it. <i>“Unfortunately, I know nothing of the magic that powers the artifact.”</i>", parse);
		Text.NL();
		Text.Add("Couldn't you just ask Aria?", parse);
		Text.NL();
		Text.Add("<i>“The Lady would no doubt be able to assist, but I have been unable to contact her since you arrived on Eden. We will need to seek out someone knowledgeable about such things - perhaps a powerful magician or a skilled alchemist.”</i>", parse);
	}
	else {
		Text.Add("<i>“Our first objective should be to find out more about that gemstone that you are carrying,”</i> [name] suggests. <i>“According to Lady Aria, it holds great power. If you are able to wield it, maybe it can be used to stop Uru before it is too late.”</i>", parse);
		Text.NL();
		Text.Add("When you ask [himher] how to best achieve that, the elf frowns thoughtfully. <i>“I know nothing of the magic that powers this artifact. We will need to find either a powerful magician or a skilled alchemist who can study it closer.”</i> [name] lets out a sigh of frustration. <i>“The Lady would no doubt be able to assist, but I have been unable to contact her since you arrived on Eden. I am afraid we are on our own.”</i>", parse);
	}
	Text.NL();
	
	if(rosalin.flags["Met"] == 0) {
		Text.Add("<i>“I know that there is an alchemist at the nomad campsite, but I am not aware how skilled she is. Perhaps she could point us in the right direction, though?”</i>", parse);
	}
	else {
		Text.Add("<i>“About that cat girl... we should probably try to find someone more, so to speak, sane,”</i> the elf shakes [hisher] head. <i>“We could probably find someone in the city - many folk pass through there.”</i>", parse);
		
		Text.NL();
		if(rigard.Access()) {
			Text.Add("<i>“Question is, how do we get in?”</i>", parse);
			
			Text.NL();
			Text.Add("<i>“Perhaps we could try to have one of the farmers sneak us in. They must pass inside regularly to sell their produce. We will have to make sure they are friendly enough to let us tag along, however.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I am sure we will be able to find other ways of gaining entrance eventually as well.”</i>", parse);
		}
		else if(rigard.flags["RoyalAccess"] == 0) {
			Text.Add("<i>“I hear that the court mage is a skilled alchemist; perhaps we could seek an audience with her?”</i>", parse);
		}
		else {
			Text.Add("<i>“We should find the court mage and ask her about the gem.”</i>", parse);
		}
		// TODO: Further down main quest
	}
	
	Text.Flush();
	kiakai.TalkPrompt();
}

Scenes.Kiakai.TalkAria = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	// First time
	if(kiakai.flags["TalkedAria"] == 0) {
		
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
			Text.Add("<i>“You may be ignorant of much, [playername], but you have had the honor of standing in her presence yourself.”</i> [name] looks a little angry, perhaps almost jealous. <i>“She is the Lady of Light, the embodiment of good in the worlds. Surely, you must have seen at least that much?”</i>", parse);
		}
		else {
			Text.Add("<i>“I guess things have been dropped on you rather suddenly, [playername],”</i> [name] concedes, looking rather embarrassed. <i>“It was not my intention to keep you in the dark about anything. Please, ask me anything you would like to know.”</i>", parse);
		}
		Text.NL();
		Text.Add("You explain that you would like to know more about Aria and her followers.", parse);
		Text.NL();
		
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
			Text.Add("<i>“It is good that you take interest in her.”</i> The elf seems a little relieved that you're interested in [hisher] Goddess. ", parse);
		}
		else {
			Text.Add("<i>“Certainly!”</i> The elf looks happy that you brought up this particular topic. It seems that [heshe] definitely is a devout follower. ", parse);
		}
		Text.Add("<i>“Lady Aria is revered by many here on Eden, and with good reason. While it is not common, there have been incidents with portals to other worlds opening up prior to your arrival here,”</i> [name] starts out, <i>“sometimes through design, sometimes due to happenstance, sometimes due to malice. The times that something... untoward emerged from the other side, the Lady exerted her powers to bind it before it could cause significant harm.”</i>", parse);
		Text.NL();
		Text.Add("You ask how long this has been going on. <i>“The records are not clear on this, and the records of my people go back a long time,”</i> [name] answers you. <i>“These kinds of portals have been opening on Eden for thousands of years, as far as I know.”</i>", parse);
		Text.NL();
		
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
			Text.Add("<i>“Is there anything else that you would like to know about Lady Aria, [playername]?”</i>", parse);
		else
			Text.Add("<i>“Tell me, is there anything else that you would like to know about Lady Aria, [playername]?”</i>", parse);
		
		kiakai.relation.IncreaseStat(50, 2);
		
		kiakai.flags["TalkedAria"] = 1;
	}
	else {
		Text.Add("<i>“What else would you like to know about Lady Aria, [playername]?”</i>", parse);
	}
	Text.Flush();
	
	var options = [];
	// TALK ABOUT ARIA'S GOALS
	options.push({ nameStr: "Goals",
		func : function() {
			Text.Clear();
			Text.Add("What are Aria's goals exactly? For what reason is she putting so much effort into keeping Eden safe?", parse);
			Text.NL();
			
			if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
				Text.Add("[name], looking affronted, replies curtly, <i>“She is the caretaker of the worlds, [playername]! It is her very nature to protect those who follow and worship her!”</i> You explain that while she did seem benevolent when you met her, you still need to find out everything you can about your situation. Still a bit huffy, [heshe] goes on, <i>“It is not for us to know exactly what the Lady's plans are; we need only trust in her and we will no doubt prevail. I do know that you are instrumental for them, however.”</i>", parse);
			else
				Text.Add("[name], looking affronted, replies curtly, <i>“For the safety of those who follow and worship her, of course!”</i> You calm the elf down, explaining that you meant no offense. Still a bit huffy, [heshe] continues, <i>“It is not for me to know exactly what the Lady's plans are, but I do know that you are instrumental for them.”</i>", parse);
			Text.NL();
			Text.Add("When you ask exactly what [heshe] means by that, [name] only responds that something about you, or perhaps the gem you carry, could greatly change the future of Eden. [HeShe] seems unwilling or unable to explain more details at this point.", parse);
			Text.NL();
			Text.NL();
			
			Scenes.Kiakai.TalkAria();
		}, enabled : true,
		tooltip : "Ask about what Aria's goals are."
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“If you would know more of the Lady, you need but ask.”</i>", parse);
		Text.Flush();
		kiakai.TalkPrompt();
	});
	
}

Scenes.Kiakai.TalkUru = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	if(kiakai.flags["TalkedUru"] == 0) {
		Text.Add("<i>“I would rather not dwell on the dark one longer than I have to, [playername],”</i> [name] tells you in a pained voice, <i>“but one must know their enemy to stand against it in battle.”</i>", parse);
		Text.NL();
		Text.Add("The elf clears [hisher] throat, preparing for a longer dissertation. <i>“Uru is a foul and evil creature, utterly selfish and chaotically destructive,”</i> [heshe] begins, <i>“I know very little of the details, but she and Lady Aria have battled with each other before, though I do not know where.”</i>", parse);
		Text.NL();
		
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
			Text.Add("<i>“I thankfully have not experienced it as you have. I have seen visions of the hellish realm she has been trapped in,”</i> [name] shudders uncomfortably. <i>“The truly terrible thing is: that realm was once lush and filled with life. Now, it is nothing more than a defiled wasteland, plagued by demons.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Do not trust her under any circumstances, [playername]! She is treacherous, the very embodiment of evil!”</i> The elf adds, clearly worried.", parse);
		}
		else
			Text.Add("<i>“While I thankfully have not experienced it as you have, I have seen visions of the hellish realm she has been trapped in,”</i> [name] shudders uncomfortably. <i>“That realm was once lush and filled with life, now it is nothing more than a defiled wasteland, plagued by demons.”</i>", parse);
		
		Text.NL();
		Text.Add("<i>“Where she came from, what she is, what her goals are, the Lady has yet to see fit to inform me - a kindness, I imagine,”</i> the elf concedes. <i>“I am afraid that you have to ask the Lady yourself to find out more. I will try to answer any questions you have to the best of my abilities, though.”</i>", parse);
		kiakai.relation.IncreaseStat(50, 2);
		
		kiakai.flags["TalkedUru"] = 1;
	}
	else {
		Text.Add("<i>“What else would you know of the evil one, [playername]?”</i> [name] asks, [hisher] discomfort clear in [hisher] expression.", parse);
	}
	
	Text.Flush();
	
	var options = [];
	// TALK ABOUT CONFLICT WITH ARIA
	options.push({ nameStr: "Conflict",
		func : function() {
			Text.Clear();
			
			Text.Add("[name] frowns, trying to collect [hisher] thoughts, <i>“All I know is that Lady Aria has done battle with the one known as Uru before, and that their last conflict ended in Uru being trapped in the realm you saw but a brief glimpse of.”</i>", parse);
			Text.NL();
			Text.Add("What of Aria herself, you ask, did she suffer any consequence from the battle?", parse);
			Text.NL();
			Text.Add("<i>“The Lady bested her adversary, of course she did, and even showed mercy on the foul creature,”</i> the elf sorrowfully bows [hisher] head. <i>“While she did not suffer any wounds, the encounter drained her, and she has yet to manifest on Eden since.”</i>", parse);
			Text.NL();
			Text.Add("In power, would [name] say they are evenly matched?", parse);
			Text.NL();
			Text.Add("<i>“No! Of course not!”</i> the elf exclaims. <i>“No mere demon could ever match the Lady!”</i>", parse);
			Text.NL();
			Text.NL();
			
			Scenes.Kiakai.TalkUru();
		}, enabled : true,
		tooltip : "Ask about the conflict between Uru and Aria."
	});
	// TALK ABOUT WHY URU WAS TRAPPED
	options.push({ nameStr: "Trapped",
		func : function() {
			Text.Clear();
			
			Text.Add("<i>“Understand that a being so powerful cannot easily pass between the realms,”</i> [name] explains, <i>“A regular portal could not withstand her passing, and her inability to create a more stable one has kept the other planes of existence safe till now.”</i> The elf bows [hisher] head sorrowfully, <i>“But this safety is dearly bought, as an entire realm is now under her influence.”</i>", parse);
			Text.NL();
			
			if(kiakai.flags["TalkedUruDA"] == 0) {
				
				if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
					Text.Add("[name] looks at you pleadingly, fear visible in [hisher] eyes, <i>“Y-you saw what it was like there, [playername]. She <b>cannot</b> be allowed to enter Eden!”</i>", parse);
				else
					Text.Add("[name] grabs your hand, fear visible in [hisher] eyes, <i>“Y-you saw what it was like there, [playername]. She <b>cannot</b> be allowed to enter Eden!”</i>", parse);
				Text.Flush();
				
				// [Comfort][Boast][Who cares]
				var options = [];
				options.push({ nameStr: "Comfort",
					func : function() {
						if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
							Text.Add("You take pity on the poor elf and embrace [himher]. You feel [hisher] body momentarily go rigid, surprised by your actions, before [heshe] relaxes in your arms. You do your best to soothe and calm [himher] as you assure [himher] that it will not come to that. The elf's shaking slowly subsides as [heshe] presses desperately against you.", parse);
							Text.NL();
							Text.Add("<i>“Th-thank you for that,”</i> [name] mumbles, disentangling [himher]self from you and blushing. <i>“Perhaps I have misjudged you.”</i>", parse);
							Text.NL();
							Text.Add("You insist that [heshe] can lean on your shoulder if [heshe] needs help. [name] smiles at you, before changing the subject.", parse);
						}
						else {
							Text.Add("You take pity on the poor elf and embrace [himher], soothing and calming as you assure [himher] that it will not come to that. The elf's shaking slowly subsides as [heshe] melts in your arms, resting [hisher] head on your chest.", parse);
							Text.NL();
							Text.Add("<i>“Th-thank you,”</i> [name] mumbles, disentangling [himher]self from you and blushing, <i>“I am sorry, I gave in to my fears... it will not happen again.”</i>", parse);
							Text.NL();
							Text.Add("You insist that [heshe] can lean on your shoulder anytime. [name] blushes brightly before trying to change the subject.", parse);
						}
						
						kiakai.relation.IncreaseStat(100, 5);
						
						Text.NL();
						Text.NL();
						Scenes.Kiakai.TalkUru();
					}, enabled : true,
					tooltip : Text.Parse("Try to comfort [himher].", parse)
				});
				options.push({ nameStr: "Boast",
					func : function() {	
						Text.Add("<i>“Hah, that demon isn't so tough,”</i> you brag confidently, ", parse);
						if(uru.flags["Intro"] & Uru.IntroFlags.FuckedUru ||
						   uru.flags["Intro"] & Uru.IntroFlags.FuckedByUru)
							Text.Add("<i>“I could handle her just fine, and I left her begging for more!”</i>", parse);
						else
							Text.Add("<i>“I could easily withstand her wiles, you have nothing to fear as long as I'm around!”</i>", parse);
						Text.NL();
						
						Text.Add("[name] looks at you doubtfully, but with a desperate spark of hope in [hisher] purple eyes, <i>“R-really?”</i> You nod affirmatively, though deep down you still have some nagging doubts about your own words.", parse);
						
						Text.NL();
						Text.NL();
						Scenes.Kiakai.TalkUru();
					}, enabled : true,
					tooltip : "Boast about your own power."
				});
				options.push({ nameStr: "Who cares",
					func : function() {
						kiakai.relation.DecreaseStat(-100, 5);
						Text.Add("You explain to [name] that Eden isn't your world, and you have higher priorities than dealing with Uru.",parse);
						Text.NL();
						
						if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
							Text.Add("The elf looks at you, clearly disappointed. <i>“I know you must walk your own path, and I will support you, but please think of the people of this world. They have friends, families, children, the same as you or I.”</i>", parse);
						else
							Text.Add("<i>“Think of all the people in this world. You may well be the only one who can help them,”</i> the elf tells you, clearly agitated. <i>“Would you doom all of us to be Uru's prey? Look around you! Would you see it reduced to the wasteland you saw in Uru's realm?”</i>", parse);
						
						Text.NL();
						Text.Add("<i>“Please,”</i> [heshe] entreats you, <i>“do not abandon us.”</i>",parse);
						Text.NL();
						Text.Add("You tell [himher] that you'll think about it, but your own world is still the one most important to you.",parse);
						
						Text.NL();
						Text.NL();
						Scenes.Kiakai.TalkUru();
					}, enabled : true,
					tooltip : "Eden isn't your problem, and you're not sure Uru is either..."
				});
				
				Gui.SetButtonsFromList(options);
				
				kiakai.flags["TalkedUruDA"] = 1;
			}
			else {
				Text.Add("<i>“Though no fault of yours, it seems that safety could now be at an end, but only time will tell,”</i> the elf shudders with unease. <i>“Uru is very, very powerful. Should she ever unleash the full force of her wrath on Eden, we would be as ants before her. It must not come to a direct confrontation.”</i>", parse);
				if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
					Text.NL();
					Text.Add("<i>“Please, help us to prevent her coming.”</i>", parse);
				}
				
				Text.NL();
				Text.NL();
				Scenes.Kiakai.TalkUru();
			}
		}, enabled : true,
		tooltip : "Ask about why and how Uru was sealed in the realm where you met her."
	});
	// TALK ABOUT URU CONQUESTS
	options.push({ nameStr: "Conquests",
		func : function() {
			Text.Clear();
			
			Text.Add("<i>“Before Uru was sealed in the dark realm, many worlds fell under her influence,”</i> [name] intones sorrowfully. <i>“Twisted, corrupted, defiled... they all succumbed, until Lady Aria intervened.”</i>", parse);
			Text.NL();
			if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
				Text.Add("<i>“Uru's very presence is enough to corrupt those around her. I hope your stay was brief enough that you were not significantly affected,”</i> the elf concludes, sounding a little suspicious.", parse);
			else
				Text.Add("<i>“Uru's very presence is enough to corrupt those around her, given time,”</i> the elf concludes.", parse);
			
			Text.NL();
			Text.NL();
			Scenes.Kiakai.TalkUru();
		}, enabled : true,
		tooltip : "Ask about Uru's previous conquests."
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“...Let us speak of something else, shall we?”</i>");
		Text.Flush();
		kiakai.TalkPrompt();
	});
	
}


Scenes.Kiakai.TalkEden = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Add("<i>“What would you like to know about Eden, [playername]?”</i>", parse);
	Text.Flush();
	
	var options = [];
	// TALK ABOUT GEOGRAPHY
	options.push({ nameStr: "Geography",
		func : function() {
			Text.Clear();
			
			var scenes = [];
			// TREE
			scenes.push(function() {
				Text.Add("You ask about the most prominent aspect of the realm: the giant tree rising thousands of feet into the air, covering large parts of Eden in the shadow its foliage.", parse);
				Text.NL();
				Text.Add("<i>“The tree stands at the center, its roots delve deep,”</i> [name] intones in a reverent voice. <i>“As far as I know, it has always been here. Only the dragons - the oldest beings that live on Eden - have any idea from whence it came and how it came to grow so big. The tree is a symbol of life and the power of nature, and many on Eden worship it, calling it 'The Mother of All'.”</i>", parse);
				Text.NL();
				
				// TODO: VISITED TREE CITY
				if(true) {
					Text.Add("<i>“It is even rumored that there is an entire city clinging to the upper branches.”</i>", parse);
				}
				else {
					Text.Add("<i>“Even so, it still surprises me that an entire city could thrive there, so far above the ground.”</i>", parse);
				}
			});
			// CITIES
			scenes.push(function() {
				Text.Add("You ask [himher] about what cities and villages are located on Eden.", parse);
				Text.NL();
				
				Text.Add("<i>“The largest settlement is of course the capital of the kingdom, located edgeways of the plains, between the lake and the great forest, not far from the nomad camp where you woke up. Though it is mostly populated by pure humans, there is a fair scattering of various morphs and other races living there.”</i>", parse);
				Text.NL();
				
				// TODO: OTHER CITIES
				
				Text.Add("<i>“Other than that, there are a few smaller civilized settlements on the plains, and on the far side of the Great Tree,”</i> [name] concludes [hisher] explanation. <i>“The village I once called my home is located there.”</i>", parse);
			});
			// DANGER
			scenes.push(function() {
				Text.Add("You ask about what places one should best avoid.", parse);
				Text.NL();
				
				Text.Add("<i>“The desert, the high mountains, and the deeper reaches of the forest can be very dangerous to unprepared travelers,”</i> the elf confides, <i>“but the place you must be most careful of is the Boneyard, near the Highlands. Stay <b>far</b> away from that place, or you will be sorry.”</i>", parse);
				Text.NL();
				Text.Add("The Boneyard? Why is it called that?", parse);
				Text.NL();
				Text.Add("<i>“The place is named after the bones of the great dragons that went there to die,”</i> the elf shudders in discomfort. <i>“It is crawling with the bastard offspring of the dragons of old, and though no one has seen it in a long time, it is rumored one of the ancient beasts still resides there. If something like that catches you, you would be as good as dead.”</i>", parse);
				Text.NL();
				Text.Add("[name] frowns a bit, <i>“There have been rumors about people disappearing without a trace while traversing the desert. If you plan to head there, be very careful.”</i>", parse);
			});
			// FLOATING ISLAND
			scenes.push(function() {
				Text.Add("You ask about why Eden seems to be floating in the sky.", parse);
				Text.NL();
				
				Text.Add("[name] looks at you with a confused look on [hisher] face. <i>“What do you mean?”</i> Understanding slowly dawns on [himher], <i>“Oh, I think I understand. It is not so much that Eden is floating, the surrounding land... just is not there anymore. I have trouble imagining it otherwise, but the legends tell of a time when the lands stretched wider than now.”</i>", parse);
				Text.NL();
				Text.Add("What could have caused such an event, you ask, disbelief clear in your voice.", parse);
				Text.NL();
				Text.Add("<i>“I know not,”</i> [name] admits.", parse);
			});
			
			var sceneId = kiakai.flags["RotGeo"];
			if(sceneId >= scenes.length) {
				sceneId = 0;
				kiakai.relation.IncreaseStat(30, 1);
			}
			
			kiakai.flags["RotGeo"] = sceneId + 1;
			
			// Play scene
			scenes[sceneId]();

			Text.NL();
			Text.NL();
			Scenes.Kiakai.TalkEden();
		}, enabled : true,
		tooltip : "Ask about the geography of Eden."
	});
	// TALK ABOUT PEOPLE
	options.push({ nameStr: "People",
		func : function() {
			Text.Clear();
			
			var scenes = [];
			// HUMANS
			scenes.push(function() {
				Text.Add("<i>“Pure humans used to be the most numerous race on Eden, but interbreeding with the various other races arriving through portals has dwindled their numbers,”</i> [name] explains, <i>“They still account for the majority of the population in the capital, and with a few exceptions, only humans are allowed into the royal palace.”</i>", parse);
				Text.NL();
				Text.Add("Why is that so?", parse);
				Text.NL();
				Text.Add("<i>“The royals wish to keep the bloodline pure at any cost, something which has resulted in a few... unsavory practices and customs. If you are not a pure human, you had best stay far away from the royal palace.”</i>", parse);
				Text.NL();
				Text.Add("Were humans the first race to live on Eden?", parse);
				Text.NL();
				Text.Add("<i>“No, that much is known, at least. Long before man or elf ever set foot on Eden, there were the dragons.”</i>", parse);
			});
			// MORPHS
			scenes.push(function() {
				Text.Add("<i>“Creatures with characteristics resembling animals have been arriving to Eden from their various home realms for ages,”</i> the elf explains. <i>“Now, they are a natural part of the population, just as common as pure humans.”</i>", parse);
				
				// TODO: EXPAND?
				
			});
			// MAGICAL BEINGS
			scenes.push(function() {
				Text.Add("<i>“Well, there are many on Eden you could classify as magical,”</i> the elf ruefully motions to [himher]self. <i>“Some consider my own race as such. You could say that this is a good place to live for beings that depend on magic, as it is very easy to coax tendrils of power from the very land itself.”</i>", parse);
				Text.NL();
				Text.Add("You ask how [heshe] would know the difference, if [heshe] has been living on Eden for [hisher] whole life.", parse);
				Text.NL();
				Text.Add("<i>“Portals to other realms were more commonplace in my youth, and I have made short surveys into a few of them at the behest of the Lady. None of them felt quite... right, as if one of my senses had been cut off. It was quite unpleasant.”</i> [name] shudders slightly.", parse);
				Text.NL();
				Text.Add("<i>“Getting back to your question, there are many forms of spirits living in the less populated areas, some benign and some hostile. The greatest of the magical beings are the ancient dragons, but no one has seen one of them in a very long time.”</i>", parse);
				Text.NL();
				Text.Add("<i>“It is best to remain wary if things seem out of the ordinary. Trust your senses; you seem to have an affinity for the magical.”</i>", parse);
			});
			// RABBITS
			scenes.push(function() {
				if(burrows.flags["Access"] == Burrows.AccessFlags.Unknown) {
					Text.Add("<i>“Some of the priests at the shrine told me about strange creatures they encountered on the plains, walking upright like humans, but very similar to rabbits in appearance. They are fleet-footed, and ran away before the traveling priests could get a closer look at them.”</i>", parse);
					Text.NL();
					Text.Add("<i>“According to the locals, they tend to stay together in small groups, and avoid travelers and larger settlements. As I understand it, they are not very sophisticated or intelligent.”</i>", parse);
				}
				else {
					Text.Add("<i>“The more I learn about those lagomorphs, the more worried I become,”</i> [name] frowns. <i>“What if they formed a mob and attacked one of the outlying farms, who knows what they would do?”</i>", parse);
					Text.NL();
					Text.Add("You ask [himher] what [heshe] knows about these critters.", parse);
					Text.NL();
					Text.Add("<i>“They are not uncommon creatures, as they breed very rapidly,”</i> the elf says. <i>“I never saw one up close when I lived at the shrine, as they tend to keep away from people, but some of the priests who traveled frequently told me about sighting them on the plains.”</i>", parse);
					Text.NL();
					Text.Add("<i>“This colony... is something different, though. I have never heard of such a large gathering before.”</i>", parse);
					if(burrows.Access()) {
						Text.NL();
						Text.Add("<i>“Not to mention this Lagon... he is dangerous.”</i>", parse);
					}
				}
			});
			// TODO: DEMONS
			/*
			scenes.push(function() {
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.NL();
				Gui.NextPrompt(Scenes.Kiakai.TalkEden);
			});
			*/
	
			var sceneId = kiakai.flags["RotPeople"];
			if(sceneId >= scenes.length) {
				sceneId = 0;
				kiakai.relation.IncreaseStat(30, 1);
			}
			
			kiakai.flags["RotPeople"] = sceneId + 1;
			
			// Play scene
			scenes[sceneId]();

			Text.NL();
			Text.NL();
			Scenes.Kiakai.TalkEden();
		}, enabled : true,
		tooltip : "Ask about the people and creatures that inhabit Eden."
	});
	// TALK ABOUT FACTIONS
	options.push({ nameStr: "Factions",
		func : Scenes.Kiakai.TalkFactions, enabled : true,
		tooltip : "Ask about some of the major groups on Eden."
	});
	// TALK ABOUT HUBWORLD
	options.push({ nameStr: "Hubworld",
		func : function() {
			Text.Clear();

			Text.Add("<i>“There is... something about this particular realm that makes it easier for portals to open, sometimes without any apparent reason,”</i> [name] explains, <i>“The Lady once explained it to me as reality being thinner here, though I did not quite understand her at the time.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Though there are significantly fewer incidents nowadays, once it was commonplace for rifts to several realms to be open at once, with people passing freely through them. It is the reason for there being so many different races living on Eden today.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Something happened long ago that changed that, though, yet I know not what. The last portal I know of before your arrival here was several years ago, and that one was only open for a short time.”</i>", parse);

			Text.NL();
			Text.NL();
			Scenes.Kiakai.TalkEden();
		}, enabled : true,
		tooltip : "Ask about Eden's function as a hubworld, and portals to other realms."
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Do you wish to speak of something else, [playername]?”</i>", parse);
		Text.Flush();
		kiakai.TalkPrompt();
	});
	
}


Scenes.Kiakai.TalkFactions = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Clear();
	
	var scenes = [];
	// KINGDOM
	scenes.push(function() {
		Text.Add("<i>“The royal family rules over the largest city on Eden, and a good portion of the plains is under their control. They are purebred humans, and they have a strong distaste for other races. Non-humans and mixed races do best in staying far away from the castle and the Royal Guard, though the city itself is fine.”</i>", parse);
		Text.NL();
		Text.Add("Who is the current king, and why does he hate other races so?", parse);
		Text.NL();
		Text.Add("<i>“Rewyn the Second is king, and Rhylla is his queen,”</i> [name] tells you. <i>“As for his hatred for non-humans... it is more a deeply ingrained fear, fueled over the generations. The pure line has been dwindling for years.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Rewyn has two children: the twins, Rumi and Rani.”</i>", parse);
	});
	// NOMADS
	scenes.push(function() {
		Text.Add("<i>“The nomads are an odd fellowship, as I am sure you have already gathered. They are not under the rule of the king, yet not enough of a thorn in his side to be branded outlaws.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Many of them are actually from realms other than this one, though the recent lack of portals has stranded them here. They usually move around quite a lot, but recently their camp has been set up on the plains.”</i>", parse);
	});
	// OUTLAWS
	scenes.push(function() {
		Text.Add("<i>“All those who oppose the king are branded outlaws,”</i> [name] explains. <i>“There are actually many factions of them, but the largest group hides out in the forest. Thieves and murderers many of them, a rather unsavory group.”</i>", parse);
		Text.NL();
		Text.Add("What are the laws of the kingdom regarding those outlaws?", parse);
		Text.NL();
		Text.Add("<i>“Anyone belonging to an outlaw faction, or being found guilty of helping one, risk imprisonment or, at worst, death at the hand of the Royal Guard.”</i>", parse);
	});
	// SHRINE
	scenes.push(function() {
		Text.Add("<i>“The Shrine of Lady Aria has been my home for many years,”</i> [name] tells you, recalling fond memories. <i>“The priests and priestesses are very kind, and well versed in the arts of healing.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Many on Eden request the services of the shrine, or go on pilgrimages to visit the holy place. High Priestess Yrissa welcomes all pure souls within the sacred walls of the Lady.”</i>", parse);
		Text.NL();
		Text.Add("Where exactly is the shrine located?", parse);
		Text.NL();
		Text.Add("<i>“It is unfortunately quite remote, hidden deep within the great forest.”</i> [name] explains that the priests sometime have to cast shrouds of deception around the shrine, in order to protect it from those with malicious intentions.", parse);
	});
	// DESERT OASIS
	scenes.push(function() {
		Text.Add("<i>“The desert is a rough place to live, but there is said to be a safe haven hidden among the dunes, a great oasis where water and food is plentiful. I have never visited the place myself though,”</i> [name] reveals. <i>“The kingdom troops do not go there, so it is pretty much under its own laws.”</i>", parse);
		Text.NL();
		Text.Add("How would one go about visiting there?", parse);
		Text.NL();
		Text.Add("<i>“Just heading out into the desert is begging for trouble to happen, you would be lost very quickly. The safest way to reach the oasis is to go with one of the trading caravans that pass through there. They sometimes make a stop at the crossroads and at the capital.”</i>", parse);
		Text.NL();
		Text.Add("[name] frowns a bit, <i>“There have been rumors about people disappearing without a trace while traversing the desert, not even leaving bones behind. If you plan to head there, be very careful.”</i>", parse);
	});
	
	var sceneId = kiakai.flags["RotFactions"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(30, 1);
	}
	
	kiakai.flags["RotFactions"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	Text.NL();
	Text.NL();
	Scenes.Kiakai.TalkEden();
}



Scenes.Kiakai.TalkElves = function() {

	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	if(kiakai.flags["TalkedElves"] == 0) {
		Text.Add("You ask [name] to tell you a little about the elves.", parse);
		Text.NL();
		Text.Add("<i>“The elves are a proud race, [playername]. Although in our appearance we resemble humans, in many ways we are actually closer to dryads or fairies.”</i>", parse);
		Text.NL();
		Text.Add("<i>“My people live in small groups, building villages to be as close to nature as possible. Many of them live in the forest, some building villages in the branches of the trees to stay safe from the dangerous animals that occasionally roam below. My own village was on the shore - my people love the life of the sea, as well as strength of the trees. I had spent but ten years of my life there, when a priestess of Aria stopped by, and I decided I needed to go with her and join the priesthood.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Most elves worship the Great Tree and try to live fully in tune with nature. When they gather plants, they make sure to spread their seeds, so the plant will continue to grow. They hunt animals only when sure the species is flourishing and no harm will be done by the culling.”</i>", parse);
		
		kiakai.relation.IncreaseStat(50, 2);
		
		kiakai.flags["TalkedElves"] = 1;
	}
	else {
		Text.Add("<i>“What else would you like to know, [playername]?”</i>", parse);
	}
	Text.Flush();
	
	//[Culture][Parents][Childhood][Why Leave]
	var options = new Array();
	options.push({ nameStr : "Culture",
		func : function() {
			Text.Clear();
			
			var scenes = [];
			// Long life
			scenes.push(function() {
				Text.Add("<i>“One of the biggest differences between elves and humans is how long we live,”</i> [name] tells you. <i>“Where humans live only a few score years, elves' lifetimes are measured in hundreds. The elders of my village were all past their fourth century when I left.”</i>", parse);
				Text.NL();
				Text.Add("<i>“This difference runs much deeper than the number of years, [playername]. Elves know that they have time to grow, to learn, to act. Though they make quick decisions when they must, they prefer to think and discuss very carefully anything they find important.”</i> [name] smiles fondly. <i>“I have heard a tale that once there was an elf who fell in love with a human. He told his people, and asked for their advice, wondering if they would accept his choice. The tale says they discussed it long and hard, and in the end decided that if that was the way of his heart, there was no ill in it. When he finally went to the girl to bring her the joyful news, he found her an old woman, and married besides.”</i> [name] laughs at [hisher] story, and you find it difficult to not join [himher].", parse);
				Text.NL();
				if(kiakai.relation.Get() > 25)
					Text.Add("<i>“Death is also much more terrible for the elves,”</i> [name] tells you, [hisher] eyes looking haunted. <i>“My kind have few children, and there are not many of us, so the loss of even a single life before it reaches its fullness is a great horror to us all.”</i>", parse);
			});
			// Nature worship
			scenes.push(function() {
				Text.Add("<i>“Elves love life and strive to live in harmony with nature above all else. Many humans say that they worship nature, but that is not quite it. Elves believe there is a spirit that moves all living things, a spirit that permeates the entire world. They think it is our duty to nurture this spirit, keep it healthy, make sure it prospers as much as possible.”</i>", parse);
				Text.NL();
				Text.Add("And what about Aria?", parse);
				Text.NL();
				Text.Add("<i>“The elves acknowledge that Aria exists and believe her to be a strong spirit from outside this world. However, they think she may help with some things in the universe, but this world is ours to care for, and it is the well-being of this world that should be our focus.”</i> [name] sighs. <i>“They do not see that there is far greater danger that stalks all worlds. That focusing on this one alone is no longer enough to keep it safe.”</i>", parse);
			});
			// Food
			scenes.push(function() {
				Text.Add("You ask [name] what the elves eat, since they do not want to disrupt nature.", parse);
				Text.NL();
				Text.Add("<i>“Eating is not disruption, [playername]. Predators, and even parasites, are part of nature. Even herbivores prey on plants, and plants often kill one another as they compete for sunlight and nutrients,”</i> [heshe] explains.", parse);
				Text.NL();
				Text.Add("<i>“What the elves oppose is depletion. They want the world to be a lush forest, full of life, not an arid desert. To work toward that, they take only the lives they know will be replenished, and do their best to maintain an equilibrium in nature. When elves harvest plants, they also replant them. When they kill animals, it is only when the species is doing well, and often they do so to prevent overpopulation.”</i>", parse);
			});
			// Lore
			scenes.push(function() {
				Text.Add("<i>“Elvish memories are long, [playername],”</i> [name] tells you, <i>“and some of our most ancient knowledge has echoed in song through millennia, but our loremasters also understand the importance of keeping written records.”</i>", parse);
				Text.NL();
				Text.Add("<i>“We only had a few lore scrolls at our village, but I was fascinated when I was allowed to read a little from them as a child. There were tales from before the founding of the kingdom, stories of times when a few worlds were connected almost permanently to our own through portals.”</i>", parse);
				Text.NL();
				Text.Add("<i>“If one read all the scrolls, I believe that would tell you more of the history of the world than you could learn from all the libraries in the human lands.”</i> The elf smiles with pride and obvious curiosity.", parse);
			});
			
			var sceneId = kiakai.flags["RotElfCulture"];
			if(sceneId >= scenes.length) {
				sceneId = 0;
				kiakai.relation.IncreaseStat(30, 1);
			}
			
			kiakai.flags["RotElfCulture"] = sceneId + 1;
			
			// Play scene
			scenes[sceneId]();

			Text.NL();
			Text.NL();
			Scenes.Kiakai.TalkElves();
		}, enabled : true,
		tooltip : Text.Parse("Ask [name] more about elvish culture.", parse)
	});
	options.push({ nameStr : "Parents",
		func : function() {
			Text.Clear();
			
			var scenes = [];
			// Raised by community
			scenes.push(function() {
				Text.Add("<i>“You have to understand that elves have very few children. An elvish woman usually has a child less than once every fifty years, even in her prime. As such, when a child is born, [heshe] is extremely important to all elves.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I have seen that humans are typically raised by their parents; that is not how it is with my people. A child is so important and so rare that the entire community takes part in [hisher] upbringing. Every adult does their best to help and teach every child, and it is ultimately the elders of the village who have authority over children.”</i>", parse);
			});
			// Children
			scenes.push(function() {
				Text.Add("Why are elvish children so rare?", parse);
				Text.NL();
				Text.Add("<i>“Elvish women are only rarely fertile,”</i> [name] explains, blushing slightly at discussing this topic. <i>“There is a grand cycle of abundance in nature that affects the elves. It runs about twelve years, although it varies a little from one to the next, and it is only when the cycle is at its peak that an elf can be fertile - and even if that condition is satisfied, i-intercourse will only rarely take and result in a child.”</i>", parse);
				Text.NL();
				Text.Add("<i>“So you see why children are so precious to my people.”</i>", parse);
			});
			// Long life
			scenes.push(function() {
				Text.Add("Didn't you get lonely without having parents who focus on you?", parse);
				Text.NL();
				Text.Add("<i>“Oh, no, not at all,”</i> [name] tells you. <i>“Elves do not feel lonely just because of that. After all, we have the entire community to support us. This is how elves have lived as far back as our lore reaches, so it must be a way of living that is comfortable for us...”</i> [name] trails off, sounding a little sad.", parse);
			});
			
			var sceneId = kiakai.flags["RotElfParents"];
			if(sceneId >= scenes.length) {
				sceneId = 0;
				kiakai.relation.IncreaseStat(30, 1);
			}
			
			kiakai.flags["RotElfParents"] = sceneId + 1;
			
			// Play scene
			scenes[sceneId]();

			Text.NL();
			Text.NL();
			Scenes.Kiakai.TalkElves();
		}, enabled : true,
		tooltip : Text.Parse("Ask [name] more about [hisher] parents.", parse)
	});
	options.push({ nameStr : "Childhood",
		func : function() {
			Text.Clear();
			
			var scenes = [];
			
			// Freedom
			scenes.push(function() {
				Text.Add("<i>“There is much time for a child to grow up among my people. Until the child's fifteenth year, the elves place no constraints, no demands, upon the children, provide no education unless the child asks for it. The child is left to learn about the world and explore at [hisher] leisure.”</i>", parse);
				Text.NL();
				Text.Add("Is it really alright to let children run wild like that?", parse);
				Text.NL();
				Text.Add("<i>“Of course,”</i> [name] tells you. <i>“It gives them a chance to learn the beauty of nature first hand, and my people know children have time to learn the necessities of life as they grow older.”</i>", parse);
				Text.NL();
				Text.NL();
				Scenes.Kiakai.TalkElves();
			});
			// Freedom2 TODO
			if(kiakai.relation.Get() > 40) {
				scenes.push(function() {
					Text.Add("<i>“In truth, [playername], I often found myself alone as a child. It is only possible for elves to give birth on every twelfth year or so, and no other child was born at the same time as I in our village. The adults in the village were kind to me, taught me anything I wished, but I only felt close to few of them.”</i> [name]'s voice grows quiet and hollow in memory, as [heshe] speaks.", parse);
					Text.NL();
					Text.Add("<i>“There were some older children, but by the time I could play with them, they had duties of their own, ones I was not invited to partake in. Though they smiled at me and were gentle, I was ever an outsider in their small circles.”</i>", parse);
					Text.NL();
					
					if(kiakai.flags["TalkedAlone"] == 0) {
						kiakai.flags["TalkedAlone"] = 1;
						Text.Add("<i>“As a result, I spent much time by myself, exploring the sea and the forest near our village, meeting animals and fish, corals and trees.”</i> The elf pauses, and looks into your eyes doubtfully. <i>“You will think me strange for this, but in some ways, they were my closest friends.”</i>", parse);
						Text.NL();
						Text.Flush();

						//[Comfort][Explain][You're Weird!]
						var options = new Array();
						options.push({ nameStr : "Comfort",
							func : function() {
								kiakai.relation.IncreaseStat(100, 5);
								if(kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral) {
									Text.Add("You embrace the elf, telling [himher] that you will be with [himher] now. [name] relaxes in your grasp and hugs you back tightly, pressing [hisher] head into your chest.", parse);
									Text.NL();
									Text.Add("<i>“Thank you, [playername],”</i> [heshe] whispers, almost too quiet for you to hear.", parse);
								}
								else {
									Text.Add("You pat the elf on the head, and tell [himher] that you've got [himher] now, and you'll take care of [himher] as long as [heshe] remains loyal.", parse);
									Text.NL();
									Text.Add("[name] smiles up at you warmly, pressing [hisher] head slightly into your hand. <i>“Thank you, [playername].”</i>", parse);
								}
								Text.NL();
								Text.NL();
								Scenes.Kiakai.TalkElves();
							}, enabled : true,
							tooltip : Text.Parse("Tell the elf that [heshe] is not alone anymore.", parse)
						});
						options.push({ nameStr : "Explain",
							func : function() {
								Text.Add("You tell the elf not to worry. You have felt lonely yourself sometimes, and you know it is tempting to look for friends wherever you can find them.", parse);
								Text.NL();
								Text.Add("<i>“Thanks, [playername],”</i> [name] tells you with a wry smile. <i>“It is good to know I am not the only one going crazy!”</i>", parse);
								Text.NL();
								Text.NL();
								Scenes.Kiakai.TalkElves();
							}, enabled : true,
							tooltip : "Explain to the elf that's what loneliness does."
						});
						options.push({ nameStr : "You're Weird!",
							func : function() {
								kiakai.relation.DecreaseStat(-100, 5);
								
								Text.Add("You tell the elf that, yes, that's really strange. Why would you make friends with the trees and the birds? They can't tell you anything, or even understand you, for that matter!", parse);
								Text.NL();
								Text.Add("<i>“I suppose you are right.”</i> [name] turns away from you, and wanders off a little, staring at the ground, clearly dejected.", parse);
								Text.Flush();
								Gui.NextPrompt(kiakai.Interact);
							}, enabled : true,
							tooltip : "Yep, the elf really is strange."
						});
						Gui.SetButtonsFromList(options);
					}
					else {
						
						Text.Add("<i>“As a result, I spent much time by myself, exploring the sea and the forest near our village, meeting animals and fish, corals and trees. In some ways, they were my closest friends.”</i>", parse);
						Text.NL();
						Text.NL();
						Scenes.Kiakai.TalkElves();
					}
				});
			}
			// Friends and teachers
			scenes.push(function() {
				Text.Add("<i>“My village was devoted to caring for me, and I did not shun their devotion. The loremaster taught me to read when I was still very young, and before I learned, he read to me from the scrolls when he had time. Sometimes, one of the other adults would also take me to gather fruits and berries with them, or to go fishing, and taught me how to pick out the ripe plants, the abundant fish.”</i> [HeShe] smiles fondly.", parse);
				Text.NL();
				Text.Add("<i>“The older children also tried to include me in their games, although often I felt like a burden to them. Still, I made a friend or two among them, and they seemed to actually enjoy my endless questions.”</i>", parse);
				
				Text.NL();
				Text.NL();
				Scenes.Kiakai.TalkElves();
			});
			
			var sceneId = kiakai.flags["RotElfChild"];
			if(sceneId >= scenes.length) {
				sceneId = 0;
				kiakai.relation.IncreaseStat(30, 1);
			}
			
			kiakai.flags["RotElfChild"] = sceneId + 1;
			
			// Play scene
			scenes[sceneId]();
		}, enabled : true,
		tooltip : Text.Parse("Ask [name] more about [hisher] childhood.", parse)
	});
	// TODO
	options.push({ nameStr : "Why Leave",
		func : function() {
			Text.Clear();
			
			// Low rel version
			if(kiakai.relation.Get() < 35 || kiakai.flags["TalkedWhyLeave"] == 0) {
				kiakai.flags["TalkedWhyLeave"] = 1;
				
				Text.Add("<i>“One day, a priestess came to my village,”</i> [name] tells you, and pauses briefly, clearly deciding what to say next. <i>“Though we did not worship Aria, she was still generous to us, and aided us with healing. I was impressed as much by her as her abilities, and I saw also the goodness of Aria within her. I decided I too wanted to be able to help people as she did, and went with her to join the priesthood.”</i>", parse);
				Text.NL();
				if(kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral) {
					Text.Add("You see pain in the elf's eyes and sense that there's much [heshe]'s not telling you, but you decide not to press the issue. [HeShe] will tell you when [heshe] is ready.", parse);
					Text.NL();
					Text.NL();
					Scenes.Kiakai.TalkElves();
				}
				else {
					
					if(kiakai.flags["TalkedWhyLeaveForce"] == 0) {
						Text.Add("You see pain in the elf's eyes and sense that there's much [heshe]'s not telling you.", parse);
						Text.Flush();
						//[Demand answer][Let it go]
						var options = new Array();
						options.push({ nameStr : "Demand answer",
							func : function() {
								kiakai.flags["TalkedWhyLeaveForce"] = 1;
								
								kiakai.relation.DecreaseStat(-100, 5);
								Text.Clear();
								Text.Add("You tell the elf that you demand to know the whole truth. You're in charge here, and [heshe] <i>will</i> tell you.", parse);
								Text.NL();
								Text.Add("<i>“I will not!”</i> [name] shouts at you, clearly furious. <i>“I might be helping you because Lady Aria asked it of me, but that gives you no right to my past!”</i>", parse);
								Text.NL();
								Text.Add("[HeShe] turns away from you, and stalks a little ways off.", parse);
								Text.Flush();
								Gui.NextPrompt(kiakai.Interact);
							}, enabled : true,
							tooltip : "Demand that the elf tell you what happened."
						});
						options.push({ nameStr : "Let it go",
							func : function() {
								Text.Clear();
								Text.Add("You decide that whatever [name] is concealing, it's probably not important anyway. Maybe [heshe]'ll tell you later if [heshe] wants.", parse);
								Text.NL();
								Text.NL();
								Scenes.Kiakai.TalkElves();
							}, enabled : true,
							tooltip : "It's probably not important anyway..."
						});
						Gui.SetButtonsFromList(options);
					}
					else {
						Text.Add("You see pain in the elf's eyes and sense that there's much [heshe]'s not telling you. Perhaps [heshe] will tell you when [heshe]'s ready.", parse);
						Text.NL();
						Text.NL();
						Scenes.Kiakai.TalkElves();
					}
				}
			}
			// High rel version
			else {
				Scenes.Kiakai.TalkDimensionalViolation();
			}
		}, enabled : true,
		tooltip : Text.Parse("Ask [name] why [heshe] left the elves.", parse)
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Do you wish to speak of something else, [playername]?”</i>", parse);
		Text.Flush();
		kiakai.TalkPrompt();
	});
	
}

Scenes.Kiakai.TalkDimensionalViolation = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Clear();
	
	if(kiakai.flags["TalkedWhyLeaveLong"] == 0) {
		Text.Add("[name] sighs when you ask for the story again. <i>“Very well, you have been patient with me. I will tell you all that occurred.”</i>", parse);
	}
	else {
		if(kiakai.flags["TalkedWhyLeaveLongReact"] == 1) { // HUG/THANK
			Text.Add("<i>“Very well, I will tell you the story again, if you wish to hear it, [playername],”</i> [name] says, seeming a little more comfortable with the prospect than [heshe] used to be.", parse);
		}
		else if(kiakai.flags["TalkedWhyLeaveLongReact"] == 2) { // DISMISS
			Text.Add("<i>“Did you not say it was boring?”</i> [name] asks, looking annoyed. <i>“Very well, I will tell you again, but try to pay attention this time.”</i>", parse);
		}
		else {
			Text.Add("<i>“Thank you for being patient with me, I... I think I will be able to tell the whole story this time.”</i> You nod encouragingly to [name].", parse);
		}
	}
	
	Text.NL();
	Text.Add("<i>“I was a few months past my tenth birthday when I stumbled upon a portal while wandering through the woods by our village. At first, I was curious and approached it, wondering where it led, however, as I drew near, I felt a sense of wrong emanating from it. A glance inside showed me woods that must have once resembled our own, but which were now blackened, with many trees seemingly rotting upright where they stood. I drew back in revulsion from the thing and ran as fast as I could to tell the adults.”</i> ", parse);
	
	if(kiakai.flags["TalkedWhyLeaveLongReact"] == 1) { // HUG/THANK
		Text.Add("[name] still looks a little disgusted by the memory, but the horror [heshe] had shown before is gone now.", parse);
		Text.NL();
	}
	else { // DISMISS, OR FIRST TIME
		Text.Add("[name] shivers recounting the memory, [hisher] horror of the thing undiminished by time.", parse);
		Text.NL();
	}
	
	Text.Add("<i>“By the time they arrived, the portal had closed, but outside it they found collapsed a peculiar creature. It resembled the dryads of our world, but its skin was blackened and cracked, and a sickly yellow pus oozed from its body. They brought the creature back to the village, thinking it ill, and wishing to heal it, for we have long been friends of the dryads.”</i>", parse);
	Text.NL();
	Text.Add("<i>“It was indeed much weakened, for it lie motionless within the village for three days. When it awoke, however, its skin had not changed, and the pus now flowed from its half-open mouth, and... other parts.”</i> The elf shudders. <i>“I am told that when Treal, one of our elders, came upon it, it assaulted him, and he was barely able to hold it off while shouting for help. It was seen then that the creature was unnatural and it was put down, its body and very bones burned to a fine ash upon a bonfire of deadwood.”</i>", parse);
	Text.NL();
	
	if(kiakai.flags["TalkedWhyLeaveLong"] == 0) {
		kiakai.flags["TalkedWhyLeaveLong"] = 1;
		
		Text.Add("<i>“But that was only the beginning, [playername].”</i> [name]'s wide eyes meet yours, with an expression of supplication.", parse);
		Text.Flush();
		
		//[Go on...][Later]
		var options = new Array();
		options.push({ nameStr : "Go on...",
			func : function() {
				Text.Clear();
				Text.Add("You hold the elf's hand, telling [himher] that you'd like to hear the rest of it. [HeShe] nods hesitantly, seeming to take strength from your grip.", parse);
				Text.NL();
				Scenes.Kiakai.TalkDimensionalViolationCont();
			}, enabled : true,
			tooltip : "Ask the elf to continue."
		});
		options.push({ nameStr : "Later",
			func : function() {
				Text.Clear();
				Text.Add("Seeing [name] so distressed, you tell [himher] that [heshe] can finish the story later.", parse);
				Text.NL();
				Text.NL();
				Scenes.Kiakai.TalkElves();
			}, enabled : true,
			tooltip : Text.Parse("Tell the elf it's alright - [heshe] can finish the story later.", parse)
		});
		Gui.SetButtonsFromList(options);
	}
	// NEXT PIECE CONTINUATION
	else {
		Scenes.Kiakai.TalkDimensionalViolationCont();
	}
}

// CONTINUATION OF THE STORY
Scenes.Kiakai.TalkDimensionalViolationCont = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Add("<i>“Though the corrupt creature was dead - its body but ashes on the wind - we soon found that it had already caused grave ill. On the morning after the pyre, I saw a bird I had often seen singing to its mate lying dazed upon the ground under the tree of its nest. When I lifted it, it made little response, its breathing shallow, its tiny heart pounding desperately in its chest. I left it alone, thinking that perhaps it had grown old and its time was coming, for I had been taught that all beings must pass. That evening, however, I recall being dizzy, Treal laying me down on a bed, concern clear in his face.”</i>", parse);
	Text.NL();
	Text.Add("<i>“After that, I recall little of what occurred,”</i> [name] tells you, looking grim. <i>“I am told that all in the village sickened one by one, until none could care for another. Only a human fisherman, who had come to us the day of the pyre to trade, seemed unaffected. When he saw all around him grow ill, he took great fright and hurried as fast as he could to the Shrine of Aria, where he hoped he could be healed.”</i>", parse);
	Text.NL();
	Text.Add("<i>“At the shrine, they found that he bore no trace of disease, but they sent a young priestess to check up on us. I wish they had chosen to send more than one, but it was our salvation that they responded at all. It was Yrissa who came to us, arriving after the village had been in the throes of plague for two full days. She has told me that she healed all the elves in turn, by herself, leaving me for last, for my illness was the most grievous of all, and she knew that even if she managed to overcome it, she would have no strength to move from the spot.”</i>", parse);
	Text.NL();
	Text.Add("<i>“As I say, I know nothing of what occurred myself, for my mind was clouded with dreams. I dreamed of endless forests, rotting where they stood, and of grasslands peeling away like the land's skin, leaving only a bare waste behind.”</i> [name] shudders, but goes on, as if mesmerized by [hisher] own tale. <i>“I dreamed of demons stalking the land, indulging in their vile pleasures - and then, after an eternity of darkness, I remember clearly I felt a tug at my mind. A tug that transformed into a steady pull, and then a swift flight, pulling me from this desolate realm, bringing me through the fabric of worlds into the gardens of Lady Aria.”</i>", parse);
	Text.NL();
	Text.Add("<i>“But even in that blessed realm, I...”</i> The elf hesitates before continuing. <i>“Even there, my spirit was not freed from taint. I remember looking around me and being disgusted by the life I saw. I remember seeing the Lady herself and thinking it would be delightful to tear down her sanctity, to ravish her and make her beg for more.”</i> The elf starts at [hisher] own words, looking frightened by what [heshe] has said. [HeShe] swallows audibly before continuing. <i>“But then, the Lady pressed her hand against my forehead, and I felt the fog lift from my thoughts. I felt a vast joy at being within this place of beauty, though it was too tame by elvish standards, at being in the presence of one so vastly good.”</i>", parse);
	Text.NL();
	Text.Add("The elf smiles, happy at the bright memory. <i>“There is not much to tell after that. I woke up, fully healed, and saw Yrissa collapsed before me, the elders observing us both. Though I did not know her then, I knew she was the one who healed me and felt connected to her.”</i>", parse);
	Text.NL();
	Text.Add("<i>“After that experience, I knew I wanted to be like her. I wanted to be able to heal and truly help people. I asked the elders for permission to join the priesthood, and - to be honest with you - I was a little surprised by how easily they granted it. Yrissa, likewise, agreed to have me when she finally woke up after two days and three nights of rest.”</i>", parse);
	Text.NL();
	Text.Add("<i>“I was sad to leave my people, but I am certain that I chose the right path. The only thing that marred my departure was that, despite her best efforts, Yrissa had arrived too late to aid two of the elves of my village, and I was told that they had passed on before I woke up.”</i>", parse);
	Text.NL();
	
	// IF FIRST TIME
	if(kiakai.flags["TalkedWhyLeaveLongReact"] == 0) {
		Text.Flush();
		//[Hug][Thank][Dismiss]
		var options = new Array();
		options.push({ nameStr : "Hug",
			func : function() {
				Text.Clear();
				
				kiakai.flags["TalkedWhyLeaveLongReact"] = 1; // HUG/THANK
				kiakai.relation.IncreaseStat(100, 10);
				kiakai.spirit.IncreaseStat(100, 1);
				
				if(kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral) {
					Text.Add("You put your arms around [name], drawing [himher] closer to you, and [heshe] returns your embrace. You whisper that it is all in the past now, and [heshe] is well. You reassure [himher] that [heshe] did what was right, and that [heshe] is now a splendid healer.", parse);
					Text.NL();
					Text.Add("[name] eventually disentangles [himher]self from your arms and smiles up at you. Perhaps [heshe] will be able to deal with the memories better now.", parse);
				}
				else { // NAUGHTY
					Text.Add("You put your arms around [name], and [heshe] relaxes, feeling comfortable in your grasp. You whisper to [himher] that [heshe] did all [heshe] could back then, and that now you will protect [himher].", parse);
					Text.NL();
					Text.Add("You eventually release [name] from your arms, and [heshe] smiles up at you. Perhaps [heshe] will be able to deal with the memories better now.", parse);
				}
				
				Text.Flush();
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			}, enabled : true,
			tooltip : Text.Parse("Hug the elf, thanking [himher] for telling you the story.", parse)
		});
		options.push({ nameStr : "Thank",
			func : function() {
				Text.Clear();
				
				kiakai.flags["TalkedWhyLeaveLongReact"] = 1; // HUG/THANK
				kiakai.relation.IncreaseStat(100, 5);
				kiakai.spirit.IncreaseStat(100, 1);
				
				Text.Add("You tell [name] that you are grateful [heshe] told you all that, and that you think knowing what happened might eventually help you with your quest.", parse);
				Text.NL();
				Text.Add("[name] smiles up at you, apparently happy that [heshe] has gotten the memories off [hisher] chest.", parse);
				
				Text.Flush();
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			}, enabled : true,
			tooltip : "Thank the elf for telling you what happened."
		});
		options.push({ nameStr : "Dismiss",
			func : function() {
				Text.Clear();
				
				kiakai.flags["TalkedWhyLeaveLongReact"] = 2; // DISMISS
				kiakai.relation.DecreaseStat(-100, 5);
				
				Text.Add("You tell the elf you were sleepy because the story was so boring and might have missed something in the middle. Like, most of it.", parse);
				Text.NL();
				Text.Add("<i>“Then why in the worlds did you ask me to tell it?”</i> [name] demands, visibly distraught. You see moisture pooling beneath [hisher] eyes.", parse);
				
				Text.Flush();
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			}, enabled : true,
			tooltip : "Tell the elf that was really boring."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("You thank [name] for telling you the story again.", parse);
		Text.NL();
		Text.NL();
		Scenes.Kiakai.TalkElves();
	}
}


Scenes.Kiakai.TalkPriest = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	if(kiakai.flags["TalkedPriest"] == 0) {
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
			Text.Add("<i>“The priesthood is the instrument of the Lady on Eden,”</i> the elf tells you, looking proud. <i>“The order mostly stays at the Shrine of Aria, though we sometimes venture out at the request of nearby villages, and some serve as advisers to men of power. Among other things, the priests of Aria are exceptionally skilled healers.”</i>", parse);
			Text.NL();
			if(kiakai.relation.Get() > 25)
				Text.Add("<i>“The priesthood is currently headed by High Priestess Yrissa. She practically raised me from when I was but a young child,”</i> [name] confides with a fond tone in [hisher] voice.", parse);
			else
				Text.Add("<i>“The priesthood is currently headed by High Priestess Yrissa. She is a strict woman, but kind and generous as well. You would do well to respect her.”</i> You sense that there is something [name] is not telling you, but decide it's probably not important.", parse);
		}
		else {
			Text.Add("<i>“The Lady makes her presence on Eden be known through her priesthood,”</i> the elf explains to you. <i>“The order mostly stays at the Shrine of Aria, though we sometimes venture out at the request of nearby villages, and some serve as advisers to men of power. Among other things, the priests of Aria are very skilled healers.”</i>", parse);
			Text.NL();
			Text.Add("<i>“The priesthood is currently headed by High Priestess Yrissa,”</i> [name] confides with a fond tone in [hisher] voice. <i>“She practically raised me from when I was but a young child.”</i>", parse);
		}

		Text.NL();
		Text.Add("<i>“I currently hold the rank of acolyte in the order.”</i>", parse);
		
		kiakai.relation.IncreaseStat(50, 2);
		kiakai.flags["TalkedPriest"] = 1;
	}
	else {
		Text.Add("<i>“What else would you like to know about the priesthood, [playername]?”</i>", parse);
	}
	
	Text.Flush();
	//[Hierarchy][Disciplines][Activities][Yrissa][Aria][Meeting]
	var options = new Array();
	options.push({ nameStr : "Hierarchy",
		func : Scenes.Kiakai.TalkPriestHierarchy, enabled : true,
		tooltip : "Ask about the organization of the priesthood."
	});
	options.push({ nameStr : "Disciplines",
		func : Scenes.Kiakai.TalkPriestDisciplines, enabled : true,
		tooltip : "Ask about the priesthood's rules and personal goals."
	});
	// TODO
	options.push({ nameStr : "Activities",
		func : Scenes.Kiakai.TalkPriestActivities, enabled : true,
		tooltip : "Ask what the priesthood actually does day-to-day."
	});
	options.push({ nameStr : "Yrissa",
		func : Scenes.Kiakai.TalkPriestYrissa, enabled : true,
		tooltip : "Ask about the High Priestess."
	});
	options.push({ nameStr : "Aria",
		func : Scenes.Kiakai.TalkPriestAria, enabled : true,
		tooltip : "Ask about the priests' relationship with Aria."
	});
	options.push({ nameStr : "Meeting",
		func : Scenes.Kiakai.TalkPriestMeeting, enabled : true,
		tooltip : Text.Parse("Ask about [name] leaving to come meet you.", parse)
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Do you wish to speak of something else, [playername]?”</i>", parse);
		Text.Flush();
		kiakai.TalkPrompt();
	});
}

Scenes.Kiakai.TalkPriestHierarchy = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Clear();
	
	var scenes = [];
	
	// Overview
	scenes.push(function() {
		Text.Add("<i>“I know best the lower ranks of the priesthood, [playername],”</i> [name] says, looking somewhere between embarrassed and annoyed. <i>“There is a long training period for all of its members. First, any entrants start off as novices. In this position, they study the verses of Aria, as well as writing, numeracy, and healing. Once they have a grasp of the basics, which normally takes about four years, they move on to being apprentices.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Apprentices delve deeper into study, having to do fewer menial chores than novices, and sometimes getting to help in the priesthood's main work. This stage of training usually takes about six years for most. Although if it is longer, that is not exactly a problem either,”</i> the elf hastens to add.", parse);
		Text.NL();
		Text.Add("<i>“Beyond apprenticeship is the acolyte stage. Acolytes have most of the knowledge of full priests, but they lack the practical experience to go about duties on their own. They help the priests with everything from healing to the copying of books. This stage normally takes about ten years, although the next advancement only occurs if the order heads deem the acolyte worthy, so it can be much faster or take much, much longer...”</i> [name] trails off at this, [hisher] eyes distant, clearly thinking about something.", parse);
		Text.NL();
		Text.Add("And then?", parse);
		Text.NL();
		Text.Add("<i>“Ah, after that, there are the diviners and the clerics. Both are the key servants of Lady Aria, with diviners focusing more on finding out the deep truths and protecting the integrity of the worlds and clerics instead focusing on healing and doing good in the here and now. After that, there are the six order heads, who are in charge of various groups in the priesthood, and above all stands the High Priestess, who directs the priesthood as a whole.”</i>", parse);
	});
	// Order heads
	scenes.push(function() {
		Text.Add("<i>“There are six order heads in total. Four of them are in charge of various ranks - one for novices and apprentices, one for acolytes, one for diviners, and one for clerics. The other two, usually seen as standing a little higher, instead govern the priesthood's chief activities - one of them directs the scholarship of the priesthood, and the other the healing.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Each of them has a great deal of authority,”</i> [name] tells you, <i>“and many of them are powerful clerics or diviners in their own right. They also play a key role in choosing the High Priestess.”</i>", parse);
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>“The High Priestess is the head of the priesthood, as you might expect, but more than that, she is its heart. She is chosen every seven years, and has the power to change the direction of the order in whatever way she feels will best serve Aria,”</i> [name] tells you.", parse);
		Text.NL();
		Text.Add("<i>“The current High Priestess is Yrissa, and everyone acknowledges her beauty and wisdom,”</i> the elf blushes slightly. <i>“She is thoughtful and kind, and has moved the priesthood to focus on helping the people of the land.”</i>", parse);
	});
	
	var sceneId = kiakai.flags["RotPrHier"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(30, 1);
	}
	
	kiakai.flags["RotPrHier"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	Text.NL();
	Text.NL();
	Scenes.Kiakai.TalkPriest();
}


Scenes.Kiakai.TalkPriestDisciplines = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		virg   : kiakai.FirstCock() ? "p-penis has not entered a vagina" : "v-vagina has not felt the touch of a penis"
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Clear();
	
	
	var scenes = [];
	
	// Celibacy1
	if(kiakai.flags["TalkedSex"] < 2) {
		scenes.push(function() {
			Text.Add("<i>“One of the primary restrictions on the priesthood is that all must remain celibate,”</i> [name] tells you, looking stern. <i>“Sex is a distraction from service to the Lady Aria, and romantic attachment is a distraction from serving the other people of this world.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Many find it difficult at times, but the High Priestess has reaffirmed that this is the proper path in serving Aria.”</i>", parse);
			Text.Flush();
			
			if(kiakai.flags["Sexed"] != 0) {
				//[But...][Okay]
				var options = new Array();
				options.push({ nameStr : "But...",
					func : function() {
						Text.NL();
						Text.Add("You mention that the two of you have engaged in certain activities.", parse);
						Text.NL();
						Text.Add("<i>“Oh, no!”</i> [name] answers, blushing furiously. <i>“Those certainly don't count. After all, m-my [virg],”</i> [heshe] explains, looking at the ground, [hisher] entire face turning beet red. <i>“A-and besides, Aria wouldn't forbid something th-that feels so good.”</i>", parse);
						Text.NL();
						Text.Add("You feel that if you keep asking about it, [name] will pass out from embarrassment.", parse);
						Text.NL();
						Text.NL();
						Scenes.Kiakai.TalkPriest();
					}, enabled : true,
					tooltip : "But... you know, you and I..."
				});
				options.push({ nameStr : "Okay",
					func : function() {
						Text.NL();
						Text.Add("You decide it's best not to mention to the elf that what the two of you have done constitutes as sex.", parse);
						Text.NL();
						Text.NL();
						Scenes.Kiakai.TalkPriest();
					}, enabled : true,
					tooltip : "Don't mention it."
				});
				if(kiakai.flags["TalkedSex"] == 1) {
					options.push({ nameStr : "Confront",
						func : function() {
							Text.Clear();
							Text.Add("What is so wrong with sex? It's just natural reproductive urges after all...", parse);
							Text.NL();
							Text.Add("<i>“The tenets of the order are very strict on this, [playername],”</i> [name] confides. <i>“I... ah, accept that others engage in it of course, but it is not permitted for the priesthood.”</i>", parse);
							Text.NL();
							Text.Add("Why is that? How can the deepest expression of love be so repressed?", parse);
							Text.NL();
							Text.Add("<i>“I do not claim to know the reason for this, but I cannot disobey the High Priestess on this matter.”</i> [name] looks torn, [hisher] emotions pulling [himher] one way, while [hisher] duty holds [himher] back.", parse);
							Text.NL();
							Text.Add("Frustrated, you tell the elf that [heshe] should move according to [hisher] own heart, not to what others decree for [himher]. You think that this teaching is wrong, and you doubt that it is a belief that is really held by Aria. After all, why would such a benevolent Goddess withhold the highest forms of pleasure from her followers?", parse);
							Text.NL();
							Text.Add("<i>“You... have a point,”</i> [name] grudgingly admits. <i>“I have never thought too deeply on the subject, but now that you mention it, it does sound strange.”</i> The elf looks thoughtful for a moment. <i>“In all honesty, I am not sure that the rule is followed very diligently by the other priests. Alas, that is not the only reason I have,”</i> [heshe] says in a small voice, looking sad.", parse);
							Text.NL();
							Text.Add("You wait in silence, letting [name] gather courage to speak. <i>“I may have told you of this, but pregnancy and child-rearing is different for my kind.”</i>", parse);
							Text.NL();
							if(kiakai.FirstVag()) {
								Text.Add("<i>“A pregnancy is very hard on an elvish woman, I... I am afraid.”</i> [name] hugs [himher]self, looking scared. <i>“I could not withstand such pain as they go through, it would break me. Besides...”</i>", parse);
								Text.NL();
							}
							Text.Add("<i>“Elvish children are very important, since so very few of them are born. They are raised by an entire community, such as the village I am from. I would not withhold such an experience from any child.”</i> [name] turns to you, eyes moist. <i>“My time outside the village has changed me, I am afraid. I could not bear not having a hand in raising my own child. Were I ever to have a child, I would have to leave the priesthood and return to my village. I would have to... to leave you.”</i>", parse);
							Text.NL();
							Text.Add("Could [heshe] not use contraceptives to avoid getting pregnant?", parse);
							Text.NL();
							Text.Add("<i>“I do not know,”</i> the elf looks gloomy. <i>“Neither I nor anyone at the shrine knew much of elven physiology; it may well be that what works for regular humans would not work for me. I simply cannot take the risk.”</i>", parse);
							Text.Flush();
							
							Gui.NextPrompt(function() {
								Text.Clear();
								
								Text.Add("[name]'s dilemma is understandable, but you are not willing to give up on [himher] so easily. Taking [hisher] hand, you pull [himher] down to sit with you. Patiently, you explain to the elf that there are many ways for two persons to make love to each other, with little to no chance for pregnancy.", parse);
								Text.NL();
								Text.Add("At first, [heshe] looks very uncomfortable, perhaps for the first time understanding the implications of [hisher] healing techniques. After a while, the elf begins to look intrigued, even surprising you by asking questions.", parse);
								Text.NL();
								Text.Add("<i>“C-can you really do that?”</i> [heshe] blushes at a particularly raunchy suggestion. Smiling, you respond by asking [himher] if [heshe]'d like to try.", parse);
								Text.NL();
								Text.Add("It is several hours later when you finish your talk, and by now, [name] has a very different outlook on things.", parse);
								Text.NL();
								Text.Add("<i>“Well, would you like to try some of that with me?”</i> you ask in a sultry voice.", parse);
								Text.NL();
								Text.Add("<i>“I... umm... I guess I would not mind...”</i> [name] mumbles. You give [himher] a kiss on the cheek before gathering your gear.", parse);
								Text.Flush();
								
								player.AddLustFraction(0.3);
								kiakai.AddLustFraction(0.6);
								world.TimeStep({hour: 3});
								
								Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
								
								kiakai.flags["TalkedSex"] = 2; // Locks this option, opens sex again
							});
						}, enabled : true,
						tooltip : Text.Parse("This seems to be at the root of [name]'s reluctance. Try to confront [himher] about this practice.", parse)
					});
				}
				Gui.SetButtonsFromList(options);
			}
			else
				Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
		});
	}
	if(kiakai.relation.Get() > 50) {
		// Celibacy2
		scenes.push(function() {
			Text.Add("<i>“Although priests are supposed to be celibate, [playername], I suspect that some do not follow the decree,”</i> [name] tells you, looking concerned.", parse);
			Text.NL();
			Text.Add("<i>“I have seen some in the priesthood in possession of illicit materials.”</i> [HeShe] blushes slightly. <i>“And I have also witnessed some pairs holding hands as they walk! I have even seen one pair enter an empty room, where I knew they could not possibly have any duties.”</i>", parse);
			Text.NL();
			Text.Add("<i>“W-worst of all, sometimes I... I hear noises...”</i> [name] trails off, clearly too embarrassed to continue on the topic.", parse);
			Text.NL();
			if(kiakai.flags["Sexed"] != 0)
				Text.Add("You're not sure how to respond, considering the noises you've heard [name] make.", parse);
			Text.NL();
			Text.NL();
			Scenes.Kiakai.TalkPriest();
		});
	}
	// Other
	scenes.push(function() {
		Text.Add("<i>“The priesthood is meant to uphold the highest moral virtues,”</i> [name] tells you proudly. <i>“Though it is acknowledged that it is impossible for mortals to achieve perfection, we must always strive for it.”</i>", parse);
		Text.NL();
		Text.Add("<i>“We must always show compassion and generosity to those in need - whether it be through healing, physical aid or advice, and we must protect those in danger. We also strive to attain spiritual purity to best understand the wishes of our Lady Aria, and to serve as a suitable conduit for her power to better the world.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Above all, we must oppose evil wherever we see it, and help to protect the integrity of all worlds as much as we are able.”</i> The elf seems almost to puff up at this recitation of [hisher] calling, clearly determined to do [hisher] utmost to fulfill these goals.", parse);
		Text.NL();
		Text.NL();
		Scenes.Kiakai.TalkPriest();
	});
	
	var sceneId = kiakai.flags["RotPrDisc"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(30, 1);
	}
	
	kiakai.flags["RotPrDisc"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
}



Scenes.Kiakai.TalkPriestActivities = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Clear();
	
	
	var scenes = [];
	
	// Chores
	scenes.push(function() {
		Text.Add("<i>“There are many chores that need to get done just to keep the shrine running,”</i> [name] tells you. <i>“There is cooking to be done in the kitchens, tending the shrine's fields and gardens, cleaning the floors and maintaining the buildings... Although the priesthood employs some full-time staff to assist with these, much of the work falls to novices and apprentices.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Learning and studying priestly arts naturally come first, but for beginners, a large part of the day is also dedicated to this type of labor. It is said that hard work helps develop character and, by exhausting the body, brings the mind closer to the Lady.”</i>", parse);
		Text.NL();
		if(kiakai.relation.Get() > 25)
			Text.Add("<i>“Though, to be honest with you, I have found my mind ever closer to oblivion than to Aria after a grueling day of work.”</i>", parse);
	});
	// Study
	scenes.push(function() {
		Text.Add("<i>“Apprentices and acolytes spend much of their day trying to grasp the mysteries of Aria,”</i> [name] informs you. <i>“We do not have one holy book, but there are many tomes telling tales of other worlds, and of the goodness of Aria in aiding all. There are also spoken verses that all in the priesthood are required to memorize, as their knowledge and recitation help focus the mind on our Lady.”</i>", parse);
		Text.NL();
		Text.Add("<i>“In addition to this, many, especially among the acolytes and diviners, choose to study books of knowledge of the world, of nature, and even of the arts of men, so that they may better understand how to serve Aria in Eden and elsewhere. Others eschew arcane study in favor of studying healing, learning of the workings of the bodies of animals and men and others. This study is favored by the clerics and acolytes who wish to join their ranks.”</i>", parse);
		Text.NL();
		Text.Add("And what about [himher]?", parse);
		Text.NL();
		Text.Add("[name] blushes slightly. <i>“I have studied both lores quite extensively. I... I wish to serve Lady Aria in whatever way she may desire, and thus I wish to be prepared for all eventualities.”</i> ", parse);
	});
	// Copying
	scenes.push(function() {
		Text.Add("<i>“Instead of the menial chores of novices, many acolytes, as well as some of the more talented apprentices, take on the work of copying manuscripts.”</i>", parse);
		Text.NL();
		Text.Add("<i>“The shrine contains an even bigger library than the human capital,”</i> [name] tells you proudly, <i>“and visiting scholars often request that we make copies of particular items in it. In addition, some books are so ancient that they must be copied, lest they fall to decay.”</i>", parse);
		Text.NL();
		Text.Add("<i>“The priesthood also sometimes has us copy some of the more popular volumes and sells them in the kingdom,”</i> the elf tells you, sounding doubtful of this practice. <i>“I suppose it is for the best, for it gives us funds to do more good, and spreads knowledge to the world.”</i>", parse);
	});
	// Good works
	scenes.push(function() {
		Text.Add("<i>“Clerics often go out into the world in response to the needs of the people, and sometimes take acolytes with them,”</i> [name] tells you, looking wistful. <i>“They provide succor to the sick, healing everything from terrible wasting diseases to broken bones.”</i>", parse);
		Text.NL();
		Text.Add("<i>“At the same time, they gather the people to them, and tell them of Lady Aria, and teach the people to revere her and aid her in her deeds.”</i>", parse);
		Text.NL();
		Text.Add("You ask if [name] has gone out with the clerics.", parse);
		Text.NL();
		Text.Add("<i>“Sadly, I have had but one chance to venture outside the shrine in this fashion. It seems that most clerics do not wish to have me along with them.”</i> [HeShe] looks momentarily downcast. <i>“Of course, then came the second chance when I was called by Lady Aria to come meet you,”</i> [heshe] adds, cheering up.", parse);
	});
	// Advising
	scenes.push(function() {
		Text.Add("<i>“Some among the diviners have largely left the shrine, and taken up residence in the human capital, where they have become advisers. All diviners know much about the world and about human affairs, and as such, many in positions of power see their advice as invaluable.”</i>", parse);
		Text.NL();
		Text.Add("<i>“In return, providing such advice gives them a perfect opportunity to turn the deeds of the mighty to serve the will of Aria, and to help the world. All of them still report to the order heads and the High Priestess, and they occasionally come back to the shrine to inform the others of what is going on in the world, or to seek guidance from their peers when they feel they need it.”</i>", parse);
		if(kiakai.relation.Get() > 25) {
			Text.NL();
			Text.Add("<i>“Between you and me,”</i> [name] adds, <i>“I question the piety of such diviners whom I have met. I fear some of them may have become seduced by worldly power and riches, and report to the High Priestess, and even serve Lady Aria, in name only.”</i>", parse);
		}
	});
	// Rituals
	scenes.push(function() {
		Text.Add("<i>“Once a week, all at the shrine, whether priests or visitors, gather to pray together, [playername],”</i> [name] tells you. <i>“It is an occasion of communal bonding, letting us feel each other's devotion and be strengthened by it. We ask Aria to support us in our deeds and to guide us in fulfilling her will. I have quite missed these in the time I have been traveling,”</i> [heshe] confesses. <i>“They bring a sense of certainty and confidence to all in the priesthood.”</i>", parse);
		Text.NL();
		Text.Add("<i>“In addition, once every season there is a bigger celebration. It is a wondrous occasion, to which many come from the outlying villages, with patrols going out from the shrine and from the kingdom to help guide those who wish it past the beasts in the woods. Many in the priesthood play beautiful music, candles illuminate the grand hall deep into the night like a myriad of stars, and the kitchens labor day and night to provide food for any who wish it at the gathering.”</i> [name] speaks wistfully, a relaxed smile on [hisher] face, and you tell [himher] you'd like to see this celebration sometime.", parse);
	});
	
	var sceneId = kiakai.flags["RotPrAct"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(30, 1);
	}
	
	kiakai.flags["RotPrAct"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	Text.NL();
	Text.NL();
	Scenes.Kiakai.TalkPriest();
}


Scenes.Kiakai.TalkPriestYrissa = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Clear();
	
	
	var scenes = [];
	
	// General
	scenes.push(function() {
		Text.Add("<i>“The current High Priestess of the order is Yrissa. She has held the position for two seven-year cycles in a row now, having assumed it at a young age.”</i>", parse);
		Text.NL();
		Text.Add("<i>“She was actually the one who brought me from the village to the order.", parse);
		Text.NL();
		
		if(kiakai.relation.Get() > 25 || kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral)
			Text.Add("She is very precious to me,”</i> [name] confesses. <i>“She was the one who made sure I was accepted even though the leadership back then was still skeptical of admitting an elf, and she has been like an older sister, and sometimes almost a... mother, to me.”</i>", parse);
		else
			Text.Add("She has kept watch over me since then, making sure that I am doing well and learning to best serve Lady Aria. She has been a great help in guiding me on my path, [playername]. Perhaps she will be able to assist you, as well,”</i> [name] tells you, looking you straight in the eyes.", parse);
		Text.NL();
		Text.Add("<i>“She is generous and kind, but also strict and meticulous in ensuring that Aria's will is done. She, more than anyone, acts for the preservation of the worlds, and to ensure the dominion of our Lady's goodness.”</i>", parse);
	});
	// Ambition
	scenes.push(function() {
		Text.Add("<i>“When Yrissa came for me in my village, she was in her teens, but already the order had recognized her abilities and potential. From there, she rose rapidly through the ranks, and her abilities were seen by all when she rose to the rank of High Priestess at the almost unheard-of age of thirty-two,”</i> [name] tells you, pride evident in [hisher] voice.", parse);
		Text.NL();
		Text.Add("<i>“She has been skillful in directing the order since then, and ensuring that all our abilities are bent to the service of Aria.”</i>", parse);
	});
	if(kiakai.relation.Get() > 50)
	{
		// Promotion
		scenes.push(function() {
			Text.Add("<i>“To be honest with you, I often wish that Yrissa would simply have me promoted already. I think there are many among the order heads who oppose the promotion of an elf to the full prestige of a diviner or cleric, but she could override them if she wished to. I suspect that she had to override them just to get me to the rank of acolyte.”</i> [name] looks petulant, saying this.", parse);
			Text.NL();
			Text.Add("<i>“The last time we spoke of this, she had told me that it is best that I wait, so that the others can reconcile themselves to my skills, and my place in the order. How much longer must I wait?”</i> The elf exclaims, frustrated. <i>“I am already the equal of most clerics in healing ability, and of most diviners in knowledge! What else do they wish of me before they acknowledge me?”</i> [HeShe] pauses, making a visible effort to calm [himher]self.", parse);
			Text.NL();
			Text.Add("<i>“Ah, forgive me, [playername], I let my pride get the better of me.”</i>", parse);
			Text.NL();
			Text.Add("You tell [himher] that there is nothing to forgive, and you quite understand [hisher] frustration.", parse);
		});
	}
	
	var sceneId = kiakai.flags["RotPrYrissa"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(20, 1);
	}
	
	kiakai.flags["RotPrYrissa"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	Text.NL();
	Text.NL();
	Scenes.Kiakai.TalkPriest();
}


Scenes.Kiakai.TalkPriestAria = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Clear();
	
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		Text.Add("<i>“Most in the priesthood speak of conversing with Lady Aria almost every day. They pray to her at night, and hear what she wishes of them in response. Sometimes, they even find that small miracles occur, as she lights their way to doing her will.”</i> [name] sounds a little despondent as [heshe] tells you this.", parse);
		Text.NL();
		Text.Add("<i>“For some reason, she does not speak to me as often. Perhaps even she prefers to communicate with humans rather than with elves. I know for certain that I have heard from her but twice in my life. The first time she spoke to me, I knew that I must leave the village of my birth, and come to aid her at the shrine, and the second, she told me come and find you.”</i> [name] smiles gently. <i>“I suppose I ought not to complain about the lack of communications, when their import is so great.”</i>", parse);
		
		if(kiakai.relation.Get() > 40) {
			Text.NL();
			Text.Add("The elf pauses, thinking a little, before adding, <i>“To be entirely honest with you, [playername], sometimes I wonder if the other priests hear from Lady Aria at all. The two times she spoke to me, I knew I could have no mistake nor illusion about either her message or intent. I beheld her corporeal form, and the beautiful sight of her garden as well. When the other priests speak of conversing with her, however, it is never something so clear or vivid, and often they receive ambiguous or even conflicting messages.”</i> [name] shakes [hisher] head. <i>“Despite this, I know they are good men and women, and would not invent revelation where there is none. I simply do not know what to make of it.”</i>", parse);
		}
	});
	
	var sceneId = kiakai.flags["RotPrAria"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(20, 1);
	}
	
	kiakai.flags["RotPrAria"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	Text.NL();
	Text.NL();
	Scenes.Kiakai.TalkPriest();
}

Scenes.Kiakai.TalkPriestMeeting = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Text.Clear();
	
	var scenes = [];
	
	// Short version
	scenes.push(function() {
		Text.Add("<i>“It was a simple thing, [playername]. As I meditated in the gardens, Lady Aria entered my mind, and sent me a vision of her wishes. She told me of your arrival, and showed you to me, instructing me in what I need to do for you.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I set out as soon as I could and after several days of travel, I arrived at the nomad camp,”</i> [name] recalls, smiling. <i>“They were not too welcoming at first, but I was able to aid them with my healing, and we reached an understanding. There, I waited for half a day, and found you after your descent.”</i>", parse);
		Text.NL();
		Text.Add("You ask [himher] how it could be possible for [himher] to travel for so long and still get there before you, when your own trip through the worlds felt like it was less than a day.", parse);
		Text.NL();
		Text.Add("<i>“That, I do not know,”</i> the elf replies. <i>“It could be that time flows differently in the other worlds, or that your passage through the boundaries was longer than you perceived. Perhaps it could be that Lady Aria foresaw your arrival, and knew to send me to wait for you before you had even left your world.”</i>", parse);
	});
	if(kiakai.relation.Get() > 50) {
		// Detailed version
		scenes.push(function() {
			Text.Add("<i>“I... I have a confession to make, [playername],”</i> [name] says, looking embarrassed. <i>“Although I did not say anything untrue to you about the way I came to fetch you, I may have omitted some details.”</i>", parse);
			Text.NL();
			Text.Add("You ask what [heshe] means.", parse);
			Text.NL();
			Text.Add("<i>“Well, you see, when I received Lady Aria's instructions while meditating, I indeed hurried off to my room to pack immediately. However, what I did not tell you is that, in my haste, I spared no time to inform any person in the priesthood of my intent.”</i> The elf looks conflicted saying this. <i>“Not even Yrissa. Now, I do not know how they will welcome me back - <b>if</b> they will welcome me back.”</i>", parse);
			Text.NL();
			Text.Add("<i>“There was naught else I could do, [playername]! How was I to prove that my revelation was genuine, when the only sign of it was in my mind. If they hesitated or debated, or, worst of all, did not believe me, my purpose would have been ruined. Not telling the priesthood of Lady Aria's wishes was the only way I could carry them out!”</i>", parse);
			Text.NL();
			
			if(kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral)
				Text.Add("You hug the agitated elf, telling [himher] that [heshe] chose well. If [heshe] had delayed, you would've been lost, a near-dead stranger in a strange land, and Aria's plan would have been for naught.", parse);
			else
				Text.Add("You pat the agitated elf on the head, telling [himher] that [heshe] did well. You tell [himher] that [heshe] doesn't need to worry about the attitude of the priesthood while [heshe]'s following you. After all, in serving you, [heshe] furthers the will of Aria.", parse);
		});
	}
	
	var sceneId = kiakai.flags["RotPrMeeting"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(20, 1);
	}
	
	kiakai.flags["RotPrMeeting"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	Text.NL();
	Text.NL();
	Scenes.Kiakai.TalkPriest();
}


