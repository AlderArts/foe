
Input = {
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
    canvas.onmousedown = Mousedown;
    canvas.onmouseup   = Mouseup;
    canvas.onmousemove = Mousemove;
    
    Input.InitButtons();
    
    // TODO: For now, don't init menu since it doesn't do anything
    Input.InitMenuButtons();
}

// Init functions for the button sets
Input.InitButtons = function() {
	// Temporary stuff
	var onClick1 = function() { Text.AddOutput(" " + this.text); }
	var offset = {x: 270, y:580};
	
	var x, y;
	for(y = 0; y < 3; y++) {
		for(x = 0; x < 4; x++)
			Input.buttons.push(new Button({x : offset.x + 162*x, y : offset.y + 40*y, w : 155, h : 35}, "Button" + (x + y*5), onClick1, true, Images.imgButtonEnabled, Images.imgButtonDisabled));
		
		Input.navButtons.push(new Button({x : offset.x + 162*4, y : offset.y + 40*y, w : 75, h : 35}, "Nav" + y, onClick1, true, Images.imgNavButtonEnabled, Images.imgNavButtonDisabled));
	}
	for(y = 0; y < 8; y++) {
		Input.exploreButtons.push(new Button({x : 1055, y : 375 + 40 * y, w : 155, h : 35}, "Exp"+y, onClick1, true, Images.imgButtonEnabled, Images.imgButtonDisabled));
	}
	Input.exploreButtons.push(new Button({x : 150, y : 590, w : 50, h : 50}, "", null, true, Images.imgWaitEnabled, Images.imgWaitDisabled));
	Input.exploreButtons.push(new Button({x : 150, y : 590, w : 50, h : 50}, "", null, true, Images.imgSleepEnabled, Images.imgSleepDisabled));
	Input.exploreButtons.push(new Button({x : 210, y : 590, w : 50, h : 50}, "", null, true, Images.imgSearchEnabled, Images.imgSearchDisabled));
}

Input.InitMenuButtons = function() {
	// Temporary stuff
	var onClick1 = function() { Text.AddOutput(" " + this.text); }
	var offset = {x: 15, y:620};
	
	// TOP, Data menu
	Input.menuButtons.push(new Button({x : 10, y : 10, w : 155, h : 35}, "DATA", onClick1, true, Images.imgButtonEnabled, Images.imgButtonDisabled));
};

Input.HandleClick = function(pos) {
	// TODO: Prioritze layers
	var i;
	switch(gameState) {
		case GameState.Game:
			for(i = 0; i < Input.menuButtons.length; i++)
				Input.menuButtons[i].HandleClick(pos);
			for(i = 0; i < Input.exploreButtons.length; i++)
				Input.exploreButtons[i].HandleClick(pos);
		case GameState.Event:
		case GameState.Credits:
		case GameState.Combat:
		case GameState.Cavalcade:
			for(i = 0; i < Input.buttons.length; i++)
				Input.buttons[i].HandleClick(pos);
			for(i = 0; i < Input.navButtons.length; i++)
				Input.navButtons[i].HandleClick(pos);
		break;
	}

}

Input.RenderButtons = function(context) {
	// Debugging
	context.fillStyle = "black";
	context.font = DEFAULT_FONT;
	
	//context.fillText(Input.MousePos.x, 950, 30);
	//context.fillText(Input.MousePos.y, 950, 60);
	
	var i;
	switch(gameState) {
		case GameState.Game:
			for(i = 0; i < Input.menuButtons.length; i++)
				Input.menuButtons[i].Render(context);
			if(Input.tooltip == false) {
				// Add a glow effect if this button is the currently choosen exploration option
				for(i = 0; i < Input.exploreButtons.length; i++) {
					var glow = (Input.exploreButtons[i] == LastSubmenu) ? 'green' : null;
					Input.exploreButtons[i].Render(context, glow);
				}
			}
		case GameState.Event:
		case GameState.Credits:
		case GameState.Combat:
		case GameState.Cavalcade:
			for(i = 0; i < Input.buttons.length; i++)
				Input.buttons[i].Render(context);
			for(i = 0; i < Input.navButtons.length; i++)
				Input.navButtons[i].Render(context);
		break;
	}
}

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

	UpdateTooltip();
	
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

// Returns the relative mouse position inside the object
// Return format {x,y} in the range 0 to 1
function RelativeMousePos(event, object) {
	var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = object;

    do {
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while(currentElement = currentElement.offsetParent)

    var mouseX = (event.pageX - totalOffsetX) / windowWidth;
    var mouseY = (event.pageY - totalOffsetY) / windowHeight;
    
    return {x:mouseX, y:mouseY};
}

// Catches mouse click events
function Mousedown(event) {
	Input.MousePos = new RelativeMousePos(event, this);
	Input.mousebutton = true;
	
	Input.HandleClick(Input.MousePos);
	UpdateTooltip();
	
	return true;
}

// Catches mouse up events
function Mouseup(event) {
	Input.MousePos = new RelativeMousePos(event, this);
	Input.mousebutton = false;
	return true;
}

// Catches mouse move events
function Mousemove(event) {
	Input.MousePos = new RelativeMousePos(event, this);
	UpdateTooltip();
	return true;
}

Input.tooltip = false;

// Updates tooltip (called one mouse events and on keydown events, so no old tooltips linger)
function UpdateTooltip() {
	Input.tooltipVisible = false;
	
	for(i = 0; i < Input.buttons.length; i++) {
		var button = Input.buttons[i];
		if(button.visible && button.enabled && button.Intersects(Input.MousePos) && button.tooltip) {
			if(isFunction(button.tooltip))
				button.tooltip(button.obj);
			else
				Text.SetTooltip(button.tooltip);
			Input.tooltipVisible = true;
			break;
		}
	}
	
	if(!Input.tooltipVisible) {
		for(i = 0; i < Input.exploreButtons.length; i++) {
			var button = Input.exploreButtons[i];
			if(button.visible && button.enabled && button.Intersects(Input.MousePos) && button.tooltip) {
				if(isFunction(button.tooltip))
					button.tooltip(button.obj);
				else
					Text.SetTooltip(button.tooltip);
				Input.tooltipVisible = true;
				break;
			}
		}
	}
	
	document.getElementById("tooltipTextArea").style.visibility = Input.tooltipVisible ? "visible" : "hidden";
}
