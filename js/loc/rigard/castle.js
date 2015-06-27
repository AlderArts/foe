

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

world.loc.Rigard.Castle.Grounds.enc = new EncounterTable();
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Chatter2;});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.Parkland;});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.JeannesTower;}, 1.0, function() { return Scenes.Global.MetJeanne(); });
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.TheDistrict;});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.MeetingMajid;}, 1.0, function() { return !Scenes.Global.PortalsOpen() && !(rigard.flags["Nobles"] & Rigard.Nobles.MetMajid); });
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.GuardPatrol;}, 1.0, function() { return !world.time.IsDay(); });
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.AlmsForThePoor;}, 1.0, function() { return !(rigard.flags["Nobles"] & Rigard.Nobles.Alms); });
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.Elodie;}, 1.0, function() { return !Scenes.Global.PortalsOpen() && !(rigard.flags["Nobles"] & Rigard.Nobles.Elodie) && Scenes.Global.VisitedOutlaws() && world.time.IsDay(); });
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.RoyalGetaway;});
world.loc.Rigard.Castle.Grounds.enc.AddEnc(function() { return Scenes.Rigard.Noble.MagicalJackal;}, 1.0, function() { return asche.flags["Met"] >= Asche.Met.Met && !world.time.IsDay(); });


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
world.loc.Rigard.Castle.Grounds.endDescription = function() {
	Text.Flush();
}

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
		
		var racescore = new RaceScore(player.body);
		var humanScore = new RaceScore();
		humanScore.score[Race.human] = 1;
		var humanity = racescore.Compare(humanScore);
		
		parse["hum"] = humanity < 0.95 ? ", especially with your appearance being what it is" : "";
		Text.Add("With that thought in mind, you stand up and move on before the royal guard shows up and makes a fuss. Wouldn’t want to get caught up in the crossfire[hum].", parse);
	}
	Text.Flush();
	
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
	Text.Add("That’s your last warning - scarcely have the words reached your ears that half a dozen royal guards come thundering by on horseback, dressed up in royal livery. The street might be clear, but if it weren’t, there’s little doubt that any unlucky person caught up in the charge would be trampled underfoot.", parse);
	Text.NL();
	Text.Add("Even as the dust kicked up by the guards begins to settle, a curious sight greets your eyes: a large, ornate sedan chair follows in its wake, held aloft by a quartet of bare-chested morphs. You’re not the only one whose attention has been drawn by the spectacle - everyone around you, young and old, noble and servant, man and woman alike stares at the strange vehicle as it passes them by. Some with fear at the vehicle itself, others with desire at the half-naked carriers, but for a moment all activity comes to a halt as someone who’s clearly an important personage passes them by.", parse);
	Text.NL();
	Text.Add("Deep in your pocket, the gem trembles, and you look up to find the sedan chair barely a meter away from you. Through the window of gauzy paper framed in stiffened reed, you catch sight of a figure within - his clothing is voluminous and face is veiled such that you can’t make out any concrete details, but at the very least he doesn’t seem to be very tall -", parse);
	Text.NL();
	Text.Add("- It’s then that you realize he’s looking directly at you.", parse);
	Text.NL();
	Text.Add("For a moment, you wonder if Majid’s going to step out and confront you, but the sedan-bearers pick up their pace and ferry him away, leaving you wondering. Gradually, the furor kicked up by the vizier’s passing begins to die down a little, some semblance of normalcy returning to the streets, and there’s little left for you but to continue on your way.", parse);
	Text.Flush();
	
	rigard.flags["Nobles"] |= Rigard.Nobles.MetMajid;
	
	Gui.NextPrompt();
}

Scenes.Rigard.Noble.GuardPatrol = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Exploring the castle grounds at night is less exciting than one might have hoped. Unlike Rigard proper, which never truly sleeps, a quiet, hazy blanket has settled on the castle grounds, covering nobility and servants alike in quiet slumber. Tall street lamps placed at regular intervals fill wide avenues with gentle white light, and the high walls and solid gates of the residential compounds only add to the sense of security.", parse);
	Text.NL();
	Text.Add("All this, of course, is enforced by the regular patrols of royal guards, all of them clad in gleaming armor as they make their rounds about the district. It’s clear that they’re there for show more than anything else - a lurking criminal would spot them from ridiculously far off - but maybe that’s the point, for the local residents to look out of their windows and be reassured that the guard is doing their job, after a fashion.", parse);
	Text.NL();
	
	var racescore = new RaceScore(player.body);
	var humanScore = new RaceScore();
	humanScore.score[Race.human] = 1;
	var humanity = racescore.Compare(humanScore);
	
	if(humanity < 0.95)
		Text.Add("While you do have a pass, you make sure to avoid the patrols. It’s not a hard task, and it’s more than worth the trouble not to have to answer inconvenient questions about who you might be, where you’re going and what your intentions are.", parse);
	else
		Text.Add("Some of the patrols throw you curious glances as you pass them by, but you act as if you have every right to be here - which you in fact, do - and they let you be on your way without harassing you.", parse);
	Text.NL();
	Text.Add("You’re vaguely reminded of some saying or the other, something about effective policing being the lack of crime rather than guards being seen about doing their job, but you don’t quite remember just how it went… nevertheless, though the royal guards are clearly anything but incompetent, it seems like they have a much better life than the overworked city watch.", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}

Scenes.Rigard.Noble.AlmsForThePoor = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("<i>“It’s just a coin, sonny. It won’t be missed, I can tell you as much. You yourself told me doesn’t bother to count them twice.”</i>", parse);
	Text.NL();
	Text.Add("Hmm, interesting. You didn’t think there’d be beggars on the castle grounds - the royal guard should have taken care of most of them - but as you draw closer to the source of the voice, you spy an aging man and a much younger one by the wall. The former’s clearly here uninvited, being much more shabbily dressed than the latter, and is holding out his hand in a pleading fashion.", parse);
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
	
	rigard.flags["Nobles"] |= Rigard.Nobles.Alms;
	
	//[Old man][Young man][Leave]
	var options = new Array();
	options.push({ nameStr : "Old man",
		tooltip : "Side with the old man.",
		func : function() {
			Text.Clear();
			Text.Add("Deciding to intervene, you step towards the duo - they freeze and stare at you a moment as you approach, then quickly relax when they realize you aren’t with the royal guard. Quickly explaining that you heard everything, you begin chiding the younger man for his reluctance - it’s just a single coin, after all, and it’s not as if he truly intends to steal it if he intends to replace the missing money once he receives his wages. Does he really intend to put his grandfather through that all over a white lie?", parse);
			Text.NL();
			Text.Add("Buckling under your verbal assault, the young man sighs and slumps his shoulders in defeat. <i>“Here, gramps,”</i> he mumbles, drawing out a coin from the bag he’s holding. <i>“Try to make this stretch, okay? I’m sticking out my neck for you - and please, don’t sneak onto the castle grounds any more. There’s no telling what the royal guard will do to you if they find you here.”</i>", parse);
			Text.NL();
			Text.Add("With that, he turns tail and slinks away, more than a little guilt hanging around him.", parse);
			Text.NL();
			parse["lad"] = player.mfFem("lad", "lass");
			Text.Add("Turning his gaze to you, the older man rubs his forehead. <i>“Thanks for stepping in, [lad]. My grandson’s not a bad kid, he’s just kinda… eh… inflexible. Thinks in straight lines. You didn’t have to do that, but I appreciate it nevertheless.”</i>", parse);
			Text.NL();
			Text.Add("You nod and point at the wall, suggesting less than a little subtly that he ought to leg it before the royal guard wanders over. The man grins, and wasting no time, scrambles over the barrier with surprising alacrity for someone his age - before you know it, he’s gone, leaving you to be on your way, too.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Young man",
		tooltip : "Side with the young man.",
		func : function() {
			Text.Clear();
			Text.Add("Deciding to intervene, you step towards the duo - they freeze and stare at you a moment as you approach, then quickly relax when they realize you aren’t with the royal guard. Quickly explaining that you heard everything, you chide the older man for urging his grandson to steal from his lord. Even if the theft wasn’t noticed, one lie tends to lead to another - and if it <i>were</i> noticed, that’d mean his entire livelihood would be at stake. Go hungry for a few days, or go hungry for who knows how long?", parse);
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
					Text.Add("With that said, you turn and storm off, leaving the two to get things sorted out on their own - or be thrown out of the castle grounds by the royal guard, whichever comes first.", parse);
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
	Text.Add("Walking through the streets of the castle grounds, you’re suddenly aware of a tingling on the nape of your neck, and instinctively turn around. Present about you are a few nobles and their servants out for a stroll, a detachment of royal guards on patrol, and a single young woman dressed in royal colors - it’s the latter who is staring at you unabashedly with hard, narrowed eyes, as if inviting you to return the favor.", parse);
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
			var racescore = new RaceScore(player.body);
			var humanScore = new RaceScore();
			humanScore.score[Race.human] = 1;
			var humanity = racescore.Compare(humanScore);
			
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
	
	Gui.NextPrompt();
}
