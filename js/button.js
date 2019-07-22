/*
 *
 * Button class, includes input handling
 *
 */
import * as $ from 'jquery';
import { BUTTON_FONT } from '../app';
import { gameState, GameState } from './gamestate';
import { isFunction } from './utility';

function Button(Gui, rect, text, func, enabled, image, disabledImage, glow) {
	var that = this;

	this.Gui = Gui;
	
	this.enabledImage  = image || Images.imgButtonEnabled;
	this.disabledImage = disabledImage || Images.imgButtonDisabled;
	this.visible = false;
	this.enabled = enabled;
	this.func    = func;
	this.obj     = null;
	this.tooltip = null;
	this.key     = -1;
	this.state   = null; // No change
	
	this.oldEnImagePath  = this.enabledImage;
	this.oldDisImagePath = this.disabledImage;
	
	this.set     = Gui.canvas.set();
	this.image   = Gui.canvas.image(this.enabledImage, rect.x, rect.y, rect.w, rect.h);
	this.image.node.ondragstart = function() {
		return false;
	}
	$(this.image.node).css({
		"-webkit-touch-callout": "none",
		"-webkit-user-select": "none",
		"-khtml-user-select": "none",
		"-moz-user-select": "none",
		"-ms-user-select": "none",
		"user-select": "none"
	});
	if(Button.Shadow) {
		this.text    = Gui.canvas.text((rect.x + rect.w/2)+2, (rect.y + rect.h/2)+2, text).attr(
			{fill:"#FFF", /*stroke:"#000",*/ font: BUTTON_FONT});
	}
	this.text2   = Gui.canvas.text(rect.x + rect.w/2, rect.y + rect.h/2, text).attr(
		{fill:"#000", /*stroke:"#000",*/ font: BUTTON_FONT});
	this.set.push(this.image);
	//Disable text selection
	if(Button.Shadow) {
		$(this.text.node).css({
			"-webkit-touch-callout": "none",
			"-webkit-user-select": "none",
			"-khtml-user-select": "none",
			"-moz-user-select": "none",
			"-ms-user-select": "none",
			"user-select": "none",
			"pointer-events": "none"
		});
		this.set.push(this.text);
	}
	$(this.text2.node).css({
		"-webkit-touch-callout": "none",
		"-webkit-user-select": "none",
		"-khtml-user-select": "none",
		"-moz-user-select": "none",
		"-ms-user-select": "none",
		"user-select": "none",
		"pointer-events": "none"
	});
	this.set.push(this.text2);
	if(glow) {
		this.glow = this.image.glow({width: 5, color: "green", opacity: 1});
		this.set.push(this.glow);
	}
	
	this.set.attr({
		cursor: "pointer"
	}).click(function() {
		that.HandleClick();
	}).hover(function() {
		that.HoverIn();
	}, function() {
		document.getElementById("tooltipTextArea").style.visibility = "hidden";
	});
}

Button.Shadow = false;

Button.prototype.HandleClick = function() {
	if(!this.enabled) return;
	if(!this.visible) return;

	if(this.func) {
		if(this.state && gameState != GameState.Combat)
			SetGameState(this.state);
		try {
			this.func(this.obj);
		}
		catch(e) {
			alert(e.message + "........." + e.stack);
		}
		finally {
			this.Gui.Render();
		}
	}
}

Button.prototype.HoverIn = function() {
	if(this.visible && this.enabled && this.tooltip) {
		if(isFunction(this.tooltip))
			this.tooltip(this.obj);
		else
			Text.SetTooltip(this.tooltip);
		document.getElementById("tooltipTextArea").style.visibility = "visible";
	}
	else
		document.getElementById("tooltipTextArea").style.visibility = "hidden";
}

/*
 * Shortcut key (for defines, see input.js)
 */
Button.prototype.SetKey = function(key) {
	this.key = key;
}

Button.prototype.SetEnabled = function(value) {
	if(value) {
		if(this.oldEnImagePath != this.enabledImage || this.enabled != value) {
			this.image.attr({src: this.enabledImage});
			this.oldEnImagePath  = this.enabledImage;
		}
	}
	else {
		if(this.oldDisImagePath != this.disabledImage || this.enabled != value) {
			this.image.attr({src: this.disabledImage});
			this.oldDisImagePath = this.disabledImage;
		}
	}
	this.enabled = value;
}

Button.prototype.SetVisible = function(value) {
	this.visible = value;
	if(value)
		this.set.show();
	else
		this.set.hide();
}

Button.prototype.SetVisibility = function() {
	if(this.visible)
		this.set.show();
	else
		this.set.hide();
}

Button.prototype.SetText = function(text) {
	if(Button.Shadow)
		this.text.attr({text: text});
	this.text2.attr({text: text});
}

/*
 * This function is used to set the state of a button after it is created
 */
Button.prototype.Setup = function(text, func, enabled, obj, tooltip, state) {
	this.SetText(text);
	this.func    = func;
	this.obj     = obj;
	this.SetVisible(true);
	this.SetEnabled(enabled);
	this.tooltip = tooltip;
	this.state   = state;
}

/*
 * Set from ability
 */
Button.prototype.SetFromAbility = function(encounter, caster, ability, backPrompt) {
	this.SetText(ability.name);
	this.tooltip = ability.tooltip;
	this.SetVisible(true);
	var enabled = ability.enabledCondition ? ability.enabledCondition(encounter, caster) : true;
	
	this.SetEnabled(enabled);
	
	this.func = function() {
		ability.OnSelect(encounter, caster, backPrompt);
	}
}

Button.prototype.HandleKeydown = function(key) {
	if(!this.enabled) return;
	if(!this.visible) return;
	
	if(key != this.key) return;
	
	if(this.func) {
		if(this.state && gameState != GameState.Combat)
			SetGameState(this.state);
		try {
			this.func(this.obj);
			this.HoverIn();
		}
		catch(e) {
			alert(e.message + "........." + e.stack);
		}
		finally {
			this.Gui.Render();
		}
	}
}

export { Button };
