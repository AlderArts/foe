import { Cock } from "../../body/cock";
import { Gender } from "../../body/gender";
import { Race } from "../../body/race";
import { Encounter } from "../../combat";
import { EncounterTable } from "../../encountertable";
import { Entity } from "../../entity";
import { Sex } from "../../entity-sex";
import { GAME, NAV, TimeStep, WORLD, WorldTime } from "../../GAME";
import { MoveToLocation } from "../../GAME";
import { GameState, SetGameState } from "../../gamestate";
import { Gui } from "../../gui";
import { IChoice } from "../../link";
import { DryadGladeFlags } from "../../loc/glade-flags";
import { Party } from "../../party";
import { PregnancyHandler } from "../../pregnancy";
import { Text } from "../../text";
import { Time } from "../../time";
import { Player } from "../player";
import { GwendyScenes } from "./gwendy-scenes";
import { LaylaFlags } from "./layla-flags";
import { LaylaMob } from "./layla-mob";

export namespace LaylaScenes {

	export function Prompt(switchSpot: boolean) {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		const parse: any = {

		};

		const that = layla;

		const options: IChoice[] = [];

		options.push({ nameStr : "Talk",
			func() {
				Text.Clear();
				Text.Add("Layla tilts her head to the side, looking at you inquisitively. Her long tail sways behind her as she waits to hear what you want to talk to her about.", parse);
				Text.Flush();
				LaylaScenes.TalkPrompt(switchSpot);
			}, enabled : true,
			tooltip : "You’d like to talk about some things with Layla, if she doesn’t mind.",
		});
		const tooltip = layla.Virgin() ? "It’s time to make good on your promise and teach her about proper sex." : "You’re feeling a tad horny, and you doubt the pretty chimera would have anything against some intimacy.";
		let enabled = (layla.flags.Talk & LaylaFlags.Talk.Sex) !== 0;
		if (layla.Virgin()) {
			enabled = enabled && (player.FirstCock() !== undefined || player.Strapon() !== undefined);
		}
		options.push({ nameStr : "Sex",
			func() {
				if (layla.Virgin()) {
					LaylaScenes.SexFirstTime();
				} else {
					Text.Clear();
					Text.Add("<i>“I’d love to!”</i> She exclaims, happily clinging onto you.", parse);
					Text.NL();
					Text.Add("You stroke her back and chuckle, remarking that you thought she’d be happy. Now, as for what you want to do to her this time...", parse);
					Text.Flush();

					LaylaScenes.SexPrompt(switchSpot);
				}
			}, enabled,
			tooltip,
		});
		options.push({ nameStr : "Appearance",
			func() {
				LaylaScenes.Appearance(switchSpot);
			}, enabled : true,
			tooltip : "You want to take a closer look at Layla’s body.",
		});
		/*
		options.push({ nameStr: "Release",
			func : () => {
				Text.Clear();
				Text.Add("[Placeholder] Layla masturbates fiercely, cumming buckets.");

				TimeStep({minute : 10});

				that.AddLustFraction(-1);
				Text.Flush();
				Gui.NextPrompt(() => {
					that.Interact(switchSpot);
				});
			}, enabled : true,
			tooltip : "Pleasure yourself."
		});
		*/
		// Equip, stats, job, switch
		// Layla can't equip things
		that.InteractDefault(options, switchSpot, false, true, true, true);

		Gui.SetButtonsFromList(options, true, NAV().PartyInteraction);
	}

	// TODO
	export function TalkPrompt(switchSpot: boolean) {
		const player: Player = GAME().player;
		const layla = GAME().layla;
		const parse: any = {
			playername : player.name,
		};

		const options: IChoice[] = [];

		const tooltip = layla.Virgin() ? "Despite her apparent innocence, Layla does have a nice body. So why not proposition the chimeric beauty for a little romp in the hay?" : "Now that Layla knows what it is, what does she think about sex?";
		options.push({ nameStr : "Sex",
			func() {
				Text.Clear();

				layla.flags.Talk |= LaylaFlags.Talk.Sex;

				if (layla.Virgin()) {
					Text.Add("<i>“What is sex?”</i> she asks in confusion.", parse);
					Text.NL();
					Text.Add("Okay... she’s a bit more innocent than she looks. Now, how to put this in terms she’ll understand?", parse);
					Text.NL();
					Text.Add("After a few moments of thought, you explain to Layla that sex is something that two people do together that brings them both pleasure.", parse);
					Text.NL();
					Text.Add("<i>“Pleasure? Like something I like?”</i>", parse);
					Text.NL();
					Text.Add("Well, yes, more or less.", parse);
					Text.NL();
					Text.Add("<i>“I like being with you!”</i> she states happily.", parse);
					Text.NL();
					Text.Add("Well, that is pleasing to hear. But, just being with someone you like isn’t the same thing as sex. That’s... well, it’s difficult to put into words. But you can show her, if she’s willing?", parse);
					Text.NL();
					Text.Add("<i>“Yes, please!”</i>", parse);
					Text.NL();
					Text.Add("Alright then, you promise to show her, but you’ll do so another time. Can she bear it and wait until you’re ready?", parse);
					Text.NL();
					Text.Add("<i>“Oh, okay.”</i>", parse);
					Text.NL();
					Text.Add("You muse to yourself that perhaps the best way to introduce her to the act would be something more traditional. ", parse);
					if (player.FirstCock() || player.Strapon()) {
						Text.Add("Luckily you’re already equipped for it, so it’s just a matter of approaching her at the right time.", parse);
					} else {
						Text.Add("You should probably get a toy or something - maybe a strap-on - to help you with the lesson. You could introduce her to lesbian sex, but you feel it’s best to explain how it’s supposed to go between a man and woman first.", parse);
					}
				} else { // not virgin
					Text.Add("<i>“I love it! I hope we can do it again!”</i>", parse);
					Text.NL();
					Text.Add("You chuckle softly at her enthusiasm. Of course you can do it again, but you were hoping for a little more detail on what she thinks of it than that.", parse);
					Text.NL();
					Text.Add("She looks at you curiously, then stops to think about it for a moment. Finally, she shrugs. <i>“I love it. And I’d like to learn more about it, but I’m not sure what else to say...”</i>", parse);
					Text.NL();
					Text.Add("Not much for words, is she? But you smile and thank her, telling her that if that’s all she has to say on the matter, that’s good enough for you. You’re happy she trusts you enough to share her feelings with you.", parse);
					Text.NL();
					Text.Add("<i>“Sure, any time, [playername]. But...”</i>", parse);
					Text.NL();
					Text.Add("Yes?", parse);
					Text.NL();
					Text.Add("<i>“When can we do it again?”</i>", parse);
					Text.NL();
					Text.Add("Chuckling at the expression on her face, you promise her that it’ll be soon.", parse);
				}
				Text.Flush();
				LaylaScenes.TalkPrompt(switchSpot);
			}, enabled : true,
			tooltip,
		});
		/* //TODO
		options.push({ nameStr : "name",
			func : () => {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : ""
		});

		*/

		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("On second thought, maybe you two could chat some other time…", parse);
			Text.NL();
			Text.Add("The chimera twists her head in confusion, but she smiles all the same, replying with a timid, <i>“Okay.”</i>", parse);
			Text.Flush();

			LaylaScenes.Prompt(switchSpot);
		});
	}

	export function Appearance(switchSpot: boolean) {
		const player: Player = GAME().player;
		const kiakai = GAME().kiakai;
		const layla = GAME().layla;
		const parse: any = {
			name : kiakai.name,
			playername : player.name,
		};

		Text.Clear();
		if (layla.flags.Skin === 0) {
			Text.Add("You watch in amazement as Layla’s clothes seemingly shift off her body, becoming part of her skin and revealing her pert nipples and virgin pussy for you to gaze at.", parse);
			Text.NL();
			Text.Add("<i>“Is this good?”</i>", parse);
			Text.NL();

			LaylaScenes.FirstTimeSkinShift();
		} else {
			Text.Add("Layla isn’t wearing any real clothing, and the 'clothing' she appears to wear is nothing but her own skin, shifted to appear as such. She wills it back to her <i>naked</i> appearance, exposing her assets to you without shame or embarrassment.", parse);
			Text.NL();
			Text.Add("<i>“Is this good?”</i>", parse);
			Text.NL();
			Text.Add("That’s perfect, you assure her, adding a nod of approval for emphasis. Layla’s lips curl into a proud smile and she stands just a little bit straighter. This gives you free rein to start looking her over.", parse);
		}
		Text.NL();
		if (layla.Virgin()) {
			Text.Add("You’d be lying if you claimed to know precisely what species she is. But, as far as you can tell, she’s female, complete with a virginal pussy lying between her thighs.", parse);
		} else {
			Text.Add("Though you’re still not sure what she is, you know that she’s more than she seems. She’s presenting herself as female now, but you’re intimately aware that she’s more than that. Hidden within a secret groove just above her vagina, concealed by her shifting skin, lies a retractable phallus. When exposed, it looks perfectly human, save perhaps its color, which is an indigo blue shade. She has demonstrated she can make its base swell into an impromptu knot as well. From what you’ve seen, you’d say it’s twelve inches long and two and a half inches thick.", parse);
			Text.NL();
			Text.Add("A second such phallus conceals itself within the tip of her long tail, like a lewd version of a stinger, although much smaller than the first phallus - only six inches long and an inch thick - it is otherwise identical.", parse);
			Text.NL();
			Text.Add("Highlighting her alien nature, you know for a fact that her control over her genitalia is uncanny. She can manipulate her vaginal walls, altering their capacity and texture, as well as moving them when you couple. Likewise, she can make her phalluses erect at will, whether they are exposed or not.", parse);
		}
		Text.NL();
		Text.Add("Having taken in her gender, you focus your attention on her head. In all honesty, looking at Layla’s face alone, you’d think she was an elf. At first glance, she has the same cast to her features as [name] does, especially when it comes to having the same long, slender, pointed ears. But the small horns sweeping back from her forehead quickly dash any notion of her being an elf.", parse);
		Text.NL();
		Text.Add("Layla’s skin is a dark gray. Not charcoal colored, but closer to black than white - something like very dark ashes. Naked as she is, you can easily take in that she has two-toned skin. While most of her skin is darker, starting in a small triangle on her chin and sweeping down her torso, widening to encompass her breasts before narrowing so that it ends on her inner thighs, the skin is a much lighter shade of gray. Almost a drab silver, really.", parse);
		Text.NL();
		Text.Add("Her eyes are human enough - with round pupils and white sclera - so long as you look past the deep crimson of her irises. Raven black hair falls in a shoulder-length mane from her head, trailing over her neck. When she grins, the teeth she reveals are perfectly human-like. Strangely, this seems to make her <b>more</b> unusual rather than less.", parse);
		Text.NL();
		Text.Add("Finished taking in her features, you allow your gaze to sweep down toward her chest.", parse);
		Text.NL();
		if (layla.Virgin()) {
			Text.Add("A perky set of dun-silver C-cups sit upon her chest, each adorned with a large, prominently erect nipple the same dark gray color as the rest of her skin. Other than their coloration and the size - and seemingly permanent erection - her nipples seem quite human.", parse);
			Text.NL();
			Text.Add("Layla watches you gazing at her breasts, but otherwise displays no reaction. You simply shrug and allow your eyes to drift down her body.", parse);
		} else {
			Text.Add("Layla’s boobs are a large C-cup, but that’s because she feels that’s the most comfortable, yet noticeable, of sizes. When she feels like it, she can expand them, inflating herself up to a large E-cup. If that isn’t alien enough, the large, permanently erect nipples she has can be teased open, revealing vagina-like orifices filled with slick lubricating juices. Her breast skin is dull silver in color, whilst her nipples are dark gray on the outside and blue like her cocks on the inside.", parse);
			Text.NL();
			Text.Add("She notices where you are gazing and puffs out her chest, moving her arms to push them together enticingly.", parse);
			Text.NL();
			Text.Add("You chuckle softly and shake your head; for now, you just want to look. Layla pouts and you allow your view to drift down her body.", parse);
		}
		Text.NL();
		// Pregnancy
		const womb = layla.PregHandler().Womb();
		const preg = womb && womb.pregnant;
		const stage = preg ? womb.progress : undefined;
		if (preg && stage > 0.8) {
			Text.Add("Layla’s stomach bulges out to an almost obscene degree, though her elastic skin shows not a single stretch-mark. The child within is nearly full-grown now, soon to make its entry into the world.", parse);
			Text.NL();
			Text.Add("<i>“Anytime now,”</i> she says, lightly rubbing her bulge.", parse);
		} else if (preg && stage > 0.6) {
			Text.Add("A great belly swells out from Layla’s midriff, easily comparable to a full-term human pregnancy. But you have a feeling she’s not done growing quite yet...", parse);
			Text.NL();
			Text.Add("<i>“Almost there,”</i> Layla says, gently rubbing her belly.", parse);
		} else if (preg && stage > 0.4) {
			Text.Add("Layla’s formerly trim stomach has grown considerably distended. A full orb of flesh hangs below her breasts now, sheltering a growing child within.", parse);
			Text.NL();
			Text.Add("Layla smiles softly but doesn’t say anything.", parse);
		} else if (preg && stage > 0.2) {
			Text.Add("Your inhuman lover has grown a very distinct potbelly. It’s not so large yet, but she’s visibly rounded at the waist. You have a strong suspicion that she’s pregnant.", parse);
			Text.NL();
			Text.Add("<i>“We should prepare,”</i> she says, rubbing her belly. Seems like your suspicion has just been confirmed.", parse);
		} else {
			Text.Add("Layla’s belly is trim and flat - not muscular, but clearly well-toned and slender. Strangely, she doesn’t have a bellybutton. With nothing in particular to hold your gaze there, you continue looking her over.", parse);
		}
		Text.NL();
		Text.Add("You ask Layla if she would turn around for you; you need a better look at her back.", parse);
		Text.NL();
		Text.Add("Her tail sways to and fro, and she starts turning for you, deliberately slow. There is an undeniable grace to her movements, as she finishes turning. <i>“Better?”</i>", parse);
		Text.NL();
		if (layla.Virgin()) {
			Text.Add("Much better, you assure her, nodding your thanks for emphasis. Since her tail is still swishing back and forth, it naturally draws your attention first.", parse);
		} else {
			Text.Add("Layla’s tail brushes its very tip tenderly against your cheek, making your smile fit to match the grin she herself is sporting. It’s certainly a flattering angle for her, you reply, and reach up to stroke the sensitive tip of her tail with your fingers. Needless to say, you resume your inspection with the appendage continuing to caress you.", parse);
		}
		Text.NL();
		Text.Add("All in all, it’s fairly reptilian-looking - discounting that she has smooth skin as opposed to scales, of course. It’s clearly prehensile, starting with a broader base and ending in a narrow tip. You estimate its length to be about four and a half feet long, and it moves with an almost eel-like sinuousness.", parse);
		Text.NL();
		if (!layla.Virgin()) {
			Text.Add("Curious, you close your fingers around her tail tip and bring it in for a closer look. Even though you know she’s hiding a secondary cock inside her tail, there isn’t the slightest clue to its presence.", parse);
			Text.NL();
			Text.Add("Your inquisitive fingers try to disprove what your eyes are telling you, eliciting a moan of appreciation, but they find nothing. No hidden groove, no concealed slit, no muscle-lips, nothing to show where it emerges. You’re not even certain she doesn’t simply transforms her tail-tip when she needs her tail-cock.", parse);
			Text.NL();
			Text.Add("<i>“That feels pretty nice, [playername]. Do you want it?”</i> she asks with a smile.", parse);
			Text.NL();
			Text.Add("Not at the moment, no, you reply. You’re not quite done with what you’re doing yet. Petting her tail one last time, you let it go.", parse);
			Text.NL();
			Text.Add("<i>“Pity,”</i> she says, looking back at you with a smile.", parse);
			Text.NL();
		}
		Text.Add("Having followed her tail all the way to its base, you take this moment to admire Layla’s rear. It’s not huge, but it’s round and perky in its curviness, meshing perfectly with her build. ", parse);
		if (!layla.Virgin()) {
			Text.Add("You know she can plump it up at will - just like she can with her breasts, but she’s most comfortable with it as it is. ", parse);
		}
		Text.Add("Her hips are similar in stature - wide enough to give her a feminine shapeliness, but not so wide as to look absurd on her slender build.", parse);
		Text.NL();
		if (layla.Virgin()) {
			Text.Add("Touching her is tempting, but you’re not sure how she would react. As you try to move away, her tail loops around a wrist, pulling you forward as she bends slightly forward. <i>“It’s okay,”</i> she says, looking back at you.", parse);
		} else {
			Text.Add("Layla’s butt is just begging to be touched. Almost without thinking, you reach out and grope one svelte cheek. As your fingers close around the curvaceous flesh, you can feel the tone of her muscles, firm and strong beneath the shapely exterior.", parse);
			Text.NL();
			Text.Add("You hear a sharp intake of breath from the chimeric girl, and a moment later she bends forward slightly, thrusting her buttcheeks into your palms. She looks back at you with a soft smile and nods.", parse);
		}
		Text.NL();
		Text.Add("Since she has given you such obvious permission, you see no reason to hold back. With both hands now, you start to explore her rear. Running your fingers over her hips, squeezing her butt-flesh between your fingers. Affectionately, you compliment the chimera on her butt; she’s got a very nice specimen indeed back here.", parse);
		Text.NL();
		Text.Add("She giggles softly at your compliment. <i>“Thank you. I like yours too!”</i>", parse);
		Text.NL();
		if (layla.Virgin()) {
			Text.Add("You can’t help a soft chuckle at her words and thank her for the compliment.", parse);
			Text.NL();
			Text.Add("She wags her tail a bit, then lets it rest on your shoulder.", parse);
		} else {
			Text.Add("For a moment, you ponder if that was an innocent compliment or if she meant something more by it. Your gaze sweeps over her swishing tail-tip and to the cleft between her legs, where you know her two cocks are hidden. It’s best not to think too hard about it...", parse);
		}
		Text.NL();
		Text.Add("You bend  slightly to get a better view, and your gaze falls upon the womanly flower lying hidden between Layla’s thighs. Even from this angle, you can make it out quite clearly. Visually, it looks perfectly human, so long as you ignore the dark gray of its labia against the dun-silver of her surrounding flesh.", parse);
		Text.NL();
		if (!layla.Virgin()) {
			Text.Add("As you’ve learned, there’s more than meets the eye to her womanhood. In addition to its colors - dark gray lips, indigo blue interior - Layla can also manipulate her walls at will, allowing her to milk, grip and even suckle without moving the rest of her body.", parse);
			Text.NL();
			Text.Add("It’s also impossibly elastic. There doesn’t seem to be any limit to how far she can stretch without feeling pain, handling even the biggest of insertions with pleasure and ease.", parse);
			Text.NL();
		}
		Text.Add("From where you are, it’s natural to move on to her legs. They’re human in shape, slender and shapely like a woman’s should be - and yet, there’s a sense of power to them, of muscle hidden beneath the curves. Without thinking about it, you reach out and place a hand on her calf, feeling the sinews ripple beneath her gray skin.", parse);
		Text.NL();
		Text.Add("Finally, your gaze ends up on Layla’s feet. Like her legs, they’re human at first glance, but the toes are just slightly... off. They’re a joint longer than they should be, and they’re capped in small claws. They’re feet designed for running and climbing.", parse);
		Text.NL();
		Text.Add("Satisfied with your inspection, you stand up straight again and thank Layla for satisfying your curiosity.", parse);
		Text.NL();
		Text.Add("<i>“Any time, [playername],”</i> she says, shifting her skin back into makeshift clothes.", parse);
		Text.Flush();

		LaylaScenes.Prompt(switchSpot);
	}

	export function PartyRegular(switchSpot: boolean) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const kiakai = GAME().kiakai;
		const layla = GAME().layla;
		const terry = GAME().terry;
		const roa = GAME().roa;
		const momo = GAME().momo;
		const miranda = GAME().miranda;
		const cveta = GAME().cveta;
		const burrows = GAME().burrows;

		const parse: any = {
			playername : player.name,
		};

		const first = layla.flags.Met < LaylaFlags.Met.Talked;
		Text.Clear();
		if (first) {
			layla.flags.Met = LaylaFlags.Met.Talked;
			Text.Add("You ask if Layla has a moment, you’d like to talk to her.", parse);
			Text.NL();
			Text.Add("<i>“Sure!”</i> she replies enthusiastically. ", parse);
			Text.NL();
			Text.Add("She glances at you for a moment, then bites her lip. It seems she wants to say something, and you urge her with a gentle smile.", parse);
			Text.NL();
			Text.Add("She offers a timid <i>“Thank you.”</i>", parse);
			Text.NL();
			Text.Add("Curious, you ask her why she’s thanking you.", parse);
			Text.NL();
			Text.Add("<i>“I want to find out more about myself. I don’t know who I am, or where I’m from. And I don’t stand a chance out there on my own… So thanks for taking me with you,”</i> she says with a happy grin.", parse);
			Text.NL();
			Text.Add("You’re not sure if you’ll have any luck figuring out more about her, but she’s welcome to accompany you for as long as she wants. Granted she doesn’t cause trouble along the way, at least.", parse);
			Text.NL();
			Text.Add("<i>“No! Of course not!”</i> she says, waving her hands.", parse);
			Text.NL();
			Text.Add("You tell her to calm down, you’re not threatening her of anything - just teasing her a little bit.", parse);
			Text.NL();
			Text.Add("<i>“Oh… okay.”</i>", parse);
			Text.NL();
			Text.Add("Layla is a very strange creature; as you ponder this, it strikes you that you don’t know exactly <i>what</i> she is. You can’t just keep calling her <i>creature</i> or <i>thing</i>, so you decide to ask her if she knows her species.", parse);
			Text.NL();
			Text.Add("<i>“Umm… I’m Layla!”</i>", parse);
			Text.NL();
			parse.race = player.Race().aShort();
			Text.Add("Gently, you correct her that’s her name, not what she is. She’s not <i>a</i> Layla, she’s just Layla. You’re [race], but you are [playername]. Does she understand you?", parse);
			Text.NL();
			Text.Add("<i>“I guess. But I… hmm.”</i> She taps her chin with a claw, thinking. After a few moments, she looks to you and shrugs.", parse);
			Text.NL();
			Text.Add("So she doesn’t know what species she is. Maybe she could come up with a name for her species then? At least until you figure out what she actually is?", parse);
			const pNum = switchSpot ? party.NumTotal() : party.Num();
			if (pNum > 1) {
				parse.comp = pNum === 2 ? party.Get(1).name : "your companions";
				Text.Add(" Maybe [comp] can offer some insight.", parse);
				Text.NL();
				if (party.InParty(kiakai, switchSpot)) {
					parse.name = kiakai.name;
					parse.heshe = kiakai.heshe();
					Text.Add("[name] takes a moment to look over Layla’s features. <i>“She has elven ears, but she is no elf, I can tell you that,”</i> [heshe] offers.", parse);
					Text.NL();
				}
				if (party.InParty(terry, switchSpot)) {
					parse.hisher = terry.hisher();
					parse.heshe = terry.heshe();
					Text.Add("Terry scratches [hisher] head as [heshe] circles the confused girl. <i>“I’ve seen all kinds of people, but none like her. Her tail looks kinda like a lizan’s though...”</i>", parse);
					Text.NL();
				}
				if (party.InParty(momo, switchSpot)) {
					Text.Add("<i>“Well, I don’t really know a lot of races, but I think she looks like a mixed breed of some kind,”</i> Momo muses, tapping her chin thoughtfully.", parse);
					Text.NL();
				}
				if (party.InParty(miranda, switchSpot)) {
					Text.Add("<i>“Whatever she is, I’m pretty sure I haven’t fucked one before,”</i> Miranda shrugs.", parse);
					Text.NL();
				}
				if (party.InParty(roa, switchSpot)) {
					if (burrows.LagonDefeated()) { // Regular
						Text.Add("Roa and Ophelia look at each other in confusion, then shift their gazes back at Layla.", parse);
						Text.NL();
						Text.Add("<i>“I’m afraid I’ve never seen anything like her. I could run some tests if you want,”</i> Ophelia offers.", parse);
						Text.NL();
						Text.Add("It’s probably best if she doesn’t, at least for now, considering what you’ve seen of Layla’s knack for getting rid of bindings. Plus you’re pretty sure she wouldn’t take kindly to that kind of treatment…", parse);
						Text.NL();
						Text.Add("What about Roa?", parse);
						Text.NL();
						Text.Add("<i>“Sorry, [playername],”</i> he shrugs.", parse);
					} else { // Slut
						Text.Add("The lagomorph siblings share a glance, then stride up to Layla with determined looks. <i>“Ophelia… run tests!”</i> the former alchemist proclaims, while her brother starts eagerly pawing the strange specimen.", parse);
						Text.NL();
						Text.Add("You stop the lusty lapins before they have a chance to take things further. They probably wouldn’t figure out anything, even if they did <i>test</i> Layla...", parse);
					}
					Text.NL();
				}
				if (party.InParty(cveta, switchSpot)) {
					Text.Add("Quietly, Cveta takes a step back and eyes Layla, the songstress keeping a politely detached air as she examines her without obviously staring.", parse);
					Text.NL();
					Text.Add("<i>“It is unfortunate that anthropology was not my forte, or indeed, a field I paid much attention to. The nature of this… person eludes me, [playername].”</i>", parse);
					Text.NL();
				}
			} else {
				Text.NL();
			}
			Text.Add("Looking her over once more, she has a reptilian tail, but elven ears. Her hands and feet look human enough, save for the claws. Her eyes are red, and her skin has a very unique pattern and feel. It’s like she’s not really any one thing. So maybe that is what you should refer to her as.", parse);
			Text.NL();
			Text.Add("Layla looks at you in curiosity, wondering what you have in mind.", parse);
			Text.NL();
			Text.Add("Where you come from, there’s a legendary creature that has the parts of several different species, called a chimera. That’s what Layla reminds you of. So, until you both manage to figure out what she really is, you’ll call her a chimera. Does she mind if you call her that, you ask.", parse);
			Text.NL();
			Text.Add("<i>“Chimera… I like it!”</i> she says with a grin.", parse);
			Text.NL();
			Text.Add("Then that’s what you’ll call her, you reply. Her cheerful enthusiasm is infectious and you find yourself grinning back. It may only be a placeholder, but it feels like you just helped her find a piece of her missing identity.", parse);
		} else { // Repeat
			Text.Add("Layla is a… well, you’re not sure what she is exactly, so you’re just calling her a chimera for now. She stands at about 5’4” and looks about in curiosity, just taking in her surroundings. It’s not until you draw her attention to yourself that she notices you.", parse);
			Text.NL();

			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				Text.Add("Layla smiles as you wave her over.", parse);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("<i>“Hi!”</i> Layla says with a grin.", parse);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("<i>“Hmm?”</i> Layla tilts her head to the side a little, wondering what you want with her.", parse);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("<i>“Yes, [playername]?”</i>", parse);
			}, 1.0, () => true);
			if (!layla.Virgin()) {
				scenes.AddEnc(() => {
					Text.Add("Layla wraps you in a hug as soon as you are within reach.", parse);
					Text.NL();
					Text.Add("Smiling, you hug your chimeric lover back, feeling her warm, smooth skin under your fingers.", parse);
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Add("<i>“Hey, [playername]. You wanna do it again?”</i> she asks.", parse);
					Text.NL();
					Text.Add("You chuckle and tell her that maybe later.", parse);
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Add("When you come closer, Layla playfully leaps into the air, crashing into you and nuzzling you affectionately.", parse);
					Text.NL();
					Text.Add("You stagger slightly at the impact, but manage to catch her. Wrapping your arms around her, you chuckle and stroke her hair. You’d ask if she was happy to see you, but the answer’s pretty obvious.", parse);
				}, 1.0, () => true);
			}

			scenes.Get();
		}
		Text.Flush();

		LaylaScenes.Prompt(switchSpot);
	}

	/*
	* Trigger meetings:
	*
	* 1. First meeting. On approaching farm from plains. On waking up from sleep on farm.
	* 2. Repeat meeting (if you lost). Same as above.
	* 3. Meeting after defeating Layla.
	*
	*/

	export function FarmMeetingTrigger(approach: boolean) {
		const glade = GAME().glade;
		const layla = GAME().layla;
		if (glade.flags.Visit < DryadGladeFlags.Visit.DefeatedOrchid) { return false; } // TODO: change to after portals open?
		if (layla.flags.Met === LaylaFlags.Met.NotMet) {
			if (approach) {
				if (WorldTime().hour >= 8 && WorldTime().hour < 18) {
					LaylaScenes.FirstMeeting(true);
					return true;
				} else { return false; }
			} else {
				LaylaScenes.FirstMeeting(false);
				return true;
			}
		} else if (layla.flags.Met === LaylaFlags.Met.First) {
			if (!layla.farmTimer.Expired()) { return false; }
			if (approach) {
				if (WorldTime().hour >= 8 && WorldTime().hour < 18) {
					LaylaScenes.RepeatMeeting(true);
					return true;
				} else { return false; }
			} else {
				LaylaScenes.RepeatMeeting(false);
				return true;
			}
		} else if (layla.flags.Met === LaylaFlags.Met.Won) {
			if (!layla.farmTimer.Expired()) { return false; }
			if (approach) {
				if (WorldTime().hour >= 4 && WorldTime().hour < 22) {
					LaylaScenes.SecondMeeting();
					return true;
				}
			}
		}
		return false;
	}

	// approaching/sleeping
	export function FirstMeeting(approach: boolean) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const gwendy = GAME().gwendy;
		const layla = GAME().layla;
		const parse: any = {
			playername : player.name,
		};

		parse.comp = party.Num() === 2 ? party.Get(1).name : "your companions";
		parse.c = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";

		layla.flags.Met = LaylaFlags.Met.First;

		Text.Clear();
		if (approach) {
			Text.Add("As you[c] make your way across the fields toward the farmhouse, your ears are filled with a great furor. Shouts, curses, screams, bleats; a cacophony of distress torn from throats animal and otherwise.", parse);
			Text.NL();
			Text.Add("Instinctively, you pick up your pace, racing to investigate. As you approach the barn, you see Gwendy pelting over the turf, swearing to herself. She lunges for a pitchfork that was left leaning against the side of the barn and spins on her heel to start back the way she had come.", parse);
			Text.NL();
			Text.Add("Running as fast as you can, you intercept the angry farmer, asking her just what is going on.", parse);
			Text.NL();
			Text.Add("<i>“Some kind of wild animal is raiding my storage. Gave the sheep quite a scare,”</i> she says, pointing toward a group of sheep huddled together.", parse);
			Text.NL();
			Text.Add("Without thinking, you nod your understanding. Caught up in the heat of the moment, you ask her if she’d like you[c] to handle this for her; you have a bit more combat experience than her.", parse);
		} else { // Sleeping at the farm
			Text.Add("As you lie curled up on your bed, a great clamoring rouses you[c] from your slumber. Startled, you grab your things and drop from the hayloft down into the barn proper, only to be nearly trampled as a flock of sheep charge inside, huddling together for shelter wherever they find a convenient nook.", parse);
			Text.NL();
			Text.Add("You race outside of the barn, almost running into Gwendy, who has just grabbed a nearby pitchfork. You ask her what is going on.", parse);
			Text.NL();
			Text.Add("<i>“Ah, [playername]. Good to see you’re awake. Some kind of wild animal is raiding my storage. I could use some help getting rid of it.”</i>", parse);
			Text.NL();
			Text.Add("Without stopping to think, you immediately blurt out that you’re happy to give her a hand. You probably have more combat experience than she does anyway.", parse);
		}
		Text.NL();
		Text.Add("<i>“Sure thing!”</i> she says with a smile. <i>“That thing is in the storage down this way!”</i> Gwendy hastily adds, dashing away. You[c] immediately take off after the sprinting farmer.", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();
			Text.Add("When you arrive, you immediately take notice of the trail of destruction left by the so called creature. The sturdy door to the storage room has been knocked clean from its hinges, pieces of the wooden frame lying spread across the floor. From inside come the obvious sounds of munching and swallowing, as well as the occasional tinkle of shattering glass. Whoever tore down the door is clearly gorging themselves on Gwendy’s precious food, without the slightest care about being caught.", parse);
			Text.NL();
			if (party.Num() < 4) {
				Text.Add("<i>“Let’s go, [playername], while I still have food left!”</i> Gwendy says, stepping inside. You follow on the heels of farmer.", parse);

				gwendy.RestFull();
				party.SaveActiveParty();
				party.AddMember(gwendy, true);

				Text.NL();
				Text.Add("Gwendy temporarily joins your party.", parse, "bold");
			} else {
				Text.Add("<i>“You and your friends look capable enough, but if you need me, I’ll be right here.”</i>", parse);
				Text.NL();
				Text.Add("You thank Gwendy for her offer, but assure her that you and your companions can handle this. The four of you ready yourselves and step through the broken door into the storage room.", parse);
			}
			Text.NL();
			Text.Add("Once inside, you get a brief glimpse of the wreckage. Broken preserve jars, torn sacks, discarded scraps of food. But your attention is fixed on the creature responsible. Standing roughly five and a half feet tall, it’s a strange creature. Its features are elfin - you can see the distinctive ears from where you stand - but it’s darkly colored and has a long, lashing, lizard-like tail.", parse);
			Text.NL();
			Text.Add("As you step closer, glass crunches under your weight, making it wheel to face you. Red eyes narrow into a ferocious glare, and the lips, set in a surprisingly female face, curl into a teeth-baring snarl. She tosses a half-eaten apple away and you catch a glimpse of her teardrop shaped breasts and carelessly exposed pussy.", parse);
			Text.NL();
			Text.Add("The creature’s long tail whips restlessly from side to side, and her fingers curl into makeshift claws. Her body shifts, adopting a low-slung stance with legs primed to send her springing forward in a pounce. A bestial hiss slithers past her lips. It’s a fight!", parse);
			Text.Flush();

			Gui.NextPrompt(LaylaScenes.FarmCombat);
		});
	}

	// In case you let her get away. This happens 3 days after that. And continue repeating every 3 days till you win.
	export function RepeatMeeting(approach: boolean) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const gwendy = GAME().gwendy;
		const parse: any = {
			playername : player.name,
		};

		const num = party.Num();

		if (party.Num() < 4) {
			gwendy.RestFull();
			party.SaveActiveParty();
			party.AddMember(gwendy, true);
		}

		parse.comp = party.Num() === 2 ? party.Get(1).name : "your companions";
		parse.c    = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";

		Text.Clear();
		if (approach) {
			Text.Add("As you[c] cross the fields to Gwendy’s farm, you hear a chorus of shouting, screaming and swearing. You race for the storage, urged on by a sinking feeling in your stomach about what’s going on. ", parse);
			Text.NL();
			parse.g1 = party.InParty(gwendy) ? " and Gwendy" : "";
			parse.g2 = party.InParty(gwendy) ? "" : ", followed by Gwendy";
			Text.Add("Meeting a cursing Gwendy armed with a pitchfork there, and seeing that the door has been knocked down again, only confirms your suspicions. Without the need for words, you[g1] burst into the storage[g2]. The creature chokes, spitting a glob of half-chewed cheese on the floor, and whirls to again fight you off.", parse);
		} else {
			Text.Add("<i>“[playername]! Wake up!”</i>", parse);
			Text.NL();
			Text.Add("You grunt and force your protesting eyes to open, blinking to try to bring the world into focus.", parse);
			if (num > 2) {
				Text.Add(" Around you, your companions likewise stir from their slumber, complaining in their own ways about the rude awakening.", parse);
			} else if (num > 1) {
				parse.name = party.Get(1).name;
				parse.heshe = party.Get(1).heshe();
				Text.Add(" [name] grumbles audibly as [heshe] is likewise forced back into the waking world.", parse);
			}
			Text.NL();
			Text.Add("You turn a slightly irritated gaze on  Gwendy. In your state, it takes a moment to notice the grim set of her jaw.", parse);
			Text.NL();
			Text.Add("<i>“She’s back! Get up and help me catch her!”</i>", parse);
			Text.NL();
			Text.Add("The words burn through the fog still lingering in your sleep-fuddled brain. Grabbing your gear, you[c] hasten to join the farmer as she races to the storage room.", parse);
			Text.NL();
			Text.Add("Just like the first time, the recently repaired door has been knocked off its hinges, much to Gwendy’s evident frustration. You charge on in, intent on this time preventing the creature’s escape. It drops the jar of milk it was guzzling with a strangled belch of surprise, once again immediately moving to defend itself.", parse);
		}

		if (party.InParty(gwendy)) {
			Text.NL();
			Text.Add("Gwendy temporarily joins your party.", parse, "bold");
		}

		Text.Flush();

		Gui.NextPrompt(LaylaScenes.FarmCombat);
	}

	export function FarmCombat() {
		const enemy = new Party();
		enemy.AddMember(new LaylaMob());
		const enc = new Encounter(enemy);

		enc.canRun = false;

		enc.onLoss = LaylaScenes.FarmCombatLoss;
		enc.onVictory = LaylaScenes.FarmCombatWin;
		/* TODO
		enc.LossCondition = ...
		*/
		enc.Start();
	}

	export function FarmCombatLoss() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const gwendy = GAME().gwendy;
		const layla = GAME().layla;
		const enc = this;
		SetGameState(GameState.Event, Gui);

		if (party.InParty(gwendy)) {
			party.LoadActiveParty();
		}

		const parse: any = {
			playername : player.name,
		};

		Text.Clear();
		Text.Add("<i>“Dammit!”</i> you hear Gwendy curse as the creature dashes past her in a single leap. You give chase, but by the time you exit the storehouse she’s already gone.", parse);
		Text.NL();
		Text.Add("<i>“Fuck!”</i> Gwendy curses again. <i>“Look at this mess!”</i>", parse);
		Text.NL();
		Text.Add("As if you could miss it. By herself, that thing, whatever it was, seems to have eaten easily a third of all the food Gwendy had stored here. Shelves are torn down, broken or discarded containers lie everywhere, and the floor is covered in puddles of brine, honey, jam, broken eggs, flour and spilt milk.", parse);
		Text.NL();
		Text.Add("<i>“I-Is the monster gone?”</i> A familiar sheep asks, peeking in from outside.", parse);
		Text.NL();
		Text.Add("<i>“Yes, it’s gone. Danie, be a dear and fetch Adrian for me. I’m going to need some help cleaning this up. Plus, the door needs fixing.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Sure!”</i> Danie replies, darting away.", parse);
		Text.NL();
		Text.Add("Taking in the damage again, you tap Gwendy on her shoulder to get her attention. When she turns to you, you point out that this probably won’t be the last raid. That creature looked hungry, and now that she knows where there’s food to be had, you’d lay money on her coming back for more when she wants it.", parse);
		Text.NL();
		Text.Add("<i>“Yeah, I’m pretty sure she will. But when she does, we’ll be ready.”</i>", parse);
		Text.NL();
		Text.Add("You nod firmly, assuring Gwendy that if you can, you’ll try and be here to help her with the next raid.", parse);
		Text.NL();
		Text.Add("<i>“Thanks, [playername],”</i> the farmer says, getting up on her feet and offering you a smile. <i>“If you want, you can stay over and I’ll call you when we spot that creature again.”</i>", parse);
		Text.NL();
		Text.Add("You thank Gwendy for her offer, and tell her you’ll consider it. For now, you should figure out what you want to do.", parse);
		Text.Flush();

		TimeStep({minute: 30});

		layla.farmTimer = new Time(0, 0, 3, 0, 0);

		Gui.NextPrompt();
	}

	export function FarmCombatWin() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const gwendy = GAME().gwendy;
		const layla = GAME().layla;
		const enc = this;
		SetGameState(GameState.Event, Gui);

		if (party.InParty(gwendy)) {
			party.LoadActiveParty();
		}

		const parse: any = {
			playername : player.name,
		};

		layla.flags.Met = LaylaFlags.Met.Won;

		Text.Clear();
		Text.Add("With a great hissing sigh, the creature staggers before collapsing onto the ground into a pile of scraps. Her formerly lashing tail goes limp and she lies motionless, clearly out cold.", parse);
		Text.NL();
		Text.Add("<i>“Good job!”</i> Gwendy exclaims triumphantly. <i>“Quick, [playername]. There’s some rope on that shelf. Tie this thing up before she wakes up.”</i>", parse);
		Text.NL();
		Text.Add("You hasten to grab the indicated ropes. Between the two of you, the creature is soon trussed up like a troublesome calf; she won’t be getting out of these bindings anytime soon. Once the creature is secured, you ask Gwendy what you should do next.", parse);
		Text.NL();
		Text.Add("<i>“There’s an empty tool shed that way. We can keep her locked in there until we can figure out what to do with her. I’ll go get someone to watch her.”</i>", parse);
		Text.NL();
		Text.Add("With a nod of understanding, you haul your new captive along in the direction Gwendy indicated. She’s pretty heavy... but then, after how much she ate, you’re not surprised.", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();
			Text.Add("<i>“Thanks a lot for the help, [playername]. You’re a life saver.”</i> Gwendy smiles.", parse);
			Text.NL();
			Text.Add("It was nothing, really, you assure her. The two of you head back toward the barn, chatting about the encounter. Gwendy seems rather impressed by your performance, and she’s definitely grateful for your help. The farmer invites you up to her loft for some refreshments, and you graciously accept, following her up the ladder and taking a seat at her table.", parse);
			Text.NL();
			Text.Add("<i>“Can I get you anything? Tea? Coffee?”</i> Gwendy wipes the sweat from her brow, a single drop escaping her attention and dripping down into her generous cleavage.", parse);
			Text.Flush();

			let hadSex = false;

			// [Tea] [Coffee] [You’re fine] [Sex]
			const options: IChoice[] = [];
			options.push({ nameStr : "Tea",
				func() {
					Text.Clear();
					Text.Add("<i>“Alright, take a seat and I’ll prepare you some tea.”</i>", parse);
					Text.NL();
					Text.Add("Thanking her for her kindness, you make yourself comfortable and settle back to wait for your drink.", parse);
					Text.Flush();

					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "Some tea would be lovely.",
			});
			options.push({ nameStr : "Coffee",
				func() {
					Text.Clear();
					Text.Add("<i>“Okay, sit down while I prepare some.”</i>", parse);
					Text.NL();
					Text.Add("Thanking her for her kindness, you make yourself comfortable and settle back to wait for your drink.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "Coffee would be great.",
			});
			options.push({ nameStr : "You’re fine",
				func() {
					Text.Clear();
					Text.Add("<i>“You sure? Alright then. Hope you don’t mind if I fix some coffee for myself.”</i>", parse);
					Text.NL();
					Text.Add("You smile and shake your head, assuring her that it’s fine. As she disappears into the kitchen to fix herself something, your make yourself comfortable.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "You’re not thirsty, but you appreciate the offer.",
			});
			options.push({ nameStr : "Sex",
				func() {
					Text.Clear();
					Text.Add("You tell her that if she wants to show you her gratitude, you can think of a more enjoyable way for her to do that...", parse);
					Text.NL();
					Text.Add("<i>“I see, and what way would that be?”</i> Gwendy asks with a knowing smile.", parse);
					Text.Flush();

					hadSex = true;

					GwendyScenes.LoftSexPrompt(() => {
						hadSex = false;

						Text.Clear();
						Text.Add("Uhh… actually, never mind. You shouldn’t have brought it up.", parse);
						Text.NL();
						Text.Add("<i>“And what would ‘it’ be?”</i> Gwendy queries, eyebrow raised. The girl seems pretty amused as you squirm under her gaze. <i>“If you are feeling a bit antsy… I’m not one to be ungrateful,”</i> she adds suggestively.", parse);
						Text.NL();
						Text.Add("She’s sharper than she lets on. Stumbling a bit over your words, you quickly decline, managing to get out something about having that drink.", parse);
						Text.NL();
						Text.Add("<i>“Sure,”</i> Gwendy shrugs, heading for her kitchen downstairs. <i>“Tea? Coffee? Milk?”</i>", parse);
						Text.NL();
						Text.Add("Goddamnit. She’s chuckles to herself, disappearing from view.", parse);
						Text.Flush();
						Gui.NextPrompt();
					}, true); // disable sleep (or this can potentially trigger the scene with Layla again...)
				}, enabled : gwendy.Sexed(), // Only available if you can normally access her Sex menu, otherwise disable this button.
				tooltip : "If she wants to show you her gratitude, you can think of a more enjoyable way for her to do that...",
			});
			Gui.SetButtonsFromList(options, false, undefined);

			Gui.Callstack.push(() => {
				Text.Clear();

				TimeStep({hour: 2});

				if (hadSex) {
					Text.Add("Quite some time later, when both of you have become a bit more presentable again and are sipping on some refreshments, you’re interrupted by a cowgirl poking her head up from the ladder leading to the loft. There’s a slight flush on her cheeks when she perceives the mood, but she shakes herself back to reality.", parse);
					Text.NL();
					Text.Add("<i>“Uhh… boss? She’s awake.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Alright, thanks,”</i> Gwendy replies, unfazed by the farmhand’s discomfort. The farmer turns to you, flashing you a quick grin. <i>“Shall we go see what this little intruder is up to, then? Or are you still feeling antsy?”</i> The cowgirl disappears down the ladder, ears burning.", parse);
				} else {
					Text.Add("You relax and chat with Gwendy for a while, until a cowgirl pokes up over the edge of the loft, interrupting you.", parse);
					Text.NL();
					Text.Add("<i>“Boss? She’s awake.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Alright, thanks,”</i> Gwendy replies. She nods at the cowgirl, dismissing her. <i>“Alrighty then. Let’s figure out what to do with our little intruder, shall we?”</i> she says, smiling at you.", parse);
				}
				Text.NL();
				Text.Add("Setting your shoulders, you rise from your seat and ask her to lead the way.", parse);
				Text.NL();
				Text.Add("Having set off at a brisk pace, you arrive at the toolshed shortly. The door is closed and one of the farm’s tougher-looking cowgirls is standing guard. At a gesture from Gwendy, the cowgirl nods, stepping aside to let the two of you pass.", parse);
				Text.NL();
				Text.Add("Gwendy is the first into the shed, and her sudden, sharp curse brings you racing to join her.", parse);
				Text.NL();
				Text.Add("Inside, you find that your captive has somehow gotten out of her bonds and is now loose. The she-beast is huddled in a corner, hissing like a giant snake, fingers curled into claws and tail lashing behind her.", parse);
				Text.NL();
				Text.Add("And yet... the creature’s eyes are wide and staring, darting all around the room in search of an exit. Her teeth are bared, but her body trembles feverishly. Despite her threatening display, you’re sure that the creature is scared of you.", parse);
				Text.NL();
				Text.Add("The stand off lasts for several long seconds. And then, the silence is cut by a plaintive gurgling grumble. Unthinkingly, the creature wraps her hands over her belly, whimpering softly in hunger. From panicked and threatening, she now just looks pitiful.", parse);
				Text.NL();
				Text.Add("Gwendy sighs. <i>“[playername], keep an eye on her, will you? I’ll be right back.”</i>", parse);
				Text.NL();
				Text.Add("You nod your assent and step past Gwendy, pointedly blocking the door as Gwendy ducks back outside.", parse);
				Text.NL();
				Text.Add("The farmer returns moments later with an armful of apples nestled against her bosom. She walks past you and crouches next to the strange girl, offering one to her.", parse);
				Text.NL();
				Text.Add("At first, the creature is suspicious, her red eyes drifting between you, Gwendy and the proffered apple. After what seems like an eternity, she reaches out a hand and snatches the fruit, practically devouring it on the spot. The others follow in suit.", parse);
				Text.NL();
				Text.Add("<i>“There you go. Better?”</i> Gwendy asks.", parse);
				Text.NL();
				Text.Add("<i>“...Thank you...”</i> the girls say in a hushed voice.", parse);
				Text.NL();
				Text.Add("<i>“So, you can talk...”</i> the farmer girl says.", parse);
				Text.NL();
				Text.Add("The creature simply nods, finally relaxing; her face loses some of its fearfulness and she stops holding herself quite so tensely. Gently, she sinks to the ground, seating herself on the earthen floor, leaning against the wall for support. Her hands lay themselves in her lap, her tail curling defensively around her body.", parse);
				Text.NL();
				Text.Add("<i>“Okay then, what’s your name?”</i>", parse);
				Text.NL();
				Text.Add("The creature looks at Gwendy for a moment, then shrugs.", parse);
				Text.NL();
				Text.Add("<i>“You got no name?”</i>", parse);
				Text.NL();
				Text.Add("The girl simply shakes her head.", parse);
				Text.NL();
				Text.Add("<i>“Then where do you come from?”</i>", parse);
				Text.NL();
				Text.Add("The creature looks at Gwendy for a moment, then shrugs once more.", parse);
				Text.NL();
				Text.Add("<i>“Oh boy… you’re not making this easy are you?”</i> the farmer sighs, then looks at you. From her expression, she’s obviously asking you for ideas.", parse);
				Text.NL();
				Text.Add("Hmm... you could always try and take the creature along with you. She could be useful in your party.", parse);
				Text.Flush();

				// [Take] [Don’t take]
				const options: IChoice[] = [];
				options.push({ nameStr : "Take",
					func() {
						layla.flags.Take = 1;

						Text.Clear();
						Text.Add("<i>“That’s not a half-bad idea. But...”</i> She turns her gaze back to the strange girl. <i>“There’s the matter of broken storage doors, the shelves, pots and crates. Not to mention my frightened animals and workers.”</i>", parse);
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Offer to take the creature with you; that should keep her out of mischief, at least.",
				});
				options.push({ nameStr : "Don’t take",
					func() {
						Text.Clear();
						Text.Add("Gwendy shrugs, then turn back to the girl. <i>“Alright then, we’ll figure that part out some other time. For now there is a little matter you and I have to settle first, missy.”</i>", parse);
						Text.NL();
						Text.Add("The girls simply tilts her head to the side, eyeing the farmer with confusion.", parse);
						Text.NL();
						Text.Add("<i>“The broken storage doors, the shelves, pots and crates. Not to mention my frightened animals and workers.”</i>", parse);
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Tell Gwendy that you don’t have any ideas what to do with the creature.",
				});
				Gui.SetButtonsFromList(options, false, undefined);

				Gui.Callstack.push(() => {
					Text.NL();
					Text.Add("The girl cowers as Gwendy lists all the damage she’s caused.", parse);
					Text.NL();
					Text.Add("<i>“Well? What are you going to do about it?”</i>", parse);
					Text.NL();
					Text.Add("The girl, whatever she is, is clearly at a loss for words. She looks so pathetic that you just have to intervene. Before you have the chance to, however, Gwendy puts a hand on your shoulders and winks. Seems like she has a plan. You close your mouth and wait to see what she has in mind.", parse);
					Text.NL();
					Text.Add("<i>“I… I’m sorry,”</i> the girl says.", parse);
					Text.NL();
					Text.Add("<i>“You can’t just go about entering any farm you see around, scaring everyone, then pilfering their food. Everyone worked really hard for the fruit and produce you just carelessly gobbled up.”</i>", parse);
					Text.NL();
					Text.Add("<i>“I’m sorry. I was hungry...”</i> she says, now on the verge of tears.", parse);
					Text.NL();
					Text.Add("<i>“I don’t think you understand how hard they all worked...”</i> Gwendy adds. <i>“But not to worry, you soon will. You say you were hungry? Well, we can’t have that either.”</i>", parse);
					Text.NL();
					Text.Add("The girl stops crying for a moment, just looking at the farmer with curiosity and fear in her eyes.", parse);
					Text.NL();
					if (layla.flags.Take !== 0) {
						Text.Add("<i>“You will work and repair the doors you broke, clean up the storage and apologize to everyone you scared. Then I’ll let [playername] take you. Agreed?”</i>", parse);
						Text.NL();
						Text.Add("The creature nods slowly.", parse);
						Text.NL();
						Text.Add("<i>“Good, now let’s get up and get you fed. Can’t work on an empty stomach.”</i>", parse);
						Text.NL();
						Text.Add("<i>“T-Thank you,”</i> she replies, wiping the tears off her eyes and getting on her feet.", parse);
						Text.NL();
						Text.Add("<i>“[playername]. Come back in a couple days, okay? I’m going to give this one a schooling. If you take her with you as she is, I’m afraid she’ll only cause trouble.”</i>", parse);
						Text.NL();
						Text.Add("Nodding your head, you muse aloud that Gwendy does raise a valid point. You don’t think that the girl is fit to be taken to a city yet; sounds like a recipe for disaster. You’re happy to leave her here until Gwendy is done schooling her.", parse);
					} else {
						Text.Add("<i>“You will work here, until you’ve paid everyone back for the damage you caused. Then, I’ll let you go. Understand?”</i>", parse);
						Text.NL();
						Text.Add("The girl nods slowly.", parse);
						Text.NL();
						Text.Add("<i>“And if you prove you can work well enough. Who knows… I might even consider letting you stay. It’s hard work, but at least you won’t go hungry, right?”</i>", parse);
						Text.NL();
						Text.Add("At this, the creature smiles a little. <i>“T-Thank you...”</i>", parse);
						Text.NL();
						Text.Add("<i>“See? You’re a good girl after all. C’mon, get up and let’s get you fed. You can’t work on an empty stomach.”</i>", parse);
						Text.NL();
						Text.Add("The strange girl nods again and wipes the tears from her eyes.", parse);
						Text.NL();
						Text.Add("Gwendy turns to look at you next. <i>“Hey, [playername]. Don’t worry about it. I’ll keep this girl here, school her and put her to work. This way, we know she won’t cause trouble. Plus, she can intimidate other petty thieves.”</i>", parse);
						Text.NL();
						Text.Add("You confess that Gwendy’s idea sounds like a solid plan to you. This is probably the best place for her at the moment.", parse);
					}
					Text.Flush();

					TimeStep({hour: 1});

					layla.farmTimer = new Time(0, 0, 3, 0, 0);

					Gui.NextPrompt();
				});
			});
		});
	}

	// Automatically happens 3 days after you won against Layla. As soon as the PC steps on the field.
	export function SecondMeeting() {
		const player: Player = GAME().player;
		const layla = GAME().layla;
		const parse: any = {
			playername : player.name,
		};

		Text.Clear();
		Text.Add("As you reach the fields, you spot Gwendy’s recent ‘houseguest’ as she busies herself stacking some firewood for later use. After placing the last logs, she wipes her brow with a forearm, letting out a tired sigh. Feeling inquisitive, you decide to see how she’s doing.", parse);
		Text.NL();
		Text.Add("As you get closer, you wonder why Gwendy doesn’t seem to have had any luck teaching her how to wear clothes yet. She’s still totally naked, just as she had been when you found her. It’s only when you get right up to her that you can see that you were wrong. She <b>is</b> clothed, wearing a simple dress that shows not the slightest ornamentation, but quite effectively preserves her modesty. It’s just that it’s so tight, and so closely matches her own gray and dull silver coloration, that it blends in with her skin.", parse);
		Text.NL();
		Text.Add("She turns at your approach  and jumps a little in surprise. A timid smile creeps onto her face as she greets you with a simple, <i>“Hello.”</i>", parse);
		Text.NL();
		Text.Add("Smiling encouragingly back at her, you return her greeting and ask her how she’s doing now that Gwendy’s taken her in.", parse);
		Text.NL();
		Text.Add("<i>“Oh, I’m doing fine,”</i> she says, then lowers her head. <i>“Sorry for attacking you...”</i>", parse);
		Text.NL();
		Text.Add("You wave it off, assuring her that it’s fine. You were kind of threatening her, after all.", parse);
		Text.NL();
		Text.Add("<i>“Oh, miss Gwendy said I should always introduce myself when I meet someone new,”</i> she clears her throat. <i>“Hello, I’m Layla. Nice to meet you… umm...”</i>", parse);
		Text.NL();
		Text.Add("[playername], you reply. Your name is [playername]. So, she’s called Layla now? That’s a pretty name.", parse);
		Text.NL();
		Text.Add("<i>“Thank you! I picked it myself. Your name is pretty too!”</i> she says with a smile.", parse);
		Text.NL();
		Text.Add("You thank her for the compliment. Then, curious, you ask how long she thinks it will take for her to work off the cost of the damage she did to Gwendy’s storeroom.", parse);
		Text.NL();
		Text.Add("<i>“It’s already paid for. I’m just helping around a bit.”</i> She smiles.", parse);
		Text.NL();
		Text.Add("You figured Gwendy was generous, but all the same, you’re surprised to see Layla’s already paid off her debt.", parse);
		Text.NL();
		if (layla.flags.Take !== 0) {
			Text.Add("Pushing that thought aside, you ask Layla if she remembers what you and Gwendy had in mind - about her coming with you once her debt was paid off?", parse);
			Text.NL();
			Text.Add("<i>“Yes. I’ve been waiting for you. I just want to say goodbye to everyone and we can go.”</i>", parse);
			Text.NL();
			Text.Add("So, she’s made some friends here? Of course she can have some time to say goodbye; you can wait for her to do that.", parse);
			Text.NL();

			LaylaScenes.LeavesGwendy();
		} else {
			Text.Add("Dismissing the thought, you ask Layla what she intends to do now that she’s free of her debt to Gwendy.", parse);
			Text.NL();
			Text.Add("The alien-looking girl stops to think for a moment. <i>“I’d like to find out where I come from, or even who I am. But I don’t stand a chance traveling alone, and everyone has been so nice to me here, even after I was so bad.”</i> She looks down for a moment, but quickly perks up. <i>“So I guess I’ll stay here.”</i>", parse);
			Text.NL();
			Text.Add("Well, if she’s found herself a home of sorts here, then that’s probably the smartest choice, you tell her. Privately, you consider her words. Maybe she’d be willing to come along with you if you ever offered her a place in your party? It’s something to keep in mind in the future.", parse);
			Text.Flush();
			// TODO
			// #Layla can now be visited on Gwendy’s Farm Fields. From 8:00 to 19:00
			layla.flags.Met = LaylaFlags.Met.Farm;

			Gui.NextPrompt();
		}
		TimeStep({minute: 30});
	}

	export function LeavesGwendy() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const layla = GAME().layla;
		const parse: any = {
			playername : player.name,
		};

		Text.Add("<i>“Okay! I’ll be right back!”</i> she says, dashing off at an impressive speed. It takes only a few minutes before she returns, with Gwendy in tow.", parse);
		Text.NL();
		Text.Add("<i>“So you’re taking Layla away,”</i> Gwendy states.", parse);
		Text.NL();
		Text.Add("You nod and tell her that you are. Was there something she wanted to say to Layla before she left? Or to you, for that matter?", parse);
		Text.NL();
		Text.Add("<i>“Just wanted to tell you to watch out for her. She’s a good girl,”</i> she says, then turns to Layla and embraces her in a hug. <i>“Gonna miss having you around, don’t forget to visit, ‘kay?”</i>", parse);
		Text.NL();
		Text.Add("<i>“‘Kay!”</i> Layla replies, hugging back.", parse);
		Text.NL();
		Text.Add("Well, look at that; certainly not what you would have expected given how they met. The sight brings a smile to your lips.", parse);
		Text.NL();
		Text.Add("<i>“Bye, Miss Gwendy. Thank you for everything,”</i> Layla says with a smile.", parse);
		Text.NL();
		Text.Add("<i>“Bye, Layla. [playername]. You two take care.”</i> Gwendy waves you off.", parse);
		Text.NL();
		Text.Add("Layla has joined your party.", parse, "bold");

		party.SwitchIn(layla);

		Text.Flush();

		layla.flags.Met  = LaylaFlags.Met.Party;
		layla.flags.Take = 0; // Remove variable from save

		Gui.NextPrompt(() => {
			MoveToLocation(WORLD().loc.Plains.Crossroads, {minute: 30});
		});
	}

	/* LAYLA SEX SCENES */

	export function Impregnate(mother: Entity, father: Entity, load: number, slot?: number) {
		mother.PregHandler().Impregnate({
			slot   : slot || PregnancyHandler.Slot.Vag,
			mother,
			father,
			race   : Race.Chimera,
			num    : 1,
			time   : 15 * 24,
			load,
		});
	}

	// TODO
	export function SexPrompt(switchSpot: boolean) {
		const player: Player = GAME().player;
		const layla = GAME().layla;
		const parse: any = {
			playername : player.name,
			armor() { return player.ArmorDesc(); },
		};

		const p1cock = player.BiggestCock(undefined, true);

		// [name]
		const options: IChoice[] = [];
		options.push({ nameStr : "Catch anal",
			func() {
				Text.Clear();
				Text.Add("<i>“Sure!”</i> she replies happily, shifting her skin out of the way.", parse);
				Text.NL();
				if (layla.sexlevel >= 5) {
					Text.Add("You lift your hands, preparing to undo your [armor]. Before you can really begin, you are almost bowled over by a happy, horny chimera.", parse);
					Text.NL();
					Text.Add("Layla’s lips seize hold of yours with a lamprey-like intensity. Her tongue passionately thrusts itself into your mouth, ensnaring your own like a lusty python. Her hands seize your wrists, keeping you immobilized, even as a veritable forest of tentacles sprouts from her back.", parse);
					Text.NL();
					Text.Add("The chimera’s appendages envelop you, caressing and undressing you. There’s a confusing cascade of motions as they undulate and squirm, undoing straps, unfastening buttons, opening ties, worming into sleeves, curling into underthings...", parse);
					Text.NL();
					Text.Add("When Layla finally breaks the kiss, stepping back with an appreciative sigh, your gear falls into a heap around you. Still reeling from the embrace, you smile dopily and compliment her on giving you a hand.", parse);
					Text.NL();
					Text.Add("<i>“No problem,”</i> she replies happily.", parse);
				} else if (layla.sexlevel >= 3) {
					Text.Add("As you raise your hands to begin undoing your [armor], Layla bounds over. With an almost puppy-like enthusiasm, the chimera starts trying to undress you, playfully tussling with you to remove your gear as quickly as possible. In a matter of moments, the two of you are equally naked.", parse);
 				} else {
					Text.Add("You waste little time in stripping yourself down as well. As you remove your gear, you’re quite aware of the curious, yet appreciative, gaze of your chimeric lover.", parse);
 				}
				Text.NL();
				LaylaScenes.SexCatchAnal();
			}, enabled : true,
			tooltip : "You want her cock up your butt - if she’s okay with that?",
		});
		/* TODO
		if(player.FirstVag()) {
			options.push({ nameStr : "Catch vaginal",
				func : () => {
					Text.Clear();
					Text.Add("", parse);
					Text.NL();

					LaylaScenes.SexCatchVaginal();
				}, enabled : true,
				tooltip : ""
			});
		}
		*/
		/*
		options.push({ nameStr : "name",
			func : () => {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : ""
		});
		*/
		options.push({ nameStr : "Pitch Vaginal",
			func : LaylaScenes.SexPitchVaginal, enabled : p1cock !== undefined,
			tooltip : "You want to fuck her pussy, if she’s okay with that.",
		});
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("On second thought...", parse);
			Text.NL();
			Text.Add("<i>“Well... okay,”</i> she replies, sounding slightly disappointed.", parse);
			Text.Flush();
			LaylaScenes.Prompt(switchSpot);
		});
	}

	export function SexFirstTime() {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		const p1cock = player.BiggestCock(undefined, true);
		const strapon = p1cock.isStrapon;

		let parse: any = {
			playername : player.name,
			upperArmor() { return player.ArmorDesc(); },
			lowerArmor() { return player.LowerArmorDesc(); },
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

		Text.Clear();
		Text.Add("<i>“Okay, I’m ready!”</i> she says with excitement.", parse);
		Text.NL();
		Text.Add("Not quite, you correct her. First, the two of you need to find some privacy. Your gaze flicks around, searching your surroundings. When you make your decision, you nod and lead the way. Layla follows you eagerly, trailing you like an excited puppy. Once you are satisfied you won’t be seen, you turn back to her. Now that you’re alone, the two of you need to undress.", parse);
		Text.NL();
		Text.Add("<i>“Okay!”</i>", parse);
		Text.NL();
		Text.Add("You watch as her clothes seemingly shift off her body, becoming part of her skin and revealing her pert nipples and virgin pussy for you to gaze at.", parse);
		Text.NL();
		Text.Add("<i>“What now?”</i> she asks innocently.", parse);
		Text.NL();
		if (layla.flags.Skin === 0) {
			LaylaScenes.FirstTimeSkinShift();
		}
		// TODO Armor
		Text.Add("Smiling gently to reassure her, you inform her that it’s time for the lessons to begin. You reach for your [upperArmor] and start to remove it, and then place your [lowerArmor] beside it in a neat little pile.", parse);
		Text.NL();
		if (strapon) {
			Text.Add("You reach into your gear and pull forth your trusty [cock], securing it with practiced ease into its proper slot at your loins.", parse);
			Text.NL();
		}
		Text.Add("Now properly dressed for the occasion, you close the distance between you. With one hand, you cup Layla’s chin, drawing her gently into a kiss. Her lips are warm and silky soft upon your own. Her taste begins to cover your tongue; it’s the velvety flavor of some foreign spice, with just a hint of bitterness.", parse);
		Text.NL();
		Text.Add("Layla is at a loss of what to do at first, but as she feels your [tongue] invade her mouth and tangle with hers, she begins to get the idea. Slowly, she begins to move her own tongue against yours. You can feel her muscle winding around yours, caressing you, even sliding into your own mouth to taste you.", parse);
		Text.NL();
		parse.sex = player.sexlevel >= 3 ? " - and you certainly know more than a few -" : ",";
		Text.Add("For a virgin as naive as she is, Layla sure catches on to kissing quickly. You pull out every trick you know when it comes to the arts of tongue wrestling[sex] but Layla quickly has you beaten. Her tongue simply isn’t human. The sinuous length of muscle that twines itself erotically around your own [tongue] like some tamed serpent.", parse);
		Text.NL();
		Text.Add("As your kiss grows steamier, your hands move to play their part in the lesson. You reach for one of her breasts, cupping the luscious orb in your palm and gently kneading the flesh with your fingers. As toned as she is elsewhere, there’s nothing but womanly softness in your grip. The feeling is silken soft, with just the right amount of give.", parse);
		Text.NL();
		Text.Add("Your ministrations manage to elicit a moan from the chimeric girl. Without thought, Layla’s tongue begins dancing inside your mouth with renewed vigor.", parse);
		Text.NL();
		Text.Add("Your own moan is muffled but sincere. Still, she’s getting so excited already? You can’t wait to see how she reacts to what comes next...", parse);
		Text.NL();
		Text.Add("Your free hand trails down Layla’s body. Your digits glide over the smooth, hairless skin, teasingly brushing her belly and curling over her hip. Inexorably, you make your way to the valley between her thighs. Unerringly, you guide your fingers up, reaching for her pussy.", parse);
		Text.NL();
		Text.Add("Layla suddenly tenses and gasps, breaking the kiss. She almost bolts in surprise, but you hug her to keep from running off. <i>“W-what was that?”</i> she asks, panting. <i>“It… it felt like a shock...”</i>", parse);
		Text.NL();
		Text.Add("Without hesitation, your hand abandons its post on Layla’s back to run comforting fingers through her hair. As you stroke her, you try to soothe her and apologize for touching her somewhere so sensitive without warning her first. You assure her that it’s okay, that this is part of her lessons, and if she relaxes, it will soon start to feel very good.", parse);
		Text.NL();
		Text.Add("<i>“Okay.”</i> She takes a deep breath. <i>“Sorry, you spooked me...”</i>", parse);
		Text.NL();
		Text.Add("It’s alright, you tell her. This is her first time, these things happen. You ask if she’s ready for you to continue.", parse);
		Text.NL();
		Text.Add("<i>“Yes,”</i> she says with a soft smile.", parse);
		Text.NL();
		Text.Add("Alright then. You pet her head gently in reassurance, and then lower your other hand back between her legs again. A soft, sharp intake of breath greets your actions, and you start to stroke.", parse);
		Text.NL();
		Text.Add("<i>“Ah!”</i> she moans, squirming under your touch, pressing her thighs together.", parse);
		Text.NL();
		Text.Add("Worming your fingers out of the chimera’s clenched legs, you gently pet her thighs. You run your digits back and forth lightly across her skin, stroking her soothingly. When she sighs and relaxes again, you gently begin to push her legs open. You instruct her that you need her to try and keep them spread for this.", parse);
		Text.NL();
		Text.Add("Layla nods her assent, and you return your attention to her hidden treasure. With great care, you stroke and caress her labia, running your fingers along her outer lips. <i>“Ah! [playername]!”</i>", parse);
		Text.NL();
		Text.Add("Smiling, you press on with your lesson. With the chimera more settled now, you can turn your gaze downward, allowing you to see what you’re doing instead of working by touch. Layla’s labia are starting to open now, giving you a glimpse of her interior. In stark contrast to her gray on gray skin, her inner lips are indigo blue in color, as if you needed more evidence as to your virgin’s lover’s inhumanity.", parse);
		Text.NL();
		Text.Add("Undaunted, you resume gently stroking her opening, wary of spooking her again as well as perforating her hymen. It’s good to see that despite her alien appearance, Layla does have some similarity to what you’re used to.", parse);
		Text.NL();
		Text.Add("For now, you refrain from exerting any real pressure on her opening. You don’t want to pop her cherry just yet, for now you just want her to get used to the idea of having someone play with her virgin pussy.", parse);
		Text.NL();
		Text.Add("<i>“Th-that feels weird.”</i>", parse);
		Text.NL();
		Text.Add("Concerned, you ask her if she wants you to stop.", parse);
		Text.NL();
		Text.Add("<i>“It feels kinda nice too,”</i> she adds with a smile.", parse);
		Text.NL();
		Text.Add("You chuckle softly at her amendment. Yes, it should. And this will feel even better...", parse);
		Text.NL();
		Text.Add("Gently curling your finger, you start to stroke Layla’s clitoris. The dark purplish button begins to grow under your ministrations. Its head starts to peek cautiously from the safety of her hood, until finally it’s protruding enough that you can carefully capture it between your forefinger and thumb. With your two digits, you start to squeeze it gently, stroking it between your fingers.", parse);
		Text.NL();
		Text.Add("<i>“Ah!”</i> she cries out cutely. You feel her body shaking as you stimulate her little pleasure buzzer.", parse);
		Text.NL();
		Text.Add("With a soft chuckle, you quip that it sounds like Layla is enjoying her lessons. The chimera absently nods in response. Giving her clitoris one last tender tweak, your fingers slide back down, returning to her labia.", parse);
		Text.NL();
		Text.Add("Warm wetness greets your probing digits - Layla’s body lubing itself in anticipation of what is to come. Careful as before to not split her hymen, you stroke her inner and outer walls. Slickness washes over your fingertips, and moans and coos fill your ears.", parse);
		Text.NL();
		Text.Add("As you caress and fondle, the wetness grows thicker and clearer. It begins to seep down your fingertips into your palm. Your own excitement mounting, you ask Layla how she feels now.", parse);
		Text.NL();
		Text.Add("<i>“G-good,”</i> she replies, panting. <i>“Don’t stop.”</i>", parse);
		Text.NL();
		Text.Add("It’s tempting to listen to her... but you have other plans, and so your fingers cease their stroking, sliding free of her newly moistened folds. On a whim, you lift your glistening digits to your face, sniffing to inhale her scent. Your [tongue] flicks out to glide over the juice dripping from your fingers, flooding your mouth with her taste.", parse);
		Text.NL();
		Text.Add("Layla’s expression is one of mingled curiosity and annoyance at your actions, but she says nothing, content for you to take the lead.", parse);
		Text.NL();
		Text.Add("Rising up, you place a hand on the chimera’s shoulder and gently push, coaxing her into lying down on her back. Instinctively, Layla spreads her legs, perhaps already grasping what you have in mind. You slide yourself into position atop her, a hand serving as support as you line up[oneof] your [cocks] with her womanhood.", parse);
		Text.NL();
		Text.Add("Once satisfied with your position, you reach out with a free hand and caress her cheek. You warn her that this will probably hurt a little, though you’ll try to be gentle as you can, but once the pain is over, it will feel even better than what you were doing.", parse);
		Text.NL();
		Text.Add("Layla nods softly, taking a deep breath. <i>“Okay,”</i> she says with a smile.", parse);
		Text.NL();
		Text.Add("Steeling yourself, you start to push forward, pressing your [cockTip] into her warm wetness. To your surprise, you find yourself having to push harder than you expected; you thought a virgin would be tight, but Layla is something else. She feels downright constricting.", parse);
		Text.NL();

		Sex.Vaginal(player, layla);
		layla.FuckVag(layla.FirstVag(), p1cock, 3);
		player.Fuck(p1cock, 8);

		Text.Add("You were sure she wouldn’t be this tight when you were fingering her, for some reason...", parse);
		Text.NL();
		Text.Add("Shrugging your concern off, you decide keep pushing forward. You glance at the chimera, who is biting her bottom lip, and wait for her to inhale slowly before nodding. With her signal, you begin to advance again, a careful, measured pace to make this as painless as you possibly can.", parse);
		Text.NL();
		if (player.FirstCock()) {
			Text.Add("You can’t help but bite your own lip in sympathy at Layla’s whimper, a distinctive warm wetness washing over your [cock] as her hymen tears despite your best efforts.", parse);
			Text.NL();
			Text.Add("Weird... the heat on your cock is stronger than it should be. A tingling feeling washes over your dick and slithers up your spine. It’s not unpleasant, though.", parse);
			Text.NL();
			Text.Add("Dragging yourself back to reality, you try to comfort your lover. You praise her for how brave she was, and assure her that the pain will be only momentary. Absently, you shake your head. The poor girl is really clamping down on you now - she feels even tighter than before. That must have really hurt for her.", parse);

			p1cock.length.IncreaseStat(100, 3);
			p1cock.thickness.IncreaseStat(20, 1);
		} else {
			Text.Add("Since your [cock] is only a toy, you only know when you’ve torn through Layla’s hymen from her groan of pain. You stop and comfort her, praising her bravery and assuring her that it will pass.", parse);
		}
		Text.NL();
		Text.Add("The chimera takes a few moments, breathing deeply, before she smiles at you and nods. <i>“I’m okay.”</i>", parse);
		Text.NL();
		Text.Add("You still wait a few moments more to be sure Layla is fully recovered before you start to thrust again. You keep your pace slow and leisurely, pushing in gently before pulling out with the same tenderness.", parse);
		Text.NL();
		Text.Add("Layla’s tail winds itself around your waist, holding onto you as her legs move to do the same. Her arms follow suit, wrapping you in a tender hug. The chimera clings to you, moving her hips as you pump yourself inside her.", parse);
		Text.NL();
		Text.Add("Gradually, you increase your pace, letting your thrusts grow faster and firmer. Layla is a little behind you, at first, but she again demonstrates her learning abilities; it doesn’t take long before she is matching your every move. Thrust for thrust and pump for pump, the chimera’s hips push against your own, no matter how hard or quickly you go.", parse);
		Text.NL();
		if (player.FirstCock()) {
			Text.Add("Somewhere along the line, you become aware of Layla’s pussy rippling around you. Her walls flex and squeeze, kneading you with apparent expertise, milking you with every thrust. It’s a little clumsy, but since most beings don’t have the muscles to do something like this at all, it’s still quite a surprise.", parse);
			Text.NL();
			Text.Add("Your mutual pleasure builds, mounting higher and higher as the two of you grapple each other. Feeling your own peak approaching, you gasp a warning to the chimera that you are about to cum.", parse);
			Text.NL();
			Text.Add("The chimera’s reply is to muffle you with a kiss.", parse);
			Text.NL();

			player.OrgasmCum();
			layla.OrgasmCum();

			Text.Add("With that oh-so-eloquent response, you thrust yourself in for the final time. You think you feel her pussy continuing to milk you, even though your thrusts have ceased, but you can’t be certain. All you <i>can</i> be certain of is the white-hot pleasure roaring through your veins, making you cry out into Layla’s muffling mouth as you cum inside her waiting snatch.", parse);
			Text.NL();
			Text.Add("Throughout your climax, Layla’s vagina milks you ceaselessly. Her rippling walls grasp you, pulsing along your shaft as if you were still fucking her. The sensation is amazing, your oversensitive member being stimulated from tip to base. It’s almost as if she’s sucking on your cock with her pussy. You can’t help the groan of pleasure that bubbles when you spew the last of the seed ", parse);
			if (player.HasBalls()) {
				Text.Add("your poor [balls] could muster.", parse);
			} else {
				Text.Add("she could extract from your overworked prostate.", parse);
			}
			Text.NL();
			Text.Add("With a soft pop of suction, you break the kiss, heaving lungfuls of sex-scented air. Beneath you, Layla is in much the same shape, but grinning as she pants.", parse);
			Text.NL();
			Text.Add("<i>“That was amazing, [playername],”</i> she says happily, wrapping you in another tight hug as she lets legs and tail unwind.", parse);
			Text.NL();
			Text.Add("It most certainly was; she’s an amazing student. As you cuddle her back, you work your hips, trying to extract your [cock] from her pussy.", parse);
			Text.NL();
			if (p1cock.Knot()) {
				Text.Add("You stop, feeling the tugging as your knot catches on her walls. It looks like you got so caught up in things that you knotted her without thinking about it.", parse);
				Text.NL();
				Text.Add("Layla looks at you in confusion, then giggles softly. <i>“Not done yet?”</i> she asks, contracting her vaginal walls to give your shaft another good squeeze.", parse);
				Text.NL();
				Text.Add("A soft groan escapes you as you feel her squeezing down on your sensitive bulb. Still, you shake your head and chuckle softly, assuring her that you’re done. You just can’t pull out of her whilst your knot is so swollen, that’s all. If she can be patient, it’ll go down soon.", parse);
				Text.NL();
				Text.Add("Layla shakes her head, smiling softly at you. <i>“You can pull.”</i>", parse);
				Text.NL();
				Text.Add("Immediately, you protest that you can’t do that.", parse);
				Text.NL();
				Text.Add("<i>“It won’t hurt, promise.”</i>", parse);
				Text.NL();
				Text.Add("She seems so sure, so coolly confident that you can’t help but give it a try. You pull back, cautiously at first, until you feel the grip of Layla’s cunt starting to loosen. Emboldened, you begin to pull harder and firmer; Layla grimaces a little, voicing a cute grunt, but eventually you pop free with a loud slurping sound.", parse);
				Text.NL();
				Text.Add("With your dick now free of Layla’s pussy, you roll partially over and rest on your hip, watching as semen oozes out of Layla’s cunt.", parse);
				if (player.NumCocks() > 1) {
					Text.Add(" It joins the substantial puddle that your other cock[s2] left on the ground below her.", parse);
				}
			} else {
				Text.Add("You squirm a little in Layla’s embrace before she gets the message and releases you. With the chimera no longer hugging you so tightly, you can extract your [cock] from the clenching tightness of her cunt.", parse);
				Text.NL();
				Text.Add("A few trace drops of semen ooze from your [cockTip] once it is free. ", parse);
				if (player.NumCocks() > 1) {
					Text.Add("They splash into the puddle left by your other cock[s2]. ", parse);
				}
				Text.Add("Letting it drip dry, you roll yourself over onto your hip and settle down to rest.", parse);
			}
			Text.NL();
			Text.Add("As you inhale slowly, you become aware of a tingling feeling unlike the usual afterglow coming from ", parse);
			if (player.NumCocks() > 1) {
				Text.Add("the [cock] you fucked Layla with.", parse);
			} else {
				Text.Add("your cock.", parse);
			}
			Text.Add(" Glancing down at it, you’d swear that it looks bigger now. But... surely that’s impossible? Without thought, your hand reaches down to cup it protectively, fingers closing around its length.", parse);
			Text.NL();
			Text.Add("To your shock, your hand confirms your initial impression. There’s definitely more girth to it now than there was before. It feels heavier, longer, even in its flaccid state.", parse);
			Text.NL();
			Text.Add("<i>“What’s wrong? Are you hurt?”</i>", parse);
			Text.NL();
			Text.Add("Only half paying attention to Layla’s words, you shake your head. No, it’s nothing. Everything’s fine, you assure her.", parse);
		} else {
			Text.Add("Layla’s pussy contracts and grips your cock every once in a while, making it a bit difficult to move. For a moment, you worry that you might be going a little too hard on the formerly virgin chimera, but the look of intense pleasure, as well as the cute moans and cries, puts your mind at ease.", parse);
			Text.NL();
			Text.Add("Even if you can’t really get the full experience, you can still feel a bit of what she’s doing to your [cock], and it’s amazing! Her pussy is gripping and milking your [cock] with such intensity that the vibrations alone are enough to stimulate both your [clit] and [vag].", parse);
			Text.NL();
			Text.Add("You yelp in surprise as the she-chimera suddenly pulls you into a rough kiss, taking advantage of your bewilderment and thrusting her tongue into your mouth. Wow, she must be having a blast!", parse);
			Text.NL();
			Text.Add("Mentally chuckling to yourself, you return her kiss with almost as much enthusiasm, feeling the tell-tale signs of her oncoming orgasm.", parse);
			Text.NL();
			Text.Add("Layla’s legs grip you extra-tight, nearly crushing with her deceptive strength, while you thrust into her one last time, all the way to the hilt and watch as Layla is driven to her very first orgasm.", parse);
			Text.NL();

			const cum = layla.OrgasmCum();

			Text.Add("It doesn’t last long, as Layla soon grows lax, relaxing her legs and tail. You break the kiss and let her pant, catching her breath. Gently, you stroke her hair as the scent of sex fills the air, a delightful aroma that makes you want to a reach a climax of your own… but you’ll have plenty of time to pursue that later.", parse);
			Text.NL();
			Text.Add("Once she’s recovered enough, you ask her what she thought of it.", parse);
			Text.NL();
			Text.Add("<i>“That was amazing, [playername].”</i>", parse);
			Text.NL();
			Text.Add("You smile and give her a gentle kiss on the forehead. Glad to hear that, you tell her, moving your hips to pull out of her deflowered vagina.", parse);

			player.AddLustFraction(0.75);
		}
		Text.NL();
		Text.Add("You embrace the chimera, holding her close and basking in your shared body warmth. Layla returns your hug, snuggling with you as she lets herself drift off to a light nap. You simply smile and stroke her hair as she rests for a bit.", parse);
		Text.Flush();

		TimeStep({minute: 45});

		Gui.NextPrompt(() => {
			Text.Clear();
			Text.Add("When Layla finally comes back to, she beams at you. There’s no doubt she really enjoyed herself. You release her and sit up, asking her how she’s feeling.", parse);
			Text.NL();
			Text.Add("<i>“Wonderful.”</i>", parse);
			Text.NL();
			Text.Add("You chuckle to yourself, smiling and stroking her cheek. That’s very good to hear.", parse);
			Text.NL();
			Text.Add("<i>“Can it be my turn now?”</i>", parse);
			Text.NL();
			Text.Add("Confusion blooms as the chimera’s words sink in. You direct a quizzical look at her, but Layla’s open smile is completely innocent. Baffled, you ask her what she means.", parse);
			Text.NL();
			Text.Add("<i>“You put your penis inside me. So… can I put mine inside you now?”</i>", parse);
			Text.NL();
			Text.Add("...Now you’re even more baffled than before. Patiently, you point out that Layla doesn’t have a penis.", parse);
			Text.NL();
			Text.Add("<i>“Yes, I do,”</i> she states matter-of-factly.", parse);
			Text.NL();
			Text.Add("This is starting to feel a little silly. Looking down at her crotch, you place a hand on her thighs. Layla obediently spreads her legs, baring her silver-toned loins to you. Yes, they’re still as flat and as female as before. Playfully, you fondle her nethers, remarking to her that you don’t see or feel any penis there.", parse);
			Text.NL();
			Text.Add("<i>“It’s not out. Do you want to see?”</i> she offers with a smile.", parse);
			Text.NL();
			Text.Add("Well, if this is the sort of game she wants to play, what harm is there in humoring her? Smiling, you reply that you do want to see it.", parse);
			Text.NL();
			Text.Add("<i>“Okay!”</i> she happily exclaims, getting up on her feet.", parse);
			Text.NL();
			Text.Add("As close as you are to her, you can do a surreptitious check. Maybe she’s got some kind of retractile penis, like a lizard or a snake, but if that were the case, then surely there’d be some sort of slit to mark where it emerges, right? As hard as you look, though, there’s nothing but smooth, bare skin above her pussy.", parse);
			Text.NL();
			Text.Add("The chimera sucks in a barely audible breath, biting her lip as her brow furrows. Before your eyes, the flesh of her underbelly starts to undulate, rippling like gentle waves on a pond. Just above her pussy, her flesh parts bloodlessly, opening up into a short, thin oval-shaped slit. This once-hidden orifice begins to widen, spreading itself open and revealing something within.", parse);
			Text.NL();
			Text.Add("It’s the distinctive rounded helmet shape of a human penis’s glans.", parse);
			Text.NL();
			Text.Add("Almost before that thought registers in your mind, it glides forth. In a progress that is almost stately, it creeps forward, gravity asserting itself and causing it to pull downwards. After what feels like a minute, it stops growing. It sways gently to and fro in the breeze, then begins to rise up into a proud erection. Displaying its full dimensions, it’s easily a foot long and just shy of three inches thick.", parse);
			Text.NL();
			Text.Add("<i>“See? My penis!”</i> She giggles.", parse);
			Text.NL();
			Text.Add("Gobsmacked, you almost can’t think of anything to say. Finally, synapses lock together and you blurt out the most obvious question: where was she hiding that thing? It’s humongous!", parse);
			Text.NL();
			const laylacock = layla.FirstCock();
			if (player.FirstCock()) {
				if (p1cock.Volume() > laylacock.Volume()) {
					Text.Add("It’s not bigger than yours, admittedly, but still, for a girl her size, that’s quite a monster she’s packing between her legs...", parse);
					Text.NL();
					Text.Add("Layla grins nervously, then shrugs.", parse);
				} else {
					Text.Add("Wow... she’s even bigger than you are...", parse);
					Text.NL();
					Text.Add("Layla simply shrugs.", parse);
				}
			} else {
				Text.Add("How could she possibly have been tucking something like that away inside herself?", parse);
				Text.NL();
				Text.Add("Layla simply shrugs in reply.", parse);
			}
			Text.NL();
			Text.Add("<i>“I can make the base swell too, if you want?”</i> she asks tentatively.", parse);
			Text.NL();
			Text.Add("She can? ...Right, of course she can. Almost mechanically, you tell her to go ahead, still trying to process what you’ve been shown.", parse);
			Text.NL();
			Text.Add("Layla focuses a bit and you watch as the distinct shape of a knot forms on the base of her shaft, growing big enough to tie any pussy she could shove that huge cock in.", parse);
			Text.NL();
			Text.Add("You stare at her transformed member in fascination, hardly believing what you’re seeing. You feel compelled to study it in more detail, but how far are you willing to go?", parse);
			Text.Flush();

			let licked = false;

			// [Examine][Touch][Lick]
			const options: IChoice[] = [];
			options.push({ nameStr : "Examine",
				func() {
					Text.Clear();
					Text.Add("You bend your head in closer, taking in every inch of Layla’s newly revealed girl-dick. As you thought, it’s a foot in length and two and a half inches thick. Aside from the knot now distending its base, it’s basically human in form. The biggest oddity about it - aside from its existence - is its color. Like Layla’s pussy, her cock is an indigo blue shade, darkening to a deep purple at the glans, rather like her clitoris.", parse);
					Text.NL();
					Text.Add("Once you have taken it in from every angle, you nod in satisfaction. You thank Layla for showing it to you.", parse);
					Text.NL();
					Text.Add("<i>“No problem!”</i> she replies with a smile.", parse);
					Text.NL();
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : "You’re not about to touch that, but you could always take a closer look.",
			});
			options.push({ nameStr : "Touch",
				func() {
					Text.Clear();
					Text.Add("Inquisitively, you reach out and take Layla by the dick. Your fingers wrap around its length, warm and throbbing in your hand. Layla gasps at your touch, a white bead of pre forming on the tip of her member.", parse);
					Text.NL();
					Text.Add("As close as you are to her, you can take in its color and shape as well. The velvet-smooth skin under your fingers is soft as silk. Aside from her magically appearing knot, its shape is that of a human phallus. It’s colored the same indigo blue as her pussy, with a glans that is the same dark purple as her clitoris.", parse);
					Text.NL();
					Text.Add("You tenderly pump your hand along her shaft twice for luck, and then let her go. You thank Layla for letting you examine it so closely.", parse);
					Text.NL();
					Text.Add("She pants a little, excitement apparent as the bead of pre on her tip slides down her length. <i>“Y-you’re welcome,”</i> she says, smiling nervously.", parse);
					Text.NL();
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Only one way to properly examine her...",
			});
			options.push({ nameStr : "Lick",
				func() {
					licked = true;
					Text.Clear();
					Text.Add("Determined to examine every aspect of Layla’s cock, you clasp her shaft in your fingers. The warm, soft flesh is velvety smooth against your palm, throbbing gently as you knead it tenderly between your digits.", parse);
					Text.NL();
					Text.Add("<i>“Ah!”</i> Layla cries out, curling her toes as her knees buckle, nearly throwing her off-balance.", parse);
					Text.NL();
					Text.Add("Ignoring Layla’s exclamation, you bend your head in closer. With hands and eyes so intimate with the phallus, you can see that her cock is perfectly human in shape, save for the knot. The glans is a dark purple color, like her clitoris, whilst the rest of her shaft is the indigo blue of her inner pussy.", parse);
					Text.NL();
					Text.Add("Closing your eyes, you inhale through your nose, flooding your senses with her scent. It’s a strange, enticing odor; it smells like her, but there’s a musk to it, deep and primal, that makes your blood race. Unable to resist, you flick out your [tongue] and caress the very tip of her glans, lapping up a bead of pre-cum awaiting your attention there.", parse);
					Text.NL();
					Text.Add("<i>“Oh!”</i> she moans. <i>“T-that felt good...”</i>", parse);
					Text.NL();
					Text.Add("You don’t answer her, having bigger things on your mind. Instead, you start to caress her cock with your tongue. The taste of her washes over your taste buds as your oral muscle glides across her shaft. Moans and whimpers echo in your ears as you relentlessly polish every inch of girlmeat you can reach.", parse);
					Text.NL();
					Text.Add("Only when her shaft is shining under a layer of your spittle do you open your eyes again, and let her go. Smacking your lips, you savor the last of her flavor. You thank her for allowing you to examine her like this.", parse);
					Text.NL();
					Text.Add("<i>“S-sure,”</i> she says, panting a bit. <i>“You’re welcome.”</i>", parse);
					Text.NL();
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : "That’s a really nice cock she has. You wonder what it would taste like...",
			});
			Gui.SetButtonsFromList(options, false, undefined);

			Gui.Callstack.push(() => {
				Text.Add("Pushing yourself off the ground and rising to your [feet], you dust yourself off and thank Layla for being honest about her little secret. Though, if she has any more surprises tucked away, you’d appreciate it if she told you about them now.", parse);
				Text.NL();
				Text.Add("Layla stops to think for a bit, before smiling and moving her tail so she can grab the tip. <i>“I have another, but this one is small,”</i> she says, focusing while the tip of her tail cracks open, revealing the distinct shape of a smaller penis within.", parse);
				Text.NL();
				Text.Add("Impulsively, you reach out and trail inquisitive fingers over it. Layla moans appreciatively as you stroke her second cock - as she said, this one is much smaller than the other, perhaps half of her primary dick’s size. Other than that, it seems to be identical.", parse);
				Text.NL();
				Text.Add("<i>“This one doesn’t produce the… the white juice though.”</i>", parse);
				Text.NL();
				Text.Add("Semen? She can’t cum from this other cock of hers?", parse);
				Text.NL();
				Text.Add("<i>“Well. I can cum, but it’s not ‘seamen’, it’s the pink juice!”</i> she explains.", parse);
				Text.NL();
				Text.Add("That’s... odd. But then, Layla is turning out to be pretty quirky in general. You consider asking her what she means by ‘juice’, but you don’t think she’d be able to answer you.", parse);
				Text.NL();
				Text.Add("<i>“Want to see it?”</i>", parse);
				Text.Flush();

				// [Yes][No][Taste]
				const options: IChoice[] = [];
				options.push({ nameStr : "Yes",
					func() {
						Text.Clear();
						Text.Add("<i>“Okay,”</i> she replies with a smile, wrapping her digits around her tail-cock and gently stroking it.", parse);
						Text.NL();
						Text.Add("You watch as she continue to caress the smaller penis, observing as her cheeks turn a slightly purplish hue. Finally, after a few more moments, she grunts, and you watch as a rope of clear-looking fluid shoots out of her tail-cock’s head and lands on the ground.", parse);
						Text.NL();
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Yes, if she doesn’t mind showing you.",
				});
				options.push({ nameStr : "No",
					func() {
						Text.Clear();
						Text.Add("<i>“Okay,”</i> she replies, shrugging.", parse);
						Text.NL();
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "It’s fine, she doesn’t have to.",
				});
				options.push({ nameStr : "Taste",
					func() {
						Text.Clear();
						Text.Add("<i>“Okay,”</i> she replies with a smile, moving her tail within your reach.", parse);
						Text.NL();
						Text.Add("Reaching out, you clasp her tailtip tenderly and lift it to your mouth. Opening up, you put the strange phallus inside and wrap your lips around it, starting to suckle. There’s a strange flavor of mint and spice as you do; ", parse);
						if (licked) {
							Text.Add("it’s definitely not the same taste as her regular pre-cum.", parse);
						} else {
							Text.Add("you’re pretty confident that this isn’t what her main cock tastes like at all.", parse);
						}
						Text.NL();
						Text.Add("<i>“Hng!”</i> Layla grunts, as her tail-cock spasms inside your maw, spewing a few ropes of spicy, mint tasting juice.", parse);
						Text.NL();
						Text.Add("The thick gelatinous goo floods your mouth, forcing you to swallow. It tastes... quite enticing, actually. It burns all the way down to your stomach, but it’s a pleasant burn, like a fine liquor. It fills your belly with warmth, a surge of heat that spreads along your body.", parse);
						Text.NL();
						let gen = "";
						if (player.FirstCock()) { gen += "Your [cocks] leap[notS] erect"; }
						if (player.FirstCock() && player.FirstVag()) { gen += ", and"; }
						if (player.FirstVag()) {
							if (player.FirstCock()) { gen += " your"; } else { gen += "Your"; }
							gen += " [vag] juices itself";
						}
						parse.gen = Text.Parse(gen, parse);
						Text.Add("It concentrates itself in your loins, a burning that makes you moan with need. [gen] as lust swirls through your veins. You pant heavily at the warmth inside of you.", parse);
						Text.NL();
						Text.Add("<i>“Did you like it?”</i> Layla asks innocently.", parse);
						Text.NL();
						Text.Add("It’s... got quite a kick.", parse);
						Text.NL();

						player.AddLustFraction(0.3);

						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Better, you want to taste it.",
				});
				Gui.SetButtonsFromList(options, false, undefined);

				Gui.Callstack.push(() => {
					Text.Add("She’s just full of surprises, isn’t she? What else can she do? You ask curiously.", parse);
					Text.NL();
					Text.Add("<i>“I can also make my breasts grow too, or my butt,”</i> she happily declares, visibly willing her breasts to increase a cup, and her butt to become fuller.", parse);
					Text.NL();
					Text.Add("You watch her newly voluptuous curves jiggle slightly as she poses. That’s quite a feat.", parse);
					Text.NL();
					Text.Add("<i>“Oh, and if you want you can push your fingers inside my nipples.”</i> She demonstrates by pressing a digit against one of her erect nubs and pushing in.", parse);
					Text.NL();
					Text.Add("The sight makes your eyes widen. Without thinking, you blurt out a question, asking if that doesn’t hurt.", parse);
					Text.NL();
					Text.Add("<i>“No. It feels a bit strange, but it’s kinda like when you were touching my vagina,”</i> she says, moving her finger in and out. <i>“You want to try?”</i>", parse);
					Text.Flush();

					// [Yes][No][Taste]
					const options: IChoice[] = [];
					options.push({ nameStr : "Yes",
						func() {
							Text.Clear();
							Text.Add("She's okay with that?", parse);
							Text.NL();
							Text.Add("Layla nods and thrusts her chest out.", parse);
							Text.NL();
							Text.Add("You can’t possibly refuse this invitation. Inquisitively, you reach out with both hands. With one hand, you take her breast and hold it steady. With the other, you press the very tip of your index finger against her nipple.", parse);
							Text.NL();
							Text.Add("There is a slight resistance, the dark gray pearl deforming a little under your pressure. And then it opens up, allowing you to slip inside. You almost withdraw on instinct, but Layla reaches out with her hand and gently places it on your own.", parse);
							Text.NL();
							Text.Add("Feeling reassured, you steel yourself and start to push your finger deeper. Warm, wet flesh envelops it, pulsing gently with the chimera’s heartbeat. Slick juices ooze across your digit as you slide deeper inside, carefully turning your wrist and curling your knuckle.", parse);
							Text.NL();
							Text.Add("The chimera hums lightly as you finger her nipple.", parse);
							Text.NL();
							Text.Add("Squirming walls ripple and squeeze, drawing you deeper and deeper inside of her. Your advance only stops when you’ve hilted your finger. You experimentally twist your hand back and forth, as if turning a key, which elicits a soft coo from the chimera.", parse);
							Text.NL();
							Text.Add("You can’t help but shake your head at the strangeness of Layla’s body. Satisfied with your hands-on investigation, you start trying to extract your finger. In response, Layla’s boob-pussy grips down on you, making you have to fight to move at all. You shoot Layla a look, and receive an innocent smile in return. Still, the grip does loosen, allowing you to pull yourself free without too much effort.", parse);
							Text.NL();
							Text.Add("Flicking your wrist to clear off some of her juices from your finger, you tell Layla that you appreciate the demonstration.", parse);
							Text.NL();
							Text.Add("<i>“No problem,”</i> she smiles.", parse);
							Text.NL();
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip : "Well, if she’s really okay with it...",
					});
					options.push({ nameStr : "No",
						func() {
							Text.Clear();
							Text.Add("You politely decline.", parse);
							Text.NL();
							Text.Add("<i>“Okay.”</i> She shrugs.", parse);
							Text.NL();
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip : "You’d rather not, thanks for the offer.",
					});
					options.push({ nameStr : "Taste",
						func() {
							Text.Clear();
							Text.Add("You have something more interesting to stick in there than a finger, if she’s okay with that?", parse);
							Text.NL();
							Text.Add("<i>“Okay...”</i> she says, eyeing you curiously and thrusting her chest out.", parse);
							Text.NL();
							Text.Add("Closing the distance between you, you reach out to clasp your hands upon one of the chimera’s newly inflated breasts. Experimentally, you lightly massage it, but whatever strange internal magic let her enhance them hasn’t altered the texture. It’s the same delightful squishiness as before.", parse);
							Text.NL();
							Text.Add("Smiling at Layla’s appreciative coo, you bring your head in closer. Your mouth opens and you extend your [tongue], running it over the dark gray button in front of you. After a few swipes, you start to press against Layla’s nipple with your [tongueTip], pushing as hard as you can.", parse);
							Text.NL();
							Text.Add("The sensation as her nipple opens up before the pressure is impossible to describe. You can feel yourself sinking inside of her, a slick wetness greeting your probing tongue. Walls of flesh ripple against the surface of your invading muscle, kneading and squeezing you as you are drawn further in.", parse);
							Text.NL();
							Text.Add("The taste of her washes over you, flooding your senses. It’s like mint and spice, a taste that sends warmth coursing down your throat to explode in your belly. It’s enticing, almost intoxicating...", parse);
							Text.NL();
							Text.Add("Hungrily, you thrust your [tongue] as deep into Layla’s nipplecunt as you can, twirling your tongue around inside. You caress her walls in all directions, relishing the taste of her strange, delicious goo as it tickles your taste buds.", parse);
							Text.NL();
							Text.Add("Layla pants above, moaning as you probe her mounds. She hugs you close, not pulling you into her breast, but merely supporting you as you continue to lick. Movement becomes easier as your tongue becomes coated in her breast-juice, and you’re dimly aware that she seems wetter inside...", parse);
							Text.NL();
							parse.gender = Gender.Noun(player.Gender());
							Text.Add("Enticed by the noises and the taste, you lick and lap like a [gender] possessed. Your tongue twirls and writhes, undulating as you slurp upon her gooey interior. The slime grows thicker and heavier as you suckle and tongue-fuck the perverse orifice, almost overwhelming your senses.", parse);
							Text.NL();
							Text.Add("<i>“I-It’s coming!”</i> Layla warns you, groaning in pleasure.", parse);
							Text.NL();
							Text.Add("Well, what kind of person would you be if you backed out now? Resolutely, you continue your assault, tonguing her as deeply as you possibly can. The chimera cries out sharply, wrapping her arms around your head and pressing you closer. Her bosom quakes wildly, a great gush of fluids spurting onto your [tongue], giving you a mouthful to gulp down greedily.", parse);
							Text.NL();
							Text.Add("Weirdly, her other breast shows no sign of cumming, despite your oral assault. Likewise, you don’t feel anything happen down below. Her cock throbs urgently, oozing thick drops of pre-cum, but there’s no climax down there.", parse);
							Text.NL();
							Text.Add("You twirl your tongue one last time inside Layla, and she groans deeply at the sensation. Her nipple squeezes your [tongue], but only playfully, not enough to keep you from gliding your sensitive muscle free.", parse);
							Text.NL();
							Text.Add("Smacking your lips, you savor the lingering flavor. Smiling, you compliment Layla on her taste; her breasts are really something else.", parse);
							Text.NL();
							Text.Add("Layla giggles at your compliment. <i>“Thank you!”</i>", parse);
							Text.NL();

							player.AddLustFraction(0.5);

							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip : "You have something more interesting to stick in there than a finger, if she’s okay with that?",
					});
					Gui.SetButtonsFromList(options, false, undefined);

					Gui.Callstack.push(() => {
						Text.Add("So… is that everything or does she have something else she needs to show you?", parse);
						Text.NL();
						Text.Add("Layla taps her chin with a claw for a moment, then shakes her head. <i>“That’s all.”</i>", parse);
						Text.NL();
						Text.Add("Well... this has been quite a lot to digest, but you thank Layla for her honesty. Though... why didn’t she tell you about any of this before?", parse);
						Text.NL();
						Text.Add("The she-chimera shrugs.", parse);
						Text.NL();
						Text.Add("Well, you suppose it makes sense. She doesn’t really know what is or isn’t odd, after all. It probably never occurred to her that her little secrets would be a surprise to you. Casting about for a new topic, your gaze is drawn to her primary cock. It’s still jutting out proudly, a bead of pre-cum welling from its tip before gravity drags it to the ground below.", parse);
						Text.NL();
						Text.Add("Layla follows your gaze and smiles nervously. <i>“Umm...”</i> she says, biting her lower lip.", parse);
						Text.NL();
						Text.Add("What is it?", parse);
						Text.NL();
						Text.Add("<i>“Can it be my turn now?”</i>", parse);
						Text.NL();
						Text.Add("Looking at the hopeful, strangely innocent gleam in her eyes, you wonder what you should say to that...", parse);
						Text.Flush();

						TimeStep({minute: 30});

						// [Hell yeah!] [Sure] [Later]
						const options: IChoice[] = [];
						const getfucked = () => {
							Text.Clear();
							Text.Add("<i>“Thanks! So where should I...”</i> She smiles nervously.", parse);
							Text.Flush();
							// [Ass][Vagina]
							const options: IChoice[] = [];
							if (player.FirstVag()) {
								options.push({ nameStr : "Pussy",
									func() {
										Text.Clear();
										Text.Add("Well, it’s only right she learns what it’s like to be on the other side of vaginal.", parse);
										Text.NL();
										Text.Add("<i>“Okay!”</i> she replies excitedly.", parse);
										Text.NL();

										LaylaScenes.SexCatchVaginal();
									}, enabled : true,
									tooltip : "Well, it’s only right she learns what it’s like to be on the other side of vaginal.",
								});
							}
							options.push({ nameStr : "Ass",
								func() {
									Text.Clear();
									Text.Add("You think she should learn about the pleasures of anal, if she’s going to practice pitching.", parse);
									Text.NL();
									Text.Add("<i>“Okay!”</i> she replies excitedly.", parse);
									Text.NL();

									LaylaScenes.SexCatchAnal();
								}, enabled : true,
								tooltip : "You think she should learn about the pleasures of anal, if she’s going to practice pitching.",
							});
							Gui.SetButtonsFromList(options, false, undefined);
						};

						options.push({ nameStr : "Hell yeah!",
							func : getfucked, enabled : true,
							tooltip : "After finding out she has all these fun bits for you to play with, how could you say no!",
						});
						options.push({ nameStr : "Sure",
							func : getfucked, enabled : true,
							tooltip : "It’s only fair she gets her chance too. Plus you’d be a failure as a teacher if you didn’t teach her how to pitch too.",
						});
						options.push({ nameStr : "Later",
							func() {
								Text.Clear();
								Text.Add("<i>“Oh? Sure,”</i> she replies with a smile.", parse);
								Text.NL();
								Text.Add("The chimera has one last trick up her sleeve, or so it seems. As you watch, her erection falters, her cock going limp between her thighs. Like a fat, wet noodle, it is slurped back up inside her slit. Once it’s fully in, her slit presses together and vanishes until she is as smooth-groined as any human woman.", parse);
								Text.NL();
								Text.Add("Her tail swishes, drawing your attention, and you watch as her tail-cock vanishes once more. Like a bud opening into a flower, only in reverse. Once it is gone, her tail drops back down to the ground.", parse);
								Text.NL();
								Text.Add("Layla looks at you inquisitively. <i>“Something wrong?”</i>", parse);
								Text.NL();
								Text.Add("You hasten to assure her that everything’s fine, shaking your head at the question. You explain that you were just surprised to see her do that; most people can’t get rid of erections that easily.", parse);
								Text.NL();
								Text.Add("<i>“Oh.”</i> She giggles. <i>“Let’s do something else!”</i>", parse);
								Text.Flush();

								LaylaScenes.Prompt(false);
							}, enabled : true,
							tooltip : "You’re still digesting all she’s told you. Another time, maybe?",
						});
						Gui.SetButtonsFromList(options, false, undefined);
					});
				});
			});
		});
	}

	export function SexCatchAnal() {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		let parse: any = {
			playername : player.name,
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);

		if (layla.sexlevel >= 3) {
			Text.Add("Layla wraps her tail around your midriff, pulling you down on fours as she circles you. One of her hands moves between your legs to ", parse);

			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				Text.Add("gently massage your labia.", parse);
			}, 1.0, () => player.FirstVag());
			scenes.AddEnc(() => {
				Text.Add("stroke[oneof] your [cocks].", parse);
			}, 1.0, () => player.FirstCock());
			scenes.AddEnc(() => {
				Text.Add("fondle your balls, testing their weight.", parse);
			}, 1.0, () => player.HasBalls());

			scenes.Get();
			Text.NL();
			Text.Add("You coo quietly in pleasure, arching your back as Layla’s hands toy with your nethers. Taking your posture as an invitation, the chimera lowers herself atop you. Her weight settles itself along your spine, full breasts crushed against your back. Something warm and wet glides lovingly along the back of your neck, sending tingles racing across your [skin].", parse);
			Text.NL();
			Text.Add("Satisfied with the small bit of foreplay, Layla asks, <i>“How do you want me to prepare you?”</i>", parse);
			Text.Flush();

			// [Tail fuck][Lick’n suck][Blow her]
			const options: IChoice[] = [];
			options.push({ nameStr : "Tail fuck",
				func() {
					Text.Clear();
					parse.t = player.HasLegs() ? "thigh" : "midriff";
					Text.Add("<i>“Okay!”</i> Layla replies cheerfully, getting off your back and moving her tail to encircle your [t].", parse);
					Text.NL();
					Text.Add("Your [skin] tingles as Layla’s own smooth, sleek skin glides over it. The weight of her tail drapes itself over your [butt]. A coil of muscle curls around your cheeks, squeezing in rhythmic clenches, kneading your flesh. Even as the chimera squeezes your ass, you can feel the tip of her tail grinding against your canyon.", parse);
					Text.NL();
					Text.Add("The coiled appendage releases you, allowing Layla’s tail to tenderly spread your cheeks. The softly pointed tip grinds itself against your [anus], making you groan with longing. The chimera is in no hurry, however; she just keeps up her leisurely massage of your hole. Only when you try to flex your muscles and draw her in does her tail withdraw.", parse);
					Text.NL();
					Text.Add("Somehow, the sound of Layla’s tail splitting open to disgorge its hidden secret is audible even over your racing heartbeat. A quiver runs along your spine, tingling under your [skin] as the first drops of warm pseudo-pre splash upon your sensitive pucker.", parse);
					Text.NL();
					Text.Add("You can feel the touch of her tail-cock’s mushroom-shaped tip, wet and warm. A jolt runs up your spine, but you force yourself to relax as another drop of her warm juices falls on your [anus]. The moment she feels you’ve relaxed a bit, she presses on.", parse);
					Text.NL();

					Sex.Anal(layla, player);
					player.FuckAnal(player.Butt(), layla.FirstCock(), 1);
					layla.Fuck(layla.FirstCock(), 1);

					Text.Add("A groan of pleasure wrings itself from your throat as you feel your [anus] spreading itself wide to receive the chimera’s alien phallus. Thick juices ooze over your interior, drooling from her tail-cock like a leaky faucet, and each inch pushed inside sends them cascading down into your bowels.", parse);
					Text.NL();
					Text.Add("From deep inside you, a warmth begins to bloom, swelling in your belly and flowing out into your limbs. Your whole body trembles with need, quivers with desire. There is no pain, only a wondrous, intoxicating sensation of being filled. Even as Layla hilts herself, the fleshy lips of her tail perversely kissing your anus, her cock pouring its juices inside of you, you plead for her to give you more.", parse);
					Text.NL();
					Text.Add("Without missing a beat, your chimeric lover begins to pump herself into you, twisting and turning in the way only she can to grant you maximum pleasure. Looking over your shoulder, you watch as she massages her breasts, sticking her fingers inside her own nipples and moaning in pleasure.", parse);
					Text.NL();
					parse.c = player.FirstCock() ? " grinding against your prostate and" : "";
					Text.Add("In what feels like mere heartbeats, Layla has you moaning like a whore. Each thrust and pump stirs your innards,[c] overwhelming you with pleasure. You thrust your [hips] back, anxious to be filled, and do your best to thank Layla by milking her tail-cock for all you’re worth.", parse);
					Text.NL();
					Text.Add("Layla grunts and moans quietly as she plows you relentlessly. A strangled whimper of pleasure precedes a particularly fierce thrust into your ass. She cums in a great jet of hot wetness, the sensation making you squeal in delight. Thick gouts of lubing goo fill your belly, packing you deliciously full and yet leaving you aching for more.", parse);
					Text.NL();
					Text.Add("You want her to fill you to the brim, to feel your stomach distending under the sheer volume of her she-cum. No sooner has the thought processed than she abruptly jerks her cock free. She lets her last spurts of mock-semen rain down upon your ass, flowing like a waterfall through your buttock cleavage.", parse);
					Text.NL();
					Text.Add("You groan slightly in disappointment, then shake your head and chuckle. She sure likes a mess, doesn’t she?", parse);
					Text.NL();
					Text.Add("<i>“Sorry,”</i> she replies with an apologetic smile.", parse);
					Text.NL();
					Text.Add("You click your tongue and assure her that she’s got nothing to apologize for. A little mess is just part and parcel of good sex. Now, is she going to give you her dick, like you asked? Or is she just going to stand around like a bumpkin and gawk at your juice-splattered bum, hmm? You throw a playful wink over your shoulder for extra emphasis.", parse);
					Text.NL();
					Text.Add("<i>“Calm down,”</i> Layla says, giggling softly. <i>“I’ll put it in now.”</i> She grabs your [hips] and scoots over, approaching you as she lets her limp member out to drape over your [butt].", parse);
					Text.NL();
					Text.Add("You moan in anticipation, thrusting your butt back to encourage the chimera to speed it up.", parse);
					Text.NL();
					Text.Add("Giggling, Layla wills her cock to harden, letting her rock-hard member slide into the valley of your ass. She pulls back until her tip is aligned with your entrance and asks, <i>“Ready?”</i>", parse);
					Text.NL();
					Text.Add("You assure her that you’re ready.", parse);
					Text.NL();
					Text.Add("<i>“Okay!”</i> she says, pushing forward.", parse);
					Text.NL();
					Text.Add("A huge moan of pleasure rushes from your lungs as Layla sinks into you. Despite the considerable difference in sizes between her cocks, there is almost no effort on her part. The thick lubing slime she filled you with ensures that you spread effortlessly before her advancing member.", parse);
					Text.NL();

					Sex.Anal(layla, player);
					player.FuckAnal(player.Butt(), layla.FirstCock(), 3);
					layla.Fuck(layla.FirstCock(), 3);

					if (player.sexlevel >= 5) {
						Text.Add("Of course, the fact that you actually know your way around lovemaking always helps. You angle yourself just right and clench in the right spots to make this as pleasurable as you can for both of you.", parse);
						Text.NL();
					}
					Text.Add("<i>“So warm,”</i> Layla says, humming in pleasure as she grinds her hips into your accepting anus.", parse);
					Text.NL();
					Text.Add("Yeah, her too, you moan in response, clenching your ass in order to savor every inch of flesh grinding through your passage.", parse);
					Text.NL();
					Text.Add("<i>“Let’s begin!”</i>", parse);
					Text.NL();

					LaylaScenes.SexCatchAnalCont(parse);
				}, enabled : true,
				tooltip : "That sweet little tail-cock of hers is just made for delivering its own special brand of lube. You want her to put it to work.",
			});
			if (layla.sexlevel >= 5) {
				options.push({ nameStr : "Lick’n suck",
					func() {
						Text.Clear();
						Text.Add("<i>“Okay!”</i> she exclaims happily, moving to grope your [butt].", parse);
						Text.NL();
						Text.Add("You arch your back, cooing appreciatively as the chimera’s skilled fingers tenderly caress your ass cheeks. She squeezes you lightly, kneading your butt, and then lovingly spreads your buttocks apart.", parse);
						Text.NL();
						Text.Add("Layla licks her lips at the sight of your puckered hole, and proceeds to trail her tongue along your taint without a hint of hesitation.", parse);
						Text.NL();
						let gen = "";
						if (player.FirstCock()) { gen += "your [cocks] achingly hard "; }
						if (player.FirstCock() && player.FirstVag()) { gen += "and "; }
						if (player.FirstVag()) { gen += "your [vag] squeeze "; }
						parse.gen = Text.Parse(gen, parse);
						Text.Add("You squirm at the sensation, moaning softly at the feel of her warm, wet flesh sliding so intimately against your own. The perversity of the act only adds to the thrill coursing through you, making [gen]with anticipation.", parse);
						Text.NL();
						Text.Add("As she laps at your [anus] with gusto, you watch her tail tip enter your field of vision. Looks like it’s time you got started on your end as well.", parse);
						Text.NL();
						Text.Add("Reaching out with one hand, you gently clasp your fingers around the end of the long, reptilian appendage. Squeezing it gently, you bring the tip in close, nuzzling it affectionately.", parse);
						Text.NL();
						Text.Add("You open your mouth, extend your [tongue] and curl it around the tip of Layla’s tail, lazily lapping at it in tantalizing strokes. Her tail tip is still closed tight, but you’ll fix that. You wrap your lips around it, lovingly suckling the soon-to-be source of bliss. A mischievous idea crosses your mind, and you decide to gently nibble on the tip of her tail.", parse);
						Text.NL();

						Sex.Blowjob(player, layla);
						player.FuckOral(player.Mouth(), layla.FirstCock(), 1);
						layla.Fuck(layla.FirstCock(), 1);

						Text.Add("<i>“Ah!”</i> Layla yelps as you gently bite her tail tip. The long appendage squirms in your grasp, and Layla’s lapping grows increasingly erratic. <i>“Ahn! [playername]!”</i> she moans.", parse);
						Text.NL();
						Text.Add("What is it? You ask her, stopping your nibbling for a moment.", parse);
						Text.NL();
						Text.Add("<i>“I can’t open it with you nibbling on it.”</i>", parse);
						Text.NL();
						Text.Add("Chuckling, you apologize and tell her to give it to you then. No sense in holding back on your account, after all.", parse);
						Text.NL();
						Text.Add("<i>“Okay,”</i> she replies with a smile.", parse);
						Text.NL();
						Text.Add("You watch in delight as Layla’s tail tip splits open, fleshy lips peeling back like a blossoming flower to reveal the shiny, wet shape of her hidden cock. Its purple head oozes a growing bead of translucent goo, not yet big enough to fall from its tip.", parse);
						Text.NL();
						Text.Add("Before it can grow any bigger, you extend your [tongue] and lap it up. It might be just a small bead, but you can already feel the warmth spreading over your tongue as you begin licking her shaft, lavishing on it as much attention as Layla did on your [anus].", parse);
						Text.NL();
						Text.Add("<i>“Ahn!”</i> the chimera moans in pleasure, before recollecting herself and returning to her task. No longer satisfied with simply licking around your puckered hole, she decides to finally get to work and penetrate you with her long, sinuous tongue.", parse);
						Text.NL();
						Text.Add("The feeling is simply amazing. It sends a tingle of pleasure coursing throughout your body. The sensation of having your back door licked in such a unique way, combined with the warmth spreading from Layla’s tail-cock juices, is nearly enough to make you climax right there and then.", parse);
						Text.NL();
						parse.c = player.FirstCock() ? ", sometimes even brushing across your prostate," : "";
						Text.Add("Layla herself cannot stop moaning as she probes your behind. Her tongue wiggles and curls[c] as her tail begins struggling against your grip.", parse);
						Text.NL();
						Text.Add("Groaning in pleasure, you release her and moan around her dick as she begins face-fucking you with her tail-cock. In this position, all you have to do is focus on sucking her as she licks your ass and pumps your mouth full of tasty aphrodisiac. This is heaven...", parse);
						Text.NL();
						Text.Add("Dimly, you note that Layla’s dick is throbbing in your mouth. She should be getting close now. Soon, you’ll have a nice serving of refreshing tail-juice to drink down. Maybe you’ll even get to cum yourself.", parse);
						Text.NL();
						Text.Add("However, your train of thought is interrupted as she suddenly pulls out of your mouth with a pop, a thin rope of her juices shooting out to splash against your cheek as you turn to look back at her. The feeling of emptiness in your maw is only rivaled by the emptiness you suddenly feel inside your [anus] as Layla withdraws her tongue as well.", parse);
						Text.NL();
						Text.Add("You’re about to start voicing your protest when you spot the contrasting blue of her main cock, already hard and dripping. You had almost forgotten what you were really after.", parse);
						Text.NL();
						Text.Add("Layla grabs her member, aiming her tail-cock at her own open mouth and thrusting in. She sucks noisily, working to finish herself off as she finally cums out of her tail-end. The first jet goes inside her maw, the second jet hits her on perky breasts, and the rest falls onto her intended target - her own dick.", parse);
						Text.NL();
						Text.Add("She uses her hands to quickly spread the juices across it, making for an effective layer of lube as she covers it with her own tail-spunk. You return to your position, willing yourself to relax in preparation for what’s to come.", parse);
						Text.NL();
						Text.Add("Her hands settle on your hips, and you feel her tail-cock slap noisily in your butt cleavage. It wiggles a little before it finds purchase in your [anus] and enters you with an audible slurp. Layla pumps her tail inside you a few times before she manages to creampie you with a fresh helping of tail-juice.", parse);
						Text.NL();
						Text.Add("Warmth, lewd, wet, and sticky fluid floods through your guts, eliciting a blissful moan from you. A perverse squelch echoes in your ears as the chimera’s tail withdraws. Fat beads of lube-goo rain down upon your buttocks, shortly before elegant, claw-tipped fingers give them an appreciative squeeze. You know that Layla has stepped forward, aligning her real dick with your entrance.", parse);
						Text.NL();
						Text.Add("<i>“Ready?”</i> she asks.", parse);
						Text.NL();
						Text.Add("If you weren’t ready before, you certainly are now. You look back and nod at her to continue.", parse);
						Text.NL();
						Text.Add("As soon as you give her the go-ahead, she starts pushing into your [anus]. You arch your back, heaving forth a great sigh of desire as you are impaled. Thanks to the generous lubing your lover has given you, there is only utter bliss as inch after inch vanishes into your rapidly stretching tunnel.", parse);
						Text.NL();

						Sex.Anal(layla, player);
						player.FuckAnal(player.Butt(), layla.FirstCock(), 3);
						layla.Fuck(layla.FirstCock(), 3);

						Text.Add("You swear you can hear your flesh shift as it is displaced around the huge intruder advancing relentlessly as it glides within. When Layla’s hips connect, audibly slapping against your butt, it’s all you can do to hold back a groan of disappointment.", parse);
						Text.NL();
						Text.Add("<i>“Warm,”</i> Layla giggles, lying down upon your back to hug you from behind.", parse);
						Text.NL();
						Text.Add("So is she, you reply absently, squeezing down on her dick.", parse);
						Text.NL();
						Text.Add("<i>“Okay! Let’s start!”</i>", parse);
						Text.NL();

						player.slut.IncreaseStat(80, 1);

						LaylaScenes.SexCatchAnalCont(parse);
					}, enabled : true,
					tooltip : "That long tongue of hers is just too sweet to pass up. Please, you want her to lick you until you’re wet enough to fuck. You’ll take care of her tail for her, too.",
				});
			}
			options.push({ nameStr : "Blow her",
				func() {
					Text.Clear();
					Text.Add("<i>“Okay!”</i> she says enthusiastically, circling around to sit down before you. She spreads her legs, giving you a perfect view of her throbbing maleness and her sopping wet pussy, then supporting herself on her hands, thrusts her chest out proudly as she waits for you to begin.", parse);
					Text.NL();
					Text.Add("No further words are needed. As quickly as you can, you lower yourself between her legs, resting on your belly with your head level with her loins. Beads of pre-cum bubble from her tip, glimmering like perverse pearls as they slide down her shaft, a sight that makes you lick your lips in anticipation.", parse);
					Text.NL();
					Text.Add("Without preamble, you open your mouth and lean forward. Your [tongue] darts out, letting you savor a taste of her pre-cum, and then your lips wrap themselves around the purple flesh of her mushroom-shaped head.", parse);
					Text.NL();
					LaylaScenes.SexCatchAnalBlowher(parse);
				}, enabled : true,
				tooltip : "If she’ll just present her cock to you, you’ll take care of getting it lubed up.",
			});
			Gui.SetButtonsFromList(options, false, undefined);
		} else {
			Text.Add("Seeing that the chimera looks a little uncertain, you decide to step in and give her a hand. In a gentle tone, you instruct her to sit down and spread her legs for you.", parse);
			Text.NL();
			Text.Add("Layla smiles softly and nods once, then complies, sitting on her round butt and spreading her legs. Her hands move back to support her, causing her chest to thrust out. <i>“Like this?”</i>", parse);
			Text.NL();
			Text.Add("That’s just perfect, you assure her. With deliberate patience, you close the distance between you, lying down upon your stomach between Layla’s thighs. Her foot-long cock juts toward the sky like an accusing finger, her pussy beneath opening and squeezing shut.", parse);
			Text.NL();
			Text.Add("Even though Layla’s demeanor doesn’t change, you can hear it when her breathing quickens. Her throbbing cock seems to be synchronized with the accelerated beating of her heart. A bead of pre slides down along her length, and she swallows audibly.", parse);
			Text.NL();
			Text.Add("Playfully, you chide the chimera, telling her to be patient; you’ll get to her in a moment. Your fingers curl around her shaft, feeling the soft, warm flesh in your grasp. You stroke your hand along her length. As you do, you explain to her that you just wanted to appreciate this very pretty cock of hers properly first.", parse);
			Text.NL();
			Text.Add("A soft moan echoes from above you, bringing a smile to your lips. With slow, deliberate movements, you release the chimera’s cock and extend your [tongue]. Bending closer, you lick from the very base of her shaft to her glans, trailing upwards in a single gliding motion.", parse);
			Text.NL();
			Text.Add("You smack your lips, perversely savoring the taste of her. Then, you open your mouth and bend down to engulf her glans.", parse);
			Text.NL();
			LaylaScenes.SexCatchAnalBlowher(parse);
		}
	}

	export function SexCatchAnalBlowher(parse: any) {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		Text.Add("Layla’s flavor washes intensely over your tongue, and you shut your eyes to better focus on the taste. Inch by inch, you glide down her length, swallowing her shaft.", parse);
		Text.NL();
		Text.Add("A tickle in the back of your throat lets you know how far you’ve come, but when you open your eyes there is still so much more to take. Inhaling through your nose, you close your eyes again and press on.", parse);
		Text.NL();
		if (player.sexlevel >= 5) {
			Text.Add("As practiced as you are, you don’t really have a gag reflex anymore. Layla’s cock glides smoothly down your throat without a hitch, allowing you to gulp her down to the very hilt without even trying.", parse);
		} else if (player.sexlevel >= 3) {
			Text.Add("With your experience, you know how to relax your throat to allow the chimera’s cock smooth access. It’s not perfect, you still gag a little, but you’ve taken her to the hilt before long.", parse);
 		} else {
			Text.Add("Fighting your gag reflex all the way, you try and swallow Layla to the hilt. As her member invades your throat, you choke and cough. You have to force it down, inch by near-painful inch. Tears leak out from underneath your eyelids, but finally you have it all inside of you, stretching out your gullet.", parse);
 		}
		Text.NL();
		parse.sl = player.sexlevel < 3 ? " despite your inexperience" : "";
		Text.Add("The chimera moans in blissful pleasure as your throat muscles ripple along her shaft, working to milk her[sl].", parse);
		Text.NL();
		Text.Add("You hold Layla’s cock inside your throat for a few moments, letting your warmth wash over her, and then pull your head back. When only the tip remains inside of your mouth, you stop your retreat. Lips curled around the sensitive flesh, you suckle teasingly, caressing Layla’s glans and cumslit with your [tongueTip].", parse);
		Text.NL();
		Text.Add("The taste of her pre-cum, salty-sweet, washes over your [tongue], but you control yourself. Rather than swallowing, you let it pool at the bottom of your mouth, focusing on teasing forth more with lips and tongue. Soon, a sizeable puddle is floating inside your maw, swishing back and forth around your teeth, and you judge it sufficient.", parse);
		Text.NL();
		Text.Add("Moving deliberately, you release the chimera’s member and withdraw, allowing her pre-cum to pour slowly down over her phallus. You tilt your head, pouring from different angles, meticulously drenching her cock in her own pre. With your fingertips, you smear the oozing rivulets across her turgid flesh, Layla’s appreciative coos echoing in your ears.", parse);
		Text.NL();
		Text.Add("Eventually, you release her and lean back, declaring that she looks ready.", parse);
		Text.NL();
		if (layla.sexlevel < 2) {
			Text.Add("<i>“Okay...”</i> she stays in position, panting lightly as her cock continues to throb. <i>“So… umm...”</i>", parse);
			Text.NL();
			Text.Add("You smile to yourself and give a shake of your head. Patiently, you shift your position to one better suited for being entered. As you reach back and spread your butt cheeks, you tell Layla that now is the time for her to go behind you and penetrate you.", parse);
			Text.NL();
			Text.Add("<i>“Okay!”</i> she replies enthusiastically, scrambling to her feet and circling around.", parse);
		} else {
			Text.Add("<i>“Can I go now?”</i> Layla asks, panting lightly.", parse);
			Text.NL();
			Text.Add("She most certainly can, you reply, assuming the proper position for her to mount you. Once settled, you reach back and take hold of your butt cheeks, spreading them to give her easy access.", parse);
			Text.NL();
			Text.Add("<i>“Okay!”</i> she replies excitedly, scrambling to her feet and scampering into position.", parse);
		}
		Text.NL();
		Text.Add("Layla’s hands settle on your [hips] and she presses her tip against your [anus]. You release your butt cheeks and brace yourself, as Layla begins pressing in.", parse);
		Text.NL();
		Text.Add("You moan and arch your back, feeling your [anus] spreading wide around the substantial girth of chimera cock entering you. As lubed as she is, you can still feel every inch of thick, throbbing flesh as it stretches you open, gliding deeper inside.", parse);
		Text.NL();

		Sex.Anal(layla, player);
		player.FuckAnal(player.Butt(), layla.FirstCock(), 3);
		layla.Fuck(layla.FirstCock(), 3);

		Text.Add("<i>“Let’s begin!”</i>", parse);
		Text.NL();

		LaylaScenes.SexCatchAnalCont(parse);
	}

	export function SexCatchAnalCont(parse: any) {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		Text.Add("Layla starts with shallow thrusts, letting herself build up momentum as she slowly begins to pump longer and harder with each movement.", parse);
		Text.NL();
		let gen = "";
		if (player.FirstCock()) { gen += "your [cocks] dripping pre-cum "; }
		if (player.FirstCock() && player.FirstVag()) { gen += "and "; }
		if (player.FirstVag()) { gen += "your [vag] oozing nectar "; }
		parse.gen = Text.Parse(gen, parse);
		Text.Add("You moan in bliss; the feeling of [gen]onto the ground beneath you is simply sublime. Unable to contain your lust, you start to thrust back, doing your best to meet the chimera pump for pump in the rhythm she is setting. Your [anus] grips and releases, clenching and shifting as you try to milk Layla’s cock.", parse);
		Text.NL();
		parse.t = player.HasTail() ? "tail" : "lower back";
		Text.Add("Your chimera lover leans over you, gently caressing your [t].", parse);
		Text.NL();
		Text.Add("As shapely feminine arms lock themselves around your [belly], a shiver of anticipation runs along your spine. In a powerful surge of motion, Layla drives her cock forcefully into you, the sheer power making you gasp in shock. Without relenting, she pounds at your ass, making you moan and squirm, and then she pulls back. So over-excited is she that the momentum is greater than she anticipated; her dick pops free of your [anus] like a cork from a champagne bottle. Your balance thrown off by the sudden withdrawal, you tumble to the ground, rolling over onto your back.", parse);
		Text.NL();
		Text.Add("Layla wastes no time waiting for you to recover; she crawls over you, aligning herself back with your [anus], and re-enters you with a brutal thrust.", parse);
		Text.NL();
		Text.Add("Breath rushes from your lungs in a deep-throated moan. You arch up like a fish on a hook, twisting as the sensations from being used so roughly surge through your brain, melting your consciousness and leaving you reeling in pleasure.", parse);
		Text.NL();
		Text.Add("She continues to pump, leaning over to lick one of your [nips], sucking on it as she moans wantonly.", parse);
		Text.NL();

		if (player.sexlevel >= 2) {
			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				Text.Add("Layla suddenly lifts her head, a thin strand of saliva linking her lips to your nipple. <i>“C-can I kiss you?”</i> she asks, panting as she looks at you with lustful, loving eyes.", parse);
				Text.Flush();

				// [Yes][No]
				const options: IChoice[] = [];
				options.push({ nameStr : "Yes",
					func() {
						Text.Clear();
						Text.Add("She leans in toward you, caressing your cheek, as she wraps your lips in a passionate kiss, thrusting her tongue inside and exploring your mouth as her flexible organ digs ever closer to your throat.", parse);
						Text.NL();

						LaylaScenes.SexCatchAnalCont2(parse, true);
						Text.Flush();
					}, enabled : true,
					tooltip : "Of course she can kiss you.",
				});
				options.push({ nameStr : "No",
					func() {
						Text.Clear();
						if (layla.sexlevel >= 3) {
							Text.Add("<i>“Then... would you like my tail instead?”</i>", parse);
							Text.Flush();

							// [Yes][No]
							const options: IChoice[] = [];
							options.push({ nameStr : "Yes",
								func() {
									Text.Clear();
									Text.Add("She smiles and turns her attention back to your nipples, gently biting, forcing a moan out of you as the pain mixes with pleasure. Her tail enters your field of vision, and you watch as it splits open, a single drop of its tasty juices landing on your lips.", parse);
									Text.NL();
									Text.Add("Without thinking, your tongue sweeps over your lips, savoring the warming minty taste of her goo. With no hesitation, you open as wide as you can, welcoming the chimera’s second cock as it snakes into your mouth. Wrapping your lips around it, you start to suckle, and fluids pour down your throat in response.", parse);
									Text.NL();

									LaylaScenes.SexCatchAnalCont2(parse, undefined, true);
								}, enabled : true,
								tooltip : "How can you possibly resist an offer like that?",
							});
							options.push({ nameStr : "No",
								func() {
									Text.Clear();
									Text.Add("<i>“Okay,”</i> she says, leaning over and licking your nipples once more before resuming her sucking.", parse);
									Text.NL();
									LaylaScenes.SexCatchAnalCont2(parse);
								}, enabled : true,
								tooltip : "You don’t want her tail, either.",
							});
							Gui.SetButtonsFromList(options, false, undefined);
						} else {
							Text.Add("<i>“Okay,”</i> she replies in disappointment, turning her attention back to your nipples.", parse);
							Text.NL();
							LaylaScenes.SexCatchAnalCont2(parse);
						}
					}, enabled : true,
					tooltip : "You’d rather she didn’t.",
				});
				Gui.SetButtonsFromList(options, false, undefined);

			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("Your eyes flutter closed and you moan softly. Pleasure sings through your veins and dances under your [skin]. A gentle nip on your nipple makes your eyes open again. Before your face, Layla’s tail undulates, dancing on some ethereal breeze.", parse);
				Text.NL();
				Text.Add("Like a perverse flower, the chimera’s tail-tip opens, revealing the drooling length of her secondary shaft. It curls through the air, brushing its slimy tip against your lips, but then hovers there, waiting for you to make the choice to accept it or not.", parse);
				Text.Flush();

				// [Accept][Push away]
				const options: IChoice[] = [];
				options.push({ nameStr : "Accept",
					func() {
						Text.Clear();
						Text.Add("You open your mouth without hesitation, and immediately Layla’s tail glides inside. Wrapping your lips around its girth, you suckle happily, feeling the warming, mint-tinged goo trickling down your throat.", parse);
						Text.NL();

						LaylaScenes.SexCatchAnalCont2(parse, undefined, true);
					}, enabled : true,
					tooltip : "Let’s just say ‘aahhh’ already.",
				});
				options.push({ nameStr : "Push away",
					func() {
						Text.Clear();
						Text.Add("With a grimace, you raise a hand to the oozing tail, pushing it away from your face with the back of your hand.", parse);
						Text.NL();
						Text.Add("Layla lifts her head from your nipple, licking up a thin strand of saliva linking her lips to your little nub. <i>“No tail?”</i>", parse);
						Text.NL();
						Text.Add("With a shake of your head, you confirm that that’s right.", parse);
						Text.NL();
						Text.Add("<i>“Then, can we kiss?”</i>", parse);
						Text.Flush();

						// [Yes][No]
						const options: IChoice[] = [];
						options.push({ nameStr : "Yes",
							func() {
								Text.Clear();
								Text.Add("Layla smiles and leans over you, pressing her lips to yours.", parse);
								Text.NL();
								Text.Add("Without hesitation, you open your lips, inviting the chimera’s tongue inside, an invitation she immediately seizes upon. A long, writhing appendage squirms inside, filling your taste buds with her flavor as it ensnares your [tongue].", parse);
								Text.NL();

								LaylaScenes.SexCatchAnalCont2(parse, true);
							}, enabled : true,
							tooltip : "Of course you can.",
						});
						options.push({ nameStr : "No",
							func() {
								Text.Clear();
								Text.Add("<i>“Okay,”</i> she replies in disappointment, returning to your nipples.", parse);
								Text.NL();
								LaylaScenes.SexCatchAnalCont2(parse);
							}, enabled : true,
							tooltip : "You’d rather not.",
						});
						Gui.SetButtonsFromList(options, false, undefined);
					}, enabled : true,
					tooltip : "She can get that out of your face - you have all the cock you need down below.",
				});
				Gui.SetButtonsFromList(options, false, undefined);
			}, 1.0, () => layla.sexlevel >= 3);
			scenes.Get();
		} else {
			LaylaScenes.SexCatchAnalCont2(parse);
		}
	}

	export function SexCatchAnalCont2(parse: any, kiss?: boolean, tailcock?: boolean) {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		if (kiss) {
			Text.Add("Writhing in the chimera’s arms, you hug her as tightly as you can. Her tongue thrashes in your mouth while your own tries to defend itself against the onslaught. Down below, her hips smack meatily against yours, a rhythmic thrusting that sends warmth and pleasure tingling along your spine.", parse);
			Text.NL();
			Text.Add("Layla attacks you like a chimera possessed, humming and moaning into your kiss as she moves to probe your throat. Luckily, she stops for a moment, giving you time to catch your breath.", parse);
			Text.NL();
			Text.Add("You pant heavily, gulping huge lungfuls of air and trying to get your heartbeat under control. Before you have taken more than half a dozen breaths, the amorous chimera engulfs your lips again. She kisses, tongues and thrusts with even more passion than before, grinding herself wildly against you.", parse);
			Text.NL();
			Text.Add("The world disappears in a tangle of thrashing limbs and subdermal fire. All you can focus on is Layla’s tongue in your mouth, her cock in your ass...", parse);
			Text.NL();
			Text.Add("A sudden, mighty thrust snaps you almost painfully back to reality. Layla breaks the kiss and arches her back as she squeals in pleasure, grinding her dick into your butt with all the strength she can muster.", parse);
		} else if (tailcock) {
			Sex.Blowjob(player, layla);
			player.FuckOral(player.Mouth(), layla.FirstCock(), 1);
			layla.Fuck(layla.FirstCock(), 1);

			Text.Add("The taste of Layla’s tail floods your mouth, searing its way down your throat as you swallow. You nurse like a starving baby at its mother’s teat, working with lips and tongue to pleasure her quasi-phallus.", parse);
			Text.NL();
			Text.Add("From down below, you are aware of her dick as it plows away at your ass, and the feeling of her lips wrapped around your [nip], nursing with equal fervor. But your own attentions remain wrapped around her tail-cock, feeling it throbbing and pulsating in your mouth as you lavish it with your oral affections.", parse);
			Text.NL();
			Text.Add("It squirms and wriggles, writhing past your lips and bucking in and out of your mouth. It tenses suddenly, and you draw it deeper, allowing it to explode around your tongue. Thick gushes of warm, minty goo cascade down your throat, burning deliciously inside your stomach.", parse);
			Text.NL();
			Text.Add("You swallow without pause, without thinking, just letting it wash you away in pleasure. Only when it goes slack do you release your lips, allowing Layla to pull her limp member from your mouth.", parse);
			Text.NL();
			parse.lact = player.Lactation() ? " your milk stains her mouth" : "";
			Text.Add("As your eyes open and you inhale slowly, taking deep breaths, Layla’s face drifts lazily into view. Her eyes are hazy with pleasure,[lact] and her lips curl into a dreamy smile.", parse);
		} else {
			Text.Add("You moan excitedly, relishing the feeling of Layla suckling at your [nip], toying with you using lips, tongue and even teeth.", parse);
			if (player.Lactation()) {
				Text.Add(" You can feel her drawing out your milk, swallowing each mouthful she sucks forth with gusto. A warm, maternal glow fills your belly, mingling nicely with the more carnal pleasures of her pumping hips.", parse);
			}
			Text.NL();
			Text.Add("Sighing with longing, you clench and release with your ass, gyrating your hips to ensure her cock hits just the right spots inside of you. Pleasure washes through your being, carrying you to soaring heights of delight.", parse);
			Text.NL();
			Text.Add("Layla too moans wantonly, pulling away from your [breasts] as she cries out in pleasure.", parse);
		}
		Text.NL();
		if (layla.sexlevel >= 2 && !player.PregHandler().IsPregnant()) {
			Text.Add("<i>“[playername]. C-can I…?”</i> she asks, hilting herself completely into you and grinding herself into your well-used [anus].", parse);
			Text.NL();
			Text.Add("Any confusion you might have felt is lost as you feel the bulging flesh pushing so insistently against your stretched hole. The chimera wants to knot you... but will you let her?", parse);
			Text.Flush();

			// [Yes] [No]
			const options: IChoice[] = [];
			options.push({ nameStr : "Yes",
				func() {
					Text.Clear();
					Text.Add("Nodding emphatically, Layla grips your [hips], thrusting forcefully once, twice, then finally hilting inside you one last time as her orgasm finally overtakes her, pumping a torrent of white, hot chimera seed up your butt.", parse);
					Text.NL();

					let cum = layla.OrgasmCum();

					LaylaScenes.Impregnate(player, layla, cum, PregnancyHandler.Slot.Butt);

					Text.Add("You cry out in pleasure, squeezing down for all you’re worth. Sparks spit and crackle inside your brain, racing along your nerves as your own boundary is reached and passed.", parse);
					if (player.FirstCock()) {
						Text.Add(" Your [cocks] ache[notS] and throb[notS], hard as diamond before erupting in[a] geyser[notS] of semen that wash[notEs] over your [belly], spilling messily down your [thighs] and puddling on the ground.", parse);
					}
					if (player.FirstVag()) {
						Text.Add(" Your [vag] squeezes itself as tight as it can, wringing itself around an absent cock and gushing its nectar over Layla’s nethers.", parse);
					}
					Text.NL();

					cum = player.OrgasmCum();

					Text.Add("You can feel it. Her knot is growing inside your [anus], effectively trapping you as her climax slows down to a trickle.", parse);
					Text.NL();
					Text.Add("Without thinking, you clench your sphincter, squeezing down on Layla’s knot. As if to defy you, it grows fuller still, making it harder for you to grip, ensuring you are never going to push it out. As full as you are, you can feel her cock bulging as another jet of semen floods up its length, spurting inside your stuffed guts, sending a ripple of pleasure through you.", parse);
					Text.NL();
					Text.Add("Layla hugs you close, nuzzling your [breasts] as she coos lovingly. Another jet of cum spurts inside you as she seems to almost purr.", parse);
					Text.NL();
					Text.Add("Helpless and, in truth, enjoying it, you curl your own limbs around the chimera, pressing your cheek to hers. Your own nethers throb in sympathy as she cums inside you with rhythmic precision. A thick jet of girl-cream rushes inside your ass, and then the seconds tick by, just long enough to make you think she’s finished, before she fires again.", parse);
					Text.NL();
					Text.Add("You feel warm and flushed, the liquid heat within you enveloping you from the inside out. Your belly begins to feel full, stuffed to the brim, but she continues to creampie you. Like a loaf of bread in an oven, your stomach begins to rise inch by inch, thrusting itself against your lover’s own belly.", parse);
					Text.NL();
					Text.Add("Thicker and fuller she fills you, leaving you to moan plaintively as you are stuffed and stuffed. You feel like you are about to burst, but at the same time it feels so wonderful...", parse);
					Text.NL();
					Text.Add("Bigger, bigger, how much bigger is she going to make you? Your stomach looks like a watermelon, skin stretched tight over the cum-crammed organs within. Finally - mercifully - Layla seems to run out of semen. Curling somewhat awkwardly around your flagrantly distended middle, she yawns hugely and tucks her head into the crook of your shoulder.", parse);
					Text.NL();
					Text.Add("Her breathing slows quietly, and you realize she’s drifted off to sleep. Smiling wistfully, you stroke her hair, nuzzling your cheek against hers as you allow yourself to likewise drift into slumber.", parse);
					Text.Flush();

					Gui.NextPrompt(() => {
						Text.Clear();
						Text.Add("You awaken to the feeling of something tugging at your ass. Layla groans in exertion as she tugs at your butt lightly, willing her knot to subside enough to pull out. It takes a bit of work, but after a minute of awkward struggles you’re rewarded with a wet pop as she finally manages to withdraw.", parse);
						Text.NL();
						Text.Add("You let out a huge sigh of relief, feeling the liquid inside of you shifting. The sensation of being an emptying bottle is hard to articulate as your filling comes gurgling from your gaping ass, pouring wetly across the ground.", parse);
						Text.NL();
						Text.Add("Paying no attention to the growing puddle beneath your buttocks, Layla clambers to her feet, stretching until her joints pop. Her impressive cock, still erect when she rose, slowly falls limp and is sucked back into whatever niche of her body it hides inside, vanishing from sight. The chimera grins happily and offers you a helping hand.", parse);
						Text.NL();
						Text.Add("Reaching up, you clasp hold of it, allowing Layla to assist you in getting off the ground. With a little help, you are soon standing upright once again, stretching the kinks from your joints.", parse);
						Text.NL();
						Text.Add("Layla approaches you, rubbing her cheeks against you affectionately before she takes a step back and shifts her skin back into clothes.", parse);
						Text.NL();
						Text.Add("Since you can’t just conjure clothes on and off like that, it takes you a little longer before you are dressed and ready to set out again.", parse);
						Text.Flush();

						TimeStep({hour: 2});

						Gui.NextPrompt();
					});
				}, enabled : true,
				tooltip : "After everything else, it’d be a waste to not let her knot you!",
			});
			options.push({ nameStr : "No",
				func() {
					Text.Clear();
					LaylaScenes.SexCatchAnalCont3(parse);
				}, enabled : true,
				tooltip : "Not this time.",
			});
			Gui.SetButtonsFromList(options, false, undefined);
		} else {
			LaylaScenes.SexCatchAnalCont3(parse);
		}
	}

	export function SexCatchAnalCont3(parse: any) {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		Text.Add("<i>“O-okay,”</i> she replies, furrowing her brows to will her knot away, all the while pumping herself into you.", parse);
		Text.NL();
		Text.Add("As you thrust and moan, you feel your own pleasure building, curling your limbs around your chimeric lover as you grind together. Layla cries out, arching her back as the first shot of her cum erupts inside of you. The feeling of it - sticky and warm, like wet heat slurping lewdly inside of you - pushes you past the limit, and you climax in turn.", parse);
		Text.NL();

		let cum = layla.OrgasmCum();

		LaylaScenes.Impregnate(player, layla, cum, PregnancyHandler.Slot.Butt);

		cum = player.OrgasmCum();

		if (player.FirstCock()) {
			Text.Add("Your [cocks], sandwiched between the two of you, go[notEs] off in a shower of cum, smearing you both with your fluids.", parse);
			Text.NL();
		}
		if (player.FirstVag()) {
			Text.Add("Clenching in sympathy around an absent member, your [vag] gushes forth a cascade of feminine honey, drooling down your body to puddle beneath you.", parse);
			Text.NL();
		}
		Text.Add("Even as your own orgasm comes and goes, Layla is still pumping, blasting jet after glorious jet of chimera-cum inside your used ass. You feel wonderfully full, belly stuffed with cum, even as the excess runs out around her cock in rivers of white. Each buck and thrust of your lover makes a perverse squelching, slapping sound as she stirs the semen inside of you before slamming against your buttocks.", parse);
		Text.NL();
		Text.Add("Once she’s done, Layla slumps against you, panting heavily as she purrs.", parse);
		Text.NL();
		Text.Add("Smiling blissfully, feeling her rumbling echoing through your ribs, you reach up and tenderly stroke her hair.", parse);
		Text.NL();
		Text.Add("Layla coos in pleasure, leaning into your hand. Once you stop, you see that she has a pleased smile plastered to her face. She takes a moment to gather herself, then begins pulling out of your used [anus].", parse);
		Text.NL();
		Text.Add("You groan deep and low as your abused pucker is slowly emptied. In her wake, the chimera leaves a gaping hole, still oozing rivulets of girl-seed, despite your attempts to clench it shut.", parse);
		Text.NL();
		if (layla.sexlevel >= 3) {
			Text.Add("Layla moves a hand, massaging your worn muscles to help them return to their original tautness, always mindful of her claws.", parse);
			Text.NL();
			Text.Add("You sigh softly, a shiver of pleasure running through you. With her help, you finally get yourself shut fairly tight. You thank her for her kindness.", parse);
			Text.NL();
			Text.Add("<i>“You’re welcome,”</i> she says, giggling softly.", parse);
		} else {
			Text.Add("Layla giggles softly as she watches your efforts.", parse);
		}
		Text.NL();
		Text.Add("Slowly, you make your way upright, stretching out the kinks in your joints. As you grab your own gear and start getting dressed, you watch Layla shift back into her makeshift clothes.", parse);
		Text.Flush();

		TimeStep({hour: 1, minute: 30});

		Gui.NextPrompt();
	}

	// TODO
	export function SexCatchVaginal() {
		const parse: any = {

		};

		Text.Add("PLACEHOLDER", parse);
		Text.NL();
		Text.Add("", parse);
		Text.NL();
		Text.Flush();

		Gui.NextPrompt();
	}

	export function FirstTimeSkinShift() {
		const layla = GAME().layla;
		const parse: any = {

		};

		Text.Add("You almost don’t register her words. Staring at her naked body, you still can’t believe what you just saw, even with everything else you’ve seen in this world. Snapping your gaze back to meet her own politely bemused stare, you ask her how she did that.", parse);
		Text.NL();
		Text.Add("<i>“Did what?”</i> she asks in confusion.", parse);
		Text.NL();
		Text.Add("Her clothes - they just sort of melted into her skin. How did she make them do that?", parse);
		Text.NL();
		Text.Add("<i>“Oh, that? Miss Gwendy said I shouldn’t walk around naked, so I shifted my skin to look like a few clothes she had.”</i> She demonstrates it by shifting her 'clothes' back on, then off again.", parse);
		Text.NL();
		Text.Add("She... shifted her skin? Shaking your head in bewilderment, you ask her how she does that; you’ve never seen anyone who could do that before!", parse);
		Text.NL();
		Text.Add("Layla shrugs. <i>“I don’t know. I just do. It’s like raising your hand, I guess...”</i>", parse);
		Text.NL();
		Text.Add("Well, it seems she’s not going to be able to clear up that little mystery. You’ll just have to accept that the ability is part of who she is. With a chuckle, you quip that Layla is just full of surprises. Back to business then...", parse);
		Text.NL();

		layla.flags.Skin = 1;
	}

	export function SexPitchVaginal() {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		const p1cock = player.BiggestCock(undefined, true);

		let parse: any = {
			playername : player.name,
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

		const opts = {
			LCock     : false,
			TailJuice : false,
			CummyL    : false,
			TailPeg   : false,
		};

		Text.Clear();
		Text.Add("As the excited chimera nods and shifts her skin to reveal her true glory, you set about stripping out of your own [armor]. You nudge the discarded clothing out of the way with your [feet] and stand ready for Layla’s inspection, taking this opportunity to ogle her own newly nude form.", parse);
		Text.NL();
		if (player.FirstCock()) {
			if (player.LustLevel() < 0.5) {
				Text.Add("Unfortunately, as much as you appreciate the view, it’s not quite enough to get your cock[s] going, but you know another way to get yourself properly in the mood for a little fun...", parse);
				Text.NL();
				Text.Add("Smiling innocently, you ask Layla if she would be a dear and help you get ready for her? You just need a little assistance before you both can start.", parse);
				Text.NL();
				Text.Add("<i>“Sure! What do I do?”</i>", parse);
				Text.Flush();

				const laylaSexlevel = layla.sexlevel;

				// [Hands][Tail][Tentacles]
				const options: IChoice[] = [];
				options.push({ nameStr : "Hands",
					tooltip : "You’re quite confident she can work wonders with her fingers...",
					func() {
						Text.Clear();
						Text.Add("Your gaze drifts to her hands, and you tell her that a handjob would sure feel nice.", parse);
						Text.NL();
						Text.Add("<i>“Okay.”</i>", parse);
						Text.NL();
						parse.l = player.Humanoid() ? Text.Parse("spread your [legs]", parse) : ", expose yourself as best you can with your awkward frame";
						Text.Add("Such a good girl, so quick to help out someone in need. Still smiling, you sit down on the ground and [l], giving as much access as possible to the expectant chimera.", parse);
						Text.NL();
						parse.knot = p1cock.Knot() ? "knot" : "base";
						Text.Add("Layla wastes no time; she grabs[oneof] your [cocks] by the [knot] and begins slowly stroking your shaft.", parse);
						Text.NL();
						Text.Add("You coo your approval as the chimera’s fingers trail feather-light touches across your sensitive flesh, causing a shudder to ripple throughout your body.", parse);
						Text.NL();
						if (laylaSexlevel < 3) {
							Text.Add("While she isn’t exactly experienced, she does manage to touch a few key spots - plus her eagerness to please you is simply adorable.", parse);
							Text.NL();
							Text.Add("Patiently, you try to guide her in her efforts by offering the occasional instruction as to where to stroke you for best effect, and lightly praising her efforts at pleasing you. She’s a hard worker, and learns quite quickly. Slowly, you can feel the tingling building inside of you, your manhood[s] creeping into erection as she works.", parse);
						} else if (laylaSexlevel < 5) {
							Text.Add("The chimera’s attention is completely dominated by your [cock]; you can tell as she traces your veins - slowly trying, learning. It already feels pretty good, but it only gets better as she continue to explore your length.", parse);
							Text.NL();
							Text.Add("Though you offer the occasional pointer, you find yourself content primarily to sit back and enjoy her efforts. She truly has come a long way from the naive virgin she was when you took her in, and you’re happy to reap the results. All too soon - it feels like - you can feel yourself growing harder and stiffer in her hands.", parse);
						} else {
							Text.Add("The chimera is so familiar with your body that she doesn’t really need to try and find your special spots - she already knows them by heart. Although she is a lot more experienced now, she’s still just as eager to please as she was back when she was inexperienced.", parse);
							Text.NL();
							Text.Add("Under such an assault, you can’t muster the concentration to offer any commentary, even if you felt it were necessary. Layla has reduced you to little more than putty in her capable fingers; your maleness practically jumps erect under her touch, the chimera working you into a passion with hardly any effort on her part.", parse);
						}
						Text.NL();
						Text.Add("Layla giggles softly. <i>“I think you’re ready.”</i> She smiles.", parse);
						Text.NL();
						Text.Add("You groan in response; you sure feel ready. Now that she’s taken such good care of you, why doesn’t she help you up so that you can return the favor?", parse);
						Text.NL();
						Text.Add("Layla nods and extends a helping hand.", parse);
						Text.NL();
						Text.Add("Gratefully accepting Layla’s hand, you haul yourself upright again with her help. Once back on your [feet], you look the lovely chimera over, contemplating how best to ensure she is as ready for you as you are for her.", parse);
						Text.Flush();
						player.AddLustFraction(1);

						player.AddSexExp(1);
						layla.AddSexExp(1);

						LaylaScenes.SexPitchVaginalCont(opts, p1cock, parse);
					}, enabled : true,
				});
				options.push({ nameStr : "Tail",
					tooltip : "Having her stroke you with her tail would be pretty hot...",
					func() {
						Text.Clear();
						Text.Add("Watching the chimera’s reptilian appendage with its hidden surprise idly flicking through the air, your decision is easy to make. You tell Layla that you’d love to see what she can do by wrapping that tail of hers around your cock and jerking you off with it.", parse);
						Text.NL();
						Text.Add("<i>“Okay,”</i> she says, bringing her tail around her front.", parse);
						Text.NL();
						Text.Add("Seeing Layla’s tail swishing around, you sit on the ground, parking yourself on your [butt] and positioning your [legs] so that she has unrestricted access to your [cocks].", parse);
						Text.NL();
						Text.Add("She starts by lightly caressing your member[s] with the tip of her tail, sending electric shrills through your body as she encircles[oneof] your cock[s]. Seeing your reaction makes her smile a little.", parse);
						Text.NL();
						Text.Add("Moaning appreciatively, you arch your back, shuddering as her tip tickles your [cockTip]. That feels <i>good</i>... what a clever girl she is, knowing how to do something like this.", parse);
						Text.NL();
						Text.Add("<i>“Thanks! I think you’re pretty clever too!”</i> she replies, tightening her hold on your [cock].", parse);
						Text.NL();
						Text.Add("The sensation is so strange; it’s tight and warm, but it feels different to having fingers or a mouth wrapped around you. It’s just a solid ring of muscle that embraces every inch of your shaft, skin to skin, and envelops it in Layla’s warmth. It feels... wonderful.", parse);
						Text.NL();
						if (laylaSexlevel < 5) {
							Text.Add("Layla’s cock-wrapper tightens just a fraction more, then starts to slowly stroke back and forth along your length. She rhythmically clenches and unclenches her tail with each pass, steadily milking your member with a dexterity no hand could hope to equate. You can feel yourself growing stiffer by the moment, the chimera smiling merrily as she painstakingly pumps you erect.", parse);
							Text.NL();
							Text.Add("Once she’s sure that you’re about as hard as you’ll get, she uncoils herself from your [cock] and removes her tail.", parse);
							Text.NL();
							Text.Add("<i>“Is this okay?”</i>", parse);
							Text.NL();
							Text.Add("Oh, yes, it’s just perfect. Now, if she wouldn’t mind helping you up?", parse);
						} else {
							Text.Add("With just the faintest of wet sounds, Layla’s tail parts, exposing the indigo blue flesh of her tail-cock. As the meat of her cock-wrapper keeps your own dick trapped in a warm, tight clutch - slowly clenching and unclenching - she starts to gently brush her drooling cock-tip against your own cock-flesh.", parse);
							Text.NL();
							Text.Add("You can feel its wet heat as it traces over your skin, painting pre-cum and her strange, natural lube on your phallus. Your member tingles, thrusting itself erect in her coils with an intensity that is almost painful, heat building in the base of your cock. You might have momentarily forgotten about the aphrodisiac properties of her tail-cock’s fluids... but Layla sure hasn’t.", parse);
							Text.NL();
							Text.Add("She moves her dick and aligns it with yours, prodding your [cockTip] with hers, sweeping your pre off as she replaces it with her own. It’s as if her tail-cock was kissing your [cock], and every spot it kisses leaves a trail of warm tingling.", parse);
							Text.NL();
							Text.Add("Your mind is starting to melt under Layla’s ministrations. With a surge of effort that is almost physically painful, you gasp for her to stop, or you’ll cum right here and now - and that means she won’t get to have any fun herself.", parse);
							Text.NL();
							Text.Add("<i>“Ah! Sorry!”</i> she quickly apologizes, releasing you in an instant.", parse);
							Text.NL();
							Text.Add("Shuddering with pleasure, you try to calm yourself down, taking slow, deep breaths in an effort to get your pounding heart back under control.", parse);
							Text.NL();
							Text.Add("<i>“Was I bad?”</i> she asks apologetically.", parse);
							Text.NL();
							Text.Add("No! No, she was <b>good</b> - too good. Any other time, you might have been happy to let her tailjob you until you came, but that’s not what you want this time.", parse);
							Text.NL();
							Text.Add("The chimera breathes a sigh of relief. <i>“O-okay… are you okay?”</i>", parse);
							Text.NL();
							Text.Add("You are now that she’s letting you think straight. Now, how about a hand up? You’re ready for her now.", parse);
						}
						Text.NL();
						Text.Add("Layla extends a helping hand.", parse);
						Text.NL();
						Text.Add("Somewhat shakily, you reach out and take hold, letting the chimera pull you upright until you have settled back on your [feet]. Trying to push through the need now burning in your nethers, you look Layla over and try to decide how best to get her in the proper mood for some playtime...", parse);
						Text.Flush();
						player.AddLustFraction(1);

						player.AddSexExp(2);
						layla.AddSexExp(2);

						LaylaScenes.SexPitchVaginalCont(opts, p1cock, parse);
					}, enabled : true,
				});
				options.push({ nameStr : "Tentacles",
					tooltip : "How can you pass up the kinky fun of tentacles...",
					func() {
						Text.Clear();
						Text.Add("As your gaze sweeps over Layla’s curvaceous form, you can’t help but remember the great surprise she conceals under her skin: the waving forest of writhing appendages she can sprout with a moment’s thought. From the depths of your mind surfaces a mental image of her tentacles sweeping over your body, molesting your cock[s] and every other sensitive spot they can touch.", parse);
						Text.NL();
						Text.Add("Feeling the electric tingle that image sparks in your loins, you know what you want the chimera to do. Unable to keep the lecherous grin from your lips, you ask Layla if she’d be up for letting you have a little fun with those sexy tentacles of hers.", parse);
						Text.NL();
						Text.Add("<i>“Sure!”</i> she says, smiling as she shifts her skin to form her tentacles. They emerge from her back and wiggle in front of you; each appendage has a slightly bulbous tip. <i>“Umm… now what?”</i>", parse);
						Text.NL();
						Text.Add("Still grinning lecherously, you all but throw yourself to the ground, moving your [legs] so that your [cocks] [isAre] exposed in all [itsTheir] glory. Now, you tell her, you want her to use them on[oneof] your cock[s]; nothing like the feel of all her squirmy tentacles playing with you to get you ready to give her some fun.", parse);
						Text.NL();
						Text.Add("<i>“Okay!”</i> she readily agrees.", parse);
						Text.NL();
						Text.Add("Layla’s sinuous tentacles make their way to your [cocks], hovering over [itThem] for a bit before they spread out around[oneof] your [cocks].", parse);
						Text.NL();
						Text.Add("She starts with simple touches, just finding the correct spots along your base, shaft and tip. The act itself feels kinda pleasurable, but nothing could prepare you for what comes next…", parse);
						Text.NL();
						Text.Add("An involuntary groan of desire forces its way up your throat as Layla’s tentacles start to vibrate, their bulbous tips shaking like sextoys as they coil around your shaft or brush against your cock. It feels like she’s stimulating every sweet spot you have at once - and even a few you didn’t know you had.", parse);
						Text.NL();
						if (player.NumCocks() > 1) {
							parse.isnt = player.NumCocks() > 2 ? "aren’t" : "isn’t";
							Text.Add("Your cock leaps erect in an instant, and even though your other cock[s2] [isnt] being touched in the same way, [itThey2] also grow[notS2] hard and hot under the sexual onslaught.", parse);
						} else {
							Text.Add("Not surprisingly, your [cock] seems to go from near-flaccid to hard and aching without seeming to transition between. It throbs with need, pulsating almost in time with Layla’s touches.", parse);
						}
						Text.NL();
						Text.Add("Pre-cum drools down your length[s], flowing from[eachof] your [cockTip][s]. Layla’s tentacles deftly scoop up the beads of sexual juice as they seep from your innermost depths, trailing their now-slick tips along your flesh and lubing you up with your own pre.", parse);
						Text.NL();
						parse.proverbial = player.HasBalls() ? "" : " proverbial";
						Text.Add("The sensation is incredible! ...<b>Too</b> incredible! If the chimera doesn’t let up on this soon, you’re going to bust a[proverbial] nut! You try to speak, choking on your own ecstatic mewling, but finally manage to blurt out for Layla to stop.", parse);
						Text.NL();
						Text.Add("Startled, she abruptly stops, releasing you in an instant. <i>“Sorry!”</i> she immediately blurts out.", parse);
						Text.NL();
						Text.Add("You pant for breath, head reeling as you try and concentrate through the haze of pleasure she’s just left you in. You shake yourself back to reality and tell her there’s nothing to be sorry for; she was just a bit more than you could handle. Maybe someday, you’ll let her really cut loose with those things, but at the moment you’ll settle for her giving you a hand up.", parse);
						Text.NL();
						Text.Add("<i>“Oh, sure!”</i> she says, extending a helping hand.", parse);
						Text.NL();
						Text.Add("With Layla’s help, you are back on your [feet] in moments. Still tingling from the touch of her tentacles - you will <b>have</b> to remember that - you look the apologetic chimera over, trying to figure out how you’re going to pay her back in kind for her little bout of foreplay.", parse);
						Text.Flush();
						player.AddLustFraction(1);

						player.AddSexExp(2);
						layla.AddSexExp(2);

						LaylaScenes.SexPitchVaginalCont(opts, p1cock, parse);
					}, enabled : true,
				});
				Gui.SetButtonsFromList(options, false, undefined);
			} else {
				Text.Add("You can feel the throbbing in your dick[s] as your hungry gaze sweeps back and forth across the naked chimera’s ample curves. You’re so hard that it almost hurts, ready to just dive into the warmth between her supple thighs... but you force yourself to be patient. You just need to figure out how you want to get her ready for this...", parse);
				Text.Flush();
				LaylaScenes.SexPitchVaginalCont(opts, p1cock, parse);
			}
		} else {
			Text.Add("Absently admiring the chimera’s nude form, you reach into your belongings and retrieve your [cock]. With quick, precise motions, you fix it into place at your nethers, sparing a moment to make sure it’s not going to fall off in mid-thrust. Satisfied that you are ready for the chimera, you just need to figure how best to make sure she’s in the mood for you...", parse);
			Text.Flush();
			LaylaScenes.SexPitchVaginalCont(opts, p1cock, parse);
		}
	}

	export function SexPitchVaginalCont(opts: any, p1cock: Cock, parse: any) {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		// [Finger][Eat her out]
		const options: IChoice[] = [];
		options.push({ nameStr : "Finger",
			tooltip : "Why get fancy for this? Your fingers should be just fine for getting her all fired up.",
			func() {
				Text.Clear();
				Text.Add("Decision made, you close the distance between yourself and the chimera. You reach out with one arm, draping it over Layla’s shoulders before pulling her into a kiss. With her usual innocence, Layla melts into your mouth, gently parting her lips to let your tongue sneak inside her mouth. Her taste washes over your senses, making your body prickle with anticipation.", parse);
				Text.NL();
				Text.Add("As you make out with her, your free hand sneaks up between her thighs, carefully coaxing her legs apart to let your fingers lightly brush against her pussy. Soft, smooth skin slides under your fingertips, and Layla breaks the kiss with a soft gasp of pleasure as you caress her womanhood.", parse);
				Text.NL();
				Text.Add("Your fingers continue to fondle Layla’s pussy, the chimera moaning softly at your ministrations, as you carefully reposition yourself. You circle around Layla until you are spooning her from behind, the hand not busy molesting her drawing her close, so that your [breasts] are pressed against her back.", parse);
				Text.NL();
				Text.Add("Now feeling comfortably in place, you think the moment is right to take things up a notch. The fingers stroking back and forth along Layla’s slit shift themselves, carefully spreading her petals open. With a free digit, you lightly dip into her now-gaping flower, tenderly caressing her interior.", parse);
				Text.NL();
				Text.Add("Of course, she has a lot more to play with than just her pussy. Though your hand continues its efforts down below, you won’t ignore what she has up top, either. You playfully cup one of Layla’s full C-cup breasts, hefting it slightly to better experience the weight of the ripe orb. Your inquisitive fingers glide over the impossibly smooth, perfect skin, stroking teasingly around her dark areola.", parse);
				Text.NL();
				Text.Add("Layla lets out a soft, squeaky gasp as you mischievously pinch her perky gray nipple, and you promptly abandon her breast. Raising your hand to her chin, you turn her head as you lean over her shoulder, allowing you to pull her into another warm, tender kiss.", parse);
				Text.NL();
				const strapon = p1cock.Strapon();
				parse.art = strapon ? " artificial" : "";
				parse.warm = strapon ? "" : ", warm";
				parse.makeshift = strapon ? " makeshift" : "";
				Text.Add("Adjusting your stance slightly, you thrust your [cock] between Layla’s thighs, shifting until the[art] dick is laying against the chimera’s cunt. With each twitch of your hips, you grind your[art] shaft against her labia, letting her feel the rounded[warm] firmness of your[makeshift] maleness in such tempting proximity.", parse);
				Text.NL();
				parse.c = strapon ? "" : Text.Parse(", and drizzling onto your [cock] between her thighs, her clit starting to rub against your dick as you thrust", parse);
				Text.Add("A short, sharp gasp escapes Layla’s mouth, and she shudders against your chest. You can feel warm wetness starting to stain your fingers[c].", parse);
				Text.NL();
				Text.Add("Your curiosity piqued, you carefully push two of your fingers into Layla’s cunt, abandoning your efforts to spread her netherlips so that you can focus on plumbing her depths. Layla mewls and moans, shivering with pleasure as your flexible digits twist and stroke her innermost depths. You can feel her warm, soft flesh wrapping around you, squeezing them so tightly...", parse);
				Text.NL();
				Text.Add("Despite her efforts, she can’t hold you prisoner, though she certainly does her best. There’s an audible pop as your fingers come free, and when you lift them into view, a thin strand of fluids miraculously connects them to her cunt for a second, before it breaks under its own weight.", parse);
				Text.NL();
				Text.Add("You hold your dripping fingers in front of Layla’s face, playfully noting that it looks like she’s ready for you.", parse);
				Text.NL();
				Text.Add("<i>“O-okay...”</i> she says, panting in lust.", parse);
				Text.NL();
				Text.Add("With a single explosion of motion, you sweep Layla off her feet and into your arms, the chimera clinging to you as you carry her bridal style for a moment. Seeking the most comfortable spot, you tenderly lay her down on the ground, spreading her thighs with your hands before settling yourself between them.", parse);
				Text.NL();
				Text.Add("Now, time for the real fun to begin...", parse);
				Text.Flush();

				layla.AddLustFraction(1);

				player.AddSexExp(1);
				layla.AddSexExp(1);

				LaylaScenes.SexPitchVaginalCont2(opts, p1cock, parse);
			}, enabled : true,
		});
		options.push({ nameStr : "Eat her out",
			tooltip : "A nice bit of muff-diving should be just the thing to fire her up for the real deal.",
			func() {
				Text.Clear();
				Text.Add("Having made your decision, you reach out and place a hand on Layla’s shoulder before telling the chimera to lie down. Layla quietly nods her understanding and drops to the ground, your hand wrapped around her shoulders to make the descent as gentle as possible.", parse);
				Text.NL();
				parse.lb = player.Humanoid() ? "" : " as best you can";
				Text.Add("Once she’s lying flat on her back, you kneel down[lb] and take Layla’s legs by the ankles. Her dainty little toes wriggle as you hoist her feet up, and you can’t help a smile at the sight. ", parse);
				if (player.Slut() >= 25) {
					Text.Add("Perversely amused, you can’t help yourself. You lift one petite, elegant foot to your mouth and gently kiss Layla’s toes. Noisily, you smooch each dainty digit in turn, running your lips across her instep and then starting to lick the arch.", parse);
				} else {
					Text.Add("Feeling playful, you gently run your fingers along the underside of one foot, tickling her without mercy.", parse);
				}
				Text.NL();
				Text.Add("Layla giggles, wiggling her toes as you tease her foot. <i>“S-stop! It tickles!”</i>", parse);
				Text.NL();
				Text.Add("Aw, but she looks so cute when she’s wriggling and squirming like that...", parse);
				Text.NL();
				Text.Add("Layla’s tail gently slaps you on your side with its uncontrollable whipping. <i>“Don’t be mean!”</i>", parse);
				Text.NL();
				Text.Add("Alright, alright, you’ll stop teasing her, but she really is too cute for her own good. You watch a proud smile bloom on the chimera’s face, then turn your attention back to business. You gently spread Layla’s legs, sliding forward into the space between them as you drink in the sight of her womanly treasure. Dark gray lips stand out against dull silver thighs, drawing your eyes even as the faint scent of her growing arousal starts to tickle your nostrils.", parse);
				Text.NL();

				Sex.Cunnilingus(player, layla);
				player.Fuck(undefined, 2);
				layla.Fuck(undefined, 2);

				Text.Add("You pause for a moment, savoring the indescribable bouquet, and then slowly lower your [face] towards her treasure. You purse your lips and place a light kiss on the chimera’s clitoris, sucking just hard enough that she can feel it. Your tongue flicks out, playfully caressing Layla’s buzzer, dabbing it with its [tongueTip] until you can feel it growing hard and stiff from your ministrations.", parse);
				Text.NL();
				Text.Add("You deepen the kiss until Layla moans softly at the suction, and then part your lips. Descending from her clitoral hood, you slowly lick at her slit, your [tongue] gliding along soft, plush netherlips.", parse);
				Text.NL();
				Text.Add("The chimera gasps and whimpers softly above you, her hips shaking beneath your assault. You can hear the scratching of her fingernails as she claws at the ground, a sound that prompts you to lift your head until you can take in all of her womanhood. Reaching in with both hands, you patiently spread her netherlips, exposing the slick, indigo blue flesh of her hidden feminine treasure.", parse);
				Text.NL();
				Text.Add("You pause for a moment to drink in the sight, letting Layla moan impatiently before you dive in and start to eat her out for real. Her taste washes across your tongue as you lap and slurp through her folds, intent on covering her inner and outer lips alike with thick juices.", parse);
				Text.NL();
				Text.Add("When you can hear yourself squelching and slurping with each pass of your tongue, even over the chimera’s mewling, you force yourself to withdraw. You aren’t here to eat her out - not this time. Pushing yourself slightly upright, you take in Layla’s panting form; she’s ready, there’s no questioning that. Still... she could stand a <i>little</i> more teasing... and you haven’t even touched either of her cocks yet...", parse);
				Text.Flush();

				layla.AddLustFraction(1);

				LaylaScenes.SexPitchVaginalCont2(opts, p1cock, parse);
			}, enabled : true,
		});
		Gui.SetButtonsFromList(options, false, undefined);
	}

	export function SexPitchVaginalCont2(opts: any, p1cock: Cock, parse: any) {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		// [Cock][Tail-cock][Finish up]
		const options: IChoice[] = [];
		options.push({ nameStr : "Cock",
			tooltip : "It’s right in front of you, so you may as well give it a lick.",
			func() {
				Text.Clear();
				Text.Add("Decision made, you lower your face back between Layla’s thighs once more. Your [tongue] slips from between your lips and you daintily lick along Layla’s slit once more. You glide along her length, steadily working your way higher up her mound until your tongue is no longer dabbing at her folds. Instead, you knowingly caress the spot where her cock lies concealed, brushing it with your [tongueTip] before withdrawing.", parse);
				Text.NL();
				Text.Add("Patiently, you ask Layla if she would please show her cock to you, planting a kiss on its hiding place to help her understand which cock you’re referring to.", parse);
				Text.NL();
				Text.Add("<i>“Okay!”</i> She closes her eyes and bites on her lower lip as she concentrates to make her skin shift out of her cock’s protective slit.", parse);
				Text.NL();
				Text.Add("Fascinated, you watch as the chimera’s flesh opens beneath you, a once-invisible groove stretching wide to reveal the distinctive dark purple flesh of her member’s mushroom-like tip within. As carefully as you can, you feed your tongue into Layla’s cock-slit, feeling her tense up around your [tongueTip] as it flicks the sensitive interior. Her quiet gasp of surprised pleasure resounds in your ears as you teasingly tickle her glans, lips pursing above her groin as her dick starts to thrust back against your intruding tongue.", parse);
				Text.NL();
				const sexlevel = player.sexlevel;
				if (sexlevel < 3) {
					Text.Add("The taste of her dick floods your senses, forcing you back instinctively to keep from gagging as the chimera’s maleness thrusts into your mouth. Only when you feel it stop, trembling slightly in the dark, warm wetness of your mouth, do you dare to move again.", parse);
				} else if (sexlevel < 5) {
					Text.Add("You try to relax your throat as Layla’s penis glides along your tongue, tickling against your taste buds as it extends into your inviting mouth. Still, you can’t help but gag as she brushes the back of your throat, forcing you to withdraw your head just a little from her full length.", parse);
 				} else {
					Text.Add("Layla’s dick glides into your mouth with all the comfort and ease of a long-missed friend being welcomed home. You effortlessly stretch your gullet around her shaft, allowing the chimera to plunge straight down your throat, ensuring every inch of her maleness is wrapped in your warm, wet maw.", parse);
 				}
				Text.NL();

				Sex.Blowjob(player, layla);
				player.FuckOral(player.Mouth(), layla.FirstCock(), 1);
				layla.Fuck(layla.FirstCock(), 1);

				Text.Add("With the chimera’s cock properly fixed between your lips, you set to work, ministering to her phallus with the same ardent drive you previously showed her vagina. Layla wriggles and moans softly, gasping as your [tongueTip] teases her cumslit before spiraling down across her glans. You caress each ridge and canyon that you can feel, stroking along the veins bulging beneath the supple skin from her arousal.", parse);
				Text.NL();
				Text.Add("Even as you work, you can’t ignore the effects you are having on Layla. The taste of her arousal fills your mouth as pre-cum bubbles from her cock, rolling down over your tongue before being swirled around the bottom of your mouth. Though your stomach growls hungrily at this tantalizing taste, you have bigger things in mind, and so you steadfastly refrain from swallowing.", parse);
				Text.NL();
				Text.Add("Finally, you determine that you have enough for your purposes and withdraw from Layla’s cock. She gasps as it wetly pops free of your lips, wrapped so tightly together to keep from spilling the precious cargo sloshing about your mouth, but you can’t do anything but gently stroke her thighs with your fingertips.", parse);
				Text.NL();
				Text.Add("With leisurely grace, you lower your face down Layla’s loins once again, bringing your mouth level with her slick vagina again. As carefully as you can, you part your lips and allow the chimera’s pre-cum to flow freely. It drizzles across her swollen mound, gleaming wetly as it slides over her folds, seeping down into her slit.", parse);
				Text.NL();
				parse.phisher = player.mfTrue("his", "her");
				Text.Add("Your tongue flicks out again - still coated with chimeric pre - and glides over Layla’s pussy, carefully lapping at the juices you have poured over it. Like an artist with [phisher] brush, you painstakingly paint Layla’s mound, not stopping until you are sure every inch of her netherlips is dripping with both her juices.", parse);
				Text.NL();
				Text.Add("Now she’s finally ready. It’s time for you to move on to the main event...", parse);

				opts.LCock = true;
				player.slut.IncreaseStat(30, 1);

				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Tail-cock",
			tooltip : "There’s plenty more fun to be had with her tail.",
			func() {
				Text.Clear();
				Text.Add("The sight of the aroused chimera’s tail flicking through the corner of your vision cements your desire. Adjusting yourself to free a hand, you tell Layla to give you her tail-cock.", parse);
				Text.NL();
				Text.Add("<i>“Okay!”</i> she replies enthusiastically, flicking her tail in your direction.", parse);
				Text.NL();
				Text.Add("Your hand snaps up, the length of prehensile chimeric flesh slapping meatily against your palm before you wrap your digits around it and draw the tip closer to you. At the moment, it just looks like a lizard’s tail, with its narrow, conical tip. But you know the truth...", parse);
				Text.NL();
				Text.Add("You start to caress the sensitive tail-tip with your fingers, rubbing across the smooth, supple skin. The chimera groans softly, in obvious approval of your action, but remains content to watch as you lift her tail to your mouth. You purse your lips in invitation and tenderly feed its tip inside, eyes sinking closed as you begin suckling softly.", parse);
				Text.NL();
				Text.Add("Layla croons in approval, needing no further encouragement. It’s impossible to describe the sensation as it blooms inside of your mouth, lips of flesh peeling away to expose her cock before melting back into the rest of her skin.", parse);
				Text.NL();
				Text.Add("A sort of spiced mint taste washes across your tongue, burning a path down your gullet and making you shiver. Arousal flares inside of you, making you intimately aware of your need. Absentmindedly, you stroke the length of the chimera’s tail with your hands, running your palms possessively over her smooth skin as you greedily suckle from her tail-cock.", parse);
				Text.NL();

				player.AddLustFraction(1);

				Text.Add("Realizing what you are doing, you force yourself back to your senses; you know that the two of you could both cum from this, but that’s not what you want - not this time. Hands wrapped tightly around Layla’s tail, you pull her secondary cock from your mouth, its blue and purple flesh visibly slick with pre-cum and saliva.", parse);
				Text.NL();
				Text.Add("Layla watches you with mild amusement, still panting softly. She looks inquisitive at first, not sure why you stopped, but she doesn’t question you either. All she does is look at you in confusion, waiting for you to make the next move.", parse);
				Text.NL();
				Text.Add("You smile back at Layla, brushing along her tail to fondle her cock. She visibly shudders at your touch, reptilian length wriggling in your loosened grip as her fluids smear on your palm. Carefully, you guide the drooling dick down towards the chimera’s swollen mound, fingers flicking across her engorged glans to coax a further stream of pre-cum from her tail-cock.", parse);
				Text.NL();
				Text.Add("Layla visibly shivers as the hot juices spatter onto her pussy, the arousing fluid seeping into her spread netherlips. You can feel her prehensile appendage quivering in your grip as you carefully play it over her loins, drizzling her with her own juices. It’s subtle, but you can feel her tail getting harder, stiffening in further mockery of an erection as you toy with her, until finally you judge her ready.", parse);
				Text.NL();

				Sex.Vaginal(layla, layla);
				layla.FuckVag(layla.FirstVag(), layla.FirstCock(), 1);
				layla.Fuck(layla.FirstCock(), 1);

				Text.Add("The chimera arches her back, a sharp, soft moan bursting from her lips as you feed her own tail-cock into her flushed cunny. Though you try to be gentle about it, she still opens up for you readily, greedily swallowing her own lewd flesh like a starving man presented with a feast. Sooner than you had expected, you have every inch of blue prickflesh buried inside of her, and she shudders as the slightest flick of your wrist brushes something inside of her.", parse);
				Text.NL();
				Text.Add("When you try to pull her tail-cock out, you can literally feel her clamping down, forcing you to tug her tail until it almost pops free of her. The moment your grip slackens, the chimera’s pussy muscles go to work, literally sucking it back inside of her. It’s a surprisingly arousing sight, the dick-tipped tail disappearing inch by inch as her miraculous cunt draws it inside through sheer force of contraction.", parse);
				Text.NL();
				Text.Add("It becomes a perverse little game for the two of you, your steadfast strength against her milking cunt. Her tail squelches and slurps as it plunges back and forth, the chimera gasping sharply in pleasure. You can feel her appendage throbbing in your grip, Layla’s eyes screwing closed. She suddenly tenses, crying out, and you can feel the spasm rushing through her tail as her secondary cock explodes inside her pussy, flooding it with her own aphrodisiac cream.", parse);
				Text.NL();
				Text.Add("She moans blissfully, mound visibly rippling as she strokes herself off, and you realize that you have to intervene before she ends up fucking herself into a coma without any further input from you. Whilst she’s still dazzled from the flood of lust-stirring seed swirling through her depths, you seize her tail with both hands and pull with all your might, popping it free.", parse);
				Text.NL();
				Text.Add("Layla moans pitifully, another short spurt of pseudo-cum fountaining from her tail-cock and splashing over her loins. There’s no question of her being ready now; you better get into place...", parse);

				opts.TailJuice = true;

				Gui.PrintDefaultOptions();
			}, enabled : true,
		});
		options.push({ nameStr : "Finish up",
			tooltip : "No, there’s no need for further teasing here.",
			func() {
				Text.Clear();
				Text.Add("After a moment’s thought, you shake your head; no need to go overboard. Layla’s soft panting fills your ears as the aroused chimera stares up at you expectantly; that’s all the evidence you need that it’s time to get things started for real.", parse);
				Gui.PrintDefaultOptions();
			}, enabled : true,
		});

		Gui.Callstack.push(() => {
			Text.NL();
			parse.tj = opts.TailJuice ? ", cum-soaked" : "";
			Text.Add("You waste no time in scrambling up along Layla’s prone form, not stopping until you have brought[oneof] your cock[s] into alignment with her wet, drooling[tj] womanhood. Once in position, you start to slide yourself inside of her.", parse);
			Text.NL();

			Sex.Vaginal(player, layla);
			layla.FuckVag(layla.FirstVag(), player.FirstCock(), 1);
			player.Fuck(player.FirstCock(), 1);

			if (player.FirstCock() && opts.TailJuice) {
				Text.Add("The chimera’s cunny squelches as you slide through her fluid-soaked petals, the drooling labia greedily wrapping around your shaft as they earlier enveloped her own. The lewdness of what you are doing makes your heart pound in your chest, but it is the chimera’s own fluids that make your flesh start to tingle.", parse);
				Text.NL();
				Text.Add("You can feel yourself growing harder than ever, almost swooning from the force of your erection. A haze of lust sweeps through your mind, driving away every thought save one: to fuck her into the <b>ground</b>.", parse);

				player.AddLustFraction(1);
			} else if (opts.LCock) {
				parse.t = p1cock.Strapon() ? ", however dimly," : "";
				Text.Add("As you glide inside, your eyes fall on Layla’s own cock, proudly thrust from its former hiding place. The turgid organ visibly throbs, pulsating in time with the waves of motion you can feel[t] as her cunny grips your shaft and draws it deeper. Thick beads of pre-cum seep steadily from the top of her dark purple glans, dripping onto her belly and forming a growing puddle of masculine arousal on her smooth skin.", parse);
				Text.NL();
				Text.Add("You can feel her juices building up as she redoubles her efforts to take your [cock] in, her slick passage seemingly undulating along your member in tandem with her cock’s throbbing. With barely any effort, you find yourself hilted within her, and gently pat her thigh to get her to stop milking you so fiercely.", parse);
				Text.NL();
				Text.Add("Layla looks at you in puzzlement as you simply enjoy her warmth for a moment, getting yourself ready for the pounding you’ll give the cute chimera...", parse);
			} else {
				Text.Add("With a flexibility few human women could hope to match, Layla’s flower opens up around your invading [cock] and welcomes you inside. Its walls ripple with inhuman precision, guiding your member down its slick gullet with such ease that it almost comes as a shock when you finally hilt yourself inside.", parse);
				Text.NL();
				Text.Add("You stop for a moment to center yourself, smiling as Layla gives you an innocently expectant look in return. Time to show her the good time you’ve been promising her...", parse);
			}
			Text.NL();
			Text.Add("Without further ado, you start to thrust your hips, plunging your [cock] as deep into Layla’s welcoming tightness as you can before pulling back. Unthinkingly, your hands clasp her upper arms for balance - and to pin her down - as you move, feeling her cunt gripping you tightly and making you work for your thrusting.", parse);
			Text.NL();
			if (opts.LCock) {
				Text.Add("You can hear Layla’s neglected cock slapping meatily against her belly as you pound into her. Even as you grind away into her depths, you reach down with one hand and start to fondle it. She arches her back with a moan of pleasure as your thumb trails up the shaft’s sensitive underside, gently kneading at her glans and coaxing another thick spurt of pre-cum over your digits.", parse);
				Text.NL();
				Text.Add("Her outthrust breasts catch your eyes, and you do have another hand to spare. Lasciviously, you reach out and squeeze one, squishing the meaty orb in your grip. As you grope her, you swear it seems to grow under your fingers, filling out your palm with an increasing amount of sweet, squishy titflesh.", parse);
			} else {
				Text.Add("As the two of you buck and grind, Layla’s bouncing breasts draw your eyes like iron filings to a set of round, luscious magnets. You don’t even hesitate to transfer your grip, avidly molesting the chimera’s lovely C-cups.", parse);
				Text.NL();
				Text.Add("As you do your best to cup them in your hands, your fingers sweeping over her sensitive skin, you’d swear that they seem to be getting bigger. Before your eyes, it looks like they are plumping up, growing even larger and more intoxicating with each heartbeat.", parse);
				Text.NL();
				Text.Add("Whether that’s true or not, you don’t care in the heat of the moment. All that matters is enjoying this opportunity to grope her to your heart’s content.", parse);
			}
			Text.NL();
			Text.Add("You allow the outside world to slip away, losing yourself in the simple pleasures of Layla’s flesh against your own. You drink in the feeling of having her under you, inside your grip, and wrapped around your most intimate of regions. Drunk on the heady sensation, you thrust yourself as deeply as possible, grinding your [cock] into her cunt in lieu of pulling back.", parse);
			Text.NL();
			const laylaSexlevel = layla.sexlevel;

			Gui.Callstack.push(() => {
				LaylaScenes.SexPitchVaginalCont3(opts, p1cock, parse);
			});

			if (laylaSexlevel >= 5) {
				Text.Add("Suddenly, you find yourself incapable of doing anything but grinding into Layla’s pussy as the chimera’s strong legs close around your sides, holding you in place - despite that it still feels like you’re thrusting into her at an ever accelerating pace.", parse);
				Text.NL();
				Text.Add("Looking up at Layla’s eyes, you see that she’s smiling confidently at you, and you immediately catch on to her plan. She’s using her vaginal muscles to milk you while you hold still within her.", parse);
				Text.NL();
				Text.Add("It’s simply an incredible experience. If you were to close your eyes, you might be able to fool yourself into thinking that nothing had changed, and that you were still relentlessly plowing your inhuman lover, feeling her sensitive walls washing back and forth along your cock.", parse);
				Text.NL();
				parse.c = player.FirstCock() ? ", and certainly no sudden chill brushing across sensitive flesh as it temporarily parts from her warm, wet fuckhole" : "";
				Text.Add("At the same time, it’s clearly impossible. There’s no sensation of motion on your end at all[c]. Even the sound is different; a sort of wet slurping rather than the loud, crudely satisfying meaty slap of flesh on flesh.", parse);
				Text.NL();
				parse.c = player.FirstCock() ? " and feel" : "";
				Text.Add("You can hear[c] the juices in her cunt being swirled and sloshed around your shaft as the greedy chimera tries to drag you ever deeper. Such is her excitement that you can dimly feel her feminine honey seeping out of the seal of her honeypot, oozing across your skin where you are pressed between her thighs.", parse);
				Text.NL();
				Text.Add("As pleasant as this is, though, you have no intention of just lying here and letting her do all the work. Your hands fasten themselves on the chimera’s tits, visibly swollen beyond their former roundness - but that just gives you ample boobage to play with.", parse);
				Text.NL();
				Text.Add("Layla moans appreciatively as your fingers sweep across her nipples, playfully pinching and kneading with forefinger and thumb. You press the tips of your index fingers to her dark gray pearls, pushing with insistent gentleness until they start to slip inside. Layla arches her back, mewling with pleasure as you tenderly penetrate her hidden nipple-cunts.", parse);
				Text.NL();
				Text.Add("Through it all, you gyrate your hips, tugging your cock as best you can. Her grip is too tight for you to have a hope of escaping, but neither of you really minds.", parse);
				if (p1cock.Knot()) {
					parse.knot  = p1cock.KnotShort();
					Text.Add(" Although your slowly growing [knot] is making it even harder for you to move...", parse);
				}
				Text.NL();
				Text.Add("As your chimera lover’s arms envelop you, pulling you into a passionate kiss, you have the distinct feeling of something snaking its way up your [leg]. You pay it no mind at first, simply focusing on fighting Layla’s tongue as the two of you battle for dominance during your making out, but when you feel the tip of her tail gently brush along the valley of your ass, you break the kiss.", parse);
				Text.NL();
				Text.Add("<i>“May I?”</i> she asks, exposing the cock hidden within the tip and gently pressing it to your [anus].", parse);
				Text.Flush();

				// [Allow][Deny]
				const options: IChoice[] = [];
				options.push({ nameStr : "Allow",
					tooltip : "Fair is fair, after all...",
					func() {
						Text.Clear();
						Text.Add("You simply nod your assent.", parse);
						Text.NL();
						parse.av = player.Butt().virgin ? ", even though she’s taking your virginity" : "";
						Text.Add("Smiling softly, the chimera begins pressing into your [anus]. She doesn’t make too much effort to pierce your sphincter, but when her tail-cock spurts a small rope of its aphrodisiac juice, you find yourself unable to resist, even involuntarily. Your [anus] relaxes enough to let her tip inside, and once it’s in, the rest of the shaft follows. The slick juices coating her member make her entry easy and painless[av].", parse);
						Text.NL();

						Sex.Anal(layla, player);
						player.FuckAnal(player.Butt(), layla.FirstCock(), 1);
						layla.Fuck(layla.FirstCock(), 1);

						Text.Add("You can’t help the moan that escapes your mouth as you feel her long, flexible shaft burrowing into your butt. Sinuous and undulating, it rises higher inside of you, flexing in a way that makes you feel like you are melting around it.", parse);
						Text.NL();
						Text.Add("Without thinking, you clamp down with your ass, clenching and releasing in an attempt to milk her secondary shaft. Your efforts reward you with a sudden rush of wet warmth within you, sending a fire burning through your guts. Your heart hammers in your chest, racing faster as lust boils inside of you, compelling you to moan in desire as you try to keep up with both thrusting and milking.", parse);

						opts.TailPeg = true;
						Gui.PrintDefaultOptions();
					}, enabled : true,
				});
				options.push({ nameStr : "Deny",
					tooltip : "There’s only one cock going in a hole this time.",
					func() {
						Text.Clear();
						Text.Add("You can’t bring yourself to speak, and so you simply shake your head.", parse);
						Text.NL();
						Text.Add("Layla smiles softly and you feel the skin of her tail closing up. <i>“Okay,”</i> she replies, moving her prehensile appendage to wrap around your waist in an impromptu hug.", parse);
						Gui.PrintDefaultOptions();
					}, enabled : true,
				});
				Gui.SetButtonsFromList(options, false, undefined);
			} else if (laylaSexlevel >= 3) {
				Text.Add("Layla suddenly springs forth, wrapping her arms around you into a hug as she presses her lips to yours, gently licking them and seeking entrance.", parse);
				Text.NL();
				Text.Add("With a half-amused, half-aroused purr, you melt into the chimera’s embrace, opening your lips and playfully sucking her tongue into your mouth as you wrap your arms around her in turn. Her taste washes over your [tongue] and you greedily drink it in, tightening your grip to ensure you can plumb her depths to their fullest.", parse);
				Text.NL();
				Text.Add("Your world recedes to the feel of Layla’s smooth, warm skin against your [skin], her soft breasts pressed to your [breasts], her limbs folded around you. Even with her scent and her taste captivating you, you can still feel something ghosting across your [butt].", parse);
				Text.NL();
				Text.Add("Puzzled, you break your lip-lock with the chimera, uttering a quizzical grunt as you try to look back over your shoulder and see what it is that’s caressing you so intimately. It slowly flicks into your view, and you realize that it’s Layla’s tail that has been brushing you.", parse);
				Text.NL();
				Text.Add("She smiles and grinds her tail against your taint. <i>“May I?”</i>", parse);
				Text.NL();
				Text.Add("It’s good that she thinks to ask first. Still, will you let her?", parse);
				Text.Flush();

				// [Allow][Deny]
				const options: IChoice[] = [];
				options.push({ nameStr : "Allow",
					tooltip : "She asked first, and it’s only fair, given you’re sticking her already...",
					func() {
						Text.Clear();
						Text.Add("Smiling, you tell her to go right ahead; you trust her to be gentle. Then you happily bend forward to try and capture her lips again.", parse);
						Text.NL();
						Text.Add("Layla eagerly accepts your kiss, dragging her tail through the valley of your butt until the tip is aligned with your pucker. Using her extraordinary control, she gently massages your [anus], trying to dilate your sphincter in preparation for what’s to come.", parse);
						Text.NL();
						Text.Add("You inhale and exhale slowly and steadily in an effort to relax yourself. As best you can, you bring yourself under control, allowing your muscles to slacken so that Layla will have an easier time entering you.", parse);
						Text.NL();
						Text.Add("Layla’s lips curl in a knowing smile as she watches you preparing yourself for her. You can feel the wet, smooth flesh of her now-exposed dick gently trace your ring. It spirals over your skin, smearing you with her aphrodisiac pre-cum and causing a tingling warmth to blossom in your ass.", parse);
						Text.NL();
						Text.Add("You moan fervently in desire, filled with a need to let her in. She deems you ready and tenderly aligns herself with your opening, pushing her tail-cock against your loosened sphincter.", parse);
						Text.NL();

						const virgin = player.Butt().virgin;

						Sex.Anal(layla, player);
						player.FuckAnal(player.Butt(), layla.FirstCock(), 1);
						layla.Fuck(layla.FirstCock(), 1);

						Text.Add("In your state, you couldn’t resist even if you tried; you can feel yourself stretching open around her invading tail-cock with the slightest of effort. She slides inside as easily as if you were a glove, just made to fit her peculiar member, and you mewl lustily at the thought.", parse);
						Text.NL();
						Text.Add("Thick ropes of pre-cum flow from her cumvein, trickling over every ridge and wrinkle of your interior as she pushes deeper inside. In its wake comes a bloom of warmth, a heady feeling of desire and pleasure that burns its way to your gut before racing up along your spine. You <b>need</b> her within you, and you plead with her to give you her wonderful cock, avidly grinding back against her as best you can.", parse);
						Text.NL();
						if (virgin) {
							Text.Add("You don’t even care at the slight twinge of pain as your inexperienced walls are pulled out of shape, popping your black cherry once and for all. All that matters is taking her tail-cock to the very hilt, maybe even beyond if she deigns.", parse);
							Text.NL();
						}
						Text.Add("Layla giggles softly, she starts pumping into you as soon as she hilts herself.", parse);

						opts.TailPeg = true;

						Gui.PrintDefaultOptions();
					}, enabled : true,
				});
				options.push({ nameStr : "Deny",
					tooltip : "No, this is supposed to be about you penetrating her; she can keep that cock to herself.",
					func() {
						Text.Clear();
						Text.Add("With a shake for emphasis, you tell her to put that tail away.", parse);
						Text.NL();
						Text.Add("<i>“Sorry,”</i> she says, immediately pulling her tail away.", parse);
						Text.NL();
						Text.Add("It’s alright, but it’s a good thing that she asked first. You gently kiss her on the forehead to show your approval.", parse);
						Text.NL();
						Text.Add("The chimera smile softly at that.", parse);
						Text.NL();
						Text.Add("You can feel her prehensile appendage drape itself affectionately over your [legs], but you dismiss it as unimportant, turning your attention to far more pleasant matters at hand.", parse);
						Gui.PrintDefaultOptions();
					}, enabled : true,
				});
				Gui.SetButtonsFromList(options, false, undefined);
			} else {
				Text.Add("Throughout your efforts, you try to pay attention to Layla’s reactions. You carefully listen to her gasps and moans, trying to use them to help you gauge how well you’re pleasing her. When her eyes flutter closed and her lips part in a silent cry, you know you’ve found her G-spot, and you try to focus your efforts on it.", parse);
				Gui.PrintDefaultOptions();
			}
		});

		Gui.SetButtonsFromList(options, false, undefined);
	}

	export function SexPitchVaginalCont3(opts: any, p1cock: Cock, parse: any) {
		const player: Player = GAME().player;
		const layla = GAME().layla;

		Text.NL();
		if (player.FirstCock()) {
			parse.tj = opts.TailJuice ? " Her aphrodisiac fluids burn against your throbbing member, enflaming you with the need to empty yourself into her receptive womb." : "";
			parse.tp = opts.TailPeg ? " The constant thrusting of her pulsating tail-cock into your ass only serves as a counterpoint, stirring the flames of lust burning within you." : "";
			Text.Add("As you thrust away with all your might, you can feel the pleasure welling inside of you. Layla’s cunt feels so good wrapped around your aching, needy [cock]...[tj][tp]", parse);
			Text.NL();
			parse.lc = opts.LCock ? ", her own throbbing erection emphasizing her state" : "";
			Text.Add("Beneath you, Layla moans and mewls, panting so hard that her luscious breasts jiggle hypnotically atop her chest. You can feel her squeezing you with an almost vice-like grip[lc] - she’s almost as close as you are.", parse);
			Text.NL();
			if (p1cock.Knot()) {
				parse.knot = p1cock.KnotShort();
				Text.Add("You can feel your [knot] bulging, growing ready to anchor you solidly in place and make sure you fill the chimera’s womb with your seed. If you don’t intend to inseminate her, then you better make a decision quickly!", parse);
			} else {
				Text.Add("You can feel the cum welling up inside of you, a strange pressure ", parse);
				if (player.HasBalls()) {
					Text.Add("in your aching [balls],", parse);
				} else {
					Text.Add("at the base of your spine,", parse);
				}
				Text.Add(" and you know that you can’t hold out much longer. You have to choose: let the chimera’s greedy cunt have it all, or pull out and give her a good hosing down instead.", parse);
			}
			Text.Flush();

			// [Inside][Pull out]
			const options: IChoice[] = [];
			options.push({ nameStr : "Inside",
				tooltip : "You haven’t gone through all this to waste it; aim for her womb and let fly!",
				func() {
					Text.Clear();
					parse.tp = opts.TailPeg ? Text.Parse(" As if in return, she renews her own thrusting into your increasingly sloppy [anus].", parse) : "";
					Text.Add("Mind made up, you slam yourself back into Layla’s pussy with a renewed vigor.[tp] The two of you grunt, gasp and groan in unison as your hips slam together, pleasure crackling through your body.", parse);
					Text.NL();
					parse.k = p1cock.Knot() ? Text.Parse("Your [knot] bulges obscenely, anchoring you solidly in place to ensure that not a drop will go to waste, and then you", parse) : "You";
					Text.Add("Finally, you thrust your [cock] into Layla’s womanhood one last time, burying it as deeply as possible. [k] throw your head back, crying out in pleasure as you empty yourself into Layla’s waiting womb.", parse);
					Text.NL();

					// #PC cums inside Layla
					let cum = layla.OrgasmCum();
					cum = player.OrgasmCum();

					Text.Add("Underneath you, the chimera writhes in the throes of her own pleasure, crying out as the feel of your cum pouring into her waiting tunnel triggers her to climax in turn.", parse);

					LaylaScenes.SexPitchVaginalVariable(opts, p1cock, parse);

					Text.NL();
					parse.c = player.NumCocks() > 1 ? Text.Parse(", your other neglected cock[s2] spewing [itsTheir2] share of seed on the ground beneath her", parse) : "";
					Text.Add("Through it all, you can only hold on as your cock erupts inside of Layla’s cunt[c].", parse);
					Text.NL();

					// #if TailJuice OR TailPeg is set, increase PC.cumlevel by +1 level. If Tailjuice AND Tailpeg are set, increase PC.cumlevel by +2 levels.
					let multiplier = 1;
					if (opts.TailJuice) { multiplier++; }
					if (opts.TailPeg) { multiplier++; }

					cum = cum * multiplier;

					LaylaScenes.Impregnate(layla, player, cum);

					if (cum < 3) {
						Text.Add("Thick, sloppy ropes of seed pour from your manhood, effortlessly sucked away by the chimera’s milking walls and ferried off to her womb.", parse);
					} else if (cum < 6) {
						Text.Add("A great gush of fluids pours from your member, Layla greedily milking you of every drop. By the time you feel yourself run dry, you have packed her completely to the brim, letting you feel your own seed sloshing around your cock as she idly ripples her netherlips.", parse);
					} else if (cum < 9) {
						Text.Add("Even with her inhuman womanhood, Layla seems slightly overwhelmed. Her belly visibly bloats, rising gently like a loaf in an oven as you fill her to the brink and beyond, packing her womb with semen.", parse);
					} else {
						parse.cockknot = p1cock.Knot() ? "knot" : "cock";
						Text.Add("Not even Layla’s chimeric pussy can hope to keep up with the inhuman deluge of seed that you are producing. Tiny rivulets of cock-cream spurt out around your [cockknot], so pressurized that the tiniest gap becomes an emergency vent, whilst Layla’s belly balloons as if she were undergoing some sort of obscenely rapid pregnancy. By the time you finally finish, it visibly ripples atop her midriff, so jampacked with cum that it sloshes in time with her breathing.", parse);
					}
					Text.NL();
					Text.Add("Panting for breath, you slowly start to pull your cock free of Layla’s womanhood. ", parse);
					if (p1cock.Knot()) {
						Text.Add("At least, that’s your initial intention. The swollen bulb of flesh at the end of your [cock] has something different to say. Brain still clouded with post-orgasmic haze, you absently tug with your loins, making Layla’s hips jerk as your knot stubbornly refuses to go anywhere.", parse);
						Text.NL();
						Text.Add("The puffing chimera looks at you quizzically. When you try and pull out again, you can feel her netherlips shifting; they ripple softly over your flesh as they open, stretching wide enough that your cock slides free without any further effort.", parse);
					} else {
						Text.Add("There is a slight resistance, but when you persist you can feel yourself slowly pulling free of the sucking grip of Layla’s cunt.", parse);
					}
					Text.NL();
					Text.Add("Once free, you collapse on the ground with a long, soft sigh of release. Absently leaning on one arm for support, you note that ", parse);
					if (cum < 6) {
						Text.Add("not a drop of your seed escapes the grip of Layla’s greedy netherlips.", parse);
					} else if (cum < 9) {
						Text.Add("a slow trickle of seed drools from between Layla’s netherlips, testimony to the sizeable load you just gave her.", parse);
 					} else {
						Text.Add("a sluggish streamer of cum is flowing from Layla’s netherlips, despite their best efforts to stem the flow. You clearly gave her more than even she can easily handle.", parse);
 					}

					LaylaScenes.SexPitchVaginalCummy(opts, p1cock, parse);

					Text.NL();
					Text.Add("The two of you contentedly lie where you are until you feel rested enough to head off once more. You pull your [armor] back on, Layla shapeshifts back into her mock-clothes, and you set off again.", parse);
					Text.Flush();

					TimeStep({hour: 2});

					Gui.NextPrompt();
				}, enabled : true,
			});
			options.push({ nameStr : "Pull out",
				tooltip : "Yank your cock out and see if you can paint Layla white with it!",
				func() {
					Text.Clear();
					parse.lc = opts.LCock ? ", absently frotting her own cock in the bargain" : "";
					Text.Add("Decision made, you pull as hard as you can on your next thrust out of Layla. The chimera’s disappointed mewl gives way to a croon of delight as you thrust back between her thighs; not penetrating, but roughly grinding your sloppy, juice-smeared dick over her cunt[lc].", parse);
					Text.NL();
					Text.Add("Lost in your pleasure, you absently thrust away, bucking your hips as you lose more and more of yourself to the haze clouding your mind. Your heart pounds in your chest, electricity crackles courses through your body, until you can’t take it anymore and cum erupts from your thrusting member[s].", parse);
					Text.NL();

					let cum = layla.OrgasmCum();
					cum = player.OrgasmCum();

					let multiplier = 1;
					if (opts.TailJuice) { multiplier++; }
					if (opts.TailPeg) { multiplier++; }

					cum = cum * multiplier;

					opts.CummyL = true;

					if (cum < 3) {
						Text.Add("A few ropes of seed fling themselves over Layla, draping her [belly] in pearly streamers of semen before you run dry.", parse);
					} else if (cum < 6) {
						Text.Add("A volley of shots launch themselves over Layla, stretching across her belly to her breasts, painting her in so many strands of semen that she looks covered in perverse spider’s silk.", parse);
					} else if (cum < 9) {
						Text.Add("A veritable tidal wave of semen spews forth from your pulsating member[s], covering Layla from crotch to face in cum. Her formerly grey and silver skin has been rendered almost completely off-white, so thoroughly have you basted her in sperm.", parse);
					} else {
						Text.Add("Words don’t exist to describe the geyser of semen that pours from your loins. It washes across Layla as if you have turned a perverse hose on her, completely soaking her entire body in your seed. By the time you finally run dry, every inch of her above the waist has been covered in a thick, dripping layer of cum, and she is wallowing in a shallow puddle of the same.", parse);
					}

					LaylaScenes.SexPitchVaginalVariable(opts, p1cock, parse);

					Text.NL();
					Text.Add("You settle back, panting softly as you catch your breath, taking in the mess you made of your chimeric lover.", parse);

					LaylaScenes.SexPitchVaginalCummy(opts, p1cock, parse);

					Text.NL();
					Text.Add("The two of you contentedly lie where you are until you feel rested enough to head off once more. You pull your [armor] back on, Layla shapeshifts back into her mock-clothes, and set off again.", parse);
					Text.Flush();

					TimeStep({hour: 2});

					Gui.NextPrompt();
				}, enabled : true,
			});
			Gui.SetButtonsFromList(options, false, undefined);
		} else {
			Text.Add("You can feel your heart pounding with arousal as you watch Layla mewling and writhing under your ministrations. You may not be getting quite the same pleasure out of this that she is, but the show is certainly worth it! On that thought, you redouble your efforts, determined to push the teetering chimera cleanly over the brink of her restraint.", parse);
			Text.NL();

			const cum = layla.OrgasmCum();

			Text.Add("Inevitably, Layla can’t hold out, and her short, sharp gasps of pleasure give way to a full-throated scream of ecstasy. Her cunt latches onto your precious strap-on with such ferocity that, for a moment, you almost fear she’s going to break it.", parse);
			if (opts.LCock) {
				Text.Add(" As if in counterpoint to her feminine climax, the chimera’s throbbing blue dick erupts, spraying pearly ropes of seed all over her belly, a few even stretching up far enough to spatter across her heaving breasts and open mouth.", parse);
				opts.CummyL = true;
			}
			Text.NL();
			if (opts.TailPeg) {
				Text.Add("You receive a very pointed reminder of the chimera’s anatomy when her tail-cock suddenly thrusts itself fiercely into your ass. A great jet of fizzling pseudo-cum erupts into your nethers, sloshing madly through your depths and sending a sharp spike of lust burning through your veins.", parse);
				Text.NL();
				Text.Add("Overwhelmed by the liquid fire burning in your guts, you moan throatily in desire, only to feel Layla’s tail go limp and start to slowly fall from between your clenched buttocks. So close! But it’s just not enough to get you off, not on its own...", parse);
				Text.NL();

				player.AddLustFraction(1);
			}
			Text.Add("You patiently wait for Layla’s cries and thrashing to quiet down as she rides the wave of orgasm to its conclusion. Once she lies still and panting on the ground, you carefully withdraw from between her legs, pulling insistently as she absently attempts to keep you locked inside.", parse);
			Text.NL();
			Text.Add("Once you have freed yourself of your depths, you reach down and unfasten your toy from about your hips. Checking it over to make sure she didn’t break it when she was squeezing so hard, you idly quip that it looks like she enjoyed that a lot.", parse);
			Text.NL();
			Text.Add("<i>”Y-yeah,”</i> she replies, voice still shaky from her climax.", parse);
			if (opts.LCock) {
				Text.Add(" Her tongue extends to lick a wad of cum still stuck on her nose.", parse);
			}
			Text.NL();
			Text.Add("That’s good to hear. Now, would she mind helping you out in return? You haven’t had a chance to cum yet...", parse);
			Text.NL();
			Text.Add("<i>”Sure!”</i> she replies enthusiastically. <i>”What should I do?”</i>", parse);
			Text.NL();
			Text.Add("You pause for a moment to consider your reply.", parse);
			Text.Flush();

			// [Frig] [Lick] [Cock] [Tentacles]
			const options: IChoice[] = [];
			options.push({ nameStr : "Frig",
				tooltip : "Let’s see what she can do with those long, slender fingers of hers.",
				func() {
					Text.Clear();
					Text.Add("You slowly crawl forward until you are level with Layla’s face, putting your overheated [vag] within easy reach. You reach out and possessively clasp one of Layla’s hands, bringing it around to rest atop your cunt. A lustful grin spreads across your lips as you tell Layla to show you what her fingers can do.", parse);
					Text.NL();
					Text.Add("<i>”O-okay.”</i> She smiles softly.", parse);
					Text.NL();
					Text.Add("Layla starts by gently caressing your labia, barely inching her fingers inside as she traces along your slit.", parse);
					Text.NL();
					Text.Add("You moan appreciatively, shivering softly as the chimera’s cool skin brushes over your flushed flesh. Even just this hint of penetration is enough to set you on edge, making you beg for more.", parse);
					Text.NL();
					Text.Add("The chimera needs no further encouragement. Her nimble digits dance along your womanhood, caressing you inside and out as she starts to finger you in earnest. Your heart pounds in your chest, panting sharply as pleasure crackles under your skin. You can’t - you can’t hold out much longer!", parse);
					Text.NL();
					Text.Add("When Layla deftly tweaks your [clit] between her fingers, your meager wall of resistance crumbles. Your cunt clenches down around the chimera’s digits with all your might, spots flashing in the darkness of your screwed shut eyes as you cum.", parse);
					Text.NL();

					const cum = player.OrgasmCum();

					Text.Add("A great mewl of pleasure bursts from your lips, trailing away into a sigh of relief as the intense pleasure dwindles to the warmth of afterglow. Your body goes limp, causing you to slump gently against Layla’s shoulder for support. With a languid purr of pleasure, you open your eyes and congratulate Layla on her talents - that was just what you needed.", parse);
					Text.NL();
					Text.Add("Layla simply hugs you and lies down on the ground, letting you rest your head on her bosom.", parse);
					Text.NL();
					Text.Add("With a contented sigh, you nuzzle down into the impromptu pillow, gently twining your arms around her. This suits you just fine as a place to rest before you have to be on your way...", parse);
					Text.Flush();

					TimeStep({hour: 2});

					Gui.NextPrompt();
				}, enabled : true,
			});
			options.push({ nameStr : "Lick",
				tooltip : "That tongue of hers is just made for licking pussy.",
				func() {
					Text.Clear();
					Text.Add("Licking your own lips salaciously at the thought, you lazily curl around and start to creep forward. You crawl your way slowly and deliberately across the supine chimera’s body, intent on your goal.", parse);
					if (opts.LCock) {
						Text.Add(" When your enflamed [vag] brushes against the chimera’s still half-erect cock, a flare of temptation flickers inside of you, but you have other plans, and so you continue on.", parse);
					}
					Text.NL();
					Text.Add("You don’t stop until you have slithered your way to Layla’s torso, allowing you to thrust your pussy right into her face and give her one simple command: <i>”Lick me”</i>.", parse);
					Text.NL();
					Text.Add("Layla responds without hesitation, licking your [vag] from the base to the very tip of your [clit]. You moan with abandon at the touch of her warm, wet, dexterous tongue.", parse);
					Text.NL();
					Text.Add("She smacks her lips, tasting you before she spreads you open with her fingers and plunges her tongue inside your depths.", parse);
					Text.NL();
					Text.Add("You arch your back and mewl as she fills you in a way that is like, yet so unlike, anything fingers or a cock can do. Hells, no <b>human</b> tongue could do this to you! You can feel it slithering like a wet, playful snake, lapping teasingly inside of your tunnel as it crawls deeper, and deeper - how far is she going to go?!", parse);
					Text.NL();
					Text.Add("Sparks flash in front of your eyes as you feel a strange fluttering deep inside your belly. Looks like that’s answered your question - Layla’s tongue has reached all the way to your cervix! You... oh, gods, you can’t - can’t!", parse);
					Text.NL();

					const cum = player.OrgasmCum();

					Text.Add("You squeal in pleasure as the fluttering sensation finally proves too much to resist. Your tunnel grips the gently flicking tongue as hard as it can, squeezing the soft, squishy flesh as your cum pours down its length. Layla does her best to swallow, but with her tongue trapped inside of you more of your honey pours over her cheeks than goes down her throat.", parse);
					Text.NL();
					Text.Add("With a final shudder, you drizzle one last coating of girlcream over Layla’s face, and then go limp. Sighing softly in pleasure, you moan weakly as you feel the chimera’s tongue slowly slide out of your cunt. Once it’s no longer anchoring you to Layla’s face, you gingerly sweep yourself off of her, settling down on your side beside the messy-faced humanoid.", parse);
					Text.NL();
					Text.Add("Gently reaching out, you pull Layla lightly into your arms, nuzzling into her shoulder with a sigh of pleasure as you spoon her. You thank her for her efforts; that really was something else. After a moment’s thought, you add an absent apology about the mess.", parse);
					Text.NL();
					Text.Add("<i>”It’s okay,”</i> she replies, licking her face to clean herself of your juices.", parse);
					Text.NL();
					Text.Add("That’s good. You yawn gently and allow your eyes to close. You think you’ll just take a little nap before you go anywhere, first.", parse);
					Text.Flush();

					TimeStep({hour: 2});

					Gui.NextPrompt();
				}, enabled : true,
			});
			options.push({ nameStr : "Cock",
				tooltip : "You gave her your ‘cock’, so she can give you hers now.",
				func() {
					Text.Clear();
					if (opts.LCock) {
						Text.Add("The sight of the chimera’s indigo-fleshed phallus lying limply against her belly gives you pause. You can’t do anything with her in <i>that</i> sort of shape! But... that’s easily corrected. As a mischievous grin crosses your face, you reach out and tenderly clasp Layla’s cock.", parse);
						Text.NL();
						if (player.Slut() >= 25) {
							Text.Add("Once you have it pointed towards your face, you resettle yourself so you can descend on it with tongue poised and ready. You lovingly lick the chimera cock from dormant knot to glans, savoring the hints of her cum as you lap her shaft.", parse);
							Text.NL();
							Text.Add("With smooth, easy motions, you polish her while occasionally stopping to kiss her cock with deep, gently suckling smooches.", parse);
							Text.NL();
							Text.Add("Layla mewls and moans, quivering as you assault her so intimately. You can feel her shaft hardening under your lips, her heartbeat pulsing through its veins. Only when the first precious bead of pre-cum wells from her glans do you stop your ministrations, smacking your lips appreciatively as you lift your head.", parse);
						} else {
							Text.Add("You can feel her heartbeat, the sprawling veins hidden beneath her blue flesh pulsing gently against your fingers. Her excitement - even in her depleted state - is palpable to you, giving you the confidence to do what you need to do.", parse);
							Text.NL();
							Text.Add("Slowly, gently, you start to stroke her shaft. Layla moans quietly as your hand tenderly caresses her, steadily building up the pace until you are rhythmically pumping her girl-cock.", parse);
							Text.NL();
							Text.Add("Chimeric dickmeat starts to stiffen against your palm, your dancing fingers slowly coaxing it back to life. Your tongue glides impatiently across your lips as the first beautiful bead of pre-cum wells from the depths of Layla’s hidden balls. Impatient to begin, you remove your digits from around her cock, even as the horny mutant mewls a meek protest.", parse);
						}
					} else {
						Text.Add("Your flushed netherlips squeeze themselves together, drooling in their hunger. You know for a fact that Layla has just what you’re craving... but first, you have to coax it out of her.", parse);
						Text.NL();
						Text.Add("A hungry grin spreads across your lips as your fingers lightly stroke the chimera’s crotch - too high to even brush her own goo-streaked pussy lips, but just right to brush whatever hidden slit conceals her cock.", parse);
						Text.NL();
						Text.Add("As you trace a spiral over Layla’s groin, you lightly tell her that you’d just love it if she’d bring her little friend here out for you to play with.", parse);
						Text.NL();
						Text.Add("<i>”Oh-okay!”</i> she cries, barely stifling a moan of lust.", parse);
						Text.NL();
						Text.Add("No matter how many times you see it, it always fascinates you. One second, Layla’s crotch is smooth and perfectly feminine. The next, the blunted head of her cock rises from her flesh, like a creature surfacing from the depths of a still pond.", parse);
						Text.NL();
						Text.Add("It grows proudly from her loins - already firm and solid - ready for you to mount, but... there’s a little something missing...", parse);
						Text.NL();
						Text.Add("Your hand snakes down to the base of Layla’s dick, your thumb stretching out to glide along the underside of her shaft. As you caress her, Layla moans softly, visibly shivering at your touch.", parse);
						Text.NL();
						Text.Add("Her cock throbs as her heart starts to race in her chest, but you are relentless. You don’t stop stroking her until pre-cum beads at her cocktip... perfect. Now you’re both ready. Despite Layla’s meek moan of protest, you cease caressing her.", parse);
					}
					Text.NL();
					Text.Add("Before Layla can even think of calming down, you swing yourself forward. Clambering into Layla’s lap, you impatiently align yourself with her dripping dick and then thrust yourself downward.", parse);
					Text.NL();
					Text.Add("In your aroused state, you couldn’t hold back your sharp cry of pleasure if you tried. The feeling of her indigo length of man-meat spearing into you, filling your cunt with the delicious fullness that you so craved, is just too much. Layla herself arches her back, gasping deeply as she revels in your greedy womanhood wrapping itself tightly around her cock. You can sense her throbbing within you as you clench down, doing your best to milk her as you feed inch after wonderful inch inside.", parse);
					Text.NL();
					Text.Add("The slap of flesh-on-flesh echoes as the two of you thrust together, locked at the hips. Warmth wells inside of you, burning in your depths; you can’t hold out much longer, and from the gasping cries falling from Layla’s lips, she can’t either.", parse);
					Text.NL();

					let cum = player.OrgasmCum();

					cum = layla.OrgasmCum();

					LaylaScenes.Impregnate(player, layla, cum, PregnancyHandler.Slot.Vag);

					Text.Add("You can’t tell which of you breaks down first. The two of you sing your pleasure together, crooning in bliss as you reach a mutual climax. Hot jets of thick, sticky girl-seed gush up your cunt, soothing the itch that has been driving you mad, even as a mixture of cum and feminine honey slops over Layla’s thighs.", parse);
					Text.NL();
					Text.Add("By the time you both fall slack, panting for breath as Layla absently helps you balance atop of her, your belly is visibly rounded, several inches gained from the sheer volume of her seed packed away inside. But you couldn’t care less; you feel sooo good...", parse);
					Text.NL();
					Text.Add("Sighing happily, you bend forward to ask Layla how she enjoyed that... only to get a quiet, girlish snore in response. You wore the poor girl out.", parse);
					Text.NL();
					Text.Add("Despite yourself, an amused smile spreads across your face as you carefully lie down atop her. Getting a little shut-eye sounds good to you... and she makes a lovely little body pillow.", parse);
					Text.Flush();

					TimeStep({hour: 2});

					Gui.NextPrompt();
				}, enabled : true,
			});
			options.push({ nameStr : "Tentacles",
				tooltip : "How can you pass up the extravaganza of tentacles?",
				func() {
					Text.Clear();
					Text.Add("Grinning widely, you inform the chimera you feel adventurous. You want her to show you just what she can do with all those yummy tentacles of hers.", parse);
					Text.NL();
					Text.Add("<i>”Okay!”</i> she chirps happily, already willing her skin to shift.", parse);
					Text.NL();
					Text.Add("You lick your lips as Layla’s body sprouts its forest of near-black tentacles, the long, blunt appendages writhing in anticipation as they curl through the air towards you. You barely have time to settle yourself, [legs] adjusted to ensure she has maximum access to your aching cunt, before they have reached you.", parse);
					Text.NL();
					const pbreasts = player.FirstBreastRow().Size() >= 3;
					parse.b = pbreasts ? Text.Parse(" pair on your [breasts], one", parse) : "";
					Text.Add("The chimera’s wiggling appendages begin their assault in earnest, a pair of them settling between your legs, another[b] on your [anus], and one for your mouth. The remaining ones encircle you, holding you steady and nudging you to move into the correct position.", parse);
					Text.NL();
					Text.Add("The first tentacle to begin vibrating is the one inside your mouth, gently massaging your [tongue]. A muffled moan bubbles up your throat and you eagerly fellate said tentacle, caressing it with your [tongue] as it writhes in your mouth.", parse);
					Text.NL();
					if (pbreasts) {
						Text.Add("You gasp as you feel the tentacles on your [breasts] begin to move next. The vibrating, bulbous tip of each one teasing your erect nubs; if it was possible for them to grow any harder, you know they would!", parse);
						Text.NL();
					}

					Sex.Anal(layla, player);
					player.FuckAnal(player.Butt(), layla.FirstCock(), 1);
					layla.Fuck(layla.FirstCock(), 1);

					Text.Add("A mild discomfort is all the indication you get that the tentacle nestling your [anus] has slipped in. It’s otherwise completely painless, and as soon as it starts vibrating, you forget all about the discomfort. Instead, you moan around the tentacle in your mouth, trying to grind back against this anal invader and coax it deeper inside.", parse);
					Text.NL();

					Sex.Vaginal(layla, player);
					player.FuckVag(player.FirstVag(), layla.FirstCock(), 1);
					layla.Fuck(layla.FirstCock(), 1);

					Text.Add("With the final pair, Layla nuzzles your [clit] with one, immediately beginning to vibrate it while the other doing likewise as it enters your wet [vag]. You arch your back in shock, crying out around your impromptu gag; this is, is beyond anything any human lover could do to you! You, you can’t hold on!", parse);
					Text.NL();

					const cum = player.OrgasmCum();

					Text.Add("You doubt you’d have been able to hold out against the chimera’s perverse assault if you had been fresh; in your current state, you cum like a bomb. You can’t remember the last time you came this hard; all your senses locked in wave after wave of mind-scrambling bliss as your body spasms again, and again...", parse);
					Text.NL();
					Text.Add("By the time Layla stops teasing you with her many limbs, you are lying in a sizeable pool of your own juices. As she carefully draws her sticky, dripping tips from your various holes, you are incapable of responding, too busy panting desperately for breath.", parse);
					Text.NL();
					Text.Add("<i>”Are you okay?”</i>", parse);
					Text.NL();
					Text.Add("Your chest heaves as you pant for air, before you manage to wheeze out that you’re fine... just exhausted. You think you’re going to take a little nap now...", parse);
					Text.NL();
					Text.Add("<i>”I think - yawn - I could use a nap too,”</i> she says, crawling towards you to gently hug and cuddle you.", parse);
					Text.NL();
					Text.Add("You sigh softly, wrapping your own arms around her in turn, and allow yourself to drift off to sleep. Tired and sticky, you bathe in the warm afterglow of one <b>hell</b> of a fucking.", parse);
					Text.Flush();

					TimeStep({hour: 2});

					Gui.NextPrompt();
				}, enabled : true,
			});
			Gui.SetButtonsFromList(options, false, undefined);
		}
	}

	export function SexPitchVaginalVariable(opts: any, p1cock: Cock, parse: any) {
		const layla = GAME().layla;

		if (opts.LCock) {
			Text.NL();
			Text.Add("Her blue cock visibly pulsates, throbbing madly with her pleasure before it distends and erupts in a sympathetic male orgasm. Great arcs of chimera seed soar through the air, painting ropes of off-white all over her belly and breasts. Some even shoots so far as to spatter onto her face and into her gaping mouth, prompting her tongue to whip out and lap her face clean.", parse);

			const cum = layla.OrgasmCum();

			opts.CummyL = true;
		}
		if (opts.TailPeg) {
			Text.NL();
			Text.Add("The quivering sensation between your clenching buttocks is the only warning you get before Layla’s tail drives itself home in a single sharp thrust, shooting forward so powerfully that she buries all of her cock and even a few inches of tail-meat inside of you.", parse);
			Text.NL();

			const cum = layla.OrgasmCum();

			Text.Add("You can feel your prostate being mercilessly ground under her invading member, but that pales in comparison to the explosion of liquid warmth that rushes inside of you. Layla’s tail spews a veritable geyser of pseudo-seed into your innards, the cascade of cream rushing up into your depths through sheer force; you can actually feel it fizzing around inside your stomach.", parse);
			Text.NL();
			Text.Add("Her first jet floods your ass, but Layla’s tail doesn’t seem to have much staying power. After this first jet, she pulls out, leaving a small trail of aphrodisiac cum dripping from your used [anus].", parse);
		}
	}

	export function SexPitchVaginalCummy(opts: any, p1cock: Cock, parse: any) {
		Text.NL();
		if (opts.CummyL) {
			Text.Add("Layla sits up, still a bit sluggish after the sex. Once she’s had time to catch her breath, she busies herself with licking the cum off her body, her long tongue extending to catch every little wad of semen still clinging to her.", parse);
			Text.NL();
			Text.Add("You watch the show appreciatively, allowing yourself to indulge in some pleasant daydreams as to what she could potentially do with that tongue of hers - when you’ve caught your breath, that is.", parse);
			Text.NL();
			Text.Add("<i>”That was good!”</i> she says with a big smile.", parse);
			Text.NL();
			Text.Add("You’re glad she enjoyed it so much. The two of you should do this again sometime, but right now you want to catch your breath.", parse);
			Text.NL();
			Text.Add("<i>”Okay.”</i>", parse);
		} else {
			Text.Add("Layla pants as she catches her breath. It doesn’t take long before she sits up and regards you with a smile.", parse);
			Text.NL();
			Text.Add("Returning her smile, you ask if she enjoyed herself.", parse);
			Text.NL();
			Text.Add("<i>”Very much! We should do that again.”</i>", parse);
			Text.NL();
			Text.Add("Indeed you should, but not right now.", parse);
		}
	}
}
