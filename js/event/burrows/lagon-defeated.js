
Scenes.Lagon.Defeated = {};

Scenes.Lagon.Defeated.RoomApproach = function() {
	var parse = {
		
	};
	
	party.location = world.loc.Burrows.LagonCell;
	world.TimeStep({minute: 15});
	
	Text.Clear();
	Text.Add("Decision made, you set off through the maze of tunnels leading out of the throne room. It doesn’t take long before you find yourself in front of Lagon’s new home; two bunnies stand watch beside an actual door, a surprisingly solid-looking thing set into one of the dug-out chambers.", parse);
	Text.NL();
	Text.Add("The guards give you a once-over, and then unlock the door and step aside, allowing you to slip through before they seal it shut behind you.", parse);
	Text.NL();
	Text.Add("Lagon’s cell is, by bunny standards, not that bad. A mattress laden with some pillows and blankets lays against one wall; all sport tears, clearly having been recovered from some garbage dump or other, but are clean and dry. On the opposite wall, a primitive basin of carved stone is filled with clean water, a small opening nearby clearly leading to a primitive toilet.", parse);
	Text.NL();
	Text.Add("Near the center of the room, a slightly lopsided table sits, and a few chairs next to it. One looks to have come from some noble’s house, with its high back and solid armrests, while another is notably larger. Judging by its... somewhat squashed appearance, you have a feeling that Vena uses that one.", parse);
	Text.NL();
	Text.Add("Pride of place goes to a large piece of broken glass, which has been placed against the wall as a makeshift mirror.", parse);
	Text.NL();
	Text.Add("Lagon is currently lounging on his seat, chin in his palm and idly drumming on an armrest with his fingertips. His ear twitches at the sound of his door opening and closing, and he looks towards you, trying to keep any interest from his face. When he sees you, he scowls bitterly.", parse);
	Text.NL();
	Text.Add("<i>“Oh. It’s you. What do you want?”</i> he growls.", parse);
	if(lagon.flags["Usurp"] & Lagon.Usurp.NiceFlag) {
		//Remove nice flag
		lagon.flags["Usurp"] &= ~Lagon.Usurp.NiceFlag;
		var first = !(lagon.flags["Usurp"] & Lagon.Usurp.NiceFirst);
		lagon.flags["Usurp"] |= Lagon.Usurp.NiceFirst;
		if(first) {
			Text.NL();
			Text.Add("You are a bit taken aback by the sudden change - last time you left him, you thought he was a changed bunny. You comment on this too: did those sons of his deny him the buttfuck he was craving so?", parse);
			Text.NL();
			Text.Add("<i>“What the hell are you talking about, moron?”</i> Lagon spits back. It seems to be genuine too, he really doesn’t remember…", parse);
			Text.NL();
			Text.Add("Huh. For some reason, the effects of your mental adjustments doesn’t seem to be permanent. Might be since it was a very short exposure. Either way, you can just reapply it if you want a less surly lagomorph to talk to and fuck.", parse);
		}
		else { //Repeat
			Text.Add(" It looks like the scepter’s little personality adjustment has worn off again. Figures. Ah well, Vena would probably protest a more long-term transformation anyway, even if it <b>is</b> for the better.", parse);
		}
	}
	Text.Flush();
	
	Gui.NextPrompt();
}

Scenes.Lagon.Defeated.Prompt = function() {
	var parse = {
		
	};
	
	var options = [];
	options.push({nameStr : "Sex",
		tooltip : Text.Parse("Put an end to Lagon's boredom and take him for a little romp in the hay.", parse),
		enabled : true,
		func : function() {
			Scenes.Lagon.Defeated.SexPrompt();
		}
	});
	//TODO
	/*
	options.push({nameStr : "",
		tooltip : Text.Parse("", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}
	});
	*/
	
	/*
	
	*/
	
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("You state that you're finished with Lagon now.", parse);
		Text.NL();
		Text.Add("<i>“Typical peasant. Get out of here and stop wasting my time then.”</i> ", parse);
		Text.NL();
		Text.Add("With pleasure. You unceremoniously turn your back on Lagon - you can <i>feel</i> his bitter gaze boring holes in it - and head back to door. You give it a good hard thump with your knuckles and the guards spring to let you out.", parse);
		Text.NL();
		parse["s"] = party.Num() > 2 ? "s" : "";
		parse["c"] = party.Num() > 1 ? Text.Parse(", your friend[s] following in your wake", parse) : "";
		Text.Add("Once Lagon’s door slams shut behind you, you promptly make your way back to Vena’s throne room[c].", parse);
		Text.Flush();
		
		party.location = world.loc.Burrows.Throne;
		world.TimeStep({minute: 15});
		
		Gui.NextPrompt();
	});
}


Scenes.Lagon.Defeated.SexPrompt = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	var first = !(lagon.flags["Usurp"] & Lagon.Usurp.JailSexFirst);
	lagon.flags["Usurp"] |= Lagon.Usurp.JailSexFirst;
	
	Text.Clear();
	if(first) {
		Text.Add("You’re here to have sex with him. Why else would you come? It’s not like he’s good for anything else these days.", parse);
		Text.NL();
		Text.Add("<i>“And why should I even bother giving a traitor like you the time of the day? You want to fuck? Go throw yourself into the Pit and stop wasting my time!”</i> He spits back.", parse);
		Text.NL();
		Text.Add("Seems like Lagon’s not going to be reasonable about this. Well, there’s only one way you’re going to get through to him.", parse);
		Text.NL();
		Text.Add("Before the scowling bunny can realize what you’re thinking, you surge forward and grab him. Your fingers fasten themselves around his arms and you lift him into the air. Lagon squawks in shock, squirming in your grip and cursing you with the filthiest language he can muster, but you easily keep ahold of him.", parse);
		Text.NL();
		Text.Add("You stride over to Lagon’s bed and then swing him through the air, literally throwing him into the mattress. The shock of impact forces the air from his lungs in a loud grunt, and you promptly fall atop him. One hand slaps down against his breastbone, leaning the whole weight of your body into his chest and keeping him fixed in place like a bug, capable only of wriggling feebly.", parse);
		Text.NL();
		Text.Add("<i>“Nnngh! Get off of me, you worthless peasant!”</i> he roars, wrapping his fingers around your wrist and trying to pry your hand off of him with all his might.", parse);
		Text.NL();
		Text.Add("He can’t even budge you an inch. Even by lagomorph standards, that’s kind of pathetic...", parse);
		Text.NL();
		Text.Add("Scowling, you snap at him to sit down and <b>shut up</b>. He needs to get it through his thick head that he’s not king around here, not anymore. What authority does he think he has left? It’s all in his head, a daydream - and one that you’re not going to let him cling to anymore.", parse);
		Text.NL();
		Text.Add("Because there’s only one person in charge here now. And that person is <b>you</b>. And you want <b>him</b>. So, he can either cooperate with you, and get some fun out of it in turn, like all good boys... or he can keep fighting, and you’ll <b>take</b> what you want out of him - no matter how rough you have to be in the process.", parse);
		Text.NL();
		Text.Add("Leaning down until you are face to face with him, you look him in the eyes, cold and unblinking, and ask if he understands you, your tone an icy hiss of menace.", parse);
		Text.NL();
		Text.Add("His grip tightens on your wrist, but after a few moments of silence, he eventually relaxes. <i>“F-fine!”</i> he says through gritted teeth. <i>“But mark my words, I’ll remember this. And when I’m back in my rightful place, I’ll hunt you down and turn you into the Pit’s meat toilet!”</i>", parse);
		Text.NL();
		Text.Add("You chuckle in his ear, and stage whisper that you’re counting on him remembering what you’re about to do. Lagon visibly fumes, but he makes no effort to fight back, and so you finally shift your weight off of him.", parse);
	}
	else {
		Text.Add("He should know, you tell him.", parse);
		Text.NL();
		Text.Add("Lagon lets out a sigh. <i>“To have sex with me?”</i> he says, with as much contempt as he can pack in those five words.", parse);
		Text.NL();
		Text.Add("Yes, it’s good to see that he’s finally learning his place.", parse);
		Text.NL();
		Text.Add("<i>“My place!? I’ll tell you where <b>my</b> place i-”</i>", parse);
		Text.NL();
		Text.Add("You silence him with a glare, and though you don’t say a word, Lagon quiets down.", parse);
		Text.NL();
		Text.Add("<i>“Bah! It’s a waste to say anything to a peasant like you.”</i> He gets up from his chair and makes his way to his bed. <i>“Let’s get this over with then.”</i>", parse);
		Text.NL();
		Text.Add("You just smirk, watching him as he goes. For all his tough talk, he knows his place. Besides, from the flash of pink between his thighs before he turned around, you know that he’s looking forward to this despite himself.", parse);
		Text.NL();
		Text.Add("", parse);
	}
	Text.NL();
	Text.Add("With Lagon now safely settled in his bed, you quickly remove your [armor] and cast it onto the table in the center of the room. Now naked, you look over the nude form of the fallen tyrant and lick your lips, trying to decide what you’re going to do with him.", parse);
	Text.Flush();
	
	var options = [];
	
	/* TODO
	options.push({nameStr : "",
		tooltip : Text.Parse("", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}
	});
	*/
	
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("Shaking your head, you turn from the bed and head back to where you left your [armor], slowly pulling it back on without saying a word to the lapine still waiting on the bed.", parse);
		Text.NL();
		Text.Add("Lagon scoffs at you. ", parse);
		if(lagon.flags["Usurp"] & Lagon.Usurp.JailSexed)
			Text.Add("<i>“Not going through with it? Lost your nerve? How disappointing...”</i>", parse);
		else
			Text.Add("<i>“Is that it? After all that show you’ll simply walk away? So besides a traitor, you’re also a coward. What a disappointment...”</i>", parse);
		Text.NL();
		Text.Add("You throw a smirk over your shoulder, quipping back that you thought Lagon would much rather spend some quality time alone with his hand again. After all, that’s his favorite playmate, now isn’t it?", parse);
		Text.NL();
		Text.Add("He scowls at you, but remains otherwise silent.", parse);
		Text.Flush();
		
		Scenes.Lagon.Defeated.Prompt();
	});
}

Scenes.Lagon.Defeated.Punishment = function() {
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	party.location = world.loc.Burrows.Pit;
	
	Text.Clear();
	Text.Add("With the lapine queen leading you, it doesn’t take long for you to arrive at the warren’s central orgy room - the Pit. As she leads you out of one of the tunnels and onto the floor, you surreptitiously steal a look at your surroundings.", parse);
	Text.NL();
	Text.Add("Whilst the scent of sex still permeates everything - and probably won’t ever come out, at this point - the chamber actually looks a lot cleaner than usual. The bunnies must have given the place some sort of scrub down in preparation.", parse);
	Text.NL();
	Text.Add("As usual, the Pit is filled with lagomorphs - unusually, though, they’re not preoccupied with fucking their brains out. Oh, countless pink rabbit cocks salute you and Vena as you pass, and the dim light catches off of strings of drying cum plastered around mouths, on tits, or seeping from under tails and between thighs. But nobody’s screwing anybody at the moment. Instead, they all watch as their mother-queen strides past, eager to see what will happen.", parse);
	Text.NL();
	Text.Add("The audience just keeps getting bigger and bigger, and for the first time you have some understanding of just how <b>large</b> Vena and Lagon’s brood has grown. Maybe the crazy king’s plans of conquest weren’t so far-fetched after all...", parse);
	Text.NL();
	Text.Add("Your thoughts are stolen as one of Vena’s guards scurries up to her. She leans down to help it whisper into her ear, and then nods her understanding. You watch quietly as she regally strides to the center of the Pit, her own massive cock swishing hypnotically as she walks, dainty tail twitching atop her impressive butt cheeks.", parse);
	Text.NL();
	Text.Add("<i>“Children, long has your father held our home under his tyrannical rule, and today we gather here to judge him for his crimes against his own family.”</i>", parse);
	Text.NL();
	Text.Add("There’s some chatter between the lagomorphs, a few of the less interested ones leave the Pit, supposedly to find another place where they can continue fucking in peace.", parse);
	Text.NL();
	Text.Add("<i>“To preside over this trial, I’d like to call the hero who has defeated my husband, ending his tyrannical rule, and healed me from my drugged state. Please, let’s all give a round of applause to [playername], champion of the lagomorphs!”</i>", parse);
	Text.NL();
	Text.Add("Small hands suddenly shove hard against ", parse);
	if(player.IsTaur())
		Text.Add("your [butt]", parse);
	else
		Text.Add("the small of your back", parse);
	Text.Add(" and you instinctively stumble forward, pushed from the comparative anonymity of the rim to join Vena. The air rumbles like thunder as countless lapine hands enthusiastically clap together, lead in their applause by Vena herself.", parse);
	Text.NL();
	Text.Add("Recovering your dignity, you try and offer a regal wave to the assembly of clapping bunnies, even as a few appreciative cheers and whistles of approval start to add to the din. Now standing beside Vena, the matriarch leans slightly towards you to speak to you.", parse);
	Text.NL();
	Text.Add("<i>“Err… sorry for putting you on the spot like that.”</i>", parse);
	Text.NL();
	Text.Add("Smiling broadly, you keep waving to the crowd, even as you assure Vena that it’s alright.", parse);
	Text.NL();
	Text.Add("<i>“You don’t mind doing this, do you?”</i>", parse);
	Text.NL();
	Text.Add("You concede that it is a little overwhelming, but if she really thinks you need to be shown off to them first, then you understand. Besides, it’s probably the best way to get them into an appreciative mood for what’s to come.", parse);
	Text.NL();
	Text.Add("Vena turns to one of her guards. <i>“Bring in my husband.”</i>", parse);
	Text.NL();
	Text.Add("You watch as the guard nods solemnly, and then darts off towards Lagon’s makeshift cell.", parse);
	Text.NL();
	Text.Add("As the thunderous applause dies down, the guards soon return, the thick crowd parting like water to make a clear path for the prisoner being led along at spearpoint. With the power of his scepter taken from him, and the potions cleared from his system, Lagon has shrunk down to a more typical size for a lagomorph. Indeed, you think he’s on the short side even by their standards - Vena utterly dwarfs her husband, now. But the sheer hate burning in his eyes makes his children recoil, even if his uncanny strength is a thing of the past.", parse);
	Text.NL();
	Text.Add("With only slight trembles betraying them, the guards guide the tired, bitter-looking lapine to the center of the Pit. One bold soul darts forward and kicks Lagon squarely in his rear, knocking his father to his knees. Lagon turns to face his assailant, growling like a beast as he glowers at his son, but a swift poke with a speartip has him turning back to Vena.", parse);
	Text.NL();
	Text.Add("He’s still full of spite and viciousness... but that’s all he’s got left. He’s visibly drained, his powers are gone, and he’s outnumbered easily by a thousand to one. He’s nothing, now.", parse);
	Text.NL();
	Text.Add("<i>“Look what we have here. This is really cute, but don’t you think it’s about time you stopped this charade, Vena? If you give up now and release me, I promise to spare you. In fact, if you stop this farce you call a trial right now, I’d be happy to fuck you all you want. We both know what you are Vena, and how much you love it when you get used.”</i>", parse);
	Text.NL();
	Text.Add("Vena is unfazed by the former King’s taunting words. She takes a deep breath and steps closer to her husband, gently taking his chin in her hand and lifting his face to look up into her eyes. Looking at her, you don’t see a speck of anger; all you see is sadness.", parse);
	Text.NL();
	Text.Add("Lagon growls angrily at that, trying to lose her grip on his chin to no effect. <i>“How dare you, slut! You dare pity me? <b>Your</b> king!?”</i> He finally manages to free himself and looks to address the crowd. <i>“Have all of you lost your fucking mind!? I am Lagon! Your father! Your king! I order you all to stop this act this instant and imprison this slut!”</i>", parse);
	Text.NL();
	Text.Add("Despite his words, not a single lagomorph moves to do as he says. You do note a few of them seem to have visibly shrunk at his words, but they remain otherwise still as he barks like a cornered dog.", parse);
	Text.NL();
	parse["bastardBitch"] = player.mfTrue("bastard", "bitch");
	Text.Add("He then turns to look at you. <i>“And <b>you</b>! You traitorous [bastardBitch]! You, I will never forgive!”</i>", parse);
	Text.NL();
	Text.Add("You just smirk back; Lagon doesn’t frighten you, not in the sorry state he is now.", parse);
	Text.NL();
	Text.Add("Next, he turns to one of the guards. <i>“Arrest them!”</i> The guard looks down at the former King, then up at Vena.", parse);
	Text.NL();
	Text.Add("She simply shakes her head, approaching him and grabbing him by the muzzle, holding it shut as she speaks. <i>“That’s enough, honey. You’re only going to shame yourself further if you keep doing this. Stay quiet and face the punishment for your actions. I wish there was something I could do for you, but you brought this upon yourself.”</i>", parse);
	Text.NL();
	Text.Add("She releases him and looks at a nearby guard. <i>“If he speaks out of order again, shut him up for us, okay dear?”</i> The guard nods and grabs his father’s shoulder, giving him a warning squeeze. Vena takes another deep breath then turns to look at you with a slight smile. <i>“Champion, would you start the trial, please?”</i>", parse);
	Text.NL();
	Text.Add("You nod your acceptance and then turn to face Lagon, taking a deep breath as you muster your thoughts. You know what’s going to happen in the end, but why not make this look good, right? In your best formal voice, you officially declare that Lagon is charged with the crimes of treason, domestic abuse, and unlawful aggression.", parse);
	Text.NL();
	Text.Add("To wit, for the charge of treason; he betrayed his wife to steal the scepter and make himself king of the Burrows, then using alchemy to damage his wife’s mind, reducing her to an empty-minded cum-vessel.", parse);
	Text.NL();
	Text.Add("For the charges of domestic abuse, you elaborate how he has experimented upon his wife and his children with alchemical concoctions, without any concern for their health, safety or consent. He has physically and emotionally abused his children, to the point that at least one child ran away from home rather than suffer his touch anymore, and blackmailed another into helping his experiments by threatening harm to his wife.", parse);
	Text.NL();
	Text.Add("Finally, on the charge of unlawful aggression, he has sought to force his children to assume the role of an army, with intent to unleash this army upon his neighbors, without any justification beyond the desire for conquest.", parse);
	Text.NL();
	Text.Add("<i>“These are all terrible crimes. What do you have to say for yourself, honey?”</i>", parse);
	Text.NL();
	Text.Add("Lagon bursts out laughing. <i>“You’ve got to be joking! Really, this is priceless, but you can stop now. I’ve had enough, so get on with it! The sooner this is over, the sooner I can go back to pounding your pussy, ‘honey’,”</i> he says, voice dripping with venom.", parse);
	Text.NL();
	Text.Add("<i>“Very well, I will now declare your sentence.”</i> Vena turns to look at you. <i>“[playername]?”</i>", parse);
	Text.NL();
	Text.Add("In the same tone as before, you observe that many others would have counseled for Lagon’s exile, his transformation into an alchemically engineered cum-dumpster like his wife once was, or even his execution.", parse);
	Text.NL();
	Text.Add("You pause a moment, waiting to observe the reactions of the crowd and Lagon alike. There’s some hushed whispers between the lagomorphs gathered. You draw attention back to you with a firm, crisp declaration, continuing that despite the severity of Lagon’s crimes, his wife has pleaded for mercy.", parse);
	Text.NL();
	Text.Add("<i>“Typical...”</i> Lagon says, rolling his eyes.", parse);
	Text.NL();
	Text.Add("As imperiously as you can, you declare Lagon’s punishment will be a public fucking, to be carried out here in the Pit once sentencing is complete. After it is ended, the former King shall be placed under indefinite house arrest; he will be secured in a private chamber within the Burrows, guarded by Vena or those she chooses to entrust with the responsibility. Henceforth, he shall remain there, unless Vena deigns to escort him elsewhere.", parse);
	Text.NL();
	Text.Add("Lagon can barely contain his laughter once you give him his sentence. <i>“A public fucking!? Really!? This is hilarious!”</i> He laughs out loud. <i>“Fine then! Who do I have to fuck?”</i> he asks, still laughing.", parse);
	Text.NL();
	
	var p1cock = player.BiggestCock(null, true);
	player.subDom.IncreaseStat(10, 5);
	
	if(p1cock) {
		Text.Add("Smirking knowingly, you turn to Vena and casually ask if you can have first dibs on Lagon’s ass, or if she wants the honor of popping her husband’s black cherry.", parse);
		Text.NL();
		Text.Add("<i>“Wait, <b>what</b>!?”</i> Lagon yelps.", parse);
		Text.NL();
		if(p1cock.isStrapon) {
			Text.Add("<i>“I suppose I would have to do it, since you’re not really equipped for this kind of work.”</i>", parse);
			Text.NL();
			Text.Add("You clarify that you have a handy little toy just made for situations like this. Won’t be quite as messy as hers, but it’ll get the job done just fine.", parse);
			Text.NL();
			Text.Add("<i>“In that case, feel free to do the honors!”</i> She smiles. <i>“Or if you’d rather not get involved, I’m prepared to shoulder the task.”</i>", parse);
		}
		else {
			Text.Add("Vena looks in thought for a second. <i>“Hmm, I’ll let you decide, [playername]. To be honest, I’m not sure I’m very comfortable using my cock, so I would prefer if you did the honors; if you don’t feel like it, I’d be happy to fill my husband’s ass for you,”</i> she replies with a smile.", parse);
		}
		Text.Flush();
		
		var options = [];
		//[PC fuck] [Vena fuck]
		options.push({nameStr : "PC fuck",
			tooltip : Text.Parse("How can you pass up the chance to humiliate Lagon again?", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("With a hungry smile, you tell Vena that you’d like to do the honors.", parse);
				Text.NL();
				Text.Add("Vena nods and steps aside so you can approach the baffled lagomorph.", parse);
				Text.NL();
				Text.Add("<i>“What is the meaning of this! I’m not-”</i>", parse);
				Text.NL();
				Text.Add("You snap for Lagon to shut up. He’s not getting out of this, and frankly he’s had this coming for a long time. Now, he can either bend over and try to enjoy it, or fight and make it hurt. Either way, he’s getting fucked.", parse);
				Text.NL();
				
				player.subDom.IncreaseStat(100, 4);
				
				Scenes.Lagon.Defeated.PunishmentPC();
			}
		});
		options.push({nameStr : "Vena fuck",
			tooltip : Text.Parse("There’s just too much delicious irony to turn up the chance to watch Vena dicking her husband for once.", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("With a mischievous smirk and a courtly bow, you ask Vena to do the honors. It would mean so much more if she did it.", parse);
				Text.NL();
				Text.Add("<i>“As you wish!”</i> She smiles happily, sashaying towards Lagon.", parse);
				Text.NL();
				Text.Add("<i>“What’s this!? Vena! I order you to stop this instant or I’ll-”</i>", parse);
				Text.NL();
				Text.Add("<i>“Save it, honey. It’s time for you to pay for your crimes!”</i>", parse);
				Text.NL();
				
				Scenes.Lagon.Defeated.PunishmentVena();
			}
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("With mischievous delight, you turn to Vena and tell her that the trial has ended; she may commence to fucking her husband’s ass whenever she feels ready.", parse);
		Text.NL();
		Text.Add("<i>“Thank you, [playername].”</i> Vena smiles.", parse);
		Text.NL();
		Text.Add("<i>“What!?”</i> Lagon exclaims. Even though his white fur, you’re pretty sure you see him go pale at the revelation.", parse);
		Text.NL();
		Text.Add("Vena giggles as she sashays towards him, gently grabbing his chin and moving his head to look up at her. <i>“What’s the problem, honey? Surely, you didn’t think you would be the one pitching?”</i>", parse);
		Text.NL();
		
		Scenes.Lagon.Defeated.PunishmentVena();
	}
}

Scenes.Lagon.Defeated.PunishmentPC = function() {
	var p1cock = player.BiggestCock(null, true);
	var strapon = p1cock.isStrapon;
	
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Add("As you impatiently start pulling your [armor] from your frame, the panicked lagomorph tries to make a break for it, scrambling away on all fours like an animal in an effort to avoid his imminent dicking.", parse);
	Text.NL();
	Text.Add("Unfortunately for him, it’s no good. The guards block his path with their spears, keeping the deposed tyrant ringed in. As he tries to spot a way out, Lagon is blind to Vena coming from behind. The milfy she-brute bunny pounces on him, her considerably greater size and strength allowing her to pin him effortlessly to the floor.", parse);
	Text.NL();
	Text.Add("<i>“Gah! Get off me!”</i> he protests.", parse);
	Text.NL();
	Text.Add("With Vena having the situation well in hand, you leisurely resume removing your gear. ", parse);
	if(player.Slut() < 30)
		Text.Add("It’s embarrassing to be naked in front of so many hungry eyes, but somehow you manage to go through with it. You need to play your part in this... and, who are you kidding? You <b>want</b> this, or you wouldn’t have said yes to the offer.", parse);
	else
		Text.Add("You can feel the hungry stares from your lapine audience, and you smirk to yourself as you slowly peel off your things. You always did like having an audience, and where are you ever going to have one so large and appreciative of your... <i>talents</i>?", parse);
	Text.NL();
	Text.Add("Soon enough, you are naked as the day you were born, ready for the next step. ", parse);
	if(strapon)
		Text.Add("You fix your [cock] into place around your nethers, making sure it’s locked in good and tight,", parse);
	else
		Text.Add("You reach down and clasp[oneof] your cock[s] and start to pump, caressing yourself until you’re decently hard,", parse);
	Text.Add(" and then strut forward to join the wrestling rabbits. As you approach, you can spot something bobbing between Vena’s thighs, her monstrous maleness more than half-erect itself, and can’t resist the mischievous urge to ask Vena if she’s <i>sure</i> she doesn’t want to be the one fucking her husband this time.", parse);
	Text.NL();
	Text.Add("<i>“Yes, I’m sure. Don’t worry about me, [playername]. Just tell me when you’re ready and I’ll let you handle my husband.”</i>", parse);
	Text.NL();
	Text.Add("<i>“No one’s going to handle me! Let go, you stupid cunt!”</i> he protests.", parse);
	Text.NL();
	Text.Add("Ignoring Lagon’s vulgarity, you finish stepping over to Vena. Conversationally, you ask her if she wouldn’t mind preparing your [cock] for Lagon... that is, if she thinks he deserves it. Could always take him dry if she prefers.", parse);
	Text.NL();
	Text.Add("<i>“Oh, no. I’d be happy to take care of that for you!”</i> she replies eagerly, turning to her guards. <i>“My darlings, would you please hold on to your daddy for mommy?”</i> The guards nod and immediately move to pin the former King with a firm foot on his back.", parse);
	Text.NL();
	Text.Add("<i>“Gah! Let me go, you traitors!”</i>", parse);
	Text.NL();
	Text.Add("<i>“Oh, and keep him quiet, please?”</i> Vena adds, and the guards comply, gagging the king.", parse);
	Text.NL();
	Text.Add("As the kneeling bunnyzon turns back to you, you proudly present her with your [cock], patiently waiting for her to get started. Vena licks her lips and opens her muzzle, extending her tongue like a red carpet ready to welcome you into her maw.", parse);
	Text.NL();
	Text.Add("Without a second’s hesitation, you guide yourself into Vena’s open mouth. You can’t resist the thought that this would probably be icing on the humiliation cake if Lagon was emotionally capable of giving a fuck what Vena does.", parse);
	Text.NL();
	parse["c"] = strapon ? "sopping wet" : "at full mast and dripping pre";
	Text.Add("The lagomorph queen licks you with the unparalleled expertise that only someone who’s spent days sucking cocks is capable of. In moments, she has you [c]. She gives your [cockTip] a parting kiss before she stops, satisfied with her work.", parse);
	Text.NL();
	Text.Add("<i>“I think that’s enough?”</i>", parse);
	Text.NL();
	Text.Add("Taking a moment to admire the shine of your literally spit-polished cock, you nod your agreement and thank her for her efforts.", parse);
	Text.NL();
	Text.Add("<i>“Umm, before you start, maybe I should give my poor husband some help? I think you’re his first...”</i>", parse);
	Text.NL();
	Text.Add("As tempting as it is to say otherwise, you decide to be merciful - more for Vena’s sake than for Lagon’s. With an understanding smile, you graciously tell Vena that she can go and help Lagon however she wants to.", parse);
	Text.NL();
	Text.Add("<i>“Okay!”</i> She crawls towards Lagon’s rear end and grabs his butt cheeks, spreading them so she can gaze at his virginal asshole. There’s a muffled groan of protest from the former King as she does this.", parse);
	Text.NL();
	Text.Add("<i>“Yep, you’re going to be his first. Try not to be too rough on him; we don’t want to hurt him. Oh, and while I’m busy here, feel free to play with me back there,”</i> she says wiggling her hips. <i>“I’m sure my juices would make for better lube,”</i> she adds, before diving into her task.", parse);
	Text.NL();
	Text.Add("Lagon lets out a muffled cry of protest as he feels Vena’s tongue probe his ass, but it quickly turns into a moan as she begins truly rimming him.", parse);
	Text.NL();
	if(player.Slut() < 30)
		Text.Add("That’s an invitation you find hard to refuse. Besides that, it’s only fair Vena gets a bit of fun out of this too, no?", parse);
	else
		Text.Add("Mmm, now that’s an offer you can get behind. There’s just something delicious about the idea of taking wife and husband together, particularly when all their kids are watching you do it.", parse);
	Text.NL();
	Text.Add("As Vena busies herself eating out her husband’s ass, you approach from behind. As you run a finger along your slickened shaft, grinning in anticipation, you savor the opportunity to appreciate the view.", parse);
	Text.NL();
	Text.Add("Vena has proportions that would put any model to shame. She’s got wide flanks, a very spacious butt, thighs that are simply to die for, and strong, svelte legs tipped by surprisingly dainty feet, for a bunny anyway. Taking a closer look, you see that the lagomorph queen’s folds are puffy and dripping with anticipation, a clear sign she’s really looking forward to what you’ll do next, and since you hate to disappoint, you grab her motherly hips and align your [cock] with her entrance.", parse);
	Text.NL();
	Text.Add("She wiggles her hips in further invitation, bucking back just a little to let you know she can’t wait. You have no doubt that if her mouth weren’t otherwise occupied, she’d be making all kinds of cute noises too.", parse);
	Text.NL();
	Text.Add("Eager to please, you start to feed yourself inside of her. Warm, dripping wet folds spread effortlessly in welcome, the matriarch’s well-trained twat almost literally swallowing you down. After your first push, it feels like you don’t have to do anything; you can feel her petals rippling around your [cock], drawing you deeper inside until you bottom out.", parse);
	Text.NL();
	
	Sex.Vaginal(player, vena);
	vena.FuckVag(vena.FirstVag(), p1cock, 3);
	player.Fuck(p1cock, 3);
	
	Text.Add("Even with her mouth occupied, you can hear Vena’s moan of pleasure; this is truly what she lives for, and you’re happy to oblige. Squeezing her generous curves for leverage, you start to draw back, almost audibly squelching as you pull against the suction of her rapacious cunt.", parse);
	Text.NL();
	Text.Add("Only when the very tip of your dick remains inside, teasing the lusty lapin with its presence, do you thrust home again, a single, swift push that sees you smacking into her rump as you bottom out again.", parse);
	Text.NL();
	Text.Add("A shiver of pleasure visibly ripples along Vena’s spine, her wooly tail twitching happily, and you gladly start the cycle over again. Pull out, thrust, and pull out again; you slam yourself home without hesitating. Vena takes it all like a champ, her slavering pussy slurping obscenely as you stir her folds. Even as your hips pound away on pure autopilot, your gaze sweeps across the room.", parse);
	Text.NL();
	Text.Add("All around you, bunnies are staring transfixed as you fuck their queen-mother, filling the air with a chorus of appreciative sighs and squeaks as they drink in the sight. Some are so heated up that they’re actually starting their own little gangbangs, but most are content to just enjoy the show.", parse);
	Text.NL();
	
	world.TimeStep({minute: 30});
	
	if(!strapon) {
		Text.Add("Soon, though, you have no attention to spare for your audience. Vena’s cunt milks away at you like a champ, the velvety touch of her petals threatening to scatter your wits and melt you into a puddle of mush.", parse);
		Text.NL();
		parse["b"] = player.HasBalls() ? Text.Parse(", pressure welling in your [balls]", parse) : "";
		Text.Add("You can feel the tension curling along your spine[b], and you know that you can’t hold it in much longer. From the strangled gasps and groans echoing from your partner, undercut by the obscene slapping as her own cock bounces against her belly, neither can Vena.", parse);
		Text.NL();
		Text.Add("You know that Vena would just love it if you were to give her ever-thirsty womb a good hosing of man-milk... but doing that means you have less cum to fill Lagon with, and drive his humiliation in good and hard.", parse);
		Text.NL();
		Text.Add("Decisions, decisions... but you better make your choice fast; you can’t hold it off much longer!", parse);
		Text.Flush();
		
		var options = [];
		//[Cum] [Don’t cum]
		parse["guygirl"] = player.mfTrue("guy", "girl");
		options.push({nameStr : "Cum",
			tooltip : Text.Parse("You’ve got plenty of dick-cream to spare for Lagon; fill Vena with your cum and let Lagon see how a real [guygirl] does it!", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("More than confident in your capabilities, you see no reason to rob yourself of any pleasure, nor Vena for that matter. With your concerns squashed, you allow yourself to thrust away with reckless abandon, feeling your control fraying thinner and thinner.", parse);
				Text.NL();
				Text.Add("Caught up in your need to breed, you bury yourself as deeply into Vena as you possibly can and let yourself go. Sparks fill your vision, nerves afire with pleasure as you allow yourself to erupt into her waiting snatch, thick jets of seed pouring towards her greedy womb.", parse);
				Text.NL();
				
				var cum = player.OrgasmCum();
				
				if(player.Slut() < 30)
					Text.Add("In between the shudders of pleasure, you manage to muster a spark of concern; what if you get her pregnant? Then you brush it aside as meaningless; Vena wouldn’t care if you did, and really, what are a few more bunnies? Besides, a little freshening to the gene pool will do them some good.", parse);
				else
					Text.Add("The thought of your seed reaching Vena’s anxious eggs, filling her belly with a great big litter of baby bunnies, only fuels your delight. You want to see her huge with your young, the living proof that you’re a better lover than Lagon in <b>every</b> way that matters.", parse);
				Text.NL();
				Text.Add("The feeling of your [cock] pumping your baby batter deep into her hungry cunt is all the stimulation the lapine matron can take. With a squeal of pleasure, she climaxes.", parse);
				Text.NL();
				Text.Add("Caught in folds like a velvet-lined vice, you are trapped, helpless to do anything other than moan your pleasure as Vena’s cunt greedily takes all you have to give, and then some. With practiced ease, she ripples around your shaft, literally milking you as she clenches and releases, coaxing more spurts of cum into her depths.", parse);
				Text.NL();
				Text.Add("Only when she has had enough, her own orgasm having faded, does she release her death grip on your cock. Panting with the effort, you slowly pull your tender manhood away from her cunt, hissing softly as the cool air hits the overheated flesh.", parse);
				Text.NL();
				Text.Add("Once you have staggered upright, you can take in the sight of what you’ve done, and you smile proudly. A great puddle of mixed juices spreads under Vena’s soft belly, reaching up past her arms to where her husband has been pinned down throughout your efforts at making love to his wife. Her folds gape obscenely, temporarily molded into a perfect shape for your cock, and tiny streams of your seed ooze from between her quivering petals to drip down into the slick beneath her.", parse);
				Text.NL();
				Scenes.Lagon.Defeated.PunishmentPCCont(true);
			}
		});
		options.push({nameStr : "Save it",
			tooltip : Text.Parse("Vena might be disappointed, but you want to give Lagon a stuffing he’ll remember for the rest of his days.", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("The next time that you pull out, you hold there, breathing slowly and steadily in an effort to get yourself under control. Vena whimpers, squeezing down on your sensitive cock, but you have to take things carefully; you want to get her off too, you just want to make sure you don’t shoot your own load in the process.", parse);
				Text.NL();
				Text.Add("Once your heart no longer feels like it’s trying to beat its way out of your chest, you start to thrust again, slow and steady. You carefully angle your dick with each thrust, striving to hit the most sensitive spots you can find hidden amongst Vena’s folds. If you’re careful, precision will suffice.", parse);
				Text.NL();
				Text.Add("Vena certainly seems to appreciate your efforts; she moans and mewls, grinding back against your shaft. A spasm visibly ripples down her spine, and you quickly pull yourself free, just in the nick of time.", parse);
				Text.NL();
				Text.Add("Her pussy visibly grabs at the air where your cock was mere moments ago; clear fluids spill from between her folds. Lower down, Vena’s massive cock bulges and then explodes, a great gush of milky white seed pouring from its distended tip.", parse);
				Text.NL();
				Text.Add("Settling back out of spray radius - you hope - you watch in perverse amusement as Vena climaxes. Ropes of semen fountain from her cock and splash along the stone floor beneath her, droplets bouncing high enough to splatter her breasts as the fast-growing puddle spreads towards Lagon’s haunches. Female nectar spills down her folds, washing along her throbbing dick before dripping into the pooling fluids beneath her, making it flow back towards you.", parse);
				Text.NL();
				Text.Add("You can see Vena’s guards glancing at her growing mess, nervously smacking their lips, but miraculously their obedience outweighs their lust and they keep a tight grip on their father. Vena lets out a final, unladylike grunt and spills one last jet of cum into the pool, then goes limp with the blissful sigh of the truly sated.", parse);
				Text.NL();
				Scenes.Lagon.Defeated.PunishmentPCCont(false);
			}
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("Now, you might not quite be getting the same enjoyment out of this as Vena is. But the sight of her lovely rump jiggling as you pound her cunt, and the muffled sounds of pleasure escaping her otherwise occupied mouth are more than enough to keep you happy.", parse);
		Text.NL();
		Text.Add("All too soon, the meaty smack of hips is undercut by a new sound: the obscene wet slapping of the amazonian lagomorph’s clit-cock against her softly rounded belly. Each thrust and pull makes the monstrous male member bounce hard against her flesh, ensuring she can never be free of waves of pleasure rippling through her huge frame.", parse);
		Text.NL();
		Text.Add("You feel a shudder run through the lagomorph matriarch’s body. This combined with the increasingly desperate tone of her moans is all the indication you need of the queen’s impending orgasm.", parse);
		Text.NL();
		Text.Add("Spurred by the desperate need to see Vena cumming, you manage to muster up a burst of energy and start to really pound her cunt, thrusting with all your might, trying to grind the ever-elusive sweet spots as you do.", parse);
		Text.NL();
		Text.Add("This is all she can take; with a squeal of pleasure, you feel Vena’s pussy grab your [cock] in a vice-like grip, milking it for all it’s worth despite you not having anything to give. Her own cock veritably explodes cum onto the ground, painting it white as her seed pools below.", parse);
		Text.NL();
		Text.Add("Held fast by Vena’s cunt, you patiently sit and wait as she finishes emptying herself. Only when you feel the pressure slacken in her vice-like petals do you slowly pull yourself free and upright again. Even from here, you can see the massive pond of juices your efforts have produced, a thick swamp of cum that gently laps around Lagon’s feet, and you smile proudly at the result.", parse);
		Text.NL();
		Scenes.Lagon.Defeated.PunishmentPCCont(false);
	}
}

Scenes.Lagon.Defeated.PunishmentPCCont = function(came) {
	var p1cock = player.BiggestCock(null, true);
	var strapon = p1cock.isStrapon;
	
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Add("Vena stops her ministration and gets back on her feet, licking her lips as she tries to balance herself on wobbly knees. <i>“Wow, I wasn’t expecting you to get me off too. You really are our champion!”</i> she says playfully, giggling.", parse);
	Text.NL();
	Text.Add("Smiling modestly, you assure her that it was nothing.", parse);
	Text.NL();
	if(came) {
		Text.Add("<i>“And you gave me such a huge load too. You sure you got enough saved up for my dear husband?”</i>", parse);
		Text.NL();
		Text.Add("You hear a muffled protest from Lagon, still subdued by the guards.", parse);
		Text.NL();
		Text.Add("You assure her that you have more than enough for Lagon. If maybe not quite as much as she just got, greedy thing that she is.", parse);
		Text.NL();
		Text.Add("Vena giggles in response. <i>“If I get pregnant from this, I hope my babies will take after their father. I’m sure we could use more of you around.”</i>", parse);
		Text.NL();
		Text.Add("Grinning, you reply that you’d be just as happy if they took after her; more of her around would be even better.", parse);
		Text.NL();
		Text.Add("<i>“You’re such a flatterer, champion.”</i> She giggles. <i>“But we should be moving ahead; my husband is ready, and after such a wonderful fuck, I’m sure you are ready too.”</i>", parse);
		Text.NL();
		Text.Add("You readily agree... but there’s just one little thing to take care of before you can get to work. You point meaningfully at your cock, now flaccid and spent.", parse);
		Text.NL();
		Text.Add("<i>“Oh? Of course, I’d be happy to help you get back to full mast - if you let me.”</i>", parse);
		Text.NL();
		Text.Add("Smiling in anticipation, you tell her to go right ahead.", parse);
		Text.NL();
		Text.Add("The moment you give her consent, Vena unceremoniously drops to her knees, taking your [cock] in her hands and nestling it between her full bosom. She looks up at you with a smile, and wraps your shaft in her pillowy breasts.", parse);
		Text.NL();
		Text.Add("A shiver of pleasure runs up your spine at just the feel of warm, soft, fuzzy boobflesh wrapped around your cock. You eagerly nod your head, anxious to see what she can really do.", parse);
		Text.NL();
		Text.Add("Vena quickly begins moving up and down, bobbing on your hardening dick as she massages you with her luscious orbs. It only takes a moment before you’re hard enough for your tip to poke from the velvety valley of her mounds, and she eagerly takes the tip into her mouth, suckling softly.", parse);
		Text.NL();
		Text.Add("You don’t even try to fight the coo of pleasure that escapes you. Within seconds, you feel hard as you’ve ever been, your shaft thick and throbbing in the matriarch’s cleavage.", parse);
		Text.NL();
		Text.Add("Vena doesn’t seem intent on stopping though, she abandons her breasts to deepthroat you in a single go, swallowing around your dick to further stimulate you.", parse);
		Text.NL();
		Text.Add("Uh-oh! You call for Vena to stop, that she’s going to set you off again, but the lusty lapin is lost to you. You try again, and when she still ignores you, you physically push her away, your cock slipping from between her lips with a wet pop that seems to echo around the Pit. You take a deep breath, and then manage to calmly tell Vena that she’s done enough for you now.", parse);
		Text.NL();
		Text.Add("<i>“Sorry about that.”</i> She giggles. <i>“Go on then, my husband is waiting... and please, be gentle.”</i>", parse);
		Text.NL();
		Text.Add("You bite back the first response to come to you. After a moment’s hesitation, you manage to neutrally tell her that you’ll try.", parse);
	}
	else {
		Text.Add("<i>“It’s too bad you didn’t cum too, but I take it you wanted to save yourself for my dear husband?”</i>", parse);
		Text.NL();
		Text.Add("You hear a muffled protest from Lagon, still subdued by the guards. ", parse);
		if(!strapon)
			Text.Add("Smirking, you tell her that’s right; petting your cock, you assure her that you’ll give him a load that he’ll never forget.", parse);
		else
			Text.Add("Smirking, you tell her that while you can - and intend to - give him a proper reaming, she’ll have to provide filling herself. There’s bound to be plenty of opportunity in the coming days.", parse);
		Text.NL();
		Text.Add("<i>“Alright, I’ll be counting on you. Lagon should be ready for you now, but still… please be gentle.”</i>", parse);
		Text.NL();
		Text.Add("You bite back the first response to come to you. After a moment’s hesitation, you manage to neutrally tell her that you’ll try.", parse);
	}
	Text.NL();
	Text.Add("Vena steps aside, and you stalk purposefully towards the former tyrant of the Burrows. He growls and wriggles, but his children have him held fast. You stop just behind the prone lapine and reach down to fondle his rump. You casually comment aloud that it’s not much of an ass, not like his son Roa’s, but you’ll just have to make the best of it.", parse);
	Text.NL();
	Text.Add("The mention of Roa’s name is enough to make him growl even as the guards restrain him.", parse);
	Text.NL();
	Text.Add("You pay no mind to Lagon’s little temper tantrum, instead leaning down so that you can wrap your arms around his chest, hooking up under his shoulders. You nod to the guards, and then hoist up with all your strength once they’ve let their father go, pulling Lagon off the floor and into your lap as you unceremoniously flop down on the floor.", parse);
	Text.NL();
	Text.Add("Lagon wriggles and squirms, but you have him well and truly hooked. Your hands seize his wrists, forcing him into your lap. Smirking, you look over his shoulder, to better judge where he’s settled, when you spot something that makes you grin wickedly.", parse);
	Text.NL();
	Text.Add("Loudly and deliberately, pitching your voice so all the audience can hear it, you comment on what a slutty little bunny Lagon is; he’s already hard as a rock! Looks like having his wife’s tongue up his ass was something he’s always dreamed of...", parse);
	Text.NL();
	Text.Add("<i>“Shut your mouth, traitor! What do you think you know! You are nothing! That’s what you are!”</i> he rambles on.", parse);
	Text.NL();
	Text.Add("Smirking, you retort loudly that if he liked his wife’s tongue, then he’s going to love <i>this</i>... And with that, you reach down and clasp his ass firmly, hoisting him into the air so that you can align your [cock] with his virginal pucker, and then allow him to sink down onto it. The [cockTip] of your dick slips inside, and then he jerks to a stop, the tight ring refusing to spread any further.", parse);
	Text.NL();
	
	Sex.Anal(player, lagon);
	lagon.FuckAnal(lagon.Butt(), p1cock, 20);
	player.Fuck(p1cock, 20);
	
	Text.Add("<i>“Wha! No! Stop! Aaaah!”</i> he cries out.", parse);
	Text.NL();
	Text.Add("Ignoring the former tyrant’s pleas, you shift your grip and start to push down. Damn, but he’s <b>tight</b>! You know Vena said he was a virgin, but still, this is even tighter than you expected...", parse);
	Text.NL();
	Text.Add("<i>“Get it - Ahg! - out!”</i>", parse);
	Text.NL();
	Text.Add("You do wish he’d stop that. You aren’t going to stop pushing, certainly not when it’s taken you so much to get the first half of your cock inside of him.", parse);
	Text.NL();
	Text.Add("<i>“Ahh! Oooh! Ahn!”</i>", parse);
	Text.NL();
	Text.Add("You smirk to yourself; you thought that he’d warm up to it. Even as he clenches down as if his life depends on it, you keep pushing. Inch by teeth-gritting inch, you manage to wriggle your way inside, until he has taken you to ", parse);
	if(p1cock.Knot())
		Text.Add("just above your bulging [knot].", parse);
	else
		Text.Add("the very hilt.", parse);
	Text.Add(" Looking over his shoulder, you can see that his own cock is throbbing like mad, visibly pulsating in his arousal.", parse);
	Text.NL();
	Text.Add("<i>“C-can’t! Ahn!”</i>", parse);
	Text.NL();
	Text.Add("The lagomorph arches his back, shouting as his cock explodes like a geyser. Semen fountains from his glans, spurting through the air to patter like perverse rain into the puddle his wife made earlier. His balls visibly clench down, pushing out a truly intense climax, stopping only when he runs himself dry. He slumps into your lap, panting like a dog.", parse);
	Text.NL();
	Text.Add("Cheerfully, you quip that it looks like he enjoyed that. Seems like somebody had a thing for getting fucked all along, hmm?", parse);
	Text.NL();
	Text.Add("<i>“N-no… Enjoy you? Not even a cock-hungry slut would enjoy this.”</i>", parse);
	Text.NL();
	Text.Add("Smirking, you comment that you’ve never seen someone cum that hard and that long without enjoying it before. Or was that some other bunny creaming themselves from having your cock up their ass?", parse);
	Text.NL();
	Text.Add("<i>“Eat a dick!”</i> he retorts with renewed strength.", parse);
	Text.NL();
	Text.Add("No. That’s what he’s going to do.", parse);
	Text.NL();
	Text.Add("And with that, you clasp hold of his thighs and pull him up your shaft, his next words cut off by a gasping groan. You draw him up until it almost seems like you’re about to pop him free of your cock... and then you thrust him back down again, firmly pushing yourself all the way back inside of him.", parse);
	Text.NL();
	Text.Add("And just like that, the once talkative king is reduced to a moaning slut as you push yourself back to the hilt inside his quivering asshole.", parse);
	Text.NL();
	Text.Add("Now that he’s shut up, you can devote yourself to truly appreciating what you have here. There might not be a lot of meat to cushion yourself with, not like his wife has, but inside - ah, that’s another story. He’s tight as a vice, even after you broke his cherry, making you work to move in even the slightest direction. He’s hot as a furnace inside, stretched so tight that you swear you can feel his heartbeat, hammering a tattoo against your intruding cock.", parse);
	Text.NL();
	Text.Add("Slowly and carefully, you start to pull him up again, and then push him down. All Lagon does is moan; whether it’s because you made him cum already or because he’s too humiliated to protest anymore, it looks like all the fight has gone out of him, at least for now.", parse);
	Text.NL();
	Text.Add("Which you can appreciate, because it means you can focus on enjoying yourself.", parse);
	Text.NL();
	Text.Add("Remembering what Vena asked, you keep your thrusts relatively slow. Although that’s pretty easy to do; Lagon clenches down like a vice, making you work to squeeze yourself in and to pull yourself out, even after Vena’s generous donations of lubricant.", parse);
	Text.NL();
	Text.Add("You pump and you thrust, grunting heavily as you work away at the bunny’s tight little butt. Lagon moans and mewls involuntarily, the cutest little noises of pleasure being forced from his throat as you work his ass, mercilessly grinding his prostate.", parse);
	Text.NL();
	var cum;
	if(!strapon) {
		Text.Add("You can feel your control fraying, the pleasure building up inside of you with each plunge of your hips. Your voice rough and grunting, you ask how Lagon feels to be taking the dick for once. Does it feel as good as when he was fucking his son? Does he enjoy being stuffed full of cock, knowing that there’s only one way this is going to end - with a thick, hot batch of baby batter stuffed up his rabbit hole?", parse);
		Text.NL();
		Text.Add("<i>“Shut up, traitor… Ooh!”</i>", parse);
		Text.NL();
		Text.Add("You cut him off with another powerful thrust. Your heart is pounding against your chest, it feels like it's going to burst, molten metal pouring through your veins. You can't... can't hold out...", parse);
		Text.NL();
		
		cum = player.OrgasmCum(2);
		
		parse["k"] = p1cock.Knot() ? " without knotting yourself" : "";
		Text.Add("With an ecstatic roar, you plunge yourself as deeply into Lagon's ass as you can[k] and let yourself cum. ", parse);
		if(cum > 6) {
			Text.Add("Your cock goes off like a perverse parody of a volcano, erupting with inhuman fury into the tight bunny butt wrapped around it. You'd be surprised you don't send him flying off your dick like a jism-propelled rocket if you had that much free thought to spare.", parse);
			Text.NL();
			Text.Add("The cascade of spunk hits Lagon like a tidal wave, visibly deforming his once-tight stomach as it slams into his guts. His midriff bulges out from the sheer quantity of semen rushing into it, then shrinks back as your first spurt ends... and then the next one hits. And then the next.", parse);
			Text.NL();
			Text.Add("Like a pregnancy on fast-forward, Lagon's stomach balloons outward, round and flush with your seed, packed so tight that the skin is stretched taut as a drum. By the time you finally run dry, his belly is enormous; he looks like his wife does when she's ready to pop out one of her bigger litters.", parse);
			if(player.KnowsRecipe(Items.Anusol)) {
				Text.NL();
				Text.Add("A brief flicker of breeder-lust flashes through the swirling stew of your thoughts, making you momentarily wish that were the case, just to really hammer it home who's the alpha here.", parse);
			}
		}
		else if(cum > 3) {
			Text.Add("Spooge geysers from your cock and pours like a tidal wave into Lagon's ass, flooding his innards with relentless intensity. Grinding your hips against his rear, you are lost to everything except the urge to make sure he's properly inundated.", parse);
			Text.NL();
			Text.Add("Spunk begins to pool in his stomach, slowly puffing out his waistline, making him grow rounder and fatter with each gush of cum. By the time you've spurted your last, he's sporting a potbelly to match his wife's, which looks almost obscene on his comparatively smaller frame.", parse);
		}
		else if(came) {
			Text.Add("It looks like you might have bitten off more than you can chew, tending to Vena before. She took the lion's share for herself, leaving just a trickle for her husband. But still, it's enough to paint the toppled tyrant's asshole white.", parse);
		}
		else {
			Text.Add("You're glad that you saved your cum up for this, ensuring that you can pack him nice and full of sloppy, sticky seed. If he weren't wrapped so tightly around your cock, you know he'd be drooling thick streamers of your jizz down his legs by the time you finish.", parse);
		}
		
		Text.NL();
		Text.Add("Your orgasm triggers Lagon’s second climax. He moans like the slut he is and cums, letting his seed splatter on the front row of his audience. They look a bit surprised at first, but quickly smile and begin licking their father’s semen off their fur - as expected of the lagomorphs, really.", parse);
		Text.NL();
		Text.Add("Lagon doesn’t seem to be done though; his cock spasms and forces out more ropes of white lapine jism, these following sputters weaker than the initial burst, but still impressive in volume.", parse);
		Text.NL();
		Text.Add("Wrapped in hot, tight flesh as you are, you are prey to every flutter and clench of the once-proud bunny’s ass. He squeezes down on your [cock] with incredible expertise for a former anal virgin, milking your shaft even after you have nothing left to give and ensuring your dick cannot go limp - no matter what.", parse);
		Text.NL();
		Text.Add("It’s truly a sight to behold. Even from where you are, you can see the naked bliss written all over Lagon’s face, the toppled tyrant reduced to nothing more than a buttslut. His ass is full of cock, his belly full of spunk, and he’s just <b>loving</b> it. Looks like Roa took after his dad more than you thought.", parse);
		Text.NL();
		Text.Add("As Lagon wriggles and squeals, weakly flailing in his delight, you watch your audience. Countless envious eyes stare at you, drinking in the sight, dozens of tongues dabbing hungrily or nervously at too dry lips. You are the center of attention for every bunny in the warren, even the impromptu fuckfests having stopped to watch their father’s humiliation, and you know that not a rabbit here doesn’t wish that they were down in the Pit instead.", parse);
		Text.NL();
		Text.Add("And not necessarily in Lagon’s place. Eyeing the myriad erections bobbing about, you just know that more than a few of his sons - and his specially gifted daughters - would relish being in your place, filling their father with hot, creamy bunny-spunk.", parse);
		Text.NL();
		Text.Add("More than anything else, that makes you smile. Your goal here was to shatter Lagon’s grip of fear on his offspring, to make them see that they didn’t have to obey him anymore. Now, they know he’s no better than the rest of them; just a horny slut, aching for a hole or a cock to play with. He won’t be able to bully them anymore.", parse);
		Text.NL();
		parse["seep"] = cum > 6 ? "pour" : cum > 3 ? "flow" : "seep";
		Text.Add("Lagon’s deep moan of bliss draws your attention back to him. As you watch, one final weak spurt of cum tries to clear his cock, only to simply dribble down his shaft and soak his balls. Satisfied that he’s had enough, you shift your grip to his thighs and start to pull him from your lap. He whimpers softly as you draw free of his gaping hole, allowing your seed to start to [seep] from his abused tailhole.", parse);
	}
	else {
		Text.Add("Listening to the sounds your little fuck-bunny is making has your blood pumping. Your teeth are bared in a feral smile of lust as excitement makes you quiver. Unconsciously, you start to hump him harder and faster, jackhammering the rabbit until he squeals in pleasure.", parse);
		Text.NL();
		Text.Add("To your great surprise, Lagon suddenly arches his back, his cock almost visibly bulging before it erupts, spraying semen in a great, sloppy arc through the air. He cums with such ferocity that he sprays right into the face of some of the closer lagomorphs, who squeak in surprise, then start to laugh, licking their father’s seed from their lips.", parse);
		Text.NL();
		Text.Add("The chorus wrings a heartfelt groan from Lagon, but it doesn’t seem to stop him. Indeed, his next climax is even stronger, sending great ropes of shimmering seed swirling through the air and spattering in streamers across the floor.", parse);
		Text.NL();
		Text.Add("Whispering and murmurs fill the air, Lagon’s vast brood unable to resist talking to each other about what they are seeing. You have a feeling they can hardly comprehend it; if it were a real cock ravaging their father’s ass, they might understand it, but your [cock] is just an imitation. And yet, there’s no question that Lagon is just loving your efforts at fucking him with it. Even to their eyes, he must look like a huge slut.", parse);
		Text.NL();
		Text.Add("As Lagon bucks and whimpers, spraying cum everywhere, you smirk, deep and hungry. You drink in the former alpha’s humiliation, feeling it stoke your ego, overwhelming you with your own kind of bliss. A hand creeps down beneath Lagon’s thigh, fingers diving eagerly into your own [vag], twisting and plunging just hard enough to... to...!", parse);
		Text.NL();
		
		cum = player.OrgasmCum();
		
		Text.Add("You cry out in pleasure as your own orgasm rips through you, letting Lagon’s mewling carry you to the heights of sexual bliss. The confines of the Pit fade away into warm, fuzzy darkness, and you happily ride the wave until it sweeps through, leaving you panting in the cool air of the dungeon.", parse);
		Text.NL();
		Text.Add("Only after you have caught your own breath do you notice the panting coming from your lap. It looks like Lagon finished blowing his load while you were creaming yourself. You smile at the sight; if he got off this hard just from your humble toy, how might he fare if one of his kin decides to show him what a real cock can do?", parse);
		Text.NL();
		Text.Add("But that’s a matter for the future. Right now, you think he’s had enough. So, you carefully take hold of his thighs and start to pull him off your strap-on. He moans softly, wriggling a little as you pull him free.", parse);
	}
	Text.NL();
	Text.Add("Settling him back down in your lap, your [cock] rubbing between his butt cheeks, you tell him that you just knew he’d come to love it. You keep your tone cheerful and affectionate, the better to rub your words in.", parse);
	Text.NL();
	Text.Add("<i>“F-fuck you...”</i> he mutters weakly, more than a little spent after being so wonderfully well-fucked and blowing his load not once, but twice. He might not be displaying it, but you have a sense of shock when you watch the former King’s face. Seems like even he is surprised at how hard he came.", parse);
	Text.NL();
	Text.Add("You point out you just got done doing that, but it seems he hasn’t had enough - especially when you look at his cock, still hard as a rock and throbbing.", parse);
	Text.NL();
	Text.Add("<i>“That’s-”</i>", parse);
	Text.NL();
	Text.Add("You shush him by grinding against his abused ass. You’re a bit tired, but if Lagon is raring for another go already, you’re sure you can find a way to <i>help</i>. Guess you just figured out who Roa <i>really</i> takes after.", parse);
	Text.NL();
	Text.Add("<i>“Don’t you dare compare me to that traitorous whelp!”</i> the former King spits back angrily, finding renewed strength as he struggles against your grip and manages to wiggle his way out of your lap and back onto his feet. Sadly, he only stays upright for a moment because as soon as he tries to take another step away from you, he winds up slipping on the pool of semen his dear wife left earlier.", parse);
	Text.NL();
	Text.Add("Lagon only has time for a surprised gasp before he crashes down, face-first, into the pool of mixed juices.", parse);
	Text.NL();
	parse["c"] = !strapon ? " dripping with your seed and" : "";
	Text.Add("A chorus of snickers echoes through the Pit, Lagon’s brood now feeling free to laugh at their father’s mishap. Even you can’t resist a chuckle at the sight of the once-proud tyrant now flat on his face in his wife’s cum-puddle, arms splayed weakly through the smeared juices and his still-gaping ass up in the air,[c] perfectly poised for another fuck.", parse);
	Text.NL();
	if(!strapon && player.Cum() >= 3) {
		parse["c"] = cum > 6 ? " and belly bulging with your last load" : "";
		Text.Add("Seeing him face-down like that, sweet ass up in the air as if begging for your cock, seed dripping over his balls[c] makes you lick your lips hungrily. A pang of hunger wells up within you, your dick pulsating anxiously at the sight. Unconsciously, you run a hand over your slick length, shivering slightly at your own touch.", parse);
		Text.NL();
		Text.Add("Yes... you think you have another round in you.", parse);
		Text.NL();
		Text.Add("You push yourself upright, and advance on Lagon while he’s too stunned to notice. You don’t think he’s got it in him to actually escape, but why put a perfectly good pose to waste? You grab his butt cheeks and give them a good squeeze. If Lagon wanted another round so badly, all he had to do was ask, but you’re not going to complain if he wants to give you some eye candy first.", parse);
		Text.NL();
		Text.Add("He simply groans in response. Seems like he can’t think of any retort at the moment, not that you blame him. It’s not everyday you discover a new fetish.", parse);
		Text.NL();
		Text.Add("You take the time to really appreciate the view before you claim your final victory on the former tyrant king. Seeing him so debased, so vulnerable fills you with lust, even Vena can’t contain herself anymore; she’s openly masturbating alongside her children, with a pair of fingers deep in her cunt and a guard nursing on her malehood.", parse);
		Text.NL();
		Text.Add("Savoring the approval of Lagon’s family, you decide that it’s time to give your adoring audience what they’re really hoping to see. Aligning your [cockTip] with his well-fucked hole, you start to push forward in a smooth, steady glide.", parse);
		Text.NL();
		Text.Add("Lagon verbally winces; even after all you did to him, he’s still so damn <i>tight</i>! But you’ve stretched him out enough that he can’t really stop you, allowing you to bottom out in a single stroke.", parse);
		Text.NL();
		
		Sex.Anal(player, lagon);
		lagon.FuckAnal(lagon.Butt(), p1cock, 5);
		player.Fuck(p1cock, 5);
		
		player.subDom.IncreaseStat(100, 1);
		
		Text.Add("Closing out the world around you, you let yourself be buried in pleasure as you start to thrust. Your earlier load squelches with delightfully obscenity, undercutting the meaty smack of hips on ass in a manner that’s music to your ears. You hold Lagon’s hips in a death grip, ensuring he doesn’t have a prayer of getting away as you fuck his rear for all you’re worth.", parse);
		Text.NL();
		Text.Add("The friction of flesh on flesh makes you shudder, pleasure welling up within you. The spirit is more than willing, but the flesh, alas, is weak. With all that you’ve already done with your unwilling little onahole, your ability to hold off a second orgasm is drastically reduced.", parse);
		Text.NL();
		Text.Add("All too soon, you can feel yourself nearing the brink, and you plow him all the harder for it. Your strokes grow rougher and harder, your patience wearing as thin as your control. Lagon’s mewls rise in pitch, climbing to an ecstatic squeal, and then give way to a thin sigh, but you are too caught up in your own bliss to pay much attention.", parse);
		Text.NL();
		Text.Add("Cock throbbing madly, you’re about to blow... when a thought manages to strike you, even through the veil of lust and pleasure crowding your mind.", parse);
		Text.NL();
		
		cum += player.OrgasmCum();
		
		Text.Add("With a primal roar of ecstasy, you fiercely pull your cock free of Lagon’s ass, grabbing it roughly in your hand and pumping to push yourself over the edge. Your whole body convulses as you climax again, thick jets of semen spraying over Lagon’s butt and back. You paint him with your seed, irrefutably marking him as your bitch, and then fall back with a sated sigh.", parse);
		Text.NL();
		Text.Add("You pant, slow and heavy, getting some energy back into your body after your latest fuck. Once you can think clearly, you lift your head, ready to taunt Lagon again, but hold your tongue; it would be a waste of a good witticism.", parse);
		Text.NL();
		Text.Add("Your fuck-bunny is out cold! Judging from the additions to the puddle he is now sprawled bonelessly in, he must have climaxed again while you were fucking him, and you were too preoccupied to notice.", parse);
		Text.NL();
		Text.Add("A smirk spreads across your lips; this, more than anything, should etch today’s punishment into Lagon’s memory forever. After all, you doubt he’s <b>ever</b> passed out even when fucking Vena, never mind when he was breeding his daughters or buggering his sons.", parse);
		Text.NL();
		Text.Add("With a soft grunt of effort, you haul yourself upright again, and then turn your attention to Vena. The lapine queen seems to have just finished with her second climax, one bloated-looking, cum-dripping guard works on licking her shaft clean, while the other does the same to her pussy.", parse);
		Text.NL();
		Text.Add("Mustering as much dignity as you can, you tell Vena that her husband’s punishment is done. She may send him to his new quarters whenever she wishes.", parse);
		Text.NL();
		Text.Add("<i>“Hmm… what? Oh! Of course!”</i> She pushes her guards away and takes a moment to recompose herself. <i>“My darlings, take my husband back to his cell and lock him in there.”</i>", parse);
		Text.NL();
		Text.Add("The guards look a bit disappointed, but obey their matron, grabbing Lagon’s limp form and dragging it out of view.", parse);
	}
	else {
		Text.Add("This is hilarious. The once-proud tyrant king reduced to a hapless, clumsy bunny, dripping with cum after slipping on his wife’s juices. Worst of all, you think he’s actually enjoying the attention.", parse);
		Text.NL();
		Text.Add("Now, you could give him another round… but you’re too tired for that right now, not to mention he hasn’t actually earned his second buttfuck. After all, this is supposed to be punishment, not reward.", parse);
		Text.NL();
		Text.Add("Lagon is too stunned to react to anything. Any teasing you could do right now would fall on deaf ears. So you turn to Vena and signal to her that her husband’s punishment is done. <i>“Alright, thank you, champion.”</i> She turns to her guards. <i>“Darlings, please take your father back to his room and lock him in.”</i>", parse);
		Text.NL();
		Text.Add("The guards nod and after a short bow, proceed to haul the silent Lagon up to his feet and drag him out of the Pit.", parse);
	}
	Text.NL();
	Text.Add("You approach Vena, who watches as her children carry their father into the darkness of the tunnels beyond, and ask her if she’s feeling alright.", parse);
	Text.NL();
	Text.Add("<i>“It’s sad that things had to end this way.”</i> She starts. <i>“Lagon and I… we could have built a wonderful family for ourselves. I just wonder what happened to make him lust after the world out there so much... what drove his ambition?”</i>", parse);
	Text.NL();
	Text.Add("You shrug your shoulders and confess that you don’t know. That’s something only Lagon can really hope to tell her. Trying to brighten her spirits, you suggest that maybe, in his own way, he wanted the same thing. He just let his ego determine what a ‘wonderful family’ meant to him.", parse);
	Text.NL();
	Text.Add("Vena smiles softly at that. <i>“Thank you, [playername]. Thank you for stopping him, and thank you for being easy on him.”</i>", parse);
	Text.NL();
	Text.Add("You quietly nod your head, wordlessly accepting her thanks.", parse);
	Text.NL();
	Text.Add("<i>“My husband may be a bit difficult, but I’m sure he would like it if you visited him once in a while. I’m sure what we did here today helped a bit, but I wouldn’t be surprised if most of our children are still scared of him, and for a lagomorph loneliness can be very painful.”</i> She takes a deep breath. <i>“Still, I never knew this side of him. Who would’ve guessed my dear husband enjoyed being taken so much?”</i>", parse);
	Text.NL();
	Text.Add("Smiling, you mischievously ask if that’s given her some ideas about spicing up her conjugal visits in the future.", parse);
	Text.NL();
	Text.Add("<i>“Well, I’m still a woman. Of course, I’ll still have him fuck me - like always. However, I wouldn’t mind pitching a few times either.”</i>", parse);
	Text.NL();
	Text.Add("You didn’t think she would, given how into it she seemed to get when she was watching. But you keep that thought to yourself, simply smiling knowingly.", parse);
	Text.NL();
	Text.Add("<i>“We should probably go back and let my children resume their fun. They must all be very horny after the spectacle.”</i>", parse);
	Text.NL();
	Text.Add("You nod your head, and indicate for her to lead the way, silently following her through the tunnels back to her throne room.", parse);
	Text.Flush();

	world.TimeStep({hour: 1, minute: 30});
	
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Burrows.Throne);
	});
}

Scenes.Lagon.Defeated.PunishmentVena = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Add("Lagon scrambles to his feet, trying to get away from Vena, but it’s useless. The amazonian lagomorph is bigger, stronger and faster. He barely takes two steps before Vena pounces him and pins him down on the ground, smearing his face with bit of leftover spunk one of the bunnies must’ve left there.", parse);
	Text.NL();
	Text.Add("You smirk and settle back against a convenient outcrop to relax. This is going to be fun to watch.", parse);
	Text.NL();
	Text.Add("<i>“Ugh! Get off me, you stupid cunt!”</i> Lagon cries, struggling to wiggle free of Vena’s grasp.", parse);
	Text.NL();
	Text.Add("Vena just smiles sweetly and gently shakes her head. <i>“Come now, darling, don’t make such a fuss. Being taken is not so bad; you might even like it if you give it a chance.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Like it!? Are you insane!? I am Lagon! King of the Lagomorphs and future ruler of the surface! I won’t be made into anyone’s bitch!”</i> He struggles with renewed effort.", parse);
	Text.NL();
	Text.Add("Vena just shifts her weight; being over twice her husband’s size now, she can easily keep him trapped on the floor, his efforts to wriggle free clearly futile. She sighs softly at his words. <i>“Dear, this has nothing to do with you being my ‘bitch’,”</i> she replies. <i>“Believe me, I’d rather be taking that yummy cock if I had the choice. But you haven’t given me the choice. You haven’t given me a choice since you wiped my mind and put me away down here, all because I wouldn’t give you what you wanted,”</i> she adds sadly. <i>“I’m sorry, husband, but you’ve been a very bad boy. And bad boys need to get punished. Please, this is for your own good.”</i>", parse);
	Text.NL();
	Text.Add("<i>“If you really cared about what was good for me, you’d release me this instant and put me back on the throne, instead you’re here trying to humiliate me, you hypocritical bitch!”</i> Lagon growls.", parse);
	Text.NL();
	Text.Add("<i>“That's not 'good for you', that's just you getting away with what you did,”</i> Vena replies, her usual sweetness giving way to a surprisingly dry tone. <i>“You wouldn't let one of our children get away if they did something wrong, so it's time to live up to your own example.”</i>", parse);
	Text.NL();
	Text.Add("Lagon has no answer for that, the self-centered bunny visibly seething at being verbally out-maneuvered - not something he’s used to from his cowed subordinates.", parse);
	Text.NL();
	Text.Add("Vena just lets him try, then smiles happily. <i>“Now, relax and stop struggling, dear. I'm not taking you dry. I'll make sure you're lubed up properly before I take you,”</i> she giggles.", parse);
	Text.NL();
	Text.Add("That certainly doesn’t reassure Lagon in the slightest. He starts to wriggle and squirm all the harder, but Vena is having none of it. She leans all of her weight on him until he grunts weakly, being quite firmly squashed to the floor even as she slips down his body to bring her face in line with his ass.", parse);
	Text.NL();
	Text.Add("Without the slightest hesitation, Vena opens her mouth and extends her tongue, slurping her way through Lagon’s ass crack once, and then a second time. Then she starts to slowly lap at his pucker, before trying to worm her way inside his doubtlessly clenched ring.", parse);
	Text.NL();
	Text.Add("<i>“The hell are you doing!? Stop!”</i>", parse);
	Text.NL();
	Text.Add("Vena ignores her husband’s protests, instead avidly licking away at his ass with every sign of enjoyment. Her eyes have rolled shut and she coos softly in pleasure as she does her best to lube Lagon up inside and out.", parse);
	Text.NL();
	Text.Add("Lagon repeats his demand, but his voice wavers, his fingers clenching weakly at the stone floor. From where you are, you can see that his cock is starting to stir, thrust from its sheath and bobbing drunkenly as Lagon shifts his hips, at least half-erect already.", parse);
	Text.NL();
	Text.Add("Vena’s tongue starts to drift lower, slowly lapping its way across Lagon’s taint, until she is starting to toy with his round, fuzzy balls. These she goes after with even greater enthusiasm, murmuring audibly as she licks, kisses and suckles with practiced ease.", parse);
	Text.NL();
	Text.Add("<i>“Y-you stupid, cu- ahn!”</i>", parse);
	Text.NL();
	Text.Add("Vena eventually lets Lagon’s ball fall from between her lips, having tried her best to leave a hickey on her husband’s nutsack, and resumes licking again. She takes advantage of Lagon’s distraction to adjust her grip; one arm curls around his waist, keeping him firmly pressed to her whilst freeing the other.", parse);
	Text.NL();
	Text.Add("With her spare hand, she reaches up between Lagon’s thighs, affectionately stroking his cock before she tenderly pulls it around, so it points back towards her - as much as it can do so, in its present state. Still caressing it with her fingers, she lowers her head, allowing her tongue to glide slowly across the exposed surface of Lagon’s shaft.", parse);
	Text.NL();
	Text.Add("Listening to Vena’s mewls of pleasure, watching the enthusiasm with which she licks her husband’s cock, you find yourself worried; what if Vena forgets the plan? She did make it clear that she prefers to catch rather than pitch; is it possible she’ll forget about needing to punish Lagon and she’ll let him fuck her instead?", parse);
	Text.NL();
	Text.Add("Vena languidly laps her way up Lagon's shaft, then lifts her face, a dreamy smile on her lips. <i>“Mmm, you taste just as sweet as ever, darling,”</i> she lovingly observes.", parse);
	Text.NL();
	Text.Add("<i>“If that’s the case, then go ahead and suck on my cock. We both know it’s what you love to do,”</i> Lagon replies with a weak grin.", parse);
	Text.NL();
	Text.Add("<i>“Mmm... any other time, I’d love to,”</i> Vena coos seductively. Then her brows furrow and she sadly shakes her head. <i>“But not this time. You need to be punished.”</i>", parse);
	Text.NL();
	Text.Add("Lagon growls at that. <i>“Punish this, punish that. Is that all you can say anymore? We both know you don’t want to do this, Vena, so why force yourself? Back down now and I’ll let you go back to your old position as the Pit’s centerpiece.”</i>", parse);
	Text.NL();
	Text.Add("Vena just shakes her head. <i>“And that is exactly why I <b>have</b> to do this,”</i> she replies.", parse);
	Text.NL();
	Text.Add("You can’t help but think that you should have given Vena more credit. She has more control than to just bend back over for her husband, no matter how much she still cares for him.", parse);
	Text.NL();
	Text.Add("She lets Lagon's cock go and shifts her hands to his hips. With a soft grunt of effort, she pushes herself upright, powerful limbs flexing as she stands straight. Their positions only exaggerate the size difference between the spouses; Lagon looks even smaller in contrast to his amazonian mate, particularly when she swings her monstrous maleness around and lays it on Lagon’s ass.", parse);
	Text.NL();
	Text.Add("<i>“You traitorous bitch! One more move and I’ll make sure you regret this for all your miserable life!”</i>", parse);
	Text.NL();
	Text.Add("Vena ignores her mate’s ranting, and focuses on adjusting her position, allowing her to bring the tip of her cock under Lagon’s tail.", parse);
	Text.NL();
	Text.Add("<i>“Now, if you’ll just take a deep breath and relax, dear, I know you’ll enjoy this. After all, you liked it when it was my tongue wriggling around in there, didn’t you?”</i> she observes, grinning at the observation.", parse);
	Text.NL();
	Text.Add("<i>“That was the most disgusting thing I’ve ever had happen to me!”</i> he replies.", parse);
	Text.NL();
	Text.Add("<i>“You were rock hard, my love - believe me, I know when you’re enjoying something,”</i> Vena giggles. <i>“Alright, try to relax, here I come...”</i> And with that, she starts to push, slowly pressing her huge cock into the former King’s tight, once-virginal anal ring.", parse);
	Text.NL();
	Text.Add("<i>“Argh! You traitorous bitch! I’ll get you for - gah!”</i>", parse);
	Text.NL();
	Text.Add("Vena stops pushing, smiling apologetically down at her husband. <i>“Shh, it’s alright, darling, you’re doing great. Just try to relax a little, that’s all - remember what it was like for Roa when it was his first time?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Don’t compare me to that pathetic whelp! - Guh! - Get your fucking dick out of my ass!”</i>", parse);
	Text.NL();
	Text.Add("<i>“I-I’m sorry, honey,”</i> Vena groans, <i>“but this would be a lot - nngh! - easier if you’d stop - haaah - wriggling!”</i> she hisses, even as she keeps on pushing deeper into Lagon’s tailhole. From the look on her face, though, the wriggling isn’t entirely unpleasant.", parse);
	Text.NL();
	Text.Add("From your position on the sidelines, you happily watch the amazing disappearing act that Vena is pulling. Even with everything, at least a third of her monstrous maleness has already vanished up under Lagon’s tail. It’s astonishing just how <b>stretchy</b> the toppled tyrant really is.", parse);
	Text.NL();
	Text.Add("Lagon spits a broken stream of curses, constantly cut off by strangled gasps of pleasure and pitiful moans as Vena picks up steam, pushing ever deeper into her husband. You’re positive you can see him bulging around the intruder by the time that, miraculously, Vena manages to lever the last few inches inside of him.", parse);
	Text.NL();
	Text.Add("Vena pants heavily, then weakly giggles. <i>“There we are, all done! See, dear? It’s not so bad...mmm, you feel really yummy wrapped around my cock like this,”</i> she confesses.", parse);
	Text.NL();
	Text.Add("<i>“Ack! Damn you, Vena!”</i>", parse);
	Text.NL();
	Text.Add("<i>“It’s okay, love, I know it feels weird - it felt weird for me too, the first time. But you’re really doing great at this; just give things a minute, and you’ll feel much better, I promise.”</i>", parse);
	Text.NL();
	Text.Add("As if to back up her assurances, Vena slowly and carefully shifts her position, gently moving her mammoth cock around inside of his straining hole, trying to help him stretch out more.", parse);
	Text.NL();
	Text.Add("<i>“S-stop moving! - Ah! - If you keep grinding, I’m gonna- Haa!”</i>", parse);
	Text.NL();
	Text.Add("Lagon lets out a howl of frustrated pleasure, arching his back as his own impressively sized cock throbs and then explodes. Thick, musky bunny seed spews across the smooth stone floor, a great puddle of slickness that rapidly spreads out around the humiliated rabbit.", parse);
	Text.NL();
	Text.Add("<i>“Oh! Oh my!”</i> Vena remarks, looking quite surprised at Lagon’s spontaneous climax. <i>“I knew you’d enjoy it if you gave it a chance, but I didn’t know you’d like it <b>this</b> much,”</i> she marvels.", parse);
	Text.NL();
	Text.Add("From your position on the sidelines, you can’t resist shouting that it looks like Lagon and Roa have more in common than he thought.", parse);
	Text.NL();
	Text.Add("<i>“Shut up! - Haa... - Both of you! I d-don’t like this! - Ahn... - I <b>hate</b> this! Pull out now!”</i>", parse);
	Text.NL();
	Text.Add("Smirking, you loudly ask why he’s still rock hard, if he hates it so much.", parse);
	Text.NL();
	Text.Add("Vena looks intrigued, and bends over her husband so she can grope under his belly for his cock. From your position on the sideline, you have a perfect view to watch as her hand closes gently around the throbbing member. She gently kneads it experimentally, shifting her hips slightly to grind his hole, and pre-cum seeps freely over her fingers.", parse);
	Text.NL();
	Text.Add("<i>“Oh, my! You really are enjoying yourself, aren’t you, dear? I can’t remember the last time you got ready again so quickly,”</i> Vena giggles.", parse);
	Text.NL();
	Text.Add("<i>“I-I’m no- Ahn!”</i>", parse);
	Text.NL();
	Text.Add("You smirk to yourself, as you think about where this is going. No matter how much he denies, it’s undeniable that Lagon enjoyed that very much; even his children can see through him. And if Lagon liked the insertion this much? You can only wonder how much harder he’ll cum when Vena’s actually fucking him.", parse);
	Text.NL();
	Text.Add("The lagomorph matron gives Lagon’s cock a playful squeeze, stroking it between her skilled fingers. <i>“Mmm, it’s good to see you’re getting into this, husband. Because I’m just getting started, darling,”</i> she giggles, winking mischievously at him.", parse);
	Text.NL();
	Text.Add("<i>“F-fuck you...”</i>", parse);
	Text.NL();
	Text.Add("Vena gives her husband’s cock a final stroke, and then straightens up again. Clasping him firmly by the hips, she starts to slowly lever herself out of his ass. Lagon’s deep groans echo through the Pit, though you can’t tell if they’re from pain, humiliation or just the loss of being so full. Heedless to her husband’s complaint, Vena keeps pulling out, and out, until only the tip remains inside of him.", parse);
	Text.NL();
	Text.Add("And then she starts to push home again, quicker than before, but still fairly slowly and steadily. Whether it is from concern for him or simply because of how tight he is, you can’t be sure. Whatever the reason, it doesn’t stop her from repeating the process again and again. Steadily, she starts to build up her pace, grunting and groaning indelicately as she starts to slam her hips into Lagon’s ass. Though she lacks balls for that extra meaty undertone to the slapping of flesh on flesh, the sound is still deliciously lewd.", parse);
	Text.NL();
	Text.Add("Stealing a glance around, you can see the other bunnies watching with rapt expressions. There’s no cheering, no calling for their mother to fuck their father good and hard, but that’s just because they don’t want to throw her off. A few are even starting to grope and make out with one another, little mini-orgies breaking out around the Pit.", parse);
	Text.NL();
	Text.Add("With nothing to do but watch, you settle back and enjoy the show, the big milfy amazon building her way up to rutting her smaller husband with the ferocity of a breeding bull. Embracing the atmosphere, you fondle yourself, feeling your own breath start to come quicker as Vena and Lagon remain locked in their perverse embrace.", parse);
	Text.NL();
	
	player.AddLustFraction(0.7);
	
	Text.Add("Lagon grunts and moans in sync with his wife, helpless to do anything under her onslaught. Hesitantly, at least at first, he starts to buck back against her, his drooling dick slapping wetly against his belly with each impact. His features are screwed up into an impenetrable mask, shame and lust visibly warring with each other for control.", parse);
	Text.NL();
	Text.Add("The once-proud patriarch of the warrens has been reduced to little better than a bitch-boy like his scorned son Roa, mewling and writhing as his wife unwittingly uses him as little more than a living cocksleeve. Thick jets of pre-cum spurt from his cock as she mercilessly crushes his prostate.", parse);
	Text.NL();
	Text.Add("Filled to the brim, it really isn’t any surprise when Lagon lifts his head and wails in pleasure, firing off another volley of cum into the puddle beneath him. This climax is even bigger and harder than the first, his whole body shaking madly as he spends himself shamelessly.", parse);
	Text.NL();
	Text.Add("Behind him, Vena moans, deep and throaty. <i>“I... oh, oh dear... I’m g-gonna cum,”</i> she whimpers. Her fingers clench down on Lagon’s rear, making him squeak in protest as she tries to pull out - emphasis on “tries”. Judging by the resistance she’s clearly meeting, Lagon isn’t in any hurry to let her go.", parse);
	Text.NL();
	Text.Add("It looks like Vena is going to lose her nerve at the final stretch. You promptly charge forward, racing for the matriarch, intent on ensuring that she really rubs her lesson in. Only question is, how are you going to do that?", parse);
	Text.Flush();
	world.TimeStep({hour: 1});
	
	var options = [];
	//[Cum inside] [Cum bath]
	options.push({nameStr : "Cum inside",
		tooltip : Text.Parse("Best way to humiliate Lagon is to show him what it’s like to be bred like a bitch.", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("Zipping around behind Vena, you place your hands on her gloriously full ass - too busy to even cop a feel - and firmly shove her forward, driving her back inside of Lagon to the hilt.", parse);
			Text.NL();
			Text.Add("Vena cries out in pleasure as her mate’s warm depths wrap around her again, his once tight asshole clenching down with all its might. Her whole body quakes as she goes off like a volcano, an almost literal eruption of cum going off inside of Lagon’s ass.", parse);
			Text.NL();
			Text.Add("Lagon squeals in shock and pleasure, a sound cut off by a liquid gurgle; Vena is cumming so hard and so much that some of her spunk has just gushed clean through her husband’s body and flown out his mouth! He clamps his lips together, on pure instinct, and holds on for dear life as Vena empties her load.", parse);
			Text.NL();
			Text.Add("And what a load... even from where you are, you can see Lagon’s sides quickly expanding outward, like an obscene pregnancy on super-speed. His gut stretches down to the floor, growing so full that it brushes the cool stone, and then it starts growing outward when it can’t go further down. Bigger, bigger... soon, Lagon’s belly actually lifts his feet a couple of inches off of the floor, leaving him wallowing on his own personal waterbed.", parse);
			Text.NL();
			Text.Add("You wonder for one awesome moment just how much Vena can make, hoping that it’s not more than Lagon can take, but your fears are unfounded. Vena groans and sighs, shuddering less violently as her mind-scrambling orgasm begins to ebb away, the cascade of cream cutting off.", parse);
			Text.NL();
			Text.Add("Eventually, she stands there, hands gently laying on Lagon’s butt for support, panting like a runner who just completed a marathon, almost steaming in the cool air of the Pit. On pure instinct, she gingerly pulls herself free of her husband’s ass, unleashing a waterfall of cum that cascades down over his balls and cock, pouring into the puddle beneath him.", parse);
			Text.NL();
			Text.Add("Vena staggers back a few steps, shaking her head as if to clear it, then stares dumbfounded at Lagon. <i>“...I did all that?!”</i> she squeaks in shock. When you nod in confirmation, she meekly rubs the back of her head. <i>“I guess I was a little more pent up than I thought,”</i> she confesses, nervously giggling at what she did.", parse);
			Text.NL();
			Text.Add("She shakes her head, draws herself up regally, and claps her hands. <i>“Alright! Children, take your father up to his room.”</i> She steals another disbelieving glance at him, then adds, <i>“I don’t think he can make it himself.”</i>", parse);
			Text.NL();
			Text.Add("The guards assigned to Lagon quickly scurry to obey, stealing awe-filled looks at their mother as they pass her by. Each slings one of their father’s arms over his shoulder, and then help him stumble to his feet. Straining a little under the weight, the threesome lurch away towards the tunnels, heading towards Lagon’s new home, where he will spend the rest of his life.", parse);
			Text.NL();
			Text.Add("Or at least until he learns his lesson and becomes a better bunny. Somehow, you don’t see that happening any time soon.", parse);
			Text.NL();
			Scenes.Lagon.Defeated.PunishmentVenaCont();
		}
	});
	options.push({nameStr : "Cum bath",
		tooltip : Text.Parse("Lagon’s never going to live it down if his wife paints him in spooge.", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("Slipping over next to Vena, you watch her carefully, waiting for the moment to strike. As soon as her cock leaves the warm, tight confines of her husband’s ass, you pounce. Grappling the behemoth manhood, you roughly train it on the kneeling lagomorph, brushing the pulsating flesh with your hands.", parse);
			Text.NL();
			Text.Add("Vena moans deeply. You can <b>feel</b> her cock swelling with her climax - hells with it, you <b>see</b> it distend as the first massive gush of seed races up its length and spews forth, splashing down on the small of Lagon’s back like an almost physical mass. It splatters all over him, spraying up to soak his hair, flowing over his sides to pour into the puddle of his own cum.", parse);
			Text.NL();
			Text.Add("And then the next load is fired a heartbeat later. And then the next. And the next.", parse);
			Text.NL();
			Text.Add("Holding onto Vena’s cock as if it were a kicking calf, you do your best to aim it like a hose, utterly drenching Lagon from head to toe. Since he was all-white before, the color just blends in, but that he’s being soaked is undeniable from the way his fur mats together.", parse);
			Text.NL();
			Text.Add("By the time Vena finally dribbles her last few meager spurts of seed, Lagon looks like a drowned rat, seeming to have shrunk half his size with how closely his plastered fur clings to him. Whiteness spreads across the floor, a veritable lake of semen; if Lagon had been in some sort of tub, he could have easily taken a bath in his wife’s leavings.", parse);
			Text.NL();
			Text.Add("Seeing that Vena is finished, fully devoted to sucking in lungfuls of musky air, you let go of her cock and step back, allowing her to catch her bearings.", parse);
			Text.NL();
			Text.Add("Vena inhales deeply, exhales in a long sigh, and then straightens up, dusting herself off. She smiles gently at her husband, and gently pets his butt. <i>“There we are, dear; that wasn’t so bad, was it?”</i>", parse);
			Text.NL();
			Text.Add("Lagon glowers silently up at his wife, too beaten down to react verbally. He pointedly spits some stray cum out of his mouth, but otherwise doesn’t react.", parse);
			Text.NL();
			Text.Add("Vena’s smile falters a little, and she shakes her head softly. Turning back to the guards she picked out for Lagon, she gestures towards him. <i>“Take my husband to his new quarters. I’m sure he’d like to dry off a little.”</i>", parse);
			Text.NL();
			Text.Add("The snickering bunnies give Vena their best salutes and advance on their father. He scowls, and tries to stand up, only to nearly slip over in the thick puddle of cum he is standing in; only their timely intervention keeps him from falling flat on his face. Still glowering at anyone and everyone who tries to meet his eyes, Lagon is led away into the dark tunnels and his indefinite confinement.", parse);
			Text.NL();
			Scenes.Lagon.Defeated.PunishmentVenaCont();
		}
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Lagon.Defeated.PunishmentVenaCont = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Add("With Lagon gone, Vena turns to you. <i>“Phew, that was tiring, but I think we made our point.”</i>", parse);
	Text.NL();
	Text.Add("Looking at the direction in which Lagon was taken, you smirk and agree that was most certainly what happened.", parse);
	Text.NL();
	Text.Add("<i>“Wasn’t counting on your intervention though.”</i> She smiles.", parse);
	Text.NL();
	Text.Add("You shrug casually and confess that it looked like she was a little lost on how to properly emphasize the point. You just wanted to make sure that Lagon <b>really</b> learnt his lesson. You’re sorry if she found that... upsetting.", parse);
	Text.NL();
	Text.Add("<i>“Hmm, but I still wonder if we weren’t a little too harsh on him.”</i>", parse);
	Text.NL();
	Text.Add("You immediately shake your head and disagree. There are countless worse punishments he could have received - that he would have received under a ruler less gentle than Vena herself. You tell her how he could have been branded, flogged, mutilated, exiled or even executed elsewhere. All he got here was a hot dicking in front of his kids from his loving wife.", parse);
	Text.NL();
	Text.Add("Smirking, you add as an afterthought that if he didn’t want to get fucked by his wife’s cock, he shouldn’t have given her one.", parse);
	Text.NL();
	Text.Add("<i>“I suppose you have a point. Didn’t expect him to like anal so much though.”</i>", parse);
	Text.NL();
	Text.Add("You agree that was a bit of a surprise. Then again, a lot of publically dominant types tend to have a bit of a submissive streak in private...", parse);
	Text.NL();
	Text.Add("<i>“I guess dear little Roa really takes after his father.”</i>", parse);
	Text.NL();
	Text.Add("Chuckling, you note that it certainly seems so.", parse);
	Text.NL();
	Text.Add("<i>“Well, umm, I suppose we should go and let my children have their pit back. I have a feeling they’re raring to return to their daily activities.”</i>", parse);
	Text.NL();
	Text.Add("You nod your agreement, and indicate for her to lead the way. The lagomorph queen pads off into the tunnels, heading towards the throne room, and you follow close behind.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Burrows.Throne);
	});
}
