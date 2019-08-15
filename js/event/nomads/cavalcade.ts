/*
 * Specifics for Cavalcade game with Rosalin, Estevan and Cale
 */
import { GetDEBUG } from "../../../app";
import { Gender } from "../../body/gender";
import { RaceScore } from "../../body/race";
import { Cavalcade } from "../../cavalcade";
import { EncounterTable } from "../../encountertable";
import { GAME, TimeStep } from "../../GAME";
import { GameState, SetGameState } from "../../gamestate";
import { Gui } from "../../gui";
import { Input } from "../../input";
import { StrapOnItems } from "../../items/strapon";
import { Party } from "../../party";
import { Text } from "../../text";
import { CaleSexScenes } from "./cale-sex";
import { EstevanFlags } from "./estevan-flags";

const NCavalcadeScenes: any = {};

NCavalcadeScenes.Bet = () => {
	return 5;
};

NCavalcadeScenes.Enabled = () => {
	const rosalin = GAME().rosalin;
	const cale = GAME().cale;
	const estevan = GAME().estevan;
	return cale.IsAtLocation() &&
	       estevan.flags.Met !== 0 &&
	       estevan.IsAtLocation() &&
	       rosalin.IsAtLocation();
};

NCavalcadeScenes.RegularGame = () => {
	const player = GAME().player;
	const party: Party = GAME().party;
	const rosalin = GAME().rosalin;
	const estevan = GAME().estevan;
	const parse: any = {
		playername : player.name,
		hisher     : rosalin.hisher(),
	};

	if (estevan.flags.cav === 0) {
		estevan.flags.cav = 1;
		Text.Add("<i>“Alright, I’m gonna assume this is the first time you are playing this game, [playername],”</i> Estevan says as he pulls out a deck of old cards. He expertly shuffles and flares the deck, showing you the cards. <i>“There are fifteen cards split up into three different suits; Light, Darkness and Shadow.”</i>", parse);
		Text.NL();
		Text.Add("You see that each card has a small picture on it, and a color that indicates its suit. In the corner, you see a number on each card, and you ask the satyr what it means. <i>“Just in case you are like Wolfie and have a hard time keeping track of all the cards and how many points your hand is worth, you can use these numbers,”</i> he explains. <i>“The best card of each suit is number one, going down to number five in decreasing value.”</i> Cale growls at the cheap jab, but lets the satyr continue his explanation of the game.", parse);
		Text.NL();
		Text.Add("<i>“You get two cards in your hand. I then place three cards face down, like this,”</i> he explains, handing out two cards to you, Rosalin and Cale each, and placing another three in front of him. <i>“You each place your bets - we usually play for small coins, more for the enjoyment of the game really - and you either call, raise or fold. Each turn of betting, I reveal another card of the house hand.”</i> Saying so, he flips the hidden cards one by one.", parse);
		Text.NL();
		Text.Add("You glance at your hand; one of your cards has the number one on it, and depicts a beautiful lady with blonde hair, wearing a crown and a blue gown - possibly a depiction of Lady Aria. The other one has the number four, and depicts a stag.", parse);
		Text.NL();
		Text.Add("The cards on the ground show a sultry lady with lilac hair and impressive assets, a maiden in white and a strange creature made out of pure energy. <i>“The Harlot of Darkness, D5. The Maiden of Light, L5. The Avatar of Shadow, S1.”</i> For some reason, the last card gives you an unsettling feeling.", parse);
		Text.NL();
		Text.Add("<i>“The name of the game is to have the best hand, and make the most out of it. It’s a game of bluffing, really, but for now lets see your hands so I can explain the scoring.”</i>", parse);
		Text.NL();
		Text.Add("Rosalin and Cale show their cards - Rosalin has three of Shadow (an old man) and two of Light (a knight of some sort), Cale’s got one of Darkness (a red haired queen) and four of Light (a white horse).", parse);
		Text.NL();
		Text.Add("<i>“Rosie’s got nothing of value, so [hisher] hand defaults to the pair of five in the house deck. Not likely to win you anything, as it’s the worst possible hand you can get. Wolfie has more luck, since his Queen of Darkness gives him two pairs.”</i>", parse);
		Text.NL();
		Text.Add("You look at your hand again. If you understand the rules correctly, you have exactly the same hand. <i>“Correct, you both have two pairs of one and five, and a four. Usually, this’d be a draw, but you have a special card, [playername]. The four of Shadow - the Shadow Stag - works as a wildcard. It can morph and take on the shape of any card, in almost all cases giving you a huge advantage.”</i> Estevan puts your cards next to the house hand.", parse);
		Text.NL();
		Text.Add("<i>“In this case, you’d get a threekind of one and the pair of five, giving you a full house and winning you the game.”</i>", parse);
		Text.NL();
		Text.Add("<i>“The scoring is as follows: least is the pair, after that comes two pairs, then threekind, followed by the mixed Cavalcade. That last one is when you have the cards one through five of any suits. Then comes full house - your hand - followed by a mixed flush. This is when you have four cards of the same suit. Next is fourkind - a hand only possibly with the stag - and lastly full Cavalcade, which is when you have all the cards of one suit.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Finally, a hand with the stag is not necessarily a win. If I have a hand that evaluates to a threekind, and you have a pair plus the stag, I will win the hand even if your threekind happens to be better than mine. The Shadow Stag can take on many forms, but is thus weaker than a pure hand.”</i>", parse);
		Text.NL();
		Text.Add("<i>“That’s about it for the rules. The game itself is pretty simple, you just got to be able to quickly evaluate your hand and figure out if it’s worth betting on. Everyone ready?”</i> You all nod.", parse);
	} else {
		Text.Add("<i>“Sure, I’m up for it!”</i> Cale rubs his hands together eagerly. Rosalin nods, settling down beside you on the log. Estevan pulls out the deck, shuffling it a few times.", parse);
	}
	Text.NL();

	// TODO: Other triggers?
	if (estevan.flags.Cheat >= EstevanFlags.Cheat.Talked) {
		Text.Add("<i>“So, what are the stakes?”</i> the satyr asks innocently.", parse);
		Text.Flush();

		// [Coin game][Sexy game]
		const options = new Array();
		options.push({ nameStr : "Coin game",
			func() {
				Text.Clear();
				NCavalcadeScenes.PrepCoinGame();
			}, enabled : party.coin >= NCavalcadeScenes.Bet(),
			tooltip : "Play for coins.",
		});
		options.push({ nameStr : "Sexy game",
			func() {
				Text.Clear();
				NCavalcadeScenes.PrepSexyGame();
			}, enabled : true,
			tooltip : "Play for sex.",
		});
		Gui.SetButtonsFromList(options, false, null);
	} else {
		Text.Add("<i>“Here we go then!”</i> the satyr says as he starts dealing out cards.", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();
			NCavalcadeScenes.PrepCoinGame();
		});
	}
};

NCavalcadeScenes.PrepCoinGame = () => {
	const player = GAME().player;
	const party: Party = GAME().party;
	const rosalin = GAME().rosalin;
	const cale = GAME().cale;
	const estevan = GAME().estevan;
	const onEnd = () => {
		const parse: any = {
			playername : player.name,
		};

		SetGameState(GameState.Event, Gui);

		TimeStep({minute: 5});

		Text.NL();
		if (NCavalcadeScenes.Enabled()) {
			Text.Add("<i>“Do you want to go for another game, [playername]?”</i> the satyr asks, shuffling the deck.", parse);
			Text.Flush();

			// [Sure][Nah]
			const options = new Array();
			options.push({ nameStr : "Sure",
				func() {
					Text.NL();
					NCavalcadeScenes.PrepCoinGame();
				}, enabled : party.coin >= NCavalcadeScenes.Bet(),
				tooltip : "Deal another round!",
			});
			options.push({ nameStr : "Nah",
				func() {
					Text.Clear();
					Text.Add("<i>“Alright, see you around!”</i> Your group disperses, each person going about their own business.", parse);
					Text.Flush();

					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "Nah, this is enough Cavalcade for now.",
			});
			Gui.SetButtonsFromList(options, false, null);
		} else {
			Text.Add("<i>“It’s getting late, I need to get some sleep if I’m gonna be on time to check my traps tomorrow morning,”</i> Estevan yawns, gathering up the cards. <i>“If you want another game later, just holler.”</i>", parse);
			Text.Flush();

			Gui.NextPrompt();
		}
	};

	player.purse  = party;
	estevan.purse = { coin: 100 };
	cale.purse    = { coin: 100 };
	rosalin.purse = { coin: 100 };

	const players = [player, estevan, rosalin, cale];
	const g = new Cavalcade(players, {bet    : NCavalcadeScenes.Bet(),
		                            onPost : onEnd});
	g.PrepGame();
	g.NextRound();
};

NCavalcadeScenes.PlayersLeft = (players: any[]) => {
	let num = 0;
	for (const p of players) {
		if (!p.out) {
			num++;
		}
	}
	return num;
};

NCavalcadeScenes.PrepSexyGame = () => {
	const player = GAME().player;
	const rosalin = GAME().rosalin;
	const cale = GAME().cale;
	const estevan = GAME().estevan;
	const token = 50;

	const parse: any = {
		playername : player.name,
		coin : Text.NumToText(token),
	};

	player.purse  = { coin: token };
	estevan.purse = { coin: token };
	cale.purse    = { coin: token };
	rosalin.purse = { coin: token };

	const players = [player, estevan, rosalin, cale];

	const onEnd = () => {
		Text.NL();
		TimeStep({minute: 5});

		const onLoss = () => {
			if (NCavalcadeScenes.PlayersLeft(players) <= 1) {
				onEnd();
			} else {
				Text.Add("The satyr starts dealing out cards to the remaining players.", parse);
				Text.NL();

				let name;
				const scenes = new EncounterTable();
				scenes.AddEnc(() => {
					name = estevan.name;
					cale.out    = true;
					rosalin.out = true;
				}, estevan.purse.coin * 1.2, () => !estevan.out);
				scenes.AddEnc(() => {
					name = rosalin.name;
					cale.out    = true;
					estevan.out = true;
				}, rosalin.purse.coin * 1.1, () => !rosalin.out);
				scenes.AddEnc(() => {
					name = cale.name;
					estevan.out = true;
					rosalin.out = true;
				}, cale.purse.coin, () => !cale.out);
				scenes.Get();

				parse.name = name;
				TimeStep({minute: 15});
				Text.Add("The game goes on for a while longer, eventually ending up with [name] as the winner.", parse);

				onEnd();
			}
		};

		for (const p of players) {
			if (p.out) { continue; }

			// Remove bankrupt players
			if (p.purse.coin <= 0) {
				if (p === player) {
					Text.Add("Looks like you lose this game, as you’re out of tokens.", parse);
					Text.NL();
					Text.Add("<i>“Better luck next time!”</i> Cale says, giving you a cocky grin.", parse);
				} else if (p === estevan) {
					Text.Add("<i>“Well, looks like that’s it for me,”</i> Estevan says, shrugging.", parse);
				} else if (p === rosalin) {
					Text.Add("<i>“Chucks, I’m out of coin-thingies!”</i> Rosalin mutters, pouting.", parse);
				} else if (p === cale) {
					Text.Add("<i>“Fuck!”</i> Cale groans as he realises that he’s out of tokens. <i>“I’ll get you next time!”</i>", parse);
				} else {
					parse.name = p.name;
					Text.Add("THIS IS A BUG. NAME IS: [name]", parse);
				}
				p.out = true;
				Text.NL();
			}
		}

		if (NCavalcadeScenes.PlayersLeft(players) <= 1) {
			let next: any = null;
			if     (!player.out) {  next = NCavalcadeScenes.SexyPlayerWin; } else if (!estevan.out) { next = NCavalcadeScenes.SexyEstevanWin; } else if (!rosalin.out) { next = NCavalcadeScenes.SexyRosalinWin; } else if (!cale.out) {    next = NCavalcadeScenes.SexyCaleWin; } else {
				Text.Add("THIS IS A BUG. WINNER IS BROKEN.", parse);
			}

			Text.Flush();
			Gui.NextPrompt(() => {
				next(false); // TODO CHEAT
			});
		} else if (player.out) {
			onLoss();
		} else {
			Text.Add("<i>“Another round then?”</i> Estevan asks.", parse);
			Text.Flush();
			Gui.ClearButtons();
			Input.buttons[0].Setup("Next", () => {
				Text.Clear();
				const bet = NCavalcadeScenes.Bet() * (5 - NCavalcadeScenes.PlayersLeft(players));
				const g = new Cavalcade(players, {bet,
				                                token  : "token",
				                                onPost : onEnd});
				g.PrepGame(true);
				g.NextRound();
			}, true);
			if (GetDEBUG()) {
				Input.buttons[4].Setup("CHEAT", () => {
					NCavalcadeScenes.SexyPlayerWin(false);
				}, true);
			}
			Input.buttons[8].Setup("Give up", () => {
				player.out = true;
				Text.Clear();
				Text.Add("<i>“Had enough?”</i> Estevan quips. <i>“That counts as an automatic loss, by the way.”</i>", parse);
				Text.NL();

				onLoss();
			}, true);
		}
	};

	if (estevan.flags.cav < 2) {
		Text.Add("<i>“I sure am!”</i> Cale rubs his hands together, eagerly.", parse);
		Text.NL();
		Text.Add("Actually, how about you try something different? Cale raises his eyebrows as you explain the premise of the faux game. <i>“So the winner gets to ask a favor of one of the losers? Sounds interesting.”</i> That’s not all of it. You continue to explain the sexual nature of the favors you had in mind. A slow grin spreads across the wolf’s face.", parse);
		Text.NL();
		Text.Add("<i>“Damn [playername], you got a dirty mind. You up for this, Rosie?”</i> The alchemist nods happily, apparently unperturbed by the nature of the bet.", parse);
		Text.NL();
		estevan.flags.cav = 2;
	}
	Text.Add("<i>“Okay. Well play a set of games using these tokens,”</i> Estevan says, handing out the fake coins, [coin] each. <i>“The starting bet goes up each time someone drops out. Last one standing is the winner, and they get to do whatever they want with any one of the losers.”</i>", parse);
	Text.Flush();

	Gui.NextPrompt(() => {
		Text.Clear();

		const g = new Cavalcade(players, {bet    : NCavalcadeScenes.Bet(),
			                            token  : "token",
		                                onPost : onEnd});
		g.PrepGame();
		g.NextRound();
	});
};

NCavalcadeScenes.CheatGame = () => {
	const player = GAME().player;
	const party: Party = GAME().party;
	const rosalin = GAME().rosalin;
	const cale = GAME().cale;
	const estevan = GAME().estevan;
	const cocksInAss = player.CocksThatFit(cale.Butt());
	const p1cock = player.BiggestCock(cocksInAss);

	const racescore = new RaceScore(rosalin.body);
	const compScore = rosalin.origRaceScore.Compare(racescore);

	const parse: any = {
		playername : player.name,
		racedesc() { return rosalin.raceDesc(compScore); },
		cockDesc() { return p1cock.Short(); },
		cockTip() { return p1cock.TipShort(); },
	};

	estevan.flags.Cheat = EstevanFlags.Cheat.Triggered;
	const virgin = cale.Butt().virgin;

	TimeStep({hour: 1});

	Text.Add("<i>“I sure am!”</i> Cale rubs his hands together, eagerly.", parse);
	Text.NL();
	Text.Add("<i>“Actually, I’ll sit this one out,”</i> Estevan replies, winking at you. <i>“I can deal though.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Scared of being robbed blind, goat-boy?”</i> the wolf mocks the satyr.", parse);
	Text.NL();
	Text.Add("Actually, that won’t be a problem in this game, you hop in. ", parse);

	if (estevan.flags.cav === 1) {
		Text.Add("Cale raises his eyebrows as you explain the premise of the faux game. <i>“So the winner gets to ask a favor of one of the losers? Sounds interesting.”</i> That’s not all of it. You continue to explain the sexual nature of the favors you had in mind. A slow grin spreads across the wolf’s face.", parse);
		Text.NL();
		Text.Add("<i>“Damn [playername], you got a dirty mind. You up for this, Rosie?”</i> The alchemist nods happily, apparently unperturbed by the nature of the bet. ", parse);
		estevan.flags.cav = 2;
	} else {
		Text.Add("This will be a sexy game. Cale’s eyes light up. ", parse);
	}
	Text.Add("<i>“Sure you don’t want to join in goat-boy? I’ll take you for a ride you won’t soon forget,”</i> the wolf quips.", parse);
	Text.NL();
	Text.Add("<i>“I’m sure you’ll do just fine without me,”</i> the satyr glibly replies, carefully shuffling the deck. <i>“Let’s go then, shall we?”</i> He hands out a set of tokens to each player, followed by your starting hand.", parse);
	Text.Flush();

	Gui.NextPrompt(() => {
		Text.Clear();
		Text.Add("You are pretty impressed by the way that Estevan handles the game. He doesn’t deal any obvious cheats, and at times you aren’t even dealt a good enough hand to go on with, forcing you to fold. Still, after a while the trend of the game is clear; Rosalin is losing, with Cale having a slight lead over you. The wolf looks very excited, unaware of Estevan’s mocking grin. For a while, you have a creeping feeling that the satyr is making a joke on <i>you</i> instead, but that changes soon enough.", parse);
		Text.NL();
		Text.Add("By the time that Rosalin has to drop out, the game takes a sharp turn in your favor. Even if he’s starting to notice your sometimes outrageous hands, Cale is still too excited with his former advantage to smell foul play until it’s too late. He growls as you get another full Cavalcade, scratching his head in bewilderment.", parse);
		Text.NL();
		Text.Add("On the final round of the game, the wolf lights up again, finally graced with a good by the spirits. Or so he thinks. <i>“There, full Cavalcade!”</i> he snaps, throwing down his cards defiantly. The house hand is the Lady of Light, the Champion of Light and the Maiden of Light. Together with the Shadow Stag and his Steed of Light, he’s got one of the best hands in the game.", parse);
		Text.NL();
		Text.Add("Smiling, you drop your cards, revealing the Priestess of Light and the Stud of Light, trumping him with a true full Cavalcade. <i>“God DAMNIT!”</i> Cale yells, throwing his hands in the air in frustration. <i>“Fine, you win, you win! And here I thought I would get some quality time with Rosie. Fine, she’s yours.”</i>", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();
			Text.Add("Not so fast. You thoroughly enjoy the wolf’s expression slowly change as you explain exactly what you had in mind. You don’t want Rosalin, you want Cale. And you’ll be the one fucking him. In the butt.", parse);
			Text.NL();

			if (virgin) {
				Text.Add("<i>“Wait- WHAT?!”</i> Cale looks around him bewildered. <i>“B-but...”</i> No buts. Just his butt.", parse);
				if (player.Gender() === Gender.female || cocksInAss.length === 0) {
					if (player.Gender() === Gender.female) {
						Text.Add(" <i>“B-but you don’t even have a… you know...”</i> he falters.", parse);
					} else {
						Text.Add(" <i>“B-but that… thing is <b>way</b> too big! It won’t fit!”</i> he stammers.", parse);
					}
					Text.NL();
					if (p1cock) {
						Text.Add("Oh, you have that covered. Without skipping a beat, you pull out your trusty [cockDesc].", parse);
					} else {
						Text.Add("<i>“Oh, I know! You can have one of mine!”</i> Rosalin quips in to the frustration of the wolf. The [racedesc] scurries away, returning with an immense canine dildo, complete with a knot. <i>“I know you’ll like it, wuffie!”</i> the alchemist exclaims, handing you the toy.", parse);
						const inv = party.inventory;
						if (player.strapOn) { inv.AddItem(player.strapOn); }
						player.strapOn = StrapOnItems.CanidStrapon;
						player.Equip();
					}
					Text.NL();
					Text.Add("Grinning, you fasten the straps of the artificial cock, securing them for the rough fucking you are about to dish out.", parse);
				}
				Text.NL();
				Text.Add("<i>“N-now hold on just a minute,”</i> the wolf stammers, a wild look in his eyes.", parse);
				Text.NL();
				Text.Add("<i>“Surely you aren’t about to go back on your word, are you?”</i> Estevan purrs, wearing the biggest shit-eating grin you’ve ever seen.", parse);
				Text.NL();
				Text.Add("<i>“We <b>did</b> decide that the winner could do anything they wanted to the loser, so you don’t really have a say in it, do you?”</i> Rosalin adds.", parse);
				Text.NL();
				Text.Add("Cale swirls back and forth between each one of you, but you’re not going to have him wiggle his way out of this one. Especially since you have to keep his attention away from your last hand…", parse);
				Text.NL();
				Text.Add("Finally, a defeated Wolfie lowers his head, muttering something about the world not being fair. Tough luck. Well, not exactly luck, but still.", parse);
				Text.NL();
				Text.Add("<i>“Fine, let’s get this over with,”</i> he sighs. Grinning, you tell him to turn around and bend over the log. <i>“What, here?”</i> he protests, but lowers his head as you sternly remind him about the rules again. <i>“Okay, okay, just be gentle- WILL YOU STOP LAUGHING?”</i> the wolf exclaims, his raw nerves chafing at Estevan’s roaring laughter. It takes a bit of further coaxing, but you finally have Cale propped up over the log, butt sticking up in the air.", parse);
			} else if (cale.Slut() < 30) {
				Text.Add("<i>“What? Here?”</i> Cale looks around him furtively, wincing at Estevan. Come on, it’s not like he’s got anything to hide, is there? <i>“I… I suppose not,”</i> he mumbles, scratching his head.", parse);
				if (player.Gender() === Gender.female || cocksInAss.length === 0) {
					if (player.Gender() === Gender.female) {
						Text.Add(" <i>“Do you even have, you know...”</i> he falters, looking curious.", parse);
					} else {
						Text.Add(" <i>“N-no way that will fit,”</i> he says, eyeing your bulge nervously.", parse);
					}
					Text.NL();
					if (p1cock) {
						Text.Add("Oh, you have that covered. Without skipping a beat, you pull out your trusty [cockDesc].", parse);
					} else {
						Text.Add("<i>“Oh, I know! You can have one of mine!”</i> Rosalin quips in. The [racedesc] scurries away, returning with an immense canine dildo, complete with a knot. <i>“I know you’ll like it, wuffie!”</i> the alchemist exclaims, handing you the toy. Cale blanches a bit at the sight of it.", parse);
						const inv = party.inventory;
						if (player.strapOn) { inv.AddItem(player.strapOn); }
						player.strapOn = StrapOnItems.CanidStrapon;
						player.Equip();
					}
					Text.NL();
					Text.Add("Grinning, you fasten the straps of the artificial cock, securing them for the rough fucking you are about to dish out.", parse);
				}
				Text.NL();
				Text.Add("<i>“I just want to say I’m still not very comfortable with this, but a bet is a bet,”</i> the wolf states. <i>“Alright, let’s get this over with,”</i> he sighs, meekly obeying your command to bend over the log.", parse);
			} else {
				Text.Add("<i>“So that’s what this is about,”</i> Cale chuckles. <i>“Why didn’t you just say you wanted to tap my ass again?”</i>", parse);
				Text.NL();
				Text.Add("This way was more fun, plus it adds another exciting level to Cavalcade.", parse);
				Text.NL();
				Text.Add("<i>“Guess that’s true,”</i> the wolf agrees. <i>“How do you want me?”</i> You tell him to turn around and bend over. Cale eagerly jumps to obey you, his tail wagging excitedly.", parse);
				if (player.Gender() === Gender.female || cocksInAss.length === 0) {
					if (player.Gender() === Gender.female) {
						Text.Add(" <i>“Do you have a nice big cock for me?”</i> he wonders, sounding pretty eager.", parse);
					} else {
						Text.Add(" <i>“I… ah, sorry, but I don’t think my ass is quite <b>that</b> flexible yet,”</i> he says, regretfully eyeing your bulge.", parse);
					}
					Text.NL();
					if (p1cock) {
						Text.Add("Oh, you have that covered. Without skipping a beat, you pull out your trusty [cockDesc].", parse);
					} else {
						Text.Add("<i>“Oh, I know! You can have one of mine!”</i> Rosalin quips in. The [racedesc] scurries away, returning with an immense canine dildo, complete with a knot. <i>“I know you’ll like it, wuffie!”</i> the alchemist exclaims, handing you the toy.", parse);
						Text.NL();
						Text.Add("<i>“Thanks, Rosie!”</i> the wolf yips cheerfully.", parse);
						const inv = party.inventory;
						if (player.strapOn) { inv.AddItem(player.strapOn); }
						player.strapOn = StrapOnItems.CanidStrapon;
						player.Equip();
					}
					Text.NL();
					Text.Add("Grinning, you fasten the straps of the artificial cock, securing them for the rough fucking you are about to dish out.", parse);
				}
				Text.NL();
				Text.Add("<i>“And here I was wanting to take Wolfie down a peg or two, only to find he’s already a total slut,”</i> Estevan mutters, throwing his hands in the air.", parse);
				Text.NL();
				Text.Add("<i>“No one can resist the Cale, you know it goat-boy!”</i> Cale quips mockingly over his shoulder, shaking his ass at you enticingly.", parse);
			}

			Text.NL();
			parse.uncertainly = cale.Slut() >= 60 ? "eagerly" : "uncertainly";
			Text.Add("Not wasting any time, you pull down his pants, baring his round butt and tight rosebud. The wolf raises his tail [uncertainly], allowing you full access.", parse);
			Text.NL();

			CaleSexScenes.SexFuckHim(true, {cavalcade: true, cheat: true});
		});
	});
};

NCavalcadeScenes.SexyPlayerWin = (cheat: boolean) => {
	const player = GAME().player;
	const cale = GAME().cale;
	const parse: any = {
		playername : player.name,
	};

	SetGameState(GameState.Event, Gui);

	Text.Clear();
	Text.Add("<i>“Well played, [playername]!”</i> Estevan congratulates you.", parse);
	Text.NL();
	Text.Add("<i>“Almost had you for a while there,”</i> Cale grumbles.", parse);
	Text.NL();
	Text.Add("<i>“So, what are you going to do for your reward?”</i> Rosalin asks curiously.", parse);
	Text.Flush();

	const caleCockInAss = player.CocksThatFit(cale.Butt());

	// [Fuck Cale][Nothing]
	const options = new Array();
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
	if (caleCockInAss.length > 0) {
		options.push({ nameStr : "Fuck Cale",
			func() {
				const virgin = cale.Butt().virgin;

				cale.flags.cLoss++;

				Text.Clear();
				if (virgin) {
					Text.Add("<i>“Wait- WHAT?!”</i> Cale looks around him bewildered. <i>“B-but...”</i> No buts. Just his butt.", parse);
					Text.NL();
					Text.Add("<i>“N-now hold on just a minute,”</i> the wolf stammers, a wild look in his eyes.", parse);
					Text.NL();
					Text.Add("<i>“Surely you aren’t about to go back on your word, are you?”</i> Estevan purrs, wearing the biggest shit-eating grin you’ve ever seen.", parse);
					Text.NL();
					Text.Add("<i>“We <b>did</b> decide that the winner could do anything they wanted to the loser, so you don’t really have a say in it, do you?”</i> Rosalin adds.", parse);
					Text.NL();
					Text.Add("Cale swirls back and forth between each one of you, but you’re not going to have him wiggle his way out of this one. Finally, a defeated Wolfie lowers his head, muttering something about the world not being fair. Tough luck.", parse);
					Text.NL();
					Text.Add("<i>“Fine, let’s get this over with,”</i> he sighs. Grinning, you tell him to turn around and bend over the log. <i>“What, here?”</i> he protests, but lowers his head as you sternly remind him about the rules again. <i>“Okay, okay, just be gentle- WILL YOU STOP LAUGHING?”</i> the wolf exclaims, his raw nerves chafing at Estevan’s roaring laughter. It takes a bit of further coaxing, but you finally have Cale propped up over the log, butt sticking up in the air.", parse);
				} else if (cale.Slut() < 30) {
					Text.Add("<i>“What? Here?”</i> Cale looks around him furtively, wincing at Estevan. Come on, it’s not like he’s got anything to hide, is there? <i>“I… I suppose not,”</i> he mumbles, scratching his head.", parse);
					Text.NL();
					Text.Add("<i>“I just want to say I’m still not very comfortable with this, but a bet is a bet,”</i> the wolf states. <i>“Alright, let’s get this over with,”</i> he sighs, meekly obeying your command to bend over the log.", parse);
				} else {
					Text.Add("<i>“So that’s what this is about,”</i> Cale chuckles. <i>“Why didn’t you just say you wanted to tap my ass again?”</i>", parse);
					Text.NL();
					Text.Add("This way was more fun, plus it adds another exciting level to Cavalcade.", parse);
					Text.NL();
					Text.Add("<i>“Guess that’s true,”</i> the wolf agrees. <i>“How do you want me?”</i> You tell him to turn around and bend over. Cale eagerly jumps to obey you, his tail wagging excitedly.", parse);
				}
				Text.NL();
				parse.tight       = cale.Slut() >= 60 ? "pliant" : "tight";
				parse.uncertainly = cale.Slut() >= 30 ? "eagerly" : "uncertainly";
				Text.Add("Not wasting any time, you pull down his pants, baring his round butt and [tight] rosebud. The wolf raises his tail [uncertainly], allowing you full access.", parse);
				Text.NL();

				CaleSexScenes.SexFuckHim(true, {cavalcade : true, cheat});
			}, enabled : true,
			tooltip : "Bend the wolf over and make him your bitch.",
		});
	}
	options.push({ nameStr : "Nothing",
		func() {
			Text.Clear();
			Text.Add("<i>“How noble of you, but don’t think it’ll let you off the hook if I win next time,”</i> Estevan quips.", parse);
			Text.NL();
			Text.Add("<i>“Aww, well, see you later!”</i> Rosalin pouts.", parse);
			Text.NL();
			if (cale.Slut() >= 60) {
				Text.Add("<i>“Sure you don’t want to take the wolf for a ride?”</i> Cale teases, nudging you in the side playfully. <i>“Here I was, hoping to get some action!”</i>", parse);
			} else {
				Text.Add("<i>“Alright, I’ll get you next time though, [playername]!”</i> Cale challenges you, nudging you in the side playfully.", parse);
			}
			Text.NL();
			Text.Add("Your group disperses, each person going about their own business.", parse);
			Text.Flush();

			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You are feeling generous for now, let them off the hook.",
	});
	Gui.SetButtonsFromList(options, false, null);
};

// TODO
NCavalcadeScenes.SexyEstevanWin = (cheat: boolean) => {
	const parse: any = {

	};

	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	Gui.NextPrompt();
};

// TODO
NCavalcadeScenes.SexyCaleWin = (cheat: boolean) => {
	const parse: any = {

	};

	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	Gui.NextPrompt();
};

// TODO
NCavalcadeScenes.SexyRosalinWin = (cheat: boolean) => {
	const parse: any = {

	};

	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	Gui.NextPrompt();
};

export { NCavalcadeScenes };
