/*
 * 
 * Button class, includes input handling
 * 
 */
function Button(rect, text, func, enabled, image, disabledImage) {
	var that = this;
	
	this.enabledImage  = image || Images.imgButtonEnabled;
	this.disabledImage = disabledImage || Images.imgButtonDisabled;
	this.visible = true;
	this.enabled = enabled;
	this.func    = func;
	this.obj     = null;
	this.tooltip = null;
	this.key     = -1;
	this.state   = null; // No change
	
	this.set     = Gui.canvas.set();
	this.image   = Gui.canvas.image(this.enabledImage, rect.x, rect.y, rect.w, rect.h);
	this.text    = Gui.canvas.text(rect.x + rect.w/2, rect.y + rect.h/2, text).attr({stroke: "#FFF", fill:"#FFF", font: TINY_FONT});
	this.glow    = this.image.glow({width: 5, color: "green"}); // TODO
	//this.glow.hide();
	this.set.push(this.image);
	this.set.push(this.text);
	this.set.push(this.glow);
	
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

Button.prototype.HandleClick = function() {
	if(this.enabled == false) return;
	if(this.visible == false) return;

	if(this.func) {
		if(this.state && gameState != GameState.Combat)
			SetGameState(this.state);
		try {
			this.func(this.obj);
		}
		catch(e) {
			alert(e.message + "........." + e.stack);
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
	if(value)
		this.image.attr({src: this.enabledImage});
	else
		this.image.attr({src: this.disabledImage});
	this.enabled = value;
}

Button.prototype.SetVisible = function(value) {
	this.visible = value;
	if(value)
		this.set.show();
	else
		this.set.hide();
}

Button.prototype.SetText = function(text) {
	this.text.attr({text: text});
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
	this.SetEnabled(ability.enabledCondition ? ability.enabledCondition(encounter, caster) : true);
	
	this.func = function() {
		ability.OnSelect(encounter, caster, backPrompt);
	}
}

Button.prototype.Render = function(context, glow) {
	/*
	//TODO Glow
	if(glow) {
		context.save();
		context.translate(-this.rect.w/2, -this.rect.h/2);
		RenderGlow(context, this.rect, 5, glow);
		context.restore();
	}
	
	
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
}


Button.prototype.HandleKeydown = function(key) {
	if(this.enabled == false) return;
	if(this.visible == false) return;
	
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
	}
}
