

CreditsScreen = function() {
	SetGameState(GameState.Credits);
	Text.Clear();
	Gui.ClearButtons();
	
	Text.Add("Thanks to MrKrampus, Del, Johnathan Roberts, Ryous, Spiegelmeister and Snarbolax for editing for me!");
	Text.NL();
	
	Text.Add(Text.BoldColor("Writing:"));
	Text.NL();
	Text.Add("Horse encounter (loss): gber1<br/>");
	Text.Add("Horse encounter (win): Jo Rhade<br/>");
	Text.Add("Gwendy's farm, sex: Kiro<br/>");
	Text.Add("Gwendy's farm, market: QB, LD and Alder<br/>");
	Text.Add("Lizard encounter: Salrith<br/>");
	Text.Add("Much of Kiakai's dialogue: Del<br/>");
	Text.Add("Rigard random scenes: Del<br/>");
	Text.Add("Random exploration scenes: Del<br/>");
	Text.Add("Kingdom patrol: Del<br/>");
	Text.Add("Desert caravan: Del<br/>");
	Text.Add("Lei: Del<br/>");
	Text.Add("Lady's Blessing and Room 69: Del<br/>");
	Text.Add("Silken Delights & Fera: Resar<br/>");
	Text.Add("Outlaws: Derp wolf<br/>");
	Text.Add("Rosalin cock worship scene: Fenoxo<br/>");
	Text.Add("Dreams & ravens: About half of them, Del<br/>");
	Text.Add("Cats loss scenes: LukaDoc and QuietBrowser<br/>");
	Text.Add("Some of Miranda's sex scenes: LukaDoc and QuietBrowser<br/>");
	Text.Add("Kyna Moran: Reaper<br/>");
	Text.Add("Terry: LukaDoc and QuietBrowser<br/>");
	Text.Add("Cale: Alder, LukaDoc and QuietBrowser<br/>");
	Text.Add("Momo: QuietBrowser and LukaDoc<br/>");
	Text.Add("Naga: LonelyRonin<br/>");
	Text.Add("Estevan gay sex: Ben<br/>");
	Text.Add("Patches: Me and LD<br/>");
	Text.Add("Roa: Me, QB and LD<br/>");
	Text.Add("Gol: Me and Fenoxo<br/>");
	Text.Add("Mothgirl: Savin<br/>");
	Text.Add("Cveta: The Observer<br/>");
	
	Text.NL();
	
	Text.Add(Text.BoldColor("Art:"));
	Text.NL();
	Text.Add("Cavalcade cards: Jass Befrold (colors by Alder)<br/>");
	Text.NL();
	Text.Add(Text.BoldColor("Loyal patreons:"));
	Text.NL();
	Text.Add("StarcraftJunkie, Dane, Mark, Marco Zijlmans, Xcuphra, Eric Borrowman, Matthew Sellers, Xxeryon, Lasse, Sagara Saito, Sindri Myr, Timothy Rice, Mark Hawker, Dana Reitz, Minty Shine, Sean, Daniel Mittelbrun, Twenix, The Dark Wanderer, Fusiontech, Nosna, Kyle Tikala, Rakesh, Jayson Love, Pakuska, Christopher Hewitt");
	Text.NL();
	Text.Add("...and all the rest of you!");
	Text.Flush();
	
	Input.buttons[0].Setup("Back", SplashScreen, true);
}

