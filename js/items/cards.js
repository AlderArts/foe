/*
 * Cavalcade card suits
 */

Items.Cards = {};
Items.Cards.Light = [];
Items.Cards.Light[0] = new Item("cardL1", "[L1] Lady");
Items.Cards.Light[0].val = 0;
Items.Cards.Light[0].suit = 0;
Items.Cards.Light[0].Short = function() { return "The Lady of Light"; }
Items.Cards.Light[0].Long = function() { return "The Lady of Light, a playing card from the game Cavalcade."; }
Items.Cards.Light[1] = new Item("cardL2", "[L2] Champion");
Items.Cards.Light[1].val = 1;
Items.Cards.Light[1].suit = 0;
Items.Cards.Light[1].Short = function() { return "The Champion of Light"; }
Items.Cards.Light[1].Long = function() { return "The Champion of Light, a playing card from the game Cavalcade."; }
Items.Cards.Light[2] = new Item("cardL3", "[L3] Priestess");
Items.Cards.Light[2].val = 2;
Items.Cards.Light[2].suit = 0;
Items.Cards.Light[2].Short = function() { return "The Priestess of Light"; }
Items.Cards.Light[2].Long = function() { return "The Priestess of Light, a playing card from the game Cavalcade."; }
Items.Cards.Light[3] = new Item("cardL4", "[L4] Steed");
Items.Cards.Light[3].val = 3;
Items.Cards.Light[3].suit = 0;
Items.Cards.Light[3].Short = function() { return "The Steed of Light"; }
Items.Cards.Light[3].Long = function() { return "The Steed of Light, a playing card from the game Cavalcade."; }
Items.Cards.Light[4] = new Item("cardL5", "[L5] Maiden");
Items.Cards.Light[4].val = 4;
Items.Cards.Light[4].suit = 0;
Items.Cards.Light[4].Short = function() { return "The Maiden of Light"; }
Items.Cards.Light[4].Long = function() { return "The Maiden of Light, a playing card from the game Cavalcade."; }

Items.Cards.Darkness = [];
Items.Cards.Darkness[0] = new Item("cardD1", "[D1] Queen");
Items.Cards.Darkness[0].val = 0;
Items.Cards.Darkness[0].suit = 1;
Items.Cards.Darkness[0].Short = function() { return "The Queen of Darkness"; }
Items.Cards.Darkness[0].Long = function() { return "The Queen of Darkness, a playing card from the game Cavalcade."; }
Items.Cards.Darkness[1] = new Item("cardD2", "[D2] Slayer");
Items.Cards.Darkness[1].val = 1;
Items.Cards.Darkness[1].suit = 1;
Items.Cards.Darkness[1].Short = function() { return "The Slayer of Darkness"; }
Items.Cards.Darkness[1].Long = function() { return "The Slayer of Darkness, a playing card from the game Cavalcade."; }
Items.Cards.Darkness[2] = new Item("cardD3", "[D3] Zealot");
Items.Cards.Darkness[2].val = 2;
Items.Cards.Darkness[2].suit = 1;
Items.Cards.Darkness[2].Short = function() { return "The Zealot of Darkness"; }
Items.Cards.Darkness[2].Long = function() { return "The Zealot of Darkness, a playing card from the game Cavalcade."; }
Items.Cards.Darkness[3] = new Item("cardD4", "[D4] Beast");
Items.Cards.Darkness[3].val = 3;
Items.Cards.Darkness[3].suit = 1;
Items.Cards.Darkness[3].Short = function() { return "The Beast of Darkness"; }
Items.Cards.Darkness[3].Long = function() { return "The Beast of Darkness, a playing card from the game Cavalcade."; }
Items.Cards.Darkness[4] = new Item("cardD5", "[D5] Harlot");
Items.Cards.Darkness[4].val = 4;
Items.Cards.Darkness[4].suit = 1;
Items.Cards.Darkness[4].Short = function() { return "The Harlot of Darkness"; }
Items.Cards.Darkness[4].Long = function() { return "The Harlot of Darkness, a playing card from the game Cavalcade."; }

Items.Cards.Shadow = [];
Items.Cards.Shadow[0] = new Item("cardS1", "[S1] Avatar");
Items.Cards.Shadow[0].val = 0;
Items.Cards.Shadow[0].suit = 2;
Items.Cards.Shadow[0].Short = function() { return "The Avatar of Shadow"; }
Items.Cards.Shadow[0].Long = function() { return "The Avatar of Shadow, a playing card from the game Cavalcade."; }
Items.Cards.Shadow[1] = new Item("cardS2", "[S2] Trickster");
Items.Cards.Shadow[1].val = 1;
Items.Cards.Shadow[1].suit = 2;
Items.Cards.Shadow[1].Short = function() { return "The Trickster of Shadow"; }
Items.Cards.Shadow[1].Long = function() { return "The Trickster of Shadow, a playing card from the game Cavalcade."; }
Items.Cards.Shadow[2] = new Item("cardS3", "[S3] Wanderer");
Items.Cards.Shadow[2].val = 2;
Items.Cards.Shadow[2].suit = 2;
Items.Cards.Shadow[2].Short = function() { return "The Wanderer of Shadow"; }
Items.Cards.Shadow[2].Long = function() { return "The Wanderer of Shadow, a playing card from the game Cavalcade."; }
Items.Cards.Shadow[3] = new Item("cardS4", "[S4] Stag");
Items.Cards.Shadow[3].val = 3;
Items.Cards.Shadow[3].suit = 2;
Items.Cards.Shadow[3].Short = function() { return "The Shadow Stag"; }
Items.Cards.Shadow[3].Long = function() { return "The Shadow Stag, a playing card from the game Cavalcade."; }
Items.Cards.Shadow[4] = new Item("cardS5", "[S5] Dancer");
Items.Cards.Shadow[4].val = 4;
Items.Cards.Shadow[4].suit = 2;
Items.Cards.Shadow[4].Short = function() { return "The Dancer of Shadow"; }
Items.Cards.Shadow[4].Long = function() { return "The Dancer of Shadow, a playing card from the game Cavalcade."; }

LoadCardImages = function(ready) {
	Items.Cards.Light[0].Img    = "data/cards/L1.png";
	Items.Cards.Light[1].Img    = "data/cards/L2.png";
	Items.Cards.Light[2].Img    = "data/cards/L3.png";
	Items.Cards.Light[3].Img    = "data/cards/L4.png";
	Items.Cards.Light[4].Img    = "data/cards/L5.png";
	Items.Cards.Darkness[0].Img = "data/cards/D1.png";
	Items.Cards.Darkness[1].Img = "data/cards/D2.png";
	Items.Cards.Darkness[2].Img = "data/cards/D3.png";
	Items.Cards.Darkness[3].Img = "data/cards/D4.png";
	Items.Cards.Darkness[4].Img = "data/cards/D5.png";
	Items.Cards.Shadow[0].Img   = "data/cards/S1.png";
	Items.Cards.Shadow[1].Img   = "data/cards/S2.png";
	Items.Cards.Shadow[2].Img   = "data/cards/S3.png";
	Items.Cards.Shadow[3].Img   = "data/cards/S4.png";
	Items.Cards.Shadow[4].Img   = "data/cards/S5.png";
	
	Images.card_back            = "data/cards/back.png";
	
	var cards = [
		Items.Cards.Light[0].Img,
		Items.Cards.Light[1].Img,
		Items.Cards.Light[2].Img,
		Items.Cards.Light[3].Img,
		Items.Cards.Light[4].Img,
		Items.Cards.Darkness[0].Img,
		Items.Cards.Darkness[1].Img,
		Items.Cards.Darkness[2].Img,
		Items.Cards.Darkness[3].Img,
		Items.Cards.Darkness[4].Img,
		Items.Cards.Shadow[0].Img,
		Items.Cards.Shadow[1].Img,
		Items.Cards.Shadow[2].Img,
		Items.Cards.Shadow[3].Img,
		Items.Cards.Shadow[4].Img,
		Images.card_back
	];
	
	for(var i = 0; i < cards.length; i++)
		LoadImage(cards[i], ready);
}
