import * as _ from "lodash";
import { CumLevel } from "../../body/balls";
import { LowerBodyType } from "../../body/body";
import { BreastSize } from "../../body/breasts";
import { Cock } from "../../body/cock";
import { Gender } from "../../body/gender";
import { Capacity, Orifice } from "../../body/orifice";
import { Race } from "../../body/race";
import { EncounterTable } from "../../encountertable";
import { Entity } from "../../entity";
import { Sex } from "../../entity-sex";
import { GAME, MoveToLocation, TimeStep, WORLD, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { AlchemyItems } from "../../items/alchemy";
import { IngredientItems } from "../../items/ingredients";
import { ToysItems } from "../../items/toys";
import { JobEnum } from "../../job";
import { IChoice } from "../../link";
import { BurrowsFlags } from "../../loc/burrows-flags";
import { MarketScenes } from "../../loc/farm-market";
import { GP } from "../../parser";
import { Party } from "../../party";
import { IParse, Text } from "../../text";
import { Season, Time } from "../../time";
import { Player } from "../player";
import { Gwendy } from "./gwendy";
import { GwendyFlags } from "./gwendy-flags";
import { Layla } from "./layla";
import { LaylaFlags } from "./layla-flags";

export namespace GwendyScenes {
	export function Approach(prompt: CallableFunction) {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;
		const pc = player.Parser;

		const bailout: GwendyFlags.Bailout = gwendy.flags.Bailout;

		Text.Clear();
		if (bailout === GwendyFlags.Bailout.Slip) {
			BailoutSlip();
		} else {
			Text.Out(`The farmer looks up as you approach, `);
			if (gwendy.Relation() < 30) {
				Text.Out(`giving you a tired little wave. “Howdy there, ${pc.name}.” ${gwendy.IsAsleep() ? "She stretches and yawns, pushing a stray hair out of her eyes. “What brings you to waking up a gal in the middle of the night?”" : "She pauses in her work, wiping her brow with the back of her hand. “What can I do for ya?”"}`);
			} else if (gwendy.Relation() < 60) {
				Text.Out(`giving you a warm smile. “Hey, ${pc.name}, nice seeing you!” ${gwendy.IsAsleep() ? "She rises slowly, stretching seductively. “I hope ya got something important on your mind, interrupting my beauty sleep like this.” Despite her snarky tone, she doesn’t appear to mind your presence that much." : "She pauses in her work, wiping her brow with the back of her hand as she steps over to you. “Now, what do you want with little old me?”"}`);
			} else { // High rel
				Text.Out(`her worried frown melting away. “Mm… don’t be a stranger, come over here.” ${gwendy.IsAsleep() ? "She rises slowly, giving you a little show as she adjusts her tight nightdress, her eyes never leaving yours. “I was just having a nap. I’m sure we can find something more interesting to do.” She pats the bed next to her." : "She pauses in her work, wiping her brow with the back of her hand as she steps up close to you and gives you a playful punch on the shoulder. “Here to help, or did you just want to ogle me?” From her tone, she doesn’t appear to mind being ogled."}`);
			}
			Text.Flush();
			prompt();
		}
	}

	function BailoutSlip() {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;
		const pc = player.Parser;

		Text.Out(`You approach Gwendy somewhat hesitantly, memories of how you last parted clear in your mind. The farmer gives you a wave and an amicable smile, tossing her braid over her shoulder. Before you have time to gather your thoughts, she speaks up.

		“Fancy seeing you here again, ${pc.name}.” She lowers her voice as she steps in closer, letting one of her hands trail down your side. “I hope you haven’t forgotten where we left off… I certainly haven’t. I’ll admit to being a bit of a size queen… and by the time I’m done with you, you are going to be as well. So… what’ll it be, lover?”

		Well, if there ever was any doubt, she’s still intent on giving you a good fucking, one you’re going to be feeling for a while.`);
		Text.Flush();

		const options: IChoice[] = [
			{
				nameStr: `Submit`,
				func: BailoutSubmit,
				enabled: true,
				tooltip: `Alright… she surprised you a bit before, but you think you could take it now. Hopefully.`,
			},
			{
				nameStr: `Refuse`,
				func: () => {
					Text.Clear();
					Text.Out(`Yeah… no. She’s been really pushing it to a ridiculous degree with these challenges. This is where you draw the line.

					“You’re no fun.” Gwendy pouts, stepping back from you. “If you are going to be that way… fine. But on one condition. No more challenges until you accept your loss. It’s only fair.” She smirks at you slyly. “Maybe this will give you some fun ideas… not that I’m worried… you’d have to win first, after all.”

					Well, not much you can do about that. You’re either going to have to accept things the way they are… or suck it up and do what she wants.`);
					Text.Flush();

					gwendy.flags.Bailout = GwendyFlags.Bailout.Talked;

					TimeStep({minute: 15});

					Gui.NextPrompt();
				},
				enabled: true,
				tooltip: `Nope, not doing that.`,
			},
			{
				nameStr: `Dominate`,
				func: BailoutDominate,
				enabled: player.SubDom() - gwendy.SubDom() >= 50,
				tooltip: `Stand up to her and tell her you’re not going to take any more of her shenanigans.`,
			},
		];
		Gui.SetButtonsFromList(options);
	}

	function BailoutSubmit() {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;

		const pc = player.Parser;

		const { shortstackPC, tallPC } = player.HeightDiff(gwendy);
		const dommy = gwendy.SubDom() - player.SubDom() >= 50;

		gwendy.flags.Bailout = GwendyFlags.Bailout.Submit;

		// Get biggest cock or horsecock
		const { cock, bigcock } = _GetHorsecockBigcock(player);
		player.SetPreferredCock(cock);

		const lossScene: GwendyFlags.ChallengeLostScene = gwendy.flags.ChallengeLostScene - 1;
		let getFucked = lossScene === GwendyFlags.ChallengeLostScene.Fucked;

		const eplus = gwendy.EPlus();
		const dOdds = gwendy.SubDom() - player.SubDom();
		const dildoFirst = !gwendy.UsedDDildo();

		const atLoft = GAME().party.location === WORLD().loc.Farm.Loft;

		Text.Clear();
		Text.Out(`You give her a hesitant nod. Gwendy slides her hands sensually up your sides, ${shortstackPC ? `cupping your head and tilting it to look up at her` : tallPC ? `grabbing you by the waist and pulling you closer` : `letting them rest on your shoulders`}. “That’s a good ${pc.mfFem(`boy`, `girl`)}. I’ll be sure to take <b>good</b> care of you.” ${shortstackPC ? `Leaning down and twining her fingers behind your neck, she` : tallPC ? `She crooks her finger, commanding you to lean down. As you do, she twines her fingers behind your neck and` : `Twining her fingers behind your neck, she`} pulls you in for a fierce kiss. `);

		if (atLoft) {
			Text.Out(`Her tongue ravages you, relentlessly riling you up, before she suddenly breaks off, giving you a gentle push backwards. You hungrily drink in her voluptuous body, and she flashes you a playful grin${eplus ? ` which only widens as your eyes reach the swelling bulge in her pants` : `, lavishing your gaze`}.`);
		} else {
			Text.Out(`For a moment, you’re worried the farmer wants to take you right then and there; she seems completely unconcerned by the rapt audience of the rest of the farm ogling you. You pat her on the shoulder, gently freeing yourself and suggesting you take this somewhere more private.`);
			Text.NL();
			if (dommy) {
				Text.Out(`“What, ya getting embarrassed, ${pc.name}?” Gwendy teases you, nuzzling you as she blatantly gropes you, her hand trailing down your back before sinking into your ${pc.butt}.${eplus ? ` The massive bulge of her dick is plainly visible through her tight pants. It strains for release as she shamelessly grinds against you.` : ``} “You think they don’t know about us? That’s cute… While it would be fun to fuck you right here in front of everyone, it would have a bad impact on productivity. Who knows, they’d probably want to take a turn once I’m done with you; we wouldn’t get any work done for hours.”

				She twirls you around and gives you a swat on your ${pc.butt}, nudging you in the direction of the loft. “Lead the way. I’ll be right behind you, enjoying the view.”`);
			} else {
				Text.Out(`“Ah… perhaps that would be best,” Gwendy agrees, blushing slightly as she’s reminded of her surroundings. Grabbing you firmly by the ${pc.hand}, she pulls you towards the loft, your unease increasing with each step.`);
			}
			Text.NL();
			Text.Out(`Before long, you’ve entered Gwendy’s love den, and this time you don’t think she’s going to let you off easy… not before she’s had her fill.`);
		}
		Text.NL();
		Text.Out(`“Strip down. I want you on the bed, ready and waiting for me,” the farmer orders, undoing the knot on her shirt and casually tossing it on the floorboards, freeing her huge tits. You hurry to comply while she shrugs out of her pants${eplus ? `, letting her horsecock flop down between her knees` : ``}.`);
		Text.NL();
		if (getFucked) {
			if (eplus) {
				Text.Out(`“Tell me you honestly haven’t been craving this cock since you ran away,” Gwendy taunts you, slowly stroking the swelling monster that’s soon going to be rearranging your insides. “These balls of mine are filled to the brim… I’ll be sure to punish you good for bailing on me… and you’re going to love every second of it.”`);
			} else {
				Text.Out(`While you undress, Gwendy saunters over to her chest of sex toys, flipping it open and reaching inside it. “You remember this bad boy, don’t you?” she queries, swinging around with a familiar equine strap-on cradled in her arms. “After I’m done with ya, you’re going to regret having bailed out before…” The farmer smiles ominously, stepping into the sturdy harness and fastening the straps of the massive artificial shaft. “…you are going to regret having missed out, and start craving for more.”`);
			}
			Text.Out(` She grins, slowly stalking towards you. “Better be ready, ‘cause here I come.” You sink down on the bed, grabbing hold of a pillow and accepting the inevitable.`);
		} else { // ddildo
			Text.Out(`As you settle down on the bed to nervously watch Gwendy, she saunters over to her toy-filled chest to retrieve the double-ended-dong she scared you away with before. `);
			if (dommy) {
				Text.Out(`She purses her lips as she bends over to rummage through its contents, butt swaying alluringly.`);
				Text.NL();
				if (eplus) {
					Text.Out(`“Ya know… fuck it.“ She straightens up, flipping the lid close with her foot. “I was going to savor this a bit longer before I broke you in good, but I think I’ve deserved taking my victory out with some interest.” She turns around, grinning at you as she teasingly swings her massive equine member back and forth. “You knew I was going to rail you with this bitch-breaker sooner or later anyway. I’ve been saving up for when you eventually caved... ” She gives her full balls a fondle before trailing her hand down the length of her turgid fuck-stick.`);
				} else {
					Text.Out(`“Hmm… no. I think we are going to do something a bit different. I think your defiance before requires a little extra punishment.” Your protests about the unfairness of this die on your lips as she pulls out a massive equine strap-on from the chest, at least as thick as her previous toy. “Been wanting to use this on you for a while,” she notes as she casually fastens it, testing the industrial-grade straps holding it in place. The farmer strikes quite a menacing pose with the ridiculously large artificial shaft jutting out from her crotch. “This beast will stay hard until I’m finished with ya… which is going to be a long while, trust me on that.”`);
				}
				Text.NL();
				Text.Out(`Gwendy slowly stalks towards you, her eyes smoldering and her ${eplus ? `cock stirring` : `equine strap-on swaying ominously`}.`);

				// set scene to Get Fucked (increment lossScene, open up Get Fucked)
				gwendy.flags.ChallengeLostScene++;
				getFucked = true;
			} else {
				Text.Out(`“I’m gonna enjoy this as much as you will… more, probably.” Her fingers trail down the massive toy, lovingly caressing its length. “It’s not often I get to use this on someone, and I’m going to relish in it.” She swings around and starts stalking towards you, dildo slung across her shoulder like a two-handed club.`);
			}
		}

		player.subDom.DecreaseStat(-100, 5);
		gwendy.subDom.IncreaseStat(100, 10);

		if (getFucked) {
			LossGetFuckedMerge({ first: true, hangout: false });
		} else {
			LossRideEntrypoint({
				first: true, hangout: false, eplus,
				ddildo: true, dildoFirst, dOdds, bigcock,
				cock,
			});
		}
	}

	function BailoutDominate() {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;

		const { shortstackPC, tallPC } = player.HeightDiff(gwendy);
		const atLoft = GAME().party.location === WORLD().loc.Farm.Loft;

		gwendy.flags.Bailout = GwendyFlags.Bailout.Dominate;

		Text.Clear();
		Text.Out(`You’ve had just about enough of this charade. Quite bluntly, you tell her that this entire challenge thing she’s been pushing is nonsensical. She’s just making up rules as she goes, and it’s getting more and more forced as times goes by. Why go through all the trouble when it’s obvious she’s just looking for an excuse to fuck?

		“W-What?” Gwendy blinks, surprised at the turn the conversation just took. She blushes as she breaks eye contact. “T-that’s not it…”

		Sure seems like it to you. You step up close, lowering your voice to a sultry whisper. If all she’s looking for is a good lay, then why all the beating around the bush? You are up for showing her a good time any time she needs it. Gwendy jumps as you reach around and give her butt a squeeze.

		“W-Well, u-uhm…” The farmer’s breath quickens as you grope her full ass${shortstackPC ? ` and smirk up at her` : tallPC ? `, leaning down to nibble her neck` : `, leaning in to nibble her neck`}. So… what will it be? `);
		if (atLoft) {
			Text.Out(`“Alright, I give, I give. Have it your way.” She pouts a bit as she leans away from you, her freckled face blushing prettily.`);
		} else {
			Text.Out(`By this point, she’s beet-red, very much aware of the eyes of the farmhands on the two of you.

			“I… O-Okay, okay, you win!” She pries herself away from you, adjusting her top self-consciously. “Let’s continue this… talk… up in the loft.” She all but drags you towards her love den. Whether it’s because she’s eager to get out of the public eye, or just eager, is unclear. Before long, you find yourself face to face with the worked-up farmer in her cozy bedroom.`);
		}
		Text.NL();
		Text.Out(`“So, what would you have us do, now that we’ve dropped the pretense?” She gives you a sultry smile. “I’m up for anything… but you better live up to those bold words of yours.”`);

		player.subDom.IncreaseStat(100, 5);
		gwendy.subDom.DecreaseStat(-100, 10);

		Text.Flush();

		const winScene: GwendyFlags.ChallengeWinScene = gwendy.flags.ChallengeWinScene;
		if (winScene < GwendyFlags.ChallengeWinScene.LAST) {
			gwendy.flags.ChallengeWinScene = GwendyFlags.ChallengeWinScene.LAST;
		}

		const options: IChoice[] = [];
		GwendyScenes.ChallengeSexWonPrompt(true, options, true);
		Gui.SetButtonsFromList(options);
	}

	function ChallengePushHer(back: CallableFunction) {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;

		const pc = player.Parser;
		const eplus = gwendy.EPlus();

		const { shortstackPC, tallPC } = player.HeightDiff(gwendy);
		const atLoft = GAME().party.location === WORLD().loc.Farm.Loft;
		const atBarn = GAME().party.location === WORLD().loc.Farm.Barn;

		Text.Clear();
		Text.Out(`The thing is… is that really all there’s to it? The way she’s been pushing you when she’s won your little games… you can tell that she’s letting out a side of herself that she doesn’t often exhibit. You lick your ${pc.lips}. What would it be like if she were to let that out?

		“...What, ${pc.name}?” Gwendy gives you an odd look. “Are you saying that…?”

		Isn’t she… holding back? You could hardly get excited about a game like this unless the stakes were a little higher. A slow smile spreads across the farmer’s face. “An’ here I was, worried that ya’d run off on me if I got a bit rough with ya… but you won’t do that, will you?” You shake your head, heart beating rapidly as she leans in close.`);
		Text.NL();
		if (player.Humanoid()) {
			Text.Out(`“Let’s test that conviction of yours, shall we?” Gwendy twirls her braid as she leans against you. “${atLoft ? `Down below` : atBarn ? `In that pen over there` : `Back in the barn`}, I’ve got the biggest and meanest stallion this side of the Kingdom. Got a real temper on him, he does. Here’s the challenge: we are both going to ride him, and the one able to stay on the longest is declared the undisputed champion… sounds simple enough?”`);
		} else { // (taur, naga)
			Text.Out(`“Let’s test that conviction of yours, shall we?” Gwendy leans against you, trailing a hand down your side. “${pc.taur(`I’ve always admired taurs… so much strength in their bodies. I bet you could run quite fast as well, couldn’t you?`, `I’ve heard stories of the nagas of the wastes being able to capture unwary riders on sheer speed alone… how about this?`)} I propose a race of sorts. You go as you are, I will take one of the horses from the stable. First to make it all the way ‘round the farm and back will be the champion… sounds simple enough? What do you say? I’m curious how you’ll do against a real stallion.”

			Racing against a horse…? You’re not sure about this…`);
		}
		Text.NL();
		Text.Out(`She nuzzles up against you, ${shortstackPC ? `pressing your head into her tits` : tallPC ? `rubbing her hand leisurely against your crotch` : `her breath hot in your ${pc.ear}`}.

		“If you win… you can do whatever you want with me. If you lose… I’m going to throw you on my bed, ${eplus ? `whip out my cock` : `grab the biggest strap-on in my collection`} and fuck you until you have trouble walking.” She leans back, smiling brightly. “You game?”

		Something about her confidence tells you that your chances of winning probably aren’t going to be very high…`);
		Text.Flush();

		// [Alright…][Back out]
		const options: IChoice[] = [
			{
				nameStr : "Alright…",
				func : () => {
					Text.Clear();
					Text.Add(`“Ya got spunk at least, I’ll give you that.” Gwendy gestures for you to follow her as she ${atLoft ? `climbs down the ladder` : atBarn ? `turns` : `walks inside the barn`}, heading over to one of the pens. Your confidence starts to dwindle as you approach, spying the giant shape housed within.

					“This here’s Midnight,” the farmer proclaims as she leads a veritable monster of a horse out of the enclosure. The muscular steed is by far the biggest specimen of his kind you’ve ever seen; pitch black and in possession of a very mean glare. He stomps, snorting derisively at you. Gwendy seems unperturbed by the wild beast.`);
					Text.NL();

					// Skill check
					let skillcheck = (player.dexterity.Get() + player.stamina.Get()) / 2;
					skillcheck += Math.random() * 10 - 5;
					const bigloss = skillcheck < 30;
					const loss = skillcheck < 60;

					if (player.Humanoid()) {
						Text.Add(`The three of you head out into the yard, and Gwendy hands you the reins. “Come along, let’s see you put your money where your mouth is. You can go first.” ${player.Height() < 200 ? `The farmer points to a bale of hay nearby to use as a platform. Even so` : `Even for someone as tall as you`}, mounting the massive equine is no small feat.`);
						Text.NL();
						if (bigloss) {
							Text.Add(`You’ve barely gained your seat when Midnight rears on his hind legs, flinging you through the air and onto your back with a loud thud. Thankfully, nothing seems broken. “You… alright there, ${pc.name}?” Gwendy snickers, peering over your prone form. “Want a second try? Looks like you slipped a little…” You groan that you think you’ve had enough.`);
						} else if (loss) {
							Text.Add(`You’ve barely gained your seat when Midnight rears on his hind legs, and it’s all you can do to stay seated. Somehow, you’re able to grasp hold of his mane and stabilize yourself. You hang on for dear life as the stallion throws himself into a wild gallop around the farm, but you can already feel that you’re not going to last for long. Gwendy wasn’t kidding when she said he’s the meanest horse this side of the Kingdom.

							You last about five minutes before your arms give and you’re thrown off Midnight’s back, scrambling out of the way to not get trampled. “Not bad, I must say.” The farmer has been observing from atop a nearby bale of hay with an amused grin on her face.`);

							TimeStep({minute: 5});
						} else {
							Text.Add(`You’ve barely gained your seat when Midnight rears on his hind legs, attempting to toss you off. You manage to hold on, grabbing onto the reins tightly. The stallion gives you a nasty glare over his shoulder, before throwing himself into a wild gallop around the farm. At first, it’s all you can do to keep your seat, but gradually the exhilarating sense of power of riding the beast starts to fill you. The wind roars in your ${pc.ears} and whips your ${pc.skin}, but you stay in the saddle.

							Gwendy tosses you a loud woop as you speed by the barn, and you turn and give her a wave. “Careful there!” she hollers. Too late, you turn to see the oncoming tree branch, which swats you to the ground and takes the wind out of you. Groaning, you pull yourself up, verifying that nothing is broken. The horse gives you the most evil of grins before nonchalantly trotting off. That he did it on purpose isn’t even a question. Still, you managed to stay on his back for a good fifteen minutes.

							Gritting your teeth, you limp back to the barn where the farmer is waiting. “Impressive! You might win this one, ${pc.name}!” She gives you a pat on the shoulder.`);

							TimeStep({minute: 15});
						}
						Text.NL();
						Text.Add(`Tossing her braid over her shoulder, Gwendy confidently strides towards where Midnight is stalking the yard. The giant steed snorts as she approaches, pawing the ground with his hoof. You gulp, worried for the farmer’s health.

						“Alright, my turn.” She runs up and grabs Midnight’s reins, smoothly swinging onto his back. You tense up… and… nothing happens. Gwendy whistles innocently, not even bothering to sit astride the horse properly, both her legs dangling down one side like a delicate noblewoman. The giant equine pokes at the dirt with one hoof, cool as a cucumber.

						“We can wait for awhile if you want… but I don’t think there’s much need, is there?” Gwendy cocks her head to the side, smirking down at you. Sighing and accepting that you’ve been tricked, you shake your head, admitting defeat.`);
					} else {
						Text.Add(`The three of you head into the yard, Gwendy hopping onto Midnight’s back with practiced ease. The horse throws you a nonchalant and dismissive glance as you get into place beside him. You ask the farmer what the course will be, but she just grins at you. “Don’t worry, all you need to do is follow behind me. On my mark…” Before you have time to protest, she gives a shrill whistle, signaling the start of the race.`);
						Text.NL();
						if (bigloss) {
							Text.Add(`Gwendy and Midnight streak off like the wind, easily leaving you behind. You get about a third of the way before you slow down, winded and desponded. By the looks of it, the farmer has almost completed her circuit. Grumbling, you turn aside from the trail, heading back towards the farm to meet with her.`);
						} else if (loss) {
							Text.Add(`Despite your best efforts, you can barely keep up with Gwendy and Midnight. The giant horse’s hindquarters slowly inch away from you as the tireless beast gallops around the farm, leaving you in his dust. By the time Gwendy finishes the circuit, you’re behind by half a minute.`);
						} else {
							Text.Add(`At first, you are able to keep abreast of Midnight as the horse thunders down the trail, but inch by inch you start losing ground. It’s not about raw speed and power, you are simply not used enough to your new body to match up against a beast in its natural habitat. It’s not by much, but by the time you complete the circuit, Gwendy is ahead of you by a few seconds.`);
						}
						Text.NL();
						Text.Add(`“A valiant, if futile, effort.” The farmer smiles as you ${pc.taur(`trot`, `slither`)} into the yard. You complain that it wasn’t exactly a fair challenge. “Never claimed it was.” She tosses her braid over her shoulder, giving you a smoldering look. “Besides, you knew what you were getting yourself into, didn’t you? I hope you’re not planning on going back on your word…?”

						You sigh and shake your head, admitting defeat.`);
					}
					Text.NL();
					Text.Add(`“Excellent. Let me scrub Midnight down and put him in his pen. When I get up to the loft, I expect to see you naked and ready. Don’t disappoint me further.” You enter the barn behind her, splitting off to climb the ladder up to Gwendy’s love nest. It’s a while before the farmer herself will finish below, so you have plenty of time to undress. You flop down on the bed, nuzzling a pillow as you contemplate your recent life choices and impending fate.

					Your lover is already shedding her clothes as she enters the loft, leaving pieces of fabric strewn around carelessly on the floor. ${eplus ?
						`She wastes little time stripping down to her birthday suit, her massive equine shaft already swelling` :
						`She immediately heads over to her chest of toys, rummaging around in it until she pulls out a massive equine strap-on, pulling it on and securing it with heavy leather strips. “Here I come, ${pc.name}.” The toy swings ominously between her knees`
						} as she stalks towards you, ready to claim her prize. The breeding stallion’s heavy musk is still on her, mingling with the farmer’s own sweeter smell.`);

					if (gwendy.flags.ChallengeLostScene < GwendyFlags.ChallengeLostScene.LAST) {
						gwendy.flags.ChallengeLostScene = GwendyFlags.ChallengeLostScene.LAST;
					}

					gwendy.flags.Bailout = GwendyFlags.Bailout.Submit;
					player.subDom.DecreaseStat(-100, 5);
					gwendy.subDom.IncreaseStat(100, 10);

					LossGetFuckedMerge({ first: true, hangout: false });
				}, enabled : true,
				tooltip : "You’ll bite. Whoever wins, you are going to enjoy the results. Bring on the stallion.",
			},
			{
				nameStr : "Back out",
				func : () => {
					Text.Clear();
					Text.Add(`You gulp, shaking your head as you come to your senses.

					“Thought as much…” Gwendy says, nonetheless managing to look disappointed. “If you change your mind… well, you know where to find me.” She gives you a wink. “Might have tipped my hand a bit there… I hope you are still up for our regular challenges?”`);
					Text.Flush();

					GwendyScenes.Talk(back);
				}, enabled : true,
				tooltip : "Ah… come to think of it…",
			},
		];
		Gui.SetButtonsFromList(options);
	}

	function TalkEntry(back: CallableFunction) {
		return { nameStr : "Talk",
			func : () => {
				Text.Clear();
				Text.Out(`“In a talkative mood, eh? Sure, I’ve got a few moments to spare. What did you want to chat about?”`);
				Text.Flush();

				GwendyScenes.Talk(back);
			}, enabled : true,
			tooltip : "Chat with Gwendy.",
		};
	}

	export function LoftPrompt() {
		const gwendy: Gwendy = GAME().gwendy;

		// [Talk][Work]
		const options: IChoice[] = [];
		options.push(TalkEntry(LoftPrompt));
		options.push({ nameStr : "Sex",
			func : () => {
				Text.Clear();
				Text.Out(`“Hmm... I'm down.” Gwendy blushes at your proposal. Now, what do you want to do with the farmgirl?`);
				Text.Flush();
				GwendyScenes.LoftSexPrompt(() => {
					Text.Clear();
					Text.Out(`“Aww... maybe next time, then?” Gwendy pouts.`);
					Text.Flush();

					LoftPrompt();
				}, false);
			}, enabled : gwendy.Sexed(),
			tooltip : "Proposition her for sex.",
		});
		Gui.SetButtonsFromList(options, true);
	}

	export function LoftSexPrompt(back: CallableFunction, disableSleep: boolean, minWinScene: GwendyFlags.ChallengeWinScene = GwendyFlags.ChallengeWinScene.Kiss, minLossScene: GwendyFlags.ChallengeLostScene = GwendyFlags.ChallengeLostScene.Kiss) {
		const parse: IParse = {};
		const options: IChoice[] = [];
		GwendyScenes.ChallengeSexWonPrompt(true, options, disableSleep, minWinScene);
		GwendyScenes.ChallengeSexLostPrompt(true, options, disableSleep, minLossScene);
		if (!disableSleep) {
			options.push({ nameStr : "Sleep",
				func() {
					Text.Clear();
					Text.Add("<i>“Ah, could use to work out some of my kinks - if you know what I mean - but if you are tired, fair enough.”</i> Gwendy yawns, stretching. <i>“I guess I need some sleep as well, running this farm is tiring work.”</i>", parse);
					Text.NL();
					Text.Add("With that said, the farm girl undresses, putting on quite a show for you. There is a slight sheen of perspiration on her freckled skin, and she dries herself off with a towel before heading for her bed, stark naked. She sways her butt enticingly as she walks, showing off the horseshoe tattoo on her lower back.", parse);
					Text.NL();
					Text.Add("<i>“Sure you haven’t changed your mind?”</i> Gwendy asks sultrily, noticing your stare. You shake your head a bit, trying to clear it. Undressing, you join her in bed. You fall asleep to the calm beat of her heart, her skin warm against you.", parse);
					Text.Flush();

					Gui.NextPrompt(() => {
						WORLD().loc.Farm.Loft.SleepFunc();
					});
				}, enabled : true,
				tooltip : "Just sleep for now.",
			});
		}

		if (back) {
			Gui.SetButtonsFromList(options, true, back);
		} else {
			Gui.SetButtonsFromList(options);
		}
	}

	export function BarnPrompt() {
		// [Talk][Work]
		const options: IChoice[] = [];
		options.push(TalkEntry(BarnPrompt));
		options.push({ nameStr : "Work",
			func : GwendyScenes.Work, enabled : true,
			tooltip : "Be a little productive, and lend an able hand.",
		});
		Gui.SetButtonsFromList(options, true);
	}

	export function FieldsPrompt() {
		// [Talk][Work]
		const options: IChoice[] = [];
		options.push(TalkEntry(FieldsPrompt));
		options.push({ nameStr : "Work",
			func : GwendyScenes.Work, enabled : true,
			tooltip : "Be a little productive, and lend an able hand.",
		});
		Gui.SetButtonsFromList(options, true);
	}

	export function Talk(backfunc: CallableFunction) {
		const player: Player = GAME().player;
		const gwendy: Gwendy = GAME().gwendy;
		const parse: IParse = {
			playername : player.name,
		};

		const pc = player.Parser;

		// [Sure][Nah]
		const options: IChoice[] = [];
		options.push({ nameStr : "Chat",
			func() {
				Text.Clear();

				const world = WORLD();
				const scenes = new EncounterTable();
				scenes.AddEnc(() => {
					Text.Add("<i>“D’you know anything about those rabbit people that’ve been showing up lately?”</i> Gwendy asks you. <i>“They come in groups, usually at dusk or dawn when there isn’t anyone on watch. I’ve had to chase them off several times, but they still managed to steal a lot of goods.”</i> The farmer grimaces. <i>“Not to mention they ruin the crops with all their hopping about, the dumb things.”</i>", parse);
					Text.NL();
					if (GAME().burrows.flags.Access === BurrowsFlags.AccessFlags.Unknown) {
						Text.Add("You admit that you don’t know much about them, although you think you’ve seen some of them while traveling.", parse);
						Text.NL();
						Text.Add("<i>“Nasty critters,”</i> the girl mutters.", parse);
					} else {
						Text.Add("You tell Gwendy about the large colony of lagomorphs you have discovered.", parse);
						Text.NL();
						Text.Add("<i>“Really now? Do you think they might become a problem? I’ll fight the bastards off any time, but I can’t guard the farm day and night.”</i> The girl suddenly looks very tired. <i>“So much work to do, and these critters aren’t making my life any easier.”</i>", parse);
					}
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Out(`“I’ve heard worrisome things coming out of the hills lately,” Gwendy states. “Word is that bandit raids against the local villages have been increasing, and that they are coming well equipped.” She shakes her head, a frown on her face.

					“By the tone of some folks, they seem more an army rather than the riffraff down here on the plains that’s been pestering me. Whatever the case, they better stay off my land or they’ll see the sharp end of my pitchfork.”`);
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Out(`“Ever wonder about that huge tree off on the horizon? My Da always used to say that big old log was important. That it’s ancient, the last remaining of its kind, and so on,” Gwendy muses. “I’m no romantic poet or tree worshipping elf or anything, but something about it is… comforting, you know? It’s a constant in a world full of chaos and uncertainty. I wonder what it looks like up close.”`);
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Out(`“Sometimes I wonder what I’d do if I didn’t have the farm to take care of,” Gwendy muses. “This place has kinda been my everything as far back as I can remember.”

					“I suppose I’d head to the free cities up north and find some place to settle down there. The farther I can get from the kingdom, the better. Then again, they probably have their own fair share of corruption. Grass is always greener on the other side and all that.”

					She shakes her head. “Not that I would abandon my home for anything!”`);
				}, 1.0, () => true);
				scenes.AddEnc(() => {
					Text.Out(`“Horrible weather we’ve been having lately,” Gwendy muses, glaring daggers at the brightly shining sun.

					You admit that you don’t quite see her point.

					“Sun is all fine and dandy if all y’er worried about is a nice tan,” the farmer pokes at the dirt. “But these crops will need some good rain if I’m to have a decent harvest this fall.”`);
				}, 1.0, () => WorldTime().season === Season.Summer && gwendy.IsAtLocation(world.loc.Farm.Fields));

				scenes.Get();
				Text.Flush();

				GwendyScenes.Talk(backfunc);
			}, enabled : true,
			tooltip : "Talk about random things.",
		});

		const bailout: GwendyFlags.Bailout = gwendy.flags.Bailout;
		const winThreshold = gwendy.flags.ChallengeWinScene > GwendyFlags.ChallengeWinScene.Oral;
		const lossThreshold = gwendy.flags.ChallengeLostScene > GwendyFlags.ChallengeLostScene.Oral;
		if (bailout === GwendyFlags.Bailout.Init && (winThreshold || lossThreshold)) {
			options.push({ nameStr: `Challenges`,
				func() {
					Text.Clear();
					Text.Out(`“I’ve always been competitive,” Gwendy confesses. “Having some adversity pushes me to perform better. ‘Sides, it’s fun, isn’t it?”`);
					Text.NL();
					if (winThreshold && lossThreshold) {
						Text.Out(`You’ve both had your fair share of wins and losses. And sure, can’t argue that some of it has been more than fun. Still…`);
					} else if (winThreshold) {
						Text.Out(`You can’t argue that you haven’t been enjoying the perks of the job. Still…`);
					} else {
						Text.Out(`She sure seems to have an edge on you though; you are not sure that the game is fair…`);
					}
					Text.NL();
					Text.Out(`“I’m hoping the chance of something extra to look forward to gives you a little motivation.” She gives you a playful wink.`);
					Text.Flush();

					const opts: IChoice[] = [
						{
							nameStr: `Dominate`,
							func: BailoutDominate,
							enabled: winThreshold && player.SubDom() - gwendy.SubDom() >= 50,
							tooltip: `Stand up to her and tell her you’re not going to take any more of her shenanigans.`,
						},
						{
							nameStr: `Push her`,
							func: () => {
								ChallengePushHer(backfunc);
							}, enabled: lossThreshold && gwendy.SubDom() - player.SubDom() >= 20,
							tooltip: `The farmer is stirring some things in you that you want to explore further with her… you think giving up control to her completely could end up being pretty fun.`,
						},
					];
					Gui.SetButtonsFromList(opts, true, () => {
						Text.Clear();
						Text.Out(`“It’s only a bit of innocent fun to keep spirits up.” Gwendy flicks her braid. “The important thing is that the work gets done.”`);
						Text.Flush();
						GwendyScenes.Talk(backfunc);
					});
				}, enabled: true,
				tooltip: `So, about these challenges that she’s been proposing…`,
			});
		} else if (bailout === GwendyFlags.Bailout.Talked) {
			options.push({ nameStr : `Challenges`,
				func() {
					Text.Clear();
					Text.Out(`You broach the subject again about her stubborn refusal to resume the work challenges.

					“Fair is fair. You lost, you’re under my thumb. If you want to bail on that, fine, but I’m not gonna play the game anymore if you won’t stick by the rules.” She gives you a slow smile. “Of course, if you accept your punishment and let me pick up where we left off… I could be convinced to change my mind.”

					That’s codeword for you getting fucked; it looks like she’s not going to budge on this.`);
					Text.Flush();

					const opts: IChoice[] = [
						{
							nameStr: `Submit`,
							func: BailoutSubmit,
							enabled: true,
							tooltip: `Alright… she surprised you a bit before, but you think you could take it now. Hopefully.`,
						},
						{
							nameStr: `Refuse`,
							func: () => {
								Text.Clear();
								Text.Out(`Nope, still not going to do that.

								“Suit yourself… but I’m not gonna accept any more challenges until you suck it up and, you know, take it.” She throws you a wicked grin.`);
								Text.Flush();

								GwendyScenes.Talk(backfunc);
							},
							enabled: true,
							tooltip: `Nope, you’re still not going to accept her terms.`,
						},
						{
							nameStr: `Dominate`,
							func: BailoutDominate,
							enabled: player.SubDom() - gwendy.SubDom() >= 50,
							tooltip: `Stand up to her and tell her you’re not going to take any more of her shenanigans.`,
						},
					];
					Gui.SetButtonsFromList(opts);
				}, enabled : true,
				tooltip: `So… about that ultimatum she made earlier. You want to talk about that.`,
			});
		}

		if (gwendy.flags.Market === GwendyFlags.Market.NotAsked) {
			options.push({ nameStr : "Rigard",
				func() {
					Text.Clear();
					Text.Add("<i>“Looking to get inside Rigard are you? I don’t see why. That place is full of pompous jerks and bigots,”</i> she says, sighing. <i>“I don’t go near the place, myself, if I can avoid it. I do have to head there at times in order to sell my crops and produce, however. You could tag along when I head for the market, I guess.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Just make sure to catch me early, it usually takes most of the day before I finish. Of course, with your help it will hopefully be quicker.”</i>", parse);
					Text.Flush();
					gwendy.flags.Market = GwendyFlags.Market.Asked;

					GwendyScenes.Talk(backfunc);
				}, enabled : true,
				tooltip : "Ask her for a way to get into the city of Rigard.",
			});
		} else if (gwendy.flags.Market === GwendyFlags.Market.Asked) {
			options.push({ nameStr : "Market",
				func() {
					Text.Clear();
					if (WorldTime().hour >= 7) {
						Text.Add("<i>“[playername], can we talk about this tomorrow morning? I’m busy right now, and just not in the mood to talk about the city, okay?”</i>", parse);
						Text.Flush();

						GwendyScenes.Talk(backfunc);
						return;
					} else if (gwendy.Relation() < 30) {
						Text.Add("<i>“While I do have a pass to get within the gates, you wouldn’t believe what I had to go through just to get one. No offense, [playername], but I think we should get to know each other a little more before I’m willing to vouch for you. If you do something bad within the city limits, I’d be the one taking the fall.</i>", parse);
						Text.NL();
						Text.Add("You nod in understanding. That seems reasonable.", parse);
						Text.NL();
						Text.Add("<i>“Good, anything else you’d like to talk about? There is so much work to do, but I can spare some time to chat if you want,”</i> she smiles.", parse);
						Text.Flush();

						GwendyScenes.Talk(backfunc);
						return;
					}

					const humanity = player.Humanity();

					Text.Add("<i>“You’d like to help me? Great, but you should know this first: Rigard isn’t a particularly nice city, just warning you. There is a reason I usually do this alone and don’t bring Adrian along.”</i>", parse);
					Text.NL();
					if (humanity < 0.95) {
						Text.Add("<i>“That place is going to give you a hard time, [playername]. They’re not very fond of morphs, or anything that doesn’t look… well… human in general. Are you sure you want to go?”</i>", parse);
					} else {
						Text.Add("<i>“You being a ‘pure’ human helps, but I wouldn’t expect any kind of niceties from that lot. I think they might hate on you just for associating, given my reputation.”</i> She sighs. <i>“You still wanna go?”</i>", parse);
					}
					Text.Flush();

					// [Yes][No]
					const options: IChoice[] = [];
					options.push({ nameStr : "Yes",
						func : MarketScenes.GoToMarketFirst, enabled : true,
						tooltip : "Despite all adversities, you still want to go. Besides, if it‘s that bad, she probably needs some company, right?",
					});
					options.push({ nameStr : "No",
						func() {
							Text.Clear();
							Text.Add("Gwendy smiles as she hears your reply.", parse);
							Text.NL();
							Text.Add("<i>“Good choice! They’re a bunch of hypocrites, if you ask me. They hate on morphs, but sure don’t see to have a problem using their wool or drinking their milk when I go there to ship my produce,”</i> she comments angrily. <i>“Trust me, you’re doing yourself a favor by staying away from that place.”</i>", parse);
							Text.NL();
							Text.Add("<i>“Anyway, anything else you’d like to talk about?”</i>", parse);
							Text.Flush();

							GwendyScenes.Talk(backfunc);
						}, enabled : true,
						tooltip : "On second thought, you’ve changed your mind.",
					});
					Gui.SetButtonsFromList(options);
				}, enabled : true,
				tooltip : "Ask her if the two of you can make a trip to the market in Rigard.",
			});
		}
		options.push({ nameStr : "Danie",
			func : () => {
				Text.Clear();
				Text.Out(`“Danie’s quite the gal if you ask me, more to her than meets the eye.” Gwendy smiles to herself. “Most of the sheep folk tend to be rather nervous working in a place like this, but they mellow right up after spending five minutes around her. She acts like she doesn’t have anything but air in that little head of hers, but somehow she always knows just the right thing to keep your spirits up.”

				“That, and she’s just cute as a button.”`);
				Text.Flush();

				GwendyScenes.Talk(backfunc);
			}, enabled : true,
			tooltip : "Ask about the spunky sheepmorph living on the farm.",
		});
		options.push({ nameStr : "Adrian",
			func : () => {
				Text.Clear();
				Text.Out(`“Adrian’s been with me on and off for years. He’s always been the quiet type, not usually one to start up a conversation. Still, he’s dependable like no other, and never raises a complaint. When it comes to help around here, he’s the most consistent I have, a hard worker at that.”

				You have some ideas about why the silent equine hangs around Gwendy so much, but you hold your tongue.

				“He’s one of the few farmhands that lives here on the farm. Used to be there were plenty of people doing so back when, but with only the barn I just don’t have room any longer, nor do I have the money to afford it. Adrian’s gone without pay for me more than once through some rough stretches in recent years. I owe a lot to him.”`);
				Text.Flush();

				GwendyScenes.Talk(backfunc);
			}, enabled : true,
			tooltip : "Ask about the silent equine farmhand.",
		});
		const layla: Layla = GAME().layla;
		const lMet: LaylaFlags.Met = layla.flags.Met;
		const lKnowName = lMet >= LaylaFlags.Met.Farm;
		if (lMet !== LaylaFlags.Met.NotMet) {
			options.push({ nameStr : lKnowName ? "Layla" : "Scavenger",
				func : () => {
					Text.Clear();
					if (lMet >= LaylaFlags.Met.Party) {
						Text.Out(`The conversation shifts to Layla, the odd scavenger-turned-farmhand-turned-companion that you first met here on Gwendy’s farm.

						“How is she doing nowadays?” the farmer asks you. “Time she spent here and all, she feels a little like a part of the team you know?”

						You assure her that Layla is doing fine in your care.

						“Well, you toss the gal a howdy from me, alright? She’s welcome to come visit anytime she wants.” She smiles. “She can even have some apples, long as she asks first, alright?”`);
					} else if (lMet >= LaylaFlags.Met.Farm) {
						Text.Out(`The conversation shifts to Layla, the odd scavenger-turned-farmhand currently working for Gwendy.

						“She’s starting to pull her weight around here,” Gwendy muses. “Have to teach her most things, even the basic stuff, but if I tell her something, it sticks. Strong like a bull too, she gives Adrian a run for his money when it comes to back breaking labor.”

						The farmer sighs. “Can’t help but feel I’m holding her up here though. She’s already worked off whatever damage she caused way back when, and I’m not sure if she's the kinda gal to devote herself to an old dump like this.” She gives you an oblique smile.`);
					} else if (lMet >= LaylaFlags.Met.Won) {
						Text.Out(`Your chat shifts to the recent scavenger that you and Gwendy managed to capture, and who is now working off her debt to the farmer.

						“After spending some time around her, I can’t say that I’m angry with her anymore. For all her fire before, she seems genuinely sorry for what she did.” Gwendy, shakes her head. “Not the most skilled worker, but she appears to learn quick enough. Good thing too, since she left quite a bit of damage in her wake to repair.”`);
					} else { // Not captured
						Text.Out(`Your chat shifts to the recent scavenger that has been plaguing Gwendy’s farmstead.

						“Feisty creature, whoever she was,” Gwendy mutters. “I’ve a feeling I haven’t seen the last of her… and frankly she’s too much of a handful for me to capture on my lonesome if she does return.”

						The farmer scowls, looking quite frustrated by her lackluster ability to defend her home. “Can’t ask those bloodsuckers out of Rigard either, they’d ask an arm and a leg to even lift a finger… and that on top of all those taxes I pay! ‘Sides, my pride would never allow it.”`);
					}
					Text.Flush();

					GwendyScenes.Talk(backfunc);
				}, enabled : true,
				tooltip : lKnowName ? "Ask about Layla." : "Ask about the scavenger who was rifling through her shed.",
			});
		}
		if (gwendy.flags.Met < GwendyFlags.Met.TalkedSelf) {
			options.push({ nameStr : "Gwendy",
				func : () => {
					Text.Clear();
					Text.Out(`Gwendy rarely speaks of herself, having an almost zealous stubborn focus on her work and her farm, despite everything going against her. You find yourself wanting to know more about what drives her, and how she came to be where she is right now.

					“Little old me?” Gwendy cocks her head to the side and gives her braid a coquettish twirl. “Looking for the captivating story of how I became the queen of turnips? I’ll have to disappoint, I’m afraid. There’s not that much to tell.” The evasive way she turns her head away tells a different tale, but you hold your tongue, not wanting to interrupt her.

					“This place… it used to be a lot bigger way back when. You’ve probably noticed some of the overgrown mounds out in the fields; they mark the remains of the old farm, before it burned down. My parents owned and ran it, and it was a bustling and active community, almost a village on its own.” She throws you a sad smile. “As you can see, present management leaves a bit to be desired.”

					“It was a happy environment to grow up in, with plenty of friends and adventure awaiting ‘round every corner…” The girl trails off, faltering. “Then… the fire happened, and my parents passed away. In one fell stroke, my entire world was shattered. I… I’m not even sure how I got through those times… I threw myself into restoring the farm… stupid girl I was, thinking it’d be that simple, but for a few hangers on of my parents I probably wouldn’t have survived my first winter.”

					The mood has turned rather dour, with Gwendy looking outright depressed. Scrambling to cheer her up, you point out that she seems to have recovered admirably. The farm might not be a village, but the people here seem to enjoy being here, and it’s a cozy and welcoming place.

					“Thanks.” The farmer looks down at her hands. “We started from zero, with nothing but the land itself and a healthy helping of old debts. My father’s friends stayed on for a year or so, helping me build the barn up, but after that I decided I couldn’t impose on their charity any longer. Room enough for me, some animals and a few helpers… circumstances have never called for - or allowed - me to expand on it, but I’ve managed to hang on by a thread.”

					“It’s… been difficult. The taxman in Rigard takes his cut of my already meager winnings, and then there’s the debts which never seem to go away. I sometimes wonder if…” Gwendy trails off again, her eyes misting. She suddenly turns away. “I’m sorry, ${pc.name}, I want to be alone for a while.”

					You assure her that she has nothing to apologize for. For the time being, you should give her some space, but maybe you can cheer her up later; ask her about the more positive aspects of her youth, those memories she seems to cherish.`);
					Text.Flush();

					gwendy.relation.IncreaseStat(100, 3);

					gwendy.flags.Met = GwendyFlags.Met.TalkedSelf;

					TimeStep({hour: 1});

					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "Ask the farmer about herself.",
			});
		} else {
			options.push({ nameStr : "Childhood",
				func : () => TalkChildhood(backfunc), enabled : true,
				tooltip : "Ask Gwendy about her childhood and what the farm was like back when she grew up.",
			});
			options.push({ nameStr : "Her Parents",
				func : () => {
					if (gwendy.flags.Met < GwendyFlags.Met.TalkedParents) {
						Text.Clear();
						Text.Out(`“Mum and Dad… they were always fair with those that worked for them. They made sure to take care of everyone at the farm, seeing to their needs and settling disputes when they cropped up, never picking favorites.” Gwendy grins. “Except in my case; I was massively spoiled and pampered relentlessly.”

						“I don’t blame them for it, with me being their only kid and such… but due to it, it took me quite a while to grow up properly and not be a huge brat to everyone around me. Can’t rely on being cute forever, eh?” She flutters her eyelashes at you innocently.

						“Their names were Randall and Wylla, and they were the center of my world growing up. Despite my rebellious attempts to the contrary, I managed to learn more than a little from them about the running of the farm, and how to act toward others. Curiously enough, it was a case of ‘doing what I do, not what I say’, so to speak.”

						“Dad knew everything about cultivating the land, and was handy like no other. He built much of the original farm with his own hands, and he always seemed to know exactly what the right thing to do was. Mom had an affinity for tending to animals and people alike, and could befriend just about anybody in the span of half an hour.”

						Gwendy goes on to tell you a number of anecdotes about growing up with her parents, how they treated those around them and how hard they worked for the farm. She appears to hold both of them in the highest regard, but you take note of how she strays from their topic of their ultimate fate, focusing instead on her interactions with them during the happier days of her childhood.

						“They were good people who did good to those around them,” the farmer concludes. “All I can hope is to attempt to live up to their legacy.”`);
						Text.Flush();

						TimeStep({hour: 1});

						gwendy.flags.Met = GwendyFlags.Met.TalkedParents;

						Talk(backfunc);
					} else {
						TalkParents(backfunc);
					}
				}, enabled : true,
				tooltip : "Ask Gwendy about her parents.",
			});
		}
		/* TODO
		options.push({ nameStr : "Placeholder",
			func : () => {
				Text.Clear();
				Text.Out(``);
				Text.Flush();
			}, enabled : true,
			tooltip : "",
		});
		*/
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Out(`You tell her you have no more questions.`);
			Text.NL();

			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				Text.Out(`“Alright, don’t hesitate if you want to talk more. Seems lately that most people I interact with are either in my employ or trying to rip me off in some way.”`);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Out(`“Alright. I should get back to what I was doing.”`);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Out(`“That’s fine, I’m sure we can find something else to occupy our time with.” She gives you a naughty grin.`);
			}, 1.0, () => gwendy.Sexed());
			scenes.Get();
			Text.Flush();

			backfunc();
		});
	}

	export function TalkParents(backfunc: CallableFunction) {
		const gwendy: Gwendy = GAME().gwendy;

		Text.Clear();
		Text.Out(`You ask Gwendy to tell you more about her parents, Randall and Wylla, and about growing up with them on the farm.`);
		Text.NL();

		const scenes = [
			() => {
				Text.Out(`“Dad did his best to teach me his craft, though I was a horrible student most of the time. That being said, whenever I’d badger him with inane questions as I was wont to do, he’d always patiently answer, slowly nurturing a growing curiosity and proficiency.” She chuckles ruefully. “Where others would have gotten angry or frustrated, he stuck with me for the long haul, trusting I’d one day see the wisdom of his words. That’s the kind of man he was.”

				“Though he knew a great deal about most things around the farm, it was cultivating the fields that he excelled at, and which he truly enjoyed. I remember a guest of the house marveling at the abundant fields around the farm, professing that my father could grow an orchard in a barren desert. Dad chuckled and replied that he could do no such thing; what he was doing wasn’t forcing plants to grow where they were unsuited, rather he was merely listening to them and giving them a helping hand. The guest gaped, and exclaimed that if that was the case, he must be a damn good listener.”

				“Remembering the conversation, I later watched him work, and at least to me there seemed to be something beyond mere intuition to it. Intrigued, I asked him where he learned these things. He gave me a smile and said that an old friend of his taught it to him long ago, in a time when he was a much less patient man. At first, he said, he’d only asked about it as a distraction, and that those close to him scoffed his fancy. As time went by, he’d invest more and more of his time into his idle distraction, much to his own surprise. He said that looking back on those days, learning these skills was by far the most valuable thing he ever accomplished.”

				“That is, besides meeting my mother.” Gwendy smiles warmly, reminiscing fond memories.`);
			},
			() => {
				Text.Out(`“My mom was a kind woman. It wasn’t that she put others before herself; rather, she always took the opportunity when it presented itself to enrich others’ lives.” The farmer smiles quizzically. “I always used to think of her as grounded, wise beyond measure. I couldn’t even fathom her telling a lie to anyone, yet as the years have gone by since her passing… I’ve begun to realize that there were so many things about her that I didn’t understand, things that she struggled with.”

				“One memory in particular has stayed with me. My mother loved weaving, and she was proficient at it too. Never did anyone on the farm go cold during winter under her watch. Her work was almost always practical in nature: sweaters, mittens, cloaks and socks. Except that one time.” Gwendy closes her eyes, remembering the scene.

				“It was during high summer. I think I was about six years old. I had been searching for my mother throughout the house, and found her in her workshop on the upper floor. For reasons I can’t recall, once I heard her softly humming, I approached quietly.” The girl looks conflicted, both sadness and happiness vying for her expression. “The first thing I saw was the tapestry. It was a simple yet beautiful thing, a single white flower on a blue field. I was spellbound by it, and the calm sensations my mother’s soothing wordless hum. That was when I realized that she was softly crying to herself.” Gwendy looks down, hugging herself.

				“It distressed and confused me enough that I started crying too. Mother turned around in surprise, quickly wiping her tears as she hurried to scoop me up and comfort me. I took one last look at the lone white flower on the field of blue before mother led me out of the room, closing the door behind us. I never saw that tapestry again.” Gwendy sighs. “I still have no idea what it meant to her, even to this day. I know it sounds stupid now, but I was afraid of asking her about it; afraid to shatter my perfect image of her by laying bare whatever pain or loss she had endured. If I could talk to her one last time… well, there are so many things I would want to tell her and ask her. But the meaning of that tapestry would definitely be one of them.”`);
			},
			() => {
				Text.Out(`“My father was no nobleman won’t to lord it over others who were beneath him, yet his position at the farm did grant him some power, as adjudicator if nothing else. Those working for him or living in the villages nearby would come to him for advice on settling disputes, though it was never an authority he himself claimed. He’d take the disputing parties into his hall and seating them at his table, not as two subjects facing a ruler, but as three friends talking amongst themselves. He’d listen earnestly, ask both of them to explain their positions, and offer his blunt thoughts on the matter. Very seldom did I hear him raise his voice to anyone.” Gwendy smiles weakly. “I think that, much like myself, those that spoke with him came to fear his disappointment more than anything.”

				“There were two bitter rivals who came to him one winter eve when I was nine or so, and I happened to be in the hall as they spoke. The man owned a small farm with a bountiful orchard bordering it; the woman was a huntress who hunted game that grazed in said orchard. The man accused her of poaching on his land, the woman him of setting vicious traps for the wildlife that maimed and spoiled unnecessarily. The man claimed ownership of the area as it fell within the reaches of his farm; the woman claimed her family had been hunting in those woods for generations.”

				“Though either were reluctant to give an inch at first, my father eventually managed to glean that the man didn’t harm the wildlife on purpose; he didn’t want them eating from his orchard and it was lack of skill rather than malice that had led to the unfortunate situation. Furthermore, the woman hadn’t technically been poaching; she’d been tracking a deer that she’d wounded while hunting which had stolen into the orchard. Thinking the dispute done, my father bid them shake on it and be about their day, but the two glared daggers at each other and quickly raised two new aspirations on the other’s character. I watched their dance back and forth in fascination.”

				“They talked back and forth for hours, my father painstakingly dragging out every little twist and knot between them and laying it bare. They both seemed more and more sheepish as the pettiness of their feud revealed itself, and how my father failed to be impressed by it. I fell asleep through half of it, though evidently their talk proved fruitful. The next morning the two left together, eyeing each other guardedly but without open hostility. Somehow, my father had convinced them to work together, sharing the contested land between them and helping solving each others problems.”

				“Working together, they prospered to a degree that I think surprised even my father. Within a year, the two of them were married.”`);
			},
			() => {
				Text.Out(`“My mother had principles that at times got her into trouble. The farm, being placed on a major trading route to the outer territories of the kingdom, was a natural place for wayfarers and travelers to seek refuge. The eve that this particular story takes place, two such wanderers were housed here. The two were not people my father would have normally relished or welcomed on the farm; not only were they minor nobles, but also known to hate and conspire against each other. It was a disaster waiting to happen, but my mother argued to allow them on the farm, as a storm was raging outside.”

				“Dinner was tense to say the least. The two courtiers spend all night jabbing and arguing with each other. Their feud didn’t restrict itself to the two of them either, they were both quite at ease with taking their position here for granted and taking advantage of the maids and farmhands.” Gwendy purses her lips. “I didn’t like them very much. Much of what they said went over my head back then, but as the evening wound on, their arguments turned to their respective prowess with the ladies. It got so bad that one of them made advances on my mother, who icily rejected them. My father, jaw set tightly, ordered the evening concluded and hastily set me off to bed.”

				“Some time during the night, I was roused by a commotion. Rather than retire as told to, the two noblemen had continued drinking, until they eventually turned violent. The whole household was in an uproar; the lecherous noble from before had attempted something very bad involving my mother, while the other had ‘jumped to her rescue’ - no doubt with similar aspirations. Blood had been spilled. I found my mother with her arms stained red as she grimly tended to the two wounded fools. She did it despite their less than honorable intentions regarding her, and to my father’s vehement protests.”

				“Even then, the two hadn’t had enough, but my father furiously put any further hostilities to rest. Once the storm had died down and he was assured the two wouldn’t bleed to death on their own, he tossed out both of them from the farm, stating that if they wanted to tear each other to pieces, they could do so off his land.”

				She sighs.

				“As you can imagine, this didn’t exactly make any new friends, and it unfortunately wouldn’t be the last we saw of either of them.”`);
			},
			() => {
				Text.Out(`“As you might have guessed from my previous stories, I didn’t exactly make life easier for my parents. Their usual sense of fairness had a massive blind spot when it came to me, and while I was old enough to realize it, I was also young enough to not feel scrupulous about it. I took advantage of it numerous times to get things my way.” The farmer looks rather embarrassed. “Looking back on it, there’s no way that they didn’t realize, with how blatant I was about it. I eventually stopped once I grew older, but I never really apologized for it. I wish I had.”

				“Most children rebel against their parents in some fashion, something I took to an extreme degree. They were determined to raise me as a caring and capable woman who could take responsibility for her own actions; I was countered by being as wild and irresponsible as I possibly could. A miracle of the Spirits that it didn’t get me into more trouble than it did.”

				“In part, I think it was precisely because life on the farm was so good. Here, I was completely and utterly safe, and no one wished me ill. I was pampered to a degree that probably wasn’t good for me, and it was… stifling.” She shakes her head ruefully. “I probably sound stupid saying so, but I intentionally ran away from all of that, possibly seeking thrills, or maybe just some place where not everything would go my way. I threw myself against the world and delighted in the challenge.”

				“Life… is not a fair competitor though, as it turns out. Every misfortune was a learning experience, but more than once I found myself in situations where I’d bitten off far more than I could chew. My mother or father would always step in and rescue me… until they weren’t able to anymore.”

				Gwendy falls silent.

				“Can we talk about something else for a while?”`);
			},
		];

		let sceneId = gwendy.flags.RotParents;
		if (sceneId >= scenes.length) {
			sceneId = 0;
			gwendy.relation.IncreaseStat(20, 1);
		}

		gwendy.flags.RotParents = sceneId + 1;

		// Play scene
		scenes[sceneId]();

		Text.Flush();

		TimeStep({minute: 15});

		Talk(backfunc);
	}

	export function TalkChildhood(backfunc: CallableFunction) {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;

		const pc = player.Parser;

		Text.Clear();

		const scenes = [
			() => {
				Text.Out(`“Mm… it’s nostalgic to look back on. There were… five or six large buildings making up the main farm, and three barns for animals of various kinds. Besides that, there were a number of smaller cottages down the road. Da used to lend them to those who worked here short term.”

				“There were so many people passing through all the time: workers helping on the farm, traveling trades peddling their wares, the people on the nearby farms.” She trails off, staring into the distance as she relives old memories.

				“It was a wondrous place for a child to grow up in, with never a dull moment.” She throws you a rueful smile. “I probably gave my parents a few heart attacks, with all the trouble I got myself into.”

				“I’d always want to run after and pester people as they worked, but most of the time they humored me, probably because of Dad. Inadvertently, I managed to learn a bit or two about the work on the farm as well, even if that wasn’t exactly my intent.”

				“I remember one time in particular. I was six or so, running around the large plow working the fields while my father was leading the draft horse, the largest one on the farm. He was walking along, his mind wandering, when I suddenly vanished. He panickedly ran around, shouting my name, thinking I’d gone under. I’m not sure if seeing me grinning and waving like an idiot on the back of the massive horse made his day better or worse.”`);
			},
			() => {
				Text.Out(`“Despite the trove of fun to be had around the farm, it didn’t take me long to start trying to expand my horizons. If my parents were worried about the trouble I was getting myself into under their careful supervision, their hair started turning gray when I began embarking on expeditions into the outside world.” Gwendy flashes you a grin. “Don’t get me wrong, they weren’t negligent. Thing is, there’s always something important to do around a place like this to keep it running, and I was starting to get crafty… one moment of lapsing attention was all it took and I’d be off.”

				“First time I headed off wasn’t even on purpose. I was playing around one of the barns playing hide and seek with the other kids, and I found the best hiding spot ever: the back of a wagon packed full of goods.” She shakes her head, disparaging at her young self. “I’m sure you can imagine what happened next. The wagon started moving, heading down the road away from the farm. Of course I couldn’t just raise my voice and announce myself - I could see the other kids running around the yard and I’d be damned if I’d give myself away - and after we’d left the premises, I was way too preoccupied gawking at my unfamiliar surroundings to alert the driver.”

				Gwendy chuckles. “By the time I was caught out and the driver turned the wagon around, my father was raising hell at the farm, getting a search party together. I was grounded for a week, and I acted properly repentant… but I’d gotten my first taste of adventure, and I wasn’t about to forget about it anytime soon.”

				The farmer goes on to detail the various creative ways she employed to circumvent her parents’ rising vigilance, and how they eventually relented in letting her go along on trips to nearby villages and towns.

				“It was a few more years until I got to visit the big city, and for a while, it was even more enchanting than the wilderness I’d come to yearn for over the years…” Gwendy trails off, scowling. “As you might be able to tell, the passage of time has changed my mind.”

				As she doesn’t sound like she’s about to continue down that line of thought, your conversation turns to other matters.`);
			},
			() => {
				Text.Out(`“There came a time when I was trusted enough to go about the neighboring area of the farm unchaperoned. Well, that’s what I like to tell myself at least; more likely is that I took advantage of the confusion of the busy harvest season to roam wider than I previously had, which worried my parents to no end.” Gwendy shakes her head ruefully. “In hindsight, they were probably right to be worried.”

				“I was ten or so, gangly, skinny-kneed and bubbling with adventure lust and annoying questions. The farm hands were probably glad to have me out of their hair for a while. One day, I set to exploring a nearby forest I’d been warned about entering. It was there that I first met Waffles.”

				“He was in a sorry state - not much more than a scraggly and matted ball of gray fur, barely more than a pup, hungry and very frightened. At the time, I thought him a stray dog, perhaps abandoned by some passing trader - I’d seen plenty of caravans who kept guard dogs. I fed him some dried meat from my knapsack, which he greedily wolfed down. We hit it off after that, but he was still suspicious and refused my attempts to make him follow me out of the forest.”

				“In the weeks to follow, I returned to the forest almost daily, finding excuses to avoid my chores and smuggle away food to my growing doggy. He took to me quickly - I always had a way with animals, even back then - and though he happily roamed together with me, he appeared to be frightened of other people, and always shied away from approaching the farm.”

				“Don’t ask about the name, I was ten.” Gwendy grins as she stares off into the distance. “He was my secret friend outside the farm, someone only I knew about, and I relished in playing together with him. I brought him as much food as I could, and he was growing fast.”

				Her mood wilters. “I’m pretty sure that you can see where the story is heading. Half a year or so after I began taking care of Waffles, he was the size of a pony, and just about as unruly as I was. We were a good pair, but it wasn’t to last.” She sighs solemnly. “What food I was bringing wasn’t nearly enough to keep up with his growth, and I couldn’t keep pilfering from the farm stores for much longer; suspicion had been rising for a while.”

				“My dad had other troubles however; a predator of some sort had been ravaging the sheep, killing at least three of them in the last month or so. Finally one dark winter night, he managed to interrupt its feeding and drive it off for good, wounding it in the process.”

				“I was horrified when I found my Waffles soaked in blood and missing one eye, and heartbroken when he growled and ran away from me. For weeks, I tried looking for him, but never found anything more than tracks. In the end, that was the last I ever saw of him; I think he moved to other hunting grounds. I was furious at my dad for months, and he was even more furious at me when he finally dragged the full story out of me.”

				“And that, ${pc.name}, is the story of how I raised a pet wolf.”`);
			},
			() => {
				Text.Out(`“There were a bunch of other kids my age around the farm that I’d play with. Most of them were sons and daughters of the people who worked at the farm, while the rest were relatives of various friends of my parents who visited the farm frequently.” She smiles to herself. “I was the undisputed queen of the playground; even back then I had a competitive streak a mile wide. It made me a nuisance and a half to the adults, but it fit in perfectly with most of the other kids.”

				Gwendy blushes, looking a bit uncomfortable. “I say most… some of the younger kids were pretty shy and timid around me, and at times I could be a bit of a bully when it came to getting my way. Not something I’m particularly proud of, but it wasn’t something that I became aware of until later, when I saw others exhibiting the same type of behavior.”

				The farmer sighs. “In all honesty, I was quite the brat when I was a kid. I always wanted to have things my way, and I was never afraid of bothering the workmen with my endless stream of questions. The adults put up with it because of my parents; the kids were too overwhelmed to do anything other than go with my flow. I got into fights a few times with the older kids who wouldn’t take my bullshit, which in turn got them into trouble with my dad.”

				“It was only much later, when I began to frequent the big city where no one knew or cared who I was, that I met kids my own age who were as selfish as I was. For a while, I thought I’d found the coolest company ever, but some of the people I saw were… sobering, especially when I glimpsed some of my own behavior in them.” She doesn’t look like she’s going to elaborate further. “I did my best to temper myself after that revelation, and not be such a total ass to those around me. In the long turn, I think it salvaged more than a few friendships.”

				Gwendy goes on to tell you about some of the friends that she had around the farm, both girls and boys, humans and morphs alike. There seems to have been an abundance of the latter working at and passing through the farm.

				“Some of the attitudes of people in the city towards morphs shocked me even back then. I couldn’t make heads or tails of where adults could summon such unjustified cruelty from… but that’s a topic for another day.”`);
			},
		];

		let sceneId = gwendy.flags.RotChildhood;
		if (sceneId >= scenes.length) {
			sceneId = 0;
			gwendy.relation.IncreaseStat(20, 1);
		}

		gwendy.flags.RotChildhood = sceneId + 1;

		// Play scene
		scenes[sceneId]();

		Text.Flush();

		TimeStep({minute: 15});

		Talk(backfunc);
	}

	export function Work() {
		const party: Party = GAME().party;
		const gwendy: Gwendy = GAME().gwendy;
		Text.Clear();

		gwendy.relation.IncreaseStat(40, 1);

		const parse: IParse = {

		};

		const p1 = party.Get(1);
		if (p1) {
			parse.p1name = p1.name;
		}

		Text.Add("You tell her you'd like to help her out on the farm for a bit. She seems happy to hear it, and accepts your aid. <i>“Alright, let's put you to work then!”</i>", parse);
		if (party.Two()) {
			Text.Add(" You tell [p1name] to get help with work as well, as there's more than enough for you two to pitch a hand in.", parse);
		} else if (!party.Alone()) {
			Text.Add(" You tell the group to get to work as well, seeing as there's enough to do for everyone to pitch a hand in.", parse);
 		}

		// Random scenes
		const scenes = new EncounterTable();
		// MILKING
		scenes.AddEnc(GwendyScenes.WorkMilking, 1.0, () => true);
		// FEEDING
		scenes.AddEnc(GwendyScenes.WorkFeedingDanie, 1.0, () => true);
		// TODO
		/*
		scenes.AddEnc(() => {
			Text.Add("", parse);
			Text.NL();
		}, 1.0, () => true);
		*/
		/*
		scenes.AddEnc(() => {
			Text.Add("", parse);
			Text.NL();
		}, 1.0, () => true);
		*/
		scenes.Get();
		Text.Flush();
	}

	export function WorkFeedingDanie() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const gwendy: Gwendy = GAME().gwendy;
		const danie = GAME().danie;

		const parse: IParse = {
			playername : player.name,
		};

		Text.Add("She looks up into the sky while deciding what you should do on the farm, finally instructing you to go out to the fields and feed the animals.", parse);
		Text.NL();
		Text.Add("<i>“Shouldn’t be too hard, but there’s plenty to feed. Might want to work a little faster if you don’t want the rowdier ones trying to chase you down.”</i> She motions for you to follow her to where the feed is kept.", parse);
		Text.NL();

		if (gwendy.flags.WorkFeed === 0) {
			Text.Add("Arriving before a large shed with a padlock keeping intruders out, Gwendy pulls a key out of her back pocket and undoes the lock, revealing to you two bags containing oats and other grains.", parse);
			Text.NL();
			Text.Add("<i>“Fortunately, all we really need to feed the critters here are vegetables and such. Saves a lot of money on meats - for the most part, I make the food from some of the crops here and mix it with grains I buy.”</i>", parse);
			Text.NL();
			Text.Add("You mention the pigs and wonder if she just feeds them vegetables all the time. The girl shakes her head. <i>“If I did, they’d be in pretty poor health. So...”</i> Gwendy turns on her heels and shows you what looks to be buckets filled with slop. <i> “Give these to the pigs along with the feed. They should be alright. Well, I’ve got things to do, see you later!”</i>", parse);
		} else {
			Text.Add("After undoing the lock on the shed, Gwendy smiles slightly before going off to take care of her own work. You don’t really have the time to flirt with her since the assignment is rather time-consuming.", parse);
		}
		Text.NL();
		Text.Add("Fetching a wheelbarrow from the shed, you put what you think you’ll need into it when you suddenly see Danie skipping along, singing her song, oblivious to the world around her. You hold your breath, wondering if she’s going to trip... ", parse);
		if (Math.random() < 0.5) {
			Text.Add("but she spots you, changing her direction.", parse);
		} else {
			Text.Add("and sure enough, the lovable little goofball falls flat on her face. You hurry over and help her to her feet.", parse);
		}
		Text.NL();
		Text.Add("<i>“[playername], how are you? Are you going around the barn with food?”</i>", parse);
		Text.NL();
		Text.Add("You nod, before pushing the wheelbarrow forward and handing her an apple. <i>“Oh, can I come with you? I like spending time with you!”</i> You tell her yes, and the ovine girl joins your side as the two of you set off.", parse);
		Text.NL();
		Text.Add("In due time, you end up singing and humming simple melodies together with the sheep-girl while spreading happiness and food to the waiting, hungry denizens. You note that some of the animals and morphs look expectantly at you, and wonder if it's your voice, face, or the food that have caught their attention. Still, you carry on without complaint, trying to keep up with Danie.", parse);
		Text.NL();
		let scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("Moving through the stables, one of the stallions dips his head down, nuzzling the surprised sheep.", parse);
			Text.NL();
			Text.Add("<i>“E-eep! Hold on, horsie!”</i> she giggles, pulling a sack of grains from the wheelbarrow, pouring its contents into the trough in the horse’s pen. Given the option, the stallion stops munching on sheep and digs into his meal.", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("You head over to the sheep paddock, where Danie briefly leaves you to frolic with her kin. Well, now it looks like you have to feed all of them yourself. Eventually, she comes back to you, apologizing for dallying.", parse);
			TimeStep({minute: 20});
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("While feeding a group of rowdy bovine-morphs, Danie manages to trip, waving her arms wildly as she falls. The clumsy sheep-girl also somehow manages to upend the bag of feed on top of herself. Without missing a beat, the friendly cow-girls and boys continue their meal, eating it straight off the flustered sheep. Before you’ve reached her, they have finished all the food, licking the scraps from her pale skin. Danie is a bit unsteady on her feet as you help her up, fidgeting a bit before cleaning herself off.", parse);
			player.AddLustFraction(0.1);
		}, 1.0, () => true);

		scenes.Get();

		Text.NL();
		Text.Add("Like all good things, your time with the cute sheep-girl comes to an end, and she parts ways with you to return to her paddock. With her help, you’ve finished your task relatively quickly. Returning the borrowed equipment to the shed, you go to find Gwendy again. When you do, you see she’s still taking care of her own chores. Although you’d rather not leave without saying anything to her, you respect that she’s still busy and head out on your travels again.", parse);
		Text.NL();
		Text.Add("Spending time with Danie ", parse);

		// Boost stats
		scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("left you feeling a little more peppy, especially with all the singing. As you head off, you begin humming on the last tune, wondering if Danie will show up next time too.", parse);
			player.spirit.IncreaseStat(30, 1);
			return true;
		}, 1.0, () => player.spirit.base < 30);
		scenes.AddEnc(() => {
			Text.Add("has you singing more lately, which seems to attract a few more glances your way. Either for better or worse, your voice has added a bit more charm to your usual swagger.", parse);
			player.charisma.IncreaseStat(30, 1);
			return true;
		}, 1.0, () => player.charisma.base < 30);
		if (scenes.Get() === undefined) {
			Text.Add("is always pleasant, even though she is a bit of a klutz at times.", parse);
		}

		gwendy.flags.WorkFeed++;
		danie.relation.IncreaseStat(50, 5);

		if (party.Two()) {
			parse.name   = party.Get(1).name;
			parse.himher = party.Get(1).himher();
			Text.Add(" [name] waits for you patiently at the entrance to the farm, smiling as you join [himher] and set off.", parse);
		} else if (!party.Alone()) {
			Text.Add(" Your companions are chatting among themselves while waiting for you at the entrance to the farm, smiling as you join them and set off.", parse);
 		}

		Text.Flush();

		TimeStep({hour: 4});

		Gui.NextPrompt();
	}

	export function WorkMilking() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const gwendy: Gwendy = GAME().gwendy;

		const pc = player.Parser;

		const parse: IParse = {
			playername : player.name,
		};

		Text.Add("She looks up into the sky while deciding what you should do on the farm and instructs you to follow her into the barn. <i>“I'm milking the cows today and could use some help, if you don't mind.”</i> You wouldn't mind spending some more time with the lovely farmer, so you agree to help her. <i>“Great, let's go!”</i>", parse);
		Text.NL();
		Text.Add("Upon entering the section where the cows are kept, you see the bovine creatures look up expectantly as you and Gwendy head down the aisle to where the milk pails are stored, neatly stacked one atop another. Gwendy lets out a small sigh as she hands you two buckets before taking two herself. <i>“I hope you're not expecting to do too much today because we have to drain all of these cows and the cowgirls here, and then the goats, and a few sheep. And we only have so many buckets, so we've got to store the milk as we go.”</i>", parse);
		Text.NL();
		Text.Add("It's sounding like hard work so far, and to top it all off, it seems this is to be done by hand, no less. You might be cramping before the day's done. Still, the two of you get to it, starting with the cows and cow-like girls.", parse);
		Text.NL();

		const allowChallenge = gwendy.flags.Bailout === GwendyFlags.Bailout.Init || gwendy.flags.Bailout >= GwendyFlags.Bailout.Resolved;

		if (gwendy.flags.WorkMilked === 0) {
			Text.Add("Gwendy tells you to join her for a quick lesson, since it seems it's your first time milking. <i>“Just so you don't do anything reckless, it'd be best to show you instead of telling you how to milk a cow.”</i> Before she starts teaching you, she has you fetch a bucket of soapy and clean water, and prepares a cloth and some type of lubricant. She explains that these are the basic tools of the trade, while you quietly wonder what they're for.", parse);
			Text.NL();
			Text.Add("With a sly chuckle, she takes the pail from you and sets it down. <i>“It may seem odd, but when this is all said and done, you'll be thanking me.”</i>  She gives you a brief tutorial on what to do, going over ways to get milk the fastest and how to make sure the attendee won't get upset. It's a bit complicated, but you get the gist of it, and ask questions whenever confused. She even lets you milk the cow in the stable to make sure you understood what she said.", parse);
			Text.NL();
			Text.Add("<i>“And that's all there is to it! Do all of that, and you should be good to go!”</i> Gwendy announces as she removes the half-filled bucket from under the cow. <i>“Mind, if you want to be bold and skip a step or two, you might wind up with a knot. Cows don't like it when you pull the wrong way... just like I'm sure you wouldn't either.”</i>", parse);
			Text.NL();
			Text.Add("That last part is said with heavy sexual overtones, followed by a lascivious chuckle. <i>“I wouldn't worry about anything like that for now, though. Just stick to what I said, and you'll be a-okay.”</i> With that, she hands you back your supplies and heads off to milk the other denizens, even if the way to do it brings quite a few suggestive thoughts to your mind.", parse);
			if (allowChallenge) {
				Text.NL();
				Text.Add("Just as you enter another stable, Gwendy calls out your name, though she wears a mischievous expression. <i>“Say, [playername], do you feel up to a little challenge to spice things up? Why don't we see who can get the most milk the fastest, hm? Winner gets a nice li'l treat from the loser, of course! What do you say?”</i>", parse);
			}
		} else if (gwendy.flags.WorkMilked < 10) {
			Text.Add("No matter how many times you do it, you still find the prospect of milking teats a bit iffy. Still, it is a task that needs doing, and you square your shoulders in preparation.", parse);
			if (allowChallenge) {
				Text.NL();
				Text.Add("Before the two of you part to work in your separate areas, Gwendy taps your shoulder. Turning, you're met with a cat-like grin and playful look that tells you she's up to no good. <i>“I've seen your work, and I gotta say it's rather impressive for someone who's still wet behind the ears. So, why don't we make a little bet? Whoever can gather the most buckets of milk the fastest gets a treat from the loser, rightly speaking. Do you think you can handle it?”</i>", parse);
			}
		} else {
			Text.Add("By now, you are a practiced hand at this, due to your many hours working with Gwendy. You are no longer particularly bothered by the notion, either, even finding yourself looking forward to relieving some poor cowgirl of her stress.", parse);
			if (allowChallenge) {
				Text.NL();
				Text.Add("Before the two of you part to work in your separate areas, your eyes meet Gwendy's. <i>“So, what do you say we add a bit of excitement to work? Fastest milker gets a treat from the loser, up for it?”</i> The farmer cracks her knuckles. <i>“And don't think I'll go easy on you - I've seen you work, and you've gotten pretty good!”</i>", parse);
			}
		}

		if (gwendy.flags.Bailout === GwendyFlags.Bailout.Dominate) {
			Text.NL();
			Text.Out(`Really, she's going to try pulling this one again? The farmgirl blushes under your scrutiny... you have a feeling that she might actually <i>want</i> to lose this one. Still... should you humor her?`);
		} else if (gwendy.flags.Bailout === GwendyFlags.Bailout.Submit) {
			Text.NL();
			Text.Out(`A shiver runs down your spine by the way she's looking at you... you have a feeling that she's not going to be pulling her punches on this one. Knowing you are probably going to lose... will you humor her?`);
		}

		let challenge = true;
		let lose = false;

		Gui.Callstack.push(() => {
			Text.NL();

			// Random milking scene
			let scenes = new EncounterTable();
			scenes.AddEnc(() => {
				Text.Add("You get ready to work, placing your tools beside a cow in one of the pens. The animal moos appreciatively as you ease her heavy burden.", parse);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("Your first customer of the day is a busty cowgirl, her breasts heavy with milk. She blushes brightly as you get into position, grabbing hold of her puffy nipples.", parse);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("You hear a moan from a nearby pen as you prepare your tools. Curiosity kindled, you head over and peek inside, blushing slightly at the scene before you. One of the cowgirls seems to have gotten started early, milk dripping from her immense knockers. She has her back propped up against the back of the stall, one hand massaging her freely lactating breasts and the other busy between her spread legs.", parse);
				Text.NL();
				Text.Add("At your arrival, she moans pleadingly, shuddering as you pull on her teats, letting the milk flow into one of your buckets.", parse);
				Text.NL();
				Text.Add("<i>“Hey! No playing around with the livestock, you have work to do!”</i> Gwendy shouts to you, already getting started on her second customer. You regretfully finish your task, leaving the girl to take care of her desires herself as you move on to the next one in line.", parse);
			}, 1.0, () => true);
			scenes.Get();
			Text.NL();

			// Skill check
			let skillcheck = (player.dexterity.Get() + player.intelligence.Get() + player.libido.Get()) / 3;
			skillcheck += Math.random() * 10 - 5;
			skillcheck -= Math.min(gwendy.flags.WorkMilked, 10);

			if (gwendy.flags.Bailout === GwendyFlags.Bailout.Dominate) {
				skillcheck += 25;
			} else if (gwendy.flags.Bailout === GwendyFlags.Bailout.Submit) {
				skillcheck -= 25;
			}

			if (skillcheck < 20) {
				Text.Add("Despite following Gwendy's instructions, you struggle to make anywhere near as much progress as you'd like. Still, you press on without complaint, though you see Gwendy moving at a slightly faster pace than you. You wonder if she's just trying to match you for now until you hear an annoyed groan, which immediately brings you back to work. Milking is hard!", parse);
			} else if (skillcheck < 40) {
				Text.Add("Given you rather quick reflexes and reactions, you manage to fill a good amount of buckets, even surpassing Gwendy from time to time. Still, it's hard and you make mistakes too often, letting Gwendy get ahead of you while you correct them.", parse);
			} else if (skillcheck < 60) {
				Text.Add("While the work is hard, you carry on with deft skill, sometimes leaving Gwendy a bucket or two behind. However, it seems your attendees aren't the best you've had, as they often kick your precious cargo down. Oh well, you've the speed to make up for it, at least.", parse);
			} else { // +60
				Text.Add("With your skill, it takes little to no time at all to fill your buckets, making Gwendy's efforts look meager. Time and again, you spot her looking at you as you pass by her to grab more buckets. Even when a stray kick threatens to spill one of your buckets, you quickly react, managing to save the milk. Sometimes, you even lend Gwendy a hand, just to keep her up to speed.", parse);
			}
			Text.NL();

			// Calculate time it takes to finish
			let numHours = Math.round(5 - skillcheck / 20);
			if (numHours > 4) { numHours = 4; }
			if (numHours < 1) { numHours = 1; }
			parse.numhr = Text.NumToText(numHours);
			parse.s = numHours > 1 ? "s" : "";

			Text.Add("It takes about [numhr] hour[s], but the two of you manage to milk those in need. Your hands feel a little raw, but it's nothing that'll stop you from performing your everyday tasks.", parse);
			Text.NL();
			Text.Add("On the up side, ", parse);

			// Boost stats
			scenes = new EncounterTable();
			scenes.AddEnc(() => {
				Text.Add("you could swear your hands work and move more deftly than before, which is always an improvement.", parse);
				player.dexterity.IncreaseStat(30, 1);
				return true;
			}, 1.0, () => player.dexterity.base < 30);
			scenes.AddEnc(() => {
				Text.Add("your time with milking the cow populace has left you slightly more educated about how to handle these situations, which could prove useful down the road.", parse);
				player.intelligence.IncreaseStat(30, 1);
				return true;
			}, 1.0, () => player.intelligence.base < 30);
			scenes.AddEnc(() => {
				Text.Add("you smile a little as you think back to kneading the teats of a particularly well-endowed cowgirl, and the numerous other breasts you fondled while working. Maybe this isn't so bad.", parse);
				player.libido.IncreaseStat(30, 1);
				return true;
			}, 1.0, () => player.libido.base < 30);
			if (scenes.Get() === undefined) {
				Text.Add("you had a good time, and the farmer really appreciated your help.", parse);
			}

			Text.NL();
			Text.Add("Gwendy stretches as she lets out a small yawn. <i>“Well, I don't know about you but I still have a farm to handle. Thanks for the help, [playername], you saved me quite some time. So, help yourself to a bottle of milk, if you'd like.”</i> You thank her, admitting you were a little parched. <i>“It's fine, I have gallons of the stuff.”</i>", parse);
			Text.NL();

			// TODO: Gain milk item
			scenes = new EncounterTable();
			scenes.AddEnc(() => {
				Text.Add("She hands you a bottle of milk.", parse);
				party.inventory.AddItem(IngredientItems.CowMilk);
			}, 8.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("She hands you a bottle of goat milk.", parse);
				party.inventory.AddItem(IngredientItems.GoatMilk);
			}, 8.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("She hands you a bottle of sheep milk.", parse);
				party.inventory.AddItem(IngredientItems.SheepMilk);
			}, 8.0, () => true);
			scenes.AddEnc(() => {
				Text.Add("She hands you a bottle of Bovia.", parse);
				party.inventory.AddItem(AlchemyItems.Bovia);
			}, 1.0, () => true);
			/* TODO: other items
			scenes.AddEnc(() => {
				Text.Add("", parse);
				Text.NL();
			}, 1.0, () => true);
			*/
			scenes.Get();
			Text.NL();

			gwendy.relation.IncreaseStat(40, 3);
			TimeStep({hour: numHours});
			gwendy.flags.WorkMilked++;

			if (challenge) {
				GwendyScenes.ChallengeSex(skillcheck, lose);
			} else {
				Text.Add("With that, the two of you part, her heading to the barnyard, and you going your own way.", parse);
				if (party.Two()) {
					parse.himher = party.Get(1).himher();
					Text.Add(" Your companion waits for you patiently at the entrance to the farm, and smiles as you join [himher] and set off.", parse);
				} else if (!party.Alone()) {
					Text.Add(" Your companions are chatting among themselves while waiting for you at the entrance to the farm, smiling as you join them and set off.", parse);
 				}
				Text.Flush();
				Gui.NextPrompt();
			}
		});

		if (allowChallenge) {
			Text.Flush();
			// [Yeah!][No][Lose]
			const options: IChoice[] = [
				{ nameStr : "Yeah!",
					func() {
						Text.Clear();
						Text.Add("You tell Gwendy you wouldn't mind taking her on, especially considering what winning seems to entail. <i>“I figured you'd say something like that, but don't think I'm gonna go easy on you, either.”</i> The two of you stare at one another for a moment, adopting challenging smiles on your faces before dashing off to try and best one another!", parse);
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Sounds like fun!",
				},
				{ nameStr : "No",
					func() {
						challenge = false;
						Text.Clear();
						Text.Add("You decline, saying with the workload before the two of you, a challenge should be the last thing on her mind. She sucks her teeth at that, but admits you have a point. <i>“Oh well, in any event, we probably will be more productive without the added stuff. Alright, I'll see you when we're finished then, okay?”</i> With a nod, you go back to what you were doing, though you notice that Gwendy has a slight pout on her face. While cute, she seems disappointed with you, but what's done is done. Now, time to get to work!", parse);
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Isn't there too much work to do to be playing around?",
				},
				{ nameStr : "Lose",
					func() {
						lose = true;
						Text.Clear();
						Text.Add("You accept her challenge, but in the back of your mind you decide to just lose for the sake of it. Given her demeanor and allure, a part of you wants to see what the losing side is like!", parse);
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Who gives a damn, you'll be with Gwendy! Lose on purpose.",
				},
			];
			Gui.SetButtonsFromList(options);
		} else {
			challenge = false;
			Text.NL();
			Text.Out(`“I would offer a friendly challenge, but you know…” Gwendy flashes you a smirk, “I figure I'm already ahead on that count. You still owe me one, don't forget!” You grumble something in response. “Anyways, let's get to work, ${pc.name}.”`);
			Gui.PrintDefaultOptions();
		}
	}

	/* GWENDY SEX SCENES */

	export function ChallengeSex(skillcheck: number, lose: boolean) {
		const gwendy: Gwendy = GAME().gwendy;

		// TODO: Proper loss condition
		if (lose || skillcheck < 20) {
			gwendy.flags.LostChallenge++;

			if (gwendy.flags.Bailout === GwendyFlags.Bailout.Dominate) {
				Text.Out(`“My... what a surprise, I win again. Are you even trying anymore?” Gwendy grins at you.`);
			} else if (gwendy.flags.Bailout === GwendyFlags.Bailout.Submit) {
				Text.Out(`“My, my... seems I still got it!” Gwendy almost looks a little surprised at having won.`);
			} else {
				Text.Out(`“Seems like I'm the winner!” Gwendy concludes as she counts the tally, eager to get to the action.`);
			}
			Text.NL();

			if (gwendy.flags.LostChallenge < 3) {
				Text.Out(`She won this time... meaning you've got to pay up to her in whatever way she demands. Your thoughts are confirmed when she looks at you with a sly smile.`);
			} else if (gwendy.flags.LostChallenge < 6) {
				Text.Out(`Despite your efforts, it seems like you can't beat the girl in her domain. A part of you wonders why you continue with these challenges if the result is always you losing and letting her degrade you. Still, you've got to try to best her somehow... after she reaps her reward from you, at least.`);
 			} else {
				Text.Out(`Face it, when she puts her mind to it, you can't win. At this point, you have to wonder if you actually accept your defeat and are just taking the challenges to get off. Who knows, maybe it's not so bad losing to the sexy girl? In any event, she gets to have her way with you again.`);
 			}
			Text.Flush();
			Gui.NextPrompt(() => {
				const options: IChoice[] = [];
				const ret = GwendyScenes.ChallengeSexLostPrompt(false, options, false);
				if (ret) {
					Gui.SetButtonsFromList(options);
				}
			});
		} else {
			gwendy.flags.WonChallenge++;

			if (gwendy.flags.Bailout === GwendyFlags.Bailout.Dominate) {
				Text.Out(`“Mmm... seems you've won. What will you do to me this time, I wonder?” From her tone, Gwendy doesn't seem to mind the idea of being your plaything.`);
			} else if (gwendy.flags.Bailout === GwendyFlags.Bailout.Submit) {
				Text.Out(`“Hmm, you've been holding back on me, haven't you?” Gwendy looks like she didn't expect things to turn out this way. “Still, fair is fair... and you've earned your win. This time.”`);
			} else {
				Text.Out(`Counting the tally, it seems you came out the victor this time!`);
			}
			Text.NL();

			if (gwendy.flags.WonChallenge < 3) {
				Text.Out(`It looks like you've bested the farm girl, and she pouts a bit. Still, a bet was a bet, and she's going to have to pay up!`);
			} else if (gwendy.flags.WonChallenge < 6) {
				Text.Out(`Seems like she's still going to challenge you, even though you've bested her so far! Her defiance has definitely increased her efforts whenever you challenge her, but the end result is the same: her waiting on your whim.`);
 			} else {
				Text.Out(`At this point, it's hard to call it a challenge. Despite that, Gwendy has definitely given it her all to best you, it's just that her best isn't good enough. A shame, but it means you're going to have some fun...`);
 			}
			Text.Flush();
			const options: IChoice[] = [];
			GwendyScenes.ChallengeSexWonPrompt(false, options, false);
			Gui.SetButtonsFromList(options);
		}
	}

	export function ChallengeSexWonPrompt(hangout: boolean, options: IChoice[], disableSleep: boolean, minScene: GwendyFlags.ChallengeWinScene = GwendyFlags.ChallengeWinScene.Kiss) {
		const player: Player = GAME().player;
		const gwendy: Gwendy = GAME().gwendy;
		const parse: IParse = {
			playername : player.name,
		};

		let wins = gwendy.flags.ChallengeWinScene;
		if (hangout) { wins--; }

		options.push({ nameStr : "KissDom",
			func() {
				const first = wins === GwendyFlags.ChallengeWinScene.Kiss;

				Text.Clear();

				if (!first) {
					player.subDom.IncreaseStat(0, 1);
					gwendy.subDom.DecreaseStat(0, 1);
				}

				// If first time
				if (first && !hangout) {
					if (gwendy.flags.LostChallenge > 0) {
						Text.Add("Since Gwendy went easy on you when you lost the first time, you decide to start things off light.", parse);
					} else {
						Text.Add("Since this <i>was</i> the first time the two of you actually had the challenge, you decide to start things off light.", parse);
					}
					Text.NL();
					gwendy.subDom.DecreaseStat(-100, 5);
					player.subDom.IncreaseStat(100, 3);

					gwendy.flags.ChallengeWinScene = GwendyFlags.ChallengeWinScene.Hands;
				} else {
					Text.Add("You decide to let her off easy this time, and only ask for a kiss.", parse);
				}
				Text.NL();
				Text.Add("Grabbing Gwendy's arm, you pull her close, a surprised expression on her face as you hold her. For a good minute, you just take in her beauty, from the freckles on her cheeks to the lively blue in her eyes. You begin forming an idea or two on what to do next time, should you challenge her again and win.", parse);
				Text.NL();
				Text.Add("The farmer fidgets, a bit uncomfortable under your scrutiny. Well, you can't have that, so you get on with it. You kiss her, your lips flush with her soft ones. There's a slight gasp of shock at the sudden action, but it is soon succeeded by a more submissive moan as you press against her, your body leaning on her slightly.", parse);
				Text.NL();

				if (hangout) {
					Text.Add("You break the kiss before you get too hot and carried away, though you note the flush of arousal on her cheeks. With a taunting grin, you tell Gwendy that's all for now, teasing her a bit.", parse);
					Text.NL();
					Text.Add("<i>“Getting me all worked up like that over nothing?”</i> The farmer huffs, liking what she got but clearly expecting more.", parse);
				} else {
					Text.Add("You break the kiss before you get too hot and carried away, though you note the flush of arousal on her cheeks. With a taunting grin, you tell Gwendy that's all for now. However, the next time you challenge her, you won't let her off so easily. She winces slightly, but has a small smile on her face.", parse);
					Text.NL();
					if (gwendy.flags.LostChallenge > 0) {
						Text.Add("<i>“Don't think this one was anything but a fluke. I've beaten you before and I'll do it again!”</i> Even though her face is flushed, she is wearing a determined look. Next time might not be so easy.", parse);
					} else {
						Text.Add("<i>“That's fine, [playername],”</i> she retorts, <i>“since this time was just a fluke. Don't count on winning so easily next time!”</i> Good, you like it when the competition fights back. It makes winning just that much more fun.", parse);
					}
				}

				player.AddLustFraction(0.1);
				TimeStep({minute: 5});
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Kiss,
			tooltip : "Just a peck, please.",
		});
		if (wins >= GwendyFlags.ChallengeWinScene.Hands) {
			if (player.FirstCock()) {
				options.push({ nameStr : "Handjob",
					func() {
						GwendyScenes.ChallengeSexHands(true, hangout);
					}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Hands,
					tooltip : "Have her jerk you off.",
				});
			}
			if (player.FirstVag()) {
				options.push({ nameStr : "Frig",
					func() {
						GwendyScenes.ChallengeSexHands(false, hangout);
					}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Hands,
					tooltip : "Have her pleasure your cunt with her hands.",
				});
			}
		}
		if (wins >= GwendyFlags.ChallengeWinScene.Titfuck) {
			if (player.FirstCock()) {
				options.push({ nameStr : "Titfuck",
					func() {
						GwendyScenes.ChallengeSexBody(true, hangout, disableSleep);
					}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Titfuck,
					tooltip : "Those tits could be fun to play with.",
				});
			}
			options.push({ nameStr : "Tease",
				func() {
					GwendyScenes.ChallengeSexBody(false, hangout, disableSleep);
				}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Titfuck,
				tooltip : "Play a little with her body, teasing her.",
			});
		}
		if (wins >= GwendyFlags.ChallengeWinScene.Oral) {
			if (player.FirstCock()) {
				options.push({ nameStr : "Blowjob",
					func() {
						GwendyScenes.ChallengeSexOral(true, hangout);
					}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Oral,
					tooltip : "Put her mouth to work sucking dick.",
				});
			}
			if (player.FirstVag()) {
				options.push({ nameStr : "Cunnilingus",
					func() {
						GwendyScenes.ChallengeSexOral(false, hangout);
					}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Oral,
					tooltip : "Let her have a taste of your cunt.",
				});
			}
		}
		if (wins >= GwendyFlags.ChallengeWinScene.Fuck) {
			if (gwendy.FirstVag()) {
				if (player.FirstCock()) {
					options.push({ nameStr : "Fuck her",
						func() {
							GwendyScenes.ChallengeSexVag(true, hangout);
						}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Fuck,
						tooltip : "The girl is begging for it, oblige her and ravage her cunt.",
					});
				}
				if (player.FirstVag()) {
					options.push({ nameStr : "Tribbing",
						func() {
							GwendyScenes.ChallengeSexVag(false, hangout);
						}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Fuck,
						tooltip : "Have a little girly fun with the sexy farmer.",
					});
				}
			}
		}
		if (wins >= GwendyFlags.ChallengeWinScene.Anal) {
			if (player.FirstCock()) {
				options.push({ nameStr : "Anal",
					func() {
						GwendyScenes.ChallengeSexAnal(GwendyFlags.Toys.None, hangout);
					}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Anal,
					tooltip : "Plow her ass.",
				});
			}
			if (gwendy.flags.Toys === GwendyFlags.Toys.None) {
				options.push({ nameStr : "Toys",
					func() {
						GwendyScenes.ChallengeSexAnal(GwendyFlags.Toys.Strapon, hangout);
					}, enabled : minScene <= GwendyFlags.ChallengeWinScene.Anal,
					tooltip : "Browse through Gwendy’s collection to see if something catches your eyes.",
				});
			} else {
				options.push({ nameStr : "Strapon",
					func() {
						GwendyScenes.ChallengeSexAnal(GwendyFlags.Toys.Strapon, hangout);
					}, enabled : false && !player.FirstCock(), // TODO ACTIVATE SCENE
					tooltip : "Fuck her with one of her horsecock strap-ons.",
				});
				options.push({ nameStr : "R.Strapon",
					func() {
						GwendyScenes.ChallengeSexAnal(GwendyFlags.Toys.RStrapon, hangout);
					}, enabled : false, // TODO ACTIVATE SCENE
					tooltip : "Have her wear a strap-on and fuck you.",
				});
				options.push({ nameStr : "Beads",
					func() {
						GwendyScenes.ChallengeSexAnal(GwendyFlags.Toys.Beads, hangout);
					}, enabled : true,
					tooltip : "Wonder how many beads her ass can take?",
				});
				options.push({ nameStr : "D.Dildo",
					func() {
						GwendyScenes.ChallengeSexAnal(GwendyFlags.Toys.DDildo, hangout);
					}, enabled : player.AnalCap() >= ToysItems.EquineDildo.cock.Thickness(),
					tooltip : "Bring out Gwendy’s double-ended horsedildo for some double anal fun.",
				});
			}
		}
	}

	export function ChallengeSexHands(cock: boolean, hangout: boolean) {
		const player: Player = GAME().player;
		const gwendy: Gwendy = GAME().gwendy;
		let parse: IParse = {
			playername    : player.name,
		};
		parse = player.ParserTags(parse);
		parse = gwendy.ParserTags(parse, "g");

		parse.genDesc = player.FirstCock() ? () => player.MultiCockDesc() :
						player.FirstVag() ? () => player.FirstVag().Short() :
						"featureless crotch";
		Text.Clear();

		const first  = gwendy.flags.ChallengeWinScene === GwendyFlags.ChallengeWinScene.Hands;
		const second = !first && !hangout;

		if (!first) {
			player.subDom.IncreaseStat(25, 1);
			gwendy.subDom.DecreaseStat(-25, 1);
		}

		// If first time
		if (first) {
			Text.Add("Once again, you come out on top, and Gwendy looks rather annoyed at being beaten again. That won't do. She's the loser, so she has to follow your instruction. Smiling victoriously, you decide to go a bit farther this time.", parse);
			Text.NL();
			Text.Add("Pulling Gwendy by the arm, you lead her to her loft.", parse);
			if (player.Armor()) {
				Text.Add(" You remove your [armor], smiling excitedly, imagining what's to come.", parse);
			}

			gwendy.subDom.DecreaseStat(-100, 5);
			player.subDom.IncreaseStat(100, 3);

			gwendy.flags.ChallengeWinScene = GwendyFlags.ChallengeWinScene.Titfuck;
		} else if (second) {
			Text.Add("With another win under your belt, you lead Gwendy back to her loft. Once there, you instruct Gwendy to wait as you quickly strip down, eager to engage in another bout of fun.", parse);
		} else {
			Text.Add("Smiling teasingly, you ask her to wait while you strip. Once nude, you look lustfully at the beautiful girl waiting to fulfill your desires.", parse);
		}
		Text.NL();
		Text.Add("Pulling out a chair from the table, you sit down and wave her over. You tell her to get down on her knees, to get a better vantage point. The farmer looks a bit nervous, but follows your instructions, throwing furtive glances at your exposed [genDesc] while awaiting further orders.", parse);
		Text.NL();
		if (player.FirstCock() && player.FirstVag()) {
			Text.Add("As it stands, you possess both sets of sexes. Gwendy raises an eyebrow in question. <i>“You want me to pleasure <b>both</b> of them?”</i> You shake your head. Not this time.", parse);
			Text.NL();
		}

		if (cock) {
			parse.s     = player.NumCocks() > 1 ? "s" : "";
			parse.oneof = player.NumCocks() > 1 ? " one of" : "";
			Text.Add("Smirking, you thrust your groin toward her face. Gwendy stares at it for a moment, looking from your [cocks] to your eyes, then back at the rousing member[s]. Noticing the indecision on her face, you instruct Gwendy to pleasure you using just her hands.", parse);
			if (first) {
				Text.Add(" She makes a small note of discomfort, but sets on fulfilling your desires.", parse);
			} else {
				Text.Add(" She nods, but you detect the faintest hint of disappointment. Perhaps she was looking forward to something else?", parse);
			}
			Text.NL();
			Text.Add("Wrapping her fingers around[oneof] your [cocks], Gwendy starts to jerk it with languid strokes. Her soft hands run from the top to the bottom of your length a few times, coaxing your [cock] to full mast. A tingle of pleasure runs through you every time her digits flit across your glans, a drop of pre forming on the [cockTip] in response to her gentle touch.", parse);
			if (first) {
				Text.Add(" Feeling the sticky fluid being rubbed into her fingers and down your [cock], she grimaces slightly, speeding up to get this over with.", parse);
			} else {
				Text.Add(" Feeling the sticky fluid being rubbed into her fingers and down your [cock], she grins, increasing her speed while watching your face closely.", parse);
			}
			Text.NL();
			Text.Add("The sensation of her fingers gliding smoothly along your length is overwhelming, and you buck in pleasure. You begin to lose yourself to the feeling each time she strokes the glans of your [cock], trying to hold yourself back from release, but ", parse);
			if (player.HasBalls()) {
				Text.Add("your [balls] have something different in mind. They draw tight, the cum practically churning as if they are about to burst.", parse);
			} else {
				Text.Add("there is a familiar surge rising in your groin, despite your best efforts.", parse);
			}
			Text.NL();
			Text.Add("Unable to take anymore, you cum hard, shooting your seed into the air and onto her face and her barely covered [gbreasts]. She gasps sharply, but she keeps her hands working until they've milked every ounce of your spunk, the sticky liquid running down her fingers.", parse);
			Text.NL();
			if (player.FirstVag()) {
				Text.Add("Your [vag] joins in on the fun, leaking of girly juices as you ride your climax out. It's times like these that you enjoy being a fully functioning member of both genders.", parse);
				Text.NL();
			}
			Text.Add("When you've calmed down somewhat, you look down, admiring your work.", parse);
			if (first) {
				Text.Add(" She doesn't look too bad, on her knees before your crotch, covered with your seed. You might have to think of a few more ideas, but for now you've reaped your reward, and you have other things to do as well.", parse);
			} else {
				Text.Add(" Seeing her covered in your seed is always an rousing sight, but for now you have sated your lust.", parse);
			}
			Text.Add(" Getting up, you kiss Gwendy on a clean spot on her forehead, telling her she did well and you look forward to more next time.", parse);
			Text.NL();
			if (hangout) {
				Text.Add("With an appreciative moan, Gwendy licks her fingers clean. The entire time she gazes into your eyes intently, looking forward to more. Shaking your head, you tease the lovely farm girl that this will be all, for now. She pouts sulkily, her sultry look replaced with mock anger.", parse);
				Text.NL();
				Text.Add("<i>“I dunno how I feel about that... but I guess I'll let it slide for now.”</i>", parse);
			} else {
				Text.Add("Much to your surprise, Gwendy faces you with a sultry smile and begins to lick her digits clean, making sure to draw her tongue around her lips and fingers in as seductive a way as possible. It looks like she still has a bit of fire left, but that's how you like it. Doing this without a fight would make it too easy to properly enjoy, though you keep that to yourself as you head off.", parse);
			}
		} else {
			parse.l = player.HasLegs() ? "Spreading your legs wide" : "Nudging your hips forward";
			Text.Add("Smiling, you reveal your [vag], as you're rather curious to see just how quick she is with her fingers. [l], you tell her to get you off using her digits.", parse);
			if (player.FirstCock()) {
				parse.b = player.HasBalls() ? Text.Parse(" and your [balls]", parse) : "";
				Text.Add(" You pull your [cocks][b] aside, revealing your eager slit.", parse);
			}
			if (!hangout) {
				Text.Add(" She doesn't look too happy about that, but doesn't complain.", parse);
			}
			Text.NL();
			Text.Add("Pressing against your folds, she experimentally pushes a finger into you, eliciting a soft moan. Hearing this, she works it inside you, either intent on pleasing you, or perhaps to end this as fast as possible. You coo in pleasure as moisture begins to drip from your lips.", parse);
			Text.NL();

			let num = Math.floor(player.FirstVag().Tightness() * 1.5);
			if (num < 2) { num = 2; }
			if (num > 5) { num = 5; }
			parse.fingernum = Text.Quantify(num);

			Text.Add("The pace is slow, but vastly enjoyable as Gwendy gets [fingernum] fingers into you, teasing and rubbing against your [clit] in the process. You find yourself grinding against her the entire time, almost threatening to take her knuckle-deep while you get wetter and wetter. Whenever she brushes or flicks your [clit], you arch your back and moan like a slut, which gets a smile from her every now and then.", parse);
			Text.NL();
			Text.Add("After several minutes of her expert touch, you reach your peak, and without any warning for the girl, you cum, splattering your girly juices all over her hand and arm.", parse);
			if (player.FirstCock()) {
				parse.itsTheir = player.NumCocks() > 1 ? "their" : "its";
				Text.Add(" At the same time, your [cocks] joins in the fun, splashing [itsTheir] share of fluids into the air and onto her upturned face.", parse);
			}
			Text.NL();

			const cum = player.OrgasmCum();
			player.AddSexExp(1);
			gwendy.AddSexExp(1);

			Text.Add("As your vaginal muscles clamp and squeeze, you feel Gwendy's fingers thrusting into you as you orgasm. The girl is very skilled for one who supposedly spent so much time alone... or perhaps that <i>is</i> the reason she is so skilled. The idle speculation flits through your mind quickly, as you are unable to focus your thoughts for long.", parse);
			Text.NL();
			if (!hangout) {
				Text.Add("When you recover, it seems like Gwendy's shirt has become saturated with your fluids. It looks good on her, like she has a nice coat of body oil on right now. In any event, there are other things you need to see to.", parse);
				Text.NL();
				Text.Add("After getting dressed, you kiss Gwendy on her forehead before heading off, but not without hinting about what you want to do the next time you beat her. She looks a bit defiant, but perhaps not as much as you expected.", parse);
			} else {
				Text.Add("As you slowly recover, Gwendy is glistening with your fluids.", parse);
				Text.NL();
				Text.Add("<i>“Look what you've gone and done now, [playername]. Are you always so messy when you fool around?”</i> You taunt her, saying it's her fault for getting you off like this. <i>“Well, we can go back and forth with this, y'know. Bottom line is, we both had some fun. Let's just leave it at that, alright?”</i>", parse);
				Text.NL();
				Text.Add("Nodding, you get up and dress before heading on your way.", parse);
			}
		}

		Text.Flush();

		TimeStep({minute: 20});
		player.AddLustFraction(-1);

		Gui.NextPrompt();
	}

	export function ChallengeSexBody(titjob: boolean, hangout: boolean, disableSleep: boolean) {
		const player: Player = GAME().player;
		const gwendy: Gwendy = GAME().gwendy;

		let parse: IParse = {
			playername     : player.name,
		};
		parse = player.ParserTags(parse);
		parse = gwendy.ParserTags(parse, "g");

		parse.genDesc = player.FirstCock() ? () => player.MultiCockDesc() :
						player.FirstVag() ? () => player.FirstVag().Short() :
						"featureless crotch";
		Text.Clear();

		let lossScene = gwendy.flags.ChallengeLostScene;
		let wonScene  = gwendy.flags.ChallengeWinScene;
		if (hangout) { lossScene--; }
		if (hangout) { wonScene--; }

		const first  = wonScene === GwendyFlags.ChallengeWinScene.Titfuck;
		const second = !first && !hangout;

		if (!first) {
			player.subDom.IncreaseStat(30, 1);
			gwendy.subDom.DecreaseStat(-30, 1);
		}

		// If first time
		if (first) {
			Text.Add("Yet again, it seems you've won the challenge, as clearly evidenced by the look of shock and dismay on Gwendy's face. It seems you're too much for her, yet she still insists on doing things this way. Whatever. If you can get a free fuck after work, then you don't mind taking her on if she wants.", parse);
			Text.NL();
			Text.Add("Still, you think it's a bit too early to get into the better parts of sex just yet as Gwendy still looks a bit hesitant. Given that this is a mutually agreed contest, you decide it'd be better to go slowly and work your way up. That being said, you have some plans.", parse);
			Text.NL();
			Text.Add("Once in the room, you pull a chair from the table, sitting in it after undressing. With a smile, you call Gwendy over, instructing her to kneel in front of you.", parse);

			gwendy.subDom.DecreaseStat(-100, 5);
			player.subDom.IncreaseStat(100, 3);

			gwendy.flags.ChallengeWinScene = GwendyFlags.ChallengeWinScene.Oral;
		} else if (second) {
			Text.Add("Once more, you lead her to her room for some privacy after your win. You grab a chair from the table and direct Gwendy to kneel before it as you undress and sit down.", parse);
		} else {
			Text.Add("Quickly removing your [armor], Gwendy kneels before you, looking up expectantly.", parse);
			Text.NL();
			Text.Add("<i>“Let's see what you have in mind today, [playername]...”</i>", parse);
		}

		Text.NL();

		if (titjob) {
			parse.s        = player.NumCocks() > 1 ? "s" : "";
			parse.notS     = player.NumCocks() > 1 ? "" : "s";
			parse.oneof    = player.NumCocks() > 1 ? " one of" : "";
			parse.itThem   = player.NumCocks() > 1 ? "them" : "it";
			parse.itsTheir = player.NumCocks() > 1 ? "their" : "its";
			Text.Add("Your [cocks] poke[notS] out, swelling eagerly as you caress [itThem]. You tell Gwendy to use her breasts today, seeing as she's always putting them on display.", parse);
			if (!hangout) {
				Text.Add(" An adamant look crosses her face, but she complies with your demand, abiding by the bet.", parse);
			}
			Text.NL();
			Text.Add("The softness of her bountiful orbs completely engulfs you, combining pleasantly with her body heat. This looks like it's going to be a good time, but you'll need to keep yourself in check to prolong the experience for as long as possible.", parse);
			Text.NL();
			Text.Add("She begins to move, rubbing her breasts in alternate shakes while looking up at you. ", parse);
			if (hangout) {
				Text.Add("The curvaceous farmer has an almost hungry look on her face, like as if she's looking forward to her imminent treat.", parse);
			} else {
				Text.Add("There's a twinge of shame in her eyes, being pushed so far because of her challenges, but you also catch a glimpse of something that looks like satisfaction.", parse);
			}
			Text.Add(" Either way, you're too busy relishing the feeling of her boobs to really care. Her speed picks up, and soon you are leaking small beads of pre, which slowly drip into her generous cleavage.", parse);
			Text.NL();
			Text.Add("Propped up by her hands, her breasts slide around your [cocks] as she glides up and down [itsTheir] length[s] - without friction, thanks to your fluids. You are almost ready to go blow from the feeling alone, but you try to restrain yourself and last as long as you can.", parse);
			Text.NL();
			if (player.HasBalls()) {
				Text.Add("However, it seems your [balls] think otherwise, as they draw tight, ready to relinquish their load.", parse);
			} else {
				Text.Add("That all-too-familiar urge to cum grumbles from within your groin, and you know that holding on any longer is impossible.", parse);
			}
			Text.NL();
			Text.Add("What seals the deal is Gwendy's hot breath on[oneof] your [cockTip][s] as her full lips hover uncertainly, as if she's considering swallowing you then and there. With a cry of lust, you cum, shooting your load straight into her face and hair. What doesn't land there drips down between her breasts and cleavage.", parse);
			if (player.FirstVag()) {
				Text.Add(" Though still untouched, your feminine half emits its own juices, soaking Gwendy from the chest down.", parse);
			}
			Text.NL();

			const cum = player.OrgasmCum();
			player.AddSexExp(1);
			gwendy.AddSexExp(2);

			if (!hangout) {
				Text.Add("When you calm down, you see a somewhat miserable-looking Gwendy looking back at you. A chuckle escapes you while thinking of how much fun she's going to have cleaning herself today, but that isn't your main concern. Behind the misery, her fiery rebellion is still there, meaning the challenge is still on! This is great, as it means more incredible fucks in the future. And there are a few things you can think to make the next one even more memorable.", parse);
				Text.NL();
				Text.Add("With that thought, you get dressed and bid the girl farewell, thinking of what you're going to do next.", parse);
			} else {
				Text.Add("You smile and tease Gwendy about how slutty she looks. With a smirk, she replies by kissing[oneof] your cock[s], causing you to twitch as it hardens again.", parse);
				Text.NL();
				Text.Add("<i>“Aw, looks like someone is excited to go again. Maybe you should get yourself in control before chastising others.”</i> A grumble escapes your lips, but Gwendy gives you a kiss in response. <i>“Lighten up. I don't mind being a little slutty for you, just don't be rude about it.”</i>", parse);
				Text.NL();
				Text.Add("You mull over that as you get dressed, minding the erect reminder she left you.", parse);
			}

			Text.Flush();

			TimeStep({minute: 30});
			player.AddLustFraction(-1);

			Gui.NextPrompt();
		} else {
			parse.s        = gwendy.NumCocks() > 1 ? "s" : "";
			parse.notS     = gwendy.NumCocks() > 1 ? "" : "s";
			parse.oneof    = gwendy.NumCocks() > 1 ? " one of" : "";
			parse.itThem   = gwendy.NumCocks() > 1 ? "them" : "it";
			parse.itsTheir = gwendy.NumCocks() > 1 ? "their" : "its";

			Text.Add("Despite having stripped down, you tell her she's to do nothing to you. She looks at you with a surprised look, but you keep a straight face and tell her to strip herself. She complies and takes her clothes off in front of you, getting you excited. Her [gbreasts] spring free from their tight confines, bouncing slightly as gravity kicks in. Her form is slick, as a thin layer of sweat has built up over the course of today's work.", parse);
			if (gwendy.EPlus()) {
				Text.Add(" Even her equine addition[s] stiffen[notS] slightly upon being exposed, earning you a sheepish smile from the girl. Well, that just gives you more to play with.", parse);
			}
			Text.NL();
			Text.Add("Next, you tell her to take a seat in the chair as you stand up, circling her like a predatory animal.", parse);
			Text.NL();
			if (!hangout) {
				Text.Add("<i>“N-no funny ideas, alright?”</i> the farmer mutters, trying to cover herself with her hands.", parse);
				Text.NL();
			}
			Text.Add("Approaching Gwendy with a wistful look, you sit in her lap and deeply make out. You stay there for almost a minute, wrapping your tongue around hers, the both of you moaning softly. Before you lose control entirely, you break the lip-lock, both of you eager for more of each other. Remembering your goal, you resist the urge to indulge as you begin kissing her cheek, her neck, causing her to whimper cutely.", parse);
			Text.NL();
			if (first) {
				Text.Add("Looks like she's a tad more sensitive than you thought - not that you mind. You store this piece of information for later use.", parse);
				Text.NL();
			}
			Text.Add("Moving further down, you cup her plentiful breasts, hefting them in your hands as you give her nipples playful licks with the tip of your [tongue]. You continue to tease and caress her with both your hands and your mouth, arousing both yourself and her, carefully avoiding her genitalia.", parse);
			Text.NL();
			if (gwendy.EPlus()) {
				parse.h = player.HasLegs() ? "thighs" : "hip and her stomach";
				Text.Add("Despite your meticulous care, Gwendy is already rock hard. Still, with how things are going, you decide to give her her male endowment[s] some attention. With deft movements, you manage to trap her equipment between your [h]. Gwendy jerks at bit while you squirm seductively, teasing her trapped pecker[s] mercilessly.", parse);
				Text.NL();
			}
			Text.Add("For now, you work on making her more receptive to your touch. Bringing her to the edge of orgasm is an ideal way to get her stimulated and wanting, and she's <i>definitely</i> wanting more. Kissing and teasing your way down her sexually-charged body, you finally reach her ", parse);
			if (gwendy.Gender() === Gender.female) {
				Text.Add("moist and dripping cunt.", parse);
			} else if (gwendy.Gender() === Gender.male) {
				Text.Add("impossibly rigid [gcocks].", parse);
 			} else {
				Text.Add("equally stimulated sexes.", parse);
 			}
			Text.NL();
			Text.Add("You smile, seeing that your touches and kisses has provoked the girl so much that she's almost begging for relief. Instead, you get off the horny girl, telling Gwendy to stand up and lean against the chair. She does so eagerly, the lust in her eyes shining desperately.", parse);
			Text.NL();
			parse.cock = gwendy.EPlus() ? Text.Parse(" and stiff [gcocks]", parse) : "";
			parse.gen  = gwendy.FirstVag()  ? Text.Parse("dripping cunny[cock]", parse) : Text.Parse("stiff [gcocks]", parse);
			Text.Add("While she awaits your next command, you take the time to appreciate the sexy farm girl. Her behind is like two perfectly rounded globes, slick with sweat. Beneath them, you can see her [gen], eager for action.", parse);
			Text.NL();
			if (player.FirstCock()) {
				parse.notEs     = player.NumCocks() > 1 ? "" : "es";
				Text.Add("Your [cocks] twitch[notEs], ready to plunge into her depths. This really might get out of hand if you let it go on for too long...", parse);
				Text.NL();
			}
			Text.Add("Sauntering up to her and caressing her exposed back, your fingers trace down her spine to the crevice of her [gbutt], your digits trailing down its middle. She lets out a small moan and pushes back against you like a slut, desperate for your touch. You are happy to sate this small request of hers. ", parse);

			if (gwendy.EPlus() && gwendy.FirstVag()) {
				if (gwendy.HasBalls()) {
					Text.Add("Lifting up her ample testicles gently, your index and middle fingers slide into the dripping box beneath it. Not to exclude her male additions, you roll and massage her balls in your palm as you frig her.", parse);
				} else {
					Text.Add("With some degree of dexterity, you grab[oneof] her meaty cock[s], stroking it gently while two of your fingers work her wet cunny.", parse);
				}
			} else if (gwendy.FirstVag()) {
				Text.Add("Glad to please her, you push your index finger into her tight ass while your middle and ring fingers penetrate her juicy cunt.", parse);
 			} else if (gwendy.EPlus()) {
				Text.Add("You slowly push two fingers into her taut rear, pressing mercilessly against her prostate.", parse);
 			}

			Text.NL();
			Text.Add("The curvy farmer tries to stifle a moan, but with a sharp slap on her butt from your free hand, she lets it out, her hips moving of their own accord as your fingers thrust within her. Just as you wanted it: Gwendy, aroused beyond words or thoughts, and you in control.", parse);
			Text.NL();
			Text.Add("But keeping to your internal promise, you only do this to tease her. After a few moments, you stop moving your fingers, but leave them in and settle on lightly spanking Gwendy. Based on the clenching felt around your digits, she's getting a bit too close to orgasm so you withdraw your hand altogether.", parse);
			Text.NL();

			TimeStep({minute: 30});
			player.AddLustFraction(0.5);

			if (!hangout) {
				Text.Add("As her body recovers from nearly orgasming, you tease her while she gets dressed, saying she's even more of a slut than you figured. She starts to voice a complaint, but you remind her of the pants and moans she made while you kissed and touched her, saying only a whore could get off to that. Before she can say anything in her defense you leave, glad her fiery attitude is still alive. A challenge is what you live for, right?", parse);
				Text.Flush();
				Gui.NextPrompt();
			} else {
				Text.Add("Despite subduing your desire to mount her, the both of you are moderately aroused in the end. Gwendy, her face flush red, leans her head against your [thigh]. She pants lustily, too stimulated to talk right now. A little tired yourself, you wrap your arms around her, cuddling together.", parse);
				Text.Flush();

				// TODO: Conditional?

				// [Cuddle][Sex]
				const options: IChoice[] = [
					{ nameStr : "Cuddle",
						func() {
							Text.Clear();
							Text.Add("After cuddling together for a while, you part ways with her, though not before Gwendy gets one last kiss in.", parse);
							Text.NL();
							Text.Add("<i>“That was more fun than last time, [playername]. I wouldn't mind doing this again sometime...”</i> You smile boldly as you leave, glad that both of you were able to enjoy this little stint.", parse);
							Text.Flush();

							Gui.NextPrompt();
						}, enabled : true,
						tooltip : "Just cuddle for now, take some time to calm down.",
					},
					// #if horny enough and sex is unlocked? Else default to cuddle
					{ nameStr : "Sex",
						func() {
							Text.Clear();
							Text.Add("<i>“Say... are you really just going to leave it like that?”</i> she manages to pant, grinding back against your body. <i>“Come on... I need it...”</i>", parse);
							Text.Flush();

							GwendyScenes.LoftSexPrompt(undefined, disableSleep, GwendyFlags.ChallengeWinScene.Oral, GwendyFlags.ChallengeLostScene.Oral);
						}, enabled : wonScene >= GwendyFlags.ChallengeWinScene.Oral || lossScene >= GwendyFlags.ChallengeLostScene.Oral,
						tooltip : "She is ready and more than willing.",
					},
				];
				Gui.SetButtonsFromList(options);
			}
		}
	}

	export function ChallengeSexOral(blow: boolean, hangout: boolean) {
		const player: Player = GAME().player;
		const gwendy: Gwendy = GAME().gwendy;

		let parse: IParse = {
			playername     : player.name,
		};
		parse = player.ParserTags(parse);
		parse = gwendy.ParserTags(parse, "g");

		parse.genDesc = player.FirstCock() ? () => player.MultiCockDesc() :
						player.FirstVag() ? () => player.FirstVag().Short() :
						"featureless crotch";
		Text.Clear();

		const first  = gwendy.flags.ChallengeWinScene === GwendyFlags.ChallengeWinScene.Oral;
		const second = !first && !hangout;

		parse.s        = player.NumCocks() > 1 ? "s" : "";
		parse.notS     = player.NumCocks() > 1 ? "" : "s";
		parse.oneof    = player.NumCocks() > 1 ? " one of" : "";
		parse.itsTheir = player.NumCocks() > 1 ? "their" : "its";

		if (!first) {
			player.subDom.IncreaseStat(40, 1);
			gwendy.subDom.DecreaseStat(-40, 1);
		}

		// If first time
		if (first) {
			if (gwendy.flags.LostChallenge === 0) {
				Text.Add("Was there any doubt you were going to win? So far, it's just been win after win, though you must admit she at least mounted quite an effort. Still, you won, and now you're going to reap your reward!", parse);
			} else {
				Text.Add("You were quite confident that you were going to win. She's struggled well against you, and even put up a bit of a challenge, but this time you came out on top. And of course, that means it's time for your reward!", parse);
			}
			Text.NL();
			Text.Add("Why else would you do this? In an almost ritualistic fashion, you lead the way to her room, eager to begin. Yet again, you pull up a chair after undressing. Smiling smugly, you decide to sate yourself with her mouth.", parse);

			gwendy.subDom.DecreaseStat(-100, 5);
			player.subDom.IncreaseStat(100, 3);

			gwendy.flags.ChallengeWinScene = GwendyFlags.ChallengeWinScene.Fuck;
		} else if (second) {
			Text.Add("Heading back to the room where you've claimed all your “rewards”, you pull up the chair again after undressing, while Gwendy gets on her knees awaiting your instructions.", parse);
		} else {
			Text.Add("Stripping down once more, Gwendy kneels before you, smiling sweetly as you settle down in a chair. Seems she's as ready for this as you are...", parse);
		}
		Text.NL();

		if (blow) {
			if (first) {
				Text.Add("Up till now, you've been fairly tame in these sessions, but this time you feel a real craving for sex. Four wins, and no penetration... that's going to end today. Even Gwendy's look conveys that your “rewards” haven't been anything big.", parse);
				Text.NL();
			}
			Text.Add("Confidently, you tell Gwendy to suck your [cock].", parse);
			Text.NL();
			Text.Add("She sets about her duty without a word of complaint, grabbing[oneof] your cock[s] and giving it a few strokes, before experimentally lapping at the tip. You sigh with pleasure as she begins to kiss and lick you, all with a dismissive cute look in her eyes.", parse);
			Text.NL();

			Sex.Blowjob(gwendy, player);
			gwendy.FuckOral(gwendy.Mouth(), player.FirstCock(), 2);
			player.Fuck(player.FirstCock(), 2);

			Text.Add("Those pecks and licks, however, are quickly replaced with the warmth of her mouth engulfing you. ", parse);
			if (first) {
				Text.Add("It takes you by surprise just how good she is at giving head,", parse);
			} else {
				Text.Add("The farmer is as good at giving head as ever,", parse);
			}
			Text.Add(" as it takes her no time to start bobbing along your length, all the while working her tongue in a way that you think few could manage.", parse);
			Text.NL();
			if (player.HasBalls()) {
				Text.Add("She massages your [balls] and kisses them from time to time, alternating between your dick and your balls in an effort to arouse you as much as possible.", parse);
				Text.NL();
			}
			if (player.NumCocks() > 1) {
				parse.s        = player.NumCocks() > 2 ? "s" : "";
				parse.itThem   = player.NumCocks() > 2 ? "them" : "it";
				Text.Add("While Gwendy focuses most of her attention on your main [cock], she occasionally strokes your other dick[s], teasing [itThem] to full mast.", parse);
				Text.NL();
			}
			if (player.FirstVag()) {
				Text.Add("As well as pleasing your [cock], she occasionally licks and laps away at your [vag], causing you to moan. However, it's clear that your [cock] holds the bulk of her interest for now.", parse);
				Text.NL();
			}
			Text.Add("You're almost ready to lose yourself, but you try to persevere as long as possible. Given the fact that she blows like a slut, and has the skills to match, it's amazing that you've managed to last this long!", parse);
			Text.NL();
			Text.Add("However, your resistance comes to an end when she slides a single finger into your [anus] and presses against your prostate. The sensation is far too much for you to handle as she probes and squeezes persistently, massaging your delicate tunnel.", parse);
			Text.NL();
			if (player.HasBalls()) {
				Text.Add("Your [balls] draw tight, the cum desperately trying to erupt from you as it flows up and out.", parse);
			} else {
				Text.Add("You have the familiar feeling that tells you that you are about to blow. Unable to resist, you go with the flow, releasing your load.", parse);
			}
			Text.NL();
			Text.Add("You feel an immense sense of relief as you ejaculate, enjoying the slick feel of Gwendy's mouth filling up with your spunk. It doesn't last long, however, as she begins to suck and drain all of your cargo without missing a beat. Once she finishes drinking your spooge, you withdraw, feeling worn but refreshed all the same.", parse);
			Text.NL();

			const cum = player.OrgasmCum();

			if (hangout) {
				Text.Add("She looks satisfied, indulging in your seed dripping down her throat. With a stray finger, she wipes whatever excess leakage there is, licking it up seductively. When she finishes, she leans in to kiss you, sharing a small bit of your fluids.", parse);
				Text.NL();
				Text.Add("<i>“It's always fun sharing, right?”</i> You smile and swallow before returning the kiss. Once you part, you gather your gear and prepare to leave.", parse);
			} else {
				Text.Add("Finished with your reward, you begin looking forward to the next time, maybe going for something better than her mouth. You give Gwendy a pat on the head for being such a good girl, giving such good head. She gives you an edgy smile as she gets up and kisses you, the smell of your fluid still on her breath. It surprises you a little, but you know this is her way of saying she isn't backing down. Good girl indeed...", parse);
			}
		} else {
			Text.Add("Flashing your [vag] in her face, you tell her to eat you out. You could use a good licking, and you're certain Gwendy won't object too much.", parse);
			if (!hangout) {
				Text.Add(" Besides, even if she did, she'd still have to honor the rules of the challenge.", parse);
			}
			Text.NL();
			parse.l = player.HasLegs() ? "Spreading your legs" : "Presenting yourself";
			Text.Add("[l], you invite her begin her task, and she gets to it silently. She starts with a lick, stroking your [clit] in the process. She continues with tentative licks as she slowly works toward fully burying her tongue in your [vag].", parse);
			Text.NL();

			Sex.Cunnilingus(gwendy, player);
			gwendy.Fuck(undefined, 2);
			player.Fuck(undefined, 2);

			Text.Add("Gwendy looks pretty cute eating you out. Her eyes look up at you from time to time, quietly observing you as you moan and pant like a bitch in heat. Pleasure washes over you as her tongue ravages your [vag] with slow, practiced strokes, making you glad you chose to do this. Her flexible organ is small but deft, licking and probing your inner walls. All the while, her nose keeps butting against your [clit].", parse);
			Text.NL();
			Text.Add("The farmer is squirming, one of her hands getting busy in her own cleft, intent on getting some fun out of this too. She moans, and moves her tongue with stronger but slower laps, making you writhe in ecstasy, desperately trying to force your [vag] further into her face. Your orgasm is closing in, and any attempts to stave it off are rendered futile by Gwendy's skillful mouth. Your muscles start spasming, and your [vag] spurts its juices all over your lover.", parse);
			Text.NL();
			if (player.FirstCock()) {
				Text.Add("Your [cocks] add[notS] [itsTheir] own contribution to the mess, shooting seed into the air while your orgasm is wrung out by Gwendy's lovely tongue.", parse);
				Text.NL();
			}

			const cum = player.OrgasmCum();

			if (hangout) {
				Text.Add("Pulling her face from your cleft, she looks up appreciatively. It seems like she's enjoyed herself more than you had imagined.", parse);
				Text.NL();
				Text.Add("<i>“Quite the honeypot you have there, [playername]. Wouldn't mind tasting a bit more of you, if you get my drift.”</i> You're happy she enjoyed it so much, but you have other matters to tend to. After giving your lover a kiss, you get dressed and head out.", parse);
			} else {
				Text.Add("Exhausted, you see her drenched in fluids, though she's licking her lips as if they were coated in the most delicious liquid she's ever tasted. You get dressed and tell her you'll be back, if she still feels the need to challenge you. Heck, you'll probably be back anyways.", parse);
			}
		}

		Text.Flush();

		TimeStep({minute: 30});
		player.AddLustFraction(-1);

		Gui.NextPrompt();
	}

	export function ChallengeSexVag(fuck: boolean, hangout: boolean) {
		const player: Player = GAME().player;
		const gwendy: Gwendy = GAME().gwendy;

		let parse: IParse = {
			playername     : player.name,
			manWoman() { return player.mfTrue("man", "woman"); },
		};
		parse = player.ParserTags(parse);
		parse = gwendy.ParserTags(parse, "g");

		Text.Clear();

		const first  = gwendy.flags.ChallengeWinScene === GwendyFlags.ChallengeWinScene.Fuck;
		const second = !first && !hangout;

		parse.isAre    = player.NumCocks() > 1 ? "are" : "is";
		parse.s        = player.NumCocks() > 1 ? "s" : "";
		parse.notS     = player.NumCocks() > 1 ? "" : "s";
		parse.oneof    = player.NumCocks() > 1 ? " one of" : "";
		parse.itsTheir = player.NumCocks() > 1 ? "their" : "its";

		parse.gs       = gwendy.NumCocks() > 1 ? "s" : "";
		parse.gnotS    = gwendy.NumCocks() > 1 ? "" : "s";
		parse.ges      = gwendy.NumCocks() > 1 ? "" : "es";
		parse.gits     = gwendy.NumCocks() > 1 ? "their" : "its";

		if (!first) {
			player.subDom.IncreaseStat(50, 1);
			gwendy.subDom.DecreaseStat(-50, 2);
		}

		// If first time
		if (first) {
			Text.Add("Despite your numerous victories, it seems she’s set on challenging you, so why not enjoy the benefits of it? With this, you’ve trumped her five times now. But it isn’t as though she’s just being a pushover about it either, as her skill and dexterity have increased along with yours.", parse);
			Text.NL();
			Text.Add("It makes you worry a bit that she might beat you if you get careless, but for now you bask in the glory of victory! Heading back to Gwendy’s room, you lick your lips as you begin planning what you want from her this time. Once there, you tell the farmer to help you undress.", parse);
			Text.NL();
			Text.Add("Unlike your previous encounters, you remain standing after removing your gear, eyeing her hungrily. You see a little trepidation on Gwendy’s face for a change, but you don’t really care. Pushing Gwendy against the table, you ready yourself to ravage her [gvag]!", parse);

			gwendy.subDom.DecreaseStat(-100, 5);
			player.subDom.IncreaseStat(100, 3);

			gwendy.flags.ChallengeWinScene = GwendyFlags.ChallengeWinScene.Anal;
		} else if (second) {
			Text.Add("With yet another win under your belt, you head back to the loft with the defeated farmer in tow. Once the two of you are secluded, you hastily strip as lust and greed begin to overtake you. Uncaring of the odd glances she casts at you, you push her onto the table, ready to claim her [gvag] again!", parse);
		} else {
			Text.Add("With a lecherous smile, you gently push Gwendy against the table. Stripping feverishly, like a [manWoman] possessed, you kiss her greedily, humping against her. She moans appreciatively, her [gvag] growing moist with arousal.", parse);
			Text.NL();
			Text.Add("Before you go mad with lust, you break the kiss, ready to take her!", parse);
		}

		Text.NL();

		if (fuck) {
			Text.Add("You grind[oneof] your [cocks] against her cleft, dipping the [cockTip] into the damp patch between her legs. ", parse);
			if (first) {
				Text.Add("Finally! You are tired of simple little flings with the flirty farm girl; you are going to get something more substantial this time. Judging by the uncertain and slightly fearful look she gives you, you must have an almost savage appearance as you stare down at her. She says nothing, waiting for you to act, bringing a playful smile to your lips. It seems like all her losses have mollified her rebellious spirit, and she is ready to accept your dominance. ", parse);
			}
			Text.Add("You push the girl onto the table, letting her rest on her back. With your hands freed, you make short work of the pesky clothes, revealing your long-awaited prize: her sopping wet cunt.", parse);
			Text.NL();
			if (gwendy.EPlus()) {
				Text.Add("Despite - or due to - your rough treatment, Gwendy’s prominent equine member[gs] jut[gnotS] up, [gits] rigid mass[ges] throbbing erratically, wanting to join in on the fun. You see a pleading look on Gwendy’s face that begs for you to attend to her cock as well. Unfortunately for her, you have other plans in mind. Perhaps another time.", parse);
				Text.NL();
			}
			Text.Add("Taking a moment to drink in her beauty, you tease her outer lips a bit before plunging two eager fingers in, moving them in circular motions. Within moments, your probing hand is soaked in her juices, the clear liquid flowing down into your palm. Withdrawing your digits, you line up [oneof] your cock[s] against the lubricated tunnel. With equal parts lust and greed, you unceremoniously push inside, penetrating her in one deft motion. The shock is sudden, sending an electric tingle down your spine, as Gwendy cries out in fervent joy.", parse);
			Text.NL();

			Sex.Vaginal(player, gwendy);
			gwendy.FuckVag(gwendy.FirstVag(), player.FirstCock(), 3);
			player.Fuck(player.FirstCock(), 3);

			Text.Add("You stay still for a second, letting her slick folds squeeze around your [cock], briefly reveling in the feeling of her [gvag] before you ravage her. The farm girl looks up at you with her large blue eyes, silently begging you to take her, hard and fast. Not one to keep a lady waiting, you begin to move, your [cock] gripped tightly by her inner walls. For every thrust you make, she lets out a cute squeal, escalating to moans and cries as your thrusts build her arousal, her sweet tenor a pleasing accompaniment to the sounds of flesh grinding against flesh.", parse);
			Text.NL();
			Text.Add("Moving faster and faster, your [cock] is becoming almost painfully erect at this point, and your only options to soothe it is to bury it deep within the pretty girl underneath you. Gwendy, so consumed by pleasure that she is reduced to moaning and panting, wraps her legs around you while gripping the edges of the table tightly as you slam into her. Her eyes are half lidded, clouded by her lust, but her wordless cries beg you to fuck her harder, her [gvag] clamping down fervently around you, as if to milk you dry.", parse);
			Text.NL();
			Text.Add("As much as you’d love to prolong this glorious fuck, you are approaching your limit, ", parse);
			if (player.HasBalls()) {
				Text.Add("your [balls] drawing tight, ready to pack her full of spunk like the bitch she is.", parse);
			} else {
				Text.Add("feeling a familiar tingle in your groin, alerting you that it’s time to blow, and Gwendy’s [gvag] is the perfect place to do it in.", parse);
			}
			Text.NL();
			Text.Add("Letting loose a torrent of cum, you feel your seed gush out, flooding her tunnel while you cry out in pleasure. Your lover isn’t far behind, her legs trapping you in place as her cunt constricts around your [cock], wringing you dry.", parse);

			const cum = player.OrgasmCum();
			const gcum = gwendy.OrgasmCum();

			if (gwendy.EPlus()) {
				Text.Add(" Even as Gwendy’s [gvag] squeeze you, her [gCockDesc] erupt[gnotS] in a large geyser, thick globs of white seed sprouting aimlessly from the tip of the flared cock before gravity kicks in, coating the two of you in a fresh coat of horse-spunk.", parse);
			}
			Text.NL();
			Text.Add("When you come back down from your climax, you pull out of her, a thick strand of your mixed fluids momentarily bridging the gap between the two of you. You fall back into a chair to catch your breath, admiring the mess the two of you have made.", parse);
			Text.NL();

			// TODO: Gwendy preg check

			if (hangout) {
				Text.Add("As you regain your composure, Gwendy pants breathlessly. With a chuckle, you consider the fuck well received before standing up and getting dressed. As you ready to leave, you look back one last time to see Gwendy blowing a flirtatious kiss.", parse);
				Text.NL();
				Text.Add("<i>“Don’t be a stranger now, [playername]. If you can put out like that more often, I definitely wouldn’t mind having you around more.”</i> Smiling at the horny gal, you head out on your travels again.", parse);
			} else {
				Text.Add("As you begin to recover, you muse on if she might be willing to go for another round. However, Gwendy points out that you have already gotten your reward, and with that you go on your way, eager for the next encounter. From her determined expression, you are sure she’ll do her best to beat you next time.", parse);
			}
		} else {
			Text.Add("You nib lightly on Gwendy’s ear as you lean over her, whispering to her to pull off her clothes. Her crotch now bared, you press your dripping [vag] against Gwendy’s, grinning amorously. Leaning in, you kiss her fiercely, causing her to gasp in surprise before returning the favor, melting into your lips as her lust overtakes her. Your tongues entwine as you wrap her fingers in yours, the two of you intimately connected.", parse);
			Text.NL();
			parse.c = gwendy.EPlus() ? ", nested just below her heavy scrotum" : "";
			Text.Add("Pulling back, you work Gwendy onto the table, having her lie on her back with her legs spread. It’s hard to do anything but admire her glistening netherlips[c]. After planting a soft kiss on her tiny clit, you wrap her in your arms, whispering to her to just relax and be yours. Gwendy blushes, letting out a submissive moan in response.", parse);
			Text.NL();
			parse.cl = player.FirstVag().clitCock ? "" : Text.Parse(", aiming your [clit] at Gwendy's", parse);
			Text.Add("You mount her, your [vag] pressing against hers, and begin grinding on her lap. You rut against her[cl], striking true as the two of begin panting and moaning in pleasure. You make sure she knows who’s in control, you doing most of the work, letting Gwendy writhe desperately under you.", parse);
			Text.NL();
			Text.Add("You close in for a kiss, unable to resist the cute, demure blush Gwendy has on her face, completely at odds with the desperate moans she exhales into your mouth. Your bodies press together eagerly, rocking and grinding in languid motions.", parse);
			if (player.FirstCock()) {
				Text.Add(" As you top her, your [cocks] [isAre] treated to a warm massage by the tight sleeve between your bodies. Just being pressed against her makes you want to cum, to spill your seed on both of you.", parse);
				if (gwendy.EPlus()) {
					Text.Add(" You are not the only one either, as Gwendy’s equine member[gs] twitch[ges], eager for action but forced to be sated with grinding against your own cock[s].", parse);
				}
			} else if (gwendy.EPlus()) {
				Text.Add("As the two of you grind and hump, Gwendy’s trapped pecker[gs] twitch[ges] restlessly, [gits] aroused owner the target of a double assault in your sexual frenzy.  You can practically see [gits] need to release as Gwendy fidgets and buckles amidst the action.", parse);
			}
			Text.NL();
			Text.Add("Unable to deny the pleasure wrought from rutting against your slutty lover, you groan as you hit your climax, smearing the juices that pour from your [vag] onto the two of you. Your fluids mingle with those of Gwendy, the ecstatic look in her eyes telling you she is riding the crest of her own orgasm.", parse);
			if (player.FirstCock()) {
				Text.Add(" Your [cocks] join[notS] in on the fun, spraying an even coat of white glaze across Gwendy’s [gbelly] and lower breasts.", parse);
				if (gwendy.EPlus()) {
					Text.Add(" Just as you cum, Gwendy adds her own jism to the fray, covering both of you with another layer of white fluid as she empties her equine balls.", parse);
				}
			} else if (gwendy.EPlus()) {
				Text.Add(" The sensual torture finally becomes too much for Gwendy’s throbbing horsecock[gs], which erupt[gnotS] weakly, coating the farm girl’s exhausted form in her own jizz.", parse);
			}
			Text.NL();

			player.AddSexExp(3);
			gwendy.AddSexExp(3);

			const cum = player.OrgasmCum();
			const gcum = gwendy.OrgasmCum();

			Text.Add("The two of you lie together for a long time after your climax, basking in the afterglow and trying to catch your breaths. ", parse);
			if (hangout) {
				Text.Add("As you lie atop one another, Gwendy kisses you lightly.", parse);
				Text.NL();
				Text.Add("<i>“Mm, who knew mushing our lady bits together would be so fun? You certainly are creative, [playername].”</i> Rolling your eyes, you play it off with a light remark about how much she enjoyed it.", parse);
				Text.NL();
				Text.Add("Before any heavy banter is started, you untangle yourself from your lover’s grip and get dressed. Once you are fully equipped and ready to go, Gwendy swats your [butt] playfully. The farmer kisses you briefly again before sending you on your way.", parse);
			} else {
				Text.Add("You’d love to just stay there and cuddle with the sexy farmer forever, but unfortunately you have other things to do. Cleaning yourself off, you get dressed and head on, leaving Gwendy to clean up after you, hoping she’ll challenge you again so you can continue the fun. As you leave, you swear you spot a burning determination in her eyes. Looks like the fight isn’t quite over yet...", parse);
			}
		}

		Text.Flush();

		TimeStep({minute: 30});
		player.AddLustFraction(-1);

		Gui.NextPrompt();
	}

	export function ChallengeSexAnal(toys: GwendyFlags.Toys, hangout: boolean) {
		const player: Player = GAME().player;
		const gwendy: Gwendy = GAME().gwendy;

		const pc = player.Parser;
		const g = gwendy.Parser;

		const p1cock = player.BiggestCock();

		player.SetPreferredCock(p1cock);

		const eplus = gwendy.EPlus();

		Text.Clear();

		const first  = gwendy.flags.ChallengeWinScene === GwendyFlags.ChallengeWinScene.Anal;
		const second = !first && !hangout;

		const c = new GP.Plural(player.NumCocks() > 1);
		const gc = new GP.Plural(gwendy.NumCocks() > 1);

		if (!first) {
			player.subDom.IncreaseStat(50, 1);
			gwendy.subDom.DecreaseStat(-50, 2);
		}

		// If first time
		if (first) {
			Text.Out(`Yet again, you’ve bested Gwendy at her own game, proving your worth to the curvaceous farm girl. While she put up a good fight, it was simply not enough compared to your skills. You flash Gwendy a victorious smile, and she responds with a nervous grin, hanging her head a bit. While she is grateful for your help, she’s a bit fearful for what you might have planned this time.

			It seems most of the sultry farm girl’s determination has left her body, but you’ve yet to reap your reward. Once you’ve reached the loft, you instruct for Gwendy to sit on her bed as you remove your ${pc.armor}. Rather than throw yourself at her like she expected - perhaps wished for? - you simply pet her on the head, building the tension while eyeing her with a predatory smile.`);

			gwendy.subDom.DecreaseStat(-100, 5);
			player.subDom.IncreaseStat(100, 3);

			gwendy.flags.ChallengeWinScene = GwendyFlags.ChallengeWinScene.LAST;
		} else if (second) {
			Text.Out(`Is Gwendy even trying anymore? As you walk back to the loft, conversing lightly, you give her a smack on her rear, whispering to her that she is in for some more anal attention today. Blushing slightly, the farmer’s eyes flit around, checking if anyone saw the exchange. She increase her pace slightly, perhaps to get out of public view, or maybe... she is looking forward to it?

			The latter actually seems likely as she helps you remove your ${pc.armor} before hopping onto her bed, breathing heavily in anticipation.`);
		} else {
			Text.Out(`Feeling that you want to have some fun, you constantly tease and taunt Gwendy about her rear, saying how fun it is to grope it, how you’d like to stuff it, and fill her to the brim.

			“You sure don’t mince words when you want something, ${pc.name}. Well... I don’t mind a little fun back there, but can you please be gentle?” The last part sounds like a plea, though you doubt she’d mind things getting a little rough. With a chuckle, you tell her you’ll consider it, playfully pushing her onto the bed. Stripping down, Gwendy looks back with a slight look of concern.`);
		}

		Text.NL();

		if (toys) {
			if (gwendy.flags.Toys === GwendyFlags.Toys.None) {
				Text.Out(`Now then... lets see what sort of naughty things Gwendy has lying about in her room. You sternly tell her to remain where she is while you start rummaging through her drawers. Poor girl must have been a bit lonely before you showed up, judging by the number of toys she got stored here. Discounting several bottles of what looks to be massage oils and lubricants, you pull out a variety of sex toys, lining them up on the floor in front of the blushing farm girl.

				Dildos of various shapes and sizes, anal beads, several strap-ons... you idly wonder who she was planning to use the latter on. As you look over the collection, you sense a certain theme here. Judging by her stash, Gwendy <i>really</i> seems to be into equine toys. More than two-thirds of the toys are shaped like horsecocks of various sizes, some so big you are surprised her body could even take them.

				“G-going through a girl’s private stuff like that,” the farmer huffs, embarrassed as you let your curious gaze wander across her collection. Ignoring her, you ask if this is all of it, or if she is hiding more somewhere else. “Yes!” she pipes, though her eyes betray her, as she throws a brief glance toward a huge chest on the other end of the room. Chuckling, you walk over to it to see what she is hiding.

				Inside the chest, below some clothes, bed sheets and smaller trinkets, you find Gwendy’s old sword. Surely, this wasn’t what she meant... You are just about to close the chest when you spot a large bulge under one of the sheets. Pulling it aside, you reveal the biggest toy of her collection so far, an immense, double-ended horsecock dildo, at least fifteen inches to each side. It is quite well made, with flared heads and thick, veiny sheaths. In addition to the obviously equine features of it, it’s covered in nubs, made to rub the user in all the right places.

				Grinning like an expectant child on the night of the winter solstice, you grab it and bring it over to the growing pile. Now, which one will you use?`);

				Text.Flush();

				// [Strapon][R.Strapon][Beads][D.Dildo]
				const options: IChoice[] = [
					{ nameStr : "Strapon",
						func() {
							GwendyScenes.ChallengeSexAnalToys(GwendyFlags.Toys.Strapon, hangout, first);
						}, enabled : false && !player.FirstCock(), // TODO ACTIVATE SCENE
						tooltip : "Fuck her with one of her equine strap-ons.",
					}, { nameStr : "R.Strapon",
						func() {
							GwendyScenes.ChallengeSexAnalToys(GwendyFlags.Toys.RStrapon, hangout, first);
						}, enabled : false, // TODO ACTIVATE SCENE
						tooltip : "Have her wear a strap-on and fuck you.",
					}, { nameStr : "Beads",
						func() {
							GwendyScenes.ChallengeSexAnalToys(GwendyFlags.Toys.Beads, hangout, first);
						}, enabled : true,
						tooltip : "Wonder how many beads her ass can take?",
					}, { nameStr : "D.Dildo",
						func() {
							GwendyScenes.ChallengeSexAnalToys(GwendyFlags.Toys.DDildo, hangout, first);
						}, enabled : player.AnalCap() >= ToysItems.EquineDildo.cock.Thickness(),
						tooltip : "Bring out Gwendy’s double-ended horsedildo for some double anal fun.",
					},
				];
				Gui.SetButtonsFromList(options);
			} else {
				GwendyScenes.ChallengeSexAnalToys(toys, hangout, false);
			}
		} else {
			if (first) {
				Text.Out(`Her shapely ass has been teasing you for the longest time now, but the reward has been worth the wait. Gwendy is so far oblivious of your intentions, so you bring her up to speed by telling her to turn around and prop her butt up. She pouts slightly, but does as commanded, turning around and presenting her rear for you. She even goes the extra step and shakes her bum enticingly, looking back for your approval.

				It amazes you to see how far the confident farm girl has fallen under your dominance, but you’ve got more pressing matters to tend to right now.  You hastily do away with her shorts, baring her plump ass for you to take.`);
				if (eplus) {
					Text.Out(` Her equine member${gc.s} bob${gc.notS} erratically, as if anticipating the impending buttfucking.`);
				}
				Text.Out(` A low moan escapes the slutty girl as you rub${c.oneof} your ${pc.cocks} between her cheeks, quickly reaching full-mast.`);
			} else {
				const gv = new GP.Plural(gwendy.FirstVag() !== undefined);
				Text.Out(`Her shapely ass has been teasing you for the longest, and today you’re gonna ravage it yet again. Rubbing your ${pc.hand}s together, you tell Gwendy to get on all fours. She does so slowly, but once her butt is finally turned to you, she’s greeted with an abrupt spank, causing her to gasp sharply. You smile as you continue, pushing the girl’s face down onto her bed while your free hand kneads her buttocks.

				Once she’s in position, you do away with her shorts, revealing${gv.bothof} her fuck-hole${gv.s}, ripe for the taking. `);
				if (eplus) {
					Text.Out(`Even her flared cock${gc.s} seem${gc.notS} raring for the reaming, twitching helplessly despite receiving no attention. `);
				}
				Text.Out(`Stroking${c.oneof} your ${pc.cocks}, you grind and hump the farm girl’s supple cheeks, making her moan appreciatively as you continue.

					“You’re such a pervert, ${pc.name}... Oh!” That earned her another spank.`);
			}
			Text.NL();
			Text.Out(`You lean over and tell the farm girl that you’re going to fuck her ass raw, bringing out a fierce blush on her freckled face as you adjust your aim. Spreading her cheeks as far as possible, you’re greeted with her dainty, rosy entrance, surrounded by the creamy color of her beautiful skin.`);
			Text.NL();
			if (Math.random() < 0.5) {
				Text.Out(`As much as you want to plow her then and there, it wouldn’t be a bright move, so you stick your middle and ring fingers into you mouth before pushing the saliva-coated digits into her tight back passage.`);
			} else {
				Text.Out(`“T-top drawer!” the farmer gasps as she feels your ${pc.cockTip} prodding her entrance. Delaying your conquest slightly, you pull out an unmarked bottle from said drawer, pouring a generous coating of the lubricant on both your ${pc.cocks} and your fingers. Starting out light, you sink two of your slick digits into her rear.`);
			}
			Text.NL();
			Text.Out(`She arches her back, letting out a low whimper while you slowly work the fingers in and out of her ${g.anus} in an effort to get her prepared. All the while, you tease that she enjoys being finger-fucked like some common whore, which makes her blush shamefully.`);
			if (eplus) {
				Text.Out(` As you massage and prep her entrance, you mash against her prostate, causing her already rigid member${gc.s} to bounce up and down restlessly. You swear, she even begins dripping pre from the stimulation. What a buttslut!`);
			}
			Text.NL();
			Text.Out(`When you have her warmed up, you replace the fingers with your ${pc.cock}, pushing into her warm depths in one swift motion. Pausing for a moment, you let the gasping farm girl adjust, allowing her muscles to become acquainted with your shape before you start fucking her in earnest.`);
			Text.NL();

			Sex.Anal(player, gwendy);
			player.Fuck(p1cock, first ? 10 : 3);
			gwendy.FuckAnal(gwendy.Butt(), p1cock, first ? 10 : 3);

			if (!hangout) {
				Text.Out(`You are not going to hold back any more, as you simply want to drive into her that if she challenges you, she will be yours to use. It seems like she has arrived at the same conclusion as she reaches back and spreads her own cheeks while bending as low as possible, trying to get the best angle for your ${pc.cock}. Seems this girl has <i>a lot</i> more experience than you gave her credit for. Wonder who else has explored these depths?

				“Good girl,” you grunt, pleased with her submissive demeanor.`);
				Text.NL();
			}
			Text.Out(`Thrusting and pumping into her savagely, you are rewarded with whorish moans and gasps. She hardly seems to mind. Thanks to you, she has been reduced to the most base of pleasures, begging for more as you repeatedly bury your ${pc.cock} in her shapely butt. After your initial warm-up, you give in to your desires, fucking her with abandon, pushing both of you toward your inevitable climaxes.`);
			Text.NL();
			if (first) {
				Text.Out(`“S-so good!” she gasps. “We have to do this more!” Well, you aren’t going to voice any complaints there.`);
			} else {
				const scenes = [
					() => {
						Text.Out(`“Yes, yes!” the farm girl cries out. “Fuck me, use me!”`);
					}, () => {
						Text.Out(`“That’s right, stretch my butt!”`);
					},
				];
				if (player.FirstCock().race.isRace(Race.Horse)) {
					scenes.push(() => {
						Text.Out(`“I just can’t get enough of it!” the horny farmer gasps. “I love being fucked by a horsecock, so big...”`);
					});
				}

				_.sample(scenes)();
			}
			Text.NL();
			Text.Out(`Gwendy’s sphincter tightens around your ${pc.cock}, announcing that she is the first one to cum. `);
			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				Text.Out(`Her balls lets loose the flood of her pent up seed,${gc.eachof} her horsecock${gc.s} painting her bed in strands of sticky white goo. `);
			}, 1.0, eplus);
			scenes.AddEnc(() => {
				Text.Out(`She cries out, and from the wetness trailing down her legs, she’ll have to change the sheets after you are done here. `);
			}, 1.0, gwendy.FirstVag() !== undefined);

			scenes.Get();

			Text.Out(`All too soon, the familiar surge of orgasm flows through you. You welcome it, readying yourself to cream her and mark her as yours. As a final churn goes through you${player.HasBalls() ? `r ${pc.balls}` : ``}, you let loose your cargo into her. Gwendy cries out in shock as her bowels are stuffed with spooge, pumped ceaselessly from your quivering shaft. You stay in her for a while, just enjoying the sensation of her, plugged and full of your seed. When you finally pull out, cum bubbles and drips from her rosy pucker as it struggles to retain its shape prior to your domination.`);
			Text.NL();

			const cum = player.OrgasmCum();

			if (hangout) {
				Text.Out(`Satisfied with your romp, you rise and gear up. Behind you, Gwendy gets up, shivering slightly as she carefully balances on the edge of the bed. You ask her if she’ll be fine, but she dismisses your concerns.

				“I’m just a little tired is all. Thanks... for that, but I’ve got work to do.” She looks a bit disoriented as she gets up.`);
			} else {
				Text.Out(`Satisfied, you gear up and get ready to go on your way, but not before reminding Gwendy that you’ll still accept her challenge her if she wants another go. Not waiting for her response, you head on about your day.`);
			}

			Text.Flush();

			TimeStep({minute: 30});
			player.AddLustFraction(-1);

			Gui.NextPrompt();
		}
	}

	export function ChallengeSexAnalToys(toy: GwendyFlags.Toys, hangout: boolean, first: boolean) {
		const player: Player = GAME().player;
		const gwendy: Gwendy = GAME().gwendy;
		const adrian = GAME().adrian;

		let parse: IParse = {
			playername     : player.name,
			manWoman() { return player.mfTrue("man", "woman"); },
		};
		parse = player.ParserTags(parse);
		parse = gwendy.ParserTags(parse, "g");

		Text.Clear();

		parse.isAre    = player.NumCocks() > 1 ? "are" : "is";
		parse.s        = player.NumCocks() > 1 ? "s" : "";
		parse.notS     = player.NumCocks() > 1 ? "" : "s";
		parse.oneof    = player.NumCocks() > 1 ? " one of" : "";
		parse.itsTheir = player.NumCocks() > 1 ? "their" : "its";

		parse.gisAre   = gwendy.NumCocks() > 1 ? "are" : "is";
		parse.gs       = gwendy.NumCocks() > 1 ? "s" : "";
		parse.gnotS    = gwendy.NumCocks() > 1 ? "" : "s";
		parse.ges      = gwendy.NumCocks() > 1 ? "" : "es";
		parse.gits     = gwendy.NumCocks() > 1 ? "their" : "its";

		gwendy.flags.Toys |= toy;

		if (!first) {
			player.subDom.IncreaseStat(50, 1);
			gwendy.subDom.DecreaseStat(-50, 2);
		}

		if (toy === GwendyFlags.Toys.Strapon) { // TODO Write scene
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);

			Text.Flush();

			TimeStep({minute: 30});
			player.AddLustFraction(-1);

			Gui.NextPrompt();
		} else if (toy === GwendyFlags.Toys.RStrapon) { // TODO Write scene
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);

			Text.Flush();

			TimeStep({minute: 30});
			player.AddLustFraction(-1);

			Gui.NextPrompt();
		} else if (toy === GwendyFlags.Toys.Beads) {
			if (!first) {
				Text.Add("Grinning, you tell her to wait while you rummage through her toy collection, pulling out a series of large, thick anal beads.", parse);
				Text.NL();
			}
			parse.gen = gwendy.EPlus() ? ", dripping past her balls and down her soft horsecock" : "";
			Text.Add("Under your instructions, Gwendy gets down on all fours on the bed. Almost dismissively, you tear off her clothes, baring her bottom for your greedy hands. You apply a generous amount of lube to her crack, letting the cold liquid pour down between her cheeks[gen]. Now, lets see how many she’ll take before she’s full!", parse);
			Text.NL();
			Text.Add("The first bead pops in easily enough, thick as it is, enticing a gasp out of the prone farmer. The second and third one follow without problems, though you see her toes curling in pleasure from the penetration. By the fifth one, you are starting to encounter resistance, and Gwendy bites her lip, groaning as she tries to ease her anal ring. Finally, all seven globes are firmly lodged in her back passage, a piece of string the only indication of her hidden cargo.", parse);
			Text.NL();

			Sex.Anal(undefined, gwendy);
			gwendy.FuckAnal(gwendy.Butt(), ToysItems.LargeAnalBeads.cock, 2);
			player.AddSexExp(2);

			Text.Add("<i>“Hah! Something like this is nothing!”</i> the farmer scoffs, blushing slightly as she adjusts her stance, perhaps more aroused by the beads than she wants to let on.", parse);
			if (gwendy.EPlus()) {
				Text.Add(" If her erect [gcocks] [gisAre] any indication, she <i>really</i> likes it.", parse);
			}
			Text.Flush();

			// [Walk][Work][Take out]
			const options: IChoice[] = [
				{ nameStr : "Walk",
					func() {
						Text.Clear();
						Text.Add("You tell her to walk around a bit like that, crawling on all fours around the loft. She grudgingly obeys, wincing as each movement moves the beads around in her bowels. You give her an encouraging slap on her cheek as she is passing by, earning you an infuriated look from the proud farmer.", parse);
						Text.NL();
						Text.Add("<i>“Ugh, you’ve had your fun, take this out already,”</i> Gwendy moans, annoyed with you. As the lady commands.", parse);
						// Pop from call stack
						Gui.PrintDefaultOptions();
					}, enabled : player.SubDom() >= 15,
					tooltip : "Have her walk around the room a bit, see if she's so tough.",
				},
				{ nameStr : "Work",
					func() {
						Text.Clear();
						Text.Add("Fair enough. Why don’t she go about her day then?", parse);
						Text.NL();
						Text.Add("<i>“W-what? Like this?”</i> She looks dismayed as you nod. Blushing furiously, she nonetheless picks up her clothes, pulling them on gingerly. Gwendy stands up unsteadily, wincing as she leans down to pull on her boots. When standing up, one almost wouldn’t suspect that she had a long string of anal beads stuffed up her butt.", parse);
						if (gwendy.EPlus()) {
							Text.Add(" Her [gcocks] straining against the fabric of her tight shorts could clue someone in, though.", parse);
						}
						Text.NL();
						Text.Add("<i>“Pervert,”</i> she mutters as she stalks past you, climbing down the ladder to the barn. You tag along close behind her, eager to see how she’ll fare.", parse);
						Text.NL();

						const scenes = [() => {
							Text.Add("Gwendy doesn’t seem to want to leave the barn, so she goes to tend the cows. She doesn’t do a very good job at it though, as she winces visibly each time she sits down to milk one of them. She keeps throwing smoldering glances in your direction.", parse);
							if (!hangout) {
								Text.Add(" Such a sore loser.", parse);
							}
						}, () => {
							parse.Adrian = adrian.name;
							parse.heshe  = adrian.heshe();
							parse.himher = adrian.himher();

							Text.Add("Gwendy decides to go tending to the fields, and you keep a respectable distance as she angrily grabs hold of a scythe. Better not make her <i>too</i> angry at you. She goes about her business, so focused on cutting grass that she doesn’t notice [Adrian] coming up behind her.", parse);
							Text.NL();
							if (gwendy.EPlus()) {
								Text.Add("<i>“Gwendy, can you-”</i> [Adrian] falters as the farmer whirls about, faced with her barely contained, rock-hard [gcocks]. <i>“I- uh, I’ll just be over here,”</i> [heshe] mumbles, quickly putting some distance between [himher]self and the horny, irritated farm girl. She goes back to hacking angrily at the innocent grass, throwing glowering looks in your direction.", parse);
							} else {
								Text.Add("<i>“What is it no-”</i> Gwendy snaps angrily, whirling about. <i>“Oh. A-[Adrian].”</i> She hastily excuses herself, walking away from the confused horse-morph, throwing glowering looks in your direction.", parse);
							}
						}, () => {
							Text.Add("Gwendy decides to go tend to the sheep, quickly regretting her decision when she meets the bubbly airhead Danie.", parse);
							Text.NL();
							Text.Add("<i>“Hello, Miss Gwendy! Such a lovely day!”</i> the sheep-morph gaily exclaims. <i>“Are you alright miss?”</i> Danie looks a bit concerned at the farmer’s discomfort.", parse);
							Text.NL();
							Text.Add("<i>“J-just fine, Danie, just fine,”</i> she chips out, throwing glowering glances in your direction. The curious sheep follows Gwendy around as she goes about her work, and at the moment she least expects it, Danie pulls on the short piece of string sticking out of Gwendy’s pants.", parse);
							Text.NL();
							Text.Add("<i>“DANIE!”</i> the farmer yowls, batting off the confused sheep, inadvertently scattering the entire flock with her waving arms. Ah, fun times.", parse);
						}];
						_.sample(scenes)();

						Text.NL();
						Text.Add("<b>Time passes...</b>", parse);
						Text.Flush();

						Gui.NextPrompt(() => {
							Text.Clear();
							Text.Add("<i>“Enough!”</i> Gwendy finally pants, dragging you back toward the loft.", parse);
							Text.NL();
							parse.cum = gwendy.EPlus() ? "cum" : "clear liquid";
							Text.Add("The last stretch is the worst for her, and as she climbs up the ladder in front of you, you see a trickle of [cum] slowly dripping down one of her legs. When you pull yourself up on the landing, Gwendy’s legs are shaking slightly in the afterglow of her anal orgasm.", parse);
							Text.NL();
							parse.gen = gwendy.EPlus() ? Text.Parse(", freeing her stiff [gcocks]", parse) : "";
							Text.Add("<i>“T-take this out, right now!”</i> she whimpers, pulling down her shorts[gen]. As the lady commands.", parse);
							// Pop from call stack
							Gui.PrintDefaultOptions();

							player.subDom.IncreaseStat(50, 1);
							gwendy.subDom.DecreaseStat(-10, 1);
							TimeStep({hour: 1});
						});

					}, enabled : player.SubDom() >= 30 && (WorldTime().hour < 19 && WorldTime().hour >= 5),
					tooltip : "Have her work for a while like this.",
				},
				{ nameStr : "Take out",
					func() {
						Text.Clear();
						Text.Add("Looks like she has had enough for now.", parse);
						// Pop from call stack
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Have mercy on her and remove the beads.",
				},
			];
			Gui.SetButtonsFromList(options);

			Gui.Callstack.push(() => {
				Text.Add(" You grab hold of the string, tugging on it lightly. By now, Gwendy’s pucker has tightened up, so it takes a little effort to pop out the first bead.", parse);
				Text.NL();
				Text.Add("<i>“Ngh, so rough!”</i> she complains. You ask her if she’d rather you stop, leaving it inside, and she angrily shakes her head, motioning you to continue. Two. Three.", parse);
				Text.NL();
				Text.Add("<i>“Why did I agree to this?”</i> she grumbles, wincing as four and five pop. As you begin to pull on the sixth, a tremble runs through her legs. <i>“[playername]! W-wai-”</i> Woops. Gwendy cries out in orgasm as the final beads pop out of her gaping anus. ", parse);
				if (gwendy.EPlus()) {
					Text.Add("Gouts of cum splash all over the floorboards as the farmer’s cock[gs] erupt[gnotS], emptying her balls.", parse);
				} else {
					Text.Add("Flowing girl-cum drips from the farmer’s pussy, trickling down her wobbly legs.", parse);
				}
				Text.NL();
				if (hangout) {
					Text.Add("Well, that was fun.", parse);
				} else {
					Text.Add("<i>“I... I’ll return the favor, if I win next time...”</i> she gasps weakly.", parse);
					Text.NL();
					Text.Add("Cheerfully, you wave goodbye to the exhausted girl. Well, that was fun. Chuckling to yourself, you head out on your travels again.", parse);
				}

				Text.Flush();

				TimeStep({minute: 30});
				player.AddLustFraction(0.2);

				Gui.NextPrompt();
			});
		} else { // DDildo
			if (!first) {
				Text.Add("Grinning, you tell her to wait while you rummage through her toy collection, bringing out the huge double-ended horsecock dildo.", parse);
				Text.NL();
			}
			Text.Add("Humming to yourself, you cradle the huge double-ended equine dildo in your arms, licking at one of the flared heads seductively. Gwendy eyes you with a hungry look, barely holding herself back, but obeying your commands for now. You tell her to get out of those pesky clothes so that she can join in on the fun. She quickly wiggles out of her shorts and shirt, grabbing a bottle of lube in passing before pulling you down on the bed, dildo in tow.", parse);
			Text.NL();
			Text.Add("You position yourself opposite each other, the large toy pressed between your bodies, each of you with one of the flared heads within easy reach. Grabbing hold of Gwendy’s plump cheeks, you press the dildo against her genitalia, varying your licking between the fat equine head and the hole in which it will soon be buried.", parse);
			Text.NL();
			if (gwendy.EPlus()) {
				Text.Add("The farmer isn’t making the job easy for you as her own rigid horsecock[gs] compete[gnotS] for space, pressing tightly against her stomach. The heady, musky smell rising from her balls is extremely distracting, but you manage to keep yourself focused.", parse);
				Text.NL();
			}
			Text.Add("Wanting to return the favor, Gwendy licks on the other end of the toy, coating the flare in her saliva. She reaches farther and farther, until you suddenly feel her cool tongue on your [butt]. She lightly caresses it, hesitantly at first, but growing more and more confident as she buries her head between your cheeks, loosening up your pucker.", parse);
			if (player.FirstCock()) {
				Text.Add(" You almost regret your plan; why not throw her on her back and ram your [cocks] inside her?", parse);
			}
			Text.NL();
			Text.Add("<i>“M-me first,”</i> Gwendy pants, getting up on all fours, shaking her ass at you invitingly. <i>“Use a lot of lube, okay?”</i> She sighs in pleasure as the cool lubricant pours between her cheeks, dripping down the huge toy as you slide it between her buns. Adjusting your aim slightly, you press the flared head against her back entrance. At first, it looks like an impossible task to fit the broad head equine toy inside her, but the girl keeps egging you on, spreading her legs and butt cheeks wide in her efforts to impale herself on her favorite dildo.", parse);
			Text.NL();
			parse.gen = gwendy.EPlus() ? "cock and balls" : "snatch";
			Text.Add("After an agonizing amount of teasing, it finally pops inside, Gwendy’s anal ring stretched an incredible amount. The girl collapses, her legs no longer able to hold her up as she has her first trembling orgasm. Thanks to the flared head, the dildo is firmly stuck inside, about two feet of it hanging out invitingly. Gwendy rolls over on her back, exposing her dripping [gen] and her stuffed ass.", parse);
			Text.NL();

			Sex.Anal(undefined, gwendy);
			gwendy.FuckAnal(gwendy.Butt(), ToysItems.EquineDildo.cock, 3);

			Text.Add("<i>“Your turn,”</i> she smiles at you, exhausted from the effort.", parse);
			Text.NL();
			Text.Add("On second thought, you aren’t so sure about this anymore, but you let yourself be pulled down on top of the girl, closing your eyes as her lubed fingers snake their way into your [anus], spreading it in preparation for the huge toy. After sharing a deep kiss, you nervously reposition yourself on your back, legs spread for the monster you will share with your lover.", parse);
			Text.NL();
			Text.Add("<i>“I know you’ll love it, don’t worry,”</i> Gwendy murmurs, nudging her hips forward, easing the other head against your spread cheeks. Due to its flexibility, it’s hard for her to guide it in by herself, so you lean down to lend a hand, keeping her aim straight.", parse);
			Text.NL();
			if (player.AnalCap() >= 8) {
				Text.Add("A toy like this is hardly a match for you, and you are easily able to take it in, greedily swallowing several inches of it, letting the flare settle inside your stretched back passage.", parse);
			} else {
				Text.Add("You now know why it took so long for Gwendy to take the equine toy, it is so thick! The farmer is persistent though, keeping the pressure on your anus up. Slowly, ever so slowly, you can feel the flared head force its way inside your stretched rectum, each undulation of her hips pushing it further in. At long last, it passes the point of no return, trapped inside your stretched back passage.", parse);
			}
			Text.NL();

			Sex.Anal(undefined, player);
			player.FuckAnal(player.Butt(), ToysItems.EquineDildo.cock, 3);

			parse.l = player.HasLegs() ? "legs together" : "[legs] with Gwendy's legs";
			if (player.FirstCock()) {
				Text.Add("<i>“I think you’ll feel this one on your prostate,”</i> she grunts, punctuating her words with a roll of her hips. No doubt.", parse);
			} else {
				Text.Add("<i>“It feels good, doesn’t it?”</i> the farm girl sighs, letting you rest a bit before she starts moving in earnest.", parse);
			}
			Text.Add(" Entwining your [l], you start to pull toward each other, pushing more and more of the double-ended toy into your respective holes. Before long, you start encountering the nubs. Oh Aria, the nubs. As if the toy itself wasn’t girthy enough, a myriad of bulging studs are set at irregular intervals, stretching your ring even farther when they pass it. Once inside, they drag against the walls of your colon, stirring you up even more.", parse);
			Text.NL();
			Text.Add("Nodding to Gwendy, you both get back on all fours, facing opposite directions. In unison, you start to rock your hips, trying to push against each other in order to force the toy deeper inside. ", parse);
			if (player.Butt().Cap() >= 8) {
				Text.Add("Soon, your asses touch, as both of you have impaled yourselves as far as you can go on the massive dildo. Gwendy looks back over her shoulder in surprise.", parse);
				Text.NL();
				Text.Add("<i>“You are quite good at this; someone has been getting a lot of practice!”</i> she moans happily as your butts grind together.", parse);
			} else {
				Text.Add("You haven’t been trained quite as well as Gwendy has, so there is a limit to what you can take. Still, that doesn’t mean that the horny farmer doesn’t do everything she can to push that limit as far as it can go, buckling her hips back at you.", parse);
			}
			Text.NL();
			if (player.FirstCock()) {
				Text.Add("Just like she said, having the studded horsecock plowing your behind for an extended period of time is bliss for your poor prostate. Already at the first thrust, you could feel your cockmilk being pressed out of it, and by now your [cocks] [isAre] drooling with cum from numerous anal orgasms.", parse);
				Text.NL();
			}
			Text.Add("<i>“Hah… just… tell me when you’ve had enough!”</i> Gwendy groans, still showing her fighting spirit. Like animals, you rut against each other, caught up in your lust. You tumble around, trying to get a better angle of penetration on the other. It’s like a playful wrestling match, only you are sharing a two foot equine dildo between the two of you, grinding and thrusting.", parse);
			Text.NL();
			Text.Add("Finally, you’ve both run out of energy. Exhausted, you collapse in a pile of sexual juices, the horsecock dildo pulling free from your ass with a loud pop. Gwendy lies next to you panting, the other end still firmly lodged in her stretched behind. After giving her a kiss, you leave her like that", parse);
			if (player.Butt().Cap() < 8) {
				Text.Add(", rubbing your sore butt.", parse);
			} else {
				Text.Add(" and head out back on your adventures.", parse);
			}
			if (!hangout) {
				Text.NL();
				Text.Add("Before you leave, you hear Gwendy murmur something to herself:", parse);
				Text.NL();
				Text.Add("<i>“I… I guess you’ve really beaten me this time.”</i> She doesn’t sound the slightest bit unhappy about this.", parse);
			}

			if (player.Butt().capacity.IncreaseStat(8, .5)) {
				Text.NL();
				Text.Add("<b>Your butt feels slightly stretchier.</b>", parse);
			}

			Text.Flush();

			TimeStep({minute: 30});
			player.AddLustFraction(-1);

			Gui.NextPrompt();
		}
	}

	export function ChallengeSexLostPrompt(hangout: boolean, options: IChoice[], disableSleep: boolean, minScene: GwendyFlags.ChallengeLostScene = GwendyFlags.ChallengeLostScene.Kiss) {
		const player: Player = GAME().player;
		const gwendy: Gwendy = GAME().gwendy;

		const eplus = gwendy.EPlus();

		let parse: IParse = {
			playername      : player.name,
			phisher         : player.body.Gender() === Gender.male ? "his" : "her",
		};
		parse = player.ParserTags(parse);
		parse = gwendy.ParserTags(parse, "g");

		parse.genDesc = player.FirstCock() ? () => player.MultiCockDesc() :
						player.FirstVag() ? () => player.FirstVag().Short() :
						"featureless crotch";

		// gwendy.flags["ChallengeLostScene"]
		let lossScene = gwendy.flags.ChallengeLostScene;
		let wonScene  = gwendy.flags.ChallengeWinScene;
		if (hangout) { lossScene--; }
		if (hangout) { wonScene--; }

		if (lossScene >= GwendyFlags.ChallengeLostScene.Kiss) {
			options.push({ nameStr : "KissSub",
				func() {
					const first = lossScene === GwendyFlags.ChallengeLostScene.Kiss;
					Text.Clear();

					if (!first) {
						player.subDom.DecreaseStat(0, 1);
						gwendy.subDom.IncreaseStat(0, 1);
					}

					TimeStep({minute: 30});
					player.AddLustFraction(0.1);
					if (hangout) {
						Text.Add("Smiling delightfully, Gwendy leans in, pressing her lips against yours. You moan gently as her soft, full lips explore your own.", parse);
					} else {
						Text.Add("Gwendy lets out an excited squeal, knowing she bested you in the challenge. A part of you wonders just what she has in store, but you're answered when she embraces you and presses her lips against yours.", parse);
					}
					Text.NL();
					Text.Add("It's just a kiss, simply a kiss, though she does make it a little more amorous than simply kissing. All the while, she flicks her tongue around in your mouth, wrapping around yours and exploring inside.", parse);
					Text.NL();
					Text.Add("It's simple and sweet, but she breaks the kiss with you before long. When the two of you separate, she looks at you almost innocently, but her eyes betray the spark of excitement and lust she's hiding from her face.", parse);
					Text.NL();
					if (hangout) {
						const scenes = new EncounterTable();
						scenes.AddEnc(() => {
							Text.Add("Once she breaks the lip-lock, you feel the need to kiss more, maybe even more! Gwendy chuckles seeing your desperation. <i>“Nope, no more from me. After all, isn't it better to wait?”</i> You pout a bit, but she pats your [butt] as she heads back to work. <i>“Maybe next time, there'll be a little more.”</i> As always, tease and taunt enough to get you coming back for more. Maybe next time, indeed...", parse);
							Text.Flush();
							Gui.NextPrompt();
						}, 1.0, () => true);
						scenes.AddEnc(() => {
							Text.Add("As she breaks the kiss, you find yourself slightly aroused. The same could be said for Gwendy and her amorous glance. <i>“Heheh, sorry, [playername], but that's all for now.”</i> She smiles upon noticing your disappointment, though she makes up with another, longer kiss. <i>“Then again, I might not be able to resist so easily... whaddaya say we kick it up a notch?”</i>", parse);
							Text.Flush();
							GwendyScenes.LoftSexPrompt(undefined, disableSleep, GwendyFlags.ChallengeWinScene.Hands, GwendyFlags.ChallengeLostScene.Makeout);
						}, 1.0, () => lossScene >= GwendyFlags.ChallengeLostScene.Makeout || wonScene >= GwendyFlags.ChallengeWinScene.Hands);

						scenes.Get();
					} else {
						Text.Add("In any event, she parts with you saying, <i>“That wasn't too bad at all, [playername]... though you'd better be prepared for next time. I won't be as nice as this time. Take care!”</i> Seems like she's already thinking of ways to keep you in check should you lose again, meaning either you've got to step your game up, stop the challenge, or give up. Still, that kiss was rather hot...", parse);
						Text.Flush();
						Gui.NextPrompt();
					}
				}, enabled : minScene <= GwendyFlags.ChallengeLostScene.Kiss,
				tooltip : "Let Gwendy kiss you.",
			});
		}
		if (lossScene >= GwendyFlags.ChallengeLostScene.Makeout) {
			options.push({ nameStr : "Make-out",
				func() {
					const first = lossScene === GwendyFlags.ChallengeLostScene.Makeout;

					Text.Clear();
					if (!first) {
						player.subDom.DecreaseStat(-25, 1);
						gwendy.subDom.IncreaseStat(25, 1);
					}

					if (hangout) {
						Text.Add("Gwendy giggles happily. If the sultry look in her eyes are any indication, you’d best be prepared...", parse);
					} else {
						Text.Add("You curse under your breath, Gwendy has won again! Still, you don’t beat yourself up about it too much, as the challenge was rather intense, and you put up a fair enough fight. However, in the end, you didn’t win, and Gwendy gets to do what she wants to you.", parse);
					}
					Text.NL();
					Text.Add("Approaching you with a mischievous smile, Gwendy all but forces herself on you then and there, throwing her arms around you and locking lips with you once more.", parse);
					Text.NL();
					if (first) {
						Text.Add("You wonder if she’s just going to repeat the same thing she did last time, as her tongue begins to stroke and caress yours. Your question is answered when you feel your back press against something solid. The girl is a <i>lot</i> more forceful this time.", parse);
						Text.NL();
					}
					parse.them = player.FirstBreastRow().Size() > 3 ? " them" : "";
					Text.Add("She keeps kissing you, constantly nuzzling and feeling you up. Her hands move from your face to your [breasts], moving[them] in slow circles, coaxing a small wave of arousal to flush over you. The girl relentlessly explores your body, touching just about every part of you as she moans and presses herself against you. The entire time, you fight to keep up, letting out a few whimpering moans while getting more and more aroused by her fire.", parse);
					Text.NL();

					if (gwendy.EPlus()) {
						parse.legs = player.LowerBodyType() === LowerBodyType.Single ? "against you" : "between your legs";
						Text.Add("As Gwendy gets more and more into the carnal act, you feel her equine addition rubbing [legs], ready and waiting to defile whatever crosses its path. Gwendy breaks the hot kiss you two share, biting her lip as she shares a slightly embarrassed look with you.", parse);
						Text.NL();
						Text.Add("<i>“You don’t know how hard it is to restrain from fucking you sometimes, when you’re packing what I’ve got, [playername],”</i> she says in a sultry tone. Pressing her body and lips against yours once more, she grinds with reckless abandon, her bulging erection[gs] threatening to escape her tight pants any second.", parse);
						Text.NL();
					}
					if (player.FirstCock()) {
						Text.Add("Breathing heavily, you quickly lose yourself to baser thoughts, just enjoying the attention you are receiving. The dominant farm girl has no qualms about using you in whatever way she can, teasing you mercilessly. A worried moan escapes your lips as Gwendy slips a hand into your [botarmor], lightly jerking your [cocks] on the spot. It feels good, but it isn’t enough to drive you to the point of orgasm, something Gwendy clearly avoids, keeping you carefully on the edge.", parse);
						Text.NL();
					}
					if (player.FirstVag()) {
						Text.Add("As the two of you make out, you feel moisture trickling from your [vag], lightly soaking your undergarments. Seeing your arousal on your face, Gwendy smirks a bit as she fingers you playfully. It feels good, oh so good, but Gwendy’s skilled digits keep you teetering on the edge of orgasm, preventing you from reaching your climax.", parse);
						Text.NL();
					}

					TimeStep({minute: 30});
					player.AddLustFraction(0.5);

					if (hangout) {
						player.AddLustFraction(1);
						player.AddLustFraction(-0.1);

						const scenes = new EncounterTable();
						scenes.AddEnc(() => {
							Text.Add("Ending her groping session with a kiss, Gwendy places her hands on your face, looking longingly into your eyes.", parse);
							Text.NL();
							Text.Add("<i>“Mm, [playername], I’d love to continue, but I’m backed up as it is. Maybe next time, we can do something more?”</i>", parse);
							Text.NL();
							Text.Add("With that, she leaves you, smiling over her shoulder. You get your gear in order again, already looking forward to your next encounter with the teasing farm girl.", parse);
							Text.Flush();
							Gui.NextPrompt();
						}, 1.0, () => true);
						scenes.AddEnc(() => {
							Text.Add("As Gwendy leads her sexual assault, she continuously gropes your groin. Under her relentless teasing, you become so aroused you’re practically leaking, though Gwendy stops before you can get off. With a playful yet predatory smile, she pats you on the head.", parse);
							Text.NL();
							Text.Add("<i>“You know... we can always kick this up a notch if you want to...”</i>", parse);
							Text.NL();
							Text.Add("Without wasting a moment, you agree, eager to get back at her for this.", parse);
							Text.Flush();
							GwendyScenes.LoftSexPrompt(undefined, disableSleep, GwendyFlags.ChallengeWinScene.Titfuck, GwendyFlags.ChallengeLostScene.Denial);
						}, 1.0, () => lossScene >= GwendyFlags.ChallengeLostScene.Denial || wonScene >= GwendyFlags.ChallengeWinScene.Titfuck);

						scenes.Get();
					} else {
						Text.Add("After making out with you for a good twenty minutes, she breaks her last kiss, though not before copping a quick feel of your [genDesc] one last time before walking off. It leaves you turned on, but you feel a little ashamed about it. Not wanting to dwell on it anymore, you head on your way, trying to clear your thoughts.", parse);
						Text.Flush();
						Gui.NextPrompt();
					}
				}, enabled : minScene <= GwendyFlags.ChallengeLostScene.Makeout,
				tooltip : "Have a steamy make-out session.",
			});
		}
		if (lossScene >= GwendyFlags.ChallengeLostScene.Denial) {
			options.push({ nameStr : "Denial",
				func() {
					const first  = lossScene === GwendyFlags.ChallengeLostScene.Denial;
					const second = !first && !hangout;

					Text.Clear();
					if (!first) {
						player.subDom.DecreaseStat(-40, 1);
						gwendy.subDom.IncreaseStat(40, 2);
					}

					if (!hangout) {
						Text.Add("She wins... yet again. ", parse);
						if (first) {
							player.libido.IncreaseStat(100, 2);

							Text.Add("As she lets out a happy sigh, you find yourself a little nervous about what she might do this time. The previous times, she just aggressively kissed and groped you, leaving you somewhat aroused but you’re sure this streak won’t continue.", parse);
							Text.NL();
							Text.Add("As if reading your exact thoughts, she approaches you. However, instead of doing something then and there, she grabs your arm and pulls you toward her room. After climbing up the ladder, she pulls a chair from the table for you to sit in, while she stands and looks at you with a curious expression. Is she going to do something to get you off this time? That wasn’t something you’d expect from the victor, but you don’t mind it at all.", parse);
							Text.NL();
							Text.Add("However, it seems she has other ideas in mind. She tells you to strip your [armor] before her as she steps closer, her expression changes to a predatory one. This can’t be good...", parse);
							Text.NL();
						} else {
							Text.Add("The farm girl has a malicious glint in her eyes, making you squirm slightly under her close scrutiny.", parse);
							Text.NL();
							Text.Add("<i>“You feel up for another tease?”</i> Gwendy grins at your suggestion. <i>“I can keep you going for hours, and don’t expect me to let you get off. You must have a real masochistic streak, huh?”</i>", parse);
							Text.NL();
							Text.Add("Without allowing you any opportunity to respond, she bodily drags you toward the loft. After scaling the ladder, she pulls out a chair and instructs you to sit down.", parse);
							Text.NL();
						}

						Text.Add("Like previous times, she starts with a deep kiss, locking tongues with you. Her hands begin to lightly stroke your body, while slowly moving down. It feels good, simply kissing her as her delicate fingers trace and run down the course of your body.", parse);
						if (player.HasFur()) {
							Text.Add(" She even takes the time to scratch and pet your fur, gently coaxing a groan of happiness out of you.", parse);
						}
					} else { // Hangout
						Text.Add("Gwendy smiles happily as she pushes you into a chair, her predatory expression rising submissive arousal through you. She starts off gently, kissing lovingly and passionately. As you two lock lips, Gwendy’s fingers run down your hips and thighs.", parse);
					}
					Text.NL();
					Text.Add("The farm girl is slow and coy in her movements, skillfully dragging out each languid touch until your body is trembling. You let out an involuntary gasp as her hands finally reach your groin.", parse);
					Text.NL();

					const scenes = new EncounterTable();
					scenes.AddEnc(() => {
						parse.s        = player.NumCocks() > 1 ? "s" : "";
						parse.itsTheir = player.NumCocks() > 1 ? "their" : "its";
						parse.oneof    = player.NumCocks() > 1 ? " one of" : "";

						Text.Add("Gwendy’s hands gently caress your [cocks], raising small murmurs of delight from you as she coaxes your shaft[s] to [itsTheir] full size.", parse);
						if (player.HasBalls()) {
							Text.Add(" She even manages to get your [balls] into her palm, groping and rolling them over as she plays with[oneof] your [cocks].", parse);
						}
						if (player.FirstCock().race.isRace(Race.Horse)) {
							Text.Add(" Most of her attention focuses on your equine member, as if she just can’t get enough of it. It’s almost as if she were petting it, admiring your pony pecker despite herself.", parse);
						}
						Text.NL();
						Text.Add("It feels great, and you even feel the pending surge of ejaculation welling from her skilled handjob. You realize that your torment has just begun, however, when her supple fingers forcefully squeeze your [cocks], halting your seed’s exit.", parse);
						Text.NL();
						Text.Add("<i>“Now, who said you could cum, [playername]?”</i> she whispers in your ear. <i>“<b>I’m</b> the one that decides if and when you release, okay?”</i> You begin protesting, but she squeezes tighter, making you cry out as she torments your erect [cocks]. With a low whimper, you agree reluctantly, if only in the hopes of her taking away some pressure.", parse);
						Text.NL();
						Text.Add("She does, but only by a small margin. She continues to stroke and play with the length of your [cocks], fixating a playful, yet sadistic gaze on your face to monitor how close you are to cumming. Every time you’re about to get off, she grips and twists brutally, a cruel smile on her face as you howl in pain.", parse);
						Text.NL();
						Text.Add("As the cycle of erotic anguish repeats itself, your perception of time is clouded by the constant need to release. Despite knowing harm will come to your [cocks], you can’t help but lose yourself to the feel of her silky hands stroking you. After what feel like hours of torture, Gwendy relaxes her grip slightly, just enough for a small bead of pre to emerge, before tightening again. ", parse);
						Text.NL();
						Text.Add("This small mercy runs rampant through your body, making you melt in your seat, eager for more. You’re barely coping with the intense sensation of pain and pleasure coursing through your groin, yet you lust for more under the dominating presence of Gwendy. The need to cum is paramount, but you know that Gwendy will stop you immediately if you try to get off. Glancing meekly at Gwendy, you plead with her to let you climax. With a predatory smile, she answers:", parse);
						Text.NL();
						Text.Add("<i>“I never said I’d allow you to cum, did I? And until I do, you better not waste a drop more than I allow. Understood, [playername]?”</i> Nodding vigorously, you watch her expression soften a bit as she backs away.", parse);
						Text.NL();
						Text.Add("<i>“Good. Well, you’re free to leave now, since I’ve had my fun. Just make sure that if you do get off, it’d better be away from the farm. Who knows what might happen to you if I catch you?”</i> Despite her playful tone, you instinctively know you’d be degraded even worse than today. Getting dressed in haste, you mumble your goodbyes to Gwendy, before heading on your way, painfully aroused.", parse);
						Text.NL();
					}, 1.0, () => player.FirstCock() !== undefined);
					scenes.AddEnc(() => {
						Text.Add("Gwendy chuckles in a haughty tone, as she begins to caress the slick folds surrounding your [vag]. It elicits a low moan from you and she smiles at your arousal. Slowly, she begins tease your [clit] with a stray finger as you squirm and grow wetter.", parse);
						Text.NL();
						Text.Add("It feels heavenly, and you can hardly believe that she’s going to let you get off this easily. As her digits dig into the cleft of your [vag], however, your road to orgasm is stopped when you feel a sharp pain against your [clit]. Looking down, you see Gwendy pinching it between her fingers, making you whimper pathetically.", parse);
						Text.NL();
						if (!hangout) {
							Text.Add("<i>“Ah, ah, don’t think that’s going to happen, [playername]. Remember: I won the challenge, so I can do what I want today. And today, I want to deny you your pleasure.”</i> As she speaks, she keeps an even and calm tone, though her face displays a somewhat playful malice. ", parse);
							Text.NL();
						}
						Text.Add("In addition to teasing your [clit], she dips two fingers into your dripping [vag], pumping and grinding the digits against your vaginal walls. All the time, you whimper and pant, ever close the edge of relief but always blocked off by Gwendy’s teasing.", parse);
						Text.NL();
						Text.Add("You hold on as best you can, but the teasing and denial mercifully end when Gwendy relaxes the pressure on your [clit] and eases the intensity of her frigging. You almost cum then and there, but a look at Gwendy tells you better.", parse);
						Text.NL();
						Text.Add("<i>“I’ve had fun with you, but I’ve got other things to do. Don’t let me catch you getting off here on the farm, though. While you are here, you are under my thumb, got it?”</i>", parse);
						Text.NL();
					}, 1.0, () => player.FirstVag() !== undefined);

					scenes.Get();

					Text.Add("The voice is playful, but does little to mask the obvious threat she’s laid out. As best you can, you get dressed and leave in haste, not wanting to risk incurring her sexual wrath on you.", parse);

					TimeStep({hour: 1});
					player.AddLustFraction(0.9);
					Text.Flush();

					Gui.NextPrompt();
				}, enabled : minScene <= GwendyFlags.ChallengeLostScene.Denial,
				tooltip : "Gwendy will tease you and test your sexual endurance.",
			});
		}
		if (lossScene >= GwendyFlags.ChallengeLostScene.Oral && !eplus/* gwendy.FirstVag() */) {
			options.push({ nameStr : "Eat her",
				func : () => {
					const first = lossScene === GwendyFlags.ChallengeLostScene.Oral;
					LossEatHerOut(hangout, first);
				}, enabled : minScene <= GwendyFlags.ChallengeLostScene.Oral,
				tooltip : "Please Gwendy with your tongue.",
			});
			/* TODO Blowjob */
		}
		if (lossScene >= GwendyFlags.ChallengeLostScene.Ride) {
			options.push({ nameStr : "Ride",
				func : () => {
					const first = lossScene === GwendyFlags.ChallengeLostScene.Ride;
					LossRide(hangout, first);
				}, enabled : minScene <= GwendyFlags.ChallengeLostScene.Ride,
				tooltip : "Have Gwendy ride you.",
			});
		}
		if (lossScene >= GwendyFlags.ChallengeLostScene.Fucked) {
			options.push({ nameStr : eplus ? `Get fucked` : `Strap-on`,
				func : () => {
					const first = lossScene === GwendyFlags.ChallengeLostScene.Fucked;
					LossGetFucked(hangout, first);
				}, enabled : minScene <= GwendyFlags.ChallengeLostScene.Fucked,
				tooltip : eplus ? `Gwendy’s itching to fuck you again… you can see the equine monstrosity between her legs stirring.` : `Gwendy's itching to play with her toy again… with you on the receiving end.`,
			});
		}
		if (hangout) {
			return true;
		} else if (lossScene < options.length) {
			player.subDom.DecreaseStat(-100, 3);
			gwendy.subDom.IncreaseStat(100, 5);

			options[lossScene].func();

			gwendy.flags.ChallengeLostScene++;

			return false;
		} else {
			Text.Clear();
			Text.Add("<i>“Today, I'll be a kind mistress and allow my pet to choose [phisher] own humiliation,”</i> Gwendy tells you gracefully.", parse);
			Text.Flush();
			return true;
		}
	}

	function LossEatHerOut(hangout: boolean, first: boolean) {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;

		const pc = player.Parser;

		if (!first) {
			player.subDom.DecreaseStat(-50, 1);
			gwendy.subDom.IncreaseStat(50, 2);
		}

		Text.Clear();
		if (hangout) {
			Text.Out(`“Mm… say no more.” Gwendy gives you a sultry smile, caressing your body as she slowly pushes you back towards her bed. You let her push you over onto your back, watching her hungrily as she teases her pants down her hips, revealing her soaked panties.`);
		} else {
			if (first) {
				Text.Out(`“I’m starting to think that you’re losing on purpose, ${pc.name},” Gwendy purrs, eyeing you with a hungry look on her face. “Not that I mind… we are going to have some fun.”

				You gulp nervously, but can’t deny there’s a sense of excitement in submitting to the farmer’s whims. She’s shown that she can be a relentless tease, but something tells you she’s not going to stop short this time. Throwing you a smoldering look over her shoulder, she curls her finger, commanding you to follow her back to the loft. You follow, mesmerized by the sway of her hips.`);
			} else {
				Text.Out(`“Can’t get the taste of me out of your head, huh?” Gwendy pulls you close, filling your nostrils with the sweet smell of her sweat. “I’m starting to doubt your dedication to doing actual work… but luckily for you, I'm a generous mistress who’s willing to indulge my naughty little farmhand in their fantasies.”

				With that, she suddenly withdraws, imperiously motioning for you to follow her back to the loft. Hardly able to restrain yourself, you set out after the sassy farmgirl.`);
			}
			Text.NL();
			Text.Out(`Before you know it, you find yourself in the farmer’s personal quarters, heart catching in your throat as Gwendy begins to shrug out of her pants. You hurriedly follow suit, but stop as you catch her amused look. “Getting ahead of ourselves, aren’t we?” She slides up next to you, ${gwendy.Height() + 10 < player.Height() ? "trailing" : "raising"} your chin with the tip of her finger. You can feel her hot breath against the ${pc.skin} on your neck as she leans in for a tantalizing kiss… and then you feel the floor falling out from you as she pushes you over on your back onto her bed.`);
		}
		Text.NL();
		Text.Out(`“You just stay right there…” The bed creaks when she steps onto it, her head almost brushing against the low ceiling as she towers over you, hands on her hips and feet planted on each side of your upper body. She lightly places a foot `);
		if (player.HasBreastsBiggerThan(BreastSize.Small)) {
			Text.Out(`between your ${pc.breasts}`);
		} else {
			Text.Out(`on your flat chest`);
		}
		Text.Out(`, slowly tracing it down towards your ${pc.belly}. Your gaze trails up her long, bared legs, lingering on the wet patch soaking through her panties, up her toned stomach and the swell of her breasts, barely contained by the knot of her loose shirt. The confident smile on her face as she looks down on you sends shivers down your spine; she’s got you under her thumb, exactly where she wants you.

		“Gonna need these out of the way. Be grateful for the show, ${pc.name}.” Gwendy smirks coyly while slowly teasing her panties off, pulling them down her legs and caressing herself at the same time. “Mmm… I’ve gotten myself a bit worked up, it seems,” she huffs, dipping her fingers into the damp cleft of her exposed pussy. You watch enraptured as she lifts her hand to her lips and gives it a sultry lick. “Don’t worry, I’m not leaving you out of this. Lean back against the pillows… let me get comfortable…” The farmer sinks down to mount your chest, knees resting besides your head. Her wet sex is just a few inches from your ${pc.face}, and it’s getting closer…

		“Look at me.” At the command, you dutifully raise your gaze to lock eyes with her as she lowers her nethers to your ${pc.lips}, sharing a naughty kiss. “Lick.” Gwendy looks practically radiant as she bites down on her lower lip, a deep blush on her face as she grinds against you insistently. Needing no further urging, you let your ${pc.tongue} go to work on her.`);
		Text.NL();

		Sex.Cunnilingus(player, gwendy);
		gwendy.Fuck(undefined, 2);
		player.Fuck(undefined, 2);

		const scenes = [`As you start eating her out, the farmer caresses one of her heaving breasts, roughly kneading it through the fabric of her shirt and giving you the occasional glimpse of her nipple.`];
		if (player.HasHair()) {
			scenes.push(`As you start eating her out, the farmer leans down to caress your ${pc.hair}, ${pc.longhair("running her fingers through your strands", "petting you fondly")}. Before long, the caress becomes firmer, dominantly guiding you as she rides your face.`);
		}
		Text.Out(_.sample(scenes));

		Text.Out(` “Just like that… mm… work that tongue in there… ahh!” You feel her thighs brush against the sides of your head, leaving you well and truly trapped and making it clear that you’re not getting out of this until she’s had her fill… something that might take a while.

		It’s a few minutes of relentless grinding later that she finally allows you to resurface for a moment’s respite. You draw in a gasping breath, your senses still filled with the sweet smell and taste of her, but your rest is short lived. Looking up, you find that Gwendy has repositioned herself, and you’re faced with her looming butt. “C’mon, get back in there, ${pc.mfFem("cowboy", "cowgirl")}… I’m far from done with you.” You sink your ${pc.hand}s into the soft flesh of her ass, groping her while you eagerly resume your task, once again dipping your ${pc.tongue} deep into her tasty honeypot. She arches her back in pleasure, giving you a prime view of her lower back tattoo.

		For a while, the farmer is content to enjoy herself at your expense - after all, ${hangout ? "you asked for this" : "she’s earned the right to"} - but she’s not one to let herself remain idle for long. You hear a rustle and feel an insistent tugging at your ${pc.botarmor}, and before you know it she’s bared your ${pc.gen}.`);
		Text.NL();

		// Get biggest cock or horsecock
		const { cock, bigcock, horsecock } = _GetHorsecockBigcock(player);
		player.SetPreferredCock(cock);

		// Horsecock or 14"+ cock
		if (horsecock || bigcock) {
			Text.Out(`“Mmm… now there’s a treat and a half… you’re hung like a stallion.” You can almost hear her mouth salivating at the sight of your ${pc.cock}. “I… might give you a hand with that… later.” She gives your shaft a firm squeeze. “For now… stay focused. If you’re good, I might decide to… mmh… reward your efforts.”`);
			if (player.HasBalls()) {
				Text.Out(` Her hand trails further down, caressing the swell of your ${pc.balls}.`);
			}
			Text.NL();
			Text.Out(`The farmgirl starts slowly pumping your ${pc.cock}, now and then bending down to give the ${pc.cockTip} a light kiss. Despite her apparent cock hunger, she keeps her touches light, never letting you cum.`);
		} else if (cock) {
			Text.Out(`“Looks like someone is a little pent up,” she huffs, trailing a teasing finger down your rigid ${pc.cocks}. “If you show a bit more… unf… enthusiasm, I might relent and help you out, aye?” Despite your increased efforts, she doesn’t uphold her coy promise, letting her light touches taunt and keep you on the edge, but never letting you cum.`);
		} else if (player.FirstVag()) {
			Text.Out(`“Looks like I’m not the only one sopping wet… bet you’d like someone to take care of this for ya,” she taunts, giving your ${pc.vag} a playful swat. You whimper meekly as she starts toying with you, though she never uses her tongue or lets her fingers penetrate you.`);
		} else { // Fallback
			Text.Out(`“Smooth like a doll…” She gives your crotch a playful swat. “Don’t beat yourself up too much over it… even if you were packing something down there… unf… this time, <b>you</b> are servicing <b>me</b>.”`);
		}
		Text.NL();
		Text.Out(`After a while, her stream of teasing taunts becomes more and more strained, until she drops it entirely, leaving only her labored breaths to accompany the lewd sounds of your licking. Gwendy grows more and more enthusiastic as she nears her climax, roughly bucking her hips as she rides your ${pc.face}. Finally, you can feel her pussy convulsing, filling your mouth with her sweet nectar.`);
		Text.NL();

		const cum = gwendy.OrgasmCum();

		Text.Out(`Some time later, the two of you are cuddling on her bed in the aftermath of her orgasm. She leans over to nuzzle against the side of your face. `);
		if (hangout) {
			Text.Out(`“That was quite a bit of fun, ${pc.name}. I wouldn’t mind doing that again some time.” She gives your ${pc.butt} a playful slap. “Right now, I’ve done enough loafing around. Off you go, I got work to do.”`);
		} else {
			Text.Out(`“I can’t wait for when you attempt to challenge me again,” she whispers to you, fondly caressing your ${pc.skin}. “I’ll have something even more fun in store when you lose to me next time.”`);
		}
		Text.NL();
		Text.Out(`She slides off the bed and walks over to her mirror to fix her hair, still nude from the waist down. You hurriedly restore your ${pc.botarmor} and bid farewell to the farmgirl.`);
		player.AddLustFraction(0.5);
		Text.Flush();

		TimeStep({hour: 1});

		Gui.NextPrompt();
	}

	export function _GetHorsecockBigcock(ent: Entity) {
		// Get biggest cock or horsecock
		const cocks = ent.AllCocks();
		let cock: Cock;
		let horsecock: boolean;
		for (const c of cocks) {
			if (cock === undefined) {
				cock = c;
			}
			const isBigger = c.Len() > cock.Len();
			if (c.race.isRace(Race.Horse)) {
				if (!horsecock || isBigger) {
					cock = c;
				}
				horsecock = true;
			} else if (isBigger) {
				cock = c;
			}
		}

		let bigcock: boolean;
		if (cock && cock.Len() >= 28) {
			bigcock = true;
		}

		return { cock, bigcock, horsecock };
	}

	export function _DDildoOdds(subdomDiff: number, hasCock: boolean) {
		let ddildo: boolean;
		const table = new EncounterTable();
		if (subdomDiff < 50) { subdomDiff = 0; }
		table.AddEnc(() => {
			ddildo = true;
		}, subdomDiff);
		if (hasCock) {
			table.AddEnc(() => {
				ddildo = false;
			}, 100 - subdomDiff);
		}
		table.Get();
		return ddildo;
	}

	function LossRide(hangout: boolean, first: boolean) {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;

		const pc = player.Parser;
		const c = new GP.Plural(player.NumCocks() > 1);

		// Get biggest cock or horsecock
		const { cock, bigcock, horsecock } = _GetHorsecockBigcock(player);
		player.SetPreferredCock(cock);

		const eplus = gwendy.EPlus();
		const dOdds = gwendy.SubDom() - player.SubDom();
		const ddildo = _DDildoOdds(dOdds, cock !== undefined);
		const dildoFirst = ddildo && !gwendy.UsedDDildo();

		if (!first) {
			const diff = ddildo ? 2 : 1;
			player.subDom.DecreaseStat(-75, diff);
			gwendy.subDom.IncreaseStat(75, 2 * diff);
		}

		Text.Clear();
		if (hangout) {
			Text.Out(`“Getting greedy, aren’t we?” Gwendy purrs as she leans into you, her hands trailing your body possessively. “I’m a gal who’s always up for some more fun, but I don’t want you getting the wrong impression.” `);
			if (horsecock || bigcock) {
				Text.Out(`She pushes her hand against the sizable bulge in your ${pc.botarmor}, caressing the outline of your ${pc.cock}. “I’m gonna give this bad boy some lovin’, and you’re going to lie back and take it, got it? We are not done here until I say we’re done.”`);
			} else if (cock) {
				if (ddildo) {
					Text.Out(`She rubs a hand against your crotch, brushing up against your ${pc.cock} through your ${pc.botarmor}. Gwendy gives you a wicked grin. “If you think I’ll allow you to use this, you are in for some disappointment.” She leans in closer, whispering tauntingly in your ${pc.ear}: “Come back with something more impressive if you want me to even consider it.”`);
				} else {
					Text.Out(`She rubs a hand against your crotch, brushing up against your ${pc.cock} through your ${pc.botarmor}. Gwendy gives you a disappointed, teasing pout. “You have some nerve wanting to pleasure me with something like this… I'm debating bring out one of my toys instead… but I guess you’ll do for now.”`);
				}
			} else {
				Text.Out(`She rubs a hand against your crotch, brushing against your ${pc.gen} through your ${pc.botarmor}. “How do you want to do this… Do you have your own toys…? No, never mind. I’ll bring mine. I know just the one; I bet you’re going to like this a lot…”`);
			}
			Text.NL();
			Text.Out(`With that, she gives you a sharp slap on your ${pc.butt}, pointing you in the direction of the bed. “I want you naked and ready. You don’t wanna keep me waiting.” You hurriedly comply and lie down on the bed while the farmer discards her own clothes in a leisurely manner.`);
		} else {
			if (first) {
				Text.Out(`Gwendy gives you a predatory grin as you count the tally. Predictably, she’s won yet again.

				“You’re such a tease… you just keep pushing me to see how far I’ll go, don’t you?” The farmer gives you a smoldering glare. “Be careful, my patience with your cockiness is wearing thin. I have some thoughts on what I’ll do if you challenge me and lose again, something I’m sure you’d <b>love</b>… but for now, I’m gonna use you good.”

				Gesturing imperiously, she calls you to follow her back to the loft, hips swaying seductively. There are some grins and envious looks from the other farm hands as she leads you along. They no doubt suspect what’s going on between the two of you - Gwendy hasn’t exactly been secretive about her little victory celebrations.`);
			} else {
				Text.Out(`“Think your stamina will hold out better than last time?” Gwendy grins, giving you a friendly jab in the side. “Don’t think I’ll go easy on you just ‘cause we’ve been working all day; I’ve still got plenty left in me… and I’m gonna release a bit of pent up stress with you.” With that, she tugs you along back to the loft in the rafters of the barn, teasing you all the way.`);
			}
			Text.NL();
			Text.Out(`Once you’ve climbed up the ladder to the farmer’s cramped living space, she turns to you, hands on her hips. “Now… let’s see what I’ve got to work with.” Raising her chin and giving you a smirk, she gives her order: “Strip down. All of it.”

			You gulp, but also feel a bubbling sense of excitement. Under Gwendy’s possessive gaze, you slowly remove your gear until you’re wearing nothing more than your ${pc.skin}. You blush as her eyes roam your body, coming to rest on your ${pc.gen}. ${eplus ? "There’s a distinct growing bulge in the farmer’s pants, suggesting she very much likes what she sees. " : ""}She gives you a knowing smile.`);
			Text.NL();
			if (horsecock || bigcock) {
				Text.Out(`“Mm… that’s a juicy looking cock you have there, ${pc.name}.” Gwendy coos, licking her lips hungrily. “I think I’ll have a little taste before we move on… but first, let me get out of these pesky clothes. Lie down on the bed and enjoy the show.”`);
			} else if (cock) {
				if (ddildo) {
					Text.Out(`“Oh baby… that just won’t do.” Gwendy gives you a wicked smile, shaking her head as she disparages over your ${pc.cocks}. “I’m used to bigger, and I’m not going to settle for second rate… but don’t worry, you’re still going to pleasure me - just not with that. I’m going to go and fetch something… You. Bed. Now.” She gestures imperiously before starting to undo her belt.`);
				} else {
					Text.Out(`“Hmm… I guess you’ll do.” Gwendy throws you a teasing smile. “I’m used to bigger, but I’m not about to give up my prize just because it’s slightly disappointing. I’m gonna get out of these pesky clothes… why don’t you go and wait on the bed.”`);
				}
			} else {
				Text.Out(`“Don’t worry, I’m going to get you something to work with,” Gwendy promises, giving you a wink, hand trailing down your nubile form in a loving caress. “I think you may even end up enjoying it as much as I will… but enough stalling. Get on the bed.”`);
			}
			Text.Out(` Obeying her, you settle down on the soft sheets, excitement building as you raptly watch her disrobe.`);
		}
		Text.NL();
		if (eplus) {
			Text.Out(`You gulp as the well-endowed farmgirl shrugs out of her pants, her massive member flopping out to dangle down to her knees. Though it’s already grown to an impressive length, she’s still only half hard.

			“See something you like, ${pc.name}?” Gwendy asks huskily, giving you a sultry smirk as she slips out of the rest of her clothes. “Don’t worry, you’re safe… for now.” Her cock twitches in protest, having quite different ideas in mind.`);
		} else {
			Text.Out(`Gwendy shrugs out of her pants and panties, tugging them down her long, freckled legs. With a practiced movement, she frees her heavy breasts from their confinement. Watching them heave with her labored breathing is intoxicating, and it only gets more so as the farmer starts feeling herself up.

			“That’s right, drink it all up,” she teases you as she touches herself. “I can’t wait to get started with you.”`);
		}
		Text.NL();

		if (ddildo) {
			gwendy.flags.Toys |= GwendyFlags.Toys.DDildo;
			Text.Out(`Gwendy strides past you to a chest set against one of the walls. She bends over to rummage around in it, giving you an enticing view of her soft, bobbing buttocks and the wet patch of her snatch nestled between them.${eplus ? " Your eyes travel further down, coming to rest on her massive balls and turgid horse dong dangle, its flared head crowned by a bead of thick pre." : ""}

			When she reemerges, the farmer is proudly cradling a ridiculously long, double-ended equine dildo. “${dildoFirst ? "I don’t get to use this often, but I have a feeling you’ll be seeing it a lot more from now on…" : "Remember this bad boy?"} I hope you can take it.” She smiles wickedly. “After all… half of this is going into you.” You gulp nervously as she stalks toward you, a dildo the size of a two handed club in her arms.`);

			// BAILOUT ENTRYPOINT
			if (gwendy.flags.Bailout < GwendyFlags.Bailout.Resolved && dildoFirst) {
				Text.Flush();

				const options: IChoice[] = [
					{ nameStr: "Bail", func: () => {
						Text.Clear();
						Text.Out(`Nope. You didn’t sign up for this.`);
						Text.NL();
						if (hangout) {
							Text.Out(`You are haunted by her laughter as you quickly grab your gear and jump down to the floor below, startling a few animals as you crash onto a haystack. Spitting straws, you run outside without looking back, only pausing to put on your ${pc.armor} once you’ve put a fair distance between yourself and the barn.

							…Maybe it would be prudent to be a bit more careful with letting the farmer have her way in the future.`);
							Text.Flush();

							Gui.NextPrompt(() => {
								MoveToLocation(WORLD().loc.Farm.Fields, {minute: 30});
							});
						} else {
							Text.Out(`“Someone’s a sore loser,” Gwendy comments, sounding rather annoyed as you hurriedly put your ${pc.armor} back on. You turn to throw her an apologetic glance, but something about the farmer makes your blood run cold. Her gaze is frosty as she observes your scurrying, one hand on her hip while the other holds the massive equine dildo casually slung over her shoulder. Worst of all is her <i>smile</i>. Something tells you that you’ve not heard the last of this.

							You make your excuses and leave the loft, the ghost of her smile haunting you long after you’ve left the farm behind.`);
							Text.Flush();

							gwendy.flags.Bailout = GwendyFlags.Bailout.Slip;

							Gui.NextPrompt(() => {
								MoveToLocation(WORLD().loc.Plains.Crossroads, {minute: 30});
							});
						}
					}, enabled: true, tooltip: "Nope, nope, nope. Get out of here!"},
					{ nameStr: "Stay", func: () => {
						Text.Clear();
						Text.Out(`You somehow can’t bring yourself to move. Blushing, you resign yourself to what she has planned for you.`);

						gwendy.flags.Bailout = GwendyFlags.Bailout.Submit;

						LossRideEntrypoint({
							first, hangout, eplus,
							ddildo, dildoFirst, dOdds, bigcock,
							cock,
						});
					}, enabled: true, tooltip: "Those lust-filled eyes of hers keep you pinned just where you are. You can’t move… or is it that you don’t want to?"},
				];
				Gui.SetButtonsFromList(options);
			} else {
				LossRideEntrypoint({
					first, hangout, eplus,
					ddildo, dildoFirst, dOdds, bigcock,
					cock,
				});
			}
		} else { // Regular scene, ride PC cock
			Text.Out(`The bed creaks as Gwendy steps onto it, her blonde hair almost brushing against the low rafters as she looms over your prone form, hands on her hips. You draw a surprised breath as she traces the length of your ${pc.cock} with the sole of her bare foot, pinching and teasing it with her toes. ${player.HasBalls() ? `She lightly puts weight on your ${pc.balls}, further cementing her absolute control over you. ` : ``}Your ${pc.cocks} ${c.isAre} stiffening under her delicate teasing, jutting up ${bigcock ? `proudly` : `hopefully`} from your crotch by the time she withdraws her foot.`);
			Text.NL();
			if (horsecock || bigcock) {
				Text.Out(`“Mm… almost ready for me.” The farmer sinks to her knees on the bed, trailing her tongue${player.HasBalls() ? ` from your ${pc.balls} and` : ``} up${c.plural(` the biggest one of`, ``)} your cock${c.s}, playfully licking the ${pc.cockTip}. She keeps teasing you with her mouth and fingers for a few minutes, but by the time she’s pushed you close to the edge, the girl stops. She gently but firmly presses your shaft down against your ${pc.belly}, holding it down with the palm of her hand.

				“I’m gonna savor this. You just lie back for now…” Stradling you, Gwendy lets her other set of lips have a taste of you. Sighing contently, your lover drags her wet cunt caress your turgid length from root to stem, ${eplus ? `her own equine member rubbing against your ${pc.face} as she nears its apex, filling your nostrils with her musk` : `coating it liberally with her juices`}. You moan happily as she uses you, relentlessly teasing your ${pc.cock} until a bead of your sticky pre mounts its twitching crown.

				“Don’t blow your load already now,” she taunts you. “You’re not allowed to cum until I tell you so… and if you still do before I’ve had my fill… well, don’t expect me to be lenient with you just because of that.” With that warning expressed, the farmer slowly rises, dragging her nether lips along the length of your ${pc.cock} until its ${pc.cockTip} comes to rest against the entrance to her pussy. You both stifle a grunt as she presses down, spearing herself onto your dick.`);
			} else {
				Text.Out(`“Bet you’d love to fuck me, wouldn’t you?” the farmer teases you, sinking to her knees and letting the ${pc.cockTip} of${c.oneof} your ${pc.cocks} play against the enticing lips of her pussy. “Well, you’re going to, but it’ll be on <b>my</b> terms, and until <b>I’m</b> done with you.” She emphasizes her statements by pressing her cunt against your member, never quite letting you penetrate her.

				“You know you’re lucky that I’m allowing this, don’t you?” she breathes, tantalizing opening hovering just beyond your reach. You nod.

				“You know that I’ve toys twice your size that could fill me much better, don’t you?” You reluctantly give her a nod, blushing deeply.

				“Beg for it.”

				You comply.

				“Good ${player.mfFem(`boy`, `girl`)}.” Having teased you enough, she pushes down on your ${pc.cock}, her hungry nether lips swallowing you whole in one smooth motion. She grinds against your hips, moaning softly as she lets you get a feel of her insides. Wasting no time, she pulls herself up again until only the the ${pc.cockTip} remains inside her.`);

				player.subDom.DecreaseStat(-50, 1);
				gwendy.subDom.IncreaseStat(50, 1);
			}
			Text.NL();

			Sex.Vaginal(player, gwendy);
			player.Fuck(cock, 3);
			gwendy.FuckVag(gwendy.FirstVag(), cock, 3);

			Text.Out(`“Ready or not, I’m gonna start moving now. Better hold on to something.”`);
			// TODO #set $cock = pc pref cock

			LossRideMerge({
				first, hangout, eplus,
				ddildo, dildoFirst, dOdds, bigcock,
				cock,
			});
		}
	}

	interface ILossRideData {
		first: boolean;
		hangout: boolean;
		eplus: boolean;
		flip?: boolean;

		ddildo: boolean;
		dildoFirst: boolean;
		dOdds: number;
		bigcock: boolean;

		cock: Cock;
		target?: () => string;
		targetObj?: Orifice;
		targetVag?: boolean;
	}

	function LossRideEntrypoint(opts: ILossRideData) {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;

		const pc = player.Parser;

		const { first, hangout, eplus,
			ddildo, dildoFirst, dOdds, bigcock, cock } = opts;

		let flip: boolean;
		let target: () => string;
		let targetObj: Orifice;
		let targetVag: boolean;

		Text.NL();

		const scenes = [() => {
			flip = true;
			Text.Out(`“Mm… so sexy, so vulnerable…” Gwendy murmurs as she trails a hand down your ${pc.breasts}, over your ${pc.belly} and to your crotch. ${cock ? `The farmer gives your ${pc.cocksandballs} a teasing squeeze, a taunting reminder that ${player.NumCocks() > 1 || player.HasBalls() ? "they" : "it"} won’t be getting any more attention from her.` : `The farmer gives you a teasing caress before withdrawing her fingers.`}

			“Roll over on your stomach,” she instructs. “Butt up. Good, just like that.” She gives your ${pc.butt} a slap, nudging you to fold your ${pc.knees} to further prop it up for her. Once she’s satisfied with your position, she spreads your cheeks apart, exposing your ${pc.anus}${pc.naga(` and ${pc.gen}`, ``)}. “Looks snug enough… not that it will remain so for long.” She teases your hole  lightly with her thumb, the shadow of a promise of what’s awaiting you.`);
		}];
		if (player.HasLegs()) {
			scenes.push(() => {
				Text.Out(`“Spread ‘em wide, this will take a little work.” Gwendy doesn’t give you much chance to protest as she sidles up against you, bumping up your ${pc.legs} and pinning her shoulder under one of your ${pc.knees}. You feel incredibly vulnerable as you feel her hand caress your ${pc.gen}, boldly groping you between your ${pc.legs}.

				You shift restlessly as she pushes her finger inside you, barely giving you time to adjust before she adds another. ${eplus ? `All the while, you can feel her dick rubbing against your ${pc.butt} - hot, turgid and still swelling. ` : ``}You grunt as she adds the fourth and final digit, working you relentlessly… not that anything she does to you now is going to come close to what she has planned for your immediate future.`);
			});
		}
		if (player.IsNaga() && player.FirstVag()) {
			scenes.push(() => {
				Text.Out(`Gwendy sits herself down on top of you, trapping your ${pc.legs} between her knees. “Squirm all you want, I’m not letting you go anytime soon,” she declares, letting her free hand trail down your ${pc.skin} to your crotch. Despite her order, you shift restlessly as she plays with your ${pc.gen}, dipping her fingers into your waiting depths. “Dripping and ready.” Your tail twitches feebly as the farmer thrusts her digits into you, all the while taunting you of how she’s going to use you for her own pleasure.`);
			});
		}
		_.sample(scenes)();

		Text.NL();
		Text.Out(`“Just a moment… I won’t keep ya waiting for long.” She withdraws, liberally coating the impressive length of her massive toy with the entire contents of a vial placed on the bed stand. Your lover presses one flared tip against her cleft, letting out a soft moan and biting down on her lip as she slowly starts feeding it inside herself. Though accepting the double ended equine fuck stick is a daunting task, the relative ease with which she’s able to take it in shows signs of frequent practice.`);
		Text.NL();

		Sex.Vaginal(undefined, gwendy);
		gwendy.FuckVag(gwendy.FirstVag(), ToysItems.EquineDildo.cock, 3);

		Text.Out(`${eplus ? "By this point, the farmgirl is fully hard, erect equine member jutting out proudly. For every inch that she eases inside herself, her cock bobs happily, splattering you and the bed equally with her salty pre. " : ""}Before long, Gwendy has accommodated enough of the toy to allow her to clamp down on it with her vaginal muscles, leaving roughly two thirds of it dangling between her legs menacingly. “Now, it’s your turn,” she proclaims, short on breath and freckled cheeks flush with excitement.

		She confidently shuffles closer, ${flip && player.HasTail() ? "lifting your ${pc.tail} to allow her access, " : ""}her hand guiding the remaining flared head to her target, your `);
		const targetScene = new EncounterTable();
		if (player.FirstVag() && (!flip || !player.IsNaga())) {
			targetScene.AddEnc(() => {
				targetVag = true;
				targetObj = player.FirstVag();
				target = () => pc.vag;
				Text.Out(`wet but woefully unprepared ${pc.vag}. “This is going to feel amazing,” she promises soothingly, teasing your cleft with the toy. “This lubricant will work wonders, it’s from my special stock. You just… have to… Let. Me. <b>In.</b>”`);
				Text.NL();
				Sex.Vaginal(undefined, player);
				player.FuckVag(player.FirstVag(), ToysItems.EquineDildo.cock, 3);
			}, 3);
		}
		if (flip || !player.IsNaga()) {
			targetScene.AddEnc(() => {
				targetObj = player.Butt();
				target = () => pc.anus;
				Text.Out(`puckered ${pc.anus}. “Hope you’re ready for this,” she murmurs, grinning wickedly as she teases your protesting opening. “This lubricant will work wonders, it’s from my special stock. You just… have to… Let. Me. <b>In.</b>”`);
				Text.NL();
				Sex.Anal(undefined, player);
				player.FuckAnal(player.Butt(), ToysItems.EquineDildo.cock, 3);
			}, 1);
		}
		targetScene.Get();
		Text.NL();
		const cap = targetObj.Cap();
		Text.Out(`Your ${pc.eyes} go wide and your voice fails you as she penetrates you, slowly but persistently pushing the massive artificial cock deeper inside your body. `);
		if (cap >= Capacity.gaping) {
			Text.Out(`Moaning with pleasure, you arch your back as the toy easily slips inside you, earning you a look of grudging respect from Gwendy. “${dildoFirst ? `Not your first rodeo, I take. Someone has trained you well.` : `You’re getting better at this, ${pc.name}. It took me quite a bit of practice to be able to take this bad boy, but you’re a natural.`}” Before long, the double ended dildo is firmly lodged inside your nethers, allowing for the farmer to start moving on top of you.`);
		} else if (cap >= Capacity.loose) {
			Text.Out(`You’re stretched so wide, and each agonizing second you feel more and more <i>full</i>, the toy probing and expanding your deepest depths. “${dildoFirst ? `Mm… you’re doing quite well for your first time with this bad boy, ${pc.name}. Only a few more inches to go…` : `You remember this feeling well, don’t you? Let me train your ${target()} more with this bad boy…`}” Gwendy takes it slow and keeps encouraging you with soft quips, but nevertheless the double ended dildo advances inexorably deeper into your ${target()}.`);
		} else {
			Text.Out(`The feeling is indescribable, and despite the copious amounts of lube, you have to bite down ${flip ? "on the pillow" : "on your lip"} in order to not cry out in pain. Seeing your distress, Gwendy withdraws the toy, giving you some time to recover before teasing the entrance to your ${target()} again. “${dildoFirst ? `Don’t worry, I’ll go slow, give you some time to get used to it.` : `So tight… but you’ve done this before, ${pc.name}, you will do it again.`}” With that, the farmer presses the lubed up toy lightly against your ${target()}, gaining a little more purchase each time she pushes it into your depths.

			By the time she has a good ten inches firmly lodged inside you, your ${pc.skin} is glistening with sweat and your breathing is ragged. Gwendy makes an experimental move, pulling herself a few inches up her end of the toy before slowly sinking back down again, exerting pressure on your filled-to-the-brim passage. It’s uncomfortable… but somehow no longer painful. The cool lubricant appears to have a somewhat numbing effect, besides granting your ${target()} unprecedented elasticity.`);
			TimeStep({minute: 30});
		}
		Text.NL();
		Text.Out(`“Ready or not, I’m gonna start moving now. Better hold on to something.” Your fingers tighten on the sheets as she tenses her legs, raising herself up until only the flared head of the double ended dildo remains inside her pussy.`);

		// TODO #set $cock = toy
		LossRideMerge({
			first, hangout, eplus, flip,
			ddildo, dildoFirst, dOdds, bigcock,
			cock, target, targetObj, targetVag,
		});
	}

	function LossRideMerge(opts: ILossRideData) {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;

		const pc = player.Parser;
		const c = new GP.Plural(player.NumCocks() > 1);

		const { first, hangout, eplus, flip,
			ddildo, dildoFirst, dOdds, bigcock,
			cock, target, targetObj, targetVag } = opts;

		Text.NL();
		Text.Out(`When she thrusts down, it almost drives the wind out of you. Now that she’s done teasing you, the farmer goes wild, riding you with abandon, hands planted on either side of your torso for support. Her unabashed, lust-filled cries can probably be heard for miles around - for certain, no one on the farm can be unaware of your activities by this point.`);
		Text.NL();
		if (ddildo) {
			Text.Out(`Each bucking thrust of her hips grinds your end of the massive double ended dildo deeper into your ${target()}, ${!targetVag ? (cock ? `the thick shaft massaging your prostate through your stretched anal walls` : `relentlessly stretching your bowels`) : `the flared tip bumping against the entrance to your womb`}. Gwendy’s fucking you, not the other way around, and you’re loving it. Not that she isn’t getting her own pleasure from this; the farmer’s eyes are closed in a perpetual state of bliss, and it’s no wonder: she’s riding the monster cock like a champ, each bounce taking roughly half of the toy inside her stretched pussy and coating it with her slick juices.`);
		} else if (bigcock) {
			Text.Out(`Despite your considerable size, Gwendy is taking you like a champ, rhythmically rising and falling on your ${pc.cock} without showing any signs of relenting. Most of your shaft is covered in her slick juices, and each bounce envelops you in her warm innards, eliciting a blissful grunt from your lover every time you bump against the entrance to her womb.`);
		} else {
			Text.Out(`Judging by the ease with which the farmer rides you - every bounce slams her hips into yours, bottoming out on your ${pc.cock} - the girl is used to far larger insertions. Not that she’s loose by any stretch; her warm vaginal walls cling to your shaft snugly, and if her expression is any tell, the girl appears to be getting her own fair share of pleasure out of it.`);
		}
		Text.NL();
		if (eplus) {
			Text.Out(`Gwendy’s enormous equine cock is twitching, overflowing with pre and eager to release her virile seed into a willing receptacle. Each thrust of her hips delivers a thick serving of dickgirl cum that splatters onto your ${flip ? `back` : `${pc.belly}, ${pc.breasts} and ${pc.face}`}, liberally coating your ${pc.skin}.`);
			Text.NL();

			let bj: boolean;
			const scenes = [() => {
				Text.Out(`Bottoming out on ${ddildo ? `her end of the toy` : `your ${pc.cock}`} and balancing herself with one hand on your ${flip ? `lower back` : `shoulder`}, the farmer starts grinding her pussy against you while using her free hand to jerk herself off. Her turgid bitch breeder is way too thick for her to encompass with her fingers, but with the pleasure from getting fucked, she doesn’t need much to push her over the edge.`);
			}];
			if (!flip && player.BiggestBreasts().Size() >= BreastSize.Medium) {
				scenes.push(() => {
					Text.Out(`“Mmm… got something for you to do, ${pc.name}.” The farmer leans in for a kiss, pressing her massive cock against you. As your lips lock and she greedily tongue fucks you, she reaches to pull your ${pc.hand} up to one of your ${pc.breasts}. “Press ‘em together… yeah, just like that…” Gwendy lines herself up between your ${pc.breasts} as you dutifully push them together, forming a fuck sleeve for her to use.`);
					Text.NL();
					if (bigcock || ddildo) {
						Text.Out(`Your lover alternates between bottoming out on ${ddildo ? `her end of the toy` : `your ${pc.cock}`} and rocking her hips forward, making your ${pc.breasts} bounce. The tip of her horsecock grinds against and leaves a sticky trail of pre across your ${pc.face} and forehead, and from the erratic pulsing of the turgid shaft, she’s not gonna last much longer.`);
					} else {
						Text.Out(`Your lover thrusts between your ${pc.breasts} with abandon, each back-thrust bringing her hips down on your crotch with a wet smack. Her cock leaves a sticky trail all across your front, lubing up your cleavage and splattering onto your ${pc.face}. You can tell that her climax is getting close, and it’s going to be a messy one.`);
					}
					Text.NL();
					Text.Out(`“F-fuck, so good…”`);
				});
			}
			if (!flip && bigcock) {
				scenes.push(() => {
					bj = true;
					Text.Out(`“Mmm… come on now, ${pc.name}, don’t leave a gal hanging… say aah…” The farmer’s intentions are clear. She shifts her weight forward, the flared head of her sticky cock rubbing against your ${pc.lips}, demanding entry. Giving in to her whims, you open your mouth, letting your ${pc.tongue} ${pc.longtongue(`unfurl and encircle`, `play across`)} her thick shaft. Her musky taste is heady, and you are relishing in it. “That’s it… now… <b>open wide</b>.” Your ${pc.eyes} go wide as she shoves her hips forward, feeding a good three inches of equine girlcock into your unprepared maw. Already, she’s nudging the entrance to your gullet insistently, and she has plenty more to give.`);
					Text.NL();

					Sex.Blowjob(player, gwendy);
					gwendy.Fuck(gwendy.FirstCock());
					player.FuckOral(player.Mouth(), gwendy.FirstCock());

					Text.Out(`Soon, your jaw is aching from her back-and-forth throatfucking. Each downthrust brings pleasure in the form of her hips slamming down on ${ddildo ? `her end of the double ended dildo, jostling your nethers` : `your ${pc.cock}`}, but it’s inexorably followed by several inches of horsecock being forced down your esophagus. It’s all you can do to hang on and take it. Thankfully, from Gwendy’s increasingly erratic moans, she’s not going to last much longer.`);
				});
			}
			Text.NL();
			Text.Out(`The farmer lets out a ragged gasp, a shiver running through her that you can feel through ${ddildo ? `the toy connecting you together` : `her cunt clamping down on your ${pc.cock}`}. With a wild buckle of her hips, she lets loose her pent up ejaculate, ${bj ? `flooding your mouth with` : `hosing you down in`} white, sticky nut batter. It takes almost a full minute for her to come down from her high, continuous tremors through her member depositing more and more of the contents of her balls ${bj ? `into your swelling tummy` : `over you and the bed`}. Finally, she tosses her hair back, wiping a mixture of sweat and cum from her brow${bj ? `. You cough and sputter, drawing ragged breaths as she dislodges her cock from your throat` : ``}. She grins wickedly as she lightly shifts her loin, sending a burst of pleasure through your sensitive nethers.`);
		} else {
			Text.Out(`The farmer is tireless, barely pausing as her hips quiver with her first climax. She cries out, sweat-slick body trembling as she rides it out, but there’s still plenty of fire left in her. After leaning down to give you a fierce kiss, your lover flips her leg, twisting around until she’s ${flip ? `facing you ass-to-ass, the two of you connected by her massive double-ended toy` : `riding you reverse cowgirl`}.

			“‘Nough resting, I’m far from done with you, ${pc.name}.” True to her words, Gwendy slams her ass ${flip ? `back` : `down`} on ${ddildo ? `the equine dildo` : `your ${pc.cock}`}, barely giving you time to recover before she shifts back into full gear. Before long, you can feel your own climax approaching, ${ddildo ? `forced out by the massive toy spearing your ${target()}` : `coaxed out by her pussy clamping down on you`}. You moan loudly, hips buckling as the wave hits you.`);
			Text.NL();

			const cum = player.OrgasmCum();

			if (ddildo) {
				Text.Out(`Your ${target()} constricts on your end of the double ended horsecock, your walls clamping down tightly and convulsing uncontrollably on the massive toy. `);
				if (cock) {
					Text.Out(`Your ${pc.cocks} fire${c.s} off ${c.itsTheir} load, which splatters uselessly ${flip ? `onto the sheets` : `all over your ${pc.belly} and ${pc.breasts}`}, your sperm fruitlessly seeking a womb it will never find. `);
				}
				if (player.FirstVag()) {
					Text.Out(`You groan as your ${pc.vag} starts leaking with your girly juices${player.HasLegs() ? ` between your ${pc.legs}` : ``}, afire with blissful pleasure. `);
				}
				Text.Out(`Eyes refocusing, you see Gwendy grinning at you in the dim light.

				“Looks like I’m not the only one enjoying this bad boy… have you fallen in love, ${pc.name}?” You answer with a non-committal whimper. “I’m afraid he’s taken… but I’m sure we can work something out, don’t you think?” A light nudge of her hips forces out a weak moan from you.`);
			} else { // PC has cock
				Text.Out(`Your ${pc.cock} gives a final twitch before depositing your cum into the farmer’s waiting pussy, causing you to arch your back and buck your hips into your lover. `);
				if (player.NumCocks() > 1) {
					const c2 = new GP.Plural(player.NumCocks() > 2);
					Text.Out(`Your free cock${c2.s} spew${c2.notS} out ${c2.itsTheir} load onto your ${pc.belly} and all over Gwendy’s front, coating her from tits to tummy. `);
				}
				if (cum >= CumLevel.Mid) {
					const b = new GP.Plural(player.HasBalls());
					Text.Out(`Your ${pc.balls} ${b.hasHave} plenty to give, churning as you deposit wave after wave of potent baby batter inside her. `);
				}
				Text.Out(`Utterly spent, you collapse onto your back, breathing heavily.

				“Mmm… so warm… someone was a bit pent up…” Gwendy slowly pulls herself off your ${pc.cock}, your love juices trailing down the inside of her leg. `);
				if (cum < CumLevel.Low) {
					Text.Out(`“Hope there’s more where that’s coming from…”`);
				} else if (cum < CumLevel.Mid) {
					Text.Out(`“M-more than a bit…” She reaches down between her legs, scooping up a bit of your cum and bringing it to her lips. “Delicious.”`);
				} else {
					Text.Out(`“S-so much… wow… I feel so full…” A massive glob of your sticky load splatters down on the sheets, and by the swell on her tummy, there’s still plenty more lodged inside her.`);
				}
				Text.NL();

				const subby = _DDildoOdds(dOdds, true);

				if (subby) {
					Text.Out(`You’re vaguely aware of Gwendy moving around on top of you, still coming down from your high. You blink as you feel a splatter of something wet and sticky landing on your ${pc.face}. Looking up, you see your lover stradling you, her freshly-fucked vag looming over you, still leaking with your spooge.

					“Feels like it’d be greedy of me to… aah… keep such a treasure to myself, don’t ya think?” The farmer has a wicked grin on her face as she lowers herself down, grinding her cum-filled cunt against your mouth. With your head trapped between her thighs, you’ve little choice but to do as she says and lap it up, the salty taste of your sticky climax heavy on your taste buds. Finally, she relents, flipping around to face you again and giving you a sloppy kiss. “What goes around cums around… mhm… tasty.”`);
					Text.NL();
				}
				Text.Out(`Dragging her pussy over your ${pc.cocks}, Gwendy slowly coaxes you back to hardness, teasing your ${pc.cockTip} with her sticky sex.`);
			}
			Text.Out(` The farmer gives you a minute to gather yourself, but it’s not long before she starts moving again.`);
		}
		Text.NL();
		Text.Out(`“${_.sample([
				`Mmm… didn’t think… I was done, did you?`,
				`Hope you’re… hah… ready for round two, ${pc.name}.`,
				`I’m not spent yet… hah… not by far. I hope you’re not either.`,
				`Aah… I really needed that… but we’re just getting started, ${pc.name}.`,
				`Don’t you look a… hah… sticky mess… but I think I can do better.`,
			])}” Not waiting for a reply, Gwendy wastes no time resuming her energetic riding, her boundless stamina showing no signs of depleting. All you can hope to do is grab onto the stained sheets and endure… it looks like you’re going to be here for a while.`);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();

			const cum = player.OrgasmCum(3);

			Text.Out(`It’s more than two hours and multiple orgasms later that the farmer finally calls it quits, collapsing on top of you in blissful stupor. Your entire body aches, and you’re decidedly spent from the wild ride.`);
			Text.NL();
			if (ddildo) {
				Text.Out(`With a slow, lewd ‘slop’, the equine double dildo slides out of Gwendy’s well-used snatch, leaving it gaping. The girl nuzzles up against you, leaning down to free the other end from your stretched ${target()}.

				“${dildoFirst ? `Ya took it like a champ, ${pc.name}. Hope ya want to try this again sometime… I sure would` : `Mmm… not many that can say they can take this bad boy and walk properly afterwards… you make me proud, ${pc.name}`}.” You wince. You’re going to be feeling this one for a while.`);

				if (targetObj.capacity.IncreaseStat(8, .5)) {
					Text.NL();
					Text.Add(`<b>Your ${targetVag ? `pussy` : `butt`} feels slightly stretchier.</b>`);
				}
			} else {
				Text.Out(`With a lewd ‘slop’, your ${pc.cock} slides out of her stretched pussy, `);
				if (cum < CumLevel.Low) {
					Text.Out(`the residue from your numerous orgasms lazily pouring out onto the sheets.`);
				} else if (cum < CumLevel.Mid) {
					Text.Out(`letting out a spurt of dammed up cum which pools on the sheets.`);
				} else {
					Text.Out(`a deluge of your cum flowing onto the sheets following it. There’s a distinct swell visible on the farmer’s stomach from the sheer amount she’s milked from you.`);
				}
				Text.Out(` ${eplus ?
					`Gwendy’s own cock gives a feeble twitch against` :
					`Gwendy shivers happily, softly trailing her fingers down`} your ${pc.belly}. “${bigcock ? `Nothing quite like a good fuck… mhm… this ache in my loins is the best…` : `Not bad… I might give you a go again sometime.`}” The farmer gives you a weak smile, snuggling up against you.`);
			}
			Text.NL();
			Text.Out(`The two of you remain like that for a while, too exhausted to do much more than cuddle.`);
			Text.NL();
			if (hangout) {
				Text.Out(`“Well… I guess all this is going to the laundry bin,” Gwendy scratches her head, surveying the utter mess the two of you have made of the bed. “I think I’ll be busy for a while. Be seeing you, ${pc.name}.”

				You put on your clothes and spend some time helping her with the cleanup before you part ways.`);
			} else if (first) {
				Text.Out(`As you restore your clothing and gear, you can’t help but wonder: If this is Gwendy’s idea of a casual romp, what are those ‘special plans’ of hers for your next loss going to be like? You’re not sure that finding out is going to be good for your health.`);
			} else {
				Text.Out(`Still a bit shaky, you start restoring your clothing and gear as Gwendy surveys the mess the two of you created of the bed. “I think I might have gone a bit overboard again.”

				Maybe a tad.`);
			}

			Text.Flush();

			TimeStep({hour: 3});

			if (eplus || cum >= CumLevel.Mid) {
				gwendy.cleanTimer = new Time(0, 0, 1, 0, 0);
			} else {
				gwendy.cleanTimer = new Time(0, 0, 0, 6, 0);
			}

			Gui.NextPrompt(() => {
				MoveToLocation(WORLD().loc.Farm.Barn);
			});
		});
	}

	// TODO look over logic
	export function _SexExperience(player: Player) {
		const courtesan = player.flags.startJob === JobEnum.Courtesan;
		return {
			sexSlut: player.sexlevel >= 5,
			sexMid: player.sexlevel >= 3 || courtesan,
		};
	}

	export function LossGetFucked(hangout: boolean, first: boolean) {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;

		const pc = player.Parser;

		const eplus = gwendy.EPlus();

		if (!first) {
			player.subDom.DecreaseStat(-100, 2);
			gwendy.subDom.IncreaseStat(100, 3);
		}

		Text.Clear();
		if (hangout) {
			Text.Out(`“Ya want another good fucking? Well…” Gwendy leans into you, trailing a hand down your body and coming to rest on your ${pc.hip}. “...Just so happens, I’m in a raunchy mood myself.” She playfully slaps your ${pc.butt}. “You know the drill… get out of those clothes, gimme a show.” The farmer herself sits down in a wooden chair, legs folded as she imperiously gestures for you to get started.`);
		} else {
			if (first) {
				Text.Out(`“My my… I win again, don’t I?” Gwendy gives you a shark-like grin. “Now… I hope you haven’t forgotten my promise to prepare something <b>special</b> for you the next time you inevitably lost. Any thoughts on what that might be?”`);
				Text.NL();
				if (player.SubDom() >= 60) {
					Text.Out(`You glare at her, still defiant even though you lost.

					“That’s the spirit!” The farmer chuckles. “This is going to be so much fun, ${pc.name}… we’ll see how long you can keep up that composure.” She gives your neck a caress as she locks eyes with you. “Clearly, breaking you will be tough… but you know I <b>love</b> a challenge.”`);
				} else if (player.SubDom() >= 10) {
					Text.Out(`You shake your head, though you have a rather uneasy feeling in the pit of your stomach. Considering the kind of things she usually comes up with…

					“Why the worried face, ${pc.name}?” The farmer flutters her eyelashes at you innocently. “I promise I won’t do anything that I’ll regret…”

					That’s not very reassuring.`);
				} else if (player.SubDom() >= -40) {
					Text.Out(`You mumble that you don’t. There’s something rather concerning about the hungry way that she’s eyeing you, as if she’s sizing up a piece of meat.

					“Don’t worry, ${pc.name}, I promise I’ll take <b>good</b> care of you.” She trails a hand down your side, sending shivers up your spine. “All you gotta do is do as I tell you to like a good ${pc.mfFem(`boy`, `girl`)}... you won’t regret it.”`);
				} else {
					Text.Out(`You lower your head meekly and tell her you don’t, but that you’ll accept any punishment she has in mind for you.

					“Mmm… such a natural… I do hope that I don’t end up breaking you.” You gulp nervously, heart fluttering in your chest. There’s a part of you that don’t want her to hold back, that <b>wants</b> to be broken by the confident farmgirl. “Playing with you will be so much fun…”`);
				}
				Text.NL();
				Text.Out(`Gwendy twirls around, arching a finger at you to follow her. “You’ll find out what I have in mind soon enough, but for now, come along. We’re going to want to be somewhere a little more private… at least the first time.” With that, she heads for the loft, you trailing behind her ${player.SubDom() >= -20 ? `somewhat reluctantly` : `eagerly`}.`);
			} else {
				Text.Out(`“You <b>are</b> just losing on purpose by now, aren’t you?” Gwendy grins at you widely. “I think you know what I have in mind… so tag along, ${pc.name}. Hope you’re not planning on walking anywhere important the next couple of days… as you know, I have some trouble holding back once I get started.”

				You gulp, knowing full well what she has planned. You have a rough few hours ahead of you. The farmgirl imperiously gestures for you to follow, as she confidently heads for the loft, hips swaying enticingly.`);
			}
			Text.NL();
			Text.Out(`You scale the ladder behind her, stepping into the lioness’s den once again. “Why don’t you get out of those clothes… you won’t be needing them.” Gwendy seats herself on a nearby chair, crossing her legs as she gets ready for the show.`);
		}
		Text.NL();

		const { sexSlut, sexMid } = _SexExperience(player);

		Text.Out(`Shrugging out of your ${pc.armor}, you turn to your lover for further instructions. “All of it… that’s right. Don’t be shy now. Show me what you can do!” `);
		if (sexSlut) {
			Text.Out(`Oh now she’s done it. If there’s a word to describe you, shy is not it. You let your hands sensually caress your body, blatantly flaunting your assets to the horny farmgirl. Seeing that you have her attention, you slowly ${pc.naga(`slither`, `step`)} closer to her, giving her your best fuck-me eyes.

			“Mmm… what are you up to now, ${pc.name}?” Gwendy murmurs, her hand lightly caressing your ${pc.skin} as you continue your erotic dance. Twirling around, you shake your ${pc.butt} at her, teasing her a little before planting yourself in her lap. “Someone’s eager to get started…” the farmer grips your ${pc.hip} with one hand, reaching around you with the other to fondle your ${pc.breasts}.

			You rub yourself against her lap,${eplus ? ` feeling her massive horsecock stir through her tight trousers,` : ``} drawing an excited moan from your lover. Her hand on your ass gropes and pulls at you, getting rougher by the second. You smirk at her over your shoulder, grinding all the harder.

			“A-Alright, you made your point,” Gwendy pants, giving you a swat on the butt. “Get that sexy ass over on the bed, I’ll be right behind you.” You give her one last rub before acquiescing, sauntering over to the bed and laying down on it.`);
		} else if (sexMid) {
			Text.Out(`You have a fairly good idea of what she’s after. If it’s a show she wants, she’s going to get a show. You start slowly swaying your hips, sensually flaunting your body to the lewd farmgirl. “So sexy… mm… you’re good… shake that ass for me.” Gwendy is getting quite worked up from your dancing, ${eplus ? `caressing the growing bulge in her pants` : `unbuckling her pants and easing a hand into her panties`} as she intently watches your every move.

			“F-Fuck yeah… spread ‘em for me…” The${eplus ? ` futa` : ``} farmgirl moans. “That’s right, mm…” There’s a rustle from behind you as she gets up. “You’ve gotten me quite worked up. Go and bend over on the bed… I’ll be right there, don’t get too comfortable.”`);
		} else {
			Text.Out(`You give her an awkward little twirl, which doesn’t appear to impress her much. “Come on, you can do better than that. Turn… spread your ass cheeks… ${pc.hastail(`raise your ${pc.tail}...`, ``)}yeah… just like that.” You blush as you acquiesce to her demands. “Now shake it for me… mm… yeah…”

			You hear a rustle behind you, and a stifled moan. Taking a quick peek, you see that Gwendy has spread her legs and ${eplus ? `fished out her turgid horsecock, vigorously stroking it` : `dug her fingers into her crotch, vigorously working her wet vagina`} as she lustfully ogles you. “Didn’t tell you to stop. Yeah… play with yourself for me…”

			She guides you through increasingly lewder poses for her, finally telling you to head over to the bed while she gets herself ready.`);
		}
		Text.NL();
		if (eplus) {
			Text.Out(`You turn to watch her as she shrugs out of her too-tight pants and top, freeing her large tits and monster cock and balls. The flared head of her turgid equine member already has a large bead of pre-cum forming on it, and she’s only going to get more excited from here on.`);
			Text.NL();
			if (first) {
				Text.Out(`“Mmm… can’t wait any longer,” the farmgirl purrs, stroking herself as she discards the last pieces of her clothing on the floorboards. “Ever since I got this thing… I’ve had trouble keeping my urges in check… watching that sexy butt of yours bouncing around the farm all day…” She grins, a blush spreading across her freckled cheeks.

				“I’m sure you can figure out where this is heading from now on, ${pc.name}, but just in case, let me spell it out for you. This.” She points to her swelling shaft. “Is going so deep inside you that you’ll feel my balls slapping against your ass. Repeatedly.” Just to accentuate her point, her cock twitches, depositing a large drop of pre on the floor. You gulp.`);
			} else {
				Text.Out(`“Mmm… you’ve gotten me pretty worked up with that sexy act of yours, ${pc.name},” the futa farmgirl purrs. “It’s going to be difficult to hold back… I’m gonna be balls-deep in you before the hour is out.” She gives the equine shaft a tug, dislodging a large drop of pre onto the floor.

				“I know you can take this, you’ve done it before…” she sighs, a twitch going through her swelling bitch-breeder. “Fuck, can’t wait to get this thing inside you… gonna pound you good…” She pinches one of her nipples, stifling a moan. Her heavy balls sway between her legs, full of her potent seed.`);
			}
		} else {
			const toys = gwendy.flags.Toys === GwendyFlags.Toys.None;
			Text.Out(`Rather than following you immediately, the farmgirl heads over to ${toys ? `her large chest of sex toys` : `a nearby chest`}, rummaging around in it at the same time as she’s tearing her clothes off. She bends over to tug something out, giving you a full view of her juicy ass and wet pussy.`);
			Text.NL();
			if (first) {
				Text.Out(`“You’re going to look so sexy with this lodged in you, ${pc.name},” Gwendy purrs, straightening up, something heavy in her arms. “It’s one of my favourites… but I rarely get to use it on others… I have a feeling you will <b>love</b> it though.”

				She steps into some kind of harness which fits snugly around her waist and under her buttocks at the tightening of a strap. You strain your neck, trying to get a better look at what she’s doing. “There we go.” The farmer turns around, giving you a full view of the truly massive equine strap-on secured to her crotch. The thing is as long and thick as her arm, and disturbingly anatomically correct, crowned with a broad flared head and with thick veins running down its length across its medial ring.

				You gasp and instinctively tighten your ${pc.hasvag(`pussy and `, ``)}asshole, at this point having a lot of second thoughts and few delusions as to her intentions.`);
			} else {
				Text.Out(`“I’m sure you remember your old friend, ${pc.name},” Gwendy purrs, straightening up with something heavy in her arms. “He’s missed you… as I’m sure you’ve missed him.” The farmer turns to allow you to watch her pulling on her massive equine strap-on, tightening the leather straps securely around her waist and legs. She runs her hand up its length, the shaft too thick for her to encircle with her fingers.`);
			}
		}
		Text.NL();
		Text.Out(`“Hope you’re ready, ‘cause here I come,” Gwendy announces as she slowly stalks towards the bed, her enormous ${eplus ? `horsecock` : `artificial cock`} flopping between her knees.`);

		if (gwendy.flags.Bailout < GwendyFlags.Bailout.Resolved) {
			Text.Flush();

			const options: IChoice[] = [
				{ nameStr: "Bail", func: () => {
					Text.Clear();
					Text.Out(`Nope. You didn’t sign up for this.

					“Someone’s a sore loser,” Gwendy comments, sounding rather annoyed as you hurriedly put your ${pc.armor} back on. You turn to throw her an apologetic glance, but something about the farmer makes your blood run cold. Her arms are crossed and her gaze frosty as she observes your scurrying, her ${eplus ? `half-hard dick` : `giant strap-on`} still jutting menacingly from her crotch, its flared tip seeming to follow you as you move. Worst of all is her <i>smile</i>. Something tells you that you’ve not heard the last of this.

					You make your excuses and leave the loft, the ghost of her smile haunting you long after you’ve left the farm behind.`);
					Text.Flush();

					gwendy.flags.Bailout = GwendyFlags.Bailout.Slip;

					Gui.NextPrompt(() => {
						MoveToLocation(WORLD().loc.Plains.Crossroads, {minute: 30});
					});
				}, enabled: true, tooltip: "Nope, nope, nope. Get out of here!"},
				{ nameStr: "Stay", func: () => {
					Text.Clear();
					Text.Out(`Those lust-filled eyes of hers keep you pinned just where you are. You can’t move… or is it that you don’t want to?

					You somehow can’t bring yourself to move. Blushing, you resign yourself to what she has planned for you.`);

					gwendy.flags.Bailout = GwendyFlags.Bailout.Submit;

					LossGetFuckedMerge({ first, hangout });
				}, enabled: true, tooltip: "Those lust-filled eyes of hers keep you pinned just where you are. You can’t move… or is it that you don’t want to?"},
			];
			Gui.SetButtonsFromList(options);
		} else {
			LossGetFuckedMerge({ first, hangout });
		}
	}

	interface ILossGetFucked {
		first: boolean;
		hangout: boolean;
	}

	function LossGetFuckedMerge(opts: ILossGetFucked) {
		const gwendy: Gwendy = GAME().gwendy;
		const player: Player = GAME().player;

		const pc = player.Parser;
		const c = new GP.Plural(player.NumCocks() > 1);

		const eplus = gwendy.EPlus();

		const { first, hangout } = opts;

		Text.NL();

		Text.Out(`The bed creaks, and you feel the weight of her ${eplus ? `fuck-stick` : `strap-on`} settle between your butt cheeks and onto your back. “${_.sample([
			`Mmm… just where I want you,`,
			`Didn’t think you’d end up like this when I first met you, ${pc.name}. Had some hopes… sure, but didn’t expect it to be this easy,`,
			`Mmm… feel that? All of that is going inside you,`,
			`Can’t wait to pound you good, ${pc.name}. Bet you are just aching for it too, the way you’re squirming,`,
			])}” Gwendy taunts as she rubs her ${eplus ? `` : `artificial `}shaft against you, eliciting a moan from your lips.${eplus ? ` You feel a splatter of sticky horse spunk drip onto your ${pc.skin}.` : ``} You tense up, shutting your eyes and waiting for the inevitable. “First though… we’re gonna prepare a little… I’m not completely heartless. Roll over.”`);
		Text.NL();
		if (eplus) {
			Text.Out(`You peek over your shoulder, coming face to face with the flared head of her equine cock. By now, it’s completely hard, jutting out proudly from her crotch just above her swollen sack.`);
			Text.NL();
			const scenes = [
				() => {
					Text.Out(`“Why don’t you put that pretty mouth of yours to use, ${pc.name}?” Gwendy settles back on the sheet, leaning back and spreading her legs. She crocks her finger at you, beckoning you over to attend her alluring herm-hood. Coaxed by her, you crawl over, nuzzling up against her turgid dick. “Good… use your tongue…”

					Knowing that it’ll make things easier later, you start the monumental task of lathering up her massive horsecock, doing your best to use your ${pc.tongue} and ${pc.hand}s to spread your saliva and her pre until it forms a slick coating. Unbidden, you reach down to massage the farmgirl’s balls, teasing out more globs of white goop that slowly drip down her shaft.`);
				},
				() => {
					Text.Out(`“Here… I’m sure you know what to do with this.” Gwendy tosses you a vial of clear liquid. Catching it, you unstopper it and experimentally spill a dollop of the viscous fluid onto your ${pc.palm}. “You’re not going to want to skimp, you’ve quite a lot of… ground to cover. C’mere and work it in for me.” Obediently, you crawl over, pouring the entire contents of the flask on her horsecock, using your fingers to spread the fluid from root to flare-crowned stem.

					You can feel the futa farmgirl tense up as you slowly jerk her off, one ${pc.hand} traversing the length of her shaft while the other plays with her smooth nutsack. Your lover caress your ${pc.hair}, sighing contentedly as she firmly nudges your ${pc.face} closer, pressing it into her heavy balls. Their scent is almost overpowering; you can almost taste her nut-batter sloshing around inside them, a substance prepared to become a lot more intimate with you all too soon.`);
				},
			];
			if (player.FirstBreastRow().Size() >= BreastSize.Medium) {
				scenes.push(
					() => {
						Text.Out(`“C’mere…” Gwendy leans in and plants a sloppy kiss on your lips. “Mmph… over this way. Yeah, head off the edge of the bed.” She shuffles around, getting on her feet as she directs you onto your back, presenting you with the inverted view of her dangling ball sack, the towering mass of her horsecock flopping onto your chest and down between your ${pc.breasts}. Something drips down on your cleavage: a sticky liquid of some sort, cool to the touch. Probably lubricant, you realize, but your view is somewhat blocked.

						“Good… just lie back while I fuck your tits,” the farmer purrs, leaning down to pinch and tease your ${pc.nips} before grabbing your ${pc.breasts} and firmly pressing them together. She’s quick to start moving, see-sawing her turgid member through the slick valley formed by your boobs and coating its length with lube. Each full stroke slaps her heavy balls against your forehead with a loud smack. Just by the time that you start worrying about getting a concussion, she slows her movements.`);
					});
			}
			if (player.FirstCock()) {
				scenes.push(
					() => {
						Text.Out(`As you meekly obey her command and turn around, your own ${pc.cocks} flop{c.notS} out, slick against your ${pc.belly}. “Mmm… perfect.” Gwendy grins at you, playfully giving${c.oneof} your shaft${c.s} a squeeze with her hand. “I’m sure you’re as eager to get off as I am… so get to it. Jerk off for me.”

						You stroke your ${pc.cocks} with your ${pc.hand}, feeling your own pleasure building, all the while cognizant of the futa’s own massive member hovering above you. Now and then, the farmer rubs up against you, pressing your cocks together.`);
						Text.NL();

						const p1cock = player.BiggestCock();
						const g1cock = gwendy.BiggestCock();

						if (p1cock.Len() + 30 < g1cock.Len()) { // ~5"
							Text.Out(`“Mmm… that’s cute… I hope ${c.thatThose} little thing${c.s} of yours can at least provide me with some lube…” Her equine shaft completely dwarfs you in terms of size, easily more than four times the length of yours.`);
						} else if (p1cock.Len() + 20 < g1cock.Len()) { // ~10"
							Text.Out(`She dwarfs you in terms of size, her equine shaft more than double the length of yours. “Make the best of it, it’s the only action ${c.thatThose} thing${c.s} ${c.isAre} gonna see today.”`);
						} else if (p1cock.Len() < g1cock.Len()) { // ~20"
							Text.Out(`You’re far from small, but even so she still beats you when it comes to size. “Almost big enough to play in my league… but not quite.” She grins at you as she grinds against your ${pc.cocks}. “Outside this bedroom, you’d be considered hung… but here, well…”`);
						} else {
							Text.Out(`She seems more than a little impressed by your sheer size, which surpasses even her own already ridiculously large equine shaft. “That looks so juicy… you might pose a challenge even to me… too bad you’re not gonna get to show it off today. I want some of that later, though.”`);
						}
						Text.NL();
						Text.Out(`A few minutes of her taunting later, you sense your orgasm growing closer. Speeding up, you groan, your ${pc.balls} eager to churn out your sperm, blissfully unaware of the perverse purpose the farmer intends to use it for.${player.HasBalls() ? ` Just as you’re about to blow, she lightly presses the sole of her foot on your sack, pushing you over the edge.` : ``}`);

						const cum = player.OrgasmCum();
						const lots = cum >= CumLevel.Mid;

						Text.Out(`You moan as you climax, splattering the ${pc.skin} of your ${pc.belly} with your ${lots ? `plentiful` : `pitiful`} load. Gwendy is quick to grind against you before you’re even finished, coating her length in your seed. ${lots ?
							`“My… someone was pent up… If that’s how much you cum when you’re jerking off, just wait until I’m pounding you silly. I’ll need a mop after we’re done.”` :
							`“Tch… was hoping for more. This isn’t even close enough to coat all of it.” Looking a bit peeved at her idea not working out, the farmer grudgingly fetches a vial of clear liquid, instructing you to work it in. Biting down a reply, you do as you’re asked. Before long, your hands are covered in a mixture of lube and your own cum.`}`);
					});
			}
			_.sample(scenes)();
		} else {
			Text.Out(`As you move to obey her, the farmer tosses you a stoppered vial containing a clear liquid. You experimentally spill a dollop of it, rubbing the slick and sticky substance between the tips of your fingers. It doesn’t take a genius to figure out what it is.`);
			Text.NL();
			const scenes = [() => {
				Text.Out(`“Best use all of it,” Gwendy urges, smirking as she brandishes her equine toy and nudges it up against your cheek. “You have a lot of ground to cover.” Mindful to not waste any of the precious lubricant, you carefully pour the contents along her length, using your ${pc.hand}s to spread it evenly. The farmer sighs contentedly as you work her.

				“The way you look between my legs, jerking my cock off… makes a girl wish she’d been born differently. Don’t worry though… I’ll get my rocks off on this; I know from experience.” She chuckles to herself as she caresses your ${pc.hair}. “Might take me a little longer than if I had a real one… but I’m sure you don’t mind that, do you?”

				You blush, ${player.SubDom() >= 30 ? `assuring her that you can take whatever she has to dish out` : `lowering your eyes and shaking your head meekly`}. All too soon, your task is finished.`);
			}];
			if (player.FirstBreastRow().Size() >= BreastSize.Medium) {
				scenes.push(
					() => {
						Text.Out(`“Let’s have a bit of fun, shall we? Pour that between your breasts.” Understanding her intent, you squish your ${pc.breasts} together and pour the contents of the vial in the cleft forming between them. Gwendy is quick to take advantage of you, leaning in for a deep kiss as she nudges the flared tip of her artificial cock into your cleavage from below. When it emerges to nudge your chin, it’s coated and dripping with lube.

						“C’mon… work it in.” The farmer looks down on you with lust-filled eyes as you slowly drag your ${pc.breasts} along her length, spreading the viscous fluid on the rubbery monstrosity. The girl helpfully shifts her hips back and forward, gently titfucking you as she caresses your ${pc.hair}. The entire affair is a very sticky process, and after a few minutes, your ${pc.face} and the ${pc.skin} on your ${pc.belly} are thoroughly and unnecessarily soaked.
						#end`);
					});
			}
			_.sample(scenes)();
		}
		Text.NL();
		Text.Out(`“${_.sample([
			`Mph… ahh… that should do it.`,
			`Good job, pet. You’ve done well.`,
			`Unf… f-fuck yeah, you’re <b>eager</b> for this, aren’t you?`,
			`H-Hold on… when I do bust a nut… I want it to be inside you.`,
			])} Now…” Gwendy disentangles herself from you, her ${eplus ? `` : `artificial `}member glistening and ready. “Your turn.”`);
		Text.NL();

		// Set Scene Variables (position, prep, naga)
		enum Position { Prone, OnBack }
		enum Prep { Finger, Tongue }

		let position = _.sample([Position.Prone, Position.OnBack]);
		const prep = _.sample([Prep.Finger, Prep.Tongue]);
		const naga = player.IsNaga();

		let target: () => string;
		let targetObj: Orifice;
		let vag: boolean = false;

		const posSelector = new EncounterTable();
		posSelector.AddEnc(() => {
			if (naga) { position = Position.OnBack; }
			target = () => pc.vag;
			targetObj = player.FirstVag();
			vag = true;
		}, 2.0, player.FirstVag() !== undefined);
		posSelector.AddEnc(() => {
			if (naga) { position = Position.Prone; }
			target = () => pc.anus;
			targetObj = player.Butt();
		}, 1.0, true);
		posSelector.Get();

		if (position === Position.OnBack) {
			Text.Out(`Shifting her weight, the ${eplus ? `futa ` : ``}farmgirl pushes you down on your back, hands trailing down your sides and ${pc.thighs} before homing in on your crotch. `);
			if (naga) {
				Text.Out(`“Seems I’ve caught myself a naughty snake…” She straddles your tail, pinning you down between her legs as she grinds her pussy${eplus ? ` and balls` : ``} against your scales. “Don’t think I’ll let you go anytime soon, cutie.”`);
			} else {
				Text.Out(`“Spread your legs… yeah, like that, as wide as you can.”`);
			}
			Text.Out(` Leaning down, Gwendy buries her ${prep === Prep.Finger ? `fingers into your ${target()}, prying the orifice open with her lube-slick digits` : `tongue in your ${target()}, hungrily lapping at you as she ${vag ? `eats you out` : `rims you`}`}.`);
		} else {
			Text.Out(`“On your belly…” You shuffle around to meet her request, head propped up on a pillow. `);
			if (naga) {
				Text.Out(`“Got you where I want you now, you naughty snake…” She straddles your tail, pinning you down under her weight as she grinds her pussy${eplus ? ` and balls` : ``} against your scales. “The view from back here is quite delectable…”`);
			} else {
				Text.Out(`“Don’t worry, ${pc.name}, I’ll be bucking you like a cowboy riding a bull in no time… just need to get you ready…”`);
			}
			Text.Out(` Leaning down and spreading your cheeks, Gwendy places a few sloppy kisses on your exposed ${pc.butt}, leaving a trail of saliva on your ${pc.skin}. You feel her shift behind you, gasping as a foreign presence enters your ${target()}. You hug the pillow close to your chest as her ${prep === Prep.Finger ? `fingers starts pumping your eager orifice, her lubed up digits gradually stretching you and teasing your hole in preparation for her equine ${eplus ? `dick` : `toy`}` : `tongue pries itself into your orifice, inexorably spreading you wider and lubing you up with slick saliva`}.`);
		}
		Text.Out(` She works you intensively for several minutes, drawing ${position === Position.Prone ? `muffled` : `excited`} moans from you as you squirm under her${prep === Prep.Tongue ? ` oral` : ``} ministrations.`);
		if (player.FirstCock()) {
			Text.Out(` Your ${pc.cocks} ${c.isAre} stiff and swollen, ${position === Position.Prone ? `pressed awkwardly between you and the sticky sheets` : `flopping against your ${pc.belly} and dripping with pre`}.`);
		}
		Text.NL();
		if (prep === Prep.Tongue) {
			Text.Out(`Finally, your lover leans back, licking her lips. “Delicious… but I can’t wait any longer…” Her hands settle on your ${pc.hips}, getting a firm grip as her ${eplus ? `horsecock` : `strap-on`} presses against your ${target()}, seeking entry.`);
		} else {
			Text.Out(`“That should about do it…” Your lover withdraws her lube-slick fingers from your stretched hole. She firmly grips your hip with one hand, while using the other to guide her ${eplus ? `horsecock` : `strap-on`} to press against your ${target()}.`);
		}
		Text.Out(` “Now… Let. Me. <b>In!</b>”`);
		Text.NL();

		const gCock = gwendy.BiggestCock() || ToysItems.EquineDildo.cock;
		if (vag) {
			Sex.Vaginal(gwendy, player);
			player.FuckVag(player.FirstVag(), gCock, 3);
			gwendy.Fuck(gCock, 3);

			if (player.FirstVag().capacity.IncreaseStat(8, .5)) {
				Text.Out(`<b>Your pussy feels slightly stretchier.</b>`);
				Text.NL();
			}
		} else {
			Sex.Anal(gwendy, player);
			player.FuckAnal(player.Butt(), gCock, 3);
			gwendy.Fuck(gCock, 3);

			if (player.Butt().capacity.IncreaseStat(8, .5)) {
				Text.Out(`<b>Your butt feels slightly stretchier.</b>`);
				Text.NL();
			}
		}

		Text.Out(`You cry out as the flared head forces itself inside you, no longer in any shape to care about who hears you. `);
		if (targetObj.Cap() >= Capacity.gaping) {
			Text.Out(`Her turgid fuck-stick easily slips inside your gaping ${vag ? `cunt cavern` : `anal abyss`}, each inch stretching and expanding your insides until you feel comfortably full. “Mrr… good ${pc.mfFem(`boy`, `girl`)},” the farmer moans, shifting herself deeper inside you. “You were made for this… fuck that feels good…” She starts to move, taking full advantage of your flexibility, and before long you feel her hips gently tapping against yours. “${eplus ? `Told ya I’d be balls deep inside you before the night was out… haah…` : `Damn, you took the entire thing… and so easily…`}”`);
		} else if (targetObj.Cap() >= Capacity.loose) {
			Text.Out(`Despite the extensive preparations, you have to will yourself to relax your ${target()}, your ${pc.hand}s grasping at the sheets as you try to distract yourself from the uncomfortable intrusion. The ${eplus ? `futa ` : ``}farmgirl sighs contentedly as she rocks back and forth, each gentle thrust pushing deeper inside you. “Mmm… so tight… breaking you in is going to be… hah… fucking amazing…” Before long, her insistent spelunking has stretched you enough for it to start feeling enjoyable. A good thing too… because she’s just getting started.

			You groan, but no amount of squirming is going to get you out of her grasp now that she has you pinned. An eternity later - or so it feels like - the farmer’s hips tap gently against yours as she bottoms out. “${eplus ? `Told ya I’d be balls deep inside you before the night was out… haah…` : `Good ${pc.mfFem(`boy`, `girl`)}… I knew you’d be able to take it all…`}”`);
		} else {
			Text.Out(`Even with the extensive preparations, you feel like someone shoved a tree trunk up your ${target()}. Your fingers${naga ? `` : ` and toes`} curl and grasp at the sheets, trembling as you try to get used to the massive intrusion. The farmer takes it slow, to her credit, but inch by inch her turgid fuck-stick burrows deeper and deeper inside your protesting ${vag ? `pussy` : `colon`}.

			“Good ${pc.mfFem(`boy`, `girl`)}, that’s a good little ${vag ? `` : `butt`}slut…” Gwendy murmurs unhelpful encouragement to you, gently rocking her hips back and forth to get you used to her girth. “Hmm… looks like you need a little more help.” She blissfully withdraws, but her absence is not extended. When next she penetrates your ${target()}, her massive member is preceded by a cold, numbing gel; some potent alchemy at work if your relaxed loins are any indicator. This time, she’s able to move easier, and the pain from before is replaced with something else… intense pleasure.

			You lose your sense of self for a while, drowning in the sensation of Gwendy’s bitch-breaker ruthlessly exploring and exploiting your ${target()}. With a sudden jolt, you realize that she’s stopped moving… and that she’s buried ${eplus ? `balls deep` : `her entire toy`} inside you. “Where there’s… haah… a will, there’s a way, eh, ${pc.name}?”`);
		}
		Text.NL();

		const cum = player.OrgasmCum(3);

		Text.Out(`Bereft of voice, you merely mewl weakly in response, biting your lip as she gyrates and grinds herself deep inside you.`);
		if (player.FirstCock()) {
			Text.Out(` Sticky cum-batter matten your ${pc.belly}, leaking out of your ${pc.cocks} from her insistent intrusion.`);
		}
		if (player.FirstVag()) {
			Text.Out(` Your cunt is drenched in juices from your ${vag ? `climax, providing the farmgirl with additional lubricant for her equine shaft` : `ass-gasm, aching to also join in on the fun`}.`);
		}
		if (!player.FirstCock() && !player.FirstVag()) {
			Text.Out(` Your body shakes from ass-gasming, overwhelmed by her insistent intrusion.`);
		}
		Text.NL();
		if (position === Position.Prone) {
			Text.Out(`You feel Gwendy’s weight pressing down on your back, her freckled tits rubbing against your ${pc.skin} as she shifts herself into position for some serious ${vag ? `pussy` : `prostate`} pounding. You gasp as she raises her hips, withdrawing all but the flared head of her massive ${eplus ? `horsecock` : `strap-on`} from your ${target()}.`);
		} else {
			Text.Out(`Gwendy plants her hands on either side of your head, her freckled tits rubbing against your ${pc.breasts} as she looms over you. She shifts her hips, flexing her knees and withdrawing all but the flared head of her massive ${eplus ? `horsecock` : `strap-on`} from your ${target()}, forcing a gasp from you.`);
		}
		Text.Out(` The farmer strokes your cheek lovingly. “We’re just getting started… brace yourself.”`);

		Text.Flush();

		TimeStep({hour: 1});

		Gui.NextPrompt(() => {
			Text.Clear();
			Text.Out(`What follows is ${vag ? `a romp` : `an assfucking`} so intense, your descendants will be feeling it on bad winter days for generations to come. Once unleashed, there’s no stopping the${eplus ? ` futa` : ``} farmgirl’s rutting, her hips tirelessly pistoning her ${eplus ? `horsecock` : `strap-on`} to the hilt inside your ${target()} with abandon. The creaking of the bed alone must be audible over the entire farm, not to mention the loud moans and cries of both you and your lover.

			You lose all track of time, living in the moment of each thrust of Gwendy’s ${eplus ? `throbbing` : `artificial`} fuck-stick. Your sweat-slick bodies intertwine and squirm from your intense love-making, splattered in the culminations of several orgams from each of you. The farmer barely slows down between rounds to shift you into new positions, manhandling you with a firm hand.`);
			Text.NL();
			if (first) {
				Text.Out(`“F-Fuck… why did I wait so long for this… W-We are going to be doing this a lot… haah… more from now on, ya hear?”`);
			} else {
				Text.Out(`“${_.sample([
					`I ain't ever gonna get… hngh… tired of this, fucking you is the best, ${pc.name}!`,
					`N-Not done… haah… yet…`,
					`${pc.name}... I lo… love your ${vag ? `pussy` : `ass`}...`,
					`W-Woah… I think I’m gonna cum again… hgn!`,
					`F-Fuck… that feels so good… I… I’m gonna speed up, okay?`,
					])}”`);
			}
			Text.Out(` Her fingers sink into the flesh of your ${pc.butt} as she continues to pound away at your abused ${vag ? `snatch` : `anus`} without any signs of slowing down. Your eyes roll back, the only vaguely controlled movement you’re capable of being erratically grinding back against the energetic farmgirl.`);
			if (eplus) {
				Text.Out(` By this point, your insides are sloshing with her equine seed, each thrust of her hips forcing a geyser of cum out onto the soaked sheets, dripping down to the floorboards and seeping through the cracks to the barn below.`);
			}

			const cum = player.OrgasmCum(3);

			if (player.FirstCock()) {
				Text.NL();
				if (cum < CumLevel.Low) {
					Text.Out(`The accumulated meager load from your ${pc.cocks} is smeared all over your ${pc.belly} and painted on Gwendy’s glistening skin in thin interwoven strands.`);
				} else if (cum < CumLevel.Mid) {
					Text.Out(`The not insignificant discharge from your ${pc.cocks} is smeared all over your ${pc.skin} and dripping off Gwendy’s glistening body in sticky strands.`);
				} else if (cum < CumLevel.High) {
					Text.Out(`Both you and Gwendy are splattered with your accumulated load, thick ropes of semen smeared all across the farmer’s skin and jiggling tits. The excess is slowly dripping down the stained sheets and onto the floor.`);
				} else if (cum < CumLevel.VeryHigh) {
					Text.Out(`Not only you and Gwendy are completely drenched with the cum of multiple orgasms discharged from your ${pc.cocks}; the sticky mess spreads to everything within a six foot radius around the bed.`);
				} else {
					Text.Out(`Both you and Gwendy are a complete mess at this point, your skin${!player.HasSkin() ? ` and ${pc.skin}` : ``} liberally coated in thick ropes of your spunk.

					There’s not a single piece of furniture in the loft that’s gone unmarked from the excessive eruptions of your cock cannon${c.s}. It’s even dripping down from the ceiling. Judging by how thoroughly she’s drained you, the ground floor might be in danger of flooding.`);
				}
			}
			Text.NL();
			Text.Out(`<b>Time passes…</b>

			With a loud moan, Gwendy slams her equine ${eplus ? `shaft` : `strap-on`} inside you for a final time before collapsing on top of you, utterly spent. ${eplus ? `You can feel her balls unloading one last time inside you, your ${pc.belly} straining from the pressure` : `You can feel her shiver as her pussy convulses in orgasm one last time, her feeble, shuddering spasms propagating through the massive toy lodged in your ${target()}`}.

			You stay like that for a while, both of you too exhausted to move. The farmer is the first to stir, gently dislodging her ${eplus ? `softening horsecock from your gaping fuckhole and letting out a deluge of cum previously captured inside you` : `artificial horsecock from your gaping fuckhole. She releases the leather straps on it holding it in place, letting the toy fall on the floor with a loud thump`}.

			“Mrr… you’re a good ${hangout ? `fuck` : `sport`}, ${pc.name},” Gwendy purrs, stretching leisurely as she gives you a hand up. “I think I could get used to doing this more oft-” She trails off, eyes coming to rest on the site of your lovemaking.`);

			TimeStep({hour: 2});

			if (eplus || cum >= CumLevel.Mid) {
				gwendy.cleanTimer = new Time(0, 0, 1, 0, 0);
				Text.Out(`“Uhm… wow.” Silently, the two of you contemplate the utter wreck that you’ve made of the bed and the surrounding blast zone. “Saw this magic sex show thing in Rigard once,” Gwendy eventually ventures. “Some charlatan who claimed he could summon lesser Spirits of Fertility at will. Turns out he had the cliff notes down, but had skimped the research on control. Place looked a little like this once the Court Magician had finally subdued and banished the buggers. They cordoned the building off for a week.”

				You let this sink in before joining the farmgirl in an attempt to clean up yourselves and the loft. Gwendy eventually calls it off as a lost cause, announcing that she needs some rest before attempting to salvage this mess. “I appreciate your eagerness to help… but I feel having you around might prove a… distraction.” She gives you a sideways grin.`);
			} else {
				gwendy.cleanTimer = new Time(0, 0, 0, 6, 0);
				Text.Out(`“Huh… I guess all of this is going into the laundry bin.” Silently, the two of you gaze at the disorderly bed and ${player.FirstCock ? `cum-stained` : `ruffled`} sheets. You clean yourself and spend some time helping Gwendy before she pleads timeout, announcing she needs some rest before salvaging this mess.`);
			}
			Text.Out(` You say your farewells, loins still aching as you descend down the ladder and limp away.`);
			Text.Flush();

			Gui.NextPrompt(() => {
				MoveToLocation(WORLD().loc.Farm.Barn);
			});
		});
	}
}
