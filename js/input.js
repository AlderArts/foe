
Input = {
	
	//TODO: Raphael sets?
	buttons        : new Array(),
	navButtons     : new Array(),
	exploreButtons : new Array(),
	menuButtons    : new Array(),
	// Input array that holds the inputs keys as true/false values
	keyinput       : new Array(),
	
	keyDownValid   : true,
	
	// Mouse button states and mouse position
	mousebutton    : false,
	MousePos       : {x: 0, y: 0}
}


// Initialize input callbacks
Input.Init = function() {
	var canvas = document.getElementById("canvas");

    window.onkeydown   = Input.Keydown;
    window.onkeyup     = Input.Keyup;
    /*
    canvas.onmousedown = Mousedown;
    canvas.onmouseup   = Mouseup;
    canvas.onmousemove = Mousemove;
    */

    Input.buttonSet        = Gui.canvas.set();
    Input.navButtonSet     = Gui.canvas.set();
    Input.exploreButtonSet = Gui.canvas.set();
    Input.menuButtonSet    = Gui.canvas.set();

    Input.InitButtons();
    
    Input.InitMenuButtons();
}

// Init functions for the button sets
Input.InitButtons = function() {
	var offset = {x: 270, y:600};
	
	var x, y, button;
	for(y = 0; y < 3; y++) {
		for(x = 0; x < 4; x++) {
			button = new Button({x : offset.x + 162*x, y : offset.y + 40*y, w : 155, h : 35}, "Button" + (x + y*5), null, true, Images.imgButtonEnabled, Images.imgButtonDisabled);
			Input.buttons.push(button);
			Input.buttonSet.push(button.set);
		}
		
		button = new Button({x : offset.x + 162*4, y : offset.y + 40*y, w : 75, h : 35}, "Nav" + y, null, true, Images.imgNavButtonEnabled, Images.imgNavButtonDisabled);
		Input.navButtons.push(button);
		Input.navButtonSet.push(button.set);
	}
	for(y = 0; y < 8; y++) {
		button = new Button({x : 1100, y : 375 + 40 * y, w : 155, h : 35}, "Exp"+y, null, true, Images.imgButtonEnabled, Images.imgButtonDisabled, true);
		Input.exploreButtons.push(button);
		Input.exploreButtonSet.push(button.set);
	}
	button = new Button({x : 150, y : 590, w : 50, h : 50}, "", null, true, Images.imgWaitEnabled, Images.imgWaitDisabled);
	Input.exploreButtons.push(button);
	Input.exploreButtonSet.push(button.set);
	button = new Button({x : 150, y : 590, w : 50, h : 50}, "", null, true, Images.imgSleepEnabled, Images.imgSleepDisabled);
	Input.exploreButtons.push(button);
	Input.exploreButtonSet.push(button.set);
	button = new Button({x : 210, y : 590, w : 50, h : 50}, "", null, true, Images.imgSearchEnabled, Images.imgSearchDisabled);
	Input.exploreButtons.push(button);
	Input.exploreButtonSet.push(button.set);
}

Input.InitMenuButtons = function() {
	var offset = {x: 15, y:620};
	
	// TOP, Data menu
	var button = new Button({x : 10, y : 10, w : 155, h : 35}, "DATA", null, true, Images.imgButtonEnabled, Images.imgButtonDisabled);
	Input.menuButtons.push(button);
	Input.menuButtonSet.push(button.set);
};

Input.RenderExploreButtonGlow = function() {
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
	for(var i = 0; i < Input.exploreButtons.length; i++) {
		if(!Input.exploreButtons[i].image.is_visible()) continue;
		if(!Input.exploreButtons[i].glow) continue;
		if(Input.exploreButtons[i] == LastSubmenu)
			Input.exploreButtons[i].glow.show();
		else
			Input.exploreButtons[i].glow.hide();
	}
}

// TODO this is actually wrong
KEY_CONSOLE = 0;

KEY_1 = 49;
KEY_2 = 50;
KEY_3 = 51;
KEY_4 = 52;
KEY_5 = 53;
KEY_6 = 54;
KEY_7 = 55;
KEY_8 = 56;
KEY_9 = 57;
KEY_0 = 48;

KEY_Q = 81;
KEY_W = 87;
KEY_E = 69;
KEY_R = 82;
KEY_T = 84;
KEY_Y = 89;
KEY_U = 85;
KEY_I = 73;
KEY_O = 79;
KEY_P = 80;
KEY_A = 65;
KEY_S = 83;
KEY_D = 68;
KEY_F = 70;
KEY_G = 71;
KEY_H = 72;
KEY_J = 74;
KEY_K = 75;
KEY_L = 76;
KEY_Z = 90;
KEY_X = 88;
KEY_C = 67;
KEY_V = 86;
KEY_B = 66;
KEY_N = 78;
KEY_M = 77;

KeyToText = {};
KeyToText[KEY_CONSOLE] = "§";

KeyToText[KEY_1] = "1";
KeyToText[KEY_2] = "2";
KeyToText[KEY_3] = "3";
KeyToText[KEY_4] = "4";
KeyToText[KEY_5] = "5";
KeyToText[KEY_6] = "6";
KeyToText[KEY_7] = "7";
KeyToText[KEY_8] = "8";
KeyToText[KEY_9] = "9";
KeyToText[KEY_0] = "0";

KeyToText[KEY_Q] = "Q";
KeyToText[KEY_W] = "W";
KeyToText[KEY_E] = "E";
KeyToText[KEY_R] = "R";
KeyToText[KEY_T] = "T";
KeyToText[KEY_Y] = "Y";
KeyToText[KEY_U] = "U";
KeyToText[KEY_I] = "I";
KeyToText[KEY_O] = "O";
KeyToText[KEY_P] = "P";
KeyToText[KEY_A] = "A";
KeyToText[KEY_S] = "S";
KeyToText[KEY_D] = "D";
KeyToText[KEY_F] = "F";
KeyToText[KEY_G] = "G";
KeyToText[KEY_H] = "H";
KeyToText[KEY_J] = "J";
KeyToText[KEY_K] = "K";
KeyToText[KEY_L] = "L";
KeyToText[KEY_Z] = "Z";
KeyToText[KEY_X] = "X";
KeyToText[KEY_C] = "C";
KeyToText[KEY_V] = "V";
KeyToText[KEY_B] = "B";
KeyToText[KEY_N] = "N";
KeyToText[KEY_M] = "M";

// Internal logical representations
LEFT_ARROW  = 0;
RIGHT_ARROW = 1;
UP_ARROW    = 2;
DOWN_ARROW  = 3;

// Catches keypresses
Input.Keydown = function(event) {
	// Used for text input, when we don't want to have shortcut keys active
	if(!Input.keyDownValid)
		return true;
		
	//event.preventDefault();
	
	// TODO: Prioritze layers
	var i;
	switch(gameState) {
		case GameState.Game:
			for(i = 0; i < Input.menuButtons.length; i++)
				Input.menuButtons[i].HandleKeydown(event.keyCode);
			for(i = 0; i < Input.exploreButtons.length; i++)
				Input.exploreButtons[i].HandleKeydown(event.keyCode);
		case GameState.Event:
		case GameState.Credits:
		case GameState.Combat:
		case GameState.Cavalcade:
			for(i = 0; i < Input.buttons.length; i++)
				Input.buttons[i].HandleKeydown(event.keyCode);
			for(i = 0; i < Input.navButtons.length; i++)
				Input.navButtons[i].HandleKeydown(event.keyCode);
		break;
	}
	
	/* TODO Not really used atm
	switch(event.keyCode) {
		case KEY_A: Input.keyinput[LEFT_ARROW]  = true; break;
		case KEY_D: Input.keyinput[RIGHT_ARROW] = true; break;
		case KEY_W: Input.keyinput[UP_ARROW]    = true; break;
		case KEY_S: Input.keyinput[DOWN_ARROW]  = true; break;
	} */
	return true;
}

// Catches key releases
Input.Keyup = function(event) {
	/* TODO Not really used atm
	switch(event.keyCode) {
		case KEY_A: Input.keyinput[LEFT_ARROW]  = false; break;
		case KEY_D: Input.keyinput[RIGHT_ARROW] = false; break;
		case KEY_W: Input.keyinput[UP_ARROW]    = false; break;
		case KEY_S: Input.keyinput[DOWN_ARROW]  = false; break;
	} */
	return true;
}

Input.tooltip = false;
