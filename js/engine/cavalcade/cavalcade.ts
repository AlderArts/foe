import * as _ from "lodash";

import { GetDEBUG } from "../../../app";
import { Gui } from "../../gui/gui";
import { Input } from "../../gui/input";
import { Rand } from "../../utility";
import { GAME, SetCavalcade } from "../GAME";
import { GameState, SetGameState } from "../gamestate";
import { Party } from "../navigation/party";
import { IParse, Text } from "../parser/text";
import { CardItem, CardItems, CardSuit } from "./cards";
import { ICavalcadePlayer, ICavalcadeResult } from "./cavalcade-player";

enum CScore {
	Cavalcade = 0,
	Fourkind  = 1,
	Flush     = 2,
	FullHouse = 3,
	Mixed     = 4,
	Threekind = 5,
	TwoPair   = 6,
	Pair      = 7,
}

export interface ICavalcadeOpts {
	stag?: CardItem;
	NextRound?: () => void;
	onPost?: () => void;
	token?: string;
	bet?: number;
}

interface ICavalcadeScore {
	num: number;
	val?: number;
	suit?: CardSuit;
}

/*
 * The card game Cavalcade
 */
export class Cavalcade {

	static get Score() { return CScore; }
	public static CardCountSorter(a: ICavalcadeScore, b: ICavalcadeScore) {
		if (a.num === b.num) { return (a.val < b.val) ? -1 : 1; } else { return (a.num > b.num) ? -1 : 1; }
	}

	// Return -1 for handA, 1 for handB, 0 for draw
	public static EvaluateWinnerSorter(playerA: ICavalcadePlayer, playerB: ICavalcadePlayer) {
		if (!playerA.res && !playerB.res) { return 0; } else if (!playerA.res) { return 1; } else if (!playerB.res) { return -1; }
		// Clear winner
		if (playerA.res.score !== playerB.res.score) {
			return playerA.res.score < playerB.res.score ? -1 : 1;
		}

		// If same, the one with the stag loses
		if (playerA.res.stag !== playerB.res.stag) {
			return playerA.res.stag ? 1 : -1;
		}

		if (playerA.res.score === Cavalcade.Score.Mixed) {
			return 0;
		}

		// Else, pick the high val
		if (playerA.res.high !== playerB.res.high) {
			return playerA.res.high < playerB.res.high ? -1 : 1;
		}

		// Else, pick the low val
		if (playerA.res.low !== playerB.res.low) {
			return playerA.res.low < playerB.res.low ? -1 : 1;
		}

		// Dunno
		return 0;
	}
	public Deck: CardItem[];
	public players: ICavalcadePlayer[];
	public stag: CardItem;
	public NextRound: () => void;
	public onPost: () => void;
	public token: string;
	public round: number;
	public bet: number;
	public pot: number;
	public house: CardItem[];

	public winner: ICavalcadePlayer;
	public winners: ICavalcadePlayer[];

	constructor(players: ICavalcadePlayer[], opts?: ICavalcadeOpts) {
		opts = opts || {};

		this.Deck = [];
		for (let i = 0; i < 5; i++) {
			this.Deck.push(CardItems.Light[i]);
		}
		for (let i = 0; i < 5; i++) {
			this.Deck.push(CardItems.Darkness[i]);
		}
		for (let i = 0; i < 5; i++) {
			this.Deck.push(CardItems.Shadow[i]);
		}

		this.players   = players;
		this.stag      = opts.stag      || CardItems.Shadow[3];
		this.NextRound = opts.NextRound || this.CoinGameRound;
		this.onPost    = opts.onPost    || Gui.NextPrompt;

		this.token     = opts.token || "coin";

		// 0=start, 1=1 card (first bet), 2=2 card, 3=3 card (final bet)
		this.round = 0;
		// Increasing bet
		this.bet = opts.bet || 0;
		// Currently in pot
		this.pot = 0;
	}

	public PullCard() {
		const cIdx = Rand(this.Deck.length);
		const card = this.Deck[cIdx];
		this.Deck.splice(cIdx, 1);
		return card;
	}

	public PrepGame(keepOut?: boolean) {
		SetGameState(GameState.Cavalcade, Gui);

		_.each(this.players, (p) => {
			if (!keepOut) {
				p.out = false;
			}

			p.hand = [];
			if (p.out) {
				p.folded = true;
			} else {
				p.hand.push(this.PullCard());
				p.hand.push(this.PullCard());
				p.folded = false;
			}
			p.res = undefined;
		});
		this.house = [];
		this.house.push(this.PullCard());
		this.house.push(this.PullCard());
		this.house.push(this.PullCard());

		SetCavalcade(this);
	}

	public Finish() {
		_.each(this.players, (p) => {
			if (p.folded) { return; }
			_.each(this.house, (h) => {
				p.hand.push(h);
			});
			// TODO: TEMP
			Text.Add("[Poss] hand:<br>", {Poss: p.Possessive()});
			_.each(p.hand, (h: CardItem, key: number) => {
				if (key > 0) {
					Text.Add(", ");
				}
				if (h === this.stag) {
					Text.Add(h.name + " (*)", undefined, "bold");
				} else {
					Text.Add(h.name);
				}
			});
			Text.Add("<br>");
		});
		Text.Flush();
	}

	// Hand is a collection of five cards
	public EvaluateHand(hand: CardItem[]): ICavalcadeResult {
		if (!hand || hand.length !== 5) { return; }
		// Evaluate cards from best to worst hand

		// stag
		let hasStag = false;
		for (let i = 0; i < 5; i++) {
			if (hand[i] === this.stag) {
				hasStag = true;
				break;
			}
		}

		// Count similar cards, ignore stag
		const counts: ICavalcadeScore[] = [];
		for (let i = 0; i < 5; i++) {
			if (hand[i] === this.stag) {
				continue;
			}

			const cardVal = hand[i].val;
			let foundVal = false;
			for (const count of counts) {
				if (cardVal === count.val) {
					count.num++;
					foundVal = true;
					break;
				}
			}
			if (!foundVal) {
				counts.push({num: 1, val: cardVal});
			}
		}
		counts.sort(Cavalcade.CardCountSorter);

		// Count cards of the same suit, ignore stag
		const suits: ICavalcadeScore[] = [];
		for (let i = 0; i < 5; i++) {
			if (hand[i] === this.stag) {
				continue;
			}

			const cardSuit = hand[i].suit;
			let foundSuit = false;
			for (const suit of suits) {
				if (cardSuit === suit.suit) {
					suit.num++;
					foundSuit = true;
					break;
				}
			}
			if (!foundSuit) {
				suits.push({num: 1, suit: cardSuit});
			}
		}
		suits.sort(Cavalcade.CardCountSorter);

		// Add stag to num
		if (hasStag) {
			counts[0].num++;
			suits[0].num++;
		}

		// Full cavalcade
		if (suits[0].num === 5) {
			return {score: Cavalcade.Score.Cavalcade, suit: suits[0].suit, stag: (suits[0].suit !== this.stag.suit) ? hasStag : false};
		}

		// Four of a kind
		if (counts[0].num === 4) {
			return {score: Cavalcade.Score.Fourkind, high: counts[0].val, stag: hasStag};
		}

		// Partial flush
		if (suits[0].num === 4) {
			return {score: Cavalcade.Score.Flush, suit: suits[0].suit, stag: (suits[0].suit !== this.stag.suit) ? hasStag : false};
		}

		// Full house
		if (counts[0].num === 3 && counts[1].num === 2) {
			return {score: Cavalcade.Score.FullHouse, high: counts[0].val, low: counts[1].val, stag: hasStag};
		}

		// Mixed Cavalcade
		if (counts.length === 5 || (counts.length === 4 && hasStag)) {
			return {score: Cavalcade.Score.Mixed, stag: hasStag};
		}

		// Threekind
		if (counts[0].num === 3) {
			return {score: Cavalcade.Score.Threekind, stag: hasStag, high: counts[0].val };
		}

		// Two pairs
		if (counts[0].num === 2 && counts[1].num === 2) {
			return {score: Cavalcade.Score.TwoPair, high: counts[0].val, low: counts[1].val, stag: hasStag};
		}

		// Pair
		if (counts[0].num === 2) {
			return {score: Cavalcade.Score.Pair, high: counts[0].val, stag: hasStag};
		}
	}

	public SuitStr(suit: CardSuit) {
		switch (suit) {
			case CardSuit.Light: return "Light";
			case CardSuit.Darkness: return "Darkness";
			case CardSuit.Shadow: return "Shadow";
		}
	}

	public ResultStr(res: ICavalcadeResult) {
		let str;
		switch (res.score) {
			case Cavalcade.Score.Cavalcade: str = "Full Cavalcade of " + this.SuitStr(res.suit); break;
			case Cavalcade.Score.Fourkind:  str = "Fourkind of " + (res.high + 1); break;
			case Cavalcade.Score.Flush:     str = "Partial flush of " + this.SuitStr(res.suit); break;
			case Cavalcade.Score.FullHouse: str = "Full house of " + (res.high + 1) + " and " + (res.low + 1); break;
			case Cavalcade.Score.Mixed:     str = "Mixed Cavalcade"; break;
			case Cavalcade.Score.Threekind: str = "Threekind of " + (res.high + 1); break;
			case Cavalcade.Score.TwoPair:   str = "Two pairs of " + (res.high + 1) + " and " + (res.low + 1); break;
			case Cavalcade.Score.Pair:      str = "Pair of " + (res.high + 1); break;
			default: str = "silch";
		}
		if (res.stag) {
			str += " (Stag)";
		}
		return str;
	}

	// Rounds of betting, reveal of house cards
	// If the Stag is revealed in the house hand, replace it with a new card
	public CoinGameRound() {
		const party: Party = GAME().party;
		const parse: IParse = {
			token : this.token,
			bet : () => this.bet.toString(),
			pot : () => this.pot.toString(),
		};

		Gui.ClearButtons();

		// [Sure][Nah]
		//const options: IChoice[] = [];

		switch (this.round) {
		case 0:
			_.each(this.players, (p) => {
				if (p.folded) { return; }
				p.purse.coin -= this.bet;
				this.pot += this.bet;
			});
			if (!GAME().player.out) {
				Text.Add("You put [bet] [token]s in the pot. The dealer gives you two cards.", parse);
				Text.NL();
			}
			Text.Add("There are [pot] [token]s in the pot.", parse, "bold");
			Text.NL();
			// falls through intentionally
		case 1:
		case 2:
		case 3: {
			if (GAME().player.out) {
				Text.Add("You are no longer in the game.");
			} else if (GAME().player.folded) {
				Text.Add("You have folded.");
			} else {
				Text.Add("Your cards are ");
				let card = GAME().player.hand[0];
				if (card === this.stag) {
					Text.Add(card.name + " (*)", undefined, "bold");
				} else {
					Text.Add(card.name);
				}
				Text.Add(", ");
				card = GAME().player.hand[1];
				if (card === this.stag) {
					Text.Add(card.name + " (*)", undefined, "bold");
				} else {
					Text.Add(card.name);
				}
				Text.Add(".");
			}
			Text.NL();
			if (this.round > 0) {
				Text.Add("The dealer reveals a house card.");
				Text.NL();
			}

			if (this.house[this.round - 1] === this.stag) {
				Text.Add("The revealed card is [stag]!", {stag: this.stag.name});
				Text.NL();
				Text.Add("The card is discarded, and the dealer pulls another one from the deck.");
				this.house[this.round - 1] = this.PullCard();
				Text.Flush();
				Gui.NextPrompt(() => {
					Text.Clear();
					this.NextRound();
				});
				return;
			}

			Text.Add("The house hand is: ");
			let i;
			for (i = 0; i < this.round; i++) {
				const card = this.house[i];
				Text.Add(card.name);
				if (i < 2) { Text.Add(", "); }
			}
			for (; i < 3; i++) {
				const card = this.house[i];
				if (GetDEBUG()) {
					Text.Add(card.name);
				}
				Text.Add("(hidden)");
				if (i < 2) { Text.Add(", "); }
			}
			Text.Add(".");

			Text.NL();
			Text.Add("There are [pot] [token]s in the pot.", parse, "bold");

			if (GAME().player.folded) {
				Input.buttons[0].Setup("Next", () => {
					Text.Clear();
					this.NextRound();
				}, true);
			} else {
				// TODO: Opponent AI
				Input.buttons[0].Setup("Call", () => {
					Text.Clear();
					Text.Add("You call.");
					Text.NL();
					this.NextRound();
				}, true);
				Input.buttons[4].Setup("Raise", () => {
					Text.Clear();
					Text.Add("You raise the bet.");
					Text.NL();
					_.each(this.players, (p) => {
						if (p.folded) { return; }
						p.purse.coin -= Math.min(this.bet, p.purse.coin);
						this.pot += this.bet;
					});
					this.NextRound();
				}, this.players[0].purse.coin >= this.bet); // TODO
				Input.buttons[8].Setup("Fold", () => {
					Text.Clear();
					Text.Add("You fold.");
					Text.NL();
					GAME().player.folded = true;
					this.NextRound();
				}, true);
			}
			break;
		}

		default: {
			this.Finish();

			Text.NL();

			this.winners = [];
			_.each(this.players, (p) => {
				if (p.folded) { return; }
				this.winners.push(p);
			});

			_.each(this.winners, (w) => {
				Text.Add(`HAND EVALUATION (${w.name}):<br>`);
				w.res = this.EvaluateHand(w.hand);
				const result = this.ResultStr(w.res);
				Text.Add(`Hand evaluated as: ${result}`);
				Text.NL();
			});

			this.winners.sort(Cavalcade.EvaluateWinnerSorter);

			const winner = this.winners[0];
			let idx = 1;
			// Check how many are in a draw position
			for (; idx < this.winners.length; idx++) {
				if (Cavalcade.EvaluateWinnerSorter(winner, this.winners[idx]) !== 0) { break; }
			}
			// Remove none-draw
			this.winners = this.winners.slice(0, idx);
			// Multiple winners
			if (this.winners.length > 1) {
				Text.Add("There was a draw! The pot is split between the winners.");
				this.pot = Math.floor(this.pot / this.winners.length);
				_.each(this.winners, (w) => {
					w.purse.coin += this.pot;
					if (party.InParty(w as any)) {
						Text.NL();
						parse.pot = this.pot.toString();
						Text.Add("The party gains [pot] [token]s!", parse);
					}
				});
			} else {
				this.winner = this.winners[0];
				Text.Add("[name] won the round!", {name: this.winner.NameDesc()});
				this.winner.purse.coin += this.pot;
				if (party.InParty(this.winner as any)) {
					Text.NL();
					parse.pot = this.pot.toString();
					Text.Add("The party gains [pot] [token]s!", parse);
				}
			}

			this.onPost();

			break;
		}
		}
		Text.Flush();
		this.round++;
	}

}
