

world.loc.Rigard.Castle = {
	Grounds   : new Event("Royal grounds"),
	MageTower : new Event("Mage's tower"),
	Court     : new Event("Royal court"),
	Dungeon   : new Event("Dungeons")
}

Scenes.Rigard.Noble = {};


//
// Castle: Grounds
//
world.loc.Rigard.Castle.Grounds.description = function() {
	Text.Add("You are standing inside the walls of the royal grounds, a lush garden dotted with fancy estates.");
	Text.NL();
}

//Random events for royal grounds
world.loc.Rigard.Castle.Grounds.enc = new EncounterTable();
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Chatter2;});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.Parkland;});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.JeannesTower;}, 1.0, function() { return Scenes.Global.MetJeanne(); });
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.TheDistrict;});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.MeetingMajid;}, 1.0, function() { return !Scenes.Global.PortalsOpen() && !(rigard.flags["Nobles"] & Rigard.Nobles.MetMajid); });
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.GuardPatrol;}, 1.0, function() { return !world.time.IsDay(); });
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.AlmsForThePoor;}, 1.0, function() { return !(rigard.flags["Nobles"] & Rigard.Nobles.Alms); });
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.Elodie;}, 1.0, function() {
	return !Scenes.Global.PortalsOpen() &&
		!(rigard.flags["Nobles"] & Rigard.Nobles.Elodie) &&
		Scenes.Global.VisitedOutlaws() &&
		world.time.IsDay() &&
		vaughn.flags["Met"] < Vaughn.Met.OnTaskLockpicks;
});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.RoyalGetaway;});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.MagicalJackal;}, 1.0, function() {
	return asche.flags["Met"] >= Asche.Met.Met &&
		!world.time.IsDay();
});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.PalaceParade;}, 2.0, function() {
	return terry.Recruited() &&
		!world.time.IsDay() &&
		rigard.ParadeTimer.Expired();
});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.Buns;}, 1.0, function() { return world.time.IsDay(); });

world.loc.Rigard.Castle.Grounds.onEntry = function() {
	if(Math.random() < 0.2)
		Scenes.Rigard.Chatter2(true);
	else
		PrintDefaultOptions();
}

world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Plaza", true, true,
	function() {
		Text.Add("There is a small side entrance in the outer wall you can use to leave the royal grounds and return to the city plaza.");
		Text.NL();
	},
	function() {
		MoveToLocation(world.loc.Rigard.Plaza);
	}
));
world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Court", true, false, // TODO
	function() {
		Text.Add("On top of the steep hill in front of you stands the crowning jewel of Rigard, the royal castle. It commands the strongest tactical position for miles around, protected by steep hillside on three sides, and a sheer, impassable cliff facing the river separating the city far below.");
		Text.NL();
	},
	function() {
		MoveToLocation(world.loc.Rigard.Castle.Court);
	}
));
world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Tower", true, true,
	function() {
		Text.Add("Close to one of the walls surrounding the area, an old crumbling obelisk of rock rises, strangely out of place in the neatly organized landscape. An eerie glow emanates from windows in the upper levels of the tower, a flickering light constantly changing colors.");
		Text.NL();
	},
	function() {
		MoveToLocation(world.loc.Rigard.Castle.MageTower);
	}
));
world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Jail", function() { return terry.flags["Saved"] == Terry.Saved.TalkedTwins2; }, true,
	null,
	function() {
		Scenes.Terry.Release();
	}
));


world.loc.Rigard.Castle.Grounds.events.push(new Link(
	"Elodie", function() { return vaughn.flags["Met"] == Vaughn.Met.OnTaskLockpicks; }, true,
	function() {
		if(vaughn.flags["Met"] == Vaughn.Met.OnTaskLockpicks) {
			Text.Add("Somewhere around here, you should look for Elodie, the contact of the outlaws, and hand over the tools you were given. Vaughn said that she has some time off during evenings.");
			Text.NL();
		}
	},
	function() {
		Scenes.Vaughn.Tasks.Lockpicks.MeetingElodie();
	}
));


Scenes.Rigard.Noble.Parkland = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("While wandering through the castle grounds, you spot a small park and decide to take a seat on one of the benches and take a quick break. Pleasantly tranquil, you can’t help but reflect on how the castle grounds are so considerably different from the rest of Rigard - the fact that there’s enough open space for a park is one thing, but for the grass to be carefully trimmed, the flowerbeds well-tended and the small pond pristine is unbelievable considering the hubbub of the city proper, let alone the slums beyond the walls. Truly a world within a world, to use the old saying.", parse);
	Text.NL();
	if(world.time.IsDay()) {
		if(world.time.season == Season.Winter) {
			Text.Add("You take a moment to savor the warm sun that’s come out on this winter day, and let your eyes wander as you relax on the bench. A light covering of snow dusts the ground, most of it having been swept up into a large pile, perfect for children to play in. Despite the cold, though, the pond hasn’t frozen over, and there are more ducks about than ever before - perhaps drawn by the prospect of being fed.", parse);
			Text.NL();
			Text.Add("There aren’t as many people out here today owing to the season, but that’s all the better for you, isn’t it?", parse);
		}
		else {
			Text.Add("Lazing about on the bench as the warm sun beats down upon you, you roll your gaze over the small park. A couple of finely dressed children are having a picnic under their nursemaid’s watchful eye, an elderly woman throws breadcrumbs to a flock of ducks in the pond, and a landscaper works away at the various topiaries with a large pair of shears.", parse);
			Text.NL();
			Text.Add("A warm, calm green space all around, the sort of luxury only the wealthy can afford.", parse);
		}
	}
	else {
		Text.Add("At this time of night, the park is lit by a number of lampposts, light within carefully sculpted crystal casting a faint white illumination on the park grounds. The park’s mostly deserted, save for a young couple on another bench, and judging by the rather shameless noises they’re making, they’re having quite a bit of fun.", parse);
		Text.NL();
		
		var humanity = player.Humanity();
		
		parse["hum"] = humanity < 0.95 ? ", especially with your appearance being what it is" : "";
		Text.Add("With that thought in mind, you stand up and move on before the Royal Guard shows up and makes a fuss. Wouldn’t want to get caught up in the crossfire[hum].", parse);
	}
	Text.Flush();
	
	world.TimeStep({minute: 15});
	
	Gui.NextPrompt();
}

Scenes.Rigard.Noble.JeannesTower = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Your exploration of the castle grounds brings you close to the mage tower, and you find yourself inexplicably drawn to it.", parse);
	Text.NL();
	Text.Add("Passing by the foot of the tower, you look up. It’s as it’s always been - save for the distant sight of Jeanne gazing out of a high window that wasn’t there the last time you looked. The court mage seems lost in thought, ", parse);
	
	var scenes = new EncounterTable();
	//TODO, more possibly
	scenes.AddEnc(function() {
		Text.Add("and doesn’t notice you even as her gaze is drawn to some far-off view that only she can see.", parse);
		Text.NL();
		Text.Add("It might have been interesting to ask Jeanne for her two coins’ worth, but you doubt that your voice is going to carry up to her, and you’re not going to climb all the way up just to ask her for her thoughts - and give away the fact that you’ve been spying on her, of course. Shrugging, you continue on your way through the district, leaving the tower behind you.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("but notices you as you pass by, giving you a small wave of greeting when she notices you gawking up at her. You return the gesture, and she resumes staring off into the distance, lost in whatever thoughts are going through her mind before you came along.", parse);
		Text.NL();
		Text.Add("Seeing as you’re not going to get that much out of the court magician as-is, you decide to head on your way.", parse);
	}, 1.0, function() { return true; });
	scenes.Get();
	
	Text.Flush();
	
	world.TimeStep({minute: 15});
	
	Gui.NextPrompt();
}

Scenes.Rigard.Noble.TheDistrict = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("As you wander more and more of the castle grounds, ambling down broad, clean streets, you can’t help but be struck at just how insulated the entire district is from the rest of Rigard. It’s not just the walls - although those help, of course - but also a complete change of atmosphere and even architecture from the rest of the city. Even the distinction between the slums and what’s inside the walls isn’t that jarring.", parse);
	Text.NL();
	Text.Add("The closer one gets to the Castle, the guard patrols get heavier, the city gets more pristine, and the population gets more aristocratic. The mansions and estates of lords and ladies sparsely dot the lush garden-like environ; old and elaborate houses, almost palaces in their own right. Covered carriages move about the pathways, and there are few merchants except for the most lavish, patronized by lords and ladies out and about at all hours. Food shopping is done by servants among the other districts - here, one is more likely to find rare goods, jewelers, or the most expert of crafters residing on the single street dedicated to shops.", parse);
	Text.NL();
	Text.Add("A world within a world.", parse);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.NL();
		Text.Add("<i>“This is a problem with all ruling classes as time goes on,”</i> Cveta muses as she looks about her. <i>“If not constantly reminded of their roots and the fundamentals of their purpose, they become degenerate, decadent and more concerned with court politics than what is going on in the country they supposedly rule, or what threats may be massing on the border. The ruling class lives in a bubble, insulated from reality. Sooner or later, reality intrudes, and they are ill-equipped to deal with it.”</i>", parse);
		Text.NL();
		Text.Add("Reality like Uru and her pets.", parse);
		Text.NL();
		Text.Add("<i>“It is obvious that Rigard’s upper crust is now at the same level. Incompetent, insulated, squabbling with rival factions, unaware of the termite-eaten foundations upon which their little world stands. Whatever nobility was once borne by Riordane’s blood has long since been watered down to nothing.”</i>", parse);
	}, 1.0, function() { return party.InParty(cveta); });
	scenes.AddEnc(function() {
		parse = terry.ParserPronouns(parse);
		parse["foxvixen"] = terry.mfPronoun("fox", "vixen");
		Text.NL();
		Text.Add("Try as you might, you can’t help but notice Terry’s gaze lingering longer than strictly necessary on some of the shops’ more exquisite displays. Well, in [hisher] old life, getting into the castle grounds would probably have been a massive break for [himher] - old habits die hard, you suppose.", parse);
		Text.NL();
		Text.Add("Gently, you slap the [foxvixen]’s hand, directing [hisher] attention back to the road. You don’t need any trouble right now.", parse);
	}, 1.0, function() { return party.InParty(terry); });
	scenes.AddEnc(function() {
		parse = kiakai.ParserPronouns(parse);
		parse["Kiai"] = kiakai.name;
		Text.NL();
		Text.Add("As you continue down the road, you notice [Kiai] looking troubled, and slow your pace to ask the elf for [hisher] two coins.", parse);
		Text.NL();
		Text.Add("<i>“There is a great sadness amongst these people, [playername],”</i> [Kiai] replies after some thought.", parse);
		Text.NL();
		Text.Add("Oh, really? It seemed like most of the lords and ladies you’ve seen while out on your little walk were satisfied enough.", parse);
		Text.NL();
		Text.Add("<i>“They are empty inside, and seek to give their lives meaning with material goods,”</i> [Kiai] replies solemnly. <i>“Elves possess neither ornate carriages, dedicated monuments or fancy clothes, yet the least of my people are happier than any of these gaudy butterflies.”</i>", parse);
		Text.NL();
		Text.Add("That’s quite damning, coming from [himher].", parse);
		Text.NL();
		Text.Add("[Kiai] looks puzzled. <i>“It is only the truth as I see it, [playername]. Were they not so secure in their comforts, I might have attempted to… no. Hearts hardened by lack of want can only be humbled by circumstance. I shall pray that the people we have seen today might come to know and accept Aria in time to come.”</i>", parse);
	}, 1.0, function() { return party.InParty(kiakai); });
	//TODO more party members
	scenes.Get();
	
	Text.Flush();
	
	world.TimeStep({minute: 15});
	
	Gui.NextPrompt();
}

Scenes.Rigard.Noble.MeetingMajid = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("<i>“Make way! Make way!”</i>", parse);
	Text.NL();
	Text.Add("The shouting draws your attention - such words in the main city or the slums wouldn’t be out of place, but here in the castle grounds? With the urgency and no-nonsense attitude in the words, it seems like a best idea to go along, especially when even the well-dressed folk are hurrying to the side of the street.", parse);
	Text.NL();
	Text.Add("<i>“Make way for Majid, the king’s vizier!”</i>", parse);
	Text.NL();
	Text.Add("That’s your last warning - scarcely have the words reached your ears that half a dozen Royal Guards come thundering by on horseback, dressed up in royal livery. The street might be clear, but if it weren’t, there’s little doubt that any unlucky person caught up in the charge would be trampled underfoot.", parse);
	Text.NL();
	Text.Add("Even as the dust kicked up by the guards begins to settle, a curious sight greets your eyes: a large, ornate sedan chair follows in its wake, held aloft by a quartet of bare-chested morphs. You’re not the only one whose attention has been drawn by the spectacle - everyone around you, young and old, noble and servant, man and woman alike stares at the strange vehicle as it passes them by. Some with fear at the vehicle itself, others with desire at the half-naked carriers, but for a moment all activity comes to a halt as someone who’s clearly an important personage passes them by.", parse);
	Text.NL();
	Text.Add("Deep in your pocket, the gem trembles, and you look up to find the sedan chair barely a yard away from you. Through the window of gauzy paper framed in stiffened reed, you catch sight of a figure within - his clothing is voluminous and face is veiled such that you can’t make out any concrete details, but at the very least he doesn’t seem to be very tall -", parse);
	Text.NL();
	Text.Add("- It’s then that you realize he’s looking directly at you.", parse);
	Text.NL();
	Text.Add("For a moment, you wonder if Majid’s going to step out and confront you, but the sedan-bearers pick up their pace and ferry him away, leaving you wondering. Gradually, the furor kicked up by the vizier’s passing begins to die down a little, some semblance of normalcy returning to the streets, and there’s little left for you but to continue on your way.", parse);
	Text.Flush();
	
	rigard.flags["Nobles"] |= Rigard.Nobles.MetMajid;
	
	world.TimeStep({minute: 15});
	
	Gui.NextPrompt();
}

Scenes.Rigard.Noble.GuardPatrol = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Exploring the castle grounds at night is less exciting than one might have hoped. Unlike Rigard proper, which never truly sleeps, a quiet, hazy blanket has settled on the castle grounds, covering nobility and servants alike in quiet slumber. Tall street lamps placed at regular intervals fill wide avenues with gentle white light, and the high walls and solid gates of the residential compounds only add to the sense of security.", parse);
	Text.NL();
	Text.Add("All this, of course, is enforced by the regular patrols of Royal Guards, all of them clad in gleaming armor as they make their rounds about the district. It’s clear that they’re there for show more than anything else - a lurking criminal would spot them from ridiculously far off - but maybe that’s the point, for the local residents to look out of their windows and be reassured that the guard is doing their job, after a fashion.", parse);
	Text.NL();
	
	var humanity = player.Humanity();
	
	if(humanity < 0.95)
		Text.Add("While you do have a pass, you make sure to avoid the patrols. It’s not a hard task, and it’s more than worth the trouble not to have to answer inconvenient questions about who you might be, where you’re going and what your intentions are.", parse);
	else
		Text.Add("Some of the patrols throw you curious glances as you pass them by, but you act as if you have every right to be here - which you in fact, do - and they let you be on your way without harassing you.", parse);
	Text.NL();
	Text.Add("You’re vaguely reminded of some saying or the other, something about effective policing being the lack of crime rather than guards being seen about doing their job, but you don’t quite remember just how it went… nevertheless, though the Royal Guards are clearly anything but incompetent, it seems like they have a much better life than the overworked city watch.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 15});
	
	Gui.NextPrompt();
}

Scenes.Rigard.Noble.AlmsForThePoor = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("<i>“It’s just a coin, sonny. It won’t be missed, I can tell you as much. You yourself told me doesn’t bother to count them twice.”</i>", parse);
	Text.NL();
	Text.Add("Hmm, interesting. You didn’t think there’d be beggars on the castle grounds - the Royal Guard should have taken care of most of them - but as you draw closer to the source of the voice, you spy an aging man and a much younger one by the wall. The former’s clearly here uninvited, being much more shabbily dressed than the latter, and is holding out his hand in a pleading fashion.", parse);
	Text.NL();
	Text.Add("<i>“I can’t betray the lord’s trust in me, gramps,”</i> the younger man replies. <i>“I’ll have some money for you in a few days’ time when I get paid, but this stuff needs to get back to him whole.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Problem is, your grandma and I need to eat now, not in a few days’ time. You can put the money back later on, and just lie to him if he asks if it’s all there…”</i>", parse);
	Text.NL();
	Text.Add("<i>“Lie to him?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Either that, or your grandma goes hungry…”</i>", parse);
	Text.NL();
	Text.Add("What an interesting dilemma you’ve stumbled onto. Is there something you ought to do about this? There are a few stances you could take here…", parse);
	Text.Flush();
	
	world.TimeStep({minute: 15});
	
	rigard.flags["Nobles"] |= Rigard.Nobles.Alms;
	
	//[Old man][Young man][Leave]
	var options = new Array();
	options.push({ nameStr : "Old man",
		tooltip : "Side with the old man.",
		func : function() {
			Text.Clear();
			Text.Add("Deciding to intervene, you step towards the duo - they freeze and stare at you a moment as you approach, then quickly relax when they realize you aren’t with the Royal Guard. Quickly explaining that you heard everything, you begin chiding the younger man for his reluctance - it’s just a single coin, after all, and it’s not as if he truly intends to steal it if he intends to replace the missing money once he receives his wages. Does he really intend to put his grandfather through that all over a white lie?", parse);
			Text.NL();
			Text.Add("Buckling under your verbal assault, the young man sighs and slumps his shoulders in defeat. <i>“Here, gramps,”</i> he mumbles, drawing out a coin from the bag he’s holding. <i>“Try to make this stretch, okay? I’m sticking out my neck for you - and please, don’t sneak onto the castle grounds any more. There’s no telling what the Royal Guard will do to you if they find you here.”</i>", parse);
			Text.NL();
			Text.Add("With that, he turns tail and slinks away, more than a little guilt hanging around him.", parse);
			Text.NL();
			parse["lad"] = player.mfFem("lad", "lass");
			Text.Add("Turning his gaze to you, the older man rubs his forehead. <i>“Thanks for stepping in, [lad]. My grandson’s not a bad kid, he’s just kinda… eh… inflexible. Thinks in straight lines. You didn’t have to do that, but I appreciate it nevertheless.”</i>", parse);
			Text.NL();
			Text.Add("You nod and point at the wall, suggesting less than a little subtly that he ought to leg it before the Royal Guard wanders over. The man grins, and wasting no time, scrambles over the barrier with surprising alacrity for someone his age - before you know it, he’s gone, leaving you to be on your way, too.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Young man",
		tooltip : "Side with the young man.",
		func : function() {
			Text.Clear();
			Text.Add("Deciding to intervene, you step towards the duo - they freeze and stare at you a moment as you approach, then quickly relax when they realize you aren’t with the Royal Guard. Quickly explaining that you heard everything, you chide the older man for urging his grandson to steal from his lord. Even if the theft wasn’t noticed, one lie tends to lead to another - and if it <i>were</i> noticed, that’d mean his entire livelihood would be at stake. Go hungry for a few days, or go hungry for who knows how long?", parse);
			Text.NL();
			Text.Add("<i>“Still the matter of getting by for the next few days…”</i>", parse);
			Text.Flush();
			
			//[Give][Leave]
			var options = new Array();
			options.push({ nameStr : "Give",
				tooltip : "Give the old man one of your own coins.",
				func : function() {
					Text.Clear();
					Text.Add("Digging into your own pockets, you draw out a coin and press it into the older man’s hand. There, a coin of your own in lieu of one dishonestly gained. Is he happy now?", parse);
					Text.NL();
					Text.Add("<i>“Shouldn’t be accepting charity from a stranger…”</i>", parse);
					Text.NL();
					Text.Add("Too proud to accept charity from a stranger, but not enough to ask his grandson to filch money? Maybe he should rethink his priorities. With that, you turn and walk away, not even bothering to look back at the duo.", parse);
					Text.Flush();
					
					party.coin -= 1;
					
					Gui.NextPrompt();
				}, enabled : party.coin >= 1
			});
			options.push({ nameStr : "Leave",
				tooltip : "Just walk away. He’s not deserving of so much as a coin.",
				func : function() {
					Text.Clear();
					Text.Add("Well then, that’s his problem to solve, isn’t it? What with such short-sightedness in jeopardizing his grandson’s livelihood and his future source of income, maybe that’s something to think about.", parse);
					Text.NL();
					Text.Add("With that said, you turn and storm off, leaving the two to get things sorted out on their own - or be thrown out of the castle grounds by the Royal Guard, whichever comes first.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true
	});
	options.push({ nameStr : "Leave",
		tooltip : "Just walk away, this is none of your business.",
		func : function() {
			Text.Clear();
			Text.Add("Shrugging, you turn and walk away, leaving the old man and his grandson to sort matters out on their own - well, it’s that, or all the noise they’re making is going to draw the guard and have the former thrown out of the castle grounds.", parse);
			Text.NL();
			Text.Add("Either way, it’s none of your business - you have bigger fish to fry, and there seems to be no good solution to that particular petty business, so you won’t stick your nose in where it doesn’t belong.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Rigard.Noble.Elodie = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Walking through the streets of the castle grounds, you’re suddenly aware of a tingling on the nape of your neck, and instinctively turn around. Present about you are a few nobles and their servants out for a stroll, a detachment of Royal Guards on patrol, and a single young woman dressed in royal colors - it’s the latter who is staring at you unabashedly with hard, narrowed eyes, as if inviting you to return the favor.", parse);
	Text.NL();
	Text.Add("Well, you’re not about to decline the challenge, so you yourself get a good look at her in turn. Perhaps about nineteen, give or take a year or so, the young woman’s outfit is indicative of some sort of servant - a long-sleeved blouse clothes her ample chest, while an apron and long skirts complete the ensemble. Fine gloves of simple white linen adorn her arms, and pinned to her breast is a silvered brooch with the royal insignia on it.", parse);
	Text.NL();
	Text.Add("Her rich brown hair looks like it would be normally long, but she’s done it up neatly and hidden it under a headdress of sorts. Neat and clean, but deliberately muted, probably so as to not outshine others nearby; if she weren’t staring at you, you’re not sure you might have given her so much as a second glance.", parse);
	Text.NL();
	Text.Add("All in all, you guess that she might be some noble’s personal servant, made to wait on him or her hand and foot. Royal colors probably means she’s one of the castle’s staff… too bad that you’re not sure if you can get inside in the foreseeable future. You may have access to the grounds, but the castle itself is another problem.", parse);
	Text.NL();
	Text.Add("The way she’s staring at you unblinkingly, holding your gaze like that… do you confront her?", parse);
	Text.Flush();
	
	rigard.flags["Nobles"] |= Rigard.Nobles.Elodie;
	
	//[Confront][Leave]
	var options = new Array();
	options.push({ nameStr : "Confront",
		tooltip : "It’s impolite to stare, you know.",
		func : function() {
			Text.Clear();
			Text.Add("Making up your mind to confront the strange servant, you start off towards her, determined to at least find out why you’re such an interesting person. Before you can reach her, though, she disappears almost as if by magic - it happens so suddenly that you do a double-take, but there’s no doubt about it: she’s gone.", parse);
			Text.NL();
			Text.Add("You can only conclude that she must’ve slipped away in one of the nobles’ entourages of servants, but the way she so effortlessly inserted herself into the crowd makes you wonder.", parse);
			PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Leave",
		tooltip : "Just slip away, the last thing you need is a ruckus on the palace grounds.",
		func : function() {
			Text.Clear();
			
			var humanity = player.Humanity();
			
			Text.Add("Deciding that the last thing you need to do is kick up a fuss, ", parse);
			if(humanity < 0.95)
				Text.Add("especially with you looking as you are, ", parse);
			Text.Add("you break the gaze and go your own merry way down the street. While you still feel the royal servant’s gaze on the small of your back for a little while longer, it eventually fades, and when you next look back, she’s no longer there. Odd.", parse);
			PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("Still, there’s nothing else you can do about the strange incident for now, so you might as well not let it get to you too much. Shrugging, you move along on your way.", parse);
		Text.Flush();
		
		world.TimeStep({minute: 15});
		
		Gui.NextPrompt();
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Rigard.Noble.RoyalGetaway = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Taking a stroll near the wall that separates the castle grounds from the rest of Rigard, you catch sight of a pair of familiar gray-hooded cloaks pass you by, clearly on their way from the castle to the gates. You nod at the royal twins, and they dip their heads at you in unison - now that you know who they are, a lot of their mystery is gone.", parse);
	Text.NL();
	Text.Add("Maybe they shouldn’t be skipping their lessons to go out into the city, but who’s going to stop them - and besides, if their teachers are willing to stoop so low as to let the future of the kingdom skive just for the sake for a few coins, they can’t be very good teachers, can they?", parse);
	Text.Flush();
	
	world.TimeStep({minute: 5});
	
	Gui.NextPrompt();
}

Scenes.Rigard.Noble.MagicalJackal = function() {
	var parse = {
		heshe : player.mfFem("he", "she")
	};
	
	Text.Clear();
	Text.Add("Passing through an avenue lined with shrubs and plenty of greenery, you spy a figure coming down the street towards you. Nothing out of the ordinary in and of itself, even at this out, but wait… is that Asche? Why yes, it <i>is</i> her, the jackaless coming down the street towards you at an appreciable pace. Dressed as always in her white sari and copious amounts of golden jewelry, she’s particularly noticeable in the soft light cast from the streetlamps.", parse);
	Text.NL();
	Text.Add("<i>“Ah, it is good customer,”</i> she says, recognizing you. <i>“Being looking surprised to be seeing Asche in fancy place after dark, is [heshe] not?”</i>", parse);
	Text.NL();
	Text.Add("Well yes, what with her being a morph and everything, and these being the castle grounds…", parse);
	Text.NL();
	Text.Add("<i>“Oh, Asche does not go anywhere she is not invited,”</i> the jackaless replies with a flutter of her eyes. <i>“She was asked to be doing consulting services for nobles. Is all very hush-hush, since those not fully human are not being very welcome in this part of town.”</i>", parse);
	Text.NL();
	Text.Add("Services? If she doesn’t mind you asking, what kind of services require her door-to-door attention?", parse);
	Text.NL();
	Text.Add("<i>“Oh, is not being much. Some are wanting fortunes told for making entertainment, some are liking novelty of this jackaless and her dress in their party, one lady is thinking she is too fat while another is quite desperate to be pregnant, and Asche is always bringing small inventory of charms for sale, yes yes. Asche can be keeping secrets, unlike some other people, and even if she is choosing to speak, who will be believing jackaless like her?”</i>", parse);
	Text.NL();
	Text.Add("Ah, you see. Well, she ought to stay safe on the way back to her shop.", parse);
	Text.NL();
	Text.Add("<i>“Is not really being big problem, ruffians know to leave Asche alone. If this jackaless may be honest, customer is in more danger than she is, so not to be worrying.”</i>", parse);
	Text.NL();
	Text.Add("Well, if she’s sure, then. Asche gives you a small smile, then swooshes past you and is on her way, sauntering down the broad path like she owns the entirety of the castle district. Ah, to be so carefree…", parse);
	Text.Flush();
	
	world.TimeStep({minute: 15});
	
	Gui.NextPrompt();
}

Scenes.Rigard.Noble.PalaceParade = function() {
	var parse = {
		
	};
	
	var first = !(rigard.flags["Nobles"] & Rigard.Nobles.Parade);
	rigard.flags["Nobles"] |= Rigard.Nobles.Parade;
	
	Text.Clear();
	if(first) {
		Text.Add("Drawing closer to the castle than your usual forays about the grounds, you notice a small crowd of curious onlookers gathered in a small plaza. The commotion only grows greater as you close the distance, joining the impromptu audience of commoner and noblemen alike, only to find about two hundred of the Royal Guard assembled in a neat rectangular formation on the plaza.", parse);
		Text.NL();
		Text.Add("That’s not all, though. A small marching band sits off to one side, drums, brass and all, and they play a suitably martial tune as the Royal Guards parade in front of the castle district’s population. You have to admit, it all <i>looks</i> very impressive; the audience is clearly in agreement with you as the guards march in lockstep to the drumming. And why not? They’re clearly dressed to impress; the arms and armor each guard bears is more ceremonial than anything else. For goodness’ sake, gold frogging, engraved breastplates, and plenty of swirly grooves on dulled blades -", parse);
		Text.NL();
		Text.Add("- There is, after all, that age-old axiom of dressing up a pig in a suit. At the end of the day, while one might be able to make the pig look presentable, it’s still a pig.", parse);
		Text.NL();
		Text.Add("At the head of it all is Preston, looking every bit just like the day he burst into the warehouse and stole victory from under your and Miranda’s noses. Well, perhaps even more pretentious, considering the gilded, plumed helmet he’s wearing; mounted on a chestnut thoroughbred, the commander of the Royal Guard prances in front of both his men and the gathered audience like… like… well, there isn’t a good word that would describe him. He’s far too serious to be a clown, at any rate.", parse);
		Text.NL();
		if(party.InParty(miranda)) {
			Text.Add("<i>“Pompous little shit,”</i> Miranda mutters, though not so loudly that someone besides you might hear her over the music. <i>“Please, you dumb beast, if you have any sense in you, throw that fat sack of potatoes off your back and run for the hills.”</i>", parse);
			Text.NL();
		}
		Text.Add("Up and down, back and forth, all to the time of the music blaring out into the open air and to the intermittent applause of the audience. If the guard wanted everyone in the castle grounds to know they were there, then they couldn’t have done a better job.", parse);
		Text.NL();
		Text.Add("It doesn’t look like Preston’s little parade will be ending anytime soon - judging by the smile on his face, he’s clearly enjoying all the attention, perhaps a little too much. Neither are you about to stand here all day - unlike some of those around you, you actually have better things to do with your time than to watch this pompous display. Excusing yourself, you slip your way back through the crowd and leave the way you came.", parse);
	}
	else {
		Text.Add("Passing by the plaza in front of the castle gates, you’re treated to another of Preston’s little parades. The music and crowd begin long before you even catch sight of the Royal Guards themselves, and you can already guess what Preston’s lined up for the locals: more marching, more meaningless footdrills, more prancing around on his horse. While the man might be high on the pomp and glamor, he’s definitely a little short on imagination.", parse);
		Text.NL();
		if(party.InParty(miranda)) {
			Text.Add("<i>“Still at it, eh?”</i> Miranda mumbles from behind you. <i>“Man never gets tired of preening. Wonder if he does more parading than guarding.”</i>", parse);
			Text.NL();
		}
		Text.Add("Well, there <i>is</i> one upside to this: if Preston and his men are here, then he isn’t out there making life difficult for someone else. By all means, let them continue; there’s absolutely no need to rain on their parade. Smiling at that thought, you quickly turn and leave the scene, leaving those who’re inclined to do so gawk at the scene.", parse);
	}
	Text.Flush();
	
	rigard.ParadeTimer = new Time(0,0,4,0,0);
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

Scenes.Rigard.Noble.Buns = function() {
	var parse = {
		
	};
	
	var first = !(rigard.flags["Nobles"] & Rigard.Nobles.Buns);
	rigard.flags["Nobles"] |= Rigard.Nobles.Buns;
	
	Text.Clear();
	if(first) {
		Text.Add("Walking through one of the many small parks that dot the castle grounds, you’re suddenly beset by the warm, tantalizing smell of cooking. Turning towards the source of the smell, you quickly discover a small wooden cart by the side of the pathway, a charcoal stove with a hot plate sitting at its side. The proprietor - a young, spindly man - is busy cooking up a storm on the sizzling plate, and hardly notices you as you draw near. It’s only when you clear your throat that he looks up, spatula still in hand.", parse);
		Text.NL();
		Text.Add("It’s clear that he’s no resident of the castle district - despite an obvious attempt to dress up under the apron, there’s no way this young man can afford either the attire of the nobility or the livery of their servants. Still, at least his clothes are clean and ironed, even if they’re simple, and that’s more than can be said for most of Rigard’s populace.", parse);
		Text.NL();
		Text.Add("<i>“Yes?”</i>", parse);
		Text.NL();
		Text.Add("You look between the cart and him a few moments, trying to decide how to get across your point.", parse);
		Text.NL();
		Text.Add("<i>“Don’t eyeball me like that,”</i> he says. <i>“I’ve got a special dispensation to do business here, so long as I don’t wander too far from the park. Hobnobs like them so much that they want me close, so they can have them hot off the plate.”</i>", parse);
		Text.NL();
		Text.Add("Them?", parse);
		Text.NL();
		Text.Add("<i>“Meat-patties-between-two-buns.”</i> As if for emphasis, he drizzles a little fragrant oil onto the hot plate, and a heavenly aroma wafts upwards to you. <i>“It’s not the best name for them, but I’ve yet to come up with a better one. You’ve come at a good time, there’s no queue. Mostly they come out at dawn and dusk. Huge lines then.”</i>", parse);
		Text.NL();
		Text.Add("Oh? Not to be skeptical, but are the patties-between-two-buns, as he calls them, <i>that</i> good? Even for the degenerates that call themselves Rigard’s upper crust to bend and actually wait in line for them?", parse);
		Text.NL();
		Text.Add("He shrugs his eyebrows. <i>“Why don’t you buy one for yourself and try it?”</i>", parse);
		Text.NL();
		Text.Add("Why, is that a challenge?", parse);
		Text.NL();
		Text.Add("<i>“Could be.”</i>", parse);
		Text.NL();
		Text.Add("Talkative one, isn’t he? Yet, you have to admit, what he’s hawking is certainly setting your mouth to watering.", parse);
	}
	else {
		Text.Add("Passing through the castle grounds today, you happen to chance upon the meat-patty-in-a-bun vendor plying his trade by an empty strip of parkland. Judging by the number of finely dressed folk blissfully munching away on his cylinder-shaped wares, as well as the fresh aroma of hot oil and meat juices that rises from his hot plate, it seems that he’s just finished cooking up yet another storm.", parse);
		Text.NL();
		Text.Add("Spotting you, he tips his beret at you and scrapes a bit of burst gristle off the hot plate, expertly flicking it into a bin by his side. <i>“Hey, it’s you again. Feeling like a meat-patty-between-two-buns? I just finished cooking up a batch, but can fire up the plate if you want.”</i> The young vendor waggles a hand at the rest of his customers as they - or more likely, their servants -  drop by to return the plates. <i>“You don’t want to miss out on what they’re enjoying, do you? Twenty coins, and that meat-patty-between-two-buns is all yours.”</i>", parse);
	}
	Text.Flush();
	
	world.TimeStep({minute: 15});
	
	Scenes.Rigard.Noble.BunsChoice();
}

Scenes.Rigard.Noble.BunsChoice = function() {
	var parse = {
		
	};
	parse = Text.ParserPlural(parse, party.Num() > 1);
	parse["comp"] = party.Num() == 2 ? party.Get(1).name :
	                "your companions";
	
	var first = !(rigard.flags["Nobles"] & Rigard.Nobles.BoughtBuns);
	
	var options = new Array();
	if(first) {
		options.push({ nameStr : "Buy",
			tooltip : "Sure, you’ll have one of… whatever he’s selling.",
			func : function() {
				Text.Clear();
				
				rigard.flags["Nobles"] |= Rigard.Nobles.BoughtBuns;
				
				Text.Add("Why not? If it tastes as good as it smells, you’re not going to be regretting this purchase. Shelling over the coins, you step back and relax as the young man gets to work, bringing out a meat patty from a sealed basket and setting it on the hot plate. There’s a very satisfying hiss, followed by a cloud of fragrant steam, and you have to admit, there’s quite a bit of flair in his way of doing things. A pinch of what could be lard or butter, some sliced tomatoes and onions, a bit of sauce… layer by layer, he piles on the ingredients in one glorious heap.", parse);
				Text.NL();
				Text.Add("At the end of it all, he’s produced his signature patty-between-two-buns, one for you ", parse);
				if(party.Num() > 1) {
					Text.Add("and one ", parse);
					if(party.Num() > 2)
						Text.Add("each ", parse);
					Text.Add("for [comp]", parse);
				}
				Text.Add(". Everything’s been piled in layers like a sandwich, only it doesn’t quite <i>look</i> like a sandwich, vaguely cylindrical with sauce oozing down the edges and vegetables practically spilling out from between the buns.", parse);
				Text.NL();
				Text.Add("<i>“A meat-patty-between-two-buns,”</i> the young cook declares, shoveling [itThem] onto[a] plate[s] for your perusal. <i>“Eat up while [itsTheyre] still hot.”</i>", parse);
				Text.NL();
				Text.Add("Well, nothing for it now. You grab hold of the bun in both hands and bite down, and an explosion of flavor meets your tongue. It’s quite indescribable - crisp onion and meat juices pouring out as your teeth sink in, and… and…", parse);
				Text.NL();
				Text.Add("It’s just good. One might have expected street food to taste bad, or even worse, taste of nothing at all, but this is a pleasant surprise.", parse);
				Text.NL();
				Text.Add("<i>“Quite a mouthful, isn’t it?”</i>", parse);
				Text.NL();
				Text.Add("Which does he mean, the name or the snack? Well, does it matter? Both are pretty mouth-filling. You can definitely see how it’s so favored amongst the nobility.", parse);
				Text.NL();
				Text.Add("<i>“I do try different flavors from time to time. Mushrooms, a bit of fish oil, that sort of thing, but I’ve always got the ingredients for whipping up the basic recipe on hand.”</i>", parse);
				Text.NL();
				Text.Add("Interesting. You finish the rest of the treat in a few bites, then lick your fingers in satisfaction. With something this good, why doesn’t he open a restaurant or something? He could make a killing!", parse);
				Text.NL();
				Text.Add("The young man shrugs. <i>“Could do, I suppose, but I rather like this setup. I make enough to get by, I’m a local star amongst the nobs, and I like having plenty of greenery and fresh air about me while I’m cooking. Can’t get that in a stuffy kitchen, plus I get to go where I want and set up shop somewhere different every day.”</i>", parse);
				Text.NL();
				Text.Add("Well, you can see his point. Setting the plate back down on the cart, you wipe your mouth and thank him for the treat. Of course, he should get a proper name for his creation sometime…", parse);
				Text.NL();
				Text.Add("<i>“Oh, I don’t know. Since people are already calling it that, I’m finding myself warming up to the name of late. Well, maybe I’ll see you around soon, come back when you want another delicious bite.”</i>", parse);
				Text.NL();
				Text.Add("One last thing, though… did you get his name?", parse);
				Text.NL();
				Text.Add("<i>“It doesn’t matter,”</i> the young man replies with a smile as he sets out another couple of patties to cook. <i>“I don’t know the names of any of the nobs who buy my meat-patties-between-two-buns, and it doesn’t change things one jot. Faces and people are what matters to me.”</i> With that, he waves you off and turns back to his cooking, face furrowed in concentration.", parse);
				Text.Flush();
				party.coin -= 20;
				
				world.TimeStep({minute: 15});
				
				Gui.NextPrompt();
			}, enabled : party.coin >= 20
		});
		options.push({ nameStr : "No",
			tooltip : "It might smell delicious, but you think you’ll pass this time.",
			func : function() {
				Text.Clear();
				Text.Add("The young man shrugs at your reply, flipping the meat patties with his spatula to brown them evenly. <i>“Suit yourself. If you change your mind, I’m in the castle district most days, although I can’t guarantee I won’t be sold out by the time you get here. These things move really quickly.”</i>", parse);
				Text.NL();
				Text.Add("Well, no matter how delicious they might be, those so-called meat-patties-between-two-buns are still just food, no matter how one looks at it. It’s not <i>that</i> much of a loss even if you never manage to sample one, you tell yourself as you walk away.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
	}
	else {
		options.push({ nameStr : "Yes",
			tooltip : "Sure, you’ve got nothing better to do with your money.",
			func : function() {
				Text.Clear();
				Text.Add("Sure! If you’re going to burn your money, you might as well do so spending it on overpriced food that’s touted as being wonderfully scrumptious! It’s even better than wasting it at a fancy restaurant - because, let’s face it, doing so means that you probably won’t even be guaranteed that the food will taste good, just be called by some funny name.", parse);
				Text.NL();
				Text.Add("You fork over the coins, and a smile creeps across your face as the glorious aroma of cooking meat rises up to you, the young fellow stoking the charcoal fire under the plate until the oil is spitting and sizzling.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("So… what exactly is it about his meat-patties-between-two-buns that make them so wonderfully tasty, anyway?", parse);
					Text.NL();
					Text.Add("<i>“Would you believe me if I said it was a collection of seven herbs and spices?”</i>", parse);
					Text.NL();
					Text.Add("Actually, that’s quite plausible. Is it?", parse);
					Text.NL();
					Text.Add("<i>“Well, it isn’t, and I’m not about to go and threaten my own business by telling other folks as much,”</i> he replies with a grin. <i>“I know I ought to pass it on eventually, but I’ve still got a lot of time, you know?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“I’m trying something new today,”</i> he tells you as he puts on several different sauces onto the onions. <i>“Tasted it myself, but I’ve only got one tongue on me, you know?”</i>", parse);
					Text.NL();
					Text.Add("Mm-hm. Well, it smells delicious as always.", parse);
					Text.NL();
					Text.Add("<i>“We’ll find out in a moment, shall we? To be honest, I was rather hoping that you’d show up today. Don’t dare tweak things too much when I’m serving the nobs, but hey, if things taste funny with you… at least you don’t have to keep up appearances, you know what I mean?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("So, does he get antsy about all the nobility?", parse);
					Text.NL();
					Text.Add("The young fellow shrugs. <i>“Eh, I’m just a filthy commoner, even if I’m allowed into the castle grounds. They don’t expect that much from me, you know? Just like one of their servants, everyone knows that the lower classes sleep around every chance they get. Well, so do the nobs, but at least they try to be a little more discreet about it.”</i>", parse);
					Text.NL();
					Text.Add("That’s an interesting tangent…", parse);
					Text.NL();
					Text.Add("<i>“You hear things, you know, serving them and all. Folk like to chat while they eat. I mean, just go to the Shadow Lady at a certain time of day at certain rooms, and I’ll wager you’ll find at least a third of the king’s court humping away like rabbits.</i>", parse);
					Text.NL();
					Text.Add("<i>“So, no. When you think about it, they’re just people like you or me.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.Get();
				
				Text.NL();
				parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
				Text.Add("At length, your food is done, and served up to you[c] on[a] small plate[s]. Wasting no time in getting down to work, it’s not long before you’ve reduced the meat-patties-between-two-buns into crumbs and grease.", parse);
				Text.NL();
				Text.Add("<i>“Tasted good?”</i>", parse);
				Text.NL();
				Text.Add("As always.", parse);
				Text.NL();
				Text.Add("<i>“Glad you enjoyed it, then. I know how absolutely horrible street food can be - grew up eating it, myself - so I’m actually trying to put in effort here.”</i>", parse);
				Text.NL();
				Text.Add("Well, it seems to be working, you remark dryly as you wave a hand at his surroundings. He’s certainly moving up in the world.", parse);
				Text.NL();
				Text.Add("<i>“Not sure I can get any higher than where I am already, but the thought’s appreciated. Come back anytime you want a bite to eat, won’t you?”</i>", parse);
				Text.Flush();
				party.coin -= 20;
				
				world.TimeStep({minute: 15});
				
				Gui.NextPrompt();
			}, enabled : party.coin >= 20
		});
		options.push({ nameStr : "No",
			tooltip : "Hmm, maybe not today.",
			func : function() {
				Text.Clear();
				Text.Add("Nah. While the smell <i>is</i> appetizing, you’re not that hungry yet. You’ll pass for now.", parse);
				Text.NL();
				Text.Add("<i>“Mm-hm,”</i> comes the reply. <i>“You know, I’ve tried selling a number of things in the last few years, but it’s always come back to the meat-patties-between-two-buns for me. I’m sure that you’ll come back, too.”</i>", parse);
				Text.NL();
				Text.Add("Maybe you will. The young fellow turns to frying up a batch of onions, and you head off on your way.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
	}
	
	Gui.SetButtonsFromList(options, false, null);
}



