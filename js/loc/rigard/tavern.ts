
import { Cock } from "../../body/cock";
import { Race } from "../../body/race";
import { EncounterTable } from "../../encountertable";
import { Sex } from "../../entity-sex";
import { Event, Link } from "../../event";
import { MirandaFlags } from "../../event/miranda-flags";
import { ZinaFlags } from "../../event/zina";
import { GAME, MoveToLocation, TimeStep, WORLD} from "../../GAME";
import { Gui } from "../../gui";
import { ILocRigardTavern } from "../../location";
import { Party } from "../../party";
import { Text } from "../../text";
import { RigardFlags } from "./rigard-flags";

const TavernLoc: ILocRigardTavern = {
	Common   : new Event("Maidens' Bane"),
};

//
// Tavern
//
TavernLoc.Common.description = () => {
	const rigard = GAME().rigard;
	Text.Add("You are in the tavern called the Maidens' Bane. The dim lighting makes it hard to make out details, and the heavy smell of hard alcohol mixed with bile stings your nostrils. Along the bar is a row of stools, a lot of them partly broken or mended - either missing a supporting peg, or the cushion is torn open with the material picked out, making the seat lumpy and hard.");
	Text.NL();
	Text.Add("In the main dining area, there are tables - most of them covered in the leftover dishes, foods and half-drunk mugs of other patrons. There are spills and stains on the tables that look as though they have been there for several weeks, with no hope of getting cleaned up anytime soon. On the wall opposite of the bar, there are booths, where it looks like couples could go for some public privacy. For true privacy, there are a few back rooms deeper inside the tavern.");
	Text.NL();
	if (rigard.MetBarnaby()) {
		Text.Add("Barnaby, the omnipresent bartender, sits behind his bar, perpetually wiping a mug that doesn’t ever seem to get any cleaner.");
	} else {
		Text.Add("The omnipresent bartender is a tall equine, perpetually busy with wiping a mug that doesn’t ever seem to get any cleaner.");
	}
	Text.NL();
};

TavernLoc.Common.events.push(new Link(
	() => {
		const rigard = GAME().rigard;
		return rigard.MetBarnaby() ? "Barnaby" : "Bartender";
	}, true, true,
	undefined,
	() => {
		BarnabyScenes.Approach();
	},
));

TavernLoc.Common.links.push(new Link(
	"Slums", true, true,
	undefined,
	() => {
		MoveToLocation(WORLD().loc.Rigard.Slums.Gate, {minute: 10});
	},
));

// TODO
TavernLoc.Common.DrunkHandler = () => {
	const rigard = GAME().rigard;
	const party: Party = GAME().party;
	const player = GAME().player;

	const parse: any = {
		phisher : player.mfTrue("his", "her"),
	};

	const first = !(rigard.flags.Barnaby & RigardFlags.Barnaby.PassedOut);
	rigard.flags.Barnaby |= RigardFlags.Barnaby.PassedOut;

	Text.Clear();
	Text.Add("The first thing that you can say you feel when your eyes open is <i>pain</i>. Your skull feels like something is trying to hammer it open from the inside, your vision swims, and the light is far, far too bright. Moving gingerly, afraid your limbs will fall off if you go too quickly, you slowly take in your surroundings; you’ve been laid out on the floor of a room... one of the backrooms of the Maiden’s Bane, you promptly realize.", parse);
	Text.NL();
	Text.Add("Carefully pulling yourself upright, cradling your aching head, you look around for your assorted goods, but you don’t see any sign of them. Dimly hoping it wasn’t stolen, you lurch out through the door, slowly making your way to the bar.", parse);
	Text.NL();
	Text.Add("Barnaby is there, as he always is, still polishing the same glass. He looks at you with a particularly sour look, even for him.", parse);
	Text.NL();
	Text.Add("<i>“Finally up and about, huh?”</i>", parse);
	Text.NL();
	Text.Add("You moan softly in response, asking him what happened, and where your stuff is.", parse);
	Text.NL();
	Text.Add("<i>“You couldn’t hold your liquor and passed out, so I hauled your ass to one of the backrooms and told the people to stay away and let you rest. Aren’t I a nice guy?”</i> He grins sarcastically.", parse);
	Text.NL();
	Text.Add("Well, compared to how some bartenders would have reacted, he definitely is, yeah.", parse);
	Text.NL();
	Text.Add("<i>“As for your stuff, it’s safe here, behind the bar.”</i>", parse);
	Text.NL();
	if (first) {
		Text.Add("You sigh in relief and thank him for looking after your things. Then you reach out and ask him to give them back to you.", parse);
		Text.NL();
		Text.Add("<i>“Not so fast. I’m a bartender, not a babysitter. If I have to stop my bartending to take care of a drunkard who didn’t know [phisher] limits, then I expect to be compensated for it.”</i>", parse);
		Text.NL();
		Text.Add("Well... okay, he’s a bit of a jerk, but you can see his point. It is only fair that you pay him back somehow. Now, how to pay him back... he’d probably expect cash, but you wonder if he’d be up for a different sort of currency...", parse);
	} else {
		Text.Add("Smirking, you dryly wager that he wants to be compensated for his generosity.", parse);
		Text.NL();
		Text.Add("He smiles. <i>“Good to see we understand each other. So, what’s it gonna be?”</i>", parse);
	}
	Text.NL();
	Text.Add("Bribe him off with twenty five coin? Or see if he's up for some more... intimate compensation?", parse, "bold");
	Text.Flush();

	const options = [];
	options.push({nameStr : "Pay Up",
		tooltip : Text.Parse("Just give him what he wants. Some coins are a small price to pay for not being robbed, molested or who knows what while you were out cold.", parse),
		enabled : party.coin >= 25,
		func() {
			party.coin -= 25;
			Text.Clear();
			Text.Add("You tell him that you’ll pay him for his troubles. But he’ll need to give you back your stuff so you can give him the money.", parse);
			Text.NL();
			Text.Add("He looks a bit disgruntled, but complies easily enough.", parse);
			Text.NL();
			Text.Add("Taking your things, you reach into your coin pouch and pass him a handful, which he deftly makes disappear behind the counter.", parse);
			Text.NL();
			Text.Add("<i>“Nice. Try not to make trouble again. And learn to hold your damn liquor; if you puked on me, I’d charge you triple.”</i>", parse);
			Text.NL();
			Text.Add("Yeah, you’ll work on that. You want to avoid this from happening in the future.", parse);
			Text.Flush();
			Gui.NextPrompt();
		},
	});
	options.push({nameStr : "Blowjob",
		tooltip : Text.Parse("Wrap your mouth around his dick, and all debts should melt away in a few minutes.", parse),
		enabled : true,
		func() {
			const bjfirst = !rigard.BlownBarnaby();
			rigard.flags.Barnaby |= RigardFlags.Barnaby.Blowjob;

			Text.Clear();
			if (bjfirst) {
				Text.Add("Putting on your best seductive smile, you ask if there isn’t another way that you can pay him back - one that doesn’t involve something so vulgar as mere money.", parse);
				Text.NL();
				Text.Add("<i>“Yeah? Will your ‘less vulgar’ alternative pay my bills?”</i>", parse);
				Text.NL();
				Text.Add("Well...no.", parse);
				Text.NL();
				Text.Add("<i>“Then no deal. Cough up some cash or I’m gonna have to pawn off your goods.”</i>", parse);
				Text.NL();
				Text.Add("Okay, okay, if he’ll just listen to you a second?", parse);
				Text.NL();
				Text.Add("He raises a brow. <i>“Time is money, and your tab is increasing.”</i>", parse);
				Text.NL();
				Text.Add("Listen here, you were wondering if he could let you have your stuff back in exchange for… sexual services.", parse);
				Text.NL();
				Text.Add("<i>“You want to sleep with me in exchange for your stuff?”</i>", parse);
				Text.NL();
				Text.Add("That’s basically the idea, yes.", parse);
				Text.NL();
				Text.Add("<i>“Afraid that’s still a no deal - someone’s gotta tend to the bar. And the only one capable of keeping this place running is me, so no time to fool around.”</i>", parse);
				Text.NL();
				Text.Add("Well, what about if you gave him a blowjob? You could just duck behind the counter there with him; he’d get to blow his top, and he wouldn’t even have to stop working to do it.", parse);
				Text.NL();
				Text.Add("<i>“A blowjob, huh? You any good at it?”</i>", parse);
				Text.NL();
				if (player.sex.gBlow < 5) {
					Text.Add("Well, you don’t really know, but you’re certainly willing to give it all you’ve got!", parse);
					Text.NL();
					Text.Add("He takes a deep breath and rubs his temples. <i>“Okay, you know what? I’m willing to take it this time. I’m pretty pent up and could use the release, so we have a deal. You get me off good, and I’ll give you your stuff back.”</i>", parse);
					Text.NL();
					Text.Add("You promise that he won’t regret it.", parse);
					Text.NL();
					Text.Add("<i>“Right then, get behind the bar, drop down, open wide and try not to choke on my dick. Last thing I need is to haul your ass back to the backrooms again.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Right then, get behind the bar, drop down, open wide and try not to choke on my dick. Last thing I need is to haul your ass back to the backrooms again.”</i>", parse);
					Text.NL();
					Text.Add("You keep any thoughts you may have on his attitude to yourself and do as you’re told, heading around the counter and settling behind it. The sour-tempered stallion has already yanked off his pants, revealing a good-sized, half-erect horsecock... and an almost painfully swollen set of bulging balls.", parse);
					Text.NL();
					Text.Add("With junk like this, no wonder he’s so cranky all the time... still, you wonder if maybe you’ve bitten off a little more than you can chew with this...", parse);
					Text.NL();
					Text.Add("<i>“You going to start or do I need to give you a little push?”</i>", parse);
					Text.NL();
					Text.Add("Jostled back to reality, you swallow your doubts and reach out for Barnaby’s cock, trying to feign confidence as you do so.", parse);
				} else if (player.sex.gBlow < 25) {
					Text.Add("You’ve been around the block a few times. You know how to work a dick in all the ways that will make him feel <i>good</i>.", parse);
					Text.NL();
					Text.Add("<i>“Okay… I guess I could use some release. Alright then, you’ve got yourself a deal. Hope you really know how to work some trouser snakes.”</i>", parse);
					Text.NL();
					Text.Add("He just needs to have a little faith. You’ll having him feeling better in no time.", parse);
					Text.NL();
					Text.Add("<i>“I’ll be the judge of that; now get back here, drop down and open wide. Do something more useful with that cute mouth of yours.”</i>", parse);
					Text.NL();
					Text.Add("You’ll have him eating his words, soon enough. But first, you’ve got a nice, tasty dick to gobble up. Spurred on by that cheery thought, you make your way around the counter and settle yourself down behind it, giving you some protection against prying eyes.", parse);
					Text.NL();
					Text.Add("Barnaby quickly kicks off his pants next to you, presenting his stallionhood for your attention. Wow... the cock is just what you’d expect of a stallion, big and juicy, but those balls of his are so swollen. Poor guy looks so pent up that it makes you wince at the sight. Well, you’ll take care of that soon enough...", parse);
					Text.NL();
					Text.Add("Eager to begin, you stretch out a hand to take hold of his dick.", parse);
				} else {
					Text.Add("Any good? Baby, you’re an <b>expert</b>. He just needs to drop his pants, and you promise you’ll blow his <b>mind</b>.", parse);
					Text.NL();
					Text.Add("<i>“Now that’s some confidence! Okay, you got me interested.”</i>", parse);
					Text.NL();
					Text.Add("You smile triumphantly; you knew that he’d say that, once he heard you out.", parse);
					Text.NL();
					Text.Add("<i>“Alright then, get behind the bar and show me what you can do, and you better be as good as you say you are. I’m <b>really</b> pent up.”</i> He starts to fiddle with his pants.", parse);
					Text.NL();
					Text.Add("Aw, poor baby; well, you’ll take care of that soon enough. Even as you say this, you are already sliding yourself behind the counter, protecting both of you from any busybodies who might try to spoil your respective fun.", parse);
					Text.NL();
					Text.Add("You can’t help but click your tongue in disappointment when you see the state of the stallion’s balls; he wasn’t kidding about being pent up. Still, with a nice, big, juicy cock for you to suck, you’ll have that all taken care of in a jiffy, and you eagerly reach for his stallionhood, ready to begin.", parse);
				}
			} else {
				Text.Add("With a sexy smile, you ask if a nice, wet, boner-melting blowjob would make it up to him for his generosity.", parse);
				Text.NL();
				Text.Add("He stops to consider for a moment. <i>“Well, I suppose you aren’t too bad at it. And I could use a blowjob. Alright then, you know the drill. Get behind the bar, drop down and open wide. I got your favorite drink right here.”</i> He grins, already working to undo his pants.", parse);
				Text.NL();
				Text.Add("You can’t help but chuckle; you thought that’s what he’d say. Even so, you waste no time in assuming the proper position behind the counter.", parse);
			}
			Text.NL();

			BarnabyScenes.BlowjobEntrypoint(() => {
				if (player.sex.gBlow < 5) {
					Text.Add("<i>“I’ll be straight with you: this wasn’t such a spectacular job.”</i>", parse);
					Text.NL();
					Text.Add("You hang your head meekly; you really must need to train more, if you couldn't give satisfaction even to someone like him.", parse);
					Text.NL();
					Text.Add("<i>“However, you did get me off enough that my balls don’t feel like they’re going to explode, so I’m willing to let your sitter’s fee slide this time.”</i>", parse);
					Text.NL();
					Text.Add("Brightening up, you thank him for his generosity. Still, you privately promise to get some more training in. A negative critique like that from someone as pent-up as he is? That's a real blow to the old ego.", parse);
				} else if (player.sex.gBlow < 25) {
					Text.Add("<i>“Hmm, I think you tried hard enough, and it did feel nice, so I guess I can let your sitter’s fee slide.”</i>", parse);
					Text.NL();
					Text.Add("That's certainly fair enough, you're quite content with that.", parse);
				} else {
					Text.Add("<i>“That was a pretty nice blowjob. You’ve got talent.”</i>", parse);
					Text.NL();
					Text.Add("You just grin proudly, quite pleased at this verification of your skills.", parse);
					Text.NL();
					Text.Add("<i>“If you keep blowing me like this, I wouldn’t mind looking after your sorry ass. Just don’t hop on the counter and sing about how you love dicks up your anus next time.”</i>", parse);
					Text.NL();
					if (player.Slut() < 50) {
						Text.Add("You promise you'll try to retain your enthusiasm.", parse);
					} else {
						Text.Add("Hmm... now there's an entertaining thought...", parse);
					}
					Text.NL();
					Text.Add("<i>“Just pulling your leg.”</i> He grins.", parse);
					Text.NL();
					if (player.Slut() < 50) {
						Text.Add("Hey, he's got a sense of humor after all!", parse);
					} else {
						Text.Add("Spoilsport...", parse);
					}
				}
				Text.NL();
				Text.Add("<i>“Your stuff is in that chest over there.”</i> He points at said chest in the corner of the counter. <i>“Grab it all and feel free to take another rest in the back rooms.”</i>", parse);
				Text.NL();
				Text.Add("You nod your thanks and make your way over to the chest. A quick flick through confirms he's telling the truth, and you gratefully collect your gear before stepping out from behind the counter and into the bar proper.", parse);
				Text.NL();
				Text.Add("<i>“By the way, while you digest all that, try and learn to hold your liquor.”</i>", parse);
				Text.NL();
				Text.Add("Yeah... you probably should work on that...", parse);
				Text.Flush();

				TimeStep({hour: 1, minute: 30});

				Gui.NextPrompt();
			});
		},
	});
	Gui.SetButtonsFromList(options, false, undefined);
};

export namespace BarnabyScenes {
	// Barnaby variable kept in rigard.js

	export function Approach() {
		const rigard = GAME().rigard;
		const player = GAME().player;

		const parse: any = {
			playername : player.name,
		};

		const first = !rigard.MetBarnaby();
		rigard.flags.Barnaby |= RigardFlags.Barnaby.Met;

		Text.Clear();
		if (first) {
			Text.Add("You walk over to the bar and greet the equine barkeep.", parse);
			Text.NL();
			Text.Add("<i>“Hello stranger, what’s your poison?”</i> he asks in a flat tone.", parse);
			Text.NL();
			Text.Add("Depends on what he’s got in stock.", parse);
			Text.NL();
			Text.Add("<i>“Ale, mead, spirits, bread, butter, stew, rat poison,”</i> he lists with disinterest.", parse);
			Text.NL();
			Text.Add("All the staples, huh? Alright then. Does he have a name you can use to order them with, or should you just call him barkeep?", parse);
			Text.NL();
			Text.Add("He sighs and looks at you as if considering if he should even bother; ultimately, he shrugs and offers: <i>“My name is Barnaby, but everyone here just calls me ‘bartender’ or ‘barkeep’ - not like I mind, it’s my job. I’m also not particularly interested in getting chummy with non-paying customers. So, are you going to order anything?”</i>", parse);
			Text.NL();
			Text.Add("Wow, someone’s a sourpuss. Still, he did share his name with you, so you tell him yours in return, then start considering what you want to buy from him.", parse);
		} else {
			Text.Add("Sauntering up to the bar, you smile and say hello to Barnaby.", parse);
			Text.NL();
			Text.Add("<i>“[playername],”</i> he greets you in his normal flat tone. <i>“What’s your poison?”</i>", parse);
		}
		Text.Flush();

		BarnabyScenes.Prompt(false);
	}

	export function Prompt(talkative?: boolean) {
		const rigard = GAME().rigard;
		const party: Party = GAME().party;
		const player = GAME().player;

		const coin1 = 2;
		const coin2 = 5;
		const coin3 = 10;

		let parse: any = {
			playername : player.name,
			coin1 : Text.NumToText(coin1),
			coin2 : Text.NumToText(coin2),
			coin3 : Text.NumToText(coin3),
		};
		parse = player.ParserTags(parse);

		const options = [];
		options.push({nameStr : "Ale",
			tooltip : Text.Parse("Light alcohol, costs [coin1] coin.", parse),
			enabled : party.coin >= coin1,
			func() {
				Text.Clear();
				Text.Add("You ask for some Ale.", parse);
				Text.NL();
				Text.Add("<i>“Okay, that’ll be [coin1] coin.”</i>", parse);
				Text.NL();
				Text.Add("You pay him and he goes to a small barrel in the back, twisting the tap to fill a, hopefully, clean mug with your chosen beverage. He turns around moments later, putting down the ale in front of you.", parse);
				Text.NL();
				Text.Add("For a moment, you stare the thick, brown liquid down in its cup, then close your fingers around the handle and raise it to your lips. This stuff is definitely of the cheap and nasty variety; it’s so thick and gluggy, you can almost chew it. But you won’t be denied, and you force it down your throat, gasping for relief when you can finally slam the mug back down on the bartop.", parse);
				Text.NL();
				Text.Add("You can’t say anything for the taste, but you can’t deny its strength. It burns all the way down, and makes your vision swim for a brief moment before you compensate for the assault on your liver.", parse);
				Text.Flush();

				party.coin -= coin1;
				TimeStep({minute: 10});
				const drunk = player.Drink(0.8);
				if (drunk) { return; }
				BarnabyScenes.Prompt(true);
			},
		});
		options.push({nameStr : "Mead",
			tooltip : Text.Parse("Moderate alcohol content, costs [coin2] coin.", parse),
			enabled : party.coin >= coin2,
			func() {
				Text.Clear();
				Text.Add("You ask for some Mead.", parse);
				Text.NL();
				Text.Add("<i>“Okay, that’ll be [coin2] coin.”</i>", parse);
				Text.NL();
				Text.Add("You pay him and he goes to a small barrel in the back, twisting the tap to fill a, hopefully, clean mug with your chosen beverage. He turns around moments later, putting down the mugful of mead in front of you.", parse);
				Text.NL();
				Text.Add("With a rich golden-amber color reminiscent of the honey used to brew it, the mead gives off a surprisingly pleasant sweet smell. Emboldened by the scent, you lift the mug to your mouth and take a swallow.", parse);
				Text.NL();
				Text.Add("...Well, now you know how they can make cheap mead. They certainly didn’t take much care in diluting this stuff to make it drinkable; it’s better than just dissolving honeycomb in ale, but not by much.", parse);
				Text.NL();
				Text.Add("The stuff is so strong that you have to pace yourself to have a chance of swallowing it all, but eventually you manage to drain the mug and slam it gratefully back down on the bartop.", parse);
				Text.Flush();

				party.coin -= coin2;
				TimeStep({minute: 10});
				const drunk = player.Drink(1);
				if (drunk) { return; }
				BarnabyScenes.Prompt(true);
			},
		});
		options.push({nameStr : "Spirits",
			tooltip : Text.Parse("Strong alcohol, costs [coin3] coin.", parse),
			enabled : party.coin >= coin3,
			func() {
				Text.Clear();
				Text.Add("You ask for some Spirits.", parse);
				Text.NL();
				Text.Add("<i>“Okay, that’ll be [coin3] coin.”</i>", parse);
				Text.NL();
				Text.Add("You pay him and he ducks under the bar to fetch a green bottle; he upends it on a, hopefully, clean mug and puts the bottle back in its resting place. After that, he sets the mugful of spirits down in front of you.", parse);
				Text.NL();
				Text.Add("You can’t help but eye the deceptively clear, almost water-like liquid with caution. Even from here, it reeks of raw alcohol, a potent scent that makes your nostrils sting. Well-informed of its potency, you carefully raise it to your mouth and take a measured swallow.", parse);
				Text.NL();
				Text.Add("Oh, by the spirits, that’s harsh! It burns in your mouth like you swallowed a lit coal, scorching its way down your throat until it splashes into your guts, from which it settles to fill your body with its stomach-twisting fire.", parse);
				Text.NL();
				Text.Add("Well, you knew when you went in that you weren’t getting the finest grain alcohol here...", parse);
				Text.NL();
				Text.Add("So, you stubbornly take swallow after swallow until somehow you manage to drain your glass dry. Your vision actually wobbles for a moment as you carefully lower the mug back to the bartop.", parse);
				Text.Flush();

				party.coin -= coin3;
				TimeStep({minute: 10});
				const drunk = player.Drink(1.4);
				if (drunk) { return; }
				BarnabyScenes.Prompt(true);
			},
		});
		options.push({nameStr : "Rumors",
			tooltip : Text.Parse("A barkeep sees and hears a lot. Maybe he’d share some tidbits with you, if you asked?", parse),
			enabled : true,
			func() {
				Text.Clear();
				if (!talkative) {
					Text.Add("<i>“Buy something first and I’ll consider talking to you, otherwise get out of my bar. I don’t have time to chit chat with everyone that passes by.”</i>", parse);
					Text.NL();
					Text.Add("Looking at him brooks no grounds for argument. Every bit of body language he has is screaming the need to grease his palm with some coin for drinks before he’ll consider spilling the beans about anything he’s heard.", parse);
				} else {
					const scenes = new EncounterTable();

					scenes.AddEnc(() => {
						Text.Add("<i>“The nobles are a bunch of assholes.”</i>", parse);
						Text.NL();
						Text.Add("You kind of thought that was a given for nobles. But have they been up to anything in particular?", parse);
						Text.NL();
						Text.Add("<i>“That’s all I heard.”</i>", parse);
						Text.NL();
						Text.Add("...Right. You can tell there’s no point pressing him on the matter.", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“Some members of the Watch like to abuse their position.”</i>", parse);
						Text.NL();
						Text.Add("Oh? In what sort of ways?", parse);
						Text.NL();
						Text.Add("He simply looks at you with disdain, as if you should already know the answer to that.", parse);
						Text.NL();
						Text.Add("You decide to shut your mouth on the matter, then.", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“Heard there’s a nicer bar inside the gates.”</i>", parse);
						Text.NL();
						Text.Add("Worried about the competition, is he?", parse);
						Text.NL();
						Text.Add("<i>“Don’t give a fuck about them, just heard about it.”</i>", parse);
						Text.NL();
						Text.Add("Sounds to you like someone’s jealous, but it’s never a good idea to piss off the man serving you booze, so you shut up.", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“Merchants like money.”</i>", parse);
						Text.NL();
						Text.Add("No, really?", parse);
						Text.NL();
						Text.Add("<i>“As a matter of fact, so do I.”</i>", parse);
						Text.NL();
						Text.Add("So you noticed.", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“Don’t poke a wasp’s nest.”</i>", parse);
						Text.NL();
						Text.Add("Who would be stupid enough to poke one of those? Then again, this looks like the kind of place where that could be useful advice. Especially the part you really, <b>really</b> shouldn’t be poking it with.", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“If you wanna get popular, buy everyone a round. Maybe even I will start liking you if you do.”</i>", parse);
						Text.NL();
						Text.Add("You’ll keep that in mind.", parse);
						Text.NL();
						Text.Add("<i>“Or you could strip and offer everyone a ride, but that won’t make me like you more.”</i>", parse);
						Text.NL();
						if (player.Slut() < 45) {
							Text.Add("Yeah, you think you’ll pass on that idea.", parse);
						} else {
							Text.Add("A tempting idea, but maybe later.", parse);
						}
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“Don’t make trouble in my bar.”</i>", parse);
						Text.NL();
						Text.Add("That doesn’t sound like a rumor to you.", parse);
						Text.NL();
						Text.Add("<i>“It isn’t a rumor, it’s called good advice.”</i>", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“Heard you don’t know when to stop being nosy and asking questions, any truth to that?”</i>", parse);
						Text.NL();
						Text.Add("Sheesh, talk about unfriendly. This is like trying to pull teeth.", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“Heard you like to suck cock, but I guess that’s more of a fact.”</i> He smirks.", parse);
						Text.NL();
						if (player.Slut() < 10) {
							parse.sk = player.HasSkin() ? "" : " - well, you would if your [skin] would let you -";
							Text.Add("You blush madly[sk] and hang your head in shame, unable to meet the barkeep’s eyes.", parse);
						} else if (player.Slut() < 30) {
							Text.Add("With a sheepish grin, you shrug your shoulders and confess that there might be some truth to that.", parse);
						} else {
							Text.Add("Grinning proudly, you stick out your chest and loudly announce that’s indeed a fact.", parse);
						}
					}, 1.0, () => rigard.BlownBarnaby());

					scenes.Get();
				}
				TimeStep({minute: 5});
				Text.Flush();
				BarnabyScenes.Prompt(talkative);
			},
		});
		options.push({nameStr : "Chat",
			tooltip : Text.Parse("He looks like he’s got time. Maybe he can tell you some things?", parse),
			enabled : true,
			func() {
				Text.Clear();
				if (talkative) {
					Text.Add("<i>“Tell you about what?”</i>", parse);
					Text.Flush();
					BarnabyScenes.ChatPrompt();
				} else {
					Text.Add("<i>“Buy something first and I’ll consider talking to you, otherwise get out of my bar. I don’t have time to chit chat with everyone that passes by.”</i>", parse);
					Text.NL();
					Text.Add("Quite the unfriendly sort, but looking at him you can tell he won’t budge on this. If you want to coax him into talking to you, you better suck it up and buy some drinks.", parse);
					Text.Flush();
					BarnabyScenes.Prompt();
				}
			},
		});
		options.push({nameStr : "Blow Him",
			tooltip : Text.Parse("He looks like he could use some relief. Maybe a nice blowjob would put him in a better mood...", parse),
			enabled : true,
			func() {
				const bjfirst = !rigard.BlownBarnaby();
				rigard.flags.Barnaby |= RigardFlags.Barnaby.Blowjob;

				Text.Clear();
				if (bjfirst) {
					Text.Add("Looking around discretely, for his sake as much as anyone’s, you quietly ask Barnaby if he’d be interested in a blowjob.", parse);
					Text.NL();
					Text.Add("That makes him put his mug down. <i>“Really? You sure you want to do that?”</i>", parse);
					Text.NL();
					Text.Add("You nod and assure him that you wouldn’t have offered if you weren’t.", parse);
					Text.NL();
					Text.Add("<i>“Well, I ain’t got no reason to refuse a free blowjob, get behind the bar.”</i>", parse);
					Text.NL();
					Text.Add("Sounds like this happens a bit more than you thought. Still, no matter. As instructed, you make your way to the interior of the bar, concealing yourself under the bartop as best you can as you settle down within easy reach of your target.", parse);
					Text.NL();
					Text.Add("Barnaby wastes no time, undoing his pants and kicking them off to the side with practiced ease.", parse);
					Text.NL();
					Text.Add("...Well now. No wonder he’s in such a poor mood all the time, if this is normal for him. Jutting from his groin is a good-sized stallion’s cock, at least a foot long. But hanging beneath it are a pair of balls that, even considering Barnaby’s race, look far too heavy. The skin is stretched taut over a load of seed so dense you can’t even imagine it. He looks so pent up that the sight makes you wince.", parse);
					Text.NL();
					if (player.HasBalls()) {
						Text.Add("You can feel your own [balls] clench in sympathy at what the stallion-morph must be going through.", parse);
					} else {
						Text.Add("You don’t even <b>have</b> balls and the sight still makes you feel a pang of sympathy for what he’s going through.", parse);
					}
					Text.NL();
					Text.Add("<i>“Well? It’s not gonna suck itself, you know?”</i> he calls out to you, getting back to cleaning his mug.", parse);
					Text.NL();
					Text.Add("You blink, snapping back to reality after having been momentarily hypnotized at the sight of Barnaby’s balls. Bemused, you ask him what his rush is.", parse);
					Text.NL();
					Text.Add("<i>“You’re gonna have to suck it while I do my job, so you’d better get started. I have no qualms about showing my dick to the patrons, and if I have to go out there, I’m dragging you with me.”</i>", parse);
					Text.NL();
					Text.Add("Even a quick glance at his face tells you that he means every single word. With that statement spurring you on, you reach out and start to caress his throbbing cock, preparing yourself for that first mouthful of dickmeat.", parse);
				} else {
					Text.Add("After glancing around to make sure he’s going to be free for a little while, you lean over the bartop and ask him how he’d feel about getting another blowjob, no strings attached.", parse);
					Text.NL();
					Text.Add("Barnaby chuckles. <i>“Really now? Maybe I should start charging to let you come back here and have a drink.”</i>", parse);
					Text.NL();
					Text.Add("And here you thought he liked you giving him a chance to blow off a little steam.", parse);
					Text.NL();
					Text.Add("<i>“I do, but I’m running a business here. Customers pay to drink, so what if what they happen to like is made right here in my fat balls?”</i> He ducks a hand under the counter, presumably to pat said balls.", parse);
					Text.NL();
					Text.Add("And what if the customers decide his new price is too rich for their wallet, hmm? Cum doesn’t keep the way booze does.", parse);
					Text.NL();
					Text.Add("<i>“That is a fair point. Well, nevertheless you know the drill, [playername]. Get over here, drop down and open wide,”</i> he says, already moving to take off his pants.", parse);
					Text.NL();
					Text.Add("You thought he would see reason. And you quickly make your way behind the counter, dropping into your now-expected spot under the bartop so that you can reach for his cock.", parse);
				}
				Text.NL();
				BarnabyScenes.BlowjobEntrypoint(() => {
					if (player.sex.gBlow < 5) {
						Text.Add("<i>“It was nice getting the weight off my balls, and you weren’t too bad at it.”</i>", parse);
						Text.NL();
						Text.Add("Seeing as how he's being a nice about it, you politely thank him for the compliment, admitting you do still have a bit to learn.", parse);
						Text.NL();
						Text.Add("<i>“If you want, you can use one of the rooms in the back to rest.”</i>", parse);
						Text.NL();
						Text.Add("That would be really appreciated. Your stomach is killing you...", parse);
					} else if (player.sex.gBlow < 25) {
						Text.Add("<i>“Getting that load off my balls is a real relief, and I had some fun too.”</i>", parse);
						Text.NL();
						Text.Add("That's probably the closest you've ever gotten to seeing Barnaby smile, so you just tell him that it was a pleasure to help out.", parse);
						Text.NL();
						Text.Add("He reaches into his pockets. <i>“Here.”</i>", parse);
						Text.NL();
						Text.Add("With a metallic tinkle, a small glittering object flies through the air to you, landing in your open palm. It's a single Rigard coin, shining dully back up at you.", parse);
						Text.NL();
						Text.Add("<i>“Little tip for services rendered. On top of that, I’ll let you use one of the back rooms to rest, for free.”</i> He grins.", parse);
						Text.NL();
						Text.Add("Gee... how generous. Still, you're in no mood to pick a fight, and you <b>do</b> feel a little bloated. So you just nod your thanks.", parse);
						party.coin += 1;
					} else {
						Text.Add("<i>“I think my balls were just about to turn purple from being so backed up. Good thing a nice little cock sucker like you was around to give me some release.”</i> He grins.", parse);
						Text.NL();
						Text.Add("He's actually smiling as he says this. It's amazing what an honest grin can do to his normally sour features. Feeling pretty pleased with yourself at this turn-around, you grin back and assure him that you enjoyed helping out.", parse);
						Text.NL();
						Text.Add("<i>“Normally, I wouldn’t dream of doing this, but...”</i> He reaches into his pockets and you hear the clinking of coins.", parse);
						Text.NL();
						Text.Add("Curious, you hold out your hand, and watch as he drops three Rigard coins into your palm.", parse);
						Text.NL();
						Text.Add("<i>“That was a lot of fun - not the best I’ve had, but certainly up there. Take them, you deserve a fat tip for your services.”</i>", parse);
						Text.NL();
						Text.Add("Well, it's not the most generous of tips you could have gotten. You're quite confident you could have charged close to ten times that amount. But since you hadn't asked for any money to begin with, you just accept the gift in the charitable interpretation of the spirit it was offered in.", parse);
						Text.NL();
						Text.Add("<i>“On top of that, you may also use one of the rooms in the back to rest if you need it. I’m almost always getting backed up because of my job, so whenever you’re around and craving a special drink, feel free to drop by. I’ll be sure to have some of your favorite stored up for you, hehe.”</i> He grins.", parse);
						Text.NL();
						Text.Add("You promise you'll remember that. And you think you'll take him up on that offer. You could use a little quiet time to digest after a feast like this...", parse);
						party.coin += 3;
					}
					Text.NL();
					Text.Add("Sloshing slightly, you quietly creep out from behind the bar counter and slowly make your way to the backroom, in no condition to be rushing anywhere.", parse);
					Text.NL();
					Text.Add("Seriously, you had no idea it was possible to get that pent-up. You can actually kind of understand him being such an asshole now... Though you're not sure if letting him take it out on you was entirely the best of ideas.", parse);
					if (player.PregHandler().MPregEnabled()) {
						Text.NL();
						Text.Add("You have a sudden pang of gratitude that nobody's come up with a potion to make conception via oral sex a reality yet. Otherwise, you have a sneaking suspicion you'd have a little surprise for Barnaby in about a season...", parse);
					}
					Text.Flush();

					TimeStep({hour: 1, minute: 30});

					Gui.NextPrompt();
				});
			},
		});
		/* TODO
		options.push({nameStr : "",
			tooltip : Text.Parse("", parse),
			enabled : true,
			func : () => {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
			}
		});
		*/
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			if (talkative) {
				Text.Add("<i>“Don't be a stranger.”</i>", parse);
			} else {
				Text.Add("<i>“Buy something next time, will you?”</i>", parse);
			}
			Text.Add(" Barnaby goes back to polishing a glass with a dirty rag.", parse);
			Text.Flush();

			Gui.NextPrompt();
		});
	}

	export function ChatPrompt() {
		const player = GAME().player;
		const miranda = GAME().miranda;
		const zina = GAME().zina;

		const parse: any = {

		};

		const options = [];
		/* TODO
		options.push({nameStr : "",
			tooltip : Text.Parse("", parse),
			enabled : true,
			func : () => {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
			}
		});
		*/
		options.push({nameStr : "Miranda",
			tooltip : Text.Parse("What can he tell you about the literal watchdog who hangs out here of a night?", parse),
			enabled : true,
			func() {
				Text.Clear();
				Text.Add("<i>“Ah, she’s the only cool member of the Watch. Doesn’t make trouble, teach smartasses a lesson, and most importantly, she always comes by to drink. I don’t mind putting up with her even if she were to get absolutely smashed.”</i>", parse);
				Text.NL();
				Text.Add("Sounds like she’s one of his better customers, then.", parse);
				Text.NL();
				Text.Add("<i>“Fair warning though, she doesn’t take well to bigots and assholes.”</i>", parse);
				Text.NL();
				if (miranda.flags.Met < MirandaFlags.Met.Tavern) {
					Text.Add("You’ll definitely need to keep that in mind, then. You thank him for the warning.", parse);
					Text.NL();
					Text.Add("<i>“You’re welcome.”</i>", parse);
				} else if (miranda.Nasty()) {
					Text.Add("Yes... you’ve kind of found that little fact out the hard way.", parse);
					Text.NL();
					Text.Add("Barnaby chuckles. <i>“Ticked her off, have you?”</i>", parse);
					Text.NL();
					Text.Add("There’s no point in denying it, so you just nod and tell him that you have.", parse);
					Text.NL();
					Text.Add("<i>“Well, you should probably try to make it up to her. She’s nice when you give her a chance, but she can be pretty mean otherwise. Of course, if you prefer meaner girls...”</i>", parse);
					Text.NL();
					if (player.SubDom() < -15) {
						Text.Add("Well... you don’t exactly like her being genuinely mad at you, but you have to admit, there is a certain... <i>thrill</i>... in the things she does to you. You do so <i>love</i> someone who can be so... commanding.", parse);
						Text.NL();
						Text.Add("Barnaby shrugs. <i>“Whatever floats your boat.”</i>", parse);
					} else if (player.SubDom() < 15) {
						Text.Add("Well... you’d be lying if you said you were entirely oblivious to the potential there, but at the same time, you’d rather be on her good side, you think.", parse);
						Text.NL();
						Text.Add("<i>“More of an incentive for you to make it up to her, then. Unless you really like big, fat dog dicks.”</i>", parse);
						Text.NL();
						Text.Add("Yes, he’s not wrong there. Still... maybe, after you make things up with her, she might be willing to discuss a more... consensual application of that side of her appetites?", parse);
						Text.NL();
						Text.Add("<i>“That’s between you and her.”</i>", parse);
					} else {
						Text.Add("...There are people out there who’d actually <b>like</b> being treated like that? Well, you suppose it takes all kinds, but you know for a fact you refuse to put up with it.", parse);
						Text.NL();
						Text.Add("<i>“Then follow my advice and make it up to her. Either that or get used to being her bitch.”</i>", parse);
						Text.NL();
						Text.Add("You can’t say you really like the idea of going begging to her for forgiveness. Then again, the alternative isn’t that much more appealing. At least it’s a chance to bend over in front of her without getting her cock jammed in you.", parse);
					}
				} else {
					Text.Add("Lucky that the two of you have managed to be civil to each other, then. You imagine she can be pretty inventive when it comes to expressing her disapproval to someone she doesn’t like.", parse);
					Text.NL();
					Text.Add("<i>“Yep, don’t get on her bad side. She sure knows how to be mean.”</i>", parse);
				}
				Text.Flush();

				TimeStep({minute: 10});

				BarnabyScenes.ChatPrompt();
			},
		});
		if (zina.Met() && !zina.Recruited()) {
			options.push({nameStr : "Zina",
				tooltip : Text.Parse("So, what’s the deal with that hyena-girl in the corner?", parse),
				enabled : true,
				func() {
					Text.Clear();
					Text.Add("<i>“Girl’s a vagrant, showed up around here a few days ago.”</i>", parse);
					Text.NL();
					Text.Add("Oh, really? You file that little tidbit away for later reference.", parse);
					Text.NL();
					Text.Add("<i>“She doesn’t make trouble, usually, but whenever she tries to drink something alcoholic she gets smashed in an instant.”</i>", parse);
					Text.NL();
					Text.Add("You kind of noticed. Seriously, she was practically unconscious after one drink. No wonder she sticks with milk.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, she’s a total lightweight, but at least she sobers up quick. Gotta say tho, she <b>knows</b> her stuff when it comes to blowjobs.”</i>", parse);
					Text.NL();
					if (zina.flags.Met & ZinaFlags.Met.BJ) {
						Text.Add("You can’t help the wistful smile that spreads across your lips as you recall your little rendezvous with Zina in the back rooms, chuckling as you confess that she most certainly does. Sounds like he has some personal experience with that, hmm?", parse);
						Text.NL();
						Text.Add("<i>“Yup, she gives me one as an apology every time she screws up. Main reason I don’t mind putting up with her. Well, that and her coin.”</i>", parse);
						Text.NL();
						Text.Add("With skills like hers, he’s probably grateful for every screw up, no matter the extra sweeping up it means in the end.", parse);
						Text.NL();
						Text.Add("<i>“No, really. I’d rather just have her coin and none of her trouble.”</i>", parse);
					} else if (zina.flags.Met & ZinaFlags.Met.Cunn) {
						Text.Add("Chuckling, you note that she knows her way around a pussy pretty well, too. Girl like her should make friends pretty easily here.", parse);
						Text.NL();
						Text.Add("<i>“She could if she were interested in doing that. I’ve seen my share of guys try to ask her for a blowjob only to wind up getting their asses kicked when they wouldn’t take no for an answer.”</i>", parse);
						Text.NL();
						Text.Add("Really, now? Interesting...", parse);
					} else {
						Text.Add("Well, you wouldn’t know anything about that. But you have wondered, ever since you turned her offer down.", parse);
						Text.NL();
						if (player.Femininity() > 0.1) {
							Text.Add("<i>“Well, it’s not like you got a dick of your own...”</i>", parse);
							Text.NL();
							if (player.FirstCock()) {
								Text.Add("Icily, you inform him that you <b>do</b> have the proper equipment for such an act; you just chose not to take advantage of someone whilst she was drunk.", parse);
								Text.NL();
								Text.Add("He shrugs. <i>“Could have fooled me. Pity you passed up on her though. She’s really good.”</i>", parse);
							} else {
								Text.Add("Yes, well, that was certainly part of the reason why.", parse);
								Text.NL();
								Text.Add("<i>“Too bad, you don’t know what you’re missing.”</i>", parse);
							}
						} else {
							Text.Add("He looks at you incredulously, as if you’d passed on the best deal of your life. <i>“Seriously?”</i>", parse);
							Text.NL();
							Text.Add("You shrug your shoulders defensively. It wasn’t right, taking advantage of a lady in a state like that.", parse);
							Text.NL();
							Text.Add("He chuckles, obviously taking you for a fool. <i>“It’s not taking advantage when she knows what she’s doing. Seriously though, are you a virgin? Celibate?”</i>", parse);
							Text.NL();
							Text.Add("You just stare at him back. You have your reasons, and that’s all he needs to know.", parse);
						}
					}
					Text.Flush();

					TimeStep({minute: 10});

					BarnabyScenes.ChatPrompt();
				},
			});
		}
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("On second thought, you don’t have any questions.", parse);
			Text.NL();
			Text.Add("He rolls his eyes when he hears that, but otherwise shows no reaction.", parse);
			Text.Flush();
			BarnabyScenes.Prompt(true);
		});
	}

	export function BlowjobEntrypoint(func: CallableFunction) {
		const player = GAME().player;
		const miranda = GAME().miranda;
		const zina = GAME().zina;

		const parse: any = {
			playername : player.name,
			boygirl    : player.mfTrue("boy", "girl"),
			guygal     : player.mfTrue("guy", "gal"),
		};
		parse.pheshe = player.mfTrue("he", "she");
		parse.phimher = player.mfTrue("him", "her");
		player.ParserTags(parse);

		player.slut.IncreaseStat(50, 1);

		Text.Add("Barnaby’s cock may only be half-erect at this point, but it still feels warm and solid in your fingers as you wrap your hand around it. You start to stroke his length, smooth and even pumps along the sensitive shaft. ", parse);
		if (player.sexlevel < 3) {
			Text.Add("You don’t know any fancy tricks to add, but hey, a handjob isn’t the most exotic thing in the world. Soon, even your clumsily enthusiastic stroking has coaxed Barnaby erect.", parse);
		} else if (player.sexlevel < 5) {
			Text.Add("You call on your knowledge of sex to try and make this feel better for Barnaby, adjusting the force of your fingers and trying to fondle the more sensitive spots in order to enhance the effects of your touch. Barnaby responds well, and soon is as hard as he’ll ever be.", parse);
		} else {
			Text.Add("Your skills let you play with the stallion’s instrument like a veritable maestro, touching the most sensitive spots and working your fingers deftly in order to bring him erect in what is practically an instant.", parse);
		}
		Text.NL();
		Text.Add("<i>“Good job, you got my junk hard.”</i>", parse);
		Text.NL();
		Text.Add("That you most certainly did. As if you needed more proof of how pent up the bartender is, his dick is already drooling, a thick streamer of off-white fluid, not quite cum, starting to flow from his blunt cock-tip.", parse);
		Text.NL();
		Text.Add("<i>“Well, you know what comes next, but before you start pass me the green bottle to your left.”</i>", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();
			Text.Add("Hardly a standard request during a blowjob, but what the hell. You grab the indicated beverage and pass it to Barnaby, the stallion placing it down atop the counter with the dull clunk of glass on wood.", parse);
			Text.NL();
			Text.Add("<i>“Thanks, now get back to work.”</i>", parse);
			Text.NL();
			Text.Add("Ungrateful... you force yourself to ignore what he said and just do as you are told. Still holding the base of Barnaby’s cock, you shuffle a little closer and extend your [tongue], daintily licking at the flow of sexual fluids seeping from his glans.", parse);
			Text.NL();
			if (player.sex.gBlow < 5) {
				Text.Add("The thick, salty, musky flavor is almost overpowering you, drawing an instinctive shudder. For a moment, you consider backing out, but you’ve come too far. Unable to properly stomach the taste of Barnaby’s juices, you simply dab at him with your tongue, meager flicks of your [tongueTip] to help you acclimatize yourself before you open your mouth and gingerly envelop his dick.", parse);
			} else if (player.sex.gBlow < 25) {
				Text.Add("Mmm... a little stronger than you’re used to, but not bad. Coaxed on by Barnaby’s intriguing flavor, you happily run your tongue along his shaft. You try to be playful when you can, doing your best to tease the more sensitive ridges and creases, but in the end you settle mostly for sheer enthusiasm. You greedily polish him to a gleaming sheen before hungrily opening your mouth and gulping down his cock.", parse);
			} else {
				Text.Add("Ah, delicious. Thick and rich and strong, just perfect. Your tongue darts like a lecherous serpent, deftly flicking all of the most sensitive spots you have discovered through your copious practice. If Barnaby wasn’t already rock-hard before, he will be now, the tasty streamer of man-goo growing ever thicker in response to your ministrations. You could probably get him to blow with just your tongue alone... but you want a real taste of him, and so you deftly gobble up his dick, eager to get to the real fun.", parse);
			}
			Text.NL();

			const cock = new Cock(Race.Horse);
			cock.length.base = 30;
			cock.thickness.base = 5;

			Sex.Blowjob(player, undefined);
			player.FuckOral(player.Mouth(), cock, 2);

			Text.Add("With the stallion’s cock now firmly placed in your mouth, you start to bob your head up and down along its length. You slowly savor it at first, giving yourself a chance to get a feel for the sizable piece of meat in your mouth. While Barnaby probably only counts as average by the standards of his own kind, that’s still at least a foot of inch and a half-thick sausage you are attempting to inhale.", parse);
			Text.NL();
			if (player.sex.gBlow < 5) {
				Text.Add("You can’t help but choke when his fat, blunt glans hits the back of your throat. Untrained as you are, your gag reflex protests the attempt to invade your gullet directly with something so big, forcing you to take it slower. Without any other recourse, you settle for working with lips and cheeks as best you can, noisily slobbering over Barnaby’s cock as you suckle like an infant.", parse);
				Text.NL();
				Text.Add("A dull grunt from above suggests that Barnaby is less than impressed with your skills, but evidently you’re not doing so badly that he’s going to kick you off his dick.", parse);
			} else if (player.sex.gBlow < 25) {
				Text.Add("Though your gag reflex protests a little at the invasion, it’s far too well-trained to be a major obstacle. With a little insistent pressure on your part, Barnaby’s cock slips down your gullet, letting you grip and squeeze him with each rippling flutter of your throat muscles. You need to concentrate on that, but still, it gives him plenty of friction to work again.", parse);
				Text.NL();
				Text.Add("Barnaby makes no sound of appreciation at your efforts, but nor does he make any sort of complaint, either, which is pretty telling of itself.", parse);
			} else {
				Text.Add("A big horsie he may be, but that’s no problem for you. Your gullet opens in invitation, allowing him to slide straight in with such ease he actually stumbles a little, clearly not expecting you to just gulp him down in one go like that. Your [tongue] deftly flicks and twirls along the underside of his shaft, caressing delicious dick-meat even as your throat clenches and squeezes, working to tease that yummy man-milk out of his balls and into where it belongs.", parse);
				Text.NL();
				Text.Add("A quiet moan, quickly strangled off, escapes Barnaby’s lips, and you’d smirk triumphantly if you didn’t have better things to be doing with your mouth.", parse);
			}
			Text.NL();
			Text.Add("As you busily work your mouth, you inquisitively reach out and gently take hold of the stallion’s bloated balls. As you tenderly roll them between your fingers, you can literally feel them churning in your grasp, pulsing as the seed roils inside of them.", parse);
			Text.NL();
			Text.Add("Before you can consider doing anything else with them, a hand roughly ", parse);
			if (player.HasHorns()) {
				Text.Add("grabs you by the [horns], tugging you firmly onto Barnaby’s cock.", parse);
			} else {
				Text.Add("pushes against the back of your head, making it impossible for you to try and back off.", parse);
			}
			Text.NL();
			Text.Add("<i>“Better drink up everything. I don’t want a mess behind my bar.”</i>", parse);
			Text.NL();
			Text.Add("What - already?! Anything you might have to say is muffled by the stallionhood so firmly jammed between your lips.", parse);
			Text.NL();
			Text.Add("<i>“Here’s your milk, [boygirl]!”</i> he says through gritted teeth.", parse);
			Text.Flush();

			Gui.NextPrompt(() => {
				Text.Clear();
				if (player.sex.gBlow < 5) {
					Text.Add("You don’t know how you manage it, but somehow you are able to drink up most of Barnaby’s load. And what a load it is; at one point, you started wondering if he would drown you in cum.", parse);
					Text.NL();
					Text.Add("Saying that the horse-morph was pent up would be the understatement of the century. Despite drinking up most of it, you’re still incapable of dealing with his volume. Seed escapes the corner of your mouth, and you’re forced to withdraw to catch your breath. The last of Barnaby’s cum winds up plastered on your face; a result of a complementary jet when you were forced to let go.", parse);
				} else if (player.sex.gBlow < 25) {
					Text.Add("You consider yourself to be at least somewhat skilled when it comes to blowjobs. Still, the horse cums so much that you can’t hope to swallow up the veritable tidal wave of equine spunk he shoots down your throat.", parse);
					Text.NL();
					Text.Add("Even as you suck it down and swallow around his shaft as best as you can, some of it winds up inevitably escaping the seal of your mouth and running down your chin.", parse);
				} else {
					Text.Add("You’re pretty darn skilled, but the horse-morph is so pent up that even you can’t hope to cope with his explosive climax.", parse);
					Text.NL();
					Text.Add("Seed blasts down your throat as you use every technique in your repertoire to chug it all down, but despite that some still manages to escape the seal of your mouth and run down your chin. Talk about being blue-balled; Barnaby was so pent up, you’re surprised his balls didn’t just explode with the pressure.", parse);
				}
				Text.NL();
				Text.Add("As you catch your breath beneath the counter, a large rag is unceremoniously tossed into your face. Quite literally at that. The thick, well-used cloth drapes itself over your head, forcing you to pull it off so that you can see again.", parse);
				Text.NL();
				Text.Add("<i>“Clean up any mess you left down there and prepare for next round.”</i>", parse);
				Text.NL();
				Text.Add("You wipe your face clean of any stray ropes of horse-jism, taking a moment to recompose yourself before his words sink in. Wait, next round?", parse);
				Text.NL();
				Text.Add("<i>“Yeah, you didn’t think I’d be satisfied with just one shot, right? Look at these babies.”</i> He gropes his balls, showing you just how full they still are.", parse);
				Text.NL();
				Text.Add("You can’t avoid noticing that despite just cumming enough to fill one of his own ale mugs, at the least, he’s still rock-hard, and even starts to dribble a thick mix of pre and cum again just from touching himself.", parse);
				Text.NL();
				Text.Add("<i>“Heh, looks like I’m already leaking again. You know the drill - wrap those pretty lips around my man-meat and swallow it all. Like I said before, don’t want a mess behind my bar.”</i>", parse);
				Text.NL();
				if (player.sexlevel < 3) {
					Text.Add("...Just what kind of trouble did you get yourself into this time?", parse);
					Text.NL();
					Text.Add("Even as you consider that in mild shock, the horse-morph’s stallionhood points at you like an accusing finger, and you’re jolted out of your musing when you feel that flat tip of his smear pre across your cheek.", parse);
					Text.NL();
					Text.Add("<i>“Well? You gonna open up or what?”</i>", parse);
					Text.NL();
					Text.Add("Barnaby’s musk, the scent of sex and thick throbbing shaft of his fills your head with a cloud of lust, and you find yourself opening up despite any reservations you might have. The horse-morph <i>needs</i> his release, and since you offered, might as well as do the best job that you can.", parse);
				} else if (player.sexlevel < 5) {
					Text.Add("This is kind of ridiculous; how does he put up with being this backed up? Most folk would’ve at least masturbated by now.", parse);
					Text.NL();
					Text.Add("<i>“My bar is open around the clock.”</i>", parse);
					Text.NL();
					Text.Add("...So he doesn’t even sleep?", parse);
					Text.NL();
					Text.Add("<i>“Nope.”</i>", parse);
					Text.NL();
					Text.Add("Well, no wonder he’s grumpy all the time, but how does he manage that?", parse);
					Text.NL();
					Text.Add("<i>“Secret of the trade. Now, are you going to use those lips for what they were made for, or keep asking these pointless questions?”</i>", parse);
					Text.NL();
					Text.Add("Alright, alright, no need to get pushy! You protest, leaning forward to tend to his flat tip.", parse);
				} else {
					Text.Add("Wow, if he’s already dripping even after having cum not moments ago, he must be <i>really</i> pent up!", parse);
					Text.NL();
					Text.Add("<i>“Yes, I am. And do you know what I <b>really</b> would like right now?”</i>", parse);
					Text.NL();
					Text.Add("Okay, you’re getting to it, just need to catch your breath a little.", parse);
					Text.NL();
					Text.Add("Barnaby leans forward, pressing the flat tip of his cock to your nose and smearing some of his pre across your lips. <i>“You’ll have time to breathe after I blow my next load - now get to it!”</i>", parse);
					Text.NL();
					Text.Add("Alright dammit! Gee, no need to be so douchey about it!", parse);
					Text.NL();
					Text.Add("You open your mouth and begin tending to his blunt tip.", parse);
				}
				Text.NL();

				Sex.Blowjob(player, undefined);
				player.FuckOral(player.Mouth(), cock, 1);

				Text.Flush();

				const scenes = new EncounterTable();

				scenes.AddEnc(() => {
					Text.Add("<i>“Hey, bartender! Can I get some ale over here?”</i>", parse);
					Text.NL();
					Text.Add("The voice is unfamiliar to you: masculine, from the timbre of it, but not someone you can place. Probably just a random customer.", parse);
					Text.NL();
					Text.Add("<i>“Can I get some coin over here?”</i> You hear Barnaby reply.", parse);
					Text.NL();
					Text.Add("A clatter of metallic ringings echoes above you as coins bounce onto the wooden counter. Without further adieu, the stallion reaches down and grabs", parse);
					if (player.HasHorns()) {
						parse.oneof = player.HasHorns().count > 1 ? " one of" : "";
						Text.Add("[oneof] your [horns], using it as a convenient lever to bodily drag you across the floor as he walks away from the counter.", parse);
					} else {
						Text.Add(" the back of your head, digging his fingers roughly into your scalp in order to force you to stay there as he hauls you across the floor with him.", parse);
					}
					Text.NL();
					Text.Add("Trapped like this, you scrabble along on the floor, half-crawling and half-dragging yourself to keep up with Barnaby as the barkeep taps one of his kegs. The thick scent of ale fills your nose, cutting through the musk of sex as he expertly fills his mug to a nice, frothy head and then turns back to the counter.", parse);
					Text.NL();
					Text.Add("You quickly scramble back under the counter, but you’re not sure that you escaped notice... In fact, you’re pretty sure that the customer saw you.", parse);
					Text.NL();
					Text.Add("<i>“Hey, is someone down there?”</i> the customer asks.", parse);
					Text.NL();
					Text.Add("<i>“None of your darn business,”</i> Barnaby replies.", parse);
					Text.NL();
					Text.Add("<i>“Ha! I knew it! Even you need to have some fun sometimes, eh?”</i>", parse);
					Text.NL();
					Text.Add("You wince at the loud *clonk* of wood on wood as Barnaby gruffly slams the patron’s drink down in front of him.", parse);
					Text.NL();
					Text.Add("<i>“Take the mug and go get drunk,”</i> the horse-morph says dismissively.", parse);
					Text.NL();
					Text.Add("<i>“Ha! Will take me more than a few! Be back for more later,”</i> the unknown patron replies, stepping away.", parse);
					Text.NL();
					if (player.Slut() < 15) {
						Text.Add("You press yourself as deeply into the shadows of the counter as you physically can, your whole body feeling afire with embarrassment. Maybe you should have thought twice about doing this...", parse);
					} else if (player.Slut() < 30) {
						Text.Add("You swallow nervously, shame coiling like a snake in your belly... but at the same time, you can’t quite deny the flare of arousal that tingles in your loins at your close call.", parse);
					} else {
						Text.Add("You would smirk proudly if your mouth wasn’t so busy. You wriggle a little closer to Barnaby, wondering if anyone else might catch a glimpse of you; the idea sounds so... <i>thrilling</i>.", parse);
					}
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Add("<i>“Barkeep? I’d like some spirits.”</i>", parse);
					Text.NL();
					Text.Add("You listen closely, but other than the faint metallic ring of coins clinking onto the counter, there’s no further word from this new customer. You don’t think that they’re anyone that you know, though.", parse);
					Text.NL();
					Text.Add("Barnaby leans over the counter and reaches down, unintentionally, or so you think, driving his cock down your throat rather forcefully.", parse);
					Text.NL();
					Text.Add("You can’t help but grunt at this rough treatment, even despite your impromptu gag.", parse);
					Text.NL();
					Text.Add("<i>“Hmm? What was that? Someone down there behind the bar?”</i> the female patron asks.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, care to join them?”</i> Barnaby asks; you don’t even need to see his face to know he’s sporting a lecherous grin.", parse);
					Text.NL();
					Text.Add("<i>“I’ll pass, just make sure you don’t get anything on my spirits,”</i> she replies.", parse);
					Text.NL();
					Text.Add("<i>“Don’t worry about it; if they spill any, I’ll cockslap them until they pass out.”</i> Barnaby chuckles.", parse);
					Text.NL();
					Text.Add("<i>“Yes, yes, my spirits?”</i>", parse);
					Text.NL();
					Text.Add("Barnaby’s hand promptly thrusts it into view, trying to grope around you in order to reach one of the bottles stashed beneath the counter. Trying to be helpful, you snatch a green one that he seems to have been feeling for and press it into his palm, watching as he lifts it back above the counter.", parse);
					Text.NL();
					Text.Add("The horse-morph looks at the bottle, then shakes his head. <i>“Not this one, the brown one.”</i> He points in the general direction of the bottle.", parse);
					Text.NL();
					Text.Add("This time, you pass him the right bottle. From above, you can hear the barkeeper uncorking it and gently tipping its contents into a mug. The faint sound of glass on wood precedes the sounds of steps fading into the distance, the customer clearly satisfied with her purchase.", parse);
					Text.NL();
					Text.Add("Barnaby pulls away so he can look down at you, with your lips still wrapped around his flat tip. <i>“Well, aren’t you lucky? Guess you get to keep me all for yourself.”</i> He grins.", parse);
					Text.NL();
					Text.Add("You roll your eyes drolly at the stallion’s words. Yes, you’re <b>such</b> a lucky [guygal], now aren’t you?", parse);
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Add("The distinctive sound of heavy boots, the sort favored by guards and adventurers, reaches your ears as someone plods over to the counter. A chorus of clinking echoes down to you as this latest customer carelessly spills coins down for a purchase.", parse);
					Text.NL();
					Text.Add("<i>“Ale, please.”</i>", parse);
					Text.NL();
					Text.Add("The voice has that tightness to it suggesting tiredness, but still sounds quite feminine. Sounds like she’s had a hard day, whoever she is... actually, now that you think about it, she sounds kind of familiar...", parse);
					Text.NL();
					Text.Add("<i>“Hey there, long day?”</i> Barnaby asks.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, as usual,”</i> she replies.", parse);
					Text.NL();
					Text.Add("<i>“Well, just sit tight and I’ll have your drink in a moment.”</i>", parse);
					Text.NL();
					Text.Add("Barnaby’s so eager to serve this customer that he doesn’t even try to hold your head to keep you from slipping off before he starts walking over to the kegs. You have to scramble over in a mad dashing crawl to keep his cock fixed inside your mouth where he wants it.", parse);
					Text.NL();
					Text.Add("<i>“Hey, why you shuffling like that?”</i> the female patron asks.", parse);
					Text.NL();
					Text.Add("<i>“Let’s just say that you caught me in the middle of something.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Ha! Having some fun back there, are you? Thought you didn’t goof around while on the job?”</i> She asks teasingly.", parse);
					Text.NL();
					Text.Add("<i>“Oh well, like you are one to talk...”</i> The horse-morph replies.", parse);
					Text.NL();
					Text.Add("<i>“True enough. Is it anyone I know?”</i>", parse);
					Text.NL();
					Text.Add("That voice, that way of talking - that enthusiasm about sex. There’s only one person it could possibly be on the business side of the counter there: none other than Miranda the literal watchdog.", parse);
					Text.NL();
					Text.Add("As if you needed the confirmation, the counter creaks as the anthro doberman half-climbs onto it, eagerly leaning over so that she can see for herself. Barnaby, of course, makes no effort to hide you, leaving you openly exposed so that she can see exactly who’s down there sucking his cock. You can only stare back up at her with wide eyes as her face comes into view.", parse);
					Text.NL();
					if (miranda.Nasty()) {
						Text.Add("She sneers at you, her usual harsh glare fixed in place. <i>“Well, well; I should have known you’d be down there, bitch. What’s wrong? Didn’t have any coin to pay him back? Or are you just such a cum-junkie that you had to bother a hard-working fellow like Barnaby here for your next fix?”</i>", parse);
						Text.NL();
						Text.Add("<i>“Or maybe [pheshe] just wanted a taste of fat stallion prick for a change,”</i> Barnaby adds.", parse);
						Text.NL();
						Text.Add("<i>“Wouldn’t surprise me in the slightest. Such a greedy little bitch [pheshe] is - and [pheshe] likes to act so high and mighty, too. Maybe I should bring some of my buddies from the Watch around, see if they’d like to try this little slut for themselves.”</i>", parse);
						Text.NL();
						Text.Add("<i>“That would be an interesting show, and it would bring me more business, so I don’t have a problem with that idea as long as you can keep it contained in one of the back rooms,”</i> Barnaby replies.", parse);
						Text.NL();
						if (player.Slut() < 50) {
							Text.Add("You let out a muffled squawk of protest - you didn’t sign up for any gangbanging, certainly not one under Miranda’s watch!", parse);
						} else {
							Text.Add("You can’t hold back an intrigued noise behind the gag of stallion cock. Whatever you may think of Miranda, that little scenario sounds... exciting.", parse);
						}
						Text.NL();
						Text.Add("<i>“I see I’ll have to think about it,”</i> Miranda smirks. <i>“But not until you’re done with [phimher], of course. First come, first served, right?”</i>", parse);
						Text.NL();
						Text.Add("<i>“Fair is fair. Now how about I get you that drink?”</i> he asks.", parse);
						Text.NL();
						Text.Add("<i>“Sounds good to me, I’m parched!”</i>", parse);
						Text.NL();
						Text.Add("<i>“Here you go.”</i> The horse-morph sets the mug down before Miranda.", parse);
						Text.NL();
						Text.Add("You can hear the doberherm snatch it up and guzzle at least a third of it on one go right there at the counter. <i>“Ah, good stuff! I’m going to savor the rest of this - after all, I’ll be needing my strength soon...”</i> She sneers back at you over the counter, and then heads back to her table.", parse);
						Text.NL();
						Text.Add("Why did it have to be Miranda? You press yourself more firmly into the counter’s shadow in hope of avoiding another such incident.", parse);
					} else {
						Text.Add("The canine morph’s face splits into an amused grin at the sight of you. <i>“Well, hello down there! How’d you wind up like that? If you were that hard up for money, you could have come and seen me - I’d have been happy to give you a loan... in exchange for some ‘compensation’.”</i> She grins.", parse);
						Text.NL();
						if (player.Slut() < 15) {
							Text.Add("Your cheeks flush at her words, being quite aware of just how Miranda would have probably asked you to ‘compensate her’.", parse);
						} else {
							Text.Add("You can’t smile with a mouthful of cock, so you just give her a sheepish shrug in response.", parse);
						}
						Text.NL();
						Text.Add("<i>“Don’t think money is the problem. Maybe [pheshe] just likes the taste of fat stallion cock. Not like things are expensive here.”</i>", parse);
						Text.NL();
						Text.Add("<i>“Yeah, I know, it’s one of your good points,”</i> she quips back, smiling playfully to lessen any sting in her words.", parse);
						Text.NL();
						Text.Add("<i>“Calling me cheap now, are you?”</i> he asks in mock indignation.", parse);
						Text.NL();
						Text.Add("<i>“Of course not! You’re very fair priced for the drinks you sell,”</i> Miranda replies.", parse);
						Text.NL();
						Text.Add("<i>“Thought so, and speaking of drinks, here’s yours.”</i> He sets the mugful of ale down in front of Miranda.", parse);
						Text.NL();
						Text.Add("<i>“Thank you very much,”</i> she cheerfully replies, snatching it up before the liquor even has time to settle.", parse);
						Text.NL();
						Text.Add("<i>“Now if you’ll excuse me, I have another ‘drink’ to serve to a very thirsty patron, hehe.”</i> He bucks slightly into your lips.", parse);
						Text.NL();
						Text.Add("<i>“Don’t wear [phimher] out <b>too</b> badly, Barnaby. I was kind of hoping [pheshe] might want to hang out with me after [pheshe]’s done,”</i> the doberherm chuckles, before her footsteps slowly pad away in the direction of her favorite seat.", parse);
						Text.NL();
						Text.Add("You tuck yourself back into the shadows under the counter. Well, there are certainly worse people you could have been seen by than Miranda, right?", parse);
					}
				}, 1.0, () => miranda.IsAtLocation() && miranda.flags.Met >= MirandaFlags.Met.TavernAftermath);
				scenes.AddEnc(() => {
					Text.Add("Before you can really start to get going on your second round, something changes in Barnaby’s body language. He seems... excited, maybe? Or perhaps amused would be better?", parse);
					Text.NL();
					Text.Add("Your curiosity is piqued when you make out the sounds of footsteps coming closer to the bar. Obviously, he’s got a customer, but still, why is he acting like this? When you sneak a peek up at him and he smirks back down, your concern only grows.", parse);
					Text.NL();
					Text.Add("<i>“Hey there, back for another drink?”</i> he asks teasingly.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, I’ll have another,”</i> replies a familiar feminine voice.", parse);
					Text.NL();
					Text.Add("<i>“’Nother mug of milk coming up!”</i> he declares before looking down at you. <i>“Pass me the jug on your right.”</i> He grins.", parse);
					Text.NL();
					Text.Add("Asshole! He’s not even trying to hide your presence. But caught between the metaphorical rock and a hard place, you grab for the jug of milk he indicates and pass it on to him. Strange order for a bar like this... wait; you <b>know</b> who’s up there now.", parse);
					Text.NL();
					Text.Add("<i>“Huh? Barnaby, you got someone down there?”</i> Zina asks.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, you’re not the only one who enjoys some man-milk once in awhile.”</i> Barnaby chuckles.", parse);
					Text.NL();
					Text.Add("Obviously intrigued by his words, it’s no surprise that the upside-down face of Zina pokes into view as the hyena leans over the counter to look at you.", parse);
					Text.NL();
					Text.Add("<i>“Oh, hey there, [playername]!</i>", parse);
					Text.NL();
					parse.mouth = player.HasMuzzle() ? "muzzle" : "mouth";
					Text.Add("With your [mouth] rather pre-occupied, the best you can do is give her a friendly wave in reply.", parse);
					Text.NL();
					Text.Add("<i>“Thought you’d get a drink straight from the tap, huh?”</i> She grins knowingly.", parse);
					Text.NL();
					if (player.Slut() < 15) {
						Text.Add("You flush, unable to meet her eyes, even though you know she isn’t trying to taunt you.", parse);
					} else {
						Text.Add("It’s a little tricky with your [mouth] so full, but you manage to nod in recognition; much to Barnaby’s benefit, seeing as it helps you bob along his shaft.", parse);
					}
					Text.NL();
					Text.Add("<i>“Ah, no need to strain your lips even more to reply. I know the feeling, it <b>is</b> an acquired taste, ain’t it?”</i> She grins.", parse);
					Text.NL();
					Text.Add("She can certainly say that again.", parse);
					Text.NL();
					Text.Add("<i>“High five!”</i> She extends her hand towards you.", parse);
					Text.NL();
					Text.Add("Unable to resist chuckling at her light-heartedness, you humor her by reaching up and slapping her palm with your own.", parse);
					Text.NL();
					Text.Add("<i>“Okay, cool. I’ll let you get back to your drink.”</i> She disappears back on the other side of the counter.", parse);
					Text.NL();
					Text.Add("<i>“If you want, you can get down there after [pheshe]’s done. I got plenty of drinks to go around,”</i> Barnaby interjects.", parse);
					Text.NL();
					Text.Add("<i>“Maybe, if I feel like it,”</i> Zina replies.", parse);
					Text.NL();
					Text.Add("<i>“I hope you do, you’re really good at this. Be seeing you.”</i> Barnaby waves as Zina steps away to return to her seat.", parse);
					Text.NL();
					Text.Add("...That may well be the nicest thing you’ve ever heard him say about anybody. As you settle back down in your little niche, you thank your luck that you were found by Zina. Nobody else would be so blasé about something like this.", parse);
				}, 1.0, () => zina.IsAtLocation() && zina.Met());
				/* TODO more scenes
				scenes.AddEnc(() => {
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
				}, 1.0, () => true);
				*/

				Gui.NextPrompt(() => {
					Text.Clear();
					scenes.Get();

					Text.NL();
					Text.Add("With that little... distraction... out of the way, you pick up where you left off. With the stallion’s cock still pouring pre-cum down your throat like a leaky faucet, you bob your head back and forth, working his shaft as best you can with your mouth alone.", parse);
					Text.NL();
					Text.Add("You don’t dare to touch his balls. Not just because he hasn’t said you can, but because you don’t want to risk him blowing up in your face, given just how pent-up he seems to be.", parse);
					Text.NL();
					Text.Add("Even with only your mouth and tongue, you seem to be doing a decent job. Barnaby keeps the juice coming, lubing your throat up with a nice, sloppy layer of pre-cum. A good thing, too, when he suddenly bucks against you, thrusting his cock roughly down your gullet.", parse);
					Text.NL();
					Text.Add("You grunt in surprise, caught off-guard, and glance upwards. The stallion-morph has abandoned his usual glass and is now holding onto the counter for support, bucking his hips as he changes this from a mere blowjob into a full-on facefucking.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, keep going like this and you’re going to get another shot soon,”</i> Barnaby says, beginning to pant.", parse);
					Text.NL();
					Text.Add("With little choice otherwise, you do your best to keep up with his pounding cock, noisily sucking and slobbering as you lap, gulp and bob the throbbing, drooling organ in your mouth.", parse);
					Text.NL();
					Text.Add("<i>“Don’t forget to swallow it all!”</i> he says, bucking a bit more enthusiastically.", parse);
					Text.NL();
					Text.Add("Oh, like you really have a choice...", parse);
					Text.NL();
					if (player.sex.gBlow < 5) {
						Text.Add("You could say that this is a little easier than the last time - at least this time, you’re expecting the enormous gush of cum that comes rocketing down your gullet. You close your eyes, hold your breath and try not to choke as his aching balls pour spurt after slippery spurt of seed into your mouth.", parse);
						Text.NL();
						Text.Add("Although you hardly get away unscathed, especially when your need to breathe forces you to spit out the stallion’s cock, getting a final complimentary blast right in the face, most of Barnaby’s climax miraculously manages to make its way into your stomach.", parse);
						Text.NL();
						Text.Add("Amazingly, this load was at <b>least</b> as big as the one before. In fact, a tiny, treacherous voice in the back of your mind whimpers that it might have been just a little bit <b>bigger</b>.", parse);
					}
					if (player.sex.gBlow < 25) {
						Text.Add("Practice may make perfect, but it can’t work miracles, and certainly not instantaneous ones. In the face of a second tidal wave of cum, this one easily as big as the first, your skills just aren’t enough to keep you clean. As fast as you guzzle it, a stream of backwash escapes the seal of your lips, leading to trickles running down your cheeks and chin, smearing over your face.", parse);
					} else {
						Text.Add("You're a skilled cum-guzzler, but Barnaby's over-stuffed balls are just a little beyond your league. You just can't seem to gulp, slurp and swallow fast enough to prevent a few trace trickles of semen seeping out of your lips and painting the lower half of your face in their meandering path.", parse);
					}
					Text.NL();
					Text.Add("With Barnaby finally having popped his cork for the second time, you reach for the rag and wipe your face down again, adding more cum to the smears from the first time.", parse);
					Text.NL();
					Text.Add("However, when you take it away, you can only note that his cock is <b>still</b> erect and dripping...", parse);
					Text.NL();
					Text.Add("<i>“Ah yeah… That was nice, now why don’t you get ready for another load. My balls feel a little lighter, but you still got a long way to go, [boygirl].”</i>", parse);
					Text.NL();
					if (player.Slut() < 30) {
						Text.Add("Oh, no...", parse);
					} else {
						Text.Add("This is sounding like a challenge... Yum.", parse);
					}
					Text.NL();
					Text.Add("<i>“Come on, no beating around the bush, you know you wanna,”</i> he says, rubbing his shaft against your cheek as it begins leaking pre once more.", parse);
					Text.NL();
					Text.Add("Without any further choice in the matter, you obediently open your mouth and let him guide it right back on inside.", parse);
					Text.Flush();
					player.AddLustFraction(0.3);

					Gui.NextPrompt(() => {
						Text.Clear();
						Text.Add("<i>“Ah. Yeah. Feels good to finally have some slack in my balls, hehe.”</i>", parse);
						Text.NL();
						Text.Add("You finish mopping the last of the cum from your face as best you can; the rag that Barnaby provided at the start of this little encounter is now sopping wet, soaked through from the sheer amount of times you've had to use it.", parse);
						Text.NL();
						Text.Add("You hold it between forefinger and thumb, and then let it drop to the floor with a wet splat before turning to face Barnaby. ", parse);
						if (player.Slut() < 50) {
							Text.Add("Dryly, you tell him that you're happy that you gave him some much needed release. Then you gingerly rub your belly, listening to it gurgle as it struggles to digest your titanic semen repast.", parse);
						} else {
							Text.Add("Cheerfully, you assure him that it was your pleasure, demurely covering your mouth as your gurgling stomach churns up a tiny burp.", parse);
						}
						Text.NL();
						Text.Add("<i>“Yeah, sure. Mind handing me my pants?”</i> He points at the discarded garment.", parse);
						Text.NL();
						Text.Add("You helpfully grab them and pass them over.", parse);
						Text.NL();
						Text.Add("<i>“Thanks.”</i> Barnaby unceremoniously puts it on, tucking his junk back inside nice and comfy before turning to look at you.", parse);
						Text.NL();
						func();
					});
				});

			});

		});
	}

}

export { TavernLoc };
