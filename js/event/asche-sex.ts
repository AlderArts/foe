import { Text } from "../text";
import { Sex } from "../entity-sex";
import { Gui } from "../gui";
import { GAME, TimeStep } from "../GAME";

let SexScenes : any = {};

SexScenes.Prompt = function() {
	let player = GAME().player;
	var options = new Array();
	options.push({ nameStr : "Fuck her",
		tooltip : "You’ve long waited for the chance to have a go at the exotic shopkeeper.",
		func : function() {
			SexScenes.FuckHer();
		}, enabled : player.FirstCock() || player.Strapon()
	});
	options.push({ nameStr : "Give Oral",
		tooltip : "Better to give than to receive, isn’t it?",
		func : function() {
			SexScenes.GiveOral();
		}, enabled : true
	});
	options.push({ nameStr : "Get Oral",
		tooltip : "She certainly has a nice, long muzzle… wonder if her tongue’s just as good.",
		func : function() {
			SexScenes.GetOral();
		}, enabled : player.Humanoid() && (player.FirstCock() || player.FirstVag())
	});
	if(player.FirstCock()) {
		options.push({ nameStr : "Titfuck",
			tooltip : "Those ripe melons sure look soft and juicy… a verdant valley to bury your cock in.",
			func : function() {
				SexScenes.Titfuck();
			}, enabled : true
		});
	}
	options.push({ nameStr : "Milk",
		tooltip : "You’d like to sample her tits, please. Those are bound to be delicious.",
		func : function() {
			SexScenes.MilkHer();
		}, enabled : true
	});
	if(player.FirstVag()) {
		options.push({ nameStr : "Tribbing",
			tooltip : "Maybe some lady love would be nice.",
			func : function() {
				SexScenes.Tribbing();
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

SexScenes.FuckHer = function() {
	let player = GAME().player;
	let asche = GAME().asche;

	var p1cock = player.BiggestCock(null, true);
	var real = !p1cock.isStrapon;
	var knotted = p1cock.Knot();
	var longCock = p1cock.Len() > 18;
	var massiveCock = p1cock.Volume() > 750;
	
	var parse : any = {};
	
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("<i>“Ooh, customer is thinking of going for the more traditional way of giving pleasure?”</i> the jackaless coos, reaching forward to tickle your chin with a finger. <i>“Is nothing to be ashamed of, traditional just means it is being effective and enjoyable enough for many to do it over a long time. There is also being many ways of doing it, but Asche will perform the way she likes best.”</i>", parse);
	Text.NL();
	Text.Add("A mischievous smirk on her muzzle, the exotic shopkeeper slinks her way on top of you, her bangles clinking softly against her armlets as she ensures you feel every inch of her fine, luscious fur running across your [skin]. Her touch is a lover’s salacious caress, the flow of sunlight across your body, warm and golden; her freshly enhanced breasts bob and sway enticingly as she straddles you. Leaning forward, she plants a light kiss on your lips, the almost innocuous action still enough to make your head spin. You can’t help but wonder if she used any magic there - it felt strangely otherworldly, as if you were kissing and being kissed all at once…", parse);
	Text.NL();
	Text.Add("<i>“Of course Asche is being using magic,”</i> the jackaless replies, her eyes twinkling as she points down to the patterns on your bodies, now blazing with golden light. Her motions slow and deliberate, she grinds her wet cunt across your lower body, letting the first drops of her feminine nectar dampen your [skin]. <i>“Customer is going to be seeing things from this jackaless’ perspective… and she yours. Is best way to learn, to get feedback on one’s actions, yes? Now just to be letting self go and be participating as best as one can; maybe can be too much for you to handle.”</i>", parse);
	Text.NL();
	if(real) {
		if(player.NumCocks() > 1) {
			Text.Add("Asche looks over your [cocks] and makes a show of trying to decide which one to go for, acting in a manner not unlike a housewife at the market. Rubbing, testing, squeezing, sniffing, she works away at each of your shafts in turn until you’re squirming and biting back moans of pleasure.", parse);
			Text.NL();
			Text.Add("<i>“Is not very often that Asche gets to play customer,”</i> the jackaless says with a giggle, grabbing hold of your biggest dick and pumping her hand along its length in a few firm strokes, sending a cascade of tingles through your body. <i>“Asche will be picking out this one, then.”</i>", parse);
		}
		else {
			Text.Add("<i>“Hmm…”</i> Taking your [cock] in hand, Asche wraps her warm, sensual fingers about its base, sending it surging from semi-hard to painfully full. Stopping just short of your [cockTip], the jackaless teases the underside of your glans with her fingertips, then moans softly and trembles, her free hand half-reaching for a nonexistent cock between her own legs until she remembers herself and smiles.", parse);
			Text.NL();
			Text.Add("<i>“Is being excellent magic, is it not?”</i>", parse);
		}
	}
	else {
		Text.Add("Wait a moment. You don’t have your strap-on in place - oh, <i>there</i> it is in Asche’s hand, the jackaless waving it about like the toy it is.", parse);
		Text.NL();
		Text.Add("<i>“Was customer looking for this?”</i> The jackaless flashes her teeth. <i>“Asche will help you put it on, not to be worrying. Truth be told, this jackaless is not enjoying strap-ons as much as real thing, but this is customer’s reward and desire, so she is not speaking more about the subject.”</i>", parse);
		Text.NL();
		Text.Add("Asche is as good as her word. She’s clearly used to this, fitting the toy onto you and fastening it to the harness with a practiced hand before giving it a solid smack to make sure it’s securely in place.", parse);
	}
	Text.NL();
	Text.Add("Satisfied that all is in order, Asche licks a fingertip and trails it down the curve of her full breasts, a quiet yip escaping her muzzle as she gently pinches each nipple in turn.", parse);
	Text.NL();
	Text.Add("<i>“It has been a while since Asche has had proper companion to play with,”</i> the jackaless says, letting her hands wander across your body in search of a firm grip. <i>“Let us begin, then.”</i>", parse);
	Text.NL();
	parse["c"] = real ? "cock" : "strap-on";
	parse["knot"] = knotted ? ", swallowing the swell of your knot as if it were nothing" : "";
	Text.Add("With that, she lifts herself up and impales herself on you in one smooth motion, sinking down onto your [c] and letting it slip inside her with ease, her folds parting wetly to admit you[knot].", parse);
	Text.NL();
	
	Sex.Vaginal(player, asche);
	asche.FuckVag(asche.FirstVag(), p1cock, 0);
	player.Fuck(p1cock, 0);
	
	if(massiveCock) {
		Text.Add("Through all the anticipation, you’re dimly aware that by all rights, the jackaless should never have been able to take all of you right down to the hilt considering your size. Just how did she manage that feat? The world may never know.", parse);
		Text.NL();
	}
	if(real) {
		Text.Add("You squirm and shiver under the jackaless as the intense heat of her passage engulfs your shaft, pulsating and squeezing eagerly with the rhythm of her inner workings. Even as your cock explodes in pleasure, rock-hard and trying to get as deep as it can into your canine lover, you <i>feel</i> yourself receiving the pleasure you’re giving her, feel the energies running through the golden conduits painted on your body, feel yourself being penetrated and being well-fucked even as you’re doing the fucking. It’s an unearthly experience.", parse);
	}
	else {
		parse["pcskin"] = player.HasSkin() ? "s" : " " + player.SkinDesc();
		Text.Add("Even though your shaft isn’t real, you can nevertheless <i>feel</i> what it’s doing to Asche; blazing bright with golden light, the conduits painted on your body bring you pleasure seeping from the jackaless. Seeing - no, feeling - your canine lover giving in to her pleasure like that only arouses you further. Coupled with the heat of her skin on your[pcskin], the sensations form an intense wildfire that throbs and pulses against your [skin], inspiring you to work harder. The more you give, the more you get, after all.", parse);
	}
	Text.NL();
	parse["c"] = real ? "shaft" : "strap-on";
	Text.Add("Asche picks up the pace, her firm buttcheeks slapping against your groin as the jackaless pants, her muzzle stretched into a nasty, predatory grin with her tongue lolling out. Her juices ooze freely down the length of your [c], glistening in the dusky light as she rocks back and forth, gripping your waist for support.", parse);
	Text.NL();
	parse["strap"] = real ? "" : ", each thrust of your strap-on causing its base to grind against your crotch, sending ice-cold prickles running through the rest of your body where they quickly melt in the heat of mating";
	parse["len"] = longCock ? ", feeling your shaft stretch her cervix and begin its invasion of her womb" : "";
	Text.Add("You instinctively respond in kind, bliss quickly building in your groin as you go at it like rutting beasts[strap]. You piston and pound away furiously, hips bucking away on autopilot even as Asche yips needily[len]. You share in the jackaless’ delight, knowing that each and every movement you make is blowing both your brains out.", parse);
	Text.NL();
	Text.Add("Completely addled by now, her eyes rolled back into her head as she pants and yips in pure, unadulterated pleasure, Asche quivers from head to toe, causing her jewelry to clink, as the jackaless cums.", parse);
	if(longCock) {
		parse["c"] = real ? "cock" : "strap-on";
		Text.Add(" A fresh flow of feminine nectar spurts downward even as her cervix opens up enough to admit the tip of your [c], and the jackaless lets out a low, long howl as you enter the fertile confines of her womb.", parse);
	}
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	if(real) {
		Text.Add("You can’t hold back any longer yourself, not with you being pressed on one side by the intensity of Asche’s orgasm and by your own immense pleasure on the other, and send blast after blast of hot sperm flooding her insides.", parse);
		if(knotted)
			Text.Add(" Your swollen knot bottles up all that seed inside her, making sure that you don’t create a mess.", parse);
		else if(cum > 4)
			Text.Add(" Despite your enormous load, the exotic, magical jackaless manages to take it all into her without so much as blinking.", parse);
		Text.NL();
	}
	parse["c"] = real ? "softening shaft with a wet pop, your cum still smeared on her pussy" : "slick strap-on";
	Text.Add("Utterly spent and exhausted, the two of you are content to just lie against each other. Asche is slumped on top of you, her ragged breathing tickling your neck as she recovers. After what seems like forever, the jackaless finally regains enough strength to push herself off your [c].", parse);
	Text.NL();
	Text.Add("<i>“Asche thanks you for a good time,”</i> she says, a mischievous, though tired, lilt in her voice. <i>“Although experience is not the best she has had, nevertheless is still very good.</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(SexScenes.Ending);
}

SexScenes.GiveOral = function() {
	let player = GAME().player;
	let asche = GAME().asche;

	var parse : any = {
		handsomepretty : player.mfFem("handsome", "pretty"),
		heshe : player.mfFem("he", "she"),
		himher : player.mfFem("him", "her"),
		legs : function() { return player.LegsDesc(); },
		skin : function() { return player.SkinDesc(); }
	};
	
	Text.Clear();
	Text.Add("<i>“Ah, customer is understanding that is much better to be giving than receiving,”</i> Asche coos. The jackaless narrows her eyes, a naughty grin playing across her lips as she bids you roll over onto your belly even as she circles around you in slow steps, vaguely reminiscent of a predator toying with its quarry… <i>“With customer being so generous, Asche is sure that [heshe] is going to be making many friends in life, although also to be wary of those who are thinking of taking advantage of [himher].”</i>", parse);
	Text.NL();
	Text.Add("Almost as if by magic - maybe it <i>is</i> magic - Asche’s distinctive, alluring musk intensifies. Already deep and subtle, it mingles with the mint fragrance. Assaulted by this aura of sensuality, your mouth can’t help but start watering with desire as you pant aloud, trying to draw as much of it into your lungs as possible.", parse);
	Text.NL();
	Text.Add("<i>“Good, good. Customer is already learning.”</i> Coming to a stop in front of your prone form, the exotic jackaless seats herself on the ground before you and sprawls out to display herself in her full glory, propping herself up with her arms. Her soft, pink nipples, the generous, damp lips that surround her slit… why yes, that’s where the scent is coming from, and something in the back of your mind prompts you to drag yourself forth on all fours, desperate to get closer to the source of the heavenly desire that has taken hold of you.", parse);
	Text.NL();
	Text.Add("<i>“Well?”</i> Asche says, a corner of her lips quirking upwards. <i>“Is [handsomepretty] customer just going to be staring, or is [heshe] beginning already? Asche is not too fond of window shoppers who are just looking and not buying anything.”</i>", parse);
	Text.NL();
	Text.Add("Well, a little foreplay’s in order first - get her used to the idea of what your tongue can do for her before applying it in earnest. Pushing your upper body upwards in a cat stretch, you lean against the sexy jackaless, nuzzling deep into her dark golden fur. Asche whines, a sound full of comfort and contentment which is quickly cut off by a gasp when you pull back slightly, part your lips and flick a nipple with the tip of your tongue.", parse);
	Text.NL();
	Text.Add("You don’t give her any time to recover: pressing even more of your weight against Asche, you draw slow circles about her areolae with your tongue. Rhythmically moving between left and right, you paint the dark pink circles with your spit, stopping every now and then to tease the adjoining nipple, the slightly salty flavor of her skin slyly hinting at what’s to come.", parse);
	Text.NL();
	Text.Add("As you work away with your tender ministrations, you can <i>feel</i> Asche’s pleasure: each sensual jolt that runs down her spine, the rough feel of your tongue against her sensitive boobflesh, sinking deep into her being - all this and more is shared with you through the patterns of golden swirls that cover your bodies. It’s enough to force you to pause for a moment, panting wantonly while Asche writhes and squirms against you.", parse);
	Text.NL();
	Text.Add("<i>“Ah, so -”</i> the jackaless yips and moans, whatever she was about to say quickly forgotten as a wave of pleasure washes over both of you. Looking down, you see her puffy pussy clench tight, and then a squirt of girl-cum spurts forth to paint your [legs].", parse);
	Text.NL();
	Text.Add("You can’t hold yourself back any longer. Brilliant light flares up along the golden patterns on your [skin], burning brightly as you give in to your desires and lunge for the jackaless’ snatch, desperate to taste the glaze of honey on the sweet, sweet petals of her womanly flower. Asche squeals in delight as your head dives between her thighs and your tongue connects with those delicious, heat-swollen netherlips, wriggling to allow you a more comfortable position in which to pleasure her.", parse);
	Text.NL();
	
	Sex.Cunnilingus(player, asche);
	player.Fuck(null, 0);
	asche.Fuck(null, 0);
	
	Text.Add("The jackaless tastes every bit as good as you imagined she would, and you feel Asche’s hand on your head gently pushing you downwards, urging you to go further, deeper into her heat-filled passage. You resist and take your time in savoring her, running your tongue across those folds and petals, licking her clit in much the same way you did her nipples; though you eventually succumb to the desire and dive in, tasting her depths.", parse);
	Text.NL();
	Text.Add("Asche shudders with each pass of your tongue, her hips bucking, and releases yet another squirt of girl-cum at point blank into your face. That feeling, that scent… feeling the warm wetness run down your chin and drip onto the mattress, it’s all you can do to keep yourself conscious as you flick your tongue in and out of the jackaless’ dripping slit. Her insides squeeze tight about your tongue-tip in desperation, and the fact that you can feel every bit of it yourself only drives you further in your zeal to pleasure her.", parse);
	Text.NL();
	Text.Add("At last, the dam breaks. Rivulets of Asche’s sweet honey rapidly turn into a torrent as the jackaless climaxes with a howl, drenching the mattress beneath the two of you. You keep going, though, and your efforts are rewarded by a second, more intense orgasm, this time powerful enough to send you collapsing to the cum-slick mattress thanks to the sympathetic magic linking you two.", parse);
	Text.NL();
	Text.Add("Panting, heaving, both of you just lie there for a time. You feel a coolness on your face as Asche’s sweet honey dries on your [skin]. At last, the jackaless recovers enough to stand - albeit shakily - and looks down on you with a very satisfied expression on her muzzle.", parse);
	Text.Flush();
	
	Gui.NextPrompt(SexScenes.Ending);
}

SexScenes.GetOral = function() {
	let player = GAME().player;
	let asche = GAME().asche;

	var p1cock = player.BiggestCock();
	
	var parse : any = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Clear();
	Text.Add("Asche snorts, but the gesture of indignation is soon replaced with an evil smirk. <i>“This jackaless will admit… she is not fond of using her mouth, but promise is promise and Asche does not want you to think she is not experienced in this act. Fond or not is one thing, but we are all doing things we are not fond of to be getting through days, yes?”</i>", parse);
	Text.NL();
	Text.Add("With that, the exotic shopkeeper advances upon you on all fours, breasts swaying slightly as they hang low and ripe from her chest, her tongue lolling out of her maw in an effort to show you just what you’ve signed up for. It’s long and pink, glistening alluringly in the room’s dim light. It doesn’t <i>look</i> out of the ordinary, but you feel a prickle at the base of your spine telling you all is not quite as it seems.", parse);
	Text.NL();
	Text.Add("Well, if she’s going to give you a surprise, it doesn’t seem like it’s going to be a nasty one, judging by the teasing twinkle in the jackaless’ eye. Content to wait for the show to begin, you slump back into the gloriously soft sheets, letting your muscles go limp.", parse);
	Text.NL();
	Text.Add("<i>“Mm, that is right,”</i> the jackaless croons. <i>“Just to be relaxing and letting Asche work her magic on you…“</i>", parse);
	Text.NL();
	if(p1cock) {
		var volume = p1cock.Volume();
		var knotted = p1cock.Knot();
		var longCock = p1cock.Len() > 18;
		
		Text.Add("Slinking up to you, Asche grabs hold of your thighs, one in each hand, and pulls them apart with surprising strength. The jackaless eyes your crotch and the [cocks] on offer, kneading the gentle flesh of your inner thighs as her fingers creep ever closer to your shaft[s].", parse);
		Text.NL();
		if(volume < 150) {
			Text.Add("Taking in the sight of your puny man-meat, the jackaless can’t help but roll her eyes and shake her head. <i>“Oh, whatever is Asche to be doing with you,”</i> she says with a sigh. <i>“Is not even enough to be making a morsel, if this jackaless is to be honest - no wonder you are needing to be asking for this!”</i>", parse);
		}
		else if(volume < 500) {
			parse["biggest"] = player.NumCocks() > 1 ? " biggest" : "";
			parse["knot"] = knotted ? " with its knot" : "";
			Text.Add("Looking over the size of your[biggest] man-meat[knot], the jackaless narrows her eyes and smirks. <i>“Ooh, customer is having nice sausage, just right size for this jackaless to be fitting inside mouth. Maybe it will be so tasty that she cannot help but be biting down and swallowing, hmm?”</i>", parse);
			Text.NL();
			Text.Add("You find your gaze drawn towards the jackaless’ muzzle. Odd, how you never noticed how sharp her teeth were, or the sheer <i>number</i> of them…", parse);
			Text.NL();
			Text.Add("Asche laughs. <i>“All the better to be sucking customer off with. Do not worry, Asche was just joking about biting off customer’s cock - is bad business to be doing so. Does not mean Asche does not have bad sense of humor, though.”</i>", parse);
		}
		else {
			Text.Add("Eyeing your massive man-meat, the jackaless’ muzzle splits into a mischievous grin. <i>“Mm, so customer is thinking that having such a big bone is going to be testing this jackaless? Trying to get her to be biting off more than she can be chewing? Asche accepts customer’s challenge, then; let us see if there is more to this jackaless than meets the eye…”</i>", parse);
		}
		Text.NL();
		parse["v"] = player.FirstVag() ? " and pussy dripping" : "";
		Text.Add("With a blur of motion and clink of jewelry, she’s on you. The jackaless’ smooth, golden fur slides against your [skin] as she settles into place, her maw opening wide to take your shaft. If you weren’t hard before, you are now; there’s something about her touch that you hadn’t noticed before, an unbelievably sensual quality to her that has your cock[s] at attention[v] as muzzle meets man-meat.", parse);
		if(volume > 750) {
			parse["b"] = player.NumCocks() > 1 ? " the biggest and thickest of" : "";
			Text.Add(" Further and further she impales herself onto[b] your shaft[s], your entire length slipping into her mouth and down her throat without so much as a hitch. It should be impossible. It’s got to be impossible; she couldn’t have swallowed you down to the hilt - and yet the jackaless has. Spirits above, you can <i>feel</i> her marvelously warm and wet insides milking away at your [cock].", parse);
		}
		Text.NL();
		
		Sex.Blowjob(asche, player);
		asche.FuckOral(asche.Mouth(), p1cock, 0);
		player.Fuck(p1cock, 0);
		
		if(player.NumCocks() > 1) {
			parse["c"] = player.NumCocks() == 2 ? "your remaining shaft" :
			             player.NumCocks() == 3 ? "your remaining shafts" :
			             "two of your remaining shafts";
			parse["c2"] = longCock ? "in tandem with her throat" : "away";
			Text.Add("At the same time, her hands wrap around [c], working [c2] as she begins to jerk and suck you off with fluid, rhythmic motions of her body.", parse);
			Text.NL();
		}
		Text.Add("That is just the beginning, though. The golden patterns on your bodies burn with light as your arousal continues to surge, and - oh, is that the taste of…? Why yes, it is; all of a sudden, you’re fully aware of your own shaft filling your - no, Asche’s - mouth, of the salty dripping of pre down your throat, of the tender workings of your tongue as it coils about and wrestles with your cock -", parse);
		Text.NL();
		parse["c"] = longCock ? " even as her throat pumps and undulates about its girth, unsure what to do" : "";
		Text.Add("No, you have to remember, it’s Asche who’s blowing you, not the other way round, but it’s hard to tell the difference with whatever magic Asche’s worked to join you two. The exotic shopkeeper is definitely enjoying the sensations she’s deriving from you; her whorish moans of delight may be muffled by your [cock] in her maw, but the way her body trembles doesn’t lie; she feels coiled like a spring, pressed tight and ready to release. Another wave of exquisite sensations crashes into your being, your shaft so attuned to receiving pleasure that you can <i>feel</i> the jackaless’ breath huffing and whistling around it[c].", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		
		Text.Add("It’s not long before your pleasure reaches its peak. Despite your best efforts to hold on, you can feel your cum welling up, a hot, sticky geyser ready to blow. ", parse);
		if(cum > 4) {
			Text.Add("And blow it does, the entirety of your enormous, hot sticky load pouring down Asche’s throat like water gushing from a freshly broken dam. Asche shakes her head from side to side, her muffled cries growing louder, and as you are treated to the first-hand experience of swallowing so much of your own hot, sticky cum, you sure can sympathize.", parse);
			Text.NL();
			Text.Add("Despite how much cum’s pouring down her throat, though, Asche doesn’t bloat any, her tummy staying nice and flat. More highlander hexing, perhaps - well, all the better, since you’re going to give her all you’ve got. The jackaless convulses with unfettered delight, once, twice, and then one last time as you send your final spurt of slimy seed into her stomach.", parse);
		}
		else {
			Text.Add("You can feel the force of your first shot of hot sperm as it hits the roof of Asche’s mouth, slipping and sliding its way down to her stomach - and you’re privy to every moment of it. Caught in the throes of orgasm, you empty what cum you have into the jackaless, blasting away with wanton abandon as your exotic lover moans like a sated slut, her eyes blank as her body works away on automatic. Her tongue continues to work away even as her head pistons along your length, giving you a well-earned slice of heaven.", parse);
		}
		Text.NL();
		if(player.NumCocks() > 1) {
			Text.Add("Alas, your other shaft[s] have only Asche’s handjobs to work off, but they still do their best to match the glorious display that the one in her maw has put forth. Strings and ropes of gooey seed blast forth and arc in the air, falling down, down, down to splatter all over the jackaless’ arms and back, quite literally topping off your pleasure.", parse);
			Text.NL();
		}
		Text.Add("Exhausted and utterly spent, Asche sinks to the mattress with a soft squelch of matted fur and sexual fluids, and it’s a while before she manages to wriggle enough to pull your [cock] out of her mouth, a thin sticky thread still connecting the two before it finally oozes away.", parse);
	}
	else if(player.FirstVag()) {
		Text.Add("With one swift motion, Asche grabs hold of your inner thighs, one in each hand, and forces them apart to expose your bare muff and the [vag] nestled between your legs. Trailing her hands along your thighs before returning them to her sides, the exotic jackaless begins to rub herself before your eyes, one hand teasing her increasingly damp slit while the other roams around the rest of her body, touching breast and belly alike in long, languid strokes.", parse);
		Text.NL();
		Text.Add("The golden paint on both your bodies flares up with light, and then waves of pleasure crash into you, despite the fact that you’re scarcely being touched. Whatever Asche does to herself, it’s as if it’s being done to you as well: when she gives her clit a gentle flick, you feel her invisible fingers against your [clit], you squirm and moan under her tender caresses - even as she does the same. It’s not long before the jackaless has you dripping all over and panting like a slutty little thing, and the real fun hasn’t even started yet!", parse);
		Text.NL();
		Text.Add("<i>“Ah-ha, so magic pattern is indeed working very nicely,”</i> Asche manages to choke out in between lust-filled pants. <i>“Customer is feeling everything Asche is feeling, and Asche is getting very important feedback on customer’s pleasure while she is working to service customer as best as she can. Now…”</i>", parse);
		Text.NL();
		Text.Add("Without warning, the jackaless dives lightning-quick towards you, her muzzle burying itself in your crotch with a soft squelch of juices. Her nose and tongue share the workload of getting you all nice and lusty; the former grinds against your [clit], sending sparks of sensation racing along the golden lines traced on your body, then she tilts her head back and sends the latter probing like a lewd, long tentacle into your heat-filled slit.", parse);
		Text.NL();
		
		Sex.Cunnilingus(asche, player);
		asche.Fuck(null, 0);
		player.Fuck(null, 0);
		
		Text.Add("Asche wasn’t exaggerating, either; the jackaless <i>is</i> sharing your sensations, her entire body trembling from head to toe each time she delves into your cunt, her tongue seemingly impossibly long. Between her spread legs, a thin trickle of girl-cum oozes from the petals of her womanly flower, soiling the sheets. The trickle bursts forth in a squirt with each crashing high of orgasmic pleasure she inflicts upon you.", parse);
		Text.NL();
		Text.Add("How? How is it possible? To your lust-addled eyes, her tongue is as normal as can be, but when it's inside you… you’re wracked with a medley of exquisite sensations once more, and this time you’re almost certain that she hit your cervix. Your inner walls clench down hard on the intrusion they’re certain must be there, but end up catching nothing.", parse);
		Text.NL();
		Text.Add("Despite her impressive efforts, you’re not one for passively receiving. Gently but firmly, you place a hand between Asche’s shoulder blades and push the jackaless down, low enough that her nipples graze the mattress’ silken fabric as she laps at your cunt. The rocking motions, the rhythmic teasing of her - no, of <i>your</i> teats - getting even stiffer and more swollen by the moment - ", parse);
		Text.NL();
		Text.Add("You can’t hold back any longer. Throwing your head back and crying out in climax, you send a squirm of thick nectar straight into Asche’s face, soaking her muzzle. Sharing in your orgasm, the exotic shopkeeper collapses onto her belly, landing straight in a pool of her own sexual fluids as she convulses with delight.", parse);
	}
	Text.NL();
	Text.Add("It’s a while before either of you can muster the energy to so much as speak, and a good ten or fifteen minutes before Asche recovers enough to so much as lift her head off the mattress and let out a long, salacious moan.", parse);
	Text.Flush();
	
	Gui.NextPrompt(SexScenes.Ending);
}

SexScenes.Titfuck = function() {
	let player = GAME().player;

	var p1cock = player.BiggestCock();
	var longCock = p1cock.Len() > 28;
	
	var parse : any = {
		heshe : player.mfFem("he", "she")
	};
	parse = player.ParserTags(parse);
	
	var mc = player.NumCocks() > 1;
	
	Text.Clear();
	Text.Add("<i>“Ooh, customer is wishing to have fun with these things, yes?”</i> Asche coos as she cups her breasts, each hand almost - the key word here being almost - able to engulf her firm and perky lady lumps. <i>“Is good thing that [heshe] just made them all better just before using them, yes. Feeling like this, Asche is reminded of time when she is just becoming woman, yes.”</i>", parse);
	Text.NL();
	parse["c"] = mc ? "one of your stiff, strapping members" : Text.Parse("your stiff [cock]", parse);
	Text.Add("Her movements deft and nimble, each motion accentuating the loveliness of her improved curves, the jackaless gets down on all fours before your prone body, her breasts hanging low and heavy just above [c]. So close, so close… then one of her nipples grazes your [cockTip], merely the slightest of touches, but it’s more than enough; flickers of light play along the golden pattern on your [skin], bringing with them the pleasure she’s giving you.", parse);
	Text.NL();
	Text.Add("<i>“Ah, so you are feeling it too,”</i> the jackaless says with a sly grin. <i>“Good to know magic is working right - now maybe customer is wanting a little more?”</i>", parse);
	Text.NL();
	parse["c"] = mc ? "her chosen" : "your";
	Text.Add("Without waiting for your reply, Asche sinks down onto you, leaning the weight of her upper body onto your hips and [thighs] as she sandwiches [c] shaft well between her generous mounds. Warm boobflesh flows around your cock like scented oil with much the same result - you become distinctly aware of how painfully engorged your penis is, throbbing against the gentle pulsing and heaving of the jackaless’ breasts.", parse);
	Text.NL();
	Text.Add("One thing’s for sure: Asche knows how to take charge. The patterns on your bodies blaze with golden light as she begins in earnest, sliding herself up and down along the length of your member in a languid cat stretch, making sure the undersides of her boobs meet the base of your shaft before pushing herself upwards as far as she can go.", parse);
	if(longCock)
		Text.Add(" While her boobs aren’t quite enough to service the entirety of your huge member, she more than makes up for it with her hands and arms. The exquisite sensations of the jackaless’ fur brushing against your [cockTip] are a small slice of golden heaven as she displays a surprising degree of flexibility in jerking you off at the same time.", parse);
	Text.NL();
	Text.Add("You aren’t - or at least, your body - isn’t content to just lie around and let Asche do all the work. Surging ahead with a life of their own, your hips begin pistoning away through the warm boobflesh that encases them. Firm with just the slightest amount of give, her breasts roll and heave… the jackaless is content to just lean against you for a moment, moaning softly each time her fat, dark nipples brush against your [skin].", parse);
	Text.NL();
	parse["sl"] = player.sexlevel > 3 ? ", despite your significant experience with matters carnal" : "";
	Text.Add("It’s an unreal sensation, the way the golden patterns on your bodies help amplify the pleasure that you’re receiving from Asche. Flares of heat and orgasmic pleasure send shivers through your flesh as they run from your nipples and down the entire length of your body. With such stimulation, it’s not long before you begin to feel yourself give in[sl]. With a cry that rings in the small back room, you buck your hips one last time and release your sweet, sweet seed, feeling it course through your [cock] before finally bursting into the world.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	if(cum > 4) {
		Text.Add("A veritable geyser of cum blasts from your [cockTip], the torrential stream of hot sperm enough to make Asche yip in surprise and pleasure. Thanks to the jackaless’ magic, you both share the orgasm, and you’re reduced to a writhing, mewling wreck; your cum arcs beautifully in the air before raining down on the two of you, splattering Asche’s face, breasts, back - all of her, really - with warm globs of seed.", parse);
		Text.NL();
		Text.Add("Yet her firm milk-makers keep your rock-hard shaft firmly anchored throughout your release, only permitting its escape after you’ve expelled every last drop of seed.", parse);
	}
	else {
		Text.Add("You gasp as the full effect of Asche’s magic hits you; your orgasm is transmitted and magnified by the golden conduits on your body, turning your entire being into a tool designed to receive pleasure.", parse);
	}
	Text.NL();
	Text.Add("Grinning at you, the sexy, exotic shopkeeper lifts herself into a kneeling position and starts to fondle her breasts, slathering your cum all over her fur until it’s a slick, matted mess, drawing small circles around her dark, fat nipples as she shivers with magically enhanced pleasure.", parse);
	Text.Flush();
	
	Gui.NextPrompt(SexScenes.Ending);
}

SexScenes.MilkHer = function() {
	let player = GAME().player;

	var parse : any = {
		heshe : player.mfFem("he", "she"),
		nips : player.FirstBreastRow().NipsShort(),
		handsomepretty : player.mfFem("handsome", "pretty"),
		HandsomePretty : player.mfFem("Handsome", "Pretty"),
		foot : player.FootDesc()
	};
	
	Text.Clear();
	Text.Add("<i>“Ooh, customer is wishing to have fun with these things, yes?”</i> Asche coos as she cups her breasts, each hand almost - the key word here being almost - able to engulf her firm and perky lady lumps. <i>“Is good thing that [heshe] just made them all better just before using them, yes. Feeling like this, Asche is reminded of time when she is just becoming woman, yes.”</i>", parse);
	Text.NL();
	Text.Add("Eyeing you like a predator on the prowl, Asche lowers herself to all fours and clambers over you until the two of you are face to face. Judging by the sly grin on her muzzle, you must look quite the delicious morsel to her. Inevitably, your gaze is drawn downward to her breasts hanging full and heavy from her chest, the ripe, lush milk-makers bobbing up and down ever so slightly with the jackaless’ movements.", parse);
	Text.NL();
	Text.Add("Is it your imagination? No, the golden patterns on her fur are flaring to life as she lowers her face to yours, close enough that you can feel her breath. Her nipples graze your own [nips], and you can just catch a glimpse - or so you imagine - of the jackaless’ wide, dark areolae beneath her fur…", parse);
	Text.NL();
	Text.Add("<i>“Does [handsomepretty] customer want to sample Asche’s new tits? Is much deserving of it, since customer helped make them so plump and firm. Asche is not minding if you are taking more than small sample, she is having free flow here.”</i>", parse);
	Text.NL();
	Text.Add("Yes… yes, you wanted this, else you wouldn’t have said so, right?", parse);
	Text.NL();
	Text.Add("<i>“Then just to be closing eyes and feeling the magic, [handsomepretty] customer.”</i> With that, the jackaless licks her lips, then presses them against yours in a powerful kiss. Her tongue invades your mouth, slipping in with practiced ease and finding your own to wrestle with. The exotic shopkeeper’s breath is so deliciously hot, and the way her scent and breath mix with the mint smell of the room is divine…", parse);
	Text.NL();
	Text.Add("There’s a faint tension in the air as she finally releases you from her kiss, a sense of magic being worked…", parse);
	Text.NL();
	Text.Add("As you watch, Asche’s already generous breasts begin to swell even further, growing even heavier until they begin to overcome even the jackaless’ natural firmness and sag gently. The jackaless squirms atop you, ripples of pleasure coursing through her body as the spell takes hold - then passing into you where the patterns of golden paint on your bodies meet. You begin to gasp and moan, sensing what she senses - your, no, <i>her</i> milk makers filling with rich, nourishing cream. Unable to hold back as the pleasure intensifies, you yowl along with her in pure, unadulterated lust as her areolae and nipples swell, changes far beyond what would normally occur during a full pregnancy taking place in a matter of moments. You can see them plumping, darkening, becoming more prominent - and finally a bead of milk wells up on each fat little nub of flesh as production threatens to exceed capacity.", parse);
	Text.NL();
	Text.Add("<i>“Asche is delighted!”</i> the jackaless exclaims, having trouble articulating herself properly as she pants like a bitch in heat. A final shudder runs through her form - and yours too, of course - as the beads come faster and fatter until the dam bursts and she’s got two trickles of milk running down the curve of her breasts. <i>“[HandsomePretty] customer is a very special person; spell has never worked this well before. Asche is insisting that customer is to be drinking up as reward for being such a willing participant.”</i>", parse);
	Text.NL();
	Text.Add("You don’t need to be told twice. Tilting your head up, you latch onto the exotic jackaless’ left breast with all the thirst and eagerness of a newborn babe, more than willing to relieve her of her burden of delectable cream. Sucking away rhythmically, you elicit soft yips of ecstasy from Asche as your tongue toys with her stiff nipple. Her milk is thick and sweet, and you gladly drink your fill.", parse);
	Text.NL();
	Text.Add("A slick wetness drips onto your stomach, quickly followed by an almost crippling wave of pleasure, and you catch a glimpse of Asche pumping a hand into the fertile mound of her snatch, her glistening girl-cum dripping and squelching as she pistons her fingers in and out.", parse);
	Text.NL();
	Text.Add("Suckling and being suckled yourself in one movement, feeling the pleasure of another… one wonders what other kinds of kinky stuff people get up to in the Highlands. Asche’s left breast is far from emptied, but at least it isn’t leaking anymore, having shrunk ever so slightly at being relieved - breaking free with an audible pop, you turn your attentions to her right breast, eliciting another round of delighted yipping and writhing from the jackaless.", parse);
	Text.NL();
	Text.Add("Gradually, you become aware of a growing urgency through the relentless assault of touch, taste and smell. You’re not exactly sure what it is, but that question’s answered soon enough when Asche stiffens, and squirt after squirt of girl-cum splatters onto your belly, the golden patterns on both your bodies burning with intense light. Arching her back, the jackaless pulls herself free of you, milk spattering all over the mattress, her, and you…", parse);
	Text.NL();
	Text.Add("You cry out as well, sharing her pleasure and riding her orgasm, and tremble from head to [foot] before finally going limp, as utterly exhausted as your sexy, exotic lover is. You lie against each other for a few minutes, utterly winded, until Asche shakily pushes herself off you, a big, silly grin on her face.", parse);
	Text.Flush();
	
	Gui.NextPrompt(SexScenes.Ending);
}

SexScenes.Tribbing = function() {
	let player = GAME().player;

	var parse : any = {
		heshe : player.mfFem("he", "she"),
		hisher : player.mfFem("his", "her")
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Clear();
	Text.Add("<i>“Oh, so customer is being big fan of lady love?”</i> the sexy shopkeeper whispers, her voice sultry and seductive. <i>“Is being all right, Asche is also big fan of many things, so customer is being assured that [heshe] is in good hands.”</i>", parse);
	Text.NL();
	parse["c"] = player.FirstCock() ? Text.Parse(", pressing your shaft[s] against your stomach and getting [itThem] out of the way", parse) : "";
	Text.Add("Limber as a mongoose, the jackaless practically flows up to you, making extra effort to waggle her broad, breeding-worthy hips as she closes the distance between your bodies. A wide, predatory grin plastered on her muzzle, she presses down on you, pinning you to the mattress with all four limbs while her hips descend squarely upon yours[c]. Stretching like a cat, her back arched, Asche grinds her moist and swollen pussy lips against yours in one fluid movement, making you squirm under her as unexpected sensations rush into your body to join the tingles of pleasure coursing through you.", parse);
	Text.NL();
	Text.Add("<i>“Ah, so spell is working right,”</i> Asche says with a giggle. <i>“Customer is feeling this jackaless’ pleasure in addition to [hisher] own. Can be learning much from feedback - if you are having hands free, maybe I am asking you to be taking notes, yes? Possibly there will be test next time, so Asche is expecting customer to be studying and practicing hard.”</i>", parse);
	Text.NL();
	Text.Add("Slowly, the jackaless lowers her face to yours until the tip of her muzzle is almost touching your nose. The scent of her slightly musky breath is absolutely divine when mixed with the mint scent of the room, and her dark, almond-shaped eyes grow to become the entirety of your world. Flowing from her shoulders and swaying in the room’s dim light, Asche’s dirty blond hair contrasts perfectly with her deep golden fur, as both tickle and tease away, ever at the edge of your touch.", parse);
	Text.NL();
	Text.Add("The patterns on both your bodies flare up into brilliant gold as Asche presses her lips to yours in a light kiss. Nothing heavy, just a quick peck, and yet you feel heat growing in your cheeks and just above your [breasts], a liquid heat that throbs and bubbles under your [skin]. Is this part of the magic?", parse);
	Text.NL();
	parse["l"] = player.HasLegs() ? "your thighs apart" : "you into an open position";
	parse["c"] = player.FirstCock() ? Text.Parse("your cock[s] becoming painfully hard, ", parse) : "";
	Text.Add("Your question’s answered when Asche begins in earnest, moistness turning into eager wetness as she pulls [l] and grinds away like a bitch in heat, the petals of her womanly flower spreading and meeting yours with a lewd squishing sound. Submitting to the pleasure the jackaless is bestowing upon you, your body responds in kind. You become vaguely aware of your nether lips pulsing away, [c]your nipples swelling and stiffening -", parse);
	Text.NL();
	parse["c"] = player.FirstCock() ? Text.Parse(", your cock[s] flopping about and spattering pre-cum all over your belly with all the vigorous motions you’re making", parse) : "";
	parse["cl"] = player.FirstVag().clitCock ? "" : Text.Parse(", nudging and teasing your [clit]", parse);
	parse["cl2"] = player.FirstVag().clitCock ? " loins" : Text.Parse(" [clit]", parse);
	Text.Add("<i>“Customer is having such a tender, delicious body,”</i> Asche says with a grin, her breathing labored. <i>“Asche could be eating her up - in manner of speech, of course.”</i> Wasting no time in taking advantage of your readiness, the jackaless rubs and twists your nipples as she doubly redoubles her efforts. A moan escapes your lips as you feel her engorged clit slipping against your [vag][cl]. Even as you’re being penetrated in this manner, though, tingles of sensation burn along the golden conduits on your body, gathering in your[cl2] and letting you know just what Asche is feeling right now. Encouraged by the fact that you know the jackaless is enjoying this just as much as you are, you put in just that much more effort into creating a satisfying ride for her hips[c].", parse);
	Text.NL();
	parse["cl3"] = player.FirstVag().clitCock ? "A" : Text.Parse("Each time your swollen [clit] passes Asche's, a", parse);
	Text.Add("[cl3] shudder of pleasure runs through your very being, compounded by the empathic magic that the jackaless worked upon both your bodies. The heat flowing from her loins pervades every part of your being, coursing through your veins and setting the petals of your womanly flower alight. The mattress beneath you is already slick with a puddle of your combined girl-cum, and trapped as you are under Asche, all you can do is squirm and struggle in the throes of pleasure as the exotic shopkeeper yips and whines atop you, the fur about her crotch and thighs matted with the same glistening mixture. Her grand breasts bounce rhythmically on her chest each time she rocks against you, slapping firmly against her chest - up and down, up and down, the movement almost hypnotic.", parse);
	Text.NL();
	parse["c"] = player.FirstCock() ? Text.Parse(", your cock[s] releasing [itsTheir] load[s] all over the place in strings and spurts", parse) : "";
	Text.Add("Slurp. Slurp. Slurp. Each connection made with a satisfyingly wet noise of orgiastic lust, each pull away leaving strands and beads of feminine nectar connecting your bodies. You can’t hold on long, and your orgasm is unexpectedly sudden and intense when it does come, the insides of your [vag] clenching about nothing in painful tightness[c]. The exotic shopkeeper isn’t too far behind you - throwing her head back and letting out a sound between a howl and a snarl, she reaches her peak as well. A squirt of clear juices splatters all across your crotch, dropping down your muff and mixing with your own in the most wonderful mess you’ve made in some time.", parse);
	Text.NL();
	Text.Add("Too dazed and addled to so much as move herself for the moment, Asche slumps atop you, the pulse and ebb of your intermeshed cunts setting you both down gently from your climaxes while you catch your breath. Gradually, the light from the golden patterns on your bodies fades away, and Asche manages to summon enough strength to stand, albeit shakily.", parse);
	Text.Flush();
	
	Gui.NextPrompt(SexScenes.Ending);
}

SexScenes.Ending = function() {
	let player = GAME().player;

	var parse : any = {
		
	};
	
	
	Text.Clear();
	Text.Add("<i>“So, did customer enjoy lesson?”</i> the jackaless purrs, her voice rich and honeyed as she begins the arduous task of cleaning herself up. <i>“Asche hopes that you found new insights as result of new experience.”</i>", parse);
	Text.NL();
	Text.Add("You manage to summon just enough strength to nod. Being able to feel your partner’s body that way, each and every part of your body linked together, joined in unison… ", parse);
	if(player.sexlevel >= 4)
		Text.Add("as experienced as you are in carnal matters, you still think you’ve gleaned something from being able to see both perspectives at the same time. It’s definitely an educational experience, to say the least.", parse);
	else
		Text.Add("yes, you definitely feel like you understand your actions and their results more, and perhaps with a little effort, can put that knowledge into giving and receiving pleasure.", parse);
	Text.NL();
	Text.Add("The jackaless smiles, her eyes lighting up with eagerness like an enthusiastic puppy. <i>“Asche is glad she can be helping customer, also is happy she is repaying debt of customer bringing her alchemical reagent. Now, this jackaless is thinking that you may be wanting to be washing self, so there is rain barrel and drain further in the back. Please to be remembering to clean off pattern from self, because while opening self in fashion like this is bringing great pleasure, can also be dangerous when not controlled.”</i>", parse);
	Text.NL();
	Text.Add("You manage another nod and sink back into the mattress to catch your breath, your eyes still on Asche as she slinks off, letting you get one last glimpse of her tail nestled atop that delectable round butt before the door clicks behind her.", parse);
	Text.Flush();
	
	player.AddSexExp(25);
	
	TimeStep({hour: 2});
	
	Gui.NextPrompt();
}

SexScenes.MagicalThreesome = function() {
	let player = GAME().player;
	let asche = GAME().asche;

	var p1cock = player.BiggestCock();
	
	var parse : any = {
		lowerarmordesc : player.LowerArmorDesc(),
		upperarmordesc : player.ArmorDesc(),
		handsomepretty : player.mfFem("handsome", "pretty")
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	Text.Clear();
	Text.Add("<i>“Ah-ha.”</i> Asche’s muzzle splits into a wide, predatory grin, and a tiny voice in the back of your head openly wonders what you’ve gotten yourself into this time. She looks happy… inordinately happy. <i>“Asche was sure that brave and adventurous customer would be more than willing to help with assaying of merchandise.”</i>", parse);
	Text.NL();
	Text.Add("Now that you’ve agreed to this… what do you need to do?", parse);
	Text.NL();
	Text.Add("In response to your question, Asche reaches under the counter and pulls out a small necklace, a small red gem in a diamond cut threaded by a fine golden chain. <i>“Simply to be going into back room - you are knowing where it is - and waiting a little bit by the mattress. This jackaless will be following you soon; she is needing to be making sure that magic of amulet is not harmful, then to be locking up shop.”</i>", parse);
	Text.NL();
	Text.Add("Well, <i>that’s</i> reassuring. Still, she hasn’t stayed in this line of work for so long by being careless. Pushing past the counter, you head into the shop’s back room and settle down by the mattress as instructed, waiting for Asche to arrive. The scent of mint and jasmine in the air helps you relax somewhat, and before long, you hear the doorknob turn.", parse);
	Text.NL();
	Text.Add("<i>“Sorry to be keeping customer waiting, but this jackaless is being amazed too.”</i>", parse);
	Text.NL();
	Text.Add("You turn your head, and draw a sharp breath as not one, but <i>two</i> glorious versions of Asche step into the back room, each one stark naked save for their copious jewelery, glinting in the dim light. Identical too - if you don’t count the fact that only one of the Asches has the jeweled pendant about her neck, the stone nestled snugly in her cleavage.", parse);
	Text.NL();
	Text.Add("<i>“Is it being quite odd…”</i>", parse);
	Text.NL();
	Text.Add("<i>“…To be hearing oneself speaking like this.”</i>", parse);
	Text.NL();
	Text.Add("<i>“But not to be worrying, is just illusion.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Very good illusion…”</i>", parse);
	Text.NL();
	Text.Add("<i>“…But illusion nonetheless.”</i>", parse);
	Text.NL();
	//TODO ARMOR
	parse["f"] = player.HasLegs() ? " to your feet" : "";
	Text.Add("Moving slowly like predators stalking a particularly juicy morsel, the two Asches work in tandem to flank you, one slinking up[f] to go for your [lowerarmordesc] while the other busies herself with undoing your [upperarmordesc]. You have to admit, one Asche was already good enough, but the possibilities that <i>two</i> of them bring to the table do indeed have some merit to them… well, let’s see if you do indeed get double the enjoyment out of this.", parse);
	Text.NL();
	parse["t"] = player.MuscleTone() > .5 ? "toned chest" : Text.Parse("[breasts]", parse);
	Text.Add("As one, the two Asches give a strong tug, rendering you as naked as they are in one fell swoop. Tossing your things aside, they waste no time in getting to work; one of them presses her lips to yours, hands running up and down your [t] while the other worms her way down to your groin, hands grabbing your [hips] for support as ", parse);
	parse["biggest"] = player.NumCocks() > 1 ? " biggest" : "";
	if(player.FirstCock()) {
		Text.Add("her muzzle engulfs your[biggest] cock and her head starts pistoning up and down in barely restrained lust.", parse);
		
		Sex.Blowjob(asche, player);
		asche.FuckOral(asche.Mouth(), p1cock, 0);
		player.Fuck(p1cock, 0);
	}
	else {//vag
		Text.Add("she noses at your mound, her muzzle probing for your most intimate place, and licking away like a puppy at peanut butter when she does find it.", parse);
		
		Sex.Cunnilingus(asche, player);
		asche.Fuck(null, 0);
		player.Fuck(null, 0);
	}
	Text.NL();
	Text.Add("Asche’s lips taste inexplicably of honey, a faint flavor lingering on the edge of your senses, and you wonder if this is yet another facet of the illusion you’re being presented with. Well, she’s right in that it’s a damned good illusion - whoever heard of a threesome with only two participants?", parse);
	Text.NL();
	Text.Add("<i>“Oh, even now Asche is thinking that she will be selling this toy for far more than what she is originally intending. She is being seeing so many uses for such a thing,”</i> top-Asche whispers into your ear as she straddles your waist, hands firmly planted on your chest with her palms centered on your [breasts]. For emphasis, she showers a number of kisses up your jawline, then tops it off by planting a firm smooch on your forehead. Bottom-Asche gives a few muffled yips in agreement, and doubly redoubles her attempts to pleasure you.", parse);
	Text.NL();
	if(player.MuscleTone() > .5) {
		Text.Add("Seeing an opening, top-Asche leans forward over your chest, placing her hands on your shoulders and kneading your muscles with your fingers. Her hands move down your arms, her magical touch loosening knots and dissolving aches, and the further she proceeds, the more the jackaless’ predatory grin widens.", parse);
		Text.NL();
		Text.Add("<i>“Ooh, [handsomepretty] customer is being a powerful one, yes yes,”</i> she coos, leaning forward to rub her face and breasts against you in a lazy cat stretch. <i>“This jackaless is most definitely liking, very, very much so.</i>", parse);
		Text.NL();
	}
	Text.Add("<i>“Now, maybe to be putting face to good use? As saying goes, is better to be giving than receiving, but now is being no reason why cannot be doing both at same time.”</i>", parse);
	Text.NL();
	parse["gen"] = player.FirstCock() ? "more and more of her magical mouth is filled by your ever-stiffening shaft" : "a fresh river of your feminine honey gushes from your slit and wets her muzzle";
	Text.Add("Without waiting for your response, top-Asche scoots forward with a sultry glint in her eyes blatantly thrusting her crotch toward you. The overwhelming musk of her slick and puffy pussy lips, framed against her golden-brown fur, soon has you panting and squirming under her; down below, bottom-Asche lets out an urgent moan of ecstasy as [gen].", parse);
	Text.NL();
	Text.Add("Well, it’s only polite to repay the favor - to be frank, she’s doing you one, allowing you to service that beautiful cunt of hers and all. Without hesitation, you push your face forward, tongue darting out to part the heat-swollen folds of Asche’s womanly flower. Both jackalesses shudder at the motion, and top-Asche begins grinding her mound against your face vigorously, her hips instinctively mashing against you in a bid to take as much of your [tongue] into her as possible.", parse);
	if(player.LongTongue())
		Text.Add(" Happily, it's well equipped to do just that - it penetrates her well and deeply, and is quickly rewarded with the squeeze and pull of her inner walls, soft, moist flesh against more of the same.", parse);
	Text.NL();
	parse["gen"] = player.FirstCock() ? "sucks you off" : "eats you out";
	Text.Add("With double the pleasure coursing through your bodies, it doesn’t take long for your movements to grow more and more intense. For some reason, bottom-Asche’s golden-brown hair on your [skin] feels positively exquisite - the way it moves on your [thighs] as she [gen], her head rapidly bobbing back and forth, is beyond words.", parse);
	Text.NL();
	Text.Add("The excited, pulsing warmth deep within you is writhing, seeking release, and comes dangerously close when you feel bottom-Asche’s fingers work their way between you and the mattress, probing your ass cheeks for your back door. They find it soon enough, and you shudder as she slides a furry digit in, your sphincter clenching tight about the welcome intruder.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	Text.Add("Time to up the ante yourself. Withdrawing momentarily from top-Asche, you run the tip of your [tongue] across her outer lips, seeking that tiny nub of flesh you know is there - and when you do find it, giving it a flick with your [tongueTip]. That’s enough to push Asche over the edge - with a loud howl, top-Asche throws back her head and grabs at your neck as she convulses atop you, pussy juice squirting from her love-hole as orgasm wracks her body. Bottom-Asche ", parse);
	if(player.FirstCock()) {
		parse["mc"] = player.NumCocks() > 1 ? Text.Parse(", although that which erupts from your other shaft[s2] gets all over her, in her hair and onto the mattress, painting the whole lot in a generous layer of jizz", parse) : "";
		Text.Add("finishes sucking you off, and as your [hips] buck and thrust in her throat, easily swallowing all the cum you’ve on offer[mc].", parse);
	}
	else
		Text.Add("nuzzles aggressively at your cunt once more, and is barely able to keep your [legs] pinned as you have your own orgasm, femcum practically blasting onto her muzzle in the throes of your pleasure.", parse);
	Text.NL();
	Text.Add("At long last, it’s over. Top-Asche sags, and rolls off you with a groan to lie by your side on the cum-soaked mattress. Bottom-Asche - being the one without the pendant - slowly fades away into nothingness, your cum hitting the mattress with a wet sound. Yep, so that one was the illusion. Pretty powerful magic, eh?", parse);
	Text.NL();
	Text.Add("<i>“Yes…”</i> Asche whines. The jackaless is thoroughly spent, her generous breasts heaving atop her chest as she lies beside you on the mattress, tongue hanging loosely out of her mouth. <i>“Am thinking most definitely will be going for high price. Also may be offering practical demonstration.”</i>", parse);
	Text.NL();
	Text.Add("Well, you’re glad to be able to help.", parse);
	Text.NL();
	Text.Add("<i>“Not needing to be going too quickly… plenty of time. Maybe [handsomepretty] customer is to be staying a while?”</i>", parse);
	Text.NL();
	Text.Add("Well, all right, but just for a nap. You do need your batteries recharged after that.", parse);
	Text.NL();
	Text.Add("<i>“Is long enough.”</i> Slowly, Asche unhooks the pendant from about her neck and tosses it to the ground beside her. <i>“Just am… needing someone to…”</i>", parse);
	Text.NL();
	Text.Add("A soft snore from beside you tells you she’s fallen asleep, poor thing. You lie back in the mattress, trying to avoid the worst of the cum stains, and soon join her.", parse);
	Text.Flush();
	
	player.AddSexExp(25);
	
	TimeStep({hour: 3});
	
	Gui.NextPrompt();
}

export { SexScenes };
