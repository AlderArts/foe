
import { GameState, SetGameState } from "./gamestate";
import { Gui } from "./gui";
import { Input } from "./input";
import { Text } from "./text";

export function CreditsScreen(SplashScreen: CallableFunction) {
	SetGameState(GameState.Credits, Gui);
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("Loyal patreons:", undefined, "bold");
	Text.NL();
	Text.Out(`StarcraftJunkie, Dane, Mark, Marco Zijlmans, Xcuphra, Eric Borrowman, Matthew Sellers, Xxeryon, Lasse, Sagara Saito, Sindri Myr, Timothy Rice, Mark Hawker, Dana Reitz, Minty Shine, Sean, Daniel Mittelbrun, Twenix, The Dark Wanderer, Fusiontech, Nosna, Kyle Tikala, Rakesh, Jayson Love, Pakuska, Christopher Hewitt, Bra1nz, Vann Collins, patrick dorman, Draxial Drax, Christopher Joseph Vargas, Artem, Nenad Ganilovic, Chris Meincke, Ditz Kholik, David Camper, bojaa90, Malte Nüchter, Syrth Nightstar, Lee, Noir, Stanley Davis, davis, DiffSquared, Glen Quagmire, Reagan Bedggood, Barbara Jacobson, Kevin saoud, Greg Schimmel, Wayne Chattillon, Killdark Gamer, Lokiallen, trevor tripp, Arpie, Corey Hammond, DiscipleofLuna, Southrim, YoRHa M5, Drakkar Colvin, Cobra Commander

	...and all the rest of you!`);

	Text.NL();

	Text.Add("Editing:", undefined, "bold");
	Text.NL();
	Text.Add("Thanks to CalmKhaos, MrKrampus, Del, Johnathan Roberts, Ryous, Spiegelmeister and Snarbolax for editing for me!");
	Text.NL();

	Text.Add("Writing:", undefined, "bold");
	Text.NL();
	Text.Out(`Asche: The Observer
	Aquilius: The Observer
	Barnaby: LukaDoc and QuietBrowser
	Cale: Alder, LukaDoc and QuietBrowser
	Cassidy: The Observer
	Cat Dynasty theme room: LukaDoc and QuietBrowser
	Cats loss scenes: LukaDoc and QuietBrowser
	Cats loss scenes (double teamed): Tala
	Cveta: The Observer
	Highlands catboy: The Observer
	Highlands centauress: The Observer
	Highlands goat: The Observer
	Desert caravan: Del
	Donovan Twopenny: The Observer
	Dreams & ravens: About half of them, Del
	Estevan gay sex: Ben
	Gol: Me and Fenoxo
	Gryphon theme room: The Observer
	Gwendy's farm, sex: Kiro
	Gwendy's farm, market: QB, LD and Alder
	Horse encounter (loss): gber1
	Horse encounter (win): Jo Rhade
	Much of Kiakai's dialogue: Del
	Kingdom patrol: Del
	Lady's Blessing and Room 69: Del
	Lei: Del
	Lizard encounter: Salrith
	Masturbation - Breasts, Pussy, Ass: The Observer
	Masturbation - Cock: LukaDoc
	Some of Miranda's sex scenes: LukaDoc and QuietBrowser
	Momo: QuietBrowser and LukaDoc
	Mothgirl: Savin
	Naga: LonelyRonin
	Ophelia: Me, QB and LD
	Outlaws intro: Derp wolf
	Patches: Me and LD
	Random exploration scenes: Del
	Rigard random scenes: Del
	Rigard royal grounds random scenes: The Observer
	Roa: Me, QB and LD
	Rosalin cock worship scene: Fenoxo
	Silken Delights & Fera: Resar
	Terry: LukaDoc and QuietBrowser
	Vaughn: The Observer
	Zebra shaman: Bluebusterman`);

	Text.NL();

	Text.Add("Code snippets:", undefined, "bold");
	Text.NL();
	Text.Add("Image pre-loader: https://github.com/DimitarChristoff/pre-loader");

	Text.NL();

	Text.Add("Art:", undefined, "bold");
	Text.NL();
	Text.Add("Cavalcade cards: Jass Befrold (colors by Alder)");

	Text.Flush();

	Input.buttons[0].Setup("Back", SplashScreen, true);
}
