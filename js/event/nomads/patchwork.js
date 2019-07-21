/*
 * 
 * Define Patchwork
 * 
 */
import { Link, Scenes } from '../../event';
import { Entity } from '../../entity';
import { world } from '../../world';
import { Shop } from '../../shop';
import { GetDEBUG } from '../../../app';

function Patchwork(storage) {
	Entity.call(this);
	this.ID = "patchwork";
	
	this.name = "Patches";
	
	this.body.DefFemale();
	//TODO body
	
	/*
	 * Set up patchworks shop
	 */
	this.Shop = new Shop();
	
	this.Shop.AddItem(Items.Combat.HPotion, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.Shop.AddItem(Items.Equinium, 5, null, Scenes.Patchwork.BuyFunc);
	//this.Shop.AddItem(Items.HorseHair, 5, null, Scenes.Patchwork.BuyFunc);
	this.Shop.AddItem(Items.HorseShoe, 5, null, Scenes.Patchwork.BuyFunc);
	//this.Shop.AddItem(Items.HorseCum, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.Shop.AddItem(Items.Leporine, 5, null, Scenes.Patchwork.BuyFunc);
	this.Shop.AddItem(Items.RabbitFoot, 5, null, Scenes.Patchwork.BuyFunc);
	//this.Shop.AddItem(Items.CarrotJuice, 5, null, Scenes.Patchwork.BuyFunc);
	//this.Shop.AddItem(Items.Lettuce, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.Shop.AddItem(Items.Felinix, 5, null, Scenes.Patchwork.BuyFunc);
	//this.Shop.AddItem(Items.Whiskers, 5, null, Scenes.Patchwork.BuyFunc);
	this.Shop.AddItem(Items.HairBall, 5, null, Scenes.Patchwork.BuyFunc);
	//this.Shop.AddItem(Items.CatClaw, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.Shop.AddItem(Items.CowBell, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.Shop.AddItem(Items.DogBiscuit, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.Shop.AddItem(Items.Trinket, 5, null, Scenes.Patchwork.BuyFunc);
	this.Shop.AddItem(Items.Feather, 5, null, Scenes.Patchwork.BuyFunc);
	this.Shop.AddItem(Items.FruitSeed, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.Shop.AddItem(Items.Hummus, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.Shop.AddItem(Items.Fertilium, 5, null, Scenes.Patchwork.BuyFunc);
	this.Shop.AddItem(Items.FertiliumPlus, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.Shop.AddItem(Items.Infertilium, 5, null, Scenes.Patchwork.BuyFunc);
	this.Shop.AddItem(Items.InfertiliumPlus, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.Shop.AddItem(Items.Toys.SmallDildo, 5, null, Scenes.Patchwork.BuyFunc);
	
	this.flags = {};
	this.flags["Met"] = Patchwork.Met.NotMet;
	
	if(storage) this.FromStorage(storage);
}
Patchwork.prototype = new Entity();
Patchwork.prototype.constructor = Patchwork;

Patchwork.Met = {
	NotMet     : 0,
	Met        : 1,
	Met2       : 2,
	KnowGender : 3
};
Patchwork.prototype.KnowGender = function() {
	return this.flags["Met"] >= Patchwork.Met.KnowGender;
}
Patchwork.prototype.Met = function() {
	return this.flags["Met"] >= Patchwork.Met.Met;
}

Patchwork.prototype.FromStorage = function(storage) {
	this.body.FromStorage(storage.body);
	this.LoadPersonalityStats(storage);
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Patchwork.prototype.ToStorage = function() {
	var storage = {};
	
	this.SaveBodyPartial(storage, {ass: true, vag: true});
	
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

Patchwork.prototype.PronounGender = function() {
	return this.flags["Met"] >= Patchwork.Met.KnowGender ? Gender.female : Gender.male;
}

Patchwork.prototype.heshe = function() {
	var gender = this.PronounGender();
	if(gender == Gender.male) return "they";
	else return "she";
}
Patchwork.prototype.HeShe = function() {
	var gender = this.PronounGender();
	if(gender == Gender.male) return "They";
	else return "She";
}
Patchwork.prototype.himher = function() {
	var gender = this.PronounGender();
	if(gender == Gender.male) return "them";
	else return "her";
}
Patchwork.prototype.HimHer = function() {
	var gender = this.PronounGender();
	if(gender == Gender.male) return "Them";
	else return "Her";
}
Patchwork.prototype.hisher = function() {
	var gender = this.PronounGender();
	if(gender == Gender.male) return "their";
	else return "her";
}
Patchwork.prototype.HisHer = function() {
	var gender = this.PronounGender();
	if(gender == Gender.male) return "Their";
	else return "Her";
}
Patchwork.prototype.hishers = function() {
	var gender = this.PronounGender();
	if(gender == Gender.male) return "theirs";
	else return "hers";
}
Patchwork.prototype.mfPronoun = function(male, female) {
	var gender = this.PronounGender();
	if(gender == Gender.male) return male;
	else return female;
}


Scenes.Patchwork = {};

Scenes.Patchwork.Interact = function() {
	var parse = {};
	parse = patchwork.ParserPronouns(parse);
	
	Text.Clear();
	if(patchwork.flags["Met"] < Patchwork.Met.Met) {
		Text.Add("You make your way toward the mysterious robed peddler and their makeshift shop, near the campfire. Even as you get right up to them, they remain as enigmatic as before; the robes they wear are so all-encompassing, you can’t make out anything about their features. You’re pretty sure that whatever’s under there is humanoid, but that’s as far as you’d dare to venture.", parse);
		Text.NL();
		Text.Add("Wide, flared sleeves completely swallow their arms and hands alike, whilst the hem trails along the ground, preventing even the slightest glimpse of their feet. A raised neck - a shawl, maybe, but it’s hard to tell where any part of the robe ends and another begins - combines with a low-fallen hood to completely obscure the face. And all over, patches of fabric, a dazzling array of pattern-fragments and colors, scattered about without any semblance of rhyme or reason.", parse);
		Text.NL();
		Text.Add("Some of the many patches look to have been added to preserve the life of the robes beneath, others to extend the original fabric and make it even more shrouding. A few folds of fabric suggest that some might have been added as makeshift pockets, and as far as you know, some of the more colorful ones may have even been added for decoration.", parse);
		Text.NL();
		Text.Add("The robed figure turns to look at you. <i>“You’re new,”</i> a muffled voice states.", parse);
		Text.NL();
		Text.Add("You’re about to introduce yourself when a small telescope emerges from the sea of patched cloth, extending until it’s a bit too close for comfort. You can see what looks like an eye through the lens. It swoops over you in a quick examination before retracting back into the robes.", parse);
		Text.NL();
		Text.Add("<i>“Welcome to my shop, stranger. What’s your business?”</i>", parse);
		Text.NL();
		Text.Add("The oddity of the merchant has you pausing for a moment, considering if you really want to do business with them after all.", parse);
		Text.Flush();
		Scenes.Patchwork.Prompt();
	}
	else if(patchwork.flags["Met"] < Patchwork.Met.Met2) {
		Text.Add("With a little trepidation, you approach the eccentric peddler in their patchworked robes again, asking if they are willing to do business with you.", parse);
		Text.NL();
		Text.Add("<i>“Password?”</i>", parse);
		Text.NL();
		Text.Add("Password? You blink in confusion, then remember what the strange shopkeeper told you last time. Oh, yes, the password... now, what was it...?", parse);
		Text.Flush();
		
		var next = function() {
			Text.Clear();
			Text.Add("<i>“Close enough, what’s your business stranger?”</i>", parse);
			Text.NL();
			Text.Add("You blink slowly; they went to the trouble of demanding a password, and now they don’t even care if it’s the right one or not? Oh well... what did you want to do, anyway?", parse);
			Text.Flush();
			Scenes.Patchwork.Prompt();
		}
		
		//[Umm…][Something like…][Err…]
		var options = new Array();
		options.push({ nameStr : "[Umm…]",
			func : next, enabled : true,
			tooltip : "What was it now?"
		});
		options.push({ nameStr : "[Was it…]",
			func : next, enabled : true,
			tooltip : "What was it now?"
		});
		options.push({ nameStr : "[Err…]",
			func : next, enabled : true,
			tooltip : "What was it now?"
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“Password?”</i> the shady merchant asks.", parse);
		Text.NL();
		Text.Add("You shrug your shoulders, and spit out whatever random words pop into your head. You know [heshe]’ll let you shop just for playing along with whatever this silly game of [hishers] is.", parse);
		Text.NL();
		Text.Add("<i>“Close enough, what’s your business stranger?”</i>", parse);
		
		if(GetDEBUG()) {
			Text.NL();
			Text.Add("DEBUG: relation: " + patchwork.relation.Get(), null, 'bold');
			Text.NL();
			Text.Add("DEBUG: subDom: " + patchwork.subDom.Get(), null, 'bold');
			Text.NL();
			Text.Add("DEBUG: slut: " + patchwork.slut.Get(), null, 'bold');
		}
		
		Text.Flush();
		Scenes.Patchwork.Prompt();
	}
}

Scenes.Patchwork.PW = function() {
	var words = [
	"trinket", "bauble", "coin", "feather", "bird", "raven", "hemp", "pin", "yarn", "stone", "gem", "fish", "jelly", "goop", "key", "stitches", "clamp", "charm", "nymph", "blue", "red", "yellow", "green", "purple", "orange", "apple", "sauce", "gloom", "pockets", "gym", "scales", "shoe", "song", "groom", "bee", "wasp", "honey", "store", "laundry", "underwear", "cog", "long", "cat", "watch", "pineapple", "juice", "squawk", "fluffy tails", "dust", "hugs", "belly", "bomb", "pump", "grease"
	];
	
	var getWord = function() {
		var idx = Math.floor(Math.random() * words.length);
		var word = words[idx];
		words.remove(idx);
		return word;
	};
	
	return getWord() + " " + getWord() + " " + getWord();
}

Scenes.Patchwork.BuyFunc = function() {
	patchwork.relation.IncreaseStat(10, 1);
	return false;
}

Scenes.Patchwork.Prompt = function() {
	var parse = {
		notS : patchwork.mfPronoun("", "s")
	};
	parse = patchwork.ParserPronouns(parse);
	
	var options = new Array();
	
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add("[Placeholder] I'ma shopkeeper.");
		}, enabled : false //TODO
	});
	options.push({ nameStr : "Buy",
		func : function() {
			Text.Clear();
			Text.Add("<i>“What are ya buying?”</i> [heshe] ask[notS], opening [hisher] robes to show you the item-lined pockets.", parse);
			Text.NL();
			patchwork.Shop.Buy(Scenes.Patchwork.Prompt, true);
		}, enabled : true
	});
	options.push({ nameStr : "Sell",
		func : function() {
			Text.Clear();
			Text.Add("<i>“What are ya selling?”</i> [heshe] ask[notS], [hisher] telescopic monocle extending past [hisher] robes to examine your goods.", parse);
			Text.NL();
			patchwork.Shop.Sell(Scenes.Patchwork.Prompt, true);
		}, enabled : true
	});
	
	Gui.SetButtonsFromList(options, true, function() {
		parse["pw"] = Scenes.Patchwork.PW();
		
		Text.Clear();
		if(patchwork.flags["Met"] < Patchwork.Met.Met) {
			Text.Add("<i>“Wait,”</i> the creature calls as you’re about to turn. <i>“The password for next time is: [pw]. Remember it or no business for you, stranger.”</i>", parse);
			Text.NL();
			Text.Add("Lets see… [pw], huh? Privately noting the oddity of requiring a password to do business to yourself, you assure the mysterious merchant you will remember it.", parse);
			patchwork.flags["Met"] = Patchwork.Met.Met;
		}
		else if(patchwork.flags["Met"] < Patchwork.Met.Met2) {
			Text.Add("<i>“Next time’s password is: [pw].”</i>", parse);
			Text.NL();
			Text.Add("Slowly you nod your head, dryly assuring them that you have it... but privately, you ask yourself if you really need it; so long as you play along, it looks like they’ll accept whatever you say.", parse);
			patchwork.flags["Met"] = Patchwork.Met.Met2;
		}
		else {
			Text.Add("<i>“Next time’s password is: [pw].”</i>", parse);
			Text.NL();
			Text.Add("You nod your head, and assure them you have it.", parse);
		}
		Text.Flush();
		
		Gui.NextPrompt();
	});
}

Scenes.Patchwork.Desc = function() {
	var parse = {
		notS : patchwork.mfPronoun("", "s"),
		dont : patchwork.mfPronoun("don’t", "doesn’t")
	};
	parse = patchwork.ParserPronouns(parse);
	
	if(!patchwork.Met())
		Text.Add("A strange individual wearing a patchwork robe has set up shop close to the campfire. ");
	else
		Text.Add("Patchwork the peddler is standing by the campfire. You have the distinct feeling [heshe] know[notS] you’re here, even if [heshe] [dont] seem to be moving at the moment. ", parse);
	Text.NL();
}

export { Patchwork };
