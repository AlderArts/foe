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
	Scenes.Krawitz.stat.ServantFood       = false;
	Scenes.Krawitz.stat.KrawitzFood       = false;
	Scenes.Krawitz.stat.ChestLocKnown     = false;
	Scenes.Krawitz.stat.TFItem            = false;
	Scenes.Krawitz.stat.TFdKrawitz        = false;
	Scenes.Krawitz.stat.SexedGirls        = false;
	Scenes.Krawitz.stat.OrgySetup         = false;
	Scenes.Krawitz.stat.Orgy              = false;
	Scenes.Krawitz.stat.HasSword          = false;
	Scenes.Krawitz.stat.HasBinder         = false;
	
	Scenes.Krawitz.stat.Suspicion         = 0;
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
				Scenes.Krawitz.GuardLost();
			else
				Scenes.Krawitz.ServantLost();
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
				Scenes.Krawitz.GuardConvinced();
			else
				Scenes.Krawitz.ServantConvinced();
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
Scenes.Krawitz.AddSuspicion = function(num) {
	Scenes.Krawitz.stat.Suspicion += num;
	
	if(DEBUG) {
		Text.NL();
		Text.Add("<b>Suspicion + " + num + ": " + Scenes.Krawitz.stat.Suspicion + "/100</b>");
		Text.Flush();
	}
	
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

Scenes.Krawitz.Scouting = function() {
	var parse = {
		
	};
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}

