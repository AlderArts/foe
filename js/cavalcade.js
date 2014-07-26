/*
 * The card game Cavalcade
 */
function Cavalcade(players, opts) {
	opts = opts || {};
	
	this.Deck = [];
	for(var i = 0; i < 5; i++)
		this.Deck.push(Items.Cards.Light[i]);
	for(var i = 0; i < 5; i++)
		this.Deck.push(Items.Cards.Darkness[i]);
	for(var i = 0; i < 5; i++)
		this.Deck.push(Items.Cards.Shadow[i]);
	
	this.players   = players;
	this.stag      = opts.stag      || Items.Cards.Shadow[3];
	this.NextRound = opts.NextRound || Cavalcade.prototype.CoinGameRound;
	this.onPost    = opts.onPost    || Gui.NextPrompt;
	
	this.token     = opts.token || "coin";

	// 0=start, 1=1 card (first bet), 2=2 card, 3=3 card (final bet)
	this.round = 0;
	// Increasing bet
	this.bet = opts.bet || 0;
	// Currently in pot
	this.pot = 0;
}

cavalcade = null;

Cavalcade.Score = {
	Cavalcade : 0,
	Fourkind  : 1,
	Flush     : 2,
	FullHouse : 3,
	Mixed     : 4,
	Threekind : 5,
	TwoPair   : 6,
	Pair      : 7
};

Cavalcade.prototype.PullCard = function() {
	var cIdx = Rand(this.Deck.length);
	var card = this.Deck[cIdx];
	this.Deck.remove(cIdx);
	return card;
}

Cavalcade.prototype.PrepGame = function(keepOut) {
	SetGameState(GameState.Cavalcade);
	cavalcade = this;
	
	for(var i = 0; i < this.players.length; i++) {
		if(!keepOut) {
			this.players[i].out = false;
		}
		
		this.players[i].hand = [];
		if(this.players[i].out)
			this.players[i].folded = true;
		else {
			this.players[i].hand.push(this.PullCard());
			this.players[i].hand.push(this.PullCard());
			this.players[i].folded = false;
		}
		this.players[i].res = null;
	}
	this.house = [];
	this.house.push(this.PullCard());
	this.house.push(this.PullCard());
	this.house.push(this.PullCard());
}

Cavalcade.prototype.Finish = function() {
	for(var i = 0; i < this.players.length; i++) {
		if(this.players[i].folded) continue;
		for(var j = 0; j < this.house.length; j++)
			this.players[i].hand.push(this.house[j]);
		// TODO: TEMP
		Text.AddOutput("[Poss] hand:<br/>", {Poss: this.players[i].Possessive()});
		for(var j = 0; j < this.players[i].hand.length; j++) {
			var card = this.players[i].hand[j];
			if(card == this.stag)
				Text.AddOutput(card.name + Text.BoldColor(" (*)"));
			else
				Text.AddOutput(card.name);
			Text.AddOutput(", ");
		}
		Text.AddOutput("<br/>");
	}
}

Cavalcade.CardCountSorter = function(a, b) {
	if(a.num == b.num) return (a.val < b.val) ? -1 : 1;
	else return (a.num > b.num) ? -1 : 1;
}

// Hand is a collection of five cards
Cavalcade.prototype.EvaluateHand = function(hand) {
	if(!hand || hand.length != 5) return;
	// Evaluate cards from best to worst hand
	
	// stag
	var hasStag = false;
	for(var i = 0; i < 5; i++) {
		if(hand[i] == this.stag) {
			hasStag = true;
			break;
		}
	}
	
	// Count similar cards, ignore stag
	var counts = [];
	for(var i = 0; i < 5; i++) {
		if(hand[i] == this.stag)
			continue;
		
		var cardVal = hand[i].val;
		var foundVal = false;
		for(var j = 0; j < counts.length; j++) {
			if(cardVal == counts[j].val) {
				counts[j].num++;
				foundVal = true;
				break;
			}
		}
		if(!foundVal) {
			counts.push({num: 1, val: cardVal});
		}
	}
	counts.sort(Cavalcade.CardCountSorter);
	
	// Count cards of the same suit, ignore stag
	var suits = [];
	for(var i = 0; i < 5; i++) {
		if(hand[i] == this.stag)
			continue;
		
		var cardSuit = hand[i].suit;
		var foundSuit = false;
		for(var j = 0; j < suits.length; j++) {
			if(cardSuit == suits[j].suit) {
				suits[j].num++;
				foundSuit = true;
				break;
			}
		}
		if(!foundSuit) {
			suits.push({num: 1, suit: cardSuit});
		}
	}
	counts.sort(Cavalcade.CardCountSorter);
	
	// Add stag to num
	if(hasStag) {
		counts[0].num++;
		suits[0].num++;
	}
	
	// Full cavalcade
	if(suits[0].num == 5)
		return {score: Cavalcade.Score.Cavalcade, suit: suits[0].suit, stag: (suits[0].suit != this.stag.suit) ? hasStag : false};
	
	// Four of a kind
	if(counts[0].num == 4)
		return {score: Cavalcade.Score.Fourkind, high: counts[0].val, stag: hasStag};
	
	// Partial flush
	if(suits[0].num == 4)
		return {score: Cavalcade.Score.Flush, suit: suits[0].suit, stag: (suits[0].suit != this.stag.suit) ? hasStag : false};
	
	// Full house
	if(counts[0].num == 3 && counts[1].num == 2)
		return {score: Cavalcade.Score.FullHouse, high: counts[0].val, low: counts[1].val, stag: hasStag}
	
	// Mixed Cavalcade
	if(counts.length == 5 || (counts.length == 4 && hasStag))
		return {score: Cavalcade.Score.Mixed, stag: hasStag};
		
	// Threekind
	if(counts[0].num == 3)
		return {score: Cavalcade.Score.Threekind, stag: hasStag, high: counts[0].val };
	
	// Two pairs
	if(counts[0].num == 2 && counts[1].num == 2)
		return {score: Cavalcade.Score.TwoPair, high: counts[0].val, low: counts[1].val, stag: hasStag}
	
	// Pair
	if(counts[0].num == 2)
		return {score: Cavalcade.Score.Pair, high: counts[0].val, stag: hasStag}
	
	return {};
}

// Return -1 for handA, 1 for handB, 0 for draw
Cavalcade.EvaluateWinnerSorter = function(playerA, playerB) {
	if(!playerA.res && !playerB.res) return 0;
	else if(!playerA.res) return 1;
	else if(!playerB.res) return -1;
	// Clear winner
	if(playerA.res.score != playerB.res.score)
		return playerA.res.score < playerB.res.score ? -1 : 1;
	
	// If same, the one with the stag loses
	if(playerA.res.stag != playerB.res.stag)
		return playerA.res.stag ? 1 : -1;
	
	if(playerA.res.score == Cavalcade.Score.Mixed) {
		playerA.res.draw = true;
		playerB.res.draw = true;
		return 0;
	}
	
	// Else, pick the high val
	if(playerA.res.high != playerB.res.high)
		return playerA.res.high < playerB.res.high ? -1 : 1;
		
	// Else, pick the low val
	if(playerA.res.low != playerB.res.low)
		return playerA.res.low < playerB.res.low ? -1 : 1;
	
	// Dunno
	playerA.res.draw = true;
	playerB.res.draw = true;
	return 0;
}

Cavalcade.prototype.SuitStr = function(suit) {
	switch(suit) {
		case 0: return "Light";
		case 1: return "Darkness";
		case 2: return "Shadow";
	}
}

Cavalcade.prototype.ResultStr = function(res) {
	var str;
	switch(res.score) {
		case Cavalcade.Score.Cavalcade: str = "Full Cavalcade of " + this.SuitStr(res.suit); break;
		case Cavalcade.Score.Fourkind:  str = "Fourkind of " + (res.high+1); break;
		case Cavalcade.Score.Flush:     str = "Partial flush of " + this.SuitStr(res.suit); break;
		case Cavalcade.Score.FullHouse: str = "Full house of " + (res.high+1) + " and " + (res.low+1); break;
		case Cavalcade.Score.Mixed:     str = "Mixed Cavalcade"; break;
		case Cavalcade.Score.Threekind: str = "Threekind of " + (res.high+1); break;
		case Cavalcade.Score.TwoPair:   str = "Two pairs of " + (res.high+1) + " and " + (res.low+1); break;
		case Cavalcade.Score.Pair:      str = "Pair of " + (res.high+1); break;
		default: str = "silch";
	}
	if(res.stag)
		str += " (Stag)";
	return str;
}

// Rounds of betting, reveal of house cards
// If the Stag is revealed in the house hand, replace it with a new card
Cavalcade.prototype.CoinGameRound = function() {
	var that = this;
	var parse = {
		token : that.token,
		bet : that.bet,
		pot : function() { return that.pot; }
	};
	
	Gui.ClearButtons();
	
	//[Sure][Nah]
	var options = [];
	
	switch(that.round) {
	case 0:
		for(var i = 0; i < that.players.length; i++) {
			if(that.players[i].folded) continue;
			that.players[i].purse.coin -= that.bet;
			that.pot += that.bet;
		}
		if(!player.out) {
			Text.Add("You put [bet] [token]s in the pot. The dealer gives you two cards.", parse);
			Text.NL();
		}
		Text.Add(Text.BoldColor("There are [pot] [token]s in the pot."), parse);
		Text.NL();
	case 1:
	case 2:
	case 3:
		if(player.out) {
			Text.Add("You are no longer in the game.");
		}
		else if(player.folded) {
			Text.Add("You have folded.");
		}
		else {
			Text.Add("Your cards are ", parse);
			var card = player.hand[0];
			if(card == that.stag)
				Text.Add(card.name + Text.BoldColor(" (*)"));
			else
				Text.Add(card.name);
			Text.Add(", ");
			card = player.hand[1];
			if(card == that.stag)
				Text.Add(card.name + Text.BoldColor(" (*)"));
			else
				Text.Add(card.name);
			Text.Add(".");
		}
		Text.NL();
		Text.Add("The dealer reveals a house card.", parse);
		Text.NL();
		
		if(that.house[that.round - 1] == that.stag) {
			Text.Add("The revealed card is [stag]!", {stag: that.stag.name});
			Text.NL();
			Text.Add("The card is discarded, and the dealer pulls another one from the deck.");
			that.house[that.round - 1] = that.PullCard();
			Text.Flush();
			Gui.NextPrompt(function() {
				Text.Clear();
				that.NextRound();
			});
			return;
		}
		
		Text.Add("The house hand is: ", parse);
		var i;
		for(i = 0; i < that.round; i++) {
			var card = that.house[i];
			Text.Add(card.name);
			if(i < 2) Text.Add(", ");
		}
		for(; i < 3; i++) {
			var card = that.house[i];
			if(DEBUG)
				Text.Add(card.name);
			Text.Add("(hidden)");
			if(i < 2) Text.Add(", ");
		}
		Text.Add(".");
		
		Text.NL();
		Text.Add(Text.BoldColor("There are [pot] [token]s in the pot."), parse);
		
		if(player.folded) {
			Input.buttons[0].Setup("Next", function() {
				Text.Clear();
				that.NextRound();
			}, true);
		}
		else {
			// TODO: Opponent AI
			Input.buttons[0].Setup("Call", function() {
				Text.Clear();
				Text.Add("You call.");
				Text.NL();
				that.NextRound();
			}, true);
			Input.buttons[4].Setup("Raise", function() {
				Text.Clear();
				Text.Add("You raise the bet.");
				Text.NL();
				for(var i = 0; i < that.players.length; i++) {
					if(that.players[i].folded) continue;
					that.players[i].purse.coin -= Math.min(that.bet, that.players[i].purse.coin);
					that.pot += that.bet;
				}
				that.NextRound();
			}, that.players[0].purse.coin >= that.bet); // TODO
			Input.buttons[8].Setup("Fold", function() {
				Text.Clear();
				Text.Add("You fold.");
				Text.NL();
				player.folded = true;
				that.NextRound();
			}, true);
		}
		break;
	
	default:
		that.Finish();
		
		Text.NL();
		
		that.winners = [];
		for(var i = 0; i < that.players.length; i++) {
			if(that.players[i].folded) continue;
			that.winners.push(that.players[i]);
		}

		for(var i = 0; i < that.winners.length; i++) {
			Text.Add("HAND EVALUATION ([p]):<br/>", {p: that.winners[i].name});
			that.winners[i].res = that.EvaluateHand(that.winners[i].hand);
			Text.Add("Hand evaluated as: " + that.ResultStr(that.winners[i].res));
			Text.NL();
		}
		
		that.winners.sort(Cavalcade.EvaluateWinnerSorter);
		var draw = false;
		if(that.winners[0].res.draw) {
			draw = true;
			Text.Add("There was a draw! The pot is split between the winners.");
			that.pot = Math.floor(that.pot/that.winners.length);
			for(var i = 0; i < that.winners.length; i++) {
				that.winners[i].purse.coin += that.pot;
				if(party.InParty(that.winners[i])) {
					Text.NL();
					parse["pot"] = that.pot;
					Text.Add("The party gains [pot] [token]s!", parse);
				}
			}
		}
		else {
			that.winner = that.winners[0];
			Text.Add("[name] won the round!", {name: that.winners[0].NameDesc()});
			that.winners[0].purse.coin += that.pot;
			if(party.InParty(that.winners[0])) {
				Text.NL();
				parse["pot"] = that.pot;
				Text.Add("The party gains [pot] [token]s!", parse);
			}
		}
		
		that.onPost();
		
		break;
	}
	Text.Flush();
	that.round++;
}

