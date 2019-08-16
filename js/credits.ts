
import { GameState, SetGameState } from "./gamestate";
import { Gui } from "./gui";
import { Input } from "./input";
import { Text } from "./text";

export function CreditsScreen(SplashScreen: CallableFunction) {
	SetGameState(GameState.Credits, Gui);
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("Thanks to CalmKhaos, MrKrampus, Del, Johnathan Roberts, Ryous, Spiegelmeister and Snarbolax for editing for me!");
	Text.NL();

	Text.Add("Writing:", null, "bold");
	Text.NL();
	Text.Add("Asche: The Observer<br>");
	Text.Add("Aquilius: The Observer<br>");
	Text.Add("Barnaby: LukaDoc and QuietBrowser<br>");
	Text.Add("Cale: Alder, LukaDoc and QuietBrowser<br>");
	Text.Add("Cassidy: The Observer<br>");
	Text.Add("Cat Dynasty theme room: LukaDoc and QuietBrowser<br>");
	Text.Add("Cats loss scenes: LukaDoc and QuietBrowser<br>");
	Text.Add("Cats loss scenes (double teamed): Tala<br>");
	Text.Add("Cveta: The Observer<br>");
	Text.Add("Highlands catboy: The Observer<br>");
	Text.Add("Highlands centauress: The Observer<br>");
	Text.Add("Highlands goat: The Observer<br>");
	Text.Add("Desert caravan: Del<br>");
	Text.Add("Donovan Twopenny: The Observer<br>");
	Text.Add("Dreams & ravens: About half of them, Del<br>");
	Text.Add("Estevan gay sex: Ben<br>");
	Text.Add("Gol: Me and Fenoxo<br>");
	Text.Add("Gryphon theme room: The Observer<br>");
	Text.Add("Gwendy's farm, sex: Kiro<br>");
	Text.Add("Gwendy's farm, market: QB, LD and Alder<br>");
	Text.Add("Horse encounter (loss): gber1<br>");
	Text.Add("Horse encounter (win): Jo Rhade<br>");
	Text.Add("Much of Kiakai's dialogue: Del<br>");
	Text.Add("Kingdom patrol: Del<br>");
	Text.Add("Lady's Blessing and Room 69: Del<br>");
	Text.Add("Lei: Del<br>");
	Text.Add("Lizard encounter: Salrith<br>");
	Text.Add("Masturbation - Breasts, Pussy, Ass: The Observer<br>");
	Text.Add("Masturbation - Cock: LukaDoc<br>");
	Text.Add("Some of Miranda's sex scenes: LukaDoc and QuietBrowser<br>");
	Text.Add("Momo: QuietBrowser and LukaDoc<br>");
	Text.Add("Mothgirl: Savin<br>");
	Text.Add("Naga: LonelyRonin<br>");
	Text.Add("Ophelia: Me, QB and LD<br>");
	Text.Add("Outlaws intro: Derp wolf<br>");
	Text.Add("Patches: Me and LD<br>");
	Text.Add("Random exploration scenes: Del<br>");
	Text.Add("Rigard random scenes: Del<br>");
	Text.Add("Rigard royal grounds random scenes: The Observer<br>");
	Text.Add("Roa: Me, QB and LD<br>");
	Text.Add("Rosalin cock worship scene: Fenoxo<br>");
	Text.Add("Silken Delights & Fera: Resar<br>");
	Text.Add("Terry: LukaDoc and QuietBrowser<br>");
	Text.Add("Vaughn: The Observer<br>");
	Text.Add("Zebra shaman: Bluebusterman<br>");

	Text.NL();

	Text.Add("Code snippets:", null, "bold");
	Text.NL();
	Text.Add("Image pre-loader: https://github.com/DimitarChristoff/pre-loader<br>");

	Text.NL();

	Text.Add("Art:", null, "bold");
	Text.NL();
	Text.Add("Cavalcade cards: Jass Befrold (colors by Alder)<br>");
	Text.NL();
	Text.Add("Loyal patreons:", null, "bold");
	Text.NL();
	Text.Add("StarcraftJunkie, Dane, Mark, Marco Zijlmans, Xcuphra, Eric Borrowman, Matthew Sellers, Xxeryon, Lasse, Sagara Saito, Sindri Myr, Timothy Rice, Mark Hawker, Dana Reitz, Minty Shine, Sean, Daniel Mittelbrun, Twenix, The Dark Wanderer, Fusiontech, Nosna, Kyle Tikala, Rakesh, Jayson Love, Pakuska, Christopher Hewitt, Bra1nz, Vann Collins, patrick dorman, Draxial Drax, Christopher Joseph Vargas, Artem, Nenad Ganilovic, Chris Meincke, Ditz Kholik, David Camper, bojaa90, Malte Nüchter, Syrth Nightstar, Lee, Noir, Stanley Davis, davis, DiffSquared, Glen Quagmire, Reagan Bedggood, Barbara Jacobson, Kevin saoud, Greg Schimmel, Wayne Chattillon, Killdark Gamer, Lokiallen, trevor tripp");
	Text.NL();
	Text.Add("...and all the rest of you!");
	Text.Flush();

	Input.buttons[0].Setup("Back", SplashScreen, true);
}
