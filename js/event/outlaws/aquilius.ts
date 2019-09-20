/*
 * Aquilius, Outlaw Avian healer
 */
import * as _ from "lodash";

import { EncounterTable } from "../../encountertable";
import { Entity } from "../../entity";
import { GAME, StepToHour, TimeStep, WORLD, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { Item, ItemIds } from "../../item";
import { IngredientItems } from "../../items/ingredients";
import { Jobs } from "../../job";
import { IChoice } from "../../link";
import { ILocation } from "../../location";
import { Party } from "../../party";
import { Text } from "../../text";
import { Time } from "../../time";
import { AscheTasksScenes } from "../asche-tasks";
import { GlobalScenes } from "../global";
import { Kiakai } from "../kiakai";
import { Player } from "../player";
import { AquiliusFlags } from "./aquilius-flags";

export class Aquilius extends Entity {

	public static ExtraHerbs(): Item[] {
		return [
			IngredientItems.Lettuce,
			IngredientItems.SnakeOil,
			IngredientItems.FreshGrass,
			IngredientItems.Foxglove,
			IngredientItems.FruitSeed,
		];
	}
	public helpTimer: Time;
	public herbIngredient: Item;

	constructor(storage?: any) {
		super();

		this.ID = "aquilius";

		// Character stats
		this.name = "Aquilius";

		this.body.DefMale();

		this.SetLevelBonus();
		this.RestFull();

		this.flags.Met   = AquiliusFlags.Met.NotMet;
		this.flags.Herbs = AquiliusFlags.Herbs.No;
		this.flags.Talk  = 0; // Bitmask

		this.helpTimer  = new Time();

		if (storage) { this.FromStorage(storage); }
	}

	public FromStorage(storage: any) {
		if (storage.herb) {
			this.herbIngredient = ItemIds[storage.herb];
		}
		this.helpTimer.FromStorage(storage.Htime);

		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
	}

	public ToStorage() {
		const storage: any = {

		};

		if (this.herbIngredient) {
			storage.herb = this.herbIngredient.id;
		}
		storage.Htime = this.helpTimer.ToStorage();

		this.SavePersonalityStats(storage);
		this.SaveFlags(storage);

		return storage;
	}

	public Update(step: number) {
		super.Update(step);
		this.helpTimer.Dec(step);
	}

	// Schedule TODO
	public IsAtLocation(location?: ILocation) {
		location = location || GAME().party.location;
		if (location === WORLD().loc.Outlaws.Infirmary) {
			return (WorldTime().hour >= 7 && WorldTime().hour < 22);
		}
		return false;
	}

	public OnHerbsQuest() {
		return this.flags.Herbs >= AquiliusFlags.Herbs.OnQuest;
	}
	public OnHerbsQuestFinished() {
		return this.flags.Herbs >= AquiliusFlags.Herbs.Finished;
	}
	public HelpCooldown() {
		return new Time(0, 0, 0, 12, 0);
	}
	public QualifiesForAnyJob(entity: Entity) {
		return this.QualifiesForHerbs(entity) ||
			this.QualifiesForHealing(entity) ||
			this.QualifiesForAlchemy(entity); // TODO
	}
	public QualifiesForHealing(entity: Entity) {
		return Jobs.Healer.Unlocked(entity);
	}
	public QualifiesForAlchemy(entity: Entity) {
		return entity.alchemyLevel >= 1;
	}
	public QualifiesForHerbs(entity: Entity) {
		return Jobs.Ranger.Unlocked(entity);
	}
	public SetHerb(override?: Item) {
		const item = override || _.sample(Aquilius.ExtraHerbs());
		this.herbIngredient = item;
		return item;
	}
}

export namespace AquiliusScenes {
	export function FirstMeeting() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const aquilius: Aquilius = GAME().aquilius;
		const kiakai: Kiakai = GAME().kiakai;

		const parse: any = {
			playername : player.name,
		};

		aquilius.flags.Met = 1;

		Text.Clear();
		Text.Add("The moment you push apart the tent flaps and step into the tent’s expansive confines, it becomes readily apparent what the place is: an infirmary. Several bandaged morphs lie on the cots laid out before you, while a couple more mill amongst them, the latter making sure the former are comfortable.", parse);
		Text.NL();
		if (party.InParty(kiakai)) {
			parse.name = kiakai.name;
			parse.hisher = kiakai.hisher();
			Text.Add("<i>“A place of healing and recovery,”</i> [name] breathes, [hisher] voice almost reverent. <i>“It is good that even in this place, there is-”</i>", parse);
			Text.NL();
		}
		Text.Add("The aura of peace that envelops the infirmary is shattered by a loud, piercing scream from behind a curtain near the back of the tent. Oddly, no one seems very much disturbed by the sudden cry, but you decide to investigate anyway, pushing your way through the cots and peering through a gap in the curtains. From where you stand, you spy a horse and eagle-morph within, the latter working on the former with… yes, with a needle and thread. Well, that would explain the screaming.", parse);
		Text.NL();
		Text.Add("<i>“Aria’s tits, Zevran,”</i> the eagle-morph mutters. <i>“Don’t be such a wimp. Hold still and don’t yell so much - other folks need their rest. The sooner I can sew you up, the sooner I can throw you out of here - or do you want a leather strop to bite on so you won’t chew your tongue off?”</i>", parse);
		Text.NL();
		Text.Add("The horse-morph mumbles something that you can’t quite make out.", parse);
		Text.NL();
		Text.Add("<i>“Good, because I usually only have to get out the leather when I’m doing amputations. Now, this is going to be the last bit… there. You’ll need to come back a few days later to have the stitches removed; I’ll put you on light duty in the meantime. Now… this is going to sting a little.”</i>", parse);
		Text.NL();
		Text.Add("The eagle-morph pours something onto a clean cloth and swabs away; the horse morph screams again, louder than the first.", parse);
		Text.NL();
		Text.Add("<i>“Psh. All right, now, off with you. Maybe the pain will remind you not to risk bursting those stitches.”</i>", parse);
		Text.NL();
		Text.Add("Throwing back the curtains with an elbow, the horse-morph stumbles past you, through the cots, and out of the tent - all while clutching his bloodied arm. Your eyes follow him on his way out, and some of the invalids do the same, craning their necks to watch his passage.", parse);
		Text.NL();
		Text.Add("<i>“Well, that one was certainly one of the louder folks of late. And who might you be?”</i>", parse);
		Text.NL();
		Text.Add("The eagle-morph’s voice is clear and crisp, and you turn to find him staring intently at you with weathered eyes, dousing his hands with clear, strong-smelling liquid from a small pewter jug. A pair of bloodied gloves lie on the table behind him - no doubt he was wearing them while working on the horse-morph - and the coarse cloth vest he has on over his shirt has a few stains in it, too.", parse);
		Text.NL();
		Text.Add("Bit of a messy job he’s doing there. Careful not to appear like you’re staring too much, you introduce yourself.", parse);
		Text.NL();
		Text.Add("<i>“[playername]. I’ll remember it. That said, my name is Aquilius. Now, you don’t look very injured to me, so are you ill?”</i>", parse);
		Text.NL();
		Text.Add("What? No, you aren’t ill, you just-", parse);
		Text.NL();
		Text.Add("<i>“If you’re not injured or ill, then you really don’t have much business in here.”</i> He points up at a sign hanging from one of the tent’s support beams. <i>“And a warning, since you’re a new face. If you’re going to report sick, make sure you’re ill. I can’t stand malingerers.”</i>", parse);
		Text.NL();
		Text.Add("Well excuse me, you were just going to introduce yourself-", parse);
		Text.NL();
		Text.Add("<i>“Yes, you’ve introduced yourself. I’ve also introduced myself. This has been a very good conversation,”</i> Aquilius replies drolly, wiping his hands before corking the flask and putting it away in a pocket. That done, he draws out a beautifully carved wooden case from his shirt’s breast pocket, and from that, a pipe. With no small satisfaction, he sticks it in his beak and lights up, a sweet scent filling the air as he begins to puff away. <i>“If there’s nothing else, there are others who need my time. Have a good day, but please don’t loiter here.”</i>", parse);
		Text.NL();
		Text.Add("With that, he walks away, leaving you to fume.", parse);
		Text.Flush();

		TimeStep({minute: 30});

		Gui.NextPrompt();
	}

	export function Approach() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const aquilius: Aquilius = GAME().aquilius;
		const outlaws = GAME().outlaws;

		const parse: any = {
			playername : player.name,
		};

		Text.Clear();
		// #If the player is on herbs quest, returns with herbs
		if (aquilius.OnHerbsQuestFinished()) {
			Text.Add("<i>“Ah, you’re back,”</i> Aquilius says, looking up from his work as you approach. <i>“Did you have a productive outing?”</i>", parse);
			Text.NL();
			Text.Add("That’s a way to phrase it. You present him with the armful of flowers, roots, leaves and other assorted plant bits that constitute the results of today’s work, and he begins to sift through them like a chicken scratching at dirt, occasionally discarding a specimen that he doesn’t feel is up to par. Nevertheless, most of what you picked is good enough to satisfy the surgeon, and he gives you a nod as one of his assistants hurries over to pack the lot away.", parse);
			Text.NL();
			Text.Add("<i>“Plenty of sunny days of late,”</i> Aquilius remarks. <i>“We’ll spread them out to dry, they keep pretty well that way. Well, [playername], your help is very much appreciated. Keep it up, and I’m sure everyone around camp will hear of how helpful you’re being.</i>", parse);
			Text.Flush();

			outlaws.relation.IncreaseStat(30, 1);
			aquilius.relation.IncreaseStat(100, 2);

			aquilius.flags.Herbs = AquiliusFlags.Herbs.Known;

			// #Set timer on helping out at infirmary for the rest of the day.
			aquilius.helpTimer = aquilius.HelpCooldown();

			if (aquilius.flags.Met < AquiliusFlags.Met.Helped) {
				aquilius.flags.Met = AquiliusFlags.Met.Helped;
			}

			const item = aquilius.herbIngredient;
			aquilius.herbIngredient = undefined;

			if (item && party.Inv().QueryNum(item)) {
				Text.NL();
				parse.ingredient = item.sDesc();
				Text.Add("You note that you have some [ingredient] with you, and remember that Aquilius was on the particular lookout for it. Would you like to give a measure of it to him?", parse);
				Text.Flush();

				// [Yes][No]
				const options: IChoice[] = [];
				options.push({ nameStr : "Yes",
					tooltip : Text.Parse("Yes, hand over a measure of [ingredient].", parse),
					func() {
						Text.Clear();
						Text.Add("Digging about in your possessions, your hands close about a measure of [ingredient] and you hand it over to Aquilius without further ado. The surgeon looks slightly surprised at first, then quickly moves to produce a small square of waxed paper to wrap it up in.", parse);
						Text.NL();
						if (aquilius.Relation() >= 50) {
							Text.Add("<i>“Excellent work as always, [playername]. I knew I could count on you to go above and beyond the call of duty.”</i>", parse);
						} else {
							Text.Add("<i>“Oh. You actually managed to find some. I was worried that - never mind. The extra effort’s very much appreciated.”</i>", parse);
						}
						Text.NL();
						Text.Add("Aquilius clicks his beak, finishes wrapping up your gift, then stows it away out of sight. <i>“Well, I promised you a little something, and it’d be remiss for me to go back on my word. Here, have this.”</i> He pushes a small portion of fragrant dried leaves and grasses into your hands, wrapped in that same waxed paper. <i>“My very own blend; you won’t find a more relaxing smoke on the face of Eden. I’m sure you’ll enjoy.”</i>", parse);
						Text.Flush();

						party.Inv().RemoveItem(item);
						party.Inv().AddItem(IngredientItems.PipeLeaf);

						outlaws.relation.IncreaseStat(30, 1);
						aquilius.relation.IncreaseStat(100, 1);

						AquiliusScenes.Prompt();
					}, enabled : true,
				});
				options.push({ nameStr : "No",
					tooltip : "You have better uses for it.",
					func() {
						Text.Clear();
						Text.Add("While Aquilius may be in need of it, you decide that you’d rather save the ingredient for your own ends.", parse);
						Text.Flush();

						AquiliusScenes.Prompt();
					}, enabled : true,
				});
				Gui.SetButtonsFromList(options, false, undefined);
			} else {
				AquiliusScenes.Prompt();
			}
		} else if (aquilius.OnHerbsQuest()) {
			Text.Add("Aquilius looks up at you, notes your empty hands, then shrugs. <i>“Still here, [playername]? I wouldn’t wait too long to head out into the woods - they can get quite dangerous at night. Best you do all the flower picking while it’s light out.”</i>", parse);
			Text.NL();
			Text.Add("You assure him that you’ll get him his herbs soon enough.", parse);
			Text.Flush();
			AquiliusScenes.Prompt();
		} else {
			Text.Add("Pushing your way through the rows of cots and their occupants, you approach the surgeon. ", parse);
			const scenes = new EncounterTable();

			const day = WorldTime().hour < 17;

			if (day) {
				scenes.AddEnc(() => {
					Text.Add("He’s currently busy with mortar and pestle, pounding away at a mixture of various grasses. As you watch, he mixes the lot with a cupful of warm water, then strains the lot with a fine cloth; the resultant foul-smelling mixture is then poured into a basin of water in which several bandages have been left to soak. Done with this task, he finally turns and pays attention to you.", parse);
				});
				scenes.AddEnc(() => {
					Text.Add("Aquilius is enjoying a quick smoke break, his pipe clenched in his beak as he stares out a window at the rest of the camp. Noticing you watching him, the surgeon removes his pipe and knocks out the ashes with a quick swat of his hand.", parse);
				});
				scenes.AddEnc(() => {
					Text.Add("<i>“You’re not ill. You just overstuffed yourself and lazed about too much, and it’s gotten to you. Eat less and do more useful work, and you’ll be fine.”</i> With a shake of his head, the surgeon sends his current patient storming out of the tent, then turns to you.", parse);
				});
				scenes.AddEnc(() => {
					Text.Add("He’s currently swabbing the operating table with a harsh-smelling mixture, based in alcohol if your nose isn’t wrong. Eyes furrowed and face grim, he doesn’t notice your approach at all, not until the last square inch has been scrubbed to satisfaction. It’s a good fifteen minutes before he’s done, but when he is, he lets out a slow sigh and turns to you.", parse);
				});
			} else {
				scenes.AddEnc(() => {
					Text.Add("He’s currently cloistered himself in the back of the tent, leaning back in a chair with his eyes closed and wings folded as he draws deeply from a large, ornate pipe carved from hardwood. Even at this distance, you can smell the psychedelic smoke rising from it - whatever’s in there, it certainly isn’t tobacco. As you approach, though, he opens an eye to regard you, although his gaze is clearly more than a little glazed.", parse);
				});
				scenes.AddEnc(() => {
					Text.Add("Even at this late hour, the surgeon is at work, having picked a handful of yellow mushrooms from the log and drying them on a grill over the low heat of the burner. Odd… come to think of it, you’ve never seen him <i>use</i> the mushrooms for anything.", parse);
					Text.NL();
					Text.Add("He tilts his head to regard you as you draw close.", parse);
				});
				scenes.AddEnc(() => {
					Text.Add("He’s seated in the back, puffing away at a fragrant mix of various flowers and leaves in his pipe, a half-eaten dinner cooling on a small folding table at his side. Perched in his lap is a book - one filled with thin, spidery writing and many sketched diagrams - and it’s from this that he peers up as you approach.", parse);
				});
			}
			scenes.Get();

			Text.NL();

			if (day) {
				if (aquilius.Relation() >= 75) {
					Text.Add("<i>“Oh, it’s you, [playername]. You may linger and watch, so long as you don’t get in anyone’s way.”</i>", parse);
				} else if (aquilius.Relation() >= 50) {
					Text.Add("<i>“[playername]. I trust you are healthy today? Have you come to help out?”</i>", parse);
 				} else {
					Text.Add("<i>“[playername]. What brings you here today?”</i>", parse);
 				}
			} else {
				if (aquilius.Relation() >= 75) {
					Text.Add("<i>“Welcome, [playername],”</i> Aquilius says with a cordial nod of his head. <i>“I trust that you’ve had a very safe and fruitful day? Not that I have much in the way of entertaining others, but it’s nice to have a pleasant soul to talk to.”</i>", parse);
				} else if (aquilius.Relation() >= 50) {
					Text.Add("<i>“It’s you, [playername]. What brings you to me at this late hour? I hope you haven’t suffered any hurts.”</i>", parse);
 				} else {
					Text.Add("<i>“Oh. [playername]. For a moment I thought it was…”</i> Aquilius is clearly suppressing a tic in his face. <i>“No, never mind. I don’t usually get visitors at this hour. Is there something you need?”</i>", parse);
 				}
			}
			Text.Flush();
			AquiliusScenes.Prompt();
		}
	}

	// TODO
	export function Prompt() {
		const aquilius: Aquilius = GAME().aquilius;

		const parse: any = {

		};

		// [name]
		const options: IChoice[] = [];
		options.push({ nameStr : "Appearance",
			tooltip : "Give the good surgeon a look-over.",
			func : AquiliusScenes.Appearance, enabled : true,
		});
		if (AscheTasksScenes.Nightshade.IsOn() &&
		!AscheTasksScenes.Nightshade.IsSuccess() &&
		!AscheTasksScenes.Nightshade.HasHelpFromAquilius()) {
			options.push({ nameStr : "Nightshade",
				tooltip : "Ask Aquilius about the herb that Asche sent you to look for.",
				func : AscheTasksScenes.Nightshade.AskAquiliusForHelp, enabled : true,
			});
		}
		// DAYTIME
		if (WorldTime().hour < 17) {
			// Player may only help out once a day. Ish.
			options.push({ nameStr : "Help out",
				tooltip : "Help out at the infirmary.",
				func : AquiliusScenes.HelpOut, enabled : !aquilius.OnHerbsQuest(),
			});
		} else {
			options.push({ nameStr : "Talk",
				tooltip : "How about a fireside chat with the good surgeon?",
				func() {
					Text.Clear();
					Text.Add("<i>“Sure, I wouldn’t mind a little company. You want to open, or let me do it?”</i>", parse);
					Text.Flush();

					AquiliusScenes.TalkPrompt();
				}, enabled : true,
			});
			options.push({ nameStr : "Smoke",
				tooltip : "Light up with Aquilius and relax a bit.",
				func : AquiliusScenes.Smoke, enabled : true,
			});
			/* TODO
			options.push({ nameStr : "Talk",
				tooltip : "",
				func : () => {
					Text.Clear();
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
					Text.Flush();
				}, enabled : true
			});
			*/
		}
		Gui.SetButtonsFromList(options, true, () => {
			if (WorldTime().hour < 17) {
				Gui.PrintDefaultOptions();
				return;
			}

			Text.Clear();
			Text.Add("<i>“Farewell, now,”</i> Aquilius tells you as you get up to leave. <i>“It has gotten quite late, so be careful, wherever you may be going. In fact, I would suggest that you sleep in camp and wait for first light before leaving.”</i>", parse);
			Text.NL();
			Text.Add("With that, he sinks back into his chair and closes his eyes contentedly.", parse);
			Text.Flush();

			Gui.NextPrompt();
		});
	}

	export function TalkPrompt() {
		const aquilius: Aquilius = GAME().aquilius;

		const parse: any = {

		};

		// [Self][Grind][War][Back]
		const options: IChoice[] = [];
		options.push({ nameStr : "Self",
			tooltip : "Ask Aquilius about himself.",
			func : AquiliusScenes.TalkSelfPrompt, enabled : true,
		});
		options.push({ nameStr : "Grind",
			tooltip : "Make small talk about the daily grind.",
			func : AquiliusScenes.TalkGrind, enabled : true,
		});
		options.push({ nameStr : "War",
			tooltip : "Ask Aquilius about the war between the Crown and the guilds.",
			func() {
				Text.Clear();
				Text.Add("Aquilius doesn’t reply at first, instead staring intently into the distance just past your shoulder, as if he’s seen a ghost. Maybe he has. It’s a good half-minute before he finally moves again, taking his pipe out of his beak and blowing a slow, long stream of smoke through his nostrils.", parse);
				Text.NL();
				if (aquilius.flags.Talk & AquiliusFlags.Talk.War) {
					Text.Add("<i>“You want to hear about it again? Well, it’s important that kids these days learn history, else we’re doomed to repeat it. Come to think of it, learning history doesn’t necessarily mean you aren’t going to repeat it anyway. Bah, what do you want me to tell you about?”</i>", parse);
				} else {
					aquilius.flags.Talk |= AquiliusFlags.Talk.War;
					Text.Add("<i>“Yes, I can tell you about the war,”</i> he says. <i>“Brother against brother, parent against child, king against his own. I may be not quite as young as I was then, but I still remember every single moment of it. What would you like to know?”</i>", parse);
				}
				Text.Flush();

				AquiliusScenes.TalkWarPrompt();
			}, enabled : true,
		});
		/* TODO
		*
		options.push({ nameStr : "name",
			tooltip : "",
			func : () => {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
			}, enabled : true
		});
		*/
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("<i>“Hm, sure. Let’s just take a moment to relax, then.”</i>", parse);
			Text.Flush();
			AquiliusScenes.Prompt();
		});
	}

	export function TalkSelfPrompt() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const kiakai: Kiakai = GAME().kiakai;

		let parse: any = {
			playername : player.name,
			boygirl : kiakai.mfTrue("boy", "girl"),
			manwoman : player.mfTrue("man", "woman"),
			name : kiakai.name,
		};
		parse = kiakai.ParserPronouns(parse);

		// [Past][Surgery][Outlaws][[Kiai]]
		const options: IChoice[] = [];
		options.push({ nameStr : "Past",
			tooltip : "So, where did he come from, who is he, and where is he going?",
			func() {
				Text.Clear();
				Text.Add("<i>“My boyhood?”</i> Aquilius leans forward, chin in hand, and draws on his pipe as he thinks. <i>“Can’t say it was too special. Lived in Rigard, second of four brats, always hungry, always emptying the larder and then looking for more to eat. Didn’t starve or anything, but that’s just the way kids are. You leave them alone for a moment and they turn up wanting food; I was no exception.</i>", parse);
				Text.NL();
				Text.Add("<i>“Must’ve been a particularly voracious kid, because next thing I know, I’m being apprenticed to a cobbler at the tender age of eight or nine. Maybe my parents were hoping that I’d work enough to earn my keep for all that I ate, and if I didn’t, it damn well felt like I did anyway. The cobbler’s was just two streets away, so I didn’t have to leave home or anything, but I scarcely ate another meal at home after that.”</i> Aquilius chuckles at the thought. <i>“Shoe-mending wasn’t so bad. Six months in, my master began letting me work on scraps of old fabric and leather, sewing together shoes to soles, pounding in nails… we had a contract with the city watch to provide them with so many pairs of boots every month, so there was no end of work.</i>", parse);
				Text.NL();
				Text.Add("<i>“Learn the trade, marry the owner’s daughter, take over the business, work till the day I die. That might have been the long and short of my life, [playername], if the civil war hadn’t happened. I know the saying that every generation must have its own trials and tribulations, but it doesn’t change the fact that the civil war was a particularly bad one.</i>", parse);
				Text.NL();
				Text.Add("<i>“Once Reywn mobilized the army, the recruiters came marching door to door, dragging out the able-bodied to be drafted; I was no exception. Eventually, someone must’ve noticed that I was better at cutting and stitching than I was swinging a pike around, for the next thing I know I’m being told to report to the surgeon’s office for my new position as his apprentice. The pay was better than my old job at the cobbler’s and I was doing more obviously useful work, so I stayed on even after most of the fighting died down and the draftees were free to go. Never saw the cobbler again, so I don’t know what he thought of my decision.</i>", parse);
				Text.NL();
				Text.Add("<i>“Eventually, though, I thought I’d set up a practice of my own and did just that with the savings I’d accumulated over the last handful of years. Most of my first customers were still from the army, as they preferred my work to the new surgeon’s, and as word of mouth spread, I managed to get more business.”</i>", parse);
				Text.NL();
				Text.Add("How’d he end up with the outlaws, though?", parse);
				Text.NL();
				Text.Add("<i>“That’s another story,”</i> Aquilius replies. <i>“If you’re really that interested, I’ll tell you. Anything else, though?”</i>", parse);
				Text.Flush();

				TimeStep({minute: 30});
			}, enabled : true,
		});
		options.push({ nameStr : "Surgery",
			tooltip : "What does he think of his job?",
			func() {
				Text.Clear();
				Text.Add("<i>“It’s a living.”</i>", parse);
				Text.NL();
				Text.Add("That’s all?", parse);
				Text.NL();
				Text.Add("Aquilius shrugs. <i>“You think I should say something else? Have greater, more grandiose thoughts? Nah. Sure, I save lives… but so can anyone else. The farmers out on the plains, they do a shitload more work than I do to keep people alive and kicking by way of not starving to death, and you don’t see people expecting them to have great and wonderful insights about their professions.</i>", parse);
				Text.NL();
				Text.Add("<i>“[playername], being a sawbones isn’t the most glorious of tasks. You end up thinking of people as pieces of meat while they’re on the table, cuts of beef, pork, or the other white meat, whatever tickles your fancy. So long as it isn’t another living, breathing, thinking person that you’re applying the scalpel or bonesaw to, because that opens the door for other unsettling thoughts to creep into your head.”</i>", parse);
				Text.NL();
				Text.Add("Oh.", parse);
				Text.NL();
				Text.Add("<i>“Why does anyone choose their particular profession? Most don’t even get the chance to walk away from their parents’ footsteps; if I hadn’t been drafted, I might very well have remained as a cobbler’s apprentice for the rest of my life. I do it because it’s what I’m good at, what I’ve been trained to, and what I know. That’s more than enough reason.”</i>", parse);
				Text.NL();
				if (party.InParty(kiakai)) {
					Text.Add("<i>“But surely - surely there must be some satisfaction that you can take away from seeing the ill made whole again,”</i> [name] interjects. <i>“That the task of healing should bring both parties joy.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Oh sure, [boygirl]. I’m not denying that there’s a sense of satisfaction there. But how’s it supposed to be any different from a cobbler taking pride in a pair of boots he or she mended, or a cook in a meal well done?”</i>", parse);
					Text.NL();
					Text.Add("<i>“Do not call me ‘[boygirl]’!”</i> [name] exclaims. <i>“I am likely older than you are!”</i>", parse);
					Text.NL();
					Text.Add("Aquilius closes his eyes and bows his head. <i>“Yeah. Sure. You definitely have the years on me, elf [boygirl]. But you see, age is up here.”</i> He taps his forehead with his index finger. <i>“I’ve seen middle-aged women in the bodies of girls, and brats wearing the skins of grown men. How long your eyes have stayed open has nothing to do with it.”</i>", parse);
					Text.NL();
					Text.Add("Will the two just cut it out already?", parse);
					Text.NL();
				}
				Text.Add("Aquilius cocks his head at you. <i>“It wasn’t so long ago that doctors, surgeons and alchemists weren’t so highly regarded. There were plenty of quacks, and even if you were the real deal you had to be careful to not end up doing more harm than good.</i>", parse);
				Text.NL();
				Text.Add("<i>“It doesn’t help that with magical healing and potions making the rounds these days, most people are now expecting someone to come up to their sickbed, put their hands on them and mumble some mumbo-jumbo, and then they’re up and about. Then they get all upset and squeamish when I tell them I’m going to use needle and thread on them. Something like… like city folk forgetting where their meat really comes from, and thinking it comes from the butcher’s instead of from inside a pig. You know?</i>", parse);
				Text.NL();
				Text.Add("<i>“What I’m trying to get at is that… well, I’m certainly not going to be taking on any airs for what I do. That’s all.”</i>", parse);
				Text.Flush();

				TimeStep({minute: 30});
			}, enabled : true,
		});
		options.push({ nameStr : "Outlaws",
			tooltip : "How’d he end up with the Outlaws?",
			func() {
				Text.Clear();
				Text.Add("<i>“I knew Zenith from back in the civil war. Lad was with the guilds… that is, on the wrong side of the fence. Young man of fifteen, already known for his work and just itching to make his name even bigger, and the guilds just had to get it into their mind to move against the Crown and start a civil war. He really had no stake in the whole business save holding membership - back in those days, if you weren’t a member of the guilds and did business anyway, they’d rough you up and shake you down - but that was enough.”</i>", parse);
				Text.NL();
				Text.Add("Aquilius removes his pipe from his beak and rubs his eyes. <i>“So there he was, young man caught up in the first of the morph riots, bleeding out after it was put down. He’d dragged himself into an alley so he wasn’t trampled to death when the inevitable stampede started, but there wasn’t much time left for him. I happened to be there, part of the detachment sent to suppress the riots…”</i>", parse);
				Text.NL();
				Text.Add("And?", parse);
				Text.NL();
				Text.Add("<i>“Everyone ignored him, [playername]. Both the rioters and those sent to put them down… not that I blame them. It was a hellhole, and he looked pretty much dead, too. Not much reason to bother with a dead man in the heat of things. People were screaming, trying to get away now that the Royal Guard and city watch had called their bluff and was willing to kill to keep the peace. Rioting’s all fun and games until someone dies, then everyone’s afraid that they’ll be the next in line to croak.</i>", parse);
				Text.NL();
				Text.Add("<i>“Me, I noticed he was still breathing, and I had to do something about it. I made an excuse to fall behind the others, then did what I could. Staunched the bleeding, tried to make sure the wound wouldn’t get infected… I wasn’t sure back then if he’d pull through, but he did.”</i>", parse);
				Text.NL();
				Text.Add("Sounds pretty grim.", parse);
				Text.NL();
				Text.Add("<i>“It was,”</i> Aquilius says, refilling his pipe with another pinch of dried herbs. <i>“I’d rather not dwell on it any longer than necessary. Anyway, Zenith came over to the barracks a couple of weeks later to thank me. They wouldn’t let him in, of course, but word got out, and we arranged to meet up for a drink and a smoke on neutral ground.”</i>", parse);
				Text.NL();
				Text.Add("It sounds a little odd to hear Aquilius speak of neutral ground, to imagine the entirety of Rigard divided against itself, but you nod and ask him to continue.", parse);
				Text.NL();
				Text.Add("<i>“Well, one thing led to another. After I left the army and set up a surgery of my own, Zenith would send in his operatives every now and then when they needed mending by a surgeon who wouldn’t go talking to the city watch. I’d patch them up, keep them under observation for a few days, and Zenith would send someone to bring them back.</i>", parse);
				Text.NL();
				Text.Add("<i>“I don’t know how I was found out, though, but I must’ve been. On one fine day about five years back, I wake up to Zenith knocking on my door. Seems like I was slated to have an appointment with the Royal Guard in about two hours for patching up known criminals. Aiding and abetting, I’m not sure what the legalese term is, but essentially I was all signed up for a one-way ride down to the palace square, and there was a signed warrant to have my home and everything in it confiscated as “evidence”. I’d be damned if I let Preston steal my life’s work - I took what I could carry with me, torched the rest, then came along with Zenith and set up shop here.</i>", parse);
				Text.NL();
				Text.Add("<i>“Get this straight. I don’t trust most of the unruly rabble on either side of this mess. I don’t believe in the slogans and chants. If you want proof that most people are irredeemably stupid, then try doing my job for as long as I have; I’ve lost count of the number of accidentally hacked limbs, near-fatal injuries from people horsing around, and the assortment of odd items I’ve had to extract from within people. You think these people can put two thoughts together, let alone govern themselves effectively? You can’t blame them, that’s how most folks are.</i>", parse);
				Text.NL();
				Text.Add("<i>“I’m here because I believe in Zenith, and that he’s a good man. Without him, Maria and a few others giving everyone else direction, it’s very possible this motley crew would never even have gotten off the ground.”</i>", parse);
				Text.NL();
				Text.Add("It’s that simple?", parse);
				Text.NL();
				Text.Add("Aquilius nods. <i>“Believe it or not, it is that simple.”</i>", parse);
				Text.Flush();

				TimeStep({minute: 30});
			}, enabled : true,
		});
		if (party.InParty(kiakai, true)) { // TODO flags for this!
			options.push({ nameStr : kiakai.name,
				tooltip : "So… what DOES he have against the elf, anyway?",
				func() {
					Text.Clear();
					Text.Add("Since [name] isn’t with you, you can feel free to ask the question in the open. Not that talking about someone behind his or her back is a good thing, but in this case, it would only create more problems than it would solve.", parse);
					Text.NL();
					Text.Add("Aquilius snorts at the elf’s name. <i>“Can’t blame you for asking. You’re responsible for that little do-gooder, so I have only one piece of advice: keep [himher] out of trouble, don’t let [himher] try to help everyone [heshe] comes across, and if you can, try and at least get the little bugger to understand the context of the situation before extending a helping hand.”</i>", parse);
					Text.NL();
					Text.Add("That’s three pieces of advice, you point out.", parse);
					Text.NL();
					Text.Add("<i>“Now don’t you get smart with me too, young [manwoman].”</i> Aquilius puffs on his pipe, blowing a long stream of smoke through his nostrils. <i>“Point I’m getting at is that the little pointy-eared bugger needs someone watching [hisher] back, lest [heshe] get stabbed in the back by someone [heshe]’s just tried to help. I’ve seen that kind before. Won’t say naive - sometimes that doesn’t help - but so eager. So earnest. I’ll wager two coins that [heshe] believes the world has an order to it, that evil never goes unpunished, and everything will be all right in the end.</i>", parse);
					Text.NL();
					Text.Add("<i>“I’ve seen enough people throwing their lives away for that sort of crap, and don’t want another one to join the heap. So much wasted youth. So much wasted life. After all that, what do we have to show for it?”</i>", parse);
					Text.NL();
					Text.Add("Silence.", parse);
					Text.NL();
					Text.Add("<i>“Look, I went off my head over there,”</i> Aquilius says at last. <i>“I know I can’t stop people from doing stupid things, like they’ve been since the dawn of time. But if they get themselves cut up, at least I can stitch them back together. If they want to charge headlong into death, I can try and talk them out of it. But if they’re really determined… I don’t want to see another freshly dead body if I can help it, especially if it’s still walking and talking. You get me?”</i>", parse);
					Text.Flush();

					TimeStep({minute: 30});
				}, enabled : !party.InParty(kiakai),
			});
		}
		Gui.SetButtonsFromList(options, true, AquiliusScenes.TalkPrompt);
	}

	export function TalkGrind() {
		const player: Player = GAME().player;

		const parse: any = {
			playername : player.name,
		};

		Text.Clear();
		Text.Add("You ask Aquilius about how today’s work went.", parse);
		Text.NL();

		let scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("<i>“Running an infirmary is a little like running a circus,”</i> he says. <i>“You’ve got to keep everything perfectly balanced, else the whole house of cards comes tumbling down. If you can keep it up, though, you get to see all sorts of hilarious things.”</i>", parse);
			Text.NL();
			Text.Add("Such as?", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("<i>“Mostly okay. A bit of this, a bit of that. Honestly nothing I haven’t seen for the past twenty years.”</i>", parse);
			Text.NL();
			Text.Add("Well, he might have seen it all, but you haven’t, so if he wouldn’t mind humoring you…?", parse);
			Text.NL();
			Text.Add("<i>“Oh, all right.”</i> Aquilius blows a smoke ring from his pipe and watches it vanish into thin air. <i>“Let’s see, now…”</i>", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("<i>“Droll and boring, but that’s a good thing. Boring means that you’ll get to live through the day; it’s when your life gets full of excitement and other interesting events that you have to be on your toes.”</i>", parse);
			Text.NL();
			Text.Add("So, what kinds of things does he find boring, anyway? Knowing Aquilius, his definition of “boring” is probably very much different from yours.", parse);
			Text.NL();
			Text.Add("<i>“Well, for example…”</i>", parse);
		}, 1.0, () => true);
		scenes.Get();

		Text.NL();

		scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("<i>“So today a new face - bit of a scruffy lass - came in to report sick with a mild fever and chills. Of course, she wasn’t <b>really</b> ill, nor was the acting very convincing. I gave her the talk that I give everyone who tries to pull this crap off on me: first time, you get a warning. Second time, your name gets sent straight to Maria, and she’ll deal with you from there on out.</i>", parse);
			Text.NL();
			Text.Add("<i>“I don’t have time to deal with malingerers here, and neither am I going to cover for them. Zenith has made it very clear: if you’re not going to make yourself useful in some fashion, then you don’t get to eat. If you ask me to not just help you skive, but waste my precious time, credibility and resources in doing so, I’m going to turn you straight in.”</i>", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("<i>“Potions have their uses, but the way people seem to think they work is hilarious,”</i> Aquilius says, shaking his head. <i>“They imagine I can just run out, pick a handful of grass, throw it into boiling water and ten minutes later - bam! A potion to cure all their ills!</i>", parse);
			Text.NL();
			Text.Add("<i>“Let me tell you, if such miracle ‘herbs’ really did exist, they wouldn’t for long, because everyone would promptly pick them straight out of existence. Then there’s the problem of preservation, of compounding, of all the other preparations… how should you administer your medication? Pour it on a wound? Steep bandages in the distillate and let it seep through the skin? Or just throw it down the hatch?”</i>", parse);
			Text.NL();
			Text.Add("You pat the good surgeon on his shoulder and tell him you know of his pain.", parse);
			Text.NL();
			Text.Add("<i>“It’s cute the first couple of times, that irrational confidence in my abilities, then it starts getting annoying.”</i>", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("<i>“Couple of weeks back, we had this fellow who insisted he was fine less than a day after I’d finished setting his bones. Good work ethic, but an absolute idiot - I tried to explain to him that if something stupid happened to him or his splint and the bones healed wrong, I’d have to break them again and set them right once more.</i>", parse);
			Text.NL();
			Text.Add("<i>“He wouldn’t be reasonable about it, so I ordered him tied to the bed for the next few days. Some harm done, yes, but not as much as he’d have done to himself if I’d let him go on his merry way. I’m not going to lose any sleep over what I did - it was for his own good.”</i>", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("Aquilius leans towards you conspiratorially. <i>“Want to know the fastest-moving item in my inventory?”</i>", parse);
			Text.NL();
			Text.Add("Yes? What is it?", parse);
			Text.NL();
			Text.Add("<i>“Preventatives. I’m telling you, scarcely have I gone and cooked up a new batch that they’re all gone before the day is out. Which makes sense - a goodly number of folks here are already of the less savory kind. We don’t need more children here than what we already have, do we?”</i>", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("<i>“Back in the day, there was only one thing to do if someone had a gut wound.”</i>", parse);
			Text.NL();
			Text.Add("That would be?", parse);
			Text.NL();
			Text.Add("<i>“We’d brew up a really potent-smelling brew of various grasses, you see. Mix it with a little porridge and get the poor sop to drink it. If we could smell the herbs through the wound… there was no saving him or her, not with a perforated intestine. When the stuff in your guts leaks out and your very lifeblood gets infected, the only thing we can do is make your death as painless as possible.</i>", parse);
			Text.NL();
			Text.Add("<i>“I couldn’t take it at first, you know. Wanted to believe that there was something that could be done. But now that I’ve more years on me… sometimes the only decision that you can make is whether you want to tell your patient that they’re going to die and there’s nothing you can do about it.”</i>", parse);
			Text.NL();
			Text.Add("And has he?", parse);
			Text.NL();
			Text.Add("Aquilius squints at you. <i>“I have always been honest in this regard, even if at first glance it’d be better to lie. People need time to make peace with the spirits, [playername]. Settle their affairs in this world and make preparations for the next.  And if they don’t do that… well, then they won’t be able to claim ignorance.”</i>", parse);
		}, 1.0, () => true);
		scenes.Get();

		Text.Flush();

		TimeStep({minute: 30});
	}

	export function TalkWarPrompt() {
		const player: Player = GAME().player;

		const parse: any = {
			playername : player.name,
		};

		// [Origins][Fighting][Free Cities][Back]
		const options: IChoice[] = [];
		options.push({ nameStr : "Origins",
			tooltip : "How did the war get started in the first place?",
			func() {
				Text.Clear();
				Text.Add("Aquilius is silent for a long time, long enough for you to worry that you’ve sent the good surgeon into the recesses of his own head, but at long last he coughs loudly, sending his pipe clattering to the floor. Shaking his head, he picks it up with unsteady fingers and shoves it back into his beak.", parse);
				Text.NL();
				Text.Add("<i>“You want to know how it got started? Listen up then, for it’s going to be a long story.</i>", parse);
				Text.NL();
				parse.are = !GlobalScenes.PortalsOpen() ? "are" : "used to be";
				Text.Add("<i>“In my father’s time, so I’m told, portals were very commonplace. People could go through one, come out on another plane and do business, then return to Eden before lunch. As you no doubt know, portals [are] pretty much non-existent these days, but they didn’t disappear all at once. Slowly, they began to get rarer and rarer, opening and closing more and more erratically.</i>", parse);
				Text.NL();
				Text.Add("<i>“Now, there were merchant guilds who did business between the worlds using the portals, and since Eden had plenty of them, you can imagine they’d grown quite rich and influential. They had a direct voice in the passing of laws, wielded influence in various social circles, that sort of thing - and the new rich were always at loggerheads with the old rich. If the merchants wanted one thing, you’d bet the king and the nobles would want another.</i>", parse);
				Text.NL();
				Text.Add("<i>“But the portals got more and more erratic, and no one could explain why. The merchant guilds were bleeding money, barely managing to balance their books with the goods that still came back through the few portals that popped up, and with the loss of their wealth came the loss of their status in Rigard society.”</i>", parse);
				Text.NL();
				Text.Add("Yes, you can see where this is going, but how does it tie to the morphs?", parse);
				Text.NL();
				Text.Add("<i>“Patience, I’ll get to that in all good time.”</i> Aquilius takes a long drag on his pipe and grows thoughtful. <i>“Well, those who have power are loathe to give it up; such is the nature of that poisoned sweetmeat. Slowly, the crown got poorer as trade revenues diminished and had to start going local, if you know what I mean, yet the merchant guilds still threw their weight around like nothing had ever happened. Eventually, Rewyn - still a lad at the time - decided enough was enough, and the guilds’ frankly unreasonable demands had to be put down. Before he could move against them, though, they managed to scoop up the queen - not Rhylla, the first queen - and tried to ransom her for political leverage. You can imagine how well he took to that.</i>", parse);
				Text.NL();
				Text.Add("<i>“It… it all got a little messy after that. Somehow, the queen ended up dead - I don’t know how exactly, but rumors were everywhere - and Rewyn blew up, mobilized the army. The guilds had been busy telling us morphs how horrible the king was and all, and how we should fight him, but I was smart enough to know that they were just trying to use us as pawns and stayed out of all that crap until I got drafted. Others didn’t know better, of course, and ended up in riots funded by the guilds, dying by the hundreds while the merchants tried to make an escape.</i>", parse);
				Text.NL();
				Text.Add("<i>“For all of that… they didn’t succeed. After absolutely <b>crushing</b> the feeble men the merchants had been able to raise <b>and</b> the morphs in the riots, Rewyn caught every last one of the traitorous merchants still alive and made a very public spectacle of their execution; those which hadn’t participated in the rebellion were cowed into submission. He wasn’t very discriminating either when he started hunting down the morphs who’d supported the rebellion, the fools who’d believed in the crap rhetoric the merchants had fed them, and plenty of innocent people ended up dead.</i>", parse);
				Text.NL();
				Text.Add("<i>“Eventually, he realized that taking out his anger on us wasn’t the best of ideas, but the damage was done; many morphs had fled, while others were kicked out of the city proper and forced to live in the slums. On whose orders this happened, though, it’s anyone’s guess - events were a little muddy back then. He married Rhylla to stabilize his reign, joining his family with the most powerful of the rivalling noble families, and that brings us to this day. It was a bit of a shock for those who survived, but then they adjusted and the good times that came before all seemed like an idyllic dream, a fevered fancy…</i>", parse);
				Text.NL();
				Text.Add("<i>“So there you have it, [playername]. There weren’t any good sides in that mess that was called a civil war, so if anyone tells you that they were the good guys, they’re a lying bucket of warm piss.”</i>", parse);
				Text.Flush();

				TimeStep({minute: 30});
			}, enabled : true,
		});
		options.push({ nameStr : "Fighting",
			tooltip : "What was the fighting like?",
			func() {
				Text.Clear();
				Text.Add("<i>“What do you think? It was a civil war; those are never pretty.”</i> Aquilius puffs on his pipe. <i>“I’ll be honest; as a surgeon in training, I was in the barracks most of the time, so I didn’t see as much fighting as you’d expect. But the folks they brought in to be put together again, they had tales to tell. Oh, they had plenty to say, mostly to take their mind off the pain while I was sawing and sewing.</i>", parse);
				Text.NL();
				Text.Add("<i>“Most of the fighting was centered about Rigard itself - a little spilled out into the slums and plains, but the most bloodshed happened within the city walls. I can briefly tell you about the first of the morph riots instigated by the merchants - every hand available got called out to the merchants’ district as backup, and by the time we arrived, there was that milling mass shouting at us.”</i>", parse);
				Text.NL();
				Text.Add("Aquilius closes his eyes and resettles himself in his chair, spreading his wings a little. <i>“I was called a… ah, yes. I was called a traitor no less than six times. Probably more. There were a few rocks thrown, nothing too bad, then some fucking fool decides to lob a half-brick at the shield wall we’d formed. I remember… it sailed through the air over the shields, hit another greenhorn in the forehead, a sad-looking lad about fifty paces to my right, cracked his skull open thanks to whoever decided that he should have an open helm that day. Poor bastard died on the spot.</i>", parse);
				Text.NL();
				Text.Add("<i>“All hell broke loose.</i>", parse);
				Text.NL();
				Text.Add("<i>“No one gave the order to attack, [playername], but we did anyway. The more people are in one spot, the stupider all of them become, until it’s inevitable that shit happens. The moment the mob realized that things had gotten real, that we were going to <b>kill</b> them, most of them either tried to flee and got trampled underfoot by their own people, or tried to put up a fight and got slaughtered by the advancing wall of pikemen. Really, they didn’t have much of a chance - an untrained, unarmed rabble against actual troops - but then the crap the merchants had been feeding them made them, I don’t know, think they were impervious to blades or something. The armor of righteousness and high moral ground, you know? In the end, they bled and died just like anyone else.</i>", parse);
				Text.NL();
				Text.Add("<i>“There were more morph riots after that, mostly responses to the first one. Rewyn ordered them put down in much the same fashion - complete slaughter of everyone involved. Didn’t matter if you were an instigator, a participant, or just in the wrong place at the wrong time like Zenith was; with the love of his life butchered at their hands and her body still cooling, he wanted them all dead. Thankfully, I wasn’t there, and neither did I have the stomach to see the street-to-street fighting that came later on, with people being dragged out of their homes and run through on their doorsteps. Nevertheless, I still heard the stories that came in with those I’d to patch up… bring the fight to peoples’ homes, and they get a lot less willing to turn and run. People armed with kitchen knives and meat cleavers, lurking behind walls and on rooftops… burning barricades in the slum streets…</i>", parse);
				Text.NL();
				Text.Add("<i>“I don’t want to dwell on it anymore,”</i> Aquilius says all of a sudden. <i>“I think you get the general idea by now, yes?”</i>", parse);
				Text.Flush();

				TimeStep({minute: 30});
			}, enabled : true,
		});
		options.push({ nameStr : "Free Cities",
			tooltip : "Did the Free Cities get involved in the whole mess?",
			func() {
				Text.Clear();
				Text.Add("<i>“Couldn’t rightly say. Zenith’s trying to see if they’ll lend us their support now, but back then… well, that’s anyone’s guess,”</i> Aquilius replies after a moment’s thought. <i>“I know there were a number of mercenary companies hailing from them that worked one side or another - bastards always crop up like flies to a corpse when there’s trouble to make money off. Some of the free cities also proclaimed they were willing to take in refugees from the civil war - some did flee down the King’s Road, although not many were willing or able to make the trip.", parse);
				Text.NL();
				Text.Add("<i>“It wouldn’t surprise me if they bankrolled some of the players in the civil war, stir up some trouble to keep the king from noticing them, but that’s just my guess. Anything else?”</i>", parse);
				Text.Flush();
				TimeStep({minute: 5});
			}, enabled : true,
		});
		options.push({ nameStr : "End",
			tooltip : "So what happened in the end?",
			func() {
				Text.Clear();
				Text.Add("<i>“Well, you can see for yourself,”</i> Aquilius says, his voice completely flat and emotionless. <i>“Full humans don’t like morphs, and vice versa. Here we sit, plotting the overthrow of the Riordain line. The king has grown cold and distant, and confers with shady characters like that Majid fellow. Whispers fly that he can’t love Rhylla like he did with his first wife. The slums are still filled with those who lost their homes during the war, and those who lost their parents in the killing have only just begun to leave the orphanages in the last handful of years.</i>", parse);
				Text.NL();
				Text.Add("<i>“You want to find someone to blame? Everyone has blood on their hands, but I think the guilds were the worst of the lot. At least those of the old blood had a place in the system - we knew what duties were expected of the nobles, even if they didn’t follow through, and knew where to place the blame and file our grievances.</i>", parse);
				Text.NL();
				Text.Add("<i>“The merchants threw their weight around without any binding responsibilities to go with them, didn’t even think twice about upending the peace between humans and morphs just to save their hides, and when the going got tough, tried to flee through the portals and leave us to deal with the mess their power grab created. No, they couldn’t just accept that the portals were going out and try to do something else with their lives. They just had to pull off that shit. The king was a vicious, cruel bastard in what he did to the morphs, but at least he was grieving and when he snapped out of it, he finally realized he’d fucking gone too far. The guilds?”</i>", parse);
				Text.NL();
				Text.Add("Aquilius spits on the ground and grinds the patch of spit with the toe of his boot. <i>“I fucking <b>hate</b> merchants. Give a poor man a fortune and he’ll fritter it away within a year or two because he doesn’t know how to manage the money, give a merchant power and pretty much the same thing happens, only with a whole lot more bloodshed. I’ve stayed awake many nights these past twenty years, [playername], but I’ll fondly remember the day Rewyn had every single one of the remaining rebellious guild masters drawn and quartered in the royal plaza. I like to think I’m not a violent man, but I damn well felt satisfied at their executions.</i>", parse);
				Text.NL();
				Text.Add("<i>“If you want me to be honest, we morphs were partly to blame, too. Was life perfect? No, it wasn’t. But it wasn’t too bad, either. All that freedom and equality the merchants tried to sell us - well, look at it this way. We had our own nobles in court to represent us. Now, we don’t. Everyone lived together back in the day, and even if the greetings weren’t completely warm, at least they were polite. Now, a good proportion of Rigard’s morph population is housed in the slums. Eyebrows were raised if a morph got together with a pure human; there’d be some talk and maybe a little shunning, but at least it wasn’t compared to bestiality or forbidden. We could walk in the streets without being harassed.”</i>", parse);
				Text.NL();
				Text.Add("The good surgeon blows smoke out of his nostrils. <i>“I’m just an old man yammering away, but it’s much easier to cheat someone when you’re telling him or her what he or she wants to hear, eh? But that’s what you get for trusting people with cash registers for souls. I don’t blame those who were taken in - virtue is more easily thrown away than one’s virginity on a fair summer day - but don’t ask me to do anything more than necessary for a swindler.”</i>", parse);
				Text.NL();
				Text.Add("He sighs, taking his pipe out of his beak and staring into the bowl as if it holds the mysteries of the universe. <i>“Nevertheless, Zenith’s going to fight. He’s like that; good boys fight for what they believe is right. When people fight, someone always ends up getting killed. The war produced enough cadavers for me to practice on back in the day, and I’d rather not have more turning up. It’s one of the reasons I’m here.”</i>", parse);
				Text.Flush();

				TimeStep({minute: 30});
			}, enabled : true,
		});
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("Aquilius shrugs. He doesn’t say anything, but it’s clear he’s glad to be free of the weighty subject. <i>“Anything else you’d like to discuss, [playername]?”</i>", parse);
			Text.Flush();

			AquiliusScenes.TalkPrompt();
		});
	}

	export function Smoke() {
		const player: Player = GAME().player;
		const aquilius: Aquilius = GAME().aquilius;

		const parse: any = {
			playername : player.name,
		};

		Text.Clear();
		Text.Add("You wonder aloud if Aquilius wouldn’t like some company while he puffs away.", parse);
		Text.NL();
		Text.Add("<i>“Sure. A smoke’s always great, but like food, it’s better when shared.”</i>", parse);
		Text.NL();
		Text.Add("Removing his pipe from his beak and knocking the ashes out of the bowl, Aquilius pulls out a small pouch from his vest and draws out two pinches of dried herbs. One he refills his pipe with, the other he rolls up in a small slip of paper to make a cigarette, which he offers to you. Taking it from him, you peer at its stuffing, but don’t recognize any of the torn leaves, petals and grasses in the mixture. It’s not tobacco of any sort, that much you’re certain.", parse);
		Text.NL();
		Text.Add("<i>“Need a light?”</i>", parse);
		Text.NL();
		if (Jobs.Mage.Unlocked(player)) {
			Text.Add("Nah, you’ve got it covered. You light up the end of your cigarette with a small flame on the tip of your finger; Aquilius does the same for his pipe, and the two of you settle down in your respective chairs to savor the smoke.", parse);
		} else {
			Text.Add("Sure. You watch as Aquilius concentrates a moment, then a tiny flame bursts into life on the tip of his index finger, which he holds out to you. You light your cigarette, he lights his pipe, and the two of you settle down in your respective chairs to savor the unique aroma that begins to waft through the tent.", parse);
			Text.NL();
			Text.Add("<i>“Not much of a magician myself,”</i> Aquilius explains, <i>“But you’ve got to admit that it’s bloody useful when you haven’t got any matches on hand.”</i>", parse);
		}
		Text.NL();
		Text.Add("Whatever this blend is, it’s a damn sight better than anything one could buy off the streets of Rigard. Light and strangely sweet on the tongue, the warm scent that fills your nose and mouth vaguely reminds you of incense, a stream of cool heat pouring into your lungs and seeping into the rest of your body. It’s not long before the smoke’s effects kick in - you feel calmer, steadier, better able to concentrate with all the nagging doubts lingering on the edges of your mind swept away. Aquilius himself is perfectly relaxed, leaning back in his chair as he puffs away with an air of satisfaction.", parse);
		Text.NL();
		Text.Add("Little wonder, then, that he takes this for his nerves. A surgeon needs a steady hand.", parse);
		Text.NL();

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("Curiosity piqued, you ask him what actually goes into the stuff you’re smoking, knowing full well that he won’t give you a straight answer. As expected, Aquilius scratches his beak and looks thoughtful for a moment.", parse);
			Text.NL();
			Text.Add("<i>“Oh, a bit of this and that,”</i> he replies in a lazy drawl. <i>“Pinch of mint for flavor… most of the stuff’s from the forest… some of those yellow-spotted mushrooms, cut and dried, though the spores are the most potent part. I suppose I should pass on the recipe before I croak, although I haven’t found someone worth giving it to yet. Worst comes to worst, I’ll write it down somewhere and let whichever lucky bastard finds it reap the spoils.</i>", parse);
			Text.NL();
			Text.Add("<i>“Don’t worry, it’s not physically addictive, though you could end up like me.”</i> He lets out a dry chuckle. <i>“Although that’s not the worst that could happen, is it?”</i>", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("The smoke is relaxing… perhaps a little too much so, and the incense-like scent - is that jasmine? Sandalwood? Citrus? - has an almost mystical quality to it. You’re aware that you’re in the infirmary tent, and yet the smell - it belongs in a temple, perhaps a museum, or somesuch…", parse);
			Text.NL();
			Text.Add("The world swirls and grows blurry before your eyes, spots of colour blossoming in your vision…", parse);
			Text.NL();
			Text.Add("You come to some time later, Aquilius gently shaking you on the shoulder. <i>“I know that a smoke can be relaxing, but don’t get <b>too</b> relaxed. The cots here are for those who need them.”</i>", parse);
			Text.NL();
			Text.Add("You’re not quite sure what happened in between then and now; bits of dreams and visions cling to the edges of your mind like words on a tongue, their presence undeniable but refusing to reveal themselves in full. Still, whatever you saw while you were out, it certainly wasn’t anything nasty, was it?", parse);
			Text.NL();
			Text.Add("<i>“Don’t let it get to your head too much. Back in the day, there were those who were a bit touched in the head. Let them get at a few mushrooms or smoke a handful of leaves, and suddenly they’re seeing demons and spirits coming out of the walls where other folk just get a little buzz.”</i>", parse);
			Text.NL();
			Text.Add("You promise to be careful, and settle back to enjoy the rest of the cigarette.", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("The two of you are content to just lean back and savor the smoke, letting your worldly cares slip away for a little bit. Oh, you’ll have to deal with them once your cigarette burns down, but a moment’s respite can’t hurt, can it? Aquilius has carefully poised himself in his seat, eyes half-lidded, head nodding a little as he partakes of the nightly ritual that gives order to his life.", parse);
			Text.NL();
			Text.Add("Silence, save for the snores and murmurs of the injured out front, watching wisps of smoke curl upward and eventually vanish - ah, this is the life.", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("Taking a long drag from your cigarette, you relish in the cool taste and wonder aloud how Aquilius managed to figure out this particular blend.", parse);
			Text.NL();
			Text.Add("<i>“You like it?”</i>", parse);
			Text.NL();
			Text.Add("Why, indeed, you do.", parse);
			Text.NL();
			Text.Add("<i>“Don’t buy crap from folks off the streets of Rigard - they cut their tobacco with all sorts of fillers to stretch it as thin as possible, and those do a number on your lungs. The only way to be sure you’re getting a good smoke is to do it all by yourself - from the growing and picking to the drying and mixing and finally to the point where you light up. It takes work, but by Aria’s tits, it’s worth it. It is so worth it.</i>", parse);
			Text.NL();
			Text.Add("<i>“As to how I figured it out… I had a lot of time in the war, and plenty of others had their own particular mixes they liked to roll. Being a lad like any other, I decided to experiment; those were hard days, and we draftees would smoke anything to pass the time. It’s been a while since then, but I’m still working on improving the blend.”</i>", parse);
		}, 1.0, () => true);
		scenes.Get();

		Text.NL();
		Text.Add("You could sit here forever, just staring off into space, but all good things must come to an end. Slow-burning as it is, your cigarette is eventually reduced to a stub, and Aquilius produces a small metal tray for you to put it out on.", parse);
		Text.NL();
		Text.Add("<i>“Enjoyed it?”</i>", parse);
		Text.NL();
		Text.Add("You did, thanks.", parse);
		Text.NL();
		Text.Add("Aquilius nods, then turns away from you. <i>“Good night, then. I shan’t keep you up - getting enough sleep is important for good health.”</i>", parse);
		Text.NL();
		Text.Add("And him?", parse);
		Text.NL();
		Text.Add("<i>“Oh, I’ll be turning in soon. Although knowing my luck, chances are that some fool will lop off his or her own arm in the middle of the night and come crying to me to have it sewn back on. Such are the vagaries of life, [playername] - I’ve grown used to them.”</i>", parse);
		Text.Flush();

		if (WorldTime().hour < 22) {
			StepToHour(22);
		} else {
			TimeStep({hour: 2});
		}

		aquilius.relation.IncreaseStat(100, 2);
		Gui.NextPrompt();
	}

	export function Appearance() {
		const parse: any = {};

		Text.Clear();
		Text.Add("You give the good surgeon a look-over.", parse);
		Text.NL();
		Text.Add("Aquilius is the kind of person who looks comfortable right where he is, in this tent that smells of antiseptic. At just under six feet tall, his shoulders slightly hunched, the eagle-morph is neither here nor there when it comes to build. He’s clearly capable of physical exertion when need be, yet disdainful of it for its own sake.", parse);
		Text.NL();
		Text.Add("Dressed in a thick vest of coarse cloth over a plain cotton shirt, he’s a man of simple tastes. Numerous other such vests lie stacked in a shelf near the back of the tent, which suggests that he doesn’t so much wash these as dispose of them when they get too stained. Even with the outlaws being squeezed for supplies most of the time, it stands to reason - he spends much of his time about the sick, after all. Tough cloth pants and leather boots complete the rest of his ensemble, well-worn and showing their age.", parse);
		Text.NL();
		Text.Add("Your eyes flicker over his, and he meets your gaze evenly, black pupils set in deep amber sclera. It’s a hard look, and he appears to be staring <i>through</i> you, giving you the impression that he’s not all quite there. With a shake of his head, he breaks the gaze and turns back to his duties. ", parse);
		if (WorldTime().hour < 17) {
			Text.Add("The ornate pipe so beloved to him is in its case and wedged in the breast pocket of his shirt, a bulge on his vest betraying its presence. Within easy reach should he need a quick smoke break, a faint scent of aromatic smoke lingers about it, discernable even through the case.", parse);
		} else {
			Text.Add("Aquilius’ precious pipe is firmly clenched in his beak, a thin wisp of aromatic smoke rising from the bowl as he takes drags from it, the eagle-morph sighing in satisfaction each time he inhales.", parse);
		}
		Text.NL();
		Text.Add("The rest of him, though, is in what might be charitably called “the prime of his life”. Aquilius’ feathers, while mostly a mixture of brown, gold and black, have begun to grey in patches; it’s most obvious in the wings that he usually keeps folded neatly on his back. Contrasting the usual hustle and bustle of the camp, the good surgeon moves with a relaxed demeanor; his hands - which while covered with feathers, are still humanlike - are steady, his motions deliberate and unhurried as he goes about his tasks with practiced ease. What vitality has left the surgeon as the years wear him down has been replaced with experience, and he’s clearly managed to leverage it to its full extent.", parse);
		Text.NL();
		Text.Add("All in all, Aquilius is the very picture of a genial, middle-aged man who’s decided to put down roots, even if they’re not exactly in firm ground.", parse);
		Text.Flush();
	}

	export function HelpOut() {
		const player: Player = GAME().player;
		const aquilius: Aquilius = GAME().aquilius;

		const parse: any = {
			playername : player.name,
		};

		Text.Clear();
		Text.Add("You ask Aquilius if there’s anything you can do to help out around the infirmary.", parse);
		Text.NL();
		if (aquilius.helpTimer.Expired()) {
			if (aquilius.flags.Met < AquiliusFlags.Met.Helped) {
				Text.Add("Aquilius eyes you uncertainly. <i>“I’m not exactly sure, [playername]. After all, I’m ultimately responsible for those under my care, and you’re a bit of an unknown - but on the other hand, it’d be stupid of me to turn away good help. Tell you what - why don’t I get you started on the simple tasks first, then move onto the others when you prove yourself capable of not fouling up?”</i>", parse);
			} else {
				Text.Add("<i>“There’s always work to be done here; I’ll gladly accept any help you’re willing to offer. What did you have in mind, [playername]?”</i>", parse);
			}
			Text.Flush();
			AquiliusScenes.HelpOutPrompt();
		} else if (aquilius.QualifiesForAnyJob(player)) {
			Text.Add("<i>“Your thoughtfulness and enthusiasm are appreciated, but I’d rather not get into the habit of relying on others to do my work for me,”</i> Aquilius tells you. <i>“Come back later if you’d like to continue helping out.”</i>", parse);
			Text.Flush();
		} else {
			Text.Add("<i>“No, no, no. There’re already enough hands helping out with the menial tasks; too many people trying to do the same thing only ends up in everyone getting in each others’ way. I’m sorry, but unless you have a skilled trade to ply, we’re quite well-staffed here. The thought is appreciated - I’m personally overworked - but more hands to a job doesn’t necessarily mean less work.”</i>", parse);
			Text.Flush();
		}
	}

	// TODO
	export function HelpOutPrompt() {
		const player: Player = GAME().player;
		const aquilius: Aquilius = GAME().aquilius;

		const parse: any = {
			playername : player.name,
		};

		// [name]
		const options: IChoice[] = [];
		options.push({ nameStr : "Gather herbs",
			tooltip : "Offer to go herb picking.",
			func() {
				Text.Clear();
				if (aquilius.flags.Herbs < AquiliusFlags.Herbs.Known) {
					Text.Add("<i>“This is the first time you’ve offered to go flower picking for me. Do you know what I’m looking for?”</i>", parse);
					Text.NL();
					Text.Add("You admit that no, you don’t.", parse);
					Text.NL();
					Text.Add("<i>“Canis root, willow bark - I’d rather not strip the trees in camp - feverfew, a few others… if you give me a moment, I’ll have a list written up for you in a flash.”</i>", parse);
					Text.NL();
					Text.Add("Aquilius is as good as his word. He retreats to the back of the infirmary tent, and it’s not long before you’re holding a small scrap of paper with a hastily scrawled list of ingredients on it. Seems like the stereotype about doctors and their handwriting also applies to the good surgeon.", parse);
					Text.NL();
					Text.Add("<i>“One important thing you must note, [playername]. Please refrain from being overzealous in your gathering. While the forest is very kind in sharing its bounty with us, I’d rather not get too ahead and pick the usual herb patches clean. Space for cultivation is very limited -”</i> he points at the few potted plants and mushroom log in the back - <i>“and a lot of my requirements are met from gathering.”</i>", parse);
					Text.NL();
					Text.Add("You reassure Aquilius that you’ll be careful, and prepare to head on out.", parse);
				} else {
					Text.Add("<i>“Well, I wouldn’t mind the help. I can’t keep asking Maria to keep an eye out for herbs when she’s supposed to be keeping an eye out for intruders instead; having someone dedicated to the task will take a load off everyone. Since you know what I’m generally after and what precautions to take, I won’t insult your intelligence and will just leave you to it, then.”</i>", parse);
					Text.NL();
					Text.Add("You give Aquilius a nod and prepare to head on out.", parse);
				}
				Text.NL();

				parse.ingredient = aquilius.SetHerb().sDesc();

				Text.Add("<i>“There is one thing. Today, I’m looking out for some [ingredient] in particular. If you could get your hands on some before you come back, I’d be glad to give you a little something in return for the extra effort. Happy hunting.”</i>", parse);
				Text.Flush();

				aquilius.flags.Herbs = AquiliusFlags.Herbs.OnQuest;

				TimeStep({minute: 10});

				Gui.NextPrompt();
			}, enabled : aquilius.QualifiesForHerbs(player),
		});
		options.push({ nameStr : "Tend to sick",
			tooltip : "Offer to help out in the infirmary.",
			func : AquiliusScenes.TendToSick, enabled : aquilius.QualifiesForHealing(player),
		});
		options.push({ nameStr : "Alchemy",
			tooltip : "Ask to help with the brewing.",
			func : AquiliusScenes.AlchemyHelp, enabled : aquilius.QualifiesForAlchemy(player),
		});
		/* TODO
		options.push({ nameStr : "name",
			tooltip : "",
			func : () => {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
			}, enabled : true
		});
		*/
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("On second thought, you’ll have to abstain for now.", parse);
			Text.NL();
			Text.Add("<i>“Hrmp, getting my hopes up,”</i> Aquilius grunts surlily.", parse);
			Text.Flush();

			AquiliusScenes.Prompt();
		});
	}

	// [Herbs] - Go flower picking like Aquilius asked you to.
	export function PickHerbs() {
		const party: Party = GAME().party;
		const aquilius: Aquilius = GAME().aquilius;

		const parse: any = {

		};

		Text.Clear();
		Text.Add("You set off on your flower hunt, eyes peeled for anything that might interest Aquilius. Happily, your ranger’s training in the lay of the land and its environs serves you well, your sharp gaze roaming from stand to stand and patch to patch as you wander off the beaten trails of the forest in search of the herbs Aquilius needs. ", parse);
		if (WorldTime().IsDay()) {
			Text.Add("Shafts of sunlight pierce through the forest’s thick canopy, lighting your way as you pick your way over gnarled roots and thick undergrowth, wandering as deep as you dare without running the risk of getting lost.", parse);
		} else {
			Text.Add("Shaded during the day, the forest is pitch-black at night. There’s practically no natural light to be had, and even with your ranger’s training the fear of getting lost amidst the trees lurks in the back of your mind, ready to spring out at you at any moment.", parse);
		}
		Text.NL();
		Text.Add("Unseen, things rustle about and above you; you do your best to ignore them and focus on the task at hand. By and large, the task proceeds at a smooth pace - while the forest does not freely give away its treasures, neither is it overly stingy to those who work hard.", parse);
		if (party.Num() > 1) {
			parse.comp = party.Num() === 2 ? party.Get(1).name :
							"your companions";
			Text.Add(" The fact that you have [comp] around to help doesn’t hurt, either.", parse);
		}
		Text.NL();
		Text.Add("Despite the forest being a dangerous place, you’re fortunate enough that nothing jumps you while you’re preoccupied with digging up roots and pulling mushrooms off tree roots. Still, the heat and humidity are beginning to get to you, and constantly wading through the thick, tangled undergrowth is taxing. Eventually, you decide that you’ve had enough, and call it a day.", parse);
		Text.NL();
		Text.Add("With all that nastiness behind you, you sort through today’s pickings - a medley of grasses, roots, bits of bark and the occasional odd mushroom. There’s about enough to fill a hand basket, which should be enough to appease Aquilius for a day’s worth of work; time to head back and see what he has for you.", parse);
		Text.Flush();

		TimeStep({hour: 5});

		aquilius.flags.Herbs = AquiliusFlags.Herbs.Finished;

		Gui.NextPrompt();
	}

	// Tend to sick (requires healer job available)
	export function TendToSick() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const aquilius: Aquilius = GAME().aquilius;
		const outlaws = GAME().outlaws;
		const kiakai: Kiakai = GAME().kiakai;

		let parse: any = {
			playername : player.name,
		};

		if (aquilius.flags.Met < AquiliusFlags.Met.Helped) {
			aquilius.flags.Met = AquiliusFlags.Met.Helped;
		}

		Text.Clear();
		Text.Add("You indicate to Aquilius that you since you know something about medicine, you wouldn’t mind helping out with the injured and infirm.", parse);
		Text.NL();
		if (aquilius.flags.Talk & AquiliusFlags.Talk.TendToSick) {
			Text.Add("<i>“While there’s no shortage of folk willing to do the menial jobs about these parts, we could always use an extra pair of skilled hands around,”</i> Aquilius tells you. <i>“Of course you’re more than welcome to do your share - more, if you’re so inclined.”</i>", parse);
		} else {
			Text.Add("Aquilius eyes you suspiciously after hearing your offer. <i>“Well, [playername], it’s not as if I couldn’t use the help around these parts. However, you’re a new and unknown quantity when it comes to the job, and I’m ultimately responsible for my patients. Why don’t we start you off slow, explain what needs to be done about these parts, and we can see what you’re capable of?”</i>", parse);
			Text.NL();
			Text.Add("That sounds fair. He clearly takes his job seriously.", parse);
			Text.NL();
			Text.Add("The introduction is concise but thorough: Aquilius walks you through the infirmary tent, briefly explaining the purpose of each and every implement in the vicinity, from the operating table to the small distillery he has going on. <i>“I know at times I’m probably sounding like I’m insulting your intelligence,”</i> he says as he points out the shelves and each of the contents, <i>“but it’s better to swallow your pride and bear with me rather than do something stupid down the line because you weren’t paying attention now. If the well-being of others weren’t at stake I wouldn’t care what you did, but since it is I’m not going to stand for sloppiness.</i>", parse);
			Text.NL();
			Text.Add("<i>“It doesn’t help that much of the equipment that I use here is makeshift, jury-rigged from the bits and pieces that Zenith’s people have brought to me over the months, so a lot of it doesn’t look like what most folks think it should.”</i>", parse);
			Text.NL();
			Text.Add("Your little tour over, he calls over his three assistants and briefly introduces you in turn, then dismisses them with a wave of his hand before turning back to you. <i>“All right, [playername]. Enough talk, let’s have at it. We’ll see what you’re made of.”</i>", parse);

			aquilius.flags.Talk |= AquiliusFlags.Talk.TendToSick;
		}
		Text.NL();

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("Today’s job is disgusting, but a daily necessity - taking out the trash. The “trash” to be disposed of is a medley of utter vileness - used bandages, cloth stained with various bodily fluids, cracked potion vials and an assortment of used sharp implements. These are carefully sealed within three sacks of rough cloth to prevent any of the fluids from seeping out, and then tied securely with cord.", parse);
			Text.NL();
			Text.Add("Wait, didn’t Aquilius say that he didn’t want anyone doing menial work?", parse);
			Text.NL();
			Text.Add("<i>“This isn’t menial work,”</i> he replies as he douses your hands with distilled alcohol. <i>“If I just left this to anyone in the camp, who knows if they might just dump it in the forest and leave it at that. Might happen. Might not happen. But there’s always the possibility that there’s a plague brewing in that bag, and I’d rather not take chances with such a danger. I want someone who can <b>appreciate</b> the risks involved to do the burning and dumping; it’s less likely they’ll do something stupid like bury it near the water table or worse, throw it into the river. Do you understand?”</i>", parse);
			Text.NL();
			parse.ess = player.mfTrue("", "ess");
			Text.Add("Aquilius is serious about this; shovel, matches and a small flask of lamp oil aside, he provides you with a smock cut from the same sackcloth his vest is. You look a little silly in the loose outfit - it looks like the sort of thing an impoverished priest[ess] might wear.", parse);
			Text.NL();
			Text.Add("<i>“Have fun,”</i> he says dryly. <i>“Reminder as always - the pit’s out around the back. Burn, then dump the ashes and bury the lot.”</i>", parse);
			Text.NL();
			Text.Add("The bag isn’t too heavy, but knowing what’s in it is worrying. At least you don’t draw many stares on the way out of the camp - most are smart enough to give you a wide berth, considering what you’re lugging about with you.", parse);
			Text.NL();
			Text.Add("The pit Aquilius mentioned is some distance from the gates, but at least the camp is still within sight and you don’t run into any trouble on the way there. Pouring the oil on the lot, you toss a lit match onto the sack, and it lights up nicely with an intense, clean-burning flame. When the lot is reduced to a mess of foul-smelling ashes you shovel all of it into the pit, then take a moment to savor your handiwork before heading back to camp.", parse);

			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				// Nothing
			}, 3.0, () => true);
			scenes.AddEnc(() => {
				player.strength.IncreaseStat(35, 1);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				player.spirit.IncreaseStat(35, 1);
			}, 1.0, () => true);
			scenes.Get();
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("After some thought, Aquilius sets you to work with the rest of his assistants caring for the ill and injured on the cots. Moving the poor bastards so they don’t get bedsores from lying in one spot for too long, changing bandages, making sure everyone gets enough water, and daubing down the fevered with a thick, cool solution of his own concoction. There are a number of other tasks involved, but they all have one goal: make sure everyone makes a full recovery as quickly as possible. ", parse);
			if (Jobs.Healer.Master(player)) {
				Text.Add("Your profound knowledge of medicine helps you through the tasks as you quickly soothe hurts and ease discomforts, going about your rounds with utmost speed.", parse);
			} else {
				Text.Add("Your knowledge of medicine is sufficient for you to make your rounds without needing supervision or asking too many questions, but you feel obliged to slow down a little and work carefully - Aquilius doesn’t look like the kind to tolerate mistakes.", parse);
			}
			Text.NL();
			Text.Add("Despite them being under the weather, most of the injured are surprisingly lucid and good natured - lewd jokes and mild ribbing aside, a couple of the more able-bodied amongst them flail about ineffectually in botched attempts to grope you when they think you’re not looking.", parse);
			Text.NL();
			if (party.InParty(kiakai)) {
				parse.name = kiakai.name;
				parse = kiakai.ParserPronouns(parse);

				Text.Add("<i>“May I help, too? I do know something of medicine, even without the direct use of Lady Aria’s blessings.”</i>", parse);
				Text.NL();
				Text.Add("You turn to find [name] looking up at you intently. The elf’s been so quiet that you’d almost forgotten [heshe] was there, and in turn, you turn to Aquilius. The surgeon looks between the two of you, then shakes his head and sighs.", parse);
				Text.NL();
				Text.Add("<i>“Oh, fine. [HeShe] can help out too, so long as [heshe] doesn’t start spreading about mumbo-jumbo in my home. You’re responsible for [himher], [playername].”</i>", parse);
				Text.NL();
				Text.Add("[name] is as good as [hisher] word, tagging along behind you and helping out in general, in addition to catching any minor oversights you make. It’s good to have another pair of eyes to go over things just in case.", parse);
			}
			Text.NL();
			Text.Add("Eventually, though, all the infirm are tended to and made comfortable, and you return to the good surgeon for him to assess your work.", parse);

			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				// Nothing
			}, 3.0, () => true);
			scenes.AddEnc(() => {
				player.intelligence.IncreaseStat(35, 1);
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				player.spirit.IncreaseStat(35, 1);
			}, 1.0, () => true);
			scenes.Get();
		}, 1.0, () => true);
		scenes.Get();

		Text.NL();
		Text.Add("<i>“Decent work, [playername],”</i> Aquilius tells you, noticing your return. <i>“I expected no less from you. Well, I suppose that’ll be all for today - why don’t you go and get some rest and come back tomorrow if you want to have another go at it? I’ll still be needed around these parts for a little while longer, so don’t wait up on me.”</i>", parse);
		Text.Flush();

		TimeStep({hour: 5});

		outlaws.relation.IncreaseStat(30, 1);
		aquilius.relation.IncreaseStat(100, 2);

		// #Set timer on helping out at infirmary for the rest of the day.
		aquilius.helpTimer = aquilius.HelpCooldown();

		Gui.NextPrompt();
	}

	export function AlchemyHelp() {
		const aquilius: Aquilius = GAME().aquilius;
		const outlaws = GAME().outlaws;

		const parse: any = {

		};

		if (aquilius.flags.Met < AquiliusFlags.Met.Helped) {
			aquilius.flags.Met = AquiliusFlags.Met.Helped;
		}

		Text.Clear();
		Text.Add("Knowing something of alchemy yourself, you offer to watch the proverbial pots so Aquilius can go about his more important tasks.", parse);
		Text.NL();
		if (aquilius.flags.Talk & AquiliusFlags.Talk.AlchemyHelp) {
			Text.Add("<i>“Well, I guess I can trust you with the apparatus.”</i>", parse);
			Text.NL();
			Text.Add("You’re about to say that you’ll be careful, but he waves you off. <i>“Yes, I know you’ll be careful. Let’s get started.”</i>", parse);
		} else {
			Text.Add("Aquilius gives you a long, hard look. <i>“Hmm… I don’t know…”</i>", parse);
			Text.NL();
			Text.Add("You promise that you’ll be careful.", parse);
			Text.NL();
			Text.Add("<i>“That’s what they all say. Words don’t necessarily mean much, it’s actions that count.”</i> He considers you for a little while longer, then slumps his shoulders. <i>“All right, know what? Sure, why not, I’ll let you have a go. Still, give me a while to explain the getup I have here…”</i>", parse);
			Text.NL();
			Text.Add("Aquilius is as good as his word, quickly showing you through the alchemical apparatus he has on hand. A lot of it is jury-rigged from glass tubes, empty wine bottles and other odds and ends, but it’s still recognisable as such. No bubbling cauldrons here, alas, but heat is provided by way of a burner that flickers with an intense orange flame when activated.", parse);
			Text.NL();
			Text.Add("<i>“This is my second little alchemist’s set,”</i> the good surgeon explains. <i>“First one got turned into a moonshine distillery when I didn’t need it anymore.”</i>", parse);
			Text.NL();
			Text.Add("And what does he make here, anyway?", parse);
			Text.NL();
			Text.Add("<i>“A bit of this, a bit of that as circumstances demand. Mostly, I just cook up alcohol for cleaning purposes - we go through that like a drunk with a bottle, but there’re some other popular bits and pieces, though. Come on, let me demonstrate.”</i>", parse);
			aquilius.flags.Talk |= AquiliusFlags.Talk.AlchemyHelp;
		}
		Text.NL();

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("Today’s task is relatively simple: the distillation of alcohol from spirits. It seems like Aquilius had been just about to get started before you came in; the reservoir is full and the burner positioned under it; all that’s required to get things started is to light the burner, which the good surgeon does posthaste.", parse);
			Text.NL();
			Text.Add("<i>“Alcohol dissolves many things that plain water can’t, so that makes it important for cleaning and as a potion base,”</i> Aquilius explains. <i>“Some potions that call for a measure of alcohol won’t work if you just use water.</i>", parse);
			Text.NL();
			Text.Add("<i>“Now, all I need you to do is to watch the mixture, and snuff out the flame once most of what we’re after has been distilled away. That, and watch the condenser, too - since I can’t get flowing water in here, you’ll need to top up the canister every now and then with cool water.”</i> He points down at a large bucket at the foot of the table. <i>“Well, I’ll leave you to it. Please don’t do anything stupid, there are sick people in here.”</i>", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("Today’s task is a mundane one: stirring. Leading you out of the infirmary tent and around the back, Aquilius points you at a large cauldron. Contained within is a clear, viscous liquid, and he picks up a long wooden stirrer and hands it to you without further comment.", parse);
			Text.NL();
			Text.Add("You ask him what’s inside.", parse);
			Text.NL();
			Text.Add("<i>“Preventatives,”</i> he answers with a completely straight face.", parse);
			Text.NL();
			Text.Add("Oh. You’d better not mess up then, right?", parse);
			Text.NL();
			Text.Add("<i>“Right. Slowly and evenly does the trick; no point tiring yourself out early on.”</i> Aquilius lights the fire under the cauldron with a snap of his fingers, then passes you a few wax-paper packages. <i>“Just watch out for the color changes in the mixture - they’ll be pretty obvious - and add these reagents one at a time. It’s pretty hard to mess up.</i>", parse);
			Text.NL();
			Text.Add("<i>“Well, don’t let me get in your way. I’ll see you in a couple of hours.”</i>", parse);
		}, 1.0, () => true);

		// TODO More scenes later?

		scenes.Get();

		Text.NL();
		Text.Add("Well, nothing to do but to get to work. You do the best you can, following Aquilius’ instructions to the letter; a faint alchemical smell begins to fill the air as the mixture comes to a boil. The good surgeon himself pops in every now and then to check in on your progress; while he doesn’t say anything, there’s always a mild apprehension about him that one could very well find irritating. Sure, you can understand his tendency to worry when it comes to alchemy, but why bother delegating in the first place if he’s going to supervise you that much?", parse);
		Text.NL();
		Text.Add("After a few hours, though, taps you on the shoulder and gives you a nod. <i>“That’ll do.”</i>", parse);
		Text.NL();
		Text.Add("You look up and turn to him, stretching your stiff muscles. That’ll do?", parse);
		Text.NL();
		Text.Add("<i>“Yes, it’ll do. You’ve done adequately, and for that, you do have my gratitude. I’m afraid there’s not much I can pay you directly with, but everyone in the camp respects those who’re willing to do more than the minimum to scrape by. Go and get some rest, and if you still want to turn up here tomorrow, I won’t say no.”</i>", parse);
		Text.Flush();

		TimeStep({hour: 5});

		outlaws.relation.IncreaseStat(30, 1);
		aquilius.relation.IncreaseStat(100, 2);

		// #Set timer on helping out at infirmary for the rest of the day.
		aquilius.helpTimer = aquilius.HelpCooldown();

		Gui.NextPrompt();
	}
}
