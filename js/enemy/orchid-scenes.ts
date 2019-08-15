import { Race } from "../body/race";
import { Entity } from "../entity";
import { LaylaFlags } from "../event/farm/layla-flags";
import { GAME, TimeStep } from "../GAME";
import { Gui } from "../gui";
import { OasisFlags } from "../loc/oasis-flags";
import { Party } from "../party";
import { PregnancyHandler } from "../pregnancy";
import { Text } from "../text";
import { OrchidFlags } from "./orchid-flags";

const OrchidScenes: any = {};

OrchidScenes.Impregnate = function(mother: Entity, slot: number) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother,
		father : GAME().orchid,
		race   : Race.Plant,
		num    : 1,
		time   : 10 * 24,
		load   : 3,
	});
};

OrchidScenes.Interact = function() {
	const player = GAME().player;
	const orchid = GAME().orchid;
	const parse: any = {
		playername : player.name,
	};

	Text.Clear();
	Text.Add("The purified Orchid looks a lot less intimidating than when you fought her, though she still has a mass of tentacles sticking out of her back. The cute dryad has a lithe form standing at about five foot six, her breasts and hips rather modest compared to her voluptuous mother. Both her skin and hair are green in color, entwined with twigs and leaves. Her formerly black sclera have cleared, her eyes now a soft almond in color.", parse);
	Text.NL();
	if (orchid.Slut() >= 50) {
		Text.Add("She looks playful enough, but neither she nor her friends can ignore the now more or less docile tentacles; a permanent testament to what she’s done. It looks like she tries to avoid touching anything with them, though they are a bit unwieldy to maneuver.", parse);
	} else {
		Text.Add("The dryad looks a lot happier now than before, probably due to you and her friends accepting her new body to such an extent. She now has little trouble handling her tentacles, using them to move around and to grapple playfully with her friends. If nothing else, her new transformation has made her the unquestioned tag-champion of the glade.", parse);
	}
	Text.NL();
	Text.Add("Orchid turns to you as you approach, blushing.", parse);
	Text.NL();
	Text.Add("<i>“A-ah, hello [playername]!”</i>", parse);

	const first = !(orchid.flags.Talk & OrchidFlags.Talk.First);
	orchid.flags.Talk |= OrchidFlags.Talk.First;

	if (first) {
		OrchidScenes.FirstTalk();
	} else {
		Text.Flush();

		OrchidScenes.Prompt();
	}
};

OrchidScenes.Prompt = function() {
	const parse: any = {

	};

	// [name]
	const options = new Array();
	options.push({ nameStr : "Talk",
		tooltip : "Ask her if she has time to chat for a bit.",
		func() {
			Text.Clear();
			Text.Add("<i>“Sure, I can always spare time to talk to my savior.”</i> She smiles.", parse);
			Text.Flush();

			OrchidScenes.TalkPrompt();
		}, enabled : true,
	});
	/* TODO
	options.push({ nameStr : "name",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}, enabled : true
	});
	*/
	Gui.SetButtonsFromList(options, true, Gui.PrintDefaultOptions);
};

OrchidScenes.TalkPrompt = function() {
	const player = GAME().player;
	const orchid = GAME().orchid;
	const parse: any = {
		playername : player.name,
	};

	// [name]
	const options = new Array();
	if (false) { // TODO
	options.push({ nameStr : "Spring",
		tooltip : "Maybe Orchid knows of a way to get past the thorns?",
		func() {
			// #Shows up after PC has visited the Spring for the first time.
			Text.Clear();
			Text.Add("You explain to Orchid about the wall of thorns blocking your way to the spring, and ask her if she knows a way around them.", parse);
			Text.NL();
			Text.Add("<i>“A wall of thorns!? But there’s never been anything like that around that region!”</i>", parse);
			Text.NL();
			Text.Add("You reason the elves and that mysterious cloaked lizard probably have something to do with it, but you still need to get past it somehow, so you ask if she has any idea of how to get past it?", parse);
			Text.NL();
			Text.Add("Orchid shakes her head. <i>“I’m sorry, [playername], but I have no idea how you could get past it. Maybe Mother, or one of my sisters might know of a way. Have you tried asking them?”</i>", parse);
			Text.NL();
			if (false) { // #if spoken to Mother Tree about this TODO
				Text.Add("Yes, actually. Mother Tree thinks that maybe a strong dryad could force the thorns to open a path for you, but it would be too risky to lead a dryad there. From what she told you the very ground is corrupted, and there’s the chance the dryad might be corrupted like Orchid was...", parse);
			} else {
				Text.Add("No, you came straight to her. Still, maybe you should talk to them.", parse);
			}
			Text.NL();
			Text.Add("<i>“Sorry I was no help.”</i>", parse);
			Text.NL();
			Text.Add("It’s alright, you comfort her.", parse);
			Text.Flush();

			TimeStep({minute: 5});

			OrchidScenes.TalkPrompt();
		}, enabled : true,
	});
	}
	options.push({ nameStr : "How is she?",
		tooltip : "She’s been through a lot, and you’re still concerned for her wellbeing… ask her how she’s holding up.",
		func() {
			Text.Clear();
			const slut = orchid.Slut();
			if (slut < 5) {
				Text.Add("<i>“I’m… fine.”</i>", parse);
				Text.NL();
				Text.Add("...She doesn’t sound so good.", parse);
				Text.NL();
				Text.Add("<i>“No, really! I’m just not used to my new body.”</i> She smiles weakly. <i>“But everyone’s been really understanding, so I’m fine!”</i> she quickly adds.", parse);
				Text.NL();
				Text.Add("Well, that’s good!", parse);
				Text.NL();
				Text.Add("Orchid nods emphatically.", parse);
				Text.NL();
				Text.Add("She feels like she’s forcing herself… maybe you could help her get more used to her body sometime later? There’s certain advantages to having a few tentacles...", parse);
			} else if (slut < 25) {
				Text.Add("<i>“I’ve been good. Umm… I tried a few, err, things on my own.”</i> She blushes.", parse);
				Text.NL();
				Text.Add("Oh really? You ask her what kind of things she’s been trying, flashing her a knowing smile.", parse);
				Text.NL();
				Text.Add("<i>“Err, things you know! Like trying to push my tentacle into- eep!”</i> She yelps as one of her tentacles crawls over her shoulder to move towards her groin. Orchid deftly deflects it with a slap.", parse);
				Text.NL();
				Text.Add("<i>“S-sorry!”</i>", parse);
				Text.NL();
				Text.Add("You laugh at her reaction. There’s nothing to be worried about, nor does she need to be ashamed of her own curiosity.", parse);
				Text.NL();
				Text.Add("<i>“Hehe, thank you, [playername].”</i>", parse);
			} else if (slut < 50) {
				Text.Add("<i>“Things have been going great. I think I’m getting the hang of using these,”</i> she says, wiggling her tentacles behind her.", parse);
				Text.NL();
				Text.Add("<i>“Tried a few things by myself, and even had some help from my sisters.”</i>", parse);
				Text.NL();
				Text.Add("Really? And did they like it?", parse);
				Text.NL();
				Text.Add("Orchid blushes at the question. <i>“W-well… I’m still a little clumsy, but I think they liked it! I mean, they weren’t very responsive after we were done, but they looked pretty happy!”</i> She grins, batting her eyes in mock innocence.", parse);
				Text.NL();
				Text.Add("Well, that’s good! You certainly like having sex with her, so you’d guess other people would too. They just need to get past the fear of her tentacles and they’ll see that she’s a very tender and caring lover, not to mention a sexy girl.", parse);
				Text.NL();
				Text.Add("Orchid giggles, then leans over to give you a kiss on the cheek. <i>“Thank you, [playername].”</i>", parse);
			} else {
				Text.Add("<i>“I’m fine!”</i> She grins happily. <i>“Mother and my sisters have been helping with my urges lately, I don’t always use my tentacles on them, but when I do they seem to really enjoy themselves. I’ve actually gotten a few requests to more specific things with them lately, but all in all I’m pretty happy.”</i>", parse);
				Text.NL();
				Text.Add("So, she’s comfortable with her new body now?", parse);
				Text.NL();
				Text.Add("<i>“Thanks to you!”</i> She leans over to hug you and gives you a kiss on the cheek.", parse);
				Text.NL();
				Text.Add("You laugh at her reaction and tell her that she’s more than welcome!", parse);
				Text.NL();
				Text.Add("<i>“That’s good of you to say that,”</i> she says, her voice in a sultry tone.", parse);
				Text.NL();
				Text.Add("You watch as her tentacles move to caress your body in a very suggestive manner.", parse);
				Text.NL();
				parse.wo = player.mfTrue("", "wo");
				Text.Add("<i>“You know, [playername]? You’re a very attractive [wo]man, and I’m feeling a bit pent up right now. You wouldn’t mind helping me with my urges one more time, would you?”</i> She bats her eyes at you. <i>“I mean, it’s okay if you say no. But think about it,”</i> she adds, releasing you.", parse);
				Text.NL();

				player.AddLustFraction(0.2);

				Text.Add("Well, she’s learned to be pretty persuasive about it...", parse);
				Text.NL();
				Text.Add("<i>“Yay!”</i> She celebrates happily. <i>“But we can always fuck later. Right now, you just wanted to talk right?”</i>", parse);
				Text.NL();
				Text.Add("Err, right.", parse);
				Text.NL();
				Text.Add("<i>“Okay, I’m listening.”</i> She smiles.", parse);
			}
			Text.Flush();

			TimeStep({minute: 5});

			OrchidScenes.TalkPrompt();
		}, enabled : true,
	});
	options.push({ nameStr : "Mother Tree",
		tooltip : "You’re curious about Mother Tree, maybe Orchid could share a few things about her?",
		func() {
			Text.Clear();
			Text.Add("You ask Orchid if she wouldn’t mind talking about Mother Tree.", parse);
			Text.NL();
			Text.Add("<i>“About Mother? Sure, I guess, but what do you want to know?”</i>", parse);
			Text.NL();
			Text.Add("Well, you’re curious about any details she could give you really. How old is she? Is she the actual mother of all the dryads here? Does she never get bored of being stuck in the same place always?", parse);
			Text.NL();
			Text.Add("<i>“Well, to be honest you’d be better off asking Mother these questions directly, but I can tell you a thing or two.”</i>", parse);
			Text.NL();
			Text.Add("Great! You’re listening…", parse);
			Text.NL();
			Text.Add("<i>“I’m not sure how old Mother actually is, but from what I’ve been told, and from what I can feel, Mother is at least a few centuries old.”</i>", parse);
			Text.NL();
			Text.Add("Really? She does look to be more mature than most dryads in the glade, but you’d never have guessed she was that old. She certainly doesn’t look all that old, to be honest.", parse);
			Text.NL();
			Text.Add("<i>“Aging works differently for us dryads. My sister Spirit is actually much older than I am, even though I may look bigger. And there are dryads that live to be thousands of years old.”</i>", parse);
			Text.NL();
			Text.Add("Does she know any dryad that’s <i>thousands</i> of years old?", parse);
			Text.NL();
			Text.Add("Orchid shakes her head. <i>“Well, actually...”</i> She taps her chin in thought.", parse);
			Text.NL();
			Text.Add("<i>“Maybe the Great Tree could be a dryad? Or could have been one in the past? I’m not sure.”</i>", parse);
			Text.NL();
			Text.Add("Well, how does she figure that?", parse);
			Text.NL();
			Text.Add("<i>“There’s a presence within the Great Tree, but no one has ever managed to actually talk to it. Could be that the presence is in a deep slumber, or maybe they’re just content to watch over Eden in silence? I don’t know, but whatever is there, it’s a very warm presence. All dryads pay reverence to the Great Tree, and Mother is no different.”</i>", parse);
			Text.NL();
			Text.Add("Interesting…", parse);
			Text.NL();
			Text.Add("<i>“Now, about your other questions? Mother isn’t the actual ‘mother’ of every dryad in the glade, but we all still treat her as such. She’s our caring matron.”</i> Orchid smiles.", parse);
			Text.NL();
			Text.Add("<i>“As for getting bored? You’ll just have to ask her.”</i>", parse);
			Text.NL();
			Text.Add("Right, still it was a very insightful conversation.", parse);
			Text.NL();
			Text.Add("<i>“Anytime, [playername]. Anything else you’d like to talk about?”</i>", parse);
			Text.Flush();

			TimeStep({minute: 10});

			OrchidScenes.TalkPrompt();
		}, enabled : true,
	});
	options.push({ nameStr : "Her corruption",
		tooltip : "It’s a sensitive subject, but maybe Orchid wouldn’t mind sating your curiosity?",
		func() {
			Text.Clear();
			Text.Add("You preface your question by stating that she doesn’t have to say anything if she doesn’t feel like it, but if she does you’d appreciate it.", parse);
			Text.NL();
			Text.Add("<i>“O-okay?”</i> Orchid replies, a bit unsure herself.", parse);
			Text.NL();
			Text.Add("You ask her what it was like being… corrupted.", parse);
			Text.NL();
			if (orchid.Slut() < 25) {
				Text.Add("Orchid opens her mouth to reply, but no sound comes out and she averts her gaze. Moments later, she replies, <i>“I’m sorry, [playername], but I really don’t feel like talking about it...”</i>", parse);
				Text.NL();
				Text.Add("That’s understandable, you tell her. Maybe she’ll be willing to talk about it when she’s more comfortable. For now, maybe you should change the subject.", parse);
			} else {
				Text.Add("<i>“It’s difficult to explain,”</i> Orchid says, closing her eyes.", parse);
				Text.NL();
				Text.Add("<i>“I was still myself, I guess, but at the same time… hmm.”</i> She holds her chin, deep in thought.", parse);
				Text.NL();
				Text.Add("<i>“I really love Mother and my sisters, and after drinking from the spring, it was like nothing else mattered. I wanted to come here and show them how much I love them, and just thinking about it was enough to make me wet.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I didn’t care about anything or anyone else. Anything that was in my way would know my love. I would make them see, and in my mind, there was no way they could reject me, or even be afraid. It was like they were all teasing me, wanting me to show them what I was capable of doing.”</i>", parse);
				Text.NL();
				Text.Add("<i>“It was a weird feeling, and the more I showed everyone my love, the more excited, the better it would feel for me. It’s as if I had lost all my purpose, and only lived for one thing. Thinking back, it’s scary to see how far I went. I didn’t even realize my body had changed; I just used it as if I’ve always had tentacles growing out of my back.”</i>", parse);
				Text.NL();
				Text.Add("You nod in understanding.", parse);
				Text.NL();
				Text.Add("<i>“It’s bad, you lose sight of yourself and become like a beast who only cares about sating yourself. I’m sorry, [playername], but I don’t think I can say any more...”</i>", parse);
				Text.NL();
				Text.Add("That’s alright, you tell her. You’re happy she could share this much and thank her for her effort.", parse);
				Text.NL();
				Text.Add("<i>“No problem, but let’s talk about something else, okay?”</i>", parse);
			}
			Text.Flush();

			TimeStep({minute: 5});

			OrchidScenes.TalkPrompt();
		}, enabled : true,
	});
	/* TODO
	options.push({ nameStr : "name",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}, enabled : true
	});
	*/

	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Oh? Okay, I guess. Want to do something else then?”</i>", parse);
		Text.Flush();

		OrchidScenes.Prompt();
	});
};

OrchidScenes.FirstTalk = function() {
	const kiakai = GAME().kiakai;
	const party: Party = GAME().party;
	const parse: any = {

	};

	Text.NL();
	Text.Add("Concerned, you ask if she could sit down and talk to you for a moment.", parse);
	Text.NL();
	Text.Add("<i>“S-sure!”</i> she replies, forcing a smile.", parse);
	Text.NL();
	Text.Add("You take her hand and lead her to a more comfortable spot where the two of you can sit down and talk.", parse);
	Text.NL();
	Text.Add("Before anything else, you ask her how she’s doing. Her condition was pretty dire when you first met, and even now you can see she still has some leftover effects from that spring.", parse);
	Text.NL();
	Text.Add("Orchid sighs. <i>“I’ll admit that I still haven’t gotten used to these.”</i> She moves her tentacles so you can look at them. <i>“I’m still not sure about mother or my sisters. I think some of them are still afraid of me, and I can’t blame them. I’ve also been feeling some… weird things; things that I didn’t feel before. It’s like something building up inside me… b-but I’m a lot better than I was back when...”</i> she trails off, looking apprehensive.", parse);
	Text.NL();
	Text.Add("It’s alright, you tell her, placing a friendly hand on her shoulders and smiling at her.", parse);
	Text.NL();
	Text.Add("<i>“Thank you,”</i> she replies, smiling back.", parse);
	Text.NL();
	Text.Add("Now, you know this is still a touchy subject, but if possible you’d like to ask her a few more questions about her… transformation. Perhaps she remembers something that could hint who was responsible for that.", parse);
	Text.NL();
	if (party.InParty(kiakai)) {
		parse.name = kiakai.name;
		Text.Add("<i>“Yes, please. I would like to know more about the elves you have met,”</i> [name] chimes in.", parse);
		Text.NL();
	}
	Text.Add("<i>“I… okay, sure. I’d hate for this to happen to anyone else, especially my mother and my sisters.”</i>", parse);
	Text.Flush();

	OrchidScenes.FirstTalkPrompt({});
};

OrchidScenes.FirstTalkPrompt = function(opts: any) {
	const player = GAME().player;
	const kiakai = GAME().kiakai;
 const party: Party = GAME().party;
 const layla = GAME().layla;
 const oasis = GAME().oasis;

	const parse: any = {
		playername : player.name,
		name : kiakai.name,
	};

	// [Attackers] - [Elves][Spring][Lizard?] - [Tentacles]
	const options = new Array();
	if (!opts.attacker) {
		options.push({ nameStr : "Attackers",
			tooltip : "First, how about she recounts what she remembers from the attackers? You can discuss the details afterwards.",
			func() {
				opts.attacker = true;
				Text.Clear();
				Text.Add("<i>“O-okay, sure.”</i> She takes a deep breath.", parse);
				Text.NL();
				Text.Add("<i>“I was wandering about when I saw a suspicious hooded figure, so I decided to follow it. It was heading towards a clear spring nearby, and it looked hurt too. I mean, it was walking funny.”</i>", parse);
				Text.NL();
				Text.Add("Walking funny? Okay, what else?", parse);
				Text.NL();
				Text.Add("<i>“When it got there, I saw it pick up a gem, about as large as my fist,”</i> she shows you her closed hand for emphasis, <i>“and throw it in the spring. Then the spring got all icky and murky, and I was captured.”</i>", parse);
				Text.NL();
				Text.Add("You place a hand on her shoulder and give her a reassuring smile. What happened next?", parse);
				Text.NL();
				Text.Add("<i>“They had pointy ears and looked like elves, but these were strange… they had purple skin, and I could see their veins. They held me down while the creature, some kind of lizard, looked down at me. He ordered them to force me to drink from the spring and that’s when things get fuzzy...”</i>", parse);
				Text.NL();
				Text.Add("Well, you kinda know the rest. She came back here and you were forced to stop her.", parse);
				Text.NL();
				Text.Add("<i>“Y-yes. Thank you. If you weren’t here, I can only imagine what I’d have done...”</i>", parse);
				Text.NL();
				Text.Add("It’s quite alright, you tell her. Okay, so you got the general picture. Now you gotta ask about the details...", parse);
				Text.Flush();
				OrchidScenes.FirstTalkPrompt(opts);
			}, enabled : true,
		});
	} else {
		if (!opts.elves) {
		options.push({ nameStr : "Elves",
			tooltip : "What were they like? Has she met them before?",
			func() {
				opts.elves = true;
				Text.Clear();
				if (party.InParty(kiakai)) {
					Text.Add("[name] steps closer.", parse);
					Text.NL();
				}
				Text.Add("<i>“I’ve seen elves before; they usually keep to themselves, but none like those that attacked me. Those were, I don’t know, they looked like beasts.”</i>", parse);
				Text.NL();
				Text.Add("Beasts?", parse);
				Text.NL();
				Text.Add("<i>“Yes, normally elves look serene, calm and friendly, but these ones... they had blank gazes. It’s as if they didn’t have a mind of their own. All they did was grin and slobber, their clothes were in tatters. Some of them didn’t even care about covering themselves. They were very strong, and they had nails that looked like claws...”</i>", parse);
				Text.NL();
				if (party.InParty(kiakai)) {
					Text.Add("<i>“That does not sound like any elf I would know about. Something must have happened to make them this way. Did you see any other elves? Do you have any idea of why they were acting like that?”</i> [name] asks Orchid.", parse);
					Text.NL();
					Text.Add("<i>“I’m sorry, I don’t know. I’ve never actually been to their village, and I didn’t recognize any of them. I-I’m sorry,”</i> Orchid replies, looking down at the ground.", parse);
					Text.NL();
					Text.Add("<i>“That is okay. Thank you for answering my questions,”</i> [name] says, smiling softly.", parse);
					Text.NL();
				}
				Text.Add("You take a deep breath and pat her comfortingly on the arm. That seems to be about all you’re gonna get out of her.", parse);
				Text.Flush();
				OrchidScenes.FirstTalkPrompt(opts);
			}, enabled : true,
		});
		}
		if (!opts.spring) {
		options.push({ nameStr : "Spring",
			tooltip : "Where is it located? What was it like before the corruption?",
			func() {
				opts.spring = true;
				Text.Clear();
				Text.Add("<i>“The spring used to be beautiful. I used to bathe there all the time. Many animals used that as their drinking hole, and I know of a few elves that came to collect its waters frequently.”</i>", parse);
				Text.NL();
				Text.Add("Is that all? Was there anything special about it?", parse);
				Text.NL();
				Text.Add("<i>“Not that I would know...”</i>", parse);
				Text.NL();
				Text.Add("Hmm… okay and where’s it located, you ask.", parse);
				Text.NL();
				Text.Add("Orchid begins explaining about landmarks and directions so you can get there. You take a mental note of everything she says, and eventually you’re confident you could get there from the glade.", parse);
				Text.NL();
				Text.Add("<i>“In general, just go that way.”</i> She points in a direction.", parse);
				Text.NL();
				Text.Add("You thank Orchid for the directions, perhaps you should go check up on it later.", parse);
				if (party.InParty(layla)) {
					Text.NL();
					Text.Add("<i>“Umm...”</i> Layla says as she approaches the two of you.", parse);
					Text.NL();
					Text.Add("You look at her inquisitively.", parse);
					Text.NL();
					Text.Add("<i>“...No, nevermind.”</i>", parse);
					Text.NL();
					Text.Add("She looks a bit apprehensive, which is odd since she’s usually pretty cheerful...", parse);
					Text.NL();
					if (layla.flags.Talk & LaylaFlags.Talk.Origin) {
						Text.Add("It takes a bit, but you finally deduce that this spring Orchid mentioned must be the same spring Layla told you about, the one where she was <i>born</i> in.", parse);
						Text.NL();
						Text.Add("You get up and walk towards her, patting her on her head comfortingly.", parse);
						Text.NL();
						Text.Add("Layla smiles back at you, as you return to Orchid, whom seems a bit confused about the exchange.", parse);
					} else {
						layla.flags.Talk |= LaylaFlags.Talk.Origin;
						Text.Add("You ask her if something’s the matter. You’re here for her, and if she has anything to say, you’ll listen to it.", parse);
						Text.NL();
						Text.Add("<i>“Actually… that’s the same spring I came from.”</i>", parse);
						Text.NL();
						Text.Add("...What?", parse);
						Text.NL();
						Text.Add("<i>“Umm… what?”</i> Orchid says, about as confused as you are about this revelation.", parse);
						Text.NL();
						Text.Add("<i>“I don’t remember it very well, I was so confused. But I remember there being a spring, and some bad people there. They tried to capture me, but I ran. And I remember it was all murky and icky like you said,”</i> Layla explains.", parse);
						Text.NL();
						Text.Add("Huh? You didn’t expect that. So she ran away from the spring - was she corrupted by the spring too? But then, why wasn’t she acting like Orchid earlier when you met her? Sure, she was a bit… wild… but that was more because she was hungry, confused and scared. Taking a deep breath to organize your thoughts, you ask Layla to elaborate. What does she remember?", parse);
						Text.NL();
						Text.Add("<i>“Well… first it was all dark and warm, but then I felt like something was tearing at me and it got cold. It was like that for a while, but then I felt wet, and I couldn’t breathe, so I swam up and when I finally made it to the surface, there were a bunch of people there. I didn’t know any of them, and someone yelled at them to catch me, so I ran as fast as I could. When I finally made it away, I cleaned myself on some leaves. I was covered in some strange, black water.”</i>", parse);
						Text.NL();
						Text.Add("And she didn’t feel ill or strange at all?", parse);
						Text.NL();
						Text.Add("Layla simply shakes her head.", parse);
						Text.NL();
						Text.Add("<i>“That’s all I remember.”</i> She looks down. <i>“Sorry.”</i>", parse);
						Text.NL();
						Text.Add("You immediately get up and hug her, explaining to her that it’s okay. Her telling you this much helps a lot already.", parse);
						Text.NL();
						Text.Add("<i>“Did I do good?”</i> she asks.", parse);
						Text.NL();
						Text.Add("Yes, yes she did. She’s a very good girl, you tell her, patting her head gently.", parse);
						Text.NL();
						Text.Add("Layla smiles back as you go back to your place.", parse);
					}
				}
				Text.Flush();
				OrchidScenes.FirstTalkPrompt(opts);
			}, enabled : true,
		});
		}
		if (!opts.lizard) {
		options.push({ nameStr : "Lizard?",
			tooltip : "The lizard creature. Is there anything else she could tell you about him? What was he dressed like? Any markings she’d be able to recognize?",
			func() {
				opts.lizard = true;
				Text.Clear();
				Text.Add("<i>“I… let me think...”</i> she furrows her brows in thought for a few moments.", parse);
				Text.NL();
				Text.Add("<i>“I don’t remember much about him, but his voice was definitely male; kind of raspy and hissy. I think it fits a lizard. And he had a strange staff with an odd shape.”</i>", parse);
				Text.NL();
				Text.Add("You raise a brow at that.", parse);
				Text.NL();
				Text.Add("<i>“It was shaped like a snake, a snake with glowing eyes and a wide mouth, with four sharp fangs.”</i>", parse);
				Text.NL();
				// TODO HAVE SEEN MAJID STAFF FLAG
				parse.m = false ? " In fact, haven’t you seen such a staff before?" : "";
				Text.Add("You make a mental note of that.[m] Those details certainly help you narrow things down, but is there anything else she can tell you about him?", parse);
				Text.NL();
				Text.Add("<i>“Umm… well he was a lizard, like I said. I’ve never seen anyone like him, I guess.”</i>", parse);
				Text.NL();
				if (player.RaceCompare(Race.Reptile) >= 0.4) {
					Text.Add("<i>“To be honest, you kinda remind me of him, no offense.”</i>", parse);
					Text.NL();
					Text.Add("None taken.", parse);
					Text.NL();
					Text.Add("<i>“Maybe you two are of the same species?”</i>", parse);
					Text.NL();
					Text.Add("So, he’s a lizan…", parse);
					Text.NL();
					Text.Add("<i>“Leezan?”</i>", parse);
					Text.NL();
					Text.Add("Yes, that’s your species. ", parse);
					if (oasis.flags.Visit >= OasisFlags.Visit.Visited) {
						Text.Add("Perhaps you should ask around at the Oasis? That’s the town where most lizans come from, so maybe they’d know something about the culprit?", parse);
					} else {
						Text.Add("<i>“Oh, I remember one my sisters told us about them. She said they live somewhere in the desert.”</i>", parse);
						Text.NL();
						Text.Add("Then perhaps you should keep an eye out for their city. Maybe someone in there will be able to tell you something about the culprit.", parse);
					}
				} else {
					Text.Add("Her description is pretty vague, so you ask if she was sure that he was a lizard.", parse);
					Text.NL();
					Text.Add("<i>“Yes! I’m pretty sure! I mean, I’ve never seen anyone like him, but he’s definitely a lizard. He had talons on his feet, and claws on his hands, and sharp teeth on his muzzle!”</i>", parse);
					Text.NL();
					Text.Add("Is that so? And she wouldn’t happen to know anything else about these lizards, would she?", parse);
					Text.NL();
					Text.Add("<i>“I think I remember one of my sisters talking about them. They’re called Lizans, and they live in the desert somewhere.”</i>", parse);
					Text.NL();
					Text.Add("Lizans, huh? ", parse);
					if (oasis.flags.Visit >= OasisFlags.Visit.Visited) {
						Text.Add("You’ve actually been to their town. it’s called the Great Oasis, and maybe someone there might be able to tell you more about this mysterious Lizan.", parse);
					} else {
						Text.Add("You’ll have to keep an eye out when you decide to go to the desert. Perhaps if you can find their city, you might be able to find out something about this mysterious Lizan.", parse);
					}
				}
				Text.NL();
				Text.Add("You ask her if there’s anything else she can remember.", parse);
				Text.NL();
				Text.Add("Orchid shakes her head. <i>“Sorry, but that’s all I remember before they forced me to drink...”</i>", parse);
				Text.NL();
				Text.Add("That’s fine, having heard these details narrows down your search a lot. You vow to catch him and make him pay for what he did.", parse);
				Text.NL();
				Text.Add("Orchid smiles at hearing that. <i>“I’ll be rooting for you, [playername]!”</i>", parse);
				Text.Flush();
				OrchidScenes.FirstTalkPrompt(opts);

				// TODO #Unlock “Strange Lizan” topic when talking to Sissy
			}, enabled : true,
		});
		}
	}
	if (options.length > 0) {
		Gui.SetButtonsFromList(options, false, null);
	} else {
		options.push({ nameStr : "Tentacles",
			tooltip : "So, her tentacles… From the looks of it, it doesn’t seem like they’re going away...",
			func() {
				Text.Clear();
				Text.Add("<i>“Y-yeah… They’re weird, I’m a monster!”</i> she declares, beginning to tear up.", parse);
				Text.NL();
				Text.Add("You immediately take hold of her hand tell her that there’s no way a sweet girl like her would be a monster. She’s just a bit different now; she’s still the same Orchid she’s always been...", parse);
				Text.NL();
				Text.Add("<i>“No, I’m not! I have these strange feelings and urges now, and I have no idea how to deal with it! My sisters are scared, and I can’t even look Mother in the eyes! Even as you sit here, holding my hand, I can feel those urges growing stronger by the second! Let’s face it, I <b>am</b> a monster!”</i> she blurts out, beginning to cry.", parse);
				Text.NL();
				Text.Add("You approach her and hold her into a hug, patting her on the back, careful to avoid her tentacles.", parse);
				Text.NL();
				Text.Add("She hugs you back, and you watch in mild amusement as both her arms and tentacles move to embrace you in a rather tight hug.", parse);
				Text.NL();
				Text.Add("Eventually, you’re forced to remind her that as much as you enjoy hugging her, you still need to breathe…", parse);
				Text.NL();
				Text.Add("<i>“Oh! Sorry!”</i> she says, immediately releasing you.", parse);
				Text.NL();
				Text.Add("You laugh at her reaction, that’s fine, you’re fine. See? There’s no way a monster would’ve released you. You don’t care how much she insists she’s a freak or a monster, you can be pretty stubborn, and you’ll be damned if you don’t hammer it into her that she’s most definitely <b>not</b> a monster.", parse);
				Text.NL();
				Text.Add("<i>“Thank you, [playername]. You don’t know how happy it makes me to hear you say that...”</i> she says, smiling softly at you.", parse);
				Text.NL();
				Text.Add("You smile back, there you go! She looks much better with a smile on her face. Now… about those urges? What do they feel like?", parse);
				Text.NL();
				Text.Add("<i>“It’s… difficult to explain. It’s like I get hot all over, especially on my tentacles and on my...”</i> she begins blushing.", parse);
				Text.NL();
				Text.Add("Oh…well, you’re no expert, but you think you know what those urges she’s feeling are.", parse);
				Text.NL();
				Text.Add("<i>“R-really!?”</i>", parse);
				Text.NL();
				Text.Add("Yes, definitely.", parse);
				Text.NL();
				Text.Add("<i>“Then how do I get rid of them?”</i>", parse);
				Text.NL();
				Text.Add("Well… that’s difficult to explain too… but basically she can’t fully get rid of them.", parse);
				Text.NL();
				Text.Add("<i>“Oh...”</i> she looks disappointed.", parse);
				Text.NL();
				Text.Add("But she can sate her urges for a while.", parse);
				Text.NL();
				Text.Add("<i>“How do I do that?”</i> she asks enthusiastically.", parse);
				Text.Flush();

				// [Sex][Later]
				const options = new Array();
				options.push({ nameStr : "Sex",
					tooltip : "Well, the best way to do this is to show her.",
					func() {
						Text.Clear();
						Text.Add("PLACEHOLDER", parse);
						Text.NL();
						Text.Add("", parse);
						Text.Flush();

						// #goto First Time Sex TODO
					}, enabled : false, // TODO
				});
				options.push({ nameStr : "Later",
					tooltip : "Well, like you said, it’s hard to explain, and you can’t really try to do that right now.",
					func() {
						Text.Clear();
						Text.Add("<i>“Oh? Okay.”</i>", parse);
						Text.NL();
						Text.Add("If she’s really curious though, she could always ask her sisters or her mother. They should be able to tell her how to deal with her urges. If not, you’ll show her to take care of it some other time when you’re around.", parse);
						Text.NL();
						Text.Add("<i>“Okay, thanks a lot, [playername].”</i>", parse);
						Text.NL();
						Text.Add("You process all the information she’s shared and then thank her for talking about this, you know it’s a sensitive subject.", parse);
						Text.NL();
						Text.Add("<i>“I’ll do anything I can do to help you catch the bastard that did this to me!”</i>", parse);
						Text.NL();
						Text.Add("Having said that, you thank her once more and the two of you part ways.", parse);
						Text.Flush();

						// TODO #”Spring” added as a location from the glade.

						Gui.NextPrompt();
					}, enabled : true,
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true,
		});

		Gui.SetButtonsFromList(options, false, null);
	}
};

export { OrchidScenes };
