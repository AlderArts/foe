
Scenes.Cassidy.Sex = {};

Scenes.Cassidy.Sex.Indoors = function() {
	var parse = {
		armor : function() { return player.ArmorDesc(); }
	};
	
	
	var first = !(cassidy.flags["Talk"] & Cassidy.Talk.SexIndoor);
	cassidy.flags["Talk"] |= Cassidy.Talk.SexIndoor;
	
	Text.Clear();
	if(first) {
		Text.Add("<i>“Gee, I’m not exactly sure I should. Can’t deny that I’m quite flattered, though. Yeah, I do know that Great-grandma was pretty much the town horse… but most of the time, it was she who was the one forcing herself on others. Just because she was an easy slut doesn’t mean I’ve got to be, you know.”</i>", parse);
		Text.NL();
		Text.Add("Hey, whoever said that? You sure know you didn’t. Besides, if it’s just you, then she’d be more of a… let’s say a prize mare instead. Someone who doesn’t get ridden that often, but by a good jockey, and when she’s ridden, it counts. There, does that sound better to her?", parse);
		Text.NL();
		Text.Add("Cass just folds her arms and looks askance. <i>“Heh… I don’t know. I guess it’s a little hard to open up at times. I know I shouldn’t be, that I’ve already pretty much spilled the beans that day you caught me dead on the floor from drinking, but…”</i>", parse);
		Text.NL();
		Text.Add("Hey, you’ll be gentle if she needs it.", parse);
		Text.NL();
		Text.Add("<i>“What? No, fuck that. Gentle is for wimps.”</i> Cassidy twists her head this way and that, as if looking for something, and you notice the tip of her tail is coiled tightly about one of the legs. <i>“You know what? Let’s do it. It’s stupid of me to have hang-ups about this when I’ve already poured my entire heart out to you - it’s nothing like what Great-grandma used to do. Besides, it’s not as if you can knock me up or anything, so we don’t need to worry about <b>that</b>. Come on, let’s get started!”</i>", parse);
		Text.NL();
		Text.Add("Heh. So reserved one moment, so enthusiastic the other. That’s Cass, all right.", parse);
		Text.NL();
		Text.Add("<i>“Let’s just get started before I’ve time to change my mind, okay?”</i>", parse);
		Text.NL();
		Text.Add("Okay, okay, you can take a hint! Sweeping over and grabbing Cassidy by the hand, you practically drag the salamander out of her seat and across the floor to her room. She makes a small show of pretending to resist you, toe-claws scraping lightly at the floor, but the big smile on her face betrays her thoughts.", parse);
		Text.NL();
		Text.Add("No worries, then. Blood will out in the end, even if it’s been tempered somewhat by experience. Cassidy lets out a small squeal and flops enthusiastically on the bed at a slight push from you, and greedily pulls off her own shirt even as you start doing away with your [armor]. Before too long, the both of you have thrown your clothes in a messy heap on the floor, and you’re more than ready to begin.", parse);
		Text.NL();
		Text.Add("So… what do you feel like tonight?", parse);
	}
	else {
		if(cassidy.Relation() >= 50)
			Text.Add("At the mere mention of the idea, Cass gives you a big grin and hug, wrapping her long, wiry arms about you and letting you get a good feel of the heat of her body. <i>“Hey, I was starting to worry that you’d never ask. Let’s go, champ! A rematch it is!”</i>", parse);
		else
			Text.Add("Cass perks up and looks wryly at you at the mention of the idea. <i>“Guess I could blow off a little steam. After all, the last time wasn’t so bad, champ, and I’m always up for a rematch!”</i>", parse);
		Text.NL();
		Text.Add("Hey, sex isn’t <i>necessarily</i> like fighting…", parse);
		Text.NL();
		Text.Add("<i>“Yeah, but it’s so much more fun when it’s <b>competitive</b>.”</i>", parse);
		Text.NL();
		Text.Add("If this is a competition, then who’s keeping score?", parse);
		Text.NL();
		Text.Add("<i>“I am, of course.”</i> Cassidy prods you in the chest. <i>“I’ve even got the scoreboard hanging right above the bed; claw a notch in a plank every time I win.”</i>", parse);
		Text.NL();
		Text.Add("You just laugh, take the crook of Cass’ arm in yours, and lead her into her room. It’s large for one, but just right for two, and that fact’s made especially clear as the bed draws into view. Cass smirks and snorts a little as she wriggles out of her garments with no trouble at all, then applies those nimble, clawed fingers of hers to helping you undress.", parse);
		Text.NL();
		Text.Add("<i>“So!”</i> she says with a smile. <i>“What’ll my champ be having today? Main course is me, naturally, but I haven’t mentioned how I’ll be seasoned…”</i>", parse);
	}
	Text.Flush();
	
	Scenes.Cassidy.Sex.IndoorPrompt();
}

Scenes.Cassidy.Sex.IndoorPrompt = function(opts) {
	var parse = {
		
	};
	
	opts = opts || {};
	
	var cocksInVag = player.CocksThatFit(cassidy.FirstVag());
	var cocksInAss = player.CocksThatFit(cassidy.Butt());
	
	var options = [];
	options.push({nameStr : "Savor",
		tooltip : Text.Parse("No need to rush things. You’ll look her over first.", parse),
		enabled : !opts.savor,
		func : function() {
			Scenes.Cassidy.Sex.Savor(opts);
		}
	});
	options.push({nameStr : "Tail",
		tooltip : Text.Parse("She’s got a nice, long tail… it's not a cock, but Cass is resourceful.", parse),
		enabled : true,
		func : Scenes.Cassidy.Sex.Tail
	});
	if(player.BiggestCock(null, true)) {
		options.push({nameStr : "Fuck her",
			tooltip : Text.Parse("A traditional favorite.", parse),
			enabled : cocksInVag.length > 0,
			func : function() {
				Scenes.Cassidy.Sex.FuckHer(cocksInVag);
			}
		});
		// TODO: Maybe have a girth restriction on this.
		options.push({nameStr : "Anal",
			tooltip : Text.Parse("You feel like the greatest analmancer today, and are going to prove it.", parse),
			enabled : cocksInAss.length > 0,
			func : function() {
				Scenes.Cassidy.Sex.Anal(cocksInAss);
			}
		});
	}
	options.push({nameStr : "Pet",
		tooltip : Text.Parse("She must be sore after a long day at the forge… a “massage” might help.", parse),
		enabled : true,
		func : Scenes.Cassidy.Sex.Pet
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Cassidy.Sex.Savor = function(opts) {
	opts.savor = true;
	
	var parse = {
		
	};
	
	var fem = cassidy.Feminized();
	
	Text.Clear();
	Text.Add("<i>“You wanna look around, ace? Go right ahead! Like I told you before, I’ve got nothing to hide.”</i> Smirking at you, Cassidy lounges out on the bed before you like the lizard she is, instinctively pushing herself forth to accentuate her little display.", parse);
	Text.NL();
	Text.Add("Naked as she is, Cass is still the salamander you’ve always known, all five feet seven inches of her. With her shirt and shorts off, you can see exactly where her “gloves” and “stockings” of scales end and human skin begins - at her shoulders and mid-thigh respectively - and although you can see how the transition can be a bit jarring, Cass clearly thinks nothing of it.", parse);
	Text.NL();
	Text.Add("Seeing you take her in, Cassidy flashes you a winning grin. Her teeth are mostly human, but there’s a distinct bit of reptile in her - enough for the pointed tips of her upper canines to show themselves whenever she opens her mouth. Her hair is still the same old disheveled mop it’s always been", parse);
	if(fem)
		Text.Add(" even though she’s now grown it out past her ears", parse);
	Text.Add(", and a few stray fronds hang over her eyes as she returns your gaze and holds it.", parse);
	Text.NL();
	Text.Add("<i>“Hey, I thought you weren’t supposed to be looking at my face when you do this sort of thing.”</i>", parse);
	Text.NL();
	Text.Add("Shush, all in good time. You’ll get there eventually - there’s no need to rush, is there?", parse);
	Text.NL();
	Text.Add("Cassidy laughs and waves off your words. <i>“I’m waiting, I’m waiting! But it’s a little hard, I’ll say; we sally-manders are an impatient lot. Guess I’ll have to check you out too in the meantime, ace.”</i>", parse);
	Text.NL();
	Text.Add("She’s more than welcome to knock herself out.", parse);
	Text.NL();
	Text.Add("From her face, your eyes follow the smattering of freckle-like scales down her neck to her collarbone and torso. Seeing you shift your gaze, Cassidy does her best to thrust out her chest and push together her lady lumps in order to better present them to you.", parse);
	Text.NL();
	if(fem)
		Text.Add("Following her treatment, Cass’ breasts are a little less pointed and a little more rounded, although they’re far from the bombshell that her Great-grandmother must’ve been. You could put them at high As - they’re perky and firm, nice to play with, but they don’t get in the way of her daily work.", parse);
	else
		Text.Add("There’s no way to put it politely: Cassidy’s chest is almost flat. Oh, there’s no doubt that she’s got boobs - small, pointy things that would look more in place on a girl on the cusp of womanhood, rather than a young lady like her. Whatever that was in the blood that made Cassidy’s Great-grandmother and Grandmother bombshells, it seems to have skipped this generation. It’s to her credit, though, that she’s neither shy nor overly embarrassed about her situation - in fact, being mistaken for a guy aside, she doesn’t really seem to give it much thought.", parse);
	Text.NL();
	Text.Add("<i>“Helps if you don’t think of them as small, ace. ‘Fun-sized’ is a better way to put it - or if you’d like, ‘concentrated’. Kinda like that last one myself.”</i>", parse);
	Text.NL();
	Text.Add("You don’t know about that - fun-sized is rather more inviting and descriptive. Cass just makes a happy little noise and whips her tail around to her front, hugging it like a bolster. Since it’s there, you might as well take a good look. Cassidy’s tail is usually warm and burning with a bright orange glow, but as of the moment she’s doused most of the flames, leaving just a faint light to illuminate the darkness of her bedroom. The scales on her tail-tip are small and flexible, but rapidly grow in coarseness and rigidity as they reach the base of her tail. It’s long, prehensile and oh-so-flexible, which reminds you of a tentacle in certain aspects…", parse);
	Text.NL();
	Text.Add("Your eyes continue roving down, past her thin tummy with its faint musculature, and down to her groin and hips. ", parse);
	if(fem)
		Text.Add("Her hips are gently rounded, fuller than their once thin shape, marking her without doubt as a member of the female persuasion instead of the original androgynous slant they had. They’re not ripe, but a bimbo-butt wouldn’t suit Cass anyway, and especially not with that thick tail swaying just above her ass crack. Not too big, not too small - just about right for someone like her, really.", parse);
	else
		Text.Add("They’re thin and boyish, and probably the biggest contributor to her androgynous shape - nothing too much to look at, but they’re an important part of what makes Cass… well, herself, to be honest. It’s not as if you can’t have fun enough for the both of you, even with something like that.", parse);
	Text.NL();
	Text.Add("Seeing your gaze alight upon her cunt, Cassidy slowly slides her tail between her legs, letting its underside grind across her soft netherlips. She lets out an exaggerated, salacious moan as her tail moves back and forth, then winks at you as a slight blush creeps into her cheeks.", parse);
	Text.NL();
	Text.Add("All right, all right, you can take a hint; you were going to move down to her legs, but you’ll cut short the inspection just for her sake. Sheesh, does she have to be so impatient?", parse);
	Text.NL();
	Text.Add("<i>“Don’t have all night, ace, and I’m getting antsy down here. It’s got to be something about your eyes, I guess.”</i> Cassidy shrugs and breaks out into a languid smile. <i>“Let’s get started already!”</i>", parse);
	Text.Flush();
	
	player.AddLustFraction(0.3);
	world.TimeStep({minute: 15});
	
	Scenes.Cassidy.Sex.IndoorPrompt(opts);
}

Scenes.Cassidy.Sex.Tail = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("You think a moment, and run your eyes down Cassidy’s long, prehensile tail. It always shimmers with lovely heat, warm and pleasant to the touch - yes, you’ve made up your mind. That’s what you want to feel inside you tonight.", parse);
	Text.NL();
	Text.Add("Cass grins and grabs her tail as she pats the bedsheets welcomingly. <i>“Now that’s an idea I can get behind! Hop up, then. Spread that glorious ass of yours, ace, and prepare yourself!”</i>", parse);
	Text.NL();
	Text.Add("Well, what are you waiting for? You clamber up onto the bed, elbows sinking into the mattress, and wait for it to come. Cass, on her part, takes her time, dousing the flames from her tail-tip and giving it a salacious lick before whipping it around. The salamander smith may not be the most experienced around, but there’s something about the wolfish smile she’s giving you that sends shivers down your spine, something in her blood that’s chosen this moment to rouse itself.", parse);
	Text.NL();
	if(player.FirstVag()) {
		Text.Add("<i>“Hrmph. Here a hole, there a hole…you certainly know how to hold up people with choices.”</i>", parse);
		Text.NL();
		Text.Add("Choices? What choices?", parse);
		Text.NL();
		Text.Add("Cass chuckles. <i>“Of which hole you want it in, champ! Last question before I get started, promise!”</i>", parse);
		Text.NL();
		Text.Add("Yeah… that’s a reasonable question; after all, you didn’t specify which hole you wanted it in when you got started. So… where exactly <i>do</i> you want it, anyway?", parse);
		Text.Flush();
		
		var options = [];
		options.push({nameStr : "Fuck",
			tooltip : Text.Parse("In your cunt!", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("You’ve made up your mind. You want it in your heated pussy, to feel that wriggling tail-tip force its way past your netherlips and probe ever deeper into your depths like some horrible, tentacular, violating <i>thing</i>. A flush of desire runs through your lower belly at the mere thought of the act, reaching your loins and suffusing it with urgent warmth.", parse);
				Text.NL();
				Text.Add("<i>“Not a bad choice,”</i> Cass replies, giving you a pat on the shoulder. <i>“I do get a little practice on myself from time to time, heh. All right, then - ready or not, here I come!”</i>", parse);
				Text.NL();
				Scenes.Cassidy.Sex.Tailfuck();
			}
		});
		options.push({nameStr : "Peg",
			tooltip : Text.Parse("In the ass!", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("Right. You want it in the back door - the sheer thought of the strong, flexible tip of Cassidy’s tail violating your pucker, stretching your [anus] ever wider as more and more of its girth enters you ", parse);
				if(player.FirstCock())
					Text.Add("in search of your prostate ", parse);
				Text.Add("- it’s almost too much for you to bear.", parse);
				Text.NL();
				Text.Add("<i>“Trembling already?”</i> Cass teases you. <i>“Come on, ace - I haven’t even gotten started yet!”</i>", parse);
				Text.NL();
				Scenes.Cassidy.Sex.Tailpeg();
			}
		});
		options.push({nameStr : "Her choice",
			tooltip : Text.Parse("You don’t care, just get it in already!", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("You don’t really care, you’re dying down here from all the anticipation! Could she just get started already?", parse);
				Text.NL();
				Text.Add("<i>“Cool your tits, I’m coming all in good time.”</i> Behind you, you feel Cassidy’s hands clench just a little tighter on your shoulders as the salamander draws in a deep breath. <i>“Ready or not, here I am!”</i>", parse);
				Text.NL();
				
				if(Math.random() < 0.5)
					Scenes.Cassidy.Sex.Tailpeg();
				else
					Scenes.Cassidy.Sex.Tailfuck();
			}
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“That’s a pretty prim pucker you’ve got there, champ. Pity to have it ruined.”</i>", parse);
		Text.NL();
		Text.Add("Pity? What pity? It’ll be well worth it. Now would she hurry up and ream you already? You’re falling asleep down here as it is.", parse);
		Text.NL();
		Text.Add("Cass just laughs and prepares to mount you doggy-style, that tail of hers writhing as it probes its way between your cheeks.", parse);
		Text.NL();
		Scenes.Cassidy.Sex.Tailpeg();
	}
}

Scenes.Cassidy.Sex.Tailfuck = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Add("Try as you might, you can’t help but squeeze your eyes shut and ball your fists as Cassidy’s tail-tip winds its way closer to its target, lining up with your slit. She’s evidently had some sort of practice at this, fine, hard scales brushing against your increasingly swollen and wet netherlips, getting you all lubed up for the inevitable. You feel yourself being penetrated just a few times - barely so, with the barest of intrusions into your honeypot - but Cassidy always withdraws her tail after each gentle tease, causing you to squirm with an increasingly urgent need.", parse);
	Text.NL();
	Text.Add("Groaning, you buck your hips against that probing appendage, trying to take it into yourself - as they say, if you can’t go to the mountain, then have the mountain come to you. Sensing your intentions, Cass simply pulls away, determined to get this done on her terms and no one else’s.", parse);
	Text.NL();
	Text.Add("When she does come, it’s sudden, abrupt and brutal. Burning with an inner fire of its own, Cassidy’s tail plunges deep into your pussy, forcing it wide and gaping as more and more tailflesh sinks ever further into your depths. You howl as a burst of pain-tipped pleasure lances from your groin and up into your belly, then howl again as this is accompanied by a surge of fire - or at least, it <i>feels</i> that way - that sends your inner walls agush and clenching, desperate for more.", parse);
	Text.NL();
	
	Sex.Vaginal(cassidy, player);
	player.FuckVag(player.FirstVag(), null, 2);
	cassidy.Fuck(null, 2);
	
	Text.Add("All that knocks you down flat onto the mattress -  or you would’ve been, had not Cass roughly pulled you up by the shoulders and kept you in place. Desperate to believe that it’s dealing with a cock, your cunt squeezes and clenches about Cassidy’s tail, trying to milk it into oblivion. Love juices dribbles down and out, staining the sheets with sweet honey", parse);
	if(player.FirstCock())
		Text.Add(", and you shudder and tremble as a second surge of pleasure washes through your body, finally cumulating in blessed release as your [cocks] spew[notS] wad after wad of sperm in burning ecstasy", parse);
	Text.Add(".", parse);
	
	var cum = player.OrgasmCum();
	
	Text.NL();
	Text.Add("With a final groan and shudder, you’re unable to keep yourself upright anymore and collapse readily onto your own mess of love-juices, a soft squelch rising from the bed as the aftershocks die out and leave you wriggling and gasping for breath.", parse);
	Text.NL();
	Text.Add("Letting go of your shoulders, Cass sighs and smacks your ass with a good resounding slap. <i>“Wow, champ. I knew I was good, but I’m always surprised to learn that I’m <b>that</b> good.”</i>", parse);
	Text.NL();
	Text.Add("You take a moment to try and put your jumbled thoughts in some semblance of order before replying. Right. She’s good. Well… she’s probably used to it, and you aren’t.", parse);
	Text.NL();
	Text.Add("<i>“Oh, so you’re saying you want another go?”</i>", parse);
	Text.NL();
	Text.Add("Not tonight, not tonight!", parse);
	Text.NL();
	Scenes.Cassidy.Sex.Outro();
}

Scenes.Cassidy.Sex.Tailpeg = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Add("You hear Cassidy draw a deep breath, and can practically <i>feel</i> the anticipation building as her prehensile, reptilian tail explores the entirety of your [anus] all round. That small sheen of spit on the tip of her tail isn’t going to be enough lube - far from anything remotely resembling enough, to be honest - and your last coherent thought is that maybe, just <i>maybe</i>, she did that on purpose…", parse);
	Text.NL();
	Text.Add("Even though you’re half-expecting it, the entry of Cass’ tail into your pucker is nevertheless a brutal shock, made all the more so by the scraping of the scales on her tail against your vulnerable sphincter. The fiery salamander tail doesn’t just force its way into your back door, it smashes the whole thing wide with astounding brutality, shattering the lock and sending splinters flying all over the place. Your eyes roll back into your head of their own accord, and every last iota of breath is knocked out of your sails as more and more of Cassidy’s tail sinks into your rear, ", parse);
	if(player.FirstCock())
		Text.Add("a rampaging, fiery horde that wastes no time in seeking out your prostate.", parse);
	else
		Text.Add("a fiery lance of pleasure-pain that has your fists scrunching up and eyes watering.", parse);
	Text.NL();
	
	Sex.Anal(cassidy, player);
	player.FuckAnal(player.Butt(), null, 2);
	cassidy.Fuck(null, 2);
	
	Text.Add("<i>“How’s that for a start?”</i> Cassidy asks from behind you, yanking you upwards by the shoulders and preventing you from just collapsing onto the bed where you are. <i>“Don’t know why people don’t lead with their best punch more often, but I’m not going to hold back when it comes to this!”</i>", parse);
	Text.NL();
	Text.Add("You manage to murmur something that’s neither here nor there; Cass just giggles in reply and forces more of her tail into you. Even with your eyes screwed shut, you can visualize every inch of the wriggling appendage worming its way further and further up your ass, and this isn’t helped by the fact that you can <i>feel</i> it doing just that. Your [anus] feels like it’s going to be torn in two even as it stretches and widens to accommodate more and more of Cassidy’s hot tail.", parse);
	Text.NL();
	Text.Add("Like she said, though, this is just the beginning. Once she has a firm grip on you, Cassidy begins hammering ", parse);
	if(player.FirstCock())
		Text.Add("your prostate", parse);
	else
		Text.Add("you", parse);
	Text.Add(" mercilessly, quickly thrusting her tail in and out of your [anus] while you gasp and moan like ", parse);
	if(player.Race().isRace(Race.Canine))
		Text.Add("the bitch in heat that you are", parse);
	else
		Text.Add("a shameless whore", parse);
	Text.Add(". While you make a few attempts at reciprocating, trying to push your ass against her invading tail tip, you quickly give up due the sheer lack of energy to… well, do much of anything save just sit back and let the chips fall where they may. Cassidy, on the other hand, is snarling and grunting away like some savage beast - she’s clearly enjoying herself. Maybe a little too much… but everyone’s got to have a favorite, right?", parse);
	Text.NL();
	Text.Add("Faster and faster she goes, and you can feel the pricking of Cassidy’s claws starting to sink ever so slightly into your flesh as she ramps up in ferocity, threatening to tear apart your tender insides with the brutal fucking she’s giving you. Despite her lack of bulk, all the energy she usually expends in hammering metal has been redirected into hammering your ass instead; reduced to a helpless, whimpering mass, you’re pretty much putty in Cass’ hands.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	Text.Add("At last, you can’t take any more. Even if you had the strength to hold back your climax, you don’t think you would have wanted to, and it wells up in you like a dam about to burst. Somehow sensing this, Cassidy tightens her hold on you and rams as much of her tail into you as far as it’ll go - that’s far more than enough to send you over the edge, and you yowl with what little breath’s still in your body as love-juices gush out of you like an open faucet.", parse);
	if(player.FirstCock()) {
		Text.Add(" Such heavenly pain is more than you can bear, and groan as you completely and utterly drain every last drop of sperm you can muster down onto the sheets. That is to say, a lot.", parse);
		Text.NL();
		Text.Add("You seem to be going on longer than you should, more and more jizz erupting from your [cockTip] and soon realize why - somehow, Cassidy has managed to wrap one of her leathery palms about your [cocks], working with your orgasm to jerk you off and milk you for everything you’ve got.", parse);
	}
	if(player.FirstVag()) {
		Text.NL();
		Text.Add("A waterfall of thick, feminine nectar bursts from your [vag] and oozes down onto the sheets, leaving you whimpering like a defeated puppy.", parse);
	}
	Text.NL();
	Text.Add("You’re not exactly sure when the throes of passion finally die down enough for you to get some semblance of control of yourself, but the next thing you’re aware of is a gaping coolness as Cassidy slowly removes her tail from your [anus], making sure that you feel every inch of her withdrawal in most exquisite and grating detail. You don’t know how you’re going to be getting up to leave later - or maybe even sit down for a good while - but it was so worth it.", parse);
	Text.NL();
	Text.Add("<i>“There, there,”</i> Cassidy coos in her best maternal impression - which isn’t very much so, but it’s the thought that counts. <i>“You took the heat quite well, ace. That was quite fun!”</i>", parse);
	Text.NL();
	Text.Add("Yeah, it was fun, but you’ll need a little while to recover. She’s sure got a lot of energy packed into that body of hers.", parse);
	Text.NL();
	Text.Add("<I>“Yeah, champ! I’m nothing if not energetic.”</i> She leans in to give you a quick peck on the cheek. <i>“Don’t worry, I’m not so heartless as to kick you out right now.”</i>", parse);
	Text.NL();
	Text.Add("That’s good to hear. You’ll need a little while before you’re feeling up to walking again.", parse);
	Text.NL();
	Text.Add("Cass just laughs.", parse);
	Text.NL();
	Scenes.Cassidy.Sex.Outro();
}

Scenes.Cassidy.Sex.FuckHer = function(cocksInVag) {
	var p1cock = player.BiggestCock(cocksInVag);
	var realcock = !p1cock.isStrapon;
	
	var parse = {
		
	};
	parse = player.ParserTags(parse, "", p1cock);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	if(!realcock)
		parse["toy"] = player.Strapon().sDesc();
	
	
	Text.Clear();
	if(realcock) {
		Text.Add("While you might have been in the mood for something more unorthodox another time, tonight you feel like honoring some age-old traditions and just going for the old meat and potatoes.", parse);
		Text.NL();
		Text.Add("<i>“Oh?”</i> Cass arches an eyebrow at you and smiles with a suspiciously exaggerated pleasantness. <i>“Let me help you get started, then.”</i>", parse);
		Text.NL();
		Text.Add("Before you can reply, she’s already snaked out a hand and grabbed hold of ", parse);
		if(player.NumCocks() > 1)
			Text.Add("a specimen from your [cocks]", parse);
		else
			Text.Add("your [cock]", parse);
		Text.Add(", toying with it in her leathery, scaly palm. You’re able to feel very distinctly the sharp pricking of her claws against sensitive flesh, and she tightens her fingers ever so slightly before showing her teeth at you.", parse);
		Text.NL();
		Text.Add("<i>“Wonder what’d happen if I squeezed down hard.”</i>", parse);
		Text.NL();
		Text.Add("Oh no! You have no idea what <i>would</i> happen!", parse);
		Text.NL();
		Text.Add("Seeing you call her bluff, Cass just laughs and gives you a slap to the side of your [thigh], then clenches her fist about the girth of your rod as best as she can. Her grip is tight but not painfully so, and you can practically feel your pulse rushing into your [cockTip] as pleasure mounts as you feel your [cocks] swell with arousal.", parse);
	}
	else {
		Text.Add("Right. Reaching for your gear, you extract your [toy] from the pile and strap it about your crotch, making sure your salamander lover sees everything of what you’re doing. Cassidy’s eyes widen a bit, then momentary surprise quickly gives way to amusement as she just shakes her head and sighs.", parse);
		Text.NL();
		Text.Add("<i>“Compensating for something, champ?”</i>", parse);
		Text.NL();
		Text.Add("You can’t be compensating if you don’t have one in the first place, can you?", parse);
		Text.NL();
		Text.Add("Cass chuckles. <i>“That’s true.”</i> She reaches down and grabs the [toy] by its shaft, feeling for every ridge and bump with her fingertips and giving a soft sigh as she explores its length.", parse);
	}
	Text.NL();
	Text.Add("Meanwhile, her other hand’s wandered down to her slit, slowly teasing her glistening folds apart before jabbing her fingertips into her soft, oh-so-human nethers. The salamander’s eyes don’t leave your groin as she begins pumping into herself with a steady rhythm, pupils glazed over and clearly fantasizing about what it’d be like to have that in her.", parse);
	Text.NL();
	Text.Add("Time to make her fantasies reality, then. Taking hold of Cassidy’s wrist, you guide her fingers away, trailing strands of girl-juice that still join her claw-tips to her cunt. She doesn’t need that; what you’ve got  is so much better. Cass exhales a large, heated breath into your face, then giggles as you join her on the bed. ", parse);
	if(realcock)
		Text.Add("Even as your [cockTip] brushes against her labia, a surge of burning arousal rushes up your shaft and into your groin - her insides feel like they’re on fire! ", parse);
	Text.Add("Eager to just get started already, Cass works with you to get everything lined up, then pushes you back into the mattress as you thrust, greedily taking you into her burning nethers as she gleefully begins to ride you.", parse);
	Text.NL();
	
	Sex.Vaginal(player, cassidy);
	cassidy.FuckVag(cassidy.FirstVag(), p1cock, 3);
	player.Fuck(p1cock, 3);
	
	if(realcock) {
		Text.Add("It’s unbelievable; the intense heat of Cassidy’s insides charges up your [cock] to engulf the entirety of your being even as they begin to squeeze and undulate about your shaft. You feel like your man-meat’s been thrown into a forge at full blast; everything’s been blotted out save for your awareness of Cass’ cunt enveloping you with explosive energy, and you throw your head back and groan aloud as you lose it.", parse);
		if(player.NumCocks() > 1)
			Text.Add(" Your other shaft[s2] flop[notS2] this way and that, drooling pre-cum as they batter away - Cass’ skin and scales may be a poor substitute for her insides, but at least they’re still warmer than simple air.", parse);
	}
	else {
		Text.Add("Even though your shaft isn’t real, the heat emanating from her groin as your hips mash together and the steaming girl-cum that oozes down onto you is enough to convince you that maybe this is for the best.", parse);
	}
	Text.NL();
	Text.Add("Her small breasts heaving as she pants, Cassidy grabs your shoulders to steady herself as she continues riding you, pushing herself off you to withdraw herself only to have to follow her up with a thrust of your hips. Her eyes glaze over and mouth opens in a silent yowl of pleasure, small, sharp teeth glistening in the dim light as her jaw goes slack.", parse);
	Text.NL();
	Text.Add("Oh, she liked that, then? Even with her on top, you’ll be sure to give as good as you get! Feeling about her hips for what purchase you can get, you squeeze and push her back down onto your shaft with all your might, soundly impaling her all the way again. She tries to escape again, only to have you pull her back down; this goes on a few times even as both of your movements grow increasingly frenzied. Trusting you to keep ahold of her, Cass lets go of your shoulders and begins to knead her small breasts like a two-coin whore, shamelessly and clumsily groping her own boobflesh and nipples even as you fuck her silly. It’s true that she lacks technique, but she more than makes up for it with enthusiasm.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	if(realcock) {
		Text.Add("Finally, you can’t take it much longer. A lewd groan escapes your lips involuntarily, and you tighten your grip on Cassidy’s waist and hips as you pull her close and hilt yourself into her", parse);
		if(p1cock.Knot())
			Text.Add(", your knot swelling and easily tying the two of you together", parse);
		Text.Add(" as you fill her up with a good dose of baby batter", parse);
		if(cum >= 6)
			Text.Add(", enough to cause her lower belly to bulge from the sheer volume you’re pumping into her. Unable to hold that much, the remainder just oozes and bubbles its way out of her and around your shaft, eventually finding its way onto the sheets and making a hot mess of everything", parse);
	}
	else {
		Text.Add("With all the sensuous vibrations reaching your own cunt via the shaft of your [toy], its base grinding away at your petals, you can’t take much more of this. Pulling Cassidy close, you throw your head back and let out a long groan as you do your best to hilt it in her", parse);
	}
	Text.Add(".", parse);
	Text.NL();
	Text.Add("Cass, on her part, lets out a half-groan, half-hiss, plainly spiked with bestial urgency and need. Her tail curls about you, then squeezes tight as her orgasm comes, shudders wracking her light yet strong frame as love juices spill from her burning depths to smear your groin. With the way they’re almost literally steaming, you ought to be scalded, but all you feel is a pleasant yet intense warmth. Eventually, though, the orgasm fades, and she sags against you, placing a palm on the mattress to steady herself.", parse);
	Text.NL();
	Text.Add("<i>“Whoa,”</i> she manages to choke out between pants. <i>“Not… not half bad.”</i>", parse);
	if(realcock)
		Text.Add(" Her insides still throb and squeeze about your spent member, trying to drag out those last few moments before you inevitably go soft in her.", parse);
	Text.NL();
	Text.Add("Eventually, though, the time to withdraw arrives, and once that’s achieved, the two of you flop onto opposite ends of the bed, utterly exhausted and sated all at once.", parse);
	Text.NL();
	
	Scenes.Cassidy.Sex.Outro();
}

Scenes.Cassidy.Sex.Pet = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	var fem = cassidy.Feminized();
	
	Text.Clear();
	Text.Add("Hmm. How would she like a full-body massage? It’s been a long day, and surely standing at the forge for so long means she’s sore all over.", parse);
	Text.NL();
	Text.Add("<i>“What do you mean, ace? I’ve never had-”</i> her voice suddenly cuts off as she catches the look on your face, and her eyes brighten and smile widens. <i>“Oh, of course. You wouldn’t imagine how unimaginably pooped I am right now. What I wouldn’t give for a nice, comfortable pair of hands to make me feel better all over.”</i> Cass wiggles on the sheets for emphasis in a fashion you suppose is supposed to be inviting and alluring, her tail lashing from side to side. Hey, her failure makes it all the more endearing - she really isn’t built for that kind of stuff.", parse);
	Text.NL();
	Text.Add("<i>“Sorry though,”</i> she admits as she rubs the back of her head a little sheepishly. <i>“Didn’t know you’d want to give me a rubdown - the only kind of oil I’ve got in the shop is the kind you don’t really want on yourself.”</i>", parse);
	Text.NL();
	Text.Add("Oh, that’s all right. While it’s true that a little oil might’ve helped things along, you’re more than comfortable with your bare hands. Clambering onto the bed with Cass, you help her into a prone position with her belly down towards the mattress, then dig your fingers between her shoulder blades and begin. Whether she wants to admit it or not, Cassidy’s back is pretty wound up tonight; she lets out little humming noises of pleasure as you ease out the kinks and knots, her tail shimmering with heat as it swishes back and forth.", parse);
	Text.NL();
	Text.Add("<i>“Thanks, champ. That feels pretty good.”</i>", parse);
	Text.NL();
	Text.Add("Oh, you can make her feel even better if she wants to.", parse);
	Text.NL();
	Text.Add("Cassidy just clicks her tongue and laughs softly. <i>“Actually, I should be the one making you feel good, you know. But since you’re so eager about this, Grandma did teach me to be a good host. You want to make me feel good, you’ve got one shot at it tonight! Only so much massaging a sally-mander can take before she gets sore!”</i>", parse);
	Text.NL();
	Text.Add("Is that a challenge you hear?", parse);
	Text.NL();
	Text.Add("<i>“It can be if you want it to be, ace. So, are you up for it, or no?”</i>", parse);
	Text.NL();
	Text.Add("Oh, you’re up for it. Where do you want to begin your plan of attack, though?", parse);
	Text.Flush();
	
	//[Breasts][Cunt][Tail]
	var options = [];
	options.push({nameStr : "Breasts",
		tooltip : Text.Parse("They’re not small, they’re fun-sized!", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("You take a few moments to apply the finishing touches to Cassidy’s back and shoulders, then slowly settle yourself atop the salamander smith, firmly ensconcing her in your embrace and pressing your [breasts] against her back.", parse);
			Text.NL();
			if(player.FirstBreastRow().Size() > 5) {
				Text.Add("With your own juicy funbags pressed up against Cass’ hot body, you can’t help but drag your [nips] up and down her back a few times, feeling the feminine nubs of flesh swell and harden not just from friction, but from your own growing arousal. Cassidy doesn’t say anything, but from the way her back tenses, you know she damn well <i>felt</i> it.", parse);
				Text.NL();
			}
			Text.Add("Does that feel good?", parse);
			Text.NL();
			Text.Add("<I>“Yes, but -”</i>", parse);
			Text.NL();
			Text.Add("No ifs, no buts! Worming their way between skin and fabric, you slide your fingers downwards so that they’re firmly sandwiched between Cassidy’s boobs and the sheets. ", parse);
			if(fem) {
				Text.Add("All that effort you put into convincing Cass to get a more traditionally feminine figure’s finally paid off - the soft squishiness of her lady lumps almost, <i>almost</i> fills your hands, her small, perky nipples hardening between your fingers as you rub them up and down her areolae.", parse);
				Text.NL();
				Text.Add("Seized by a sudden need that’s mirrored by a surge of heat in her entire body, Cassidy pushes her breasts into your hands and squirms under you, lean, powerful muscles moving her torso in small circles. Soft, cute and fun-sized, her increasingly warm boobies do resemble a pair of hot water bottles on a cold day, and are every bit as welcome.", parse);
			}
			else {
				Text.Add("Despite not being as large as some you’ve come across in your time, Cassidy’s lady lumps are still as sensitive to touch as you’d hoped. An inner fire readily flows into her petite, perky humps in response to your touch, and Cass gasps, her entire form growing taut beneath yours. Gripped by a sudden urgency, she pushes her chest into your grasp, grinding her stiffening and increasingly heated nipples against your palms.", parse);
				Text.NL();
				Text.Add("<i>“Feels great,”</i> she groans breathlessly. <i>“Just look at all that tiredness wash away…”</i>", parse);
				Text.NL();
				Text.Add("Hmm, she sounds quite out of breath, though. Clearly, she’s had a extra tiring day and needs a deeper massage.", parse);
			}
			Text.NL();
			PrintDefaultOptions();
		}
	});
	options.push({nameStr : "Cunt",
		tooltip : Text.Parse("What better way to shed some stress than a good dose of relief?", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("Right. In order to be truly relaxed, one has got to go past the physical; it’s not just her body that’s worked hard, but her mind, too. The best way to shed that stress is to get a good dose of relief, and you know where to get just that. In fact, you even vaguely remember that what you’re about to do was touted as a cure for hysteria, although you’re not sure where exactly you heard that…", parse);
			Text.NL();
			Text.Add("In any case, you finish off the rubdown you were working on, and trail your fingers down the length of Cassidy’s spine. The salamander flicks her tail uncertainly as you hit the base of her tail, but you move past that across the gentle curve of her rump and down between her legs.", parse);
			Text.NL();
			Text.Add("<i>“Hey, I - oh. <b>Oh.</b>”</i> Compared to the air outside, Cass’ inner walls are as warm and toasty as they are as silken and smooth; she squirms and makes an urgent, needy little noise in the back of her throat as you slip a finger in, followed by another and begin a grand adventure of exploration in this tight, heated crevice. Bet she doesn’t manage to do this with as much vigor as you can; it’s one of the benefits of not having claws.", parse);
			Text.NL();
			Text.Add("A particularly energetic probe sends her squealing in a most un-tomboylike fashion, and she instinctively raises her pert little butt high into the air, lifting her tail in the process. Now that’s an invitation if you ever saw one - it’s a very tight fit, but you manage to slip your entire fist into her feminine flower. Scalding love-juices squelch loudly as you effect your entrance, and you can <i>feel</i> Cassidy shiver and shudder as you begin massaging her on the inside with one hand and on the outside with the other.", parse);
			Text.NL();
			Text.Add("Doesn’t that feel good? Isn’t she feeling all her stress melt away?", parse);
			Text.NL();
			Text.Add("All you get in reply is a little grunting noise, sounding much like a stifled cry. Heh. That’ll work.", parse);
			Text.NL();
			PrintDefaultOptions();
		}
	});
	options.push({nameStr : "Tail",
		tooltip : Text.Parse("Touch scaly tail. Enough said.", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("Gradually, your eyes are drawn to the entire length of Cassidy’s tail, all the way from thick base to tapered tip. Sometimes aflame, true… but now it’s not, merely ashimmer with a pleasant - no, inviting - heat that warms the cockles of your heart.", parse);
			Text.NL();
			Text.Add("It’s hard not to reach out and just touch scaly tail, and that’s what you do. Starting from the tip, you rub your fingers all over Cass’ tail, relaxing and simply enjoying the scraping of tiny, flexible scales on your fingertips.", parse);
			Text.NL();
			Text.Add("Cass, though, isn’t quite as comfortable with the idea. The moment your hands come into contact with her tail, the entire appendage stiffens. <i>“H-hey! That’s not n-nice! Could y-you not -”</i>", parse);
			Text.NL();
			Text.Add("It’s not nice? But she’s smiling, and golly, what a big soppy smile it is, even if it does tremble a little. C’mon, she can’t deny that she likes it.", parse);
			Text.NL();
			Text.Add("<I>“I am and I… I…”</i>", parse);
			Text.NL();
			Text.Add("She what? You brush your palm further up ever closer towards the base like pianist gracefully sweeping across a keyboard, then give it a good rub on the underside. Cass bites back a yelp - for a single appendage, her tail’s pretty strong, perhaps even moreso than an arm - but you manage to keep a grip on the salamander’s tail. It wriggles desperately in your grasp like some kind of giant worm or tentacle, and Cass makes an increasingly needy noise in the back of her throat as you slide a hand downwards to caress the slightly more leathery underside.", parse);
			Text.NL();
			Text.Add("Yeah, it’s pretty warm - in fact, it’s growing warmer and brighter by the minute, although the fire still remains dormant. You wrap your arms about the thicker portions and savor the warm fuzzies that your living body pillow is generating; small, flickering flames have sprouted into existence along Cassidy’s tail, and they lick merrily and harmlessly at you.", parse);
			Text.NL();
			Text.Add("<i>“Oh, why do I even bother…”</i> Cass groans, her voice shaking and trembling.", parse);
			Text.NL();
			Text.Add("Because she actually wants it, doesn’t she?", parse);
			Text.NL();
			Text.Add("Your fingers dance all the way up to the base of Cassidy’s tail, that spot where it joins her spine and the rest of her body, and begin caressing its entire circumference. The reaction is even stronger that you’d expected: while her tail goes limp and pliable in your hands, the rest of Cass’ body twitches as if seized by an invisible force. She lets out a long, breathless sigh, squeezing out all the air from her lungs, and tries to rise to her hands and knees - something glistens on her thighs in the dim lighting, and you have a good idea of what it is.", parse);
			Text.NL();
			Text.Add("With a glorious flourish, you let go of the rest of Cassidy’s tail and just concentrate on rubbing the base on both sides, putting your back into it as your movements come fast and furious.", parse);
			Text.NL();
			Text.Add("You hit the jackpot. The salamander’s hands ball into fists as her wiry form trembles violently and she lets out a yelp of pleasure as girl-cum practically blasts out of her clenching cunt and sprays all over the sheets. Seeing your efforts rewarded, you redouble them, and Cass twists her body and yelps again, her tail whipping around as another steaming squirt of feminine nectar leaves her.", parse);
			Text.NL();
			Text.Add("Much better.", parse);
			Text.NL();
			PrintDefaultOptions();
		}
	});
	
	Gui.Callstack.push(function() {
		Text.Add("As you move to continue, though, you feel something sinuous and scaly wrap itself about your leg, quickly snaking across your [skin]. You have barely enough time to wonder what Cass is about to do before it coils tight about your lower body, pulling you off-balance and sending you landing heavily on the mattress. Cass is huffing and puffing from your earlier ministrations, but it’s clear that her stamina is far from spent.", parse);
		Text.NL();
		Text.Add("<i>“Hey,”</i> she pants. <i>“Shouldn’t let you have all the fun, should I? It’s not fair to you.”</i>", parse);
		Text.NL();
		Text.Add("Why, you didn’t know she had such a great sense of justice.", parse);
		Text.NL();
		Text.Add("Cass aims a playful swipe at your head that you easily dodge. <i>“As they say, better to give than to receive, champ. Time to turn the tables!”</i>", parse);
		Text.NL();
		Text.Add("Another tug of her strong tail, and she has you on your back and is on you, pinning you to the mattress - or would be if she were heavy enough for it. Once she’s certain she’s got you subdued and prone on the sheets belly-up, she secures your shoulders with her hands and your [thigh] with her feet, then uncoils her tail from around you. You just go along with the game, feigning helplessness at your predicament, then almost double-take as Cassidy gives you an evil grin and gets down to work.", parse);
		Text.NL();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("Still keeping you pinned down as best as she can, Cass slithers her tail under and between her spread legs, and lets it work its way towards you. You can’t see where it’s going, but you can definitely <i>feel</i> it as the salamander’s tail-tip worms its way toward your crotch like some tentacle, leaving a trail of heat in its wake. It pauses a moment to ", parse);
			if(player.NumCocks() > 1)
				Text.Add("pick out a likely target and ", parse);
			Text.Add("tickle your [cockTip], then greedily winds its way about your glans in a smooth, unbroken river of caresses. The very tip teases your urethra, and you bite back a moan.", parse);
			Text.NL();
			Text.Add("<i>“Turnabout is fair play,”</i> Cassidy tells you in a sing-song voice. <i>“I bet you liked that!”</i>", parse);
			Text.NL();
			Text.Add("Another tickle at the sensitive ridge, and Cass seems pleased with your reaction.", parse);
			Text.NL();
			Text.Add("<i>“And I bet you want more! Well, since you like it so much, why don’t you have some, then! Giving is better than receiving, blessed are the generous and all that!”</i>", parse);
			Text.NL();
			Text.Add("Taking her time to be slow and sensual, Cassidy wraps more and more of her burning tail about your [cock], gradually encasing the entirety of its length in coils of scaly tail. ", parse);
			if(player.NumCocks() > 1)
				Text.Add("Once the first is fully enveloped, she moves onto the next, and so forth until all the tail length she can spare is wrapped up one way or the other. ", parse);
			Text.Add("Tightly bound up in your salacious serpentine lover, your [cocks] begin[notS] to ache terribly with growing pressure, bulging and straining against their constraints. On her part, Cass greedily wrings out your [cocks] with her tail, the end ", parse);
			if(player.NumCocks() > 1)
				Text.Add("darting from tip to exposed tip", parse);
			else
				Text.Add("continuing to toy with your [cockTip]", parse);
			Text.Add(" until you feel a terrible, mounting surge of warmth build up in [itsTheir] base. Sensing your imminent release, Cass tightens her grip along your shaft[s], grinning cheerily at you as she tries to deny you your much-needed release.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			if(cum >= 4) {
				Text.Add("Try as she might, though, the sheer amount of sperm you’ve got stored in you is simply too much to be contained. The constriction Cassidy’s tail is applying to your [cocks] only serves to ensure that your cum blasts forth in a pressurized jet, blasting against and painting her entire underside before raining down on you in a lewd drizzle. Cass just squeals and laughs as more and more jizz stains the sheets, lasting for a good while before her slick tail manages to shut off the flow.", parse);
				Text.NL();
				Text.Add("<i>“Hah,”</i> she says, licking her lips clean of a few stray drops of sperm. <i>“Can’t deny that failure’s never quite been just as sweet.”</i>", parse);
				Text.NL();
				Text.Add("Exhausted, you barely manage to muster the strength to nod.", parse);
			}
			else {
				Text.Add("Your urge to shoot off you load is strong, practically overpowering, but Cassidy’s tail is stronger. Muscles squeeze and contract in your lower belly, desperate to force your seed out, but Cass keeps a tight grip on your [cocks], effectively denying you your orgasm with a cheery smile. The two of you hold it there for a good five or ten minutes, the constricting coils of Cassidy’s tail holding you teetering on the brink, but unable to fall over or set foot on solid ground.", parse);
				Text.NL();
				Text.Add("You appear to have reached what some people call an impasse.", parse);
				Text.NL();
				Text.Add("<i>“I know I can’t hold on like this forever,”</i> she whispers down at you. <i>“But then again, neither can you. Want to make this a competition, champ?”</i>", parse);
				Text.NL();
				Text.Add("You don’t reply, just grit your teeth and strain. Once, twice - after the second, you feel Cass having to adjust her grip on your shaft[s] - and hey, the third try’s the charm. Summoning up all the aching, pent-up desire in your loins, you grunt and tense one last time, and fast and thick ropes of sperm blast from you, defying Cassidy’s tight grip to splurt out and onto yourself.", parse);
				Text.NL();
				Text.Add("Cass laughs. <i>“Thought I was determined, ace, but seems like you’re more determined than I am. Great show.”</i> Without warning, she releases her grip on your shaft[s], withdrawing her tail in a fast, whipping motion. While you might not have that much cum to spare, the sheer pent-up nature of your release and the exquisite wringing that Cass has given you conspire to send your seed practically geysering out from your [cockTip] in a fountain of spunk, rising far higher than you’d imagined. Cassidy nimbly nips back and only catches a few drops on her skin and scales as she watches you paint yourself with your own arcing jism.", parse);
				Text.NL();
				Text.Add("<i>“At least you didn’t make it all the way to the ceiling,”</i> she informs you cheerily, a shit-eating grin plastered on her face. <i>“That’d be hard to clean up.”</i> ", parse);
			}
		}, 1.0, function() { return player.FirstCock(); });
		scenes.AddEnc(function() {
			Text.Add("While she keeps her hands and feet occupied with pinning you onto the bed, her intentions are made clear by the scaly, prehensile tail snaking up your [thigh]. You feel its burning warmth near your groin for a moment and briefly wonder if that’s her goal, but soon enough its pointed tip continues past it and wriggles onto your stomach before finally inserting itself into your cleavage. More and more tail surges up, parting your [breasts], and the tip finally curls in about itself and starts to flick your nipples.", parse);
			Text.NL();
			Text.Add("You tremble and moan. A deep flush of warmth enters your chest as your [nips] swell and stiffen, and it’s not the heat of Cassidy’s tail, either.", parse);
			Text.NL();
			if(player.FirstBreastRow().Size() <= 5) {
				Text.Add("<i>“Sheesh,”</i> Cass says. <i>“Same things work on both me and you - sally-mander or not, guess boobs are boobs.”</i>", parse);
			}
			else {
				Text.Add("<i>“Heh,”</i> Cass says as she observes your reaction. <i>“Guess size doesn’t <b>really</b> matter when it comes to these things, huh?”</i>", parse);
				Text.NL();
				Text.Add("Oh, you wouldn’t know about that. You do have a bit more surface and volume to play around with, after all.", parse);
				Text.NL();
				Text.Add("She lifts a hand off your shoulder and waggles her fingers. <i>“Welp, no time like now to experiment a little.”</i>", parse);
			}
			Text.NL();
			Text.Add("With that,Cass lifts her hands off your shoulders and plants them firmly on your [breasts], feeling the firm softness give way under her leathery palms", parse);
			if(player.Lactation())
				Text.Add("even as small squirts of milk escape from your [nips]", parse);
			Text.Add(". Her hands ", parse);
			if(player.FirstBreastRow().Size() > 10) //E
				Text.Add("only manage to cup your [breasts] like snowcaps on a mountain peak", parse);
			else if(player.FirstBreastRow().Size() > 5) //C
				Text.Add("barely manage to engulf your [breasts], with quite a bit of flesh left over", parse);
			else
				Text.Add("greedily seize your [breasts]", parse);
			Text.Add(", and she starts kneading and rolling away.", parse);
			Text.NL();
			Text.Add("With how easily she’s going away at this… does she do this to herself often?", parse);
			Text.NL();
			Text.Add("Cass gives you an innocent smile and nonchalant shrug. <i>“Sometimes.”</i>", parse);
			Text.NL();
			Text.Add("You’re half-expecting Cass to pick up the pace, but she keeps things nice and slow, squashing your [breasts] together to form a nice tunnel for her tail to poke through, thrusting up and down and with exceptional vigor. Your entire body convulses and heaves against the sudden motion, trying to help Cass’ tail and hands along, but there’s little need for that - with all three appendages working away, it’s not long before you can’t hold in your whorish moans any longer and let them all out like a bitch in raging heat.", parse);
			Text.NL();
			Text.Add("Your lady lumps feel so tender, so exquisite, and the small, sharp pricks of tentative pain that come from Cassidy’s claws just make everything worse. Sweat runs down your body, easily lubricating that tail’s passage between your tits; the tender touch of two hands’ worth of fingers <i>and</i> a tail-tip have your [nips] fat, engorged and as hard as diamonds.", parse);
			Text.NL();
			Text.Add("Just when you think you’re going to have a boobgasm, though, Cass pulls away, withdrawing her tail and lifting her hands free from your chest. You groan loudly, the departure of the salamander’s body heat all the too obvious as cold air - bitingly cold - by comparison rushes in to take its place. Dismayed at this sudden betrayal, you jerk your head up to find Cass smiling coyly down at you.", parse);
			Text.NL();
			Text.Add("<i>“Hey, shouldn’t work you too hard. The idea’s to work out the kinks in your body, not put more in there.”</i>", parse);
			Text.NL();
			Text.Add("But… but… stress and… you try to form words, but the heavy, wanton panting that comes out of your mouth is determined to rob you of all faculties of speech. It’s all you can do to indicate your tingling chest, each passing moment filling your [breasts] with unrequited need. If there’s a boob equivalent of being blue-balled, this has to be it.", parse);
			Text.NL();
			Text.Add("<i>“Gotta be strict about it. Self-discipline.”</i>", parse);
			Text.NL();
			Text.Add("Aww…", parse);
			if(player.SubDom() >= 50) {
				Text.NL();
				Text.Add("part of you insists that you shouldn’t just take this lying down, but the greater part of you is too tired to go along with that idea.", parse);
			}
		}, 1.0, function() { return player.FirstBreastRow().Size() > 3; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Don’t feel that playful today myself,”</i> Cass tells you with a small smile and sigh. <i>“Doesn’t mean I can’t be polite and treat you to something nice, though. After all, not everything’s got to be about getting off, does it?”</i>", parse);
			Text.NL();
			Text.Add("Without waiting for your reply, Cassidy begins, returning your massage with one of a far less sexual nature. It’s not exactly titillating, but it does feel <i>very</i> nice, and you feel obliged to inform your salamander lover of that fact.", parse);
			Text.NL();
			Text.Add("She beams. <i>“Grandma taught me the technique, and I’ve had plenty of opportunities to get lots of practice. Just lie back and think of your favorite thing while I work on you, okay?”</i>", parse);
			Text.NL();
			Text.Add("Oh, all right. Part of you is a tad disappointed, especially considering the attentions that you’d just lavished on Cass, but What You’re Being Give Is What You’re Getting And It’s No Good Whining, as the old adage goes. Sinking back into the comfortable mattress, you do as Cass says and make yourself comfortable as she pounds away.", parse);
			Text.NL();
			Text.Add("Sure, she’s no professional, but it does feel pretty good to have those strong fingers turn their attentions to your body, showing surprising dexterity as they ease your pains and aches into nothingness.", parse);
			Text.NL();
			Text.Add("<i>“Feel good?”</i>", parse);
			Text.NL();
			Text.Add("Oh, certainly, though not exactly orthodox, especially the way she’s using her feet and tail.", parse);
			Text.NL();
			Text.Add("Cass gives you a coy smile and tilts her head. <i>“Well, you’ve got to have a good, strong tail for that kind of rubbing and pounding; doing one part at a time isn’t as good as all of them at once. Whole’s more than the sum of the parts, you know?”</i>", parse);
			Text.NL();
			Text.Add("Ah, of course. Sure, it may not be overtly sexual, but all the caressing, rubbing and petting is practically heavenly. When it comes to massages, it’s not just about what’s being done… but it’s also about who’s giving you one, too. It’s not a complete loss, either - every now and then, you find Cassidy’s tail-tip or fingers straying a little too close to some places for comfort, but she never wanders too far…", parse);
			Text.NL();
			Text.Add("Eventually, though, she’s covered your limbs and back, and you feel pretty refreshed all over.", parse);
			Text.NL();
			Text.Add("<i>“As good as new,”</i> Cass says as she surveys her handiwork and gives you a satisfied nod before lifting her weight off you. <i>“You’ll be sleeping well tonight and wake up tomorrow all raring to go.”</i>", parse);
			Text.NL();
			Text.Add("Well…", parse);
			Text.NL();
			Text.Add("<i>“Yeah, ace?”</i>", parse);
			Text.NL();
			Text.Add("<i>Well…</i>", parse);
			Text.NL();
			Text.Add("A laugh. <i>“Don’t worry about it, champ. I’ll do you some other time. It was fun - just let me get in the proper mood, or if you’re clever enough, why don’t you take a shot at getting my juices really flowing?”</i>", parse);
			Text.NL();
			Text.Add("You’ll have to take her up on that offer… some other time.", parse);
		}, 1.0, function() { return true; });
		scenes.Get();

		Text.NL();
		
		player.AddSexExp(1);
		
		Scenes.Cassidy.Sex.Outro();
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Cassidy.Sex.Anal = function(cocksInAss) {
	var p1cock = player.BiggestCock(cocksInAss);
	var realcock = !p1cock.isStrapon;
	
	var parse = {
		
	};
	parse = player.ParserTags(parse, "", p1cock);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	if(!realcock)
		parse["toy"] = player.Strapon().sDesc();
	
	var fem = cassidy.Feminized();
	
	Text.Clear();
	Text.Add("Ah… while you feel like blowing off some steam, you also don’t feel like doing it in the most orthodox of fashions. Maybe somewhere in-between… An idea hits you, and you tell Cass to get onto all fours on the mattress.", parse);
	Text.NL();
	parse["fem"] = fem ? "pert" : "flat";
	Text.Add("<i>“Oh? Guess I’ll go along with your game for now.”</i> With a wink and a coy smile, the salamander smith moves to obey, turning around and presenting her [fem] little butt to you. It isn’t till she lifts her tail, though, that you see you prize: her tight little back door, just waiting for you to violate - nah, shove your, - or perhaps, in other words, claim your prize. That’s what you intend to do, yes.", parse);
	Text.NL();
	Text.Add("<i>“Hey, what’s the big holdup, champ?”</i> Cass calls out to you, wiggling her tail in what you think is supposed to be a seductive fashion. It… well, it isn’t, to be honest, but she <i>is</i> trying, even if she doesn’t have the assets for anything remotely to do with ‘come hither’. Points for enthusiasm, if nothing else.", parse);
	Text.NL();
	Text.Add("Time to focus on the important details, though - like what lies between her butt cheeks, a tight little pucker that looks like it doesn’t get very much use in this fashion. Guess you’ll just have to help with that, then, no matter how many times it takes.", parse);
	Text.NL();
	Text.Add("Right, right, you’ll be with her and in her soon enough. ", parse);
	if(realcock) {
		Text.Add("Grabbing hold of ", parse);
		if(player.NumCocks() > 1)
			Text.Add("one of your dicks", parse);
		else
			Text.Add("your cock", parse);
		Text.Add(", you quickly rub and stroke it as hard as you can get it unaided", parse);
	}
	else {
		Text.Add("Retrieving your [toy], you quickly affix it in place, giving the straps a quick check to make sure they’re tight", parse);
	}
	Text.Add(", then drop down on the mattress and get your shaft lined up with Cass’ back door. Your [cockTip] brushes against it a few times, testing the waters as it were, and you see the salamander’s sphincter tighten in response to the stimulation.", parse);
	Text.NL();
	
	var mage = Jobs["Mage"].Unlocked(player);
	
	if(mage) {
		Text.Add("Well, guess that means she’s volunteered to come up and participate in your magic show.", parse);
		Text.NL();
		Text.Add("<i>“What kind of magic are you talking about?”</i>", parse);
		Text.NL();
		Text.Add("It’s your very own special school of spells. You’re calling it “analmancy”, and it’s her privilege to be able to feel, if not exactly see, it in action. It makes people feel really good and turns them into hopeless ass-whores, at least until the spell’s effect fades.", parse);
		Text.NL();
		Text.Add("Cass lets out an amused huff. <i>“That’s really cheesy.”</i>", parse);
		Text.NL();
		Text.Add("That’s why it’s so great! Okay, then; your wand’s prepped and all ready to go - time to work some magic!", parse);
		Text.NL();
	}
	Text.Add("Grinning, you push your hips forward and thrust into Cassidy’s tight back door. Her anal muscles instinctively clamp down on your ", parse);
	if(mage)
		Text.Add("magic wand", parse);
	else
		Text.Add("shaft", parse);
	Text.Add(", making you push and pound for each inch of man-meat you sink into her, a veritable battle to claim greater and greater lengths of her colon. Cass pants heavily and moans, finally letting out a little cry as you hilt your entire cock in her, her insides gripping you as tightly as one of the clamps in the shopfront.", parse);
	Text.NL();
	
	Sex.Anal(player, cassidy);
	cassidy.FuckAnal(cassidy.Butt(), p1cock, 3);
	player.Fuck(p1cock, 3);
	
	Text.Add("Once you’re satisfied with her little display, you lean your weight back and start pulling out, reversing the process. Cass’ sphincter is just as unwilling to let go of you as it was in your admission, and you watch in satisfaction as the salamander’s clawed hands grab the sheets tightly, scrunching them up between her fingers.", parse);
	Text.NL();
	Text.Add("In again! Eased by the first insertion, Cass’ back door gives way to one sudden, furious thrust from you, and she practically howls as her tail lashes out and grabs your midriff. Letting her head slump down onto the mattress, the salamander paws at her ", parse);
	if(fem)
		Text.Add("perky, rounded", parse);
	else
		Text.Add("small, pointy", parse);
	Text.Add(" breasts, shamelessly molesting herself as moisture begins leaking down her scaly legs. ", parse);
	if(mage)
		Text.Add("Behold, the magic of analmancy, much better than delivered right on time by you and straight from your magic wand! ", parse);
	Text.Add("You’re far, far from done, of course. In and out, in and out, ", parse);
	if(player.NumCocks() > 1)
		Text.Add("your other shaft[s] slapping at her ass, ", parse);
	Text.Add("you repeatedly administer the entirety of your length to Cassidy’s asshole with all the vigor and energy you can muster, hammering her back door like a piece of hot iron on an anvil. Cass cries out, tears welling up in her eyes and tongue lolling limply from her mouth as she pushes back against you eagerly, perhaps trying to force yet more of your delicious ", parse);
	if(mage)
		Text.Add("knobbed staff of analmancy", parse);
	else if(realcock)
		Text.Add("[cock]", parse);
	else
		Text.Add("[toy]", parse);
	Text.Add(" into her back door.", parse);
	Text.NL();
	Text.Add("With such an energetic display, it’s not long before Cassidy’s body shudders; a soft wail escapes her lips, and then there’s a splatter of glistening girl-cum on the sheets, tendrils of the stuff still connecting her pussy to the mess. You pull out and thrust a few more times, and before long you’re rewarded with a louder, more impassioned orgasm, the mess on the sheets growing even as her tail’s grip on your body tightens perceptibly.", parse);
	Text.NL();
	Text.Add("Exhausted, Cass slumps forward, presenting herself perfectly to receive your load, and you see no reason not to grace her with it. With a grunt of effort, you push yourself into her back door once more, bottoming out and blasting your spunk deep into her colon, your", parse);
	if(mage)
		Text.Add("... um, magical essence", parse);
	else
		Text.Add(" sperm", parse);
	Text.Add(" thoroughly flooding the salamander smith’s colon from the back, filling her increasingly heated body until you’ve got nothing left in you. The two of you just lie there for a moment", parse);
	if(p1cock.Knot())
		Text.Add(", tied together by your swollen knot", parse);
	Text.Add(" - you swear you can <i>see</i> heat shimmering in a haze off Cassidy’s body - to savor the aftermath ", parse);
	if(mage)
		Text.Add("of your little magic show ", parse);
	Text.Add("and let things cool off a bit. Cass tries to say something, but is pretty much too breathless at the moment to do so and eventually just gives up. Moments tick by, and at last you’ve softened enough to extract yourself from her without <i>too</i> much trouble, which you do.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	Text.Add("<i>“Right,”</i> Cass groans, flopping onto her belly. <i>“Thanks, champ.”</i>", parse);
	Text.NL();
	Text.Add("It was your pleasure.", parse);
	if(mage) {
		Text.Add(" If she ever needs you to put on another magic show for her ever again, she just needs to ask. You’d be glad to show her the magic of analmancy anytime she likes.", parse);
		Text.NL();
		Text.Add("<i>“Hey, just because it feels great… doesn’t mean it isn’t stupidly cheesy.”</i>", parse);
		Text.NL();
		Text.Add("Hah.", parse);
	}
	Text.NL();
	
	Scenes.Cassidy.Sex.Outro();
}

Scenes.Cassidy.Sex.Outro = function() {
	var parse = {
		
	};
	
	Text.Add("As much as you’d like to, you can’t stay here forever. Once you think you’ve caught your breath once more, it’s time for you to slip back into your clothes, get your stuff and make to leave. It’d be nice if you could sleep over sometimes, but like Cass would say, there’s always work to be done tomorrow.", parse);
	Text.NL();
	Text.Add("<i>“Going, eh?”</i> Cassidy says, rousing herself a little shakily from the bed and stepping over to give you a big hug, arms, legs and tail all. <i>“Be careful on your way home, okay?”</i>", parse);
	Text.NL();
	Text.Add("You will.", parse);
	Text.NL();
	Text.Add("It feels like forever before Cass releases you from her crushing grip, but she does just that and you feel the blood return to your extremities. <i>“Sheesh. Going to have trouble sleeping tonight, but guess it was worth it. Don’t be long in coming back!”</i>", parse);
	
	cassidy.relation.IncreaseStat(100, 2);
	world.StepToHour(0);
	party.location = world.loc.Rigard.ShopStreet.street;
	
	Text.Flush();
	
	Gui.NextPrompt();
}
