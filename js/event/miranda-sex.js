
import { Scenes } from '../event';


Scenes.Miranda.BarSexOptions = function(options) {
	var parse = {};

	options.push({ nameStr : "Date",
		func : Scenes.Miranda.DatingEntry, enabled : true,
		tooltip : miranda.flags["Dates"] >= 1 ? "Ask her out on another date." : "Ask her out on a walk."
	});
	// TODO: Unlocked either after X dates or after reaching X level of relationship. Until the repeatable dates are written, this will have NO REQUIREMENT.
	if(miranda.flags["Dates"] >= 1) {
		options.push({ nameStr : "Take home",
			func : Scenes.Miranda.TakeHome, enabled : true,
			tooltip : "You both know where this is going to end, so why not skip straight to dessert?"
		});
	}
	options.push({ nameStr : "Sex",
		func : Scenes.Miranda.TavernSexPublicPrompt, enabled : true,
		tooltip : "Ask her if she's up for some sexy times - right here, right now."
	});
	options.push({ nameStr : "Backroom",
		func : Scenes.Miranda.TavernSexBackroomPrompt, enabled : true,
		tooltip : "Invite her to the backrooms for some fun."
	});
}


Scenes.Miranda.TavernSexPublicPrompt = function() {
	var parse = {
		mastermistress : player.mfTrue("master", "mistress")
	};

	var dom = miranda.SubDom() - player.SubDom();
	var nasty = miranda.Attitude() < Miranda.Attitude.Neutral;

	Text.Clear();
	if(nasty || dom > 25)
		Text.Add("<i>“You truly have no shame, my little bitch,”</i> Miranda chuckles. <i>“But since I have an itch that needs scratching, I’ll indulge you.”</i>", parse);
	else if(dom > -50)
		Text.Add("<i>“Sure, I’m always up for a romp,”</i> Miranda grins. <i>“I don’t mind an audience either, I’ve got nothing to hide.”</i>", parse);
	else
		Text.Add("<i>“Of course, [mastermistress]!”</i> Miranda yips happily. <i>“What do you want to do?”</i>", parse);
	Text.Flush();

	//[BJ] TODO
	var options = new Array();
	options.push({ nameStr : "Blow her",
		func : function() {
			Text.Clear();

			Scenes.Miranda.TavernSexPublicBJ();

			Text.Flush();

			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Give Miranda a blowjob under the table."
	});
	//TODO: fix back
	Gui.SetButtonsFromList(options, true, Scenes.Miranda.MaidensBanePrompt);
}





Scenes.Miranda.HomeDescFloor1 = function() {
	var parse = {

	};
	Text.NL();
	Text.Add("What you can see of Miranda’s home is spartan: simple furniture and only sparsely decorated. The stove that you glimpse in the kitchen looks barely used. You assume that she usually eats her food either at the barracks or at the pub. Straight ahead, there is a small living room with several couches arranged in front of a stone hearth. On the wooden floor, there is a large pelt from some huge animal, like a bear. Various weapons are littered around the room, the most conspicuous being the huge two-handed sword hanging over the fireplace.", parse);
	Text.NL();
	Text.Add("Directly on your left inside the hall, there is a locked door, presumably leading down to a cellar. Curiously, there is a heavy bar placed across the door, preventing anything or anyone from opening the door from inside.", parse);
	Text.NL();
	Text.Add("Next to the cellar door is a steep stairway leading up to the second floor, which presumably contains Miranda’s sleeping quarters.", parse);

	miranda.flags["Floor"] = 1;
}

Scenes.Miranda.HomeDescFloor2 = function() {
	var parse = {

	};
	Text.NL();
	Text.Add("You take a moment to survey Miranda’s bedroom. The room looks like it takes up most of the second floor of the building, barring a tiny study. It feels like you’re walking into a warzone. The floor is littered with discarded clothes - some of which don’t seem to belong to Miranda - and a generous selection of sex toys.", parse);
	Text.NL();
	Text.Add("<i>“See anything that catches your fancy? A girl gotta keep herself entertained, you know.”</i> The guardswoman picks up a particularly girthy dildo, over two inches thick and covered in tiny nubs. <i>“The Shop of Oddities has quite a selection.”</i>", parse);
	Text.NL();
	Text.Add("Pushed against the wall, there is a huge bed, able to easily hold four or five people. No doubt, it has seen much use during its lifetime. Investigating the room further, you see a small balcony facing the main street, and a window overlooking the alleyway.", parse);

	miranda.flags["Floor"] = 2;
}

Scenes.Miranda.HomeDommySexLeavingFuckedHer = function() {
	var parse = {
		playername : player.name
	};

	if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry) {
		Text.Add("The two of you set out, returning to your search for the elusive thief.", parse);
		Text.Flush();

		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Residential.street, {minute : 5});
		});
	}
	else if(party.InParty(miranda)) {
		Text.Add("The two of you set out, returning to your quest.", parse);
		Text.Flush();

		Gui.NextPrompt();
	}
	else {
		var dom = miranda.SubDom() - player.SubDom();
		if(dom > 0)
			Text.Add("<i>“Leaving already? I can go again, and rougher than that,”</i> Miranda moans voluptuously. Perhaps another time. <i>“Stop by again some time… little Miranda is always up to fucking a tight hole.”</i>", parse);
		else
			Text.Add("<i>“Mmm… I like it when you’re rough, [playername],”</i> Miranda moans, fingering herself. <i>“You can come back for more of that <b>any</b> time!”</i>", parse);
		Text.NL();

		Gui.Callstack.push(function() {
			Text.NL();
			parse["night"] = world.time.DayTime();
			Text.Add("You bid Miranda farewell and step out into the [night].", parse);
			if(party.Num() > 1) {
				Text.NL();
				parse["comp"] = party.Num() > 2 ? "the rest of your party" : party.Get(1).name;
				Text.Add("Somehow, you make it out the gates in order to rejoin [comp].", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 30});
				});
			}
			else {
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residential.street, {minute: 5});
				});
			}
		});

		if(miranda.Attitude() >= Miranda.Attitude.Neutral && (world.time.hour > 20 || world.time.hour < 4)) {
			Text.Add("<i>“Ya know, it’s kinda late. Why don’t you stay over? I wouldn’t mind sharing my bed with you. Maybe we can squeeze in a quickie before I have to leave in the morning?”</i> she grins.", parse);
			Text.Flush();

			//[Stay][Don’t]
			var options = new Array();
			options.push({ nameStr : "Stay",
				func : function() {
					Text.Clear();
					Text.Add("Miranda scoots over and pats a relatively clean spot beside her. You strip down and join her, using her arm as a pillow. With a grin, she draws you close, resting your head against her breast as her breathing levels out. Soon enough, you join her in a restful slumber.", parse);
					Text.NL();
					Text.Add("You sleep until morning.");
					Text.Flush();

					var func = function() {
						world.StepToHour(8);
						party.Sleep();

						PrintDefaultOptions();
					};

					Gui.NextPrompt(function() {
						Text.Clear();

						Scenes.Dreams.Entry(func);
					});
				}, enabled : true,
				tooltip : "Why not? You’re feeling pretty tired after all."
			});
			options.push({ nameStr : "Don’t",
				func : function() {
					Text.Clear();
					//TODO
					world.TimeStep({hour: 2});
					Text.Add("<i>“Pity, I guess I’ll see you around then,”</i> she says, turning to take a nap.", parse);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Unfortunately, the day isn’t over for you. You’ll have to decline."
			});
			Gui.SetButtonsFromList(options);
		}
		else {
			Text.Add("<i>“I’m going to rest for a while; you can see yourself out, right?”</i> she asks, turning to settle herself in for a more comfortable nap.", parse);
			PrintDefaultOptions();
		}
	}
}

Scenes.Miranda.HomeDommySex = function() {
	var parse = {
		
	};

	parse = player.ParserTags(parse);
	party.location = world.loc.Rigard.Residential.miranda;

	Text.NL();
	Text.Add("You are standing in the murky hallway just inside Miranda’s house, the doggie herself huffing and panting in your arms. She is really starting to get into it, kissing your neck and caressing your back and [butt] with her hands.", parse);
	if(miranda.flags["Floor"] == 0) {
		Scenes.Miranda.HomeDescFloor1();
	}
	Text.NL();
	Text.Add("<i>“How do you want me?”</i> she moans softly in your ear. <i>“Decide quickly, or I might decide myself.”</i> One of her hands trail downward, pawing at her britches in order to free her stiffening monster cock from its confines.", parse);
	Text.Flush();

	var cocksInVag = player.CocksThatFit(miranda.FirstVag(), false, 5);
	var cocksInAss = player.CocksThatFit(miranda.Butt(), false, 5);

	//[Fuck vag][Fuck anal][Ride vag][Ride anal][Cellar/Dungeon]
	var options = new Array();
	options.push({ nameStr : "Fuck vag",
		func : function() {
			Scenes.Miranda.HomeDommySexFuckDobieVag(cocksInVag);
		}, enabled : cocksInVag.length > 0,
		tooltip : "Take her upstairs and fuck her."
	});
	options.push({ nameStr : "Fuck anal",
		func : function() {
			Scenes.Miranda.HomeDommySexFuckDobieAss(cocksInAss);
		}, enabled : cocksInAss.length > 0,
		tooltip : "The dommy doggie likes giving, let’s see if she likes receiving."
	});
	if(player.FirstVag()) {
		options.push({ nameStr : "Ride vag",
			func : function() {
				Scenes.Miranda.HomeDommySexRideDobieCockVag();
			}, enabled : true,
			tooltip : "Pin Miranda on her back and ride her like there’s no tomorrow."
		});
	}
	options.push({ nameStr : "Ride anal",
		func : function() {
			Scenes.Miranda.HomeDommySexRideDobieCockAnal();
		}, enabled : true,
		tooltip : "Take that juicy cock of hers for a ride she won’t soon forget."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Miranda.HomeDommySexRideDobieCockVag = function() {
	var parse = {
		playername : player.name,
		master : player.mfFem("master", "mistress")
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, null, "2");

	Text.Clear();

	Scenes.Miranda.HomeDommySexRideDobieCockShared();

	var dom = player.SubDom() - miranda.SubDom();

	Text.NL();
	if(dom > 25)
		Text.Add("<i>“I’ve been a good girl, right?”</i> Miranda pants, looking up at you with puppy eyes. <i>“Will [master] give me a treat?”</i>", parse);
	else if(dom > -25)
		Text.Add("<i>“I think you want this as badly as I do,”</i> she huffs, stroking herself while she waits for your [vag] to descend. <i>“If you have a needy hole, my cock’s always ready!”</i>", parse);
	else
		Text.Add("<i>“Come on, what are you waiting for?”</i> Miranda huffs, grinning as she caresses your bare [hip]. <i>“I’m a dog, you know. I can smell a bitch in heat from a mile away, and your crotch is practically soaked! Just have a seat on little Miranda, and everything will be alright.”</i>", parse);
	Text.NL();
	Text.Add("Ignoring her banter, you lower yourself, just barely allowing the tip of her crimson member to rub against your folds. ", parse);
	if(dom > 0)
		Text.Add("The dobie tries to contain herself, shivering as you tease her with your wet entrance. From her expression, it takes an act of will to restrain her instincts, which makes your sensual torment all the more sweet.", parse);
	else {
		Text.Add("The dobie is quick to thrust her hips upward, letting out an indignant growl as you pull just out of her reach. You hold the reins this time, and you’re not about to turn them over just yet.", parse);
		Text.NL();
		Text.Add("<i>“Enough teasing - you know you want it too!”</i> she complains.", parse);
	}
	Text.NL();
	Text.Add("You hover there for a moment longer, letting the sweet promise of your hot cunny mesmerize the guardswoman. You have her in quite a nice position, but there’s a hungry glint in her eyes of a predator waiting to spring.", parse);
	Text.Flush();

	var stickymiranda = false;

	//[Take oral][Fuck][Submit]
	var options = new Array();
	options.push({ nameStr : "Take oral",
		func : function() {
			Text.Clear();
			if(dom < -25) {
				Text.Add("An incredulous look crosses Miranda’s face at your demand, followed by her breaking out into laughter. She places a firm hand on your hip, and slowly drives her cock home, impaling you on her rigid shaft. You let out a surprised yelp, but are unable to push her off. The grinning dobie just grins at your fidgeting attempts to escape her.", parse);
				Text.NL();

				Sex.Vaginal(miranda, player);
				player.FuckVag(player.FirstVag(), miranda.FirstCock(), 4);
				miranda.Fuck(miranda.FirstCock(), 4);

				Text.Add("<i>“You whimper and whine, but your body tells a different tale,”</i> Miranda growls into your ear as she pulls you down into a tight embrace. <i>“If you don’t want me there, how come your pussy is clenching around my cock so tightly, refusing to let go?”</i>", parse);
				Text.NL();
				Text.Add("She’s right… that thick piece of dog-meat feels wonderful inside your sensitive passage, and she hasn’t even gotten to the knot yet. Letting out a sigh, you surrender to your mistress’s whims, letting her roll you over on your back.", parse);
				Text.NL();
				Text.Add("<i>“Now then, does my little pet want a ride?”</i> You nod eagerly, your flitting dreams of dominance shattered by the incessant pounding of Miranda’s girthy battering ram.", parse);
				Text.NL();
				Scenes.Miranda.HomeDommySexRideDobieCockVagSubmit();
				return;
			}
			else if(dom < 25)
				Text.Add("<i>“My, aren’t you taking airs, [playername],”</i> the dobie glowers, her eyes searching yours. <i>“But fair enough. I will be getting a piece of that later anyways.”</i>", parse);
			else
				Text.Add("Wordlessly, the dog-morph moves to obey.", parse);
			Text.Add(" You shift your [hips] forward, offering her access to your nethers. If she’s a good girl, she will get what she wants, but for now she better put that mouth of hers to work.", parse);
			Text.NL();

			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Miranda quickly digs in, her tongue eagerly lapping at your [cocks]. Her eyes lock with yours as her hands roam, trying to judge your reactions as she explores your body. You look down confidently at the herm, satisfied at her compliance. It feels wonderful when she wraps her lips around[oneof] your shaft[s], alternately sucking and stroking you.", parse);
				Text.NL();

				Sex.Blowjob(miranda, player);
				miranda.FuckOral(miranda.Mouth(), player.FirstCock(), 2);
				player.Fuck(player.FirstCock(), 2);

				parse["grunts"] = player.mfFem("grunts", "moans");
				Text.Add("Spurred on by your encouraging [grunts], the guardswoman grows bolder, taking more and more of your member. There’s a limit to what she can do from this angle though, so you decide to help her out, leaning over her and placing your [hand]s on the bed behind her. From your new position, you’re free to move yourself, and able to penetrate much deeper than before. ", parse);
				if(player.NumCocks() > 1)
					Text.Add("Your other dick[s2] rub[notS2] against her face as you grind, leaving sloppy drops of pre smeared across her forehead. ", parse);
				Text.Add("The change hasn’t escaped Miranda, who voices a muffled, half-hearted complaint. Too bad her mouth is too filled with cock for you to hear the words.", parse);
				Text.NL();
				Text.Add("For a while, the burning need in your loins is subdued by a sudden urge to dominate the horny morph, and you hump away, enjoying the feeling of her hot, tight throat. She still has some fighting spirit left though; even as her mouth is being filled by your throbbing cock, the naughty doggie sneaks her fingers in from below, making you gasp as she plunges them into your snatch.", parse);
				Text.NL();
				parse["cl"] = player.FirstVag().clitCock ? "" : Text.Parse(", her thumb prodding at your [clit]", parse);
				parse["c"] = player.NumCocks() > 1 ? " and splashing all over her face and bed" : "";
				Text.Add("Your stamina is short lived with Miranda’s digits probing your soddy depths[cl]. With the dual stimulation, it’s not long before you cry out and cum, pouring your seed down the herm’s gullet[c]. When you finally pull out, she’s a panting mess, though she hasn’t forgotten her promised reward.", parse);

				if(player.NumCocks() > 1) stickymiranda = true;
			}, 1.0, function() { return player.FirstCock() && dom > 0; });
			scenes.AddEnc(function() {
				parse["c"] = player.FirstVag().clitCock ? " the base of" : "";
				Text.Add("Miranda quickly digs in, burying herself in your wet, needy pussy. Her being a dog gives her quite the proficiency at lapping; her long, flexible tongue seeks out every crevice of your feminine sex, hungrily slurping up your juices. The dobie’s cold, wet nose prods[c] your [clit], her eagerness making you gasp in delight.", parse);
				Text.NL();

				Sex.Cunnilingus(miranda, player);
				miranda.Fuck(null, 2);
				player.Fuck(null, 2);

				Text.Add("<i>“Does it feel good, [master]?”</i> she queries, her tongue lolling playfully. You respond with a frustrated moan, a hand in her hair holding Miranda in place as you shove her muzzle back where it belongs: eating out your cunt. The guardswoman is quick on the uptake and returns to the task with redoubled fervor.", parse);
				Text.NL();
				Text.Add("Her hands refuse to be idle, exploring your body and probing you relentlessly. She trails a line down your side, barely touching your hip as her paws bury themselves deep between your ass cheeks, and not-so-gently seek out your hidden rosebud within.", parse);
				Text.NL();
				Text.Add("You squirm in pleasure - the girl just doesn’t let up! - and before long the throes of orgasm are upon you. You let out a gasping moan as your nethers convulse, desperately grasping after a cock that isn’t there. ", parse);
				if(player.FirstCock())
					Text.Add("Jets of cum burst from your [cocks], basting the herm and her bed in long ropes of sticky cock-batter. ", parse);
				Text.Add("It’s a while before your hips finally stop shaking, your recovery not helped by Miranda continuing to lap on your twitching pussy. She, at least, hasn’t forgotten about her promised reward.", parse);
				if(player.FirstCock()) stickymiranda = true;
			}, 1.0, function() { return true; });
			scenes.Get();

			var cum = player.OrgasmCum();
			player.AddLustFraction(0.5);

			Text.NL();
			Text.Add("<i>“Now, don’t you think it’s time to give <b>me</b> some lovin’, [playername]?”</i> she asks pointedly, a smug smile playing on her lips. <i>“My cock’s all stiff and aching, and it’s pretty bummed at being left out...”</i>", parse);
			Text.NL();
			Text.Add("She <i>has</i> earned it, you concede. Having just climaxed, you’re a bit unsteady, but with the help of Miranda’s guiding hands you’re soon back in your former position, straddling her rigid shaft, the tip playing at your raw entrance. This time, the dobie doesn’t wait for your permission before pulling you down and thrusting her thick crimson pillar into your [vag].", parse);
			Text.NL();

			player.subDom.IncreaseStat(75, 1);
			miranda.subDom.DecreaseStat(-50, 1);
			world.TimeStep({minute: 15});

			Scenes.Miranda.HomeDommySexRideDobieCockVagFuck(stickymiranda, true);
		}, enabled : true,
		tooltip : "No, she’s not going to have it that easy. How about <i>she</i> pleasure <i>you</i> first?"
	});
	options.push({ nameStr : "Fuck",
		func : function() {
			Text.Clear();
			Text.Add("Well, let's see if she’s ready for <i>this</i>. In a sudden motion, you thrust your [hips] downward, impaling yourself on the dog-herm’s cock all the way to the knot. Your ferocity catches Miranda off-guard, though she’s quick on the uptake, placing her hands on your hips to help guide your frenzied fucking.", parse);
			Text.NL();
			Scenes.Miranda.HomeDommySexRideDobieCockVagFuck(stickymiranda, false);
		}, enabled : true,
		tooltip : "You can’t wait to get started!"
	});
	options.push({ nameStr : "Submit",
		func : function() {
			Text.Clear();
			if(dom < -25) {
				Text.Add("Your slight hesitation and the faint blush on your cheeks are the only signs of submission the dommy dobie needs. With a smug grin, she flips you over on your back, her cock hovering at your entrance.", parse);
				Text.NL();
				Text.Add("<i>“There, isn’t this more comfortable for you?”</i> she murmurs, giving you a playful lick.", parse);
			}
			else if(dom < 25) {
				Text.Add("<i>“You sure? I thought you wanted to be on top this time,”</i> Miranda jabs playfully. She clearly enjoys watching you squirm. <i>“But if you insist...”</i> Before you know it, you’re on your back with a panting herm pressing the tip of her cock against your wet opening.", parse);
			}
			else {
				Text.Add("<i>“You’re too kind, [master],”</i> she murmurs, pulling you down into a kiss. <i>“Don’t think I’ve forgotten how to take charge; I’m gonna show you a <b>real</b> good time...”</i>", parse);
				Text.NL();
				Text.Add("Before you know it, you’re on your back with the horny herm on top, the tip of her cock searching for entrance into your eager snatch.", parse);
			}
			Text.NL();
			Text.Add("A second later, Miranda is buried inside your needy pussy to the hilt, the bulge of her deflated knot threatening to spread you even further. Just as quickly as she thrusts inside you, she almost pulls out, leaving only her tip and an aching emptiness inside you.", parse);
			Text.NL();

			Sex.Vaginal(miranda, player);
			player.FuckVag(player.FirstVag(), miranda.FirstCock(), 4);
			miranda.Fuck(miranda.FirstCock(), 4);

			Scenes.Miranda.HomeDommySexRideDobieCockVagSubmit(true);
		}, enabled : true,
		tooltip : "There’s something about that glare that just makes you want to give in and let her take you..."
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Miranda.HomeDommySexRideDobieCockVagFuck = function(stickymiranda, came) {
	var dom = player.SubDom() - miranda.SubDom();
	var parse = {
		playername : player.name,
		master : dom < 25 ? player.name : player.mfFem("master", "mistress"),
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	Sex.Vaginal(miranda, player);
	player.FuckVag(player.FirstVag(), miranda.FirstCock(), 3);
	miranda.Fuck(miranda.FirstCock(), 3);

	parse["c"] = came ? " still-aching" : "";
	Text.Add("<i>“Damn, you’re tight, [master]!”</i> the dobie yips happily. The two of you quickly settle into a rhythm, rutting against each other with mutual fervor. Miranda’s turgid member repeatedly barges into your[c] cunt, her pointed tip breaking the way for her significantly thicker shaft.", parse);
	Text.NL();
	Text.Add("Each time you lower yourself on her hermhood, your netherlips strain around the deliciously thick swelling at the base of her dick. At the height of the doggie’s pleasure, it’ll swell even thicker, locking anyone caught in her intimate embrace and preventing them from pulling away. You suspect that time could be upon you any moment now.", parse);
	Text.NL();
	if(dom < -25) {
		Text.Add("<i>“Come here, you,”</i> Miranda growls, a hand at the back of your neck pulling you down into a rough kiss. When you resurface, gasping for air, that predatory grin of hers is back with a vengeance. <i>“You’re doing pretty good, but why don’t you let me be on top for a while - show you how a bitch fucks?”</i>", parse);
		Text.NL();
		Text.Add("Not waiting for your answer, the dobie flips you over on your back, rolling on top of you. <i>“My turn,”</i> she huffs, slamming her cock into your [vag]. She’s not messing around either; her position gives her full leeway to rut her hips, which she does as fast as she is able.", parse);
		Text.NL();
		Scenes.Miranda.HomeDommySexRideDobieCockVagSubmit();
		return;
	}
	Text.Add("First, however, you’re going to get as much out of her as possible. Miranda gasps as you repeatedly impale yourself on her shaft, your vaginal walls clenching tightly around it. ", parse);
	if(player.FirstCock())
		Text.Add("Your [cocks] bob[notS] in time with your bouncing, a throb going through [itThem] each time you slam your hips down. The dobie is right in your firing zone, but she doesn’t seem to care, encouraging you to keep going with rhythmic thrusts of her hips. ", parse);
	Text.Add("<i>“Just… a bit longer...”</i> she pants. You can feel her throb inside you, her member somehow growing even girthier. Your stretched passage can almost trace the veins on the hot pillar, and you can definitely feel the the rumblings deeper within her body as her climax nears.", parse);
	Text.NL();
	Text.Add("<i>“Fuuuuuck!”</i> the morph yells, pulling you down hard, trying to push her rapidly swelling knot inside you. The sudden girth is enough to trigger your own climax, making you clench even harder around the pulsating shaft. ", parse);
	if(player.FirstCock()) {
		parse["m"] = stickymiranda ? " yet another serving of" : "";
		Text.Add("You baste Miranda in[m] your cum, plastering her with strands of white seed, much like the ones about to flood your pussy. ", parse);
		stickymiranda = true;
	}
	Text.Add("You’re trembling as your juices mix with hers and trickle down on her deliciously thick knot… just a move of your hips, and she’ll have you tied completely...", parse);
	Text.NL();

	var cum = player.OrgasmCum();

	Text.Flush();
	//[Knot][No knot]
	var options = new Array();
	options.push({ nameStr : "Knot",
		func : function() {
			Text.Clear();
			Text.Add("Even as you feel the first jet of dog-seed pour inside your used sex, you press down <i>hard</i> knowing that your only shot of forcing Miranda’s massive knot inside you is before it has time to expand to its full size. It’s an incredibly tight fit, but in a joint effort and with the aid of gravity, your crotches finally grind together, sealed with a bulge the size of a coconut.", parse);
			Text.NL();
			Text.Add("With nowhere else to go, the herm’s load floods your cunt and the womb within, making your belly rapidly swell with each throbbing ejaculation. Not even the airtight seal of your pussy around the base of her knot is enough to withstand the pressure building up, and a slight trickle seeps out. After what seems like an eternity, the dobie’s molten barrage of your uterus cedes, though not before your stomach has swollen to a large dome.", parse);
			Text.NL();
			Text.Add("The two of you gradually come down from your euphoric high, and you collapse on top of the spent herm, her still-hard member buried and sealed inside you together with a copious amount of cum.", parse);
			Text.NL();
			if(stickymiranda) {
				Text.Add("<i>“Since we are going to be like this for a while, mind helping me clean up?”</i> Miranda murmurs, her flexible tongue licking a thick strand of your seed from her muzzle.", parse);
				Text.NL();
				if(dom > 0) {
					Text.Add("Sure… you can help gather it up if she’s willing to gulp it down, you reply, grinning.", parse);
					Text.NL();
					Text.Add("<i>“A fair deal,”</i> she smiles.", parse);
				}
				else
					Text.Add("You nod, blushing a bit at how much of a mess you made of the herm.", parse);
				Text.NL();
				Text.Add("Together, the two of you manage to get most of the cum out of her fur, though it’s still a while longer until her knot finally deflates and you are able to separate.", parse);
			}
			else {
				Text.Add("<i>“I can tell that <b>someone</b> doesn’t want to miss even a drop of my seed,”</i> Miranda grins at your eagerness. <i>“You seeking to carry a litter of my puppies, [playername]?”</i>", parse);
				Text.NL();
				Text.Add("Well… either way, you’re stuck here for a while. You cuddle together until her knot finally deflates, allowing her to pull out with a loud, sloppy plop.", parse);
			}
			Text.Add(" A gush of cum pours out from your gaping gash, though you still have a visible bulge on your belly from her massive load; moving around is going to be a bit tough for a while.", parse);
			world.TimeStep({hour: 1, minute: 30});
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Just a little more... make her breed you!"
	});
	options.push({ nameStr : "No knot",
		func : function() {
			Text.Clear();
			Text.Add("You strain your [hand]s on her chest, barely managing to overpower the exhausted doggie before she pulls you down on her knot. Realizing that she’s grown too big to fit inside you, Miranda abandons her efforts, letting her hands fall down to her sides while she rides out her orgasm. Knot or not, you can still feel copious amounts of dog-seed basting your innards, though as least as much escapes your cunt to pool between Miranda’s legs.", parse);
			Text.NL();
			Text.Add("<i>“Mm… you’re quite a good fuck, [playername],”</i> the herm sighs contentedly. <i>“Why don’t you let me show my stuff next time, though?”</i>", parse);
			Text.NL();
			Text.Add("You’ll think about it. ", parse);
			if(player.FirstCock()) {
				Text.Add("Perhaps next time, it’ll be <i>your</i> cock in <i>her</i> pussy instead.", parse);
				Text.NL();
				Text.Add("<i>“I could live with that, I suppose,”</i> she shrugs. ", parse);
			}
			parse["m1"] = stickymiranda ? " herself and" : "";
			parse["m2"] = stickymiranda ? " both of" : "";
			parse["is"] = stickymiranda ? "are" : "is";
			Text.Add("<i>“Now, how about you help me clean up this mess?”</i> Miranda gestures to[m1] the bed,[m2] which [is] soaked in cum.", parse);
			Text.NL();
			Text.Add("Least you could do after that, you suppose.", parse);
			world.TimeStep({hour: 1});
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "That thick bulge is too intimidating - leave it out!"
	});
	Gui.SetButtonsFromList(options, false, null);

	Gui.Callstack.push(function() {
		Text.NL();
		player.subDom.IncreaseStat(75, 1);
		miranda.subDom.DecreaseStat(-50, 1);

		Scenes.Miranda.HomeDommySexLeavingFuckedHer();
	});
}

Scenes.Miranda.HomeDommySexRideDobieCockVagSubmit = function(submit) {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Text.Add("Once she’s gotten started, there’s only one thing that’s gonna stop her: pouring a gallon of hot cum into your womb. Each time she drives into you, you can feel her heavy balls slap against you; a potent promise of future stickiness if ever there was one.", parse);
	Text.NL();
	parse["b"] = player.FirstBreastRow().Size() > 3 ? Text.Parse(" and a quick grope on your [breasts]", parse) : "";
	parse["l"] = player.HasLegs() ? " on all fours" : "";
	parse["s"] = submit ? "to hear you scream for more until your body can’t take it any longer" : "your defiance gradually turning to begging adoration";
	Text.Add("<i>“It goes against my instincts to fuck you like this,”</i> the herm grunts, leaning in closer for a kiss[b]. <i>“They tell me to turn you over[l] and pound you senseless, breed you and seal the deal with my knot. I bet you’d love that, wouldn’t you?”</i> she grins. <i>“But… it’s also fun to see your face as I fuck you, [s].”</i>", parse);
	Text.NL();
	Text.Add("Your reply catches in your throat as she dives in for another kiss, wrestling your tongue into submission. All the while, her hips are a blur, ruthlessly pistoning in and out of your aching pussy. True to her word, the dommy dobie traps your head between her arms as she leans down over you, her taut nipples brushing against your [breasts]. There’s no escaping her eyes, burning with lust as they bore into you; locking you with her gaze, the hermaphrodite passionately asserts her dominance over you.", parse);
	Text.NL();

	var cum = player.OrgasmCum();

	Text.Add("<i>“You know what’s coming next, don’t you?”</i> she barks, her breathing coming in short bursts. With her massive shaft throbbing erratically deep in your loins, it’s hard not to. Both of you groan when she pushes her swelling knot past the last remnants of your ravaged defenses, sealing her inside you even as you feel the first hot cascade of her potent load erupt in your [vag]. You aren’t far behind her, your vaginal walls clamping down as best as they can around the girthy rod and the even thicker knot.", parse);
	if(player.FirstCock()) {
		parse["cum"] = cum > 6 ? "outshining even Miranda’s in volume" :
		               cum > 3 ? "comparable to Miranda’s" : "pathetic in comparison to Miranda’s";
		Text.Add(" Your own climax, [cum], splatters uselessly all over your chest, soaking you, the herm and her bed in sticky seed.", parse);
	}
	Text.NL();
	Text.Add("When the torrential stream is finally extinguished, your belly is significantly rounder than before, stuffed to the brim with potent dog-cum. Bred like a bitch in truth… this perhaps wasn’t what you intended at first, but you can’t deny the overwhelming feeling of contentment as you lie there caressing your bloated tummy.", parse);
	Text.NL();
	Text.Add("<i>“Come back for another serving any time,”</i> Miranda growls familiarly, nuzzling beside you. There’s a sharp tug of pleasure in your used pussy as the herm plops over on her side, her knot dragging you with her. It’s quite a while before her knot deflates and she’s finally able to pull out again.", parse);
	Text.NL();

	player.subDom.DecreaseStat(-75, 1);
	miranda.subDom.IncreaseStat(75, 2);
	world.TimeStep({hour: 1, minute: 30});

	Scenes.Miranda.HomeDommySexLeavingFuckedHer();
}

Scenes.Miranda.HomeDommySexFuckDobieAss = function(cocks) {
	var pCock = cocks[0];

	var parse = {
		playername    : player.name,
		boyGirl       : player.mfTrue("boy", "girl"),
				
	};
	parse = player.ParserTags(parse);
	parse = miranda.ParserTags(parse, "m");
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	var dom = miranda.SubDom() - player.SubDom();

	if(pCock.isStrapon)
		parse["multiCockDesc"] = function() { return pCock.Short(); };

	Text.Clear();
	if(dom < -10)
		Text.Add("You twirl her around and grope her fuckable ass, whispering into her ear that you have a very special plan for her. Giving her a slap on the butt, you send her off in the direction of the stairs. Following right behind her, you get a perfect view of your target as you make your way up to the bedroom.", parse);
	else
		Text.Add("Smiling coyly, you tease that you have something special in mind for the dommy herm. <i>“And what would that be?”</i> Miranda grins, making a grab for you. You deftly take a step back, luring her after you. Pulling her behind you and barely avoiding her caress, you make your way up the stairs and into her bedroom.", parse);
	if(miranda.flags["Floor"] < 2) {
		Scenes.Miranda.HomeDescFloor2();
	}
	else {
		Text.Add(" The room is in as big of a mess as usual with scattered toys and articles of clothing spread on and around the unmade bed.", parse);
	}
	Text.NL();
	Text.Add("<i>“A bit messy, I know,”</i> Miranda says apologetically, gesturing at the disarray. <i>“Just the way I like it!”</i> She pulls you in for a kiss, fondling your [butt] possessively.", parse);
	if(dom > 0) {
		Text.Add(" <i>“So what’s your special plan, hotness? Your lips wrapped around my cock?”</i>", parse);
		Text.NL();
		Text.Add("Not exactly.", parse);
	}
	else {
		Text.Add(" <i>“As long as your special plan involves me getting railed, I’m happy.”</i>", parse);
		Text.NL();
		Text.Add("She’s right on the money on this one.", parse);
	}
	Text.Add(" Pushing Miranda down onto the bed, you flip her over on all fours. In the blink of an eye, you’ve ripped off the dobie’s britches and panties, baring her well-shaped and gropable butt. Between her rounded cheeks rests your target: her tight little rosebud. May as well introduce yourself.", parse);
	Text.NL();
	Text.Add("<i>“O-oh!”</i> the guardswoman yelps as you press your thumb against her anus, announcing your intentions. ", parse);
	if(miranda.sex.rAnal < 5)
		Text.Add("<i>“Hng… I like anal, but I’m not usually on the receiving end,”</i> she pants.", parse);
	else
		Text.Add("<i>“You know how I like it, [playername],”</i> she pants, wiggling her butt enticingly as she helps you work your way in.", parse);
	Text.NL();
	if(!pCock.isStrapon)
		Text.Add("Whipping out your [cocks],", parse);
	else
		Text.Add("Securing the straps on your [cock],", parse);
	parse["biggest"] = player.NumCocks() > 1 ? " biggest" : "";
	Text.Add(" you grind your[biggest] shaft between Miranda’s butt cheeks - a promise of what is to come. The herm squirms and whimpers as you hotdog her, your [hand]s gripping her ass tightly.", parse);
	Text.NL();
	Text.Add("<i>“L-lube,”</i> she pants, fumbling with a bottle. ", parse);
	if(dom < 0 && Math.random() < 0.5)
		Text.Add("You swat it away, ignoring her growling complaints as you apply a generous amount of saliva to your [cock], preparing Miranda for penetration with your own natural lubricant. Her eyes show a hint of hesitation, but she grits her teeth and accepts it.", parse);
	else
		Text.Add("You quickly swipe the bottle, pouring nearly all of its contents on your [cock] and down Miranda’s crack. A bit more grinding has her ass ready for action, puckered and eager.", parse);
	Text.NL();
	parse["stud"] = dom < -25 ? player.mfTrue("master", "mistress") : "stud";
	Text.Add("<i>“Well, what are you waiting for, [stud]?”</i> she pants, peeking over her shoulder at you. Whether she’s ready or not, you don’t hesitate as you ram the [cockTip] of your [cock] into her tight anus, quickly breaching her sphincter and thrusting inside. The dommy doberman lets out a squeal as you rub against her prostate on your way into her depths, her own cock twitching between her legs.", parse);
	Text.NL();

	Sex.Anal(player, miranda);
	player.Fuck(pCock, 3);
	miranda.FuckAnal(miranda.Butt(), pCock, 3);

	parse["boyGirl"] = player.mfTrue("boy", "girl");
	if(dom < 0)
		Text.Add("<i>“Mmm… claim me, you bad [boyGirl],”</i> the guardswoman moans. <i>“Fuck that ass like it belongs to you!”</i> Her wish is your command.", parse);
	else
		Text.Add("<i>“Don’t… get too cocky, [playername],”</i> the guardswoman moans. <i>“Next time, it’s your turn to be the - hngh! - bottom.”</i> We’ll see about that.", parse);
	Text.Add(" You ignore her muffled yips and groans as you plunge your [cock] deeper into her, gritting your teeth as her colon clamps down on your shaft. ", parse);
	parse["b"] = player.HasBalls() ? Text.Parse(" as your [balls] slap against hers", parse) : "";
	if(pCock.length.Get() < 20)
		Text.Add("Before long, your hips bump against her rear, and you sigh contentedly[b].", parse);
	else if(pCock.length.Get() < 35)
		Text.Add("It’s going to take some work until you can hilt the herm, but she’s a big girl. You’re sure she can take it.", parse);
	else
		Text.Add("No amount of lube is going to help you hilt your monster cock inside the straining asshole of the herm, but you’ll be damned if you don’t try.", parse);
	Text.NL();
	Text.Add("You build up to a slow rhythm, showing more care than Miranda usually does to her victims.", parse);
	if(dom < -25)
		Text.Add(" Plenty of time to get rough later. You plan to, in fact.", parse);
	parse["dom"] = dom > 25 ? ", even if she won’t admit it" : "";
	Text.Add(" The guardswoman braces herself on her elbows, pushing back against you. Despite her usual attitude, she wants this - needs this. Now that you have scratched her itch, it’s not going to go away until she’s gotten a good railing, and she knows it[dom].", parse);
	Text.NL();
	Text.Add("Not one to keep a lady waiting, you increase your pace, rocking your [hips] as you rail the horny dog. She is gripping the sheets tightly, biting down on a cum-stained pillow. There is no question about her liking her rough ride though as her tail is wagging uncontrollably just above her impaled back door, silently urging you to continue, to fuck her until she cries out in ecstasy.", parse);
	if(!pCock.isStrapon)
		Text.Add(" You grunt as you deposit a generous load of pre-cum into Miranda’s tight hole, slightly easing your passing. It’s going to be needed in the hours to come.", parse);
	Text.NL();
	Text.Add("Miranda is hardly a passive lover, and you have to constantly wrestle with her for control. After railing her from behind for ten minutes or so, she manages to twist around on her back, facing you. The herm’s monster cock is standing up like a mast, trickling pre-cum. Her hands shaking slightly, the guardswoman tears off her top, unleashing her large tits.", parse);
	Text.NL();
	Text.Add("You know just the thing to keep her occupied.", parse);
	Text.Flush();

	var Target = {
		boobs : 0,
		cunt  : 1,
		cock  : 2
	};
	var target;

	//[Boobs][Cunt][Cock]
	var options = new Array();
	options.push({ nameStr : "Boobs",
		func : function() {
			Text.Clear();
			Text.Add("Before she can struggle further, you grasp her offered breasts, pinching and pulling at her erect nipples. The herm groans, gripping at the sheets as her cock twitches, bouncing on her stomach.", parse);
			target = Target.boobs;
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Massage her tits."
	});
	options.push({ nameStr : "Cunt",
		func : function() {
			Text.Clear();
			Text.Add("The herm's got another hole that is unoccupied - no wonder she is being fiesty. Grinning, you play with her cunt, thrusting your fingers into her folds and teasing her clit. Her other, significantly bigger ‘clit’ twitches appreciatively.", parse);
			target = Target.cunt;
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Start working that pussy of hers."
	});
	options.push({ nameStr : "Cock",
		func : function() {
			Text.Clear();
			Text.Add("Without hesitating, you grasp Miranda’s erect cock, jerking it rapidly while your other hand fondles her heavy balls. The herm throws her head back, moaning loudly as you work her shaft.", parse);
			target = Target.cock;
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Jerk her off."
	});
	Gui.SetButtonsFromList(options);

	Gui.Callstack.push(function() {
		Text.NL();
		if(dom < -25) {
			Text.Add("The doberherm looks to be in absolute bliss; her tongue is lolling out while she pants, and her eyes roll to the back of her head. <i>“Having fun?”</i> you ask her.", parse);
			Text.NL();
			Text.Add("<i>“You have no idea, [playername]. Oh! I love getting buggered by you.”</i>", parse);
			Text.NL();
			Text.Add("Spoken like a true bitch - not that you expected any different at this point.", parse);
			Text.NL();
			Text.Add("<i>“Hey now, do me good. If I can still walk after this, it’s not a good fuck,”</i> she teases you with a grin. <i>“You made me your bitch, so I hope you’re ready to deal with the responsibility. Give it to me ha-ah!”</i> You silence her with a powerful thrust. That’s enough talking, you got the message already. She wants to get a limp? You’ll give it to her!", parse);
		}
		else if(dom < 25) {
			Text.Add("<i>“That all you’ve got? I expected more,”</i> she teases.", parse);
			Text.NL();
			Text.Add("Since when is she such a huge buttslut? You thought she liked giving more than taking.", parse);
			Text.NL();
			Text.Add("<i>“I don’t mind taking if you’re good at giving.”</i>", parse);
			Text.NL();
			Text.Add("If she’s asking for it, then you’re happy to comply! You adjust yourself and give her a wicked grin, to which she replies in kind.", parse);
		}
		else {
			Text.Add("Miranda tries to hide her pleasure, but her displeased mask cracks slightly each time you drive into her, plowing her prostate.", parse);
			Text.NL();
			Text.Add("<i>“T-think you are so good? I’ve - hngh! - had better,”</i> she pants, squirming and clenching around your [cock]. <i>“If you don’t want to walk out of here bowlegged, you’d better do a thorough job of fucking me!”</i>", parse);
			Text.NL();
			Text.Add("Defiant to the end. No matter, you know how to turn her to putty in your hands. To the tune of her mocking, sometimes cursing commentary, you increase your pace.", parse);
		}
		Text.NL();
		Text.Add("The longer you keep going, the rougher you get, feeling your pleasure building steadily as you ram the herm for all you’re worth. You both lose track of time as you relish in the carnal, animalistic rapture of sex, your [cock] in her ravaged anus all that matters anymore.", parse);
		Text.NL();

		var knotted = (pCock.knot != 0);
		var load;

		parse["knot"] = knotted ? " roughly shoving your knot against her entrance," : "";
		parse["dom"] = dom >= 25 ? " drops her tough girl facade and" : "";
		parse["b"] = player.HasBalls() ? "balls churning" :
		                 player.FirstCock() ? "prostate going into overdrive" : "climax rising";
		Text.Add("You pump into her as fast as you can,[knot] sure that she not only can take it, but that she’s enjoying every second of it. You won’t last long at this pace, but you do take note of her groans and barks of pleasure. At some point, she[dom] starts deliriously begging for more. You can feel your [b] as your [cock] throbs inside her. All you need is One. Last. Thrust.", parse);
		Text.NL();

		if(knotted) {
			parse["size"] = pCock.length.Get() > 30 ? " despite your size" : "";
			parse["real"] = !pCock.isStrapon ? " as it begins to swell" : "";
			Text.Add("You push yourself to the hilt[size], your significantly thicker knot popping inside her rectum and tying you to the horny dobie[real]. No longer able to hold back, you let yourself go as you achieve your long-delayed climax.", parse);
			Text.NL();
			if(!pCock.isStrapon) {
				load = player.OrgasmCum();

				if(load > 6)
					parse["load"] = "tremendous";
				else if(load > 3)
					parse["load"] = "considerable";
				else
					parse["load"] = "meager";
				parse["load2"] = load > 3 ? " and bloating it" : "";
				Text.Add("You fill her back door with your [load] load. With your bulb sealing her tightly, the cum has nowhere to go but her belly, filling it up[load2] under your continuous flood.", parse);
				if(load > 3) {
					parse["several"] = Text.NumToText(Math.max(Math.floor(2 + (load - 3)*2), 9));
					Text.Add(" By the time your seed reduces to a trickle, she’s swollen as if [several] months pregnant.", parse);
					if(load > 6)
						Text.Add(" Some of your sperm even manages to work around the seal of your knot. The pressure of your jizz leaking out feels just amazing; if you weren’t spent, you might just cum again.", parse);
				}
				if(player.NumCocks() > 1) {
					var allCocks = player.AllCocksCopy();
					for(var i = 0; i < allCocks.length; i++) {
						if(allCocks[i] == pCock) {
							allCocks.remove(i);
							break;
						}
					}

					parse["cocks2"] = player.MultiCockDesc(allCocks);
					parse["s"]              = allCocks.length > 1 ? "s" : "";
					parse["itsTheir"]        = allCocks.length > 1 ? "their" : "its";

					Text.Add(" Your other [cocks2] blow [itsTheir] load[s] all over the guardswoman, painting her in long, thick white stripes.", parse);
				}
			}
			else
				Text.Add("Your [hips] are shaking as you ride your pleasure high, causing Miranda to gasp as you grind the thick, knotted strap-on in her ass.", parse);
		}
		else {
			parse["size"] = pCock.length.Get() > 30 ? "Despite your size, y" : "Y";
			Text.Add("[size]ou push yourself to the hilt inside her, triggering sparks of pleasure in both of you. No longer able to contain yourself, you cum.", parse);
			if(!pCock.isStrapon) {
				load = player.OrgasmCum();

				if(load > 6)
					parse["load"] = "tremendous";
				else if(load > 3)
					parse["load"] = "considerable";
				else
					parse["load"] = "meager";
				Text.Add(" The dominated dobie gasps as she feels the first splatters of your [load] load hit her inner walls, hot and sticky. You keep thrusting into her as you shoot wad after wad of thick sperm, painting her anal passage white.", parse);
				if(load > 3) {
					parse["several"] = Text.NumToText(Math.min(Math.floor(2 + (load - 3)*2), 9));
					Text.Add(" The herm swells up rapidly as your seed rushes into her stomach, ending with her looking [several] months pregnant.", parse);
					if(load > 6) {
						Text.Add(" That which can’t fit inside her bloated belly splashes out around your throbbing member, staining her sheets as it dribbles out into a large pool beneath her ravaged ass.", parse);
					}
				}
			}
		}
		Text.NL();
		parse["cum"] = !pCock.isStrapon ? ", squirming as she feels your hot cum flow into her" : "";
		Text.Add("Miranda isn’t far behind you[cum]. ", parse);
		if(target == Target.boobs) {
			Text.Add("You seize the opportunity to mash her breasts together, leaning down to suck on one of her erect nipples. This proves to be the last straw. With a howl of pleasure, you feel her cock throbbing against your belly as she orgasms.", parse);
			Text.NL();
			if(load > 3) {
				parse["inflatedBloated"] = load > 6 ? "bloated" : "inflated";
				Text.Add("Most of her cum winds up pooled between your bellies as streams form around the sides of Miranda’s [inflatedBloated] belly. ", parse);
			}
			else {
				parse["breast"] = player.FirstBreastRow().Size() > 3 ? Text.Parse(", and the underside of your [breasts],", parse) : "";
				Text.Add("Her spraying jets of cum splatter against your belly[breast] before raining back down upon her prone form. ", parse);
			}
			parse["cum"] = load > 6 ? ", despite there being no more room inside" : "";
			Text.Add("Her sphincter constricts your [cock] with all her might, milking you for even more cum[cum]. It feels great, but at the same time it’s so tight that it’s almost painful. The doberherm’s cunt, forgotten until now, constricts and contracts, spewing her female juices all over your lower body. From the looks of it, she came as hard as she’s ever done when pitching.", parse);
		}
		else if(target == Target.cunt) {
			Text.Add("You can feel her pussy contract around your fingers even as her ass does the same to your [cock], trying to milk your digits of their non-existent seed.", parse);
			if(player.NumCocks() > 1) {
				var allCocks = player.AllCocksCopy();
				for(var i = 0; i < allCocks.length; i++) {
					if(allCocks[i] == pCock) {
						allCocks.remove(i);
						break;
					}
				}
				parse["s"]     = allCocks.length > 1 ? "s" : "";
				parse["oneof"] = allCocks.length > 1 ? " one of" : "";
				Text.Add(" No doubt she wishes you would ram[oneof] your other shaft[s] into her needy pussy and fill her up, but you’ve just gotten off so the next best thing will have to do.", parse);
			}
			Text.Add(" Grabbing hold of one of the many dildos lying about on the bed, you shove the thick rod into Miranda’s moist netherlips, making the herm gasp as you push her over the edge.", parse);
			Text.NL();
			if(load > 6)
				parse["cum"] = " bloated";
			else if(load > 3)
				parse["cum"] = " inflated";
			else
				parse["cum"] = "";
			Text.Add("Her cock sprays jets of canid cum all over her[cum] belly, matting the dobie’s short dark fur with her own jizz. You grind the dildo into her cunt until her orgasm recedes, leaving the guardswoman a panting, sticky mess. The artificial phallus is dripping with femcum when you finally pull it out, soaked in her juices.", parse);
		}
		else if(target == Target.cock) {
			Text.Add("Your vicious handjob ends when you grab both her balls and knot tightly, eliciting a sharp cry from the doberherm as her cock throbs, once, twice, and finally sends a powerful jet of doggy-spunk arcing through the air to splatter messily on her face.", parse);
			Text.NL();
			parse["strapon"] = pCock.isStrapon ? ", despite you being unable to give her any" : "";
			Text.Add("It’s quite an amusing sight; Miranda is so out of it that she barely notices when a few strands land on her open maw. Her cock sputters her heavy load for a good while, putting on quite an amazing show for you. You barely even notice that her feminine half has soaked your lower body in femcum, nor that her ass has been milking you in an attempt to draw more cum all this time[strapon].", parse);
			Text.NL();
			Text.Add("You give her one last thrust, grinding against her prostate and drawing a groan as she shoots one last jet. It lands squarely inside her maw, making her gurgle slightly as she swallows it down. Score! You watch her lick her lips clean of her own cum, hands moving to stroke her creamy mounds. Miranda looks like an absolute mess, and she’s enjoying every second of it.", parse);
		}
		Text.NL();
		if(knotted) {
			if(dom < -25) {
				parse["masterMistress"] = player.mfTrue("master", "mistress");
				Text.Add("<i>“Knotted like a bitch. Ah, this feels great. ", parse);
				if(pCock.isStrapon)
					Text.Add("Even though pulling it out is going to be a pain.”</i>", parse);
				else
					Text.Add("Gonna have to stay like this till you deflate tough. Not that I mind being stuck with you up my ass, [masterMistress].“</i>", parse);
			}
			else if(dom < 25) {
				Text.Add("<i>“Phew, you went all out on me, didn’t you? Normally, I’d be mad at you for making me ", parse);
				if(pCock.isStrapon)
					Text.Add("go through the pain of having this dildo extracted from my ass", parse);
				else
					Text.Add("stay like this till you deflate", parse);
				Text.Add(", but since the sex was pretty good, I’m gonna let it slide,“</i> she remarks.", parse);
			}
			else {
				Text.Add("<i>“Dammit, [playername]. You just had to go and tie me up, didn’t you?”</i> she protests. <i>“That is my thing!”</i>", parse);
				Text.NL();
				Text.Add("You didn’t hear her complaining while pushing said knot inside. ", parse);
				if(pCock.isStrapon)
					Text.Add("<i>“Alright, just give me a chance to rest before you yank this thing out of me.“</i>", parse);
				else
					Text.Add("<i>“Heh, fair enough. I guess you won’t take long to deflate, but don’t get used to it.“</i>", parse);
			}
			Text.NL();
			parse["real"] = pCock.isStrapon ? "" : ", until your knot finally shrinks back to its usual size";
			Text.Add("You stay like that for a while[real]. Miranda grunts as you pull out, ", parse);
			if(pCock.isStrapon)
				Text.Add("wincing as the massive, artificial knot pops out of her rectum.", parse);
			else
				Text.Add("unleashing the pent up seed trapped in her colon.", parse);
		}
		else {
			parse["sticky"] = pCock.isStrapon ? "" : " sticky";
			Text.Add("You pull your[sticky] member out of her, sighing contentedly. You are pretty sure she liked that as much as you did.", parse);
		}
		Text.NL();
		if(dom < -25)
			Text.Add("<i>“Oh, I love it when you use me, [playername],”</i> Miranda purrs. <i>“You’ve really put this bitch in her place.”</i>", parse);
		else if(dom < 25)
			Text.Add("<i>“Mmm… just give me a call any time you have more ‘special’ plans for me, [playername],”</i> Miranda purrs. <i>“I could grow to like this.”</i>", parse);
		else
			Text.Add("<i>“Not too bad, I suppose,”</i> Miranda pants, trying to get her breath back. <i>“Not as good as I would do it, obviously.”</i> That sounds like a challenge.", parse);
		Text.NL();

		var mCum = miranda.OrgasmCum();

		player.subDom.IncreaseStat(75, 1);
		miranda.subDom.DecreaseStat(-75, 3);
		miranda.relation.IncreaseStat(40, 2);
		player.AddLustFraction(-1);

		Scenes.Miranda.HomeDommySexLeavingFuckedHer();
	});
}


Scenes.Miranda.HomeDommySexRideDobieCockShared = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	if(player.SubDom() < 0)
		Text.Add("With a coy smile, you close the distance between you, staring into Miranda's eyes as you tenderly stroke the prominent bulge between her legs, asking her if she doesn't think she's a little overdressed for things. If she were to slip into something more comfortable and join you upstairs, you promise her she'll enjoy what you have in mind. You give her cock a tender squeeze through her pants for emphasis, then turn and head for the stairs yourself. You smile as you hear the horny herm stripping herself off as fast as she can behind you and giving hot pursuit.", parse);
	else
		Text.Add("Without hesitation, you close the distance between you and begin peeling off Miranda's armor, hoisting her top up over her head and casting it aside carelessly before pulling down her pants. The morph happily complies with your actions, lifting her arms to facilitate the removal of her top, then almost daintily stepping out of her pants once they're on the floor, cock bobbing in the air before her as she does so. Straightening back up, you lecherously stroke her member before ordering her up to her room, using her dick like a handle to draw her eagerly along as you head for the stairs.", parse);
	if(miranda.flags["Floor"] < 2)
		Scenes.Miranda.HomeDescFloor2();
	else {
		Text.NL();
		Text.Add("Messy… not that you expected any different by now.", parse);
	}
	Text.NL();
	if(player.SubDom() < 0) {
		Text.Add("Approaching the mattress, you turn back to Miranda and, with a seductive smirk, indicate the bed with one hand, asking her to go ahead and make herself comfortable.", parse);
		Text.NL();
		Text.Add("<i>“I like where this is going… don’t keep me waiting now,”</i> she grins sitting down on the bed, legs spread to put her cock on full display.", parse);
		Text.NL();
		Text.Add("Smiling back at her, you lean in and kiss her gently, your fingers moving to tenderly stroke the jutting canine erection between her thighs. Then you place your hands on her shoulders and carefully push her down against the bed, the smile never leaving the morph's face as she immediately wriggles herself into a more comfortable position. You quickly move to undress, carefully placing your [armor] at the base of the mattress for easy retrieval, and then climb atop the bed in turn, moving to straddle Miranda.", parse);
	}
	else
		Text.Add("You don't hesitate in leading Miranda toward her bed; her cock really makes a good handle for controlling the dog-morph. Once her hip bumps against the side of the mattress, you release her penis and take her by the shoulders, giving her a gentle but firm push that sends her toppling over onto her back atop the bed. Reaching down, you maneuver her a little to ensure she's more properly on the bed, and then set about removing your own [armor], tossing them casually aside to join the other piles of discarded gear already scattered about the room. Now naked, you waste no time in climbing atop of Miranda, straddling her.", parse);
}

Scenes.Miranda.HomeDommySexRideDobieCockAnal = function() {
	var parse = {
		playername    : player.name,
		masterMistress: player.mfTrue("master", "mistress"),
		boyGirl       : player.mfTrue("boy", "girl"),
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = miranda.ParserTags(parse, "m");
	var dom = miranda.SubDom() - player.SubDom();

	Text.Clear();

	Scenes.Miranda.HomeDommySexRideDobieCockShared();

	Text.NL();
	if(dom < -25)
		Text.Add("Miranda’s hands dart to your hips, gripping you tightly. <i>“You gonna get started or do I have to show you how to take cock?”</i>", parse);
	else if(dom < 25)
		Text.Add("<i>“Hey, [playername]? Don’t you think it’s about time you stopped with the teasing and got to good part? My cock is aching for your sweet bum,”</i> she grins.", parse);
	else
		Text.Add("<i>“Come on now, that’s enough teasing,”</i> she pants. <i>“Have mercy on me, [masterMistress]!”</i>", parse);
	Text.NL();
	parse["sorry"] = player.SubDom() < 0 ? " sorry, but for now" : "";
	Text.Add("You don't respond verbally to Miranda's comments. Instead, you reach back with one hand and begin to stroke her balls, running your fingers tenderly over the apple-sized cum factories before closing them firmly around one swollen nut. Not hard enough to actually hurt her, but definitely with enough force to make the doberherm's eyes widen in surprise. Patiently, you chastise her for rushing;[sorry] you're in charge here. She just needs to be a good doggie, lie back, and let you take care of everything...", parse);
	Text.NL();
	if(dom < -25)
		Text.Add("The doberman’s hands immediately release you, gripping the sheets instead. <i>“That’s a low blow, [playername]. Hope you know what you’re doing because payback can be a bitch.”</i>", parse);
	else if(dom < 25)
		Text.Add("<i>“Taking charge, are you? Alright then. I have a feeling I’m going to enjoy this even if you do,”</i> she grins.", parse);
	else
		Text.Add("<i>“Well, you know what I like. So enjoy yourself,”</i> she winks.", parse);
	Text.NL();
	Text.Add("Seeing as the morph is going to be obedient and lie still, you turn your attention to other matters of importance. Namely, how to properly prepare yourself to ride Miranda's cock...", parse);
	Text.Flush();

	//[GetLube] [Pre-Lube] [Blow-Lube] [Cunt-Lube]
	var options = new Array();
	options.push({ nameStr : "Get Lube",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Hang on,”</i> she says, reaching for a nearby drawer. She fumbles around with the contents before producing a jar. <i>“Catch!</i> she exclaims as she tosses the container.", parse);
			Text.NL();
			Text.Add("You snag it deftly and give it a cursory glance. The brand name on the bottle reads ‘Easy-in - for when you don't have time to take it easy’. Somehow, that motto is just so Miranda... With a little work, you manage to unscrew the jar top with just one hand - it's very clear that Miranda uses it regularly. Placing it atop Miranda's stomach, you dig into the well-used interior of the container, scooping out a generous dollop of pale green ointment, then reach around and start to work it into your anus.", parse);
			Text.NL();
			Text.Add("Closing your eyes to concentrate, you moan softly as you stroke and caress your anal ring, massaging the gel into its surface, pushing your way inside to ensure a nice, internal coating as well. Once satisfied with your own lubing, you remove your fingers from your ass and return them to the jar. This time, you start smearing the fresh dose of lube on Miranda's cock, rubbing up and down to ensure it's well-coated in the slick, smooth ointment.", parse);
			Text.NL();
			Text.Add("<i>“Come on! Ditch the lube and get on with it!”</i> the doberman protests impatiently. <i>“Keep teasing me like that and I’ll lose control and just rail you as hard as I can!”</i>", parse);
			Text.NL();
			Text.Add("You firmly squeeze her balls again to remind her just who is in charge, but you agree with her that it's time for the fun to begin. Placing the cap back atop the ointment, you drop it onto a nearby pile of clothes and reposition yourself, slowly sinking down until you can feel Miranda's cock starting to push its way inside your newly lubed ass.", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "If Miranda likes anal as much as she says she does, she’s gotta have some around here."
	});
	options.push({ nameStr : "Pre-Lube",
		func : function() {
			Text.Clear();
			Text.Add("While you still have a grip on her balls, you reach back with your free hand, and you start to stroke her dick. Sliding up and down her length with smooth, even movements, you toy with her pointy glans with thumb and fingertips. Pre-cum bubbles hot and wet from her urethra, spilling over your digits, and you caress her cock until your [hand] is nice and slick. Deeming it sufficiently covered, you remove your fingers from Miranda's shaft, a soft whimper escaping the herm, and begin to massage your [anus], tenderly rubbing the sexual fluids into your back passage. You allow your eyes to close and moan softly in pleasure as you stroke and play with your asshole, working a thumbtip inside to ensure a nice, solid coating inside and out.", parse);
			Text.NL();
			Text.Add("Several times you repeat the process, stroking Miranda to get nice and slick with her pre-cum, then massaging it into your anal ring until you deem yourself sufficiently lubed. Playfully, you apologize for keeping her waiting, but assure her that it will be well worth it.", parse);
			Text.NL();
			Text.Add("<i>“Finally, I was wondering how long you were going to keep me waiting.”</i> She licks her lips.", parse);
			Text.NL();
			Text.Add("Ready as you'll ever be, you reposition yourself slightly and start to descend, feeling the tip of Miranda's cock first touching, and then piercing your asshole as you drop further and further down.", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Why not play with her a little and see if you can't milk her enough to use her own juices for lube?"
	});
	options.push({ nameStr : "Blow-Lube",
		func : function() {
			Text.Clear();
			Text.Add("Still retaining your grip on the herm's balls, you swivel your hips around until you are reverse-straddling her, your face pointing toward Miranda's feet... and, more importantly, her dick. You allow yourself to be seated on her stomach and then lie down, pushing your rear up toward the dog-morph's face and bringing your own face down to be level with Miranda's jutting girl-cock. Sticking out your [tongue], you start to gently lap at the ruddy flesh before you, running your tongue up and down its length with smooth motions, painstakingly coating it with your saliva.", parse);
			Text.NL();
			if(miranda.SubDom() < -25)
				Text.Add("<i>“Ah, yes! That feels great, [playername]!”</i> she exclaims, tongue lolling out. She looks at your exposed [butt]. An idea comes to her and she puts both hands on your butt cheeks. You consider giving her balls a little squeeze to dissuade her from whatever she’s thinking, but when you feel a wet tongue lapping your butt crack as she spreads you, you relent. Seems she’s decided to help you lube yourself some too.", parse);
			else {
				Text.Add("<i>“Yes! Suck my cock like a proper slut!”</i> she exclaims.", parse);
				Text.NL();
				Text.Add("You promptly squeeze her balls firmly, reminding her to watch her language.", parse);
			}
			Text.NL();
			Text.Add("Licking isn't doing the job for you; you open your mouth and close your lips around the dog-dick in front of you, wetly gulping your way down its length until you can feel its tip poking at the back of your throat. Up and down, you bob your head while audibly slurping and suckling, lathering spittle on Miranda's fuckmeat until you're satisfied it's nice and slick.", parse);
			if(miranda.SubDom() < -25)
				Text.Add(" You moan around Miranda's cock as you feel her tongue busily worming its way inside of your asshole, unthinkingly clenching down in an effort to keep it from penetrating you... ooh, or perhaps keeping it inside you would be better.", parse);
			Text.NL();

			Sex.Blowjob(player, miranda);
			player.FuckOral(player.Mouth(), miranda.FirstCock(), 1);
			miranda.Fuck(miranda.FirstCock(), 1);

			Text.Add("From the shudders and grunts of your canine body pillow, you deem it time to stop sucking her cock lest she end up blowing before the fun can really begin. With a wet pop, you pull your mouth free and push yourself upright, slowly shifting yourself back into the proper position, facing back toward Miranda's face. One hand still on Miranda's balls, you align yourself with her newly sucked dick and start lowering your hips, feeling the spit-slicked shaft slowly spearing up inside of you.", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Perhaps a pre-butt-sexing blowjob would kill two birds with one stone?"
	});
	if(player.FirstVag()) {
		options.push({ nameStr : "Cunt-Lube",
			func : function() {
				Text.Clear();
				Text.Add("Shifting your hips slightly, you align Miranda's cock not with your ass, but with your [vag], lowering your body until the heat of it is wafting across her sensitive prickflesh.", parse);
				Text.NL();
				Text.Add("<i>“Whoa, I thought we were doing anal… not that I mind getting myself inside that hot pussy of yours.”</i>", parse);
				Text.NL();
				Text.Add("Ignoring her, you start to grind your folds against the hot, hard shaft below them, purposefully rubbing and stroking yourself against her, letting her slide through your womanhood but never penetrate you. Each motion smears your own feminine arousal over her dick, and you moan softly at the friction. The sensation gets you more and more excited, ensuring a steady flow of juices across the dog-dick.", parse);
				Text.NL();
				Text.Add("<i>“Shit! I need to fuck <b>now</b>! So quit with the teasing,”</i> Miranda pants. You have a feeling she won’t be able to take this much longer without snapping.", parse);
				Text.NL();
				Text.Add("Fortunately for her, you feel about ready to proceed yourself. On your next rise up, you move to position yourself so that when your hips lower again, it brings your asshole down to sink over her newly slickened dick.", parse);
				PrintDefaultOptions();
			}, enabled : !player.FirstVag().virgin,
			tooltip : "You're not some tender virgin; why not use your pussy to prep her dick for your ass?"
		});
	}
	Gui.SetButtonsFromList(options);

	Gui.Callstack.push(function() {
		Text.NL();
		if(player.Butt().virgin) {
			Text.Add("<i>“So tight! What the… are you a virgin back there by any chance?”</i>, Miranda asks.", parse);
			Text.NL();
			Text.Add("Gritting your teeth as you feel your virginal anus straining around the meaty intruder, you nod your head and confess that you are… or in this case were.", parse);
			Text.NL();
			Text.Add("<i>“A-and you picked me to pop your cherry?</i> she asks in disbelief.", parse);
			Text.NL();
			Text.Add("Forcing another inch of dickflesh inside of you, you moan softly and tell her that's true.", parse);
			Text.NL();
			Text.Add("<i>“Aw, now you’re making me embarrassed…”</i> she trails off. <i>“Hmm, alright then, I promise to show you a great time for your first - bring it on.”</i> She licks her lips.", parse);
			miranda.relation.IncreaseStat(100, 10);
		}
		else if(miranda.sex.gAnal < 5) {
			Text.Add("<i>“Aah! That’s quite the ass you got there, [playername]. Damn! You’re gripping me so tightly that it’s a wonder I can even move.”</i>", parse);
		}
		else {
			Text.Add("<i>“I’ve been inside your butt so many times, and it feels better every time. Careful, or I could easily get addicted to your ass,”</i> she chortles jokingly.", parse);
		}
		Text.NL();

		Sex.Anal(miranda, player);
		player.FuckAnal(player.Butt(), miranda.FirstCock(), 3);
		miranda.Fuck(miranda.FirstCock(), 3);

		Text.Add("Finally, you have taken enough of Miranda's cock that all that remains is the final engorged bulb of her knot. Content to leave that untouched for the moment, and having given yourself the necessary moments to adjust to the feelings of nearly a foot of turgid flesh inside of you, you begin to rhythmically rise and fall atop of your partner.", parse);
		Text.NL();
		Text.Add("Clenching your anal muscles so as to feel every bulging vein scrape most deliciously inside of you, you sink and gyrate, grinding down to the knot and then teasingly raising yourself up again until you almost pop free, only to slide down again. Your eyes close in concentration so that you can fully focus on the feelings Miranda is giving you, hissing between your teeth as you find a particularly inviting spot inside of you and rub it against her cock.", parse);
		Text.NL();
		Text.Add("A lustful moan from in front of you reminds you of the other participant in your pleasure, and you open your eyes to look at Miranda. The sight of her with her eyes screwed shut, mouth hanging open to let her slobbering tongue loll forth freely, tits bouncing with each gyration of your mutual hips, brings a smile to your face.", parse);
		Text.NL();
		if(player.FirstCock()) {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("The sight is just too tempting, and your free hand closes around[oneof] your bobbing [cocks]. Ceasing your riding, you lift yourself from Miranda's dick and settle further up her stomach before your fingers start to pump your own shaft fervently, gliding hard and smooth across the sensitive flesh.", parse);
				Text.NL();
				Text.Add("You can feel the flames of desire burning inside of you, growing stronger and hotter with every pump and touch and stroke. A welcome tingling sensation runs down your spine, and you give yourself over to what it entails, making sure to aim your cock[s] right at the open target of Miranda's face. Orgasm washes through you, and you cry out as your [cocks] fountain[notS] [itsTheir] seed.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Eyes fixated on the D-cup tits wobbling so enticingly atop your partner's chest, you push up and forward until Miranda's dick pops free of your ass. A dismayed whimper escapes the morph beneath you, and your anus clenches in sympathy at having been so emptied, but you have another prize to attend to. Sliding along Miranda's stomach, you bring your [cocks] to bear in-between the morph's luscious breasts, your hands wrapping around the firmly toned, velvety-furred orbs and mashing them together around your shaft[s].", parse);
				Text.NL();
				Text.Add("You eagerly grind and thrust yourself through Miranda's breasts, your sensitive flesh prickling most deliciously at the warmth and soft fur that surrounds [itThem], a sensation that builds upon the feelings already stoked within you by your riding of Miranda's cock. Pleasure mounts and rises inside of you, battering down your will, until you arch your back and thrust as deeply into the morph's cleavage as you can, unleashing your seed without a care.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("One look at that lolling tongue and the wetness of the dog-morph's mouth is all you need to convince you of your next course of action. Miranda actually whines in protest as you suddenly pop your ass free of her cock, but you quickly stifle her complaints by sliding up her stomach so as to thrust[oneof] your [cocks] between her lips. Miranda wastes no time in engulfing it, wrapping her lips eagerly around its length as best she can, hungrily polishing its underside with slurping laps of her tongue.", parse);
				Text.NL();

				Sex.Blowjob(miranda, player);
				miranda.FuckOral(miranda.Mouth(), player.FirstCock(), 1);
				player.Fuck(player.FirstCock(), 1);

				Text.Add("A thrill courses down your spine at the sight of the normally fierce, proudly dominant doberherm reduced to a cock hungry bitch, and you grab hold of her face, energetically thrusting your prick into her drooling maw. With as much fervor as you earlier rode Miranda's dick, you fuck the morph's face, plowing back and forth over her lapping tongue and between her slick lips.", parse);
				Text.NL();
				Text.Add("As your pleasure grows, your thrusts grow more erratic; you can feel the pressure building inside you, and you know your climax is almost upon you. Just before you lose control, you pull yourself free of Miranda's mouth, ensuring that your orgasm erupts all over her face.", parse);
			}, 1.0, function() { return true; });

			scenes.Get();

			Text.NL();

			var load = player.OrgasmCum();

			if(load > 6)
				Text.Add("Gush after massive gush jets from your squirting [cocks], absolutely drenching the dog-morph's head and upper torso in your seed. Her face is liberally plastered in off-white spunk, her breasts similarly coated and a veritable river of semen drools down the canyon of her cleavage and over her belly.", parse);
			else if(load > 3)
				Text.Add("Thick ropes of sperm plaster themselves over Miranda's face and tits, draping her in a veritable veil of streaks of off-white. The dickmilk is everywhere, coating her face and her breasts alike in your liquid climax.", parse);
			else
				Text.Add("Pearly strands spray across the morph's face and tits, giving her a perverse necklace of jism streamers by the time you are through.", parse);
			Text.NL();
			parse["sub"] = miranda.SubDom() < 0 ? " - in fact, I love it -" : ",";
			Text.Add("Licking some of your seed from her snout, the panting morph says, <i>“You’ve had your fun. I don’t mind the face paint[sub] but at least finish me off, please?”</i>", parse);
			Text.NL();
			if(player.SubDom() > 0)
				Text.Add("Grinning in pleasure at Miranda's words and her face covered in semen, you leisurely slide your way back down her stomach to resume your former position.", parse);
			else
				Text.Add("You quickly move to comply, eager to bring your lover to her own climax in turn, your desire only fuelled by her words.", parse);
			Text.NL();
			Text.Add("Once more positioned with your ass over Miranda's jutting, drooling girl-cock, you reach back with your hand to fondle her apple-sized balls, bloated with the seed she so desperately wishes to release. A few caresses, an affectionate pat, and then you return to the matter at hand, sinking back down upon her shaft with a moan of pleasure at being filled again.", parse);
		}
		else {
			Text.Add("On impulse, you suddenly pull yourself completely free of her dick, hovering your ass just above her jutting glans.", parse);
			Text.NL();
			Text.Add("<i>“Hey, get back here! It was just starting to feel good!”</i> Miranda protests, thrusting up in an attempt to penetrate you once more.", parse);
			Text.NL();
			Text.Add("You delicately lift your [butt] up further, beyond her reach, and chastise her for the thrusts by squeezing her balls until she moans softly in pleasure-pain. Smiling sweetly at her, you instruct her to beg for it, caressing her bloated nuts as you do so.", parse);
			Text.NL();
			if(dom < -25) {
				Text.Add("<i>“Please…”</i>", parse);
				Text.NL();
				Text.Add("Please, what, you reply back to her, cupping a hand around one of your [ears] for emphasis.", parse);
				Text.NL();
				Text.Add("<i>“Please, [masterMistress]! Let me go back inside your tight, hot ass! I need it so bad!”</i> she whines.", parse);
				Text.NL();
				Text.Add("You purse your lips as if thinking it over, continuing to knead and stroke her balls. After a few long, tense moments, you smile and inform her that since she asked so nicely, you'll grant her her wish.", parse);
			}
			else if(dom < 25) {
				Text.Add("<i>“Can’t believe you’re going to make me beg,”</i> she replies with a pout, but ultimately resigns. With a sigh she says, <i>“Please, let me fuck your ass.”</i>", parse);
				Text.NL();
				Text.Add("You ask if that's supposed to be her idea of begging.", parse);
				Text.NL();
				Text.Add("<i>“I can’t quite get on my knees here! How do you- ack!”</i> You silence her with a soft squeeze, not enough to hurt her just yet, but enough to silence her. Either she can beg like a good puppy, or she can get a serious case of blue balls.", parse);
				Text.NL();
				Text.Add("She looks at you with disdain for a few seconds, before inhaling and starting, <i>“Please, oh please, great [playername]! Allow me to fuck your ass! If I don’t, I think I’m going to die! So please have mercy!”</i>", parse);
				Text.NL();
				Text.Add("You can't help but roll your eyes at her melodrama, fingers tightening in warning against her nuts. But you suppose it will have to do...", parse);
			}
			else {
				Text.Add("<i>“You gotta be kidding me! It’s enough that I’m letting you run this show, now you want me to beg? Not a chance!”</i> she protests.", parse);
				Text.NL();
				Text.Add("Then you simply won't finish her off, you reply.", parse);
				Text.NL();
				Text.Add("<i>“Oh, Fiiine! But I’m only doing this because you have a really fine ass.”</i>", parse);
				Text.NL();
				Text.Add("Your fingers tap a tattoo against her balls and you remind her that you're waiting to hear some begging.", parse);
				Text.NL();
				Text.Add("She clears her throat. <i>“Please, [playername]. Allow me to plow the depths of your [butt]. I can’t stand not being able to deposit my huge load of doggie-cum up your back door.”</i>", parse);
				Text.NL();
				Text.Add("...Is that really supposed to be begging? You look at her, trying to gauge whether she truly was trying or was simply making a poor joke. You squeeze gently at her nuts, making her bite her lip, but decide to be magnanimous. Besides, your own form is quivering with desire, eager to achieve climax in turn.", parse);
			}
			Text.NL();
			Text.Add("Without further ado, you descend back upon Miranda's cock, allowing her to slide home into the welcoming depths of your ass once more.", parse);
		}
		Text.NL();
		Text.Add("The doggie-herm moans in pleasure at being engulfed by your warm tightness once more. No longer able to contain herself, she begins lightly thrusting into you, pressing her knot against your entrance.", parse);
		Text.NL();
		Text.Add("The experience is not unwelcome, and so you allow her this liberty, eagerly rising and falling in turn, grinding your entrance against her swelling knot and letting her feel you against it, but never allowing it to slip inside. Your sensitive muscles can feel every ripple, ridge and vein in Miranda's cock, and you are intimately aware of the thick, steady flow of pre-cum oozing from her member and spurting inside of you with each thrust the pair of you make.", parse);
		Text.NL();
		parse["second"] = player.FirstCock() ? " second" : "";
		Text.Add("You happily give yourself over to the sensations, content to ride the dober-morph for all you are worth. You can feel your[second] orgasm fast approaching, and from the growls and whimpers echoing from below you, Miranda herself can't be far off. As you sink down yet again, you feel her hugely swollen knot grinding against your anal ring...", parse);
		Text.Flush();

		var mCum = miranda.OrgasmCum();

		//[Take Knot] [Skip Knot]
		var options = new Array();
		options.push({ nameStr : "Take knot",
			func : function() {
				Text.Clear();
				Text.Add("Mind made up, your next sink is your last as you force yourself upon the bloated bulge of flesh at the base of Miranda's girl-cock. Your teeth clench and your whole body strains at the effort; it feels like you're trying to insert an apple up your ass, but your determination and sheer stubbornness prevails over the weakness of the flesh.", parse);
				Text.NL();
				parse["cock"] = player.FirstCock() ? " the bulb squeezing against your prostate," : "";
				Text.Add("You scream in a cocktail of pleasure, pain and triumph as Miranda's knot is forced inside of you, the swollen flesh stretching you out impossibly as it swells to anchor the two of you together. The feeling of being stretched so much, filled so full,[cock] is just too much to bear and your ass clamps down as you are wracked with the throes of climax.", parse);
				if(player.FirstCock()) {
					Text.Add(" Your [cocks] erupt[notS] for the second time, showering semen across Miranda's belly and breasts.", parse);
					var load = player.OrgasmCum();
				}
				if(player.FirstVag())
					Text.Add(" Your neglected womanhood rains its female fluids down onto Miranda's stomach, drooling wetly over her belly as you orgasm.", parse);
				Text.NL();
				Text.Add("Your orgasm promptly triggers Miranda's in turn. The doberherm throws her head back and bays like the dog she so resembles as her balls clench up and unleash their torrential cascade of semen inside of your defenseless guts. You can feel the tidal wave of hot bitch-spunk flooding up inside of you, forcing its way into your very stomach with its volume and energy, your belly beginning to swell from the large load.", parse);
				Text.NL();
				Text.Add("It's an indescribable experience as the near-endless cascade of girl-jizz stretches you out fatter and fuller; by the time Miranda shudders her last, your stomach could pass for a pregnant woman's somewhere in her third trimester. It's so big and heavy that it almost reaches down to rest atop Miranda's own stomach, and unconsciously you lean back to better support yourself with your newly increased girth.", parse);
				Text.NL();
				Text.Add("The two of you lie there in silence, panting for breath, until Miranda speaks up.", parse);
				Text.NL();
				if(dom < -25)
					Text.Add("<i>“Ahh. You’re the best, [playername]. I’d never thought getting used like a cheap dildo could feel this good. I’m so glad I get to be your plaything; come use me anytime, anyhow, and anywhere.”</i>", parse);
				else if(dom < 25)
					Text.Add("<i>“Phew, what a wild ride! You really know how to make a girl feel like a cheap sex toy, huh? Not that I mind. Hard to get mad over all this amazing sex.”</i>", parse);
				else
					Text.Add("<i>“Crap, I didn’t know getting used like that could feel this good. If this is your idea of domming, you can dom me anytime, [playername].”</i>", parse);
				Text.Flush();

				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				miranda.AddLustFraction(-1);

				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("With a stretch to pop some of the aches out of your joints, you set about collecting your discarded [armor], rubbing your sore ass as you bend over to retrieve it. Biting back a groan after straightening up, you slowly redress yourself. As you do all this, you have an audience; though evidently still too weak-kneed to get to her feet herself, you can feel Miranda's eyes as she watches you from her position on the bed.", parse);
					Text.NL();

					player.subDom.IncreaseStat(75, 1);
					miranda.subDom.DecreaseStat(-75, 3);
					miranda.relation.IncreaseStat(60, 3);

					Scenes.Miranda.HomeDommySexLeavingFuckedHer();
				});
			}, enabled : true,
			tooltip : "Miranda's clearly aching for it, why not let her tie you this time?"
		});
		options.push({ nameStr : "Skip knot",
			func : function() {
				Text.Clear();
				parse["secondOwn"] = player.FirstCock() ? "second" : "own";
				Text.Add("Abandoning Miranda's balls, you instead seize hold of her knot, squeezing it with your fingers even as your ass wrings down on her shaft, trying to milk her. The sensation is all that Miranda needs, the morph howling in ecstasy as she cums inside of you, the feeling of her hot semen geysering up into your sensitive [anus] is enough to trigger your [secondOwn] climax in turn.", parse);
				if(player.FirstCock()) {
					Text.Add(" Once again, your [cocks] erupt[notS], painting Miranda's stomach and tits alike with ropes of pearly semen.", parse);
					var load = player.OrgasmCum();
				}
				if(player.FirstVag())
					Text.Add(" Female honey pours from your neglected womanhood, slopping wetly over Miranda's belly as you orgasm.", parse);
				Text.NL();
				Text.Add("The dober-morph's cascade of semen forces itself inside of you, defying gravity with the sheer ferocity of its jets. Your stomach visibly bulges, even though the bulk of her seed pours back down from your used anus like a perverse waterfall, painting Miranda from the waist down in her own sperm by the time she finally stops. With mutual groaning sighs of pleasure, you sink back down and settle yourself atop of Miranda's body, lying atop her like a great cushion.", parse);
				Text.NL();
				Text.Add("The two of you lie there in silence for several long moments, panting for breath.", parse);
				Text.NL();

				player.subDom.IncreaseStat(75, 1);
				miranda.subDom.DecreaseStat(-75, 3);
				miranda.relation.IncreaseStat(60, 3);
				player.AddLustFraction(-1);
				miranda.AddLustFraction(-1);

				Scenes.Miranda.HomeDommySexLeavingFuckedHer();
			}, enabled : true,
			tooltip : "You have other things to do; she'll just have to get off without knotting you."
		});
		Gui.SetButtonsFromList(options);
	});


}

Scenes.Miranda.HomeDommySexFuckDobieVag = function(cocks) {
	var pCock = cocks[0];

	var parse = {
		playername    : player.name,
		boyGirl       : player.mfTrue("boy", "girl"),
		
	};
	parse = player.ParserTags(parse);
	parse = miranda.ParserTags(parse, "m");
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	var dom = miranda.SubDom() - player.SubDom();

	if(pCock.isStrapon)
		parse["cocks"] = function() { return pCock.Short(); };

	Text.Clear();
	Text.Add("You eagerly reply you want her splayed across her bed and moaning as you ram her with your [cocks]. Twirling her around, you give the doggie a slap on her butt, sending her in the direction of the stairway. Before she takes her first step, you ask her to slowly undress as she ascends the stairs. The guardswoman gives you a nice show, swaying her hips side to side as she slowly begins the climb. Under her short tail and between her toned thighs, you catch glimpses of your target: her wet and eager pussy. Just beyond it, her heavy sack sways back and forth.", parse);
	Text.NL();

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Like what you see?”</i> Miranda smirks over her shoulder, giving her hips a shake.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Huff… look at me, getting all hot and bothered,”</i> Miranda pants shamefully, squirming a bit under your close scrutiny.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Hehe… looks like I’m ready for you, love,”</i> Miranda shake her hips, spreading her cheeks with her cunt fully exposed.", parse);
	}, 1.0, function() { return miranda.SubDom() < 0; });
	scenes.Get();

	Text.Add(" She pauses on the entrance to her room, looking around before sashaying toward her bed with hips swaying side to side.", parse);

	if(miranda.flags["Floor"] < 2)
		Scenes.Miranda.HomeDescFloor2();
	else {
		Text.NL();
		Text.Add("Her room is in the same disarray as usual; clothes and toys of several varieties are strewn all about.", parse);
	}
	Text.NL();
	Text.Add("The herm hops onto the bed, turning to face you with a sultry expression. <i>“Now what, bad [boyGirl]?”</i> she asks, parting her legs slightly. At this angle, all you can see of her crotch is her thick puppy pecker - grown erect during her ascent - and her balls. This won’t do.", parse);
	Text.NL();

	var mode;
	var Mode = {
		back  : 0,
		doggy : 1
	};

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Now, she is going to lie back and spread ‘em as wide as she can. With a heave, you push Miranda over on her back, grabbing her legs and pulling them to the sides. Splayed out, her red cock stands up like a thick pillar, throbbing with excitement. The herm quickly gets the idea, pulling her balls aside to reveal her wet slit. She watches you intently, idly stroking her member while she waits for you to act.", parse);

		mode = Mode.back;
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("She’s a doggie, so there is only one way to go. On all fours, naughty doggie!", parse);
		Text.NL();
		Text.Add("<i>“Doggy style, huh? How clever.”</i> Her words are mocking, but she doesn’t waste time in rolling over, wiggling her butt at you. Miranda plants her knees wide on the bed, giving you full access to her nethers. Her wet slit looks as ready as it’ll ever be.", parse);

		mode = Mode.doggy;
	}, 1.0, function() { return true; });

	scenes.Get();

	Text.NL();
	Text.Add("You take your time stripping off your gear, taking every chance to tease the guardswoman. Here you are, the high and mighty Miranda begging for you to fuck her. Quite different from her usual dominating facade, isn’t it?", parse);
	Text.NL();
	if(dom > 25)
		Text.Add("<i>“Hey, who’s begging?”</i> she growls, annoyed. <i>“Don’t leave me waiting - I’m getting bored here.”</i>", parse);
	else if(dom > -25)
		Text.Add("<i>“What I do in my bedroom is my own business,”</i> she retorts. <i>“Well, in this case, your business too, I guess.”</i>", parse);
	else
		Text.Add("<i>“J-just fuck me already,”</i> she growls, blushing fiercely.", parse);
	Text.NL();
	if(!pCock.isStrapon) {
		Text.Add("Freed from [itsTheir] confines, your [cocks] flop[notS] out, quickly becoming erect as you ravage the horny herm with your eyes. You can hardly wait to plunge inside her sopping wet pussy.", parse);
	}
	else {
		Text.Add("You quickly equip your [cock], securing it carefully. It’s going to see a lot of action in the coming hours.", parse);
	}
	Text.Add(" Placing[oneof] your [cocks] at her entrance, you rub the tip in her juices. A shiver runs through the canid as you slowly push inside her, and she bites her lip, trying to suppress a moan.", parse);
	Text.NL();
	if(miranda.sex.rVag < 5)
		Text.Add("Miranda is deliciously tight, her seldom used pussy clamping down on your [cock] like a warm, wet vice.", parse);
	else if(miranda.sex.rVag < 15)
		Text.Add("Miranda opens up, welcoming an old customer into her wet folds. No matter how many times you do her, it’s always a great feeling to thrust inside the sexy herm.", parse);
	else
		Text.Add("Miranda’s pussy is slick with her juices, still blissfully tight despite how many times you’ve taken her.", parse);
	Text.Add(" Her composure breaks when you adjust your stance and begin thrusting with vigor and ferocity.", parse);
	Text.NL();

	Sex.Vaginal(player, miranda);
	player.Fuck(pCock, 3);
	miranda.FuckVag(miranda.FirstVag(), pCock, 3);

	if(dom > 25)
		Text.Add("<i>“Hngh, you call that fucking?”</i> she moans between gritted teeth. <i>“By now, I’d have you - aah! - screaming for more!”</i>", parse);
	else if(dom > -25)
		Text.Add("<i>“I could - aah! - grow to like this,”</i> she moans. <i>“N-not too bad.”</i>", parse);
	else {
		Text.Add("<i>“Y-yes! You are way too good, [playername]!”</i> the slutty herm moans. <i>“Make me your bitch - fuck me senseless!”</i>", parse);
		miranda.subDom.DecreaseStat(-50, 1);
	}
	Text.NL();
	if(mode == Mode.back) {
		Text.Add("As you pick up speed, you grab her by the ankles, spreading her legs wide. Miranda has thrown her head back, tongue lolling about. Her paws are busy between her thighs, feverishly jerking on her leaking cock. The guardswoman moans and squirms as you jackhammer her tight pussy and her heavy tits bounce in rhythm with your movements.", parse);
	}
	else if(mode == Mode.doggy) {
		Text.Add("You adjust your hold on her hips, pulling her back onto your [cock]. Soon, you’ve established a rhythm - rough and deep, just the way she likes it. The guardswoman is resting on her elbows, her tits bouncing back and forth each time you drive into her. Between her spread legs lie her pride and glory flopping about uselessly, staining the sheets with her pre.", parse);
	}
	Text.NL();
	var cap = pCock.length.Get() - 30;
	if(cap > 10) {
		Text.Add("Miranda grunts, gritting her teeth as your grind against her cervix. Before she met you, you doubt she had taken any cock bigger than her own, and certainly nothing like yours. It must be a humbling experience for her.", parse);
		miranda.subDom.DecreaseStat(-75, 1);
	}
	else if(cap > -5)
		Text.Add("You somehow manage to fit all of your [cock] in her cunt, though it is pushing her limits. She’s a tough girl though, she can take it.", parse);
	else
		Text.Add("Each thrust slams your hips into her butt as you hilt your [cock] in her accomodating vagina.", parse);
	Text.Add(" Beads of sweat - yours and hers - mat the doggie’s short, dark fur, giving her coat a glossy shine. Somehow, her hair had come undone and her pink ribbon discarded somewhere in the pile of clothes strewn across the rooms. Her long strands flow and pool onto the sheets, spreading out around the guardswoman.", parse);
	Text.NL();

	var widenButt = false;
	if(mode == Mode.doggy && player.SubDom() > 30) {
		Text.Add("Just above her ravaged pussy, Miranda’s tight rosebud winks at you. The opportunity is just too good to not take advantage of. Licking your fingers thoroughly, you coat them in a thick layer of saliva to ease your entry.", parse);
		Text.NL();
		Text.Add("<i>“Hey, what are you up to back th- Ahh!”</i> Miranda’s question is quickly answered by you thumb digging into her tunnel, prying her anus open. ", parse);

		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>“Hngh, think you’re so tough... I can take that easily!”</i> she grunts.", parse);
		}, 1.0, function() { return miranda.sex.rAnal > 10; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Hey, that’s my schtick,”</i> she complains. <i>“If you keep doing that, you’ll get it back tenfold!”</i>", parse);
			player.subDom.IncreaseStat(0, 1);
		}, 1.0, function() { return miranda.sex.gAnal > 10; });
		scenes.AddEnc(function() {
			Text.Add("<i>“T-thank you for using my butt too,”</i> she pants. <i>“Will you fuck me there if I’m a good girl?”</i>", parse);
		}, 1.0, function() { return miranda.SubDom() < -25; });
		scenes.AddEnc(function() {
			Text.Add("<i>“S-such a naughty [boyGirl],”</i> she pants. <i>“I’ll get back at you for that.”</i>", parse);
		}, 1.0, function() { return true; });

		scenes.Get();

		Text.Add(" You ignore her banter, inserting your other thumb. The guardswoman groans wordlessly as you start slowly widening her sphincter, all while retaining the momentum of your rocking hips.", parse);
		Text.NL();

		widenButt = true;
	}
	Text.NL();
	if(dom < -25) {
		Text.Add("<i>“F-fuck, you are good, [playername]!”</i> Miranda moans. <i>“I need to cum so bad - fuck me, hard and deep!”</i>", parse);
	}
	else if(dom < 25) {
		Text.Add("<i>“Just - haah - keep going like that, [playername],”</i> Miranda begs.", parse);
	}
	else {
		Text.Add("<i>“That all you got?”</i> she moans defiantly. <i>“At this rate, I’ll have to - haah! - do it myself!”</i> ", parse);
		if(mode == Mode.back)
			Text.Add("Keeping one hand busy on her cock, Miranda moves her other one to squeeze her boobs, sighing as she pinches her nipples.", parse);
		else if(mode == Mode.doggy)
			Text.Add("True to her word, the herm begins to rock her hips back against you, fucking herself on your [cock].", parse);
	}
	parse["dommy"] = (dom >= 25) ? " - despite her words -" : "";
	Text.Add(" Her [mvag] is clenching down on your shaft with a powerful grip, and[dommy] you can sense that the guardswoman is almost at her limit.", parse);
	Text.NL();

	parse["artificial"] = pCock.isStrapon ? " artificial" : "";
	var scenes = new EncounterTable();

	var mCum = miranda.OrgasmCum();

	scenes.AddEnc(function() {
		Text.Add("Just where you want her. Grinning widely, you slow down a bit - retaining the depth of your thrusts - but keeping the dog-morph just a hair's breadth away from the orgasm she so desperately craves. When Miranda realizes what you are up to, she growls, cursing you. Her complaints gradually turn to whines and pleas and finally into full on begging as you break down her will with your pistoning [cock].", parse);
		Text.NL();
		Text.Add("After another ten minutes, she finally cracks, her thighs twitching and pussy clamping down on your[artificial] shaft. The dog-morph throws back her head and howls, tongue lolling and eyes rolling back as she rides out her climax.", parse);
		miranda.subDom.DecreaseStat(-75, 1);
	}, 1.0, function() { return player.SubDom() > 0 && player.sexlevel > 3; });
	scenes.AddEnc(function() {
		Text.Add("With a final thrust, you send her over the edge, gripping the guardswoman’s hips tightly as you drive into her, triggering her climax. The doggie’s pussy clamps down on your[artificial] shaft, clenching you tightly even as it stains your pillar with its sweet nectar.", parse);
	}, 1.0, function() { return true; });

	var load;
	var LoadIn = {
		vag : 0,
		ass : 1,
		out : 2
	};
	var loadIn;

	var cont = function() {
		Text.Add(" The two of you collapse on top of each other, exhausted from your wild romp.", parse);
		Text.Flush();

		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("You stay like that for a while, recovering in each others arms.", parse);
			if(loadIn == LoadIn.out || player.NumCocks() > 1) {
				if(dom > 0)
					Text.Add(" Miranda has you clean her up by licking your own cum from her matted fur. <i>“Good [boyGirl],”</i> she murmurs, stroking your [hair] gently.", parse);
				else
					Text.Add(" Miranda sets to cleaning herself up, meticulously licking the cum from her matted fur. <i>“Would be a shame to have it go to waste,”</i> she murmurs, swallowing greedily.", parse);
			}
			Text.Add(" Eventually, you disentangle yourself and set to re-adorning your gear.", parse);
			Text.NL();

			player.subDom.IncreaseStat(75, 1);
			miranda.subDom.DecreaseStat(-75, 3);
			miranda.relation.IncreaseStat(40, 2);
			player.AddLustFraction(-1);
			miranda.AddLustFraction(-1);

			Scenes.Miranda.HomeDommySexLeavingFuckedHer();
		});
	}

	scenes.Get();
	if(mode == Mode.back)
		Text.Add(" Miranda’s cock violently erupts, spraying her plentiful seed all over her [mbelly], face and hair.", parse);
	else if(mode == Mode.doggy)
		Text.Add(" Between her legs, Miranda’s cock sprays its load, making a sticky pool on her sheets. Laundry is probably in order after this.", parse);
	Text.Add(" The herm’s knot has swollen to its full size, mindlessly trying to tie her together with her non-existent mate’s cunt. Her tail is wagging uncontrollably, telling you just how far gone she is.", parse);
	Text.NL();
	if(!pCock.isStrapon) {
		Text.Add("Your own orgasm is not far behind. You have only seconds to decide where you are going to cum.", parse);
		Text.Flush();

		var loads = function() {
			if(loadIn == LoadIn.out) {
				if(load > 6) {
					Text.NL();
					Text.Add("Before you are even halfway done, Miranda is thoroughly coated in your semen, thick, white stripes covering her short dark fur. You wipe your [cocks] off on her thigh, further adding to the mess.", parse);
				}
				else if(load > 3) {
					Text.NL();
					Text.Add("Your cum splatters all over the herm, painting her dark fur with thick, white stripes.", parse);
				}
			}
			else { // vag/ass
				if(load > 6) {
					Text.NL();
					Text.Add("Within a few shots, Miranda’s belly is bulging with your seed. The excess fountains out around your [cock], splattering on the bed and floor below.", parse);
				}
				else if(load > 3) {
					Text.NL();
					Text.Add("You remain inside her while you shoot your load, causing her belly to swell slowly as more and more cum is pumped into her body.", parse);
				}
				if(player.NumCocks() > 1) {
					var allCocks = player.AllCocksCopy();
					for(var i = 0; i < allCocks.length; i++) {
						if(allCocks[i] == pCock) {
							allCocks.remove(i);
							break;
						}
					}

					parse["other"]   = allCocks.length > 1 ? "The rest of" : "Your other";
					parse["cocks2"]  = player.MultiCockDesc(allCocks);
					parse["s"]       = allCocks.length > 1 ? "s" : "";
					parse["notS"]    = allCocks.length > 1 ? "" : "s";
					parse["itTheir"] = allCocks.length > 1 ? "their" : "it";
					Text.NL();
					Text.Add("[other] [cocks2] shoot[notS] [itTheir] load[s] all over her body, painting her dark fur with thick, white stripes.", parse);
				}
			}
			Text.NL();
			Text.Add("<i>“Mmm… nice and thick,”</i> Miranda purrs contentedly.", parse);
			cont();
		};

		//[Inside][Outside][Ass]
		var options = new Array();
		options.push({ nameStr : "Inside",
			func : function() {
				Text.Clear();
				Text.Add("You are not about to stop here. With a rapid series of thrusts, you go over the edge and pour your cum into the horny herm.", parse);

				load = player.OrgasmCum();

				// TODO PREG

				loadIn = LoadIn.vag;
				loads();
			}, enabled : true,
			tooltip : "Pour your load into the dommy herm."
		});
		options.push({ nameStr : "Outside",
			func : function() {
				Text.Clear();
				load = player.OrgasmCum();
				if(mode == Mode.back) {
					if(dom > 25) {
						Text.Add("You try to pull out your [cock], but quickly meet resistance.", parse);
						Text.NL();
						Text.Add("<i>“Oh no you don’t,”</i> she growls, locking her legs around your hips and pulling you back in. <i>“Finish what you started,”</i> she commands, gazing deep into your eyes as you cry out, unleashing your load inside her.", parse);
					}
					else
						Text.Add("You pull out your [cock], just in time to unleash your cum all over the waiting herm. Your load mingles with her own, further coating her in thick, white stripes.", parse);
				}
				else if(mode == Mode.doggy) {
					Text.Add("Just before you blow, you manage to pull out of Miranda’s tight pussy, spending your load across her naked back, sticking to her hair.", parse);
				}
				loadIn = LoadIn.out;
				loads();
			}, enabled : true,
			tooltip : "Pull out and shoot your load all over her body."
		});
		if(widenButt) {
			options.push({ nameStr : "Ass",
				func : function() {
					Text.Clear();
					Text.Add("By now, you’ve worked your thumbs into her ass to the knuckle, giving her a thorough anal workout even as you rail her pussy. Just before you are about to blow, you pull out and plunge your [cock] into Miranda’s butt. The guardswoman gives a surprised yelp, trailing off into a moan as you pour your hot cum inside her.", parse);

					load = player.OrgasmCum();

					loadIn = LoadIn.ass;
					loads();
				}, enabled : true,
				tooltip : "Change your target at the last instant."
			});
		}
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("<i>“You know how to handle that thing pretty well,”</i> Miranda pants after she’s cooled down a bit. <i>“Perhaps I should add it to my collection.”</i>", parse);
		cont();
	}
}


Scenes.Miranda.HomeSubbySexLeavingFuckedHer = function() {
	var parse = {
		playername : player.name,
		lover : miranda.Attitude() < Miranda.Attitude.Neutral ? "bitch" : "lover"
	};

	if(player.sexlevel < 3)
		Text.Add("<i>“Hope I didn’t wear you out, [lover],”</i> she purrs, giving your butt a slap. <i>“I’m far from done with you.”</i>", parse);
	else if(player.sexlevel < 6)
		Text.Add("<i>“Pretty impressive the way you kept up with me back there, [lover],”</i> she says as she stretches. <i>“Been a while since I’ve had such an… energetic fuck buddy.”</i>", parse);
	else
		Text.Add("<i>“Wow, that was intense!”</i> she exclaims, praising your performance. <i>“We’ll be seeing more of each other, and soon.”</i>", parse);
	Text.NL();

	if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry) {
		Text.Add("The two of you set out, returning to your search for the elusive thief.", parse);
		Text.Flush();

		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Residential.street, {minute : 5});
		});
	}
	else if(party.InParty(miranda)) {
		Text.Add("The two of you set out, returning to your quest.", parse);
		Text.Flush();

		Gui.NextPrompt();
	}
	else {
		Gui.Callstack.push(function() {
			Text.NL();
			parse["night"] = world.time.DayTime();
			Text.Add("You bid Miranda farewell and step out into the [night].", parse);
			if(party.Num() > 1) {
				Text.NL();
				parse["comp"] = party.Num() > 2 ? "the rest of your party" : party.Get(1).name;
				Text.Add("Somehow, you make it out the gates in order to rejoin [comp].", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 30});
				});
			}
			else {
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residential.street, {minute: 5});
				});
			}
		});

		if(miranda.Attitude() >= Miranda.Attitude.Neutral && (world.time.hour > 20 || world.time.hour < 4)) {
			Text.Add("<i>“Ya know, it’s kinda late. Why don’t you take that off and come back to bed? Maybe we can squeeze in a quickie before I have to leave in the morning?”</i> she grins.", parse);
			Text.Flush();

			//[Stay][Don’t]
			var options = new Array();
			options.push({ nameStr : "Stay",
				func : function() {
					Text.Clear();
					Text.Add("Miranda scoots over and pats a clean spot beside her. You strip down and join her, using her arm as a pillow. With a grin, she draws you close, resting your head against her breast as her breathing levels out. Soon enough, you join her in a restful slumber.", parse);
					Text.NL();
					Text.Add("You sleep for 8 hours.");
					Text.Flush();

					var func = function() {
						world.StepToHour(8);
						party.Sleep();

						PrintDefaultOptions();
					};

					Gui.NextPrompt(function() {
						Text.Clear();

						Scenes.Dreams.Entry(func);
					});
				}, enabled : true,
				tooltip : "Why not? You’re feeling pretty tired after all."
			});
			options.push({ nameStr : "Don’t",
				func : function() {
					Text.Clear();
					//TODO
					world.TimeStep({hour: 2});
					Text.Add("<i>“Pity, I guess I’ll see you around then,”</i> she says, turning to take a nap.", parse);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Unfortunately, the day isn’t over for you. You’ll have to decline."
			});
			Gui.SetButtonsFromList(options);
		}
		else {
			Text.Add("<i>“I’m going to rest for a while; you can see yourself out, right?”</i> she asks, turning to settle herself in for a more comfortable nap.", parse);
			PrintDefaultOptions();
		}
	}
}


Scenes.Miranda.HomeSubbySex = function() {
	var nasty = miranda.Attitude() < Miranda.Attitude.Neutral;

	var parse = {
		
	};

	parse = player.ParserTags(parse);
	party.location = world.loc.Rigard.Residential.miranda;

	Text.NL();
	Text.Add("Miranda is breathing heavily as she paws at you, dragging and clawing at your gear. There is a fierce fire in her eyes, indicating that at least one of you is in for a <i>really</i> good time. How well this bodes for you, you are not sure.", parse);
	if(miranda.flags["Floor"] == 0) {
		Scenes.Miranda.HomeDescFloor1();
	}
	Text.NL();
	if(nasty)
		Text.Add("<i>“Don’t make me wait, slut,”</i> the horny herm growls. <i>“Naked, <b>now.</b>”</i> In her eagerness, she practically rips your [armor] apart, leaving you as nude as the day you were born. <i>“Naked suits you so much better. Only thing I think I’ll add is a pearly necklace.”</i>", parse);
	else
		Text.Add("<i>“Enough gawking, let's fuck!”</i> the horny herm exclaims, almost ripping apart your [armor] in her eagerness. In short order, she has relieved you of your gear, leaving you standing nude in her foyer. ", parse);

	var Loc = {
		Upstairs   : 0,
		Downstairs : 1
	};
	var location = Loc.Upstairs;

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("She heads into the main living room, hips swaying seductively.", parse);
		Text.NL();
		if(world.time.season >= Season.Autumn)
			Text.Add("<i>“Let me start a fire, get the chill out of our bones,”</i> Miranda says as she pulls you along, throwing you on the fluffy pelt while she fumbles with flint and iron. In short order, the competent guardswoman has a merry fire going, quickly raising the temperature in the room.", parse);
		else
			Text.Add("<i>“Screw foreplay,”</i> Miranda growls, pulling you along and throwing you on top of the fluffy pelt next to the hearth. <i>“I’m just going to take you here and now!”</i>", parse);
		Text.NL();
		Text.Add("<i>“Listen close,”</i> she says, stalking up to you while tearing her own clothes off, <i>“if you stain the rug, you are gonna lick it up. And trust me, you are going to stain the rug.”</i> She discards her top, letting her large breasts bounce freely. Downstairs, her cock is quickly rising to attention.", parse);
		Text.NL();
		Text.Add("The dobie has you in her sights, and she’s not going to take no for an answer.", parse);
		location = Loc.Downstairs;
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“This way!”</i> she motions imperiously, pulling you along up the stairs to her bedroom. The steep stairway gives you quite the view of Miranda’s supple behind, though it’s still obscured by her tight-fitting clothes. The dobie curses as she fumbles a bit with the door, her tail wagging with excitement. When the guardswoman finally manages to get it open, she practically throws you through the doorway and into her bedroom.", parse);

		if(miranda.flags["Floor"] < 2) {
			Scenes.Miranda.HomeDescFloor2();
		}
		else {
			Text.Add(" The room is a total mess - not that you expected any different by now.", parse);
		}
		Text.NL();
		Text.Add("<i>“Try to find a dry pillow to bite down on, you’ll need it,”</i> comes Miranda’s mocking voice from behind you, accompanied by a rustling as she sheds her clothes. Turning to face her, you gulp as you are hit by her stunning beauty. The doberman’s toned body has curves in all the right places; from top to toe, she’s built like an athlete. Not that you’d expect any less from a guardswoman.", parse);
		Text.NL();
		Text.Add("Taut muscles hide just below her short, shiny fur. She has a flat stomach, and broad hips that flare out enticingly, giving her an attractive hourglass figure. Her ass is deliciously rounded, just begging to be groped. Up above, her pillowy breasts heave with her breathing, the shiny, black nipples capping each mound are stiff with arousal. If you had to guess, you’d say she’s about a D-cup. Of course, it’s not like you can ignore the massive knotted shaft sticking out proudly between her legs either.", parse);
		Text.NL();
		Text.Add("<i>“Check out the goods all you like,”</i> Miranda quips sultrily, tossing her long hair over her shoulder. <i>“Don’t daydream for too long, though. As you can see, I’m getting kinda antsy.”</i>", parse);
		Text.NL();
		Text.Add("It seems like she has you within her sights, so you better speak up quickly unless you are going to just let her take you. If her wide grin and stiff cock are any judge, she’s itching to have a go at you.", parse);
		location = Loc.Upstairs;
	}, 1.0, function() { return true; });

	scenes.Get();

	Text.Flush();

	parse["loc1"] = function() { return location == Loc.Upstairs ? "the bed" : "the rug" };
	parse["loc2"] = function() { return location == Loc.Upstairs ? "the soft sheets" : "the fluffy pelt" };

	//[Take anal][Take vag][Dommy ride]
	var options = new Array();
	options.push({ nameStr : "Take anal",
		func : function() {
			Scenes.Miranda.HomeSubbySexTakeAnal(location, Loc);
		}, enabled : true,
		tooltip : "You need her... offer your ass to the horny herm."
	});
	//TODO
	if(player.FirstVag()) {
		options.push({ nameStr : "Take vag",
			func : function() {

			}, enabled : false,
			tooltip : "Beg Miranda to fuck your pussy; you want to feel her doggy dick dig deep into your wet folds."
		});
	}

	var cocksInVag = player.CocksThatFit(miranda.FirstVag(), false, 15);
	var p1Cock     = player.BiggestCock(cocksInVag);

	options.push({ nameStr : "Dommy ride",
		func : function() {
			Scenes.Miranda.HomeSubbySexDommyRide(location, Loc);
		}, enabled : true,
		tooltip : "Perhaps... she’d let you fuck her if you asked?"
	});

	Gui.SetButtonsFromList(options, false, null);
}

//TODO
Scenes.Miranda.HomeSubbySexDommyRide = function(location, Loc) {
	var nasty = miranda.Attitude() < Miranda.Attitude.Neutral;
	var p1cock = player.BiggestCock(null, true);
	var strapon = p1cock ? p1cock.isStrapon : false;
	var borrowed = false;

	var parse = {
		playername : player.name,
		boygirl : player.mfFem("boy", "girl"),
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, null, "2");
	parse["loc1"] = function() { return location == Loc.Upstairs ? "the bed" : "the rug" };
	parse["loc2"] = function() { return location == Loc.Upstairs ? "the soft sheets" : "the fluffy pelt" };

	var dom = miranda.SubDom() - player.SubDom();

	Text.Clear();
	if(nasty) {
		Text.Add("<i>“What the fuck makes you think that you have earned that privilege?”</i> Miranda laughs mockingly, rejecting your suggestion. <i>“I’m the one doing the fucking; you’re the one staggering home bowlegged.”</i>", parse);
		Text.Flush();
		return;
	}
	Text.Add("<i>“Taking airs, aren’t we? I don’t think I’ve trained you well enough yet…”</i> She taps her chin thoughtfully, her other hand resting on her generous hip. <i>“Not that I don’t like being on the receiving end once in a while… but <b>I’m</b> going to be the one in charge. You just… lie down and take it.”</i>", parse);
	Text.NL();
	Text.Add("Well… perhaps not what you were after, but it looks like this is all you’re going to get for the moment. Miranda pushes you down on [loc2], seating herself on your [breasts], facing away from you. ", parse);

	p1cock = p1cock || Items.StrapOn.CanidStrapon.cock;
	parse["cocks"] = function() { return player.MultiCockDesc(); }
	parse["cock"]  = function() { return p1cock.Short(); }
	parse["tip"]   = function() { return p1cock.TipShort(); }

	var knotted = p1cock.knot != 0;

	var Size = {
		small  : 0,
		medium : 1,
		huge   : 2
	};

	var msize = Math.sqrt(miranda.FirstCock().Volume());
	var psize = Math.sqrt(p1cock.Volume());
	var diff  = psize - msize;

	var size = diff < -15 ? Size.small :
	           diff <   5 ? Size.medium : Size.huge;

	if(!player.FirstCock()) {
		if(strapon) {
			Text.Add("<i>“You came prepared for this?”</i> she sniffs, haughtily looking over your offered strap-on. <i>“The nerve… but I suppose it’ll do. We just need to prepare it...”</i>", parse);
		}
		else {
			Text.Add("<i>“Now, which one should I use...”</i> the dobie muses, looking over her collection of toys. <i>“Something nice and thick… here!”</i> She triumphantly pulls out a bright red strap-on with a thick knot at the base, almost as big as her own member. <i>“This one has seen a fair bit of use over the years,”</i> she murmurs fondly. <i>“Just need to get her prepared.”</i>", parse);
			strapon = true;
			borrowed = true;
			parse["cocks"] = function() { return p1cock.Short(); }
		}
		Text.NL();
		Text.Add("Just when you start wondering what she means with ‘prepare’, you feel something prod at your [vag]. <i>“It’s only fair; if you want to fuck me, you provide the lube,”</i> Miranda grins over her shoulder as she pushes the [tip] into your nethers, probing your depths with the toy. She shuffles her hips back until she’s straddling your face, presenting you with her soaked pussy. <i>“Get to work before I change my mind.”</i>", parse);
	}
	else {
		Text.Add("<i>“Now, let’s see what you’re packing,”</i> she hums, coaxing your [cocks] to full mast. ", parse);
		if(size == Size.huge)
			Text.Add("<i>“Woah, overcompensating?”</i> the dobie teases, impressed at your size. <i>“Whatever you’ve been eating, I want some of that!”</i>", parse);
		else if(size == Size.medium)
			Text.Add("<i>“Not bad, you’re almost as big as me!”</i>", parse);
		else
			Text.Add("<i>“Not very impressive, but you’ll have to do.”</i>", parse);
		Text.NL();
		Text.Add("You shiver as you feel Miranda clasp her fingers around[oneof] your cock[s], stroking [itThem] lightly. <i>“Think you can keep up?”</i> she taunts. <i>“The moment you hesitate, I’m turning the tables right around, and your ass is next in line.”</i> You gulp, knowing that she’s not joking.", parse);
		Text.NL();
		Text.Add("<i>“This one will do nicely,”</i> the dobie hums, shuffling back until she’s straddling your face. The powerful smells of her soaked pussy, her heavy balls and her stiff cock are almost overwhelming. <i>“Get to work,”</i> she commands imperiously before she closes her lips around your [cock].", parse);

		Sex.Blowjob(miranda, player);
		miranda.FuckOral(miranda.Mouth(), p1cock, 1);
		player.Fuck(p1cock, 1);
	}

	Text.NL();
	Text.Add("Might as well do as she asks. You give her an experimental lick, getting a quick taste of the herm before she suddenly grinds her hips back, forcing you to get serious. ", parse);
	if(dom > 0)
		Text.Add("<i>“If you want a piece of this, you better show some more dedication,”</i> Miranda growls, grinding her crotch on you face. <i>“I’m still of a mind to flip you over and wreck you.”</i> ", parse);
	else
		Text.Add("<i>“Have a taste, sexy,”</i> Miranda purrs, presenting you with her dripping nethers. <i>“I’m aching for a good fuck!”</i> ", parse);
	if(player.FirstCock()) {
		Text.Add("Returning to her blowjob, the dobie ", parse);
		if(player.NumCocks() > 1)
			Text.Add("takes turns suckling each of your cocks, mainly focusing on your biggest one.", parse);
		else if(player.HasBalls())
			Text.Add("fondles your balls as she laps at your [cock], giving them an alarming squeeze now and then to remind you of who is in charge.", parse);
		else
			Text.Add("keeps a tight grip on the base of your [cock] as she laps at the painfully rigid member.", parse);
		Text.NL();
		Text.Add("Of course, this being Miranda, she’s not going to stop there. ", parse);

		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("Her fingers, sloppy with your pre, sneak their way down below your [cocks], find your wet gash and plunge inside it, drawing another gasp from you. She doesn’t play fair, toying with both your sets that way.", parse);
		}, 1.0, function() { return player.FirstVag(); });
		scenes.AddEnc(function() {
			parse["l"] = player.HasLegs() ? "down between" : "around";
			Text.Add("Her fingers, sloppy with your pre, sneak their way [l] your [legs], teasing your taint and prodding at your back door. You stifle a moan as she slips inside you; first one, then two digits. Better concentrate so she doesn’t forget about <i>you</i> being the one fucking <i>her</i>.", parse);
		}, 1.0, function() { return true; });

		scenes.Get();
	}
	else {
		Text.Add("Her eagerness to get started shows; even as you start eating her out, the dobie shoves inch after inch of the strap-on into your [vag], lubing it up in your own juices.", parse);
		Text.NL();
		Text.Add("<i>“You’re taking it quite well, good [boygirl].”</i> You moan a muffled reply, wincing as you feel it probe deeper and deeper. Just as you feel the spark of your orgasm starting to grow, she pulls out the toy, fumbling with its straps. In short order, she has you set up, the back of the artificial member rubbing you incessantly as it juts out proudly from your crotch.", parse);
	}
	Text.NL();
	Text.Add("<i>“Ready or not, here I come!”</i> The guardswoman twirls around, facing you once more and grinding her pussy along the length of your [cock], pressing it against your stomach. Her thrusts rub the tip of her own dick against your chin, leaving a sloppy kiss of pre behind it. She holds you in place while she uses her free hand to guide your [cock] inside her wet slit, grunting as she lowers herself. The herm’s own shaft twitches as you impale her, shooting a splatter of pre-cum that lands on your [breasts].", parse);
	Text.NL();

	Sex.Vaginal(player, miranda);
	miranda.FuckVag(miranda.FirstVag(), p1cock, 3);
	player.Fuck(p1cock, 3);

	if(player.FirstCock()) {
		Text.Add("You moan in pleasure from the wet, warm and tight passage embracing your [cock], sucking it in vigorously. ", parse);
		if(size == Size.huge) {
			Text.Add("<i>“Oh f-fuck!”</i> Miranda yelps, her thighs trembling as she tries to accommodate your massive cock. Her pussy is clamped around you tight as a vice, and for once it looks like the cocky herm has taken on more than she can chew.", parse);
			Text.NL();
			Text.Add("Grinning, you ask her if you’re too much for her to handle. Her reply is a dark glare. <i>“D-don’t get full of yourself,”</i> she gasps, sweat forming on her brow. <i>“T-this puny little stick is nothing!”</i> Poking at her competitive vein seems to do the trick; she looks determined to make the damn thing fit.", parse);
		}
		else if(size == Size.medium)
			Text.Add("<i>“Mm… perfect fit,”</i> Miranda pants, her tongue lolling and her eyelids half-closed. It takes her a few strokes, but she manages to ease your thick member into her tight passage, sighing luxuriously. <i>“P-perhaps I won’t regret this after all.”</i>", parse);
		else
			Text.Add("<i>“Barely enough to please a woman,”</i> Miranda scoffs, bottoming out and grinding her balls on your crotch. <i>“I’ll let it pass this once, but if you don’t have anything more impressive to come up with, perhaps you should be on the receiving end instead.”</i>", parse);
	}
	else {
		if(size == Size.huge)
			Text.Add("<i>“How do you even carry this thing around?”</i> Miranda gasps, struggling to take your massive strap-on. Too much for her to handle? <i>“Fuck no! What, you think I give but can’t take?”</i>", parse);
		else if((size == Size.medium) || borrowed)
			Text.Add("<i>“Fits like a glove,”</i> Miranda sighs as she sinks down on the huge strap-on. <i>“Just how I like them!”</i>", parse);
		else
			Text.Add("<i>“You better bring me something bigger next time,”</i> Miranda grunts, easily taking the entire length of your strap-on. <i>“Tiny things like this doesn’t really do it for me anymore… you’re going to have to work for it unless you want to choke on dick when this is over.”</i>", parse);
		Text.Add(" She slams herself down on you, grinding the base of the toy against your crotch.", parse);
	}
	Text.NL();
	if(size == Size.small)
		Text.Add("You do your best to rock your [hips] in time with Miranda’s bounces, her harsh words fresh in mind. Making the dobie angry is <i>not</i> something you want to do… perhaps it’s best to let her have her way after this is over and done with. Until that time, you have to prove yourself, however.", parse);
	else {
		parse["c"] = size == Size.huge ? Text.Parse(", gasping as she gives her all to spear herself on your [cock]", parse) : "";
		Text.Add("You just lie back and enjoy as the horny herm bounces up and down on you[c]. You mostly let her do the work - and she’s doing a mighty fine job of it - but after a while, you start to get into it, slowly thrusting your [hips] in time with Miranda, meeting her halfway.", parse);
	}
	Text.NL();
	Text.Add("Your [hand] traces the curves of her body, caressing her short fur and feeling the taut muscles beneath. Her wide hips - worthy of a true breeder - her flat tummy, her voluptuous breasts... the morph is built like a statue praising ancient gods, every part of her chiseled to perfection.", parse);
	Text.NL();
	Text.Add("The guardswoman moans appreciatively, her nails raking your chest roughly but thankfully not drawing blood. ", parse);
	if(size == Size.huge)
		Text.Add("<i>“By the trickster, it feels like riding a fucking minotaur,”</i> she yelps, wincing as she slams down, her overstuffed cunt greedily swallowing your [cock]. <i>“G-go slow...”</i>", parse);
	else
		Text.Add("<i>“Yeees… keep that up, just like that,”</i> she pants encouragingly, tongue hanging out. <i>“Mm… I need it!”</i>", parse);
	Text.Add(" Whatever you’re doing seems to be working, so you keep it up, boldly placing a [hand] on Miranda’s hip.", parse);
	Text.NL();
	var jerk = false;
	if(dom > 0) {
		Text.Add("<i>“Nice try,”</i> the sweating herm quips, flashing you a grin. <i>“All this action has my cock being all antsy though… You want your [hand]s <b>here</b>.”</i> She’s quite firm as she moves your grip to her stiff, throbbing meatstick, brooking no argument. As she wishes… You have a feeling you have a sticky shower rapidly approaching, and you resign yourself to your fate.", parse);
		if(player.NumCocks() > 1) {
			Text.NL();
			parse["c"] = player.NumCocks() > 2 ? Text.Parse("another one of your [cocks]", parse) : "your other cock";
			Text.Add("You grasp her member and [c], mashing them together. Her shaft is aching for a hole to plug, but the embrace of your [hand]s will have to do. With each bounce, she grinds against your dick, frotting you in addition to fucking you.", parse);
		}
		jerk = true;
	}
	else {
		Text.Add("The herm lets herself be guided, gasping and moaning with each thrust. Her eyes are closed, her mouth open, and you can tell that she’s getting close. This puts you right in the line of fire for her throbbing cock, something the dobie no doubt calculated when she put you in this position. For what you’re getting in return, you suppose you can live with a sticky shower.", parse);
	}
	Text.NL();
	Text.Add("Lost in her own pleasure, she rides you like a herm possessed, the throes of your loving no doubt raising the entire neighborhood. You’re not sure how long she rides you; time blurs into something abstract and without meaning in her warm, wet embrace. The bouncing of her huge tits above you becomes mesmerizing, her rock-hard black nipples pulling your eyes like a hypnotist.", parse);
	Text.NL();
	if(player.FirstCock())
		Text.Add("The tight warmth of her cunt is heavenly, a wet sleeve relentlessly milking your [cock]. ", parse);
	Text.Add("Regardless of her professed love of using that cock of hers on anything that moves, you can tell she’s been aching for someone to give her a good fuck, and you’re more than happy to deliver.", parse);
	Text.NL();
	parse["j"] = jerk ? " in your hand" : "";
	parse["t"] = strapon ? "r toy" : "";
	Text.Add("<i>“Just… a little more… close…!”</i> Miranda gasps, slamming her hips down a final time. Her cock lurches[j], the first jet of her massive load splattering all over your face. As she climaxes, you can feel her passage clenching around you[t]. The second blast goes lower, painting a long, white streak from your belly to your jaw. There’s quite a bit more where that came from; it feels like minutes before she’s finally spent, her seed basting you, [loc2] and parts of the wall behind you.", parse);
	if(jerk)
		Text.Add(" A final surge goes through the trembling shaft in your grip, depositing one last serving on the sticky mess sprayed across your [breasts].", parse);
	Text.NL();

	var cum = player.OrgasmCum();

	if(player.FirstCock()) {
		Text.Add("Your own orgasm, ", parse);
		if(cum > 6)
			Text.Add("even more spectacular than Miranda’s,", parse);
		else if(cum > 3)
			Text.Add("easily comparable to Miranda’s,", parse);
		else
			Text.Add("meager when compared to Miranda’s,", parse);
		Text.Add(" goes off inside the herm, ropes of sticky white pouring into her womb. ", parse);
		if(player.NumCocks() > 1)
			Text.Add("Your other cock[s2] also blast[notS2] [itsTheir2] load[s2], further adding to the mess you’ve made. ", parse);
		if(knotted) {
			parse["c"] = cum > 3 ? ", her belly rapidly expanding as you pour more and more cum into her" : "";
			Text.Add("Your knot swells, tying you with your lover[c]. ", parse);
		}
		Text.Add("The two of you collapse, hugging each other as you ride out your orgasmic high.", parse);
		if(knotted) world.TimeStep({minute: 30});
	}
	else {
		Text.Add("Your own orgasm is triggered when the threshing herm grinds the base of the toy against your crotch, and it spreads like lightning through your body. Overcome with need, your pussy clenches, leaking girly juices while you ride out your orgasmic high. The two of you collapse in each other’s arms, panting from the exertion.", parse);
		Text.NL();
		Text.Add("<i>“If you want, I’m good for another round in a bit,”</i> Miranda murmurs, eyeing you sympathetically. <i>“Return the favor, you know.”</i> Maybe later… right now, you need some rest.", parse);
	}
	Text.Flush();

	world.TimeStep({hour: 1, minute: 30});

	Gui.NextPrompt(function() {
		Text.Clear();
		Scenes.Miranda.HomeSubbySexLeavingFuckedHer();
	});
}

Scenes.Miranda.HomeSubbySexTakeAnal = function(location, Loc) {
	var nasty = miranda.Attitude() < Miranda.Attitude.Neutral;

	var parse = {
		playername : player.name,
		lover : nasty ? "bitch" : "lover",
		boyGirl : player.mfTrue("boy", "girl"),
		guyGirl : player.mfTrue("guy", "girl"),
		manWoman : player.mfTrue("man", "woman"),
		masterMistress : player.mfTrue("master", "mistress"),
		loc1 : function() { return location == Loc.Upstairs ? "the bed" : "the rug" },
		loc2 : function() { return location == Loc.Upstairs ? "the soft sheets" : "the fluffy pelt" }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	var dom = miranda.SubDom() - player.SubDom();

	Text.Clear();
	if(player.Slut() >= 50) {
		Text.Add("You give her a seductive smile before turning around, bending over [loc1] and shaking your [butt] enticingly. <i>“My, aren’t we eager,”</i> Miranda purrs, suddenly very close. You can feel her hot breath on your exposed behind as she kneels down, rubbing your cheeks possessively. <i>“And where do you want it?”</i> she asks sultrily.", parse);
		Text.NL();
		Text.Add("Moaning in need, you lick one of your fingers, reaching behind your back and thrusting it into your [anus]. <i>“Can’t wait to have your hole reamed, can you, [lover]?”</i> she eggs you on. <i>“I just love slutty [boyGirl]s like you begging me to fuck them!”</i>", parse);
		Text.NL();
		Text.Add("You nod eagerly, holding your cheeks wide for the dobie to do with as she wishes.", parse);
	}
	else if(dom > 25) {
		Text.Add("You bow your head, turning around meekly and bending over [loc1]. Soft steps fall behind you as your mistress stalks closer, a hunter closing in on her prey. <i>“You know just what I want, don’t you?”</i> Miranda purrs, her voice hot on the back of your neck, full of sultry promises. As if it wasn’t clear, she gropes your [butt], her throbbing cock depositing splatters of pre on your back as she grinds it between your cheeks.", parse);
		Text.NL();
		Text.Add("Nodding quickly, you reach back behind you, your [hand]s trembling slightly as you touch her, trailing down her toned stomach and gently caressing her stiff member. The crimson battering ram twitches in your grasp as the dommy dobie bucks her hips impatiently.", parse);
		Text.NL();
		Text.Add("<i>“What I want is what you want, so bend over and offer it, [lover],”</i> she growls between gritted teeth. Hurrying to please her, you bury your face in [loc2], spreading your butt cheeks wide for the herm.", parse);
	}
	else {
		Text.Add("She’s going to take what she wants either way, so why not humor her? Smiling seductively, you wave for her to come over, giving your [butt] an inviting slap. <i>“A [manWoman] of my own tastes,”</i> Miranda chuckles, hips swaying as she closes in on you.", parse);
		Text.NL();
		Text.Add("<i>“Did you imagine this was what was going to happen when you followed me here?”</i> Miranda murmurs as she cups your cheeks while something wet and stiff pokes you in the back. She rubs her breasts against you, inexorably pushing you forward until you are bent over [loc1].", parse);
		Text.NL();
		Text.Add("Reaching back to spread your butt cheeks, you admit that you considered it a looming possibility. <i>“You won’t be disappointed, [lover].”</i>", parse);
	}
	Text.NL();
	Text.Add("Presented with such a tempting target, Miranda grasps one of your cheeks roughly while she guides herself to your puckered rosebud. ", parse);
	if(player.HasTail())
		Text.Add("Her hand pauses by your [tail], squeezing it lightly and sending a shudder up your spine. ", parse);
	Text.Add("The tip of her mastiff molester pokes at your [anus], rubbing in her sticky pre.", parse);
	Text.NL();
	if(nasty)
		Text.Add("<i>“Mm… seems you’re in luck - I happen to have a small dab of lube left. Who knows, had you come tomorrow I may have had to take you for a dry run, eh?”</i> she jokes - or so you hope - as she splashes a cool liquid along her shaft and leaking between your cheeks. <i>“That ought to be enough - no sense wasting this on someone like you.”</i>", parse);
	else
		Text.Add("<i>“Just give me a second… there!”</i> The dobie conjures a bottle of lube from somewhere, spreading a generous amount of its contents on her cock and between your cheeks. <i>“Wouldn’t do to ruin you right away, right? You need to be ready for round two later,”</i> she adds cheerfully.", parse);
	Text.NL();
	Text.Add("Deeming you as ready as you’re likely to be, the guardswoman lines herself up, slowly pushing her way inside your [anus]. Thanks to the lube she applied and the pointed tip of her canine cock, the initial entry is somewhat eased. However, you know full well that it’s going to be followed by the better part of a foot of thick dog meat, and that Miranda isn’t one to hold back for the comfort of others.", parse);
	Text.NL();

	Sex.Anal(miranda, player);
	player.FuckAnal(player.Butt(), miranda.FirstCock(), 3);
	miranda.Fuck(miranda.FirstCock(), 3);

	Text.Add("Once her head has firmly established its breach in your protesting ass, the herm grabs you by the hips and sinks her knotted dick deeper into you, conquering your colon one inch at a time. You bite down, enduring her rough treatment. As she goes deeper, her cock stirs something within you, an inebriating pleasure roaring out all other thoughts. Overcome by the sensation, you let out a whimpering moan.", parse);
	Text.NL();
	if(nasty)
		Text.Add("<i>“Doesn’t it feel much better to give in to your true nature, my little slut?”</i> Miranda eggs you mockingly as she pushes forward. <i>“There is no one to hide it from here; you can yell at the top of your lungs how much you want to be fucked.”</i>", parse);
	else if(dom > 25) {
		Text.Add("<i>“How does it feel when your mistress dominates you, my little pet?”</i> Miranda quips, her breathing coming in short bursts as she slowly pushes herself forward. <i>“Am I going too slow for you?”</i>", parse);
		Text.NL();
		Text.Add("You manage to moan an incoherent reply, which the herm probably interprets as encouragement.", parse);
	}
	else
		Text.Add("<i>“Mm, I just love sticking my cock in [guyGirl]s like you!”</i> Miranda moans. <i>“Ngh… just a little bit further… <b>that’s</b> the spot!”</i>", parse);
	Text.NL();
	Text.Add("<i>“Like that?”</i> she grunts, her even thicker knot finally knocking on your rear entrance. <i>“Tell me, [lover], how do you want it?”</i>", parse);
	Text.NL();
	Text.Add("You squirm a bit, knowing she’ll only accept one response.", parse);
	Text.Flush();

	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("<i>“That’s my [boyGirl]!”</i> Miranda commends you, patting you on the butt. <i>“No regrets now; I’m not going to stop until I’m satisfied!”</i> With those words, your fate is sealed. Pulling back her hips, the doberman shifts her position, planting her legs to either side of you, her hands snaking their way in under your [breasts]. ", parse);
		Text.NL();
		if(player.FirstBreastRow().Size() > 3)
			Text.Add("She squishes your boobs together and rests her own on your back, pressing you down into [loc2]. ", parse);
		Text.Add("For a second, she hovers above you with only her tip lodged inside your stretched asshole, poised to strike.", parse);
		Text.NL();
		Text.Add("<i>“Here it comes,”</i> she whispers in your ear sweetly, slamming down her hips hard. You gasp helplessly as all the air is driven from your lungs, the immensely satisfying sense of being full spreading through your nethers.", parse);
		if(player.FirstCock()) {
			parse["notS"] = player.NumCocks() > 1 ? "" : "s";
			Text.Add(" Your [cocks] flop[notS] around wildly, roused to full mast through the herm’s repeated assault on your prostate.", parse);
		}
		if(player.FirstVag())
			Text.Add(" Your [vag], feeling left out, aches for your attention. Almost without you thinking about it, your [hand] sneaks its way down there, fingering your wet folds.", parse);
		Text.NL();
		Text.Add("Once Miranda has gotten started, there is no respite for your poor sphincter. Here in her own home, she doesn’t have to worry about being interrupted, which likely means she’ll continue fucking you until she collapses. Unfortunately for you, given her stamina, that is going to be a while. From the way she’s reaming you, it seems like she’s trying to fuck you through [loc1].", parse);
		Text.NL();
		Text.Add("<i>“Mm, good [boyGirl]! Clench down on my cock!”</i> the dobie growls. ", parse);
		var bt = player.Butt().Tightness();
		if(bt < Orifice.Tightness.loose)
			Text.Add("<i>“Fuck, you are tight! I love breaking in a new ass!”</i>", parse);
		else if(bt < Orifice.Tightness.gaping)
			Text.Add("<i>“Heh, this isn’t the first time you’ve received a good fucking, is it?”</i>", parse);
		else
			Text.Add("<i>“Fuck, just what have you stuffed in here? You probably spend all your time as the town mount if you’re gaping as wide as this!”</i>", parse);
		parse["prostateColon"] = player.FirstCock() ? "prostate" : "colon";
		Text.Add(" Each word is underlined by another deep thrust, slamming into your [prostateColon] like a piledriver.", parse);
		Text.NL();
		parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? Text.Parse(", hoisting your [legs] over her shoulder", parse) : "";
		Text.Add("You arch your back in pleasure; sure, Miranda is rough, but you can’t ignore that this feels <i>good</i>. After ten minutes of straight fucking, she’s still not showing any signs of slowing down, only stopping briefly at one point to flip you on your back[legs].", parse);
		Text.NL();

		if(player.FirstCock()) {
			Text.Add("Your [cocks] [isAre] bobbing freely, fully rigid from your near constant prostate pounding. ", parse);
			if(nasty)
				Text.Add("<i>“Just look at [thatThose] pathetic cock[s] of yours, flopping uselessly,”</i> she sneers. <i>“Pity you won’t ever get to use them on me.”</i>", parse);
			else
				Text.Add("<i>“Looks like <b>someone</b> likes this,”</i> she huffs, grinning as she strokes your erection[s]. <i>“Would be a shame to let this go to waste, but it’ll have to wait until I’m satisfied.”</i>", parse);
			Text.NL();
		}

		if(player.FirstVag()) {
			Text.Add("<i>“Woah, you’re dripping down here!”</i> Miranda exclaims, remarking on your wet cunt. ", parse);
			if(nasty)
				Text.Add("<i>“How convenient; it gives me another hole to fuck once I’ve ruined this one,”</i> she adds, her grin seething with playful malice.", parse);
			else
				Text.Add("<i>“We’ll have to see to this later; can’t have you hobbling around my city smelling like a bitch in heat.”</i>", parse);
			Text.NL();
		}
		Text.Add("Before long, you find yourself arching your back as lightning races down your spine. Your entire body tingles as it wavers on the brink of orgasm, suspended on the thick, crimson cock impaling you. What finally pushes you over the edge is Miranda ramming her knot inside your rectum, locking almost a foot of doberman dick in your butt. The two of you cry out in unison as you cum, burst after burst of cock-cream pouring into your bowels.", parse);
		Text.NL();

		miranda.OrgasmCum(1.5);
		var cum = player.OrgasmCum(1.5);

		if(player.FirstCock()) {
			Text.Add("With a final twitch, your [cocks] explode[notS] in a fountain of white seed, splattering all over. ", parse);
			if(cum > 6) {
				Text.Add("Even for you, the discharge is impressive; by the time you’re spent, both of you are covered in thick ropes of sticky cum, and a small pool is spreading around you on [loc2].", parse);
				Text.NL();
				Text.Add("<i>“Fuck, that was intense!”</i> Miranda pants, wiping a large glob of your semen from her chin.", parse);
			}
			else if(cum > 3) {
				Text.Add("Your cock[s] make[notS] no distinction in [itsTheir] wanton hosing, spreading your semen on yourself, Miranda and [loc2].", parse);
			}
			else {
				Text.Add("Most of it lands on your [belly] and [breasts], trickling down on [loc2].", parse);
			}
			if(location == Loc.Downstairs) {
				Text.NL();
				Text.Add("<i>“What did I tell you about staining the rug?”</i> the herm growls, a bit miffed at the mess you caused. <i>“Guess I’m not entirely blameless, but let’s continue this upstairs.”</i>", parse);
			}
		}
		else if(player.FirstVag()) {
			Text.Add("Your femcum gushes forth, clear drops trickling down around the base of Miranda’s fuckstick. While you may have gotten off from the intense anal fuck you just received, your loins are still aching, begging to be filled.", parse);
		}
		Text.NL();
		if(location != Loc.Upstairs) {
			parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? ", your legs wrapped around her" : "";
			Text.Add("Not even waiting for her knot to deflate, Miranda hoists you up[legs], patting you on the back as she strides toward the stairs. You gulp as you feel the cum inside you roiling about, but the canid buttplug holds, and just a little of it seeps out.", parse);
			Text.NL();
			Text.Add("<i>“I’m far from done with you,”</i> she murmurs in your ear, nipping you playfully. Once in her bedroom, she closes the door behind her, still carrying you around.", parse);

			if(miranda.flags["Floor"] < 2) {
				Scenes.Miranda.HomeDescFloor2();
			}
			else {
				Text.Add(" <i>“We’ll probably be at this for a while; let’s clear a space.”</i>", parse);
			}
			Text.NL();
			Text.Add("Sweeping her scattered toys to the side, the doberwoman throws you on top of the bed, still locked with you hip to hip.", parse);
			Text.NL();
			Text.Add("<i>“Now, where were we?”</i> she purrs as she looms over you, her eyes still filled with unsated lust.", parse);

			location = Loc.Upstairs;
		}

		world.TimeStep({hour : 1});

		Text.Flush();

		Gui.NextPrompt(function() {
			Gui.Callstack.push(function() {
				miranda.relation.IncreaseStat(75, 1);
				world.TimeStep({hour : 4});

				Text.Flush();
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Eventually, the two of you rouse from your afterglow and start to poke around for your gear. Miranda’s room is even more of a mess than before, and it reeks of sex.", parse);
					Text.NL();

					player.subDom.DecreaseStat(-75, 1);
					miranda.subDom.IncreaseStat(75, 3);

					Scenes.Miranda.HomeSubbySexLeavingFuckedHer();
				});
			});

			Text.Clear();
			Text.Add("It takes a few more minutes before Miranda’s knot finally deflates, though she’s still hard inside you. <i>“Mm… not bad for round one,”</i> she sighs, stretching luxuriously. As she shifts her hips, her knot plops out, the pointed tip of her dick rummaging around your sticky innards. <i>“How about we continue, [lover]?”</i>", parse);
			Text.NL();
			if(player.sexlevel < 3) {
				Text.Add("You’ve still barely recovered from the last bout, but the guardswoman isn’t about to let up for your comfort. She takes you through just about every sex position you can name, and quite a few that you can’t, though your ass is always on the receiving end.", parse);
				Text.NL();
				Text.Add("As you mate with Miranda, your senses gradually blur, dulled by near constant pleasure. Though she claimed that she’s only out to sate her own lusts, in the process of doing so the dommy dobie is showing you heights of ecstasy previously unknown to you… and beyond the capacity of your body.", parse);
				Text.NL();

				Sex.Anal(miranda, player);
				player.FuckAnal(player.Butt(), miranda.FirstCock(), 3);
				miranda.Fuck(miranda.FirstCock(), 3);

				miranda.OrgasmCum();
				player.OrgasmCum(3);

				Text.Add("By the time you pass out, she has thoroughly drained you, herself spilling her seed in and on you several times. Even if your butt wasn’t constantly being stretched by the tireless herm, it would probably be gaping by now. The last thing you remember before you drift off is being pushed face-first into a very sticky pillow, Miranda’s massive cock drilling you feverously.", parse);
				Text.NL();
				Text.Add("Time passes…", parse);

				PrintDefaultOptions();
			}
			else if(player.sexlevel < 6) {
				Text.Add("You’re a bit winded, but not about to turn down more sex with the wild guardswoman. The two of you dive into an unrestrained bout of passion, going at each other like animals. ", parse);
				if(nasty)
					Text.Add("Despite her usually derogatory way of talking to you, Miranda is almost loving; rough, yes, but delighted at being able to fuck someone with a sexdrive matching her own.", parse);
				else
					Text.Add("Your rampant romp is in danger of wrecking Miranda’s bed, though it seems to be made of sturdy stuff. The horny doberman showers you with kisses as she goes down on you, showing her love in her own rough way.", parse);
				Text.NL();
				parse["l"] = player.LowerBodyType() != LowerBodyType.Humanoid ? ", taking full advantage of your rather strange physique" : "";
				Text.Add("The two of you go through a series of largely improvised positions[l]. You lost count of how many times you climax, only pausing in your fervent love making while waiting for Miranda’s knot to deflate.", parse);
				if(player.FirstCock()) {
					parse["nice"] = !nasty ? Text.Parse(", even taking a ride on [itThem] once", parse) : "";
					Text.Add(" So as not to leave your [cocks] unattended, the dogmorph gives [itThem] some attention with her tongue[nice].", parse);
				}
				if(player.FirstVag()) {
					Text.NL();
					Text.Add("In order to relieve your aching [vag], the dogmorph stuffs some of her toys into the wet cleft. She casually mentions that she’s going to use that hole instead next time since you’re whimpering so much about it.", parse);
				}
				Text.NL();

				Sex.Anal(miranda, player);
				player.FuckAnal(player.Butt(), miranda.FirstCock(), 3);
				miranda.Fuck(miranda.FirstCock(), 3);

				miranda.OrgasmCum();
				player.OrgasmCum(3);

				Text.Add("<i>“Mm… you’ve got quite the stamina, [lover],”</i> the guardswoman purrs, hugging you tightly as she humps you. <i>“I think I’ll keep you.”</i> It’s several more hours before your coitus finally teter off, and both of you collapse from exhaustion in a sticky heap.", parse);

				PrintDefaultOptions();
			}
			else { // high sexp
				Text.Add("In response, you wrap your arms around her, pulling her into a tight embrace. If she looks a little surprised at your reaction, it’s nothing compared to when you flex your trained muscles, clamping down on her cock. ", parse);
				if(nasty)
					Text.Add("<i>“Woah, you sure got a slutty ass, [playername]! Can’t wait to get fucked, can you?”</i>", parse);
				else
					Text.Add("<i>“Oh!”</i> she exclaims. <i>“So eager! Can’t wait to have me pour another load in you?”</i>", parse);
				Text.Add(" Rather than waste more time on idle conversation, you urge her to get started, undulating your hips urgently.", parse);
				Text.NL();
				Text.Add("Now that she’s really gotten you going, you are an inexhaustible sex machine, moaning loudly as she slams her hips against yours. You grind your ass back against her, forcibly impaling yourself on her crimson rod. Miranda bites her lip, suddenly looking very focused. When she shows signs of slowing down, you wheel around hopping up on top of her and letting gravity do the work. The dobie cries out as you sink down, her knot slamming home in your overstuffed rectum. You are rewarded with another stomachful of dog seed, further bloating your already swollen belly.", parse);
				Text.NL();

				miranda.OrgasmCum();

				Text.Add("<i>“Ah, I haven’t cum like that in <b>days</b>,”</i> she pants, trembling as she collapses on her back. Still not satisfied, you start to roll your [hips], using her massive knot to stimulate you ass. <i>“H-hold on,”</i> she gasps, feeling the situation spiraling out of her control. <i>“I haven’t- Ah!”</i>", parse);
				Text.NL();
				Text.Add("Gyrating your hips wildly, you somehow manage to pull her knot loose again - only to slam yourself back down on it immediately. The guardswoman’s lubricating semen overflowing from your used hole makes the task way easier, but it’s still quite a feat. Using the prone dogmorph like a sex toy, you push yourself toward your second climax, clenching down on her cock like a vice.", parse);
				if(player.FirstCock())
					Text.Add(" Your own [cocks] throw[notS] out jets of pearly white cum, landing on your lover’s tits.", parse);
				if(player.FirstVag())
					Text.Add(" Your [vag] constricts, squirting your clear juices onto Miranda’s stomach. Though you’ve orgasmed twice, it’s still aching - almost painfully so at this point. You <i>need</i> to be filled!", parse);
				Text.NL();

				Sex.Anal(miranda, player);
				player.FuckAnal(player.Butt(), miranda.FirstCock(), 2);
				miranda.Fuck(miranda.FirstCock(), 2);

				player.OrgasmCum(3);

				Text.Add("<i>“Wow, fuck!”</i> Miranda exclaims, tracing a shaking finger down your side. <i>“G-gimme a minute, okay?”</i> You pout a bit, but settle down, waiting for her to recover. Once the dobie gets going again, you do your best to milk her of as much cum as you can, using every technique you know to expertly drain her balls dry. In the end, the experienced herm is unable to keep up with you, reduced to a whimpering heap.", parse);
				Text.NL();
				Text.Add("You aren’t entirely sure how much time has passed, but you’ve probably been at it for at least a few hours… but you need more, and as you feel her overworked member soften inside your ass, you come to the frustrating realization that perhaps she’ll be unable to give you what you crave. She looks like she’s on the verge of passing out.", parse);
				Text.NL();
				Text.Add("What do you do?", parse);
				Text.Flush();

				//[Toys][Shower][Reversal]
				var options = new Array();
				options.push({ nameStr : "Toys",
					func : function() {
						Text.Clear();
						Text.Add("You make a token effort to rouse the exhausted herm, but it looks like you’ve outlasted her. Growling in frustration, you let your gaze wander… to fall on Miranda’s rather impressive collection of toys. A slow smile spreads on your lips.", parse);
						Text.NL();
						Text.Add("You flop off her, releasing a cascade of cum from countless orgasms as her knot is forcibly dislodged from your aching hole. The dobie moans, stirring weakly, but resigns to just watching you while she recovers. Through a haze of feverish lust, you single out a large dildo with a flared base. The thing is at least the size of Miranda’s impressive member, a fat slab of artificial cock just begging to be inside you.", parse);
						Text.NL();
						Text.Add("Considering just how much cum the herm pumped into you, there is hardly any need for lube; you just sink down on the massive toy, shuddering as you are once again filled to the brim.", parse);
						if(player.FirstCock())
							Text.Add(" Your [cocks] jump[notS] as the thick rod squeezes your prostate, eager to blow [itsTheir] final load.", parse);
						if(player.FirstVag())
							Text.Add(" Why stop at one when there is so many to choose from, though? Your [vag] can no longer endure being left alone, and you shake as you grab onto another thick dildo, jamming it into your remaining orifice.", parse);
						Text.NL();
						parse["s"] = player.FirstVag() ? "s" : "";
						Text.Add("<i>“Wow… you are still going at it? You’re such a slut!”</i> Miranda exclaims, though from her tone, she meant it as a compliment rather than an insult. Flopping over on your side, you give her a show, thrusting the toy[s] into your hole[s] as rapidly as you can. Already, you feel your last, greatest climax building. You look up in a daze as the guardswoman crawls over to you, grabbing the base of the dildo firmly.", parse);
						Text.NL();
						parse["nasty"] = nasty ? ", suddenly acting uncharacteristically nice" : "";
						Text.Add("<i>“Here, let me… it’s the least I can do for you,”</i> she murmurs[nasty]. Even drained as she is, the herm can muster quite a bit of strength in her arms, and drills you even harder than you could yourself.", parse);
						if(player.FirstVag())
							Text.Add(" Biting your lip, you set to ramming your remaining toy into your [vag], pushing it as deep as it will go.", parse);
						Text.NL();
						Text.Add("In relatively short order, you are a moaning mess - more so than you were before. Miranda doesn’t let up though, not that you would want her to. In a final, feverish push, she throws you over the edge, lightning shooting down your spine as your entire body convulses.", parse);
						Text.NL();

						player.AddSexExp(3);

						player.OrgasmCum();

						Text.Add("The two of you collapse in a pile of your combined sexual fluids, too exhausted to even move.", parse);

						miranda.relation.IncreaseStat(75, 1);

						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Make use of some of her toys lying about in order to get off."
				});

				if(player.FirstCock()) {
					options.push({ nameStr : "Blowjob",
						func : function() {

							var p1Cock = player.BiggestCock();

							Text.Clear();
							Text.Add("Damnit, you are so close; why can’t she get you off? This is all her fault, getting you worked up like that and not following through on it… she deserves to get punished for this. ", parse);
							if(nasty || dom > 25)
								Text.Add("You bite your lip uncertainly. Do you dare? Finally, your lust overrides your reason, though you fear that this may have repercussions for you later.", parse);
							else
								Text.Add("This has been a nice, little game, but you need some action too, and the dommy dobie better just up and accept it.", parse);
							Text.NL();
							Text.Add("Wincing slightly as you dislodge Miranda’s knot from your rectum, you shift your body above her, a massive amount of cum gushing out from your gaping anus and splashing onto her furred stomach. Huffing, you present the herm with your [cocks].", parse);
							Text.NL();
							if(nasty) {
								Text.Add("<i>“You sly little bitch...”</i> Miranda grunts, averting her gaze when you grind your shaft[s] between her breasts. <i>“Fine,”</i> she mutters, grasping hold of [itThem]. <i>“I’ll get you off if it’ll get you out of my face, okay?”</i>", parse);
								Text.NL();
								Text.Add("...Huh. She sure agreed to that quickly enough.", parse);
							}
							else {
								Text.Add("<i>“Fuck… you are still hard,”</i> Miranda pouts. You detect a faint hint of… jealousy? Either way, it looks like she grasps the situation… and your cock[s].", parse);
							}
							Text.NL();
							Text.Add("A shiver runs down your body as Miranda’s tongue licks at the [cockTip] of[oneof] your dick[s], lapping up the cream from one of your myriad of previous orgasms. The guardswoman seems to have a little give in her, not just all take. Perhaps your performance convinced her to return the favor.", parse);
							Text.NL();

							Sex.Blowjob(miranda, player);
							miranda.FuckOral(miranda.Mouth(), player.FirstCock(), 2);
							player.Fuck(player.FirstCock(), 2);

							Text.Add("You sigh in pleasure as the dobie’s lips close around your cock, her tongue playing along its underside. Even though she’s usually all about being on top, this is clearly not the first dick she’s sucked, not by far. Getting your ass pounded by her for hours was pure bliss, and this blowjob is the perfect cherry on top. Even if you had the energy to do so, you wouldn’t for a second resist the surge of orgasmic heat rising in your loins.", parse);
							if(player.HasBalls())
								Text.Add(" Your [balls] are aching, but it feels like they are up for a final mission.", parse);
							Text.NL();

							var cum = player.OrgasmCum();

							parse["cum"] = cum < 3 ? "shooting" :
							               cum < 6 ? "pouring" : "gushing";
							Text.Add("Burying your [cock] deep inside Miranda’s muzzle, you let your seed spill forth, [cum] down the herm’s throat. She looks surprised at first, but she nonetheless dutifully gulps it down.", parse);
							if(player.NumCocks() > 1) {
								var allCocks = player.AllCocksCopy();
								for(var i = 0; i < allCocks.length; i++) {
									if(allCocks[i] == p1Cock) {
										allCocks.remove(i);
										break;
									}
								}

								parse["cocks2"] = function() { return player.MultiCockDesc(allCocks); };
								parse["s2"] = allCocks.length > 1 ? "s" : "";
								parse["notS2"] = allCocks.length > 1 ? "" : "s";
								parse["itsTheir2"] = allCocks.length > 1 ? "their" : "its";

								Text.Add(" Your other [cocks2] spurt[notS2] [itsTheir2] load[s2] all over her face and hair, painting her white as the inside of your bloated tummy.", parse);
							}
							Text.NL();
							Text.Add("Spent, you collapse beside her on the bed, the two of you cuddling together in a pool of your seminal fluids.", parse);

							miranda.relation.DecreaseStat(-75, 1);
							player.subDom.IncreaseStat(75, 1);

							PrintDefaultOptions();
						}, enabled : true,
						tooltip : "Take advantage of the situation and get a blowjob from Miranda. After all, she’s used you plenty - it’s only fair, right?"
					});
				}

				if(player.FirstCock() || player.Strapon()) {
					var cocksInAss = player.CocksThatFit(miranda.Butt(), false, 15);
					var p1Cock = player.BiggestCock(cocksInAss);

					parse["cock"] = function() { return p1Cock.Short(); }

					options.push({ nameStr : "Reversal",
						func : function() {
							Text.Clear();
							Text.Add("You moan desperately, but you’ve thoroughly wrung out the dobie; you probably shouldn’t be expecting more action from her for a few hours… unless you want to turn the tables on her. ", parse);
							if(nasty || dom > 25)
								Text.Add("This is probably a <i>really</i> bad idea, and no doubt she’ll get back at you tenfold later… but your lust overrules your common sense and kicks it out the door. Time to turn the tables, and damn the consequences!", parse);
							else
								Text.Add("She’s already had her fun… now it’s your turn. This is give and take, after all, and you plan to take.", parse);
							Text.NL();
							if(p1Cock.isStrapon)
								Text.Add("Sliding off Miranda’s softening cock, you reach down for your pack, retrieving your [cock]. The herm’s eyes slowly widen in dazed shock as you methodically strap it to your crotch, securing it tightly.", parse);
							else
								Text.Add("Sliding off Miranda’s softening cock, you make a great show of stroking your own [cocks], gazing down at her through eyes clouded with lust. If she doesn’t get what you’re planning to do, she’s sure to in just a moment.", parse);
							Text.NL();
							Text.Add("You coyly complain that it’s hardly fair for you to have all the fun… shouldn’t she get to have a good time too? ", parse);
							if(nasty)
								Text.Add("<i>“W-what? Why you little- ngh!”</i> she stutters, breaking off into a weak moan as you squeeze one of her tits. It doesn’t take much coaxing to convince her. Her eyes are drilling holes in the back of your head, but she’s not complaining anymore; in fact, she actually spreads her legs slightly. Let her keep up her theatrics, but you both know that she wants this as much as you do.", parse);
							else
								Text.Add("<i>“Fuck… taking advantage of me while I’m down, huh,”</i> Miranda huffs grumpily. <i>“Fiiine, if it’ll get you off my ass.”</i> Yes, you’ll get her ass off, you assure her. <i>“Uh...”</i>", parse);
							Text.NL();
							Text.Add("Not wishing to waste any more time, you place[oneof] your [cocks] at the panting herm’s back door. You’re going to pay her back in plenty for the last few hours… and claim your own reward. Using some of her own cum from her slick member, you lube yourself up and thrust forward. ", parse);
							if(player.NumCocks() > 1) {
								parse["anotheroneof"] = player.NumCocks() > 2 ? " another one of" : "";
								parse["other"] = player.NumCocks() > 2 ? "" : " other";
								parse["s"] = player.NumCocks() > 2 ? "s" : "";
								Text.Add("Fuck it, if you are going to defy her, might as well go all the way. Pausing briefly, you line up[anotheroneof] your[other] cock[s] with her pussy, double penetrating the dommy dobie.", parse);
								Sex.Vaginal(player, miranda);
								miranda.FuckVag(miranda.FirstVag(), player.FirstCock(), 2);
								player.Fuck(player.FirstCock(), 2);
							}
							else {
								Text.Add("You grab some of the toys scattered around and use them to tease the dommy dobie’s netherlips, finding that her hungry twat almost sucks them up. In short order, you have a thick dildo hilted in her gushing cunt.", parse);
								player.AddSexExp(2);
							}

							Sex.Anal(player, miranda);
							miranda.FuckAnal(miranda.Butt(), player.FirstCock(), 2);
							player.Fuck(player.FirstCock(), 2);

							Text.NL();
							if(dom > 25)
								Text.Add("<i>“You… cocky, fucking, bastard!”</i> she grunts in time with your thrusts. <i>“I’ll, get, you, back for this… if you don’t make me cum soon!”</i>", parse);
							else if(dom > -25)
								Text.Add("<i>“Mm… good, there’s still some fire left in you!”</i> she huffs, grinning at you. <i>“Just a bit more… ngh!”</i>", parse);
							else
								Text.Add("<i>“Yeah, give it to me, [masterMistress]!”</i> she moans unabashedly, gyrating her hips in order to meet your thrusts. <i>“Punish your little disobedient bitch!”</i>", parse);
							Text.NL();
							Text.Add("After a while, you filter out her voice and only listen to her body. In the language of rough sex, it’s screaming ‘fuck me!’ out loud, her hips grinding against yours and her legs wrapping tightly around your waist. You are only too happy to comply. With one final burst of energy, you push toward a mutual climax, rutting wildly into the guardswoman.", parse);
							Text.NL();

							miranda.OrgasmCum();
							var cum = player.OrgasmCum();

							Text.Add("It’s not long before Miranda ass clenches around your [cock], and your vision goes white. You’re seeing stars - and the massive load she just shot in your face probably contributed too. Another blast shoots past, barely missing you. From the force behind it, it probably hit the ceiling. ", parse);
							if(p1Cock.isStrapon)
								Text.Add("Just a second behind her, you cry out in unison as the base of your toy grinds back against you, triggering your own orgasm.", parse);
							else {
								parse["cum"] = cum > 6 ? "fountains" :
								               cum > 3 ? "gushes" : "shoots";
								parse["cum2"] = cum > 3 ? ", swelling her stomach to the point where she looks pregnant" : "";
								Text.Add("The herm milks your [cock] for all she’s worth, hungrily eating up your cum as it [cum] into her bowels[cum2].", parse);
							}
							Text.NL();
							Text.Add("Totally spent, the two of you collapse in each other’s arms.", parse);

							miranda.subDom.DecreaseStat(-75, 1);
							miranda.relation.IncreaseStat(75, 1);

							PrintDefaultOptions();
						}, enabled : p1Cock,
						tooltip : "Now is the perfect opportunity to get back at the dobie! Have a go at <i>her</i> ass for a while, and stuff a few toys in her pussy for good measure."
					});
				}
				Gui.SetButtonsFromList(options, false, null);
			}
		});
	}, "Rough", "Beg her to give it to you rough!");
}

// TODO
Scenes.Miranda.HomeDommyDungeonFirst = function() {

	var parse = {

	};

	party.location = world.loc.Rigard.Residential.mDungeon;

	Text.NL();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();

	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Rigard.Slums.gate);
	});
}

// TODO
Scenes.Miranda.HomeDommyDungeon = function() {

	var parse = {

	};

	party.location = world.loc.Rigard.Residential.mDungeon;

	Text.NL();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();

	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Rigard.Slums.gate);
	});
}

// TODO
Scenes.Miranda.HomeSubbyDungeon = function() {

	var parse = {

	};

	party.location = world.loc.Rigard.Residential.mDungeon;

	Text.NL();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();

	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Rigard.Slums.gate);
	});
}

// TODO
Scenes.Miranda.TavernSexPrompt = function() {
	var parse = {

	};

	//[name]
	var options = new Array();
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Miranda.TavernSexBackroomPrompt = function() {
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	var dom = player.SubDom() - miranda.SubDom();

	Text.Clear();
	if(miranda.Attitude() > Miranda.Attitude.Neutral) {
		if(dom > 25)
			Text.Add("<i>“Feel like using your favorite chew toy, huh? Let’s go then,”</i> Miranda says, getting up and shaking her butt teasingly at you as she walks toward the backrooms.", parse);
		else
			Text.Add("<i>“Sounds like a nice idea, come on,”</i> she says, patting your back and pushing you toward the backrooms. She grinds against you so you can feel her hardening shaft.", parse);
	}
	else
		Text.Add("<i>“Can’t get enough of little Miranda, can you? Not a problem, I can accommodate.”</i> Miranda promptly hauls you off your seat and takes you to the back rooms.", parse);
	Text.Add(" Selecting an empty room, Miranda leads you inside and steps away, allowing you to close the door. Since there's no lock, you make do and grab a nearby chair, barricading the doorway as an impromptu privacy measure.", parse);
	if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
		parse["m"] = dom > 50 ? player.mfTrue(", master", ", mistress") : "";
		Text.Add(" <i>“Well, here we are. What now[m]?”</i>", parse);
		Text.Flush();

		var cocksInVag = player.CocksThatFit(miranda.FirstVag(), false, 15);

		//[BlowHer][TakeHer]
		var options = new Array();
		options.push({ nameStr : "Blow her",
			func : function() {
				Text.Clear();
				if(dom > 0)
					Text.Add("With a smirk, you tell her to strip down; you feel like a little protein in your diet.", parse);
				else
					Text.Add("You cast a hungry look toward her loins, lewdly sticking out your tongue and curling it in invitation, body language more than enough to convey your intentions.", parse);
				parse["lg"] = player.HasLegs() ? "adopt a kneeling position there" : "lower yourself"
				Text.Add(" You move to remove your [armor], tossing it aside onto the table and then sauntering over to a cushioned corner of the room. As you [lg], perfectly placed to let the fun begin, you watch Miranda eagerly yanking off her own gear, scattering it nonchalantly over the room even as she strides forward to stand before you, erection bobbing up and down.", parse);
				Text.NL();

				Scenes.Miranda.TavernSexDommyBJ();
			}, enabled : true,
			tooltip : "Give Miranda a blowjob."
		});
		options.push({ nameStr : "Take her",
			func : function() {
				Text.Clear();
				Text.Add("With a hungry smile, you close the distance between the two of you and cup Miranda's chin, pulling her into a passionate kiss, feeding the eager morph your [tongue]. Pleasantly, your tongues wrestle for several moments as your arms pull the pair of you together, letting you feel her erection grinding against you.", parse);
				Text.NL();
				Text.Add("After whetting your appetite, you break the kiss and reach down to cup her tent, fondling her drooling doggy-dick through her pants and telling her that you want her out of her clothes; you can't properly appreciate that pretty rump of hers while she's all dressed up.", parse);
				Text.NL();

				Scenes.Miranda.TavernSexBackroomSubbyVag(cocksInVag);
			}, enabled : cocksInVag.length > 0,
			tooltip : "Fuck the herm."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	// TODO: Variations for dommy sex (other scenes)
	else { // nasty
		parse["l"] = player.HasLegs() ? " get on your knees" : " get down"
		Text.Add("<i>“Alright, slut. Strip and[l]. Little Miranda wants a kiss.”</i>", parse);
		Text.NL();
		if(player.SubDom() > 0)
			Text.Add("...Does she really need to keep calling you a slut? How much dick do you need to suck before she'll forgive you? Still, you'd be lying if you said the thought was unattractive...", parse);
		else
			Text.Add("As always, your mistress's harsh words and strong demeanor wash over you, filling you with a heady, intoxicating mixture of shame, lust, and desire. Stealing a glance at her bulging pants, swearing you can actually see her cock throbbing through the fabric, you lick your lips, unconsciously nodding in response.", parse);
		Text.NL();
		parse["ls"] = player.HasLegs() ? " kneel" : " rest"
		Text.Add("Without ceremony, moving quickly to keep Miranda in a good mood, you cast off your [armor] and[ls] upon a cushion over in the corner; you have a feeling you'll need it. In contrast to your haste, Miranda strips herself off with deceptive leisurely motions, her seeming indifference belied by the redness of her drooling cock as she stalks toward you.", parse);
		Text.NL();

		Scenes.Miranda.TavernSexDommyBJ();
	}
}

Scenes.Miranda.TavernSexBackroomSubbyVag = function(cocks) {
	var p1Cock = player.BiggestCock(cocks);
	var parse = {
		playername : player.name,
		
	};

	var knotted = p1Cock.knot != 0;

	var cum = Scenes.Miranda.TavernSexSubbyVag(cocks);
	var dom = player.SubDom() - miranda.SubDom();
	parse = player.ParserTags(parse);
	parse["masterMistress"] = player.mfTrue("master", "mistress");

	Text.NL();
	if(knotted) {
		Text.Add("When it’s finally over, you can’t help but crash down atop the dog-morph herm. She groans, both with the pleasure of release and with your weight", parse);
		if(cum > 3) {
			parse["cum"] = cum > 9 ? "pregnant-like belly" :
			               cum > 6 ? "rounded tummy" :
			               "paunch";
			Text.Add(", not to mention the [cum] you gave her", parse);
		}
		Text.Add(". The two of you pant in unison until Miranda finally breaks the silence.", parse);
		Text.NL();
		if(dom > 50) {
			Text.Add("<i>“Used and tied like a bitch,”</i> she groans. <i>“We should do that more often,”</i> she chuckles.", parse);
			if(cum > 3)
				Text.Add(" <i>“But damn, you really packed me full,”</i> she rubs her belly.", parse);
			Text.Add(" <i>“I guess no one is going to question my ownership after this one.”</i>", parse);
			Text.NL();
			parse["swollen"] = cum > 3 ? " swollen" : "";
			Text.Add("They most certainly aren't, you declare, and pat her[swollen] stomach possessively for emphasis.", parse);
			Text.NL();
			Text.Add("Miranda clenches around you, drawing a groan and a bit more of cum from you. <i>“Hey, I felt that. You’re not holding out on me, are you, [masterMistress]?”</i>", parse);
			Text.NL();
			Text.Add("Certainly not, you assure her, you gave her everything you could give her. That's just a little something that slipped your notice.", parse);
			Text.NL();
			Text.Add("The doberherm chuckles at your statement. <i>“That better be so because knot or no knot, you’re not going anywhere till your balls are drained dry.”</i> She clenches again for emphasis.", parse);
			Text.NL();
			Text.Add("Your whole body shudders in response. That's nothing less than what you'd expect of Miranda, you tell her.", parse);
		}
		else if(dom < -25) {
			Text.Add("<i>“Hmm, if anyone told me getting tied with a fat knot was good before, I’d have laughed them off, but I do say this feels great. You’re really stretching me up here, [playername].”</i>", parse);
			Text.NL();
			if(player.SubDom() > 0)
				Text.Add("Grinning to yourself at her statement, you give her thigh an affectionate pat and tell her that you always knew she'd like it if she gave it a chance.", parse);
			else
				Text.Add("Affectionately, you kiss the back of her neck and scratch the base of her ears, telling her how happy you are to make her feel good like this. It sure feels good to catch on occasion, now doesn't it?", parse);
			Text.NL();
			Text.Add("<i>“Hey, don’t get cocky now. I could always introduce <b>you</b> to <b>my</b> knot.”</i>", parse);
			Text.NL();
			Text.Add("She most certainly could do that... but not for a while, you note, shifting your hips to wriggle your swollen knot for emphasis, making her moan as the fleshy bulb tugs at her interior, but refuses to give even an inch.", parse);
			Text.NL();
			Text.Add("<i>“Lucky you,”</i> she comments with a grin.", parse);
		}
		else {
			Text.Add("Miranda sighs, <i>“I must say that I’m not used to being the one getting knotted.”</i>", parse);
			Text.NL();
			if(player.SubDom() > 0) {
				Text.Add("Well, a change is good for her, you quip. Besides, she's not really going to say she's not liking this, is she? Because you can feel the way she's clamping down, grinding your knot between her walls, and you know her body's just loving having this thick piece of meat stretching it out.", parse);
				Text.NL();
				parse["muffAss"] = player.FirstVag() ? "muff" : "ass";
				Text.Add("<i>“Fancy choice of words, [playername]. Don’t get used to this. Next time, it might as well as be my knot up your [muffAss].”</i>", parse);
			}
			else {
				Text.Add("You ask her if it's really all that bad to have you tied to her like this, to having you pinned inside of her and at her mercy until your own flesh lets you go.", parse);
				Text.NL();
				Text.Add("<i>“Bad? No, I don’t think it’s bad. But I’d prefer to be the one doing the tying.”</i>", parse);
			}
			Text.Add(" You tell her that you'll keep that in mind, then nestle yourself against her, making yourself comfortable for the duration.", parse);
		}
		Text.NL();
		Text.Add("It takes the better part of an hour before you’ve finally shrunken enough to pull out of Miranda’s used cunt. A small stream of seed following after your cock as you withdraw with a wet squelch.", parse);
		Text.NL();
		Text.Add("<i>“Shit, now I feel empty.”</i>", parse);
		Text.NL();
		Text.Add("Well, if ever she decides she'd like to feel full again, you're certainly available to fill her up, you reply.", parse);

		world.TimeStep({minute: 40});
	}
	else {
		Text.Add("Miranda sighs in pleasure as she lies down on the cushions below. <i>“You really know how to treat a lady, [playername],”</i> she grins.", parse);
		Text.NL();
		if(dom > 50) {
			Text.Add("<i>“Like a cheap sex toy,”</i> she adds.", parse);
			Text.NL();
			Text.Add("Just how she loves being treated, you quip back, playfully tussling her ears for emphasis.", parse);
			Text.NL();
			Text.Add("<i>“Only by you, [masterMistress],”</i> she quips back. <i>“You should come use me more often. It’s kinda hard to go back to using dildos after tasting your [cock].”</i>", parse);
			Text.NL();
			Text.Add("Your Miranda has gotten quite spoiled, hasn't she? Still, you tell her that you'll think about it...", parse);
		}
		else if(dom > -25) {
			Text.Add("<i>“My pussy’s gotten quite the workout; we should do this more.”</i>", parse);
			Text.NL();
			Text.Add("Well, you're certainly willing whenever she is, you reply.", parse);
		}
		else {
			Text.Add("<i>“Can’t say I’m used to not being in control, but it did feel nice. I wouldn’t be against a second round.”</i>", parse);
			Text.NL();
			Text.Add("Neither would you, you promptly respond.", parse);
		}
	}
	Text.NL();
	if     (party.Num() == 2) parse["comp"] = " gather your companion and";
	else if(party.Num() >  1) parse["comp"] = " gather your companions and";
	else                      parse["comp"] = "";
	Text.Add("Once the two of you are recovered from your recent exertions, you clean up the mess you made as best you can, then get back into your respective gear. Miranda casually unblocks the door and the two of you head back out into the bar. There, you[comp] say goodbye to the dober-morph before leaving her to resume her drinking.", parse);
	Text.Flush();

	world.TimeStep({hour: 1});

	Gui.NextPrompt();
}

Scenes.Miranda.TavernSexSubbyVag = function(cocks) {
	var p1Cock = player.BiggestCock(cocks);
	var allCocks = player.AllCocksCopy();
	for(var i = 0; i < allCocks.length; i++) {
		if(allCocks[i] == p1Cock) {
			allCocks.remove(i);
			break;
		}
	}

	var parse = {
		playername     : player.name,
		lordLady       : player.mfTrue("lord", "lady"),
		masterMistress : player.mfTrue("master", "mistress"),
		cocks2 : function() { return player.MultiCockDesc(allCocks); }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = miranda.ParserTags(parse, "m");
	var dom = player.SubDom() - miranda.SubDom();

	if(dom > 25) {
		miranda.relation.IncreaseStat(50, 1);
		miranda.subDom.DecreaseStat(-75, 2);
		player.subDom.IncreaseStat(75, 1);

		Text.Add("<i>“Pretty rump, huh? If that’s your wish, I’ll gladly show you my ‘pretty rump’.”</i> Slowly, she removes her leather pants. First, she lets you catch a glimpse of her [mcock], already rock hard from your earlier foreplay, but you don’t get to see much of it. Miranda rolls around, deliberately getting on all fours and raising her butt so you can see it being uncovered in all its glory. Her stubby tail wags as her leather pants fall to her knees, a pair of hands moving back to play with her butt cheeks. Her doggy snatch is already sopping wet, making her enjoyment crystal clear as she says, <i>“My pretty rump as requested, my [lordLady],”</i> she says with a chuckle, clearly enjoying herself.", parse);
		Text.NL();
		Text.Add("Now that's an invitation you wouldn't dream of not accepting. In a few brisk motions, you have covered the distance separating the pair of you, your hands reaching out to fondle her ass. Lecherously, you stroke the firmly toned, delightfully rounded cheeks, your own arousal growing with each motion. Playfully, you swipe at her buttocks with your palms, mock spanking her in order to feel the firmness under your [hand]s, and as well as eliciting a few moans from the dog-morph.", parse);
		Text.NL();
		Text.Add("With sincerity in your voice, you praise her for the hard work she must put into keeping her ass in such fine shape. Such efforts deserve a proper reward... once she's finished undressing, that is. Before she can make any movement to comply, though, you impatiently seize the leather pants hanging around her knees and pull down and out, all but sweeping her feet out from under her as you roughly rip the garment free. As soon as her legs are out of it, you toss it carelessly aside, your attention fixated on the shapely rump before you.", parse);
		Text.NL();
		Text.Add("Roughly, you pull her ass up against your crotch, letting her feel your [cock] as it rubs and grinds through the canyon of her buttock cleavage, your own hands already moving to her studded leather top. Impatiently, you tug at it, anxious to rid her off the unnecessary garment, and finally you manage to wrench it free and hurl it aside to join her leather pants. Still hotdogging her [mbutt], you hoist her back against your [breasts], letting her feel your body pressed against hers even as your [hand]s reach around her front and clutch at her tits. The large, rounded orbs squish most enticingly under your fingers, further spurring you to grope and squeeze. From the rumbling groan that vibrates against your chest, and the way Miranda's nipples pebble under your palms, she's enjoying your ministrations almost as much as you are.", parse);
		Text.NL();
		Text.Add("<i>“Ohm, that’s great but I’m hungry for something else, something meatier.”</i> She grinds back against you. <i>“You’re not thinking of making poor Miranda beg, are you?”</i> she playfully teases.", parse);
		Text.NL();
		parse["juicy"] = p1Cock.isStrapon ? "" : ", juicy";
		Text.Add("Well, now that she mentions it... Your fingers reach for her pleasure stiffened nipples, pinching them between forefinger and thumb and twisting them with purposeful motions, drawing a throaty moan from the dog-morph. With a smile on your lips, you lean closer to her doberman-like ears and croon into them, asking her who's a good little slut-puppy. Miranda wriggles against you, biting her lip and refusing to answer, but you don't let that stop you. Instead, you assure her in delight that she's a good slut-puppy before asking if the horny bitch wants herself a nice[juicy] [cock] treat.", parse);
		Text.NL();
		Text.Add("Whatever reservations she’s had about admitting her enjoyment of your teases disappears at the promise of a treat. She grinds back, panting as she declares, <i>“Oh yes! Miranda wants her treat! Please, please give me my treat, pleeeeease?”</i> she intones with a whine.", parse);
		Text.NL();
		Text.Add("Well, if she insists... Holding onto her breasts for support, you slide your hips back to line up your [cockTip] with her womanhood and then push forward. ", parse);
		if(miranda.sex.rVag == 0)
			Text.Add("The dober-morph's pussy is surprisingly tight, making you fight to make any headway inside of her, slowly wrapping her warm, wet folds around your [cock].", parse);
		else
			Text.Add("Miranda is as hot and as tight as ever, but you know how to squeeze your way inside of her.", parse);
	}
	else if(dom > -25) {
		miranda.relation.IncreaseStat(40, 1);
		miranda.subDom.DecreaseStat(-50, 1);
		player.subDom.IncreaseStat(50, 1);

		Text.Add("<i>“You have a point. Wouldn’t want to get anything on my armor,”</i> she grins. Without further ado, she sets about undressing herself. First, she discards her studded leather top, exposing her large mammaries for your viewing pleasure. You don’t have long to linger though as she kicks her leather pants off, showing off her rock hard [mcock]. When she catches you looking, she immediately remarks, <i>“See something you like?</i>", parse);
		Text.NL();
		Text.Add("You most certainly do, but today you have something else in mind. Without hesitating, your hand shoots out and latches onto the proudly bobbing doggy-dick jutting from her loins; not hard enough to hurt her, but hard enough that she won't try anything while you have hold of it. Ignoring Miranda's yelp of surprise, you concentrate on feeling the lust engorged flesh throbbing warmly under your fingers, and you use it like a makeshift handle. With a strong tug, you encourage her to spin around and present her back to you, whereupon you release her cock and push her over onto all fours.", parse);
		Text.NL();
		Text.Add("Before she can think to push back against you, you straddle her, nestling your [cock] right on her butt cleavage and draping yourself across her back, hands reaching around her front to grope and maul at her tits. You hold yourself there, playing with the doberherm's D-cups, grinding your [cock] through her ass cheeks with each thrust of your hips.", parse);
		Text.NL();
		Text.Add("<i>“Hey now, we never agreed on buttsex! Especially with me on the receiving end!”</i> she protests playfully.", parse);
		Text.NL();
		Text.Add("Well, isn't she lucky that you had something else in mind, then? Moving your hips back, you draw your [cockTip] down her ass crack, over her puckered ring and into alignment with her womanhood, then start pushing yourself into the hot, tight folds.", parse);
	}
	else {
		miranda.relation.IncreaseStat(40, 1);
		miranda.subDom.DecreaseStat(-30, 1);
		player.subDom.IncreaseStat(25, 1);

		Text.Add("<i>“You want it, come and get it,”</i> she says, crossing her arms.", parse);
		Text.NL();
		Text.Add("Now that's certainly not going to discourage you. Crossing the distance between you, you reach out and remove her armor. Fortunately, though she doesn't outright help you in doing so, Miranda certainly doesn't fight you either. In fact, as your fingers dart quickly over her bosom - stealing lustful caresses of her nipples, then glide down over her stomach to goose her ass - you can see her smirking in amusement at your antics.", parse);
		Text.NL();
		Text.Add("Once the dog-morph is naked, you move around behind her and give her a sharp push, toppling her over onto all fours with a surprised grunt. Quickly, you step in, hands moving down between her thighs and raising her rump up, positioning it so that it is jutting out toward you, perfect for a doggy style fucking.", parse);
		Text.NL();
		Text.Add("Miranda's evidently caught onto your plans because she shifts slightly for better support, tail wagging lazily as she does so even as she cranes her neck to look at you over her shoulder.", parse);
		Text.NL();
		Text.Add("<i>“You’re lucky I like you. I wouldn’t let anyone else push me around like that, so you’d better satisfy me or I’m going to have to pay you back,”</i> she says, wiggling her butt.", parse);
		Text.NL();
		Text.Add("That, you reply, certainly isn't going to be a problem. You know just how to give her what she's craving.", parse);
		if(player.SubDom() > 25)
			Text.Add(" With a smirk on your face, you give her ass a quick spank for emphasis.", parse);
		Text.Add(" Wasting no time, you move to bring your [cock] to bear, aligning it with her womanhood and thrusting forward. Hot, tight folds greet your [cock], making you work to push yourself inside as far as you can.", parse);
	}
	Text.NL();

	Sex.Vaginal(player, miranda);
	miranda.FuckVag(miranda.FirstVag(), player.FirstCock(), 3);
	player.Fuck(player.FirstCock(), 3);

	Text.Add("<i>“Yes! Oh yeah!”</i> she moans, tongue lolling out as you fill her with your [cock].", parse);
	if(player.NumCocks() > 1)
		Text.Add(" Your other [cocks2] poking and sliding against her full balls.", parse);
	else if(player.HasBalls())
		Text.Add(" Your [balls] smacking right into Miranda’s own, sending both of your sacks jiggling.", parse);
	Text.NL();
	Text.Add("You give her a moment to adjust to the feeling of your girth stretching her out, and then get down to the matter at hand. Resting your own weight atop her for support, you draw your hips back as far as you can, making your [cock] almost pop free of her cunt, and then slam it back home as far and as hard as you can, rocking her whole body with the impact.", parse);
	Text.NL();
	Text.Add("Your hands close around her tits, cupping and squeezing, pinching at her nipples even as your hips saw back and forth, plunging and thrusting as you fuck her as hard and as fast as you can. All Miranda can do is moan and bark in delight as you fuck her silly. Her tongue’s lolling out, drooling on the cushions below as you ram her unlike she’s ever been reamed. <i>“Yeah. Just like tha- Oh!”</i> she cries out as you hit her g-spot. <i>“Fuck! Right there! Don’t you dare stop, [playername]!”</i>", parse);
	Text.NL();
	Text.Add("You have no intention of stopping, and do your best to pick up the pace as you ream her cunt for all you're worth. Struck by a mischievous impulse, your [hand]s abandon her tits, sliding down her belly toward her jutting foot-long cock. Sure enough, it's drooling worse than her tongue is, and you soon find your palms filled with thick, musky Miranda pre-cum. As quickly as you can, you transfer your dripping hands back to her tits, massaging her own sex-juices into the fur as a makeshift lotion, your touch sliding nicely over the slickened bosom.", parse);
	Text.NL();
	var knotted = p1Cock.knot != 0;
	if(knotted && !p1Cock.isStrapon) {
		Text.Add("You can feel your [cock] pulsating in need, the wave of approaching climax building to its crescendo inside of you. Emphatically, you are aware of your knot bulging with blood, bloated and ready to plug a bitch's pussy as you fill her with your seed. The situation couldn't be more right. Acting on purest instinct, you jam your hips as hard against Miranda's as possible, gritting your teeth as you press the swelling bulb against her tight cunny in an effort to force the engorged flesh inside.", parse);
		Text.NL();
		Text.Add("A literal bark of surprise echoes up from beneath you, but you barely register it, your entire being consumed on your need to cram your knot inside Miranda. With a hiss of exertion, you finally heave your way inside, the sensation of her cunt clamping down like a vice on your bulbous flesh the last your crumbling will can stand. Throwing your head back, you cry out as the dam breaks and you flood her depths with your seed.", parse);
		Text.NL();
		Text.Add("The doberman underneath you howls in ecstasy, pussy clamping down hard on your [cock] as Miranda reaches her climax. ", parse);
		if(allCocks.length > 0 || player.HasBalls()) {
			parse["c"] = allCocks.length > 0 ? player.MultiCockDesc() : "";
			parse["and"] = (allCocks.length > 0 && player.HasBalls()) ? " and " : "";
			parse["b"] = player.HasBalls() ? player.BallsDesc() : "";
			Text.Add("You can feel her balls churning against your [c][and][b] as j", parse);
		}
		else
			Text.Add("J");
		Text.Add("et after jet of doggy-herm spunk splatters on the cushions below.", parse);
		Text.NL();
		Text.Add("Miranda's orgasm is something you barely notice, caught up in the throes of your own as you are. Sealed together by your knot as you are, your seed penetrates deeply inside her, flooding toward her very womb without mercy. ", parse);

		var mCum = miranda.OrgasmCum();
		var cum = player.OrgasmCum();

		if(cum > 6) {
			Text.Add("A veritable tidal wave of semen crashes upon Miranda's defenseless womb, her stomach inflating like a balloon as you just keep on pouring spunk inside of her. Down and down it grows until it brushes the floor, the herm so jammed full of your sperm that even your knot can't keep it all inside, rivulets of cock-cream leaking down her thighs wherever they manage to force their way out.", parse);
		}
		else if(cum > 3) {
			Text.Add("As your cum keeps on flowing and flowing, the doberherm's gut begins to balloon from the amount of jism gushing into her womb. Out and out she grows, until a nicely pregnant-looking belly sways beneath her with every motion she makes. Thanks to the tightness of your knot-induced seal, not a single drop leaks out, ensuring she is well and truly bred.", parse);
		}
		else {
			Text.Add("Miranda's stomach starts to swell slightly, visibly rounding out from the huge gush of sperm you packed away inside of her. But the two of you are too busy to care.", parse);
		}

		return cum;
	}
	else {
		Text.Add("As the dog-morph writhes and barks beneath you, your own excitement builds, a rising wave of anticipation and pleasure that you know will soon overwhelm you. Determined not to be the first to cum, you redouble your efforts, ramming away at watch-bitch's cunt as hard and as fast you can, grinding your [cock] against any spot that seems to elicit a particular reaction from her. Unconsciously, one of your hands leaves her tits and reaches down to grasp the hot, slick, pulsating warmth of her shaft. You pump away at it busily, assaulting both sets of organs at the same time, knowing she'll just have to climax first this way.", parse);
		Text.NL();
		if(dom > 25) {
			Text.Add("As you stroke and hump, you tell Miranda that she belongs to you; she might be top dog among the guards, but to you she's just your bitch. Now, she's going to be a good little doggie and cum for you, nice and messy.", parse);
			Text.NL();
			Text.Add("A growl of pleasure rumbles out of Miranda's throat, her back arching under you. <i>“Nnng... y-yes, yes, [masterMistress]!”</i> she barks gleefully in response.", parse);
		}
		else if(dom > -25) {
			Text.Add("And to think, she always goes on about being top dog. Well, it looks like there's a new top dog in town, you comment, even as you continue your ministrations.", parse);
			Text.NL();
			Text.Add("<i>“Don’t get cocky just because I’m letting you- Oooh! -do me.”</i>", parse);
			Text.NL();
			Text.Add("Just shut up and cum for me already, you retort, pinching the tip of her dripping dick between forefinger and thumb for emphasis, kneading the sensitive flesh with your digits.", parse);
		}
		else {
			Text.Add("As your fingers dance over her dick, you playfully plead with her to just let go already; you want her to cum, here and now, just for you. Won't she please cum for you?", parse);
			Text.NL();
			Text.Add("<i>“Nng… If you really want me to cum that bad, you’d best work those hips and your [hand]s.”</i>", parse);
			Text.NL();
			Text.Add("You need no further encouragement, doing your best to pump for all you're worth with hands and hips, fingers seeking out every sensitive spot on her cock that you can find.", parse);
		}
		Text.NL();
		parse["prosthetic"] = p1Cock.isStrapon ? " prosthetic" : "";
		Text.Add("Miranda howls in pleasure as her [mcock] throbs in your hand, a powerful jet of doggy-jism spraying the cushions below as her cunt clamps down on your[prosthetic] dick. Each jet that she blows feels like riding a wave, and you take advantage of her contracting pussy to really work her entrance.", parse);
		Text.NL();
		Text.Add("The sound of her yowling in ecstasy and of her semen spattering across the cushions below, the scent of sex in your nostrils, the feel of her writhing beneath you... it's too much for you to hold back anymore. Throwing your own head back, you cry out as your own climax washes through you.", parse);

		var mCum = miranda.OrgasmCum();

		var cum = p1Cock.isStrapon ? -1 : player.OrgasmCum();
		player.AddLustFraction(-1);

		if(!p1Cock.isStrapon) {
			Text.NL();
			parse["ballsCockDesc"] = player.HasBalls() ? player.BallsDesc() : p1Cock.Short();
			parse["mc"] = player.NumCocks() > 1 ? " and all over her balls and thighs" : "";
			Text.Add("You can feel the tingling in your [ballsCockDesc] as your load begins bubbling up from inside you. Your [cock] throbs before spraying your seed into her waiting entrance[mc]. ", parse);
			if(cum > 6)
				Text.Add("An eruption of spunk floods inside of Miranda's womb, packing her with a belly stretching load as you continue to cascade inside of her. Even as it squirts and sprays back out from the sheer pressure inside of her, most of it continues to surge inside of her, leaving her looking veritably pregnant with sperm. The floor beneath your joined hips is a mess with excess semen that has leaked from inside of her.", parse);
			else if(cum > 3)
				Text.Add("As your cum keeps on flowing and flowing, the doberherm's gut begins to balloon from the amount of jizz gushing into her womb. Much of it spills freely back out, running down your [thighs], but enough makes it inside to leave her with a nicely crammed potbelly.", parse);
			else
				Text.Add("Thick ropes of sperm slosh inside of her and squirt back out over your own dickflesh, drooling around the imperfect seal of your cock in her cunt and leaking wetly onto the cushions below you.", parse);
		}
		if(player.FirstVag()) {
			Text.NL();
			parse["c"] = p1Cock.isStrapon ? "the vibrations as she clenches your fake cock for all she's worth" : Text.Parse("the feel of her wringing your [cock]", parse);
			Text.Add("Your [vag] clenches in sympathy, the excitement overwhelming you. Though neither of you have touched it, the smell and sounds of Miranda's climax, combined with [c], is more than enough to set off your own feminine orgasm in turn. Ropes of female honey flood from your pussy, falling wetly down your [thighs] and staining your [legs] with your climax.", parse);
		}
		Text.Flush();

		return cum;
	}
}

Scenes.Miranda.TavernSexPublicBJ = function() {
	var parse = {
		playername : player.name,
		mastermistress : player.mfTrue("master", "mistress"),
		boyGirl : player.mfTrue("boy", "girl"),
		pheshe : player.mfTrue("he", "she"),
		phimher : player.mfTrue("him", "her")
	};
	parse = player.ParserTags(parse);
	var dom = player.SubDom() - miranda.SubDom();

	parse["kneel"] = player.HasLegs() ? "kneeling" : "positioning yourself"
	Text.Add("You duck in under the table, [kneel] between the guardswoman’s legs.", parse);
	Text.NL();

	var setPublic = false;

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“You know what to do, [playername],”</i> Miranda murmurs, sipping her mug while you unlace her britches, releasing the trapped beast. The meaty shaft smacks wetly against your forehead, depositing a splatter of pre on your upturned face. ", parse);
		if(dom < -25 || player.Slut() > 50)
			Text.Add("You lick your lips in anticipation. This is going to be quite a tasty treat.", parse);
		else
			Text.Add("The herm smiles innocently when you frown, tapping her finger against her thigh. Might as well get to it.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Mmm… you know just how to make a girl feel special,”</i> Miranda purrs. <i>“Who knows, perhaps I’ll return the favor later?”</i> The dobie is panting in anticipation as you undo her britches, pulling them down to reveal her aching cock.", parse);
		Text.NL();
		Text.Add("<i>“I… I don’t mind you being a bit rough,”</i> she murmurs.", parse);
	}, 1.0, function() { return miranda.SubDom() < -25; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Nice try, bitch, but it’s not going to be that easy,”</i> Miranda chuckles mockingly. Before you know it, she’s kicked the table out of the way, leaving you in quite a compromising position. It doesn’t seem like anyone have noticed you yet, though.", parse);
		Text.NL();
		Text.Add("<i>“I believe you were in the middle of something,”</i> the dommy herm purrs, leaning back and spreading her legs invitingly. ", parse);
		if(player.SubDom() < 25 || player.Slut() > 50)
			Text.Add("You have trouble hiding your eagerness as you undo her britches, revealing her tasty meatstick. You can’t wait to go down on her, regardless of if you gather an audience.", parse);
		else
			Text.Add("There is a glint of defiance in your eyes as you undo her britches, but you might as well go through with this now that you’ve started it. Miranda is bound to make trouble for you if you don’t.", parse);

		player.slut.IncreaseStat(50, 1);
		player.subDom.DecreaseStat(-50, 1);
		setPublic = true;
	}, 1.0, function() { return (miranda.Attitude() < Miranda.Attitude.Neutral) || miranda.SubDom() > 50; });

	scenes.Get();

	Text.NL();
	Text.Add("You give Miranda’s shaft a few tentative licks, enjoying the feeling of her member throbbing on your [tongue] before you wrap your lips around it. Almost immediately, your mouth is filled with her musky taste.", parse);
	Text.NL();

	Sex.Blowjob(player, miranda);
	player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
	miranda.Fuck(miranda.FirstCock(), 2);

	Text.Add("<i>“Mmm… good [boyGirl],”</i> she sighs, putting her leg over your shoulder. Pulling you in with her foot on your lower back, the dommy dobie locks you in place, leaving you no way to go but down on her shaft. She shifts her position slightly, pushing her hips forward, spearheaded by several inches of canine cock.", parse);
	Text.NL();
	Text.Add("It doesn’t seem like you’re going anywhere until Miranda has had her fill - or until she’s given you your fill, as it were. Either way, you resign yourself to giving her what she wants, which right now is your lips on her crotch. You start bobbing your head slowly, sucking on her member.", parse);
	Text.NL();
	Text.Add("<i>“Come on, [playername], you are going to bore me if you don’t get going soon,”</i> Miranda complains, tightening her leghold. At her urging, you increase your pace, the guardswoman’s pointed cockhead poking at the entrance of your throat each stroke. The dobie yawns theatrically, though you can sense through the minute movements of her body that she’s definitely feeling this.", parse);
	Text.NL();
	if(Math.random() < 0.5 && miranda.SubDom() > 25) {
		Text.Add("<i>“Hey, barkeep! Another drink over here!”</i> Miranda calls out across the room. She places one of her hands on the back of your head, keeping you firmly in place as she waits. ", parse);
		if(setPublic)
			Text.Add("You quickly realize your compromised position, but you can’t really do anything about it right now, so you continue sucking, trying to get the she-bitch off as quickly as you can.", parse);
		else
			Text.Add("You should still be relatively safe under the cover of the table as long as you manage to keep quiet - something you are not sure Miranda will let you get away with.", parse);
		parse["pub"] = setPublic ? "not that you think it will help much" : "though you wish that they had table cloths";
		Text.Add(" You suddenly appreciate the dim light in the tavern, [pub].", parse);
		Text.NL();
		Text.Add("Your heart is pounding loudly as you hear steps approaching, and a mug is placed on the table. Much to your aggravation, the barkeep stays to chat with the herm for a while. ", parse);
		if(setPublic)
			Text.Add("Neither of them acknowledge you, though you can almost feel them staring at you, stuck as you are more than halfway down Miranda’s cock. ", parse);
		else
			Text.Add("Even with the relative cover of the table, you are probably making enough lewd noises for the newcomer to suspect what’s going on. ", parse);
		if(player.Slut() > 50)
			Text.Add("Unconcerned with your audience, you dig in, deciding to give them a show.", parse);
		else
			Text.Add("Cheeks afire, you close your eyes and wait for the bartender to leave, imagining that they are unaware of you.", parse);
		Text.NL();
		Text.Add("Eventually, you are left alone again with the bitch.", parse);
		Text.NL();
		Text.Add("<i>“Ah, that hits the spot!”</i> Miranda sighs languidly. It’s not really clear if she’s referring to the drink.", parse);
		Text.NL();
	}
	else if(Math.random() < 0.5) {
		if(Math.random() < 0.5) {
			parse["HeShe"] = "He";
			parse["heshe"] = "he";
			parse["HisHer"] = "His";
			parse["hisher"] = "his";
			parse["himher"] = "him";
			parse["malefemale"] = "male";
		}
		else {
			parse["HeShe"] = "She";
			parse["heshe"] = "she";
			parse["HisHer"] = "Her";
			parse["hisher"] = "her";
			parse["himher"] = "her";
			parse["malefemale"] = "female";
		}

		Text.Add("You hear soft footsteps walking over to you, and a glance to the side tells you that one of the felines is approaching.", parse);
		Text.NL();
		Text.Add("<i>“Hey there, kitty,”</i> Miranda huffs, greeting them. <i>“Sorry, but I can’t give you any cream right now - little Miranda is occupied.”</i> ", parse);
		if(setPublic) {
			Text.Add("As if that wasn’t obvious enough. <i>“Perhaps [pheshe] wants to share?”</i> the cat asks hopefully, [hisher] voice identifying [himher] as the [malefemale].", parse);
			Text.NL();
			Text.Add("<i>“Nah, something tells me [playername] wants this load all to [phimher]self,”</i> Miranda replies, patting you on the head.", parse);
			Text.NL();
			Text.Add("<i>“Aww...”</i> [HeShe] pouts a little bit at being left out.", parse);
		}
		else
			Text.Add("A curious cat peeks down under the table, giving you a purr when [heshe] sees you.", parse);
		Text.NL();
		Text.Add("<i>“I’ll come back later, okay?”</i> The cat gives you a few glances over [hisher] shoulder as [heshe] returns to [hisher] own table.", parse);
		Text.NL();
	}
	Text.Add("After a while, the dobie decides to take a more active part, grabbing hold of your head and not-so-gently guiding it. Deeper and deeper she pushes, until your lips are straining around her thick - if still deflated - knot. Somehow, you manage to keep pace with her as she allows you the occasional chance to surface for air before forcing you back to the task at hand.", parse);
	Text.NL();
	if(party.Num() > 1) {
		var femcomp = [];
		if(party.InParty(kiakai)) femcomp.push(kiakai);
		if(party.InParty(terry))  femcomp.push(terry);
		if(party.InParty(roa))    femcomp.push(roa);
		if(party.InParty(gwendy)) femcomp.push(gwendy);
		if(party.InParty(momo))   femcomp.push(momo);

		parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
		Text.Add("Though she sounds like she’s getting a bit terse, Miranda keeps up a jovial conversation with [comp], acting as if nothing strange is going on. ", parse);
		if(femcomp.length > 0) {
			var comp = femcomp[Math.floor(Math.random() * femcomp.length)];
			parse["them"] = comp.name;
			parse["heshe"] = comp.heshe();
			parse["hisher"] = comp.hisher();
			parse["himher"] = comp.himher();
			Text.Add("She sounds like she’s making not-so-subtle innuendos to [them], asking if [heshe]’d be interested in giving it a try.", parse);
			Text.NL();
			if(comp == kiakai) {
				parse["name"] = kiakai.name;
				Text.Add("<i>“I… ah, I'm not sure if-”</i> [name] stammers, flustered. Miranda just laughs at the elf’s cute response.", parse);
			}
			else if(comp == terry) {
				parse["foxvixen"] = terry.mfPronoun("fox", "vixen");
				Text.Add("<i>“In your dreams, watchdog. I’d rather blow everyone on this bar rather than blow you!”</i> the [foxvixen] shoots back, perhaps a bit louder than [heshe] should…", parse);
				Text.NL();
				Text.Add("<i>“Oh ho! That sounds like an offer if I’ve heard any. Anyone up for some!?”</i> Miranda yells at the crowd. There’s more than a few guys, and even some females, that show interest.", parse);
				Text.NL();
				if(terry.Slut() >= 60)
					Text.Add("Smirking, Terry licks [hisher] lips. <i>“Sorry, boys and girls. I meant what I said, but I’m not allowed to disobey my [mastermistress],”</i> [heshe] points at the collar around [hisher] neck. <i>“As much as I’d love to service you to prove my point to this dirty dog,”</i> [heshe] points at Miranda, who scowls in response. <i>“Can’t do anything unless my boss says so. Sorry to disappoint, but I’m claimed.”</i>", parse);
				else
					Text.Add("<i>“I-I don’t… I...”</i> Terry tries to stammer out a reply, but ultimately falls silent as the approaching crowd surrounds [himher]. You can hear Miranda laughing above, and while you’d love to see Terry get out of this one, right now you have your <i>own</i> problem to deal with.", parse);
			}
			else if(comp == gwendy) {
				Text.Add("<i>“Not likely,”</i> Gwendy sniffs.", parse);
				if(gwendy.FirstCock())
					Text.Add(" <i>“Perhaps you’d like to try mine though?”</i> the horsecocked herm adds mockingly.", parse);
			}
			else if(comp == roa) {
				Text.Add("<i>“Can I?”</i> the slutty rabbit asks hopefully. <i>“Later,”</i> Miranda promises, licking her lips.", parse);
			}
			else {
				parse["Poss"] = comp.Possessive();
				Text.Add("[Poss] reply is lost in the din of the tavern. Besides, you have other things to worry about.", parse);
			}
		}
		Text.NL();
	}
	if(setPublic)
		Text.Add("Your table is starting to gather attention as more and more of the shady tavern goers are made aware of your little show. There are some snide comments and chuckles, but no one is quite brave or drunk enough to approach you with the dommy herm around.", parse);
	else
		Text.Add("The table provides only partial cover at best, and by the whispered remarks you hear, more than a few of the tavern’s patrons seem to have noticed you.", parse);
	Text.NL();
	Text.Add("By now, you have Miranda’s full attention as she completely abandons her cocky, indifferent facade. Panting like a bitch in heat, she pull your head up and down her shaft, roughly and repeatedly impaling you on the thick stick of meat. You can feel her throb deep down your throat, stretching you to your limits. As she nears her peak, the guardswoman eggs you on with mocking and suggestive comments, making no particular effort to keep her voice lowered.", parse);
	Text.NL();
	if(player.FirstCock()) {
		parse["isAre"] = player.NumCocks() > 1 ? "are" : "is";
		Text.Add("Your [cocks] [isAre] almost painfully hard, neglected and clamoring for attention.", parse);
		Text.NL();
	}
	if(player.FirstVag()) {
		Text.Add("A trickle of femjuice drips from your [vag], your puffy netherlips aroused by Miranda’s impressive member.", parse);
		Text.NL();
	}

	miranda.OrgasmCum();

	Text.Add("Miranda grunts loudly as she hilts herself in your throat, pouring her massive load down into your [belly]. Perhaps feeling merciful, the herm pulls out just as her knot starts to swell, saving you from being stuck on her cock. On the other hand, you gain a messy pearly necklace - more of a pearly ball gown, in truth - in exchange.", parse);
	Text.NL();
	Text.Add("Sated, the guardswoman pats you on the head, scratching you behind your [ears] while you clean her up.", parse);
	Text.NL();
	parse["lover"] = (miranda.Attitude() < Miranda.Attitude.Neutral) ? "bitch" : "lover";
	Text.Add("<i>“Not bad, [lover],”</i> she sighs, waving for another drink as you hurriedly clean yourself up.", parse);

	world.TimeStep({minute: 30});

	player.AddLustFraction(0.5);
	miranda.subDom.IncreaseStat(40, 1);
	player.subDom.DecreaseStat(-30, 1);
	miranda.relation.IncreaseStat(setPublic ? 70 : 40, 1);
	player.slut.IncreaseStat(25, 1);
}

Scenes.Miranda.TavernSexDommyBJ = function() {
	var parse = {
		playername : player.name,
		masterMistress : player.mfTrue("master", "mistress")
	};
	parse = player.ParserTags(parse);
	var dom = player.SubDom() - miranda.SubDom();

	if(miranda.Attitude() >= Miranda.Attitude.Neutral)
		Text.Add("<i>“Alright, [playername]. You know what to do, so open up,”</i> she says, brandishing her hardening prick and nestling it against your lips.", parse);
	else
		Text.Add("<i>“Okay, slut. Your best friend is ready for some action, so be a good bitch and roll that carpet out because I’m going in,”</i> Miranda says, slapping your face with her cock before forcefully shoving her pointed tip against your lips.", parse);
	Text.NL();
	Text.Add("You open your jaws to grant the dobie-dick access, extending your [tongue] and gently lapping at the underside of Miranda's dick as you envelop it in your maw. Closing your mouth around the intruder, the taste of salty-sweet pre-cum and flesh washing over your senses, you start to suckle, caressing her with your lips and tongue, bobbing your head slightly as you swallow further inches of girl-cock into your mouth.", parse);
	Text.NL();

	Sex.Blowjob(player, miranda);
	player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
	miranda.Fuck(miranda.FirstCock(), 2);

	if(player.SubDom() > 0) {
		parse["nasty"] = miranda.Attitude() < Miranda.Attitude.Neutral ? ", and your expectations of Miranda's wrath," : "";
		Text.Add("Despite any feelings of reluctance you have about this, your pride[nasty] demands you do your best. You take Miranda's foot-long as far into your mouth as you can bear, then pull your head back before sliding down again, washing the sensitive prickmeat with tongue and cheeks and lips as you go. You can't be called the most enthusiastic cock-sucker, but you do your best to be a good one, taking what respect you can in the grunts and growls of approval echoing down from above you.", parse);
	}
	else {
		parse["Y"] = miranda.Attitude() < Miranda.Attitude.Neutral ? "Regardless of her opinion of you, y" : "Y";
		Text.Add("Eagerly, you suck and swallow at Miranda's impressive piece of girl-dick, eyes closed in rapture as you savor the flavor of her washing over your tongue, her musk filling your nostrils. [Y]ou are determined to give her the best blowjob you can. Moaning in your aroused desire, you bob and lap and suckle for all you're worth, humming so as to better stir her dick with pleasure. You tease her by taking the first few inches of her shaft down your throat and then backing away, letting her crave the deepthroating you know she wants.", parse);
	}
	Text.NL();
	Text.Add("Suddenly, you feel a pair of paws grabbing the sides of your head. Darting your eyes up, you see Miranda bearing an evil grin. ", parse);
	parse["handsomeBeautiful"] = player.mfFem("handsome", "beautiful");
	if(miranda.Attitude() >= Miranda.Attitude.Neutral)
		Text.Add("<i>“Come on, [handsomeBeautiful], I know you can do better.”</i>", parse);
	else
		Text.Add("<i>“We both know you’re a cock hungry slut, so why not act the part and give me a proper blowjob.”</i>", parse);
	Text.NL();
	Text.Add("Before you can protest, the doberherm shoves all eleven inches of her knotted, canine pecker down your gullet. You can feel your eyes tearing up as your lips come into contact with her sheath. You can feel the heat emanating from her balls as they slap your chin, the scent of Miranda’s musk threatens to overwhelm your senses as your gag reflex makes you choke on her dick. For a moment, you feel like you might start suffocating, but Miranda soon withdraws. You inhale deeply, thankful for this momentary reprieve, but you don’t have long as Miranda’s hips lurch forward, impaling your throat back into her doggie-dong.", parse);
	Text.NL();
	Text.Add("<i>“Yeah, that’s how you do it,”</i> she comments, tongue lolling out as she becomes immersed in pleasure.", parse);
	Text.NL();
	var choices = 3;
	if(miranda.Attitude() < Miranda.Attitude.Neutral) {
		if(player.SubDom() > 0)
			Text.Add("Much as the rancor burns in your veins at the thought, you know that the consequences of trying to defy her just aren't worth the satisfaction you'd get at interrupting her ravaging of your throat. You'll just have to let her do what she wants… for now.", parse);
		else
			Text.Add("A potent cocktail of shame and lust burns down your gullet as the doberherm builds herself up to a proper facefucking assault on you, and your body grows warm with desire as you imagine her thick, strong girl-seed flooding down your throat and filling your stomach, marking you inside and out as hers. You wouldn't resist even if you could…", parse);

		choices = 1;
	}
	else {
		if(player.SubDom() > 25) {
			Text.Add("You bristle unthinkingly at her assumption that you're just going to meekly let her fuck your face like this. Lust-addled as she is, you could easily take control of the situation if you wanted, whether to make her give you some oral attention in turn, or get her off in some other way if she won't trust you to use your mouth.", parse);
			choices = 3;
		}
		else if(player.SubDom() > 0) {
			Text.Add("Looks like she's starting to get a bit too into this... maybe you should bring her back down to earth a little, it'd be easy to get her to start sixty-nining you if you wanted.", parse);
			choices = 2;
		}
		else {
			Text.Add("Your whole body quivers in excitement, anxious for this strong, virile she-stud bitch to claim you as her own. Your mouth waters, drooling avidly over her cock as you imagine her plunging it down your throat over and over again, fucking you like a living onahole... Spirits, why can't she get started for real already? You <b>want</b> this!", parse);
			choices = 1;
		}
	}
	Text.Flush();

	world.TimeStep({minute: 30});

	//[Take It][69][Footjob]
	var options = new Array();
	options.push({ nameStr : "Take it",
		func : function() {
			Text.Clear();

			miranda.relation.IncreaseStat(60, 1);
			miranda.subDom.IncreaseStat(50, 1);
			player.subDom.DecreaseStat(-60, 1);

			if(miranda.Attitude() >= Miranda.Attitude.Neutral)
				Text.Add("<i>“Damn, your mouth feels so good around my dick, [playername]. Better brace yourself because I’m going all the way with you,”</i> the doberman says, tightening her grip on your head and thrusting with renewed vigor. Little by little, she finds purchase, slipping her knotted doggie-dong inside your throat.", parse);
			else
				Text.Add("<i>“So, how do you like getting used like a fucktoy, slut? What is it? Not enough dick for you? Fine, I’ll make sure to shove all of my eleven inches down your tight cocksleeve,”</i> she teases, carelessly gripping your head and redoubling her efforts. Her cock rubs against the back of your throat, roughly bashing you until she finally slips inside your gullet.", parse);
			Text.NL();
			Text.Add("Helpless before the morph's onslaught, all you can do is try and relax yourself as she digs her dick deeper and deeper inside of you. Inch after inch of drooling prickflesh vanishes down your gullet, roughly grinding against your throat's inner walls, until her knot is bumping insistently against your lips.", parse);
			Text.NL();
			Text.Add("You hold there for a few moments, unsure of her intent, but the forceful butting of the fleshy bulb prompts you to stretch your mouth the extra inches it needs to let her knot go inside. Miranda intends for you to take it all, come hell or high water, and you know better than to resist her.", parse);
			Text.NL();
			Text.Add("The swollen flesh grinds back and forth over your tongue as Miranda humps at your face, stretching your jaws but thankfully quiescent for now and thus easy enough to handle once you've adjusted to the mass of it. Almost as if in response to your thoughts, though, you can feel her knot starting to grow inside your maw, pushing your [tongue] down and pinning it against the floor of your mouth. You are intimately aware of the back of the knot grinding against the interior of your lips with each thrust, but never popping free.", parse);
			Text.NL();
			if(miranda.sex.rBlow == 1)
				Text.Add("...Oh no. She wouldn't! She can't be serious! It looks like she's going to try and tie her dick to your mouth! Unconsciously, you try and pull your head back, but the doberherm's grip simply pushes you back more firmly down on her cock, grinding her shaft down your throat for emphasis. You're not going anywhere, it seems, and you have no choice but to try and relax your jaws as best you can for what you know is coming.", parse);
			else if(miranda.sex.rBlow <= 5)
				Text.Add("You have a sinking suspicion as to what she has in mind, and an experimental attempt to pull your head back from her bulb confirms it. She wants to knot your mouth again. Sighing softly as best you can through your filled mouth, you relax your jaws as best you can.", parse);
			else {
				Text.Add("What is this thing that she has with knotting herself to your mouth? ", parse);
				if(miranda.Attitude() >= Miranda.Attitude.Neutral)
					Text.Add("Does she love your cocksucking skills that much? ", parse);
				else
					Text.Add("Does she get off on having you forced to suck her even after she cums so badly? ", parse);
				Text.Add("Whatever the case, you're certainly practiced enough to know just how to relax your jaws, though you know you'll be feeling a little numb-mouthed by the time she's done.", parse);
			}
			Text.NL();
			Text.Add("By the time she releases your head, her knot is way too big to pull out, and you can do nothing but sit there as she drags your head with each powerful thrust of her hips. Her shaft throbs ominously inside your throat - you can tell she won’t last long like this. <i>“Hang in there, you’ll be getting your treat anytime,”</i> she says, stifling a grunt as she pats your head.", parse);
			Text.NL();
			Text.Add("A few moments later, she finally grabs you, shoving herself as deep inside your throat as she can. A loud groan of pleasure emanates from the doberherm as she floods your insides with her spunk. A ceaseless tsunami of white batters your stomach until it’s full and beyond.", parse);
			Text.NL();

			var cum = miranda.OrgasmCum();

			if(player.SubDom() > 0) {
				if(miranda.Attitude() >= Miranda.Attitude.Neutral)
					Text.Add("Your guts roil and churn as the steaming cascade of salty she-spunk pours down your gullet. You want to stop this, but with her knot it's impossible; all you can do is open your throat and let her fill your protesting stomach. As your belly bloats out, hanging down heavily under its titanic liquid load, you repeat mentally to yourself that this is for Miranda; you want to make her happy... but she had better appreciate you doing this for her.", parse);
				else
					Text.Add("Oh, you <b>hate</b> this bitch! Damnation, your stomach... you want to whimper as you feel yourself distending from the cascade of jism flooding your guts, the eerie sensations of being stretched so full sending strange, mixed signals to your brain. Your mind reels with the need for revenge, but there's nothing you can do except swallow spooge and stew in your frustration.", parse);
			}
			else {
				Text.Add("You do your best to moan in muffled ecstasy, eyes closing to fully savor the feeling of a tidal wave of hot girl-seed coursing into your stomach. You can feel Miranda's spooge burning all the way down, your belly bloating as she fires spurt after spurt of semen inside of you. Your hand moves unthinkingly to caress your [belly], brain afire with pleasure from the swelling and the touching. You feel so wonderful to be claimed like this, and you can't resist the mental chant for her to give you more, and more; you're her cumdumpster - you want her to fill you with everything she has! ", parse);
				if(miranda.Attitude() >= Miranda.Attitude.Neutral)
					Text.Add("By all the gods of this place, you love your strong, sexy, she-stud bitch!", parse);
				else
					Text.Add("Your love of what Miranda does for you and your mutual hate for each other war in your brain, the conflux of guilt and confusion and shame only stoking your pleasure to new heights.", parse);
			}
			Text.NL();
			Text.Add("It takes the better part of a hour for Mirana to shrink down enough to pull out of your used throat, and when she does you immediately cough and sputter, gobs of doggie-spunk flying from your mouth. You gasp, inhaling as much oxygen as you can, glad to finally be free from her and able to breathe easy again.", parse);
			Text.NL();
			if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
				Text.Add("Miranda pats your back, helping you as you finally have a chance to catch your breath. <i>“There, there. Easy now, [playername]. You’re a real trooper, ya know? If I tied anybody else, I’d probably wind up cracking their jaws,”</i> she laughs. <i>“Just hang in there, I’ll go grab you a cup of water,”</i> she says.", parse);
				Text.NL();
				Text.Add("That... that would be great, you absently reply to her. Gingerly, you settle yourself down, careful of your tender, cum-stretched stomach. Overwhelmed by what you've gone through, you allow your eyes to sink closed and lose yourself in torpor.", parse);
				Text.Flush();

				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("The sensations of something warm and soft on your lips stirs you from your slumber, the feel of something wet and firm pressing gently between your lips fully rousing you as it tickles your own tongue. Your eyes open and you find yourself staring into the half-hooded eyes of Miranda as the dober-morph kisses you sweetly. Pleasantly surprised, you lie back and bask in the sensation of her unusually tender actions, allowing her to break it a few moments later, licking your lips unconsciously to chase the last lingering taste of her as she straightens up.", parse);
					Text.NL();
					Text.Add("<i>“A kiss to wake up the sleeping beauty, just like in the fairy tales,”</i> she laughs. <i>“Here,”</i> she passes you a mug filled with a sweet-scented tea. <i>“Drink this, it’ll make you feel better.”</i>", parse);
					Text.NL();
					Text.Add("Thanking her for her thoughtfulness, you gingerly lift the rim of the cup to your lips and carefully sip it. It's as sweet as it smells, but not strong enough to be overpowering; it has a very calm and neutral sensation that brings with it a soothing feeling. As you slowly drink it, you feel your stomach settling slightly, and your rather raw gullet feeling less painful. You resist the urge to gulp it down and instead drain it smoothly; by the time you finish, your throat feels much better, and you thank her for her kindness, voice still a little raspy.", parse);

					PrintDefaultOptions();
				});
			}
			else {
				Text.Add("Miranda rolls her eyes as you try your best to catch your breath. <i>“Are you done yet? A slut like you should already be used to taking cock like that, so catch your breath and let’s get going.”</i>", parse);
				Text.NL();
				Text.Add("Queasy as you are, you simply nod your head absently. You really don't feel too good, overwhelmed by the recent fucking you received. Slowly, you sink onto your side, head pressed against the nearest pillow, and find yourself fading into darkness.", parse);
				Text.Flush();

				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Something cold and wet drenches across your face, bringing you back to consciousness with gasping splutters, shaking your head to clear off the worst of the water. You quickly realize the source of your rude awakening: a smirking Miranda staring down at you, one hand holding an upturned mug.", parse);
					Text.NL();
					Text.Add("<i>“Woken up yet? Good. Drink this,”</i> she passes you a mug filled with a sweet-scented tea. <i>“This will help with your throat.”</i>", parse);
					Text.NL();
					Text.Add("Hesitant, but trusting that she wouldn't lie about something like this, you reluctantly accept the proffered mug and carefully take a sip. Sure enough, the fluid soothes your aching throat as it glides down into your belly, and even quenches some of the upset from your impromptu repast. Emboldened, you steadily drain the cup and carefully place it aside, meekly issuing a non-committed thanks to the morph.", parse);

					PrintDefaultOptions();
				});
			}
			Gui.Callstack.push(function() {
				Text.Add("Though you still feel a little tired, thanks to your efforts and impromptu awakening, you know that you have no time to lie around any further. Noting that Miranda is already fully dressed in her uniform, you slowly pull yourself to upright and grab your [armor], struggling to get your newly bloated form dressed up again. It takes a little work, but soon enough you are ready to go as well.", parse);

				PrintDefaultOptions();
			});
		}, enabled : true,
		tooltip : "She’s having a good time and so are you. So let her fuck you and enjoy the ride."
	});
	if(choices >= 2) {
		options.push({ nameStr : "69",
			func : function() {
				Text.Clear();

				miranda.relation.IncreaseStat(50, 1);
				miranda.subDom.DecreaseStat(-25, 1);
				player.subDom.IncreaseStat(25, 1);

				Text.Add("You strike upward and outward with the backs of your hands, knocking Miranda's paws away from their grip on the sides of your head before pulling your head back and wetly popping your mouth free of her cock. The doberherm reels in surprise, and you take this opportunity to give her a hard shove in the hips, pushing her pointedly back with such force that she loses her balance and falls flat on her rear. Seizing your chance, you cross the distance between you and take her by the hips, firmly pushing the lust-addled morph over onto her back before draping yourself over her torso in an impromptu pinning hold.", parse);
				Text.NL();
				if(player.SubDom() > 50) {
					parse["l"] = player.HasLegs() ? ", wrapping her head in turn between your thighs" : ""
					Text.Add("You shuffle yourself around so that your head is pointing toward Miranda's straining erection, the canine cock an angry-looking red from her desire, and forcefully thrust your buttocks back toward the morph's face[l]. Bluntly, you inform her that if she has so much energy that she wants to facefuck you rather than being nice about it, then she had better start to return the favor if she wants you to keep sucking her off.", parse);
					Text.NL();
					Text.Add("To emphasize your point, you bend your head back down and slowly lick her cock from knot to glans, running your tongue up and down in slow, tantalizing strokes but never actually engulfing it again.", parse);
				}
				else {
					Text.Add("You can't resist coping a quick squeeze of Miranda's tits whilst you lie atop her, but do so in passing, already spinning yourself around on her stomach so that you are both pressed face to groin with each other, Miranda's girl-cock practically glowing against your face. Wriggling your hips enticingly in the doberherm's face, you coyly comment on how Miranda is so very full of energy. Perhaps, if she thinks you're doing such a good job, she can return the favor, hmm? She likes what you're doing down here, doesn't she?", parse);
					Text.NL();
					Text.Add("For emphasis, you place a soft, tender kiss right on the swollen bulge of her knot, then trace a trail of feather-light pecks up to her glans before licking your way back down. With lips and tongue, you tease her shaft, caressing the sensitive dickflesh but never deigning to start properly sucking it.", parse);
				}
				Text.NL();

				var Target = {
					Blowjob : 0,
					Cunn    : 1,
					Rim     : 2
				};
				var target;

				var scenes = new EncounterTable();
				if(player.FirstCock()) {
					scenes.AddEnc(function() {
						parse["sup"]   = miranda.SubDom() > 0 ? "Much to your surprise, " : "";
						parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
						parse["s"]     = player.NumCocks() > 1 ? "s" : "";
						Text.Add("[sup]Miranda doesn’t protest. Her hands move to your hips, adjusting your position until her nose touches your [cocks]. You can feel her hot breath caress you as she laps up a dollop of pre, then moves to engulf[oneof] your shaft[s]. ", parse);
						target = Target.Blowjob;
					}, 1.0, function() { return true; });
				}
				if(player.FirstVag()) {
					scenes.AddEnc(function() {
						Text.Add("Miranda moves to caress your [butt]. Slowly, she traces your behind until she arrives at your [vag]. With her thumbs, she spreads you open, shoving her snout inside you and inhaling deeply. She licks her lips and begins lapping at your labia. ", parse);
						target = Target.Cunn;
					}, 1.0, function() { return true; });
				}
				scenes.AddEnc(function() {
					Text.Add("Miranda grabs your butt cheeks, kneading them and spreading them open to reveal your [anus]. It’s not long before you feel wetness lapping at your crack, tongue massaging your sphincter in hopes of being granted entrance. ", parse);
					target = Target.Rim;
				}, 1.0, function() { return true; });

				scenes.Get();

				parse["dom"] = player.SubDom() > 50 ? " That's a good bitch, you absently quip back to her." : "";
				Text.Add("A moan of pleasure escapes your throat as you feel Miranda's mouth and tongue going to work.[dom] Emboldened, you turn your attention back to her own throbbing dog-cock and open your mouth, swallowing her girldick as deeply as you can and noisily sucking on it. The turgid flesh throbs between your lips, salt-sweet precum oozing steadily over your tongue and vanishing down your throat with each suckle you make. Painstakingly you lick every crease and fold and vein, pumping her shaft in and out between your lips, wriggling your hips back to grant Miranda better access to your own nethers as you do so.", parse);
				Text.NL();
				parse["gen"] = target == Target.Blowjob ? function() { return player.MultiCockDesc(); } :
				               target == Target.Cunn ? function() { return player.FirstVag().Short(); } :
				               function() { return player.Butt().AnalShort(); };
				Text.Add("Even despite your pleasure as Miranda plays with your [gen], you can see her knot starting to bloat, pleasure fattening it into a nice, big, juicy anchor of flesh. As it bulges into something like an apple-sized bulb of dickmeat, you can feel her cock throbbing in your mouth like mad, a veritable volcanic eruption of girl-semen building inside her apple-sized balls.", parse);
				Text.NL();
				Text.Add("Well, no sense in delaying it...", parse);
				Text.NL();
				Text.Add("Your hands creep around between her legs, one stroking and caressing her bloated testes, the other moving to take her dick by the base of her knot and squeeze it nice and tight. Unclenching your throat, you plunge your mouth down her shaft, sinking it inside of you until your lips are just brushing her knot... and then you clamp down firmly and suck as hard as you can, even as you pull your head back up her long, thin prick until only her pointy glans remains locked inside your still-sucking lips.", parse);
				Text.NL();
				Text.Add("Miranda’s moans are muffled as she diligently works on your [gen]. From your advantageous spot, you can see, and feel, every muscle in her body tensing. A thick spurt of pre heralds the oncoming eruption of doggie-cum that fills your mouth with nary but a single jet. You quickly move to swallow her thick load, just as she delivers another.", parse);
				Text.NL();

				var cum = miranda.OrgasmCum();  // the var 'cum' name is the same as the player (?)

				Text.Add("As the semen fountain masquerading as doberherm beneath you keeps on erupting into your maw, you diligently swallow each load, at least for a time. Having had enough, you relax your jaws and release her, allowing her cum to spray unabashedly over her thighs as you use your hand to continue milking her. Finally, her spurts grow weaker and weaker until she lets out a final groan and issues what you suspect is her final jet of this orgasm. Quickly, you move, mouth diving in to capture her last load and hold it inside your lips, letting the thick stickiness of it roll across your tongue.", parse);
				Text.NL();
				if(target == Target.Blowjob) {
					var cum = player.OrgasmCum();

					if     (cum > 6) parse["cum"] = "cascade";
					else if(cum > 3) parse["cum"] = "streamer";
					else             parse["cum"] = "spurt";
					Text.Add("Even through her own climax, Miranda keeps sucking your cock for all she's worth, her ecstatic moans rattling through the sensitive flesh and sending sparks of pleasure crackling beneath your skin. You feel the pressure building up inside of you even as her own thick cum stirs your senses and enflames your lust. The lewd slurping from behind you as she suckles finally pushes you over the end and you reward her efforts with your own [cum] of spooge.", parse);
				}
				else if(target == Target.Cunn) {
					parse["vc"] = player.FirstVag().clitCock ? "" : Text.Parse(", her fuzzy chin rubbing against your [clit] seemingly by accident", parse);
					Text.Add("Throughout her own climax, Miranda's tongue keeps slurping and squelching through your petals, lapping greedily for your feminine nectar[vc]. Your hips twitch and sway, but she simply won't relent in her assault, and inevitably your womanhood releases its juices right into the morph's hungry jaws.", parse);

					var cum = player.OrgasmCum(); // ? why?
				}
				else {
					Text.Add("Miranda lewdly slurps and laps at your back passage, making you shudder and wriggle even through her own climax. As her cock slides limply back into her sheath, she continues her assault, but evidently you've worn her out as her licks grow slower and slower until she stops entirely. As she lies back and pants, you're left glowing pleasantly in arousal.", parse);
					player.AddLustFraction(0.5);
				}
				Text.NL();
				if(dom > 25) {
					parse["masterMistress"] = player.mfTrue("master", "mistress");
					Text.Add("<i>“Ah...”</i> Miranda sighs in relief. <i>“Thank you, [masterMistress]. I really needed that.”</i> She licks her lips, still panting in exertion as she releases you and lies splayed on the floor.", parse);
					Text.NL();
					Text.Add("Leisurely, you shuffle yourself around atop her until you are face to face with the panting dobermorph. Smirking as best you can with your mouth full, you gently cup her chin and cheeks with your hands, subtly pinning her muzzle open before opening your lips. A cascade of thick herm-seed leisurely flows from your maw into Miranda's, the herm's eyes widening as it does so. You feed her every last drop that you saved earlier, and then swoop down to kiss her insistently.", parse);
					Text.NL();
					Text.Add("The subby doberherm has no choice but to swallow - not that she’d deny it in the first place - but forcing her own cum down her gullet while you kiss her feels pretty nice. You break the lip-lock just in time to hear her moan, a look of satisfaction plastered on her face. Miranda is a good girl, you remark patting her head as she pants.", parse);
				}
				else if(dom > -25) {
					Text.Add("<i>“Not bad, [playername],”</i> Miranda remarks, still panting after your little session. <i>“Doing and getting done feels kinda nice. I wouldn’t mind going for another round sometime,”</i> she grins. <i>“But first, I think I need to clean up after myself.”</i>", parse);
					Text.NL();
					Text.Add("You have only a moment to consider what she’s said before she grabs you and spins you around to give you a forceful kiss, forcing some of her cum down your throat. She does, however, manage to steal some straight from your mouth. The two of you continue to make out passionately for a few moments before she withdraws with a grin, licking her lips.", parse);
					Text.NL();
					Text.Add("Smiling, you quip that it looks like you weren't the only one who enjoys her special milk.", parse);
					Text.NL();
					Text.Add("<i>“Can’t overfeed you now, can I? Gotta keep you coming back for more.”</i>", parse);
					Text.NL();
					Text.Add("You grin and shake your head playfully. Somehow, you don't think that keeping you coming back is going to be too hard... though you have doubts as to whether she can resist overfeeding you.", parse);
				}
				else {
					parse["gen"] = target == Target.Blowjob ? "own" :
					               target == Target.Cunn ? "pussy" : "ass";
					Text.Add("<i>“Ain’t I the nicest gal a guy like you could hope for? I gave you cock and even took care of your [gen],”</i> she says, licking her lips.", parse);
					Text.NL();
					Text.Add("Twisting around so that you are sitting atop her, you look her in the eye.", parse);
					if(player.SubDom() > 50)
						Text.Add(" You cast her your sultriest look, rolling her last shot of dickcream around in your mouth, letting her see you saved some, then noisily gulp it down. Your [tongue] snakes out to lap daintily at the corner of your mouth.", parse);
					else
						Text.Add(" Eyes hooded in lust, you make a show of tilting your head to emphasize the lines of your neck, slowly swallowing the mouthful of Miranda's seed you retained with an audible sound. Moaning in desire, you lasciviously lick at your lips as if still searching for more of that taste.", parse);
					Text.Add(" She certainly is a nice girl, you quip back. Nice and tasty, too.", parse);
					Text.NL();
					parse["hair"] = player.HasHair() ? "ruffling your hair" : "rubbing your head";
					Text.Add("<i>“Why, you little flirt!”</i> she quips back, grabbing you into an arm lock and [hair].", parse);
				}
				Text.Flush();

				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("You hasten to pull on the rest of your [armor], the now-sated dobermorph having already clambered back into her own gear and now waiting for you by the door. Once dressed, you move to unbarricade the door and let her exit, following her as she goes.", parse);
					PrintDefaultOptions();
				});
			}, enabled : true,
			tooltip : Text.Parse("Since you’re fellating her, how about having her [ret] instead of facefucking you?", {ret: player.FirstCock() ? "return the favor" : "give you tongue"})
		});
	}
	if(choices >= 3) {
		options.push({ nameStr : "Footjob",
			func : function() {
				Text.Clear();

				miranda.relation.IncreaseStat(50, 1);
				miranda.subDom.DecreaseStat(-75, 2);
				player.subDom.IncreaseStat(75, 1);

				Text.Add("In one fell swoop, you knock Miranda's hands away and release her cock, then lunge forward in a powerful shove to the startled doberherm's hips. Already reeling from your initial surprise, she loses her balance and promptly falls flat on her rear with a startled grunt. As quickly as you can, you clamber to your feet and stride forward, pushing Miranda over completely onto the floor, then move to step onto her dick; not hard enough to hurt her, but definitely firmly enough that she can feel your weight as you press it against her belly,", parse);
				Text.NL();
				if(dom > 50)
					Text.Add("Miranda moans in lust, moving to grind herself against your [foot]. She doesn’t even bother protesting about your sudden switch in positions. She’s your bitch and she knows it, better yet, she loves it. <i>“Mmm, [masterMistress],”</i> she pants.", parse);
				else
					Text.Add("<i>“Hey! What the- urk!”</i> you silence her by massaging her doggie-dong with your [foot]. Can’t have your bitch talking back to you like that, can you? She glares at you at first, but a quick increase in pressure has her frown turned upside down as her cock throbs under your feet. Despite whatever reservations she might have, the doberherm is incapable of hiding her enjoyment.", parse);
				Text.NL();
				Text.Add("Imperiously staring down at your prey, you chide Miranda for getting carried away.  But then you shake your head and smirk, noting it's not as if she can really help it, is it? She's just such a horndog, isn't she? It seems she's always chasing after you, looking to get her belly rubbed - you leisurely stroke her throbbing shaft with your [foot] - or to bury a bone. She just loves it when you choose to share yourself with her; you're her favorite fuckbuddy, the only one who really gets her off, aren't you?", parse);
				Text.NL();
				if(dom > 50)
					Text.Add("<i>“Damn right I am. You made me your bitch, made me like being your bitch. And now this bitch needs her [masterMistress] to give it to her good. So do it, just the way I like it,”</i> Miranda readily admits.", parse);
				else
					Text.Add("<i>“Don’t get cocky, [playername],”</i> she warns, propping herself up on her elbows. <i>“Our positions could easily be reversed.”</i>", parse);
				Text.NL();
				Text.Add("You press down a little harder with your foot, making her groan at the sensation, then tell her not to say such stupid things - she's not getting out of this, and you both know it. Then, smiling, you lift your foot from her cock and place it higher up her midriff, pushing down so that she flattens herself onto the floor again. Just relax, you instruct her, even as you return your [foot] to its former place on her erection. You know what she likes, and you're going to give it to her...", parse);
				Text.NL();
				Text.Add("Grinning, you begin to stroke and caress the doberherm's dick with your [foot], gliding up and down along the soft, sensitive skin. You gently pinch it between your toes, flexing to squeeze it against her belly with just the right amount of pressure. Grinding up its length to her glans, you roll the tip of your foot against her pointy prick-tip, rubbing it up and down with each flex of your [foot].", parse);
				Text.NL();
				Text.Add("The morph growls throatily beneath you as you continue to toy with her cock. You look down and smile as you see her panting for breath, eyes screwed closed and tongue hanging out, whimpering softly as your stroking [foot] touches a sensitive spot. From the insistent grin her lips curl into, and the way you can feel her prickflesh throbbing beneath your foot, you know she can't hold out much longer.", parse);
				Text.NL();
				Text.Add("Faster and rougher you go, stroking and squeezing, caressing and gliding. You roll your foot back and forth from bulging knot to drooling tip and back again, stirring her seed-bloated balls with the tip of your toes before sliding back up her length again. Over and over you go until, at last, Miranda reaches her limits.", parse);
				Text.NL();
				Text.Add("With a throaty howl of pleasure, the morph's cock erupts in a geyser of seed, spraying thick spurts of off-white all over her belly and tits, caking your [foot] in a thick, dripping layer of girlspunk in the process. You shiver slightly as the warm, sticky fluid washes over your [skin], dabbling at her glans with the tip of your toes to let further spurts wash over you. Inevitably, though, even Miranda's balls expend themselves, and the sodden morph goes flaccid, panting as she lies in a great puddle of her own making.", parse);
				Text.NL();

				var cum = miranda.OrgasmCum();

				if(dom > 50) {
					Text.Add("<i>“Ah, this feels great,”</i> she remarks, hands moving to rub her breasts, plastered with her own jism. ", parse);
					if(miranda.flags["Footjob"] == 0) {
						Text.Add("<i>“Didn’t know feet could feel this good. You’re pretty creative when showing your dominance, aren’t you, [masterMistress]?”</i>", parse);
						Text.NL();
						Text.Add("You nod and agree, then playfully inform her that you aren't done yet. There's still one last thing she needs to do…", parse);
						Text.NL();
						Text.Add("<i>“Really? What is it?”</i> she asks, raising a brow.", parse);
						Text.NL();
						Text.Add("Rather than say anything, you gently reach out with your semen dripping [foot] and stroke it against her cheek, smearing a line of seed over onto her lips. Why, she needs to clean you off, of course, you tell her.", parse);
						Text.NL();
						Text.Add("<i>“Clean you?”</i>", parse);
						Text.NL();
						Text.Add("Yes, she heard you the first time, so she’d best open wide and start licking. You want your foot completely clean of her spunk.", parse);
						Text.NL();
						Text.Add("She shudders in renewed lust, licking her lips as a wide grin parts her muzzle. <i>“Alright, [masterMistress], I’ll try.”</i>", parse);
					}
					else {
						Text.Add("<i>“But we aren’t done yet, are we, [masterMistress]?”</i>", parse);
						Text.NL();
						Text.Add("With grin and a shake of your head, you reply that you most certainly aren't.", parse);
						Text.NL();
						Text.Add("<i>“Great, I love this part too,”</i> she licks her lips. <i>“Do it like you always do, I want to feel it,”</i> she says excitedly.", parse);
						Text.NL();
						Text.Add("Smirking, you gently caress your bitch's mouth with your cum dripping sole, painting a thick stripe of jism over her lips. As you do so, you tease her that here's her special treat; she made this mess, now she's going to be a good bitch and lick it all clean.", parse);
					}
				}
				else {
					Text.Add("<i>“Heh, not my kink, but this didn’t feel half-bad.”</i> Miranda slumps on the floor, relaxing in afterglow. ", parse);
					if(miranda.flags["Footjob"] == 0) {
						Text.Add("<i>“Just give me some time to recover and we can get going,”</i> she adds.", parse);
						Text.NL();
						Text.Add("You chide her not to be so impatient; there's still something she needs to do first. You move your semen dripping [foot] and place it just before her nose with an imperious gesture, declaring that neither of you are leaving until she cleans up the mess she made of your foot.", parse);
						Text.NL();
						Text.Add("<i>“What? You want me to lick it clean?”</i>", parse);
						Text.NL();
						Text.Add("You tell her that's correct, and so she had better get started.", parse);
					}
					else {
						Text.Add("<i>“Phew, I’m beat,”</i> she adds.", parse);
						Text.NL();
						Text.Add("Not so beat she's going to get out of cleaning up her mess, you inform her, raising your foot to her mouth for emphasis.", parse);
						Text.NL();
						Text.Add("Miranda sighs. <i>“You’re not going to let me get away with it, are you?”</i>", parse);
						Text.NL();
						Text.Add("You simply shake your head in response. You won't, and she knows it.", parse);
						Text.NL();
						Text.Add("<i>“Fiiiine, let’s get it over with.”</i> She rolls her eyes.", parse);
					}
				}
				Text.NL();
				parse["hesitantly"] = miranda.SubDom() > 50 ? " hesitantly" : "";
				parse["dom"] = miranda.SubDom() > 50 ? " despite her earlier protests" : "";
				Text.Add("Miranda[hesitantly] starts with a tentative lick on the tip of your toes, a process she repeats a few times before moving down to lick the rest of her jism. She starts on a more languid pace as if savoring the act to its fullest[dom]. Then she moves to suckle on each of your digits, using her tongue clean each one diligently.", parse);
				Text.NL();
				Text.Add("You patiently watch her as she laps you clean, turning and moving your [foot] to better allow her lapping tongue access to every inch. Finally, she has you cleaned up, and you lower your foot back to the floor, gently petting her on the head and quipping what a good dog she is.", parse);
				Text.Flush();

				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("You fix the last of your [armor] into place and straighten up, looking over to the equally dressed form of Miranda, waiting for you by the door. Pushing aside the pangs of desire that seeing her so obediently licking you clean after you got her off with just your foot inspired in you, you move to remove the chair barring the door so that the two of you can head back out into the tavern's main room.", parse);
					Text.Flush();
					player.AddLustFraction(0.5);
					PrintDefaultOptions();
				});
				miranda.flags["Footjob"]++;
			}, enabled : player.body.SoftFeet(),
			tooltip : "Miranda is getting out of hand. Teach the doberherm who runs this show and why."
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Miranda.TerryTavernSexDommyBJ = function() {
	var parse = {

	};

	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("As the two of you move through the Maiden's Bane, ready to start hunting for this mystery thief, you can't fail to notice the number of knowing smiles directed between patrons - both at you and the watchdog, and at each other. Coupled with the whispering and the occasional stifled laugh, it's pretty obvious they all know what happened whilst you and Miranda were in the backroom. You cast a sidelong glance at Miranda, but the dobermorph doesn't seem to care in the slightest, making no sign that she acknowledges the others.", parse);
		Text.Flush();

		PrintDefaultOptions();
	});

	Scenes.Miranda.TavernSexDommyBJ();
}

Scenes.Miranda.TerryTavernSexSubbyVag = function(cocks) {
	var p1Cock = player.BiggestCock(cocks);
	var parse = {
		playername : player.name
	};

	var knotted = p1Cock.knot != 0;

	var cum = Scenes.Miranda.TavernSexSubbyVag(cocks);
	var dom = player.SubDom() - miranda.SubDom();

	Text.NL();
	if(knotted) {
		Text.Add("When it’s finally over, you can’t help but crash down atop the dog-morph herm. She groans, both with the pleasure of release and with your weight", parse);
		if(cum > 3) {
			if     (cum > 9) parse["cum"] = "pregnant-like belly";
			else if(cum > 6) parse["cum"] = "rounded tummy";
			else             parse["cum"] = "paunch";
			Text.Add(", not to mention the [cum] you gave her", parse);
		}
		Text.Add(". The two of you pant in unison until Miranda finally breaks the silence.", parse);
		Text.NL();
		if(dom > 25) {
			Text.Add("<i>“Used and tied like a bitch,”</i> she groans. <i>“We should do that more often,”</i> she chuckles. ", parse);
			if(cum > 3)
				Text.Add("<i>“But damn, you really packed me full,”</i> she rubs her belly. ", parse);
			Text.Add("<i>“I guess no one is going to question my ownership after this one.”</i>", parse);
			Text.NL();
			parse["swollen"] = cum > 6 ? " swollen" : "";
			Text.Add("They most certainly aren't, you declare, and pat her[swollen] stomach possessively for emphasis.", parse);
		}
		else if(dom > -25) {
			Text.Add("<i>“Ugh, I’m fine with you using me, but did you have to tie me?”</i> she asks in protest.", parse);
			Text.NL();
			if(player.SubDom() > 0) {
				Text.Add("Like she wouldn't have done the same thing if your positions were swapped, you retort casually.", parse);
				Text.NL();
				Text.Add("<i>“I might, if we didn’t have a job to do. But what’s done is done, and it feels pretty good for me.”</i> She constricts you slightly with her pussy muscles. <i>“Don’t think I’ve been so deliciously spread in a while.”</i>", parse);
			}
			else {
				Text.Add("You apologize to her; she just felt so good, you couldn't help yourself - you had to tie with her.", parse);
				Text.NL();
				Text.Add("<i>“Couldn’t get enough of my pussy, huh? I know the feeling,”<i> she chuckles. <i>“We have a job to do, but it’s fine. Guess we can spare a few moments, especially since you did such a good job spreading my tight cunt over your huge knot.”</i>", parse);
			}
			Text.NL();
			Text.Add("Well, if she likes it so much, all she has to do is ask; you'd be happy to split her again anytime, you reply.", parse);
		}
		else {
			Text.Add("<i>“[playername], you dumbass! We’re supposed to be looking for a thief; how are we going to do that with you glued to my ass?”</i> she angrily protests.", parse);
			Text.NL();
			if(player.SubDom() > 0)
				Text.Add("You snap right back that you doubt she would have thought to do otherwise if she had been the one giving the dick instead.", parse);
			else
				Text.Add("Doubtful as you may be that she would have been anymore considerate if your positions had been reversed, you can't bring yourself to protest, instead meekly hanging your head and accepting her chastisement.", parse);
			Text.NL();
			if(cum > 3) {
				if     (cum > 9) parse["cum"] = "pregnant woman";
				else if(cum > 6) parse["cum"] = "blob";
				else             parse["cum"] = "fatty";
				Text.Add("<i>“As if that wasn’t enough, you packed me so full that I look like a [cum],”</i> she adds. ", parse);
			}
			Text.Add("<i>“Personally, if we didn’t have a job to do, I’d totally tie you. But as it stands, we’re stuck here and there’s no helping that,”</i> she huffs. <i>“It did feel pretty good though, so I’ll forgive you for thinking with your dick rather than your head this time, silly goose,”</i> she finishes with a smile.", parse);
			Text.NL();
			Text.Add("You can't help but smile back, and thank her for understanding. Besides, it's certainly not a bad thing, being tied to someone like her.", parse);
		}
		Text.NL();
		Text.Add("It takes a while before you’re finally able to pull out of Miranda’s well-used honeypot, and you’re somewhat loathe to do so, but you gotta get going. Cleaning up takes long, but you expected as much. The bigger the party, the bigger the aftermath you gotta clean up afterward.", parse);
		Text.NL();
		Text.Add("After scouting for a missing pants, you’re both fully dressed, if a bit sore. <i>“Let’s get going, [playername],”</i> Miranda announces with a pat on your back.", parse);
		Text.NL();
		Text.Add("You nod your head and agree, moving to dislodge the chair that served as your impromptu doorlock. Once it's safely out of the way, the pair of you head out from the bar... though it looks like your deeds weren't that private after all; you get more than a few chuckles and accusing fingers from the customers that you pass, and when you head past some guards, they throw both of you knowing grins.", parse);
	}
	else {
		Text.Add("Spent for the moment, you collapse atop the doberman-morph, sending both of you crashing down onto the cushions below. You can feel Miranda’s stubby tail tickling your belly as she pants. <i>“Phew, that was pretty good, [playername],”</i> she says.", parse);
		Text.NL();
		if(dom > 25)
			Text.Add("<i>“I love it when you rail me like I’m your bitch. I never thought being dommed could feel this good,”</i> she adds with a smile.", parse);
		else if(dom > -25)
			Text.Add("<i>“You know, I think I’m starting to like being fucked like that more and more. You do a pretty good job of getting me off when you’re doing me,”</i> she comments.", parse);
		else
			Text.Add("<i>“Keep getting me off like this and I won’t mind letting you into my pussy,”</i> she adds.", parse);
		Text.NL();
		Text.Add("You tell her that you're glad she enjoyed herself. The two of you lie there for a few moments more, catching your respective breaths, and then set about cleaning up the mess you made as best you can before getting back into your clothes.", parse);
		Text.NL();
		Text.Add("<i>“Alright then, let’s bust ourselves a thief,”</i> Miranda says, cracking her knuckles. <i>“You lead the way.”</i>", parse);
		Text.NL();
		Text.Add("Seeing no reason not to, you promptly pull aside the chair that the pair of you set up as an impromptu doorlock and slip outside. From the chorus of chuckles that echo in your respective wake, it's pretty clear that the clamor in the tavern wasn't enough to keep the two of you from going unnoticed.", parse);
	}

	Text.Flush();
	PrintDefaultOptions();
}
