/*
 * 
 * Define Asche
 * 
 */

Scenes.Asche = {};

function Asche(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Asche";
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 6;
	this.body.SetRace(Race.Jackal);
	
	this.flags["Met"]     = Asche.Met.NotMet;
	
	if(storage) this.FromStorage(storage);
}
Asche.prototype = new Entity();
Asche.prototype.constructor = Asche;

Asche.Met = {
	NotMet : 0,
	Met    : 1
}

Asche.prototype.Update = function(step) {
	
}

Asche.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	this.body.FromStorage(storage.body);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Asche.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	this.SaveBodyPartial(storage, {ass: true, vag: true});
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

Scenes.Asche.FirstEntry = function() {
	var parse = {
		heshe : player.mfFem("he","she"),
		handsomepretty : player.mfFem("handsome", "pretty")
	};
	
	asche.flags["Met"] = Asche.Met.Met;
	
	Text.Clear();
	Text.Add("A gentle jingle of chimes greets you as you push open the hardwood door, followed by a strong, heady aroma of incense that’s practically overpowering. Still, you forge ahead into the small store, and are greeted by the proprietor behind the counter, a jackal-morph of slender build. Her large ears perk up as she sees you, and she adjusts her clothing - an exotic-looking garment consisting of a white drape, mostly wrapped about her waist and with one end hung loosely over a shoulder, baring her furry midriff. Her dark eyes look as if she’s gone way overboard with the eyeliner and shadow, and she’s adorned from head to toe in jewellery - some of it tasteful, but most of it absolutely tacky, with bangles, earrings, and all.", parse);
	Text.NL();
	Text.Add("<i>“Asche welcomes you to her store, new customer,”</i> she says, flashing you a toothy canine grin. <i>“You have a strange aura about you that Asche cannot quite place. Perhaps you have come seeking a solution to one of your problems? Asche’s shop is here to solve problems for customers, yes.”</i>", parse);
	Text.NL();
	Text.Add("Asche? Who… oh, right, that must be her, she’s referring to herself in the third person; that <i>is</i> an unconventional manner of speech. No, you just saw the store and thought it interesting, so you came in to browse. Something like that, anyway.", parse);
	Text.NL();
	Text.Add("<i>“Ah, carried in by the winds of fate! Even better, then!”</i>", parse);
	Text.NL();
	Text.Add("So… what exactly does she sell here? Looking around you, you kind of have an idea, but it’s best to ask anyway.", parse);
	Text.NL();
	Text.Add("<i>“Customer wants to know what Asche sells? Anything and everything, so long as it bears some relation to the magical.”<i/> The jackaless waggles her fingers. <i>“Truly, that is making for some degree of clutter, but it makes better chances that customer who comes in will be able to find something to buy, yes?</i>", parse);
	Text.NL();
	Text.Add("<i>“Asche has for sale some books, trinkets, staves - and of course, clothes to match.”</i> She gestures at the shelves, then at herself. <i>“Is very important to not just stay in style, but also character. Customers expect certain appearances when they are coming in, and Asche hopes to please; in same way, people are expecting certain things of magic workers.</i>", parse);
	Text.NL();
	Text.Add("<i>“Other things that Asche has in stock are potions for many ailments - when those who are too poor to see healers get sick, they come to Asche, for she has very reasonable prices and effective cures. Not for sale are things that transform others - Asche has enough problems with guards that she does not need to be giving them more reason to be knocking on her door.</i>", parse);
	Text.NL();
	Text.Add("<i>“Finally, Asche can also do some things for you, although not things [handsomepretty] customer may be having in mind.”</i> She winks at you slyly. <i>“For example, Asche is very skilled in the art of fortune-telling, and can read your palm for a few coins. No crystal balls for this jackaless, yes.”</i>", parse);
	Text.NL();
	Text.Add("Well, that’s certainly a bit to digest all at once.", parse);
	Text.NL();
	Text.Add("<i>“World of magic is very wide and varied, both in good and evil, so long-winded tale is only to be expected. If good customer has questions about any of the merchandise, [heshe] should not hesitate to ask Asche for details. Safe customer is happy customer is repeat customer.”</i> With that, she gives you one last canine smile and turns back to her own devices.", parse);
	Text.Flush();
	Gui.NextPrompt();
}

Scenes.Asche.Prompt = function() {
	var parse = {
		heshe: player.mfFem("he", "she"),
		hisher: player.mfFem("his", "her")
	};
	
	var options = new Array();
	options.push({ nameStr : "Appearance",
		tooltip : "Study the jackal-morph.",
		func : Scenes.Asche.Appearance,
		enabled : true
	});
	//TODO
	/*
	options.push({ nameStr : "name",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true
	});
	*/
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>“Bye bye now,”</i> Asche says, flicking a softly-furred ear in your direction. <i>“Asche is hoping that customer is being in one piece when [heshe] is next returning to her shop… but if not, there are things she has which can be solving that little problem, too…”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Asche glances up at you as you move towards the door. <i>“Asche is wishing you good health until you next return, customer. Is very easy to be not feeling well while out there, so to be coming back if you have need of her potions.”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("As you make for the door, you hear Asche chuckle behind you, the jackaless’ soft voice more than a little disquieting. <i>“So, does brave customer possess the courage to move on and face [hisher] fateful fate? Or will the sound of [hisher] screams mark the end of [hisher] adventure? This jackaless would offer customer escape, but even her shop is probably not enough to stand against the powers that are hunting customer…to be staying safe until next return.”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Asche is saying farewell to you, customer,”</i> the jackaless says, stifling a yawn as her gaze follows you to the door. <i>“When being out there, customer is to be remembering: everything is having its price, even if not visible all at once…”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.Get();

		Text.Flush();
		Gui.NextPrompt();
	});
}

Scenes.Asche.Appearance = function() {
	var parse = {
		handsomepretty : player.mfFem("handsome", "pretty")
	};
	
	Text.Clear();
	Text.Add("Asche is a lusciously full-bodied jackal-morph, her limbs and figure slender, her chest and hips exotically full. Clothed in a pure white sari that exposes her midriff’s soft deep golden-brown fur, the jackaless is quite the sight to behold. Large, pointy ears peek out from the hood of her snow-white shawl, constantly alert and swivelling this way and that. Stray strands of dirty blond hair streaked with black gather around her chin and shoulders as she levels her narrow, dark eyes at you.", parse);
	Text.NL();
	Text.Add("Illuminated by the crystal lamp on the counter, the jackaless’ fur looks absolutely soft and strokable, lustrous, and appropriately mystical. To say it’s practically spun gold wouldn’t be too far off the mark - Asche clearly puts a lot of work into ensuring she’s presentable for her clientele. A faint scent of jasmine hangs about her person, alluring and exotic.", parse);
	Text.NL();
	Text.Add("True to her customers’ expectations, Asche wears far too much makeup - particularly in the eyeshadow and liner department - and has adorned herself with gold and silver jewellery to the point that she clinks and clanks when she moves. Bangles line her wrists and ankles, numerous small rings have been set into her large ears, and there’s even an exquisite chain of gold filigree resting on her hips, tiny shards of topaz and amber worked into some of the links.", parse);
	Text.NL();
	Text.Add("<i>“Is [handsomepretty] customer done admiring Asche?”</i> she asks slyly, her muzzle splitting in a canine grin even as her long, fluffy tail begins wagging eagerly. <i>“Asche loves to feel treasured, yes yes, but even though she is magical, she is not for sale.”</i>", parse);
	Text.Flush();
}
