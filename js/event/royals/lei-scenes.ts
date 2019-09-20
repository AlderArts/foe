import * as _ from "lodash";

import { Color } from "../../body/color";
import { Encounter } from "../../combat";
import { Entity } from "../../entity";
import { GAME, TimeStep, WORLD, WorldTime } from "../../GAME";
import { GameState, SetGameState } from "../../gamestate";
import { Gui } from "../../gui";
import { IChoice } from "../../link";
import { RigardFlags } from "../../loc/rigard/rigard-flags";
import { SetGameOverButton } from "../../main-gameover";
import { Party } from "../../party";
import { Text } from "../../text";
import { Season, Time } from "../../time";
import { Player } from "../player";
import { LeiSpar } from "./lei";
import { LeiFlags } from "./lei-flags";
import { LeiSexScenes } from "./lei-sex";
import { LeiTaskScenes } from "./lei-tasks";
import { TwinsFlags } from "./twins-flags";

export namespace LeiScenes {

	export function InnApproach() {
		const party: Party = GAME().party;
		const lei = GAME().lei;
		const parse: any = {

		};

		if (lei.flags.Met === LeiFlags.Met.EscortFinished) {
			LeiTaskScenes.Escort.Debrief();
		} else {
			if (party.Two()) {
				parse.comp = ", motioning for " + party.Get(1).name + " to take a seat nearby";
			} else if (!party.Alone()) {
				parse.comp = ", motioning for your companions to take seats nearby";
 			} else {
				parse.comp = "";
 			}

			Text.Clear();
			Text.Add("You walk over to Lei’s table, and pull up a chair[comp]. He ", parse);
			if (lei.Relation() < LeiFlags.Rel.L2) {
				Text.Add("glances at you for a moment, and inclines his head fractionally before resuming his survey of the room.", parse);
			} else if (lei.Relation() < LeiFlags.Rel.L4) {
				Text.Add("looks over at you and nods, the hint of a smile on his lips.", parse);
 			} else {
				Text.Add("greets you with a smile, evidently pleased to see you.", parse);
 			}
			Text.Flush();

			LeiScenes.InnPrompt();
		}
	}

	export function InnPrompt() {
		const player: Player = GAME().player;
		const lei = GAME().lei;
		const rigard = GAME().rigard;
		const parse: any = {

		};

		const options: IChoice[] = [];
		// PRE KRAWITZ
		if (rigard.Krawitz.Q >= RigardFlags.KrawitzQ.Started && rigard.Krawitz.Q < RigardFlags.KrawitzQ.HeistDone) {
			options.push({ nameStr : "Krawitz",
				func() {
					Text.Clear();

					// rigard.Krawitz["Duel"] = 0; // 0 = no, 1 = superwin, 2 = win, 3 = loss
					const duel  = rigard.Krawitz.Duel;
					const hired = rigard.Krawitz.Work === 1;

					parse.progress = ((duel !== 0) || hired) ? ", telling him about your progress so far" : "";

					Text.Add("You ask Lei if he has any ideas for dealing with Krawitz[progress].", parse);
					Text.NL();
					if (duel > 0) {
						if (duel === 1) {
							Text.Add("Lei stares at you, his normally impassive face transfigured with surprise. <i>“Wow. I have to say that even I am impressed. Very artfully done, my friend.”</i>", parse);
							Text.NL();
							Text.Add("<i>“I expect Krawitz will remember that humiliation for a good long time - as will the rest of the city. Still, if you have set your mind to really getting him, there is much else you can do.”</i>", parse);
						} else if (duel === 2) {
							Text.Add("Lei raises his eyebrows. <i>“Well done! It takes a good bit of skill to beat a master at his own weapon, even if he is rather old. That will probably sting his pride for some time.”</i>", parse);
							Text.NL();
							Text.Add("<i>“Still, there is much else you can do.”</i>", parse);
						} else { // loss
							Text.Add("Lei shrugs. <i>“So, you challenged him to a duel and lost. It happens,”</i> he says, then glances to the side, <i>“I am given to understand, anyway. He had the advantage of practice and extreme familiarity with the weapon. If you wanted to beat him, you needed to have incredible raw skill.”</i>", parse);
							Text.NL();
							Text.Add("<i>“But no matter, there are other avenues for you to explore.”</i>", parse);
						}
						Text.NL();
					} else if (duel === 0) { // not fought
						Text.Add("<i>“Perhaps the first, and safest step you can take is to confront Krawitz in public. Find some pretext to challenge him to a duel, and beat him in front of everyone. Humiliate him if you can,”</i> Lei suggests, a predatory grin on his lips.", parse);
						Text.NL();
						Text.Add("<i>“Most nobles go out into the Plaza from time to time, so if you look around you should be able to find him. Be warned, however, that it is no easy task to beat a specialist with his own weapon. ", parse);
						if (player.Dex() < 40) {
							Text.Add("In fact, though you may attempt the deed, I feel you would fall short.”</i>", parse);
						} else {
							Text.Add("Though I suspect you may be able to pull off the feat.”</i>", parse);
						}
						Text.NL();
						Text.Add("<i>“There are more... personal avenues you can pursue as well once you are done with that.”</i>", parse);
						Text.NL();
					}
					Text.Add("Lei pauses, thinking for a moment. ", parse);
					if (hired) {
						Text.Add("<i>“You already have a route into estate, so now all you need to do is go. Have courage and be prepared to improvise once you’re inside.", parse);
					} else {
						Text.Add("<i>“You will need to find a way into his estate. It is, of course, always possible to simply climb in during the night, but it is often simpler to find a legitimate pretext for being there if you can.”</i>", parse);
						Text.NL();
						Text.Add("<i>“Once you are inside, my best advice is to have courage and be prepared to improvise.", parse);
					}
					Text.Add(" Often, it is most effective to use a man’s own tools and followers against him.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Obtain what information you can from Krawitz’s servants and guards, determine how to exploit and emphasize his weaknesses, and execute your plan. Of course, make sure your plan is as good as you can make it, as you probably won’t get another chance.”</i>", parse);
					Text.NL();
					Text.Add("You listen attentively, and nod at his explanation. It sounds reasonable, and he’s speaking as if he’s done this sort of thing plenty of times. Which, realistically, he may very well have.", parse);
					Text.NL();
					Text.Add("<i>“And that is all. Once you have done everything you wish to do, leave the estate, and report back to my young protégés. The more you accomplish, the happier they will probably be.”</i>", parse);
					Text.Flush();
				}, enabled : true,
				tooltip : "Ask for advice for dealing with Krawitz.",
			});
			options.push({ nameStr : "Talk",
				func() {
					Text.Clear();
					Text.Add("You try to strike up a conversation with Lei, but he only glances at you, looking bemused, in response. <i>“Let us put off idle words until <b>after</b> you are finished with your task.”</i>", parse);
					Text.Flush();
				}, enabled : true,
				tooltip : "You want to ask him some things.",
			});
		} else {
			options.push({ nameStr : "Talk",
				func() {
					Text.Clear();
					Text.Add("<i>“Ask away, though I make no promises of answering.”</i>", parse);
					Text.Flush();

					LeiScenes.TalkPrompt();
				}, enabled : true,
				tooltip : "You want to ask him some things.",
			});
			if (lei.flags.Talk & LeiFlags.Talk.Skills) {
				options.push({ nameStr : "Training",
					func() {
						Text.Clear();
						Text.Add("You ask Lei if he can help you get stronger.", parse);
						Text.NL();
						if (player.level < 7) {
							Text.Add("<i>“There are many things I can teach you,”</i> he replies, <i>“though I am not sure how much you can learn.”</i>", parse);
						} else if (player.level < 13) {
							Text.Add("<i>“There are many things I can teach you,”</i> he replies, <i>“and I believe you can benefit from my instruction.”</i>", parse);
 } else if (player.level < 19) {
							Text.Add("<i>“You have come far since first I saw you,”</i> he remarks, <i>“still, I believe there are a few things I can yet show you.”</i>", parse);
 } else {
							Text.Add("<i>“Truly, you have grown strong already,”</i> he says, <i>“but perhaps we can help each other.”</i>", parse);
 }
						Text.NL();
						Text.Add("<i>“What would you like to do today?”</i>", parse);
						Text.Flush();

						LeiScenes.SparPrompt();
					}, enabled : true,
					tooltip : "Ask him to help you improve your skills.",
				});
				options.push({ nameStr : "Jobs",
					func : LeiTaskScenes.TaskPrompt, enabled : true,
					tooltip : "Ask Lei if he has any jobs you could do.",
				});
			}
			if (lei.flags.Talk & LeiFlags.Talk.Sex) {
				options.push({ nameStr : "Sex",
					func() {
						Text.Clear();
						Text.Add("<i>“Do go on.”</i> Lei studies you with an unreadable expression.", parse);
						Text.Flush();

						LeiScenes.SexPrompt();
					}, enabled : true,
					tooltip : "Ask the mercenary about matters carnal.",
				});
			}
			/* TODO
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
		}
		Gui.SetButtonsFromList(options, true);
	}

	export function InnPromptFirst() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const lei = GAME().lei;
		const parse: any = {

		};

		if (party.Two()) {
			parse.comp = " and " + party.Get(1).name;
		} else if (!party.Alone()) {
			parse.comp = " and your companions";
 		} else {
			parse.comp = "";
 		}

		Text.Clear();
		let first = false;
		const playerLevel = player.level;

		if (lei.flags.Met < LeiFlags.Met.KnowName) {
			TimeStep({minute: 5});
			Text.Add("You approach the stranger. He definitely looks like the man you saw following the pair of hooded nobles earlier. His cloak is the same dusky shade, and he has the hood drawn up, casting his face into shadow, raising your suspicions. Up close, you notice that underneath he’s wearing some sort of black form-fitting armor, nicely emphasizing his well-muscled body. When you reach his table, he looks up at you, running his eyes over you methodically.", parse);
			Text.NL();
			Text.Add("Normally, if a man examined you so closely, eyes poring over every detail, you would think that he's checking you, but something in the stranger's eyes make this examination different... it feels like he's not examining you as a potential mate, so much as potential prey, assessing whether you're worth noticing.", parse);
			Text.NL();
			Text.Add("You cough, shifting uncomfortably under his gaze, and ask if he minds if you join him. After a moment, you realize you were supposed to ask him about the couple he was following, but the thought slipped your mind when met with his stare.", parse);
			Text.NL();
			// TODO: more complex strength assessment
			let strongestLevel = player.level;
			let strongestMember: Entity = player;
			for (let i = 1; i < party.members.length; i++) {
				if (party.members[i].level > strongestLevel) {
					strongestLevel = party.members[i].level;
					strongestMember = party.members[i];
				}
			}

			if (playerLevel < LeiFlags.PartyStrength.LEVEL_WEAK && strongestLevel >= LeiFlags.PartyStrength.LEVEL_STRONG) {
				parse.heshe = strongestMember.heshe();
				parse.name = strongestMember.name;
				Text.Add("The stranger seems to hesitate before finally deciding. <i>“Very well, you may sit. Not for your sake, but [heshe] appears interesting,”</i> he says, nodding toward [name].", parse);
			} else if (playerLevel < LeiFlags.PartyStrength.LEVEL_WEAK && strongestLevel < LeiFlags.PartyStrength.LEVEL_WEAK) {
				Text.Add("<i>“I have no interest in you,”</i> the man replies, his voice husky, yet flowing. <i>“You should go, I have no patience for the weak.”</i>", parse);
				Text.NL();
				Text.Add("You glare at the man. You? Weak? You do get a weird sense of danger just from talking to him, but there’s a reason you’re here. You’re not going to be deterred that easily.", parse);
			} else if (playerLevel < LeiFlags.PartyStrength.LEVEL_STRONG) {
				Text.Add("<i>“Very well, you appear to have some potential,”</i> the man replies, his voice husky, yet flowing. <i>“You may sit if you like.”</i>", parse);
 			} else {
				Text.Add("<i>“You <b>are</b> an interesting one,”</i> the man replies, almost purring. <i>“Please, sit.”</i>", parse);
 			}
			Text.NL();
			if (party.Alone()) {
				Text.Add("You pull up a chair and sit down across from the stranger.", parse);
			} else {
				Text.Add("There's barely enough space at the man's table for you to pull up a single chair across from him, so you tell your party to sit down at a table a few paces away while you talk with the stranger.", parse);
			}
			Text.NL();
			Text.Add("<i>“There is no need to sit so far from me,”</i> he tells you, indicating a spot beside him at the small table. Your eyebrows shoot up in surprise. <i>“You're blocking my view,”</i> he clarifies.", parse);
			Text.NL();
			if (playerLevel >= LeiFlags.PartyStrength.LEVEL_STRONG) {
				Text.Add("You scoot over, the stranger's eyes fixed on you the whole time. <i>“Well then, what can I do for you?”</i> he asks.", parse);
				Text.NL();
				Text.Add("Somehow you feel awkward just blurting out your accusation. You decide you should at least start off politely, and ", parse);
			} else {
				Text.Add("You scoot over to the side of the table, and he resumes watching the room, seemingly paying you no further mind. After half a minute of awkward silence, you decide you should make the first move even if you have to speak to the side of his head. Perhaps simply blurting out your accusation wouldn’t be a great idea...", parse);
				Text.NL();
				Text.Add("You ");
			}

			parse.adv = party.Alone() ? "an adventurer" : "adventurers";
			parse.s   = party.Alone() ? "" : "s";
			Text.Add("introduce yourself[comp], and tell him you are [adv] of a sort.", parse);
			Text.NL();
			Text.Add("<i>“Adventurer[s]...”</i> he muses, <i>“a description given if one has a goal too complicated to say in a few words or too sensitive to divulge. A goal which probably involves violence.”</i> A slight smile creases his lips.", parse);
			Text.NL();
			Text.Add("<i>“No matter. I am Lei.”</i> He pauses, apparently watching for whether the name is familiar to you. ", parse);
			if (lei.flags.HeardOf === 0) {
				Text.Add("<i>“A simple seeker of strength and fortune. Nothing more. Nothing less.”</i>", parse);
			}
			// TODO: ELSE (Rumors etc, party members?)
			Text.NL();
			Text.Add("Lei’s eloquence is apparently exhausted, so maybe it’s a good time to ask him the things you wanted.", parse);
			Text.Flush();

			lei.flags.Met = LeiFlags.Met.KnowName;
			first = true;
		} else { // lei.flags["Met"] === LeiFlags.Met.KnowName;
			Text.Add("Lei’s back to his old seat. Now might be a good time to figure out why he was following the couple from the royal district, or see if you can get a lead to actually finding them.", parse);
			Text.Flush();
		}

		const options: IChoice[] = [];
		options.push({ nameStr : "Confront",
			func() {
				Text.Clear();

				if (party.Two()) {
					parse.comp = party.Get(1).name + " a reassuring presence behind you, ";
				} else if (!party.Alone()) {
					parse.comp = "your companions a reassuring presence behind you, ";
 				} else {
					parse.comp = "";
 				}
				if (first) {
					Text.Add("You clear your throat, and are rewarded with a flicker of the eyes from Lei, before he resumes his vigil over the room. Steeling yourself, you tell him that you saw him stalking a couple wearing gray cloaks after they left the castle grounds, and that you want an explanation.", parse);
					Text.NL();
					Text.Add("<i>“No.”</i> You look at him incredulously.", parse);
					Text.NL();
					Text.Add("You demand if that’s all he’s going to say for himself.", parse);
					Text.NL();
					Text.Add("<i>“It is,”</i> he tells you. <i>“Now, unless you intend to force me, you should perhaps be on your way.”</i>", parse);
				} else {
					Text.Add("You approach Lei, [comp]but even when you're a few tables away he seems to take no notice of you. When you stand directly before him, he finally looks up.", parse);
					Text.NL();
					if (playerLevel < LeiFlags.PartyStrength.LEVEL_STRONG) {
						Text.Add("<i>“You're blocking my view again.”</i>", parse);
						Text.NL();
						Text.Add("Your emotions rise a little at his dismissive tone, but you keep yourself under control. Refusing to move, you ", parse);
					} else {
						Text.Add("<i>“I appreciate you coming to see me again,”</i> he says, smiling slightly, <i>“but please stop blocking my view.”</i>", parse);
						Text.NL();
						Text.Add("You're a little annoyed with him for mentioning trivialities when you have a serious concern, and refuse to move. You ", parse);
					}
					Text.Add("tell him that you saw him stalking the man and woman as they exited the inn, and that you want an explanation.", parse);
					Text.NL();
					Text.Add("<i>“No.”</i> You look at him incredulously. You demand if that's all he's going to say for himself. <i>“It is,”</i> he tells you. <i>“Now, unless you intend to force me, please stop blocking my view.”</i>", parse);
				}

				Text.Add(" He raises one eyebrow quizzically.", parse);
				lei.relation.DecreaseStat(-15, 1);
				Text.Flush();

				// [Fight][Bribe][Observe]
				const FightPrompt = () => {
					const options: IChoice[] = [];
					options.push({ nameStr : "Fight",
						func() {
							Text.Clear();
							Text.Add("You tell him that you <i>will</i> use force if that's what it's going to take.", parse);
							Text.NL();
							if (player.level < LeiFlags.PartyStrength.LEVEL_WEAK) {
								Text.Add("<i>“Very well, let's get this over with.”</i> Lei looks bored, like your challenge has just made him sleepier. <i>“I warn you, <b>you will lose</b>.”</i> The last words ring oddly as he speaks them, making the air tremble as if they had the force of an avalanche, instead of being spoken softly as they had been to your ears.", parse);
								Text.Flush();

								// [Fight][Observe]
								const options: IChoice[] = [];
								options.push({ nameStr : "Fight",
									func() {
										Text.NL();
										Text.Add("You decide it doesn't matter how menacing he makes himself sound. You'll take him on and make him tell you what you want to know.", parse);
										Text.NL();

										LeiScenes.BarFight();
									}, enabled : true,
									tooltip : "His confidence only serves to anger you further, and you resolve to fight.",
								});
								options.push({ nameStr : "Observe",
									func() {
										Text.Clear();
										Text.Add("You decide that perhaps discretion is the better part of valor after all. Your cheeks flushing with shame, you tell him that you will bow to his judgement in this, and decline to fight him after all.", parse);
										Text.NL();
										Text.Add("He pauses for a moment, before deciding. <i>“That is wise. The weak live longest when they are cowardly.”</i>", parse);
										Text.NL();
										Text.Add("You stalk off from him, trying to contain your embarrassment and your fury, and decide that you'll watch him for now and ferret out whatever his secret might be that way.", parse);
										Text.NL();

										LeiScenes.ObserveMain(false);
									}, enabled : true,
									tooltip : "You decide that watching him might be better than trying to fight.",
								});
								Gui.SetButtonsFromList(options);
							} else if (player.level < LeiFlags.PartyStrength.LEVEL_STRONG) {
								Text.Add("<i>“It is perhaps not a wise choice that you make, but I could use some light exercise while I wait.”</i> You grit your teeth at his flippant words and resolve that you'll make him tell you everything that you want to know.", parse);
								Text.NL();
								LeiScenes.BarFight();
							} else {
								Text.Add("Lei's eyes seem to light up as you challenge him, and you see a smile spread over his shadowed face. <i>“Yes, this should be interesting.”</i> He seems downright excited. You're not sure he even cares what the fight is about.", parse);
								Text.NL();
								LeiScenes.BarFight();
							}
						}, enabled : true,
						tooltip : "Challenge Lei to a fight to get an explanation.",
					});
					options.push({ nameStr : "Bribe",
						func() {
							Text.Clear();
							Text.Add("You recall that one of the things Lei said he valued was money, so you swallow your pride and offer to pay him for an explanation.", parse);
							Text.NL();
							Text.Add("<i>“How unexpected,”</i> he remarks. <i>“Very well, I will accept four hundred coins in exchange for an explanation that will resolve your concerns regarding the couple one way or the other.”</i>", parse);
							Text.Flush();

							// [Pay][Nevermind][Observe]
							const options: IChoice[] = [];
							options.push({ nameStr : "Pay",
								func() {
									Text.NL();
									Text.Add("Grudgingly, you accept his price, and hand over the coins. He accepts them without counting, and nods at you slightly.", parse);
									party.coin -= 400;
									lei.relation.IncreaseStat(100, 2);
									Text.Flush();
									Gui.NextPrompt(LeiScenes.ExplanationMain);
								}, enabled : party.coin >= 400,
								tooltip : "Pay 400 coins for the explanation.",
							});
							options.push({ nameStr : "Nevermind",
								func() {
									Text.NL();
									Text.Add("You decide that you aren't willing to pay quite that much for a simple explanation, and reconsider your options.", parse);
									Text.Flush();
									FightPrompt();
								}, enabled : true,
								tooltip : "That's more than you're willing to pay.",
							});
							options.push({ nameStr : "Nah",
								func() {
									Text.Clear();
									Text.Add("He's asking an outrageous amount! You decide that you'll find out for yourself, and resolve to watch him for now.", parse);
									Text.NL();
									LeiScenes.ObserveMain(false);
								}, enabled : true,
								tooltip : "Decline to pay. You’ll instead wait and see what Lei does for now.",
							});
							Gui.SetButtonsFromList(options);
						}, enabled : true,
						tooltip : "Offer to pay Lei for an explanation.",
					});
					options.push({ nameStr : "Observe",
						func() {
							Text.Clear();
							Text.Add("You decide it’s going to be too troublesome to get an answer out of him directly, and stalk away, pretending frustration. Mostly pretending, anyway.", parse);
							Text.NL();
							LeiScenes.ObserveMain(false);
						}, enabled : true,
						tooltip : "Wait and see what Lei does for now. If he’s following the couple, maybe they’ll show up here too.",
					});
					Gui.SetButtonsFromList(options);
				};
				FightPrompt();
			}, enabled : true,
			tooltip : "Confront Lei about following the couple.",
		});
		options.push({ nameStr : "Observe",
			func() {
				Text.Clear();
				LeiScenes.ObserveMain(first);
			}, enabled : true,
			tooltip : "Just wait and see what Lei does for now. If he’s following the couple, maybe they’ll show up here too.",
		});
		options.push({ nameStr : "Leave",
			func() {
				Text.Clear();
				Text.Add("On second thought, you decide, it's probably not worth bothering with him just now. The issue of him and the couple can wait until later.", parse);
				Text.Flush();

				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You don’t feel quite ready to deal with his stalking yet. Perhaps you’ll come back to it another time.",
		});
		Gui.SetButtonsFromList(options);
	}

	export function ExplanationMain() {
		const player: Player = GAME().player;
		const lei = GAME().lei;
		const parse: any = {

		};

		Text.Clear();

		Text.Add("<i>“Ask what you will,”</i> Lei tells you.", parse);
		Text.NL();
		Text.Add("Deciding to get right to the point, you ask him why he was following the couple when they left the inner district.", parse);
		Text.NL();
		Text.Add("<i>“I am their bodyguard,”</i> he answers simply. <i>“And, I suppose, their... chaperone.”</i>", parse);
		Text.NL();
		Text.Add("You nod at his explanation. It does sort of make sense, and ", parse);
		if (lei.flags.HeardOf === 0) {
			Text.Add("he doesn't look like he's lying - ", parse);
			if (player.Int() > 30) {
				Text.Add(" you're pretty confident that you could tell if he was.", parse);
			} else {
				Text.Add(" although you suspect he could bluff you if he wanted.", parse);
			}
		} else {
			Text.Add("you have heard that Lei always speaks only the truth.", parse);
		}
		Text.NL();
		Text.Add("You ask why he was following so far away from them then.", parse);
		Text.NL();
		Text.Add("<i>“That much distance is not a problem for me,”</i> he says", parse);
		if (lei.flags.Fought !== LeiFlags.Fight.No) {
			Text.Add(", and having fought him, you have no trouble believing that.", parse);
		} else {
			Text.Add(".", parse);
		}
		Text.Add(" <i>“They wished for discretion, and apparently they think I stand out.”</i> He gestured over his sculpted, vaguely menacing figure, and the large sword he always has with him, as if he can’t understand why anyone would believe that.", parse);
		Text.NL();
		Text.Add("You ask him who they are, anyway.", parse);
		Text.NL();
		parse.paid = (lei.flags.Fought === LeiFlags.Fight.No) ? "paid enough" : "fought a hard enough bout";
		Text.Add("<i>“You have not [paid] for that answer. If you wish to know, you might try asking them when they come down.”</i> Saying that, Lei turns away from you, his explanation apparently concluded, and resumes his watch over the tavern.", parse);
		Text.NL();
		Text.Add("You decide you’re not going to get any more out of him, and leave him to his duty, wondering at his vigilance in this high class area of the city. You’re both relieved and a little disappointed that the couple was safe all along. It seems like you won’t have the chance to do them an easy favor, but perhaps they could still assist you.", parse);
		Text.NL();
		Text.Add("You also can’t help but wonder who they are to merit such a guardian.", parse);
		Text.Flush();

		// [Wait][Nah]
		const options: IChoice[] = [];
		options.push({ nameStr : "Wait",
			func() {
				Text.Clear();
				Text.Add("You decide you might as well get it over with, and settle in to wait for the couple to come. You sit beside Lei, careful not to block his view, and the two of you drink in almost companionable silence while you wait.", parse);
				Text.NL();
				Text.Add("Sitting at the table by the wall, your only warning is the sound of two people’s steps before a red-headed couple emerge from the stairway. The way they walk, backs held straight, close enough that they are almost touching, seems familiar. Lei’s instant shift in attention toward them is enough to confirm your guess that this is the pair you were looking for.", parse);
				Text.NL();
				Text.Add("To your surprise, you find that the young man and woman are wearing modest clothes - gray woolens better suited to poor commoners rather than the rich dress you expected to see. Perhaps they really are trying to be discrete, as Lei had said. If so, it’s not working very well, as the dull clothes provide a cute contrast to their blazing red hair, making them stand out all the more.", parse);
				Text.NL();
				Text.Add("As they pass the table, Lei rises, and you follow suit and accompany him to the door.", parse);
				Text.NL();
				Text.Add("Once you are outside, Lei whistles piercingly, and you look at him in puzzlement. <i>“If you want to meet them, let us get it over with, instead of having you trail after us like a stray puppy.”</i>", parse);
				Text.NL();
				parse.paid = (lei.flags.Fought === LeiFlags.Fight.No) ? "bribed" : "fought";
				Text.Add("Ahead of you, the couple turns down a narrow alleyway and you follow after them along with Lei. They look at him in question and he explains that you wanted to meet them, and how you had [paid] him for an explanation. To your surprise, he even provides a short summary of what you told him about yourself, and why you wanted to see them.", parse);
				Text.NL();

				// TODO: Twins relationship ++

				Text.Add("<i>“Oh, I see, I see!”</i> the man exclaims, his voice light and melodious. <i>“So now you're really curious who would have someone like Lei for a guard.”</i> He pauses for a few moments, thinking, tapping his finger against his lips cutely. Now probably wouldn’t be the best time to say that you actually just wanted to see if they could get you into the castle grounds. <i>“Well, I can't very well just tell you when Lei got <b>his</b> price from you.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Tell you what, prove that you're worthy of trust, and we'll tell you who we are. And maybe we'll have a few small jobs for you afterward, and, of course, we are always happy to recompense someone who helps us... whether with money, or-”</i> he gives his companion's rump a playful squeeze, and she lets out a squeal, <i>“-favors.”</i>", parse);
				Text.NL();
				Text.Add("You have to admit that that sounds intriguing, and ask if one of the favors could include getting into the Castle Grounds past the Royal Guard.", parse);
				Text.NL();
				Text.Add("The young man grins. <i>“Of course, that is certainly a possibility. We can do many things for our friends.”</i>", parse);
				Text.NL();
				Text.Add("Well, it’s not quite a promise, but it seems like a good lead. Besides, your curiosity is still unsatisfied, so you ask him what it is that he would have you do.", parse);
				Text.Flush();
				Gui.NextPrompt(LeiScenes.RequestMain);
			}, enabled : true,
			tooltip : "Wait for the well-dressed couple you saw earlier and try to meet them.",
		});
		/*
		options.push({ nameStr : "Leave",
			func : () => {
				Text.Clear();
				Text.Add("You decide that with at least the small mystery of what Lei was doing resolved, you can return to your other affairs for now. Trying to get into the castle can wait a bit.", parse);
				Text.Flush();

				Gui.NextPrompt();
			}, enabled : false, //TODO TEMP
			tooltip : "The couple is safe, and you have other things to do. Maybe you'll meet them another time."
		});
		*/
		Gui.SetButtonsFromList(options);
	}

	export function ObserveMain(first: boolean) {
		const party: Party = GAME().party;
		const parse: any = {
			drink : party.Alone() ? "a drink" : "some drinks",
		};

		if (party.Two()) {
			parse.comp  = " with " + party.Get(1).name;
			parse.comp2 = ", while chatting idly with " + party.Get(1).name;
		} else if (!party.Alone()) {
			parse.comp  = " with your companions";
			parse.comp2 = ", while chatting idly with your companions";
		} else {
			parse.comp  = "";
			parse.comp2 = "";
		}

		if (first) {
			Text.Add("Somehow, after talking to the man, you don’t feel like asking him after all. He probably wouldn’t answer anyway - it’ll be easier to find out for yourself.", parse);
			Text.NL();
			Text.Add("You murmur a goodbye and leave Lei’s table, making your way toward the middle of the common room. You pick out a seat at an empty table and settle in[comp]. It might be a little obvious you’re keeping track of him, but you figure there’s not much he can do about it.", parse);
			Text.NL();
			Text.Add("You", parse);
		} else {
			Text.Add("Taking a seat, you settle in to wait for Lei to make a move, and", parse);
		}

		Text.Add(" order [drink]. Some time passes, while you keep watch of his general vicinity to make sure he hasn't moved[comp2]. You aren't quite sure if he's noticed you observing him or not, as his eyes keep drifting generally over the crowd in an unchanged pattern.", parse);
		Text.NL();

		// TODO #-drinks cost

		Text.Add("Eventually, as you're beginning to wonder if this is really worth your time, your eyes snap up to the staircase and you see a red-haired couple descending. The way they walk, backs held straight, close enough that they are almost touching, seems familiar, and Lei’s instant shift in attention toward them is enough to confirm your suspicion that this is the pair you were looking for.", parse);
		Text.NL();
		Text.Add("To your surprise, you find that the young man and woman are wearing modest clothes - gray woolens better suited to poor commoners rather than the rich garments you expected to see. Despite that, their proud bearing and the unusual blazing red of their hair somehow makes you feel like they’re more than their dress suggests.", parse);
		Text.NL();

		if (party.Two()) {
			parse.comp = "and your companion ";
		} else if (!party.Alone()) {
			parse.comp = "and your companions ";
 } else {
			parse.comp = "";
 }
		// {and your companions }

		Text.Add("As they pass by Lei, he again follows. By the time you remember you were supposed to talk to them and perhaps warn them about their stalker, they are most of the way to the door, and you hurry to catch up, pushing through the crowded common room.", parse);
		Text.NL();
		Text.Add("You make it through the door a little after Lei, and, spotting him walking down the street toward the lower sections of the city, hurry after him. You consider rushing past him toward the pair, but feel a tinge of worry at the idea. He would probably try to stop you, and you’re not sure you want to cross him without a good reason. Better to watch for now.", parse);
		Text.NL();
		Text.Add("You keep going in this odd little procession. Out front, the red-haired couple leads, Lei follows thirty paces behind them, and finally you [comp]trail another thirty paces behind him. Fortunately, there are still quite a few people out and about, so the fact that you’re following shouldn’t be too blatant.", parse);
		Text.NL();
		Text.Add("You begin to wonder just where the couple is going, as you pass through the market, walking past the closed stalls, and down into the residential area. The houses here are noticeably shabbier, and smells whose origins you have no desire to know assail your nostrils. Ahead of you, you see the couple turning down a narrow street, barely more than an alley, and Lei follows them soon after. You rush after him, fearing to once again lose them in the warren of buildings.", parse);
		Text.NL();
		Text.Add("As you round the corner, you find yourself face to face with the red-haired pair, who examine you quizzically, Lei leaning against the building wall a few steps behind them.", parse);
		Text.NL();
		Text.Add("<i>“You went to so much trouble to follow us,”</i> the man addresses you, his voice light and melodious, almost stirring desire within you despite the innocuous words, <i>“so what is it that you'd like?”</i> You see his left hand rubbing slowly over his companion's rear, and he grins at you mischievously.", parse);
		Text.NL();
		Text.Add("You glance away awkwardly, and explain that you saw Lei following them and wanted to make sure they were safe. With Lei leaning calmly against the wall, the explanation sounds a little lame, even to your ears.", parse);
		Text.NL();
		Text.Add("<i>“So noble of you! But, well, as you can see, Lei is actually quite tame.”</i> He grins at you, though you have trouble imagining the menacing shadow of Lei behind him being ‘tame'.", parse);
		Text.NL();
		Text.Add("You mutter some excuse for bothering them, wondering if you can really ask about getting into the castle grounds like this, but he interrupts you. <i>“Don’t worry, that’s quite alright, nobility, after all, is a virtue.”</i> He pauses for a moment, biting his lower lip, which looks oddly attractive with his somewhat feminine features, before deciding.", parse);
		Text.NL();
		Text.Add("<i>“In fact, we could use someone trustworthy to help us out, my lover and I.”</i> At the word ‘lover' he gives a firm squeeze to his companions buttocks, and she lets out a cute squeal. <i>“Tell you what, do us a small favor to prove that you are reliable as well as noble, and we will have some real work for you. And, of course, whenever you help us out, we'll be happy to compensate with money, or if you like, favors.”</i> His lewd smile on the word ‘favors' leaves you with little doubt just what kind he has in mind.", parse);
		Text.NL();
		Text.Add("Despite his poor clothes and lecherous behavior, the man still has the bearing of a king - an incongruous contrast. You hesitantly ask him if one of the favors might include a pass into the castle grounds.", parse);
		Text.NL();
		Text.Add("The young man grins, looking unsurprised. Lei probably told him about your conversation earlier. <i>“Of course, that is certainly a possibility. We can do many things for our friends.”</i>", parse);
		Text.NL();
		Text.Add("Well, it’s not quite a promise, but it seems like a good lead. Besides, you can’t help but feel curious as to who these two are. You ask what he wants you to do for this trial errand.", parse);
		Text.Flush();

		Gui.NextPrompt(LeiScenes.RequestMain);
	}

	export function RequestMain() {
		const party: Party = GAME().party;
		const rigard = GAME().rigard;
		const twins = GAME().twins;

		const parse: any = {

		};

		Text.Clear();
		Text.Add("<i>“Well, we have this fencing tutor, you see. Lord Krawitz is his name, and he's always been a pompous old goat, but lately he's become simply intolerable. Just the other day my... ah, lover,”</i> he says, correcting himself at the last moment, <i>“asked him what the proper response to a Metrind parry was, and he launched into a half hour rant about how the proper response to everything was focus. That fencing is an art of the mind, not simple patterns of the body.”</i> He waves his hands in disgust and dismissal.", parse);
		Text.NL();
		Text.Add("<i>“Unfortunately, we can't tell the stuck-up jackass what we think of him to his face, so, I'd like you to get us a little payback for all the annoyance he's caused us over the years. Nothing drastic mind you, but I want him to suffer.”</i> The man's grin looks a little scary as he says this. <i>“To be humiliated publicly, shamed, have his reputation destroyed, that sort of thing.”</i> At his side, his companion seems to smile shyly and give a slight nod at the idea.", parse);
		Text.NL();
		Text.Add("You say that you'll think about it, although it might take you some time to figure out what to do.", parse);
		Text.NL();
		Text.Add("He inclines his head slightly, accepting that, and asks if there's anything you'd like to know about Lord Krawitz.", parse);
		Text.Flush();

		let talkedPersonality = false;
		let talkedStatus = false;
		const TalkPrompt = () => {

			// [Personality][Status][Nothing else]
			const options: IChoice[] = [];
			if (!talkedPersonality) {
				options.push({ nameStr : "Personality",
					func() {
						Text.Clear();
						Text.Add("You ask just what makes Krawitz so annoying.", parse);
						Text.NL();
						Text.Add("The red-haired man lets out a moan of disgust. <i>“Just about everything. Let's see, he thinks he's important because...”</i> he hesitates, <i>“of various reasons. But he's really not, so he just comes off as supremely arrogant. He's long-winded, boring, and a hardcore human purist to boot.”</i>", parse);
						Text.NL();
						Text.Add("You ask what he means by human purist.", parse);
						Text.NL();
						Text.Add("<i>“He hates morphs. Thinks they shouldn't be allowed within five yards of standard humans, and sometimes goes on rants on how they should be thrown out of the city outright. Oh, don't think that stops him from having a full staff of morph servants, though. He's too much of a cheapskate to actually pay for pure humans, no matter what he claims his beliefs are.”</i>", parse);
						Text.NL();
						Text.Add("You nod at the explanation and wonder if that could be used to your advantage somehow.", parse);
						Text.Flush();

						talkedPersonality = true;
						TalkPrompt();
					}, enabled : true,
					tooltip : "Ask what kind of person Lord Krawitz is.",
				});
			}
			if (!talkedStatus) {
				options.push({ nameStr : "Status",
					func() {
						Text.Clear();
						Text.Add("You can't help but notice the ‘Lord' part of Krawitz's monicker, and ask if it's really okay for you to offend someone like that.", parse);
						Text.NL();
						Text.Add("<i>“Don't worry about it,”</i> the man tells you. <i>“He might be a lord, but his only major property is a house in the plaza district. He has no real power to speak of, although I think he deludes himself into thinking he does. Most of the other nobles laugh at him behind his back. If anything, you'll probably end up winning friends in the upper classes.”</i>", parse);
						Text.NL();
						Text.Add("You wonder who the pair is that they are so well acquainted with the ways of the upper classes, but decide to focus on your task for now.", parse);
						Text.Flush();

						talkedStatus = true;
						TalkPrompt();
					}, enabled : true,
					tooltip : "Ask about Lord Krawitz's social status and power.",
				});
			}
			options.push({ nameStr : "Nothing else",
				func() {
					Text.Clear();
					Text.Add("You decide that you've learned the basics of the situation, so it's time to get going. The man tells you the location of Krawitz's house, and says that you should come find Lei in the Lady's Blessing tavern when you're done, and you part ways.", parse);
					Text.NL();
					Text.Add("As you're about to head off, Lei approaches you, letting the couple gain a little distance from him.", parse);
					Text.NL();
					Text.Add("<i>“If you would like some advice on this, visit me at the Lady's Blessing later,”</i> he tells you, before turning around and following after his charges.", parse);
					Text.NL();
					Text.Add("You briefly wonder if he actually likes you before going on your way.", parse);
					Text.Flush();

					twins.flags.Met = TwinsFlags.Met.Met;
					// Start KrawitzQ
					rigard.Krawitz.Q = RigardFlags.KrawitzQ.Started;
					party.location = WORLD().loc.Rigard.Plaza;

					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "You know enough for now.",
			});
			Gui.SetButtonsFromList(options);
		};
		TalkPrompt();
	}

	/* TODO Unused?
	export function InnFirstPrompt() {
		var parse : any = {

		};

		TimeStep({minute: 5});

		if(party.Two())
			parse["comp"] = " and " + party.Get(1).name;
		else if(!party.Alone())
			parse["comp"] = " and your companions";
		else
			parse["comp"] = "";

		var options = new Array();
		if(LeiScenes.InnFirstTalkedCastle === 0) {
			options.push({ nameStr : "Castle",
				func : () => {
					Text.Clear();
					Text.Add("You tell Lei that you have business in the castle, and wonder if he knows how one would get inside.", parse);
					Text.NL();
					Text.Add("<i>“One must be invited to gain entrance.”</i> He glances at you, clearly doubtful that you would receive such an invitation. <i>“And not by me. You might try to come to the attention of some royal personage, or of a major noble. Or, I suppose, you could try to gain favor with the guards themselves, so that they permit you entry on trust and respect. There might be some other, more hidden, paths as well, but I am unfamiliar with them.”</i>", parse);
					Text.NL();
					Text.Add("Although that wasn't very useful, you still thank him for the information.", parse);
					Text.NL();
					Text.Flush();
					LeiScenes.InnFirstTalkedCastle = 1;
					LeiScenes.InnFirstPrompt();
				}, enabled : true,
				tooltip : "Ask him if he knows how to get into the castle."
			});
		}
		if(LeiScenes.InnFirstTalkedJoin === 0) {
			options.push({ nameStr : "Join",
				func : () => {
					Text.Clear();
					Text.Add("He seems quite strong, and although you don't know much about him, it wouldn't hurt to test the waters. You ask him if he'll accompany you on your travels.", parse);

					if(player.level >= LeiFlags.PartyStrength.LEVEL_STRONG)
						Text.Add("He looks at you with apparent interest. <i>“Perhaps... There is a chance that I may be interested in traveling with you. Unfortunately, just now I am preoccupied with other duties,”</i> he tells you, sounding genuinely regretful. <i>“Come and ask me again some time, and we will discuss it if you like.”</i>", parse);
					else
						Text.Add("<i>“As I said,”</i> he tells you, sounding bored, <i>“I am interested in but two things. Fortune and strength. I am not sure which it is that you think you can offer me.”</i> He pauses, looking you over again. <i>“Well, I do see some spark of potential within you,”</i> he continues, his tone softening. <i>“Perhaps we can speak of this again some other time. For now, I am preoccupied with other duties.”</i>", parse);
					Text.NL();
					Text.Add("You have no choice but to accept his refusal for now, and resolve to ask him again when you next meet him.", parse);
					Text.NL();
					Text.Flush();
					LeiScenes.InnFirstTalkedJoin = 1;
					LeiScenes.InnFirstPrompt();
				}, enabled : true,
				tooltip : "Ask him if he's willing to help out on your travels."
			});
		}
		options.push({ nameStr : "Leave",
			func : () => {
				Text.Clear();
				Text.Add("You decide you have better things to do than drag words out of him if he has no desire to speak.", parse);
				Text.NL();
				LeiScenes.InnFirstLeaving();
			}, enabled : true,
			tooltip : "Nevermind, the man seems more trouble than he's worth."
		});
		if(options.length > 1) {
			Gui.SetButtonsFromList(options);
		}
		else {
			Text.Add("You run out of questions and decide to leave him to whatever it is he's doing for now. Maybe he'll be more talkative next time.", parse);
			Text.Flush();
			Gui.NextPrompt(() => {
				Text.Clear();
				LeiScenes.InnFirstLeaving();
			});
		}
	}
	*/

	export function Interact() {
		const rigard = GAME().rigard;
		if (rigard.Krawitz.Q < RigardFlags.KrawitzQ.Started) {
			LeiScenes.InnPromptFirst();
		} else {
			LeiScenes.InnApproach();
		}
	}

	export function Desc() {
		const lei = GAME().lei;
		if (lei.IsAtLocation(WORLD().loc.Rigard.Inn.Common)) {
			if (lei.flags.Met < LeiFlags.Met.SeenGates) {
				Text.Add("You notice a man sitting in the corner of the room on his own, a hood covering his face. There are a few others alone, a few others concealing their faces, but what draws your eye the most is his stillness. Whereas all others in the tavern are in motion, he sits completely still, his only movements the occasional tilt of his head, as he seems to scan the room, and the movement of his hand as he nurses some drink in a dark glass. Everything about him works to pique your curiosity, but you can’t quite come up with a reason to approach him.");
				lei.flags.Met = LeiFlags.Met.SeenInn;
			} else if (lei.flags.Met === LeiFlags.Met.SeenGates) {
				Text.Add("You notice a man sitting in the corner of the room on his own, a hood hiding his face. His clothes are the same dark shade as that of the man you saw following the couple earlier, and something about his still watchfulness makes you suspicious. Perhaps you should approach him and investigate.");
 			} else if (lei.flags.Met === LeiFlags.Met.KnowName) {
				Text.Add("You see Lei back at his table in the corner of the room. He seems to be scanning the room much as he was last time. Perhaps it’s time to make a concerted effort to find out what his connection is with that couple.");
 			} else {
				Text.Add("You see Lei sitting in the corner of the room, nursing his habitual drink. He seems vigilant, as always, scanning the room slowly between sips.");
 			}
			Text.NL();
		} else if (lei.flags.Met >= LeiFlags.Met.KnowName) {
			Text.Add("Lei is not in his usual spot.");
			Text.NL();
		}
		Text.Flush();
	}

	export function BarFight() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const lei = GAME().lei;
		const parse: any = {
			time     : WorldTime().DayTime(),
			feetDesc() { return player.FeetDesc(); },
			p1name() { return party.Get(1).name; },
		};
		parse.temperature = WorldTime().season === Season.Summer ? "warm" :
							WorldTime().season === Season.Winter ? "cold" :
							"cool";

		Text.Add("You follow him outside the tavern and step out into the [temperature] [time]. He walks on a little up the street away from the tavern's entrance and he turns around to face you.", parse);
		Text.NL();
		Text.Add("<i>“Since it is a small thing you ask, it will be but a small fight. My sword will remain sheathed, and you need only prove your mettle to persuade me, not defeat me outright.”</i>", parse);
		Text.NL();
		Text.Add("You nod at his concession, though a part of you wishes you could fight the arrogant man fully, and prepare yourself.", parse);
		Text.NL();
		if (party.Alone()) {
			Text.Add("<i>“Now, come at me!”</i>", parse);
		} else {
			Text.Add("<i>“Now, all of you come at me together!”</i>", parse);
		}
		Text.Flush();

		const enemy = new Party();
		enemy.AddMember(lei);
		const enc = new Encounter(enemy);

		lei.RestFull();

		enc.canRun = false;
		enc.onLoss = () => {
			lei.RestFull();
			party.RestFull();
			SetGameState(GameState.Event, Gui);

			let downed = true;
			for (const e of party.members) {
				if (e.Incapacitated() === false) { downed = false; }
			}

			Text.Clear();
			if (downed) {
				Text.Add("<i>“You challenge me and then you give up? Pathetic.”</i> Throwing the word at you like a verdict, Lei stalks off, returning to the tavern.", parse);
				Text.Flush();
				lei.flags.Fought = LeiFlags.Fight.Submission;
				lei.relation.DecreaseStat(-100, 5);
				Gui.NextPrompt();
			} else {
				lei.flags.Fought = LeiFlags.Fight.Loss;
				parse.anyof = party.Alone() ? "" : "any of ";
				parse.s     = party.Alone() ? "" : "s";
				parse.comp  = party.Two()    ? " and " + party.Get(1).name :
								!party.Alone() ? " and your companions" :
								"";
				Text.Add("Lei steps back from you and raises his hand. <i>“That is enough - I have no wish to kill [anyof]you. You have lost.”</i>", parse);
				Text.NL();
				Text.Add("As you[comp] are catching your breath[s], he turns to leave without saying anything further. You feel a bitter taste in your mouth, and it is not the blood from the blows he dealt you. Starting after him, you resolve that you <i>will</i> find out what the man is up to.", parse);
				Text.Flush();

				const observe = { nameStr : "Observe",
					func() {
						Text.Clear();
						Text.Add("You swallow your pride and have to admit that there's no way you're beating him head-on. Still, returning to the tavern, you decide that if you just wait and see, there's nothing he can do to stop you from doing that.", parse);
						Text.NL();
						Text.Flush();
						LeiScenes.ObserveMain(false);
					}, enabled : true,
					tooltip : "Go back to the tavern and watch him to see what he does.",
				};

				// [Attack][Observe] strike 1
				const options: IChoice[] = [];
				options.push({ nameStr : "Attack",
					func() {
						Text.Clear();
						Text.Add("You charge after Lei, aiming to land a telling blow while his back is turned. Somehow, as you're a step behind him, and start your lunge, he simultaneously slips to the side, without turning, making it look like you were aiming at air. You stumble and get to your feet, glaring at him.", parse);
						Text.NL();
						Text.Add("<i>“I say to you once,”</i> Lei says, sounding oddly formal, <i>“the fight is over. Desist.”</i>", parse);
						Text.NL();
						Text.Add("You glare at him, anger boiling up at the man.", parse);
						Text.Flush();

						lei.relation.DecreaseStat(-100, 2);

						// [Attack][Observe] strike 2
						const options: IChoice[] = [];
						options.push({ nameStr : "Attack",
							func() {
								Text.Clear();
								Text.Add("A snarl of rage escapes you and you charge at him, swinging wildly at his head, but, again, he side-steps, as if you have the speed of a child.", parse);
								Text.NL();
								Text.Add("Rain begins to drizzle from the skies.", parse);
								Text.NL();
								Text.Add("<i>“I say to you twice,”</i> he intones, <i>“the fight is over. <b>If your persist, you will die.</b>”</i> His words ring oddly hollow in the air, sending cold running through your veins.", parse);
								Text.Flush();

								lei.relation.DecreaseStat(-100, 2);

								// [Attack][Observe] strike 3
								const options: IChoice[] = [];
								options.push({ nameStr : "Attack",
									func() {
										Text.Clear();
										Text.Add("With a roar of outrage, you charge at Lei once more, your [feetDesc] finding even better purchase than before on the slightly damp cobblestones. Beyond the ability to form any coherent plans, you simply launch yourself at the man from three steps away, intending to simply hurl him down to the ground, and pound his head into the stones.", parse);
										Text.NL();
										Text.Add("<i>“So be it,”</i> his soft words seem to drift to you mid-jump, making your eyes go wide, your blood turning to ice, and your stomach lurching inside you. For a split moment, clarity seems to return to your thinking, and you wonder what it is you're doing, but you already see Lei drifting aside. He looks slow, languid even, his movements the gradual flow of a gentle stream as both his hands drift toward the hilt of his sword, and your momentum carries you slowly forward through the air.", parse);
										Text.NL();
										Text.Add("Lei's left hand reaches the pommel of his large bastard sword, and reverses course, pulling it upward, as if it weighs nothing. His right, grips the hilt, accelerating the motion, and already imparting to the blade a soft circular spin before it even leaves the scabbard.", parse);
										Text.NL();
										Text.Add("Finally, the long dark blade emerges fully from its sheath, already tracing the arc it had begun, moving toward a yet-empty spot in the air like inevitability. As its trajectory and yours intersect, the blade passes through your neck too fast for you to feel anything, too fast for even a droplet of blood to cling to it, as it runs its course and returns smoothly to the scabbard.", parse);
										Text.NL();
										Text.Add("Momentarily, your vision continues flowing in the same arc, before turning black. You see nothing, hear nothing, as the sensation of an object touching your neck finally reaches your fading mind. There is no time to think anything, and then, for you, there is no time.", parse);
										Text.NL();
										Text.Add("<i>“I say to you thrice,”</i> Lei speaks, sounding a little sad, <i>“the fight is over.”</i> He steps past your body, and walks back toward the tavern.", parse);
										Text.NL();

										if (party.Two()) {
											Text.Add("[p1name] stands over you, looking down in mute horror", parse);
										} else if (!party.Alone()) {
											Text.Add("Your companions gather around you, looking down in mute horror");
 										} else {
											Text.Add("Your blood flows out over the cobblestones");
										}
										Text.Add(", as the rain becomes a downpour.");
										Text.NL();
										Text.NL();
										Text.NL();
										Text.Add("<b>You have perished.</b>", parse);
										Text.Flush();

										SetGameOverButton();
									}, enabled : true,
									tooltip : "You don't care what he threatens, attacking this man is the only thing that matters.",
								});
								options.push(observe);
								Gui.SetButtonsFromList(options);
							}, enabled : true,
							tooltip : "You've still got a bit of strength in you, even if it's head-on, you simply have to land a good hit.",
						});
						options.push(observe);
						Gui.SetButtonsFromList(options);
					}, enabled : true,
					tooltip : "It might be outside the rules he set, but if you can beat him now, you can force him to tell you anyway.",
				});
				options.push(observe);
				Gui.SetButtonsFromList(options);
			}
		};
		enc.VictoryCondition = () => {
			return lei.HPLevel() < 0.65;
		};
		enc.onVictory = () => {
			lei.RestFull();
			party.RestFull();
			SetGameState(GameState.Event, Gui);

			lei.flags.Fought = LeiFlags.Fight.Win;
			lei.relation.IncreaseStat(100, 2);

			parse.talk = player.level < LeiFlags.PartyStrength.LEVEL_STRONG ? "I did not think you had it in you, to be honest. I am impressed," : "You are as strong as I had hoped... maybe stronger,";

			Text.Clear();
			Text.Add("<i>“Mm... that's good enough for now. Wonderful,”</i> Lei almost purrs, smiling widely at you. <i>“[talk]”</i> he says, clearly pleased. <i>“Some day, we must fight in earnest.”</i>", parse);
			Text.NL();
			Text.Add("He leads you back inside the Lady's Blessing, returning to his habitual table.", parse);
			Text.Flush();
			Gui.NextPrompt(LeiScenes.ExplanationMain);
		};

		Gui.NextPrompt(() => {
			enc.Start();
		});
	}

	export function TalkPrompt() {
		const player: Player = GAME().player;
		const lei = GAME().lei;
		const parse: any = {
			playername : player.name,
		};

		const options: IChoice[] = [];
		if (!(lei.flags.Talk & LeiFlags.Talk.Skills)) {
			options.push({ nameStr : "Skills",
				tooltip : "Ask him how he came to be as powerful as he is.",
				func() {
					Text.Clear();
					Text.Add("You ask Lei how he came to be so good at combat.", parse);
					Text.NL();
					Text.Add("He ponders for a moment before responding. <i>“There are many factors, but the most important two are that I have always had strength as my goal and that I have survived. With those, all else will come.”</i>", parse);
					Text.NL();
					Text.Add("You purse your lips, waiting for him to elaborate.", parse);
					Text.NL();
					Text.Add("<i>“Very well,”</i> he resumes, smiling slightly at your impatience, <i>“if you wish to know the details, I do not mind telling you. I started training at a school of combat when I was a child. That training has served as my foundation, though it did not persist long.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Since then, I have fought and I have studied fighting my entire life. Every time when a fight is concluded and danger passed, I play it over in my mind, scrutinizing every action. I consider what I could have done better, and how else my opponent could have acted, and every time I find something I can improve.”</i>", parse);
					Text.NL();
					Text.Add("So, if he’s studied so much, he must really know a lot about all sorts of combat styles. Perhaps he could teach you to be better as well?", parse);
					Text.NL();
					Text.Add("Lei grins widely in response, his eyes twinkling with amusement. <i>“Yes... yes, I think I could come up with something.”</i> The look on his face briefly makes you wonder if asking him was such a good idea. <i>“Give me a little while to think of the best approach to take, and we shall see if I can make you stronger.”</i>", parse);
					Text.Flush();

					lei.flags.Talk |= LeiFlags.Talk.Skills;

					// TODO
					// #one-off, unlocks [Training]

					LeiScenes.TalkPrompt();
				}, enabled : true,
			});
		}
		options.push({ nameStr : "Twins",
			tooltip : "Ask him about his relationship with the royal twins.",
			func() {
				Text.Clear();
				Text.Add("You ask Lei how he gets along with Rumi and Rani.", parse);
				Text.NL();
				Text.Add("<i>“We are getting along well, actually,”</i> he says. <i>“I understand what they want, and they understand what I want. Why do you ask?”</i>", parse);
				Text.NL();
				Text.Add("You awkwardly explain that it’s just that their personalities seem so different…", parse);
				Text.NL();
				Text.Add("<i>“I don’t believe personalities are of such great import in such matters, so long as both sides are reasonable and strive to understand one another. Relationships, I have found, are a lot like fighting in formation. It doesn’t matter much how skilled the man beside you is - what matters is that he holds up his shield and does not break.”</i> You aren’t quite sure how that metaphor works and can’t help but wonder what Lei imagines when he says ‘relationship’.", parse);
				Text.NL();
				Text.Add("<i>“In any case, though they seem flighty at first glance, I think you will find steel if you pry under the façade. Besides,”</i> he adds with a grin, <i>“I must concede that I am not opposed to some flighty fun now and again.”</i>", parse);
				Text.Flush();
			}, enabled : true,
		});
		options.push({ nameStr : "Past",
			tooltip : "Ask him about his past.",
			func() {
				Text.Clear();
				Text.Add("You tell Lei you’d like to get to know more about him. What he’s done over the years, where he came from, those sorts of things. ", parse);
				if (lei.Relation() < 75) {
					Text.Add("He pauses for a moment, looking a bit guarded, before responding. ", parse);
				}
				Text.Add("<i>“Of course. What specifically would you like to know, [playername]?”</i>", parse);
				Text.Flush();

				LeiScenes.TalkPastPrompt();
			}, enabled : true,
		});
		options.push({ nameStr : "Bodyguarding",
			tooltip : "Ask what kind of special tasks the royal twins assign him.",
			func() {

				const first = !(lei.flags.Talk & LeiFlags.Talk.Sex);

				Text.Clear();
				Text.Add("So, Rumi mentioned that Lei performed some additional duties for the twins. What kind of things do they have him do, exactly?", parse);
				Text.NL();
				Text.Add("<i>“Whatever they want for,”</i> he says, and stops there. You glare at Lei in annoyance until finally he decides to relent.", parse);
				Text.NL();
				Text.Add("<i>“They are not permitted a servant within the city, as there are none that can be trusted, so they have me perform whatever errands they need.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Shopping for snacks, fetching clothes from the tailor, sending for a carriage, making special purchases… Sometimes, they have me fetch particular persons to visit them as well.”</i>", parse);
				Text.NL();
				Text.Add("Well, that’s a bit more menial than you had guessed. Isn’t that a bit demeaning?", parse);
				Text.NL();
				Text.Add("<i>“Demeaning?”</i> Lei tilts his head, looking puzzled by the word. <i>“It is quick and well compensated, that's what it is.”</i>", parse);
				Text.NL();
				Text.Add("You’re prying a little, but you can’t help but feel curious - what kind of special purchases do they have, anyway?", parse);
				Text.NL();
				Text.Add("<i>“Mostly dildos, strap-ons, collars, whips,”</i> Lei responds casually, <i>“those sorts of things.”</i>", parse);
				Text.NL();
				Text.Add("Well. Now that you consider it, that’s not very surprising, knowing those two, but you can’t help but feel a little curious about Lei’s attitude…", parse);
				Text.Flush();

				if (first) {
					const leaveIt = () => {
						Text.Clear();
						Text.Add("You decide you’ve learned all you wanted to know about that line of questioning for now. If you become interested in Lei’s sexual proclivities, you can always come back to the topic later.", parse);
						Text.Flush();

						LeiScenes.TalkPrompt();
					};

					// [Ask][Leave]#1
					const options: IChoice[] = [];
					options.push({ nameStr : "Ask",
						tooltip : "Ask Lei what he thinks about the twins’ acquisitions.",
						func() {
							lei.flags.Talk |= LeiFlags.Talk.Sex;

							Text.Clear();
							Text.Add("You awkwardly inquire if dildos and whips and ‘those sorts of things’ are so commonplace to Lei that they aren’t even worth remarking on.", parse);
							Text.NL();
							Text.Add("He grins in response, showing teeth. <i>“I have certainly used them from time to time, but that is not quite it - rather, nothing human repels me, [playername], unless it is a violation of agreement. I assure you all of the twins’ playmates agree enthusiastically to the things they do to them, and all my pets had agreed likewise,”</i> he finishes in a low purr, and looks you up and down pointedly.", parse);
							Text.NL();
							Text.Add("You can’t help but feel curious. Have there been many such… pets?", parse);
							Text.NL();
							Text.Add("<i>“Not so many. I do not like to associate with those who are beneath me, so there are not many I would even consider.”</i> His voice is level, delivering what he sees as a statement of simple fact. <i>“And with those, there still needs to be clear mutual interest - perhaps even passion,”</i> he says, a note of skepticism creeping into his voice at the last word. <i>“When all of that is present, the encounters have been very enjoyable.”</i>", parse);
							Text.Flush();

							if (lei.flags.SexOpen === 0) {
								// [Offer][Leave]#2
								const options: IChoice[] = [];
								options.push({ nameStr : "Offer",
									tooltip : "Is he interested in you? You’re definitely interested in him.",
									func() {
										// TODO #set lei_sex_toggle = 1
										lei.flags.SexOpen = 1;

										Text.Clear();
										Text.Add("With a smile, you remark that you’re interested in him, so the two of you are at least halfway there.", parse);
										Text.NL();
										if (player.level < 7 || lei.Annoyance() > 0) {
											Text.Add("<i>“I’m not sure,”</i> Lei replies. <i>“There <b>is</b> something curious about you, but you are quite unproven as of yet. Show me that you are strong and reliable and we shall see.”</i>", parse);
											Text.NL();
											Text.Add("Well, that was actually about what you expected. Perhaps you should see about working more closely with him and seeing where things go from there.", parse);
										} else if (lei.Relation() < 75) {
											Text.Add("<i>“I am pleased to hear that, [playername],”</i> Lei says. <i>“I think I will have quite an enjoyable time exploring just how deep our mutual interest runs.”</i>", parse);
											Text.NL();
											Text.Add("That was certainly nice to hear. It seems you’ll have some pleasant exploration in your future when the opportunity arises.", parse);
										} else {
											Text.Add("Lei smiles, a fire burning behind his eyes. <i>“Of course I’m interested. I have been interested for quite some time.”</i>", parse);
											Text.NL();
											Text.Add("You blush slightly. You suspected, certainly, but that was a bolder declaration than you had guessed. Perhaps you missed out on some fun before, but there is certainly time to make up for that.", parse);
										}
										Text.Flush();

										LeiScenes.TalkPrompt();
									}, enabled : true,
								});
								options.push({ nameStr : "Drop it",
									tooltip : "That was very interesting, just not interesting to you right now.",
									func : leaveIt, enabled : true,
								});
								Gui.SetButtonsFromList(options, false, undefined);
							} else {
								LeiScenes.TalkPrompt();
							}
						}, enabled : true,
					});
					options.push({ nameStr : "Drop it",
						tooltip : "Best to drop it for now…",
						func : leaveIt, enabled : true,
					});
					Gui.SetButtonsFromList(options, false, undefined);
				}
			}, enabled : true,
		});

		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("<i>“Very well, let us turn to other matters.”</i>", parse);
			Text.Flush();

			LeiScenes.InnPrompt();
		});
	}

	export function TalkPastPrompt() {
		const player: Player = GAME().player;
		const lei = GAME().lei;
		const parse: any = {
			playername : player.name,
		};

		// [name]
		const options: IChoice[] = [];
		// TODO
		options.push({ nameStr : "Eden",
			tooltip : "Ask Lei what he’s been doing around Eden; what he thinks of it.",
			func() {
				Text.Clear();

				const scenes = [];

				// Long
				scenes.push(() => {
					Text.Add("You ask Lei what sorts of things he’s been been doing in the kingdom and beyond.", parse);
					Text.NL();
					Text.Add("<i>“Fulfilling contracts.”</i> The silence after this declaration stretches on, until at last, he’s made uncomfortable enough to explain further. <i>“That is a very vague question, [playername]. I do not wish to relate my life to you day by day.”</i> Or maybe he just wanted you to stop frowning at him.", parse);
					Text.NL();
					Text.Add("Well, what are some things he’s done that he’s the most proud of, or that others speak about the most?", parse);
					Text.NL();
					Text.Add("<i>“There is no great importance to any single event. The source of my pride, and of what respect I have is my consistency. Whenever I accept a task, I complete it in full, without fail, and without deviation.”</i> He smiles slightly. <i>“But I see you will not stop unless I tell you a story. Very well.”</i>", parse);
					Text.NL();
					Text.Add("<i>“When I had but recently started accepting jobs, I was on the road when a drab man approached me. He said that he had been robbed while only a few miles out of town. Apparently, the thieves had struck a deal with the mayor to let them live in town unmolested and to have the guards notify them of new marks they might be interested in.”</i>", parse);
					Text.NL();
					Text.Add("<i>“He said he’d been carrying several extremely valuable books when he had been ambushed, and of course, he’d pay me half their value - five thousand gold - if only I’d fetch them for him,”</i> Lei says, barely containing laughter. <i>“Imagine that, this unshaven man with calloused hands, in his clothes of rough linen, without a bruise or scratch on him, claiming he’d been robbed of ten thousand gold worth of books.”</i>", parse);
					Text.NL();
					Text.Add("<i>“So, naturally, I bound him and dragged him to the mayor. It turned out I wasn’t the first one he’d attempted to hire, and the others had somehow fallen for his claims. I believe he received a dozen lashes, and several years hard labor for the attempted theft.”</i>", parse);
					Text.NL();
					Text.Add("So… surely, that did not make him famous. What was the point of that story?", parse);
					Text.NL();
					Text.Add("<i>“It is very simple,”</i> Lei replies. <i>“The point is that I may be trustworthy, but that does not mean I trust without cause.”</i>", parse);
				});
				if (lei.Relation() >= 35) {
					scenes.push(() => {
						Text.Add("You ask Lei what he thinks of the realm of Eden.", parse);
						Text.NL();
						Text.Add("<i>“What a strange question,”</i> he says, taking a good look at you. <i>“It is the place we are in. On it, there are certain locations, plants, animals, factions…”</i> He trails off, waiting for you to clarify your question.", parse);
						Text.NL();
						Text.Add("If he could change anything he wanted about the world, what would it be?", parse);
						Text.NL();
						Text.Add("Lei pauses for thought before replying. <i>“You know, I’ve never thought about that. I do not expect such power to fall into my hands soon, so I don’t see the use in planning for it.”</i> He drums his fingers along the tabletop. <i>“I suppose you wish to know about what I consider good and bad, and use this question to elucidate that.”</i>", parse);
						Text.NL();
						Text.Add("<i>“Very well then. I would forbid the nobles from giving their children anything - even their own leisure time - so that they must succeed or fail on their own merits. I would make sure everyone receives a similar amount of training and education, so that they can compete fairly. Hm, and then... once they are trained, I would pit them against each other, in duels to the death to select the best survivalists of the lot.”</i>", parse);
						Text.NL();
						Text.Add("You stare at him in shock, as a grin slowly spreads across his face, and he gives a short sonorous laugh. So, he was joking after all... probably.", parse);
					});
				}

				let sceneId = lei.pastRotation;
				if (sceneId >= scenes.length) { sceneId = 0; }

				lei.pastRotation = sceneId + 1;

				// Play scene
				scenes[sceneId]();

				Text.Flush();
			}, enabled : true,
		});
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("<i>“Let’s dwell on the past no more. Did you want to talk about anything else?”</i>", parse);
			Text.Flush();

			LeiScenes.TalkPrompt();
		});
	}

	export function SexPrompt() {
		const lei = GAME().lei;
		const parse: any = {

		};

		// [name]
		const options: IChoice[] = [];
		if (lei.flags.SexOpen === 0) {
			options.push({ nameStr : "Flirt",
				tooltip : "Flirt with him, and mention you’d like to do more than flirt.",
				func() {
					Text.Clear();
					Text.Add("You tell Lei that you’re curious whether his drive for increasing his skill extends beyond his swordplay - perhaps, to things that few get to see?", parse);
					Text.NL();
					Text.Add("<i>“It does, though other abilities are less important to me, so perhaps I am not as advanced in them.”</i>", parse);
					Text.NL();
					Text.Add("He seems to not be quite catching what you’re driving at. You ask him if perhaps he’d show you some of them some time - in private. Well, probably in private, you add with a wink.", parse);
					Text.NL();
					Text.Add("Lei laughs in amusement. <i>“Eager, are you not? Perhaps I shall, if you really wish to be my pet, though I think we will have to wait until a special occasion.”</i>", parse);
					Text.NL();
					Text.Add("What kind?", parse);
					Text.NL();
					Text.Add("<i>“Quite simply, demonstrate your strength, your competence, and I will be pleased to play with you.”</i>", parse);
					Text.NL();
					Text.Add("You nod in acquiescence. Perhaps doing well in sparring or succeeding at a job would do the trick.", parse);
					Text.Flush();

					lei.flags.SexOpen = 1;

					LeiScenes.SexPrompt();
				}, enabled : true,
			});
		} else {
			options.push({ nameStr : "Discuss",
				tooltip : "Actually, you’d like to return to a non-sexual relationship for now.",
				func() {
					Text.Clear();
					Text.Add("Feeling a little awkward, you tell Lei that while you have enjoyed his attention so far, you’d like to keep your relationship a bit more hands off for now.", parse);
					Text.NL();
					Text.Add("He tilts his head in puzzlement, before nodding. <i>“Very well.”</i>", parse);
					Text.NL();
					Text.Add("His simple acceptance is both a relief and rather infuriating. Shouldn’t he at least ask why? Try to cling a little? That’s not an unreasonable thing to hope for.", parse);
					Text.NL();
					Text.Add("Having him beg you to reconsider was probably ever only going to happen in daydreams, though.", parse);
					Text.Flush();

					lei.flags.SexOpen = 0;

					LeiScenes.SexPrompt();
				}, enabled : true,
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
		}
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("<i>“Something else on your mind?”</i>", parse);
			Text.Flush();

			LeiScenes.InnPrompt();
		});
	}

	export function SparPrompt() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const lei = GAME().lei;
		const parse: any = {

		};

		const options: IChoice[] = [];
		options.push({ nameStr : "Spar",
			tooltip : "Ask Lei to spar with you.",
			func() {
				Text.Clear();
				Text.Add("You ask Lei if he would like to spar.", parse);
				Text.NL();
				if (lei.sparTimer.Expired()) { // If haven't sparred today
					lei.sparTimer = new Time(0, 0, 0, 20, 0);

					Text.Add("Lei nods. <i>“Of course. It’s important to keep up with practice.”</i> He motions for you to follow, and leads you to the stables behind the inn. In front of the stalls is a sizable enclosure for outfitting horses and unloading wagons. <i>“It’s a little cramped, but it will serve.”</i>", parse);
					Text.NL();
					Text.Add("Lei does a few stretches before turning to face you.", parse);
					Text.NL();

					party.SaveActiveParty();

					let levelbonus = 0;

					if (player.level > 15) {
						Text.Add("<i>“Come. You are powerful enough that it will be good practice for us to fight one on one.”</i>", parse);

						levelbonus = 8;

						party.ClearActiveParty();
						party.SwitchIn(player);
					} else if (party.Num() > 1) {
						if (player.level > 10) {
							parse.partycount = Text.NumToText(party.Num());
							Text.Add("<i>“All of you come face me. The [partycount] of you against me should be reasonable odds.”</i>", parse);
							levelbonus = 5;
						} else {
							parse.bothAll = party.Num() === 2 ? "both" : "all";
							Text.Add("<i>“Hm,”</i> Lei looks you and your companions over, <i>“I feel I will have to hold back to have this be any sort of practice for any of us. So be it - [bothAll] of you come at me at once!”</i>", parse);
						}
					} else {
						Text.Add("Lei frowns. <i>“It will be a tough fight for you alone, but perhaps you can still learn something. Come!”</i>", parse);
						if (player.level >= 12) {
							levelbonus = 3;
						}
					}
					Text.Flush();

					Gui.NextPrompt(() => {
						const enemy = new Party();
						const l = new LeiSpar(levelbonus);
						enemy.AddMember(l);
						const enc: any = new Encounter(enemy);
						enc.lei = l;
						enc.canRun = false;
						enc.onLoss = LeiScenes.SparLoss;
						enc.onVictory = LeiScenes.SparWin;

						enc.Start();
					});
				} else {
					Text.Add("<i>“We have already fought today,”</i> Lei replies. <i>“Once per day is enough.”</i>", parse);
					Text.NL();
					Text.Add("That seems a little arbitrary, but you can see he’s not going to budge on this.", parse);
					Text.Flush();
				}
			}, enabled : true,
		});
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			Text.Add("<i>“Never stop improving.”</i>", parse);
			Text.Flush();

			LeiScenes.InnPrompt();
		});
	}

	export function SparWin() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const lei = GAME().lei;
		const enc = this;

		SetGameState(GameState.Event, Gui);
		enc.Cleanup();
		Text.Clear();

		const parse: any = {

		};

		for (let i = 0; i < party.Num(); ++i) {
			party.Get(i).AddExp(enc.lei.combatExp);
		}

		TimeStep({hour: 1});

		party.LoadActiveParty();

		if (lei.Annoyance() > 0) {
			Text.Add("Lei regards you with a serious expression. <i>“It seems you can be reliable at times after all.”</i>", parse);
			Text.NL();
			Text.Add("You wait for a moment, but it seems he doesn’t plan to say anything else, as he walks past you and heads inside. Hardly a ringing endorsement, but you suspect you’ve done enough to make up for ", parse);
			if (lei.Annoyance() > 1) {
				Text.Add("at least some part of your mistakes on the last job.", parse);
			} else {
				Text.Add("your mistakes on the last job.", parse);
			}
			Text.Flush();

			lei.annoyance.DecreaseStat(0, 1);

			LeiScenes.InnPrompt();
		} else {
			Text.Add("Lei grins, looking bruised and winded, but clearly pleased. <i>“Very well done!”</i> he says. <i>“It is rare for me to get such good practice.”</i>", parse);
			Text.NL();
			if (lei.SexOpen()) {
				parse.hair = player.Hair().Short();
				Text.Add("He holds your eyes for a long moment, his smile slowly growing wider. You are the one to look away first, and Lei moves towards you, closing the distance in a few strides. He runs his hand down your [hair] before cupping your chin in his palm, turning your face so your eyes meet.", parse);
				Text.NL();
				if (lei.flags.Met >= LeiFlags.Met.CompletedTaskEscort) {
					Text.Add("<i>“Did you want a reward for your performance?”</i> he asks.", parse);
					Text.Flush();

					// [name]
					const options: IChoice[] = [];

					LeiSexScenes.Prompt(options);

					Gui.SetButtonsFromList(options, true, () => {
						Text.NL();
						Text.Add("You look up at Lei with a smile of your own, and tell him that you’re happy to beat him for free any time.", parse);
						Text.NL();
						Text.Add("Lei bursts out laughing, releasing your chin. <i>“I like that spirit about you. Very well, another time then.”</i>", parse);
						Text.Flush();

						LeiScenes.InnPrompt();
					});
				} else {
					Text.Add("<i>“You have my interest, but you will have to do something more before I can be certain of you.”</i> Lei says, his voice low. He plants a soft kiss at the corner of your mouth before tracing his lips up your cheek and gently nibbling on your ear. <i>“Then, we can have a lot more fun.”</i>", parse);
					Text.NL();
					Text.Add("It seems you’ll have to prove yourself at a larger job before he’ll take this any further.", parse);
					Text.Flush();

					LeiScenes.InnPrompt();
				}
			} else {
				Text.Add("You suppose that counts as high praise coming from him, and he certainly seems happy with you.", parse);
				Text.Flush();

				LeiScenes.InnPrompt();
			}
		}
	}

	export function SparLoss() {
		const party: Party = GAME().party;
		const lei = GAME().lei;
		const enc = this;

		SetGameState(GameState.Event, Gui);
		enc.Cleanup();
		Text.Clear();

		const parse: any = {

		};

		for (let i = 0; i < party.Num(); ++i) {
			party.Get(i).AddExp(5);
		}

		if (enc.lei.HPLevel() >= 0.5) {
			Text.Add("Lei regards you calmly. <i>“I hope you have learned from that. You will need to improve to make this useful for me.”</i>", parse);
			Text.NL();
			Text.Add("You tell him that you have. You’ll make this quite interesting for him before too long!", parse);
			Text.NL();
			Text.Add("Unfortunately, your words are less impressive than they could be as you’re gingerly rubbing at a bruise on your butt.", parse);
		} else {
			Text.Add("Lei shows you just a hint of a smile. <i>“Not bad. You’ll have to do better to make this truly interesting, but you got close.”</i>", parse);
			Text.NL();
			Text.Add("You give him a small smile in return. You’ll get him next time!", parse);
			lei.annoyance.DecreaseStat(0, 0.5);
		}
		Text.Flush();

		TimeStep({hour: 1});

		party.LoadActiveParty();

		LeiScenes.InnPrompt();
	}

	// #random one-off explore event in Slums/Residential at night (say 10pm-5am or whatever)
	export function GuardStalkingApplicable() {
		const lei = GAME().lei;
		return lei.flags.Met >= LeiFlags.Met.KnowName && !(lei.flags.Talk & LeiFlags.Talk.GuardBeating) && ((WorldTime().hour >= 22) || (WorldTime().hour < 5));
	}

	export function GuardStalking() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const lei = GAME().lei;
		const miranda = GAME().miranda;
		const kiakai = GAME().kiakai;

		const parse: any = {
			race : player.Eyes().race.qShort(),
			playername : player.name,
			name : kiakai.name,
		};

		const nv = player.HasNightvision();

		lei.flags.Talk |= LeiFlags.Talk.GuardBeating;

		Text.Clear();
		Text.Add("The road shambles forward before you, ", parse);
		if (nv) {
			Text.Add("dotted with potholes. Decrepit houses line both sides, their state speaking more of willful neglect than of poverty. The moon is hidden by clouds and there is but little illumination from the rare intact lantern, but your [race] eyes let you make out your surroundings well enough.", parse);
		} else {
			Text.Add("the near complete darkness shrouding the ramshackle houses around you from sight. The face of a building you do make out in the dim glow of a rare intact lantern speaks of willful neglect as much as poverty.", parse);
		}
		Text.Add(" From somewhere behind you, you hear the squelch of a heavy boot becoming markedly less clean. A quiet curse follows, carrying well in the still air, and you turn to have a look at the man. In this area, and especially at night, it’s best to watch anyone within bowshot distance of you.", parse);
		Text.NL();
		parse.nv = nv ? ", his City Watch armor glinting in the lamplight" : " - at least as far as you can make out from the glint of lamplight on armor";
		Text.Add("To your surprise, it seems to be a solitary guard[nv]. You didn’t think even larger patrols came here at this hour, but the man’s posture shows no sign of concern - aside from examining his boots with evident irritation.", parse);
		Text.NL();
		Text.Add("<i>“Oy, slag!”</i> a slightly slurred voice calls out from further down the street, behind the guard. <i>“Yeh, I’m talkin’ to ya, brassmonkey.”</i>", parse);
		Text.NL();
		Text.Add("It might be wiser to continue on your way… but you can’t help but feel curious about where this is going, and decide to watch.", parse);
		Text.NL();
		Text.Add("<i>“Are you drunk, man?”</i> The guard turns to face the man, his hand firm on his sword hilt. <i>“It is a long walk to the cells, so I will give you precisely one chance to speak your apologies.”</i>", parse);
		Text.NL();
		Text.Add("<i>“How ‘bout ye apologize for shittin’ on my view with yer malformed mug?”</i> the man replies. You shift for a better look and see that he is swathed in a dark cloak, the hood drawn. His figure is a silhouette of deeper shadow in the dark street. <i>“I ken y’want to save on whores ‘cause they charge ye triple, but don’t ye come ‘round here looking for ‘em. Wouldn’t do for yer ugliness to rub off.”</i>", parse);
		Text.NL();
		Text.Add("You see the guard’s shoulders rise and fall as he takes a steady breath, and then he draws his sword in one fluid motion, raising the tip to the cloaked man’s throat. You don’t see the movement that follows, but there is the ring of metal on metal, and the cloaked man holds a shortsword, pressing inside his opponent’s guard.", parse);
		Text.NL();

		const fLevel = player.jobs.Fighter.level + player.jobs.Rogue.level + player.jobs.Bruiser.level;

		parse.nv = nv ? "" : " in the dark";
		Text.Add("To the guard’s credit, he responds remarkably well to what you can only assume was a major surprise. He hops back out of reach, trying to reestablish a suitable range for his longer weapon. Blades clash again and again[nv], ", parse);
		if (fLevel >= 10) {
			Text.Add("almost too quick to follow, but your well-trained eyes pick out the movements as much from the shifts of shoulders and posture as from the glint of swords. The assailant pursues the guard’s retreat, denying the longsword’s range. Threatening, over-broad strokes with the longsword are answered with efficient, almost demure movements of the smaller blade. After two or three steps back, you judge from the guard’s tense neck that he longs to glance behind him, to see where the holes lie in the pitted pavement, but he does not dare look away.", parse);
			Text.NL();
			Text.Add("The man is cornered, far too disadvantaged in position and range to have a chance, even though the two could perhaps have been evenly matched on a training ground. And indeed, at such close range, the parry for the shortsword’s next lunge comes just slightly late, and the weapon tears a gash across the guard’s left arm. As he’s distracted by the hit, his assailant lands a kick on his right calf, setting him off-balance.", parse);
		} else {
			parse.nv = nv ? " despite your night vision," : "";
			Text.Add("too quick to follow, and[nv] you make out little. The guard retreats, while his assailant pursues, though the two seem evenly matched as far as you can tell. They exchange furious strikes for a few moments, before the assailant flies out with a kick to the guard’s right leg, setting him off-balance.", parse);
		}
		Text.Add(" Unable to catch himself, the guard tumbles backward, his helmeted head banging forcefully against a loose cobble.", parse);
		Text.Flush();

		// [Observe][Assist]
		const options: IChoice[] = [];
		options.push({ nameStr : "Observe",
			tooltip : "This <i>still</i> has nothing to do with you. Keep watching.",
			func() {
				Text.Clear();
				Text.Add("You shrug. Well, the situation’s unfortunate for the forces of law and order, but then, the forces of law and order in this area have never been much to begin with.", parse);
				Text.NL();
				if (party.InParty(miranda)) {
					Text.Add("From your side, Miranda glares at you. <i>“Are you really going to just stand there and watch? That bastard could be about to kill that idiot!”</i> She shakes her head, her eyes narrowed, and sets off at a run toward the former combatants.", parse);
					Text.NL();
					Text.Add("Sighing, you run after her. The situation involves you now.", parse);
					Text.NL();

					miranda.relation.DecreaseStat(-100, 5);

					LeiScenes.GuardStalkingEntry(parse, nv);
				} else {
					Text.Add("The cloaked man presses his blade against the guard’s throat while he examines him. Apparently satisfied that his former adversary is unconscious, he withdraws the sword, and in a moment, it vanishes back beneath his cloak.", parse);
					Text.NL();
					Text.Add("He bends over and picks up his opponent’s longsword, before slowly walking toward the entrance of the nearest alleyway. Just as he’s about to pass into deeper shadow, the man half-turns, momentarily catching your eyes from beneath the hood of his cloak, and beckons for you to follow him.", parse);
					Text.NL();
					if (party.InParty(kiakai)) {
						Text.Add("<i>“I do not know if you should follow him, [playername],”</i> [name] says, <i>“but I know that <b>my</b> duty lies here. I must assist the guard, to ensure that he does not suffer lasting injury from this encounter.”</i>", parse);
						Text.NL();
						Text.Add("Well, that just makes your own decision harder. ", parse);
					}
					Text.Add("You hesitate for a long moment. Following an aggressive, ill-mannered stranger into a dark alley certainly does not seem like the greatest of ideas… but he seemed somehow different at the end there. Almost familiar. Finally, your curiosity gets the better of you, and you follow his steps into the deeper shadows.", parse);
					Text.NL();

					LeiScenes.GuardStalkingConverge(parse, nv);
				}
			}, enabled : true,
		});
		options.push({ nameStr : "Assist",
			tooltip : "You’d better help the unconscious guard. Who knows what your conscience might do if he’s killed in front of you...",
			func() {
				Text.Clear();
				parse.nv = nv ? "you pace yourself, carefully avoiding the many potholes in your way" : "you’re forced to pace yourself as you stumble on a pothole in the darkness";
				Text.Add("You set off at a run toward the fallen guard, though [nv].", parse);
				Text.NL();
				if (party.InParty(miranda)) {
					Text.Add("<i>“I knew I could count on you,”</i> Miranda says, easily keeping up with you. <i>“We can’t let that bastard do as he pleases!”</i>", parse);
					Text.NL();

					miranda.relation.IncreaseStat(100, 5);
				}

				LeiScenes.GuardStalkingEntry(parse, nv);
			}, enabled : true,
		});
		Gui.SetButtonsFromList(options, false, undefined);
	}

	export function GuardStalkingEntry(parse: any, nv: boolean) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const kiakai = GAME().kiakai;
		const miranda = GAME().miranda;

		Text.Add("Although the distance is short, the cloaked man moves with remarkable agility. The shortsword vanishes back inside his cloak, and he snatches up the guard’s longer weapon. Before you’re more than halfway to the scene, he reaches the mouth of the nearest alleyway, and pauses for a moment at the lip of deeper shadows. The man half-turns, momentarily meeting your eyes from beneath the hood of his cloak, and beckons for you to come before disappearing into darkness.", parse);
		Text.NL();
		if (party.InParty(miranda)) {
			Text.Add("As you reach the unconscious guard, Miranda drops to one knee beside him. She looks intently at the dark alley entrance. <i>“You go after him, [playername],”</i> she says hesitantly. <i>“Can’t leave an unconscious guardsman alone with the locals. It’d be a shame if a slashed throat was added to his wounds, even if he is incompet-”</i> She cuts off as she notices the guard’s face beneath his helmet.", parse);
			Text.NL();
			Text.Add("<i>“Damn. This one’s actually one of the better fighters in the Guard. Be careful. Scream like a little girl if you need help.”</i>", parse);
			Text.NL();
			if (party.InParty(kiakai)) {
				Text.Add("<i>“I will assist you, Miranda,”</i> [name] says. <i>“The injuries do not appear severe, but I will need to ensure that the concussion does not lead to internal bleeding.”</i>", parse);
				Text.NL();
			}
		} else if (party.InParty(kiakai)) {
			Text.Add("<i>“You must be careful if you follow him, [playername],”</i> [name] says. <i>“I cannot accompany you, for my duty lies here. I must assist the guard, to ensure that he does not suffer lasting injury from this encounter.”</i>", parse);
			Text.NL();
		}

		let comps = party.CloneParty();
		comps = _.without(comps, miranda, kiakai, player);
		// #if non-Kiai/non-Miranda companions are present
		if (comps.length > 0) {
			parse.nv = nv ? "deep shadows" : "blank darkness";
			parse.nv2 = nv ? " There is so little light that despite your night vision, you can barely make out what’s inside." : "";

			const c1 = comps[0];
			const km = party.InParty(miranda) || party.InParty(kiakai);

			parse.o = km ? " other" : "";
			parse.c = comps.length > 1 ? Text.Parse("your[o] companions", parse) : c1.name;
			parse.km = km ? "help with" : "watch over";
			parse.heshe = comps.length > 1 ? "they" : c1.heshe();
			parse.himher = comps.length > 1 ? "them" : c1.himher();

			Text.Add("You stare into the [nv] of the narrow alleyway.[nv2] Even if you brought [c] with you, [heshe] would be as likely to stumble over you as to be of any help. You tell [himher] to [km] the injured guard while you investigate.", parse);
			Text.NL();
		}
		parse.nv = nv ? "where the man went" : "shapes";
		Text.Add("You hesitate for a moment, trying to make out [nv] in the darkness of the alley. Chasing an aggressive, ill-mannered stranger into the dark certainly seems rather dangerous… but he seemed somehow different at the end there. Almost familiar. You decide you can’t let this drop here - for the sake of your curiosity as much as any sort of revenge for the guard - and follow the stranger’s steps into the deeper shadows.", parse);
		Text.NL();
		LeiScenes.GuardStalkingConverge(parse, nv);
	}

	export function GuardStalkingConverge(parse: any, nv: boolean) {
		const player: Player = GAME().player;
		const lei = GAME().lei;
		Text.Add("You gingerly take a few steps inside. ", parse);
		if (nv) {
			Text.Add("Blank walls loom to your left and right - the residents apparently preferring to do without windows. Your pupils widen to their widest. The sky above and reflected light from distant lanterns give you barely enough illumination to see, but even for you the alley is filled with obscuring shadow. Broken timber and other rubbish are piled high in places, providing cover and tricky terrain both.", parse);
			Text.NL();
			Text.Add("You proceed slowly, scanning the walls around you carefully, staring intently into shadows. At the corner of your eye, you see one shadow move, jumping out from a doorway, and darting toward you. You spin, and desperately jump backward, as a shortsword stops where you had been standing, pointing at your chest.", parse);
			Text.NL();
			parse.eyecolor = Color.Desc(player.Eyes().color);
			Text.Add("<i>“Oh, that is mighty nice, poppet.”</i> You stand facing the man. Beneath his drawn hood, his orange glint with reflections of distant light, as you know your own [eyecolor] ones must be. <i>“I dinnae think ye could see in ‘ere. Still, that was an awful close dodge, wa’n’t it? And can ye defend yeself now? Don’t seem wise to follow me in ‘ere.”</i>", parse);
		} else {
			Text.Add("To your left and right, you feel as much as see walls looming, blocking what little light there was from reaching further. The narrow strip of cloudy sky above is a slightly lighter darkness in your vision. Bare hints of outlines in front suggest boxes or perhaps piles of rubbish. If the man just chose to stand pressed against a wall somewhere, you’re not sure you’d be able to find him.", parse);
			Text.NL();
			Text.Add("Hoping that your eyes will be able to adjust to the dark a little more, you walk in further, and stare intently into the shadow. There is the muffled sound of a step, and in the next instant, you feel a cold steel pressing against the side of your neck and a woosh of air from the sword’s passage.", parse);
			Text.NL();
			Text.Add("<i>“Well, ain’t this silly? Ye may be strong, poppet, but what does that strength matter if ye let yerself be ambushed and lose yer head ‘fore ye can do a thing?”</i>", parse);
		}
		Text.NL();
		if (player.Int() >= 40) {
			Text.Add("There is definitely something off here. The man’s accent is the same as before, but his diction has definitely changed.", parse);
		} else if (nv) {
			Text.Add("It’s possible you could, but as when he faced the guard, the range again favors him. He also seemed faster than before…", parse);
 		} else {
			Text.Add("You can’t decide whether you’re frustrated by the fact that he can evidently see better than you or glad of it. He managed to stop that blade awfully close.", parse);
 		}
		Text.NL();
		parse.nv = nv ? "the sword vanishes as if it were never there" : "you feel the steel disappear from your neck";
		parse.nv2 = nv ? "man" : "voice";
		Text.Add("<i>“Or perhaps you felt there was something unnatural about the situation. Perhaps your instincts told you there was no danger? It is risky to rely on such instincts-”</i> [nv] <i>“-but I shall not condemn them when they were correct. Hello, [playername],”</i> the [nv2] almost purrs.", parse);
		Text.NL();
		Text.Add("Hi, Lei. Fancy meeting you here.", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();
			parse.nv = nv ? "the relief of being out of danger" : "relief at being alive";
			parse.nv2 = nv ? "" : "the shadow that apparently contains ";
			Text.Add("You take a few deep breaths to steady yourself. Instincts or no, your muscles still tremble in tension, and [nv] washes through you. You tell [nv2]Lei that this is the sort of joke that gives people nightmares.", parse);
			Text.NL();
			parse.nv = nv ? "have a chance to examine him, the stature, and his precise way of holding himself give him away completely, cloak or no" : "look closely, you can see a glint of light reflecting off orange eyes in the shadows";
			Text.Add("<i>“Certainly, but are nightmares such a bad thing?”</i> Now that you [nv]. <i>“Consider the guardsman you saw me fight, for example. When I saw him take part in sparring matches two years ago, I thought he had the potential to become strong. That potential has, however, gone untapped. I see some small improvements in him, but he has also become predictable.”</i>", parse);
			Text.NL();
			Text.Add("So, does that have something to do with nightmares and why Lei attacked him?", parse);
			Text.NL();
			parse.nv = nv ? "Lei nods." : "The orange eyes tilt down for a moment in what you suspect is a nod.";
			Text.Add("[nv] <i>“One who has nightmares does not stagnate. He either struggles to overcome his fears and grows stronger, or lets them break him.”</i>", parse);
			Text.Flush();

			// [Approve][Indifferent][Chastise]
			const options: IChoice[] = [];
			options.push({ nameStr : "Approve",
				tooltip : "Lei provided a free, useful lesson to the guard. Certainly praiseworthy.",
				func() {
					Text.Clear();
					Text.Add("That’s generous of Lei - going to all the trouble of providing the guard with motivation, and taking just a sword in return.", parse);
					Text.NL();
					LeiScenes.GuardStalkingApprove(parse, nv);
				}, enabled : true,
			});
			options.push({ nameStr : "Indifferent",
				tooltip : "What do you care what Lei does in his free time? It doesn’t concern you.",
				func() {
					Text.Clear();
					parse.nv = nv ? ". If" : " before remembering that he probably can’t see the movement. Or, given his handling of the sword earlier, perhaps he can… In any case, you tell him that if";
					Text.Add("You shrug[nv] that’s how he wants to pass his time, that’s his decision. You’re a little curious, however - why does he bother with this?", parse);
					Text.NL();
					LeiScenes.GuardStalkingApprove(parse, nv);
				}, enabled : true,
			});
			options.push({ nameStr : "Chastise",
				tooltip : "The fact that Lei is harming others just because he feels like it is quite horrible, and you’re going to tell him as much.",
				func() {
					Text.Clear();

					lei.relation.DecreaseStat(0, 2);

					Text.Add("And what if the fears do break him? Or if there are long-term effects from the concussion he received? Why is it Lei who get to choose that the guard needs this to become stronger?", parse);
					Text.NL();
					parse.nv = nv ? "Lei closes his eyes" : "The orange eyes disappear";
					Text.Add("[nv], and all is silent for half a minute. ", parse);
					if (nv) {
						Text.Add("You begin to feel tempted to walk over and poke him when he finally reopens them.", parse);
					} else {
						Text.Add("You begin to wonder if the asshole has snuck off, when the eyes reappear where they had been.", parse);
					}
					Text.NL();
					Text.Add("<i>“I do not decide what <b>he</b> needs. I only do,”</i> Lei says, his voice colder than usual. <i>“If he wished to stop me, he needed only to be stronger. That is the only way one obtains the right to choose.”</i> He takes several steps toward you, drawing close enough that you feel the heat of his body in front of yours in the cool night air. <i>“If you wish to stop me, you need only become stronger as well. I will no longer need to cultivate all these little sprouts if you grow high enough to touch the sky.”</i>", parse);
					Text.Flush();

					// [Flirt][Move on][Confront]
					const options: IChoice[] = [];
					options.push({ nameStr : "Flirt",
						tooltip : "And what kind of reward is he offering for your growth?",
						func() {
							Text.Clear();
							Text.Add("Well, if he selfishly wants something like that, he’s going to have to pay up when you accomplish it for him, isn’t he?", parse);
							Text.NL();
							parse.nv = nv ? "Lei chuckles softly" : "There’s a soft chuckle from the darkness";
							Text.Add("[nv]. <i>“Selfishly? I think being strong enough to not die is in your interest as well. Though in any case, I do not believe in work for free, and I pay my dues. If you grow as high as I hope, I will be sure to give you any treat you like.”</i>", parse);
							Text.NL();
							Text.Add("Ha, if you make it there, who says you’ll wait for him to give you anything? You just might grow impatient - and take it.", parse);
							Text.NL();
							Text.Add("<i>“You are most certainly welcome to try anytime.”</i> He pauses. <i>“Well, preferably not right at this moment.", parse);
							LeiScenes.GuardStalkingOutro(parse, nv);
						}, enabled : true,
					});
					options.push({ nameStr : "Move on",
						tooltip : "It doesn’t look like you’re going to make much progress in this argument. You’ve got other things to do.",
						func() {
							LeiScenes.GuardStalkingMoveOn(parse, nv);
						}, enabled : true,
					});
					options.push({ nameStr : "Confront",
						tooltip : "There are other ways he can be stopped too…",
						func() {
							Text.Clear();
							Text.Add("You could always just report what he did to the guards. That would stop him - or at least slow him down.", parse);
							Text.NL();
							Text.Add("<i>“Whom do you imagine that would help? This man would likely see your help as further humiliation. And were you to succeed in restoring his confidence, he may resume patrolling here, and be killed for his arrogance and lack of skills.”</i>", parse);
							Text.NL();
							Text.Add("<i>“In any case, I assure you that I have connections enough in this city that even if you were to be believed, it would cause me but a little trouble.”</i>", parse);
							Text.NL();
							Text.Add("Then, it may be difficult, but you could stop him yourself.", parse);
							Text.NL();
							Text.Add("<i>“Now, now. There is no need to be so dramatic. If you are so confident in yourself, you need only show me the fruits of your growth in any case.”</i> His voice grows lower. <i>“You can come play with me at Lady’s Blessing any time you like.”</i>", parse);
							Text.NL();
							parse.nv = nv ? " - it’s probably not going anywhere" : " - well, with the dark, you’re pretty sure it’s there anyway";
							Text.Add("That does sound more appealing than fighting in this dark and smelly alley. You can wait a little while to beat that smugness off his face[nv].", parse);
							Text.NL();
							parse.nv = nv ? " " : "”</i> Yes, it’s definitely there. <i>“";
							Text.Add("<i>“As you say.[nv]But for now, it would be best to part ways here.", parse);
							LeiScenes.GuardStalkingOutro(parse, nv);
						}, enabled : true,
					});
					Gui.SetButtonsFromList(options, false, undefined);
				}, enabled : true,
			});
			Gui.SetButtonsFromList(options, false, undefined);
		});
	}

	export function GuardStalkingApprove(parse: any, nv: boolean) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const lei = GAME().lei;
		Text.Add("<i>“I but water a young sprout. If it becomes strong, perhaps I can use it to grow myself.”</i> He pauses, and his next words are quieter. <i>“This one is not as promising as some I wish to cultivate, but one cannot rely overmuch on a single crop.”</i>", parse);
		Text.Flush();

		lei.relation.IncreaseStat(100, 2);

		// [Flirt][Move on]
		const options: IChoice[] = [];
		options.push({ nameStr : "Flirt",
			tooltip : "Does he think these crops are so delicious?",
			func() {
				Text.Clear();
				parse.juicyfirm = player.mfTrue("firm", "juicy");
				Text.Add("You take a small step toward him. Is he looking forward to tasting the ripe, [juicyfirm] fruits of his cultivation so very much?", parse);
				Text.NL();
				if (lei.SexOpen() && lei.Relation() > LeiFlags.Rel.L3) {
					Text.Add("Lei closes the rest of the distance to you, his steps confident in the darkness. He cups your chin in his hand, his thumb tracing slowly along your cheekbone. <i>“Oh yes, so very much indeed. It is already quite delicious-”</i> his thumb descends, brushing over your lips, parting them gently, <i>“-so I can barely imagine what it will be like fully ripe.”</i>", parse);
					Text.NL();
					Text.Add("You give his thumb a little kiss and promise that you’ll ensure he gets a good, full taste.", parse);
					Text.NL();
					parse.nv = nv ? "" : ", rejoining the darkness";
					Text.Add("Lei gives your cheek a last lingering caress and takes a step back[nv].", parse);
				} else if (lei.SexOpen() && lei.Relation() > LeiFlags.Rel.L1) {
					const bald = player.Hair().Bald() ? "taking care to scratch behind your [ears]" : "gently running his fingers through your [hair]";
					parse.bald = Text.Parse(bald, {ears: player.EarDesc(true), hair: player.Hair().Short()});
					Text.Add("Lei closes the rest of the distance to you, his steps confident in the darkness. You feel his hand rest on your head, and he begins to stroke it, [bald]. <i>“And I see I have found a crop that is quite eager for the harvest.”</i>", parse);
					Text.NL();
					Text.Add("This metaphor is feeling stranger by the minute. What kind of plant does he imagine you are anyway?", parse);
					Text.NL();
					Text.Add("His hand pauses, as he apparently ponders the question for a moment. <i>“Everlure, I think. One of the most dangerous plants from a land far away. It looks beautiful, and the fruits are delicious, but eating too many of them brings addiction, forcing one to keep coming back to taste it again and again.”</i>", parse);
					Text.NL();
					Text.Add("You’ll make sure his addiction is a pleasant one, then. You reach out to pull him closer, but with a last lingering touch, Lei pulls back, stepping out of reach.", parse);
				} else { // (very low rel, or sex off)
					Text.Add("The glittering eyes narrow. <i>“Much as one ever looks forward to one’s dream. There is hope, desire, a wanton wishfulness that is difficult to curb…”</i> The words trail off, and when he continues, the voice is warmer. <i>“Though once in a long time, reality surpasses even dreams, and it is that possibility that spurs all longing on.”</i>", parse);
					Text.NL();
					Text.Add("So all you have to do is to exceed his wildest expectations then? Sounds easy enough.", parse);
					Text.NL();
					Text.Add("There’s a soft laugh from Lei at your remark.", parse);
				}
				Text.Add(" <i>“Though this is a pleasant discussion, I believe such a conversation would be better suited to some place that is less malodorous.”</i>", parse);
				Text.NL();
				parse.comp = party.Num() === 2 ? party.Get(1).name + " is" : "your companions are";
				parse.c = party.Num() > 1 ? Text.Parse("how [comp] doing with the guard", parse) : "on the guard";
				Text.Add("Ah, yes, now that you are reminded, there does seem to be a smell of stale urine that you had managed to filter out. Shall the two of you check [c] and then be on your ways?", parse);
				Text.NL();
				Text.Add("<i>“I have no objections. Though it is best not to take overlong.", parse);
				LeiScenes.GuardStalkingOutro(parse, nv);
			}, enabled : true,
		});
		options.push({ nameStr : "Move on",
			tooltip : "Well, time to get going. Maybe you’ll check on the guard along the way.",
			func() {
				LeiScenes.GuardStalkingMoveOn(parse, nv);
			}, enabled : true,
		});
		Gui.SetButtonsFromList(options, false, undefined);
	}

	export function GuardStalkingMoveOn(parse: any, nv: boolean) {
		const party: Party = GAME().party;
		Text.Clear();
		parse.comp = party.Num() === 2 ? party.Get(1).name + " is" : "your companions are";
		parse.c = party.Num() > 1 ? Text.Parse("how [comp] doing with the guard", parse) : "on the guard";
		Text.Add("Probably best not to stay too long in a smelly, dirty, dark alley. Besides, it’d be best to check [c] - it wouldn’t be surprising for unplanned violence to break out in this neighborhood.", parse);
		Text.NL();
		Text.Add("<i>“Perhaps, but it is best not to linger.", parse);
		LeiScenes.GuardStalkingOutro(parse, nv);
	}

	export function GuardStalkingOutro(parse: any, nv: boolean) {
		const party: Party = GAME().party;
		const kiakai = GAME().kiakai;
		const miranda = GAME().miranda;

		Text.Add(" Before coming here, I had a summons delivered to a guard patrol to the west of here, notifying them of the injury of one of their own. They will arrive any minute, and likely be none too happy,”</i> Lei says, sounding quite pleased for his part. He motions for you to follow, as he starts walking toward the mouth of the alleyway. <i>“Did you think I would leave him to lie here all night? If he died, giving the lesson would have been a waste of my time, after all.”</i>", parse);
		Text.NL();
		Text.Add("He stops on the border of shadow and the relative light of the street outside. <i>“A small extra reminder…”</i> Lei twirls the guard’s longsword for a moment, apparently thinking, before ramming it into the wall at the corner of the building with a squeal of wood and metal. When he pulls back his hand, little more than the sword’s hilt is visible sticking out of the wood.", parse);
		Text.NL();
		parse.comp = party.Num() === 2 ? party.Get(1).name : "your companions";
		parse.is = party.Num() === 2 ? "is" : "are";
		parse.c = party.Num() > 1 ? Text.Parse(", indicating [comp], who [is] looking at Lei in surprise", parse) : "";
		Text.Add("He motions at you[c]. <i>“Go. I will watch over him until the patrol arrives. You do not want to be explaining things to angry guards, even if you are innocent.”</i>", parse);
		Text.NL();
		Text.Add("And he probably doesn’t want you explaining things to them either, you remark.", parse);
		Text.NL();
		Text.Add("Lei inclines his head slightly.", parse);
		Text.NL();
		parse.c = party.Num() === 2 ? " and " + party.Get(1).name :
			party.Num() > 2 ? " gather your companions, and" : "";
		Text.Add("Sighing in resignation, you[c] head out to the east.", parse);
		Text.NL();
		if (party.InParty(miranda)) {
			Text.Add("Miranda glares in your direction as you walk. <i>“So it was that Lei asshole, then? <b>Please</b> let me arrest him?”</i>", parse);
			Text.NL();
			Text.Add("You tell her that as interesting as that idea sounds, it would probably be best not to try.", parse);
			Text.NL();
		}
		if (party.InParty(kiakai)) {
			parse.name = kiakai.name;
			Text.Add("<i>“The Lady blessed that man with such strength,”</i> [name] says, <i>“I only wish that he had put it to better use.”</i>", parse);
			Text.NL();
			Text.Add("You shrug. Convincing him to use [name]’s definition of “better” would probably be a greater challenge than besting him.", parse);
			Text.NL();
		}
		Text.Add("After a few minutes walking, you hear raised angry voices in the distance, signaling the arrival of the patrol.", parse);
		Text.Flush();

		TimeStep({hour: 1});

		Gui.NextPrompt();
	}

}
