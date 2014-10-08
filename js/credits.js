

CreditsScreen = function() {
	SetGameState(GameState.Credits);
	Text.Clear();
	Gui.ClearButtons();
	
	Text.Add("Thanks to MrKrampus, Del, Johnathan Roberts and Snarbolax for editing for me!");
	Text.NL();
	
	Text.Add(Text.BoldColor("Writing:"));
	Text.NL();
	Text.Add("Horse encounter: gber1<br/>");
	Text.Add("Gwendy's farm, sex: Kiro<br/>");
	Text.Add("Gwendy's farm, market: QB, LD and Alder<br/>");
	Text.Add("Lizard encounter: Salrith<br/>");
	Text.Add("Much of Kiakai's dialogue: Del<br/>");
	Text.Add("Rigard random scenes: Del<br/>");
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
	
	Text.NL();
	
	Text.Add(Text.BoldColor("Art:"));
	Text.NL();
	Text.Add("Cavalcade cards: Jass Befrold (colors by Alder)<br/>");
	Text.NL();
	Text.Add(Text.BoldColor("Loyal patreons:"));
	Text.NL();
	Text.Add("StarcraftJunkie, Dane, Mark, Marco Zijlmans, Xcuphra, Eric Borrowman");
	Text.NL();
	Text.Add("...and all the rest of you!");
	Text.Flush();
	
	Input.buttons[0].Setup("Back", SplashScreen, true);
}

