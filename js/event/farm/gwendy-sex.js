
import { Scenes } from '../../event';

Scenes.Gwendy.ChallengeSex = function(skillcheck, lose) {
	var parse = {

	};

	// TODO: Proper loss condition
	if(lose || skillcheck < 20) {
		gwendy.flags["LostChallenge"]++;
		Text.Add("<i>“Seems like I'm the winner!”</i> Gwendy concludes as she counts the tally, eager to get to the action.", parse);
		Text.NL();

		if(gwendy.flags["LostChallenge"] < 3)
			Text.Add("She won this time... meaning you've got to pay up to her in whatever way she demands. Your thoughts are confirmed when she looks at you with a sly smile.", parse);
		else if(gwendy.flags["LostChallenge"] < 6)
			Text.Add("Despite your efforts, it seems like you can't beat the girl in her domain. A part of you wonders why you continue with these challenges if the result is always you losing and letting her degrade you. Still, you've got to try to best her somehow... after she reaps her reward from you, at least.", parse);
		else
			Text.Add("Face it, when she puts her mind to it, you can't win. At this point, you have to wonder if you actually accept your defeat and are just taking the challenges to get off. Who knows, maybe it's not so bad losing to the sexy girl? In any event, she gets to have her way with you again.", parse);
		Text.Flush();
		Gui.NextPrompt(function() {
			var options = new Array();
			var ret = Scenes.Gwendy.ChallengeSexLostPrompt(false, options);
			if(ret)
				Gui.SetButtonsFromList(options);
		});
	}
	else {
		gwendy.flags["WonChallenge"]++;
		Text.Add("Counting the tally, it seems you came out the victor this time!", parse);
		Text.NL();

		if(gwendy.flags["WonChallenge"] < 3)
			Text.Add("It looks like you've bested the farm girl, and she pouts a bit. Still, a bet was a bet, and she's going to have to pay up!", parse);
		else if(gwendy.flags["WonChallenge"] < 6)
			Text.Add("Seems like she's still going to challenge you, even though you've bested her so far! Her defiance has definitely increased her efforts whenever you challenge her, but the end result is the same: her waiting on your whim.", parse);
		else
			Text.Add("At this point, it's hard to call it a challenge. Despite that, Gwendy has definitely given it her all to best you, it's just that her best isn't good enough. A shame, but it means you're going to have some fun...", parse);
		Text.Flush();
		var options = new Array();
		Scenes.Gwendy.ChallengeSexWonPrompt(false, options);
		Gui.SetButtonsFromList(options);
	}
}

Scenes.Gwendy.ChallengeSexWonPrompt = function(hangout, options, disableSleep) {
	var parse = {
		playername : player.name
	};

	var wins = gwendy.flags["ChallengeWinScene"];
	if(hangout) wins--;

	options.push({ nameStr : "KissDom",
		func : function() {
			Text.Clear();
			// If first time
			if(wins == 0 && !hangout) {
				if(gwendy.flags["LostChallenge"] > 0)
					Text.Add("Since Gwendy went easy on you when you lost the first time, you decide to start things off light.", parse);
				else
					Text.Add("Since this <i>was</i> the first time the two of you actually had the challenge, you decide to start things off light.", parse);
				Text.NL();
				gwendy.subDom.DecreaseStat(-100, 5);
				player.subDom.IncreaseStat(100, 3);

				gwendy.flags["ChallengeWinScene"] = 1;
			}
			else
				Text.Add("You decide to let her off easy this time, and only ask for a kiss.", parse);
			Text.NL();
			Text.Add("Grabbing Gwendy's arm, you pull her close, a surprised expression on her face as you hold her. For a good minute, you just take in her beauty, from the freckles on her cheeks to the lively blue in her eyes. You begin forming an idea or two on what to do next time, should you challenge her again and win.", parse);
			Text.NL();
			Text.Add("The farmer fidgets, a bit uncomfortable under your scrutiny. Well, you can't have that, so you get on with it. You kiss her, your lips flush with her soft ones. There's a slight gasp of shock at the sudden action, but it is soon succeeded by a more submissive moan as you press against her, your body leaning on her slightly.", parse);
			Text.NL();

			if(hangout) {
				Text.Add("You break the kiss before you get too hot and carried away, though you note the flush of arousal on her cheeks. With a taunting grin, you tell Gwendy that's all for now, teasing her a bit.", parse);
				Text.NL();
				Text.Add("<i>“Getting me all worked up like that over nothing?”</i> The farmer huffs, liking what she got but clearly expecting more.", parse);
			}
			else {
				Text.Add("You break the kiss before you get too hot and carried away, though you note the flush of arousal on her cheeks. With a taunting grin, you tell Gwendy that's all for now. However, the next time you challenge her, you won't let her off so easily. She winces slightly, but has a small smile on her face.", parse);
				Text.NL();
				if(gwendy.flags["LostChallenge"] > 0)
					Text.Add("<i>“Don't think this one was anything but a fluke. I've beaten you before and I'll do it again!”</i> Even though her face is flushed, she is wearing a determined look. Next time might not be so easy.", parse);
				else
					Text.Add("<i>“That's fine, [playername],”</i> she retorts, <i>“since this time was just a fluke. Don't count on winning so easily next time!”</i> Good, you like it when the competition fights back. It makes winning just that much more fun.", parse);
			}

			player.AddLustFraction(0.1);
			world.TimeStep({minute: 5});
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Just a peck, please."
	});
	if(wins >= 1) {
		if(player.FirstCock()) {
			options.push({ nameStr : "Handjob",
				func : function() {
					Scenes.Gwendy.ChallengeSexHands(true, hangout);
				}, enabled : true,
				tooltip : "Have her jerk you off."
			});
		}
		if(player.FirstVag()) {
			options.push({ nameStr : "Frig",
				func : function() {
					Scenes.Gwendy.ChallengeSexHands(false, hangout);
				}, enabled : true,
				tooltip : "Have her pleasure your cunt with her hands."
			});
		}
	}
	if(wins >= 2) {
		if(player.FirstCock()) {
			options.push({ nameStr : "Titfuck",
				func : function() {
					Scenes.Gwendy.ChallengeSexBody(true, hangout, disableSleep);
				}, enabled : true,
				tooltip : "Those tits could be fun to play with."
			});
		}
		options.push({ nameStr : "Tease",
			func : function() {
				Scenes.Gwendy.ChallengeSexBody(false, hangout, disableSleep);
			}, enabled : true,
			tooltip : "Play a little with her body, teasing her."
		});
	}
	if(wins >= 3) {
		if(player.FirstCock()) {
			options.push({ nameStr : "Blowjob",
				func : function() {
					Scenes.Gwendy.ChallengeSexOral(true, hangout);
				}, enabled : true,
				tooltip : "Put her mouth to work sucking dick."
			});
		}
		if(player.FirstVag()) {
			options.push({ nameStr : "Cunnilingus",
				func : function() {
					Scenes.Gwendy.ChallengeSexOral(false, hangout);
				}, enabled : true,
				tooltip : "Let her have a taste of your cunt."
			});
		}
	}
	if(wins >= 4) {
		if(gwendy.FirstVag()) {
			if(player.FirstCock()) {
				options.push({ nameStr : "Fuck her",
					func : function() {
						Scenes.Gwendy.ChallengeSexVag(true, hangout);
					}, enabled : true,
					tooltip : "The girl is begging for it, oblige her and ravage her cunt."
				});
			}
			if(player.FirstVag()) {
				options.push({ nameStr : "Tribbing",
					func : function() {
						Scenes.Gwendy.ChallengeSexVag(false, hangout);
					}, enabled : true,
					tooltip : "Have a little girly fun with the sexy farmer."
				});
			}
		}
	}
	if(wins >= 5) {
		if(player.FirstCock()) {
			options.push({ nameStr : "Anal",
				func : function() {
					Scenes.Gwendy.ChallengeSexAnal(false, hangout);
				}, enabled : true,
				tooltip : "Plow her ass."
			});
		}
		if(gwendy.flags["Toys"] == 0) {
			options.push({ nameStr : "Toys",
				func : function() {
					Scenes.Gwendy.ChallengeSexAnal(true, hangout);
				}, enabled : true,
				tooltip : "Browse through Gwendy’s collection to see if something catches your eyes."
			});
		}
		else {
			options.push({ nameStr : "Strapon",
				func : function() {
					Scenes.Gwendy.ChallengeSexAnal(Gwendy.Toys.Strapon, hangout);
				}, enabled : false && !player.FirstCock(), // TODO ACTIVATE SCENE
				tooltip : "Fuck her with one of her horsecock strap-ons."
			});
			options.push({ nameStr : "R.Strapon",
				func : function() {
					Scenes.Gwendy.ChallengeSexAnal(Gwendy.Toys.RStrapon, hangout);
				}, enabled : false, // TODO ACTIVATE SCENE
				tooltip : "Have her wear a strap-on and fuck you."
			});
			options.push({ nameStr : "Beads",
				func : function() {
					Scenes.Gwendy.ChallengeSexAnal(Gwendy.Toys.Beads, hangout);
				}, enabled : true,
				tooltip : "Wonder how many beads her ass can take?"
			});
			options.push({ nameStr : "D.Dildo",
				func : function() {
					Scenes.Gwendy.ChallengeSexAnal(Gwendy.Toys.DDildo, hangout);
				}, enabled : player.AnalCap() >= Items.Toys.EquineDildo.cock.Thickness(),
				tooltip : "Bring out Gwendy’s double-ended horsedildo for some double anal fun."
			});
		}
	}
}

Scenes.Gwendy.ChallengeSexHands = function(cock, hangout) {
	var parse = {
		playername    : player.name
	};
	parse = player.ParserTags(parse);
	parse = gwendy.ParserTags(parse, "g");

	parse["genDesc"] = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
	                   player.FirstVag() ? function() { return player.FirstVag().Short(); } :
	                   "featureless crotch";
	Text.Clear();

	var first  = gwendy.flags["ChallengeWinScene"] == 1;
	var second = !first && !hangout;

	// If first time
	if(first) {
		Text.Add("Once again, you come out on top, and Gwendy looks rather annoyed at being beaten again. That won't do. She's the loser, so she has to follow your instruction. Smiling victoriously, you decide to go a bit farther this time.", parse);
		Text.NL();
		Text.Add("Pulling Gwendy by the arm, you lead her to her loft.", parse);
		if(player.Armor())
			Text.Add(" You remove your [armor], smiling excitedly, imagining what's to come.", parse);

		gwendy.subDom.DecreaseStat(-100, 5);
		player.subDom.IncreaseStat(100, 3);

		gwendy.flags["ChallengeWinScene"] = 2;
	}
	else if(second) {
		Text.Add("With another win under your belt, you lead Gwendy back to her loft. Once there, you instruct Gwendy to wait as you quickly strip down, eager to engage in another bout of fun.", parse);
	}
	else {
		Text.Add("Smiling teasingly, you ask her to wait while you strip. Once nude, you look lustfully at the beautiful girl waiting to fulfill your desires.", parse);
	}
	Text.NL();
	Text.Add("Pulling out a chair from the table, you sit down and wave her over. You tell her to get down on her knees, to get a better vantage point. The farmer looks a bit nervous, but follows your instructions, throwing furtive glances at your exposed [genDesc] while awaiting further orders.", parse);
	Text.NL();
	if(player.FirstCock() && player.FirstVag()) {
		Text.Add("As it stands, you possess both sets of sexes. Gwendy raises an eyebrow in question. <i>“You want me to pleasure <b>both</b> of them?”</i> You shake your head. Not this time.", parse);
		Text.NL();
	}

	if(cock) {
		parse["s"]     = player.NumCocks() > 1 ? "s" : "";
		parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
		Text.Add("Smirking, you thrust your groin toward her face. Gwendy stares at it for a moment, looking from your [cocks] to your eyes, then back at the rousing member[s]. Noticing the indecision on her face, you instruct Gwendy to pleasure you using just her hands.", parse);
		if(first)
			Text.Add(" She makes a small note of discomfort, but sets on fulfilling your desires.", parse);
		else
			Text.Add(" She nods, but you detect the faintest hint of disappointment. Perhaps she was looking forward to something else?", parse);
		Text.NL();
		Text.Add("Wrapping her fingers around[oneof] your [cocks], Gwendy starts to jerk it with languid strokes. Her soft hands run from the top to the bottom of your length a few times, coaxing your [cock] to full mast. A tingle of pleasure runs through you every time her digits flit across your glans, a drop of pre forming on the [cockTip] in response to her gentle touch.", parse);
		if(first)
			Text.Add(" Feeling the sticky fluid being rubbed into her fingers and down your [cock], she grimaces slightly, speeding up to get this over with.", parse);
		else
			Text.Add(" Feeling the sticky fluid being rubbed into her fingers and down your [cock], she grins, increasing her speed while watching your face closely.", parse);
		Text.NL();
		Text.Add("The sensation of her fingers gliding smoothly along your length is overwhelming, and you buck in pleasure. You begin to lose yourself to the feeling each time she strokes the glans of your [cock], trying to hold yourself back from release, but ", parse);
		if(player.HasBalls())
			Text.Add("your [balls] have something different in mind. They draw tight, the cum practically churning as if they are about to burst.", parse);
		else
			Text.Add("there is a familiar surge rising in your groin, despite your best efforts.", parse);
		Text.NL();
		Text.Add("Unable to take anymore, you cum hard, shooting your seed into the air and onto her face and her barely covered [gbreasts]. She gasps sharply, but she keeps her hands working until they've milked every ounce of your spunk, the sticky liquid running down her fingers.", parse);
		Text.NL();
		if(player.FirstVag()) {
			Text.Add("Your [vag] joins in on the fun, leaking of girly juices as you ride your climax out. It's times like these that you enjoy being a fully functioning member of both genders.", parse);
			Text.NL();
		}
		Text.Add("When you've calmed down somewhat, you look down, admiring your work.", parse);
		if(first)
			Text.Add(" She doesn't look too bad, on her knees before your crotch, covered with your seed. You might have to think of a few more ideas, but for now you've reaped your reward, and you have other things to do as well.", parse);
		else
			Text.Add(" Seeing her covered in your seed is always an rousing sight, but for now you have sated your lust.", parse);
		Text.Add(" Getting up, you kiss Gwendy on a clean spot on her forehead, telling her she did well and you look forward to more next time.", parse);
		Text.NL();
		if(hangout) {
			Text.Add("With an appreciative moan, Gwendy licks her fingers clean. The entire time she gazes into your eyes intently, looking forward to more. Shaking your head, you tease the lovely farm girl that this will be all, for now. She pouts sulkily, her sultry look replaced with mock anger.", parse);
			Text.NL();
			Text.Add("<i>“I dunno how I feel about that... but I guess I'll let it slide for now.”</i>", parse);
		}
		else
			Text.Add("Much to your surprise, Gwendy faces you with a sultry smile and begins to lick her digits clean, making sure to draw her tongue around her lips and fingers in as seductive a way as possible. It looks like she still has a bit of fire left, but that's how you like it. Doing this without a fight would make it too easy to properly enjoy, though you keep that to yourself as you head off.", parse);
	}
	else {
		parse["l"] = player.HasLegs() ? "Spreading your legs wide" : "Nudging your hips forward";
		Text.Add("Smiling, you reveal your [vag], as you're rather curious to see just how quick she is with her fingers. [l], you tell her to get you off using her digits.", parse);
		if(player.FirstCock()) {
			parse["b"] = player.HasBalls() ? Text.Parse(" and your [balls]", parse) : "";
			Text.Add(" You pull your [cocks][b] aside, revealing your eager slit.", parse);
		}
		if(!hangout)
			Text.Add(" She doesn't look too happy about that, but doesn't complain.", parse);
		Text.NL();
		Text.Add("Pressing against your folds, she experimentally pushes a finger into you, eliciting a soft moan. Hearing this, she works it inside you, either intent on pleasing you, or perhaps to end this as fast as possible. You coo in pleasure as moisture begins to drip from your lips.", parse);
		Text.NL();

		var num = Math.floor(player.FirstVag().Tightness() * 1.5);
		if(num < 2) num = 2;
		if(num > 5) num = 5;
		parse["fingernum"] = Text.Quantify(num);

		Text.Add("The pace is slow, but vastly enjoyable as Gwendy gets [fingernum] fingers into you, teasing and rubbing against your [clit] in the process. You find yourself grinding against her the entire time, almost threatening to take her knuckle-deep while you get wetter and wetter. Whenever she brushes or flicks your [clit], you arch your back and moan like a slut, which gets a smile from her every now and then.", parse);
		Text.NL();
		Text.Add("After several minutes of her expert touch, you reach your peak, and without any warning for the girl, you cum, splattering your girly juices all over her hand and arm.", parse);
		if(player.FirstCock()) {
			parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
			Text.Add(" At the same time, your [cocks] joins in the fun, splashing [itsTheir] share of fluids into the air and onto her upturned face.", parse);
		}
		Text.NL();

		var cum = player.OrgasmCum();
		player.AddSexExp(1);
		gwendy.AddSexExp(1);

		Text.Add("As your vaginal muscles clamp and squeeze, you feel Gwendy's fingers thrusting into you as you orgasm. The girl is very skilled for one who supposedly spent so much time alone... or perhaps that <i>is</i> the reason she is so skilled. The idle speculation flits through your mind quickly, as you are unable to focus your thoughts for long.", parse);
		Text.NL();
		if(!hangout) {
			Text.Add("When you recover, it seems like Gwendy's shirt has become saturated with your fluids. It looks good on her, like she has a nice coat of body oil on right now. In any event, there are other things you need to see to.", parse);
			Text.NL();
			Text.Add("After getting dressed, you kiss Gwendy on her forehead before heading off, but not without hinting about what you want to do the next time you beat her. She looks a bit defiant, but perhaps not as much as you expected.", parse);
		}
		else {
			Text.Add("As you slowly recover, Gwendy is glistening with your fluids.", parse);
			Text.NL();
			Text.Add("<i>“Look what you've gone and done now, [playername]. Are you always so messy when you fool around?”</i> You taunt her, saying it's her fault for getting you off like this. <i>“Well, we can go back and forth with this, y'know. Bottom line is, we both had some fun. Let's just leave it at that, alright?”</i>", parse);
			Text.NL();
			Text.Add("Nodding, you get up and dress before heading on your way.", parse);
		}
	}

	Text.Flush();

	world.TimeStep({minute: 20});
	player.AddLustFraction(-1);

	Gui.NextPrompt();
}


Scenes.Gwendy.ChallengeSexBody = function(titjob, hangout, disableSleep) {

	var parse = {
		playername     : player.name
	};
	parse = player.ParserTags(parse);
	parse = gwendy.ParserTags(parse, "g");

	parse["genDesc"] = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
	                   player.FirstVag() ? function() { return player.FirstVag().Short(); } :
	                   "featureless crotch";
	Text.Clear();

	var first  = gwendy.flags["ChallengeWinScene"] == 2;
	var second = !first && !hangout;

	// If first time
	if(first) {
		Text.Add("Yet again, it seems you've won the challenge, as clearly evidenced by the look of shock and dismay on Gwendy's face. It seems you're too much for her, yet she still insists on doing things this way. Whatever. If you can get a free fuck after work, then you don't mind taking her on if she wants.", parse);
		Text.NL();
		Text.Add("Still, you think it's a bit too early to get into the better parts of sex just yet as Gwendy still looks a bit hesitant. Given that this is a mutually agreed contest, you decide it'd be better to go slowly and work your way up. That being said, you have some plans.", parse);
		Text.NL();
		Text.Add("Once in the room, you pull a chair from the table, sitting in it after undressing. With a smile, you call Gwendy over, instructing her to kneel in front of you.", parse);

		gwendy.subDom.DecreaseStat(-100, 5);
		player.subDom.IncreaseStat(100, 3);

		gwendy.flags["ChallengeWinScene"] = 3;
	}
	else if(second) {
		Text.Add("Once more, you lead her to her room for some privacy after your win. You grab a chair from the table and direct Gwendy to kneel before it as you undress and sit down.", parse);
	}
	else {
		Text.Add("Quickly removing your [armor], Gwendy kneels before you, looking up expectantly.", parse);
		Text.NL();
		Text.Add("<i>“Let's see what you have in mind today, [playername]...”</i>", parse);
	}

	Text.NL();

	if(titjob) {
		parse["s"]        = player.NumCocks() > 1 ? "s" : "";
		parse["notS"]     = player.NumCocks() > 1 ? "" : "s";
		parse["oneof"]    = player.NumCocks() > 1 ? " one of" : "";
		parse["itThem"]   = player.NumCocks() > 1 ? "them" : "it";
		parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
		Text.Add("Your [cocks] poke[notS] out, swelling eagerly as you caress [itThem]. You tell Gwendy to use her breasts today, seeing as she's always putting them on display.", parse);
		if(!hangout)
			Text.Add(" An adamant look crosses her face, but she complies with your demand, abiding by the bet.", parse);
		Text.NL();
		Text.Add("The softness of her bountiful orbs completely engulfs you, combining pleasantly with her body heat. This looks like it's going to be a good time, but you'll need to keep yourself in check to prolong the experience for as long as possible.", parse);
		Text.NL();
		Text.Add("She begins to move, rubbing her breasts in alternate shakes while looking up at you. ", parse);
		if(hangout)
			Text.Add("The curvaceous farmer has an almost hungry look on her face, like as if she's looking forward to her imminent treat.", parse);
		else
			Text.Add("There's a twinge of shame in her eyes, being pushed so far because of her challenges, but you also catch a glimpse of something that looks like satisfaction.", parse);
		Text.Add(" Either way, you're too busy relishing the feeling of her boobs to really care. Her speed picks up, and soon you are leaking small beads of pre, which slowly drip into her generous cleavage.", parse);
		Text.NL();
		Text.Add("Propped up by her hands, her breasts slide around your [cocks] as she glides up and down [itsTheir] length[s] - without friction, thanks to your fluids. You are almost ready to go blow from the feeling alone, but you try to restrain yourself and last as long as you can.", parse);
		Text.NL();
		if(player.HasBalls())
			Text.Add("However, it seems your [balls] think otherwise, as they draw tight, ready to relinquish their load.", parse);
		else
			Text.Add("That all-too-familiar urge to cum grumbles from within your groin, and you know that holding on any longer is impossible.", parse);
		Text.NL();
		Text.Add("What seals the deal is Gwendy's hot breath on[oneof] your [cockTip][s] as her full lips hover uncertainly, as if she's considering swallowing you then and there. With a cry of lust, you cum, shooting your load straight into her face and hair. What doesn't land there drips down between her breasts and cleavage.", parse);
		if(player.FirstVag())
			Text.Add(" Though still untouched, your feminine half emits its own juices, soaking Gwendy from the chest down.", parse);
		Text.NL();

		var cum = player.OrgasmCum();
		player.AddSexExp(1);
		gwendy.AddSexExp(2);

		if(!hangout) {
			Text.Add("When you calm down, you see a somewhat miserable-looking Gwendy looking back at you. A chuckle escapes you while thinking of how much fun she's going to have cleaning herself today, but that isn't your main concern. Behind the misery, her fiery rebellion is still there, meaning the challenge is still on! This is great, as it means more incredible fucks in the future. And there are a few things you can think to make the next one even more memorable.", parse);
			Text.NL();
			Text.Add("With that thought, you get dressed and bid the girl farewell, thinking of what you're going to do next.", parse);
		}
		else {
			Text.Add("You smile and tease Gwendy about how slutty she looks. With a smirk, she replies by kissing[oneof] your cock[s], causing you to twitch as it hardens again.", parse);
			Text.NL();
			Text.Add("<i>“Aw, looks like someone is excited to go again. Maybe you should get yourself in control before chastising others.”</i> A grumble escapes your lips, but Gwendy gives you a kiss in response. <i>“Lighten up. I don't mind being a little slutty for you, just don't be rude about it.”</i>", parse);
			Text.NL();
			Text.Add("You mull over that as you get dressed, minding the erect reminder she left you.", parse);
		}

		Text.Flush();

		world.TimeStep({minute: 30});
		player.AddLustFraction(-1);

		Gui.NextPrompt();
	}
	else {
		parse["s"]        = gwendy.NumCocks() > 1 ? "s" : "";
		parse["notS"]     = gwendy.NumCocks() > 1 ? "" : "s";
		parse["oneof"]    = gwendy.NumCocks() > 1 ? " one of" : "";
		parse["itThem"]   = gwendy.NumCocks() > 1 ? "them" : "it";
		parse["itsTheir"] = gwendy.NumCocks() > 1 ? "their" : "its";

		Text.Add("Despite having stripped down, you tell her she's to do nothing to you. She looks at you with a surprised look, but you keep a straight face and tell her to strip herself. She complies and takes her clothes off in front of you, getting you excited. Her [gbreasts] spring free from their tight confines, bouncing slightly as gravity kicks in. Her form is slick, as a thin layer of sweat has built up over the course of today's work.", parse);
		if(gwendy.FirstCock())
			Text.Add(" Even her equine addition[s] stiffen[notS] slightly upon being exposed, earning you a sheepish smile from the girl. Well, that just gives you more to play with.", parse);
		Text.NL();
		Text.Add("Next, you tell her to take a seat in the chair as you stand up, circling her like a predatory animal.", parse);
		Text.NL();
		if(!hangout) {
			Text.Add("<i>“N-no funny ideas, alright?”</i> the farmer mutters, trying to cover herself with her hands.", parse);
			Text.NL();
		}
		Text.Add("Approaching Gwendy with a wistful look, you sit in her lap and deeply make out. You stay there for almost a minute, wrapping your tongue around hers, the both of you moaning softly. Before you lose control entirely, you break the lip-lock, both of you eager for more of each other. Remembering your goal, you resist the urge to indulge as you begin kissing her cheek, her neck, causing her to whimper cutely.", parse);
		Text.NL();
		if(first) {
			Text.Add("Looks like she's a tad more sensitive than you thought - not that you mind. You store this piece of information for later use.", parse);
			Text.NL();
		}
		Text.Add("Moving further down, you cup her plentiful breasts, hefting them in your hands as you give her nipples playful licks with the tip of your [tongue]. You continue to tease and caress her with both your hands and your mouth, arousing both yourself and her, carefully avoiding her genitalia.", parse);
		Text.NL();
		if(gwendy.FirstCock()) {
			parse["h"] = player.HasLegs() ? "thighs" : "hip and her stomach";
			Text.Add("Despite your meticulous care, Gwendy is already rock hard. Still, with how things are going, you decide to give her her male endowment[s] some attention. With deft movements, you manage to trap her equipment between your [h]. Gwendy jerks at bit while you squirm seductively, teasing her trapped pecker[s] mercilessly.", parse);
			Text.NL();
		}
		Text.Add("For now, you work on making her more receptive to your touch. Bringing her to the edge of orgasm is an ideal way to get her stimulated and wanting, and she's <i>definitely</i> wanting more. Kissing and teasing your way down her sexually-charged body, you finally reach her ", parse);
		if(gwendy.Gender() == Gender.female)
			Text.Add("moist and dripping cunt.", parse);
		else if(gwendy.Gender() == Gender.male)
			Text.Add("impossibly rigid [gcocks].", parse);
		else
			Text.Add("equally stimulated sexes.", parse);
		Text.NL();
		Text.Add("You smile, seeing that your touches and kisses has provoked the girl so much that she's almost begging for relief. Instead, you get off the horny girl, telling Gwendy to stand up and lean against the chair. She does so eagerly, the lust in her eyes shining desperately.", parse);
		Text.NL();
		parse["cock"] = gwendy.FirstCock() ? Text.Parse(" and stiff [gcocks]", parse) : "";
		parse["gen"]  = gwendy.FirstVag()  ? Text.Parse("dripping cunny[cock]", parse) : Text.Parse("stiff [gcocks]", parse);
		Text.Add("While she awaits your next command, you take the time to appreciate the sexy farm girl. Her behind is like two perfectly rounded globes, slick with sweat. Beneath them, you can see her [gen], eager for action.", parse);
		Text.NL();
		if(player.FirstCock()) {
			parse["notEs"]     = player.NumCocks() > 1 ? "" : "es";
			Text.Add("Your [cocks] twitch[notEs], ready to plunge into her depths. This really might get out of hand if you let it go on for too long...", parse);
			Text.NL();
		}
		Text.Add("Sauntering up to her and caressing her exposed back, your fingers trace down her spine to the crevice of her [gbutt], your digits trailing down its middle. She lets out a small moan and pushes back against you like a slut, desperate for your touch. You are happy to sate this small request of hers. ", parse);

		if(gwendy.FirstCock() && gwendy.FirstVag()) {
			if(gwendy.HasBalls())
				Text.Add("Lifting up her ample testicles gently, your index and middle fingers slide into the dripping box beneath it. Not to exclude her male additions, you roll and massage her balls in your palm as you frig her.", parse);
			else
				Text.Add("With some degree of dexterity, you grab[oneof] her meaty cock[s], stroking it gently while two of your fingers work her wet cunny.", parse);
		}
		else if(gwendy.FirstVag())
			Text.Add("Glad to please her, you push your index finger into her tight ass while your middle and ring fingers penetrate her juicy cunt.", parse);
		else if(gwendy.FirstCock())
			Text.Add("You slowly push two fingers into her taut rear, pressing mercilessly against her prostate.", parse);

		Text.NL();
		Text.Add("The curvy farmer tries to stifle a moan, but with a sharp slap on her butt from your free hand, she lets it out, her hips moving of their own accord as your fingers thrust within her. Just as you wanted it: Gwendy, aroused beyond words or thoughts, and you in control.", parse);
		Text.NL();
		Text.Add("But keeping to your internal promise, you only do this to tease her. After a few moments, you stop moving your fingers, but leave them in and settle on lightly spanking Gwendy. Based on the clenching felt around your digits, she's getting a bit too close to orgasm so you withdraw your hand altogether.", parse);
		Text.NL();

		world.TimeStep({minute: 30});
		player.AddLustFraction(0.5);

		if(!hangout) {
			Text.Add("As her body recovers from nearly orgasming, you tease her while she gets dressed, saying she's even more of a slut than you figured. She starts to voice a complaint, but you remind her of the pants and moans she made while you kissed and touched her, saying only a whore could get off to that. Before she can say anything in her defense you leave, glad her fiery attitude is still alive. A challenge is what you live for, right?", parse);
			Text.Flush();
			Gui.NextPrompt();
		}
		else {
			Text.Add("Despite subduing your desire to mount her, the both of you are moderately aroused in the end. Gwendy, her face flush red, leans her head against your [thigh]. She pants lustily, too stimulated to talk right now. A little tired yourself, you wrap your arms around her, cuddling together.", parse);
			Text.Flush();

			// TODO: Conditional?

			//[Cuddle][Sex]
			var options = new Array();
			options.push({ nameStr : "Cuddle",
				func : function() {
					Text.Clear();
					Text.Add("After cuddling together for a while, you part ways with her, though not before Gwendy gets one last kiss in.", parse);
					Text.NL();
					Text.Add("<i>“That was more fun than last time, [playername]. I wouldn't mind doing this again sometime...”</i> You smile boldly as you leave, glad that both of you were able to enjoy this little stint.", parse);
					Text.Flush();

					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "Just cuddle for now, take some time to calm down."
			});
			// #if horny enough and sex is unlocked? Else default to cuddle
			options.push({ nameStr : "Sex",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Say... are you really just going to leave it like that?”</i> she manages to pant, grinding back against your body. <i>“Come on... I need it...”</i>", parse);
					Text.Flush();

					Scenes.Gwendy.LoftSexPrompt(false, disableSleep);
				}, enabled : true,
				tooltip : "She is ready and more than willing."
			});
			Gui.SetButtonsFromList(options);
		}
	}
}

Scenes.Gwendy.ChallengeSexOral = function(blow, hangout) {

	var parse = {
		playername     : player.name
	};
	parse = player.ParserTags(parse);
	parse = gwendy.ParserTags(parse, "g");

	parse["genDesc"] = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
	                   player.FirstVag() ? function() { return player.FirstVag().Short(); } :
	                   "featureless crotch";
	Text.Clear();

	var first  = gwendy.flags["ChallengeWinScene"] == 3;
	var second = !first && !hangout;

	parse["s"]        = player.NumCocks() > 1 ? "s" : "";
	parse["notS"]     = player.NumCocks() > 1 ? "" : "s";
	parse["oneof"]    = player.NumCocks() > 1 ? " one of" : "";
	parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";

	// If first time
	if(first) {

		if(gwendy.flags["LostChallenge"] == 0)
			Text.Add("Was there any doubt you were going to win? So far, it's just been win after win, though you must admit she at least mounted quite an effort. Still, you won, and now you're going to reap your reward!", parse);
		else
			Text.Add("You were quite confident that you were going to win. She's struggled well against you, and even put up a bit of a challenge, but this time you came out on top. And of course, that means it's time for your reward!", parse);
		Text.NL();
		Text.Add("Why else would you do this? In an almost ritualistic fashion, you lead the way to her room, eager to begin. Yet again, you pull up a chair after undressing. Smiling smugly, you decide to sate yourself with her mouth.", parse);

		gwendy.subDom.DecreaseStat(-100, 5);
		player.subDom.IncreaseStat(100, 3);

		gwendy.flags["ChallengeWinScene"] = 4;
	}
	else if(second) {
		Text.Add("Heading back to the room where you've claimed all your “rewards”, you pull up the chair again after undressing, while Gwendy gets on her knees awaiting your instructions.", parse);
	}
	else {
		Text.Add("Stripping down once more, Gwendy kneels before you, smiling sweetly as you settle down in a chair. Seems she's as ready for this as you are...", parse);
	}
	Text.NL();

	if(blow) {
		if(first) {
			Text.Add("Up till now, you've been fairly tame in these sessions, but this time you feel a real craving for sex. Four wins, and no penetration... that's going to end today. Even Gwendy's look conveys that your “rewards” haven't been anything big.", parse);
			Text.NL();
		}
		Text.Add("Confidently, you tell Gwendy to suck your [cock].", parse);
		Text.NL();
		Text.Add("She sets about her duty without a word of complaint, grabbing[oneof] your cock[s] and giving it a few strokes, before experimentally lapping at the tip. You sigh with pleasure as she begins to kiss and lick you, all with a dismissive cute look in her eyes.", parse);
		Text.NL();

		Sex.Blowjob(gwendy, player);
		gwendy.FuckOral(gwendy.Mouth(), player.FirstCock(), 2);
		player.Fuck(player.FirstCock(), 2);

		Text.Add("Those pecks and licks, however, are quickly replaced with the warmth of her mouth engulfing you. ", parse);
		if(first)
			Text.Add("It takes you by surprise just how good she is at giving head,", parse);
		else
			Text.Add("The farmer is as good at giving head as ever,", parse);
		Text.Add(" as it takes her no time to start bobbing along your length, all the while working her tongue in a way that you think few could manage.", parse);
		Text.NL();
		if(player.HasBalls()) {
			Text.Add("She massages your [balls] and kisses them from time to time, alternating between your dick and your balls in an effort to arouse you as much as possible.", parse);
			Text.NL();
		}
		if(player.NumCocks() > 1) {
			parse["s"]        = player.NumCocks() > 2 ? "s" : "";
			parse["itThem"]   = player.NumCocks() > 2 ? "them" : "it";
			Text.Add("While Gwendy focuses most of her attention on your main [cock], she occasionally strokes your other dick[s], teasing [itThem] to full mast.", parse);
			Text.NL();
		}
		if(player.FirstVag()) {
			Text.Add("As well as pleasing your [cock], she occasionally licks and laps away at your [vag], causing you to moan. However, it's clear that your [cock] holds the bulk of her interest for now.", parse);
			Text.NL();
		}
		Text.Add("You're almost ready to lose yourself, but you try to persevere as long as possible. Given the fact that she blows like a slut, and has the skills to match, it's amazing that you've managed to last this long!", parse);
		Text.NL();
		Text.Add("However, your resistance comes to an end when she slides a single finger into your [anus] and presses against your prostate. The sensation is far too much for you to handle as she probes and squeezes persistently, massaging your delicate tunnel.", parse);
		Text.NL();
		if(player.HasBalls())
			Text.Add("Your [balls] draw tight, the cum desperately trying to erupt from you as it flows up and out.", parse);
		else
			Text.Add("You have the familiar feeling that tells you that you are about to blow. Unable to resist, you go with the flow, releasing your load.", parse);
		Text.NL();
		Text.Add("You feel an immense sense of relief as you ejaculate, enjoying the slick feel of Gwendy's mouth filling up with your spunk. It doesn't last long, however, as she begins to suck and drain all of your cargo without missing a beat. Once she finishes drinking your spooge, you withdraw, feeling worn but refreshed all the same.", parse);
		Text.NL();

		var cum = player.OrgasmCum();

		if(hangout) {
			Text.Add("She looks satisfied, indulging in your seed dripping down her throat. With a stray finger, she wipes whatever excess leakage there is, licking it up seductively. When she finishes, she leans in to kiss you, sharing a small bit of your fluids.", parse);
			Text.NL();
			Text.Add("<i>“It's always fun sharing, right?”</i> You smile and swallow before returning the kiss. Once you part, you gather your gear and prepare to leave.", parse);
		}
		else {
			Text.Add("Finished with your reward, you begin looking forward to the next time, maybe going for something better than her mouth. You give Gwendy a pat on the head for being such a good girl, giving such good head. She gives you an edgy smile as she gets up and kisses you, the smell of your fluid still on her breath. It surprises you a little, but you know this is her way of saying she isn't backing down. Good girl indeed...", parse);
		}
	}
	else {
		Text.Add("Flashing your [vag] in her face, you tell her to eat you out. You could use a good licking, and you're certain Gwendy won't object too much.", parse);
		if(!hangout)
			Text.Add(" Besides, even if she did, she'd still have to honor the rules of the challenge.", parse);
		Text.NL();
		parse["l"] = player.HasLegs() ? "Spreading your legs" : "Presenting yourself";
		Text.Add("[l], you invite her begin her task, and she gets to it silently. She starts with a lick, stroking your [clit] in the process. She continues with tentative licks as she slowly works toward fully burying her tongue in your [vag].", parse);
		Text.NL();

		Sex.Cunnilingus(gwendy, player);
		gwendy.Fuck(null, 2);
		player.Fuck(null, 2);

		Text.Add("Gwendy looks pretty cute eating you out. Her eyes look up at you from time to time, quietly observing you as you moan and pant like a bitch in heat. Pleasure washes over you as her tongue ravages your [vag] with slow, practiced strokes, making you glad you chose to do this. Her flexible organ is small but deft, licking and probing your inner walls. All the while, her nose keeps butting against your [clit].", parse);
		Text.NL();
		Text.Add("The farmer is squirming, one of her hands getting busy in her own cleft, intent on getting some fun out of this too. She moans, and moves her tongue with stronger but slower laps, making you writhe in ecstasy, desperately trying to force your [vag] further into her face. Your orgasm is closing in, and any attempts to stave it off are rendered futile by Gwendy's skillful mouth. Your muscles start spasming, and your [vag] spurts its juices all over your lover.", parse);
		Text.NL();
		if(player.FirstCock()) {
			Text.Add("Your [cocks] add[notS] [itsTheir] own contribution to the mess, shooting seed into the air while your orgasm is wrung out by Gwendy's lovely tongue.", parse);
			Text.NL();
		}

		var cum = player.OrgasmCum();

		if(hangout) {
			Text.Add("Pulling her face from your cleft, she looks up appreciatively. It seems like she's enjoyed herself more than you had imagined.", parse);
			Text.NL();
			Text.Add("<i>“Quite the honeypot you have there, [playername]. Wouldn't mind tasting a bit more of you, if you get my drift.”</i> You're happy she enjoyed it so much, but you have other matters to tend to. After giving your lover a kiss, you get dressed and head out.", parse);
		}
		else
			Text.Add("Exhausted, you see her drenched in fluids, though she's licking her lips as if they were coated in the most delicious liquid she's ever tasted. You get dressed and tell her you'll be back, if she still feels the need to challenge you. Heck, you'll probably be back anyways.", parse);
	}

	Text.Flush();

	world.TimeStep({minute: 30});
	player.AddLustFraction(-1);

	Gui.NextPrompt();
}

Scenes.Gwendy.ChallengeSexVag = function(fuck, hangout) {

	var parse = {
		playername     : player.name,
		manWoman       : function() { return player.mfTrue("man", "woman"); }
	};
	parse = player.ParserTags(parse);
	parse = gwendy.ParserTags(parse, "g");

	Text.Clear();

	var first  = gwendy.flags["ChallengeWinScene"] == 4;
	var second = !first && !hangout;

	parse["isAre"]    = player.NumCocks() > 1 ? "are" : "is";
	parse["s"]        = player.NumCocks() > 1 ? "s" : "";
	parse["notS"]     = player.NumCocks() > 1 ? "" : "s";
	parse["oneof"]    = player.NumCocks() > 1 ? " one of" : "";
	parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";


	parse["gs"]       = gwendy.NumCocks() > 1 ? "s" : "";
	parse["gnotS"]    = gwendy.NumCocks() > 1 ? "" : "s";
	parse["ges"]      = gwendy.NumCocks() > 1 ? "" : "es";
	parse["gits"]     = gwendy.NumCocks() > 1 ? "their" : "its";

	// If first time
	if(first) {
		Text.Add("Despite your numerous victories, it seems she’s set on challenging you, so why not enjoy the benefits of it? With this, you’ve trumped her five times now. But it isn’t as though she’s just being a pushover about it either, as her skill and dexterity have increased along with yours.", parse);
		Text.NL();
		Text.Add("It makes you worry a bit that she might beat you if you get careless, but for now you bask in the glory of victory! Heading back to Gwendy’s room, you lick your lips as you begin planning what you want from her this time. Once there, you tell the farmer to help you undress.", parse);
		Text.NL();
		Text.Add("Unlike your previous encounters, you remain standing after removing your gear, eyeing her hungrily. You see a little trepidation on Gwendy’s face for a change, but you don’t really care. Pushing Gwendy against the table, you ready yourself to ravage her [gvag]!", parse);

		gwendy.subDom.DecreaseStat(-100, 5);
		player.subDom.IncreaseStat(100, 3);

		gwendy.flags["ChallengeWinScene"] = 5;
	}
	else if(second) {
		Text.Add("With yet another win under your belt, you head back to the loft with the defeated farmer in tow. Once the two of you are secluded, you hastily strip as lust and greed begin to overtake you. Uncaring of the odd glances she casts at you, you push her onto the table, ready to claim her [gvag] again!", parse);
	}
	else {
		Text.Add("With a lecherous smile, you gently push Gwendy against the table. Stripping feverishly, like a [manWoman] possessed, you kiss her greedily, humping against her. She moans appreciatively, her [gvag] growing moist with arousal.", parse);
		Text.NL();
		Text.Add("Before you go mad with lust, you break the kiss, ready to take her!", parse);
	}

	Text.NL();

	if(fuck) {
		Text.Add("You grind[oneof] your [cocks] against her cleft, dipping the [cockTip] into the damp patch between her legs. ", parse);
		if(first)
			Text.Add("Finally! You are tired of simple little flings with the flirty farm girl; you are going to get something more substantial this time. Judging by the uncertain and slightly fearful look she gives you, you must have an almost savage appearance as you stare down at her. She says nothing, waiting for you to act, bringing a playful smile to your lips. It seems like all her losses have mollified her rebellious spirit, and she is ready to accept your dominance. ", parse);
		Text.Add("You push the girl onto the table, letting her rest on her back. With your hands freed, you make short work of the pesky clothes, revealing your long-awaited prize: her sopping wet cunt.", parse);
		Text.NL();
		if(gwendy.FirstCock()) {
			Text.Add("Despite - or due to - your rough treatment, Gwendy’s prominent equine member[gs] jut[gnotS] up, [gits] rigid mass[ges] throbbing erratically, wanting to join in on the fun. You see a pleading look on Gwendy’s face that begs for you to attend to her cock as well. Unfortunately for her, you have other plans in mind. Perhaps another time.", parse);
			Text.NL();
		}
		Text.Add("Taking a moment to drink in her beauty, you tease her outer lips a bit before plunging two eager fingers in, moving them in circular motions. Within moments, your probing hand is soaked in her juices, the clear liquid flowing down into your palm. Withdrawing your digits, you line up [oneof] your cock[s] against the lubricated tunnel. With equal parts lust and greed, you unceremoniously push inside, penetrating her in one deft motion. The shock is sudden, sending an electric tingle down your spine, as Gwendy cries out in fervent joy.", parse);
		Text.NL();

		Sex.Vaginal(player, gwendy);
		gwendy.FuckVag(gwendy.FirstVag(), player.FirstCock(), 3);
		player.Fuck(player.FirstCock(), 3);

		Text.Add("You stay still for a second, letting her slick folds squeeze around your [cock], briefly reveling in the feeling of her [gvag] before you ravage her. The farm girl looks up at you with her large blue eyes, silently begging you to take her, hard and fast. Not one to keep a lady waiting, you begin to move, your [cock] gripped tightly by her inner walls. For every thrust you make, she lets out a cute squeal, escalating to moans and cries as your thrusts build her arousal, her sweet tenor a pleasing accompaniment to the sounds of flesh grinding against flesh.", parse);
		Text.NL();
		Text.Add("Moving faster and faster, your [cock] is becoming almost painfully erect at this point, and your only options to soothe it is to bury it deep within the pretty girl underneath you. Gwendy, so consumed by pleasure that she is reduced to moaning and panting, wraps her legs around you while gripping the edges of the table tightly as you slam into her. Her eyes are half lidded, clouded by her lust, but her wordless cries beg you to fuck her harder, her [gvag] clamping down fervently around you, as if to milk you dry.", parse);
		Text.NL();
		Text.Add("As much as you’d love to prolong this glorious fuck, you are approaching your limit, ", parse);
		if(player.HasBalls())
			Text.Add("your [balls] drawing tight, ready to pack her full of spunk like the bitch she is.", parse);
		else
			Text.Add("feeling a familiar tingle in your groin, alerting you that it’s time to blow, and Gwendy’s [gvag] is the perfect place to do it in.", parse);
		Text.NL();
		Text.Add("Letting loose a torrent of cum, you feel your seed gush out, flooding her tunnel while you cry out in pleasure. Your lover isn’t far behind, her legs trapping you in place as her cunt constricts around your [cock], wringing you dry.", parse);

		var cum = player.OrgasmCum();
		var gcum = gwendy.OrgasmCum();

		if(gwendy.FirstCock())
			Text.Add(" Even as Gwendy’s [gvag] squeeze you, her [gCockDesc] erupt[gnotS] in a large geyser, thick globs of white seed sprouting aimlessly from the tip of the flared cock before gravity kicks in, coating the two of you in a fresh coat of horse-spunk.", parse);
		Text.NL();
		Text.Add("When you come back down from your climax, you pull out of her, a thick strand of your mixed fluids momentarily bridging the gap between the two of you. You fall back into a chair to catch your breath, admiring the mess the two of you have made.", parse);
		Text.NL();

		// TODO: Gwendy preg check

		if(hangout) {
			Text.Add("As you regain your composure, Gwendy pants breathlessly. With a chuckle, you consider the fuck well received before standing up and getting dressed. As you ready to leave, you look back one last time to see Gwendy blowing a flirtatious kiss.", parse);
			Text.NL();
			Text.Add("<i>“Don’t be a stranger now, [playername]. If you can put out like that more often, I definitely wouldn’t mind having you around more.”</i> Smiling at the horny gal, you head out on your travels again.", parse);
		}
		else
			Text.Add("As you begin to recover, you muse on if she might be willing to go for another round. However, Gwendy points out that you have already gotten your reward, and with that you go on your way, eager for the next encounter. From her determined expression, you are sure she’ll do her best to beat you next time.", parse);
	}
	// trib
	else {
		Text.Add("You nib lightly on Gwendy’s ear as you lean over her, whispering to her to pull off her clothes. Her crotch now bared, you press your dripping [vag] against Gwendy’s, grinning amorously. Leaning in, you kiss her fiercely, causing her to gasp in surprise before returning the favor, melting into your lips as her lust overtakes her. Your tongues entwine as you wrap her fingers in yours, the two of you intimately connected.", parse);
		Text.NL();
		parse["c"] = gwendy.FirstCock() ? ", nested just below her heavy scrotum" : "";
		Text.Add("Pulling back, you work Gwendy onto the table, having her lie on her back with her legs spread. It’s hard to do anything but admire her glistening netherlips[c]. After planting a soft kiss on her tiny clit, you wrap her in your arms, whispering to her to just relax and be yours. Gwendy blushes, letting out a submissive moan in response.", parse);
		Text.NL();
		parse["cl"] = player.FirstVag().clitCock ? "" : Text.Parse(", aiming your [clit] at Gwendy's", parse);
		Text.Add("You mount her, your [vag] pressing against hers, and begin grinding on her lap. You rut against her[cl], striking true as the two of begin panting and moaning in pleasure. You make sure she knows who’s in control, you doing most of the work, letting Gwendy writhe desperately under you.", parse);
		Text.NL();
		Text.Add("You close in for a kiss, unable to resist the cute, demure blush Gwendy has on her face, completely at odds with the desperate moans she exhales into your mouth. Your bodies press together eagerly, rocking and grinding in languid motions.", parse)
		if(player.FirstCock()) {
			Text.Add(" As you top her, your [cocks] [isAre] treated to a warm massage by the tight sleeve between your bodies. Just being pressed against her makes you want to cum, to spill your seed on both of you.", parse);
			if(gwendy.FirstCock())
				Text.Add(" You are not the only one either, as Gwendy’s equine member[gs] twitch[ges], eager for action but forced to be sated with grinding against your own cock[s].", parse);
		}
		else if(gwendy.FirstCock()) {
			Text.Add("As the two of you grind and hump, Gwendy’s trapped pecker[gs] twitch[ges] restlessly, [gits] aroused owner the target of a double assault in your sexual frenzy.  You can practically see [gits] need to release as Gwendy fidgets and buckles amidst the action.", parse);
		}
		Text.NL();
		Text.Add("Unable to deny the pleasure wrought from rutting against your slutty lover, you groan as you hit your climax, smearing the juices that pour from your [vag] onto the two of you. Your fluids mingle with those of Gwendy, the ecstatic look in her eyes telling you she is riding the crest of her own orgasm.", parse);
		if(player.FirstCock()) {
			Text.Add(" Your [cocks] join[notS] in on the fun, spraying an even coat of white glaze across Gwendy’s [gbelly] and lower breasts.", parse);
			if(gwendy.FirstCock())
				Text.Add(" Just as you cum, Gwendy adds her own jism to the fray, covering both of you with another layer of white fluid as she empties her equine balls.", parse);
		}
		else if(gwendy.FirstCock()) {
			Text.Add(" The sensual torture finally becomes too much for Gwendy’s throbbing horsecock[gs], which erupt[gnotS] weakly, coating the farm girl’s exhausted form in her own jizz.", parse);
		}
		Text.NL();

		player.AddSexExp(3);
		gwendy.AddSexExp(3);

		var cum = player.OrgasmCum();
		var gcum = gwendy.OrgasmCum();

		Text.Add("The two of you lie together for a long time after your climax, basking in the afterglow and trying to catch your breaths. ", parse);
		if(hangout) {
			Text.Add("As you lie atop one another, Gwendy kisses you lightly.", parse);
			Text.NL();
			Text.Add("<i>“Mm, who knew mushing our lady bits together would be so fun? You certainly are creative, [playername].”</i> Rolling your eyes, you play it off with a light remark about how much she enjoyed it.", parse);
			Text.NL();
			Text.Add("Before any heavy banter is started, you untangle yourself from your lover’s grip and get dressed. Once you are fully equipped and ready to go, Gwendy swats your [butt] playfully. The farmer kisses you briefly again before sending you on your way.", parse);
		}
		else {
			Text.Add("You’d love to just stay there and cuddle with the sexy farmer forever, but unfortunately you have other things to do. Cleaning yourself off, you get dressed and head on, leaving Gwendy to clean up after you, hoping she’ll challenge you again so you can continue the fun. As you leave, you swear you spot a burning determination in her eyes. Looks like the fight isn’t quite over yet...", parse);
		}
	}

	Text.Flush();

	world.TimeStep({minute: 30});
	player.AddLustFraction(-1);

	Gui.NextPrompt();
}

Scenes.Gwendy.ChallengeSexAnal = function(toys, hangout) {

	var parse = {
		playername     : player.name,
		manWoman       : function() { return player.mfTrue("man", "woman"); }
	};
	parse = player.ParserTags(parse);
	parse = gwendy.ParserTags(parse, "g");

	Text.Clear();

	var first  = gwendy.flags["ChallengeWinScene"] == 5;
	var second = !first && !hangout;

	parse["isAre"]    = player.NumCocks() > 1 ? "are" : "is";
	parse["s"]        = player.NumCocks() > 1 ? "s" : "";
	parse["notS"]     = player.NumCocks() > 1 ? "" : "s";
	parse["oneof"]    = player.NumCocks() > 1 ? " one of" : "";
	parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";


	parse["gs"]       = gwendy.NumCocks() > 1 ? "s" : "";
	parse["gnotS"]    = gwendy.NumCocks() > 1 ? "" : "s";
	parse["geachof"]  = gwendy.NumCocks() > 1 ? " each of" : "";
	parse["ges"]      = gwendy.NumCocks() > 1 ? "" : "es";
	parse["gits"]     = gwendy.NumCocks() > 1 ? "their" : "its";


	// If first time
	if(first) {
		Text.Add("Yet again, you’ve bested Gwendy at her own game, proving your worth to the curvaceous farm girl. While she put up a good fight, it was simply not enough compared to your skills. You flash Gwendy a victorious smile, and she responds with a nervous grin, hanging her head a bit. While she is grateful for your help, she’s a bit fearful for what you might have planned this time.", parse);
		Text.NL();
		Text.Add("It seems most of the sultry farm girl’s determination has left her body, but you’ve yet to reap your reward. Once you’ve reached the loft, you instruct for Gwendy to sit on her bed as you remove your [armor]. Rather than throw yourself at her like she expected - perhaps wished for? - you simply pet her on the head, building the tension while eyeing her with a predatory smile.", parse);

		gwendy.subDom.DecreaseStat(-100, 5);
		player.subDom.IncreaseStat(100, 3);

		gwendy.flags["ChallengeWinScene"] = 6;
	}
	else if(second) {
		Text.Add("Is Gwendy even trying anymore? As you walk back to the loft, conversing lightly, you give her a smack on her rear, whispering to her that she is in for some more anal attention today. Blushing slightly, the farmer’s eyes flit around, checking if anyone saw the exchange. She increase her pace slightly, perhaps to get out of public view, or maybe... she is looking forward to it?", parse);
		Text.NL();
		Text.Add("The latter actually seems likely as she helps you remove your [armor] before hopping onto her bed, breathing heavily in anticipation.", parse);
	}
	else {
		Text.Add("Feeling that you want to have some fun, you constantly tease and taunt Gwendy about her rear, saying how fun it is to grope it, how you’d like to stuff it, and fill her to the brim.", parse);
		Text.NL();
		Text.Add("<i>“You sure don’t mince words when you want something, [playername]. Well... I don’t mind a little fun back there, but can you please be gentle?”</i> The last part sounds like a plea, though you doubt she’d mind things getting a little rough. With a chuckle, you tell her you’ll consider it, playfully pushing her onto the bed. Stripping down, Gwendy looks back with a slight look of concern.", parse);
	}

	Text.NL();

	if(toys) {
		if(gwendy.flags["Toys"] == 0) {
			gwendy.flags["Toys"] = 1;

			Text.Add("Now then... lets see what sort of naughty things Gwendy has lying about in her room. You sternly tell her to remain where she is while you start rummaging through her drawers. Poor girl must have been a bit lonely before you showed up, judging by the number of toys she got stored here. Discounting several bottles of what looks to be massage oils and lubricants, you pull out a variety of sex toys, lining them up on the floor in front of the blushing farm girl.", parse);
			Text.NL();
			Text.Add("Dildos of various shapes and sizes, anal beads, several strap-ons... ", parse);
			if(gwendy.flags["ChallengeLostScene"] >= 6)
				Text.Add("the latter not entirely unfamiliar to you.", parse);
			else
				Text.Add("you idly wonder who she was planning to use the latter on.", parse);
			Text.Add(" As you look over the collection, you sense a certain theme here. Judging by her stash, Gwendy <i>really</i> seems to be into equine toys. More than two-thirds of the toys are shaped like horsecocks of various sizes, some so big you are surprised her body could even take them.", parse);
			Text.NL();
			Text.Add("<i>“G-going through a girl’s private stuff like that,”</i> the farmer huffs, embarrassed as you let your curious gaze wander across her collection. Ignoring her, you ask if this is all of it, or if she is hiding more somewhere else. <i>“Yes!”</i> she pipes, though her eyes betray her, as she throws a brief glance toward a huge chest on the other end of the room. Chuckling, you walk over to it to see what she is hiding.", parse);
			Text.NL();
			Text.Add("Inside the chest, below some clothes, bed sheets and smaller trinkets, you find Gwendy’s old sword. Surely, this wasn’t what she meant... You are just about to close the chest when you spot a large bulge under one of the sheets. Pulling it aside, you reveal the biggest toy of her collection so far, an immense, double-ended horsecock dildo, at least fifteen inches to each side. It is quite well made, with flared heads and thick, veiny sheaths. In addition to the obviously equine features of it, it’s covered in nubs, made to rub the user in all the right places.", parse);
			Text.NL();
			Text.Add("Grinning like an expectant child on the night of the winter solstice, you grab it and bring it over to the growing pile. Now, which one will you use?", parse);

			Text.Flush();

			//[Strapon][R.Strapon][Beads][D.Dildo]
			var options = new Array();
			options.push({ nameStr : "Strapon",
				func : function() {
					Scenes.Gwendy.ChallengeSexAnalToys(Gwendy.Toys.Strapon, hangout, first);
				}, enabled : false && !player.FirstCock(), // TODO ACTIVATE SCENE
				tooltip : "Fuck her with one of her horsecock strapons."
			});
			options.push({ nameStr : "R.Strapon",
				func : function() {
					Scenes.Gwendy.ChallengeSexAnalToys(Gwendy.Toys.RStrapon, hangout, first);
				}, enabled : false, // TODO ACTIVATE SCENE
				tooltip : "Have her wear a strapon and fuck you."
			});
			options.push({ nameStr : "Beads",
				func : function() {
					Scenes.Gwendy.ChallengeSexAnalToys(Gwendy.Toys.Beads, hangout, first);
				}, enabled : true,
				tooltip : "Wonder how many beads her ass can take?"
			});
			options.push({ nameStr : "D.Dildo",
				func : function() {
					Scenes.Gwendy.ChallengeSexAnalToys(Gwendy.Toys.DDildo, hangout, first);
				}, enabled : player.AnalCap() >= Items.Toys.EquineDildo.cock.Thickness(),
				tooltip : "Bring out Gwendy’s double-ended horsedildo for some double anal fun."
			});
			Gui.SetButtonsFromList(options);
		}
		else
			Scenes.Gwendy.ChallengeSexAnalToys(toys, hangout);
	}
	else // Domanal
	{
		if(first) {
			Text.Add("Her shapely ass has been teasing you for the longest time now, but the reward has been worth the wait. Gwendy is so far oblivious of your intentions, so you bring her up to speed by telling her to turn around and prop her butt up. She pouts slightly, but does as commanded, turning around and presenting her rear for you. She even goes the extra step and shakes her bum enticingly, looking back for your approval.", parse);
			Text.NL();
			Text.Add("It amazes you to see how far the confident farm girl has fallen under your dominance, but you’ve got more pressing matters to tend to right now.  You hastily do away with her shorts, baring her plump ass for you to take.", parse);
			if(gwendy.FirstCock())
				Text.Add(" Her equine member[gs] bob[gnotS] erratically, as if anticipating the impending buttfucking.", parse);
			Text.Add(" A low moan escapes the slutty girl as you rub[oneof] your [cocks] between her cheeks, quickly reaching full-mast.", parse);
		}
		else {
			Text.Add("Her shapely ass has been teasing you for the longest, and today you’re gonna ravage it yet again. Rubbing your [hand]s together, you tell Gwendy to get on all fours. She does so slowly, but once her butt is finally turned to you, she’s greeted with an abrupt spank, causing her to gasp sharply. You smile as you continue, pushing the girl’s face down onto her bed while your free hand kneads her buttocks.", parse);
			Text.NL();
			parse["Gbothof"] = gwendy.FirstVag() ? " both of" : "";
			parse["Gs"]      = gwendy.FirstVag() ? "s" : "";
			Text.Add("Once she’s in position, you do away with her shorts, revealing[Gbothof] her fuck-hole[Gs], ripe for the taking. ", parse);
			if(gwendy.FirstCock())
				Text.Add("Even her flared cock[gs] seem[gnotS] raring for the reaming, twitching helplessly despite receiving no attention. ", parse);
			Text.Add("Stroking[oneof] your [cocks], you grind and hump the farm girl’s supple cheeks, making her moan appreciatively as you continue.", parse);
			Text.NL();
			Text.Add("<i>“You’re such a pervert, [playername]... Oh!”</i> That earned her another spank.", parse);
		}
		Text.NL();
		Text.Add("You lean over and tell the farm girl that you’re going to fuck her ass raw, bringing out a fierce blush on her freckled face as you adjust your aim. Spreading her cheeks as far as possible, you’re greeted with her dainty, rosy entrance, surrounded by the creamy color of her beautiful skin.", parse);
		Text.NL();
		if(Math.random() < 0.5)
			Text.Add("As much as you want to plow her then and there, it wouldn’t be a bright move, so you stick your middle and ring fingers into you mouth before pushing the saliva-coated digits into her tight back passage.", parse);
		else
			Text.Add("<i>“T-top drawer!”</i> the farmer gasps as she feels your [cockTip] prodding her entrance. Delaying your conquest slightly, you pull out an unmarked bottle from said drawer, pouring a generous coating of the lubricant on both your [cocks] and your fingers. Starting out light, you sink two of your slick digits into her rear. ", parse);
		Text.NL();
		Text.Add("She arches her back, letting out a low whimper while you slowly work the fingers in and out of her [ganus] in an effort to get her prepared. All the while, you tease that she enjoys being finger-fucked like some common whore, which makes her blush shamefully.", parse);
		if(gwendy.FirstCock())
			Text.Add(" As you massage and prep her entrance, you mash against her prostate, causing her already rigid member[gs] to bounce up and down restlessly. You swear, she even begins dripping pre from the stimulation. What a buttslut!", parse);
		Text.NL();
		Text.Add("When you have her warmed up, you replace the fingers with your [cock], pushing into her warm depths in one swift motion. Pausing for a moment, you let the gasping farm girl adjust, allowing her muscles to become acquainted with your shape before you start fucking her in earnest.", parse);
		Text.NL();

		Sex.Anal(player, gwendy);
		player.Fuck(player.FirstCock(), first ? 10 : 3);
		gwendy.FuckAnal(gwendy.Butt(), player.FirstCock(), first ? 10 : 3);

		if(!hangout) {
			Text.Add("You are not going to hold back any more, as you simply want to drive into her that if she challenges you, she will be yours to use. It seems like she has arrived at the same conclusion as she reaches back and spreads her own cheeks while bending as low as possible, trying to get the best angle for your [cock]. Seems this girl has <i>a lot</i> more experience than you gave her credit for. Wonder who else has explored these depths?", parse);
			Text.NL();
			Text.Add("<i>“Good girl,”</i> you grunt, pleased with her submissive demeanor.", parse);
			Text.NL();
		}
		Text.Add("Thrusting and pumping into her savagely, you are rewarded with whorish moans and gasps. She hardly seems to mind. Thanks to you, she has been reduced to the most base of pleasures, begging for more as you repeatedly bury your [cock] in her shapely butt. After your initial warm-up, you give in to your desires, fucking her with abandon, pushing both of you toward your inevitable climaxes.", parse);
		Text.NL();
		if(first)
			Text.Add("<i>“S-so good!”</i> she gasps. <i>“We have to do this more!”</i> Well, you aren’t going to voice any complaints there.", parse);
		else {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>“Yes, yes!”</i> the farm girl cries out. <i>“Fuck me, use me!”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“That’s right, stretch my butt!”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“I just can’t get enough of it!”</i> the horny farmer gasps. <i>“I love being fucked by a horsecock, so big...”</i>", parse);
			}, 1.0, function() { return player.FirstCock().race.isRace(Race.Horse); });

			scenes.Get();
		}
		Text.NL();
		Text.Add("Gwendy’s sphincter tightens around your [cock], announcing that she is the first one to cum. ", parse);
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("Her balls lets loose the flood of her pent up seed,[geachof] her horsecock[gs] painting her bed in strands of sticky white goo. ", parse);
		}, 1.0, function() { return gwendy.FirstCock(); });
		scenes.AddEnc(function() {
			Text.Add("She cries out, and from the wetness trailing down her legs, she’ll have to change the sheets after you are done here. ", parse);
		}, 1.0, function() { return gwendy.FirstVag(); });

		scenes.Get();

		parse["b"] = player.HasBalls() ? Text.Parse("r [balls]", parse) : "";
		Text.Add("All too soon, the familiar surge of orgasm flows through you. You welcome it, readying yourself to cream her and mark her as yours. As a final churn goes through you[b], you let loose your cargo into her. Gwendy cries out in shock as her bowels are stuffed with spooge, pumped ceaselessly from your quivering shaft. You stay in her for a while, just enjoying the sensation of her, plugged and full of your seed. When you finally pull out, cum bubbles and drips from her rosy pucker as it struggles to retain its shape prior to your domination.", parse);
		Text.NL();

		var cum = player.OrgasmCum();

		if(hangout) {
			Text.Add("Satisfied with your romp, you rise and gear up. Behind you, Gwendy gets up, shivering slightly as she carefully balances on the edge of the bed. You ask her if she’ll be fine, but she dismisses your concerns.", parse);
			Text.NL();
			Text.Add("<i>“I’m just a little tired is all. Thanks... for that, but I’ve got work to do.”</i> She looks a bit disoriented as she gets up.", parse);
		}
		else
			Text.Add("Satisfied, you gear up and get ready to go on your way, but not before reminding Gwendy that you’ll still accept her challenge her if she wants another go. Not waiting for her response, you head on about your day.", parse);

		Text.Flush();

		world.TimeStep({minute: 30});
		player.AddLustFraction(-1);

		Gui.NextPrompt();
	}
}

Scenes.Gwendy.ChallengeSexAnalToys = function(toy, hangout, first) {
	var parse = {
		playername     : player.name,
		manWoman       : function() { return player.mfTrue("man", "woman"); }
	};
	parse = player.ParserTags(parse);
	parse = gwendy.ParserTags(parse, "g");

	Text.Clear();

	parse["isAre"]    = player.NumCocks() > 1 ? "are" : "is";
	parse["s"]        = player.NumCocks() > 1 ? "s" : "";
	parse["notS"]     = player.NumCocks() > 1 ? "" : "s";
	parse["oneof"]    = player.NumCocks() > 1 ? " one of" : "";
	parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";


	parse["gisAre"]   = gwendy.NumCocks() > 1 ? "are" : "is";
	parse["gs"]       = gwendy.NumCocks() > 1 ? "s" : "";
	parse["gnotS"]    = gwendy.NumCocks() > 1 ? "" : "s";
	parse["ges"]      = gwendy.NumCocks() > 1 ? "" : "es";
	parse["gits"]     = gwendy.NumCocks() > 1 ? "their" : "its";


	if(toy == Gwendy.Toys.Strapon) { //TODO Write scene
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);

		Text.Flush();

		world.TimeStep({minute: 30});
		player.AddLustFraction(-1);

		Gui.NextPrompt();
	}
	else if(toy == Gwendy.Toys.RStrapon) { //TODO Write scene
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);

		Text.Flush();

		world.TimeStep({minute: 30});
		player.AddLustFraction(-1);

		Gui.NextPrompt();
	}
	else if(toy == Gwendy.Toys.Beads) {
		if(!first) {
			Text.Add("Grinning, you tell her to wait while you rummage through her toy collection, pulling out a series of large, thick anal beads.", parse);
			Text.NL();
		}
		parse["gen"] = gwendy.FirstCock() ? ", dripping past her balls and down her soft horsecock" : "";
		Text.Add("Under your instructions, Gwendy gets down on all fours on the bed. Almost dismissively, you tear off her clothes, baring her bottom for your greedy hands. You apply a generous amount of lube to her crack, letting the cold liquid pour down between her cheeks[gen]. Now, lets see how many she’ll take before she’s full!", parse);
		Text.NL();
		Text.Add("The first bead pops in easily enough, thick as it is, enticing a gasp out of the prone farmer. The second and third one follow without problems, though you see her toes curling in pleasure from the penetration. By the fifth one, you are starting to encounter resistance, and Gwendy bites her lip, groaning as she tries to ease her anal ring. Finally, all seven globes are firmly lodged in her back passage, a piece of string the only indication of her hidden cargo.", parse);
		Text.NL();

		Sex.Anal(null, gwendy);
		gwendy.FuckAnal(gwendy.Butt(), Items.Toys.LargeAnalBeads.cock, 2);
		player.AddSexExp(2);

		Text.Add("<i>“Hah! Something like this is nothing!”</i> the farmer scoffs, blushing slightly as she adjusts her stance, perhaps more aroused by the beads than she wants to let on.", parse);
		if(gwendy.FirstCock())
			Text.Add(" If her erect [gcocks] [gisAre] any indication, she <i>really</i> likes it.", parse);
		Text.Flush();

		//[Walk][Work][Take out]
		var options = new Array();
		options.push({ nameStr : "Walk",
			func : function() {
				Text.Clear();
				Text.Add("You tell her to walk around a bit like that, crawling on all fours around the loft. She grudgingly obeys, wincing as each movement moves the beads around in her bowels. You give her an encouraging slap on her cheek as she is passing by, earning you an infuriated look from the proud farmer.", parse);
				Text.NL();
				Text.Add("<i>“Ugh, you’ve had your fun, take this out already,”</i> Gwendy moans, annoyed with you. As the lady commands.", parse);
				// Pop from call stack
				PrintDefaultOptions();
			}, enabled : player.SubDom() >= 15,
			tooltip : "Have her walk around the room a bit, see if she's so tough."
		});
		options.push({ nameStr : "Work",
			func : function() {
				Text.Clear();
				Text.Add("Fair enough. Why don’t she go about her day then?", parse);
				Text.NL();
				Text.Add("<i>“W-what? Like this?”</i> She looks dismayed as you nod. Blushing furiously, she nonetheless picks up her clothes, pulling them on gingerly. Gwendy stands up unsteadily, wincing as she leans down to pull on her boots. When standing up, one almost wouldn’t suspect that she had a long string of anal beads stuffed up her butt.", parse);
				if(gwendy.FirstCock())
					Text.Add(" Her [gcocks] straining against the fabric of her tight shorts could clue someone in, though.", parse);
				Text.NL();
				Text.Add("<i>“Pervert,”</i> she mutters as she stalks past you, climbing down the ladder to the barn. You tag along close behind her, eager to see how she’ll fare.", parse);
				Text.NL();

				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("Gwendy doesn’t seem to want to leave the barn, so she goes to tend the cows. She doesn’t do a very good job at it though, as she winces visibly each time she sits down to milk one of them. She keeps throwing smoldering glances in your direction.", parse);
					if(!hangout)
						Text.Add(" Such a sore loser.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					parse["Adrian"] = adrian.name;
					parse["heshe"]  = adrian.heshe();
					parse["himher"] = adrian.himher();

					Text.Add("Gwendy decides to go tending to the fields, and you keep a respectable distance as she angrily grabs hold of a scythe. Better not make her <i>too</i> angry at you. She goes about her business, so focused on cutting grass that she doesn’t notice [Adrian] coming up behind her.", parse);
					Text.NL();
					if(gwendy.FirstCock()) {
						Text.Add("<i>“Gwendy, can you-”</i> [Adrian] falters as the farmer whirls about, faced with her barely contained, rock-hard [gcocks]. <i>“I- uh, I’ll just be over here,”</i> [heshe] mumbles, quickly putting some distance between [himher]self and the horny, irritated farm girl. She goes back to hacking angrily at the innocent grass, throwing glowering looks in your direction.", parse);
					}
					else {
						Text.Add("<i>“What is it no-”</i> Gwendy snaps angrily, whirling about. <i>“Oh. A-[Adrian].”</i> She hastily excuses herself, walking away from the confused horse-morph, throwing glowering looks in your direction.", parse);
					}
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Gwendy decides to go tend to the sheep, quickly regretting her decision when she meets the bubbly airhead Danie.", parse);
					Text.NL();
					Text.Add("<i>“Hello, Miss Gwendy! Such a lovely day!”</i> the sheep-morph gaily exclaims. <i>“Are you alright miss?”</i> Danie looks a bit concerned at the farmer’s discomfort.", parse);
					Text.NL();
					Text.Add("<i>“J-just fine, Danie, just fine,”</i> she chips out, throwing glowering glances in your direction. The curious sheep follows Gwendy around as she goes about her work, and at the moment she least expects it, Danie pulls on the short piece of string sticking out of Gwendy’s pants.", parse);
					Text.NL();
					Text.Add("<i>“DANIE!”</i> the farmer yowls, batting off the confused sheep, inadvertently scattering the entire flock with her waving arms. Ah, fun times.", parse);
				}, 1.0, function() { return true; });

				scenes.Get();

				Text.NL();
				Text.Add("<b>Time passes...</b>", parse);
				Text.Flush();

				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("<i>“Enough!”</i> Gwendy finally pants, dragging you back toward the loft.", parse);
					Text.NL();
					parse["cum"] = gwendy.FirstCock() ? "cum" : "clear liquid";
					Text.Add("The last stretch is the worst for her, and as she climbs up the ladder in front of you, you see a trickle of [cum] slowly dripping down one of her legs. When you pull yourself up on the landing, Gwendy’s legs are shaking slightly in the afterglow of her anal orgasm.", parse);
					Text.NL();
					parse["gen"] = gwendy.FirstCock() ? Text.Parse(", freeing her stiff [gcocks]", parse) : "";
					Text.Add("<i>“T-take this out, right now!”</i> she whimpers, pulling down her shorts[gen]. As the lady commands.", parse);
					// Pop from call stack
					PrintDefaultOptions();

					player.subDom.IncreaseStat(50, 1);
					gwendy.subDom.DecreaseStat(-10, 1);
					world.TimeStep({hour: 1});
				});

			}, enabled : player.SubDom() >= 30 && (world.time.hour < 19 && world.time.hour >= 5),
			tooltip : "Have her work for a while like this."
		});
		options.push({ nameStr : "Take out",
			func : function() {
				Text.Clear();
				Text.Add("Looks like she has had enough for now.", parse);
				// Pop from call stack
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Have mercy on her and remove the beads."
		});
		Gui.SetButtonsFromList(options);

		Gui.Callstack.push(function() {
			Text.Add(" You grab hold of the string, tugging on it lightly. By now, Gwendy’s pucker has tightened up, so it takes a little effort to pop out the first bead.", parse);
			Text.NL();
			Text.Add("<i>“Ngh, so rough!”</i> she complains. You ask her if she’d rather you stop, leaving it inside, and she angrily shakes her head, motioning you to continue. Two. Three.", parse);
			Text.NL();
			Text.Add("<i>“Why did I agree to this?”</i> she grumbles, wincing as four and five pop. As you begin to pull on the sixth, a tremble runs through her legs. <i>“[playername]! W-wai-”</i> Woops. Gwendy cries out in orgasm as the final beads pop out of her gaping anus. ", parse);
			if(gwendy.FirstCock())
				Text.Add("Gouts of cum splash all over the floorboards as the farmer’s cock[gs] erupt[gnotS], emptying her balls.", parse);
			else
				Text.Add("Flowing girl-cum drips from the farmer’s pussy, trickling down her wobbly legs.", parse);
			Text.NL();
			if(hangout)
				Text.Add("Well, that was fun.", parse);
			else {
				Text.Add("<i>“I... I’ll return the favor, if I win next time...”</i> she gasps weakly.", parse);
				Text.NL();
				Text.Add("Cheerfully, you wave goodbye to the exhausted girl. Well, that was fun. Chuckling to yourself, you head out on your travels again.", parse);
			}

			Text.Flush();

			world.TimeStep({minute: 30});
			player.AddLustFraction(0.2);

			Gui.NextPrompt();
		});
	}
	else { // DDildo
		if(!first) {
			Text.Add("Grinning, you tell her to wait while you rummage through her toy collection, bringing out the huge double-ended horsecock dildo.", parse);
			Text.NL();
		}
		Text.Add("Humming to yourself, you cradle the huge double-ended equine dildo in your arms, licking at one of the flared heads seductively. Gwendy eyes you with a hungry look, barely holding herself back, but obeying your commands for now. You tell her to get out of those pesky clothes so that she can join in on the fun. She quickly wiggles out of her shorts and shirt, grabbing a bottle of lube in passing before pulling you down on the bed, dildo in tow.", parse);
		Text.NL();
		Text.Add("You position yourself opposite each other, the large toy pressed between your bodies, each of you with one of the flared heads within easy reach. Grabbing hold of Gwendy’s plump cheeks, you press the dildo against her genitalia, varying your licking between the fat equine head and the hole in which it will soon be buried.", parse);
		Text.NL();
		if(gwendy.FirstCock()) {
			Text.Add("The farmer isn’t making the job easy for you as her own rigid horsecock[gs] compete[gnotS] for space, pressing tightly against her stomach. The heady, musky smell rising from her balls is extremely distracting, but you manage to keep yourself focused.", parse);
			Text.NL();
		}
		Text.Add("Wanting to return the favor, Gwendy licks on the other end of the toy, coating the flare in her saliva. She reaches farther and farther, until you suddenly feel her cool tongue on your [butt]. She lightly caresses it, hesitantly at first, but growing more and more confident as she buries her head between your cheeks, loosening up your pucker.", parse);
		if(player.FirstCock())
			Text.Add(" You almost regret your plan; why not throw her on her back and ram your [cocks] inside her?", parse);
		Text.NL();
		Text.Add("<i>“M-me first,”</i> Gwendy pants, getting up on all fours, shaking her ass at you invitingly. <i>“Use a lot of lube, okay?”</i> She sighs in pleasure as the cool lubricant pours between her cheeks, dripping down the huge toy as you slide it between her buns. Adjusting your aim slightly, you press the flared head against her back entrance. At first, it looks like an impossible task to fit the broad head equine toy inside her, but the girl keeps egging you on, spreading her legs and butt cheeks wide in her efforts to impale herself on her favorite dildo.", parse);
		Text.NL();
		parse["gen"] = gwendy.FirstCock() ? "cock and balls" : "snatch";
		Text.Add("After an agonizing amount of teasing, it finally pops inside, Gwendy’s anal ring stretched an incredible amount. The girl collapses, her legs no longer able to hold her up as she has her first trembling orgasm. Thanks to the flared head, the dildo is firmly stuck inside, about two feet of it hanging out invitingly. Gwendy rolls over on her back, exposing her dripping [gen] and her stuffed ass.", parse);
		Text.NL();

		Sex.Anal(null, gwendy);
		gwendy.FuckAnal(gwendy.Butt(), Items.Toys.EquineDildo.cock, 3);

		Text.Add("<i>“Your turn,”</i> she smiles at you, exhausted from the effort.", parse);
		Text.NL();
		Text.Add("On second thought, you aren’t so sure about this anymore, but you let yourself be pulled down on top of the girl, closing your eyes as her lubed fingers snake their way into your [anus], spreading it in preparation for the huge toy. After sharing a deep kiss, you nervously reposition yourself on your back, legs spread for the monster you will share with your lover.", parse);
		Text.NL();
		Text.Add("<i>“I know you’ll love it, don’t worry,”</i> Gwendy murmurs, nudging her hips forward, easing the other head against your spread cheeks. Due to its flexibility, it’s hard for her to guide it in by herself, so you lean down to lend a hand, keeping her aim straight.", parse);
		Text.NL();
		if(player.AnalCap() >= 8)
			Text.Add("A toy like this is hardly a match for you, and you are easily able to take it in, greedily swallowing several inches of it, letting the flare settle inside your stretched back passage.", parse);
		else
			Text.Add("You now know why it took so long for Gwendy to take the equine toy, it is so thick! The farmer is persistent though, keeping the pressure on your anus up. Slowly, ever so slowly, you can feel the flared head force its way inside your stretched rectum, each undulation of her hips pushing it further in. At long last, it passes the point of no return, trapped inside your stretched back passage.", parse);
		Text.NL();

		Sex.Anal(null, player);
		player.FuckAnal(player.Butt(), Items.Toys.EquineDildo.cock, 3);

		parse["l"] = player.HasLegs() ? "legs together" : "[legs] with Gwendy's legs";
		if(player.FirstCock())
			Text.Add("<i>“I think you’ll feel this one on your prostate,”</i> she grunts, punctuating her words with a roll of her hips. No doubt.", parse);
		else
			Text.Add("<i>“It feels good, doesn’t it?”</i> the farm girl sighs, letting you rest a bit before she starts moving in earnest.", parse);
		Text.Add(" Entwining your [l], you start to pull toward each other, pushing more and more of the double-ended toy into your respective holes. Before long, you start encountering the nubs. Oh Aria, the nubs. As if the toy itself wasn’t girthy enough, a myriad of bulging studs are set at irregular intervals, stretching your ring even farther when they pass it. Once inside, they drag against the walls of your colon, stirring you up even more.", parse);
		Text.NL();
		Text.Add("Nodding to Gwendy, you both get back on all fours, facing opposite directions. In unison, you start to rock your hips, trying to push against each other in order to force the toy deeper inside. ", parse);
		if(player.Butt().Cap() >= 8) {
			Text.Add("Soon, your asses touch, as both of you have impaled yourselves as far as you can go on the massive dildo. Gwendy looks back over her shoulder in surprise.", parse);
			Text.NL();
			Text.Add("<i>“You are quite good at this; someone has been getting a lot of practice!”</i> she moans happily as your butts grind together.", parse);
		}
		else {
			Text.Add("You haven’t been trained quite as well as Gwendy has, so there is a limit to what you can take. Still, that doesn’t mean that the horny farmer doesn’t do everything she can to push that limit as far as it can go, buckling her hips back at you.", parse);
		}
		Text.NL();
		if(player.FirstCock()) {
			Text.Add("Just like she said, having the studded horsecock plowing your behind for an extended period of time is bliss for your poor prostate. Already at the first thrust, you could feel your cockmilk being pressed out of it, and by now your [cocks] [isAre] drooling with cum from numerous anal orgasms.", parse);
			Text.NL();
		}
		Text.Add("<i>“Hah… just… tell me when you’ve had enough!”</i> Gwendy groans, still showing her fighting spirit. Like animals, you rut against each other, caught up in your lust. You tumble around, trying to get a better angle of penetration on the other. It’s like a playful wrestling match, only you are sharing a two foot equine dildo between the two of you, grinding and thrusting.", parse);
		Text.NL();
		Text.Add("Finally, you’ve both run out of energy. Exhausted, you collapse in a pile of sexual juices, the horsecock dildo pulling free from your ass with a loud pop. Gwendy lies next to you panting, the other end still firmly lodged in her stretched behind. After giving her a kiss, you leave her like that", parse);
		if(player.Butt().Cap() < 8)
			Text.Add(", rubbing your sore butt.", parse);
		else
			Text.Add(" and head out back on your adventures.", parse);
		if(!hangout) {
			Text.NL();
			Text.Add("Before you leave, you hear Gwendy murmur something to herself:", parse);
			Text.NL();
			Text.Add("<i>“I… I guess you’ve really beaten me this time.”</i> She doesn’t sound the slightest bit unhappy about this.", parse);
		}

		//TODO Stretch butt
		if(player.Butt().capacity.IncreaseStat(8, .5)) {
			Text.NL();
			Text.Add("<b>Your butt feels slightly stretchier.</b>", parse);
		}

		Text.Flush();

		world.TimeStep({minute: 30});
		player.AddLustFraction(-1);

		Gui.NextPrompt();
	}
}

Scenes.Gwendy.ChallengeSexLostPrompt = function(hangout, options, disableSleep) {
	Text.Clear();

	var parse = {
		playername      : player.name,
		phisher         : player.body.Gender() == Gender.male ? "his" : "her"
	};
	parse = player.ParserTags(parse);
	parse = gwendy.ParserTags(parse, "g");

	parse["genDesc"] = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
	                   player.FirstVag() ? function() { return player.FirstVag().Short(); } :
	                   "featureless crotch";

	// gwendy.flags["ChallengeLostScene"]
	var lossScene = gwendy.flags["ChallengeLostScene"];
	var wonScene  = gwendy.flags["ChallengeWonScene"];
	if(hangout) lossScene--;
	if(hangout) wonScene--;

	if(lossScene >= 0) {
		options.push({ nameStr : "KissSub",
			func : function() {
				Text.Clear();

				world.TimeStep({minute: 30});
				player.AddLustFraction(0.1);
				if(hangout) {
					Text.Add("Smiling delightfully, Gwendy leans in, pressing her lips against yours. You moan gently as her soft, full lips explore your own.", parse);
				}
				else
					Text.Add("Gwendy lets out an excited squeal, knowing she bested you in the challenge. A part of you wonders just what she has in store, but you're answered when she embraces you and presses her lips against yours.", parse);
				Text.NL();
				Text.Add("It's just a kiss, simply a kiss, though she does make it a little more amorous than simply kissing. All the while, she flicks her tongue around in your mouth, wrapping around yours and exploring inside.", parse);
				Text.NL();
				Text.Add("It's simple and sweet, but she breaks the kiss with you before long. When the two of you separate, she looks at you almost innocently, but her eyes betray the spark of excitement and lust she's hiding from her face.", parse);
				Text.NL();
				if(hangout) {
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.Add("Once she breaks the lip-lock, you feel the need to kiss more, maybe even more! Gwendy chuckles seeing your desperation. <i>“Nope, no more from me. After all, isn't it better to wait?”</i> You pout a bit, but she pats your [butt] as she heads back to work. <i>“Maybe next time, there'll be a little more.”</i> As always, tease and taunt enough to get you coming back for more. Maybe next time, indeed...", parse);
						Text.Flush();
						Gui.NextPrompt();
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("As she breaks the kiss, you find yourself slightly aroused. The same could be said for Gwendy and her amorous glance. <i>“Heheh, sorry, [playername], but that's all for now.”</i> She smiles upon noticing your disappointment, though she makes up with another, longer kiss. <i>“Then again, I might not be able to resist so easily... whaddaya say we kick it up a notch?”</i>", parse);
						Text.Flush();
						Scenes.Gwendy.LoftSexPrompt(false, disableSleep);
					}, 1.0, function() { return lossScene >= 1 || wonScene >= 1; });

					scenes.Get();
				}
				else {
					Text.Add("In any event, she parts with you saying, <i>“That wasn't too bad at all, [playername]... though you'd better be prepared for next time. I won't be as nice as this time. Take care!”</i> Seems like she's already thinking of ways to keep you in check should you lose again, meaning either you've got to step your game up, stop the challenge, or give up. Still, that kiss was rather hot...", parse);
					Text.Flush();
					Gui.NextPrompt();
				}
			}, enabled : true,
			tooltip : "Let Gwendy kiss you."
		});
	}
	if(lossScene >= 1) {
		options.push({ nameStr : "Make-out",
			func : function() {
				Text.Clear();
				if(hangout)
					Text.Add("Gwendy giggles happily. If the sultry look in her eyes are any indication, you’d best be prepared...", parse);
				else
					Text.Add("You curse under your breath, Gwendy has won again! Still, you don’t beat yourself up about it too much, as the challenge was rather intense, and you put up a fair enough fight. However, in the end, you didn’t win, and Gwendy gets to do what she wants to you.", parse);
				Text.NL();
				Text.Add("Approaching you with a mischievous smile, Gwendy all but forces herself on you then and there, throwing her arms around you and locking lips with you once more.", parse);
				Text.NL();
				if(lossScene == 1) {
					Text.Add("You wonder if she’s just going to repeat the same thing she did last time, as her tongue begins to stroke and caress yours. Your question is answered when you feel your back press against something solid. The girl is a <i>lot</i> more forceful this time.", parse);
					Text.NL();
				}
				parse["them"] = player.FirstBreastRow().Size() > 3 ? " them" : "";
				Text.Add("She keeps kissing you, constantly nuzzling and feeling you up. Her hands move from your face to your [breasts], moving[them] in slow circles, coaxing a small wave of arousal to flush over you. The girl relentlessly explores your body, touching just about every part of you as she moans and presses herself against you. The entire time, you fight to keep up, letting out a few whimpering moans while getting more and more aroused by her fire.", parse);
				Text.NL();

				if(gwendy.FirstCock()) {
					parse["legs"] = player.LowerBodyType() == LowerBodyType.Single ? "against you" : "between your legs";
					Text.Add("As Gwendy gets more and more into the carnal act, you feel her equine addition rubbing [legs], ready and waiting to defile whatever crosses its path. Gwendy breaks the hot kiss you two share, biting her lip as she shares a slightly embarrassed look with you.", parse);
					Text.NL();
					Text.Add("<i>“You don’t know how hard it is to restrain from fucking you sometimes, when you’re packing what I’ve got, [playername],”</i> she says in a sultry tone. Pressing her body and lips against yours once more, she grinds with reckless abandon, her bulging erection[gs] threatening to escape her tight pants any second.", parse);
					Text.NL();
				}
				if(player.FirstCock()) {
					Text.Add("Breathing heavily, you quickly lose yourself to baser thoughts, just enjoying the attention you are receiving. The dominant farm girl has no qualms about using you in whatever way she can, teasing you mercilessly. A worried moan escapes your lips as Gwendy slips a hand into your [botarmor], lightly jerking your [cocks] on the spot. It feels good, but it isn’t enough to drive you to the point of orgasm, something Gwendy clearly avoids, keeping you carefully on the edge.", parse);
					Text.NL();
				}
				if(player.FirstVag()) {
					Text.Add("As the two of you make out, you feel moisture trickling from your [vag], lightly soaking your undergarments. Seeing your arousal on your face, Gwendy smirks a bit as she fingers you playfully. It feels good, oh so good, but Gwendy’s skilled digits keep you teetering on the edge of orgasm, preventing you from reaching your climax.", parse);
					Text.NL();
				}

				world.TimeStep({minute: 30});
				player.AddLustFraction(0.5);

				if(hangout) {
					player.AddLustFraction(1);
					player.AddLustFraction(-0.1);

					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.Add("Ending her groping session with a kiss, Gwendy places her hands on your face, looking longingly into your eyes.", parse);
						Text.NL();
						Text.Add("<i>“Mm, [playername], I’d love to continue, but I’m backed up as it is. Maybe next time, we can do something more?”</i>", parse);
						Text.NL();
						Text.Add("With that, she leaves you, smiling over her shoulder. You get your gear in order again, already looking forward to your next encounter with the teasing farm girl.", parse);
						Text.Flush();
						Gui.NextPrompt();
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("As Gwendy leads her sexual assault, she continuously gropes your groin. Under her relentless teasing, you become so aroused you’re practically leaking, though Gwendy stops before you can get off. With a playful yet predatory smile, she pats you on the head.", parse);
						Text.NL();
						Text.Add("<i>“You know... we can always kick this up a notch if you want to...”</i>", parse);
						Text.NL();
						Text.Add("Without wasting a moment, you agree, eager to get back at her for this.", parse);
						Text.NL();
						Text.Add("<b>TEMP, SCENE MISSING</b>");
						Text.Flush();
						// TODO: SEX PROMPT
						Gui.NextPrompt();
					}, 1.0, function() { return true; });

					scenes.Get();
				}
				else {
					Text.Add("After making out with you for a good twenty minutes, she breaks her last kiss, though not before copping a quick feel of your [genDesc] one last time before walking off. It leaves you turned on, but you feel a little ashamed about it. Not wanting to dwell on it anymore, you head on your way, trying to clear your thoughts.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}
			}, enabled : true,
			tooltip : "Have a steamy make-out session."
		});
	}
	if(lossScene >= 2) {
		options.push({ nameStr : "Denial",
			func : function() {
				var first  = lossScene == 2;
				var second = !first && !hangout;

				Text.Clear();
				Text.Add("She wins... yet again. ", parse);

				if(!hangout) {
					if(first) {
						player.libido.IncreaseStat(100, 2);

						Text.Add("As she lets out a happy sigh, you find yourself a little nervous about what she might do this time. The previous times, she just aggressively kissed and groped you, leaving you somewhat aroused but you’re sure this streak won’t continue.", parse);
						Text.NL();
						Text.Add("As if reading your exact thoughts, she approaches you. However, instead of doing something then and there, she grabs your arm and pulls you toward her room. After climbing up the ladder, she pulls a chair from the table for you to sit in, while she stands and looks at you with a curious expression. Is she going to do something to get you off this time? That wasn’t something you’d expect from the victor, but you don’t mind it at all.", parse);
						Text.NL();
						Text.Add("However, it seems she has other ideas in mind. She tells you to strip your [armor] before her as she steps closer, her expression changes to a predatory one. This can’t be good...", parse);
						Text.NL();
					}
					else {
						Text.Add("The farm girl has a malicious glint in her eyes, making you squirm slightly under her close scrutiny.", parse);
						Text.NL();
						Text.Add("<i>“You feel up for another tease?”</i> Gwendy grins at your suggestion. <i>“I can keep you going for hours, and don’t expect me to let you get off. You must have a real masochistic streak, huh?”</i>", parse);
						Text.NL();
						Text.Add("Without allowing you any opportunity to respond, she bodily drags you toward the loft. After scaling the ladder, she pulls out a chair and instructs you to sit down.", parse);
						Text.NL();
					}

					Text.Add("Like previous times, she starts with a deep kiss, locking tongues with you. Her hands begin to lightly stroke your body, while slowly moving down. It feels good, simply kissing her as her delicate fingers trace and run down the course of your body.", parse);
					if(player.HasFur())
						Text.Add(" She even takes the time to scratch and pet your fur, gently coaxing a groan of happiness out of you.", parse);
				}
				else { //Hangout
					Text.Add("Gwendy smiles happily as she pushes you into a chair, her predatory expression rising submissive arousal through you. She starts off gently, kissing lovingly and passionately. As you two lock lips, Gwendy’s fingers run down your hips and thighs.", parse);
				}
				Text.NL();
				Text.Add("The farm girl is slow and coy in her movements, skillfully dragging out each languid touch until your body is trembling. You let out an involuntary gasp as her hands finally reach your groin.", parse);
				Text.NL();


				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					parse["s"]        = player.NumCocks() > 1 ? "s" : "";
					parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
					parse["oneof"]    = player.NumCocks() > 1 ? " one of" : "";

					Text.Add("Gwendy’s hands gently caress your [cocks], raising small murmurs of delight from you as she coaxes your shaft[s] to [itsTheir] full size.", parse);
					if(player.HasBalls())
						Text.Add(" She even manages to get your [balls] into her palm, groping and rolling them over as she plays with[oneof] your [cocks].", parse);
					if(player.FirstCock().race.isRace(Race.Horse))
						Text.Add(" Most of her attention focuses on your equine member, as if she just can’t get enough of it. It’s almost as if she were petting it, admiring your pony pecker despite herself.", parse);
					Text.NL();
					Text.Add("It feels great, and you even feel the pending surge of ejaculation welling from her skilled handjob. You realize that your torment has just begun, however, when her supple fingers forcefully squeeze your [cocks], halting your seed’s exit.", parse);
					Text.NL();
					Text.Add("<i>“Now, who said you could cum, [playername]?”</i> she whispers in your ear. <i>“<b>I’m</b> the one that decides if and when you release, okay?”</i> You begin protesting, but she squeezes tighter, making you cry out as she torments your erect [cocks]. With a low whimper, you agree reluctantly, if only in the hopes of her taking away some pressure.", parse);
					Text.NL();
					Text.Add("She does, but only by a small margin. She continues to stroke and play with the length of your [cocks], fixating a playful, yet sadistic gaze on your face to monitor how close you are to cumming. Every time you’re about to get off, she grips and twists brutally, a cruel smile on her face as you howl in pain.", parse);
					Text.NL();
					Text.Add("As the cycle of erotic anguish repeats itself, your perception of time is clouded by the constant need to release. Despite knowing harm will come to your [cocks], you can’t help but lose yourself to the feel of her silky hands stroking you. After what feel like hours of torture, Gwendy relaxes her grip slightly, just enough for a small bead of pre to emerge, before tightening again. ", parse);
					Text.NL();
					Text.Add("This small mercy runs rampant through your body, making you melt in your seat, eager for more. You’re barely coping with the intense sensation of pain and pleasure coursing through your groin, yet you lust for more under the dominating presence of Gwendy. The need to cum is paramount, but you know that Gwendy will stop you immediately if you try to get off. Glancing meekly at Gwendy, you plead with her to let you climax. With a predatory smile, she answers:", parse);
					Text.NL();
					Text.Add("<i>“I never said I’d allow you to cum, did I? And until I do, you better not waste a drop more than I allow. Understood, [playername]?”</i> Nodding vigorously, you watch her expression soften a bit as she backs away.", parse);
					Text.NL();
					Text.Add("<i>“Good. Well, you’re free to leave now, since I’ve had my fun. Just make sure that if you do get off, it’d better be away from the farm. Who knows what might happen to you if I catch you?”</i> Despite her playful tone, you instinctively know you’d be degraded even worse than today. Getting dressed in haste, you mumble your goodbyes to Gwendy, before heading on your way, painfully aroused.", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstCock(); });
				scenes.AddEnc(function() {
					Text.Add("Gwendy chuckles in a haughty tone, as she begins to caress the slick folds surrounding your [vag]. It elicits a low moan from you and she smiles at your arousal. Slowly, she begins tease your [clit] with a stray finger as you squirm and grow wetter.", parse);
					Text.NL();
					Text.Add("It feels heavenly, and you can hardly believe that she’s going to let you get off this easily. As her digits dig into the cleft of your [vag], however, your road to orgasm is stopped when you feel a sharp pain against your [clit]. Looking down, you see Gwendy pinching it between her fingers, making you whimper pathetically.", parse);
					Text.NL();
					if(!hangout) {
						Text.Add("<i>“Ah, ah, don’t think that’s going to happen, [playername]. Remember: I won the challenge, so I can do what I want today. And today, I want to deny you your pleasure.”</i> As she speaks, she keeps an even and calm tone, though her face displays a somewhat playful malice. ", parse);
						Text.NL();
					}
					Text.Add("In addition to teasing your [clit], she dips two fingers into your dripping [vag], pumping and grinding the digits against your vaginal walls. All the time, you whimper and pant, ever close the edge of relief but always blocked off by Gwendy’s teasing.", parse);
					Text.NL();
					Text.Add("You hold on as best you can, but the teasing and denial mercifully end when Gwendy relaxes the pressure on your [clit] and eases the intensity of her frigging. You almost cum then and there, but a look at Gwendy tells you better.", parse);
					Text.NL();
					Text.Add("<i>“I’ve had fun with you, but I’ve got other things to do. Don’t let me catch you getting off here on the farm, though. While you are here, you are under my thumb, got it?”</i>", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstVag(); });

				scenes.Get();

				Text.Add("The voice is playful, but does little to mask the obvious threat she’s laid out. As best you can, you get dressed and leave in haste, not wanting to risk incurring her sexual wrath on you.", parse);

				world.TimeStep({hour: 1});
				player.AddLustFraction(0.9);
				Text.Flush();

				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Gwendy will tease you and test your sexual endurance."
		});
	}
	/*
	if(lossScene >= 3 && gwendy.FirstVag()) {
		options.push({ nameStr : "Eat her",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : "Please Gwendy with your tongue."
		});
	}
	if(lossScene >= 4) {
		options.push({ nameStr : "Bondage",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : "Time for a little BDSM... with you on the receiving end."
		});
	}
	if(lossScene >= 5 && !gwendy.FirstCock()) {
		options.push({ nameStr : "Strap-on",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : "Gwendy's itching to play with her toy again."
		});
	}
	*/
	if(hangout)
		return true;
	else if(lossScene < options.length) {
		player.subDom.DecreaseStat(-100, 3);
		gwendy.subDom.IncreaseStat(100, 5);

		options[lossScene].func();

		gwendy.flags["ChallengeLostScene"]++;

		return false;
	}
	else {
		Text.Add("<i>“Today, I'll be a kind mistress and allow my pet to choose [phisher] own humiliation,”</i> Gwendy tells you gracefully.", parse);
		return true;
	}
}
