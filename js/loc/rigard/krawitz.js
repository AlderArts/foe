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
Scenes.Krawitz.GuardDex = function(entity, num) {
	num = num || 1;
	var dex = (entity == Scenes.Krawitz.EncType.Guard) ? 10 : 15;
	return num * dex;
}
Scenes.Krawitz.GuardStr = function(entity, num) {
	num = num || 1;
	var str = (entity == Scenes.Krawitz.EncType.Guard) ? 15 : 10;
	return num * str;
}
Scenes.Krawitz.GuardCha = function(entity, num) {
	num = num || 1;
	var cha = (entity == Scenes.Krawitz.EncType.Guard) ? 8 : 15;
	return num * cha;
}

//
// Mansion
//
world.loc.Rigard.Krawitz.street.description = function() {
	Text.AddOutput("You are in front of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Plaza", true, true,
	function() {
		Text.AddOutput("Go back to plaza?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Plaza, {minute: 10});
	}
));
world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Back street", true, true,
	function() {
		Text.AddOutput("Enter the servants' quarters through the back entrance?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.servants);
	}
));
world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Grounds", true, false,
	function() {
		Text.AddOutput("Enter the main grounds?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds);
	}
));

world.loc.Rigard.Krawitz.street.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}

//
// Servants
//
world.loc.Rigard.Krawitz.servants.description = function() {
	Text.AddOutput("You are in the servants' quarters of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.servants.links.push(new Link(
	"Leave", true, true,
	function() {
		Text.AddOutput("Leave the mansion?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.street);
	}
));
world.loc.Rigard.Krawitz.servants.links.push(new Link(
	"Grounds", true, true,
	function() {
		Text.AddOutput("Enter the main grounds?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds);
	}
));

world.loc.Rigard.Krawitz.servants.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}


//
// Grounds
//
world.loc.Rigard.Krawitz.grounds.description = function() {
	Text.AddOutput("You are in the main grounds of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Leave", true, true,
	function() {
		Text.AddOutput("Leave the mansion?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.street);
	}
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Servants'", true, true,
	function() {
		Text.AddOutput("Go to the servants' quarters?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.servants);
	}
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Mansion", true, true,
	function() {
		Text.AddOutput("Enter the main building?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall);
	}
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Bathhouse", true, true,
	function() {
		Text.AddOutput("Go to the bathhouse?<br/>");
	},
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
	else
		PrintDefaultOptions(true);
}






Scenes.Krawitz.Scouting = function() {
	var parse = {
		
	};
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}

