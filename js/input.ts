import { Button } from './button';
import { Images } from './assets';
import { gameState, GameState } from './gamestate';

// TODO this is actually wrong
let Keys = {
	KEY_CONSOLE : 0,

	KEY_1 : 49,
	KEY_2 : 50,
	KEY_3 : 51,
	KEY_4 : 52,
	KEY_5 : 53,
	KEY_6 : 54,
	KEY_7 : 55,
	KEY_8 : 56,
	KEY_9 : 57,
	KEY_0 : 48,

	KEY_Q : 81,
	KEY_W : 87,
	KEY_E : 69,
	KEY_R : 82,
	KEY_T : 84,
	KEY_Y : 89,
	KEY_U : 85,
	KEY_I : 73,
	KEY_O : 79,
	KEY_P : 80,
	KEY_A : 65,
	KEY_S : 83,
	KEY_D : 68,
	KEY_F : 70,
	KEY_G : 71,
	KEY_H : 72,
	KEY_J : 74,
	KEY_K : 75,
	KEY_L : 76,
	KEY_Z : 90,
	KEY_X : 88,
	KEY_C : 67,
	KEY_V : 86,
	KEY_B : 66,
	KEY_N : 78,
	KEY_M : 77,
}

let KeyToText : any = {};
KeyToText[Keys.KEY_CONSOLE] = "§";

KeyToText[Keys.KEY_1] = "1";
KeyToText[Keys.KEY_2] = "2";
KeyToText[Keys.KEY_3] = "3";
KeyToText[Keys.KEY_4] = "4";
KeyToText[Keys.KEY_5] = "5";
KeyToText[Keys.KEY_6] = "6";
KeyToText[Keys.KEY_7] = "7";
KeyToText[Keys.KEY_8] = "8";
KeyToText[Keys.KEY_9] = "9";
KeyToText[Keys.KEY_0] = "0";

KeyToText[Keys.KEY_Q] = "Q";
KeyToText[Keys.KEY_W] = "W";
KeyToText[Keys.KEY_E] = "E";
KeyToText[Keys.KEY_R] = "R";
KeyToText[Keys.KEY_T] = "T";
KeyToText[Keys.KEY_Y] = "Y";
KeyToText[Keys.KEY_U] = "U";
KeyToText[Keys.KEY_I] = "I";
KeyToText[Keys.KEY_O] = "O";
KeyToText[Keys.KEY_P] = "P";
KeyToText[Keys.KEY_A] = "A";
KeyToText[Keys.KEY_S] = "S";
KeyToText[Keys.KEY_D] = "D";
KeyToText[Keys.KEY_F] = "F";
KeyToText[Keys.KEY_G] = "G";
KeyToText[Keys.KEY_H] = "H";
KeyToText[Keys.KEY_J] = "J";
KeyToText[Keys.KEY_K] = "K";
KeyToText[Keys.KEY_L] = "L";
KeyToText[Keys.KEY_Z] = "Z";
KeyToText[Keys.KEY_X] = "X";
KeyToText[Keys.KEY_C] = "C";
KeyToText[Keys.KEY_V] = "V";
KeyToText[Keys.KEY_B] = "B";
KeyToText[Keys.KEY_N] = "N";
KeyToText[Keys.KEY_M] = "M";

// Internal logical representations
let LEFT_ARROW  = 0;
let RIGHT_ARROW = 1;
let UP_ARROW    = 2;
let DOWN_ARROW  = 3;

let Gui : any;
let buttonSet        : RaphaelSet;
let navButtonSet     : RaphaelSet;
let exploreButtonSet : RaphaelSet;
let menuButtonSet    : RaphaelSet;
let buttons        : Button[] = [];
let navButtons     : Button[] = [];
let exploreButtons : Button[] = [];
let menuButtons    : Button[] = [];

let keyDownValid   : boolean;

export class Input {

	constructor() {}

	static get keyDownValid() { return keyDownValid; }
	static set keyDownValid(valid) { keyDownValid = valid; }

	static get buttons() { return buttons; }
	static get navButtons() { return navButtons; }
	static get exploreButtons() { return exploreButtons; }
	static get menuButtons() { return menuButtons; }

	static get exploreButtonSet() { return exploreButtonSet; }
	static get menuButtonSet() { return menuButtonSet; }

	static Init(gui : any) {
		Gui = gui;
		//let canvas = document.getElementById("canvas");

		window.onkeydown   = Input.Keydown;
		window.onkeyup     = Input.Keyup;
		/*
		canvas.onmousedown = Mousedown;
		canvas.onmouseup   = Mouseup;
		canvas.onmousemove = Mousemove;
		*/

		keyDownValid     = true

		buttonSet        = Gui.canvas.set();
		navButtonSet     = Gui.canvas.set();
		exploreButtonSet = Gui.canvas.set();
		menuButtonSet    = Gui.canvas.set();

		Input.InitButtons();

		Input.InitMenuButtons();
	}
	
	// Init functions for the button sets
	static InitButtons() {
		var offset = {x: 270, y:600};

		let button : Button;
		for(let y = 0; y < 3; y++) {
			for(let x = 0; x < 4; x++) {
				button = new Button(Gui, {x : offset.x + 162*x, y : offset.y + 40*y, w : 155, h : 35}, "Button" + (x + y*5), null, true, Images.imgButtonEnabled, Images.imgButtonDisabled);
				buttons.push(button);
				buttonSet.push(button.set);
			}

			button = new Button(Gui, {x : offset.x + 162*4, y : offset.y + 40*y, w : 75, h : 35}, "Nav" + y, null, true, Images.imgNavButtonEnabled, Images.imgNavButtonDisabled);
			navButtons.push(button);
			navButtonSet.push(button.set);
		}
		for(let y = 0; y < 8; y++) {
			button = new Button(Gui, {x : 1100, y : 375 + 40 * y, w : 155, h : 35}, "Exp"+y, null, true, Images.imgButtonEnabled, Images.imgButtonDisabled, true);
			exploreButtons.push(button);
			exploreButtonSet.push(button.set);
		}
		button = new Button(Gui, {x : 150, y : 590, w : 50, h : 50}, "", null, true, Images.imgWaitEnabled, Images.imgWaitDisabled);
		exploreButtons.push(button);
		exploreButtonSet.push(button.set);
		button = new Button(Gui, {x : 150, y : 590, w : 50, h : 50}, "", null, true, Images.imgSleepEnabled, Images.imgSleepDisabled);
		exploreButtons.push(button);
		exploreButtonSet.push(button.set);
		button = new Button(Gui, {x : 210, y : 590, w : 50, h : 50}, "", null, true, Images.imgSearchEnabled, Images.imgSearchDisabled);
		exploreButtons.push(button);
		exploreButtonSet.push(button.set);
	}

	static InitMenuButtons() {
		var offset = {x: 15, y:620};

		// TOP, Data menu
		var button = new Button(Gui, {x : 10, y : 10, w : 155, h : 35}, "DATA", null, true, Images.imgButtonEnabled, Images.imgButtonDisabled);
		menuButtons.push(button);
		menuButtonSet.push(button.set);
	};

	static RenderExploreButtonGlow() {
		/*
		//TODO keybind tooltip
		var keybinding = KeyToText[this.key];
		if(Gui.ShortcutsVisible && keybinding) {
			// Render the text centered
			context.font = TINY_FONT;
			context.strokeStyle = "rgba(255,0,0,0.8)";
			context.strokeText(keybinding, this.rect.w/2-8, this.rect.h/2-2);
			context.fillStyle = "rgba(255,255,255,0.8)";
			context.fillText(keybinding, this.rect.w/2-8, this.rect.h/2-2);
		}
		*/
		// Add a glow effect if this button is the currently choosen exploration option
		for(let button of exploreButtons) {
			if(!button.image.is_visible()) continue;
			if(!button.glow) continue;
			if(button == Gui.GetLastSubmenu())
				button.glow.show();
			else
				button.glow.hide();
		}
	}
	
	// Catches keypresses
	static Keydown(event : any) {
		// Used for text input, when we don't want to have shortcut keys active
		if(!Input.keyDownValid)
			return true;

		//event.preventDefault();

		// TODO: Prioritze layers
		switch(gameState) {
			case GameState.Game:
				for(let button of menuButtons)
					button.HandleKeydown(event.keyCode);
				for(let button of exploreButtons)
					button.HandleKeydown(event.keyCode);
			case GameState.Event:
			case GameState.Credits:
			case GameState.Combat:
			case GameState.Cavalcade:
				for(let button of buttons)
					button.HandleKeydown(event.keyCode);
				for(let button of navButtons)
					button.HandleKeydown(event.keyCode);
			break;
		}

		/* TODO Not really used atm
		switch(event.keyCode) {
			case Keys.KEY_A: Input.keyinput[LEFT_ARROW]  = true; break;
			case Keys.KEY_D: Input.keyinput[RIGHT_ARROW] = true; break;
			case Keys.KEY_W: Input.keyinput[UP_ARROW]    = true; break;
			case Keys.KEY_S: Input.keyinput[DOWN_ARROW]  = true; break;
		} */
		return true;
	}

	// Catches key releases
	static Keyup(event : any) {
		/* TODO Not really used atm
		switch(event.keyCode) {
			case Keys.KEY_A: Input.keyinput[LEFT_ARROW]  = false; break;
			case Keys.KEY_D: Input.keyinput[RIGHT_ARROW] = false; break;
			case Keys.KEY_W: Input.keyinput[UP_ARROW]    = false; break;
			case Keys.KEY_S: Input.keyinput[DOWN_ARROW]  = false; break;
		} */
		return true;
	}

};

export { Keys };
