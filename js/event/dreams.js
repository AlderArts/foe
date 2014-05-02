
Scenes.Dreams = {}

Scenes.Dreams.Entry = function() {
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
		
		scenes.Get();
		return true;
	}
	
	return false;
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