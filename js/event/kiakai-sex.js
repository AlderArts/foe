import { Gender } from "../body/gender";
import { Kiakai } from "./kiakai";
import { Gui } from "../gui";
import { Text } from "../text";
import { EncounterTable } from "../event";

/*
 * 
 * HEALING SCENES
 * 
 */

let KiakaiSex = {};

KiakaiSex.Healing = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heatStirring : player.FirstCock() ? "stirring" : "heat"
	};
	parse = kiakai.ParserPronouns(parse);
	parse = player.ParserTags(parse);
	parse = kiakai.ParserTags(parse, "k");
	
	parse.gen = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	parse.fluids  = player.FirstCock() ? "salty pre-cum" :
					player.FirstVag() ? "sweet juices" :
					"sweat";
	
	Text.Clear();
	
	TimeStep({minute : 30});
	
	if(player.HPLevel() < 0.25) { // REALLY LOW HEALTH 0-25%
		player.AddHPFraction(1.0);
		Text.Add("<i>“[playername]!”</i> the elf exclaims, aghast. <i>“How are you even still standing? The amount of damage you took in that last fight... and yet, you still kept going like it was nothing.”</i>", parse);
		Text.NL();
		Text.Add("[name] gently guides you to lie down on a soft patch of earth, wincing on your behalf every time [heshe] is forced to touch one of your serious injuries. [HeShe] runs [hisher] hands slowly over your torn up body, focusing on every wound and bruise. Gradually, spot by spot, you feel the pain drain away, the waves of healing energy from the elf soothing and mending even your deepest hurts.", parse);
		Text.NL();
		
		if(kiakai.flags["Attitude"] >= Kiakai.Attitude.Neutral) {
			Text.Add("You sincerely thank the elf, telling [himher] you had been worried that this time it might have been an injury you couldn't just sleep off. [HeShe] smiles at you, happy with a job well done.", parse);
			Text.NL();
			Text.Add("The gentle touch of the elf roused something within you, however, making you hesitate when [heshe] gets up and urges you to get dressed again.", parse);
		}
		else {
			Text.Add("You smirk at the elf, telling [himher] [heshe] did a good job, but there's one spot [heshe] missed. [name] looks at you with clear concern, which changes to deep embarrassment as [heshe] understands your meaning.", parse);
			Text.NL();
			Text.Add("<i>“Even when you are this injured, [playername]...”</i> [heshe] trails off, unsure what to make of you. Trying to shrug it off, [heshe] backs off, gesturing toward your clothes.", parse);
		}
		
		KiakaiSex.HealingSeducePrompt();
	}
	else if(player.HPLevel() < 0.75) { // LOW HEALTH 25-75%
		player.AddHPFraction(1.0);
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>“[playername]!”</i> The elf exclaims with a worried expression. <i>“Please, lie down and take off your clothes, I will tend to your wounds.”</i> You comply, giving the occasional wince as the elf runs [hisher] hands over your nude body, warm flows of healing energy seeping into your battered form. Soon, your pain is numbing, and the various bruises on your body fade.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Seeing your wounds, [name] hurriedly instructs you to remove your clothes so [heshe] can tend to you. A gentle flow of healing energy seeps from your elvish companion's fingers, closing up cuts and soothing bruises, numbing your pain. <i>“Are you feeling better, [playername]?”</i> the elf asks. You assure [himher] that you are feeling much better.", parse);
			if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
				Text.NL();
				Text.Add("Much, much better, you add, grinning mischievously at [himher]. The elf nods at you uncertainly.", parse);
			}
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Wordlessly, [name] helps you disrobe, worriedly running [hisher] hands down your wounded body. Your cuts and bruises smart slightly as the elf's deft fingers run over them, assessing the damage. <i>“You must be more careful, [playername],”</i> [name] scolds you. <i>“Share some of your burdens with your companions.”</i>", parse);
			Text.NL();
			
			if(kiakai.flags["Attitude"] >= Kiakai.Attitude.Neutral) {
				Text.Add("Grudgingly, you agree to try to be more careful in the future. The elf nods, somewhat consoled.", parse);
			}
			else { // NAUGHTY
				Text.Add("Wincing as a particularly painful wound is being probed, you mutter under your breath that perhaps if a certain elf would keep in line and do as [heshe] is told, you wouldn't be so distracted.", parse);
			}
			
			Text.NL();
			Text.Add("The discomfort eases as you feel tendrils of healing magic enter your body, working their way into your most dire wounds and numbing the pain.", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
		
		Text.NL();
		Text.Add("<i>“There, that should do it,”</i> [name] announces, withdrawing the flow of healing magic from your body. [HeShe] rests [hisher] hands on your stomach for a few moments longer than what should be strictly necessary, a thoughtful expression on [hisher] face. Shaking [hisher] head a bit, [heshe] gets up on [hisher] feet, motioning for you to get dressed.", parse);
		Text.NL();
		Text.Add("A [heatStirring] in your groin makes itself known, tauntingly reminding you of the elf's gentle touch.", parse);
		
		if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
			Text.NL();
			Text.Add("Perhaps you should have [himher] service the rest of you as well?", parse);
		}
		
		KiakaiSex.HealingSeducePrompt();
	}
	else { // Health 75%-100%
		Text.Add("<i>“Really, [playername]? You look to be fine to me,”</i> [name] looks at you, unsure.", parse);
		Text.NL();
		Text.Flush();
		//[Heal][Seduce][Insist]
		var options = new Array();
		options.push({ nameStr : "Heal",
			func : function() {
				player.AddHPFraction(1.0);
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Very well, then,”</i> the elf nods, gesturing for you to turn around and bare your back. [HisHer] light caresses trail over your back, sending light shocks of electricity racing up your spine.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“If that is your wish,”</i> the elf consents, running [hisher] hands across your body. Small probing tendrils of healing magic sneak out from [hisher] fingers, finding their way into your various minor injuries.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("It's [hisher] job to keep you healthy at all times, is it not? <i>“As you say,”</i> [name] grudgingly agrees, instructing you to disrobe. After [heshe] has administered some minor healing on your body, the elf withdraws [hisher] hands.", parse);
				}, 1.0, // Scene only available for naughty
				function() { return kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral; });
				
				scenes.Get();
				
				Text.NL();
				Text.Add("Feeling far more refreshed, you gather up your gear and continue on your journey.", parse);
				Text.Flush();
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : true,
			tooltip : "A small spark of healing energy should be enough to perk you up."
		});
		options.push({ nameStr : "Seduce",
			func : function() {
				player.AddHPFraction(1.0);
				Text.Add("You give [name] a light caress on [hisher] cheek and gaze deep into [hisher] eyes. <i>“What sort of healer doesn't help those in need?”</i> you mockingly tease [himher]. Flustered, the elf asks you where you are hurt. Suggesting that it would be easier to find if you were nude, you undress in front of the blushing elf. In fact, you suggest, perhaps it'd be easier if both of you were nude...", parse);
				Text.NL();
				if(kiakai.flags["Sexed"] > 15) {
					// TODO: use musculature instead
					parse["shape"] = player.body.femininity.Get() ? "your smooth curves" : "the lines of your muscles";
					Text.Add("<i>“I... I think you are right, [playername]!”</i> [name] quickly wriggles out of [hisher] [karmor], breathing a bit faster. [HeShe] only hesitates for a moment before greedily probing your naked body, gently letting [hisher] fingers trace [shape].", parse);
				}
				else {
					Text.Add("[name] starts to mouth some protest, but you silence [himher] with a finger against [hisher] lips. As the elf warily probes your body, you slowly undress [himher], smiling at [name]'s attempts to cover [himher]self.", parse);
				}
				Text.NL();
				Text.Add("You gasp as small tendrils of healing energy flow into your body, soothing any lingering wounds and bruises. Once [heshe] is done, you gather [name] into a gentle hug, pulling [himher] down to the ground. ", parse);

				if(kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral)
					Text.Add("[HeShe] doesn't seem to mind at all, sighing happily and snuggling up against your [breasts].", parse);
				else if(kiakai.flags["Sexed"] > 15)
					Text.Add("[HeShe] looks conflicted, suspecting what is to come. From [hisher] rapidly beating heart, it seems like [heshe] is looking forward to it.", parse);
				else
					Text.Add("[HeShe] seems a bit uncomfortable with you still, but nervously complies, offering no resistance.", parse);
				KiakaiSex.HealingNice();
			}, enabled : true,
			tooltip : "Coax the elf into having some fun with you."
		});
		options.push({ nameStr : "Insist",
			func : function() {
				player.AddHPFraction(1.0);
				Text.Add("Insisting that you are indeed hurt, you slip out of your clothing without any urging from the elf. Shrugging, the elf motions for you to turn around, searching your body for signs of injury. Instead of heeding [hisher] instruction, you take [hisher] hand in yours. <i>“Here, I'll show you where...”</i>", parse);
				Text.NL();
				Text.Add("The elf's face turns a bright pink, then beet red, as you guide [hisher] fingers across your body. Their first stop is your [breasts], stopping to circle your [nips] before trailing down toward your exposed crotch.", parse);
				Text.NL();
				Text.Add("You hold [name]'s gaze captive, the poor elf almost hypnotized as [hisher] hand inexorably draws closer to your [gen]. You stop just short of it, forcing [himher] to close the final distance on [hisher] own.", parse);
				Text.NL();
				
				if(kiakai.flags["Sexed"] > 10) {
					Text.Add("Without hesitation, the elf's fingers ", parse);
					if(player.FirstCock())
						Text.Add("close around your erect [cock], caressing the length reverently.",parse);
					else if(player.FirstVag())
						Text.Add("brush against your [vag], gently teasing your folds apart.",parse);
					else
						Text.Add("caress your featureless crotch.");
					
					Text.Add(" <i>“You are always making me do weird things,”</i> [name] murmurs under [hisher] breath, but shrugs out of [hisher] [karmor] without any further coaxing from you. Leaning back onto the ground, you enjoy the show.", parse);
				}
				else {
					Text.Add("[name]'s eyes are like those of a cornered doe, unsure of whether to flee or dive in. A few moments pass before you insistently urge [himher] on, forcing [hisher] hands to graze against your [gen]. Snapping out of it, the elf hurriedly withdraws [hisher] hand, unthinkingly bringing it to [hisher] mouth, depositing a single drop of [fluids] on [hisher] lips.", parse);
					Text.NL();
					Text.Add("You console the flustered and protesting elf, telling [himher] that [heshe] is doing well; together, you have found the place that hurts, now [name] only needs to take care of it. Helping the brightly blushing elf out of [hisher] [karmor], you recline and motion for [himher] to join you.", parse);
				}
				parse.att1 = kiakai.flags["Sexed"] > 20 ? "eagerly eyeing" : kiakai.flags["Sexed"] > 10 ? "pleasantly aware of" : "uncomfortably aware of";
				Text.NL();
				Text.Add("Once nude, the elf kneels down before you, [att1] your exposed [gen]. [HeShe] seems to be waiting for your instructions.", parse);
				
				KiakaiSex.HealingAssertive();
			}, enabled : true,
			tooltip : "You're less interested in the healing than the part that may come after."
		});
		Gui.SetButtonsFromList(options);
	}
}

KiakaiSex.HealingSeducePrompt = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heatStirring : player.FirstCock() ? "stirring" : "heat"
	};
	
	parse = kiakai.ParserPronouns(parse);
	parse = kiakai.ParserTags(parse, "k");
	parse = player.ParserTags(parse);
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.gen = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	
	Text.Flush();
	//[Finish][Seduce][Nah]
	var options = new Array();
	options.push({ nameStr : "Finish",
		func : function() {
			Text.Clear();
			Text.Add("You gather up your gear, resolving to deal with your arousal in some other manner. While you are not quite sure, you could almost swear that you catch [himher] taking a peek as you get dressed.", parse);
			Text.NL();
			
			if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
				Text.Add("Hiding your smile, you purposely flaunt parts of your body to [himher], trying to make it look like an accident. Blushing at getting caught, the elf quickly pirouettes away from you, hurriedly gathering up [hisher] gear.", parse);
			
			player.AddLustFraction(0.05);
			kiakai.AddLustFraction(0.05);
			
			Text.Flush();
			Gui.NextPrompt(kiakai.Interact);
		}, enabled : true,
		tooltip : "It is time to carry on with your quest."
	});
	options.push({ nameStr : "Seduce",
		func : function() {
			Text.Clear();
			Text.Add("Rather than complying with [hisher] wishes, you stretch sinuously, making certain to flaunt your body for the captive audience as much as you can. Patting the ground beside you, you motion for your elvish companion to join you.", parse);
			Text.NL();
			parse["l"] = player.HasLegs() ? "part your legs" : "present yourself";
			Text.Add("<i>“Should we not be going, [playername]?”</i> [name] mumbles, blushing slightly. You chuckle, insisting that you are in no rush. Lazily, you [l], giving the embarrassed elf a clear view of your [gen]. The elf gets down beside you, trying to avoid your gaze and cover [hisher] burning cheeks.", parse);
			Text.NL();
			Text.Add("A jolt runs up the elf's spine as you languidly caress [hisher] [khair], whispering in [hisher] ear that [heshe] should get out of those pesky clothes.", parse);
			Text.NL();
			if(kiakai.flags["Sexed"] > 10)
				Text.Add("<i>“Every time we do this, I-”</i>, [name] cuts [himher]self off, blushing like a bride on her wedding day. Nonetheless, the elf snuggles down beside you, voluntarily removing [hisher] [karmor].", parse);
			else
				Text.Add("<i>“I... I will be cold,”</i> [name] complains uncertainly, [hisher] eyes constantly straying across your exposed body. <i>“Then you'll just have to come closer, won't you?”</i> you whisper, pulling the hapless elf into a gentle kiss. [name]'s eyes glaze over as [heshe] struggles out of [hisher] [karmor], any lingering doubts quickly abandoned.", parse);
			
			KiakaiSex.HealingNice();
		}, enabled : true,
		tooltip : "Perhaps you could persuade the elf to tend to you a bit... more?"
	});
	options.push({ nameStr : "Assert",
		func : function() {
			Text.Clear();
			Text.Add("<i>“And just where do you think you're going?”</i> you complain, amused at the elf's surprised expression. <i>“[stuttername]...?”</i>", parse);
			Text.NL();
			if(kiakai.flags["Sexed"] > 10) {
				parse["l"] = player.HasLegs() ? " spreading your legs and" : "";
				parse["l2"] = player.HasLegs() ? " between your legs" : "";
				Text.Add("<i>“Don't be coy, now,”</i> you say teasingly,[l] presenting the brightly blushing elf with your [gen]. <i>“By now, you should know <b>exactly</b> what I want.”</i> Nervously, [name] shrugs out of [hisher] [karmor], [hisher] own arousal getting the best of [himher]. As [heshe] gets down on [hisher] knees[l2], [name] looks up at you, itching to get started, but awaiting your word.", parse);
			}
			else {
				Text.Add("<i>“Getting me all excited like that,”</i> you chide the elf reproachingly, <i>“Why don't you give me some proper care?”</i> [name]'s indignant response is cut short as [heshe] glances down at your body, realizing what you are talking about. <i>“Now, how about taking responsibility for this?”</i>", parse);
				Text.NL();
				Text.Add("A bit surprisingly, the elf is quick to catch on, hurriedly getting out of [hisher] [karmor] before kneeling down, an almost expectant look in [hisher] eyes.", parse);
			}
			
			KiakaiSex.HealingAssertive();
		}, enabled : true,
		tooltip : Text.Parse("Since [name] got you going, [heshe] better sate you...", parse)
	});
	Gui.SetButtonsFromList(options);
	
}

KiakaiSex.HealingNice = function() {
	
	var parse = {
		playername : player.name,
		name    : kiakai.name,
		heatStirring : player.FirstCock() ? "stirring" : "heat",
		priest       : kiakai.flags["InitialGender"] == Gender.male ? "priest" : "priestess",
		eyeColor     : Color.Desc(kiakai.Eyes().color),
		manwoman     : kiakai.body.femininity.Get() > 0 ? "woman" : "man",
		load         : player.HasBalls() ? "the contents of your sack" : "your load",
		loadOrg      : player.HasBalls() ? "your balls" : "deep within your body"
	};
	
	parse = kiakai.ParserPronouns(parse);
	parse = kiakai.ParserTags(parse, "k");
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", 2);
	parse = Text.ParserPlural(parse, player.NumLegs() > 1, "l");
	parse = Text.ParserPlural(parse, kiakai.NumCocks() > 1, "k");
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.gen = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	
	Text.Flush();
	//[Handjob][Blowjob][Eat you][Kia/Kai][Cuddle]
	var options = new Array();
	if(player.FirstCock()) {
		// HANDJOB
		options.push({ nameStr : "Handjob",
			func : function() {
				Text.Clear();
				player.AddSexExp(1);
				kiakai.AddSexExp(1);
				Text.Add("Pulling the elf close, you hug [himher] fiercely, locking the two of you in a deep kiss. [name] becomes like putty in your arms, melting against your body and letting out moaning whimpers. One of your hands finds [hishers], fingers joining, as you guide the elf toward your package.", parse);
				Text.NL();
				Text.Add("Your intertwined hands close around your [cock], the elf's lithe, slightly cold digits making you shudder in pleasure. At first, you have to lead [himher] through the motion, but soon you withdraw your hand, giving the horny elf free rein on your [cock].", parse);
				Text.NL();
				
				if(player.FirstCock().thickness.Get() > 10) {
					Text.Add("With how thick your member is, [name] is having a hard time wrapping [hisher] fingers around it. Abandoning the effort entirely, the elf shifts [hisher] attentions to your [cockTip], gently rubbing the sensitive organ.", parse);
					Text.NL();
				}
				
				if(kiakai.FirstCock()) {
					if(Math.random() < 0.5) {
						Text.Add("[name]'s own [kcocks] stand[knotS] at attention, tightly trapped between you. Amused, you reach down and fondle [kitThem] before letting the elf get back to business. ", parse);
						kiakai.AddLustFraction(0.3);
					}
					else {
						Text.Add("[name] suddenly moans as [hisher] own [kcocks], which [khasHave] been rubbing against you for some time, erupt[knotS] as the elf prematurely climaxes. You hold on to [himher] as [heshe] rides out the wave, whispering encouragements. ", parse);
						kiakai.AddLustFraction(-1);
					}
					Text.NL();
				}
				
				if(kiakai.FirstBreastRow().size.Get() >= 3) {
					Text.Add("[HisHer] [kbreasts] mash against you, the perky nipples stiff with [hisher] lust.", parse);
					kiakai.AddLustFraction(0.1);
					Text.NL();
				}
				Text.Add("As [heshe] opens [hisher] eyes for the first time since you started kissing [himher], you gaze into [name]'s [eyeColor] eyes lovingly. <i>“I-is it good for you?”</i> [heshe] whispers uncertainly. You assure the elf that [heshe] is doing a <i>very</i> good job indeed.", parse);
				if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
					Text.Add(" It is almost like [heshe] was born to do this kind of thing, you add.", parse);
				Text.NL();
				
				var cum = player.OrgasmCum();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("A jolt in your nethers snaps you into full attention, and suddenly you are fighting to hold back your release. Glancing down, you see that [name] is not even touching you anymore - rather, a small spark of healing magic bridges the gap to your [cock].", parse);
					Text.NL();
					Text.Add("<i>“I will make your pain go away,”</i> [heshe] whispers lustily in your ear. Not able to hold back anymore, you cry out as you deposit [load] into [name]'s waiting hand.", parse);
					Text.NL();
					
					// LARGE LOAD VARIATIONS
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.Add("Your healthy load quickly becomes too much for the elf to handle and [heshe] gives a surprised cry as much of your seed drips from [hisher] hands down on the ground.", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("Stray bursts of cum erupt from your trembling member, some hitting the surprised elf right in the face, others dripping down [hisher] lithe body.", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("Grinning, you guide [name]'s head down to your still erupting [cock]. ", parse);
						if(kiakai.flags["Sexed"] > 15)
							Text.Add("[HeShe] moves eagerly, almost without your encouragement, wrapping [hisher] lips around you in time to meet an eruption of a large wad of cum, splattering on [hisher] tongue. Your sigh of pleasure is met by a moan of delight from the elf as [heshe] keeps [hisher] mouth wrapped around you, waiting for your orgasm to end.", parse);
						else
							Text.Add("[HeShe] starts to protest, but is quickly interrupted by a large wad of cum splattering on [hisher] tongue. Sighing in pleasure, you hold the struggling elf there as you hose [himher] down, waiting for your orgasm to end.", parse);
					}, 1.0, function() { return kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral; });
					
					scenes.Get();
				}, 1.0);
				scenes.AddEnc(function() {
					Text.Add("Edged on by your encouragement, [name] shifts around so that [heshe] is kneeling beside your prone form, leaving [himher] with full access to your [cock]. [HeShe] grasps the erect member with both hands, trying [hisher] best to pleasure you.", parse);
					Text.NL();
					Text.Add("<i>“Just... like... that!”</i> You moan, urging [himher] to keep up the pace. Understanding dawns on [name]'s face, blushing at your praise, [heshe] keeps jerking your [cock], determined to make you cum. [HeShe] isn't forced to wait long.", parse);
					Text.NL();
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.Add("With a sharp cry, you let loose your flood, ", parse);
						if(player.CumOutput() > 3)
							Text.Add("your [cock] exploding with cum in the poor elf's hands.", parse);
						else
							Text.Add("your seed pulsing from your [cock] and trailing down the elf's hands.", parse);
						Text.NL();
					}, 1.0);
					scenes.AddEnc(function() {
						Text.Add("In a rather uncharacteristic move, [name] leans down to plant a kiss on your trembling [cock]. This plan backfires, though, as you pick that exact moment to hit your peak.", parse);
						Text.NL();
						
						if(player.CumOutput() > 3) {
							Text.Add("Completely caught off guard, [name]'s cheeks balloon out as [hisher] tiny mouth is quickly flooded with your huge load. A gentle hand on the nape of [hisher] neck keeps [himher] from pulling back, leaving your semen only one way to go.", parse);
							Text.NL();
							Text.Add("The elf noisily swallows wad after wad of sperm, hopelessly trying to keep up with your output. Finished, you relinquish your hold and allow [himher] to take [hisher] lips off your [cock].", parse);
						}
						else if(kiakai.flags["Sexed"] > 15) {
							Text.Add("[name]'s eyes widen slightly as your load forces its way in between [hisher] lips, but [hisher] expression quickly turns dreamy. Rather than pull back, [name] takes your entire [cockTip] into [hisher] mouth, thoroughly enjoying every serving of your thick cream that [heshe] can get.", parse);
							Text.NL();
							Text.Add("The surprised elf chokes slightly on your cum, but quickly recovers and does [hisher] best to swallow the load in [hisher] mouth. [HisHer] tongue darts out, licking up the strands that had spilled out around [hisher] lips.", parse);
						}
						else {
							Text.Add("Your cum insistently presses past [name]'s puckered lips, landing in bursts on [hisher] tongue. Caught off guard, the elf pulls back in a panic, tongue sticking out and dripping of salty cum.", parse);
							Text.NL();
							Text.Add("Coughing, the surprised elf spits out part of your load on the ground, [hisher] cheeks burning. [HisHer] hands get sticky as [heshe] tries to wipe [hisher] mouth clean.", parse);
						}
						Text.NL();
						
						if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
							Text.NL();
							if(kiakai.flags["Sexed"] > 15)
								Text.Add("<i>“Why, [name], I didn't realize you enjoyed my taste so much,”</i> you tell the elf, grinning wickedly. <i>“Maybe next time I'll just feed you from the beginning. Would you like that?”</i> [name] blushes furiously at your comments before giving you an almost imperceptible nod.", parse);
							else
								Text.Add("<i>“Why, [name], you shouldn't have,”</i> you tell the elf, grinning at [himher] wickedly, <i>“here I ask for a handjob, and you give me head. The elves truly go above and beyond!”</i>", parse);
						}
					}, 1.0);
					
					scenes.Get();
				}, 1.0);
				
				scenes.Get();
				
				Text.NL();
				if(kiakai.flags["Sexed"] > 10)
					Text.Add("The elf, as if in a trance, slowly brings [hisher] sticky fingers to [hisher] mouth, cleaning off each digit while enjoying your flavor.", parse);
				else
					Text.Add("Looking a bit surprised at [hisher] sticky fingers, as if wondering how [heshe] could possibly be responsible for that, [name] hurriedly wipe [hisher] hands on some cloth.", parse);
				Text.NL();
				Text.Add("There is a slightly embarrassed tension between the two of you as you re-equip your gear and get ready to set out.", parse);
				
				Text.Flush();
				Gui.NextPrompt(kiakai.Interact);
				
				player.AddLustFraction(-1);
				kiakai.flags["Sexed"]++;
			}, enabled : true,
			tooltip : Text.Parse("Get a handjob from [name].", parse)
		});
		
		
		// BLOWJOB
		options.push({ nameStr : "Blowjob",
			func : function() {
				Text.Clear();
				
				Sex.Blowjob(kiakai, player);
				kiakai.FuckOral(kiakai.Mouth(), player.FirstCock(), 2);
				player.Fuck(player.FirstCock(), 2);
				
				Text.Add("Your lips lock with [name]'s, tongue dancing past [hisher] lips and starting an impromptu wrestling match that the elf has no hope of winning. Deciding to give [himher] a bit of a chance, you let up your assault and whisper into [hisher] ear.", parse);
				Text.NL();
				Text.Add("The panting elf gazes up at you through [hisher] thick eyelashes, comprehension dawning slowly. Shuffling around slightly, [name] plants kisses down your [breasts], making a clear trail toward your [cock]. A momentary doubt hits [himher] as [heshe] is able to appreciate the size of your member at close range, but you assure [himher] that it will be all right, giving the elf an encouraging pat on [hisher] head.", parse);
				Text.NL();
				Text.Add("[name] begins by placing a track of glistering pecks on your [cock], covering the entire length with kisses.", parse);
				Text.NL();
				
				if(player.NumCocks() > 1) {
					Text.Add("Deciding that it would be unfair to focus all [hisher] attention on only <i>one</i> of your members, [name] repeats the same process for each of your [cocks].", parse);
					Text.NL();
				}
				
				if(player.HasBalls()) {
					Text.Add("When reaching your scrotum, [heshe] gives each of your [balls] a long lick, sucking a bit on them before returning [hisher] attention to the main course.", parse);
					Text.NL();
				}
				else if(player.FirstVag()) {
					Text.Add("As [heshe] reaches the base of your [cock], the elf is greeted by your other genitalia: your moist [vag]. [HeShe] gives it a few licks before returning to [hisher] original target.", parse);
					Text.NL();
				}
				Text.Add("Taking a deep breath, [name] finally takes the tip of your [cock] into [hisher] mouth, letting it rest just inside as [hisher] tongue laps at it. Groaning a bit, you reposition yourself so that you can get a good thrust angle, intending to spice things up a bit. Blissfully unaware of your plans, [name] begins to suck on your [cock], and you let [himher] coat a good part of your length before coming to a decision.", parse);
				
				Text.Flush();
				//[Passive][Active]
				var options = new Array();
				options.push({ nameStr : "Passive",
					func : function() {
						Text.Clear();
						Text.Add("Sighing in pleasure, you lean back and allow [name] to show [hisher] skills. ", parse);
						Text.NL();
						
						if(kiakai.flags["Sexed"] > 15) {
							Text.Add("More than willing to step up to the challenge, the previously prim and proper [priest] gives [hisher] best to provide you with a good time. Sucking and slurping on your [cock] like a starving [manwoman] who just found food, [name] is soon ", parse);
							if(player.FirstCock().Size() > 75)
								Text.Add("swallowing as much of you as [heshe] is capable of, tending to your remaining length with [hisher] lithe hands.", parse);
							else
								Text.Add("swallowing your entire length, pressing [hisher] lips against your crotch.", parse);
						}
						else if(kiakai.flags["Sexed"] > 5) {
							Text.Add("Even if [heshe] is still slightly inexperienced, [name] gives [hisher] best effort to get you off. Really getting down to business, the elf starts to suck on your [cock], trying to fit as much of your length as possible into [hisher] mouth. ", parse);
							if(player.FirstCock().Size() > 60)
								Text.Add("Unable to take all of you, [name] lets your [cock] momentarily press against the back of [hisher] throat before hurriedly backing off.", parse);
							else
								Text.Add("Somehow, [heshe] manages to down all of your [cock] without choking, though [heshe] seems to be having some trouble.", parse);
						}
						else {
							Text.Add("[name] is not quite able to get a good rhythm started, but does [hisher] best to pleasure you. [HeShe] seems a bit afraid of taking you very far, and mostly focuses on your [cockTip] - not that you are complaining. The elf's deft tongue playfully laps away at you, hungrily licking up every drop of salty pre.", parse);
						}
						
						Text.NL();
						
						// TODO: More variations
						var scenes = new EncounterTable();
						/*
						scenes.AddEnc(function() {
							Text.Add("", parse);
							Text.NL();
							Gui.NextPrompt();
						}, 1.0, function() { return true; });
						*/
						
						// Fingering variation
						scenes.AddEnc(function() {
							if(player.FirstVag() && Math.random() < 0.5) {
								Text.Add("You are suddenly distracted from the exquisite blowjob by two lithe fingers probing at your moist [vag]. Gasping in surprise, you moan appreciatively as the elf slowly begins to touch your female parts.", parse);
								Text.NL();
								if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
									Text.Add("<i>“Good, showing some initiative!”</i> You grin, accentuating your words with a sudden thrust of your hips, forcing more of your [cock] into [name]'s mouth.", parse);
									Text.NL();
								}
								Text.Add("With the added pleasure of having both of your genitalia tended to at the same time, it is not long before you hit your peak, ", parse);
								
								var cum = player.OrgasmCum();
								
								if(cum > 3)
									Text.Add("flooding the elf's throat with your huge load. Gulping and swallowing for all the [heshe] is worth, [name] tries to keep up with you, but a rivulet of semen escapes [hisher] mouth, pooling in [hisher] cupped hand.", parse);
								else
									Text.Add("and you feed burst after burst of your seed to the greedy elf. [HeShe] does [hisher] best to swallow all of it, and manages admirably.", parse);
								Text.Flush();
								Gui.NextPrompt();
							}
							// Anal variation
							else {
								Text.Add("[name] gazes up at you through a veil of lust clouding [hisher] eyes. As if trying to find other ways to bring you pleasure, [heshe] briefly takes your [cock] out of [hisher] mouth, allowing [himher] to lather [hisher] digits in the sticky blend of saliva and pre-cum coating your member. Quickly getting back to the task at hand, [name] lets [hisher] wet fingers trail across your [skin], ", parse);
								if(player.HasBalls())
									Text.Add("cupping and fondling your [balls], ", parse);
								Text.Add("before finding their target.", parse);
								Text.NL();
								Text.Add("You draw a surprised gasp as you feel two of the elf's lubed fingers prod at your [anus]. [name] looks up uncertainly, as if asking permission to continue.", parse);
								Text.Flush();
								//[Allow][Deny][Punish]
								var options = new Array();
								options.push({ nameStr : "Allow",
									func : function() {
										Text.Clear();
										// TODO: Increase odds of scene
										
										Text.Add("[HisHer] restraint lifted by your eager nod, [name] slowly pushes [hisher] way past your sphincter, probing at your softer inner passage. Somehow knowing just what to do, the elf begins to finger-fuck you, eventually adding a third digit to the mix.", parse);
										Text.NL();
										Text.Add("Meanwhile, [heshe] isn't letting up on your [cocks]. With [hisher] free hand, [name] strokes your member[s], while sucking on [itsTheir] [cockTip][s]. You moan as you feel the elf lap at your urethra, the dual-pronged assault intensifying your pleasure.", parse);
										Text.NL();
										Text.Add("[HeShe] isn't bad at all with [hisher] fingers, rapidly pumping them in and out of your [anus]. Each thrust deals a glancing blow to your prostate, rewarding [name] with a shuddering moan for [hisher] efforts.", parse);
										Text.NL();
										Text.Add("Chuckling, you point out how this is something [name] would never have thought of doing when you first met, let alone taken the initiative at it. The elf doesn't let up on [hisher] dual assault, but [hisher] brightly burning cheeks indicate that your comment hit home.", parse);
										Text.NL();
										Text.Add("Unable to withstand [name]'s anal probing for long, you are soon shaking, trying to hold back the coming flood. Noticing your plight, the elf eagerly milks you, [hisher] frenzied thrusts pushing you over the edge. Unloading wads of white into [name]'s waiting maw, you lean back, riding out the wave of your orgasm.", parse);
										
										var cum = player.OrgasmCum();
										
										if(player.NumCocks() > 1) {
											Text.NL();
											Text.Add("Your other cock[s2] thrash[notEs2], spending [itsTheir2] seed uselessly on the elf's face and hair.", parse);
										}
										Text.Flush();
										Gui.NextPrompt();
									}, enabled : true,
									tooltip : Text.Parse("Somewhat surprisingly, [name] has revealed a kinkier side... why not encourage it?", parse)
								});
								options.push({ nameStr : "Deny",
									func : function() {
										// Clear stacked scene
										Gui.Callstack.pop();
										Text.Clear();
										// TODO: Decrease odds of scene
										Text.Add("Shaking your head in annoyance, you rebuff [name]'s advances. You have the elf get you off with only [hisher] mouth instead. You have a hard time getting into it however, and irritably motion the elf to finish it quicker. Despite it all, you manage to get your pleasure, your cum dribbling down [name]'s throat and splattering on [hisher] [kbreasts].", parse);
										Text.NL();
										
										var cum = player.OrgasmCum();
										
										Text.Add("Troubled, you gather up your gear and prepare to continue your journey.", parse);
										Text.Flush();
										Gui.NextPrompt(PartyInteraction);
										
										player.AddLustFraction(-1);
										kiakai.flags["Sexed"]++;
									}, enabled : true,
									tooltip : "You are not feeling up for something like that just now."
								});
								/* TODO: finish punish scene
								options.push({ nameStr : "Punish",
									func : function() {
										Text.Clear();
										Gui.Callstack.pop();
										Text.Add("", parse);
										Text.NL();
										Text.Flush();
										Gui.NextPrompt();
									}, enabled : true,
									tooltip : Text.Parse("The nerve... you'd better teach [himher] a lesson [heshe]'s not likely to forget soon! You'll make sure [heshe] never tries this again... ", parse)
								});
								*/
								Gui.SetButtonsFromList(options);
							}
						},
						// TODO: Temp, have an adjustable variable
						function() { return 0.5; },
						function() { return kiakai.flags["Sexed"] > 20; });

						scenes.AddEnc(function() {
							if(kiakai.flags["Sexed"] > 10) {
								Text.Add("The sudden tightening of your [cock] gives the elf all the warning needed. [HeShe] begins to deepthroat you repeatedly, massaging you with the muscles at the back of [hisher] throat. Moaning loudly, you give [name] what [heshe] wants: a generous serving of hot spunk, delivered directly from the tap. ", parse);
								var cum = player.OrgasmCum();
								
								if(cum > 3)
									Text.Add("No amount of preparation could prepare [himher] for the size of your load, and when the elf has had [hisher] fill, [heshe] lets your [cock] flop free, hosing [himher]self in your semen.", parse);
								else
									Text.Add("When you are done, the elf cleans your [cock], not wanting to let even a drop go to waste.", parse);
							}
							else {
								Text.Add("Your rising climax seems to catch the poor elf oblivious, [hisher] eyes widening in shock as you feed load after load of your seed down [hisher] inexperienced throat. Trying to swallow your sticky present sends [name] into a coughing fit, depositing the rest of your semen in a sticky mess across [hisher] face and hair.", parse);
								var cum = player.OrgasmCum();
								if(cum > 3)
									Text.Add(" By the time you are finished, the elf is practically drenched in cum.", parse);
							}
							Text.Flush();
							Gui.NextPrompt();
						}, 1.0, function() { return true; });
						
						scenes.Get();
						
						// Note, put this here because of intermediate options
						Gui.Callstack.push(function() {
							Text.Clear();
							if(kiakai.flags["Sexed"] > 10)
								Text.Add("You could swear that [name] is enjoying these healing sessions more than [hisher] prim demeanor lets on. The two of you gather yourselves, preparing to set out again.", parse);
							else
								Text.Add("You console [name], congratulating [himher] on a job well done, and the two of you get your gear back on, preparing to continue your journey.", parse);
							
							Text.Flush();
							Gui.NextPrompt(kiakai.Interact);
							
							player.AddLustFraction(-1);
							kiakai.flags["Sexed"]++;
						});
					}, enabled : true,
					tooltip : Text.Parse("Let [name] finish you off as best [heshe] can.", parse)
				});
				options.push({ nameStr : "Active",
					func : function() {
						Text.Clear();
						player.AddSexExp(1);
						kiakai.AddSexExp(1);
						Text.Add("[name]'s [eyeColor] eyes snap open in surprise as you suddenly thrust much more of your [cock] into [hisher] mouth than [heshe] was ready for.", parse);
						Text.NL();
						
						if(kiakai.flags["Sexed"] > 10) {
							Text.Add("Without missing a beat, [name] meets you thrust for thrust, [hisher] well-trained mouth wrapping around your [cock]. ", parse);
							if(player.FirstCock().Size() > 75) {
								Text.Add("No matter how used to sucking cock that [heshe] is though, you are far too big to fit all of your length down [hisher] throat - not that the elf lets this discourage [himher] in any way.", parse);
							}
							else if(player.FirstCock().Size() > 50) {
								Text.Add("Too big to fit in just [hisher] mouth, an audible popping noise accompanies your [cock] entering [hisher] throat. You praise your companion on [hisher] skills as [hisher] lips connect with your crotch, the entirety of your [cock] lodged deep inside [himher].", parse);
							}
							else {
								Text.Add("The elf gives [hisher] utmost to match your pace, placing a succession of rapid kisses on your crotch as [heshe] repeatedly takes you, tip to root.", parse);
							}
						}
						else {
							Text.Add("[HeShe] instinctively tries to back away, stopped by your hand holding [hisher] head in place. You make sure to give [himher] plenty of time to breathe, drinking in the conflicting emotions passing across [hisher] face as [heshe] gazes up at you, mouth stuffed to the brim with cock. Still holding [himher] in place, you gently begin to rock your hips, feeding the elf inch after inch of your [cock]. ", parse);
							
							if(player.FirstCock().Size() > 50) {
								Text.Add("Sadly, you are far too big to fit all of your length in [hisher] mouth without hurting [himher].", parse);
							}
							else {
								Text.Add("Soon, you feel the touch of [hisher] lips against your crotch, every bit of your length stuffed into [hisher] mouth.", parse);
							}
						}
						
						parse.len1 = player.FirstCock().length.Get() > 20 ? " and throat" : "";
						
						Text.NL();
						Text.Add("Sighing with pleasure, you increase the rate of your thrusts. Caressed and squeezed by the moaning elf's tongue[len1], you soon feel a surge rising from [loadOrg], announcing the arrival of your climax.", parse);
						Text.NL();
						
						Text.Add("Load after load erupts from your cock, flowing deep into the elf's wide-open throat. ", parse);
						
						var cum = player.OrgasmCum();
						
						if(cum > 3)
							Text.Add("[name]'s cheeks balloon as more and more of your white stuffing fills [hisher] mouth. Unable to keep up with your output, [heshe] pulls back, coughing while you spill the rest of your bountiful load all over [hisher] face.", parse);
						else
							Text.Add("[name] gleefully swallows every drop.", parse);
						Text.NL();
						if(kiakai.flags["Sexed"] > 15)
							Text.Add("<i>“That was really good, [playername],”</i> [name] murmurs as [heshe] swallows the last of your thick cream, wearing a dreamy expression. <i>“I... I think I have developed a taste for your...”</i> [heshe] trail off, blushing fiercely. Chuckling, you clean up and put on your gear.", parse);
						else
							Text.Add("[name] refuses to meet your eyes as the two of you clean yourselves up and put on your gear.", parse);
							
						Text.Flush();
						Gui.NextPrompt(kiakai.Interact);
						
						player.AddLustFraction(-1);
						kiakai.AddLustFraction(0.2);
						kiakai.flags["Sexed"]++;
					}, enabled : true,
					tooltip : "Make the most of it."
				});
				Gui.SetButtonsFromList(options);
			}, enabled : true,
			tooltip : Text.Parse("Convince [name] to give you a blowjob.", parse)
		});
	}
	if(player.FirstVag()) {
		// EAT YOU OUT
		options.push({ nameStr : "Eat you",
			func : function() {
				Text.Clear();
				
				Sex.Cunnilingus(kiakai, player);
				kiakai.Fuck(null, 2);
				player.Fuck(null, 2);
				
				Text.Add("After playing around with [name] for a while, crossing tongues and butting lips, you suggest that perhaps [heshe] would like to kiss your <i>other</i> lips instead.", parse);
				Text.NL();
				if(kiakai.flags["Sexed"] > 10) {
					parse["l"] = player.HasLegs() ? " between your legs" : "";
					Text.Add("Blushing prettily when [heshe] realizes what you are telling [himher] to do, [name] obediently sinks down[l], eager to fulfill your wishes. Licking [hisher] lips in anticipation, the elf leans in.", parse);
				}
				else {
					Text.Add("The elf looks a bit confused until you gesture down toward your crotch pointedly.", parse);
					Text.NL();
					parse["l"] = player.HasLegs() ? "between your legs" : "to your pussy";
					Text.Add("<i>“R-really, [playername], would you like it if I...”</i> not quite able to finish the sentence, the blushing elf meets your eyes uncertainly, lips slightly parted. Assuring [himher] that you would far more than like it, you gently guide [hisher] head [l].", parse);
				}
				Text.NL();
				Text.Add("You close your eyes in bliss as you feel [name] dig in, [hisher] tongue tasting the wet folds of your [vag]. Urged on by your soft sighs, the elf continues to lap away at your moistness. Trying [hisher] best to please, [name]'s deft [ktongue] finds your [clit].", parse);
				Text.NL();
				
				if(player.FirstVag().clitCock) {
					Text.Add("After allowing [himher] to lather the length of your girl-cock, you redirect [hisher] attention to your more feminine parts, indicating that [heshe] can have a go at your cock anytime [heshe] likes, if [heshe] just asks.", parse);
				}
				else if(player.FirstCock()) {
					parse["eachIt"] = player.NumCocks() > 1 ? "each" : "it";
					Text.Add("As [name] gently licks at your [clit], [hisher] nose keeps bumping against your [cocks], making [itThem] impossible to ignore. [name] gives [eachIt] a thorough lathering before returning to the task at hand.", parse);
					if(player.HasBalls())
						Text.Add(" As [hisher] [ktongue] returns to work on your feminine parts, [name] caresses your [balls], sending shivers up your spine.", parse);
				}
				else if(kiakai.flags["Sexed"] > 15) {
					Text.Add("[name] knows just what to do. Expertly, [heshe] licks and sucks at your [clit], sending electrical tingles through your body. [HeShe] is getting quite good at this sort of thing!", parse);
				}
				else {
					Text.Add("What [heshe] lacks in skill, [heshe] makes up for in dedication. After licking your [clit] for a bit, [name] returns [hisher] attention to your wet [vag], [hisher] nose occasionally butting against your button.", parse);
				}
				
				Text.NL();
				
				var scenes = new EncounterTable();
				var defScene = function() {
					Text.Add("In an effort to get better access, [name] spreads your netherlips with [hisher] nimble fingers, exposing your inner walls. [HisHer] [ktongue] thoroughly explores each part before penetrating deeper into your folds, delving into your tunnel. [HisHer] flexible organ works you into a frenzy, not going as deep as a cock fucking you, but constantly flexing and probing you in different ways.", parse);
					Text.NL();
					Text.Add("Before long, you are not the only one moaning, as the smell and taste of your sex slowly drives the elf over the edge. [HeShe] withdraws one of [hisher] hands from your labia, reaching down between [hisher] legs to see to [hisher] own urges.", parse);
					Text.NL();
					Text.Add("The two of you reach your peaks at the same time, and you generously provide the horny elf with more of the juices that [heshe] evidently likes so much.", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					
					parse["cum"] = cum > 4 ? "thoroughly drench" : "coat";
					
					if(player.FirstCock()) {
						Text.Add("While you are at it, you take the opportunity to [cum] the elf in your sperm, your [cocks] shooting strand after strand of sticky white fluids that land on [name]'s face and hair.", parse);
						Text.NL();
					}
					Text.Add("Still slightly dazed from [hisher] own orgasm, [name] dutifully cleans you up.", parse);
					
					kiakai.AddLustFraction(-1);
					Text.Flush();
					Gui.NextPrompt();
				};
				scenes.AddEnc(defScene, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Switching tactics, the elf withdraws [hisher] [ktongue], leaving your folds open for assault from [hisher] deft fingers. Being very careful and gentle, [name] inserts two digits into your slippery [vag], probing your depths. While [hisher] fingers are busy, [name] focuses [hisher] oral attention on your [clit], proving to be an excellent multitasker.", parse);
					Text.NL();
					
					if(kiakai.flags["Sexed"] > 20 /* && TODO anal allowed */) {
						Text.Add("Feeling particularly adventurous, the fingers on [name]'s other hand travel slightly downward, forgoing your [vag] and insistently prodding at your [anus]. Suddenly realizing what [heshe] is doing, the elf stops in place, gazing up at you for approval through [hisher] thick lashes.", parse);
						Text.Flush();
						//[Allow][Deny][Punish]
						var options = new Array();
						options.push({ nameStr : "Allow",
							func : function() {
								Text.Clear();
								// TODO: Increase odds of scene
								Text.Add("Smiling broadly, you nod slowly, encouraging the elf to continue. [HisHer] restrictions lifted, [name] insistently presses two fingers into your [anus], probing your back door while [heshe] returns to lapping at your [vag].", parse);
								Text.NL();
								Text.Add("Chuckling, you point out to the elf how this is something [heshe] would never have thought of doing when you first met, let alone taken the initiative at it. [name] doesn't let up on [hisher] dual assault of your holes, but [hisher] brightly burning cheeks indicate that your comment hit home.", parse);
								Text.NL();
								Text.Add("Reclining comfortably, you allow the elf free rein", parse);
								if(player.FirstCock())
									Text.Add(", idly stroking your [cocks]", parse);
								parse["c"] = player.FirstCock() ? " and prodding at your sensitive prostate" : "";
								Text.Add(". [name]'s slender fingers reach deep inside you, stretching your sphincter[c]. Edged on by your increasingly erratic moans, [heshe] adds another digit to [hisher] pounding, spreading you even further.", parse);
								Text.NL();
								
								var cum = player.OrgasmCum();
								
								Text.Add("Before long, you groan in ecstasy as the elf's multi-pronged attentions bear fruit, drenching [hisher] pretty face in your girly juices.", parse);
								if(player.FirstCock()) {
									Text.Add(" Your [cocks] erupt[notS] in your hand, some of the sticky white substance splattering over the elf servicing you, and some landing on your stomach.", parse);
								}
								Text.NL();
								Text.Add("When you have finished convulsing, [name] pulls out [hisher] fingers. [HeShe] shyly asks if you liked it. In response, you pull [himher] in for a deep kiss.", parse);
								Text.Flush();
								Gui.NextPrompt();
							}, enabled : true,
							tooltip : Text.Parse("Somewhat surprisingly, [name] has revealed a kinkier side... why not encourage it?", parse)
						});
						options.push({ nameStr : "Deny",
							func : function() {
								Text.Clear();
								// TODO: Decrease odds of scene
								Text.Add("Slightly annoyed, you shake your head. [name] hastily withdraws [hisher] fingers, determined to service you in some other way.", parse);
								Text.NL();
								defScene();
							}, enabled : true,
							tooltip : "You are not feeling up for something like that just now."
						});
						/* TODO: Finish scene
						options.push({ nameStr : "Punish",
							func : function() {
								Text.Clear();
								Text.Add("", parse);
								Text.NL();
								Text.Flush();
								Gui.NextPrompt();
							}, enabled : true,
							tooltip : Text.Parse("The nerve... you'd better teach [himher] a lesson [heshe]'s not likely to forget soon! You'll make sure [heshe] never tries this again...", parse)
						});
						*/
						Gui.SetButtonsFromList(options);
					}
					// Regular fingering
					else {
						Text.Add("Growing bolder by the minute, the horny elf adds another finger to [hisher] excavation team, pressing each of them knuckle-deep inside your tunnel. Your trembling [vag] is gushing with girly juices, and lewd wet sounds come out from you at each of [hisher] thrusts.", parse);
						Text.NL();
						
						var cum = player.OrgasmCum();
						
						Text.Add("Finally, with a shuddering moan, you cum. Your [legs] squirm[notS] as you shake uncontrollably, gushing sweet nectar all around your lover's fingers.", parse);
						if(player.FirstCock()) {
							Text.Add(" The fluids dripping from your [vag] are not the only things released by your orgasm though, as your [cocks] cover[s] the elf with thick white strands.", parse);
						}
						Text.NL();
						Text.Add("[name] withdraws [hisher] drenched digits, licking each clean of your sticky juices. Once finished, the elf leans in to perform the same service for your wet sex, lapping up every drop.", parse);
						Text.Flush();
						Gui.NextPrompt();
					}
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Without letting up [hisher] assault on your netherlips, [name] gently tugs on your [cocks], determined to pleasure your male endowment[s] as well. [HisHer] deft fingers caress your length[s], playfully tracing the veins on the pulsating member[s].", parse);
					Text.NL();
					Text.Add("More than pleased with the dual attention you are given, you decide to help out, grabbing[oneof] your [cocks] and heartily jerking yourself off while the elf administers [hisher] healing skills on your [vag]. Before long, your trembling [legs] announce[lnotS] your approaching orgasm.", parse);
					Text.NL();
					if(kiakai.flags["Sexed"] > 15 && Math.random() > 0.5) {
						Text.Add("Breathing heavily, [name] abandons your [vag] and eagerly shoves the tip of[oneof] your [cocks] into [hisher] mouth. While sucking you off, the elf begins pumping two of [hisher] fingers into your clenching [vag], trying to milk you as quickly as possible.", parse);
						Text.NL();
						Text.Add("You hardly want to deprive the horny elf of [hisher] meal - not that you can hold back for very long under [hisher] fervent fingering in any case. Groaning, you unleash your load down [name]'s waiting hatch, the elf swallowing as quickly as [heshe] can, trying to keep up with you.", parse);
						Text.NL();
						
						var cum = player.OrgasmCum();
						
						if(cum > 3) {
							Text.Add("Abandoning all efforts to try to swallow all of it for fear of drowning, [name] instead frees your [cockTip] from [hisher] mouth, letting the rest of your load cover [hisher] face, hair, and clothes", parse);
							parse["count"] = player.NumCocks() == 2 ? "your other" : "the rest of your";
							if(player.NumCocks() > 1)
								Text.Add(", where it joins the eruptions from [count] untended cock[s].", parse);
							else
								Text.Add(".", parse);
							Text.NL();
						}
						else if(player.NumCocks() > 1) {
							parse["count"] = player.NumCocks() == 2 ? "the other one is" : "the rest are";
							Text.Add("Although [heshe] manages to gulp down the entire load from one of your [cocks], [count] left unattended, splattering the elf's face, hair, and clothes in your warm cum.", parse);
							Text.NL();
						}
						parse["l"] = player.HasLegs() ? "Between your legs" : "In your loins";
						Text.Add("[l], your [vag] has clamped down on [name]'s fingers, coating them in slick juices. When the torrent of your orgasm has quieted down, the elf methodically licks the liquid from [hisher] digits before providing your [vag] with the same service.", parse);
					}
					else if(kiakai.flags["Sexed"] > 15) {
						Text.Add("Burying [hisher] tongue in your [vag], [hisher] nose bumping up against your [clit], [name] insistently laps at your inner tunnel, coaxing an orgasm from your burning body.", parse);
						Text.NL();
						
						var cum = player.OrgasmCum();
						
						Text.Add("Moaning loudly, you unleash a gushing torrent of girly juices into the elf's waiting mouth, simultaneously letting your male endowment[s] shower [himher] with sticky spunk.", parse);
						Text.NL();
						Text.Add("Sighing pleasurably, [name] finishes [hisher] meal, unconcerned with the strings of sperm dripping into [hisher] hair.", parse);
					}
					else {
						parse["isAre"] = player.NumCocks() > 1 ? "are" : "is";
						Text.Add("Suddenly overwhelmed by all the options in front of [himher], [name] panics slightly. Noticing that your [cocks] [isAre] about to erupt, [heshe] ineffectually tries to hold back the flow with both hands. This only succeeds in pushing you over the edge, staining [hisher] hands in your semen.", parse);
						Text.NL();
						
						var cum = player.OrgasmCum();
						
						Text.Add("Slightly flustered, [name] attempts to focus on cleaning your [vag], trying to ignore the white strands dripping down your cock[s], landing on [hisher] nose.", parse);
					}
					Text.Flush();
					Gui.NextPrompt();
				}, 1.0, function() { return player.FirstCock(); });
				scenes.AddEnc(function() {
					Text.Add("By this time, [name] knows just what to do to get you off. Electric shocks run through your tingling labia as [heshe] administers a spark of healing energy with the tip of [hisher] [ktongue]. The sparks quickly home in on the most prominent feature of your feminine anatomy: your [clit].", parse);
					Text.NL();
					Text.Add("The elf isn't even touching you anymore; [heshe] is just letting [hisher] healing power do the work. [HeShe] lets [hisher] [ktongue] hover a hair's breadth away from your [vag], a tiny beam of refreshing energy bridging the gap between the two of you.", parse);
					Text.NL();
					Text.Add("It would be a shame to let [himher] get you off without doing any work, but you have to act quickly before [heshe] overwhelms you. Gently but firmly, you grab hold of the back of [hisher] head, pressing [hisher] face into your crotch.", parse);
					Text.NL();
					Text.Add("For a moment, the sheer surprise makes [name] lose control of [hisher] powers, sending a jolt racing through your vaginal canal and up along your spine. Your sensory systems overloading, you let out a desperate moan before letting your orgasm take you and wash over your elvish lover.", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					
					if(player.FirstCock()) {
						Text.Add("Your [cocks] erupt[notS], covering [name]'s hair and back with sticky fluids.", parse);
						
						if(cum > 3)
							Text.Add(" When you finish, it looks like the elf's hair is a natural white rather than silver - a very sticky and drippy natural white.", parse);
						Text.NL();
					}
					
					Text.Add("Resting in the afterglow, you caress your elvish lover's cheek fondly.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}, 1.0, function() { return (kiakai.flags["Sexed"] > 15); });
				
				scenes.Get();
				
				Gui.Callstack.push(function() {
					Text.Clear();
					if(kiakai.flags["Sexed"] > 10) {
						Text.Add("<i>“You always taste so good, [playername],”</i> [name] tells you dreamily, running [hisher] tongue over [hisher] lips. The two of you start cleaning up and re-equipping your gear. <i>“Lately, I have found myself wanting to drink from you more and more,”</i> [heshe] admits, blushing cutely.", parse);
					}
					else if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral) {
						Text.Add("<i>“Y-you really seem to like making me do things like that,”</i> [name] accuses you, pouting prettily, as the two of you clean up and re-equip your gear. <i>“I wish you would not just make these decisions on your own! S-still, t-that was... not unpleasant,”</i> [heshe] admits, blushing furiously.", parse);
					}
					else {
						parse["aAnother"] = kiakai.FirstVag() ? "another" : "a";
						Text.Add("<i>“T-that was... not unpleasant,”</i> [name] confesses as the two of you clean up and re-equip your gear. <i>“Before meeting with you, I never knew what [aAnother] woman tasted like...”</i> [HeShe] shakes [hisher] head, blushing furiously.", parse);
					}
					
					player.AddLustFraction(-1);
					kiakai.AddLustFraction(0.1);
					kiakai.flags["Sexed"]++;
					Text.Flush();
					Gui.NextPrompt(kiakai.Interact);
				});
			}, enabled : true,
			tooltip : Text.Parse("Convince [name] to service your feminine parts.", parse)
		});
	}
	
	options.push({ nameStr : kiakai.name,
		func : KiakaiSex.PleasureElf, enabled : true,
		tooltip : Text.Parse("Return the favor by getting [name] off.", parse)
	});
	
	options.push({ nameStr : "Cuddle",
		func : function() {
			Text.Clear();
			
			Text.Add("Rather than take advantage of the nervous elf, you wrap your arms around [himher]", parse);
			if(player.FirstBreastRow().size.Get() > 3)
				Text.Add(", your [breasts] pressing against [hisher] back", parse);
			Text.Add(". Your hands, trailing down [name]'s body, brush lightly over [hisher] [knips], eliciting a surprised exhalation from the elf, before settling on [hisher] stomach. You find the nearness of the elf comforting. The warmth of your bodies intermingle as you lie there, ", parse);
			if(Math.abs(player.LustLevel() - kiakai.LustLevel()) < 0.15)
				Text.Add("your breathing uniting as one.", parse);
			else if(player.LustLevel() > kiakai.LustLevel())
				Text.Add("your rapid breathing a counterpoint to [hisher] slower breaths.", parse);
			else
				Text.Add("[hisher] rapid breathing a counterpoint to your slower breaths.", parse);
			Text.NL();
			Text.Add("After enjoying each other's closeness for a while, you regretfully decide that it's time to get going, and tell as much to the elf, reluctantly disentangling yourself from [himher]. As the two of you stand up and get dressed, you notice [name] glancing at you from time to time, a bright blush on [hisher] cheeks.", parse);
			
			/* Old scene
			Text.Add("Rather than taking advantage of the nervous elf, you cuddle up against [hisher] back", parse);
			if(player.FirstBreastRow().size.Get() > 3)
				Text.Add(", your [breastDesc] pressed between you", parse);
			Text.Add(". After enjoying the warmth of each others' bodies for a while, you nudge [name], suggesting that you get going.", parse);
			Text.NL();
			Text.Add("As you get dressed, the elf almost looks a bit regretful.", parse);
			*/
			
			player.AddLustFraction(0.1);
			kiakai.AddLustFraction(0.1);
			Text.Flush();
			Gui.NextPrompt(kiakai.Interact);
		}, enabled : true,
		tooltip : Text.Parse("[name] seems rather nervous; perhaps it'd be best to just cuddle for now. Plenty time for other entertainment later.", parse)
	});
	Gui.SetButtonsFromList(options);
}

KiakaiSex.PleasureElf = function() {
	
	var parse = {
		playername : player.name,
		name    : kiakai.name,
		heatStirring : player.FirstCock() ? "stirring" : "heat",		
		priest       : kiakai.flags["InitialGender"] == Gender.male ? "priest" : "priestess",
		eyeColor     : Color.Desc(kiakai.Eyes().color)
	};
	
	parse = kiakai.ParserPronouns(parse);
	parse = kiakai.ParserTags(parse, "k");
	parse = player.ParserTags(parse);
	
	parse["kgen"] = kiakai.FirstCock() ? function() { return kiakai.MultiCockDesc(); } :
					kiakai.FirstVag() ? function() { return kiakai.FirstVag().Short(); } :
					"featureless crotch";
	parse["stutterName"] = player.name[0] + "-" + player.name;
	
	Text.Clear();
	Text.Add("Snuggling up close, you whisper in the elf's ear that [heshe] is doing a <i>really</i> good job and deserves a reward. To accentuate just what you mean, you trace one hand down [hisher] body. Intentionally avoiding [hisher] crotch, you caress the inside of [hisher] thigh. [name] whimpers softly, [hisher] breath coming faster.", parse);
	Text.NL();
	
	if(kiakai.flags["Sexed"] < 10)
		Text.Add("<i>“W-what do you mean, [playername], were you not hurt?”</i> [heshe] huffs, trembling slightly under your touch.", parse);
	else
		Text.Add("<i>“Y-you are not hurt at all, you just want to grope me!”</i> [name] huffs accusingly. [HisHer] actions clash with [hisher] words, though, as the elf slightly parts [hisher] legs, allowing you easier access.", parse);
	Text.NL();
	
	parse = Text.ParserPlural(parse, kiakai.NumCocks() > 1);
	
	var options = new Array();
	
	if(kiakai.FirstCock()) {
		Text.Add("Without you even touching [itThem], [name]'s [kcocks] spring[notS] to attention, stiff in anticipation. You take your time teasing the elf, letting your hand trail up and down [hisher] thigh, circle around [hisher] crotch and proceed down the other leg.", parse);
		Text.NL();
		Text.Add("<i>“P-please? [playername]?”</i> [name] begs you in a small voice. Please what? [HisHer] hand slowly strays toward the throbbing member[s], but you swipe it aside, preventing [himher] from getting [himher]self off.", parse);
		if(kiakai.HasBalls())
			Text.Add(" You let your hand come around, lightly cupping the elf's [kballs].", parse);
		Text.NL();
		Text.Add("<i>“I cannot take it anymore! Please, w-would you... touch [itThem]?”</i>", parse);
		Text.Flush();
		
		//[Handjob][Blowjob]
		options.push({ nameStr : "Handjob",
			func : function() {
				Text.Clear();
				
				parse["s"] = kiakai.FirstCock().length.Get() >= 20 ? "s" : "";
				
				Text.Add("You delicately grasp[oneof] [name]'s [kcocks].", parse);
				if(kiakai.FirstCock().length.Get() >= 20)
					Text.Add(" By now, it has grown so large that you can use two hands to stroke [hisher] length.", parse);
				else if(kiakai.HasBalls())
					Text.Add(" Your free hand continues to play with [hisher] [kballs], massaging each testicle between your fingers.", parse);
				else
					Text.Add(" Your free hand keeps on exploring [name]'s body, never staying in one place for long.", parse);
				Text.NL();
				Text.Add("The elf gasps as you slowly begin to jerk [hisher] [kcock], massaging it from tip to stem.", parse);
				Text.NL();
				Text.Add("You continue pumping [himher] this way for several minutes, the elf's twitching growing increasingly erratic. Sensing that [hisher] orgasm is close at hand, you stop, withdrawing you hand[s].", parse);
				Text.NL();
				Text.Add("<i>“A-are you going to make me beg for it?”</i> [name] pants, blushing furiously when you nod, smiling. <i>“F-fine! Please?”</i> Please what? <i>“Please, continue doing that!”</i> Doing what? [name] moans in frustration. <i>“Please touch my p-penis, it feels good.”</i>", parse);
				Text.NL();
				Text.Add("Taking pity on the elf, you grab hold of [hisher] [kcock] again, and this time you don't hold back. [name]'s eyes are closed, and [hisher] hips make small thrusting motions as you rapidly pump [hisher] member.", parse);
				Text.NL();
				Text.Add("<i>“C-cumming!”</i> the elf squeaks. True to [hisher] word, [name]'s [kcocks] twitch[notEs] in your hand[s], spurting elven cockbatter onto [hisher] own stomach. You give [himher] a kiss on the lips before cleaning up. Looks like the elf will need a few minutes to recover before you can set out again.", parse);
				Text.NL();
				
				player.AddSexExp(1);
				kiakai.AddSexExp(1);
				var cum = kiakai.OrgasmCum();
				
				kiakai.subDom.IncreaseStat(0, 1);
	
				KiakaiSex.PleasureElfEnd();
			}, enabled : true,
			tooltip : "Use your hands."
		});
		options.push({ nameStr : "Blowjob",
			func : function() {
				Text.Clear();
				Text.Add("You intend to do far more than touch. To get [himher] started, you grab hold of[oneof] [name]'s [kcock] and give it a few strokes. ", parse);
				if(kiakai.flags["Sexed"] < 10)
					Text.Add("The elf whimpers as you squeeze [hisher] rock-hard member tightly, not used to such rough treatment.", parse);
				else
					Text.Add("The elf is panting in anticipation as you squeeze [hisher] rock-hard member, a bead of pre-cum forming on the [kcockTip].", parse);
				Text.NL();
				Text.Add("Shifting around, you lean down to inspect [name]'s cock up close. Aroused even further by your hot breath brushing against it, it twitches urgently. It's so easy to get the elf horny that it's almost comical.", parse);
				Text.NL();
				Text.Add("Well, if [heshe] likes your touch so much, [heshe]'s bound to like this...", parse);
				Text.NL();
				Text.Add("[name] cries out as your lips close around the [kcockTip] of [hisher] cock, your [tongue] lapping away at it avidly. Your taste buds are assaulted by salty drops of pre landing on your [tongue], dispensed from the elf's stiff member.", parse);
				Text.NL();
				Text.Add("That seemed to have a nice effect. How about stepping it up a notch?", parse);
				Text.NL();
				Text.Add("Slowly, you inch [name]'s [kcock] into your mouth, coating the moaning elf's length in your slick saliva. Letting your [tongue] stroke the stem playfully, you start bobbing your head up and down, eagerly swallowing your companion's trembling dick.", parse);
				Text.NL();
				if(kiakai.flags["Sexed"] < 10)
					Text.Add("<i>“[stutterName]! It... ahh! Ngh... feels... good!”</i> [name] moans, lost in bliss.", parse);
				if(kiakai.flags["Sexed"] < 20)
					Text.Add("<i>“Mmm... so good...”</i> [name] moans, closing [hisher] eyes in pleasure.", parse);
				else // >20
					Text.Add("<i>“Y-yes!”</i> [name] sighs. A bit to your surprise, the elf starts to make small thrusts with [hisher] hips, moving to meet you.", parse);
				Text.NL();
				Text.Add("Time to get the horny elf off. ", parse);
				if(kiakai.FirstCock().length.Get() > 35) {
					var len = player.FirstCock().length.Get();
					parse["len"] = len > 50 ? ", though it's still small in comparison to your own" :
					               len > 30 ? ", rivaling your own in size" :
					               ", easily dwarfing your own";
					Text.Add("It's almost unbelievable how large [name]'s member has grown[len]. Much too big for you to fully please, sadly enough. Still, you take as much of the [kcock] in as you can, eyes watering slightly as you force it down your burning throat.", parse);
					Text.NL();
					Text.Add("You let your hands work on the exposed parts of [name]'s shaft, wishing you could fully take [himher] into your mouth. The elf seems to be happy either way, panting desperately under your ministrations.", parse);
				}
				else if(kiakai.FirstCock().length.Get() > 20) {
					parse["sl"] = player.sexlevel < 3 ? " are forced to" : "";
					Text.Add("With some difficulty, you manage to push all of [name]'s [kcock] down your throat, managing to press a trembling kiss on the elf's crotch before you[sl] surface for air.", parse);
					Text.NL();
					Text.Add("Time and again, you let your lips rest against [name], your throat beginning to burn slightly after the repeated penetration.", parse);
				}
				else {
					Text.Add("A cock of this size is no problem for you to devour whole. You lean forward, planting kiss after kiss on [name]'s crotch, letting your [tongue] work on every part of [hisher] [kcock]. Alternating your focus between licking on the [kcockTip] and taking [himher] to the root, you make sure to give [name] as good a time as you are able.", parse);
				}
				Text.NL();
				Text.Add("<i>“B-by Aria, [playername], that feels amazing!”</i> the elf moans. You surface for a moment, a strand of saliva still connecting your [tongue] with [hisher] [kcock]. Flushed and panting, you manage to express that your diligent healer deserves no less, before returning to the task at hand.", parse);
				Text.NL();
				parse["mouthThroat"] = (kiakai.FirstCock().length.Get() > 15) ? "throat" : "mouth";
				Text.Add("[name] is in heaven, resting on [hisher] back, [hisher] [kcock] buried deep in your [mouthThroat]. You catch fragments of what sounds like a jumbled prayer, delivered by the elf in a breathless whisper.", parse);
				Text.NL();
				if(kiakai.FirstVag()) {
					Text.Add("Not wanting to let [hisher] other genitalia go unrewarded, you push two fingers into [name]'s [kvag], immediately soaking the digits in the elf's juices.", parse);
					Text.NL();
				}
				else if(kiakai.HasBalls()) {
					Text.Add("You cup [name]'s [kballs] in your hand, fondling and squeezing each testicle gently, trying to coax their load from them.", parse);
					Text.NL();
				}
				parse["multi"] = kiakai.NumCocks() > 1 ? " and all over your face" : "";
				Text.Add("[name]'s orgasm arrives accompanied by a wordless cry from the delirious elf. Clutching [hisher] legs together convulsively, [heshe] unintentionally traps your head in place while [heshe] unloads down your throat[multi].", parse);
				
				var cum = kiakai.OrgasmCum();
				
				Text.NL();
				if(kiakai.strength.Get() > player.strength.Get()) {
					Text.Add("Try as you might, you can't pry [hisher] legs apart, and are forced to meekly receive all of the elf's load.", parse);
					if(cum > 3)
						Text.Add(" You begin to get slightly worried as you can feel your stomach bulging a little under the sheer amount of semen being pumped down your throat. Just how much cum can [name] produce?!", parse);
					Text.NL();
					Text.Add("Shuddering, [name] finally lets go of [hisher] vice-like grip on you. [HeShe] looks concerned as you cough and splutter, inquiring if you are alright. You manage to nod that you are fine.", parse);
				}
				else {
					Text.Add("Prying [hisher] legs apart by force, you surface in time to receive the last spurts of the elf's seed on your face.", parse);
					if(cum > 3)
						Text.Add(" Even that much is enough to drench you thoroughly with the virile elf's spunk, as you reflexively cough up the excess of [hisher] climax.", parse);
				}
				Text.NL();
				if(kiakai.flags["Sexed"] < 10)
					Text.Add("<i>“I... never knew it would feel like this,”</i> [name] moans happily.", parse);
				else if(kiakai.flags["Sexed"] < 20)
					Text.Add("<i>“M-my cock... t-thank you, [playername],”</i> [name] sighs contentedly.", parse);
				else if(player.FirstCock())
					Text.Add("<i>“That was great, [playername],”</i> [name] murmurs, <i>“I wish I could do the same for you...”</i>", parse);
				else
					Text.Add("<i>“You are amazing, [playername],”</i> [name] sighs contentedly.", parse);
				Text.NL();
				
				Sex.Blowjob(player, kiakai);
				player.FuckOral(player.Mouth(), kiakai.FirstCock(), 2);
				kiakai.Fuck(kiakai.FirstCock(), 2);
				kiakai.subDom.IncreaseStat(10, 1);
	
				KiakaiSex.PleasureElfEnd();
			}, enabled : true,
			tooltip : Text.Parse("Pleasure [himher] orally.", parse)
		});
	}
	if(kiakai.FirstVag()) {
		
		Text.Add("[name] is getting worked up, [hisher] [kvag] already moist with juices. Teasing the elf, you caress the sensitive skin between [hisher] legs, trailing closer, but never touching. [HeShe] moans in frustration.", parse);
		Text.NL();
		Text.Add("<i>“C-can you touch it?”</i> [heshe] pleads with you. <i>“This tension, it is driving me crazy!”</i> You smile as [name] finally acknowledges [hisher] desire. [HeShe] surely deserves a treat...", parse);
		Text.Flush();
		
		//[Frig][Eat out]
		options.push({ nameStr : "Frig",
			func : function() {
				Text.Clear();
				Text.Add("Humoring the horny elf, you drag your fingers across [hisher] lower lips, giving [hisher] [kclit] a light flick before spreading [hisher] labia with both hands. Agonizingly slow, you push two digits inside [name]'s wet [kvag], probing deeply into [hisher] slick tunnel.", parse);
				Text.NL();
				parse["tinyOversized"] = kiakai.FirstVag().clit.Get() > 2 ? "oversized" : "tiny";
				Text.Add("<i>“Mmm... ah!”</i> The elf's simpering moan turns into a shrill yelp, incited by your other hand pinching [hisher] [kclit]. Your treatment of the [tinyOversized] nub sends electric shocks up [name]'s spine and coats your already slick fingers in even more girly juices. Stepping up your fingering, you start pumping [name]'s [kvag], adding another digit after a while. With two fingers, you spread [hisher] passage wide, using the third one to rub against the roof of the tunnel.", parse);
				Text.NL();
				Text.Add("<i>“B-by Aria, that feels good, [playername]!”</i> [name] moans softly, urging you on. [HeShe] even starts to grind [hisher] hips against your hand, meeting your thrusts and allowing you to sink your digits even deeper into [hisher] [kvag]. Teasingly, you ask [himher] just what Aria would think of this - and of having her name invoked in such a fashion. You are rewarded with a bright blush from the elf, your remark clearly hitting home. Whether or not [heshe] really regrets [hisher] statement is unclear as [heshe] keeps moving [hisher] hips, biting [hisher] lips so as to not utter more blasphemies.", parse);
				Text.NL();
				Text.Add("It isn't long before your hands bring the elf to a shuddering orgasm, [hisher] tight walls clamping down on you, soaking your digits in [hisher] juices. Smiling, you pull out of [himher], giving your fingers a lick before presenting them to the elf, allowing [himher] to clean you. [name] blushes as [heshe] tastes [hisher] own girl-cum, but nonetheless cleans you meticulously.", parse);
				Text.NL();
				
				var cum = kiakai.OrgasmCum();
				
				player.AddSexExp(1);
				kiakai.AddSexExp(1);
				kiakai.subDom.IncreaseStat(0, 1);
	
				KiakaiSex.PleasureElfEnd();
			}, enabled : true,
			tooltip : Text.Parse("Use your fingers to get [name] off.", parse)
		});
		options.push({ nameStr : "Eat out",
			func : function() {
				Text.Clear();
				Text.Add("Well, since [heshe] is asking so nicely...", parse);
				Text.NL();
				Text.Add("You shuffle around, letting your mouth hover a mere finger's width from [name]'s wet slit as you make yourself comfortable. Your hot breath near [hisher] most private parts gives the elf a glimmer of what is to come and [heshe] shivers in anticipation. A drop of saliva connects your [tongue], extending curiously from your open mouth, with [hisher] [kvag].", parse);
				Text.NL();
				Text.Add("[name] whimpers quietly as you place a peck on [hisher] exposed netherlips; the first of many to come. [name]'s sweet taste teases your taste buds, as if imploring you to dig in, to allow your [tongue] to ravage and penetrate the innocent elf to [hisher] very core. The elf in question doesn't seem to mind, [hisher] whimper turning to a moan as your second kiss lingers on [hisher] [kvag], your [tongue] teasing the entrance.", parse);
				Text.NL();
				Text.Add("Leaning back, you admire [name]'s exposed pink flower, gently spread by your fingers. The opening of [hisher] passage is glistening wetly, eagerly awaiting your probing tongue. You give [himher] another long lick, your nose bumping up against the elf's sensitive [kclit].", parse);
				Text.NL();
				Text.Add("<i>“Mmm... [playername]...”</i> [name] sighs contentedly, one hand idly caressing [hisher] [kbreasts].", parse);
				Text.NL();
				Text.Add("Done with foreplay, you let your [tongue] plunge into [name], eliciting a loud yelp from the unprepared elf. As you thrust deeply into [hisher] [kvag], [name] offers cute, encouraging moans, wordlessly egging you on.", parse);
				Text.NL();
				if(player.LongTongue()) {
					Text.Add("Your [tongue] was made for this sort of thing. The sheer length of your prehensile appendage allows you to penetrate as deep as any cock, violating [hisher] most private and sacred shrine.", parse);
					Text.NL();
					Text.Add("[name] is constantly gasping for air, getting way more than [heshe] bargained for. [HisHer] eyelids flutter rapidly, gaze clouded with pleasure.", parse);
				}
				else
				{
					Text.Add("Lapping away at the buffet laid out before you, you allow your [tongue] to play across the lips of [hisher] labia, and taste the deeper reaches of [hisher] folds.", parse);
				}
				Text.NL();
				Text.Add("[name] cannot take your ministrations for long, [hisher] legs twitching slightly as [heshe] lets [himher]self be overcome by lust. The elf cries out, [hisher] [kvag] clamping down tight around your [tongue], as wave after wave of [hisher] orgasm rolls over you. Your taste buds are assaulted by [hisher] sweet overflowing juices, the excess dripping down your chin.", parse);
				Text.NL();
				Text.Add("Licking your lips, you withdraw from the trembling elf, a satisfied smirk on your face.", parse);
				Text.NL();
				
				var cum = kiakai.OrgasmCum();
				
				Sex.Cunnilingus(player, kiakai);
				player.Fuck(null, 2);
				kiakai.Fuck(null, 2);
				
				kiakai.subDom.IncreaseStat(10, 1);
	
				KiakaiSex.PleasureElfEnd();
			}, enabled : true,
			tooltip : Text.Parse("Pleasure [himher] orally.", parse)
		});
	}
	Text.Flush();
	
	//[Ass][Denial]
	options.push({ nameStr : "Ass",
		func : function() {
			Text.Clear();
			Text.Add("Touch? You have some much more interesting ideas in mind. You push [name] down on [hisher] back, grabbing the elf by [hisher] knees and pushing [hisher] legs up toward [hisher] head. Sweetly, you ask [himher] to hold them for you, and not move from that position. The elf complies, blushing brightly at [hisher] compromising position.", parse);
			Text.NL();
			Text.Add("Back arched awkwardly, [name]'s legs tremble slightly from the strain, [hisher] butt thrust into the air, cheeks spread wide. Taking pity on [himher], you move in close, allowing [himher] to rest [hisher] lower back against your abdomen.", parse);
			Text.NL();
			Text.Add("Sighing in relief, [name] puts [hisher] weight on you", parse);
			if(player.FirstCock())
				Text.Add(", blushing slightly as [heshe] feels your [cocks] push against [hisher] back", parse);
			Text.Add(". [HisHer] expression turns confused, then slightly worried, as you begin to suck sensually on each of your fingers, making sure that [heshe] sees it.", parse);
			Text.NL();
			
			if(kiakai.flags["AnalExp"] < 5) {
				Text.Add("<i>“W-what are you doing, [playername]?”</i> [name] looks at you, bewildered. You smile mischievously, letting your lubricated digits prod at [hisher] [kanus]. What does [heshe] <i>think</i> you are doing?", parse);
				Text.NL();
				Text.Add("Understanding and fear dawn slowly on the elf. <i>“B-but... you cannot!”</i> You certainly can.", parse);
			}
			else if(kiakai.flags["AnalExp"] < 10) {
				Text.Add("<i>“P-please, [playername],”</i> [name] pleads, begging you to reconsider as you eye [hisher] [kanus], flexing your digits experimentally. No matter what the elf says, you notice that [heshe] doesn't resist you in the slightest, even going as far as to take a firmer grip of [hisher] calves, spreading [hisher] cheeks slightly wider.", parse);
			}
			else if(kiakai.flags["AnalExp"] < 20) {
				Text.Add("<i>“O-okay,”</i> [name] mumbles nervously, watching your preparations with conflicting emotions playing out on [hisher] face. When you experimentally prod at [hisher] [kanus], the elf blushes, but parts [hisher] legs slightly more, allowing you easier access.", parse);
			}
			else { // > 20
				Text.Add("<i>“M-make me feel good,”</i> [name] begs you, willingly spreading [hisher] legs farther apart to present you with [hisher] [kanus]. Not to disappoint, you rub your digits against [hisher] eager pucker, teasing and spreading it. The excited elf's breathing grows faster in anticipation, and [heshe] all but begs you to penetrate [himher].", parse);
			}
			Text.NL();
			Text.Add("[name] cries out as you push first one, then two fingers into [hisher] exposed [kanus]. You begin to pump your soaked digits in and out of [himher], adding a third finger once you have [himher] loosened enough.", parse);
			Text.NL();
			
			if(kiakai.FirstCock()) {
				parse = Text.ParserPlural(parse, kiakai.NumCocks() > 1);
				
				Text.Add("While you let your fingers work away at the elf's once-tight back door, your other hand prods and teases [name]'s [kcocks]. The member[s] bob[notS] and twitch[notEs] at your rapid thrusts, bouncing against your hovering hand occasionally, hot to the touch.", parse);
				Text.NL();
				Text.Add("[name], by this point, is moaning deliriously, whether for you to stop or to ream [himher] harder, it's a bit difficult to tell. Somehow, you discern from [hisher] ramblings that [heshe] wants you to pay some attention to [hisher] [kcocks] too.", parse);
				Text.NL();
				parse["knees"] = player.KneesDesc();
				Text.Add("Hmm... why not. [HeShe] is in such a good position for it too... With your [knees] and abdomen, you nudge [name]'s legs even farther back, conveniently positioning the elf's cock[s] right over [hisher] panting mouth.", parse);
				Text.NL();
				if(kiakai.FirstCock().length.Get() > 25) {
					Text.Add("Amused, you watch the conflicting emotions flitting across [name]'s flushed face. Coyly, you suggest that perhaps [heshe] should put that mouth of [hishers] to use instead of complaining about it.", parse);
					Text.NL();
					if(kiakai.flags["Sexed"] < 20)
						Text.Add("Too flustered to even speak, [name] avidly shakes [hisher] head, denying that [heshe] would even consider something like that. Chuckling, you return your attention to thrusting your fingers into [hisher] ass, [name]'s [kcocks] occasionally rubbing against the bewildered elf's lips or nose, leaving sticky trails of pre-cum wherever [itThey] make contact.", parse);
					else {
						Text.Add("As if [heshe] was only waiting for your permission, [name] starts to eagerly lick and suck at [hisher] own cock, rocking [hisher] hips slightly to give [himher]self a blowjob. Returning your attention to the elf's [kanus], you teasingly give the underside of [hisher] [kcocks] a loving caress, urging [himher] on with soft words.", parse);
						Text.NL();
						Text.Add("The horny elf doesn't seem to need much encouragement. [HeShe] has a good length of [hisher] member in [hisher] mouth, awkwardly bobbing [hisher] head despite [hisher] strange position. Occasionally, [heshe] comes up for air, gasping before returning to [hisher] [kcock] with renewed fervor.", parse);
					}
				}
				else {
					Text.Add("With your free hand, you start stroking [name]'s [kcocks] rapidly. The elf mumbles a moaning thanks before tumbling back into oblivion, [hisher] loins aflame with your combined assault.", parse);
				}
				Text.NL();
				Text.Add("Before long, you notice an erratic twitching in [name]'s [kcocks]. Acting quickly, you slam your fingers into [hisher] [kanus], pushing them up to the knuckle. Each thrust jabs directly at the poor elf's prostate, eliciting cry after cry of intense pleasure.", parse);
				Text.NL();
				Text.Add("Your incessant finger-fucking quickly becomes too much for [name] to handle, and [heshe] bucks [hisher] hips, cock[s] firing at full capacity right into [hisher] open mouth.", parse);
				Text.NL();
				
				var cum = kiakai.OrgasmCum();
				
				if(cum > 3)
					Text.Add("The elf has way more cum stored up than [hisher] lithe frame has a right to. It's not long before [hisher] mouth, but also [hisher] face, [khair] and [kbreasts] are completely drenched in the stuff. [HeShe] gulps down as much of it as [heshe] can, if nothing else to clear [hisher] clogged windpipe.", parse);
				else
					Text.Add("Streaks of white from the elf's twitching member[s] land on [hisher] cheeks, in [hisher] [khair] and on [hisher] lolling [ktongue]. Dazed, [name] laps up [hisher] ejaculate, cleaning [himher]self up.", parse);
			}
			else if(kiakai.FirstVag()) {
				Text.Add("As your pumping fingers deal with [name]'s once-tight back door, you let your other hand play with [hisher] [kvag]. The elf's pliant folds part easily, [hisher] passage already dripping with juices from your anal teasing.", parse);
				Text.NL();
				Text.Add("[name], by this point, is moaning deliriously, whether for you to stop or to ream [himher] harder, it's a bit difficult to tell. Somehow, you discern from [hisher] ramblings that [heshe] wants you to pay some attention to [hisher] clit too.", parse);
				Text.NL();
				if(kiakai.FirstVag().clit.Get() > 10) {
					Text.Add("Rather than a regular clit, the elf has a large, almost cock-like spear crowning [hisher] parted labia. Stiff and trembling with need, the shaft twitches under your light touch, every bit as sensitive as ever.", parse);
					Text.NL();
					Text.Add("Its sheer size allows you to gently jerk the giant clit as if it were a dick. The stimulation is too much for [name], who cries out in [hisher] first climax not a minute after you begin your combined assault, [hisher] cock-like appendage twitching helplessly in your hand.", parse);
					Text.NL();
					
					var cum = kiakai.OrgasmCum();
					
					Text.Add("Relenting, you allow the elf time to recover, releasing [hisher] clit until [hisher] trembling subsides. Your other hand, however, doesn't let up its rhythmic reaming of [name]'s [kanus].", parse);
					Text.NL();
					Text.Add("When you judge that [heshe] has had enough time to recover, you once more grasp [hisher] absurdly large clit, preparing to unleash another barrage of pleasure. [HeShe] <i>did</i> ask for it, after all. The appendage seems to be incredibly sensitive, your every touch sending shocks up the elf's spine. In the span of fifteen minutes, you make the elf cum no less than three more times.", parse);
				}
				else {
					parse["tinyOversized"] = kiakai.FirstVag().clit.Get() > 2 ? "oversized" : "tiny";
					Text.Add("Grinning, you give the [tinyOversized] button a gentle flick with your finger, eliciting a shocked gasp from the elf. Seeing the obvious effect on [himher], you repeat the action, ignoring [name]'s muffled protests.", parse);
					Text.NL();
					Text.Add("[HisHer] defenses quickly erode under your merciless dual-pronged assault, and [heshe] crosses [hisher] legs in a futile attempt to keep you at bay. The plan backfires as the motion grinds your fingers deeper into [hisher] female parts. [name] cries out and helplessly bucks [hisher] hips, riding out [hisher] climax.", parse);
					Text.NL();
					
					var cum = kiakai.OrgasmCum();
					
					Text.Add("You continue to rhythmically pump the elf's [kanus] all through [hisher] orgasm, but relent and allow [hisher] [kclit] some time to recover. Once [hisher] squirming has lessened, you pry [hisher] legs apart again, sternly instructing the elf to let you lead. Blushing, [name] spreads [hisher] legs, allowing you full access.", parse);
					Text.NL();
					Text.Add("[HeShe] bites [hisher] lower lip in anticipation as you once again close in on [hisher] [kclit], this time pinching it between your fingers.", parse);
				}
				Text.NL();
				if(kiakai.flags["Sexed"] < 20)
					Text.Add("<i>“T-the pleasure, it is too much!”</i> [name] moans, [hisher] body obviously not used to such intense sensations.", parse);
				else
					Text.Add("<i>“M-more! Give me more, [playername]!”</i> the horny elf pants, begging you to continue, [hisher] desire not yet sated.", parse);
				Text.NL();
				Text.Add("Done with [hisher] clit, you move your attention to [name]'s [kvag]. No further preparation is needed as your fingers easily slip inside [hisher] folds, lubricated by the elf's own fluids. Eagerly, you explore [hisher] sopping passage, coaxed on by [hisher] encouraging moans.", parse);
				Text.NL();
				Text.Add("After a while, you decide that you have sated the elf's feminine parts sufficiently, and return your focus to [hisher] [kanus]. Redoubling your efforts, it is only a matter of minutes before [name]'s confused sphincter convulses around your penetrating digits. The elf almost passes out as [hisher] anal orgasm shocks [himher] to [hisher] very core.", parse);
			}
			
			Text.NL();
			Text.Add("You pull your fingers out of [name], slyly asking if [heshe] liked it. [name], not quite trusting [hisher] voice, blushes brightly, still flushed from [hisher] recent climax.", parse);
			Text.NL();
			
			kiakai.flags["AnalExp"]++;
			player.AddSexExp(2);
			kiakai.AddSexExp(2);
			kiakai.subDom.DecreaseStat(-30, 1);

			KiakaiSex.PleasureElfEnd();
		}, enabled : true,
		tooltip : Text.Parse("[HisHer] [kgen] will have to wait, you are going to play with [hisher] [kanus] this time.", parse)
	});
	options.push({ nameStr : "Denial",
		func : function() {
			parse["ktarget"] = kiakai.FirstCock() ? parse["kcock"] : parse["kvag"];
			Text.Clear();
			Text.Add("You instruct the elf to lie down on [hisher] back and spread [hisher] legs for you. [name] eagerly complies, believing that you'll help with [hisher] itch. ", parse);
			if(kiakai.FirstCock())
				Text.Add("You trail one finger down the length of the elf's [kcocks], even placing a kiss on[oneof] [hisher] [kcockTip][s]", parse);
			else if(kiakai.FirstVag())
				Text.Add("You trail one finger down the elf's tight slit, even placing a kiss on [hisher] [kclit]", parse);
			Text.Add(", before shifting your attention to the rest of [hisher] body, intentionally avoiding the spot [name] wants you to touch the most.", parse);
			Text.NL();
			Text.Add("When the elf makes another attempt to deal with the problem by [himher]self, you grab hold of both of [hisher] hands, trapping them against [hisher] sides. Unimpeded, you continue your slow torture, licking and lapping at [name]'s crotch, close enough to feel the heat of [hisher] [ktarget], but never quite touching it.", parse);
			Text.NL();
			if(kiakai.FirstCock())
				Text.Add("The elf moans piteously, a drop of pre-cum forming on the tip of [hisher] twitching member.", parse);
			else if(kiakai.FirstVag())
				Text.Add("The elf bites [hisher] lip, struggling to keep [himher]self from thrusting [hisher] moist crotch against your tantalizing [tongue].", parse);
			Text.NL();
			Text.Add("<i>“I-I cannot take it any longer!”</i> [name] cries out. Taking pity on [himher], you relinquish your grip on [hisher] arms, allowing the elf to take [himher]self the rest of the way. You lean back, thoroughly enjoying the sight of your horny companion fondling [himher]self.", parse);
			Text.NL();
			if(kiakai.FirstCock()) {
				Text.Add("Grasping [hisher] [kcock] in one hand, [name] begins to stroke [himher]self rapidly. [HisHer] other hand snakes down between [hisher] legs, ", parse);
				if(kiakai.FirstVag())
					Text.Add("finding [hisher] moist [kvag].", parse);
				else
					Text.Add("massaging [hisher] taint and probing [hisher] back door.", parse);
				Text.Add(" It's not long before the elf cries out in pleasure, [hisher] [kcock] spraying [hisher] seed on the ground.", parse);
			}
			else if(kiakai.FirstVag()) {
				Text.Add("Spreading [hisher] lower lips with one hand, [name] begins to finger [himher]self with the other, pushing [hisher] digits in up to the knuckles. Trembling slightly, [heshe] prods at [hisher] [kclit] with [hisher] thumb, breathing heavily.", parse);
				Text.NL();
				Text.Add("It's not long before the elf cries out in pleasure, [hisher] [kvag] twitching and squirting [hisher] juices on the ground.", parse);
			}
			Text.NL();
			
			player.AddSexExp(2);
			kiakai.AddSexExp(2);
			kiakai.subDom.DecreaseStat(-20, 1);

			KiakaiSex.PleasureElfEnd();
		}, enabled : kiakai.FirstCock() || kiakai.FirstVag(),
		tooltip : Text.Parse("Tease [himher] even more, keeping [himher] from getting off.", parse)
	});
	Gui.SetButtonsFromList(options);
}

KiakaiSex.PleasureElfEnd = function() {
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name
	};
	
	parse = kiakai.ParserPronouns(parse);
	
	Text.Add("Completely sated, [name] collapses on [hisher] back, panting from the exertion. You allow [himher] a few minutes of rest before gathering up your gear.", parse);
	Text.Flush();
	
	player.AddLustFraction(0.2);
	kiakai.AddLustFraction(-1);
	
	kiakai.flags["Sexed"]++;
	
	Gui.NextPrompt(kiakai.Interact);
}

KiakaiSex.HealingAssertive = function() {
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,
		heatStirring : player.FirstCock() ? "stirring" : "heat",
		tail     : function() { var tail = player.HasTail(); return   tail ? tail.Short() : "NO TAIL"; },
		boygirl      : kiakai.body.femininity.Get() > 0 ? "girl" : "boy",
		analAtt      : kiakai.flags["AnalExp"] > 10 ? "uncertainly" : "eagerly"
	};
	
	parse = kiakai.ParserPronouns(parse);
	parse = kiakai.ParserTags(parse, "k");
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.gen = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	parse.kgen = kiakai.FirstCock() ? function() { return kiakai.MultiCockDesc(); } :
					kiakai.FirstVag() ? function() { return kiakai.FirstVag().Short(); } :
					"featureless crotch";
					
	// TODO: Write more scenes
	
	Text.Flush();
	//[Oral][69][Anal]
	var options = new Array();
	
	if(player.FirstCock()) {
		options.push({ nameStr : "Blowjob",
			func : function() {
				Text.Clear();
				Text.Add("In no uncertain terms, you tell the elf to give you a blowjob.", parse);
				Text.NL();
				
				if(kiakai.flags["Sexed"] < 3) {
					Text.Add("<i>“A-a blowjob?”</i> [name] looks at you, flustered and embarrassed.", parse);
					Text.NL();
					Text.Add("<i>“I want you-”</i> You point a finger at the elf, pressing your fingertip against [hisher] nose, <i>“-to suck my cock.”</i> You helpfully point out the appendage, as if [heshe] could miss it. <i>“Now, get to it before I grow bored.”</i> You motion for the elf to begin.", parse);
					Text.NL();
					Text.Add("Uncertainly eyeing[oneof] your [cocks], [name] leans forward and gives it a tentative lick, placing a kiss on the crown. Sighing impatiently, you grasp the back of [hisher] head firmly, forcing the first few inches of your [cock] into the protesting elf's hot mouth.", parse);
				}
				else if(kiakai.flags["Sexed"] < 10) {
					Text.Add("Nodding in comprehension, [name] swallows uncertainly. Grasping[oneof] your [cocks], the elf takes part of it into [hisher] mouth, lathering your length in saliva.", parse);
					Text.NL();
					Text.Add("Your praise [himher] for doing such a good job, caressing [hisher] hair before taking a firm grasp of the back of [hisher] head, preventing the elf from escaping. Looking slightly fearful, [heshe] accepts your touch, diligently sucking on the [cockTip] of your cock.", parse);
				}
				else {
					Text.Add("Without hesitation, [name] obeys you. Eagerly wrapping [hisher] lips around[oneof] your [cockTip][s], the elf wastes no time in starting to move up and down your length, lathering it in [hisher] slick saliva.", parse);
					Text.NL();
					Text.Add("[HeShe] has become such a good cocksucker now that [heshe] has lost [hisher] inhibitions, something you are sure to remind [himher] of. Rather than blushing in shame, you detect a small hint of pride in [name]'s eyes as [heshe] gazes up at you through [hisher] thick lashes.", parse);
					Text.NL();
					Text.Add("Time you took a more active part though. Grasping the back of [hisher] head with both hands, you push more of your [cock] into [himher], glorying in [hisher] magnificent tightness.", parse);
				}
				Text.NL();
				Text.Add("Holding [himher], you guide the elf up and down your member, slowly at first, but gradually increasing in speed. [name]'s [ktongue] caresses the veins of your [cock], trying to keep up with your rapid pace.", parse);
				if(player.NumCocks() > 1) {					
					Text.Add(" Your other cock[s2] grind[notS2] against [name]'s face, rubbing [hisher] forehead and staining [hisher] hair with sticky pre-cum.", parse);
				}
				Text.NL();
				
				var biggestCock = player.BiggestCock();
				var biggestCockLen = biggestCock.length.Get();
				
				var scenes = new EncounterTable();
				// DEEPTHROAT
				scenes.AddEnc(function() {
					Text.Add("[name] has some trouble getting [hisher] breath as your [cock] stuffs [hisher] mouth to the brim, the [cockTip] prodding at the back of [hisher] throat. The elf tries to push [himher]self off your cock, but you grip [himher] firmly, restricting [hisher] movements.", parse);
					Text.NL();
					Text.Add("Furtively at first, but rapidly growing more desperate, [name] tries to escape your iron grasp. Relenting slightly, you pull your [cock] out far enough to allow [himher] to breathe through [hisher] nose. [name] gazes up at you with gratitude, but [hisher] relief is short lived as you once again feed your length down [hisher] tight esophagus.", parse);
					Text.NL();
					Text.Add("[HeShe] looks up at you pleadingly, but rather than easing up, you push a few more inches in, blocking off [hisher] breathing once more. With short, deep thrusts, you enjoy the feeling of the elf's throat constricting around your [cock], withdrawing slightly now and then to allow [himher] some breathing room.", parse);
					Text.NL();
					if(kiakai.flags["Sexed"] > 20)
						Text.Add("Drawing from previous experiences, [name] soon has a rhythm going, [hisher] practiced throat quickly growing accustomed to your deep fucking. [HeShe] even seems to be getting some enjoyment out of it, a dreamy look on [hisher] face as the elf hums lightly, the vibrations of [hisher] tight cocksleeve increasing your pleasure.", parse);
					else
						Text.Add("Not used to such rough treatment - yet - the elf's eyes tear up from pain and lack of oxygen. Still, [hisher] convulsing throat is working wonders on your [cock], stroking it rapidly while fruitlessly trying to expel the invading member.", parse);
					Text.NL();
					Text.Add("Feeling your orgasm approaching quickly, you pull out until only your [cockTip] is in [name]'s mouth. Coughing and wheezing, the elf tries to get [hisher] breath back before you roughly shove yourself back in, ", parse);
					if(biggestCockLen - kiakai.flags["Sexed"] < 20)
						Text.Add("pushing your [cock] in to the root. The hot kiss on your groin only serves to egg you on.", parse);
					else
						Text.Add("pushing as much of your [cock] into [himher] as possible. It will take a lot of training until [heshe] is able to take all of your length, though.", parse);
					Text.NL();
					
					parse["cumOrg"] = player.HasBalls() ? Text.Parse("your [balls]", parse) : "your cum-producing organs";
					
					Text.Add("Rutting happily, you hug [name]'s face to your crotch, groaning in pleasure as [cumOrg] deposit their load down the elf's throat. Helpless to do anything, [heshe] tries to ride it out, gulping and swallowing your sticky cum as quickly as [heshe] is able.", parse);
					if(player.CumOutput() > 3)
						Text.Add(" Your flood, once released, doesn't let up. When you finally finish, [name]'s stomach is visibly distended.", parse);
					if(player.NumCocks() > 1) {						
						Text.Add(" Joining [itsTheir2] sibling, your other member[s2] erupt[notS2], covering [name] in long white strands.", parse);
					}
					Text.NL();
					Text.Add("With a drawn-out sloppy sound, you pull your softening [cock] from the elf's throat. Once [heshe] has finished coughing, a dribble of cum running down [hisher] chin, you present [himher] with your cum-coated cock.", parse);
					Text.NL();
					Text.Add("<i>“Clean it up, like a good slut,”</i> you order [himher] imperiously, smiling as the elf obediently complies.", parse);
				}, 1.0, function() { return biggestCockLen > 20; });
				// FACEFUCK
				scenes.AddEnc(function() {
					Text.Add("Seeking to get a better angle of penetration, you adjust your lower body, twining your fingers into [name]'s hair, trapping [himher] in place. Intending to get your pleasure out of the elf, and to get it rough, you start thrusting in and out of [hisher] mouth, ignoring [hisher] whimpering complaints.", parse);
					Text.NL();
					Text.Add("You set a rapid pace, abusing the poor elf's hole. ", parse);
					if(biggestCockLen > 30)
						Text.Add("Due to the sheer size of your [cock], you are unable to use its full length. Alternating between roughly deepthroating the elf and repeatedly forcing your way in and out of [hisher] throat, you make the most of it anyway.", parse);
					else if(biggestCockLen > 13)
						Text.Add("Your cock is just long enough to force its way into the elf's throat with each powerful thrust, leaving the elf gasping for air as you pummel [hisher] mouth.", parse);
					else
						Text.Add("Roughly smashing your crotch against [hisher] lips, you pummel the elf, making sure to familiarize [himher] with every inch of your [cock].", parse);
					Text.NL();
					Text.Add("Hardly given time to breathe, [name]'s muffled moans grow more ragged. Not showing any signs of letting up, you continue your facefucking for several minutes. In a small act of mercy, you pull out in order to let the elf recover.", parse);
					Text.NL();
					if(kiakai.flags["Sexed"] > 30)
						Text.Add("<i>“W-why did you stop?”</i> [name] coughs, almost sounding a bit disappointed. You tell [himher] not to worry, there is more where that came from. The elf is wearing an almost hungry expression as you once more guide your [cock] in between [hisher] waiting lips.", parse);
					else
						Text.Add("<i>“Y-you are way too rough, [playername],”</i> [name] splutters, coughing up pre-cum. You chide [himher] for being such a baby - a good healer should be able to take this much at least, right? Cutting off any further complaints, you shove your [cock] back inside the elf.", parse);
					Text.NL();
					Text.Add("Getting back to business, you resume your rough fucking. After about ten minutes, you can feel your orgasm closing in.", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.Add("Deciding to push on and leave the elf with a surprise present, you continue thrusting your throbbing [cock] into [hisher] mouth, hardly slowing down even as you begin to spill your seed inside [himher]. Part of your load seeps out of the corner of [name]'s mouth, dribbling down [hisher] chin.", parse);
						if(cum > 3)
							Text.Add(" Another thread of sticky semen forces its way out [hisher] nose, the elf overwhelmed by the amount of cum you produce.", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("You pull your throbbing [cock] away from the elf, excitedly jerking your length in front of [name]'s open, panting mouth. Still slightly disoriented from the rough fuck, [heshe] doesn't seem to notice until the first wad lands on [hisher] [ktongue].", parse);
						Text.NL();
						Text.Add("Moaning, you deposit your sticky load on the elf, some of the shots hitting [hisher] mouth by sheer luck. Most miss their mark, landing on [name]'s cheeks or in [hisher] hair.", parse);
						if(cum > 3)
							Text.Add(" Once you are done, the elf's face - and most of [hisher] front - is covered in a sticky mess.", parse);
					}, 1.0, function() { return true; });
					scenes.Get();
				}, 1.0, function() { return true; });
				/* TODO: more scenes
				scenes.AddEnc(function() {
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
					Text.NL();
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
					Text.NL();
				}, 1.0, function() { return true; });
				*/
				scenes.Get();
				
				
				Text.NL();
				if(kiakai.flags["Sexed"] > 30) {
					Text.Add("<i>“Mmm... y-you taste so good, [playername],”</i> [name] stammers, licking up a stray drop of your cum from your [cock]. Chuckling, you tell the slutty elf to get dressed. Maybe next time, you'll let [himher] get off, too.", parse);
				}
				else if(kiakai.flags["Sexed"] > 10) {
					Text.Add("<i>“T-that was different,”</i> [name] mumbles, <i>“b-but not bad, I guess.”</i> You congratulate [himher] on a job well done, saying that you are sure [heshe]'ll enjoy it more next time. The elf looks at you doubtfully.", parse);
				}
				else {
					Text.Add("<i>“P-please do not make me do that again, [playername],”</i> [name] pleads with you, <i>“I do not think I can take it.”</i> You smile at [himher] reassuringly, telling the elf that next time won't be so bad. [HeShe] visibly shudders when you mention a next time.", parse);
				}
				Text.NL();
				Text.Add("The two of you re-equip your gear and get ready to set out again.", parse);
				
				
				kiakai.flags["Sexed"]++;
				
				Sex.Blowjob(kiakai, player);
				kiakai.FuckOral(kiakai.Mouth(), player.FirstCock(), 2);
				player.Fuck(player.FirstCock(), 2);
				
				kiakai.subDom.DecreaseStat(-30, 1);
				player.AddLustFraction(-1);
				
				Text.Flush();
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : true,
			tooltip : "Tell the elf to suck your cock."
		});
	}
	// CUNNILINGUS
	if(player.FirstVag()) {
		options.push({ nameStr : "Cunnilingus",
			func : function() {
				Text.Clear();
				Text.Add("You flaunt your [vag] for [name]'s benefit, slyly asking if [heshe] wants to eat you out.", parse);
				Text.NL();
				if(kiakai.flags["Sexed"] < 10)
					Text.Add("<i>“You want me to... there?”</i> The elf blushes, casting furtive glances at your exposed crotch.", parse);
				else if(kiakai.flags["Sexed"] < 20)
					Text.Add("<i>“I-if you want me to,”</i> the elf mumbles, [hisher] expression a beautiful mix of lust and embarrassment. [HeShe] refuses to meet your eyes, [hisher] hands fidgeting.", parse);
				else
					Text.Add("<i>“C-can I?”</i> The elf looks a bit flustered, but [heshe] is clearly eager to serve you.", parse);
				Text.NL();
				parse["lowerbody"] = player.LowerBodyType() == LowerBodyType.Single ? Text.Parse("to your [vag]", parse) : "between your legs";
				Text.Add("Nodding impatiently, you guide [hisher] head down [lowerbody], positioning yourself within reach of the elf's [ktongue]. Any lingering inhibitions shattered by your insistence, [name] leans in to pleasure you as best as [heshe] can.", parse);
				Text.NL();
				parse["bothtwo"] = player.Arms().count > 2 ? "two" : "both";
				Text.Add("You stifle a moan as you feel [hisher] lips on your [vag], the tip of the elf's [ktongue] hesitantly probing at your labia. Not patient enough to let [himher] go at [hisher] own pace, you grasp [name]'s head with [bothtwo] hands and push [himher] down roughly, your [vag] grinding against [hisher] face.", parse);
				Text.NL();
				Text.Add("For a while, you just enjoy the sensation as [name] slowly accepts [hisher] position, starting to actively lap at your crotch, burying [hisher] [ktongue] inside your folds. Your grip keeps the elf firmly in place, barely giving [himher] room to breathe.", parse);
				Text.NL();
				if(player.FirstCock()) {					
					Text.Add("Your unattended [cocks] [isAre] starting to stiffen, and you idly slap [name] with [itThem] a few times. After smearing some of your pre-cum on [hisher] forehead, you let [himher] get back to business.", parse);
					Text.NL();
				}
				if(kiakai.flags["Sexed"] < 20)
					Text.Add("[name] is doing a relatively good job, but [heshe] is going a bit too slow, [hisher] inexperience obvious in the hesitant motions. It seems you have to train [himher] a bit more for [himher] to lose [hisher] inhibitions.", parse);
				else
					Text.Add("[name] is putting [hisher] skills to good use, probing your depths eagerly. Your diligent training of the elf is paying off; [heshe] is still a bit flustered, but hardly seems inhibited anymore.", parse);
				Text.NL();
				Text.Add("No... you need more than this.", parse);
				Text.NL();
			 
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("Shaking your head in disappointment, you push [name] back. The elf looks confused, wondering what [heshe] did wrong. <i>“[playername]?”</i> [heshe] asks uncertainly. You push [himher] down on [hisher] back, silencing the elf with a deep kiss. As you withdraw, a string of saliva mixed with your own juices briefly bridges the gap between [name]'s mouth and yours. Not allowing [name] to get back on [hisher] feet, you quickly straddle [hisher] face, your [butt] resting lightly on [hisher] [kbreasts].", parse);
					Text.NL();
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.Add("<i>“Mmm... not bad, but perhaps you still need some guidance...”</i>", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("<i>“You do it like this!”</i>", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("<i>“[name],”</i> you smile wickedly, shaking your head, <i>“I see you still have much to learn...”</i>", parse);
					}, 1.0, function() { return true; });
					
					scenes.Get();
										
					Text.Add(" To accentuate your words, you grind up against [hisher] mouth, pressing down on [himher] with your [vag]. Spreading your legs wider, you let yourself relax, putting more and more of your weight on your prone companion. [name]'s muffled moans send violent vibrations through your nether regions, [hisher] [ktongue] firmly lodged in your slick tunnel.", parse);
					
					if(player.FirstCock()) {						
						Text.Add(" You grab hold of your [cocks], stroking [itThem] slowly while riding the submissive elf.", parse);
					}
					var tail = player.HasTail();
					if(tail && tail.Prehensile()) {
						parse["notEs"] = tail.count > 1 ? "" : "es";
						Text.Add(" Your flexible [tail] swish[notEs] back and forth, brushing over [name]'s stomach before finding its target and rubbing up against the elf's [kgen], returning blow for blow.", parse);
					}
					else if(tail) {
						parse["notEs"] = tail.count > 1 ? "" : "es";
						parse["itsTheir"] = tail.count > 1 ? "their" : "its";
						Text.Add(" [name] shudders as your [tail] brush[notEs] against [hisher] stomach, [itsTheir] sweeping motions tickling [hisher] sensitive [kskin].", parse);
					}
					Text.NL();
					parse["legs"] = player.LegsDesc();
					Text.Add("With wild abandon, you gyrate your hips in intense, bucking motions, taking your pleasure with little care for your elvish mount. Said mount seems to be enjoying [himher]self regardless, [hisher] hands plastered to your [butt] - not trying to force you off, but rather encouraging you. Experimentally, you flex your [legs], rising up slightly to give [himher] some breathing room. [name] licks [hisher] lips, eyes flickering between your dripping cunt and your flushed face.", parse);
					Text.NL();
					Text.Add("You coyly ask [himher] what [heshe] is waiting for, swaying your hips seductively. Lust overpowering [hisher] shame, the elf leans in, returning to [hisher] task. Once you've confirmed [hisher] willingness, you sink back down, twat crushing against your excited companion's upturned face.", parse);
					Text.NL();
					Text.Add("For the better part of half an hour, you continue riding [name], repeatedly impaling yourself on [hisher] [ktongue]. You smirk as you glance over your shoulder, seeing one of [name]'s hands busy between [hisher] own legs. From the mess, you gather that [heshe] has climaxed at least once during your wild ride.", parse);
					Text.NL();
					parse["juice"] = player.FirstCock() ? "the combined fluids of your male and female parts" : "your juices";
					Text.Add("Feeling your own orgasm surging through your body, you switch gears, grasping your lover's head in your hands and pressing down on [himher] with your crotch. You cry out as waves of pleasure run through you, drenching the elf in [juice].", parse);
				}, 1.0, function() { return player.LowerBodyType() != LowerBodyType.Single; });
				/* TODO: Scene not requiring legs
				scenes.AddEnc(function() {
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
				}, 1.0, function() { return true; });
				*/
				scenes.Get();
	
				Text.NL();
				Text.Add("Stretching luxuriously, you tell [name] to get you cleaned up.", parse);
				Text.NL();

				kiakai.flags["Sexed"]++;
				player.AddLustFraction(-1);
				kiakai.AddLustFraction(-1);
				
				Sex.Cunnilingus(kiakai, player);
				kiakai.Fuck(null, 3);
				player.Fuck(null, 1);
				
				kiakai.subDom.DecreaseStat(-30, 1);
							
				if(kiakai.subDom.Get() > -20) {
					Text.Add("The elf doesn't respond, averting [hisher] gaze in shame.", parse);
					
					Text.Flush();
					//[Mercy][Punish]
					var options = new Array();
					options.push({ nameStr : "Mercy",
						func : function() {
							Text.NL();
							Text.Add("Relenting, you give [name] a hand up, helping [himher] with [hisher] gear. The two of you ready yourselves to continue your journey.", parse);
							Text.Flush();
							Gui.NextPrompt(kiakai.Interact);
						}, enabled : true,
						tooltip : Text.Parse("Give [himher] a break.", parse)
					});
					options.push({ nameStr : "Punish",
						func : function() {
							Text.NL();
							Text.Add("You simply sit back down, grinding your crotch against [himher], using [hisher] face like a towel. Before gathering your gear and continuing your journey, you give [name] an encouraging kiss on the cheek.", parse);
							
							kiakai.subDom.DecreaseStat(-30, 2);
							kiakai.relation.DecreaseStat(-100, 2);
							
							kiakai.AddLustFraction(0.2);
							Text.Flush();
							Gui.NextPrompt(kiakai.Interact);
						}, enabled : true,
						tooltip : Text.Parse("Can't have [himher] disobeying, can you?", parse)
					});
					Gui.SetButtonsFromList(options);
				}
				else {
					Text.Add("The elf obeys without complaint, dutifully licking the lingering drops from your female sex. Gathering your gear, you get ready to continue on your travels, followed by the slightly disoriented elf.", parse);
					
					kiakai.AddLustFraction(0.2);
					Text.Flush();
					Gui.NextPrompt(kiakai.Interact);
				}
			}, enabled : true,
			tooltip : "Tell the elf to eat you out."
		});
	}
	// DOMMY 69
	options.push({ nameStr : "69",
		func : function() {
			Text.Clear();
			parse["emo"]     = kiakai.flags["Sexed"] > 15 ? "eagerly" : "fearfully";
			parse = Text.ParserPlural(parse, kiakai.NumCocks() > 1);
			parse["boygirl"] = kiakai.Gender() == Gender.male ? "boy" : "girl";
			Text.Add("<i>“On second thought...”</i> you tell the elf to lie down on [hisher] back. [name] complies, [emo] awaiting what you are going to do. Smirking, you take in the sight of the nude elf before you.", parse);
			Text.NL();
			if(kiakai.FirstCock() && kiakai.FirstVag()) {
				Text.Add("Blushing under your ogling, [name] tries to cover [hisher] [kcocks] by hiding [itThem] under [hisher] hands. ", parse);
				if(kiakai.BiggestCock().length.Get() > 30)
					Text.Add("A futile effort, considering [hisher] size. ", parse);
				Text.Add("Annoyed with [hisher] teasing, you swat away the cover, telling the elf to keep [hisher] hands by [hisher] sides.", parse);
				Text.NL();
				parse["b"] = kiakai.HasBalls() ? Text.Parse(" [kballs],", parse) : "";
				Text.Add("You take your time appraising the elf's form, absently nudging [hisher] legs apart, revealing [name]'s [kcock],[b] and [kvag]. [name] really does have the best of both worlds.", parse);
				Text.NL();
				Text.Add("While giving [himher] a few strokes on[oneof] [hisher] member[s] to get [himher] riled up, your other hand playfully pinches one of the elf's [knips].", parse);
			}
			else if(kiakai.FirstVag()) {
				Text.Add("[name] tries to cover [himher]self up, crossing [hisher] legs to hide the moist mound hidden between them. Not up for [hisher] games, you reach down, prying the elf's legs apart, and stick a few fingers into [hisher] wet cleft. [name] almost lifts from the ground, arching [hisher] back trying to escape the invading digits. Roughly spearing [himher] with your fingers one last time, you chastise the elf for being so shy.", parse);
				Text.NL();
				Text.Add("Taking the hint, [heshe] meekly spreads [hisher] legs for you, putting [hisher] most intimate parts on display. Grinning at the prone elf, you tease and rub at [hisher] [kbreasts], commending [himher] for being such a good [boygirl].", parse);
			}
			else if(kiakai.FirstCock()) {
				Text.Add("Blushing under your ogling, [name] tries to cover [hisher] [kcocks] by hiding [itThem] under [hisher] hands. ", parse);
				if(kiakai.BiggestCock().length.Get() > 30)
					Text.Add("A futile effort, considering [hisher] size. ", parse);
				Text.Add("Annoyed with [hisher] teasing, you swat away the cover, telling the elf to keep [hisher] hands by [hisher] sides.", parse);
				Text.NL();
				parse["bl"] = kiakai.HasBalls() ? Text.Parse(" the [kballs] hanging beneath [itThem],", parse) : "";
				Text.Add("You take your time appraising the elf's form, absently nudging [hisher] legs apart, revealing [name]'s [kcocks],[bl] and - hidden between [hisher] soft cheeks - the tight rosebud of [hisher] anus.", parse);
				Text.NL();
				Text.Add("You give [himher] a few strokes on[oneof] [hisher] member[s] to get [himher] riled up, your other hand playfully pinches one of the elf's nipples.", parse);
			}
			Text.NL();
			parse["l"] = player.HasLegs() ? "one leg" : "your lower body";
			Text.Add("Deciding that it is time to put your own private parts on display, you flip [l] over the elf, straddling [hisher] face, getting a good view of [himher].", parse);
			Text.NL();
			if(player.HasBalls() && player.Balls().size.Get() > 8) {
				Text.Add("[name] has a hard time seeing anything as you plant your [balls] on [hisher] forehead, the plentiful sack partly obscuring [hisher] vision as you drag it over [hisher] face.", parse);
				Text.NL();
			}
			if(player.FirstVag()) {
				Text.Add("You rub your [vag] on the elf's nose, stifling a moan as your repeatedly mash your sensitive [clit] against it.", parse);
				Text.NL();
			}
			if(player.FirstCock()) {
				parse = Text.ParserPlural(parse, player.NumCocks() > 1);
				Text.Add("Letting your [cocks] hover a hair's breadth in front of the elf's open mouth, you enjoy the feeling of [hisher] rapid breathing on the stiffening length[s].", parse);
				Text.NL();
			}
			Text.Add("[name], being a big [boygirl], can figure out what to do by [himher]self. In the meantime, you lick your lips, eyeing the elf's genitalia.", parse);
			Text.Flush();
			
			// REUSED DIALOGUE
			var KIAI1 = function() {
				if(player.FirstCock()) {
					parse["mouthThroat"] = player.FirstCock().length.Get() > 15 ? "throat" : "mouth";
					Text.Add("The elf groans under your cruel teasing, [hisher] complaints somewhat distorted by the [cock] lodged in [hisher] [mouthThroat]. You ignore [himher], shutting [himher] up by feeding some more of your [cock] into [himher].", parse);
					
					Sex.Blowjob(kiakai, player);
					kiakai.FuckOral(kiakai.Mouth(), player.FirstCock(), 1);
					player.Fuck(player.FirstCock(), 1);
				}
				else if(player.FirstVag()) {
					Text.Add("The elf groans under your cruel teasing, [hisher] muffled complaints sending vibrations through your nethers. [HisHer] [ktongue] is hard at work lapping at your [vag], worshipping your feminine sex.", parse);
					Sex.Cunnilingus(kiakai, player);
					kiakai.Fuck(null, 1);
					player.Fuck(null, 1);
				}
				if(player.FirstBreastRow().size.Get() > 3)
					Text.Add(" Your stiff [nips] poke against [hisher] stomach, dragging back and forth as you grind your hips against [name]'s mouth.", parse);
			};
			var KIAI2 = function() {
				var cum = player.OrgasmCum();
				if(player.FirstCock()) {
					Text.Add("Your own climax is building, and you are not going to accept being deterred from it. A few quick thrusts relieve your stress, letting wave after wave of hot spunk flow into the throat of the prone elf.", parse);
					if(cum > 3)
						Text.Add(" [name]'s belly expands noticeably, overflowing with your seed.", parse);
					Text.Add(" You pull out of the panting elf, letting the last of your ejaculate dribble onto [hisher] upturned face.", parse);
				}
				else if(player.FirstVag()) {
					Text.Add("The feeling of [name]'s [ktongue] buried within your [vag] finally becomes too much for you, and you convulse against [hisher] face, coating [himher] with your liquids.", parse);
				}
			};
			
			Text.Flush();
			//[Cock][Vagina][Anal]
			var options = new Array();
			if(kiakai.FirstCock()) {
				options.push({ nameStr : "Cock",
					func : function() {
						var cock = kiakai.BiggestCock();
						
						Text.Clear();
						
						Sex.Blowjob(player, kiakai);
						player.FuckOral(player.Mouth(), kiakai.FirstCock(), 1);
						kiakai.Fuck(kiakai.FirstCock(), 1);
						
						parse["tower"]     = kiakai.NumCocks() > 1 ? "towers" : "a tower";						
						parse["biggest"]   = kiakai.NumCocks() > 1 ? " biggest" : "";
						parse["thickThin"] = cock.length.Get() / cock.thickness.Get() > 5 ? "thin" : "thick";
						parse["l"] = player.HasLegs() ? "between your legs" : "on your crotch";
						Text.Add("You lean in, cupping the elf's [kcocks] lovingly. With meticulous care, you stroke [itThem] to full hardness, rising like [tower] from between [hisher] legs. For a while, you don't do anything other than admire [itThem], marveling at the expertly crafted organ[s]. The touch of [name]'s [ktongue] [l] snaps you back to attention.", parse);
						Text.NL();
						if(kiakai.FirstCock().length.Get() > 25) {
							Text.Add("The sheer size of [hisher][biggest] cock looks almost ridiculous on the elf's lithe body, the [thickThin] member bobbing expectantly under your light touch. Hah, as if you are going to make it that easy for [himher].", parse);
						}
						else {
							parse["tinyAverage"] = cock.length.Get() < 15 ? "tiny" : "average";
							Text.Add("The elf isn't really packing anything special, but [hisher] [tinyAverage] cock[s] [isAre] cute in [itsTheir] own way. Makes you want to play with [itThem], tease [itThem].", parse);
							if(kiakai.NumCocks() > 1) {
								Text.NL();
								Text.Add(" You pick out the biggest one to be the focus of your attentions.", parse);
							}
						}
						Text.NL();
						Text.Add("You grasp the [kcock] firmly at its base, trapping the blood in the engorged member. With your free hand, you prod and tease the rigid shaft, interspersing your pokes with light tantalizing kisses. As you brush the elf's [kcockTip] with your lips, your [tongue] darts out, playing along [hisher] cumslit.", parse);
						Text.NL();
						Text.Add("Retaining your clenching grip of the base of [hisher] dick, you start stroking [himher] with your other hand. Deprived of a normal flow of blood, the veins are starting to stand out, bulging under your deft fingers.", parse);
						Text.NL();
						
						KIAI1();
						
						Text.NL();
						Text.Add("With long, slow strokes, you push the elf closer and closer to the edge, stopping just short of orgasm. For a while, you keep [name] poised on the edge with nothing more than your hot breath on [hisher] quivering [kcockTip]. [HeShe] whines piteously, but focuses on [hisher] own task. Just when [name]'s [kcock] shows signs of softening, you reinvigorate it with a few quick licks, keeping [himher] just on the verge of cumming.", parse);
						Text.NL();
						Text.Add("In a sudden move, you take [hisher] [kcock] into your mouth, sucking and blowing it for all you are worth. [name] cries out into your crotch, [hisher] legs trembling from intense pleasure. Your vice-like grip on [hisher] shaft prevents the poor elf from orgasming, leaving [himher] with no recourse but to attempt to thrust into your maw. You are amused by [hisher] desperate twitches, but don't relinquish your tight embrace.", parse);
						Text.NL();
						
						var cum = kiakai.OrgasmCum();
						
						Text.Add("Exhausted, the elf falls back to the ground.", parse);
						if(kiakai.HasBalls())
							Text.Add(" [HisHer] [kballs] have swollen considerably, [hisher] load prevented from release.", parse);
						Text.NL();
						Text.Add("A flick of your hips reminds [himher] to keep pleasuring you.", parse);
						Text.NL();
						
						KIAI2();
						
						Text.NL();
						Text.Add("Without missing a beat, you begin to drive [name] toward [hisher] next climax. This time, you don't play around, going straight for the kill. Ramming as much as you can of the elf's [kcock] into your mouth, you go at it with great abandon. Your [tongue] grinds the undercarriage of the [thickThin] shaft, occasionally unsuccessful in trying to force its way into [name]'s urethra.", parse);
						Text.NL();
						parse["cum"] = player.FirstCock() ? "filled by your cum" : "showered in your juices";
						Text.Add("Still disoriented from being [cum], the elf can only weakly lap at your nethers, the twitching dick lodged in your throat contrasting sharply with [hisher] otherwise exhausted body. Once again, [name] cries out, pleading for you to let [himher] cum, and you feel a growing pressure at the base of [hisher] cock.", parse);
						Text.Flush();
						
						
						//[Release][Deny]
						var options = new Array();
						options.push({ nameStr : "Release",
							func : function() {
								Text.Clear();
								Text.Add("Taking pity on [name], you pull [himher] out of your mouth, planting one last kiss on [hisher] [kcockTip] before changing your tactics. With your free hand, you rapidly jerk [himher] off, still keeping a tight grip on the base of [hisher] [kcock]. When you judge that [heshe] is about to blow, you suddenly release your hold, letting the elf's liquids flow freely.", parse);
								Text.NL();
								Text.Add("<i>“[playername]! I-it is coming! Aah...”</i> [name] groans weakly, barely able to contain [himher]self - and cum [heshe] does. Like a fountain, the elf's suppressed fluids spew forth, spraying from the violently twitching member.", parse);
								Text.NL();
								
								var cum = kiakai.OrgasmCum();
								if(cum > 3) {
									Text.Add("A copious amount of semen flows from [hisher] dilated cumslit, covering both of you in sticky liquids.", parse);
									Text.NL();
								}
								Text.Add("<i>“Good [boygirl],”</i> you commend [himher], licking your lips contentedly as you gather your gear. The elf is too exhausted to reply. ", parse);
								Text.Flush();
								
								
								kiakai.flags["Sexed"]++;
								
								kiakai.subDom.DecreaseStat(-25, 1);
								
								kiakai.AddLustFraction(-1);
								player.AddLustFraction(-1);
								
								Gui.NextPrompt(kiakai.Interact);
							}, enabled : true,
							tooltip : Text.Parse("Relent and allow the elf to cum. With the amount [heshe] has stacked up, it'll probably be a big one.", parse)
						});
						options.push({ nameStr : "Deny",
							func : function() {
								Text.Clear();
								Text.Add("<i>“You'll have to do better than that,”</i> you tell [himher] as you briefly surface, licking [name]'s [kcock] slowly while awaiting [hisher] response.", parse);
								Text.NL();
								Text.Add("<i>“Please!”</i> the elf whines piteously.", parse);
								Text.NL();
								Text.Add("<i>“Beg for it.”</i>", parse);
								Text.NL();
								Text.Add("<i>“Please, [playername], I beg of you!”</i> [name] pleads with you, jerking [hisher] hips futilely in an attempt to dislodge your grip. Your only response is to tighten it further.", parse);
								Text.NL();
								Text.Add("<i>“You'll cum when I allow you to, not before,”</i> you counter, letting your [tongue] play along the tip of the elf's cock. Powerless to resist, [name] falls back, letting you do as you please.", parse);
								Text.NL();
								Text.Add("You feel [name]'s legs tremble in ecstasy at least once more during your slow sensory torture. Your clenching grip doesn't allow even a single drop of [hisher] ejaculate escape. Gradually, you reduce your teasing to occasionally prodding at the [kcock], your hot breath a constant reminder to the elf that your mouth is barely an inch away, hovering but never touching.", parse);
								Text.NL();
								Text.Add("Finally, [hisher] own body caves in, too exhausted to keep up. In disappointment, you watch as [hisher] erection slowly shrinks down. Only when it's fully retracted do you relinquish your grip, releasing not a spray, but a slow, steady trickle of the elf's stacked-up orgasms.", parse);
								if(kiakai.CumOutput() > 3)
									Text.Add(" Like from a broken faucet, semen keeps flowing from [name]'s cock for a long time, dribbling down [hisher] sides to pool all around [himher].", parse);
								Text.NL();
								Text.Add("You get up and stretch sinuously, prodding at [name] to get up. Though [heshe] has been pushed beyond the brink of exhaustion, [hisher] flushed cheeks indicate [heshe] is still incredibly turned on. Perhaps you've discovered - or developed - a masochistic streak in your elven companion?", parse);
								Text.Flush();
								
								kiakai.flags["Sexed"]++;
								
								kiakai.subDom.DecreaseStat(-35, 2);
								if(kiakai.subDom.Get() > -15)
									kiakai.relation.DecreaseStat(-20, 1);
								
								kiakai.AddLustFraction(1);
								player.AddLustFraction(-1);
					
								Gui.NextPrompt(kiakai.Interact);
							}, enabled : true,
							tooltip : Text.Parse("Toy with [himher] some more. Make [himher] really beg.", parse)
						});
						Gui.SetButtonsFromList(options);
					}, enabled : true,
					tooltip : Text.Parse("Focus on [hisher] [kcocks].", parse)
				});
			}
			if(kiakai.FirstVag()) {
				options.push({ nameStr : "Vagina",
					func : function() {
						Text.Clear();
						
						Sex.Cunnilingus(player, kiakai);
						player.Fuck(null, 1);
						kiakai.Fuck(null, 1);
						
						Text.Add("With your fingers, you spread the elf's labia, revealing the glistening pink flesh within. You confidently dig in, tasting your companion's most private parts. Your [tongue] circles the outer lips several times before moving on to your main course: [name]'s inviting cleft. Reaching in deeply, you jam your flexible organ inside [himher], lapping up [hisher] fluids gleefully.", parse);
						Text.NL();
						parse["cockCuntTaint"] = player.FirstCock() ? "cock" : player.FirstVag() ? "cunt" : "taint";
						Text.Add("[name] definitely appreciates your fervor, moaning against your [cockCuntTaint] as you eat [himher] out. A single strand of saliva mixed with [hisher] juices connects the tip of your tongue with [hisher] tunnel as you briefly surface for air, dripping over [hisher] crotch.", parse);
						Text.NL();
						Text.Add("Once you've sated your thirst, you switch to using your fingers instead, pushing first two, then three inside [name]'s [kvag]. Working up a slow rhythm, you start pumping the elf, probing [himher] intimately.", parse);
						// TODO: STRETCH VARIATIONS?
						Text.NL();
						Text.Add("Your free hand busies itself toying with [name]'s [kclit], gently caressing the sensitive organ. [HeShe] easily succumbs under your combined assault, [hisher] limbs melting to putty under your hands.", parse);
						Text.NL();
						
						KIAI1();
						
						Text.NL();
						Text.Add("By this point, your hand is practically soaked in [name]'s sweet secretions. Lubricated by [hisher] natural juices, your fingers slide in and out of [hisher] wet cleft effortlessly. The elf's high-pitched moans remind you that you are doing all of the work here. Displeased, you grind down against [hisher] face.", parse);
						Text.NL();
						Text.Add("<i>“Hey, show a little effort,”</i> you complain, withdrawing your fingers from [name]'s [kvag]. The elf opens [hisher] legs wider in response. [HisHer] [ktongue] starting work on your nethers, your submissive companion reaches down between [hisher] legs, meekly spreading [hisher] labia for you. The sight makes your mouth water.", parse);
						Text.NL();
						if(player.LongTongue()) {
							parse["virgin"] = kiakai.FirstVag().virgin ? " where no dick has gone before" : "'s deflowered tunnel";
							Text.Add("Your snake-like tongue dives into [name]'s welcoming snatch, boring deep inside [himher]. The sheer length of your appendage makes it a rival of any cock as far as penetration goes, drilling into the elf[virgin].", parse);
							Text.NL();
							Text.Add("Taste buds all along your engorged organ sample [name]'s clear liquids, and you hungrily slurp them up as you thrust your [tongue] into the willing elf. Without warning, [hisher] tunnel clamps down around you, and you feel the elf spasm beneath you.", parse);
						}
						else {
							Text.Add("You are hard pressed to resist such a pretty gift, and greedily dig in. Slurping up any stray liquids trickling from the inviting slit, you let your [tongue] play a bit with [name]'s [kvag] before focusing on [hisher] [kclit].", parse);
							Text.NL();
							Text.Add("After preparing the elf with kisses, licks, and nibs, you envelop [hisher] [kclit] completely, taking it into your mouth. Ever so carefully, you gently bite at the sensitive nub, sending sparks of electricity racing straight up the surprised elf's spine. Overwhelmed by the pleasure, [heshe] cries out, [hisher] back arching, pressing [himher] against your [breasts].", parse);
						}
						Text.NL();
						Text.Add("Really, [name] needs to be trained better than this; <i>[heshe]</i> should be the one pleasuring you, not the other way around. Climaxing or not, you're going to make [himher] work for it. You slowly gyrate your hips, reasoning that if the elf can't keep up, you'll make a concerted effort on your own.", parse);
						Text.NL();
						
						var cum = kiakai.OrgasmCum();
						
						KIAI2();
						
						Text.Flush();
						
						Gui.NextPrompt(function() {
							Text.Clear();
							Text.Add("There, much better.", parse);
							Text.NL();
							Text.Add("You aren't done with your little elf just yet though. No sooner has [heshe] finished trembling from [hisher] last climax, you jump right back in, this time using both your hands and your [tongue] to drive [himher] toward another orgasm.", parse);
							Text.NL();
							Text.Add("It's not long before your plans come to fruition in a sticky, sloppy mess. You possessively pat [name]'s mound before getting up, gathering your gear.", parse);
							
							var cum = kiakai.OrgasmCum();
							
							Text.Flush();
							
							kiakai.flags["Sexed"]++;
							
							kiakai.subDom.DecreaseStat(-30, 1);
							
							kiakai.AddLustFraction(-1);
							player.AddLustFraction(-1);
				
							Gui.NextPrompt(kiakai.Interact);
						});
						
						
					}, enabled : true,
					tooltip : Text.Parse("Focus on [hisher] [kvag].", parse)
				});
			}
			options.push({ nameStr : "Anal",
				func : function() {
					
					Text.Clear();
					
					player.AddSexExp(2);
					kiakai.AddSexExp(2);
					
					if(kiakai.FirstCock()) {
						Text.Add("[name]'s [kcocks] twitch[notEs] hopefully, but you've got other things in mind. Circumventing the erect member[s], you spread [hisher] cheeks, exposing [hisher] [kanus].", parse);
					}
					else if(kiakai.FirstVag()) {
						Text.Add("[name]'s [kvag] sure looks tempting, but you are interested in another orifice right now. Spreading [hisher] cheeks, you expose [hisher] [kanus], ripe for the picking.", parse);
					}
					else {
						Text.Add("Given little else to work with, you decide to focus on [name]'s [kbutt]. You let your fingers trail down [hisher] taint, reaching for [hisher] [kanus].", parse);
					}
					Text.NL();
					var eagerness = kiakai.flags["AnalExp"] * (1+kiakai.LustLevel()*kiakai.Butt().Tightness());
					if(eagerness < 50) {
						Text.Add("You attempt to push some of your digits into the elf's tight rosebud, but you are immediately met with resistance. Only with a lot of effort and a bit of saliva do you manage to breach [hisher] defenses, plunging first one, then two fingers into [hisher] stubborn hole.", parse);
					}
					else {
						Text.Add("The elf's well-trained sphincter opens effortlessly the moment you apply a tiny bit of pressure on it, greedily swallowing three of your fingers without any trouble. The ease only goes to show the amount of anal experience [heshe] has accumulated over your travels together.", parse);
					}
					Text.NL();
					Text.Add("You quickly build a rhythm, repeatedly pushing your digits inside [name], up to the knuckle. Each time, the passage is a bit easier as the elf begins to adjust to your insistent intrusion. Pretty soon, the elf's dilated anus allows you to add another member to your exploration team. [name] groans, but clearly appreciates your efforts.", parse);
					Text.NL();
					Text.Add("Pulling your slick digits out of [himher], you allow [hisher] ring muscle to close a bit before resuming your thrusting, repeating the initial penetration a few times. Before long, you've exhausted [hisher] endurance, leaving [hisher] opening gaping slightly each time you vacate it.", parse);
					Text.NL();
					
					KIAI1();
					
					Text.NL();
					parse["cuntTaint"] = kiakai.FirstVag() ? "cunt" : "taint";
					Text.Add("Switching gears, you use fingers from both hands to spread [name]'s asshole, opening the pink rosebud for you like a blooming flower. Leaning in, you let your [tongue] rake across [hisher] sensitive [cuntTaint] before finding its target, boring deep inside [name]'s [kanus].", parse);
					Text.NL();
					Text.Add("You gyrate your [hips] slowly, pressing your [gen] against [name], urging [himher] to fulfill [hisher] end of the bargain. Without pause, you continue to focus on the elf's butt, licking the orifice meticulously clean and teasing [himher] mercilessly.", parse);
					Text.NL();
					Text.Add("You ask [himher] if [heshe] wants you to keep going. Moaning affirmation. How deep? Loud moan. You flex your fingers, a wicked smile on your face. This time, entry is easier, as [name] has relaxed completely, accepting whatever you push into [himher].", parse);
					
					parse["pen"] = function() { return Text.Parse("the [toy]", parse); };
					
					Text.Flush();
					
					var options = new Array();
					options.push({ nameStr : "Fingers",
						func : function() {
							parse["pen"] = function() { return Math.random() > 0.5 ? "your fingers" : "your digits"; };
							Text.Clear();
							Text.Add("By now, three fingers hardly offer any resistance, so you add another one to the mix. You build up a rapid rhythm, plunging deep inside [name]'s [kanus].", parse);
							if(kiakai.FirstCock())
								Text.Add(" Cupping them and pushing them in up to the knuckles, you just about manage to reach [hisher] prostate, prodding the sensitive organ with each thrust.", parse);
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip : "Use your fingers."
					});
					if(player.LongTongue()) {
						options.push({ nameStr : "Tongue",
							func : function() {
								parse["pen"] = function() { return Text.Parse("your [tongue]", parse); };
								Text.Clear();
								Text.Add("Your [tongue], rival to a cock in length, snakes out and buries itself deep inside [name], immediately beginning to thrust in and out.", parse);
								if(kiakai.FirstCock())
									Text.Add(" Due to your size, you can easily reach [hisher] prostate, each thrust mashing your [tongue] against the sensitive elf's sensitive pleasure button.", parse);
								Gui.PrintDefaultOptions();
							}, enabled : true,
							tooltip : Text.Parse("Use your [tongue].", parse)
						});
					}
					
					var addToy = function(toy) {
						if(party.inventory.QueryNum(toy)) {
							var toySize = toy.cock.length.Get();
							var cap = kiakai.Butt().capacity.Get() * (0.75 + kiakai.LustLevel() + kiakai.flags["AnalExp"] / 100);
							options.push({ nameStr : toy.name,
								func : function() {
									parse["toy"] = toy.sDesc();
									parse["pen"] = Text.Parse("the [toy]", parse);
									parse["itThem"]  = toy.plural ? "them" : "it";
									parse["all"] = toy.plural ? "all of them" : "the entire thing";
									Text.Clear();
									Text.Add("Leaving [name]'s hole unattended for a moment, you rummage through your inventory, triumphantly pulling out your [toy].", parse);
									Text.NL();
									Text.Add("<i>“Hey, [name], think you can take this?”</i> You grin, waving the toy over your shoulder.", parse);
									Text.NL();
									
									if(toySize > cap) {
										parse["legs"] = player.LegsDesc();
										parse["l"] = player.HasLegs() ? Text.Parse("legs trapping [himher] on either side", parse) : Text.Parse("your [legs] trapping [himher]", parse);
										Text.Add("[name] looks panicky, but in [hisher] current position, there isn't much that [heshe] can do to stop you. [HeShe] fervently tries to shake [hisher] head, but [heshe] can barely move thanks to your [l].", parse);
										Text.NL();
										Text.Add("<i>“Ha... wanna bet?”</i> You smile as you lube up the [toy], preparing [itThem] for entry. You aren't <i>completely</i> heartless after all. Initial penetration is a bit difficult, but your previous probing pays off, allowing [name] to somehow accommodate the [toy]. Without missing a beat, you begin the slow and inexorable process of stuffing [all] inside the submissive elf. A third... half... each time you thrust [itThem] inside, a little more of the huge toy probes [hisher] depths.", parse);
									}
									else if(toySize > cap/2) {
										parse["cuntAss"] = player.FirstVag() ? "cunt" : "ass";
										Text.Add("[name]'s eyes widen slightly as you brandish the large toy. Bravely or lustfully - you are not sure - [heshe] doesn't voice any complaints.", parse);
										if(player.FirstCock())
											Text.Add(" The cock lodged in [hisher] throat might also have something to do with it.", parse);
										else if(player.FirstVag())
											Text.Add(" That [hisher] [ktongue] is buried in your [cuntAss] might also have something to do with it.", parse);
										Text.NL();
										Text.Add("With the help of some lube, you are able to stuff the [toy] into the elf with relative ease, only meeting serious resistance once most of [itThem] rests deep within [himher].", parse);
									}
									else {
										Text.Add("[name] looks a bit dubious, but nods slightly, giving [hisher] consent. With the help of a little lube, the penetration is almost effortless, the elf's [kanus] easily spreading around the [toy]. You begin to thrust [itThem] into [himher] rapidly, relying on speed rather than size to get the elf off.", parse);
									}
									kiakai.flags["AnalExp"]++;
									Gui.PrintDefaultOptions();
								}, enabled : toySize < 2*cap,
								tooltip : Text.Parse("Use [toy] on [name].", {name: kiakai.name, toy: toy.name})
							});
						}
					};
					
					addToy(Items.Toys.SmallDildo);
					addToy(Items.Toys.MediumDildo);
					addToy(Items.Toys.LargeDildo);
					addToy(Items.Toys.ThinDildo);
					addToy(Items.Toys.ButtPlug);
					addToy(Items.Toys.LargeButtPlug);
					addToy(Items.Toys.AnalBeads);
					addToy(Items.Toys.LargeAnalBeads);
					addToy(Items.Toys.EquineDildo);
					addToy(Items.Toys.CanidDildo);
					addToy(Items.Toys.ChimeraDildo);
					
					Gui.Callstack.push(function() {
						Text.NL();
						Text.Add("It's not long before [name]'s filled [kanus] constricts, and the elf's entire body shakes in pleasure. With a nudge of your [hips], you remind [himher] to return the favor. [HeShe] meekly complies, going down on your nethers with renewed vigor.", parse);
						Text.NL();
						
						var cum = kiakai.OrgasmCum();
						
						KIAI2();
						
						Text.NL();
						Text.Add("You have barely gotten started. You resume pumping [pen] in and out of [name]. It doesn't take long before [name] is overwhelmed by another anal orgasm, yet you keep going.", parse);
						
						var cum = kiakai.OrgasmCum();
						
						if(kiakai.FirstCock()) {
							Text.NL();
							parse = Text.ParserPlural(parse, kiakai.NumCocks() > 1);
							Text.Add("Weak jets of elven cum add to the already substantial mess on the elf's stomach, painting [himher] a sticky white. [HisHer] [kcocks] twitch[notEs] pitifully, completely milked of [itsTheir] contents.", parse);
						}
						else if(kiakai.FirstVag()) {
							Text.NL();
							Text.Add("Streams of clear liquid flow from the elf's [kvag], further lubing [pen], making your thrusts even smoother.", parse);
						}
						Text.Flush();
					
						Gui.NextPrompt(function() {
							Text.Clear();
							Text.Add("Finally, you figure enough is enough. [name] probably can't cum more anyway. Gathering up your gear, you poke at the exhausted elf, telling [himher] to get up. [HeShe] scrambles after you, still disoriented.", parse);
							Text.Flush();
							
							kiakai.flags["AnalExp"]++;
							kiakai.flags["Sexed"]++;
							
							kiakai.subDom.DecreaseStat(-30, 1);
							
							kiakai.AddLustFraction(-1);
							player.AddLustFraction(-1);
				
							Gui.NextPrompt(kiakai.Interact);
						});
					});
					
					if(options.length > 1) {
						Text.NL();
						Text.Add("...Which gives you a naughty idea.", parse);
						Text.Flush();
						Gui.SetButtonsFromList(options);
					}
					else {
						Text.Flush();
						Gui.NextPrompt(options[0].func);
					}
				}, enabled : true,
				tooltip : Text.Parse("Have some fun with [hisher] butt.", parse)
			});
			
			Gui.SetButtonsFromList(options);
			
		}, enabled : true,
		tooltip : Text.Parse("Have [name] get down on [hisher] back and mount [himher], giving you full access to their own genitalia.", parse)
	});
	options.push({ nameStr : "Anal",
		func : function() {
			Text.Clear();
			
			// First time
			if(kiakai.flags["AnalExp"] < 2) {
				Text.Add("<i>“Like what you see?”</i> you tease the prone elf, shuffling your hips slightly, bringing your [gen] closer to [hisher] face. [name]'s face is bright red at this point, unable to tear [hisher] eyes off you.", parse);
				Text.NL();
				Text.Add("Suddenly getting a very naughty idea, you reach down and touch the elf's forehead, mock concern in your voice. <i>“[name]! Your skin is burning, are you ok?”</i>", parse);
				Text.NL();
				parse["leg"] = player.LegDesc();
				Text.Add("Mumbling, [name] assures you that [heshe] is fine, avoiding your gaze, but you'll have none of it. <i>“Can't have the healer getting a fever, can we?”</i> You instruct your companion to lie down across your lap, face down. A bit doubtful, the elf complies to your wishes. [HeShe] shudders slightly as [hisher] [kgen] accidentally brush against your [leg]. Apologetically, [heshe] shifts around, raising [hisher] butt to break the contact. Coincidentally, this suits your intentions perfectly.", parse);
				Text.NL();
				Text.Add("<i>“I'm going to take your temperature,”</i> you announce, licking two of your fingers in preparation. <i>“It might sting a bit at first, but don't worry, you tended to me and now I will tend to you.”</i>", parse);
				Text.NL();
				Text.Add("<i>“[playername], this really is not neces- AAAHHH!”</i> [name]'s complaint is suddenly cut off as you press two fingers into [hisher] tight rosebud. The quivering elf moans in confused appreciation as you probe deeper, exploring [hisher] back passage.", parse);
				Text.NL();
				
				if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
					Text.Add("<i>“W-what are you doing?!”</i> [name] sounds confused and slightly frightened. You assure [himher] that there is nothing to worry about, and that [heshe] shouldn't be such a baby.", parse);
				else
					Text.Add("<i>“A-are you really sure that is- haah! -the right way to do it?”</i> [name] groans, uncertain but seemingly putting [hisher] trust in you.", parse);
				Text.NL();
				
				Text.Add("Knuckle-deep, you make some show of probing around", parse);
				if(kiakai.FirstCock())
					Text.Add(", inadvertently pushing against [hisher] prostate", parse);
				parse["thighs"] = player.ThighsDesc();
				Text.Add(". The elf, despite [hisher] protests, seems to be really getting into it, if the fluids dripping on your [thighs] are any indication.", parse);
				Text.NL();
				
				if(kiakai.flags["AnalExp"] == 1) {
					Text.Add("<i>“You really seem to like this kind of stuff, you know,”</i> you muse, reminding [himher] of your first meeting, and the way it ended.", parse);
					Text.NL();
				}
				
				Text.Add("Deftly pumping your digits in and out of the quivering elf, you commend [himher] for being such a good [boygirl]. [name]'s only response is a whorish moan as you rail [hisher] [kanus].", parse);
				Text.NL();
				Text.Add("Deciding that you are done for now, you withdraw your fingers, allowing the elf some breathing room. <i>“You seem to be fine,”</i> you assure your panting companion, <i>“but I might have to check again later.”</i> With that, you give [name] a playful swat on [hisher] butt, telling [himher] to get dressed.", parse);

				player.AddSexExp(5);
				kiakai.AddSexExp(5);
				kiakai.subDom.DecreaseStat(-100, 5);
				kiakai.flags["AnalExp"] = 2;
				kiakai.flags["Sexed"]++;
			}
			// REPEAT SCENE
			// TODO: ADD TOYS SCENE
			else {
				parse["thigh"] = player.ThighDesc();
				Text.Add("<i>“It was a while since I last checked your temperature,”</i> you muse suggestively, absently patting your [thigh]. [name] [analAtt] sits on your lap, waiting to see what you will do next. Languidly, you caress [hisher] cheek before lazily wriggling your fingers in front of [hisher] face. Hypnotized, the elf's eyes follow your movements attentively.", parse);
				Text.NL();
				
				var numFingers = 0;
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“You know well what's coming,”</i> you tease [himher], sucking on first one, then another, and finally a third finger. [name]'s eyes widen slightly with each digit you prepare, gulping.", parse);
					numFingers = 3;
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Tell you what, this time, why don't you decide?”</i> you suggest, presenting [name] with your hand, urging [himher] to prepare as many as [heshe] thinks [heshe] can take.", parse);
					Text.NL();
					
					numFingers = (kiakai.LustLevel() + 2) * Math.log(kiakai.flags["AnalExp"]);
					if(numFingers < 1) numFingers = 1;
					if(numFingers > 5) numFingers = 5;
					numFingers = Math.floor(numFingers);
					
					switch(numFingers) {
						default:
						case 1: Text.Add("Uncertain, the elf puts one of your offered digits into [hisher] mouth, avoiding your slightly disappointed gaze.", parse); break;
						case 2: Text.Add("[name] licks and sucks at two of your offered digits, getting them ready.", parse); break;
						case 3: Text.Add("Slightly fearful, [name] chooses to lather three of your offered fingers. You smile at [himher] encouragingly, knowing [heshe] can probably take them.", parse); break;
						case 4: Text.Add("Lustfully inspecting your fingers, [name] prepares one after another, lathering up four of them with [hisher] tongue.", parse); break;
						case 5: Text.Add("Unmistakable lust in [hisher] eyes, [name] eagerly lathers each of your fingers slowly, coating all of them in saliva. When [heshe] is done with your fingers, the elf proceeds to lick the back of your hand.", parse); break;
					}
				}, 1.0, function() { return true; });
				scenes.Get();
				
				player.AddSexExp(2);
				kiakai.AddSexExp(numFingers);
				
				Text.NL();
				
				parse.numFingers = Text.NumToText(numFingers);
				parse.s = numFingers > 1 ? "s" : "";
				
				Text.Add("<i>“Now then...”</i> in a sultry voice, you coax [name] to shuffle around in your lap, presenting you with [hisher] butt. Knowing what to expect, the elf shudders in pleasure as you insert your first digit into [hisher] [kanus].", parse);
				if(numFingers > 1) {
					Text.NL();
					Text.Add("Gradually spreading [name]'s back passage for easier access, you put another finger in.", parse);
					if(numFingers > 2) {
						Text.Add(" You keep it up until all your [numFingers] digits are prodding at [hisher] insides.", parse);
						if(numFingers >= 5) {
							Text.Add(" Even as flexible as [name] has become, you are a bit doubtful about pushing your whole hand in there; can [heshe] really take it?", parse);
						}
					}
				}
				
				Text.NL();
				Text.Add("Easing into a slow but insistent rhythm, you piston your finger[s] up to the knuckle[s], your other hand busy stroking the elf's hair, whispering to [himher] to endure, that this is for [hisher] own good. [name] is biting [hisher] lip cutely, trying and failing to stifle [hisher] undignified moans.", parse);
				Text.NL();
				
				if(numFingers < 5) {
					Text.Add("<i>“I think you are growing to like this,”</i> you comment on [name]'s whimpering moans. <i>“I-it is just to see that I am healthy, right?”</i> the elf gasps between [hisher] cries of pleasure.", parse);
					Text.NL();
					Text.Add("<i>“Oh, you seem to be <b>very</b> healthy indeed,”</i> you congratulate your companion, one hand busy caressing [hisher] silky hair, the other deep inside [hisher] [kanus].", parse);
					Text.NL();
					Text.Add("Increasing your pace, you bring the horny elf to a shuddering climax", parse);
					
					if(kiakai.FirstCock())
						Text.Add(", [hisher] [kcock] depositing its load on your [legs]", parse);
					if(kiakai.FirstVag())
						Text.Add(", a trickle of feminine juices trailing down [hisher] [kleg] from [hisher] [kvag]", parse);
					Text.Add(".", parse);
				}
				else {
					Text.Add("<i>“You asked for it, horny little elf,”</i> you mutter under your breath, slowly pushing more and more of your hand into [hisher] [kanus]. [name] cries out loudly - if in pleasure or pain you cannot tell - as the widest part of your hand suddenly pops past [hisher] formerly tight ring.", parse);
					Text.NL();
					Text.Add("Almost surprised yourself, you chuckle as you allow the elf some time to relax before exploring the extent of your newfound reach. You can push a fair bit of your arm up [hisher] [kanus] before encountering resistance.", parse);
					Text.NL();
					Text.Add("<i>“Mmm, seems I have trained you well, [name],”</i> you tease the elf as your fist wreaks havoc on [hisher] insides.", parse);
					Text.NL();
					parse["thighs"] = player.ThighsDesc();
					
					if(kiakai.FirstCock()) {
						Text.Add("Settling to a halt far inside, you cup your hand, massaging [hisher] prostate. This almost immediately causes the delirious elf to launch into orgasm, [hisher] [kcocks] painting sticky trails across your [thighs].", parse);
					}
					else {
						Text.Add("Taking care not to harm [himher], you slowly pump your arm in and out of [name]. The elf seems to be very happy with your treatment, begging for you to go faster, go deeper. Shuddering, [hisher] [kvag] finally gives in, leaking girly fluids across your [thighs].", parse);
					}
				}
				
				Text.NL();
				if(Math.random() < 0.8)
					Text.Add("<i>“I-I do not have a fever, do I?”</i> [name] asks you, <i>“I feel a bit weird...”</i> You assure [himher] that [heshe] is fine.", parse);
				else
					Text.Add("<i>“Y-you are so rough with your healing,”</i> [name] mutters, <i>“yet it feels good...”</i> You can only smile as the elf reveals [hisher] true colors.", parse);
				Text.NL();
				Text.Add("You pull out of the tight canal and leave the elf in a trembling pile, looking around for somewhere to get cleaned up.", parse);
			}
			Text.Flush();
			player.AddLustFraction(0.1);
			
			var cum = kiakai.OrgasmCum();
			
			kiakai.flags["Sexed"]++;
			Gui.NextPrompt(kiakai.Interact);
		}, enabled : true,
		tooltip : "Train your elf, using your fingers."
	});
	Gui.SetButtonsFromList(options);
}

KiakaiSex.Sex = function() {
	Text.Clear();
	
	// TODO Toys
	var playerCock = player.FirstCock() || (player.strapOn ? player.strapOn.cock : null);
	var kiaiCock   = kiakai.FirstCock() || (kiakai.strapOn ? kiakai.strapOn.cock : null);
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,		
		kCockDesc2   : function() { return kiakai.AllCocks()[1].Short(); },		
		boygirl      : kiakai.body.femininity.Get() > 0 ? "girl" : "boy"		
	};
	
	parse = kiakai.ParserPronouns(parse);
	parse = kiakai.ParserTags(parse, "k");
	parse = player.ParserTags(parse);
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.gen = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	parse.kgen = kiakai.FirstCock() ? function() { return kiakai.MultiCockDesc(); } :
					kiakai.FirstVag() ? function() { return kiakai.FirstVag().Short(); } :
					"featureless crotch";
					
	if(kiakai.flags["TalkedSex"] == 0) {
		Text.Add("<i>“[name]...”</i> you start out, uncertain how to broach the topic.", parse);
		Text.NL();
		Text.Add("<i>“Yes, [playername], what is on your mind?”</i> the elf responds curiously.", parse);
		Text.NL();
		Text.Add("You remind [himher] of the many... intimate moments that the two of you have shared. [name] blushes as [heshe] recalls some of your raunchier adventures. Does [heshe] want to... take things a step further?", parse);
		Text.NL();
		Text.Add("<i>“W-what do you mean?”</i> [name]'s gaze flicks about nervously, reminding you of a cornered deer. You draw a lock of hair out of [hisher] eyes, framing the elf's pretty, feminine face. This does nothing to calm [himher] down.", parse);
		Text.NL();
		Text.Add("What approach should you take to convince the elf?", parse);
		Text.Flush();

		kiakai.AddLustFraction(1);
		
		//[Love][Friend][Fuck][Nevermind]
		var options = new Array();
		options.push({ nameStr : "Love",
			func : function() {
				Text.Clear();
				Text.Add("You pour your heart out to your companion.", parse);
				Text.NL();
				Text.Add("<i>“[playername], I... I do not know what to say,”</i> [name] stammers, flustered. <i>“I... I like you too, of course... I...”</i> [HeShe] averts [hisher] gaze, continuing in a small voice, <i>“I... like you a lot.”</i>", parse);
				Text.NL();
				Text.Add("You pull [name] into a tight embrace, hugging [himher] close. Your hands trace down [hisher] spine, caressing [hisher] [kbutt]. The elf, who is pressed tightly against your [breasts], gives a surprised yelp. You whisper in [hisher] ear that you are there for [himher], that you want [himher], right here, right now.", parse);
				Text.NL();
				Text.Add("<i>“I... I...”</i> Almost tearful, [name] pushes you away. <i>“I cannot, [playername], please do not ask this of me. Resisting is too difficult.”</i> You restrain yourself from reaching out to the vulnerable elf, giving [himher] some space. [name] moves away, throwing a peek at you now and then.", parse);
				Text.NL();
				Text.Add("There seems to be something deeper at works here that you have to deal with before broaching the subject again.", parse);
				Text.Flush();
				
				kiakai.relation.IncreaseStat(100, 15);
				kiakai.subDom.IncreaseStat(0, 10);
				kiakai.flags["Attitude"] = Kiakai.Attitude.Nice;
				kiakai.flags["TalkedSex"] = 1;
				
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : kiakai.flags["Attitude"] > Kiakai.Attitude.Neutral || kiakai.relation.Get() > 10,
			tooltip : "Confess that you love the elf."
		});
		options.push({ nameStr : "Friend",
			func : function() {
				Text.Clear();
				Text.Add("The two of you have gotten to know each other by now, right?", parse);
				Text.NL();
				Text.Add("<i>“Uhm, I suppose?”</i> [name] still looks a bit uncertain. You take [hisher] hand into yours, pulling [himher] closer. Quite honestly, you express that you couldn't have made it on Eden without [hisher] help, and you want to express your gratitude. You want [himher] to feel special.", parse);
				Text.NL();
				Text.Add("<i>“I... I did not know you felt that way about it, [playername],”</i> [name] blushes prettily, happy with [himher]self. <i>“I am glad that I have been of use to you.”</i>", parse);
				Text.NL();
				Text.Add("You explain that [heshe] is much more than that to you. Pulling [himher] close, you whisper in [hisher] ear that if [heshe]'ll let you, you will show [himher] your appreciation in a far more intimate manner.", parse);
				Text.NL();
				Text.Add("As the coin finally drops for [name], [heshe] begins to stutter a confused response. You silence [himher] with a kiss on the lips. For a moment, the two of you are joined, one being, hearts beating as one.", parse);
				Text.NL();
				Text.Add("Far too soon, [name] pushes you away. <i>“I... I really cannot, [playername], as much as I would like to.”</i> The elf looks defeated as [heshe] walks off, leaving you alone.", parse);
				Text.NL();
				Text.Add("There seems to be something deeper at works here that you have to deal with before broaching the subject again.", parse);
				Text.Flush();
				
				kiakai.relation.IncreaseStat(100, 5);
				kiakai.flags["TalkedSex"] = 1;
				
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : kiakai.relation.Get() > 0,
			tooltip : "With all that you've gone through together, shouldn't the two of you try to get a bit closer?"
		});
		options.push({ nameStr : "Fuck",
			func : function() {
				Text.Clear();
				Text.Add("You ask [name], quite bluntly, if [heshe] wants to have sex with you. For a long time, [heshe] does nothing but stare at you in disbelief, mouth opening and closing as the elf tries to form a coherent sentence in [hisher] mind.", parse);
				Text.NL();
				Text.Add("<i>“W-why this all of a sudden?”</i> [heshe] asks, bewildered. <i>“I... I cannot agree to something like that!”</i> [heshe] splutters.", parse);
				Text.NL();
				Text.Add("How come? [HeShe] seemed perfectly happy about it just before, the way [heshe] was moaning.", parse);
				Text.NL();
				Text.Add("<i>“That is different!”</i> the elf exclaims, eyes darting around, looking for a way to escape. <i>“The arts of healing are nothing as perverse as that!”</i> Considering the lewd sounds you've heard [name] make, you'd beg to differ. [HeShe]'d be better off just bending over and accepting it; you'll have [himher] screaming in pleasure in no time.", parse);
				Text.NL();
				Text.Add("<i>“N-no!”</i> [name] blurts out, hastily moving off, blushing furiously.", parse);
				Text.NL();
				Text.Add("There seems to be something deeper at works here that you have to deal with before broaching the subject again.", parse);
				Text.Flush();
				
				kiakai.relation.DecreaseStat(-100, 5);
				kiakai.subDom.DecreaseStat(-35, 10);
				kiakai.flags["Attitude"] = Kiakai.Attitude.Naughty;
				kiakai.flags["TalkedSex"] = 1;
				
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : kiakai.subDom.Get() < -25 || kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral,
			tooltip : Text.Parse("Ask [himher] to put out.", parse)
		});
		options.push({ nameStr : "Nevermind",
			func : function() {
				Text.Clear();
				Text.Add("You decide to drop the topic for now, though [name] looks at you with uncertainty.", parse);
				Text.Flush();
				
				Gui.NextPrompt(kiakai.Interact);
			}, enabled : true,
			tooltip : "No, this isn't the time."
		});
		Gui.SetButtonsFromList(options);
	}
	// TODO: Reactivate for kiai cock scene
	else if(!playerCock && !kiaiCock) {
		Text.Add("Unfortunately, you lack the appropriate equipment.", parse);
		Text.Flush();
		
		Gui.NextPrompt(kiakai.Interact);
	}
	else if(kiakai.flags["TalkedSex"] == 2) {
		Text.Add("You ask [name] if [heshe] remembers what you talked about before. [HeShe] blushes once [heshe] realize what you mean.", parse);
		Text.NL();
		Text.Add("<i>“R-really? Here? Now?”</i> [heshe] mumbles, fiddling with the hem of [hisher] dress. <i>“V-very well. How... will you have me?”</i>", parse);
		Text.Flush();
		
		kiakai.relation.IncreaseStat(100, 5);
		
		//[Passive][Mutual][Dig in]
		var options = new Array();
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Have you...? Don't you think it's time you took some initiative?”</i> you challenge the elf.", parse);
				Text.NL();
				Text.Add("<i>“I... Ah...”</i> [name] looks a bit nervous, as if [heshe] isn't sure on how to proceed.", parse);
				Text.NL();
				Text.Add("<i>“Come now,”</i> you tease as you begin to remove your gear, <i>“don't you remember when we first met? You seemed to have the right idea at the time.”</i>", parse);
				Text.NL();
				Text.Add("<i>“T-that was something I had to do!”</i> the elf exclaims, flustered, <i>“had I not cared for you...”</i> [HeShe] trails off as [heshe] realizes that you are just messing with [himher]. [name] gathers [hisher] courage, blushing as memories of your many sexual encounters wash over [himher]. By accounts of all the things you have done together, this shouldn't really bother the elf, yet [heshe] is fidgeting, dragging out the process of removing [hisher] clothes.", parse);
				Text.NL();
				Text.Add("<i>“Well, won't you tell me what to do?”</i> you murmur provocatively, twirling around in a circle to show off yourself. <i>“You should have a few ideas after our little talk.”</i>", parse);
				Text.NL();
				Text.Add("<i>“[playername]... I would like...”</i> [name] stammers.", parse);
				Text.Flush();
				
				kiakai.subDom.IncreaseStat(20, 10);
				
				kiakai.flags["TalkedSex"] = 3;
				KiakaiSex.SexPrompt(Kiakai.SexFirstAttitude.Passive);
			}, enabled : true,
			tooltip : Text.Parse("Encourage [himher] take the lead.", parse)
		});
		options.push({ nameStr : "Mutual",
			func : function() {
				Text.Clear();
				Text.Add("You respond by kissing the elf deeply, your [tongue] copulating with [hishers], betraying your eagerness. Once [hisher] initial surprise has worn off, [name] begins to return your feelings, and the two of you melt into each other's arms.", parse);
				Text.NL();
				Text.Add("As if in a frenzy, the two of you remove your gear, pawing at each other's bodies. The elf seems just as into it as you are, shamelessly groping you. After an eternity, you break apart, with [name] panting, [hisher] hot breath coming in short bursts.", parse);
				Text.NL();
				Text.Add("<i>“Getting hot and bothered, aren't you?”</i> you murmur, <i>“what do you think we should do about it?”</i>", parse);
				Text.NL();
				Text.Add("<i>“I... I think, um...”</i> [name] leans forward and whisper something in your ear.", parse);
				Text.NL();
				Text.Add("<i>“Why you naughty [boygirl]... just what I was thinking,”</i> you purr, licking your lips.", parse);
				Text.Flush();
				
				kiakai.flags["TalkedSex"] = 3;
				KiakaiSex.SexPrompt(Kiakai.SexFirstAttitude.Mutual);
			}, enabled : true,
			tooltip : "Explore each other's bodies."
		});
		options.push({ nameStr : "Dig in",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Mmm... first, get those pesky clothes out of the way.”</i> As [name] hastily complies, you sit back and enjoy the view, appreciating [hisher] impromptu striptease. Once [heshe] is completely nude, you instruct [himher] to show off the goods.", parse);
				Text.NL();
				Text.Add("Blushing at your language, [name] nonetheless obeys, turning around in a slow circle, sticking [hisher] butt out and wiggling it a bit.", parse);
				Text.NL();
				Text.Add("<i>“Come on, you can do better than that,”</i> you admonish [himher]. The elf pouts a bit, but tries to appease you. [HeShe] experimentally moves through several different poses, very conscious of your reaction to each.", parse);
				Text.NL();
				if(kiakai.FirstBreastRow())
					Text.Add("[name] cups [hisher] [kbreasts], pushing them together in an enticing manner. [HeShe] moans lightly as [heshe] tweaks the sensitive, stiff [knips]. ", parse);
				if(kiakai.FirstCock()) {
					parse = Text.ParserPlural(parse, kiakai.NumCocks() > 1);
					Text.Add("[HisHer] hand moving down between [hisher] legs, [name] strokes [hisher] [kcocks] seductively, coaxing the shaft[s] to [itsTheir] full arousal. ", parse);
				}
				if(kiakai.FirstVag())
					Text.Add("[name] pries [hisher] lower lips apart with [hisher] fingers, revealing the pink flesh of [hisher] [kvag] to you. Though wet and ready, you have promised you won't use it. ", parse);
				parse["kv"]   = kiakai.FirstVag()  ? Text.Parse(", [hisher] eager slit", parse) : "";
				parse["kb"] = kiakai.HasBalls()  ? Text.Parse(", [kballs]", parse) : "";
				parse["kc"]  = kiakai.FirstCock() ? Text.Parse(", dangling [kcocks]", parse) : "";
				
				Text.Add("Finally, [name] twirls around, widens [hisher] stance and bends over in front of you. [HisHer] spread legs expose every part of [hisher] anatomy[kv][kb][kc], and [hisher] puckered rosebud. The elf peeks over [hisher] shoulder, gauging if the show is to your liking.", parse);
				Text.NL();
				Text.Add("You lick your lips as you shrug free of your gear. <i>“Yes... just like that. Now, play with yourself for me.”</i> ", parse);
				if(kiakai.FirstCock()) {
					parse["oneof"] = kiakai.NumCocks() > 1 ? " one of" : "";
					Text.Add("[name] blushes, but grabs hold of[oneof] [hisher] [kcocks], slowly jerking the member as [heshe] sways [hisher] [khips] at you. ", parse);
				}
				else if(kiakai.FirstVag())
					Text.Add("[name] blushes, but dips the fingers of one hand into [hisher] slick [kvag], teasing the outer folds. ", parse);
				Text.Add("The elf licks the digits of [hisher] other hand, coating them in slick saliva. Once sufficiently prepared, [heshe] eases one, then two fingers inside [hisher] [kanus].", parse);
				Text.NL();
				Text.Add("You can hardly contain your eagerness, all but wiggling your fingers as you edge closer to [name]. Reaching around, you pull the elf close to you, almost throwing [himher] off balance.", parse);
				if(player.FirstCock())
					Text.Add(" [HeShe] shivers as [heshe] feels your [cocks] rub against [hisher] butt.", parse);
				Text.NL();
				Text.Add("<i>“Ready or not, here I come...”</i> you growl in [hisher] ear.", parse);
				Text.Flush();
				
				kiakai.subDom.DecreaseStat(-50, 10);
				
				kiakai.flags["TalkedSex"] = 3;
				KiakaiSex.SexPrompt(Kiakai.SexFirstAttitude.Assertive);
			}, enabled : true,
			tooltip : Text.Parse("Take [himher] then and there.", parse)
		});
		
		Gui.SetButtonsFromList(options);
	}
	else {
		var domStat = player.subDom.Get() - kiakai.subDom.Get();
		if(domStat > 50) {
			Text.Add("You state your desires bluntly, ordering the subservient elf to unclothe [himher]self.", parse);
			Text.NL();
			Text.Add("<i>“Y-yes, [playername],”</i> [name] meekly acknowledges [hisher] position, hurrying to comply with your wishes.", parse);
		}
		else if(domStat < -30) {
			Text.Add("Demurely, you ask [name] if [heshe] could be of service to you again, or if you could pleasure [himher] in some way. The elf looks a bit lost for a fleeting moment, but somehow regains [hisher] composure once [heshe] understands what you are asking.", parse);
		}
		else {
			Text.Add("Pulling [name] close, you whisper your intentions in [hisher] ear. The elf blushes, but does not complain about your suggestion.", parse);
		}
		Text.Add(" The two of you shrug out of your gear, facing each other as nude as the day you were born.", parse);
		Text.Flush();
		
		kiakai.relation.IncreaseStat(50, 1);
		
		KiakaiSex.SexPrompt();
	}
}

Kiakai.SexFirstAttitude = {
	Passive   : 1,
	Mutual    : 2,
	Assertive : 3
};

KiakaiSex.SexPrompt = function(attitude) {
	// TODO Toys
	var playerCock = player.BiggestCock(null, true);
	var strapon    = playerCock ? playerCock.isStrapon : false;
	var kiaiCock   = kiakai.BiggestCock(null, true);
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,		
		kCockDesc2   : function() { return kiakai.AllCocks()[1].Short(); },		
		boygirl      : kiakai.body.femininity.Get() > 0 ? "girl" : "boy",		
		cockType     : function() { return strapon ? "strap-on" : playerCock.noun(); }		
	};
	
	parse = kiakai.ParserPronouns(parse);
	parse = kiakai.ParserTags(parse, "k");
	parse = player.ParserTags(parse);
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.gen = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	parse.kgen = kiakai.FirstCock() ? function() { return kiakai.MultiCockDesc(); } :
					kiakai.FirstVag() ? function() { return kiakai.FirstVag().Short(); } :
					"featureless crotch";
	
	Text.Flush();
	//Sex options
	var options = new Array();
	options.push({ nameStr : "Anal pitch",
		func : function() {
			Text.Clear();
			
			kiakai.relation.IncreaseStat(50, 2);
			
			var virgin = kiakai.Butt().virgin;
			
			if(attitude) {
				if(attitude == Kiakai.SexFirstAttitude.Passive) {
					Text.Add("<i>“C-could you do that thing you said?”</i> [name] nervously queries you. Smiling coyly, you ask the elf to be more specific.", parse);
					Text.NL();
					Text.Add("<i>“Before, you said that... there were different ways to have penetrative sex,”</i> [heshe] finishes lamely. Getting an inkling of what [heshe] is after, you rub the elf's back, your hand trailing down toward [hisher] [kbutt].", parse);
					Text.NL();
					Text.Add("<i>“Could it be... you mean <b>this</b>?”</i> you punctuate your question by slapping [name]'s exposed cheeks.", parse);
					Text.NL();
					Text.Add("<i>“Y-yes!”</i> [name] yelps, jumping a little as a rosy blush starts to form on [hisher] behind, striving to match the one spread across [hisher] face.", parse);
					Text.NL();
					parse["l"] = kiakai.HasLegs() ? Text.Parse("in between [hisher] legs", parse) : Text.Parse("in to paw [hisher] crotch", parse);
					Text.Add("<i>“To think that you would be that lewd... you really want me to stuff my [cockType] up your butt? Spread your cheeks and rail you, fill your insides completely?”</i> As you tease the flustered elf, your hand sneaks [l], starting to prepare your target for entry.", parse);
					Text.NL();
					Text.Add("<i>“Yes,”</i> the elf murmurs in a small voice. An involuntary shudder runs through [hisher] body as your probing finger pushes its way inside [hisher] pliant hole.", parse);
					Text.NL();
					if(kiakai.flags["AnalExp"] > 15) {
						Text.Add("<i>“Always knew you were an anal slut, and now I have it from your own mouth!”</i> you mercilessly tease.", parse);
						Text.NL();
					}					
					Text.Add("<i>“Enough, just do me already!”</i> [name] moans, past caring about [hisher] precious dignity anymore. The elf flips over on hands and knees, wriggling [hisher] [kbutt] at you invitingly.", parse);
					Text.NL();
					Text.Add("<i>“Imagine yourself before we met. Who would have thought you'd be begging to be fucked in the butt?”</i> you quip, throwing in one last mocking tease before striding to action.", parse);
				}
				else if(attitude == Kiakai.SexFirstAttitude.Mutual) {
					Text.Add("<i>“Yeees, my [cockType] would fit quite nicely in your butt, wouldn't it?”</i> you purr. To accentuate your point, you give said butt a firm squeeze.", parse);
					Text.NL();
					Text.Add("<i>“I... I am sure,”</i> [name] yelps, <i>“there is o-only one way to find out, right?”</i>", parse);
					Text.NL();
					Text.Add("<i>“Mhm...”</i> you agree, digging you fingers into [hisher] delicate derriere. One of them sneaks its way in between [hisher] cheeks, finding the [kanus] hidden inside. [name] shudders slightly as one, then two of your digits snake themselves inside [himher].", parse);
					Text.NL();
					Text.Add("<i>“Not so bad, is it?”</i> you whisper into your companion's ear, <i>“I bet you'll like the real thing even more.”</i> [name] responds by moaning and grinding against your fingers, pushing them deeper inside.", parse);
					Text.NL();
					Text.Add("<i>“Think you are ready for me?”</i> you ask, after sufficiently preparing the elf.", parse);
					Text.NL();
					Text.Add("<i>“As ready as I will ever be,”</i> [name] responds nervously.", parse);
					Text.NL();
					Text.Add("<i>“Good...”</i> You smile at [himher] encouragingly. <i>“Now, get on all fours, and I'll give you a ride you are not likely to forget.”</i> The elf complies, spreading [hisher] legs expectantly.", parse);
				}
				else if(attitude == Kiakai.SexFirstAttitude.Assertive) {
					Text.Add("<i>“I'm going to fuck you, and fuck you good,”</i> you state bluntly, your hand rubbing along your [cock].", parse);
					Text.NL();
					if(kiakai.FirstVag()) {
						Text.Add("<i>“P-please, [playername], you promised!”</i> [name] squeaks, <i>“u-use my other entrance!”</i>", parse);
						Text.NL();
						Text.Add("<i>“So, you reason that giving me your butt will protect your precious chastity?”</i> You give the elf a predatory grin. <i>“For now, perhaps... tomorrow, who knows?”</i>", parse);
					}
					else if(kiakai.FirstCock()) {
						Text.Add("<i>“B-but I am a man!”</i> [name] protests.", parse);
						Text.NL();
						Text.Add("<i>“You've yet to convince me of that, and I rather doubt I'll be more inclined to believe you after I'm finished,”</i> you retort, grinning as [heshe] shivers under your predatory glare. <i>“Besides, did you really think that would stop me?”</i>", parse);
					}
					Text.NL();
					Text.Add("<i>“Now... lie down and spread your legs, elf,”</i> you command, <i>“put on a show for me, and prepare yourself.”</i> [name] hurriedly complies, presenting you with [hisher] bum.", parse);
					Text.NL();
					Text.Add("<i>“Ungh... like this?”</i> [heshe] asks uncertainly, inserting one of [hisher] slender fingers into [hisher] [kanus].", parse);
					Text.NL();
					Text.Add("<i>“A good start... but you'll probably need to add a few more, or this will come as quite the shock,”</i> you answer, grinning as you stroke yourself.", parse);
					if(kiakai.flags["AnalExp"] > 15)
						Text.Add(" <i>“Though I suppose this isn't the first thing I've shoved in there,”</i> you muse.", parse);
					Text.NL();
					Text.Add("Not trusting [himher]self to speak anymore, the elf merely whimpers as [heshe] adds another two fingers. You enjoy the display for a while before announcing that you are moving on to the main course. Without waiting for a reply, you flip [name] over on all fours, nudging [hisher] legs apart, exposing [hisher] [kanus] to your eager [cock].", parse);
				}
			}
			// Repeats
			else {
				Text.Add("Licking your lips, you suggest that [name] bend over so you can fuck [himher] anally. The elf blushes at your bluntness, but complies with your wishes, gulping slightly as your hungry gaze takes in [hisher] bared anatomy.", parse);
				Text.NL();
				if(virgin) {
					Text.Add("<i>“You agreed to that quick enough, considering I'll be your first,”</i> you comment amiably.", parse);
					Text.NL();
					Text.Add("<i>“J-just be gentle with me,”</i> the elf mumbles, blushing fiercely.", parse);
				}
				else {
					Text.Add("<i>“Hope you'll enjoy it as much as the first time - I certainly intend to,”</i> you comment amiably.", parse);
				}
			}
			
			// If toy
			if(!player.FirstCock()) {
				Text.NL();
				Text.Add("You equip your [cock], dressing it in lube to prepare it for imminent penetration. [name] throws nervous glances at you all the while, though whether because of second thoughts or impatience, it is hard to tell.", parse);
			}
			
			Text.NL();
		
			var len = playerCock.Len();
			var thk = playerCock.Thickness();
			var cap = kiakai.Butt().Cap();
				
			// First time
			if(kiakai.flags["SexPitchAnal"] == 0) {
				Text.Add("<i>“W-will it hurt?”</i> [name] whimpers over [hisher] shoulder, sounding slightly worried.", parse);
				Text.NL();
				Text.Add("<i>“I'll take it slow and gentle,”</i> you promise reassuringly. While talking, you have lubed up the length of your [cock], preparing it for entry. Humming softly, you place the [cockTip] against [name]'s [kanus], applying pressure. Already, you can feel [hisher] sphincter expanding grudgingly.", parse);
				Text.NL();
				Text.Add("<i>“[playername]!”</i> the elf gasps. <i>“N-not so rapidly!”</i> You pause for a moment in your inexorable advance.", parse);
				Text.NL();
				Text.Add("<i>“Relax. Just the tip, okay?”</i>", parse);
				Text.NL();
				Text.Add("<i>“Aah... j-just the tip then,”</i> [name] moans, biting [hisher] lip as your [cock] continues to push against [hisher] unravaged hole. Finally, either by an act of will or through sheer exhaustion, the elf's puckered rosebud relaxes, allowing you to feed your [cockTip] into [hisher] depths. You can feel the heat around your [cock], and [name]'s tight entrance clamping down around you. Even should you want to, you don't think you could pull out of [himher] right now.", parse);
				Text.NL();
				
				kiakai.FuckAnal(kiakai.Butt(), playerCock, 3);
				player.Fuck(playerCock, 15);
				Sex.Anal(player, kiakai);
				
				Text.Add("Which leaves you only one way to go.", parse);
				Text.NL();
				Text.Add("<i>“B-by Aria!”</i> The elf pants, amusing you by calling on [hisher] Goddess in [hisher] current state. As you begin your slow but inexorable penetration of your moaning companion, [heshe] weakly protests: <i>“Y-you promised, only the - nngh - tip!”</i>", parse);
				Text.NL();
				Text.Add("<i>“Don't be such a baby. See? There goes another inch!”</i> you tell [himher] encouragingly, pushing another fraction of your length into [himher] to match your words.", parse);
				Text.NL();
				
				if(len < 15) {
					Text.Add("<i>“That wasn't so bad, was it?”</i> you comfort [name] as your [hips] lightly tap against [hisher] [kbutt], your [cock] bottoming out inside the elf.", parse);
					Text.NL();
					Text.Add("<i>“I... I guess,”</i> [name] whimpers.", parse);
					Text.NL();
					Text.Add("Then doing it a few more times shouldn't be a problem, should it?", parse);
				}
				else if(len < 22) {
					Text.Add("<i>“Halfway there!”</i> you announce happily, continuing to push your [cock] forward, burying it bit by bit inside the elf.", parse);
					Text.NL();
					Text.Add("<i>“T-there is more?!”</i> [name] gasps. <i>“It will not fit!”</i>", parse);
					Text.NL();
					Text.Add("You beg to differ, and set out to prove [himher] wrong. Although there are some noises of protest, soon enough your [hips] connect with [hisher] [kbutt], your [cock] hilted inside of [name]'s [kanus].", parse);
				}
				else {
					Text.Add("<i>“[playername], it will never fit!”</i> [name] gasps, becoming increasingly and intimately aware of the sheer size of your [cock]. No matter how much you manage to press in, there is always another inch to follow.", parse);
					Text.NL();
					Text.Add("<i>“Nonsense.”</i> The first six inches bury inside [himher] without any problems.", parse);
					Text.NL();
					if(len > 23) {
						Text.Add("<i>“You are tearing me asunder!”</i> the elf cries out. Nine inches.", parse);
						Text.NL();
					}
					if(len > 30) {
						Text.Add("<i>“P-please,”</i> [name] whimpers. Twelve inches. You are starting to encounter resistance, and you sense that you are close to reaching the elf's limits.", parse);
						Text.NL();
					}
					if(len > 40) {
						Text.Add("Fifteen inches. By now, the elf's protests are reduced to wordless moans.", parse);
						Text.NL();
					}
					if(len > 50) {
						Text.Add("...Twenty inches. By Aria indeed, just how much can [heshe] fit?", parse);
						Text.NL();
					}
					Text.Add("Finally, you can't push even another fraction of an inch inside the elf; it is simply physically impossible without damaging your companion. A pity, since you still have plenty more to give.", parse);
				}
			}
			else {
				Text.Add("[name]'s [kanus] is almost inviting, as if welcoming a returning guest. It takes surprisingly little effort for your [cock] to gain entry, pushing past the elf's weak defenses.", parse);
				Text.NL();
				
				kiakai.FuckAnal(kiakai.Butt(), playerCock, 3);
				player.Fuck(playerCock, 3);
				Sex.Anal(player, kiakai);
				
				parse["kpballs"] = kiakai.HasBalls() && player.HasBalls() ? Text.Parse(", your balls lightly slapping against [hishers]", parse) : "";
				
				if(len < 20)
					Text.Add("Your [cock] easily bottoms out in your groaning companion, joining the two of you at the hip[kpballs].", parse);
				else if(len < 35)
					Text.Add("It takes some effort, but soon all of your [cock] is lodged inside the groaning elf, testing the limits of [hisher] body.", parse);
				else
					Text.Add("Try as you might, you can't fit all of your impressive length inside the groaning elf, leaving a significant portion of the [cock] outside as you strain against [name]'s physical limits.", parse);
			}
			Text.NL();
			Text.Add("<i>“I'm going to start moving now,”</i> you announce, beginning your slow withdrawal from [hisher] expanded tunnel. Leaving a trail of fire in the elf's ravaged innards, you pull your [cock] almost completely back out, preparing to plunge in again. Poised on the edge, with just the tip of your [cock] still resting inside the elf, you lovingly caress [hisher] bare behind.", parse);
			Text.NL();
			parse["stretch"] = thk >= cap ? Text.Parse(", stretching the elf to [hisher] limits", parse) : "";
			Text.Add("Your next thrust is much faster than the first, not stopping to let [name] adjust to the sudden intrusion until you have bottomed out[stretch].", parse);
			Text.NL();
			Text.Add("<i>“Hah... hah...”</i> overwhelmed by the feelings of pleasure and pain wrecking [hisher] [kanus], [name] can hardly keep [himher]self up, and only your firm grip on [hisher] [khips] prevents [himher] from collapsing in a quivering puddle.", parse);
			Text.NL();
			Text.Add("The sloppy sounds of flesh grinding against flesh echo throughout the area as your [cock] pistons its way in and out of [name]'s constricting passage, [hisher] amazing tightness only serving to increase the intense experience.", parse);
			if(kiakai.flags["AnalExp"] < 30) {
				Text.NL();
				Text.Add("<i>“S-slower,”</i> [name] begs, <i>“it... it feels too good!”</i>", parse);
			}
			else {
				Text.NL();
				Text.Add("<i>“M-more!”</i> [name] begs you, <i>“take me deeper!”</i> With [hisher] extensive experience with anal sex, you don't doubt that [heshe] could take it.", parse);
				if(kiakai.SPLevel() < 0.75 && cap < thk) {
					Text.NL();
					Text.Add("A glimmer of a naughty idea flits through your mind, but the elf seems too exhausted for it to be enacted.", parse);
				}
			}
			Text.NL();
			Text.Add("How will you take [himher]?", parse);
			Text.Flush();
			
			kiakai.flags["SexPitchAnal"] = 1;
			kiakai.flags["AnalExp"] += 2;
			kiakai.flags["Sexed"]++;
			
			//[Gentle][Rough][Ruin]
			var options = new Array();
			options.push({ nameStr : "Gentle",
				func : function() {
					Text.Clear();
					Text.Add("Slowly, you start to rock your [hips], your [cock] sliding in and out of [name] with the inexorable regularity of ocean waves, gently rolling against a shoreline. Each gentle push elicits an appreciative moan from the prone elf, urging you on.", parse);
					Text.NL();
					if(virgin)
						Text.Add("Though you try your best to be considerate, [name]'s first time is still a bit overwhelming for [himher]. [HisHer] limbs are trembling slightly as [heshe] does [hisher] best to keep [himher]self upright beneath your grinding.", parse);
					else if(kiakai.flags["AnalExp"] < 30)
						Text.Add("[name] does [hisher] best to enjoy your grinding, sometimes even pushing back against your [cock], desiring to have more of it fill [himher].", parse);
					else
						Text.Add("A veteran of anal sex, [name] seems almost a bit disappointed at your slow pace, but plays along, pushing back against every one of your thrusts, intensifying [hisher] own pleasure. Amused, you give the elf a light slap on [hisher] bum, encouraging [himher] to let you do the work.", parse);
					Text.NL();
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						parse["s"]     = kiakai.NumCocks() > 1 ? "s" : "";
						parse["oneof"] = kiakai.NumCocks() > 1 ? " one of" : "";
						Text.Add("Reaching down, you grab hold of[oneof] [name]'s dangling cock[s]. The elf has become really hot and bothered from your tender pounding of [hisher] [kanus], and the [kcock] is stiff, the veins on it standing out as your fingers lightly dance over it.", parse);
						Text.NL();
						Text.Add("You caress it, causing a twitch to run through the stiff member, globs of pre splattering on the ground beneath [himher]. Closing your hand around it, you start to pump the [kcock] in time with the thrusts of your hips.", parse);
						Text.NL();
					}, 1.0, function() { return kiakai.FirstCock(); });
					scenes.AddEnc(function() {
						Text.Add("A quick feel between [name]'s legs tell you that [hisher] [kvag] is soaked, the elf's clear juices trailing down one of [hisher] thighs. Smiling, you dip your fingers in the wet honey pot, then present them to [himher].", parse);
						Text.NL();
						Text.Add("<i>“You <b>really</b> like this, don't you?”</i> you tease [himher].", parse);
						if(kiakai.subDom.Get() < -30)
							Text.Add(" [name] greedily licks your digits clean, not wanting to let [hisher] honey go to waste.", parse);
						Text.NL();
					}, 1.0, function() { return kiakai.FirstVag(); });
					scenes.Get();
					
					Text.Add("You let your hips do the talking, letting your [cock] pump in and out of [name]'s [kanus]. If the elf had ever had doubts as to liking this, they seem to be all gone now.", parse);
					Text.NL();
					if(kiakai.subDom.Get() > -10)
						Text.Add("<i>“S-so good, I love it, [playername]!”</i> [heshe] moans, <i>“I can feel it, haah... deep inside...”</i>", parse);
					else if(kiakai.subDom.Get() > -40)
						Text.Add("<i>“More! Give me more!”</i> [heshe] moans, <i>“I love it. Fuck my ass deeper!”</i>", parse);
					else
						Text.Add("<i>“D-do me harder, I can take it!”</i> [heshe] begs. <i>“Ravage me, fuck me, stuff my ass full of your [cockType]!”</i>", parse);
					Text.NL();
					Text.Add("You are more than happy to oblige, and proceed to give the elf exactly what [heshe] wants in large, sloppy amounts.", parse);
					if(kiakai.LustLevel() >= 0.75) {
						parse["cumJuices"] = kiakai.FirstCock() ? "cum" : "juices";
						Text.NL();
						Text.Add("<i>“T-too much - ngh - it is coming!”</i> [name] gasps, announcing [hisher] orgasm. You continue to ream the elf throughout [hisher] climax, causing [hisher] [cumJuices] to splatter all over the ground beneath [himher].", parse);
						
						var cum = kiakai.OrgasmCum();
					}
					Text.Flush();
					
					Gui.NextPrompt(function() {
						Text.Clear();
						
						if(player.FirstCock()) {
							parse["depth"] = len > 35 ? "as far as you can go" : "until your hips are connected";
							Text.Add("Finally, you can feel your climax approaching rapidly. Pushing into the elf [depth], you switch from thrusting to slowly grinding against the depths of [hisher] passage.", parse);
							if(playerCock.knot) {
								if(len <= 35)
									Text.Add(" Pretty soon, you have little choice but to stay where you are, as your swelling knot traps you inside the moaning elf.", parse);
								else
									Text.Add(" As much as you'd like to knot the moaning elf, you simply can't reach deep enough. You'll just have to make do and bust a nut in [himher].", parse);
							}
							Text.NL();
							Text.Add("With one last groan, you unload your sticky gift into [name]'s [kanus], painting [hisher] insides with your cum.", parse);
							var cum = player.OrgasmCum();
							if(cum > 3)
								Text.Add(" The elf's stomach gains a visible bulge, straining to contain all of your semen.", parse);
							Text.NL();
							if(playerCock.knot && len <= 35) {
								Text.Add("With no other choice but to wait it out, you collapse on top of your lover. You can feel your sperm sloshing around inside the elf, trapped by your knot.", parse);
								Text.NL();
								Text.Add("Time passes...", parse);
								Text.NL();
								TimeStep({minute: 30});
							}
						}
						
						parse["cum"] = player.FirstCock() ? Text.Parse(", a trail of white fluid connecting the tip of your [cock] to [hisher] [kanus]", parse) : "";
						Text.Add("Completely sated, you pull out of [name][cum].", parse);
						Text.NL();
						if(virgin) {
							Text.Add("<i>“So, how was your first?”</i> you ask [name].", parse);
							Text.NL();
							Text.Add("<i>“I... I loved it,”</i> [heshe] admits, blushing. <i>“Thank you for being so gentle and understanding with me.”</i>", parse);
							Text.NL();
							
							kiakai.relation.IncreaseStat(100, 5);
						}
						Text.Add("The two of you equip your gear, readying yourselves to continue on your travels.", parse);

						Text.Flush();
						
						kiakai.Butt().stretch.IncreaseStat(Orifice.Tightness.loose, 0.5);
						kiakai.subDom.DecreaseStat(0, 1);
						TimeStep({hour: 1});
						player.AddLustFraction(-1);
						kiakai.AddLustFraction(-1);
						
						Gui.NextPrompt();
					});
				}, enabled : true,
				tooltip : "Give the elf some gentle loving."
			});
			options.push({ nameStr : "Rough",
				func : function() {
					Text.Clear();
					Text.Add("<i>“I'll fuck you good,”</i> you announce, accentuating your words with a rough shove of your hips, driving your [cock] deep inside the elf. [name] cries out in surprise at the motion, but there is a fair bit of poorly disguised delight in there too. As you build up a rhythm, your suspicions are confirmed as [heshe] starts moaning, wordlessly begging you to keep going.", parse);
					Text.NL();
					Text.Add("You take a firm hold of the elf's [khips], holding [himher] upright as you start reaming [himher] in earnest. In and out, you piston your endowment, keeping a rapid pace. [name]'s velvet passage fits you like a glove, each tight ring intimately caressing you as you force it open. [name] is definitely enjoying your merciless pounding, [hisher] breathing coming in ragged gasps as you use [hisher] [kanus] like a cocksleeve.", parse);
					Text.NL();
					if(kiakai.FirstCock() && Math.random() < 0.5) {
						Text.Add("Deciding to tease your companion a bit, you pull back out completely, leaving [hisher] pucker gaping slightly, as if begging you to return. Changing your position a little, you hunch over [himher], driving your [cock] back in at a downward angle. This has the desired effect of ramming right into [hisher] prostate, as confirmed by a loud yelp from the elf.", parse);
						Text.NL();
						Text.Add("Each of your rapid thrusts mashes the sensitive organ as if trying to forcefully milk it of its contents. A likely outcome if you keep it up for long as each time you grind against it, [name] lets out a whorish moan, crying out for more.", parse);
						Text.NL();
						Text.Add("It's not long before the elf's prostate has had enough, and its load explodes from [hisher] [kcocks], some of it splattering against [name]'s chest before slowly forming a pool on the ground beneath [himher].", parse);
						Text.NL();
					}
					Text.Add("You switch gears, pushing inside the elf with long, firm strokes. [HisHer] tight tunnel caresses every inch of your lube-covered [cock], though it is loosening up noticeably under your insistent buggering.", parse);
					Text.NL();
					Text.Add("<i>“Y-yes! Your [cockType] feels so good, [playername]!”</i> [name] moans, encouraging you to increase your pace even further. A bead of sweat forms on your forehead as your unrelenting assault begins to take its toll. The elf is practically soaked, [hisher] glistening skin making [himher] look like [heshe]'s oiled up. You are not about to stop before you've given it your all, and you still have plenty to give.", parse);
					Text.NL();
					parse["art"] = player.strapOn ? "artificial shaft" : "pile of hot meat";
					Text.Add("Plunging in and out, your [art] pummels the tight elf beneath you. Your elven cocksleeve goes through moaning, begging for more and whimpering for you to slow down. Eventually, [hisher] arms give and [heshe] collapses to the ground, only suspended by your [cock] and your hands on [hisher] [khips]. All of [name]'s pleading falls on deaf ears as you keep up your even, incessant pounding throughout [hisher] moaning.", parse);
					Text.NL();
					Text.Add("<i>“It... it is coming!”</i> [name] gasps.", parse);
					Text.NL();
					Text.Add("The elf's hips tremble as an orgasm wracks [hisher] body, leaving a sticky mess on the ground.", parse);
					var cum = kiakai.OrgasmCum();
					if(kiakai.FirstCock() && cum > 3) {
						parse["cum"] = kiakai.FirstBreastRow().size.Get() > 5 ? Text.Parse(" and the underside of [hisher] [kbreasts]", parse) : "";
						Text.Add(" Globs of cum splatter [hisher] chest[cum], joining the huge pool of ejaculate forming beneath the elf.", parse);
					}
					Text.Flush();
					
					Gui.NextPrompt(function() {
						Text.Clear();
						
						Text.Add("The two of you are nearing the limit of your stamina, as your rutting slows down somewhat. [name] is lying face down, whimpering quietly, as you enter the final stretch, your pounding becoming a little erratic.", parse);
						Text.NL();
						
						if(player.FirstCock()) {
							Text.Add("You can feel your climax rising, a familiar twitch in your [balls] giving you the tell-tale signs of imminent stickiness. Groaning, you release your pent up cum, painting [name]'s inner walls white.", parse);
							var cum = player.OrgasmCum();
							if(player.cum > 3)
								Text.Add(" The elf's stomach bulges slightly from the excessive quantity of spunk being pumped into [himher].", parse);
							Text.NL();
							
							if(playerCock.knot && len < 35) {
								Text.Add("Not a single drop escapes from [name]'s ravaged hole as your [knot] seals [hisher] [kanus] shut. Seems like you will be here for a while.", parse);
								if(player.LustLevel() > 0.5)
									Text.Add(" For good measure, you grind against [name]'s bum, trying to squeeze another orgasm out of the two of you before your energy is completely spent. Your knot doesn't give you much leeway, but it is enough for your intentions.", parse);
								Text.NL();
								Text.Add("Time passes...", parse);
								Text.NL();
								Text.Add("Finally, you can feel your knot diminishing in size, allowing you to retract your member from its prison.", parse);
								Text.NL();
								TimeStep({minute: 30});
							}
							else if(cum > 3) {
								Text.Add("[name] is unable to contain all of your generous gift, and a steady stream seeps out past the tight seal of your [cock], dripping down to the ground.", parse);
								Text.NL();
							}
						}
						else {
							Text.Add("Fucking the elf with a toy is certainly enjoyable in and of itself, though you briefly wonder what [heshe] would feel like if you had a proper cock. In the meantime, your [cock] will have to do. [name] certainly doesn't seem to be complaining.", parse);
							Text.NL();
						}
						Text.Add("Satisfied at last, you pull out of your companion, giving [hisher] rear end a smack for good measure.", parse);
						if(player.FirstCock())
							Text.Add(" A stream of spunk trails from [name]'s abused hole, evidence of your territory-marking.", parse);
						Text.NL();
						
						if(virgin) {
							Text.Add("<i>“How was that for a fuck?”</i> you challenge [himher].", parse);
							Text.NL();
							Text.Add("<i>“Y-you are so rough, [playername]. Next time...”</i> [name] trails off, avoiding your gaze. Something tells you that [heshe] really, <i>really</i> liked it though.", parse);
							Text.NL();
							kiakai.subDom.DecreaseStat(-100, 3);
						}
						Text.Add("The two of you equip your gear, readying yourselves to continue on your travels.", parse);
						
						Text.Flush();
						
						kiakai.Butt().stretch.IncreaseStat(Orifice.Tightness.loose, 0.5);
						kiakai.subDom.DecreaseStat(-50, 2);
						
						TimeStep({hour: 1});
						player.AddLustFraction(-1);
						kiakai.AddLustFraction(-1);
						
						Gui.NextPrompt();
					});
				}, enabled : true,
				tooltip : Text.Parse("[HeShe] can take it, give [himher] a rough ride.", parse)
			});
			if(kiakai.flags["AnalExp"] >= 20 && kiakai.subDom.Get() < 0) {
				options.push({ nameStr : "Ruin",
					func : function() {
						Text.Clear();
						parse = Text.ParserPlural(parse, kiakai.NumCocks() > 1);
						Text.Add("Pulling out all the way, your [cock] leaves [name]'s stretched sphincter with a loud popping noise. The elf is given little time to recover, however, as you quickly plunge into [himher] again, ramming your [cock] in as far as it will go. A pained yelp escapes your submissive companion as you pound [himher], testing [hisher] limits.", parse);
						Text.NL();
						Text.Add("<i>“[playername], it... it hurts!”</i> [name] cries. You are too far gone to stop now, but perhaps... You lean down, grabbing the elf by the hair.", parse);
						Text.NL();
						Text.Add("<i>“I'm going to pound you raw,”</i> you breathe into [hisher] ear, <i>“and there is nothing-”</i> You accentuate your claim by ramming your [cock] into [himher] again, <i>“-that you can do about that. What you can do...”</i> You whisper your plan to the aching elf.", parse);
						Text.NL();
						Text.Add("<i>“O-okay,”</i> [name] whimpers. You allow [himher] some time to adjust [hisher] position. The elf lowers [hisher] chest to the ground, demurely resting [hisher] cheek in the accumulated grime. [HisHer] hands now freed, [name] places them against [hisher] stomach. You feel a slight tingling around your [cock] as waves of healing energy suffuse [hisher] body.", parse);
						Text.NL();
						Text.Add("Experimentally, you give [himher] a rough, deep thrust, stretching [himher] to [hisher] limit. The elf moans quietly as [hisher] face is pushed against the ground, but it seems that most of [hisher] pain is numbed. [HeShe] seems a bit distant, caught up in euphoric bliss.", parse);
						Text.NL();
						if(kiakai.FirstCock()) {
							Text.Add("Below [hisher] stretched anus, [name]'s [kcocks] [isAre] coming to life, throbbing with need. While [hisher] healing is dampening the sensations in [hisher] ass, a teasing prod confirms that the elf is still acutely aware of [hisher] erect cock[s].", parse);
							Text.NL();
						}
						Text.Add("Your restrictions lifted, you let yourself loose, pounding [name] with wild abandon. Each thrust strains against [hisher] physical limits, forcing your [cock] into territory previously unexplored. As you withdraw from each violent penetration, the soothing tendrils of the elf's healing power jump in, healing any damage.", parse);
						Text.NL();
						Text.Add("Slowly but surely, your fervent reaming is rewarded, as you feel that each thrust forces [name] to give more ground, penetrating deeper than [heshe] has ever experienced before. Whether due to the thorough fucking [heshe] is receiving - or the numbing properties of [hisher] healing - [name] is beyond words, reduced to moaning weakly in time with your thrusts.", parse);
						Text.NL();
						if(kiakai.FirstCock()) {
							Text.Add("[name]'s [kcocks] [isAre] drooling cum, the thick fluid seeping out continuously rather than coming in short bursts. You'd guess [heshe] has orgasmed several times, but [hisher] body is too confused to handle the intense sensation.", parse);
							Text.NL();
							var cum = kiakai.OrgasmCum(3);
						}
						Text.Add("The two of you lose all sense of time, your world reduced to relishing in your carnal desires, the relentless pounding of flesh, the tingling wash of healing energy that courses through you.", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							Text.Clear();
							
							if(player.FirstCock()) {
								Text.Add("Your mindless rutting eventually rouses a familiar feeling in your [balls] as you sense the oncoming wave of your orgasm. [name] gasps as [heshe] feels the first glob of hot sperm land in [hisher] ravaged colon. Keeping up your steam, you slam into the elf another dozen times, bottoming out while unloading inside [himher].", parse);
								Text.NL();
								
								var cum = player.OrgasmCum();
								
								if(playerCock.knot && thk < 1.2 * cap) {
									Text.Add("So close... if you could only push a little bit more in, you could knot the elf. Groaning, you keep pushing, trying to force your swelling knot past [name]'s sphincter. [HeShe] protests weakly; you're way too big, and [heshe] is stretched past [hisher] limits already. You are beyond reason though, taken over by animalistic need, the irrational urge to breed the elf.", parse);
									Text.NL();
									Text.Add("Both of you cry out as something gives, and your [knot] finally snaps inside [himher]. No amount of preparation could help [name] for the intense stretching, and the elf almost passes out. There is no going back now, you are firmly stuck inside [himher], and you are likely to stay that way for a while.", parse);
									Text.NL();
									
									kiakai.Butt().capacity.IncreaseStat(thk, 1);
									TimeStep({minute: 30});
								}
								if(cum > 3) {
									Text.Add("[name] moans appreciatively as your spunk fills [himher] up, the thick cream acting as a soothing salve for [hisher] distended innards.", parse);
									Text.NL();
								}
							}
							Text.Add("Exhausted, you collapse on top of your submissive companion.", parse);
							Text.NL();
							Text.Add("<i>“Good [boygirl],”</i> you commend the elf.", parse);
							Text.NL();
							Text.Add("[name] is finally coming down from [hisher] high, [hisher] energy totally spent. [HeShe] groans as the pain in [hisher] loins starts to seep back into [hisher] conscious awareness.", parse);
							Text.NL();
							
							if(kiakai.subDom.Get() > -20) {
								Text.Add("<i>“A-are you crazy?”</i> [name] whimpers, tears in [hisher] eyes, <i>“y-you could have killed me!”</i>", parse);
								kiakai.relation.DecreaseStat(0, 10);
							}
							else if(kiakai.subDom.Get() > -40) {
								Text.Add("<i>“P-please don't make me do that again,”</i> [name] pleads with you, <i>“I'll do anything, just please, not that again...”</i>", parse);
								kiakai.relation.DecreaseStat(0, 5);
							}
							else if(kiakai.subDom.Get() > -60) {
								Text.Add("<i>“Haah... haah...”</i> [name] is too exhausted and aroused to form words properly. <i>“S-so deep, now I can take even more for you...”</i>", parse);
							}
							else {
								Text.Add("<i>“Y-yes, stretch me more, break me, again and again!”</i> [name] moans, fingers weakly playing with [hisher] loose back passage.", parse);
								kiakai.relation.IncreaseStat(50, 5);
							}
							Text.NL();
							if(virgin) {
								Text.Add("<i>“It feels like I will not be able to sit for weeks,”</i> [heshe] complains. Perhaps you went a bit rough on [himher] for [hisher] first time.", parse);
								Text.NL();
								Text.Add("<i>“Next time won't be so bad,”</i> you promise [himher].", parse);
								Text.NL();
								Text.Add("<i>“N-next time?”</i> [name] whimpers in a small voice.", parse);
								Text.NL();
								kiakai.relation.DecreaseStat(-100, 5);
							}
							Text.Add("The two of you equip your gear, readying yourself to continue on your travels.", parse);
							Text.Flush();
							
							kiakai.AddSPFraction(-1);
							kiakai.Butt().stretch.IncreaseStat(Orifice.Tightness.gaping, 1);
							kiakai.subDom.DecreaseStat(-75, 10);
							kiakai.Butt().capacity.IncreaseStat(len, 5);
							
							TimeStep({hour: 1});
							player.AddLustFraction(-1);
							kiakai.AddLustFraction(-1);
							
							Gui.NextPrompt();
						});
					}, enabled : cap < thk && kiakai.SPLevel() >= 0.75,
					tooltip : Text.Parse("You are beyond caring about anything but your own pleasure. Your [cock] is way too big, but you'll make [himher] take it.", parse)
				});
			}
			
			Gui.SetButtonsFromList(options);
		}, enabled : playerCock,
		tooltip : attitude ? Text.Parse("You can finally have a go at [himher], like you have been longing to... Fuck [name]'s butt until [heshe] begs for more.", parse) : Text.Parse("Fuck [name]'s butt until [heshe] begs for more.", parse)
	});
	options.push({ nameStr : "Anal catch",
		func : function() {
			Text.Clear();
			kiakai.flags["Sexed"]++;
			kiakai.relation.IncreaseStat(50, 1);
			
			parse = Text.ParserPlural(parse, kiakai.NumCocks() > 1);
			
			if(attitude) {
				if(attitude == Kiakai.SexFirstAttitude.Passive) {
					Text.Add("<i>“W-would you allow me to penetrate you, [playername]?”</i> [name] asks nervously.", parse);
					Text.NL();
					if(player.FirstVag()) {
						Text.Add("<i>“Before, you were so adamant about not having sex... you really have changed, [name],”</i> you smile at [himher] fondly.", parse);
						Text.NL();
						Text.Add("<i>“N-not that way!”</i> the elf hurriedly stutters, <i>“I meant, could I put it... in your posterior?”</i> Oh? So anal doesn't count in [name]'s new world view?", parse);
					}
					else if(player.FirstCock()) {
						Text.Add("You blush faintly as you realize what the elf is suggesting. Meanwhile, [heshe] is eyeing your [butt], trying to act nonchalant and failing miserably.", parse);
						Text.NL();
						Text.Add("<i>“B-but, [name], I'm a boy!”</i> you tease, feigning shock. <i>“Still, since you ask...”</i> you quickly finish before the elf has a chance to change [hisher] mind.", parse);
						Text.NL();
						Text.Add("<i>“R-regardless,”</i> [name] mutters, flustered.", parse);
					}
					Text.NL();
					Text.Add("<i>“Well... what are you waiting for?”</i> you challenge [himher], when [heshe] still hesitates. <i>“Don't ask, demand!”</i>", parse);
					Text.NL();
					Text.Add("<i>“[playername]...”</i> [name] takes a deep breath, blushing furiously. <i>“By the powers vested in me... I claim the use of your rear!”</i>", parse);
					Text.NL();
					Text.Add("Well... for a first try at assertiveness, it isn't so bad, if more than a little strange. You're sure [heshe] will improve as time goes by.", parse);
				}
				else if(attitude == Kiakai.SexFirstAttitude.Mutual) {
					Text.Add("<i>“I want you to take me, and you want the same,”</i> you purr, grabbing hold of [hisher] hands and pressing them to your [butt]. <i>“Why don't you prepare me?”</i> you whisper to [himher].", parse);
					Text.NL();
					Text.Add("As if [hisher] inhibitions are lifted by your urgings, you almost immediately feel one of [name]'s slender fingers sneak down your crack, prodding at the entrance of your [anus]. The elf is gentle, but makes no effort to hide [hisher] eagerness as [heshe] plunges two digits into your yearning sphincter.", parse);
					Text.NL();
					Text.Add("Unsated, you dive in, stealing a series of steamy kisses from the breathless elf. You let your [tongue] entwine with [hishers], losing yourself in oral pleasure, leaving [name] free rein of your [anus]. [HeShe] uses the fingers of both hands to spread you open, stretching your ring before pushing the slender digits in as far as the awkward angle will allow.", parse);
					Text.NL();
					Text.Add("When you finally break the kiss, you feel more than ready to receive your lover.", parse);
				}
				else if(attitude == Kiakai.SexFirstAttitude.Assertive) {
					Text.Add("<i>“Now... do the same for me,”</i> you command the elf, reclining and presenting [name] with your [anus]. Eager to please, the horny elf hurriedly removes [hisher] fingers from [hisher] puffy pucker. Kneeling down, [heshe] presses [hisher] already slick digits into your pliant anus.", parse);
					Text.NL();
					Text.Add("You bite your lip as your submissive companion prepares you, pumping your rear end for all that [heshe] is worth. Perhaps it's time to announce your intentions.", parse);
					Text.NL();
					Text.Add("<i>“Nice and tight, isn't it?”</i> you murmur huskily, <i>“wouldn't you like to bury [thatThose] [kcocks] of yours there?”</i> [name] looks shocked when [heshe] realizes what you are offering... nay, ordering.", parse);
					Text.NL();
					if(kiakai.FirstCock()) {
						Text.Add("[name]'s [kcocks] [isAre] rising to the challenge, stiff between [hisher] legs as the excited elf continues to finger you.", parse);
						if(player.LowerBodyType() != LowerBodyType.Single) {
							Text.NL();
							Text.Add("<i>“Getting excited, aren't we?”</i> you taunt, placing your foot on[oneof] [hisher] engorged member[s]. Grinning, you let [name] take care of your [anus], playing with yourself in the meantime. You slowly increase the pressure on the elf's [kcock], which has become painfully hard, judging from [name]'s groans.", parse);
							kiakai.AddLustFraction(0.3);
						}
					}
					Text.NL();
					Text.Add("You let the elf go on for a while longer before you grow impatient and shove [himher] off you.", parse);
					Text.NL();
					Text.Add("<i>“Now... you are going to fuck me. Get ready, elf.”</i>", parse);
				}
			}
			else {
				Text.Add("You want [name], and you want [himher] now. Pulling the elf close, you whisper that you need to feel [hisher] [kcock] inside you, that you want [himher] to take your [anus].", parse);
				Text.NL();
				if(kiakai.subDom.Get() < -30)
					Text.Add("<i>“As you wish, [playername],”</i> [name] responds demurely, <i>“I... I will do my best to pleasure you to the fullest of your desires.”</i>", parse);
				else
					Text.Add("<i>“Y-yes,”</i> [name] nods hurriedly, eyes dancing over your body. There is an uncharacteristic predatory quality to [hisher] gaze. <i>“I too have wished to do this again.”</i>", parse);
			}
			Text.NL();

			// TODO: Perhaps more specific scenes for certain toys			
			if(!kiakai.FirstCock()) {
				Text.Add("Blushing, [name] fastens [hisher] [kcock] to [hisher] crotch, eyeing you nervously as [heshe] adjusts the artificial erection that [heshe] is about to put to use.", parse);
				Text.NL();
			}
			
			// First time
			if(kiakai.flags["SexCatchAnal"] == 0) {
				Text.Add("<i>“Ah... what should I do?”</i> the elf asks anxiously, eager to please but unsure on how to proceed. You explain that for it not to hurt, the best is to have some form of lubricant first. There are certain oils that could be used, or you could use your own bodily fluids for the task.", parse);
				Text.NL();
				Text.Add("<i>“H-how do you mean?”</i> The elf looks bewildered. [HisHer] innocence is so cute... you idly wonder how long [heshe] can hope to maintain it, now that you are around.", parse);
				Text.NL();
				Text.Add("<i>“I could suck you off to get you ready, or you could give me a rimjob.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Ahh... okay, well then...”</i>", parse);
			}
			else {
				Text.Add("<i>“I do not want to hurt you, [playername], please allow me to prepare first,”</i> [name] requests.", parse);
			}
			
			Text.NL();
			// RANDOM SCENE
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>“I... I am at your mercy, [playername],”</i> the elf bows [hisher] head subserviently, <i>“p-please, tell me what I should do... command me.”</i> It almost sounds like [heshe] is getting off on this.", parse);
				kiakai.subDom.DecreaseStat(-50, 1);
				KiakaiSex.AnalCatchPrep();
			}, 1.0, function() { return kiakai.subDom.Get() < -30; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Ah... c-can we do that thing you mentioned?”</i> [name] squirms a bit, blushing.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“M-may I prepare you myself?”</i> The elf squirms a bit, indicating your [anus].", parse);
					KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Rim);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“C-can you suck on it?”</i> The elf bites [hisher] lip, uncertain on how you will respond.", parse);
					KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Suck);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“What if I did it myself?”</i> The elf waves at[oneof] [hisher] [kcock]. <i>“It is quite big, so...”</i> [heshe] trails off, embarrassed.", parse);
					KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Selfsuck);
				}, 1.0, function() { return kiaiCock.length.Get() >= 25; });
				scenes.AddEnc(function() {
					Text.Add("<i>“P-perhaps you can provide some?”</i> the elf stutters. When you raise your eyebrow quizzically, [heshe] gestures toward your [cocks], embarrassed.", parse);
					KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Frot);
				}, 1.0, function() { return player.FirstCock(); });
				// TODO: Other oils?
				scenes.AddEnc(function() {
					Text.Add("<i>“C-can I try some of this oil?”</i> the elf asks you.", parse);
					KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Oil);
				}, 1.0, function() { return party.inventory.QueryNum(Items.SnakeOil); });
				scenes.Get();
			}, 1.0, function() { return kiakai.subDom.Get() >= -40 && kiakai.subDom.Get() < 10; });
			scenes.AddEnc(function() {
				Text.Add("<i>“O-okay, then we will try...”</i> [name] quickly decides on a course, glancing at you nervously to see if you will allow [himher] to take the lead.", parse);
				kiakai.subDom.IncreaseStat(25, 1);
				KiakaiSex.AnalCatchPrep();
			}, 1.0, function() { return kiakai.subDom.Get() >= -10 && kiakai.subDom.Get() < 25; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Then, we will do it this way...”</i> [name] confidently declares.", parse);
				kiakai.subDom.IncreaseStat(50, 1);
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Suck, true);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Frot, true);
				}, 1.0, function() { return player.FirstCock(); });
				// TODO: Other oils?
				scenes.AddEnc(function() {
					KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Oil, true);
				}, 1.0, function() { return party.inventory.QueryNum(Items.SnakeOil); });
				scenes.Get();
			}, 1.0, function() { return kiakai.subDom.Get() > 20; });
			scenes.Get();
		}, enabled : kiaiCock,
		tooltip : attitude ? Text.Parse("Your [anus] craves filling, and the elf can sate your hunger. Have [name] fuck you.", parse) : Text.Parse("Have [name] fuck you.", parse)
	});
	Gui.SetButtonsFromList(options);
}

Kiakai.AnalCatchPrepScene = {
	Rim      : 1,
	Suck     : 2,
	Selfsuck : 3,
	Frot     : 4,
	Oil      : 5
};

KiakaiSex.AnalCatchPrep = function(choice, assert) {
	Text.Flush();
	
	// TODO Toys
	var playerCock = player.BiggestCock(null, true);
	var kiaiCock   = kiakai.BiggestCock(null, true);
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,		
		kCockDesc2   : function() { return kiakai.AllCocks()[1].Short(); },		
		jobDesc      : function() { return kiakai.JobDesc(); },
		boygirl      : kiakai.body.femininity.Get() > 0 ? "girl" : "boy"		
	};
	
	parse = kiakai.ParserPronouns(parse);
	parse = kiakai.ParserTags(parse, "k");
	parse = player.ParserTags(parse);
	
	parse.stuttername = player.name[0] + "-" + player.name;
	parse.gen = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
					player.FirstVag() ? function() { return player.FirstVag().Short(); } :
					"featureless crotch";
	parse.kgen = kiakai.FirstCock() ? function() { return kiakai.MultiCockDesc(); } :
					kiakai.FirstVag() ? function() { return kiakai.FirstVag().Short(); } :
					"featureless crotch";
	
	parse = Text.ParserPlural(parse, kiakai.NumCocks() > 1);
	
	Text.Flush();
	//[Rim][Suck [himher]][Selfsuck][Frot][Oil]
	var options = new Array();
	options.push({ nameStr : "Rim",
		func : function() {
			KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Rim, true);
		}, enabled : true,
		tooltip : "Have the elf give you a rimjob."
	});
	options.push({ nameStr : Text.Parse("Suck [himher]", parse),
		func : function() {
			KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Suck, true);
		}, enabled : true,
		tooltip : "Get the elf nice and slick with your mouth."
	});
	options.push({ nameStr : "Selfsuck",
		func : function() {
			KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Selfsuck, true);
		}, enabled : kiaiCock.length.Get() >= 25,
		tooltip : Text.Parse("Tell the elf to suck [himher]self off.", parse)
	});
	if(player.FirstCock()) {
		options.push({ nameStr : "Frot",
			func : function() {
				KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Frot, true);
			}, enabled : true,
			tooltip : "You could use your own cum..."
		});
	}
	options.push({ nameStr : "Oil",
		func : function() {
			KiakaiSex.AnalCatchPrep(Kiakai.AnalCatchPrepScene.Oil, true);
		}, enabled : party.inventory.QueryNum(Items.SnakeOil),
		tooltip : "Use a vial of oil."
	});
	
	if(!choice) {
		Gui.SetButtonsFromList(options);
		return;
	}
	else if(!assert) {
		//[Sure][Nah]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				kiakai.subDom.IncreaseStat(10, 1);
				KiakaiSex.AnalCatchPrep(choice, true);
			}, enabled : true,
			tooltip : "Accept the elf's request."
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("Slightly annoyed, you shake your head. [name] looks a bit crestfallen. Instead, you will...", parse);
				kiakai.subDom.DecreaseStat(-30, 1);
				KiakaiSex.AnalCatchPrep();
			}, enabled : true,
			tooltip : "The nerve... you have a much more appropriate thing in mind."
		});
		Gui.SetButtonsFromList(options);
		return;
	}
	
	Text.Clear();
	
	var len = kiaiCock.length.Get();
	var cap = 25;
	
	if     (choice == Kiakai.AnalCatchPrepScene.Rim) {
		parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? ", pushing your legs back" : "";
		Text.Add("<i>“Just lean back and relax...”</i> [name] murmurs[legs]. Gently, the elf spreads your cheeks, planting a kiss directly on your yearning rosebud. [name] plies you open as [heshe] teases your opening with [hisher] [ktongue], licking and lapping before plunging in.", parse);
		Text.NL();
		Text.Add("The elf seems to have plenty of oral experience; [heshe] expertly weakens your resistance, tongue probing deep inside you. Just as you are starting to get really hot and bothered, [name] withdraws from your lathered [anus], licking [hisher] lips. Time for the main course.", parse);
	}
	else if(choice == Kiakai.AnalCatchPrepScene.Suck) {
		Text.Add("Wordlessly, [name] parts [hisher] legs, giving you full access to [hisher] [kcocks]. Smiling, you lean in and plant a kiss on[oneof] [hisher] [kcockTip][s]. Eager to get to the main course, you waste no time in ramming as much of the [kcock] as you can down your throat, lathering its length in slick saliva.", parse);
		Text.NL();
		if(kiakai.FirstCock()) {
			Text.Add("[name] throbs under your ministrations, and you taste [hisher] pre on your tongue. You don't want [himher] to go off quite yet though, so after a few more mouthfuls, you withdraw.", parse);
			Text.NL();
		}
		Text.Add("The elf's [kcock] makes a loud popping sound as it is freed from the grip of your lips. The length is glistening, well prepared for entering you.", parse);
	}
	else if(choice == Kiakai.AnalCatchPrepScene.Selfsuck) {
		Text.Add("[name] gives [himher]self a few experimental strokes, coaxing[oneof] [hisher] [kcock] to rise to its full glory. Nervously, the elf dips [hisher] head, shuddering as [heshe] plants a kiss on the twitching [kcockTip].", parse);
		Text.NL();
		if(kiakai.FirstCock()) {
			Text.Add("A bead of pre begins to form almost immediately, giving [himher] plenty of lubricant to spread over [hisher] long member.", parse);
			Text.NL();
		}
		Text.Add("Gaining steam, [name] curls [hisher] back, stretching down as far as [heshe] will go, lathering [hisher] own [kcock] with slick fluids. Ever helpful, you caress [hisher] [khair], simultaneously preventing the elf from backing away from [hisher] twitching rod. You drag your other hand along the throbbing length, whispering encouragements as you let your fingers trail along the exposed veins.", parse);
		Text.NL();
		if(kiakai.FirstCock() && Math.random() < 0.3) {
			Text.Add("Too late, you interpret [name]'s whimpering moans. The [kcock] lurches violently under your light touch. Helpless to prevent the surge rising in [hisher] [kballs], [name] resigns to swallowing [hisher] own load.", parse);
			Sex.Blowjob(kiakai, kiakai);
			kiakai.FuckOral(kiakai.Mouth(), kiakai.FirstCock(), 1);
			kiakai.Fuck(kiakai.FirstCock(), 1);
			Text.NL();
			Text.Add("Trails of sticky cum leak past the tight embrace of the elf's soft lips, dripping down [hisher] length.", parse);
			Text.NL();
			// DOMMY
			if(player.subDom.Get() - kiakai.subDom.Get() > 0) {
				Text.Add("How bothersome. While [name] is certainly lubed up, [heshe] is far from ready to fuck, [hisher] softening member popping out of [hisher] mouth. Well, let's see what you can do to fix that.", parse);
				Text.NL();
				Text.Add("The tired elf groans in surprise as you jam two digits into [hisher] [kanus], [hisher] [kcock] jumping back to life. You're not going to have [himher] go soft on you just yet.", parse);
				Text.NL();
				Text.Add("<i>“Ahh! I... I understand, [playername], I am sorry for not being able to hold back,”</i> [name] gasps, squirming around your pumping fingers, <i>“I... I think I am ready to - ungh - go ahead.”</i> Sure enough, the cum-covered [kcock] is once again stiff.", parse);
			}
			// SUBBY
			else {
				Text.Add("You find your mouth watering at the sight of [hisher] twitching member. If only the elf wasn't keeping it all to [himher]self... Giving in to your desires, you lick [name]'s [kcock], trying to capture any stray drops.", parse);
				Text.NL();
				Text.Add("The elf's breathing comes in short bursts as [hisher] cock pops out of [hisher] mouth, cum dripping from [hisher] lolling tongue.", parse);
				Text.NL();
				Text.Add("<i>“I... haah... I am sorry, [playername],”</i> [name] pants. <i>“C-could you help get me going again?”</i> [HeShe] doesn't have to ask twice, and you lovingly wrap your lips around [hisher] [kcockTip], sucking lightly on it, goading it back to life.", parse);
			}
		}
	}
	else if(choice == Kiakai.AnalCatchPrepScene.Frot) {
		parse["oneof2"] = player.NumCocks() > 1 ? " one of" : "";
		Text.Add("[name] delicately cradles[oneof2] your [cocks], prodding it lightly with[oneof] [hisher] [kcocks]. You sigh luxuriantly as the elf grinds against you while [hisher] hands try to wrap around both of the shafts. Doing your best to help [himher] along, you massage yourself, hands dancing all over your body, trying to coax an orgasm out of your [cock] as quickly as possible.", parse);
		Text.NL();
		Text.Add("Under your combined efforts, you are soon moaning uncontrollably. The final straw is added when [name] starts rapidly rutting against your [cock] while massaging your sensitive [cockTip] at the same time. Twitching violently, you let loose a stream of cum, the sticky threads splattering on both of you. [name] is quick to gather it up, lathering [hisher] [kcock] in your seed.", parse);
		var cum = player.OrgasmCum();
		if(cum > 3)
			Text.Add(" There is definitely more than enough to take from, and when the elf's cock is fully lubed up, the leftovers form a small pool on the ground.", parse);
		Text.NL();
		Text.Add("<i>“A-are you ready to go, [playername]?”</i> the elf huffs when your fountain has finally dried up. While you just got off, your companion is still aching to fuck, [kcock] stiff and eager. Weakly, you nod to [himher], urging the elf to go give in to [hisher] desire.", parse);
	}
	else if(choice == Kiakai.AnalCatchPrepScene.Oil) {
		party.inventory.RemoveItem(Items.SnakeOil);
		Text.Add("You produce a vial of slick oil from your bags. The liquid is cool on your [skin] as the elf generously applies it to your [anus], working some of the sticky substance into your passage. [name] pours the rest on[oneof] [hisher] [kcocks], spreading the soothing lubricant with long, slow strokes.", parse);
		Text.NL();
		Text.Add("The elf's [kcock] is glistening, drops of excess oil splattering down on your waiting [butt]. You are as ready to have [himher] take you as you'll ever be.", parse);
	}
	
	Text.NL();
	parse["ba"] = player.HasBalls() ? Text.Parse(", pulling your [balls] aside", parse) : "";
	Text.Add("<i>“H-here I come, [playername]!”</i> [name] announces nervously. You lean back[ba], exposing your [anus]. A seductive wave of your hand is all it takes for the elf to accept your invitation, as [heshe] almost jumps on you in [hisher] eagerness. Guiding [hisher] shaft into position, [name] presses [hisher] [kcockTip] against your inviting anus. Thanks to the generous lubrication and a little effort, the elf easily penetrates you, pushing the first few inches of [hisher] member inside you.", parse);
	Text.NL();
	
	var virgin = player.Butt().virgin;
	kiakai.Fuck(kiaiCock, 3);
	player.FuckAnal(player.Butt(), kiaiCock, 3);
	Sex.Anal(kiakai, player);
	
	if(kiakai.flags["SexCatchAnal"] == 0) {
		Text.Add("<i>“S-so tight! You feel really good, [playername]!”</i> [name] gasps. <i>“That it would feel this good... aah!”</i>", parse);
		Text.NL();
	}
	if(virgin) {
		Text.Add("<i>“D-does it hurt?”</i> [name] asks, concerned. You shake your head, trying to keep back the tears. It <i>is</i> painful, but it also feels oh so good.", parse);
		Text.NL();
	}
	Text.Add("You urge [himher] on, trying to loosen your sphincter so that [hisher] passage will be easier. Inch by inch, [name] presses on, feeding [hisher] length into your [anus].", parse);
	Text.NL();
	if(len > cap)
		Text.Add("You moan as the [kcockTip] of the elf's [kcock] prods at the deepest reaches of your colon. A glorious feeling of fullness spreads through your nethers as the large shaft strains against your limits. Your only regret is that you can't take it all.", parse);
	else
		Text.Add("After what feels like an eternity, you feel the elf's hips tap against yours as [heshe] bottoms out in you.", parse);
	Text.NL();
	Text.Add("<i>“I will begin to move,”</i> [name] declares, gulping slightly as [heshe] revels in the tightness of your back passage. True to [hisher] word, the elf starts to gently thrust [hisher] hips, enjoying [himher]self enormously if [hisher] whorish moans are any indication. You pull [himher] in for another kiss as [heshe] picks up [hisher] pace.", parse);
	Text.NL();
	Text.Add("[name] sets a relatively slow rhythm, thrusting into you with long strokes.", parse);
	if(player.FirstCock()) {
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		Text.Add(" Your own [cocks] [isAre] straining to get free, trapped against [name]'s [kbelly] as pre-cum leaks in generous amounts from [itsTheir] tip[s].", parse);
	}
	if(kiakai.HasBalls())
		Text.Add(" The elf's sack slaps against you at the apex of each throbbing thrust, sloshing with virile contents, most of which will likely end up being deposited in your needy anal passage.", parse);
	Text.NL();
	if(kiakai.sexlevel <= 2)
		Text.Add("The elf is doing a good job, if maybe going a bit slow for your tastes.", parse);
	else if(kiakai.sexlevel <= 4)
		Text.Add("You gasp lewdly, as [name] is doing a <i>very</i> good job.", parse);
	else
		Text.Add("You moan uncontrollably as [name] rails you, every thrust hitting just the right spot. The elf's intimate knowledge of your body shows through.", parse);
	Text.NL();
	Text.Add("<i>“H-how is it?”</i> [heshe] pants.", parse);
	Text.Flush();
	
	
	//[Sure][Nah]
	var options = new Array();
	options.push({ nameStr : "Take charge",
		func : function() {
			var tailpegFlag = false;
			var suckFlag    = false;
			var jerkFlag    = false;
			
			Text.Clear();
			Text.Add("<i>“Come on, I'm getting bored here,”</i> you glower, pouting in disappointment. <i>“Man up, this is pathetic!”</i>", parse);
			Text.NL();
			if(kiakai.sexlevel >= 4) {
				Text.Add("The lie on your lips sounds almost pitiful, as you can hardly keep your thoughts gathered. You desperately hope that the elf doesn't notice how much of an effect [heshe] is having on you.", parse);
				Text.NL();
			}
			Text.Add("<i>“I... I am sorry, [playername], I will strive to do better!”</i> [name] stammers, hurt by your admonishment. [HeShe] tries to speed up, but in [hisher] hurry, [heshe] loses [hisher] rhythm, annoying you further.", parse);
			Text.NL();
			if(kiakai.flags["SexCatchAnal"] == 0)
				Text.Add("<i>“I finally give you the <b>privilege</b> of fucking me, and this is what you amount to?”</i>", parse);
			else
				Text.Add("<i>“You should know better by now,”</i> you taunt, <i>“have you learned nothing?”</i>", parse);
			parse["oafKlutz"] = kiakai.mfTrue("oaf", "klutz");
			Text.Add(" You sigh. <i>“Get off me, you [oafKlutz]. I'll show you how it's done.”</i>", parse);
			Text.NL();
			Text.Add("[name] hurriedly complies, [hisher] eyes lowered in shame as [heshe] pulls out of you. Not wasting any time, you roughly shove [himher] on [hisher] back, [hisher] rigid [kcock] rising like a pillar from [hisher] crotch. Time to get some mileage out of it.", parse);
			Text.NL();
			Text.Add("You crouch over the elf, lowering yourself on [himher], slamming your hips down roughly. [name] gasps for breath as you bottom out in one thrust, grinding against [himher] before rising again. Rapidly riding the panting elf, you decide to taunt [himher] some more.", parse);
			Text.NL();
			parse["puny"] = kiaiCock.Len() > 35 ? "'puny'" : "puny";
			Text.Add("<i>“See? Even this [puny] stick of yours can be put to good use!”</i> you hiss, bouncing on [hisher] lap. <i>“Perhaps you need to be fucked more yourself, to learn how it's done!”</i>", parse);
			Text.NL();
			Text.Add("<i>“[playername]!”</i> [name] yelps, <i>“I... I... aaah!”</i> Beyond words, the elf just lies back and takes it, grunting each time you spear yourself on [hisher] [kcock].", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>“Bet you're feeling left out with nothing stuck up your ass,”</i> you huff, briefly interrupting your self-impaling. <i>“Wouldn't you like a nice, thick tail inside you?”</i>", parse);
				Text.NL();
				Text.Add("Not waiting for [hisher] response, you twist your [tail], pressing its tip against [name]'s [kanus]. The elf cries out as you penetrate past [hisher] meager defenses, burying your [tail] deep inside [himher]. Using your hands, you guide the prehensile appendage as far up [name]'s butt as it will go, filling [himher] completely.", parse);
				Text.NL();
				Text.Add("<i>“There, that should be enough, even for a shameless slut like you.”</i> The elf moans weakly as you resume your bouncing, overwhelmed by your dual assault.", parse);
				Text.NL();
				kiakai.subDom.DecreaseStat(-75, 1);
				tailpegFlag = true;
			}, 1.0, function() {
				var tail = player.HasTail();
				return tail && tail.Prehensile() && player.sexlevel >= 3 && kiakai.sexlevel >= 3;
			});
			scenes.AddEnc(function() {
				parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
				Text.Add("<i>“Hey, make yourself useful!”</i> You imperiously motion to[oneof] your bobbing [cocks]. <i>“Suck!”</i>", parse);
				Text.NL();
				Text.Add("It takes a bit of flexing, but [name] manages to grab hold of the wildly twitching shaft, wrapping [hisher] lips around the [cockTip]. Grunting, you praise [himher] for being such an obedient slut, and tell [himher] that you'll be sure to offer [himher] a nice, tasty reward. [name] eagerly licks and laps at your [cock], using [hisher] [ktongue] to good effect.", parse);
				Text.NL();
				Text.Add("Seeing as the elf has something to keep [himher]self busy for a while, you slam your hips down, rapidly milking [hisher] [kcock] for all you're worth.", parse);
				Text.NL();
				kiakai.subDom.DecreaseStat(-75, 1);
				suckFlag = true;
			}, 1.0, function() {
				var cock = player.FirstCock();
				return cock && cock.length.Get() > 20 && player.sexlevel >= 2;
			});
			scenes.AddEnc(function() {
				parse["oneof"] = kiakai.NumCocks() > 2 ? " one of" : "";
				parse["s"]     = kiakai.NumCocks() > 2 ? "s" : "";
				Text.Add("<i>“It would be a shame to not put all that excess cock to use...”</i> You grin, grabbing hold of[oneof] [name]'s remaining shaft[s]. As you bounce up and down, impaling yourself on the elf, you stroke the rigid member vigorously.", parse);
				Text.NL();
				Text.Add("<i>“Mmm... when this one goes off, where do you think it'll land?”</i> To make your intentions clear, you press [name]'s [kCockDesc2] to [hisher] chest, aiming it squarely at [hisher] face. <i>“I know you're always hungry for more cock-butter; eating your own shouldn't bother you, right?”</i> The elf moans, opening [hisher] mouth in anticipation, tongue lolling like that of a dog. You can hardly wait to give [himher] a face-full of [hisher] own spunk.", parse);
				Text.NL();
				kiakai.subDom.DecreaseStat(-75, 1);
				jerkFlag = true;
			}, 1.0, function() { return kiakai.NumCocks() > 1; });
			scenes.Get();
			
			Text.Add("<i>“Hngh, yeah!”</i> you grunt. <i>“All you have to do is stay hard - even you should be able to manage that - and don't you dare cum until I tell you!”</i> From the looks of it, this is not an entirely easy challenge for the elf. [HisHer] eyes are glazed over, and [heshe] moans loudly each time you slam your hips down, overcome with pleasure.", parse);
			Text.NL();
			Text.Add("<i>“You know, you look like such an incredible slut right now,”</i> you taunt. <i>“Just who is fucking whom here?”</i> To accentuate the absurdity of the situation, you ram down on [himher], nearly driving the air from [hisher] lungs by the sound of it.", parse);
			Text.NL();
			if(len > cap) {
				Text.Add("<i>“Ngh... I felt that one,”</i> you groan, sore from [name]'s shaft, penetrating deeper than anything you've felt before. <i>“You better heal that up; it's your fault for having such a ridiculously large fuck-stick!”</i>", parse);
				Text.NL();
				Text.Add("A wisp of concern flits across [name]'s delirious expression, and the elf places a trembling hand on your abdomen, letting [hisher] healing energy flow into you.", parse);
				Text.NL();
				kiakai.AddSPFraction(-0.3);
				player.Butt().capacity.IncreaseStat(len, 5);
			}
			Text.Add("Time to give the elf a good workout. Without any regard for [hisher] feelings, you use [himher] as a living sex toy, repeatedly impaling yourself on [hisher] [kcock]. Hissing, you repeat your command that [heshe] is not allowed to cum until the moment you tell [himher] so, not under any circumstances.", parse);
			Text.NL();
			
			if(tailpegFlag) {
				Text.Add("Not that you are by any means making that easy for [himher]. In addition to your [anus] constricting around [hisher] [kcock], your tail is shoved so far up [hisher] [kanus] that it's unlikely the elf will be able to sit for quite some time. With each bounce, the appendage squirms inside [name]", parse);
				if(!kiakai.HasBalls() && kiakai.FirstCock())
					Text.Add(", grinding against [hisher] prostate", parse);
				Text.Add(".", parse);
				Text.NL();
				Text.Add("<i>“Fuuuuuuck!”</i> [name] exclaims.", parse);
				Text.NL();
				Text.Add("<i>“Not so formal with a tail stuck up your butt, are you, my little [jobDesc]? I'll be sure to use it more often... might teach you some of that precious humility you strive for!”</i>", parse);
				Text.NL();
			}
			else if(suckFlag) {
				Text.Add("[name] is quite the multitasker, as [heshe] hasn't neglected your [cock] for even a second, no matter how rough the ride is getting. [HeShe] isn't doing that bad either, considering the circumstances. Still, you could never miss a chance to tease [himher].", parse);
				Text.NL();
				Text.Add("<i>“That's right, suck on it like a good little slut... I suppose you are aching for a nice treat, but you are going to have to work harder for it!”</i> All the elf can do in response is utter a muffled groan, as [hisher] mouth is otherwise occupied.", parse);
				if(player.FirstCock().length.Get() > 35)
					Text.Add(" [HisHer] vibrating throat fits quite snugly around your ridiculously large dick, which is giving [himher] considerable problems breathing. Now and then, [heshe] pulls back slightly, allowing fresh air to enter through [hisher] nostrils.", parse);
				Text.NL();
			}
			else if(jerkFlag) {
				Text.Add("A bead of pre is forming on [name]'s [kCockDesc2], coaxed from the twitching shaft by your incessant jerking. Letting go of it for a moment, you swipe up the sticky liquid, smearing it on the elf's lips.", parse);
				Text.NL();
				Text.Add("<i>“A taste of what's to come,”</i> you purr, <i>“but remember, no matter how much you want to wallow in your own cum, you are <b>not</b> allowed until I tell you so!”</i>", parse);
				Text.NL();
				if(kiakai.Slut() >= 50)
					Text.Add("<i>“I... I want it,”</i> [name] pants, eagerly licking up the meager offering you left [himher], <i>“please, let me have it!”</i> Laughing sultrily, you wag one of your fingers in front of [himher], denying [himher] that indulgence.", parse);
				else {
					Text.Add("<i>“P-please, [playername], I am not that kind of person!”</i> [name] gasps, tongue lolling as [heshe] skips for breath. [HeShe]'s so quick about it that you almost miss it, but you catch [himher] licking [hisher] lips clean, gulping down the spunk you offered [himher].", parse);
					Text.NL();
					Text.Add("<i>“Really? Your cock disagrees with you. Just a gentle touch and you are already drooling...”</i> That said, your touch has been anything but gentle so far.", parse);
				}
				Text.NL();
				parse["thk"] = kiakai.AllCocks()[1].thickness.Get() > 6 ? ", though it takes you both hands to manage it" : "";
				Text.Add("Grinning, you grasp at the base of the [kCockDesc2], clasping your fingers around it painfully hard[thk]. Keeping your hold tight, you begin to jerk it again, your vice-like grip making sure that no stray splash of pre escapes the throbbing shaft.", parse);
				Text.NL();
			}
			Text.Add("Abandoning everything and focusing solely on the ecstatic feeling of [name]'s [kcock] ramming into you, you set your throttle to full speed, clenching your teeth as you rapidly bounce atop the moaning elf. Both of you are beyond words, reduced to mindless grunting by your breakneck pace. You can't keep it up for long, but you are damn well going to make the most of it.", parse);
			Text.NL();
			
			var expFraction = 0.5 * player.sexlevel / kiakai.sexlevel;
			// Elf cums first
			if(Math.random() < expFraction) {
				var cum = kiakai.OrgasmCum();
				
				if(suckFlag)
					Text.Add("[name]'s moaning climax is muffled by the cock stuffed down [hisher] gullet. The vibrations from [hisher] exaltation batter your [cock], providing an exquisite oral massage.", parse);
				else
					Text.Add("[name] cries out joyously as [hisher] climax comes crashing down, [hisher] hips shaking in ecstasy.", parse);
				if(kiakai.FirstCock()) {
					parse["weakStrong"] = cum > 3 ? "strong" : "weak";
					Text.Add(" The elf pours [weakStrong] jets of cum directly into your stuffed [anus], rapidly filling you as you milk [hisher] [kcock].", parse);
				}
				else
					Text.Add(" The elf's artificial shaft shudders inside you, its wearer too drained to go on.", parse);
				Text.NL();
				if(jerkFlag) {
					Text.Add("Just as the cock pulsates inside you, the one in your hand also goes off, streaming gouts of white spunk from its dilated cumslit. Your marksmanship is excellent: each glob of cum lands squarely on [name]'s pretty face. As the faucet runs dry, you imperiously instruct [himher] to open up and accept your generous offering.", parse);
					Text.NL();
					Text.Add("The elf looks dazed as [heshe] parts [hisher] lips, meekly licking [hisher] own cum from them.", parse);
					Text.NL();
				}
				else if(tailpegFlag) {
					parse["real"] = kiakai.strapOn ? " orgasmed" : Text.Parse(" shot [hisher] load", parse);
					Text.Add("While the elf may have[real], that doesn't mean you are done with [himher] just yet. The [tail] stuck up [name]'s butt, rather than slowing down, rapidly pumps [hisher] innards", parse);
					if(kiakai.FirstCock())
						Text.Add(", the thick appendage squeezing [hisher] prostate for its precious milk", parse);
					Text.Add(".", parse);
					Text.NL();
				}
				Text.Add("<i>“Ain't you a lovely sight,”</i> you purr contentedly, still bouncing up and down in [hisher] quivering lap. <i>“Trembling and whimpering like an innocent maid, and you're not even the one on the receiving end!”</i> You lean down, licking [hisher] cheek lovingly. <i>“Perhaps you want to be, next time?”</i> you whisper huskily in [hisher] ear.", parse);
				Text.NL();
				if(suckFlag)
					Text.Add("A rather rhetorical question, as the elf couldn't answer you if [heshe] wanted to, being busy sucking on your [cockDesc].", parse);
				else {
					Text.Add("<i>“I... uhm... s-stop putting weird ideas in my head!”</i> [name] yelps, blushing furiously at your proposition.", parse);
					if(!kiakai.Butt().virgin) {
						Text.NL();
						Text.Add("<i>“Come now, it would hardly be your first,”</i> you grin.", parse);
					}
				}
				Text.NL();
				parse["bal"] = player.HasBalls() ? Text.Parse("a surge in your [balls]", parse) : "a tightening of your loins";
				Text.Add("Without regard for the moaning elf beneath you, you continue to ram your hips down, impaling yourself on [hisher] [kcock]. Eventually, you can feel your own climax approaching, heralded by [bal]. Crying out triumphantly, you feel your [anus] clench around [name]'s still twitching [kcock], each downthrust sending a jolt of pleasure up your spine.", parse);
				Text.NL();
				var cum = player.OrgasmCum();
				if(player.FirstCock()) {
					Text.Add("<i>“Here it comes!”</i> you pant excitedly, feeling your sperm speed through your body, searching for a convenient exit.", parse);
					Text.NL();
					parse["considerable"] = cum > 3 ? " considerable" : "";
					parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
					if(suckFlag) {
						Text.Add("The elf makes gulping noises as you unload in [hisher] mouth, pouring your semen down [hisher] throat. Not a single drop of your[considerable] load escapes [hisher] tightly sealed lips, all of it eagerly swallowed by your horny companion.", parse);
					}
					else {
						Text.Add("True to your word, you let your [cocks] dump [itsTheir] [considerable] load all over your horny companion, coating [hisher] face, hair and [kbreasts] with sticky semen.", parse);
					}
				}
				else {
					Text.Add("You breathe heavily, trembling slightly from the exertion.", parse);
					if(player.FirstVag())
						Text.Add(" A steady trickle of clear juices flows from your quivering cunt, pooling near the base of [name]'s [kcock].", parse);
				}
				if(tailpegFlag) {
					Text.NL();
					Text.Add("<i>“Ah, are you going to, uh, withdraw your tail?”</i> the elf asks you uncertainly.", parse);
					Text.NL();
					Text.Add("<i>“You don't like it?”</i> you tease, feigning innocence as you slowly grind the prehensile appendage inside [hisher] rear, forcing the occasional moan from the blushing elf.", parse);
					Text.NL();
					Text.Add("<i>“Well...”</i> [name] trails off, mumbling a bit.", parse);
				}
			}
			// You cum first
			else {
				Text.Add("Despite your mocking bravado, you are the first one to cum, crying out as you feel your climax wreck your body. Judging by the way that [name]'s [kcock] is twitching in the crushing confines of your [anus], [heshe] probably won't be far behind.", parse);
				var cum = player.OrgasmCum();
				if(player.FirstVag()) {
					Text.Add(" Your clear juices drip from your squirting [vag], splattering onto [name]'s [kbelly].", parse);
				}
				if(player.FirstCock()) {
					parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
					parse = Text.ParserPlural(parse, player.NumCocks() > 1);
					if(suckFlag) {
						Text.Add(" Groaning with pleasure, you let loose your load down [name]'s waiting throat.", parse);
						if(player.NumCocks() > 1) {
							Text.Add(" Your other dick[s2] deposit[notS2] [itsTheir2] sticky spunk all over the dutifully gulping elf.", parse);
						}
						if(cum > 3)
							Text.Add(" The elf sputters, [hisher] belly swelling noticeably, strained by the sheer amount of semen you are pumping directly into it.", parse);
						Text.NL();
						Text.Add("[HeShe] has a very satisfied look on [hisher] face by the time your [cock] pops out of [hisher] mouth, relishing your heady taste.", parse);
					}
					else {						
						Text.Add(" Your [cocks] erupt[notS] all over the moaning elf, painting [himher] in strands of sticky white cum.", parse);
						if(cum > 3)
							Text.Add(" From the looks of it, it'll take more than a little effort to get [himher] cleaned up again.", parse);	
					}
				}
				Text.NL();
				Text.Add("Just like you thought, it isn't long before [name] [himher]self joins you in glorious climax.", parse);
				
				var cum = kiakai.OrgasmCum();
				
				parse["considerable"] = cum > 3 ? " considerable" : "";
				if(kiakai.FirstCock()) {
					Text.Add(" You can feel [hisher] [kcock] throb inside you, depositing its[considerable] load in your bowels. Within seconds, your colon is sticky with hot spunk.", parse);
					if(cum > 3) {
						parse["itThey"]  = kiakai.HasBalls() ? "they" : "it";
						parse["hasHave"] = kiakai.HasBalls() ? "have" : "has";
						Text.Add(" [name]'s [kballs] seems like [itThey] [hasHave] an unending amount of sperm, easily filling your back passage within seconds. More and more white goo pumps into your used rectum, slightly inflating your [belly].", parse);
					}
				}
				if(jerkFlag) {
					Text.Add(" As if to not let its sibling have all the fun, [name]'s second dick twitches, a large, sticky wad of cum forcing its way past the enclosing ring of your fingers, into [hisher] eager mouth. You bet [heshe]'s been waiting for that one. Well, [heshe]'s earned it. You let go of the [kCockDesc2], letting [hisher] semen flow freely down [hisher] throat.", parse);
					if(kiakai.NumCocks() > 2)
						Text.Add(" The rest of [name]'s dicks throb in unison, splattering their contents on both of you.", parse);
					else if(kiakai.NumCocks() > 1)
						Text.Add(" [name]'s remaining dick throbs, splattering its contents on both of you.", parse);
				}
				if(tailpegFlag) {
					Text.Add(" [name]'s [kanus] clenches tightly around your [tail] as if trying to milk it.", parse);
				}
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("The two of you lie panting in each other's arms for a while, an exhausted pile of flesh, sweat and sexual fluids.", parse);
				Text.NL();
				if(kiakai.subDom.Get() < -50) {
					Text.Add("<i>“Not too bad,”</i> you purr, stretching sinuously. <i>“If you are a <b>really</b> good [boygirl], I might consider letting you do that again.”</i>", parse);
					Text.NL();
					Text.Add("[name] bows [hisher] head, confessing that [heshe] would love that.", parse);
				}
				else if(kiakai.subDom.Get() < -20) {
					Text.Add("<i>“T-that was... by the spirits...”</i> [name] gasps feebly.", parse);
					Text.NL();
					Text.Add("<i>“Nothing but a taste,”</i> you promise amiably, <i>“you still have plenty of training ahead of you.”</i>", parse);
				}
				else {
					Text.Add("<i>“So... rough... I could not take more...”</i> [name] gasps feebly. You glower at [himher].", parse);
					Text.NL();
					Text.Add("<i>“I was holding back. Perhaps I shouldn't have. Perhaps I won't next time.”</i> The elf gulps nervously, knowing that you are serious.", parse);
				}
				Text.NL();
				Text.Add("You amuse yourself with petting the elf for a while, the two of you basking in the afterglow of your lovemaking. After eventually getting cleaned up, you gather your gear and set out once more, both of you sated for now.", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
				
				TimeStep({hour: 1});
				player.AddLustFraction(-1);
				kiakai.AddLustFraction(-1);
				kiakai.subDom.DecreaseStat(-75, 2);
				player.subDom.IncreaseStat(40, 1);
				kiakai.flags["SexCatchAnal"] = 1;
				Gui.NextPrompt();
			});
		}, enabled : true,
		tooltip : "This is sad. Do you have to do everything?"
	});
	
	options.push({ nameStr : "More",
		func : function() {
			Text.Clear();
			Text.Add("You moan contentedly that [heshe] has the right idea, encouraging [himher] to keep going. [name] sets a steady rhythm, pushing deep inside you with each thrust. The elf leans down, planting kisses on your lips and neck, unabashedly letting [hisher] hands roam over your body.", parse);
			if(player.LowerBodyType() != LowerBodyType.Single)
				Text.Add(" You wrap your legs around [hisher] waist, hugging [himher] tightly, preventing the elf from pulling away - not that [heshe] shows any indication of wanting to do so.", parse);
			Text.NL();
			if(player.FirstCock()) {
				parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
				parse = Text.ParserPlural(parse, player.NumCocks() > 1);
				Text.Add("Your [cocks] rub[notS] against [name]’s [kbelly], trapped between you. [HeShe] reaches down, wrapping [hisher] slender fingers around[oneof] your member[s], jerking it in time with [hisher] hip movements.", parse);
				Text.NL();
			}
			else if(player.FirstVag() && kiakai.NumCocks() > 1) {
				parse["oneof"] = kiakai.NumCocks() > 2 ? " one of" : "";
				parse = Text.ParserPlural(parse, kiakai.NumCocks() > 2);
				Text.Add("As your bodies squirm together,[oneof] [name]’s unattended cock[s] brush[notEs] against your wet [vag], the undercarriage teasing your labia.", parse);
				Text.NL();
			}
			
			if(player.FirstBreastRow().size.Get() > 3) {
				parse["brNoun"] = player.FirstBreastRow().noun();
				Text.Add("One of [name]’s hands finds its way to your [breasts], cupping the [brNoun] lovingly, kneading the soft flesh.", parse);
				Text.NL();
			}
			Text.Add("<i>“Ahh, you are amazing, [playername]!”</i> the elf groans, grinding [hisher] hips against you, spearing you on [hisher] [kcock]. <i>“S-so tight!”</i> Your arms snake around your companion, caressing [hisher] back, pulling [himher] down into an intimate kiss.", parse);
			Text.NL();
			parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? "between your thighs" : "into your colon";
			Text.Add("[name]’s [kcock] pistons in and out of you at an unbelievable speed, a hot pillar of lust thrusting [legs], connecting your bodies into one entity. [HisHer] panting breath is hot on your cheek when [heshe] breaks the kiss, leaning down to nibble at your neck again. You moan appreciatively, twining your fingers through [hisher] hair. The elf wraps [hisher] lips around one of your [nips], sucking lightly on it, gently teasing you with [hisher] teeth.", parse);
			Text.NL();
			if(player.FirstCock()) {
				Text.Add("All the while, each throbbing thrust of [hisher] [kcock] roughly bumps against your battered prostate, sending waves of pleasure echoing through every fiber of your body.", parse);
				Text.NL();
			}
			
			parse["len"] = len > cap ? "as deeply as possible" : "all the way";
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Smiling shyly, [hisher] eyes twinkling at you past thick lashes, [name] rolls over on [hisher] back, sitting you down on [hisher] lap. Experimentally, [heshe] lifts you up, letting gravity ease you back down on [hisher] shaft. You hug the elf tightly against your [breasts], moving your hips up and down to help [himher] build a rhythm again.", parse);
				Text.NL();
				Text.Add("Your breathing grows shallow as you impale yourself on [name]’s erect member. By now, both of you are too far gone to slow down, reduced to whimpering moans as you copulate, your sweaty bodies racing toward a simultaneous climax.", parse);
				Text.NL();
				Text.Add("<i>“I... almost there,”</i> [name] groans. The elf props [himher]self up with [hisher] hands, and begins to rapidly pump your [anus], the movements of [hisher] hips repeatedly piercing your hovering sphincter.", parse);
				Text.NL();
				Text.Add("<i>“[stuttername]! Ahh!”</i> [HisHer] last erratic thrust sends you off balance, the air in your lungs being forced out as you crash down, [name]’s [kcock] ramming [len] into your bowels. Jointly, you cry out as orgasm hits.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				parse["prettyHandsome"] = kiakai.mfFem("handsome", "pretty");
				Text.Add("[name] plants [hisher] hands on both sides of your shoulders, barely supporting [himher]self as [heshe] thrusts into you. The elf’s [prettyHandsome] face hovers inches above your own, [hisher] gaze obscured by [hisher] thick lashes. [HeShe] bites [hisher] lips in joy, rutting against you quicker and quicker.", parse);
				Text.NL();
				parse["br"] = kiakai.FirstBreastRow().size.Get() > 3 ? "with" : "idly running your fingers over";
				Text.Add("You lie back and enjoy your companion's relentless pounding of your [anus], occasionally playing with yourself, or [br] [name]’s [kbreasts].", parse);
				Text.NL();
				if(kiakai.FirstBreastRow().size.Get() > 12) {
					Text.Add("Taking one of the elf’s huge breasts in hand, you guide one of [hisher] perky [knips] to your mouth, nibbling and sucking on it tenderly.", parse);
					Text.NL();
				}
				Text.Add("<i>“I... I can feel it, it is close!”</i> [name] moans, jacking up [hisher] pace even more. With one final thrust, the elf cries out as [heshe] rams [hisher] [kcock] [len] into your bowels. Jointly, you cry out as orgasm hits.", parse);
			}, 1.0, function() { return true; });
			scenes.Get();
			Text.NL();
			
			if(kiakai.FirstCock()) {
				Text.Add("The elf’s hot seed pours into your convulsing [anus], your tight ring milking [himher] of [hisher] spunk.", parse);
				if(kiaiCock.knot == 1 && len <= cap)
					Text.Add(" [HisHer] swelling knot acts as a stopper, trapping the growing amount of sperm inside you.", parse);
				if(kiakai.NumCocks() > 1) {
					parse = Text.ParserPlural(parse, kiakai.NumCocks() > 2);
					Text.Add(" [name]’s other member[s] also erupt[notS], sending sticky strands of white to coat both of your bodies.", parse);
				}
			}
			else {
				Text.Add("[name] grits [hisher] teeth as the artificial cock rams home into you, triggering the elf’s shuddering, blissful climax.", parse);
			}
			Text.NL();
			Text.Add("Almost at the same time as your companion, you reach your own peak.", parse);
			
			var cum = kiakai.OrgasmCum();
			var cum = player.OrgasmCum();
			
			if(player.FirstCock()) {
				parse["mess"] = kiakai.NumCocks() > 1 ? "adding to the" : "creating a";
				Text.Add(" [name]’s [kcock] is roughly jammed against your prostate, pushing all the right buttons. You blow your load, [mess] sticky mess on both of your bodies.", parse);
				if(cum > 3)
					Text.Add(" One particularly strong ejaculation hits [name] right in the jaw, spraying into [hisher] hair. The elf blinks in sluggish surprise, wiping the cum dripping down [hisher] face from [hisher] eyes.", parse);
			}
			
			if(player.FirstVag())
				Text.Add(" Clear juices flow from your needy [vag]. While it received no action this time, the rough loving the elf provided your ass with was more than enough to push you over the edge.", parse);
			Text.NL();
			parse["mess"] = kiakai.NumCocks() > 1 || player.FirstCock() ? Text.Parse(", further smearing the cum on your [belly] into your [skin]", parse) : "";
			Text.Add("You lean against each other as you recover from your messy finale[mess].", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				
				if(kiakai.relation.Get() < -20)
					Text.Add("<i>“T-thank you for being nice with me,”</i> [name] whimpers, resting [hisher] head against your shoulder.", parse);
				else if(kiakai.relation.Get() < 20)
					Text.Add("<i>“That was... nice,”</i> [name] murmurs, sounding a bit unsure of [himher]self.", parse);
				else if(kiakai.relation.Get() < 50)
					Text.Add("<i>“That was amazing, [playername],”</i> [name] smiles, hugging you tightly.", parse);
				else
					Text.Add("<i>“I love you, [playername],”</i> [name] murmurs into your ear, snuggling close, enjoying the warmth of your body.", parse);
				Text.NL();
				if(kiakai.FirstCock() && kiaiCock.knot == 1) {
					Text.Add("It takes a while before the elf’s knot finally deflates, allowing you to disentangle yourself from each other.", parse);
					TimeStep({minute : 15});
				}
				else
					Text.Add("After some time has passed, you disentangle yourself from the elf.", parse);
				Text.Add(" You help your companion to [hisher] feet, the two of you chatting while you help clean your bodies, washing away the mixed sexual fluids.", parse);
				if(kiakai.FirstCock()) {
					parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? " thighs" : " lower body";
					Text.Add(" Part of [name]’s load remains inside your back passage, slowly dribbling down your[legs] as you move about.", parse);
					if(kiakai.CumOutput() > 3)
						Text.Add(" The majority rests in your [belly], sloshing around pleasantly.", parse);
				}
				Text.NL();
				Text.Add("Once you are both ready, you set out on your journey again.", parse);
				
				Text.Flush();
				
				TimeStep({hour: 1});
				player.AddLustFraction(-1);
				kiakai.AddLustFraction(-1);
				kiakai.subDom.IncreaseStat(25, 1);
				kiakai.relation.IncreaseStat(75, 1);
				kiakai.flags["SexCatchAnal"] = 1;
				Gui.NextPrompt();
			});
		}, enabled : true,
		tooltip : Text.Parse("Urge [himher] on, more, faster, harder!", parse)
	});
	
	
	
	options.push({ nameStr : "Beg",
		func : function() {
			Text.Clear();
			Text.Add("Almost babbling, you cry out how good [name] is, how nice it feels to get fucked by [himher], how much you need it. It's quite amazing to see the elf's expression turn more and more confident as you praise [himher]. Not only that, there is a new vigor to [hisher] thrusting, each stroke more powerful than the last.", parse);
			Text.NL();
			
			var cockFlag   = false;
			var vagFlag    = false;
			var breastFlag = false;
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				parse["legs"]  = player.LowerBodyType() != LowerBodyType.Single ? " between your legs" : "";
				parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
				Text.Add("Biting your lip, you reach down[legs], grabbing hold of[oneof] your [cocks]. Rubbing it in time with [name]'s pistoning, you start pleasuring yourself, moaning unabashedly.", parse);
				Text.NL();
				cockFlag = true;
			}, 1.0, function() { return player.FirstCock(); });
			scenes.AddEnc(function() {
				Text.Add("As you let [name] ream you, you reach down and dip your fingers into your neglected honey pot, intent on pleasing it yourself if the elf declines to. You sigh euphorically, your digits matching the rhythm your lover is making.", parse);
				Text.NL();
				vagFlag = true;
			}, 1.0, function() { return player.FirstVag(); });
			scenes.AddEnc(function() {
				Text.Add("You fondle your [breasts], pinching your sensitive [nips]. It's all you can do to keep yourself in check.", parse);
				if(player.FirstBreastRow().size.Get() > 13) {
					parse["numBr"] = player.NumBreastRows() > 1 ? "the other" : "another";
					Text.Add(" You bring one, then [numBr] of your huge mammaries to your mouth, relishing in the added stimulation as you suck on your [nips].", parse);
					if(player.Lactation())
						Text.Add(" The taste of milk fills your mouth, teasing at what is to come.", parse);
				}
				Text.NL();
				breastFlag = true;
			}, 1.0, function() { return player.FirstBreastRow().size.Get() > 3; });
			
			scenes.Get();
			
			Text.Add("<i>“Do you really enjoy it that much, [playername]? Are you sure I am not harming you?”</i> [HeShe] slows [hisher] rhythm slightly, waiting for your response. You aren't quite sure if [name] is professing a genuine concern for your well-being or if [heshe] is just teasing at this point.", parse);
			Text.NL();
			Text.Add("You growl in frustration, begging [himher] to abandon such fears and just <i>take</i> you, claim you for [hisher] own pleasures, break past [hisher] inhibitions, live [hisher] fantasies to the fullest!", parse);
			Text.NL();
			Text.Add("<i>“R-really?”</i> [name] is slightly overwhelmed by your complete submission, but tries to make the best of the situation. <i>“Then, how about...”</i> The elf purses [hisher] lips.", parse);
			Text.NL();
			
			if(cockFlag) {
				Text.Add("<i>“...You leave that alone for now,”</i> [heshe] says, gesturing toward your [cock]. When you start to protest, [heshe] simply cuts you off with: <i>“Do you not think I could satisfy you?”</i>", parse);
				Text.NL();
				Text.Add("Hands trembling, you withdraw from your bobbing [cock]. Smiling beneficently, [name] grasps the twitching member with [hisher] slender fingers, sending a shiver up your spine. The means of your pleasure taken out of your hands, all you can do is lie back and enjoy [name]'s ministrations, [hisher] pumping hand tightly grasping your needy [cock], [hisher] own [kcock] rapidly thrusting into your [anus].", parse);
			}
			else if(vagFlag) {
				Text.Add("<i>“...You let me see to your needs instead,”</i> [heshe] says, indicating your [vag]. You start complaining, but suddenly change your mind. Demurely, you withdraw your slick fingers from your sopping box, leaving it slightly gaping.", parse);
				Text.NL();
				Text.Add("<i>“Now, do not let your precious juices go to waste,”</i> the elf chides you as [heshe] reaches down, inserting [hisher] own fingers into your recently vacated folds. Following [hisher] instructions, you slowly move your glistening hand to your mouth, licking the delicious drops of girl juices from your trembling digits.", parse);
				Text.NL();
				Text.Add("With the means of your pleasure taken out of your hands, all you can do is lie back and enjoy [name]'s ministrations as [hisher] hand explores your needy cunt and [hisher] [kcock] rapidly thrusts into your [anus].", parse);
			}
			else if(breastFlag) {
				Text.Add("<i>“...Do not be greedy, trying to have those delicious looking breasts all for yourself!”</i> the elf exclaims, gently but rudely depriving you of your playthings. You needn't worry, though, as [heshe] takes hold of your [nips], teasing and pinching them gently.", parse);
				if(player.Lactation()) {
					Text.NL();
					Text.Add("<i>“You can have my milk whenever you want,”</i> you pant, whimpering slightly under [hisher] lithe hands. [name] looks like [heshe] is about to protest, but suddenly changes [hisher] mind with a look of desire on [hisher] face. Instead, [heshe] leans down, clamping [hisher] lips around one of your [nips], sucking on it while simultaniously thrusting [hisher] [kcock] into your [anus].", parse);
				}
			}
			else {
				Text.Add("<i>“Y-yes?”</i> you whisper.", parse);
				Text.NL();
				Text.Add("Instead of answering you, [name] bends down, trapping you with a loving kiss. Your mouths connect while [heshe] continues to ram [hisher] [kcock] into you, thrusting in and out. Your tongues intermingle, caressing and wrestling with each other over dominion, but as you fell before the elf in the larger scale struggle, so does [heshe] take this victory, easily even. No matter how much you try, you cannot focus on anything except the pistoning [kcock] wreaking havoc on your [anus].", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				
				Text.Add("Some time later - it's a bit difficult for you to keep track - [name] pulls [hisher] [kcock] out of you, leaving you bereaved. Before you have time to voice a complaint, [heshe] curtly cuts you off.", parse);
				Text.NL();
				Text.Add("<i>“Now, I want you to roll around.”</i> There is still a slightly nervous quiver in [hisher] voice, but [name] seems to be really getting into it. You quickly comply, shaking your [butt] expectantly at your companion, inviting [himher] back in. Resting your chest on the ground below, you reach back, spreading your cheeks wide, exposing your [anus].", parse);
				Text.NL();
				Text.Add("<i>“T-take me!”</i> you beg. You don't have to wait long before [name] roughly shoves [hisher] [kcock] back inside, forcing [hisher] way through your sphincter.", parse);
				Text.NL();
				Text.Add("<i>“Is that - ngh - better?”</i> [name] grunts as [heshe] increases [hisher] pace once more.", parse);
				Text.NL();
				parse["lube"] = kiakai.FirstCock() ? ", eased by a generous amount of elvish natural lubricant" : "";
				parse["hot"] = kiakai.strapOn ? "" : "hot";
				Text.Add("<i>“Y-yes, I love it when you take charge!”</i> You moan, biting your lip as [name]'s [hot] shaft pummels your back passage[lube]. Growing bolder by the minute, the elf kneads your [butt], roughly manhandling you.", parse);
				Text.NL();
				Text.Add("The two of you continue your rough copulation, the lewd sounds of bodies crashing together filling the area. [name]'s breath comes in short, ragged bursts, [hisher] hands greedily pawing at your body as [hisher] thrusting becomes increasingly erratic.", parse);
				Text.NL();
				
				if(kiakai.FirstCock()) {
					Text.Add("<i>“[playername]! I am going to - ngh - c-cum!”</i>", parse);
					Text.Flush();
					
					var cum = kiakai.CumOutput();
					
					//[Sure][Nah]
					var options = new Array();
					options.push({ nameStr : "Inside",
						func : function() {
							Text.Clear();
							Text.Add("<i>“I-inside!”</i> You moan, begging to be filled with hot cream. It's unclear whether the elf obeys you, or if [heshe] is simply too far gone to care. [name] cries out, [hisher] pulsating [kcock] pouring its contents directly into your receptive bowels.", parse);
							var cum = kiakai.OrgasmCum();
							if(cum > 3)
								Text.Add(" Your [belly] starts to bulge from the excessive load, eagerly swallowing up everything the elf feeds into you. When [heshe] finally pulls out, gouts of spunk pour from your overfilled anus.", parse);
							else
								Text.Add(" The elf pulls out, the last strand of cum still connecting the [kcockTip] of [hisher] [kcock] to your [anus].", parse);
							Text.NL();
							Text.Add("[HeShe] pauses to catch [hisher] breath for a moment, before leaning down and whispering in your ear: <i>“Let me pleasure you too...”</i>", parse);
							Text.NL();
							Text.Add("[name] snuggles close to you, one hand busying itself with your soppy [anus] while the other plays with your [gen], urging you on.", parse);
							
							KiakaiSex.AnalCatchFinish();
						}, enabled : true,
						tooltip : Text.Parse("Beg for [name] to fill you with [hisher] spunk.", parse)
					});
					options.push({ nameStr : "Pull out",
						func : function() {
							Text.Clear();
							Text.Add("<i>“W-wait!”</i> you pant, suddenly telling the elf to pull out from your [anus]. ", parse);
							if(kiaiCock.knot != 0 && len <= cap) {
								Text.Add("[name] tries to comply, but finds [himher]self stuck inside you, trapped by [hisher] engorged knot.", parse);
								Text.NL();
								Text.Add("<i>“S-sorry, [playername]!”</i> the elf moans as [heshe] unloads inside you, [hisher] seed flooding your [anus]. You think you detect a trace of... glee? That doesn't seem very much like [himher] at all...", parse);
								Text.NL();
								var cum = kiakai.OrgasmCum();
								Text.Add("<i>“I am sorry, I did not want to hurt you,”</i> [name]'s voice is sweet and innocent, but you still can't shake feeling that there is a tinge of defiance in it. Probably nothing.", parse);
								Text.NL();
								Text.Add("<i>“You are close... let me make you feel good.”</i> Still stuck inside you, [name] begins to grind [hisher] hips slowly, urging you on. [HeShe] reaches down, using [hisher] hands to pleasure your [gen].", parse);
								kiakai.subDom.IncreaseStat(60, 1);
							}
							else {
								Text.Add("[HeShe] complies, and in the nick of time too. [HisHer] cum splatters across your back in large gouts the very moment [heshe] withdraws.", parse);
								var cum = kiakai.OrgasmCum();
								if(cum > 3)
									Text.Add(" Whether you wanted it or not, you're receiving a literal shower, as a seemingly endless stream of sticky semen washes over you.", parse);
								Text.NL();
								Text.Add("[HisHer] legs unsteady, [name] staggers and stumbles onto [hisher] butt. The elf's hand trembles slightly as [heshe] leans over and caresses your painted backside, smearing [hisher] cum across your buttocks. You whimper slightly as your body tingles from [hisher] touch. Taking pity on your needy state, [heshe] begins to pleasure you orally, urging you toward your own climax.", parse);
								kiakai.subDom.DecreaseStat(20, 1);
							}
							
							KiakaiSex.AnalCatchFinish();
						}, enabled : true,
						tooltip : Text.Parse("Tell [himher] to cum outside.", parse)
					});
					if(cum > 3) {
						options.push({ nameStr : "Shower",
							func : function() {
								Text.Clear();
								Text.Add("You've seen the copious amounts of sperm that the elf can produce, and you want all of it.", parse);
								Text.NL();
								Text.Add("<i>“H-hold on,”</i> you yelp, quickly rolling onto your back as [heshe] pulls out. <i>“Give it to me, I want you to soak me in your hot cum!”</i> You close your eyes as the first generous gouts of sticky liquid splatter across your body, a long strand painted straight across one of your [breasts]. The next shot goes even farther, clinging to your face. It's followed by a rapid succession of loads covering your entire body.", parse);
								Text.NL();
								var cum = kiakai.OrgasmCum();
								Text.Add("When [name] is finally done hosing you down, you experimentally open an eye, peering down across your stained body. The elf has dropped down to [hisher] knees and crawled up to you, gleefully slurping up any globs of cream in [hisher] way as [heshe] dives onto your [gen]. Between [hisher] legs, you can see that [hisher] [kcock] is pulsating weakly, still drooling cum.", parse);
								kiakai.subDom.IncreaseStat(50, 1);
								
								KiakaiSex.AnalCatchFinish();
							}, enabled : true,
							tooltip : Text.Parse("Let [name] drench your entire body in [hisher] cum.", parse)
						});
					}
					Gui.SetButtonsFromList(options);
				}
				else {
					Text.Add("<i>“Mmm... that feels so good!”</i> [name] moans, the other end of the artificial [kcock] rubbing against [himher] in all the right ways. [HisHer] thrusts grow quicker as [heshe] seeks that ultimate moment, all but forgetting about you as [hisher] clouded eyes flutter shut. Finally, [hisher] grinding slows to a halt, [hisher] [kcock] buried deep within you. [name] pants heavily, collapsing against your back.", parse);
					Text.NL();
					Text.Add("<i>“Hah... hah... I want to make you feel good too...”</i> [heshe] tells you when [heshe]'s finally recovered a little from [hisher] climax.", parse);
					Text.NL();
					Text.Add("True to [hisher] word, the elf starts to move inside you again, trying to encourage your own orgasm. While much slower than before, [name] hits all the right spots. With these renewed ministrations, you really don't think you can last much longer.", parse);
					KiakaiSex.AnalCatchFinish();
				}
			});
		}, enabled : true,
		tooltip : Text.Parse("Beg for more. Give in to [hisher] every whim.", parse)
	});
	Gui.SetButtonsFromList(options);
}

KiakaiSex.AnalCatchFinish = function() {
	var playerCock = player.BiggestCock(null, true);
	var kiaiCock   = kiakai.BiggestCock(null, true);
	
	var parse = {
		playername   : player.name,
		name         : kiakai.name,		
		kCockDesc2   : function() { return kiakai.AllCocks()[1].Short(); },		
		boygirl      : kiakai.body.femininity.Get() > 0 ? "girl" : "boy"		
	};
	
	parse = kiakai.ParserPronouns(parse);
	parse = kiakai.ParserTags(parse, "k");
	parse = player.ParserTags(parse);
	/* TODO Player orgasm */
	
	Text.NL();
	Text.Add("It's not long after that your own orgasm hits, further adding to the mess of sexual fluids and sweat covering your bodies. The two of you snuggle together for a while, reveling in the afterglow of your steamy copulation.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	/*
	Text.Add("<b>--PLACEHOLDER--</b>", parse);
	Text.NL();
	*/
	
	if(kiakai.subDom.Get() > 25)
		Text.Add("<i>“Mmm... I bet you really liked that, did you not?”</i> [name] purrs, affectionately feeling you up.", parse);
	else if(kiakai.subDom.Get() > 0)
		Text.Add("<i>“Did you enjoy yourself?”</i> [name] asks, blushing faintly as [heshe] asks the bold question. Pulling [himher] in for an extended kiss, you assure [himher] that you did.", parse);
	else if(kiakai.subDom.Get() > -25)
		Text.Add("<i>“That was not... unpleasant.”</i> [name] blushes faintly, not used to taking the dominant role with you.", parse);
	else if(kiakai.subDom.Get() > -50)
		Text.Add("<i>“Thank you, [playername], for allowing me that,”</i> [name] murmurs, bowing [hisher] head.", parse);
	else
		Text.Add("<i>“C-can you do that to me next time? It... it looked so nice,”</i> [name] blurts out, blushing furiously.", parse);
	Text.NL();
	Text.Add("You spend a good quarter of an hour cuddled together before regretfully parting to gather your gear. Once you are cleaned up and equipped, you set out for your next destination.", parse);
	
	Text.Flush();
	
	TimeStep({hour: 1});
	player.AddLustFraction(-1);
	kiakai.AddLustFraction(-1);
	kiakai.subDom.IncreaseStat(50, 3);
	player.subDom.DecreaseStat(-40, 1);
	kiakai.flags["SexCatchAnal"] = 1;
	
	Gui.NextPrompt();
}

export { KiakaiSex };
