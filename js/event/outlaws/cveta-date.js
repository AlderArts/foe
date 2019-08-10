import { Cveta } from './cveta';
import { WorldTime } from '../../GAME';
import { Gui } from '../../gui';
import { Text } from '../../text';
import { EncounterTable } from '../../encountertable';
import { DryadGladeFlags } from '../../loc/glade-flags';

let DateScenes = {};

DateScenes.Prompt = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("You ask Cveta if she’d like to go somewhere with you.", parse);
	if(party.Num() > 1) {
		parse["comp"] = party.Num() == 2 ? party.Get(1).name : "everyone else";
		Text.Add(" You have some free time, and if it’s to be just the two of you, you could always ask [comp] to hang back for the rest of the day and wait for you in camp.", parse);
	}
	Text.NL();
	if(WorldTime().hour >= 12) {
		Text.Add("<i>“Not an entirely unpleasant prospect, [playername], but you should have come to me sooner. It is getting a bit late for wandering around outside, and I do have my duties here in camp.”</i>", parse);
		Text.NL();
		Text.Add("When, then?", parse);
		Text.NL();
		Text.Add("<i>“Could you perhaps ask again tomorrow, before noon?”</i>", parse);
		Text.Flush();
		
		Scenes.Cveta.Prompt();
	}
	else {
		Text.Add("<i>“I would not mind, [playername]. I have some spare time, and perhaps a change in scenery would help inspire my practice. Was there a place you had in mind?”<i/>", parse);
		Text.NL();
		Text.Add("Well, actually…", parse);
		Text.Flush();
		
		//[Glade][Spring][Rigard][Up to her][Back]
		var options = new Array();
		if(glade.flags["Visit"] >= DryadGladeFlags.Visit.DefeatedOrchid) {
			options.push({ nameStr : "Glade",
				tooltip : "Why not take her out to the dryads’ glade?",
				func : function() {
					Text.Clear();
					DateScenes.DryadGlade();
				}, enabled : true
			});
		}
		options.push({ nameStr : "Spring",
			tooltip : "Take her to this forest spring you know…",
			func : function() {
				Text.Clear();
				DateScenes.Spring();
			}, enabled : true
		});
		/* TODO
		options.push({ nameStr : "name",
			tooltip : "",
			func : function() {
				Text.Clear();
				DateScenes.DryadGlade();
			}, enabled : true
		});
		 */
		if(cveta.flags["Date"] != 0) {
			options.push({ nameStr : "Up to her",
				tooltip : "Well, where does she fancy going?",
				func : function() {
					Text.Clear();
					Text.Add("You tell Cveta that since you asked her out, she should decide where she wants to go this time around. The songstress looks a little surprised, her eyes growing wide, but she quickly recovers from the show of emotion and assumes her calm, pleasant demeanor once more. What was that all about?", parse);
					Text.NL();
					Text.Add("<i>“Very well then. Today, I would like to visit…”</i> she leans in and whispers into your ear.", parse);
					Text.NL();
					
					var arr = [];
					
					if(cveta.flags["Date"] & Cveta.Dates.Glade) arr.push(DateScenes.DryadGlade);
					if(cveta.flags["Date"] & Cveta.Dates.Spring) arr.push(DateScenes.Spring);
					
					//TODO add
					
					_.sample(arr)();
				}, enabled : true
			});
		}
		
		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("Hmm… you have to give it some more thought.", parse);
			Text.NL();
			Text.Add("<i>“You know where to find me,”</i> Cveta replies amiably.", parse);
			Text.Flush();
			
			Scenes.Cveta.Prompt();
		});
	}
}

DateScenes.PartySetup = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	let cveta = GAME().cveta;

	cveta.RestFull();
	
	party.SaveActiveParty();
	party.ClearActiveParty();
	party.SwitchIn(player);
	party.AddMember(cveta, true);
	
	//Set up restore party at the bottom of the callstack, fallthrough
	Gui.Callstack.push(function() {
		party.LoadActiveParty();
		Gui.PrintDefaultOptions();
	});
}

DateScenes.DryadGlade = function() {
	let player = GAME().player;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	DateScenes.PartySetup();
	
	var first = !(cveta.flags["Date"] & Cveta.Dates.Glade);
	cveta.flags["Date"] |= Cveta.Dates.Glade;
	
	Text.Add("The glade, yes, that sounds like a good idea. Cveta would appreciate the flowers, and it would do her some good to see someone who isn’t an outlaw every now and then.", parse);
	Text.NL();
	Text.Add("<i>“It is settled, then,”</i> the songstress says with a clap of her hands. <i>“Allow me to get my instrument and I will be with you shortly.”</i>", parse);
	Text.NL();
	Text.Add("Cveta wasn’t kidding when she said ‘shortly’. By the time you’re out of the tent, she’s already bringing up your rear, lyre in one gloved hand, and clings to the crook of your arm with the other in an appropriately ladylike fashion.", parse);
	Text.NL();
	Text.Add("<i>“Well then. Lead the way, please.”</i>", parse);
	Text.NL();
	Text.Add("The trip out of camp and through the forest pathways is uneventful. Cveta does look a little out of place in the wilderness with her gown on - isn’t she worried it’ll get torn or dirty in the thick underbrush? - but sticks close to you as you forge your way forward. Eventually, the path leading to the Mother Tree’s glade draws into view, and you lead Cveta along the path and into the clearing.", parse);
	Text.NL();
	Text.Add("It’s peaceful as always within the sanctuary, the air full of floral scents and clean smells. Hugging her lyre close to her, Cveta takes deep lungfuls of the blossoms’ fragrance, sighing in satisfaction each time she exhales, her bosom rising and falling with each happy chirp.", parse);
	Text.NL();
	if(glade.OrchidSlut()) {
		Text.Add("The denizens of the glade frolic about, oblivious to your familiar presence. A few of the braver dryads and centaurs greet you warmly, and you give them a friendly wave back. ", parse);
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("Orchid and her friends are hard at play, the be-tentacled dryad chasing after the others and trying to ensnare them with her plant-like limbs, much to everyone’s glee.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Orchid is cuddling with some of her friends, their afterglow a clear sign of recent carnal activities. The dryads tentacles possessively caress the swollen stomach of a centauress doe, more than likely a recent victim of the playful forest creature.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Nearby, you spot Orchid with a few of her friends. It seems like their game of tag has ended, with the be-tentacled dryad the clear winner, and she’s just now claiming her prize. The assorted dryads and centaurs stuck in her web moan and whimper in delight as she ravages their bodies, caught in a lustful frenzy. The bird at your side averts her gaze, a slight blush on her cheek.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Orchid and her friends are napping together in a large pile of dryads, centaurs and tentacles. It’s an uneasy rest, as the tentacles seem to have a mind of their own, much to the delight of the dozing forest creatures.", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
	}
	else {
		Text.Add("The denizens of the glade frolic about, giving the two of you a peaceful vista to enjoy. Dryads, centaurs and other forest creatures, at first daunted by the appearance of strangers, continue their play. Nearby, you spot Orchid conversing with some of her friends, her dormant tentacles twitching from time to time.", parse);
	}
	Text.NL();
	if(first) {
		Text.Add("<i>“This is a good place,”</i> Cveta murmurs to herself.", parse);
		Text.NL();
		Text.Add("<i>“Naturally. Would you raise your own daughters with anything less than the best you could give?”</i>", parse);
		Text.NL();
		Text.Add("You turn to find Mother Tree looking at the two of you, a smile on the ancient dryad’s face as she beckons you over. Both you and Cveta approach at a reverent pace, eventually coming to a stop at the roots of her tree. <i>“Welcome back, Lifegiver. You are always a sight for sore eyes - and who is this you have with you today?”</i>", parse);
		Text.NL();
		Text.Add("Cveta curtsies, a low, formal gesture one would expect in court, rather than here in a forest glade. <i>“I am Cveta Antonova, great mother.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Flattery will get you nowhere with me, child,”</i> Mother Tree says good-naturedly. <i>“To their children, all mothers are great. You’ll understand once you’re a mother yourself.”</i>", parse);
		Text.NL();
		Text.Add("Cveta turns away from the dryad, suddenly self-conscious, but Mother Tree coaxes her back with another question. <i>“You have an instrument on you. Are you a musician?”</i>", parse);
		Text.NL();
		Text.Add("<i>“I am.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I’ll be forward. Would you play for me and my daughters?”</i>", parse);
		Text.NL();
		Text.Add("Cveta blinks. <i>“M-me?”</i>", parse);
		Text.NL();
		Text.Add("Mother Tree smiles. <i>“We’re not in the habit of receiving many musicians here, child. The satyrs do try their best, but they’re capable of playing flutes. You will have my gratitude if you’d entertain everyone with a little music.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Well…”</i> Cveta glances about her, at the flowers, at the spring, and finally back to Mother Tree herself. <i>“All right, great mother. Your home has a certain inspiring quality to it. Besides, which performer could resist a captive audience?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Thank you, child. And thank you, Lifegiver.”</i>", parse);
	}
	else {
		Text.Add("Scarcely have you and Cveta entered the glade when the nymphs frolicking in the pool notice the two of you. Squealing with glee, they take off to tell the glade’s other inhabitants of your arrival.", parse);
		Text.NL();
		Text.Add("You ask Cveta if she’d rather not play this time, but the songstress simply shakes her head and laughs off the question.", parse);
		Text.NL();
		Text.Add("<i>“Please, [playername]. If I did not feel like playing, I would not have come.”</i>", parse);
	}
	Text.NL();
	Text.Add("Arrangements are quickly made for the two of you; a fallen log is found and hefted out onto the flower field, a seat for Cveta, and you seat yourself in on the grass a little distance away. One by one, the glade’s denizens gather in a half-circle to hear the songstress play; the grass and flowers are enough respite for them.", parse);
	Text.NL();
	Text.Add("Gathering up the skirts of her gown, Cveta makes herself comfortable, closes her eyes, and strums her lyre a few times…", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("The improvised piece that drifts from her fingers is slow and serene to match the glade’s calm atmosphere. Every plucked note a drip of water in a still pool, Cveta is absolutely calm, her movements slow and measured. Gentle music, to match the dryad glade’s gentle atmosphere. The songstress’ bosom heaves as she breathes deeply of the rich floral scent that pervades the air - no doubt part of the atmosphere she finds so wonderfully inspiring - as if she were about to burst into song, but she doesn’t and concentrates on the strings instead.", parse);
		Text.NL();
		Text.Add("Gradually, you find your eyelids drooping and growing heavy; most of the forest creatures have already given in to the calming melody and are snoozing away, curled up against each other. Noticing that the better part of her audience has dozed off, Cveta finishes up her ditty by way of a broken chord, then stands to survey her handiwork.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("You know that Cveta doesn’t really like improv, but she doesn’t seem to mind it this time around. Maybe it’s how eager her audience is, perhaps the glade’s tranquil aura does wonders for the creative soul, or perhaps she just likes being around all these flowers. Whatever the reason, the songstress simply plays, fingers gliding along the strings of her lyre, her music a window into her mood.", parse);
		Text.NL();
		Text.Add("The melody that ensues is a perfect fit for the rolling spread of wildflowers that encircle the both of you; vivid and bright, conjuring images of people frolicking about in colorful dress and… um… ", parse);
		Text.NL();
		Text.Add("Well, there are better times and places for that train of thought.", parse);
		Text.NL();
		Text.Add("Cveta’s ditty doesn’t last too long - or perhaps it’s you who lost track of time. A few chords mark the end of her improvised piece, and the music eventually fades to a stop, leaving the songstress perfectly poised in her seat, a gentle breeze caressing her feathers and hair.", parse);
		Text.NL();
		Text.Add("<i>“That will be all for today,”</i> she announces, standing and giving the assembled forest creatures a small curtsey. There’re a few moans of disappointment, but by and large the audience disperses, leaving just you and Cveta in the midst of the flower field.", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("Cveta looks at you and tosses her head playfully. <i>“Why, [playername]. It looks like we have some time all to ourselves.”</i>", parse);
	Text.NL();
	Text.Add("Why, it would appear that you do. Crossing over to the songstress, you wrap an arm about her waist and seat her back down on the log; not only does Cveta not shy away, but she even snuggles against your side with a small chirp. A quick grope of her ass through the skirts of her gown send her to squirming - come to think of it, she’s cuter when flustered…", parse);
	Text.NL();
	Text.Add("Though Cveta doesn’t have much in the way of ass yet, if her attitude can improve with a little keeping, surely her body might eventually follow suit…", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Mmmh,”</i> the songstress says, her voice a soft, warm hum in her breast. You can practically feel every muscle in her body relax as she leans her head on your shoulder, the crimson waterfall of her hair spilling down your back.  <i>“I feel safe.”</i>", parse);
		Text.NL();
		Text.Add("Well, that’s kind of the point of the glade, you reply.", parse);
		Text.NL();
		Text.Add("<i>“No, not the glade. You.”</i>", parse);
		Text.NL();
		Text.Add("Oh. You’re about to find something good and witty to reply to that when she finishes up that thought. <i>“Just like Daddy.”</i>", parse);
		Text.NL();
		Text.Add("Now… that’s kinda awkward.", parse);
		Text.NL();
		Text.Add("She presses herself even closer, wrapping a feathery wing about you even as the fingers of her free hand wander lazily along your thigh. <i>“Yes, you are a lot like him. Maybe just as good.”</i>", parse);
		Text.NL();
		Text.Add("Yes… really awkward. Still, you play along, nosing Cveta’s hair and telling her what a good little bird she is and how wonderfully she played today. It’s a simple compliment, but the songstress practically preens at receiving it - you can actually feel her pulse quicken beneath all those layers of cloth, feathers and skin. And it <i>is</i> nice to have Cveta let her hair down for once, both literally and figuratively; she’s so uptight at most times.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“These are rather exquisite flowers,”</i> Cveta says with a small sigh. <i>“It feels like a dream, strangely familiar yet very much different. Highland wildflowers are quite unlike these.”</i>", parse);
		Text.NL();
		Text.Add("How so?", parse);
		Text.NL();
		Text.Add("<i>“Smaller. More delicate. We would never have petals this broad, on account of heavy winter snow. But at least I would say they do not need as much care to bloom at their fullest, compared to lowland blossoms.”</i>", parse);
		Text.NL();
		Text.Add("Hmm…", parse);
		Text.NL();
		Text.Add("<i>“The best, of course, are rose gardens back home. Generations upon generations of careful tending by my ancestors, a duty passed on from parent to child. If I ever get the chance, I will have to bring you there someday,”</i> she adds with a sigh.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("Is it just you, or did she seem just a little jealous of Mother Tree when you were coming in?", parse);
		Text.NL();
		Text.Add("Cveta huffs, wriggling in your grasp. <i>“I am not jealous!”</i>", parse);
		Text.NL();
		Text.Add("Look at who’s getting her feathers all ruffled. Why such a sudden and vigorous denial? You were just teasing her, after all. But… is she?", parse);
		Text.NL();
		Text.Add("<i>“Well, all right. Maybe a little. She has so many daughters, and her home is so full.”</i>", parse);
		Text.NL();
		Text.Add("As opposed to?", parse);
		Text.NL();
		Text.Add("<i>“As opposed to my own. Oh, there were the servants, and I always made sure to treat them as their station accorded right down to memorizing the each and every proper title, but blood is thicker than water, is it not?”</i>", parse);
		Text.NL();
		Text.Add("Hmm…", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("At length, though - and not without a good helping of petting - it’s time to go back; Cveta still needs to prepare for this evening’s performance. You stop by Mother Tree to pay your respects to the ancient dryad on the way out, then begin the long walk back to camp. It’s almost evening by the time the two of you finish navigating through the thin forest trails and the walls of the outlaw camp draw into view.", parse);
	Text.NL();
	Text.Add("<i>“Thank you, [playername],”</i> Cveta says as the two of you cross the drawbridge. <i>“I enjoyed myself today.”</i>", parse);
	Text.NL();
	Text.Add("Well, it wasn’t hard. Her tastes are quite simple and easy to cater for.", parse);
	Text.NL();
	Text.Add("<i>“Simplicity is preferable to complication for its own sake,”</i> she replies, bowing her head. <i>“And now, I am afraid I must bid you adieu.”</i>", parse);
	Text.NL();
	Text.Add("With that, she walks off, leaving you in the middle of camp.", parse);
	Text.Flush();
	
	cveta.relation.IncreaseStat(100, 2);
	world.StepToHour(18);
	
	Gui.NextPrompt();
}

DateScenes.Spring = function() {
	let player = GAME().player;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	DateScenes.PartySetup();
	
	cveta.flags["Date"] |= Cveta.Dates.Spring;
	
	Text.Add("Hmm… well, there’s nothing against it. The spring’s probably a good place - unlikely that anyone’s bound to walk in on the two of you, it’s quiet and appropriately inspirational, and the water is clear if it comes to that. The more you consider it, the more of a good idea it promises to be. The change of scenery would probably help her music along, too.", parse);
	Text.NL();
	Text.Add("<i>”Allow me a moment, please,”</i> Cveta says before disappearing into her tent. <i>“I will be with you shortly.”</i>", parse);
	Text.NL();
	Text.Add("She’s as good as her word - scarcely has a minute passed before she reappears, lyre and a small hamper in tow; she passes you the latter with a twinkle in her eye. <i>“Leftovers from breakfast. I was intending to use them for lunch, to avoid interrupting my practice; there is probably enough to stretch between the two of us, if we are prudent about it. Shall we be off?”</i>", parse);
	Text.NL();
	Text.Add("The songstress is in an uncharacteristically good mood today, humming a little ditty in the back of her throat as you lead her out of camp and into the forest. Clinging to the crook of your arm with one hand and clutching her lyre with the other, there’s a definite spring in Cveta’s step as she keeps pace with you.", parse);
	Text.NL();
	Text.Add("What <i>is</i> up with her?", parse);
	Text.NL();
	Text.Add("<i>“Oh, nothing,”</i> she replies airily. <i>“I just feel particularly inspired this day.”</i>", parse);
	Text.NL();
	Text.Add("You wonder if there’s more to it than that, but her cheery demeanor is infectious, and in any case, you’re almost at your destination. The area about the spring is muted, the forest’s thick canopy blocking out much of the light, save for a few shafts which illuminate the undergrowth; there’s a smell in the air - not sweet, but not unpleasant, either, more that of clean water and green growing things.", parse);
	Text.NL();
	Text.Add("All in all, it’s a peaceful place. Cveta senses it, too, dusting off a nearby boulder and gathering her skirts before sitting down and starting a little tune on her lyre. Brushing back her flowing red locks, the songstress stares into the dark depths of the spring as she plays.", parse);
	Text.NL();
	Text.Add("<i>“Ah, blessed solitude. With just you and me…”</i>", parse);
	Text.NL();
	Text.Add("Settling down on the grass yourself, you rest your back against a nearby tree and enjoy the music for a little bit. Come to think of it, since Cveta is in such a good mood today, maybe she’d be willing to answer some questions that she normally wouldn’t consider entertaining…", parse);
	Text.Flush();
	
	//[Home][Hopes][Yourself][Listen]
	var options = new Array();
	options.push({ nameStr : "Home",
		tooltip : "Ask her about home, and why she left.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“I do not quite remember if I have told you this yet,”</i> Cveta replies. <i>“Suffice to say that I had an argument with my mother.</i>", parse);
			Text.NL();
			Text.Add("<i>“We had a… disagreement about how many heirs it was appropriate for me to produce in the future. Most people do not have to think much about this beyond the number of mouths they can feed, but - well, it is complicated when it comes to those with old blood. One heir, like what happened in my case, and there is little doubt as to who gets what. However, if something unfortunate happens to said heir, you have trouble on your hands.</i>", parse);
			Text.NL();
			Text.Add("<i>“Too many, though, and you get competing claims to an indivisible estate, which can, again, prove troublesome.”</i>", parse);
			Text.NL();
			Text.Add("Cveta sighs and stops playing a moment to rest her chin in her hands. <i>“I understand that it is something of a given that mothers and daughters will argue, as will fathers and sons, but our disagreements have been going on for a very long time, [playername]. I have always sought to give Mother all the respect due her station, but I cannot help but get the impression that she resents me after a fashion. Worst of all, I do not know why. I can guess, but certainty eludes me.”</i>", parse);
			Text.NL();
			Text.Add("Enough for her to up and leave?", parse);
			Text.NL();
			Text.Add("Cveta picks up her lyre and strums the strings with a sigh. <i>“I will reiterate, it was not an impulsive act. Now that I am settled, I write home on occasion, so at least they know that nothing unfortunate has happened to my person.</i>", parse);
			Text.NL();
			Text.Add("<i>“Yes, I know that I will have to return someday; duty demands it of me - such is inescapable. Become worthy, accept power and rule wisely, as Father is fond of saying. But someday is not today, and I do not wish to dwell on it further.”</i>", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Hopes",
		tooltip : "What does she hope to achieve with the outlaws?",
		func : function() {
			Text.Clear();
			Text.Add("Cveta considers your question a moment against the backdrop of her gentle music. <i>“I do not quite understand. What do you mean by ‘achieve’?”</i>", parse);
			Text.NL();
			Text.Add("Well, where does she see the outlaws in the future? Surely she’s not just going to keep performing day after day forever…", parse);
			Text.NL();
			Text.Add("The songstress looks quizzically at you, frowning slightly, then shrugs. <i>“The ultimate goal, as you know, is the overthrow of the Riordain line. It is not strictly necessary that we march up to Reywn and literally kick him off his throne - such would be difficult and overly melodramatic - but those whom he rules are kept in line with solely fear. Remove that, find a chink in the armor - and the rest will follow. Clearing a path through a forest is scarcely the easiest of tasks, but once the way is opened many can follow with ease.</i>", parse);
			Text.NL();
			Text.Add("<i>“We would rather avoid any scenario which involves mobs and riots - or so I hope. While I did not experience the infamous riots which sparked this conflict, the way both Zenith and Aquilius related it to me… they are well aware that a mob, once inflamed and let loose, is as controllable as a tempest and possessed of the capacity to inflict as much damage. The merchant guilds tried to turn the people against their rulers, and it did not avail them or their cause well.</i>", parse);
			Text.NL();
			Text.Add("<i>“Me, personally? I would rather the rulers clean up their act and remember that they have a duty to the ruled, but as things are, I do not hold out much hope for that eventuality. Once one acquires a taste for degeneracy, it is quite hard to be rid of it.”</i>", parse);
			Text.NL();
			Text.Add("Well, that was quite a mouthful.", parse);
			Text.NL();
			Text.Add("<i>“It was, and perhaps too heavy a topic for today. Come now, are we not meant to be enjoying ourselves out here?”</i>", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Yourself",
		tooltip : "Ask the songstress what she thinks of you.",
		func : function() {
			Text.Clear();
			Text.Add("Cveta closes her eyes, and you note her breathing deepen, her music slowing to match. <i>“Hmm… why do you ask?”</i>", parse);
			Text.NL();
			if(cveta.Relation() >= 95) {
				Text.Add("<i>“Well, you are a definite source of inspiration. Perhaps not to the point where I could see myself composing bawdy ballads about your exploits in the traditional style, but enough that your presence is very much appreciated.”</i>", parse);
				Text.NL();
				Text.Add("Very much appreciated?", parse);
				Text.NL();
				Text.Add("<i>“Just so. Very much appreciated, especially when I do improv. I think I may actually have learned to enjoy those little sessions of make-it-up-as-you-go-along, which is a good thing. While I have memorized many pieces, I am indeed running a little short of suitable things to play these days without running the risk of repeating myself too much.”</i>", parse);
				Text.NL();
				Text.Add("Well, you’re glad to be able to help.", parse);
				Text.NL();
				Text.Add("<i>“As I said, it is appreciated.”</i> She looks at you thoughtfully. <i>“You know, you remind me a little of - actually, never mind. Shall we continue?”</i>", parse);
			}
			else if(cveta.Relation() >= 70) {
				Text.Add("<i>“You are rather pleasant company,”</i> Cveta replies, <i>“and are possessed of an appreciation for the finer things, which is important. Music reveals much about a person, a people, from a simple shepherd’s flute to a grand concert hall.”</i>", parse);
				Text.NL();
				Text.Add("And what does it tell her about you?", parse);
				Text.NL();
				Text.Add("<i>“That you are someone I do not mind accompanying on a day trip into the forest.”</i>", parse);
				Text.NL();
				Text.Add("Is that a joke?", parse);
				Text.NL();
				Text.Add("The songstress hums a few notes, rolling her eyes good-naturedly. <i>“Maybe. Perhaps. That is within the realm of possibility.”</i>", parse);
				Text.NL();
				Text.Add("Oh great, now she’s being cheeky.", parse);
			}
			else {
				Text.Add("<i>“Well, you are decent company, otherwise I would not have agreed to take off with you into the forest, would I?”</i>", parse);
				Text.NL();
				Text.Add("Well, that is true.", parse);
				Text.NL();
				Text.Add("<i>“There is no need to be so self-conscious, [playername]. Once you know you have reached a certain level of decorum and propriety, there is no need to constantly worry about the opinions of others towards you.”</i>", parse);
			}
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Listen",
		tooltip : "Hold your silence and just listen to her play.",
		func : function() {
			Text.Clear();
			Text.Add("Not really wanting to spoil the mood by saying anything, you settle down and listen to Cveta play. The spring’s serene atmosphere is clearly having an effect on the songstress’ choice of music, the notes that rise from her fingers are slow and calm on the surface, but possessed of a deep, moving undercurrent that tugs gently at your mind, shifting it along a dark lakebed to parts unknown…", parse);
			Text.NL();
			Text.Add("Clear, dark, and infinitely deep, like the spring itself. Muted in most parts, but brilliant where it shines through. Cveta is definitely getting better at improv, or at least that which you’re around to hear.", parse);
			Text.NL();
			Text.Add("You come to some moments later with Cveta closing the tune with a series of chords - with her music as gentle as it was, you must’ve dozed off sometime. The songstress either hasn’t noticed or doesn’t care, for she closes her music with a finishing flourish, the last notes lingering in the air before they fade into the dimly lit air.", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("<i>“I think that is enough for now, is it not? Come on, [playername]. Let us eat.”</i>", parse);
		Text.NL();
		Text.Add("Come to think of it, you’re getting a little hungry yourself. You watch as Cveta carefully sets down her lyre and unpacks the hamper, bringing out a small cloth and setting out the spread atop said cloth. If you didn’t know that there probably wasn’t such a thing, she might very well have been trained in the fine arts of hamper unpacking.", parse);
		Text.NL();
		Text.Add("The food is simple - a stack of lightly fried flatbreads, a little cold mincemeat and some apple preserve and wild honey in a tiny jar. Considering how precious glass is about the outlaw camp, you’re pretty sure they’ll be wanting the jar back. Still, it looks like the sort of thing the outlaws would eat for breakfast - simple and intended to fill the stomach more than anything else. A couple of simple clay cups complete the ensemble, which you dip into the spring and fill with clear, fresh water.", parse);
		Text.NL();
		Text.Add("It must be quite the difference from the meals she must have eaten back home, right?", parse);
		Text.NL();
		Text.Add("<i>“It was not so much the food as the presentation,”</i> Cveta replies, looking thoughtful as she tears off a little flatbread and rolls up a pinch of mincemeat in it. <i>“I usually ate either while out with Father or Mother, or between lessons, so this is not too far from the impromptu meals that were arranged. Dinner, however, was very different.”</i>", parse);
		Text.NL();
		Text.Add("You follow Cveta, tearing off your own portion and daubing some of the jam onto it before asking her to go on.", parse);
		Text.NL();
		Text.Add("<i>“It was always a bit of an affair. We had this long table in the main hall, you see, enough to seat everyone - yes, <b>everyone</b> in the keep, if need be. Everyone came for dinner, save for the kitchen staff on duty, and those worked alternate days, so all of us had the chance to dine at the table with regularity.”</i>", parse);
		Text.NL();
		Text.Add("Cveta swallows daintily and thinks a moment. <i>“Naturally, Father would sit at the head of the table, Mother to his right, and I on his left. From there on would be the servants by rank, from the steward and the knights, right down to the lowest kitchen boy.</i>", parse);
		Text.NL();
		Text.Add("<i>“The food served was simple, perhaps, but the important thing was that everyone ate together. There were no acceptable excuses for not showing up for dinner, save being bedridden or being away at court - Father would excuse himself and literally fly back just to make it in time for dinner. Everyone knew where they were supposed to be. Everyone saw the three of us at dinner, and if we were unexpectedly missing - like Mother was one time, due to a sudden illness - would ask about us.</i>", parse);
		Text.NL();
		Text.Add("<i>“That is the important thing - that we were not just some faceless rulers hiding in - ah!”</i>", parse);
		Text.NL();
		Text.Add("Cveta’s cry of dismay is short-lived, the songstress’ face crumpling into scowl of frustration. Seems like she wasn’t paying that much attention to where she was dipping her flatbread, and went ahead and stained her fingers with the preserves.", parse);
		Text.NL();
		Text.Add("An angry snap of her beak. <i>“This will take stupidly long to get out of the cloth…”</i>", parse);
		Text.NL();
		Text.Add("Hmm, does this give you any ideas?", parse);
		Text.Flush();
		
		//[Wash][Lick][Watch]
		var options = new Array();
		options.push({ nameStr : "Wash",
			tooltip : "Get a little spring water in your cup and wash it off.",
			func : function() {
				Text.Clear();
				Text.Add("Cveta is a little surprised when you take her hand in your own, but soon relaxes as she realizes what you’re about to do. You pour the water in your cup over the offending stain, scrubbing as best as you can; another soon follows when your attempts to remove the stain from the cloth are met with varying degrees of success.", parse);
				Text.NL();
				Text.Add("<i>“It is all right,”</i> she tells you after your second unsuccessful attempt. <i>“I have more back at camp - this pair can go to someone who does not mind the staining so much.”</i>", parse);
				Text.NL();
				Text.Add("You’re not so sure about that. It seems like such a waste, really.", parse);
				Text.NL();
				Text.Add("<i>“They are an important part of my image, thank you very much, and I am willing to give as much to sustain it. Come now, let us finish up and be off.”</i>", parse);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Lick",
			tooltip : "Shouldn’t let good jam go to waste, it’s finger-licking good.",
			func : function() {
				Text.Clear();
				Text.Add("Cveta looks a little surprised when you take her hand in your own, and is even more so when you give the stain a gentle lick. Even in the cloth of her gloves, the honey and jam taste pretty much as you’d expect, sweet and delicious. The songstress’ eyes widen as you engulf the entire fingertip in your mouth, suckling gently; she squirms, clearly flustered, but the resistance is no more than token.", parse);
				Text.NL();
				Text.Add("Thoroughly bathing her digit in your spit, you work away at the stain with the tip of your tongue, licking and sucking alternately. Come to think of it… she must have pretty sensitive fingers, what with her playing her strings and all. Satisfied that all the sweetness has been cleaned from the cloth, you withdraw, wiping away a small trail of sticky drool from your mouth.", parse);
				Text.NL();
				Text.Add("You note that the stain should be much easier to wash out now.", parse);
				Text.NL();
				Text.Add("<i>“Um… yes.”</i> Slowly, Cveta upends her cup on her finger and gives it a good scrubbing; sure enough, the stain is gone.", parse);
				
				cveta.relation.IncreaseStat(100, 1);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Watch",
			tooltip : "She can handle it by herself, she’s a capable girl.",
			func : function() {
				Text.Clear();
				Text.Add("Grumbling to herself, Cveta pours the contents of her cup over the offending stain on her finger, then another when it refuses to wash out. You watch her with a faint smile - given her tiny frame, being sulky and angry only makes the songstress harder to take seriously.", parse);
				Text.NL();
				Text.Add("<i>“Well. It seems that my negligence has had some consequences,”</i> she says with a small sigh. <i>“Please, do not let my problems trouble you unduly. We are supposed to be enjoying ourselves here.”</i>", parse);
				Gui.PrintDefaultOptions();
			}, enabled : true
		});
		
		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("The rest of the meal passes quickly, helped along by the fact that there wasn’t much to begin with. Nevertheless, it should keep hunger at bay until you can get a proper meal. Cveta finishes herself, wiping her beak on a small handkerchief, then begins packing up the hamper once more.", parse);
			Text.NL();
			Text.Add("<i>“Thank you for bringing me out here. I needed to get away from the bustle of camp - it is not bad in and of itself, but background noise can certainly influence the creative process, and I needed a change of scenery.”</i>", parse);
			Text.NL();
			Text.Add("Oh, it was no trouble at all, and besides, she fed you. That ought to make the two of you even.", parse);
			Text.NL();
			Text.Add("<i>“If you say so,”</i> Cveta replies, gathering up her lyre. <i>“Perhaps we should be off?”</i>", parse);
			Text.NL();
			Text.Add("The trip back to the outlaws’ is as uneventful as the walk out, and before long you’re surrounded by the clinks, shouts and muffled curses that are part and parcel of life in the camp.", parse);
			Text.NL();
			Text.Add("<i>“I should be going,”</i> Cveta tells you, giving you a small curtsey before making for her tent. <i>“If you do have the time, please do stay for the evening performance. I would be thrilled to have you present.”</i>", parse);
			Text.Flush();
			
			cveta.relation.IncreaseStat(100, 2);
			world.StepToHour(18);
			
			Gui.NextPrompt();
		});
		
		Gui.SetButtonsFromList(options, false, null);
	});
	
	Gui.SetButtonsFromList(options, false, null);
}


/* TODO

 */

export { DateScenes };
