/*
 * 
 * Button class, includes input handling
 * 
 */
function Button(rect, text, func, enabled, image, disabledImage) {
	var that = this;
	
	this.disabledImage = disabledImage;
	this.visible = true;
	this.enabled = enabled;
	this.func    = func;
	this.obj     = null;
	this.tooltip = null;
	this.key     = -1;
	this.state   = null; // No change
	
	this.set     = Gui.canvas.set();
	this.image   = Gui.canvas.image(image, rect.x, rect.y, rect.w, rect.h);
	this.text    = Gui.canvas.text(rect.x + rect.w/2, rect.y + rect.h/2, text).attr({stroke: "#FFF", fill:"#FFF", font: TINY_FONT});
	this.glow    = this.image.glow({width: 5, color: "green"});
	//this.glow.hide();
	this.set.push(this.image);
	this.set.push(this.text);
	this.set.push(this.glow);
	
	this.set.attr({
		cursor: "pointer"
	}).click(function() {
		that.HandleClick();
	});
}

Button.prototype.HandleClick = function() {
	if(this.enabled == false) return;
	if(this.visible == false) return;

	if(this.func) {
		if(this.state && gameState != GameState.Combat)
			gameState = this.state;
		try {
			this.func(this.obj);
		}
		catch(e) {
			alert(e.message + "........." + e.stack);
		}
	}
}

/*
 * Shortcut key (for defines, see input.js)
 */
Button.prototype.SetKey = function(key) {
	this.key = key;
}

Button.prototype.SetEnabled = function(value) {
	this.enabled = value;
}

Button.prototype.SetVisible = function(value) {
	this.visible = value;
	if(value)
		this.set.show();
	else
		this.set.hide();
}

/*
 * This function is used to set the state of a button after it is created
 */
Button.prototype.Setup = function(text, func, enabled, obj, tooltip, state) {
	this.text.attr({text: text});
	this.func    = func;
	this.obj     = obj;
	this.SetVisible(true);
	this.enabled = enabled;
	this.tooltip = tooltip;
	this.state   = state;
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
}

Button.prototype.Render = function(context, glow) {
	/*
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
	*/
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
	}
}
