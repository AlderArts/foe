/*
 * 
 * Krawitz's Estate (located in Rigard plaza)
 * 
 */

world.loc.Rigard.Krawitz =
{
	street    : new Event("Krawitz's Estate"),
	servants  : new Event("Servants' Quarters"),
	grounds   : new Event("Grounds"),
	bathhouse : new Event("Bathhouse"),
	Mansion   :
	{
		hall      : new Event("Mansion"),
		study     : new Event("Study"),
		kitchen   : new Event("Kitchen"),
		storeroom : new Event("Storeroom")
	}
}

Scenes.Krawitz = {};
Scenes.Krawitz.EncType = {
	Guard   : 0,
	Servant : 1
}

Scenes.Krawitz.SetupStats = function() {
	Scenes.Krawitz.stat.IsServant         = rigard.Krawitz["Work"] == 1;
	Scenes.Krawitz.stat.HasServantClothes = Scenes.Krawitz.stat.IsServant;
	Scenes.Krawitz.stat.HasWine           = false;
	Scenes.Krawitz.stat.SpikedWine        = false;
	Scenes.Krawitz.stat.ServantFood       = 0;
	Scenes.Krawitz.stat.KrawitzFood       = false;
	Scenes.Krawitz.stat.ChestLocKnown     = false;
	Scenes.Krawitz.stat.TFItem            = false;
	Scenes.Krawitz.stat.TFdKrawitz        = false;
	Scenes.Krawitz.stat.BathhouseVisit    = false;
	Scenes.Krawitz.stat.BathhouseWine     = false;
	Scenes.Krawitz.stat.BathhouseSpiked   = false;
	Scenes.Krawitz.stat.SexedGirls        = false;
	Scenes.Krawitz.stat.ServantWine       = false;
	Scenes.Krawitz.stat.ServantSpikedWine = false;
	Scenes.Krawitz.stat.ServantOrgySetup  = false;
	Scenes.Krawitz.stat.Orgy              = false;
	Scenes.Krawitz.stat.HasSword          = false;
	Scenes.Krawitz.stat.HasBinder         = false;
	
	Scenes.Krawitz.stat.Suspicion         = 0;
	Scenes.Krawitz.stat.AlarmRaised       = false;
	Scenes.Krawitz.stat.guardRot          = 0;
	Scenes.Krawitz.stat.servantRot        = 0;
}

Scenes.Krawitz.GuardDex = function(entity, num) {
	num = num || 1;
	var dex = (entity == Scenes.Krawitz.EncType.Guard) ? 10 : 15;
	return num * dex;
}
Scenes.Krawitz.GuardAtk = function(entity, num) {
	num = num || 1;
	var str = (entity == Scenes.Krawitz.EncType.Guard) ? 40 : 20;
	return num * str;
}
Scenes.Krawitz.GuardCha = function(entity, num) {
	num = num || 1;
	var cha = (entity == Scenes.Krawitz.EncType.Guard) ? 15 : 10;
	if(entity == Scenes.Krawitz.EncType.Guard) {
		if(Scenes.Krawitz.stat.HasServantClothes) cha /= 2;
	}
	else { //Servants
		if(Scenes.Krawitz.stat.IsServant) cha /= 4;
		else if(Scenes.Krawitz.stat.HasServantClothes) cha *= 1.5;
	}
	
	return num * cha;
}
Scenes.Krawitz.ServantSuspicion = function() {
	if(Scenes.Krawitz.stat.IsServant) return 1;
	else if(Scenes.Krawitz.stat.HasServantClothes) return 3;
	else return 2;
}
Scenes.Krawitz.GuardSuspicion = function() {
	if(Scenes.Krawitz.stat.HasServantClothes) return 1;
	else return 3;
}
Scenes.Krawitz.EntitySuspicion = function(entity) {
	if(entity == Scenes.Krawitz.EncType.Guard)
		return Scenes.Krawitz.GuardSuspicion();
	else
		return Scenes.Krawitz.ServantSuspicion();
}

//
// Mansion
//
world.loc.Rigard.Krawitz.street.description = function() {
	Text.AddOutput("You are in front of Krawitz's estate.<br/>");
}

world.SaveSpots["Krawitz"] = world.loc.Rigard.Krawitz.street;
world.loc.Rigard.Krawitz.street.SaveSpot = "Krawitz";

world.loc.Rigard.Krawitz.street.onEntry = function() {
	Scenes.Krawitz.Scouting();
}

world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Plaza", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Plaza, {minute: 10});
	}
));
world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Back street", true, true,
	function() {
		Text.AddOutput("Enter the servants' quarters through the back entrance?<br/>");
	},
	Scenes.Krawitz.WorkWork
));
world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Grounds", true, false,
	function() {
		Text.AddOutput("Enter the main grounds?<br/>");
	},
	Scenes.Krawitz.SneakingIn
));

//
// Grounds
//
world.loc.Rigard.Krawitz.grounds.description = function() {
	Text.AddOutput("There is a lush garden spreading out before you, providing many hiding spots, should you need to avoid patrolling guardsmen or servants. Three buildings line the side of the grounds; if your guesses are correct, the one to your left houses the servants and the one on the right is some sort of bathhouse. Sounds of decidedly feminine laughter echo between the stone pillars. Clearly someone has a party going on.");
	Text.Newline();
	Text.AddOutput("At the back of the estate stands the main building, a two storey mansion.");
}

world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Street", true, true,
	function() {
		Text.AddOutput("If you feel you’ve caused enough trouble for one night, you could leave over the fence. You won’t be able to return again, as people will be a lot more suspicious of newcomers now.");
	},
	function() {
		Text.Clear();
		Text.Add("You’ve managed to avoid detection so far, but you can feel your luck growing thin. Perhaps it is time to call it quits. Eyeing your surroundings carefully, you confirm that no guards are around at the moment. Silently, you slip over the fence, back into the streets. You shed your servants’ garb, hiding it in an alley.");
		Text.NL();
		Text.Add("While it might take a while before the mansion discovers your activities, you decide it’s better to make yourself scarce, and quickly leave the area. Returning at a later time will likely be impossible.");
		Text.Flush();
		
		Scenes.Krawitz.Aftermath();
	}
));

world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Servants'", true, true,
	null,
	function() {
		var parse = {
			
		};
		party.location = world.loc.Rigard.Krawitz.servants;
		
		var ServantPrompt = function() {
			Text.Clear();
			//[Grounds]
			var options = new Array();
			options.push({ nameStr : "Grounds",
				func : function() {
					MoveToLocation(world.loc.Rigard.Krawitz.grounds);
				}, enabled : true,
				tooltip : "Move back to the grounds"
			});
			
			if(Scenes.Krawitz.stat.ServantOrgySetup) {
				Text.Add("The servants’ quarters are just about deserted, with everyone off somewhere to revel. Perhaps you should head over to the bathhouse to see what they are doing? Lewd noises from some of the bunks in the back indicate that at least some of the staff are still present, though quite busy at the moment.", parse);
			}
			else if(Scenes.Krawitz.stat.ServantSpikedWine) {
				Text.Add("The servants’ quarters are a mess of sexual sounds and smells, as the drug you fed them runs its course. At this point, you doubt you could even get them to understand you until they’ve cum themselves dry and had a few cold showers.", parse);
			}
			else {
				if(Scenes.Krawitz.stat.ServantWine)
					Text.Add("The servants wave at you amiably, lulled by the good wine you gave them. Most of them seem to have gone to sleep it off.", parse);
				else
					Text.Add("Not much is going on in the servants’ quarters. The decor is rather sparse, and from what you can gather, men and women share the same rooms. Some people have tucked in for the night, sleeping restlessly on stacked bunk beds, while a few sits around a wooden table, playing cards.", parse);
				Text.NL();
				if(Scenes.Krawitz.stat.IsServant)
					Text.Add("There shouldn’t be any problems with you visiting. You have a legitimate reason for being here, and there shouldn’t be any suspicion raised so long as you don’t do anything weird.", parse);
				else
					Text.Add("While your clothes are probably enough to fool people at a distance, wandering around the servants’ quarters is likely to get you caught quickly. Better be very careful.", parse);
				
				if(Scenes.Krawitz.stat.ServantFood == 1) {
					options.push({ nameStr : "Food",
						func : function() {
							Text.Clear();
							Text.Add("<i>”Many thanks, [brotherSister]!”</i> one of the resting servants calls out. He and his friends gather around, digging into the food. You feel as if a bit of the suspicion surrounding you has dissipated, and that the servants act slightly more trusting towards you.", parse);
							Scenes.Krawitz.stat.ServantFood = 2;
							Scenes.Krawitz.AddSuspicion(-25, true);
							Text.Flush();
							
							Gui.NextPrompt(ServantPrompt);
						}, enabled : true,
						tooltip : "Deliver the servants' food."
					});
				}
				if(Scenes.Krawitz.stat.HasWine && !Scenes.Krawitz.stat.ServantWine) {
					options.push({ nameStr : "Wine",
						func : function() {
							Text.Clear();
							Text.Add("<i>”Hey, what do you have there?”</i> A half-dressed servant asks you, pointing to the bottle of wine sticking out of your pack. You pull it out and show it to him, and he almost reverently cradles the bottle.", parse);
							Text.NL();
							Text.Add("<i>”Where did you get this?”</i> he asks, looking at you suspiciously. <i>”This is from the master’s stock, and a hell of a good one too!”</i> Thinking on your feet, you explain that the bottle is a gift to all the servants, from the ladies of the house.", parse);
							Text.NL();
							Text.Add("<i>”Really now.”</i> He still looks a bit suspicious, but shrugs it off when some of the others gather around, too pleased at the treat to bother about its origins. It seems you are in the clear, as the servants begin a celebration, calling a few sleepy maids from their beds to join the fun. There isn’t much to go around, but everyone gets at least a cup of the rich red wine.", parse);
							Text.NL();
							Text.Add("<i>”Such a kingly gift,”</i> one of them sighs. <i>”Perhaps this place isn’t so bad after all.”</i> The servants thank you, slightly drowsy after the potent wine.", parse);
							
							Scenes.Krawitz.AddSuspicion(-25, true);
							Scenes.Krawitz.stat.ServantWine = true;
							Text.Flush();
							
							Gui.NextPrompt(ServantPrompt);
						}, enabled : true,
						tooltip : "Offer the servants some wine."
					});
				}
				if(Scenes.Krawitz.stat.SpikedWine && !Scenes.Krawitz.stat.ServantSpikedWine) {
					options.push({ nameStr : "Spiked Wine",
						func : function() {
							Text.Clear();
							
							Scenes.Krawitz.stat.ServantWine = true;
							
							if(Scenes.Krawitz.stat.ServantWine) {
								Text.Add("<i>”Ah, the generous lord has seen fit to offer us even more wine? I’m not complaining!”</i> The servants give a great whooping cheer as you pass around the bottle of spiked wine.", parse);
							}
							else {
								Text.Add("<i>”Hey, what do you have there?”</i> A half-dressed servant asks you, pointing to the bottle of wine sticking out of your pack. You pull it out and show it to him, and he almost reverently cradles the bottle.", parse);
								Text.NL();
								Text.Add("<i>”Where did you get this?”</i> he asks, looking at you suspiciously. <i>”This is from the master’s stock, and a hell of a good one too!”</i> Thinking on your feet, you explain that the bottle is a gift to all the servants, from the ladies of the house.", parse);
								Text.NL();
								Text.Add("<i>”Really now.”</i> He still looks a bit suspicious, but shrugs it off when some of the others gather around, too pleased at the treat to bother about its origins. It seems you are in the clear, as the servants begin a celebration, calling a few sleepy maids from their beds to join the fun. There isn’t much to go around, but everyone gets at least a cup of the rich red wine.", parse);
								Scenes.Krawitz.AddSuspicion(-25, true);
							}
							Text.NL();
							Text.Add("<i>”Oh, this packs quite a punch!”</i> one of the servants exclaims, eyes blinking blearily as he tries to stay on his feet. After swaying unsteadily for a few moments, he topples over on his back, confused. <i>”Must ‘ave tripped on something,”</i> he mutters drunkenly. Splayed out on his back as he is, the tent in his pants is clearly visible to everyone in the room.", parse);
							Text.NL();
							Text.Add("You notice that everyone around you is breathing heavily as the potent drug you gave them begins to set in. In a few moments, one of the maids has thrown herself over the fallen servant, desperately clawing at his pants. She quickly frees his stiff member, giving it a long lick before she starts sucking on it, her hands busy between her legs. The wordless impromptu orgy quickly spreads around you, as the inebriated staff try to sate their drug-induced arousal.", parse);
							Text.NL();
							Text.Add("You could leave them like this, or...", parse);
							Text.Flush();
							
							Scenes.Krawitz.stat.ServantSpikedWine = true;
							
							//[Leave][Bathhouse]
							var options = new Array();
							options.push({ nameStr : "Leave",
								func : function() {
									Text.Clear();
									Text.Add("Satisfied that you won’t have to run into any more of the servants, you quickly leave the servants quarters before you are tempted to join. You have more important business to tend to here tonight.", parse);
									Text.Flush();
									
									Gui.NextPrompt(function() {
										MoveToLocation(world.loc.Rigard.Krawitz.grounds);
									});
								}, enabled : true,
								tooltip : "Leave them to it, they likely won’t bother you for the rest of the night."
							});
							options.push({ nameStr : "Bathhouse",
								func : function() {
									Text.Clear();
									Text.Add("You slyly suggest that they ought to thank the kind ladies who provided such a fine gift for them. Some of them are too far gone in their lust to hear you, but you manage to gather a substantial group to listen to your plan. They nod eagerly as you tell them of the ladies partying in the bathhouse, their clouded minds trying to process your words.", parse);
									Text.NL();
									Text.Add("They set off into the garden, swaying slightly and singing lewd tunes. In their state, it will probably take them a substantial time to even <i>find</i> the bathhouse, but it will be pretty interesting when they do. Among their number you see both men and women, and hulking above them all, two huge equine handymen packing rather significant erections.", parse);
									Text.NL();
									Text.Add("This is turning out pretty well… now, where should you go to wreak havoc next?", parse);
									Text.Flush();
									
									Scenes.Krawitz.stat.ServantOrgySetup = true;
									
									Gui.NextPrompt(function() {
										MoveToLocation(world.loc.Rigard.Krawitz.grounds);
									});
								}, enabled : true,
								tooltip : "Why not direct the mob somewhere else?"
							});
							Gui.SetButtonsFromList(options);
						}, enabled : true,
						tooltip : "Offer the servants some wine spiked with aphrodisiac."
					});
				}
			}
			
			Text.Flush();
			
			Gui.SetButtonsFromList(options);
			
			//[Street]
			Input.buttons[11].Setup("Street", function() {
					Text.Clear();
					Text.Add("You’ve managed to avoid discovery so far, but you can feel your luck growing thin. Perhaps it’s time to call it quits. You methodically shed your servants’ garb, returning it to the storeroom before you step out the back door into the street, just another wanderer in the night.", parse);
					Text.NL();
					Text.Add("While it might take a while before the mansion discovers your activities, you decide it’s better to make yourself scarce, and quickly leave the area. Returning at a later time will likely be impossible.", parse);
					Text.Flush();
					
					Scenes.Krawitz.Aftermath();
			}, true, null, "You’ve caused enough trouble for one night, time to call it quits. You won’t be able to return again, as people will be a lot more suspicious of newcomers now.");
		}
	}
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Mansion", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall);
	}
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Bathhouse", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.bathhouse);
	}
));

world.loc.Rigard.Krawitz.grounds.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}


//
// Bathhouse
//
world.loc.Rigard.Krawitz.bathhouse.description = function() {
	Text.AddOutput("You are in the bathhouse of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.bathhouse.links.push(new Link(
	"Grounds", true, true,
	function() {
		Text.AddOutput("Go outside?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds);
	}
));
world.loc.Rigard.Krawitz.bathhouse.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}


//
// Mansion: Hall
//
world.loc.Rigard.Krawitz.Mansion.hall.description = function() {
	Text.AddOutput("You are in the main building of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Grounds", true, true,
	function() {
		Text.AddOutput("Go outside?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds);
	}
));
world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Kitchen", true, true,
	function() {
		Text.AddOutput("Go to the kitchen?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.kitchen);
	}
));
world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Storeroom", true, true,
	function() {
		Text.AddOutput("Go to the storeroom?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.storeroom);
	}
));
world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Study", true, true,
	function() {
		Text.AddOutput("Go to the study?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.study);
	}
));

world.loc.Rigard.Krawitz.Mansion.hall.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}

//
// Mansion: Kitchen
//
world.loc.Rigard.Krawitz.Mansion.kitchen.description = function() {
	Text.AddOutput("You are in the kitchen of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.Mansion.kitchen.links.push(new Link(
	"Hall", true, true,
	function() {
		Text.AddOutput("Return to the hallway?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall);
	}
));
world.loc.Rigard.Krawitz.Mansion.kitchen.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}

//
// Mansion: Storeroom
//
world.loc.Rigard.Krawitz.Mansion.storeroom.description = function() {
	Text.AddOutput("You are in the storeroom of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.Mansion.storeroom.links.push(new Link(
	"Hall", true, true,
	function() {
		Text.AddOutput("Return to the hallway?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall);
	}
));
world.loc.Rigard.Krawitz.Mansion.storeroom.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}

//
// Mansion: Study
//
world.loc.Rigard.Krawitz.Mansion.study.description = function() {
	Text.AddOutput("You are in the study of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.Mansion.study.links.push(new Link(
	"Hall", true, true,
	function() {
		Text.AddOutput("Return to the hallway?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall);
	}
));
world.loc.Rigard.Krawitz.Mansion.study.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}




Scenes.Krawitz.Scouting = function() {
	var parse = {
		
	};
	Text.Clear();
	Text.Add("Following the directions of the red-haired man, you follow the network of side streets, a few blocks away from the main plaza. Seems that the man was right; even though he goes by the monicker of lord, Krawitz’ estate isn’t all that large. The main mansion is an old building constructed of stone, the grounds in front forming a small garden, with lush greenery and a small fountain in the center. Connected to the main house, which stands two stories high, is a building with an open roof that looks to be a bathhouse.", parse);
	Text.NL();
	Text.Add("On the opposite side of the garden, a low building of cheaper make covers one side of the garden, probably intended for servants. The grounds are surrounded by a stone wall on the sides and a metal fence in front, barring unauthorized entry. The gates seems to be locked, but you guess that the servants probably have a back entrance.", parse);
	
	if(rigard.Krawitz["Work"] == 0 && world.time.hour >= 6 && world.time.hour < 20) {
		Text.NL();
		Text.Add("As you approach the estate, you become aware of a commotion down a side street. Curious, you peek down the alleyway that seems to lead to the servants’ entrance. There is a small gathering of people there, most of them morphs of various kinds, embroiled in an argument.", parse);
		Text.NL();
		Text.Add("<i>”I keep tellin’ ya, it’s not worth the pay, not this shit!”</i> The speaker, a dog-morph in his twenties, spits on the ground. <i>”I’m used to people lookin’ down dere noses at me in this city, but lord-fucking-almighty is a cut above the rest.”</i> There is some grudging agreement from the people around him, all of them dressed in blue servants’ livery. Most likely, they all work for Krawitz.", parse);
		Text.NL();
		Text.Add("Well, almost all of them, as the agitated dog-morph tosses aside his blue tunic, leaving it in a crumpled heap in the gutter. <i>”I’ve had it, I’m out.”</i> Looking furious, he strides past you, muttering under his breath. The remaining servants eye each other uneasily.", parse);
		Text.NL();
		Text.Add("<i>”He got a point,”</i> someone grumbles. <i>”With that shit with Jigo last winter, Krawitz made it pretty clear none of us are safe.”</i>", parse);
		Text.NL();
		Text.Add("A girl with rabbit ears poking out of her wiry brown hair hesitantly steps forward. <i>”What are you talking about? I haven’t spoke to the master, as I started last week, but the Lady and the young Miss both treat me nice.”</i>", parse);
		Text.NL();
		Text.Add("The person who spoke first, a wiry old man with bushy side whiskers, steps forward. <i>”They would, a pretty thing like you,”</i> he grumbles, making the servant girl blush. <i>”It’s okay, dear, just keep your head down and don’t get on their bad side. I’m not sure about this new one, but the old wife was a nasty piece of work, perfect fit for her husband.”</i>", parse);
		Text.NL();
		Text.Add("<i>”In any case, last winter was particularly harsh. There was barely any food for us, and someone went and pilfered the storeroom. Never found out who actually did it, but Jigo, the stable boy, took the fall for it. Lord Krawitz was mighty angry, and ordered his mercs to whip the poor boy within an inch of his life before throwing him out into the street. Someone helped him, fortunately, or he would’ve frozen to death right there. He was this close to skewering the lad on that prized sword of his too, t’was all I could do to convince him not to. A bad winter, that was.”</i> An uncomfortable silence falls over the gathering.", parse);
		Text.NL();
		Text.Add("<i>”Work is work, I’ll take his money even if he spits at my feet as I walk by,”</i> another of the servants counters. <i>”The pay may not be good, but it’s way more than I would get working the fisheries.”</i>", parse);
		Text.NL();
		Text.Add("<i>”Work is going to get rougher too, with one gardener short,”</i> the old man complains. <i>”Don’t suppose any of you know your way about a garden, do you? These old bones can’t climb trees like they used to...”</i>", parse);
		Text.NL();
		Text.Add("An opening, huh... this could actually be a golden opportunity for you to get access to the mansion and snoop a bit.", parse);
		Text.Flush();
		
		//[Work][Leave]
		var options = new Array();
		options.push({ nameStr : "Work",
			func : function() {
				Text.Clear();
				Text.Add("Joining the group, you explain that you overheard them, and are currently looking for work. The old man, who seems to be some sort of administrator, eyes you critically.", parse);
				Text.NL();
				
				var racescore = new RaceScore(player.body);
				var humanScore = new RaceScore();
				humanScore.score[Race.human] = 1;
				var humanity = racescore.Compare(humanScore);
				
				if(humanity < 0.5 || player.LowerBodyType() != LowerBodyType.Humanoid) {
					Text.Add("<i>”Sorry kiddo, no offense, but, with your looks, Krawitz would have my head if I let you on the grounds, twenty years of service or no.”</i> The old man shakes his head sadly. <i>”Trust me, it is for the best. Find work elsewhere.”</i>", parse);
					Text.NL();
					Text.Add("Shrugging, you leave the gathering. Seems you aren’t welcome.", parse);
					
					rigard.Krawitz["Work"] = 2;
				}
				else {
					Text.Add("<i>”Well, we are short on people,”</i> he mutters, <i>”you’ll do as good as any, I suppose.”</i> He goes on to question you about your skills and previous experience. Apparently satisfied with what he hears, he gives you a curt nod.", parse);
					Text.NL();
					Text.Add("<i>”Come by tonight at eight o'clock, I’ll let you in the back entrance and show you around while the house sleeps.”</i> The other servants briefly introduce themselves, before moving on to their tasks, break finished. <i>”You get two meals a day, a bunk to sleep in and some coin to spend. Stay on for a week without messing up and I’ll put you on the payroll.”</i>", parse);
					Text.NL();
					Text.Add("His short briefing concluded, the old man heads back inside the estate. <i>”Remember, meet me here at eight o’clock tonight. I’ll be up until midnight, but you don’t want to be late for your first day on the job, eh?”</i>", parse);
					Text.NL();
					Text.Add("With that, you are left to your own devices.", parse);
					Text.NL();
					Text.Add("<b>You should return to Krawitz’ mansion between 20-24 tonight.</b>", parse);
					
					rigard.Krawitz["Work"] = 1;
					
					// TODO #Unlocks new event, must be 20-24 the same day.
					
					Gui.NextPrompt();
				}
				Text.Flush();
			}, enabled : true,
			tooltip : "Take the chance that is presented to you - getting access to the estate should be way easier if you have a legitimate reason for it. Talking to the servants may also give you some ideas on how to humiliate Krawitz."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("Shrugging, you walk on before you are noticed. At least you got some interesting information out of it.", parse);
				Text.Flush();
				
				rigard.Krawitz["Work"] = 2;
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You might be letting this one slip out of your grasp, as the position will likely be filled soon. Still, you don’t intend to wear a servant’ garb for Krawitz. There are other ways."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.NL();
		Text.Flush();
		PrintDefaultOptions(true);
	}
}

Scenes.Krawitz.WorkWork = function() {
	var parse = {
		
	};
	
	Text.Clear();
	
	if(world.time.hour < 6) {
		Text.Add("There doesn’t seem to be anyone at the back door at the moment, and it is locked shut.", parse);
		Text.Flush();
		Gui.NextPrompt();
	}
	else if(rigard.KrawitzWorkDay.Leq(world.time)) { // Late
		Text.Add("<i>”And what do you think you are doing here?”</i> the old manservant greets you gruffly. <i>”I don’t have any use for people who can’t keep track of time.”</i> Before you can mouth an excuse, he curtly dismisses you, locking the door behind him as he returns inside the estate.", parse);
		Text.NL();
		Text.Add("<b>It seems you lost your chance on this one. You should try to get in some other way.</b>", parse);
		Text.Flush();
		
		rigard.Krawitz["Work"] = 2;
		
		Gui.NextPrompt();
	}
	else if(world.time.hour < 20) {
		Text.Add("It isn’t time to go to work yet. You decide to return later.", parse);
		Text.NL();
		Text.Add("<b>The old man said you should show up at the back entrance between 20 and 24 tonight.</b>", parse);
		Text.Flush();
		Gui.NextPrompt();
	}
	else {
		Text.Add("You get a feeling you’ll only get one shot at this, so you’d best be prepared.", parse);
		Text.NL();
		Text.Add("<b>Do you want to save before entering?</b>", parse);
		Text.Flush();
		
		//[Yes][No][Wait]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				LimitedDataPrompt(Scenes.Krawitz.EnteringTheWork);
			}, enabled : true, tooltip : ""
		});
		options.push({ nameStr : "No",
			func : Scenes.Krawitz.EnteringTheWork, enabled : true, tooltip : ""
		});
		options.push({ nameStr : "Wait",
			func : function() {
				Text.NL();
				Text.Add("Deciding that you still need to prepare, you hold off on entering the estate.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You are not quite ready to enter the estate yet."
		});
		Gui.SetButtonsFromList(options);
	}
}

Scenes.Krawitz.EnteringTheWork = function() {
	var parse = {
		name : function() { return party.Get(1).name; }
	};
	
	Text.Clear();
	if(party.NumTotal() == 2) {
		Text.Add("Figuring that one person can move around easier than two, you ask [name] to wait for you outside the estate.", parse);
		Text.NL();
	}
	else if(party.NumTotal() > 2) {
		Text.Add("Figuring that one person can move around easier than a group, you ask your companions to wait for you outside the estate.", parse);
		Text.NL();
	}
	Text.Add("The old man from before shuffles over and unlocks the servants’ entrance on your third knock. He impatiently waves you inside, closing the door behind you.", parse);
	Text.NL();
	Text.Add("<i>”Now then, here is a small advance payment,”</i> he says, handing you a small bag of coins. <i>”Go to the back room and find yourself some livery, then return to me and I shall explain your duties for the night.”</i> You are directed to a small storeroom near the door leading to the grounds. Inside, you find a number of blue tunics and dresses, just like the ones you saw the servants wearing earlier.", parse);
	Text.NL();
	Text.Add("You take your time finding one that fits, glad you’ll be able to move around comfortably. Once properly dressed, you return to the old man. He briefly goes through your basic duties, stressing a few key points.", parse);
	Text.NL();
	Text.Add("<i>”Understand? Once you are done tending the grounds, go to the kitchens and fetch food for the night staff. The ladies of the house are currently in the bathhouse, so stay clear of that. At this time of the night, master Krawitz is probably in his study, you are not to disturb him under any circumstances.”</i>", parse);
	Text.NL();
	Text.Add("You nod amiably, leaving the servants' quarters for the grounds. This is going to be almost too easy...", parse);
	Text.NL();
	Text.Add("<b>You received 50 coins!</b>", parse);
	Text.Flush();
	
	Scenes.Krawitz.SetupStats();
	
	party.coin += 50;
	
	MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 30});
}

Scenes.Krawitz.ApproachGates = function() {
	var parse = {
		
	};
	
	Text.Clear();
	if(world.time.hour >= 4 && world.time.hour < 20) {
		Text.Add("The guards at the gate don’t look too friendly. You’d best wait until the cover of night if you want to covertly enter the estate.", parse);
		Text.Flush();
		Gui.NextPrompt();
	}
	else {
		Text.Add("The gate in the fence surrounding the estate is lit by a torch, and you see a bored guard posted outside. Approaching that way seems out of the picture. You note, however, that the light of the torch doesn’t reach very far. You should be able to slip over the fence without anyone noticing.", parse);
		Text.NL();
		Text.Add("You get a feeling you’ll only get one shot at this, so you’d best be prepared.", parse);
		Text.NL();
		Text.Add("<b>Do you want to save before entering?</b>", parse);
		
		Text.Flush();
		
		//[Yes][No][Wait]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				LimitedDataPrompt(Scenes.Krawitz.SneakingIn);
			}, enabled : true, tooltip : ""
		});
		options.push({ nameStr : "No",
			func : Scenes.Krawitz.SneakingIn, enabled : true, tooltip : ""
		});
		options.push({ nameStr : "Wait",
			func : function() {
				Text.NL();
				Text.Add("Deciding that you still need to prepare, you hold off on entering the estate.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You are not quite ready to enter the estate yet."
		});
		Gui.SetButtonsFromList(options);
	}
}

Scenes.Krawitz.SneakingIn = function() {
	var parse = {
		name : function() { return party.Get(1).name; }
	};
	
	Text.Clear();
	if(party.NumTotal() == 2) {
		Text.Add("Figuring that one person can move around easier than two, you ask [name] to wait for you outside the estate.", parse);
		Text.NL();
	}
	else if(party.NumTotal() > 2) {
		Text.Add("Figuring that one person can move around easier than a group, you ask your companions to wait for you outside the estate.", parse);
		Text.NL();
	}
	Text.Add("You take a breath to prepare yourself. Confirming once again that the guard isn’t looking, you quietly approach the metal fence. This shouldn’t be much of a problem.", parse);
	Text.NL();
	
	Scenes.Krawitz.SetupStats();
	
	// Skillcheck
	if(player.Dex() + Math.random() * 20 > 30) {
		Text.Add("You scale the fence, taking care to avoid the sharp spikes crowning each steel rod, and vault over into the grounds. You quickly hide behind some bushes, and glance around.", parse);
		Text.NL();
		Text.Add("So far so good: seems like no one noticed your entry.", parse);
	}
	else {
		Text.Add("The way up is no problem, but as you vault over the fence, something catches on one of the sharp tips crowning the metal rods. Cursing under your breath, you wobble slightly before completely losing your balance and crashing down into a bush in the garden with a loud noise.", parse);
		Text.NL();
		Text.Add("You quickly scamper off, finding yourself a place to hide before the guard arrives. He takes his sweet time searching, but you manage to avoid him without much trouble.", parse);
		Text.NL();
		Scenes.Krawitz.GuardLost(Gender.male);
		
		Scenes.Krawitz.AddSuspicion(30, true);
	}
	
	Text.Flush();
	MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
}

Scenes.Krawitz.GuardLost = function(gender) {
	var parse = {
		HeShe  : gender == Gender.male ? "He" : "She",
		heshe  : gender == Gender.male ? "he" : "she",
		hisher : gender == Gender.male ? "his" : "her"
	}
	
	var texts = [
	"<i>”Huh, must have been nothing,”</i> the guard mutters, returning to [hisher] post.",
	"<i>”I could have sworn I heard something,”</i> the guard mutters, looking around.",
	"<i>”Probably just a rat,”</i> the guard shrugs.",
	"<i>”I must be imagining things,”</i> the guard mutters, shaking [hisher] head."
	];
	var text = texts[Math.floor(Math.random() * texts.length)];
	
	return Text.Add(text, parse);
}

Scenes.Krawitz.GuardConvinced = function(gender) {
	var parse = {
		HeShe  : gender == Gender.male ? "He" : "She",
		heshe  : gender == Gender.male ? "he" : "she",
		hisher : gender == Gender.male ? "his" : "her"
	}
	
	var texts = [
	"<i>”Huh, new faces every day,”</i> the guard mutters.",
	"<i>”They all look the same,”</i> the guard mutters under [hisher] breath as [heshe] wanders off.",
	"<i>”Thought I had met all of the servants...”</i> the guard mutters."
	];
	var text = texts[Math.floor(Math.random() * texts.length)];
	
	return Text.Add(text, parse);
}

Scenes.Krawitz.ServantLost = function(gender) {
	var parse = {
		HeShe   : gender == Gender.male ? "He" : "She",
		heshe   : gender == Gender.male ? "he" : "she",
		hisher  : gender == Gender.male ? "his" : "her",
		servant : gender == Gender.male ? "servant" : "maid"
	}
	
	var texts = [
	"<i>”Probably nothing,”</i> the [servant] shrugs, continuing on [hisher] errands.",
	"<i>”Hate working late at night, I start seeing things,”</i> the [servant] mutters.",
	"<i>”I’ll... just move along then,”</i> the [servant] shuffles away, looking about nervously.",
	"The [servant] peers into the shadows, but doesn’t seem to spot you."
	];
	var text = texts[Math.floor(Math.random() * texts.length)];
	
	return Text.Add(text, parse);
}

Scenes.Krawitz.ServantConvinced = function(gender) {
	var parse = {
		HeShe   : gender == Gender.male ? "He" : "She",
		heshe   : gender == Gender.male ? "he" : "she",
		hisher  : gender == Gender.male ? "his" : "her",
		servant : gender == Gender.male ? "servant" : "maid",
		guygirl : player.mfFem("guy", "girl")
	}
	
	var texts = [
	"<i>”Oh yeah, I remember you now!”</i> the [servant] exclaims, <i>”Silly me, go on.”</i>",
	"<i>”Ah, you are the new [guygirl],”</i> the [servant] says, nodding, <i>”sorry I didn’t recognize you.”</i>.",
	"<i>”Hm.”</i> The [servant] looks at you suspiciously, but lets you get on your way."
	];
	var text = texts[Math.floor(Math.random() * texts.length)];
	
	return Text.Add(text, parse);
}


Scenes.Krawitz.FoundOut = function(entity, num, gender) {
	var parse = {
		entity : entity == Scenes.Krawitz.EncType.Guard ? "the guard" : "the servant",
		s          : num > 1 ? "s" : "",
		notS       : num > 1 ? "" : "s",
		oneof      : num > 1 ? " one of" : "",
		bodyBodies : num > 1 ? "bodies" : "body",
		spiked     : Scenes.Krawitz.stat.SpikedWine ? "spiked " : ""
	};
	
	gender = gender || Math.random() > 0.5 ? Gender.male : Gender.female;
	
	if(num > 1) {
		parse["HeShe"]  = "They";
		parse["heshe"]  = "they";
		parse["hisher"] = "their";
	}
	else if(gender == Gender.male) {
		parse["HeShe"]  = "He";
		parse["heshe"]  = "he";
		parse["hisher"] = "his";
	}
	else {
		parse["HeShe"]  = "She";
		parse["heshe"]  = "she";
		parse["hisher"] = "her";
	}
	
	//[Run][Hide][Charm][Attack!][Wine]
	var options = new Array();
	options.push({ nameStr : "Run",
		func : function() {
			Text.Clear();
			Text.Add("You leg it, somehow managing to hide from [entity][s].", parse);
			Text.Flush();
			
			Scenes.Krawitz.AddSuspicion(Scenes.Krawitz.EntitySuspicion(entity) * 3);
		}, enabled : true,
		tooltip : Text.Parse("Avoid [entity][s], potentially raising the alarm.", parse)
	});
	options.push({ nameStr : "Hide",
		func : function() {
			Text.Clear();
			Text.Add("Quickly, you fade into the shadows, avoiding detection.", parse);
			Text.NL();
			
			if(entity == Scenes.Krawitz.EncType.Guard)
				Scenes.Krawitz.GuardLost(gender);
			else
				Scenes.Krawitz.ServantLost(gender);
			Text.Flush();
			
			Scenes.Krawitz.AddSuspicion(Scenes.Krawitz.EntitySuspicion(entity));
		}, enabled : player.Dex() >= Scenes.Krawitz.GuardDex(entity, num),
		tooltip : Text.Parse("Use your cunning to hide from [entity][s].", parse)
	});
	options.push({ nameStr : "Charm",
		func : function() {
			Text.Clear();
			Text.Add("With your charm and wit, you try to convince [entity][s] that you are one of the staff.", parse);
			Text.NL();
			
			if(entity == Scenes.Krawitz.EncType.Guard)
				Scenes.Krawitz.GuardConvinced(gender);
			else
				Scenes.Krawitz.ServantConvinced(gender);
			Text.Flush();
			
			Scenes.Krawitz.AddSuspicion(Scenes.Krawitz.EntitySuspicion(entity));
		}, enabled : true,
		tooltip : Text.Parse("Use your guile to convince [entity][s] you belong there.", parse)
	});
	options.push({ nameStr : "Attack!",
		func : function() {
			Text.Clear();
			var s = 1;
			if(Math.random() > 0.5) {
				Text.Add("With some stealth and a few precise strikes, you manage to incapacitate [entity][s] without raising an alarm.", parse);
			}
			else {
				Text.Add("There is a slight scuffle, but you manage to knock out [entity][s].", parse);
				s = 4;
			}
			
			Text.NL();
			Text.Add("You quickly hide the unconscious [bodyBodies] before anyone has a chance to find you.", parse);
			
			Text.Flush();
			
			Scenes.Krawitz.AddSuspicion(s);
		}, enabled : (player.Str() + player.Dex() + player.Sta()) >= Scenes.Krawitz.GuardAtk(entity, num),
		tooltip : Text.Parse("Incapacitate [entity][s].", parse)
	});
	if(Scenes.Krawitz.stat.HasWine) {
		options.push({ nameStr : Scenes.Krawitz.stat.SpikedWine ? "Spiked Wine" : "Wine",
			func : function() {
				var s = Scenes.Krawitz.EntitySuspicion(entity);
				Text.Clear();
				Text.Add("Brushing aside any questions, you offer a cup of spiked wine to [entity][s]. [HeShe] seem a little surprised, but accept gladly. With the the friendlier mood, you manage to slip away while [heshe] enjoy[notS] [hisher] drink[s].", parse);
				if(Scenes.Krawitz.stat.SpikedWine) {
					Text.NL();
					Text.Add("<i>”Ooh! That one went right to the groin,”</i>[oneof] the [entity][s] chuckles, the potent drugged wine quickly taking effect.", parse);
					s = 0;
				}
				Text.Flush();
				
				Scenes.Krawitz.AddSuspicion(s);
			}, enabled : true,
			tooltip : Text.Parse("Offer [entity][s] some [spiked]wine.", parse)
		});
	}
	
	Gui.SetButtonsFromList(options);
}

// TODO: Trigger found out
Scenes.Krawitz.AddSuspicion = function(num, surpressNext) {
	Scenes.Krawitz.stat.Suspicion += num;
	
	if(Scenes.Krawitz.stat.Suspicion > 100) Scenes.Krawitz.stat.Suspicion = 100;
	if(Scenes.Krawitz.stat.Suspicion < 0) Scenes.Krawitz.stat.Suspicion = 0;
	
	if(DEBUG) {
		Text.NL();
		Text.Add("<b>Suspicion + " + num + ": " + Scenes.Krawitz.stat.Suspicion + "/100</b>");
		Text.Flush();
	}
	
	if(Scenes.Krawitz.stat.Suspicion >= 100) {
		Scenes.Krawitz.stat.AlarmRaised = true;
		
		//TODO
	}
	
	if(!surpressNext)
		Gui.NextPrompt();
}


Scenes.Krawitz.PatrollingGuards = function() {
	var parse = {
		
	};
	
	var gender = Math.random() > 0.5 ? Gender.male : Gender.female;
	
	if(gender == Gender.male) {
		parse["HeShe"]  = "He";
		parse["heshe"]  = "he";
		parse["hisher"] = "his";
		parse["himher"] = "him";
	}
	else {
		parse["HeShe"]  = "She";
		parse["heshe"]  = "she";
		parse["hisher"] = "her";
		parse["himher"] = "her";
	}
	
	Text.Clear();
	Text.Add("You spot a pair of guards treading along a pathway, patrolling the garden in front of the mansion. As they walk past you, you catch part of their discussion.", parse);
	Text.NL();
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		//this.Krawitz["Duel"] = 0; // 0 = no, 1 = superwin, 2 = win, 3 = loss
		if(rigard.Krawitz["Duel"] == 3) { //loss
			Text.Add("<i>”I heard some moron tried to challenge Krawitz to a duel,”</i> one of the guards tells [hisher] buddy.", parse);
			Text.NL();
			Text.Add("<i>”Ouch, can’t imagine that ended well,”</i> the other guard winces, <i>”no one died this time though, right?”</i>", parse);
			Text.NL();
			Text.Add("<i>”They got their ass handed to them, but managed to keep their skin at least. Krawitz seems to be in a good mood since then - I think he’s working on something in his study right now.”</i>", parse);
		}
		else if(rigard.Krawitz["Duel"] == 1 || rigard.Krawitz["Duel"] == 2) { //win
			Text.Add("<i>”Hah! Did you hear about what happened when Krawitz visited the plaza earlier?”</i> one of the guard retells the story of Krawitz’ drubbing at your hands, which has become much more dramatic than what you recall.", parse);
			Text.NL();
			Text.Add("<i>”Really? Wish I could’ve been there,”</i> the other guard chortles. <i>”That ass deserves to be knocked down a peg or two.”</i> He looks about nervously. <i>”Sure it’s alright to talk about it though?”</i>", parse);
			Text.NL();
			Text.Add("<i>”Who’s gonna care?”</i> The guard shrugs dismissively. <i>”He’s been holed up in his study on the second floor ever since, biting his nails about the whole thing.”</i>", parse);
		}
		else { //didn't duel
			Text.Add("<i>”One of the servants got chewed out by Krawitz down by the plaza,”</i> one of the guards tells [hisher] buddy. <i>”He was sent to buy something, but apparently they just sold out. Master was furious with him.”</i>", parse);
			Text.NL();
			Text.Add("<i>”What was it that he wanted anyways?”</i> the other guard asks.", parse);
			Text.NL();
			Text.Add("<i>”I dunno, perhaps some expensive wine - he keeps quite the collection. One of the maids told me that she brings at least three cups a night to him in his study.”</i>", parse);
		}
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>”Hear that?”</i> The two pause, listening to the peals of laughter coming from the bathhouse. <i>”Wouldn’t mind joining them,”</i> one of the guards says, grinning lecherously.", parse);
		Text.NL();
		Text.Add("<i>”You’ll be thrown out on your ass the moment Krawitz hears of you peeping on his wife and daughter,”</i> the other one warns [himher].", parse);
		Text.NL();
		Text.Add("<i>”Almost worth it. The new wife is a looker, and the young lady is a fair flower, just waiting to be plucked,”</i> the guard looks longingly towards the stone pillars, [hisher] view blocked by some offending bushes. More giggling and splashing ensue. <i>”Damn old lecher,”</i> one of them mutter. <i>”I heard the new wife is actually a friend of his daughter, almost the same age too.”</i>", parse);
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>”What’s the deal with that sword Krawitz’ totes around anyways?”</i> one of the guard asks the other. <i>”I know he isn’t exactly the wealthiest noble around, but he treats it like it’s some priceless treasure.”</i>", parse);
		Text.NL();
		Text.Add("<i>”It is, you dolt,”</i> the other guard replies, <i>”I hear that blade has been in the family for generations. Probably the single most valuable thing in his possession, save this estate.”</i>", parse);
		Text.NL();
		Text.Add("<i>”Then why does that moron carry it with him everywhere he goes? Someone’s gonna steal it from him one of these days.”</i>", parse);
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>”Bah, sure could use some grub right now,”</i> one of the guards grumbles.", parse);
		Text.NL();
		Text.Add("<i>”We still got another hour left on this shift, you can stuff your fat gut after that,”</i> [hisher] partner taunts.", parse);
		Text.NL();
		Text.Add("<i>”Come on, one can dream, right?”</i> the first complains. <i>”Krawitz may be a massive cheapskate when it comes to hiring, but that cook is amazing. Have you tried his cherry pies? Delicious.”</i>", parse);
		Text.NL();
		Text.Add("<i>”And how would you know? Only the servants are allowed in the kitchens, and I doubt he’d feed something like that to you.”</i>", parse);
	});
	
	var sceneId = Scenes.Krawitz.stat.guardRot;
	if(sceneId >= scenes.length) sceneId = 0;
	
	Scenes.Krawitz.stat.guardRot = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();

	Text.NL();
	
	var rand = Math.random();
	if(rand < 0.2) {
		Text.Add("The guards pass by you, apparently not noticing you.", parse);
		
		Text.Flush();
		Gui.NextPrompt();
	}
	else if(Scenes.Krawitz.stat.HasServantClothes && rand < 0.5) {
		Text.Add("The guards pass by you, apparently assuming you are one of the regular servants.", parse);
		
		Text.Flush();
		Gui.NextPrompt();
	}
	else {
		Text.Add("<i>”Hey, who goes there!”</i> one of the guards calls in your direction, noticing someone hiding in the bushes.", parse);
		
		Text.Flush();
		Scenes.Krawitz.FoundOut(Scenes.Krawitz.EncType.Guard, 2, gender);
	}
}

//Overhear servants (grounds/servants/mansion)
Scenes.Krawitz.WanderingServants = function() {
	var parse = {
		
	};
	var gender = Math.random() > 0.5 ? Gender.male : Gender.female;
	
	if(gender == Gender.male) {
		parse["HeShe"]  = "He";
		parse["heshe"]  = "he";
		parse["hisher"] = "his";
		parse["himher"] = "him";
	}
	else {
		parse["HeShe"]  = "She";
		parse["heshe"]  = "she";
		parse["hisher"] = "her";
		parse["himher"] = "her";
	}
	
	Text.Clear();
	Text.Add("A small group of servants pass your hiding spot, carrying an assortment of wares. They banter and gossip like a bunch of old wives.", parse);
	Text.NL();
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		Text.Add("<i>”Hey, the master’s been holed up in his study for a really long time now... what’s he doing up there?”</i> one of the maids ask her companions.", parse);
		Text.NL();
		Text.Add("<i>”Probably working the numbers,”</i> one of the servants reply, <i>”Krawitz doesn’t have as much money as he used to. I hear he is trying to get into trading, and it isn’t really paying off.”</i>", parse);
		Text.NL();
		Text.Add("<i>”What, really? I thought he was really really rich!”</i>", parse);
		Text.NL();
		Text.Add("<i>”Look, why do you think he pays us so little? What little he still has goes to satisfying the whims of his little princess and his trophy wife.”</i>", parse);
		Text.NL();
		Text.Add("The group is nearing your hiding spot.", parse);
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>”So, like I said, I was fetching some beddings from the storeroom,”</i> one of the servants narrates. <i>”There was this chest, way in the back, and it was slightly open, see?”</i>", parse);
		Text.NL();
		parse["s2hisher"] = Math.random() > 0.5 ? "his" : "her";
		Text.Add("<i>”You are going to get hurt if someone catches you doing that,”</i> another one of the servants warns [himher], <i>”Lord Krawitz doesn’t appreciate people snooping around. ‘Specially not people like us.”</i> The servant sweeps [s2hisher] bushy tail back and forth to emphasize [s2hisher] point.", parse);
		Text.NL();
		Text.Add("<i>”Never mind that, don’t you want to know what I found?”</i> the adventurous servant continues, lowering [hisher] voice. <i>”I looked inside it, and there were all these vials of strange liquids in there.”</i>", parse);
		Text.NL();
		Text.Add("<i>”So you found a perfume stash,”</i> one of the servants dismisses [himher].", parse);
		Text.NL();
		Text.Add("<i>”No! It really was something weird, there were strange markings on it and all. Looked mysterious!”</i> [heshe] exclaims.", parse);
		Text.NL();
		Text.Add("<i>”Can you even read?”</i> one of the others mutter.", parse);
		Text.NL();
		Text.Add("<i>”Only, next time I went there, the chest was moved. I think it’s somewhere in the back, hidden behind the drapes.”</i>", parse);
		Text.NL();
		Text.Add("Hmm. Maybe it could be worth checking out.", parse);
		
		Scenes.Krawitz.stat.ChestLocKnown = true;
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>”How much can those damn women drink?”</i> one of the maids exclaims. She waves two empty flagons at her companions. <i>”Third time I have to fetch more tonight! Not to mention...”</i> she looks around, lowering her voice.", parse);
		Text.NL();
		Text.Add("<i>”Just now, I swear I caught the young lady cupping a feel! On her own mother!”</i>", parse);
		Text.NL();
		Text.Add("<i>”Step-mother,”</i> one of the others point out, <i>”she’s the daughter of the old wife, you know. Still, doesn’t surprise me.”</i>", parse);
		Text.NL();
		Text.Add("The maid looks at her companion in shock.", parse);
		Text.NL();
		Text.Add("<i>”The way I hear it, those two knew each other before she married into the family. Might even be the young lady was the one who introduced the new wife to her father.”</i>", parse);
		Text.NL();
		Text.Add("The maid huffs a bit, shaking her head disapprovingly. <i>”Still not right, that.”</i>", parse);
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>”So, you got something going with Ibben, that sullen looking brute of a guard?”</i> one of the servants quips. It seems to hit home, as one of the maids starts blushing furiously, blabbering as she tries to change the subject.", parse);
		Text.NL();
		Text.Add("<i>”No use denying it, girl, I overheard the two of you ‘talking’ behind the shed the other day. It sounded pretty serious.”</i> The servant purses [hisher] lips, pretending to think carefully about the matter. <i>”What did he say now... ‘I’ll plow your fertile fields and plant my seed’. I didn’t know you were planning to start a farm!”</i>", parse);
		Text.NL();
		Text.Add("<i>”N-not true! Stop that!”</i> the girl squeaks in panic.", parse);
		Text.NL();
		Text.Add("<i>”As I recall, you answered ‘fuck my horny cunt with your throbbing dick’. More straightforward, though not quite as poetic,”</i> the servant teases, changing the pitch of [hisher] voice to match the girl’s.", parse);
		Text.NL();
		Text.Add("<i>”I... I don’t know none of that flowery stuff!”</i> The poor girl squirms. She looks at the others, a little worried. <i>”Do you think he would like that?”</i>", parse);
		Text.NL();
		Text.Add("<i>”Your blunt approach seems to be working, don’t worry about it,”</i> the third servant consoles her. They continue chatting as they walk past you.", parse);
	});
	
	var sceneId = Scenes.Krawitz.stat.servantRot;
	if(sceneId >= scenes.length) sceneId = 0;
	
	Scenes.Krawitz.stat.servantRot = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	Text.NL();
	
	var rand = Math.random();
	if(rand < 0.4) {
		Text.Add("They are so engrossed in their conversation, they pass by your hiding spot without noticing you.", parse);
		
		Text.Flush();
		Gui.NextPrompt();
	}
	else if((Scenes.Krawitz.stat.IsServant && rand < 0.8) || (Scenes.Krawitz.stat.HasServantClothes && rand < 0.3)) {
		Text.Add("<i>”Hey there, want to come help us out?”</i> one of them asks, noticing your servant livery. You decline, explaining you have some other duties to tend to.", parse);
		
		Text.Flush();
		
		Scenes.Krawitz.AddSuspicion(Scenes.Krawitz.ServantSuspicion());
	}
	else {
		Text.Add("<i>”Is there someone there?”</i> one of the maids peers into the shadows nervously.", parse);
		
		Text.Flush();
		Scenes.Krawitz.FoundOut(Scenes.Krawitz.EncType.Servant, Math.random() < 0.5 ? 3 : 4, gender);
	}
}

Scenes.Krawitz.StealingClothes = function() {
	var parse = {
		
	};
	Text.Clear();
	Text.Add("You carefully sneak up to the door leading into what you assume is the servants’ quarters, a plain low building in the back of the garden hidden behind rows of bushes. There seems to be some activity inside. You hear unintelligible snatches of dialogue, and someone apparently snoring extremely loudly.", parse);
	Text.NL();
	Text.Add("Nudging the door open a crack, you spot a storeroom close to the entrance. Perhaps you could find something useful inside, but you run the risk of being found out.", parse);
	Text.Flush();
	
	//[Scavenge][Leave]
	var options = new Array();
	options.push({ nameStr : "Scavenge",
		func : function() {
			Text.Clear();
			Text.Add("You slip inside the building, quickly entering the storeroom.", parse);
			Text.NL();
			if(player.Dex() + Math.random() * 20 > 30) {
				Text.Add("As it happens, no one seems to have noticed you. Not wishing to push your luck too far, you grab one of the blue servants’ garbs from a nearby bin, and make your exit.", parse);
			}
			else {
				Scenes.Krawitz.AddSuspicion(10, true);
				Text.Add("In your haste, you stumble and almost fall, causing a little noise.", parse);
				Text.NL();
				Text.Add("<i>”Who’s there?”</i> you hear a voice from inside the building. Cursing under your breath, you snatch a garment at random and race out of the building. A sleepy servant peers out of the doorway, blinking the sand from his bleary eyes.", parse);
				Text.NL();
				Scenes.Krawitz.ServantLost(Gender.male);
			}
			Text.NL();
			Text.Add("Once you have found a safe place to hide, you try on the clothes you snatched up. They aren’t the right size, but you manage to make them fit. This should give you an easier time moving around, as the regular staff could probably mistake you for one of them in the dark.", parse);
			Text.Flush();
			
			Scenes.Krawitz.stat.HasServantClothes = true;
			
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
		}, enabled : true,
		tooltip : "Perhaps you could find some servants’ garb in the storeroom, to better blend in?"
	});
	options.push({ nameStr : "Leave",
		func : function() {
			Text.NL();
			Text.Add("You carefully withdraw from the servants’ quarters, judging it too difficult to sneak in unnoticed.", parse);
			Text.Flush();
			
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
		}, enabled : true,
		tooltip : "There is too much risk of getting caught."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Krawitz.Bathhouse = function() {
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Krawitz.bathhouse;
	
	Text.Clear();
	if(!Scenes.Krawitz.stat.BathhouseVisit) {
		Scenes.Krawitz.stat.BathhouseVisit = true;
		Text.Add("Lured in by the sounds of carousing, you sneak closer to the open air bathhouse, peeking through the pillars to the lit pool beyond. Two young women are having some sort of private party, involving a lot of tickling, groping and giggling, not to mention copious amounts of wine. The water is clear, and you see that both of the submerged beauties are completely nude. Licking your lips, you draw closer, wanting to get a closer look at the noble ladies.", parse);
		Text.NL();
		Text.Add("You are betrayed by the fickle winds, a sudden gust causing the hanging oil lamps to sway, stripping you of the cover of shadows. ", parse);
		if(Scenes.Krawitz.stat.HasServantClothes) {
			Text.Add("<i>”Don’t tarry about in the shadows,”</i> the older of the women calls out. Her voice carries authority, even if it’s slightly slurred in her drunken state. Though she looks very young, you would guess this woman is lord Krawitz’ wife, which would make the other one his daughter. The two seems to be almost of an age.", parse);
			Text.NL();
			Text.Add("Slightly nervous at getting caught, you step forward, trying to maintain the appearance of a humble servant. The ladies, however, seem too far gone to care about your voyeurism, or their own compromising state.", parse);
			Text.NL();
			Text.Add("<i>”Servant, bring us wine!”</i> she cries out as she stands up, revealing herself in her full glory and drawing peals of laughter from her younger companion. <i>”Haven’t you had enough, ‘Lene?”</i> she murmurs, caressing the older womans’ hip familiarly.", parse);
			Text.NL();
			Text.Add("<i>”Nonsense, Ginny!”</i> the woman called Lene - Helen? Marlene? - scoffs, swaying slightly, her breasts bouncing hypnotically. She definitely has had a few too many, and a misstep causes her to topple over her companion, causing loud splashes, gasps and peals of laughter as the two women disentangle themselves. To you, it seems the last part involves a lot of unnecessary groping from both parties. Apparently, they have a quite friendly relationship.", parse);
			Text.NL();
			Text.Add("<i>”Wine!”</i> they chorus, waving you away. You probably won’t get much more from them until you bring them something to drink. Shaking your head and blushing slightly, you leave them to their carousing.", parse);
			Text.Flush();
			
			player.AddLustFraction(0.2);
			
			Gui.NextPrompt(function () {
				MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 15});
			});
		}
		else {
			Text.Add("The younger of the noblewomen looks at you blearily, whispering something to her companion. The older woman, presumably the lady of the house, gasps when she sees you there wearing street clothes.", parse);
			Text.NL();
			Text.Add("You dash away over the grounds as she cries out in alarm, calling guards to the bathhouse. Curse your thoughtlessness! You manage to scramble over the fence, stinging yourself on the sharp spikes along its top. Limping slightly, you scurry off into the dark, leaving the roused manor behind you.", parse);
			Text.NL();
			Text.Add("Drunk though they may have been, the ladies of the house have probably warned the guards to be on the look-out for you now. It's unlikely you'll have the opportunity to go back any time soon.", parse);
			Text.Flush();
			
			Scenes.Krawitz.Aftermath();
		}
	}
	else if(Scenes.Krawitz.stat.Orgy) {
		Text.Add("The big orgy is still going on. As much as you’d like to join in, the wiser move is to leave now and explore the mansion while you still have the chance.", parse);
		Text.Flush();
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
		});
	}
	else if(Scenes.Krawitz.stat.BathhouseSpiked) {
		Text.Add("The ladies are still recovering, reclining in the pool cuddling up next to each other, though the effects of the drug you gave them still have a firm hold.", parse);
		Text.Flush();
		if(Scenes.Krawitz.stat.ServantOrgySetup) {
			Text.Add(" They are about to receive all the company they can handle, as you hear the sounds of the drunken servants closing in on the bathhouse. Things are about to become very interesting. You settle down, deciding to enjoy the show for a bit.", parse);
			Text.NL();
			
			Scenes.Krawitz.OrgyEntrypoint();
		}
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
		});
	}
	else if(Scenes.Krawitz.stat.BathhouseWine) {
		Text.Add("The ladies seems deeply engrossed in each other, cuddling in the big pool. You don’t think they’d appreciate the intrusion.", parse);
		Text.Flush();
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
		});
	}
	else {
		Text.Add("The ladies are cuddled close together in the big pool, and look a bit irritated as you return. Seems like you interrupted something.", parse);
		Text.Flush();
		
		//[Leave][Wine]
		var options = new Array();
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("You quickly retreat, catching lady Krawitz’ command to “fetch that wine, pronto!”", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
				});
			}, enabled : true,
			tooltip : "Leave the two alone for now."
		});
		options.push({ nameStr : "Wine",
			func : function() {
				Text.Clear();
				Scenes.Krawitz.BathhouseWine();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : "Serve them wine."
		});
		options.push({ nameStr : "Spiked Wine",
			func : function() {
				Text.Clear();
				Scenes.Krawitz.BathhouseWine();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : "Serve them the wine, but add some of the aphrodisiac you found."
		});
		Gui.SetButtonsFromList(options);
	}
	
	
	/*
	 * 
	 */
}

Scenes.Krawitz.BathhouseWine = function() {
	var parse = {
	};
	
	Text.Add("Krawitz’ wife coos in delight as you show her the wine you brought, hurrying quickly to the side of the basin, not even attempting to hide her nudity as she rises to meet you. The younger woman remains were she is, eyes drowsy with drink, following the movements of her companion’s jiggling ass attentively.", parse);
	Text.NL();
	Text.Add("You get a good look at the woman as she pours wine into two large cups, dripping water from her well-shaped body. She looks to be in her early twenties, with auburn hair cascading in pretty curls, framing her beautiful face. You feel a bit sorry for her, having to be holed up with someone like Krawitz. A political marriage, perhaps? She leans down as she hands a cup to her younger companion, curving her back and leaving nothing to your imagination.", parse);
	Text.NL();
	Text.Add("<i>”Marlene, you are indecent!”</i> the daughter exclaims, giggling. She takes a sip of the rich wine and sighs in pleasure. Slightly younger than the wife, she is also quite the beauty, with straight raven hair reaching down her back. Both the women have soft C-cup breasts, crowned by pert nipples.", parse);
	Text.NL();
	Text.Add("<i>”Oh, I’ll show you indecent, Gina,”</i> the older woman purrs, downing a cup of wine in a single draft before pouring herself a new one. Swaying slightly, she glides into the water, curling up next to the black-haired girl. She put an arm around the younger woman, still carefully holding the wine cup in her hand, while her other arm dips beneath the waters, reaching between her companion’s legs.", parse);
	Text.NL();
	Text.Add("<i>”’L-Lene, we have… ah… company,”</i> Gina gasps, noting your presence.", parse);
}

Scenes.Krawitz.OrgyEntrypoint = function() {
	var parse = {
		
	};
	
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}

// TODO
Scenes.Krawitz.Aftermath = function() {
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Krawitz.street;
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}

Scenes.Krawitz.Scouting = function() {
	var parse = {
		
	};
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}
