
Scenes.Dreams = {}

Scenes.Dreams.Entry = function(func) {
	if(Math.random() < 0.5) {
		var scenes = new EncounterTable();
		scenes.AddEnc(Scenes.Dreams.Ocean, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.Forest, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.Harem, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.BackHome, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.Heartstone, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.CoC, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.EndlessClassroom, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.PredatorPack, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.FirePet, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.House, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.Hermit, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.Alchemy, 1.0, function() { return player.alchemyLevel >= 1; });
		scenes.AddEnc(Scenes.Dreams.UruChoice, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.UruRun, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.AriaTemple, 1.0, function() { return true; });
		scenes.AddEnc(Scenes.Dreams.RosalinNursing, 1.0, function() { return rosalin.flags["PastDialog"] > Rosalin.PastDialog.Past; });
		scenes.AddEnc(Scenes.Dreams.RosalinTransformation, 1.0, function() { return rosalin.flags["Met"] != 0; });
		scenes.AddEnc(Scenes.Dreams.GwendyBarn, 1.0, function() { return gwendy.flags["Met"] != 0; });
		scenes.AddEnc(Scenes.Dreams.FeraKittens, 1.0, function() { return fera.FirstVag().virgin == false; });
		scenes.AddEnc(Scenes.Dreams.MirandaJailed, 1.0, function() { return miranda.flags["Met"] != 0; });
		
		var ret = scenes.Get();
		
		Text.Flush();
		
		if(ret)
			Gui.Callstack.push(function() { func(true); });
		else
			Gui.NextPrompt(function() { func(true); });
	}
	else
		func();
}



// Dreams
Scenes.Dreams.Ocean = function() {
	var parse = {
		
	};
	
	Text.Add("You float gently in a vast, deep blue ocean, caressed by the gentle waves. The sky above is the same soothing color, dotted with fluffy clouds. The water is so warm and comforting, and you feel like you don’t have a care in the world. When you wake up, you are refreshed and calm, though slightly regretful.", parse);
}

Scenes.Dreams.Forest = function() {
	var parse = {
		
	};
	
	Text.Add("You are wandering through a large forest, the dense foliage blocking out almost all of the sunlight from above. You are not exactly sure where you are going, but the soft, dim light and the low din of life everywhere around you is very soothing. None of the plants or trees are familiar to you, but somehow this doesn’t worry your calm mind. It is uncertain for how long you travel, but the farther you go, the darker the forest becomes, until finally you can see no more.", parse);
	Text.NL();
	Text.Add("You awake fully rested, the earthy smell of the forest still vivid in your mind.", parse);
}

Scenes.Dreams.Harem = function() {
	var parse = {
		setof : player.NumCocks() > 1 ? " set of" : "",
		s     : player.NumCocks() > 1 ? "s" : ""
	};
	
	Text.Add("You are not sure of where you are exactly, only that you are very happy to be there. Relaxing and enjoying yourself, you lie back on an enormous, soft pillow, gazing up at the fluffy, pink haze above. Someone puts some kind of sweet in your mouth, which you greedily eat up, sighing as you feel it melt in your mouth. Slowly, you become aware of more people surrounding you, maidens and youths of all shapes and sizes. You can’t seem to focus on any one in particular, but they are all very beautiful, and very scantily clad.", parse);
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

Scenes.Dreams.BackHome = function() {
	var parse = {
		
	};
	
	Text.Add("You wake up in your own bed, momentarily confused about your dream. There were strange creatures, talking animals, demons… at any rate, you are happy to be back home again. You don’t feel like there is anything in particular that you have to do today, so you linger for a while before getting up.", parse);
	Text.NL();
	Text.Add("There is a bit of confusion as you step outside. Surely, the sky wasn’t green yesterday? And you are pretty sure that there wasn’t a large moat surrounding your house. No matter, you think as you wade across it, at least you are finally back home.", parse);
	Text.NL();
	Text.Add("Unfortunately, reality settles in soon enough. This time you wake up for real, as far from home as when you went to sleep.", parse);
}

Scenes.Dreams.Heartstone = function() {
	var parse = {
		skinDesc : function() { return player.SkinDesc(); }
	};
	
	Text.Add("You are looking at yourself from outside your own sleeping body, curiously studying yourself. Do you really look that way to others? You are quickly distracted from your surface appearance, however, as you delve deeper, below the [skinDesc]. Seeing every tiny cell of your body in exquisite detail, your unnatural vision flits back and forth, focusing here and there on some odd part of your anatomy.", parse);
	Text.NL();
	Text.Add("As if being dragged there, you gravitate towards the core of you being, speeding through your veins lightning quick and arriving at where your heart should be.There, inside your chest, is the living purple gemstone, pulsing rhythmically, giving your body life.", parse);
	Text.NL();
	Text.Add("You awaken, a bit unsettled by the eerie vision.", parse);
}

Scenes.Dreams.CoC = function() {
	var parse = {
		
	};
	
	Text.Add("You wake up, and blearily disentangle yourself from someone’s warm embrace. Glancing behind you, you find that you were nestled in the arms of a busty cowgirl.", parse);
	Text.NL();
	Text.Add("Getting up, you find yourself at a very comfortable campsite. Some sort of pink and purple portal swirls in the middle of the site. Much of the ground is covered in carpets, and awnings cast long shadows in the red dawn light. You are not sure if it’s a trick of the light, but the ground and the sky also look to be distressing shades of scarlet.", parse);
	Text.NL();
	Text.Add("Around you, however, the campsite is filled with a motley of girls in various stages of awakening. In addition to the companionable cowgirl, you spot a striped shark girl, a lizard girl, a pretty dragon girl, and some others you can’t quite make out in the poor light. Though you swear you’ve never seen them before, you feel an odd affection for them.", parse);
	Text.NL();
	Text.Add("There is a strange noise, and you find your eyes opening, a little regretfully. You would’ve liked to get to know a bit more about them.", parse);
}

Scenes.Dreams.EndlessClassroom = function() {
	var parse = {
		gen : player.mfFem("Sir", "Ma'am")
	};
	
	Text.Add("Your pupils sit in orderly rows, as you read from a dry tome in your hands. A hand is raised in the back, and after you finish the sentence, shut the book, and wave for the student to speak. He stands, and you can barely make him out in the distance.", parse);
	Text.NL();
	Text.Add("<i>”[gen],”</i> the piping voice somehow carries to you through the distance. <i>”What is agoraphobia?”</i> As you look, the student seems to recede further, and behind him, the rows go on and on, spreading outwards and stretching endlessly, until there is nothing in your view but an endless sea of desks, an endless sea of intent faces.", parse);
	Text.NL();
	Text.Add("Breathing a little fast, you glance down hurriedly, and reopen the book. There. Only you and the words.", parse);
	Text.NL();
	Text.Add("You awaken, shivering slightly. What a peculiar dream.", parse);
}

Scenes.Dreams.PredatorPack = function() {
	var parse = {
		
	};
	
	Text.Add("Paws pound the snow to behind you and to your sides, as you lope through the trees. Your brothers and sisters are fast, but you are faster. You all smell the deer ahead, the distance narrowing as she tires.", parse);
	Text.NL();
	Text.Add("You hear her turning and darting out through the treeline. She’s desperate, but clever. Humans live out there. It’s dangerous to chase too far. You bare your teeth, and push harder, your claws pounding through the thin layer of snow and finding purchase in the dirt underneath. There are snarls from your pack, as they try to match your pace, but you’ll have to do this alone.", parse);
	Text.NL();
	Text.Add("Out in the open, the deer is almost within reach, and you push past what even you thought possible, your paws lightly brushing the ground, sending you almost flying forward. You press a little deeper, and launch yourself, your teeth closing on your prey’s neck, her lifeblood flowing over your tongue.", parse);
	Text.NL();
	Text.Add("Soon, your pack is there, and you all feast on your kill. You dig through the entrails, the intoxicating smell of the deer’s blood covering your muzzle, until you come up with the liver. To the best hunter go the choicest bits.", parse);
	Text.NL();
	Text.Add("Waking up, you brush a hand over your nose, a little surprised to find it clean.", parse);
}

Scenes.Dreams.FirePet = function() {
	var parse = {
		
	};
	
	Text.Add("You rush back to your house. Your darling must be so hungry by now! You’ve been away for too long. You toss your overfull bag down at the doorstep and hurriedly close the door.", parse);
	Text.NL();
	Text.Add("Ah, good, there it is. Burning brightly in the center of the room, stifling the room with its heat. It’s still fine. You open your bag, and pull a weighty tome of philosophy out, and it’s eaten in a whisper. Only the best for your dear. You reach in for the next book.", parse);
	Text.NL();
	Text.Add("The bag is empty, and the blaze burns larger, a tinge of blue mixed in with its orange. But it still hungers. You can feel it. You take off your hat, and put it into the flame, where it’s consumed with a satisfied burp.", parse);
	Text.NL();
	Text.Add("Eventually, you stand naked in the bare room. It hungers still, though you feel like it’s almost satisfied. Just a little more. You take a step forward, and feel a gentle caress on your skin.", parse);
	Text.NL();
	Text.Add("You awaken, shivering even as your body feels hot.", parse);
}

Scenes.Dreams.House = function() {
	var parse = {
		mastermistress : player.mfFem("master", "mistress")
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
		var person = party.GetRandom();
		parse["person"]  = person.name;
		parse["pheshe"]  = person.heshe();
		parse["phisher"] = person.hisher();
	}
	
	Text.Add("Pancakes sizzle in your frying pan, as [person] waters the plants around your cozy cottage. You eat slowly while chatting, as [pheshe] smothers [phisher] pancakes in a flowing golden honey.", parse);
	Text.NL();
	Text.Add("There is a loud knock at your door. Must they always be so forceful? You tell [person] you’ll get it, and head over to the door. As you swing it open, you are faced with a towering demon, its lumbering form completely eclipsing your small doorway.", parse);
	Text.NL();
	Text.Add("<i>“Kth’larmo sends apologies for her absence, [mastermistress],”</i> it speaks, its voice a barely comprehensible gurgling growl. <i>“This one has come to make the delivery in her stead.”</i>", parse);
	Text.NL();
	Text.Add("It extends its hand, and you take the large basket of produce it proffers, noting with pleasure a pair of books you’ve been looking forward to receiving. You thank the poor creature, and tell it that no apologies are necessary.", parse);
	Text.NL();
	Text.Add("As it lumbers away, you catch a glimpse of the torn and lifeless landscape beyond your house’s white picket fence, before you firmly shut the door.", parse);
	Text.NL();
	Text.Add("Finishing up the pancakes, and showing the new books to [person], you slowly drift awake.", parse);
}

Scenes.Dreams.Hermit = function() {
	var parse = {
		
	};
	
	Text.Add("You are climbing a mountain, your lungs burning as they draw in the cold thin air. Just a little further. Finally, you spot the entrance of the cave, and force yourself towards it. As you reach its mouth, the Hermit catches you in a stumble, leading you inside.", parse);
	Text.NL();
	Text.Add("He lives up here alone, nourished only by what nature gives him willingly. He gives you a cup of goat’s milk, sweetened with the nectar of mountain flowers, and as you drink it down, you feel life flowing back into you. Finally, you ask him the question you came for - what to do next. How you can overcome the forces that oppose you and save the world.", parse);
	Text.NL();
	Text.Add("<i>“The first step is always to open your eyes,”</i> the Hermit says, his voice wispy. <i>“Look around you and see the world as it really is.”</i>", parse);
	Text.NL();
	Text.Add("It doesn’t take you long to do just that, and curse at the imaginary dream hermit and his pointless advice.", parse);
}

Scenes.Dreams.Alchemy = function() {
	var parse = {
		
	};
	
	Text.Add("You throw in the beet leaves, stir seven times, counting in your head, then rabbit fur, another four stirs and a count of fourteen, and the iron shavings go in. The process seems to go on for hours, with an endless procession of ingredients you pull from the shelf beside you.", parse);
	Text.NL();
	Text.Add("Finally you throw in the last one - worm soil - and the mixture gurgles unpleasantly. No, no, that wasn’t supposed to happen! That smell, that texture it’s all wrong. That’s right, you made a mistake with the wood shavings! You empty the pot, and start over. This has to be perfect.", parse);
	Text.NL();
	Text.Add("The next attempt fails because of the cat whiskers, the one after that you use the wrong kind of water. Failures continue time after time, as your mistakes become more and more basic.", parse);
	Text.NL();
	Text.Add("You are still mumbling to yourself about the right count of stirs when you wake up, feeling vaguely frustrated at your dreamed incompetence.", parse);
}

Scenes.Dreams.UruChoice = function() {
	var parse = {
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockDesc : function() { return player.FirstCock().Short(); },
		cockDesc2 : function() { return player.AllCocks()[1].Short(); },
		vagDesc : function() { return player.FirstVag() ? player.FirstVag().Short() : player.Butt().AnalShort(); }
	};
	
	Text.Add("Your skin crawls with the overspill of enormous magical forces, as you suddenly feel a hot breath of dry air blow against your back. Spinning around, you see the shapely form of Uru just a few steps away, with the bright edges of a portal behind her.", parse);
	Text.NL();
	Text.Add("<i>“Look what I made, pet!”</i> the omnibus purrs, grinning. <i>“And I thought to myself ‘what could possibly be more fitting than visiting the person who made it all possible?”</i> She takes a step towards you, caressing your cheek, her thumb brushing the corner of your mouth.", parse);
	Text.Flush();
	
	//[Resist][Support her]
	var options = new Array();
	options.push({ nameStr : "Resist",
		func : function() {
			Text.Clear();
			Text.Add("You shout defiance at the demon, and jump back, preparing to fight. And in an instant before you can really get ready, she’s stripped you of your weapons and armor, leaving all your belongings in a messy heap behind her.", parse);
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
			Text.Add("The demonic goddess has no mercy for you, however, as she begins bouncing on you, while her insides pulsate, and massage, tearing against your self control. Within minutes, you find yourself plunging over the edge, your [multiCockDesc] exploding inside her, coating her soaking wet insides in an extra layer of fluids.", parse);
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
		Text.Add("Sharp teeth dig into your flesh, and the sensation is almost a relief after the abuse Uru inflicted. As you feel your throat tear, gasping for breath, and feeling a sense of nauseous relief, you sit up and open your eyes, awake at last.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	});
	
	return true;
}

Scenes.Dreams.UruRun = function() {
	var parse = {
		
	};
	
	Text.Add("You are running, haunted by flickering shadows and an all-encroaching fire. Loud cackles mock you as your feet patter across the dry, cracked desolation. You don’t dare to turn your head around even for a second, assured that your pursuers would catch you immediately if you do. The feeling of flames licking your back playfully further enforces this idea.", parse);
	Text.NL();
	Text.Add("<i>”Scuttering like ants, back and forth, round and round you go!”</i> Glancing up, you see Uru, the hermaphrodite demoness, hovering lazily above you, a wicked smile on her dark lips. <i>”Hurry now, or they’ll catch you,”</i> she zips in front of you, urging you forward into her arms. Those perfectly formed arms. The demon is truly breathtaking, her flawless red skin shiny beneath the glaring sun. Her toned muscles emphasize her hourglass figure, her large breasts jiggle enticingly as she touches them seductively. Between the demon’s legs, her girthy girlcock juts out towards you, stiff and dripping pre.", parse);
	Text.NL();
	Text.Add("Her alluring face is framed by her long black hair, and crowned by her long demonic horns. Below her dark eyes and cute nose, her gaping maw is filled with sharp teeth. Suddenly, you realize that you have been running in the wrong direction the entire time.", parse);
	Text.NL();
	Text.Add("You wake up with a cold sweat, happy to once again be firmly entrenched in good old reality.", parse);
}

Scenes.Dreams.AriaTemple = function() {
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

Scenes.Dreams.RosalinNursing = function() {
	var parse = {
		
	};
	
	Text.Add("You wake up in a bed, feeling very ill. Confused, you glance around at the white, featureless room, but find that you are unable to move, or even turn your head. There is a thin sheet of white cloth covering you lower body.", parse);
	Text.NL();
	Text.Add("<i>”You are awake! Good, good!”</i> In the corner of your eye, you see a manically grinning catgirl with teal hair, holding a tray filled with bottles of strange colors and shapes. <i>”I was afraid you wouldn’t make it for a while, that stubbed toe looked so bad,”</i> Rosalin tuts, placing the tray near you. <i>”I’m sure you’ll just love your new body though!”</i> She throws back the sheets, revealing that your entire lower body has been replaced with a large, squirming snake. Unlike a regular naga though, this one still has a head, and it doesn’t look very happy with the situation. It hisses uncertainly at you.", parse);
	Text.NL();
	Text.Add("<i>”Now now, don’t be that way, you still have a long way to recovery!”</i> The insane alchemist hums as she pours all of her bottles into a large pot. The concoction begins to boil, spluttering green, acidic drops that begin to rapidly eat through the floor. Picking up two cups, she fills them with the deadly solution and stalks closer, to the growing horror of both you and the snake.", parse);
	Text.NL();
	Text.Add("You wake up in a cold sweat, solemnly promising to never get sick while in the same country as Rosalin.", parse);
}

Scenes.Dreams.RosalinTransformation = function() {
	var parse = {
		skinDesc : function() { return player.SkinDesc(); }
	};
	
	Text.Add("You are sitting at a bar, drinking some tasteless, colorless liquid and chatting with a cute catgirl sporting teal hair. Dimly, you recognize her as Rosalin, the enterprising alchemist you met at the nomads’ camp. The girl is ordering small shots of drinks you’ve never heard of in rapid succession, downing each one as soon as it is put in front of her.", parse);
	Text.NL();
	Text.Add("As you talk to her, you notice that she starts to change, her form wavering and twisting, though somehow always remaining recognizably Rosalin. The catgirl looks unconcerned as her tail grows large scales, expanding behind her like a monstrous snake, already a dozen feet long. She puts her hand on yours, her newly acquired feathers tickling your [skinDesc] lightly. You look deeply into the girl’s four insectoid eyes, admiring her feral beauty.", parse);
	Text.NL();
	Text.Add("Not technically a girl any longer, as your gaze flits downwards, noticing a brace of animalistic cocks sprouting from between her four pairs of legs. She still has her great tits though, all three rows of them.", parse);
	Text.NL();
	Text.Add("Your date goes smoothly, though by this point Rosalin has a bit of trouble reaching down to the bar disk due to the gargantuan size of her arachnid abdomen. Taking pity on her aimless grasping, trying to reach past her enormous bust, you grab her next shot and offer it to her. The alchemist smiles gratefully, downing the drink quickly.", parse);
	Text.NL();
	Text.Add("With a sudden pop, your companion disappears, leaving only a tiny white mouse in her place.", parse);
	Text.NL();
	Text.Add("What an odd dream, you think to yourself as you wake.", parse);
}

Scenes.Dreams.GwendyBarn = function() {
	var parse = {
		boyGirl : player.mfTrue("boy", "girl")
	};
	
	Text.Add("This day looks like it’s going to be much like any other day in your life, you think to yourself, thoughtfully chewing your food. You smile fondly as your mistress climbs down from the loft where she sleeps, throwing her long blonde braid over her shoulder as she surveys the barn. Gwendy tends to the other animals first, but you are not jealous. You know that you’re her prize specimen, and that the freckled farmgirl will spend extra time on you in the end.", parse);
	Text.NL();
	Text.Add("When the pretty girl finally reaches your pen, she ruffles your hair fondly, murmuring that you are such a good [boyGirl], and how proud she is of you. You daze off as she combs you and refills your water, sounding excited as she speaks of the upcoming breeding season. Life is good.", parse);
	Text.NL();
	Text.Add("You wake up feeling a bit confused, mind still moving sluggishly.", parse);
}

Scenes.Dreams.FeraKittens = function() {
	var parse = {
		
	};
	
	Text.Add("You hear a loud knocking on your door. Trying to shrug off the last dregs of sleep, you hobble over to it, peering out blearily into the light. There is a short catgirl in a pink dress standing outside, a large box in her arms. It’s Fera, the assistant at the tailor’s shop, you realize. When you attempt to merrily greet her, she growls grouchily, thrusting the box toward you.", parse);
	Text.NL();
	Text.Add("<i>”Take responsibility!”</i> she demands loudly, glowering at you. Careful to not tick her off further, you open the box, looking down on a dozen innocent faces. Inside the box, there are kittens with spotted coats of brown, white and black. Your kittens, if Fera is to be believed. Somehow, she bulldozes you into accepting them, leaving you looking rather foolish when she turns on her heels and leave. You call after her, asking where she is going.", parse);
	Text.NL();
	Text.Add("<i>”To get the other five boxes, of course!”</i> she responds.", parse);
	Text.NL();
	Text.Add("You suddenly wake up, heart beating rapidly. Perhaps you should consider using preventatives.", parse);
}

Scenes.Dreams.MirandaJailed = function() {
	var parse = {
		herm : miranda.flags["Met"] >= 3 ? " herm" : ""
	};
	
	Text.Add("You are running through the deserted streets in the slums of Rigard, weaving between abandoned carts and overturned barrels. The muddy ground feels like it’s trying to drag you down, forcing you to move sluggishly. The guards are almost upon you, and there seems to be more of them down every side alley. Eventually, you realize that they are leading you on, herding you like prey by only leaving only one path of escape. You feel the noose tightening around your neck, but you have no choice but to run blindly forward.", parse);
	Text.NL();
	Text.Add("Rounding a corner, you run into the hunter, Miranda herself. The[herm] guardswoman gives you a predatory grin before she tackles you to the ground, driving all the air from your lungs. You can’t move even a fraction of an inch in her iron grip. The canine cop growls in your ear:", parse);
	Text.NL();
	Text.Add("<i>”Busted!”</i>", parse);
	Text.NL();
	Text.Add("Without further ado, you are hauled away to a grand court hall, with dozens of red-skinned imps acting as the jury. The grand judge is the dark succubus queen herself, Uru. <i>”Guilty! Guilty!”</i> the jury hollers. <i>”Guilty!”</i> the judge agrees smugly. Thus, you are dragged off to jail, given only the advice to never drop the soap. Miranda will be watching.", parse);
	Text.NL();
	Text.Add("You wake up, still uncertain what your crime was.", parse);
}

/*
Scenes.Dreams.Ocean = function() {
	var parse = {
		
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