import { Images } from "../assets";
import { gameState, GameState } from "../engine/gamestate";
import { Button } from "./button";

// Internal logical representations
const LEFT_ARROW  = 0;
const RIGHT_ARROW = 1;
const UP_ARROW    = 2;
const DOWN_ARROW  = 3;

let Gui: any;
let buttonSet: RaphaelSet;
let navButtonSet: RaphaelSet;
let exploreButtonSet: RaphaelSet;
let menuButtonSet: RaphaelSet;
const buttons: Button[] = [];
const navButtons: Button[] = [];
const exploreButtons: Button[] = [];
const menuButtons: Button[] = [];

let keyDownValid: boolean;

export class Input {

	static get keyDownValid() { return keyDownValid; }
	static set keyDownValid(valid) { keyDownValid = valid; }

	static get buttons() { return buttons; }
	static get navButtons() { return navButtons; }
	static get exploreButtons() { return exploreButtons; }
	static get menuButtons() { return menuButtons; }

	static get exploreButtonSet() { return exploreButtonSet; }
	static get menuButtonSet() { return menuButtonSet; }

	public static Init(gui: any) {
		Gui = gui;
		// let canvas = document.getElementById("canvas");

		window.onkeydown   = Input.Keydown;
		window.onkeyup     = Input.Keyup;
		/*
		canvas.onmousedown = Mousedown;
		canvas.onmouseup   = Mouseup;
		canvas.onmousemove = Mousemove;
		*/

		keyDownValid     = true;

		buttonSet        = Gui.canvas.set();
		navButtonSet     = Gui.canvas.set();
		exploreButtonSet = Gui.canvas.set();
		menuButtonSet    = Gui.canvas.set();

		Input.InitButtons();

		Input.InitMenuButtons();
	}

	// Init functions for the button sets
	public static InitButtons() {
		const offset = {x: 270, y: 600};

		let button: Button;
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 4; x++) {
				button = new Button(Gui, {x : offset.x + 162 * x, y : offset.y + 40 * y, w : 155, h : 35}, "Button" + (x + y * 5), undefined, true, Images.imgButtonEnabled, Images.imgButtonDisabled);
				buttons.push(button);
				buttonSet.push(button.set);
			}

			button = new Button(Gui, {x : offset.x + 162 * 4, y : offset.y + 40 * y, w : 75, h : 35}, "Nav" + y, undefined, true, Images.imgNavButtonEnabled, Images.imgNavButtonDisabled);
			navButtons.push(button);
			navButtonSet.push(button.set);
		}
		for (let y = 0; y < 8; y++) {
			button = new Button(Gui, {x : 1100, y : 375 + 40 * y, w : 155, h : 35}, "Exp" + y, undefined, true, Images.imgButtonEnabled, Images.imgButtonDisabled, true);
			exploreButtons.push(button);
			exploreButtonSet.push(button.set);
		}
		button = new Button(Gui, {x : 150, y : 590, w : 50, h : 50}, "", undefined, true, Images.imgWaitEnabled, Images.imgWaitDisabled);
		exploreButtons.push(button);
		exploreButtonSet.push(button.set);
		button = new Button(Gui, {x : 150, y : 590, w : 50, h : 50}, "", undefined, true, Images.imgSleepEnabled, Images.imgSleepDisabled);
		exploreButtons.push(button);
		exploreButtonSet.push(button.set);
		button = new Button(Gui, {x : 210, y : 590, w : 50, h : 50}, "", undefined, true, Images.imgSearchEnabled, Images.imgSearchDisabled);
		exploreButtons.push(button);
		exploreButtonSet.push(button.set);
	}

	public static InitMenuButtons() {
		const offset = {x: 15, y: 620};

		// TOP, Data menu
		const button = new Button(Gui, {x : 10, y : 10, w : 155, h : 35}, "DATA", undefined, true, Images.imgButtonEnabled, Images.imgButtonDisabled);
		menuButtons.push(button);
		menuButtonSet.push(button.set);
	}
	public static RenderExploreButtonGlow() {
		// Add a glow effect if this button is the currently choosen exploration option
		for (const button of exploreButtons) {
			if (!button.image.is_visible()) { continue; }
			if (!button.glow) { continue; }
			if (button === Gui.GetLastSubmenu()) {
				button.glow.show();
			} else {
				button.glow.hide();
			}
		}
	}

	// Catches keypresses
	public static Keydown(event: any) {
		// Used for text input, when we don't want to have shortcut keys active
		if (!Input.keyDownValid) {
			return true;
		}

		// event.preventDefault();

		// TODO: Prioritze layers
		switch (gameState) {
			case GameState.Game:
				for (const button of menuButtons) {
					button.HandleKeydown(event.keyCode);
				}
				for (const button of exploreButtons) {
					button.HandleKeydown(event.keyCode);
				}
			case GameState.Event:
			case GameState.Credits:
			case GameState.Combat:
			case GameState.Cavalcade:
				for (const button of buttons) {
					button.HandleKeydown(event.keyCode);
				}
				for (const button of navButtons) {
					button.HandleKeydown(event.keyCode);
				}
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
	public static Keyup(event: any) {
		/* TODO Not really used atm
		switch(event.keyCode) {
			case Keys.KEY_A: Input.keyinput[LEFT_ARROW]  = false; break;
			case Keys.KEY_D: Input.keyinput[RIGHT_ARROW] = false; break;
			case Keys.KEY_W: Input.keyinput[UP_ARROW]    = false; break;
			case Keys.KEY_S: Input.keyinput[DOWN_ARROW]  = false; break;
		} */
		return true;
	}

	constructor() {}

}
