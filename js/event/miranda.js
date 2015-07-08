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
	
	this.currentJob = Jobs.Bruiser;
	this.jobs["Fighter"]   = new JobDesc(Jobs.Fighter);
	this.jobs["Fighter"].level = 3;
	this.jobs["Bruiser"]   = new JobDesc(Jobs.Bruiser);
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 10;
	this.maxLust.base      = 50; this.maxLust.growth      = 6;
	// Main stats
	this.strength.base     = 23; this.strength.growth     = 1.7;
	this.stamina.base      = 19; this.stamina.growth      = 1.4;
	this.dexterity.base    = 19; this.dexterity.growth    = 1.1;
	this.intelligence.base = 12; this.intelligence.growth = 1;
	this.spirit.base       = 11; this.spirit.growth       = 1.2;
	this.libido.base       = 24; this.libido.growth       = 1.5;
	this.charisma.base     = 14; this.charisma.growth     = 1.1;
	
	this.level    = 8;
	this.sexlevel = 3;
	this.SetExpToLevel();
	
	this.body.DefHerm(true);
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 7;
	this.FirstCock().length.base = 28;
	this.FirstCock().thickness.base = 7;
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	this.Balls().size.base = 6;
	this.Balls().cumProduction.base = 4;
	this.body.SetRace(Race.Dog);
	this.SetSkinColor(Color.black);
	this.SetHairColor(Color.blue);
	this.SetEyeColor(Color.green);
	this.body.height.base      = 180;
	this.body.weigth.base      = 75;
	
	this.weaponSlot   = Items.Weapons.GreatSword;
	this.topArmorSlot = Items.Armor.WatchChest;
	
	this.Equip();
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]      = Miranda.Met.NotMet;
	this.flags["Herm"]     = 0; // Know she is a herm
	this.flags["Attitude"] = Miranda.Attitude.Neutral;
	this.flags["Thief"]    = 0;
	this.flags["RotGuard"] = 0;
	this.flags["Forest"]   = 0;
	this.flags["Floor"]    = 0;
	
	this.flags["Footjob"]  = 0;
	
	this.flags["Bruiser"]  = Miranda.Bruiser.No;
	this.flags["trainSex"] = 0;
	//Peasants' gate antics
	this.flags["gBJ"]      = 0;
	this.flags["gAnal"]    = 0;
	this.flags["gBribe"]   = 0;

	this.flags["public"]   = 0;
	this.flags["Dates"]    = 0;
	this.flags["bgRot"]    = 0;
	this.flags["bgRotMax"] = 0;
	this.flags["ssRot"]    = 0;
	this.flags["ssRotMax"] = 0;
	this.flags["dLock"]    = 0;
	this.flags["domCellar"] = 0; //player dom
	this.flags["subCellar"] = 0; //player sub
	
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

Miranda.Met = {
	NotMet : 0,
	Met    : 1,
	Tavern : 2,
	TavernAftermath : 3
}

Miranda.Public = {
	Nothing : 0,
	Oral    : 1,
	Sex     : 2,
	Other   : 3,
	Orgy    : 4
}

//TODO
Miranda.prototype.IsFollower = function() {
	return false; //Met? Questline?
}

Miranda.prototype.Met = function() {
	return this.flags["Met"] >= Miranda.Met.Met;
}

Miranda.prototype.Attitude = function() {
	return this.flags["Attitude"];
}

Miranda.prototype.Nice = function() {
	return this.flags["Attitude"] >= Miranda.Attitude.Neutral;
}
Miranda.prototype.Nasty = function() {
	return this.flags["Attitude"] < Miranda.Attitude.Neutral;
}

Miranda.prototype.FromStorage = function(storage) {
	this.LoadCombatStats(storage);
	this.LoadPersonalityStats(storage);
	this.LoadEffects(storage);
	this.LoadJobs(storage);
	this.LoadEquipment(storage);
	this.body.FromStorage(storage.body);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	
	this.RecallAbilities();
	this.SetLevelBonus();
	this.Equip();
}

Miranda.prototype.ToStorage = function() {
	var storage = {};
	
	this.SaveCombatStats(storage);
	this.SavePersonalityStats(storage);
	this.SaveEffects(storage);
	this.SaveJobs(storage);
	this.SaveEquipment(storage);
	this.SaveBodyPartial(storage, {ass: true, vag: true, balls: true});
	
	// Save flags
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

// Party interaction
Miranda.prototype.Interact = function(switchSpot) {
	Text.Clear();
	var that = miranda;
	
	that.PrintDescription();
	Text.Flush();
	
	var options = new Array();
	options.push({ nameStr: "Release",
		func : function() {
			Text.Clear();
			Text.Add("[Placeholder] Miranda masturbates fiercely, cumming buckets.");
			
			world.TimeStep({minute : 10});
			
			that.OrgasmCum();
			Text.Flush();
			Gui.NextPrompt(function() {
				that.Interact(switchSpot);
			});
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	//Equip, stats, job, switch
	that.InteractDefault(options, switchSpot, !rigard.UnderLockdown(), true, !rigard.UnderLockdown(), true);
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}

// Schedule
Miranda.prototype.IsAtLocation = function(location) {
	if(party.InParty(miranda)) return false;
	location = location || party.location;
	if(world.time.hour >= 7 && world.time.hour < 19) {
		//Work
		if(world.time.day % 3 == 0)
			return (location == world.loc.Rigard.Barracks.common);
		else if(world.time.day % 3 == 1)
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

Miranda.prototype.FuckedTerry = function() {
	return false; //TODO
}

// Events
Scenes.Miranda = {};

Scenes.Miranda.BarracksApproach = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	if(miranda.Attitude() >= Miranda.Attitude.Neutral)
		Text.Add("<i>“Hey there, [playername]. What gives us the honor?”</i> the dobie greets you as you approach.", parse);
	else
		Text.Add("<i>“Oh. You. Why’re you here?”</i> The dobie frowns a bit at you showing up. <i>“Don’t loiter. I might be tempted to give you a night in the cells, and you wouldn’t like that.”</i>", parse);
	
	if(miranda.flags["Met"] < Miranda.Met.Tavern) {
		Text.NL();
		Text.Add("<i>“Say, how about you come by the Maidens’ Bane some time? Take a few drinks together in a more relaxed place? Just meet up with me there after work. As you can see, I’m a bit busy now.”</i>", parse);
		Text.NL();
		Text.Add("...From the looks of it, you’d guess she was already in a tavern, letting loose.", parse);
	}
	Text.Flush();
	Scenes.Miranda.BarracksPrompt();
}

Miranda.Bruiser = {
	No       : 0,
	Progress : 1,
	Taught   : 2
};

Scenes.Miranda.BarracksPrompt = function() {
	var parse = {
		playername : player.name
	};
	
	//[Train]
	var options = new Array();
	//TODO
	/*
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
	var know = miranda.flags["Herm"] != 0;
	options.push({ nameStr : "Spar",
		func : function() {
			Text.Clear();
			if(miranda.Attitude() >= Miranda.Attitude.Neutral)
				Text.Add("<i>“Hah, think you have a shot at beating me, [playername]? I’m not gonna play nice just cause I like you,”</i> Miranda replies, winking. <i>“I could use the workout. Well then, shall we?”</i>", parse);
			else
				Text.Add("<i>“Sure, I’ll fight you,”</i> Miranda replies, and evil glint in her eye. <i>“Can’t promise I won’t take advantage of your sorry ass once I’ve pounded it into the dirt, though.”</i>", parse);
			Text.NL();
			Text.Add("You follow behind the guardswoman as she heads out into the training yard, hips swaying.", parse);
			Text.NL();
			Text.Add("<i>“Don’t cry once I beat you up.”</i> Miranda grabs a practice sword from a weapon stand; more a log than a sword, from the size of it. She turns to face you, ready to fight. <i>“Do your best to entertain me!”</i>", parse);
			Text.Flush();
			
			miranda.RestFull();
			
			party.SaveActiveParty();
			party.ClearActiveParty();
			party.AddMember(player);
			
			var enemy = new Party();
			enemy.AddMember(miranda);
			var enc = new Encounter(enemy);
			
			enc.canRun = false;
			
			//TODO miranda needs a better AI for the fight.
			
			enc.onLoss = Scenes.Miranda.SparLoss;
			enc.onVictory = Scenes.Miranda.SparWin;
			
			Gui.NextPrompt(function() {
				enc.Start();
			});
		}, enabled : know,
		tooltip : "Ask her for a friendly spar in the yard."
	});
	
	if(miranda.flags["Bruiser"] < Miranda.Bruiser.Taught) {
		options.push({ nameStr : "Train",
			func : Scenes.Miranda.BruiserTraining, enabled : know,
			tooltip : "Ask her to teach you how to fight."
		});
	}
	Gui.SetButtonsFromList(options, true, function() {
		//TODO
		PrintDefaultOptions();
	});
}

Scenes.Miranda.SparLoss = function() {
	SetGameState(GameState.Event);
	var enc = this;
	enc.Cleanup();
	
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("<i>“Not a surprising conclusion,”</i> Miranda boasts, wiping the sweat off her brow. <i>“Now… to the victor goes the spoils, no?”</i> A smile is playing on her lips as she awaits your response.", parse);
	Text.Flush();
	
	miranda.subDom.IncreaseStat(75, 3);
	
	party.LoadActiveParty();
	miranda.RestFull();
	
	Gui.NextPrompt(); //TODO
}

Scenes.Miranda.SparWin = function() {
	SetGameState(GameState.Event);
	var enc = this;
	enc.Cleanup();
	
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Miranda looks baffled as she falls to her knees, breathing heavily.", parse);
	Text.NL();
	Text.Add("<i>“N-not bad,”</i> the dobie gasps, struggling back to her feet. <i>“Guess I underestimated you. I’ll have to get serious next time.”</i> She tries to play it down, but both of you know that you beat her fair and square.", parse);
	Text.NL();
	Text.Add("Now, you’ve half a mind to take advantage of this situation...", parse);
	Text.Flush();
	
	miranda.subDom.DecreaseStat(-50, 3);
	
	party.LoadActiveParty();
	miranda.RestFull();
	
	Gui.NextPrompt(); //TODO
}

Scenes.Miranda.BruiserTraining = function() {
	var parse = {
		
	};
	
	Text.Clear();
	if(miranda.flags["Bruiser"] == Miranda.Bruiser.Progress) {
		if(player.jobs["Fighter"].level < 4) {
			Text.Add("<i>“Why embarrass yourself more?”</i> Miranda shakes her head. <i>“Come back when you got the basics down, then we can talk. Before that, the only blade I’ll let you touch is the one between my legs.”</i>", parse);
			Text.NL();
			Text.Add("<b>You’ll need some more experience as a fighter before Miranda will train you. Raise your fighter job to level 4 or above before you return.</b>", parse);
			Text.Flush();
			
			Scenes.Miranda.BarracksPrompt();
		}
		else {
			Text.Add("<i>“Think you got it this time?”</i> Miranda downs her drink and motions for you to follow. <i>“Not going to babysit you, so be sure to keep up this time.", parse);
			if(miranda.flags["trainSex"] != 0)
				Text.Add(" I get paid by the hour, and the more time you waste here, the longer I get to lay waste to your ass.", parse);
			Text.Add("”</i>");
			
			Scenes.Miranda.BruiserTrainingCont();
		}
		return;
	}
	
	if(miranda.Attitude() >= Miranda.Attitude.Neutral)
		Text.Add("<i>“I could show you a thing or two,”</i> Miranda takes another sip of her drink and smiles playfully. <i>“I am oh-so-busy though… what’s in it for me?”</i>", parse);
	else // nasty
		Text.Add("<i>“Sure, I could whack you around the yard for a bit, possibly teach you to be slightly less useless in a fight… but why should I?”</i> Miranda shoots back. <i>“I don’t work for free you know.”</i>", parse);
	Text.NL();
	Text.Add("What did she have in mind?", parse);
	Text.NL();
	Text.Add("<i>“Oh, don’t be simple now. You know which way I roll,”</i> the dobie gives you grin, patting her crotch. You hear a few snickers from the other guards.", parse);
	Text.Flush();
	
	//[Decline][Blowjob][Assert]
	var options = new Array();
	options.push({ nameStr : "Decline",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Your call,”</i> Miranda shrugs, looking a little disappointed.", parse);
			Text.Flush();
			
			Scenes.Miranda.BarracksPrompt();
		}, enabled : true,
		tooltip : "Turn down her offer."
	});
	options.push({ nameStr : "Blowjob",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Would be a nice start. Might get you half a lesson,”</i> she toys with you, <i>“offering anything else?”</i>", parse);
			Text.Flush();
			
			//[Decline][Get fucked]
			var options = new Array();
			options.push({ nameStr : "Get fucked",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Hear that, guys? Miranda still has the skills,”</i> the dobie boasts, earning her a few catcalls. You blush at the attention, but there’s no way out of this rabbit hole now.", parse);
					Text.NL();
					parse["slut"] = miranda.Attitude() >= Miranda.Attitude.Neutral ? "pet" : "slut";
					Text.Add("<i>“Get down and spread ‘em, [slut]!”</i> the herm hoots, to the cheers of her colleagues. She’s barely able to keep herself from laughing.", parse);
					Text.NL();
					Text.Add("Fuck… here?", parse);
					Text.Flush();
					
					var func = function() {
						miranda.flags["trainSex"] = 1;
						
						Text.Add("<i>“...Oh man, you crack me up sometimes. Yanking your chain is just too much fun,”</i> Miranda gasps, clutching her sides. <i>“Well boys, I’ll see you later. Gotta teach this greenling a few things. Coming?”</i>", parse);
						Text.NL();
						Text.Add("Downing her drink, the guardswoman gets up, motioning you to follow her into the yard.", parse);
						
						Scenes.Miranda.BruiserTrainingCont();
					}
					
					//[No way!][Obey]
					var options = new Array();
					options.push({ nameStr : "No way!",
						func : function() {
							Text.Clear();
							miranda.subDom.IncreaseStat(100, 2);
							player.subDom.DecreaseStat(-100, 1);
							player.slut.IncreaseStat(100, 1);
							func();
						}, enabled : true,
						tooltip : "That’s going too far!"
					});
					options.push({ nameStr : "Obey",
						func : function() {
							Text.Clear();
							miranda.subDom.IncreaseStat(100, 5);
							player.subDom.DecreaseStat(-100, 2);
							player.slut.IncreaseStat(100, 3);
							func();
						}, enabled : true,
						tooltip : "Go along with her whims."
					});
					Gui.SetButtonsFromList(options, false, null);
				}, enabled : true,
				tooltip : "Damn it Miranda… alright, you’re game."
			});
			options.push({ nameStr : "Decline",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Your call,”</i> Miranda shrugs, looking a little disappointed.", parse);
					Text.Flush();
					
					Scenes.Miranda.BarracksPrompt();
				}, enabled : true,
				tooltip : "Turn down her offer."
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true,
		tooltip : "...Fine. She want’s you to suck her cock, right?"
	});
	if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
		var dom = player.SubDom() - miranda.SubDom();
		options.push({ nameStr : "Assert",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You take all the fun out of things,”</i> Miranda sighs. <i>“We’ll, I guess I don’t really have anything better to do. Let’s get into the yard and get started, shall we?”</i> As the two of you head outside, you notice a few odd looks from the guardsmen. Apparently they aren’t used to Miranda not getting her way with things.", parse);
				
				player.subDom.IncreaseStat(100, 1);
				miranda.subDom.DecreaseStat(-100, 3);
				
				Scenes.Miranda.BruiserTrainingCont();
			}, enabled : dom + miranda.Relation() > 25,
			tooltip : "Hasn’t she been mouthing up a bit too often lately? Can’t she help you for the sake of it, just once?"
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Miranda.BruiserTrainingCont = function() {
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Barracks.sparring;
	world.TimeStep({minute: 5});
	
	Text.NL();
	Text.Add("Relatively few people are active in the yard when you step out, so the two of you will have plenty of room. The dog-morph gestures for you to pick up a large wooden sword from a nearby rack; really closer to a plank than a sword. It’s surprisingly heavy too; there must be some form of lead core inside. Miranda has acquired a similar practice blade, twirling it around effortlessly.", parse);
	Text.NL();
	Text.Add("<i>“The larger and heavier the blade, the greater the damage. You gotta learn to use the momentum to your advantage. Do it right, and even tough monsters will go down in one swing.”</i> She demonstrates by grasping her practice sword in two hands and making an overhand slash. You brace for the impact, almost expecting her to split the ground in two, but she stops just before the edge touches dirt. <i>“’Course, got to know the limits of your equipment too.”</i>", parse);
	Text.NL();
	Text.Add("You take a few practice swings with your plank, trying to get the hang of it. Miranda shakes her head, frowning.", parse);
	Text.NL();
	
	world.TimeStep({hour: 1});
	player.AddSPFraction(-0.5);
	
	if(player.jobs["Fighter"].level < 4) {
		Text.Add("<i>“You suck,”</i> she says bluntly. <i>“Perhaps you should reconsider your profession of choice. I hear the Shadow Lady is hiring.”</i>", parse);
		Text.NL();
		Text.Add("A bit stung by her words, you ask if she can’t show you instead.", parse);
		Text.NL();
		Text.Add("<i>“Not worth my time. Get some experience before you show your face here again.”</i> Disappointed, you put the practice sword back on the rack, heading back inside.", parse);
		Text.NL();
		Text.Add("<b>You’ll need some more experience as a fighter before Miranda will train you. Raise your fighter job to level 4 or above before you return.</b>", parse);
		Text.Flush();
		
		miranda.flags["Bruiser"] = Miranda.Bruiser.Progress;
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("You return inside the common room and sit down with Miranda.");
			Text.Flush();
			
			party.location = world.loc.Rigard.Barracks.sparring;
			world.TimeStep({minute: 5});
			
			Scenes.Miranda.BarracksPrompt();
		});
		return;
	}
	
	Text.Add("<i>“Your balance is off. Do it more like <b>this</b>.”</i> The dommy dobie demonstrates her slash again. You try to reproduce her movements, making swing after swing while Miranda studies you, offering the occasional advice and making some hands-on adjustments. You’re not sure the groping is really necessary though.", parse);
	Text.NL();
	Text.Add("After a while, swinging the heavy practice blade becomes draining on your poor arms. Best not to complain though.", parse);
	Text.NL();
	Text.Add("<i>“You’ll be able to do it easier with time,”</i> Miranda assures you. <i>“Building strength and stamina is key. And once you’ve got it down, bring it all out in an explosive blow - like <b>this</b>!”</i>", parse);
	Text.NL();
	Text.Add("Splinters of wood fly everywhere as Miranda puts her shoulder in it, roaring as she brings the blade crashing to the ground. The stress is too much for it to handle, and the practice sword shatters into a dozen pieces, the tip embedded a foot into the dirt below. The guardswoman is left standing there with her stump, looking rather foolish.", parse);
	Text.NL();
	Text.Add("<i>“Ah… I think we’re about done,”</i> she mutters. <i>“Shit, this is going to come out of my pay...”</i>", parse);
	Text.NL();
	Text.Add("Returning your own blade to the stand, the two of you head back toward the commons.", parse);
	Text.NL();
	if(miranda.flags["trainSex"] != 0) {
		Text.Add("<i>“Now… I’m sure you said something about giving me a little reward for my teachings, did you not?”</i> Miranda gives you a jab in the side with her elbow. <i>“Nothing like a good fuck to round off a work-out, eh? I’m sure the boys’ll love the show!”</i>", parse);
		Text.NL();
		Text.Add("You leg it halfway into her speech, fleeing the dobie’s heckling laughter.", parse);
	}
	else
		Text.Add("You thank Miranda for her help, happy to rest your tired limbs.", parse);
	Text.NL();
	Text.Add("<b>Unlocked the Bruiser job.</b>", parse);
	Text.Flush();
	
	miranda.flags["trainSex"] = 0;
	miranda.flags["Bruiser"] = Miranda.Bruiser.Taught;
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You return inside the common room and sit down with Miranda.");
		Text.Flush();
		
		party.location = world.loc.Rigard.Barracks.sparring;
		world.TimeStep({minute: 5});
		
		Scenes.Miranda.BarracksPrompt();
	});
}

Scenes.Miranda.RigardGatesDesc = function() {
	Text.Add("<i>“Ho!”</i> Miranda greets you as you approach the gate. The dog-morph is lounging beside the gatehouse, ");
	
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
	if(!rigard.Visa()) {
		Text.Add("<i>“Still no luck getting a pass? Sorry, but you know I can’t let you in without one,”</i> Miranda tells you bluntly.", parse);
		Text.NL();
	}
	
	if(miranda.Attitude() > Miranda.Attitude.Neutral)
		Text.Add("<i>“If you feel brave enough, I could treat you to another round,”</i> the guardswoman suggests, winking at you. <i>“Meet me at the tavern in the slums after dark and we’ll party hard!”</i>", parse);
	else if(miranda.Attitude() < Miranda.Attitude.Neutral)
		Text.Add("<i>“So you come crawling back here, eh?”</i> The guardswoman looks at you dismissively. <i>“I really don’t have the time for you right now. What do you want?”</i>", parse);
	else
		Text.Add("<i>“Head over to the Maidens’ Bane tavern in the slums once in a while, we can have a drink and chat a bit.”</i>", parse);
	Text.Flush();
	
	// TODO: Add interactions (sex)
	Gui.NextPrompt();
}

Scenes.Miranda.RigardGatesEnter = function() {
	var parse = {
		playername : player.name
	};
	
	if(miranda.Attitude() < Miranda.Attitude.Neutral) { // bad
		Text.Add("<i>“What now?”</i> Miranda asks shortly as you approach the gates.", parse);
		if(miranda.Relation() < 25)
			Text.Add(" She doesn’t look too happy to see you.");
		if(!rigard.GatesOpen())
			Text.Add(" <i>“You are not getting inside the city during night hours, pass or no pass,”</i> she growls. <i>“Not through this gate.”</i>", parse);
		else if(rigard.Visa()) {
			Text.Add("You show her your visa to enter the city, but she seems unwilling to let you in either way. <i>“Come over here, standard procedure,”</i> she growls. During the next hour or so, she hounds you with questions about your business in the city, though you can tell she is clearly just fucking with you and wasting time.", parse);
			Text.NL();
			Text.Add("Something tells you that you are lucky though, as you suspect that if not for the other guard posted there, you’d be up for a cavity search. Eventually, the vindictive guardswoman lets you through the gates into Rigard.", parse);
			Text.NL();
			Text.Add("<i>“Why not come by the peasants’ gate more?”</i> Miranda calls after you with a smirk. <i>“It’s a much more… comfortable environment.”</i>", parse);
			if(miranda.flags["gBJ"] > 0)
				Text.Add(" Your cheeks burn, but at least she let you inside, and with less humiliation than usual.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Gate, {hour: 1});
			});
			return;
		}
		else {
			Text.Add("<i>“You know damn well you aren’t getting through here without a pass,”</i> she growls. There is a dangerous glint in her eyes as she adds: <i>“Come by the slum-side gate when I’m on duty sometime, I might show mercy on you.”</i>", parse);
		}
	}
	else if(miranda.Attitude() > Miranda.Attitude.Neutral) { // good
		Text.Add("<i>“Heading in?”</i> Miranda asks you as you approach the gates. <i>“Don’t be a stranger now!”</i>", parse);
		Text.NL();
		if(rigard.Visa()) {
			if(rigard.GatesOpen()) {
				Text.Add("The guardswoman waves you through, feeling you up familiarly as you pass her. <i>“Come join me for a drink or two later, okay?”</i>", parse);
			}
			else { // !open
				Text.Add("The guardswoman looks around her quickly, studying her half asleep companion. She quickly gestures for you to come with her, leading you to a side gate. <i>“Don’t tell anyone I let you in, okay? The gates are supposed to be shut at this hour.”</i>", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
			});
			return;
		}
		else
			Text.Add("<i>“Sorry, I can’t let you through without a pass, [playername]. Come by the pub when I’m off duty, perhaps I can help you get one.”</i>", parse);
	}
	else { // neutral
		if(rigard.GatesOpen()) {
			Text.Add("<i>“Pass please,”</i> the guardswoman drones as you inquire about entry to the city.", parse);
			if(rigard.Visa()) {
				Text.Add("<i>“All seem to be in order, welcome to Rigard.”</i> She ushers you through the gates, already busy with the next person in line.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
				});
				return;
			}
			else
				Text.Add("<i>“No pass, no entry. Sorry, those are the rules.”</i> She adds that she’s still up for a drink after work at the pub.", parse);
		}
		else
			Text.Add("<i>“Gates are closed, ‘m afraid. Come back during daytime. Check in between eight in the morning and five in the evening.”</i>", parse);
	}
	Text.NL();
	Text.Flush();
	PrintDefaultOptions(true);
}


Scenes.Miranda.RigardSlumGatesDesc = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	
	Text.Add("<i>“[playername],”</i> Miranda nods in your direction as you approach. The dog-morph is seated at a wooden table beside the peasants’ gate, ", parse);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("playing cards with some of her fellow guards.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("sipping at a mug of beer.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("sharpening her sword.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("watching the street with keen eyes.", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.Add("<i>“Quite the rural neighborhood, isn’t it?”</i> Miranda grunts, waving at the muddy streets near the gate. <i>“Still, I grew up in these parts, so I’ll always have a soft spot for it, no matter how much of a cesspit it is.”</i>", parse);
	if(miranda.Attitude() == Miranda.Attitude.Neutral) {
		Text.NL();
		Text.Add("<i>“If you haven’t already, you should check out the local tavern, the Maidens’ Bane,”</i> Miranda suggests, <i>“I hang around there after work. Cozy little place.”</i>", parse);
	}
	Text.NL();
}

Scenes.Miranda.RigardSlumGatesEnter = function() {
	var parse = {
		playername : player.name,
		guygal : player.mfFem("guy", "gal"),
		buttDesc : function() { return player.Butt().Short(); }
	};
	
	Text.Clear();
	
	if(!rigard.Visa()) {
		if(miranda.Attitude() > Miranda.Attitude.Neutral) // nice
			Text.Add("Miranda looks around, trying to see if any of her comrades overheard you. <i>“Keep it down will you?!”</i> she hisses, <i>“I’m not supposed to let you in without a pass, you know. Meet me at the tavern after work and we’ll talk.”</i>", parse);
		else if(miranda.Attitude() < Miranda.Attitude.Neutral) { // nasty
			Text.Add("The dog-morph eyes you flatly. <i>“Why should I take that risk for you? There’d better be something in it for me if you want inside.”</i>");
			Text.Flush();
			
			Scenes.Miranda.RigardGatesBribe();
			return;
		}
		else
			Text.Add("<i>“Why should I let you in?”</i> the dog-morph replies flatly. <i>“I’m sure you’re a nice [guygal], but I’m not risking my job for someone I barely know. Come back with a pass.”</i>", parse);
		Text.NL();
		Text.Flush();
		PrintDefaultOptions(true);
	}
	else { //Visa
		if(miranda.Attitude() < Miranda.Attitude.Neutral) { // nasty
			Text.Add("<i>“Aww… you want to get in? What’s in it for me?”</i> Miranda asks, toying with you.", parse);
			Text.Flush();
			
			Scenes.Miranda.RigardGatesBribe();
		}
		else if(miranda.Attitude() > Miranda.Attitude.Neutral) { // nice
			Text.Add("<i>“Sure, come right through, honey,”</i> Miranda grins as you pass her, giving your [buttDesc] a familiar slap. <i>“Come see me at the tavern later, okay?”</i>", parse);
			if(!rigard.GatesOpen()) {
				Text.NL();
				Text.Add("The other guards doesn’t seem to care particularly much about Miranda letting people in during after hours. Things are a bit more laid back here, you guess.", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
			});
		}
		else { // neutral
			if(rigard.GatesOpen()) {
				Text.Add("<i>“It looks to be in order,”</i> Miranda concludes after looking over your papers. She waves you through the gates, adding that you should come visit her at the tavern after work some time.", parse);
				Text.NL();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
				});
			}
			else {
				Text.Add("<i>“Sorry, I can’t let you in while the gate is shut. Come back during the open hours, eight in the morning to five in the evening.”</i>", parse);
				Text.NL();
				Text.Flush();
				PrintDefaultOptions(true);
			}
		}
	}
}

Scenes.Miranda.RigardGatesBribe = function() {
	var parse = {
		playername : player.name,
		bottomArmorDesc : function() { return player.LowerArmorDesc(); },
		tongueDesc : function() { return player.TongueDesc(); },
		stomachDesc : function() { return player.StomachDesc(); },
		skinDesc : function() { return player.SkinDesc(); },
		buttDesc : function() { return player.Butt().Short(); },
		anusDesc : function() { return player.Butt().AnalShort(); },
		breastDesc : function() { return player.FirstBreastRow().Short(); },
		hand : function() { return player.HandDesc(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc : function() { return player.FirstVag().Short(); },
		mcockDesc : function() { return miranda.FirstCock().Short(); },
		mcockTip  : function() { return miranda.FirstCock().TipShort(); }
	};
	
	//[Your job][Money][Blowjob][Sex]
	var options = new Array();
	if(rigard.Visa() && miranda.flags["gBribe"] < 1) {
		options.push({ nameStr : "Your job",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Cute, [playername],”</i> the guardswoman scoffs. <i>“Things work a bit differently here in the slums, though. This is my turf, my rules. Pass or no pass.”</i>", parse);
				Text.Flush();
				
				miranda.flags["gBribe"] = 1;
				miranda.relation.DecreaseStat(-100, 3);
				
				Scenes.Miranda.RigardGatesBribe();
			}, enabled : true,
			tooltip : "Indicate that it’s her job to let you through if you have a pass."
		});
	}
	if(miranda.flags["gBribe"] < 2) {
		options.push({ nameStr : "Money",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Fuck off,”</i> she curtly dismisses you, not interested in your money.", parse);
				Text.NL();
				Text.Flush();
				
				miranda.flags["gBribe"] = 2;
				miranda.relation.DecreaseStat(-100, 3);
				
				Scenes.Miranda.RigardGatesBribe();
			}, enabled : true,
			tooltip : "Offer her a bribe."
		});
	}
	options.push({ nameStr : "Blowjob",
		func : function() {
			Text.Clear();
			if(miranda.flags["gBJ"] == 0) { // First
				Text.Add("You suggest that you could perhaps... relieve her? Miranda’s sour expression slowly shifts to a wide grin.", parse);
				Text.NL();
				Text.Add("<i>“Now you’re talking!”</i> The dog-morph gets up from her post, motioning for you to follow her. The curious looks from the other guards bore into your back as you trot along behind the herm.", parse);
				Text.NL();
				Text.Add("You reach the entrance of a dark alley, and Miranda firmly grabs you, pulling you inside. Pushing you down easily - the bitch is frightfully strong - she grinds her bulge against your face. <i>“Feel that?”</i> she grunts. You definitely can, as her cock strains against her leather pants, striving to be free.", parse);
				Text.NL();
				Text.Add("Holding your head in place with one hand, the other expertly undoes her britches, releasing her thick slab of meat, which promptly slaps you.", parse);
				Text.NL();
				Text.Add("<i>“Little Miranda is antsy, why don’t you try to soothe her,”</i> the grinning dog-herm says mockingly. To make her point clear, she nudges your lips with her stiffening [mcockDesc]. Uncertainly, you open your mouth, completely caught off guard when she roughly shoves her way inside.", parse);
				Text.NL();
				
				Sex.Blowjob(player, miranda);
				player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
				
				Text.Add("<i>“Yeeeees, good little slut, so eager,”</i> Miranda encourages you, her hips slowly pushing forward as she forces more of her monster cock past your lips. Your senses are overwhelmed by her smell, her taste; your [tongueDesc] is lathered in her pre as she rubs the [mcockTip] of her dick on it repeatedly. <i>“You are going to have to do better if you want your reward, though,”</i> she grins. <i>“Only dedicated cocksuckers get inside on my watch!”</i>", parse);
				Text.NL();
				Text.Add("Dedicated or not, it is clear that the dickgirl intends to make as much of this opportunity as possible, grabbing hold of your head with both hands to get a firm grip. With her prey secured, Miranda starts to fuck you in earnest, thrusting her cock into your poor throat to the hilt. Once in a while, she pauses for a while, holding you in place with her shaft firmly lodged in your throat, making sure you realize that she is in full control.", parse);
				Text.NL();
				Text.Add("<i>“Now suck!”</i> she barks, loud enough for her voice to carry into the street. Dejectedly, you obey her, seeing no other way out of the situation. <i>“Ngh, that’s the way, bitch,”</i> Miranda grunts, moaning as you service her member. <i>“Keep it up now, and you’ll get your just reward!”</i>", parse);
				Text.NL();
				Text.Add("True to her word, it’s not long before the dog-herm’s breath grows short, her rutting hip-movements becoming more erratic. With both her hands keeping your head firmly in place, you have little choice but to accept whatever is coming, though you grow worried as you feel her knot swelling in your mouth. Thankfully, the guardswoman pulls it out just in time, narrowly saving you from death by suffocation.", parse);
				Text.NL();
				Text.Add("<i>“Take my load, bitch!”</i> the herm yells, pouring her thick cum down your throat and into your [stomachDesc]. You swallow dutifully, but you can feel her seed rising in your throat, the pressure becoming too high. Despite your efforts, some of it leaks out, trailing down your chin. Finally, the sadistic dog-herm pulls out, allowing you to breathe again.", parse);
				Text.NL();
				
				var mCum = miranda.OrgasmCum();
				player.AddLustFraction(0.3);
				miranda.relation.IncreaseStat(100, 3);
				miranda.subDom.IncreaseStat(100, 5);
				player.subDom.DecreaseStat(-50, 1);
				player.slut.IncreaseStat(100, 2);
				
				if(!rigard.Visa()) {
					Text.Add("<i>“Now then,”</i> Miranda says while you are still reeling and coughing from your rough face fuck, <i>“why don’t we go ahead and get you that pass?”</i> Almost feeling as if you’ve been drugged, you tag along after the guardswoman, who enters a side gate and lets you into the city.", parse);
					Text.NL();
					Text.Add("<i>“That wasn’t so hard now, was it?”</i> Miranda smirks at your blush. <i>“You should come by and suck my cock more often, make it a regular thing. At least if you want to enter the city again.”</i> Before you can contemplate what she means by that, you’ve arrived at a small booth, manned by a bored-looking city official.", parse);
					Text.NL();
					Text.Add("The guardswoman explains that you are here to write out a pass for you, and that she’ll vouch for you. The administrator eyes you curtly, disapproval clear in his furrowed brow. With a start, you realize that Miranda’s cum is still trailing down from your lips, and you promptly wipe it off, blushing.", parse);
					Text.NL();
					Text.Add("The procedure is rather arduous, but at last you stand there with your visa in hand, and a stomach full of semen. <i>“Later!”</i> Miranda waves dismissively as she walks back to her post, chuckling to herself.", parse);
					Text.NL();
					Text.Add("Well, at least you got a pass now, you tell yourself.", parse);
					Text.NL();
					Text.Add("<b>Acquired citizen’s visa!</b>", parse);
					
					rigard.flags["Visa"] = 1;
				}
				else {
					Text.Add("<i>“Enjoy your visit to Rigard, citizen,”</i> Miranda snickers, opening the gates for you. Staggering through, you enter the streets of the city. With a sinking heart, you realize this will probably be a regular theme for your visits.", parse);
				}
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residental.street, {hour: 1});
				});
			}
			else { // Repeat blowjob
				if(miranda.flags["gBJ"] < 5)
					Text.Add("<i>“You know the drill, come with me.”</i> Miranda leads you into a back alley, pushing  your head down to her crotch and pulling out her [mcockDesc]. <i>“I’m sure you remember what to do.”</i> Meekly, you grasp her member, licking the [mcockTip] demurely. In your [hand]s, the hermaphrodite grows stiff, her rock-hard cock pointing right at you.", parse);
				else {
					parse["Bewildered"] = miranda.flags["public"] == Miranda.Public.Nothing ? "Bewildered, y" : "Y";
					Text.Add("You wait for Miranda to get up, but she just leans back languidly. <i>“Well, what are you waiting for?”</i> she asks, annoyed, <i>“start sucking, slut.”</i> She parts her legs, exposing her bulge to you. [Bewildered]ou glance around at the other guards, but Miranda redirects your attention to her crotch.", parse);
					Text.NL();
					Text.Add("<i>“Don’t mind them, this is the reason you came here anyways, isn’t it?”</i> By now, you might as well conceed her point… there are other ways for you to get into Rigard at this point, and yet here you are, back to get another mouthful of her [mcockDesc]. The others have most likely gotten a good idea of what is going on already anyways.", parse);
					if(miranda.flags["public"] < Miranda.Public.Oral)
						miranda.flags["public"] = Miranda.Public.Oral;
				}
				Text.NL();
				parse["head"] = player.HasHorns() ? player.HasHorns().Short() : player.Hair().Short();
				Text.Add("<i>“Suck,”</i> she commands, taking a firm hold of your [head]. Swallowing your pride - and her pre - you start bobbing your head up and down on her shaft, spreading your saliva along the thick pillar of cockmeat. The guardswoman lets you set your own pace for a while, before she takes charge, setting her own rhythm. Like always, the dominant herm is rough with you, showing little care for your well-being as she ravages your throat.", parse);
				Text.NL();
				
				Sex.Blowjob(player, miranda);
				player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
				
				player.AddLustFraction(0.3);
				var mCum = miranda.OrgasmCum();
				miranda.subDom.IncreaseStat(50, 1);
				player.subDom.DecreaseStat(-50, 1);
				
				world.TimeStep({minute: 30});
				
				Text.Add("Once more, you’re rewarded with a stomach-full of Miranda’s thick spunk, the excess slowly trickling down your chin, marking you for the slut you are.", parse);
				Text.NL();
				if(miranda.flags["gBJ"] < 5) {
					Text.Add("<i>“You’re starting to get the hang of this, [playername],”</i> she congratulates you. <i>“How about making it a career of being my bitch?”</i>", parse);
					Text.NL();
					if(rigard.GatesOpen()) {
						Text.Add("<i>“Well, what are you waiting for?”</i> Miranda tugs you to a side gate, out of sight from the main one. <i>“Now, remember that pass or no pass, you are here on <b>my</b> whim. Don’t let me catch you messing around in my town, or I might get some ideas.”</i> Coming from her, you have no doubt that it’s a serious threat.", parse);
						Text.NL();
						Text.Add("Wiping the remaining droplets of the dog-herm’s cum from your lips, you enter the city of Rigard.", parse);
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Residental.street, {minute: 5});
						});
					}
					else {
						Text.Add("<i>“Oh… that’s right, look at the time,”</i> Miranda grins lecherously. <i>“Sorry, the gates are closed at this hour, please come back later.”</i> With that, she summarily dismisses you. You are left standing there, feeling rather foolish.", parse);
						Gui.NextPrompt();
					}
				}
				else {
					Text.Add("<i>“Putting on such a good show for the masses, [playername],”</i> she praises you, gesturing to her grinning colleagues. Quite a few of them have their own cocks out, stroking themselves. <i>“Thanks for the blowjob, bitch,”</i> Miranda grins. <i>“Now shove off, I got work to do.”</i> When you protest that you had a deal, she only laughs at you.", parse);
					Text.NL();
					Text.Add("<i>“You agreed to that way too quickly. I’ve been going too easy on you it seems. If you want to negotiate for entry, you better bring something different to the table...”</i> The hermaphrodite gives your [buttDesc] a sound slap as she passes you, making her meaning clear.", parse);
					if(miranda.flags["gAnal"] == 0) {
						Text.NL();
						Text.Add("W-what? No way!", parse);
					}
					
					miranda.relation.IncreaseStat(30, 1);
					miranda.subDom.IncreaseStat(70, 1);
					player.subDom.DecreaseStat(-70, 1);
					player.slut.IncreaseStat(50, 1);
				}
			}
			Text.Flush();
			
			miranda.flags["gBJ"]++;
		}, enabled : true,
		tooltip : "Offer to blow her."
	});
	if(miranda.flags["gBJ"] >= 5) {
		options.push({ nameStr : "Buttsex",
			func : function() {
				Text.Clear();
				var first    = miranda.flags["gAnal"] == 0;
				var virgin   = player.Butt().virgin;
				var audience = miranda.flags["gAnal"] >= 5;
				
				if(first) { // first
					Text.Add("<i>“Mmm… depends on how good you are,”</i> she purrs at your offer. <i>“But I’m not one to say no to such an offer. Come along here, my little slut.”</i> She leads you to a narrow back alley close to the barracks. For the slums, the smell isn’t so bad. <i>“C’mon, show me the goods,”</i> Miranda murmurs, licking her lips hungrily.", parse);
					Text.NL();
					Text.Add("Turning around, you blush as you lean against the wall of one of the nearby shacks, shivering as her rough hands quickly relieve you of your [bottomArmorDesc], groping the [skinDesc] of you [buttDesc]. You jolt and whimper in surprise when the herm places the tip of her [mcockDesc] against your [anusDesc]. R-really? Not even any preparation?", parse);
					Text.NL();
					Text.Add("<i>“What? You did offer it yourself, did you not?”</i> You feel a wet splatter against your back door as she applies some spit. <i>“There, feel better now? You might want to bite down for this though...”</i>", parse);
					Text.NL();
					if(virgin) {
						Text.Add("Caught in a bout of panic, you blabber on about how this is your first time, and please, please be gentle. The sincerity catches the dominant herm off-guard, though her hold on your butt remains firm.", parse);
						Text.NL();
						Text.Add("<i>“You’d give your first to me…?”</i> Miranda’s voice sounds uncharacteristically small and hesitant. <i>“I’ll take it, but lets drop the pretense that you are doing this just to get into the city, will you? You have a slutty streak running as deep as the roots of the Great Tree!”</i>", parse);
						Text.NL();
						Text.Add("Her brief vulnerable moment over, she continues more confidently: <i>“As for me being gentle… you are asking the wrong girl. How about this? I’ll start with just the tip… followed by the knot. Repeatedly.”</i>", parse);
						
						miranda.relation.IncreaseStat(100, 10);
					}
					Text.NL();
					Text.Add("No sooner has she uttered the words than she acts on them, her hips pushing forward, ramming through whatever defenses you are able to scrape together with ease. You are too shocked at the sudden intrusion to even voice a protest, gasping for air as you feel her thick rod sliding into your [anusDesc].", parse);
					Text.NL();
					
					Sex.Anal(miranda, player);
					player.FuckAnal(player.Butt(), miranda.FirstCock(), 4);
					miranda.Fuck(miranda.FirstCock(), 3);
					
					Text.Add("<i>“See, not too bad, is it?”</i> The guardswoman grunts, shoving another few inches inside you.", parse);
				}
				else if(miranda.flags["gAnal"] < 5) { // repeat < 5
					Text.Add("<i>“Back for another rough buttfucking? You really are a slut, you know that right?”</i> You bow your head a bit shamefully, unable to deny her accusation. <i>“Be my guest,”</i> she shrugs, gesturing for you to enter the alleyway. <i>“I’ll be right back, guys, just need to ram a long, thick cock up this little bitch’ ass,”</i> Miranda tells her grinning companions. You can feel their gazes burning into your back as you follow the herm.", parse);
					Text.NL();
					Text.Add("<i>“Bend over for me,”</i> she growls, her breath quickening as she fumbles with her britches, freeing her monster cock. You obey, gasping as she all but tears through your gear, exposing your [buttDesc] and your soon-to-be-fucked hole. <i>“If last time didn’t break you, I’ll just have to try harder this time, won’t I?”</i> Hardly words to settle your uneasy mind, especially with her [mcockTip] pressing against your [anusDesc]. You feel something cold and slippery pouring down your taint, lubing you up for the coming anal assault.", parse);
					Text.NL();
					Text.Add("Even if she gives you that courtesy, it is the only one you’ll get. In one smooth motion, the hermaphrodite canine rams her cock home with all her strength, roughly impaling you on her stiff pole.", parse);
					Text.NL();

					Sex.Anal(miranda, player);
					player.FuckAnal(player.Butt(), miranda.FirstCock(), 4);
					miranda.Fuck(miranda.FirstCock(), 3);
					
					Text.Add("<i>“Not sure you’ll be able to walk after this one,”</i> the guardswoman grunts as she slams her hips against yours. <i>“Would be a shame, wouldn’t it, going through all of this only to be unable to enter the city afterward!”</i>", parse);
				}
				else { // repeat >= 5
					parse["hisher"] = player.mfTrue("his", "her");
					Text.Add("<i>“Everyone, meet [playername], town slut,”</i> Miranda dramatically introduces you to the other guards, <i>“about to get [hisher] ass fucked by me. I might even allow sloppy seconds.”</i>", parse);
					Text.NL();
					if(miranda.flags["public"] < Miranda.Public.Sex) {
						Text.Add("You start protesting - surely this is too much, even for her - but she cuts you off with a sharp bark.", parse);
						Text.NL();
						Text.Add("<i>“Wouldn’t want to be caught obstructing the long, thick, veiny cock of the law now, would you [playername]?”</i> Miranda growl menacingly. <i>“The guys know all about our little deal, so don’t go looking to them for help. You might play hard to get, but deep down you know you are a total slut for my cock, and you want nothing more than for me to fuck your brains out.”</i>", parse);
						Text.NL();
						Text.Add("Dejectedly, you give in. She’s going to have things go her way, whatever you say or do.", parse);
						Text.NL();
						
						miranda.subDom.IncreaseStat(100, 5);
						player.subDom.DecreaseStat(-100, 5);
						
						miranda.flags["public"] = Miranda.Public.Sex;
					}
					parse["himher"] = player.mfTrue("him", "her");
					Text.Add("Cheeks burning slightly under the scrutiny of the other guardsmen - most of them male, and quite obviously throwing you lecherous glances - you disrobe, bending over the table obediently. <i>“See how well I’ve trained [himher],”</i> Miranda brags.", parse);
					Text.NL();
					if(miranda.SubDom() - player.SubDom() > 50 && Math.random() < 0.5) {
						Text.Add("<i>“Now beg for my cock. Show them how much you need it.”</i>", parse);
						Text.NL();
						Text.Add("Eager to please your mistress, you spread your cheeks, begging for her to fuck you, deep and hard. You are nothing but a pitiful little slut, hungry for [hisher] mistress’ cum. The hermaphrodite pats you fondly, proud of her pet.", parse);
						Text.NL();
					}
					Text.Add("Perhaps as a kindness for you good behavior, Miranda pours some of her lube between your spread asscheeks, rubbing the tip of her cock in the sticky mess before ramming her hips home. Each time she fucks you, it feels more familiar, more <i>right</i>, though she doesn’t grow more gentle over time. The opposite, if anything.", parse);
					
					Sex.Anal(miranda, player);
					player.FuckAnal(player.Butt(), miranda.FirstCock(), 5);
					miranda.Fuck(miranda.FirstCock(), 4);
				}
				Text.NL();
				Text.Add("Miranda sets a wild pace, roughly slamming her hips into yours, fucking you with little care for your pleasure - or well-being for that matter. Her iron grip prevents any attempts at escape, once again reminding you how deceptively strong the canine woman is.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					parse["cock"] = player.NumCocks() > 1 ? "do those pitiful excuses for cocks" : "does that pitiful excuse for a cock";
					Text.Add("<i>“Tell me, [playername],”</i> she grunts in your ear, her breasts pressing against your back, <i>“[cock] ever see any action? Or are you too busy getting nailed by everyone you meet?”</i>", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstCock() && !virgin; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Perhaps next time, I’ll try out that cunt of yours, hmm?”</i> she grunts, one hand trailing down to probe your wet nether lips.", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstVag(); });
				scenes.AddEnc(function() {
					Text.Add("<i>“Nice tits,”</i> she compliments you, <i>“bet they are good cushions, with all the time you spend on your stomach getting railed!”</i>", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstBreastRow().Size() > 3; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Found your true calling, boy?”</i> she mocks you. <i>“If it makes you feel any better, you are not the first guy to get a full dose of Miranda, not by a long shot.”</i>", parse);
					Text.NL();
				}, 1.0, function() { return player.Gender() == Gender.male; });
				
				scenes.Get();
				
				Text.Add("All you can do is bite down and take it, trying to ride out the violent storm. Her cock is pistoning your butt relentlessly, ignoring whatever feeble defense you are able to mount. You can see her wide grin in your minds eye as she uses you - mocking and fierce, almost feral. The dominant doggie continues her stream of humiliating banter, shaming you by calling you her bitch, her slut, her cocksleave.", parse);
				if(first)
					Text.Add("You tell yourself it isn’t true, but instinctively know that you are deceiving yourself.", parse);
				else
					Text.Add("All true, but it serves to remind you how low you’ve fallen.", parse);
				if(audience)
					Text.Add(" That your humiliation is public should make things worse, but somehow, you’ve ceased to care.", parse);
				Text.NL();
				if(first)
					Text.Add("Nothing could have prepared you for this, for her fierce ravaging.", parse);
				else {
					parse["audience"] = audience ? " the burning gazes of your audience," : "";
					Text.Add("You’ll take the mocking words,[audience] any verbal or physical abuse that your mistress dishes out, because one thing is clear to you. You love this.", parse);
				}
				Text.Add(" It hurts, yes.", parse);
				Text.NL();
				Text.Add("At first.", parse);
				Text.NL();
				Text.Add("But before long, the pain is swallowed by a far greater sensation, intense pleasure. Each time Miranda rams her immense rod home, it sends another jolt of blissful ecstasy up your spine. You find yourself moaning loudly, any shreds of defiance long reduced to dust by the inexorable thrusting of her hips.", parse);
				Text.NL();
				Text.Add("<i>“Better hope you are ready for this,”</i> Miranda grunts.", parse);
				Text.NL();
				if(first)
					Text.Add("It quickly becomes very apparent what she is referring to, as the next push brings a new experience. You didn’t think that your ass could be stretched any more than it already is, but the guardswoman is eager to prove you wrong.", parse);
				else
					Text.Add("Once again, you feel an old friend probing your back door, spreading your colon further.", parse);
				Text.Add(" Even before it has begun to swell, her knot is formidable - quite a bit thicker than her already girthy shaft. It takes some effort to ram the ball home, but Miranda isn’t one who is going to let that hinder her. With a final slam of her hips, she pushes it inside, buried to the root in your tortured anus.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Another cherry popped, score one Miranda!”</i> the herm boasts, pumping her fist.", parse);
				}, 1.0, function() { return virgin; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Does that hurt? Knot my problem, slut,”</i> she says, mockingly.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Feel comfortable? Cause I’m not going anywhere any time soon.”</i> No doubt she’s right - once that knot starts to swell, there is no way you are getting it out.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					parse["heshe"] = player.mfTrue("he", "she");
					Text.Add("<i>“Told you [heshe] could take it,”</i> Miranda boasts to her colleagues.", parse);
				}, 1.0, function() { return audience; });
				
				scenes.Get();
				
				world.TimeStep({hour: 1});

				Text.NL();
				Text.Add("The guardswoman is not quite done with you, further breaking down your anal defenses but repeatedly pulling her knot out of your [anusDesc], followed by slamming it home again. Just like with the initial penetration, the pain soon gives way to pleasure so intense you fear it will break your mind.", parse);
				if(player.FirstCock())
					Text.Add(" Even now, before it has swelled to its full size, her knot presses against your prostate with each violation.", parse);
				Text.NL();
				Text.Add("Just when you feel you can’t take any more without being torn apart, Miranda moans loudly, finally reaching her limit. Her hot seed flooding your insides, and her rapidly growing knot tying the two of you together, quickly triggers your own inevitable climax.", parse);
				if(player.FirstCock()) {
					Text.Add(" Your seed splatters harmlessly on the ground, pumped from your twitching [multiCockDesc].", parse);
					player.OrgasmCum();
				}
				if(player.FirstVag())
					Text.Add(" Even untouched, your [vagDesc] still tingles, flowing with your clear, glistening girlcum.", parse);
				Text.NL();
				Text.Add("Wrecked by waves of pleasure, you doubt you’d be able to stand upright if not for Miranda’s hands on your hips. You discover it to be impossible to move, firmly stuck and at her mercy until her knot shrinks down to manageable size again.", parse);
				Text.NL();
				if(first)
					Text.Add("<i>“Better settle in, we’ll be here for a while,”</i> Miranda pants, lying down on your back. <i>“For some reason, I’ve never had anyone run out on me. Must be my charisma.”</i> That and the knot currently sealing your asshole shut. Damn thing feels like its the size of a melon.", parse);
				else if(audience) {
					Text.Add("You yelp loudly as Miranda sits back down on her bench, dragging you with her by your ravaged sphincter. She lets you lie back and rest, chatting with the other guards as you wait for her knot to deflate. You are too exhausted to glean much from the conversation, though you can tell that they are talking about you. Perhaps deciding who gets to go next.", parse);
					if(Math.random() < 0.5) {
						Text.NL();
						Text.Add("<i>“Sure, but you owe me one,”</i> you hear Miranda saying. Flicking your eyes open, you see the fuzzy outline of one of the guards standing in front of you. Before you really have any time to contemplate what he is doing, you feel the hot splatter of spunk landing on your [breastDesc].", parse);
						Text.NL();
						Text.Add("By the time the entire patrol has deposited their loads, you are covered in cum, both inside and out. Humiliated beyond belief, yet unable to will your tired limbs into action, you have no choice but to lie there and take it.", parse);
					}
				}
				else
					Text.Add("<i>“I wonder how many times I have to come before it comes out the other end,”</i> Miranda ponders, rubbing your [stomachDesc]. From the tone in her voice, you can tell it isn’t just her making a jab at you, she really wants to know. You just hope she doesn’t decide to test it.", parse);
				Text.Flush();
				
				player.AddLustFraction(-1);
				var mCum = miranda.OrgasmCum();
				miranda.relation.IncreaseStat(50, 1);
				miranda.subDom.IncreaseStat(100, 1);
				player.subDom.DecreaseStat(-100, 1);
				player.slut.IncreaseStat(80, 1);
				
				miranda.flags["gAnal"]++;
				
				Gui.NextPrompt(function() {
					Text.Clear();
					
					Text.Add("Eventually, Miranda’s knot shrinks down again to merely unmanageable size. With a grunt and a rough shove, the herm dislodges herself from your abused anus, laughing as you fall to the ground. What feels like several gallons of her semen pours out of your gaping butt. You still feel weak and extremely sore after the rough fuck, but you should be able to move again shortly.", parse);
					Text.NL();
					Text.Add("<i>“This time is for free. Ain’t I a generous soul?”</i> The dommy doggie wipes herself off on you before pulling on her pants again, trying to restore her disheveled uniform.", parse);
					Text.NL();
					if(rigard.GatesOpen()) {
						Text.Add("<i>“Well, go ahead, enter. Unless you want to stay for another round,”</i> Miranda waves you toward the gates, not even bothering to get up and open them for you. Hobbling slightly, you make your way inside the city.", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Residental.street, {minute : 10});
						});
					}
					else {
						Text.Add("<i>“Oh right, look at the time,”</i> Miranda grins widely as she adjusts her clothes. <i>“Gates are closed, bitch, better luck next time.”</i> She pats her package fondly. <i>“If you don’t have anything else on your agenda, little Miranda will soon be up for another round...”</i>", parse);
						Text.Flush();
						
						Gui.NextPrompt();
					}
				});
			}, enabled : true,
			tooltip : "What if she gets to fuck you?"
		});
	}
	Gui.SetButtonsFromList(options, true);
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
	
	miranda.flags["Met"] = Miranda.Met.Met;
	
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";

	Text.Clear();
	Text.Add("You set out toward the large city of Rigard, announced by a weathered sign next to the road. The city is built on a tall hill, and a wide river snakes its way past the far side. On the top of the hill stands a castle, its thick walls jutting out from the bedrock and reaching for the heavens. The city itself spreads out below it, divided into several levels by the steep slope.", parse);
	Text.NL();
	Text.Add("Though you see stone walls surrounding Rigard, you notice that there is a large number of residencies beyond their limits, especially toward the waterfront, where a sprawling slum stretches along the river.", parse);
	Text.NL();
	if(party.InParty(kiakai)) {
		Text.Add("As you walk, [name] brings you up to date on the city. Rigard is the largest city on Eden, and the capital of the kingdom holding sway over a large part of the island.", parse);
		Text.NL();
		Text.Add("<i>“I have heard that there is some difficulty entering the city,”</i> the elf informs you, <i>“but since I am a servant of Lady Aria, there should be no problem getting in. The rulers of the kingdom have always been good friends of the order.”</i>", parse);
	}
	else {
		Text.Add("While you don't really know much of the Rigard, other than it seems to be the largest city you have seen so far, possibly the largest on Eden, it is probably a good place to gather information.", parse);
	}
	Text.NL();
	if(rosalin.flags["Met"] != 0) {
		Text.Add("If you could get inside the city, there is a possibility you could get a hold of Rosalin's former teacher, a person who sounds like she could help you out with the gemstone.", parse);
		Text.NL();
	}
	if(world.time.hour >= 22 || world.time.hour < 6)
		Text.Add("As you come closer, you are guided by the light of torches, illuminating a large gate in the wall surrounding the city. It is currently shut for the night. You spot torches drifting along the top of the walls, carried by patrolling guards, another two of whom are posted outside the gatehouse.", parse);
	else // 6-22
		Text.Add("As you come closer, you spot a short line of people, most of them farmers, waiting to be let into the city. There are a few guards posted on top of the walls, and another group guarding the gate. You patiently await your turn, as the last wagon in front of you is inspected and allowed inside.", parse);
	Text.NL();
	Text.Add("One of the guards, a striking female dog-morph with short dark fur, steps forward to meet you, toying with the pommel of a short sword strapped to her hip. She flicks a lock of black hair out of her eyes, looking you over curiously.", parse);
	Text.NL();
	Text.Add("<i>“Reason for visiting Rigard? Carrying any illegal substances? Planning to kill any important officials?”</i> she drones mechanically, going through her routine while allowing her gaze to unabashedly roam your body. Not to be outdone, you return the gesture.", parse);
	Text.NL();
	Text.Add("She is tall and athletic, her movements suggesting powerful muscles beneath her short fur - mostly black or dark brown, with patches of a bright orange on her hands, legs, chest and face. Her long black hair is pulled back in a loose braid hanging down to her waist. Strangely enough, you note that it is held together by a pink ribbon, very much at odds with her otherwise martial outfit.", parse);
	Text.NL();
	Text.Add("Said outfit does a poor job of containing her generous bust, which seems to be ready to spring out at any moment. Her uniform is made from tight-fitting studded leather, with a short leather skirt that ends just above the knees. As the guardswoman shifts her hips, something seems to move under the skirt.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("<i>“Hey, eyes up here,”</i> she barks sharply, slightly amused. <i>“Well?”</i> she challenges, holding out her hand. A bit embarrassed, you realize that you completely spaced out for a second there. <i>“Visitor's pass?”</i> she repeats her question.", parse);
		Text.NL();
		
		if(party.InParty(kiakai)) {
			Text.Add("<i>“Ah, madam, excuse me?”</i> [name] piques in. The guardswoman turns her icy stare on the elf. [HeShe] shrinks back a little, swallowing. <i>“Um, you see, I am from the order-”</i>", parse);
			Text.NL();
			Text.Add("<i>“Do you have a pass?”</i> the dog-morph cuts [himher] off. The elf looks crestfallen, shaking [hisher] head miserably. <i>“Then I'm afraid I can't let you in.”</i>", parse);
		}
		else
			Text.Add("You shake your head, bewildered. This is the first you've heard of this.", parse);
		Text.NL();
		Text.Add("<i>“Look, I'm sorry,”</i> the guard apologizes. <i>“New directives from above, I can't let anyone into the city without a valid pass.”</i> You ask her where one would get such a pass. <i>“From the identification bureau, corner of Bankers' and Minstrel street.”</i>", parse);
		Text.NL();
		Text.Add("What? It is <i>inside</i> the city?", parse);
		Text.NL();
		Text.Add("<i>“Look, I didn't say it made sense, but it's the law,”</i> she sighs, exasperated, <i>“I'd like to let you in, but I just can't. You've shown up in times of unrest, the royals and noble families are very suspicious of strangers, what with the outlaw insurgency going on.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Is there a problem, Miranda?”</i> The dog-morph's partner, a muscular guardsman sporting feline ears.", parse);
		Text.NL();
		Text.Add("<i>“Nosir, no problem sarge,”</i> the woman - apparently named Miranda - replies languidly. She somehow manages to make this sound mocking. Grumbling, her superior shrugs, heading inside again. The dog-morph rolls her eyes.", parse);
		Text.NL();
		Text.Add("<i>“Well, you got mine, what's yours?”</i>", parse);
		Text.NL();
		Text.Add("Seeing as you don't seem to be getting anywhere, you introduce yourself[comp].", parse);
		Text.NL();
		Text.Add("<i>“A pleasure,”</i> Miranda grins.", parse);

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
	Text.Flush();
	//[Pass][Outlaws][Miranda]
	var options = new Array();
	if(Scenes.Miranda.WelcomeToRigardPASS)
		options.push({ nameStr : "Pass",
			func : function() {
				Text.Clear();
				Text.Add("<i>“As I said, the only way to legitimately obtain a pass is to apply for one inside the city itself. That can be quite a bothersome process, though,”</i> Miranda explains. <i>“Another way to get inside is to have someone reputable vouch for you. There are a great number of traders and farmers entering and leaving the city daily, and any one of those could provide you entry.”</i>", parse);
				Text.NL();
				Text.Add("She shakes her head at your brightening expression.", parse);
				Text.NL();
				Text.Add("<i>“Don't get your hopes up too high. Due to the harsh punishment for harboring outlaws, knowingly or not, don't expect people to open up that easily to you. I'm sure you're a nice [guygirl], but these are suspicious times.”</i>", parse);
				
				Scenes.Miranda.WelcomeToRigardPASS = false;
				Scenes.Miranda.WelcomeToRigardQnA();
			}, enabled : true,
			tooltip : "Ask where one could acquire a pass."
		});
	if(Scenes.Miranda.WelcomeToRigardOUTLAWS)
		options.push({ nameStr : "Outlaws",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You really aren't from around here, are you?”</i> the dog-morph looks at you suspiciously. <i>“I'd have a hard time believing there's someone who isn't familiar with the war and the current tension resulting from it.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I say war, but it was really more of an insurgency, rich merchant families and their allies standing up against the authority of the king. It was an ugly, ugly mess, and though most of the ringleaders were rounded up, there are still some active today. More than that, others have joined their ranks. Deserters from the army, men with prices on their heads, common criminals and murderers, the list goes on. Most of these 'freedom fighters' are little more than bandits.”</i>", parse);
				Text.NL();
				Text.Add("<i>“From what I've heard, there is a large group of them holed up somewhere in the forest,”</i> she tells you, motioning toward the dark trees off in the distance. <i>“That said, by the amount of unrest in Rigard right now, you'd almost suspect their base was in the city!”</i>", parse);
				
				Scenes.Miranda.WelcomeToRigardOUTLAWS = false;
				Scenes.Miranda.WelcomeToRigardQnA();
			}, enabled : true,
			tooltip : "Ask her about this outlaw insurgency she mentioned."
		});
	if(Scenes.Miranda.WelcomeToRigardMIRANDA)
		options.push({ nameStr : "Miranda",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Me?”</i> She purses her lips, studying you thoughtfully. <i>“I'm not anyone that special... well, besides being the best fighter the watch's got.”</i> Her confident stance and athletic build give you the impression that this isn't just bravado. Still... curiously, you ask why she is posted watching the gates if she is so important?", parse);
				Text.NL();
				Text.Add("<i>“Nice comeback,”</i> she grins. <i>“You could say I haven't exactly made many friends upstairs. That, and people of my kind aren't really appreciated in Rigard as of late.”</i> People of her... kind?", parse);
				Text.NL();
				Text.Add("<i>“Fur, ears, tail, tell you nothing?”</i> she waves at her appearance, a little annoyed. <i>“I'm a dog-morph, not a human. In Rigard, that makes a large difference.”</i> Clearly not a topic she wants to linger on, so you drop it.", parse);
	
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
	Text.Add("<i>“I enjoyed talking with you, believe it or not, but I've got a job to do here,”</i> she walks back to her post, looking at you over her shoulder. <i>“If you'd like to continue this conversation in a more... casual setting,”</i> she quips, hips swaying suggestively, <i>“meet me after work in the slums. There is a tavern there called the Maidens' Bane. We can hit the town, get to know each other a bit, eh?”</i>", parse);
	Text.NL();
	Text.Add("Quite the bold vixen, Miranda. You say your goodbyes and tell her you'll think about it.", parse);
	Text.NL();
	Text.Add("Now... how should you proceed? Talking with Miranda has given you a few ideas on how to get into the capital.", parse);
	Text.NL();
	Text.Add("From what the dog-morph said, farmers should be able to bring in hired help, which might give you temporary access to the city. ", parse);
	if(farm.Found())
		Text.Add("Perhaps you could ask Gwendy about it.", parse);
	else
		Text.Add("Perhaps you could find a friendly farmer on the great plains.", parse);
	Text.NL();
	Text.Add("Miranda herself seems like she isn't really the sort to bow to authority. She is at work now, but perhaps she could be persuaded to let you into the city if you meet up with her in the slums during the evening hours.", parse);
	Text.NL();
	Text.Add("Failing all else, if those outlaws are as crafty as the guardswoman made them out to be, they should have some way of accessing the city. ", parse);
	if(Scenes.Global.VisitedOutlaws())
		Text.Add("Asking Zenith or Maria could perhaps give you a clue on how to proceed.", parse);
	else
		Text.Add("From what Miranda said, they are probably holed up somewhere in the forest... perhaps it's worth seeking them out.", parse);
	world.TimeStep({hour : 1});
	Text.Flush();
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
	Text.Add("Just as you begin to process all of this, three pursuers dash by, dressed in the uniforms of the Rigard city guard. While they look determined, the thief is lighter on his feet, unencumbered by armor as he is. For a while, it seems certain that he will escape their clutches and disappear down some alley, but his hopes are suddenly dashed by a whirling tornado of dark fur and hard muscle.", parse);
	Text.NL();
	Text.Add("Just as the man is passing by a shady passageway, Miranda the dog-morph guardswoman intercepts him, easily wrestling the thief to the ground despite his greater weight. He struggles a bit, but quiets down when the dobie tightens her hold, threatening to dislocate his shoulder.", parse);
	Text.NL();
	Text.Add("<i>“You’ve been a bad boy,”</i> Miranda murmurs, a gleeful smile playing on her lips, <i>“didn’t your mommy tell you not to steal?”</i> The poor thief grunts an unflattering remark, summarily ignored by the guardswoman. Laughing, she hoists the criminal over her shoulder like a sack of grains. As the procession of guards heads toward the barracks, the victor cups a feel on her captive’s butt, shamelessly groping the poor man.", parse);
	Text.NL();
	Text.Add("<i>“Caught red-handed with his fingers in the cookie jar eh?”</i> the guard chuckles. <i>“You are lucky that you weren’t caught by the royal guard, they’d likely have chopped your hands off for this transgression. Now, you’ll just have to endure a few nights in our comfy cells awaiting your trial.”</i> The dobie pats the thief’s bum possessively, ignoring his whimpering protests. <i>“Look forward to a few visits from me. I know <b>just</b> the punishment for bad boys like you.”</i> You almost feel bad for the guy.", parse);
	Text.NL();
	Text.Add("The group disappears around a corner, their continued conversation muffled by the sounds of the bustling city.", parse);
	Text.Flush();
	
	world.TimeStep({minute : 30});
	Text.Flush();
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
	
	miranda.flags["Met"] = Miranda.Met.Tavern;
	
	Text.Add("As you walk into the dimly lit bar your eyes find Miranda, the guardswoman, sitting in a corner by herself. The tall and curvy dog-morph is wearing tight leather pants laced with green cloth tucked into her high boots, and a very suggestive top piece exposing a fair amount of her cleavage. She notices you and motions you over, patting the bench beside her.", parse);
	Text.NL();
	Text.Add("You walk over and have a seat, while she calls for some more booze. You talk for a while, as she tells you about herself and her job in town.", parse);
	if(miranda.flags["Thief"] != 0) {
		Text.NL();
		Text.Add("When you mention her aggressive take down of the thief you saw earlier, she blushes faintly and avoids your eyes.", parse);
		Text.NL();
		Text.Add("<i>“Well, he <b>was</b> a thief,”</i> she says defensively, <i>“can't be too lenient now, can we.”</i> She sips a bit at her booze thoughtfully. <i>“Though maybe I enjoyed that a bit more than what I should have... was a while since I had a really good time,”</i> she says quizzically. She shifts around uncomfortably in her seat.", parse);
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
				Text.Add("<i>“What do you mean?”</i> you ask her. She gives you a long look, weighing you up, before deciding what to say.", parse);
				Text.NL();
				Text.Add("<i>“It means that I get a bit randy at times and sometimes lose control a bit. Nothing to worry about though.”</i> She reaches over and squeezes your butt a bit. <i>“Might be fun though.”</i> She grins as you blush.", parse);
				
				player.AddLustFraction(0.1);
				miranda.AddLustFraction(0.1);
				
				Scenes.Miranda.HeyThereCont();
			}, enabled : true,
			tooltip : "What does she mean by ‘good time’?"
		});
		options.push({ nameStr : "Flirt",
			func : function() {
				Text.Clear();
				Text.Add("The booze is getting to your head, and you are finding it more difficult to keep your eyes to the more civilized parts of the shapely woman sitting beside you. You shift a bit closer to her until you touch her thigh with you leg, and murmur softly: <i>“<b>I</b> could show you a good time.”</i>", parse);
				Text.NL();
				Text.Add("Miranda, in the middle of chugging down a mug of booze, almost chokes as she starts coughing and wheezing uncontrollably. When she eventually winds down, you realize that she is giggling drunkenly. She leans over to get another bottle, the side of her huge breasts brushing against your arm as she reaches past you. ", parse);
				Text.NL();
				Text.Add("<i>“Down, [boygirl]!”</i> she says jokingly, <i>“and be careful what you wish for!”</i> You can tell she is turned on though, and she doesn't move away from you.", parse);
				
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
	Text.Add("The booze starts to stack up as you continue to talk into the night. You tell her a bit about yourself and your adventures so far, and she contributes witty comments and suggestive remarks.", parse);
	
	Gui.Callstack.push(function() {
		Gui.NextPrompt(Scenes.Miranda.HeyThereCatPorn);
	});
	Gui.Callstack.push(Scenes.Miranda.HeyThereChat);
	Gui.Callstack.push(Scenes.Miranda.HeyThereChat);
	Scenes.Miranda.HeyThereChat();
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
	Text.Add("<i>“I like thish place,”</i> she expresses loudly, <i>“sure it’s a shithole, but there’s great booze to be had, and good company!”</i> She coos and points over into a corner. <i>“And sometimes, raunchy entertainment!”</i>", parse);
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
		Text.Add("<i>“Ooh... now you've gonesh and done itsh!”</i> There is a hungry look in her eyes. The dog-girl is trembling slightly, and her hands are busy below the table, buried between her legs.", parse);
		Text.Flush();
		
		//[Comfort][Check]
		var options = new Array();
		options.push({ nameStr : "Comfort",
			func : function() {
				Text.Clear();
				Text.Add("You shuffle closer and put an arm around her.", parse);
				Text.NL();
				Text.Add("<i>“What's wrong?”</i> you ask innocently.", parse);
				Text.NL();
				Text.Add("<i>“'s jusht... haaaah... a little hot, dear, I'll be fine,”</i> she pants, <i>“all of this made me a bit exschited.”</i> She is shamelessly pawing herself between her thighs, though her hands are covered in shadows by the dim lighting inside the tavern.", parse);
				Text.NL();
				Text.Add("You are not quite sure what's going on, but you hold onto her as she gasps and rides out her small orgasm. She leans against your chest contently, tired from the ordeal. After she has rested a bit, she reaches up to give your cheek a quick kiss.", parse);
				Text.NL();
				Text.Add("<i>“Thanks honey, that wash sweet of you,”</i> she is a bit unsteady on her feet when she gets up, so she leans on your shoulder for support. The two of you walk out into the cool night together.", parse);
				Text.NL();
				Text.Add("The breeze seems to revive Miranda a bit, and she bids you goodbye, heading home.", parse);
				Text.NL();
				Text.Add("<i>“Ah had a really good time, we shud do this again later!”</i> she exclaims to you. She gives you a last nuzzle, squeezes your arm and unsteadily walks of into the night. A faintly glistening trail of sticky liquid slowly drops down one of her legs, forming small pools behind her.", parse);
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
				Text.Add("About a third of it is covered by a furry sheath, but the rest is out in the air, in all its glory. Large veins pulse along the very large member, from the thick knotted base, where her apple-sized testicles hang, heavy with seed, to the pointed tip. Miranda is excitedly pumping on the dick with both hands, her ragged gasps growing exceedingly more urgent. Alarmed, you realize that you are right in the line of fire.", parse);
				Text.NL();
				Text.Add("<b>You now know Miranda is a herm (duh).</b>", parse);
				Text.Flush();
				
				miranda.flags["Herm"] = 1;
				
				//[Flee!][Watch][Help her]
				var options = new Array();
				options.push({ nameStr : "Flee!",
					func : function() {
						Text.Clear();
						Text.Add("A slightly panicked look on your face, you exclaim that she needs another drink, and hurry over to the bar to get one. When you get back, Miranda has calmed down a little bit, looking slightly annoyed. After finishing half the drink, she declares that she has to go home. She stumbles away from you, heading for the exit.", parse);
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
						Text.Add("A slight moan escapes her lips as you violently get hurled back into reality by the first blast of cum. It hits you full in the face, making you flinch as it splatters across your upturned features. The next two follow the first one, while the fourth load, as big and powerful as the previous three, shoots slightly higher and leaves a long streak of canid love juice trailing[hair] and down your back. Miranda moans loudly as the next few blasts land on you chest, thoroughly hosing you.", parse);
						Text.NL();
						Text.Add("After what seems like two minutes, the torrent of semen finally slows down. Miranda looks down blissfully as you experimentally open your mouth and taste the thick substance. It’s salty, and burns on your tongue. A bit unsure of yourself, you look up at the hermaphrodite in front of you. She seems as surprised as you are, but she reaches down and pulls you up. She gives you a sloppy kiss, removing some of the spooge from your face.", parse);
						Text.NL();
						Text.Add("<i>“Well, you certainly took that better than I expected,”</i> she murmurs into your ear. Suddenly you realize that everyone in the bar is staring at you. Blushing furiously, the two of you hastily pick yourselves up and head toward the exit. Outside, Miranda gives you a hug and smiles at you.", parse);
						Text.NL();
						Text.Add("<i>“We have to do that again sometime honey... sometime soon.”</i> She grins wickedly, <i>“you should probably get yourself cleaned up for now though.”</i> She tucks her now softening member back into her tight leather pants, its size making you wonder how it could ever fit there in the first place. She leaves you standing in the dark street, covered in sticky girl-cum.", parse);
						Text.Flush();
						
						miranda.flags["Attitude"] = Miranda.Attitude.Nice;
						miranda.relation.IncreaseStat(100, 5);
						miranda.subDom.IncreaseStat(100, 10);
						var mCum = miranda.OrgasmCum();
						
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
						Text.Add("<i>“Wow, forward, aren’t we?”</i> She blushes slightly, withdrawing her hands from her crotch. She spreads her legs wider to give you room, as you position yourself between her thighs before the rigid monster. First slowly, then more confidently, you start to stroke her shaft, hands moving up and down the massive length, a touch here, a squeeze there.", parse);
						Text.NL();
						Text.Add("You begin to slowly pump her with one hand, while exploring her body with the other. Lovingly, you touch the insides of her thighs, fondle her large balls, play with her sopping pussy and rub her thick knot at the base of her cock. The lustful hermaphrodite is definitely aware of all your efforts, softly goading you on.", parse);
						Text.NL();
						Text.Add("<i>“Oooh, you are good!”</i> she huffs, one of her hands starts to play with her large breasts, teasing the nipples below the rough fabric of her dress into alertness. The other one reaches down to you head and gently guides you forward until your lips are touching the tip of her cock. <i>“Do a girl a favor?”</i> she looks down at you, her ragged breath making her breasts heave.", parse);
						Text.NL();
						Text.Add("You look into her eyes for a long moment. There is a spark there, but of what? Slowly, you open your mouth and lick the tip. The taste is salty and delicious, raising your own arousal even more. Hungrily you wrap your lips around it and start giving the dog the blowjob of her life.", parse);
						Text.NL();
						
						Sex.Blowjob(player, miranda);
						player.FuckOral(player.Mouth(), miranda.FirstCock(), 3);
						miranda.Fuck(miranda.FirstCock(), 3);
						
						if(player.FirstVag()) {
							Text.Add("The moistness between your thighs is maddening, and you reach down to fondle your nether lips while happily slurping at the cock in front of you. Your fingers play around with your labia for a bit, before finding your clit and massaging it. You moan around the beast in your throat as your masturbation brings you closer to your own climax. Miranda notices you, and pants:", parse);
							Text.NL();
							Text.Add("<i>“Don't worry about that, honey, I can help you out... just as soon as you are finished down there.”</i>", parse);
							Text.NL();
						}
						if(player.FirstBreastRow().size.Get() < 3) {
							Text.Add("Your tits heave with your ragged breath as you go down on Miranda. After a while, you stop for a breather, and playfully place the thick cock between your [breastDesc], stroking up and down slowly and drawing soft encouraging moans from Miranda. Her dick is so soaked in your saliva that it’s glistening in the soft candlelight.", parse);
							Text.NL();
							Text.Add("After some intense tit-fucking, a hand tilts your chin up. Miranda looks down at you insistently, and you relent and get back down to business, your lips wrapping about her thick dong.", parse);
							Text.NL();
						}
						if(player.FirstCock()) {
							Text.Add("One of your hands sneak down to free your [multiCockDesc] from [itsTheir] confines. You realise that you are just as hard as Miranda is, and begin to pleasure yourself in time with your bobbing head, your hand moving rapidly up and down[oneof] your member[s].", parse);
							Text.NL();
						}
						
						Text.Add("You continue to suck on her huge dog-dick, hands moving to pleasure the part of her length you simply cannot force down your throat. Dollops of precum leak down from your lips, while inside your overfull mouth, Miranda's tool begins to swell even more. You can feel the heat radiating from her heaving scrotum and see the growing knot in front of you, and realize she is very close to the edge.", parse);
						Text.NL();
						Text.Add("Repressing your gag reflex, you grab her ample butt and push yourself forward until your nose rests in her furry crotch. Miranda cries out loudly in pleasure - probably alerting the few patrons not already aware of what was going on - and grabs the back of your head, holding you down. In short rapid strokes she fucks your ragged throat mercilessly, until she finally hits her peak.", parse);
						Text.NL();
						Text.Add("As her huge member begins to twitch violently in your mouth, you can feel the thick semen being deposited right into your stomach, load after hot load. Just before you black out from lack of air, Miranda pulls out enough for you to breathe. You cough as a few more spurts hit your face, but you feel proud that most of her large load now resides in your slightly distended stomach.", parse);
						
						var mCum = miranda.OrgasmCum();
						
						Text.NL();
						Text.Add("You eagerly lick your lips and give the cock before you a few more slurps, cleaning it up. Miranda smiles down on you with a very satisfied look on her face as you greedily swallow every ounce of thick sperm you can get your lips on. As you climb up from your kneeling position, you realize that the room is silent and everyone's eyes are honed at the two of you. Quite a few of the patrons are openly stroking themselves.", parse);
						Text.NL();
						Text.Add("<i>“I think we just outmatched the felines from earlier, honey,”</i> Miranda says as she leans over, hugging you tightly. One of her hands reach down behind you and grabs your butt, squeezing it tightly. <i>“You were wonderful dear,”</i> she murmurs into your ear as she leans against you, wrecked with exhaustion.", parse);
						Text.NL();
						Text.Add("The bartender, a gruff equine clad in a dark tunic, comes over to your table with two jugs of mead.", parse);
						Text.NL();
						Text.Add("<i>“For the show,”</i> he explains grinning, <i>“we could use some more of that around here, it draws a crowd. You think you two can come more often?”</i> The two of you blush deeply as he returns to the bar, laughing. The conversations start to pick up again around you.", parse);
						Text.NL();
						if(player.FirstVag())
							Text.Add("<i>“As much as I like an audience, do you think you can hold out until next time?”</i> she murmurs, lightly caressing your wet crotch.", parse);
						else
							Text.Add("<i>“Too bad we are the center of attention, I’d love to… continue this,”</i> she grins, caressing your [buttDesc] fondly.", parse);
						Text.NL();
						Text.Add("You snuggle with Miranda for a while longer, enjoying the mead, until the two of you decide to leave for the night. Before the two of you part on the street outside, Miranda pulls you close into a deep kiss, her hands groping your ass roughly. <i>“I think I'll be seeing more of you, and better sooner than later,”</i> she announces as she saunters off into the night, <i>“you know where to find me.”</i>", parse);
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

Scenes.Miranda.BarChatOptions = function(options, back) {
	var parse = {};
	
	back = back || PrintDefaultOptions;
	
	options.push({ nameStr : "Chat",
		func : function() {
			Text.Clear();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Miranda mentions that she likes fish a lot, going on to dreamily explain great fish dishes that she has cooked over time. Funny, you didn't quite look at her like a gourmet cook.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Miranda talks for a while about her biggest hobby, hunting game in the woods. While she usually uses a two-handed blade, she is apparently also really proficient with a bow and arrow. She talks a bit about some of her conquests. You get the feeling that she is searching for something in the forest.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("The two of you chat a bit about Rigard. <i>“Well, it's a nice enough place,”</i> Miranda concedes, <i>“the bar is nice, I have a decent job that brings the dough in.”</i> She grins widely, <i>“and though the place might not be as interesting as the feline home town, I have you around now to keep me entertained!”</i>", parse);
				player.AddLustFraction(0.1);
				miranda.AddLustFraction(0.1);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You ask Miranda about the royal family living in the castle. Her mood darkens immediately, and she spits on the floor besides the table.", parse);
				Text.NL();
				Text.Add("<i>“Rigard may be my home, but don’t think for a second I’ve got anything but scorn for that bunch. Fucking aristocrats...”</i>", parse);
				Text.NL();
				Text.Add("When you ask her why she thinks that way, she gives you a deadpan stare. <i>“Try living in Rigard for a week as a morph, might give you an idea why I left to be a merc.”</i>", parse);
				Text.NL();
				Text.Add("Well, what about the rest of the royals?", parse);
				Text.NL();
				Text.Add("<i>“Heh, they are a right depraved bunch,”</i> Miranda laughs, a wicked grin playing across her features. <i>“There is plenty a rumor about our dear queen, and don’t get me started on the kids. It’s common knowledge they hit the sack together, and you’d have to look hard to find a girlier prince than Rani.”</i>", parse);
				Text.NL();
				Text.Add("<i>“...Still, I’d tap that,”</i> she adds after a thoughtful pause.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Watch your back if you head to the mountains,”</i> Miranda warns you, <i>“I've heard that there are bandits hiding out somewhere there, and it is very close to the boneyard, and that place you should <b>really</b> avoid.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“There’s been a rather odd rumor going around lately,”</i> Miranda tells you. <i>“Apparently, there have been increased sightings of rabbits roaming the countryside. Don’t look at me like that, I’m not making this shit up!”</i> The dog-morph gives you a light punch on the shoulder.", parse);
				Text.NL();
				Text.Add("<i>“They walk on two legs, though they are still pretty small. There have been reports of them attacking in large packs, stealing stuff from unwary travelers. Perhaps they are also involved with the recent disappearances.”</i>", parse);
				Text.NL();
				Text.Add("You ask her if she’s ever seen one.", parse);
				Text.NL();
				Text.Add("<i>“Yeah, they are pretty common critters, I saw them running around occasionally when I worked as a merc, before I joined the watch. Usually kept to themselves, living in holes underground. They are dumb as doorposts, not interested in anything but eating and fucking all day long, which makes those reports even stranger.”</i> She grins at you playfully. <i>“Wouldn’t that be the life, eh?”</i>", parse);
			}, 1.0, function() { return !burrows.Access(); });

			scenes.Get();
			Text.Flush();
			
			back();
		}, enabled : true,
		tooltip : "Just chat for a while."
	});
	options.push({ nameStr : "Guard",
		func : function() {
			Text.Clear();
			Text.Add("You ask Miranda about her job as a guard.", parse);
			Text.NL();

			var scenes = [];
			
			scenes.push(function() {
				Text.Add("<i>“Walking the beat keeps the coin coming, though it isn’t as exciting as mercenary work. Believe it or not, things are usually pretty quiet here.”</i> She shrugs irritably. <i>“I hate doing paper work, give me a thug to beat up any day of the week.”</i>", parse);
				if(miranda.Relation() >= 25) {
					Text.NL();
					Text.Add("She brightens up a bit. <i>“You could always show up at the barracks sometime and keep me company!”</i> she suggests. <i>“You know... take my mind off things for a while,”</i> she grins wickedly.", parse);
					player.AddLustFraction(0.1);
					miranda.AddLustFraction(0.1);
				}
			});
			scenes.push(function() {
				Text.Add("She tells you a few tidbits of information about her comrades in the guard and their peculiarities. You are particularly surprised that the gruff wolf who is usually standing guard at the main gates is into writing sleazy erotic poetry, and has quite the following in the female population of the town.", parse);
				Text.NL();
				Text.Add("<i>“He is way too shy to tell anyone about it though, so he writes under an alias”</i>, she grins. <i>“You didn't hear that from me, though.”</i>", parse);
			});
			scenes.push(function() {
				Text.Add("She tells you a bit more about her guard troop.", parse);
				Text.NL();
				Text.Add("<i>“Did you meet the centaur yet?”</i> she asks you. <i>“He is the strongest guy around here, and a really good archer too.”</i> She brings up a few stories about the two of them hunting together in the forest. Seems like a dependable guy.", parse);
			});
			if(miranda.Relation() >= 25) {
				scenes.push(function() {
					Text.Add("<i>“Well, it has been a lot more entertaining with you around, I'll tell you that!”</i> she giggles. <i>“The other guys there are complaining that my mind is not on the job any more, due to... distractions,”</i> she grins as you blush faintly.", parse);
					Text.NL();
					Text.Add("<i>“It's not a problem though, I can do this job in my sleep... not that you ever let me sleep, honey,”</i> she places a big sloppy kiss on your cheek.", parse);
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
			
			back();
		}, enabled : true,
		tooltip : "Ask her about her job as a city guard."
	});
	options.push({ nameStr : "Forest",
		func : function() {
			Text.Clear();
			// First
			if(miranda.flags["Forest"] == 0) {
				miranda.flags["Forest"] = 1;
				Text.Add("<i>“You said you have been in the big forest, didn't you?”</i> She asks you. <i>“Not that you could miss it, it's practically crawling over our walls.”</i> You nod and tell her about the various strange creatures you've heard inhabits it. <i>“It's a very wild place, where one shouldn't walk around unprepared,”</i> she notes, <i>“you might get some nasty surprises otherwise.”</i>", parse);
				Text.Flush();
				
				//[Sure][Nah]
				var options = new Array();
				options.push({ nameStr : "Like what?",
					func : function() {
						Text.NL();
						Text.Add("She giggles at you.", parse);
						Text.NL();
						Text.Add("<i>“There are creatures in that forest who stalk unwitting prey and capture travellers for fun and for their own release.”</i> She begins to describe more and more extravagant beasts and how they violate passers by, <i>just like you</i>. You gasp at some of the more lurid ones, making her laugh out loud.", parse);
						Text.Flush();
						
						back();
					}, enabled : true,
					tooltip : "Ask her to explain what she means."
				});
				options.push({ nameStr : "Hunting",
					func : function() {
						Text.NL();
						Text.Add("<i>“I'm a bit different,”</i> she says, <i>“I've walked those woods for years hunting game, I know which creatures to avoid.”</i> She gives you a playful glance and places a hand on your thigh.", parse);
						Text.NL();
						Text.Add("<i>“...And I know which ones are good in the sack, if you want some tips.”</i> She howls with laughter at your shocked expression.", parse);
						Text.Flush();
						
						player.AddLustFraction(0.2);
						miranda.AddLustFraction(0.2);
				
						back();
					}, enabled : true,
					tooltip : "How about her, didn’t she say she hunts?"
				});
				Gui.SetButtonsFromList(options);
			}
			// Repeat
			else {
				Text.Add("You ask Miranda about the creatures of the forest. She grins a bit and fills you in on some of the more exotic ones.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Ok,”</i> she begins, <i>“you know those big wolves that prowl around there? Did you know that some of them used to be people?”</i> She goes on to explain that overuse of certain substances enhancing their animal attributes can change a persons body and mind so much that they lose themselves.", parse);
					Text.NL();
					Text.Add("<i>“As long as you keep your wits about you, you should be fine,”</i> she finishes, ordering another mug of mead. <i>“Who knows, I might like having a pet around though...”</i> she adds teasingly. <i>“Just be careful ok?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“The goblin tribes of the deeper woods are a weird bunch,”</i> she muses, taking a long draft of the strong mead in her cup. <i>“They are so constantly mad with lust that they fuck like rabbits. Yet they somehow keep their numbers down with a surprisingly high fatality rate,”</i> she ponders that a bit. <i>“It's probably because they are really, really stupid,”</i> she decides, <i>“just be careful that they don't gang up on you.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“There are some wild feline beasts running around the forest,”</i> she informs you, <i>“they may look cute, but be very careful around them. Unlike the domesticated house cats you might see here in the city, these are natural predators, and are very dangerous. Don't head into their territory unless you have some kind of death wish.”</i>", parse);
				}, 1.0, function() { return true; });
				
				scenes.Get();
				Text.Flush();
				
				back();
			}
		}, enabled : true,
		tooltip : "Ask her about the forest surrounding Rigard."
	});
	if((rigard.Krawitz["Q"] >= Rigard.KrawitzQ.CaughtTerry) && (terry.flags["Saved"] == Terry.Saved.NotStarted)) {
		options.push({ nameStr : "Thief",
			func : function() {
				Text.Clear();
				Text.Add("<i>“The thief? Why do you care?”</i>", parse);
				Text.NL();
				Text.Add("<i>“Just curious,”</i> you reply.", parse);
				Text.NL();
				Text.Add("<i>“Little bastard’s been sentenced to death. He had a long list of infractions, plus he pissed off the higher-ups. And let’s not forget the fact that he’s a morph to boot, ”</i> Miranda explains.", parse);
				Text.NL();
				if(rigard.Krawitz["F"] != 0)
					Text.Add("...Okay, now you really feel guilty for shifting blame onto the fox, even if he <b>is</b> a thief himself. ", parse);
				Text.Add("You ask Miranda when he’s going to be executed.", parse);
				Text.NL();
				Text.Add("<i>“Not for a while, I s’pose they want to beat him up a bit before ending it all,”</i> she takes another swig and slams her mug down on the table. <i>“Bah, let’s talk about something else. I don’t wanna think about how those assholes from the royal guard stole my credit for catching the little bastard.”</i>", parse);
				Text.NL();
				Text.Add("Maybe you should do something about that fox’s execution. Perhaps the royal twins might be willing to help?", parse);
				Text.Flush();
				
				terry.flags["Saved"] = Terry.Saved.TalkedMiranda;
				
				back();
			}, enabled : true,
			tooltip : "Ask Miranda about the thief the two of you caught."
		});
	}
}

Scenes.Miranda.BarTalkOptions = function(options, next) {
	var parse = {};
	
	options.push({ nameStr : "Her past",
		func : function() {
			Gui.Callstack.push(function() {
				Text.Flush();
				next();
			});
			Scenes.Miranda.TalkBackstory(true);
		}, enabled : true,
		tooltip : "Ask Miranda about her past."
	});
	options.push({ nameStr : "Her conquests",
		func : function() {
			Gui.Callstack.push(function() {
				Text.Flush();
				next();
			});
			Scenes.Miranda.TalkConquests(true);
		}, enabled : true,
		tooltip : "Ask Miranda about her past conquests."
	});
}

Scenes.Miranda.HeyThereChat = function() {
	var parse = {};
	Text.NL();
	Text.Add("What do you want to chat with Miranda about?", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	var options = new Array();
	
	Scenes.Miranda.BarChatOptions(options);
	
	Gui.SetButtonsFromList(options);
}


Scenes.Miranda.TakeHome = function() {
	var parse = {
		masterMistress : player.mfTrue("master", "mistress"),
		guyGirl : player.mfTrue("guy", "girl")
	};
	
	Text.Clear();
	if(miranda.Attitude() < Miranda.Attitude.Neutral) {
		Text.Add("</i>”Heh, craving some cock are you?”</i> Miranda chortles, draining the last of her drink and slamming the mug down on the table. </i>”Very well then, slut. Dating you is a waste of time anyway, so let’s get your sweet ass back to my den and skip straight to part you love above all else, my cock,”</i> she says grabbing your arm and dragging you after her as she exits the bar.", parse);
		Text.NL();
		if(player.SubDom() > 0)
			Text.Add("Whatever last-second doubts you may have, you can't do anything to stop her now. Her grip around your wrist is like iron and you have no choice but to follow her as she leads you toward her home.", parse);
		else
			Text.Add("Shame and excitement chase each other through your mind as your alpha bitch drags you back to her den. Lost in the throes of lust, you eagerly keep up with her, anxious to let her decide what to do with you.", parse);
		Text.NL();
		Text.Add("Once you’re at her doorstep, Miranda opens the door and hauls you inside, slamming the door shut and locking it behind her. <i>“Alright then, let’s begin,”</i> she grins, licking her lips.", parse);
		
		world.TimeStep({hour: 1});
		
		Scenes.Miranda.HomeSubbySex();
	}
	else {
		var dom = miranda.SubDom() - player.SubDom();
		if(dom < -25) {
			Text.Add("A smirk curling your lips, you reach around the table and run your hand appreciatively over the firmly toned cheeks of Miranda's ass, reaching through the hole in her pants to scratch at the base of her tail, eliciting a moan from the doberherm. Sliding yourself closer to her, your thigh touching hers, your other hand reaches up to her chest, caressing her tits as best you can through the studded leather armor she wears. An appreciative growl rumbles out of her throat, but it's not the reaction you're after.", parse);
			Text.NL();
			Text.Add("Your hand traces its way down her belly, to a much more vulnerable target. Her maleness is far less protected as you cup her between her legs, stroking and fondling her sheath and her bulging balls with abandon. Miranda's ears flick as she fidgets in her seat, and you can feel her bulging through her pants as her foot-long girlcock begins poking forth and tenting her pants.", parse);
			Text.NL();
			Text.Add("With a playful smile, you coyly scold your naughty bitch for getting so hot and bothered in a place like this. But, since you're such a nice [guyGirl], you'll take her home and let her have some fun. To emphasize your last word, you squeeze her, firmly but gently, through her pants.", parse);
			Text.NL();
			Text.Add("<i>“T-Thank you, [masterMistress],”</i> she whispers, holding back a moan at your ministrations.", parse);
			Text.NL();
			Text.Add("Grinning, you tell her to come on then, giving her one last squeeze to the ass before you remove your hands from her body and imperiously begin heading toward the door. Out of the corner of your eye, you watch the aroused morph eagerly following you, her blatantly tented pants attracting a chorus of whispers and smirks as she follows.", parse);
			Text.NL();
			Text.Add("Meeting her at the door, you sling your arm around her and blatantly grope her ass, squeezing her and worming your fingers between her cheeks. Miranda moans lustfully and wriggles her hips in delight, allowing you to lead her in the direction of her home without the slightest protest.", parse);
		}
		else {
			Text.Add("</i>”Hmm, on one hand I do like spending time with you. On the other hand I also like dessert. So which one should I pick? Should I make you wine and dine me before we get to the good bits?”</i> she muses with a mischievous grin.", parse);
			Text.NL();
			Text.Add("You casually quip to her that if she does skip straight to dessert, that leaves the both of you with a lot more time to have nookie.", parse);
			Text.NL();
			Text.Add("<i>“Sold!”</i> she exclaims, draining the last of her drink and slamming the mug down. She gets up and walks toward the door at a brisk pace. <i>“Come on, slowpoke,”</i> she signals for you to follow.", parse);
			Text.NL();
			Text.Add("With a smile and a shake of your head at Miranda's antics, you hasten to follow the eager morph.", parse);
		}
		Text.NL();
		parse["dom"] = dom < -25 ? "fumbles to open" : "opens";
		Text.Add("You reach her home in record time, where Miranda [dom] the door. Once she’s inside she looks at you expectantly, holding the door for you.", parse);
		Text.Flush();
		
		world.TimeStep({hour: 1});
		
		//[Take Charge][Let Her Lead]
		var options = new Array();
		options.push({ nameStr : "Take Charge",
			func : function() {
				Text.Clear();
				Text.Add("You lunge forward, wrapping your arms around her and pulling her into a passionate kiss. Idly you slam the door shut behind you, blatantly squeezing her ass cheeks as you feel her tented erection rubbing against your midriff.", parse);
				Scenes.Miranda.HomeDommySex();
			}, enabled : true,
			tooltip : "This time you get to run this show."
		});
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("With a smile, you simply stand there on the doorstep and spread your arms, making it clear that you are welcoming Miranda to do with you as she wills. A hungry grin crosses the morph's lips, eyes alight as she promptly grabs you and bodily drags you in over the threshold, slamming the door shut behind you.", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Why not let her take the lead this time?"
		});
		Gui.SetButtonsFromList(options);
	}
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
	
	miranda.flags["Met"] = Miranda.Met.TavernAftermath;
	
	if(miranda.flags["Attitude"] == Miranda.Attitude.Nice) {
		Text.Add("<i>“Well, I honestly didn't think I would see you again after last time,”</i> she laughs softly as you squirm a bit, then pats the bench beside her. Miranda seems very happy that you decided to return, which she makes more clear as she reaches over and whispers in your ear:", parse);
		Text.NL();
		Text.Add("<i>“If you decided to come back, I guess that means you liked my extra equipment. Perhaps you are yearning for round two?”</i> She gently reaches down into your pants, ", parse);
		if(player.FirstCock())
			Text.Add("fondling your now aroused [multiCockDesc].", parse);
		else if(player.FirstVag())
			Text.Add("lightly rubbing your moist [vagDesc].", parse);
		else
			Text.Add("fondling you.", parse);
		Text.Add(" Her probing fingers traces lower, drawing soft moans from you as she slowly circles your [anusDesc]. She slowly starts to push her middle finger up your rectum, feeling around for a while before withdrawing. She winks at you and pats the hidden monster between her legs.", parse);
		Text.NL();
		Text.Add("<i>“Just know that I'd be more than happy to help you with that, if you ever feel you need to let off some steam.”</i> She chuckles at your discomfort and orders some drinks for you.", parse);
		Text.Flush();
		
		miranda.relation.IncreaseStat(100, 5);
		miranda.subDom.IncreaseStat(100, 5);
		player.AddLustFraction(0.5);
		miranda.AddLustFraction(0.5);
		
		Scenes.Miranda.MaidensBanePrompt();
		
		// TODO: Push sexy
	}
	else if(miranda.flags["Attitude"] == Miranda.Attitude.Dismiss) {
		Text.Add("<i>“I.. uh.. I'm sorry about last time,”</i> she says, a bit defensively. <i>“Of course you weren't expecting... that, to, uh, show up.”</i> She rolls her shoulders. <i>“Well, that's my little secret, I'm a hermaphrodite, got both parts and all,”</i> she smiles, back to her old assertive self.", parse);
		Text.NL();
		Text.Add("<i>“Twice the fun though, if you care to try it out.”</i> The dog-morph is obviously waiting for you to say something.", parse);
		
		Text.Flush();
		
		//[Apologize][Leave]
		var options = new Array();
		options.push({ nameStr : "Apologize",
			func : function() {
				Text.Clear();
				Text.Add("You apologize to her for running out, giving her a weak smile. Miranda’s expression softens up a bit.", parse);
				Text.NL();
				Text.Add("<i>“You're not such a bad sort, y'know,”</i> she says, <i>“I guess I should have hinted at it a bit more, I...”</i> she looks at you admiringly and shyly adds, <i>“I just couldn't help myself, you are quite the catch, you know.”</i> She places a hand on your hip and moves in a bit closer.", parse);
				Text.NL();
				Text.Add("<i>“So... now what, pet?”</i> she asks, looking into your eyes. You suggest that the two of you grab a few drinks and have a chat. <i>“Well… a good start, I guess,”</i> she smirks.", parse);
				Text.Flush();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
				
				miranda.relation.IncreaseStat(100, 5);
				
				Scenes.Miranda.MaidensBanePrompt();
			}, enabled : true,
			tooltip : "Apologize for running out on her."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("Murmuring some excuse, you start to shuffle away. There is a slightly hurt look in her eyes.", parse);
				Text.NL();
				Text.Add("<i>“Fine then,”</i> she snaps after you. <i>“Be that way. You’ll regret that if I ever catch you in the streets!”</i> As you glance over your shoulder, she is furiously chugging down a large bottle of booze. She probably won't appreciate seeing you around any more.", parse);
				Text.Flush();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Hate;
				
				miranda.relation.DecreaseStat(-25, 100);
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Not interested. Find an excuse to ditch her.<br/><br/>...On second thought, getting on the bad side of the law might have reprecussions."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("Miranda is lost in thought as you grab a seat next to her. She takes a deep breath and turns to you.", parse);
		Text.NL();
		Text.Add("<i>“Look, I haven't been entirely honest with you. I get a feeling that you like me, and there is something that you need to know before we take this any further.”</i> She heads off to an empty back room, motioning for you to follow. Curious, you go with her. She grabs a bottle of booze from the bar on the way, muttering she needs something to brace herself. You notice that she is already pretty drunk.", parse);
		Text.NL();
		Text.Add("<i>“Please close the door, hun,”</i> she tells you over her shoulder, placing the booze on the table. Turning around, she gives you a measuring look. <i>“I think the best way to do this is to show you,”</i> she murmurs with a sultry look on her face. With her eyes still fixed on you, Miranda reaches for her belt and starts undoing it. When she is done, she turns around, slowly pulling down her tight pants over her curvy hips, exposing more and more dark fur.", parse);
		Text.NL();
		Text.Add("You are thoroughly enjoying the show, but are a bit unsure where this is going. With her back to you, she pulls her pants down to her knees, giving you a glimpse of her tight anus and moist pussy lips. Then... she turns around to face you. Between her long fur-clad legs, just above her juicy slit, you see something you definitely didn't expect. Half hidden in a soft sheath is a very large canid cock, complete with a pointed tip, a set of apple-size balls and a thick knot at the base.", parse);
		Text.NL();
		Text.Add("Even soft, it’s still almost nine inches long and as thick as her arm. You unconsciously lick your lips nervously, contemplating this new development. Miranda takes a challenging pose, legs wide and member jutting out aggressively.", parse);
		Text.NL();
		Text.Add("<i>“Well?”</i> she looks at you, cocking her eyebrow.", parse);
		Text.NL();
		Text.Add("<b>You now know Miranda is a herm (duh).</b>", parse);
		Text.Flush();
		
		miranda.flags["Herm"] = 1;
		
		//[Accept][Leave][Touch it]
		var options = new Array();
		options.push({ nameStr : "Accept",
			func : function() {
				Text.Clear();
				Text.Add("You declare that it doesn’t matter what she has between her legs, you’ll still be her friend, even if her revelation startled you a little bit. Miranda makes a happy yip and gives you a quick hug, her soft member hitting your thigh with a wet slap. A bit embarrassed, she shoves her cock back into her pants, then leads you back to the benches. As you walk she leans on your shoulder and fondles your butt playfully.", parse);
				Text.NL();
				Text.Add("<i>“Friendship accepted,”</i> the guardswoman murmurs. <i>“And who knows, perhaps something more down the line?”</i> she adds playfully.", parse);
				Text.Flush();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
				
				miranda.relation.IncreaseStat(100, 5);
				
				Scenes.Miranda.MaidensBanePrompt();
			}, enabled : true,
			tooltip : "Got no problem with that, you still want to hang out with her."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("Murmuring some excuse, you start to shuffle away. There is a slightly hurt look in her eyes.", parse);
				Text.NL();
				Text.Add("<i>“Fine then,”</i> she snaps after you. <i>“Be that way. You’ll regret that if I ever catch you in the streets!”</i> As you glance over your shoulder, she is furiously chugging down a large bottle of booze. She probably won't appreciate seeing you around any more.", parse);
				Text.Flush();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Hate;
				
				miranda.relation.DecreaseStat(-25, 100);
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Not interested. Find an excuse to ditch her.<br/><br/>...On second thought, getting on the bad side of the law might have reprecussions."
		});
		options.push({ nameStr : "Touch it",
			func : function() {
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
				
				Text.Clear();
				Text.Add("Fascinated by the long member, you move closer and study it meticulously.", parse);
				Text.NL();
				Text.Add("You ask her if you can touch it. Almost a bit flustered, she nods and leans back against the wall, shuffling her legs apart a bit to give you room. You get down on your knees to get closer to the object of your study. You softly move your hands up and down the shaft, lightly touching here and there, drawing increasingly loud moans from Miranda. Your caresses seem to bear fruit, as her cock is slowly hardening and rising up.", parse);
				Text.NL();
				Text.Add("Finally, you lean back and admire your handiwork. Fully erect, Miranda's huge rod pushes out eleven inches from her crotch, even without the support of your hands. As you look up at the hermaphrodite, you see that she is very aroused, and is gazing at you with a wicked smile playing on her lips. Satisfied with your survey, you start to rise up to your feet.", parse);
				Text.NL();
				Text.Add("<i>“Oh no. You can't just leave it like that!”</i> she exclaims drunkenly. The guardswoman makes a flailing grab for you, but loses her footing and falls down on top of you. Surprised, you catch her and set her down in your lap.", parse);
				Text.NL();
				Text.Add("<i>“Please!”</i> she pants urgently, her hands pawing at you inefficiently. <i>“I need to fuck. <b>Now!</b>”</i>", parse);
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
							Text.Add("<i>“I-I'm gonna come!”</i> she gasps. You quickly reach down and grasp her shaft and start jerking her off. As she explodes in a fountain of dog-girl cum, thoroughly drenching the both of you, you glance up and notice that you have a small audience. Seems like two shocked customers just walked in on you, but you are not really in a position to do anything about it. Miranda rams herself down hard, fully impaling herself on your cock[s] as you unload into the depths of her pussy[butt].", parse);
							Text.NL();
							Text.Add("As the both of you ride out your climax, the spectators chuckle to each other and head to another room. They leave the door open for all to see, as you rest in each others arms in an expanding pool of mixed love juices. After resting up a bit, the two of you decide that it is probably best to leave for today. As you walk out into the night, Miranda gives you an peck on the cheek. She seems a bit more demure than her usual abrasive self.", parse);
							Text.NL();

							var cum = player.OrgasmCum();
							var mCum = miranda.OrgasmCum();

							Text.Add("<i>“That was great, hun...”</i> she whispers into your ear. <i>“You can do that to me again aaanytime you like.”</i> Miranda sways off into the night, leaving you alone.", parse);
							Text.Flush();
							
							miranda.relation.IncreaseStat(100, 10);
							miranda.subDom.DecreaseStat(-100, 10);
							
							Gui.NextPrompt(function() {
								MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
								player.AddLustFraction(-1);
								miranda.AddLustFraction(-1);
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
						
						Text.Add("<i>“See? That wasn't so bad, was it honey?”</i> She slaps your butt drunkenly. <i>“Now, are you going to start moving or will I have to do all the work?”</i> Blushing slightly, you slide up and down her length, your tunnel clenching tightly around the hermaphrodite’s bright red pillar.", parse);
						Text.NL();
						Text.Add("Fuck, she is in so deep! The dog-girl roughly grabs hold of your hips, shoving you down on her member. Before long, you are driven to the edge by the wild romp.", parse);
						if(player.FirstBreastRow())
							Text.Add(" Your breasts heave as you bounce up and down, the pleasure making you moan like crazy.", parse);
						if(player.FirstVag())
							Text.Add(" Juices flow freely from your ravaged cunt, clinging to the sides of her dick as you ride her.", parse);
						if(player.FirstCock()){
							Text.Add(" Your cock[s] convulse[notS] and start[notS] pumping semen all over your lover.", parse);
							
							var cum = player.OrgasmCum();
						}
						Text.Add(" She grins as you cum, rocking on top of her.", parse);
						Text.NL();
						parse["butt"] = player.FirstCock() ? ", grinding against your prostate" : "";
						Text.Add("<i>“Oh, I'm not done quite yet, my cute little pet,”</i> she coos. Sitting up and holding you in her lap, she starts to guide you up and down her shaft with her strong hands. Picking up speed, she bounces you wildly[butt].", parse);
						Text.NL();
						Text.Add("Pretty soon you convulse in yet another intense orgasm, making you gasp as she continues to fuck you. You become aware that some of the bar patrons are peeking in through the open door, watching the two of you. Miranda notices them too and grins at them over your shoulder, as she pushes you so far down on her cock that her thick knot pops inside you.", parse);
						Text.NL();
						Text.Add("Your body rests limply against hers as she starts pumping you full of her seed, putting up a show for the audience. As you lean against her, totally exhausted, she whispers in your ear, <i>“Not bad for the first time, I think I’ve found myself a keeper!”</i> Once her knot has shrunk enough and you finally are able to separate, the two of you head out into the night, too tired to keep up the drinking game. Miranda has a thoughtful look on her face.", parse);
						
						var mCum = miranda.OrgasmCum();
						
						Text.NL();
						Text.Add("<i>“Did you enjoy performing in front of an audience?”</i> she asks playfully. <i>“Maybe I shouldn't have been so greedy, and let them join in?”</i> She laughs loudly at your blushing face and saunters off into the night.", parse);
						Text.NL();
						Text.Add("<i>“See you around, pet!”</i>", parse);
						Text.Flush();
						
						miranda.relation.IncreaseStat(100, 10);
						miranda.subDom.IncreaseStat(100, 10);
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
							player.AddLustFraction(-1);
							miranda.AddLustFraction(-1);
						});
					}, enabled : true,
					tooltip : "Give her relief by riding her thick cock."
				});
				options.push({ nameStr : "Let her",
					func : function() {
						Text.Clear();
						Text.Add("You blush a bit, eyeing her throbbing member nervously. Unsure if you are doing the right thing, you ask if she’ll be gentle with you.", parse);
						Text.NL();
						Text.Add("<i>“Gentle?”</i> the dog-morph growls, <i>“I don’t know the meaning of the word!”</i> Before you have time to react, she wrestles you to the ground. Totally surprised by her lunge, you stumble back on your ass as she falls on top of you. Squirming around, you somehow end up on your stomach, butt in the air. Faintly alarmed, you try to crawl away, but she has you pinned to the ground, rutting her huge cock against your back. She hungrily pulls off your [lowerArmor], revealing your naked [buttDesc]. She reaches down, whispering in your ear as she starts probing at your back door.", parse);
						Text.NL();
						Text.Add("<i>“I'm sorry, but I <b>need</b> this,”</i> she almost seems a bit embarrassed about essentially planning to rape you, but she is too aroused to back down now. <i>“You brought this upon yourself you know, my cute little slut,”</i> she moans, trying to justify her actions. <i>“You were practically <b>asking</b> for it!”</i>", parse);
						Text.NL();
						Text.Add("You start to gasp that it wasn't like that, but you are suddenly cut off by a rowdy intruder in your [anusDesc]. Your world is suddenly reduced to your butt, and the huge log stretching it wider and wider. You can feel each bulging vein as the pointy red giant slowly presses deeper and deeper into your bowels, completely disregarding your own opinions on the matter.", parse);
						Text.NL();
						
						Sex.Anal(miranda, player);
						miranda.Fuck(miranda.FirstCock(), 6);
						player.FuckAnal(player.Butt(), miranda.FirstCock(), 6);
						
						parse["butt"] = player.FirstCock() ? " brushing up against your prostate and" : "";
						Text.Add("Finally, the head is firmly lodged inside your [anusDesc]. Your lover sighs in deep contentment as you rasp a few ragged breaths, trying to accommodate for her girth. Miranda is not going to let you have any rest though, as she mercilessly pushes deeper and deeper into your colon,[butt] making you gasp in mixed pleasure and pain.", parse);
						Text.NL();
						Text.Add("<i>“You like that, huh?”</i> the horny dog grunts through her teeth. She gets up on her knees and firmly grabs your buttocks, preparing to go down on you in earnest. <i>“Then I think you will just love this,”</i> she murmurs, she slowly pulls out of you, until the widest part of the head stretches your distended anus.", parse);
						if(player.FirstVag())
							Text.Add(" Your cunt is flooding over, but Miranda is too focused on her current target to notice.", parse);
						if(player.FirstCock())
							Text.Add(" Your own [multiCockDesc] [isAre] twitching in anticipation, a small pool of pre forming on the floor beneath you.", parse);
						Text.NL();
						Text.Add("<i>“Here I come, brace yourself, slut!”</i> she roars, thrusting forward hard with her hips. The intense sensation of being completely filled up almost makes you come then and there. You can feel the incessant prodding of her even thicker knot at your back door, demanding entry. She grunts a bit as she realizes that it won't fit the way it is now, but decides that she'll give it her best try anyway. She proceeds to roughly slam your colon, first pulling out almost all the way before ramming it back as deep as it will go.", parse);
						if(player.FirstCock())
							Text.Add(" Your prostate is mashed every time she trusts her hips, making you yelp in unwilling pleasure.", parse);
						Text.NL();
						Text.Add("After what feels like hours of intense fucking, you can't take it any more.", parse);
						if(player.FirstVag())
							Text.Add(" Your cunt sprays juices all over the floor as you collapse, only held up by the hermaphrodite’s strong hands.", parse);
						if(player.FirstCock()){
							Text.Add(" Your cock[s] violently erupt[notS] on the hard wooden floor, making you cry out in ecstasy.", parse);

							var cum = player.OrgasmCum();
						}
						Text.NL();
						parse["butt"] = player.FirstCock() ? " by repeatedly hitting your prostate" : "";
						Text.Add("Miranda is far from done however, and continues to ram away at your poor abused rectum, quickly building you up to your next anal orgasm[butt]. The massive rod moves more easily now, slick with her precum. The constant stretching pain in your butt does not recede, however, and you realize that she is forcing more and more of her knot into you with every push.", parse);
						Text.NL();
						parse["butt"] = player.FirstCock() ? " as a great force is exerted on your prostate" : "";
						Text.Add("<i>“Almost there, pet, almost, almoooost...”</i> she coos, her breath drawing short. Finally she pulls out, only the pointed tip of her cock poking against your stretched taint. She pulls back her hips as you brace yourself again. When she rams into you, she pushes deeper than ever before, making your eyes bulge in pain. Your body is rocked by another heavy orgasm[butt], increasing the size of the pool of love juices between your knees.", parse);
						Text.NL();
						Text.Add("You incredulously realize that she somehow made it, all of her swollen knot is trapped inside your distended bowels, throbbing as it announces her coming orgasm. You try to pull away, but find it impossible, her thick bulge is trapping you and preventing you from moving even a fraction of an inch. The intense pressure causes your rectal muscles to convulse as yet another anal orgasm wrecks your body, the tightness pushing Miranda well past her own limits.", parse);
						Text.NL();
						Text.Add("<i>“FUUUUUUCK!!!”</i> she loudly cries out, as you feel wave after wave of potent cum fill your belly. The knot is preventing any sperm from escaping, leaving her immense load only one way to go. After what feels like an eternity, she is finally spent. Your belly is stretched beyond what you thought possible, making you look heavily pregnant. Miranda collapses on top of you, the weight of her breasts pressing down on your back.", parse);
						
						var mCum = miranda.OrgasmCum();
						
						Text.NL();
						Text.Add("This, of course, is the time that the bartender decides to check in on you. He surveys the scene clinically: you lie pressed on the floor with your butt sticking out, completely filled by the hermaphrodite dog’s knotted cock. Trickles of the guardswoman’s cum somehow flows past the knot and join the pool of your fluids on the floor. The tall equine sighs and mutters that this will be a mess to clean up, shaking his head as he walks out. The flushed and tired Miranda sits up and pulls you into her lap.", parse);
						Text.NL();
						Text.Add("<i>“Well, I don’t think you have much choice but to stay like this for a while,”</i> she purrs. You have to admit it’s true, the knot is holding you firmly in place. Resigned to your fate, you snuggle up against your canid lover, making the best of the situation. You stay that way for about a quarter of an hour, Miranda whispering dirty pillow talk in your ears. Her words leave you no doubt that she’ll want to do this again, and often. Finally she is able to pull out her softened member from your bowels, releasing a torrent of her cum down your [legs].", parse);
						Text.NL();
						Text.Add("You have a little trouble walking, and don't think you'll be able to sit properly for a few days. The both of you drunkenly stagger out into the night together. Before you part, Miranda pulls you down to your knees, and makes you give her a blowjob right in the middle of the street.", parse);
						Text.NL();
						
						Sex.Blowjob(player, miranda);
						miranda.Fuck(miranda.FirstCock(), 2);
						player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
						
						Text.Add("<i>“Remember that your ass belongs to me now, little slut!”</i> she drunkenly proclaims as she fills your bowels with another batch of dog cum, this time pouring from the other direction. It seems you have brought out a really dominant streak in Miranda.", parse);
						Text.NL();
						Text.Add("<i>“Can't wait for our next fuck, love,”</i> she purrs as she swaggers off into the night.", parse);
						Text.Flush();
						
						miranda.relation.IncreaseStat(100, 15);
						miranda.subDom.IncreaseStat(100, 20);
						
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
							player.AddLustFraction(-1);
							miranda.AddLustFraction(-1);
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
	
	if(miranda.flags["Met"] == Miranda.Met.Met) {
		Scenes.Miranda.HeyThere();
	}
	else if(miranda.flags["Met"] == Miranda.Met.Tavern) {
		if(miranda.flags["Attitude"] >= Miranda.Attitude.Neutral)
			Text.Add("You walk over to Miranda, who is lounging on one of the benches in the shady tavern. She’s already gotten started on her first few drinks, and waves you over when she notices you.");
		else
			Text.Add("You walk over to Miranda, who is lounging on one of the benches in the shady tavern. When she notices you, her eyes narrow dangerously. Looks like she isn't particularly happy about seeing you.");
		Text.NL();
		
		Scenes.Miranda.JustOneMore();
	}
	else if(miranda.flags["Attitude"] >= Miranda.Attitude.Neutral) {
		Scenes.Miranda.MaidensBaneNice();
	}
	else {
		Scenes.Miranda.MaidensBaneNasty();
	}
}

Scenes.Miranda.MaidensBanePrompt = function() {
	var parse = {};
	
	var options = new Array();
	
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add("What did you want to talk about?", parse);
			Text.Flush();
			Scenes.Miranda.MaidensBaneTalkPrompt();
		}, enabled : true,
		tooltip : "Chat with Miranda"
	});
	
	if(miranda.flags["Met"] >= Miranda.Met.TavernAftermath) {
		Scenes.Miranda.BarSexOptions(options);
	}
	Gui.SetButtonsFromList(options, true);
}

Scenes.Miranda.MaidensBaneTalkPrompt = function() {
	var parse = {};
	
	
	var options = new Array();
	if(miranda.flags["Attitude"] >= Miranda.Attitude.Neutral)
		Scenes.Miranda.BarChatOptions(options, Scenes.Miranda.MaidensBaneTalkPrompt);
	// TODO: Restructure this...
	
	if(miranda.flags["Met"] >= Miranda.Met.TavernAftermath) {
		Scenes.Miranda.BarTalkOptions(options, Scenes.Miranda.MaidensBaneTalkPrompt);
	}
	
	Gui.SetButtonsFromList(options, true, Scenes.Miranda.MaidensBanePrompt);
}

Scenes.Miranda.MaidensBaneNice = function() {
	var parse = {};
	//TODO
	Text.Add("", parse);
	Text.Add("You walk over to Miranda, who is lounging on one of the benches in the shady tavern. She’s already gotten started on her first few drinks, and waves you over when she notices you.");
	Text.Flush();
	Scenes.Miranda.MaidensBanePrompt();
}

Scenes.Miranda.MaidensBaneNasty = function() {
	var parse = {};
	//TODO
	Text.Add("", parse);
	Text.Add("[PLACEHOLDER] Bad interactions.");
	Text.NL();
	Text.Flush();
	
	Scenes.Miranda.MaidensBanePrompt();		
}

world.loc.Rigard.Tavern.common.events.push(new Link("Miranda", function() { return miranda.IsAtLocation(); }, true,
function() {
	if(miranda.IsAtLocation())
		Text.Add("Miranda is lounging at a table in the shady tavern. ");
},
Scenes.Miranda.MaidensBaneTalk,
"Miranda is lounging at a table in the shady tavern."));

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
				Text.Add("<i>“I got to spend a lot of time outside Rigard at the very least, travelling all over Eden. I’ve seen the free cities, visited the desert oasis, spent time among the highland tribes. Wherever there was trouble, the Black Hounds were there. Sometimes even before the fact.”</i>", parse);
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
					Text.Add("<i>“Figures that the only thing you’re good for is as a walking prick. You couldn’t even catch me on your own last time, what makes you think you’d have a chance against me? Plus last time I checked, you’re just a lowly watch-dog. The ones really running this town are the royal guards,”</i> Terry shoots back with a defiant glare.", parse);
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
			Text.Add("<i>“Case in point, remember that thief that we caught[t]?”</i> You nod. <i>“No one really gives a shit about Krawitz; he’s a small time noble without any real influence. He doesn’t exactly have a clear conscience himself, considering the things that were found when searching his mansion. I only intended to show him some… corrective action, perhaps throw him in a cell for a few days as payback for that note. That’d make sure he didn’t stir up trouble in my city again. The little fox would’ve been far better off in my care than in that of the royal guard, believe me.”</i>", parse);
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
	
	party.location = world.loc.Rigard.Residental.street;
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

Scenes.Miranda.TerryChaseHome = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("The two of you pause on the street near Miranda’s house, both of you more than a little tired of searching for the elusive thief. Perhaps you could head inside to relieve some stress? Miranda certainly seems to have that idea in mind.", parse);
	Text.NL();
	if(miranda.Attitude() < Miranda.Attitude.Neutral) {
		Text.Add("<i>“Stop for a quick fuck, [playername]?”</i> Miranda shoots, stretching languidly. <i>“All this searching has me aching for some action, if you catch my drift. If not, I’m sure you’ll get what I mean in a few minutes when you are biting the pillow.”</i> The herm closes in on you with a hungry look in her eyes, herding you toward her door.", parse);
		Text.Flush();
		
		//[Let her][Not now]
		var options = new Array();
		options.push({ nameStr : "Let her",
			func : function() {
				Text.Clear();
				Text.Add("<i>“No complaints? Good bitch,”</i> she murmurs as she twirls you around, pushing you ahead. You make no attempt to stop her as she manhandles you through the door and slams it shut behind you.", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "She’s going to have her way with you no matter what you say, why resist?"
		});
		options.push({ nameStr : "Not now",
			func : function() {
				Text.Clear();
				parse["himher"] = terry.flags["Met"] < Terry.Met.Found ? "him" : "her";
				Text.Add("<i>“C’mon, I need some relief here!”</i> Miranda complains, attempting to shove you inside. You barely manage to avoid her grab, dancing outside her reach. <i>“Fine,”</i> she growls, <i>“but I’m getting some action today <b>one</b> way or another.”</i> That doesn’t sound like it bodes well for the thief when you finally catch [himher].", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residental.street, {minute: 5});
				});
			}, enabled : true,
			tooltip : "Point out that you should perhaps look for the thief instead."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else { // nice
		var dom = player.SubDom() - miranda.SubDom();
		parse["mastermistress"] = dom > 50 ? player.mfTrue(" master", " mistress") : "";
		if(dom > 25)
			Text.Add("<i>“Having trouble focusing on the task at hand[mastermistress]?”</i> Miranda quips, licking her lips. <i>“Why don’t we head inside and see if we can relieve your stress?”</i>", parse);
		else if(dom > -25)
			Text.Add("<i>“Good plan, I need something to distract me from this thief for a while. How about we go inside for a quick fuck, [playername]?”</i>", parse);
		else
			Text.Add("<i>“The thief can wait, I need to bury my cock in someone before I go insane with boredom. How about it, [playername]? Want to step inside and take a ride on little Miranda?”</i>", parse);
		Text.Flush();
		
		//[Take charge][Let her lead][Not now]
		var options = new Array();
		options.push({ nameStr : "Take charge",
			func : function() {
				Text.Clear();
				Text.Add("You order her to stop chatting and open the door, taking the chance to give her butt a grope before pushing the surprised herm inside. You step inside and close the door after you. Time to take both of your minds off chasing thieves for a while.", parse);
				
				Scenes.Miranda.HomeDommySex();
			}, enabled : true,
			tooltip : "Take her inside and fuck her."
		});
		options.push({ nameStr : "Let her lead",
			func : function() {
				Text.Clear();
				parse["boyGirl"] = player.mfTrue("boy", "girl");
				Text.Add("You nod eagerly, looking at her imploringly. <i>“Good [boyGirl],”</i> Miranda grins, twirling you around and pushing you through the doorway into her home. The dobie closes the door after you, sealing off your escape.", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Let Miranda take you inside and relieve her stress."
		});
		options.push({ nameStr : "Not now",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You are such a tease sometimes, you know that?”</i> Miranda complains. She grudgingly nods in agreement, leading the way as you try to figure out where to search next.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residental.street, {minute: 5});
				});
			}, enabled : true,
			tooltip : "You should focus on catching the thief instead."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

world.loc.Rigard.Residental.miranda.description = function() {
	
}
world.loc.Rigard.Residental.miranda.onEntry = function() {
	if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry)
		Scenes.Miranda.TerryChaseHome();
	else
		PrintDefaultOptions();
}

