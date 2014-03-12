

CreditsScreen = function() {
	gameState = GameState.Credits;
	Text.Clear();
	Gui.ClearButtons();
	
	Text.AddOutput("Thanks to MrKrampus, Del and Snarbolax for editing for me!");
	Text.Newline();
	
	Text.AddOutput(Text.BoldColor("Writing:"));
	Text.Newline();
	Text.AddOutput("Horse encounter: gber1<br/>");
	Text.AddOutput("Gwendy's farm: Kiro<br/>");
	Text.AddOutput("Lizard encounter: Salrith<br/>");
	Text.AddOutput("Much of Kiakai's dialogue: Del<br/>");
	Text.AddOutput("Rigard random scenes: Del<br/>");
	Text.AddOutput("Lei: Del<br/>");
	Text.AddOutput("Lady's Blessing and Room 69: Del<br/>");
	Text.AddOutput("Silken Delights & Fera: Resar<br/>");
	Text.AddOutput("Outlaws: Derp wolf<br/>");
	Text.AddOutput("Rosalin cock worship scene: Fenoxo<br/>");
	
	Text.Newline();
	
	Text.AddOutput(Text.BoldColor("Art:"));
	Text.Newline();
	Text.AddOutput("Cavalcade cards: Jass Befrold (colors by Alder)<br/>");
	
	Input.buttons[0].Setup("Back", SplashScreen, true);
}
