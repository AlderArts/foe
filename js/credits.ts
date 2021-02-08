import * as _ from "lodash";
import { GameState, SetGameState } from "./gamestate";
import { Gui } from "./gui";
import { Input } from "./input";
import { Text } from "./text";

const Patrons = [
	`StarcraftJunkie`,
	`Dane`,
	`Mark`,
	`Marco Zijlmans`,
	`Xcuphra`,
	`Eric Borrowman`,
	`Matthew Sellers`,
	`Xxeryon`,
	`Lasse`,
	`Sagara Saito`,
	`Sindri Myr`,
	`Timothy Rice`,
	`Mark Hawker`,
	`Dana Reitz`,
	`Minty Shine`,
	`Sean`,
	`Daniel Mittelbrun`,
	`Twenix`,
	`The Dark Wanderer`,
	`Fusiontech`,
	`Nosna`,
	`Kyle Tikala`,
	`Rakesh`,
	`Jayson Love`,
	`Pakuska`,
	`Christopher Hewitt`,
	`Bra1nz`,
	`Vann Collins`,
	`patrick dorman`,
	`Draxial Drax`,
	`Christopher Joseph Vargas`,
	`Artem`,
	`Nenad Ganilovic`,
	`Chris Meincke`,
	`Ditz Kholik`,
	`David Camper`,
	`bojaa90`,
	`Malte Nüchter`,
	`Syrth Nightstar`,
	`Lee`,
	`Noir`,
	`Stanley Davis`,
	`davis`,
	`DiffSquared`,
	`Glen Quagmire`,
	`Reagan Bedggood`,
	`Barbara Jacobson`,
	`Kevin saoud`,
	`Greg Schimmel`,
	`Wayne Chattillon`,
	`Killdark Gamer`,
	`Lokiallen`,
	`trevor tripp`,
	`Arpie`,
	`Corey Hammond`,
	`DiscipleofLuna`,
	`Southrim`,
	`YoRHa M5`,
	`Drakkar Colvin`,
	`Cobra Commander`,
	`Erin`,
	`Patrick`,
	`Etis`,
];

const Editors = [
	`CalmKhaos`,
	`MrKrampus`,
	`Del`,
	`Johnathan Roberts`,
	`Ryous`,
	`Spiegelmeister`,
	`Snarbolax`,
];

const Content = [
	{name: `Asche`, authors: [`The Observer`]},
	{name: `Aquilius`, authors: [`The Observer`]},
	{name: `Barnaby`, authors: [`LukaDoc`, `QuietBrowser`]},
	{name: `Cale`, authors: [`Alder`, `LukaDoc`, `QuietBrowser`]},
	{name: `Cassidy`, authors: [`The Observer`]},
	{name: `Cat Dynasty theme room`, authors: [`LukaDoc`, `QuietBrowser`]},
	{name: `Cats loss scenes`, authors: [`LukaDoc`, `QuietBrowser`]},
	{name: `Cats loss scenes (double teamed)`, authors: [`Tala`]},
	{name: `Cveta`, authors: [`The Observer`]},
	{name: `Highlands catboy`, authors: [`The Observer`]},
	{name: `Highlands centauress`, authors: [`The Observer`]},
	{name: `Highlands goat`, authors: [`The Observer`]},
	{name: `Desert caravan`, authors: [`Del`]},
	{name: `Donovan Twopenny`, authors: [`The Observer`]},
	{name: `Dreams & ravens`, authors: [`Alder`, `Del`]},
	{name: `Estevan gay sex`, authors: [`Ben`]},
	{name: `Gol`, authors: [`Alder`, `Fenoxo`]},
	{name: `Gryphon theme room`, authors: [`The Observer`]},
	{name: `Gwendy's farm, sex`, authors: [`Alder`, `Kiro`]},
	{name: `Gwendy's farm, market`, authors: [`LukaDoc`, `QuietBrowser`, `Alder`]},
	{name: `Horse encounter (loss)`, authors: [`gber1`]},
	{name: `Horse encounter (win)`, authors: [`Jo Rhade`]},
	{name: `Much of Kiakai's dialogue`, authors: [`Del`]},
	{name: `Kingdom patrol`, authors: [`Del`]},
	{name: `Lady's Blessing and Room 69`, authors: [`Del`]},
	{name: `Lei`, authors: [`Del`]},
	{name: `Lizard encounter`, authors: [`Salrith`]},
	{name: `Masturbation - Breasts, Pussy, Ass`, authors: [`The Observer`]},
	{name: `Masturbation - Cock`, authors: [`LukaDoc`]},
	{name: `Some of Miranda's sex scenes`, authors: [`LukaDoc`, `QuietBrowser`]},
	{name: `Momo`, authors: [`QuietBrowser`, `LukaDoc`]},
	{name: `Mothgirl`, authors: [`Savin`]},
	{name: `Naga`, authors: [`LonelyRonin`]},
	{name: `Ophelia`, authors: [`Alder`, `LukaDoc`, `QuietBrowser`]},
	{name: `Outlaws intro`, authors: [`Derp wolf`]},
	{name: `Patches`, authors: [`Alder`, `LukaDoc`]},
	{name: `Random exploration scenes`, authors: [`Del`]},
	{name: `Rigard random scenes`, authors: [`Del`]},
	{name: `Rigard royal grounds random scenes`, authors: [`The Observer`]},
	{name: `Roa`, authors: [`Alder`, `LukaDoc`, `QuietBrowser`]},
	{name: `Rosalin cock worship scene`, authors: [`Fenoxo`]},
	{name: `Silken Delights & Fera`, authors: [`Resar`]},
	{name: `Terry`, authors: [`LukaDoc`, `QuietBrowser`]},
	{name: `Vaughn`, authors: [`The Observer`]},
	{name: `Zebra shaman`, authors: [`Bluebusterman`]},
];

function PrintList(list: Array<String>) {
	let out = `${list[0]}`;
	for (let i = 1; i < list.length - 1; ++i) {
		out += `, ${list[i]}`;
	}
	if (list.length > 1) {
		out += ` and ${list[list.length-1]}`;
	}
	return out;
}

export function CreditsScreen(SplashScreen: CallableFunction) {
	SetGameState(GameState.Credits, Gui);
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("Loyal patreons:", undefined, "bold");
	Text.NL();
	Text.Out(`${PrintList(Patrons)}
	
	...and all the rest of you!`);

	Text.NL();

	Text.Add("Editing:", undefined, "bold");
	Text.NL();
	Text.Add(`Thanks to ${PrintList(Editors)} for editing for me!`);
	Text.NL();

	Text.Add("Writing:", undefined, "bold");
	Text.NL();
	_.each(Content, (c) => {
		Text.Out(`<b>${c.name}:</b> ${PrintList(c.authors)}\n`);
	});
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
