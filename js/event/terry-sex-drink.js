
import { Scenes } from '../event';

Scenes.Terry.SexHaveADrink = function(back) {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		tbreasts : terry.FirstBreastRow().Short()
	};
	
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.Relation() < 30) {
		Text.Add("<i>“W-what are you thinking?”</i> [heshe] asks, taking a step back.", parse);
		Text.NL();
		Text.Add("There’s no reason to be timid. You were just thinking about giving [himher] a bit of oral sex. You’d have thought [heshe]’d like that...", parse);
		Text.NL();
		Text.Add("<i>“Oh. I guess I don’t really have a problem with that...”</i>", parse);
		Text.NL();
		Text.Add("[HeShe] really doesn’t trust you much, does [heshe]? Ah well, [heshe]’ll get better as you get to know [himher].", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“A taste-test? Interesting way of putting it.”</i> [HeShe] smiles knowingly. <i>“What kind of tasting are you hoping for?”</i>", parse);
		Text.NL();
		Text.Add("The intimate sort, of course. What else could you want with someone as yummy as Terry hanging around all the time?", parse);
		Text.NL();
		Text.Add("<i>“Hmm, I don’t know. But from what I figure, there’s a lot more you could want.”</i>", parse);
		Text.NL();
		Text.Add("That there is. But right now, what you want is to suck Terry dry. From the look on your [foxvixen]’s face - and the way [heshe]’s wagging [hisher] tail so hard it’s about to fall off - you don’t think [heshe] has a problem with that.", parse);
	}
	else {
		Text.Add("<i>“I’m the one wearing the collar, yet you’re the one that gets a treat? Something doesn’t seem fair in this relationship,”</i> [heshe] teases.", parse);
		Text.NL();
		Text.Add("Oh, like [heshe]’s not going to enjoy every moment of you sucking [himher] dry. Maybe if [heshe] has a nice big drink for you, you’ll consider letting [himher] have a taste of you afterward.", parse);
		Text.NL();
		Text.Add("<i>“Okay, that’s something to keep in mind.”</i> [HeShe] smirks. <i>“So, I guess I’m the master and you’re the pet for now?”</i>", parse);
		Text.NL();
		Text.Add("Well, yeah, you could say that.", parse);
		Text.NL();
		Text.Add("<i>“Great, get naked then! Pets don’t need clothes. Besides, you’d only get them dirty, ya big pervert.”</i>", parse);
		Text.NL();
		Text.Add("Oh, <b>you</b> are the pervert here? Cheeky little [foxvixen]... No, you think you’ll stay clothed. For the moment.", parse);
	}
	Text.NL();
	Text.Add("With Terry’s agreement, you start eyeing over the [foxvixen]’s naked form as you consider what’ll you’ll do with your pet.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 10});
	
	//[Breasts] [Pussy] [Cock]
	var options = new Array();
	options.push({ nameStr : "Breasts",
		tooltip : Text.Parse("Those yummy [tbreasts] and their sweet milk are calling to you.", parse),
		func : Scenes.Terry.SexHaveADrinkBreasts, enabled : terry.Lactation()
	});
	if(terry.FirstCock()) {
		options.push({ nameStr : "Cock",
			tooltip : "What better treat than a shot of hot, gooey fox-cum?",
			func : Scenes.Terry.SexHaveADrinkCock, enabled : true
		});
	}
	if(terry.FirstVag()) {
		options.push({ nameStr : "Pussy",
			tooltip : Text.Parse("Sweet, sweet womanly nectar sounds just perfect for you.", parse),
			func : Scenes.Terry.SexHaveADrinkPussy, enabled : true
		});
	}

	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("You tell Terry that you’ve changed your mind; you want to do something else.", parse);
		Text.NL();
		if(terry.Relation() < 30) {
			Text.Add("<i>“Oh… okay then.”</i>", parse);
			Text.NL();
			Text.Add("Idly eyeing the attractive [foxvixen], you contemplate just how you want to play with [himher].", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("<i>“Aww, you’re going to pussy out on me?”</i> Terry asks teasingly.", parse);
			Text.NL();
			Text.Add("No, of course not. You’re just not thirsty - you still want to show [himher] a good time. Just need to decide what you want to do first.", parse);
		}
		else {
			Text.Add("<i>“And why is that? Too much for you to handle?”</i> Terry teases, posing for your benefit.", parse);
			Text.NL();
			Text.Add("Oh, if you were thirsty, you promise you’d be all over [himher]! Right now, you’re just not in that sort of mood. You’re just going to have to rock [hisher] world a different way.", parse);
		}
		Text.Flush();
		
		Scenes.Terry.SexPromptChoice(back, true);
	});
}

Scenes.Terry.SexHaveADrinkPussy = function() {
	var parse = {
		playername : player.name,
		foxvixen : terry.mfPronoun("fox", "vixen"),
		foxxyvixxy : terry.mfPronoun("foxxy", "vixxy"),
		handsomebeautiful : terry.mfPronoun("handsome", "beautiful"),
		boygirl : terry.mfPronoun("boy", "girl"),
		mastermistress : player.mfTrue("master", "mistress"),
		sir : player.mfTrue("sir", "ma’am"),
		sirmadam : player.mfTrue("sir", "madam"),
		guygal : terry.mfPronoun("guy", "gal")
	};
	
	parse["stuttername"] = player.name[0] + "-" + player.name;
	
	parse = terry.ParserPronouns(parse);
	parse = terry.ParserTags(parse, "t");
	parse = player.ParserTags(parse);
	
	var rel = terry.Relation() + terry.Slut();
	
	Text.Clear();
	parse["c"] = terry.FirstCock() ? Text.Parse(", behind [hisher] cock", parse) : "";
	Text.Add("Your gaze falls on Terry’s thighs, and the tasty flower tucked away between them[c]. Yes, you know just what you want to drink from… but first, you need to get [himher] in the proper mood to feed you.", parse);
	Text.NL();
	Text.Add("You smile to yourself and advance on the [foxvixen], who looks at you ", parse);
	if(terry.Relation() < 30)
		Text.Add("nervously.", parse);
	else if(terry.Relation() < 60)
		Text.Add("inquisitively.", parse);
	else
		Text.Add("expectantly.", parse);
	parse["rel"] = terry.Relation() >= 30 ? Text.Parse(", the way you know [heshe] likes it", parse) : "";
	Text.Add(" Stopping at arm’s length, you reach out and tenderly caress [hisher] cheek, drawing your fingers along [hisher] dainty features before moving to stroke [hisher] hair. You admire the way it parts around your digits like silk, then scratch [himher] at the base of [hisher] ear[rel].", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("<i>“Any particular reason for the petting? Not that I’m complaining...”</i>", parse);
		Text.NL();
		Text.Add("Since [heshe]’s asked; yes, there’s a reason, but you doubt [heshe]’ll complain once [heshe] figures out your plan.", parse);
		Text.NL();
		Text.Add("<i>“Okay, I’m curious now.”</i>", parse);
		Text.NL();
		Text.Add("Well, you’re not going to give it away and spoil things for [himher], but you know [heshe]’s going to enjoy it.", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Hmm, this feels nice...”</i>", parse);
		Text.NL();
		Text.Add("You aim to please. A pretty little thing like Terry deserves a little pampering now and then, but you’re only just getting started...", parse);
		Text.NL();
		Text.Add("<i>“Can’t wait to see the rest.”</i> [HeShe] grins.", parse);
	}
	else {
		Text.Add("<i>“I must praise your knowledge of my sweet spots, [playername], but if you’re being so attentive, then this must mean you want something,”</i> [heshe] says, giving you a knowing smirk.", parse);
		Text.NL();
		Text.Add("Maybe... or maybe you just wanted to pet the [foxvixen]. Either way, does it really matter?", parse);
		Text.NL();
		Text.Add("<i>“Of course it matters. A pervert like you touching me all over… It’s enough to worry any [guygal].”</i>", parse);
		Text.NL();
		Text.Add("Oh, is that so? Well, then you guess you’d better stop petting [himher] - if [heshe]’s so worried.", parse);
		Text.NL();
		Text.Add("<i>“Even if you did keep your hands away, I have a feeling that’s not really going to keep you away from your prize...”</i>", parse);
		Text.NL();
		Text.Add("Cheerfully, you confess that Terry’s probably right, but you don’t think you’re the only one who’s going to enjoy what you have planned.", parse);
	}
	Text.NL();
	Text.Add("Still idly brushing Terry’s flowing locks, you nimbly circle the [foxvixen] and sweep [himher] into a tender embrace. ", parse);
	if(terry.Relation() < 30)
		Text.Add("[HeShe] wriggles in your arms instinctively, clearly not too comfortable with being held too close, but doesn’t try to fight you off.", parse);
	else
		Text.Add("[HeShe] leans back into your embrace, content to let you hug [himher] as you please.", parse);
	Text.NL();
	Text.Add("The [foxvixen]’s ears twitch, catching your eye. You can’t resist the urge to lean forward and tenderly kiss the closest one. It flicks against your nose, making you laugh softly and enticing you to give it another peck.", parse);
	Text.NL();
	Text.Add("You place a deeper kiss on the back of Terry’s neck, freeing one hand to stroke the long, soft fluffiness of [hisher] luxuriant tail as it bats against your [hips].", parse);
	Text.NL();
	Text.Add("Terry coos in pleasure, relishing in the attention. [HeShe] pushes back to grind against you as you continue your skillful ministrations.", parse);
	Text.NL();
	parse["b"] = terry.Cup() >= Terry.Breasts.Acup ? Text.Parse(" and [hisher] breasts", parse) : "";
	Text.Add("You smile to yourself at the [foxvixen]’s pleasure. It’s a good start, but [heshe] still needs a little more work yet. With the thought solidified in your mind, you raise your hand toward [hisher] chest[b].", parse);
	Text.NL();
	if(terry.Cup() < Terry.Breasts.Acup)
		Text.Add("The [foxvixen]’s girlishly flat chest has nothing to really play with... except, of course, for [hisher] perky little nipples. Drawn to them like iron filings to a magnet, you start to caress the closest nub. Your fingers stroke tender circles around [hisher] areolae, brushing [hisher] nipple until it starts to swell. Once it has proudly risen up, you gently pinch it between forefinger and thumb.", parse);
	else if(terry.Cup() < Terry.Breasts.Bcup)
		Text.Add("Terry’s dainty little A-cups are just big enough that you can savor their softness against your fingertips as you caress them. You run your fingers through the silken fur to brush the sensitive skin beneath before spiraling inexorably toward [hisher] dainty nipples. You can feel [himher] hardening under your touch, each nub rising as you lavish it tenderly.", parse);
	else if(terry.Cup() < Terry.Breasts.Ccup)
		Text.Add("The perky B-cup is just the right size to fit into the palm of your hand. Soft fur over soft flesh squishes in your grip as you affectionately caress the [foxvixen]’s boob, alternatively running your fingers back and forth across its suppleness and kneading it between your fingers.", parse);
	else if(terry.Cup() < Terry.Breasts.Dcup)
		Text.Add("Terry’s proud C-cup is just begging for you to grope it, squishing wonderfully as you knead and caress it. You can feel the heavy fullness of Terry’s breast in your grip as you attempt to palm the pillowy orb.", parse);
	else
		Text.Add("The [foxvixen]’s over-inflated tits are far too big to encompass with just one hand... but that doesn’t mean you can’t enjoy yourself trying. Your fingers sink into supple boobflesh as you tenderly squeeze it, kneading the luscious breast as best you can.", parse);
	Text.NL();
	Text.Add("Terry arches [hisher] back, moaning profusely at your ministrations. That’s a good [boygirl]; now, let’s see how close [heshe] is to being ready...", parse);
	Text.NL();
	
	var womb = terry.PregHandler().Womb();
	var preg = womb && womb.pregnant;
	var stage = womb && womb.progress;
	
	Text.Add("Leaving Terry’s tail alone, you reach around to [hisher] belly. ", parse);
	
	if(preg) {
		Text.Add("Naturally, you can’t resist tending to your vulpine lover’s gravid womb first. ", parse);
		if(stage > 0.75) {
			parse["poppamomma"] = terry.mfPronoun("poppa", "momma");
			Text.Add("Terry moans appreciatively as you stroke [hisher] distended navel, teasing the sensitive bulb of flesh. [HisHer] bulging stomach ripples as the child kicks excitedly in Terry’s womb, evidently enjoying the attention as much as [poppamomma] Terry is. You give [himher] a gentle pat, and then guide your hand further down, trailing around the pronounced swell.", parse);
		}
		else if(stage > 0.5) {
			Text.Add("Terry groans leisurely as your hand sweeps across [hisher] bloated middle, which is swollen like a ripe fruit. You cup [himher] under the navel, rubbing soft circles as you appreciate the feel of [himher], so heavy with the life you helped to make. A smile crosses your lips as you feel the faintest flutter from the baby inside, and you pet where you felt it moving before sweeping your hand lower still.", parse);
		}
		else {
			Text.Add("The pregnant [foxvixen]’s belly is palpably swollen under your palm as you caress it. You spend a moment savoring the warmth of [hisher] burgeoning womb before sweeping down [hisher] body.", parse);
		}
	}
	else
		Text.Add("You stop to give [himher] a playful tummy-rub that draws a girlish giggle from the [foxvixen]’s lips, and then continue on your way, guiding your hand down toward [hisher] girlish thighs.", parse);
	Text.NL();
	if(terry.FirstCock()) {
		parse["hc"] = terry.HorseCock() ? " massive" : "";
		Text.Add("You can feel the[hc] hardness of [hisher] [tcock] jutting from its sheath. Playfully, you brush against its [tcockTip], feeling the faintest smear of pre-cum on your [skin].  However, you have a different target in mind, and so you move downward.", parse);
		Text.NL();
		Text.Add("[HeShe] moans as your fingers brush against the tender skin of [hisher] balls, instinctively spreading [hisher] legs to give you better access to your real target.", parse);
	}
	else {
		Text.Add("When your fingers brush against the [foxvixen]’s silky thighs, [heshe] moans softly and obediently spreads [hisher] legs, letting you have access to the treasure hidden between them.", parse);
	}
	Text.NL();
	Text.Add("You can feel Terry shudder as you stroke [hisher] plush netherlips, carefully running a digit along [hisher] labia. Delicately, you insert just the barest tip of your finger inside of [himher]; ", parse);
	if(terry.PussyVirgin())
		Text.Add("this isn’t how you want to break [hisher] hymen, after all.", parse);
	else
		Text.Add("you don’t want to get [himher] off just yet.", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("Terry moans in barely contained lust. <i>“S-so, this is what you were after?”</i>", parse);
		Text.NL();
		Text.Add("Yes, it is. Does [heshe] want you to stop?", parse);
		Text.NL();
		Text.Add("<i>“Hmm… no. I don’t mind,”</i> [heshe] says, smiling softly. <i>“As long as you’re not rough,”</i> [heshe] adds.", parse);
		Text.NL();
		Text.Add("You assure [himher] that you’ll be gentle, even as you delicately continue to stroke the [foxvixen] inside and out. Affectionately, you ask [himher] how that feels.", parse);
		Text.NL();
		Text.Add("<i>“Mhm, it feels good.”</i>", parse);
		Text.NL();
		Text.Add("You croon your approval, especially as you feel the dampness starting to slicken your fingers. [HeShe] feels just about ready for you. All that you need is to get [himher] into the proper position...", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("Terry cries out as you stroke [hisher] labia. <i>“So this is where you were trying to get at?”</i>", parse);
		Text.NL();
		Text.Add("You hum in wordless agreement, nodding softly as you continue playing with [hisher] womanhood.", parse);
		Text.NL();
		Text.Add("<i>“Well, as long as you make me feel good, I got no complaints.”</i>", parse);
		Text.NL();
		Text.Add("Oh, you’re going to rock [hisher] world, you assure [himher] of that.", parse);
		Text.NL();
		Text.Add("<i>“I’ll hold you to that promise, so you’d better start putting some real effort behind your ministrations, my perverted [mastermistress].”</i>", parse);
		Text.NL();
		Text.Add("You’ll put some real effort in alright, but you have something other than fingering in mind for [himher]...", parse);
	}
	else {
		Text.Add("<i>“Ahn!”</i> [HeShe] cries out cutely as you dip your digits into [hisher] vulnerable treasure. <i>“I knew it! You pervert!”</i> [heshe] calls you out accusingly.", parse);
		Text.NL();
		Text.Add("The secret is out! However did [heshe] figure you out?", parse);
		Text.NL();
		Text.Add("<i>“A [foxvixen] always knows.”</i> [HeShe] giggles.", parse);
		Text.NL();
		Text.Add("Maybe so, but it didn’t save [himher] from falling into your trap, did it? Now you can do whatever you want to [himher]...", parse);
		Text.NL();
		Text.Add("<i>“Damn it! I guess you got me this time, perv!”</i> [HeShe] smirks.", parse);
		Text.NL();
		Text.Add("You make a final twist inside of [hisher] pussy, and then deliberately lap the smears of feminine nectar from your fingers, audibly savoring this appetizer. With an approving purr, you compliment Terry on [hisher] fine taste.", parse);
		Text.NL();
		Text.Add("<i>“You sneaky bastard, so <b>that</b> is what you’re really after...”</i> [heshe] says, catching on to your real goal.", parse);
		Text.NL();
		Text.Add("You just smile, and place a proud kiss on [hisher] dainty cheek. Such a clever little [foxvixen]; you knew [heshe] was so smart, but that’s why you fell in love with [himher]. With your free hand, you grope at [hisher] chest, pinching a nipple for emphasis. As Terry gasps, wriggling in your grip, you seize your moment to pounce; you’ve had the appetizer, now for the main course...", parse);
	}
	Text.NL();
	Text.Add("You tell Terry to get down on fours, giving [hisher] back a little push to get [himher] going.", parse);
	Text.NL();
	parse["b"] = terry.Relation() >= 30 ? "doesn't hesitate" : "barely hesitates";
	Text.Add("The [foxvixen] [b] as [heshe] falls onto [hisher] hands and knees.", parse);
	Text.NL();
	parse["lb"] = player.Humanoid() ? "" : ", as best you can given your frame";
	Text.Add("That’s a good [foxxyvixxy]. You gently pet [hisher] back in approval, then kneel down behind [himher][lb]. Once settled, you eagerly cup Terry’s perky ass cheeks and savor the feeling of squishing them softly between your fingers.", parse);
	Text.NL();
	Text.Add("Terry gasps, shuddering for a moment as you fondle [hisher] butt.", parse);
	Text.NL();
	
	if(rel < 45) {
		Text.Add("<i>“Hey! Not so rough,”</i> [heshe] protests.", parse);
		Text.NL();
		Text.Add("Sorry, you got overexcited. [HisHer] ass is just so lovely that you had to play with it a little before you got down to the real fun.", parse);
		Text.NL();
		Text.Add("<i>“R-right. I don’t really mind, just… be a bit more careful, okay?”</i>", parse);
		Text.NL();
		Text.Add("Chuckling softly, you give Terry’s butt a tender pet, assuring [himher] that you’ll be careful.", parse);
	}
	else {
		Text.Add("<i>“Teasing is fine, [playername], but try not to keep me waiting,”</i> [heshe] says, grinding [hisher] cute tush against your palms.", parse);
		Text.NL();
		Text.Add("You can’t hold back a chuckle. Such an impatient [foxvixen]! No worries; you know [heshe]’s all wet and ready for you. This was just a last little bit of play before you showed [himher] the real fun.", parse);
		Text.NL();
		Text.Add("<i>“Riiiiight. If you keep fooling around too much, I might just have to go back there. And you wouldn’t want that, would you?”</i> [HeShe] grins.", parse);
		Text.NL();
		Text.Add("Oh, no, you wouldn’t want that at all, you chuckle.", parse);
	}
	Text.NL();
	Text.Add("You brush Terry’s tail out of the way and drink in the sight of [hisher] lovely rear-end, presented so enticingly below you. Beneath the round, perky cheeks of [hisher] juicy butt lies a delicate pussy, shimmering slightly with the glaze of lube you’ve already managed to draw from [himher].", parse);
	if(terry.FirstCock())
		Text.Add(" Past [hisher] womanhood, [hisher] balls dangle in the breeze, [hisher] [tcock] already fully out of [hisher] sheath, pressing against [hisher] belly in [hisher] arousal.", parse);
	Text.NL();
	Text.Add("You could just dive on in and drink to your heart’s content... but, maybe you should also keep playing with [himher] as you do? Nothing says you can’t do two things at once, after all...", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	player.AddLustFraction(0.25);
	
	//[LickNtease] [LickNass] [LickNdick]
	var options = new Array();
	options.push({ nameStr : "LickNtease",
		tooltip : "As much as you’d like to get on with your business, you can’t just ignore Terry’s birthmark...",
		func : function() {
			Text.Clear();
			parse["noseSnout"] = player.HasMuzzle() ? "snout" : "nose";
			Text.Add("As Terry sways slightly, [hisher] beautiful birthmark stands out in the corner of your eye. It is a beautiful gold shimmering against the creamy white that encompasses the rest of [hisher] glorious butt. Hungrily licking your lips, you lean closer and plant a wet, juicy kiss squarely in its center, [noseSnout] shamelessly buried in Terry’s ass from your efforts.", parse);
			Text.NL();
			Text.Add("<i>“Ahn! Hey! That’s my birthmark!”</i> [heshe] exclaims. <i>“You know how I feel about it...”</i>", parse);
			Text.NL();
			Text.Add("Oh, you know, but... it’s just so cute. It’s such a rich, beautiful gold, and it’s so clearly shaped! It’s just one of the cutest marks you’ve ever seen on such a pretty [foxxyvixxy]. As you speak, your finger traces the rim of the mark, a playful stroke that emphasizes your words.", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("<i>“Flattery doesn’t make you any less of a jerk...”</i> [heshe] trails off.", parse);
				Text.NL();
				Text.Add("And yet, despite [hisher] words, you can see [hisher] tail wagging softly. With a soft chuckle, you comment that you think Terry actually likes it when you’re a bit of a jerk, before sweetly kissing [himher] right on the mark again.", parse);
				Text.NL();
				Text.Add("Terry looks back at you with a pout, but remains silent.", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“I thought we agreed you wouldn’t tease me like that!”</i>", parse);
				Text.NL();
				Text.Add("You don’t recall agreeing to anything, especially when [hisher] mark is so cute!", parse);
				Text.NL();
				Text.Add("<i>“...Sometimes you can be such a jerk, [playername].”</i> [HeShe] sighs, pouting.", parse);
				Text.NL();
				Text.Add("Maybe so, but [heshe] likes you that way, doesn’t [heshe]?", parse);
				Text.NL();
				Text.Add("Terry doesn’t dignify you with an answer - not verbally, anyway. [HisHer] long, fluffy tail wags gently, giving you all the reply you need.", parse);
			}
			else {
				Text.Add("<i>“[playername], as much as I love you, there are times I just want to smack you. You’re such a brat sometimes,”</i> [heshe] adds, teasingly.", parse);
				Text.NL();
				Text.Add("<b>You</b> are a brat? Who’s the one getting all worked up over a sexy little tramp-stamp, hmm?", parse);
				Text.NL();
				Text.Add("<i>“Of course I get worked up! You can’t seem to leave it alone!”</i> [heshe] protests, pouting.", parse);
				Text.NL();
				Text.Add("Well, it’s not your fault that it’s so irresistible. You make a show of kneading the soft fur with its distinctive patterning for emphasis, quipping that [heshe]’s just so adorable when [heshe] gets all pouty like this.", parse);
				Text.NL();
				Text.Add("<i>“...Jerk.”</i> [HeShe] sighs. <i>“Flattery doesn’t help your case, you know?”</i>", parse);
				Text.NL();
				Text.Add("Oh, come on. You know that [heshe]’s a sucker for flattery. Your pretty little [foxvixen] just loves being told how sexy [heshe] is, doesn’t [heshe]? Not that you mind; you love telling [himher] about what a sexy thing [heshe] is. This glorious ass, those sweet, girlish features, long lovely red hair; [heshe]’s just such a beautiful sight. And you get to have [himher] all to yourself; you’re so lucky.", parse);
				Text.NL();
				Text.Add("Terry’s pout quickly turns into a smile, and [hisher] tail begins wagging slightly at your words. <i>“You make it really hard to be mad at you, [playername], but you’re still a jerk for teasing my mark,”</i> [heshe] adds jokingly.", parse);
				Text.NL();
				Text.Add("Well, you’ll just have to make it up to [himher] some more. You have just the apology in mind...", parse);
				Text.NL();
				Text.Add("<i>“Reaaaally?”</i>", parse);
				Text.NL();
				Text.Add("You chuckle softly in response. No fun giving it away first, but you know [heshe]’ll love it.", parse);
			}
			Text.NL();
			Text.Add("Idly stroking the [foxvixen]’s bouncy butt with its all-natural tramp-stamp, your gaze sinks lower still, making you lick your lips at the sight of the glistening treasure there.", parse);
			Text.NL();
			parse["b"] = terry.HasBalls() ? Text.Parse(", just above [hisher] swaying balls", parse) : "";
			Text.Add("Leaning in, you extend your [tongue] and carefully guide its [tongueTip] to the very bottom of [hisher] flower[b]. You draw the length of your tongue upwards in a wet, slurping lick, ensuring both lips get the full treatment as you glaze their length with spittle.", parse);
			Text.NL();
			Text.Add("Terry groans softly, [hisher] pussy fluttering as [heshe] instinctively attempts to draw you deeper inside. Unwilling to give your tongue to [himher] so early on, you wriggle it free of [hisher] clutch. Slowly and methodically, you continue lapping at [hisher] womanhood, pressing just a little deeper each time. Through it all, you savor the spicy, sweet taste of [hisher] juices as they coat your tongue and help you polish [himher] to a glistening sheen.", parse);
			Text.NL();
			Text.Add("As Terry mewls and wriggles, you change your tactics and start carefully probing [hisher] depths with your [tongueTip], as opposed to simply making out with [hisher] netherlips. ", parse);
			if(terry.PussyVirgin()) {
				Text.Add("In your efforts, you can feel the barrier of [hisher] hymen barring you from getting too deep. Unwilling to burst it in this manner, you content yourself with tickling the sensitive membrane with your tongue, making up for Terry’s shallowness with your ability to control your ministrations more readily.", parse);
			}
			else {
				Text.Add("Terry’s womanhood opens up around your intruder, the mewling [foxvixen] drawing you inside as deeply as [heshe] can", parse);
				if(player.LongTongue())
					Text.Add(" - which is quite a way. You keep probing deeper and deeper inside of [himher], until you’re certain that you’re bumping your [tongueTip] against [hisher] cervix.", parse);
				else
					Text.Add(".", parse);
				Text.NL();
				Text.Add("Eager to oblige, you thrust your tongue in and out, plumbing [himher] in the best imitation of a thrusting cock that you can give. As you plunge, you wriggle your tongue, allowing you to caress [hisher] inner walls in a manner few cocks could hope to replicate.", parse);
			}
			Text.NL();
			Text.Add("Tongue dripping with Terry’s juices, you pull free of [hisher] nethers with a wet slurp. Feeling mischievous, you lay the sloppiest kiss you can muster on [hisher] birthmark, painting the golden heart with the mixture of saliva and female lube. To keep [himher] from getting lonely while your tongue is occupied, your fingers seek out [hisher] petals, gently stirring through them before closing expertly on [hisher] clitoris in a playful pinch.", parse);
			Text.NL();
			Text.Add("<i>“Yahn!”</i> [heshe] yelps. <i>“S-stop tea- ah!”</i>", parse);
			Text.NL();
			Text.Add("You cut [himher] off in mid-protest as you change over again. Your fingers lovingly trace the birth-mark on [hisher] butt cheeks as your lips close on [hisher] clitoris. ", parse);
			if(terry.FirstCock())
				Text.Add("As [hisher] churning balls bump against your chin, you", parse);
			else
				Text.Add("You", parse);
			Text.Add(" nibble delicately at the [foxvixen]’s pleasure-buzzer with your teeth. You graze it just hard enough that [heshe] can feel it, then soothe it with teasing flicks of your tongue.", parse);
			Text.NL();
			Text.Add("<i>“I’m getting close!”</i>", parse);
			Text.NL();
			Text.Add("A thrill runs through you, and you change tack. Your mouth moves up, passionately making out with Terry’s netherlips, suckling and lapping. With your free hand, you resume playing with [hisher] clitoris, tweaking it expertly between your fingertips. Your thirst for [hisher] nectar is overwhelming, driving you to push [himher] over the edge.", parse);
			Text.NL();
			
			var cum = terry.OrgasmCum();
			
			Text.Add("Terry’s whole body shakes and [heshe] virtually howls in ecstasy as climax washes through [himher]. A flood of feminine honey pours into your mouth and you avidly gulp it down, swallowing mouthful after mouthful as excess runs down your chin. [HisHer] spicy-sweet flavor caresses your tongue and sets your stomach afire, making you thirst for more and more.", parse);
			Text.NL();
			Text.Add("You bury your face as deeply into Terry’s cunt as you can, intent on lapping up every last drop of [hisher] delicious juices. Instinctively, you hug [himher] closer to try and minimize the spillage.", parse);
			if(terry.FirstCock())
				Text.Add(" Underneath you, [hisher] neglected [tcock] erupts, spattering cum across the ground beneath [hisher] belly.", parse);
			Text.NL();
			Text.Add("Even as Terry’s cries dwindle to a soft, contented mewl, the tidal wave of climax gone and leaving just the lingering backwash of afterglow, you continue lapping, ensuring that not a single drop remains. Only when you have licked [himher] clean do you pull away, licking your own lips bare as you do.", parse);
			Text.NL();
			Text.Add("Terry wobbles softly, so weak from [hisher] climax that [heshe] can barely hold [himher]self upright anymore. Shifting around slightly for a better grip, you tenderly fold [himher] in your arms and guide [himher] down to the ground. Once [heshe] is settled, you lie down beside [himher], spooning yourself against [hisher] back.", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("<i>“T-that was...”</i> [heshe] trails off. Apparently, [heshe] still hasn’t quite caught [hisher] breath.", parse);
				Text.NL();
				Text.Add("Incredible? Well, [heshe] certainly tasted incredible, too.", parse);
				Text.NL();
				Text.Add("The [foxvixen] chuckles softly. <i>“Thanks.”</i>", parse);
				Text.NL();
				Text.Add("Any time.", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“So, how was it?”</i> Terry asks, still panting.", parse);
				Text.NL();
				Text.Add("Delicious. [HeShe] has some of the yummiest honey you’ve ever been lucky enough to sample.", parse);
				Text.NL();
				Text.Add("<i>“What can I say? I aim to please.”</i> [HeShe] smiles.", parse);
				Text.NL();
				Text.Add("Well, [heshe] certainly hit the bullseye this time.", parse);
			}
			else {
				Text.Add("<i>“That was nice, but I think you missed a spot,”</i> [heshe] teases.", parse);
				Text.NL();
				Text.Add("Really? Oh, yes! You see it now.", parse);
				Text.NL();
				Text.Add("With a wicked grin, you lean over and plant a warm, tender kiss right on Terry’s girlish lips. [HeShe] murmurs softly in approval, kissing you back hungrily before you break liplock. You teasingly lick your lips before you declare that you got it.", parse);
				Text.NL();
				Text.Add("<i>“It wasn’t quite the spot I was thinking about, but you get bonus points for a job well done either way.”</i>", parse);
				Text.NL();
				Text.Add("It was the least you could do, after [heshe] gave you such a lovely treat.", parse);
			}
			Text.NL();
			Text.Add("That said, you wrap your arms around the [foxvixen] and draw [himher] in close, holding [himher] tenderly and listening to [hisher] breathing. You both allow yourselves to drift off, the smell of sex still lingering in your nose.", parse);
			Text.Flush();
			
			world.TimeStep({minute: 30});
			
			Gui.NextPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "LickNass",
		tooltip : Text.Parse("If you’re going to be so close to [hisher] ass, you might as well enjoy it as you have your drink...", parse),
		func : function() {
			Text.Clear();
			Text.Add("Your eyes are drawn inexorably to the golden heart stamped so brazenly on Terry’s buttocks. For a moment, you consider teasing [himher] by messing with [hisher] heart stamp, but ultimately you decide to give the poor [foxvixen] a break. As cute as [heshe] is when [heshe]’s embarrassed, you think you’d like to go for another target this time...", parse);
			Text.NL();
			Text.Add("You wrap your fingers around the [foxvixen]’s luscious butt cheeks and squeeze. Terry’s bubble-butt is just enough to give you a proper handful as you fondle [himher], and the gasps and moans that accompany every delicious squeeze is enough to make you smile.", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("<i>“Don’t play with my butt so much! It’s embarrassing...”</i> [heshe] protests.", parse);
				Text.NL();
				Text.Add("Aw, there’s no need to be embarrassed! How can you not play with something so cute?", parse);
				Text.NL();
				Text.Add("<i>“W-weren’t you supposed to do something <b>other</b> than playing with my butt?”</i> [heshe] protests.", parse);
				Text.NL();
				Text.Add("Oh, that’s right, so you were. You just got a little distracted; thanks for the reminder.", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“Enjoying yourself back there?”</i> [heshe] asks teasingly.", parse);
				Text.NL();
				Text.Add("Oh, yes, you most certainly are. The view from back here is spectacular.", parse);
				Text.NL();
				Text.Add("Terry chuckles. <i>“Enjoying the view is fine and dandy, but that doesn’t do much for me.”</i>", parse);
				Text.NL();
				Text.Add("Maybe not, but it does get [himher] in the mood to properly appreciate what’s next.", parse);
			}
			else {
				Text.Add("<i>“Much as I love the attention, aren’t you getting a bit carried away, ya big perv?”</i> [heshe] asks teasingly.", parse);
				Text.NL();
				Text.Add("Well... maybe just a little, but it’d be wrong to not appreciate one of [hisher] finest features while you’re back here.", parse);
				Text.NL();
				Text.Add("Terry chuckles softly. <i>“No need to flatter me anymore, silly. I already got my pants down,”</i> [heshe] teases.", parse);
				Text.NL();
				Text.Add("Yes, [heshe] does. Now, if only you could talk [himher] into keeping them off all the time...", parse);
				Text.NL();
				Text.Add("<i>“I would, but wouldn’t that distract you from your adventuring?”</i>", parse);
				Text.NL();
				Text.Add("Maybe a little, but think of the morale boost!", parse);
				Text.NL();
				Text.Add("The [foxvixen] laughs at your reply. <i>“Alright, I’ll consider it, but what are you going to do about <b>my</b> morale boost?”</i>", parse);
				Text.NL();
				Text.Add("Why, you’re going to do this!", parse);
			}
			Text.NL();
			Text.Add("With a final squeeze for luck, you lean in closer to Terry’s feminine flower and extend your tongue, leisurely dragging just the [tongueTip] through [hisher] petals. Eyes half-closed, you savor the hints of [hisher] nectar as they dance across your taste buds.", parse);
			Text.NL();
			Text.Add("You roll your tongue back inside, audibly swallowing as you savor the flavor. Teasingly, you smack your lips before licking [himher] again. Each stroke is slow and deliberate, only just penetrating Terry’s depths. After all, ", parse);
			if(terry.PussyVirgin())
				Text.Add("you don’t want to pop [hisher] precious cherry so casually.", parse);
			else
				Text.Add("it’s more fun this way.", parse);
			Text.NL();
			Text.Add("Terry’s soft moans ring in your [ears] as you lap teasingly at [hisher] womanhood, a perfect backdrop to spur your efforts on. Your tongue works its way further down, allowing you to cautiously ease it into the hood where Terry’s clitoris hides.", parse);
			Text.NL();
			Text.Add("A sharp inhalation greets you as you tickle the [foxvixen]’s pleasure buzzer, and you eagerly start licking it. Your tongue delicately flicks Terry’s clit, rubbing it with your [tongueTip] until it has swollen with the [foxvixen]’s arousal and peeks demurely from its hood. Bending closer, you softly kiss Terry’s button, nibbling it carefully with your teeth.", parse);
			Text.NL();
			Text.Add("Terry gasps sharply, mewling as [heshe] wriggles instinctively from your touch. In the privacy of your head, you smile, continuing to nip and suckle the [foxvixen]’s clit as your hands adjust themselves.", parse);
			Text.NL();
			Text.Add("Slowly and tenderly, you spread Terry’s folds apart with your thumbs, releasing [hisher] button to lay a broad, wet, slurping lick across [hisher] cunt. Terry’s honey is flowing strong and thick now, making your head reel as it washes across your [tongue]. Compelled by a hunger that wells up inside you, you lick [himher] again, and again. With each stroke, you slowly lap your way up [hisher] slit.", parse);
			Text.NL();
			Text.Add("<i>“Ahn! Yes! This feels great!”</i>", parse);
			Text.NL();
			Text.Add("Caught up in your enthusiasm, you don’t slow your efforts even when your tongue brushes across the smooth, sensitive skin of Terry’s taint. You start to caress Terry’s slit with your thumbs, carefully trailing over [hisher] netherlips as you start painting the taint with your tongue.", parse);
			Text.NL();
			Text.Add("You lick your way steadily upwards, until you are forced to relinquish one hand from Terry’s cunt to pull apart [hisher] butt cheeks. Propelled by your desire, you lick upwards still, running your tongue around Terry’s clenched anus without qualm. The sound of your own wet slurping fills your ears as you busily coat Terry’s back passage with your fluids.", parse);
			Text.NL();
			Text.Add("<i>“Huh? [playername], what are y- ah!”</i>", parse);
			Text.NL();
			Text.Add("Before Terry can stop you, you thrust forward with your [tongueTip], plunging it as deeply into the startled [foxvixen]’s butt as you can manage. [HeShe] instinctively clamps down, squeezing your wriggling appendage in a tunnel of hot, tight flesh, but your tongue cannot be constrained. With deft wriggles and flicks, you worm your way deeper inside, teasing every nook, ridge and cranny that you can feel along the way.", parse);
			Text.NL();
			Text.Add("Terry moans in abandon as your lewd [tongue] burrows through [hisher] most shameful of tunnels, molesting [himher] in the most perverse way you can think of. ", parse);
			if(terry.FirstCock()) {
				if(player.LongTongue()) {
					Text.Add("Your probing finds the herm [foxvixen]’s prostate, ", parse);
					if(terry.HorseCock())
						Text.Add("totally bloated with the fluids to aid [hisher] mighty balls and throbbing with need,", parse);
					else
						Text.Add("pulsing softly in [hisher] desire,", parse);
					Text.Add(" and you caress it shamelessly. Terry’s mewling is brought to a new pitch as the pleasure washes through [himher].", parse);
				}
				else {
					Text.Add("Alas, your tongue is too short to reach Terry’s prostate, but you make do as best you can regardless. You spare no effort in energetically plowing [hisher] depths, slurping and slavering as you coat [hisher] innards thoroughly in your juice.", parse);
				}
			}
			else {
				Text.Add("You slurp and lap at Terry’s ass with the same enthusiasm you showed [hisher] precious womanhood, noisily slathering [hisher] perverse tunnel and coaxing [himher] to mewl and grunt in shameless abandon at your efforts.", parse);
			}
			Text.NL();
			Text.Add("When Terry’s cries reach a delightfully high pitch, you deem your efforts enough. Though [heshe] tries to keep you locked inside, your ministrations have left [himher] so sopping wet that your tongue slips freely from the [foxvixen]’s butt.", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("<i>“T-that felt… good.”</i> [heshe] states, panting a bit.", parse);
				Text.NL();
				Text.Add("You’re glad [heshe] thinks so, but that was just the appetizer; now for the main course...", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“Haa… that felt great,”</i> [heshe] says, sighing softly. <i>“Thanks a lot, [playername]. This was a nice suprise.”</i>", parse);
				Text.NL();
				Text.Add("Chuckling softly, you assure [himher] that you’re glad [heshe] liked it, but you’re not finished yet.", parse);
			}
			else {
				Text.Add("<i>“Just my pussy wasn’t enough for you?”</i> the [foxvixen] asks, panting softly. <i>“Does your hunger know no bounds?”</i>", parse);
				Text.NL();
				Text.Add("When a banquet like Terry has been laid out for you? No, it doesn’t. You intend to gorge yourself before you’re through.", parse);
				Text.NL();
				Text.Add("<i>“Whatever am I going to do with a big perv like you...”</i> [heshe] muses, while using [hisher] fluffy tail to caress your cheeks.", parse);
				Text.NL();
				Text.Add("Hmm... love you back as much as you love [himher]?", parse);
				Text.NL();
				Text.Add("Terry laughs in response. <i>“Well, that’s a given! Now, how about you be a good lover and finish me off?”</i> [heshe] asks teasingly, shaking [hisher] butt for emphasis.", parse);
				Text.NL();
				Text.Add("With all due haste. You would never want to keep your precious [foxvixen] waiting.", parse);
			}
			Text.NL();
			parse["nose"] = player.HasMuzzle() ? "snout" : "nose";
			Text.Add("Grasping Terry’s bountiful butt cheeks with both hands again, you lower your mouth to [hisher] flower once more. Drawn instinctively to [hisher] stiff clit, you kiss it firmly, feeling the trickle of feminine honey over your [nose] as you press it to [hisher] seeping slit.", parse);
			Text.NL();
			Text.Add("As you passionately make out with Terry’s cunt, your fingers creep across [hisher] backside, inching closer to [hisher] wet, shiny ass. Releasing the clit, you start to lap at Terry’s cunny once more, moaning in counterpoint to Terry’s mewls as you soak your senses in [hisher] delicious female juices.", parse);
			Text.NL();
			Text.Add("Carefully, you press your thumb to [hisher] pucker and start to push. Lubed up as it is from your earlier efforts, Terry can’t hope to keep it out, allowing you stretch [himher] around your invading digit.", parse);
			Text.NL();
			Text.Add("[HeShe] moans sharply as you push yourself in as deep as you physically can, contrasting this invasion of one hole with your oral molestation of the other. ", parse);
			if(terry.FirstCock())
				Text.Add("You can’t hope to reach [hisher] prostate, of course, but nevermind; you’ll make do. In [hisher] present state, it certainly doesn’t matter to Terry.", parse);
			else
				Text.Add("Stimulated as [heshe] is, Terry welcomes your intrusion, walls flexing to try and pull both invaders as deep as they can.", parse);
			Text.NL();
			Text.Add("With thumb and tongue, you double-stuff Terry, working both holes in sync and with no mercy. The [foxvixen]’s cries grow louder and higher, the strain building inside of [himher] as you play [himher] like an instrument.", parse);
			Text.NL();
			
			var cum = terry.OrgasmCum();
			
			Text.Add("Inevitably, under your careful ministrations, Terry reaches [hisher] limits. With a vulpine howl of ecstasy, [heshe] cums, and you plunge your face into [hisher] thighs to drink your fill.", parse);
			if(terry.FirstCock())
				Text.Add(" Beneath you, ignored, the [foxvixen]’s [tcock] erupts, spattering its steaming seed across the ground.", parse);
			Text.NL();
			parse["juice"] = terry.mfPronoun("fox-honey", "vixen-nectar");
			Text.Add("Rich, thick, spicy-sweet [juice] floods across your tongue and you greedily guzzle it down. It tastes so good; you have to have more. You lick, suckle and slurp. Terry mewls and yips as you coax [himher] to share with you every drop [heshe] has. You gorge yourself, careless of the nectar smeared across your cheeks and dripping down your chin. All that matters to you is quenching your thirst.", parse);
			Text.NL();
			Text.Add("In the end, Terry runs dry. Even your most dexterous twists cannot coax anything more from the panting, mewling vulpine. Accepting that the feast is over, you lift your face from [hisher] pussy, thumb pulling free of [hisher] ass with an audible pop.", parse);
			Text.NL();
			Text.Add("Pushing yourself upright, you settle back on your haunches and wipe a stray smear of fluid from your face. Before you suck your fingers clean, you mischievously asked if Terry enjoyed your efforts.", parse);
			Text.NL();
			Text.Add("Terry wobbles and finally falls on [hisher] side, groaning in response.", parse);
			Text.NL();
			Text.Add("You chuckle softly. Poor little thing; [heshe]’s all worn out. You carefully lie down beside the prone [foxvixen], gently sweeping [himher] into your arms. Terry coos while you softly stroke [hisher] hair, tenderly scratching one flicking ear and cuddling [himher] like an oversized stuffed toy. ", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("<i>“Hah… t-that was...”</i>", parse);
				Text.NL();
				Text.Add("Shhh. No need to talk, now. Just get some rest. [HeShe] deserves it, sweet little thing that [heshe] is.", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“Hmm, you really know how to wear a fox down, don’t you?”</i>", parse);
				Text.NL();
				Text.Add("So it seems, you chuckle, but is [heshe] going to tell you that [heshe] didn’t enjoy every moment of it?", parse);
			}
			else {
				Text.Add("<i>“So, how was your [foxvixen]?”</i> [heshe] asks teasingly. <i>“I don’t remember ordering tongue, but it was pretty good!”</i> [HeShe] giggles.", parse);
				Text.NL();
				Text.Add("Delicious. You’ll have to try doing that again, especially if [heshe] likes it so much.", parse);
				Text.NL();
				Text.Add("<i>“Hehe, I do. Right now, I think I could use a nap,”</i> [heshe] says, yawning.", parse);
				Text.NL();
				Text.Add("Sounds good to you.", parse);
			}
			terry.relation.IncreaseStat(70, 1);
			Text.NL();
			Text.Add("With a soft sigh, you wrap your arms protectively around the tired [foxvixen], and gently rest yourself against [himher]. You allow your eyes to close, Terry’s quiet breathing lulling you to sleep alongside [himher].", parse);
			Text.Flush();
			
			world.TimeStep({minute: 30});
			
			Gui.NextPrompt();
		}, enabled : true
	});
	if(terry.FirstCock()) {
		options.push({ nameStr : "LickNdick",
			tooltip : Text.Parse("Double the genitals, double the fun. Nothing like giving [himher] a handjob to help make [himher] super-comfortable with you eating [himher] out, right?", parse),
			func : function() {
				Text.Clear();
				Text.Add("Terry’s swaying balls draw your eye, almost hypnotic in their movements as [hisher] impatiently twitching hips rock them back and forth. Beyond them, the [foxvixen]’s [tcock] thrusts itself from its sheath, an invitation that you cannot bring yourself to refuse.", parse);
				Text.NL();
				if(terry.HorseCock()) {
					Text.Add("Terry’s equine monster of a cock throbs anxiously as you wrap your fingers around it. You’ll have to be careful or [heshe]’s going to blow [hisher] top before you can properly enjoy [hisher] <i>other</i> set of equipment, too. You know that you’re up to the challenge.", parse);
					Text.NL();
					Text.Add("Like a perverse spider, you ‘walk’ your digits playfully from knotty base to blunt tip, smearing the drizzling pre-cum along the thick, flat glans with your fingertip as you trace lewd spirals across the warm flesh.", parse);
					Text.NL();
					if(rel < 50) {
						Text.Add("Terry groans in response to your ministrations, but otherwise remains silent.", parse);
					}
					else {
						Text.Add("<i>“You sure want me to stay in this position? My cock would be much easier to get at if I was sitting,”</i> [heshe] teases.", parse);
						Text.NL();
						Text.Add("No, this position is just fine; you still want that sweet pussy of [hishers], you just thought [hisher] cock would be lonely if you left it out.", parse);
						Text.NL();
						Text.Add("The [foxvixen] chuckles in response. <i>“Well, if you really want to give me handjob while you eat me out, who am I to complain?”</i>", parse);
						Text.NL();
						if(player.SubDom() >= 25) {
							Text.Add("<i>“Stroke it good, and do- yip!”</i>", parse);
							Text.NL();
							Text.Add("You tighten your grip on Terry’s stallionhood just a notch more, to make sure you have [hisher] attention. Smiling affectionately, you gently shush the [foxvixen]; silly little thing, there’s no need for words here. You know what [heshe] likes, what [heshe] <b>needs</b>.", parse);
							Text.NL();
							Text.Add("With your free hand, you slide possessively over Terry’s ass, deliberately stroking [hisher] birthmark before curling your fingers around the base of [hisher] tail. You pull it taut, tugging just hard enough that [heshe] can feel the pressure.", parse);
							Text.NL();
							Text.Add("With your other hand, you drag the very edge of your nails along the underside of [hisher] sensitive equine shaft. You trail your fingers slowly and deliberately along [hisher] veins, the stimulation making the [foxvixen] tremble in your grip.", parse);
							Text.NL();
							Text.Add("What [heshe] needs, you casually add, is to be milked dry. You’re going to take your pet and wring every last drop of cream and honey from [hisher] loins - and [heshe]’s going to love you for it.", parse);
							Text.NL();
							Text.Add("Terry swallows audibly. From your position, you can see [hisher] pussy moistening ever so slightly; [hisher] cock throbs in your hand, new dollops of pre already forming on the tip as your words sink in.", parse);
							Text.NL();
							Text.Add("<i>“Y-yes, [sir]... [mastermistress],”</i> [heshe] says, almost on instinct.", parse);
							Text.NL();
							Text.Add("Good [boygirl].", parse);
							
							terry.slut.IncreaseStat(50, 1);
						}
						else if(player.SubDom() <= -25) {
							Text.Add("<i>“Make sure you stroke it good,”</i> [heshe] adds.", parse);
							Text.NL();
							Text.Add("Oh, of course! Right away!", parse);
							Text.NL();
							Text.Add("Avidly, you start to pump away at Terry’s mighty equine shaft with both hands, working your fingers with each pass back and forth. Your lovely [foxvixen] deserves only the best that you can give [himher]. You call up every trick that you can think of, feeling for the slightest ridges and bumps that will let you truly drive [himher] wild.", parse);
							Text.NL();
							Text.Add("<i>“Hmm, yeah… just like that… how about you use your tongue next?”</i>", parse);
							Text.NL();
							Text.Add("Falling to all fours, you crawl under Terry’s hips so that you can get your mouth into place, eagerly running your tongue back and forth across the mighty shaft and polishing it to a sheen with your spittle.", parse);
							Text.NL();
							Text.Add("<i>“And my balls? Don’t forget my balls - Oh! Yes! That’s great!”</i>", parse);
							Text.NL();
							Text.Add("You coo softly in your pride, hungrily sucking away on Terry’s balls. You’d swear that you can <b>feel</b> the equine nuts contained in [hisher] impressive scrotum fizzing as they busily churn up one of [hisher] trademark eruptions of cum.", parse);
							Text.NL();
							Text.Add("A noisy kiss of appreciation on one ball, and then you return to Terry’s drooling cock. You caress the blunt tip with your [tongueTip], then curl your tongue under the glans to catch the dripping pre-cum before you resume licking back along [hisher] length.", parse);
							Text.NL();
							Text.Add("<i>“Hmm, you really know your way around my dick, don’t you, [playername]? I could just blow my load, right here, right now.”</i>", parse);
							Text.NL();
							Text.Add("A wracking sigh of longing flows from your lips at the thought of it. You swear you can hear Terry’s balls at work as they whip up a delicious font of salty, creamy fox-spooge for you. You can taste that wonderful cascade of jism sliding down your throat, feel your belly growing fat, hot and heavy as [heshe] stuffs [hisher] cock down your throat and empties [himher]self into you...", parse);
							Text.NL();
							Text.Add("The [foxvixen] chuckles, wagging [hisher] tail. <i>“Maybe you should play with it next… get a huge serving of fox-cream? We both know that isn’t what you’re after right now, and if you keep going, I’m really gonna cum!”</i> [heshe] says as [hisher] cock throbs dangerously.", parse);
							Text.NL();
							Text.Add("You pull back, shaking your head. [HeShe]’s right; as much as you want a bellyful of [foxvixen]-cock, that’s not what you bent [himher] over for. Though you really, really could suck [hisher] [tcock] dry too, you have to think about what you’re here for: sweet, sweet pussy-honey.", parse);
						}
						else {
							Text.Add("<i>“Stroke it good, and don’t forget my balls,”</i> [heshe] adds.", parse);
							Text.NL();
							Text.Add("Well, if that’s what [heshe] needs to get that sweet pussy of [hishers] all nice and juiced up for you, you’ll play along. [HeShe] better not think that this is all you’re going to do to [himher].", parse);
							Text.NL();
							Text.Add("Warning given, you bend in closer and slowly run your tongue across one bulging seed-factory. Terry’s unique musk washes over your senses, undercut with the faintest tang of salt. As you start to suckle Terry’s balls, your hands busy themselves downward. You caress [hisher] member, rubbing the dripping pre-cum into the tender skin to make it nice and slippery.", parse);
							Text.NL();
							Text.Add("<i>“Ah, yes… that feels nice...”</i>", parse);
							Text.NL();
							Text.Add("Dimly aware of Terry’s tail wagging above you, you continue with your ministrations. You leisurely caress [hisher] maleness with hands, mouth and tongue for several long moments, before you deign to glide back up above Terry’s bulging balls to take an exploratory slurp at the feminine folds there.", parse);
							Text.NL();
							Text.Add("Terry mewls sharply at the sudden intrusion of your tongue, even though you only take a shallow lick. [HisHer] nectar washes over your senses, rich and heady in the warmth of your mouth. [HeShe]’s ready for you...", parse);
						}
					}
					Text.NL();
					Text.Add("One hand still wrapped around Terry’s equine meat and pumping lazily, to keep [himher] on edge, you lower your face to [hisher] honeypot. It’s already glistening with [hisher] nectar, a thin stream running down onto [hisher] balls.", parse);
					Text.NL();
					Text.Add("Feeling playful, you lap up that stray streamer, making Terry quiver and mewl as your [tongueTip] drags along [hisher] sack and up into [hisher] folds. You worm your way daintily into [hisher] hood to tickle [hisher] clit before gliding shallowly along [hisher] length.", parse);
					Text.NL();
					Text.Add("Slowly and meticulously, you lick at [hisher] cunt, each pass just deep enough to stir [hisher] inner petals. A chorus of gasps and whimpers greets your efforts, guiding your tongue to explore each nook and cranny, helping you determine which touch elicits which note.", parse);
					Text.NL();
					Text.Add("You give [hisher] pleasure buzzer another passing lick and make your way down toward [hisher] balls, then onto [hisher] shaft. It’s not until you reach [hisher] broad, flat tip that you realize just how much pre this [foxvixen] is leaking.", parse);
					Text.NL();
					Text.Add("Savoring the rich taste of Terry’s seed, you decide to spice up the [foxvixen]’s juices with a touch of [hisher] own maleness. You give [hisher] cock a few more licks, then draw the tip inside your mouth.", parse);
					Text.NL();
					Text.Add("Terry groans in pleasure, instinctively bucking [hisher] hips as [heshe] rewards your efforts with a fresh spurt of [hisher] tasty pre-cum. It doesn’t take much coaxing before you have your mouthful. Carefully letting [hisher] shaft slip from your lips, you move back to your original target: Terry’s winking pussy.", parse);
					Text.NL();
					Text.Add("With the utmost care, you start drooling the [foxvixen]’s male essence over [hisher] womanhood. Painstakingly, you use your slick tongue to guide the flow, ensuring that it seeps inside. With your guidance, Terry’s pre-cum flows into [hisher] folds and runs down [hisher] length, painting [hisher] clit and puddling on [hisher] balls.", parse);
					Text.NL();
					Text.Add("Terry shivers as your breath caresses [hisher] newly painted pussy, unconsciously clenching down around a phantasmal cock. Closing your eyes, you take a moment to appreciate [hisher] scent; a wonderful mixture of male and female musk that floods your nose from being so close. Hungrily, you take your first real lick, drawing your tongue completely across the length of [hisher] slit. Eyes still closed, you roll the mixed juices around in your mouth, analyzing the subtle nuances of the combination.", parse);
					Text.NL();
					Text.Add("You swallow the delicious mouthful with a shudder of pleasure, opening your eyes as you playfully praise Terry for providing such a unique dish for you. Vixen nectar and stallion sauce; who else could give you something so tasty?", parse);
					Text.NL();
					if(terry.Relation() < 30) {
						Text.Add("<i>“You’re the one who made me this way...”</i>", parse);
						Text.NL();
						Text.Add("That is true... but [heshe]'s certainly made [hisher] new body [hisher] own. Or was that somebody else mewling in pleasure just now, hmm?", parse);
						Text.NL();
						Text.Add("Terry falls silent at that. From the way [hisher] tail is twitching above you, and the way [heshe] shifts [hisher] weight, it’s obvious you’ve embarrassed [himher]. Time to finish [himher] off...", parse);
					}
					else if(terry.Relation() < 60) {
						Text.Add("<i>“Well, whose fault is that?”</i> [heshe] teases.", parse);
						Text.NL();
						Text.Add("Yours, but [heshe] certainly doesn’t seem to mind the results.", parse);
						Text.NL();
						Text.Add("<i>“I don’t. So good call, [playername].”</i> [HeShe] chuckles.", parse);
						Text.NL();
						Text.Add("You rather thought it was a good idea yourself. That’s why you went through with it.", parse);
						Text.NL();
						Text.Add("<i>“Care to finish me off now?”</i>", parse);
						Text.NL();
						Text.Add("It would be your pleasure.", parse);
					}
					else {
						Text.Add("<i>“Well, I owe it all to my kinky, perverted lover,”</i> [heshe] says with a grin.", parse);
						Text.NL();
						Text.Add("You can’t take all the credit; [heshe] was the kinky [boygirl] who mastered this new body after you gave it to [himher], after all.", parse);
						Text.NL();
						Text.Add("<i>“Hard not to, especially when someone is so insistent on playing with your new bits.”</i>", parse);
						Text.NL();
						Text.Add("Can [heshe] really blame you? They’re so much fun to play with!", parse);
						Text.NL();
						Text.Add("<i>“Blame a huge pervert like yourself? Of course I can! Not that I mind...”</i>", parse);
						Text.NL();
						Text.Add("Sounds like you’re not the only pervert here. Or does [heshe] not want you to finish [himher] off, hmm?", parse);
						Text.NL();
						Text.Add("<i>“Of course I want you to finish me off… unless you’re implying you don’t want my juices? Or my cream?”</i>", parse);
						Text.NL();
						Text.Add("After this little appetizer? Of course you want the main course! You just wanted to be sure it was okay with [himher] first.", parse);
						Text.NL();
						Text.Add("<i>“Excuses, [playername]. Excuses...”</i>", parse);
					}
					Text.NL();
					Text.Add("Without further ado, you plunge your face back into Terry’s muff and resume licking for all you’re worth. Your hands caress [hisher] stallionhood, feeling it throbbing faster and faster as your fingers glide across the skin. You smear it with pre-cum, massaging Terry’s own juices into the soft flesh.", parse);
					Text.NL();
					Text.Add("[HisHer] flare has risen from [hisher] glans, and you tease it mercilessly with one hand, pinching and stroking the ridged flesh even as the other hand busies itself with Terry’s swelling knot, palpating the engorged flesh.", parse);
					Text.NL();
					Text.Add("Through it all, you hungrily ravish Terry’s cunt. Smears of feminine fluids paint themselves across your [face] as you slurp and slather at the precious source of nectar. You can taste the difference in [hisher] juices, feel [hisher] climax coming closer and closer, and it drives you on in your efforts.", parse);
					Text.NL();
					Text.Add("You nibble at [hisher] clit, pump [hisher] cock, lick and suckle and stroke for all you’re worth...", parse);
					Text.NL();
					
					var cum = terry.OrgasmCum();
					
					Text.Add("With a suddenness that shocks you, Terry arches [hisher] back and howls in ecstasy. You can feel [hisher] mighty horsemeat bulging almost double its girth as the first huge wave of cum erupts from [hisher] overstuffed balls, forcing your clasping fingers apart as it rushes out of [hisher] cumslit. Your stray hand, busily teasing the jutting flare, is too close to the liquid explosion, and you can feel thick wet warmth washing over your [skin] as it is soaked in this first eruption - the first of many, judging by the way you can feel [hisher] shaft bulging again...", parse);
					Text.NL();
					Text.Add("At the same time, an equally impressive wave of femcum splashes against your face, washing over your cheeks and running down your chin as you frantically try to keep up with it. Spice-tinged sweetness envelops your tongue and makes your head swim, exhorting you to drink your fill.", parse);
					Text.NL();
					Text.Add("Even as you guzzle down Terry’s honey, your hands don’t fall idle. As best you can, you milk the [foxvixen]’s pulsing member, heedless of the cum that soaks your fingers as you play with [hisher] flare. Every vein in [hisher] length is bulging against your skin, knot swollen and throbbing with the need to anchor the [foxvixen]’s mighty stallionhood in a warm hole and breed it. Even with your face buried in between Terry’s thighs, you can still hear the liquid gurgling and splashing as [hisher] balls violently empty themselves onto the ground.", parse);
					Text.NL();
					Text.Add("That only drives you on in your efforts. Your mouth wrapped around [hisher] mound as best you can, you swallow desperately in an effort to keep up with the tidal wave of femcum pouring down your throat. It pours down your gullet, coating your innards with a thick glaze of rich nectar and sloshing around inside your belly. It feels so good, filling you with a warmth that is almost sexual in itself.", parse);
					Text.NL();
					Text.Add("Even Terry has [hisher] limits, however. With a long, wavering sigh of release, [heshe] belches forth one last gobbet of cum and goes limp, slumping against you for support as [hisher] clenched cunny finally falls slack.", parse);
					Text.NL();
					Text.Add("You take a few moments to finish licking off any stray streamers and help the [foxvixen] lie down, away from the mess [heshe] created [himher]self.", parse);
					Text.NL();
					if(player.SubDom() >= 25) {
						Text.Add("Carefully, you set Terry down on [hisher] back and pat the panting [foxvixen]’s head. That’s a good pet.", parse);
						Text.NL();
						Text.Add("Terry just coos in response.", parse);
						Text.NL();
						Text.Add("There’s just one last detail…", parse);
						Text.NL();
						Text.Add("<i>“What?”</i> [heshe] asks, looking at you.", parse);
						Text.NL();
						Text.Add("You present your hand, plastered with [hisher] cum, to [himher]. [HeShe] made quite a mess, you tell [himher]. It’s only fair that [heshe] cleans it up, right?", parse);
						Text.NL();
						Text.Add("Terry looks at your hand, then back at you, and finally [heshe] sighs. <i>“Okay...”</i>", parse);
						Text.NL();
						Text.Add("That’s a good [boygirl].", parse);
						Text.NL();
						Text.Add("[HeShe] extends [hisher] hands, grabbing yours by the wrist and bringing it closer so [heshe] can clean it up properly.", parse);
						Text.NL();
						Text.Add("You watch as the pet [foxvixen] begins gently lapping your palm, then your finger, then the back of your hand. [HeShe] doesn’t seem too enthusiastic at first, but that quickly changes as [heshe] continues to service you. Terry is very thorough, fellating each individual digit to ensure not a single smear of [hisher] climax remains.", parse);
						Text.NL();
						Text.Add("Very nice work, you purr, admiring your clean hand. Such a good [boygirl], to work so hard. And a good little [foxvixen] deserves a reward.", parse);
						Text.NL();
						Text.Add("<i>“Huh?”</i>", parse);
						Text.NL();
						Text.Add("Without further ado, you swoop down on Terry and claim [hisher] lips, boldly thrusting your [tongue] into [hisher] mouth as deep as you can. ", parse);
						if(player.LongTongue())
							Text.Add("Your inhumanly long tongue plunges down Terry’s gullet, staking a claim [heshe] cannot hope to contest.", parse);
						else
							Text.Add("It wrestles Terry’s tongue to the floor of [hisher] mouth, indisputably asserting your ownership.", parse);
						Text.NL();
						Text.Add("A muffled noise bubbles from Terry’s lips to yours, and you possessively embrace him, locking your faces together. [HeShe] struggles a little, but purely on instinct. As you drape yourself over [himher], [heshe] quiets down, moaning softly into your mouth as you stake your claim.", parse);
						Text.NL();
						Text.Add("Slowly, you break the kiss, letting Terry suckle your tongue for a moment before pulling away. Smirking down at your vulpine pet, you ask if [heshe] liked [hisher] reward.", parse);
						Text.NL();
						Text.Add("[HeShe] simply nods wordlessly, panting to try and catch [hisher] breath.", parse);
						Text.NL();
						Text.Add("You thought [heshe] would. Now, you think the both of you could use a little nap.", parse);
						Text.NL();
						Text.Add("Daintily, you lay your head down on Terry’s chest, using ", parse);
						if(terry.Cup() < Terry.Breasts.Acup)
							Text.Add("[hisher] fluffy chest", parse);
						else
							Text.Add("[hisher] [tbreasts]", parse);
						Text.Add(" as a makeshift pillow. As you close your eyes, you affectionately hug [himher] closer.", parse);
						Text.NL();
						if(terry.Relation() < 30)
							Text.Add("As you start to drift away, you feel [hisher] arms hesitantly wrap around you in return.", parse);
						else
							Text.Add("Terry hugs you back, quite content to catch some rest [himher]self. The last thing you feel before drifting off is the [foxvixen]’s tail affectionately brushing against your [legs].", parse);
					}
					else if(player.SubDom() <= -25) {
						Text.Add("Reverently, you lay the panting [foxvixen] down on [hisher] back. Smiling, you thank Terry for sharing [hisher] sweet honey with you; it was delicious.", parse);
						Text.NL();
						Text.Add("Terry simply groans in response.", parse);
						Text.NL();
						Text.Add("Looks like you really tired [himher] out, poor thing... but [heshe] certainly doesn’t seem to mind. Cheerfully, you note that Terry really is a generous soul. You’ll have to do this again sometime.", parse);
						Text.NL();
						Text.Add("Terry groans again in reply, but looking down, you see that [heshe] isn’t too put out by the idea. [HisHer] thick, juicy member is still poking from its sheath, half-erect and bobbing slightly as [heshe] breathes. Seeing the cum still oozing across its skin makes you lick your lips. It’s a little greedy, but... you think you can fit just a little more in...", parse);
						Text.NL();
						Text.Add("Kneeling down, you gently spread the [foxvixen]’s legs and settle yourself between Terry’s thighs, lowering your head until you are practically nose to tip with [hisher] equine shaft. Your eyes flutter closed as you inhale, drinking in Terry’s scent. The thick smell of sex fills the air around your [face], masculine musk undercut by just a hint of Terry’s well-licked cunt. It smells so good...", parse);
						Text.NL();
						Text.Add("Your hungry [tongue] glides out over your lips, already dripping in your eagerness. You swing it lightly through the air, brushing its [tongueTip] against Terry’s still-swollen knot before dragging a long path up [hisher] shaft. The taste of warm [foxvixen] cream explodes on your tongue, its salty goodness making you shiver as it burns over your taste buds.", parse);
						Text.NL();
						Text.Add("A soft whimper escapes Terry’s muzzle, the [foxvixen] wriggling as if trying to squirm away from your teasing, but you can’t be denied. With soft, gentle laps, you slurp up the cum that has dripped down [hisher] cock, insistently running your tongue around the rim of Terry’s sheath.", parse);
						Text.NL();
						Text.Add("Satisfied with your cleaning, you eagerly drift up Terry’s shaft again, opening your mouth and gently swallowing as much of the [foxvixen]’s cock as you can fit. Terry mewls softly, shivering in your mouth as you suckle like a babe at the teat.", parse);
						Text.NL();
						Text.Add("Your tongue strokes and caresses, lips working to suck up every last drop of yummy goodness smeared over Terry’s tasty stallionhood. All too soon, it’s all vanished down your throat.", parse);
						Text.NL();
						Text.Add("So good… you knew there was a good reason you gave Terry this huge cock. [HeShe] fills your mouth so well, and the taste of [hisher] seed, combined with [hisher] juices, it’s simply divine. If only you could get a little more? Maybe… maybe you can? Surely [heshe]’s got more cream in these big, beautiful balls for you to wash down [hisher] honey with?", parse);
						Text.NL();
						Text.Add("Hopefully, you start to caress Terry’s balls, wishing that [heshe] can wring out just one last mouthful for you. [HeShe] gasps and whimpers, thrashing weakly as you molest [himher] with hand and mouth.", parse);
						Text.NL();
						Text.Add("From somewhere deep inside [himher]self, [heshe] finds the strength to cum again. A single thick burst of [hisher] wonderful creamy [foxvixen] seed rushing into your mouth and filling it to the brim. Your head swims as [hisher] essence drowns your taste buds, reluctant to swallow and end your savoring of this delicious treat.", parse);
						Text.NL();
						Text.Add("Inevitably, the siren call of your belly is too loud to ignore. You let Terry’s cum pour down your throat, swirling into your gullet and warming you from the inside out. You tenderly suck [hisher] cock clean, and then let it pop softly from between your lips before thanking Terry for [hisher] sweet generosity.", parse);
						Text.NL();
						Text.Add("All you get in reply is a soft sigh. Bemused, you lift your head higher, and then smile gently. Poor thing; Terry’s fallen asleep! You must have <b>really</b> been too much for [himher] to handle.", parse);
						Text.NL();
						Text.Add("Quietly as you can, you rise from between Terry’s legs and lie down beside the exhausted [foxvixen]. Carefully drawing [himher] into your arms, you smile down at [hisher] sleeping face. [HeShe] looks so peaceful like this. You tenderly brush a lock of hair out of [hisher] eye, then kiss [himher] softly on the lips. Finally, you nuzzle down into the crook of [hisher] shoulder and, after wishing [himher] sweet dreams, drift off to sleep yourself.", parse);
					}
					else {
						Text.Add("Carefully, you help Terry down to the ground, letting the spent [foxvixen] hang onto your shoulder for support before [heshe] rolls over onto [hisher] back. With a sigh of effort, you settle yourself down and playfully note that you’d ask if [heshe] enjoyed your efforts... but you think you have a pretty good idea already. You idly wipe your still-slimy hand off on the ground beside you as you say this.", parse);
						Text.NL();
						Text.Add("Terry simply groans in response, too worn out to formulate a proper reply.", parse);
						Text.NL();
						Text.Add("Poor [guygal]; you really wore [himher] out. Would [heshe] like to just rest here for a while?", parse);
						Text.NL();
						Text.Add("The [foxvixen] sighs softly, gently nodding [hisher] agreement.", parse);
						Text.NL();
						Text.Add("Well, you could use a bit of a rest too, so that’s alright with you. Before that, though... You reach out and pull Terry into your embrace, gently cuddling [himher] once you have [himher] in your grip. Terry doesn’t try to struggle, content to use your arm as a pillow as you snuggle in close.", parse);
						Text.NL();
						Text.Add("With your favorite fluffy pet in your arms, you close your eyes and allow yourself to drift off to sleep.", parse);
					}
				}
				else {
					Text.Add("The [foxvixen]’s dainty little cock is so small, it almost vanishes between your fingers as they lovingly encircle it. Not that you mind, though; it just means you’ll have to get... <i>creative</i>... when it comes to milking [himher].", parse);
					Text.NL();
					Text.Add("Grinning at the very thought, you flex your fingers, dexterously stroking the slowly darkening length of pink flesh with each fingertip in turn, tracing unearthly patterns over silken-smooth skin.", parse);
					Text.NL();
					Text.Add("Terry moans at your touch, [hisher] dainty cock growing stiff under your ministrations. The small knot fills up ever so slightly, and [hisher] little coin purse grows a bit heavier as [hisher] body works to produce the seed [heshe]’ll be spending shortly. A distinct scent of aroused vixen tickles your nose, and one look is all you need to confirm the source: Terry’s rapidly moistening folds.", parse);
					Text.NL();
					Text.Add("Your palm gently glides across the underside of Terry’s girlish prick, absently stroking [himher] as you savor the smell wafting towards your [face]. Almost lazily, you dip your head in closer and extend your tongue. The [foxvixen]’s ballsack jiggles as your [tongue] sweeps across it, the salt of [hisher] skin crackling across your taste buds before your [tongueTip] plunges into Terry’s folds.", parse);
					Text.NL();
					Text.Add("The taste of Terry’s nectar slowly creeps across your tongue, a sort of spicy sweetness that contrasts deliciously with the teasing taste of [hisher] maleness that you already got. It calls to you, begging you to greedily plunge your face into [hisher] muff and lick with all your might, but you hold yourself firm: you are better than that.", parse);
					if(terry.PussyVirgin())
						Text.Add(" Besides, Terry deserves a better way to pop [hisher] precious cherry.", parse);
					Text.NL();
					Text.Add("You glide slowly along Terry’s slit, slathering [hisher] netherlips with your tongue until they shimmer like pink pearls. Sliding your face to the bottom of Terry’s cunt, just above [hisher] trapsack, you playfully kiss [hisher] clit, insistently suckling on the herm [foxvixen]’s pleasure button.", parse);
					Text.NL();
					Text.Add("Terry gasps shrilly, instinctively clenching down on a dick that isn’t there. You can feel [hisher] heartbeat racing through the veins in [hisher] cock as it throbs against your fingers. The [foxvixen]’s hips pump on sheer auto-pilot, thrusting [hisher] dripping member against your palm in a clumsy attempt to grind it.", parse);
					Text.NL();
					Text.Add("Oh, [heshe] likes your hand, does [heshe]? Well, [heshe]’ll like this better...", parse);
					Text.NL();
					Text.Add("Your fingers curl inwards, looping into a crude O-shape with your palm, a makeshift onahole that Terry is more than happy to accept. You can feel [hisher] warm, soft skin gliding over your own as [heshe] bucks away, fucking the impromptu opening without a second thought.", parse);
					Text.NL();
					Text.Add("With each back-thrust, Terry mashes [hisher] cunt into your face, and you don’t hesitate to take advantage of it. Your tongue flicks out in shallow, broad laps, stroking just the outermost pair of the [foxvixen]’s netherlips. Terry’s pussy flutters like some obscene butterfly, trying to catch your tongue and draw it deeper inside.", parse);
					Text.NL();
					Text.Add("Unwilling to be caught so, your [tongueTip] nimbly evades Terry’s efforts and quests through [hisher] folds and crannies, sopping up the spicy-sweet feminine nectar pooling there. The taste of Terry’s cunt-juice burns a trail down your gullet, making your stomach growl impatiently for more.", parse);
					Text.NL();
					Text.Add("Your ears are filled with the chorus of Terry’s pleasure: the wet squelching of your tongue in [hisher] pussy, the slapping of [hisher] cock against your pre-soaked palm, the [foxvixen]’s cute little grunts and whimpers as [heshe] creeps ever closer to the edge.", parse);
					Text.NL();
					Text.Add("Oh, it’s such wonderful music. Your heart fills with pride that it’s your efforts that are driving Terry so wild, and it spurs you on to lick [himher] harder and faster than before. You can feel the [foxvixen]’s turgid knot battering against your fingers as [heshe] restlessly ruts your hand. You don’t need to see it to know it must be driving Terry mad, throbbing impatiently with its need to tie a bitch and fill her full of Terry’s seed. Well, you can do something about that...", parse);
					Text.NL();
					Text.Add("No sooner have your fingers uncurled, widening the gap Terry is trying so desperately to fit [hisher] dick into, than Terry shoves [hisher] cock home with a soft growl of satisfaction. You can feel the thick, swollen, throbbing flesh of [hisher] knot as it grinds over your slick fingers... and then, you pounce.", parse);
					Text.NL();
					Text.Add("Terry mewls in distress, instinctively trying to tug out again as your fingers spring closed, trapping [hisher] knot in your grip. You tighten your hold until you can feel it squish between your fingers, but it’s just not enough to push [himher] over the edge yet.", parse);
					Text.NL();
					Text.Add("You lift your face from the [foxvixen]’s womanhood and sink lower. Coaxingly, you coo at [himher] to cum for you before laying your lips on [hisher] aching coin purse. You suckle as hard as you dare, a perverse kiss that pulls one ball completely into the wet warmth of your mouth, letting your honey-caked tongue caress the tight-stretched skin.", parse);
					Text.NL();
					Text.Add("Terry convulses in your grip, grunting and moaning as [hisher] balls draw tight. <i>“Aaaahn!”</i> [heshe] cries out lasciviously.", parse);
					Text.NL();
					
					var cum = terry.OrgasmCum();
					
					Text.Add("The [foxvixen]’s ecstatic howl has barely begun to resound in your ears before you move. Impatiently, you spit out [hisher] ball so you can plunge your face into [hisher] cunt, greedily guzzling the small wave of female nectar that pours down your gullet. Still held tight in your hand, Terry’s cock spits seed onto the uncaring ground below, a small puddle forming lonely and ignored under [hisher] belly. You don’t allow a single drop of [hisher] precious pussy-juice to escape your lips, greedily swallowing all of it down your throat.", parse);
					Text.NL();
					Text.Add("With a whimpering sigh, Terry sags as the last of [hisher] climax washes out of [himher], a final dribble of cum flowing over your hand as it seeps out of [hisher] pointy cock-tip. Patiently, you clean [hisher] folds and then gently release [hisher] cock.", parse);
					Text.NL();
					parse["p"] = player.HasLegs() ? "" : " proverbial";
					Text.Add("Rising to your[p] knees, you tenderly help Terry down, laying yourself beside [himher]. Folding the tired [foxvixen] in your arms, you nuzzle up closer and warmly ask if [heshe] enjoyed that.", parse);
					Text.NL();
					if(terry.Relation() < 30) {
						Text.Add("<i>“Y-yeah, I did,”</i> [heshe] replies, panting.", parse);
						Text.NL();
						Text.Add("Good. You’re so glad to hear it.", parse);
					}
					else if(terry.Relation() < 60) {
						Text.Add("<i>“Very much,”</i> [heshe] says, still panting.", parse);
						Text.NL();
						Text.Add("Wonderful. Maybe you’ll have to do this for [himher] again in the future.", parse);
					}
					else {
						Text.Add("<i>“Hmm… I feel like you could’ve done better,”</i> [heshe] teases, still panting.", parse);
						Text.NL();
						if(terry.PussyVirgin()) {
							Text.Add("Oh? Does [heshe] want [hisher] cherry popped, hmm? Because that’s what a better job would have entailed.", parse);
							Text.NL();
							Text.Add("<i>“If I said yes, would you take me right here right now?”</i> [heshe] grins hopefully.", parse);
							Text.NL();
							Text.Add("Maybe... if [heshe] didn’t look like [heshe] was about to fall asleep on you. [HeShe] should get some rest. The two of you can discuss popping cherries later.", parse);
							Text.NL();
							Text.Add("<i>“Hey! I can total-”</i>", parse);
						}
						else {
							Text.Add("Maybe you could have, but then you wouldn’t have gotten your drink. And Terry-honey is far too yummy to pass up.", parse);
							Text.NL();
							Text.Add("<i>“That so? Well, you’ve had your fill, how about I get <b>my</b> fill now?”</i>", parse);
						}
						Text.NL();
						Text.Add("With a single swift motion, you roll Terry over in your arms, allowing your lips to swoop down and capture [hishers] in a passionate kiss. With a muffled near-purr of delight, the [foxvixen] loops [hisher] arms around your shoulders, pressing [hisher] [tbreasts] to your own [breasts] as [heshe] melts into your mouth. Only when the need for air becomes too insistent to ignore do you release Terry, tongue playfully stroking [hisher] lips as you recede.", parse);
						Text.NL();
						Text.Add("<i>“That’ll suffice for now.”</i> [HeShe] smiles.", parse);
					}
					Text.NL();
					Text.Add("Smiling contentedly, you bury your face into the crook of Terry’s shoulder and allow yourself to drift off, happy to catch some well-earned rest.", parse);
				}
				Text.Flush();
				
				terry.relation.IncreaseStat(75, 1);
				world.TimeStep({minute: 30});
				
				Gui.NextPrompt();
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Terry.SexHaveADrinkCock = function() {
	var parse = {
		playername : player.name,
		foxvixen : terry.mfPronoun("fox", "vixen"),
		handsomebeautiful : terry.mfPronoun("handsome", "beautiful"),
		boygirl : player.mfTrue("boy", "girl"),
		mastermistress : player.mfTrue("master", "mistress"),
		sir : player.mfTrue("sir", "ma’am"),
		sirmadam : player.mfTrue("sir", "madam")
	};
	
	parse["stuttername"] = player.name[0] + "-" + player.name;
	
	parse = terry.ParserPronouns(parse);
	parse = terry.ParserTags(parse, "t");
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("You smile ", parse);
	if(player.sexlevel < 3)
		Text.Add("and try to feign confidence", parse);
	else
		Text.Add("confidently", parse);
	Text.Add(" as you advance upon the [foxvixen] and reach down to caress [hisher] balls. Terry ", parse);
	if(terry.Relation() < 30)
		Text.Add("flinches at your touch, barely managing to stay where [heshe] is.", parse);
	else if(terry.Relation() < 60)
		Text.Add("blushes in embarrassment at the gesture.", parse);
	else
		Text.Add("grins mischievously, flicking an ear in appreciation.", parse);
	Text.NL();
	Text.Add("Leaning closer, you stage-whisper that the [foxvixen] has a <i>very</i> yummy-looking cock.", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("<i>“Okay? So...”</i>", parse);
		Text.NL();
		Text.Add("So, you want [himher] to feed you. You're craving cream, and you want [himher] to sate that craving.", parse);
		Text.NL();
		Text.Add("<i>“Oh… okay. I guess I can do that,”</i> [heshe] says, smiling a little.", parse);
		Text.NL();
		Text.Add("<i>“You should probably strip first, unless you don’t care about getting fox-cum all over your clothes.”</i>", parse);
		Text.NL();
		Text.Add("Well, you wouldn’t want to waste a delectable treat like that...", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Do I? And what would you like me to do with it?”</i> [heshe] asks, smirking as [heshe] enjoys you fondling [hisher] balls.", parse);
		Text.NL();
		Text.Add("Battering your [eyes] coyly, you coo back that you’d like it ever so much if [heshe] would feed you with [hisher] yummy, scrummy cock. You want [himher] to put it in your mouth and down your throat, to let you suck until all that warm, salty cum is in your belly.", parse);
		Text.NL();
		Text.Add("The [foxvixen]’s muzzle widens into a grin. <i>“It would be my pleasure.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Now, how about you get naked first? Unless you want me marking you as well.”</i>", parse);
		Text.NL();
		Text.Add("It’s a tempting thought, you quip back, tapping a finger against your lips as you contemplate it, then you grin wider and shake your head. No, you think you’ll strip down - this time.", parse);
	}
	else {
		Text.Add("<i>“I think I know what you’re getting at here, but I’d still like to hear you say it.”</i> [HeShe] grins.", parse);
		Text.NL();
		Text.Add("You reply with a flat look, leaning closer to stare [himher] square in the eyes. Without blinking, you tell [himher] to feed you [hisher] cock. And that’s an <b>order</b>.", parse);
		Text.NL();
		Text.Add("Terry gasps softly as [heshe] feels [hisher] collar tighten ever so slightly. <i>“Oh, you cocky bastard,”</i> [heshe] replies with a big grin.", parse);
		Text.NL();
		Text.Add("You smirk back and nod your agreement.", parse);
		Text.NL();
		Text.Add("<i>“Well, you asked for it, so you’re gonna get it!”</i> With a swift lunge, Terry presses [hisher] lips to your own, kissing you passionately. [HisHer] tongue tangles with yours for an instant, before [heshe] breaks the kiss. <i>“Come on, strip!”</i>", parse);
		Text.NL();
		Text.Add("With a shake to clear your thoughts, you chuckle softly. Well, if [heshe] insists...", parse);
	}
	Text.NL();
	
	terry.relation.IncreaseStat(40, 1);
	
	Text.Add("You take a step back from Terry and reach for your [armor]. ", parse);
	if(player.sexlevel < 3) {
		Text.Add("Without hesitation you start to peel it off, tossing it aside in your eagerness to begin.", parse);
	}
	else if(player.sexlevel < 6) {
		Text.Add("Though excited, you don’t forget that Terry deserves a little presentation, too. You remove your gear as slowly as you can bear to do so, letting [himher] ogle each precious inch of [skin] as you cast your things aside.", parse);
		
		terry.AddLustFraction(0.25);
	}
	else {
		Text.Add("Of course, you’re not going to just rush into this. Even undressing can be something to savor...", parse);
		Text.NL();
		Text.Add("With a mischievous smile on your lips, you make your stripping as leisurely as possible, letting Terry bask in the unveiling of each delicious inch of your body. You twist and turn, coaxing [hisher] excitement and ensuring that [heshe] can see all of your glory as it is revealed.", parse);
		
		terry.AddLustFraction(0.5);
	}
	Text.NL();
	Text.Add("Now naked, you place a hand on your hips and beckon to [himher] with the other. A coy smile on your lips, you ask the [foxvixen] how [heshe]’d like you to receive [himher].", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		if(terry.Relation() < 30) {
			Text.Add("<i>“Umm… I’m not sure...”</i> [heshe] trails off.", parse);
			Text.NL();
			Text.Add("You wonder for a second if [hisher] uncertainty is genuine or due to nerves. Still, better to nip this in the bud, lest it sour the mood. With your warmest smile, you suggest that you could lie on your back and allow [himher] to straddle your chest - that way, you can be sure to suck up every last drop of tasty, salty cream.", parse);
			Text.NL();
			Text.Add("<i>“Okay, I guess that works.”</i>", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("<i>“Any way is fine for me,”</i> [heshe] replies with a smile.", parse);
			Text.NL();
			Text.Add("You chuckle at [hisher] words. What a sweetheart [heshe] is, but if [heshe] really feels like leaving it up to you... you want to lay down and let [himher] get on top to make sure [heshe] can feed you everything [heshe]’s got. Is [heshe] fine with that, hmm?", parse);
			Text.NL();
			Text.Add("<i>“Sounds perfect for me, but don’t blame me if I decide I want a little more action while I’m topping you.”</i> [HeShe] grins.", parse);
			Text.NL();
			Text.Add("Giggling softly, you reply that if [heshe] can think about doing that whilst feeding you, [heshe] can go right ahead.", parse);
		}
		else {
			Text.Add("<i>“With a smile, an open mouth, and your tongue lolling out. Cherry on top for bonus points.”</i>", parse);
			Text.NL();
			Text.Add("You laugh at that; you really walked right into that one, didn’t you?", parse);
			Text.NL();
			Text.Add("Terry simply grins back.", parse);
			Text.NL();
			Text.Add("Alright then; is [heshe] okay with being on top and feeding [himher]self to you?", parse);
			Text.NL();
			Text.Add("<i>“I’m fine with any position, [playername]. Now, how about you get to it? You ordered me to feed you, not stand here naked,”</i> [heshe] teases you.", parse);
			Text.NL();
			Text.Add("Patience, you chide, grinning widely as you playfully wave a finger at the [foxvixen].", parse);
		}
		Text.NL();
		var wings = player.HasWings();
		if(wings) parse["wings"] = wings.Short();
		parse["w"] = wings ? Text.Parse(", taking a moment or two to get your [wings] properly positioned", parse) : "";
		Text.Add("Decision made, you lie down flat on your back[w]. Once comfortable, you smile up at your vulpine partner and beckon [himher] to approach.", parse);
		Text.NL();
		
		//Big split
		
		if(terry.HorseCock() && player.FirstBreastRow().Size() > 5) {
			Text.Add("Terry saunters over and gingerly straddles you, letting [hisher] stallionhood plop between your [breasts].", parse);
			Text.NL();
			Text.Add("<i>“Err...”</i>", parse);
			Text.NL();
			if(terry.Relation() < 30)
				Text.Add("Poor little [foxvixen]; [heshe] looks like [heshe]’s still waiting for the other boot to drop. Still, you can fix that...", parse);
			else if(terry.Relation() < 60)
				Text.Add("You bite back a chuckle; sweet little [foxvixen], [heshe] just looks so lost. Well, you can help [himher] with that...", parse);
			else
				Text.Add("Aw, how cute; [heshe]’s still so easy to embarrass, even after all you’ve done together. But that’s just part of [hisher] charms. Well, you know how to get [himher] in the proper mood...", parse);
			Text.NL();
			Text.Add("You reach out with one hand and tenderly take hold of the [foxvixen]’s stallionhood near the knot, lifting it from your [skin]. With the other hand, you start to run your fingertips over [hisher] length. Soft, warm skin glides under your fingers with each rhythmic stroke, coaxing [himher] into growing longer and firmer.", parse);
			Text.NL();
			Text.Add("Terry wriggles atop you at your touch, making you smile as [heshe] whimpers softly. A bead of pre-cum splatters in the canyon of your cleavage, the warm wetness drawing your attention back where it belongs. A long, thick rod of mottled brown flesh bobs in the air before you, just waiting for you to start sucking.", parse);
			Text.NL();
			Text.Add("With a tempting target like that, you can’t resist; you stick out your [tongue] and give the glans a wet slurp. You savor the taste of pre-cum on your tongue as you lower the [foxvixen]’s mighty cock where it belongs. Your hands move to encompass your breasts with Terry’s stallionhood nestled between them, and you smile warmly up at your vulpine partner.", parse);
			Text.NL();
			Text.Add("It doesn’t take long for the [foxvixen] to get the message. Smiling to [himher]self, [heshe] grabs your [breasts] and push your soft mounds together, sandwiching [hisher] shaft as [heshe] gives an experimental thrust, causing [hisher] flat tip to bump on your chin.", parse);
			Text.NL();
			Text.Add("You close your eyes and arch your back, pushing out your ample tits even further. Your mouth falls open in a throaty moan of pleasure, [tongue] sliding and touching the blunt tip.", parse);
			Text.NL();
			Text.Add("Terry bucks a second time, causing [hisher] shaft to slide along your [tongue] and enter your mouth. <i>“Oh yeah… this is nice,”</i> [heshe] comments as the warm wetness of your mouth wraps around [hisher] tip.", parse);
			Text.NL();
			Text.Add("You respond with a muffled grunt of agreement, basking in Terry’s flavor as it washes across your tongue. The strange sweetness of pre-cum, mingled with a musky taste that is all Terry, cut with just a hint of salt...", parse);
			Text.NL();
			Text.Add("Purring with approval around Terry’s cock, you slowly lap at [hisher] glans, lips puckering as you suckle softly on [hisher] tip. This appetizer is nice, but you want more.", parse);
			Text.NL();
			Text.Add("Rather than feeding you more, Terry pulls back, popping [hisher] flat tip from your maw as [heshe] sets [himher]self up for another buck. [HeShe] settles into a brisk rhythm, sawing [himher]self into your bosom as [hisher] tip dips into your mouth.", parse);
			Text.NL();
			Text.Add("A spark of impatience flares inside your chest. Irked at the [foxvixen]’s obsession with your breasts, you reach out and grab [hisher] cock on the next thrust, pulling [hisher] cock deeper into your wet, waiting maw and refusing to let go.", parse);
			Text.NL();
			Text.Add("Terry groans in both pleasure and discomfort for a moment, before [heshe] gives in and scoots over. <i>“Hng, alright, alright! I got it. You want me to get closer. Geez, no need to be so pushy!”</i> [heshe] says, settling down so [hisher] balls lie flush with your [breasts].", parse);
			Text.NL();
			Text.Add("You voice a muffled groan of pleasure at the [foxvixen]’s reaction, and you leisurely suckle at [hisher] shaft to thank [himher].", parse);
			Text.NL();
			Text.Add("Once [heshe]’s sure you’re satisfied, [heshe] resumes thrusting, starting off slow at first, but steadily building up to [hisher] previous pace. Spurts of pre wash away down your throat as each pump beckons a lick, and each lick beckons a fresh spurt.", parse);
			Text.NL();
			Text.Add("You close your eyes to better focus on your task. Terry’s labored breathing as [heshe] inches ever closer to [hisher] climax is like music to your [ears]. You know that if you keep this up, it won’t be long before the [foxvixen] delivers your promised load of fox-cream.", parse);
			Text.NL();
			Text.Add("<i>“Ahn! [playername]! I don’t think- Ooh! That feels good!”</i>", parse);
			Text.NL();
			Text.Add("You simply slurp wetly in response, tongue worming as it escapes the seal of your lips to further caress the neglected prick-flesh beyond. Your mouth ripples, swirling the mixture of saliva and pre-cum around Terry’s cock with lewd squelching sounds.", parse);
			Text.NL();
			Text.Add("You know that [heshe]’s getting closer, and your own lust is burning inside of you. Your heart pounds a tattoo against your ribs, matching the tempo you can feel through the veins pulsing against your tongue.", parse);
			Text.NL();
			Text.Add("Your hands reach for your breasts, laying themselves over Terry’s hands. You push back and forth with the [foxvixen], coaxing [himher] to thrust harder and harder. When [heshe] is fast enough for you, you release [hisher] hands and reach for [hisher] balls instead.", parse);
			Text.NL();
			Text.Add("You can feel the seed churning into a froth inside the taut skin as you roll and massage them. They’re so full that it almost makes your head swim, just aching to let go.", parse);
			Text.NL();
			Text.Add("Well, you’re not going to keep your sweet little pet waiting. You suck with all your might, gulping away at [hisher] cock like a [boygirl] possessed.", parse);
			Text.NL();
			Text.Add("<i>“Ack! I can- cumming!”</i> [heshe] exclaims as [hisher] cock throbs one last time and tenses in preparation for the first blow.", parse);
			Text.NL();
			
			var cum = terry.OrgasmCum();
			
			Text.Add("Almost like a teaser as to what’s to come, a thick gobbet of cum spatters across your tongue, making your senses reel with its rich, salty taste. Avidly, you suck all the harder, determined to feed to your heart’s content as Terry cries out and erupts inside of your mouth.", parse);
			Text.NL();
			if(player.sexlevel < 3) {
				Text.Add("The tidal wave of cum that washes into your mouth is more than you can hope to contain. You desperately gulp and swallow, slurping huge mouthfuls of spooge, but you just can’t keep up with Terry’s output. As your belly swells, skin stretching taut and protesting at being so abused, it only gets harder for you to swallow.", parse);
				Text.NL();
				Text.Add("Finally, you can’t take it anymore; a spurt of cream slips down the wrong pipe and you start to splutter and choke. You unthinkingly grab Terry’s cock and pull it from your mouth to allow you can breathe.", parse);
				Text.NL();
				Text.Add("Terry isn’t even half-finished however, and launches another cascade of cum blasts you in the [face]. [HisHer] pulsating organ sprays you down indiscriminately, drenching your face and pouring down onto your [breasts]. [HeShe] is squelching with each thrust, and still [heshe] keeps on cumming.", parse);
				Text.NL();
				Text.Add("Finally, Terry’s prodigious balls run dry. A final spurt belches from [hisher] half-flaccid cock, spattering on your cheek. With a sigh of relief, Terry goes limp.", parse);
				Text.NL();
				Text.Add("You are a mess and a half; your face and upper torso is painted cum-white in thick layers of [foxvixen]-jizz.", parse);
				Text.NL();
				if(terry.Relation() < 30) {
					Text.Add("<i>“Umm… sorry?”</i> [HeShe] grins nervously.", parse);
					Text.NL();
					Text.Add("You wipe a smear of goo from your cheek and flip it away, smiling and assuring [himher] that there’s no need to be sorry. You should have remembered just how much those stallion-balls of [hishers] hold...", parse);
					Text.NL();
					Text.Add("<i>“Right… well… maybe I should get off you?”</i>", parse);
					Text.NL();
					Text.Add("That would be nice, yes.", parse);
					Text.NL();
					Text.Add("Terry promptly gets up and steps away, letting [hisher] glistening shaft slowly recede back into its sheath.", parse);
					Text.NL();
					Text.Add("<i>“So, are we done?”</i>", parse);
				}
				else if(terry.Relation() < 60) {
					Text.Add("<i>“Bit more than you could chew, huh?”</i> Terry asks with a smirk.", parse);
					Text.NL();
					Text.Add("With a soft chuckle, you confess that it seems like you did. You may need to get a bit more practice at this if you want to have a hope of containing it all.", parse);
					Text.NL();
					Text.Add("<i>“If you need help practicing count me in,”</i> [heshe] says with a big grin.", parse);
					Text.NL();
					Text.Add("A chuckle escapes you, and you confess that you knew [heshe]’d say that. You promise to keep that in mind, but for now, if [heshe]’d mind getting off?", parse);
					Text.NL();
					Text.Add("<i>“I think I can accommodate,”</i> [heshe] replies, getting up and letting [hisher] dangling shaft caress your cheek as [heshe] does.", parse);
					Text.NL();
					Text.Add("<i>“That was really nice, thanks.”</i>", parse);
					Text.NL();
					Text.Add("Anytime.", parse);
					Text.NL();
					Text.Add("<i>“Anything else I could do for you?”</i>", parse);
				}
				else {
					Text.Add("<i>“Well, well, darling. Seems like you got what you ordered.”</i> [HeShe] giggles.", parse);
					Text.NL();
					Text.Add("Everything you ordered and then some, you agree.", parse);
					Text.NL();
					Text.Add("<i>“Always happy to please,”</i> [heshe] says with a smile.", parse);
					Text.NL();
					Text.Add("Grinning, you note that [heshe] most certainly is. Now, is [heshe] finished playing with your boobies yet?", parse);
					Text.NL();
					Text.Add("<i>“Hmm… no?”</i> [heshe] replies, still fondling your [breasts] and sandwiching [hisher] cock.", parse);
					Text.NL();
					Text.Add("In that case, you’ll just have to order [himher] off.", parse);
					Text.NL();
					Text.Add("Terry’s collar glows a bit as it tightens slightly. <i>“Party pooper,”</i> [heshe] complains with a pout.", parse);
					Text.NL();
					Text.Add("[HeShe]’ll get over it. Now, off.", parse);
					Text.NL();
					Text.Add("<i>“As you wish,”</i> [heshe] replies while moving to do as you ordered, but not before rubbing [hisher] flaccid shaft on your cum-stained cheek.", parse);
					Text.NL();
					Text.Add("Cheeky [foxvixen]...", parse);
					Text.NL();
					Text.Add("<i>“Anything else I can do for you, [mastermistress]?”</i> [heshe] asks with a teasing grin.", parse);
				}
				Text.Flush();
				
				world.TimeStep({minute: 30});
				
				Scenes.Terry.TerryCleansPC();
			}
			else if(player.sexlevel < 5) {
				Text.Add("Even to someone with your experience, the geyser of semen erupting from Terry’s cock is a little overwhelming.", parse);
				Text.NL();
				Text.Add("Nonetheless, you won’t be beaten by a little cum... okay, a lot of cum. With fervent desire, you suck for all you’re worth, trying to make your swallows match each great spurt of jism flooding your mouth.", parse);
				Text.NL();
				Text.Add("Above your head, Terry mewls and shudders, lost in the throes of [hisher] climax as you busy yourself drinking the result. Your stomach grows tighter with each mouthful, tingling in a sensation that is pleasant, if odd, and a little distracting.", parse);
				Text.NL();
				Text.Add("But you won’t give up so easily as that. Even as you feel yourself stretching over your titanic liquid repast, you do your best to keep on sucking. Terry tastes too good to waste if you can avoid it.", parse);
				Text.NL();
				Text.Add("Unfortunately, eager as you are, even your stomach has its limits. By the time Terry is starting to lose steam, you feel too bloated to swallow. The last few sluggish spurts puddle in the back of your mouth, bulging your cheeks before spilling between your slack lips and drooling down your cheek and over Terry’s now-slack cock.", parse);
				Text.NL();
				Text.Add("<i>“Aah, that hit the spot,”</i> [heshe] says, pulling away to let you breathe.", parse);
				Text.NL();
				Text.Add("You hiccup softly, then tell [himher] that you’re happy you could help.", parse);
				Text.NL();
				if(terry.Relation() < 30) {
					Text.Add("<i>“Sorry about the mouthful, it just felt too good,”</i> [heshe] says apologetically.", parse);
					Text.NL();
					Text.Add("You assure [himher] that it’s alright. It’s sort of a compliment, really; [heshe] must have really enjoyed your mouth.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, I did.”</i> [HeShe] smiles softly.", parse);
					Text.NL();
					Text.Add("Then that’s all that matters. Now, if [heshe] wouldn’t mind hopping off of you?", parse);
					Text.NL();
					Text.Add("<i>“Oh, sure!”</i> [HeShe] quickly hops to [hisher] feet and steps away.", parse);
					Text.NL();
					Text.Add("No longer pressed to the ground, you pull yourself upright and use your hand to scrub away the smears of cum that have stained your face and chest.", parse);
				}
				else if(terry.Relation() < 60) {
					Text.Add("<i>“I figure this is enough for you? If you want more, you’re gonna have to wait a bit.”</i> [HeShe] grins.", parse);
					Text.NL();
					Text.Add("Hiccuping again, you confess that you’ve had your fill for now, thanks.", parse);
					Text.NL();
					Text.Add("<i>“Thought so, hehe.”</i>", parse);
					Text.NL();
					Text.Add("You’re glad [heshe] finds this funny. Now, how about [heshe] gets off of you, hmm?", parse);
					Text.NL();
					Text.Add("<i>Aww, just when I was getting comfy,”</i> [heshe] teases, getting back on [hisher] feet and stepping away.", parse);
					Text.NL();
					Text.Add("You’ll be happy to snuggle [himher] later, when your stomach feels a little less bloated. Terry simply smiles at you, offering you a hand to help you clamber upright. You wipe the back of your arm across your mouth to remove the worst of the stains from your chin.", parse);
				}
				else {
					Text.Add("<i>“How do you like your order of special fox-cream? I can see that you still couldn’t handle all of it,”</i> [heshe] teases pointing at your cum-stained chin.", parse);
					Text.NL();
					Text.Add("You chuckle and lick your chin as best you can. You’ll just have to get better, if [heshe]’s going to keep on serving you up a bounty like this.", parse);
					Text.NL();
					Text.Add("<i>“Well, you know what they say, practice makes perfect, so just keep sucking my dick and you’ll eventually get it.”</i> [HeShe] chuckles", parse);
					Text.NL();
					Text.Add("For [himher]? You’d be happy to practice as much as [heshe] wants.", parse);
					Text.NL();
					if(terry.Slut() < 15) {
						Text.Add("<i>“Well, I guess I’d best get off and let you clean that up.”</i>", parse);
						Text.NL();
						Text.Add("You almost want to protest, but the truth is your stomach is a little sensitive. So, you nod your agreement to Terry’s statement, and the [foxvixen] carefully hops off of you.", parse);
						Text.NL();
						Text.Add("Once Terry is up, you take a deep breath to steel yourself, and then start to clamber upright. Terry is quick to step in and lend you a hand to get upright, and then produces a towel for you to wipe yourself off with.", parse);
					}
					else {
						Text.Add("<i>“Come here then, let me help you clean up,”</i> Terry says, bending over to lick your chin clean.", parse);
						Text.NL();
						Text.Add("You start to chuckle, but you're quickly stifled as Terry’s tongue slurps over your lips and plunges inside without hesitation. You moan softly as the [foxvixen] greedily devours your mouth, [hisher] tongue easily wrestling your own tired tongue into submission despite your efforts.", parse);
						Text.NL();
						Text.Add("Lost in the kiss, you reach up and gently stroke [hisher] long, luscious locks. When [heshe] breaks the kiss, you sigh softly.", parse);
						Text.NL();
						Text.Add("<i>“There, all clean,”</i> [heshe] states, caressing your cheek and then getting back on [hisher] feet.", parse);
						Text.NL();
						Text.Add("You just chuckle softly, and pull yourself upright, with a little help from Terry’s offered hand, of course.", parse);
					}
				}
				
				terry.slut.IncreaseStat(45, 1);
			}
			else {
				Text.Add("No ordinary lover could hope to keep up with the jizz-volcano that is Terry’s erupting stallionhood. But you are no ordinary lover; your throat trained to take semen pouring down it like a flash flood, your stomach accustomed to the feel of hot jism splattering against its walls, your tongue delighting in the rich saltiness of dickcream...", parse);
				Text.NL();
				Text.Add("You meet Terry’s climax suckle for spurt, gulp for gush. The taste of [himher] floods your senses and makes your head spin; [heshe] tastes so <b>good</b>! Greedily, you guzzle all [heshe] has to give you; the feel of your belly stretching to hold it all sends pleasure washing through your nerves and drenches your brain, making you suck all the harder. You want it all - you <b>need</b> it all!", parse);
				Text.NL();
				Text.Add("Terry gasps and groans, eager to feed your insatiable appetite for [hisher] seed, but even [hisher] bountiful balls have their limits. They surrender first in light of your fierce hunger.", parse);
				Text.NL();
				Text.Add("Slowly, the tidal wave begins to ebb, until only a few pitiful trickles slide down your throat. Still wrapped up in the euphoria, you suckle a little harder, but all that it elicits are a few soft moans from your lover. Forced to admit there’s nothing left, you do your best to lick Terry’s cock clean and then open your mouth so that [heshe] can slide it out.", parse);
				Text.NL();
				Text.Add("<i>“Ahh, that was great,”</i> Terry remarks, pulling away.", parse);
				Text.NL();
				Text.Add("You grin and assure [himher] that you endeavor to please, stifling a burp.", parse);
				Text.NL();
				if(terry.Relation() < 30) {
					Text.Add("<i>“I suppose you want me to get off of you?”</i>", parse);
					Text.NL();
					Text.Add("With a nod, you agree that would probably be for the best.", parse);
					Text.NL();
					Text.Add("Terry wastes no time in complying, extending a helping hand to help you up.", parse);
					Text.NL();
					Text.Add("You happily accept it and are soon upright again, your over-stuffed stomach quietly sloshing before its contents settle down again.", parse);
				}
				else if(terry.Relation() < 60) {
					Text.Add("<i>“Impressive, you drank all of it! And not a drop spilled to boot.”</i>", parse);
					Text.NL();
					Text.Add("Naturally. You’re not some scared little virgin; you know your way around a cock. Even one as big and juicy as Terry’s.", parse);
					Text.NL();
					Text.Add("<i>“Ha! Don’t get cocky now. One of these days I might decide to one-up you and then we’ll see how much you can handle.”</i>", parse);
					Text.NL();
					Text.Add("You chuckle softly. Sounds like it could be fun, but at the moment, it looks like [heshe]’s all empty.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, for now. Gimme a bit and I’ll have a fresh load for you tho,”</i> [heshe] replies, rubbing your soft mounds together and stroking [hisher] shaft in the process.", parse);
					Text.NL();
					Text.Add("You groan luxuriantly at the [foxvixen]’s touch, and then shake your head. As fun as that sounds, you do have other things you need to do right now. Would [heshe] mind getting off, please?", parse);
					Text.NL();
					Text.Add("<i>“Alright then. Maybe another time?”</i>", parse);
					Text.NL();
					Text.Add("You nod and assure [himher] that you’ll look forward to it.", parse);
					Text.NL();
					Text.Add("Terry promptly gets back on [hisher] feet and hops off. Then [heshe] turns to you and offers you a helping hand.", parse);
					Text.NL();
					Text.Add("You gladly reach out for it, allowing the [foxvixen] to support you as you clamber upright. Your stomach visibly ripples and churns at the motion before settling down once you stop moving.", parse);
				}
				else {
					Text.Add("<i>“I trust your meal was adequate, [sir]?”</i>", parse);
					Text.NL();
					Text.Add("You playfully purse your lips and feign thinking about it. Well, the taste was exquisite, the server attentive... you drum your fingertips on your bulging stomach and cheekily proclaim that the servings maybe could have been a little more generous, but all in all, you thought the meal was quite delightful.", parse);
					Text.NL();
					Text.Add("Terry laughs at your reply. <i>“More generous, huh? Those are fighting words, [playername].”</i>", parse);
					Text.NL();
					Text.Add("Oh, really? So what is [heshe] doing to do about them, hmm?", parse);
					Text.NL();
					Text.Add("<i>“For now, nothing. But I’ll strike when you least expect it, just you wait.”</i> Terry grins. <i>“My vengeance shall be swift and merciless.”</i>", parse);
					Text.NL();
					Text.Add("Oh, now you’re just terrified. You chuckle softly, undercutting any seriousness that might have slipped through your playful tone. Now, how about [heshe] hops up, hmm? As much as you like to cuddle your lovely pet, this isn’t the best position to do so from.", parse);
					Text.NL();
					Text.Add("<i>“Really, because I feel pretty comfy up here,”</i> [heshe] teasingly replies, even adjusting [himher]self on top of you for emphasis.", parse);
					Text.NL();
					Text.Add("You heave an exaggerated sigh, rolling your eyes. Looking Terry squarely in the eyes, you tell [himher], <i>“Off. Now.”</i> The firm tone of your voice isn’t enough to trigger the collar, but it does make it glow in warning.", parse);
					Text.NL();
					Text.Add("<i>“Aww, you’re no fun.”</i> Terry pouts, finally complying. Once [heshe]’s off you, [heshe] offers a helping hand.", parse);
					Text.NL();
					Text.Add("With Terry’s help, you soon join [himher] in the ranks of the upright, even if it is a little harder to get up than you anticipated. You have gained quite a lot of weight in the past few minutes, after all. But never mind, it was worth it, and besides, you’ll slim down soon enough.", parse);
					if(terry.flags["vengeance"] < Terry.Vengeance.Triggered)
						terry.flags["vengeance"] = Terry.Vengeance.Triggered;
				}
			}
			Text.Flush();
			
			player.AddSexExp(2);
			terry.AddSexExp(2);
			
			world.TimeStep({hour: 1});
			
			Gui.NextPrompt();
		}
		else if(terry.HorseCock()) {
			if(terry.Relation() < 30) {
				Text.Add("Terry begins by straddling you, then pushing [hisher] stallionhood down to make it level with your [face].", parse);
				Text.NL();
				Text.Add("Sensing [hisher] hesitation, you grab [himher] by the hips and pull [himher] towards you, smiling when you feel the flat tip of [hisher] pre-cum leaking [tcock] touch your lips.", parse);
				Text.NL();
				parse["v"] = terry.FirstVag() ? ", despite having a hint of female due to Terry’s womanly bits currently soaking your torso" : "";
				Text.Add("Being this close to Terry’s shaft, you can smell [hisher] musk. A heady male musk[v].", parse);
				Text.NL();
				Text.Add("You can feel your mouth watering already, and without hesitation, you grip Terry’s butt and pull [himher] towards you, opening your maw to take in [hisher] flat tip.", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("Terry grins as [heshe] straddles you, stroking [hisher] equine prick and milking a few drops of pre that slide along the length of [hisher] shaft. <i>“Here’s your order, [sir],”</i> [heshe] says teasingly.", parse);
				Text.NL();
				Text.Add("Hmm, it all seems to be in order, but you won’t know until you’ve tasted it. Terry’s not getting tipped unless [heshe] gets all points right.", parse);
				Text.NL();
				Text.Add("<i>“Oh, [playername], for you? Just open wide and I’ll show you <b>all</b> the points. Can’t disappoint my favorite customer, can I?”</i>", parse);
				Text.NL();
				Text.Add("Indeed, [heshe] can’t. Now then, it’s time for your snack! You open wide and let your tongue loll out as you welcome Terry’s [tcock] into your mouth.", parse);
			}
			else {
				Text.Add("Terry wastes no time straddling you and leaning down to give you a passionate kiss.", parse);
				Text.NL();
				Text.Add("[HeShe] makes sure to explore every inch of your mouth before finally breaking with a sigh. <i>“Just making sure you’re wet enough for this. Chafing’s not good, y’know?”</i>", parse);
				Text.NL();
				Text.Add("Sure, it’s not like you have saliva to keep your own mouth wet, you reply sarcastically.", parse);
				Text.NL();
				Text.Add("<i>“Very tasty saliva, I’ll add,”</i> [heshe] says, giggling and licking [hisher] chops.", parse);
				Text.NL();
				Text.Add("Good, but if you recall correctly, you ordered Terry to give you something tasty for yourself. One might think [heshe]’s stalling instead of doing what [heshe] was ordered…", parse);
				Text.NL();
				Text.Add("Terry moans as [hisher] collar begins glowing dimly, the effects of the collar’s magic already apparent in [hisher] pulsating, leaking horsehood.", parse);
				Text.NL();
				Text.Add("<i>“Alright, alright. No more stalling. Open wide and say aaah.”</i>", parse);
				Text.NL();
				Text.Add("You do just as [heshe] asked, and before you can even so much utter a syllable, the [foxvixen] stuffs your mouth with the flat tip of [hisher] stallionhood.", parse);
			}
			Text.NL();
			
			Sex.Blowjob(player, terry);
			player.FuckOral(player.Mouth(), terry.FirstCock(), 2);
			terry.Fuck(terry.FirstCock(), 2);
			
			Text.Add("The [foxvixen]’s taste floods your taste buds, a rich and creamy flavor that makes you hungry for more. Almost on reflex, your hands fly to Terry’s shaft, stroking [hisher] horse-dick, milking more of [hisher] precious load.", parse);
			Text.NL();
			Text.Add("Above you, Terry’s panting already, [hisher] hands gripping your shoulders for support. ", parse);
			if(terry.Relation() < 30)
				Text.Add("[HeShe] yips and groans as you continue to milk [hisher] shaft, but otherwise stays silent.", parse);
			else {
				parse["r"] = terry.Relation() >= 60 ? ", especially when I still haven’t carried out my orders" : "";
				Text.Add("<i>“E-easy there, [playername]. Not going anywhere[r],”</i> [heshe] teases.", parse);
			}
			Text.NL();
			Text.Add("You chuckle in response, sending vibrations rippling through [hisher] tip - the reward for your efforts is a fresh spurt of pre. Not keen on wasting such bounty, you immediately put your [tongue] to work and begin licking around Terry’s glans, tracing every single detail on that flat tip of [hishers].", parse);
			Text.NL();
			Text.Add("[HeShe] moans demurely, hips starting to move seemingly on their own. With slow, but needful, pumps. ", parse);
			if(player.Slut() < 30) {
				Text.Add("Normally, this would be fine for you, but you’re feeling a bit adventurous. You decide to give [hisher] cumvein an experimental lick.", parse);
			}
			else {
				if(terry.Relation() >= 30)
					Text.Add("Terry should know you better than that though. ", parse);
				Text.Add("This isn’t nearly enough to satisfy you, you need more! Without delay, you press your [tongue] against [hisher] cumvein and lick the inside of [hisher] urethra.", parse);
				if(terry.sexlevel >= 3)
					Text.Add(" You undulate and tease as far as you can reach, stimulating that opening with all your expertise.", parse);
			}
			Text.NL();
			Text.Add("Terry gasps and thrusts carelessly into your maw, perhaps a bit more forceful than [heshe] intended. It hurts a bit as it hits the back of your throat, ", parse);
			if(player.sexlevel < 5)
				Text.Add("and you wind up gagging as [heshe] spews forth a rope of pre straight down your throat, but thankfully [heshe] pulls out right afterwards.", parse);
			else
				Text.Add("but your trained mouth prevents any real damage. You just wind up swallowing a small rope of pre that [heshe] spews down your throat, not that this wasn’t the original plan anyway...", parse);
			Text.NL();
			Text.Add("Looking up, you gaze at Terry’s face as it turns from apologetic to lustful, almost desperately so. The reason is clear: [hisher] collar must’ve taken this reaction of [hishers] as an attempt to hurt you. As the dim glow fades, you can’t help but chuckle as [heshe] increases the speed of [hisher] pumping.", parse);
			Text.NL();
			Text.Add("Each time [heshe] pulls back, [hisher] cock spurts a coating of pre on your [tongue], lubing it up as [heshe] thrusts back inside your mouth. The added slickness mixed with your saliva allows [himher] to move ever faster, and you help [himher] along with encouraging pumps on [hisher] exposed shaft.", parse);
			Text.NL();
			Text.Add("Terry’s cock grows ever harder, [hisher] veins more pronounced against your tongue, the throbs become more intense and more frequent. It doesn’t take a master to figure out [heshe]’s just about to blow.", parse);
			Text.NL();
			Text.Add("<i>“[stuttername]! I’m going to- Ahn!”</i>", parse);
			Text.NL();
			Text.Add("Cum, yes. You’d tell [himher] to just let go and give you what you want, but you can’t really speak with a mouthful of horse-cock, so you decide you’ll have to show [himher] instead.", parse);
			Text.NL();
			if(player.sexlevel < 3) {
				Text.Add("You grip [hisher] shaft, spreading your fingers to trace along [hisher] veins as you begin working them to truly milk [hisher] shaft.", parse);
				Text.NL();
				Text.Add("<i>“Aaaahn!”</i> Terry cries out, half screaming, half moaning. As [hisher] [tcock] bulges out with the liquid torrent coursing within.", parse);
			}
			else if(player.sexlevel < 5) {
				Text.Add("With one hand, you grab [hisher] shaft, teasing [hisher] most sensitive spots. With the other hand, you grab [hisher] heavy balls, so full of cum they can barely contain all that tasty cream within.", parse);
				Text.NL();
				Text.Add("You fondle, roll them around, gently hefting them and letting go. Each time [hisher] balls become more and more taut, until you feel them practically churn under your touch. [HisHer] shaft bulging out with the imminent climax, tensing inside your mouth.", parse);
			}
			else {
				Text.Add("You suddenly grab [hisher] butt, spreading [hisher] cheeks apart.", parse);
				Text.NL();
				Text.Add("<i>“[playername]! Whaaaahn!”</i> Terry’s confusion turns into a moan of pure bliss as you stick your middle and index fingers inside [hisher] tight butthole, pushing deep inside to find that special spot hidden within.", parse);
				Text.NL();
				Text.Add("The effect is immediate. Terry’s stallionhood becomes impossibly hard, tensing and bulging out as the first jet spills into your mouth even before [hisher] ball are done churning.", parse);
			}
			Text.NL();
			
			var cum = terry.OrgasmCum();
			
			Text.Add("The torrential flood of white, hot, creamy fox-cum that follows fills your jaws in no time. Terry is absolutely delirious with pleasure, unable to do anything but thrust [himher]self as deep into your maw as [heshe] can.", parse);
			Text.NL();
			if(player.sexlevel < 3) {
				Text.Add("There’s simply no way you can contain the [foxvixen]’s jets. Each time [heshe] shoots inside you, it feels like a volcano’s erupting. It’s tasty, yes, but the quantity is a bit much. You don’t even know how you manage to take more than one jet as the second one threatens to brute force its way past your throat and into your belly.", parse);
				Text.NL();
				Text.Add("The third load is what proves to be your undoing. Already gagging from having more than a few inches of horse-meat shoved past your lips, you can’t stop yourself from pushing Terry away and withdrawing as some of [hisher] cream goes down the wrong pipe, nearly choking you with its sheer volume.", parse);
				Text.NL();
				Text.Add("You cough and sputter, trying to clear your throat as Terry’s cum continues to rain down on your face. The [foxvixen] having since lost [hisher] balance after you pushed [himher] can do nothing but shudder in bliss as [hisher] cock continues to shoot up in the air.", parse);
				Text.NL();
				Text.Add("When [heshe]’s finally done, you’re left completely soaked in [hisher] cum. The white, creamy liquid covering you like a layer of paint. Terry [himher]self is left panting, [hisher] legs and tummy splattered with [hisher] own messy orgasm.", parse);
				Text.NL();
				Text.Add("You give [himher] a few minutes, watching as [hisher] limping equine prick towers over you. Once you’ve caught your breath, you tap Terry’s thigh, instructing [himher] to get up.", parse);
				Text.NL();
				if(terry.Relation() < 30) {
					Text.Add("The [foxvixen] groans in protests, but does as you said, getting back on [hisher] wobbly feet and looking down at your cum-soaked visage.", parse);
					Text.NL();
					Text.Add("<i>“Err, sorry about that...”</i>", parse);
					Text.NL();
					Text.Add("It’s alright, you tell [himher]. This is what you wanted, even most of it ended <i>on</i> you rather than <i>in</i> you. You swipe a glob with your finger and take it to your lips, humming appreciatively at the taste. [HeShe]’s one tasty [foxvixen], you tell [himher].", parse);
					Text.NL();
					Text.Add("<i>“Hehe, thanks.”</i> [HeShe] grins.", parse);
					Text.NL();
					Text.Add("Now then, you should probably take care of all this mess… or have Terry take care of it, since most of it <i>is</i> [hishers] anyway...", parse);
				}
				else if(terry.Relation() < 60) {
					Text.Add("<i>“Hmm, can’t we stay like this a while longer?”</i>", parse);
					Text.NL();
					Text.Add("Considering dry cum is a pain to clean? Nope.", parse);
					Text.NL();
					Text.Add("<i>“Okay, okay, getting up...”</i> [HeShe] slowly collects [himher]self and gets back on [hisher] feet, then immediately laughs as [heshe] sees you.", parse);
					Text.NL();
					Text.Add("<i>“What’s this, [playername]? Bit more than you could chew?”</i>", parse);
					Text.NL();
					Text.Add("Hardy har har, you roll your eyes.", parse);
					Text.NL();
					Text.Add("<i>“It’s a nice look though, pretty sexy.”</i>", parse);
					Text.NL();
					Text.Add("Right… but sexy or not, someone is going to have to clean all of this up, you tell [himher].", parse);
					Text.NL();
					Text.Add("Terry simply shrugs. <i>“I don’t mind cleaning if you want me to, sure was fun making the mess tho.”</i>", parse);
					Text.NL();
					Text.Add("Well...", parse);
				}
				else {
					Text.Add("Terry stirs, moving [hisher] legs and gently caressing your cummy face with a foot.", parse);
					Text.NL();
					Text.Add("To drive the point home and get [himher] off you before all [hisher] cum dries, you bite [hisher] toe.", parse);
					Text.NL();
					Text.Add("<i>“Ouch!”</i> This gets the [foxvixen] moving, and [heshe] immediately gets off you, chuckling despite [himher]self.", parse);
					Text.NL();
					Text.Add("<i>“Oh, come on. [playername]. It’s not my fault you couldn’t drink it all.”</i>", parse);
					Text.NL();
					Text.Add("Doesn’t mean [heshe] should rub it in.", parse);
					Text.NL();
					Text.Add("[HeShe] simply laughs in reply. <i>“Alright, alright. I’m sorry,”</i> [heshe] says, crawling to give you a kiss and lick a stray glob off your nose. <i>“Better?”</i>", parse);
					Text.NL();
					Text.Add("...Okay, you’ll forgive [himher]... this time!", parse);
					Text.NL();
					Text.Add("<i>“That’s what you say, but we both know I got you wrapped around my finger,”</i> [heshe] teases back.", parse);
					Text.NL();
					Text.Add("Cheeky [foxvixen]...", parse);
					Text.NL();
					Text.Add("<i>“So, you want help cleaning up or you just want to marinate in my juices?”</i>", parse);
					Text.NL();
					Text.Add("Hmm...", parse);
				}
				Text.Flush();
				
				world.TimeStep({minute: 30});
				
				Scenes.Terry.TerryCleansPC();
			}
			else if(player.sexlevel < 5) {
				Text.Add("It’s a bit tough, but somehow you find a rhythm where you can manage to swallow most of Terry’s prodigious load. Sure, some of it manages to escape the sides of your mouth, but most of it winds up where it belongs: inside your belly.", parse);
				Text.NL();
				Text.Add("You continue lightly stroking and fondling Terry’s balls, feeling as their weight dissipates with each new jet of cum. Eventually, the flow tapers and you release Terry’s sexy bits, grabbing [hisher] sides instead to hold [himher] up.", parse);
				Text.NL();
				Text.Add("Gently, you lay [himher] down on [hisher] side, right next to you.", parse);
				Text.NL();
				if(terry.Relation() < 30) {
					Text.Add("<i>“Uuuh...”</i>", parse);
					Text.NL();
					Text.Add("From the looks of it, Terry is completely spent. You sigh to yourself, then pat your [belly]. Slowly, you scoot closer to Terry and hug [himher] gently from behind, spooning [himher].", parse);
					Text.NL();
					Text.Add("The two of you stay like this until you’re good enough to get up and go about your business.", parse);
				}
				else if(terry.Relation() < 60) {
					Text.Add("<i>“That was… amazing. I came really hard...”</i>", parse);
					Text.NL();
					Text.Add("You smile. So [heshe] really liked that, huh?", parse);
					Text.NL();
					Text.Add("<i>“Of course I did, you’re really good at this. Although even as good as you are, I see you still managed to spill a little,”</i> [heshe] says, chuckling and pointing at a strand of cum on the side of your mouth. You immediately swipe the glob, shoving your sticky finger into the talkative [foxvixen]’s own mouth.", parse);
					Text.NL();
					if(terry.Slut() < 15) {
						Text.Add("Taken by surprise, Terry coughs and sputters. <i>“Hey! It’s you who wanted a taste, not me!”</i> [heshe] protests.", parse);
						Text.NL();
						Text.Add("That’ll teach [himher] to keep [hisher] mouth shut...", parse);
					}
					else {
						Text.Add("Despite the initial surprise, Terry quickly adapts and begins sucking on your finger. [HeShe] fellates it as if it was a cock, using [hisher] tongue to expertly lick your digit from root to tip. The display is kinda hot… and [heshe] only stops when you pull out.", parse);
						Text.NL();
						Text.Add("<i>“Hmm, yeah. I’d say I’m pretty tasty myself,”</i> [heshe] teases. <i>“But I think I’d enjoy something from you more, maybe you got something I could [suckLick]?”</i> [heshe] asks teasingly.", parse);
						Text.NL();
						Text.Add("...Maybe later, you reply.", parse);
						
						player.AddLustFraction(0.25);
					}
					Text.NL();
					Text.Add("<i>“Hmm, feeling a bit worn out after this. Think we got enough time to rest for a spell?”</i>", parse);
					Text.NL();
					Text.Add("Sure, you could use some rest too. At least while you digest your snack.", parse);
					Text.NL();
					Text.Add("<i>“Hehe, alright then.”</i>", parse);
					Text.NL();
					Text.Add("With that said, Terry settles down beside you, closing [hisher] eyes for a short nap. You follow in [hisher] lead.", parse);
				}
				else {
					Text.Add("<i>“Aah, that really hit the spot. I even feel lighter after cumming this much… and you? Did you enjoy your treat, [playername]?”</i>", parse);
					Text.NL();
					Text.Add("Very much so, you say, patting your [belly].", parse);
					Text.NL();
					Text.Add("<i>“I’m glad… Though I see you missed some over here,”</i> Terry adds, pointing at a strand that escaped out of the corner of your mouth.", parse);
					Text.NL();
					Text.Add("Before you can move to swipe it clean, Terry leans over and licks it off your chin. Then proceeds to kiss you, feeding you the missed strand with a passionate, if short, kiss.", parse);
					Text.NL();
					Text.Add("<i>“There. That’s better now.”</i>", parse);
					Text.NL();
					Text.Add("Smiling, you hug [himher] close, pressing your bodies together and basking into each other’s warmth.", parse);
					Text.NL();
					Text.Add("<i>“Time out for cuddling and napping?”</i>", parse);
					Text.NL();
					Text.Add("Sounds like a plan...", parse);
				}
				Text.Flush();
				
				world.TimeStep({hour: 1});
				
				terry.relation.IncreaseStat(70, 1);
				
				Gui.NextPrompt();
			}
			else {
				Text.Add("As experienced as you are, dealing with Terry’s prodigious load is no issue. No matter how fast [heshe] shoots, you still find time to savor every last drop of [hisher] precious fox-seed before gulping it down.", parse);
				Text.NL();
				Text.Add("Up above, you watch Terry go through a range of <i>pleasure faces</i>. Sometimes [heshe] has a cute pout, other times [heshe]’s biting [hisher] lower lip, and there’s the hissing groan, and even the ‘<i>this is so good</i>’ tongue-lolling-out gasp. It’s like watching a private show.", parse);
				Text.NL();
				Text.Add("The flow of cum starts to taper ever so slightly, but you’re pretty sure Terry is capable of more, [heshe] just needs the appropriate incentive. Withdrawing one of your hands from [hisher] cute butt, you make a ring with your finger at the base of [hisher] swollen knot, gently giving it a few tugs.", parse);
				Text.NL();
				Text.Add("With your other hand still firmly lodged inside Terry’s ass, you begin massaging [hisher] prostate in slow circles, pressing down to grind your fingertips and force just a little extra semen out of [hisher] cum-factory.", parse);
				Text.NL();
				Text.Add("Sure enough, [hisher] flow grows in intensity. [HeShe]’ll still run out eventually, but this little push will make sure you’re both extra-satisfied by the end of it.", parse);
				Text.NL();
				Text.Add("Only when you feel Terry has truly spent every little droplet of [hisher] cargo do you let go of the [foxvixen]’s already limping horse-cock, licking your lips to savor the lingering taste as you hold on to Terry and sit yourself up.", parse);
				Text.NL();
				if(terry.Relation() < 30) {
					Text.Add("Terry pants heavily, seems like feeding your hunger was pretty exhausting for the petite [foxvixen]. That being the case, you decide it’s best to lay [himher] down gently on the ground and let [himher] catch [hisher] breath.", parse);
					Text.NL();
					Text.Add("It takes a bit, but eventually [hisher] breathing does steady out. You simply smile down at [himher], patting your belly and thanking [himher] for the meal.", parse);
					Text.NL();
					Text.Add("<i>“...Wow… err… you’re welcome?”</i> [heshe] says nervously.", parse);
					Text.NL();
					Text.Add("You stroke [hisher] side and tell [himher] there’s no need to be nervous. [HeShe] only did as you asked.", parse);
					Text.NL();
					Text.Add("<i>“Right, thanks. I liked this… a lot.”</i>", parse);
					Text.NL();
					Text.Add("You could tell, you reply. But [heshe] must be feeling tired still, so how about [heshe] takes a little nap to recover? You’ll keep watch while [heshe] sleeps.", parse);
					Text.NL();
					Text.Add("<i>“That’d be good, thanks.”</i> [HeShe] smiles, letting [hisher] eyes drift closed.", parse);
					Text.NL();
					Text.Add("Good, this also gives you time to digest some of [hisher] seed before you set out.", parse);
				}
				else if(terry.Relation() < 60) {
					Text.Add("You hold Terry close, stroking [hisher] back and watching [hisher] fluffy tail sway to and fro. It takes a bit, but [heshe] eventually hugs you back, steadying [hisher] breathing in the process.", parse);
					Text.NL();
					Text.Add("<i>“That felt amazing,”</i> [heshe] says, still panting slightly.", parse);
					Text.NL();
					Text.Add("You aim to please, you reply.", parse);
					Text.NL();
					Text.Add("<i>“We should do this more often...”</i>", parse);
					Text.NL();
					Text.Add("No disagreement there. Terry is one tasty [foxvixen], and you’d love to sample [himher] again.", parse);
					Text.NL();
					Text.Add("[HeShe] laughs softly. <i>“Is that all I am to you? Some delicacy you can snack on when your perverted urges rise to the fore?”</i>", parse);
					Text.NL();
					Text.Add("<i>Fine</i> delicacy, you correct [himher], the <i>fine</i> part is important. And you don’t snack on [himher], you nibble and sip [himher]. Terry is way too tasty to wolf down all at once… though you’ll admit that has its own appeal.", parse);
					Text.NL();
					Text.Add("[HeShe] laughs at your teasing remarks. <i>“Alright, alright, you perverted jackass. Now I’m afraid this <b>fine</b>,”</i> [heshe] stresses, <i>“delicacy has to rest for a bit... you drained me so hard that even my balls feel sore...”</i>", parse);
					Text.NL();
					Text.Add("Hmm, okay. [HeShe] can rest as much as [heshe] wants. You’ll keep watch over the two of you, in that case.", parse);
					Text.NL();
					Text.Add("Terry pulls away to look you in the eyes. <i>“Thanks, [playername].”</i>", parse);
					Text.NL();
					Text.Add("No problem, you reply, pulling [himher] back into your embrace and letting [himher] settle down against you as [heshe] rests for a spell.", parse);
				}
				else {
					Text.Add("You hold Terry close, nuzzling [himher] and kissing along [hisher] neck while the [foxvixen] recuperates.", parse);
					Text.NL();
					Text.Add("<i>“Huff… huff… that was pretty intense,”</i> [heshe] comments.", parse);
					Text.NL();
					Text.Add("You chuckle and tell [himher] you’re glad [heshe] enjoyed [himher]self.", parse);
					Text.NL();
					Text.Add("<i>“Yep, I really did. And what you about you, my perverted [mastermistress]? How did you enjoy your meal? I worked really hard to make all that, just for you,”</i> [heshe] says with a smirk.", parse);
					Text.NL();
					Text.Add("Hmm, you tap your chin in mock thought. The texture was creamy, the flavor was exquisite, but [heshe] could use some work on the quantity and stamina departments, you reply teasingly.", parse);
					Text.NL();
					Text.Add("<i>“Careful what you wish for, [playername]. You might wind up just getting it. I’ll have you know that I’m pretty competitive, and this won’t be able to handle all of me if I do go all out,”</i> [heshe] says, patting your [belly].", parse);
					Text.NL();
					Text.Add("Interesting… that almost sounded like a challenge…", parse);
					Text.NL();
					Text.Add("<i>“It is a challenge! I can be pretty crafty; I’ll find a way to outdo you, just you wait.”</i>", parse);
					Text.NL();
					Text.Add("Oooh, you’re shaking in your boots, you reply mockingly.", parse);
					Text.NL();
					Text.Add("<i>“You’d better. I’ll get back at you when you least expect it.”</i> [HeShe] sighs. <i>“For now, can we take some time off? I’m really feeling tired.”</i>", parse);
					Text.NL();
					Text.Add("Of course, you wouldn’t want your pretty [foxvixen] pet to die out on you.", parse);
					Text.NL();
					Text.Add("<i>“Thanks, [playername]. Then how about we cuddle for a bit?”</i>", parse);
					Text.NL();
					Text.Add("Cuddling is fine, maybe [heshe]’d also like a massage? Maybe make out?", parse);
					Text.NL();
					Text.Add("Terry giggles at your reply. <i>“Aren’t you a clingy bastard? But fine, I love you despite your flaws. And I’ll say yes to both the massage and the making out.”</i> [HeShe] grins.", parse);
					Text.NL();
					Text.Add("You grin back and lie down on the ground, pulling [himher] on top of you and kissing [himher] lovingly as the two of you enjoy each other and recover from your past activities.", parse);
					if(terry.flags["vengeance"] < Terry.Vengeance.Triggered)
						terry.flags["vengeance"] = Terry.Vengeance.Triggered;
				}
				Text.Flush();
				
				world.TimeStep({hour: 1});
				
				terry.relation.IncreaseStat(70, 1);
				
				Gui.NextPrompt();
			}
		}
		else {
			if(terry.Relation() < 30) {
				Text.Add("Terry carefully straddles you, [hisher] foxhood already erect and throbbing with need.", parse);
				Text.NL();
				Text.Add("You wait for a bit, but when Terry doesn’t seem to be moving, you call out to [himher].", parse);
				Text.NL();
				Text.Add("<i>“Huh?”</i> [HeShe] snaps, looking at you.", parse);
				Text.NL();
				Text.Add("You can’t really do much with [himher] so far away…", parse);
				Text.NL();
				Text.Add("<i>“Oh, sorry,”</i> [heshe] says, immediately moving closer.", parse);
				Text.NL();
				if(player.FirstBreastRow().Size() > 5) {
					Text.Add("[HeShe] stops as soon as [heshe] feels [hisher] balls touch your [breasts]. <i>“Umm...”</i>", parse);
					Text.NL();
					Text.Add("There’s no need to be embarrassed, you tell [himher]. And while you’re not exactly opposed to let [himher] play with your breasts, this also isn’t exactly what you asked for…", parse);
					Text.NL();
					Text.Add("<i>“Hehe, sorry...”</i> [heshe] says, offering an embarrassed smile. Then [heshe] promptly maneuvers [himher]self, stopping when [hisher] pointy cock-tip is just barely touching your lips.", parse);
					Text.NL();
					Text.Add("That’s more like it...", parse);
				}
				else {
					Text.Add("[HeShe] stops barely an inch away from your [face], still looking a bit nervous about all this.", parse);
					Text.NL();
					Text.Add("Relax, you tell [himher]. You’re just going to suck [himher] off, not test [himher] or anything like that.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, sorry. But I’m kinda worried about this,”</i> [heshe] says, giving [hisher] collar a small tug.", parse);
					Text.NL();
					Text.Add("The collar won’t do anything, especially since [heshe]’s not doing anything against your will.", parse);
					Text.NL();
					Text.Add("<i>“Right. Umm, I guess you can start then?”</i>", parse);
					Text.NL();
					Text.Add("That’s more like it...", parse);
				}
			}
			else if(terry.Relation() < 60) {
				Text.Add("Terry straddles you, smiling down at you as [heshe] scoots closer, ", parse);
				if(player.FirstBreastRow().Size() > 5) {
					Text.Add("until [hisher] progress is impeded by your [breasts].", parse);
					Text.NL();
					Text.Add("Seems like [heshe] didn’t think things through, you tease [himher].", parse);
					Text.NL();
					Text.Add("The [foxvixen] chuckles. <i>“That seems to be the case, but you have to agree these are quite the obstacle,”</i> [heshe] teases back, gently fondling your [breasts].", parse);
					Text.NL();
					Text.Add("Hmm, you wouldn’t call them an obstacle, especially when [heshe] seems to be having so much fun playing with you. But you didn’t order a tittyfuck, you ordered tasty fox-flavored sausage...", parse);
					Text.NL();
					Text.Add("<i>“And you’ll get it,”</i> [heshe] agrees, maneuvering over your [breasts] to sit closer.", parse);
					Text.NL();
					Text.Add("[HeShe] sits barely an inch away from you, [hisher] vulpine prick almost touching your lips. <i>“Better now?”</i>", parse);
					Text.NL();
					Text.Add("Much better...", parse);
				}
				else {
					Text.Add("until [hisher] cock is almost touching your lips.", parse);
					Text.NL();
					Text.Add("<i>“Here’s your order, [sirmadam]!”</i> [heshe] says, trying [hisher] best to imitate a waiter.", parse);
					Text.NL();
					Text.Add("Well, the service isn’t half-bad, but will the food be up to par?", parse);
					Text.NL();
					Text.Add("<i>“I assure you it will, you have but to try, [sir].”</i>", parse);
					Text.NL();
					Text.Add("That sounds like a plan…", parse);
				}
			}
			else {
				Text.Add("Terry crawls on top of you, ", parse);
				if(player.FirstBreastRow().Size() > 5) {
					Text.Add("letting [hisher] cock nestle in the valley of your cleavage.", parse);
					Text.NL();
					Text.Add("You look down at Terry’s cock, then look back up at [himher]. You don’t remember ordering [himher] to tittyfuck you, you say.", parse);
					Text.NL();
					Text.Add("<i>“No, you didn’t. But some foreplay is always good, no?”</i> [heshe] teasingly replies, grabbing your breasts and pressing them to [hisher] shaft.", parse);
					Text.NL();
					Text.Add("A little foreplay is good, you purr, but not if [heshe] forgets what you wanted. You’d hate to have to remind [himher] of where that pretty little cock of [hishers] is supposed to go...", parse);
					Text.NL();
					Text.Add("<i>“No worries, I didn’t forget. But it’d be a shame not to play with these a little bit,”</i> [heshe] says with a smirk, bucking [hisher] hips to gently fuck your [breasts].", parse);
					Text.NL();
					Text.Add("You moan sharply as Terry’s dexterous fingers expertly tweak your [nips]. [HeShe] does have a point there... you just don’t want [himher] to get so wrapped up in your tits that [heshe] forgets the warm, wet, thirsty mouth waiting for [himher].", parse);
					Text.NL();
					Text.Add("Even if they <i>are</i> rather nice tits, if you do say so yourself.", parse);
					Text.NL();
					Text.Add("<i>“Okay, I guess this is my cue to get going with this. Otherwise your ego might just throw me off you,”</i> [heshe] teases, releasing your breasts and maneuvering [himher]self to bring [hisher] shaft close to your lips.", parse);
					Text.NL();
					Text.Add("Oh, you’re going to get [himher] back for that... not that you think [heshe]’ll mind, in the end.", parse);
				}
				else {
					Text.Add("stopping mere inches from your lips as [hisher] shaft is already poised to penetrate your mouth. You can even smell the pre-cum already beginning to bead on [hisher] pointy tip.", parse);
					Text.NL();
					Text.Add("<i>“Here you go, [playername]. All ready for a good sucking.”</i>", parse);
					Text.NL();
					Text.Add("It most certainly is, and you’re just the [boygirl] to provide one.", parse);
					Text.NL();
					Text.Add("<i>“Good, then let’s begin!”</i> [heshe] says, sitting down on your chest.", parse);
				}
			}
			Text.NL();
			Text.Add("Your hungry eyes run over the dainty form of Terry’s little fox-cock, drinking in every detail. This close to [himher], [hisher] musk fills your nose and you inhale hungrily.", parse);
			Text.NL();
			Text.Add("Terry starts as your hands sweep up, cupping the round, girly lushness of [hisher] butt. You rub the perky cheeks as you pull [himher] closer to your mouth. Your lips part and your [tongue] lolls out to gently caress [hisher] petite balls, stroking them and drawing them close enough to hungrily suckle on their soft sack-skin.", parse);
			Text.NL();
			Text.Add("[HeShe] moans atop you, crooning [hisher] pleasure as you lay sucking kisses on [hisher] balls, working your way to the base of [hisher] cock where you wetly lick up the shaft in a single slurp. [HisHer] pink flesh gleams wetly as you stroke back and forth with your tongue, polishing [hisher] little half-formed knot, before you open your mouth and engulf [himher] with one smooth motion.", parse);
			Text.NL();
			Text.Add("The [foxvixen] inhales sharply, trembling on your [breasts] as you swallow [himher]. Small as [heshe] is, [heshe] makes a perfect mouthful; even the knot doesn’t stop you from bobbing back and forth, letting it audibly pop between your lips before you gulp it down again.", parse);
			Text.NL();
			Text.Add("Your [tongue] whirls within the confine of your mouth, polishing every nook and cranny. You seek out every dip and divot, trace every vein, flick the pointed tip and otherwise mercilessly attack every sensitive spot that you can find.", parse);
			Text.NL();
			Text.Add("You moan wetly around the cock in your mouth, letting the muffled tones emphasize your hunger. You have a delicious treat, and you intend to savor it. Salaciously suckling, you plan on milking every last drop Terry has and drinking it all.", parse);
			Text.NL();
			Text.Add("<i>“[playername], I’m getting - ah! - close!”</i> [heshe] warns you.", parse);
			Text.NL();
			Text.Add("You can feel [himher] throbbing in your mouth as [hisher] knot is starting to swell against the [tongueTip] of your [tongue]. That’s good... but not good enough.", parse);
			Text.NL();
			Text.Add("Even as you continue suckling, your fingers start to move, rubbing the distracted [foxvixen]’s lovely ass, and then pushing into the canyon of [hisher] buttock cleavage. Terry yips and wriggles as you caress [hisher] tailhole, unintentionally thrusting deeper into your mouth as [heshe] shies away.", parse);
			Text.NL();
			Text.Add("But [heshe] is too wrapped up in the pleasure you are giving [himher] to fight you, allowing you to worm a finger inside. [HeShe] groans as you spread [himher], pushing deeper as you reach for [hisher] prostate.", parse);
			Text.NL();
			Text.Add("You can feel the effects within your mouth. The flow of pre-cum washing down your gullet increases steadily, [hisher] knot bulging ever larger. When you press something particularly soft, Terry practically jumps.", parse);
			Text.NL();
			Text.Add("The [foxvixen] tries to say something, but all that [heshe] manages is an inarticulate moan. The way [hisher] knot spreads to its full growth, pushing your mouth open, says it for [himher].", parse);
			Text.NL();
			Text.Add("You can’t really suck [himher] like this, but that’s alright; you’re more creative than that...", parse);
			Text.NL();
			Text.Add("Opening your mouth as wide as you can and pulling backwards, you manage to wriggle free. Terry’s shaft throbs in your vision, deep red in its engorgement. You grasp it just below the knot with your free [hand], holding it steady as you open your mouth and extend your tongue beneath it.", parse);
			Text.NL();
			
			var cum = terry.OrgasmCum();
			
			Text.Add("With your fingers, you thrust firmly into the mewling vulpine’s ass, ruthlessly stroking [hisher] prostate until, with a howl, [heshe] cums. [HisHer] glans distends before spurting forth a long, thick rope of seed that splatters onto your tongue and rolls down your throat. You gulp it down eagerly and keep milking [himher], coaxing another rope, and another.", parse);
			Text.NL();
			Text.Add("Terry bucks and whimpers, gasping as you coax [himher] into bleeding [himher]self dry into your mouth. Even with your finger right on [hisher] button, Terry’s petite balls just don’t hold that much. All too soon for your liking, Terry goes limp atop you; your touches keep [himher] still hard, but there’s not going to be any more gooey goodness.", parse);
			Text.NL();
			Text.Add("Mercifully, you pop your digit free of [hisher] clenched ass, allowing the moaning vulpine to slump onto your chest and rest.", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("<i>“T-that was pretty good,”</i> [heshe] admits.", parse);
				Text.NL();
				Text.Add("Only pretty good? Playfully, you note that from where you were sitting, [heshe] looked to be loving it.", parse);
				Text.NL();
				Text.Add("<i>“Well, okay. You do deserve the compliment, but now you’re just pushing it,”</i> [heshe] playfully replies.", parse);
				Text.NL();
				Text.Add("Chuckling, you concede the point. So long as [heshe] enjoyed it, that’s all that matters.", parse);
				Text.NL();
				Text.Add("<i>“Thanks for that, by the way.”</i>", parse);
				Text.NL();
				Text.Add("Licking your lips, you assure [himher] that it was a pleasure.", parse);
				Text.NL();
				Text.Add("<i>“Mind if we rest a little before going?”</i>", parse);
				Text.NL();
				Text.Add("You certainly don’t mind, and you allow the [foxvixen] to carefully lay [himher]self out on your body, using you as an impromptu bed.", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“How’d you like your service, [playername]?”</i> Terry asks with a grin, still panting despite [himher]self.", parse);
				Text.NL();
				Text.Add("You lick a stray smear from your lips and compliment [himher] on [hisher] efforts; some of the best service you’ve had in a while.", parse);
				Text.NL();
				Text.Add("<i>“Then how about a tip?”</i>", parse);
				Text.NL();
				Text.Add("Chuckling, you wave a finger. You think [heshe]’s already gotten one hell of a tip.", parse);
				Text.NL();
				Text.Add("<i>“Oh, come on! Just a little extra then. We’re buddy-buddy aren’t we? Spare some change? For your friend?”</i> [HeShe] grins, mirth practically oozing as [heshe] blinks [hisher] eyes inno - ...well, <i>innocently</i>.", parse);
				Text.NL();
				Text.Add("You think it over for a moment, and then reach up to pull Terry over, bringing [hisher] face close to yours. Your lips touch [hisher]s, tenderly kissing [himher] for a few heartbeats, and then releasing [himher].", parse);
				Text.NL();
				Text.Add("With a mischievous smile, you ask if that’s enough change for [himher].", parse);
				Text.NL();
				Text.Add("<i>“Hmm, I could use some more,”</i> [heshe] grins.", parse);
				Text.NL();
				Text.Add("Tutting, you shake a finger in gentle reproach. Well, if [heshe] wants more, [heshe]’ll have to earn some more.", parse);
				Text.NL();
				Text.Add("<i>“Aww… Alright then, and I suppose I’ll get my chance later?”</i>", parse);
				Text.NL();
				Text.Add("[HeShe] most certainly will.", parse);
				Text.NL();
				Text.Add("<i>“It’s set then, but for now… how about resting some?”</i>", parse);
				Text.NL();
				Text.Add("Reaching up, you hug the [foxvixen]. That sounds like a fine idea to you.", parse);
			}
			else {
				Text.Add("Terry sighs atop you, a dopey smile plastered on [hisher] face. <i>“That was amazing, [playername].”</i>", parse);
				Text.NL();
				Text.Add("Grinning proudly, you thank [himher] for the compliment. You wanted to make sure [heshe]’d remember this.", parse);
				Text.NL();
				Text.Add("<i>“Only this and the other hundred times we’ll do it?”</i> [HeShe] grins.", parse);
				Text.NL();
				Text.Add("Well, that goes without saying, doesn’t it?", parse);
				Text.NL();
				Text.Add("<i>“Can’t keep your hands off my tail, can you, lover-[boygirl]?”</i>", parse);
				Text.NL();
				Text.Add("Nope. It’s [hisher] own fault for having such a cute tail; it’s too irresistible <i>not</i> to touch.", parse);
				Text.NL();
				Text.Add("<i>“Well, if you want to get more of this ‘cute tail’, you’d better be ready to pay the toll.”</i> [HeShe] grins.", parse);
				Text.NL();
				Text.Add("And just what would that toll be, hmm?", parse);
				Text.NL();
				Text.Add("<i>“Guess,”</i> [heshe] says, closing [hisher] eyes and puckering [hisher] lips.", parse);
				Text.NL();
				Text.Add("Chuckling softly to yourself, you happily sweep the [foxvixen] into a passionate embrace, eagerly falling on [hisher] lips and crushing them with your own. The two of you cling together, softly murmuring wordless outbursts of lust as your tongues coil and twist together, breaking apart only when the need for air forces you.", parse);
				Text.NL();
				Text.Add("<i>“Guess I’m a bit more tired than I thought. I’m feeling really heavy right now.”</i>", parse);
				Text.NL();
				Text.Add("Smiling, you tenderly brush Terry’s hair and gently lay the [foxvixen] down atop you. If [heshe]’s tired, then [heshe] can just stay here and rest. You could use a little shut-eye yourself.", parse);
				Text.NL();
				Text.Add("<i>“Hmm, I’ll take you up on that offer,”</i> [heshe] replies, tail wagging softly as [heshe] looks up at you with loving eyes.", parse);
			}
			Text.Flush();
			
			terry.relation.IncreaseStat(70, 1);
			
			world.TimeStep({hour: 1});
			
			player.AddSexExp(2);
			terry.AddSexExp(2);
			
			Gui.NextPrompt();
		}
		
		player.AddLustFraction(0.25);
	});
}

Scenes.Terry.SexHaveADrinkBreasts = function() {
	var parse = {
		playername : player.name,
		foxvixen : terry.mfPronoun("fox", "vixen"),
		foxxyvixxy : terry.mfPronoun("foxxy", "vixxy"),
		handsomebeautiful : terry.mfPronoun("handsome", "beautiful"),
		noseSnout : player.HasMuzzle() ? "snout" : "nose",
		boygirl : player.mfTrue("boy", "girl"),
		guygirl : player.mfTrue("guy", "girl"),
		mastermistress : player.mfTrue("master", "mistress")
	};
	
	parse = terry.ParserPronouns(parse);
	parse = terry.ParserTags(parse, "t");
	parse = player.ParserTags(parse);
	
	Text.Clear();
	if(terry.Relation() < 30) {
		Text.Add("<i>“My breasts? That’s what you want?”</i>", parse);
		Text.NL();
		Text.Add("That’s right.", parse);
		Text.NL();
		Text.Add("<i>“Well, I can’t stop you, so go ahead,”</i> [heshe] says nonchalantly.", parse);
		Text.NL();
		Text.Add("Well, it’s good to see [heshe]’s so calm about this. Now then, if [heshe]’ll just lie down? Wouldn’t want [himher] to fall over while you’re milking [himher], after all.", parse);
		Text.NL();
		Text.Add("Terry rolls [hisher] eyes and sits down on the ground.", parse);
		Text.NL();
		Text.Add("Not exactly what you wanted, but a good start. Stepping forward, you place a hand on [hisher] shoulder and firmly push [himher] over, not stopping until [hisher] back is to the ground and you have [himher] pinned beneath you.", parse);
		Text.NL();
		Text.Add("With a bright smile, you declare that now you can begin. Terry just huffs quietly to [himher]self.", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“I figured. Had to be a reason you gave me these,”</i> [heshe] says, cupping [hisher] [tbreasts].", parse);
		Text.NL();
		Text.Add("Well, it’s one of the reasons, you’ll admit.", parse);
		Text.NL();
		Text.Add("<i>“Really?”</i> [heshe] asks with a snide grin.", parse);
		Text.NL();
		Text.Add("Now, now; no fishing for compliments, [heshe] knows you think [heshe]’s pretty. You step closer and take [himher] by the arm. So, if [heshe]’s okay with you milking [himher], then why don’t [heshe] continue being a good [foxvixen] and lie down for you, hmm? It’ll be much easier for both of you that way.", parse);
		Text.NL();
		Text.Add("<i>“Okay!”</i> [heshe] replies, letting you guide [himher] towards the floor. <i>“Like this?”</i>", parse);
		Text.NL();
		Text.Add("That’s just perfect, you purr, already lowering yourself over [hisher] upper torso.", parse);
	}
	else {
		Text.Add("<i>“Like a moth to the flame!”</i> Terry cheerfully says. <i>“Come on then, come to me.”</i> [HeShe] crooks a finger, inviting you over.", parse);
		Text.NL();
		Text.Add("Oh, with pleasure. You promptly pounce at the surprised [foxvixen], sending [himher] tumbling onto [hisher] back. You scramble over [hisher] body to pin [himher] beneath you.", parse);
		Text.NL();
		Text.Add("<i>“Oof! Or maybe you’re more like a big dumb puppy,”</i> [heshe] teases with a big grin.", parse);
		Text.NL();
		Text.Add("With a smirk of your own, you lean toward Terry’s ear and stage-whisper <i>“woof”</i>.", parse);
	}
	Text.NL();
	if(terry.Cup() <= Terry.Breasts.Acup) {
		Text.Add("Looking down at Terry’s petite chest, it’s actually hard to see what you have to work with at a quick glance. The cute little puffball of white fur that sprouts there is so large and round, it’s completely swallowed up the [foxvixen]’s budding breasts.", parse);
		Text.NL();
		Text.Add("With them tucked away in their little cocoon, you’ll have to let your fingers do the looking for you. Reaching forward, you allow your digits to begin their quest. Silken soft fluff wraps around your fingertips as you carefully push forward, each hand sinking deeper into the veil of fur hiding Terry’s perky breasts.", parse);
		Text.NL();
		Text.Add("It’s wonderfully smooth and fine to the touch; there are women who’d pay good money to wear fur like this themselves. You push back the smirk that thought brings on.", parse);
		Text.NL();
		Text.Add("You’re not here just to groom Terry’s chest-fluff, so you press on until you feel something solid pushing back against your fingertips. Tenderly pressing down, you feel it give just slightly at the pressure, and you tweak it with your fingertips.", parse);
		Text.NL();
		Text.Add("Terry yips suddenly at the pinch; looks like you’ve struck cleavage.", parse);
		Text.NL();
		Text.Add("You part [hisher] fur so you can rest your cheek against [hisher] pert breasts. Lying on [hisher] chest like this, you can’t help but feel closer to Terry.", parse);
		Text.NL();
		Text.Add("Slowly, you shut your eyes and rub your face against [himher], feeling the small nubs that are [hisher] nipples poke you on your [noseSnout]. For a moment, you just focus on the warmth emanating from the petite [foxvixen]; [hisher] heartbeat - always beating in a steady rhythm - soothes you.", parse);
		Text.NL();
		Text.Add("You grab a bunch of [hisher] chest fluff in your [hand] and bring it close so you can sniff it, inhaling Terry’s scent. It’s amazing how [heshe] can keep [hisher] fur so well cared for, even when you’re on the road.", parse);
		Text.NL();
		if(terry.Relation() < 30) {
			Text.Add("Before you can sink too far into your reverie, a sharp cough from above reaches your ears. Terry doesn’t sound too thrilled with you sniffing [himher] like that, and so you sadly let go of [hisher] fur and get back to business.", parse);
		}
		else if(terry.Relation() < 30) {
			Text.Add("<i>“Enjoying yourself?”</i> Terry asks with a hint of mirth in [hisher] voice.", parse);
			Text.NL();
			Text.Add("You sigh and nod dreamily in response. There’s still much more to come, and so you reluctantly let Terry go.", parse);
		}
		else {
			Text.Add("As you relax, you feel Terry’s arms gently drape over your head, hugging you close. <i>“Sometimes you can be such a big baby, [playername],”</i> [heshe] remarks, chuckling softly.", parse);
			Text.NL();
			Text.Add("If it lets you get up close and personal with [himher] like this, then you don’t really care about that.", parse);
			Text.NL();
			Text.Add("<i>“Well, I’m not complaining, but didn’t you want something from me?”</i>", parse);
			Text.NL();
			Text.Add("[HeShe] does have a point... nice as it is to just lie here and snuggle, you still want something more. With that in mind, you let [hisher] fur go.", parse);
		}
		Text.NL();
		Text.Add("Guiding your hand through the veil of chest-fluff, you close your fingers around the petite bulge of one little breast. Its nipple pebbles against your palm as you palpate it, massaging the dainty orb. It’s so small that it barely squishes in your grip, so you have to adapt.", parse);
		Text.NL();
		Text.Add("You roll your palm across and around, with smooth strokes up and down, ensuring the nipple grinds against your skin as you pick up the pace, going faster and faster.", parse);
		Text.NL();
		Text.Add("Terry arches off of the floor with a soft mewl, chest thrust out against you. Since [heshe]’s so eager, you happily oblige, turning your face to lavish kisses over the half of [hisher] chest you’re not busily molesting.", parse);
		Text.NL();
		Text.Add("Nosing through [hisher] fur, you tease it aside to try and expose [hisher] areola better. Once satisfied, you extend your [tongue] and touch the very tip of it to the pink pearl of flesh, helping you guide your tongue as it curls itself along [hisher] areola.", parse);
		Text.NL();
		Text.Add("You yearn to take it into your mouth... but it’s too soon for that. Instead, you let your tongue slide lower, and glide around the small mound of flesh beneath you. Moans of pleasure echo above you as you leisurely lap back and forth, still squeezing intermittently with your other hand at [hisher] breast.", parse);
		Text.NL();
		Text.Add("One final wet slurp across the nipple before your tongue withdraws. You descend on Terry’s chest, jaws agape to envelop all of [hisher] petite teat. Warm, fuzzy breastflesh fills your mouth as your lips seal themselves around it, and you suck softly as you seek the warm deliciousness within.", parse);
	}
	else if(terry.Cup() <= Terry.Breasts.Bcup) {
		Text.Add("Looking over Terry’s chest, you see the undeniable curves of [hisher] perky breasts. The fluff that would usually cover [hisher] nipples has since receded, exposing the bottom half of the [foxvixen]’s cleavage. There’s still plenty of soft fur for you to play with, should you feel inclined to.", parse);
		Text.NL();
		Text.Add("You smile and gently sweep Terry’s fluffy fur away, exposing [hisher] hand-filling breasts to your viewing pleasure. They are perky and soft, just big enough to give you a handful as you reach to knead each mound. The [foxvixen] inhales sharply, and you can feel [hisher] nipples hardening against your palms.", parse);
		Text.NL();
		Text.Add("The two orbs look right at home on Terry’s chest, further complementing [hisher] feminine looks.", parse);
		Text.NL();
		if(terry.Relation() < 30) {
			Text.Add("You chuckle when you see [hisher] cheeks reddening at your compliment, though [heshe] still looks uncomfortable.", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("<i>“Hm, thanks. One of the perks of having these is that I don’t need to use filling when I want to dress up.”</i>", parse);
			Text.NL();
			Text.Add("Well, you wouldn’t say [heshe] was unconvincing before... [heshe]’s always going to be the cutest little [foxvixen] you know, real boobs or not.", parse);
		}
		else {
			Text.Add("<i>“Oh, [playername]. You know I’m a sucker for flattery.”</i> [HeShe] chuckles. <i>“So, don’t stop now and keep massaging my boobs.”</i>", parse);
			Text.NL();
			Text.Add("Oh, you wouldn’t dream of not telling [himher] what a gorgeous, sexy, adorable [foxvixen] [heshe] is, you purr. Certainly not when [heshe] honors you enough to let you play with these sweet little milk-makers of [hishers].", parse);
			Text.NL();
			Text.Add("<i>“Ahn! Yes, you really know how to make a [foxvixen] feel appreciated!”</i>", parse);
			Text.NL();
			Text.Add("Oh, but you’ve only just begun...", parse);
		}
		Text.NL();
		Text.Add("You give each breast a final squeeze for good luck, and then slide your hands around, cupping them from the sides and pushing them as close together as you can. That done, you lower your face to the sweet little pillows and extend your [tongue]. Picking one boob at random, you glide the length of your tongue across it, curling partially around its dainty mass.", parse);
		Text.NL();
		Text.Add("Terry’s fur is silken soft and pleasantly clean beneath your taste buds as you leisurely glide back and forth, tracing crescents from the bottom of the breast to the top and back again. Then, with one particularly wet slurp, you slide over to the other teat, lavishing it with the same affection.", parse);
		Text.NL();
		Text.Add("In spiraling figure-eights, you work your way up to the tops of Terry’s tits, fingers softly palpating in your wake.", parse);
		Text.NL();
		Text.Add("Above you, Terry pants in obvious pleasure, little moans escaping [hisher] muzzle whenever you lick [hisher] nipples.", parse);
		Text.NL();
		Text.Add("Those moans stir a spark of mischief, and you withdraw your tongue, leaning in close enough to carefully nip one pert nipple with your teeth. Not hard enough to actually hurt your precious [foxvixen], but sharp enough that [heshe] definitely felt it.", parse);
		Text.NL();
		Text.Add("<i>“Aah!”</i> [HeShe] cries out. ", parse);
		if(terry.Relation() < 30) {
			Text.Add("Terry glares down at you, shame and worry clear in [hisher] face.", parse);
			Text.NL();
			Text.Add("You just smile innocently back at [himher]. [HeShe] might act like [heshe] didn’t enjoy it, but you can tell that it’s just the opposite.", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("<i>“Don’t bite my nipples! They’re sensitive...”</i>", parse);
			Text.NL();
			Text.Add("You know they’re sensitive. Why does [heshe] think you bit them? It’s no fun nibbling something that isn’t sensitive.", parse);
		}
		else {
			Text.Add("<i>“[playername]! You meanie!”</i> Terry says, giving you a flick on your forehead.", parse);
			Text.NL();
			Text.Add("Aw, [heshe] loves you for it, [heshe] knows [heshe] does.", parse);
			Text.NL();
			Text.Add("<i>“Oh yeah? Maybe I should bite you instead!”</i> [heshe] teases back.", parse);
			Text.NL();
			Text.Add("Well, fair is fair; maybe sometime you will let [himher] have a nibble on you.", parse);
		}
		Text.NL();
		Text.Add("Turning your attention back to Terry’s breast, you lower your mouth once more to the nipple you nibbled. Puckering your lips, you place a tender peck upon its surface. As the [foxvixen] croons appreciatively above you, you deepen the kiss, lewdly sucking the nipple.", parse);
		Text.NL();
		Text.Add("As it brushes against your tongue, you open your mouth to engulf more breastflesh, ready to begin drinking.", parse);
	}
	else if(terry.Cup() <= Terry.Breasts.Ccup) {
		Text.Add("Fat and proud, Terry’s bulging teats draw your gaze like iron filings to a magnet. Covered in luxuriant white fur, a heart-shaped tuft of long fluff nestled at the top of [hisher] cleavage, they practically beg to be squeezed and fondled, caressed and molested.", parse);
		Text.NL();
		Text.Add("Reverently, your hands embrace their fullness, one to either side of [hisher] bountiful cleavage. The lush pillows are so large that your fingers can barely encompass their girth, dimpling slightly as you start to squeeze.", parse);
		Text.NL();
		Text.Add("With a twist of your wrists, you push Terry’s boobs together, squishing them so that they bulge up and out, seeming even larger than they already are. You palpate with your fingers, kneading each mammary and reveling as it flexes hypnotically beneath you.", parse);
		Text.NL();
		Text.Add("Pushed together like this, Terry’s tits remind you of plump, sexy pillows. Spurred on by that notion, you allow your face to sink down into their downy embrace, burying yourself in their fluffy warmth. You inhale deeply to fill your nostrils with Terry’s surprisingly sweet scent.", parse);
		Text.NL();
		Text.Add("Lazily, your arms wrap themselves around Terry’s tits, nestling them in the crooks of your elbows as your hands dance over the [foxvixen]’s shoulders. Eyes closed to savor the warm darkness, you nuzzle back and forth, rubbing cheek and [noseSnout] against Terry’s boobs as you steadily build up your pace until you are grinding your face into [hisher] cleavage.", parse);
		Text.NL();
		if(terry.Relation() < 30) {
			Text.Add("Above you, you can hear Terry gasping in pleasure as you nuzzle [hisher] tits. As enticing as that is, you’re getting a little carried away, and so you slow yourself down in your grinding.", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("<i>“Haha, easy there!”</i> Terry says, gently patting your head.", parse);
			Text.NL();
			Text.Add("Party pooper. Still, you heed [hisher] words and slow your pace. Don’t want to be too rough with your precious pet, after all.", parse);
		}
		else {
			Text.Add("<i>“Easy, [boygirl]! If you keep rubbing my breasts this hard, you’re going to get us shocked,”</i> Terry teases.", parse);
			Text.NL();
			Text.Add("Oh no, you wouldn’t want that to happen, as fun as it would be to see Terry with all of [hisher] fur poofed out, so you turn your enthusiasm down a notch.", parse);
		}
		Text.NL();
		Text.Add("With some reluctance, you lift your head from the comforting warmth of Terry’s bosom. Opening your eyes and smiling absently, you tenderly reach up and cup one plush tit. You give it a comforting squeeze, and then lower your face back toward it.", parse);
		Text.NL();
		Text.Add("You open your mouth and extend your [tongue], before you trace a languid crescent along the underside of Terry’s breast. Letting your saliva flow freely, you stroke back and forth, curling your tongue sensuously along the ripe fullness beneath your face. With painstaking deliberation, you lead your winding way up to the peak of Terry’s boob, slathering the ruddy flesh of [hisher] areola in warm fluids as you use your [tongueTip] to paint the sensitive ring.", parse);
		Text.NL();
		Text.Add("A luxuriant groan bubbles from above, the [foxvixen] clearly appreciates your ministrations. [HeShe] mewls softly as your tongue retracts, only to squeak and wriggle beneath you as you purse your lips and blow a gust over [hisher] nipple. ", parse);
		Text.NL();
		Text.Add("Somehow, it manages to get even harder than before, jutting accusingly at your face. As Terry whimpers in frustration, you decide you’ve played long enough. Your [tongue] curls out once more, flicking [hisher] nipple before you wrap your lips around it and start to drink.", parse);
	}
	else {
		Text.Add("You cannot hope to escape the magnificence of Terry’s mammoth milkers. On [hisher] petite little frame, they seem all the larger, commanding the attention of anyone who so much as glances [hisher] way.", parse);
		Text.NL();
		Text.Add("With the reverential respect they deserve, you reach out with one hand to try and encompass one luscious globe. It is far too large to fit, but even your slight squeeze elicits a moan of pleasure from the [foxvixen] beneath you.", parse);
		Text.NL();
		Text.Add("It seems a more delicate touch would be better here. You allow your hand to sink back, and then lower your face. Pursing your lips, you plant a tender kiss on the side of the boob you just squeezed, audibly smacking as you release [himher]. Then you move over to the opposite breast and kiss it in the same way.", parse);
		Text.NL();
		Text.Add("Feeling playful, you rain down a shower of feather-light kisses, nuzzling your way across the expanse of Terry’s breast. You culminate your brief display of affection by planting a warm, tender peck on each bud in turn, sucking just a little to coax [hisher] nipples to stand erect against your lips.", parse);
		Text.NL();
		if(terry.Relation() < 30) {
			Text.Add("Terry struggles with the effort to contain [hisher] moans as you pleasure [himher]. It’s cute… but ultimately ineffective.", parse);
			Text.NL();
			Text.Add("You always knew [heshe] would learn to love [hisher] boobies if [heshe] just gave them a chance.", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("Terry laughs at your antics. <i>“You really like my big boobs, don’t you, [playername]?”</i>", parse);
			Text.NL();
			Text.Add("Mmm... yes, you certainly do.", parse);
			Text.NL();
			Text.Add("<i>“I should’ve guessed since you made them this big… perv.”</i> [HeShe] gives you a smug grin.", parse);
			Text.NL();
			Text.Add("Maybe, but you’re <b>[hisher]</b> perv, and [heshe] loves it.", parse);
		}
		else {
			Text.Add("<i>“Easy there, cow[boygirl]. If I didn’t know any better, I’d say that you only keep me around as a pair of walking tits.”</i> [HeShe] chuckles.", parse);
			Text.NL();
			Text.Add("Of course not! [HeShe]’s also got a damn sexy ass, too. And that long fluffy tail of [hishers] is just to die for...", parse);
			Text.NL();
			Text.Add("<i>“Cheeky bastard,”</i> [heshe] replies, showing you [hisher] tongue.", parse);
		}
		Text.NL();
		Text.Add("Shifting slightly atop of Terry, you reach out with both [hand]s, fingers extended. Tenderly, you touch Terry’s areolae and start to trace soft, sensuous circles around the peak of each bulbous breast. You playfully twitch each nipple as you pass, keeping your strokes smooth and steady to better lull your vulpine partner.", parse);
		Text.NL();
		Text.Add("A croon of pleasure rewards your efforts, bringing a smile to your face. You carefully glide your fingers down across the broad expanses of titty-flesh, using your thumbs to continue flicking and rubbing Terry’s nipples as you do. You start to squeeze and knead what boob-flesh you can reach, creating gentle palpitations that have Terry lolling [hisher] head back with a rumble of pleasure.", parse);
		Text.NL();
		Text.Add("Judging that Terry is ready, you finally slide your hands off to the sides, cupping [hisher] luscious bosom. Without further ado, you lower your mouth to start nursing.", parse);
	}
	Text.Flush();
	
	world.TimeStep({minute: 15});
	
	Gui.NextPrompt(function() {
		Scenes.Terry.SexHaveADrinkBreastsMilk(parse);
	});
}

Scenes.Terry.SexHaveADrinkBreastsMilk = function(parse) {
	//#Milk quantity block
	Text.Clear();
	
	var milk = terry.Milk();
	terry.MilkDrain(3);
	
	if(milk >= Terry.MilkLevel.VeryHigh) {
		Text.Add("It seems like the moment your lips wrap around Terry’s nipple, it squirts milk down your throat. Obviously, the [foxvixen]’s big fat titties are just crammed full of milk, waiting to come out. Poor thing must be so distracted with them so full - you’re doing [himher] a favor by helping [himher] get rid of some.", parse);
		Text.NL();
		Text.Add("Feeling both thirsty and compassionate, you happily start guzzling down every drop Terry has to give you, at least until you realize that if [heshe]’s putting out this much milk, you may not be able to handle that much... Best to just take the edge off for [himher], then. You can always come back and drink some more after you’ve digested this liquid meal, after all.", parse);
		Text.NL();
		Text.Add("As best you can measure, you pop free after draining the worst of the milk from Terry’s breast. It’s so bloated that it continues seeping milk, running down onto [hisher] belly for several seconds after you stop suckling. Ignoring that, you latch your lips onto [hisher] other nipple and resume your nursing.", parse);
		Text.NL();
		Text.Add("You drink as much as you feel you can hold comfortably, belly softly gurgling as you release [himher]. You wipe your mouth with the back of your arm and sigh softly. That feels so good - and you bet it feels a lot better for your pet, too.", parse);
		Text.NL();
		if(terry.Relation() < 30) {
			Text.Add("<i>“Y-yeah. They were pretty heavy...”</i>", parse);
			Text.NL();
			Text.Add("Oh, poor thing. But you know how to make [himher] feel better...", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("<i>“Sure does. Thanks for that, [playername]. They’re already pretty heavy and sensitive on their own, and being so full of milk doesn’t help,”</i> [heshe] giggles.", parse);
			Text.NL();
			Text.Add("You were happy to help. Sounds like a brave little [foxvixen] deserves some special care...", parse);
		}
		else {
			Text.Add("<i>“Yeah, it feels pretty good now. Y’know you can always count on me to keep you fed, even if our roles should be reversed, my dear [mastermistress],”</i> Terry teases, showing [hisher] tongue.", parse);
			Text.NL();
			Text.Add("With a laugh, you admit that you don’t doubt that, but right now, you’re the [mastermistress], and you’re not quite done playing with [himher] just yet...", parse);
		}
	}
	else if(milk >= Terry.MilkLevel.High) {
		Text.Add("Almost immediately, Terry’s rich milk flows into your mouth and pours steadily down your gullet. Thick, warm and creamy, it’s a delicious beverage that eagerly entices you to drink more. It shows no sign of stopping anytime, and you guzzle away eagerly.", parse);
		Text.NL();
		Text.Add("When you tire of nursing from one teat, you switch your attention to the other, being greeted with the same enthusiasm as the first. Delicious [foxvixen] milk; Terry’s tits seem to be just about overflowing with it, and you could drink [himher] completely dry...", parse);
		Text.NL();
		Text.Add("That’s just being greedy - not to mention a good way to give yourself a tummy ache. You drink heartily all the same, but when your stomach starts to gurgle in soft protest, you force yourself to stop.", parse);
		Text.NL();
		Text.Add("Beads of white continue to glisten upon the caps of Terry’s nipples, and you allow yourself the luxury of deftly licking them clean, an act that makes Terry wriggle beneath you in quite an amusing fashion.", parse);
		Text.NL();
		Text.Add("Feeling very good, and very pleased with yourself, you consider how to properly thank your pet for providing such a delicious treat. Ah, that sounds promising...", parse);
	}
	else if(milk >= Terry.MilkLevel.Mid) {
		Text.Add("After a few seconds of nursing, your reward is a smooth, steady flow of rich creamy [foxvixen] milk. Happily, you guzzle it down, gulping each heady mouthful before sucking forth a fresh one. Eventually, the flow becomes a thin trickle, and you turn to Terry’s other breast to fully sate your thirst.", parse);
		Text.NL();
		Text.Add("After several long, dreamy minutes, your belly grumbles its satiation and you allow Terry’s nipple to fall from your mouth. Sighing in contentment, basking in the feeling of warm fullness that ripples out from your stomach, you cuddle [himher] closer.", parse);
		Text.NL();
		Text.Add("It feels so nice to be here, twined about your vulpine pet. Through your milk-induced haze, it dawns on you that perhaps a little thank-you is in order...", parse);
	}
	else if(milk >= Terry.MilkLevel.Low) {
		Text.Add("With slow, patient suckling, a trickle of warm [foxvixen] milk starts to creep over your tongue. Rich and creamy, with a heady bouquet, it glides sluggishly down your gullet and entices you to drink more. When the flow creeps to a stop, you switch over to the other breast, intent on getting a proper drink.", parse);
		Text.NL();
		Text.Add("As Terry sighs and coos above, you lazily drink your fill. A nice glow emanates from your belly as the last trickle of milk slides down your throat. You suck a little harder, but only meagar dribbles escape; it looks like you’ve sucked [himher] dry.", parse);
		Text.NL();
		Text.Add("Allowing the slickened teat to pop wetly from between your lips, you sigh hugely and thank Terry for [hisher] generosity.", parse);
		Text.NL();
		if(terry.Relation() < 30)
			Text.Add("<i>“Y-you’re welcome,”</i> [heshe] says nervously.", parse);
		else
			Text.Add("<i>“Anytime, [playername].”</i> [HeShe] grins.", parse);
		Text.NL();
		Text.Add("Such a nice [boygirl]. And nice [boygirl]s deserve a special thank you... hmm, you know just how to do it...", parse);
	}
	else {
		parse["sex"] = player.sexlevel > 2 ? " or what tricks you play with your tongue," : "";
		Text.Add("No matter how you work Terry’s nipple in your mouth,[sex] nothing comes out. You suckle and swallow and massage [hisher] tit until [heshe] mewls above you, but you can’t get so much as a drop.", parse);
		Text.NL();
		Text.Add("There’s no denying it: Terry is completely empty - [heshe] doesn’t have any milk to give. Maybe you should have given [himher] some more time to fill up again.", parse);
		Text.NL();
		parse["smallFull"] = terry.Cup() < Terry.Breasts.Ccup ? "small" : "full";
		Text.Add("With that realization, you open your lips and let Terry’s nipple fall from them, and then rest your head against [hisher] [smallFull] bosom. This is kind of a let down... still, you have a cute little [foxvixen] under you to play with. Surely there’s some way to salvage this?", parse);
		Text.NL();
		Text.Add("As you reflect on that, a mischievous grin starts to grow on your face. You have some ideas already...", parse);
	}
	Text.NL();
	Scenes.Terry.SexHaveADrinkBreastsRomance(parse);
}

Scenes.Terry.SexHaveADrinkBreastsRomance = function(parse) {
	Text.Add("Leisurely, you wrap your arms around Terry and snuggle close, demurely dipping your head down to play a tender kiss on the [foxvixen]’s collarbone, and grinning to yourself as [heshe] shivers in anticipation.", parse);
	Text.NL();
	Text.Add("With the same languid ease, you let your [tongue] loll freely from between your lips and start to glide it up Terry’s chest, stopping only when the silky fur gives way to cool leather.", parse);
	Text.NL();
	Text.Add("You wriggle forward, nuzzling your head into the crook of Terry’s neck safely above [hisher] ever-present collar. Mercilessly, you kiss [himher], long and deep, feeling the moan that [heshe] voices more than hearing it as you lewdly suckle at [hisher] throat.", parse);
	Text.NL();
	Text.Add("When you have had your fill, you let [himher] go, your lips smacking in satisfaction. Due to your intensity, you leave [himher] with quite an impressive hickey too.", parse);
	Text.NL();
	Text.Add("You begin to move again, bringing your gaze squarely to meet Terry’s own. Beautiful blue eyes fill your vision, and you lose yourself to them, content with just staring into their shimmering depths.", parse);
	Text.NL();
	if(terry.Relation() < 30)
		Text.Add("Terry’s gaze darts away for a moment, but they quickly turn to look back into your own. You can tell [heshe]’s a little confused, but despite that, you don’t feel like [heshe]’s rejecting you either.", parse);
	else if(terry.Relation() < 60)
		Text.Add("Terry’s gaze widens, it seems like [heshe]’s hoping for something from you, and you won’t disappoint.", parse);
	else
		Text.Add("Terry’s gaze sparkle with adoration, [hisher] relaxed yet hopeful demeanor gives away what [heshe]’s hoping for next. Well then, let’s not keep our pet [foxvixen] waiting...", parse);
	Text.NL();
	Text.Add("You lean forward and place a soft, sweet kiss on [hisher] dainty lips, holding [himher] for barely a heartbeat before letting go.", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("<i>“[playername]... Wha- ...just what the hell are you doing?”</i> the [foxvixen] asks you, baffled.", parse);
		Text.NL();
		Text.Add("With an innocent smile, you reply that you’re just showing how much you appreciate your adorable little [foxvixen], that’s all.", parse);
		Text.NL();
		Text.Add("<i>“I don’t remember saying you could kiss me,”</i> [heshe] replies, trying to look at least a little mad at you.", parse);
		Text.NL();
		Text.Add("You don’t remember [himher] resisting either.", parse);
		Text.NL();
		Text.Add("<i>“I didn’t have time to!”</i> [heshe] protests.", parse);
		Text.NL();
		Text.Add("You just chuckle softly. [HeShe]’s so cute when [heshe] gets all flustered like that. Besides, you know all too well that [heshe] enjoyed it. Almost as much as [heshe]’ll enjoy this...", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“That was nice,”</i> Terry says with a smile.", parse);
		Text.NL();
		Text.Add("You knew [heshe]’d like that. Of course, nothing says you have to stop there, if [heshe] doesn’t want you to...", parse);
		Text.NL();
		Text.Add("<i>“Hmm, in that case, go on. What else are you planning?”</i>", parse);
		Text.NL();
		Text.Add("Oh, you’re sure [heshe]’ll just love it.", parse);
	}
	else {
		Text.Add("<i>“Oh, come on! You call that a kiss?”</i>", parse);
		Text.NL();
		Text.Add("You feign innocence, giving the [foxvixen] your best bemused look.", parse);
		Text.NL();
		Text.Add("<i>“Here, I’ll show you what a real kiss is like!”</i> Terry’s arms envelop you in a tight hug as [heshe] pulls you down on top of [himher].", parse);
		Text.NL();
		Text.Add("This time, you’re the one who doesn’t have so much as a chance to squeak before Terry’s lips have seized your own. A hungry, passionate lip lock that sends tingles racing down your spine. You can’t hold back a moan, readily grinding yourself against [himher].", parse);
		Text.NL();
		Text.Add("The [foxvixen] happily takes this opportunity to slip [hisher] tongue past your lips and wrestle with your own, humming into the kiss as [heshe] exchanges saliva with you.", parse);
		Text.NL();
		Text.Add("Long, pleasant moments tick past as you playfully wrestle for control of both your mouth and Terry’s. Eventually, you are forced to break the kiss. A strand of glistening fluid link your lips for a moment as you raise your head.", parse);
		Text.NL();
		Text.Add("Chuckling, you concede that Terry certainly showed you what a real kiss is.", parse);
		Text.NL();
		Text.Add("<i>“Of course. And if you ever forget what it’s like, I’d be happy to show you as many times as necessary.”</i>", parse);
		Text.NL();
		Text.Add("", parse);
	}
	Text.NL();
	Text.Add("Oh, that sounds like a wonderful idea... but, you have a little something else in mind for [himher] right at this moment. Don’t worry, you know [heshe]’s just going to <i>love</i> it...", parse);
	Text.Flush();
	
	world.TimeStep({minute: 20});
	
	Scenes.Terry.SexHaveADrinkBreastsArousal(parse);
}

Scenes.Terry.SexHaveADrinkBreastsArousal = function(parse) {
	//#arousal check block
	
	//[Cock][Pussy]
	var options = new Array();
	if(terry.FirstCock()) {
		var tooltip = "What better way to show your appreciation than with a nice massage on Terry’s ";
		if(terry.HorseCock()) tooltip += "fat stallionhood?";
		else tooltip += "dainty foxhood?";
		options.push({ nameStr : "Cock",
			tooltip : tooltip,
			func : function() {
				if(terry.HorseCock())
					Scenes.Terry.SexHaveADrinkBreastsArousalHorsecock(parse);
				else
					Scenes.Terry.SexHaveADrinkBreastsArousalFoxcock(parse);
			}, enabled : true
		});
	}
	if(terry.FirstVag()) {
		options.push({ nameStr : "Pussy",
			tooltip : Text.Parse("A tender pussy rubbing should be just the thing to thank your [handsomebeautiful] [foxvixen].", parse),
			func : function() {
				Scenes.Terry.SexHaveADrinkBreastsArousalPussy(parse);
			}, enabled : true
		});
	}
	if(options.length > 1)
		Gui.SetButtonsFromList(options, false, null);
	else
		Gui.NextPrompt(options[0].func);
}

Scenes.Terry.SexHaveADrinkBreastsArousalHorsecock = function(parse) {
	Text.Clear();
	Text.Add("You suddenly feel something poking against ", parse);
	var tail = player.HasTail();
	if(tail) {
		parse["tail"] = tail.Short();
		Text.Add("the base of your [tail].", parse);
	}
	else
		Text.Add("your [butt].", parse);
	Text.Add(" With feigned innocence, you shift atop the supine [foxvixen] until you have slid off, rising to your full height and circling [himher]. Terry’s mammoth erection stands out proudly between [hisher] thighs, almost begging you to take hold of it.", parse);
	Text.NL();
	Text.Add("But you ignore it, for the moment. Instead, you settle yourself next to Terry, scooping [himher] up and pulling [himher] neatly into your lap.", parse);
	Text.NL();
	Text.Add("Your arms twine around the [foxvixen]’s waist, reaching down to caress [hisher] thighs and coax them apart. Leaning forward, you whisper into Terry’s ear that [hisher] fur feels so soft...", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("<i>“It does?”</i> [heshe] asks tentatively.", parse);
		Text.NL();
		Text.Add("Oh, yes; [heshe]’s just so silky and clean. You could just while away hours petting [himher] like a big puppy.", parse);
		Text.NL();
		Text.Add("<i>“Oh… umm, thanks I guess...”</i> [heshe] replies, ears flattening on [hisher] skull as [hisher] tail begins wagging ever so slightly.", parse);
		Text.NL();
		Text.Add("Aw, [heshe]’s just so cute when [heshe]’s embarrassed like that. Makes [himher] so much fun to tease.", parse);
		Text.NL();
		Text.Add("<i>“...Jerk.”</i> [HeShe] pouts.", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Thanks. Keeping my fur well-groomed on the go isn’t easy, you know?”</i>", parse);
		Text.NL();
		Text.Add("Well, if [heshe] ever wants a hand with that, you’d love to help out. Not that you need an excuse to put your hands all over [himher], of course.", parse);
		Text.NL();
		Text.Add("<i>“I’d be happy to take your help. Just be mindful of where you put your hands, or I might have to punish you,”</i> [heshe] replies with a snide grin.", parse);
		Text.NL();
		Text.Add("Oh, you wouldn’t dream of touching [himher] anywhere that [heshe] doesn’t want you to, but you know [heshe] secretly hopes that you’ll touch [himher] <i>everywhere</i>...", parse);
		Text.NL();
		Text.Add("<i>“[playername]! Are you accusing me of being a sick pervert like you?”</i>", parse);
		Text.NL();
		Text.Add("Yes, yes you are. Not that it’s a <i>bad</i> thing.", parse);
		Text.NL();
		Text.Add("<i>“...Okay, maybe I am hoping for that, but just a little.”</i> [HeShe] grins.", parse);
	}
	else {
		Text.Add("<i>“It better feel good. I go to great lengths to make sure my fluffiness is at it’s best,”</i> [heshe] replies, leaning back onto your [breasts].", parse);
		Text.NL();
		Text.Add("Oh, you can tell. [HeShe] does a wonderful job on it. You’re so lucky to have a sweet [foxvixen] who likes to keep [himher]self in such wonderful condition.", parse);
		Text.NL();
		Text.Add("<i>“Hmm, I love flattery, don’t stop now!”</i> [HeShe] giggles.", parse);
		Text.NL();
		Text.Add("[HisHer] wish is your command... Hmm, have you ever told [himher] that [hisher] eyes are bluer than the sky on a blissful spring morning? You could just get lost staring into their depths, drifting away into the vistas they promise...", parse);
		Text.NL();
		Text.Add("Terry turns to look at you, [hisher] muzzle split into a mischievous smile. <i>“Okay, okay. Just cut the sappy stuff and give me a kiss instead,”</i> [heshe] says, caressing your cheek and closing [hisher] eyes.", parse);
		Text.NL();
		Text.Add("As if you need further invitation. One hand lifts itself from [hisher] thighs to cup [hisher] chin as you plunge forward. Your lips lock hungrily with the [foxvixen]’s own, your own eyes closing as you savor the warmth of [himher], the taste of [hisher] breath in your mouth.", parse);
		Text.NL();
		Text.Add("Without thinking, you start to probe at [hisher] lips with your [tongueTip], seeking entrance.", parse);
		Text.NL();
		Text.Add("Terry not only welcomes you, but slips [hisher] tongue around yours to wrestle with your own muscle.", parse);
		Text.NL();
		Text.Add("You playfully tussle with your vulpine lover, then concede defeat. As [heshe] triumphantly withdraws [hisher] victorious tongue, you break the kiss, smacking your lips and smiling.", parse);
		Text.NL();
		Text.Add("<i>“Better than any fancy words, no?”</i> [HeShe] smiles.", parse);
		Text.NL();
		Text.Add("It has its advantages, you’ll admit.", parse);
		Text.NL();
		Text.Add("<i>“Now, didn’t you have something in store for me?”</i>", parse);
		Text.NL();
		Text.Add("Oh, yes, that’s right. You got so wrapped up in your lovely little [foxxyvixxy] that you almost forgot.", parse);
	}
	Text.NL();
	Text.Add("Your hand glides feather-soft over Terry’s inner thigh. Fingers caress [hisher] seed-swollen balls in passing, but don’t stop their advance, aiming for your true target. Terry’s long, mismatched phallus is hot against your [palm] as your digits wrap themselves possessively around [hisher] girth.", parse);
	Text.NL();
	Text.Add("You can feel it throb in time with Terry’s heartbeat as you swoop up the shaft and rub your fingers over its blunted tip, smearing your digits with the pre-cum already starting to ooze from [hisher] cumvein.", parse);
	Text.NL();
	Text.Add("Smiling to yourself, you continue to stimulate your pet [foxvixen] with languid strokes, gathering some of [hisher] leaking pre on every up-stroke and spreading it across [hisher] length on the down-stroke.", parse);
	Text.NL();
	Text.Add("Terry sinks down into your lap, letting out a sigh as [heshe] relaxes, happy to let you keep control of the situation. ", parse);
	if(terry.Relation() < 30)
		Text.Add("It’s rare for the [foxvixen] to lower [hisher] guard like that, but you can’t resist remarking that [heshe] seems to enjoying [himher]self.", parse);
	else
		Text.Add("Would you look at that? Is [heshe] enjoying [himher]self that much?", parse);
	Text.NL();
	Text.Add("<i>“Yeah...”</i>", parse);
	Text.NL();
	Text.Add("Oh, that's good, because you sure are're enjoying yourself. Just you, Terry and this big, meaty dick of [hishers]. [HeShe]'s so cute and sweet on the outside; who'd suspect that [heshe]'s hiding a monster like this in [hisher] pants? Isn't [heshe] happier with [himher]self now?", parse);
	Text.NL();
	Text.Add("<i>“When it feels this good? Hard not to be happy,”</i> [heshe] replies, chuckling softly.", parse);
	Text.NL();
	Text.Add("Grinning to yourself, you plant a deep, wet kiss on the nape of Terry’s neck, and chuckle as [heshe] wriggles in response. You tuck your head into the crook of [hisher] shoulder and sigh. You’re so happy to hear that.", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("<i>“Look, [playername]. I know I give you a hard time, but I know that you’re a nice [guygirl] deep down. I just… I don’t know, I guess it’s difficult for me to trust other people.”</i>", parse);
		Text.NL();
		Text.Add("It’s okay, you can understand it hasn’t been easy for the poor [foxvixen], but you want to prove that you’re different. If [heshe]’ll give you a little time, you’ll prove [heshe] can trust you, you promise.", parse);
		Text.NL();
		Text.Add("<i>“Really? I hope that’s the case. I don’t want to have a bad relationship with you. I mean, I’m basically your slave right? It wouldn’t be good for to get on your bad side...”</i> [heshe] says, forcing a weak smile.", parse);
		Text.NL();
		Text.Add("You sigh softly and shake your head. Terry’s more to you than some slave - yes, the collar makes [himher] obey, but that’s not the only reason you want [himher] around. You’re not going to abuse the power it gives you over [himher], you promise. Terry means something special to you... you just wish [heshe] could give you a chance to mean something special to [himher], too.", parse);
		Text.NL();
		Text.Add("<i>“...Thank you, [playername]. I promise I’ll try not to be such a pain for you.”</i>", parse);
		Text.NL();
		Text.Add("You slip a hand around Terry’s waist to give [himher] a quick, gentle hug. That’s all you can ask of [himher].", parse);
		
		terry.relation.IncreaseStat(0, 2);
		terry.relation.IncreaseStat(30, 2);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“You know, it’s at times like this that I feel damn lucky that you’re the one who busted me out of jail.”</i>", parse);
		Text.NL();
		Text.Add("Oh? Why is that? [HeShe] doesn’t think someone else could have gotten [himher] a better deal?", parse);
		Text.NL();
		Text.Add("<i>“Better than this? Ha! No way. You’re really nice to me, and I feel really close to you. It’s like we connect, and I really cherish this bond we have.”</i>", parse);
		Text.NL();
		Text.Add("You feel the same way. Terry’s your special [foxvixen], and nothing’s going to change that.", parse);
		
		terry.relation.IncreaseStat(50, 1);
	}
	else {
		Text.Add("<i>“Hey, [playername]?”</i>", parse);
		Text.NL();
		Text.Add("Yes? What is it?", parse);
		Text.NL();
		Text.Add("<i>“I love you.”</i> [HeShe] looks at you in silence for a moment, then giggles. <i>“It feels nice to say that, I don’t think I get to say it enough...”</i>", parse);
		Text.NL();
		Text.Add("You kiss [hisher] nape again to interrupt. [HeShe] may not say it all that often, but the fact [heshe] always means it more than makes up for it. Besides, you love [himher] too - and you need to say that to [himher] more often.", parse);
		Text.NL();
		Text.Add("<i>“Nah, you don’t. I mean, I’m not going to complain, but just doing this, being together like this. It’s more than I could have ever hoped for. This must be what heaven feels like.”</i>", parse);
		Text.NL();
		Text.Add("Such a romantic your Terry is. You should do things like this more often, [heshe]’s so adorable when [heshe]’s waxing rhetorical.", parse);
		Text.NL();
		Text.Add("<i>“Hey, you got your hands wrapped up all over my cock. Hard to not get emotional when we’re like this.”</i> [HeShe] shows you [hisher] tongue.", parse);
		Text.NL();
		Text.Add("You really should play with [hisher] cock more often, then.", parse);
	}
	Text.NL();
	Text.Add("Time to give your pet a proper happy ending. Your strokes, once lazy and tender, begin to come faster and harder.", parse);
	Text.NL();
	Text.Add("Your pre-slick fingers work their way under the lips of Terry’s sheath, allowing you to caress the tenderest flesh beneath, and then trail up its underside to trace rings along [hisher] spreading flare. With your other hand, you reach down to cup Terry’s bloated seed-factories, convinced you can feel [himher] churn up a fresh batch of cum.", parse);
	Text.NL();
	Text.Add("<i>“Ahn! If you keep going like this, I won’t be able to hold back,”</i> [heshe] says, moaning in pleasure.", parse);
	Text.NL();
	Text.Add("Then [heshe] should just let it all out...", parse);
	Text.NL();
	
	var cum = terry.OrgasmCum();
	
	Text.Add("The [foxvixen] arches [hisher] back and does [hisher] best to howl as climax wracks [hisher] body. Hand clenched just above [hisher] turgid knot, you can feel [hisher] shaft distend as the first torrent of seed wells up from [hisher] groaning nuts.", parse);
	Text.NL();
	Text.Add("A great arc of white geysers from [hisher] flaring shaft, sailing through the air to splatter on the floor quite a distance away. An impressive shot indeed... but you think [heshe] can do better.", parse);
	Text.NL();
	Text.Add("Mischief burning in your heart, your curled fingers start to pump back and forth along Terry’s shaft, coaxing [himher] to launch each glob of seed further than the one before. [HeShe] writhes and squirms, helpless as you playfully aim each arc of semen to trace its own path.", parse);
	Text.NL();
	Text.Add("Inevitably, Terry’s bountiful balls run dry, and the last meager spurt of cum dribbles down over your fingers. Terry slumps against you with a luxuriant groan as you release [hisher] cock, snapping your wrist to remove the lingering fluids.", parse);
	Text.NL();
	Text.Add("Casting an eye over Terry’s paintings, you teasingly praise [hisher] efforts; who would believe such a cute little [foxvixen] could shoot [hisher] load that far?", parse);
	Text.NL();
	
	world.TimeStep({minute: 15});
	
	if(terry.Relation() < 30) {
		Text.Add("The [foxvixen] simply stares at you with disdain.", parse);
		Text.NL();
		Text.Add("Alright, that joke was a little in poor taste, given the moment you just shared. Still, [heshe] made quite an impressive splatter - [heshe] obviously enjoyed [himher]self a lot.", parse);
		Text.NL();
		Text.Add("<i>“Yeah, I’ll admit I did. Thanks for that.”</i>", parse);
		Text.NL();
		Text.Add("Oh, it was your pleasure.", parse);
		Text.NL();
		Text.Add("<i>“Well, uhh… is that all?”</i>", parse);
		Text.NL();
		Text.Add("You take a moment to consider that. This would be a perfect opportunity to ask for sex, or you could be generous and let Terry go now; you’ve had some milk, you got [himher] off, do you really need to fuck?", parse);
		Text.Flush();
		
		//[Ask for sex] [Finished]
		var options = new Array();
		options.push({ nameStr : "Ask for sex",
			tooltip : "You’re having too much fun to stop now.",
			func : function() {
				Text.Clear();
				Text.Add("Well, if [heshe]’s up for it, you would like to do a little more...", parse);
				Text.NL();
				Text.Add("<i>“Well, I guess fair is fair. So, what do you want to do?”</i>", parse);
				Text.Flush();
				
				Scenes.Terry.SexPromptChoice();
			}, enabled : true
		});
		options.push({ nameStr : "Finished",
			tooltip : "You’ve had enough, so you’ll let Terry go this time.",
			func : function() {
				Text.Clear();
				Text.Add("You pat Terry on the shoulder and assure the [foxvixen] that you’re finished with [himher]. For now, anyway.", parse);
				Text.NL();
				Text.Add("<i>“Okay,”</i> [heshe] says, gathering [hisher] clothes.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Why the surprise? This huge cock is not just for show, y’know?”</i> [HeShe] grins.", parse);
		Text.NL();
		Text.Add("It most certainly isn’t. You’re so glad you gave it to [himher] - it’s just so much fun to play with...", parse);
		Text.NL();
		Text.Add("<i>“Hey now! Is that how you really see me? A toy [foxvixen] for you to play with?”</i> [heshe] asks with a smirk.", parse);
		Text.NL();
		Text.Add("[HeShe]’s cute, cuddly, fluffy, and makes cute little noises when you squeeze [himher]. You pinch [hisher] thigh, drawing a cute <i>yip</i> from the [foxvixen]. With a confident grin, you finish by saying that sounds like a toy to you.", parse);
		Text.NL();
		Text.Add("<i>“Meanie...”</i> [heshe] remarks, showing you [hisher] tongue.", parse);
		Text.NL();
		Text.Add("Smirking, you wrap your arms around Terry and hug [himher] close nuzzling the [foxvixen] affectionately. You both know [heshe] loves you for it.", parse);
		Text.NL();
		Text.Add("<i>“Cut it out, ya big perv,”</i> [heshe] says playfully pushing you away. <i>“I get it, no need to be so clingy.”</i> [HeShe] chuckles.", parse);
		Text.NL();
		Text.Add("Chortling yourself, you unwrap your arms and set the [foxvixen] free. You can’t help that [heshe]’s so huggable, though.", parse);
		Text.NL();
		Text.Add("<i>“More to the point though, you got me off. Aren’t you going to want me to return the favor?”</i>", parse);
		Text.NL();
		Text.Add("You pause for a second to consider your answer. It certainly would be a fair trade, but do you really want sex right now?", parse);
		Text.Flush();
		
		//[Yes] [No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : "Terry’s offering, you’re horny, so why pass it up?",
			func : function() {
				Text.Clear();
				Text.Add("You assure Terry that if [heshe] feels up to it, you’d be happy to give [himher] another round.", parse);
				Text.NL();
				Text.Add("<i>“Great! I’ll let you pick your poison then.”</i>", parse);
				Text.Flush();
				
				Scenes.Terry.SexPromptChoice();
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : "Even if Terry’s in the mood for more, you’re not.",
			func : function() {
				Text.Clear();
				Text.Add("With a shake, you assure Terry that it’s alright. You’re not really in the mood for sex right now.", parse);
				Text.NL();
				Text.Add("<i>“Alright. Guess we’ll save it for later then,”</i> [heshe] says, collecting [hisher] clothes.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“So, how about we see how far I can shoot when I’m <b>inside</b> you?”</i> [HeShe] winks at you.", parse);
		Text.NL();
		Text.Add("You can’t hold back a laugh at the [foxvixen]’s confidence. [HeShe] just came enough to embarrass a stallion; is [heshe] really so eager to go for another romp already?", parse);
		Text.NL();
		Text.Add("<i>“With a sexy thing like you? Always! Not to mention that as long as I have this.”</i> [HeShe] taps [hisher] collar. <i>“Getting ready for another go is easy as pie.”</i>", parse);
		Text.NL();
		Text.Add("Well, [heshe]’s right about that. And you have to admit, it’s at least a little tempting. If [heshe]’s so raring to go, maybe you ought to give [himher] another round...", parse);
		Text.Flush();
		
		//[Fuck] [Don’t fuck]
		var options = new Array();
		options.push({ nameStr : "Fuck",
			tooltip : "If Terry wants you this badly, why not oblige?",
			func : function() {
				Text.Clear();
				Text.Add("Well, since [heshe] asked so nicely, how can you turn [himher] down?", parse);
				Text.NL();
				Text.Add("<i>“I knew you couldn’t resist! Now, how do you want to play?”</i>", parse);
				Text.Flush();
				
				Scenes.Terry.SexPromptChoice();
			}, enabled : true
		});
		options.push({ nameStr : "Don’t fuck",
			tooltip : Text.Parse("Unfortunately for [himher], you’re really not in the mood for any more playtime.", parse),
			func : function() {
				Text.Clear();
				Text.Add("<i>“Don’t be like that, [playername]. You got me off, so it’s only fair I do the same for you. Plus I really, <b>reeeally</b> want you,”</i> [heshe] says, taking a step forward to gently stroke your [hips]. <i>“You’re not gonna be a jerkface and deny your favorite [foxvixen], are you?”</i> [heshe] asks, giving you [hisher] best impression of the infamous “puppy eyes”.", parse);
				Text.NL();
				Text.Add("You swallow hard, trying to retain your conviction in the face of Terry’s pleas. [HeShe] looks and sounds so heartbroken...", parse);
				Text.Flush();
				
				//[Submit] [Resist]
				var options = new Array();
				options.push({ nameStr : "Submit",
					tooltip : Text.Parse("How can you possibly say no to [himher] in the face of that?", parse),
					func : function() {
						Text.Clear();
						Text.Add("<i>“Works every single time,”</i> [heshe] says with a victorious grin.", parse);
						Text.NL();
						Text.Add("[HeShe] has gotten way too good at this. Still, you can’t find it in you to be mad.", parse);
						Text.NL();
						parse["len"] = player.Height() > terry.Height() + 10 ? Text.Parse(" standing on the tips of [hisher] toes and", parse) : "";
						Text.Add("<i>“Alright then, I’ll be a good sport and let you pick what we’ll be doing. But try not to take too long,”</i> [heshe] adds,[len] giving you a soft peck on the cheek.", parse);
						Text.Flush();
						
						Scenes.Terry.SexPromptChoice();
					}, enabled : true
				});
				options.push({ nameStr : "Resist",
					tooltip : "You have to stand strong!",
					func : function() {
						Text.Clear();
						Text.Add("<i>“Awww....”</i>", parse);
						Text.NL();
						Text.Add("You just stare at [himher], stubbornly holding your ground. You won’t be swayed, not this time.", parse);
						Text.NL();
						Text.Add("[HeShe] sighs in defeat. <i>“Okay then, I’ll concede this time, but next time you’re mine!”</i>", parse);
						Text.NL();
						Text.Add("Maybe, maybe not. You’ll just have to see.", parse);
						Text.Flush();
						
						Gui.NextPrompt();
					}, enabled : true
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

Scenes.Terry.SexHaveADrinkBreastsArousalFoxcock = function(parse) {
	Text.Clear();
	Text.Add("Decision made, you slide yourself neatly off of Terry’s back and seat yourself on the ground beside [himher]. Without preamble, you reach out and scoop the [foxvixen] off of the ground, pulling [himher] unceremoniously into your lap.", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("Tempting as it is, you make certain that ", parse);
		if(player.NumCocks() > 1)
			Text.Add("your [cocks] do not", parse);
		else
			Text.Add("your [cock] doesn’t", parse);
		Text.Add(" penetrate [himher], instead sliding harmlessly between [hisher] thighs.", parse);
		Text.NL();
	}
	Text.Add("Your arms twine around the [foxvixen]’s waist, reaching down to caress [hisher] thighs and coax them apart. One hand then slides inwards towards the [foxvixen]’s crotch. The roundness of [hisher] dainty little balls is your first target, and you cup them carefully between your fingers, rolling them appreciatively across your palm before you continue.", parse);
	Text.NL();
	Text.Add("You can feel Terry’s erection with your [hand]. The petite vulpine dick has already risen to its full extent, throbbing softly against your [skin] in time with [hisher] heartbeat. Just brushing it with one finger makes Terry sharply suck in a breath and shudder against you.", parse);
	Text.NL();
	Text.Add("Mischievously, you note to Terry that it looks like [heshe] enjoyed your nursing.", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("<i>“Yeah, I guess I did...”</i>", parse);
		Text.NL();
		Text.Add("No need to be so embarrassed about it; you wanted this to feel as good for [himher] as it does for you.", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Heh, of course I did. I mean, there had to be a reason you gave me these; ‘sides eye-candy, I mean.”</i>", parse);
		Text.NL();
		Text.Add("Not that they don’t do an ample job there, too.", parse);
	}
	else {
		Text.Add("<i>“It’s always a thrill with you, [playername]. You should know that much,”</i> [heshe] says with a smile.", parse);
		Text.NL();
		Text.Add("Oh, you know. It’s just so pleasing to be hearing it from [hisher] lips.", parse);
	}
	Text.NL();
	Text.Add("Slowly, your hand starts to pump the [foxvixen]’s shaft, fingers kneading as you rise and fall along its diminutive length. Terry sighs dreamily and then lazily slumps back against you. If [heshe] were a cat, you’re certain [heshe]’d be purring in time with your touch.", parse);
	Text.NL();
	Text.Add("The sight brings a smile to your face. Such a laid-back little [foxvixen]. [HeShe]’s enjoying this, isn’t [heshe]?", parse);
	Text.NL();
	Text.Add("<i>“Yeah, it feels pretty good.”</i>", parse);
	Text.NL();
	Text.Add("You thought as much; [heshe] looks so content. [HeShe] really is far too cute for [hisher] own good, does [heshe] know that? ", parse);
	if(terry.PronounGender() == Gender.female)
		Text.Add("With her sweet[little] tits and this dainty little girl-cock in your fingers, she’s just the yummiest girl you’ve ever held. ", {little: terry.Cup() < Terry.Breasts.Bcup ? " little" : ""});
	else
		Text.Add("Between his pretty face, his[big] milky boobs and this sweet little fox-dick, you could just eat him up.", {big: terry.Cup() >= Terry.Breasts.Ccup ? " big" : ""});
	Text.NL();
	Text.Add("<i>“Yet, here you are stroking my dick and fondling my balls… perv.”</i>", parse);
	Text.NL();
	Text.Add("[HeShe] wouldn’t get this kind of treatment if you weren’t. It’s not such a bad thing that you are, is it?", parse);
	Text.NL();
	Text.Add("<i>“Maybe not,”</i> [heshe] giggles. <i>“Focus a bit more on the tip?”</i>", parse);
	Text.NL();
	Text.Add("Like this? You slide your fingers up until you are caressing [hisher] pointy glans with just the tips.", parse);
	Text.NL();
	Text.Add("<i>“Yeah, right - ahn! - there!”</i>", parse);
	Text.NL();
	Text.Add("As the [foxvixen] luxuriates, you consider what you should do with your free hand. You’re already molesting Terry’s cock with one hand, and with [himher] seated like this, [hisher] ass is a little tricky to get to.", parse);
	Text.NL();
	Text.Add("Mind made up, you reach up and carefully cup one of [hisher] [tbreasts]. ", parse);
	if(terry.Cup() <= Terry.Breasts.Acup)
		Text.Add("The petite little orb fits effortlessly into your cupped hand. With so little flesh, you have to settle for stroking it with your palm more than kneading it.", parse);
	else if(terry.Cup() <= Terry.Breasts.Bcup)
		Text.Add("Perfectly sized for what you have in mind, the boob meshes effortlessly with your cupped fingers. Just enough titflesh to caress as you rub it with your palm.", parse);
	else if(terry.Cup() <= Terry.Breasts.Ccup)
		Text.Add("Fat and full, Terry’s generous breast squishes delightfully as your digits close around it, bulging softly where your hand can’t cover it. You hardly need to press down with your palm, and instead focus on kneading with your fingers.", parse);
	else
		Text.Add("The juicy fruit of Terry’s bosom is soft and pliant under your digits. So lusciously ripe that you haven’t a hope of fitting it into your hand, you settle for shamelessly groping it, fingers working to caress, knead and stroke everything that you can reach.", parse);
	Text.NL();
	Text.Add("Terry moans, arching [hisher] back at your touch. As you continue to caress [himher], you ask if you’re being too rough; you know [hisher] nipples must be extra-sensitive at the moment.", parse);
	Text.NL();
	Text.Add("<i>“A bit, but it also feels - oh! - so good.”</i> [HeShe] grinds back against you, fluffy tail batting your side as it wags.", parse);
	Text.NL();
	Text.Add("That’s good to hear. Your sweet little pet deserves a reward from time to time. If you had a third hand, you’d scratch [himher] between the ears.", parse);
	Text.NL();
	Text.Add("You continue your task, smiling to yourself when Terry starts bucking into your hand. [HisHer] knot grows under your careful ministrations, a sign that Terry is approaching [hisher] climax.", parse);
	Text.NL();
	Text.Add("Well, there’s no need to hold back now. If [heshe]’s close, [heshe] should just cum for you.", parse);
	Text.NL();
	Text.Add("<i>“I - ahn!”</i>", parse);
	Text.NL();
	Text.Add("Here, since you’re such a nice [guygirl], you’ll help [himher]. You move your hand down to encircle the base of [hisher] shaft, forming a seal around [hisher] knot, then give it a small yank upwards. Terry moans and bucks [hisher] hips, lifting [himher]self off you just enough for you to slip your hand underneath [himher].", parse);
	Text.NL();
	Text.Add("You cup [hisher] bubble butt and adjust [himher] so [heshe]’s sitting on [hisher] knees. Brandishing a pair of fingers, you lather them with your saliva and press both digits to Terry’s waiting pucker.", parse);
	Text.NL();
	Text.Add("<i>“[playername]...”</i> [heshe] starts, before a moan cuts [himher] short.", parse);
	Text.NL();
	Text.Add("Terry, you whisper [hisher] name.", parse);
	Text.NL();
	Text.Add("<i>“Y-yeah?”</i>", parse);
	Text.NL();
	Text.Add("Cum for me, you order [himher], promptly shoving your slickened finger up [hisher] butt.", parse);
	Text.NL();
	Text.Add("The [foxvixen] cries out in pleasure, spasming as you curl your digits to press on [hisher] prostate like a pleasure buzzer. You can feel [hisher] shaft throb in your hand and let loose the first rope of [hisher] vulpine seed.", parse);
	Text.NL();
	Text.Add("You give Terry no quarter, massaging [hisher] prostate throughout [hisher] orgasm, pulling [himher] close in an attempt to encompass [himher] as the [foxvixen] shivers with the effort of pushing [hisher] cum out into the air.", parse);
	Text.NL();
	
	var cum = terry.OrgasmCum();
	
	Text.Add("Your pet [foxvixen] isn’t terribly productive, so you’re not surprised when the flow of [hisher] seed tapers after only a few shots. You give [hisher] prostate one more push to draw the last stubborn rope from [himher] and then pull your fingers out.", parse);
	Text.NL();
	Text.Add("Chuckling to yourself, you pat Terry’s head and whisper into [hisher] ears that [heshe]’s a good [boygirl].", parse);
	Text.NL();
	Text.Add("<i>“Hmm...”</i> [heshe] simply moans, slumping down.", parse);
	Text.NL();
	Text.Add("Seems like you wore [himher] out.", parse);
	Text.NL();
	
	world.TimeStep({minute: 15});
	
	if(terry.Relation() < 30) {
		Text.Add("<i>“Uhh, just give me a few minutes...”</i>", parse);
		Text.NL();
		Text.Add("Of course, you tell [himher], bringing [himher] closer for a hug.", parse);
		Text.NL();
		Text.Add("True to [hisher] word, it only takes a bit before [heshe] extracts [himher]self from your arms. <i>“Thanks, [playername]. That was pretty great, although I’m not sure I liked you fingering my ass like that,”</i> [heshe] adds with a pout.", parse);
		Text.NL();
		Text.Add("Considering [hisher] reaction, you didn’t think [heshe]’d complain.", parse);
		Text.NL();
		Text.Add("<i>“I’m not! I’d just appreciate a little warning next time, that’s all.”</i>", parse);
		Text.NL();
		Text.Add("You’ll consider it, though it does take a bit of the fun away.", parse);
		Text.NL();
		Text.Add("<i>“Yeah… right...”</i>", parse);
		Text.NL();
		Text.Add("Now that your [foxvixen] has gotten off and is sufficiently rested, perhaps you should consider asking for some reciprocity?", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : Text.Parse("After that display of [hishers], you sure could use some help getting off yourself.", parse),
			func : function() {
				Text.Clear();
				Text.Add("<i>“You still want to fool around? Well, alright I guess. I mean, it’s only fair right?”</i> [heshe] asks with a timid smile.", parse);
				Text.NL();
				Text.Add("Fair is fair indeed, now… what will you do?", parse);
				Text.Flush();
				
				Scenes.Terry.SexPromptChoice();
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : "The closeness and the show were enough for you.",
			func : function() {
				Text.Clear();
				Text.Add("You tell Terry to get dressed, the two of you need to get back to your duties.", parse);
				Text.NL();
				Text.Add("<i>“Okay,”</i> [heshe] says, already gathering [hisher] clothes.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“I can still keep going...”</i>", parse);
		Text.NL();
		Text.Add("You laugh at [hisher] reply. Even if [heshe] could, it might be better to wait for a bit. You don’t want others to think you’re abusing your poor pet [foxvixen].", parse);
		Text.NL();
		Text.Add("<i>“More than you already do?”</i> [heshe] asks with a smirk.", parse);
		Text.NL();
		Text.Add("Well now, that is an entirely different type of <i>abuse</i>. Plus, you feel you’re entirely justified, considering how [heshe] keeps waving that cute butt and fluffy tail in front of you.", parse);
		Text.NL();
		Text.Add("<i>“Yeah, I should know better than to tempt a huge perv, right?”</i>", parse);
		Text.NL();
		Text.Add("As if [heshe] wasn’t one [himher]self…", parse);
		Text.NL();
		Text.Add("Terry simply chuckles and shows you [hisher] tongue. <i>“Alright, I guess I feel well enough now. So… how about I pay you back for our little fun time?”</i>", parse);
		Text.NL();
		Text.Add("Hmm…", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : Text.Parse("Since [heshe]’s offering, why not? After all, you’ve got an itch that could use some scratching...", parse),
			func : function() {
				Text.Clear();
				Text.Add("Terry grins. <i>“Knew you couldn’t resist the invitation of more sloppy [foxvixen] sex. Ya big perv!”</i>", parse);
				Text.NL();
				Text.Add("Ouch! Now [heshe]’s just hurting you!", parse);
				Text.NL();
				Text.Add("[HeShe] laughs. <i>“Okay, okay. Will you take my apology if I let you decide what to do next?”</i>", parse);
				Text.NL();
				Text.Add("Sure! [HeShe]’s got [himher]self a deal!", parse);
				Text.NL();
				Text.Add("<i>“Figures...”</i> [heshe] says rolling [hisher] eyes.", parse);
				Text.Flush();
				
				Scenes.Terry.SexPromptChoice();
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : "Much as you appreciate the offer, right now you’re just not in the mood.",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Alright then. There’s always next time, right?”</i>", parse);
				Text.NL();
				Text.Add("Definitely! You reply, gathering your clothes alongside Terry.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“Only a little,”</i> [heshe] replies, giggling.", parse);
		Text.NL();
		Text.Add("That so? Will [heshe] be needing some time to rest?", parse);
		Text.NL();
		Text.Add("<i>“Depends, will you hold me while I’m resting?”</i>", parse);
		Text.NL();
		Text.Add("Hmm… yes?", parse);
		Text.NL();
		Text.Add("<i>“Then a couple minutes wouldn’t hurt,”</i> [heshe] says, leaning against you and adjusting [himher]self into a more comfortable position.", parse);
		Text.NL();
		Text.Add("You let your arms drape over the [foxvixen], hugging [himher] closer as you luxuriate into [hisher] soft fur. Chuckling softly, you question [hisher] lack of snarky remarks. Not gonna call you a perv or anything this time?", parse);
		Text.NL();
		Text.Add("<i>“I figure I don’t have to keep stating the obvious, plus we both know you can’t keep your hands off me.”</i> [HeShe] grins.", parse);
		Text.NL();
		Text.Add("Right back at [himher], you say.", parse);
		Text.NL();
		Text.Add("<i>“Oh, but I wasn’t always like this. You corrupted me with your insatiable perviness.”</i>", parse);
		Text.NL();
		Text.Add("So [heshe] blames you? Alright then, you’ll fix [himher] right up. From now on, there will be no more perviness from your part.", parse);
		Text.NL();
		Text.Add("<i>“Whoa, let’s not take any drastic measures, [playername]. You dangle a bone in front of me and then take it away before I even had a chance to chew it up properly,”</i> [heshe] protests.", parse);
		Text.NL();
		Text.Add("Aha, you knew that was going to get a reaction!", parse);
		Text.NL();
		Text.Add("<i>“Jerk...”</i>", parse);
		Text.NL();
		Text.Add("Silly [foxvixen]...", parse);
		Text.NL();
		Text.Add("<i>“Kiss me?”</i> [heshe] asks, twisting around to face you.", parse);
		Text.NL();
		Text.Add("You simply close your eyes and stroke [hisher] cheek in reply.", parse);
		Text.NL();
		Text.Add("Terry presses [hisher] lips against yours into a short kiss, leaving you with a sweet aftertaste when [heshe] breaks away.", parse);
		Text.NL();
		Text.Add("<i>“Okay, I feel good to go now. So, how about me paying you back for the treatment?”</i>", parse);
		Text.Flush();
		
		//[Sure][Later]
		var options = new Array();
		options.push({ nameStr : "Sure",
			tooltip : "Sounds like a wonderful idea.",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Great! I’ll let you decide how I can repay you then, I’m cool with anything, as long as it involves you, my sexy [playername],”</i> [heshe] says, gently caressing your cheek.", parse);
				Text.Flush();
				
				Scenes.Terry.SexPromptChoice();
			}, enabled : true
		});
		options.push({ nameStr : "Later",
			tooltip : Text.Parse("You’re fine. You just wanted to pleasure your favorite [foxvixen].", parse),
			func : function() {
				Text.Clear();
				Text.Add("<i>“...You really think I’ll buy that? You’ve had your fun, now it’s time for me to have mine. Plus I feel really, <b>really</b> thankful,”</i> [heshe] says, caressing your [breasts].", parse);
				Text.Flush();
				
				//[Give in][Don’t]
				var options = new Array();
				options.push({ nameStr : "Give in",
					tooltip : Text.Parse("Well if [heshe]’s <i>that</i> thankful, you see no point in denying the [foxvixen] [hisher] fun.", parse),
					func : function() {
						Text.Clear();
						Text.Add("<i>“Glad we could see eye to eye, now watcha feel like doing, my lovely?”</i>", parse);
						Text.NL();
						Text.Add("Hmm…", parse);
						Text.Flush();
						
						Scenes.Terry.SexPromptChoice();
					}, enabled : true
				});
				options.push({ nameStr : "Don’t",
					tooltip : "Much as you appreciate the invitation, you really don’t feel like fooling around right now.",
					func : function() {
						Text.Clear();
						Text.Add("[HeShe] doesn’t mind if you two do that later, does [heshe]?", parse);
						Text.NL();
						Text.Add("<i>“Well, I really wanted to get some [playername] right now, but since I like you so much, I suppose I can make a little sacrifice for your sake - this time.”</i>", parse);
						Text.NL();
						Text.Add("Lucky you…", parse);
						Text.NL();
						Text.Add("<i>“Careful, I might just take a bite at you sometime.”</i>", parse);
						Text.NL();
						Text.Add("You don’t doubt that.", parse);
						Text.NL();
						Text.Add("<i>“Cool, we have an understanding then,”</i> [heshe] says, getting up and letting [hisher] fluffy tail brush against your cheek.", parse);
						Text.NL();
						Text.Add("Terry ensures you get a good view of [hisher] naughty bits as [heshe] sets about dressing [himher]self back up. Damn this [foxvixen]...", parse);
						Text.Flush();
						
						player.AddLustFraction(0.25);
						
						Gui.NextPrompt();
					}, enabled : true
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

Scenes.Terry.SexHaveADrinkBreastsArousalPussy = function(parse) {
	Text.Clear();
	Text.Add("Time to make your little [foxvixen] really feel like a woman...", parse);
	if(terry.PronounGender() == Gender.male)
		Text.Add(" Oh, how he’d chew you out if you said that to his face...", parse);
	Text.NL();
	Text.Add("Delicately, you slide yourself off of Terry’s chest and settle onto the ground beside [himher]. Then, quick as a wink, you snatch [himher] up and unceremoniously swing [himher] into your lap.", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("<i>“[playername]?”</i>", parse);
		Text.NL();
		Text.Add("Smiling softly to yourself, you place a gentle finger on the [foxvixen]’s lips and shush [himher]. All [heshe] needs to do is to relax; [heshe]’s going to love this...", parse);
		Text.NL();
		Text.Add("Terry complies, though you do detect a hint of tension on [hisher] shoulders as [heshe] leans back against you.", parse);
		Text.NL();
		Text.Add("That’s a good [boygirl]. Just settle down and let you work your magic...", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Hm? What are you planning?”</i>", parse);
		Text.NL();
		Text.Add("Oh, just something [heshe]’s going to enjoy, you promise [himher] that.", parse);
		Text.NL();
		Text.Add("<i>“Then I can get a refund if I don’t enjoy it?”</i> [heshe] asks teasingly.", parse);
		Text.NL();
		Text.Add("That sounds fair enough, but you doubt [heshe]’ll get a chance to collect.", parse);
		Text.NL();
		Text.Add("<i>“Someone’s feeling confident.”</i>", parse);
		Text.NL();
		Text.Add("Oh, you have good reason to feel that way. Let’s show [himher] why...", parse);
	}
	else {
		Text.Add("<i>“Haha, big perv can’t keep [hisher] [hand]s off me?”</i>", parse);
		Text.NL();
		Text.Add("Nope. You don’t want to try, either. You’d rather play with your fluffy little [foxvixen] instead.", parse);
		Text.NL();
		Text.Add("<i>“Sheesh, maybe I should start charging you by the hour?”</i> [heshe] asks teasingly.", parse);
		Text.NL();
		Text.Add("Oh, [heshe] really is a thief, isn’t [heshe]? First, [heshe] steals your heart, now [heshe] wants to bleed your wallet dry?", parse);
		Text.NL();
		Text.Add("<i>“What can I say? I take pride in my work.”</i> [HeShe] grins.", parse);
		Text.NL();
		Text.Add("As do you. Now, if [heshe]’ll let you start, you’re sure [heshe] won’t regret giving you this one for free.", parse);
	}
	Text.NL();
	Text.Add("Tucking your head into the crook of the [foxvixen]’s neck, your arm gently snakes around [hisher] waist and rests itself upon [hisher] midriff. ", parse);
	
	var womb = terry.PregHandler().Womb();
	var preg = womb && womb.pregnant;
	var stage = womb && womb.progress;
	
	if(preg) {
		if(stage > 0.75) {
			Text.Add("Hugely round and ripe, Terry’s belly is stretched tight over the engorged womb beneath. [HisHer] fur has grown thin in [hisher] gravidity, and you can feel the soft, silken skin as you tenderly caress it. Hard and firm, there is almost no give to [hisher] skin at all, a sign that your child will be with you soon.", parse);
			Text.NL();
			Text.Add("Your fingers spiral around and around, brushing out as far as you can hope to reach. You outline a gentle tattoo upon the taut flesh as you reach lower, cupping the underside of the bulging orb.", parse);
		}
		else if(stage > 0.5) {
			Text.Add("The [foxvixen]’s pregnancy is unmistakable, belly bulging like some ripe fruit. You lovingly run your hand across the great swell of white, silken fur, feeling it slide smoothly beneath your touch. Underneath lies skin grown increasingly taut, though with still a little give to it; [heshe] has bigger still to grow.", parse);
			Text.NL();
			Text.Add("Though you have to strain a little to reach it all, you trace a circuitous route around [hisher] stomach with your [palm], stopping only when you can tenderly pinch [hisher] protruding nipple between your forefinger and thumb.", parse);
		}
		else if(stage > 0.25) {
			Text.Add("As your child grows inside of [himher], Terry’s belly has begun to swell. Like a loaf rising in an oven, it has bulged out, forming a distinct rounded shape. Though the skin bows beneath your hand, you can feel the firm tightness of it, the womb growing increasingly full inside.", parse);
			Text.NL();
			Text.Add("You lazily start to rub your hand back and forth, using long, smooth strokes that glide over [hisher] luscious fur. Gently, you knead and caress, rubbing circles as you go.", parse);
		}
		else {
			Text.Add("Lush, silken fur greets your hand as it starts to stroke back and forth. Terry’s stomach is toned and firm, but there’s something a little off about it. Your hand is drawn down below [hisher] navel, where you can feel it better.", parse);
			Text.NL();
			Text.Add("There’s a tightness to the flesh there, as if something beneath was starting to make it stretch and yet, [heshe] is growing wider; the unmistakable beginnings of a small bulge lie under your hand. Trying to make it out better, you continue to brush back and forth. You have a sneaking suspicion of what it is. Looks like Terry is going to be a mommy...", parse);
		}
	}
	else {
		Text.Add("Terry isn’t exactly packing a set of rippling six-pack abs, but [heshe]’s not some butterball either - not by a long shot. As your hand glides over long, soft fur, you can feel the firm, toned flesh beneath. Terry’s stomach is flat as a pancake, perfect for you to rub back and forth. Slowly, at first, but then quicker, massaging [himher] deeper with each stroke.", parse);
	}
	Text.NL();
	Text.Add("The [foxvixen] groans luxuriantly, relaxing against you as if you were a full-body pillow. You smile to yourself, but you have more in mind than a mere tummy rub. Still tracing circles across [hisher] flesh, you allow your hand to creep lower, reaching for Terry’s loins.", parse);
	Text.NL();
	Text.Add("Without even thinking about it, Terry spreads [hisher] legs, giving you access. ", parse);
	if(terry.HorseCock()) {
		Text.Add("The impressive length of stallionflesh has already begun to creep from its sheath as your fingers wrap around it. It hardens under your touch, mighty veins throbbing as they work to engorge it to its full stature. You allow yourself the luxury of caressing it, savoring the feel of its turgid weight pulsing in your grip.", parse);
		Text.NL();
		Text.Add("Terry arches [hisher] back and mewls softly, shifting restlessly in your lap. You doubt that [heshe]’d object to a handjob, but you have something different in mind.", parse);
		Text.NL();
		Text.Add("Ignoring [hisher] whimper of protest, you release [hisher] horsehood and creep down lower still. You spare [hisher] full, heavy testes a quick caress in passing, but your real target lies beneath, and so you nudge them aside to expose [hisher] womanhood.", parse);
	}
	else if(terry.FirstCock()) {
		Text.Add("The [foxvixen]’s dainty little cock is already wet and throbbing as your hand grazes it in passing. You can’t resist the urge to palm it, feeling it pulse as you gently rub its length up and down with tender motions.", parse);
		Text.NL();
		Text.Add("Terry moans softly, clearly relishing the attention. It would be so easy to just pet [himher] until [heshe] cums... but you know [heshe]’ll like what you have planned even better.", parse);
		Text.NL();
		Text.Add("Downwards your fingers creep, pausing only to playfully tickle [hisher] little balls with your fingertips. Nudging them aside, you are rewarded with your true goal: the pink lips of Terry’s pussy.", parse);
	}
	else {
		Text.Add("Nothing stops you from reaching your target, as your fingers descend unflinchingly toward Terry’s cunt.", parse);
	}
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("<i>“Huh? That’s-”</i>", parse);
		Text.NL();
		Text.Add("Going to make [himher] feel very good, yes. It is why you gave [himher] a pussy, after all; just for occasions like this.", parse);
		Text.NL();
		Text.Add("<i>“Hmm, o-okay.”</i>", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Hmm, so this is what you had in mind, huh?”</i>", parse);
		Text.NL();
		Text.Add("Yep. Is [heshe] disappointed?", parse);
		Text.NL();
		Text.Add("[HeShe] shakes [hisher] head. <i>“Not really, I kinda expected you to go for my honeypot, so I’d say this is pretty typical.”</i> [HeShe] smiles.", parse);
		Text.NL();
		Text.Add("Well, you’re glad [heshe]’s okay with this. It’s the perfect thing to make [himher] feel good about [himher]self.", parse);
	}
	else {
		Text.Add("<i>“Ah! So this is what you had in mind, my pervy [mastermistress]?”</i>", parse);
		Text.NL();
		Text.Add("That’s right. Just the thing for pleasing a pervy little [foxxyvixxy].", parse);
		Text.NL();
		Text.Add("<i>“Hmm, okay. Go ahead then; pet me good...”</i>", parse);
		Text.NL();
		Text.Add("Oh, with pleasure...", parse);
	}
	Text.NL();
	Text.Add("You carefully run the tip of your finger up along one dainty vulva lip. The smooth, silken flesh crinkles at your touch, reflexively trying to squeeze close and making you retreat to avoid being caught. When Terry relaxes, you move in again, languidly running your digit back and forth along the warm, soft skin. You stroke up and down, slowly tracing the full lengths of [hisher] netherlips.", parse);
	Text.NL();
	Text.Add("<i>“Ahn...”</i> the [foxvixen] moans softly. As you stroke, you can feel [himher] becoming wet, slowly leaking and moistening your [hand]s, making it easier to rub and caress [himher] just the right way. As you continue your ministrations, it doesn’t take long until the air around you is saturated with the scent of horny [foxvixen].", parse);
	Text.NL();
	Text.Add("You close your eyes and inhale, loudly and deliberately, basking in the scent of Terry’s arousal. With a satisfied purr, you note that Terry truly makes the most wonderful perfume.", parse);
	Text.NL();
	if(terry.Relation() < 60) {
		Text.Add("<i>“D-don’t tease me like that...”</i>", parse);
		Text.NL();
		parse["c"] = terry.FirstCock() ? " mixed with the scent of pre-cum," : "";
		Text.Add("Oh, but you mean every word. The smell of [hisher] pussy just drooling in lust,[c] it’s just intoxicating. If only [heshe] would wear it more often...", parse);
		Text.NL();
		Text.Add("Terry swallows audibly. <i>“I’m not sure what to say...”</i> [heshe] says, flustered by your words.", parse);
		Text.NL();
		Text.Add("Then don’t say anything, you tell [himher]. Just sit back, relax, and enjoy it. A pretty thing like [himher] shouldn’t be worrying so much.", parse);
	}
	else {
		Text.Add("<i>“Hmm, I’m glad you like my scent, but don’t get shy and stop with the flattery. I love hearing you say how much you like me.”</i> [HeShe] giggles.", parse);
		Text.NL();
		Text.Add("And you love telling [himher] how much you love [himher]. This scent of [hishers], why, it drives you wild; if [heshe] wore it more often, you don’t think you’d get anything done. [HeShe]’s simply irresistible...", parse);
		Text.NL();
		Text.Add("<i>“Maybe I should bottle it up and start using it then?”</i> [HeShe] grins. <i>“I wouldn’t mind having you all over myself...”</i>", parse);
		Text.NL();
		Text.Add("Fresh is always better, and you certainly don’t mind helping [himher] with the extraction process...", parse);
	}
	Text.NL();
	Text.Add("Feeling that Terry is finally ready, you worm your way carefully into [hisher] clitoral hood. The [foxvixen]’s clitoris is already jutting from the soft, plush flesh in arousal, and your fingertips close around it without hesitation.", parse);
	Text.NL();
	Text.Add("Terry inhales sharply, and wriggles at your touch. As you tenderly caress and knead the sensitive pleasure buzzer, [heshe] moans and mewls, panting as you tease [himher] and lure [himher] closer and closer to the edge.", parse);
	Text.NL();
	Text.Add("<i>“[playername]! I think I’m about to- Ah!”</i>", parse);
	Text.NL();
	
	var cum = terry.OrgasmCum();
	
	Text.Add("You can feel the [foxvixen]’s spine flexing as [heshe] arches [hisher] back, head turned skyward as if baying at some unseen moon. Thick femcum sprays from [hisher] pussy, squirting between its quenched lips and smearing over your dangling fingers.", parse);
	Text.NL();
	if(terry.FirstCock()) {
		if(terry.HorseCock())
			Text.Add("The equine pillar above erupts in an arcing fountain of hermseed, neglected balls almost audibly churning in their fury as they vent in sympathy to [hisher] feminine flower.", parse);
		else
			Text.Add("Driven to match [hisher] womanhood, Terry’s dainty fox-cock adds its own contribution to the growing puddle of fluids beneath Terry’s lap, spraying a gallant gush of dickcream to mingle with the [foxvixen]’s female nectar.", parse);
		Text.NL();
	}
	Text.Add("Reduced to a mere participant, all you can do is hold on as Terry’s juices seep down over your [legs]. You wait patiently until [heshe] shudders and, with a final moan, spills the last of it. [HeShe] then settles back against you with a blissful sigh.", parse);
	Text.NL();
	Text.Add("Smiling at [himher], you carefully adjust the [foxvixen] so that [heshe] will be more comfortable. You cradle [himher] tenderly in your arms, and allow [hisher] head to rest against your shoulder.", parse);
	Text.NL();
	Text.Add("Terry nuzzles against you, and you gently kiss [himher] on the cheek, asking if [heshe] enjoyed your little present.", parse);
	Text.NL();
	
	world.TimeStep({minute: 15});
	
	if(terry.Relation() < 30) {
		Text.Add("<i>“That was nice.”</i>", parse);
		Text.NL();
		Text.Add("...You were hoping for a little more enthusiasm than that.", parse);
		Text.NL();
		Text.Add("<i>“Sorry, it’s just that I’m a bit worn out after that...”</i>", parse);
		Text.NL();
		Text.Add("It’s alright. You’re just glad that [heshe] enjoyed that. You certainly did.", parse);
		Text.NL();
		Text.Add("That said, you adjust the weary [foxvixen] in your arms, cradling [himher] so that [heshe] can rest up. Despite [himher]self, Terry looks a little surprised at your generosity, but quietly accepts the offer.", parse);
		Text.NL();
		var gen = "";
		if(player.FirstCock()) gen += "your [cocks] starting to stiffen beneath [hisher] thighs";
		if(player.FirstCock() && player.FirstVag()) gen += " and ";
		if(player.FirstVag()) gen += "your [vag] starting to tingle with anticipation";
		parse["gen"] = Text.Parse(gen, parse);
		Text.Add("Time ticks softly by as you sit there. Terry’s breathing comes easier as [heshe] recovers from [hisher] recent climax. As [heshe] shifts in your lap, you are aware of [gen].", parse);
		Text.NL();
		Text.Add("Since you were so generous as to release [himher] before, maybe you ought to ask [himher] to take care of you in return...?", parse);
		Text.Flush();
		
		//[Yes] [No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : Text.Parse("Fair is fair; let your [foxvixen] pay you back, an orgasm for an orgasm.", parse),
			func : function() {
				Text.Clear();
				Text.Add("Mind made up, you ask if Terry feels rested now.", parse);
				Text.NL();
				Text.Add("<i>“Yes, I am. Thanks.”</i> [HeShe] smiles softly.", parse);
				Text.NL();
				Text.Add("That’s good to hear, because you’re not quite done with [himher] yet.", parse);
				Text.NL();
				Text.Add("Terry looks at you in confusion.", parse);
				Text.NL();
				Text.Add("Well, [heshe] was so hot before, perched on your lap and moaning like [heshe] was. You want to play around some more. See if you can make [himher] moan even harder...", parse);
				Text.NL();
				Text.Add("Realization dawns on Terry’s face, and [heshe] smiles softly. <i>“Okay, I guess fair is fair. What you wanna to do?”</i>", parse);
				Text.Flush();
				
				Scenes.Terry.SexPromptChoice();
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : Text.Parse("You’re not really that horny, just let [himher] go.", parse),
			func : function() {
				Text.Clear();
				Text.Add("Decision made, you ask Terry if [heshe]’s ready to get going now.", parse);
				Text.NL();
				Text.Add("<i>“Yup, I’m good.”</i>", parse);
				Text.NL();
				Text.Add("Alright then. You unwrap your arms so that the [foxvixen] can hop out of your lap. As [heshe] goes for [hisher] clothes, you haul yourself upright in turn. Once the both of you are ready, you set off once again.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Ugh, I could use some rest after that...”</i>", parse);
		Text.NL();
		Text.Add("After all that you put [himher] through, you’re not surprised. [HeShe] really did quite a lot just now. If [heshe] needs some rest, then [heshe] can just lie down here and get some.", parse);
		Text.NL();
		Text.Add("<i>“I think I’ll do just that then,”</i> [heshe] says, getting [himher]self comfortable.", parse);
		Text.NL();
		Text.Add("That’s a good [boygirl]... You start to softly stroke the long fluffy brush of Terry’s tail as [heshe] dozes against you, content to hold [himher] close until [heshe] is rested.", parse);
		Text.NL();
		Text.Add("A comfy silence envelops you both, until finally Terry shifts in [hisher] seat, turning partially to face you.", parse);
		Text.NL();
		Text.Add("<i>“So, you got me off pretty good, but what about you?”</i> [HeShe] smirks. <i>“", parse);
		if(player.FirstCock())
			Text.Add("I think I felt something stir in your pants. Plus, ", parse);
		Text.Add("I have a pretty good nose, y’know?”</i>", parse);
		Text.NL();
		Text.Add("Well, you’d be lying - to no avail, at that - if you claimed you weren’t turned on at the moment. But still, do you really want to have sex with Terry now?", parse);
		Text.Flush();
		
		//[Yes] [No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : Text.Parse("Why in the world would you turn [himher] down?", parse),
			func : function() {
				Text.Clear();
				Text.Add("Well, if [heshe]’s offering, you’d be happy to take [himher] up on [hisher] offer.", parse);
				Text.NL();
				Text.Add("<i>“Thought you would.”</i> [HeShe] grins. <i>“So, what you feel like doing?”</i>", parse);
				Text.Flush();
				
				Scenes.Terry.SexPromptChoice();
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : Text.Parse("You’re stronger than this. Tell [himher] thanks, but no thanks.", parse),
			func : function() {
				Text.Clear();
				Text.Add("You assure Terry that you’re fine, really, and you don’t need to get off at the moment.", parse);
				Text.NL();
				Text.Add("[HeShe] simply shrugs. <i>“Alright then, if you say so...”</i>", parse);
				Text.NL();
				Text.Add("Having made your decision, you unwrap your arms so that the [foxvixen] can hop out of your lap. As [heshe] pads over to [hisher] own clothes, you take the opportunity to haul yourself up right. Once both of you are set, you leave.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“Enjoy the show, [playername]?”</i>", parse);
		Text.NL();
		Text.Add("You certainly did. Terry’s always so fun to play with.", parse);
		Text.NL();
		Text.Add("[HeShe] giggles. <i>“Ya big perv!”</i> [heshe] exclaims, batting your side with [hisher] tail.", parse);
		Text.NL();
		Text.Add("Guilty as charged, but that’s why Terry loves you so. You rub the base of [hisher] ears, winning a pleased coo from the [foxvixen].", parse);
		Text.NL();
		Text.Add("You adjust your grip a little, settling Terry into a more comfortable seat atop you. The happy [foxvixen] readily snuggles up against you, using your shoulder as a makeshift pillow as [heshe] catches [hisher] breath.", parse);
		Text.NL();
		Text.Add("It’s a quiet, comfortable silence that envelops you both, broken only when Terry stirs restlessly in your arms, shifting to better face you.", parse);
		Text.NL();
		Text.Add("<i>“Alright, I’m good to go, so how about I pay you back for the massage?”</i>", parse);
		Text.Flush();
		
		//[Yes] [No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : Text.Parse("Well, if [heshe] insists, why not?", parse),
			func : function() {
				Text.Clear();
				Text.Add("You reply that you wouldn’t insist on payment, but, if [heshe] wants to, you’d be happy to let [himher] do so.", parse);
				Text.NL();
				Text.Add("<i>“Hehe, I know you too well, [playername]. Now, what do you feel like doing?”</i>", parse);
				Text.Flush();
				
				Scenes.Terry.SexPromptChoice();
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : "That really isn’t necessary.",
			func : function() {
				Text.Clear();
				Text.Add("You assure the [foxvixen] that [heshe] doesn’t need to pay you back.", parse);
				Text.NL();
				Text.Add("<i>“Oh, come on. Don’t act like you don’t want me after that little show.”</i> [HeShe] grins. <i>“I know what a big perv you are, plus I recall someone stirring around a bit too much while you were fingering me.”</i> [HeShe] shows [hisher] tongue.", parse);
				Text.NL();
				Text.Add("Well... [heshe] does have a point...", parse);
				Text.Flush();
				
				//[Give in] [Stay strong]
				var options = new Array();
				options.push({ nameStr : "Give in",
					tooltip : Text.Parse("If [heshe]’s really so eager, why fight it?", parse),
					func : function() {
						Text.Clear();
						Text.Add("You tell Terry that, if [heshe] insists, you’d love to have a little more fun first.", parse);
						Text.NL();
						Text.Add("<i>“Knew you’d give in. Can’t resist my charms, can you?”</i>", parse);
						Text.Flush();
						
						Scenes.Terry.SexPromptChoice();
					}, enabled : true
				});
				options.push({ nameStr : "Stay strong",
					tooltip : "You said no and you mean no!",
					func : function() {
						Text.Clear();
						Text.Add("Firmly, you tell Terry that you don’t want to have sex at the moment.", parse);
						Text.NL();
						Text.Add("<i>“Oh… well… if you put it that way, it’s okay I guess...”</i> [heshe] says, disappointed.", parse);
						Text.NL();
						Text.Add("Once you open your arms, the [foxvixen] clambers out. Still frowning, [heshe] walks over to retrieve [hisher] clothes, whilst you haul yourself upright in turn. Once both of you are ready, you set off once more.", parse);
						Text.Flush();
						
						terry.relation.DecreaseStat(0, 1);
						
						Gui.NextPrompt();
					}, enabled : true
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}
