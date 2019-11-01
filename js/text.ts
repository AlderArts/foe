import * as $ from "jquery";
import * as _ from "lodash";

import { GetRenderPictures } from "../app";

export interface IParse {
	[index: string]: string|(() => string);
}

export namespace Text {

	let buffer = "";
	// A div that contains 'groups' of inputs. Each group is on a new line (so you can basically have multiple toolbars).
	let toolbars = $("<div></div>");

	export function InsertImage(imgSrc: string, align: string = "left") {
		if (!GetRenderPictures()) { return ""; }
		return `<img src='${imgSrc}' align='${align}' alt='MISSING IMAGE: ${imgSrc}' style='margin: 1px 8px;'/>`;
	}

	export function Say(imgSrc: string, text: string = "", align: string = "left") {
		const textbox = document.getElementById("mainTextArea");

		if (GetRenderPictures()) {
			textbox.innerHTML += `<img src='${imgSrc}' align='${align}' alt='MISSING IMAGE: ${imgSrc}' style='margin: 1px 8px;'>${text}</img>`;
		} else {
			textbox.innerHTML += text;
		}
	}

	export function SetTooltip(text: string, parseStrings?: IParse) {
		const textbox = document.getElementById("tooltipTextArea");
		textbox.innerHTML = Text.Parse(text, parseStrings);
	}

	export function Parse(text: string, parseStrings?: IParse): string {
		try {
			// Simple parser
			if (parseStrings) {
				let start = text.indexOf("[");
				let stop = text.indexOf("]", start);
				while (start !== -1 && stop !== -1) {
					const code = text.slice(start + 1, stop);

					let replaceStr;
					if (parseStrings[code] !== undefined) {
						replaceStr = parseStrings[code];
						if (_.isFunction(replaceStr)) {
							replaceStr = replaceStr();
						}
						if (_.isUndefined(replaceStr)) {
							replaceStr = ApplyStyle(`['${code}' is undefined]`, "error");
						}
					} else {
						replaceStr = ApplyStyle(`['${code}' couldn't be parsed]`, "error");
					}

					text = text.slice(0, start) + replaceStr + text.slice(stop + 1);

					start = text.indexOf("[", start + replaceStr.length);
					stop = text.indexOf("]", start);
				}
			}

			return text;
		} catch (e) {
			alert(e.message + "........." + e.stack);
			return ApplyStyle(`PARSE ERROR: { ${text} }`, "error");
		}
	}

	export function Clear() {
		const textbox = document.getElementById("mainTextArea");
		textbox.innerHTML = "";
		textbox.scrollTop = 0;
		buffer = "";
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

	// Utility function to apply css styling to text
	// This is used internally by Add and the helper methods below.
	// This should be used for styling any text that should
	// not be passed through Text.Parse
	export function ApplyStyle(text: string|number, cssClasses?: string, tag: string = "span") {
		const classes = cssClasses ? ` class ="${cssClasses}">` : ">";
		return `<${tag}${classes}${text}</${tag}>`;
	}

	// Generic function to apply text to the buffer
	// It always uses Text.Parse, and chooses whether to apply styling if needed
	// This is primarily meant to be used for dialogue and scenes,
	// but AddSpan and AddDiv both call it, since this would make
	// testing easier in the future, as only this needs unit testing
	export function Add(text: string, parse?: IParse, cssClasses?: string, tag?: string) {
		const parsed = Text.Parse(text, parse);
		if (cssClasses) {
			buffer += ApplyStyle(parsed, cssClasses, tag);
		} else {
			buffer += parsed;
		}
	}

	export function Out(text: string, cssClasses?: string, tag?: string) {
		// Insert <i> tags at dialogue
		text = text.replace(/“/g, "<i>“").replace(/”/g, "”</i>");
		// Insert line breaks
		text = text.replace(/\n/g, "<br>");

		if (cssClasses) {
			buffer += ApplyStyle(text, cssClasses, tag);
		} else {
			buffer += text;
		}
	}

	// Adds text wrapped in a span.
	export function AddSpan(text: string, parse?: IParse, cssClasses?: string) {
		Text.Add(text, parse, cssClasses, "span");
	}

	// Adds text wrapped in a div.
	export function AddDiv(text: string, parse?: IParse, cssClasses?: string) {
		Text.Add(text, parse, cssClasses, "div");
	}

	/*
	*Adds the list of inputs as a new toolbar in the toolbars buffer.
	* List: A list of inputs that will be added. Current acceptable inputs are 'button' and 'select'.
	* ToolbarLabel: A text label that will be put at the very start of the toolbar. Default is no label.
	* cssClasses : A string of css classes that will be added to every input in the 'list' parameter.
	*/
	export function AddToolbar(list: any[], toolbarLabel?: string, cssClasses?: string) {
		const toolbar = $("<div>");
		// Add toolbar label if specified
		if (toolbarLabel) {
			const label = $("<span>", {
				class : "tbarLbl",
				text : toolbarLabel,
			});
			toolbar.append(label);
		}
		// Add inputs to new toolbar
		for (const input of list) {
			toolbar.append(createInput(input, cssClasses));
		}
		toolbars.append(toolbar);
	}
	// Clears the toolbars buffer
	export function ResetToolbars() {
		toolbars = $("<div></div>");
	}

	export function NL() {
		buffer += "<br/><br/>";
	}

	export function Flush(textCssClasses?: string, toolbarCssClasses?: string) {
		// let textbox = document.getElementById("mainTextArea");
		const textBox = $("#mainTextArea");
		const textClasses = (textCssClasses) ? textCssClasses : "";
		const toolbarClasses = (toolbarCssClasses) ? toolbarCssClasses : "";
		// textbox.innerHTML += "<div class=\""+toolbarClasses+"\">"+Text.toolbar+"</div>";
		if (toolbars) {
			textBox.append(toolbars);
		}
		textBox.append(ApplyStyle(buffer, textClasses));

		buffer = "";
		toolbars = $("<div></div>");
	}

	function DigitToText(num: number) {
		num = Math.floor(num);
		switch (num) {
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
			default: return num.toString();
		}
	}

	export function NumToText(num: number) {
		num = Math.floor(num);
		if (num < 0) {
			return num.toString();
		} else if (num < 20) {
			return DigitToText(num);
 		} else if (num < 1000) {
			const ones = num % 10;
			const tens = Math.floor(num / 10) % 10;
			const hundreds = Math.floor(num / 100) % 10;

			let str = "";

			if (hundreds !== 0) {
				str += DigitToText(hundreds) + " hundred";
			}
			if (tens !== 0) {
				if (hundreds !== 0) { str += " "; }
				if (num % 100 < 20) {
					str += DigitToText(num % 100);
					return str;
				} else {
					switch (tens) {
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
			if (ones !== 0) {
				if (hundreds !== 0 && tens === 0) { str += " "; } else if (tens !== 0) { str += "-"; }
				str += DigitToText(ones);
			}
			return str;
		}

		// Default
		return num.toString();
	}

	export function Quantify(num: number) {
		num = Math.floor(num);
		if (num < 0) {
			return num.toString();
		}
		switch (num) {
			case 0: return "lack";
			case 1:
				return _.sample(["lone", "solitary", "individual", "single"]);
			case 2:
				return _.sample(["duo", "pair"]);
			case 3:
				return _.sample(["trio", "triad"]);
			case 4:
				return _.sample(["quad", "quartette"]);
			case 5: return "quintet";
			case 6: return "sextet";
			case 7: return "septet";
			case 8: return "octet";
			case 9: return "nonet";
			default: return "brace";
		}
	}

	export function Ordinal(num: number, capital?: boolean) {
		num = Math.floor(num);
		switch (num) {
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

	export function ParserPlural(parse: IParse = {}, condition?: boolean, prefix: string = "", postfix: string = "") {
		parse[`${prefix}a${postfix}`]      = condition ? "" : " a";
		parse[`${prefix}s${postfix}`]      = condition ? "s" : "";
		parse[`${prefix}notS${postfix}`]   = condition ? "" : "s";
		parse[`${prefix}es${postfix}`]     = condition ? "es" : "";
		parse[`${prefix}notEs${postfix}`]  = condition ? "" : "es";
		parse[`${prefix}yIes${postfix}`]   = condition ? "ies" : "y";

		parse[`${prefix}isAre${postfix}`]   = condition ? "are" : "is";
		parse[`${prefix}hasHave${postfix}`] = condition ? "have" : "has";
		parse[`${prefix}wasWere${postfix}`] = condition ? "were" : "was";

		parse[`${prefix}oneof${postfix}`]  = condition ? " one of" : "";
		parse[`${prefix}someof${postfix}`] = condition ? " some of" : "";
		parse[`${prefix}eachof${postfix}`] = condition ? " each of" : "";
		parse[`${prefix}allof${postfix}`]  = condition ? " all of" : "";

		parse[`${prefix}ItThey${postfix}`]    = condition ? "They" : "It";
		parse[`${prefix}ItsTheyre${postfix}`] = condition ? "They’re" : "It’s";

		parse[`${prefix}itThey${postfix}`]    = condition ? "they" : "it";
		parse[`${prefix}itThem${postfix}`]    = condition ? "them" : "it";
		parse[`${prefix}itsTheir${postfix}`]  = condition ? "their" : "its";
		parse[`${prefix}itsTheyre${postfix}`] = condition ? "they’re" : "it’s";
		parse[`${prefix}itsTheyve${postfix}`] = condition ? "they’ve" : "it’s";
		parse[`${prefix}thisThese${postfix}`] = condition ? "these" : "this";
		parse[`${prefix}thatThose${postfix}`] = condition ? "those" : "that";

		return parse;
	}

	export function Enumerate(list: any[], conjunction: any) {
		let output = "";
		list.reverse(); // We're assuming that the order matters
		list.forEach((elem, idx) => {
			if (idx === 0) {
				output = elem + output;
			} else if (idx === 1) {
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
	function createInput(inputOptions: any, cssClasses?: any) {
		let input;
		const type = inputOptions.type || "button";
		const classesStr = (cssClasses || "") + " " + (inputOptions.classes || "");
		if (type.toLowerCase() === "button") {
			const btnName = inputOptions.nameStr;
			const onclick = inputOptions.func;
			const clickParam = inputOptions.param;
			input = $("<input />", {
				type  : "button",
				class : "tbarInput " + classesStr,
				value : btnName,
				on    : {
					click() {
						const data = $(this).data();
						const func = data.func;
						func(data.param);
					},
				},
			});
			// Add function and parameter data to input
			$(input).data("param", inputOptions.obj); // TODO
			$(input).data("func", onclick);

		} else if (type.toLowerCase() === "select") {
			// TODO Will finish when I need it later
			/*let onSelect = inputOptions.func;
			let selectParam = inputOptions.param;
			input = $('<input />', {
			type  : 'select',
			class : 'tbarInput '+classesStr,
			on    : {
			select: function() {
			let data = $(this).data()
			let func = data.func;
			func(data.param);
			}
			}
			});
			//Add function and parameter data to input
			$(input).data("param", inputOptions.obj); //TODO
			$(input).data("func", onclick);*/
		} else if (type.toLowerCase() === "checkbox") {
			// TODO
		} else if (type.toLowerCase() === "rado") {
			// TODO
		}
		return input;
	}
	/*
		// REGULAR TEXT (NEW METHOD)
		let parse: IParse = {

		};

		Text.Clear();
		Text.Add("", parse);
		Text.NL();
		Text.Flush();

		// CHOICE

		//[Sure][Nah]
		let options = new Array();
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

		let scenes = [];

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

		let sceneId = kiakai.flags["RotElfChild"];
		if(sceneId >= scenes.length) sceneId = 0;

		kiakai.flags["RotElfChild"] = sceneId + 1;

		// Play scene
		scenes[sceneId]();

		Text.Flush();

		// RANDOM SCENE (USING ENCOUNTER TABLE)

		let scenes = new EncounterTable();
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
	export function Bold(text: string|number) {
		return ApplyStyle(text, "bold");
	}

	// Apply a standard life damage style
	export function Damage(text: string|number) {
		return ApplyStyle(text, "life bold");
	}

	// Apply a standard life heal style
	export function Heal(text: string|number) {
		return ApplyStyle(text, "heal bold");
	}

	// Apply a standard lust 'damage' style
	export function Lust(text: string|number) {
		return ApplyStyle(text, "pink bold");
	}

	// Apply a standard lust 'heal' style
	export function Soothe(text: string|number) {
		return ApplyStyle(text, "soothe bold");
	}

	// Apply a standard mana / SP  style
	export function Mana(text: string|number) {
		return ApplyStyle(text, "mana bold");
	}

}
