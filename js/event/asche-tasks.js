
/*
 * TASKS
 */
Scenes.Asche.Tasks = {};

Scenes.Asche.Tasks.Ginseng = {};

// TODO LINK
//This should have a level requirement such that the PC has a chance at actually beating the enemies involved. Maybe add a money spent or items bought requirement?
//Maybe a minimum level of 7, the encounter will be 8 or 9.
Scenes.Asche.Tasks.Ginseng.Initiation = function() {
	var parse = {
		heshe : player.mfFem("he", "she"),
		handsomepretty : player.mfFem("handsome", "pretty")
	};
	
	Text.Clear();
	Text.Add("You ask the jackaless if she has anything that needs doing. To your mild surprise, she actually looks thoughtful for a second or so, then nods.", parse);
	Text.NL();
	Text.Add("<i>“Actually, is something that customer can be doing for Asche, if [heshe] is so desiring. Does customer wish for Asche to say more?”</i>", parse);
	Text.NL();
	Text.Add("Hmm… perhaps you should think about it for a moment… why yes, you’d be interested in hearing about what she has in mind.", parse);
	Text.NL();
	Text.Add("<i>“Customer is to be giving Asche a moment, please.”</i> The jackaless cranes her head this way and that, surveying her shop with the help of several strategically-placed mirrors on the walls. Satisfied that the two of you are alone in the shop, she continues. <i>“Now, to be listening closely. Asche is trying out new recipe she has been working on for some time now, but is needing final ingredient, which is rather special.”</i>", parse);
	Text.NL();
	Text.Add("What is it?", parse);
	Text.NL();
	Text.Add("<i>“Fresh ginseng.”</i>", parse);
	Text.NL();
	Text.Add("That shouldn’t be hard to get in a city like Rigard, should it? There must be any number of herbalists who could get her some.", parse);
	Text.NL();
	Text.Add("<i>“You are not listening closely to what Asche is saying, despite her telling you to,”</i> she chides you, clicking her tongue in reproach. <i>“Asche is needing <b>fresh</b> ginseng. All to be found in the city is either dried or cured in herbal brew to preserve them before they are being sold, since ginseng is coming a long way to city from where it is growing. Is usually not problem when it comes to root’s remedial properties, but when it is coming to being reagent in potion… is making ginseng very much useless.</i>", parse);
	Text.NL();
	Text.Add("<i>“There is also second matter of where to get best specimen that Asche desires - is growing by wooded spring in highland basin. Soil there is heavy with mystical energies which when added to cool climate makes ginseng there grow large and containing much power. Problem is being spring lies on land that is territory of zebras, which have not been on best terms with Asche’s kind for generations.”</i>", parse);
	Text.NL();
	Text.Add("All right, now you’re starting to see where this is going. Nodding, you ask Asche to continue.", parse);
	Text.NL();
	Text.Add("<i>“Asche is but one, no matter how powerful her magic, so maybe going herself and using force is not being best idea. Besides, if Asche is causing trouble at their spring, will only make matters worse between clans. Times like this, is best if outsider is one doing getting, maybe can be talking to shamans and convincing them to give one where jackal like Asche would not be listened to.”</i>", parse);
	Text.NL();
	Text.Add("Yeah, what she says does make sense. A neutral party would stand a better chance at negotiation than one who’s disliked on sight. All right, then: you asked for a task, you got a task. There’s the matter of payment, though…", parse);
	Text.NL();
	Text.Add("The jackaless chuckles. <i>“Well, there are choices customer can be having. First one is that customer can be having money, as is traditional way of rewarding questers. Other way is”</i> - she gazes at you, those lovely, dark eyes seeming to grow as they draw you into their depths - <i>“also very traditional reward, although less spoken of. But yes, Asche can be teaching you some things if that is [handsomepretty] customer’s desire.”</i>", parse);
	Text.NL();
	Text.Add("Got it. You’ll have to make a trip out to the highlands, then. Where’s this spring that she speaks of?", parse);
	Text.NL();
	Text.Add("<i>“Asche can be giving you directions. To be waiting a moment, please.”</i>", parse);
	Text.NL();
	Text.Add("She’s as good as her word - a few moments later, Asche passes you a small slip of paper with some hastily scribbled directions on it: northwest from a certain crossroads, then west and in that direction until the ravine to the crag which houses the spring comes into sight. The shopkeeper’s handwriting is quite atrocious, but at least it’s not illegible. Well, time to be off to this spring and see what you find there.", parse);
	Text.Flush();
	
	//TODO Set flag
	Gui.NextPrompt();
}

// TODO LINK
Scenes.Asche.Tasks.Ginseng.OnTask = function() {
	var parse = {
		handsomepretty : player.mfFem("handsome", "pretty")
	};
	Text.Add("<i>“Oh? Customer is back already? Surely could not have lost way in highlands - Asche’s directions are very good. Used to play pranks on stuffy old shamans when Asche was a little girl.”</i>", parse);
	Text.NL();
	Text.Add("You try to imagine the sexy shopkeeper as a little girl - to say that it’s hard would be an understatement of the greatest degree.", parse);
	Text.NL();
	Text.Add("<i>“Nevertheless, potion that is requiring ginseng is very important to Asche, so if [handsomepretty] customer can be hurrying up, she will be most delighted.”</i>", parse);
}

// TODO LINK
Scenes.Asche.Tasks.Ginseng.Failed = function() {
	var parse = {
		himher : player.mfFem("him", "her")
	};
	
	Text.Clear();
	Text.Add("You hang your head and tell Asche that the shaman and his entourage drove you away from the spring.", parse);
	Text.NL();
	Text.Add("<i>“Oh well,”</i> the jackaless replies, disappointment clear in her voice. <i>“Asche is seeing color of zebra magic on you, so shes sees that you at least tried. Maybe she was overestimating customer’s abilities. Perhaps if customer had some of Asche’s stock with [himher], might not have gone so badly… but is over now. Asche supposes she will have to ask someone else to be getting it for her, yes?”</i>", parse);
	Text.Flush();
	
	//TODO, set flag
}

Scenes.Asche.Tasks.Ginseng.Highlands = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Remembering Asche’s directions, you step off the main highland path at the crossroads she’d indicated and set off in a northwesterly direction. Crossing the uneven, hilly terrain is far more tiring than following the mountain trails, and it’s not long before you begin to feel the difference in your muscles.", parse);
	Text.NL();
	Text.Add("At least her directions are good: you’ve walked for little more than an hour before you spot the twin moss-covered arches that Asche mentioned, then another hour’s walk west brings the entrance to the ravine into view. As you were told, you see a long, narrow gash in the mountains, as if someone had taken a cleaver and rent a high plateau in two; from where you stand near the bottom, the lower slopes appear thickly forested and the upper slopes strewn with light sprinkles of snow. The woods seem a sanctuary for life in the grass and shrub-dominated highlands. If that’s what the entrance looks like, surely it must be even lusher further inside…", parse);
	Text.NL();
	Text.Add("Cautiously, you enter the ravine, eyes peeled for any sign of the zebra-morphs whose territory this is. Your footsteps echoed off the ravine’s towering walls - so high that a narrow slit is all that remains visible of the sky - sounding deafeningly loud to you, yet you attract no attention from anything larger than a few rodents and lizards. The reason for that becomes clear as you near the ravine’s other end: stationed by the entrance - or exit, depending on how you look at it - is a zebra-morph shaman and two savage-looking warriors - you believe you’ve heard such as them referred to as ‘braves’. The marked, hooded robes along with the staff propped up against a rock leave no doubt to the shaman’s identity. Likewise, the braves wear little more than loincloths and have accentuated their natural patterning with streaks and stripes of blue body-paint; the end result is certainly quite fearsome in appearance, especially when one considers their bronze-tipped spears.", parse);
	Text.NL();
	if(world.time.IsDay()) {
		Text.Add("Seems like you’ve arrived just in time for food. All three zebras are gathered around a cast-iron pot hanging over a firepit, one of the braves stirring the stew. Judging by the smell wafting over to you it’s spiced gruel of some sort.", parse);
		Text.NL();
		Text.Add("Well, it’s probably for the best - while they’re busy cooking is probably the ideal time for getting the drop on them, if you are so inclined.", parse);
	}
	else {
		Text.Add("Seems like you’ve come at a good time. The two warriors are currently fast asleep on thin bedrolls next to a blazing firepit, leaving the shaman to keep watch. It’s as good a situation as you could hope for sneaking by or getting the jump on them, if you were so minded.", parse);
	}
	Text.NL();
	Text.Add("You weigh your options. How best to proceed?", parse);
	Text.Flush();
	
	//[Approach][Sneak][Fight]
	var options = new Array();
	options.push({ nameStr : "Approach",
		tooltip : "See if you can negotiate with the shamans. Maybe you can come to an agreement of some sort.",
		func : function() {
			Text.Clear();
			Text.Add("Deciding that you should at least try a peaceful way of resolving this conundrum, you call out to the three zebras, holding up your empty hands in the air to signal your intent. They certainly weren’t expecting anyone to come across this place, let alone an outsider like you, and grab their staves, looking quite panicked.", parse);
			Text.NL();
			Text.Add("Seeing that you aren’t threatening, though, they bid you stop a little ways away from them, and the shaman steps forward to greet you. <i>“This basin and its spring have been claimed by the zebra clan, outsider, and are under our jurisdiction. As the land is an important source of remedies for our people, I’m sure you understand why we can’t allow just anyone to enter.”</i>", parse);
			Text.NL();
			Text.Add("So, they’re the guardians of the spring or somesuch?", parse);
			Text.NL();
			Text.Add("<i>“After a fashion. I am guiding new braves from the clan through the final leg of their initiation rites, which requires us to watch over the spring for a year in solitude, eschewing drink, carnal acts, and other such worldly pleasures. Now, outsider, what is your purpose in coming here?”</i>", parse);
			Text.NL();
			Text.Add("You explain that you need a specimen of ginseng from the spring in question in order to make a very important potion for a friend. As you natter on, though, judging by the shaman’s slightly bored expression, you get the impression that your tale of woe probably isn’t going to be enough to convince him to give you goods from his peoples’ sacred grounds. Maybe a little encouragement would be in order to ease things along…", parse);
			Text.Flush();
			
			//[Bribe][Whore]
			var options = new Array();
			options.push({ nameStr : "Bribe",
				tooltip : "See if you can buy off the zebras.",
				func : Scenes.Asche.Tasks.Ginseng.Bribe, enabled : true
			});
			options.push({ nameStr : "Whore",
				tooltip : "A whole year of celibacy, huh… they must be pretty pent-up. Maybe you can whore yourself out for a favor.",
				func : Scenes.Asche.Tasks.Ginseng.Whore, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true
	});
	var tooltip = Text.Parse("Try to slip past the zebras and enter the spring basin while they’re [day].", {day: world.time.IsDay() ? "distracted" : "out of it"});
	options.push({ nameStr : "Sneak",
		tooltip : tooltip,
		func : function() {
			//TODO Make a dex check. If success, PC sneaks by and digs one up, else, fail and fight.
			
			var dex = Math.floor(player.Dex() + Math.random() * 20);
			
			Text.Clear();
			Text.Add("Steeling yourself, you try to plot a path into the basin that’ll get you around the zebras encamped out front - the ravine walls are thickly wooded, and if you climbed high enough and stuck close to the trees you might be able to get through unseen. It’s as good a plan as any; sticking to the path at the bottom isn’t an option, at any rate. ", parse);
			Text.NL();
			Text.Add("Gritting your teeth, you begin the ascent, trying to gain some height on the steep walls; hopefully the vegetation will break your fall if you happen to tumble. It feels like it takes forever, but you manage to climb to a decent height - about four storeys above the ravine floor - and finally begin the task of edging your way through the vegetation and around the small encampment.", parse);
			Text.NL();
			if(DEBUG) {
				Text.NL();
				Text.Add("Dex check: [dex] (vs [goal])", {dex: dex, goal: 80}, 'bold');
				Text.NL();
			}
			if(dex >= 80) {
				var day = world.time.IsDay();
				parse["day1"] = day ? "the zebras are too focused on their fire to look up" : "the weary zebra shaman doesn’t lift his eyes from the path in front of his post";
				parse["day2"] = day ? "" : ", thanks to the bright moon";
				parse["day3"] = day ? "the shaman and his companions haven’t moved from their fire, and don’t even look up as you slip by them" : "the only thing you hear from the braves is their snores, and the shaman looks on the verge of joining them, letting you slip by easily";
				Text.Add("By good fortune, [day1]. While there are a few close moments, you manage to slip past them and into the basin without causing any more noise than the wind through the trees. You carefully descend the ravine walls and take a moment to soothe your aching limbs before heading out in search of what you came here for.", parse);
				Text.NL();
				Text.Add("The search is quick[day2]: the broad-leaved trees surrounding the clear spring have quite a bit of vegetation surrounding them, and it’s clear that the zebras take considerable care of their sacred grounds, tending to the underbrush and making sure the medicinal plants that grow naturally here aren’t overcrowded. With the same luck that carried you into the basin, you manage to find a decent-looking specimen of ginseng within a half-hour, and dig it out of the earth - root, stem and all -  before stowing it away with your other possessions. Your departure is as smooth as your entrance - [day3] and head back through the ravine.", parse);
				Text.NL();
				Text.Add("All right, now to head back to Asche posthaste - you don’t want to risk the ginseng getting stale and having to head all the way back out here again, do you?", parse);
				Text.Flush();
				
				party.Inv().AddItem(Items.Quest.Ginseng);
				world.TimeStep({hour: 1});
				//TODO Set flag
				Gui.NextPrompt();
			}
			else { //Fail
				Text.Add("For a moment everything looks like it’s going smoothly, then you bump into a fist-sized pebble, sending it careening down the steep ravine slope. That in turn knocks into another, rattling down  the thin grass and roots, and another, and another, until a small shower of pebbles, leaves and loose dirt comes cascading down to the ravine floor.", parse);
				Text.NL();
				Text.Add("So much for stealth! A shout comes up, directed at you - down below, the shaman and his companions are already on their feet, having seized their staff and spears. Scowling in frustration, you narrowly dodge a few beams of magic aimed your way, and slide down the ravine to do battle.", parse);
				Text.Flush();
				
				Scenes.Asche.Tasks.Ginseng.Fight();
			}
		}, enabled : true
	});
	options.push({ nameStr : "Fight",
		tooltip : "Since you have the initiative, it’s probably best to get the jump on them while you can.",
		func : function() {
			Text.Clear();
			var day = world.time.IsDay();
			Text.Add("You decide that force is probably going to be the easiest solution to this quandary, and prepare to do battle. It might cause problems for Asche to march in and start bashing skulls, but you’re a filthy, filthy outsider and you doing so probably won’t cause much of a stir.", parse);
			Text.NL();
			if(day)
				Text.Add("Preoccupied as they are, it’s not too hard to get the drop on the zebras guarding the basin’s entrance. They certainly look surprised enough when you come charging into their camp, scrambling for their staff and spears and putting up a hasty defense.", parse);
			else
				Text.Add("You rush straight for the shaman, who visibly shakes himself to alertness and, his eyes widening, screams for the braves to assist him. The two jolt awake, but still look groggy as they scramble for their spears.", parse);
			Text.Add(" Best to press your advantage while you still have it.", parse);
			Text.Flush();
			
			Scenes.Asche.Tasks.Ginseng.Fight();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Asche.Tasks.Ginseng.Fight = function() {
	var enemy = new Party();
	enemy.AddMember(new ZebraShaman(2));
	enemy.AddMember(new ZebraBrave(2));
	enemy.AddMember(new ZebraBrave(2));
	var enc = new Encounter(enemy);
	
	enc.canRun = false;
	enc.onLoss = Scenes.Asche.Tasks.Ginseng.FightLoss;
	enc.onVictory = Scenes.Asche.Tasks.Ginseng.FightWin;
	
	Gui.NextPrompt(function() {
		enc.Start();
	});
}

Scenes.Asche.Tasks.Ginseng.Bribe = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Pulling out your coin purse, you shake it around a little in front of the shaman, making sure its contents jingle around as enticingly as you can make them. Doing your best to speak in a calm and unhurried fashion, you explain that you have no intention of trespassing on the zebras’ lands, but you’d be very grateful if they could spare some of their local produce - just one specimen of ginseng freshly dug up from the earth should do. That can’t be too much to ask, can it? Surely there’s enough to go around?", parse);
	Text.NL();
	Text.Add("Hearing your offer, shaman and braves alike glance at each other. <i>“Bide a moment, please. We must confer amongst ourselves.”</i>", parse);
	Text.NL();
	Text.Add("Why, sure. They can take all the time they need - it’s not as if anyone’s slated to go anywhere, right? The zebras huddle together in a tight circle, murmuring and whispering, for a few minutes, then the shaman breaks away and returns to you, clearing his throat.", parse);
	Text.NL();
	Text.Add("<i>“Well, it <b>has</b> been a good year for the harvesting of various herbs and roots from the spring, outsider. We’re willing to let you have what you seek in exchange for the modest sum of three hundred and fifty coins - you see, we’ll still need to convince the elders that this was a good decision, and you don’t seem like the type who lacks for money.”</i>", parse);
	Text.NL();
	Text.Add("Three hundred and fifty?", parse);
	Text.NL();
	Text.Add("A nod. <i>“No more, no less.”</i>", parse);
	Text.NL();
	Text.Add("Hmm. Seems like they aren’t going to entertain any haggling on your part. What are you going to do here?", parse);
	Text.Flush();
	
	//[Pay][Whore][Fight]
	var options = new Array();
	options.push({ nameStr : "Pay",
		tooltip : "Pay what they want and be done with it.",
		func : function() {
			Text.Clear();
			party.coin -= 350;
			Text.Add("You wanted to buy them off, so you’ll buy them off all right. Digging into your coin pouch, you draw out the requisite amount of money and pass it into the shaman’s waiting hand. Once he’s done counting the payment, he gives the fellows behind him a nod.", parse);
			Text.NL();
			Text.Add("<i>“Go dig up one of the roots by the lakeshore for the outsider here. Those from the zebra clan honor their agreements.”</i>", parse);
			Text.NL();
			Text.Add("The two of them take off at a run, and you wait with the shaman for perhaps half an hour before they return, bearing a large, forked root, with the rest of the plant and plenty of dirt still attached. They don’t get any fresher than that - though there’s little doubt in your mind that they haven’t given you the best of their lot. Wonder how large their prize specimens of ginseng must be… but Asche said nothing about needing a specific size. Carefully, you put away the root and thank the zebra-morphs.", parse);
			Text.NL();
			Text.Add("<i>“We’re a very reasonable people. I’m glad that we came to a mutual understanding, although do keep in mind that an outsider shouldn’t expect to get something every time one turns up. Most of the remedies that grow here are for our own use.”</i>", parse);
			Text.NL();
			Text.Add("Either way, you got what you wanted, and they got what they wanted. Sounds like a good deal. As you’re walking away, though, you overhear snatches of conversation from the apprentice shamans:", parse);
			Text.NL();
			Text.Add("<i>“The outsider actually paid <b>that</b> much for that ginseng? I can’t believe it!”</i>", parse);
			Text.NL();
			Text.Add("<i>“Lowlanders are swimming in money - remember that they aren’t the kind to get only one travelling merchant once a month. With this much dough, we can definitely afford to buy some things for the clan the next time one comes around.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Still…”</i>", parse);
			Text.Flush();
			
			party.Inv().AddItem(Items.Quest.Ginseng);
			world.TimeStep({hour: 1});
			//TODO Set flag
			Gui.NextPrompt();
		}, enabled : party.coin >= 350
	});
	options.push({ nameStr : "Whore",
		tooltip : "Hmm, maybe they’re willing to accept another price…",
		func : Scenes.Asche.Tasks.Ginseng.Whore, enabled : true
	});
	options.push({ nameStr : "Fight",
		tooltip : "Screw this - enough talk! Have at them!",
		func : function() {
			Text.Clear();
			Text.Add("Either you’re unwilling or unable to pay the price - it doesn’t matter in the end, does it? Lunging at the shaman with a growl, you tackle him to the ground even as his fellows grab their spears and run to his aid.", parse);
			Text.NL();
			Text.Add("It’s a fight!", parse);
			Text.Flush();
			
			Scenes.Asche.Tasks.Ginseng.Fight();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}


Scenes.Asche.Tasks.Ginseng.Whore = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	if(player.Gender() == Gender.female && player.Femininity() >= 0) {
		Text.Add("The shaman fidgets uncomfortably at your suggestion and swallows hard. <i>“I… you can’t mean to...”</i>", parse);
		Text.NL();
		Text.Add("Oh? You run your hands across your [skin], lingering over your [breasts] and [butt], then grin at him - and at the bulge on his loincloth, growing by the moment. Who says you can’t?", parse);
		Text.NL();
		Text.Add("<i>“T-the discipline involved in shamanistic rituals requires—”</i>", parse);
		Text.NL();
		Text.Add("<i>“Hey, that’s a fine piece of ass over there,”</i> one of the braves pipes up from behind him. <i>“Best to not let such a treasure get away. If you don’t want it, I’ll be more than willing to take it off your hands.”</i>", parse);
		Text.NL();
		Text.Add("<i>“What the fuck! You can’t be serious!”</i>", parse);
		Text.NL();
		Text.Add("<i>“I am. I mean, we’re all the way out here, and we all know that there’s no actual way to tell whether we’ve been fucking around or not, <b>and</b> you know better than most that it doesn’t matter when it comes to the mystical component of the rites. I don’t know about you, but ten months into this thing, I’m pretty much at my limit. So, I’ll say it again: if you don’t want that fine piece of ass, suit yourself, but one of the roots we dug up yesterday’s a small price to pay from where I’m standing.”</i>", parse);
		Text.NL();
		Text.Add("You lower your voice to a low, sultry whisper and tell the shaman that his companions are right. A good romp for a silly root is the most worthwhile of trades and a good deal for all involved. What’s the problem?", parse);
		Text.NL();
		Text.Add("The shaman looks from you to his fellows a few times. Back and forth, back and forth, back and forth - his loincloth is unable to hide the raging hard-on he’s sporting, and you can already see more than a foot of meaty equine member jutting from underneath.", parse);
		Text.NL();
		Text.Add("<i>“Hey, we can always say that the outsider seduced us, and that we were helpless against her wiles. Everyone knows that outsiders are loose like that - even worse than the jackal-morphs..”</i>", parse);
		Text.NL();
		Text.Add("That semblance of an excuse is apparently enough to push him over the edge. <i>“Oh, all right! Fine! Fine! You’ve got yourself a deal!”</i>", parse);
		Text.NL();
		Text.Add("He might have talked a good game, but the shaman sure is quick when it comes to divesting himself of his robe and loincloth, practically tearing them off his needy body and letting them fall to the ground where they may. At least his staff gets marginally better treatment, with him leaning it against a nearby boulder before getting down to business. The zebra braves are less reserved in their eagerness, letting their spears clatter to the ground as they come charging up, eager to get their piece of tail.", parse);
		Text.NL();
		Text.Add("Oh yes, your body is ready for this. So very, very ready for this. Not that they’re checking, as the sight of three foot-long equine penises in varying degrees of erection says you’d better be, whether you like it or not.", parse);
		Text.NL();
		Text.Add("Grabbing you and hoisting you off your feet, the zebras waste no time in stripping off your clothes until you’re as buck naked as they are, tossing your possessions to the side in the most unceremonious fashion. Without further ado, they dump you on your back, and get straight down to it. The zebras’ rough, potent musk speaks volumes about what’s going through their minds now that the opportunity has presented itself. Rutting, urgency, heat, release—", parse);
		Text.NL();
		Text.Add("Your thoughts are cut short by the shaman yanking your legs apart. There’s a brief burst of sensation as he lines up that throbbing, veined horsecock with your [vag], then pain as he begins to violate you, pounding like a maddened beast with months’ and months’ worth of pent-up sexual frustration. Ignoring your predicament, the first brave in line yanks your head back and forces his massive shaft down your throat.", parse);
		Text.NL();
		
		var zebra = new ZebraShaman();
		
		Sex.Vaginal(zebra, player);
		player.FuckVag(player.FirstVag(), zebra.FirstCock(), 4);
		zebra.Fuck(zebra.FirstCock(), 4);
		
		Text.Add("Your gag reflex protests for a fraction of a second, then is overwhelmed by the sheer amount of dick invading your throat, leaving you barely able to breathe. That’s two, with one more to go - a tiny voice in the back of your mind wonders if whoring yourself out to three horny zebras was the best of ideas. Too late for regrets now, though - you doubt that they’d be able to stop even if they had a mind to do so.", parse);
		Text.NL();
		Text.Add("Now that they’re in position, the shaman and brave begin to pump and thrust away - slowly at first as they get used to stuffing your body, then faster and faster as they throw caution to the wind in their rush to slake their desires. Working in tandem to spitroast you, one thrusting while the other withdraws, they grunt and growl like savage animals tearing at a particularly tasty piece of raw meat. That isn’t too far off the mark, too, considering how thoroughly violated you’re currently being, turned into little more than a set of warm, wet holes for the zebras to fill.", parse);
		Text.NL();
		Text.Add("A moist friction across your [breasts] draws what little attention you have remaining to the third and final zebra - bereft of a good position to get himself off on your breasts, the poor fellow is grinding his equine cock against your [nips], making do with the crumbs that fall from the table of his fellows. ", parse);
		if(player.FirstBreastRow().Size() > 12) {
			Text.Add("With how busty you are, you nevertheless give him a fair deal of pleasure, the brave using your ample melons as best as he can. The feeling of your [breasts] jiggling against his hot, throbbing cock only completes the perfect picture of being filled and used from all directions, with your body working overtime to pleasure all three hungering beasts at once.", parse);
		}
		else {
			Text.Add("He seems like such a poor thing, what with your [breasts] being too small to accommodate him properly, that you do your best to reach out for his cock and take its slick, pulsating length in hand, your fingers encircling it before you begin to stroke him off. The poor sop quivers in delight, and you feel his pre running down the length of his shaft and slopping onto your fingers. Wow, talk about repressed.", parse);
		}
		Text.NL();
		Text.Add("You yourself lose all sense of time or place, fucked thoroughly into submission like the whore you presented yourself as - up to the point where, by some perverse coincidence, each and every one of the trio violating you decides to orgasm at the same time. You twist and writhe on the ground, filled up in front and back alike by the zebras’ baby batter, with even more of it slopping over your [breasts] and running down your torso as the third zebra blasts great gouts of hot seed to paint your [skin], making you thoroughly used inside and out.", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		
		Text.Add("Hell, you don’t even remember if you came yourself. What you <i>do</i> remember, though, is all of them pulling out of and away from you, finally having had some relief for their… ah, aches and pains. You’re dropped in the most ignoble fashion in the puddle of cum you helped with creating, trickles of the sticky fluid running from your mouth and cunt.", parse);
		Text.NL();
		Text.Add("<i>“Spirits above, that was great,”</i> one of them moans, his voice barely more than an exhausted whisper. <i>“Anything’s bound to taste fucking great to the starving.”</i>", parse);
		Text.NL();
		Text.Add("The only replies he gets are pants and moans.", parse);
		Text.NL();
		Text.Add("<i>“Hey, you there. If you’re still alive after that, that is.”</i> He has to pause to catch his breath. <i>“We went flower picking yesterday - what a coincidence. Why don’t you just help yourself? I don’t think we’ll be up for doing much for a bit… anyways, left the baskets in the back of the spring grotto-” his voice trails off, to be replaced by a snore.", parse);
		Text.NL();
		Text.Add("You’ll get what you came for… eventually. Or at least, when you can breathe a little better and your limbs actually work right. For now, sleep seems like the best option…", parse);
		Text.Flush();
		
		party.Inv().AddItem(Items.Quest.Ginseng);
		world.TimeStep({hour: 4});
		//TODO set flag
		Gui.NextPrompt();
	}
	else {
		Text.Add("The shaman raises an eyebrow at your suggestion. <i>“I don’t swing that way. I mean, sure, I’m a bit desperate - we all are, but we’ve been trained, <b>and</b> if it really came to that, we’d have buggered each other by now instead of waiting for an outsider to come along and make the offer. Sorry, no-go.”</i>", parse);
		Text.NL();
		Text.Add("Seems like they aren’t too interested in the offer; different strokes for different folks, as the saying goes, and you just didn’t have what they were interested in. What do you do now?", parse);
		Text.Flush();
		
		//[Bribe][Fight]
		var options = new Array();
		options.push({ nameStr : "Bribe",
			tooltip : "If sex won’t sway them, maybe money will…",
			func : Scenes.Asche.Tasks.Ginseng.Bribe, enabled : true
		});
		options.push({ nameStr : "Fight",
			tooltip : "Screw this (well, not literally), enough talk! Have at them!",
			func : function() {
				Text.Clear();
				Text.Add("They dare reject your advances? Fie! Lunging at the shaman with a growl, you tackle him to the ground even as his fellows grab their staves and run to his aid.", parse);
				Text.NL();
				Text.Add("It’s a fight!", parse);
				Text.Flush();
				
				Scenes.Asche.Tasks.Ginseng.Fight();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

Scenes.Asche.Tasks.Ginseng.FightWin = function() {
	var enc = this;
	SetGameState(GameState.Event);
	
	var parse = {
		
	};
	
	Gui.Callstack.push(function() {
		var day = world.time.IsDay()
		
		parse["day"] = day ? "" : " thanks to the bright moon";
		Text.Clear();
		Text.Add("The deed’s done - the shaman and braves have been knocked out cold, with various cuts and scrapes on their persons - well, cuts and scrapes might be a little understating the matter, but they’ll live. If the shaman’s any good at his job, he’ll patch all of them up just fine. Leaving their unconscious forms behind you, you head into the spring basin to go flower picking.", parse);
		Text.NL();
		Text.Add("The search is quick[day]: the broad-leafed trees surrounding the clear spring have quite a bit of vegetation surrounding them, and it’s clear that the zebras take considerable care of their sacred grounds, tending to the underbrush and making sure the medicinal plants that grow naturally here aren’t overcrowded.", parse);
		Text.NL();
		Text.Add("Today must be your day; you manage to find a decent-looking specimen of ginseng within the half-hour, and dig it out of the earth, root, stem and all. Stowing it away in a sac with your other possessions, you make your escape before the zebras come to, hurrying through the ravine and legging it away back to the crossroads with all due haste.", parse);
		Text.Flush();
		
		party.Inv().AddItem(Items.Quest.Ginseng);
		//TODO set flag
		Gui.NextPrompt();
	});
	Encounter.prototype.onVictory.call(enc);
}

Scenes.Asche.Tasks.Ginseng.FightLoss = function() {
	var enc = this;
	SetGameState(GameState.Event);
	
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Ugh. This isn’t going quite as you planned - maybe Asche wasn’t wrong about violence not being the optimal choice, but it’s a little too late for second thoughts now. You’re trying to decide whether it would be better to disengage or see this through to the bitter end when something hard and heavy connects with the side of your head, knocking you unconscious.", parse);
	Text.NL();
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"] = party.Num() > 1 ? Text.Parse(", [comp] by your side and still out cold", parse) : "";
	Text.Add("You come to some time later face-down in the dirt[c]. That, and the fact that your coin purse is missing, are the only signs that the altercation ever took place - you search around for a bit, and discover that the ravine entrance has been quite thoroughly sealed with fresh-laid stone, no doubt placed there with the shaman’s magics. Seems like the zebras are <i>really</i> determined not to have you back.", parse);
	Text.NL();
	Text.Add("There’s not much you can do now but to head back to Asche and tell the jackaless you failed.", parse);
	Text.Flush();
	
	Gui.NextPrompt();
	//TODO set flag
}

//TODO LINK
Scenes.Asche.Tasks.Ginseng.Complete = function() {
	var parse = {
		himher : player.mfFem("him", "her"),
		hisher : player.mfFem("his", "her"),
		heshe : player.mfFem("he", "she"),
		handsomepretty : player.mfFem("handsome", "pretty")
	};
	
	Text.Clear();
	party.Inv().RemoveItem(Items.Quest.Ginseng);
	
	Text.Add("<i>“Ah! You are having fresh ginseng?”</i>", parse);
	Text.NL();
	Text.Add("Indeed, you do - drawing it out, you wave the long, branched root in front of her like a doggy treat, with much the same effect until the jackaless calms herself.", parse);
	Text.NL();
	Text.Add("<i>“Asche is sorry for reaction, but she is so very excited.”</i> She sniffs the air. <i>“Ginseng is a bit stale, but is still far better than usual dried or cured things that are spending hours in dark, damp warehouses. Now, please to be giving it to Asche so she can finally finish potion.”</i>", parse);
	Text.NL();
	Text.Add("You hand over the root, and watch as Asche brings it over to her alchemy workspace. Producing a cutting board and knife from a nearby drawer, she cuts off a slice from the top and mutters to herself as she pounds away with mortar and pestle, reducing the slice to a thick paste.", parse);
	Text.NL();
	Text.Add("<i>“Must be properly preserving the rest of this, far too much to let go to waste. Would be far more effective if boiled forty times until turning into syrup, but no time… maybe later. Everything is almost ready… perhaps is better if Asche closed the shop, Asche doesn’t need other customers walking in during delicate process. Would nice customer be so kind as to lock front door and turn sign over?”</i>", parse);
	Text.NL();
	Text.Add("Her request is reasonable enough, and you cross the shop to do just that, the latch setting in place with a satisfying click. By the time you get back, Asche already has a flask full of clear liquid bubbling over a burner, and the jackalass is measuring out the ginseng paste into it with a tiny teaspoon. Once she’s done, she picks up the flask and swirls the heated liquid inside a few times, mixing it evenly before setting it down on the bench to cool.", parse);
	Text.NL();
	Text.Add("You can’t help but ask what she’s making.", parse);
	Text.NL();
	Text.Add("<i>“Well, customer did bring final ingredient for Asche, so maybe she can be telling [himher]. Is improvement on old recipe which has kept Asche very pretty over the years, as well as in quite a bit of money. Asche has been very careful in modifying recipe, has done many experiments, and now she is almost done; ginseng should solve problem she was having.</i>", parse);
	Text.NL();
	Text.Add("<i>“Now,”</i> the jackaless says, a coy smile dancing on her lips, <i>“We are now discovering results.”</i>", parse);
	Text.NL();
	Text.Add("Saying that, she tips the flask’s contents into her mouth and swallows.", parse);
	Text.NL();
	Text.Add("<i>“Mm.”</i> Asche smacks her lips, fully aware that you’re watching her. <i>“Maybe is tasting too bitter, could use some spice, but taste is not main purpose of - <b>o-oh</b>.”</i>", parse);
	Text.NL();
	Text.Add("Hastily setting down the beaker lest she drop it, the jackaless moans and yips softly, rubbing her body through the fabric of her sari. The reason for her apparent arousal is soon apparent: her figure is changing, subtly but visibly - Asche was already quite the exotic specimen, but the potion is making her even more remarkable. The changes sweep through her from head to toe - you can see the jackaless’ chest fill out and perk up before your eyes, her full and firm milk makers pushing out against the front of her pure white sari. What little fat there was melts from her slender midriff and flows into her ass, leaving her filigree chain hanging loose on her broadened hips while her buttcheeks plump out and become more shapely.", parse);
	Text.NL();
	Text.Add("The changes don’t stop there, of course. Even her face isn’t left untouched - again, the individual changes are slight, but the combination of the jackaless’ fuller lips, generous eyelashes and shapelier face and svelte jaw is practically astounding now. Her golden-brown fur has gained even more of a delicious, lustrous shine to it, and she takes clear pleasure in running her hands through her fine coat.", parse);
	Text.NL();
	Text.Add("<i>“Well, well,”</i> Asche pants, the jackaless’ breasts heaving with each heavy breath she draws. Reaching beneath the counter - how is there space for everything she must keep there? - she brings out a small mirror and admires herself, clearly pleased with the results. <i>“New version of recipe was more effective than Asche had hoped for. Maybe she used too much mandrake root. Perhaps shall be only giving in small doses, yes? Still want users to be recognising themselves afterwards - and not jumping bones of nearest thing they are seeing, of course. Point of potion is to give subtle, rich beauty, not to turn drinker into bimbo.</i>", parse);
	Text.NL();
	Text.Add("<i>“Now, Asche thinks that good customer has earned something extra as reward for such astounding success,”</i> the jackaless practically purrs, composing herself somewhat despite her obvious arousal before turning to you. <i>“Asche shall not ask again, as she does not like owing favors or debts, so offer only stands now. One-time deal for [handsomepretty] here, yes? Does customer wish to take up offer?”</i>", parse);
	Text.NL();
	Text.Add("It’s clear what the alluring shopkeeper means by that…", parse);
	Text.Flush();
	//TODO Set flags
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Why not? The mystical shopkeeper is definitely willing and able.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Ah, [handsomepretty] customer most certainly has good taste.”</i> A sly grin spreads Asche’s muzzle, widening with each step she takes towards you. <i>“This jackal-morph shall be showing you to the back room now, yes? Asche is a bit too shy to be doing funny business in storefront.”</i>", parse);
			Text.NL();
			Text.Add("Well, if it’ll set her mind at ease.", parse);
			Text.NL();
			Text.Add("With the shop properly closed up, you follow the jackaless as she pushes open a door in the back of the shop and invites you in. Asche’s sleeping quarters are modest but clean: woven reed mats cover much of the wooden floor, supporting a low table on which a small tea set has been neatly arranged. The cups seem to be as much for decoration as for practical purposes, judging by their perfect placement. The jasmine and incense of the shop have been replaced with a refreshing mint smell that emanates from a potpourri diffuser in a corner, and the entire room is lit with a soft light coming from a crystal in one corner.", parse);
			Text.NL();
			Text.Add("Naturally, your attention is drawn to the jackaless’ bed: a comfortable-looking mattress laid out on the floor, strewn with a number of plump cushions. The fabric gleams, completely unlike anything you’ve ever seen before; you can’t help but marvel at its beautiful strangeness. Maybe it came from another plane?", parse);
			Text.NL();
			Text.Add("<i>“Just to be taking a moment while Asche prepares things.”</i> You turn at Asche’s voice to find the jackaless slowly divesting herself of her clothing, reveling in the fact that you’re watching her every movement. Her shawl is the first thing to go, dirty-blond hair spilling out in a long ponytail that reaches the small of her back as she pulls the pure fabric from her head and shoulders. Another deft movement of her fingers has her hair untied, and it billows out in a rich fan, finally free of its constraints.", parse);
			Text.NL();
			Text.Add("<i>“Customer is liking what [heshe] is seeing? But this is only beginning.”</i>", parse);
			Text.NL();
			Text.Add("Her tongue playing across her lips and muzzle, the jackaless begins to disrobe herself, inch after inch of snow-white cloth peeling away to unveil more and more of that dark golden fur. It’s almost like watching a ball of yarn unravel itself - no, a silken cocoon from which the butterfly you helped create is emerging. You soon realize that Asche wears neither panties nor bra, treating you to the unadulterated sight of her ripe, juicy breasts hanging softly from her chest, nipples already stiff and jutting through her fur, just begging to be teased. Or maybe you’d like to start with her blatant mound, her pussy lips thick and swollen with heat…", parse);
			Text.NL();
			Text.Add("Asche hangs her clothes up on a hook on the wall, then saunters towards you, flared hips sashaying and jewellery clinking with every step. Does she know how to dance as well? Your thoughts are cut short by soft, seductive words as she places her hands on your chest. <i>“Perhaps it is time brave customer removes clothes before [heshe] embarresses [himher]self, hmm?”</i>", parse);
			Text.NL();
			Text.Add("Oh, right. You quickly strip yourself down until you’re as naked as she is, then she bids you lie down on the mattress while she produces a small pot of gold-colored ointment. You can smell the jackaless’ light, slightly musky scent, and the way it melds with the mint perfume of the room is arousing, to say the least.", parse);
			Text.NL();
			Text.Add("<i>“Asche shall now paint herself and customer with special concoction to help [himher] better feel and understand sensations,”</i> the jackaless explains as she unscrews the lid of the ointment pot. <i>“Ingredients of ointment are important, but so is pattern; mistake means it is not working, or worse, not having intended effect. To be observing closely.”</i>", parse);
			Text.NL();
			parse = player.ParserTags(parse);
			var gen = "";
			if(player.FirstCock()) gen += " [cocks] stiffening";
			if(player.FirstCock() && player.FirstVag()) gen += " and your";
			if(player.FirstVag()) gen += " [vag] growing damp";
			parse["gen"] = Text.Parse(gen, parse);
			Text.Add("With that, she reaches into the pot and scoops out a fingerful of ointment, carefully tracing it about her eyes. Done with herself, she does the same for you, and so it goes, a bright golden pattern slowly taking shape across both her burnished fur and your [skin], an intricate construction of swirls and waves, with hardly a single straight line to be found. The ointment glistens and glimmers in the muted light, her touch sending sparks dancing across your being. You can’t help but wriggle under the jackaless in response to her ministrations, your[gen].", parse);
			Text.NL();
			Text.Add("<i>“To be relaxing, [handsomepretty] one. Not needing to be so tense,”</i> Asche whispers as she smears more golden ointment across your [skin]. The pattern she’s creating is now radiating outwards from the initial swirls she’s drawn on your body, branching towards your arms and [legs] like the limbs of a tree, warm and cool to the touch at the same time regardless of how contradictory that sounds. At last, though, she’s done, and sets the pot down on the table before beaming at you. <i>“Asche can give you so many gifts, teach you so many things… customer will not be regretting it.</i>", parse);
			Text.NL();
			Text.Add("<i>“Now, what kind of lesson would customer like for [hisher] reward?”</i>", parse);
			Text.Flush();
			
			Scenes.Asche.Sex.Prompt();
		}, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "As exotically alluring as Asche is, you have better things to do. You’ll have the money that was promised.",
		func : function() {
			Text.Clear();
			Text.Add("You shake your head. While Asche is a very lovely jackaless in that sari and shawl of hers, you just don’t feel up to the task. You do your best to decline the offer with as much tact as you can muster.", parse);
			Text.NL();
			Text.Add("<i>“Why, customer is not wishing to enter back room with Asche?”</i> She sets her gaze loose upon your body, and runs her tongue across her muzzle with slow deliberation, finishing up with a smack of her full, rich lips. <i>“Customer has excellent self-restraint, and Asche congratulates [himher]. It will be serving you well in adventures, yes yes. Well then, if customer insists, [heshe] can be having the money.”</i>", parse);
			Text.NL();
			Text.Add("With that, the jackaless pulls out a coin purse from the folds of her sari and sets it on the counter with a satisfying clink. As you scoop up your well-deserved reward, she shakes her head and grins slyly. <i>“Asche is hoping that customer is making right choice and does not regret it later. To be having good day, then.”</i>", parse);Text.NL();
			
			var coin = 500;
			
			party.coin += coin;
			Text.Add("You recieved [coin] coins.", {coin: Text.NumToText(coin)}, 'bold');
			Text.Flush();
			// TODO #all party members present gain a small amount of xp.
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}


