import * as _ from "lodash";

import { Cock, CockType } from "../body/cock";
import { Genitalia } from "../body/genitalia";
import { Race } from "../body/race";
import { Entity } from "../entity";
import { GAME, TimeStep } from "../GAME";
import { Gui } from "../gui";
import { ItemSubtype } from "../item";
import { ItemToy } from "../items/toy-item";
import { ToysItems } from "../items/toys";
import { IChoice } from "../link";
import { Party } from "../party";
import { Text } from "../text";

/*
 * Masturbation scenes for the PC
 */

export namespace MasturbationScenes {

	// TODO: Stretch/Cap change for toy training

	export function Entry() {
		const player: Entity = GAME().player;
		const party: Party = GAME().party;
		const parse: any = {

		};

		const lust = player.LustLevel();
		parse.comp = party.Num() === 2 ? party.Get(1).name : "your companions";

		Text.Clear();
		if (party.Num() > 1) {
			Text.Add("Dismissing [comp] so you can have a bit of privacy,", parse);
		} else {
			Text.Add("Looking around for a quiet, private spot and quickly finding one,", parse);
		}
		Text.Add(" you nip off in search of some relief from the rising need that’s been ", parse);
		if (lust < 0.5) {
			Text.Add("needling at you for some time now.", parse);
		} else if (lust < 0.75) {
			Text.Add("constantly on your mind for a while.", parse);
		} else {
			Text.Add("threatening to overwhelm you.", parse);
		}
		Text.Add(" Right. The only question now is: how do you want to go about blowing off some steam?", parse);
		Text.Flush();

		const br = player.FirstBreastRow().Size() >= 2;
		const taur = player.IsTaur();

		// [Cock][Pussy][Breasts][Ass]
		const options: IChoice[] = [];

		if (player.FirstCock()) {
			const optsTc: IChoice[] = [];
			_.each(player.AllCocks(), (c: Cock) => {
				optsTc.push({ nameStr : c.race.qCShort(),
					tooltip : c.aLong(),
					func(obj: any) {
						MasturbationScenes.CockOpening(obj);
					}, enabled : true,
					obj : c,
				});
			});

			if (optsTc.length >= 1) {
				options.push({ nameStr : "Jerk cock",
					tooltip : "",
					func() {
						if (optsTc.length >= 2) {
							Gui.SetButtonsFromList(optsTc, false, undefined);
						} else {
							optsTc[0].func(optsTc[0].obj);
						}
					}, enabled : !taur,
				});
			}
		}

		if (player.FirstVag()) {
			options.push({ nameStr : "Vag - finger",
				tooltip : "",
				func() {
					MasturbationScenes.VagOpening(MasturbationScenes.VagFinger);
				}, enabled : !taur,
			});

			const vagCap = player.FirstVag().Cap();

			const optsTv: IChoice[] = [];
			const addVagToy = (toy: ItemToy) => {
				const enabled = vagCap >= toy.cock.Thickness();
				if (party.Inv().QueryNum(toy)) {
					optsTv.push({ nameStr : toy.name,
						tooltip : toy.Long(),
						func(obj: any) {
							MasturbationScenes.VagOpening(MasturbationScenes.VagToy, obj);
						}, enabled,
						obj : toy,
					});
					return enabled;
				}
				return false;
			};
			const toyAvailable =
				addVagToy(ToysItems.SmallDildo) ||
				addVagToy(ToysItems.MediumDildo) ||
				addVagToy(ToysItems.LargeDildo) ||
				addVagToy(ToysItems.ThinDildo) ||
				addVagToy(ToysItems.ButtPlug) ||
				addVagToy(ToysItems.LargeButtPlug) ||
				addVagToy(ToysItems.AnalBeads) ||
				addVagToy(ToysItems.LargeAnalBeads) ||
				addVagToy(ToysItems.EquineDildo) ||
				addVagToy(ToysItems.CanidDildo) ||
				addVagToy(ToysItems.ChimeraDildo);
			if (optsTv.length >= 1) {
				options.push({ nameStr : "Vag - toys",
					tooltip : "",
					func() {
						Gui.SetButtonsFromList(optsTv, false, undefined);
					}, enabled : !taur && toyAvailable,
				});
			}

			// Requires prehensile tail
			if (player.HasPrehensileTail()) {
				options.push({ nameStr : "Vag - tail",
					tooltip : "",
					func() {
						MasturbationScenes.VagOpening(MasturbationScenes.VagTailfuck);
					}, enabled : !taur,
				});
			}
		}

		options.push({ nameStr : "Ass - finger",
			tooltip : "",
			func() {
				MasturbationScenes.AnalOpening(MasturbationScenes.AnalFinger);
			}, enabled : !taur,
		});

		const analCap = player.Butt().Cap();

		const optsTa: IChoice[] = [];
		const addAnalToy = (toy: ItemToy) => {
			const enabled = analCap >= toy.cock.Thickness();
			if (party.Inv().QueryNum(toy)) {
				optsTa.push({ nameStr : toy.name,
					tooltip : toy.Long(),
					func(obj: any) {
						MasturbationScenes.AnalOpening(MasturbationScenes.AnalToy, obj);
					}, enabled,
					obj : toy,
				});
				return enabled;
			}
			return false;
		};
		const toyAvailable =
			addAnalToy(ToysItems.SmallDildo) ||
			addAnalToy(ToysItems.MediumDildo) ||
			addAnalToy(ToysItems.LargeDildo) ||
			addAnalToy(ToysItems.ThinDildo) ||
			addAnalToy(ToysItems.ButtPlug) ||
			addAnalToy(ToysItems.LargeButtPlug) ||
			addAnalToy(ToysItems.AnalBeads) ||
			addAnalToy(ToysItems.LargeAnalBeads) ||
			addAnalToy(ToysItems.EquineDildo) ||
			addAnalToy(ToysItems.CanidDildo) ||
			addAnalToy(ToysItems.ChimeraDildo);
		if (optsTa.length >= 1) {
			options.push({ nameStr : "Anal - toys",
				tooltip : "",
				func() {
					Gui.SetButtonsFromList(optsTa, false, undefined);
				}, enabled : !taur && toyAvailable,
			});
		}

		options.push({ nameStr : "Breasts",
			tooltip : "",
			func : MasturbationScenes.Breasts, enabled : br,
		});

		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("You resist the urge... you really have better things to do.", parse);
			Text.NL();
			parse.c = party.Num() > 1 ? Text.Parse(" call back [comp] and", parse) : "";
			Text.Add("Flushed, you[c] continue on your journey.", parse);
			Text.Flush();
			Gui.NextPrompt();
		});
	}

	export function CockOpening(p1cock: Cock) {
		const player: Entity = GAME().player;
		const allCocks: Cock[] = player.AllCocksCopy();
		for (let i = 0; i < allCocks.length; i++) {
			if (allCocks[i] === p1cock) {
				allCocks.splice(i, 1);
				break;
			}
		}

		let parse: any = {
			cocks2() { return player.MultiCockDesc(allCocks); },
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

		parse.cock      = () => p1cock.Short();
		parse.cockTip   = () => p1cock.TipShort();

		Text.Clear();
		Text.Add("Having made your decision, you quickly strip off your [armor] and sit down on a comfortable spot on the ground.", parse);
		Text.NL();

		const cover = player.Genitalia().cover;
		let slit = false;

		if (cover === Genitalia.Cover.Slit) {
			Text.Add("You look at your genital slit, gently stroking the outer folds before you carefully spread them open and slip a finger inside. The feeling is exquisite, and you find your [cocks] already getting hard at the prospect of some fun.", parse);
			Text.NL();
			if (player.NumCocks() === 2) {
				Text.Add("You search around, gently stroking the tips of your two cocks. As thrilling as it would be to touch both of them, you’ve already decided which one you’ll be using to relieve yourself, so you flex your muscles to coax it out whilst leaving the other one safely tucked away in your slit.", parse);
			} else if (player.NumCocks() > 2) {
				Text.Add("You let your fingers roam the tips of your [cocks] until you find the one you picked for today’s activities. It’s a bit complicated to draw only that one out, but somehow you know exactly which muscles to flex to make it come out.", parse);
			} else {
				Text.Add("It doesn’t take long before you feel your fingers roam the [cockTip] of your [cock]. You tease yourself as you flex your muscles to make it come out of its hiding place.", parse);
			}
			slit = true;
		} else if (cover === Genitalia.Cover.Sheath) {
			Text.Add("You gently massage your sheath, feeling the little waves of pleasure beginning to harden your [cocks]. That being the case, you pull your sheath open and watch as your [cocks] spill out of [itsTheir] hiding place.", parse);
			Text.NL();
			if (player.NumCocks() === 2) {
				Text.Add("You give both your [cocks] a tender stroke, but quickly move to your chosen [cock]. Maybe some other time you’ll play with your other one.", parse);
			} else if (player.NumCocks() > 2) {
				Text.Add("You have such a nice selection… but for now, you’ll focus your attention on your [cock]. The others will just have to wait for another time.", parse);
			} else {
				Text.Add("With your [cock] out in the open, it’s only a matter of working it into a proper erection.", parse);
			}
		} else {
			Text.Add("With nothing standing between you and your [cocks], it’s only a matter of getting started.", parse);
		}
		Text.NL();
		// #Erection block

		const knot = p1cock.Knot();

		if (p1cock.type === CockType.tentacle) {
			Text.Add("First, you start with some gentle stroking. It feels good, but isn’t necessary considering what you can do with your prehensile [cock]. With a mischievous glint in your eyes, you release your member and flex your muscles.", parse);
			Text.NL();
			Text.Add("Surely enough, your [cock] starts hardening as you work it into a proper erection. It’s an odd feeling, but it’s also very pleasurable to get an erection in this fashion. It’s almost as if your muscles were cramping, getting rigid and tough to move, yet none of this hurts like it would if it happened anywhere else. Instead, it just feels better and better.", parse);
			Text.NL();
			Text.Add("Eventually, you work yourself to full mast, and wiggle your shaft experimentally, contracting your muscles rhythmically to draw a dollop of pre on your [cockTip]. Feels like you’re ready to start!", parse);
		} else {
			Text.Add("You start with a gentle yet brisk pace, working your hands around your [cock] as you stroke it to full mast.", parse);
			if (player.NumCocks() === 2 && !slit) {
				Text.Add(" Your other [cocks2] grows erect too, despite lying forgotten.", parse);
			} else if (player.NumCocks() > 2 && !slit) {
				Text.Add(" Your other [cocks2] begin growing in sympathetic pleasure, but you remain focused on the one you picked.", parse);
			}
			Text.NL();
			Text.Add("As great as it might feel to actually have sex, there’s also an undeniable thrill in exploring yourself in this fashion. No one knows your sensitive spots quite like you do yourself, and no one can tease them in the same fashion. With that in mind, you easily reach full mast and stroke until you’ve milked a dollop of pre, a sign of your mounting excitement.", parse);
		}
		Text.NL();

		// Type variations
		if (p1cock.race.isRace(Race.Feline)) {
			Text.Add("Your kitty-prick stands proudly erect before you, throbbing slightly as you examine it more closely.", parse);
			Text.NL();
			Text.Add("It has a tapered tip, with barbs lining the length just before the head. With a cock like this, you could easily scrape the semen off any competitors if you so wished, not to mention the texture would give your partners quite a thrill.", parse);
			if (p1cock.Knot()) {
				Text.Add(" The knot forming at the base of your shaft might give it a weird look. It’s not exactly something you’d expect to see on a cat’s dong, but you’re pretty sure any partner of yours would appreciate the surprise. Scrape them with the barbs, then tie them down for the finale...", parse);
			}
			Text.NL();

			MasturbationScenes.CockSize(parse, p1cock);

			Text.Add("Looking is nice and all, but it’s time you got down to business. Smiling to yourself, you close a hand around your length, milking it up and down at a gentle pace. The little barbs lining your tip tickle you every time you move your hand up, and you find yourself gently teasing them before collecting the dollop of pre that’s formed and spread it along your shaft to make your job easier.", parse);
			Text.NL();
			Text.Add("As your vision begins to blur in the haze of your self-inflicted pleasure, your mind wanders, and you imagine that you’re a wild cat yourself, mewling and yowling as you elope with a fellow feline. Their tight holes grip you as you scrape their walls with your barbs and prepare to pump them full of your kitty-jism...", parse);
			Text.NL();
			Text.Add("You moan as a shudder of pleasure rocks your whole body, snapping out of your reverie. Your cock’s grown rock-hard, and you’re leaking pre like a faucet.", parse);
		} else if (p1cock.race.isRace(Race.Canine)) {
			Text.Add("Your canine-prick is fully erect, the dollop of pre you milked earlier barely sticks to it as it threatens to slide down your shaft. ", parse);
			if (knot) {
				Text.Add("Despite your arousal, your knot still hasn’t fully formed, but you’re sure that’ll change in a few moments...", parse);
			} else {
				Text.Add("Curiously, you lack the knot most canines are famous for. Whether this makes you more exotic or simply weird you don’t know… nor care. You don’t need a knot to feel good...", parse);
			}
			Text.NL();

			MasturbationScenes.CockSize(parse, p1cock);

			Text.Add("That’s enough looking, now it’s time for action! You close your hands around your doggy-dick at the base, then begin pumping up and down.", parse);
			Text.NL();
			Text.Add("With your fervent fapping, it doesn’t take long before that dollop from earlier begins sliding down your pointy tip. To prevent it from falling over onto the ground, you angle your shaft up and let it slide till it reaches your hand, lubing them up and making your efforts at pleasuring yourself all the easier.", parse);
			if (knot) {
				Text.Add(" Every time your roaming hands pass over your forming knot, you give it a squeeze, enjoying the tightness it provides you before continuing to masturbate normally.", parse);
			}
			Text.NL();
			Text.Add("As you wank your puppy-pecker, you find your mind wandering… You imagine yourself as an alpha dog, getting ready to mount your bitch. All they can do is whine plaintively as you hold down their hips and align yourself. The first thrust misses its mark, so you adjust yourself a little more then try again. On your fourth thrust, you hit your mark and push more than half your shaft inside, pressing onwards until ", parse);
			if (knot) {
				Text.Add("your knot has almost popped in.", parse);
				Text.NL();
				Text.Add("Just you wait, you tell your bitch. You’ll have them tied up to your dick like the good puppy they are in a jiffy, then you’ll make sure to pump them full of your doggy-cum.", parse);
			} else {
				Text.Add("you bottom out.", parse);
				Text.NL();
				Text.Add("It doesn’t matter that you don’t have a knot; you’ll just have to hold your bitch extra-tight, to make sure they take all you have to give...", parse);
			}
			Text.NL();
			Text.Add("A particularly fierce spasm knocks you out of your reverie, and you realize that you’re leaking pre like a faucet.", parse);
		} else if (p1cock.race.isRace(Race.Horse)) {
			Text.Add("Your stallionhood stands proudly before you, like a bastion of virility. The musk is so potent that you can smell it clearly even from this distance, and it only makes you all the more excited. The veins lining your shaft bulge with the power of your muscles, pumping enough blood into your member to keep as hard as a rock. The flat tip is shaped like a battering ram, and you’ll use it as such the next time you fuck someone.", parse);
			if (knot) {
				Text.Add(" You don’t know if the knot bulging at the base of your [cock] would make your partner even hornier or if it would scare them away. An equine-prick like yours is a member of might, and the idea of having something like that locked inside them? It gives you goosebumps just imagining it...", parse);
			}
			Text.NL();

			MasturbationScenes.CockSize(parse, p1cock);

			Text.Add("Enough looking, it’s time for some workout! You grab your shaft and squeeze it tightly, then begin pumping away. The powerful muscles ripple under your touch as you trace the veins leading up to the flattened tip. Sparing a finger, you gently trace the broad contours of your cumvein, gathering some of your pre-cum to spread it along as much of your length as you can.", parse);
			Text.NL();
			Text.Add("Now properly slickened, you feel like you can truly start fapping, and as you do so, your mind wanders…", parse);
			Text.NL();
			Text.Add("You imagine yourself in a field, with powerful legs propelling you forward as you run with all your might. There’s a small ravine, but that proves to be no obstacle as you clear it with a mighty leap, and then you reach your destination. Lazing about in the fields, you see your harem.", parse);
			Text.NL();
			Text.Add("They all turn to look at you, nostrils flaring as they smell your powerful scent. All it takes is a snort and everyone gets back on their feet and bends over for you, side by side. You take a stroll along the row of raised butts and flagging tails, slapping their asses to send them jiggling shortly before their strong muscles hold their cheeks taut. One by one, you check their holes, sometimes leaning over to spare a lick and taste them. And when you’re done, you fuck them. One by one, you split them over your member, marking them as yours as you pump them full of your fertile seed.", parse);
			Text.NL();
			Text.Add("You’re way too virile to be satisfied with just a fuck or two, so you mount all of them several times, until their behinds are rendered a veritable mess, with their entrances gaping in the shape of your dick.", parse);
			Text.NL();
			Text.Add("A shudder of pleasure rocks your body, snapping you out of your little daydream. Your shaft is leaking pre profusely, and somehow it feels even harder than before! That was a nice little trip down dreamland, but it’s time to get real.", parse);
		} else if (p1cock.race.isRace(Race.Dragon)) {
			Text.Add("You watch your dragon-dick throb in front of you. It’s somewhat similar to a reptilian pecker, but instead of having only the underside lined with ridges, this one has ridges along the entirety of its length. The glans are spear-shaped, with the crown being lined with rounded nubs; shaped as it is, the tip would allow you to penetrate <i>any</i> hole, no matter how small it is and the small protrusions along the crown would make it extra-pleasurable as they scraped along the tight walls holding your dick on your way out. At the base, you have a mighty knot; it’s still not completely inflated, but you know that given the proper <i>motivation</i>, it can grow into a big bulb capable of locking anyone in place while you pump your cum inside...", parse);
			Text.NL();

			MasturbationScenes.CockSize(parse, p1cock);

			Text.Add("That’s enough looking though. A mighty tool like this was meant to be touched. The cock feels like a veritable sword as you grasp its length, the sensitive ridges sets your nerves alight with pleasure; as you stroke your way up, you’re forced to let go of your shaft and move your hand to tease your tip, spreading the dollop of pre gathered there along the rest of your spearheaded glans. It doesn’t take long before you set into a comfortable pace and you find yourself letting your mind wander...", parse);
			Text.NL();
			Text.Add("You imagine yourself being a mighty dragon, soaring through the skies with barely a beat from your wide wings. Your speed and grace is unmatched as the birds flock away to get out of your way. That’s when you smell it… competition; another dragon takes to the skies today. Being the proud lord of the skies in this area, you immediately set to pursue to intruder.", parse);
			Text.NL();
			Text.Add("From the scent, this is a younger dragon. They should know better than to fly into the territory of their betters…", parse);
			Text.NL();
			Text.Add("You easily catch up to the youngling, and as they catch sight of you, they yelp in fear. Though they try their best to run, it’s useless. You’re older, faster, and stronger. Catching up to them is easy enough, and once you do, you grab them, immobilizing their wings as you dive-bomb towards the ground.", parse);
			Text.NL();
			Text.Add("The landing is rough, but you don’t care. Dragons are sturdy, and though the force of the impact leaves a small crater in your wake, you barely feel a thing, and you doubt your little prey’s felt anything either. You pin them and immediately expose your erect dick; at the sight of your throbbing dragonhood, they immediately stop their struggle, submitting to their fate, honored to have aroused one as powerful as you. They lower themselves on fours, raising their tail to present you with your target.", parse);
			Text.NL();
			Text.Add("There’s no wait and no hesitation as you mount the younger dragon, plunging your cock into them like a sword entering its sheath. You nearly drag the smaller dragon along with you each time you pull out. The sensation of your ridged member’s nubs scraping their walls is heaven to you; in a sudden bout of dominance, you bite the nape of their neck, marking them as your property and your roar!", parse);
			Text.NL();
			Text.Add("And just like that, the illusion is gone and you’re back in reality, with your mighty <i>dragonslayer</i> in hand - hard as steel - nearly on the verge of blowing its load...", parse);
		} else if (p1cock.race.isRace(Race.Reptile)) {
			parse.lizard = p1cock.race.qShort();
			Text.Add("Your [lizard]-prick is already fully erect and throbbing. The shape might resemble a human’s, from your point of view, but the underside is lined with sensitive ridges. Those ridges feel great, both for you and your partner. With them, they’ll be able to tell exactly how much cock you’ve filled them with.", parse);
			if (knot) {
				Text.Add(" Your ridges only end where your knot starts, and you’re pretty sure they’ll feel <i>that</i> when it’s inside. A fitting ending to a very pleasurable journey… for the both of you.", parse);
			}
			Text.NL();
			Text.Add("The tip is resembles a spear-head. Perhaps a bit more mushroom-shaped, but it tapers slightly towards the end; this would make it extra-easy if you wanted to fuck a particularly tight hole.", parse);
			Text.NL();

			MasturbationScenes.CockSize(parse, p1cock);

			Text.Add("You’ve looked enough, now it’s time to get your hands dirty! You start at the tip, making a tight ring with your hand and pushing it against your shaft. The tapered shape of your glans makes it easier for you to spear through, and the dollop of pre on the tip acts like lube, making your descent smooth.", parse);
			Text.NL();
			Text.Add("You push until the head pops through, and you have your digits wrapped up just behind your glans. The ridges feel nice under your palms, and you start pumping at a brisk pace. The feeling is amazing, and as you settle on a comfortable rhythm, you let your mind wander…", parse);
			Text.NL();
			Text.Add("You’re stark naked in the oasis, and you’re not alone; lining the shores of the big oasis, you see males and females, both completely naked. The air is hot and the sun beats down on your scaled body mercilessly, as you scan the scenery, until you find a pair of lizan waving you over.", parse);
			Text.NL();
			Text.Add("Smiling to yourself, you decide to run over and see what they want. When they kneel before you with happy smiles, licking their lips, you find out exactly what they want… and you’re happy to oblige. You lie on your back in the soft, warm sand and let the two eager lizans get to work.", parse);
			Text.NL();
			Text.Add("Their muzzles and sinuous tongues feel wonderful on your shaft; they kiss, nuzzle and suck, licking your ridged prick like a lollypop, scraping the pre-cum right off your ridged underside as their long tongues draw even more out of you.", parse);
			Text.NL();
			Text.Add("When you finally snap out of your reverie, you note that you’re dribbling pre like a faucet. Too bad you don’t have an actual pair of lizans to help you clean up...", parse);
		} else if (p1cock.race.isRace(Race.Plant)) {
			Text.Add("You gaze at your floral cock wiggling softly before you. The length is green, but the color slowly shifts towards purple near the mushroom-shaped glans; the tip itself is perhaps a bit more bulbous than what you’d see on a human penis, and it emits a faint fruity smell along with your usual musk. More amusing though, is the fact that you can exert some control over the way your shaft moves.", parse);
			Text.NL();
			Text.Add("It takes a bit of practice - it was a bit weird at first, but now that you’ve grown used to it, you can move your cock however you wish. Experimentally, you try stretching it taut, and while the muscles resist a bit due to your aroused state, the vine-like prick does obey your commands. Then you try to wiggle it side-to-side, and it does so without issue. Your whole member is stretchy enough that such erratic movements barely bother you. In fact, you were thinking that it might feel amazing to just let your floral dick go wild when you penetrate someone...", parse);
			Text.NL();

			MasturbationScenes.CockSize(parse, p1cock);

			Text.Add("That’s enough looking! Without further ado, you grab your wiggling floral pecker and stroke it upward, flexing your muscles to make it stay taut. You squeeze your [cock], milking more pre so you can spread it along your length and mushroom-shaped bulbous tip. The feeling is wonderful, and you sometimes wind up losing control over your cock, letting it spasm wildly as electrical shocks of pleasure travel through your nerves. As you settle in a decent rhythm, you feel your mind wander…", parse);
			Text.NL();
			Text.Add("You’re in a clearing, surrounded by fertile trees, flowers, and other plant life. This place is your orchard, where you grow flowers, and speaking of flowers, it’s mating season! If you want more flowers, you’ll have to properly pollinate the current ones.", parse);
			Text.NL();
			Text.Add("You let your vine-like wiggling cocks loose, letting their sinuous shapes stretch and curl in the warm air before you direct it to a different flower. They have all sorts of shapes, colors and smells, but the one thing they all share in common is how they spread open to accept your floral dicks whenever you press them into the scenter.", parse);
			Text.NL();
			Text.Add("The bulbous tips means that they have some stretching to do, but you don’t think the flowers themselves mind; watching the process is almost like watching a whole new form of bloom. As each of your stretchy phalluses make their way inside one of the flowers, you begin fucking them in earnest. The flower stems are about as stretchy as your dicks, and each one feels like a tight cocksleeve. Some are rougher, while others are smoother, but they all manage to send fireworks tingling through your members.", parse);
			Text.NL();
			Text.Add("You awaken as a gob of pre smacks you on the cheek, your wiggling plant-pecker is swinging about completely out of control, and for good reason too. It’s dribbling pre-cum like a faucet! It takes all your focus, but somehow you manage to keep it under control. Too bad, you’ll have to continue your gardening daydream some other time...", parse);
		} else if (p1cock.race.isRace(Race.Demon)) {
			Text.Add("You gaze at your demonic-pecker. With its purplish color and assets, you’d think a dick like this could easily pass for a perverse dildo. The tip is mushroom-shaped, much like a human’s, but the crown is lined up with sensitive nubs. Merely touching one of them is enough to send you shuddering in pleasure; it must feel great to feel these going in, for both parties.", parse);
			Text.NL();
			parse.knot = knot ? ", before you reach the knot," : "";
			Text.Add("Right behind your glans, along your length, you have tinier nubs meant to massage and stimulate, and running your hand through them makes it feel like your cock is vibrating slightly. This greatly stimulates you as each nub is almost as sensitive as the ones lining the crown of your cock. Further down[knot] the shaft becomes smooth, but the area is slightly girthier compared to the rest of your cock; this is clearly meant to stretch your partner out and make repeated entry even easier and more pleasurable…", parse);
			Text.NL();
			Text.Add("Overall, this cock is a true tool of pleasure. Say what you will about demons, they really know how to fuck.", parse);
			Text.NL();

			MasturbationScenes.CockSize(parse, p1cock);

			Text.Add("Well, enough looking. It’s time to take your demon-dick for a spin. You start off by gently rubbing the dollop of pre along your [cockTip], biting your lip when you reach the nubs lining the crown. Sparks fly as the sensitive nubs set your nerves ablaze and you’re flooded with unbelievable pleasure. More pre seeps out of your [cockTip] and you eagerly get more to spread along your shaft.", parse);
			Text.NL();
			Text.Add("This feels so good that you can’t help but let your mind wander…", parse);
			Text.NL();
			Text.Add("You’re in a chapel, walking purposefully towards the altar where several willing virgins lie, covered in nothing but a sheet around each of their bodies. You can tell that they’re as scared as they’re excited; it’s not everyday that you get to lose your virginity to a sex demon, much less one as well equipped as you.", parse);
			Text.NL();
			Text.Add("You scan your options, and the room falls silent. There’s a tension in the air as they wonder who’ll be the first…", parse);
			Text.NL();
			Text.Add("To ease them into the act, you have not one, but several of them drop their sheets and step forward, guiding each to their knees as you present them with your [cock]. To your surprise, you don’t even have to coax them into touching your member; they do so of their own volition. The heat, the musk and the potent air of virility emanating from your dick is enough to send them moaning, as they open their mouths and extend their tongues to begin licking you in earnest.", parse);
			Text.NL();
			Text.Add("You watch with a wicked smile as their moans fill the chapel and the other virgins eagerly drop their sheets, running to get a piece of you. You’re lifted and set down among soft bodies, each one grasping you for a chance to service you with their nubile bodies. You lose yourself in the mass of licks and kisses, and when you feel yourself penetrating a hole, you snap out of your daydream...", parse);
			Text.NL();
			Text.Add("T-that was pretty intense… you almost came then and there.", parse);
		} else {
			Text.Add("Now that it’s fully erect, you can finally appreciate your [cock] in its full glory.", parse);
			Text.NL();

			MasturbationScenes.CockSize(parse, p1cock);

			Text.Add("Looking is nice and all, but it won’t get the job done, so you grab that dollop of pre and begin spreading it across your shaft as you settle into a brisk pace. As you pump your shaft, you also buck your hips, doing your best to be elevate your own pleasure. More pre gathers on the tip, and you make sure you spread it all over your length, each dollop only makes it easier for you to fap, which in turn produces even more pre. With a rhythm like this, it doesn’t take long until you are leaking pre-cum like a faucet.", parse);
		}
		Text.NL();

		MasturbationScenes.CockSlut(parse, p1cock);

		MasturbationScenes.CockKnot(parse, p1cock);

		Text.Add("You can feel it coming, ", parse);
		if (player.HasBalls()) {
			Text.Add("your [balls] churn in preparation, and", parse);
		} else {
			Text.Add("there’s a pressure deep in the base of your spine, as", parse);
		}
		parse.mc = player.NumCocks() > 1 ? " in unison" : "";
		Text.Add(" your [cocks] throb[notS][mc].", parse);
		Text.NL();
		let selfpaint = false;
		if (player.Slut() >= 50) {
			if (p1cock.type === CockType.tentacle) {
				Text.Add("You flex your [cock], aiming at yourself in preparation for your climax.", parse);
			} else {
				Text.Add("You start pumping at a certain angle, aiming the [cockTip] of your [cock] at yourself in preparation for your orgasm.", parse);
			}
			Text.NL();
			selfpaint = true;
		}
		Text.Add("As close as you are to the edge, all that’s left is to take the leap. With that in mind, you begin furiously masturbating with renewed vigor, until you feel yourself cross over into the wonderful orgasmic haze.", parse);
		Text.NL();

		const cum = player.OrgasmCum();

		if (selfpaint) {
			if (cum > 6) {
				Text.Add("A veritable eruption of seed blasts against you, covering you in your own spunk in seconds. The seemingly never ending wave of semen continues to hose you down, and you bask in the slimy warmth covering your very being. It’s truly a wonderful feeling. Sometimes your seed winds up splattering against your lips, and you have a chance to drink your own delicious cum. Ah…", parse);
				Text.NL();
				Text.Add("You lose track of time, but eventually your climax is reduced to a trickle and you’re left covered in a layer of glaze.", parse);
			} else if (cum > 3) {
				Text.Add("Rope after hot rope of white seed spills over you, splattering against your body and face in a constant stream as you hold your mouth open to catch what you can of your own delicious spunk.", parse);
				Text.NL();
				Text.Add("It’s too bad this has to end, but after several ropes, your orgasm is reduced to nothing more than a thin trickle as your [cock] throbs and spasms.", parse);
			} else {
				Text.Add("You may not be super-productive, but you can still shoot your seed far. Small jets of cum fly through the air to spatter against your face and torso, sometimes hitting you squarely in your mouth so can get a taste of yourself.", parse);
				Text.NL();
				Text.Add("All too soon, your climax reaches its end. It’s such a great feeling… too bad it doesn’t last longer...", parse);
			}
		} else {
			if (cum > 6) {
				Text.Add("Spunk flies from your [cockTip], arcing through the air before splattering soundly on the ground below. Each new jet is a thrill of its own, and each one sends you straight to heaven. The process repeats itself several times, until you’ve literally cum enough to fill a few buckets worth of jism. Ah… you needed that...", parse);
			} else if (cum > 3) {
				Text.Add("You continue pumping as your cock spews rope after rope of jism into the air. Your orgasm carries on in intervals, each dotted by a new rope of sticky white; as you cum, you feel your tension evaporate, replaced by satisfaction and relief at finally unloading yourself…", parse);
				Text.NL();
				Text.Add("When it finally ends, you feel spent, but relaxed. Phew… that was great...", parse);
			} else {
				Text.Add("You’re not exactly backed up; however, more than a few spurts fly from your [cockTip] to spatter noisily on the ground below.", parse);
				Text.NL();
				Text.Add("When you’re done you feel awash with pleasure, as if a great pressure had been removed from your [balls].", parse);
			}
		}
		Text.NL();
		if (player.NumCocks() > 1 && !slit) {
			Text.Add("Looking around, you see that your other cock[s2] seem[notS2] to have made a bit of a mess too...", parse);
			Text.NL();
		}
		if (selfpaint) {
			parse.fur = player.HasFur() ? ", especially when you have fur" : "";
			Text.Add("Much as you’d like to take a nap right now, you gotta at least try and clean yourself up. Dry cum can be pretty hard to clean up[fur]. Plus it’d be a waste, you think to yourself, licking your lips.", parse);
			Text.NL();
			if (player.IsFlexible()) {
				Text.Add("You set about licking yourself clean. This might be a bit challenging, but with your impressive flexibility you manage to get most of yourself cleaned up before you have to resort to rag for those hard-to-reach spots.", parse);
			} else {
				Text.Add("You use your hands to scrape off as much sperm as you can, licking it off your hands lasciviously with each pass. When you feel confident you’ve gotten all that you can, you resort to a rag to clean the rest of yourself up.", parse);
			}
			Text.NL();
		}
		Text.Add("That really hit the spot; maybe you should take a short half hour nap before heading off on your way. Yes… that would be great, you think to yourself as you yawn…", parse);
		Text.Flush();

		TimeStep({minute: 30});

		Gui.NextPrompt();
	}

	export function CockSize(parse: any, p1cock: Cock) {
		const len = p1cock.Len();
		const girth = p1cock.Thickness();

		if (len < 15) {
			Text.Add("The length might not be too impressive, but it still feels as good as any other penis might. Plus you know what they say… size doesn’t matter if you don’t know how to use it!", parse);
		} else if (len < 25) {
			Text.Add("In terms of length, you’re pretty average you’d say. Sure, you won’t be bottoming out on anyone but the smallest of partners, but there’s enough cock here to give them a nice pole to ride their climax out. And there’s more than a little for you to play with too!", parse);
		} else {
			Text.Add("There’s no way to describe your cock other than <i>big</i>. With your size, you wouldn’t be surprised if you bottomed on most partners, not that this would be a problem. There’s something to be said about having a dick so big you can fill anyone up with cock-flesh. Not to mention you can also stroke their deepest reaches!", parse);
		}
		Text.NL();
		if (girth < 3) {
			Text.Add("You’re not very broad, and depending on your partner, that might be good. If you were too large, you’d need to take a lot of care when penetrating, but with your current girth, you’re pretty sure you can stab your manhood in any orifice without much worry. Plus it’s great that you can wrap your whole hand around it.", parse);
		} else if (girth < 6) {
			Text.Add("You’re thick enough that you’d need some care when splitting open a tight hole. It might hurt a bit at first, but it’ll feel great once they get used to it, plus this gives your whole member a lot more area to feel said <i>tight holes</i> squeezing you down.", parse);
		} else {
			Text.Add("Your penis is a real monster. It’s so thick that you can barely get your hand to close around its impressive girth. With a dick this large, any hole feels like a skin-tight cocksleeve. Sure, you have to work and be careful whenever you decide to stick it in someone, but nothing beats that tight feeling all around your shaft...", parse);
		}
		Text.NL();
	}

	export function CockSlut(parse: any, p1cock: Cock) {
		const player: Entity = GAME().player;
		if (player.Slut() >= 30) {
			Text.Add("In a bid to further increase your enjoyment, you gather some of your pre-ejaculate and take the musky liquid to your mouth, where you lap it all off your hand. Damn, you taste great!", parse);
			if (player.Slut() >= 50 && (p1cock.Len() >= 25 || player.IsFlexible())) {
				Text.Add(" You have half a mind to blow yourself… but you’ll do that some other time. After all, you’re looking forward to what awaits you in the end of this little personal session...", parse);
			}
			Text.NL();
		}
	}

	export function CockKnot(parse: any, p1cock: Cock) {
		if (p1cock.Knot()) {
			Text.Add("Your mounting excitement causes your knot to bloat up like a balloon, and you adapt by sparing a hand to squeeze it. It feels great! Each squeeze makes a small rope of pre to spew from your [cockTip] and makes your knot grow ever larger. When you tire of that, you move your hand just behind the bulbous mass to hold tightly to the base of your dick. Doing this, it’s almost like you’d tied someone!", parse);
			Text.NL();
		}
	}

	/* TODO

	*/

	export function AnalOpening(func: CallableFunction, obj?: any) {
		const player: Entity = GAME().player;
		let parse: any = {
			toparmordesc : player.ArmorDesc(),
			bottomarmordesc : player.LowerArmorDesc(),
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);

		const lusty = player.LustLevel() >= 0.7;

		Text.Clear();
		const fullArm = player.Armor() ? (player.Armor().subtype === ItemSubtype.FullArmor) : false;
		parse.arm = player.LowerArmor() && fullArm ? Text.Parse(", quickly followed by your [bottomarmordesc]", parse) : "";
		Text.Add("After a final check to make sure that you’re well alone and won’t be interrupted, you find a comfortable spot to settle down in and begin disrobing yourself with glee. Soon, your [armor] falls to the ground[arm], leaving you in your birthday suit. ", parse);
		if (lusty) {
			Text.Add("You’ve been waiting a long time to scratch this particular itch - it’s been nagging at the back of your mind for far too long now - and get to it brimming with excitement.", parse);
		} else {
			Text.Add("Time to get to it, then! Some relief for that itch in the back of your mind would be nice.", parse);
		}
		Text.NL();
		Text.Add("Gleefully, you place your hands on your [hips], then reach around for your [butt]. Grasping each", parse);
		const buttSize = player.Butt().Size();
		if (buttSize > 9) {
			Text.Add(" lush and bountiful", parse);
		} else if (buttSize > 5) {
			Text.Add(" ample", parse);
		}
		Text.Add(" butt cheek in hand, you slowly pry them apart until you can feel cool air pass directly along your stretched sphincter, and shiver at the knowledge of what you’re about to do. Arousal surges in your breast at the lewd thoughts that pass unbidden through your mind.", parse);
		Text.NL();
		Text.Add("No time to waste. ", parse);
		if (player.FirstVag()) {
			Text.Add("You briefly move your fingers to your [vag], sliding them into your honeypot and retrieving a small coating of feminine nectar on your digits, perfect natural lube for the deed you’re about to do.", parse);
			if (lusty) {
				Text.Add(" Your slick and moist [vag] cries out with the need to be sated and pounded silly, but alas, that is not its fate today.", parse);
			}
		} else if (player.FirstCock()) {
			Text.Add("You brush your fingers against the tip[s] of your [cocks], swiping some of the slick pre that’s begun to bead on the half-erect shafts. Mmm, smooth and slippery… this’ll do just fine for lube.", parse);
			if (lusty) {
				Text.Add(" Although your [cocks] yearn[notS] to be the primary recipient of your lavished attentions, twitching slightly as [itThey] sense[notS] your increasingly lustful bent of mind, it is not to be this day.", parse);
			}
		} else {
			Text.Add("You divert a couple of fingers to your mouth and smear them with spit, taking care to get as much as you can onto it. Not the best when it comes to these things, but it’ll do in a pinch.", parse);
		}
		Text.Add(" With that done, you reach behind you once more and smear the impromptu lube all over your pucker, preparing it for what you have in mind.", parse);
		Text.NL();

		func(parse, obj);
	}

	export function AnalFingerCockblock(parse: any, cum: number) {
		const player: Entity = GAME().player;
		if (player.FirstCock()) {
			Text.Add("Unable to take the pounding at your prostate any longer, your [cocks] choose[notS] this moment to shoot off [itsTheir] load, string after string of hot, sticky seed arcing into the air and landing on the ground a good distance away. All the anticipation and stimulation seems to have done you good - your current load of semen looks much thicker and richer than normal, speaking well of your prostate-milking skills.", parse);
			if (cum > 9) {
				Text.Add(" It seems never-ending, the viscous, white flow that’s practically inhuman to behold. More and more sperm just keeps on coming out of your [cockTip] like an overflowing font, your prostate and balls working together in blissful union to flood your surroundings with as much seed as they can summon up.", parse);
			} else if (cum > 6) {
				Text.Add(" You’ve certainly got quite the reserve of sperm in you, make even more voluminous by the attention you’ve lavished upon your prostate. Despite the long, bountiful spurts of seed blasting from your [cockTip],  spurts that leave little doubt as to your virility, it takes a good while for you to be drained of every last drop.", parse);
			}
			Text.NL();
		}
	}

	export function AnalFinger(parse: any) {
		const player: Entity = GAME().player;
		const cap = player.Butt().Cap();
		const br = player.FirstBreastRow().Size();

		Text.Add("Grasping each side of your sphincter with a finger each, you begin to force it apart. ", parse);
		if (cap > 10) {
			Text.Add("Well-trained and eager to get started already, your pucker may be normally tight, but yields easily enough under your questing digits. With such rousing success, you can’t help but feel a surge of pride at how well your butt’s adapted into becoming a veritable receptacle for cocks - and perhaps other things as well...", parse);
		} else if (cap > 5) {
			Text.Add("There’s some instinctive reluctance on the part of your pucker to being opened like this, but you nevertheless stay the course until the deed is done. This’ll probably get easier with more training…", parse);
		} else {
			Text.Add("There’s considerable resistance to your efforts and you wonder if your questing digits are going to cramp from the effort, but at last the deed is done, if not without difficulty.", parse);
		}
		Text.NL();
		Text.Add("Before too long, you’ve slipped in a finger into the warm, tight confines of your [anus], squirming away shamelessly as you probe the dank depths and send another from the same hand to join it.", parse);
		if (player.FirstCock()) {
			Text.Add(" It’s not long before you manage to find the vaunted prize - your questing fingertips brush against the soft rise of your prostate, sending an electric surge of excitement and arousal through your entire body.", parse);
			Text.NL();
			Text.Add("Barely has the first one died down before you rub it again, more insistently this time; eyes rolling back into your head, you twist and squirm shamelessly with evoked pleasure even as your [cocks] rush[notEs] to full mast, beads of pre rapidly turning into dribbles at the stimulation [itsTheyre] receiving.", parse);
		}
		Text.NL();
		if (br >= 2) {
			Text.Add("At the same time, your free hand finds its way to your [breasts], gently kneading the ", parse);
			if (br > 12.5) {
				Text.Add("heavy and plentiful mounds in turn, causing them to jiggle and quake in the most salacious manner while you deal with your ass down below.", parse);
			} else if (br > 5) {
				Text.Add("ample mounds one by one. Each of your milk-cans is just large enough for one hand to almost engulf, making them just the right size for lavishing your attentions upon while you finger your [anus]. You do just that, shamelessly molesting yourself and moaning a little more loudly than necessary in the process, assaulted by waves of pleasure from both ends.", parse);
			} else {
				Text.Add("small, perky things and making sure they’re well-attended to, even as you concentrate on fingering your [anus] from below. Sure, they’re not very hefty, but that just makes things more concentrated, right?", parse);
			}
			Text.NL();
			Text.Add("Slowly, you close in on your areolae and nipples, pulling and tweaking away roughly to mirror the vigor with which your butthole is being invaded with your other hand. Without needing to even think about it, your fingers pull and tease away in time with your fingering, both ends working in tandem to grant you as much pleasure as they can muster.", parse);
			Text.NL();
			if (player.Lactation()) {
				Text.Add("At the same time, a small stream of milk bursts forth from each of your [nips], giving in to the gentle milking and moistening your fingers with lactate. The milk’s flow runs off your [breasts] and down your sides, dripping onto the ground shamelessly, testament to your productive nature.", parse);
				Text.NL();
			}
		}
		if (player.FirstVag()) {
			Text.Add("So close, too, and yet so far: your loins burn with unrequited desire, a dribble of girl-juices oozes from your folds and works its way down your taint to your butthole, the warm trickle making its presence keenly felt every step of the way until it finally joins up with your finger.", parse);
			Text.NL();
			Text.Add("The squelching noises that result are more than a little satisfying for both body and mind, and you gasp, every inch of your being slowly consumed by the mounting pleasure you’re experiencing. Your groin and hips… ", parse);
			if (player.sexlevel >= 3) {
				Text.Add("no matter how many times you experience it, it’s still hard to believe so much orgiastic sensation can be packed into so little flesh.", parse);
			} else {
				Text.Add("it’s hard to wrap your mind properly about how much orgiastic sensation you’re experiencing in so small a space.", parse);
			}
			Text.NL();
		}
		Text.Add("At last, though, you can practically taste the release coming upon you, the sea going out just shortly before the massive wave makes its landfall. With one final push, you drive yourself soundly over the edge, and an animal noise halfway between a moan and a scream forces its way out from between your lips, announcing your climax for all to hear. You convulse and lash out as every last inch of your body revels in its shared bliss.", parse);
		Text.NL();

		const cum = player.OrgasmCum(2);

		MasturbationScenes.AnalFingerCockblock(parse, cum);

		if (player.FirstVag()) {
			Text.Add("At the same time, your [vag] goes into overdrive, oozing and clenching away, desperate for something to suckle on and finally settling for squirting a small stream of girl-cum to splatter on yourself and stain your crotch as your climax approaches its zenith. Caught up in a whirlwind of exquisite sensations, you howl like ", parse);
			if (player.RaceCompare(Race.Canine) >= 0.4) {
				Text.Add("the bitch that you are", parse);
			} else {
				Text.Add("a bitch in heat", parse);
			}
			parse.l = player.HasLegs() ? "the space between your legs" : "your crotch";
			Text.Add(", your entire world reduced to [l].", parse);
			Text.NL();
		}
		Text.Add("By and large, though, the pleasure eventually fades, leaving you to extricate your finger from your [anus] in due course. Panting, your lungs heaving with the occasional moan, you just lie for a bit on the ground until you’re ready to be on your feet again, your lusts sated - for now, that is.", parse);
		Text.Flush();

		TimeStep({minute: 30});

		Gui.NextPrompt();
	}

	export function AnalToy(parse: any, toy: ItemToy) {
		const player: Entity = GAME().player;
		const cap = player.Butt().Cap();
		const br = player.FirstBreastRow().Size();

		parse.toy = toy.sDesc();
		parse.toyTip = toy.cock.TipShort();

		Text.Add("Reaching for your [toy], you giddily bring its length around behind you, sliding it between your ass cheeks, feeling that hardness grind against your [anus] as you bring it into position. No time like the present, then - taking a deep breath and preparing yourself, you push downwards firmly on the [toy], easing it inside you.", parse);
		Text.NL();
		if (cap > 10) {
			Text.Add("Your pliant, stretchy sphincter is extremely well-trained - tight and yet elastic, it easily swallows up your [toy]’s [toyTip] without a hitch. Encouraged by this early success, you push downwards a bit more insistently, and are rewarded with your ass eagerly taking in all it can. You’ve sure turned into a happy buttslut, haven’t you?", parse);
		} else {
			Text.Add("There <i>is</i> a little difficulty, a little unease - a toy is much thicker than your average finger, after all, and it seems like you’re not as well-trained as you’d like to be. Nevertheless, you manage to wiggle it past your [anus]’s instinctive resistance, stretching the ring of muscle wide enough for you to slide the toy’s [toyTip] past and into your warm depths.", parse);
			Text.NL();
			Text.Add("From there, it’s just a matter of steeling yourself and being insistent, and soon enough you’re rewarded with a jolt of pleasure as your [toy] sinks further into you.", parse);
		}
		Text.NL();
		Text.Add("Instead of pumping the [toy]’s length up and down like you might have for a cunt, you instead begin to grind it in small circles, your [anus] shifting and twisting with the motions even as you feel the [toyTip] rub against your insides, your breathing coming quick and short even as your hands’ movements grow ever more anxious and jerky.", parse);
		if (player.FirstCock()) {
			Text.Add(" Thus simulated, tendrils of exquisite pleasure begin to reach outward from your prostate and up along your spine. Unbidden, a loud, languid moan escapes your lips as your jaw goes slack, and you almost - <i>almost</i> lose control of your toy, letting it slip out of your hands for a moment. Thankfully, you quickly right yourself, eager for more of that delicious yet fleeting pleasure, and shove your [toy] deeper into your [anus], this time with <i>feeling</i>.", parse);
			Text.NL();
			Text.Add("And what a feeling it is. Your [cocks], already fully at attention, tremble[notS] and throb[notS] as the tip of your toy mashes itself against your love-bump over and over again, the occasional drip of pre turning into small, steady stream[s] as pleasure and exhilaration alike grow. At some point, you’re vaguely aware of the fact that [itsTheyre] painfully erect, but any discomfort at this fact is quickly drowned out by the waves of pleasure that’re crashing against your consciousness.", parse);
			Text.NL();
			parse.m = player.mfTrue("man-", "");
			Text.Add("There’s little doubt that you’re that here and now, you’re a shameless buttslut of a [m]whore, but it feels so good that you couldn’t care less.", parse);
			Text.NL();
		}
		if (br >= 2) {
			Text.Add("At the same time, you realize that your [breasts] are starting to ache terribly with need as well, your beady nipples hard as pebbles. Another itch to be scratched, yet you don’t want to stop the wonderful blissplosions going on in your [anus]… slowly, carefully, you move one hand upwards to your chest while the other continues working away with your [toy].", parse);
			Text.NL();
			if (br > 12.5) {
				Text.Add("At long last, your fingers make contact with those more-than-ample mounds of heated breastflesh that sit on your chest, flush with tension and desire. You make sure to try and molest yourself in an even manner, although with the way the full, teardrop-shaped mammaries jiggle and shake about, your mind is increasingly occupied with reveling in the sensation of full weight that they’re providing.", parse);
			} else if (br > 4) {
				Text.Add("It’s not long before your fingertips make contact with your ripe, well-proportioned dugs, swollen slightly with a flush of desire. You let your fingers lie on heated breastflesh for a little while, feeling the throb and pulse of desire just below the skin, then press into that tender mix.", parse);
				Text.NL();
				Text.Add("For a good, long while, you let your hands roam where they will, fingers sinking into your needy boobs as you work out all the pent-up tension in them. They’re so firm and yet have the required mass and heft to them, it’s hard not to want to just dig in with wanton abandon, no matter how much you may pay for it later.", parse);
			} else {
				Text.Add("Since there isn’t that much in the way of boobflesh for you to work with, flushed as you are, your fingers seize upon your nipples, rolling the hard little nubs of sensitive flesh between thumb and forefinger in turn. Thus stimulated, you gasp and moan even as you feel your already engorged nipple harden even further, bringing you ever closer to the edge of bliss you so crave.", parse);
				Text.NL();
				Text.Add("Slowly, you slide your touch down your nipple to the swollen areolae that form its base, poking, tweaking and rubbing away to produce the best feeling of sensuous satiation you’ve had in a while now.", parse);
			}
			Text.NL();
			Text.Add("Unconsciously, your fingers work in tandem with your [toy], driving you to ever greater heights of ecstasy that turn you into a whimpering, moaning wreck, slave to the blissful sensations that you’re inflicting upon yourself.", parse);
			const milk = player.Milk();
			if (player.Lactation()) {
				if (milk > 10) {
					Text.Add("Spurts of milk blast from your [nips], eagerly released thanks to the internal pressure within your breasts, and you watch the thin streams with rapt fascination as they rise and fall in glorious arcs.", parse);
				} else {
					Text.Add("Streams of milk spurt from your nips, squeezed out from your reserves thanks to your gratuitous groping. They arc a little way into the air before splashing messily on your chest and running off onto the ground, leaving trails of moist warmth in their wake.", parse);
				}

				player.LactHandler().MilkDrain(2);
			}
		}
		Text.NL();

		player.Butt().StretchOrifice(player, toy.cock, false);

		const cum = player.OrgasmCum(2);

		MasturbationScenes.AnalFingerCockblock(parse, cum);

		if (player.FirstVag()) {
			Text.Add("Sharing in the pleasures of your entire body, your [vag] clenches greedily, practically dripping with girl-cum as if the [toy] were pounding away at it and not in your [anus]. You can’t help but squeeze your eyes shut and grit your teeth as your [vag] pulses with heat, the inner walls of your love tunnel practically undulating as they seek something, <i>anything</i> to take into them and sate the desperate hunger of your womb.", parse);
			Text.NL();
		}
		Text.Add("With a final, desperate push, you slam down the [toy] into your [anus] as far as it’ll go, shuddering at the sheer brutal force that’s being applied to your tender insides. That’s enough to set you over the edge; dropping everything, you brainlessly claw at the ground with stiff fingers, trying to find purchase against the orgiastic sensations that threaten to sweep you away. Tears well up in your eyes, and when you’re finally aware of it, you realize you’ve been holding your breath for a good long while now.", parse);
		Text.NL();
		Text.Add("It’s only when the climax passes that you relax and sag a little in its wake, although it still takes a little while before you work up the strength or presence of mind to remove the [toy] from your [anus], pulling it free with a wet, slurping sound. Yes… this certainly blew off all that steam you’d been building up.", parse);
		Text.Flush();

		TimeStep({minute: 30});

		Gui.NextPrompt();
	}

	// Generic opening scene. Sets up all parser stuff and calls the scene proper
	export function VagOpening(func: CallableFunction, obj?: any) {
		const player: Entity = GAME().player;
		let parse: any = {
			toparmordesc : player.ArmorDesc(),
			bottomarmordesc : player.LowerArmorDesc(),
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);

		Text.Clear();
		const armor = (player.topArmorSlot && player.botArmorSlot);
		parse.arm = Text.Parse(armor ? "both [toparmordesc] and [bottomarmordesc]" : "your [armor]", parse);
		Text.Add("Wasting no time, you find a comfortable spot, divesting yourself of [arm] before ", parse);
		if (player.HasLegs()) {
			Text.Add("lying down on the ground and spreading your legs wide, allowing you easy access to your [vag].", parse);
		} else {
			Text.Add("stretching out on the ground, exposing your [vag] for the world to see.", parse);
		}
		Text.Add(" With a soft sigh, you make sure you’re completely comfortable before snaking a hand down across your [belly] and over your [hips] to get at your netherlips, gently testing them with your fingertips in foreplay of sorts. ", parse);
		if (player.LustLevel() > 0.66) {
			Text.Add("As you explore yourself, it soon becomes painfully obvious your mounting arousal is making itself known. The petals of your womanly flower are swollen and puffy with heat and excitement, a thin sheen of nectar already coating the outermost ones - not to mention what’s to be had further within.", parse);
			Text.NL();
			Text.Add("As you tease and test away, a flush of arousal springs up from your groin and into your lower belly, causing you to moan with anticipation.", parse);
		} else {
			Text.Add("Tenderly, you begin to rub at your outermost folds, tingles of arousal sparking outwards from the contact and collecting in your lower belly. As the sensation of heat grows, you can feel the petals of your womanly flower swelling and moistening beneath your fingers, which only drives you to be a little more insistent in your ministrations.", parse);
		}
		Text.NL();
		Text.Add("The soft scent of feminine excitement is making itself known to you even as your slit grows wetter and wetter, and you begin in earnest. ", parse);

		// Call scene proper
		func(parse, obj);
	}

	export function VagFingerCockblock(parse: any, cum: number) {
		const player: Entity = GAME().player;
		if (player.FirstCock()) {
			Text.Add("At the same time, your [cocks] choose[notS] this moment to shoot off [itsTheir] load, string after string of hot, sticky seed arcing into the air and landing on the ground a good distance away with a series of wet-sounding splats.", parse);
			if (cum > 9) {
				Text.Add(" It seems never-ending, the viscous, white flow - more and more sperm just keeps on coming out of your [cockTip], spraying out like a fire hose with just as much quantity and force, forming large puddles on the ground.", parse);
			} else if (cum > 6) {
				Text.Add(" You’ve certainly got quite the reserve of sperm in you - it’s a long while before you actually start to feel dry, despite the considerable amounts of spooge that blast forth from your [cockTip], creating small puddles on the ground before you.", parse);
			}
			Text.NL();
		}
	}

	export function VagFinger(parse: any) {
		const player: Entity = GAME().player;
		// Fisting is triggered with wide hips wide cunt. Else, default to fingering.
		const cap = (player.body.torso.hipSize.Get() / 10) * (player.FirstVag().Cap() / 5);
		const fisting = cap >= 1;

		const preg = player.PregHandler().IsPregnant();
		const bellySize = player.PregHandler().BellySize();

		Text.Add("Slowly, you press a finger to your netherlips, pushing against them as your digit seeks entry into your heat-filled honeypot. There’s a brief, momentary resistance, and then it slips within, your inner walls eagerly welcoming the intrusion and the relief it brings to your engorged, needy folds. Your thumb’s still outside, and it’s that which you draw against your clitoral hood, feeling for your love-button. Erect as it is, it doesn’t take long for your searching thumb to hit home, and you’re rewarded with a spark of electricity that jolts up your spine and leaves you feeling weak all over.", parse);
		Text.NL();
		if (fisting) {
			Text.Add("After you’ve recovered enough, you slip in more and more fingers - another and another and another, until your slit’s stretched wide. Yet this is still not enough to sate your hungry cunt, and so with a determined push, you slide in your entire fist in. Your wrist grazes against your [clit], and you fight to bite back a whorish moan as tears well up in your eyes at the wondrous sensations of <i>fullness</i> in your tunnel, your inner walls pulsing and undulating about the intrusion.", parse);
		} else {
			Text.Add("It takes a few moments for you to recover enough in order to continue, but when you do, you more than eagerly slip in another finger, followed by another, until you’re fully sunk up to your palm in your snatch. Your inner walls are more than eager to accept the intrusion, pulsing and flexing about your fingers as it tries to draw them further into yourself. Unable to contain yourself, you let out a shuddering moan even as a fresh flow of nectar gushes from your honeypot, coating your fingers until they glisten.", parse);
		}
		Text.NL();
		Text.Add("Not to be left out, your other hand finds its way to your [breasts], and from there to your [nips]. Even as you work away furiously at your [vag], you begin to eagerly tease each sensitive bud in turn", parse);
		if (player.Lactation()) {
			Text.Add(", allowing dribbles of milk to escape your [breasts]", parse);
			if (preg) {
				Text.Add(". This is even made all the more pleasurable by your milk-jugs’ swollen, hormonal state, courtesy of your pregnancy", parse);
			}
		}
		parse.fist = fisting ? "fist" : "fingers";
		Text.Add(". The resultant jolts of orgiastic delight that wrack your body have you whimpering as your body twists this way and that, assaulted from both ends by your self-inflicted pleasure. With one back-arching plunge, you work your [fist] in and out of your [vag], thrusting again and again as far as you’ll go, so hard that the wet squelches of feminine bliss are distinctly audible amidst your moans.", parse);
		Text.NL();
		if (fisting && player.IsFlexible()) {
			const race = player.body.torso.race;
			parse.race = race.isRace(Race.Human) ? "flexible" : race.qShort();
			Text.Add("Thanks to your [race] body, you’re able to contort yourself to the point where you’re able to plant your fist far further up your greedy cunt than others would have managed. Guess there’s something to be said for manual dexterity, after all, even if it isn’t what would immediately come to most peoples’ minds.", parse);
			Text.NL();
		}
		Text.Add("In and out, in and out, each thrust bringing with it more pleasure than the last, each hump and grind against your completely soaked [fist] resulting in louder and louder cries of pleasure, despite your attempts to muffle them.", parse);
		if (bellySize > 0.25) {
			Text.Add(" Almost of its own accord, your free hand slips from your [breasts] to your [belly], rubbing, stroking, caressing away at the swell of your baby bump as your current pleasures remind you of just how you ended up like this. It’s a pretty good memory…", parse);
		}
		Text.NL();
		parse.fes = fisting ? "es" : "";
		Text.Add("Not that you could stop even if you wanted to, or even hold back for much longer. Back and forth your [fist] go[fes], your body moving of its own accord in a desperate attempt to slake the lusts you’ve ignited in your impassioned body. Burning with heat, your eyes rolled back and jaws slack as little moans and whimpers escape your mouth, you take the last few steps required to bring yourself to an earth-shattering climax.", parse);
		Text.NL();
		Text.Add("And it happens. Yowling like ", parse);
		if (player.RaceCompare(Race.Feline) >= 0.4) {
			Text.Add("the cat in heat that you are,", parse);
		} else {
			Text.Add("a cat in heat,", parse);
		}
		Text.Add(" you arch your back and stiffen your body as the throes of orgasm consume you, your body completely out of your control at this point. Copious amounts of girl-cum burst forth from your love-tunnel, ", parse);
		if (fisting) {
			Text.Add("wetting your wrist and trickling freely down your forearm. Your silken insides clench for dear life onto the intruding fist, desperately milking it as if it were a real cock, hoping for some seed for your cum-hungry insides.", parse);
		} else {
			Text.Add("bursting out about your fingers and completely soaking your hand and wrist before oozing onto the ground. Your silken insides clench like a vise about the intruding digits, desperately seeking to milk them as if they were a real cock, clearly hopeful for <i>some</i> form of seed to draw into you.", parse);
		}
		Text.NL();

		const cum = player.OrgasmCum(2);

		MasturbationScenes.VagFingerCockblock(parse, cum);

		Text.Add("Drained and exhausted, you slump onto your back, eyes staring upwards blankly and lungs heaving as the last vestiges of orgasm slowly begin to die away. Well, this was what you wanted, wasn’t it? You got it well and good, then - it’ll be a little while before you’ll be able to be on your way, but it was worth it.", parse);
		Text.Flush();

		TimeStep({minute: 30});

		Gui.NextPrompt();
	}

	export function VagToy(parse: any, toy: ItemToy) {
		const player: Entity = GAME().player;
		const preg = player.PregHandler().IsPregnant();
		const bellySize = player.PregHandler().BellySize();

		parse.toy = toy.sDesc();

		Text.Add("Remembering your [toy], you reach for it - happily, it seems to have fallen within easy grasp when you were getting rid of your gear - and take it in hand. Yeah… <i>now</i> you remember why you bought this thing - it’s so big, so <i>thick</i>...", parse);
		Text.NL();
		Text.Add("A flush of arousal runs through your groin as lewd thoughts race through your mind, and reaching down with your [toy] firmly in hand, you press its tip against your netherlips. You gasp softly, the sound quickly turning into quiet moans as you begin to grind the toy’s length along your increasingly swollen and sensitive folds. The toy’s shaft feels cool as your heated lips kiss it, leaving behind a trail of love juices along its length.", parse);
		Text.NL();
		Text.Add("You ache to just get things over with and plunge it into your waiting nethers already, but force yourself to hold back. Although your hands are trembling with anticipation, you slowly insert your [toy] into your heated slit, feeling just the briefest resistance at your netherlips before they part and the toy’s tip sinks into you - just barely so. Arching your back and stifling a whimper of pleasure, you pull it out, then plunge it in once more.", parse);
		Text.NL();
		Text.Add("In. Out. In. Out. Each time, you thrust the [toy] a little deeper, each time, you go a little faster. Eventually, it gets to the point where you wouldn’t be able to stop even if you wanted to - your hips have begun moving with a mind of their own, bucking and rocking against the delicious length currently invading your insides", parse);
		if (player.FirstBreastRow().Size() >= 2) {
			Text.Add(", your [breasts] flopping up and down on your chest", parse);
			if (player.Lactation()) {
				Text.Add(" spraying drops of milk hither and thither", parse);
			}
		}
		Text.Add(" even as your arm becomes a furious blur, determined to wring as much pleasure out of this activity as possible. Each second becomes a full orgy of blissplosions radiating outwards from your nethers and into the rest of your body as your love tunnel squeezes down hard on your [toy], as desperate and needy as if it were the real thing currently fucking you senseless.", parse);
		Text.NL();
		Text.Add("Head thrown back, tongue hanging out of your mouth, you pant ", parse);
		if (player.RaceCompare(Race.Canine) >= 0.4) {
			Text.Add("like the heat-driven bitch that you are", parse);
		} else {
			Text.Add("like a bitch in heat", parse);
		}
		Text.Add(" before finally surrendering in a explosion of girl-cum that sends you to convulsing, both on the inside and the outside. Sweet nectar coats toy and hand alike as pleasure turns you into a quivering mass of jelly, and you feel like someone’s kicked you in the lungs, with much the same effect.", parse);
		Text.NL();

		player.FirstVag().StretchOrifice(player, toy.cock, false);

		const cum = player.OrgasmCum(2);

		MasturbationScenes.VagFingerCockblock(parse, cum);

		Text.Add("At long last, it seems to be over. You’re not sure exactly how much time has passed with you lying insensate on the ground, but at last you manage to summon enough strength to pull your [toy] free of you. It parts from your [vag] with a wet slurp, and you shiver at the sensations the movement brings before rolling over with a groan. You’ll have to get up sometime, yes, but for now… maybe you’ll just lie here a little longer.", parse);
		Text.Flush();

		TimeStep({minute: 30});

		Gui.NextPrompt();
	}

	export function VagTailfuck(parse: any) {
		const player: Entity = GAME().player;
		const preg = player.PregHandler().IsPregnant();
		const bellySize = player.PregHandler().BellySize();

		const br = player.FirstBreastRow().Size();

		Text.Add("Slowly, you begin sliding a finger down your hips to your heat-filled slit, but remember that you’ve a better way of dealing with this. Whipping your tail about, you position it such that its tip lingers just above your netherlips, gently grazing it and sending a thrill down your spine. Anyone can finger themselves, but this… yeah, this is something exotically different and dangerous.", parse);
		Text.NL();
		Text.Add("No point in dragging things out, then. Drawing a deep breath, you push your tail-tip insistently against your [vag], feeling the petals of your womanly flower part after a brief resistance, admitting the invasive appendage into your love-tunnel. The tip slides delightfully against your silken insides, and you shudder, your walls instinctively clenching about what they believe to be a male’s member, trying to draw it further into you.", parse);
		Text.NL();
		if (br >= 2) {
			Text.Add("The best part of this exercise? With both hands free, you’re given free rein to grope and molest yourself in the most shameful manner. Greedily, you grab your [breasts], ", parse);
			if (br < 4) {
				Text.Add("easily cupping them, one palm to each perky mound. Clenching and flexing your fingers, you squeeze away shamelessly, the heel of your hand grinding against your increasingly stiff and engorged nipples. Unbidden, a flush of heat erupts just under your collarbone, leaving you panting and gasping for breath.", parse);
			} else { // large
				Text.Add("cupping the rounded ends of your [breasts] as best as they can, excess boobage running over from the cups of your palms. Tenderly, you begin to stroke and caress your lady lumps, paying extra attention to the areolae and nipples even as a rush of heat creeps in under your collarbone, leaving you short of breath.", parse);
			}
			Text.NL();
			if (player.Lactation()) {
				Text.Add("With all this stimulation going on, it’s not long before beads of milk start leaking from your [nips] in earnest, lubricant of sorts for the rough groping you’re inflicting upon yourself.", parse);
				Text.NL();
			}
			Text.Add("As above, so below - the pleasure in your [breasts] is matched by that which is coming from your tail as it thrusts into your [vag] over and over again. You don’t have perfect control over it, making the process a little haphazard, but being assaulted with pleasure on all three fronts like this is fast turning you into a quivering, brainless wreck.", parse);
			Text.NL();
		} else if (player.FirstCock()) {
			Text.Add("Since your tail’s more than adequate to deal with your [vag], you turn your hands to your [cocks]. Responding to your growing arousal in their own fashion, your shaft[s] [hasHave] grown painfully erect, a throbbing, twitching mass of manflesh sharing in the bliss that your [vag] is experiencing, pre-cum welling up in [itsTheir] tip[notS] as [itThey] beg[notS] for a nice, warm sleeve to thrust into.", parse);
			Text.NL();
			Text.Add("That’s where your hands find purchase: stroking and rubbing away, you concentrate the electric tingles radiating outwards from your groin to near-unbearable levels, moving you closer and closer to that blessed, blissful, brainless state of fucking many can only dream of.", parse);
			Text.NL();
		}
		Text.Add("With a loud, needy groan, you begin to fuck your tail in earnest - or is it your tail fucking you? Who knows? What matters is that you arch your back and pound your hips against your glistening, cum-stained tail-tip, the two moving back and forth in tandem so as to plunge as deeply into your [vag] as your flexibility will accommodate.", parse);
		Text.NL();
		if (bellySize > 0.25) {
			Text.Add("Panting and groaning lustfully, you momentarily move your hands to the full roundness of your [belly]. ", parse);
			if (bellySize > 0.9) {
				Text.Add("Running your touch all over the firm, taut surface of your stuffed womb, you think back to just how you ended up looking like this, and have to bite back a moan at the pleasant memories that particular train of thought conjures up - only made all the more intense with how deeply and furiously your own tail is fucking you.", parse);
			} else {
				Text.Add("For some reason, running your fingers all over your steadily growing baby bump makes you feel immensely satisfied… and sexy. With all the extra sensitivity, just rubbing and caressing your half-filled womb is making you more and more aroused, a situation that isn’t helped by the brutal fucking that your own tail is inflicting on you.", parse);
			}
			Text.NL();
		}
		Text.Add("Eventually, things get to the point where you lose track of time altogether, just moving back and forth against your tail-tip as if you were possessed. Back arched, hips bucking, body on autopilot, you couldn’t stop even if you had the mind to - all that your mind is focused on is hammering yourself over and over again until you lose it.", parse);
		Text.NL();
		Text.Add("And you do. With an earth-shattering orgasm that sends your entire body to shaking, you spray out copious amounts of girl-cum onto your tail and all over your crotch. Deep within you, your insides desperately twist and squirm, and several shudders run through your entire form as the climax runs its course.", parse);
		Text.NL();

		const cum = player.OrgasmCum(2);

		MasturbationScenes.VagFingerCockblock(parse, cum);

		Text.Add("At last, the aftershocks of pleasure begin to die away, leaving you equally drained and exhilarated as you lie limply on the ground, chest heaving as great gouts of hot breath escape your mouth. Your head continues to spin a little, but by and large you manage to get a tenuous grip on yourself and clamber upright. A moment more, and you’re dressed once more and ready to be off.", parse);
		Text.Flush();

		TimeStep({minute: 30});

		Gui.NextPrompt();
	}

	export function Breasts() {
		const player: Entity = GAME().player;
		const party: Party = GAME().party;
		let parse: any = {

		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);

		const size   = player.FirstBreastRow().Size();
		const small  = size <= 4;
		const medium = size <= 10;
		const large  = !medium;

		const milk = player.Milk();
		const milkFull = player.LactHandler().MilkLevel() > 0.8;
		const preg = player.PregHandler().IsPregnant();

		Text.Clear();
		Text.Add("You quickly strip yourself of your [armor], letting it fall to the ground while you sequester your other belongings away safely.", parse);
		if (milkFull) {
			Text.Add(" Your [breasts] have been painfully full for a while now, and you can’t wait to relieve them of their milky load.", parse);
		}
		if (preg) {
			Text.Add(" The fact that your pregnancy has only served to increase production <i>and</i> turn your milk-jugs more tender doesn’t help your predicament, either.", parse);
		}
		Text.NL();
		Text.Add("Released from their confines, your [breasts] flop out into open, feeling much more comfortable with cool, fresh air passing over them unimpeded. ", parse);
		if (small) {
			Text.Add("The small, perky mounds you sport may not be the most impressive - a fact that holds doubly true on Eden - but they have their own benefits, such as not getting in the way. A better way of looking at it is that they aren’t small, but petite or even better, fun-sized.", parse);
		} else if (medium) {
			Text.Add("The pair of funbags you sport are of healthy proportions - large enough for most fun activities, but not big to the point of being obtrusive or cumbersome. There’s enough weight to them, ", parse);
			if (milkFull) {
				Text.Add("plus the additional mass that their milky cargo holds, ", parse);
			}
			Text.Add("and the resultant heft causes just the slightest bit of sag - enough for them to show their proudly feminine bent.", parse);
			Text.NL();
			Text.Add("All in all, a very respectable pair of baby-feeders.", parse);
		} else { // large
			Text.Add("The pillowy mounds that sit on your chest are truly of glorious proportions. Plush and teardrop-shaped, their firm goodness stands proud for all the world to see", parse);
			if (milkFull) {
				Text.Add(", made only more so by the hefty cargo of nourishment that they’re holding", parse);
			}
			Text.Add(". Their size leaves little room for doubt with regards to their feminine, voluptuous nature, and they heave and quiver on your chest with each breath you take.", parse);
		}
		Text.NL();
		Text.Add("Time to get started, then. You decide to start off slow - raising your hands to your chest, you ", parse);
		if (small) {
			Text.Add("cup each small orb of soft flesh in a palm, then start applying pressure as you rotate your hands in wide circles, kneading and squeezing all the while.", parse);
			if (milkFull) {
				Text.Add(" Small streams of warm milk ooze from your gradually stiffening nipples, working their way through your fingers and trickling down the backs of your hands. It feels good to have a little of the pressure relieved, especially since your small cans aren’t really suited to holding large quantities in and of themselves.", parse);
			}
			Text.Add(" Soft tingles crawl along your skin as you shamelessly molest yourself, and even though you don’t have the fullest of bosoms, you can nevertheless feel heat welling up in your chest as the first flushes of arousal begin to make themselves known.", parse);
		} else {
			Text.Add("support each of your milk cans from the side, your fingers capping your nipples and areolae while the heel of your palms dig into the sides of your [breasts]. That’s better now… stifling a soft moan as a gentle flush of heat erupts on your chest, you press your [breasts] together and begin to knead away, feeling the squeeze and push of your cleavage.", parse);
			if (milkFull) {
				Text.Add(" Failing to withstand the added pressure, small streams of pearly white goodness erupt from your [nips], finally allowed release in any kind of decent quantity. Unable to hold back, you sigh and tremble all over at the sensation of relief that creeps into your [breasts], but the flow stops long before they can even be considered to be slightly drained.", parse);
			}
			Text.Add(" Pushing, rubbing and squeezing away, you shamelessly molest yourself with wanton abandon, feeling your face and collar burn as the flush of arousal becomes more and more prominent.", parse);
		}
		Text.NL();
		Text.Add("Without knowing it, your fingertips have started wandering over to your half-solid [nips], brushing against them in a bid to evoke more pleasure from your self-stimulation. ", parse);
		if (preg) {
			Text.Add("And what a time to do so, too - your pregnancy has caused your [nips] to grow nice and fat in preparation for feeding the offspring that’s steadily getting bigger and stronger in your womb. Far more sensitive, too - the same hormones that’ve caused your [nips] to darken have made them receptive to the slightest touch, such that the tender ministrations of your questing fingers has you gasping and convulsing, the sensations of your fat dugs becoming fully engorged too much for you to handle.", parse);
		} else {
			Text.Add("It feels so good to tweak and stroke them, feeling the little nubs of flesh grow fat and large under your tender fingers.", parse);
			Text.NL();
			if (player.sexlevel >= 3) {
				Text.Add("You know exactly what to do in order to make yourself feel good, and it’s not long before your face is fully flushed with heat, tongue hanging out of your mouth as you pant away. Groping yourself has never been so much more satisfying!", parse);
			} else {
				Text.Add("Even your areolae look bigger and firmer now, eagerly responding to the stimulation they’re receiving, and you can’t help but end up with a dreamy smile on your face as you eagerly explore your body in this fashion.", parse);
			}
		}
		Text.NL();
		Text.Add("Tenderly, you draw circles in your areolae, pausing every so often to tweak each rock-hard nipple between thumb and forefinger, toying with them until the exquisite sensations rippling out into the rest of your body have you moaning like a cheap whore.", parse);
		Text.NL();
		Text.Add("The rest of your body is reacting to your arousal, too.", parse);
		if (player.FirstVag()) {
			parse.l = player.HasLegs() ? "inner thighs" : Text.Parse("[legs]", parse);
			Text.Add(" While your folds may already be wet with anticipation, you’re unable to stifle a cry, nor keep yourself from rubbing your [legs] together as a trickle of warm girl-cum breaks out of your [vag] and streaks down your [l], shamelessly staining your [skin] all over. With you all alone and your hands occupied, looks like its need is going to be unrequited for a little while, though.", parse);
		}
		if (player.FirstCock()) {
			Text.Add(" Your [cocks] jut[notS] forth from your groin, proudly erect and throbbing with pent-up desire. Twitching away like some kind of animal sniffing the air, [itThey] send[notS] urgent signals of anticipation to the back of your mind - signals that, alas, will go unheeded, even as a bead of pre forms on your [cockTip] and oozes to the ground.", parse);
		}
		Text.NL();

		if (milk > 0) {
			Text.Add("With all these lovely sensations welling up in you, it’s about time to get to the good stuff. Feeling for the milky weight that still remains in your [breasts], you grab one in each hand ", parse);
			if (large) {
				Text.Add("as best as you can ", parse);
			}
			Text.Add("and begin squeezing and kneading away furiously, determined to milk yourself dry. Jets of warm baby food spurt out forcefully from your [nips], only adding to the perverse pleasure you’re receiving from your moment of molestation. It feels so good, you feel like you could very well cum from this alone…", parse);
			Text.NL();
			if (preg) {
				Text.Add("…And you do. With how tender and receptive your breasts have become from their pregnant, milky swelling, hormones causing every rub and caress to be keenly felt, the sheer bliss you’re receiving from putting your increasingly delicate [breasts] to their intended use manages to set you off.", parse);
				Text.NL();

				let gen = "";
				if (player.FirstVag()) { gen += "girl-cum squirting from your [vag]"; }
				if (player.FirstVag() && player.FirstCock()) { gen += " and "; }
				if (player.FirstCock()) { gen += "your [cocks] blasting off stream after stream of steaming seed"; }

				parse.gen = Text.Parse(gen, parse);
				Text.Add("You grit your teeth, but can’t help but let out a strangled cry as the orgasm wracks your entire body, [gen]. It’s strong enough to send you staggering, and you place a hand on your [belly] to support it as you gasp for air, desperate to catch your breath and not slip in the growing puddle of sexual fluids you’ve created.", parse);
			} else {
				Text.Add("…But you don’t. While you do come perilously close to the tipping point, leaving you weak as more and more wonderful milk leaves your [breasts], it’s not enough for you to actually orgasm from fondling your cans alone. Still, with all the steam you’ve let off from this exercise alone, your time was far from wasted here.", parse);
			}
			Text.NL();
			Text.Add("Gradually, you drain your [breasts] to dryness, their heavy firmness that came with being filled fading away, leaving them softer and with a bit more sag than when you started. It’s no small relief, having the pressure within finally let out, and you heave a huge sigh of contentment, gulping in air to cool yourself from the heat which has suffused your body. It’s only then that you look down at the mess you’ve created.", parse);
			Text.NL();
			if (milk < 5) {
				Text.Add("It’s not too bad. Splotches of fresh cream adorn the ground here and there, but the ground’s managed to absorb most of your output. Give it a few hours or so in the sun, and the evidence of your self-milking will be largely erased from the world.", parse);
				Text.NL();
				Text.Add("Guess you didn’t have that much milk in you, but do you really want more?", parse);
			} else if (milk < 10) {
				Text.Add("A respectable amount of fresh, creamy lactate has been drained from your [breasts], leading to a sodden ground and small puddles of the stuff accumulating around you. It’ll take a little while for all this to dry out… a respectable amount indeed, for which you can’t help but feel a little stab of pride for.", parse);
			} else {
				Text.Add("Through your molestation, you’ve turned the ground about you into a marshland of milk. The ground is absolutely soaked to a ridiculous extent, and large pools of breast milk have accumulated about you, a gentle, sweet smell rising from them as they begin to slow process of drying out.", parse);
				Text.NL();
				Text.Add("It’s a little hard to believe all that actually came out of your [breasts], but the sight that lies before you is undeniable. Perhaps you should take some small pride in knowing of your extreme productivity… although there probably aren’t going to be any calls for being a wet nurse to a small army of infants any time soon.", parse);
			}
			// Drain all milk
			player.LactHandler().MilkDrainFraction(1);
		} else {
			Text.Add("At length, though, you feel your [breasts] starting to get a little tender from the vigorous handling they’ve been given, and decide to cut it here and now than risk them actually getting sore. Giving your cans a final rub and caress, you sigh in relief at all the steam you’ve managed to blow off and prepare to be on your way.", parse);
		}
		Text.NL();
		parse.comp = party.Num() === 2 ? party.Get(1).name : "";
		parse.c = party.Num() > 1 ? Text.Parse(" rejoining [comp] and", parse) : "";
		Text.Add("With that in mind, you collect your gear once more, putting on and doing up your [armor] before[c] setting off on your way.", parse);
		Text.Flush();

		const cum = player.OrgasmCum();

		TimeStep({minute: 30});
		Gui.NextPrompt();
	}

}
