/*
 * 
 * Define Kia/Kai
 * 
 */
function Kiakai(storage) {
	Entity.call(this);
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
	this.body                  = new Body();
	this.body.head.hair.color  = Color.silver;
	this.body.head.hair.length.base = 15;
	this.body.head.eyes.color  = Color.purple;
	this.body.SetRace(Race.elf);
	
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

Kiakai.prototype.ItemUsable = function(item) {
	return true;
}

Kiakai.prototype.JobDesc = function() {
	return "acolyte";
}

// TODO TEMP
Kiakai.prototype.ArmorDescLong = function() {
	return "a light blue robe of soft cloth with short sleeves, ending just above the knees";
}

// TODO TEMP
Kiakai.prototype.ArmorDesc = function() {
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
Kiakai.prototype.Interact = function() {
	Text.Clear();
	var that = kiakai;
	
	var parse = {
		playername : player.name,
		name       : kiakai.name,
		hisher     : kiakai.hisher()
	};
	
	if(kiakai.flags["Attitude"] == Kiakai.Attitude.Nice) {
		Text.AddOutput("The elf perks up as you approach, giving you a friendly smile. <i>\"What is on your mind, [playername]?\"</i>", parse);
	}
	else if(kiakai.flags["Attitude"] == Kiakai.Attitude.Naughty) {
		Text.AddOutput("The elf regards your approach with a wary gaze, not sure what you are after. <i>\"Yes?\"</i>", parse);
	}
	else {
		Text.AddOutput("[Error in Kiakai attitude: " + kiakai.flags["Attitude"] + "]");
	}
	Text.Newline();
	
	that.PrintDescription();
	
	var options = [];
	
	options.push({ nameStr: "Talk",
		func : function() {
			that.TalkPrompt();
		}, enabled : true
	});
	/*
	options.push({ nameStr: "Release",
		func : function() {
			Text.Clear();
			Text.AddOutput("[Placeholder] You masturbate fiercely, cumming buckets.");
			
			world.TimeStep({minute : 10});
			
			that.curLust = 0;
			
			Gui.NextPrompt(that.Interact);
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	*/
	
	options.push({ nameStr: "Meditate",
		func : function() {
			Text.Clear();
			Text.AddOutput("Placeholder: [name] sits down and attempts to calm [hisher] thoughts.", parse);
			
			world.TimeStep({minute : 30});
			
			that.curLust -= that.spirit.Get() * 3;
			if(that.curLust < 0) that.curLust = 0;
			
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
	
	options.push({ nameStr: "Equip",
		func : function() {
			that.EquipPrompt(that.Interact);
		}, enabled : true
	});
	options.push({ nameStr: that.pendingStatPoints != 0 ? "Level up" : "Stats",
		func : function() {
			that.LevelUpPrompt(that.Interact);
		}, enabled : true
	});
	options.push({ nameStr: "Job",
		func : function() {
			that.JobPrompt(that.Interact);
		}, enabled : true
	});
	options.push({ nameStr: party.InParty(that, true) ? "Switch out" : "Switch in",
		func : function() {
			party.SwitchPrompt(that);
		}, enabled : true,
		tooltip: party.InParty(that, true) ? "Send to reserve." : "Switch into active party."
	});
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}

Kiakai.prototype.TalkPrompt = function() {
	Text.Clear();
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.AddOutput("What do you want to talk with [name] about?", parse);
	
	var options = [];
	// TALK ABOUT MAIN QUEST
	options.push({ nameStr: "Quest",
		func : Scenes.Kiakai.TalkQuest, enabled : true,
		tooltip : "Talk about your goals."
	});
	// TALK ABOUT ARIA
	options.push({ nameStr: "Aria",
		func : Scenes.Kiakai.TalkAria, enabled : true,
		tooltip : "Ask about Aria."
	});
	// TALK ABOUT URU
	options.push({ nameStr: "Uru",
		func : Scenes.Kiakai.TalkUru, enabled : true,
		tooltip : "Ask about Uru."
	});
	// TALK ABOUT EDEN
	options.push({ nameStr: "Eden",
		func : Scenes.Kiakai.TalkEden, enabled : true,
		tooltip : "Ask about the land of Eden and it's people."
	});
	// TALK ABOUT ELVES
	options.push({ nameStr: "Elves",
		func : Scenes.Kiakai.TalkElves, enabled : true,
		tooltip : Text.Parse("Ask [name] about [hisher] childhood with the elves.", parse)
	});
	// TALK ABOUT PRIESTHOOD
	options.push({ nameStr: "Priesthood",
		func : Scenes.Kiakai.TalkPriest, enabled : true,
		tooltip : "Ask about the priests of Aria."
	});
	// TALK RAVENS
	var r = ravenmother.Ravenness();
	if(r >= RavenMother.Stage.ravenstage2 + 2 &&
	   ravenmother.flags["Met"] == 0) {
		options.push({ nameStr : "Ravens",
			func : function() {
				Scenes.Kiakai.RavenDreams();
				Gui.NextPrompt(kiakai.TalkPrompt);
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
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	Text.Add("You briefly tell [name] about the ravens you’ve noticed watching you in your dreams.", parse);
	Text.NL();
	Text.Add("<i>“That is very strange, [playername],”</i> [heshe] responds. <i>“Of course there are legends of demons and spirits appearing in people’s dreams, but I have never thought that anyone but lady Aria could actually do so. Yet I admit that what you say does not sound like a coincidence. It must be some form of powerful magic. You must be careful, [playername]!”</i>", parse);
	Text.NL();
	Text.Add("<i>“As to ravens themselves, there is something peculiar about them. There is a connection that elves feel with almost all life on Eden, with all the plants, and all the animals. Yet, that connection is not present with ravens.”</i> [name] rubs [hisher] chin pensively. <i>“I have heard that in some of our oldest scrolls, a time is mentioned when ravens simply appeared in the world.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Where they came from or how they came to be here, even those scrolls do not say. It may be that this is somehow connected with what is happening in your dreams, but I am afraid you will have to find how for yourself.”</i>", parse);
	Text.NL();
	Text.Add("You thank the elf for [hisher] help, your curiosity piqued by the information. There really is something strange about the ravens in this world. You’ll just have to find out what it is.", parse);
	Text.Flush();
}

Scenes.Kiakai.TalkQuest = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
			
	// Initial stage
	if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
		Text.AddOutput("You ask what you are to do with the gem.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Lady Aria has told me that the gem holds great power. If you are able to wield it, maybe it can be used to stop Uru before it is too late.\"</i> [name] looks at you suspiciously, clearly wondering if that's what you'd really do with it. <i>\"Unfortunately, I know nothing of the magic that powers the artifact.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("Couldn't you just ask Aria?", parse);
		Text.Newline();
		Text.AddOutput("<i>\"The lady would no doubt be able to assist, but I have been unable to contact her since you arrived on Eden. We will need to seek out someone knowledgeable about such things - perhaps a powerful magician or a skilled alchemist.\"</i>", parse);
	}
	else {
		Text.AddOutput("<i>\"Our first objective should be to find out more about that gemstone that you are carrying,\"</i> [name] suggests. <i>\"According to lady Aria, it holds great power. If you are able to wield it, maybe it can be used to stop Uru before it is too late.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("When you ask [himher] how to best achieve that, the elf frowns thoughtfully. <i>\"I know nothing of the magic that powers this artifact, we will need to find either a powerful magician or a skilled alchemist who can study it closer.\"</i> [name] lets out a sigh of frustration, <i>\"The lady would no doubt be able to assist, but I have been unable to contact her since you arrived on Eden, I am afraid we are on our own.\"</i>", parse);
	}
	Text.Newline();
	
	if(rosalin.flags["Met"] == 0) {
		Text.AddOutput("<i>\"I know that there is an alchemist at the nomad campsite, but I am not aware how skilled she is. Perhaps she could point us in the right direction, though?\"</i>", parse);
	}
	else {
		Text.AddOutput("<i>\"About that cat girl... we should probably try to find someone more, so to speak, sane,\"</i> the elf shakes [hisher] head. <i>\"We could probably find someone in the city - many folk pass through there.\"</i>", parse);
		
		Text.Newline();
		if(rigard.Access()) {
			Text.AddOutput("<i>\"Question is, how do we get in?\"</i>", parse);
			
			Text.Newline();
			Text.AddOutput("<i>\"Perhaps we could try to have one of the farmers sneak us in. They must pass inside regularly to sell their produce. We will have to make sure they're friendly enough to let us tag along, however.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"I am sure we will be able to find other ways of gaining entrance eventually as well.\"</i>", parse);
		}
		else if(rigard.flags["RoyalAccess"] == 0) {
			Text.AddOutput("<i>\"I hear that the court mage is a skilled alchemist, perhaps we could seek an audience with her?\"</i>", parse);
		}
		else {
			Text.AddOutput("<i>\"We should find the court mage and ask her about the gem.\"</i>", parse);
		}
		// TODO: Further down main quest
	}
	
	Gui.NextPrompt(kiakai.TalkPrompt);
}

Scenes.Kiakai.TalkAria = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	// First time
	if(kiakai.flags["TalkedAria"] == 0) {
		
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
			Text.AddOutput("<i>\"You may be ignorant of much, [playername], but you have had the honor of standing in her presence yourself.\"</i> [name] looks a little angry, perhaps almost jealous. <i>\"She is the lady of light, the embodiment of good in the worlds. Surely you must have seen at least that much?\"</i>", parse);
		}
		else {
			Text.AddOutput("<i>\"I guess things have been dropped on you rather suddenly, [playername],\"</i> [name] concedes, looking rather embarrassed. <i>\"It was not my intention to keep you in the dark about anything. Please, ask me anything you would like to know.\"</i>", parse);
		}
		Text.Newline();
		Text.AddOutput("You explain that you would like to know more about Aria and her followers.", parse);
		Text.Newline();
		
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
			Text.AddOutput("<i>\"It is good that you take interest in her.\"</i> The elf seems a little relieved that you're interested in [hisher] goddess. ", parse);
		}
		else {
			Text.AddOutput("<i>\"Certainly!\"</i> The elf looks happy that you brought up this particular topic, it seems that [heshe] definitely is a devout follower. ", parse);
		}
		Text.AddOutput("<i>\"Lady Aria is revered by many here on Eden, and for good reason. While it is not common, there have been incidents with portals to other worlds opening up prior to your arrival here,\"</i> [name] starts out, <i>\"Sometimes through design, sometimes due to happenstance, sometimes due to malice. The times that something... untoward emerged from the other side, the lady exerted her powers to bind it before it could cause significant harm.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("You ask how long this has been going on. <i>\"The records are not clear on this, and the records of my people go back a long time,\"</i> [name] answers you. <i>\"These kinds of portals have been opening on Eden for thousands of years, as far as I know.\"</i>", parse);
		Text.Newline();
		
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
			Text.AddOutput("<i>\"Is there anything else that you would like to know about lady Aria, [playername]?\"</i>", parse);
		else
			Text.AddOutput("<i>\"Tell me, is there anything else that you would like to know about lady Aria, [playername]?\"</i>", parse);
		
		kiakai.relation.IncreaseStat(50, 2);
		
		kiakai.flags["TalkedAria"] = 1;
	}
	else {
		Text.AddOutput("<i>\"What else would you like to know about lady Aria, [playername]?\"</i>", parse);
	}
	Text.Newline();
	
	var options = [];
	// TALK ABOUT ARIA'S GOALS
	options.push({ nameStr: "Goals",
		func : function() {
			Text.Clear();
			Text.AddOutput("What are Aria's goals exactly? For what reason is she putting so much effort into keeping Eden safe?", parse);
			Text.Newline();
			
			if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
				Text.AddOutput("[name], looking affronted, replies curtly, <i>\"She is the caretaker of the worlds, [playername]! It is her very nature to protect those who follow and worship her!\"</i> You explain that while she did seem benevolent when you met her, you still need to find out everything you can about your situation. Still a bit huffy, [heshe] goes on, <i>\"It is not for us to know exactly what the lady's plans are, we need only trust in her and we will no doubt prevail. I do know that you are instrumental for them, however.\"</i>", parse);
			else
				Text.AddOutput("[name], looking affronted, replies curtly, <i>\"For the safety of those who follow and worship her, of course!\"</i> You calm the elf down, explaining that you meant no offense. Still a bit huffy, [heshe] continues, <i>\"It is not for me to know exactly what the lady's plans are, but I do know that you are instrumental for them.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("When you ask exactly what [heshe] means by that, [name] only responds that something about you, or perhaps the gem you carry, could greatly change the future of Eden. [HeShe] seems unwilling or unable to explain more details at this point.", parse);
			
			Gui.NextPrompt(Scenes.Kiakai.TalkAria);
		}, enabled : true,
		tooltip : "Ask about what Aria's goals are."
	});
	Gui.SetButtonsFromList(options, true, kiakai.TalkPrompt);
	
}

Scenes.Kiakai.TalkUru = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	
	if(kiakai.flags["TalkedUru"] == 0) {
		Text.AddOutput("<i>\"I would rather not dwell on the dark one longer than I have to, [playername],\"</i> [name] tells you in a pained voice, <i>\"But one must know their enemy to stand against it in battle.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("The elf clears [hisher] throat, preparing for a longer dissertation. <i>\"Uru is a foul and evil creature, utterly selfish and chaotically destructive,\"</i> [heshe] begins, <i>\"I know very little of the details, but she and lady Aria have battled with each other before, though I do not know where.\"</i>", parse);
		Text.Newline();
		
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
			Text.AddOutput("<i>\"I thankfully have not experienced it as you have. I have seen visions of the hellish realm she has been trapped in,\"</i> [name] shudders uncomfortably. <i>\"The truly terrible thing is that that realm was once lush and filled with life, now it is nothing more than a defiled wasteland, plagued by demons.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Do not trust her under any circumstances, [playername]! She is treacherous, the very embodiment of evil!\"</i> The elf adds, clearly worried.", parse);
		}
		else
			Text.AddOutput("<i>\"And though I thankfully have not experienced it as you have, I have seen visions of the hellish realm she has been trapped in,\"</i> [name] shudders uncomfortably, <i>\"That realm was once lush and filled with life, now it is nothing more than a defiled wasteland, plagued by demons.\"</i>", parse);
		
		Text.Newline();
		Text.AddOutput("<i>\"Where she came from, what she is, what her goals are, the lady has yet to see fit to inform me. A kindness, I imagine,\"</i> the elf concedes, <i>\"I am afraid that you have to ask the lady yourself to find out more. I will try to answer any questions you have to the best of my abilities, though.\"</i>", parse);
		kiakai.relation.IncreaseStat(50, 2);
		
		kiakai.flags["TalkedUru"] = 1;
	}
	else {
		Text.AddOutput("<i>\"What else would you know of the evil one, [playername]?\"</i> [name] asks, [hisher] discomfort clear in [hisher] expression.", parse);
	}
	
	
	var options = [];
	// TALK ABOUT CONFLICT WITH ARIA
	options.push({ nameStr: "Conflict",
		func : function() {
			Text.Clear();
			
			Text.AddOutput("[name] frowns, trying to collect [hisher] thoughts, <i>\"All I know is that lady Aria has done battle with the one known as Uru before, and that their last conflict ended in Uru being trapped in the realm you saw but a brief glimpse of.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("What of Aria herself, you ask, did she suffer any consequence from the battle?", parse);
			Text.Newline();
			Text.AddOutput("<i>\"The lady bested her adversary, of course she did, and even showed mercy on the foul creature,\"</i> the elf sorrowfully bows [hisher] head, <i>\"While she did not suffer any wounds, the encounter drained her, and she has yet to manifest on Eden since.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("In power, would [name] say they are evenly matched?", parse);
			Text.Newline();
			Text.AddOutput("<i>\"No! Of course not!\"</i> the elf exclaims, <i>\"No mere demon could ever match the lady.\"</i>", parse);
			
			Gui.NextPrompt(Scenes.Kiakai.TalkUru);
		}, enabled : true,
		tooltip : "Ask about the conflict between Uru and Aria."
	});
	// TALK ABOUT WHY URU WAS TRAPPED
	options.push({ nameStr: "Trapped",
		func : function() {
			Text.Clear();
			
			Text.AddOutput("<i>\"Understand that a being so powerful cannot easily pass between the realms,\"</i> [name] explains, <i>\"A regular portal could not withstand her passing, and her inability to create a more stable one has kept the other planes of existence safe till now.\"</i> The elf bows [hisher] head sorrowfully, <i>\"But this safety is dearly bought, as an entire realm is now under her influence.\"</i>", parse);
			Text.Newline();
			
			if(kiakai.flags["TalkedUruDA"] == 0) {
				
				if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
					Text.AddOutput("[name] looks at you pleadingly, fear visible in [hisher] eyes, <i>\"Y-you saw what it was like there, didn't you, [playername]? She <b>cannot</b> be allowed to enter Eden!\"</i>", parse);
				else
					Text.AddOutput("[name] grabs your hand, fear visible in [hisher] eyes, <i>\"Y-you saw what it was like there, didn't you, [playername]? She <b>cannot</b> be allowed to enter Eden!\"</i>", parse);
				Text.Newline();
				
				// [Comfort][Boast][Who cares]
				var options = [];
				options.push({ nameStr: "Comfort",
					func : function() {
						if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
							Text.AddOutput("You take pity on the poor elf and embrace [himher]. You feel [hisher] body momentarily go rigid, surprised by your actions, before [heshe] relaxes in your arms. You do your best to soothe and calm [himher] as you assure [himher] that it will not come to that. The elf's shaking slowly subsides as [heshe] presses desperately against you.", parse);
							Text.Newline();
							Text.AddOutput("<i>\"Th-thank you for that,\"</i> [name] mumbles, disentangling [himher]self from you and blushing. <i>\"Perhaps I have misjudged you.\"</i>", parse);
							Text.Newline();
							Text.AddOutput("You insist that [heshe] can lean on your shoulder if [heshe] needs help. [name] smiles at you, before changing the subject.", parse);
						}
						else {
							Text.AddOutput("You take pity on the poor elf and embrace [himher], soothing and calming as you assure [himher] that it will not come to that. The elf's shaking slowly subsides as [heshe] melts in your arms, resting [hisher] head on your chest.", parse);
							Text.Newline();
							Text.AddOutput("<i>\"Th-thank you,\"</i> [name] mumbles, disentangling [himher]self from you and blushing, <i>\"I am sorry, I gave in to my fears... it will not happen again.\"</i>", parse);
							Text.Newline();
							Text.AddOutput("You insist that [heshe] can lean on your shoulder anytime. [name] blushes brightly before trying to change the subject.", parse);
						}
						
						kiakai.relation.IncreaseStat(100, 5);
						
						Gui.NextPrompt(Scenes.Kiakai.TalkUru);
					}, enabled : true,
					tooltip : Text.Parse("Try to comfort [himher].", parse)
				});
				options.push({ nameStr: "Boast",
					func : function() {	
						Text.AddOutput("<i>\"Hah, that demon isn't so tough,\"</i> you brag confidently, ", parse);
						if(gameCache.flags["IntroFuckedUru"]   != 0 ||
						   gameCache.flags["IntroFuckedByUru"] != 0)
							Text.AddOutput("<i>\"I could handle her just fine, I left her begging for more!\"</i>", parse);
						else
							Text.AddOutput("<i>\"I could easily withstand her wiles, you have nothing to fear as long as I'm around!\"</i>", parse);
						Text.Newline();
						
						Text.AddOutput("[name] looks at you doubtfully, but with a desperate spark of hope in [hisher] purple eyes, <i>\"R-really?\"</i> You nod affirmatively, though deep down you still have some nagging doubts about your own words.", parse);
						Gui.NextPrompt(Scenes.Kiakai.TalkUru);
					}, enabled : true,
					tooltip : "Boast about your own power."
				});
				options.push({ nameStr: "Who cares",
					func : function() {
						kiakai.relation.DecreaseStat(-100, 5);
						Text.AddOutput("You explain to [name] that Eden isn't your world, and you have higher priorities than dealing with Uru.",parse);
						Text.Newline();
						
						if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
							Text.AddOutput("The elf looks at you, clearly disappointed. <i>\"I know you must walk your own path, and I will support you, but please think of the people of this world. They have friends, families, children, the same as you or I.\"</i>", parse);
						else
							Text.AddOutput("<i>\"Think of all the people in this world. You may well be the only one who can help them,\"</i> the elf tells you, clearly agitated. <i>\"Would you doom all of us to be Uru's prey? Look around you! Would you see it reduced to the wasteland you saw in Uru's realm?\"</i>", parse);
						
						Text.Newline();
						Text.AddOutput("<i>\"Please,\"</i> [heshe] entreats you, <i>\"do not abandon us.\"</i>",parse);
						Text.Newline();
						Text.AddOutput("You tell her that you'll think about it, but your own world is still the one most important to you.",parse);
						
						Gui.NextPrompt(Scenes.Kiakai.TalkUru);
					}, enabled : true,
					tooltip : "Eden isn't your problem, and you're not sure Uru is either..."
				});
				
				Gui.SetButtonsFromList(options);
				
				kiakai.flags["TalkedUruDA"] = 1;
			}
			else {
				Text.AddOutput("<i>\"Though no fault of yours, it seems that safety could now be at an end, but only time will tell,\"</i> the elf shudders with unease, <i>\"Uru is very, very powerful. Should she ever unleash the full force of her wrath on Eden, we would be as ants before her. It must not come to a direct confrontation.\"</i>", parse);
				if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
					Text.Newline();
					Text.AddOutput("<i>\"Please, help us to prevent her coming.\"</i>", parse);
				}
				Gui.NextPrompt(Scenes.Kiakai.TalkUru);
				
			}
		}, enabled : true,
		tooltip : "Ask about why and how Uru was sealed in the realm where you met her."
	});
	// TALK ABOUT URU CONQUESTS
	options.push({ nameStr: "Conquests",
		func : function() {
			Text.Clear();
			
			Text.AddOutput("<i>\"Before Uru was sealed in the dark realm, many worlds fell under her influence,\"</i> [name] intones sorrowfully, <i>\"Twisted, corrupted, defiled; they all succumbed, until lady Aria intervened.\"</i>", parse);
			Text.Newline();
			if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
				Text.AddOutput("<i>\"Uru's very presence is enough to corrupt those around her. I hope your stay was brief enough that you were not significantly affected,\"</i> the elf concludes, sounding a little suspicious.", parse);
			else
				Text.AddOutput("<i>\"Uru's very presence is enough to corrupt those around her, given time,\"</i> the elf concludes.", parse);
			
			Gui.NextPrompt(Scenes.Kiakai.TalkUru);
		}, enabled : true,
		tooltip : "Ask about Uru's previous conquests."
	});
	Gui.SetButtonsFromList(options, true, kiakai.TalkPrompt);
	
}


Scenes.Kiakai.TalkEden = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	Text.AddOutput("<i>\"What would you like to know about Eden, [playername]?\"</i>", parse);
	Text.Newline();
	
	var options = [];
	// TALK ABOUT GEOGRAPHY
	options.push({ nameStr: "Geography",
		func : function() {
			Text.Clear();
			
			var scenes = [];
			// TREE
			scenes.push(function() {
				Text.AddOutput("You ask about the most prominent aspect of the entire island, the giant tree rising thousands of feet into the air, covering large parts of Eden in the shadow its foliage.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"The tree stands at the center, its roots delve deep,\"</i> [name] intones in a reverent voice, <i>\"As far as I know, it has always been here. Only the dragons - the oldest beings that live on Eden - have any idea from whence it came and how it came to grow so big. The tree is a symbol of life and the power of nature, and many on Eden worship it, calling it 'The Mother of All'.\"</i>", parse);
				Text.Newline();
				
				// TODO: VISITED TREE CITY
				if(true) {
					Text.AddOutput("<i>\"It is even rumored that there is an entire city clinging to the upper branches.\"</i>", parse);
				}
				else {
					Text.AddOutput("<i>\"Even so, it still surprises me that an entire city could thrive there, so far above the ground.\"</i>", parse);
				}
				
				Gui.NextPrompt(Scenes.Kiakai.TalkEden);
			});
			// CITIES
			scenes.push(function() {
				Text.AddOutput("You ask [himher] about what cities and villages are located on Eden.", parse);
				Text.Newline();
				
				Text.AddOutput("<i>\"The largest settlement is of course the capital of the kingdom, located edgeways of the plains, between the lake and the great forest, not far from the nomad camp where you woke up. Though it is mostly populated by pure humans, there is a fair scattering of various morphs and other races living there.\"</i>", parse);
				Text.Newline();
				
				// TODO: OTHER CITIES
				
				Text.AddOutput("<i>\"Other than that, there are a few smaller civilized settlements on the plains, and on the far side of the great tree,\"</i> [name] concludes [hisher] explanation, <i>\"The village I once called my home is located there.\"</i>.", parse);
				
				Gui.NextPrompt(Scenes.Kiakai.TalkEden);
			});
			// DANGER
			scenes.push(function() {
				Text.AddOutput("You ask about what places one should best avoid.", parse);
				Text.Newline();
				
				Text.AddOutput("<i>\"The desert, the high mountains, and the deeper reaches of the forest can be very dangerous to unprepared travelers,\"</i> the elf confides, <i>\"But the place you must be most careful of is the Boneyard, near the highlands. Stay <b>far</b> away from that place, or you will be sorry.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("The Boneyard? Why is it called that?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"The place is named after the bones of the great dragons that went there to die,\"</i> the elf shudders in discomfort, <i>\"It is crawling with the bastard offspring of the dragons of old, and though no one has seen it in a long time, it is rumored one of the ancient beasts still resides there. If something like that catches you, you would be as good as dead.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("[name] frowns a bit, <i>\"There have been rumors about people disappearing without a trace while traversing the desert. If you plan to head there, be very careful.\"</i>", parse);
				
				Gui.NextPrompt(Scenes.Kiakai.TalkEden);
			});
			// FLOATING ISLAND
			scenes.push(function() {
				Text.AddOutput("You ask about why Eden seems to be floating in the sky.", parse);
				Text.Newline();
				
				Text.AddOutput("[name] looks at you with a confused look on [hisher] face. <i>\"What do you mean?\"</i> Understanding slowly dawns on [himher], <i>\"Oh, I think I understand. It is not so much that Eden is floating, the surrounding land... just is not there anymore. I have trouble imagining it otherwise, but the legends tell of a time when the lands stretched wider than now.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("What could have caused such an event, you ask, disbelief clear in your voice.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"I know not,\"</i> [name] admits.", parse);
				
				Gui.NextPrompt(Scenes.Kiakai.TalkEden);
			});
			
			var sceneId = kiakai.flags["RotGeo"];
			if(sceneId >= scenes.length) {
				sceneId = 0;
				kiakai.relation.IncreaseStat(30, 1);
			}
			
			kiakai.flags["RotGeo"] = sceneId + 1;
			
			// Play scene
			scenes[sceneId]();

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
				Text.AddOutput("<i>\"Pure humans used to be the most numerous race on Eden, but interbreeding with the various other races arriving through portals has dwindled their numbers,\"</i> [name] explains, <i>\"They still account for the majority of the population in the capital, and with a few exceptions, only humans are allowed into the royal palace.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("Why is that so?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"The royals wish to keep the bloodline pure at any cost, something which has resulted in a few... unsavory practices and customs. If you are not a pure human, you had best stay far away from the royal palace.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("Were humans the first race to live on Eden?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"No, that much is known, at least. Long before man or elf ever set foot on Eden, there were the dragons.\"</i>", parse);
				Gui.NextPrompt(Scenes.Kiakai.TalkEden);
			});
			// MORPHS
			scenes.push(function() {
				Text.AddOutput("<i>\"Creatures with characteristics resembling animals have been arriving to Eden from their various home realms for ages,\"</i> the elf explains, <i>\"Now they are a natural part of the population, just as common as pure humans.\"</i>", parse);
				
				// TODO: EXPAND?
				
				Gui.NextPrompt(Scenes.Kiakai.TalkEden);
			});
			// MAGICAL BEINGS
			scenes.push(function() {
				Text.AddOutput("<i>\"Well, there are many on Eden you could classify as magical,\"</i> the elf ruefully motion to [himher]self, <i>\"Some consider my own race as such. You could say that this is a good place to live for beings that depend on magic, as it is very easy to coax tendrils of power from the very land itself.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("You ask how [heshe] would know the difference, if [heshe] has been living on Eden for [hisher] whole life.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Portals to other realms were more commonplace in my youth, and I have made short surveys into a few of them at the behest of the lady. None of them felt quite... right, as if one of my senses had been cut off. It was quite unpleasant.\"</i> [name] shudders slightly.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Getting back to your question, there are many forms of spirits living in the less populated areas, some benign and some hostile. The greatest of the magical beings are the ancient dragons, but no one has seen one of them in a very long time.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"It is best to remain wary if things seem out of the ordinary. Trust your senses, you seem to have an affinity for the magical.\"</i>", parse);
				
				Gui.NextPrompt(Scenes.Kiakai.TalkEden);
			});
			// RABBITS
			scenes.push(function() {
				if(burrows.flags["Access"] == Burrows.AccessFlags.Unknown) {
					Text.Add("<i>”Some of the priests at the shrine told me about strange creatures they encountered on the plains, walking upright like humans, but very similar to rabbits in appearance. They are fleet-footed, and ran away before the travelling priests could get a closer look at them.”</i>", parse);
					Text.NL();
					Text.Add("<i>”According to the locals, they tend to stay together in small groups, and avoid travellers and larger settlements. As I understand it, they are not very sophisticated or intelligent.”</i>", parse);
				}
				else {
					Text.Add("<i>”The more I learn about those lagomorphs, the more worried I become,”</i> [name] frowns. <i>”What if they formed a mob and attacked one of the outlying farms, who knows what they would do?”</i>", parse);
					Text.NL();
					Text.Add("You ask [himher] what [heshe] knows about these critters.", parse);
					Text.NL();
					Text.Add("<i>”They are not uncommon creatures, as they breed very rapidly,”</i> the elf says. <i>”I never saw one up close when I lived at the shrine, as they tend to keep away from people, but some of the priests who traveled frequently told me about sighting them on the plains.”</i>", parse);
					Text.NL();
					Text.Add("<i>”This colony... is something different, though. I have never heard of such a large gathering before.”</i>", parse);
					if(burrows.flags["Access"] == Burrows.AccessFlags.Visited) {
						Text.NL();
						Text.Add("<i>”Not to mention this Lagon... he is dangerous.”</i>", parse);
					}
				}
				Text.Flush();
				Gui.NextPrompt(Scenes.Kiakai.TalkEden);
			});
			// TODO: DEMONS
			/*
			scenes.push(function() {
				Text.AddOutput("", parse);
				Text.Newline();
				Text.AddOutput("", parse);
				Text.Newline();
				Text.AddOutput("", parse);
				Text.Newline();
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

		}, enabled : true,
		tooltip : "Ask about the people and creatures that inhabit Eden."
	});
	// TALK ABOUT FACTIONS
	options.push({ nameStr: "Factions",
		func : Scenes.Kiakai.TalkFactions, enabled : true,
		tooltip : "Ask about the people and creatures that inhabit Eden."
	});
	// TALK ABOUT HUBWORLD
	options.push({ nameStr: "Hubworld",
		func : function() {
			Text.Clear();

			Text.AddOutput("<i>\"There is... something about this particular realm that makes it easier for portals to open, sometimes without any apparent reason,\"</i> [name] explains, <i>\"The lady once explained it to me as reality being thinner here, though I did not quite understand her at the time.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Though there are significantly fewer incidents nowadays, once it was commonplace for rifts to several realms to be open at once, with people passing freely through them. It is the reason for there being so many different races living on Eden today.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Something happened long ago that changed that, though, yet I know not what. The last portal I know of before your arrival here was several years ago, and that one was only open for a short time.\"</i>", parse);

			Gui.NextPrompt(Scenes.Kiakai.TalkEden);
		}, enabled : true,
		tooltip : "Ask about Eden's function as a hubworld, and portals to other realms."
	});
	Gui.SetButtonsFromList(options, true, kiakai.TalkPrompt);
	
}


Scenes.Kiakai.TalkFactions = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	
	var scenes = [];
	// KINGDOM
	scenes.push(function() {
		Text.AddOutput("<i>\"The royal family rules over the largest city on Eden, and a good portion of the plains is under their control. They are purebred humans, and they have a strong distaste for other races. Non-humans and mixed races do best in staying far away from the castle and the royal guard, though the city itself is fine.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("Who is the current king, and why does he hate other races so?", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Rewyn the Second is king, and Rhylla is his queen,\"</i> [name] tells you, <i>\"As for his hatred for non-humans... it is more a deeply ingrained fear, fueled over the generations. The pure line has been dwindling for years.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Rewyn has two children; the twins, Rumi and Rani.\"</i>", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkEden);
	});
	// NOMADS
	scenes.push(function() {
		Text.AddOutput("<i>\"The nomads are an odd fellowship, as I am sure you have already gathered. They are not under the rule of the king, yet not enough of a thorn in his side to be branded outlaws.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Many of them are actually from realms other than this one, though the recent lack of portals has stranded them here. They usually move around quite a lot, but recently their camp has been set up on the plains.\"</i>", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkEden);
	});
	// OUTLAWS
	scenes.push(function() {
		Text.AddOutput("<i>\"All those who oppose the king are branded outlaws,\"</i> [name] explains, <i>\"There are actually many factions of them, but the largest group hides out in the forest. Thieves and murderers many of them, a rather unsavory group.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("What are the laws of the kingdom regarding those outlaws?", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Anyone belonging to an outlaw faction, or being found guilty of helping one, risk imprisonment or, at worst, death at the hand of the royal guard.\"</i>", parse);
		
		Gui.NextPrompt(Scenes.Kiakai.TalkEden);
	});
	// SHRINE
	scenes.push(function() {
		Text.AddOutput("<i>\"The shrine of lady Aria has been my home for many years,\"</i> [name] tells you, recalling fond memories, <i>\"The priests and priestesses are very kind, and well versed in the arts of healing.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Many on Eden request the services of the shrine, or go on pilgrimages to visit the holy place. High priestess Yrissa welcomes all pure souls within the sacred walls of the lady.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("Where exactly is the shrine located?", parse);
		Text.Newline();
		Text.AddOutput("<i>\"It is unfortunately quite remote, hidden deep within the great forest.\"</i> [name] explains that the priests sometime have to cast shrouds of deception around the shrine, in order to protect it from those with malicious intentions.", parse);
		
		Gui.NextPrompt(Scenes.Kiakai.TalkEden);
	});
	// DESERT OASIS
	scenes.push(function() {
		Text.AddOutput("<i>\"The desert is a rough place to live, but there is said to be a safe haven hidden among the dunes, a great oasis where water and food is plentiful. I have never visited the place myself though,\"</i> [name] reveals, <i>\"The kingdom troops do not go there, so it is pretty much under its own laws.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("How would one go about visiting there?", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Just heading out into the desert is begging for trouble to happen, you would be lost very quickly. The safest way to reach the oasis is to go with one of the trading caravans that pass through there. They sometime make a stop at the crossroads and at the capital.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("[name] frowns a bit, <i>\"There have been rumors about people disappearing without a trace while traversing the desert, not even leaving bones behind. If you plan to head there, be very careful.\"</i>", parse);

		Gui.NextPrompt(Scenes.Kiakai.TalkEden);
	});
	
	var sceneId = kiakai.flags["RotFactions"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(30, 1);
	}
	
	kiakai.flags["RotFactions"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
}



Scenes.Kiakai.TalkElves = function() {

	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	
	if(kiakai.flags["TalkedElves"] == 0) {
		Text.AddOutput("You ask [name] to tell you a little about the elves.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"The elves are a proud race, [playername]. Although our appearance resembles humans, in many ways we are actually closer to dryads or fairies.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"My people live in small groups, building villages to be as close to nature as possible. Many of them live in the forest, some building villages in the branches of the trees to stay safe from the dangerous animals that occasionally roam below. My own village was on the shore - my people love the life of the sea, as well as strength of the trees. I had spent but ten years of my life there, when a priestess of Aria stopped by, and I decided I needed to go with her and join the priesthood.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Most Elves worship the Great Tree and try to live fully in tune with nature. When they gather plants, they make sure to spread their seeds, so the plant will continue to grow. They hunt animals only when sure the species is flourishing and no harm will be done by the culling.\"</i>", parse);
		
		kiakai.relation.IncreaseStat(50, 2);
		
		kiakai.flags["TalkedElves"] = 1;
	}
	else {
		Text.AddOutput("<i>\"What else would you like to know, [playername]?\"</i>", parse);
	}
	
	//[Culture][Parents][Childhood][Why Leave]
	var options = new Array();
	options.push({ nameStr : "Culture",
		func : function() {
			Text.Clear();
			
			var scenes = [];
			// Long life
			scenes.push(function() {
				Text.AddOutput("<i>\"One of the biggest differences between elves and humans is how long we live,\"</i> [name] tells you. <i>\"Where humans live only a few score years, elves' lifetimes are measured in hundreds. The elders of my village were all past their fourth century when I left.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"This difference runs much deeper than the number of years, [playername]. Elves know that they have time to grow, to learn, to act. Though they make quick decisions when they must, they prefer to think and discuss very carefully anything they find important.\"</i> [name] smiles fondly. <i>\"I have heard a tale that once there was an elf who fell in love with a human. He told his people, and asked for their advice, wondering if they would accept his choice. The tale says they discussed it long and hard, and in the end decided that if that was the way of his heart, there was no ill in it. But when he went to the girl to bring her the joyful news, he found her an old woman, and married besides.\"</i> [name] laughs at [hisher] story, and you find it difficult to not join [himher].", parse);
				Text.Newline();
				if(kiakai.relation.Get() > 25)
					Text.AddOutput("<i>\"Death is also much more terrible for the elves,\"</i> [name] tells you, [hisher] eyes looking haunted. <i>\"My kind have few children, and there are not many of us, so the loss of even a single life before it reaches its fullness is a great horror to us all.\"</i>", parse);
	
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			});
			// Nature worship
			scenes.push(function() {
				Text.AddOutput("<i>\"Elves love life and strive to live in harmony with nature above all else. Many humans say that they worship nature, but that is not quite it. Elves believe there is a spirit that moves all living things, a spirit that permeates the entire world. They think it is our duty to nurture this spirit, keep it healthy, make sure it prospers as much as possible.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("And what about Aria?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"The elves acknowledge that Aria exists and believe her to be a strong spirit from outside this world. However, they think she may help with some things in the universe, but this world is ours to care for, and it is the well-being of this world that should be our focus.\"</i> [name] sighs. <i>\"They do not see that there is far greater danger that stalks all worlds. That focusing on this one alone is no longer enough to keep it safe.\"</i>", parse);
	
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			});
			// Food
			scenes.push(function() {
				Text.AddOutput("You ask [name] what the elves eat, since they do not want to disrupt nature.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Eating is not disruption, [playername]. Predators, and even parasites, are part of nature. Even herbivores prey on plants, and plants often kill one another as they compete for sunlight and nutrients,\"</i> [heshe] explains.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"What the elves oppose is depletion. They want the world to be a lush forest, full of life, not an arid desert. To work toward that, they take only the lives they know will be replenished, and do their best to maintain an equilibrium in nature. When elves harvest plants, they also replant them. When they kill animals, it is only when the species is doing well, and often they do so to prevent overpopulation.\"</i>", parse);
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			});
			// Lore
			scenes.push(function() {
				Text.AddOutput("<i>\"Elvish memories are long, [playername],\"</i> [name] tells you, <i>\"and some of our most ancient knowledge has echoed in song through millennia, but our loremasters also understand the importance of keeping written records.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"We only had a few lore scrolls at our village, but I was fascinated when I was allowed to read a little from them as a child. There were tales from before the founding of the kingdom, stories of times when a few worlds were connected almost permanently to our own through portals.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"If one read all the scrolls, I believe that would tell you more of the history of the world than you could learn from all the libraries in the human lands.\"</i> The elf smiles with pride and obvious curiosity.", parse);
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			});
			
			var sceneId = kiakai.flags["RotElfCulture"];
			if(sceneId >= scenes.length) {
				sceneId = 0;
				kiakai.relation.IncreaseStat(30, 1);
			}
			
			kiakai.flags["RotElfCulture"] = sceneId + 1;
			
			// Play scene
			scenes[sceneId]();

		}, enabled : true,
		tooltip : Text.Parse("Ask [name] more about elvish culture.", parse)
	});
	options.push({ nameStr : "Parents",
		func : function() {
			Text.Clear();
			
			var scenes = [];
			// Raised by community
			scenes.push(function() {
				Text.AddOutput("<i>\"You have to understand that elves have very few children. An elvish woman usually has a child less than once every fifty years, even in her prime. As such, when a child is born, [heshe] is extremely important to all elves.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"I have seen that humans are typically raised by their parents; that is not how it is with my people. A child is so important and so rare that the entire community takes part in [hisher] upbringing. Every adult does their best to help and teach every child, and it is ultimately the elders of the village who have authority over children.\"</i>", parse);
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			});
			// Children
			scenes.push(function() {
				Text.AddOutput("Why are elvish children so rare?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Elvish women are only rarely fertile,\"</i> [name] explains, blushing slightly at discussing this topic. <i>\"There is a grand cycle of abundance in nature that affects the elves. It runs about twelve years, although it varies a little from one to the next, and it is only when the cycle is at its peak that an elf can be fertile. And even if that condition is satisfied, i-intercourse will only rarely take and result in a child.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"So you see why children are so precious to my people.\"</i>", parse);
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			});
			// Long life
			scenes.push(function() {
				Text.AddOutput("Didn't you get lonely without having parents who focus on you?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Oh, no, not at all,\"</i> [name] tells you. <i>\"Elves do not feel lonely just because of that. After all we have the entire community to support us. This is how elves have lived as far back as our lore reaches, so it must be a way of living that is comfortable for us...\"</i> [name] trails off, sounding a little sad.", parse);
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			});
			
			var sceneId = kiakai.flags["RotElfParents"];
			if(sceneId >= scenes.length) {
				sceneId = 0;
				kiakai.relation.IncreaseStat(30, 1);
			}
			
			kiakai.flags["RotElfParents"] = sceneId + 1;
			
			// Play scene
			scenes[sceneId]();

		}, enabled : true,
		tooltip : Text.Parse("Ask [name] more about [hisher] parents.", parse)
	});
	options.push({ nameStr : "Childhood",
		func : function() {
			Text.Clear();
			
			var scenes = [];
			
			// Freedom
			scenes.push(function() {
				Text.AddOutput("<i>\"There is much time for a child to grow up among my people. Until the child's fifteenth year, the elves place no constraints, no demands, upon the children, provide no education unless the child asks for it. The child is left to learn about the world and explore at [hisher] leisure.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("Is it really alright to let children run wild like that?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Of course,\"</i> [name] tells you. <i>\"It gives them a chance to learn the beauty of nature first hand, and my people know children have time to learn the necessities of life as they grow older.\"</i>", parse);
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			});
			// Freedom2 TODO
			if(kiakai.relation.Get() > 40) {
				scenes.push(function() {
					Text.AddOutput("<i>\"In truth, [playername], I often found myself alone as a child. It is only possible for elves to give birth on every twelfth year or so, and no other child was born at the same time as I in our village. The adults in the village were kind to me, taught me anything I wished, but I only felt close to few of them.\"</i> [name]'s voice grows quiet and hollow in memory, as [heshe] speaks.", parse);
					Text.Newline();
					Text.AddOutput("<i>\"There were some older children, but by the time I could play with them, they had duties of their own, ones I was not invited to partake in. Though they smiled at me and were gentle, I was ever an outsider in their small circles.\"</i>", parse);
					Text.Newline();
					
					if(kiakai.flags["TalkedAlone"] == 0) {
						kiakai.flags["TalkedAlone"] = 1;
						Text.AddOutput("<i>\"As a result, I spent much time by myself, exploring the sea and the forest near our village, meeting animals and fish, corals and trees.\"</i> The elf pauses, and looks into your eyes doubtfully. <i>\"You will think me strange for this, but in some ways, they were my closest friends.\"</i>", parse);
						Text.Newline();

						//[Comfort][Explain][You're Weird!]
						var options = new Array();
						options.push({ nameStr : "Comfort",
							func : function() {
								kiakai.relation.IncreaseStat(100, 5);
								if(kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral) {
									Text.AddOutput("You embrace the elf, telling [himher] that you will be with [himher] now. [name] relaxes in your grasp and hugs you back tightly, pressing [hisher] head into your chest.", parse);
									Text.Newline();
									Text.AddOutput("<i>\"Thank you, [playername],\"</i> [heshe] whispers, almost too quiet for you to hear.", parse);
								}
								else {
									Text.AddOutput("You pat the elf on the head, and tell [himher] that you've got [himher] now, and you'll take care of [himher] as long as [heshe] remains loyal.", parse);
									Text.Newline();
									Text.AddOutput("[name] smiles up at you warmly, pressing [hisher] head slightly into your hand. <i>\"Thank you, [playername].\"</i>", parse);
								}
								
								Gui.NextPrompt(Scenes.Kiakai.TalkElves);
							}, enabled : true,
							tooltip : Text.Parse("Tell the elf that [heshe] is not alone anymore.", parse)
						});
						options.push({ nameStr : "Explain",
							func : function() {
								Text.AddOutput("You tell the elf not to worry. You have felt lonely yourself sometimes, and you know it is tempting to look for friends wherever you can find them.", parse);
								Text.Newline();
								Text.AddOutput("<i>\"Thanks, [playername],\"</i> [name] tells you with a wry smile. <i>\"It is good to know I am not the only one going crazy!\"</i>", parse);
								Gui.NextPrompt(Scenes.Kiakai.TalkElves);
							}, enabled : true,
							tooltip : "Explain to the elf that's what loneliness does."
						});
						options.push({ nameStr : "You're Weird!",
							func : function() {
								kiakai.relation.DecreaseStat(-100, 5);
								
								Text.AddOutput("You tell the elf that, yes, that's really strange. Why would you make friends with the trees and the birds? They can't tell you anything, or even understand you, for that matter!", parse);
								Text.Newline();
								Text.AddOutput("<i>\"I suppose you are right.\"</i> [name] turns away from you, and wanders off a little, staring at the ground, clearly dejected.", parse);
								Gui.NextPrompt(kiakai.Interact);
							}, enabled : true,
							tooltip : "Yep, the elf really is strange."
						});
						Gui.SetButtonsFromList(options);
					}
					else {
						
						Text.AddOutput("<i>\"As a result, I spent much time by myself, exploring the sea and the forest near our village, meeting animals and fish, corals and trees. In some ways, they were my closest friends.\"</i>", parse);
						Gui.NextPrompt(Scenes.Kiakai.TalkElves);
					}
				});
			}
			// Friends and teachers
			scenes.push(function() {
				Text.AddOutput("<i>\"My village was devoted to caring for me, and I did not shun their devotion. The loremaster taught me to read when I was still very young, and before I learned, he read to me from the scrolls when he had time. Sometimes, one of the other adults would also take me to gather fruits and berries with them, or to go fishing, and taught me how to pick out the ripe plants, the abundant fish.\"</i> [HeShe] smiles fondly.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"The older children also tried to include me in their games, although often I felt like a burden to them. Still, I made a friend or two among them, and they seemed to actually enjoy my endless questions.\"</i>", parse);
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
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
				
				Text.AddOutput("<i>\"One day, a priestess came to my village,\"</i> [name] tells you, and pauses briefly, clearly deciding what to say next. <i>\"Though we did not worship Aria, she was still generous to us, and aided us with healing. I was impressed as much by her as her abilities, and I saw also the goodness of Aria within her. I decided I too wanted to be able to help people as she did, and went with her to join the priesthood.\"</i>", parse);
				Text.Newline();
				if(kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral) {
					Text.AddOutput("You see pain in the elf's eyes and sense that there's much [heshe]'s not telling you, however you decide not to press the issue. [HeShe] will tell you when [heshe] is ready.", parse);
					Gui.NextPrompt(Scenes.Kiakai.TalkElves);
				}
				else {
					
					if(kiakai.flags["TalkedWhyLeaveForce"] == 0) {
						Text.AddOutput("You see pain in the elf's eyes and sense that there's much [heshe]'s not telling you.", parse);
						
						//[Demand answer][Let it go]
						var options = new Array();
						options.push({ nameStr : "Demand answer",
							func : function() {
								kiakai.flags["TalkedWhyLeaveForce"] = 1;
								
								kiakai.relation.DecreaseStat(-100, 5);
								Text.Clear();
								Text.AddOutput("You tell the elf that you demand to know the whole truth. You're in charge here, and [heshe] <i>will</i> tell you.", parse);
								Text.Newline();
								Text.AddOutput("<i>\"I will not!\"</i> [name] shouts at you, clearly furious. <i>\"I might be helping you because lady Aria asked it of me, but that gives you no right to my past!\"</i>", parse);
								Text.Newline();
								Text.AddOutput("[HeShe] turns away from you, and stalks a little ways off.", parse);
								Gui.NextPrompt(kiakai.Interact);
							}, enabled : true,
							tooltip : "Demand that the elf tell you what happened."
						});
						options.push({ nameStr : "Let it go",
							func : function() {
								Text.Clear();
								Text.AddOutput("You decide that whatever [name] is concealing, it's probably not important anyway. Maybe [heshe]'ll tell you later if [heshe] wants.", parse);
								Gui.NextPrompt(Scenes.Kiakai.TalkElves);
							}, enabled : true,
							tooltip : "It's probably not important anyway..."
						});
						Gui.SetButtonsFromList(options);
					}
					else {
						Text.AddOutput("You see pain in the elf's eyes and sense that there's much [heshe]'s not telling you. Perhaps [heshe] will tell you when [heshe]'s ready.", parse);
						Gui.NextPrompt(Scenes.Kiakai.TalkElves);
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
	Gui.SetButtonsFromList(options, true, kiakai.TalkPrompt);
	
}

Scenes.Kiakai.TalkDimensionalViolation = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	
	if(kiakai.flags["TalkedWhyLeaveLong"] == 0) {
		Text.AddOutput("[name] sighs when you ask for the story again. <i>\"Very well, you have been patient with me. I will tell you all that occurred.\"</i>", parse);
	}
	else {
		if(kiakai.flags["TalkedWhyLeaveLongReact"] == 1) { // HUG/THANK
			Text.AddOutput("<i>\"Very well, I will tell you the story again, if you wish to hear it, [playername],\"</i> [name] says, seeming a little more comfortable with the prospect than [heshe] used to be.", parse);
		}
		else if(kiakai.flags["TalkedWhyLeaveLongReact"] == 2) { // DISMISS
			Text.AddOutput("<i>\"Didn't you say it was boring?\"</i> [name] asks, looking annoyed. <i>\"Very well, I will tell you again, but try to pay attention this time.\"</i>", parse);
		}
		else {
			Text.AddOutput("<i>\"Thank you for being patient with me, I... I think I will be able to tell the whole story this time.\"</i> You nod encouragingly to [name].", parse);
		}
	}
	
	Text.Newline();
	Text.AddOutput("<i>\"I was a few months past my tenth birthday when I stumbled upon a portal while wandering through the woods by our village. At first, I was curious and approached it, wondering where it led, however, as I drew near, I felt a sense of wrong emanating from it. A glance inside showed me woods that must have once resembled our own, but which were now blackened, with many trees seemingly rotting upright where they stood. I drew back in revulsion from the thing and ran as fast as I could to tell the adults.\"</i> ", parse);
	
	if(kiakai.flags["TalkedWhyLeaveLongReact"] == 1) { // HUG/THANK
		Text.AddOutput("[name] still looks a little disgusted by the memory, but the horror [heshe] had shown before is gone now.", parse);
		Text.Newline();
	}
	else { // DISMISS, OR FIRST TIME
		Text.AddOutput("[name] shivers recounting the memory, [hisher] horror of the thing undiminished by time.", parse);
		Text.Newline();
	}
	
	Text.AddOutput("<i>\"By the time they arrived, the portal had closed, but outside it they found collapsed a peculiar creature. It resembled the dryads of our world, but its skin was blackened and cracked, and a sickly yellow pus oozed from its body. They brought the creature back to the village, thinking it ill, and wishing to heal it, for we have long been friends of the dryads.\"</i>", parse);
	Text.Newline();
	Text.AddOutput("<i>\"And it was indeed much weakened, for it lay motionless within the village for three days. When it awoke, however, its skin had not changed, and the pus now flowed from its half-open mouth, and... other parts.\"</i> The elf shudders. <i>\"I am told that when Treal, one of our elders, came upon it, it assaulted him, and he was barely able to hold it off while shouting for help. It was seen then that the creature was unnatural and it was put down, its body and very bones burned to a fine ash upon a bonfire of deadwood.\"</i>", parse);
	Text.Newline();
	
	if(kiakai.flags["TalkedWhyLeaveLong"] == 0) {
		kiakai.flags["TalkedWhyLeaveLong"] = 1;
		
		Text.AddOutput("<i>\"But that was only the beginning, [playername].\"</i> [name]'s wide eyes meet yours, with an expression of supplication.", parse);
		
		//[Go on...][Later]
		var options = new Array();
		options.push({ nameStr : "Go on...",
			func : function() {
				Text.Clear();
				Text.AddOutput("You hold the elf's hand, telling [himher] that you'd like to hear the rest of it. [HeShe] nods hesitantly, seeming to take strength from your grip.", parse);
				Text.Newline();
				Gui.NextPrompt(Scenes.Kiakai.TalkDimensionalViolationCont);
			}, enabled : true,
			tooltip : "Ask the elf to continue."
		});
		options.push({ nameStr : "Later",
			func : function() {
				Text.Clear();
				Text.AddOutput("Seeing [name] so distressed, you tell [himher] that [heshe] can finish the story later.", parse);
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
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
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.AddOutput("<i>\"Though the corrupt creature was dead, its body but ashes on the wind, we soon found that it had already caused grave ill. On the morning after the pyre, I saw a bird I had often seen singing to its mate lying dazed upon the ground under the tree of its nest. When I lifted it, it made little response, its breathing shallow, its tiny heart pounding desperately in its chest. I left it alone, thinking that perhaps it had grown old and its time was coming, for I had been taught that all beings must pass. That evening, however, I recall being dizzy, Treal laying me down on a bed, concern clear in his face.\"</i>", parse);
	Text.Newline();
	Text.AddOutput("<i>\"After that, I recall little of what occurred,\"</i> [name] tells you, looking grim. <i>\"I am told that all in the village sickened one by one, until none could care for another. Only a human fisherman, who had come to us the day of the pyre to trade, seemed unaffected. When he saw all around him grow ill, he took great fright and hurried as fast as he could to the shrine of Aria, where he hoped he could be healed.\"</i>", parse);
	Text.Newline();
	Text.AddOutput("<i>\"At the shrine, they found that he bore no trace of disease, but they sent a young priestess to check up on us. I wish they had chosen to send more than one, but it was our salvation that they responded at all. It was Yrissa who came to us, arriving after the village had been in the throes of plague for two full days. She has told me that she healed all the elves in turn, by herself, leaving me for last, for my illness was the most grievous of all, and she knew that even if she managed to overcome it, she would have no strength to move from the spot.\"</i>", parse);
	Text.Newline();
	Text.AddOutput("<i>\"As I say, I know nothing of what occurred myself, for my mind was clouded with dreams. I dreamt of endless forests, rotting where they stood. Of grasslands peeling away like the land's skin, leaving only a bare waste behind.\"</i> [name] shudders, but goes on, as if mesmerized by [hisher] own tale. <i>\"I dreamt of demons stalking the land, indulging in their vile pleasures. And then, after an eternity of darkness, I remember clearly I felt a tug at my mind. A tug that transformed into a steady pull, and then a swift flight, pulling me from this desolate realm, pulling me through the worlds into the gardens of lady Aria.\"</i>", parse);
	Text.Newline();
	Text.AddOutput("<i>\"But even in that blessed realm, I...\"</i> The elf hesitates before continuing. <i>\"Even there my spirit was not freed from taint. I remember looking around me and being disgusted by the life I saw. I remember seeing the lady herself and thinking it would be delightful to tear down her sanctity, to ravish her and make her beg for more.\"</i> The elf starts at [hisher] own words, looking frightened by what [heshe] has said. [HeShe] swallows audibly before continuing. <i>\"But then, the lady pressed her hand against my forehead, and I felt the fog lift from my thoughts. I felt a vast joy at being within this place of beauty, though it was too tame by elvish standards, at being in the presence of one so vastly good.\"</i>", parse);
	Text.Newline();
	Text.AddOutput("The elf smiles, happy at the bright memory. <i>\"There is not much to tell after that. I woke up, fully healed, and saw Yrissa collapsed before me, the elders observing us both. Though I did not know her then, I knew she was the one who healed me and felt connected to her.\"</i>", parse);
	Text.Newline();
	Text.AddOutput("<i>\"After that experience, I knew I wanted to be like her. I wanted to be able to heal and truly help people. I asked the elders for permission to join the priesthood, and, to be honest with you, I was a little surprised by how easily they granted it. Yrissa, likewise, agreed to have me, when she finally woke up after two days and three nights of rest.\"</i>", parse);
	Text.Newline();
	Text.AddOutput("<i>\"I was sad to leave my people, but I am certain that I chose the right path. The only thing that marred my departure was that, despite her best efforts, Yrissa had arrived too late to aid two of the elves of my village, and I was told that they had passed on before I woke up.\"</i>", parse);
	Text.Newline();
	
	// IF FIRST TIME
	if(kiakai.flags["TalkedWhyLeaveLongReact"] == 0) {
		//[Hug][Thank][Dismiss]
		var options = new Array();
		options.push({ nameStr : "Hug",
			func : function() {
				Text.Clear();
				
				kiakai.flags["TalkedWhyLeaveLongReact"] = 1; // HUG/THANK
				kiakai.relation.IncreaseStat(100, 10);
				kiakai.spirit.IncreaseStat(100, 1);
				
				if(kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral) {
					Text.AddOutput("You put your arms around [name], drawing [himher] closer to you, and [heshe] returns your embrace. You whisper that it is all in the past now, and [heshe] is well. You reassure [himher] that [heshe] did what was right, and that [heshe] is now a splendid healer.", parse);
					Text.Newline();
					Text.AddOutput("[name] eventually disentangles [himher]self from your arms and smiles up at you. Perhaps [heshe] will be able to deal with the memories better now.", parse);
				}
				else { // NAUGHTY
					Text.AddOutput("You put your arms around [name], and she relaxes, feeling comfortable in your grasp. You whisper to [himher] that [heshe] did all [heshe] could back then, and that now you will protect [himher].", parse);
					Text.Newline();
					Text.AddOutput("You eventually release [name] from your arms, and [heshe] smiles up at you. Perhaps [heshe] will be able to deal with the memories better now.", parse);
				}
				
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
				
				Text.AddOutput("You tell [name] that you are grateful [heshe] told you all that, and that you think knowing what happened might eventually help you with your quest.", parse);
				Text.Newline();
				Text.AddOutput("[name] smiles up at you, apparently happy that [heshe] has gotten the memories off [hisher] chest.", parse);

				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			}, enabled : true,
			tooltip : "Thank the elf for telling you what happened."
		});
		options.push({ nameStr : "Dismiss",
			func : function() {
				Text.Clear();
				
				kiakai.flags["TalkedWhyLeaveLongReact"] = 2; // DISMISS
				kiakai.relation.DecreaseStat(-100, 5);
				
				Text.AddOutput("You tell the elf you were sleepy because the story was so boring and might have missed something in the middle. Like, most of it.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Then why in the worlds did you ask me to tell it?\"</i> [name] demands, visibly distraught. You see moisture pooling beneath [hisher] eyes.", parse);
				
				
				Gui.NextPrompt(Scenes.Kiakai.TalkElves);
			}, enabled : true,
			tooltip : "Tell the elf that was really boring."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.AddOutput("You thank [name] for telling you the story again.", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkElves);
	}
}


Scenes.Kiakai.TalkPriest = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	
	if(kiakai.flags["TalkedPriest"] == 0) {
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
			Text.AddOutput("<i>\"The priesthood is the instrument of the lady on Eden,\"</i> the elf tells you, looking proud. <i>\"The order mostly stays at the shrine of Aria, though we sometimes venture out at the request of nearby villages, and some serve as advisers to men of power. Among other things, the priests of Aria are exceptionally skilled healers.\"</i>", parse);
			Text.Newline();
			if(kiakai.relation.Get() > 25)
				Text.AddOutput("<i>\"The priesthood is currently headed by high priestess Yrissa. She practically raised me from when I was but a young child,\"</i> [name] confides with a fond tone in [hisher] voice.", parse);
			else
				Text.AddOutput("<i>\"The priesthood is currently headed by high priestess Yrissa. She is a strict woman, but kind and generous as well. You would do well to respect her.\"</i> You sense that there is something [name] is not telling you, but decide it's probably not important.", parse);
		}
		else {
			Text.AddOutput("<i>\"The lady makes her presence on Eden be known through her priesthood,\"</i> the elf explains to you. <i>\"The order mostly stays at the shrine of Aria, though we sometimes venture out at the request of nearby villages, and some serve as advisers to men of power. Among other things, the priests of Aria are very skilled healers.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"The priesthood is currently headed by high priestess Yrissa,\"</i> [name] confides with a fond tone in [hisher] voice, <i>\"She practically raised me from when I was but a young child.\"</i>", parse);
		}

		Text.Newline();
		Text.AddOutput("<i>\"I currently hold the rank of acolyte in the order.\"</i>", parse);
		
		kiakai.relation.IncreaseStat(50, 2);
		kiakai.flags["TalkedPriest"] = 1;
	}
	else {
		Text.AddOutput("<i>\"What else would you like to know about the priesthood, [playername]?\"</i>", parse);
	}
	
	
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
		tooltip : "Ask about the high priestess."
	});
	options.push({ nameStr : "Aria",
		func : Scenes.Kiakai.TalkPriestAria, enabled : true,
		tooltip : "Ask about the priests' relationship with Aria."
	});
	options.push({ nameStr : "Meeting",
		func : Scenes.Kiakai.TalkPriestMeeting, enabled : true,
		tooltip : Text.Parse("Ask about [name] leaving to come meet you.", parse)
	});
	Gui.SetButtonsFromList(options, true, kiakai.TalkPrompt);
}

Scenes.Kiakai.TalkPriestHierarchy = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	
	
	var scenes = [];
	
	// Overview
	scenes.push(function() {
		Text.AddOutput("<i>\"I know best the lower ranks of the priesthood, [playername],\"</i> [name] says, looking somewhere between embarrassed and annoyed. <i>\"There is a long training period for all of its members. First, any entrants start off as novices. In this position, they study the verses of Aria, as well as writing, numeracy, and healing. Once they have a grasp of the basics, which normally takes about four years, they move on to being apprentices.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Apprentices delve deeper into study, having to do fewer menial chores than novices, and sometimes getting to help in the priesthood's main work. This stage of training usually takes about six years for most. Although if it is longer, that is not exactly a problem either,\"</i> the elf hastens to add.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Beyond apprenticeship is the acolyte stage. Acolytes have most of the knowledge of full priests, but they lack the practical experience to go about duties on their own. They help the priests with everything from healing to the copying of books. This stage normally takes about ten years, although the next advancement only occurs if the order heads deem the acolyte worthy, so it can be much faster or take much, much longer...\"</i> [name] trails off at this, [hisher] eyes distant, clearly thinking about something.", parse);
		Text.Newline();
		Text.AddOutput("And then?", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Ah, after that, there are the diviners and the clerics. Both are the key servants of lady Aria, with diviners focusing more on finding out the deep truths and protecting the integrity of the worlds and clerics instead focusing on healing and doing good in the here and now. After that, there are the six order heads, who are in charge of various groups in the priesthood, and above all stands the high priestess, who directs the priesthood as a whole.\"</i>", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	// Order heads
	scenes.push(function() {
		Text.AddOutput("<i>\"There are six order heads in total. Four of them are in charge of various ranks - one for novices and apprentices, one for acolytes, one for diviners, and one for clerics. The other two, usually seen as standing a little higher, instead govern the priesthood's chief activities - one of them directs the scholarship of the priesthood, and the other the healing.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Each of them has a great deal of authority,\"</i> [name] tells you, <i>\"and many of them are powerful clerics or diviners in their own right. They also play a key role in choosing the high priestess.\"</i>", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	// Long
	scenes.push(function() {
		Text.AddOutput("<i>\"The high priestess is the head of the priesthood, as you might expect, but more than that, she is its heart. She is chosen every seven years, and has the power to change the direction of the order in whatever way she feels will best serve Aria,\"</i> [name] tells you.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"The current high priestess is Yrissa, and everyone acknowledges her beauty and wisdom,\"</i> the elf blushes slightly. <i>\"She is thoughtful and kind, and has moved the priesthood to focus on helping the people of the land.\"</i>", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	
	var sceneId = kiakai.flags["RotPrHier"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(30, 1);
	}
	
	kiakai.flags["RotPrHier"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
}


Scenes.Kiakai.TalkPriestDisciplines = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer(),
		virg   : kiakai.FirstCock() ? "p-penis has not entered a vagina" : "v-vagina has not felt the touch of a penis"
	};
	
	Text.Clear();
	
	
	var scenes = [];
	
	// Celibacy1
	if(kiakai.flags["TalkedSex"] < 2) {
		scenes.push(function() {
			Text.AddOutput("<i>\"One of the primary restrictions on the priesthood is that all must remain celibate,\"</i> [name] tells you, looking stern. <i>\"Sex is a distraction from service to the lady Aria, and romantic attachment is a distraction from serving the other people of this world.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Many find it difficult at times, but the high priestess has reaffirmed that this is the proper path in serving Aria.\"</i>", parse);
			Text.Newline();
			
			if(kiakai.flags["Sexed"] != 0) {
				//[But...][Okay]
				var options = new Array();
				options.push({ nameStr : "But...",
					func : function() {
						Text.AddOutput("You mention that the two of you have engaged in certain activities.", parse);
						Text.Newline();
						Text.AddOutput("<i>\"Oh, no!\"</i> [name] answers, blushing furiously. <i>\"Those certainly do not count. After all, m-my [virg],\"</i> [heshe] explains, looking at the ground, [hisher] entire face turning beet red. <i>\"A-and besides, Aria wouldn't forbid something th-that feels so good.\"</i>", parse);
						Text.Newline();
						Text.AddOutput("You feel that if you keep asking about it, [name] will pass out from embarrassment.", parse);
						Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
					}, enabled : true,
					tooltip : "But, you know, you and I..."
				});
				options.push({ nameStr : "Okay",
					func : function() {
						Text.AddOutput("You decide it's best not to mention to the elf that what the two of you have done constitutes as sex.", parse);
						Text.Newline();
						Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
					}, enabled : true,
					tooltip : "Don't mention it."
				});
				if(kiakai.flags["TalkedSex"] == 1) {
					options.push({ nameStr : "Confront",
						func : function() {
							Text.Clear();
							Text.Add("What is so wrong with sex? It's just natural reproductive urges after all...", parse);
							Text.NL();
							Text.Add("<i>\"The tenets of the order are very strict on this, [playername],\"</i> [name] confides. <i>\"I... ah, accept that others engage in it of course, but it is not permitted for the priesthood.\"</i>", parse);
							Text.NL();
							Text.Add("Why is that? How can the deepest expression of love be so repressed?", parse);
							Text.NL();
							Text.Add("<i>\"I do not claim to know the reason for this, but I cannot disobey the high priestess on this matter.\"</i> [name] looks torn, [hisher] emotions pulling [himher] one way, while [hisher] duty holds [himher] back.", parse);
							Text.NL();
							Text.Add("Frustrated, you tell the elf that [heshe] should move according to [hisher] own heart, not to what others decree for [himher]. You think that this teaching is wrong, and you doubt that it is a belief that is really held by Aria. After all, why would such a benevolent goddess withhold the highest forms of pleasure from her followers?", parse);
							Text.NL();
							Text.Add("<i>\"You... have a point,\"</i> [name] grudgingly admits. <i>\"I have never thought too deeply on the subject, but now that you mention it, it does sound strange.\"</i> The elf looks thoughtful for a moment. <i>\"In all honesty, I am not sure that the rule is followed very diligently by the other priests. Alas, that is not the only reason I have,\"</i> [heshe] says in a small voice, looking sad.", parse);
							Text.NL();
							Text.Add("You wait in silence, letting [name] gather courage to speak. <i>\"I may have told you of this, but pregnancy and child-rearing is different for my kind.\"</i>", parse);
							Text.NL();
							if(kiakai.FirstVag()) {
								Text.Add("<i>\"A pregnancy is very hard on an elvish woman, I... I am afraid.\"</i> [name] hugs [himher]self, looking scared. <i>\"I could not withstand such pain as they go through, it would break me. Besides...\"</i>", parse);
								Text.NL();
							}
							Text.Add("<i>\"Elvish children are very important, since so very few of them are born. They are raised by an entire community, such as the village I am from. I would not withhold such an experience from any child.\"</i> [name] turns to you, eyes moist. <i>\"My time outside the village has changed me, I am afraid. I could not bear not having a hand in raising my own child. Were I ever to have a child, I would have to leave the priesthood and return to my village. I would have to... to leave you.\"</i>", parse);
							Text.NL();
							Text.Add("Could [heshe] not use contraceptives to avoid getting pregnant?", parse);
							Text.NL();
							Text.Add("<i>\"I do not know,\"</i> the elf looks gloomy, <i>\"Neither I nor anyone at the shrine knew much of elven physiology, it may well be that what works for regular humans would not work for me. I simply cannot take the risk.\"</i>", parse);
							Text.Flush();
							
							Gui.NextPrompt(function() {
								Text.Clear();
								
								Text.Add("[name]'s dilemma is understandable, but you are not willing to give up on [himher] so easily. Taking [hisher] hand, you pull [himher] down to sit with you. Patiently, you explain to the elf that there are many ways for two persons to make love to each other, with little to no chance for pregnancy.", parse);
								Text.NL();
								Text.Add("At first, [heshe] looks very uncomfortable, perhaps for the first time understanding the implications of [hisher] healing techniques. After a while, the elf begins to look intrigued, even surprising you by asking questions.", parse);
								Text.NL();
								Text.Add("<i>\"C-can you really do that?\"</i> [heshe] blushes at a particularly raunchy suggestion. Smiling, you respond by asking [himher] if [heshe]'d like to try.", parse);
								Text.NL();
								Text.Add("It is several hours later when you finish your talk, and by now [name] has a very different outlook on things.", parse);
								Text.NL();
								Text.Add("<i>\"Well, would you like to try some of that with me?\"</i> you ask in a sultry voice.", parse);
								Text.NL();
								Text.Add("<i>\"I... umm... I guess I wouldn't mind...\"</i> [name] mumbles. You give [himher] a kiss on the cheek before gathering your gear.", parse);
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
			Text.AddOutput("<i>\"Although priests are supposed to be celibate, [playername], I suspect that some do not follow the decree,\"</i> [name] tells you, looking concerned.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"I have seen some in the priesthood in possession of illicit materials.\"</i> [HeShe] blushes slightly. <i>\"And I have witnessed some pairs holding hands as they walk! I have even seen one pair enter an empty room, where I knew they could not possibly have any duties.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"W-worst of all, sometimes I... I hear noises...\"</i> [name] trails off, clearly too embarrassed to continue on the topic.", parse);
			Text.Newline();
			if(kiakai.flags["Sexed"] != 0)
				Text.AddOutput("You're not sure how to respond, considering the noises you've heard [name] make.", parse);
			Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
		});
	}
	// Other
	scenes.push(function() {
		Text.AddOutput("<i>\"The priesthood is meant to uphold the highest moral virtues,\"</i> [name] tells you proudly. <i>\"Though it is acknowledged that it is impossible for mortals to achieve perfection, we must always strive for it.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"We must always show compassion and generosity to those in need, whether it be through healing, or physical aid, or advice, and we must protect those in danger. We also strive to attain spiritual purity to best understand the wishes of our lady Aria, and to serve as a suitable conduit for her power to better the world.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"And, above all, we must oppose evil wherever we see it, and help to protect the integrity of all worlds as much as we are able.\"</i> The elf seems almost to puff up at this recitation of [hisher] calling, clearly determined to do [hisher] utmost to fulfil these goals.", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
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
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	
	
	var scenes = [];
	
	// Chores
	scenes.push(function() {
		Text.AddOutput("<i>\"There are many chores that need to get done just to keep the shrine running,\"</i> [name] tells you. <i>\"There is cooking to be done in the kitchens, tending the shrine fields and gardens, cleaning the floors and maintaining the buildings... Although the priesthood employs some full-time staff to assist with these, much of the work falls to novices and apprentices.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Learning and studying priestly arts naturally come first, but for beginners, a large part of the day is also dedicated to this type of labor. It is said that hard work helps develop character and, by exhausting the body, brings the mind closer to the lady.\"</i>", parse);
		Text.Newline();
		if(kiakai.relation.Get() > 25)
			Text.AddOutput("<i>\"Though, to be honest with you, I have found my mind ever closer to oblivion than to Aria after a grueling day of work.\"</i>", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	// Study
	scenes.push(function() {
		Text.AddOutput("<i>\"Apprentices and acolytes spend much of their day trying to grasp the mysteries of Aria,\"</i> [name] informs you. <i>\"We do not have one holy book, but there are many tomes telling tales of other worlds, and of the goodness of Aria in aiding all. There are also spoken verses that all in the priesthood are required to memorize, as their knowledge and recitation help focus the mind on our lady.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"In addition to this, many, especially among the acolytes and diviners, choose to study books of knowledge of the world, of nature, and even of the arts of men, so that they may better understand how to serve Aria in Eden and elsewhere. Others eschew arcane study in favor of studying healing, learning of the workings of the bodies of animals and men and others. This study is favored by the clerics and acolytes who wish to join their ranks.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("And what about [himher]?", parse);
		Text.Newline();
		Text.AddOutput("[name] blushes slightly. <i>\"I have studied both lores quite extensively. I... I wish to serve lady Aria in whatever way she may desire, and thus I wish to be prepared for all eventualities.\"</i> ", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	// Copying
	scenes.push(function() {
		Text.AddOutput("<i>\"Instead of the menial chores of novices, many acolytes, as well as some of the more talented apprentices, take on the work of copying manuscripts.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"The shrine contains an even bigger library than the human capital,\"</i> [name] tells you proudly, <i>\"and visiting scholars often request that we make copies of particular items in it. In addition, some books are so ancient that they must be copied, lest they fall to decay.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"The priesthood also sometimes has us copy some of the more popular volumes and sells them in the kingdom,\"</i> the elf tells you, sounding doubtful of this practice. <i>\"I suppose it is for the best, for it gives us funds to do more good, and spreads knowledge to the world.\"</i>", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	// Good works
	scenes.push(function() {
		Text.AddOutput("<i>\"Clerics often go out into the world in response to the needs of the people, and sometimes take acolytes with them,\"</i> [name] tells you, looking wistful. <i>\"They provide succor to the sick, healing everything from terrible wasting diseases to broken bones.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"At the same time, they gather the people to them, and tell them of lady Aria, and teach the people to revere her and aid her in her deeds.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("You ask if [name] has gone out with the clerics.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Sadly, I have had but one chance to venture outside the shrine in this fashion. It seems that most clerics do not wish to have me along with them.\"</i> [HeShe] looks momentarily downcast. <i>\"Of course, then came the second chance when I was called by lady Aria to come meet you,\"</i> [heshe] adds, cheering up.", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	// Advising
	scenes.push(function() {
		Text.AddOutput("<i>\"Some among the diviners have largely left the shrine, and taken up residence in the human capital, where they have become advisers. All diviners know much about the world and about human affairs, and as such, many in positions of power see their advice as invaluable.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"In return, providing such advice gives them a perfect opportunity to turn the deeds of the mighty to serve the will of Aria, and to help the world. All of them still report to the order heads and the high priestess, and they occasionally come back to the shrine to inform the others of what is going on in the world, or to seek guidance from their peers when they feel they need it.\"</i>", parse);
		if(kiakai.relation.Get() > 25) {
			Text.Newline();
			Text.AddOutput("<i>\"Between you and me,\"</i> [name] adds, <i>\"I question the piety of such diviners whom I have met. I fear some of them may have become seduced by worldly power and riches, and report to the high priestess, and even serve lady Aria, in name only.\"</i>", parse);
		}
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	// Rituals
	scenes.push(function() {
		Text.AddOutput("<i>\"Once a week, all at the shrine, whether priests or visitors, gather to pray together, [playername],\"</i> [name] tells you. <i>\"It is an occasion of communal bonding, letting us feel each others' devotion and be strengthened by it. We ask Aria to support us in our deeds and to guide us in fulfilling her will. I have quite missed these in the time I have been traveling,\"</i> [heshe] confesses. <i>\"They bring a sense of certainty and confidence to all in the priesthood.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"In addition, once every season there is a bigger celebration. It is a wondrous occasion, to which many come from the outlying villages, with patrols going out from the shrine and from the kingdom to help guide those who wish it past the beasts in the woods. Many in the priesthood play beautiful music, candles illuminate the grand hall deep into the night like a myriad of stars, and the kitchens labor day and night to provide food for any who wish it at the gathering.\"</i> [name] speaks wistfully, a relaxed smile on [hisher] face, and you tell [himher] you'd like to see this celebration sometime.", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	
	var sceneId = kiakai.flags["RotPrAct"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(30, 1);
	}
	
	kiakai.flags["RotPrAct"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
}


Scenes.Kiakai.TalkPriestYrissa = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	
	
	var scenes = [];
	
	// General
	scenes.push(function() {
		Text.AddOutput("<i>\"The current high priestess of the order is Yrissa. She has held the position for two seven-year cycles in a row now, having assumed it at a young age.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"She was actually the one who brought me from the village to the order.", parse);
		Text.Newline();
		
		if(kiakai.relation.Get() > 25 || kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral)
			Text.AddOutput("She is very precious to me,\"</i> [name] confesses. <i>\"She was the one who made sure I was accepted even though the leadership back then was still skeptical of admitting an elf, and she has been like an older sister, and sometimes almost a... mother, to me.\"</i>", parse);
		else
			Text.AddOutput("She has kept watch over me since then, making sure that I am doing well, and learning to best serve lady Aria. She has been a great help in guiding me on my path, [playername]. Perhaps she will be able to assist you, as well,\"</i> [name] tells you, looking you straight in the eyes.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"She is generous and kind, but also strict and meticulous in ensuring that Aria's will is done. She, more than anyone, acts for the preservation of the worlds, and to ensure the dominion of our lady's goodness.\"</i>", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	// Ambition
	scenes.push(function() {
		Text.AddOutput("<i>\"When Yrissa came for me in my village, she was in her teens, but already the order had recognized her abilities and potential. From there, she rose rapidly through the ranks, and her abilities were seen by all when she rose to the rank of high priestess at the almost unheard-of age of thirty-two,\"</i> [name] tells you, pride evident in her voice.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"She has been skillful in directing the order since then, and ensuring that all our abilities are bent to the service of Aria.\"</i>", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	if(kiakai.relation.Get() > 50)
	{
		// Promotion
		scenes.push(function() {
			Text.AddOutput("<i>\"To be honest with you, I often wish that Yrissa would simply have me promoted already. I think there are many among the order heads who oppose the promotion of an elf to the full prestige of a diviner or cleric, but she could override them if she wished to. I suspect that she had to override them just to get me to the rank of acolyte.\"</i> [name] looks petulant, saying this.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"The last time we spoke of this, she had told me that it is best that I wait, so that the others can reconcile themselves to my skills, and my place in the order. But how much longer must I wait?\"</i> The elf exclaims, frustrated. <i>\"I am already the equal of most clerics in healing ability, and of most diviners in knowledge! What else do they wish of me before they acknowledge me?\"</i> [HeShe] pauses, making a visible effort to calm [himher]self.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Ah, forgive me, [playername], I let my pride get the better of me.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("You tell [himher] that there is nothing to forgive, and you quite understand [hisher] frustration.", parse);
			Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
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
}


Scenes.Kiakai.TalkPriestAria = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		Text.AddOutput("<i>\"Most in the priesthood speak of conversing with lady Aria almost every day. They pray to her at night, and hear what she wishes of them in response. Sometimes, they even find that small miracles occur, as she lights their way to doing her will.\"</i> [name] sounds a little despondent as [heshe] tells you this.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"For some reason, she does not speak to me as often. Perhaps even she prefers to communicate with humans rather than with elves. I know for certain that I have heard from her but twice in my life. The first time she spoke to me, I knew that I must leave the village of my birth, and come to aid her at the shrine, and the second, she told me come and find you.\"</i> [name] smiles gently. <i>\"I suppose I ought not to complain about the lack of communications, when their import is so great.\"</i>", parse);
		
		if(kiakai.relation.Get() > 40) {
			Text.Newline();
			Text.AddOutput("The elf pauses, thinking a little, before adding, <i>\"To be entirely honest with you, [playername], sometimes I wonder if the other priests hear from lady Aria at all. The two times she spoke to me, I knew I could have no mistake nor illusion about either her message or intent. I beheld her corporeal form, and the beautiful sight of her garden as well. When the other priests speak of conversing with her, however, it is never something so clear or vivid, and often they receive ambiguous or even conflicting messages.\"</i> [name] shakes her head. <i>\"And yet, I know they are good men and women, and would not invent revelation where there is none. I simply do not know what to make of it.\"</i>", parse);
		}
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	
	var sceneId = kiakai.flags["RotPrAria"];
	if(sceneId >= scenes.length) {
		sceneId = 0;
		kiakai.relation.IncreaseStat(20, 1);
	}
	
	kiakai.flags["RotPrAria"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
}

Scenes.Kiakai.TalkPriestMeeting = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	Text.Clear();
	
	
	var scenes = [];
	
	// Short version
	scenes.push(function() {
		Text.AddOutput("<i>\"It was a simple thing, [playername]. As I meditated in the gardens, lady Aria entered my mind, and sent me a vision of her wishes. She told me of your arrival, and showed you to me, instructing me in what I need to do for you.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"I set out as soon as I could and after several days of travel, I arrived at the nomad camp,\"</i> [name] recalls, smiling. <i>\"They were not too welcoming at first, but I was able to aid them with my healing, and we reached an understanding. There, I waited for half a day, and found you after your descent.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("You ask [himher] how it could be possible for [himher] to travel for so long and still get there before you, when your own trip through the worlds felt like it was less than a day.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"That, I do not know,\"</i> the elf replies. <i>\"It could be that time flows differently in the other worlds, or that your passage through the boundaries was longer than you perceived. Or it could be that lady Aria foresaw your arrival, and knew to send me to wait for you before you had even left your world.\"</i>", parse);
		Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
	});
	if(kiakai.relation.Get() > 50) {
		// Detailed version
		scenes.push(function() {
			Text.AddOutput("<i>\"I... I have a confession to make, [playername],\"</i> [name] says, looking embarrassed. <i>\"Although I did not say anything untrue to you about the way I came to fetch you, I may have omitted some details.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("You ask what [heshe] means.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Well, you see, when I received lady Aria's instructions while meditating, I indeed hurried off to my room to pack immediately. However, what I did not tell you is that, in my haste, I spared no time to inform any person in the priesthood of my intent.\"</i> The elf looks conflicted saying this. <i>\"Not even Yrissa. Now, I do not know how they will welcome me back. <b>Whether</b> they will welcome me back.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"There was nought else I could do, [playername]! How was I to prove that my revelation was genuine, when the only sign of it was in my mind. And if they hesitated or debated, or, worst of all, did not believe me, my purpose would have been ruined. Not telling the priesthood of lady Aria's wishes was the only way I could carry them out!\"</i>", parse);
			Text.Newline();
			
			if(kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral)
				Text.AddOutput("You hug the agitated elf, telling [himher] that [heshe] chose well. If [heshe] had delayed, you would've been lost, a near-dead stranger in a strange land, and Aria's plan would have been for nought.", parse);
			else
				Text.AddOutput("You pat the agitated elf on the head, telling [himher] that [heshe] did well. You tell [himher] that [heshe] doesn't need to worry about the attitude of the priesthood while [heshe]'s following you. After all, in serving you, [heshe] furthers the will of Aria.", parse);
			Gui.NextPrompt(Scenes.Kiakai.TalkPriest);
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
}


/*
 * 
 * HEALING SCENES
 * 
 */
Scenes.Kiakai.Healing = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer(),
		heatStirring : player.FirstCock() ? "stirring" : "heat",
		breastDesc   : function() { return player.FirstBreastRow().Short(); },
		nipsDesc   : function() { return player.FirstBreastRow().NipsShort(); },
		cockDesc     : function() { return player.FirstCock().Short(); },
		vagDesc      : function() { return player.FirstVag().Short(); },
		armor        : function() { return kiakai.ArmorDesc(); }
	};
	
	parse.genDesc = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	parse.fluids  = player.FirstCock() ? "salty precum" :
					player.FirstVag() ? "sweet juices" :
					"sweat";
	
	Text.Clear();
	
	world.TimeStep({minute : 30});
	
	if(player.HPLevel() < 0.25) { // REALLY LOW HEALTH 0-25%
		player.AddHPFraction(1.0);
		Text.AddOutput("<i>\"[playername]!\"</i> The elf exclaims, aghast. <i>\"How are you even still standing? The amount of damage you took in that last fight... And yet, you still kept going like it was nothing.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("[name] gently guides you to lie down on a soft patch of earth, wincing on your behalf every time [heshe] is forced to touch one of your serious injuries. [HeShe] runs [hisher] hands slowly over your torn up body, focusing on every wound and bruise. Gradually, spot by spot, you feel the pain drain away, the waves of healing energy from the elf soothing and mending even your deepest hurts.", parse);
		Text.Newline();
		
		if(kiakai.flags["Attitude"] >= Kiakai.Attitude.Neutral) {
			Text.AddOutput("You sincerely thank the elf, telling [himher] you had been worried that this time it might have been an injury you couldn't just sleep off. [HeShe] smiles at you, happy with a job well done.", parse);
			Text.Newline();
			Text.AddOutput("The gentle touch of the elf roused something within you, however, making you hesitate when [heshe] gets up and urges you to get dressed again.", parse);
		}
		else {
			Text.AddOutput("You smirk at the elf, telling [himher] [heshe] did a good job, but there's one spot [heshe] missed. [name] looks at you with clear concern, which changes to deep embarrassment as [heshe] understands your meaning.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Even when you're this injured, [playername]...\"</i> [HeShe] trails off, unsure what to make of you. Trying to shrug it off, [heshe] backs off, gesturing toward your clothes.", parse);
		}
		
		Scenes.Kiakai.HealingSeducePrompt();
	}
	else if(player.HPLevel() < 0.75) { // LOW HEALTH 25-75%
		player.AddHPFraction(1.0);
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.AddOutput("<i>\"[playername]!\"</i> The elf exclaims with a worried expression. <i>\"Please, lie down and take off your clothes, I will tend to your wounds.\"</i> You comply, giving the occasional wince as the elf runs [hisher] hands over your nude body, warm flows of healing energy seeping into your battered form. Soon, your pain is numbing, and the various bruises on your body fade.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.AddOutput("Seeing your wounds, [name] hurriedly instructs you to remove your clothes so [heshe] can tend to you. A gentle flow of healing energy seeps from your elvish companion's fingers, closing up cuts and soothing bruises, numbing your pain. <i>\"Are you feeling better, [playername]?\"</i> the elf asks. You assure [himher] that you are feeling much better.", parse);
			if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
				Text.Newline();
				Text.AddOutput("Much, much better, you add, grinning mischievously at [himher]. The elf nods at you uncertainly.", parse);
			}
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.AddOutput("Wordlessly, [name] helps you disrobe, worriedly running [hisher] hands down your wounded body. Your cuts and bruises smart slightly as the elf's deft fingers run over them, assessing the damage. <i>\"You must be more careful, [playername],\"</i> [name] scolds you, <i>\"share some of your burdens with your companions.\"</i>", parse);
			Text.Newline();
			
			if(kiakai.flags["Attitude"] >= Kiakai.Attitude.Neutral) {
				Text.AddOutput("Grudgingly, you agree to try to be more careful in the future. The elf nods, somewhat consoled.", parse);
			}
			else { // NAUGHTY
				Text.AddOutput("Wincing as a particularly painful wound is being probed, you mutter under your breath that, perhaps if a certain elf would keep in line and do as [heshe] is told, you wouldn't be so distracted.", parse);
			}
			
			Text.Newline();
			Text.AddOutput("The discomfort eases as you feel tendrils of healing magic enter your body, working their way into your most dire wounds and numbing the pain.", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
		
		Text.Newline();
		Text.AddOutput("<i>\"There, that should do it,\"</i> [name] announces, withdrawing the flow of healing magic from your body. [HeShe] rests [hisher] hands on your stomach for a few moments longer than what should be strictly necessary, with a thoughtful expression on [hisher] face. Shaking [hisher] head a bit, [heshe] gets up on [hisher] feet, motioning for you to get dressed.", parse);
		Text.Newline();
		Text.AddOutput("A [heatStirring] in your groin makes itself known, tauntingly reminding you of the elf's gentle touch.", parse);
		
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
			Text.Newline();
			Text.AddOutput("Perhaps you should have [himher] service the rest of you as well?", parse);
		}
		
		Scenes.Kiakai.HealingSeducePrompt();
	}
	else { // Health 75%-100%
		Text.AddOutput("<i>\"Really, [playername]? You look to be fine to me,\"</i> [name] looks at you, unsure.", parse);
		Text.Newline();
		
		//[Heal][Seduce][Insist]
		var options = new Array();
		options.push({ nameStr : "Heal",
			func : function() {
				player.AddHPFraction(1.0);
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.AddOutput("<i>\"Very well, then,\"</i> the elf nods, gesturing you to turn around and bare your back. [HisHer] light caresses trail over your back, sending light shocks of electricity racing up your spine.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.AddOutput("<i>\"If that is your wish,\"</i> the elf consents, running [hisher] hands across your body. Small probing tendrils of healing magic sneak out from [hisher] fingers, finding their way into your various minor injuries.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.AddOutput("It's [hisher] job to keep you healthy at all times, is it not? <i>\"As you say,\"</i> [name] grudgingly agrees, instructing you to disrobe. After [heshe] has administered some minor healing on your body, the elf withdraws [hisher] hands.", parse);
				}, 1.0, // Scene only available for naughty
				function() { return kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral; });
				
				scenes.Get();
				
				Text.Newline();
				Text.AddOutput("Feeling far more refreshed, you gather up your gear and continue on your journey.", parse);
				
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : true,
			tooltip : "A small spark of healing energy should be enough to perk you up."
		});
		options.push({ nameStr : "Seduce",
			func : function() {
				player.AddHPFraction(1.0);
				Text.AddOutput("You give [name] a light caress on [hisher] cheek and gaze deep into [hisher] eyes. <i>\"What sort of healer doesn't help those in need?\"</i> you mockingly tease [himher]. Flustered, the elf asks you where you are hurt. Suggesting that it would be easier to find if you were nude, you undress in front of the blushing elf. In fact, you suggest, perhaps it'd be easier if both of you were nude...", parse);
				Text.Newline();
				if(kiakai.flags["Sexed"] > 15) {
					// TODO: use musculature instead
					parse["shape"] = player.body.femininity.Get() ? "your smooth curves" : "the lines of your muscles";
					Text.AddOutput("<i>\"I... I think you are right, [playername]!\"</i> [name] quickly wriggles out of [hisher] [armor], breathing a bit faster. [HeShe] only hesitates for a moment before greedily probing your naked body, gently letting [hisher] fingers trace [shape].", parse);
				}
				else {
					Text.AddOutput("[name] starts to mouth some protest, but you silence [himher] with a finger against [hisher] lips. As the elf warily probes your body, you slowly undress [himher], smiling at [name]'s attempts to cover [himher]self.", parse);
				}
				Text.Newline();
				Text.AddOutput("You gasp as small tendrils of healing energy flow into your body, soothing any lingering wounds and bruises. Once [heshe] is done, you gather [name] into a gentle hug, pulling [himher] down to the ground. ", parse);

				if(kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral)
					Text.AddOutput("[HeShe] doesn't seem to mind at all, sighing happily and snuggling up against your [breastDesc].", parse);
				else if(kiakai.flags["Sexed"] > 15)
					Text.AddOutput("[HeShe] looks conflicted, suspecting what is to come. From [hisher] rapidly beating heart, it seems like [heshe] is looking forward to it.", parse);
				else
					Text.AddOutput("[HeShe] seems a bit uncomfortable with you still, but nervously complies, offering no resistance.", parse);			
				Scenes.Kiakai.HealingNice();
			}, enabled : true,
			tooltip : "Coax the elf into having some fun with you."
		});
		options.push({ nameStr : "Insist",
			func : function() {
				player.AddHPFraction(1.0);
				Text.AddOutput("Insisting that you are indeed hurt, you slip out of your clothing without any urging from the elf. Shrugging, the elf motions for you to turn around, searching your body for signs of injury. Instead of heeding to [hisher] instruction, you take [hisher] hand in yours. <i>\"Here, I'll show you where...\"</i>", parse);
				Text.Newline();
				Text.AddOutput("The elf's face turns a bright pink, then beet red, as you guide [hisher] fingers across your body. Their first stop is your [breastDesc], stopping to circle your [nipsDesc] before trailing down toward your exposed crotch.", parse);
				Text.Newline();
				Text.AddOutput("You hold [name]'s gaze captive, the poor elf almost hypnotized as [hisher] hand inexorably draws closer to your [genDesc]. You stop just short of it, forcing [himher] to close the final distance on [hisher] own.", parse);
				Text.Newline();
				
				if(kiakai.flags["Sexed"] > 10) {
					Text.AddOutput("Without hesitation, the elf's fingers ", parse);
					if(player.FirstCock())
						Text.AddOutput("close around your erect [cockDesc], caressing the length reverently.",parse);
					else if(player.FirstVag())
						Text.AddOutput("brush against your [vagDesc], gently teasing your folds apart.",parse);
					else
						Text.AddOutput("caress your featureless crotch.");
					
					Text.AddOutput(" <i>\"You are always making me do weird things,\"</i> [name] murmurs under [hisher] breath, but shrugs out of [hisher] [armor] without any further coaxing from you. Leaning back onto the ground, you enjoy the show.", parse);
				}
				else {
					Text.AddOutput("[name]'s eyes are like those of a cornered doe, unsure of whether to flee or dive in. A few moments pass before you insistently urge [himher] on, forcing [hisher] hands to graze against your [genDesc]. Snapping out of it, the elf hurriedly withdraws [hisher] hand, unthinkingly bringing it to [hisher] mouth, depositing a single drop of [fluids] on [hisher] lips.", parse);
					Text.Newline();
					Text.AddOutput("You console the flustered and protesting elf, telling [himher] that [heshe] is doing well; together, you have found the place that hurts, now [name] only needs to take care of it. Helping the brightly blushing elf out of [hisher] [armor], you recline and motion for [himher] to join you.", parse);
				}
				parse.att1 = kiakai.flags["Sexed"] > 20 ? "eagerly eyeing" : kiakai.flags["Sexed"] > 10 ? "pleasantly aware of" : "uncomfortably aware of";
				Text.Newline();
				Text.AddOutput("Once nude, the elf kneels down before you, [att1] your exposed [genDesc]. [HeShe] seems to be waiting for your instructions.", parse);

				Scenes.Kiakai.HealingAssertive();
			}, enabled : true,
			tooltip : "You're less interested in the healing than the part that may come after."
		});
		Gui.SetButtonsFromList(options);
	}
}

Scenes.Kiakai.HealingSeducePrompt = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer(),
		heatStirring : player.FirstCock() ? "stirring" : "heat",
		breastDesc   : function() { return player.FirstBreastRow().Short(); },
		nipsDesc   : function() { return player.FirstBreastRow().NipsShort(); },
		cockDesc     : function() { return player.FirstCock().Short(); },
		vagDesc      : function() { return player.FirstVag().Short(); },
		armor        : function() { return kiakai.ArmorDesc(); },
		hairDesc     : function() { return kiakai.Hair().Short(); }
	};
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.genDesc = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
					
	//[Finish][Seduce][Nah]
	var options = new Array();
	options.push({ nameStr : "Finish",
		func : function() {
			Text.Clear();
			Text.AddOutput("You gather up your gear, resolving to deal with your arousal in some other manner. While you are not quite sure, you could almost swear that you catch [himher] taking a peek as you get dressed.", parse);
			Text.Newline();
			
			if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
				Text.AddOutput("Hiding your smile, you purposely flaunt parts of your body to [himher], trying to make it look like an accident. Blushing at getting caught, the elf quickly pirouettes away from you, hurriedly gathering up [hisher] gear.", parse);
			
			player.AddLustFraction(0.05);
			kiakai.AddLustFraction(0.05);
			
			Gui.NextPrompt(kiakai.Interact);
		}, enabled : true,
		tooltip : "It is time to carry on with your quest."
	});
	options.push({ nameStr : "Seduce",
		func : function() {
			Text.Clear();
			Text.AddOutput("Rather than complying with [hisher] wishes, you stretch sinuously, making certain to flaunt your body for the captive audience as much as you can. Patting the ground beside you, you motion for your elvish companion to join you.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Should we not be going, [playername]?\"</i>, [name] mumbles, blushing slightly. You chuckle, insisting that you are in no rush. Lazily, you part your legs, giving the embarrassed elf a clear view of your [genDesc]. The elf gets down beside you, trying to avoid your gaze and cover [hisher] burning cheeks.", parse);
			Text.Newline();
			Text.AddOutput("A jolt runs up the elf's spine as you languidly caress [hisher] [hairDesc], whispering in [hisher] ear that [heshe] should get out of those pesky clothes.", parse);
			Text.Newline();
			if(kiakai.flags["Sexed"] > 10)
				Text.AddOutput("<i>\"Every time we do this, I-\"</i>, [name] cuts [himher]self off, blushing like a bride on her wedding day. Nonetheless, the elf snuggles down beside you, voluntarily removing [hisher] [armor].", parse);
			else
				Text.AddOutput("<i>\"I... I will be cold,\"</i> [name] complains uncertainly, [hisher] eyes constantly straying across your exposed body. <i>\"Then you'll just have to come closer, won't you?\"</i> you whisper, pulling the hapless elf into a gentle kiss. [name]'s eyes glaze over as [heshe] struggles out of [hisher] [armor], any lingering doubts quickly abandoned.", parse);
			
			Scenes.Kiakai.HealingNice();
		}, enabled : true,
		tooltip : "Perhaps you could persuade the elf to tend to you a bit... more?"
	});
	options.push({ nameStr : "Assert",
		func : function() {
			Text.Clear();
			Text.AddOutput("<i>\"And just where do you think you're going?\"</i> you complain, amused at the elf's surprised expression. <i>\"[stuttername]...?\"</i>", parse);
			Text.Newline();
			if(kiakai.flags["Sexed"] > 10)
				Text.AddOutput("<i>\"Don't be coy, now,\"</i> you say teasingly, spreading your legs and presenting the brightly blushing elf with your [genDesc]. <i>\"By now, you should know <b>exactly</b> what I want.\"</i> Nervously, [name] shrugs out of [hisher] [armor], [hisher] own arousal getting the best of [himher]. As [heshe] gets down on [hisher] knees between your legs, [name] looks up at you, itching to get started but awaiting your word.", parse);
			else {
				Text.AddOutput("<i>\"Getting me all excited like that,\"</i> you chide the elf reproachingly, <i>\"Why don't you give me some proper care?\"</i> [name]'s indignant response is cut short as [heshe] glances down at your body, realizing what you are talking about. <i>\"Now, how about taking responsibility for this?\"</i>", parse);
				Text.Newline();
				Text.AddOutput("A bit surprisingly, the elf is quick to catch on, hurriedly getting out of [hisher] [armor] before kneeling down, an almost expectant look in [hisher] eyes.", parse);
			}
			
			Scenes.Kiakai.HealingAssertive();
		}, enabled : true,
		tooltip : Text.Parse("Since [name] got you going, [heshe] better sate you...", parse)
	});
	Gui.SetButtonsFromList(options);
	
}

Scenes.Kiakai.HealingNice = function() {
	
	var parse = {
		playername : player.name,
		name    : kiakai.name,
		heshe   : kiakai.heshe(),
		HeShe   : kiakai.HeShe(),
		himher  : kiakai.himher(),
		hisher  : kiakai.hisher(),
		HisHer  : kiakai.HisHer(),
		hishers : kiakai.hishers(),
		heatStirring : player.FirstCock() ? "stirring" : "heat",
		breastDesc   : function() { return player.FirstBreastRow().Short(); },
		nipsDesc   : function() { return player.FirstBreastRow().NipsShort(); },
		cockDesc     : function() { return player.FirstCock().Short(); },
		multiCockDesc: function() { return player.MultiCockDesc(); },
		cockTip      : function() { return player.FirstCock().TipShort(); },
		ballsDesc    : function() { return player.BallsDesc(); },
		anusDesc     : function() { return player.Butt().AnalShort(); },
		buttDesc     : function() { return player.Butt().Short(); },
		vagDesc      : function() { return player.FirstVag().Short(); },
		clitDesc     : function() { return player.FirstVag().ClitShort(); },
		legsDesc     : function() { return player.LegsDesc(); },
		armor        : function() { return kiakai.ArmorDesc(); },
		hairDesc     : function() { return kiakai.Hair().Short(); },
		kCockDesc    : function() { return kiakai.FirstCock().Short(); },
		kBreastDesc  : function() { return kiakai.FirstBreastRow().Short(); },
		kNipsDesc    : function() { return kiakai.FirstBreastRow().NipsShort(); },
		kTongueDesc  : function() { return kiakai.TongueDesc(); },
		priest       : kiakai.flags["InitialGender"] == Gender.male ? "priest" : "priestess",
		eyeColor     : Color.Desc(kiakai.Eyes().color),
		manwoman     : kiakai.body.femininity.Get() > 0 ? "woman" : "man",
		load         : player.HasBalls() ? "the contents of your sack" : "your load",
		loadOrg      : player.HasBalls() ? "your balls" : "deep within your body"
	};
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.genDesc = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
					
	//[Handjob][Blowjob][Eat you][Kia/Kai][Cuddle]
	var options = new Array();
	if(player.FirstCock()) {
		// HANDJOB
		options.push({ nameStr : "Handjob",
			func : function() {
				Text.Clear();
				player.AddSexExp(1);
				kiakai.AddSexExp(1);
				Text.AddOutput("Pulling the elf close, you hug [himher] fiercely, locking the two of you in a deep kiss. [name] becomes like puddy in your arms, melting against your body and letting out moaning whimpers. One of your hands find [hishers], fingers joining, as you guide the elf toward your package.", parse);
				Text.Newline();
				Text.AddOutput("Your intertwined hands close around your [cockDesc], the elf's lithe, slightly cold fingers making you shudder in pleasure. At first, you have to lead [himher] through the motion, but soon you withdraw your hand, giving the horny elf free rein on your [cockDesc].", parse);
				Text.Newline();
				
				if(player.FirstCock().thickness.Get() > 10) {
					Text.AddOutput("With how thick your member is, [name] is having a hard time wrapping [hisher] fingers around it. Abandoning the effort entirely, the elf shifts [hisher] attentions to your [cockTip], gently rubbing the sensitive organ.", parse);
					Text.Newline();
				}
				
				if(kiakai.FirstCock()) {
					if(Math.random() < 0.5) {
						Text.AddOutput("[name]'s own [kCockDesc] stands at attention, tightly trapped between you. Amused, you reach down and fondle it before letting the elf get back to business. ", parse);
						kiakai.AddLustFraction(0.3);
					}
					else {
						Text.AddOutput("[name] suddenly moans as [hisher] own [kCockDesc], which has been rubbing against you for some time, erupts as the elf prematurely climaxes. You hold on to [himher] as she rides out the wave, whispering encouragements. ", parse);
						kiakai.AddLustFraction(-1);
					}
					Text.Newline();
				}
				
				if(kiakai.FirstBreastRow().size.Get() >= 3) {
					Text.AddOutput("[HisHer] [kBreastDesc] mash against you, the perky nipples stiff with [hisher] lust.", parse);
					kiakai.AddLustFraction(0.1);
					Text.Newline();
				}
				Text.AddOutput("Opening [hisher] eyes for the first time since you first kissed [himher], you gaze into [name]'s [eyeColor] eyes lovingly. <i>\"I-is it good for you?\"</i> [heshe] whispers uncertainly. You assure the elf that [heshe] is doing a <i>very</i> good job indeed.", parse);
				if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
					Text.AddOutput(" It is almost like [heshe] was born to do this kind of thing, you add.", parse);
				Text.Newline();
				
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.AddOutput("A sudden jolt in your nethers snaps you into full attention, and suddenly you are fighting to hold back your release. Glancing down, you see that [name] is not even touching you anymore. Rather, a small spark of healing magic bridges the gap to your [cockDesc].", parse);
					Text.Newline();
					Text.AddOutput("<i>\"I will make your pain go away,\"</i> [heshe] whispers lustily in your ear. Not able to hold back anymore, you cry out as you deposit [load] into [name]'s waiting hand.", parse);
					Text.Newline();
					
					// LARGE LOAD VARIATIONS
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.AddOutput("Your healthy load quickly becomes too much for the elf to handle, and [heshe] gives a surprised cry as much of your seed drips from [hisher] hands down on the ground.", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.AddOutput("Stray bursts of cum erupt from your trembling member, some hitting the surprised elf right in the face, others dripping down [hisher] lithe body.", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.AddOutput("Grinning, you guide [name]'s head down to your still erupting [cockDesc]. ", parse);
						if(kiakai.flags["Sexed"] > 15)
							Text.AddOutput("[HeShe] moves eagerly, almost without your encouragement, wrapping [hisher] lips around you in time to meet an eruption of a large wad of cum, splattering on [hisher] tongue. Your sigh of pleasure is met by a moan of delight from the elf, as [heshe] keeps [hisher] mouth wrapped around you, waiting for your orgasm to end.", parse);
						else
							Text.AddOutput("[HeShe] starts to protest, but is quickly interrupted by a large wad of cum, splattering on [hisher] tongue. Sighing in pleasure, you hold the struggling elf there as you hose [himher] down, waiting for your orgasm to end.", parse);
					}, 1.0, function() { return kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral; });
					
					scenes.Get();
				}, 1.0);
				scenes.AddEnc(function() {
					Text.AddOutput("Edged on by your encouragement, [name] shifts around so that [heshe] is kneeling beside your prone form, leaving [himher] with full access to your [cockDesc]. [HeShe] grasps the erect member with both hands, trying [hisher] best to pleasure you.", parse);
					Text.Newline();
					Text.AddOutput("<i>\"Just... like... that!\"</i> You moan, urging [himher] to keep up the pace. Understanding dawns on [name]'s face, blushing at your praise, [heshe] keeps jerking your [cockDesc], determined to make you come. [HeShe] isn't forced to wait long.", parse);
					Text.Newline();
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.AddOutput("With a sharp cry, you let loose your flood, ", parse);
						if(player.CumOutput() > 3)
							Text.AddOutput("your [cockDesc] exploding with cum in the poor elf's hands.", parse);
						else
							Text.AddOutput("trickling down the elf's hands.", parse);
						Text.Newline();
					}, 1.0);
					scenes.AddEnc(function() {
						Text.AddOutput("In a rather uncharacteristic move, [name] leans down to plant a kiss on your trembling [cockDesc]. This plan backfires though, as you pick that exact moment to hit your peak.", parse);
						Text.Newline();
						
						if(player.CumOutput() > 3) {
							Text.AddOutput("Completely caught off guard, [name]'s cheeks balloon out as [hisher] tiny mouth is quickly flooded with your huge load. A gentle hand on the nape of [hisher] neck keeps [himher] from pulling back, leaving your semen only one way to go.", parse);
							Text.Newline();
							Text.AddOutput("The elf noisily swallows wad after wad of sperm, hopelessly trying to keep up with your output. Finished, you relinquish your hold and allow [himher] to take [hisher] lips off your [cockDesc].", parse);
						}
						else if(kiakai.flags["Sexed"] > 15) {
							Text.AddOutput("[name]'s eyes widen slightly as your loads forces its way in between [hisher] lips, but [hisher] expression quickly turns dreamy. Rather than pull back, [name] takes your entire [cockTip] into [hisher] mouth, thoroughly enjoying every serving of your thick cream that [heshe] can get.", parse);
							Text.Newline();
							Text.AddOutput("The surprised elf chokes slightly on your cum, but quickly recovers, and does [hisher] best to swallow the load in [hisher] mouth. [HisHer] tongue darts out of [hisher] mouth, licking up the strands that had spilled out around [hisher] lips.", parse);
						}
						else {
							Text.AddOutput("Your cum insistently presses past [name]'s puckered lips, landing in bursts on [hisher] tongue. Caught off guard, the elf pulls back in a panic, tongue sticking out and dripping of salty cum.", parse);
							Text.Newline();
							Text.AddOutput("Coughing, the surprised elf spits out part of your load on the ground, [hisher] cheeks burning. [HisHer] hands get sticky as [heshe] tries to wipe [hisher] mouth clean.", parse);
						}
						Text.Newline();
						
						if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
							Text.Newline();
							if(kiakai.flags["Sexed"] > 15)
								Text.AddOutput("<i>\"Why, [name], I didn't realise you enjoyed my taste so much,\"</i> you tell the elf, grinning wickedly. <i>\"Maybe next time I'll just feed you from the beginning. Would you like that?\"</i> [name] blushes furiously at your comments before giving you an almost imperceptible nod.", parse);
							else
								Text.AddOutput("<i>\"Why, [name], you shouldn't have,\"</i> you tell the elf, grinning at [himher] wickedly, <i>\"here I ask for a handjob, and you give me head. The elves truly go above and beyond!\"</i>", parse);
						}
					}, 1.0);
					
					scenes.Get();
				}, 1.0);
				
				scenes.Get();
				
				Text.Newline();
				if(kiakai.flags["Sexed"] > 10)
					Text.AddOutput("The elf, as if in a trance, slowly brings [hisher] sticky fingers to [hisher] mouth, cleaning off each digit while enjoying your flavor.", parse);
				else
					Text.AddOutput("Looking a bit surprised at [hisher] sticky fingers, as if wondering how [heshe] could possibly be responsible for that, [name] hurriedly wipe [hisher] hands on some cloth.", parse);
				Text.Newline();
				Text.AddOutput("There is a slightly embarrassed tension between the two of you as you re-equip your gear and get ready to set out.", parse);
				
				Gui.NextPrompt(kiakai.Interact);
				
				player.AddLustFraction(-1);
				kiakai.flags["Sexed"]++;
			}, enabled : true,
			tooltip : Text.Parse("Get a handjob from [name].", parse)
		});
		
		
		// BLOWJOB
		options.push({ nameStr : "Blowjob",
			func : function() {
				Text.Clear();
				player.AddSexExp(2);
				kiakai.AddSexExp(2);
				Text.AddOutput("Your lips lock with [name]'s, tongue dancing past [hisher] lips and starting an impromptu wrestling match that the elf has no hope of winning. Deciding to give [himher] a bit of a chance, you let up your assault and whisper into [hisher] ear.", parse);
				Text.Newline();
				Text.AddOutput("The panting elf gazes up at you through [hisher] thick eyelashes, comprehension dawning slowly. Shuffling around slightly, [name] plants kisses down your [breastDesc], making a clear trail toward your [cockDesc]. A momentary doubt hits [himher] as [heshe] is able to appreciate the size of your member at close range, but you assure [himher] that it will be all right, giving the elf an encouraging pat on [hisher] head.", parse);
				Text.Newline();
				Text.AddOutput("[name] begins by placing a track of glistering pecks on your [cockDesc], covering the entire length with kisses.", parse);
				Text.Newline();
				
				if(player.NumCocks() > 1) {
					Text.AddOutput("Deciding that it would be unfair to focus all [hisher] attention on only <i>one</i> of your members, [name] repeats the same process for each of your [multiCockDesc].", parse);
					Text.Newline();
				}
				
				if(player.HasBalls()) {
					Text.AddOutput("When reaching your scrotum, [heshe] gives each of your [ballsDesc] a long lick, sucking a bit on them before returning [hisher] attention to the main course.", parse);
					Text.Newline();
				}
				else if(player.FirstVag()) {
					Text.AddOutput("As [heshe] reaches the base of your [cockDesc], the elf is greeted by your other genitalia, your moist [vagDesc]. [HeShe] gives it a few licks before returning to [hisher] original target.", parse);
					Text.Newline();
				}
				Text.AddOutput("Taking a deep breath, [name] finally takes the tip of your [cockDesc] into [hisher] mouth, letting it rest just inside as [hisher] tongue laps at it. Groaning a bit, you reposition yourself so that you can get a good thrust angle, intending to spice things up a bit. Blissfully unaware of your plans, [name] begins to suck on your [cockDesc], and you let [himher] coat a good part of your length before coming to a decision.", parse);
				
				
				//[Passive][Active]
				var options = new Array();
				options.push({ nameStr : "Passive",
					func : function() {
						Text.Clear();
						Text.AddOutput("Sighing in pleasure, you lean back and allow [name] to show [hisher] skills. ", parse);
						Text.Newline();
						
						if(kiakai.flags["Sexed"] > 15) {
							Text.AddOutput("More than willing to step up to the challenge, the previously prim and proper [priest] gives [hisher] best to provide you with a good time. Sucking and slurping on your [cockDesc] like a starving [manwoman] who just found food, [name] is soon ", parse);
							if(player.FirstCock().Size() > 75)
								Text.AddOutput("swallowing as much of you as [heshe] is capable of, tending to your remaining length with [hisher] lithe hands.", parse);
							else
								Text.AddOutput("swallowing your entire length, pressing [hisher] lips against your crotch.", parse);
						}
						else if(kiakai.flags["Sexed"] > 5) {
							Text.AddOutput("Even if [heshe] is still slightly inexperienced, [name] gives [hisher] best effort to get you off. Really getting down to business, the elf starts to suck on your [cockDesc], trying to fit as much of your length as possible into [hisher] mouth. ", parse);
							if(player.FirstCock().Size() > 60)
								Text.AddOutput("Unable to take all of you, [name] lets your [cockDesc] momentarily press against the back of [hisher] throat, before hurriedly backing off.", parse);
							else
								Text.AddOutput("Somehow, [heshe] manages to down all of your [cockDesc] without choking, though [heshe] seems to be having some trouble.", parse);
						}
						else {
							Text.AddOutput("[name] is not quite able to get a good rhythm started, but does [hisher] best to pleasure you. [HeShe] seems a bit afraid of taking you very far, and mostly focuses on your [cockTip], not that that is a bad thing at all. The elf's deft tongue playfully laps away at you, hungrily licking up every drop of salty pre.", parse);
						}
						
						Text.Newline();
						
						// TODO: More variations
						var scenes = new EncounterTable();
						/*
						scenes.AddEnc(function() {
							Text.AddOutput("", parse);
							Text.Newline();
							Gui.NextPrompt();
						}, 1.0, function() { return true; });
						*/
						
						// Fingering variation
						scenes.AddEnc(function() {
							if(player.FirstVag() && Math.random() < 0.5) {
								Text.AddOutput("You are suddenly distracted from the exquisite blowjob by two lithe fingers, probing at your moist [vagDesc]. Gasping in surprise, you moan appreciatively as the elf slowly begins to finger your female parts.", parse);
								Text.Newline();
								if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
									Text.AddOutput("<i>\"Good, showing some initiative!\"</i> You grin, accentuating your words with a sudden thrust of your hips, forcing more of your [cockDesc] into [name]'s mouth.", parse);
									Text.Newline();
								}
								Text.AddOutput("With the added pleasure of having both of your genitalia tended to at the same time, it is not long before you hit your peak, ", parse);
								if(player.CumOutput() > 3)
									Text.AddOutput("flooding the elf's throat with your huge load. Gulping and swallowing for all the [heshe] is worth, [name] tries to keep up with you, but a rivulet of semen escape [hisher] mouth, pooling in [hisher] cupped hand.", parse);
								else
									Text.AddOutput("and you feed burst after burst of your seed to the greedy elf. [HeShe] does [hisher] best to swallow all of it, and manages admirably.", parse);
								Gui.NextPrompt();
							}
							// Anal variation
							else {
								Text.AddOutput("[name] gazes up at you through a veil of lust, clouding [hisher] eyes. As if trying to find other ways to bring you pleasure, [heshe] briefly takes your [cockDesc] out of [hisher] mouth, allowing [himher] to lather [hisher] fingers in the sticky blend of saliva and precum coating your member. Quickly getting back to the task at hand, [name] lets [hisher] wet fingers trail across your skin, ", parse);
								if(player.HasBalls())
									Text.AddOutput("cupping and fondling your [ballsDesc], ", parse);
								Text.AddOutput("before finding their target.", parse);
								Text.Newline();
								Text.AddOutput("You draw a surprised gasp as you feel two of the elf's lubed fingers prod at your [anusDesc]. [name] looks up uncertainly, as if asking permission to continue.", parse);
								
								//[Allow][Deny][Punish]
								var options = new Array();
								options.push({ nameStr : "Allow",
									func : function() {
										Text.Clear();
										// TODO: Increase odds of scene
										
										Text.AddOutput("[HisHer] restraint lifted by your eager nod, [name] slowly pushes [hisher] way past your sphincter, probing at your softer inner passage. Somehow knowing just what to do, the elf begins to finger-fuck you, eventually adding a third finger to the mix.", parse);
										Text.Newline();
										parse.s = player.NumCocks() > 1 ? "s" : "";
										parse.itsTheir = player.NumCocks() > 1 ? "their" : "it's";
										Text.AddOutput("Meanwhile, [heshe] isn't letting up on your [multiCockDesc]. With [hisher] free hand, [name] strokes your member[s], while sucking on [itsTheir] [cockTip][s]. You moan as you feel the elf lap at your urethra, the dual-pronged assault intensifying your pleasure.", parse);
										Text.Newline();
										Text.AddOutput("[HeShe] isn't bad at all with [hisher] fingers, rapidly pumping them in and out of your [anusDesc]. Each thrust deals a glancing blow to your prostate, rewarding [name] with a shuddering moan for [hisher] efforts.", parse);
										Text.Newline();
										Text.AddOutput("Chuckling, you point out how this is something [name] would never have thought of doing when you first met, let alone taken the initiative at it. The elf doesn't let up on [hisher] dual assault, but [hisher] brightly burning cheeks indicate that your comment hit home.", parse);
										Text.Newline();
										Text.AddOutput("Unable to withstand [name]'s anal probing for long, you are soon shaking, trying to hold back the coming flood. Noticing your plight, the elf eagerly milks you, [hisher] frenzied thrusts pushing you over the edge. Unloading wads of white into [name]'s waiting maw, you lean back, riding out the wave of your orgasm.", parse);
										if(player.NumCocks() > 1) {
											Text.Newline();
											parse.s = player.NumCocks() > 2 ? "s" : "";
											parse.notEs = player.NumCocks() > 2 ? "" : "es";
											parse.itsTheir = player.NumCocks() > 2 ? "their" : "it's";
											
											Text.AddOutput("Your other cock[s] thrash[notEs], spending [itsTheir] seed uselessly on the elf's face and hair.", parse);
										}
										Gui.NextPrompt();
									}, enabled : true,
									tooltip : Text.Parse("Somewhat surprisingly, [name] has revealed a kinkier side... why not encourage it?", parse)
								});
								options.push({ nameStr : "Deny",
									func : function() {
										// Clear stacked scene
										Gui.Callstack.pop();
										Text.Clear();
										// TODO: Decrease odds of scene
										Text.AddOutput("Shaking your head in annoyance, you rebuff [name]'s advances. You have the elf get you off with only [hisher] mouth instead. You have a hard time getting into it however, and irritably motion the elf to finish it quicker. Despite it all, you manage to get your pleasure, your cum dribbling down [name]'s throat and splattering on [hisher] [kBreastDesc].", parse);
										Text.Newline();
										Text.AddOutput("Troubled, you gather up your gear and prepare to continue your journey.", parse);
										
										Gui.NextPrompt(PartyInteraction);
										
										player.AddLustFraction(-1);
										kiakai.flags["Sexed"]++;
									}, enabled : true,
									tooltip : "You are not feeling up for something like that just now."
								});
								/* TODO: finish punish scene
								options.push({ nameStr : "Punish",
									func : function() {
										Text.Clear();
										Gui.Callstack.pop();
										Text.AddOutput("", parse);
										Text.Newline();
										Gui.NextPrompt();
									}, enabled : true,
									tooltip : Text.Parse("The nerve... you'd better teach [himher] a lesson [heshe]'s not likely to forget soon! You'll make sure [heshe] never tries this again... ", parse)
								});
								*/
								Gui.SetButtonsFromList(options);
							}
						},
						// TODO: Temp, have an adjustable variable
						function() { return 0.5; },
						function() { return kiakai.flags["Sexed"] > 20; });

						scenes.AddEnc(function() {
							if(kiakai.flags["Sexed"] > 10) {
								Text.AddOutput("The sudden tightening of your [cockDesc] gives the elf all the warning needed, and [heshe] begins to deep-throat you repeatedly, massaging you with the muscles at the back of [hisher] throat. Moaning loudly, you give [name] what [heshe] wants; a generous serving of hot spunk, delivered directly from the tap. ", parse);
								if(player.CumOutput() > 3)
									Text.AddOutput("But no amount of preparation could prepare [himher] for the size of your load, though, and when the elf has had [hisher] fill, [heshe] lets your [cockDesc] flop free, hosing [himher]self in your semen.", parse);
								else
									Text.AddOutput("When you are done, the elf cleans your [cockDesc], not wanting to let even a drop go to waste.", parse);
							}
							else {
								Text.AddOutput("Your rising climax seems to catch the poor elf oblivious, [hisher] eyes widening in shock as you feed load after load of your seed down [hisher] inexperienced throat. Trying to swallow your sticky present sends [name] into a coughing fit, depositing the rest of your semen in a sticky mess across [hisher] face and hair.", parse);
								if(player.CumOutput() > 3)
									Text.AddOutput(" By the time you are finished, the elf is practically drenched in cum.", parse);
							}
							Gui.NextPrompt();
						}, 1.0, function() { return true; });
						
						scenes.Get();
						
						// Note, put this here because of intermediate options
						Gui.Callstack.push(function() {
							Text.Clear();
							if(kiakai.flags["Sexed"] > 10)
								Text.AddOutput("You could swear that [name] is enjoying these healing sessions more than [hisher] prim demeanor lets on. The two of you gather yourselves, preparing to set out again.", parse);
							else
								Text.AddOutput("Consoling [name] and congratulating [himher] on a job well done, the two of you get your gear back on, preparing to continue your journey.", parse);
							
							Gui.NextPrompt(kiakai.Interact);
							
							player.AddLustFraction(-1);
							kiakai.flags["Sexed"]++;
						});
					}, enabled : true,
					tooltip : Text.Parse("Let [name] finish you off as best [heshe] can.", parse)
				});
				options.push({ nameStr : "Active",
					func : function() {
						Text.Clear();
						player.AddSexExp(1);
						kiakai.AddSexExp(1);
						Text.AddOutput("[name]'s [eyeColor] eyes snap open in surprise as you suddenly thrust much more of your [cockDesc] into [hisher] mouth than [heshe] was ready for.", parse);
						Text.Newline();
						
						if(kiakai.flags["Sexed"] > 10) {
							Text.AddOutput("Without missing a beat, [name] meets you thrust for thrust, [hisher] well-trained mouth wrapping around your [cockDesc]. ", parse);
							if(player.FirstCock().Size() > 75) {
								Text.AddOutput("No matter how used to sucking cock that [heshe] is though, you are far too big to fit all of your length down [hisher] throat. Not that the elf lets this discourage [himher] in any way.", parse);
							}
							else if(player.FirstCock().Size() > 50) {
								Text.AddOutput("Too big to fit in just [hisher] mouth, an audible popping noise accompanies your [cockDesc] entering [hisher] throat. You praise your companion on [hisher] skills as [hisher] lips connect with your crotch, the entirety of your [cockDesc] lodged deep inside [himher].", parse);
							}
							else {
								Text.AddOutput("The elf gives [hisher] utmost to match your pace, placing a succession of rapid kisses on your crotch as [heshe] repeatedly takes you, tip to root.", parse);
							}
						}
						else {
							Text.AddOutput("[HeShe] instinctively tries to back away, stopped by your hand holding [hisher] head in place. You make sure to give [himher] plenty of time to breathe, drinking in the conflicting emotions passing across [hisher] face as [heshe] gazes up at you, mouth stuffed to the brim with cock. Still holding [hisher] head in place with one hand, you gently begin to rock your hips, feeding the elf inch after inch of your [cockDesc]. ", parse);
							
							if(player.FirstCock().Size() > 50) {
								Text.AddOutput("Sadly, you are far too big to fit all of your length in [hisher] mouth without hurting [himher].", parse);
							}
							else {
								Text.AddOutput("Soon, you feel the touch of [hisher] lips against your crotch, every bit of your length stuffed into [hisher] mouth.", parse);
							}
						}
						
						parse.len1 = player.FirstCock().length.Get() > 20 ? " and throat" : "";
						
						Text.Newline();
						Text.AddOutput("Sighing with pleasure, you increase the rate of your thrusts. Caressed and squeezed by the moaning elf's tongue[len1], you soon feel a surge rising from [loadOrg], announcing the arrival of your climax.", parse);
						Text.Newline();
						
						Text.AddOutput("Load after load erupts from your cock, flowing deep into the elf's wide-open throat. ", parse);
						
						if(player.CumOutput() > 3)
							Text.AddOutput("[name]'s cheeks balloon as more and more of your white stuffing fills [hisher] mouth. Unable to keep up with your output, [heshe] pulls back, coughing while you spill the rest of your bountiful load all over [hisher] face.", parse);
						else
							Text.AddOutput("[name] gleefully swallows every drop.", parse);
						Text.Newline();
						if(kiakai.flags["Sexed"] > 15)
							Text.AddOutput("<i>\"That was really good, [playername],\"</i> [name] murmurs as [heshe] swallows the last of your thick cream, wearing a dreamy expression. <i>\"I... I think I have developed a taste for your...\"</i> [heshe] trail off, blushing fiercely. Chuckling, you clean up and put on your gear.", parse);
						else
							Text.AddOutput("[name] refuses to meet your eyes as the two of you clean yourselves up and put on your gear.", parse);
						
						Gui.NextPrompt(kiakai.Interact);
						
						player.AddLustFraction(-1);
						kiakai.AddLustFraction(0.2);
						kiakai.flags["Sexed"]++;
					}, enabled : true,
					tooltip : "Make the most of it."
				});
				Gui.SetButtonsFromList(options);
			}, enabled : true,
			tooltip : Text.Parse("Convince [name] to give you a blowjob.", parse)
		});
	}
	if(player.FirstVag()) {
		// EAT YOU OUT
		options.push({ nameStr : "Eat you",
			func : function() {
				Text.Clear();
				Text.AddOutput("After playing around with [name] for a while, crossing tongues and butting lips, you suggest that perhaps [heshe] would like to kiss your <i>other</i> lips instead.", parse);
				Text.Newline();
				if(kiakai.flags["Sexed"] > 10) {
					Text.AddOutput("Blushing prettily when [heshe] realizes what you are telling [himher] to do, [name] obediently sinks down between your legs, eager to fulfil your wishes. Licking [hisher] lips in anticipation, the elf leans in.", parse);
				}
				else {
					Text.AddOutput("The elf looks a bit confused until you gesture down toward your crotch pointedly.", parse);
					Text.Newline();
					Text.AddOutput("<i>\"R-really, [playername], would you like it if I...\"</i> not quite able to finish the sentence, the blushing elf meets your eyes uncertainly, lips slightly parted. Assuring [himher] that you would far more than like it, you gently guide [hisher] head between your legs.", parse);
				}
				Text.Newline();
				Text.AddOutput("You close your eyes in bliss as you feel [name] dig in, [hisher] tongue tasting the wet folds of your [vagDesc]. Urged on by your soft sighs, the elf continues to lap away at your moistness. Trying [hisher] best to please, [name]'s deft [kTongueDesc] finds your [clitDesc].", parse);
				Text.Newline();
				
				if(player.FirstVag().clitCock) {
					Text.AddOutput("After allowing [himher] to lather the length of your girl-cock, you redirect [hisher] attention to your more feminine parts, indicating that [heshe] can have a go at your cock anytime [heshe] likes, if [heshe] just asks.", parse);
				}
				else if(player.FirstCock()) {
					parse["eachIt"] = player.NumCocks() > 1 ? "each" : "it";
					parse["itThem"] = player.NumCocks() > 1 ? "them" : "it";
					Text.AddOutput("As [name] gently licks at your [clitDesc], [hisher] nose keeps bumping against your [multiCockDesc], making [itThem] impossible to ignore. [name] gives [eachIt] a thorough lathering before returning to the task at hand.", parse);
					if(player.HasBalls())
						Text.AddOutput(" As [hisher] [kTongueDesc] returns to work on your feminine parts, [name] caresses your [ballsDesc], sending shivers up your spine.", parse);
				}
				else if(kiakai.flags["Sexed"] > 15) {
					Text.AddOutput("[name] knows just what to do. Expertly, [heshe] licks and sucks at your [clitDesc], sending electrical tingles through your body. [HeShe] is getting quite good at this sort of thing!", parse);
				}
				else {
					Text.AddOutput("What [heshe] lacks in skill, [heshe] makes up for in dedication. After licking your [clitDesc] for a bit, [name] returns [hisher] attention to your wet [vagDesc], [hisher] nose occasionally butting against your button.", parse);
				}
				
				Text.Newline();
				
				var scenes = new EncounterTable();
				var defScene = function() {
					Text.AddOutput("In an effort to get better access, [name] spreads your nether lips with [hisher] nimble fingers, exposing your inner walls. [HisHer] [kTongueDesc] thoroughly explores each part, before penetrating deeper into your folds, delving into your tunnel. [HisHer] flexible organ works you into a frenzy, not going as deep as a cock fucking you, but constantly flexing and probing you in different ways.", parse);
					Text.Newline();
					Text.AddOutput("Before long, you are not the only one moaning, as the smell and taste of your sex slowly drives the elf over the edge. [HeShe] withdraws one of [hisher] hands from your labia, reaching down between [hisher] legs to see to [hisher] own urges.", parse);
					Text.Newline();
					Text.AddOutput("The two of you reach your peaks at the same time, and you generously provide the horny elf with more of the juices that [heshe] evidently likes so much.", parse);
					Text.Newline();
					if(player.FirstCock()) {
						Text.AddOutput("While you are at it, you take the opportunity to thoroughly drench the elf in your sperm, your [multiCockDesc] shooting strand after strand of sticky white fluids that land on [name]'s face and hair.", parse);
						Text.Newline();
					}
					Text.AddOutput("Still slightly dazed from [hisher] own orgasm, [name] dutifully cleans you up.", parse);
					
					kiakai.AddLustFraction(-1);
					Gui.NextPrompt();
				};
				scenes.AddEnc(defScene, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.AddOutput("Switching tactics, the elf withdraws [hisher] [kTongueDesc], leaving your folds open for assault from [hisher] deft fingers. Being very careful and gentle, [name] inserts two fingers into your slippery [vagDesc], probing your depths. While [hisher] fingers are busy, [name] focuses [hisher] oral attention on your [clitDesc], proving to be an excellent multitasker.", parse);
					Text.Newline();
					
					if(kiakai.flags["Sexed"] > 20 /* && TODO anal allowed */) {
						Text.AddOutput("Feeling particularly adventurous, the fingers on [name]'s other hand travel slightly downwards, forgoing your [vagDesc] and insistently prodding at your [anusDesc]. Suddenly realising what [heshe] is doing, the elf stops in place, gazing up at you for approval through [hisher] thick lashes.", parse);
	
						//[Allow][Deny][Punish]
						var options = new Array();
						options.push({ nameStr : "Allow",
							func : function() {
								Text.Clear();
								// TODO: Increase odds of scene
								Text.AddOutput("Smiling broadly, you nod slowly, encouraging the elf to continue. [HisHer] restrictions lifted, [name] insistently presses two fingers into your [anusDesc], probing your backdoor while [heshe] returns to lapping at your [vagDesc].", parse);
								Text.Newline();
								Text.AddOutput("Chuckling, you point out to the elf how this is something [heshe] would never have thought of doing when you first met, let alone taken the initiative at it. [name] doesn't let up on [hisher] dual assault of your holes, but [hisher] brightly burning cheeks indicate that your comment hit home.", parse);
								Text.Newline();
								Text.AddOutput("Reclining comfortably, you allow the elf free reign", parse);
								if(player.FirstCock())
									Text.AddOutput(", idly stroking your [multiCockDesc]", parse);
								parse["c"] = player.FirstCock() ? " and prodding at your sensitive prostate" : "";
								Text.AddOutput(". [name]'s slender fingers reach deep inside you, stretching your sphincter[c]. Edged on by your increasingly erratic moans, [heshe] adds another finger to [hisher] pounding, spreading you even further.", parse);
								Text.Newline();
								Text.AddOutput("Before long, you groan in ecstasy as the elf's multi-pronged attentions bear fruit, drenching [hisher] pretty face in your girly juices.", parse);
								if(player.FirstCock()) {
									parse["notS"] = player.NumCocks() == 1 ? "s" : "";
									Text.AddOutput("Your [multiCockDesc] erupt[notS] in your hand, some of the sticky white substance splattering over the elf servicing you, and some landing on your stomach.", parse);
								}
								Text.Newline();
								Text.AddOutput("When you have finished convulsing, [name] pulls out [hisher] fingers. [HeShe] shyly asks if you liked it. In response, you pull [himher] in for a deep kiss.", parse);
								Gui.NextPrompt();
							}, enabled : true,
							tooltip : Text.Parse("Somewhat surprisingly, [name] has revealed a kinkier side... why not encourage it?", parse)
						});
						options.push({ nameStr : "Deny",
							func : function() {
								Text.Clear();
								// TODO: Decrease odds of scene
								Text.AddOutput("Slightly annoyed, you shake your head. [name] hastily withdraws [hisher] fingers, determined to service you in some other way.", parse);
								Text.Newline();
								defScene();
							}, enabled : true,
							tooltip : "You are not feeling up for something like that just now."
						});
						/* TODO: Finish scene
						options.push({ nameStr : "Punish",
							func : function() {
								Text.Clear();
								Text.AddOutput("", parse);
								Text.Newline();
								Gui.NextPrompt();
							}, enabled : true,
							tooltip : Text.Parse("The nerve... you'd better teach [himher] a lesson [heshe]'s not likely to forget soon! You'll make sure [heshe] never tries this again...", parse)
						});
						*/
						Gui.SetButtonsFromList(options);
					}
					// Regular fingering
					else {
						Text.AddOutput("Growing bolder by the minute, the horny elf adds another finger to [hisher] excavation team, pressing each of them knuckle-deep inside your tunnel. Your trembling [vagDesc] is gushing with girly juices, and lewd wet sounds come out from you at each thrust of [hisher] fingers.", parse);
						Text.Newline();
						Text.AddOutput("Finally, with a shuddering moan, you come. Your [legsDesc] squirm as you shake uncontrollably, gushing sweet nectar all around your lover's fingers.", parse);
						if(player.FirstCock()) {
							parse["s"] = player.NumCocks() > 1 ? "" : "s";
							Text.AddOutput(" The fluids dripping from your [vagDesc] are not the only things released by your orgasm though, as your [multiCockDesc] cover[s] the elf with thick white strands.", parse);
						}
						Text.Newline();
						Text.AddOutput("[name] withdraws [hisher] drenched fingers, licking each clean of your sticky juices. Once finished, the elf leans in to perform the same service for your wet sex, lapping up every drop.", parse);
						Gui.NextPrompt();
					}
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					parse["s"] = player.NumCocks() > 1 ? "s" : "";
					parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
					Text.AddOutput("Without letting up [hisher] assault on your nether lips, [name] gently tugs on your [multiCockDesc], determined to pleasure your male endowment[s] as well. [HisHer] deft fingers caress your length[s], playfully tracing the veins on the pulsing member[s].", parse);
					Text.Newline();
					Text.AddOutput("More than pleased with the dual attention you are given, you decide to join in, and grab at[oneof] your [multiCockDesc], heartily jerking yourself off while the elf administers [hisher] healing skills on your [vagDesc]. Before long, your trembling [legsDesc] announce your approaching orgasm.", parse);
					Text.Newline();
					if(kiakai.flags["Sexed"] > 15 && Math.random() > 0.5) {
						Text.AddOutput("Breathing heavily, [name] abandons your [vagDesc] and eagerly shoves the tip of [one of ]your [multiCockDesc] into [hisher] mouth. While sucking you off, the elf begins pumping two of [hisher] fingers into your clenching [vagDesc], trying to milk you as quickly as possible.", parse);
						Text.Newline();
						Text.AddOutput("You hardly want to deprive the horny elf of [hisher] meal - not that you can hold back for very long under [hisher] fervent fingering in any case. Groaning, you unleash your load down [name]'s waiting hatch, the elf swallowing as quickly as [heshe] can, trying to keep up with you.", parse);
						Text.Newline();
						
						if(player.CumOutput() > 3) {
							Text.AddOutput("Abandoning all efforts to try to swallow all of it for fear of drowning, [name] instead frees your [cockTip] from [hisher] mouth, letting the rest of your load cover [hisher] face, hair, and clothes", parse);
							parse["count"] = player.NumCocks() == 2 ? "your other" : "the rest of your";
							if(player.NumCocks() > 1)
								Text.AddOutput(", where it joins the eruptions from [count] untended cock[s].", parse);
							else
								Text.AddOutput(".", parse);
							Text.Newline();
						}
						else if(player.NumCocks() > 1) {
							parse["count"] = player.NumCocks() == 2 ? "the other one is" : "the rest are";
							Text.AddOutput("Although [heshe] manages to gulp down the entire load from one of your [multiCockDesc], [count] left unattended, splattering the elf's face, hair, and clothes in your warm cum.", parse);
							Text.Newline();
						}
						Text.AddOutput("Between your legs, your [vagDesc] has clamped down on [name]'s fingers, coating them in slick juices. When the torrent of your orgasm has quieted down, the elf methodically licks the liquid from [hisher] fingers, before providing your [vagDesc] with the same service.", parse);
					}
					else if(kiakai.flags["Sexed"] > 15) {
						Text.AddOutput("Burying [hisher] tongue in your [vagDesc], [hisher] nose bumping up against your [clitDesc], [name] insistently laps at your inner tunnel, coaxing an orgasm from your burning body.", parse);
						Text.Newline();
						Text.AddOutput("Moaning loudly, you unleash a gushing torrent of girly juices into the elf's waiting mouth, simultaneously letting your male endowment[s] shower [himher] with sticky spunk.", parse);
						Text.Newline();
						Text.AddOutput("Sighing pleasurably, [name] finishes [hisher] meal, unconcerned with the strings of sperm dripping into [hisher] hair.", parse);
					}
					else {
						parse["isAre"] = player.NumCocks() > 1 ? "are" : "is";
						Text.AddOutput("Suddenly overwhelmed by all the options in front of [himher], [name] panics slightly. Noticing that your [multiCockDesc] [isAre] about to erupt, [heshe] ineffectually tries to hold back the flow with both hands. This only succeeds in pushing you over the edge, staining [hisher] hands in your semen.", parse);
						Text.Newline();
						Text.AddOutput("Slightly flustered, [name] tries to focus on cleaning your [vagDesc], trying to ignore the white strands dripping down your cock[s], landing on [hisher] nose.", parse);
					}
					
					Gui.NextPrompt();
				}, 1.0, function() { return player.FirstCock(); });
				scenes.AddEnc(function() {
					Text.AddOutput("By this time, [name] knows just what to do to get you off. Electric shocks run through your tingling labia as [heshe] administers a spark of healing energy with the tip of [hisher] [kTongueDesc]. The sparks quickly home in on the most prominent feature of your feminine anatomy, your [clitDesc].", parse);
					Text.Newline();
					Text.AddOutput("The elf isn't even touching you anymore, [heshe] is just letting [hisher] healing power do the work. [HeShe] lets [hisher] [kTongueDesc] hover a hairsbreadth away from your [vagDesc], a tiny beam of refreshing energy bridging the gap between the two of you.", parse);
					Text.Newline();
					Text.AddOutput("It would be a shame to let [himher] get you off without doing any work, but you have to act quickly before [heshe] overwhelms you. Gently but firmly, you grab hold of the back of [hisher] head, pressing [hisher] face into your crotch.", parse);
					Text.Newline();
					Text.AddOutput("For a moment, the sheer surprise makes [name] lose control of [hisher] powers, sending a jolt racing through your vaginal canal and up along your spine. Your sensory systems overloading, you let out a desperate moan before letting your orgasm take you and wash over your elvish lover.", parse);
					Text.Newline();
					
					if(player.FirstCock()) {
						parse["s"] = player.NumCocks() == 1 ? "s" : "";
						Text.AddOutput("Your [multiCockDesc] erupt[s], mattering [name]'s hair and back with sticky fluids.", parse);
						if(player.CumOutput() > 3)
							Text.AddOutput(" When you finish, it looks like the elf's hair is a natural white rather than silver. A very sticky and drippy natural white.", parse);
						Text.Newline();
					}
					
					Text.AddOutput("Resting in the afterglow, you caress your elvish lover's cheek fondly.", parse);
					Gui.NextPrompt();
				}, 1.0, function() { return (kiakai.flags["Sexed"] > 15); });
				
				scenes.Get();
				
				Gui.Callstack.push(function() {
					Text.Clear();
					if(kiakai.flags["Sexed"] > 10) {
						Text.AddOutput("<i>\"You always taste so good, [playername],\"</i> [name] tells you dreamily, running [hisher] tongue over [hisher] lips. The two of you start cleaning up and re-equipping your gear. <i>\"Lately, I've found myself wanting to drink from you more and more,\"</i> [heshe] admits, blushing cutely.", parse);
					}
					else if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
						Text.AddOutput("<i>\"Y-you really seem to like making me do things like that,\"</i> [name] accuses you, pouting prettily, as the two of you clean up and re-equip your gear. <i>\"I wish you wouldn't just make these decisions on your own! S-still, t-that was... not unpleasant,\"</i> [heshe] admits, blushing furiously.", parse);
					}
					else {
						parse["aAnother"] = kiakai.FirstVag() ? "another" : "a";
						Text.AddOutput("<i>\"T-that was... not unpleasant,\"</i> [name] confesses as the two of you clean up and re-equip your gear. <i>\"Before meeting with you, I never knew what [aAnother] woman tasted like...\"</i> [HeShe] shakes [hisher] head, blushing furiously.", parse);
					}
					
					player.AddLustFraction(-1);
					kiakai.AddLustFraction(0.1);
					kiakai.flags["Sexed"]++;
					Gui.NextPrompt(kiakai.Interact);
				});
			}, enabled : true,
			tooltip : Text.Parse("Convince [name] to service your feminine parts.", parse)
		});
	}
	
	options.push({ nameStr : kiakai.name,
		func : Scenes.Kiakai.PleasureElf, enabled : true,
		tooltip : Text.Parse("Return the favour by getting [name] off.", parse)
	});
	
	options.push({ nameStr : "Cuddle",
		func : function() {
			Text.Clear();
			
			Text.AddOutput("Rather than take advantage of the nervous elf, you wrap your arms around [himher]", parse);
			if(player.FirstBreastRow().size.Get() > 3)
				Text.AddOutput(", your [breastDesc] pressing against [hisher] back", parse);
			Text.AddOutput(". Your hands, trailing down [name]'s body, brush lightly over [hisher] [kNipsDesc], eliciting a surprised exhalation from the elf, before settling on [hisher] stomach. You find the nearness of the elf comforting. The warmth of your bodies intermingle as you lie there, ", parse);
			if(Math.abs(player.LustLevel() - kiakai.LustLevel()) < 0.15)
				Text.AddOutput("your breaths coming as one.", parse);
			else if(player.LustLevel() > kiakai.LustLevel())
				Text.AddOutput("your rapid breathing a counterpoint to [hisher] slower breaths.", parse);
			else
				Text.AddOutput("[hisher] rapid breathing a counterpoint to your slower breaths.", parse);
			Text.Newline();
			Text.AddOutput("After enjoying each others' closeness for a while, you regretfully decide that it's time to get going, and tell as much to the elf, reluctantly disentangling yourself from [himher]. As the two of you stand up and get dressed, you notice [name] glancing at you from time to time, a bright blush on [hisher] cheeks.", parse);
			
			/* Old scene
			Text.AddOutput("Rather than taking advantage of the nervous elf, you cuddle up against [hisher] back", parse);
			if(player.FirstBreastRow().size.Get() > 3)
				Text.AddOutput(", your [breastDesc] pressed between you", parse);
			Text.AddOutput(". After enjoying the warmth of each others' bodies for a while, you nudge [name], suggesting that you get going.", parse);
			Text.Newline();
			Text.AddOutput("As you get dressed, the elf almost looks a bit regretful.", parse);
			*/
			
			player.AddLustFraction(0.1);
			kiakai.AddLustFraction(0.1);
			Gui.NextPrompt(kiakai.Interact);
		}, enabled : true,
		tooltip : Text.Parse("[name] seems rather nervous, perhaps it'd be best to just cuddle for now. Plenty time for other entertainment later.", parse)
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Kiakai.PleasureElf = function() {
	
	var parse = {
		playername : player.name,
		name    : kiakai.name,
		heshe   : kiakai.heshe(),
		HeShe   : kiakai.HeShe(),
		himher  : kiakai.himher(),
		hisher  : kiakai.hisher(),
		HisHer  : kiakai.HisHer(),
		hishers : kiakai.hishers(),
		heatStirring : player.FirstCock() ? "stirring" : "heat",
		breastDesc   : function() { return player.FirstBreastRow().Short(); },
		nipsDesc     : function() { return player.FirstBreastRow().NipsShort(); },
		cockDesc     : function() { return player.FirstCock().Short(); },
		multiCockDesc: function() { return player.MultiCockDesc(); },
		cockTip      : function() { return player.FirstCock().TipShort(); },
		ballsDesc    : function() { return player.BallsDesc(); },
		anusDesc     : function() { return player.Butt().AnalShort(); },
		buttDesc     : function() { return player.Butt().Short(); },
		vagDesc      : function() { return player.FirstVag().Short(); },
		clitDesc     : function() { return player.FirstVag().ClitShort(); },
		tongueDesc   : function() { return player.TongueDesc(); },
		legsDesc     : function() { return player.LegsDesc(); },
		armor        : function() { return kiakai.ArmorDesc(); },
		hairDesc     : function() { return kiakai.Hair().Short(); },
		kCockDesc    : function() { return kiakai.FirstCock().Short(); },
		kCockTip     : function() { return kiakai.FirstCock().TipShort(); },
		kMultiCockDesc : function() { return kiakai.MultiCockDesc(); },
		kVagDesc     : function() { return kiakai.FirstVag().Short(); },
		kClitDesc    : function() { return kiakai.FirstVag().ClitShort(); },
		kBallsDesc   : function() { return kiakai.BallsDesc(); },
		kButtDesc    : function() { return kiakai.Butt().Short(); },
		kAnusDesc    : function() { return kiakai.Butt().AnalShort(); },
		kHairDesc    : function() { return kiakai.Hair().Short(); },
		kBreastDesc  : function() { return kiakai.FirstBreastRow().Short(); },
		kNipsDesc    : function() { return kiakai.FirstBreastRow().NipsShort(); },
		kTongueDesc  : function() { return kiakai.TongueDesc(); },
		priest       : kiakai.flags["InitialGender"] == Gender.male ? "priest" : "priestess",
		eyeColor     : Color.Desc(kiakai.Eyes().color)
	};
	
	parse["kGenDesc"] = kiakai.FirstCock() ? function() { return kiakai.MultiCockDesc(); } :
					kiakai.FirstVag() ? function() { return kiakai.FirstVag().Short(); } :
					"featureless crotch";
	parse["stutterName"] = player.name[0] + "-" + player.name;
	
	Text.Clear();
	Text.AddOutput("Snuggling up close, you whisper in the elf's ear that [heshe] is doing a <i>really</i> good job, and deserves a reward. To accentuate just what you mean, you trace one hand down [hisher] body. Intentionally avoiding [hisher] crotch, you caress the inside of [hisher] thigh. [name] whimpers softly, [hisher] breath coming faster.", parse);
	Text.Newline();
	
	if(kiakai.flags["Sexed"] < 10)
		Text.AddOutput("<i>\"W-what do you mean, [playername], were you not hurt?\"</i> [heshe] huffs, trembling slightly under your touch.", parse);
	else
		Text.AddOutput("<i>\"Y-you are not hurt at all, you just want to grope me!\"</i> [name] huffs accusingly. [HisHer] actions clash with [hisher] words though, as the elf slightly parts [hisher] legs, allowing you easier access.", parse);
	Text.Newline();
	
	var options = new Array();
	
	if(kiakai.FirstCock()) {
		Text.AddOutput("Without you even touching it, [name]'s [kCockDesc] springs to attention, stiff in anticipation. You take your time teasing the elf, letting your hand trail up and down [hisher] thigh, circle around [hisher] crotch and proceed down the other leg.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"P-please? [playername]?\"</i> [name] begs you in a small voice. Please what? [HisHer] hand slowly strays toward the throbbing member, but you swipe it aside, preventing [himher] from getting [himher]self off.", parse);
		if(kiakai.HasBalls())
			Text.AddOutput(" You let your hand come around, lightly cupping the elf's [kBallsDesc].", parse);
		Text.Newline();
		Text.AddOutput("<i>\"I cannot take it anymore! Please, w-would you... touch it?\"</i>", parse);
		
		//[Handjob][Blowjob]
		options.push({ nameStr : "Handjob",
			func : function() {
				Text.Clear();
				
				parse["s"] = kiakai.FirstCock().length.Get() >= 20 ? "s" : "";
				
				Text.AddOutput("You delicately grasp [name]'s [kCockDesc].", parse);
				if(kiakai.FirstCock().length.Get() >= 20)
					Text.AddOutput(" By now, it has grown so large that you can use two hands to stroke [hisher] length.", parse);
				else if(kiakai.HasBalls())
					Text.AddOutput(" Your free hand continues to play with [hisher] [kBallsDesc], massaging each teste between your fingers.", parse);
				else
					Text.AddOutput(" Your free hand keeps on exploring [name]'s body, never staying in one place for long.", parse);
				Text.Newline();
				Text.AddOutput("The elf gasps as you slowly begin to jerk [hisher] [kCockDesc], massaging it from tip to stem.", parse);
				Text.Newline();
				Text.AddOutput("You continue pumping [himher] this way for several minutes, the elf's twitching growing increasingly erratic. Sensing that [hisher] orgasm is close at hand, you stop, withdrawing you hand[s].", parse);
				Text.Newline();
				Text.AddOutput("<i>\"A-are you going to make me beg for it?\"</i> [name] pants, blushing furiously when you nod, smiling. <i>\"F-fine! Please?\"</i> Please what? <i>\"Please, continue doing that!\"</i> Doing what? [name] moans in frustration. <i>\"Please touch my p-penis, it feels good.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("Taking pity on the elf, you grab hold of [hisher] [kCockDesc] again, and this time you don't hold back. [name]'s eyes are closed, and [hisher] hips make small thrusting motions as you rapidly pump [hisher] member.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"C-coming!\"</i> the elf squeaks. True to [hisher] word, [name]'s [kCockDesc] twitches in your hand[s], spurting elven cockbatter onto [hisher] own stomach. You give [himher] a kiss on the lips before cleaning up. Looks like the elf will need a few minutes to recover before you can set out again.", parse);
				Text.Newline();
				
				player.AddSexExp(1);
				kiakai.AddSexExp(1);
				kiakai.subDom.IncreaseStat(0, 1);
	
				Scenes.Kiakai.PleasureElfEnd();
			}, enabled : true,
			tooltip : "Use your hands."
		});
		options.push({ nameStr : "Blowjob",
			func : function() {
				Text.Clear();
				Text.AddOutput("You intend to do far more than touch. To get [himher] started, you grab hold of [name]'s [kCockDesc] and give it a few strokes. ", parse);
				if(kiakai.flags["Sexed"] < 10)
					Text.AddOutput("The elf whimpers as you squeeze [hisher] rock-hard member tightly, not used to such rough treatment.", parse);
				else
					Text.AddOutput("The elf is panting in anticipation as you squeeze [hisher] rock-hard member, a bead of precum forming on the [kCockTip].", parse);
				Text.Newline();
				Text.AddOutput("Shifting around, you lean down to inspect [name]'s cock up close. Aroused even further by your hot breath brushing against it, it twitches urgently. It's so easy to get the elf horny it's almost comical.", parse);
				Text.Newline();
				Text.AddOutput("Well, if [heshe] likes your touch so much, [heshe]'s bound to like this...", parse);
				Text.Newline();
				Text.AddOutput("[name] cries out as your lips close around the [kCockTip] of [hisher] cock, your [tongueDesc] lapping away at it avidly. Your taste buds are assaulted by salty drops of pre landing on your [tongueDesc], dispensed from the elf's stiff member.", parse);
				Text.Newline();
				Text.AddOutput("That seemed to have a nice effect. How about stepping it up a notch?", parse);
				Text.Newline();
				Text.AddOutput("Slowly, you inch [name]'s [kCockDesc] into your mouth, coating the moaning elf's length in your slick saliva. Letting your [tongueDesc] stroke the stem playfully, you start bobbing your head up and down, eagerly swallowing your companion's trembling dick.", parse);
				Text.Newline();
				if(kiakai.flags["Sexed"] < 10)
					Text.AddOutput("<i>\"[stutterName]! It... ahh! Ngh... feels... good!\"</i> [name] moans, lost in bliss.", parse);
				if(kiakai.flags["Sexed"] < 20)
					Text.AddOutput("<i>\"Mmm... so good...\"</i> [name] moans, closing [hisher] eyes in pleasure.", parse);
				else // >20
					Text.AddOutput("<i>\"Y-yes!\"</i> [name] sighs. A bit to your surprise, the elf starts to make small thrusts with [hisher] hips, moving to meet you.", parse);
				Text.Newline();
				Text.AddOutput("Time to get the horny elf off. ", parse);
				if(kiakai.FirstCock().length.Get() > 35) {
					Text.AddOutput("It's almost unbelievable how large [name]'s member has grown{, though it's still small in comparison to your own}{, rivalling your own in size}{, easily dwarfing your own}. Much too big for you to fully please, sadly enough. Still, you take as much of the [kCockDesc] in as you can, eyes watering slightly as you force it down your burning throat.", parse);
					Text.Newline();
					Text.AddOutput("You let your hands work on the exposed parts of [name]'s shaft, wishing you could fully take [himher] into your mouth. The elf seems to be happy either way, panting desperately under your ministrations.", parse);
				}
				else if(kiakai.FirstCock().length.Get() > 20) {
					Text.AddOutput("With some difficulty, you manage to push all of [name]'s [kCockDesc] down your throat, managing to press a trembling kiss on the elf's crotch before you are forced to surface for air.", parse);
					Text.Newline();
					Text.AddOutput("Time and again you let your lips rest against [name], your throat beginning to burn slightly after the repeated penetration.", parse);
				}
				else {
					Text.AddOutput("A cock of this size is no problem for you to devour whole. You lean forward, planting kiss after kiss on [name]'s crotch, letting your [tongueDesc] work on every part of [hisher] [kCockDesc]. Alternating your focus between licking on the [kCockTip] and taking [himher] to the root, you make sure to give [name] as good a time as you are able.", parse);
				}
				Text.Newline();
				Text.AddOutput("<i>\"B-by Aria, [playername], that feels amazing!\"</i> the elf moans. You surface for a moment, a strand of saliva still connecting your [tongueDesc] with [hisher] [kCockDesc]. Flushed and panting, you manage to express that your diligent healer deserves no less, before returning to the task at hand.", parse);
				Text.Newline();
				parse["mouthThroat"] = (kiakai.FirstCock().length.Get() > 15) ? "throat" : "mouth";
				Text.AddOutput("[name] is in heaven, resting on [hisher] back, [hisher] [kCockDesc] buried deep in your [mouthThroat]. You catch fragments of what sounds like a jumbled prayer, delivered by the elf in a breathless whisper.", parse);
				Text.Newline();
				if(kiakai.FirstVag()) {
					Text.AddOutput("Not wanting to let [hisher] other genitalia go unrewarded, you push two fingers into [name]'s [kVagDesc], immediately soaking the digits in the elf's juices.", parse);
					Text.Newline();
				}
				else if(kiakai.HasBalls()) {
					Text.AddOutput("You cup [name]'s [kBallsDesc] in your hand, fondling and squeezing each testicle gently, trying to coax their load from them.", parse);
					Text.Newline();
				}
				Text.AddOutput("[name]'s orgasm arrives accompanied by a wordless cry from the delirious elf. Clutching [hisher] legs together convulsively, [heshe] unintentionally traps your head in place while [heshe] unloads down your throat.", parse);
				Text.Newline();
				if(kiakai.strength.Get() > player.strength.Get()) {
					Text.AddOutput("Try as you might, you can't pry [hisher] legs apart, and are forced to meekly receive all of the elf's load.", parse);
					if(kiakai.CumOutput() > 3)
						Text.AddOutput(" You begin to get slightly worried as you can feel your stomach bulging slightly under the sheer amount of semen being pumped down your throat. Just how much cum can [name] produce?!", parse);
					Text.Newline();
					Text.AddOutput("Shuddering, [name] finally lets go of [hisher] vice-like grip on you. [HeShe] looks concerned as you cough and splutter, inquiring if you are alright. You manage to nod that you are fine.", parse);
				}
				else {
					Text.AddOutput("Prying [hisher] legs apart by force, you surface in time to receive the last spurts of the elf's seed on your face.", parse);
					if(kiakai.CumOutput() > 3)
						Text.AddOutput(" Even that much is enough to drench you thoroughly with the virile elf's spunk, as you reflexively cough up the excess of [hisher] climax.", parse);
				}
				Text.Newline();
				if(kiakai.flags["Sexed"] < 10)
					Text.AddOutput("<i>\"I... never knew it would feel like this,\"</i> [name] moans happily.", parse);
				else if(kiakai.flags["Sexed"] < 20)
					Text.AddOutput("<i>\"M-my cock... t-thank you, [playername],\"</i> [name] sighs contentedly.", parse);
				else if(player.FirstCock())
					Text.AddOutput("<i>\"That was great, [playername],\"</i> [name] murmurs, <i>\"I wish I could do the same for you...\"</i>", parse);
				else
					Text.AddOutput("<i>\"You are amazing, [playername],\"</i> [name] sighs contentedly.", parse);
				Text.Newline();
				
				player.AddSexExp(2);
				kiakai.AddSexExp(2);
				kiakai.subDom.IncreaseStat(10, 1);
	
				Scenes.Kiakai.PleasureElfEnd();
			}, enabled : true,
			tooltip : Text.Parse("Pleasure [himher] orally.", parse)
		});
	}
	if(kiakai.FirstVag()) {
		
		Text.AddOutput("[name] is getting worked up, [hisher] [kVagDesc] already moist with juices. Teasing the elf, you caress the sensitive skin between [hisher] legs, trailing closer but never touching. [HeShe] moans in frustration.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"C-can you touch it?\"</i> [heshe] pleads with you. <i>\"This tension, it is driving me crazy!\"</i> You smile as [name] finally acknowledges [hisher] desire. [HeShe] surely deserves a treat...", parse);
		
		//[Frig][Eat out]
		options.push({ nameStr : "Frig",
			func : function() {
				Text.Clear();
				Text.AddOutput("Humoring the horny elf, you drag your fingers across [hisher] lower lips, giving [hisher] [kClitDesc] a light flick before spreading [hisher] labia with both hands. Agonizingly slowly, you push two fingers inside [name]'s wet [kVagDesc], probing deeply into [hisher] slick tunnel.", parse);
				Text.Newline();
				parse["tinyOversized"] = kiakai.FirstVag().clitLength.Get() > 2 ? "oversized" : "tiny";
				Text.AddOutput("<i>\"Mmm... ah!\"</i> The elf's simpering moan turns into a shrill yelp, incited by your other hand pinching [hisher] [kClitDesc]. Your treatment of the [tinyOversized] nub sends electric shocks up [name]'s spine, and coats your already slick fingers in even more girly juices. Stepping up your fingering, you start pumping [name]'s [kVagDesc], adding another digit after a while. With two fingers, you spread [hisher] passage wide, using the third one to rub against the roof of the tunnel.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"B-by Aria, that feels good, [playername]!\"</i> [name] moans softly, urging you on. [HeShe] even starts to grind [hisher] hips against your hand, meeting your thrusts, allowing you to sink your fingers even deeper into [hisher] [kVagDesc]. Teasingly, you ask [himher] just what Aria would think of this, and having her name invoked in such a fashion. You are rewarded with a bright blush from the elf, your remark clearly hitting home. Whether or not [heshe] really regrets [hisher] statement is unclear as [heshe] keeps moving [hisher] hips, biting [hisher] lips so as to not utter more blasphemies.", parse);
				Text.Newline();
				Text.AddOutput("It isn't long before your hands bring the elf to a shuddering orgasm, [hisher] tight walls clamping down on you, soaking your digits in [hisher] juices. Smiling, you pull out of [himher], giving your fingers a lick before presenting your hand to the elf, allowing [himher] to clean you. [name] blushes as [heshe] tastes [hisher] own girl-cum, but nonetheless cleans your hand meticulously.", parse);
				Text.Newline();
				
				player.AddSexExp(1);
				kiakai.AddSexExp(1);
				kiakai.subDom.IncreaseStat(0, 1);
	
				Scenes.Kiakai.PleasureElfEnd();
			}, enabled : true,
			tooltip : Text.Parse("Use your fingers to get [name] off.", parse)
		});
		options.push({ nameStr : "Eat out",
			func : function() {
				Text.Clear();
				Text.AddOutput("Well, since [heshe] is asking so nicely...", parse);
				Text.Newline();
				Text.AddOutput("You shuffle around, letting your mouth hover a mere finger's width from [name]'s wet slit as you make yourself comfortable. Your hot breath near [hisher] most private parts give the elf a glimmer of what is to come, and [heshe] shivers in anticipation. A drop of saliva connects your [tongueDesc], extending curiously from your open mouth, with [hisher] [kVagDesc].", parse);
				Text.Newline();
				Text.AddOutput("[name] whimpers quietly as you place a kiss on [hisher] exposed nether lips; the first of many to come. [name]'s sweet taste teases your tastebuds, as if imploring you to dig in, to allow your [tongueDesc] to ravage and penetrate the innocent elf to [hisher] very core. The elf in question doesn't seem to mind, [hisher] whimper turning to a moan as your second kiss linger on [hisher] [kVagDesc], your [tongueDesc] teasing the entrance.", parse);
				Text.Newline();
				Text.AddOutput("Leaning back, you admire [name]'s exposed pink flower, gently spread by your fingers. The opening of [hisher] passage is glistening wetly, eagerly awaiting your probing tongue. You give [himher] another long lick, your nose bumping up against the elf's sensitive [kClitDesc].", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Mm... [playername]...\"</i> [name] sighs contentedly, one hand idly caressing [hisher] [kBreastDesc].", parse);
				Text.Newline();
				Text.AddOutput("Done with foreplay, you let your [tongueDesc] plunge into [name], eliciting a loud yelp from the unprepared elf. As you thrust deeply into [hisher] [kVagDesc], [name] offers cute, encouraging moans, wordlessly egging you on.", parse);
				Text.Newline();
				if(player.Mouth().tongueLength.Get() > 15) {
					Text.AddOutput("Your [tongueDesc] was made for this sort of thing. The sheer length of your prehensile appendage allows you to penetrate as deep as any cock, violating [hisher] most private and sacred shrine.", parse);
					Text.Newline();
					Text.AddOutput("[name] is constantly gasping for air, getting way more than [heshe] bargained for. [HisHer] eyelids flutter rapidly, gaze clouded with pleasure.", parse);
				}
				else
				{
					Text.AddOutput("Lapping away at the buffet laid out before you, you allow your [tongueDesc] to play across the lips of [hisher] labia, and taste the deeper reaches of [hisher] folds.", parse);
				}
				Text.Newline();
				Text.AddOutput("[name] cannot take your ministrations for long, [hisher] legs twitching slightly as [heshe] lets [himher]self be overcome by lust. The elf cries out, [hisher] [kVagDesc] clamping down tight around your [tongueDesc], as wave after wave of [hisher] orgasm rolls over you. Your taste buds are assaulted by [hisher] sweet overflowing juices, the excess dripping down your chin.", parse);
				Text.Newline();
				Text.AddOutput("Licking your lips, you withdraw from the trembling elf, a satisfied smirk on your face.", parse);
				
				player.AddSexExp(2);
				kiakai.AddSexExp(2);
				kiakai.subDom.IncreaseStat(10, 1);
	
				Scenes.Kiakai.PleasureElfEnd();
			}, enabled : true,
			tooltip : Text.Parse("Pleasure [himher] orally.", parse)
		});
	}
	
	//[Ass][Denial]
	options.push({ nameStr : "Ass",
		func : function() {
			Text.Clear();
			Text.AddOutput("Touch it? You have some much more interesting ideas in mind. You push [name] down on [hisher] back, grabbing the elf by [hisher] knees, and pushing [hisher] legs up toward [hisher] head. Sweetly, you ask [himher] to hold them for you, and not move from that position. The elf complies, blushing brightly at [hisher] compromising position.", parse);
			Text.Newline();
			Text.AddOutput("Back arched awkwardly, [name]'s legs tremble slightly from the strain, [hisher] butt thrust into the air, cheeks spread wide. Taking pity on [himher], you move in close, allowing [himher] to rest [hisher] lower back against your abdomen.", parse);
			Text.Newline();
			Text.AddOutput("Sighing in relief, [name] puts [hisher] weight on you", parse);
			if(player.FirstCock())
				Text.AddOutput(", blushing slightly as [heshe] feels your [multiCockDesc] push against [hisher] back", parse);
			Text.AddOutput(". [HisHer] expression turns confused, then slightly worried, as you begin to suck sensually on each of your fingers, making sure that [heshe] sees it.", parse);
			Text.Newline();
			
			if(kiakai.flags["AnalExp"] < 5) {
				Text.AddOutput("<i>\"W-what are you doing, [playername]?\"</i> [name] looks at you, bewildered. You smile mischievously, letting your lubricated fingers prod at [hisher] [kAnusDesc]. What does [heshe] <i>think</i> you are doing?", parse);
				Text.Newline();
				Text.AddOutput("Understanding and fear dawn slowly on the elf. <i>\"B-but... you cannot!\"</i> You certainly can.", parse);
			}
			else if(kiakai.flags["AnalExp"] < 10) {
				Text.AddOutput("<i>\"P-please, [playername],\"</i> [name] pleads, begging you to reconsider as you eye [hisher] [kAnusDesc], flexing your fingers experimentally. No matter what the elf says, you notice that [heshe] doesn't resist you in the slightest, even going as far as to take a firmer grip of [hisher] calves, spreading [hisher] cheeks slightly wider.", parse);
			}
			else if(kiakai.flags["AnalExp"] < 20) {
				Text.AddOutput("<i>\"O-okay,\"</i> [name] mumbles nervously, watching your preparations with conflicting emotions playing out on [hisher] face. When you experimentally prod at [hisher] [kAnusDesc], the elf blushes, but parts [hisher] legs slightly more, allowing you easier access.", parse);
			}
			else { // > 20
				Text.AddOutput("<i>\"M-make me feel good,\"</i> [name] begs you, willingly spreading [hisher] legs farther apart to present you with [hisher] [kAnusDesc]. Not to disappoint, you rub your fingers against [hisher] eager pucker, teasing and spreading it. The excited elf's breath grows faster in anticipation, and [heshe] all but begs you to penetrate [himher].", parse);
			}
			Text.Newline();
			Text.AddOutput("[name] cries out as you push first one, then two fingers into [hisher] exposed [kAnusDesc]. You begin to pump your soaked digits in and out of [himher], adding a third finger once you have [himher] loosened enough.", parse);
			Text.Newline();
			
			if(kiakai.FirstCock()) {
				parse["s"]      = kiakai.NumCocks() > 1 ? "s" : "";
				parse["notS"]   = kiakai.NumCocks() > 1 ? "" : "s";
				parse["notEs"]  = kiakai.NumCocks() > 1 ? "" : "es";
				parse["itThey"] = kiakai.NumCocks() > 1 ? "they" : "it";
				
				Text.AddOutput("While you let your fingers work away at the elf's once-tight backdoor, your other hand prods and teases [name]'s [kMultiCockDesc]. The member[s] bob[notS] and twitch[notEs] at your rapid thrusts, bouncing against your hovering hand occasionally, hot to the touch.", parse);
				Text.Newline();
				Text.AddOutput("[name], by this point, is moaning deliriously, whether for you to stop or to ream [himher] harder, it's a bit difficult to tell. Somehow, you discern from [hisher] ramblings that [heshe] wants you to pay some attention to [hisher] [kMultiCockDesc] too.", parse);
				Text.Newline();
				Text.AddOutput("Hmm... why not. [HeShe] is in such a good position for it too... With your knees and abdomen, you nudge [name]'s legs even farther back, conveniently positioning the elf's cock[s] right over [hisher] panting mouth.", parse);
				Text.Newline();
				if(kiakai.FirstCock().length.Get() > 25) {
					Text.AddOutput("Amused, you watch the conflicting emotions flitting across [name]'s flushed face. Coyly, you suggest that perhaps [heshe] should put that mouth of [hishers] to use instead of complaining about it.", parse);
					Text.Newline();
					if(kiakai.flags["Sexed"] < 20)
						Text.AddOutput("Too flustered to even speak, [name] avidly shakes [hisher] head, denying that [heshe] would even consider something like that. Chuckling, you return your attention to thrusting your fingers into [hisher] ass, [name]'s [kMultiCockDesc] occassionally rubbing against the bewildered elf's lips or nose, leaving sticky trails of precum wherever [itThey] make contact.", parse);
					else {
						Text.AddOutput("As if [heshe] was only waiting for your permission, [name] starts to eagerly lick and suck at [hisher] own cock, rocking [hisher] hips slightly to give [himher]self a blowjob. Returning your attention to the elf's [kAnusDesc], you occasionally give the underside of [hisher] [kMultiCockDesc] a loving caress, urging [himher] on with soft words.", parse);
						Text.Newline();
						Text.AddOutput("Not that the horny elf seems to need much encouragement. [HeShe] has a good length of [hisher] member in [hisher] mouth, awkwardly bobbing [hisher] head despite [hisher] strange position. Occasionally, [heshe] comes up for air, gasping before returning to [hisher] [kCockDesc] with renewed fervor.", parse);
					}
				}
				else {
					Text.AddOutput("With your free hand, you start stroking [name]'s [kMultiCockDesc] rapidly. The elf mumbles a moaning thanks, before tumbling back into oblivion, [hisher] loins aflame with your combined assault.", parse);
				}
				Text.Newline();
				Text.AddOutput("Before long, you notice an erratic twitching in [name]'s [kMultiCockDesc]. Acting quickly, you slam your fingers into [hisher] [kAnusDesc], pushing them up to the knuckle. Each thrust jabs directly at the poor elf's prostate, eliciting cry after cry of intense pleasure.", parse);
				Text.Newline();
				Text.AddOutput("Your incessant finger-fucking quickly becomes too much for [name] to handle, and [heshe] bucks [hisher] hips, cock[s] firing at full capacity right into [hisher] open mouth.", parse);
				Text.Newline();
				if(kiakai.CumOutput() > 3)
					Text.AddOutput("The elf has way more cum stored up than [hisher] lithe frame has a right to, and before long not only [hisher] mouth, but also [hisher] face, [kHairDesc] and [kBreastDesc] are completely drenched in the stuff. [HeShe] gulps down as much of it as [heshe] can, if nothing else to clear [hisher] clogged windpipe.", parse);
				else
					Text.AddOutput("Streaks of white from the elf's twitching member[s] land on [hisher] cheeks, in [hisher] [kHairDesc] and on [hisher] lolling [kTongueDesc]. Dazed, [name] laps up [hisher] ejaculate, cleaning [himher]self up.", parse);
			}
			else if(kiakai.FirstVag()) {
				Text.AddOutput("As your pumping fingers deal with [name]'s once-tight backdoor, you let your other hand play with [hisher] wet [kVagDesc]. The elf's pliant folds part easily, [hisher] passage already dripping with juices from your anal teasing.", parse);
				Text.Newline();
				Text.AddOutput("[name], by this point, is moaning deliriously, whether for you to stop or to ream [himher] harder, it's a bit difficult to tell. Somehow, you discern from [hisher] ramblings that [heshe] wants you to pay some attention to [hisher] clit too.", parse);
				Text.Newline();
				if(kiakai.FirstVag().clitLength.Get() > 10) {
					Text.AddOutput("Rather than a regular clit, the elf has a large, almost cock-like spear crowning [hisher] parted labia. Stiff and trembling with need, the shaft twitches under your light touch, every bit as sensitive as ever.", parse);
					Text.Newline();
					Text.AddOutput("Its sheer size allows you to gently jerk the giant clit, as if it were a dick. The stimulation is too much for [name], who cries out in [hisher] first climax not a minute after you begin your combined assault, [hisher] cock-like clit twitching helplessly in your hand.", parse);
					Text.Newline();
					Text.AddOutput("Relenting, you allow the elf time to recover, releasing [hisher] clit until [hisher] trembling subsides. Your other hand, however, doesn't let up it's rhythmic reaming of [name]'s [kAnusDesc].", parse);
					Text.Newline();
					Text.AddOutput("When you judge that [heshe] has had enough time to recover, you once more grasp [hisher] absurdly large clit, preparing to unleash another barrage of pleasure. [HeShe] <i>did</i> ask for it, after all. The appendage seems to be incredibly sensitive, your every touch sending shocks up the elf's spine. In the span of fifteen minutes, you make the elf cum no less than three more times.", parse);
				}
				else {
					parse["tinyOversized"] = kiakai.FirstVag().clitLength.Get() > 2 ? "oversized" : "tiny";
					Text.AddOutput("Grinning, you give the [tinyOversized] button a gentle flick with your finger, enticing a shocked gasp from the elf. Seeing the obvious effect on [himher], you repeat the action, ignoring [name]'s muffled protests.", parse);
					Text.Newline();
					Text.AddOutput("[HisHer] defenses quickly erode under your merciless dual-pronged assault, and [heshe] crosses [hisher] legs in a futile attempt to keep you at bay. The plan backfires, as the motion grinds your fingers deeper into [hisher] female parts. [name] cries out and helplessly bucks [hisher] hips, riding out [hisher] climax.", parse);
					Text.Newline();
					Text.AddOutput("You continue to rhythmically pump the elf's [kAnusDesc] all through [hisher] orgasm, but relent and allow [hisher] [kClitDesc] some time to recover. Once [hisher] squirming has lessened, you pry [hisher] legs apart again, sternly instructing the elf to let you lead. Blushing, [name] spreads [hisher] legs, allowing you full access.", parse);
					Text.Newline();
					Text.AddOutput("[HeShe] bites [hisher] lower lip in anticipation as you once again close in on [hisher] [kClitDesc], this time pinching it between your fingers.", parse);
				}
				Text.Newline();
				if(kiakai.flags["Sexed"] < 20)
					Text.AddOutput("<i>\"T-the pleasure, it is too much!\"</i> [name] moans, [hisher] body obviously not used to such intense sensations.", parse);
				else
					Text.AddOutput("<i>\"M-more! Give me more, [playername]!\"</i> the horny elf pants, begging you to continue, [hisher] desire not yet sated.", parse);
				Text.Newline();
				Text.AddOutput("Done with [hisher] clit, you move your attention to [name]'s [kVagDesc]. No further preparation is needed, as your fingers easily slip inside [hisher] folds, lubricated by the elf's own fluids. Eagerly you explore [hisher] sopping passage, coaxed on by [hisher] encouraging moans.", parse);
				Text.Newline();
				Text.AddOutput("After a while, you decide that you have sated the elf's feminine parts sufficiently, and return your focus to [hisher] [kAnusDesc]. Redoubling your efforts, it is only a matter of minutes before [name]'s confused sphincter convulse around your penetrating digits. The elf almost passes out as [hisher] anal orgasm shocks [himher] to [hisher] very core.", parse);
			}
			
			Text.Newline();
			Text.AddOutput("You pull your fingers out of [name], slyly asking if [heshe] liked it. [name], not quite trusting [hisher] voice, blushes brightly, still flushed from [hisher] recent climax.", parse);
			Text.Newline();
			
			kiakai.flags["AnalExp"]++;
			player.AddSexExp(2);
			kiakai.AddSexExp(2);
			kiakai.subDom.DecreaseStat(-30, 1);

			Scenes.Kiakai.PleasureElfEnd();
		}, enabled : true,
		tooltip : Text.Parse("[HisHer] [kGenDesc] will have to wait, you are going to play with [hisher] [kAnusDesc] this time.", parse)
	});
	options.push({ nameStr : "Denial",
		func : function() {
			parse["kTargetDesc"] = kiakai.FirstCock() ? parse["kCockDesc"] : parse["kVagDesc"];
			Text.Clear();
			Text.AddOutput("You instruct the elf to lie down on [hisher] back and spread [hisher] legs for you. [name] eagerly complies, believing that you'll help with [hisher] itch. ", parse);
			if(kiakai.FirstCock())
				Text.AddOutput("You trail one finger down the length of the elf's [kCockDesc], even placing a kiss on the [kCockTip]", parse);
			else if(kiakai.FirstVag())
				Text.AddOutput("You trail one finger down the elf's tight slit, even placing a kiss on [hisher] [kClitDesc]", parse);
			Text.AddOutput(", before shifting your attention to the rest of [hisher] body, intentionally avoiding the spot [name] wants you to touch the most.", parse);
			Text.Newline();
			Text.AddOutput("When the elf makes another attempt to deal with the problem by [himher]self, you grab hold of both of [hisher] hands, trapping them against [hisher] sides. Unimpeded, you continue your slow torture, licking and lapping at [name]'s crotch, close enough to feel the heat of [hisher] [kTargetDesc], but never quite touching it.", parse);
			Text.Newline();
			if(kiakai.FirstCock())
				Text.AddOutput("The elf moans piteously, a drop of precum forming on the tip of [hisher] twitching member.", parse);
			else if(kiakai.FirstVag())
				Text.AddOutput("The elf bites [hisher] lips, struggling to keep [himher]self from thrusting [hisher] moist crotch against your tantalizing [tongueDesc].", parse);
			Text.Newline();
			Text.AddOutput("<i>\"I-I cannot take it any longer!\"</i> [name] cries out. Taking pity on [himher], you relinquish your grip on [hisher] arms, allowing the elf to take [himher]self the rest of the way. You lean back, thoroughly enjoying the sight of your horny companion fondling [himher]self.", parse);
			Text.Newline();
			if(kiakai.FirstCock()) {
				Text.AddOutput("Grasping [hisher] [kCockDesc] in one hand, [name] begins to stroke [himher]self rapidly. [HisHer] other hand snakes down between [hisher] legs, ", parse);
				if(kiakai.FirstVag())
					Text.AddOutput("finding [hisher] moist [kVagDesc].", parse);
				else
					Text.AddOutput("massaging [hisher] taint and probing [hisher] backdoor.", parse);
				Text.AddOutput(" It's not long before the elf cries out in pleasure, [hisher] [kCockDesc] spraying [hisher] seed on the ground.", parse);
			}
			else if(kiakai.FirstVag()) {
				Text.AddOutput("Spreading [hisher] lower lips with one hand, [name] begins to finger [himher]self with the other, pushing [hisher] digits in up to the knuckles. Trembling slightly, [heshe] prods at [hisher] [kClitDesc] with [hisher] thumb, breathing heavily.", parse);
				Text.Newline();
				Text.AddOutput("It's not long before the elf cries out in pleasure, [hisher] [kVagDesc] twitching and squirting [hisher] juices on the ground.", parse);
			}
			Text.Newline();
			
			player.AddSexExp(2);
			kiakai.AddSexExp(2);
			kiakai.subDom.DecreaseStat(-20, 1);

			Scenes.Kiakai.PleasureElfEnd();
		}, enabled : kiakai.FirstCock() || kiakai.FirstVag(),
		tooltip : Text.Parse("Tease [himher] even more, keeping [himher] from getting off.", parse)
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Kiakai.PleasureElfEnd = function() {
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,
		heshe        : kiakai.heshe(),
		HeShe        : kiakai.HeShe(),
		himher       : kiakai.himher(),
		hisher       : kiakai.hisher(),
		HisHer       : kiakai.HisHer()
	};
	
	Text.AddOutput("Completely sated, [name] collapses on [hisher] back, panting from the exertion. You allow [himher] a few minutes of rest before gathering up your gear.", parse);
	
	player.AddLustFraction(0.2);
	kiakai.AddLustFraction(-1);
	
	kiakai.flags["Sexed"]++;
	
	Gui.NextPrompt(kiakai.Interact);
}

Scenes.Kiakai.HealingAssertive = function() {
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,
		heshe        : kiakai.heshe(),
		HeShe        : kiakai.HeShe(),
		himher       : kiakai.himher(),
		hisher       : kiakai.hisher(),
		HisHer       : kiakai.HisHer(),
		kCockDesc    : function() { return kiakai.FirstCock().Short(); },
		kMultiCockDesc : function() { return kiakai.MultiCockDesc(); },
		kBallsDesc   : function() { return kiakai.BallsDesc(); },
		kVagDesc     : function() { return kiakai.FirstVag().Short(); },
		kClitDesc    : function() { return kiakai.FirstVag().ClitShort(); },
		kBreastDesc  : function() { return kiakai.FirstBreastRow().Short(); },
		kTongueDesc  : function() { return kiakai.TongueDesc(); },
		kAnusDesc    : function() { return kiakai.Butt().AnalShort(); },
		kSkinDesc    : function() { return kiakai.SkinDesc(); },
		heatStirring : player.FirstCock() ? "stirring" : "heat",
		breastDesc   : function() { return player.FirstBreastRow().Short(); },
		nipsDesc     : function() { return player.FirstBreastRow().NipsShort(); },
		cockDesc     : function() { return player.FirstCock().Short(); },
		cockTip      : function() { return player.FirstCock().TipShort(); },
		ballsDesc    : function() { return player.BallsDesc(); },
		tongueDesc   : function() { return player.TongueDesc(); },
		buttDesc     : function() { return player.Butt().Short(); },
		multiCockDesc: function() { return player.MultiCockDesc(); },
		vagDesc      : function() { return player.FirstVag().Short(); },
		clitDesc     : function() { return player.FirstVag().ClitShort(); },
		hipsDesc     : function() { return player.HipsDesc(); },
		armor        : function() { return player.ArmorDesc(); },
		hairDesc     : function() { return player.Hair().Short(); },
		tailDesc     : function() { var tail = player.HasTail(); return   tail ? tail.Short() : "NO TAIL"; },
		boygirl      : kiakai.body.femininity.Get() > 0 ? "girl" : "boy",
		anusDesc     : function() { return player.Butt().AnalShort(); },
		analAtt      : kiakai.flags["AnalExp"] > 10 ? "uncertainly" : "eagerly"
	};
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.genDesc = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	parse.kGenDesc = kiakai.FirstCock() ? function() { return kiakai.MultiCockDesc(); } :
					kiakai.FirstVag() ? function() { return kiakai.FirstVag().Short(); } :
					"featureless crotch";
					
	// TODO: Write more scenes
	
	//[Oral][69][Anal]
	var options = new Array();
	
	if(player.FirstCock()) {
		options.push({ nameStr : "Blowjob",
			func : function() {
				Text.Clear();
				Text.AddOutput("In no uncertain terms, you tell the elf to give you a blowjob.", parse);
				Text.Newline();
				
				parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
				parse["s"] = player.NumCocks() > 1 ? "s" : "";
				
				if(kiakai.flags["Sexed"] < 3) {
					Text.AddOutput("<i>\"A-a blowjob?\"</i> [name] looks at you, flustered and embarrassed. <i>\"I want you-\"</i> You point a finger at the elf, pressing your fingertip against [hisher] nose, <i>\"-to suck my cock.\"</i> You helpfully point out the appendage, as if [heshe] could miss it. <i>\"Now get to it before I grow bored.\"</i> You motion for the elf to begin.", parse);
					Text.Newline();
					Text.AddOutput("Uncertainly eyeing[oneof] your [multiCockDesc], [name] leans forward and gives it a tentative lick, placing a kiss on the crown. Sighing impatiently, you grasp the back of [hisher] head firmly, forcing the first few inches of your [cockDesc] into the protesting elf's hot mouth.", parse);
				}
				else if(kiakai.flags["Sexed"] < 10) {
					Text.AddOutput("Nodding in comprehension, [name] swallows uncertainly. Grasping[oneof] your [multiCockDesc], the elf takes part of it into [hisher] mouth, lathering your length in saliva.", parse);
					Text.Newline();
					Text.AddOutput("Your praise [himher] for doing such a good job, caressing [hisher] hair before taking a firm grasp of the back of [hisher] head, preventing the elf from escaping. Looking slightly fearful, [heshe] accepts your touch, diligently sucking on the [cockTip] of your cock.", parse);
				}
				else {
					Text.AddOutput("Without hesitation, [name] obeys you. Eagerly wrapping [hisher] lips around[oneof] your [cockTip][s], the elf wastes no time in starting to move up and down your length, lathering it in [hisher] slick saliva.", parse);
					Text.Newline();
					Text.AddOutput("[HeShe] has become such a good cocksucker now that [heshe] has lost [hisher] inhibitions, something you are sure to remind [himher] of. Rather than blushing in shame, you detect a small hint of pride in [name]'s eyes as [heshe] gazes up at you through [hisher] thick lashes.", parse);
					Text.Newline();
					Text.AddOutput("Time you took a more active part though. Grasping the back of [hisher] head with both hands, you push more of your [cockDesc] into [himher], glorying in [hisher] magnificent tightness.", parse);
				}
				Text.Newline();
				Text.AddOutput("Holding [hisher] head, you guide the elf up and down your member, slowly at first, but gradually increasing in speed. [name]'s [kTongueDesc] caresses the veins of your [cockDesc], trying to keep up with your rapid pace.", parse);
				if(player.NumCocks() > 1) {
					parse["s"] = player.NumCocks() > 2 ? "s" : "";
					parse["notS"] = player.NumCocks() > 2 ? "" : "s";
					Text.AddOutput(" Your other [cockDesc][s] grind[notS] against [name]'s face, rubbing against [hisher] forehead and staining [hisher] hair with sticky precum.", parse);
				}
				Text.Newline();
				
				var biggestCock = player.BiggestCock();
				var biggestCockLen = biggestCock.length.Get();
				
				var scenes = new EncounterTable();
				// DEEPTHROAT
				scenes.AddEnc(function() {
					parse["cockDesc"] = function() { return biggestCock.Short(); };
					
					Text.AddOutput("[name] has some trouble getting [hisher] breath, your [cockDesc] stuffing [hisher] mouth to the brim, the [cockTip] prodding at the back of [hisher] throat. The elf tries to push [himher]self off your cock, but you grip [himher] firmly, restricting [hisher] movements.", parse);
					Text.Newline();
					Text.AddOutput("At first furtively, but rapidly growing more desperate, [name] tries to escape your iron grasp. Relenting slightly, you pull your [cockDesc] out far enough to allow [himher] to breathe through [hisher] nose. [name] gazes up at you with gratitude, but [hisher] relief is short lived, as you once again feed your length down [hisher] tight esophagus.", parse);
					Text.Newline();
					Text.AddOutput("[HeShe] looks up at you pleadingly, but rather than easing up, you push a few more inches in, blocking off [hisher] breathing once more. With short, deep thrusts, you enjoy the feeling of the elf's throat constricting around your [cockDesc], withdrawing slightly now and then to allow [himher] some breathing room.", parse);
					Text.Newline();
					if(kiakai.flags["Sexed"] > 20)
						Text.AddOutput("Drawing from previous experiences, [name] soon has a rhythm going, [hisher] practiced throat quickly growing accustomed to your deep fucking. [HeShe] even seems to be getting some enjoyment out of it, a dreamy look on [hisher] face as the elf hums lightly, the vibrations of [hisher] tight cocksleeve increasing your pleasure.", parse);
					else
						Text.AddOutput("Not used to such rough treatment - yet - the elf's eyes tear up from pain and lack of oxygen. Still, [hisher] convulsing throat is working wonders on your [cockDesc], stroking it rapidly while fruitlessly trying to expel the invading member.", parse);
					Text.Newline();
					Text.AddOutput("Feeling your orgasm approaching quickly, you pull out until only your [cockTip] is in [name]'s mouth. Coughing and wheezing, the elf tries to get [hisher] breath back before you roughly shove yourself back in, ", parse);
					if(biggestCockLen - kiakai.flags["Sexed"] < 20)
						Text.AddOutput("pushing your [cockDesc] in to the root. The hot kiss on your groin only serve to egg you on.", parse);
					else
						Text.AddOutput("pushing as much of your [cockDesc] into [himher] as possible. It will take a lot of training until [heshe] is able to take all of your length, though.", parse);
					Text.Newline();
					
					parse["cumOrg"] = player.HasBalls() ? "your " + player.BallsDesc() : "your cum-producing organs";
					
					Text.AddOutput("Rutting happily, you hug [name]'s face to your crotch, groaning in pleasure as [cumOrg] deposit their load down the elf's throat. Helpless to do anything, [heshe] tries to ride it out, gulping and swallowing your sticky cum as quickly as [heshe] is able.", parse);
					if(player.CumOutput() > 3)
						Text.AddOutput(" Your flood, once released, doesn't let up. When you finally finish, [name]'s stomach is visibly distended.", parse);
					if(player.NumCocks() > 1) {
						parse["s"]        = player.NumCocks() > 2 ? "s" : "";
						parse["notS"]     = player.NumCocks() > 2 ? "" : "s";
						parse["theirIts"] = player.NumCocks() > 2 ? "their" : "its";
						Text.AddOutput(" Joining [theirIts] sibling, your other [cockDesc][s] erupt[notS], covering [name] in long white strands.", parse);
					}
					Text.Newline();
					Text.AddOutput("With a drawn-out sloppy sound, your pull your softening [cockDesc] from the elf's throat. Once [heshe] has finished coughing, a dribble of cum running down [hisher] chin, you present [himher] with your sloppy [cockDesc].", parse);
					Text.Newline();
					Text.AddOutput("<i>\"Clean it up, like a good slut,\"</i> you order [himher] imperiously, smiling as the elf obediently complies.", parse);
				}, 1.0, function() { return biggestCockLen > 20; });
				// FACEFUCK
				scenes.AddEnc(function() {
					Text.AddOutput("Seeking to get a better angle of penetration, you adjust your lower body, twining your fingers into [name]'s hair, trapping [himher] in place. Intending to get your pleasure out of the elf, and to get it rough, you start thrusting in and out of [hisher] mouth, ignoring [hisher] whimpering complaints.", parse);
					Text.Newline();
					Text.AddOutput("You set a rapid pace, abusing the poor elf's hole. ", parse);
					if(biggestCockLen > 30)
						Text.AddOutput("Due to the sheer size of your [cockDesc], you are unable to use its full length. Alternating between roughly deepthroating the elf and repeatedly forcing your way in and out of [hisher] throat, you make the most of it anyway.", parse);
					else if(biggestCockLen > 13)
						Text.AddOutput("Your cock is just long enough to force it's way into the elf's throat with each forceful thrust, leaving the elf gasping for air as you pummel [hisher] mouth.", parse);
					else
						Text.AddOutput("Roughly smashing your crotch against [hisher] lips, you pummel the elf, making sure to familiarize [himher] with every inch of your [cockDesc].", parse);
					Text.Newline();
					Text.AddOutput("Hardly given time to breathe, [name]'s muffled moans grow more ragged. Not showing any signs of letting up, you continue your face-fucking for several minutes. In a small act of mercy, you pull out in order to let the elf recover.", parse);
					Text.Newline();
					if(kiakai.flags["Sexed"] > 30)
						Text.AddOutput("<i>\"W-why did you stop?\"</i> [name] coughs, almost sounding a bit disappointed. You tell [himher] not to worry, there is more where that came from. The elf is wearing an almost hungry expression as you once more guide your [cockDesc] in between [hisher] waiting lips.", parse);
					else
						Text.AddOutput("<i>\"Y-you are way too rough, [playername],\"</i> [name] splutters, coughing up precum. You chide [himher] for being such a baby - a good healer should be able to take this much at least, right? Cutting off any further complaints, you shove your [cockDesc] back inside the elf.", parse);
					Text.Newline();
					Text.AddOutput("Getting back to business, you resume your rough fucking. After about ten minutes, you can feel your orgasm closing in.", parse);
					Text.Newline();
					
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.AddOutput("Deciding to push on and leave the elf with a surprise present, you continue thrusting your throbbing [cockDesc] into [hisher] mouth, hardly slowing down even as you begin to spill your seed inside [himher]. Part of your load seeps out of the corner of [name]'s mouth, dribbling down [hisher] chin.", parse);
						if(player.CumOutput() > 3)
							Text.AddOutput(" Another thread of sticky semen forces its way out [hisher] nose, the elf overwhelmed by the amount of cum you produce.", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.AddOutput("You pull your throbbing [cockDesc] away the elf, excitedly jerking your length in front of [name]'s open, panting mouth. Still slightly disoriented from the rough fuck, [heshe] doesn't seem to notice, until the first wad lands on [hisher] [kTongueDesc].", parse);
						Text.Newline();
						Text.AddOutput("Moaning, you deposit your sticky load on the elf, some of the shots hitting [hisher] mouth by sheer luck. Most miss their mark, landing on [name]'s cheeks or in [hisher] hair.", parse);
						if(player.CumOutput() > 3)
							Text.AddOutput(" Once you are done, the elf's face - and most of [hisher] front - is covered in a sticky mess.", parse);
					}, 1.0, function() { return true; });
					scenes.Get();
				}, 1.0, function() { return true; });
				/* TODO: more scenes
				scenes.AddEnc(function() {
					Text.AddOutput("", parse);
					Text.Newline();
					Text.AddOutput("", parse);
					Text.Newline();
					Text.AddOutput("", parse);
					Text.Newline();
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.AddOutput("", parse);
					Text.Newline();
					Text.AddOutput("", parse);
					Text.Newline();
					Text.AddOutput("", parse);
					Text.Newline();
				}, 1.0, function() { return true; });
				*/
				scenes.Get();
				
				
				Text.Newline();
				if(kiakai.flags["Sexed"] > 30) {
					Text.AddOutput("<i>\"Mm... y-you taste so good, [playername],\"</i> [name] stammers, licking up a stray drop of your cum from your [cockDesc]. Chuckling, you tell the slutty elf to get dressed. Maybe next time, you'll let [himher] get off, too.", parse);
				}
				else if(kiakai.flags["Sexed"] > 10) {
					Text.AddOutput("<i>\"T-that was different,\"</i> [name] mumbles, <i>\"b-but not bad, I guess.\"</i> You congratulate [himher] on a job well done, saying that you are sure [heshe]'ll enjoy it more next time. The elf looks at you doubtfully.", parse);
				}
				else {
					Text.AddOutput("<i>\"P-please don't make me do that again, [playername],\"</i> [name] pleads with you, <i>\"I don't think I can take it.\"</i> You smile at [himher] reassuringly, telling the elf that next time won't be so bad. [HeShe] visibly shudders when you mention a next time.", parse);
				}
				Text.Newline();
				Text.AddOutput("The two of you re-equip your gear and get ready to set out again.", parse);
				
				
				kiakai.flags["Sexed"]++;
				player.AddSexExp(2);
				kiakai.AddSexExp(2);
				kiakai.subDom.DecreaseStat(-30, 1);
				player.AddLustFraction(-1);
				
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : true,
			tooltip : "Tell the elf to suck your cock."
		});
	}
	// CUNNILINGUS
	if(player.FirstVag()) {
		options.push({ nameStr : "Cunnilingus",
			func : function() {
				Text.Clear();
				Text.AddOutput("You flaunt your [vagDesc] for [name]'s benefit, slyly asking if [heshe] wants to eat you out.", parse);
				Text.Newline();
				if(kiakai.flags["Sexed"] < 10)
					Text.AddOutput("<i>\"You want me to... there?\"</i> The elf blushes, casting furtive glances at your exposed crotch.", parse);
				else if(kiakai.flags["Sexed"] < 20)
					Text.AddOutput("<i>\"I-If you want me to,\"</i> the elf mumbles, [hisher] expression a beautiful mix of lust and embarrassment. [HeShe] refuses to meet your eyes, [hisher] hands fidgeting.", parse);
				else
					Text.AddOutput("<i>\"C-can I?\"</i> The elf looks a bit flustered, but [heshe] is clearly eager to serve you.", parse);
				Text.Newline();
				parse["lowerbody"] = player.LowerBodyType() == LowerBodyType.Single ? Text.Parse("to your [vagDesc]", parse) : "between your legs";
				Text.AddOutput("Nodding impatiently, you guide [hisher] head down [lowerbody], positioning yourself within reach of the elf's [kTongueDesc]. Any lingering inhibitions shattered by your insistence, [name] leans in to pleasure you as best as [heshe] can.", parse);
				Text.Newline();
				parse["bothtwo"] = player.Arms().count > 2 ? "two" : "both";
				Text.AddOutput("You stifle a moan as you feel [hisher] lips on your [vagDesc], the tip of the elf's [kTongueDesc] hesitantly probing at your labia. Not patient enough to let [himher] go at [hisher] own pace, you grasp [name]'s head with [bothtwo] hands and push [himher] down roughly, your [vagDesc] grinding against [hisher] face.", parse);
				Text.Newline();
				Text.AddOutput("For a while, you just enjoy the sensation as [name] slowly accepts [hisher] position, starting to actively lap at your crotch, burying [hisher] [kTongueDesc] inside your folds. Your grip keeps the elf firmly in place, barely giving [himher] room to breathe.", parse);
				Text.Newline();
				if(player.FirstCock()) {
					parse["isAre"] = player.NumCocks() > 1 ? "are" : "is";
					parse["itThem"] = player.NumCocks() > 1 ? "them" : "it";
					Text.AddOutput("Your unattended [multiCockDesc] [isAre] starting to stiffen, and you idly slap [name] with [itThem] a few times. After smearing some of your precum on [hisher] forehead, you let [himher] get back to business.", parse);
					Text.Newline();
				}
				if(kiakai.flags["Sexed"] < 20)
					Text.AddOutput("[name] is doing a relatively good job, but [heshe] is going a bit too slow, [hisher] inexperience obvious in the hesitant motions. It seems you have to train [himher] a bit more for [himher] to lose [hisher] inhibitions.", parse);
				else
					Text.AddOutput("[name] is putting [hisher] skills to good use, probing your depths eagerly. Your diligent training of the elf is paying off, [heshe] is still a bit flustered, but hardly seems inhibited anymore.", parse);
				Text.Newline();
				Text.AddOutput("No... you need more than this.", parse);
				Text.Newline();
			 
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.AddOutput("Shaking your head in disappointment, you push [name] back. The elf looks confused, wondering what [heshe] did wrong. <i>\"[playername]?\"</i> [heshe] asks uncertainly. You push [himher] down on [hisher] back, silencing the elf with a deep kiss. As you withdraw, a string of saliva mixed with your own juices briefly bridges the gap between [name]'s mouth and yours. Not allowing [name] to get back on [hisher] feet, you quickly straddle [hisher] face, your [buttDesc] resting lightly on [hisher] [kBreastDesc].", parse);
					Text.Newline();
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.AddOutput("<i>\"Mm... not bad, but perhaps you still need some guidance...\"</i>", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.AddOutput("<i>\"You do it like this!\"</i>", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.AddOutput("<i>\"[name],\"</i> you smile wickedly, shaking your head, <i>\"I see you still have much to learn...\"</i>", parse);
					}, 1.0, function() { return true; });
					
					scenes.Get();
					
					Text.AddOutput(" To accentuate your words, you grind up against [hisher] mouth, pressing down on [himher] with your [vagDesc]. Spreading your legs wider, you let yourself relax, putting more and more of your weight on your prone companion. [name]'s muffled moans send violent vibrations through your nether regions, [hisher] [kTongueDesc] firmly lodged in your slick tunnel.", parse);
					
					if(player.FirstCock()) {
						parse["itThem"] = player.NumCocks() > 1 ? "them" : "it";
						Text.AddOutput(" You grab hold of your [multiCockDesc], stroking [itThem] slowly while riding the submissive elf.", parse);
					}
					var tail = player.HasTail();
					if(tail && tail.Prehensile()) {
						parse["notEs"] = tail.count > 1 ? "" : "es";
						Text.AddOutput(" Your flexible [tailDesc] swish[notEs] back and forth, brushing over [name]'s stomach before finding its target and rubbing up against the elf's [kGenDesc], returning blow for blow.", parse);
					}
					else if(tail) {
						parse["notEs"] = tail.count > 1 ? "" : "es";
						parse["itsTheir"] = tail.count > 1 ? "their" : "its";
						Text.AddOutput(" [name] shudders as your [tailDesc] brush[notEs] against [hisher] stomach, [itsTheir] sweeping motions tickling [hisher] sensitive [kSkinDesc].", parse);
					}
					Text.Newline();
					Text.AddOutput("With wild abandon, you gyrate your hips in intense, bucking motions, taking your pleasure with little care for your elvish mount. Said mount seems to be enjoying [himher]self regardless, [hisher] hands plastered to your [buttDesc], not trying to force you off, but rather encouraging you. Experimentally, you flex your legs, rising up slightly to give [himher] some breathing room. [name] licks [hisher] lips, eyes flickering between your dripping cunt and your flushed face.", parse);
					Text.Newline();
					Text.AddOutput("You coyly ask [himher] what [heshe] is waiting for, swaying your hips seductively. Lust overpowering [hisher] shame, the elf leans in, returning to [hisher] task. Once you've confirmed [hisher] willingness, you sink back down, twat crushing against your excited companion's upturned face.", parse);
					Text.Newline();
					Text.AddOutput("For the better part of half an hour, you continue riding [name], repeatedly impaling yourself on [hisher] [kTongueDesc]. You smirk as you glance over your shoulder, seeing one of [name]'s hands busy between [hisher] own legs. From the mess, you gather that [heshe] has climaxed at least once during your wild ride.", parse);
					Text.Newline();
					parse["juice"] = player.FirstCock() ? "the combined fluids of your male and female parts" : "your juices";
					Text.AddOutput("Feeling your own orgasm surging through your body, you switch gears, grasping your lover's head in your hands and pressing down on [himher] with your crotch. You cry out as waves of pleasure run through you, drenching the elf in [juice].", parse);
				}, 1.0, function() { return player.LowerBodyType() != LowerBodyType.Single; });
				/* TODO: Scene not requiring legs
				scenes.AddEnc(function() {
					Text.AddOutput("", parse);
					Text.Newline();
					Text.AddOutput("", parse);
				}, 1.0, function() { return true; });
				*/
				scenes.Get();
	
				Text.Newline();
				Text.AddOutput("Stretching luxuriously, you tell [name] to get you cleaned up.", parse);
				Text.Newline();

				kiakai.flags["Sexed"]++;
				player.AddLustFraction(-1);
				kiakai.AddLustFraction(-1);
				player.AddSexExp(1);
				kiakai.AddSexExp(3);
				
				kiakai.subDom.DecreaseStat(-30, 1);
							
				if(kiakai.subDom.Get() > -20) {
					Text.AddOutput("The elf doesn't respond, averting [hisher] gaze in shame.", parse);
					
					
					//[Mercy][Punish]
					var options = new Array();
					options.push({ nameStr : "Mercy",
						func : function() {
							Text.Newline();
							Text.AddOutput("Relenting, you give [name] a hand up, helping [himher] with [hisher] gear. The two of you ready yourselves to continue your journey.", parse);
							
							kiakai.flags["Sexed"]++;
							Gui.NextPrompt(kiakai.Interact);
						}, enabled : true,
						tooltip : Text.Parse("Give [himher] a break.", parse)
					});
					options.push({ nameStr : "Punish",
						func : function() {
							Text.Newline();
							Text.AddOutput("You simply sit back down, grinding your crotch against [himher], using [hisher] face like a towel. Before gathering your gear and continuing your journey, you give [name] an encouraging kiss on the cheek.", parse);
							
							kiakai.subDom.DecreaseStat(-30, 2);
							kiakai.relation.DecreaseStat(-100, 2);
							
							kiakai.AddLustFraction(0.2);
							Gui.NextPrompt(kiakai.Interact);
						}, enabled : true,
						tooltip : Text.Parse("Can't have [himher] disobeying, can you?", parse)
					});
					Gui.SetButtonsFromList(options);
				}
				else {
					Text.AddOutput("The elf obeys without complaint, dutifully licking the lingering drops from your female sex. Gathering your gear, you get ready to continue on your travels, followed by the slightly disoriented elf.", parse);
					
					kiakai.AddLustFraction(0.2);
					Gui.NextPrompt(kiakai.Interact);
				}
			}, enabled : true,
			tooltip : "Tell the elf to eat you out."
		});
	}
	// DOMMY 69
	options.push({ nameStr : "69",
		func : function() {
			Text.Clear();
			parse["emo"]     = kiakai.flags["Sexed"] > 15 ? "eagerly" : "fearfully";
			parse["itThem"]  = kiakai.NumCocks() > 1 ? "them" : "it";
			parse["oneof"]   = kiakai.NumCocks() > 1 ? " one of" : "";
			parse["s"]       = kiakai.NumCocks() > 1 ? "s" : "";
			parse["boygirl"] = kiakai.Gender() == Gender.male ? "boy" : "girl";
			Text.Add("<i>\"On second thought...\"</i> you tell the elf to lie down on [hisher] back. [name] complies, [emo] awaiting what you are going to do. Smirking, you to take in the sight of the nude elf before you.", parse);
			Text.NL();
			if(kiakai.FirstCock() && kiakai.FirstVag()) {
				Text.Add("Blushing under your ogling, [name] tries to cover [hisher] [kMultiCockDesc] by hiding [itThem] under [hisher] hands. ", parse);
				if(kiakai.BiggestCock().length.Get() > 30)
					Text.Add("A futile effort, considering [hisher] size. ", parse);
				Text.Add("Annoyed with [hisher] teasing, you swat away the cover, telling the elf to keep [hisher] hands by [hisher] sides.", parse);
				Text.NL();
				parse["balls"] = kiakai.HasBalls() ? Text.Parse(" [kBallsDesc],", parse) : "";
				Text.Add("You take your time appraising the elf's form, absently nudging [hisher] legs apart, revealing [name]'s [kCockDesc],[balls] and [kVagDesc]. [name] really does have the best of both worlds.", parse);
				Text.NL();
				Text.Add("Giving [himher] a few strokes on[oneof] [hisher] member[s] to get [himher] riled up, while your other hand playfully pinches one of the elf's [kNipsDesc].", parse);
			}
			else if(kiakai.FirstVag()) {
				Text.Add("[name] tries to cover [himher]self up, crossing [hisher] legs to hide the moist mound hidden between them. Not up for [hisher] games, you reach down, prying the elf's legs apart, and stick a few fingers into [hisher] wet cleft. [name] almost lifts from the ground, arching [hisher] back trying to escape the invading digits. Roughly spearing [himher] with your fingers one last time, you chastise the elf for being so shy.", parse);
				Text.NL();
				Text.Add("Taking the hint, [heshe] meekly spreads [hisher] legs for you, putting [hisher] most intimate parts on display. Grinning at the prone elf, you tease and rub at [hisher] [kBreastDesc], commending [himher] for being such a good [boygirl].", parse);
			}
			else if(kiakai.FirstCock()) {
				Text.Add("Blushing under your ogling, [name] tries to cover [hisher] [kMultiCockDesc] by hiding [itThem] under [hisher] hands. ", parse);
				if(kiakai.BiggestCock().length.Get() > 30)
					Text.Add("A futile effort, considering [hisher] size. ", parse);
				Text.Add("Annoyed with [hisher] teasing, you swat away the cover, telling the elf to keep [hisher] hands by [hisher] sides.", parse);
				Text.NL();
				parse["balls"] = kiakai.HasBalls() ? Text.Parse(" the [kBallsDesc] hanging beneath [itThem],", parse) : "";
				Text.Add("You take your time appraising the elf's form, absently nudging [hisher] legs apart, revealing [name]'s [kMultiCockDesc],[balls] and - hidden between [hisher] soft cheeks - the tight rosebud of [hisher] anus.", parse);
				Text.NL();
				Text.Add("You give [himher] a few strokes on[oneof] [hisher] member[s] to get [himher] riled up, your other hand playfully pinches one of the elf's nipples.", parse);
			}
			Text.NL();
			Text.Add("Deciding that it is time to put your own private parts on display, you flip one leg over the elf, straddling [hisher] face, getting a good view of [hisher] body.", parse);
			Text.NL();
			if(player.HasBalls() && player.Balls().size.Get() > 8) {
				Text.Add("[name] has a hard time seeing anything, as you plant your [ballsDesc] on [hisher] forehead, the plentiful sack partly obscuring [hisher] vision as you drag it over [hisher] face.", parse);
				Text.NL();
			}
			if(player.FirstVag()) {
				Text.Add("You rub your [vagDesc] on the elf's nose, stifling a moan as your repeatedly mash your sensitive [clitDesc] against it.", parse);
				Text.NL();
			}
			if(player.FirstCock()) {
				parse["s"] = player.NumCocks() > 1 ? "s" : "";
				Text.Add("Letting your [multiCockDesc] hover a hairsbreadth in front of the elf's open mouth, you enjoy the feeling of [hisher] rapid breathing on the stiffening length[s].", parse);
				Text.NL();
			}
			Text.Add("[name], being a big [boygirl], you assume [heshe] can figure out what to do by themselves. In the meantime, you lick your lips, eyeing the elf's genitalia.", parse);
			Text.Flush();
			
			// REUSED DIALOGUE
			var KIAI1 = function() {
				if(player.FirstCock()) {
					parse["mouthThroat"] = player.FirstCock().length.Get() > 15 ? "throat" : "mouth";
					Text.Add("The elf groans under your cruel teasing, [hisher] complaints somewhat distorted by the [cockDesc] lodged in [hisher] [mouthThroat]. You ignore [himher], shutting [himher] up by feeding some more of your [cockDesc] into [himher].", parse);
				}
				else if(player.FirstVag()) {
					Text.Add("The elf groans under your cruel teasing, [hisher] muffled complaints sending vibrations through your nethers. [HisHer] [kTongueDesc] is hard at work lapping at your [vagDesc], worshipping your feminine sex.", parse);
				}
				if(player.FirstBreastRow().size.Get() > 3)
					Text.Add(" Your stiff [nipsDesc] poke against [hisher] stomach, dragging back and forth as you grind your hips against [name]'s mouth.", parse);
			};
			var KIAI2 = function() {
				if(player.FirstCock()) {
					Text.Add("Your own climax is building, and you are not going to accept being deterred from it. A few quick thrusts relieve your stress, letting wave after wave of hot spunk flow into the throat of the prone elf.", parse);
					if(player.CumOutput() > 3)
						Text.Add(" [name]'s belly expands noticeably, overflowing with your seed.", parse);
					Text.Add(" You pull out of the panting elf, letting the last of your ejaculate dribble onto [hisher] upturned face.", parse);
				}
				else if(player.FirstVag()) {
					Text.Add("The feeling of [name]'s [kTongueDesc] buried within your [vagDesc] finally becomes too much for you, and you convulse against [hisher] face, coating [himher] with your liquids.", parse);
				}
			};
			
			//[Cock][Vagina][Anal]
			var options = new Array();
			if(kiakai.FirstCock()) {
				options.push({ nameStr : "Cock",
					func : function() {
						var cock = kiakai.BiggestCock();
						parse["kCockDesc"] = function() { return cock.Short(); };
						parse["kCockTip"]  = function() { return cock.TipShort(); };
						
						Text.Clear();
						parse["tower"]     = kiakai.NumCocks() > 1 ? "towers" : "a tower";
						parse["s"]         = kiakai.NumCocks() > 1 ? "s" : "";
						parse["isAre"]     = kiakai.NumCocks() > 1 ? "are" : "is";
						parse["itThem"]    = kiakai.NumCocks() > 1 ? "them" : "it";
						parse["itsTheir"]  = kiakai.NumCocks() > 1 ? "their" : "its";
						parse["biggest"]   = kiakai.NumCocks() > 1 ? " biggest" : "";
						parse["thickThin"] = cock.length.Get() / cock.thickness.Get() > 5 ? "thin" : "thick";
						Text.Add("You lean in, cupping the elf's [kMultiCockDesc] lovingly. With meticulous care, you stroke [itThem] to full hardness, rising like [tower] from between [hisher] legs. For a while, you don't do anything other than admire [itThem], marvelling at the expertly crafted organ[s]. The touch of [name]'s [kTongueDesc] between your legs snaps you back to attention.", parse);
						Text.NL();
						if(kiakai.FirstCock().length.Get() > 25) {
							Text.Add("The sheer size of [hisher][biggest] cock looks almost ridiculous on the elf's lithe body, the [thickThin] member bobbing expectantly under your light touch. Hah. As if you are going to make it that easy for [himher].", parse);
						}
						else {
							parse["tinyAverage"] = cock.length.Get() < 15 ? "tiny" : "average";
							Text.Add("The elf isn't really packing anything special, but [hisher] [tinyAverage] cock[s] [isAre] cute in [itsTheir] own way. Makes you want to play with [itThem], tease [itThem].", parse);
							if(kiakai.NumCocks() > 1) {
								Text.NL();
								Text.Add(" You pick out the biggest one to be the focus of your attentions.", parse);
							}
						}
						Text.NL();
						Text.Add("You grasp the [kCockDesc] firmly at its base, trapping the blood in the engorged member. With your free hand you prod and tease the rigid shaft, interspersing your pokes with light tantalizing kisses. As you brush the elf's [kCockTip] with your lips, your [tongueDesc] darts out, playing along [hisher] cumslit.", parse);
						Text.NL();
						Text.Add("Retaining your clenching grip of the base of [hisher] member, you start stroking [himher] with your other hand. Deprived of a normal flow of blood, the veins are starting to stand out, bulging under your deft fingers.", parse);
						Text.NL();
						
						KIAI1();
						
						Text.NL();
						Text.Add("With long, slow strokes, you push the elf closer and closer to the edge, stopping just short of orgasm. For a while, you keep [name] poised on the edge with nothing more than your hot breath on [hisher] quivering [kCockTip]. [HeShe] whines piteously, but focuses on [hisher] own task. Just when [name]'s [kCockDesc] shows signs of softening, you reinvigorate it with a few quick licks, keeping [himher] just on the verge of cumming.", parse);
						Text.NL();
						Text.Add("In a sudden move, you take [hisher] [kCockDesc] into your mouth, sucking and blowing it for all you are worth. [name] cries out into your crotch, [hisher] legs trembling with witheld pleasure. Your vice-like grip on [hisher] shaft prevents the poor elf from orgasming, leaving [himher] with no recourse but to attempt to thrust into your mouth. You are amused by [hisher] desperate twitches, but don't relinquish your tight embrace.", parse);
						Text.NL();
						Text.Add("Exhausted, the elf falls back to the ground.", parse);
						if(kiakai.HasBalls())
							Text.Add(" [HisHer] [kBallsDesc] have swollen considerably, [hisher] load prevented from release.", parse);
						Text.NL();
						Text.Add("A flick of your hips reminds [himher] to keep pleasuring you.", parse);
						Text.NL();
						
						KIAI2();
						
						Text.NL();
						Text.Add("Without missing a beat, you begin to drive [name] toward [hisher] next climax. This time, you don't play around, going straight for the kill. Ramming as much as you can of the elf's [kCockDesc] into your mouth, you go at it with great abandon. Your [tongueDesc] grinds the undercarriage of the [thickThin] shaft, occasionally unsuccessfully trying to force its way into [name]'s urethra.", parse);
						Text.NL();
						parse["cum"] = player.FirstCock() ? "filled by your cum" : "showered in your juices";
						Text.Add("Still disoriented from being [cum], the elf can only weakly lap at your nethers, the twitching dick lodged in your throat contrasting sharply with [hisher] otherwise exhausted body. Once again, [name] cries out, pleading for you to let [himher] cum, and you feel a growing pressure at the base of [hisher] cock.", parse);
						Text.Flush();
						
						
						//[Release][Deny]
						var options = new Array();
						options.push({ nameStr : "Release",
							func : function() {
								Text.Clear();
								Text.Add("Taking pity on [name], you pull [himher] out of your mouth, planting one last kiss on [hisher] [kCockTip] before changing your tactics. With your free hand, you rapidly jerk [himher] off, still keeping a tight grip on the base of [hisher] [kCockDesc]. When you judge that [heshe] is about to blow, you suddenly release your hold, letting the elf's liquids flow freely.", parse);
								Text.NL();
								Text.Add("<i>\"[playername]! I-It is coming! Aah...\"</i> [name] groans weakly, barely able to contain [himher]self. And come [heshe] does. Like a fountain the elf's suppressed fluids spew forth, spraying from the violently twitching member.", parse);
								Text.NL();
								if(kiakai.CumOutput() > 3) {
									Text.Add("A copious amount of semen flows from [hisher] dilated cumslit, covering both of you in sticky liquids.", parse);
									Text.NL();
								}
								Text.Add("<i>\"Good [boygirl],\"</i> you commend [himher], licking your lips contentedly as you gather your gear. The elf is too exhausted to reply. ", parse);
								Text.Flush();
								
								
								kiakai.flags["Sexed"]++;
								
								kiakai.subDom.DecreaseStat(-25, 1);
								
								kiakai.AddLustFraction(-1);
								player.AddLustFraction(-1);
					
								Gui.NextPrompt(kiakai.Interact);
							}, enabled : true,
							tooltip : Text.Parse("Relent and allow the elf to cum. With the amount [heshe] has stacked up, it'll probably be a big one.", parse)
						});
						options.push({ nameStr : "Deny",
							func : function() {
								Text.Clear();
								Text.Add("<i>\"You'll have to do better than that,\"</i> you tell [himher] as you briefly surface, licking [name]'s [kCockDesc] slowly while awaiting [hisher] response.", parse);
								Text.NL();
								Text.Add("<i>\"Please!\"</i> the elf whines piteously.", parse);
								Text.NL();
								Text.Add("<i>\"Beg for it.\"</i>", parse);
								Text.NL();
								Text.Add("<i>\"Please [playername], I beg of you!\"</i> [name] pleads with you, jerking [hisher] hips futilely in an attempt to dislodge your grip. Your only response is to tighten it further.", parse);
								Text.NL();
								Text.Add("<i>\"You'll come when I allow you to, not before,\"</i> you counter, letting your [tongueDesc] play along the tip of the elf's cock. Powerless to resist, [name] falls back, letting you do as you please.", parse);
								Text.NL();
								Text.Add("You feel [name]'s legs tremble in ecstasy at least once more during your slow sensory torture. Your clenching grip doesn't allow even a single drop of [hisher] ejaculate escape. Gradually, you reduce your teasing to occasionally prodding at the [kCockDesc], your hot breath a constant reminder to the elf that your mouth is barely an inch away, hovering but never touching.", parse);
								Text.NL();
								Text.Add("Finally, [hisher] own body caves in, too exhausted to keep up. In disappointment you watch as [hisher] erection slowly shrinks down. Only when it's fully retracted do you relinquish your grip, releasing not a spray but a slow steady trickle of the elf's stacked-up orgasms.", parse);
								if(kiakai.CumOutput() > 3)
									Text.Add(" Like from a broken faucet, semen keeps flowing from [name]'s cock for a long time, trickling down [hisher] sides to pool all around [himher].", parse);
								Text.NL();
								Text.Add("You get up and stretch sinuously, prodding at [name] to get up. Though [heshe] has been pushed beyond the brink of exhaustion, [hisher] flushed cheeks indicate [heshe] is still incredibly turned on. Perhaps you've discovered - or developed - a masochistic streak in your elven companion?", parse);
								Text.Flush();
								
								kiakai.flags["Sexed"]++;
								
								kiakai.subDom.DecreaseStat(-35, 2);
								if(kiakai.subDom.Get() > -15)
									kiakai.relation.DecreaseStat(-20, 1);
								
								kiakai.AddLustFraction(1);
								player.AddLustFraction(-1);
					
								Gui.NextPrompt(kiakai.Interact);
							}, enabled : true,
							tooltip : Text.Parse("Toy with [himher] some more. Make [himher] really beg.", parse)
						});
						Gui.SetButtonsFromList(options);
					}, enabled : true,
					tooltip : Text.Parse("Focus on [hisher] [kMultiCockDesc].", parse)
				});
			}
			if(kiakai.FirstVag()) {
				options.push({ nameStr : "Vagina",
					func : function() {
						Text.Clear();
						Text.Add("With your fingers, you spread the elf's labia, revealing the glistening pink flesh within. You confidently dig in, tasting your companion's most private parts. Your [tongueDesc] circles the outer lips several times before moving on to your main course, [name]'s inviting cleft. Reaching in deeply, you jam your [tongueDesc] inside [himher], lapping up [hisher] fluids gleefully.", parse);
						Text.NL();
						parse["cockCuntTaint"] = player.FirstCock() ? "cock" : player.FirstVag() ? "cunt" : "taint";
						Text.Add("[name] definitely appreciates your fervor, moaning against your [cockCuntTaint] as you eat [himher] out. A single strand of saliva mixed with [hisher] juices connects the tip of your tongue with [hisher] tunnel as you briefly surface for air, dripping over [hisher] crotch.", parse);
						Text.NL();
						Text.Add("Once you've sated your thirst, you switch to using your fingers instead, pushing first two, then three inside [name]'s [kVagDesc]. Working up a slow rhythm, you start pumping the elf, probing [himher] intimately.", parse);
						// TODO: STRETCH VARIATIONS?
						Text.NL();
						Text.Add("Your free hand busies itself toying with [name]'s [kClitDesc], gently caressing the sensitive organ. [HeShe] easily succumbs under your combined assault, [hisher] limbs melting to putty under your hands.", parse);
						Text.NL();
						
						KIAI1();
						
						Text.NL();
						Text.Add("By this point, your hand is practically soaked in [name]'s sweet secretions. Lubricated by [hisher] natural juices, your fingers slide in and out of [hisher] wet cleft effortlessly. The elf's high-pitched moans remind you that you are doing all of the work here. Displeased, you grind down against [hisher] face.", parse);
						Text.NL();
						Text.Add("<i>\"Hey, show a little effort,\"</i> you complain, withdrawing your fingers from [name]'s [kVagDesc]. The elf opens [hisher] legs wider in response. [HisHer] [kTongueDesc] starting work on your nethers, your submissive companion reaches down between [hisher] legs, meekly spreading [hisher] labia for you. The sight makes your mouth water.", parse);
						Text.NL();
						if(player.Mouth().tongueLength.Get() > 15) {
							parse["virgin"] = kiakai.FirstVag().virgin ? " where no dick has gone before it" : "'s deflowered tunnel";
							Text.Add("Your snake-like tongue dives into [name]'s welcoming snatch, boring deep inside [himher]. The sheer length of your appendage makes it a rival of any cock as far as penetration goes, drilling into the elf[virgin].", parse);
							Text.NL();
							Text.Add("Tastebuds all along your engorged organ sample [name]'s clear liquids, and you hungrily slurp them up as you thrust your [tongueDesc] into the willing elf. Without warning, [hisher] tunnel clamps down around you, and you feel the elf spasm beneath you.", parse);
						}
						else {
							Text.Add("You are hard pressed to resist such a pretty gift, and greedily dig in. Slurping up any stray liquids trickling from the inviting slit, you let your [tongueDesc] play a bit with [name]'s [kVagDesc] before focusing on [hisher] [kClitDesc].", parse);
							Text.NL();
							Text.Add("After preparing the elf with kisses, licks, and nibs, you envelop [hisher] [kClitDesc] completely, taking it into your mouth. Ever so carefully, you gently bite at the sensitive nub, sending sparks of electricity racing straight up the surprised elf's spine. Overwhelmed by the pleasure, [heshe] cries out, [hisher] back arching, pressing [himher] against your [breastDesc].", parse);
						}
						Text.NL();
						Text.Add("Really, [name] needs to be trained better than this, <i>[heshe]</i> should be the one pleasuring you, not the other way around. Climaxing or not, you're going to make [himher] work for it. You slowly gyrate your hips, reasoning that if the elf can't keep up, you'll make a concerted effort on your own.", parse);
						Text.NL();
						
						KIAI2();
						
						Text.Flush();
						
						Gui.NextPrompt(function() {
							Text.Clear();
							Text.Add("There, much better.", parse);
							Text.NL();
							Text.Add("You aren't done with your little elf just yet though. No sooner has [heshe] finished trembling from [hisher] last climax than you jump right back in, this time using both your hands and your [tongueDesc] to drive [himher] toward another orgasm.", parse);
							Text.NL();
							Text.Add("It's not long before your plans come to fruition in a sticky, sloppy mess. You possessively pat [name]'s mound before getting up, gathering your gear.", parse);
							Text.Flush();
							
							kiakai.flags["Sexed"]++;
							
							kiakai.subDom.DecreaseStat(-30, 1);
							
							kiakai.AddLustFraction(-1);
							player.AddLustFraction(-1);
				
							Gui.NextPrompt(kiakai.Interact);
						});
						
						
					}, enabled : true,
					tooltip : Text.Parse("Focus on [hisher] [kVagDesc].", parse)
				});
			}
			options.push({ nameStr : "Anal",
				func : function() {
					parse["s"]     = kiakai.NumCocks() > 1 ? "s" : "";
					parse["notEs"] = kiakai.NumCocks() > 1 ? "" : "es";
					parse["itsTheir"] = kiakai.NumCocks() > 1 ? "their" : "its";
					Text.Clear();
					if(kiakai.FirstCock()) {
						Text.Add("[name]'s [kMultiCockDesc] twitch[notEs] hopefully, but you've got other things in mind. Circumventing the erect member[s], you spread [hisher] cheeks, exposing [hisher] [kAnusDesc].", parse);
					}
					else if(kiakai.FirstVag()) {
						Text.Add("[name]'s [kVagDesc] sure looks tempting, but you are interested in another orifice right now. Spreading [hisher] cheeks, you expose [hisher] [kAnusDesc], ripe for the picking.", parse);
					}
					else {
						Text.Add("Given little else to work with, you decide to focus on [name]'s [kButtDesc]. You let your fingers trail down [hisher] taint, reaching for [hisher] [kAnusDesc].", parse);
					}
					Text.NL();
					var eagerness = kiakai.flags["AnalExp"] * (1+kiakai.LustLevel()+kiakai.Butt().stretch.Get()/5);
					if(eagerness < 50) {
						Text.Add("You attempt to push some of your fingers into the elf's tight rosebud, but you are immediately met with resistance. Only with a lot of effort and a bit of saliva do you manage to breach [hisher] defenses, plunging first one, then two fingers into [hisher] stubborn hole.", parse);
					}
					else {
						Text.Add("The elf's well-trained sphincter opens effortlessly the moment you apply a tiny bit of pressure on it, greedily swallowing three of your fingers without any trouble. The ease only goes to show the amount of anal experience [heshe] has accumulated over your travels together.", parse);
					}
					Text.NL();
					Text.Add("You quickly build a rhythm, repeatedly pushing your fingers inside [name], up to the knuckle. Each time, the passage is a bit easier, as the elf begins to adjust to your insistent intrusion. Pretty soon, the elf's dilated anus allows you to add another finger to your exploration team. [name] groans, but clearly appreciates your efforts.", parse);
					Text.NL();
					Text.Add("Pulling your slick digits out of [himher], you allow [hisher] ring muscle to close a bit before resuming your thrusting, repeating the initial penetration a few times. Before long, you've exhausted [hisher] endurance, leaving [hisher] opening gaping slightly each time you vacate it.", parse);
					Text.NL();
					
					KIAI1();
					
					Text.NL();
					parse["cuntTaint"] = kiakai.FirstVag() ? "cunt" : "taint";
					Text.Add("Switching gears, you use fingers from both hands to spread [name]'s asshole, opening the pink rosebud for you like a blooming flower. Leaning in, you let your [tongueDesc] rake across [hisher] sensitive [cuntTaint] before finding its target, boring deep inside [name]'s [kAnusDesc].", parse);
					Text.NL();
					Text.Add("You gyrate your [hipsDesc] slowly, pressing your [genDesc] against [name], urging [himher] to fulfil [hisher] end of the bargain. Without pause, you continue to focus on the elf's butt, licking the meticulously clean orifice, teasing [himher] mercilessly.", parse);
					Text.NL();
					Text.Add("You ask [himher] if [heshe] wants you to keep going. Moaning affirmation. How deep? Loud moan. You flex your fingers, a wicked smile on your face. This time, entry is easier, as [name] has relaxed completely, accepting whatever you push into [himher].", parse);
					
					parse["penDesc"] = function() { return Text.Parse("the [toyDesc]", parse); };
					
					var options = new Array();
					options.push({ nameStr : "Fingers",
						func : function() {
							parse["penDesc"] = function() { return Math.random() > 0.5 ? "your fingers" : "your digits"; };
							Text.Clear();
							Text.Add("By now, three fingers hardly offer any resistance, so you add another one to the mix. You build up a rapid rhythm, plunging deep inside [name]'s [kAnusDesc].", parse);
							if(kiakai.FirstCock())
								Text.Add(" Cupping them and pushing them in up to the knuckles, you just about manage to reach [hisher] prostate, prodding the sensitive organ with each thrust.", parse);
							PrintDefaultOptions();
						}, enabled : true,
						tooltip : "Use your fingers."
					});
					if(player.Mouth().tongueLength.Get() > 15) {
						options.push({ nameStr : "Tongue",
							func : function() {
								parse["penDesc"] = function() { Text.Parse("your [tongueDesc]", parse); };
								Text.Clear();
								Text.Add("Your [tongueDesc], rival of a cock in length, snakes out and buries itself deep inside [name], immediately beginning to thrust in and out.", parse);
								if(kiakai.FirstCock())
									Text.Add(" Due to your size, you can easily reach [hisher] prostate, each thrust mashing your [tongueDesc] against the sensitive organ.", parse);
								PrintDefaultOptions();
							}, enabled : true,
							tooltip : Text.Parse("Use your [tongueDesc].", parse)
						});
					}
					
					var addToy = function(toy) {
						if(party.inventory.QueryNum(toy)) {
							var toySize = toy.cock.length.Get();
							var cap = kiakai.Butt().capacity.Get() * (0.75 + kiakai.LustLevel() + kiakai.flags["AnalExp"] / 100);
							options.push({ nameStr : toy.name,
								func : function() {
									parse["toyDesc"] = toy.name;
									parse["penDesc"] = "the " + toy.name;
									Text.Clear();
									Text.Add("Leaving [name]'s hole unattended for a moment, you rummage through your inventory, triumphantly pulling out your [toyDesc].", parse);
									Text.NL();
									Text.Add("<i>\"Hey, [name], think you can take this?\"</i> You grin, waving the toy over your shoulder.", parse);
									Text.NL();
									
									if(toySize > cap) {
										Text.Add("[name] looks panicky, but in [hisher] current position, there isn't much that [heshe] can do to stop you. [HeShe] fervently tries to shake [hisher] head, but [heshe] can barely move thanks to your legs trapping [himher] on either side.", parse);
										Text.NL();
										Text.Add("<i>\"Ha... wanna bet?\"</i> You smile as you lube up the [toyDesc], preparing it for entry. You aren't completely heartless, after all. Initial penetration is a bit difficult, but your previous probing pays off, allowing [name] to somehow accomodate the [toyDesc]. Without missing a beat, you begin the slow and inexorable process of stuffing the entire thing inside the submissive elf. A third... half... each time you thrust it inside, a little more of the huge toy probes [hisher] depths.", parse);
									}
									else if(toySize > cap/2) {
										parse["cuntAss"] = player.FirstVag() ? "cunt" : "ass";
										Text.Add("[name]'s eyes widen slightly as you brandish the large toy, but, bravely or lustfully, you are not sure, [heshe] doesn't voice any complaints.", parse);
										if(player.FirstCock())
											Text.Add(" The cock lodged in [hisher] throat might also have something to do with it.", parse);
										else if(player.FirstVag())
											Text.Add(" That [hisher] [kTongueDesc] is buried in your [cuntAss] might also have something to do with it.", parse);
										Text.NL();
										Text.Add("With the help of some lube, you are able to stuff the [toyDesc] into the elf with relative ease, only meeting serious resistance once most of the toy rests deep within [himher].", parse);
									}
									else {
										Text.Add("[name] looks a bit dubious, but nods slightly, giving [hisher] consent. With the help of a little lube, the penetration is almost effortless, the elf's [kAnusDesc] easily spreading around the [toyDesc]. You begin to thrust the toy into [himher] rapidly, relying on speed rather than size to get the elf off.", parse);
									}
									kiakai.flags["AnalExp"]++;
									PrintDefaultOptions();
								}, enabled : toySize < 2*cap,
								tooltip : Text.Parse("Use [toy] on [name].", {name: kiakai.name, toy: toy.name})
							});
						}
					};
					
					addToy(Items.Toys.SmallDildo);
					addToy(Items.Toys.MediumDildo);
					addToy(Items.Toys.LargeDildo);
					addToy(Items.Toys.ThinDildo);
					addToy(Items.Toys.ButtPlug);
					addToy(Items.Toys.LargeButtPlug);
					addToy(Items.Toys.AnalBeads);
					addToy(Items.Toys.LargeAnalBeads);
					addToy(Items.Toys.EquineDildo);
					addToy(Items.Toys.CanidDildo);
					addToy(Items.Toys.ChimeraDildo);
					
					if(options.length > 1) {
						Text.NL();
						Text.Add("...Which gives you a naughty idea.", parse);
						Text.Flush();
						Gui.SetButtonsFromList(options);
					}
					else {
						Text.Flush();
						Gui.NextPrompt(options[0].func);
					}
					
					Gui.Callstack.push(function() {
						Text.NL();
						Text.Add("It's not long before [name]'s filled [kAnusDesc] constricts, and the elf's entire body shakes in pleasure. With a nudge of your [hipsDesc], you remind [himher] to return the favour. [HeShe] meekly complies, going down on your nethers with renewed vigor.", parse);
						Text.NL();
						
						KIAI2();
						
						Text.NL();
						Text.Add("You have barely gotten started. You resume pumping [penDesc] in and out of [name]. It doesn't take long before [name] is overwhelmed by another anal orgasm, yet you keep going.", parse);
						if(kiakai.FirstCock()) {
							Text.NL();
							Text.Add("Weak jets of elven cum add to the already substantial mess on the elf's stomach, painting [himher] a sticky white. [HisHer] [kMultiCockDesc] twitch[notEs] pitifully, completely milked of [itsTheir] contents.", parse);
						}
						else if(kiakai.FirstVag()) {
							Text.NL();
							Text.Add("Streams of clear liquid flow from the elf's [kVagDesc], further lubing [penDesc], making your thrusts even smoother.", parse);
						}
						Text.Flush();
					
						Gui.NextPrompt(function() {
							Text.Clear();
							Text.Add("Finally, you figure enough is enough. [name] probably can't cum more anyway. Gathering up your gear, you poke at the exhausted elf, telling [himher] to get up. [HeShe] scrambles after you, still disoriented.", parse);
							Text.Flush();
							
							kiakai.flags["AnalExp"]++;
							kiakai.flags["Sexed"]++;
							
							kiakai.subDom.DecreaseStat(-30, 1);
							
							kiakai.AddLustFraction(-1);
							player.AddLustFraction(-1);
				
							Gui.NextPrompt(kiakai.Interact);
						});
					});
				}, enabled : true,
				tooltip : Text.Parse("Have some fun with [hisher] butt.", parse)
			});
			Gui.SetButtonsFromList(options);
			
			
			
		}, enabled : true,
		tooltip : Text.Parse("Have [name] get down on [hisher] back and mount [himher], giving you full access to their own genitalia.", parse)
	});
	options.push({ nameStr : "Anal",
		func : function() {
			Text.Clear();
			
			// First time
			if(kiakai.flags["AnalExp"] < 2) {
				Text.AddOutput("<i>\"Like what you see?\"</i> you tease the prone elf, shuffling your hips slightly, bringing your [genDesc] closer to [hisher] face. [name]'s face is bright red at this point, unable to tear [hisher] eyes off you.", parse);
				Text.Newline();
				Text.AddOutput("Suddenly getting a very naughty idea, you reach down and touch the elf's forehead, mock concern in your voice. <i>\"[name]! Your skin is burning, are you ok?\"</i>", parse);
				Text.Newline();
				Text.AddOutput("Mumbling, [name] assures you that [heshe] is fine, avoiding your gaze, but you'll have none of it. <i>\"Can't have the healer getting a fever, can we?\"</i> You instruct your companion to lay down across your lap, face down. A bit doubtful, the elf complies to your wishes. [HeShe] shudders slightly as [hisher] [kGenDesc] accidentally brush against your leg. Apologetically, [heshe] shifts around, raising [hisher] butt to break the contact. This, coincidentally, suits your intentions perfectly.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"I'm going to take your temperature,\"</i> you announce, licking two of your fingers in preparation. <i>\"It might sting a bit at first, but don't worry, you tended to me and now I will tend to you.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"[playername], this really is not neces- AAAHHH!\"</i> [name]'s complaint is suddenly cut off, as you press two fingers into [hisher] tight rosebud. The quivering elf moans in confused appreciation as you probe deeper, exploring [hisher] back passage.", parse);
				Text.Newline();
				
				if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
					Text.AddOutput("<i>\"W-what are you doing?!\"</i> [name] sounds confused and slightly frightened. You assure [himher] that there is nothing to worry about, and that [heshe] shouldn't be such a baby.", parse);
				else
					Text.AddOutput("<i>\"A-Are you really sure that is- haah! -the right way to do it?\"</i> [name] groans, uncertain but seemingly putting [hisher] trust in you.", parse);
				Text.Newline();
				
				Text.AddOutput("Knuckle-deep, you make some show of probing around", parse);
				if(kiakai.FirstCock())
					Text.AddOutput(", inadvertently pushing against [hisher] prostate", parse);
				Text.AddOutput(". The elf, despite [hisher] protests, seems to be really getting into it, if the fluids dripping on your thighs are any indication.", parse);
				Text.Newline();
				
				if(kiakai.flags["AnalExp"] == 1) {
					Text.AddOutput("<i>\"You really seem to like this kind of stuff, you know,\"</i> you muse, reminding [himher] of your first meeting, and the way it ended.", parse);
					Text.Newline();
				}
				
				Text.AddOutput("Deftly pumping your fingers in and out of the quivering elf, you commend [himher] for being such a good [boygirl]. [name]'s only response is a whorish moan as you rail [hisher] [anusDesc].", parse);
				Text.Newline();
				Text.AddOutput("Deciding that you are done for now, you withdraw your fingers, allowing the elf some breathing room. <i>\"You seem to be fine,\"</i> you assure your panting companion, <i>\"but I might have to check again later.\"</i> With that, you give [name] a playful swat on [hisher] butt, telling [himher] to get dressed.", parse);

				player.AddSexExp(5);
				kiakai.AddSexExp(5);
				kiakai.subDom.DecreaseStat(-100, 5);
				kiakai.flags["AnalExp"] = 2;
				kiakai.flags["Sexed"]++;
			}
			// REPEAT SCENE
			// TODO: ADD TOYS SCENE
			else {
				Text.AddOutput("<i>\"It was a while since I checked your temperature last,\"</i> you muse suggestively, absently patting your thigh. [name] [analAtt] sits on your lap, waiting to see what you will do next. Languidly, you caress [hisher] cheek, before lazily wriggling your fingers in front of [hisher] face. Hypnotized, the elf's eyes follow your movements attentively.", parse);
				Text.Newline();
				
				var numFingers = 0;
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.AddOutput("<i>\"You know well what's coming,\"</i> you tease [himher], sucking on first one, then another, and finally a third finger. [name]'s eyes widen slightly with each digit you prepare, gulping.", parse);
					numFingers = 3;
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.AddOutput("<i>\"Tell you what, this time, why don't you decide?\"</i> you suggest, presenting [name] with your hand, urging [himher] to prepare as many as [heshe] thinks [heshe] can take.", parse);
					Text.Newline();
					
					numFingers = (kiakai.LustLevel() + 2) * Math.log(kiakai.flags["AnalExp"]);
					if(numFingers < 1) numFingers = 1;
					if(numFingers > 5) numFingers = 5;
					numFingers = Math.floor(numFingers);
					
					switch(numFingers) {
						default:
						case 1: Text.AddOutput("Uncertain, the elf puts one of your offered digits into [hisher] mouth, avoiding your slightly disappointed gaze.", parse); break;
						case 2: Text.AddOutput("[name] licks and sucks at two of your offered digits, getting them ready.", parse); break;
						case 3: Text.AddOutput("Slightly fearful, [name] choses to lather three of your offered fingers. You smile at [himher] encouragingly, knowing [heshe] can probably take them.", parse); break;
						case 4: Text.AddOutput("Lustfully inspecting your fingers, [name] prepares one after another, lathering up four of them with [hisher] tongue.", parse); break;
						case 5: Text.AddOutput("Unmistakable lust in [hisher] eyes, [name] eagerly lathers each of your fingers slowly, coating all of them in saliva. When [heshe] is done with your fingers, the elf proceeds to lick the back of your hand.", parse); break;
					}
				}, 1.0, function() { return true; });
				scenes.Get();
				
				player.AddSexExp(2);
				kiakai.AddSexExp(numFingers);
				
				Text.Newline();
				
				parse.numFingers = Text.NumToText(numFingers);
				parse.s = numFingers > 1 ? "s" : "";
				
				Text.AddOutput("<i>\"Now then...\"</i> in a sultry voice, you coax [name] to shuffle around in your lap, presenting you with [hisher] butt. Knowing what to expect, the elf shudders in pleasure as you insert your first finger into [hisher] [kAnusDesc].", parse);
				if(numFingers > 1) {
					Text.Newline();
					Text.AddOutput("Gradually spreading [name]'s back passage for easier access, you put another finger in.", parse);
					if(numFingers > 2) {
						Text.AddOutput(" You keep it up until all your [numFingers] fingers are prodding at [hisher] insides.", parse);
						if(numFingers >= 5) {
							Text.AddOutput(" Even as flexible as [name] has become, you are a bit doubtful about pushing your whole hand in there, can [heshe] really take it?", parse);
						}
					}
				}
				
				Text.Newline();
				Text.AddOutput("Easing into a slow but insistent rhythm, you piston your finger[s] up to the knuckle[s], your other hand busy stroking the elf's hair, whispering to [himher] to endure, that this is for [hisher] own good. [name] is biting [hisher] lip cutely, trying and failing to stifle [hisher] undignified moans.", parse);
				Text.Newline();
				
				if(numFingers < 5) {
					Text.AddOutput("<i>\"I think you are growing to like this,\"</i> you comment on [name]'s whimpering moans. <i>\"I-it is just to see that I am healthy, right?\"</i> the elf gasps between [hisher] cries of pleasure.", parse);
					Text.Newline();
					Text.AddOutput("<i>\"Oh, you seem to be <b>very</b> healthy indeed,\"</i> you congratulate your companion, one hand busy caressing [hisher] silky hair, the other deep inside [hisher] [kAnusDesc].", parse);
					Text.Newline();
					Text.AddOutput("Increasing your pace, you bring the horny elf to a shuddering climax", parse);
					if(kiakai.FirstCock())
						Text.AddOutput(", [hisher] [kCockDesc] depositing its load on your legs", parse);
					if(kiakai.FirstVag())
						Text.AddOutput(", a trickle of feminine juices trailing down [hisher] leg from [hisher] [kVagDesc]", parse);
					Text.AddOutput(".", parse);
				}
				else {
					Text.AddOutput("<i>\"You asked for it, horny little elf,\"</i> you mutter under your breath, slowly pushing more and more of your hand into [hisher] [kAnusDesc]. [name] cries out loudly, if in pleasure or pain you cannot tell, as the widest part of your hand suddenly pops past [hisher] formerly tight ring.", parse);
					Text.Newline();
					Text.AddOutput("Almost surprised yourself, you chuckle as you allow the elf some time to relax before exploring the extent of your newfound reach. You can push a fair bit of your arm up [hisher] [kAnusDesc] before encountering resistance.", parse);
					Text.Newline();
					Text.AddOutput("<i>\"Mm, seems I have trained you well, [name],\"</i> you tease the elf as your fist wreak havoc on [hisher] insides.", parse);
					Text.Newline();
					
					if(kiakai.FirstCock()) {
						Text.AddOutput("Settling to a halt far inside, you cup your hand, massaging [hisher] prostate. This almost immediately causes the delirious elf to launch into orgasm, [hisher] [kCockDesc] painting sticky trails across your thighs.", parse);
					}
					else {
						Text.AddOutput("Taking care not to harm [himher], you slowly pump your arm in and out of [name]. The elf seems to be very happy with your treatment, begging for you to go faster, go deeper. Shuddering, [hisher] [kVagDesc] finally gives in, leaking girly fluids across your thighs.", parse);
					}
				}
				
				Text.Newline();
				if(Math.random() < 0.8)
					Text.AddOutput("<i>\"I-I do not have a fever, do I?\"</i> [name] asks you, <i>\"I feel a bit weird...\"</i> You assure [himher] that [heshe] is fine.", parse);
				else
					Text.AddOutput("<i>\"Y-you are so rough with your healing,\"</i> [name] mutters, <i>\"yet it feels good...\"</i> You can only smile as the elf reveals [hisher] true colors.", parse);
				Text.Newline();
				Text.AddOutput("You pull out of the tight canal and leave the elf in a trembling pile, looking around for somewhere to get cleaned up.", parse);
			}
			
			player.AddLustFraction(0.1);
			kiakai.AddLustFraction(-1);
			kiakai.flags["Sexed"]++;
			Gui.NextPrompt(kiakai.Interact);
		}, enabled : true,
		tooltip : "Train your elf, using your fingers."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Kiakai.Sex = function() {
	Text.Clear();
	
	// TODO Toys
	var playerCock = player.FirstCock() || (player.strapOn ? player.strapOn.cock : null);
	var kiaiCock   = kiakai.FirstCock() || (kiakai.strapOn ? kiakai.strapOn.cock : null);
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,
		heshe        : kiakai.heshe(),
		HeShe        : kiakai.HeShe(),
		himher       : kiakai.himher(),
		hisher       : kiakai.hisher(),
		hishers      : kiakai.hishers(),
		HisHer       : kiakai.HisHer(),
		kCockDesc    : function() { return kiaiCock.Short(); },
		kCockTip     : function() { return kiaiCock.TipShort(); },
		kCockDesc2   : function() { return kiakai.AllCocks()[1].Short(); },
		kMultiCockDesc : function() { return kiakai.MultiCockDesc(); },
		kBallsDesc   : function() { return kiakai.BallsDesc(); },
		kVagDesc     : function() { return kiakai.FirstVag().Short(); },
		kClitDesc    : function() { return kiakai.FirstVag().ClitShort(); },
		kBreastDesc  : function() { return kiakai.FirstBreastRow().Short(); },
		kNipsDesc    : function() { return kiakai.FirstBreastRow().NipsShort(); },
		kTongueDesc  : function() { return kiakai.TongueDesc(); },
		kButtDesc    : function() { return kiakai.Butt().Short(); },
		kAnusDesc    : function() { return kiakai.Butt().AnalShort(); },
		kHipsDesc    : function() { return kiakai.HipsDesc(); },
		kStomachDesc : function() { return kiakai.StomachDesc(); },
		breastDesc   : function() { return player.FirstBreastRow().Short(); },
		nipsDesc     : function() { return player.FirstBreastRow().NipsShort(); },
		cockDesc     : function() { return playerCock.Short(); },
		cockTip      : function() { return playerCock.TipShort(); },
		ballsDesc    : function() { return player.BallsDesc(); },
		tongueDesc   : function() { return player.TongueDesc(); },
		buttDesc     : function() { return player.Butt().Short(); },
		multiCockDesc: function() { return player.MultiCockDesc(); },
		vagDesc      : function() { return player.FirstVag().Short(); },
		clitDesc     : function() { return player.FirstVag().ClitShort(); },
		hipsDesc     : function() { return player.HipsDesc(); },
		armor        : function() { return player.ArmorDesc(); },
		hairDesc     : function() { return player.Hair().Short(); },
		boygirl      : kiakai.body.femininity.Get() > 0 ? "girl" : "boy",
		anusDesc     : function() { return player.Butt().AnalShort(); },
		stomachDesc  : function() { return player.StomachDesc(); }
	};
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.genDesc = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	parse.kGenDesc = kiakai.FirstCock() ? function() { return kiakai.MultiCockDesc(); } :
					kiakai.FirstVag() ? function() { return kiakai.FirstVag().Short(); } :
					"featureless crotch";
					
	if(kiakai.flags["TalkedSex"] == 0) {
		Text.Add("<i>\"[name]...\"</i> you start out, uncertain how to broach the topic.", parse);
		Text.NL();
		Text.Add("<i>\"Yes, [playername], what is on your mind?\"</i> the elf responds curiously.", parse);
		Text.NL();
		Text.Add("You remind [himher] of the many... intimate moments that the two of you have shared. [name] blushes as [heshe] recalls some of your ranchier adventures. Does [heshe] want to... take things a step further?", parse);
		Text.NL();
		Text.Add("<i>\"W-what do you mean?\"</i> [name]'s gaze flicks about nervously, reminding you of a cornered deer. You draw a lock of hair out of [hisher] eyes, framing the elf's pretty, feminine face. This does nothing to calm [himher] down.", parse);
		Text.NL();
		Text.Add("What approach should you take to convince the elf?", parse);
		Text.Flush();

		kiakai.AddLustFraction(1);
		
		//[Love][Friend][Fuck][Nevermind]
		var options = new Array();
		options.push({ nameStr : "Love",
			func : function() {
				Text.Clear();
				Text.Add("You pour your heart out to your companion.", parse);
				Text.NL();
				Text.Add("<i>\"[playername], I... I do not know what to say,\"</i> [name] stammers, flustered. <i>\"I... I like you too, of course... I...\"</i> [HeShe] averts [hisher] gaze, continuing in a small voice, <i>\"I... like you a lot.\"</i>", parse);
				Text.NL();
				Text.Add("You pull [name] into a tight embrace, hugging [himher] close. Your hands trace down [hisher] spine, caressing [hisher] [kButtDesc]. The elf, who is pressed tightly against your [breastDesc], gives a surprised yelp. You whisper in [hisher] ear that you are there for [himher], that you want [himher], right here, right now.", parse);
				Text.NL();
				Text.Add("<i>\"I... I...\"</i> Almost tearful, [name] pushes you away. <i>\"I cannot, [playername], please do not ask this of me. Resisting is too difficult.\"</i> You restrain yourself from reaching out to the vulnerable elf, giving [himher] some space. [name] moves away, throwing a peek at you now and then.", parse);
				Text.NL();
				Text.Add("There seems to be something deeper at works here that you have to deal with before broaching the subject again.", parse);
				Text.Flush();
				
				kiakai.relation.IncreaseStat(100, 15);
				kiakai.subDom.IncreaseStat(0, 10);
				kiakai.flags["Attitude"] = Kiakai.Attitude.Nice;
				kiakai.flags["TalkedSex"] = 1;
				
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral || kiakai.relation.Get() > 10,
			tooltip : "Confess that you love the elf."
		});
		options.push({ nameStr : "Friend",
			func : function() {
				Text.Clear();
				Text.Add("The two of you have gotten to know each other by now, right?", parse);
				Text.NL();
				Text.Add("<i>\"Uhm, I suppose?\"</i> [name] still looks a bit uncertain. You take [hisher] hand into yours, pulling [himher] closer. Quite honestly, you express that you couldn't have made it on Eden without [hisher] help, and you want to express your gratitude. You want [himher] to feel special.", parse);
				Text.NL();
				Text.Add("<i>\"I... I did not know you felt that way about it, [playername],\"</i> [name] blushes prettily, happy with [himher]self. <i>\"I am glad that I have been of use to you.\"</i>", parse);
				Text.NL();
				Text.Add("You explain that [heshe] is much more than that to you. Pulling [himher] close, you whisper in [hisher] ear that if [heshe]'ll let you, you will show [himher] your appreciation in a far more intimate manner.", parse);
				Text.NL();
				Text.Add("As the coin finally drops for [name], [heshe] begins to stutter a confused response. You silence [himher] with a kiss on the lips. For a moment, the two of you are joined, one being, hearts beating as one.", parse);
				Text.NL();
				Text.Add("Far too soon, [name] pushes you away. <i>\"I... I really cannot, [playername], as much as I would like to.\"</i> The elf looks defeated as [heshe] walks off, leaving you alone.", parse);
				Text.NL();
				Text.Add("There seems to be something deeper at works here that you have to deal with before broaching the subject again.", parse);
				Text.Flush();
				
				kiakai.relation.IncreaseStat(100, 5);
				kiakai.flags["TalkedSex"] = 1;
				
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : kiakai.relation.Get() > 0,
			tooltip : "With all that you've gone through together, shouldn't the two of you try to get a bit closer?"
		});
		options.push({ nameStr : "Fuck",
			func : function() {
				Text.Clear();
				Text.Add("You ask [name], quite bluntly, if [heshe] wants to have sex with you. For a long time, [heshe] does nothing but stare at you in disbelief, mouth opening and closing as the elf tries to form a coherent sentence in [hisher] mind.", parse);
				Text.NL();
				Text.Add("<i>\"W-why this all of a sudden?\"</i> [heshe] asks, bewildered. <i>\"I... I cannot agree to something like that!\"</i> [heshe] splutters.", parse);
				Text.NL();
				Text.Add("How come? [HeShe] seemed perfectly happy about it just before, the way [heshe] was moaning.", parse);
				Text.NL();
				Text.Add("<i>\"That is different!\"</i> the elf exclaims, eyes darting around, looking for a way to escape. <i>\"The arts of healing are nothing as perverse as that!\"</i> Considering the lewd sounds you've heard [name] make, you'd beg to differ. [HeShe]'d be better off just bending over and accepting it, you'll have [himher] screaming in pleasure in no time.", parse);
				Text.NL();
				Text.Add("<i>\"N-no!\"</i> [name] blurts out, hastily moving off, blushing furiously.", parse);
				Text.NL();
				Text.Add("There seems to be something deeper at works here that you have to deal with before broaching the subject again.", parse);
				Text.Flush();
				
				kiakai.relation.DecreaseStat(-100, 5);
				kiakai.subDom.DecreaseStat(-35, 10);
				kiakai.flags["Attitude"] = Kiakai.Attitude.Naughty;
				kiakai.flags["TalkedSex"] = 1;
				
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : kiakai.subDom.Get() < -25 || kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral,
			tooltip : Text.Parse("Ask [himher] to put out.", parse)
		});
		options.push({ nameStr : "Nevermind",
			func : function() {
				Text.Clear();
				Text.Add("You decide to drop the topic for now, though [name] looks at you with uncertainty.", parse);
				Text.Flush();
				
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : true,
			tooltip : "No, this isn't the time."
		});
		Gui.SetButtonsFromList(options);
	}
	// TODO: Reactivate for kiai cock scene
	else if(!playerCock && !kiaiCock) {
		Text.Add("Unfortunately, you lack the appropriate equipment.", parse);
		Text.Flush();
		
		Gui.NextPrompt(kiakai.Interact);
	}
	else if(kiakai.flags["TalkedSex"] == 2) {
		Text.Add("You ask [name] if [heshe] remembers what you talked about before. [HeShe] blushes once [heshe] realize what you mean.", parse);
		Text.NL();
		Text.Add("<i>\"R-really? Here? Now?\"</i> [heshe] mumbles, fiddling with the hem of [hisher] dress. <i>\"V-very well. How... will you have me?\"</i>", parse);
		Text.Flush();
		
		kiakai.relation.IncreaseStat(100, 5);
		
		//[Passive][Mutual][Dig in]
		var options = new Array();
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("<i>\"Have you...? Don't you think it's time you took some initiative?\"</i> you challenge the elf.", parse);
				Text.NL();
				Text.Add("<i>\"I... Ah...\"</i> [name] looks a bit nervous, as if [heshe] isn't sure on how to proceed.", parse);
				Text.NL();
				Text.Add("<i>\"Come now,\"</i> you tease as you begin to remove your gear, <i>\"don't you remember when we first met? You seemed to have the right idea at the time.\"</i>", parse);
				Text.NL();
				Text.Add("<i>\"T-that was something I had to do!\"</i> the elf exclaims, flustered, <i>\"had I not cared for you...\"</i> [HeShe] trails off, as [heshe] realizes that you are just messing with [himher]. [name] gathers [hisher] courage, blushing as memories of your many sexual encounters wash over [himher]. By accounts of all the things you have done together, this shouldn't really bother the elf, yet [heshe] is fidgeting, dragging out the process of removing [hisher] clothes.", parse);
				Text.NL();
				Text.Add("<i>\"Well, won't you tell me what to do?\"</i> you murmur provocatively, twirling around in a circle to show off yourself. <i>\"You should have a few ideas after our little talk.\"</i>", parse);
				Text.NL();
				Text.Add("<i>\"[playername]... I would like...\"</i> [name] stammers.", parse);
				Text.Flush();
				
				kiakai.subDom.IncreaseStat(20, 10);
				
				kiakai.flags["TalkedSex"] = 3;
				Scenes.Kiakai.SexPrompt(Kiakai.SexFirstAttitude.Passive);
			}, enabled : true,
			tooltip : Text.Parse("Encourage [himher] take the lead.", parse)
		});
		options.push({ nameStr : "Mutual",
			func : function() {
				Text.Clear();
				Text.Add("You respond by kissing the elf deeply, your [tongueDesc] copulating with [hishers], betraying your eagerness. Once [hisher] initial surprise has worn off, [name] begins to return your feelings, and the two of you melt into each other's arms.", parse);
				Text.NL();
				Text.Add("As if in a frenzy, the two of you remove your gear, pawing at each other's bodies. The elf seems just as into it as you are, shamelessly groping you. After an eternity, you break apart, with [name] panting, [hisher] hot breath coming in short bursts.", parse);
				Text.NL();
				Text.Add("<i>\"Getting hot and bothered, aren't you?\"</i> you murmur, <i>\"what do you think we should do about it?\"</i>", parse);
				Text.NL();
				Text.Add("<i>\"I... I think, um...\"</i> [name] leans forward and whisper something in your ear.", parse);
				Text.NL();
				Text.Add("<i>\"Why you naughty [boygirl]... just what I was thinking,\"</i> you purr, licking your lips.", parse);
				Text.Flush();
				
				kiakai.flags["TalkedSex"] = 3;
				Scenes.Kiakai.SexPrompt(Kiakai.SexFirstAttitude.Mutual);
			}, enabled : true,
			tooltip : "Explore each other's bodies."
		});
		options.push({ nameStr : "Dig in",
			func : function() {
				Text.Clear();
				Text.Add("<i>\"Mmm... first, get those pesky clothes out of the way.\"</i> As [name] hastily complies, you sit back and enjoy the view, appreciating [hisher] impromptu striptease. Once [heshe] is completely nude, you instruct [himher] to show off the goods.", parse);
				Text.NL();
				Text.Add("Blushing at your language, [name] nonetheless obeys, turning around in a slow circle, sticking [hisher] butt out and wiggling it a bit.", parse);
				Text.NL();
				Text.Add("<i>\"Come on, you can do better than that,\"</i> you admonish [himher]. The elf pouts a bit, but tries to appease you. [HeShe] experimentally moves through several different poses, very conscious of your reaction to each.", parse);
				Text.NL();
				if(kiakai.FirstBreastRow())
					Text.Add("[name] cups [hisher] [kBreastDesc], pushing them together in an enticing manner. [HeShe] moans lightly as [heshe] tweaks the sensitive, stiff [kNipsDesc]. ", parse);
				if(kiakai.FirstCock()) {
					parse["s"]        = kiakai.NumCocks() > 1 ? "s" : "";
					parse["itsTheir"] = kiakai.NumCocks() > 1 ? "their" : "its";
					Text.Add("[HisHer] hand moving down between [hisher] legs, [name] strokes [hisher] [kMultiCockDesc] seductively, coaxing the shaft[s] to [itsTheir] full arousal. ", parse);
				}
				if(kiakai.FirstVag())
					Text.Add("[name] pries [hisher] lower lips apart with [hisher] fingers, revealing the pink flesh of [hisher] [kVagDesc] to you. Though wet and ready, you have promised you won't use it. ", parse);
				parse["vag"]   = kiakai.FirstVag()  ? Text.Parse(", [hisher] eager slit", parse) : "";
				parse["balls"] = kiakai.HasBalls()  ? Text.Parse(", [kBallsDesc]", parse) : "";
				parse["cock"]  = kiakai.FirstCock() ? Text.Parse(", dangling [kMultiCockDesc]", parse) : "";
				
				Text.Add("Finally, [name] twirls around, widens [hisher] stance and bends over in front of you. [HisHer] spread legs expose every part of [hisher] anatomy[vag][balls][cock], and [hisher] puckered rosebud. The elf peeks over [hisher] shoulder, gauging if the show is to your liking.", parse);
				Text.NL();
				Text.Add("You lick your lips as you shrug free of your gear. <i>\"Yes... just like that. Now play with yourself for me.\"</i> ", parse);
				if(kiakai.FirstCock()) {
					parse["oneof"] = kiakai.NumCocks() > 1 ? " one of" : "";
					Text.Add("[name] blushes, but grabs hold of[oneof] [hisher] [kMultiCockDesc], slowly jerking the member as [heshe] sways [hisher] [kHipsDesc] at you. ", parse);
				}
				else if(kiakai.FirstVag())
					Text.Add("[name] blushes, but dips the fingers of one hand into [hisher] slick [kVagDesc], teasing the outer folds. ", parse);
				Text.Add("The elf licks the digits of [hisher] other hand, coating them in slick saliva. Once sufficiently prepared, [heshe] eases one, then two fingers inside [hisher] [kAnusDesc].", parse);
				Text.NL();
				Text.Add("You can hardly contain your eagerness, all but wiggling your fingers as you edge closer to [name]. Reaching around, you pull the elf close to you, almost throwing [himher] off balance.", parse);
				if(player.FirstCock())
					Text.Add(" [HeShe] shivers as [heshe] feels your [multiCockDesc] rub against [hisher] butt.", parse);
				Text.NL();
				Text.Add("<i>\"Ready or not, here I come...\"</i> you growl in [hisher] ear.", parse);
				Text.Flush();
				
				kiakai.subDom.DecreaseStat(-50, 10);
				
				kiakai.flags["TalkedSex"] = 3;
				Scenes.Kiakai.SexPrompt(Kiakai.SexFirstAttitude.Assertive);
			}, enabled : true,
			tooltip : Text.Parse("Take [himher] then and there.", parse)
		});
		
		Gui.SetButtonsFromList(options);
	}
	else {
		var domStat = player.subDom.Get() - kiakai.subDom.Get();
		if(domStat > 50) {
			Text.Add("You state your desires bluntly, ordering the subservient elf to unclothe [himher]self.", parse);
			Text.NL();
			Text.Add("<i>\"Y-yes, [playername],\"</i> [name] meekly acknowledges [hisher] position, hurrying to comply with your wishes.", parse);
		}
		else if(domStat < -30) {
			Text.Add("Demurely, you ask [name] if [heshe] could be of service to you again, or if you could pleasure [himher] in some way. The elf looks a bit lost for a fleeting second, but somehow regains [hisher] composure, once [heshe] understands what you are asking.", parse);
		}
		else {
			Text.Add("Pulling [name] close, you whisper your intentions in [hisher] ear. The elf blushes, but does not complain about your suggestion.", parse);
		}
		Text.Add(" The two of you shrug out of your gear, facing each other as nude as the day you were born.", parse);
		Text.Flush();
		
		kiakai.relation.IncreaseStat(50, 1);
		
		Scenes.Kiakai.SexPrompt();
	}
}

Kiakai.SexFirstAttitude = {
	Passive   : 1,
	Mutual    : 2,
	Assertive : 3
};

Scenes.Kiakai.SexPrompt = function(attitude) {
	// TODO Toys
	var playerCock = player.FirstCock() || (player.strapOn ? player.strapOn.cock : null);
	var kiaiCock   = kiakai.FirstCock() || (kiakai.strapOn ? kiakai.strapOn.cock : null);
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,
		heshe        : kiakai.heshe(),
		HeShe        : kiakai.HeShe(),
		himher       : kiakai.himher(),
		hisher       : kiakai.hisher(),
		hishers      : kiakai.hishers(),
		HisHer       : kiakai.HisHer(),
		kCockDesc    : function() { return kiaiCock.Short(); },
		kCockTip     : function() { return kiaiCock.TipShort(); },
		kCockDesc2   : function() { return kiakai.AllCocks()[1].Short(); },
		kMultiCockDesc : function() { return kiakai.MultiCockDesc(); },
		kBallsDesc   : function() { return kiakai.BallsDesc(); },
		kVagDesc     : function() { return kiakai.FirstVag().Short(); },
		kClitDesc    : function() { return kiakai.FirstVag().ClitShort(); },
		kBreastDesc  : function() { return kiakai.FirstBreastRow().Short(); },
		kNipsDesc    : function() { return kiakai.FirstBreastRow().NipsShort(); },
		kTongueDesc  : function() { return kiakai.TongueDesc(); },
		kButtDesc    : function() { return kiakai.Butt().Short(); },
		kAnusDesc    : function() { return kiakai.Butt().AnalShort(); },
		kHipsDesc    : function() { return kiakai.HipsDesc(); },
		kStomachDesc : function() { return kiakai.StomachDesc(); },
		boygirl      : kiakai.body.femininity.Get() > 0 ? "girl" : "boy",
		breastDesc   : function() { return player.FirstBreastRow().Short(); },
		nipsDesc     : function() { return player.FirstBreastRow().NipsShort(); },
		cockDesc     : function() { return playerCock.Short(); },
		cockTip      : function() { return playerCock.TipShort(); },
		knotDesc     : function() { return playerCock.KnotShort(); },
		ballsDesc    : function() { return player.BallsDesc(); },
		tongueDesc   : function() { return player.TongueDesc(); },
		buttDesc     : function() { return player.Butt().Short(); },
		multiCockDesc: function() { return player.MultiCockDesc(); },
		vagDesc      : function() { return player.FirstVag().Short(); },
		clitDesc     : function() { return player.FirstVag().ClitShort(); },
		hipsDesc     : function() { return player.HipsDesc(); },
		armor        : function() { return player.ArmorDesc(); },
		hairDesc     : function() { return player.Hair().Short(); },
		anusDesc     : function() { return player.Butt().AnalShort(); },
		stomachDesc  : function() { return player.StomachDesc(); }
	};
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.genDesc = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	parse.kGenDesc = kiakai.FirstCock() ? function() { return kiakai.MultiCockDesc(); } :
					kiakai.FirstVag() ? function() { return kiakai.FirstVag().Short(); } :
					"featureless crotch";
	
	//Sex options
	var options = new Array();
	options.push({ nameStr : "Anal pitch",
		func : function() {
			Text.Clear();
			
			kiakai.relation.IncreaseStat(50, 2);
			
			var virgin = kiakai.Butt().virgin;
			
			if(attitude) {
				if(attitude == Kiakai.SexFirstAttitude.Passive) {
					Text.Add("<i>\"C-could you do that thing you said?\"</i> [name] nervously queries you. Smiling coyly, you ask the elf to be more specific.", parse);
					Text.NL();
					Text.Add("<i>\"Before, you said that... there were different ways to have penetrative sex,\"</i> [heshe] finishes lamely. Getting an incling of what [heshe] is after, you rub the elf's back, your hand trailing down towards [hisher] [kButtDesc].", parse);
					Text.NL();
					Text.Add("<i>\"Could it be... you mean <b>this</b>?\"</i> you punctuate your question by slapping [name]'s exposed cheeks.", parse);
					Text.NL();
					Text.Add("<i>\"Y-yes!\"</i> [name] yelps, jumping a little as a rosy blush starts to form on [hisher] behind, striving to match the one spread across [hisher] face.", parse);
					Text.NL();
					Text.Add("<i>\"To think that you would be that lewd... you really want me to stuff my [cockDesc] up your butt? Spread your cheeks and rail you, fill your insides completely?\"</i> As you tease the flustered elf, you hand sneaks in between [hisher] legs, starting to prepare your target for entry.", parse);
					Text.NL();
					Text.Add("<i>\"Yes,\"</i> the elf murmurs in a small voice. An involuntary shudder runs through [hisher] body as your probing finger pushes its way inside [hisher] pliant hole.", parse);
					Text.NL();
					if(kiakai.flags["AnalExp"] > 15) {
						Text.Add("<i>\"Always knew you were an anal slut, and now I have it from your own mouth!\"</i> you mercilessly tease.", parse);
						Text.NL();
					}
					Text.Add("<i>\"Enough, just do me already!\"</i> [name] moans, past caring about [hisher] precious dignity anymore. The elf flips over on hands and knees, wriggling [hisher] [kButtDesc] at you invitingly.", parse);
					Text.NL();
					Text.Add("<i>\"Imagine yourself before we met. Who would have thought you'd be begging to be fucked in the butt?\"</i> you quip, throwing in one last mocking tease before striding to action.", parse);
				}
				else if(attitude == Kiakai.SexFirstAttitude.Mutual) {
					Text.Add("<i>\"Yeees, my [cockDesc] would fit quite nicely in your butt, wouldn't it?\"</i> you purr. To accentuate your point, you give said butt a firm squeeze.", parse);
					Text.NL();
					Text.Add("<i>\"I... I am sure,\"</i> [name] yelps, <i>\"there is o-only one way to find out, right?\"</i>", parse);
					Text.NL();
					Text.Add("<i>\"Mhm...\"</i> you agree, digging you fingers into [hisher] delicate derriere. One of them sneaks its way in between [hisher] cheeks, finding the [kAnusDesc] hidden inside. [name] shudders slightly as one, then two of your digits snake themselves inside [himher].", parse);
					Text.NL();
					Text.Add("<i>\"Not so bad, is it?\"</i> you whisper into your companion's ear, <i>\"I bet you'll like the real thing even more.\"</i> [name] responds by moaning and grinding against your fingers, pushing them deeper inside.", parse);
					Text.NL();
					Text.Add("<i>\"Think you are ready for me?\"</i> you ask, after sufficiently preparing the elf.", parse);
					Text.NL();
					Text.Add("<i>\"As ready as I will ever be,\"</i> [name] responds nervously.", parse);
					Text.NL();
					Text.Add("<i>\"Good...\"</i> You smile at [himher] encouragingly. <i>\"Now, get on all fours, and I'll give you a ride you are not likely to forget.\"</i> The elf complies, spreading [hisher] legs expectantly.", parse);
				}
				else if(attitude == Kiakai.SexFirstAttitude.Assertive) {
					Text.Add("<i>\"I'm going to fuck you, and fuck you good,\"</i> you state bluntly, your hand rubbing along your [cockDesc].", parse);
					Text.NL();
					if(kiakai.FirstVag()) {
						Text.Add("<i>\"P-please, [playername], you promised!\"</i> [name] squeaks, <i>\"u-use my other entrance!\"</i>", parse);
						Text.NL();
						Text.Add("<i>\"So you reason that giving me your butt will protect your precious chastity?\"</i> you give the elf a predatory grin, <i>\"for now, perhaps. Tomorrow, who knows?\"</i>", parse);
					}
					else if(kiakai.FirstCock()) {
						Text.Add("<i>\"B-but I am a man!\"</i> [name] protests.", parse);
						Text.NL();
						Text.Add("<i>\"You've yet to convince me of that, and I rather doubt I'll be more inclined to believe you after I'm finished,\"</i> you retort, grinning as [heshe] shivers under your predatory glare. <i>\"Besides, did you really think that would stop me?\"</i>", parse);
					}
					Text.NL();
					Text.Add("<i>\"Now... lie down and spread your legs, elf,\"</i> you command, <i>\"put on a show for me, prepare yourself.\"</i> [name] hurriedly complies, presenting you with [hisher] bum.", parse);
					Text.NL();
					Text.Add("<i>\"Ungh... like this?\"</i> [heshe] asks uncertainly, inserting one of [hisher] slender fingers into [hisher] [kAnusDesc].", parse);
					Text.NL();
					Text.Add("<i>\"A good start... but you'll probably need to add a few more, or this will come as quite the shock,\"</i> you answer, grinning as you stroke yourself.", parse);
					if(kiakai.flags["AnalExp"] > 15)
						Text.Add(" <i>\"Though I suppose this isn't the first thing I've shoved in there,\"</i> you muse.", parse);
					Text.NL();
					Text.Add("Not trusting [himher]self to speak anymore, the elf merely whimpers as [heshe] adds another two fingers. You enjoy the display for a while, before announcing that you are moving on to the main course. Without waiting for a reply, you flip [name] over on all fours, nudging [hisher] legs apart, exposing [hisher] [kAnusDesc] to your eager [cockDesc].", parse);
				}
			}
			// Repeats
			else {
				Text.Add("Licking your lips, you suggest that [name] bend over so you can fuck [himher] anally. The elf blushes at your bluntness, but complies with your wishes, gulping slightly as your hungry gaze takes in [hisher] bared anatomy.", parse);
				Text.NL();
				if(virgin) {
					Text.Add("<i>\"You agreed to that quick enough, considering I'll be your first,\"</i> you comment amiably.", parse);
					Text.NL();
					Text.Add("<i>\"J-just be gentle with me,\"</i> the elf mumbles, blushing fiercely.", parse);
				}
				else {
					Text.Add("<i>\"Hope you'll enjoy it as much as the first time - I certainly intend to,\"</i> you comment amiably.", parse);
				}
			}
			
			// If toy
			if(!kiakai.FirstCock()) {
				Text.NL();
				Text.Add("You equip your [cockDesc], dressing it in lube to prepare it for imminent penetration. [name] throws nervous glances at you all the while, though whether because of second thoughts or impatience, it is hard to tell.", parse);
			}
			
			Text.NL();
		
			var len = playerCock.length.Get();
			var cap = kiakai.Butt().capacity.Get();
				
			// First time
			if(kiakai.flags["SexPitchAnal"] == 0) {
				Text.Add("<i>\"W-will it hurt?\"</i> [name] whimpers over [hisher] shoulder, sounding slightly worried.", parse);
				Text.NL();
				Text.Add("<i>\"I'll take it slow and gentle,\"</i> you promise reassuringly. While talking, you have lubed up the length of your [cockDesc], preparing it for entry. Humming softly, you place the [cockTip] against [name]'s [kAnusDesc], applying pressure. Already, you can feel [hisher] sphincter expanding grudgingly.", parse);
				Text.NL();
				Text.Add("<i>\"[playername]!\"</i> the elf gasps, <i>\"n-not so rapidly!\"</i> You pause for a moment in you inexorable advance.", parse);
				Text.NL();
				Text.Add("<i>\"Relax. Just the tip, okay?\"</i>", parse);
				Text.NL();
				Text.Add("<i>\"Aah... j-just the tip then,\"</i> [name] moans, biting [hisher] lip as your [cockDesc] continues to push against [hisher] unravaged hole. Finally, either by an act of will or through sheer exhaustion, the elf's puckered rosebud relaxes, allowing you to feed your [cockTip] into [hisher] depths. You can feel the heat around your [cockDesc], and [name]'s tight entrance clamping down around you. Even should you want to, you don't think you could pull out of [himher] right now.", parse);
				Text.NL();
				
				kiakai.FuckAnal(kiakai.Butt(), playerCock, 15);
				player.Fuck(playerCock, 15);
				Sex.Anal(player, kiakai);
				
				Text.Add("Which leaves you only one way to go.", parse);
				Text.NL();
				Text.Add("<i>\"B-by Aria!\"</i> the elf pants, amusing you by calling on [hisher] goddess in [hisher] current state. As you begin your slow but inexorable penetration of your moaning companion, [heshe] weakly protests: <i>\"Y-you promised, only the - nngh - tip!\"</i>", parse);
				Text.NL();
				Text.Add("<i>\"Don't be such a baby. See? There goes another inch!\"</i> you tell [himher] encouragingly, pushing another fraction of your length into [himher] to match your words.", parse);
				Text.NL();
				
				if(len < cap / 2) {
					Text.Add("<i>\"That wasn't so bad, was it?\"</i> you comfort [name] as your [hipsDesc] lightly tap against [hisher] [kButtDesc], your [cockDesc] bottoming out inside the elf.", parse);
					Text.NL();
					Text.Add("<i>\"I... I guess,\"</i> [name] whimpers.", parse);
					Text.NL();
					Text.Add("Then doing it a few more times shouldn't be a problem, should it?", parse);
				}
				else if(len <= cap) {
					Text.Add("<i>\"Halfway there!\"</i> you announce happily, continuing to push your [cockDesc] forward, burying it bit by bit inside the elf.", parse);
					Text.NL();
					Text.Add("<i>\"T-there is more?!\"</i> [name] gasps, <i>\"It will not fit!\"</i>", parse);
					Text.NL();
					Text.Add("You beg to differ, and set out to prove [himher] wrong. Although there are some noises of protest, soon enough your [hipsDesc] connect with [hisher] [kButtDesc], your [cockDesc] hilted inside of [name]'s [kAnusDesc].", parse);
				}
				else {
					Text.Add("<i>\"[playername], it will never fit!\"</i> [name] gasps, becoming increasingly and intimately aware of the sheer size of your [cockDesc]. No matter how much you manage to press in, there is always another inch to follow.", parse);
					Text.NL();
					Text.Add("<i>\"Nonsense.\"</i> The first six inches bury inside [himher] without any problems.", parse);
					Text.NL();
					if(cap > 23) {
						Text.Add("<i>\"You are tearing me asunder!\"</i> the elf cries out. Nine inches.", parse);
						Text.NL();
					}
					if(cap > 30) {
						Text.Add("<i>\"P-please,\"</i> [name] whimpers. Twelve inches. You are starting to encounter resistance, and you sense that you are close to reaching the elf's limits.", parse);
						Text.NL();
					}
					if(cap > 40) {
						Text.Add("Fifteen inches. By now, the elf's protests are reduced to wordless moans.", parse);
						Text.NL();
					}
					if(cap > 50) {
						Text.Add("...Twenty inches. By Aria indeed, just how much can [heshe] fit?", parse);
						Text.NL();
					}
					Text.Add("Finally, you can't push even another fraction of an inch inside the elf; it is simply physically impossible without damaging your companion. A pity, since you still have plenty more to give.", parse);
				}
			}
			else {
				Text.Add("[name]'s [kAnusDesc] is almost inviting, as if welcoming a returning guest. It takes surprisingly little effort for your [cockDesc] to gain entry, pushing past the elf's weak defenses.", parse);
				Text.NL();
				
				kiakai.FuckAnal(kiakai.Butt(), playerCock, 3);
				player.Fuck(playerCock, 3);
				Sex.Anal(player, kiakai);
				
				parse["balls"] = kiakai.HasBalls() && player.HasBalls() ? Text.Parse(", your balls lightly slapping against [hishers]", parse) : "";
				
				if(len < cap / 2)
					Text.Add("Your [cockDesc] easily bottom out in your groaning companion, joining the two of you at the hip[balls].", parse);
				else if(len <= cap)
					Text.Add("It takes some effort, but soon all of your [cockDesc] is lodged inside the groaning elf, testing the limits of [hisher] body.", parse);
				else
					Text.Add("Try as you might, you can't fit all of your impressive length inside the groaning elf, leaving a significant portion of the [cockDesc] outside as you strain against [name]'s physical limits.", parse);
			}
			Text.NL();
			Text.Add("<i>\"I'm going to start moving now,\"</i> you announce, beginning your slow withdrawal from [hisher] expanded tunnel. Leaving a trail of fire in the elf's ravaged innards, you pull your [cockDesc] almost completely back out, preparing to plunge in again. Poised on the edge, with just the tip of your [cockDesc] still resting inside the elf, you lovingly caress [hisher] bare behind.", parse);
			Text.NL();
			parse["stretch"] = len >= cap ? Text.Parse(", stretching the elf to [hisher] limits", parse) : "";
			Text.Add("Your next thrust is much faster than the first, not stopping to let [name] adjust to the sudden intrusion until you have bottomed out[stretch].", parse);
			Text.NL();
			Text.Add("<i>\"Hah... hah...\"</i> overwhelmed by the feelings of pleasure and pain wrecking [hisher] [kAnusDesc], [name] can hardly keep [himher]self up, and only your firm grip on [hisher] [kHipsDesc] prevents [himher] from collapsing in a quivering puddle.", parse);
			Text.NL();
			Text.Add("The sloppy sounds of flesh grinding against flesh echo throughout the area as your [cockDesc] pistons its way in and out of [name]'s constricting passage, [hisher] amazing tightness only serving to increase the intense experience.", parse);
			if(kiakai.flags["AnalExp"] < 30 && kiakai.subDom.Get() < 0) {
				Text.NL();
				Text.Add("<i>\"S-slower,\"</i> [name] begs, <i>\"it... it feels too good!\"</i>", parse);
			}
			else {
				Text.NL();
				Text.Add("<i>\"M-more!\"</i> [name] begs you, <i>\"take me deeper!\"</i> With [hisher] extensive experience with anal sex, you don't doubt that [heshe] could take it.", parse);
				if(kiakai.SPLevel() < 0.75 && cap < len) {
					Text.NL();
					Text.Add("A glimmer of a naughty idea flits through your mind, but the elf seems too exhausted for it to be enacted.", parse);
				}
			}
			Text.NL();
			Text.Add("How will you take [himher]?", parse);
			Text.Flush();
			
			kiakai.flags["SexPitchAnal"] = 1;
			kiakai.flags["AnalExp"] += 2;
			kiakai.flags["Sexed"]++;
			
			//[Gentle][Rough][Ruin]
			var options = new Array();
			options.push({ nameStr : "Gentle",
				func : function() {
					Text.Clear();
					Text.Add("Slowly, you start to rock your [hipsDesc], your [cockDesc] sliding in and out of [name] with the inexorable regularity of ocean waves, gently rolling against a shoreline. Each gentle push elicits an appreciative moan from the prone elf, urging you on.", parse);
					Text.NL();
					if(virgin)
						Text.Add("Though you try your best to be considerate, [name]'s first time is still a bit overwhelming for [himher]. [HisHer] limbs are trembling slightly as [heshe] does [hisher] best to keep [himher]self upright beneath your grinding.", parse);
					else if(kiakai.flags["AnalExp"] < 30)
						Text.Add("[name] does [hisher] best to enjoy your grinding, sometimes even pushing back against your [cockDesc], desiring to have more of it fill [himher].", parse);
					else
						Text.Add("A veteran of anal sex, [name] seems almost a bit disappointed at your slow pace, but plays along, pushing back against every one of your thrusts, intensifying [hisher] own pleasure. Amused, you give the elf a light slap on [hisher] bum, encouraging [himher] to let you do the work.", parse);
					Text.NL();
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						parse["s"]     = kiakai.NumCocks() > 1 ? "s" : "";
						parse["oneof"] = kiakai.NumCocks() > 1 ? " one of" : "";
						Text.Add("Reaching down, you grab hold of[oneof] [name]'s dangling cock[s]. The elf has become really hot and bothered from your tender pounding of [hisher] [kAnusDesc], and the [kCockDesc] is stiff, the veins on it standing out as your fingers lightly dance over it.", parse);
						Text.NL();
						Text.Add("You caress it, causing a twitch to run through the stiff member, globs of pre splattering on the ground beneath [himher]. Closing your hand around it, you start to pump the [kCockDesc] in time with the thrusts of your hips.", parse);
						Text.NL();
					}, 1.0, function() { return kiakai.FirstCock(); });
					scenes.AddEnc(function() {
						Text.Add("A quick feel between [name]'s legs tell you that [hisher] [kVagDesc] is soaked, the elf's clear juices trailing down one of [hisher] thighs. Smiling, you dip your fingers in the wet honey pot, then present them to [himher].", parse);
						Text.NL();
						Text.Add("<i>\"You <b>really</b> like this, don't you?\"</i> you tease [himher].", parse);
						if(kiakai.subDom.Get() < -30)
							Text.Add(" [name] greedily licks your fingers clean, not wanting to let [hisher] honey go to waste.", parse);
						Text.NL();
					}, 1.0, function() { return kiakai.FirstVag(); });
					scenes.Get();
					
					Text.Add("You let your hips do the talking, letting your [cockDesc] pump in and out of [name]'s [kAnusDesc]. If the elf had ever had doubts as to liking this, they seem to be all gone now.", parse);
					Text.NL();
					if(kiakai.subDom.Get() > -10)
						Text.Add("<i>\"S-so good, I love it, [playername]!\"</i> [heshe] moans, <i>\"I can feel it, haah... deep inside...\"</i>", parse);
					else if(kiakai.subDom.Get() > -40)
						Text.Add("<i>\"More! Give me more!\"</i> [heshe] moans, <i>\"I love it. Fuck my ass deeper!\"</i>", parse);
					else
						Text.Add("<i>\"D-do me harder, I can take it!\"</i> [heshe] begs, <i>\"ravage me, fuck me, stuff my ass full of your [cockDesc]!\"</i>", parse);
					Text.NL();
					Text.Add("You are more than happy to oblige, and proceed to give the elf exactly what [heshe] wants, in large, sloppy amounts.", parse);
					if(kiakai.LustLevel() >= 0.75) {
						parse["cumJuices"] = kiakai.FirstCock() ? "cum" : "juices";
						Text.NL();
						Text.Add("<i>\"T-too much - ngh - it is coming!\"</i> [name] gasps, announcing [hisher] orgasm. You continue to ream the elf throughout [hisher] climax, causing [hisher] [cumJuices] to splatter all over the ground beneath [himher].", parse);
					}
					Text.Flush();
					
					Gui.NextPrompt(function() {
						Text.Clear();
						
						if(player.FirstCock()) {
							parse["depth"] = len > cap ? "as far as you can go" : "until your hips are connected";
							Text.Add("Finally, you can feel your climax approaching rapidly. Pushing into the elf [depth], you switch from thrusting to slowly grinding against the depths of [hisher] passage.", parse);
							if(playerCock.knot)
								Text.Add(" Pretty soon you have little choice but to stay where you are, as your swelling knot traps you inside the moaning elf.", parse);
							Text.NL();
							Text.Add("With one last groan, you unload your sticky gift into [name]'s [kAnusDesc], painting [hisher] insides with your cum.", parse);
							if(player.CumOutput() > 3)
								Text.Add("The elf's stomach gains a visible bulge, straining to contain all of your semen.", parse);
							Text.NL();
							if(playerCock.knot) {
								Text.Add("With no other choice but to wait it out, you collapse on top of your lover. You can feel your sperm sloshing around inside the elf, trapped by your knot.", parse);
								Text.NL();
								Text.Add("Time passes...", parse);
								Text.NL();
								world.TimeStep({minute: 30});
							}
						}
						
						parse["cum"] = player.FirstCock() ? Text.Parse(", a trail of white fluid connecting the tip of your [cockDesc] to [hisher] [kAnusDesc]", parse) : "";
						Text.Add("Completely sated, you pull out of [name][cum].", parse);
						Text.NL();
						if(virgin) {
							Text.Add("<i>\"So how was your first?\"</i> you ask [name].", parse);
							Text.NL();
							Text.Add("<i>\"I... I loved it,\"</i> [heshe] admits, blushing. <i>\"Thank you for being so gentle and understanding with me.\"</i>", parse);
							Text.NL();
							
							kiakai.relation.IncreaseStat(100, 5);
						}
						Text.Add("The two of you equip your gear, readying yourselves to continue on your travels.", parse);

						Text.Flush();
						
						// TODO: Butt stretch
						kiakai.Butt().stretch.IncreaseStat(10, 1);
						kiakai.subDom.DecreaseStat(0, 1);
						world.TimeStep({hour: 1});
						player.AddLustFraction(-1);
						kiakai.AddLustFraction(-1);
						
						Gui.NextPrompt();
					});
				}, enabled : true,
				tooltip : "Give the elf some gentle loving."
			});
			options.push({ nameStr : "Rough",
				func : function() {
					Text.Clear();
					Text.Add("<i>\"I'll fuck you good,\"</i> you announce, accentuating your words with a rough shove of your hips, driving your [cockDesc] deep inside the elf. [name] cries out in surprise at the motion, but there is a fair bit of poorly disguised delight in there too. As you build up a rhythm, your suspicions are confirmed as [heshe] starts moaning, wordlessly begging you to keep going.", parse);
					Text.NL();
					Text.Add("You take a firm hold of the elf's [kHipsDesc], holding [himher] upright as you start reaming [himher] in earnest. In and out you piston your endowment, keeping a rapid pace. [name]'s velvet passage fits you like a glove, each tight ring intimately caressing you as you force it open. [name] is definitely enjoying your merciless pounding, [hisher] breath coming in ragged gasps as you use [hisher] [kAnusDesc] like a cock sleeve.", parse);
					Text.NL();
					if(kiakai.FirstCock() && Math.random() < 0.5) {
						Text.Add("Deciding to tease your companion a bit, you pull back out completely, leaving [hisher] pucker gaping slightly, as if begging you to return. Changing your position a little, you hunch over [himher], driving your [cockDesc] back in at a downward angle. This has the desired effect of ramming right into [hisher] prostate, as confirmed by a loud yelp from the elf.", parse);
						Text.NL();
						Text.Add("Each of your rapid thrusts mash the sensitive organ, as if trying to forcefully milk it of its contents. A likely outcome if you keep it up for long, as each time you grind against it, [name] lets out a whorish moan, crying out of more.", parse);
						Text.NL();
						Text.Add("It's not long until the elf's prostate has had enough, and its load explodes from [hisher] [kMultiCockDesc], some of it splattering against [name]'s chest, before slowly forming a pool on the ground beneath [himher].", parse);
						Text.NL();
					}
					Text.Add("You switch gears, pushing inside the elf with long, firm strokes. [HisHer] tight tunnel caresses every inch of your lube-covered [cockDesc], though it is loosening up noticeably under your insistent buggering.", parse);
					Text.NL();
					Text.Add("<i>\"Y-yes! Your [cockDesc] feels so good, [playername]!\"</i> [name] moans, encouraging you to increase your pace even further. A bead of sweat forms on your forehead as your unrelenting assault begins to take its toll. The elf is practically soaked, [hisher] glistening skin making [himher] look like [heshe]'s oiled up. You are not about to stop before you've given it your all, and you still have plenty to give.", parse);
					Text.NL();
					Text.Add("Plunging in and out, your pile of hot meat pummels the tight elf beneath you. Your elven cock-sleeve goes through moaning, begging for more, and whimpering for you to slow down, before [hisher] arms finally give and [heshe] collapses to the ground, only suspended by your [cockDesc] and your hands on [hisher] [kHipsDesc]. All of [name]'s pleading falls on deaf ears, as you keep up your even, incessant pounding throughout [hisher] moaning.", parse);
					Text.NL();
					Text.Add("<i>\"It... it is coming!\"</i> [name] gasps.", parse);
					Text.NL();
					Text.Add("The elf's hips tremble as an orgasm wracks [hisher] body, leaving a sticky mess on the ground.", parse);
					if(kiakai.FirstCock() && kiakai.CumOutput() > 3) {
						parse["cum"] = kiakai.FirstBreastRow().size.Get() > 5 ? Text.Parse(" and the underside of [hisher] [kBreastDesc]", parse) : "";
						Text.Add(" Globs of cum splatter [hisher] chest[cum], joining the huge pool of ejaculate forming beneath the elf.", parse);
					}
					Text.Flush();
					
					Gui.NextPrompt(function() {
						Text.Clear();
						
						Text.Add("The two of you are both nearing the limit of you stamina, as your rutting slows down somewhat. [name] is lying face down, whimpering quietly, as you enter the final stretch, your pounding becoming somewhat erratic.", parse);
						Text.NL();
						
						if(player.FirstCock()) {
							Text.Add("You can feel your climax rising, a familiar twitch in your [ballsDesc] giving you the tell-tale signs of imminent stickiness. Groaning, you release your pent up cum, painting [name]'s inner walls white.", parse);
							if(player.CumOutput() > 3)
								Text.Add(" The elf's stomach bulges slightly from the excessive quantity of spunk being pumped into [himher].", parse);
							Text.NL();
							
							if(playerCock.knot && len < cap) {
								Text.Add("Not a single drop escapes from [name]'s ravaged hole, as your [knotDesc] seals [hisher] [kAnusDesc] shut. Seems like you will be here for a while.", parse);
								if(player.LustLevel() > 0.5)
									Text.Add(" For good measure, you grind against [name]'s bum, trying to squeeze another orgasm out of the two of you before your energy is completely spent. Your knot doesn't give you much leeway, but it is enough for your intentions.", parse);
								Text.NL();
								Text.Add("Time passes...", parse);
								Text.NL();
								Text.Add("Finally, you can feel your knot diminishing in size, allowing you to retract your member from its prison.", parse);
								Text.NL();
								world.TimeStep({minute: 30});
							}
							else if(player.CumOutput() > 3) {
								Text.Add("[name] is unable to contain all of your generous gift, and a steady stream seeps out past the tight seal of your [cockDesc], dripping down to the ground.", parse);
								Text.NL();
							}
						}
						else {
							Text.Add("Fucking the elf with a toy is certainly enjoyable in and of itself, though you briefly wonder what [heshe] would feel like, if you had a proper cock. In the meantime, your [cockDesc] will have to do. [name] certainly doesn't seem to be complaining.", parse);
							Text.NL();
						}
						Text.Add("Satisfied at last, you pull out of your companion, giving [hisher] rear end a smack for good measure.", parse);
						if(player.FirstCock())
							Text.Add(" A stream of spunk trails from [name]'s abused hole, evidence of your territory-marking.", parse);
						Text.NL();
						
						if(virgin) {
							Text.Add("<i>\"How was that for a fuck?\"</i> you challenge [himher].", parse);
							Text.NL();
							Text.Add("<i>\"Y-you are so rough, [playername], next time...\"</i> [name] trails off, avoiding your gaze. Something tells you that [heshe] really, <i>really</i> liked it though.", parse);
							Text.NL();
							kiakai.subDom.DecreaseStat(-100, 3);
						}
						Text.Add("The two of you equip your gear, readying yourselves to continue on your travels.", parse);
						
						Text.Flush();
						
						// TODO: Butt stretch
						kiakai.Butt().stretch.IncreaseStat(10, 1);
						kiakai.subDom.DecreaseStat(-50, 2);
						
						world.TimeStep({hour: 1});
						player.AddLustFraction(-1);
						kiakai.AddLustFraction(-1);
						
						Gui.NextPrompt();
					});
				}, enabled : true,
				tooltip : Text.Parse("[HeShe] can take it, give [himher] a rough ride.", parse)
			});
			if(kiakai.flags["AnalExp"] < 30 && kiakai.subDom.Get() < 0) {
				options.push({ nameStr : "Ruin",
					func : function() {
						Text.Clear();
						Text.Add("Pulling out all the way, your [cockDesc] leaves [name]'s stretched sphincter with a loud popping noise. The elf is given little time to recover however, as you quickly plunge into [himher] again, ramming your [cockDesc] in as far as it will go. A pained yelp escapes your submissive companion as you pound [himher], testing [hisher] limits.", parse);
						Text.NL();
						Text.Add("<i>\"[playername], it... it hurts!\"</i> [name] cries. You are too far gone to stop now, but perhaps... You lean down, grabbing the elf by the hair.", parse);
						Text.NL();
						Text.Add("<i>\"I'm going to pound you raw,\"</i> you breathe into [hisher] ear, <i>\"and there is nothing-\"</i> You accentuate your claim by ramming your [cockDesc] into [himher] again, <i>\"-that you can do about that. What you can do...\"</i> You whisper your plan to the aching elf.", parse);
						Text.NL();
						Text.Add("<i>\"O-okay,\"</i> [name] whimpers. You allow [himher] some time to adjust [hisher] position. The elf lowers [hisher] chest to the ground, demurely resting [hisher] cheek in the accumulated grime. [HisHer] hands now freed, [name] places them against [hisher] stomach. You feel a slight tingling around your [cockDesc] as waves of healing energy suffuse [hisher] body.", parse);
						Text.NL();
						Text.Add("Experimentally, you give [himher] a rough, deep thrust, stretching [himher] to [hisher] limit. The elf moans quietly as [hisher] face is pushed against the ground, but it seems that most of [hisher] pain is numbed. [HeShe] seems a bit distant, caught up in euphoric bliss.", parse);
						if(kiakai.FirstCock()) {
							parse["isAre"] = kiakai.NumCocks() > 1 ? "are" : "is";
							parse["s"]     = kiakai.NumCocks() > 1 ? "s" : "";
							Text.Add("Below [hisher] stretched anus, [name]'s [kMultiCockDesc] [isAre] coming to life, throbbing with need. While [hisher] healing is dampening the sensations in [hisher] ass, a teasing prod confirms that the elf is still acutely aware of [hisher] erect cock[s].", parse);
						}
						Text.NL();
						Text.Add("Your restrictions lifted, you let yourself loose, pounding [name] with wild abandon. Each thrust strains against [hisher] physical limits, forcing your [cockDesc] into territory previously unexplored. As you withdraw from each violent penetration, the soothing tendrils of the elf's healing power jump in, healing any damage.", parse);
						Text.NL();
						Text.Add("Slowly but surely, your fervent reaming is rewarded, as you feel that each thrust forces [name] to give more ground, penetrating deeper than [heshe] has ever experienced before. Whether due to the thorough fucking [heshe] is receiving - or the numbing properties of [hisher] healing - [name] is beyond words, reduced to moaning weakly in time with your thrusts.", parse);
						Text.NL();
						if(kiakai.FirstCock()) {
							parse["isAre"] = kiakai.NumCocks() > 1 ? "are" : "is";
							Text.Add("[name]'s [kMultiCockDesc] [isAre] drooling cum, the thick fluid seeping out continuously rather than coming in short bursts. You'd guess [heshe] has orgasmed several times, but [hisher] body is too confused to handle the intense sensation.", parse);
							Text.NL();
						}
						Text.Add("The two of you lose all sense of time, your world reduced to relishing in your carnal desires, the relentless pounding of flesh, the tingling wash of healing energy that course through you.", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							Text.Clear();
							
							if(player.FirstCock()) {
								Text.Add("Your mindless rutting eventually rouses a familiar feeling in your [ballsDesc], as you can sense the oncoming wave of your orgasm. [name] gasps as [heshe] feels the first glob of hot sperm land in [hisher] ravaged colon. Keeping up you steam, you slam into the elf another dozen times, bottoming out while unloading inside [himher].", parse);
								Text.NL();
								if(playerCock.knot && len < 1.2 * cap) {
									Text.Add("So close... if you could only push a little bit more in, you could knot the elf. Groaning, you keep pushing, trying to force your swelling knot past [name]'s sphincter. [HeShe] tries to protest weakly, there is way too much, and [heshe] is stretched past [hisher] limits already. You are past reason though, taken over by animalistic need, the irrational urge to breed the elf.", parse);
									Text.NL();
									Text.Add("Both of you cry out as something gives, and your [knotDesc] finally snaps inside [himher]. No amount of preparation could help [name] for the intense stretching, and the elf almost pass out. There is no going back now, you are firmly stuck inside [himher], and you are likely to stay that way for a while.", parse);
									Text.NL();
									
									kiakai.Butt().capacity.IncreaseStat(len, 3);
									world.TimeStep({minute: 30});
								}
								if(player.CumOutput() > 3) {
									Text.Add("[name] moans appreciatively as your spunk fill [himher] up, the thick cream acting as a soothing salve for [hisher] distended innards.", parse);
									Text.NL();
								}
							}
							Text.Add("Exhausted, you collapse on top of your submissive companion.", parse);
							Text.NL();
							Text.Add("<i>\"Good [boygirl],\"</i> you commend the elf.", parse);
							Text.NL();
							Text.Add("[name] is finally coming down from [hisher] high, [hisher] energy totally spent. [HeShe] groans as the pain in [hisher] loins starts to seep back into [hisher] conscious awareness.", parse);
							Text.NL();
							
							if(kiakai.subDom.Get() > -20) {
								Text.Add("<i>\"A-are you crazy?\"</i> [name] whimpers, tears in [hisher] eyes, <i>\"y-you could have killed me!\"</i>", parse);
								kiakai.relation.DecreaseStat(0, 10);
							}
							else if(kiakai.subDom.Get() > -40) {
								Text.Add("<i>\"P-please don't make me do that again,\"</i> [name] pleads with you, <i>\"I'll do anything, just please, not that again...\"</i>", parse);
								kiakai.relation.DecreaseStat(0, 5);
							}
							else if(kiakai.subDom.Get() > -60) {
								Text.Add("<i>\"Haah... haah...\"</i> [name] is too exhausted and aroused to form words properly. <i>\"S-so deep, now I can take even more for you...\"</i>", parse);
							}
							else {
								Text.Add("<i>\"Y-yes, stretch me more, break me, again and again!\"</i> [name] moans, fingers weakly playing with [hisher] loose back passage.", parse);
								kiakai.relation.IncreaseStat(50, 5);
							}
							Text.NL();
							if(virgin) {
								Text.Add("<i>\"It feels like I will not be able to sit for weeks,\"</i> [heshe] complains. Perhaps you went a bit rough on [himher] for [hisher] first time.", parse);
								Text.NL();
								Text.Add("<i>\"Next time won't be so bad,\"</i> you promise [himher].", parse);
								Text.NL();
								Text.Add("<i>\"N-next time?\"</i> [name] whimpers in a small voice.", parse);
								Text.NL();
								kiakai.relation.DecreaseStat(-100, 5);
							}
							Text.Add("The two of you equip your gear, readying yourself to continue on your travels.", parse);
							Text.Flush();
							
							// TODO: Butt stretch
							kiakai.AddSPFraction(-1);
							kiakai.Butt().stretch.IncreaseStat(10, 4);
							kiakai.subDom.DecreaseStat(-75, 10);
							kiakai.Butt().capacity.IncreaseStat(len, 5);
							
							world.TimeStep({hour: 1});
							player.AddLustFraction(-1);
							kiakai.AddLustFraction(-1);
							
							Gui.NextPrompt();
						});
					}, enabled : cap < len && kiakai.SPLevel() >= 0.75,
					tooltip : Text.Parse("You are beyond caring about anything but your own pleasure. Your [cockDesc] is way too big, but you'll make [himher] take it.", parse)
				});
			}
			
			Gui.SetButtonsFromList(options);
		}, enabled : playerCock,
		tooltip : attitude ? Text.Parse("You can finally have a go at [himher], like you have been longing to... Fuck [name]'s butt until [heshe] begs for more.", parse) : Text.Parse("Fuck [name]'s butt until [heshe] begs for more.", parse)
	});
	options.push({ nameStr : "Anal catch",
		func : function() {
			Text.Clear();
			kiakai.flags["Sexed"]++;
			kiakai.relation.IncreaseStat(50, 1);
			
			if(attitude) {
				if(attitude == Kiakai.SexFirstAttitude.Passive) {
					Text.Add("<i>\"W-would you allow me to penetrate you, [playername]?\"</i> [name] asks nervously.", parse);
					Text.NL();
					if(player.FirstVag()) {
						Text.Add("<i>\"Before, you were so adamant about not having sex... you really have changed, [name],\"</i> you smile at [himher] fondly.", parse);
						Text.NL();
						Text.Add("<i>\"N-not that way!\"</i> the elf hurriedly stutter, <i>\"I meant, could I put it... in your posterior?\"</i> Oh? So anal doesn't count in [name]'s new world view?", parse);
					}
					else if(player.FirstCock()) {
						Text.Add("You blush faintly as you realize what the elf is suggesting. Meanwhile, [heshe] is eyeing your [buttDesc], trying to act nonchalant and failing miserably.", parse);
						Text.NL();
						Text.Add("<i>\"B-but [name], I'm a boy!\"</i> you tease, feigning shock. <i>\"Still, since you ask...\"</i> you quickly finish, before the elf has a chance to change [hisher] mind.", parse);
						Text.NL();
						Text.Add("<i>\"R-regardless,\"</i> [name] mutters, flustered.", parse);
					}
					Text.NL();
					Text.Add("<i>\"Well... what are you waiting for?\"</i> you challenge [himher], when [heshe] still hesitates. <i>\"Don't ask, demand!\"</i>", parse);
					Text.NL();
					Text.Add("<i>\"[playername]...\"</i> [name] takes a deep breath, blushing furiously. <i>\"By the powers vested to me... I claim the use of your rear!\"</i>", parse);
					Text.NL();
					Text.Add("Well... for a first try at assertiveness it isn't so bad, if more than a little strange. You're sure [heshe] will improve as time goes by.", parse);
				}
				else if(attitude == Kiakai.SexFirstAttitude.Mutual) {
					Text.Add("<i>\"I want you to take me, and you want the same,\"</i> you purr, grabbing hold of [hisher] hands and pressing them to your [buttDesc]. <i>\"Why don't you prepare me?\"</i> you whisper to [himher].", parse);
					Text.NL();
					Text.Add("As if [hisher] inhibitions are lifted by your urgings, you almost immediately feel one of [name]'s slender fingers sneak down your crack, prodding at the entrance of your [anusDesc]. The elf is gentle, but makes no effort to hide [hisher] eagerness, two digits plunging into your yearning sphincter.", parse);
					Text.NL();
					Text.Add("Unsated, you dive in, stealing a series of steamy kisses from the breathless elf, letting your [tongueDesc] entwine with [hishers], losing yourself in oral pleasure, leaving [name] free reign of your [anusDesc]. [HeShe] uses the fingers of both hands to spread your folds, stretching your ring before pushing the slender digits in as far as the awkward angle will allow.", parse);
					Text.NL();
					Text.Add("When you finally break the kiss, you feel more than ready to receive your lover.", parse);
				}
				else if(attitude == Kiakai.SexFirstAttitude.Assertive) {
					Text.Add("<i>\"Now... do the same for me,\"</i> you command the elf, reclining and presenting [name] with your [anusDesc]. Eager to please, the horny elf hurriedly removes [hisher] fingers from [hisher] puffy pucker. Kneeling down, [heshe] presses [hisher] already slick digits into your pliant anus.", parse);
					Text.NL();
					Text.Add("You bite your lip as your submissive companion prepares you, pumping your rear end for all that [heshe] is worth. Perhaps it's time to announce your intentions.", parse);
					Text.NL();
					Text.Add("<i>\"Nice and tight, isn't it?\"</i> you murmur huskily, <i>\"wouldn't you like to bury that [kCockDesc] of yours there?\"</i> [name] looks shocked when [heshe] realizes what you are offering... nay, ordering.", parse);
					Text.NL();
					if(kiakai.FirstCock()) {
						Text.Add("[name]'s [kCockDesc] is rising to the challenge, stiff between [hisher] legs as the excited elf continues to finger you.", parse);
						if(player.LowerBodyType() != LowerBodyType.Single) {
							Text.NL();
							Text.Add("<i>\"Getting excited, aren't we?\"</i> you taunt, placing your foot on [hisher] engorged member. Grinning, you let [name] take care of your [anusDesc], playing with yourself in the meantime. You slowly increase the pressure on the elf's [kCockDesc], which has become painfully hard, judging from [name]'s groans.", parse);
							kiakai.AddLustFraction(0.3);
						}
					}
					Text.NL();
					Text.Add("You let the elf go on for a while longer before you grow impatient and shove [himher] off you.", parse);
					Text.NL();
					Text.Add("<i>\"Now... you are going to fuck me. Get ready, elf.\"</i>", parse);
				}
			}
			else {
				Text.Add("You want [name], and you want [himher] now. Pulling the elf close, you whisper that you need to feel [hisher] [kCockDesc] inside you, that you want [himher] to take your [anusDesc].", parse);
				Text.NL();
				if(kiakai.subDom.Get() < -30)
					Text.Add("<i>\"As you wish, [playername],\"</i> [name] responds demurely, <i>\"I... I will do my best to pleasure you to the fullest of your desires.\"</i>", parse);
				else
					Text.Add("<i>\"Y-yes,\"</i> [name] nods hurriedly, eyes dancing over your body. There is an uncharacteristic predatory quality to [hisher] gaze. <i>\"I too, have wished to do this again.\"</i>", parse);
			}
			Text.NL();

			// TODO: Perhaps more specific scenes for certain toys			
			if(!kiakai.FirstCock()) {
				Text.Add("Blushing, [name] fastens [hisher] [kCockDesc] to [hisher] crotch, eyeing you nervously as [heshe] adjusts the artificial erection that [heshe] is about to put to use.", parse);
				Text.NL();
			}
			
			// First time
			if(kiakai.flags["SexCatchAnal"] == 0) {
				Text.Add("<i>\"Ah... what should I do?\"</i> the elf asks anxiously, eager to please but unsure on how to proceed. You explain that for it not to hurt, the best is to have some form of lubricant first. There are certain oils that could be used, or you could use your own bodily fluids for the task.", parse);
				Text.NL();
				Text.Add("<i>\"H-how do you mean?\"</i> The elf looks bewildered. [HisHer] innocence is so cute... you idly wonder how long [heshe] can hope to maintain it, now that you are around.", parse);
				Text.NL();
				Text.Add("<i>\"I could suck you off to get you ready, or you could give me a rimjob.\"</i>", parse);
				Text.NL();
				Text.Add("<i>\"Ahh... okay, well then...\"</i>", parse);
			}
			else {
				Text.Add("<i>\"I do not want to hurt you, [playername], please allow me to prepare first,\"</i> [name] requests.", parse);
			}
			
			Text.NL();
			// RANDOM SCENE
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>\"I... I am at your mercy, [playername],\"</i> the elf bows [hisher] head subserviently, <i>\"p-please, tell me what I should do... command me.\"</i> It almost sounds like [heshe] is getting off on this.", parse);
				kiakai.subDom.DecreaseStat(-50, 1);
				Scenes.Kiakai.AnalCatchPrep();
			}, 1.0, function() { return kiakai.subDom.Get() < -30; });
			scenes.AddEnc(function() {
				Text.Add("<i>\"Ah... c-can we do that thing you mentioned?\"</i> [name] squirms a bit, blushing.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>\"M-may I prepare you myself?\"</i> the elf squirms a bit, indicating your [anusDesc].", parse);
					Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Rim);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>\"C-can you suck on it?\"</i> the elf bites [hisher] lip, uncertain on how you will respond.", parse);
					Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Suck);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>\"What if I did it myself?\"</i> the elf waves at [hisher] [kCockDesc], <i>\"it is quite big, so...\"</i> [heshe] trails off, embarrassed.", parse);
					Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Selfsuck);
				}, 1.0, function() { return kiaiCock.length.Get() >= 25; });
				scenes.AddEnc(function() {
					Text.Add("<i>\"P-perhaps you can provide some?\"</i> the elf stutter. When you raise your eyebrow quizzically, [heshe] gestures towards your [multiCockDesc], embarrassed.", parse);
					Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Frot);
				}, 1.0, function() { return player.FirstCock(); });
				// TODO: Other oils?
				scenes.AddEnc(function() {
					Text.Add("<i>\"C-can I try some of this oil?\"</i> the elf asks you.", parse);
					Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Oil);
				}, 1.0, function() { return party.inventory.QueryNum(Items.SnakeOil); });
				scenes.Get();
			}, 1.0, function() { return kiakai.subDom.Get() >= -40 && kiakai.subDom.Get() < 10; });
			scenes.AddEnc(function() {
				Text.Add("<i>\"O-okay, then we will try...\"</i> [name] quickly decides on a course, glancing at you nervously to see if you will allow [himher] to take the lead.", parse);
				kiakai.subDom.IncreaseStat(25, 1);
				Scenes.Kiakai.AnalCatchPrep();
			}, 1.0, function() { return kiakai.subDom.Get() >= -10 && kiakai.subDom.Get() < 25; });
			scenes.AddEnc(function() {
				Text.Add("<i>\"Then, we will do it this way...\"</i> [name] confidently declares.", parse);
				kiakai.subDom.IncreaseStat(50, 1);
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Suck, true);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Frot, true);
				}, 1.0, function() { return player.FirstCock(); });
				// TODO: Other oils?
				scenes.AddEnc(function() {
					Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Oil, true);
				}, 1.0, function() { return party.inventory.QueryNum(Items.SnakeOil); });
				scenes.Get();
			}, 1.0, function() { return kiakai.subDom.Get() > 20; });
			scenes.Get();
		}, enabled : kiaiCock,
		tooltip : attitude ? Text.Parse("Your [anusDesc] craves filling, and the elf can sate your hunger. Have [name] fuck you.", parse) : Text.Parse("Have [name] fuck you.", parse)
	});
	Gui.SetButtonsFromList(options);
}

Kiakai.AnalCatchPrepScene = {
	Rim      : 1,
	Suck     : 2,
	Selfsuck : 3,
	Frot     : 4,
	Oil      : 5
};

Scenes.Kiakai.AnalCatchPrep = function(choice, assert) {
	Text.Flush();
	
	// TODO Toys
	var playerCock = player.FirstCock() || (player.strapOn ? player.strapOn.cock : null);
	var kiaiCock   = kiakai.FirstCock() || (kiakai.strapOn ? kiakai.strapOn.cock : null);
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,
		heshe        : kiakai.heshe(),
		HeShe        : kiakai.HeShe(),
		himher       : kiakai.himher(),
		hisher       : kiakai.hisher(),
		hishers      : kiakai.hishers(),
		HisHer       : kiakai.HisHer(),
		kCockDesc    : function() { return kiaiCock.Short(); },
		kCockTip     : function() { return kiaiCock.TipShort(); },
		kCockDesc2   : function() { return kiakai.AllCocks()[1].Short(); },
		kMultiCockDesc : function() { return kiakai.MultiCockDesc(); },
		kBallsDesc   : function() { return kiakai.BallsDesc(); },
		kVagDesc     : function() { return kiakai.FirstVag().Short(); },
		kClitDesc    : function() { return kiakai.FirstVag().ClitShort(); },
		kBreastDesc  : function() { return kiakai.FirstBreastRow().Short(); },
		kNipsDesc    : function() { return kiakai.FirstBreastRow().NipsShort(); },
		kTongueDesc  : function() { return kiakai.TongueDesc(); },
		kButtDesc    : function() { return kiakai.Butt().Short(); },
		kAnusDesc    : function() { return kiakai.Butt().AnalShort(); },
		kHipsDesc    : function() { return kiakai.HipsDesc(); },
		kStomachDesc : function() { return kiakai.StomachDesc(); },
		jobDesc      : function() { return kiakai.JobDesc(); },
		boygirl      : kiakai.body.femininity.Get() > 0 ? "girl" : "boy",
		breastDesc   : function() { return player.FirstBreastRow().Short(); },
		nipsDesc     : function() { return player.FirstBreastRow().NipsShort(); },
		cockDesc     : function() { return playerCock.Short(); },
		cockTip      : function() { return playerCock.TipShort(); },
		knotDesc     : function() { return playerCock.KnotShort(); },
		ballsDesc    : function() { return player.BallsDesc(); },
		tongueDesc   : function() { return player.TongueDesc(); },
		buttDesc     : function() { return player.Butt().Short(); },
		multiCockDesc: function() { return player.MultiCockDesc(); },
		vagDesc      : function() { return player.FirstVag().Short(); },
		clitDesc     : function() { return player.FirstVag().ClitShort(); },
		hipsDesc     : function() { return player.HipsDesc(); },
		armor        : function() { return player.ArmorDesc(); },
		hairDesc     : function() { return player.Hair().Short(); },
		anusDesc     : function() { return player.Butt().AnalShort(); },
		stomachDesc  : function() { return player.StomachDesc(); },
		skinDesc     : function() { return player.SkinDesc(); }
	};
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.genDesc = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	parse.kGenDesc = kiakai.FirstCock() ? function() { return kiakai.MultiCockDesc(); } :
					kiakai.FirstVag() ? function() { return kiakai.FirstVag().Short(); } :
					"featureless crotch";
	
	//[Rim][Suck [himher]][Selfsuck][Frot][Oil]
	var options = new Array();
	options.push({ nameStr : "Rim",
		func : function() {
			Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Rim, true);
		}, enabled : true,
		tooltip : "Have the elf give you a rimjob."
	});
	options.push({ nameStr : Text.Parse("Suck [himher]", parse),
		func : function() {
			Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Suck, true);
		}, enabled : true,
		tooltip : "Get the elf nice and slick with your mouth."
	});
	options.push({ nameStr : "Selfsuck",
		func : function() {
			Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Selfsuck, true);
		}, enabled : kiaiCock.length.Get() >= 25,
		tooltip : Text.Parse("Tell the elf to suck [himher]self off.", parse)
	});
	if(player.FirstCock()) {
		options.push({ nameStr : "Frot",
			func : function() {
				Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Frot, true);
			}, enabled : true,
			tooltip : "You could use your own cum..."
		});
	}
	options.push({ nameStr : "Oil",
		func : function() {
			Scenes.Kiakai.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Oil, true);
		}, enabled : party.inventory.QueryNum(Items.SnakeOil),
		tooltip : "Use a vial of oil."
	});
	
	if(!choice) {
		Gui.SetButtonsFromList(options);
		return;
	}
	else if(!assert) {
		//[Sure][Nah]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				kiakai.subDom.IncreaseStat(10, 1);
				Scenes.Kiakai.AnalCatchPrep(choice, true);
			}, enabled : true,
			tooltip : "Accept the elf's request."
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("Slightly annoyed, you shake your head. [name] looks a bit crestfallen. Instead, you will...", parse);
				kiakai.subDom.DecreaseStat(-30, 1);
				Scenes.Kiakai.AnalCatchPrep();
			}, enabled : true,
			tooltip : "The nerve... you have a much more appropriate thing in mind."
		});
		Gui.SetButtonsFromList(options);
		return;
	}
	
	Text.Clear();
	
	var len = kiaiCock.length.Get();
	var cap = player.Butt().capacity.Get();
	
	if     (choice == Kiakai.AnalCatchPrepScene.Rim) {
		parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? ", pushing your legs back" : "";
		Text.Add("<i>\"Just lean back and relax...\"</i> [name] murmurs[legs]. Gently, the elf spreads your cheeks, planting a kiss directly on your yearning rosebud. Your folds are plied open as [name] teases your opening with [hisher] [kTongueDesc], licking and lapping before plunging in.", parse);
		Text.NL();
		Text.Add("The elf has plenty of oral experience it seems, as [heshe] expertly weakens your resistance, tongue probing deep inside you. Just as you are starting to get really hot and bothered, [name] withdraws from your lathered [anusDesc], licking [hisher] lips. Time for the main course.", parse);
	}
	else if(choice == Kiakai.AnalCatchPrepScene.Suck) {
		Text.Add("Wordlessly, [name] parts [hisher] legs, giving you full access to [hisher] [kCockDesc]. Smiling, you lean in and plant a kiss on [hisher] [kCockTip]. Eager to get to the main course, you waste no time in ramming as much of the [kCockDesc] as you can down your throat, lathering its length in slick saliva.", parse);
		Text.NL();
		if(kiakai.FirstCock()) {
			Text.Add("[name] throbs under your ministrations, and you taste [hisher] pre on your tongue. You don't want [himher] to go off quite yet though, so after a few more mouthfuls, you withdraw.", parse);
			Text.NL();
		}
		Text.Add("The elf's [kCockDesc] makes a loud popping sound as it is freed from the grip of your lips. The length is glistening, well prepared for entering you.", parse);
	}
	else if(choice == Kiakai.AnalCatchPrepScene.Selfsuck) {
		Text.Add("[name] gives [himher]self a few experimental strokes, coaxing [hisher] [kCockDesc] to rise to its full glory. Nervously, the elf dips [hisher] head, shuddering as [heshe] plants a kiss on the twitching [kCockTip].", parse);
		Text.NL();
		if(kiakai.FirstCock()) {
			Text.Add("A bead of pre begins to form almost immediately, giving [himher] plenty of lubricant to spread over [hisher] long member.", parse);
			Text.NL();
		}
		Text.Add("Gaining steam, [name] curls [hisher] back, stretching down as far as [heshe] will go, lathering [hisher] own [kCockDesc] with slick fluids. Ever helpful, you caress [hisher] [kHairDesc], simultaneously preventing the elf from backing away from [hisher] twitching rod. You drag your other hand along the throbbing length, whispering encouragements as you let your fingers trail along the exposed veins.", parse);
		Text.NL();
		if(kiakai.FirstCock() && Math.random() < 0.3) {
			Text.Add("Too late, you interpret [name]'s whimpering moans. The [kCockDesc] lurches violently under your light touch. Helpless to prevent the surge rising in [hisher] [kBallsDesc], [name] resigns to swallowing [hisher] own load.", parse);
			Text.NL();
			Text.Add("Trails of sticky cum leak past the tight embrace of the elf's soft lips, dripping down [hisher] length.", parse);
			Text.NL();
			// DOMMY
			if(player.subDom.Get() - kiakai.subDom.Get() > 0) {
				Text.Add("How bothersome. While [name] is certainly lubed up, [heshe] is far from ready to fuck, [hisher] softening member popping out of [hisher] mouth. Well, let's see what you can do to fix that.", parse);
				Text.NL();
				Text.Add("The tired elf groans in surprise as you jam two digits into [hisher] [kAnusDesc], [hisher] [kCockDesc] jumping back to life. You're not going to have [himher] go soft on you just yet.", parse);
				Text.NL();
				Text.Add("<i>\"Ahh! I... I understand, [playername], I am sorry for not being able to hold back,\"</i> [name] gasps, squirming around your pumping fingers, <i>\"I... I think I am ready to - ungh - go ahead.\"</i> Sure enough, the cum-covered [kCockDesc] is once again stiff.", parse);
			}
			// SUBBY
			else {
				Text.Add("You find your mouth watering at the sight of [hisher] twitching member. If only the elf wasn't keeping it all to [himher]self... Giving in to your desires, you lick [name]'s [kCockDesc], trying to capture any stray drops.", parse);
				Text.NL();
				Text.Add("The elf's breath comes in short bursts as [hisher] cock pops out of [hisher] mouth, cum dripping from [hisher] lolling tongue.", parse);
				Text.NL();
				Text.Add("<i>\"I... haah... I am sorry, [playername],\"</i> [name] pants, <i>\"c-could you help get me going again?\"</i> [HeShe] doesn't have to ask twice, and you lovingly wrap your lips around [hisher] [kCockTip], sucking lightly on it, goading it back to life.", parse);
			}
		}
	}
	else if(choice == Kiakai.AnalCatchPrepScene.Frot) {
		parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
		Text.Add("[name] delicately cradles[oneof] your [multiCockDesc], prodding it lightly with [hisher] [kCockDesc]. You sigh luxuriantly as the elf grinds against you, while [hisher] hands try to wrap around both of the shafts. Doing your best to help [himher] along, you massage yourself, hands dancing all over your body, trying to coax an orgasm out of your [cockDesc] as quickly as possible.", parse);
		Text.NL();
		Text.Add("Under your combined efforts, you are soon moaning uncontrollably. The final straw is added when [name] starts rapidly rutting against your [cockDesc], while massaging your sensitive [cockTip] at the same time. Twitching violently, you let loose a stream of cum, the sticky threads splattering on both of you. [name] is quick to gather it up, lathering [hisher] [kCockDesc] in your seed.", parse);
		if(player.CumOutput() > 3)
			Text.Add(" There is definitely more than enough to take from, and when the elf's cock is fully lubed up, the leftovers form a small pool on the ground.", parse);
		Text.NL();
		Text.Add("<i>\"A-are you ready to go, [playername]?\"</i> the elf huffs when your fountain has finally dried up. While you just got off, your companion is still aching to fuck, [kCockDesc] painfully rigid. Weakly, you nod to [himher], urging the elf to go give in to [hisher] desire.", parse);
	}
	else if(choice == Kiakai.AnalCatchPrepScene.Oil) {
		party.inventory.RemoveItem(Items.SnakeOil);
		Text.Add("You produce a vial of slick oil from your bags. The liquid is cool on your skin as the elf generously applies it to your [anusDesc], working some of the sticky substance into your passage. [name] pours the rest on [hisher] [kCockDesc], spreading the soothing lubricant with long, slow strokes.", parse);
		Text.NL();
		Text.Add("The elf's [kCockDesc] is glistening, drops of excess oil splattering down on your waiting [buttDesc]. You are as ready to have [himher] take you as you'll ever be.", parse);
	}
	
	Text.NL();
	parse["balls"] = player.HasBalls() ? Text.Parse(", pulling your [ballsDesc] aside", parse) : "";
	Text.Add("<i>\"H-here I come, [playername]!\"</i> [name] announces nervously. You lean back[balls], exposing your [anusDesc]. A seductive wave of your hand is all it takes for the elf to accept your invitation, as [heshe] almost jumps on you in [hisher] eagerness. Guiding [hisher] shaft into position, [name] presses [hisher] [kCockTip] against your inviting anus. Thanks to the generous lubrication and a little effort, the elf easily penetrates you, pushing the first few inches of [hisher] member inside you.", parse);
	Text.NL();
	
	var virgin = player.Butt().virgin;
	kiakai.Fuck(kiaiCock, 3);
	player.FuckAnal(player.Butt(), kiaiCock, 3);
	Sex.Anal(kiakai, player);
	
	if(kiakai.flags["SexCatchAnal"] == 0) {
		Text.Add("<i>\"S-so tight! You feel really good, [playername]!\"</i> [name] gasps. <i>\"That it would feel this good... aah!\"</i>", parse);
		Text.NL();
	}
	if(virgin) {
		Text.Add("<i>\"D-does it hurt?\"</i> [name] asks, concerned. You shake your head, trying to keep back the tears. It <i>is</i> painful, but it also feels oh so good.", parse);
		Text.NL();
	}
	Text.Add("You urge [himher] on, trying to loosen your sphincter so that [hisher] passage will be easier. Inch by inch, [name] presses on, feeding [hisher] length into your [anusDesc].", parse);
	Text.NL();
	if(len > cap)
		Text.Add("You moan as the [kCockTip] of the elf's [kCockDesc] prods at the deepest reaches of your colon. A glorious feeling of fullness spread through your nethers, as the large shaft strains against your limits. Your only regret is that you can't take it all.", parse);
	else
		Text.Add("After what feels like an eternity, you feel the elf's hips tap against yours, as [heshe] bottoms out in you.", parse);
	Text.NL();
	Text.Add("<i>\"I will begin to move,\"</i> [name] declares, gulping slightly as [heshe] revels in the tightness of your back passage. True to [hisher] word, the elf starts to gently thrust [hisher] hips, enjoying [himher]self enormously if [hisher] whorish moans are any indication. You pull [himher] in for another kiss as [heshe] picks up [hisher] pace.", parse);
	Text.NL();
	Text.Add("[name] sets a relatively slow rhythm, thrusting into you with long strokes.", parse);
	if(player.FirstCock()) {
		parse["isAre"]    = player.NumCocks() > 1 ? "are"   : "is";
		parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
		parse["s"]        = player.NumCocks() > 1 ? "s"     : "";
		Text.Add(" Your own [multiCockDesc] [isAre] straining to get free, trapped against [name]'s [kStomachDesc]. Precum leaks in generous amounts from [itsTheir] tip[s].", parse);
	}
	if(kiakai.HasBalls())
		Text.Add(" The elf's sack slaps against you at the apex of each throbbing thrust, sloshing with virile contents, most of which will likely end up being deposited in your needy anal passage.", parse);
	Text.NL();
	if(kiakai.sexlevel <= 2)
		Text.Add("The elf is doing a good job, if maybe going a bit slow for your tastes.", parse);
	else if(kiakai.sexlevel <= 4)
		Text.Add("You gasp lewdly, as [name] is doing a <i>very</i> good job.", parse);
	else
		Text.Add("You moan uncontrollably as [name] rails you, every thrust hitting just the right spot. The elf's intimate knowledge of your body shows through.", parse);
	Text.NL();
	Text.Add("<i>\"H-how is it?\"</i> [heshe] pants.", parse);
	Text.Flush();
	
	
	//[Sure][Nah]
	var options = new Array();
	options.push({ nameStr : "Take charge",
		func : function() {
			var tailpegFlag = false;
			var suckFlag    = false;
			var jerkFlag    = false;
			
			Text.Clear();
			Text.Add("<i>\"Come on, I'm getting bored here,\"</i> you glower, pouting in disappointment. <i>\"Man up, this is pathetic!\"</i>", parse);
			Text.NL();
			if(kiakai.sexlevel <= 4) {
				Text.Add("The lie on your lips sounds almost pitiful, as you can hardly keep your thoughts gathered. You desperately hope that the elf doesn't notice how much of an effect [heshe] is having on you.", parse);
				Text.NL();
			}
			Text.Add("<i>\"I... I am sorry, [playername], I will strive to do better!\"</i> [name] stammers, hurt by your beratement. [HeShe] tries to speed up, but in [hisher] hurry, [heshe] lose [hisher] rhythm, annoying you further.", parse);
			Text.NL();
			if(kiakai.flags["SexCatchAnal"] == 0)
				Text.Add("<i>\"I finally give you the <b>priviledge</b> of fucking me, and this is what you amount to?\"</i>", parse);
			else
				Text.Add("<i>\"You should know better by now,\"</i> you taunt, <i>\"have you learned nothing?\"</i>", parse);
			parse["oafClutz"] = kiakai.mfTrue("oaf", "clutz");
			Text.Add(" You sigh. <i>\"Get off me, you [oafClutz]. I'll show you how it's done.\"</i>", parse);
			Text.NL();
			Text.Add("[name] hurriedly complies, [hisher] eyes lowered in shame as [heshe] pulls out of you. Not wasting any time, you roughly shove [himher] on [hisher] back, [hisher] rigid [kCockDesc] rising like a pillar from [hisher] crotch. Time to get some mileage out of it.", parse);
			Text.NL();
			Text.Add("You crouch over the elf, lowering yourself on [himher], slamming your hips down roughly. [name] gasps for breath as you bottom out in one thrust, grinding against [himher] before rising again. Rapidly riding the panting elf, you decide to taunt [himher] some more.", parse);
			Text.NL();
			Text.Add("<i>\"See? Even this puny stick of yours can be put to good use!\"</i> you hiss, bouncing on [hisher] lap, <i>\"perhaps you need to be fucked more yourself, to learn how it's done!\"</i>", parse);
			Text.NL();
			Text.Add("<i>\"[playername]!\"</i> [name] yelps, <i>\"I... I... aaah!\"</i> Beyond words, the elf just lies back and takes it, grunting each time you spear yourself on [hisher] [kCockDesc].", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>\"Bet you're feeling left out, with nothing stuck up you ass,\"</i> you huff, briefly interrupting your self-impaling. <i>\"Wouldn't you like a nice, thick tail inside you?\"</i>", parse);
				Text.NL();
				Text.Add("Not waiting for [hisher] response, you twist your [tailDesc], pressing its tip against [name]'s [kAnusDesc]. The elf cries out as you penetrate past [hisher] meager defenses, burying your [tailDesc] deep inside [himher]. Using your hands, you guide the prehensile appendage as far up [name]'s butt as it will go, filling [himher] completely.", parse);
				Text.NL();
				Text.Add("<i>\"There, that should be enough, even for a shameless slut like you.\"</i> The elf moans weakly as you resume your bouncing, overwhelmed by your dual assault.", parse);
				Text.NL();
				kiakai.subDom.DecreaseStat(-75, 1);
				tailpegFlag = true;
			}, 1.0, function() {
				var tail = player.HasTail();
				return tail && tail.Prehensile() && player.sexlevel >= 3 && kiakai.sexlevel >= 3;
			});
			scenes.AddEnc(function() {
				parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
				Text.Add("<i>\"Hey, make yourself useful!\"</i> You imperiously motion to[oneof] your bobbing [multiCockDesc]. <i>\"Suck!\"</i>", parse);
				Text.NL();
				Text.Add("It takes a bit of flexing, but [name] manages to grab hold of the wildly twitching shaft, wrapping [hisher] lips around the [cockTip]. Grunting, you praise [himher] for being such an obedient slut, and tell [himher] that you'll be sure to offer [himher] a nice, tasty reward. [name] eagerly licks and laps at your [cockDesc], using [hisher] [kTongueDesc] to good effect.", parse);
				Text.NL();
				Text.Add("Seeing as the elf has something to keep [himher]self busy for a while, you slam your hips down, rapidly milking [hisher] [kCockDesc] for all you're worth.", parse);
				Text.NL();
				kiakai.subDom.DecreaseStat(-75, 1);
				suckFlag = true;
			}, 1.0, function() {
				var cock = player.FirstCock();
				return cock && cock.length.Get() > 20 && player.sexlevel >= 2;
			});
			scenes.AddEnc(function() {
				parse["oneof"] = kiakai.NumCocks() > 2 ? " one of" : "";
				parse["s"]     = kiakai.NumCocks() > 2 ? "s" : "";
				Text.Add("<i>\"It would be a shame to not put all that excess cock to use...\"</i> You grin, grabbing hold of[oneof] [name]'s remaining shaft[s]. As you bounce up and down, impaling yourself on the elf, you stroke the rigid member vigorously.", parse);
				Text.NL();
				Text.Add("<i>\"Mm... when this one goes off, where do you think it'll land?\"</i> To make your intentions clear, you press [name]'s [kCockDesc2] to [hisher] chest, aiming it squarely at [hisher] face. <i>\"I know you're always hungry for more cock-butter, eating your own shouldn't bother you, right?\"</i> The elf moans, opening [hisher] mouth in anticipation, tongue lolling like that of a dog. You can hardly wait to give [himher] a face-full of [hisher] own spunk.", parse);
				Text.NL();
				kiakai.subDom.DecreaseStat(-75, 1);
				jerkFlag = true;
			}, 1.0, function() { return kiakai.NumCocks() > 1; });
			scenes.Get();
			
			Text.Add("<i>\"Hngh, yeah!\"</i> you grunt, <i>\"all you have to do is stay hard, even you should be able to manage that. And don't you dare cum until I tell you!\"</i> From the looks of it, this is not an entirely easy challenge for the elf. [HisHer] eyes are glazed over, and [heshe] moans loudly each time you slam your hips down, overcome with pleasure.", parse);
			Text.NL();
			Text.Add("<i>\"You know, you look like such an incredible slut right now,\"</i> you taunt. <i>\"Just who is fucking who here?\"</i> To accentuate the absurdity of the situation, you ram down on [himher], nearly driving the air from [hisher] lungs by the sound of it.", parse);
			Text.NL();
			if(len > cap) {
				Text.Add("<i>\"Ngh... I felt that one,\"</i> you groan, sore from [name]'s shaft, penetrating deeper than anything you've felt before. <i>\"You better heal that up, it's your fault for having such a ridiculously large fuck-stick!\"</i>", parse);
				Text.NL();
				Text.Add("A wisp of concern flit across [name]'s delirious expression, and the elf places a trembling hand on your abdomen, letting [hisher] healing energy flow into you.", parse);
				Text.NL();
				kiakai.AddSPFraction(-0.3);
				player.Butt().capacity.IncreaseStat(len, 5);
			}
			Text.Add("Time to give the elf a good workout. Without any regard for [hisher] feelings, you use [himher] as a living sex toy, repeatedly impaling yourself on [hisher] [kCockDesc]. Hissing, you repeat your command that [heshe] is not allowed to come until the moment you tell [himher] so, not under any circumstances.", parse);
			Text.NL();
			
			if(tailpegFlag) {
				Text.Add("Not that you are making that easy for [himher], by any means. In addition to your [anusDesc] constricting around [hisher] [kCockDesc], your tail is shoved so far up [hisher] own [kAnusDesc] it's unlikely that the elf will be able to sit for quite some time. With each bounce, the appendage squirms inside [name]", parse);
				if(!kiakai.HasBalls())
					Text.Add(", grinding against [hisher] prostate", parse);
				Text.Add(".", parse);
				Text.NL();
				Text.Add("<i>\"Fuuuuuuck!\"</i> [name] excaims.", parse);
				Text.NL();
				Text.Add("<i>\"Not so formal with a tail stuck up your butt, are you, my little [jobDesc]? I'll be sure to use it more often... might teach you some of that precious humility you strive for!\"</i>", parse);
				Text.NL();
			}
			else if(suckFlag) {
				Text.Add("[name] is quite the multitasker, as [heshe] hasn't neglected your [cockDesc] for even a second, no matter how rough the ride is getting. [HeShe] isn't doing too bad either, considering the circumstances. Still, you could never miss a chance to tease [himher].", parse);
				Text.NL();
				Text.Add("<i>\"That's right, suck on it like a good little slut... I suppose you are aching for a nice treat, but you are going to have to work harder for it!\"</i> All the elf can do in response is utter a muffled groan, as [hisher] mouth is otherwise occupied.", parse);
				if(player.FirstCock().length.Get() > 35)
					Text.Add(" [HisHer] vibrating throat fits quite snugly around your ridiculously large dick, which is giving [himher] considerable problems breathing. Now and then, [heshe] pulls back slightly, allowing fresh air to enter through [hisher] nostrils.", parse);
				Text.NL();
			}
			else if(jerkFlag) {
				Text.Add("A bead of pre is forming on [name]'s [kCockDesc2], coaxed from the twitching shaft by your incessant jerking. Letting go of it for a moment, you swipe up the sticky liquid, smearing it on the elf's lips.", parse);
				Text.NL();
				Text.Add("<i>\"A taste of what's to come,\"</i> you purr, <i>\"but remember, no matter how much you want to wallow in your own cum, you are <b>not</b> allowed until I tell you so!\"</i>", parse);
				Text.NL();
				if(kiakai.sexlevel >= 4)
					Text.Add("<i>\"I... I want it,\"</i> [name] pants, eagerly licking up the meager offering you left [himher], <i>\"please, let me have it!\"</i> Laughing sultrily, you wag one of your fingers in front of [himher], denying [himher] that indulgence.", parse);
				else {
					Text.Add("<i>\"P-please, [playername], I am not that kind of person!\"</i> [name] gasps, tongue lolling as [heshe] skips for breath. [HeShe]'s so quick about it that you almost miss it, but you catch [himher] licking [hisher] lips clean, gulping down the spunk you offered [himher].", parse);
					Text.NL();
					Text.Add("<i>\"Really? Your cock disagrees with you. Just a gentle touch and you are already drooling...\"</i> That said, your touch has been anything but gentle so far.", parse);
				}
				Text.NL();
				parse["thk"] = kiakai.AllCocks()[1].thickness.Get() > 6 ? ", though it takes you both hands to manage it" : "";
				Text.Add("Grinning, you grasp at the base of the [kCockDesc2], clasping your fingers around it painfully tightly[thk]. Keeping your grip tight, you begin to jerk it again, your vice-like grip making sure that no stray splash of pre escape the throbbing shaft.", parse);
				Text.NL();
			}
			Text.Add("Abandoning everything and focusing solely on the ecstatic feeling of [name]'s [kCockDesc] ramming into you, you set your throttle to full speed, clenching your teeth as you rapidly bounce atop the moaning elf. Both of you are beyond words, reduced to mindless grunting by your breakneck pace. You can't keep it up for long, but you are damn well going to make the most of it.", parse);
			Text.NL();
			
			var expFraction = 0.5 * player.sexlevel / kiakai.sexlevel;
			// Elf comes first
			if(Math.random() < expFraction) {
				if(suckFlag)
					Text.Add("[name]'s moaning climax is muffled by the cock stuffed down [hisher] gullet. The vibrations from [hisher] exaltation batter your [cockDesc], providing an exquisite oral massage.", parse);
				else
					Text.Add("[name] cries out joyously as [hisher] climax comes crashing down, [hisher] hips shaking in ecstasy.", parse);
				if(kiakai.FirstCock()) {
					parse["weakStrong"] = kiakai.CumOutput() > 3 ? "strong" : "weak";
					Text.Add(" The elf pours [weakStrong] jets of cum directly into your stuffed [anusDesc], rapidly filling you as you milk [hisher] [kCockDesc].", parse);
				}
				else
					Text.Add(" The elf's artificial shaft shudders inside you, its wearer too drained to go on.", parse);
				Text.NL();
				if(jerkFlag) {
					Text.Add("Just as the cock pulses inside you, the one in your hand also goes off, streaming gouts of white spunk from its dilated cumslit. Your marksmanship is excellent, as each glob of cum lands squarely on [name]'s pretty face. As the faucet runs dry, you imperiously instruct [himher] to open up and accept your generous offering.", parse);
					Text.NL();
					Text.Add("The elf looks dazed as [heshe] parts [hisher] lips, meekly licking [hisher] own cum from them.", parse);
					Text.NL();
				}
				else if(tailpegFlag) {
					Text.Add("While the elf may have shot [hisher] load, that doesn't mean you are done with [himher] just yet. The [tailDesc] stuck up [name]'s butt, rather than slowing down, rapidly pumps [hisher] innards", parse);
					if(kiakai.FirstCock())
						Text.Add(", the thick appendage squeezing [hisher] prostate of its precious milk", parse);
					Text.Add(".", parse);
					Text.NL();
				}
				Text.Add("<i>\"Ain't you a lovely sight,\"</i> you purr contentedly, still bouncing up and down in [hisher] quivering lap. <i>\"Trembling and whimpering like an innocent maid, and you're not even the one on the receiving end!\"</i> You lean down, licking [hisher] cheek lovingly. <i>\"Perhaps you want to be, next time?\"</i> you whisper huskily in [hisher] ear.", parse);
				Text.NL();
				if(suckFlag)
					Text.Add("A rather rhetorical question, as the elf couldn't answer you if [heshe] wanted to, being busy sucking on your [cockDesc].", parse);
				else {
					Text.Add("<i>\"I... uhm... s-stop putting weird ideas in my head!\"</i> [name] yelps, blushing furiously at your proposition.", parse);
					if(!kiakai.Butt().virgin) {
						Text.NL();
						Text.Add("<i>\"Come now, it would hardly be your first,\"</i> you grin.", parse);
					}
				}
				Text.NL();
				parse["balls"] = player.HasBalls() ? Text.Parse("a surge in your [ballsDesc]", parse) : "a tightening of your loins";
				Text.Add("Without regard for the moaning elf beneath you, you continue to ram your hips down, impaling yourself on [hisher] [kCockDesc]. Eventually, you can feel your own climax approaching, heralded by [balls]. Crying out triumphantly, you feel your [anusDesc] clench around [name]'s still twitching [kCockDesc], each downthrust sending a jolt of pleasure up your spine.", parse);
				Text.NL();
				if(player.FirstCock()) {
					Text.Add("<i>\"Here it comes!\"</i> you pant excitedly, feeling your sperm speed through your body, searching for a convenient exit.", parse);
					Text.NL();
					parse["considerable"] = player.CumOutput() > 3 ? " considerable" : "";
					parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
					if(suckFlag) {
						Text.Add("The elf makes gulping noises as you unload in [hisher] mouth, pouring your semen down [hisher] throat. Not a single drop of your[considerable] load escapes [hisher] tightly sealed lips, all of it eagerly swallowed by your horny companion.", parse);
					}
					else {
						Text.Add("True to your word, your let your [multiCockDesc] dump [itsTheir] [considerable] load all over your horny companion, coating [hisher] face, hair and [kBreastDesc] with sticky semen.", parse);
					}
				}
				else {
					Text.Add("You breathe heavily, trembling slightly from the exertion.", parse);
					if(player.FirstVag())
						Text.Add(" A steady trickle of clear juices flows from your quivering cunt, pooling near the base of [name]'s [kCockDesc].", parse);
				}
				if(tailpegFlag) {
					Text.NL();
					Text.Add("<i>\"Ah, are you going to, uh, withdraw your tail?\"</i> the elf asks you uncertainly.", parse);
					Text.NL();
					Text.Add("<i>\"You don't like it?\"</i> you tease, feigning innocence as you slowly grind the prehensile appendage inside [hisher] rear, forcing the occasional moan from the blushing elf.", parse);
					Text.NL();
					Text.Add("<i>\"Well...\"</i> [name] trails off, mumbling a bit.", parse);
				}
			}
			// You come first
			else {
				Text.Add("Despite your mocking bravado, you are the first one to come, crying out as you feel your climax wreck your body. Judging by the way that [name]'s [kCockDesc] is twitching in the crushing confines of your [anusDesc], [heshe] probably won't be far behind.", parse);
				if(player.FirstVag())
					Text.Add(" Your clear juices drip from your squirting [vagDesc], splattering onto [name]'s [stomachDesc].", parse);
				if(player.FirstCock()) {
					if(suckFlag) {
						Text.Add(" Groaning with pleasure, you let loose your load down [name]'s waiting throat.", parse);
						if(player.NumCocks() > 1) {
							parse["s"]        = player.NumCocks() > 2 ? "s" : "";
							parse["itsTheir"] = player.NumCocks() > 2 ? "their" : "its";
							Text.Add(" Your other dick[s] deposit [itsTheir] sticky spunk all over the dutifully gulping elf.", parse);
						}
						if(player.CumOutput() > 3)
							Text.Add(" The elf sputters, [hisher] belly swelling noticeably, strained by the sheer amount of semen you are pumping directly into it.", parse);
						Text.NL();
						Text.Add("[HeShe] has a very satisfied look on [hisher] face by the time your [cockDesc] pops out of [hisher] mouth, relishing your heady taste.", parse);
					}
					else {
						parse["notS"] = player.NumCocks() > 1 ? "" : "s";
						Text.Add("Your [multiCockDesc] erupt[notS] all over the moaning elf, painting [himher] in strands of sticky white cum.", parse);
						if(player.CumOutput() > 3)
							Text.Add(" From the looks of it, it'll take more than a little effort to get [himher] cleaned up again.", parse);	
					}
				}
				Text.NL();
				Text.Add("Just like you thought, it isn't long before [name] [himher]self joins you in glorious climax.", parse);
				parse["considerable"] = kiakai.CumOutput() > 3 ? " considerable" : "";
				if(kiakai.FirstCock()) {
					Text.Add(" You can feel [hisher] [kCockDesc] throb inside you, depositing its[considerable] load in your bowels. Within seconds, your colon is sticky with hot spunk.", parse);
					if(kiakai.CumOutput() > 3) {
						parse["itThey"]  = kiakai.HasBalls() ? "they" : "it";
						parse["hasHave"] = kiakai.HasBalls() ? "have" : "has";
						Text.Add(" [name]'s [kBallsDesc] seems like [itThey] [hasHave] an unending amount of sperm, easily filling your back passage within seconds. More and more white goo pumps into your used rectum, slightly inflating your [stomachDesc].", parse);
					}
				}
				if(suckFlag) {
					Text.Add(" As if to not let its sibling have all the fun, [name]'s second dick twitches, a large, sticky wad of cum forcing its way past the enclosing ring of your fingers, into [hisher] eager mouth. You bet [heshe]'s been waiting for that one. Well, [heshe]'s earned it. You let go of the [kCockDesc2], letting [hisher] semen flow freely down [hisher] throat.", parse);
					if(kiakai.NumCocks() > 2)
						Text.Add(" The rest of [name]'s dicks throb in unison, splattering their contents on both of you.", parse);
					else if(kiakai.NumCocks() > 1)
						Text.Add("[name]'s remaining dick throbs, splattering its contents on both of you.", parse);
				}
				if(tailpegFlag)
					Text.Add(" [name]'s [kAnusDesc] clenches tightly around your [tailDesc], as if trying to milk it.", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("The two of you lie panting in each other's arms for a while, an exhausted pile of flesh, sweat and sexual fluids.", parse);
				Text.NL();
				if(kiakai.subDom.Get() < -50) {
					Text.Add("<i>\"Not too bad,\"</i> you purr, stretching sinuously, <i>\"if you are a <b>really</b> good [boygirl], I might consider letting you do that again.\"</i>", parse);
					Text.NL();
					Text.Add("[name] bows [hisher] head, confessing that [heshe] would love that.", parse);
				}
				else if(kiakai.subDom.Get() < -20) {
					Text.Add("<i>\"T-that was... by the spirits...\"</i> [name] gasps feebly.", parse);
					Text.NL();
					Text.Add("<i>\"Nothing but a taste,\"</i> you promise amiably, <i>\"you still have plenty of training ahead of you.\"</i>", parse);
				}
				else {
					Text.Add("<i>\"So... rough... I could not take more...\"</i> [name] gasps feebly. You glower at [himher].", parse);
					Text.NL();
					Text.Add("<i>\"I was holding back. Perhaps I shouldn't have. Perhaps I won't next time.\"</i> The elf gulps nervously, knowing that you are serious.", parse);
				}
				Text.NL();
				Text.Add("You amuse yourself with petting the elf for a while, the two of you basking in the afterglow of your lovemaking. After eventually getting cleaned up, you gather your gear and set out once more, both of you sated for now.", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
				
				world.TimeStep({hour: 1});
				player.AddLustFraction(-1);
				kiakai.AddLustFraction(-1);
				kiakai.subDom.DecreaseStat(-75, 2);
				player.subDom.IncreaseStat(40, 1);
				kiakai.flags["SexCatchAnal"] = 1;
				Gui.NextPrompt();
			});
		}, enabled : true,
		tooltip : "This is sad. Do you have to do everything?"
	});
	
	options.push({ nameStr : "More",
		func : function() {
			Text.Clear();
			Text.Add("You moan contentedly that [heshe] has the right idea, encouraging [himher] to keep going. [name] sets a steady rhythm, pushing deep inside you with each thrust. The elf leans down, planting kisses on your lips and neck, unabashedly letting [hisher] hands roam over your body.", parse);
			if(player.LowerBodyType() != LowerBodyType.Single)
				Text.Add(" You wrap your legs around [hisher] waist, hugging [himher] tightly, preventing the elf from pulling away. Not that [heshe] shows any indication of wanting to do so.", parse);
			Text.NL();
			if(player.FirstCock()) {
				parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
				parse["s"]     = player.NumCocks() > 1 ? "s" : "";
				parse["notS"]  = player.NumCocks() > 1 ? "" : "s";
				Text.Add("Your [multiCockDesc] rub[notS] against [name]’s [kStomachDesc], trapped between you. [HeShe] reaches down, wrapping [hisher] slender fingers around[oneof] your member[s], jerking it in time with [hisher] hip movements.", parse);
				Text.NL();
			}
			else if(player.FirstVag() && kiakai.NumCocks() > 1) {
				parse["oneof"] = kiakai.NumCocks() > 2 ? " one of" : "";
				parse["s"]     = kiakai.NumCocks() > 2 ? "s" : "";
				Text.Add("As your bodies squirm together,[oneof] [name]’s unattended cock[s] brushes against your wet [vagDesc], the undercarriage teasing your labia.", parse);
				Text.NL();
			}
			
			if(player.FirstBreastRow().size.Get() > 3) {
				parse["brNoun"] = player.FirstBreastRow().noun();
				Text.Add("One of [name]’s hands finds its way to your [breastDesc], cupping the [brNoun] lovingly, kneading the soft flesh.", parse);
				Text.NL();
			}
			Text.Add("<i>”Ahh, you are amazing, [playername]!”</i> the elf groans, grinding [hisher] hips against you, spearing you on [hisher] [kCockDesc]. <i>”S-so tight!”</i> Your arms snake around your companion, caressing [hisher] back, pulling [himher] down into an intimate kiss.", parse);
			Text.NL();
			parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? "between your thighs" : "into your colon";
			Text.Add("[name]’s [kCockDesc] pistons in and out of you at an unbelievable speed, a hot pillar of lust thrusting [legs], connecting your bodies into one entity. [HisHer] panting breath is hot on your cheek when [heshe] breaks the kiss, leaning down to nibble at your neck again. You moan appreciatively, twining your fingers through [hisher] hair. The elf wraps [hisher] lips around one of your [nipsDesc], sucking lightly on it, gently teasing you with [hisher] teeth.", parse);
			Text.NL();
			if(player.FirstCock()) {
				Text.Add("All the while, each throbbing thrust of [hisher] [kCockDesc] roughly bumps against your battered prostate, sending waves of pleasure echoing through every fiber of your body.", parse);
				Text.NL();
			}
			
			parse["len"] = len > cap ? "as deeply as possible" : "all the way";
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Smiling shyly, [hisher] eyes twinkling at you past thick lashes, [name] rolls over on [hisher] back, sitting you down on [hisher] lap. Experimentally, [heshe] lifts you up, letting gravity ease you back down on [hisher] shaft. You hug the elf tightly against your [breastDesc], moving your hips up and down to help [himher] build a rhythm again.", parse);
				Text.NL();
				Text.Add("Your breath grows shorter as you impale yourself on [name]’s erect member. By now, both of you are too far gone to slow down, reduced to whimpering moans as you copulate, your sweaty bodies racing towards a simultaneous climax.", parse);
				Text.NL();
				Text.Add("<i>”I... almost there,”</i> [name] groans. The elf props [himher]self up with [hisher] hands, and begins to rapidly pump your [anusDesc], the movements of [hisher] hips repeatedly piercing your hovering sphincter.", parse);
				Text.NL();
				Text.Add("<i>”[stuttername]! Ahh!”</i> [HisHer] last erratic thrust sends you off balance, the air in your lungs being forced out as you crash down, [name]’s [kCockDesc] ramming [len] into your bowels. Jointly, you cry out as orgasm hits.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				parse["prettyHandsome"] = kiakai.mfFem("handsome", "pretty");
				Text.Add("[name] plants [hisher] hands on both sides of your shoulders, barely supporting [himher]self as [heshe] thrusts into you. The elf’s [prettyHandsome] face hovers inches above your own, [hisher] gaze obscured by [hisher] thick lashes. [HeShe] bites [hisher] lips in joy, rutting against you quicker and quicker.", parse);
				Text.NL();
				parse["br"] = kiakai.FirstBreastRow().size.Get() > 3 ? "with" : "idly running your fingers over";
				Text.Add("You lie back and enjoy your companions relentless pounding of your [anusDesc], occassionally playing with yourself, or [br] [name]’s [kBreastDesc].", parse);
				Text.NL();
				if(kiakai.FirstBreastRow().size.Get() > 12) {
					Text.Add("Taking one of the elf’s huge breasts in hand, you guide one of [hisher] perky [kNipsDesc] to your mouth, nibbling and sucking on it tenderly.", parse);
					Text.NL();
				}
				Text.Add("<i>”I... I can feel it, it is close!”</i> [name] moans, jacking up [hisher] pace even more. With one final thrust, the elf cries out as [heshe] rams [hisher] [kCockDesc] {as deeply as possible/all the way} into your bowels. Jointly, you cry out as orgasm hits.", parse);
			}, 1.0, function() { return true; });
			scenes.Get();
			Text.NL();
			
			if(kiakai.FirstCock()) {
				Text.Add("The elf’s hot seed pour into your convulsing [anusDesc], your tight ring milking [himher] of [hisher] spunk.", parse);
				if(kiaiCock.knot == 1 && len <= cap)
					Text.Add(" [HisHer] swelling knot acts as a stopper, trapping the growing amount of sperm inside you.", parse);
				if(kiakai.NumCocks() > 1) {
					parse["s"]     = kiakai.NumCocks() > 2 ? "s" : "";
					parse["notS"]  = kiakai.NumCocks() > 2 ? "" : "s";
					Text.Add(" [name]’s other member[s] also erupt[notS], sending sticky strands of white to coat both of your bodies.", parse);
				}
			}
			else {
				Text.Add("[name] grits [hisher] teeth as the artificial cock rams home into you, triggering the elf’s shuddering, blissful climax.", parse);
			}
			Text.NL();
			Text.Add("Almost at the same time as your companion, you reach your own peak.", parse);
			if(player.FirstCock()) {
				parse["mess"] = kiakai.NumCocks() > 2 ? "adding to the" : "creating a";
				Text.Add(" [name]’s [kCockDesc] is rougly jammed against your prostate, pushing all the right buttons. You blow your load, [mess] sticky mess on both of your bodies.", parse);
				if(player.CumOutput() > 3)
					Text.Add(" One particularly strong ejaculation hits [name] right in the jaw, spraying into [hisher] hair. The elf blinks in sluggish surprise, wiping the cum dripping down [hisher] face from [hisher] eyes.", parse);
			}
			
			if(player.FirstVag())
				Text.Add(" Clear juices flow from your needy [vagDesc]. While it received no action this time, the rough loving the elf provided your ass was more than enough to push you over the edge.", parse);
			Text.NL();
			parse["mess"] = kiakai.NumCocks() > 1 || player.FirstCock() ? Text.Parse(", further smearing the cum on your [stomachDesc] into your [skinDesc]", parse) : "";
			Text.Add("You lean against each other as you recover from your messy finale[mess].", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				
				if(kiakai.relation.Get() < -20)
					Text.Add("<i>”T-thank you for being nice with me,”</i> [name] whimpers, resting [hisher] head against your shoulder.", parse);
				else if(kiakai.relation.Get() < 20)
					Text.Add("<i>”That was... nice,”</i> [name] murmurs, sounding a bit unsure of [himher]self.", parse);
				else if(kiakai.relation.Get() < 50)
					Text.Add("<i>”That was amazing, [playername],”</i> [name] smiles, hugging you tightly.", parse);
				else
					Text.Add("<i>”I love you, [playername],”</i> [name] murmurs into your ear, snuggling close, enjoying the warmth of your body.", parse);
				Text.NL();
				if(kiakai.FirstCock() && kiaiCock.knot == 1) {
					Text.Add("It takes a while before the elf’s knot finally deflates, allowing you to disentangle yourself from each other.", parse);
					world.TimeStep({minute : 15});
				}
				else
					Text.Add("After some time has passed, you disentangle yourself from the elf.", parse);
				Text.Add(" You help your companion to [hisher] feet, the two of you chatting while you help clean your bodies, washing away the mixed sexual fluids.", parse);
				if(kiakai.FirstCock()) {
					parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? " your thighs" : "";
					Text.Add(" Part of [name]’s load remains inside your back passage, slowly dribbling down[legs] as you move about.", parse);
					if(kiakai.CumOutput() > 3)
						Text.Add(" The majority rests in your [stomachDesc], sloshing around pleasantly.", parse);
				}
				Text.NL();
				Text.Add("Once you are both ready, you set out on your journey again.", parse);
				
				Text.Flush();
				
				world.TimeStep({hour: 1});
				player.AddLustFraction(-1);
				kiakai.AddLustFraction(-1);
				kiakai.subDom.IncreaseStat(25, 1);
				kiakai.relation.IncreaseStat(75, 1);
				kiakai.flags["SexCatchAnal"] = 1;
				Gui.NextPrompt();
			});
		}, enabled : true,
		tooltip : Text.Parse("Urge [himher] on, more, faster, harder!", parse)
	});
	
	
	
	options.push({ nameStr : "Beg",
		func : function() {
			Text.Clear();
			Text.Add("Almost babbling, you cry out how good [name] is, how nice it feels to get fucked by [himher], how much you need it. It's quite amazing to see the elf's expression turn more and more confident as you praise [himher]. Not only that, there is a new vigor to [hisher] thrusting, each stroke more powerful than the last.", parse);
			Text.NL();
			
			var cockFlag   = false;
			var vagFlag    = false;
			var breastFlag = false;
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				parse["legs"]  = player.LowerBodyType() != LowerBodyType.Single ? " between your legs" : "";
				parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
				Text.Add("Biting your lip, you reach down[legs], grabbing hold of[oneof] your [multiCockDesc]. Rubbing it in time with [name]'s pistoning, you start pleasuring yourself, moaning unabashedly.", parse);
				Text.NL();
				cockFlag = true;
			}, 1.0, function() { return player.FirstCock(); });
			scenes.AddEnc(function() {
				Text.Add("As you let [name] ream you, you reach down and dip your fingers into your neglected honey pot, intent on pleasing it yourself if the elf declines to. You sigh euphorically, your digits matching the rhythm your lover is making.", parse);
				Text.NL();
				vagFlag = true;
			}, 1.0, function() { return player.FirstVag(); });
			scenes.AddEnc(function() {
				Text.Add("You fondle your [breastDesc], pinching your sensitive [nipsDesc]. It's all you can do to keep yourself in check.", parse);
				if(player.FirstBreastRow().size.Get() > 13) {
					parse["numBr"] = player.NumBreastRows() > 1 ? "the other" : "another";
					Text.Add(" You bring one, then [numBr] of your huge mammaries to your mouth, relishing in the added stimulation as you suck on your [nipsDesc].", parse);
					if(player.FirstBreastRow().lactationRate.Get() > 1)
						Text.Add(" The taste of milk fills your mouth, teasing at what is to come.", parse);
				}
				Text.NL();
				breastFlag = true;
			}, 1.0, function() { return player.FirstBreastRow().size.Get() > 3; });
			
			scenes.Get();
			
			Text.Add("<i>\"Do you really enjoy it that much, [playername]? Are you sure I am not harming you?\"</i> [HeShe] slows [hisher] rhythm slightly, waiting for your response. You aren't quite sure if [name] is professing a genuine concern for your well-being, or if [heshe] is just teasing at this point.", parse);
			Text.NL();
			Text.Add("You growl in frustration, begging [himher] to abandon such fears and just <i>take</i> you, claim you for [hisher] own pleasures, break past [hisher] inhibitions, live [hisher] fantasies to the fullest!", parse);
			Text.NL();
			Text.Add("<i>\"R-really?\"</i> [name] is slightly overwhelmed by your complete submission, but tries to make the best of the situation. <i>\"Then, how about...\"</i> The elf purses [hisher] lips.", parse);
			Text.NL();
			
			if(cockFlag) {
				Text.Add("<i>\"...You leave that alone for now,\"</i> [heshe] says, gesturing toward your [cockDesc]. When you start to protest, [heshe] simply cuts you off with: <i>\"Do you not think I could satisfy you?\"</i>", parse);
				Text.NL();
				Text.Add("Hands trembling, you withdraw from your bobbing [cockDesc]. Smiling beneficently, [name] grasps the twitching member with [hisher] slender fingers, sending a shiver up your spine. The means of your pleasure taken out of your hands, all you can do is to lie back and enjoy [name]'s ministrations, [hisher] pumping hand tightly grasping your needy [cockDesc], [hisher] own [kCockDesc] rapidly thrusting into your [anusDesc].", parse);
			}
			else if(vagFlag) {
				Text.Add("<i>\"...You let me see to your needs instead,\"</i> [heshe] says, indicating your [vagDesc]. You start complaining, but suddenly change your mind. Demurely, you withdraw your slick fingers from your sopping box, leaving it slightly gaping.", parse);
				Text.NL();
				Text.Add("<i>\"Now, do not let your precious juices go to waste,\"</i> the elf chides you as [heshe] reaches down, inserting [hisher] own fingers into your recently vacated folds. Following [hisher] instructions, you slowly move your glistening hand to your mouth, licking the delicious drops of girl juices from your trembling digits.", parse);
				Text.NL();
				Text.Add("With the means of your pleasure taken out of your hands, all you can do is to lie back and enjoy [name]'s ministrations: [hisher] hand exploring your needy cunt, [hisher] [kCockDesc] rapidly thrusting into your [anusDesc].", parse);
			}
			else if(breastFlag) {
				Text.Add("<i>\"...Do not be greedy, trying to have those delicious looking breasts all for yourself!\"</i> the elf exclaims, gently but rudely depriving you of your playthings. You needn't worry though, as [heshe] takes hold of your [nipsDesc], teasing and pinching them gently.", parse);
				if(player.FirstBreastRow().lactationRate.Get() > 1) {
					Text.NL();
					Text.Add("<i>\"You can have my milk whenever you want,\"</i> you pant, whimpering slightly under [hisher] lithe hands. [name] looks like [heshe] is about to protest, but suddenly changes [hisher] mind with a look of desire on [hisher] face. Instead, [heshe] leans down, clamping [hisher] lips around one of your [nipsDesc], sucking on it while simultaniously thrusting [hisher] [kCockDesc] into your [anusDesc].", parse);
				}
			}
			else {
				Text.Add("<i>\"Y-yes?\"</i> you whisper.", parse);
				Text.NL();
				Text.Add("Instead of answering you, [name] bends down, trapping you with a loving kiss. Your mouths connect while [heshe] continues to ram [hisher] [kCockDesc] into you, thrusting in and out. Your tongues intermingle, caressing and wrestling with each other over dominion, but as you fell before the elf in the larger scale struggle, so does [heshe] take this victory, easily even. No matter how much you try, you cannot focus on anything except the pistoning [kCockDesc] wrecking havoc on your [anusDesc].", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				
				Text.Add("Some time later - it's a bit difficult for you to keep track - [name] pulls [hisher] [kCockDesc] out of you, leaving you bereaved. Before you have time to voice a complaint, [heshe] curtly cuts you off.", parse);
				Text.NL();
				Text.Add("<i>\"Now, I want you to roll around.\"</i> There is still a slightly nervous quiver in [hisher] voice, but [name] seems to be really getting into it. You quickly comply, shaking your [buttDesc] expectantly at your companion, inviting [himher] back in. Resting your chest on the ground below, you reach back, spreading your cheeks wide, exposing your [anusDesc].", parse);
				Text.NL();
				Text.Add("<i>\"T-take me!\"</i> you beg. You don't have to wait long before [name] roughly shoves [hisher] [kCockDesc] back inside, forcing [hisher] way through your sphincter.", parse);
				Text.NL();
				Text.Add("<i>\"Is that - ngh - better?\"</i> [name] grunts as [heshe] increases [hisher] pace once more.", parse);
				Text.NL();
				parse["lube"] = kiakai.FirstCock() ? ", eased by a generous amount of elvish natural lubricant" : "";
				Text.Add("<i>\"Y-yes, I love it when you take charge!\"</i> you moan, biting your lips as [name]'s hot shaft pummels your back passage[lube]. Growing bolder by the minute, the elf kneads your [buttDesc], roughly manhandling you.", parse);
				Text.NL();
				Text.Add("The two of you continue your rough copulation, the lewd sounds of bodies crashing together filling the area. [name]'s breath comes in short, ragged bursts, [hisher] hands greedily pawing at your body as [hisher] thrusting becomes increasingly erratic.", parse);
				Text.NL();
				
				if(kiakai.FirstCock()) {
					Text.Add("<i>\"[playername]! I am going to - ngh - c-come!\"</i>", parse);
					Text.Flush();
					
					//[Sure][Nah]
					var options = new Array();
					options.push({ nameStr : "Inside",
						func : function() {
							Text.Clear();
							Text.Add("<i>\"I-inside!\"</i> you moan, begging to be filled with hot cream. It's unclear whether the elf obeys you, or if [heshe] is simply too far gone to care. [name] cries out, [hisher] pulsing [kCockDesc] pouring its contents directly into your receptive bowels.", parse);
							if(kiakai.CumOutput() > 3)
								Text.Add(" Your [stomachDesc] starts to bulge from the excessive load, eagerly swallowing up everything the elf feeds into you. When [heshe] finally pulls out, gouts of spunk pour from your overfilled anus.", parse);
							else
								Text.Add(" The elf pulls out, the last strand of cum still connecting the [kCockTip] of [hisher] [kCockDesc] to your [anusDesc].", parse);
							Text.NL();
							Text.Add("[HeShe] pauses to catch [hisher] breath for a moment, before leaning down and whispering in your ear: <i>\"Let me pleasure you too...\"</i>", parse);
							Text.NL();
							Text.Add("[name] snuggles close to you, one hand busying itself with your soppy [anusDesc] while the other plays with your [genDesc], urging you on.", parse);
							
							Scenes.Kiakai.AnalCatchFinish();
						}, enabled : true,
						tooltip : Text.Parse("Beg for [name] to fill you with [hisher] spunk.", parse)
					});
					options.push({ nameStr : "Pull out",
						func : function() {
							Text.Clear();
							Text.Add("<i>\"W-wait!\"</i> you pant, suddenly telling the elf to pull out from your [anusDesc].", parse);
							if(kiaiCock.knot != 0 && len <= cap) {
								Text.Add(" [name] tries to comply, but finds [himher]self stuck inside you, trapped by [hisher] engorged knot.", parse);
								Text.NL();
								Text.Add("<i>\"S-sorry [playername]!\"</i> the elf moans as [heshe] unloads inside you, [hisher] seed flooding your [anusDesc]. You think you detect a trace of... glee? That doesn't seem very much like [himher] at all...", parse);
								Text.NL();
								Text.Add("<i>\"I am sorry, I did not want to hurt you,\"</i> [name]'s voice is sweet and innocent, but you still can't shake feeling that there is a tinge of defiance in it. Probably nothing.", parse);
								Text.NL();
								Text.Add("<i>\"You are close... let me make you feel good.\"</i> Still stuck inside you, [name] begins to grind [hisher] hips slowly, urging you on. [HeShe] reaches down, using [hisher] hands to pleasure your [genDesc].", parse);
								kiakai.subDom.IncreaseStat(60, 1);
							}
							else {
								Text.Add("[HeShe] complies, and in the nick of time too. [HisHer] cum splatters across your back in large gouts the very moment [heshe] withdraws.", parse);
								if(kiakai.CumOutput() > 3)
									Text.Add(" Whether you wanted it or not, you're receiving a literal shower, as a seemingly endless stream of sticky semen washes over you.", parse);
								Text.NL();
								Text.Add("[HisHer] legs unsteady, [name] staggers and stumbles onto [hisher] butt. The elf's hand trembles slightly as [heshe] leans over and caresses your painted backside, smearing [hisher] cum across your buttocks. You whimper slightly as your skin tingles from [hisher] touch. Taking pity on your needy state, [heshe] begins to pleasure you orally, urging you towards your own climax.", parse);
								kiakai.subDom.DecreaseStat(20, 1);
							}
							
							Scenes.Kiakai.AnalCatchFinish();
						}, enabled : true,
						tooltip : Text.Parse("Tell [himher] to come outside.", parse)
					});
					if(kiakai.CumOutput() > 3) {
						options.push({ nameStr : "Shower",
							func : function() {
								Text.Clear();
								Text.Add("You've seen the copious amounts of sperm that the elf can produce, and you want all of it.", parse);
								Text.NL();
								Text.Add("<i>\"H-hold on,\"</i> you yelp, quickly rolling onto your back as [heshe] pulls out. <i>\"Give it to me, I want you to soak me in your hot cum!\"</i> You close your eyes as the first generous gouts of sticky liquid splatter across your body, a long strand painted straight across one of your [breastDesc]. The next shot goes even farther, clinging to your face. It's followed by a rapid succession of loads covering your entire body.", parse);
								Text.NL();
								Text.Add("When [name] is finally done hosing you down, you experimentally open your eye, peering down across your stained body. The elf has dropped down to [hisher] knees and crawled up to you, gleefully slurping up any globs of cream in [hisher] way as [heshe] dives onto your [genDesc]. Between [hisher] legs, you can see that [hisher] [kCockDesc] is pulsing weakly, still drooling cum.", parse);
								kiakai.subDom.IncreaseStat(50, 1);
								
								Scenes.Kiakai.AnalCatchFinish();
							}, enabled : true,
							tooltip : Text.Parse("Let [name] drench your entire body in [hisher] cum.", parse)
						});
					}
					Gui.SetButtonsFromList(options);
				}
				else {
					Text.Add("<i>\"Mmm... that feels so good!\"</i> [name] moans, the other end of the artificial [kCockDesc] rubbing against [himher] in all the right ways. [HisHer] thrusts grow quicker, as [heshe] seeks that ultimate moment, all but forgetting about you as [hisher] clouded eyes flutter shut. Finally, [hisher] grinding slows to a halt, [hisher] [kCockDesc] buried deep within you. [name] pants heavily, all but collapsing against your back.", parse);
					Text.NL();
					Text.Add("<i>\"Hah... hah... I want to make you feel good too...\"</i> [heshe] tells you when [heshe]'s finally recovered a little from [hisher] climax.", parse);
					Text.NL();
					Text.Add("True to [hisher] word, the elf starts to move inside you again, trying to encourage your own orgasm. While much slower than before, [name] hits all the right spots. With these renewed ministrations, you really don't think you can last much longer.", parse);
					Scenes.Kiakai.AnalCatchFinish();
				}
			});
		}, enabled : true,
		tooltip : Text.Parse("Beg for more. Give in to [hisher] every whim.", parse)
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Kiakai.AnalCatchFinish = function() {
	var playerCock = player.FirstCock() || (player.strapOn ? player.strapOn.cock : null);
	var kiaiCock   = kiakai.FirstCock() || (kiakai.strapOn ? kiakai.strapOn.cock : null);
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,
		heshe        : kiakai.heshe(),
		HeShe        : kiakai.HeShe(),
		himher       : kiakai.himher(),
		hisher       : kiakai.hisher(),
		hishers      : kiakai.hishers(),
		HisHer       : kiakai.HisHer(),
		kCockDesc    : function() { return kiaiCock.Short(); },
		kCockTip     : function() { return kiaiCock.TipShort(); },
		kCockDesc2   : function() { return kiakai.AllCocks()[1].Short(); },
		kMultiCockDesc : function() { return kiakai.MultiCockDesc(); },
		kBallsDesc   : function() { return kiakai.BallsDesc(); },
		kVagDesc     : function() { return kiakai.FirstVag().Short(); },
		kClitDesc    : function() { return kiakai.FirstVag().ClitShort(); },
		kBreastDesc  : function() { return kiakai.FirstBreastRow().Short(); },
		kNipsDesc    : function() { return kiakai.FirstBreastRow().NipsShort(); },
		kTongueDesc  : function() { return kiakai.TongueDesc(); },
		kButtDesc    : function() { return kiakai.Butt().Short(); },
		kAnusDesc    : function() { return kiakai.Butt().AnalShort(); },
		kHipsDesc    : function() { return kiakai.HipsDesc(); },
		kStomachDesc : function() { return kiakai.StomachDesc(); },
		boygirl      : kiakai.body.femininity.Get() > 0 ? "girl" : "boy",
		breastDesc   : function() { return player.FirstBreastRow().Short(); },
		nipsDesc     : function() { return player.FirstBreastRow().NipsShort(); },
		cockDesc     : function() { return playerCock.Short(); },
		cockTip      : function() { return playerCock.TipShort(); },
		knotDesc     : function() { return playerCock.KnotShort(); },
		ballsDesc    : function() { return player.BallsDesc(); },
		tongueDesc   : function() { return player.TongueDesc(); },
		buttDesc     : function() { return player.Butt().Short(); },
		multiCockDesc: function() { return player.MultiCockDesc(); },
		vagDesc      : function() { return player.FirstVag().Short(); },
		clitDesc     : function() { return player.FirstVag().ClitShort(); },
		hipsDesc     : function() { return player.HipsDesc(); },
		armor        : function() { return player.ArmorDesc(); },
		hairDesc     : function() { return player.Hair().Short(); },
		anusDesc     : function() { return player.Butt().AnalShort(); },
		stomachDesc  : function() { return player.StomachDesc(); }
	};
	
	/* TODO Player orgasm */
	
	Text.NL();
	Text.Add("It's not long after that your own orgasm hits, further adding to the mess of sexual fluids and sweat covering your bodies. The two of you snuggle together for a while, revelling in the afterglow of your steamy copulation.", parse);
	Text.NL();
	/*
	Text.Add("<b>--PLACEHOLDER--</b>", parse);
	Text.NL();
	*/
	
	if(kiakai.subDom.Get() > 25)
		Text.Add("<i>\"Mmm... I bet you really liked that, did you not?\"</i> [name] purrs, affectionately feeling you up.", parse);
	else if(kiakai.subDom.Get() > 0)
		Text.Add("<i>\"Did you enjoy yourself?\"</i> [name] asks, blushing faintly as [heshe] asks the bold question. Pulling [himher] in for an extended kiss, you assure [himher] that you did.", parse);
	else if(kiakai.subDom.Get() > -25)
		Text.Add("<i>\"That was not... unpleasant.\"</i> [name] blushes faintly, not used to taking the dominant role with you.", parse);
	else if(kiakai.subDom.Get() > -50)
		Text.Add("<i>\"Thank you, [playername], for allowing me that,\"</i> [name] murmurs, bowing [hisher] head.", parse);
	else
		Text.Add("<i>\"C-can you do that to me next time? It... it looked so nice,\"</i> [name] blurts out, blushing furiously.", parse);
	Text.NL();
	Text.Add("You spend a good quarter of an hour cuddled together before regretfully parting to gather your gear. Once you are cleaned up and equipped, you set out for your next destination.", parse);
	
	Text.Flush();
	
	world.TimeStep({hour: 1});
	player.AddLustFraction(-1);
	kiakai.AddLustFraction(-1);
	kiakai.subDom.IncreaseStat(50, 3);
	player.subDom.DecreaseStat(-40, 1);
	kiakai.flags["SexCatchAnal"] = 1;
	
	Gui.NextPrompt();
}

