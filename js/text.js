
Text.buffer = "";
//TODO Refactor this out. Should use a CSS class
Text.BoldColor = function(text, color) {
	color = color || "black";
	return "<b><font color =\"" + color + "\">" + text + "</font></b>";
}

Text.InsertImage = function(imgSrc, align) {
	if(!RENDER_PICTURES) return "";
	
	align = align || 'left';
	return "<img src='" + imgSrc + "' align='" + align + "' alt='MISSING IMAGE: '" + imgSrc + "' style='margin: 1px 8px;'/>";
}

Text.Say = function(imgSrc, text, align) {
	var textbox = document.getElementById("mainTextArea");
	align = align || 'left';
	text = text || "";
	
	if(RENDER_PICTURES)
		textbox.innerHTML += "<img src='" + imgSrc + "' align='" + align + "' alt='MISSING IMAGE: '" + imgSrc + "' style='margin: 1px 8px;'>" + text + "</img>";
	else
		textbox.innerHTML += text;
}
//TODO Refactor this out
Text.AddOutput = function(text, parseStrings) {
	var textbox = document.getElementById("mainTextArea");
	textbox.innerHTML += Text.Parse(text, parseStrings);
}

Text.SetTooltip = function(text, parseStrings) {
	var textbox = document.getElementById("tooltipTextArea");
	textbox.innerHTML = Text.Parse(text, parseStrings);
}

Text.Parse = function(text, parseStrings) {
	try {
		// Simple parser
		if(parseStrings) {
			var start = text.indexOf("[");
			var stop = text.indexOf("]", start);
			while(start != -1 && stop != -1) {
				var code = text.slice(start+1,stop);
				
				var replaceStr;
				if(parseStrings[code] != null) {
					replaceStr = parseStrings[code];
					if(isFunction(replaceStr))
						replaceStr = replaceStr();
				}
				else {
					replaceStr = "<b>['" + code + "' couldn't be parsed]</b>";
				}
				
				text = text.slice(0, start) + replaceStr + text.slice(stop+1);
				
				var start = text.indexOf("[", start + replaceStr.length);
				var stop = text.indexOf("]", start);
			}
		}
		
		return text;
	}
	catch(e) {
		alert(e.message + "........." + e.stack);
		return Text.BoldColor("PARSE ERROR: { " + text + " }", "red");
	}
}
//TODO Refactor this out.
Text.Newline = function() {
	var textbox = document.getElementById("mainTextArea");
	textbox.innerHTML += "<br/><br/>";
}

Text.Clear = function() {
	var textbox = document.getElementById("mainTextArea");
	textbox.innerHTML = "";
	textbox.scrollTop = 0;
	Text.buffer = "";
}

/*
 * New, buffered approach
 * 

	Text.Clear();
	
	Text.Add("Text", parse);
	Text.NL();
	Text.Add("Text", parse);
	Text.NL();
	Text.Add(Text.InsertImage("image", 'right'));
	
	Text.Flush();

 * 
 */
//TODO Would be wise to refactor/rename this to "AddSpan".
//Adds text wrapped in a span.
Text.Add = function(text, parse, cssClasses) {
	var classesStr = (cssClasses)? cssClasses : "";
	Text.buffer += "<span class=\""+classesStr+"\">"+Text.Parse(text, parse) + "</span>";
}
//Adds text wrapped in a div.
Text.AddDiv = function(text, parse, cssClasses) {
	var classesStr = (cssClasses)? cssClasses : "";
	Text.buffer += "<div class=\""+classesStr+"\">"+Text.Parse(text, parse) + "</div>";
}

Text.NL = function() {
	Text.buffer += "<br/><br/>";
}

Text.Flush = function(cssClasses) {
	var textbox = document.getElementById("mainTextArea");

	var classesStr = (cssClasses)? cssClasses : "";
		textbox.innerHTML += "<span class=\""+classesStr+"\">"+Text.buffer + "</span>";

	Text.buffer = "";
}

Text.DigitToText = function(num) {
	num = Math.floor(num);
	switch(num) {
		case 0: return "zero";
		case 1: return "one";
		case 2: return "two";
		case 3: return "three";
		case 4: return "four";
		case 5: return "five";
		case 6: return "six";
		case 7: return "seven";
		case 8: return "eight";
		case 9: return "nine";
		case 10: return "ten";
		case 11: return "eleven";
		case 12: return "twelve";
		case 13: return "thirteen";
		case 14: return "fourteen";
		case 15: return "fifteen";
		case 16: return "sixteen";
		case 17: return "seventeen";
		case 18: return "eighteen";
		case 19: return "nineteen";
		default: return num;
	}
}

Text.NumToText = function(num) {
	num = Math.floor(num);
	if(num < 0)
		return num;
	else if(num < 20)
		return Text.DigitToText(num);
	// TODO: thousands
	else if(num < 1000) {
		var ones = num % 10;
		var tens = Math.floor(num / 10) % 10;
		var hundreds = Math.floor(num / 100) % 10;
		
		var str = "";
		
		if(hundreds != 0)
			str += Text.DigitToText(hundreds) + " hundred";
		if(tens != 0) {
			if(hundreds != 0) str += " ";
			if(num % 100 < 20) {
				str += Text.DigitToText(num % 100);
				return str;
			}
			else {
				switch(tens) {
					case 2: str += "twenty"; break;
					case 3: str += "thirty"; break;
					case 4: str += "fourty"; break;
					case 5: str += "fifty"; break;
					case 6: str += "sixty"; break;
					case 7: str += "seventy"; break;
					case 8: str += "eighty"; break;
					case 9: str += "ninety"; break;
				}
			}
		}
		if(ones != 0) {
			if(hundreds != 0 && tens == 0) str += " ";
			else if(tens != 0) str += "-";
			str += Text.DigitToText(ones);
		}
		return str;
	}
	
	// Default
	return num;
}

Text.Quantify = function(num) {
	num = Math.floor(num);
	if(num < 0)
		return num;
	var r;
	switch(num) {
		case 0: return "lack";
		case 1: r = Rand(4);
		if     (r == 0) return "lone";
		else if(r == 1) return "solitary";
		else if(r == 2) return "individual";
		else            return "single";
		case 2: r = Rand(2);
		if(r == 0) return "duo";
		else       return "pair";
		case 3: r = Rand(2);
		if(r == 0) return "trio";
		else       return "triad";
		case 4: r = Rand(2);
		if(r == 0) return "quad";
		else       return "quartette";
		case 5: return "quintet";
		case 6: return "sextet";
		case 7: return "septet";
		case 8: return "octet";
		case 9: return "nonet";
		default: return "brace";
	}
}

Text.Ordinal = function(num) {
	num = Math.floor(num);
	switch(num) {
		case 1: return "first";
		case 2: return "second";
		case 3: return "third";
		case 4: return "fourth";
		case 5: return "fifth";
		case 6: return "sixth";
		case 7: return "seventh";
		case 8: return "eight";
		case 9: return "ninth";
		default: return num + "th"; // decent fallback
	}
}


Text.ParserPlural = function(parse, condition, prefix, postfix) {
	parse   = parse   || {};
	prefix  = prefix  || "";
	postfix = postfix || "";
	parse[prefix + "s" + postfix]      = condition ? "s" : "";
	parse[prefix + "notS" + postfix]   = condition ? "" : "s";
	parse[prefix + "es" + postfix]     = condition ? "es" : "";
	parse[prefix + "notEs" + postfix]  = condition ? "" : "es";
	parse[prefix + "yIes" + postfix]   = condition ? "ies" : "y";
	
	parse[prefix + "isAre" + postfix]   = condition ? "are" : "is";
	parse[prefix + "hasHave" + postfix] = condition ? "have" : "has";
	parse[prefix + "wasWere" + postfix] = condition ? "were" : "was";
	
	parse[prefix + "oneof" + postfix]  = condition ? " one of" : "";
	parse[prefix + "someof" + postfix] = condition ? " some of" : "";
	parse[prefix + "eachof" + postfix] = condition ? " each of" : "";
	parse[prefix + "allof" + postfix]  = condition ? " all of" : "";
	
	parse[prefix + "itThey" + postfix]    = condition ? "they" : "it";
	parse[prefix + "itThem" + postfix]    = condition ? "them" : "it";
	parse[prefix + "itsTheir" + postfix]  = condition ? "their" : "its";
	parse[prefix + "itsTheyre" + postfix] = condition ? "they’re" : "it’s";
	parse[prefix + "itsTheyve" + postfix] = condition ? "they’ve" : "it’s";
	parse[prefix + "thisThese" + postfix] = condition ? "these" : "this";
	parse[prefix + "thatThose" + postfix] = condition ? "those" : "that";
	
	return parse;
}

/*
	// REGULAR TEXT (NEW METHOD)
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	

	// CHOICE
	
	//[Sure][Nah]
	var options = new Array();
	options.push({ nameStr : "Sure",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	options.push({ nameStr : "Nah",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	Gui.SetButtonsFromList(options);
	
	
	// SCENE ROTATION
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		Text.Add("", parse);
		Text.NL();
		Gui.NextPrompt(Scenes.Kiakai.TalkElves);
	});
	// Long
	scenes.push(function() {
		Text.Add("", parse);
		Text.NL();
		Gui.NextPrompt(Scenes.Kiakai.TalkElves);
	});
	// Long
	scenes.push(function() {
		Text.Add("", parse);
		Text.NL();
		Gui.NextPrompt(Scenes.Kiakai.TalkElves);
	});
	
	var sceneId = kiakai.flags["RotElfChild"];
	if(sceneId >= scenes.length) sceneId = 0;
	
	kiakai.flags["RotElfChild"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	Text.Flush();
	
	
	// RANDOM SCENE (USING ENCOUNTER TABLE)

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.Flush();
*/

