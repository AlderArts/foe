import * as _ from "lodash";

import { Gender } from "../../body/gender";
import { Encounter } from "../../combat";
import { Bandit } from "../../enemy/bandit";
import { Equine } from "../../enemy/equine";
import { Entity } from "../../entity";
import { GAME, TimeStep, WorldTime } from "../../GAME";
import { GameState, SetGameState } from "../../gamestate";
import { Gui } from "../../gui";
import { Party } from "../../party";
import { Text } from "../../text";
import { Season, Time } from "../../time";
import { LeiFlags } from "./lei-flags";

import { LeiSexScenes } from "./lei-sex";

export namespace LeiTaskScenes {
	let LeiScenes: any;
	export function INIT(leiScenes: any) {
		LeiScenes = leiScenes;
	}

	export function OnTask() { // TODO add tasks
		return LeiTaskScenes.Escort.OnTask();
	}

	export function AnyTaskAvailable() { // TODO add tasks
		return LeiTaskScenes.Escort.Available();
	}

	export function StartTask() { // TODO add tasks
		if (LeiTaskScenes.Escort.Available()) {
			LeiTaskScenes.Escort.Start();
		}
	}

	export function TaskPrompt() {
		const lei = GAME().lei;
		const parse: any = {

		};

		Text.Clear();
		Text.Add("You ask Lei if he has any contracts for you.", parse);
		Text.NL();
		if (LeiTaskScenes.Escort.OnTask()) {
			LeiTaskScenes.Escort.OnTaskText();
		} else if (lei.Annoyance() > 0) {
			Text.Add("<i>“You botched the last job I gave you, so why should I give you any more?”</i> Lei demands. <i>“When you make such gross errors, it’s not only your reputation that suffers, but mine as well, as I made the apparent mistake in recommending you.”</i> He turns away from you in annoyance.", parse);
			Text.NL();
			Text.Add("Perhaps you could prove that your abilities are worthy of his trust by winning one or two spars against him.", parse);
		} else if (LeiTaskScenes.AnyTaskAvailable()) {
			LeiTaskScenes.StartTask();
		} else {
			Text.Add("<i>“I have nothing for you right now,”</i> Lei says. <i>“Perhaps if you check back at a later time.”</i>", parse);
		}
		Text.Flush();
	}

	export namespace Escort {
		export function Available() {
			const lei = GAME().lei;
			if (lei.flags.Met >= LeiFlags.Met.OnTaskEscort) { return false; }
			return true;
		}
		export function Eligable() {
			const player = GAME().player;
			return player.level >= 6;
		}
		export function OnTask() {
			const lei = GAME().lei;
			return lei.flags.Met === LeiFlags.Met.OnTaskEscort;
		}
		export function OnTaskText() {
			const lei = GAME().lei;
			const parse: any = {

			};

			if (lei.taskTimer.Expired()) { // aka missed it
				Text.Add("<i>“Since you’re asking now, despite the fact that you were supposed to meet with the contractor between ten and seventeen, I can only assume you missed it.”</i> Lei scowls at you. <i>“Your first job and you embarrass me already.”</i>", parse);
				Text.NL();
				Text.Add("<i>“At least try not to compound your failure. Speak with Ventor Orellos and see if he still needs you, or if you can make it up to him. Beg on your knees if you have to.”</i>", parse);
				Text.NL();
				Text.Add("You nod, and retreat before his glare.", parse);

				lei.annoyance.IncreaseStat(1, 1);
			} else {
				parse.date = lei.taskTimer.ToHours() <= 17 ? "today" : "tomorrow";
				Text.Add("<i>“I’ve already told you your task,”</i> Lei says, looking mildly annoyed. <i>“Report to Ventor Orellos between ten and seventeen [date] and guard him while he collects money. Very simple.”</i>", parse);
				Text.NL();
				Text.Add("Right. You tell him you just wanted to double-check the details, and thank him for the reminder.", parse);
			}
			Text.Flush();
			LeiScenes.InnPrompt();
		}

		export function Completed() {
			const lei = GAME().lei;
			return lei.flags.Met >= LeiFlags.Met.CompletedTaskEscort;
		}

		export function Coin() {
			// TODO
			return 150;
		}

		export function Start() {
			const lei = GAME().lei;
			const parse: any = {
				coin : Text.NumToText(LeiTaskScenes.Escort.Coin()),
			};

			if (LeiTaskScenes.Escort.Eligable()) {
				Text.Add("<i>“In fact, I do. A contact brought a small task for me. I could not take it on, but I informed her that I had someone in mind for it. It’s suitable for a first job.”</i>", parse);
				Text.NL();
				Text.Add("You idly ask if you’re going to have to kill rats in someone’s basement.", parse);
				Text.NL();
				Text.Add("Lei rolls his eyes. <i>“No, nothing so silly as that. Instead, you will be doing simple escort work,”</i> he explains. <i>“It is not glamorous, but little paying work is. There is always some fool volunteering for any job involving glory, and if there is a volunteer, why pay?”</i> You idly wonder if Aria plans to pay you...", parse);
				Text.NL();
				Text.Add("<i>“You are to meet the merchant Ventor Orellos at his home in the Plaza between ten and seventeen tomorrow, and accompany him as he collects his share of the profits from several establishments.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I have been advised that the proceeds may amount to a significant sum of money, so it would not be surprising if he were attacked if anyone learns of his errand. Your pay upon the completion of the job will be [coin] coins.”</i>", parse);
				Text.NL();
				Text.Add("Does he have any more information?", parse);
				Text.NL();
				Text.Add("<i>“No,”</i> Lei replies. <i>“I do not believe any more is essential, though Ventor may have additional details for you when you meet him.”</i>", parse);
				Text.NL();
				Text.Add("You nod in acceptance. It seems straightforward enough.", parse);
				Text.NL();
				Text.Add("<b>You should meet Ventor Orellos at his home in the Plaza between ten and seventeen tomorrow for an escort job. Don’t be late!</b>", parse);

				TimeStep({minute: 15});

				lei.flags.Met = LeiFlags.Met.OnTaskEscort;

				const step = WorldTime().TimeToHour(17);
				lei.taskTimer = new Time(0, 0, step.hour < 12 ? 1 : 0, step.hour, step.minute);
			} else {
				Text.Add("He looks you over critically, his eyes roving over your body. <i>“I do not believe you are yet strong enough for any of the contracts I have. You will have to train a little more before I am comfortable recommending you to anyone.”</i>", parse);
				Text.NL();
				Text.Add("You purse your lips, but nod in acceptance. Looks like you’ll have to practice some more first.", parse);
				Text.NL();
				Text.Add("<b>This job requires level 6 to unlock.</b>", parse);
			}
			Text.Flush();

			LeiScenes.InnPrompt();
		}

		export function Estate() {
			const player = GAME().player;
			const party: Party = GAME().party;
			const lei = GAME().lei;
			const kiakai = GAME().kiakai;
			const terry = GAME().terry;
			const rigard = GAME().rigard;
			let parse: any = {
				sirmadam : player.mfFem("sir", "madam"),
				playername : player.name,
			};

			const late = lei.taskTimer.Expired();
			let prof = 0;

			if (!late) {
				lei.flags.T1 |= LeiFlags.EscortTask.OnTime;
			}

			parse.comp = party.Num() === 2 ? party.Get(1).name : "your companions";

			Text.Clear();
			parse.garden = WorldTime().season === Season.Winter ? "a garden, resting through the winter" : "a lush flower garden";
			Text.Add("You follow Lei’s directions and find yourself in front of a gated estate. Past the ornate entranceway lies [garden], and beyond that, a three-story building. Despite its relatively modest size, the building boasts lavish ornamentation, giving it an appearance of opulence that speaks of significant wealth.", parse);
			Text.NL();
			Text.Add("After a moment’s wait, a pure human footman approaches you from somewhere to the right of the gates. It seems there’s some watch post there you hadn’t noticed.", parse);
			Text.NL();
			Text.Add("<i>“May I assist you, [sirmadam]?”</i> he politely inquires.", parse);
			Text.NL();
			if (late) {
				Text.Add("You explain that you were supposed to escort Ventor Orellos on his rounds, but you missed your appointment, and would like to make up for it.", parse);
				Text.NL();
				Text.Add("The footman does not even bat an eyelash. <i>“Very good, [sirmadam].", parse);
			} else {
				Text.Add("You explain that you have a contract to escort Ventor Orellos today.", parse);
				Text.NL();
				Text.Add("<i>“Very good, [sirmadam], I have been told to expect you.", parse);
			}
			Text.Add(" Please, follow me, and I will show you to the master.”</i> The man waits for your nod of acceptance before turning and leading you down the straight cobbled path to the house.", parse);
			Text.NL();
			if (WorldTime().season === Season.Spring || WorldTime().season === Season.Summer) {
				Text.Add("On both sides, flowers bloom in a carpet of color, a few narrow walk paths snaking through the beds. Toward the sides of the compound, bushes of roses bloom pink and red. They must have a full-time gardener tending the plants.", parse);
			} else {
				parse.season = WorldTime().season === Season.Winter ? "in the winter season" : "to the season of falling leaves";
				Text.Add("On both sides, a scattering of flowers still blooms, providing a sprinkling whites and violets [season]. You see some rose bushes toward the sides of the compound, but they stand merely green, the flowers resting, awaiting spring. To have flowers, even in this state, suggests the family likely retains a full time gardener to take care of the plants.", parse);
			}
			Text.NL();
			Text.Add("The house is still and quiet, although looking past the sun reflected in the bay windows, you glimpse a dark-skinned young man pacing in evident agitation. The footman holds the door open for you, and you step inside, passing into a vestibule. Paintings adorn the walls of the chamber, while elaborately patterned carpets cover most of the floor.", parse);
			Text.NL();
			Text.Add("Your guide holds up a hand for you to wait inside the door.", parse);
			if (player.HasLegs()) {
				Text.Add(" <i>“This is a shoe-free home, [sirmadam],”</i> he says, motioning toward a row of soft brown slippers on a bench beside the door.", parse);
			}
			Text.NL();
			Text.Add("From there, the footman leads you further, passing through a pair of rooms, before reaching your destination. He knocks on the door, and after a moment, you are announced, admitted, and find yourself in a spacious well-lit study. The windows open on a back yard and stables, a pair of carriages parked in one corner. Shelves of books line the paneled walls of the room, and a tall pile of ledgers sits on one edge of the wide desk.", parse);
			Text.NL();
			parse.c = party.Num() > 1 ? Text.Parse(", asking [comp] to wait outside", parse) : "";
			Text.Add("The opposite corner is occupied by a dark skinned young woman with a few streaks of green dyed in her pitch black hair. It seems she was talking to the portly man sitting behind the desk, but as you enter[c], she looks up at you with a smile.", parse);
			Text.NL();
			if (late) {
				Text.Add("<i>“Oh, Father has mentioned you!”</i> she says, her voice high but measured. Her eyes roam over your body, not shying away from any detail. <i>“But were you not supposed to be here some time ago? Well, no matter, I’m certainly glad that you came now.”</i> She bites her lower lip cutely.", parse);
				Text.NL();
				Text.Add("The man waves for her to be quiet, before rising with a heave. <i>“When we received Lei’s recommendation, we thought you would be reliable. Lateness costs money - for us, and for you. We had to make alternate arrangements in your absence. Your payment will be half of the agreed upon amount as a penalty.”</i>", parse);
				Text.NL();
				Text.Add("You nod in acceptance. You’re not sure you could show up in front of Lei again if you backed out here.", parse);
				Text.NL();
				Text.Add("<i>“Allow me to introduce myself then,", parse);

				lei.annoyance.IncreaseStat(100, 2);
			} else { // on time
				Text.Add("<i>“You must be the one Father mentioned,”</i> she says, her voice high but measured. Her eyes roam over your body, not shying away from any detail. <i>“He was quite disappointed when he couldn’t get Lei, you know, but looking at you, I’m sure he was wrong to be.”</i> She bites her lower lip cutely.", parse);
				Text.NL();
				Text.Add("The man waves for her to be quiet, before rising with a heave. <i>“Allow me to introduce myself,", parse);
			}
			Text.Add(" I am Ventor Orellos, and this is my daughter Aliana. A sweet child, though she can be a touch impetuous.”</i> He smiles up at her fondly. <i>“I am glad to make your acquaintance, [playername].”</i>", parse);
			Text.NL();
			Text.Add("You reply politely, and catch Aliana’s eye, smiling. Impetuous isn’t so bad sometimes.", parse);
			Text.NL();
			Text.Add("If the merchant minds - or notices - the exchange, he makes no comment. ", parse);
			Text.NL();
			Text.Add("<i>“I had to remove my regular collector recently, as it had turned out that he was stealing more than I thought,”</i> Ventor explains with a chuckle, <i>“so today I’ll have to make the rounds myself. The man had employed his own guard, so I’ll need your assistance for now, until I straighten out the long term arrangements.”</i>", parse);
			Text.NL();
			if (late) {
				Text.Add("You nod in acknowledgement.", parse);
			} else {
				Text.Add("You nod in acceptance.", parse);
			}
			Text.Add(" That’s about what you had been told.", parse);
			Text.NL();
			Text.Add("Aliana hops off the desk. <i>“I’m coming with you, right, daddy?”</i> she asks the merchant. <i>“I want to see how collection works!”</i> With the way she’s been acting, you have your doubts as to whether that’s really her motivation.", parse);
			Text.NL();
			Text.Add("The older man’s stern face melts into a smile. <i>“Of course, you know I can’t refuse you.”</i> He looks at you over her shoulder. <i>“I will trust you to protect my daughter above all else, [playername]. Do not disappoint me.”</i>", parse);
			Text.Flush();

			TimeStep({minute: 30});

			Gui.NextPrompt(() => {
				Text.Clear();
				parse.c = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
				Text.Add("It takes another half hour for them to get ready, while you[c] sit in the foyer, idly looking over the garden. When your employer descends from upstairs, he’s wearing dark formal clothes, well-made, but not ostentatious. It seems he decided on an understated style, perhaps to avoid drawing too much attention.", parse);
				Text.NL();
				Text.Add("Aliana, on the other hand, went in the opposite direction. Her outfit hugs her body tightly, emphasizing her cute breasts and curvy butt, drawing the eye to all the right places.", parse);
				Text.Flush();

				TimeStep({minute: 30});

				// [Flirt][Don’t]
				const options = new Array();
				options.push({ nameStr : "Flirt",
					tooltip : "You’re pretty sure she’s showing off for you, so why not compliment her?",
					func() {
						Text.Clear();
						Text.Add("You let your eyes roam languidly over Aliana’s body, and she smiles at you, clearly enjoying the attention. When she stands before you, you let your gaze drift up her neck and stop at her lips, and tell her that you quite like her outfit.", parse);
						Text.NL();
						Text.Add("<i>“Why, thank you,”</i> she almost purrs.", parse);
						Text.NL();
						Text.Add("Ventor coughs audibly, looking annoyed with you. <i>“We shall be on our way now. Follow me.”</i>", parse);

						rigard.alianaRel.IncreaseStat(100, 3);
						lei.flags.T1 |= LeiFlags.EscortTask.Flirted;

						Gui.PrintDefaultOptions();
					}, enabled : true,
				});
				options.push({ nameStr : "Don’t",
					tooltip : "It’s your first job. You’re supposed to remain professional, aren’t you?",
					func() {
						Text.Clear();
						Text.Add("You keep your expression tactfully neutral, meeting Ventor’s eyes as he approaches you.", parse);
						Text.NL();
						Text.Add("He inclines his head in acknowledgement to you. <i>“Come, we should be on our way,”</i> he says, motioning for you to follow.", parse);

						prof += 1;

						Gui.PrintDefaultOptions();
					}, enabled : true,
				});

				Gui.Callstack.push(() => {
					Text.Add(" He leads you out a back door to the yard you saw out the window, and Aliana walking beside you, her arm almost rubbing against yours. A pair of horses are harnessed to a solid-looking coach, and the driver awaits your arrival.", parse);
					Text.NL();
					Text.Add("<i>“Did Alten not want to come?”</i> Aliana asks.", parse);
					Text.NL();
					Text.Add("<i>“No,”</i> Ventor says. Both look a little dejected at that.", parse);
					Text.NL();

					party.SaveActiveParty();
					let comp = party.GetInParty(1);

					Gui.Callstack.push(() => {
						parse.f = player.HasLegs() ? " between your feet" : "";
						parse.comp = comp ? comp.name : "";
						parse.c = party.Num() > 1 ? Text.Parse("[comp] and Aliana’s father sit", parse) : "her father sits";
						Text.Add("You step inside and Aliana takes a seat beside you on the comfortable upholstery, while [c] across. On the floor[f] rests a solid wooden strongbox - it seems like it’s light enough to carry, but only just. If someone were to steal it, it would give in to a determined assault eventually, but you suspect it would take a good amount of time to break through.", parse);
						Text.NL();
						Text.Add("You pass out of the estate gates, and the coach rides smoothly over the neatly cobbled streets. Along the way, Ventor explains that you’ll be visiting six stores he has large stakes in today. Apparently, two of the stores are run by craftsmen he has invested in, and the rest deal in a variety of trade goods. He has several caravans of his own running the trade routes, but most of the stock for the shops comes from wholesalers.", parse);
						Text.NL();
						if (comp === terry) {
							parse = terry.ParserPronouns(parse);
							Text.Add("You notice Terry eyeing the merchant speculatively out of the corner of [hisher] eye, and give [himher] a warning glare. You are <i>not</i> robbing your employer.", parse);
							Text.NL();
						}
						Text.Add("It does not take long for you to reach the first of the shops in the Merchants’ District. An ornate façade looks out onto the street, large windows displaying beautiful white carvings and elaborately patterned carpets. The carpets aren’t quite as nice as those at the Orellos estate, but you still suspect no one outside the upper classes would be able to afford them.", parse);
						Text.NL();
						Text.Add("Ventor asks you to wait outside while he conducts his business, and Aliana follows him in with an apologetic smile.", parse);
						if (comp === kiakai) {
							parse = kiakai.ParserPronouns(parse);
							Text.NL();
							Text.Add("You remark to [comp] that there’s really some remarkable workmanship on display here.", parse);
							Text.NL();
							Text.Add("<i>“That is true, [playername],”</i> [heshe] replies, <i>“but I cannot help but wonder if this is such a good thing. You have seen the way people live in the slums. Would not some of the wealth spent on carpets be better used to assist those in need?”</i>", parse);
							Text.NL();
							Text.Add("You point out that certainly helping is good, but it is best when those who have the wealth help of their own accord. It’s a difficult thing to force people to give charity.", parse);
							Text.NL();
							Text.Add("You pass an easy twenty minutes in engaging discussion before", parse);
						} else if (comp) {
							Text.NL();
							Text.Add("You chat about the goods on display, as well as your employer and his daughter with [comp], almost forgetting why you’re there. Despite the relaxed atmosphere, you still can’t help but feel a little nervous - nothing <i>should</i> go wrong, but you don’t want to mess up your first contract.", parse);
							Text.NL();
							Text.Add("Nonetheless, you pass an easy twenty minutes in engaging discussion before", parse);
						} else {
							Text.Add(" You attempt to strike up a conversation with the coachman, but he proves stoically unresponsive, and in the end you resort to sitting beside him in silence, settling in to wait. You glance around from time to time, trying your best to seem guard-like, but notice nothing untoward.", parse);
							Text.NL();
							Text.Add("It’s a good twenty minutes before", parse);
						}
						Text.Add(" father and daughter emerge from the store with a heavy-looking satchel in hand. They are engaged in a lively discussion about what’s selling and what isn’t, and which way prices are likely to go", parse);

						const check = Math.max(player.Int(), player.Cha()) + _.random(1, 20);
						const goal = 40;

						if (check >= goal) {
							Text.Add(". It’s not something you know much about, but you manage to get a few remarks in, pulling yourself into the discussion. Ventor regards you with renewed interest after a particularly astute comment.", parse);
							prof += 0.5;
						} else {
							Text.Add(", thoroughly excluding you from the discussion by force of expertise.", parse);
						}
						Text.Add(" From her enthusiasm, it seems Aliana really did come to learn about the business.", parse);
						Text.NL();
						Text.Add("The next four stores are about the same. The two go in, you wait, they come out. During one of the stops, a man approaches the driver and asks who the coach belongs to, but that’s about the extent of unexpected events.", parse);
						Text.NL();
						Text.Add("<i>“We’re almost done!”</i> Aliana says, stretching languidly, as you climb into the carriage to go to the final store. <i>“My eyes are starting to hurt from staring at all those books. Can’t we tell them to write neater, Father?”</i>", parse);
						Text.NL();
						Text.Add("Ventor rubs his chin thoughtfully. <i>“It is an idea, but we’d probably have to pay to have someone teach them. It’s unlikely to be worth the investment, I am sad to say. Though you will be happy to know that the proprietor of the last store has fine handwriting, despite working in the slums.”</i>", parse);
						Text.NL();
						Text.Add("<i>“Ah, that’s a relief,”</i> she says. <i>“Maybe I can get through the day without a headache after all.”</i>", parse);
						Text.NL();
						Text.Add("Aliana slumps back in her seat, rubbing her eyes, and you see Ventor’s shoulders droop, a concession to tiredness you had not expected from the man. You didn’t think fetching money would be this much work. The two didn’t even seem particularly pleased as they deposited satchel after satchel into the lockbox on the floor. How much must they have for collecting these amounts to feel like a menial chore to them?", parse);
						Text.NL();
						Text.Add("The horses neigh suddenly, and the steady drum of their trot turns into a panicked clatter of hoofs as the coach bumps and lurches to the side. Somehow, the horses manage to come to a stop before reaching the wall, but with the way the coach is angled, it would take some work to turn around. And with the side window facing forward, you see what’s ahead.", parse);
						Text.NL();
						Text.Add("A hastily erected barricade of broken furniture and half-rotted timber blocks off the street. It looks flimsy enough that the horses would’ve probably been able to charge through it if it were not for the four men who stand behind it. They glance hesitantly at each other as you come to a stop before raising their weapons and walking toward the disabled coach.", parse);
						Text.NL();
						parse.c = party.Num() > 1 ? Text.Parse(", [comp] following close behind", parse) : "";
						Text.Add("Looks like you’re going to have to fight for your pay after all. You push open the door - and shouting for Aliana and Ventor to run - jump out[c]. You stop in the middle of the road and await the approaching assailants. They seem like ordinary enough residents of the quarter. Morphs wearing drab clothes adorned with patches and holes, they are armed with clubs and long knives. Not the deadliest of weapons, but dangerous enough.", parse);
						Text.NL();
						Text.Add("Behind your back, you hear Ventor tell the driver to carry the lockbox, his orders mixed with curses, and then three sets of footsteps hurry off. Your eyes dart between the four ambushers, as they spread out warily around you.", parse);
						Text.NL();
						Text.Add("It’s time to do your job.", parse);
						Text.Flush();

						TimeStep({minute: 20});

						/*
		#combat encounter
		4x enemies, level 6-7, scrapper style (probably tuned to require some decent decision making to win at level 6 with Kiai)
		disable submit/run option?
		#end combat
						*/
						const enemy = new Party();
						enemy.AddMember(new Bandit(Gender.male, 2));
						enemy.AddMember(new Equine(Gender.male, 2));
						enemy.AddMember(new Bandit(Gender.female));
						enemy.AddMember(new Equine(Gender.female, 2));
						const enc: any = new Encounter(enemy);

						enc.late = late;
						enc.prof = prof;

						enc.canRun = false;
						enc.onLoss = LeiTaskScenes.Escort.CombatLoss;
						enc.onVictory = LeiTaskScenes.Escort.CombatWin;

						Gui.NextPrompt(() => {
							enc.Start();
						});
					});

					if (party.Num() > 2) {
						Text.Add("It seems like there’s only enough space to seat four. You’ll only be able to take one of your companions with you for the job.", parse);
						Text.Flush();

						// [Companions]
						const options = new Array();
						for (let i = 1; i < party.members.length; ++i) {
							const p = party.Get(i);
							options.push({ nameStr : p.name,
								tooltip : Text.Parse("Take [name] with you.", {name: p.name}),
								func(obj: Entity) {
									Text.Clear();

									party.ClearActiveParty();
									party.SwitchIn(player);
									party.SwitchIn(obj);
									comp = obj;

									Gui.PrintDefaultOptions();
								}, obj : p, enabled : true,
							});
						}
						Gui.SetButtonsFromList(options, false, null);
					} else {
						Gui.PrintDefaultOptions();
					}
				});

				Gui.SetButtonsFromList(options, false, null);
			});
		}

		export function CombatLoss() {
			const player = GAME().player;
			const party: Party = GAME().party;
			SetGameState(GameState.Event, Gui);
			Text.Clear();

			const enc = this;

			const parse: any = {

			};

			Gui.Callstack.push(() => {
				Text.Clear();
				parse.l = player.HasLegs() ? "your foot" : "you";
				Text.Add("Damn, [l] slipped on a loose cobblestone, or that last attack would not have landed. You glare up at your winded opponents. They seem torn between going through your pockets and chasing after Ventor and the others, who have disappeared up the street. You attempt to shout up at the brigands that you won’t let them past you even if you are down, but your ribs ache a bit with the effort, and it really comes out as more of a wheeze.", parse);
				Text.NL();
				parse.comp = party.Num() > 1 ? (" and " + party.Get(1).name) : "";
				Text.Add("They seem to falter, no doubt frozen in fear by your fierce challenge, before turning and running full tilt back down the street, clambering over their crude barricade. Why couldn’t they do that while you were still standing? A moment later, you see a trio of guards running up the street. One of them stops to check on you[comp], while the other pair continues after the retreating robbers.", parse);
				Text.NL();
				Text.Add("Apparently, your employers ran into them and asked them to assist you. You take a helping hand up and thank the woman, though you’re sure you would’ve managed somehow with a last moment burst of strength even if they had not come.", parse);
				Text.NL();
				Text.Add("You tell her the details of the ambush, and she assures you they’ll do their best to catch the men. She releases you to go on your way, as she sets off to catch up with her companions. Accepting her word, you head back toward the mansion, where, from the guard’s", parse);
				LeiTaskScenes.Escort.PostCombat(enc, false);
			});

			Encounter.prototype.onLoss.call(enc);
		}

		export function CombatWin() {
			const player = GAME().player;
			const party: Party = GAME().party;
			const lei = GAME().lei;
			SetGameState(GameState.Event, Gui);
			Text.Clear();

			const enc = this;

			const parse: any = {

			};

			lei.flags.T1 |= LeiFlags.EscortTask.WonCombat;

			Gui.Callstack.push(() => {
				enc.prof += 2;

				Text.Clear();
				parse.l = player.HasLegs() ? "at your feet" : "before you";
				Text.Add("Your enemies lie [l], your victory complete. You’re catching your breath, wondering what to do next, when you see a trio of the City Watch jogging toward you from up the street.", parse);
				Text.NL();
				parse.comp = party.Num() > 1 ? " the two of" : "";
				Text.Add("Apparently, your employer ran into them and asked them to assist you. You tell the guards that for opponents of this caliber[comp] you were quite enough, though they are welcome to apprehend the attackers. Ventor would probably appreciate knowing how they knew to set the ambush here.", parse);
				Text.NL();
				Text.Add("The guards roll their eyes at your bravado, but set to work securing their incapacitated captives. You leave them to it and set out back toward the mansion, where, from the guards’", parse);
				LeiTaskScenes.Escort.PostCombat(enc, true);
			});

			Encounter.prototype.onVictory.call(enc);
		}

		export function PostCombat(enc: any, won: boolean) {
			const player = GAME().player;
			const party: Party = GAME().party;
			const lei = GAME().lei;
			const parse: any = {
				armor : player.ArmorDesc(),
			};

			const late = enc.late;

			Text.Add(" words, you expect Ventor and Aliana have arrived by now.", parse);
			Text.Flush();

			Gui.NextPrompt(() => {
				Text.Clear();

				// Restore active party
				party.LoadActiveParty();
				const comp = [];
				for (let i = 1; i < party.Num(); ++i) {
					const p = party.Get(i);
					if (p === enc.comp) { continue; }
					comp.push(p);
				}
				parse.comp = comp.length === 1 ? comp[0].name : "the companions you left at the estate";
				parse.c = comp.length > 0 ? Text.Parse(", [comp] close behind her", parse) : "";
				Text.Add("You walk back to the estate. Now that you are no longer weaving through the streets from store to store, the route feels much shorter. As you draw near the gates, an anxious Aliana rushes out to greet you[c].", parse);
				Text.NL();
				Text.Add("<i>“Are you alright?”</i> she asks. Without waiting for a response, she circles around you, ", parse);
				if (player.HPLevel() > 0.9) {
					Text.Add("marveling that you came out of the fight with nothing more than a few smudges on your [armor].", parse);
				} else {
					Text.Add("looking in dismay at each of your cuts and bruises, muttering words of sympathy at each one.", parse);
				}
				Text.NL();
				Text.Add("You interrupt her inspection, telling her that you’re okay, though being ambushed always leaves you a bit jumpy. You’re glad to see that she’s well.", parse);
				Text.NL();
				Text.Add("<i>“Oh, we were in no danger! I saw you bravely fighting those robbers, and I just knew there’s no way they could’ve gotten past you.”</i> She rubs your arm appreciatively. <i>“But come, you should tell Father how things went.”</i>", parse);
				Text.NL();
				Text.Add("She escorts you inside, back to the study, where you find Ventor pacing back and forth, deep in thought. He turns toward you as you enter. <i>“Tell me what happened,”</i> he instructs curtly.", parse);
				Text.NL();
				Text.Add("You recount your fight in detail, ", parse);
				if (won) {
					Text.Add("concluding with your grand victory and handover of prisoners to the guards.", parse);
					Text.NL();
					Text.Add("He smiles at you in approval. <i>“Ah, well done! ", parse);
					if (late) {
						Text.Add("I finally understand why Lei recommended you. Though you proved lacking in punctuality, your abilities, at least, are superlative.", parse);
					} else {
						Text.Add("I can see why Lei recommended you - you performed flawlessly.", parse);
					}
					Text.Add(" Let us hope the guards’ investigation goes well.”</i>", parse);
				} else {
					Text.Add("admitting that despite your valorous efforts, the villains managed to escape, though, you point out, the guards may yet get them.", parse);
					Text.NL();
					Text.Add("He frowns, looking concerned. <i>“Ah, that is quite unfortunate. Still, you fulfilled the crucial goal at least - Aliana escaped safely, and we did not lose any of the gold we had collected. As for the robbers, we must hope the guards prove fortunate.”</i>", parse);
				}
				Text.NL();
				Text.Add("The wooden floor creaks outside the room. <i>“It is concerning that they were able to set up an ambush so neatly in our path. Not only must they have known where we would go, but also what route we would take.”</i> He taps his chin thoughtfully.", parse);
				Text.NL();
				Text.Add("<i>“I asked Manel - that’s our driver - if he had noticed anything unusual, and he told me a passerby had approached him to verify who we were.”</i> He glances over at you, and you confirm that you remember that happening at one of the stops. <i>“However, that’s not enough information for something like this. I’ll have Manel investigated, of course, but he looked bewildered enough while we were escaping… I can only wish it will turn out to be something that simple.”</i>", parse);
				Text.Flush();

				let assist = false;

				const prompt = () => {
					// [Assist][Payment]
					const options = new Array();
					if (!assist) {
						options.push({ nameStr : "Assist",
							tooltip : "Offer your assistance in the investigation.",
							func() {
								assist = true;
								Text.Clear();
								Text.Add("You tell Ventor that you’re not sure who arranged that ambush, but you’re prepared to look into the matter for him if he wants.", parse);
								Text.NL();
								Text.Add("He waves your suggestion aside. <i>“No, no. Though I appreciate the offer, I have contacts who are proficient in such things,”</i> he says. <i>“Besides, bringing you up to speed on all the people who wish me ill or would like to get my money would take days,”</i> he adds with a belly laugh.", parse);
								Text.NL();
								parse.c = party.Num() > 1 ? "your party" : "you";
								Text.Add("The door is thrust open, and the young man you saw through a window when first arriving at the mansion stalks into the room. His eyes scan over [c] and Aliana before fixing on Ventor.", parse);
								Text.NL();
								Text.Add("<i>“I’ll take care of this investigation,”</i> he declares. <i>“I will not allow our family name to be disregarded so.”</i>", parse);
								Text.NL();
								Text.Add("Aliana and Ventor exchange glances, prompting the young man to glare even more intensely. <i>“Certainly, Alten, if you wish,”</i> Ventor says. <i>“I will provide you with references for my usual contacts.”</i>", parse);
								Text.NL();
								Text.Add("<i>“I have my own men, Father. They are more than capable of taking care of the matter.”</i> He pauses, glancing around the room again. <i>“Fear not, I shall find the perpetrators and ensure they are dealt with appropriately.”</i>", parse);
								Text.NL();
								Text.Add("<i>“Please come to me first,”</i> Ventor asks. <i>“Please.”</i>", parse);
								Text.NL();
								Text.Add("Alten nods vaguely. <i>“Very well then. Father. Aliana. Contractor.”</i> He fractionally inclines his head in your direction at this last. He stalks out of the room, looking as haughty as when he entered.", parse);
								Text.NL();
								Text.Add("Ventor sighs and Aliana looks bemused.", parse);
								Text.Flush();
								prompt();
							}, enabled : true,
						});
					}
					options.push({ nameStr : "Payment",
						tooltip : "Your job here is done. Get your payment and go.",
						func() {
							Text.Clear();
							Text.Add("You ask Ventor if he’s planning to visit the final store as well.", parse);
							Text.NL();
							Text.Add("He shakes his head. <i>“I think I will let that one wait until this matter is resolved.”</i> He narrows his eyes. <i>“Or, no, I will send an agent. It would not do to have them deter me from my purpose, however trivial that deterrence may seem.”</i>", parse);
							Text.NL();
							Text.Add("He focuses on you. <i>“Regardless, you have performed well, achieving ", parse);
							if (won) {
								Text.Add("exceptional results in hazardous conditions. ", parse);
								if (late) {
									Text.Add("I know we agreed that your payment was forfeit for lateness, but I would not leave you unpaid after performing such service.”</i>", parse);
								} else {
									Text.Add("Your performance leaves nothing to be desired - naturally, this merits a significant bonus.”</i>", parse);
								}
							} else {
								Text.Add("adequate results in hazardous conditions. ", parse);
								if (late) {
									Text.Add("I know I said your payment was forfeit for your lateness, but I would not have you go unpaid after fighting on my behalf.”</i>", parse);
								} else {
									Text.Add("Naturally, this merits additional pay.”</i>", parse);
								}
							}

							let pay = LeiTaskScenes.Escort.Coin() + 50;
							pay += enc.prof * 50;
							if (late) {
								pay /= 2;
							}
							pay = Math.floor(pay);

							party.coin += pay;

							parse.pay = Text.NumToText(pay);
							parse.late = late ? "... at least if they do not require punctuality" : "";

							Text.Add(" Ventor pulls out a neat leather purse from one of the drawers in the desk, and counts out your payment, handing over [pay] coins. <i>“I believe with that, our business is settled. Perhaps I will be in touch regarding future opportunities[late].”</i>", parse);
							Text.NL();
							Text.Add("You thank him for the bonus, and say your goodbyes to both him and Aliana. Perhaps you’ll see her again sometime as well - she certainly seems interested in seeing you.", parse);
							Text.NL();
							if (!assist) {
								Text.Add("As you step out the door of the study, you come face to face with the young man you saw through the window when you first arrived at the mansion. He inclines his head towards the exit in curt dismissal and, taking the door from your hands, stalks into the room.", parse);
								Text.NL();
								Text.Add("Your curiosity gets the better of you and you linger for a few minutes by the door, listening. The thick wood blocks most sounds of the conversation, but you do manage to make out snatches of the young man’s heated words. <i>“Father… family name through the mud… investigation.”</i>", parse);
								Text.NL();
								Text.Add("You notice the familiar footman round the corner, heading in your direction, and step away from the door. You doubt Lei would approve if he heard you had been caught eavesdropping. ", parse);

								const check = player.Int() + _.random(1, 20);
								const goal = 30;

								if (check >= goal) {
									Text.Add("Besides, you think you caught the gist of the conversation anyway. The young man - Ventor’s son, Alten - wants to take charge of investigating today’s events, and judging by his tone, Ventor is probably not thrilled by the prospect. Nothing to do with you anyway.", parse);
								} else {
									Text.Add("It’s nothing to do with you anyway.", parse);
								}
								Text.NL();
							}
							parse.won = won ? ", and quite a grand success at that" : "";
							Text.Add("You follow the footman back out over the lavish carpets, past the flowerbeds, and out the gates back to the Plaza. You stretch, sighing contentedly. Your first job was a success[won].", parse);
							Text.NL();
							Text.Add("You should return to Lei to make your report.", parse);
							Text.Flush();

							TimeStep({hour: 1});

							lei.flags.Met = LeiFlags.Met.EscortFinished;

							Gui.NextPrompt();
						}, enabled : true,
					});
					Gui.SetButtonsFromList(options, false, null);
				};
				prompt();
			});
		}

		export function Debrief() {
			const party: Party = GAME().party;
			const lei = GAME().lei;
			const parse: any = {

			};

			if (party.Num() === 2) {
				const p1 = party.Get(1);
				parse.comp = p1.name;
				parse.heshe = p1.heshe();
				parse.notS = "s";
			} else {
				parse.comp = "your companions";
				parse.heshe = "they";
				parse.notS = "";
			}

			const won = lei.flags.T1 & LeiFlags.EscortTask.WonCombat;
			const ontime = lei.flags.T1 & LeiFlags.EscortTask.OnTime;
			const flirted = lei.flags.T1 & LeiFlags.EscortTask.Flirted;

			TimeStep({hour: 1});
			lei.flags.Met = LeiFlags.Met.CompletedTaskEscort;

			Text.Clear();
			Text.Add("You tell Lei that you’d like to talk about the last job with him.", parse);
			Text.NL();
			Text.Add("He inclines his head. <i>“I have received feedback from Ventor. Let’s talk somewhere more private.”</i> He stands, motioning for you to follow, and leads you up the flights of stairs to the Twins’ penthouse suite.", parse);
			Text.NL();
			parse.lt = WorldTime().LightStr("but well-lit room", "room, lighting several candles on the way in");
			Text.Add("Sounds of the royals having fun come from a room further along, but Lei instead takes a left from the entrance, leading you into a small [lt]. It seems like this was intended to be a small guest room - there’s a bed, a narrow desk with a single chair, and a wardrobe opposite it, but no other furniture.", parse);
			if (party.Num() > 1) {
				Text.Add(" With you and Lei in, there’s not really any space for [comp], and [heshe] decide[notS] to wait in the lounge deeper in the suite.", parse);
			}
			Text.NL();
			Text.Add("Lei pulls out the chair. <i>“Sit.”</i> You do as indicated, and he himself hops on top of the desk, one foot resting on the edge, and looks down at you expectantly.", parse);
			Text.NL();
			Text.Add("After a moment’s thought, you decide there’s no point in lying or trying to conceal anything. Not only does he have Ventor’s account of events, but if you’re caught, you suspect the consequences could be rather dire.", parse);
			Text.NL();
			Text.Add("You tell him of your arrival, the mansion, your reception. Lei interrupts with a question about what the patterns of the carpets were, and follows up with others about things that you can’t imagine could possibly be relevant, and you try your best to answer.", parse);
			Text.NL();
			if (!ontime) { // Were late
				Text.Add("You explain how despite your lateness, you still got to do the job, albeit at reduced pay. Lei frowns. <i>“You failed at the simplest part.”</i> He sighs. <i>“Understand that if it is known that you fail to appear or are badly late for jobs, you will not be hired. Reliability is paramount - one would rather have someone who is half as skilled but comes every time than someone who misses one job in five.”</i>", parse);
				Text.NL();
				Text.Add("<i>“It is good that on this job you had a chance to show your worth, but if you persist in this, you will ruin your reputation, and tarnish mine.”</i> He waves for you to proceed.", parse);
				Text.NL();
				lei.relation.DecreaseStat(0, 1);
			}
			if (flirted) {
				Text.Add("You admit that Ventor’s daughter had seemed attracted to you, and you flirted with her. Lei shrugs. <i>“It is not very professional, but not a big thing as long as it does not jeopardize your decision-making. If she had been the employer, I would have even commended it.”</i>", parse);
			} else {
				Text.Add("You mention that Ventor’s daughter flirted with you, but you stayed professional, and Lei nods in approval.", parse);
				lei.relation.IncreaseStat(100, 1);
			}
			Text.NL();
			Text.Add("You summarize the trip and talk about the stops at each of the stores. Lei presses you for details of what you saw, and seems disappointed when you cannot recall too much.", parse);
			Text.NL();
			Text.Add("<i>“The time you wait is for observation and planning, not chatter,”</i> he explains. <i>“They must have had someone watching you, and had you been more attentive, you may have known about them before you ran head first into an ambush.”</i>", parse);
			Text.NL();
			parse.won = won ? "proudly describing how you won" : "sheepishly explaining your loss";
			Text.Add("From there, there is not much left. You go through the ambush and subsequent fight in detail, [won], and finish up with the appearance of the guards, your return to the estate, and the appearance of the young man.", parse);
			Text.NL();
			if (won) {
				Text.Add("Lei gives you a rare smile. <i>“Well done! I thought you would be able to handle something of this level. Of course, you will have to improve your skills to handle more challenging - and rewarding - tasks, but it is good that you were well prepared for your first one.”</i>", parse);
				Text.NL();
				Text.Add("You nod in acknowledgement. There are certainly still heights you haven’t reached, and enemies you would have trouble with.", parse);
				Text.NL();
				Text.Add("<i>“You exceeded your obligations on this job. Such actions will make your reputation grow, and a reputation is a useful thing to have.”</i>", parse);
			} else { // Lost
				Text.Add("Lei narrows his eyes. <i>“Perhaps I had underestimated the danger of this mission. Had the guards been delayed in their appearance, you may have died,”</i> he says, his tone flat. He shakes his head. <i>“This is not a level of risk you should encounter. I apologize.”</i>", parse);
				Text.NL();
				Text.Add("That was not quite the reaction you had been expecting. You tell him that it’s you who made the mistakes by being underprepared for such mediocre opponents, and Lei smiles up at your determination to get stronger.", parse);
				Text.NL();
				Text.Add("<i>“Regardless, you did not back down when outnumbered and fulfilled your obligations. That was well done.”</i>", parse);
			}
			Text.NL();

			parse.c = party.Num() > 1 ? Text.Parse("collect [comp] before heading", parse) : "head";

			if (!ontime) {
				Text.Add("<i>“If only you had arrived punctually, this could be called a success and an excellent start. As is, it remains a disappointment,”</i> he sums up. He drums his fingers along the desk. <i>“If you do not remedy that failing in the future, I will have no more dealings with you.”</i>", parse);
				Text.NL();
				Text.Add("Well, he looks quite annoyed with you. Setting aside the threat about the future, you’ll probably need to do something to appease him before he’ll even give you another job. Perhaps proving your skill in sparring will do the trick?", parse);
				Text.NL();
				Text.Add("Lei turns away from you, apparently contemplating the room - looks like that’s all he has to say on this topic.", parse);
				Text.NL();
				Text.Add("Feeling a little uncomfortable, you exit the room and [c] back to the common room.", parse);
				Text.Flush();

				Gui.NextPrompt();
			} else {
				if (lei.SexOpen()) {
					Text.Add("<i>“Overall, there are things you could improve on, but you did well.”</i> His voice goes lower, almost purring. <i>“Very well, even. I think you deserve a little reward.”</i> His lips curl into a smile, and he looks at you as if examining a particularly delectable morsel.", parse);
					Text.Flush();

					// [Reward][Refuse]
					const options = new Array();
					options.push({ nameStr : "Reward",
						tooltip : "Rewards are nice. You’d like a reward.",
						func() {
							LeiSexScenes.Petting(false);
						}, enabled : true,
					});
					options.push({ nameStr : "Refuse",
						tooltip : "No reward for you.",
						func() {
							Text.Clear();
							Text.Add("You tell Lei that actually, you’d rather not right now.", parse);
							Text.NL();
							Text.Add("You jerk back in instinctive response, as for an instant, you see anger flash across his face, and his muscles tense in readiness, before his features return to a mask of serenity. <i>“You are being misleading. We had spoken and you had indicated interest,”</i> he says. <i>“Very well, go then. It is, in the end, your loss. Rewards that are forfeited must be earned again if you wish them.”</i>", parse);
							Text.NL();
							Text.Add("He motions at the door, and you step out, feeling an uncomfortable prickling sensation on your back as you walk past.", parse);
							Text.NL();
							parse.c = party.Num() > 1 ? Text.Parse("You collect [comp] and", parse) : "Your report complete, you";
							Text.Add("[c] head back to the common room.", parse);
							Text.Flush();

							Gui.NextPrompt();
						}, enabled : true,
					});
					Gui.SetButtonsFromList(options, false, null);
				} else {
					Text.Add("<i>“The contract has been a success and an excellent start for you on the whole,”</i> he sums up. <i>“Certainly, there are some things you could improve on, but it’s far better than most do on their first time out.”</i>", parse);
					Text.NL();
					Text.Add("He inclines his head in acknowledgement, before turning back to the room at large. Looks like that’s all he has to say on the matter.", parse);
					Text.NL();
					Text.Add("You say your goodbyes, and [c] back to the common room.", parse);
					Text.Flush();

					Gui.NextPrompt();
				}
			}
		}
	}

	/*
	export namespace Escort {
		export function Available() {
			if(lei.flags["Met"] >= LeiFlags.Met.OnTaskEscort) return false;
			return true;
		}
		export function Eligable() {
			return player.level >= 6;
		}
		export function OnTask() {
			return lei.flags["Met"] === LeiFlags.Met.OnTaskEscort;
		}
		export function OnTaskText() {
			var parse : any = {

			};

			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}
		export function Completed() {
			return lei.flags["Met"] >= LeiFlags.Met.CompletedTaskEscort;
		}

		export function Start() {
			var parse : any = {

			};

			if(LeiTaskScenes.Escort.Eligable()) {
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
			}
			else {
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
			}
			Text.Flush();
			Gui.NextPrompt();
		}
	}
	*/
}
