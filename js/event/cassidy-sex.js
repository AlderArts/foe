
let SexScenes = {};
let SparSexScenes = {};

SexScenes.Indoors = function() {
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
	
	SexScenes.IndoorPrompt();
}

SexScenes.IndoorPrompt = function(opts) {
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
			SexScenes.Savor(opts);
		}
	});
	options.push({nameStr : "Tail",
		tooltip : Text.Parse("She’s got a nice, long tail… it's not a cock, but Cass is resourceful.", parse),
		enabled : true,
		func : SexScenes.Tail
	});
	if(player.BiggestCock(null, true)) {
		options.push({nameStr : "Fuck her",
			tooltip : Text.Parse("A traditional favorite.", parse),
			enabled : cocksInVag.length > 0,
			func : function() {
				SexScenes.FuckHer(cocksInVag);
			}
		});
		options.push({nameStr : "Anal",
			tooltip : Text.Parse("You feel like the greatest analmancer today, and are going to prove it.", parse),
			enabled : cocksInAss.length > 0,
			func : function() {
				SexScenes.Anal(cocksInAss);
			}
		});
	}
	options.push({nameStr : "Pet",
		tooltip : Text.Parse("She must be sore after a long day at the forge… a “massage” might help.", parse),
		enabled : true,
		func : SexScenes.Pet
	});
	Gui.SetButtonsFromList(options, false, null);
}

SexScenes.Savor = function(opts) {
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
	
	SexScenes.IndoorPrompt(opts);
}

SexScenes.Tail = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
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
				SexScenes.Tailfuck();
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
				SexScenes.Tailpeg();
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
					SexScenes.Tailpeg();
				else
					SexScenes.Tailfuck();
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
		SexScenes.Tailpeg();
	}
}

SexScenes.Tailfuck = function() {
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
	SexScenes.Outro();
}

SexScenes.Tailpeg = function() {
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
	if(player.RaceCompare(Race.Canine) >= 0.4)
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
	SexScenes.Outro();
}

SexScenes.FuckHer = function(cocksInVag) {
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
			Text.Add(" - enough to cause her lower belly to bulge from the sheer volume you’re pumping into her. Unable to hold that much, the remainder just oozes and bubbles its way out of her and around your shaft, eventually finding its way onto the sheets and making a hot mess of everything", parse);
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
	
	SexScenes.Outro();
}

SexScenes.Pet = function() {
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
			Text.Add("A particularly energetic probe sends her squealing in a most un-tomboy-like fashion, and she instinctively raises her pert little butt high into the air, lifting her tail in the process. Now that’s an invitation if you ever saw one - it’s a very tight fit, but you manage to slip your entire fist into her feminine flower. Scalding love-juices squelch loudly as you effect your entrance, and you can <i>feel</i> Cassidy shiver and shudder as you begin massaging her on the inside with one hand and on the outside with the other.", parse);
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
			Text.Add("<i>“I am and I… I…”</i>", parse);
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
		Text.Add("As you move to continue, though, you feel something sinuous and scaly wrap itself about you, quickly snaking across your [skin]. You have barely enough time to wonder what Cass is about to do before it coils tight about your lower body, pulling you off-balance and sending you landing heavily on the mattress. Cass is huffing and puffing from your earlier ministrations, but it’s clear that her stamina is far from spent.", parse);
		Text.NL();
		Text.Add("<i>“Hey,”</i> she pants. <i>“Shouldn’t let you have all the fun, should I? It’s not fair to you.”</i>", parse);
		Text.NL();
		Text.Add("Why, you didn’t know she had such a great sense of justice.", parse);
		Text.NL();
		Text.Add("Cass aims a playful swipe at your head that you easily dodge. <i>“As they say, better to give than to receive, champ. Time to turn the tables!”</i>", parse);
		Text.NL();
		Text.Add("Another tug of her strong tail, and she has you on your back and is on you, pinning you to the mattress - or would be if she were heavy enough for it. Once she’s certain she’s got you subdued and prone on the sheets belly-up, she secures your shoulders with her hands and your [thigh] with her feet, then uncoils her appendage from around you. You just go along with the game, feigning helplessness at your predicament, then almost double-take as Cassidy gives you an evil grin and gets down to work.", parse);
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
			Text.Add("Taking her time to be slow and sensual, Cassidy wraps more and more of her burning tail about your [cock], gradually encasing the entirety of its length in coils of scaly cock-wrapper. ", parse);
			if(player.NumCocks() > 1)
				Text.Add("Once the first is fully enveloped, she moves onto the next, and so forth until all the tail length she can spare is wrapped up one way or the other. ", parse);
			Text.Add("Tightly bound up in your salacious serpentine lover, your [cocks] begin[notS] to ache terribly with growing pressure, bulging and straining against [itsTheir] constraints. On her part, Cass greedily wrings out your [cocks] with her tail, the end ", parse);
			if(player.NumCocks() > 1)
				Text.Add("darting from tip to exposed tip", parse);
			else
				Text.Add("continuing to toy with your [cockTip]", parse);
			Text.Add(" until you feel a terrible, mounting surge of warmth build up in [itsTheir] base. Sensing your imminent release, Cass tightens her grip along your shaft[s], grinning cheerily at you as she tries to deny you your much-needed release.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			if(cum >= 4) {
				Text.Add("Try as she might, though, the sheer amount of sperm you’ve got stored in you is simply too much to be contained. The constriction Cassidy’s tail is applying to your [cocks] only serves to ensure that your cum blasts forth in a pressurized jet, blasting against and painting her entire underside before raining down on you in a lewd drizzle. Cass just squeals and laughs as more and more jizz stains the sheets, lasting for a good while before her slick appendage manages to shut off the flow.", parse);
				Text.NL();
				Text.Add("<i>“Hah,”</i> she says, licking her lips clean of a few stray drops of sperm. <i>“Can’t deny that failure’s never quite been just as sweet.”</i>", parse);
				Text.NL();
				Text.Add("Exhausted, you barely manage to muster the strength to nod.", parse);
			}
			else {
				Text.Add("Your urge to shoot off you load is strong, practically overpowering, but Cassidy’s tail is stronger. Muscles squeeze and contract in your lower belly, desperate to force your seed out, but Cass keeps a tight grip on your [cocks], effectively denying you your orgasm with a cheery smile. The two of you hold it there for a good five or ten minutes, Cassidy’s constricting coils holding you teetering on the brink; unable to fall over or set foot on solid ground.", parse);
				Text.NL();
				Text.Add("You appear to have reached what some people call an impasse.", parse);
				Text.NL();
				Text.Add("<i>“I know I can’t hold on like this forever,”</i> she whispers down at you. <i>“But then again, neither can you. Want to make this a competition, champ?”</i>", parse);
				Text.NL();
				Text.Add("You don’t reply, just grit your teeth and strain. Once, twice - after the second, you feel Cass having to adjust her grip on your shaft[s] - and hey, the third try’s the charm. Summoning up all the aching, pent-up desire in your loins, you grunt and tense one last time, and fast and thick ropes of sperm blast from you, defying Cassidy’s tight grip to splurt out and onto yourself.", parse);
				Text.NL();
				Text.Add("Cass laughs. <i>“Thought I was determined, ace, but seems like you’re more determined than I am. Great show.”</i> Without warning, she releases her grip on your shaft[s], withdrawing her tail in a fast, whipping motion. While you might not have that much cum to spare, the sheer pent-up nature of your release and the exquisite wringing that Cass has given you conspire to send your seed out from your [cockTip] in a fountain of spunk, rising far higher than you’d imagined. Cassidy nimbly nips back and only catches a few drops on her skin and scales as she watches you paint yourself with your own arcing jism.", parse);
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
			Text.Add("With that, Cass lifts her hands off your shoulders and plants them firmly on your [breasts], feeling the firm softness give way under her leathery palms", parse);
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
			Text.Add("Just when you think you’re going to have a boobgasm, though, Cass pulls away, withdrawing her tail and lifting her hands free from your chest. You groan loudly, the departure of the salamander’s body heat all the too obvious as cold air - bitingly cold by comparison - rushes in to take its place. Dismayed at this sudden betrayal, you jerk your head up to find Cass smiling coyly down at you.", parse);
			Text.NL();
			Text.Add("<i>“Hey, shouldn’t work you too hard. The idea’s to work out the kinks in your body, not put more in there.”</i>", parse);
			Text.NL();
			Text.Add("But… but… stress and… you try to form words, but the heavy, wanton panting that comes out of your mouth is determined to rob you of all faculties of speech. It’s all you can do to indicate your tingling chest, each passing moment filling your [breasts] with unrequited need. If there’s a boob equivalent of being blue-balled, this has to be it.", parse);
			Text.NL();
			Text.Add("<i>“Gotta be strict about it. Self-discipline.”</i>", parse);
			Text.NL();
			Text.Add("Aww…", parse);
			if(player.SubDom() >= 50) {
				Text.Add(" part of you insists that you shouldn’t just take this lying down, but the greater part of you is too tired to go along with that idea.", parse);
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
		
		SexScenes.Outro();
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

SexScenes.Anal = function(cocksInAss) {
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
	Text.Add(", making you push and pound for each inch of man-meat you sink into her, a veritable battle to claim greater and greater lengths of her colon. Cass pants heavily and moans, finally letting out a little cry as you hilt your entire cock in her, her insides gripping you as tightly as one of the clamps in the storefront.", parse);
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
	Text.Add(" thoroughly flooding the salamander smith’s ass, filling her increasingly heated body until you’ve got nothing left in you. The two of you just lie there for a moment", parse);
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
	
	SexScenes.Outro();
}

SexScenes.Outro = function() {
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

/*
SPARRING SEX
*/

SparSexScenes.Win = function() {
	var enc  = this;
	enc.Cleanup();
	SetGameState(GameState.Event);
	
	party.LoadActiveParty();
	
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	
	cassidy.flags["SparL"]++;
	
	player.AddExp(10);
	
	Text.Add("With a final clash, you send Cassidy reeling. She staggers a bit, then crouches on the ground, using the handle of her hammer for support.", parse);
	Text.NL();
	Text.Add("<i>“Okay, okay! Uncle! Uncle!”</i>", parse);
	Text.NL();
	Text.Add("You put away your [weapon] and stride over to help Cassidy up. That wasn’t too bad, was it?", parse);
	Text.NL();
	Text.Add("<i>“Nah, I’m fine. It’s not as if we’re trying to kill each other or anything, yeah?”</i> Cass rubs her shoulders. <i>“Going to be a bit pooped tonight, but I’ll manage. Although… that was fun.”</i>", parse);
	Text.NL();
	Text.Add("You’re glad she enjoyed herself.", parse);
	Text.NL();
	Text.Add("<i>“Yeah. Sheesh. I know I should be upset or something, but I still feel great that I lost.”</i> Almost unconsciously, one of Cassidy’s hands reaches for her neckline and tugs at it; even in the dim light, you notice that her face and collarbone are dangerously flushed, and it’s not just from the exertion of battle.", parse);
	Text.NL();

	cassidy.relation.IncreaseStat(50, 3);

	if(cassidy.flags["Talk"] & Cassidy.Talk.SexIndoor) {
		Text.Add("Even if she doesn’t want to admit it, she really does get off on violence, doesn’t she? If she’s willing and you are too, what’s to stop you from taking things a little further? That is, of course, assuming that you’re willing… are you?", parse);
		Text.Flush();

		var options = [];
		options.push({nameStr : "Yes",
			tooltip : Text.Parse("Why not? Your blood’s still up from all that fighting.", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("Taking a moment to catch your breath, you lend Cassidy a hand - and as she takes it, haul her up such that you’re face-to-face and lock lips with the poor salamander. Her entire body - skin and scales all - is flush with exertion and desire alike, but her lips are the warmest of them all as she greedily returns the kiss, arms wrapping about you in a scaly, bone-crushing hug.", parse);
				Text.NL();
				Text.Add("Eventually, though, the two of you have to break for air, and you do so with a soft groan. By now, Cass seems <i>really</i> hot under the collar - you don’t think she’d mind if you just took her right here and now, although with both your blood heated and pounding, the result would probably be quite rough, if nothing else. Alternatively, if you’ve the self restraint, you could lead or carry her into a more private setting…", parse);
				Text.Flush();

				var options = [];
				//[Outside][Inside]
				options.push({nameStr : "Outside",
					tooltip : Text.Parse("Strike while the iron is hot! Take Cass here, right in the back yard.", parse),
					enabled : true,
					func : function() {
						Text.Clear();
						if(player.RaceCompare(Race.Salamander) < 0.3)
							Text.Add("You may not be a salamander, but you’ll be damned if your blood isn’t as heated as Cassidy’s is from all that fighting. ", parse);
						Text.Add("You can’t strip off your gear fast enough and throw it to the side even as Cassidy tosses her warhammer safely out of reach in the heat of the moment.", parse);
						Text.NL();
						Text.Add("<i>“Come on, [playername],”</i> Cass groans, swaying unsteadily before plopping onto the ground. <i>“Kick my ass a little harder, why don’t you?”</i>", parse);
						Text.NL();
						Text.Add("You chuckle, reach down and grab her belt buckle; she gets the hint and tugs at her shirt. The heat from her skin and scales rises in great gouts, dissipating into the cool night air, and her long tail wraps about your body as she pushes herself against you.", parse);
						Text.NL();
						Text.Add("To the victor go the spoils, don’t they?", parse);
						Text.NL();
						Text.Add("<i>“Hah. That depends on what you mean by spoils, ace.”</i> By the pale light of the moon, you notice Cass’ blush growing as you pull her into a tight embrace; the wetness beneath her shorts a reminder of how much she seems to get off on violence. With her turned on like this, it’s only natural that you treat her to a little rough loving…", parse);
						Text.NL();
						Text.Add("Either she’s read your mind or just gotten fed up and taken the initiative. As you look on, Cass drops her shorts, you help her with her panties, and then she practically leaps into your arms. Pressing her toasty, scaly body against you, Cassidy slobbers you with kisses as you return her embrace and try to decide just what you want to do with her tonight…", parse);
						Text.Flush();

						SparSexScenes.WinPrompt();
					}
				});
				options.push({nameStr : "Inside",
					tooltip : Text.Parse("You’d prefer a more private setting for what you’re about to get up to.", parse),
					enabled : true,
					func : function() {
						Text.Clear();
						Text.Add("Despite the heat radiating off her body, Cass isn’t sweating in the slightest at all, and grins maniacally as you lead her back into the building. She leans her warhammer against the wall, then whisks the both of you into her room, pulling at her shirt and unbuckling her belt even before you’ve reached the bed.", parse);
						Text.NL();
						Text.Add("<i>“Dunno why, but I always feel extra alive when I’m done playing with you, ace. It’s not like how I feel when I’m struck by inspiration, but it’s pretty darn strong, if strong in a different way… damn it, damn it, damn it.</i>", parse);
						Text.NL();
						Text.Add("<i>“Hey, why do you still have those on? Get them off! We’re getting started here!”</i>", parse);
						Text.NL();
						Text.Add("You waste no time in divesting yourself of your gear, then move to join Cass. Now, what are you up for this evening?", parse);
						Text.Flush();

						SexScenes.IndoorPrompt();
					}
				});
				Gui.SetButtonsFromList(options, false, null);
			}
		});

		options.push({nameStr : "No",
			tooltip : Text.Parse("Not tonight. Beating the stuffing out of each other has worn you out.", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("Taking a moment to catch your breath, you lend Cassidy a hand and haul the salamander up to her feet.", parse);
				Text.NL();
				Text.Add("<i>“Thanks again. That was awesome.”</i>", parse);
				Text.NL();
				Text.Add("Anytime. Or does she want to get back to it right now?", parse);
				Text.NL();
				Text.Add("<i>“Phew! Would love to, ace, but I’m pooped and it’s gotten quite late. Gotta open the store tomorrow, you know. I think I’m going to crash pretty soon.”</i>", parse);
				Text.NL();
				Text.Add("In other words, she’s going to try and sleep off the fire in her belly you’ve left her with. Okie-dokie. You’ll show yourself out, then.", parse);
				Text.NL();
				Text.Add("Cass gives you a hug, her scaly body all nice and toasty, then waves as you break away and head for the door. <i>“Be careful on your way back, okay?”</i>", parse);
				Text.Flush();

				Gui.NextPrompt(function() {
					world.StepToHour(22);
					MoveToLocation(world.loc.Rigard.ShopStreet.street);
				});
			}
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“Great bout, champ.”</i> She gives you one of her trademark grins. <i>“A bit of rough and tumble with you makes me feel so alive.”</i>", parse);
		Text.NL();
		Text.Add("You’re always happy to help however you can.", parse);
		Text.NL();
		Text.Add("<i>”Great! I’ve got to open the store tomorrow, though, so you’ve gotta go, no offense. It’s quite late out.”</i>", parse);
		Text.NL();
		Text.Add("No, no. You understand perfectly.", parse);
		Text.NL();
		Text.Add("<i>“Right.”</i> Setting aside her warhammer, Cassidy lunges forward and hugs you. <i>“Be careful on your way home, ace. Don’t be too long in coming back!”</i>", parse);
		Text.Flush();

		Gui.NextPrompt(function() {
			world.StepToHour(22);
			MoveToLocation(world.loc.Rigard.ShopStreet.street);
		});
	}
}

SparSexScenes.WinPrompt = function() {
	var parse = {
		
	};
	
	//[All fours][Get blown][Get licked][Spank]
	var options = [];
	if(player.FirstCock()) {
		options.push({nameStr : "All fours",
			tooltip : Text.Parse("Take Cassidy doggy-style in the back yard.", parse),
			enabled : true,
			func : SparSexScenes.AllFours
		});
		options.push({nameStr : "Get blown",
			tooltip : Text.Parse("Have Cassidy suck you off.", parse),
			enabled : true,
			func : SparSexScenes.GetBlown
		});
	}
	if(player.FirstVag()) {
		options.push({nameStr : "Get licked",
			tooltip : Text.Parse("Let her eat you out.", parse),
			enabled : true,
			func : SparSexScenes.GetLicked
		});
	}
	options.push({nameStr : "Spank",
		tooltip : Text.Parse("Since she gets off on violence, you might as well indulge her.", parse),
		enabled : true,
		func : SparSexScenes.Spank
	});
	Gui.SetButtonsFromList(options, false, null);
}

SparSexScenes.AllFours = function() {
	var p1cock = player.BiggestCock();
	
	var parse = {
		
	};
	parse = player.ParserTags(parse, "", p1cock);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var fem = cassidy.Feminized();
	
	Text.Clear();
	Text.Add("Trying not to grin too much - after all, Cass has more than enough good humor for the both of you - you instruct the salamander to get on all fours. Clearly enthusiastic at any proposition which has her getting closer to your groin, she obeys happily, though not without putting up a bit of token resistance.", parse);
	Text.NL();
	Text.Add("<i>“Can’t appear <b>too</b> eager, champ,”</i> she tells you, her voice slightly breathless and betraying her thoughts. <i>“Wouldn’t want to appear overly slutty.”</i>", parse);
	Text.NL();
	if(player.Slut() >= 50)
		Text.Add("Hey, there’s nothing wrong with being slutty. It’s a perfectly - aah, you can’t continue. Not with a straight face, at the very least.", parse);
	else
		Text.Add("Um, okay, sure. Whatever helps her sleep at night, right?", parse);
	Text.Add(" Cassidy just laughs and wiggles on the ground, her scaly elbows and kneecaps pushing aside soft grass as she makes herself comfortable. Her head turns and neck cranes to follow you as you pace around her like some kind of predator circling its fallen prey, looking over her shoulder at you as you reach down and grab her butt in your hands.", parse);
	Text.NL();
	if(fem) {
		Text.Add("With Cass having edged just a little closer towards the womanly side of the spectrum, her tush is much more gropeable than it used to be. Sure, it’s no grabbable bubble-butt, but it wouldn’t suit her, anyway; variety is the spice of life and all that.", parse);
		Text.NL();
		Text.Add("Nevertheless, the twin mounds of flesh are just shy of nicely filling your hands each, and the squeezing and groping makes for a pleasant accompaniment as you stroke yourself to hardness. The heat of Cassidy’s body feels very nice, to make an understatement, and you’re reminded of the fires that burn within the salamander.", parse);
	}
	else {
		Text.Add("Cassidy’s ass isn’t the full, ripe kind, but she’s no more sensitive, crying out lustily as she feels your fingers digging into her slight ass cheeks. Determined to work with what you have, you squeeze, grope and pump away greedily, one hand working her butt while the other steady strokes yourself to stiffness. ", parse);
		Text.NL();
		Text.Add("You didn’t think that such a poor performance would actually have much of an effect, but having Cassidy’s blood all hot and bothered from your recent sparring bout seems to have made all the difference. Even with her slight bum, the salamander keenly feels each tweak and brush on her ass, letting out soft sighs that occasionally break out into moans as you work your manhood[s] to full engorgement.", parse);
	}
	Text.NL();
	Text.Add("Eventually, you think you’re just about done, and give Cass a good slap on each ass cheek; she squeals happily and her tail wriggles in delight. Grinning evilly, you run your fingers up the length of Cassidy’s tail to its base, just above where it joins her spine. A gentle back-and-forth across its underside has her practically presenting herself to you, silently begging you to stick it into her hole already - any hole.", parse);
	Text.NL();
	Text.Add("Now, now. You aren’t going anywhere without an invitation. Isn’t she going to invite you in, first?", parse);
	Text.NL();
	Text.Add("She says nothing, but lifts her tail. That’s all the invitation you need. Steadying your grip on Cassidy’s hips, you take aim at your desired target…", parse);
	Text.Flush();
	
	//[Vag][Ass][DP]
	var options = [];
	options.push({nameStr : "Vag",
		tooltip : Text.Parse("Stick it to her the tried and true way.", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("…And ram yourself into her cunt, sending her reeling from the sheer force of your first blow in this battle. Sure, most people don’t open with their strongest shot first, but then the night is only so long - you don’t have the time to waste on frivolities like foreplay. The meat of the matter is what’s pressing at the moment, and your meat is what’s pressing at Cassidy’s hot and well-lubricated inner walls. The salamander’s arousal is well-conveyed through her sudden surge in body temperature, and her ", parse);
			if(fem)
				Text.Add("perky", parse);
			else
				Text.Add("small", parse);
			Text.Add(" breasts heave with increasing speed as a hot flush grows in her face and starts to creep into her collarbone.", parse);
			Text.NL();
			
			Sex.Vaginal(player, cassidy);
			cassidy.FuckVag(cassidy.FirstVag(), p1cock, 3);
			player.Fuck(p1cock, 3);
			
			Text.Add("<i>“Come on! Is… is that all you’ve got, champ?”</i> Cassidy pants.", parse);
			Text.NL();
			Text.Add("Oh no, you’ve barely gotten started. Lazily leaning your weight back, you pull yourself out of the salamander’s cunny, trickles of girl-cum and a soft squelch announcing your [cock]’s return into the cold night air. While your loins ache to be sunk deep once more into the waiting embrace of Cassidy’s insides, you hold back - although it takes every shred of your will to do so - and taking your man-meat in hand, guide your [cockTip] along her netherlips until you’ve peeled back her hood and are tickling her clit with its very tip.", parse);
			Text.NL();
			Text.Add("<i>“H-hey!”</i> Cassidy cries out, clearly taken aback by this sudden turn of events. <i>“What’s going on back there?”</i>", parse);
			Text.NL();
			Text.Add("Oh, nothing, just a bit of fun, you reply with a nasty grin on your face. <i>Now</i> you have the time for frivolities like foreplay - wonderful, wonderful frivolities at exactly the wrong time. Cass makes little bubbling sounds in the back of her throat, squirming in your grasp as you begin a thorough teasing regimen, igniting an urgent need in a number of embarrassing places the poor salamander girl doesn’t normally pay very much attention to. Squirming turns to outright struggling as Cassidy begs to be mounted and fucked already, but you continue to bump and grind against her, causing her arousal to grow increasingly intense.", parse);
			Text.NL();
			Text.Add("<i>“I’m n-not going to give up!”</i> she declares with a shaky voice, which is cut out momentarily by a soft hiss and moan. Her tail lashes this way and that, but she’s too out of it to actually maneuver it to find purchase on anything of use. <i>“So long ‘s I can speak, I can - I can -”</i>", parse);
			Text.NL();
			Text.Add("Without warning, Cassidy’s whole body trembles as her face takes on a pained expression and she grits her teeth. You can <i>feel</i> her loins flexing and pulsing, trying to work her netherlips to draw your oh-so-tantalizing piece of masculine meat into her where it belongs, desperate to taste once more the rough love of your opening blow. For her to resist what must have been an overwhelming urge to just give in - that must have taken some pretty solid determination to rise to the challenge.", parse);
			Text.NL();
			Text.Add("Hey, she’s determined, but you’re determined, too! Time to see who’s still standing when the dust settles!", parse);
			Text.NL();
			Text.Add("Carefully, you free up one hand and begin smacking the salamander’s pert little bottom, all the while keeping up your grinding and teasing of her. Cassidy jitters and trembles, still managing to hang on through sheer force of will but clearly beginning to crack. You don’t have much time yourself - you can already feel an ominous bubbling deep in your loins as the smell of heated sex fills the air - and decide to end this for once and for all.", parse);
			Text.NL();
			Text.Add("Drawing your arm back, you summon all your strength and swing down with a mighty smack that rings through the night air and sends tingles racing up your wrist. Cass practically plants her face against the soft grass; you swear you can see steam rising off her body. For a moment, you think that you might have to give her other ass cheek another smack, but her body finally betrays her.", parse);
			Text.NL();
			Text.Add("Denied the penetration it so desires, Cassidy’s honeypot decides to take matters into its own hands and gushes gout after gout of lightly steaming girl-cum onto your member. She arches her back, convulsing a few times as her body rides out the orgasm, then groans and sags in reluctant defeat.", parse);
			Text.NL();
			Text.Add("<i>“Uncle, u-uncle,”</i> Cass moans, desperately groping at her breasts with one hand in a feeble attempt to burn off some of her pent-up lust. <i>“You win, champ… this time…”</i>", parse);
			Text.NL();
			Text.Add("Hey, it was a pretty close bout, if you might say so. And now that the game’s over, it’s time for the fun to begin. Gleefully, you oblige the salamander’s deepest desires; Cass is more than willing to lie there and go along with you as you grab her by her thighs and hoist her legs about her waist. She instinctively wraps both legs and tail about you, and makes a weak little sound as you ram yourself into her once more with all of your remaining strength.", parse);
			Text.NL();
			Text.Add("It’s in this position that you gleefully ravage Cassidy’s tight cunt with every last bit of violent force you can muster, lewd and perverse squelching noises rising from your conspicuous copulation. Rough and violent - just what a salamander needs to get off, and unsurprisingly, Cassidy yelps as another orgasm racks her body, her vagina squeezing and pulsing about your member, desperate to feel your sperm in it.", parse);
			if(p1cock.Len() >= 23)
			   Text.Add(" Your [cockTip] rams again and again against her cervix, but it may as well be made of steel - despite your best attempts, it remains impervious to your best efforts at forcing it open. Oh well, you’ll just make do with what you have.", parse);
			Text.NL();
			Text.Add("<i>“Ah! AH! DAMN IT!”</i> Cassidy screams, the coils of her tail squeezing you tightly as your release becomes imminent, boiling and bubbling in your loins with the most queer sensation - probably one instigated by the salamander’s close presence. Her claws scrabble at the earth, throwing up clods of dirt; her hips buck against you as you release a vicious load of baby batter just as hot and sticky as her depths into her. With a loud woosh, Cassidy’s scaly tail erupts into life; although none of the flames actually hurt you, it’s still unnerving.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			parse["b"] = player.HasBalls() ? "r balls gradually empty of their load" : " finally run out";
			
			if(cum >= 3)
				Text.Add("Oozing and splattering all over, the excess spunk that simply won’t fit in Cass backflows out, staining the two of you as it runs down your [skin] and creates a mess on the ground below. ", parse);
			Text.Add("Joined in the throes of sexual bliss, the two of you grind against each other as each contraction of your throbbing prick sends another shot of seed into poor Cass and the contours of her burning pussy, seemingly lasting forever until the you[b]. Utterly spent and sated, you finally let go of Cassidy’s thighs, allowing her to collapse on the ground, and then you bend besides her to catch your breath.", parse);
			Text.NL();
			Text.Add("It’s a few minutes before either of you are able to speak.", parse);
			Text.NL();
			Text.Add("<i>“Well,”</i> Cass says after some time. <i>“That was an eye-opener.”</i>", parse);
			Text.NL();
			Text.Add("So, does she like this kind of sparring, or the other kind of sparring?", parse);
			Text.NL();
			Text.Add("<i>“Eh, it’s not really fair to ask that kind of question, force someone have to make that choice, ace. Can’t I just say that I want to do as much of both as I can? Maybe a bit of both at the same time? Besides, it’s always better if you’re fighting someone you know. Good to pull out a trick or two.”</i>", parse);
			Text.NL();
			Text.Add("Heh. You give the salamander a pat on the ass, then sigh and make yourself comfortable on the grass.", parse);
			PrintDefaultOptions();
		}
	});
	options.push({nameStr : "Ass",
		tooltip : Text.Parse("Plug her ass.", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("…And stuff yourself straight into the salamander’s ass, your [cockTip] brushing her sphincter for the briefest of moments before the tight ring’s rammed open and you bury yourself ", parse);
			if(p1cock.Len() >= 23)
				Text.Add("as far as you can go, until Cassidy’s poor, abused asshole simply can’t take any more of your man-meat", parse);
			else
				Text.Add("up to the hilt in Cassidy’s poor asshole", parse);
			Text.Add(". Reaching forward, you grab hold of Cass’ nipples, tweaking them a few times before you begin savaging them, seeking to grow her arousal with the rough handling of her milk makers.", parse);
			Text.NL();
			
			Sex.Anal(player, cassidy);
			cassidy.FuckAnal(cassidy.Butt(), p1cock, 3);
			player.Fuck(p1cock, 3);
			
			Text.Add("With how receptive Cassidy is to violent sex, it doesn’t take long for her to react to your brutal ministrations. Clamping down on your cock like a silken vise, Cass bites back a howl as you slowly begin dragging yourself out of her abused anus, her instincts trying to keep you inside her. No such luck, though; you’ve more strength than that, and successfully withdraw to the point where it’s just your head remaining inside -", parse);
			Text.NL();
			Text.Add("- And then slam back into her with all the force you can muster, bottoming out inside the poor salamander and forcing her wide open. Cassidy’s head snaps back, the salamander biting back another scream as you ram and pound your way back into her abused asshole. With her so thoroughly reamed, you can’t help but feel a touch of satisfaction at being responsible for her predicament.", parse);
			Text.NL();
			Text.Add("An errant thrust of yours has her anus convulsing and flexing about your [cock], dribbles of thick pre-cum escaping around your shaft. Unused to such intrusions in her back door, Cass quickly begins to give in to her pleasure; pleasure that comes hard and fast with each thrust of your man-meat as you jackhammer away with playful glee.", parse);
			Text.NL();
			Text.Add("There, there. It’ll be alright. It’ll be alright.", parse);
			Text.NL();
			Text.Add("No, it rapidly becomes apparent that things are <i>not</i> all right as Cassidy’s pleasure soon begins to overwhelm her, the salamander wriggling like a snake as she’s impaled on your glorious wood. For such an unremarkable ass, ", parse);
			if(fem)
				Text.Add("even after its improvement, ", parse);
			Text.Add("she’s doing remarkably well, to be honest. For a few moments, you just take a step back and relax, letting the exquisite sensations of her asshole having swallowed your cock run down your spine, a steady current of electricity joining the two of you in perverse bliss.", parse);
			Text.NL();
			Text.Add("That isn’t enough for Cassidy, though. Her tail’s been unused all this while, but no longer; desperate for more pleasure, the salamander’s whipped her prehensile appendage under herself and between her legs. The very tip winds its way up between her thighs, and before you know it, it’s dived straight into her box with a rather rude squelching sound, pumping up and down furiously as she seeks to stuff herself as full as possible even as you bounce her back and forth on your cock.", parse);
			Text.NL();
			Text.Add("Time to bring this to an end. Falling back to your initial plan of attack, you hilt yourself as far as you can into Cassidy’s warm bowels, then withdraw to the tip. In and out, in and out, the two of you move as one instinctively, working in tandem; again and again, you stretch her until the going isn’t that bad despite her tight pucker. Still furiously tailfucking herself like a woman possessed, Cassidy moans and mewls incoherently, juices flowing freely from her twat as she pounds herself on you.", parse);
			Text.NL();
			Text.Add("At last, your desire for release is far too great to be denied any further. Trembling from head to toe, you feel that familiar churning in your loins as a torrent of spunk shoots down your shaft and blasts out your [cockTip] straight into Cassidy’s asshole.", parse);
			if(player.NumCocks() > 1)
				Text.Add(" Not to be left out, your other dick[s2] blast[notS2] considerable portions of your load all over her pert, lovable ass, leaving it all warm and sticky.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			Text.Add("Having her burning insides filled with warm, gooey cream is just too much for poor Cass. Unable to keep up the strength required to continue tailfucking herself, the salamander’s cum-slick tail falls out of her cunt as she makes desperate little noises in the back of her throat, fighting not to scream out loud as the shock of orgasm ravages her body. Glob upon glob of spunk sinks deep into her, backing up and oozing out from about your shaft - both your minds are pretty much black with pleasure, the two of you reduced to rutting animals from the burning heat of your copulation.", parse);
			Text.NL();
			Text.Add("All good things must come to an end, though, and eventually the steamy haze of sex begins to clear a little, restoring a spark of clarity to your mind. Still stuffed inside Cass, you groan and wobble unsteadily, taking a few deep breaths to clear your thoughts before trying to extract yourself from her asshole. It takes a few tries and much tugging, but eventually you manage to pull yourself free of her tight little ass and collapse onto the grass to recover.", parse);
			PrintDefaultOptions();
		}
	});
	if(player.NumCocks() > 1) {
		options.push({nameStr : "DP",
			tooltip : Text.Parse("Why pick one when you can do both at the same time?", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("…And hesitate. With Cass presenting herself to you so gloriously, you have to admit that you’re spoilt for choice. You simply just can’t decide which hole to take her in… guess you’ll just have to do both at the same time, then. After all, it’s not as if you aren’t equipped for it", parse);
				if(player.NumCocks() > 2)
					Text.Add(" - heck, you’re <i>over</i>equipped for this endeavor, if you’re going to be honest", parse);
				Text.Add(".", parse);
				Text.NL();
				Text.Add("Cass looks over her shoulder at you, catches you furiously pumping both shafts", parse);
				if(player.NumCocks() > 2)
					Text.Add(" you’ve picked out", parse);
				parse["phisher"] = player.mfTrue("his", "her");
				Text.Add(", and her eyes go wide as she realizes what you intend. <i>“Huh, that’s more than I was expecting,”</i> she muses. <i>“Guess there’s nothing for it but for me to bend over and take it like a champ - it wouldn’t do for me to rob the victor of [phisher] hard-earned spoils.”</i>", parse);
				Text.NL();
				Text.Add("She needn’t worry, you reply as you feel your [cockTip] slowly start to ooze pre. Now that you’re pretty much as hard as you’ll ever get under your own power, you intend to claim your prize to the fullest. Easing yourself against Cassidy, you slide your shafts along the salamander’s scaly skin until the first’s lined up with her tailhole and the second nudging at her glistening netherlips. You take a few moments to grind back and forth, eliciting tiny shocked gasps from Cass as both orifices are teased simultaneously.", parse);
				Text.NL();
				Text.Add("Well, you don’t want to wear her out before the fun’s started. Summoning your strength, you grit your teeth and shove both lengths into Cassidy’s burning body. She gasps and trembles, her insides turning uncomfortably hot about your invading members for a second, then the licking flames quickly subside to a gentle warmth that envelops your manhoods. You can see Cass’ muscular ass flex and clench as she tries to adjust to the fullness within her - and utterly fails. The salamander grits her teeth and bites back a whorish cry of ecstasy, but a strained gurgling sound still escapes her throat involuntarily.", parse);
				Text.NL();
				Text.Add("Why, is she feeling a little strained?", parse);
				Text.NL();
				Text.Add("Cassidy just pants in reply, and you feel her insides rippling and undulating, steeling themselves in preparation for what they know is coming.", parse);
				Text.NL();
				
				Sex.Vaginal(player, cassidy);
				cassidy.FuckVag(cassidy.FirstVag(), p1cock, 2);
				player.Fuck(p1cock, 2);
				
				Sex.Anal(player, cassidy);
				cassidy.FuckAnal(cassidy.Butt(), p1cock, 2);
				player.Fuck(p1cock, 2);
				
				Text.Add("And you deliver it, forcing more of your length and girth straight into her tight little holes. The warmth about your manhoods flares into intense, burning heat, shooting up into the rest of your body and lighting you aflame with lust and desire. Bracing herself against the ground, Cass whips her tail to the side and rams herself backwards, impaling her ass on both your shafts, taking you as deep as possible. Coupled with her baser instincts, the sensation of being so utterly stuffed with man-meat sets her off - breathing in fits and starts, Cassidy just barely manages to avoid screaming her sheer, unadulterated bliss for the entire of the merchants’ district to hear.", parse);
				Text.NL();
				Text.Add("You give your hips a wiggle and thrust, and Cass flops limply on the ground. Why, is it that good, being stuffed in two holes? Maybe you should find a way of spit roasting her at the same time; that should <i>really</i> set her off…", parse);
				Text.NL();
				Text.Add("Cassidy doesn’t answer this time, either; the salamander’s head rolls back and her tongue lolls out from between her lips, her breasts heaving with each gasp she takes. Ooh, it looks like she can’t take very much more of this, can she?", parse);
				Text.NL();
				Text.Add("Time for you to do your part, then. With a sharp yank, you withdraw partially from both holes, then thrust again vigorously, forcing her apart. Poor Cass is practically overcome with pleasure by this point, her body running on automatic as you bounce her up and down on your manhoods, keeping a good grip on her hips and waist so that she doesn’t slip off.", parse);
				Text.NL();
				Text.Add("Time passes with the two of you madly fucking each other like a pair of bunnies, her milking your cocks in the steaming, sweltering depths of her ass and pussy alike. Desperate for something to grab onto, Cassidy’s tail lashes itself about your body; you hardly give a damn as you prepare to run the victory lap.", parse);
				Text.NL();
				Text.Add("And what a lap it is. Beating at the ground with scaly fists, the sheer sensation of being so gloriously full overcomes the last of Cassidy’s restraints, and the salamander screams her orgasm into the night air.", parse);
				Text.NL();
				Text.Add("That’s right, no need to bottle it up. Just let it out… let it all out - and that includes her girl-cum, too, blasting out from around the girth stuck in her pussy and dripping onto the grass. Both her inner walls and sphincter clamp down hard on your cocks, which in turn sets you off. You howl as you pump away with wanton abandon - no matter how much seed you might actually have, it still <i>feels</i> like a whole ton thanks to how tight she is and how your sperm is actually spurting out from around your shafts, mixing in with the nectar from her honeypot as the two of you ride out the aftermath of your heated, explosive lovemaking.", parse);
				Text.NL();
				
				var cum = player.OrgasmCum();
				
				Text.Add("<i>“Shit,”</i> Cass moans weakly. <i>“Hope the neighbors don’t complain tomorrow, heh, but damn, it was worth it.”</i>", parse);
				Text.NL();
				Text.Add("Yes, yes it was. You’re loathe to actually withdraw from Cassidy’s well-used insides, but you know you can’t stay like this forever. Your jism lubricating things makes matters quite a bit easier, and you manage to pull yourself free with a pop, landing on your ass in the grass.", parse);
				PrintDefaultOptions();
			}
		});
	}
	
	Gui.Callstack.push(function() {
		Text.NL();
		SparSexScenes.Outro();
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

SparSexScenes.GetBlown = function() {
	var p1cock = player.BiggestCock();
	
	var parse = {
		
	};
	parse = player.ParserTags(parse, "", p1cock);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var fem = cassidy.Feminized();
	
	Text.Clear();
	Text.Add("<i>“Heh,”</i> Cassidy says, dropping to her knees on the soft grass and resting her head against your hips. A noise not too unlike a low, gentle hiss sounds in the back of her throat as she rubs a cheek against you. <i>“Guessed you’d ask for that sooner or later.”</i>", parse);
	Text.NL();
	Text.Add("Without further ado, Cassidy flicks her forked tongue out of her mouth and begins licking your [cockTip], a heated ribbon enthusiastically lashing against your man-meat. Already half-hard, your [cocks] acknowledge[notS] that this is by far better than getting yourself stiff all by your lonesome, and you lean back to let her work her magic. Before long, she’s got you all hard and heavy.", parse);
	Text.NL();
	Text.Add("Satisfied, Cass eases up for a bit to take in her handiwork, a thin strand of saliva connecting your shaft to her tongue for a moment before it falls away. <i>“", parse);
	if(p1cock.Len() >= 23) {
		Text.Add("Gee, I don’t know about this, ace. That’s a pretty big one you’ve got there - I’ll do my best, but no promises. I’m not the most skilled when it comes to sucking cock. Not much chance to practice.”</i>", parse);
		Text.NL();
		Text.Add("You give the salamander’s head a gentle pat and praise her for her honesty. All she needs to do is to apply herself to this with the same energy that she does with everything else she does, and you’ll be satisfied.", parse);
		Text.NL();
		Text.Add("<i>“So, in other words, just be yourself.”</i> Cass gives you a lazy grin and strokes the underside of your shaft, sending exquisite tingles into your body. <i>“That’s the worst piece of advice I’ve ever received, you know, and you’re not the first one to give it. How about instead of being myself, I do…<b>this</b>?”</i>", parse);
	}
	else {
		Text.Add("Heh. Admittedly, I’m not the best at this, champ - sucking cock isn’t something you can go to a class for or ask just anyone to practice with - but I’ll do my best.”</i>", parse);
		Text.NL();
		Text.Add("That’s the spirit. Have you ever mentioned that you like women with spirit?", parse);
		Text.NL();
		Text.Add("Cass laughs. <i>“Ace, that’s the cheesiest thing that I’ve heard in some time now. But hey, coming from you, it couldn’t be anything else, could it? I’ll just let it slide, then - now, how about you get a load of <b>this</b>?”</i>", parse);
	}
	Text.NL();
	Text.Add("With that, Cassidy lunges forth and greedily shoves your [cock] into her mouth, her tongue wasting no time in wrapping itself - or at least, that’s what it <i>feels</i> like - about your member", parse);
	if(player.NumCocks() > 1)
		Text.Add(", your other shaft[s2] bumping against her chin before being pushed out of the way", parse);
	Text.Add(". Maybe it’s just that her blood is up, but her mouth definitely feels unnaturally warm and toasty, its movements perceptible as she sucks and blows alternately, pouring in her signature enthusiastic energy into the act. You’re tempted to just thrust and get her to deepthroat you already, but want to see just how far she’ll go before you have to give her some encouragement.", parse);
	Text.NL();
	
	Sex.Blowjob(cassidy, player);
	cassidy.FuckOral(cassidy.Mouth(), p1cock, 2);
	player.Fuck(p1cock, 2);
	
	Text.Add("Surprisingly, that’s quite far. Cass isn’t perfect, and she does have to come up for air every now and then, but the salamander manages to suppress her gag reflex and take you into her throat, those silken muscles pounding and squeezing at the foreign intrusion they sense. It’s not unlike sticking your dick in and out of a sauna - hot and cold and then hot again, the changing temperatures sending you squirming against your salamander lover.", parse);
	Text.NL();
	Text.Add("Seemingly as prehensile as her tail, Cassidy’s tongue continues its glorious work, and before too long you’re feeling the first tingles of mounting pressure in your groin as your impending release draws ever closer.", parse);
	Text.NL();
	Text.Add("Speaking of her tail, it hasn’t been idle, either. Since Cass needs her hands to steady herself against you, it’s up to the prehensile appendage to pick up the slack - it slithers over to her needy, untouched cunt and begins to gleefully tailfuck herself with practiced motions. Heh, guess she’s no stranger to <i>that</i>, then. With the speed at which she’s pleasuring herself, Cass can’t help but follow up in front, and soon you’re being treated to a veritable symphony of sensations.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	Text.Add("Subjected to such pleasure, you can contain yourself no longer despite your best efforts. A mighty tremble runs down the length of your body and leaves you feeling weak as you throw your head back and let loose mighty ", parse);
	if(cum > 6)
		Text.Add("blasts", parse);
	else if(cum > 3)
		Text.Add("ropes", parse);
	else
		Text.Add("spurts", parse);
	Text.Add(" of seed straight into her throat. Cass splutters a bit, a portion of it leaking out of her mouth and dribbling down her chin, but by and large enough gets into her stomach that you feel satisfied with her performance. Maybe she’ll improve with enough practice, and if not… well, there are other things that she’s more proficient at. The two of you just lean against each other for a bit to catch your breath and recover your strength. Eventually, Cass is the first one to speak.", parse);
	Text.NL();
	Text.Add("<i>“How was it?”</i> she whispers, wiping stray strands of cum off her lip and chin with the back of her hand.", parse);
	Text.NL();
	Text.Add("You’ll give her an A for effort and putting in everything she had. With some practice, she’ll definitely be a good cocksucker someday.", parse);
	Text.NL();
	Text.Add("That’s exactly what Cass wanted to her. Beaming, she leans in and gives you a slick, sloppy kiss on the [cockTip]. <i>“Thanks, champ. Means quite a bit to me.”</i>", parse);
	Text.NL();
	Text.Add("What, cocksucking?", parse);
	Text.NL();
	Text.Add("Cass bats at you lightly <i>“No, the praise. I’m serious here - that kind of stuff is more important when it’s coming from someone you give a damn about.”</i>", parse);
	Text.NL();
	Text.Add("Ah…", parse);
	Text.NL();
	SparSexScenes.Outro();
}

SparSexScenes.GetLicked = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var fem = cassidy.Feminized();
	
	Text.Clear();
	Text.Add("Placing a hand on Cassidy’s shoulder, you apply gentle pressure downwards. The salamander quickly realizes what you want of her, and gets down on her knees. ", parse);
	if(player.FirstCock()) {
		Text.Add("Her eyes dart to your [cock]", parse);
		if(player.HasBalls())
			Text.Add(" and [balls]", parse);
		parse["l"] = player.HasLegs() ? "spread your legs further" : "shuffle forward";
		Text.Add(", but you shake your head and [l] to let her get at your cunt. Cass rolls her eyes, smiles, and shrugs, as if to say “it’s all the same to me.”</i>", parse);
	}
	else {
		Text.Add("She instinctively hesitates a little when she sees your love box on display, but quickly recovers and gives you a shrug and smile.", parse);
	}
	Text.NL();
	Text.Add("<i>“So that’s the prize you want, champ?”</i> she says between exhausted panting.", parse);
	Text.NL();
	Text.Add("Yep, that’s it. As if to emphasize your point, you grab Cass by the shoulders, steadying yourself and pressing her lips to the petals of your womanhood in one deft movement. Cass lets out a slightly muffled, lusty moan, then it’s your turn to cry out when the full force of her burning lips spreads up your tunnel and outwards from there.", parse);
	Text.NL();
	Text.Add("<i>“Gee, I had no idea I was <b>that</b> good.”</i>", parse);
	Text.NL();
	Text.Add("This isn’t the time for her to get cocky, it’s the time for her to get licking. Try as you might, though, you can’t say that with a straight face, and Cass catches onto your mood easily. The salamander doesn’t go for the gold immediately, instead taking her time to shower your increasingly puffy labia with a series of hot kisses, watching with satisfaction as you grow wetter and wetter under her tender ministrations. Need blossoms hard and urgent as she extends the very tip of her forked tongue from her mouth and runs it across the same route a few times, eventually coming to a stop at the hooded nub of your love-button.", parse);
	Text.NL();
	
	Sex.Cunnilingus(cassidy, player);
	cassidy.Fuck(null, 2);
	player.Fuck(null, 2);
	
	parse["cl"] = player.FirstVag().clitCock ? "" : Text.Parse(" as she peels back the hood of your [clit] and starts toying with it with the forked tip of her tongue", parse);
	Text.Add("Cass pauses a few moments and withdraws both head and tongue to take in the glistening, drooling mess that your cunt has turned into, then pushes her face back into your muff and redoubles her efforts to please you. She doesn’t have much in the way of spit, but your girl-juices are more than enough for the both of you, and Cass gets a face full of such[cl]. Maybe it’s the heated blood from your recent bout, maybe it’s the sheer aggressiveness with which she’s eating you out, but you can’t help but arch your back and push your hips forward, bumping and grinding against Cassidy’s face, practically begging her to just get over with the foreplay already.", parse);
	Text.NL();
	parse["cl2"] = player.FirstVag().clitCock ? " mound" : Text.Parse(" [clit] just enough to get your feminine love-button all hard and hot", parse);
	Text.Add("Cass, on her part, is slow and measured, her nimble tongue teasing and twisting about your[cl2]. Each pass of her tongue’s rough surface is a medley of wonder and ecstasy; you have to wonder how she’s doing this without having had much in the way of practice - either Cassidy’s inherited some skills from her reputed slut of a great-grandmother, or she’s just a born natural.", parse);
	Text.NL();
	Text.Add("Either way, seems like she’s finished with the appetizer and is ready to eat your pie in earnest. More of Cass’ long tongue darts forward as she presses her lips to yours once again, testing the petals of your womanly flower before diving inside to quest for the nectar within. You squeeze your eyes shut, your entire body stiffening as you let out a yowl that rings out in the merchants’ district - your body just can’t help but be overwhelmed by the heated lance of pleasure that thrusts into you, squirming, probing, flexing.", parse);
	Text.NL();
	Text.Add("Cass isn’t just eating you out, she’s literally tonguefucking you, and your body responds appropriately. Your silken inner walls clamp down in an attempt to capture this wonderful thing that’s worming in and out between them, but Cassidy’s tongue is just too nimble - and too well lubricated by your own juices - to be caught by such a clumsy maneuver. In and out, in and out - driven to the wildest of extremes, you greedily hump away at Cassidy’s face, working in tandem with the salamander to drive you to greater heights of pleasure.", parse);
	Text.NL();
	Text.Add("Unsurprisingly, the spirit is willing but the flesh is weak; you can’t take very much of this before your body gives way to the furious, pounding urges directed at it and writhes in orgasm at Cassidy’s energetic licking. Throwing your head back, you grit your teeth and jackhammer your cunt into the salamander’s face over and over again, loud squelching noises rising from your messy finish even as strands of feminine nectar ooze down to the ground, joining the two of you.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	if(player.FirstCock()) {
		Text.Add("Not to be left out, your [cocks] pour[notS] out [itsTheir] unrequited love in the form of ", parse);
		if(cum > 6) {
			Text.Add("enormous blasts of sperm that gush onto Cassidy’s shoulders. Hot, thick and gooey, the jizm flows down her body, cascading like a waterfall between both her breasts and shoulder blades. It sort of reminds you of vanilla syrup being poured onto ice cream, come to think of it… only a lot more tasty and alluring.", parse);
			Text.NL();
			Text.Add("Cassidy lets out a muffled, gurgled moan, and cups her leathery palms to collect your sperm as it flows thickly down her body. Once she thinks she’s got enough, the salamander smith begins rubbing it all over her front like some kind of body lotion, her hands moving in large, languid circles as she tries to angle herself so that you’ve got the best view of things.", parse);
		}
		else {
			Text.Add("ropes upon ropes of seed that coat Cassidy’s shoulders, clinging to her skin and scales like… like something that’s hot and gooey. Her mouth still occupied with your muff, Cass lets out a muffled gasp and wiggles in place, her tail curling about her feet.", parse);
		}
		Text.NL();
	}
	Text.Add("Eventually, though, the high dies down, and Cass pulls away from your loins. The two of you just remain as you are for a bit, gasping and trying to catch your breath as the cool night air slowly douses the dregs of your passions.", parse);
	Text.NL();
	Text.Add("<i>“Had fun, champ?”</i>", parse);
	Text.NL();
	Text.Add("Yeah, you sure did. Still, the whole thing was rather one-sided. Is she sure she’s okay with this?", parse);
	Text.NL();
	Text.Add("<i>“Hey, champ. If you had fun, then I had fun. No need to argue about it anymore unless you want me getting upset you’re not taking me at my word, and you don’t want that happening.”</i> She gives you a sweet, wolfish smile. <i>“Let’s just drop all our fucks and savor the moment before it passes, okay?”</i>", parse);
	Text.NL();
	Text.Add("Now that’s an idea you can get behind. The two of you spend a little more time just cuddling, basking in the warm afterglow of what you’ve just done.", parse);
	Text.NL();
	SparSexScenes.Outro();
}

SparSexScenes.Spank = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var fem = cassidy.Feminized();
	
	Text.Clear();
	Text.Add("Right. Since the poor sally-mander gets off on violence, you might as well give her a treat. A bit one-sided, perhaps, but there’s more to this than getting off yourself. A small woodpile in the corner of the yard beckons - Cass must use it for feeding fireplace and stove alike - and you have to practically drag her over to it before finding a seat and bending her over your knee in the traditional fashion. Cass complies happily, her tail swaying from side to side as she assumes the proper position for such… ah… matters.", parse);
	Text.NL();
	Text.Add("No time like the present to get started, then. You might be a little tired from the bout you just had with her, but a sudden surge of strength rises in your arm as you raise it and bring down your palm onto Cassidy’s bottom. ", parse);
	if(fem) {
		Text.Add("As you hear the first resounding smack and feel flesh under your fingers, you have to admit that whatever else that may have resulted, this proves that convincing Cass to be just a bit more girly was definitely worth it. There’s enough flesh on her bum to support a good, satisfying spanking, yet there’s not <i>too</i> much, so it remains firm under your attentions.", parse);
		Text.NL();
		Text.Add("Judging by the way Cass is smiling dreamily, you guess she agrees.", parse);
	}
	else {
		Text.Add("Her tush is pert and firm under your hand, bouncing right back with barely a ripple on her skin. Cass practically squeals as your palm connects, and then her features collapse into a happy, dreamy smile. You get the feeling that a spanking session might end up with you hurting more than she does, but hey. It’s worth it, isn’t it?", parse);
		Text.NL();
		Text.Add("Yep, satisfaction all around.", parse);
	}
	Text.Add(" Rough and tumble might be the best, but she’s clearly more than happy to get off to any kind of violence, even of the corrective sort. Now then, who’s been a naughty, naughty sally-mander?", parse);
	Text.NL();
	Text.Add("Cassidy wiggles. <i>“Me?”</i>", parse);
	Text.NL();
	Text.Add("Well, obviously, since you’re punishing her right now. But does she know why?", parse);
	Text.NL();
	Text.Add("She just grins and feigns ignorance. <i>“Oh no, I don’t! I’m just so silly. A silly-mander.”</i>", parse);
	Text.NL();
	Text.Add("Oh dear. If she doesn’t know her mistake, how can she correct it? You’ll have to punish her more severely so that she doesn’t forget it. Cass squeals out loud as you land a flurry of smacks on her pert little bottom. You end with a good smack that leaves your hand tingling from the impact, and she lets out a lewd moan that rings out into the night air.", parse);
	Text.NL();
	Text.Add("So, did she think she could actually beat you?", parse);
	Text.NL();
	Text.Add("She gives you a silly grin. <i>“Maybe?”</i>", parse);
	Text.NL();
	Text.Add("Wrong, silly. The answer is no! For that, you’ll have to spank her some more! Bent over like that, you can’t deny that she’s in a very compromising position… which makes the smacking all the more agreeable. Her face a lovely shade of red and heat roiling off her body like nobody’s business, Cassidy lets out a perverse moan each time you land another hit on her ass. While the light may be a little too dim to tell exactly if you’ve been leaving handprints, it definitely <i>feels</i> like it.", parse);
	Text.NL();
	Text.Add("<i>“Oi! Get a room, the both of you!”</i> someone shouts from across the merchants’ quarter. You ignore whoever it is and keep on smacking; Cass just pants and snickers, then does her best to clumsily grope at her tits, adding a little more pleasure to the mix. While it isn’t quite enough to get her to climax on its own, the violence, mixed with the pain and pleasure alike - it’s been a while now, but it’s now that you notice that the salamander’s womanly flower is dripping wet, petals glistening in the moonlight as a trickle of nectar runs down one of her thighs.", parse);
	Text.NL();
	Text.Add("Well, time to wrap things up, then; there’s little doubt that Cass will be sleeping on her stomach tonight, and to be honest, your hand is starting to hurt. You stop the spanking for a moment to give Cassidy’s bum an affectionate rub, which sends her into a wriggling fit.", parse);
	Text.NL();
	Text.Add("So, has she learned her lesson?", parse);
	Text.NL();
	Text.Add("Cassidy laughs weakly. <i>“Nope. Guess you’ll just have to spank me again some other time, ace. Determined to learn nothing at all.”</i>", parse);
	Text.NL();
	Text.Add("You mock-sigh and roll the thoroughly spanked salamander off you; she flops on the ground like a fish, her tail limp and doused. Shakily, Cass gets to her feet, totters for a few unsteady steps, then gives you a small salute. <i>“Looking forward to the next time, champ. Don’t disappoint me.”</i>", parse);
	Text.NL();
	Text.Add("Does that mean the next time you spar with her, or the next time you spank her?", parse);
	Text.NL();
	Text.Add("A laugh. <i>“Why not both?”</i>", parse);
	Text.NL();
	
	player.AddSexExp(2);
	
	SparSexScenes.Outro();
}

SparSexScenes.Outro = function() {
	var parse = {
		
	};
	
	Text.Add("After a while, though, you have to admit that it’s getting quite late. Cass still has to finish up a few things before turning in, and there’s always the matter of opening the shop tomorrow. A salamander’s work is never done, or so it seems.", parse);
	Text.NL();
	Text.Add("<i>“Don’t worry about it, champ,”</i> Cassidy tells you as she helps you put on your gear once more. She herself doesn’t bother getting dressed, instead balling: <i>“There’s always tomorrow. And tomorrow. And… well, you get my drift.”</i>", parse);
	Text.NL();
	Text.Add("Yeah, there’s always tomorrow.", parse);
	Text.NL();
	Text.Add("<i>“Hey, it was fun,”</i> she replies as the two of you head back in. <i>“Don’t be too long in coming back!”</i>", parse);
	Text.NL();
	Text.Add("Oh, you won’t.", parse);
	
	cassidy.relation.IncreaseStat(100, 2);
	party.location = world.loc.Rigard.ShopStreet.street;
	
	world.StepToHour(22);
	
	Text.Flush();
	
	Gui.NextPrompt();
}

SparSexScenes.Loss = function() {
	var enc  = this;
	enc.Cleanup();
	SetGameState(GameState.Event);
	
	party.LoadActiveParty();
	
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	var fem = cassidy.Feminized();
	
	Text.Clear();
	
	player.AddExp(3);
	
	Text.Add("Oof. You try to stand, but you’re pretty much hammered in every sense of the word.", parse);
	Text.NL();
	Text.Add("<i>“What are you doing? Get up! Get up!”</i>", parse);
	Text.NL();

	cassidy.relation.IncreaseStat(50, 1);

	if((cassidy.flags["Talk"] & Cassidy.Talk.SexIndoor) && (Math.random() < 0.5)) {
		Text.Add("Ouch. You’re doing your best, but evidently your best isn’t enough for your body to obey you. The most you manage is a soft groan, accompanied by a vague flop like a rather pathetic fish out of water.", parse);
		Text.NL();
		Text.Add("<i>“Oh. So it’s over.”</i> There’s a distinct tinge of disappointment in Cassidy’s voice as she looks you over, her feet crunching on the grass as she steps closer. <i>“Now you’ve gotten me all worked up and with no way to blow off all this steam and smoke; what’s a poor girl like me to do?”</i>", parse);
		Text.NL();
		Text.Add("By now, the salamander’s kneeling beside you, heat wafting off her body in waves. She’s panting softly, her face flushed in the dim moonlight, and mumbles something to herself as she eyes you with… well, the look she’s giving you isn’t exactly one of pure sexual desire, but there’s definitely some of that mixed in there.", parse);
		if(fem)
			Text.Add(" That’s not counting the fact that Cass’ small breasts look a little bigger now, straining at her tight shirt with their nipples lightly outlined against the fabric -", parse);
		Text.NL();
		Text.Add("Oh. Uh. You might not feel up to the task at the moment, considering the pounding that she just gave you. Um, you have a headache?", parse);
		Text.NL();
		Text.Add("<i>“That’s not going to save you, champ.”</i> With a single fluid movement, Cass pounces on you and pins you to the ground, her scaly hands and clawed fingers digging just a little too enthusiastically into your shoulders. <i>“I won fair and square… and to the victor go the spoils. Not as if you need to do anything - I’ll lead, and all you have to do is go along with the flow.”</i>", parse);
		Text.NL();
		Text.Add("Groaning softly, Cassidy paws at the neckline of her shirt, quickly unbuttoning her collar, then easily wriggles her way out of the garment and tosses it over her shoulder without a care in the world. It’s plain to see that the blush on her face has crept beyond her collarbone, causing the salamander’s ", parse);
		if(fem) {
			Text.Add("perky breasts to swell with unsated sexual desire, to the point that they’re almost C-cups. Without realizing what she’s doing, Cass has started to fan her cleavage, sending yet more waves of heat washing down onto your body as she straddles your chest.", parse);
			Text.NL();
			Text.Add("Her nipples, too, are not to be left out: stiff and swollen with arousal, they jut outwards from the peaks of Cassidy’s lady lumps, little nubs of pleasure begging to be tickled and teased.", parse);
		}
		else {
			Text.Add("small, pointed breasts have swollen with her increasingly urgent need, almost completely flush with desire as she straddles your chest, pushing her weight down on you.", parse);
			Text.NL();
			Text.Add("Once she’s fairly secure, she lets go of your shoulders momentarily to cup her small breasts and fondle them, dragging her leathery palms across the stiff and swollen nipples - sure, her lady lumps haven’t gotten that much bigger, but when you’re as tiny as Cass is, it doesn’t take much to double her size. If you squint just hard enough, maybe they could qualify as low Bs…", parse);
		}
		Text.NL();
		Text.Add("Your train of thought, though, is interrupted by her squeezing her claws into your shoulders even as her breathing grows more rapid, each exhalation scorching air straight from a bonfire. With a faint whoomp, the entire length of Cassidy’s tail bursts into flames, although thankfully it still doesn’t actually set anything alight.", parse);
		Text.NL();
		Text.Add("<i>“Fuck.”</i> Still straddling you, Cass fumbles with her belt and pulls it off, then rises ever so slightly to get rid of her shorts and panties, her movements growing ever so more erratic and desperate. <i>“C’mon, champ. You can’t just collapse in the heat of the moment and leave a girl hanging like that, all empty and unfulfilled. I know you’re capable of more than that.”</i>", parse);
		Text.NL();
		var armor = "";
		if(player.Armor() || !player.LowerArmor()) armor += "[armor]";
		if(player.Armor() && player.LowerArmor()) armor += " and ";
		if(player.LowerArmor()) armor += "[botarmor]";
		parse["arm"] = Text.Parse(armor, parse);
		Text.Add("Without waiting for your answer, the salamander lets out a little hiss of frustration and savagely tears at your [arm] until you’re naked as she is, tossing the lot over her shoulder to join her clothes. It’s only then that she allows herself a little respite, looking down at you piteously as if <i>she</i> were the one who’d just gotten the stuffing beaten out of her.", parse);
		Text.NL();
		Text.Add("She really, <i>really</i> gets off on violence - more than she herself knows or will admit, doesn’t she?", parse);
		Text.NL();
		Text.Add("<i>“You can’t -”</i> Cass takes a deep breath to steady herself, then gasps as a small spurt of girl-cum oozes out of her honeypot, staining your chest. <i>“You can’t just… stop playing. You’ve got to… finish up. If I can’t fight, I’ll just have to fuck.”</i>", parse);
		Text.NL();
		Text.Add("Seems like she’s reached her breaking point. With a final lusty pant and gasp, Cassidy springs into action - and since it’s your fault for unchaining the monster and not being able to sate it, it falls to you to pay the price.", parse);
		Text.Flush();

		Gui.NextPrompt(function() {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				SparSexScenes.DomRide();
			}, 1.0, function() { return player.FirstCock(); });
			scenes.AddEnc(function() {
				SparSexScenes.SuckOnBreasts();
			}, 1.0, function() { return cassidy.Feminized(); });
			scenes.AddEnc(function() {
				SparSexScenes.Tribbing();
			}, 1.0, function() { return player.FirstVag(); });
			scenes.Get();
		});
	}
	else {
		Text.Add("Oh, you would, but your body doesn’t seem to be very cooperative. Cassidy sighs, then lends you a hand in getting upright - shakily, but at least you make it.", parse);
		Text.NL();
		Text.Add("<i>“Don’t worry, ace. There’s no shame in losing, but I’ll expect a better fight next time.”</i>", parse);
		Text.NL();
		Text.Add("Already looking forward to the next time, eh?", parse);
		Text.NL();
		Text.Add("<i>“Yup. Not tonight, though, it’s gotten pretty late now.”</i>", parse);
		Text.NL();
		Text.Add("You’ll show yourself out, then.", parse);
		Text.NL();
		Text.Add("<i>“You sure? Kinda look like you’re about to keel over any moment yourself.”</i>", parse);
		Text.NL();
		Text.Add("Yeah, you’re sure. You just needed a moment or two to catch your breath after that bout.", parse);
		Text.NL();
		Text.Add("<i>“Okay, if you say so.”</i> Cassidy gives you a cheery little wave. <i>“Don’t be long in coming back now, you hear?”</i>", parse);
		Text.Flush();

		party.location = world.loc.Rigard.ShopStreet.street;

		Gui.NextPrompt();
	}
}

SparSexScenes.DomRide = function() {
	var p1cock = player.BiggestCock();
	
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	Text.Clear();
	Text.Add("As if drawn by some primal, animal magnetism, Cassidy’s golden eyes wander over to your [cocks]. Wordlessly, she licks her lips, her stare growing more and more intent as moments tick by. Without warning, one of her hands darts out and seizes ", parse);
	if(player.NumCocks() > 1)
		Text.Add("the biggest of your shafts", parse);
	else
		Text.Add("your shaft", parse);
	Text.Add(", squeezing it so tightly that you whimper at the sudden pain and pressure of her grasp on your man-meat. Her grip is so strong that you can feel the throb of your heartbeat against her palm as your cock twitches and tingles with anticipation - or maybe it’s just her piercing, ravenous gaze straight on your [cockTip].", parse);
	Text.NL();
	Text.Add("Hey hey hey hey hey. Maybe any sudden movements on either of your parts wouldn’t be the best idea -", parse);
	Text.NL();
	Text.Add("Bearing all the innocent, gleeful delight of a young child faced with a new toy, Cassidy begins to beat you off with enthusiasm and vigor, the salamander’s entire body moving up and down in time with her strokes even as she retains her death grip on your cock. Your hips are practically jerked up and down by the sheer strength of her lean, wiry arms, and your erection bulges painfully against its constraints, desperately seeking more space to unfurl to full mast. It’s not long before the first beads of pre appear on your [cockTip]; Cass merrily gathers it in her palm and smears it all over your growing [cock].", parse);
	if(p1cock.Len() >= 23) {
		Text.NL();
		Text.Add("<i>“Shit,”</i> Cassidy half-says, half-moans. Her eyes don’t leave your man-meat as it continues to grow and swell to its full length, and she whistles appreciatively. <i>“That’s a glorious tool you’ve got here, champ. Mind if I use it for a bit?”</i>", parse);
	}
	Text.NL();
	Text.Add("As she continues to lavish attention on your member, Cass reaches down with her free hand and slips her fingers into her cunt. She doesn’t bother with any teasing or tracing, but instantly starts pumping in and out of her snatch, spreading wide the petals of her womanly flower as her feminine honey begins to flow freely.", parse);
	Text.NL();
	Text.Add("At last, though, she seems to be satisfied - grasping the base of your shaft with thumb and forefinger, Cass pulls upwards along its slick, glistening length, over bumps and contours until they meet again past your pre-oozing glans. The salamander closes her eyes, her slight bosom heaving in a sigh of satisfaction, and then she gets to her feet. You’re half-wondering if it’s over already, if she only meant to give you a half-hearted handjob - and then all of a sudden, Cass just drops to her knees, impaling herself on your prick. You barely have time to react as your gleaming [cock] is gulped straight down by Cassidy’s equally lubricated cunt, hot, steamy curtains of flesh racing to envelop your shaft in a warm little heaven of its own.", parse);
	Text.NL();
	
	Sex.Vaginal(player, cassidy);
	cassidy.FuckVag(cassidy.FirstVag(), p1cock, 2);
	player.Fuck(p1cock, 2);
	
	Text.Add("You groan at the sudden stimulation, head lolling and eyes rolling back as Cassidy begins to ride you like some kind of animal, her heated cunt clamped tight about your rod. Her hips buck and pump against yours as she gleefully begins to burn off all her unspent aggression and lusts on you, dragging you along for the ride. You’re not <i>completely</i> helpless: reaching up, you manage to take hold of Cass’ waist to steady her - or is it yourself? - but it’s a little hard to concentrate when every jolt, every bump of sword against sheath sends streams of electric tingles running down your spine.", parse);
	Text.NL();
	Text.Add("<i>“That’s it,”</i> Cass hisses, her eyes alight with predatory glee. <i>“Don’t you dare go soft in me now, champ! You can’t just stop these things halfway and say you don’t want to play anymore! You’ve got to see them to the end - no short stops when it comes to me!”</i>", parse);
	Text.NL();
	Text.Add("But… but you never said anything on those lines… oh, what’s the use? She probably can’t hear any protest you might care to make, anyway.", parse);
	if(p1cock.Len() >= 23) {
		Text.NL();
		Text.Add("With how long your cock is, you can feel it ram again and again against Cassidy’s cervix, but it remains stubbornly shut and unyielding despite the amount of force applied to it. The fact that it’s not opening for you, though, doesn’t mean that neither of your feel it - quite the opposite, in fact. A few minutes of this is more than enough to send Cass to making pleasant, hissing noises atop you, but try as you might, you just can’t quite bottom out in her.", parse);
		Text.NL();
		Text.Add("<i>“Nah, there’s no chance of you accidentally knocking me up, ace, so don’t you worry about it,”</i> Cass tells you with a wolfish grin. <i>“It’s got to do with how we sally-manders work. Just concentrate on the fight, okay?”</i>", parse);
	}
	Text.NL();
	if(player.FirstVag()) {
		Text.Add("Unfortunately - or perhaps fortunately - for you, Cassidy still has a long way to go before she burns herself out, and it looks like she’s decided to turn up the heat. All of a sudden, a second source of pleasure bursts onto the scene to join your man-meat in pulsing, pure bliss. It takes a while for you to be able to straighten out your thoughts, but you eventually realize that the tip of Cass’ tail has found its way to your pretty [vag], and is wetting itself with your juices.", parse);
		Text.NL();
		Text.Add("Well, you suppose you can live with that. What’s the point of having both sets of equipment if you don’t use them both, after all?", parse);
		Text.NL();
		Text.Add("Finally having its unrequited desires satiated, your cunt is more than eager to receive the newcomer’s attentions, and fire flashes in your loins as that delightfully hard tail-tip worms its way across and coaxes your [clit] from under its hood. It’s all you can do not to turn into a moaning, screaming pile of jelly as your love-button is flicked, pushed and ground against in an orgiastic medley of pure bliss.", parse);
		Text.NL();
		Text.Add("Having paid its entry fee, the long, flexible length of Cassidy’s tail dips into you. Deeper and deeper, further and further into your love-tunnel it travels as it explores the depths you have to offer; you involuntarily make several pitiful noises as your cunt attempts to match the caresses currently being lavished upon your shaft, what with it being buried in Cass’ burning nethers. Wriggling and squirming in a fashion that few actual cocks can, the prehensile bitch-breaker feels practically alive in you, and you haven’t the strength to do anything but just lie there and take it with the occasional blissful moan. Wider and wider your snatch gapes as the girth ", parse);
		if(!player.HasLegs())
			Text.Add("penetrating your lower body", parse);
		else
			Text.Add("between your thighs", parse);
		Text.Add(" grows, whether you like it or not.", parse);
		Text.NL();
		
		var hipsize = player.HipSize();
		
		if(hipsize >= HipSize.VeryWide) {
			Text.Add("Eventually, though, Cass has to stop - your cunt has stretched to the point where your [hips] have swallowed as much tail as the salamander has to offer, having buried almost everything up to the base inside you. Cass looks over her shoulder at the impressive sight and sighs, releasing a blast of hot air over your [skin].", parse);
			Text.NL();
			Text.Add("<i>“Damn, champ. Just how much space <i>do</i> you have in there?”</i>", parse);
			Text.NL();
			Text.Add("Naturally, you’re unable to answer, what with being fucked straight out of your brains. The <i>thing</i> inside you wriggles a bit, and you <i>feel</i> a small bump form on your belly, sending another cascade of divine sensation racing through your body.", parse);
		}
		else if(hipsize >= HipSize.Wide) {
			Text.Add("Your hefty hips manage to take in much of Cass’ tail, but eventually even she has to give up as your cunt simply won’t gape any wider and physical constraints stop you from being penetrated any further. When it’s all over, you’ve taken in about two-thirds of Cassidy’s snaking appendage into yourself; with your pussy stretched wide as if about to give birth, your inner walls feel confused as to whether the thing inside you should be drawn in and milked, or pushed outwards.", parse);
			Text.NL();
			Text.Add("On her part, Cass gives you little say in the matter. Satisfied that her tail’s bottomed out in you, the salamander begins to wiggle it about, causing small bumps to rise up on your abdomen. You bite back a cry, squeezing your eyes shut; Cass just sniggers and increases her efforts.", parse);
		}
		else {
			Text.Add("Try as you might, you can’t take as much of Cassidy’s tail into you as you’d hoped. The salamander’s thick meat has stretched you to gaping, as if you were pushing something down your cunt instead of the other way around, and yet no more of her girth will fit in you.", parse);
			Text.NL();
			Text.Add("Cass looks a bit disappointed, but does her best to make the most out of a bad situation. At least enough of her tail has slipped into you that the salamander is able to nudge your cervix apart with its tip and penetrate your womb. Not very far, but enough to give you the feel of being well and truly stuffed.", parse);
		}
		Text.NL();
		Text.Add("Pumped and milked like this, you’re not sure how much longer you can hold in your seed - it can’t be long now. Cass sure looks like she’s having a blast, riding and tailfucking all in one smooth, powerful motion, rocking back and forth like a jockey.", parse);
		Text.NL();
		
		Sex.Vaginal(cassidy, player);
		player.FuckVag(player.FirstVag(), null, 1);
		cassidy.Fuck(null, 1);
	}
	
	Text.Add("That’s it! You can’t take any more! ", parse);
	if(player.HasBalls())
		Text.Add("Your balls, heavy and swollen with seed, churn with their imminent release; you can practically feel the sperm welling up in your loins, gathering strength and power for the eventual, inevitable blast-off.", parse);
	else
		Text.Add("You squirm under Cass as more and more jizz begins to pool in your loins, the wondrous sensation gathering at the base of your man-meat, ready to blast off into the world.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	parse["cum"] = cum >= 3 ? ", filling her up in no time and causing her to overflow from the sides of her snatch" : "";
	Text.Add("As Cassidy’s pussy walls grip and squeeze you one last time, rippling in their effort to milk you for every last drop of seed you’re worth, you throw your head back and roar out your orgasm for the whole of Rigard’s merchant district to hear. Hot, liquid fire shoots up your [cock] and blasts out into Cass’ cunt[cum].", parse);
	Text.NL();
	
	if(player.NumCocks() > 1) {
		Text.Add("Your remaining shaft[s2] explode[notS2] as well in a symphony of mindless pleasure, thoroughly painting your salamander lover’s butt and thighs with a layer of thick, sticky seed. It drips and oozes all over the place, running off her skin and scales in sloppy white rivulets.", parse);
		Text.NL();
	}
	
	
	Text.Add("<i>“That’s more like it, ace! Show me your fighting spirit!”</i>", parse);
	Text.NL();
	Text.Add("Well, if your fighting spirit’s supposed to be thick, sticky, and coming out of you in strings, then yeah, you’ve shown it to her plenty times over by now. Cass laughs at your rejoinder, then picks up the pace, doing her damndest to keep you hard and in her for as long as possible.", parse);
	Text.NL();
	if(player.FirstVag()) {
		Text.Add("At the same time, Cassidy’s tail gives one final thrust into your pussy, corkscrewing itself left and right and sending slick girl-cum splattering all over the place. You close your eyes and lose yourself in the ecstasy of the moment, lacking the strength to do anything much other than succumb and let Cass do all the work.", parse);
		Text.NL();
		Text.Add("Time fades away to nothing as Cassidy’s tail thrashes inside you, bumps rising on your lower belly as your stretchiness is taxed to its limits. All of a sudden, your nethers clench down hard on the scaly invader, and then a second orgasm runs through your body from head to toe, blotting out your thoughts entirely. Although you’re already spent, your [cock] lets loose a few more feeble spurts of sperm into Cass.", parse);
		Text.NL();
	}
	Text.Add("<i>“Better, much, much better. Now that’s how you take a fight to its finish,”</i> Cass says with a happy sigh. She grins at you wolfishly - the feeling of your sperm, slippery between her thighs, clearly gives the salamander a great deal of satisfaction. More than usual, you dare say, especially considering how it was extracted from you.", parse);
	Text.NL();
	Text.Add("After your finish, the two of you just remain in position for a while, letting the high of your frenzied, violent copulation die down. Despite Cass’ toasty insides, you eventually find yourself going soft enough that she can lift herself off you with ease. A few strands of cum join you as she does so, eventually thinning and breaking as Cass looks down and surveys her handiwork contentedly.", parse);
	Text.NL();
	Text.Add("<i>“Okay, champ, game’s over. <b>Now</b> you can rest if you want to.”</i>", parse);
	Text.NL();
	Text.Add("Oof, you definitely feel like you need it, at any rate. Is she sure, though? You don’t think that she came at any point in all this…", parse);
	Text.NL();
	Text.Add("Cass waves off your concern with a laugh. <i>“Come on, champ. Hah, I had fun, and that’s what matters, not some stupid crap like that. Next time, I’m expecting you to put everything you’ve got into it instead of quitting halfway.”</i>", parse);
	Text.NL();
	Text.Add("“Quitting halfway” wasn’t exactly in your plans, but you don’t think you’ve the energy to argue with Cass any further - getting off her backyard sounds like a more important task.", parse);
	Text.NL();
	
	SparSexScenes.LossOutro();
}

SparSexScenes.SuckOnBreasts = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("As luck would have it, Cassidy shifts her weight off you and leans down on all fours - well, not quite, considering that her hips are still pressing down against your chest. Already having grown once from the feminizing draught, the salamander’s breasts are now even more swollen from her barely restrained arousal - and with your face directly under those firm, rounded mounds, perks without the slightest bit of sag to them, you couldn’t be in a better position to appreciate them.", parse);
	Text.NL();
	Text.Add("Apparently, the sheer act of breathing onto the sensitive lady lumps must have triggered something in Cass, for the salamander’s back suddenly stiffens. Her burning tail winds about your lower body as she desperately tries to stifle a cry through strained teeth, hands cupping her bosom as she desperately kneads it. Unsurprisingly, you feel a slimy wetness spreading on your chest where Cassidy’s groin meets it, and she sags, panting.", parse);
	Text.NL();
	Text.Add("<i>“Crap… that never used to happen before. Before I agreed to do this to myself, that is…”</i>", parse);
	Text.NL();
	Text.Add("And does she regret it?", parse);
	Text.NL();
	Text.Add("<i>“Yes and no.”</i> With that said, she thrusts herself forward and down again, forcefully stuffing her swollen tit into your mouth.", parse);
	Text.NL();
	Text.Add("You knew that Cass was flush with heat, but this is something else altogether! The <i>thing</i> in your mouth feels so deliciously firm and hot, almost as if steaming goo had been poured into a balloon and stuffed into your face-hole. Although she’s dry, you obediently start suckling, deciding to start easy to give her enough time to adjust to her violence sparked lust. Moving your lips back and forth, you begin massaging Cassidy’s breastflesh, spreading a thin coating of spit on the heated skin. Back and forth you go in a rolling motion, back and forth, and Cass shudders, her tail’s grip tightening ever so slightly.", parse);
	Text.NL();
	Text.Add("<i>“Uuh… oh.”</i>", parse);
	Text.NL();
	Text.Add("Time to move on, then. You feel drained from the recent fight, but it doesn’t take that much energy to extend your tongue and tease her nipple ever so slightly with the tip of your [tongue]. You didn’t think it could get that much harder and stiffer, but that’s what happens as Cass moans and wriggles atop you, her teats as hard as diamond. The first tentative touch quickly escalates into a steady, gentle licking, then turns more vigorous as you probe all the way down to her areola; on her part, Cass rubs her hands about the base of the breast in question and starts kneading for all she’s worth. Whorish moans are soon coming out from between her lips - the decision to get slightly bigger assets sure wasn’t a bad one.", parse);
	Text.NL();
	Text.Add("All of a sudden, though, you become aware of a gentle but increasingly insistent tugging at your mouth. Seems like Cass doesn’t want to stay lopsided like this, and wants her other half to join in the fun, too. You’re not about to let her go without a fight, though, and suck furiously at her breast, straining your lungs with all your might. Taken by surprise, Cassidy groans and arches her back, trying to pull herself free of you; the struggle and exertion only serve to turn the already horny salamander on even further as her weapons-grade blush encompasses the entirety of her breastbone. You can <i>feel</i> her tit pulsating in your mouth, throbbing in time with her heartbeat - your only possible regret would be that she isn’t actually giving milk here, but beggars can’t be choosers.", parse);
	Text.NL();
	Text.Add("Despite your best efforts, though, you finally give way and Cassidy’s tit plops free with a loud pop, spraying droplets of spit all over. The two of you spend a few moments apart, panting like dogs on a hot day, then Cass leans in again with a fresh, hot lady lump for you to lavish your attentions upon.", parse);
	Text.NL();
	Text.Add("Burning hot as you are, there’s little need for foreplay now. You savage Cass’ nipple as best as you can without resorting to your teeth, smacking and scraping with all of your might, leaving the nub of sensitive flesh coated with your spit. Mixed in with everything else, the violence and mild pain do far more for the salamander than simple pleasure alone, and you can feel heavy wetness ooze from her cunt as she grinds mindlessly against you, her entire body trembling and on edge.", parse);
	Text.NL();
	Text.Add("<i>“Oh fuck yes,”</i> Cassidy manages to gasp in the few moments she has her breath. <i>“Told you that you weren’t down and out, champ. Come on, keep fighting!”</i>", parse);
	Text.NL();
	Text.Add("Your lungs can only take so much, though, and eventually you have to stop the suction for a bit. To compensate, you start wiggling your head from side to side with Cassidy’s boob still in your mouth, sending exquisite vibrations into the salamander’s body.", parse);
	Text.NL();
	Text.Add("Sensing you tiring, Cass moves to pick up the slack. The salamander greedily thrusts her chest forward, gagging you well and true, then rolls her body in an undulating motion, bobbing your head back and forth against the cool grass beneath. Unbeknowingly, your body reacts to the intrusion, and sinks your teeth into Cassidy’s titflesh.", parse);
	Text.NL();
	Text.Add("Any other woman might have recoiled from the pain, but Cass just gets off on it. Frozen in place, she stares down at you for the next few painstakingly long moments, then her entire body practically writhes atop you as she’s caught in the throes of orgasm. Tail beating at the grass, hands tight on your shoulders to the point that her knuckles are white, Cassidy yelps and howls as her honeypot spills over squirt upon squirt of girl-cum onto your stomach. After the first wave’s passed, she clings to you for dear life, tongue hanging out from between pointed teeth, and then another burst of orgasmic sensation wells up in her lower belly.", parse);
	Text.NL();
	Text.Add("By the time she’s finished, Cassidy’s thighs feel slick against your midriff, wet with her own feminine nectar. Slowly, she groans and straightens up, easing her sore breast out of your mouth.", parse);
	Text.NL();
	Text.Add("<i>“This is so much better than just any plain old messing around,”</i> she says with a groan.", parse);
	Text.NL();
	Text.Add("Isn’t it? You don’t even feel embarrassed about losing anymore!", parse);
	Text.NL();
	Text.Add("<i>“Yeah, I had fun. Just don’t… how should I put this? Just don’t bite down more than once every go, okay? That was… well, there can be too much of a good thing.”</i>", parse);
	Text.NL();
	Text.Add("You open your mouth to reply, but lose your train of thought and settle for just leaning your weight back in the grass with a soft thump. Cassidy follows suit, and soon the two of you are snuggled against each other in a messy heap.", parse);
	Text.NL();
	
	SparSexScenes.LossOutro();
}

SparSexScenes.Tribbing = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var fem = cassidy.Feminized();
	
	Text.Clear();
	Text.Add("Grinning like a madman, Cassidy disrobes herself, so eager to get started that she practically tears the garment apart removing it. Carelessly, she flings it over her shoulder then does the same with her shorts and your garments. The lot land in a messy heap on the moist grass, leaving the both of you in your birthday suits; Cass looks down at you with the eyes of a shark sizing up a particularly fat, lazy fish, and gives you an equally predatory leer.", parse);
	Text.NL();
	Text.Add("<i>“Mm, that’s a pretty pussy you’ve got there,”</i> the salamander purrs as she kneels down and straddles your hips, her delta dangerously close to yours. <i>“Not as good as mine, perhaps, but all else considered, I think I deserve a pretty pussy at the very least.”</i>", parse);
	Text.NL();
	Text.Add("Goodness. That doesn’t sound like the Cassidy you know in the least - is it the unquenched fire in her blood talking, or was this part of her always there, and it just took a little punching and slapping around for it to be brought out?", parse);
	Text.NL();
	Text.Add("Your thoughts are cut short by a sudden motion at your skin, followed by a rush of arousal that leaves warm tingles in its wake. ", parse);
	parse["b"] = player.HasBalls() ? " and balls" : "";
	if(player.FirstCock())
		Text.Add("Thoroughly unsatisfied with the view she’s been getting, Cass has gone ahead and slapped your [cocks][b] out of the way with a swift backhand, the easy motion seemingly almost effortless. Ouch, that <i>stings</i>! Cass simply giggles at the expression on your face, leans down to plant a kiss on your [cockTip], then moves on. ", parse);
	Text.Add("Before long, you quickly become aware of just what the salamander is up to: planting each of her hands on one-half of your chest, she begins massaging your [breasts], palms cupped and making wide, rolling motions. Heat seems to pass from her touch into your skin, and soon the flames of arousal spring to life in your breast, creeping outwards to every part of your body.", parse);
	Text.NL();
	Text.Add("<i>“Doesn’t that feel good, lover mine?”</i> Cassidy whispers, although it sounds more like a hiss. She smiles at you - or more correctly, shows you her teeth - and whips her tail back and forth behind her, scattering tiny embers onto the grass. <i>“I mean, you should know better than to leave a girl hanging and unsatisfied - it’s simply not done to break off in the heat of the moment and say you’re done. Sure, I like to play, but you’ve got to play to the end…</i>", parse);
	Text.NL();
	Text.Add("<i>“Else I’ll just have to take it from you,”</i> she finishes with a nasty smirk.", parse);
	Text.NL();
	Text.Add("Cass gives your [breasts] one final grope, then pinpricks dance across the surface of your skin as clawed fingers wander down your ribs to your waist, your hips, and finally your groin. Demurring to herself, Cass pauses for a moment, idly tracing circles on your delta, almost delirious with delight at how she’s getting you to moan and squirm, trying to use what little strength that hadn’t been expended in the sparring bout to get her hands to move just that tiny bit lower.", parse);
	Text.NL();
	Text.Add("She doesn’t.", parse);
	Text.NL();
	parse["cl3"] = player.FirstVag().clitCock ? "" : ", caressing your clit with a thumb";
	parse["cl4"] = player.FirstVag().clitCock ? " from" : " as she busily pushes at your love-button, feeling it swell and stiffen under";
	Text.Add("Instead, Cass takes her time in getting you all wet and ready[cl3] as she sinks a knuckle into your soft, feminine folds. Now the teasing begins in earnest as her scaly finger dips shallowly into your cunt over and over again. Surges of electric pleasure jump up and down through your body[cl4] her loving touch. You arch your back and push your hips forward; she simply withdraws until the same maddening there-but-not-quite-there sensation is there as it’s always been.", parse);
	Text.NL();
	Text.Add("Sure, you might not get off on violence like Cassidy does, but what she’s doing to you has you on the end of your tether. ", parse);
	if(player.FirstCock())
		Text.Add("Your [cocks] [hasHave] been extended to full mast, utterly bloated and engorged in anticipation of having a nice sleeve to slide into. However, it seems like [itThey]’ll be disappointed tonight, as Cass continues to focus her attentions on your [vag]. ", parse);
	Text.Add("Wet and slick with your juices, the petals of your womanly flower are practically alive; they feel so soft, pliant and <i>hot</i> as Cassidy toys with them, stroking and caressing your vulva. You moan in delight, [nips] erect as she rubs the fat, fleshy folds between thumb and forefinger, pinching your cunt lips between the lengths of her scaly fingers.", parse);
	Text.NL();
	Text.Add("At last, it looks like Cass is ready, for her nasty grin widens even further and she withdraws her knuckle from your cunt, a single strand of girl-juice hanging in the air for a second or two before it finally snaps. Come to think of it… how does she know all this if she doesn’t have that much in the way of sexual experience? Has she actually practiced on herself a lot, or is her great-grandmother surfacing in her blood?", parse);
	Text.NL();
	parse["fem"] = fem ? "rounded and palmable" : "small and perky";
	Text.Add("Your thoughts are cut short as Cassidy finally deigns to close the space between your bodies, getting on all fours and leaning low such that the delicate, stiff nipples that cap her [fem] tits are almost touching your [skin]. She looks at you adoringly for a moment, then laughs gaily, her gaze gripping yours.", parse);
	Text.NL();
	Text.Add("<i>“Just look at you, champ; you look like there’s been an itch on your nose since morning. All right, I’m not going to hold back any more!”</i>", parse);
	Text.NL();
	parse["cl5"] = player.FirstVag().clitCock ? ", and she slides upwards across your mound" : ", and she slides upwards across your stiffened clitty";
	Text.Add("Cass is good to her word. With a long, sensuous motion, she drags the lips of her tight, pretty pussy over yours. A very satisfying slurping noise sounds in the cool night air as your deltas meet[cl5]", parse);
	if(player.FirstCock())
		Text.Add(" and all the way to the base of your throbbing, painfully full cock. She even manages to kiss her netherlips partway up your shaft, smearing her clear womanly nectar against the girth of your rod, and your stomach twists in agonizing need as a small spurt of pre erupts from your [cockTip]", parse);
	Text.Add(". The sensations you’re experiencing are beyond belief; hot, liquid fire flows from Cassidy’s cunt into yours, setting your inner walls alight with heat that races all the way up into your womb and out into your lower belly. Again and again, Cassidy’s pussy lips meet your with a squelch; again and again, she smears you with your own love juices like the helpless thing that you are, completely at this salamander’s mercy. Each time your swollen cunt-lips make contact, your desire to rut and hump against Cass grows, until you’re practically thrashing in a bid to draw your genitals against hers in a frenzy of tribbing.", parse);
	Text.NL();
	Text.Add("<i>“Knew you were holding back on me!”</i> Cassidy says with a laugh. <i>“Come on, let’s see what you’ve still got in you!”</i>", parse);
	Text.NL();
	Text.Add("Fine! Feeling a surge of strength revitalize you at her words, you curl a hand up and across Cassidy’s back, barely managing to reach enough of the salamander’s ass to give it a good, long squeeze.", parse);
	Text.NL();
	if(fem) {
		Text.Add("Sure, it may be rounder now that Cass is a little more girly, but that roundness is still packed full of deliciously powerful muscle. You can practically feel the ass cheek in your hand flex and pulse as she continues to hump you; the sheer thought of all that wiry, powerful muscle sends your cunt to quivering and clenching.", parse);
	}
	else {
		Text.Add("Cassidy may not have that much of an ass, but what is there is comprised of wiry, strong muscle; you can sense the ass cheek in your hand grip and flex in time with her grinding against your cunt. In fact, in your mind’s eye, you can easily visualize her entire body as a solid hammer, just pounding away at you…", parse);
		Text.NL();
		Text.Add("Unbidden, your [vag] sets to a fit of quivering and clenching, desperate for something to fill that yawning emptiness within it already.", parse);
	}
	Text.NL();
	Text.Add("At last, Cassidy starts to fuck you in earnest, pressing and pumping, her body sliding and bucking against yours, grinning and giggling at the sounds and expressions you involuntarily make as she shares a bit of lady love with you.", parse);
	Text.NL();
	Text.Add("After a minute or two, it’s clear that she isn’t letting off steam anywhere near the rate which she wants, and the salamander doubly redoubles her efforts, speeding up her frenzied fucking as she mashes her petals against yours in an adrenaline-fueled fit of aggression. The battering only serves to turn Cass on even more, which means more steam to blow off. Unsurprisingly, the two of you are dragged into an ever-escalating spiral of copulation that only seems likely to stop once Cassidy runs out of stamina, which doesn’t seem to be anytime soon.", parse);
	Text.NL();
	parse["cl6"] = player.FirstVag().clitCock ? " her clit pounding against your clit-cock, pulsating" : "your clits pounding against each other, pulverized";
	Text.Add("<i>“Damn,”</i> Cassidy pants, her tongue hanging out from between tiny pointed teeth like a dog on a hot day. She’s shed what little pretense of gentleness she’d had - each animal upsurge of her body against yours has[cl6] in a frenzy of ecstatic rutting. Cass opens and shuts her mouth a few times, then gives up trying to remember what she was going to say. No big loss - her mouth is much better put to use just hanging open with her tongue lolling out, each buck of her hips against yours sending another pant heaving through it. While you can think of even more fun and interesting activities that Cass’ mouth can be engaged in, this will do for now.", parse);
	Text.NL();
	Text.Add("Time passes in a mindless whirl of burning desire, barely quenched by your desperate attempts at dousing it; as your mindless girl-fucking continues, Cassidy’s presence seems to grow to encompass you, her weight straddled upon your hips spreading across your whole body.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	Text.Add("With such exquisite stimulation, her entire body heaving against yours with each of her powerful thrusts, you’re finally broken and give in to your body’s demands. Juices gush forth from your [vag] as a slutty moan escapes your lips, your body pressing against Cassidy’s with wanton lust as your netherlips kiss a final time.", parse);
	if(player.FirstCock()) {
		Text.NL();
		Text.Add("Following [itsTheir] sister’s lead, your [cocks] explode[notS] vigorously, spurting your pent-up load all over your pressed bodies. It fountains up and splatters onto Cassidy, then runs off her skin and scales to land onto you below. ", parse);
		if(cum > 9) {
			Text.Add("The torrential stream of spunk that erupts from your shaft is seemingly never-ending, managing to surprise even you as your body works on automatic, blasting away like a raging river.", parse);
			Text.NL();
			Text.Add("By the time your release subsides, your salamander lover’s entire underside has been thoroughly painted with a thick coat of seed - breasts, belly and all - and you’re lying in a veritable pool of the stuff itself, feeling the ground under the two of you going soggy.", parse);
		}
		else if(cum > 6) {
			Text.Add("It’s all you can do to gasp and throw your head back to ride out the orgasm as it runs its course - even with your eyes closed, you can still <i>feel</i> the pulses of fire running down your shaft[s] as more and more jizz is expelled from your body in thick, sticky ropes. They land on her underside, clinging on for a precious few seconds before raining back down on you in a lewd drizzle.", parse);
			Text.NL();
			Text.Add("All good things must come to an end, though, and eventually your man-meat[s] give their last spurt before sagging and starting to go limp. The two of you just stare at each other for a while, groaning and panting while you try to catch your breath.", parse);
		}
		else {
			Text.Add("Squirts of semen erupt from your [cocks] as orgasm grips your body, flying upwards to splatter on the smooth skin of Cassidy’s belly. The thick globs of spunk stick to her for a good while before slowly gathering together and oozing back down onto you, leaving you panting and wanting more.", parse);
			Text.NL();
			Text.Add("Unfortunately for you, your production is far too little to satisfy your desires, and it’s not long before you fire off your last shot of cum and your shaft[s] finally give up the ghost. What a pity - at the very least, it looks like Cass is having the time of her life.", parse);
		}
	}
	Text.NL();
	Text.Add("The two of you continue to thrust against each other for a little while more, but eventually it looks like the show’s about to die down now that Cass has expended most of her aggression on you. The salamander’s body shudders several times, but she doesn’t climax, which appears to be just fine with her.", parse);
	Text.NL();
	Text.Add("<i>”Next time,”</i> she chides you, waving a finger in front of your unfocused eyes, <i>“I expect you to put in a bit more effort without needing me to play nanny every step of the way. Come on, champ, I know you’re better than this.”</i>", parse);
	Text.NL();
	Text.Add("Heh… yeah. Next time. Now though, you’re not sure if you can even stand straight without running the risk of falling over.", parse);
	Text.NL();
	Text.Add("<i>“And you just keep that in mind!”</i> Giving you a cheery smile, Cassidy pushes herself off you and stretches lazily, seemingly unperturbed by the sexual fluids sticking to her skin and scales. You, on the other hand, sink back into the earth’s welcome embrace, feeling the heat of your salamander lover’s passing rising from you as you slowly begin to cool off.", parse);
	Text.NL();
	
	SparSexScenes.LossOutro();
}

SparSexScenes.LossOutro = function() {
	var parse = {
		
	};
	
	Text.Add("As much as your used and abused body would like to lie here forever like some lifeless lump, you know that you can’t do that. Even if Cassidy would let you, lying down naked in someone’s backyard in broad daylight would invite inconvenient questions, at the very least. Your muscles voice their protest, but after a few more minutes of rest, you feel that you’re ready to get up and go, whether you like it or not.", parse);
	Text.NL();
	Text.Add("<i>“Like I said, there’s no shame in losing, champ.”</i> Cassidy offers you a hand up, and you take it gratefully; she hauls you to your feet and plants a rough kiss on your cheek. <i>“I just want to see you putting in effort.”</i>", parse);
	Text.NL();
	Text.Add("For a moment, you consider protesting, then sigh inwardly and give up before returning Cassidy’s kiss.", parse);
	Text.NL();
	Text.Add("<i>“Come on, let’s go in. I’ll help you get your stuff together. Wish you could stay longer, but I’ve got a few more things to deal with before heading to bed, so…”</i>", parse);
	Text.NL();
	Text.Add("Yeah, you understand. With Cassidy’s help, you gather your stuff together, then head back in through the shop and make for the main door.", parse);
	Text.NL();
	Text.Add("<i>“No problems then, ace. Don’t be too long in coming back!”</i>", parse);
	Text.NL();
	Text.Add("Oh, you won’t, you won’t. All right, then - you’ll be seeing her around!", parse);
	
	cassidy.relation.IncreaseStat(100, 1);
	world.StepToHour(0);
	party.location = world.loc.Rigard.ShopStreet.street;
	
	Text.Flush();
	
	Gui.NextPrompt();
}

export { SexScenes, SparSexScenes };
