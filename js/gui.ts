import * as $ from "jquery";
import * as _ from "lodash";
import * as Raphael from "raphael";

import { DEFAULT_FONT, GetRenderPictures, SMALL_FONT, windowHeight, windowWidth } from "../app";
import { Images } from "./assets";
import { Tooltip } from "./button";
import { CurrentActiveChar, EnemyParty } from "./combat-data";
import { ExploreButtonIndex } from "./explorestate";
import { GAME, GetCavalcade, NAV, WorldTime } from "./GAME";
import { isOnline, SetGameState } from "./gamestate";
import { gameState, GameState } from "./gamestate";
import { Input, Keys } from "./input";
import { IChoice } from "./link";
import { StatusEffect } from "./statuseffect";
import { StatusList } from "./statuslist";
import { Text } from "./text";

const textArea = {
	x: 270,
	y: 65,
	w: 740,
	h: 530,
	inset: 4,
	pad: {x: 20, y: 10},
};

const tooltipArea = {
	x: 1075,
	y: 195,
	w: 190,
	h: 390,
};

const inputtextArea = {
	x: 500,
	y: 175,
};

Raphael.el.is_visible = function() {
	return (this.node.style.display !== "none");
};

let LastSubmenu: any;
let callstack: CallableFunction[] = [];
let canvas: any;
let debug: any;
let ShortcutsVisible: boolean;
let fonts: any;

let party: RaphaelSet;
let partyObj: any[];
let enemy: RaphaelSet;
let enemyObj: any[];
let cavalcadeSet: RaphaelSet;
let cavalcadeObj: any;
let overlay: RaphaelSet;
let location: any;
let coinFixed: any;
let coin: any;
let dateFixed: any;
let date: any;
let timeFixed: any;
let time: any;
let clock: any;

let FontFamily: string;
let FontSize: string;
let BgColor: string;

export class Gui {
	static get canvas() { return canvas; }
	static set canvas(c) { canvas = c; }

	static get debug() { return debug; }
	static set debug(d) { debug = d; }

	static get ShortcutsVisible() { return ShortcutsVisible; }
	static set ShortcutsVisible(visible) { ShortcutsVisible = visible; }

	static get barWidth() { return 145; }

	static get Callstack() { return callstack; }
	static set Callstack(cs) { callstack = cs; }

	public static Init() {
		Gui.debug = undefined;
		Gui.ShortcutsVisible = false;

		Gui.canvas = Raphael("wrap", 100, 100);
		Gui.canvas.setViewBox(0, 0, windowWidth, windowHeight, true);
		Gui.canvas.setSize("100%", "100%");
		const bg = Gui.canvas.image(Images.bg, 0, 0, windowWidth, windowHeight);
		bg.node.ondragstart = () => {
			return false;
		};
		const svg = document.querySelector("svg");
		svg.removeAttribute("width");
		svg.removeAttribute("height");

		fonts = {
			Kimberley : Gui.canvas.getFont("Kimberley Bl"),
		};

		Gui.canvas.rect(textArea.x, textArea.y, textArea.w, textArea.h).attr({"stroke-width": textArea.inset});
		Gui.debug = Gui.canvas.text(1230, 700, "Debug").attr({stroke: "#F00", fill: "#F00", font: SMALL_FONT}).hide();
		Gui.Resize();

		party = Gui.canvas.set();
		partyObj = [];
		for (let i = 0; i < 4; ++i) {
			Gui.SetupPortrait(20, 75 + 120 * i, party, partyObj, true, i);
		}
		enemy = Gui.canvas.set();
		enemyObj = [];
		for (let i = 0; i < 4; ++i) {
			Gui.SetupPortrait(1020, 75 + 120 * i, enemy, enemyObj, false, i);
		}

		// Cavalcade
		cavalcadeSet = Gui.canvas.set();
		cavalcadeObj = {};
		cavalcadeObj.p = [];
		Gui.SetupCavalcadeHand(20, 75, cavalcadeSet, cavalcadeObj.p);
		Gui.SetupCavalcadeHand(1020, 75 + 120 * 0, cavalcadeSet, cavalcadeObj.p);
		Gui.SetupCavalcadeHand(1020, 75 + 200 * 1, cavalcadeSet, cavalcadeObj.p);
		Gui.SetupCavalcadeHand(1020, 75 + 200 * 2, cavalcadeSet, cavalcadeObj.p);

		const houseObj = [];
		for (let i = 0; i < 3; ++i) {
			const card = Gui.canvas.image(Images.card_back, 25 + 60 * i, 380 + 25 * i, 106, 150);
			houseObj.push(card);
			cavalcadeSet.push(card);
		}
		cavalcadeObj.house = houseObj;

		cavalcadeObj.round      = {};
		cavalcadeObj.roundFixed = {};
		cavalcadeObj.pot        = {};
		cavalcadeObj.potFixed   = {};
		Gui.PrintGlow(cavalcadeSet, cavalcadeObj.roundFixed, 550, 620, "Round:", fonts.Kimberley, 20, "start", {opacity: 1});
		Gui.PrintGlow(cavalcadeSet, cavalcadeObj.potFixed,   550, 670, "Pot:",   fonts.Kimberley, 20, "start", {opacity: 1});

		overlay   = Gui.canvas.set();
		location  = {};
		coinFixed = {};
		coin      = {};
		Gui.PrintGlow(overlay, coinFixed, 10, 690, "Coin:", fonts.Kimberley, 20, "start", {opacity: 1});
		dateFixed = {};
		date      = {};
		Gui.PrintGlow(overlay, dateFixed, 880, 15, "Date:", fonts.Kimberley, 20, "start", {opacity: 1});
		timeFixed = {};
		time      = {};
		Gui.PrintGlow(overlay, timeFixed, 880, 45, "Time:", fonts.Kimberley, 20, "start", {opacity: 1});

		clock = {};
		clock.x = 840;
		clock.y = 33;
		clock.r = 25;
		overlay.push(Gui.canvas.circle(clock.x, clock.y, clock.r).attr({fill: "#000"}));
		overlay.push(Gui.canvas.circle(clock.x, clock.y, clock.r * 0.97).attr({fill: "rhsb(.1 , .5, .95)-hsb(.1 , 1, .45)"}));
		for (let i = 0; i < 12; i++) {
			const startX = clock.x + Math.round(clock.r * 0.8 * Math.cos(30 * i * Math.PI / 180));
			const startY = clock.y + Math.round(clock.r * 0.8 * Math.sin(30 * i * Math.PI / 180));
			const endX   = clock.x + Math.round(clock.r * Math.cos(30 * i * Math.PI / 180));
			const endY   = clock.y + Math.round(clock.r * Math.sin(30 * i * Math.PI / 180));
			overlay.push(Gui.canvas.path("M" + startX + " " + startY + "L" + endX + " " + endY).attr({"stroke": "#000", "stroke-width": 3}));
		}
		clock.hour   = Gui.canvas.path("M" + clock.x + " " + clock.y + "L" + clock.x + " " + (clock.y - clock.r / 2)).attr({"stroke": "#000", "stroke-width": 5});
		clock.minute = Gui.canvas.path("M" + clock.x + " " + clock.y + "L" + clock.x + " " + (clock.y - 5 * clock.r / 6)).attr({"stroke": "#000", "stroke-width": 3});
		overlay.push(Gui.canvas.circle(clock.x, clock.y, clock.r / 20).attr("fill", "#000"));
		overlay.push(clock.hour);
		overlay.push(clock.minute);

		// Set up key listeners (input.js)
		Input.Init(Gui);

		// Set bg
		BgColor = isOnline() && localStorage.bgcolor ? localStorage.bgcolor : "rgba(255, 255, 255, 0.2)";
		document.getElementById("mainTextArea").style.backgroundColor = BgColor;
		FontFamily = isOnline() && localStorage.fontFamily ? localStorage.fontFamily : "Georgia, sans-serif, \"Arial\", \"Helvetica\"";
		document.getElementById("mainTextArea").style.fontFamily = FontFamily;
		FontSize = isOnline() && localStorage.fontSize ? localStorage.fontSize : "large";
		document.getElementById("mainTextArea").style.fontSize = FontSize;
		Gui.ShortcutsVisible = isOnline() ? parseInt(localStorage.ShortcutsVisible, 10) === 1 : false;

		// Setup keyboard shortcuts
		// Row 1
		Input.buttons[0].SetKey(Keys.KEY_1);
		Input.buttons[1].SetKey(Keys.KEY_2);
		Input.buttons[2].SetKey(Keys.KEY_3);
		Input.buttons[3].SetKey(Keys.KEY_4);
		Input.navButtons[0].SetKey(Keys.KEY_5);
		// Row 2
		Input.buttons[4].SetKey(Keys.KEY_Q);
		Input.buttons[5].SetKey(Keys.KEY_W);
		Input.buttons[6].SetKey(Keys.KEY_E);
		Input.buttons[7].SetKey(Keys.KEY_R);
		Input.navButtons[1].SetKey(Keys.KEY_T);
		// Row 3
		Input.buttons[8].SetKey(Keys.KEY_A);
		Input.buttons[9].SetKey(Keys.KEY_S);
		Input.buttons[10].SetKey(Keys.KEY_D);
		Input.buttons[11].SetKey(Keys.KEY_F);
		Input.navButtons[2].SetKey(Keys.KEY_G);

		// Explore buttons
		Input.exploreButtons[ExploreButtonIndex.Wait].SetKey(Keys.KEY_Z);
		Input.exploreButtons[ExploreButtonIndex.Sleep].SetKey(Keys.KEY_Z);
		Input.exploreButtons[ExploreButtonIndex.Look].SetKey(Keys.KEY_X);

		Input.exploreButtons[ExploreButtonIndex.Explore].SetKey(Keys.KEY_6);
		Input.exploreButtons[ExploreButtonIndex.Party].SetKey(Keys.KEY_7);
		Input.exploreButtons[ExploreButtonIndex.Items].SetKey(Keys.KEY_8);
		Input.exploreButtons[ExploreButtonIndex.Ability].SetKey(Keys.KEY_9);
		Input.exploreButtons[ExploreButtonIndex.Alchemy].SetKey(Keys.KEY_0);
		Input.exploreButtons[ExploreButtonIndex.Quests].SetKey(Keys.KEY_U);

		Input.menuButtons[0].SetKey(Keys.KEY_CONSOLE);

		Gui.ClearButtons();
	}

	public static Print(x: number, y: number, text: string, font: RaphaelFont, size: number, align?: string) {
		align = align || "start";
		const t = Gui.canvas.print(x, y, text, font, size);
		const bb = t.getBBox();
		if (align === "middle") {
			t.translate(-bb.width / 2, 0);
		} else if (align === "end") {
			t.translate(-bb.width, 0);
 		}
		return t;
	}

	public static PrintGlow(set: RaphaelSet, obj: any, x: number, y: number, text: string|number, font: RaphaelFont, size: number, align: string, glow: any) {
		if (text !== obj.str) {
			obj.str = text;
			if (obj.text) {
				set.exclude(obj.text);
				set.exclude(obj.glow);
				obj.text.remove();
				obj.glow.remove();
			}
			obj.text = Gui.Print(x, y, text.toString(), font, size, align).attr({fill: "#fff"});
			obj.glow = obj.text.glow(glow);
			set.push(obj.text);
			set.push(obj.glow);
		} else {
			obj.text.show();
			obj.glow.show();
		}
	}

	public static PrintShow(obj: any) {
		obj.text.show();
		obj.glow.show();
	}

	public static SetupPortrait(xoffset: number, yoffset: number, set: RaphaelSet, obj: any, isParty: boolean, index: number) {
		const barStart   = 85;
		const barWidth   = Gui.barWidth;
		const barHeigth  = 30;
		const border     = 6;
		const barOffsetX = 6;
		const barOffsetY = 30;

		const glowColor = (isParty) ? "#00FF00" : "#FF1111";

		const charSet   = Gui.canvas.set();
		const statusSet = Gui.canvas.set();
		const portrait  = Gui.canvas.image(Images.pc_male, xoffset, yoffset, 100, 100);
		portrait.node.ondragstart = () => {
			return false;
		};
		const local: any = {
			xoffset,
			yoffset,
			portrait,
			name    : {},
			lvl     : {},
			status  : [],
			glow    : portrait.glow({opacity: 1, color: glowColor, width: 20}),
			hpBack  : Gui.canvas.rect(xoffset + barStart, yoffset + 10, barWidth, barHeigth).attr({"stroke-width": border, "stroke": "#000", "fill": "#000"}),
			hpBar   : Gui.canvas.rect(xoffset + barStart, yoffset + 10, barWidth, barHeigth).attr({fill: "#f00"}),
			hpStr   : Gui.canvas.text(xoffset + barStart + barWidth - 5, yoffset + 25, "9999/9999").attr({"text-anchor": "end", "fill": "#fff", "font": DEFAULT_FONT}),
			spBack  : Gui.canvas.rect(xoffset + barStart + barOffsetX, yoffset + 10 + barOffsetY, barWidth, barHeigth).attr({"stroke-width": border, "stroke": "#000", "fill": "#000"}),
			spBar   : Gui.canvas.rect(xoffset + barStart + barOffsetX, yoffset + 10 + barOffsetY, barWidth, barHeigth).attr({fill: "#00f"}),
			spStr   : Gui.canvas.text(xoffset + barStart + barWidth - 5 + barOffsetX, yoffset + 25 + barOffsetY, "9999/9999").attr({"text-anchor": "end", "fill": "#fff", "font": DEFAULT_FONT}),
			lpBack  : Gui.canvas.rect(xoffset + barStart + 2 * barOffsetX, yoffset + 10 + 2 * barOffsetY, barWidth, barHeigth).attr({"stroke-width": border, "stroke": "#000", "fill": "#000"}),
			lpBar   : Gui.canvas.rect(xoffset + barStart + 2 * barOffsetX, yoffset + 10 + 2 * barOffsetY, barWidth, barHeigth).attr({fill: "#f0f"}),
			lpStr   : Gui.canvas.text(xoffset + barStart + barWidth - 5 + 2 * barOffsetX, yoffset + 25 + 2 * barOffsetY, "9999/9999").attr({"text-anchor": "end", "fill": "#fff", "font": DEFAULT_FONT}),
		};

		for (let i = 0; i < StatusList.NumStatus; i++) {
			local.status[i] = Gui.canvas.image(Images.status[StatusEffect.Burn], xoffset + 16 * i + 2, yoffset + 70, 15, 15);
			statusSet.push(local.status[i]);
		}

		charSet.push(local.portrait);
		charSet.push(local.glow);
		charSet.push(local.hpBack);
		charSet.push(local.hpBar);
		charSet.push(local.hpStr);
		charSet.push(local.spBack);
		charSet.push(local.spBar);
		charSet.push(local.spStr);
		charSet.push(local.lpBack);
		charSet.push(local.lpBar);
		charSet.push(local.lpStr);
		charSet.push(statusSet);
		set.push(charSet);
		obj.push(local);

		charSet.attr({
			cursor: "pointer",
		}).click(() => {
			Gui.HandlePortraitClick(index, isParty);
		});
	}

	public static HandlePortraitClick = (index: number, isParty: boolean) => {
		if (gameState === GameState.Game && !GAME().IntroActive) {
			if (isParty) {
				const character = GAME().party.Get(index);
				if (character) {
					Gui.SetLastSubmenu(Input.exploreButtons[ExploreButtonIndex.Party]);
					character.Interact(GAME().party.location.switchSpot());
				}
			}
		}
	}

	public static SetupCavalcadeHand(xoffset: number, yoffset: number, set: RaphaelSet, obj: any) {
		const charSet = Gui.canvas.set();

		// let portrait = Gui.canvas.image(Images.pc_male, xoffset, yoffset, 100, 100);
		const cards = [];
		cards.push(Gui.canvas.image(Images.card_back, xoffset, yoffset, 106, 150));
		cards.push(Gui.canvas.image(Images.card_back, 110 + xoffset, yoffset, 106, 150));

		const local = {
			xoffset,
			yoffset,
			name     : {},
			coin     : {},
	// 		portrait : portrait,
			cards,
		};

	// 	charSet.push(portrait);
		charSet.push(cards[0]);
		charSet.push(cards[1]);
		set.push(charSet);
		obj.push(local);
	}

	public static Resize = () => {
		const w = $(window).width();
		const h = $(window).height();
		const ratioW = w / windowWidth;
		const ratioH = h / windowHeight;
		let xpos = 0; let ypos = 0; let ratio = 1;
		// alert("R:" + ratio + " RW:" + ratioW + " RH:" + ratioH);
		if (ratioW / ratioH > 1) {
			xpos  = (w - ratioH * windowWidth) / 2;
			ratio = ratioH;
		} else {
			ypos  = (h - ratioW * windowHeight) / 2;
			ratio = ratioW;
		}

		const textarea = document.getElementById("mainTextWrapper");
		textarea.style.left   = xpos + ratio * (textArea.inset / 2 + textArea.x) + "px";
		textarea.style.top    = ypos + ratio * (textArea.inset / 2 + textArea.y) + "px";
		textarea.style.width  = -2 * textArea.pad.x + ratio * (-textArea.inset + textArea.w) + "px";
		textarea.style.height = -2 * textArea.pad.y + ratio * (-textArea.inset + textArea.h) + "px";

		const inputtext = document.getElementById("textInputArea");
		inputtext.style.left   = xpos + ratio * inputtextArea.x + "px";
		inputtext.style.top    = ypos + ratio * inputtextArea.y + "px";

		const tooltip = document.getElementById("tooltipTextArea");
		tooltip.style.left   = xpos + ratio * tooltipArea.x + "px";
		tooltip.style.top    = ypos + ratio * tooltipArea.y + "px";
		tooltip.style.width  =        ratio * tooltipArea.w + "px";
		tooltip.style.height =        ratio * tooltipArea.h + "px";
	}

	public static FontPicker(back: any) {
		Text.Clear();
		Text.Add("Set a new font/fontsize?");
		Text.NL();
		Text.Add("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ullamcorper tempus ligula, tristique fringilla magna eleifend sed. Phasellus posuere magna id eros tincidunt porta. Fusce id blandit lectus. Cras gravida, justo eu eleifend suscipit, nunc quam sollicitudin nulla, sit amet pulvinar neque dolor non nunc. Curabitur nec nibh in lectus fermentum dictum. Mauris quis massa sapien, eu laoreet nisi. Phasellus placerat aliquet felis, sit amet euismod libero pharetra eu. Aenean dolor mi, viverra in pellentesque vitae, luctus porta felis. Mauris placerat turpis eu nibh aliquet vel euismod nulla convallis. Morbi tellus dolor, pulvinar ut vestibulum sed, mattis vel diam. Curabitur ac tellus risus.");
		Text.NL();
		Text.Add("Integer posuere quam at odio pharetra dignissim sollicitudin leo accumsan. Curabitur eu pharetra urna. Vivamus et gravida tortor. Morbi vel porttitor urna. Donec vitae rutrum urna. Integer elit orci, gravida eget viverra et, tincidunt quis est. Aliquam erat volutpat. Sed euismod rutrum lectus, nec vehicula turpis volutpat et. Nulla mauris felis, eleifend a fringilla id, faucibus eget purus. Donec in neque in ligula condimentum lobortis.");
		Text.Flush();

		const options: IChoice[] = [];
		options.push({ nameStr : "Reset",
			func() {
				FontFamily = "Georgia, sans-serif, \"Arial\", \"Helvetica\"";
				document.getElementById("mainTextArea").style.fontFamily = FontFamily;
				FontSize = "large";
				document.getElementById("mainTextArea").style.fontSize = FontSize;
				if (isOnline()) {
					localStorage.fontFamily = FontFamily;
					localStorage.fontSize   = FontSize;
				}
			}, enabled : true,
		});
		options.push({ nameStr : "Font",
			func() {
				const font = prompt("Please enter fonts (css: font-families) to use, in order of priority.", FontFamily || "sans-serif, Georgia");
				if (font !== undefined && font !== "") {
					FontFamily = font;
					if (isOnline()) {
						localStorage.fontFamily = FontFamily;
					}
					document.getElementById("mainTextArea").style.fontFamily = FontFamily;
				}
			}, enabled : true,
		});
		options.push({ nameStr : "Size",
			func() {
				const size = prompt("Please enter desired font size (css: font-size). For example: small, medium, large.", FontSize || "large");
				if (size !== undefined && size !== "") {
					FontSize = size;
					if (isOnline()) {
						localStorage.fontSize = FontSize;
					}
					document.getElementById("mainTextArea").style.fontSize = FontSize;
				}
			}, enabled : true,
		});

		Gui.SetButtonsFromList(options, true, back);
	}

	public static BgColorPicker(back: any) {
		Text.Clear();
		Text.Add("Set a new background color?");
		Text.Flush();

		const options: IChoice[] = [];
		options.push({ nameStr : "Light",
			func() {
				BgColor = "rgba(255, 255, 255, 0.2)";
				if (isOnline()) {
					localStorage.bgcolor = BgColor;
				}
				document.getElementById("mainTextArea").style.backgroundColor = BgColor;
			}, enabled : true,
		});
		options.push({ nameStr : "Pink",
			func() {
				BgColor = "rgba(240, 48, 192, 0.6)";
				if (isOnline()) {
					localStorage.bgcolor = BgColor;
				}
				document.getElementById("mainTextArea").style.backgroundColor = BgColor;
			}, enabled : true,
		});
		options.push({ nameStr : "Yellow",
			func() {
				BgColor = "rgba(240, 192, 48, 0.6)";
				if (isOnline()) {
					localStorage.bgcolor = BgColor;
				}
				document.getElementById("mainTextArea").style.backgroundColor = BgColor;
			}, enabled : true,
		});
		options.push({ nameStr : "Cyan",
			func() {
				BgColor = "rgba(48, 240, 192, 0.6)";
				if (isOnline()) {
					localStorage.bgcolor = BgColor;
				}
				document.getElementById("mainTextArea").style.backgroundColor = BgColor;
			}, enabled : true,
		});
		options.push({ nameStr : "Blue",
			func() {
				BgColor = "rgba(48, 192, 240, 0.6)";
				if (isOnline()) {
					localStorage.bgcolor = BgColor;
				}
				document.getElementById("mainTextArea").style.backgroundColor = BgColor;
			}, enabled : true,
		});
		options.push({ nameStr : "Green",
			func() {
				BgColor = "rgba(120, 240, 48, 0.6)";
				if (isOnline()) {
					localStorage.bgcolor = BgColor;
				}
				document.getElementById("mainTextArea").style.backgroundColor = BgColor;
			}, enabled : true,
		});
		options.push({ nameStr : "Purple",
			func() {
				BgColor = "rgba(192, 48, 240, 0.6)";
				if (isOnline()) {
					localStorage.bgcolor = BgColor;
				}
				document.getElementById("mainTextArea").style.backgroundColor = BgColor;
			}, enabled : true,
		});
		options.push({ nameStr : "None",
			func() {
				BgColor = "rgba(0, 0, 0, 0.0)";
				if (isOnline()) {
					localStorage.bgcolor = BgColor;
				}
				document.getElementById("mainTextArea").style.backgroundColor = BgColor;
			}, enabled : true,
		});
		options.push({ nameStr : "Custom",
			func() {
				const col = prompt("Please enter desired background color. Format is rgba(R,G,B,A). Colors are in the range 0-255. Opacity is in the range 0-1.", BgColor || "rgba(255,255,255,1.0)");
				if (col !== undefined && col !== "") {
					BgColor = col;
					if (isOnline()) {
						localStorage.bgcolor = BgColor;
					}
					document.getElementById("mainTextArea").style.backgroundColor = BgColor;
				}
			}, enabled : true,
		});

		Gui.SetButtonsFromList(options, true, back);
	}

	public static ClearChoiceButtons() {
		for (const button of Input.buttons) {
			button.SetVisible(false);
		}
	}

	public static ClearButtons() {
		for (const button of Input.buttons) {
			button.enabledImage = Images.imgButtonEnabled;
			button.SetVisible(false);
		}
		for (const button of Input.navButtons) {
			button.SetVisible(false);
		}
		for (const button of Input.exploreButtons) {
			button.SetVisible(false);
		}
	}

	public static NextPrompt(func: CallableFunction = Gui.PrintDefaultOptions, text: string = "Next", tooltip?: Tooltip) {
		Gui.ClearButtons();
		// text, func, enabled, obj, tooltip, state
		Input.buttons[0].Setup(text, func, true, undefined, tooltip);
	}

	public static SetButtonPage(list: IChoice[], page: number, state: GameState) {
		Gui.ClearChoiceButtons();
		for (let i = 0, j = page * Input.buttons.length; i < Input.buttons.length && j < list.length; i++, j++) {
			const name = list[j].nameStr || "NULL";
			const func = list[j].func;
			const en = list[j].enabled || false;
			Input.buttons[i].enabledImage = list[j].image || Images.imgButtonEnabled;
			Input.buttons[i].Setup(name, func, en, list[j].obj, list[j].tooltip, state);
		}
	}

	public static SetButtonsFromList(list: IChoice[], backEnabled?: boolean, backFunc: CallableFunction = Gui.PrintDefaultOptions, state?: GameState, backState?: GameState) {
		Gui.ClearButtons();
		let currentPage = 0;

		Gui.SetButtonPage(list, currentPage, state);

		const updateNav = () => {
			Input.navButtons[0].Setup(">>",
				() => {
					if (currentPage < (list.length / Input.buttons.length) - 1) {
						currentPage++;
						Gui.SetButtonPage(list, currentPage, state);
						updateNav();
					}
				}, true);
			Input.navButtons[0].SetVisible((list.length > Input.buttons.length &&
				currentPage < (list.length / Input.buttons.length) - 1));
			Input.navButtons[1].Setup("<<",
				() => {
					if (currentPage > 0) {
						currentPage--;
						Gui.SetButtonPage(list, currentPage, state);
						updateNav();
					}
				}, true);
			Input.navButtons[1].SetVisible((list.length > Input.buttons.length &&
				currentPage > 0));
			if (backEnabled) {
				Input.navButtons[2].Setup("Back", backFunc, true);
			}
		};

		updateNav();

		return () => currentPage;
	}

	public static SetButtonCollectionPage(encounter: any, caster: any, list: any[], ret: CallableFunction, page: number) {
		Gui.ClearChoiceButtons();
		for (let i = 0, j = page * Input.buttons.length; i < Input.buttons.length && j < list.length; i++, j++) {
			Input.buttons[i].SetFromAbility(encounter, caster, list[j], ret);
		}
	}

	public static SetButtonsFromCollection = (encounter: any, caster: any, list: any[], ret: CallableFunction, backFunc: CallableFunction) => {
		Gui.ClearButtons();
		let currentPage = 0;

		Gui.SetButtonCollectionPage(encounter, caster, list, ret, currentPage);

		const updateNav = () => {
			Input.navButtons[0].Setup(">>",
				() => {
					if (currentPage < (list.length / Input.buttons.length) - 1) {
						currentPage++;
						Gui.SetButtonCollectionPage(encounter, caster, list, ret, currentPage);
						updateNav();
					}
				}, true);
			Input.navButtons[0].SetVisible((list.length > Input.buttons.length &&
				currentPage < (list.length / Input.buttons.length) - 1));
			Input.navButtons[1].Setup("<<",
				() => {
					if (currentPage > 0) {
						currentPage--;
						Gui.SetButtonCollectionPage(encounter, caster, list, ret, currentPage);
						updateNav();
					}
				}, true);
			Input.navButtons[1].SetVisible((list.length > Input.buttons.length &&
				currentPage > 0));
			if (backFunc) {
				Input.navButtons[2].Setup("Back", backFunc, true);
			}
		};

		updateNav();
	}

	public static RenderParty(p: any, set: RaphaelSet, obj: any, max?: number) {
		max = max || 4;
		let i = 0;
		for (; i < p.Num() && i < max; ++i) {
			const c = p.Get(i);
			set[i].show();
			Gui.RenderEntity(c, set[i], obj[i]);
			if (gameState !== GameState.Combat || c !== CurrentActiveChar()) {
				obj[i].glow.hide();
			}
		}
		for (; i < 4 && i < max; ++i) {
			set[i].hide();
		}
	}
	public static RenderEntity(entity: any, set: RaphaelElement|any, obj: any) {
		/*
		let local = {
			portrait: Gui.canvas.image(Images.pc_male, xoffset, yoffset, 100, 100),
			hpBack  : Gui.canvas.rect(xoffset+barStart, yoffset+10, barWidth, barHeigth).attr({"stroke-width": border, stroke: "#000", fill: "#fff"}),
			hpBar   : Gui.canvas.rect(xoffset+barStart, yoffset+10, barWidth, barHeigth).attr({fill: "#f00"}),
			hpStr   : Gui.canvas.text(xoffset+barStart+barWidth-5, yoffset+25, "9999/9999").attr({"text-anchor": "end", fill:"#fff", font: DEFAULT_FONT}),
			spBack  : Gui.canvas.rect(xoffset+barStart+barOffsetX, yoffset+10+barOffsetY, barWidth, barHeigth).attr({"stroke-width": border, stroke: "#000", fill: "#fff"}),
			spBar   : Gui.canvas.rect(xoffset+barStart+barOffsetX, yoffset+10+barOffsetY, barWidth, barHeigth).attr({fill: "#00f"}),
			spStr   : Gui.canvas.text(xoffset+barStart+barWidth-5+barOffsetX, yoffset+25+barOffsetY, "9999/9999").attr({"text-anchor": "end", fill:"#fff", font: DEFAULT_FONT}),
			lpBack  : Gui.canvas.rect(xoffset+barStart+2*barOffsetX, yoffset+10+2*barOffsetY, barWidth, barHeigth).attr({"stroke-width": border, stroke: "#000", fill: "#fff"}),
			lpBar   : Gui.canvas.rect(xoffset+barStart+2*barOffsetX, yoffset+10+2*barOffsetY, barWidth, barHeigth).attr({fill: "#f0f"}),
			lpStr   : Gui.canvas.text(xoffset+barStart+barWidth-5+2*barOffsetX, yoffset+25+2*barOffsetY, "9999/9999").attr({"text-anchor": "end", fill:"#fff", font: DEFAULT_FONT}),
			name    : Gui.canvas.text(xoffset-5, yoffset, "NAME").attr({"text-anchor": "start", fill:"#fff", font: LARGE_FONT}),
			lvl     : Gui.canvas.text(xoffset-3, yoffset+96, "X/Y").attr({"text-anchor": "start", fill:"#fff", font: SMALL_FONT})
		};
		*/

		if (entity.avatar.combat) {
			obj.portrait.attr({src: entity.avatar.combat, opacity: entity.Incapacitated() ? .5 : 1});
		}

		if (GetRenderPictures()) {
			obj.portrait.show();
		} else {
			obj.portrait.hide();
		}

		Gui.PrintGlow(set, obj.name, obj.xoffset - 5, obj.yoffset, entity.uniqueName || entity.name, fonts.Kimberley, 30, "start", {opacity: 1});

		const hp = Math.floor(entity.curHp) / Math.floor(entity.HP());
		const hpText = Math.floor(entity.curHp) + "/" + Math.floor(entity.HP());
		obj.hpStr.attr({text: hpText});
		obj.hpBar.stop().animate({width: hp * Gui.barWidth}, 500, "<>");
		const sp = Math.floor(entity.curSp) / Math.floor(entity.SP());
		const spText = Math.floor(entity.curSp) + "/" + Math.floor(entity.SP());
		obj.spStr.attr({text: spText});
		obj.spBar.stop().animate({width: sp * Gui.barWidth}, 500, "<>");
		const lust = Math.floor(entity.curLust) / Math.floor(entity.Lust());
		const lustText = Math.floor(entity.curLust) + "/" + Math.floor(entity.Lust());
		obj.lpStr.attr({text: lustText});
		obj.lpBar.stop().animate({width: lust * Gui.barWidth}, 500, "<>");

		let levelText = "Lvl " + entity.level + "/" + entity.sexlevel;
		if (entity.currentJob) {
			const jd  = entity.jobs[entity.currentJob.name];
			if (jd) {
				// Check for maxed out job
				const master   = jd.job.Master(entity);
				if (master) { levelText += "/*"; } else {       levelText += "/" + jd.level; }
			}
		}

		Gui.PrintGlow(set, obj.lvl, obj.xoffset - 3, obj.yoffset + 96, levelText, fonts.Kimberley, 14, "start", {opacity: 1, width: 5});

		obj.lvl.text.attr({fill: entity.pendingStatPoints > 0 ? "green" : "white"});

		entity.combatStatus.Render(obj.status);
	}

	public static RenderLocation(name: (() => string)|string) {
		let nameStr;
		if (_.isFunction(name)) {
			nameStr = name();
		} else if (name) {
			nameStr = name;
 		} else {
			nameStr = "???";
 		}

		Gui.PrintGlow(overlay, location, 300, 30, nameStr, fonts.Kimberley, 30, "start", {opacity: 1});
	}

	public static RenderTime() {
		const coinStr = GAME().party.coin;
		Gui.PrintGlow(overlay, coin, 250, 690, coinStr, fonts.Kimberley, 20, "end", {opacity: 1});

		const dateStr = WorldTime().DateString();
		Gui.PrintGlow(overlay, date, 1245, 15, dateStr, fonts.Kimberley, 20, "end", {opacity: 1});

		const timeStr = WorldTime().TimeString();
		Gui.PrintGlow(overlay, time, 1245, 45, timeStr, fonts.Kimberley, 20, "end", {opacity: 1});

		const hour   = WorldTime().ToHours();
		const minute = WorldTime().ToMinutes();

		if (clock.hourNum) {
			clock.hour.stop().animate({transform: "r" + (hour / 12 * 360) + "," + clock.x + "," + clock.y}, 2000, "<>");
			clock.minute.stop().animate({transform: "r" + (minute / 60 * 360) + "," + clock.x + "," + clock.y}, 2000, "<>");
		} else {
			clock.hour.transform("r" + (hour / 12 * 360) + "," + clock.x + "," + clock.y);
			clock.minute.transform("r" + (minute / 60 * 360) + "," + clock.x + "," + clock.y);
		}
		clock.hourNum   = hour;
		clock.minuteNum = minute;
	}

	public static SetGameState(state: GameState) {
		switch (gameState) { // TODO?
			case GameState.Game:
				for (const button of Input.menuButtons) {
					button.SetVisibility();
				}
				for (const button of Input.exploreButtons) {
					button.SetVisibility();
				}
				break;
			case GameState.Event:
			case GameState.Credits:
			case GameState.Combat:
			case GameState.Cavalcade:
				Input.menuButtonSet.hide();
				Input.exploreButtonSet.hide();
			 break;
		}
		for (const button of Input.buttons) {
			button.SetVisibility();
		}
		for (const button of Input.navButtons) {
			button.SetVisibility();
		}
	}

	// Animation loop Rendering
	public static Render() {
		cavalcadeSet.hide();

		switch (gameState) {
			case GameState.Credits:
				overlay.hide();
				party.hide();
				enemy.hide();
				break;

			case GameState.Combat:
				if (EnemyParty()) {
					Gui.RenderParty(EnemyParty(), enemy, enemyObj);
				} else {
					enemy.hide();
				}

			case GameState.Game:
			case GameState.Event:
				if (gameState === GameState.Game) {
					Input.RenderExploreButtonGlow();
				}
				if (gameState === GameState.Game || gameState === GameState.Event) {
					enemy.hide();
				}
				// TODO: !GetRenderPictures()
				Gui.RenderParty(GAME().party, party, partyObj);

				// TODO: Time
				Gui.RenderTime();
				Gui.RenderLocation(GAME().party.location.nameFunc);
				overlay.show();

				break;
			case GameState.Cavalcade:
				party.hide();
				enemy.hide();
				const cavalcade = GetCavalcade();

				for (let i = 0, j = cavalcade.players.length; i < j; i++) {
					const p    = cavalcade.players[i];
					const obj  = cavalcadeObj.p[i];
					/*
					if(p.avatar.combat) {
						obj.portrait.attr({src: p.avatar.combat, opacity: p.folded ? .5 : 1}).show();
					}
					*/
					Gui.PrintGlow(cavalcadeSet, obj.name, obj.xoffset - 5, obj.yoffset, p.name, fonts.Kimberley, 30, "start", {opacity: 1});

					Gui.PrintGlow(cavalcadeSet, obj.coin, obj.xoffset + 215, obj.yoffset,
						p.out ? "Out" : p.purse.coin,
						fonts.Kimberley, 30, "end", {opacity: 1});

					const cards = obj.cards;

					for (let k = 0; k < 2; k++) {
						// Show cards when game is complete
						let showCard = cavalcade.round > 4;
						// don't show folded opponents
						if (p.folded) { showCard = false; }
						showCard = showCard || (p === GAME().player); // always show own

						if (showCard && k < p.hand.length) {
							cards[k].attr({src: p.hand[k].Img}).show();
						} else {
							cards[k].attr({src: Images.card_back}).show();
						}
					}
				}

				for (let i = 0, j = cavalcade.house.length; i < j; i++) {
					const card = cavalcadeObj.house[i];
					// Show cards when game is complete
					const showCard = cavalcade.round > i + 1;
					if (showCard) {
						card.attr({src: cavalcade.house[i].Img}).show();
					} else {
						card.attr({src: Images.card_back}).show();
					}
				}

				const potStr   = cavalcade.pot;
				let roundStr = cavalcade.round - 1;
				if (roundStr < 1) { roundStr = 1; }
				if (roundStr > 3) { roundStr = 3; }
				Gui.PrintGlow(cavalcadeSet, cavalcadeObj.round, 850, 620, roundStr, fonts.Kimberley, 20, "end", {opacity: 1});
				Gui.PrintGlow(cavalcadeSet, cavalcadeObj.pot,   850, 670, potStr,   fonts.Kimberley, 20, "end", {opacity: 1});
				Gui.PrintShow(cavalcadeObj.roundFixed);
				Gui.PrintShow(cavalcadeObj.potFixed);

				// TODO: Time
				Gui.RenderTime();
				Gui.RenderLocation(GAME().party.location.nameFunc);
				overlay.show();
				break;
		}
	}

	public static RenderStatsScreen(context: any) { // TODO never used anywhere
		// Set up context for drawing text
		context.fillStyle = "black";
		context.textAlign = "start";
		context.font = DEFAULT_FONT;

		context.save();
		context.translate(80, 100);

		context.fillText("Strength: ", 0, 0);
		context.fillText("Stamina: ", 0, 30);
		context.fillText("Dexterity: ", 0, 60);
		context.fillText("Intelligence: ", 0, 90);
		context.fillText("Spirit: ", 0, 120);
		context.fillText("Libido: ", 0, 150);
		context.fillText("Charisma: ", 0, 180);
		context.fillText("HP: ", 0, 210);
		context.fillText("SP: ", 0, 250);
		context.fillText("Lust: ", 0, 280);
		context.fillText("Level: ", 0, 310);
		context.fillText("Exp: ", 0, 350);
		context.fillText("Sex level: ", 0, 380);
		context.fillText("Sexp: ", 0, 410);

		const player = GAME().player;

		context.translate(300, 0);
		context.textAlign = "right";
		context.fillText(Math.floor(player.strength.Get()), 0, 0);
		context.fillText(Math.floor(player.stamina.Get()), 0, 30);
		context.fillText(Math.floor(player.dexterity.Get()), 0, 60);
		context.fillText(Math.floor(player.intelligence.Get()), 0, 90);
		context.fillText(Math.floor(player.spirit.Get()), 0, 120);
		context.fillText(Math.floor(player.libido.Get()), 0, 150);
		context.fillText(Math.floor(player.charisma.Get()), 0, 180);
		context.fillText(Math.floor(player.curHp) + "/" + Math.floor(player.HP()), 0, 210);
		context.fillText(Math.floor(player.curSp) + "/" + Math.floor(player.SP()), 0, 250);
		context.fillText(Math.floor(player.curLust) + "/" + Math.floor(player.Lust()), 0, 280);
		context.fillText(Math.floor(player.level), 0, 310);
		context.fillText(Math.floor(player.experience), 0, 350);
		context.fillText(Math.floor(player.sexlevel), 0, 380);
		context.fillText(Math.floor(player.sexperience), 0, 410);

		context.textAlign = "start";

		context.restore();
	}

	public static SavePromptText() {
		Text.Clear();
		Text.Add("Fall of Eden saves using JavaScript localStorage (also known as Web Storage). Exactly how and where this will put your save is up to browser implementation, but the standard ensures at least 5MB of storage space, more than enough for 12 full save slots.");
		Text.NL();
		Text.Add("IMPORTANT: Saves are kept by your browser, for the specific domain you are playing in atm. If you clear browsing history or the domain changes, you may lose saves. See these saves as temporary, ALWAYS use Save to File to backup if you want to ensure not losing your progress!", undefined, "bold");
		Text.NL();
		Text.Add("You can only save at 'safe' locations in the world (the same places you can sleep), but you can load/start a new game from anywhere.");
		Text.NL();
		Text.Add("<b>NEW:</b> Use the save to text if you are having problems using save to file. Copy the text that appears into a text file, and save it. You will be able to use it with load from file.");
		Text.Flush();
	}

	public static SetLastSubmenu(menu: any) {
		LastSubmenu = menu;
	}
	public static GetLastSubmenu() {
		return LastSubmenu;
	}

	public static PrintDefaultOptions(preventClear?: boolean) {
		const e = Gui.Callstack.pop();
		if (e) {
			e();
			return;
		}

		Gui.ClearButtons();

		if (!preventClear) {
			Text.Clear();
		}

		if (GAME().party.location === undefined) {
			Text.Add("ERROR, LOCATION IS NULL");
			Text.Flush();
			return;
		}

		SetGameState(GameState.Game, Gui);

		if (LastSubmenu) {
			LastSubmenu.func(preventClear);
		} else {
			NAV().Explore();
		}
	}

	constructor() {}
}

// Set window resize
document.body.onresize = Gui.Resize;
