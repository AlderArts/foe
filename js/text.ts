import * as $ from 'jquery';
import * as _ from 'lodash';

import { GetRenderPictures } from '../app';
import { isFunction, Rand } from './utility';

let Text : any = {};

Text.buffer = "";
//A div that contains 'groups' of inputs. Each group is on a new line (so you can basically have multiple toolbars).
Text.toolbars = $('<div></div>');

Text.InsertImage = function(imgSrc : string, align? : string) {
	if(!GetRenderPictures()) return "";

	align = align || 'left';
	return "<img src='" + imgSrc + "' align='" + align + "' alt='MISSING IMAGE: " + imgSrc + "' style='margin: 1px 8px;'/>";
}

Text.Say = function(imgSrc : string, text? : string, align? : string) {
	var textbox = document.getElementById("mainTextArea");
	align = align || 'left';
	text = text || "";

	if(GetRenderPictures())
		textbox.innerHTML += "<img src='" + imgSrc + "' align='" + align + "' alt='MISSING IMAGE: " + imgSrc + "' style='margin: 1px 8px;'>" + text + "</img>";
	else
		textbox.innerHTML += text;
}


Text.SetTooltip = function(text : string, parseStrings? : any) {
	var textbox = document.getElementById("tooltipTextArea");
	textbox.innerHTML = Text.Parse(text, parseStrings);
}

Text.Parse = function(text : string, parseStrings? : any) {
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
					if(_.isUndefined(replaceStr))
						replaceStr = Text.ApplyStyle("['" + code + "' is undefined]", "error");
				} else {
					replaceStr = Text.ApplyStyle("['" + code + "' couldn't be parsed]", "error");
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
		return Text.ApplyStyle("PARSE ERROR: { " + text + " }", "error");
	}
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

//Utility function to apply css styling to text
//This is used internally by Add and the helper methods below.
//This should be used for styling any text that should 
//not be passed through Text.Parse
Text.ApplyStyle = function(text : string, cssClasses? : string, tag? : string) {
	tag = tag || "span";
	return '<' + tag + (cssClasses ? (' class ="' + cssClasses + '">') : '>') + text + '</' + tag + '>';
}

// Generic function to apply text to the buffer
// It always uses Text.Parse, and chooses whether to apply styling if needed
// This is primarily meant to be used for dialogue and scenes,
// but AddSpan and AddDiv both call it, since this would make
// testing easier in the future, as only this needs unit testing
Text.Add = function(text : string, parse? : any, cssClasses? : string, tag? : string) {
	var parsed = Text.Parse(text, parse);
	if (cssClasses) {
		Text.buffer += Text.ApplyStyle(parsed, cssClasses, tag);
	} else {
		Text.buffer += parsed;
	}
}

//Adds text wrapped in a span.
Text.AddSpan = function(text : string, parse? : any, cssClasses? : string) {
	Text.Add(text, parse, cssClasses, "span");
}

//Adds text wrapped in a div.
Text.AddDiv = function(text : string, parse? : any, cssClasses? : string) {
	Text.Add(text, parse, cssClasses, "div");
}

/*
*Adds the list of inputs as a new toolbar in the toolbars buffer.
* List: A list of inputs that will be added. Current acceptable inputs are 'button' and 'select'.
* ToolbarLabel: A text label that will be put at the very start of the toolbar. Default is no label.
* cssClasses : A string of css classes that will be added to every input in the 'list' parameter.
 */
Text.AddToolbar = function(list : any[], toolbarLabel? : string, cssClasses? : string) {
	var toolbar = $("<div>");
	//Add toolbar label if specified
	if(toolbarLabel) {
		var label= $('<span>', {
			"class" : 'tbarLbl',
			text : toolbarLabel
		});
		toolbar.append(label);
	}
	//Add inputs to new toolbar
	for(var i=0; i < list.length; i++) {
		toolbar.append(createInput(list[i], cssClasses));
	}
	Text.toolbars.append(toolbar);
}
//Clears the toolbars buffer
Text.ResetToolbars = function() {
	Text.toolbars = $('<div></div>');
}

Text.NL = function() {
	Text.buffer += "<br/><br/>";
}

Text.Flush = function(textCssClasses? : string, toolbarCssClasses? : string) {
	//var textbox = document.getElementById("mainTextArea");
	var textBox = $("#mainTextArea");
	var textClasses = (textCssClasses) ? textCssClasses : "";
	var toolbarClasses = (toolbarCssClasses) ? toolbarCssClasses : "";
	//textbox.innerHTML += "<div class=\""+toolbarClasses+"\">"+Text.toolbar+"</div>";
	if(Text.toolbars) {
		textBox.append(Text.toolbars);
	}
	textBox.append(Text.ApplyStyle(Text.buffer, textClasses));

	Text.buffer = "";
	Text.toolbars = $('<div></div>');
}

Text.DigitToText = function(num : number) {
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

Text.NumToText = function(num : number) {
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

Text.Quantify = function(num : number) {
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

Text.Ordinal = function(num : number, capital : boolean) {
	num = Math.floor(num);
	switch(num) {
		case 1: return capital ? "First"   : "first";
		case 2: return capital ? "Second"  : "second";
		case 3: return capital ? "Third"   : "third";
		case 4: return capital ? "Fourth"  : "fourth";
		case 5: return capital ? "Fifth"   : "fifth";
		case 6: return capital ? "Sixth"   : "sixth";
		case 7: return capital ? "Seventh" : "seventh";
		case 8: return capital ? "Eight"   : "eight";
		case 9: return capital ? "Ninth"   : "ninth";
		default: return num + "th"; // decent fallback
	}
}


Text.ParserPlural = function(parse? : any, condition? : any, prefix? : string, postfix? : string) {
	parse   = parse   || {};
	prefix  = prefix  || "";
	postfix = postfix || "";
	parse[prefix + "a" + postfix]      = condition ? "" : " a";
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

	parse[prefix + "ItThey" + postfix]    = condition ? "They" : "It";
	parse[prefix + "ItsTheyre" + postfix] = condition ? "They’re" : "It’s";

	parse[prefix + "itThey" + postfix]    = condition ? "they" : "it";
	parse[prefix + "itThem" + postfix]    = condition ? "them" : "it";
	parse[prefix + "itsTheir" + postfix]  = condition ? "their" : "its";
	parse[prefix + "itsTheyre" + postfix] = condition ? "they’re" : "it’s";
	parse[prefix + "itsTheyve" + postfix] = condition ? "they’ve" : "it’s";
	parse[prefix + "thisThese" + postfix] = condition ? "these" : "this";
	parse[prefix + "thatThose" + postfix] = condition ? "those" : "that";

	return parse;
}

Text.Enumerate = function(list : any[], conjunction : any) {
	var output = "";
	list.reverse(); // We're assuming that the order matters
	list.forEach(function(elem, idx) {
		if (idx == 0) {
			output = elem + output;
		} else if (idx == 1) {
			output = elem + " " + conjunction + " " + output;
		} else {
			output = elem + ", " + output;
		}
	});
	return output;
}

/*Generates an input for a given input type
 * For each 'type', the accepted paramters are listed below
 *   button   ::: (nameStr = button text), (func = on click func), (obj = will be passed to func), (classes = classes that will be added to the input)
 *   select  ::: TODO
 *   checkbox::: TODO
 *   radio   ::: TODO
 */
var createInput = function(inputOptions : any, cssClasses? : any) {
	var input;
	var type = inputOptions.type || 'button';
	var classesStr = (cssClasses || "") +" "+ (inputOptions.classes || "");
	if(type.toLowerCase() == 'button') {
		var btnName = inputOptions.nameStr;
		var onclick = inputOptions.func;
		var clickParam = inputOptions.param;
		input = $('<input />', {
			type  : 'button',
			"class" : 'tbarInput '+classesStr,
			value : btnName,
			on    : {
				click: function() {
					var data = $(this).data()
					var func = data.func;
					func(data.param);
				}
			}
		});
		//Add function and parameter data to input
		$(input).data("param", inputOptions.obj); //TODO
		$(input).data("func", onclick);

	} else if(type.toLowerCase() == 'select') {
		//TODO Will finish when I need it later
		/*var onSelect = inputOptions.func;
		 var selectParam = inputOptions.param;
		 input = $('<input />', {
		 type  : 'select',
		 class : 'tbarInput '+classesStr,
		 on    : {
		 select: function() {
		 var data = $(this).data()
		 var func = data.func;
		 func(data.param);
		 }
		 }
		 });
		 //Add function and parameter data to input
		 $(input).data("param", inputOptions.obj); //TODO
		 $(input).data("func", onclick);*/
	} else if(type.toLowerCase() == 'checkbox') {
		//TODO
	} else if(type.toLowerCase() == 'rado') {
		//TODO
	}
	return input;
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

// Replaces Text.BoldColor when no color specified
// Inherits the default color from parent style
Text.Bold = function(text : string) {
	return Text.ApplyStyle(text, "bold");
}

// Apply a standard life damage style
Text.Damage = function(text : string) {
	return Text.ApplyStyle(text, "life bold");
}

// Apply a standard life heal style
Text.Heal = function(text : string) {
	return Text.ApplyStyle(text, "heal bold");
}

// Apply a standard lust 'damage' style
Text.Lust = function(text : string) {
	return Text.ApplyStyle(text, "pink bold");
}

// Apply a standard lust 'heal' style
Text.Soothe = function(text : string) {
	return Text.ApplyStyle(text, "soothe bold");
}

// Apply a standard mana / SP  style
Text.Mana = function(text : string) {
	return Text.ApplyStyle(text, "mana bold");
}

export { Text };
