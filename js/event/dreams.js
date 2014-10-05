
Scenes.Dreams = {}

Scenes.Dreams.Entry = function(func) {
	if(Math.random() < 0.5) {
		var ravenTrigger = false;
		if(ravenmother.flags["RBlock"] == 0)
			ravenTrigger = ravenmother.RavenTrigger();
		
		var dream = function() {
			var scenes = new EncounterTable();
			scenes.AddEnc(Scenes.Dreams.Ocean, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.Forest, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.Harem, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.BackHome, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.Heartstone, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.CoC, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.EndlessClassroom, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.PredatorPack, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.FirePet, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.House, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.Hermit, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.Alchemy, 1.0, function() { return player.alchemyLevel >= 1; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.UruChoice, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.UruRun, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.AriaTemple, 1.0, function() { return true; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.KiakaiMonster, 1.0, function() { return party.location == world.loc.Rigard.Inn.room && party.InParty(kiakai); }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.Kiakai63, 1.0, function() { return party.InParty(kiakai); }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.RosalinNursing, 1.0, function() { return rosalin.flags["PastDialog"] > Rosalin.PastDialog.Past; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.RosalinTransformation, 1.0, function() { return rosalin.flags["Met"] != 0; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.GwendyBarn, 1.0, function() { return gwendy.flags["Met"] != 0; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.GwendyStallion, 1.0, function() { return gwendy.flags["Met"] != 0; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.FeraKittens, 1.0, function() { return fera.FirstVag().virgin == false; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.MirandaJailed, 1.0, function() { return miranda.flags["Met"] != 0; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.MirandaMerc, 1.0, function() { return miranda.flags["Dates"] >= 1; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.TwinsMaids, 1.0, function() { return twins.flags["Met"] >= Twins.Met.Access; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.BlowjobGive, 2.0, function() { return player.sex.gBlow >= 25; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.BlowjobRec, 2.0, function() { return player.sex.rBlow >= 25; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.CunnilingusGive, 2.0, function() { return player.sex.gCunn >= 25; }, ravenTrigger);
			scenes.AddEnc(Scenes.Dreams.CunnilingusRec, 2.0, function() { return player.sex.rCunn >= 25; }, ravenTrigger);
			
			var ret = scenes.Get();
			
			Text.Flush();
			
			var end = function() {
				Scenes.Dreams.RavenAfterDream(ravenTrigger, func);
			}
			
			if(ret)
				Gui.Callstack.push(end);
			else
				Gui.NextPrompt(end);
		}
		
		
		if(ravenTrigger && ravenmother.Ravenness() >= RavenMother.Stage.ravenstage3 && ravenmother.flags["Met"] == 0) {
			Text.Add("You prepare for sleep, and lie down, fiddling with the gemstone in your hands. Do you really want to pursue these ravens? They have not harmed you so far, and what if it turns out to be dangerous? Most of your dreams don’t mean much anyway, so perhaps it’s not so bad to have them watched.");
			Text.NL();
			Text.Add("You feel like once you plunge ahead into this chase, you won’t be able to back out. Are you sure you want to do it?");
			Text.Flush();

			//[Onward][Not now]
			var options = new Array();
			options.push({ nameStr : "Onward",
				func : function() {
					Scenes.RavenMother.TheHunt(func);
				}, enabled : true,
				tooltip : "Focus on the crystal, pursue the ravens. You <i>will</i> know why they are intruding on your mind."
			});
			options.push({ nameStr : "Not now",
				func : function() {
					Text.Clear();
					dream();
				}, enabled : true,
				tooltip : "You don’t feel quite ready yet. You’ll tolerate the ravens for another night if they come."
			});
			Gui.SetButtonsFromList(options);
		}
		else
			dream();
	}
	else
		func();
}

Scenes.Dreams.RavenAfterDream = function(ravenTrigger, func) {
	if(ravenTrigger) {
		var r = ravenmother.Ravenness();
		if     (r == RavenMother.Stage.ravenstage2) {
			Text.NL();
			Text.Add("Most of the dream you just experienced is clear in your mind, though fading fast. But there is some part that feels strangely obscured... clawing at your memory, wishing to be recalled, but just beyond your reach.");
			Text.Flush();
			Gui.NextPrompt(function() {
				func(true);
			});
			return;
		}
		else if(r == RavenMother.Stage.ravenstage2 + 1) {
			Text.NL();
			Text.Add("The memories come clearer this time. And amid the clear memories, you distinguish one spot that is veiled in blackness, as if excised from your mind. You grab at it, pushing the veil aside with a mental effort, but it’s already faded too far. Next time you will be quicker.");
			Text.Flush();
			Gui.NextPrompt(function() {
				func(true);
			});
			return;
		}
		else if(r == RavenMother.Stage.ravenstage2 + 2) {
			Text.NL();
			Text.Add("You turn your mind to the dream, and in moments find the veiled spot. In your mind, you examine it closer and closer, willing it to resolve, and finally it clears, and you see a raven. But what’s the significance of it being part of your dream? There is still something you’re missing.");
			if(party.InParty(kiakai)) {
				var parse = {
					name : kiakai.name,
					HeShe : kiakai.HeShe(),
					heshe : kiakai.heshe()
				};
				Text.NL();
				Text.Add("Musing about the ravens, it takes some time for you to fully notice your surroundings. You find a concerned-looking [name] almost hovering over you. <i>“You were stirring, muttering something in your sleep,”</i> the elf says, noticing your attention. <i>“Is everything well?”<i>", parse);
				Text.Flush();
				
				//[Ravens][Fine]
				var options = new Array();
				options.push({ nameStr : "Ravens",
					func : function() {
						Scenes.Kiakai.RavenDreams();
						
						Gui.NextPrompt(function() {
							func(true);
						});
					}, enabled : true,
					tooltip : Text.Parse("Ask [name] if [heshe] knows anything about the ravens that have been appearing in your dreams.", parse)
				});
				options.push({ nameStr : "Fine",
					func : function() {
						Text.Clear();
						Text.Add("You tell [name] that you’re alright - you just had a strange dream. [HeShe] smiles, looking only a little skeptical.", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							func(true);
						});
					}, enabled : true,
					tooltip : Text.Parse("You’ll keep your concerns to yourself for now. You can always talk to [name] about the birds later if you decide it’s prudent.", parse)
				});
				Gui.SetButtonsFromList(options);
				
				return;
			}
			Text.Flush();
			Gui.NextPrompt(function() {
				func(true);
			});
			return;
		}
		else if(r == RavenMother.Stage.ravenstage2 + 3) {
			Text.NL();
			Text.Add("When you think of your dream, there is no veil this time - you see everything clearly. The bird was there again, watching you, tracking you. And when you tried to confront it while asleep, you managed to focus on it for a short while, but it somehow slipped away, forcing your mind back into the flow of the dream.");
			Text.NL();
			Text.Add("With this single revelation, it feels like a curtain is lifted from your memories. The ravens have been there so often. Not every time, but in almost half your dreams they watch you. Why? That question still eludes you.");
			Text.NL();
			Text.Add("You do however feel that it’s somehow the power of the gem that’s letting you see through their obfuscations, and gain greater awareness while you sleep. Perhaps if you focus on it before going to sleep the next time, you’ll be able to figure something out within the dream.");
			Text.Flush();
			Gui.NextPrompt(function() {
				func(true);
			});
			return;
		}
	}
	
	func(true);
}

Scenes.Dreams.RavenText = function(trigger, stage1, stage2, no) {
	stage1 = stage1 || "";
	stage2 = stage2 || "";
	no     = no     || "";
	
	if(trigger) {
		var r = ravenmother.Ravenness();
		if(r < RavenMother.Stage.ravenstage2 || r >= RavenMother.Stage.ravenstage3)
			return stage1;
		else
			return stage2;
	}
	else {
		return no;
	}
}

// Dreams
Scenes.Dreams.Ocean = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " A black bird flies high near the clouds.", " You spot a raven flying high above. It’s here again. You tell yourself you have to remember about this. Still...")
	};
	
	Text.Add("You float gently in a vast, deep blue ocean, caressed by the gentle waves. The sky above is the same soothing color, dotted with fluffy clouds.[raven] The water is so warm and comforting, and you feel like you don’t have a care in the world. When you wake up, you are refreshed and calm, though slightly regretful.", parse);
}

Scenes.Dreams.Forest = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " Even the croak of a raven somewhere in the branches of a nearby tree fails to disturb you.", " You hear the croak of a raven from a nearby tree. It must be watching you. You tell yourself you must remember it when you leave these woods.")
	};
	
	Text.Add("You are wandering through a large forest, the dense foliage blocking out almost all of the sunlight from above. You are not exactly sure where you are going, but the soft, dim light and the low din of life everywhere around you is very soothing. None of the plants or trees are familiar to you, but somehow this doesn’t worry your calm mind.[raven] It is uncertain for how long you travel, but the farther you go, the darker the forest becomes, until finally you can see no more.", parse);
	Text.NL();
	Text.Add("You awake fully rested, the earthy smell of the forest still vivid in your mind.", parse);
}

Scenes.Dreams.Harem = function(ravenTrigger) {
	var parse = {
		setof : player.NumCocks() > 1 ? " set of" : "",
		s     : player.NumCocks() > 1 ? "s" : "",
		raven : Scenes.Dreams.RavenText(ravenTrigger, " Some soft black down floats around, apparently from the pillow.", " You spot a black feather drifting down, and, looking up, momentarily lock eyes with a raven. You break eye contact first, returning to the pleasant dream. You’ll just have to remember that it was there for when you awake.")
	};
	
	Text.Add("You are not sure of where you are exactly, only that you are very happy to be there. Relaxing and enjoying yourself, you lie back on an enormous, soft pillow, gazing up at the fluffy, pink haze above.[raven] Someone puts some kind of sweet in your mouth, which you greedily eat up, sighing as you feel it melt in your mouth. Slowly, you become aware of more people surrounding you, maidens and youths of all shapes and sizes. You can’t seem to focus on any one in particular, but they are all very beautiful, and very scantily clad.", parse);
	Text.NL();
	Text.Add("You sink deeper into the warm embrace of silk and skin, countless hands softly caressing your body. Lips tasting of fresh cherries lock with yours, and you feel someone straddling you...", parse);
	Text.NL();

	if(player.FirstCock())
		Text.Add("When you wake up, you are sporting a[setof] raging hard-on[s].", parse);
	else if(player.FirstVag())
		Text.Add("When you wake up, you have a decidedly damp spot down below.", parse);
	else
		Text.Add("What a bad time to be waking up.", parse);
	Text.Add(" Your whole body is tingling, and your heart is racing. Grudgingly, you get up to face the day.", parse);
	
	player.AddLustFraction(0.4);
}

Scenes.Dreams.BackHome = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " A beat of wings and a blur of black feathers distracts you for a moment as some bird flaps away from your doorstep.", " A raven flaps away from the opening door. Once again the bird. You have to remember it. Wait...")
	};
	
	Text.Add("You wake up in your own bed, momentarily confused about your dream. There were strange creatures, talking animals, demons… at any rate, you are happy to be back home again. You don’t feel like there is anything in particular that you have to do today, so you linger for a while before getting up.", parse);
	Text.NL();
	Text.Add("There is a bit of confusion as you step outside.[raven] Surely, the sky wasn’t green yesterday? And you are pretty sure that there wasn’t a large moat surrounding your house. No matter, you think as you wade across it, at least you are finally back home.", parse);
	Text.NL();
	Text.Add("Unfortunately, reality settles in soon enough. This time you wake up for real, as far from home as when you went to sleep.", parse);
}

Scenes.Dreams.Heartstone = function(ravenTrigger) {
	var parse = {
		skinDesc : function() { return player.SkinDesc(); },
		raven : Scenes.Dreams.RavenText(ravenTrigger, " A black feather falls on you from somewhere up above, but you pay it no mind.", " A black feather falls from somewhere above. Again, the ravens are watching. You feel you should take note, but you yourself are simply too fascinating.")
	};
	
	Text.Add("You are looking at yourself from outside your own sleeping body, curiously studying yourself.[raven] Do you really look that way to others? You are quickly distracted from your surface appearance, however, as you delve deeper, below the [skinDesc]. Seeing every tiny cell of your body in exquisite detail, your unnatural vision flits back and forth, focusing here and there on some odd part of your anatomy.", parse);
	Text.NL();
	Text.Add("As if being dragged there, you gravitate towards the core of you being, speeding through your veins lightning quick and arriving at where your heart should be. There, inside your chest, is the living purple gemstone, pulsing rhythmically, giving your body life.", parse);
	Text.NL();
	Text.Add("You awaken, a bit unsettled by the eerie vision.", parse);
}

Scenes.Dreams.CoC = function(ravenTrigger) {
	var parse = {
		raven1 : Scenes.Dreams.RavenText(ravenTrigger, " a raven girl,", " a raven girl,"),
		raven2 : Scenes.Dreams.RavenText(ravenTrigger, "", " Hold on, that raven girl feels like she doesn’t belong here. It must be one of the watchers again. You have to remember.")
	};
	
	Text.Add("You wake up, and blearily disentangle yourself from someone’s warm embrace. Glancing behind you, you find that you were nestled in the arms of a busty cowgirl.", parse);
	Text.NL();
	Text.Add("Getting up, you find yourself at a very comfortable campsite. Some sort of pink and purple portal swirls in the middle of the site. Much of the ground is covered in carpets, and awnings cast long shadows in the red dawn light. You are not sure if it’s a trick of the light, but the ground and the sky also look to be distressing shades of scarlet.", parse);
	Text.NL();
	Text.Add("Around you, however, the campsite is filled with a motley of girls in various stages of awakening. In addition to the companionable cowgirl, you spot a striped shark girl, a lizard girl, a pretty dragon girl,[raven1] and some others you can’t quite make out in the poor light. Though you swear you’ve never seen them before, you feel an odd affection for them.[raven2]", parse);
	Text.NL();
	Text.Add("There is a strange noise, and you find your eyes opening, a little regretfully. You would’ve liked to get to know a bit more about them.", parse);
}

Scenes.Dreams.EndlessClassroom = function(ravenTrigger) {
	var parse = {
		gen : player.mfFem("Sir", "Ma'am"),
		raven : Scenes.Dreams.RavenText(ravenTrigger, " The more you look, the more bird-like they all appear, staring at you with intent beady eyes.", " As you look, the students look more and more like ravens, staring at you with beady eyes. Now, you can even make out their black wings. So many watchers this time. You force yourself to lock gazes with the multitude for a moment longer - you have to remember them.")
	};
	
	Text.Add("Your pupils sit in orderly rows, as you read from a dry tome in your hands. A hand is raised in the back, and, after finising the sentence, you shut the book, and wave for the student to speak. He stands, and you can barely make him out in the distance.", parse);
	Text.NL();
	Text.Add("<i>“[gen],”</i> the piping voice somehow carries to you through the distance. <i>“What is agoraphobia?”</i> As you look, the student seems to recede further, and behind him, the rows go on and on, spreading outwards and stretching endlessly, until there is nothing in your view but an endless sea of desks, an endless sea of intent faces.[raven]", parse);
	Text.NL();
	Text.Add("Breathing a little fast, you glance down hurriedly, and reopen the book. There. Only you and the words.", parse);
	Text.NL();
	Text.Add("You awaken, shivering slightly. What a peculiar dream.", parse);
}

Scenes.Dreams.PredatorPack = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " Above you, a raven croaks on the wing, encouraging your pursuit.", " Above you, a raven croaks on the wing. They’re watching you again. Well, you’ll give them a show this time, and you’ll remember."),
		raven2 : Scenes.Dreams.RavenText(ravenTrigger, "the deer", "the deer", "her")
	};
	
	Text.Add("Paws pound the snow behind you and to your sides, as you lope through the trees. Your brothers and sisters are fast, but you are faster. You all smell the deer ahead, the distance narrowing as she tires.[raven]", parse);
	Text.NL();
	Text.Add("You hear [raven2] turning and darting out through the treeline. She’s desperate, but clever. Humans live out there. It’s dangerous to chase too far. You bare your teeth, and push harder, your claws pounding through the thin layer of snow and finding purchase in the dirt underneath. There are snarls from your pack, as they try to match your pace, but you’ll have to do this alone.", parse);
	Text.NL();
	Text.Add("Out in the open, the deer is almost within reach, and you push past what even you thought possible, your paws lightly brushing the ground, sending you almost flying forward. You press a little deeper, and launch yourself, your teeth closing on your prey’s neck, her lifeblood flowing over your tongue.", parse);
	Text.NL();
	Text.Add("Soon, your pack is there, and you all feast on your kill. You dig through the entrails, the intoxicating smell of the deer’s blood covering your muzzle, until you come up with the liver. To the best hunter go the choicest bits.", parse);
	Text.NL();
	Text.Add("Waking up, you brush a hand over your nose, a little surprised to find it clean.", parse);
}

Scenes.Dreams.FirePet = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " At the bottom of the bag, you find a mess of black feathers, and you toss them in as well.", " At the bottom of the bag, you find a mess of black feathers, and you toss them in as well. The raven was here again. It seems to have avoided your bag, but it left a trace. You’ll have to remember about it.")
	};
	
	Text.Add("You rush back to your house. Your darling must be so hungry by now! You’ve been away for too long. You toss your overfull bag down at the doorstep and hurriedly close the door.", parse);
	Text.NL();
	Text.Add("Ah, good, there it is. Burning brightly in the center of the room, stifling the room with its heat. It’s still fine. You open your bag, and pull a weighty tome of philosophy out, and it’s eaten in a whisper. Only the best for your dear. You reach in for the next book.[raven]", parse);
	Text.NL();
	Text.Add("The bag is empty, and the blaze burns larger, a tinge of blue mixed in with its orange. But it still hungers. You can feel it. You take off your hat, and put it into the flame, where it’s consumed with a satisfied burp.", parse);
	Text.NL();
	Text.Add("Eventually, you stand naked in the bare room. It hungers still, though you feel like it’s almost satisfied. Just a little more. You take a step forward, and feel a gentle caress on your skin.", parse);
	Text.NL();
	Text.Add("You awaken, shivering even as your body feels hot.", parse);
}

Scenes.Dreams.House = function(ravenTrigger) {
	var parse = {
		mastermistress : player.mfFem("master", "mistress"),
		raven1 : Scenes.Dreams.RavenText(ravenTrigger, " marvelling at the beautiful raven design painted on your plates,", ""),
		raven2 : Scenes.Dreams.RavenText(ravenTrigger, "", " You notice a lifelike raven design painted on your plate. So lifelike, indeed, that its eyes seem to move. You almost admire them for watching you from something like this. Still, you’ve got to figure out why the birds are here, once you’re awake.")
	};
	if(party.NumTotal() <= 1) {
		parse["person"] = "your darling";
		if(Math.random() < 0.5) {
			parse["pheshe"]  = "he";
			parse["phisher"] = "his";
		}
		else {
			parse["pheshe"]  = "she";
			parse["phisher"] = "her";
		}
	}
	else {
		var person = party.GetRandom(true);
		parse["person"]  = person.name;
		parse["pheshe"]  = person.heshe();
		parse["phisher"] = person.hisher();
	}
	
	Text.Add("Pancakes sizzle in your frying pan, as [person] waters the plants around your cozy cottage. You eat slowly while chatting,[raven1] as [pheshe] smothers [phisher] pancakes in a flowing golden honey.[raven2]", parse);
	Text.NL();
	Text.Add("There is a loud knock at the entrance. Must they always be so forceful? You tell [person] you’ll get it, and head over to the door. As you swing it open, you are faced with a towering demon, its lumbering form completely eclipsing your small doorway.", parse);
	Text.NL();
	Text.Add("<i>“Kth’larmo sends apologies for her absence, [mastermistress],”</i> it speaks, its voice a barely comprehensible gurgling growl. <i>“This one has come to make the delivery in her stead.”</i>", parse);
	Text.NL();
	Text.Add("It extends its hand, and you take the large basket of produce it proffers, noting with pleasure a pair of books you’ve been looking forward to receiving. You thank the poor creature, and tell it that no apologies are necessary.", parse);
	Text.NL();
	Text.Add("As it lumbers away, you catch a glimpse of the torn and lifeless landscape beyond your house’s white picket fence, before you firmly shut the door.", parse);
	Text.NL();
	Text.Add("Finishing up the pancakes, and showing the new books to [person], you slowly drift awake.", parse);
}

Scenes.Dreams.Hermit = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " A raven perches on his shoulder, regarding you with beady eyes.", " A raven perches on his shoulder, almost as if it belongs there. But you’ve seen them enough, you know they are here to watch you. Now, you must only remember that when you wake.")
	};
	
	Text.Add("You are climbing a mountain, your lungs burning as they draw in the cold thin air. Just a little further. Finally, you spot the entrance of the cave, and force yourself towards it. As you reach its mouth, the Hermit catches you in a stumble, leading you inside.[raven]", parse);
	Text.NL();
	Text.Add("He lives up here alone, nourished only by what nature gives him willingly. He gives you a cup of goat’s milk, sweetened with the nectar of mountain flowers, and as you drink it down, you feel life flowing back into you. Finally, you ask him the question you came for - what to do next. How can you overcome the forces that oppose you and save the world?", parse);
	Text.NL();
	Text.Add("<i>“The first step is always to open your eyes,”</i> the Hermit says, his voice wispy. <i>“Look around you and see the world as it really is.”</i>", parse);
	Text.NL();
	Text.Add("It doesn’t take you long to do just that, and curse at the imaginary dream hermit and his pointless advice.", parse);
}

Scenes.Dreams.Alchemy = function(ravenTrigger) {
	var parse = {
		
	};
	
	Text.Add("You throw in the beet leaves, stir seven times, counting in your head, then rabbit fur, another four stirs and a count of fourteen, and the iron shavings go in. The process seems to go on for hours, with an endless procession of ingredients you pull from the shelf beside you.", parse);
	Text.NL();
	Text.Add("Finally you throw in the last one - worm soil - and the mixture gurgles unpleasantly. ", parse);
	if(ravenTrigger) {
		Text.Add("A sharp beak pokes its way out of the murky liquid, and a black bird follows. It hops to the edge of the pot, and shakes itself, droplets flying in all directions, before quickly preening its feathers and taking off.");
		Text.NL();
		Text.Add(Scenes.Dreams.RavenText(true, "In a few moments, it’s almost gone from sight, circling far overhead. No, no, that definitely wasn’t supposed to happen! This potion is for... well, it’s for something that’s not a raven. This has to be perfect.", "How did the thing get in there? Was it holding its breath in the pot all along, or was it somehow trapped in the ingredients? Either way, it’s clear it’s here to spy on you again. You have to remember that when you wake up. Right now, however, you have to get this potion right. It has to be perfect."));
	}
	else {
		Text.Add("No, no, that wasn’t supposed to happen! That smell, that texture it’s all wrong. That’s right, you made a mistake with the wood shavings! You empty the pot, and start over. This has to be perfect.");
	}
	Text.NL();
	Text.Add("The next attempt fails because of the cat whiskers, the one after that you use the wrong kind of water. Failures continue time after time, as your mistakes become more and more basic.", parse);
	Text.NL();
	Text.Add("You are still mumbling to yourself about the right count of stirs when you wake up, feeling vaguely frustrated at your dreamed incompetence.", parse);
}

Scenes.Dreams.UruChoice = function(ravenTrigger) {
	var parse = {
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockDesc : function() { return player.FirstCock().Short(); },
		cockDesc2 : function() { return player.AllCocks()[1].Short(); },
		vagDesc : function() { return player.FirstVag() ? player.FirstVag().Short() : player.Butt().AnalShort(); },
		raven : Scenes.Dreams.RavenText(ravenTrigger, "", "")
	};
	
	Text.Add("Your skin crawls with the overspill of enormous magical forces, as you suddenly feel a hot breath of dry air blow against your back. Spinning around, you see the shapely form of Uru just a few steps away, with the bright edges of a portal behind her.", parse);
	Text.NL();
	Text.Add("<i>“Look what I made, pet!”</i> the omnibus purrs, grinning. <i>“And I thought to myself 'what could possibly be more fitting than visiting the person who made it all possible?'”</i> She takes a step towards you, caressing your cheek, her thumb brushing the corner of your mouth.", parse);
	Text.Flush();
	
	//[Resist][Support her]
	var options = new Array();
	options.push({ nameStr : "Resist",
		func : function() {
			Text.Clear();
			Text.Add("You shout defiance at the demon, and jump back, preparing to fight. And, in an instant, before you can really get ready, she’s stripped you of your weapons and armor, leaving all your belongings in a messy heap behind her.", parse);
			Text.NL();
			Text.Add("<i>“Now, now, there’s no need for that,”</i> Uru chides, as you stand naked before her. <i>“I’m just going to give you one final reward, and then you’ll never see me again. ", parse);
			if(gameCache.flags["IntroFuckedUru"] != 0 || gameCache.flags["IntroFuckedByUru"] != 0)
				Text.Add("Didn’t you enjoy having sex with me last time?”</i>", parse);
			else
				Text.Add("You didn’t want to fuck me last time, but I’ll show you just what you missed...”</i>", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Even if it’s come to this, you’ll fight her to the end!"
	});
	options.push({ nameStr : "Support her",
		func : function() {
			Text.Clear();
			Text.Add("You take hold of Uru’s hand, and tell her that you’ve been hoping all along that she’d succeed. A being as beautiful as her should naturally rule the worlds. A little flattery can’t possibly hurt...", parse);
			Text.NL();
			if(gameCache.flags["IntroFuckedUru"] != 0 || gameCache.flags["IntroFuckedByUru"] != 0)
				Text.Add("<i>“You’re quite the little flirt, aren’t you?”</i> she asks. <i>“Did you love sex with me that much? I suppose it’s time for some more, as a final reward.”</i>", parse);
			else
				Text.Add("<i>“Then why did you turn me down?”</i> she demands. <i>“Well, maybe you were a little shy. I’ll make it simpler for you this time - I’m not taking ‘no’ for an answer.”</i>", parse);
			Text.NL();
			Text.Add("She strips your clothes with a gesture, dropping them in a messy pile behind her.", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Maybe you should join the winning side. And besides, she’s gorgeous."
	});
	Gui.SetButtonsFromList(options);
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("It seems Uru is done with words, as she pushes you down and ", parse);
		if(player.FirstCock()) {
			Text.Add("presses her palm against your chest. With the touch of her scalding skin against yours, you feel your [multiCockDesc] coming to raging erection, while Uru simply smiles in satisfaction. She sits down on top of you, ", parse);
			if(player.NumCocks() > 1)
				Text.Add("your [cockDesc] driving into her pussy, while the [cockDesc2] presses into her ass.", parse);
			else
				Text.Add("your [cockDesc] plunging smoothly into her front hole.", parse);
			Text.NL();
			parse["somehow"] = player.FirstCock().length.Get() > 25 ? " somehow" : "";
			Text.Add("In one motion she[somehow] drives all the way down, her bountiful butt smothering your groin, while her own enormous erection bounces awkwardly around your face. The sensation of being inside her is overwhelming, as much pain at her incredible tightness as pleasure.", parse);
			Text.NL();
			Text.Add("The demonic goddess has no mercy for you, however, as she begins bouncing up and down, while her insides pulsate and massage, tearing against your self control. Within minutes, you find yourself plunging over the edge, your [multiCockDesc] exploding inside her, coating her soaking wet insides in an extra layer of fluids.", parse);
			Text.NL();
			Text.Add("A cruel smile graces Uru’s full lips above you. <i>“Now, now, that won’t do, little slut.”</i> You feel a wave of magic pressing into you, and your flagging erection returns to full mast, as a thicker fog of lust clouds your mind.", parse);
		}
		else {
			parse["vag"] = player.FirstVag() ? Text.Parse(", and your [vagDesc] grow soaking wet in return", parse) : "";
			Text.Add("forces you to service her enormous member. With every touch, every contact of lips or tongue with her pulsing penis, you feel lust fill your mind[vag].", parse);
			Text.NL();
			Text.Add("Apparently satisfied, the demon goddess pulls momentarily away, before plunging deep inside you in a single thrust. No amount of lust prepared you for that, as you feel your [vagDesc] streched far beyond its normal limits, and scream out much more in pain than pleasure.", parse);
			Text.NL();
			Text.Add("Even this pain is eventually subsumed beneath the need you feel from simple contact with Uru, however. Soon, you find yourself moaning in pleasure, almost against your will, and your nethers shudder around the massive intruder, as your body rocks with a massive orgasm.", parse);
			Text.NL();
			Text.Add("A cruel smile graces Uru’s full lips above you. <i>“Oh, you like it that much, do you, little slut?”</i> You feel a wave of magic pressing into you, driving you into an ever greater frenzy of need and desire. <i>“Then I suppose it’s time to take things to the next level.”</i>", parse);
		}
		Text.NL();
		Text.Add("Things get much less clear after that. You have a vague sense of mating with Uru in every possible configuration for hours. And once those are exhausted in configurations made possible by Uru’s magic transforming your body into stranger and stranger shapes.", parse);
		Text.NL();
		Text.Add("By the end, you hardly even feel pleasure or pain anymore, there is only the single imperative to mate with your Goddess. And then at last, after an eternity, it ends, and the demon queen steps away from you.", parse);
		Text.NL();
		Text.Add("<i>“That about settles the reward I owe you, pet. Be glad, many in my hordes have fought to the death to earn just a minute with me.”</i> As she looks down at your immobile form, Uru’s face darkens. <i>“But of course, in addition to the reward you’ve earned a punishment. You fled from me to that bitch Aria, you failed to assist me in escaping, you even made some pathetic attempt to stop me.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Because of you, my poor pets have been trapped in a desolate realm much longer than they needed to be. And they have grown hungry.”</i>", parse);
		Text.NL();
		Text.Add("The omnibus reaches down, and grabs hold of you, her nails digging into your flesh, and, with a flick of her wrist tosses you through the portal behind her. You do not see the ground beyond, as it is covered in an endless mass of demons. You are almost saved by them being packed in too tight to move, but at last your deformed body is grabbed by a dozen hands, pulled in different directions.", parse);
		Text.NL();
		if(ravenTrigger) {
			Text.Add(Scenes.Dreams.RavenText(true, "High above, a raven circles, apparently waiting to see if anything remains of you for it feast on.", "High above, a raven circles. You note with the dimmest shard of awareness that even in the demon world beyond the portal they are watching you. You make an effort to recall the significance of this, but it does not last long."));
			Text.NL();
		}
		Text.Add("Sharp teeth dig into your flesh, and the sensation is almost welcome after the abuse Uru inflicted. As you feel your throat tear, gasping for breath, and feeling a sense of nauseous relief, you sit up and open your eyes, awake at last.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	});
	
	return true;
}

Scenes.Dreams.UruRun = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " The croak of a raven comes from somewhere, suggesting what might happen to your remains.", " The croak of a raven comes from somewhere, oddly almost encouraging you in your flight. Still, you know it’s just here to watch. You’ll have to remember that when you’re awake.")
	};
	
	Text.Add("You are running, haunted by flickering shadows and an all-encroaching fire. Loud cackles mock you as your feet patter across the dry, cracked desolation.[raven] You don’t dare to turn your head around even for a second, assured that your pursuers would catch you immediately if you do. The feeling of flames licking your back playfully further reinforces this idea.", parse);
	Text.NL();
	Text.Add("<i>“Scuttering like an ant, back and forth, round and round you go!”</i> Glancing up, you see Uru, the hermaphrodite demoness, hovering lazily above you, a wicked smile on her dark lips. <i>“Hurry now, or they’ll catch you,”</i> she zips in front of you, urging you forward into her arms. Those perfectly formed arms. The demon is truly breathtaking, her flawless red skin shiny beneath the glaring sun. Her toned muscles emphasize her hourglass figure, her large breasts jiggle enticingly as she touches them seductively. Between the demon’s legs, her girthy girlcock juts out towards you, stiff and dripping pre.", parse);
	Text.NL();
	Text.Add("Her alluring face is framed by her long black hair, and crowned by her long demonic horns. Below her dark eyes and cute nose, her gaping maw is filled with sharp teeth. Suddenly, you realize that you have been running in the wrong direction the entire time.", parse);
	Text.NL();
	Text.Add("You wake up with a cold sweat, happy to once again be firmly entrenched in good old reality.", parse);
}

Scenes.Dreams.AriaTemple = function(ravenTrigger) {
	var parse = {
		playername  : player.name,
		stomachDesc : function() { return player.StomachDesc(); },
		hand        : function() { return player.HandDesc(); },
		anusDesc    : function() { return player.Butt().AnalShort(); },
		breastDesc  : function() { return player.FirstBreastRow().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); }
	};
	
	Text.Add("You awaken slowly in the familiar marble temple of the goddess of light, Lady Aria. You are resting on a soft bed of flowers, tiny petals of white, light blue and pink.The air is thick with their pleasant fragrance, and for once in your travels, you feel completely safe, as if nothing could harm you.", parse);
	Text.NL();
	if(ravenTrigger) {
		Text.Add(Scenes.Dreams.RavenText(true, "Oddly, a little ways off, a pitch black raven sits at the edge of a pool. It preens its feathers with a graceful nonchalance that says it belongs here, however, so you pay it no mind.", "A little ways off, a raven sits at the edge of a pool, nonchalantly preening its feathers. You stare at it for a moment, surprised. Have they come to watch you even here? You should try to recall this when you wake up."));
		Text.NL();
	}
	Text.Add("The lady herself hovers above you, a look of concern on her perfect features. Golden tresses fall down her back, swaying softly to an ethereal wind you cannot perceive. She reaches over and touches your brow, soothing you.", parse);
	Text.NL();
	Text.Add("<i>We meet again, [playername]. This time, it is but a fleeting dream, however.</i>", parse);
	Text.Flush();
	
	//[Advice][Sex]
	var options = new Array();
	options.push({ nameStr : "Advice",
		func : function() {
			Text.Clear();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>The stone is the key… it holds many secrets.</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>Eden can ill withstand a being such as Uru… you must hurry.</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>Seek out my true servants, they will aid you on your quest.</i>", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
			Text.NL();
			Text.Add("Gradually, the goddess’ beautiful visage fades, leaving only the dreary world of reality. You wake up feeling enlightened, but the happiness quickly fades, as you realize how useless her advice was.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Ask her for advice on how to complete your task."
	});
	options.push({ nameStr : "Sex",
		func : function() {
			Text.Clear();
			Text.Add("Aria looks at you without replying, though she blushes faintly. The proud Lady looks like she’s hesitating. Finally, she slowly nods her head, expression unreadable.", parse);
			Text.NL();
			Text.Add("<i>Very well. I shall soothe thy desires, my champion.</i>", parse);
			Text.NL();
			Text.Add("With a gesture, the goddess’ elegant white robes evaporate into a thin mist, revealing her naked, unblemished body. She is unnaturally fair, even for this dream realm, and seeing her in her full glory makes the surroundings fade away into a dull gray. Her plentiful breasts jiggle tantalizingly as she steps closer, getting down on her knees.", parse);
			Text.NL();
			Text.Add("It is pure bliss when those full, red lips shower you with kisses - the nape of your neck, your [stomachDesc], your own lips. If this is the dream, you wonder what the reality would be like...", parse);
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Come to think of it, you have some previous experience with laying down Goddesses… though the last one was decidedly more demonic in appearance. As if reading your mind, Lady Aria smiles wickedly, her luminescent eyes taking on an odd scarlet hue. Her serpentine tongue trails across your body, her saliva hot to the touch. You reach up with one [hand], combing the goddess’ flaxen hair, tracing the curve of her horns.", parse);
				Text.NL();
				Text.Add("<i>Your thirst shall be sated, my hero.</i>", parse);
				Text.NL();
				parse["betweenOn"] = player.FirstBreastRow().Size() > 3 ? "between" : "on";
				Text.Add("Purring softly, Aria shifts around so she straddles your [stomachDesc], her girthy sixteen inch cock planted firmly [betweenOn] your [breastDesc], drooling divine pre. Greedily, you open your mouth, eager to taste her nectar.", parse);
				Text.NL();
				Text.Add("The dream turns strange from there, a jumbled mess of sensations and flashes of colors. You bodies writhe together, rolling on the bed of flowers. The Lady behaves in a decidedly unladylike manner, groping you roughly before she turns you over on your stomach.", parse);
				Text.NL();
				Text.Add("<i>Receive my blessing, oh great hero.</i> Her voice is mocking as she positions her cock against your [anusDesc].", parse);
				Text.NL();
				Text.Add("There is a piercing pain… and then you are awake, heart pounding in your chest and sweating profusely.", parse);
				
				player.AddLustFraction(0.3);
			}, 1.0, function() { return (gameCache.flags["IntroFuckedUru"] != 0 || gameCache.flags["IntroFuckedByUru"] != 0); });
			scenes.AddEnc(function() {
				parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
				parse["s"] = player.NumCocks() > 1 ? "s" : "";
				Text.Add("The goddess’ lips finally find your [multiCockDesc], eagerly wrapping themselves around[oneof] your shaft[s]. The world around you is wavering, growing diffuse and fuzzy. With your pre dripping from her tongue, Lady Aria arches her back as she straddles you, positioning your cock[s] at her entrance[s]. In a single, smooth motion, she slams her hips down, burying your [multiCockDesc] to the hilt inside her tight, divine hole[s].", parse);
				Text.NL();
				Text.Add("You can do naught but moan in delirious pleasure as she rides you, your already uncertain perception of time all but shattering from sensory overload. It is like nothing you’ve ever felt before, pure bliss surging through your body. You could give up everything you have just to experience another moment of this paradise in human form.", parse);
				Text.NL();
				Text.Add("When you finally awaken, you feel jolted at being bereft of this ultimate ecstasy. Not to mention aroused beyond measure.", parse);
				
				player.AddLustFraction(0.7);
			}, 1.0, function() { return player.FirstCock(); });
			scenes.AddEnc(function() {
				Text.Add("Suddenly, the goddess withdraws her touch, looking a bit grumpy. You look up at her in wordless complaint, aching for her to pleasure you.", parse);
				Text.NL();
				Text.Add("<i>Not before you have cleaned up here, you always make a mess!</i>", parse);
				Text.NL();
				Text.Add("Scurrying, eager to obey her, you grab a broom and start sweeping the temple. In a flurry of activity, you clean out every mote of dust, leaving the pristine marble spotless. Hopefully you return to the Lady, but she still looks resentful.", parse);
				Text.NL();
				Text.Add("<i>Not before the flowerbed has been properly tended, and the fountain scrubbed.</i>", parse);
				Text.NL();
				Text.Add("You lose track of all the menial tasks she sends you on, her naked body always dancing around on the edge of your vision, egging you on. By the third time you’ve swept the floors, you are starting to suspect that the temple is against you, deliberately keeping you from your lover.", parse);
				Text.NL();
				Text.Add("You awaken feeling very strange. The end of the dream was very muddled, but you are pretty sure you didn’t get laid.", parse);
				
				player.AddLustFraction(0.1);
			}, 1.0, function() { return true; });
			
			scenes.Get();
			
			Text.Flush();
			
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "If none of this is real, it can’t hurt to ask the goddess to have sex with you."
	});
	Gui.SetButtonsFromList(options);
	
	return true;
}

Scenes.Dreams.KiakaiMonster = function(ravenTrigger) {
	var parse = {
		playername : player.name,
		name : kiakai.name,
		heshe : kiakai.heshe(),
		hisher : kiakai.hisher(),
		raven1 : Scenes.Dreams.RavenText(ravenTrigger, ", decorated with a pattern of ravens,", ", decorated with a pattern of ravens,"),
		raven2 : Scenes.Dreams.RavenText(ravenTrigger, "", " Surely they can’t watch you from a simple design. Although who knows what’s possible in dreams. You’ll have to consider this when you’re awake.")
	};
	
	Text.Add("You hear a scream somewhere, and rush over to the source, only to find [name] sitting up in [hisher] bed, clutching the sheets[raven1] practically up to [hisher] eyes.[raven2]", parse);
	Text.NL();
	Text.Add("<i>“[playername], there’s a monster under my bed,”</i> the elf says, as soon as [heshe] sees you.", parse);
	Text.NL();
	Text.Add("You knew [name] could be a little childish, but to this extent? You roll your eyes in exasperation, but still, if that’s what it’s going to take, you might as well do it. You get on your knees on the hardwood floor, then lean down on your hands, and look under the bed.", parse);
	Text.NL();
	Text.Add("There, you see a terrified wide-eyed [name] huddled in the darkness. <i>“[playername],”</i> [heshe] says, <i>“there is a monster on my bed.”</i>", parse);
	Text.NL();
	Text.Add("You start to rise up, bump your head against the bed, and your eyes shoot open with a jolt. Warily, you glance over at the bed across from you, but nothing seems amiss.", parse);
}

Scenes.Dreams.Kiakai63 = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " A black bird is perched on the edge of the opening, looking down on you placidly.", " A raven is perched on the edge of the opening, curiously regarding you.<br/><br/>So, they are watching you once more. You wonder what they’re looking for, and decide to consider the question when you wake up.")
	};
	
	// Reverse initial gender
	if(kiakai.flags["InitialGender"] == Gender.male) {
		parse["str"] = "she is indeed a she, the soft swell of her small breasts and her slightly wide hips both telltale signs";
		parse["HeShe"] = "She";
		parse["heshe"] = "she";
		parse["hisher"] = "her";
	}
	else { //was female
		parse["str"] = "he is indeed a he, his flat chest, slim figure and the slight bulge between his legs being telltale signs";
		parse["HeShe"] = "He";
		parse["heshe"] = "he";
		parse["hisher"] = "his";
	}
	
	Text.Add("You groan as you wake up, hoping that this isn't going to become a recurring theme in your life. You are lying flat on your back, in what looks like a circular tent made from tough animal hide. A small slanted opening near the top, designed to let light in while keeping rain out, illuminates the dim interior.[raven]", parse);
	Text.NL();
	Text.Add("<i>...?</i>", parse);
	Text.NL();
	Text.Add("As you muse on how you escaped death this time, you become aware of a warm shape pressing against you. Someone very slim and scantily clothed is lying on top of you, their hands lovingly caressing your body. A glimpse of very large purple eyes and long pointed ears peeking out under a silky mass of silver hair confirms that whoever your bed mate is, it is not a regular human.", parse);
	Text.NL();
	Text.Add("The elfin creature starts to sensually suck at one of your nipples, which spreads a tingling feeling through your entire body. Even so close, you are not quite sure if it is male or female, either due to the poor light or the very androgynous face. As your intimate visitor slowly grinds its crotch against one of your legs, their gender suddenly becomes <i>readily</i> apparent.", parse);
	Text.NL();
	Text.Add("<i>...Huh?</i>", parse);
	Text.NL();
	Text.Add("You gently dislodge yourself from the horny elf, pushing yourself into a sitting position. Your chest is bare, but someone has put a pair of comfortable pants on you. A better look at your bedmate confirms that [str]. [HeShe] is clad in a pale blue robe, ending a few inches above [hisher] bared knees.", parse);
	Text.NL();
	Text.Add("<i>“Ah, you are awake!”</i> the elf says happily. Confronted with the question as to exactly [heshe] was doing in your bed, and where your bed <i>is</i> for that matter, the elf blushes slightly. <i>“L-lets not get hasty here, I know it might look bad, but really, I'm just trying to help.”</i> [HeShe] looks a bit distraught.", parse);
	Text.NL();
	Text.Add("You continue talking with the elf for a while, but can’t shake the sense of deja vu. When you wake up for real, you feel a bit confused.", parse);
}

Scenes.Dreams.RosalinNursing = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " Somewhere above, a raven croaks loudly in distress at the fumes, and flies off.", " Somewhere above, a raven croaks loudly in distress at the fumes, and flies off. Serves the spy right. They intrude in your dreams far too often. You’ll have to remember to do something about them when you wake up."),
		raven2 : Scenes.Dreams.RavenText(ravenTrigger, "the catgirl", "the catgirl", "she")
	};
	
	Text.Add("You wake up in a bed, feeling very ill. Confused, you glance around at the white, featureless room, but find that you are unable to move, or even turn your head. There is a thin sheet of white cloth covering you lower body.", parse);
	Text.NL();
	Text.Add("<i>“You are awake! Good, good!”</i> In the corner of your eye, you see a manically grinning catgirl with teal hair, holding a tray filled with bottles of strange colors and shapes. <i>“I was afraid you wouldn’t make it for a while, that stubbed toe looked so bad,”</i> Rosalin tuts, placing the tray near you. <i>“I’m sure you’ll just love your new body though!”</i> She throws back the sheets, revealing that your entire lower body has been replaced with a large, squirming snake. Unlike a regular naga tail though, this one has a head, and it doesn’t look very happy with the situation. It hisses uncertainly at you.", parse);
	Text.NL();
	Text.Add("<i>“Now now, don’t be that way, you still have a long way to recovery!”</i> The insane alchemist hums as she pours all of her bottles into a large pot. The concoction begins to boil, spluttering green, acidic drops that begin to rapidly eat through the floor.[raven] Picking up two cups, [raven2] fills them with the deadly solution and stalks closer, to the growing horror of both you and the snake.", parse);
	Text.NL();
	Text.Add("You wake up in a cold sweat, solemnly promising to never get sick while in the same country as Rosalin.", parse);
}

Scenes.Dreams.RosalinTransformation = function(ravenTrigger) {
	var parse = {
		skinDesc : function() { return player.SkinDesc(); },
		raven : Scenes.Dreams.RavenText(ravenTrigger, "a lustrous raven in her place. The bird looks at you curiously before flying off.", "a lustrous raven in her place. You grab for the bird, but it simply croaks at you in annoyance and flies off. You’re going to have to do something about these birds invading your dreams. If only you can remember about them when you wake up.", "only a tiny white mouse in her place.")
	};
	
	Text.Add("You are sitting at a bar, drinking some tasteless, colorless liquid and chatting with a cute catgirl sporting teal hair. Dimly, you recognize her as Rosalin, the enterprising alchemist you met at the nomads’ camp. The girl is ordering small shots of drinks you’ve never heard of in rapid succession, downing each one as soon as it is put in front of her.", parse);
	Text.NL();
	Text.Add("As you talk to her, you notice that she starts to change, her form wavering and twisting, though somehow always remaining recognizably Rosalin. The catgirl looks unconcerned as her tail grows large scales, expanding behind her like a monstrous snake, already a dozen feet long. She puts her hand on yours, her newly acquired feathers tickling your [skinDesc] lightly. You look deeply into the girl’s four insectoid eyes, admiring her feral beauty.", parse);
	Text.NL();
	Text.Add("Not technically a girl any longer, as your gaze flits downwards, noticing a brace of animalistic cocks sprouting from between her four pairs of legs. She still has her great tits though, all three rows of them.", parse);
	Text.NL();
	Text.Add("Your date goes smoothly, though by this point Rosalin has a bit of trouble reaching down to the bar disk due to the gargantuan size of her arachnid abdomen. Taking pity on her aimless grasping, trying to reach past her enormous bust, you grab her next shot and offer it to her. The alchemist smiles gratefully, downing the drink quickly.", parse);
	Text.NL();
	Text.Add("With a sudden pop, your companion disappears, leaving [raven]", parse);
	Text.NL();
	Text.Add("What an odd dream, you think to yourself as you wake.", parse);
}

Scenes.Dreams.GwendyBarn = function(ravenTrigger) {
	var parse = {
		boyGirl : player.mfTrue("boy", "girl"),
		raven : Scenes.Dreams.RavenText(ravenTrigger, " You do feel an inexplicable pang of annoyance when she carefully cleans the raven’s feathers, but no matter.", " You do feel a pang of annoyance when she carefully cleans the raven’s feathers. You’ve been seeing that bird or its like far too often in your dreams. Maybe once you’re awake you’ll be able to figure out something about it.")
	};
	
	Text.Add("This day looks like it’s going to be much like any other day in your life, you think to yourself, ponderously chewing your food. You smile fondly as your mistress climbs down from the loft where she sleeps, throwing her long blonde braid over her shoulder as she surveys the barn. Gwendy tends to the other animals first, but you are not jealous. You know that you’re her prize specimen, and that the freckled farmgirl will spend extra time on you in the end.[raven]", parse);
	Text.NL();
	Text.Add("When the pretty girl finally reaches your pen, she ruffles your hair fondly, murmuring that you are such a good [boyGirl], and how proud she is of you. You daze off as she combs you and refills your water, sounding excited as she speaks of the upcoming breeding season. Life is good.", parse);
	Text.NL();
	Text.Add("You wake up feeling a bit confused, mind still moving sluggishly.", parse);
}

Scenes.Dreams.GwendyStallion = function(ravenTrigger) {
	var parse = {
		playername : player.name,
		skinDesc : function() { return player.SkinDesc(); },
		raven : Scenes.Dreams.RavenText(ravenTrigger, " Outside, you hear the solemn caw of a raven.", " Outside, the ravens caw, announcing their presence in the dream."),
		cuntAss : player.FirstVag() ? "cunt" : "ass"
	};
	
	Text.Add("<i>“Don’t worry, it’ll be over soon,”</i> Gwendy assures you, patting your head fondly as she secures the restraints on your wrists. For a moment, you are left to your own devices in the cramped stall, awkwardly propped up over a waist high wooden frame, all your four limbs restricted with large leather bands. Even here inside the barn, you can feel a faint waft of a chill wind, making a shiver run over your naked [skinDesc].[raven]", parse);
	Text.NL();
	Text.Add("When Gwendy returns, she is leading a large stallion, one of the biggest in her stall. As she parades the stud in front of you, caressing his immense horsecock into its full size, you start to get an inkling to just what you have agreed to. Your fears are confirmed as she wraps a breeding bag over the horse’s flared cock, pouring a generous amount of lubricant over the enormous package. <i>“I’m so glad that you are helping me with this, [playername],”</i> the farmer tells you as she leads the aroused stud around the other end of the stall, out of your eyesight.", parse);
	Text.NL();
	Text.Add("<i>“Now, just relax,”</i> she says as you feel the stallion positioning himself over you, his forelegs resting on the frame in front of you. A heavy weight falls across your back as he mounts you, and the air is driven from your lungs as the massive animal rams its cock inside your protesting [cuntAss].", parse);
	Text.NL();
	Text.Add("<i>“I’ll leave the two of you to it,”</i> Gwendy tells you over her shoulder, her voice barely audible to you as the stud begins to move, fucking you with long, deep thrusts. <i>“I’ll go and get the next one...”</i>", parse);
	Text.NL();
	Text.Add("You aren’t quite sure what to think as you wake up.", parse);
	
	player.AddLustFraction(0.3);
}

Scenes.Dreams.FeraKittens = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " For some reason a scrawny baby raven is also nestled among the kittens.", " A scrawny baby raven is nestled among the kittens. It’s a little cute, but that doesn’t make the fact that it’s watching you better. You’ll have to remember this when you wake up."),
		raven2 : Scenes.Dreams.RavenText(ravenTrigger, "Fera", "Fera", "she"),
		raven3 : Scenes.Dreams.RavenText(ravenTrigger, "the lot", "the lot", "them")
	};
	
	Text.Add("You hear a loud knocking on your door. Trying to shrug off the last dregs of sleep, you hobble over to it, peering out blearily into the light. There is a short catgirl in a pink dress standing outside, a large box in her arms. It’s Fera, the assistant at the tailor’s shop, you realize. When you attempt to merrily greet her, she growls grouchily, thrusting the box toward you.", parse);
	Text.NL();
	Text.Add("<i>“Take responsibility!”</i> she demands loudly, glowering at you. Careful to not tick her off further, you open the box, looking down on a dozen innocent faces. Inside the box, there are kittens with spotted coats of brown, white and black. Your kittens, if Fera is to be believed.[raven] Somehow, [raven2] bulldozes you into accepting [raven3], leaving you looking rather foolish when she turns on her heels and leave. You call after her, asking where she is going.", parse);
	Text.NL();
	Text.Add("<i>“To get the other five boxes, of course!”</i> she responds.", parse);
	Text.NL();
	Text.Add("You suddenly wake up, heart beating rapidly. Perhaps you should consider using preventatives.", parse);
}

Scenes.Dreams.MirandaJailed = function(ravenTrigger) {
	var parse = {
		herm : miranda.flags["Met"] >= 3 ? " herm" : "",
		raven : Scenes.Dreams.RavenText(ravenTrigger, " A raven croaks somewhere, underscoring the verdict.", " A raven croaks somewhere, underscoring the verdict. You can’t quite make out where it’s perched among the rafters of the lawhouse, but it’s clear you’re still being watched. You’ll have to remember that when you get out of this dream.")
	};
	
	Text.Add("You are running through the deserted streets in the slums of Rigard, weaving between abandoned carts and overturned barrels. The muddy ground feels like it’s trying to drag you down, forcing you to move sluggishly. The guards are almost upon you, and there seems to be more of them down every side alley. Eventually, you realize that they are leading you on, herding you like prey by only leaving only one path of escape. You feel the noose tightening around your neck, but you have no choice but to run blindly forward.", parse);
	Text.NL();
	Text.Add("Rounding a corner, you run into the hunter, Miranda herself. The[herm] guardswoman gives you a predatory grin before she tackles you to the ground, driving all the air from your lungs. You can’t move even a fraction of an inch in her iron grip. The canine cop growls in your ear:", parse);
	Text.NL();
	Text.Add("<i>“Busted!”</i>", parse);
	Text.NL();
	Text.Add("Without further ado, you are hauled away to a grand court hall, with dozens of red-skinned imps acting as the jury. The grand judge is the dark succubus queen herself, Uru. <i>“Guilty! Guilty!”</i> the jury hollers. <i>“Guilty!”</i> the judge agrees smugly.[raven] Thus, you are dragged off to jail, given only the advice to never drop the soap. Miranda will be watching.", parse);
	Text.NL();
	Text.Add("You wake up, still uncertain what your crime was.", parse);
}

Scenes.Dreams.MirandaMerc = function(ravenTrigger) {
	var parse = {
		playername : player.name, 
		raven : Scenes.Dreams.RavenText(ravenTrigger, " A flock of ravens welcome you home, croaking from the roof of the house.", " You notice that a flock of ravens are studying you intently from their vantage point atop the roof. Here too.")
	};
	
	Text.Add("You and your band of mercenaries ribald and tell raunchy jokes as you pass through the slums of Rigard, on the home stretch of a successful mission. The Black Hounds have had a good run this year, and you are all eager to waste all your spoils on drinks and whores. Miranda jabs you in the side, sniggering that she can’t wait to have some with you without distractions. Other-Miranda chimes in, licking her lips.", parse);
	Text.NL();
	Text.Add("Your party reaches the guild hall, a rickety building home to your comrades, a gang of friendly luck seekers willing to do just about anything for money and pussy.[raven] Barging inside, you are greeted by thirty identical dobie muzzles sweeping your way.", parse);
	Text.NL();
	Text.Add("<i>“[playername]!”</i> Miranda greets you, raising her tankard with a wide grin on her face. <i>“You left me waiting too long, we have so many things to… catch up on.”</i>", parse);
	Text.NL();
	Text.Add("<i>“All of us are pretty pent up,”</i> Miranda agrees, patting her bulging crotch, <i>“you better take responsibility for this!”</i>", parse);
	Text.NL();
	Text.Add("<i>“You’ll have to get in line,”</i> Miranda growls, roughly pushing you down on all fours, her thick cock pressing against your rear entrance. With gleaming eyes and glistening cocks, the rest of the herms close in on you…", parse);
	Text.NL();
	Text.Add("You wake up with your heart beating rapidly in your chest. Somehow, you are glad there is only one Miranda that you have to deal with.", parse);
	
	player.AddLustFraction(0.3);
}

Scenes.Dreams.TwinsMaids = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, ", served on a plate with a raven motif", ". The raven depicted on the plate peer up at you intently, but you are not going to let that spoil your evening")
	};
	
	Text.Add("You really like the Lady’s Blessing, you conclude as you set your teeth into a particularly well prepared meal[raven]. Compliments to the cook, you tell your scantily clad waitress. She gives you a pretty blush, matching her red hair. And compliments on the service, you grin as you look down on her twin, who is busy lapping away at your crotch.", parse);
	Text.NL();
	Text.Add("The other maid looks up at you with adoration in her eyes, beaming happily at your compliments. Rumi or Rani - you could never tell them apart - returns to her task with increased fervor.", parse);
	Text.NL();
	Text.Add("Perhaps you should order a nice wine for dessert. But first, you ask the other royal to help her twin finish the job.", parse);
	Text.NL();
	Text.Add("You awaken, feeling hot and bothered at the thought of having your way with the heirs to the throne.", parse);
	
	player.AddLustFraction(0.3);
}

Scenes.Dreams.BlowjobGive = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " As you look up, the raven’s black eyes meet yours, nodding sagely as you dig in.", " You freeze slightly as you look up at the cock’s owner, a slight smirk on his beak. Well, lets see how the spy likes this.")
	};
	
	Text.Add("You swallow greedily, euphoric as wad after wad of thick seed pours down your throat, joining the steadily growing pool inside your stomach. No sooner does the spent cock retreat from your thirsty lips, than it is replaced with another one. The throbbing shaft is huge, as long and as thick as your forearms.[raven]", parse);
	Text.NL();
	Text.Add("Another would have been easily overwhelmed to have the veiny monster shoved down their throats, but you are in bliss, sucking eagerly in anticipation of your sticky reward. You close your eyes as you feel it twitch in your mouth, almost cumming yourself as the first splatter of semen hits your tongue. This taste could sustain you forever.", parse);
	Text.NL();
	Text.Add("By the looks of the endless line of erect shafts stretching out in front of you, it will. When you awake, you still remember the feel of the salty cream sliding down your throat.", parse);
	
	player.AddLustFraction(0.5);
}

Scenes.Dreams.BlowjobRec = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " On the back of the couch, four ravens sit, watching you with interest.", " You glance up, noting your feathered observers sitting on the edge of the couch. Naughty birds.")
	};
	
	Text.Add("You are reclining on a couch among soft pillows, comfortable on your back. Between your legs, your lover’s lips are wrapped around your shaft, bobbing up and down. Sighing in pleasure, you lean back, enjoying their expert attentions.[raven]", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		parse["HeShe"] = Math.random() > 0.8 ? "He" : "She";
		Text.Add("[HeShe] is no one special, just another worshipper at the altar of your manhood. These days, you need a blowjob just to get going in the morning. Fortunately, there has been no end of prospective suitors to sate your desires. Even now, two others hover nearby, eyeing your lover jealously. Perhaps you will have to go a few more rounds today.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("Uru’s long flexible tongue wraps itself around your cock, a small smile playing on the demon’s full lips. The succubus is, as always, a master fellatrix, sucking your shaft greedily, trying to coax out your seed. Somewhere in the back of your head, a small voice is trying to scream something at you, but it feels so good… You shake away the uneasy feeling.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		var p1 = party.GetRandom(true);
		parse["Name"]   = p1.name;
		parse["HeShe"]  = p1.HeShe();
		parse["heshe"]  = p1.heshe();
		parse["hisher"] = p1.hisher();
		parse["himher"] = p1.himher();
		Text.Add("[Name] surfaces briefly for air, before redoubling [hisher] efforts, sucking greedily on your cock. [HeShe] has improved so much since you first asked [himher] to do this, by dedicated training or through sheer natural talent, you are unsure. Either way, [heshe] is right where [heshe] belongs.", parse);
	}, 1.0, function() { return party.NumTotal() > 1; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("You are just about to cum, so very close, your thick member buried deep inside your lover's throat, when…", parse);
	Text.NL();
	Text.Add("Blearily, you stir, back in reality again. ", parse);
	if(player.FirstCock())
		Text.Add("With the biggest morning wood ever, of course.", parse);
	else
		Text.Add("Wistfully, you recall the time you had a cock...", parse);
	
	player.AddLustFraction(0.5);
}

Scenes.Dreams.CunnilingusGive = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " A raven peeks over her shoulder, peering at you curiously.", " Here too, the ravens are watching, peeking down at you over her shoulder. Why do they follow you?")
	};
	
	Text.Add("The amazon queen is reclining on a grand dais, fanned by barely-clothed attendants. Her bronze skin shines with scented oils, perfectly accentuating her well-toned muscle and full breasts. The queen herself only wears jewelry, large bands of gold and iron, studded with pretty gemstones.[raven] From your kneeling position, you have an excellent view of her shaved crotch, which she flaunts casually, her legs spread as she looks down on you.", parse);
	Text.NL();
	Text.Add("She speaks a single word, pointing towards her pussy, a triumphant smile playing on her lips. The language isn’t one that you understand, but the meaning is clear - Lick. You need no further encouragement, eager to please your mistress - or was it captor? The details seem a bit fuzzy. Far more important is the taste of the amazon’s sweet nectar, which you lap up greedily. Your queen moans as you plunge your flexible tongue into her folds, using every technique within your considerable repertoire to please her.", parse);
	Text.NL();
	Text.Add("Her powerful legs wrap around your head, trapping you in an intimate embrace as she arches her back, shaking as she cries out. Clear nectar flows onto your tongue, a deliciously sweet ambrosia. You drink and drink from her ceaseless fountain, getting your fill and then some. Shakily, you raise your head, peering left and right at the queen’s guards. With the same triumphant smile, the amazon repeats her command, pointing to one of them.", parse);
	Text.NL();
	Text.Add("When you wake up, you are drooling slightly.", parse);
	
	player.AddLustFraction(0.5);
}

Scenes.Dreams.CunnilingusRec = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " A raven settles down on your shoulders, ruffling its feathers uncertainly as it bobs up and down with your movements.", " A raven settles down a little way off, eyeing you warily. Perhaps it suspects that you are onto them."),
		multiCockDesc : function() { return player.MultiCockDesc(); },
		itThem : player.NumCocks() > 1 ? "them" : "it",
		itThey : player.NumCocks() > 1 ? "they" : "it"
	};
	
	var gender = Math.random() < 0.5 ? Gender.male : Gender.female;
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		parse["Name"] = "The wildcat";
		parse["name"] = "the wildcat";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["Name"] = "The lagomorph";
		parse["name"] = "the lagomorph";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["Name"] = "The equine";
		parse["name"] = "the equine";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["Name"] = "The mothgirl";
		parse["name"] = "the mothgirl";
		gender = Gender.female;
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["Name"] = "The bandit";
		parse["name"] = "the bandit";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["Name"] = "Uru";
		parse["name"] = "Uru";
		gender = Gender.female;
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	if(gender == Gender.male) {
		parse["HeShe"]  = "He";
		parse["heshe"]  = "he";
		parse["HisHer"] = "His";
		parse["hisher"] = "his";
		parse["himher"] = "him";
	}
	else {
		parse["HeShe"]  = "She";
		parse["heshe"]  = "she";
		parse["HisHer"] = "Her";
		parse["hisher"] = "her";
		parse["himher"] = "her";
	}
	
	Text.Add("You smile down haughtily at your defeated opponent, huffing slightly while enjoying the elation of victory. [Name] lies on [hisher] back, no longer able to resist you. Time to put [himher] to work. Shedding your armor and undergarments, you squat down, giving [himher] a better look at you. ", parse);
	if(player.FirstCock())
		Text.Add("[Name] blanches at the sight of your [multiCockDesc], but [itThey] will be the least of [hisher] worries. You pull [itThem] aside to reveal your glistening pussy.", parse);
	else
		Text.Add("[Name] blushes, having your glistening pussy only inches from [hisher] face.", parse);
	Text.Add(" Slowly, you lower yourself onto [himher], letting out a soft moan as you rub against [hisher] face.", parse);
	Text.NL();
	Text.Add("There is no need for you to give [himher] any orders, or exchange any words at all. [Name] digs in, trying to look resigned. [HeShe] is as good as any you’ve had, lapping at your labia hungrily, [hisher] nose pressing against your clit. Rocking your hips, you grind against your fallen foe, further humiliating [himher].[raven]", parse);
	Text.NL();
	Text.Add("You arch your back, crying out as you climax, collapsing on top of [name]. [HisHer] muffled protests only serve to heighten the sensation, sending shivers up your spine.", parse);
	Text.NL();
	Text.Add("When you come to, still half asleep, your heart is beating fast.", parse);
	
	player.AddLustFraction(0.5);
}
/*
Scenes.Dreams.Ocean = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, "", "")
	};
	
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
}
*/