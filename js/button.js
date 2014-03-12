/*
 * 
 * Button class, includes input handling
 * 
 */
function Button(rect, text, func, enabled, image, disabledImage) {
	this.rect    = rect;
	this.image   = image;
	this.disabledImage = disabledImage;
	this.visible = true;
	this.enabled = enabled;
	this.text    = text;
	this.func    = func;
	this.obj     = null;
	this.tooltip = null;
	this.key     = -1;
	this.state   = null; // No change
	
	this.dom = $("<div>TEXT</div>").addClass("hiddenButton");
	this.dom.css("top", rect.y + "px").css("left", rect.x + "px");
	this.dom.css("width", rect.w + "px").css("height", rect.h + "px");
	this.dom.appendTo("#container");
}

Button.prototype.setHTML = function() {
	var str = "";
	if(this.visible) {
		if(this.enabled) {
			if(this.key != -1) str += "(" + KeyToText[this.key] + ") ";
			if(this.text)      str += this.text;
			if(this.tooltip)   str += " - " + this.tooltip;
		}
		else {
			str += this.text + " (DISABLED)";
		}
	}
	
	this.dom.text(str);
}

/*
 * Shortcut key (for defines, see input.js)
 */
Button.prototype.SetKey = function(key) {
	this.key = key;
}

Button.prototype.SetEnabled = function(value) {
	this.enabled = value;
	this.setHTML();
}

Button.prototype.SetVisible = function(value) {
	this.visible = value;
	this.setHTML();
}

/*
 * This function is used to set the state of a button after it is created
 */
Button.prototype.Setup = function(text, func, enabled, obj, tooltip, state) {
	this.text    = text;
	this.func    = func;
	this.obj     = obj;
	this.visible = true;
	this.enabled = enabled;
	this.tooltip = tooltip;
	this.state   = state;
	
	this.setHTML();
}

/*
 * Set from ability
 */
Button.prototype.SetFromAbility = function(encounter, caster, ability, backPrompt) {
	this.text    = ability.name;
	this.tooltip = ability.tooltip;
	this.visible = true;
	this.enabled = ability.enabledCondition ? ability.enabledCondition(encounter, caster) : true;
	
	this.func = function() {
		ability.OnSelect(encounter, caster, backPrompt);
	}
	
	this.setHTML();
}

Button.prototype.Render = function(context, glow) {
	if(this.visible != true)
		return;
	
	context.save();
	context.translate(this.rect.x + this.rect.w/2, this.rect.y + this.rect.h / 2);
	
	
	if(glow) {
		context.save();
		context.translate(-this.rect.w/2, -this.rect.h/2);
		RenderGlow(context, this.rect, 5, glow);
		context.restore();
	}
	
	// Draw the box
	if(this.image && this.enabled) {
		context.drawImage(this.image, -this.rect.w/2, -this.rect.h/2, this.rect.w, this.rect.h);
	}
	else if(this.disabledImage && this.enabled == false) {
		context.drawImage(this.disabledImage, -this.rect.w/2, -this.rect.h/2, this.rect.w, this.rect.h);
	}
	else {
		if(this.enabled == true)
			context.fillStyle = "green";
		else
			context.fillStyle = "red";
		context.fillRect(-this.rect.w/2, -this.rect.h/2, this.rect.w, this.rect.h);
	}
	
	if(this.text.constructor == String && this.text != "")
	{
		// Set up context for drawing text
		context.lineWidth = 4;
		context.font = DEFAULT_FONT;
		
		// Calculate the size of the text given the font and text
		var metrics = context.measureText(this.text);
		
		// Render the text centered
		context.strokeStyle = "black";
		context.strokeText(this.text, -metrics.width/2, 7);
		context.fillStyle = "white";
		context.fillText(this.text, -metrics.width/2, 7);
	}
	
	var keybinding = KeyToText[this.key];
	if(Gui.ShortcutsVisible && keybinding) {
		// Render the text centered
		context.font = TINY_FONT;
		context.strokeStyle = "rgba(255,0,0,0.8)";
		context.strokeText(keybinding, this.rect.w/2-8, this.rect.h/2-2);
		context.fillStyle = "rgba(255,255,255,0.8)";
		context.fillText(keybinding, this.rect.w/2-8, this.rect.h/2-2);
	}
	
	context.restore();
}

Button.prototype.Intersects = function(mousePos) {
	if(windowWidth*mousePos.x > this.rect.x + this.rect.w) return false;
	if(windowWidth*mousePos.x < this.rect.x) return false;
	if(windowHeight*mousePos.y > this.rect.y + this.rect.h) return false;
	if(windowHeight*mousePos.y < this.rect.y) return false;
	return true;
}

Button.prototype.HandleClick = function(mousePos) {
	if(this.enabled == false) return;
	if(this.visible == false) return;
	
	if(this.Intersects(mousePos) && this.func) {
		if(this.state && gameState != GameState.Combat)
			gameState = this.state;
		try {
			this.func(this.obj);
		}
		catch(e) {
			alert(e.message + "........." + e.stack);
		}
		finally {
			Render();
		}
	}
}

Button.prototype.HandleKeydown = function(key) {
	if(this.enabled == false) return;
	if(this.visible == false) return;
	
	if(key != this.key) return;
	
	if(this.func) {
		if(this.state && gameState != GameState.Combat)
			gameState = this.state;
		try {
			this.func(this.obj);
		}
		catch(e) {
			alert(e.message + "........." + e.stack);
		}
		finally {
			Render();
		}
	}
}
