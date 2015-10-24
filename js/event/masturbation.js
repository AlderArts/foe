/*
 * Masturbation scenes for the PC
 */

Scenes.Masturbation = {};

// TODO: Stretch/Cap change for toy training

Scenes.Masturbation.Entry = function() {
	var parse = {
		
	};
	
	var lust = player.LustLevel();
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	
	Text.Clear();
	if(party.Num() > 1)
		Text.Add("Dismissing [comp] so you can have a bit of privacy,", parse);
	else
		Text.Add("Looking around for a quiet, private spot and quickly finding one,", parse);
	Text.Add(" you nip off in search of some relief from the rising need that’s been ", parse);
	if(lust < 0.5)
		Text.Add("needling at you for some time now.", parse);
	else if(lust < 0.75)
		Text.Add("constantly on your mind for a while.", parse);
	else
		Text.Add("threatening to overwhelm you.", parse);
	Text.Add(" Right. The only question now is: how do you want to go about blowing off some steam?", parse);
	Text.Flush();
	
	var br = player.FirstBreastRow().Size() >= 2;
	var taur = player.IsTaur();
	
	//[Cock][Pussy][Breasts][Ass]
	var options = new Array();
	
	/*
	if(player.FirstCock()) {
		//TODO
		options.push({ nameStr : "",
			tooltip : "",
			func : function() {
				
			}, enabled : !taur
		});
	}
	*/
	
	if(player.FirstVag()) {
		options.push({ nameStr : "Vag - finger",
			tooltip : "",
			func : function() {
				Scenes.Masturbation.VagOpening(Scenes.Masturbation.VagFinger);
			}, enabled : !taur
		});
		
		var vagCap = player.FirstVag().Cap();
		
		var optsT = new Array();
		var addVagToy = function(toy) {
			if(party.Inv().QueryNum(toy)) {
				optsT.push({ nameStr : toy.name,
					tooltip : toy.Long(),
					func : function(obj) {
						Scenes.Masturbation.VagOpening(Scenes.Masturbation.VagToy, obj);
					}, enabled : vagCap >= toy.cock.Thickness(), obj : toy
				});
			}
		}
		addVagToy(Items.Toys.SmallDildo);
		addVagToy(Items.Toys.MediumDildo);
		addVagToy(Items.Toys.LargeDildo);
		addVagToy(Items.Toys.ThinDildo);
		addVagToy(Items.Toys.ButtPlug);
		addVagToy(Items.Toys.LargeButtPlug);
		addVagToy(Items.Toys.AnalBeads);
		addVagToy(Items.Toys.LargeAnalBeads);
		addVagToy(Items.Toys.EquineDildo);
		addVagToy(Items.Toys.CanidDildo);
		addVagToy(Items.Toys.ChimeraDildo);
		if(optsT.length >= 1) {
			options.push({ nameStr : "Vag - toys",
				tooltip : "",
				func : function() {
					Gui.SetButtonsFromList(optsT, false, null);
				}, enabled : !taur
			});
		}
		
		//Requires prehensile tail
		if(player.HasPrehensileTail()) {
			options.push({ nameStr : "Vag - tail",
				tooltip : "",
				func : function() {
					Scenes.Masturbation.VagOpening(Scenes.Masturbation.VagTailfuck);
				}, enabled : !taur
			});
		}
	}
	
	options.push({ nameStr : "Ass - finger",
		tooltip : "",
		func : function() {
			Scenes.Masturbation.AnalOpening(Scenes.Masturbation.AnalFinger);
		}, enabled : !taur
	});
	
	var analCap = player.Butt().Cap();
	
	var optsT2 = new Array();
	var addAnalToy = function(toy) {
		if(party.Inv().QueryNum(toy)) {
			optsT2.push({ nameStr : toy.name,
				tooltip : toy.Long(),
				func : function(obj) {
					Scenes.Masturbation.AnalOpening(Scenes.Masturbation.AnalToy, obj);
				}, enabled : analCap >= toy.cock.Thickness(), obj : toy
			});
		}
	}
	addAnalToy(Items.Toys.SmallDildo);
	addAnalToy(Items.Toys.MediumDildo);
	addAnalToy(Items.Toys.LargeDildo);
	addAnalToy(Items.Toys.ThinDildo);
	addAnalToy(Items.Toys.ButtPlug);
	addAnalToy(Items.Toys.LargeButtPlug);
	addAnalToy(Items.Toys.AnalBeads);
	addAnalToy(Items.Toys.LargeAnalBeads);
	addAnalToy(Items.Toys.EquineDildo);
	addAnalToy(Items.Toys.CanidDildo);
	addAnalToy(Items.Toys.ChimeraDildo);
	if(optsT2.length >= 1) {
		options.push({ nameStr : "Anal - toys",
			tooltip : "",
			func : function() {
				Gui.SetButtonsFromList(optsT2, false, null);
			}, enabled : !taur
		});
	}
	
	options.push({ nameStr : "Breasts",
		tooltip : "",
		func : Scenes.Masturbation.Breasts, enabled : br
	});
	
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("You resist the urge... you really have better things to do.", parse);
		Text.NL();
		parse["c"] = party.Num() > 1 ? Text.Parse(" call back [comp] and", parse) : "";
		Text.Add("Flushed, you[c] continue on your journey.", parse);
		Text.Flush();
		Gui.NextPrompt();
	});
}

Scenes.Masturbation.AnalOpening = function(func, obj) {
	var parse = {
		toparmordesc : player.ArmorDesc(),
		bottomarmordesc : player.LowerArmorDesc()
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	var lusty = player.LustLevel() >= 0.7;
	
	Text.Clear();
	var fullArm = player.Armor() ? (player.Armor().subtype == ItemSubtype.FullArmor) : false;
	parse["arm"] = player.LowerArmor() && fullArm ? Text.Parse(", quickly followed by your [bottomarmordesc]", parse) : "";
	Text.Add("After a final check to make sure that you’re well alone and won’t be interrupted, you find a comfortable spot to settle down in and begin disrobing yourself with glee. Soon, your [armor] falls to the ground[arm], leaving you in your birthday suit. ", parse);
	if(lusty)
		Text.Add("You’ve been waiting a long time to scratch this particular itch - it’s been nagging at the back of your mind for far too long now - and get to it brimming with excitement.", parse);
	else
		Text.Add("Time to get to it, then! Some relief for that itch in the back of your mind would be nice.", parse);
	Text.NL();
	Text.Add("Gleefully, you place your hands on your [hips], then reach around for your [butt]. Grasping each", parse);
	var buttSize = player.Butt().Size();
	if(buttSize > 9)
		Text.Add(" lush and bountiful", parse);
	else if(buttSize > 5)
		Text.Add(" ample", parse);
	Text.Add(" butt cheek in hand, you slowly pry them apart until you can feel cool air pass directly along your stretched sphincter, and shiver at the knowledge of what you’re about to do. Arousal surges in your breast at the lewd thoughts that pass unbidden through your mind.", parse);
	Text.NL();
	Text.Add("No time to waste. ", parse);
	if(player.FirstVag()) {
		Text.Add("You briefly move your fingers to your [vag], sliding them into your honeypot and retrieving a small coating of feminine nectar on your digits, perfect natural lube for the deed you’re about to do.", parse);
		if(lusty)
			Text.Add(" Your slick and moist [vag] cries out with the need to be sated and pounded silly, but alas, that is not its fate today.", parse);
	}
	else if(player.FirstCock()) {
		Text.Add("You brush your fingers against the tip[s] of your [cocks], swiping some of the slick pre that’s begun to bead on the half-erect shafts. Mmm, smooth and slippery… this’ll do just fine for lube.", parse);
		if(lusty)
			Text.Add(" Although your [cocks] yearn[notS] to be the primary recipient of your lavished attentions, twitching slightly as [itThey] sense[notS] your increasingly lustful bent of mind, it is not to be this day.", parse);
	}
	else {
		Text.Add("You divert a couple of fingers to your mouth and smear them with spit, taking care to get as much as you can onto it. Not the best when it comes to these things, but it’ll do in a pinch.", parse);
	}
	Text.Add(" With that done, you reach behind you once more and smear the impromptu lube all over your pucker, preparing it for what you have in mind.", parse);
	Text.NL();
	
	func(parse, obj);
}

Scenes.Masturbation.AnalFingerCockblock = function(parse, cum) {
	if(player.FirstCock()) {
		Text.Add("Unable to take the pounding at your prostate any longer, your [cocks] choose[notS] this moment to shoot off [itsTheir] load, string after string of hot, sticky seed arcing into the air and landing on the ground a good distance away. All the anticipation and stimulation seems to have done you good - your current load of sperm looks much thicker and richer than normal, speaking well of your prostate-milking skills.", parse);
		if(cum > 9)
			Text.Add(" It seems never-ending, the viscous, white flow that’s practically inhuman to behold. More and more sperm just keeps on coming out of your [cockTip] like an overflowing font, your prostate and balls working together in blissful union to flood your surroundings with as much seed as they can summon up.", parse);
		else if(cum > 6)
			Text.Add(" You’ve certainly got quite the reserve of sperm in you, make even more voluminous by the attention you’ve lavished upon your prostate. Despite the long, bountiful spurts of seed blasting from your [cockTip],  spurts that leave little doubt as to your virility, it takes a good while for you to be drained of every last drop of seed that you’re worth.", parse);
		Text.NL();
	}
}

Scenes.Masturbation.AnalFinger = function(parse) {
	var cap = player.Butt().Cap();
	var br = player.FirstBreastRow().Size();
	
	Text.Add("Grasping each side of your sphincter with a finger each, you begin to force it apart. ", parse);
	if(cap > 10)
		Text.Add("Well-trained and eager to get started already, your pucker may be normally tight, but yields easily enough under your questing digits. With such rousing success, you can’t help but feel a surge of pride at how well your butt’s adapted into becoming a veritable receptacle for cocks - and perhaps other things as well...", parse);
	else if(cap > 5)
		Text.Add("There’s some instinctive reluctance on the part of your pucker to being opened like this, but you nevertheless stay the course until the deed is done. This’ll probably get easier with more training…", parse);
	else
		Text.Add("There’s considerable resistance to your efforts and you wonder if your questing digits are going to cramp from the effort, but at last the deed is done, if not without difficulty.", parse);
	Text.NL();
	Text.Add("Before too long, you’ve slipped in a finger into the warm, tight confines of your [anus], squirming away shamelessly as you probe the dank depths and send another from the same hand to join it.", parse);
	if(player.FirstCock()) {
		Text.Add(" It’s not long before you manage to find the vaunted prize - your questing fingertips brush against the soft rise of your prostate, sending an electric surge of excitement and arousal through your entire body.", parse);
		Text.NL();
		Text.Add("Barely has the first one died down before you rub it again, more insistently this time; eyes rolling back into your head, you twist and squirm shamelessly with evoked pleasure even as your [cocks] rush[notEs] to full mast, beads of pre rapidly turning into dribbles at the stimulation [itsTheyre] receiving.", parse);
	}
	Text.NL();
	if(br >= 2) {
		Text.Add("At the same time, your free hand finds its way to your [breasts], gently kneading the ", parse);
		if(br > 12.5)
			Text.Add("heavy and plentiful mounds in turn, causing them to jiggle and quake in the most salacious manner while you deal with your ass down below.", parse);
		else if(br > 5)
			Text.Add("ample mounds one by one. Each of your milk-cans is just large enough for one hand to almost engulf, making them just the right size for lavishing your attentions upon while you finger your [anus]. You do just that, shamelessly molesting yourself and moaning a little more loudly than necessary in the process, assaulted by waves of pleasure from both ends.", parse);
		else
			Text.Add("small, perky things and making sure they’re well-attended to, even as you concentrate on fingering your [anus] from below. Sure, they’re not very hefty, but that just makes things more concentrated, right?", parse);
		Text.NL();
		Text.Add("Slowly, you close in on your areolae and nipples, pulling and tweaking away roughly to mirror the vigor with which your butthole is being invaded with your other hand. Without needing to even think about it, your fingers pull and tease away in time with your fingering, both ends working in tandem to grant you as much pleasure as they can muster.", parse);
		Text.NL();
		if(player.Lactation()) {
			Text.Add("At the same time, a small stream of milk bursts forth from each of your [nips], giving in to the gentle milking and moistening your fingers with lactate. The milk’s flow runs off your [breasts] and down your sides, dripping onto the ground shamelessly, testament to your productive nature.", parse);
			Text.NL();
		}
	}
	if(player.FirstVag()) {
		Text.Add("So close, too, and yet so far: your loins burn with unrequited desire, a dribble of girl-juices oozes from your folds and works its way down your taint to your butthole, the warm trickle making its presence keenly felt every step of the way until it finally joins up with your finger.", parse);
		Text.NL();
		Text.Add("The squelching noises that result are more than a little satisfying for both body and mind, and you gasp, every inch of your being slowly consumed by the mounting pleasure you’re experiencing. Your groin and hips… ", parse);
		if(player.sexlevel >= 3)
			Text.Add("no matter how many times you experience it, it’s still hard to believe so much orgiastic sensation can be packed into so little flesh.", parse);
		else
			Text.Add("it’s hard to wrap your mind properly about how much orgiastic sensation you’re experiencing in so small a space.", parse);
		Text.NL();
	}
	Text.Add("At last, though, you can practically taste the release coming upon you, the sea going out just shortly before the massive wave makes its landfall. With one final push, you drive yourself soundly over the edge, and an animal noise halfway between a moan and a scream forces its way out from between your lips, announcing your climax for all to hear. You convulse and lash out as every last inch of your body revels in its shared bliss.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum(2);
	
	Scenes.Masturbation.AnalFingerCockblock(parse, cum);
	
	if(player.FirstVag()) {
		Text.Add("At the same time, your [vag] goes into overdrive, oozing and clenching away, desperate for something to suckle on and finally settling for squirting a small stream of girl-cum to splatter on yourself and stain your crotch as your climax approaches its zenith. Caught up in a whirlwind of exquisite sensations, you howl like ", parse);
		if(player.Race().isRace(Race.Canine))
			Text.Add("the bitch that you are", parse);
		else
			Text.Add("a bitch in heat", parse);
		parse["l"] = player.HasLegs() ? "the space between your legs" : "your crotch";
		Text.Add(", your entire world reduced to [l].", parse);
		Text.NL();
	}
	Text.Add("By and large, though, the pleasure eventually fades, leaving you to extricate your finger from your [anus] in due course. Panting, your lungs heaving with the occasional moan, you just lie for a bit on the ground until you’re ready to be on your feet again, your lusts sated - for now, that is.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

Scenes.Masturbation.AnalToy = function(parse, toy) {
	var cap = player.Butt().Cap();
	var br = player.FirstBreastRow().Size();
	
	parse["toy"] = toy.sDesc();
	
	Text.Add("Reaching for your [toy], you giddily bring its length around behind you, sliding it between your ass cheeks, feeling that hardness grind against your [anus] as you bring it into position. No time like the present, then - taking a deep breath and preparing yourself, you push downwards firmly on the [toy], easing it inside you.", parse);
	Text.NL();
	if(cap > 10)
		Text.Add("Your pliant, stretchy sphincter is extremely well-trained - tight and yet elastic, it easily swallows up your [toy]’s [cockTip] without a hitch. Encouraged by this early success, you push downwards a bit more insistently, and are rewarded with your ass eagerly taking in all it can. You’ve sure turned into a happy buttslut, haven’t you?", parse);
	else {
		Text.Add("There <i>is</i> a little difficulty, a little unease - a toy is much thicker than your average finger, after all, and it seems like you’re not as well-trained as you’d like to be. Nevertheless, you manage to wiggle it past your [anus]’s instinctive resistance, stretching the ring of muscle wide enough for you to slide the toy’s [cockTip] past and into your warm depths.", parse);
		Text.NL();
		Text.Add("From there, it’s just a matter of steeling yourself and being insistent, and soon enough you’re rewarded with a jolt of pleasure as your [toy] sinks further into you.", parse);
	}
	Text.NL();
	Text.Add("Instead of pumping the [toy]’s length up and down like you might have for a cunt, you instead begin to grind it in small circles, your [anus] shifting and twisting with the motions even as you feel the [cockTip] rub against your insides, your breathing coming quick and short even as your hands’ movements grow ever more anxious and jerky.", parse);
	if(player.FirstCock()) {
		Text.Add(" Thus simulated, tendrils of exquisite pleasure begin to reach outward from your prostate and up along your spine. Unbidden, a loud, languid moan escapes your lips as your jaw goes slack, and you almost - <i>almost</i> lose control of your toy, letting it slip out of your hands for a moment. Thankfully, you quickly right yourself, eager for more of that delicious yet fleeting pleasure, and shove your [toy] deeper into your [anus], this time with <i>feeling</i>.", parse);
		Text.NL();
		Text.Add("And what a feeling it is. Your [cocks], already fully at attention, tremble[notS] and throb[notS] as the tip of your toy mashes itself against your love-bump over and over again, the occasional drip of pre turning into small, steady stream[s] as pleasure and exhilaration alike grow. At some point, you’re vaguely aware of the fact that [itsTheyre] painfully erect, but any discomfort at this fact is quickly drowned out by the waves of pleasure that’re crashing against your consciousness.", parse);
		Text.NL();
		parse["m"] = player.mfTrue("man-", "");
		Text.Add("There’s little doubt that you’re that here and now, you’re a shameless buttslut of a [m]whore, but it feels so good that you couldn’t care less.", parse);
		Text.NL();
	}
	if(br >= 2) {
		Text.Add("At the same time, you realize that your [breasts] are starting to ache terribly with need as well, your beady nipples hard as pebbles. Another itch to be scratched, yet you don’t want to stop the wonderful blissplosions going on in your [anus]… slowly, carefully, you move one hand upwards to your chest while the other continues working away with your [toy].", parse);
		Text.NL();
		if(br > 12.5)
			Text.Add("At long last, your fingers make contact with those more-than-ample mounds of heated breastflesh that sit on your chest, flush with tension and desire. You make sure to try and molest yourself in an even manner, although with the way the full, teardrop-shaped mammaries jiggle and shake about, your mind is increasingly occupied with reveling in the sensation of full weight that they’re providing.", parse);
		else if(br > 4) {
			Text.Add("It’s not long before your fingertips make contact with your ripe, well-proportioned dugs, swollen slightly with a flush of desire. You let your fingers lie on heated breastflesh for a little while, feeling the throb and pulse of desire just below the skin, then press into that tender mix.", parse);
			Text.NL();
			Text.Add("For a good, long while, you let your hands roam where they will, fingers sinking into your needy boobs as you work out all the pent-up tension in them. They’re so firm and yet have the required mass and heft to them, it’s hard not to want to just dig in with wanton abandon, no matter how much you may pay for it later.", parse);
		}
		else {
			Text.Add("Since there isn’t that much in the way of boobflesh for you to work with, flushed as you are, your fingers seize upon your nipples, rolling the hard little nubs of sensitive flesh between thumb and forefinger in turn. Thus stimulated, you gasp and moan even as you feel your already engorged nipple harden even further, bringing you ever closer to the edge of bliss you so crave.", parse);
			Text.NL();
			Text.Add("Slowly, you slide your touch down your nipple to the swollen areolae that form its base, poking, tweaking and rubbing away to produce the best feeling of sensuous satiation you’ve had in a while now.", parse);
		}
		Text.NL();
		Text.Add("Unconsciously, your fingers work in tandem with your [toy], driving you to ever greater heights of ecstasy that turn you into a whimpering, moaning wreck, slave to the blissful sensations that you’re inflicting upon yourself.", parse);
		var milk = player.Milk();
		if(player.Lactation()) {
			if(milk > 10)
				Text.Add("Spurts of milk blast from your [nips], eagerly released thanks to the internal pressure within your breasts, and you watch the thin streams with rapt fascination as they rise and fall in glorious arcs.", parse);
			else
				Text.Add("Streams of milk spurt from your nips, squeezed out from your reserves thanks to your gratuitous groping. They arc a little way into the air before splashing messily on your chest and running off onto the ground, leaving trails of moist warmth in their wake.", parse);
			
			player.LactHandler().MilkDrain(2);
		}
	}
	Text.NL();
	
	var cum = player.OrgasmCum(2);
	
	Scenes.Masturbation.AnalFingerCockblock(parse, cum);
	
	if(player.FirstVag()) {
		Text.Add("Sharing in the pleasures of your entire body, your [vag] clenches greedily, practically dripping with girl-cum as if the [toy] were pounding away at it and not in your [anus]. You can’t help but squeeze your eyes shut and grit your teeth as your [vag] pulses with heat, the inner walls of your love tunnel practically undulating as they seek something, <i>anything</i> to take into them and sate the desperate hunger of your womb.", parse);
		Text.NL();
	}
	Text.Add("With a final, desperate push, you slam down the [toy] into your [anus] as far as it’ll go, shuddering at the sheer brutal force that’s being applied to your tender insides. That’s enough to set you over the edge; dropping everything, you brainlessly claw at the ground with stiff fingers, trying to find purchase against the orgiastic sensations that threaten to sweep you away. Tears well up in your eyes, and when you’re finally aware of it, you realize you’ve been holding your breath for a good long while now.", parse);
	Text.NL();
	Text.Add("It’s only when the climax passes that you relax and sag a little in its wake, although it still takes a little while before you work up the strength or presence of mind to remove the [toy] from your [anus], pulling it free with a wet, slurping sound. Yes… this certainly blew off all that steam you’d been building up.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

// Generic opening scene. Sets up all parser stuff and calls the scene proper
Scenes.Masturbation.VagOpening = function(func, obj) {
	var parse = {
		toparmordesc : player.ArmorDesc(),
		bottomarmordesc : player.LowerArmorDesc()
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Clear();
	var armor = (player.topArmorSlot && player.botArmorSlot);
	parse["arm"] = Text.Parse(armor ? "both [toparmordesc] and [bottomarmordesc]" : "your [armor]", parse);
	Text.Add("Wasting no time, you find a comfortable spot, divesting yourself of [arm] before ", parse);
	if(player.HasLegs())
		Text.Add("lying down on the ground and spreading your legs wide, allowing you easy access to your [vag].", parse);
	else
		Text.Add("stretching out on the ground, exposing your [vag] for the world to see.", parse);
	Text.Add(" With a soft sigh, you make sure you’re completely comfortable before snaking a hand down across your [belly] and over your [hips] to get at your netherlips, gently testing them with your fingertips in foreplay of sorts. ", parse);
	if(player.LustLevel() > 0.66) {
		Text.Add("As you explore yourself, it soon becomes painfully obvious your mounting arousal is making itself known. The petals of your womanly flower are swollen and puffy with heat and excitement, a thin sheen of nectar already coating the outermost ones - not to mention what’s to be had further within.", parse);
		Text.NL();
		Text.Add("As you tease and test away, a flush of arousal springs up from your groin and into your lower belly, causing you to moan with anticipation.", parse);
	}
	else {
		Text.Add("Tenderly, you begin to rub at your outermost folds, tingles of arousal sparking outwards from the contact and collecting in your lower belly. As the sensation of heat grows, you can feel the petals of your womanly flower swelling and moistening beneath your fingertips, which only drives you to be a little more insistent in your ministrations.", parse);
	}
	Text.NL();
	Text.Add("The soft scent of feminine excitement is making itself known to you even as your slit grows wetter and wetter, and you begin in earnest. ", parse);
	
	// Call scene proper
	func(parse, obj);
}

Scenes.Masturbation.VagFingerCockblock = function(parse, cum) {
	if(player.FirstCock()) {
		Text.Add("At the same time, your [cocks] choose[notS] this moment to shoot off [itsTheir] load, string after string of hot, sticky seed arcing into the air and landing on the ground a good distance away with a series of wet-sounding splats.", parse);
		if(cum > 9)
			Text.Add(" It seems never-ending, the viscous, white flow - more and more sperm just keeps on coming out of your [cockTip], spraying out like a fire hose with just as much quantity and force, forming large puddles on the ground.", parse);
		else if(cum > 6)
			Text.Add(" You’ve certainly got quite the reserve of sperm in you - it’s a long while before you actually start to feel dry, despite the considerable amounts of spooge that blast forth from your [cockTip], creating small puddles on the ground before you.", parse);
		Text.NL();
	}
}

Scenes.Masturbation.VagFinger = function(parse) {
	//Fisting is triggered with wide hips wide cunt. Else, default to fingering.
	var cap = (player.body.torso.hipSize.Get() / 10) * (player.FirstVag().Cap() / 5);
	var fisting = cap >= 1;
	
	var preg = player.PregHandler().IsPregnant();
	var bellySize = player.PregHandler().BellySize();
	
	Text.Add("Slowly, you press a finger to your netherlips, pushing against them as your digit seeks entry into your heat-filled honeypot. There’s a brief, momentary resistance, and then it slips within, your inner walls eagerly welcoming the intrusion and the relief it brings to your engorged, needy folds. Your thumb’s still outside, and it’s that which you draw against your clitoral hood, feeling for your love-button. Erect as it is, it doesn’t take long for your searching thumb to hit home, and you’re rewarded with a spark of electricity that jolts up your spine and leaves you feeling weak all over.", parse);
	Text.NL();
	if(fisting)
		Text.Add("After you’ve recovered enough, you slip in more and more fingers - another and another and another, until your slit’s stretched wide. Yet this is still not enough to sate your hungry cunt, and so with a determined push, you slide in your entire fist in. Your wrist grazes against your [clit], and you fight to bite back a whorish moan as tears well up in your eyes at the wondrous sensations of <i>fullness</i> in your tunnel, your inner walls pulsing and undulating about the intrusion.", parse);
	else
		Text.Add("It takes a few moments for you to recover enough in order to continue, but when you do, you more than eagerly slip in another finger, followed by another, until you’re fully sunk up to your palm in your snatch. Your inner walls are more than eager to accept the intrusion, pulsing and flexing about your fingers as it tries to draw them further into yourself. Unable to contain yourself, you let out a shuddering moan even as a fresh flow of nectar gushes from your honeypot, coating your fingers until they glisten.", parse);
	Text.NL();
	Text.Add("Not to be left out, your other hand finds its way to your [breasts], and from there to your [nips]. Even as you work away furiously at your [vag], you begin to eagerly tease each sensitive bud in turn", parse);
	if(player.Lactation()) {
		Text.Add(", allowing dribbles of milk to escape your [breasts]", parse);
		if(preg)
			Text.Add(". This is even made all the more pleasurable by your milk-jugs’ swollen, hormonal state, courtesy of your pregnancy", parse);
	}
	parse["fist"] = fisting ? "fist" : "fingers";
	Text.Add(". The resultant jolts of orgiastic delight that wrack your body have you whimpering as your body twists this way and that, assaulted from both ends by your self-inflicted pleasure. With one back-arching plunge, you work your [fist] in and out of your [vag], thrusting again and again as far as you’ll go, so hard that the wet squelches of feminine bliss are distinctly audible amidst your moans.", parse);
	Text.NL();
	if(fisting && player.IsFlexible()) {
		var race = player.body.torso.race;
		parse["race"] = race.isRace(Race.Human) ? "flexible" : race.qShort();
		Text.Add("Thanks to your [race] body, you’re able to contort yourself to the point where you’re able to plant your fist far further up your greedy cunt than others would have managed. Guess there’s something to be said for manual dexterity, after all, even if it isn’t what would immediately come to most peoples’ minds.", parse);
		Text.NL();
	}
	Text.Add("In and out, in and out, each thrust bringing with it more pleasure than the last, each hump and grind against your completely soaked [fist] resulting in louder and louder cries of pleasure, despite your attempts to muffle them.", parse);
	if(bellySize > 0.25)
		Text.Add(" Almost of its own accord, your free hand slips from your [breasts] to your [belly], rubbing, stroking, caressing away at the swell of your baby bump as your current pleasures remind you of just how you ended up like this. It’s a pretty good memory…", parse);
	Text.NL();
	parse["fes"] = fisting ? "es" : "";
	Text.Add("Not that you could stop even if you wanted to, or even hold back for much longer. Back and forth your [fist] go[fes], your body moving of its own accord in a desperate attempt to slake the lusts you’ve ignited in your impassioned body. Burning with heat, your eyes rolled back and jaws slack as little moans and whimpers escape your mouth, you take the last few steps required to bring yourself to an earth-shattering climax.", parse);
	Text.NL();
	Text.Add("And it happens. Yowling like ", parse);
	if(player.Race().isRace(Race.Feline))
		Text.Add("the cat in heat that you are,", parse);
	else
		Text.Add("a cat in heat,", parse);
	Text.Add(" you arch your back and stiffen your body as the throes of orgasm consume you, your body completely out of your control at this point. Copious amounts of girl-cum burst forth from your love-tunnel, ", parse);
	if(fisting)
		Text.Add("wetting your wrist and trickling freely down your forearm. Your silken insides clench for dear life onto the intruding fist, desperately milking it as if it were a real cock, hoping for some seed for your cum-hungry insides.", parse);
	else
		Text.Add("bursting out about your fingers and completely soaking your hand and wrist before oozing onto the ground. Your silken insides clench like a vise about the intruding digits, desperately seeking to milk them as if they were a real cock, clearly hopeful for <i>some</i> form of seed to draw into you.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum(2);
	
	Scenes.Masturbation.VagFingerCockblock(parse, cum);
	
	Text.Add("Drained and exhausted, you slump onto your back, eyes staring upwards blankly and lungs heaving as the last vestiges of orgasm slowly begin to die away. Well, this was what you wanted, wasn’t it? You got it well and good, then - it’ll be a little while before you’ll be able to be on your way, but it was worth it.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

Scenes.Masturbation.VagToy = function(parse, toy) {
	var preg = player.PregHandler().IsPregnant();
	var bellySize = player.PregHandler().BellySize();
	
	parse["toy"] = toy.sDesc();
	
	Text.Add("Remembering your [toy], you reach for it - happily, it seems to have fallen within easy grasp when you were getting rid of your gear - and take it in hand. Yeah… <i>now</i> you remember why you bought this thing - it’s so big, so <i>thick</i>...", parse);
	Text.NL();
	Text.Add("A flush of arousal runs through your groin as lewd thoughts race through your mind, and reaching down with your [toy] firmly in hand, you press its tip against your netherlips. You gasp softly, the sound quickly turning into quiet moans as you begin to grind the toy’s length along your increasingly swollen and sensitive folds. The toy’s shaft feels cool as your heated lips kiss it, leaving behind a trail of love juices along its length.", parse);
	Text.NL();
	Text.Add("You ache to just get things over with and plunge it into your waiting nethers already, but force yourself to hold back. Although your hands are trembling with anticipation, you slowly insert your [toy] into your heated slit, feeling just the briefest resistance at your netherlips before they part and the toy’s tip sinks into you - just barely so. Arching your back and stifling a whimper of pleasure, you pull it out, then plunge it in once more.", parse);
	Text.NL();
	Text.Add("In. Out. In. Out. Each time, you thrust the [toy] a little deeper, each time, you go a little faster. Eventually, it gets to the point where you wouldn’t be able to stop even if you wanted to - your hips have begun moving with a mind of their own, bucking and rocking against the delicious length currently invading your insides", parse);
	if(player.FirstBreastRow().Size() >= 2) {
		Text.Add(", your [breasts] flopping up and down on your chest", parse);
		if(player.Lactation())
			Text.Add(" spraying drops of milk hither and thither", parse);
	}
	Text.Add(" even as your arm becomes a furious blur, determined to wring as much pleasure out of this activity as possible. Each second becomes a full orgy of blissplosions radiating outwards from your nethers and into the rest of your body as your love tunnel squeezes down hard on your [toy], as desperate and needy as if it were the real thing currently fucking you senseless.", parse);
	Text.NL();
	Text.Add("Head thrown back, tongue hanging out of your mouth, you pant ", parse);
	if(player.Race().isRace(Race.Canine))
		Text.Add("like the heat-driven bitch that you are", parse);
	else
		Text.Add("like a bitch in heat", parse);
	Text.Add(" before finally surrendering in a explosion of girl-cum that sends you to convulsing, both on the inside and the outside. Sweet nectar coats toy and hand alike as pleasure turns you into a quivering mass of jelly, and you feel like someone’s kicked you in the lungs, with much the same effect.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum(2);
	
	Scenes.Masturbation.VagFingerCockblock(parse, cum);
	
	Text.Add("At long last, it seems to be over. You’re not sure exactly how much time has passed with you lying insensate on the ground, but at last you manage to summon enough strength to pull your [toy] free of you. It parts from your [vag] with a wet slurp, and you shiver at the sensations the movement brings before rolling over with a groan. You’ll have to get up sometime, yes, but for now… maybe you’ll just lie here a little longer.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

Scenes.Masturbation.VagTailfuck = function(parse) {
	var preg = player.PregHandler().IsPregnant();
	var bellySize = player.PregHandler().BellySize();
	
	var br = player.FirstBreastRow().Size();
	
	Text.Add("Slowly, you begin sliding a finger down your hips to your heat-filled slit, but remember that you’ve a better way of dealing with this. Whipping your tail about, you position it such that its tip lingers just above your netherlips, gently grazing it and sending a thrill down your spine. Anyone can finger themselves, but this… yeah, this is something exotically different and dangerous.", parse);
	Text.NL();
	Text.Add("No point in dragging things out, then. Drawing a deep breath, you push your tail-tip insistently against your [vag], feeling the petals of your womanly flower part after a brief resistance, admitting the invasive appendage into your love-tunnel. The tip slides delightfully against your silken insides, and you shudder, your walls instinctively clenching about what they believe to be a male’s member, trying to draw it further into you.", parse);
	Text.NL();
	if(br >= 2) {
		Text.Add("The best part of this exercise? With both hands free, you’re given free rein to grope and molest yourself in the most shameful manner. Greedily, you grab your [breasts], ", parse);
		if(br < 4)
			Text.Add("easily cupping them, one palm to each perky mound. Clenching and flexing your fingers, you squeeze away shamelessly, the heel of your hand grinding against your increasingly stiff and engorged nipples. Unbidden, a flush of heat erupts just under your collarbone, leaving you panting and gasping for breath.", parse);
		else // large
			Text.Add("cupping the rounded ends of your [breasts] as best as they can, excess boobage running over from the cups of your palms. Tenderly, you begin to stroke and caress your lady lumps, paying extra attention to the areolae and nipples even as a rush of heat creeps in under your collarbone, leaving you short of breath.", parse);
		Text.NL();
		if(player.Lactation()) {
			Text.Add("With all this stimulation going on, it’s not long before beads of milk start leaking from your [nips] in earnest, lubricant of sorts for the rough groping you’re inflicting upon yourself.", parse);
			Text.NL();
		}
		Text.Add("As above, so below - the pleasure in your [breasts] is matched by that which is coming from your tail as it thrusts into your [vag] over and over again. You don’t have perfect control over it, making the process a little haphazard, but being assaulted with pleasure on all three fronts like this is fast turning you into a quivering, brainless wreck.", parse);
		Text.NL();
	}
	else if(player.FirstCock()) {
		Text.Add("Since your tail’s more than adequate to deal with your [vag], you turn your hands to your [cocks]. Responding to your growing arousal in their own fashion, your shaft[s] [hasHave] grown painfully erect, a throbbing, twitching mass of manflesh sharing in the bliss that your [vag] is experiencing, pre-cum welling up in [itsTheir] tip[notS] as [itThey] beg[notS] for a nice, warm sleeve to thrust into.", parse);
		Text.NL();
		Text.Add("That’s where your hands find purchase: stroking and rubbing away, you concentrate the electric tingles radiating outwards from your groin to near-unbearable levels, moving you closer and closer to that blessed, blissful, brainless state of fucking many can only dream of.", parse);
		Text.NL();
	}
	Text.Add("With a loud, needy groan, you begin to fuck your tail in earnest - or is it your tail fucking you? Who knows? What matters is that you arch your back and pound your hips against your glistening, cum-stained tail-tip, the two moving back and forth in tandem so as to plunge as deeply into your [vag] as your flexibility will accommodate.", parse);
	Text.NL();
	if(bellySize > 0.25) {
		Text.Add("Panting and groaning lustfully, you momentarily move your hands to the full roundness of your [belly]. ", parse);
		if(bellySize > 0.9)
			Text.Add("Running your touch all over the firm, taut surface of your stuffed womb, you think back to just how you ended up looking like this, and have to bite back a moan at the pleasant memories that particular train of thought conjures up - only made all the more intense with how deeply and furiously your own tail is fucking you.", parse);
		else
			Text.Add("For some reason, running your fingers all over your steadily growing baby bump makes you feel immensely satisfied… and sexy. With all the extra sensitivity, just rubbing and caressing your half-filled womb is making you more and more aroused, a situation that isn’t helped by the brutal fucking that your own tail is inflicting on you.", parse);
		Text.NL();
	}
	Text.Add("Eventually, things get to the point where you lose track of time altogether, just moving back and forth against your tail-tip as if you were possessed. Back arched, hips bucking, body on autopilot, you couldn’t stop even if you had the mind to - all that your mind is focused on is hammering yourself over and over again until you lose it.", parse);
	Text.NL();
	Text.Add("And you do. With an earth-shattering orgasm that sends your entire body to shaking, you spray out copious amounts of girl-cum onto your tail and all over your crotch. Deep within you, your insides desperately twist and squirm, and several shudders run through your entire form as the climax runs its course.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum(2);
	
	Scenes.Masturbation.VagFingerCockblock(parse, cum);
	
	Text.Add("At last, the aftershocks of pleasure begin to die away, leaving you equally drained and exhilarated as you lie limply on the ground, chest heaving as great gouts of hot breath escape your mouth. Your head continues to spin a little, but by and large you manage to get a tenuous grip on yourself and clamber upright. A moment more, and you’re dressed once more and ready to be off.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

Scenes.Masturbation.Breasts = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	var size   = player.FirstBreastRow().Size();
	var small  = size <= 4;
	var medium = size <= 10;
	var large  = !medium;
	
	var milk = player.Milk();
	var milkFull = player.LactHandler().MilkLevel() > 0.8;
	var preg = player.PregHandler().IsPregnant();
	
	Text.Clear();
	Text.Add("You quickly strip yourself of your [armor], letting it fall to the ground while you sequester your other belongings away safely.", parse);
	if(milkFull)
		Text.Add(" Your [breasts] have been painfully full for a while now, and you can’t wait to relieve them of their milky load.", parse);
	if(preg)
		Text.Add(" The fact that your pregnancy has only served to increase production <i>and</i> turn your milk-jugs more tender doesn’t help your predicament, either.", parse);
	Text.NL();
	Text.Add("Released from their confines, your [breasts] flop out into open, feeling much more comfortable with cool, fresh air passing over them unimpeded. ", parse);
	if(small) {
		Text.Add("The small, perky mounds you sport may not be the most impressive - a fact that holds doubly true on Eden - but they have their own benefits, such as not getting in the way. A better way of looking at it is that they aren’t small, but petite or even better, fun-sized.", parse);
	}
	else if(medium) {
		Text.Add("The pair of funbags you sport are of healthy proportions - large enough for most fun activities, but not big to the point of being obtrusive or cumbersome. There’s enough weight to them, ", parse);
		if(milkFull)
			Text.Add("plus the additional mass that their milky cargo holds, ", parse);
		Text.Add("and the resultant heft causes just the slightest bit of sag - enough for them to show their proudly feminine bent.", parse);
		Text.NL();
		Text.Add("All in all, a very respectable pair of baby-feeders.", parse);
	}
	else { //large
		Text.Add("The pillowy mounds that sit on your chest are truly of glorious proportions. Plush and teardrop-shaped, their firm goodness stands proud for all the world to see", parse);
		if(milkFull)
			Text.Add(", made only more so by the hefty cargo of nourishment that they’re holding", parse);
		Text.Add(". Their size leaves little room for doubt with regards to their feminine, voluptuous nature, and they heave and quiver on your chest with each breath you take.", parse);
	}
	Text.NL();
	Text.Add("Time to get started, then. You decide to start off slow - raising your hands to your chest, you ", parse);
	if(small) {
		Text.Add("cup each small orb of soft flesh in a palm, then start applying pressure as you rotate your hands in wide circles, kneading and squeezing all the while.", parse);
		if(milkFull)
			Text.Add(" Small streams of warm milk ooze from your gradually stiffening nipples, working their way through your fingers and trickling down the backs of your hands. It feels good to have a little of the pressure relieved, especially since your small cans aren’t really suited to holding large quantities in and of themselves.", parse);
		Text.Add(" Soft tingles crawl along your skin as you shamelessly molest yourself, and even though you don’t have the fullest of bosoms, you can nevertheless feel heat welling up in your chest as the first flushes of arousal begin to make themselves known.", parse);
	}
	else {
		Text.Add("support each of your milk cans from the side, your fingers capping your nipples and areolae while the heel of your palms dig into the sides of your [breasts]. That’s better now… stifling a soft moan as a gentle flush of heat erupts on your chest, you press your [breasts] together and begin to knead away, feeling the squeeze and push of your cleavage.", parse);
		if(milkFull)
			Text.Add(" Failing to withstand the added pressure, small streams of pearly white goodness erupt from your [nips], finally allowed release in any kind of decent quantity. Unable to hold back, you sigh and tremble all over at the sensation of relief that creeps into your [breasts], but the flow stops long before they can even be considered to be slightly drained.", parse);
		Text.Add(" Pushing, rubbing and squeezing away, you shamelessly molest yourself with wanton abandon, feeling your face and collar burn as the flush of arousal becomes more and more prominent.", parse);
	}
	Text.NL();
	Text.Add("Without knowing it, your fingertips have started wandering over to your half-solid [nips], brushing against them in a bid to evoke more pleasure from your self-stimulation. ", parse);
	if(preg) {
		Text.Add("And what a time to do so, too - your pregnancy has caused your [nips] to grow nice and fat in preparation for feeding the offspring that’s steadily getting bigger and stronger in your womb. Far more sensitive, too - the same hormones that’ve caused your [nips] to darken have made them receptive to the slightest touch, such that the tender ministrations of your questing fingers has you gasping and convulsing, the sensations of your fat dugs becoming fully engorged too much for you to handle.", parse);
	}
	else {
		Text.Add("It feels so good to tweak and stroke them, feeling the little nubs of flesh grow fat and large under your tender fingers.", parse);
		Text.NL();
		if(player.sexlevel >= 3)
			Text.Add("You know exactly what to do in order to make yourself feel good, and it’s not long before your face is fully flushed with heat, tongue hanging out of your mouth as you pant away. Groping yourself has never been so much more satisfying!", parse);
		else
			Text.Add("Even your areolae look bigger and firmer now, eagerly responding to the stimulation they’re receiving, and you can’t help but end up with a dreamy smile on your face as you eagerly explore your body in this fashion.", parse);
	}
	Text.NL();
	Text.Add("Tenderly, you draw circles in your areolae, pausing every so often to tweak each rock-hard nipple between thumb and forefinger, toying with them until the exquisite sensations rippling out into the rest of your body have you moaning like a cheap whore.", parse);
	Text.NL();
	Text.Add("The rest of your body is reacting to your arousal, too.", parse);
	if(player.FirstVag()) {
		parse["l"] = player.HasLegs() ? "inner thighs" : Text.Parse("[legs]", parse);
		Text.Add(" While your folds may already be wet with anticipation, you’re unable to stifle a cry, nor keep yourself from rubbing your [legs] together as a trickle of warm girl-cum breaks out of your [vag] and streaks down your [l], shamelessly staining your [skin] all over. With you all alone and your hands occupied, looks like its need is going to be unrequited for a little while, though.", parse);
	}
	if(player.FirstCock()) {
		Text.Add(" Your [cocks] jut[notS] forth from your groin, proudly erect and throbbing with pent-up desire. Twitching away like some kind of animal sniffing the air, [itThey] send[notS] urgent signals of anticipation to the back of your mind - signals that, alas, will go unheeded, even as a bead of pre forms on your [cockTip] and oozes to the ground.", parse);
	}
	Text.NL();
	
	if(milk > 0) {
		Text.Add("With all these lovely sensations welling up in you, it’s about time to get to the good stuff. Feeling for the milky weight that still remains in your [breasts], you grab one in each hand ", parse);
		if(large)
			Text.Add("as best as you can ", parse);
		Text.Add("and begin squeezing and kneading away furiously, determined to milk yourself dry. Jets of warm baby food spurt out forcefully from your [nips], only adding to the perverse pleasure you’re receiving from your moment of molestation. It feels so good, you feel like you could very well cum from this alone…", parse);
		Text.NL();
		if(preg) {
			Text.Add("…And you do. With how tender and receptive your breasts have become from their pregnant, milky swelling, hormones causing every rub and caress to be keenly felt, the sheer bliss you’re receiving from putting your increasingly delicate [breasts] to their intended use manages to set you off.", parse);
			Text.NL();

			var gen = "";
			if(player.FirstVag()) gen += "girl-cum squirting from your [vag]";
			if(player.FirstVag() && player.FirstCock()) gen += " and ";
			if(player.FirstCock()) gen += "your [cocks] blasting off stream after stream of steaming seed";
			
			parse["gen"] = Text.Parse(gen, parse);
			Text.Add("You grit your teeth, but can’t help but let out a strangled cry as the orgasm wracks your entire body, [gen]. It’s strong enough to send you staggering, and you place a hand on your [belly] to support it as you gasp for air, desperate to catch your breath and not slip in the growing puddle of sexual fluids you’ve created.", parse);
		}
		else
			Text.Add("…But you don’t. While you do come perilously close to the tipping point, leaving you weak as more and more wonderful milk leaves your [breasts], it’s not enough for you to actually orgasm from fondling your cans alone. Still, with all the steam you’ve let off from this exercise alone, your time was far from wasted here.", parse);
		Text.NL();
		Text.Add("Gradually, you drain your [breasts] to dryness, their heavy firmness that came with being filled fading away, leaving them softer and with a bit more sag than when you started. It’s no small relief, having the pressure within finally let out, and you heave a huge sigh of contentment, gulping in air to cool yourself from the heat which has suffused your body. It’s only then that you look down at the mess you’ve created.", parse);
		Text.NL();
		if(milk < 5) {
			Text.Add("It’s not too bad. Splotches of fresh cream adorn the ground here and there, but the ground’s managed to absorb most of your output. Give it a few hours or so in the sun, and the evidence of your self-milking will be largely erased from the world.", parse);
			Text.NL();
			Text.Add("Guess you didn’t have that much milk in you, but do you really want more?", parse);
		}
		else if(milk < 10) {
			Text.Add("A respectable amount of fresh, creamy lactate has been drained from your [breasts], leading to a sodden ground and small puddles of the stuff accumulating around you. It’ll take a little while for all this to dry out… a respectable amount indeed, for which you can’t help but feel a little stab of pride for.", parse);
		}
		else {
			Text.Add("Through your molestation, you’ve turned the ground about you into a marshland of milk. The ground is absolutely soaked to a ridiculous extent, and large pools of breast milk have accumulated about you, a gentle, sweet smell rising from them as they begin to slow process of drying out.", parse);
			Text.NL();
			Text.Add("It’s a little hard to believe all that actually came out of your [breasts], but the sight that lies before you is undeniable. Perhaps you should take some small pride in knowing of your extreme productivity… although there probably aren’t going to be any calls for being a wet nurse to a small army of infants any time soon.", parse);
		}
		//Drain all milk
		player.LactHandler().MilkDrainFraction(1);
	}
	else
		Text.Add("At length, though, you feel your [breasts] starting to get a little tender from the vigorous handling they’ve been given, and decide to cut it here and now than risk them actually getting sore. Giving your cans a final rub and caress, you sigh in relief at all the steam you’ve managed to blow off and prepare to be on your way.", parse);
	Text.NL();
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "";
	parse["c"] = party.Num() > 1 ? Text.Parse(" rejoining [comp] and", parse) : "";
	Text.Add("With that in mind, you collect your gear once more, putting on and doing up your [armor] before[c] setting off on your way.", parse);
	Text.Flush();
	
	var cum = player.OrgasmCum();
	
	world.TimeStep({minute: 30});
	Gui.NextPrompt();
}

/*

 */