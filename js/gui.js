
Gui = {}
Gui.w = 1280;
Gui.h = 720;

Gui.textArea = {
	x: 270,
	y: 65,
	w: 740,
	h: 530,
	inset: 4,
	pad: {x: 20, y:10}
};

Gui.tooltipArea = {
	x: 1075,
	y: 195,
	w: 190,
	h: 390
};

Gui.inputtextArea = {
	x: 500,
	y: 175
};

Gui.barWidth = 145;

Raphael.el.is_visible = function() {
    return (this.node.style.display !== "none");
}

Gui.Init = function() {
	Gui.canvas = Raphael("wrap");
	Gui.canvas.setViewBox(0,0,Gui.w,Gui.h,true);
	Gui.canvas.setSize('100%', '100%');
	Gui.bg = Gui.canvas.image(Images.bg, 0, 0, Gui.w, Gui.h);
	var svg = document.querySelector("svg");
	svg.removeAttribute("width");
	svg.removeAttribute("height");
	
	Gui.fonts = {
		Kimberley : Gui.canvas.getFont("Kimberley Bl")
	};
	
	Gui.canvas.rect(Gui.textArea.x, Gui.textArea.y, Gui.textArea.w, Gui.textArea.h).attr({"stroke-width": Gui.textArea.inset});
	Gui.debug = Gui.canvas.text(1230, 700, "Debug").attr({stroke: "#F00", fill:"#F00", font: SMALL_FONT}).hide();
	GuiResize();
	
	Gui.party = Gui.canvas.set();
	Gui.partyObj = [];
	for(var i = 0; i < 4; ++i)
		Gui.SetupPortrait(20, 75+120*i, Gui.party, Gui.partyObj, true);
	Gui.enemy = Gui.canvas.set();
	Gui.enemyObj = [];
	for(var i = 0; i < 4; ++i)
		Gui.SetupPortrait(1020, 75+120*i, Gui.enemy, Gui.enemyObj, false);
		
	// Cavalcade
	Gui.cavalcade = Gui.canvas.set();
	Gui.cavalcadeObj = {};
	Gui.cavalcadeObj.p = [];
	Gui.SetupCavalcadeHand(20, 75, Gui.cavalcade, Gui.cavalcadeObj.p);
	Gui.SetupCavalcadeHand(1020, 75+120*0, Gui.cavalcade, Gui.cavalcadeObj.p);
	Gui.SetupCavalcadeHand(1020, 75+200*1, Gui.cavalcade, Gui.cavalcadeObj.p);
	Gui.SetupCavalcadeHand(1020, 75+200*2, Gui.cavalcade, Gui.cavalcadeObj.p);
	
	var houseObj = [];
	for(var i = 0; i < 3; ++i) {
		var card = Gui.canvas.image(Images.card_back, 25+60*i, 380+25*i, 106, 150);
		houseObj.push(card);
		Gui.cavalcade.push(card);
	}
	Gui.cavalcadeObj.house = houseObj;
	
	Gui.cavalcadeObj.round      = {};
	Gui.cavalcadeObj.roundFixed = {};
	Gui.cavalcadeObj.pot        = {};
	Gui.cavalcadeObj.potFixed   = {};
	Gui.PrintGlow(Gui.cavalcade, Gui.cavalcadeObj.roundFixed, 550, 620, "Round:", Gui.fonts.Kimberley, 20, "start", {opacity: 1});
	Gui.PrintGlow(Gui.cavalcade, Gui.cavalcadeObj.potFixed,   550, 670, "Pot:",   Gui.fonts.Kimberley, 20, "start", {opacity: 1});
	
	Gui.overlay   = Gui.canvas.set();
	Gui.location  = {};
	Gui.coinFixed = {};
	Gui.coin      = {};
	Gui.PrintGlow(Gui.overlay, Gui.coinFixed, 10, 690, "Coin:", Gui.fonts.Kimberley, 20, "start", {opacity: 1});
	Gui.dateFixed = {};
	Gui.date      = {};
	Gui.PrintGlow(Gui.overlay, Gui.dateFixed, 880, 15, "Date:", Gui.fonts.Kimberley, 20, "start", {opacity: 1});
	Gui.timeFixed = {};
	Gui.time      = {};
	Gui.PrintGlow(Gui.overlay, Gui.timeFixed, 880, 45, "Time:", Gui.fonts.Kimberley, 20, "start", {opacity: 1});

	Gui.clock = {};
	Gui.clock.x = 840;
	Gui.clock.y = 33;
	Gui.clock.r = 25;
	Gui.overlay.push(Gui.canvas.circle(Gui.clock.x, Gui.clock.y, Gui.clock.r).attr({"fill": "#000"}));
	Gui.overlay.push(Gui.canvas.circle(Gui.clock.x, Gui.clock.y, Gui.clock.r*0.97).attr({fill: "rhsb(.1 , .5, .95)-hsb(.1 , 1, .45)"}));
	for(var i = 0; i < 12; i++) {
		var start_x = Gui.clock.x+Math.round(Gui.clock.r*0.8*Math.cos(30*i*Math.PI/180));
		var start_y = Gui.clock.y+Math.round(Gui.clock.r*0.8*Math.sin(30*i*Math.PI/180));
		var end_x   = Gui.clock.x+Math.round(Gui.clock.r*Math.cos(30*i*Math.PI/180));
		var end_y   = Gui.clock.y+Math.round(Gui.clock.r*Math.sin(30*i*Math.PI/180));    
		Gui.overlay.push(Gui.canvas.path("M"+start_x+" "+start_y+"L"+end_x+" "+end_y).attr({stroke: "#000", "stroke-width": 3}));
	}
    Gui.clock.hour   = Gui.canvas.path("M"+Gui.clock.x+" "+Gui.clock.y+"L"+Gui.clock.x+" "+(Gui.clock.y-Gui.clock.r/2)).attr({stroke: "#000", "stroke-width": 5});
    Gui.clock.minute = Gui.canvas.path("M"+Gui.clock.x+" "+Gui.clock.y+"L"+Gui.clock.x+" "+(Gui.clock.y-5*Gui.clock.r/6)).attr({stroke: "#000", "stroke-width": 3});
    Gui.overlay.push(Gui.canvas.circle(Gui.clock.x, Gui.clock.y, Gui.clock.r/20).attr("fill", "#000"));
    Gui.overlay.push(Gui.clock.hour);
    Gui.overlay.push(Gui.clock.minute);
    
    // Set up key listeners (input.js)
    Input.Init();
    
	// Set bg    
	Gui.BgColor = localStorage["bgcolor"] || "rgba(255, 255, 255, 0.2)";
    document.getElementById("mainTextArea").style.backgroundColor = Gui.BgColor;
    Gui.FontFamily = localStorage["fontFamily"] || "Georgia, sans-serif, \"Arial\", \"Helvetica\"";
    document.getElementById("mainTextArea").style.fontFamily = Gui.FontFamily;
    Gui.FontSize = localStorage["fontSize"] || "large";
    document.getElementById("mainTextArea").style.fontSize = Gui.FontSize;
    Gui.ShortcutsVisible = parseInt(localStorage["ShortcutsVisible"]) == 1;
    
    // Basic menu
    Input.menuButtons[0].Setup("Data", DataPrompt, true);

    // Setup keyboard shortcuts
    // Row 1
    Input.buttons[0].SetKey(KEY_1);
    Input.buttons[1].SetKey(KEY_2);
    Input.buttons[2].SetKey(KEY_3);
    Input.buttons[3].SetKey(KEY_4);
    Input.navButtons[0].SetKey(KEY_5);
    // Row 2
   	Input.buttons[4].SetKey(KEY_Q);
    Input.buttons[5].SetKey(KEY_W);
    Input.buttons[6].SetKey(KEY_E);
    Input.buttons[7].SetKey(KEY_R);
    Input.navButtons[1].SetKey(KEY_T);
    // Row 3
    Input.buttons[8].SetKey(KEY_A);
    Input.buttons[9].SetKey(KEY_S);
    Input.buttons[10].SetKey(KEY_D);
    Input.buttons[11].SetKey(KEY_F);
    Input.navButtons[2].SetKey(KEY_G);
    
    // Explore buttons
    Input.exploreButtons[ExploreButtonIndex.Wait].SetKey(KEY_Z);
    Input.exploreButtons[ExploreButtonIndex.Sleep].SetKey(KEY_Z);
    Input.exploreButtons[ExploreButtonIndex.Look].SetKey(KEY_X);
    
    Input.exploreButtons[ExploreButtonIndex.Explore].SetKey(KEY_6);
    Input.exploreButtons[ExploreButtonIndex.Party].SetKey(KEY_7);
    Input.exploreButtons[ExploreButtonIndex.Items].SetKey(KEY_8);
    Input.exploreButtons[ExploreButtonIndex.Ability].SetKey(KEY_9);
    Input.exploreButtons[ExploreButtonIndex.Alchemy].SetKey(KEY_0);
    Input.exploreButtons[ExploreButtonIndex.Quests].SetKey(KEY_U);
    
    
    Input.menuButtons[0].SetKey(KEY_CONSOLE);
        
    Gui.ClearButtons();
}

Gui.Print = function(x, y, text, font, size, align) {
	align = align || "start";
	var t = Gui.canvas.print(x, y, text, font, size);
	var bb = t.getBBox();
	if(align == "middle")
		t.translate(-bb.width/2, 0);
	else if(align == "end")
		t.translate(-bb.width, 0);
	return t;
}

Gui.PrintGlow = function(set, obj, x, y, text, font, size, align, glow) {
	if(text != obj.str) {
		obj.str = text;
		if(obj.text) {
			set.exclude(obj.text);
			set.exclude(obj.glow);
			obj.text.remove();
			obj.glow.remove();
		}
		obj.text = Gui.Print(x, y, text, font, size, align).attr({fill: "#fff"});
		obj.glow = obj.text.glow(glow);
		set.push(obj.text);
		set.push(obj.glow);
	}
	else {
		obj.text.show();
		obj.glow.show();
	}
}

Gui.PrintShow = function(obj) {
	obj.text.show();
	obj.glow.show();
}

Gui.SetupPortrait = function(xoffset, yoffset, set, obj, isParty) {
	var barStart   = 85;
	var barWidth   = Gui.barWidth;
	var barHeigth  = 30;
	var border     = 6;
	var barOffsetX = 6;
	var barOffsetY = 30;
	
	var glowColor = (isParty) ? "green" : "red";
	
	var charSet   = Gui.canvas.set();
	var statusSet = Gui.canvas.set();
	var portrait  = Gui.canvas.image(Images.pc_male, xoffset, yoffset, 100, 100);
	var local = {
		xoffset : xoffset,
		yoffset : yoffset,
		portrait: portrait,
		name    : {},
		lvl     : {},
		status  : [],
		glow    : portrait.glow({opacity: 1, color: glowColor}),
		hpBack  : Gui.canvas.rect(xoffset+barStart, yoffset+10, barWidth, barHeigth).attr({"stroke-width": border, stroke: "#000", fill: "#000"}),
		hpBar   : Gui.canvas.rect(xoffset+barStart, yoffset+10, barWidth, barHeigth).attr({fill: "#f00"}),
		hpStr   : Gui.canvas.text(xoffset+barStart+barWidth-5, yoffset+25, "9999/9999").attr({"text-anchor": "end", fill:"#fff", font: DEFAULT_FONT}),
		spBack  : Gui.canvas.rect(xoffset+barStart+barOffsetX, yoffset+10+barOffsetY, barWidth, barHeigth).attr({"stroke-width": border, stroke: "#000", fill: "#000"}),
		spBar   : Gui.canvas.rect(xoffset+barStart+barOffsetX, yoffset+10+barOffsetY, barWidth, barHeigth).attr({fill: "#00f"}),
		spStr   : Gui.canvas.text(xoffset+barStart+barWidth-5+barOffsetX, yoffset+25+barOffsetY, "9999/9999").attr({"text-anchor": "end", fill:"#fff", font: DEFAULT_FONT}),
		lpBack  : Gui.canvas.rect(xoffset+barStart+2*barOffsetX, yoffset+10+2*barOffsetY, barWidth, barHeigth).attr({"stroke-width": border, stroke: "#000", fill: "#000"}),
		lpBar   : Gui.canvas.rect(xoffset+barStart+2*barOffsetX, yoffset+10+2*barOffsetY, barWidth, barHeigth).attr({fill: "#f0f"}),
		lpStr   : Gui.canvas.text(xoffset+barStart+barWidth-5+2*barOffsetX, yoffset+25+2*barOffsetY, "9999/9999").attr({"text-anchor": "end", fill:"#fff", font: DEFAULT_FONT})
	};
	
	for(var i = 0; i < StatusList.NumStatus; i++) {
		local.status[i] = Gui.canvas.image(Images.status[StatusEffect.Burn], xoffset + 16*i + 2, yoffset + 70, 15, 15);
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
}

Gui.SetupCavalcadeHand = function(xoffset, yoffset, set, obj) {
	var charSet = Gui.canvas.set();
	
	//var portrait = Gui.canvas.image(Images.pc_male, xoffset, yoffset, 100, 100);
	var cards = [];
	cards.push(Gui.canvas.image(Images.card_back, xoffset, yoffset, 106, 150));
	cards.push(Gui.canvas.image(Images.card_back, 110+xoffset, yoffset, 106, 150));
	
	var local = {
		xoffset  : xoffset,
		yoffset  : yoffset,
		name     : {},
		coin     : {},
//		portrait : portrait,
		cards    : cards
	};
	
//	charSet.push(portrait);
	charSet.push(cards[0]);
	charSet.push(cards[1]);
	set.push(charSet);
	obj.push(local);
}

GuiResize = function() {
	var w = $(window).width();
	var h = $(window).height();
	var ratioW = w/Gui.w;
	var ratioH = h/Gui.h;
	var xpos = 0, ypos = 0, ratio = 1;
	//alert("R:" + ratio + " RW:" + ratioW + " RH:" + ratioH);
	if(ratioW / ratioH > 1) {
		xpos  = (w-ratioH*Gui.w) / 2;
		ratio = ratioH;
	}
	else {
		ypos  = (h-ratioW*Gui.h) / 2;
		ratio = ratioW;
	}
	
	var textarea = document.getElementById("mainTextWrapper");
	textarea.style.left   = xpos + ratio * (Gui.textArea.inset/2+Gui.textArea.x) +"px";
	textarea.style.top    = ypos + ratio * (Gui.textArea.inset/2+Gui.textArea.y) +"px";
	textarea.style.width  = -2*Gui.textArea.pad.x + ratio * (-Gui.textArea.inset+Gui.textArea.w) +"px";
	textarea.style.height = -2*Gui.textArea.pad.y + ratio * (-Gui.textArea.inset+Gui.textArea.h) +"px";
	
	var inputtext = document.getElementById("textInputArea");
	inputtext.style.left   = xpos + ratio * Gui.inputtextArea.x +"px";
	inputtext.style.top    = ypos + ratio * Gui.inputtextArea.y +"px";
	
	var tooltip = document.getElementById("tooltipTextArea");
	tooltip.style.left   = xpos + ratio * Gui.tooltipArea.x +"px";
	tooltip.style.top    = ypos + ratio * Gui.tooltipArea.y +"px";
	tooltip.style.width  =        ratio * Gui.tooltipArea.w +"px";
	tooltip.style.height =        ratio * Gui.tooltipArea.h +"px";
}

Gui.Callstack = new Array();


Gui.FontPicker = function(back) {
	Text.Clear();
	Text.AddOutput("Set a new font/fontsize?");
	Text.Newline();
	Text.AddOutput("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ullamcorper tempus ligula, tristique fringilla magna eleifend sed. Phasellus posuere magna id eros tincidunt porta. Fusce id blandit lectus. Cras gravida, justo eu eleifend suscipit, nunc quam sollicitudin nulla, sit amet pulvinar neque dolor non nunc. Curabitur nec nibh in lectus fermentum dictum. Mauris quis massa sapien, eu laoreet nisi. Phasellus placerat aliquet felis, sit amet euismod libero pharetra eu. Aenean dolor mi, viverra in pellentesque vitae, luctus porta felis. Mauris placerat turpis eu nibh aliquet vel euismod nulla convallis. Morbi tellus dolor, pulvinar ut vestibulum sed, mattis vel diam. Curabitur ac tellus risus.");
	Text.Newline();
	Text.AddOutput("Integer posuere quam at odio pharetra dignissim sollicitudin leo accumsan. Curabitur eu pharetra urna. Vivamus et gravida tortor. Morbi vel porttitor urna. Donec vitae rutrum urna. Integer elit orci, gravida eget viverra et, tincidunt quis est. Aliquam erat volutpat. Sed euismod rutrum lectus, nec vehicula turpis volutpat et. Nulla mauris felis, eleifend a fringilla id, faucibus eget purus. Donec in neque in ligula condimentum lobortis.");
	
	var options = new Array();
	options.push({ nameStr : "Reset",
		func : function() {
		    Gui.FontFamily = "Georgia, sans-serif, \"Arial\", \"Helvetica\"";
		    document.getElementById("mainTextArea").style.fontFamily = Gui.FontFamily;
		    Gui.FontSize = "large";
		    document.getElementById("mainTextArea").style.fontSize = Gui.FontSize;
		}, enabled : true
	});
	options.push({ nameStr : "Font",
		func : function() {
			var font = prompt("Please enter fonts (css: font-families) to use, in order of priority.", Gui.FontFamily || "sans-serif, Georgia")
			if(font != null && font != "") {
				Gui.FontFamily = font;
				localStorage["fontFamily"] = Gui.FontFamily;
			    document.getElementById("mainTextArea").style.fontFamily = Gui.FontFamily;
			}
		}, enabled : true
	});
	options.push({ nameStr : "Size",
		func : function() {
			var size = prompt("Please enter desired font size (css: font-size). For example: small, medium, large.", Gui.FontSize || "large")
			if(size != null && size != "") {
				Gui.FontSize = size;
				localStorage["fontSize"] = Gui.FontSize;
			    document.getElementById("mainTextArea").style.fontSize = Gui.FontSize;
			}
		}, enabled : true
	});
	
	Gui.SetButtonsFromList(options, true, back);
}


Gui.BgColorPicker = function(back) {
	Text.Clear();
	Text.AddOutput("Set a new background color?");
	
	var options = new Array();
	options.push({ nameStr : "Light",
		func : function() {
			Gui.BgColor = "rgba(255, 255, 255, 0.2)";
			localStorage["bgcolor"] = Gui.BgColor;
		    document.getElementById("mainTextArea").style.backgroundColor = Gui.BgColor;
		}, enabled : true
	});
	options.push({ nameStr : "Pink",
		func : function() {
			Gui.BgColor = "rgba(240, 48, 192, 0.6)";
			localStorage["bgcolor"] = Gui.BgColor;
		    document.getElementById("mainTextArea").style.backgroundColor = Gui.BgColor;
		}, enabled : true
	});
	options.push({ nameStr : "Yellow",
		func : function() {
			Gui.BgColor = "rgba(240, 192, 48, 0.6)";
			localStorage["bgcolor"] = Gui.BgColor;
		    document.getElementById("mainTextArea").style.backgroundColor = Gui.BgColor;
		}, enabled : true
	});
	options.push({ nameStr : "Cyan",
		func : function() {
			Gui.BgColor = "rgba(48, 240, 192, 0.6)";
			localStorage["bgcolor"] = Gui.BgColor;
		    document.getElementById("mainTextArea").style.backgroundColor = Gui.BgColor;
		}, enabled : true
	});
	options.push({ nameStr : "Blue",
		func : function() {
			Gui.BgColor = "rgba(48, 192, 240, 0.6)";
			localStorage["bgcolor"] = Gui.BgColor;
		    document.getElementById("mainTextArea").style.backgroundColor = Gui.BgColor;
		}, enabled : true
	});
	options.push({ nameStr : "Green",
		func : function() {
			Gui.BgColor = "rgba(120, 240, 48, 0.6)";
			localStorage["bgcolor"] = Gui.BgColor;
		    document.getElementById("mainTextArea").style.backgroundColor = Gui.BgColor;
		}, enabled : true
	});
	options.push({ nameStr : "Purple",
		func : function() {
			Gui.BgColor = "rgba(192, 48, 240, 0.6)";
			localStorage["bgcolor"] = Gui.BgColor;
		    document.getElementById("mainTextArea").style.backgroundColor = Gui.BgColor;
		}, enabled : true
	});
	options.push({ nameStr : "None",
		func : function() {
			Gui.BgColor = "rgba(0, 0, 0, 0.0)";
			localStorage["bgcolor"] = Gui.BgColor;
		    document.getElementById("mainTextArea").style.backgroundColor = Gui.BgColor;
		}, enabled : true
	});
	options.push({ nameStr : "Custom",
		func : function() {
			var col = prompt("Please enter desired background color. Format is rgba(R,G,B,A). Colors are in the range 0-255. Opacity is in the range 0-1.", Gui.BgColor || "rgba(255,255,255,1.0)")
			if(col != null && col != "") {
				Gui.BgColor = col;
				localStorage["bgcolor"] = Gui.BgColor;
			    document.getElementById("mainTextArea").style.backgroundColor = Gui.BgColor;
			}
		}, enabled : true
	});
	
	Gui.SetButtonsFromList(options, true, back);
}

Gui.ClearChoiceButtons = function() {
	for(var i = 0; i < Input.buttons.length; i++)
		Input.buttons[i].SetVisible(false);
}

Gui.ClearButtons = function() {
	for(var i = 0; i < Input.buttons.length; i++) {
		Input.buttons[i].enabledImage = Images.imgButtonEnabled;
		Input.buttons[i].SetVisible(false);
	}
	for(var i = 0; i < Input.navButtons.length; i++)
		Input.navButtons[i].SetVisible(false);
	for(var i = 0; i < Input.exploreButtons.length; i++)
		Input.exploreButtons[i].SetVisible(false);
}

Gui.NextPrompt = function(func, text, tooltip) {
	Gui.ClearButtons();
	//text, func, enabled, obj, tooltip, state
	Input.buttons[0].Setup(text || "Next", func || PrintDefaultOptions, true, null, tooltip);
}

Gui.SetButtonPage = function(list, page, state) {
	Gui.ClearChoiceButtons();
	var i,j;
	
	for(i=0, j=page*Input.buttons.length; i<Input.buttons.length && j<list.length; i++, j++) {
		var name = list[j].nameStr || "NULL";
		var func = list[j].func;
		var en = list[j].enabled || false;
		Input.buttons[i].enabledImage = list[j].image || Images.imgButtonEnabled;
		Input.buttons[i].Setup(name, func, en, list[j].obj, list[j].tooltip, state);
	}
}

Gui.SetButtonsFromList = function(list, backEnabled, backFunc, state, backState) {	
	Gui.ClearButtons();
	var currentPage = 0;
	backFunc = backFunc || PrintDefaultOptions;
	
	Gui.SetButtonPage(list, currentPage, state);
	
	var updateNav = function()
	{
		Input.navButtons[0].Setup(">>",
			function() {
				if(currentPage < (list.length / Input.buttons.length) - 1) {
					currentPage++;
					Gui.SetButtonPage(list, currentPage, state);
					updateNav();
				}
			}, true);
		Input.navButtons[0].SetVisible((list.length > Input.buttons.length &&
			currentPage < (list.length / Input.buttons.length) - 1));
		Input.navButtons[1].Setup("<<",
			function() {
				if(currentPage > 0) {
					currentPage--;
					Gui.SetButtonPage(list, currentPage, state);
					updateNav();
				}
			}, true);
		Input.navButtons[1].SetVisible((list.length > Input.buttons.length &&
			currentPage > 0));
		if(backEnabled)
			Input.navButtons[2].Setup("Back", backFunc, true);
	}
	
	updateNav();
	
	return function() { return currentPage; }
}

Gui.SetButtonCollectionPage = function(encounter, caster, list, ret, page) {
	Gui.ClearChoiceButtons();
	var i,j;
	for(i=0, j=page*Input.buttons.length; i<Input.buttons.length && j<list.length; i++, j++) {
		Input.buttons[i].SetFromAbility(encounter, caster, list[j], ret);
	}
}

Gui.SetButtonsFromCollection = function(encounter, caster, list, ret, backFunc) {	
	Gui.ClearButtons();
	var currentPage = 0;
	
	Gui.SetButtonCollectionPage(encounter, caster, list, ret, currentPage);
	
	var updateNav = function()
	{
		Input.navButtons[0].Setup(">>",
			function() {
				if(currentPage < (list.length / Input.buttons.length) - 1) {
					currentPage++;
					Gui.SetButtonCollectionPage(encounter, caster, list, ret, currentPage);
					updateNav();
				}
			}, true);
		Input.navButtons[0].SetVisible((list.length > Input.buttons.length &&
			currentPage < (list.length / Input.buttons.length) - 1));
		Input.navButtons[1].Setup("<<",
			function() {
				if(currentPage > 0) {
					currentPage--;
					Gui.SetButtonCollectionPage(encounter, caster, list, ret, currentPage);
					updateNav();
				}
			}, true);
		Input.navButtons[1].SetVisible((list.length > Input.buttons.length &&
			currentPage > 0));
		if(backFunc)
			Input.navButtons[2].Setup("Back", backFunc, true);
	}
	
	updateNav();
}

Gui.RenderParty = function(p, set, obj, max) {
	max = max || 4;
	var i = 0;
	for(; i < p.Num() && i < max; ++i) {
		var c = p.Get(i);
		set[i].show();
		Gui.RenderEntity(c, set[i], obj[i]);
		if(gameState != GameState.Combat || c != currentActiveChar)
			obj[i].glow.hide();
	}
	for(; i < 4 && i < max; ++i)
		set[i].hide();
}
Gui.RenderEntity = function(entity, set, obj) {
	/*
	var local = {
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
	
	// TODO: Wait for Google Chrome to fix SVG opacity bug (Google Chrome v 34)
	if(entity.avatar.combat)
		obj.portrait.attr({src: entity.avatar.combat, opacity: /*entity.Incapacitated() ? .5 :*/ 1});
	
	Gui.PrintGlow(set, obj.name, obj.xoffset-5, obj.yoffset, entity.name, Gui.fonts.Kimberley, 30, "start", {opacity: 1});
	
	var hp = Math.floor(entity.curHp) / Math.floor(entity.HP());
	var hpText = Math.floor(entity.curHp) + "/" + Math.floor(entity.HP());
	obj.hpStr.attr({text: hpText});
	obj.hpBar.stop().animate({width: hp*Gui.barWidth}, 500, "<>");
	var sp = Math.floor(entity.curSp) / Math.floor(entity.SP());
	var spText = Math.floor(entity.curSp) + "/" + Math.floor(entity.SP());
	obj.spStr.attr({text: spText});
	obj.spBar.stop().animate({width: sp*Gui.barWidth}, 500, "<>");
	var lust = Math.floor(entity.curLust) / Math.floor(entity.Lust());
	var lustText = Math.floor(entity.curLust) + "/" + Math.floor(entity.Lust());
	obj.lpStr.attr({text: lustText});
	obj.lpBar.stop().animate({width: lust*Gui.barWidth}, 500, "<>");
	
	var levelText = "Lvl " + entity.level + "/" + entity.sexlevel;
	if(entity.currentJob) {
		var jd  = entity.jobs[entity.currentJob.name];
		if(jd) {
			// Check for maxed out job
			var master   = jd.job.Master(entity);
			if(master) levelText += "/*";
			else       levelText += "/" + jd.level;
		}
	}
	
	Gui.PrintGlow(set, obj.lvl, obj.xoffset-3, obj.yoffset+96, levelText, Gui.fonts.Kimberley, 14, "start", {opacity: 1, width: 5});
	
	obj.lvl.text.attr({fill: entity.pendingStatPoints > 0 ? "green" : "white"});
	
	entity.combatStatus.Render(obj.status);
}

Gui.RenderLocation = function() {
	var name = party.location.nameFunc;
	var nameStr;
	if(isFunction(name))
		nameStr = name();
	else if(name)
		nameStr = name;
	else
		nameStr = "???";

	Gui.PrintGlow(Gui.overlay, Gui.location, 300, 30, nameStr, Gui.fonts.Kimberley, 30, "start", {opacity: 1});
}

Gui.RenderTime = function() {
	var coinStr = party.coin;
	Gui.PrintGlow(Gui.overlay, Gui.coin, 250, 690, coinStr, Gui.fonts.Kimberley, 20, "end", {opacity: 1});

	var dateStr = world.time.DateString();
	Gui.PrintGlow(Gui.overlay, Gui.date, 1245, 15, dateStr, Gui.fonts.Kimberley, 20, "end", {opacity: 1});
	
	var timeStr = world.time.TimeString();
	Gui.PrintGlow(Gui.overlay, Gui.time, 1245, 45, timeStr, Gui.fonts.Kimberley, 20, "end", {opacity: 1});
	
	var hour   = world.time.ToHours();
	var minute = world.time.ToMinutes();
	
	if(Gui.clock.hourNum) {
		Gui.clock.hour.stop().animate({transform:"r"+(hour/12*360)+","+Gui.clock.x+","+Gui.clock.y}, 2000, "<>");
		Gui.clock.minute.stop().animate({transform:"r"+(minute/60*360)+","+Gui.clock.x+","+Gui.clock.y}, 2000, "<>");
	}
	else {
		Gui.clock.hour.transform("r"+(hour/12*360)+","+Gui.clock.x+","+Gui.clock.y);
		Gui.clock.minute.transform("r"+(minute/60*360)+","+Gui.clock.x+","+Gui.clock.y);
	}
	Gui.clock.hourNum   = hour;
	Gui.clock.minuteNum = minute;
}

Gui.SetGameState = function(state) {
	switch(gameState) {
		case GameState.Game:
			for(var i = 0; i < Input.menuButtons.length; i++)
				Input.menuButtons[i].SetVisibility();
			for(var i = 0; i < Input.exploreButtons.length; i++)
				Input.exploreButtons[i].SetVisibility();
			break;
		case GameState.Event:
		case GameState.Credits:
		case GameState.Combat:
		case GameState.Cavalcade:
			Input.menuButtonSet.hide();
			Input.exploreButtonSet.hide();
		break;
	}
	for(var i = 0; i < Input.buttons.length; i++)
		Input.buttons[i].SetVisibility();
	for(var i = 0; i < Input.navButtons.length; i++)
		Input.navButtons[i].SetVisibility();
}

Gui.Render = function() {
	Gui.cavalcade.hide();
	
	switch (gameState) {
		case GameState.Credits:
			Gui.overlay.hide();
			Gui.party.hide();
			Gui.enemy.hide();
			break;
		
		case GameState.Combat:
			if(enemyParty)
				Gui.RenderParty(enemyParty, Gui.enemy, Gui.enemyObj);
			else
				Gui.enemy.hide();
			
		case GameState.Game:
		case GameState.Event:
			if(gameState == GameState.Game) {
				Input.RenderExploreButtonGlow();
			}
			if(gameState == GameState.Game || gameState == GameState.Event) {
				Gui.enemy.hide();
			}
			// TODO: !RENDER_PICTURES
			Gui.RenderParty(party, Gui.party, Gui.partyObj);
			
			// TODO: Time
			Gui.RenderTime();
			Gui.RenderLocation();
			Gui.overlay.show();
			
			break;
		case GameState.Cavalcade:
			Gui.party.hide();
			Gui.enemy.hide();
			var set  = Gui.cavalcade;
			
			for(var i=0,j=cavalcade.players.length; i<j; i++) {
				var p    = cavalcade.players[i];
				var obj  = Gui.cavalcadeObj.p[i];
				/*
				if(p.avatar.combat) {
					obj.portrait.attr({src: p.avatar.combat, opacity: p.folded ? .5 : 1}).show();
				}
				*/
				Gui.PrintGlow(set, obj.name, obj.xoffset-5, obj.yoffset, p.name, Gui.fonts.Kimberley, 30, "start", {opacity: 1});
				
				Gui.PrintGlow(set, obj.coin, obj.xoffset+215, obj.yoffset,
					p.out ? "Out" : p.purse.coin,
					Gui.fonts.Kimberley, 30, "end", {opacity: 1});
				
				var cards = obj.cards;
				
				for(var k=0; k < 2; k++) {
					// Show cards when game is complete
					var showCard = cavalcade.round > 4;
					// don't show folded opponents
					if(p.folded) showCard = false;
					showCard |= p == player; // always show own
	
					if(showCard && k < p.hand.length)
						cards[k].attr({src: p.hand[k].Img}).show();
					else
						cards[k].attr({src: Images.card_back}).show();
				}
			}
			
			for(var i=0,j=cavalcade.house.length; i<j; i++) {
				var card = Gui.cavalcadeObj.house[i];
				// Show cards when game is complete
				var showCard = cavalcade.round > i + 1;
				if(showCard)
					card.attr({src: cavalcade.house[i].Img}).show();
				else
					card.attr({src: Images.card_back}).show();
			}
			
			var potStr   = cavalcade.pot;
			var roundStr = cavalcade.round - 1;
			if(roundStr < 1) roundStr = 1;
			if(roundStr > 3) roundStr = 3;
			Gui.PrintGlow(set, Gui.cavalcadeObj.round, 850, 620, roundStr, Gui.fonts.Kimberley, 20, "end", {opacity: 1});
			Gui.PrintGlow(set, Gui.cavalcadeObj.pot,   850, 670, potStr,   Gui.fonts.Kimberley, 20, "end", {opacity: 1});
			Gui.PrintShow(Gui.cavalcadeObj.roundFixed);
			Gui.PrintShow(Gui.cavalcadeObj.potFixed);
			
			// TODO: Time
			Gui.RenderTime();
			Gui.RenderLocation();
			Gui.overlay.show();
			break;
	}
}

Gui.RenderStatsScreen = function(context) {
	// Set up context for drawing text
	context.fillStyle = "black";
	context.textAlign = 'start';
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
	
	context.translate(300, 0);
	context.textAlign = 'right';
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
	
	context.textAlign = 'start';
	
	context.restore();
}
