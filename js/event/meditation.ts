import { EncounterTable } from "../encountertable";
import { Entity } from "../entity";
import { GAME, TimeStep } from "../GAME";
import { Gui } from "../gui";
import { Party } from "../party";
import { Text } from "../text";

/*
 * Meditation scenes for the PC
 */

export namespace MeditationScenes {

	export function Entry() {
		const player: Entity = GAME().player;
		const party: Party = GAME().party;
		const kiakai: Entity = GAME().kiakai;
		const miranda: Entity = GAME().miranda;
		let parse: any = {
			playername : player.name,
			Kiai : kiakai.name,
		};
		parse = kiakai.ParserTags(parse);
		parse = kiakai.ParserPronouns(parse);

		const lust = player.LustLevel();
		const switchSpot = party.location.switchSpot();

		Text.Clear();
		if (lust >= 0.7) {
			Text.Add("Finally! At last, a moment to yourself, and just in the nick of time, too! Casting a furtive glance about, you spy a spot that looks like it’s fairly out of the way and make a beeline for it, focusing hard on your task in a bid to prevent the dirty thoughts vying for your attention from distracting you too much. It seems like a monumental effort, but at least you manage to make it there all in one piece.", parse);
			Text.NL();
			if (party.InParty(miranda, switchSpot)) {
				Text.Add("<i>“Seriously, [playername]?”</i> Miranda calls out after you as you hurry away. <i>“You sure you don’t want me to help you scratch that itch for you? It’d feel much better than that meditation crap, and with the same results to boot.”</i>", parse);
				Text.NL();
				Text.Add("No, no, you’ll just stick to what you were doing, if that’s all right with her.", parse);
				Text.NL();
				Text.Add("<i>“Sheesh, you’re no fun. All right then, chump - if you want to be all boring, don’t let me stop you. I’ll just be over there if you change your mind.”</i>", parse);
				Text.NL();
			}
			if (party.InParty(kiakai, switchSpot)) {
				Text.Add("Noticing you having trouble in getting a grip on yourself, [Kiai] moves over and places [hisher] hands on your shoulders. <i>“There, there, [playername],”</i> [heshe] says. <i>”I can understand that you are being troubled by untoward thoughts, and it is good that you are dealing with them this way instead of seeking release. Allow me to -”</i>", parse);
				Text.NL();
				Text.Add("Yes, that’s very nice and all, but could [heshe] please keep [hisher] distance? Having such a… um… fine specimen of elf so close on hand isn’t making matters easier for you.", parse);
				Text.NL();
				Text.Add("[Kiai] looks a little flustered. <i>“Oh, my apologies.”</i> [HeShe] quickly scoots away and takes a seat on the ground a healthy distance from you, facing in your direction. <i>“Well, I would be more than happy to provide any assistance I can; we can begin whenever you are ready.”</i>", parse);
				Text.NL();
			}
			Text.Add("Right. Now that you’re settled, you make yourself as comfortable as circumstances allow, ", parse);
			if (player.IsNaga()) {
				Text.Add("coiling your lower body tightly - although not <i>too</i> tightly and allowing yourself to relax", parse);
			} else if (player.IsTaur()) {
				Text.Add("bending your legs to shift some of your weight onto your underbelly as you lie down on the ground", parse);
			} else if (player.IsGoo()) {
				Text.Add("easing down your amorphous lower body to the ground", parse);
			} else {
				Text.Add("sitting down and crossing your legs. It’s not quite the lotus position, but it’ll have to do", parse);
			}
			Text.Add(". All right, now to get this done and over with before things get too out of hand.", parse);
		} else if (lust >= 0.3) {
			Text.Add("Making sure that the coast is all clear - or at least for the moment - you find a spot out of the way to rest and catch your breath. Since you’ve got some time to spare, you might as well scratch this itch before it threatens to overwhelm you.", parse);
			if (party.InParty(kiakai, switchSpot)) {
				Text.NL();
				Text.Add("Noticing what you’re doing, [Kiai] moves over and sits [himher]self down a respectful distance away from you, clearly intending to join in the exercise. You’re not particularly averse to the elf’s presence - if anything, having [himher] around is more than welcome. There’s something about having [himher] around that’s particularly conducive to the meditative exercise, and right now being a little more focused would help.", parse);
			}
		} else { // lust < 0.3
			Text.Add("Right. Now that you’ve got a moment to yourself, it’s time to deal with these troublesome thoughts before you start getting seriously distracted. They may not be particularly taxing on your higher thought functions for now, but it’s always a good idea to shovel the snow before you get stuck in it, so to speak. You make sure that your surroundings are safe, then find a small secluded spot out of sight to get started in, dusting off the ground and settling down, ", parse);
			if (player.IsNaga()) {
				Text.Add("packing your lower body into a tight coil", parse);
			} else if (player.IsTaur()) {
				Text.Add("folding your legs to rest on your underbelly", parse);
			} else if (player.IsGoo()) {
				Text.Add("plopping down delicately", parse);
			} else {
				Text.Add("sitting in a cross-legged position", parse);
			}
			Text.Add(" as you pull out your gem and focus your thoughts inward.", parse);
			if (party.InParty(kiakai, switchSpot)) {
				Text.NL();
				Text.Add("Seeing you get ready for meditation, [Kiai] ambles over to join in on the exercise, seating [himher]self across you a respectful distance away, careful not to intrude on your space. Whether you appreciate [hisher] presence or not, the elf’s very presence does make the atmosphere a little more conducive towards what you intend.", parse);
			}
		}
		Text.NL();

		// Scene selection

		const scenes = new EncounterTable();
		// Breathing exercises (with Kiai). Requires that Kiai be present in the party.
		scenes.AddEnc(() => {
			Text.Add("<i>“I have an idea, [playername]. Shall we go through some simple breathing exercises? They used to help me a lot when I was back at the temple and I needed to clear my mind of… uh… wayward thoughts.”</i>", parse);
			Text.NL();
			Text.Add("Well, it sounds like a decent plan. At least with [Kiai] about helping you with this, it’d probably be more effective than trying to meditate on your own.", parse);
			Text.NL();
			Text.Add("[Kiai] beams. <i>“Excellent! Yrissa did say they were excellent for calming the spirit and releasing negative energies from within both mind and body, and I know from my own experience that she was making an understatement when she said that. Without further ado, shall we begin? Just follow my lead - breathe in the good air that Aria has blessed us with today…”</i>", parse);
			Text.NL();
			Text.Add("<i>Gaaasp…</i>", parse);
			Text.NL();
			Text.Add("<i>“Out with the bad.”</i>", parse);
			Text.NL();
			Text.Add("<i>Cough, cough…</i>", parse);
			Text.NL();
			Text.Add("<i>“One more time. In with the good…”</i>", parse);
			Text.NL();
			Text.Add("<i>Gaaasp…</i>", parse);
			Text.NL();
			Text.Add("<i>“And out with the bad.”</i>", parse);
			Text.NL();
			Text.Add("<i>Wheeze cough cough…</i>", parse);
			Text.NL();
			Text.Add("[Kiai] smiles beatifically at you. <i>“How are you feeling, [playername]?”</i>", parse);
			Text.NL();
			Text.Add("Truth be told? A little dizzy.", parse);
			Text.NL();
			Text.Add("<i>“Perfect. Although it is quite possible to be overzealous and hyperventilate a little, more careful control of your breathing will come with experience in this particular set of meditative exercises. After all, the point is to breathe in a controlled fashion, not just deeply.”</i> [HeShe] shuffles a bit closer to you, just within your little circle of personal space, and assumes a more comfortable cross-legged position. <i>“Now, shall we focus inwards on the rhythms of our bodies, and reflect upon the many small blessings which the Lady has been kind enough to bestow upon us of late? Just follow my lead, and we will be fine.”</i>", parse);
			Text.NL();
			Text.Add("With that said, [Kiai] closes [hisher] eyes and places [hisher] hands palm-upwards on [hisher] knees, chanting something to [himher]self under [hisher] breath. You follow suit, doing your best to keep your breathing calm and steady", parse);
			if (lust >= 0.7) {
				Text.Add(" despite your painfully flustered state", parse);
			}
			Text.Add(", and do your best to focus your consciousness inward.", parse);
			Text.NL();
			if (lust >= 0.7 && kiakai.FirstBreastRow().Size() >= 7.5) {
				Text.Add("Try as you might, though, you can’t help but get distracted - or perhaps you <i>are</i> focusing on the rhythm of your body, only it’s not the one that [Kiai] wanted you to. Opening your eyes just a crack and peeking out, you catch glimpses of [Kiai]’s heavy breasts moving in time with [hisher] body as it goes through the motions of the meditative exercise.", parse);
				Text.NL();
				Text.Add("In your current aroused state, you’re as helpless as a fly drawn to a bowl full of sugar. That magnificent elf-rack, each heavy hemisphere straining against [hisher] [armor], leaving just enough to the imagination. With each breath [Kiai] draws in, you see those sumptuous lady lumps rise and swell, [hisher] [armor] growing ever so slightly tighter. Then, on the downstroke, they shrink ever so slightly, making them seem ever so grabbable…", parse);
				Text.NL();
				Text.Add("With such a feast displayed in front of you in your current state, trying to keep your cool is an uphill task and a losing battle. You can’t help but wonder how it would be like to have warm elf-breast pressed up against yourself, pushing through the soft, pliant layer to get to the firm mounds beneath, stroking, caressing, teasing, suckling -", parse);
				Text.NL();
				Text.Add("<i>“[playername]!”</i>", parse);
				Text.NL();
				Text.Add("Uh-oh. [Kiai] looks crossly at you and folds [hisher] arms under that huge rack of [hishers], pushing them up even further and making them look all the more inviting…", parse);
				Text.NL();
				Text.Add("<i>“While I can understand that you did not start this exercise in an ideal state of mind, I must ask that you at least <b>try</b> and refrain from… uh… inappropriate thoughts about me while we are trying to be serious about this! Terrible things can happen to you if your mind starts to wander when you’re meditating!”</i>", parse);
				Text.NL();
				Text.Add("Yes, yes, you understand. Look, you have a suggestion here - perhaps [heshe] shouldn’t be facing you when going about this, okay? It would help matters on your end.", parse);
				Text.NL();
				Text.Add("[Kiai] huffs, the elf clearly trying to decide if you’re just trying to weasel your way out of perving all over [himher]. You hold out your hands placatingly, and by and large the elf can’t seem to stay mad at you.", parse);
				Text.NL();
				Text.Add("<i>“All right, then. I will turn around, but I expect you to take this seriously.”</i>", parse);
				Text.NL();
				Text.Add("You assure [Kiai] that you will, and soon enough the both of you have resumed the exercise - only this time with [Kiai]’s back to you.", parse);
			} else {
				Text.Add("Unlike [Kiai], you’re not exactly sure what to look for here, but it’s clear that the elf is far more experienced than you at this, and [heshe] <i>did</i> say to follow [hisher] lead. With that in mind, you do your best to time your breathing, inhaling and exhaling as close to [Kiai]’s rhythm as close as possible, all the while focusing inwards on what you imagine to be the core of your being.", parse);
				Text.NL();
				Text.Add("<i>“Very good, [playername],”</i> you hear [Kiai] murmur. [HisHer] voice sounds extremely distant as if you were speaking to each other from one mountaintop to the other. <i>“While aptitude must be honed with experience, it nevertheless makes me glad that you have grasped the essentials so quickly. Maybe the gem is helping you.”</i>", parse);
				Text.NL();
				Text.Add("Yeah, that’s a distinct possibility, one that can’t be ruled out. Still, it would be nice to have your ego tickled a little once in a while…", parse);
			}
			Text.NL();
			Text.Add("The exercise continues apace, and the world slowly begins to narrow, a veil drawn over each of your senses in succession until you feel truly at peace.", parse);
			Text.NL();
			Text.Add("<i>“In with the good, [playername]. Out with the bad,”</i> [Kiai]’s voice resonates from somewhere within the darkness. <i>“In with the good, and out with the bad.”</i>", parse);
			Text.NL();
			parse.s = player.HasLegs() ? "s" : "";
			parse.toes = player.HasLegs() ? "toes" : "tail";
			Text.Add("You can’t quite tell if there is indeed any mystical mumbo-jumbo being circulated through your body, but as you carefully regulate your breathing and hold it there for a while, a sense of gentle calm and peace finally begins to wash over you, starting from the tip[s] of your [toes] and working its way up your body and into your head.", parse);
			Text.NL();
			Text.Add("Aah. Hey, that actually feels much better! ", parse);
			if (lust >= 0.7) {
				Text.Add("The bothersome thoughts jumping up and down on your brain settle down somewhat, and you draw in a deep breath through your teeth as you force yourself to focus on the vast emptiness just outside your consciousness, the vast emptiness which is filled with nothing and very definitely not any number of heaving, throbbing… ", parse);
				Text.NL();
				Text.Add("No, you’re fine, you’re fine. You take another deep breath, let it all out in one go, and sigh happily. There, no pressure at all.", parse);
			} else if (lust >= 0.3) {
				Text.Add("There were still a few dirty thoughts lingering on the edges of your consciousness, but the wave of calm sweeps them away like debris on a retreating tide, leaving your mind all clean and pristine, ready to face what lies ahead. No doubt there’ll be very many tempting foes in your path before this is over, and you’ll want to face them with a clear mind.", parse);
			} else {
				Text.Add("You were largely untroubled before, but you do feel better for having gone through the breathing exercises with [Kiai]. After all, it’s better to keep your thoughts cleaned regularly, rather than wait for your desires to build up to the point where focusing is problematic. Taking a deep breath of clean air, you hold it for a handful of seconds before finally letting it go all at once.", parse);
				Text.NL();
				Text.Add("Yes, yes, much better.", parse);
			}
			Text.NL();
			Text.Add("By and large, you open your eyes once more to find [Kiai] already standing up and looking down at you. [HeShe] offers you a hand, which you grasp readily, and [heshe] helps you to your feet.", parse);
			Text.NL();
			Text.Add("<i>“Did you find the exercise useful?”</i>", parse);
			Text.NL();
			Text.Add("It did help quite a bit, yes. You begin to thank [Kiai], but the elf waves off your gratitude.", parse);
			Text.NL();
			Text.Add("<i>“I am only glad to be able to help in what small way I am able to, [playername]. It is commendable that you chose to deal with your desires in this fashion, rather than seek a more… um, direct method of release. Such would have indeed been easier, I suppose, but you would have missed out on an opportunity to temper your spirit and mind.</i>", parse);
			Text.NL();
			Text.Add("<i>“Now then, shall we be on our way?”</i>", parse);
		}, 1.0, () => party.InParty(kiakai, switchSpot));
		// TODO
		/*
		scenes.AddEnc(() => {
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
		}, 1.0, () => true);
		*/
		// Meditate by self
		scenes.AddEnc(() => {
			Text.Add("All right, then. Time to get this over with. Focusing your vision on the gem in your cupped palms, you slowly close your eyes, keeping the gem’s image firmly ensconced in your mind’s eye as you center your body and mind. ", parse);
			if (lust >= 0.7) {
				Text.Add("Your concentration lapses more than once as lewd thoughts force their way to your attention, but you manage to forcibly push them down from whence they came and re-orient your mind on the meditative exercise at hand. There’s the lingering suspicion in the back of your mind that they’ll be back in force before too long, but you’ll take any opening you can get.", parse);
			} else if (lust >= 0.3) {
				Text.Add("Your mind is riddled with the occasional lewd thought as you begin meditating, but you have enough willpower and presence of mind to overrule them and push them back into the dark recesses of your mind from when they came. Those minor hiccups aside, though, the opening steps of your meditation go by smoothly, and before long you feel settled and ready to begin in earnest.", parse);
	} else {
				Text.Add("With your full concentration at hand, it’s a small matter to gather your thoughts into a neat little package and shunt them into a corner of your mind, leaving a dark, peaceful blankness behind your eyes for you to luxuriate in and begin the task of keeping your mental house in order.", parse);
	}
			Text.Add(" The gem in your hands starts to grow warm, a gentle, pulsating heat, and you feel that you’re as ready as you’ll ever be.", parse);
			Text.NL();

			const scenes = new EncounterTable();
			// Astral Projection
			scenes.AddEnc(() => {
				Text.Add("Keeping your eyes closed, you visualize yourself somewhere outside your body, perhaps a few feet ahead", parse);
				if (party.InParty(kiakai, switchSpot)) {
					Text.Add(", just in front of [Kiai]", parse);
				}
				Text.Add(". Sending yourself there without being actually physically present, projecting your consciousness forward - you’re focusing so hard, you can actually feel your forehead throb against your furrowed brow, pounding away like a steady beat on a drum. Sure, you know that you don’t have any chance of actually projecting yourself at will, but it does make for a good thing to concentrate on.", parse);
				Text.NL();
				Text.Add("Time seems to slow as you summon up every last shred of determination you can muster, willing yourself out of your body and a short distance in front of you. In your mind’s eye, you can already see yourself a little distance ahead, ", parse);
				if (party.InParty(kiakai, switchSpot)) {
					Text.Add("leaning over [Kiai] and poised to give the elf a tap on the shoulder. Oh, if you could actually do that - the shock value of such and the ensuing hilarity would make it all worthwhile…", parse);
				} else {
					Text.Add("pacing in circles as you look back on your own body, still calm and serene in your meditative position. Looking back at yourself from outside must be more than a little disorienting, and if you <i>really</i> managed to do that…", parse);
				}
				Text.NL();
				Text.Add("…The thought slips from your mind, squirming its way out of your grasp like a slippery fish and rejoining the river of your thoughts with its gentle surface and dark undercurrents. Your breathing slows, as does your pulse; your consciousness seems detached somehow, sundered in two, and you hold fast to your furious focus, determined to see this through.", parse);
				Text.NL();
				Text.Add("At length, something seems to give way, and your eyes snap open of their own accord. You’re still sitting where you were, not having moved so much as an inch - what did you expect? - but you feel as clear-headed as you think you’ll ever get.", parse);
				Text.NL();
				Text.Add("Phew! Whether or not you actually managed to project yourself out of your body through sheer force of will is beside the point, for you very definitely don’t feel in the slightest bit aroused any more, and <i>that’s</i> what’s important. Odd, though - you can’t have been sitting down here for so long, and yet your limbs and joints ache and complain when you move to stand up, as if you’d been in that exact same position for an entire day, maybe even two.", parse);
			}, 1.0, () => true);
			// Martial arts meditation.
			scenes.AddEnc(() => {
				parse.l = player.HasLegs() ? "to your feet" : "yourself upright";
				Text.Add("Carefully, you stow the gem away again, and get [l]. In your state of focus, your limbs feel exceptionally nimble, your step light, and while it might just be all in your mind it nevertheless makes you feel enthusiastic and invigorated for the exercises you’re about to go through.", parse);
				Text.NL();
				Text.Add("Keeping your mind focused on your center of gravity, you widen your stance, keep your back straight and work through a simple warm-up of stretches designed to leave you limber and in the proper state of mind for what comes next. Stepping about in a small circle, you execute a quick series of flowing, full-body motions, finishing up with a couple of powerful arm thrusts.", parse);
				Text.NL();
				if (lust >= 0.7) {
					Text.Add("Your form isn’t that great considering the distracting thoughts that linger on the edges of your mind, but the redirection of your blood flow towards your limbs and away from your… uh, other extremities quickly solves that problem for you. Without any means of even acting out their desires, the lustful thoughts soon disperse, leaving you better able to concentrate on your posture and motions.", parse);
				} else {
					Text.Add("Your exertions quickly banish any stray thoughts and lingering desires in the back of your mind, and with your thoughts focused on sensing the core of your body, few are able to get in. Aided by physical reinforcement, you quickly begin to feel the effect of the mental aspects of this exercise.", parse);
				}
				Text.NL();
				Text.Add("Ah… now that’s so much better. Working together, mind and body conspire to bring forth a wellspring of clarity that you freely dip into as you proceed through the sequence of slow, rolling movements, carefully controlling each and every conscious motion of your body as you feel the whistling of your lungs expanding and the roar of your blood pumping.", parse);
				Text.NL();
				Text.Add("The whole meditative routine doesn’t take any more than perhaps half an hour, but your body sure feels like it’s been working out a lot longer by the time you’re done. Although you haven’t broken a sweat at all, your muscles feel sore and somewhat leaden, a clear contrast from the original lightness with which you started the session; on the other hand, your thinking is much sharper now, and your attention’s been honed to a sharp point, ready to be directed where it will.", parse);
				Text.NL();
				Text.Add("At the very least, sex is the least of your thoughts at the moment", parse);
				if (lust >= 0.7) {
					Text.Add(", a thankful relief considering the state of mind you were in not too long ago", parse);
				}
				Text.Add(".", parse);
				Text.NL();
				Text.Add("That seems to be that, though - you’re nearing the end of your meditation session, and begin pulling back your movements into a graceful set of small, simple motions as you wind down the internal fervor to which you’d worked your body into. It doesn’t take long for you to come to a complete stop, and it’s only then that you realize you’ve been holding your breath for a minute now. Exhaling it all in one go, you roll your shoulders and give yourself a quick check-over.", parse);
				Text.NL();
				Text.Add("Yes, yes, much better. Nothing pulled, nothing strained. Well, you should be ready to go now.", parse);
			}, 1.0, () => true);
			// One with the universe
			scenes.AddEnc(() => {
				Text.Add("Concentrating your consciousness on the gem in your hands, you envision in your mind’s eye the power that resides within the gem’s purple facets. Something latent, something immense, but needing to be awakened by the proper rituals… an enormous pulsating light, perhaps? Or maybe it’s more on the lines of a roiling sea of chaos, waves breaking its surface while currents run deep and out of sight? Or it could be none of these, and instead something more on the lines of a tangled ball of yarn, bursting with potential but just needing to be set straight?", parse);
				Text.NL();
				Text.Add("None of the answers feel to be particularly right, and none of them feel particularly wrong, either. Despite the amount of time that you’ve held the gem in your possession, so much about it still eludes you to the point that you suspect that even its maker would be surprised to see it in its current state.", parse);
				Text.NL();
				Text.Add("The gem grows warmer in your hands, almost uncomfortably so, but you hold fast your concentration and continue focusing your awareness on the gem’s power - or at least, what small portion of it you’re able to sense.", parse);
				Text.NL();
				Text.Add("At first, nothing, but you remain steadfast and continue trying to attune yourself to the gem, breathing deeply and consciously as you will tendrils of your essence through the gem’s smooth surface. There’s a barrier of sorts, you can <i>feel</i> it, but the gem clearly recognizes you and after some pushing parts to allow you into -", parse);
				Text.NL();
				Text.Add("- Where exactly is this, anyway? Colored spheres and motes suspended within a howling black void, drifting as if driven by some invisible, overarching cosmic clockwork. Shapeless forms that flit on the edge of your vision, melding seamlessly into the darkness when you try and look at them directly. Pinpricks of light that might have been stars, yet they remain cold and stationary, frozen in the encompassing darkness.", parse);
				Text.NL();
				Text.Add("Wherever this is - if it isn’t some kind of fever vision that the gem has induced in your mind in the first place - you feel a little glad to be not really there. Even viewing it from a distance as you must be, strange sensations visit your body one after the other - one moment you’re being spread awfully thin, your essence scattered amongst the celestial bodies, the next you’re being crushed and painfully squeezed by some kind of invisible force -", parse);
				Text.NL();
				Text.Add("Your eyes snap open, and the sensations rapidly ebb away, your normal senses flooding back in to fill the void left by the gem’s presence. ", parse);
				if (party.InParty(kiakai, switchSpot)) {
					Text.Add("[Kiai] is still sitting across from you in [hisher] own meditative trance, calmly oblivious to everything about [himher] - you included. ", parse);
				}
				Text.Add("Wow. What you just saw… it’s always good to be reminded of how small you are when put in perspective, but alternatively, that could also be inspiration to go ahead and make something bigger of yourself. At any rate, the vision the gem bestowed upon you while meditating has certainly done wonders for your mind. At the very least, every last trace of lewdness has been wiped from your head; it’s a little hard to think of sex when faced with the immenseness of limbo itself.", parse);
			}, 1.0, () => true);
			/* TODO
			scenes.AddEnc(() => {
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
			}, 1.0, () => true);
			*/
			scenes.Get();

			Text.NL();
			Text.Add("Closing your eyes, you take a deep breath, and let it out satisfactorily. Yes, yes, you needed that. Time’s a-wasting, though - now that you’re done, you need to be back on the road again.", parse);
			if (party.InParty(kiakai, switchSpot)) {
				Text.Add(" Happily, [Kiai] seems to have finished [hisher] own meditation, and gives you a nod as [heshe] rises to [hisher] feet. <i>“Shall we be on our way, [playername]?”</i>", parse);
			}
		}, 1.0, () => true);
		scenes.Get();

		Text.NL();
		Text.Add("Right. Checking the place over one last time to make sure you haven’t left anything behind, you make to head out and are soon on your way again.", parse);
		Text.Flush();

		TimeStep({hour: 1});

		player.AddLustFraction(-1);
		if (party.InParty(kiakai, switchSpot)) {
			kiakai.AddLustFraction(-1);
		}

		Gui.NextPrompt();
	}

}
