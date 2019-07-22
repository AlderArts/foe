/*
 *
 * Define Rosalin
 *
 */

import { Entity } from '../../entity';

let RosalinScenes = {};

function Rosalin(storage) {
	Entity.call(this);
	this.ID = "rosalin";

	this.ResetBody();
	this.origRaceScore = new RaceScore(this.body);

	this.name         = "Rosalin";
	this.alchemyLevel = 3;

	this.recipes.push(Items.Equinium);
	this.recipes.push(Items.Leporine);
	this.recipes.push(Items.Felinix);
	this.recipes.push(Items.Lacertium);
	this.recipes.push(Items.Nagazm);
	this.recipes.push(Items.Bovia);
	this.recipes.push(Items.Canis);
	this.recipes.push(Items.Lobos);
	this.recipes.push(Items.Vulpinix);
	this.recipes.push(Items.Scorpius);
	this.recipes.push(Items.Lepida);
	this.recipes.push(Items.Avia);
	this.recipes.push(Items.Ovis);

	this.flags["PrefGender"]   = Gender.female;

	this.flags["Met"]          = 0;
	this.flags["AlQuest"]      = 0;
	this.flags["PastDialog"]   = Rosalin.PastDialog.Past;
	this.flags["TreeCityTalk"] = 0;

	// Firsttime TFs
	this.flags["Felinix"]        = 0;
	this.flags["Leporine"]       = 0;
	this.flags["Equinium"]       = 0;
	this.flags["Equinium+"]      = 0;
	this.flags["TakenEquinium+"] = 0;
	this.flags["Lacertium"]      = 0;
	this.flags["Nagazm"]         = 0;
	this.flags["Bovia"]          = 0;
	this.flags["Canis"]          = 0;
	this.flags["Lobos"]          = 0;
	this.flags["Vulpinix"]       = 0;
	this.flags["Scorpius"]       = 0;
	this.flags["Lepida"]         = 0;
	this.flags["Avia"]           = 0;
	this.flags["Ovis"]           = 0;
	this.flags["Anusol"]         = 0;

	if(storage) this.FromStorage(storage);
}
Rosalin.prototype = new Entity();
Rosalin.prototype.constructor = Rosalin;

Rosalin.PastDialog = {
	Past     : 0,
	Teacher  : 1,
	Nomads   : 2,
	TreeCity : 3
}

Rosalin.Anusol = {
	OnTask            : 1,
	TalkedToCale      : 2,
	AskedForCalesHelp : 3,
	DeliveryFromCale  : 4,
	Brewed            : 5,
	ShowedJeanne      : 6
}

Rosalin.prototype.Met = function() {
	return this.flags["Met"] != 0;
}

Rosalin.prototype.FromStorage = function(storage) {
	storage = storage || {};

	this.body.FromStorage(storage.body);
	this.LoadPregnancy(storage);
	this.LoadLactation(storage);

	// Load flags
	this.LoadFlags(storage);
	this.LoadPersonalityStats(storage);

	if(this.flags["Anusol"] >= Rosalin.Anusol.Brewed)
		this.AddAlchemy(Items.Anusol);
}

Rosalin.prototype.ToStorage = function() {
	var storage = {};

	storage.body = this.body.ToStorage();
	this.SavePregnancy(storage);
	this.SaveLactation(storage);

	this.SaveFlags(storage);
	this.SavePersonalityStats(storage);

	return storage;
}

// Reset Rosalin to her original state
Rosalin.prototype.ResetBody = function() {
	this.body = new Body(this);
	this.body.DefFemale();
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Feline, Color.brown);
	TF.SetRaceOne(this.Ears(), Race.Feline);
	this.SetSkinColor(Color.bronze);
	this.Ears().color = Color.brown;
	TF.SetRaceOne(this.Eyes(), Race.Feline);
	this.Eyes().color = Color.green;
	this.Hair().color = Color.teal;
	this.body.height.base = 155;
	this.body.weigth.base = 49;
	this.FirstBreastRow().size.base = 10;
	this.Butt().buttSize.base = 6;
}

Rosalin.prototype.heshe = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "he";
	else return "she";
}
Rosalin.prototype.HeShe = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "He";
	else return "She";
}
Rosalin.prototype.himher = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "him";
	else return "her";
}
Rosalin.prototype.HimHer = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "Him";
	else return "Her";
}
Rosalin.prototype.hisher = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "his";
	else return "her";
}
Rosalin.prototype.HisHer = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "His";
	else return "Her";
}
Rosalin.prototype.hishers = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "his";
	else return "hers";
}

// TODO More variations
Rosalin.prototype.raceDesc = function(compScore) {
	if(compScore == null)
		compScore = this.origRaceScore.Compare(new RaceScore(this.body));
	if(compScore > 0.95)
		return "former catgirl";
	else
		return "catgirl";
}

RosalinScenes.Impregnate = function(mother, father, slot) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : father,
		race   : Race.Human,
		num    : 1,
		time   : 30 * 24,
		load   : 2
	});
}

// Schedule
Rosalin.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Plains.Nomads.Fireplace)
		return (world.time.hour >= 12 || world.time.hour < 3);
	return false;
}

RosalinScenes.Interact = function() {
	var anusol = rosalin.flags["Anusol"];
	var anusolIngredients = true;
	if(anusol < Rosalin.Anusol.AskedForCalesHelp) {
		_.each(Items.Anusol.recipe, function(it) {
			anusolIngredients = anusolIngredients && (party.Inv().QueryNum(it.it) > 0);
		});
	}

	// First time meeting
	if(rosalin.flags["Met"] == 0) {
		rosalin.flags["Met"] = 1;
		cale.flags["Met"]    = Cale.Met.First;
		RosalinScenes.FirstTime();
		return;
	}
	else if((anusol >= Rosalin.Anusol.OnTask) && (anusol < Rosalin.Anusol.Brewed) && anusolIngredients) {
		RosalinScenes.BrewAnusol();
		return;
	}

	Text.Clear();

	var parse = {
		playername : player.name,
		heshe      : rosalin.heshe()
	}

	Text.Add("<i>“Hi, [playername],”</i> Rosalin hails you with a bright smile. <i>“What's on your mind?”</i>", parse);
	Text.NL();

	if(rosalin.flags["AlQuest"] == 1) { // On quest
		Text.Add("<i>“Let's see... I need some lettuce, carrot juice and a rabbit foot,”</i> she says. <i>“You should be able to get all of it from the bunnies running around the plains.”</i>", parse);
		Text.NL();
		Text.Add("<b>You should be able to find some bunnies if you go to the crossroads and look around (X).</b>", parse);
		Text.NL();
	}
	else if(rosalin.flags["AlQuest"] == 2) { // Quest just finished
		rosalin.flags["AlQuest"] = 3; // Finished

		Text.Add("<i>“Seems like my ears are fine now,”</i> she says, carefully touching the fluffy appendages. <i>“They haven't done... <b>that</b> since the first time.”</i>", parse);
		Text.NL();
	}
	Text.Flush();
	rosalin.PrintDescription();

	var options = new Array();

	options.push({ nameStr : "Talk",
		func : RosalinScenes.TalkPrompt, enabled : true
	});
	if(rosalin.flags["AlQuest"] == 3) {
		options.push({ nameStr : "Combine",
			func : function() {
				Text.Clear();
				Text.Add("The alchemist shows you a list of ingredients that [heshe] could turn into a potion of some sort. You could show Rosalin some ingredients that you have found on your travels.", parse);
				Text.NL();

				Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback, true);
			}, enabled : true
		});
	}
	/* TODO Quite bork atm
	options.push({ nameStr : "Sex",
		func : function() {
			RosalinScenes.SexPrompt(RosalinSexState.Regular);
		}, enabled : true
	});
	*/

	Gui.SetButtonsFromList(options, true, PrintDefaultOptions);
}

RosalinScenes.Desc = function() {
	var parse = {
		extinguishedLit : (world.time.hour >= 19 || world.time.hour < 2) ? "lit" : "extinguished"
	};
	parse = rosalin.ParserPronouns(parse);

	if(rosalin.flags["Met"] == 0) {
		Text.Add("Near the [extinguishedLit] fire pit, you see a strange young woman busying herself with a collection of strange flasks, mixing their contents into a larger beaker. She has prominent catlike features, brown-furred ears poking out of her teal hair, and a long sinuous tail swaying behind her generous bottom. Acrid fumes are rising from her concoction, making you wonder if approaching her is really a good idea.", parse);
		Text.NL();
	}
	else {
		Text.Add("Nearby, Rosalin is tending to [hisher] vials as usual, undoubtedly brewing something potentially lethal to [himher]self and those around [himher].", parse);
		Text.NL();
		// TODO: Plant description
	}
}

RosalinScenes.TalkPrompt = function() {
	Text.Clear();

	var racescore = new RaceScore(rosalin.body);
	var compScore = rosalin.origRaceScore.Compare(racescore);

	var parse = {
		playername : player.name,
		raceDesc       : function() { return rosalin.raceDesc(compScore); }
	};
	parse = rosalin.ParserPronouns(parse);

	Text.Add("What would you like to ask [himher] about?", parse);
	Text.Flush();

	//[Alchemy][Blah]
	var options = new Array();
	if(rosalin.flags["AlQuest"] == 0) {
		options.push({ nameStr : "Alchemy",
			func : function() {
				Text.Clear();
				Text.Add("A morbid curiosity drives you to ask the alchemist about her craft.", parse);
				Text.NL();
				Text.Add("<i>“Sure, [playername]!”</i> Rosalin nods happily, excited that you are showing interest in her work. <i>“Alchemy is pretty awesome! You can brew potions, drafts, and even use it to create super special tools!”</i> Dropping the stuff she is working on at the moment - to the detriment of the local vegetation, which is doused in a generous splash of a glowing green liquid - the catgirl picks up a few bowls, showing them to you.", parse);
				Text.NL();
				Text.Add("<i>“There are several types of ingredients that can be used for alchemy,”</i> she explains. <i>“Most basic alchemical compounds are created from passive ingredients like these.”</i> She points out a random assortment of small jars and bottles. Most seems to be samples taken from animals and plants, others are common cooking ingredients. <i>“This stuff doesn't have much use on its own, though some make for a good snack,”</i> she comments. <i>“It gets interesting when you mix them together, though.”</i>", parse);
				Text.NL();
				Text.Add("<i>“With the correct preparation, you can get something like <b>this</b>.”</i> She grins at you, pulling out a stoppered bottle. The liquid inside it is a clear blue, and looks hazardous. <i>“Active ingredients can be used in even more complex recipes,”</i> Rosalin continues, <i>“but they also have uses of their own. This one for example, will make your balls grow three times their size! That, or make you grow bald. I haven't tested it yet.”</i>", parse);
				Text.NL();
				Text.Add("Perhaps she could teach you how to do it?", parse);
				Text.NL();
				Text.Add("<i>“Oh, I'd love to, [playername]! First, you need some basic ingredients. Patchwork might sell some to you, but usually you'd need to find them somewhere else. Let's see, for our first potion, we should make...”</i> Getting a naughty look on her face, Rosalin innocently asks, <i>“Say, how do you think I'd look with bunny ears?”</i> Not sure how to respond, you shrug.", parse);
				Text.NL();
				Text.Add("<i>“How about we find out?”</i> she asks. <i>“Bring me some lettuce, some carrot juice and a rabbit foot charm,”</i> the catgirl instructs. <i>“Some of it you could probably get from Patches, but she'll charge you an exorbitant amount for it. Easier to get it from the source. Go look around the plains, finding some bunnies shouldn't be a problem. It's like there's an infestation of them there...”</i> You take note of the items to get, then head out.", parse);
				Text.NL();
				Text.Add("Before you leave, you notice that the plant growing next to Rosalin's desk seems to have grown at least twice in size since you last looked. The leaves look slightly fuzzy, like they have a thin layer of fur on them, but overall it seems to be flourishing. Curious.", parse);

				rosalin.flags["AlQuest"] = 1;

				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Ask her about her craft."
		});
	}
	if(rosalin.flags["AlQuest"] == 1) {
		options.push({ nameStr : "Alchemy",
			func : function() {
				Text.Clear();

				// Removed requested items
				var it = Items.Leporine;
				for(var j = 0; j < it.recipe.length; j++) {
					var ingredient = it.recipe[j];
					party.inventory.RemoveItem(ingredient.it, ingredient.num);
				}

				Text.Add("<i>“Great, you got the things I asked for!”</i> You are quickly relieved of the requested items, and Rosalin busies herself preparing her alchemical tools. As she works, she points out the various devices she uses, providing a small explanation for each.", parse);
				Text.NL();
				Text.Add("<i>“Really, it's all in the ingredients you pick, how you prepare them before mixing, and a bit of luck!”</i> she finishes, throwing the items you brought into a small pot. Rosalin carefully adds a few smoldering flakes from a sealed container labeled 'salamander scales'. <i>“For the taste,”</i> she explains. <i>“Not really a vegetarian. Besides, I've always wondered what would happen if I mixed in some of this.”</i>", parse);
				Text.NL();
				Text.Add("You look on dubiously as the scales change the color of the draft from orange to a sooty red. Small bubbles breach the surface of the concoction, smelling slightly of sulphur as they pop. Slightly concerned, you ask her if that is really a part of the recipe. The ditzy alchemist doesn't exactly have a good track-record in your book.", parse);
				Text.NL();
				Text.Add("<i>“Hey, I'm the genius here. I know what I'm doing,”</i> she snaps at you, annoyed. <i>“Besides, experimenting with new stuff is half the fun!”</i>", parse);
				Text.NL();
				Text.Add("What about the risks?", parse);
				Text.NL();
				Text.Add("The catgirl looks at you, not comprehending. <i>“What risks?”</i> Well, disregarding that the mixture is probably hazardous, didn't the last one change her eyes? <i>“Well... isn't that the point?”</i> she asks, confused. <i>“What did you think I became an alchemist for, turning lead into gold?”</i>", parse);
				Text.NL();
				Text.Add("You are not quite sure how to answer that.", parse);
				Text.NL();
				Text.Add("Licking her lips eagerly, Rosalin swallows the mixture in one go, gulping down the thick liquid until the container is empty. At first, nothing seems to happen, other than the catgirl expelling a confused burp along with a puff of smoke. When it comes, the change is rapid. Rosalin's feline ears twitch slightly, then shrink into her mass of teal hair, leaving no trace of their existence. Before you have time to comment on this, a pair of floppy bunny ears pop out in their place.", parse);
				Text.NL();
				Text.Add("<i>“Wow, that really hit the spot!”</i> the catgirl sighs happily, fondling her new extremities. The ears are long, covered in fluffy, sooty black fur. <i>“Another successful experiment!”</i> she exclaims, <i>“Girl, you are a geni-<b>hick</b>!”</i> Cut off by a sudden hiccup, she coughs out another puff of smoke. Her expression turns from confused to fearful as tendrils of smoke rise from inside her ears.", parse);
				Text.NL();
				Text.Add("<i>“Uhm, what is goi-”</i> You are buffeted by a small heatwave as Rosalin's ears suddenly burst into flame. <i>“Omigodomigodomigod I'm on fiiire!”</i> Before you can lend her a hand, the screaming catgirl is off, running around the camp in panic. She manages to take two full rounds around the campfire, shrieking gibberish, before stuffing her head into a water barrel, dousing herself.", parse);
				Text.NL();
				Text.Add("You hurry over to her side to see if she is ok. Smelling of wet, burnt fur and wearing a deadpan expression, the alchemist pulls out her notepad. Her hand shakes slightly as she crosses out the entry titled 'salamander scales'. Pausing for a moment, she crosses it over again, for good measure.", parse);
				Text.NL();
				Text.Add("<i>“I... I'm sure the next one will be better,”</i> she wheezes weakly, before going into another coughing fit. You make sure that she is alright before leaving, handing her over to some of the nomads for care.", parse);
				Text.NL();
				Text.Add("You <i>did</i> actually pick up on some things while watching her work, though after the result of her experiments, you vow to not deviate from the recipe.", parse);
				Text.NL();
				Text.Add("<b>Alchemy is now accessible from the menu.</b>", parse);
				Text.Flush();

				TF.SetRaceOne(rosalin.Ears(), Race.Rabbit);
				rosalin.Ears().color = Color.black;

				player.alchemyLevel = 1;
				player.AddAlchemy(Items.Leporine);
				rosalin.flags["AlQuest"] = 2;
				rosalin.relation.IncreaseStat(100, 10);

				Gui.NextPrompt();
			}, enabled : (function() {
				var item = Items.Leporine;
				var enabled = true;
				for(var j = 0; j < item.recipe.length; j++) {
					var component = item.recipe[j];
					enabled &= (party.inventory.QueryNum(component.it) >= (component.num || 1));
				}
				return enabled;
			})(),
			tooltip : "Give her the items she requested."
		});
	}
	if(rosalin.flags["AlQuest"] == 3) {
		options.push({ nameStr : "Alchemy",
			func : function() {
				Text.Clear();
				Text.Add("<i>“There are several types of ingredients that can be used for alchemy,”</i> Rosalin explains. <i>“Most basic alchemical compounds are created from passive ingredients like these.”</i> [HeShe] points out a random assortment of small jars and bottles. Most seem to be samples taken from animals or plants, others are common cooking ingredients. <i>“This stuff doesn't have much use on its own, but it gets interesting when you mix them together.”</i>", parse);
				Text.NL();
				Text.Add("<i>“With the correct preparation, you can get something like <b>this</b>.”</i> [HeShe] pulls out a stoppered bottle containing a clear blue liquid. <i>“Active ingredients can be used in even more complex recipes,”</i> Rosalin continues, <i>“but they also have uses of their own.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Finally, alchemy can be used to create special tools, or enhance equipment.”</i> You pose a few followup questions, and Rosalin shows you how some common ingredients are prepared. The two of you talk for a while, and you feel that you get the hang of it. <i>“Sorry, the best way is really to try it out for yourself. Unless you want to be my apprentice?”</i> Not wishing to die early, you politely decline the offer.", parse);
				Text.NL();
				Text.Add("<b>You can try alchemy on your own by selecting it from the menu.</b>", parse);
				Text.Flush();

				Gui.NextPrompt(RosalinScenes.TalkPrompt);
			}, enabled : true,
			tooltip : "Have Rosalin repeat her teachings on alchemy to you."
		});
	}
	if(rosalin.flags["PastDialog"] >= Rosalin.PastDialog.Past) {
		options.push({ nameStr : Text.Parse("[HisHer] past", parse),
			func : function() {
				Text.Clear();

				Text.Add("<i>“You wanna know about me?”</i> the alchemist looks slightly surprised. <i>“Well, let's see... I grew up in Rigard, third child of a relatively well-to-do noble family. Always had a calling to mixing things, and I thought I wanted to be a chef when I was young.”</i> [HisHer] eyes look off into the distance. <i>“I was really proud of my first dish, and I gave it to my daddy for testing. He seemed to really like it.... but I think it was shortly after that when I found a different calling.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Daddy suddenly fell ill, you see, and was stuck in bed for several months. So I gave up my dream of becoming a master chef and became a doctor instead. Just think of what may have happened if I hadn't been there with my remedies! He might have died!”</i>", parse);
				Text.NL();
				Text.Add("<i>“My parents were really supportive,”</i> Rosalin continues, <i>“once daddy got better, he went to several healers in town, looking to set me up with an apprenticeship. I had several teachers, but after a week or so with each of them, they all agreed I was destined for greater things, so daddy found me a different one. It was a busy time, I was hardly ever home at all!”</i>", parse);
				Text.NL();
				Text.Add("<i>“Eventually, I was admitted as a disciple of Jeanne, the court magician. I took quite a liking to magic, but could never quite get the hang of it. Alchemy, however... this was what I was born to do!”</i> [HeShe] trails off, lost down memory lane.", parse);
				Text.NL();
				Text.Add("<i>“I had a really fun time there,”</i> the [raceDesc] reminisces fondly, <i>“alas, my time there was cut short.”</i> [HeShe] sniffs. <i>“That stuffy elf just couldn't appreciate my true genius.”</i>", parse);
				Text.NL();
				Text.Add("You wait to hear a continuation of the story, but Rosalin seems to be finished for now. [HeShe] stares off into the distance for a while, then goes back to her work, ignoring you.", parse);

				if(rosalin.flags["PastDialog"] == Rosalin.PastDialog.Past) {
					rosalin.relation.IncreaseStat(100, 3);
					rosalin.flags["PastDialog"]++;
				}
				Text.Flush();
				Gui.NextPrompt(RosalinScenes.TalkPrompt);
			}, enabled : true,
			tooltip : Text.Parse("Ask about [hisher] past.", parse)
		});
	}
	if(rosalin.flags["PastDialog"] >= Rosalin.PastDialog.Teacher) {
		options.push({ nameStr : Text.Parse("[HisHer] teacher", parse),
			func : function() {
				Text.Clear();

				Text.Add("<i>“Why'd you want to know about her?”</i> Rosalin shoots back, a bit annoyed, <i>“by now, I've far surpassed her in alchemy. I'm doing stuff she wouldn't even <b>dream</b> of trying.”</i> Somehow, you don't doubt that last part. Still, you try to get some more information from the [raceDesc] alchemist.", parse);
				Text.NL();
				Text.Add("<i>“Fiiine!”</i> [heshe] relents, pouting a bit.", parse);
				Text.NL();
				Text.Add("From what you piece together, Jeanne the magician is an elf, and has been serving as the court mage and head alchemist for the royal family for generations. She has a tower inside the walls of the royal estate, where she studies the arts of magic.", parse);
				Text.NL();
				Text.Add("Rosalin recounts how [heshe] studied under Jeanne, and subsequently got thrown out. <i>“I was one of many disciples, but my work was on another level from theirs,”</i> the [raceDesc] boasts. <i>“They lacked vision, every one of them. Afraid to try new things...”</i> Rosalin's expression turns sour. <i>“Of course, <b>she</b> didn't agree with that. Sniffed at my cute tail when I first grew it, she did!”</i>", parse);
				Text.NL();
				Text.Add("<i>“...And thus it was that my teacher found me feeding a special concoction I had brewed up to one of the other students.”</i> You raise your eyebrows in question. <i>“Look, he agreed to it. Kinda. He might have been a bit drunk at the time. He always wanted a bigger cock anyways,”</i> [heshe] finishes defensively.", parse);
				Text.NL();
				Text.Add("What happened?", parse);
				Text.NL();
				Text.Add("<i>“It worked!”</i> [heshe] exclaims excitedly, <i>“though... perhaps a bit <b>too</b> well. They had to tow him away in a wheelbarrow.”</i> Rosalin shrugs dismissively. <i>“First prototype.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Anyway, the elven hag threw me out of there after that. Good riddance, I say. Her lectures were always so boring, only stupid healing remedies. She was only keeping me back.”</i> There is a slightly mad look in Rosalin's eyes, and you detect traces of hurt pride in [hisher] voice.", parse);
				if(rigard.Access()) {
					Text.NL();
					Text.Add("It sounds like the court mage could be a good person to ask about the gemstone, but to reach her you have to enter the City of Rigard first, and then somehow get to her tower.", parse);
				}
				else if(rigard.flags["RoyalAccess" != 0]) {
					Text.NL();
					Text.Add("One more set of walls still stand between you and Jeanne. Somehow, you must find your way into the royal estate and enter her tower.", parse);
				}

				if(rosalin.flags["PastDialog"] == Rosalin.PastDialog.Teacher) {
					rosalin.relation.IncreaseStat(100, 3);
					rosalin.flags["PastDialog"]++;
				}
				Text.Flush();

				Gui.NextPrompt(RosalinScenes.TalkPrompt);
			}, enabled : true,
			tooltip : Text.Parse("Ask Rosalin about [hisher] alchemy teacher, the court mage Jeanne.", parse)
		});
	}
	if(rosalin.flags["PastDialog"] >= Rosalin.PastDialog.Nomads) {
		options.push({ nameStr : "The Nomads",
			func : function() {
				Text.Clear();

				Text.Add("<i>“I wandered around a bit after my apprenticeship ended, not really knowing where to go,”</i> Rosalin tells you. <i>“Rigard wasn't really a place for me - there was no place where I could perform my experiments in peace.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I... tried to find the tree city, figuring it would be perfect, but I never managed to find it.”</i> The alchemist sighs regretfully. <i>“Estevan was the one who found me, wandering around the forest. Running low on water and food... ah, what don't I do for science! He told me of this great place here, and I've been here since.”</i> The [raceDesc] waves around [himher] at the camp.", parse);
				Text.NL();

				parse["Cale"] = cale.name == "Cale" ? "Cale" : "the friendly wolf-morph";
				Text.Add("<i>“Free reign to run my experiments, and even some willing participants at times! They don't even get angry if I mix a little in the food once in a while!”</i>", parse);
				Text.NL();
				Text.Add("And helpful assistance in [hisher] times of need, you add slyly, mentioning [Cale].", parse);
				Text.NL();
				Text.Add("<i>“That too!”</i> Rosalin agrees, unperturbed.", parse);

				if(rosalin.flags["PastDialog"] == Rosalin.PastDialog.Nomads) {
					rosalin.relation.IncreaseStat(100, 3);
					rosalin.flags["PastDialog"]++;
				}
				Text.Flush();
				Gui.NextPrompt(RosalinScenes.TalkPrompt);
			}, enabled : true,
			tooltip : Text.Parse("Ask Rosalin about how [heshe] ended up at the Nomads' camp, and what [heshe] has been doing here since.", parse)
		});
	}
	if(rosalin.flags["PastDialog"] >= Rosalin.PastDialog.TreeCity) {
		options.push({ nameStr : "Tree city",
			func : function() {
				Text.Clear();

				Text.Add("<i>“There is said to be a large city in the branches of the Great Tree,”</i> Rosalin excitedly tells you, pointing toward the hulking behemoth in the distance. As if you could miss it. <i>“All sorts of folks are said to live there; morphs, talking animals, strange creatures from lands you couldn't even imagine! Just think of all the knowledge they must have...”</i> [HeShe] trails off, looking a bit dejected.", parse);
				Text.NL();
				Text.Add("<i>“I never managed to get there, though. Even if I braved the forest and managed to reach the trunk, I'm not sure how I would climb it. It looks so far!”</i>", parse);
				Text.NL();

				if(treecity.flags["Access"] != 0 && rosalin.flags["TreeCityTalk"] == 0) {
					Text.Add("You tell [himher] that you have actually been there.", parse);
					Text.NL();
					Text.Add("<i>“Y-you what?”</i> the alchemist exclaims, <i>“you'd better not be pulling my tail!”</i>", parse);
					if(!rosalin.HasTail())
						Text.Add(" Rosalin checks over [hisher] shoulder. <i>“Oh, right. Figuratively speaking, of course. Could have sworn I had one of those recently.”</i>", parse);
					Text.NL();
					Text.Add("You recount the tale of your arrival in the city. [HisHer] eyes grows wider and wider, until [heshe] cannot contain [hisher] excitement anymore. You're suddenly flooded with questions, barely managing to keep up with the alchemist.", parse);
					Text.NL();
					Text.Add("<i>“T-that's amazing!”</i> Rosalin is practically jumping up and down on the spot. [HeShe] whirls around, grabs a sack and starts to throw pieces of [hisher] equipment into it. <i>“There is so much I want to see there, I can hardly wait!”</i> the alchemist chatters, <i>“I wonder what sort of potions they brew! Should I bring these?”</i> [HeShe] curtly dismisses a set of tools. <i>“Too rural, they must have way better tools there. Do they accept regular coins?”</i>", parse);
					Text.NL();
					Text.Add("Hold up a bit! Did [heshe] miss the part about how dangerous it was to go there? Rosalin looks crestfallen, mumbling something and avoiding your gaze. Dejected, [heshe] slowly unpacks.", parse);
					Text.NL();
					Text.Add("Hurriedly, you promise that you will tell [himher] anything [heshe] wants about the city, and perhaps bring [himher] things from there. This significantly brightens [hisher] mood, and the two of you spend some more time talking. Rosalin hangs on to every word you say, and you worry that [heshe] might just try to go, regardless of the danger.", parse);

					rosalin.flags["TreeCityTalk"] = 1;
				}
				else if(treecity.flags["Access"] != 0) {
					Text.Add("Rosalin eagerly questions you about the properties of the tree city and its people.", parse);
				}
				else {
					Text.Add("You ask [himher] if anyone [heshe] knows has ever been there.", parse);
					Text.NL();
					Text.Add("<i>“It isn't just a rumor!”</i> Rosalin frowns at you, berating you for doubting [himher]. <i>“I found an old book about it, and the chief said it may well be true!”</i>", parse);
				}
				Text.NL();
				Text.Add("After chatting for a bit, you decide to leave the alchemist to [hisher] dreams.", parse);

				if(rosalin.flags["PastDialog"] == Rosalin.PastDialog.TreeCity) {
					rosalin.relation.IncreaseStat(100, 3);
					rosalin.flags["PastDialog"]++;
				}
				Text.Flush();
				Gui.NextPrompt(RosalinScenes.TalkPrompt);
			}, enabled : true,
			tooltip : Text.Parse("[HeShe] mentioned the tree city...?", parse)
		});
	}
	if(cale.flags["Met2"] == Cale.Met2.TalkedSlut) {
		options.push({ nameStr : "Cale anal",
			func : function() {
				cale.flags["Met2"] = Cale.Met2.Goop;
				Text.Clear();
				Text.Add("<i>“Sure, what does wuffie want?”</i> the alchemist asks, a light shining up in [hisher] eyes at the opportunity to experiment on someone. You explain that he’s been taking a lot of cock lately, and he’s wondering if Rosalin could... help him with that.", parse);
				Text.NL();
				Text.Add("<i>“Ah… Ahhh! I know just what he needs!”</i> Rosalin exclaims. Somehow, you sincerely doubt that she does. Either way, you’ve set [himher] into motion, there is no stopping it now. The alchemist goes on to mix several strange ingredients into a bit jar, grinding them into a luminescent goop.", parse);
				Text.NL();
				Text.Add("As [heshe] works, you notice that Cale has wandered onto the scene, how convenient. You greet him with a nod, secretly hoping that this doesn’t mess him up too much.", parse);
				Text.NL();
				Text.Add("<i>“Hey there, [playername]. Sup Rosie? Whacha cooking?”</i> the unsuspecting wolf inquires, but the alchemist is too busy with her mix to even acknowledge his presence. ", parse);
				Text.NL();
				Text.Add("<i>“There! It’s done!”</i> Rosalin declares, adding a small sprinkling of green dust to the mix just for kicks. The resulting cream has a rancid fragrance, and looks like it could corrode metal. Suddenly noticing Cale, Rosalin shines up. <i>“There you are wuffie! Bend over for me, and this’ll be over in a moment!”</i>", parse);
				Text.NL();
				Text.Add("<i>“Umm, what? I have a feeling it’s time to split,”</i> he says, backing off, looking just like he’s about to bolt. You quickly intervene by blocking his path. Cale panics, trying to scramble away.", parse);
				Text.NL();
				Text.Add("<i>“Hold him for me, would you, [playername]?”</i> Rosalin asks sweetly. With your combined efforts, you bend the struggling and protesting wolf over one of the logs around the fire pit and pull down his pants. <i>“Calm down now, this is for your own good...”</i> the alchemist coos.", parse);
				Text.NL();
				Text.Add("<i>“The heck are you two doing!? W-What is that, Rosie?”</i> he sputters, <i>“that doesn’t look sa- Aaaah!”</i> The wolf yowls in shock as Rosalin swipes a scoop of the glowing goop and shoves it into his butt. Cale squirms and moans as the alchemist wriggle [hisher] hand around, coating the wolf’s insides in the strange concoction.", parse);
				Text.NL();
				Text.Add("<i>“I-It’s tingling, aaah!”</i> the wolf moans, his legs going weak as the cream begins to take effect. <i>“W-what did you put in there, Rosie?!”</i> The alchemist takes a step back to admire [hisher] work.", parse);
				Text.NL();
				Text.Add("<i>“With this, you should be able to take even the biggest cocks without trouble!”</i> Rosalin declares, <i>“and you should be way more sensitive too!”</i> In [hisher] own way, the alchemist did [hisher] best to help [hisher] friend, you suppose, even if this wasn’t quite what you asked for.", parse);
				Text.NL();
				// Set slut to 60
				cale.slut.IncreaseStat(60, 100);
				cale.Butt().capacity.base = 15;

				Text.Add("<i>“Haah… hot… so hot,”</i> Cale pants, barely able to form sentences anymore, so overwhelmed is he by the new sensations. <i>“Fuck! Need to fuck! Someone… fuck me!”</i> He begins pawing at his butt desperately, throwing pleading glances at you and Rosalin.", parse);
				var cocksInAss = player.CocksThatFit(cale.Butt());
				if(cocksInAss.length == 0) {
					Text.NL();
					Text.Add("<i>“I could lend you something, if you’d like?”</i> the alchemist suggests, a twinkle in [hisher] eye.", parse);
				}
				Text.Flush();

				world.TimeStep({minute: 45});

				parse["canusDesc"] = function() { return cale.Butt().AnalShort(); }
				parse["cocks"] = function() { return player.MultiCockDesc(); }
				//[Take him][Rosalin]
				var options = new Array();
				options.push({ nameStr : "Take him",
					func : function() {
						Text.Clear();
						if(cocksInAss.length == 0) {
							Text.Add("<i>“Gimme a sec… no, too small… this one? Ah! Perfect!”</i> Rosalin triumphantly pulls out a huge strapon, formed in the shape of a canine cock. Near the thick base, there is a quite realistic knot, complete with veins and all. The entire thing is slightly longer than Cale’s own member.", parse);
							Text.NL();
							Text.Add("<i>“Fitting, don’t you think?”</i> Rosalin grins, handing you the toy. <i>“You can keep it, I have a few other ones laying around.”</i> You gratefully accept the gift, securing the straps around your waist.", parse);
							Text.NL();
							Text.Add("<b>Acquired and equipped a canid strapon!</b>", parse);
							Text.NL();

							var inv = party.inventory;
							if(player.strapOn) inv.AddItem(player.strapOn);
							player.strapOn = Items.StrapOn.CanidStrapon;
							player.Equip();
						}
						Text.Add("Over by the campfire, Cale is growing anxious. The horny wolf, desperate to be filled, is pumping three of his fingers into his [canusDesc], trying his outmost to sate his desires. He lights up when you step up behind him, grinding your [cocks] between his cheeks. His tail is wagging back and forth in excitement, conveniently raised high to allow you full access.", parse);
						Text.NL();

						Scenes.Cale.SexFuckHim(true, {goop: true});
					}, enabled : true,
					tooltip : "Looks like he’s gone into heat… best help him through this."
				});
				if(rosalin.FirstCock()) {
					options.push({ nameStr : "Rosalin",
						func : function() {
							Text.Clear();
							parse["rcocks"] = function() { return rosalin.MultiCockDesc(); }
							Text.Add("You ask if the alchemist wants to take care of him.", parse);
							Text.NL();
							Text.Add("<i>“Sure, I can do that!”</i> Rosalin grins as [heshe] pulls out [hisher] [rcocks]. <i>“Wolfie! Down boy!”</i> Cale’s tongue is lolling and his tail is wagging happily as Rosalin takes position behind him, grinding against his now incredibly sensitive taint.", parse);
							Text.NL();
							parse["s"] = rosalin.NumCocks() > 1 ? "s": "";
							Text.Add("<i>“T-take me Rosie, just take me!”</i> he howls, pushing his hips back against the alchemists stiff shaft[s]. There is a wild gleam in Rosalin’s eyes as [hisher] desires start to well up. You settle down for the show, eager to see how the new changes will affect Cale.", parse);
							Text.NL();

							RosalinScenes.FuckCaleWatchEntryPoint();
						}, enabled : true,
						tooltip : "How about letting the alchemist do the honors?"
					});
				}
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true,
			tooltip : Text.Parse("You aren’t sure this is such a good idea… but ask [himher] if [heshe] can make something for Cale.", parse)
		});
	}
	else if((cale.Buttslut()) || (player.sex.gAnal + player.sex.rAnal >= 10)) {
		var caleScene = cale.Buttslut();
		var tooltip = caleScene ? "You’ve been wondering about that mixture [heshe] made for Cale’s butt..." : "You’ve been wondering about something that would make anal more pleasurable...";
		if(rosalin.flags["Anusol"] == 0) {
			options.push({ nameStr : "Anal experiment",
				func : function() {
					rosalin.flags["Anusol"] = Rosalin.Anusol.OnTask;

					Text.Clear();
					Text.Add(tooltip, parse);
					Text.NL();
					Text.Add("<i>“Yeah? What about it?”</i>", parse);
					Text.NL();
					Text.Add("Does Rosalin think [heshe] could make you ", parse);
					if(caleScene)
						Text.Add("another batch of that stuff [heshe] mixed up for Cale?", parse);
					else
						Text.Add("something to help you with that?", parse);
					Text.NL();
					Text.Add("The alchemist thinks for a bit, then sifts over [hisher] supplies. <i>“I think I can do that… but I’m gonna need some ingredients.”</i>", parse);
					Text.NL();
					Text.Add("That makes sense, given Rosalin’s constant experiments. You nod your understanding and ask [himher] what [heshe] needs you to bring [himher] for the mixture.", parse);
					Text.NL();
					Text.Add("<i>“Some <b>Snake Oil</b>, <b>Spring Water</b>, and <b>Fruit Seeds</b>. For extra punch. I’m sure you won’t have to look too hard to find these,”</i> [heshe] nods. <i>“Of course, if you don’t want to go hunting for my stuff, you could always get Wolfie to get them for you. But that’s your business with him,”</i> [heshe] adds.", parse);
					Text.NL();
					Text.Add("You thank Rosalin for agreeing to help you and promise [himher] you’ll be back when you have the ingredients [heshe] needs.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : Text.Parse(tooltip, parse)
			});
		}
	}
	if(party.InParty(terry) && terry.flags["TF"] & Terry.TF.TriedItem && !(terry.flags["TF"] & Terry.TF.Rosalin)) {
		options.push({ nameStr : "Terry",
			func : Scenes.Terry.RosalinTF, enabled : true,
			tooltip : "Perhaps Rosalin can help you with Terry’s strange resistance to transformatives?"
		});
	}
	/* TODO: More dialogue
	options.push({ nameStr : "Blah",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	*/
	Gui.SetButtonsFromList(options, true, RosalinScenes.Interact);
}

RosalinScenes.BrewAnusol = function() {
	var racescore = new RaceScore(rosalin.body);
	var compScore = rosalin.origRaceScore.Compare(racescore);

	var parse = {
		race   : function() { return rosalin.raceDesc(compScore); },
		rcocks : function() { return rosalin.MultiCockDesc(); }
	};
	parse = rosalin.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, rosalin.NumCocks() > 1);

	var anusol = rosalin.flags["Anusol"];

	Text.Clear();
	if(anusol >= Rosalin.Anusol.AskedForCalesHelp) {
		Text.Add("As you approach the humming chimeric alchemist, [heshe] whirls around to face you.", parse);
		Text.NL();
		Text.Add("<i>“Ah, I was wondering where you had gone to! Wolfie already delivered the goods, so let’s get started shall we?”</i>", parse);
	}
	else {
		Text.Add("As you approach the humming chimeric alchemist, you tell [himher] that you found the ingredients [heshe] needed, holding them out as proof of your words.", parse);
		Text.NL();
		Text.Add("Rosalin quickly swipes the bag off your hands and checks its contents. <i>“Excellent!”</i> [heshe] purrs. <i>“Wait for a bit and I’ll get started on this.”</i>", parse);
	}
	Text.NL();
	Text.Add("You nod and take a few subtle steps backwards, putting a little extra distance between yourself and Rosalin’s makeshift laboratory for safety’s sake. Just in case [hisher] experiment doesn’t quite turn out the way [heshe] expects it to.", parse);
	Text.NL();
	Text.Add("Rosalin begins mixing the ingredients. [HeShe] carelessly dumps both the Snake Oil and the Spring Water into a pot, then begins stirring the mixture. Once it’s turned into a bubbling mix, [heshe] adds the Fruit Seeds. You cover your eyes as there’s a small explosion, smoke pouring out of the pot as Rosalin finishes with a grin.", parse);
	Text.NL();
	Text.Add("<i>“Now let’s see...”</i> [HeShe] takes a bit of the resulting mix and downs it. There is a moment of inactivity before the effects kick in, sending the alchemist into an instant orgasm as [hisher] butt bucks and quivers. It’s almost as if [heshe] was being fucked anally…", parse);
	Text.NL();
	Text.Add("<i>“Oh yes! This! Is! Great!”</i> [heshe] says, as [heshe] achieves orgasm.", parse);
	if(rosalin.FirstCock())
		Text.Add(" [HisHer] [rcocks] spew[notS] forth a load of semen.", parse);
	if(rosalin.FirstVag())
		Text.Add(" [HisHer] pussy clenches as a flood of juices escape [himher].", parse);
	Text.NL();
	Text.Add("You watch the panting [race] as [heshe] shivers and quakes to a stop, moaning in release. When you think [heshe] can speak again, you ask if this experiment was a success.", parse);
	Text.NL();
	Text.Add("<i>“I’d say yes, here’s your share,”</i> [heshe] says, bottling up the remaining liquid and passing the bottle to you.", parse);
	Text.NL();
	Text.Add("Accepting the potion, you tuck it carefully away and thank [himher] for [hisher] efforts before you leave [himher] to enjoy [hisher] afterglow.", parse);
	Text.Flush();

	if(anusol < Rosalin.Anusol.AskedForCalesHelp) {
		_.each(Items.Anusol.recipe, function(it) {
			party.Inv().RemoveItem(it.it);
		});
	}

	party.Inv().AddItem(Items.Anusol);

	player.AddAlchemy(Items.Anusol);
	rosalin.AddAlchemy(Items.Anusol);

	rosalin.flags["Anusol"] = Rosalin.Anusol.Brewed;

	Gui.NextPrompt();
}

RosalinScenes.FirstTime = function() {
	Text.Clear();

	var parse = {
		playername : player.name,
		faceDesc   : function() { return player.FaceDesc(); },
		armDesc    : function() { return player.ArmDesc(); },
		legDesc    : function() { return player.LegDesc(); },
		kiakai     : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);

	Text.Add("You uncertainly edge closer to the catgirl, ready to jump back at a moment's notice, should her mixture suddenly explode. There seems to be a prominent risk of this, considering the patchily scorched ground surrounding her makeshift laboratory. Humming softly to herself, she pours the contents of an unmarked flask into a beaker while stirring the mixture with a spoon. She seems completely absorbed by her work, her brow furrowed in concentration and her small pink tongue sticking out of the corner of her mouth.", parse);
	Text.NL();
	Text.Add("Taking advantage of her focused attention, you take stock of the girl. Shorter than average, her curvy, tanned body is a perfect fit for her scanty green dress, tied up to her hip on one side. Her bodice does a poor job of containing her C-cup breasts, which are in constant danger of popping out. With the exception of her tail and the feline ears poking out of her long curly teal hair, the woman seems to be human.", parse);
	Text.NL();
	Text.Add("She finally notices you, turning around with a bright smile. <i>“Why hello there, you are a new face!”</i> Abandoning her glass bottles completely, she saunters over to you, grabbing and shaking your hand enthusiastically. Once you regain possession of it, you wipe off a thick gel she unwittingly transferred to it, trying to make it appear inconspicuous. <i>“I'm Rosalin, alchemist prodigy!”</i>", parse);
	Text.NL();
	Text.Add("Hopefully, you extract the dull gem from your pocket and present it to her. Taking the gem in her clawed hands, she turns it around, studying it from different angles. Her conventional avenues of investigation apparently exhausted, she tries to bite it.", parse);
	Text.NL();

	if(party.InParty(kiakai))
		Text.Add("<i>“W-what in Aria's name do you think you are doing, woman!”</i> your elvish companion exclaims, hurriedly retrieving the gemstone from the annoyed catgirl.", parse);
	else
		Text.Add("Concerned for the safety of the stone, you ask for it back and hurriedly retrieve the gemstone before she has chance to deal any damage to it.", parse);
	Text.NL();

	Text.Add("<i>“I dunno, might be magic.”</i> She shrugs. <i>“The glow is real pretty, though. I wonder what properties it would have if ground into a powder?”</i> Pulling out a battered notebook, the woman scrawls down some observations. <i>“You wouldn't mind me borrowing it for a while?”</i> Decisively shaking your head, you pocket the stone again.", parse);
	Text.NL();
	Text.Add("Prodigy? Really? She doesn't look the type... in fact, face to face with her, the catgirl seems flighty, her attention constantly wandering. You ask her what she is working on right now.", parse);
	Text.NL();
	Text.Add("<i>“Oh, this? I got an idea to improve the potency of the Felinix draft by adding some other ingredients to it!”</i> She certainly seems excited about it, even if you have no idea what she is talking about. The smoke rising from her abandoned mixture has become a bright yellow in color, and seems to be bubbling violently.", parse);
	Text.NL();
	Text.Add("<i>“The key point is the hairballs, but I hate the taste of those things,”</i> she complains, unconcerned by the rising pillar of smoke behind her, <i>“so I thought I'd try to improve the flavor a bit with some equine cum.”</i>", parse);
	Text.NL();
	Text.Add("...What? Glancing around uncertainly, you notice that the other inhabitants of the camp seem to have distanced themselves from you. <i>“That stuff is like good thick cream, mellows the taste of anything!”</i> Snapping her fingers, she exclaims, <i>“Why didn't I think of that? Might even amplify the effect-”</i>", parse);
	Text.Flush();

	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("Rosalin is cut off mid-sentence as her alchemical mixture picks this exact moment to violently explode, throwing you flat on your back, with a buxom catgirl pressed against your [faceDesc]. Almost as quickly as you've fallen, the catgirl jumps off you with a happy yowl. <i>“Ah! It is finished!”</i> Groaning, you get to your feet, carefully following the crazy feline.", parse);
		Text.NL();
		Text.Add("With disbelief, you ask if she really expected the mixture to explode like that.", parse);
		Text.NL();
		Text.Add("<i>“Oh, don't worry about that, it does that occasionally,”</i> she waves off your concern. Though her entire workbench is pretty much ruined, its contents thrown to the ground by the initial blast, the beaker itself is somehow fine. It must be made from a really sturdy material, not glass like it first seemed. Shoving the debris aside, Rosalin studies the liquid within the container. It still has a pungent odor, but it no longer looks unstable. The alchemist pours the mixture into a glass that also survived the explosion, a drop of the liquid splattering on the table. You watch as it slowly erodes the woodwork, a tiny column of smoke rising from the puddle. Jotting down a few more notes, she pockets her notepad and grabs the glass. In one long swig, she downs the entire concoction, to your dismayed cry. Does she want to kill herself?!", parse);
		Text.NL();
		Text.Add("Rosalin finishes the glass with a satisfied burp, even licking stray droplets from her full lips. At first, nothing seems to happen. Just as you start to ask her if she is alright, the alchemist doubles over with a surprised yelp, clutching her stomach. Concerned, you hurry over to her, but are caught off guard when she grabs one of your [armDesc]s. Her grip is surprisingly strong, and she roughly shoves your hand against one of her breasts, moaning appreciatively.", parse);
		Text.NL();
		Text.Add("Her face is beet red, shiny with sweat, and her breathing comes in short bursts. <i>“Hah-ah... I didn't expect it to have quite... such a punch,”</i> she pants. She has worked your hand inside her dress, her nipple stiff against your palm. When you look at her, you see that her emerald eyes are almost feral, burning with need. <i>“D-definitely writing this one down for later!”</i> she gasps, her free hand ripping off the top of her dress, leaving her bare-chested.", parse);
		Text.NL();
		Text.Add("<i>“Hah, this one's new,”</i> a voice behind you chuckles. Turning around, you face a grinning wolf-morph, his short gray fur covering wiry muscle. His trousers are bulging with what you can only assume is a large erection.", parse);
		Text.NL();
		Text.Add("<i>“Little Miss Rosie here usually needs something to take her mind off work when she has been testing her own experiments,”</i> the wolf says fondly, caressing the catgirl's hair. Rosalin has gone on to humping your [legDesc], moaning and ineffectually trying to get out of her dress. <i>“This is the first time I've seen her go into heat though,”</i> the wolf notes, reaching for the fastenings of his pants.", parse);
		Text.NL();

		if(player.FirstCock())
			Text.Add("<i>“So, you taking front or back?”</i> The wolf casually asks.", parse);
		else
			Text.Add("<i>“I need to tend to missy here, so why don't you scoot over. Unless you'd like some too, of course,”</i> the wolf offers with a grin.", parse);
		Text.NL();

		if(party.InParty(kiakai)) {
			Text.Add("<i>“[playername], is this really the time?”</i> [kiakai] asks you uncertainly. You point out that the alchemist seems to be in need, and it's not like you can just leave her like that.", parse);
			if(kiakai.flags["Attitude"] < Kiakai.Attitude.Neutral)
				Text.Add("After suggesting that the perhaps the elf wants to do it [himher]self, [heshe] hurriedly backs off, blushing furiously.", parse);
			Text.NL();
		}
		Text.Add("What do you do?", parse);
		Text.Flush();

		RosalinScenes.FirstFuck();
	});
}

RosalinScenes.FirstFuck = function() {

	var parse = {
		armorDesc     : function() { return player.ArmorDesc(); },
		cocks : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		earsDesc      : function() { return player.EarDesc(); },
		breasts    : function() { return player.FirstBreastRow().Short(); },
		buttDesc      : function() { return player.Butt().Short(); },
		hipsDesc      : function() { return player.HipsDesc(); },
		tongueDesc    : function() { return player.TongueDesc(); },
		faceDesc      : function() { return player.FaceDesc(); },

		rvag      : function() { return rosalin.FirstVag().Short(); }
	};

	var cocks            = player.CocksThatFit(rosalin.FirstVag());
	var p1Cock           = player.BiggestCock(cocks);
	parse["cock"]    = function() { return p1Cock.Short(); };
	parse["cockTipDesc"] = function() { return p1Cock.TipShort(); }
	cocks                = player.CocksThatFit(cale.Butt());
	var p2Cock           = player.BiggestCock(cocks);

	world.TimeStep({minute: 45});

	var options = new Array();
	options.push({ nameStr : "Fuck her",
		func : function() {
			Text.Clear();

			cale.flags["Met"] = Cale.Met.YouTookRosalin;

			rosalin.relation.IncreaseStat(100, 5);

			Text.Add("Insisting that you can handle this on your own, you push the wolf back. He growls and complains a bit, but reluctantly backs off. The wolf already forgotten, you pull off your [armorDesc], revealing your [cocks]. Delighted, the horny catgirl all but throws herself at you, greedily lapping away at your [cocks].", parse);
			Text.NL();
			if(player.NumCocks() > 1) {
				Text.Add("Deciding to only focus on one of your cocks, Rosalin decides on the biggest one she can take, your [cock].", parse);
				Text.NL();
			}
			Text.Add("After properly lathering you up, the alchemist twirls around, rubbing her private parts against your [cock], mewling needily. Not wanting to keep the lady waiting, you line up with her [rvag], prying apart her soaked labia. ", parse);
			if(p1Cock.length.Get() < 25)
				Text.Add("<i>“J-just take me already! I <b>need</b> you inside me!”</i> she moans.", parse);
			else
				Text.Add("<i>“So <b>big</b>,”</i> she moans. <i>“B-be gentle with me, okay?”</i> Even in her aroused state, she looks slightly worried about your size.", parse);
			Text.NL();
			Text.Add("Feels like you're not the first one to pound this kitty; her [rvag] easily give way to your [cock], her walls clamping down around your length hungrily. <i>“Yes! <b>Yes!</b> Breed me!”</i> Rosalin eagerly begins to grind against your crotch, her soaking hole swallowing more and more of you with each thrust.", parse);
			Text.NL();

			Sex.Vaginal(player, rosalin);
			player.Fuck(p1Cock, 4);
			rosalin.FuckVag(rosalin.FirstVag(), p1Cock);

			Text.Add("Not to be outdone, you match her thrust for thrust, grinding the poor girl into the ground. Mewling like the cat in heat that she is, Rosalin curls her toes in pleasure, her long sinuous tail sweeping back and forth erratically, softly bashing you.", parse);
			Text.NL();
			Text.Add("Around you, the nomad camp continues with its usual activities, though there are a few amused glances cast in your direction. Apparently, petting the cat is a regular event here. Even so, you intend to make the experience a memorable one for her.", parse);
			Text.NL();
			Text.Add("The catgirl's breaths come in short grunts, in time with your rhythmic pumping. With a final loud yowl, she contracts around your [cock], milking you for all she is worth. You let out a cry of your own, as you paint her well-used cavern white. ", parse);
			if(player.CumOutput() > 3)
				Text.Add("<i>“Y-yes, get me pregnant!”</i> she screams, loud enough for the whole camp to hear, as load upon potent load fills her up, some starting to leak back out.", parse);
			else
				Text.Add("<i>“F-fuck yes!”</i> she pants as your load settles inside her.", parse);
			Text.Add(" Pulling out, you clean yourself off, waiting for the battered woman to regain her senses.", parse);
			Text.NL();
			Text.Add("The stuff she drank must have been potent, as she shows no signs of slowing, fervently fingering herself as your semen leaks out of her. Squaring your shoulders, you get ready for round two. There is no rest for the wicked...", parse);
			Text.Flush();

			Gui.NextPrompt(function() {
				player.AddLustFraction(-1);
				RosalinScenes.FirstFuckFollowup(0);
			});
		}, enabled : p1Cock,
		tooltip : "Why not rise to the occasion and fuck her until she calms down. You got there first, the wolf can just buzz off."
	});
	options.push({ nameStr : "Wolf",
		func : function() {
			cale.flags["Met"] = Cale.Met.CaleTookRosalin;

			Text.Clear();
			Text.Add("You delicately disentangle yourself from the horny catgirl, pushing her into the arms of the wolf-morph. Not wishing to take care of the alchemist yourself, you tell him that he can have her. Wasting no time, the wolf rips off Rosalin's dress, leaving her as nude as the day she was born. The alchemist eagerly returns the favor, pulling down his pants to reveal a strapping nine-inch canine shaft with a flat tip. A thick knot is slowly swelling at its base, peeking out of a furry sheet just above the wolf's heavy sack.", parse);
			Text.NL();
			Text.Add("Hastily excusing yourself, you leave them alone. Rosalin is going to town on him, sucking him off while fingering herself desperately. She seems to have already forgotten about you.", parse);
			Text.Flush();

			Gui.NextPrompt(function() {
				player.AddLustFraction(0.3);
				RosalinScenes.FirstFuckFollowup(1);
			});
		}, enabled : true,
		tooltip : "Let the wolf handle her on his own, he seems capable enough."
	});
	options.push({ nameStr : "Share",
		func : function() {
			Text.Clear();
			rosalin.relation.IncreaseStat(100, 10);

			Text.Add("You tell him you could use his company, suggesting the two of you could share the horny alchemist. Grinning, the wolf quickly gets rid of his clothes, presenting Rosalin with his flat-tipped, nine-inch canine shaft. She gleefully swallows several inches, gripping his knot with one hand, the other grasping at your [armorDesc].", parse);
			Text.NL();
			Text.Flush();

			cale.flags["Met"] = Cale.Met.SharedOnlyRosie;

			parse.genDesc = function() { return player.FirstCock() ? player.MultiCockDesc() : player.FirstVag() ? player.FirstVag().Short() : "bare crotch"; }

			//[Get serviced][Get fucked][Fuck her]
			var options = new Array();
			options.push({ nameStr : "Get serviced",
				func : function() {
					Text.Add("Amused, you aid her in undressing you, exposing your [genDesc]. The catgirl quickly adjusts to pleasuring both of you, ", parse);
					if(player.FirstCock())
						Text.Add("alternating between sucking you off and stroking your [cocks].", parse);
					else if(player.FirstVag())
						Text.Add("licking and lapping at your [vagDesc], gently probing the orifice with two fingers.", parse);
					else
						Text.Add("gently probing your [anusDesc] with one finger.", parse);

					Text.NL();
					Text.Add("<i>“I'm taking her first,”</i> the wolf-morph growls, asserting himself. Roughly pushing the mewling girl on her back, he lines up his cock with her [rvag], spearing her in one smooth motion. Grunting, the wolf pushes himself all the way inside, pushing his knot into the catgirl.", parse);
					Text.NL();
					Text.Add("Slightly miffed at being left out, you play with yourself while waiting for the wolf to finish.", parse);
					Text.Flush();

					//[Oral][Fuck him]
					var options = new Array();
					options.push({ nameStr : "Oral",
						func : function() {
							Text.Clear();
							p1Cock = player.BiggestCock();

							if(player.FirstCock()) {
								Sex.Blowjob(rosalin, player);
								rosalin.FuckOral(rosalin.Mouth(), p1Cock, 2);
								player.Fuck(p1Cock, 2);
							}
							else {
								Sex.Cunnilingus(rosalin, player);
								rosalin.Fuck(null, 2);
								player.Fuck(null, 2);
							}

							Text.Add("Shrugging, you shuffle around so that you are straddling the alchemist's face, your back to the wolf. Without hesitation, she leans in, ", parse);
							if(player.FirstCock())
								Text.Add("sucking your [cock] into her eager mouth. ", parse);
							else if(player.FirstVag())
								Text.Add("burying her tongue in your wet [vagDesc]. ", parse);
							else
								Text.Add("her tongue going wild on your bare crotch. ", parse);

							Text.Add("Thoroughly enjoying yourself, you ride her face, rocking your hips back and forth.", parse);
							if(p1Cock && p1Cock.length.Get() > 20)
								Text.Add(" With little effort, your [cock] is firmly lodged in her throat.", parse);
							Text.NL();
							Text.Add("The wolf-morph leans against you, playfully nibbling at one of your [earsDesc] before continuing his pounding. Before long, it seems like he's reaching his limit, howling as he unloads inside the catgirl. He reaches his arms around you, pulling you into a rough embrace while caressing your [breasts]. <i>“Quite the little minx, isn't she?”</i> he grunts, resting against your back as his knot swells, locking him inside the catgirl.", parse);
							Text.NL();
							Text.Add("Said minx quickly brings you to your own orgasm, ", parse);
							if(player.FirstCock()) {
								Text.Add("milking your [cock] for its seed.", parse);
								if(player.NumCocks() > 1)
									Text.Add(" Your other dick[s] also erupt[notS], drenching the slutty catgirl, strands of white staining her teal hair.",
										{s    : (player.NumCocks() == 2) ? "" : "s",
										 notS : (player.NumCocks() == 2) ? "s" : ""});
							}
							else if(player.FirstVag())
								Text.Add("drenching her face in feminine juices that the catgirl eagerly laps up.", parse);
							else
								Text.Add("convulsing and grinding against her face.", parse);
							Text.NL();
							Text.Add("The three of you rest like that for a while, cuddling against one another. The wolf-morph, knot finally deflating, pulls out and crawls over to Rosalin, presenting her with his sticky member. The catgirl blissfully cleans him off, her hips shaking as she climaxes another time.", parse);

							Text.NL();
							Text.Add("Exhausted, the three of you rest for a while, regaining your energy.", parse);
							Text.Flush();

							Gui.NextPrompt(function() {
								player.AddLustFraction(-1);
								RosalinScenes.FirstFuckFollowup(2);
							});
						}, enabled : true,
						tooltip : "Rosalin's mouth is still free."
					});
					if(p2Cock) {
						options.push({ nameStr : "Fuck him",
							func : RosalinScenes.FirstFuckPegWolf, enabled : true,
							tooltip : "If you wait for him to knot inside her, there is not much the wolf can do to stop you..."
						});
					}
					Gui.SetButtonsFromList(options);
				}, enabled : true,
				tooltip : "Have her pleasure you orally."
			});
			options.push({ nameStr : "Get fucked",
				func : function() {
					player.subDom.DecreaseStat(-100, 3);
					cale.flags["Sexed"]++;

					cale.flags["Met"] = Cale.Met.SharedGotFucked;

					Text.Add("Deciding to have a taste yourself, you drop to your knees beside Rosalin, hungrily eyeing the wolf-morph's thick member. He almost has to force Rosalin off it to allow you to get access. Getting far more of a treat than he expected, the wolf leans back languidly, enjoying the dual blowjob.", parse);
					Text.NL();
					Text.Add("In what seems to be an attempt to top you, Rosalin starts to give the morph a titjob, massaging his length with her soft mounds. ", parse);
					if(player.FirstBreastRow().size.Get() >= 10)
						Text.Add("Not to be outdone, you mash your own [breasts] against Rosalin's, the wolf's cock suddenly enveloped between four soft cushions.", parse);
					else
						Text.Add("Unable to match her in size, you content yourself with sucking at the canid's cock tip.", parse);
					Text.NL();
					Text.Add("Growling, the morph pulls both of you off him, unwilling to be pushed over the edge before he has had his fill. <i>“On all fours, my little sluts,”</i> he grins, <i>“I'm gonna go doggystyle on you...”</i> Obediently, both of you line up next to each other, touching at the hip.", parse);
					Text.NL();

					var target;
					var targetType;
					if(player.FirstVag()) {
						target     = player.FirstVag();
						targetType = BodyPartType.vagina;
						parse.targetDesc = function() { return player.FirstVag().Short(); }
					}
					else {
						target     = player.Butt();
						targetType = BodyPartType.ass;
						parse.targetDesc = function() { return player.Butt().AnalShort(); }
					}

					Text.Add("<i>“Sorry, I'll get to you in a moment,”</i> the wolf grunts at you. With a rough shove, he has pushed himself to the hilt inside Rosalin, fucking her rapidly. With one hand, he reaches toward your [buttDesc], ", parse);
					var tail = player.HasTail();
					if(tail)
						Text.Add("guiding your [tailDesc] out of the way, ", {tailDesc : tail.Short()});
					Text.Add("and penetrates your [targetDesc] with one finger, preparing you. <i>“Don't worry, you'll get yours, but first I must service the kitty in heat.”</i> He seems pretty eager to have a go at you, roughly fingering you while he plows the moaning catgirl.", parse);
					Text.NL();
					Text.Add("Not even waiting to come himself, he pulls out of the alchemist as soon as she orgasms, allowing her to fall into a shuddering heap next to you. He grabs your [hipsDesc] with both hands, removing his finger from your [targetDesc], only to quickly replace it with the tapered tip of his large member. With a little coaxing on his part and a lot of moaning on yours, he forces the first few inches of his thick cock inside you.", parse);
					Text.NL();

					if(targetType == BodyPartType.ass) {
						Sex.Anal(cale, player);
						player.FuckAnal(target, cale.FirstCock(), 3);
						Scenes.Cale.Impregnate(player, PregnancyHandler.Slot.Butt, 2);
					}
					else {
						Sex.Vaginal(cale, player);
						player.FuckVag(target, cale.FirstCock(), 3);
						Scenes.Cale.Impregnate(player, PregnancyHandler.Slot.Vag, 2);
					}

					Text.Add("<i>“Ah... not bad,”</i> the wolf sighs, repeatedly pounding your [targetDesc], trying to build a rhythm. Being so close to the edge already pushes his instincts to the forefront, and soon you feel an even thicker mass press against your [targetDesc]. <i>“Gonna breed you, little slut,”</i> he hisses into your ear as his knot forces it's way inside your [targetDesc]", parse);
					if(targetType == BodyPartType.ass)
						Text.Add(", completely ignoring the physical impossibility of the statement.", parse);
					else
						Text.Add(".", parse);
					Text.NL();
					Text.Add("Not wanting to be left out, Rosalin crawls around in front of you, spreading her legs and presenting you with her loose cunt. Eagerly burying your [tongueDesc] in her folds, you feel your tastebuds being assaulted with a variety of flavors; the catgirl's sweet juices, blended with the salty taste of precum. Howling, the wolf-morph fills your [targetDesc] with his seed, his expanding knot effectively trapping the sticky substance inside.", parse);
					Text.NL();

					Text.Add("<i>“Mm, I'll definitely have to get more of this later,”</i> the canid sighs as he collapses on top of you, his weight pushing you to the ground. Rosalin whimpers as another orgasm hits her, drenching your [faceDesc]. When she is spent, she snuggles up against you, the worst of her heat apparently worn off.", parse);

					Text.NL();
					Text.Add("Exhausted, the three of you rest for a while, regaining your energy.", parse);
					Text.Flush();

					Gui.NextPrompt(function() {
						player.AddLustFraction(-1);
						RosalinScenes.FirstFuckFollowup(3);
					});
				}, enabled : true,
				tooltip : "Help Rosalin get the wolf ready, then allow him to have his way with both of you."
			});
			if(p1Cock) {
				options.push({ nameStr : "Fuck her",
					func : function() {
						player.subDom.IncreaseStat(100, 3);

						Text.Add("Rather than waiting for him to get ready, you pull out your [cocks], circling the prone catgirl and pulling at her tail insistently. Mouth clamped tight around several inches of canid cock, she nonetheless raises her butt, arching her back to ease your access as you grin at the glowering wolf. First come, first served. Still, with his dick buried inside the catgirl's throat, he can hardly complain.", parse);
						Text.NL();
						Text.Add("Quickly lining yourself up with Rosalin's [rvag], you push yourself inside her slick, hot furnace. Not virgin-tight, though. <i>“I'm afraid I'll have to disappoint you if you thought you got there first,”</i> the wolf grunts, grinning back at you. Apparently the catgirl has been around.", parse);
						Text.NL();

						Sex.Vaginal(player, rosalin);
						rosalin.FuckVag(rosalin.FirstVag(), p1Cock, 4);
						player.Fuck(p1Cock, 4);

						Text.Add("Well, no matter. Setting a rhythm, you begin to pound away at the moaning alchemist, gripping her butt tightly lest her legs give out. Spit-roasted, Rosalin soon reaches her first climax, her [rvag] contracting and convulsing around your [cock]. The pulsing member quickly deposits its load inside her.", parse);
						Text.NL();

						var cum = player.OrgasmCum();

						Text.Add("Pulling out, you allow the wolf to have a go at her. ", parse);

						if(cum > 3)
							Text.Add("He almost looks a bit intimidated, seeing your plentiful spunk leak out of Rosalin's [rvag]. <i>“Huh, you don't pull any punches, do you?”</i>", parse);
						else
							Text.Add("<i>“Got her nice and slick for me eh?”</i>", parse);
						Text.Add(" Without further ado, he hilts his throbbing cock inside the catgirl. Looking pretty close to his limit after his deepthroat treatment, he erratically ruts at her, trying to force his thick knot inside her.", parse);
						Text.NL();
						Text.Add("The whole display is getting you raunchy again, your [cock] rising to attention...", parse);
						Text.Flush();

						player.AddLustFraction(-1);
						player.AddLustFraction(0.4);

						//[Oral][Fuck him]
						var options = new Array();
						options.push({ nameStr : "Oral",
							func : function() {
								Text.Clear();
								Text.Add("Sauntering around to the panting alchemist's face, you present Rosalin with a replacement for the recently removed canid cock. She is quick to take up the challenge, enclosing your [cock] with her mouth, allowing her tongue to quickly lap at the [cockTipDesc], hoping to get a treat.", parse);
								Text.NL();
								Text.Add("Howling, the wolf-morph hunches over the alchemist, blasting her already sticky insides with even more seed. The whole gathering quickly deteriorates into a mess of cum and feminine fluids, as both you and Rosalin make your own contributions.", parse);

								Sex.Blowjob(rosalin, player);
								player.Fuck(p1Cock, 1);

								Text.NL();
								Text.Add("Exhausted, the three of you rest for a while, regaining your energy.", parse);
								Text.Flush();

								Gui.NextPrompt(function() {
									player.AddLustFraction(-1);
									RosalinScenes.FirstFuckFollowup(2);
								});
							}, enabled : true,
							tooltip : "Let Rosalin play with you while the morph finishes."
						});
						if(p2Cock) {
							options.push({ nameStr : "Fuck him",
								func : RosalinScenes.FirstFuckPegWolf, enabled : true,
								tooltip : "If you wait for him to knot inside her, there's not much the wolf can do to stop you..."
							});
						}
						Gui.SetButtonsFromList(options);
					}, enabled : true,
					tooltip : "Take the initiative and rail the catgirl."
				});
			}
			Gui.SetButtonsFromList(options);
		}, enabled : true,
		tooltip : "Ask the wolf if he is up for a threesome."
	});
	Gui.SetButtonsFromList(options);
}

RosalinScenes.FirstFuckPegWolf = function() {
	Text.Clear();

	cale.flags["Met"] = Cale.Met.SharedFuckedHim;

	player.subDom.IncreaseStat(100, 5);
	cale.flags["Sexed"]++;

	var parse = {
		armorDesc     : function() { return player.ArmorDesc(); },
		cocks : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		earsDesc      : function() { return player.EarDesc(); },
		breasts    : function() { return player.FirstBreastRow().Short(); },
		buttDesc      : function() { return player.Butt().Short(); },
		hipsDesc      : function() { return player.HipsDesc(); },
		tongueDesc    : function() { return player.TongueDesc(); },
		faceDesc      : function() { return player.FaceDesc(); },

		rvag      : function() { return rosalin.FirstVag().Short(); },
		wAnusDesc     : function() { return cale.Butt().AnalShort(); }
	};

	var cocks         = player.CocksThatFit(cale.Butt());
	var p1Cock        = player.BiggestCock(cocks);
	parse.cock    = function() { return p1Cock.Short(); };
	parse.cockTipDesc = function() { return p1Cock.TipShort(); }

	Text.Add("A naughty plan formulating in your head, you settle back and wait, stroking yourself as the morph mercilessly fucks Rosalin. You can hardly wait to have your fun...", parse);
	Text.NL();
	Text.Add("As his rutting grows shorter and faster, the wolf begins to pant heavily, close to the edge. With a wet squelch, he pushes his engorging canid knot inside her, howling as he spills his seed inside the delirious alchemist.", parse);
	Text.NL();
	Text.Add("The wolf's thrusts slow down, his movements impeded by the trapping knot. Frustrated, he tries to rut against Rosalin, dragging the moaning catgirl across the ground with each trust. If there ever was a perfect time to strike, now would be it, with the wolf completely at your mercy. You stroke his fur fondly, groping the immobilized wolf shamelessly.", parse);
	Text.NL();
	Text.Add("His annoyed growl changes to a slightly fearful whimper as you grab one of his buttcheeks, stroking yourself with your other hand. <i>“J-just what do you think yo-”</i> he begins uncertainly, his complaints deteriorating into an incoherent drawn-out moan as you bury your [cock] in his ass.", parse);
	Text.NL();

	Sex.Anal(player, cale);
	player.Fuck(p1Cock, 5);
	cale.FuckAnal(cale.Butt(), p1Cock);

	Text.Add("<i>“I... I'll get back at you for this!”</i> The wolf's moans make the claim far from convincing, as he is clearly enjoying the treatment you are giving his [wAnusDesc]. Rosalin groans as your thrusts transfer to her. Still locked within her, the wolf collapses on top of the catgirl.", parse);
	Text.NL();
	Text.Add("Being far from done with him, you rail him for all you are worth, indirectly fucking the catgirl alchemist. Pounding away at his deliciously tight rear, you soon have him a panting and moaning mess, almost as bad as the catgirl.", parse);
	Text.NL();
	Text.Add("Too add insult to injury, you tauntingly question who's the bitch now.", parse);
	Text.NL();
	Text.Add("<i>“I am your bitch, your beta, your slut! Fuck me!”</i> he groans. Or something close, you assume, if he could actually manage to form coherent sentences.", parse);
	Text.NL();
	Text.Add("Unfortunately, every party must end, and this one does so with you unleashing your cum inside the tight confines of the male wolf. Pulling out before you are done, your last strands land on his back, matting his fur.", parse);
	Text.NL();
	Text.Add("Exhausted, the three of you rest for a while, regaining your energy.", parse);
	Text.Flush();

	Gui.NextPrompt(function() {
		player.AddLustFraction(-1);
		RosalinScenes.FirstFuckFollowup(4);
	});
}

RosalinScenes.FirstFuckFollowup = function(outcome) {
	// Outcome: 0 = fucked her
	// Outcome: 1 = let wolf
	// Outcome: 2 = shared, oral
	// Outcome: 3 = shared, got fucked
	// Outcome: 4 = shared, fucked wolf

	Text.Clear();

	var parse = {

	};

	Text.Add("<b>Later...</b>", parse);
	Text.NL();
	if(outcome == 0)
		Text.Add("Finally satisfied, you let her dress as you bask in the afterglow, enjoying the sight of her sweat-stained form. <i>“Thanks, I really needed that,”</i> she blushes at you.", parse);
	else if(outcome == 1)
		Text.Add("Some time later, the two of them seem to be finished. Rosalin shakily puts on her dress, cum leaking down her inner thighs. <i>“Thanks buddy,”</i> the wolf pats you on the shoulder as he passes by, thoroughly satisfied.", parse);
	else {
		if(outcome == 2)
			Text.Add("<i>“Not bad.”</i> The wolf grins at you as he leaves, <i>“I could go for that again, if you are up for it.”</i>", parse);
		else if(outcome == 3)
			Text.Add("<i>“You did very well back there,”</i> the wolf tells you, grinning lasciviously. <i>“Next time you want someone to fuck you, don't be afraid to come to me. You don't have to wait for Rosalin.”</i> The comment has your cheeks heating up.", parse);
		else
			Text.Add("<i>“I... uh...”</i> The wolf looks at you uncertainly, <i>“... would you maybe mind doing that again with me, sometime?”</i> Seems a new buttslut has been born.", parse);
		Text.NL();
		Text.Add("Meanwhile, Rosalin puts on her dress, hardly bothering to clean the stains from her body. <i>“That was... amazing,”</i> she purrs, content.", parse);
	}
	Text.NL();
	Text.Add("Somewhat presentable, the catgirl gathers herself up before facing you again. <i>“S-sorry about that,”</i> she apologizes, <i>“I don't know what came over me there.”</i> Straightening out her tangled hair, she finds a string of cum on her cheek, and thoughtfully gathers up the mess, licking it up from her fingers.", parse);
	Text.NL();
	Text.Add("Noting a change in her eyes, you comment on the green orbs, the iris now a thin slit like that of a cat. <i>“Oh!”</i> Rosalin exclaims, excited, <i>“so it <b>did</b> have some effect!”</i> Doing a little happy dance, she pulls a small mirror from her bodice, inspecting the changes. <i>“Yes, I definitely like this! Cute, don't you think?”</i>", parse);
	Text.NL();
	Text.Add("You ask how she could even survive after drinking that mixture. <i>“Come now, what is a little risk against the progress of, like, science?”</i> Rosalin pouts a bit at you, <i>“It was perfectly safe... probably. Didn't I tell you? I'm a genius alchemist, stuff like this is par for the course.”</i>", parse);
	Text.NL();
	Text.Add("Uh-huh. Curious, you ask her where exactly she learned this skill.", parse);
	Text.NL();
	Text.Add("<i>“My own research of course!”</i> she puffs, <i>“well, I guess I had a teacher before, but screw her. Bitch.”</i> You manage to coax out of her that she studied under Jeanne, the court mage. Apparently she's a bit touchy about the subject, so you decide to drop it for now. Still, that might be a viable place to look next, if you are going to figure out how the gemstone works. Rosalin very likely won't be able to help you with that.", parse);
	Text.NL();
	Text.Add("<i>“Look, like, forget about her,”</i> the catgirl demands hotly, <i>“if you want to learn, I can be so much of a better teacher! I'll show you how to mix potions and stuff!”</i> Telling her that you are fine for now, you bid her farewell. Something to consider for later, perhaps.", parse);
	Text.Flush();

	Gui.NextPrompt();
}

RosalinScenes.CombineCallback = function(item) {
	Text.Clear();

	var racescore = new RaceScore(rosalin.body);
	var compScore = rosalin.origRaceScore.Compare(racescore);

	var parse = {
		raceDesc       : function() { return rosalin.raceDesc(compScore); },

		breasts     : function() { return player.FirstBreastRow().Short(); }
	};
	parse = player.ParserTags(parse);
	parse = rosalin.ParserTags(parse, "r");
	parse = rosalin.ParserPronouns(parse);

	player.AddAlchemy(item);

	if(item == Items.Felinix) {
		if(rosalin.flags["Felinix"] == 0) {
			Text.Add("<i>“Ah yes, these bring back fond memories,”</i> Rosalin says as [heshe] caresses the items you present. <i>“With these, I can recreate the very first potion I made, the one which turned me into a cat!”</i> [HeShe] quickly prepares the ingredients, making sure you understand how to do it yourself.", parse);
			Text.NL();
			Text.Add("<i>“This potion,”</i> Rosalin explains, <i>“is called Felinix. Those hairballs give it a pretty nasty texture, but you can hide it with some minor seasoning.”</i> Finished, the alchemist presents you with the draft.", parse);
			Text.NL();
			Text.Add("<i>“I've noticed something odd when taking these. It seems my body really adapted to it the first time I drank it, so it reverts to my catlike form, whatever I may have been from the start. I quite like that shape, but a nice change of pace is never wrong.”</i>", parse);
			rosalin.flags["Felinix"] = 1;
		}
		else {
			Text.Add("<i>“You'd like me to make another one of those?”</i> Rosalin asks you, <i>“I showed you to make them, so you should be able to do it yourself. ", parse);
			if(compScore > 0.95)
				Text.Add("Or maybe you just want to see what this potion... does to me?”</i> she asks, smiling lustfully.", parse);
			else
				Text.Add("Or maybe you'd like to transform me back to my original form?”</i> ", parse);
			Text.Add("While talking to you, the [raceDesc] alchemist prepares and mixes the ingredients, quickly completing the potion.", parse);
		}
		Text.NL();
		Text.Add("What will you do with the Felinix potion?", parse);
		Text.NL();
		if(compScore > 0.95)
			Text.Add("Giving it to Rosalin probably won't have much of an effect on [hisher] appearance, but might send [himher] into heat.", parse);
		else
			Text.Add("Giving it to Rosalin will probably revert [himher] to the way [heshe] was when you first met.", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				var r = ["equine cum", "harpy eggs", "mandrake", "nightshade", "spider eggs"];
				if(rosalin.FirstCock()) r.push("of my cum");
				if(rosalin.Lactation()) r.push("of my milk");
				parse["seasoning"] = r[Rand(r.length)];

				Items.Felinix.Use(player);

				Text.Add("<i>“Rather nice taste huh?”</i> Rosalin smiles at you, <i>“This time, I added some [seasoning], what do you think?”</i> Not quite trusting yourself to answer that, you prepare to leave.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Down the hatch!”</i> Rosalin gleefully exclaims, drinking the potion in one go.", parse);
				Text.NL();
				if(rosalin.FirstCock()) {
					Text.Add("<i>“It was fun while it lasted, I guess,”</i> [heshe] reminisces, watching [hisher] [rcock] shrink back into [hisher] body.", parse);
					Text.NL();
				}
				parse["randomlongershorter"] = Math.random() > 0.5 ? "longer" : "shorter";
				Text.Add("Various of the alchemist's bodyparts twitch and change, more violently than in a usual transformation, shifting back and forth between different shapes. Once the changes settle down, [heshe]'s mostly the same catgirl [heshe] was before, but you notice that [hisher] fur changed color a few shades, and has become a little [randomlongershorter].", parse);
				Text.NL();

				rosalin.ResetBody();

				Text.Add("<i>“Mm...”</i> The alchemist stretches sinuously, sweeping her tail back and forth. She fixes her feral feline eyes on you, breathing heavily. <i>“T-that hit the spot!”</i> she pants, reaching down between her legs, shamelessly fingering her sex. <i>“This one always gets me going, I need it bad!”</i> Rosalin mewls, looking at you pleadingly.", parse);
				Text.Flush();

				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Heat);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("Shaking your head, you decide to discard the results of the experiment. The vegetation around Rosalin's workbench takes on a slightly fuzzy look, and you swear you spot one of the flowers growing whiskers.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Leporine) {
		if(rosalin.flags["Leporine"] == 0) {
			Text.Add("<i>“Ah, you should know this one already,”</i> Rosalin nods, looking over the ingredients. <i>“With this, I can make Leporine. Brings out the bunny in you!”</i> [HeShe] hesitates slightly before beginning to mix the items. <i>“This time... I'll skip the salamander scales, I think.”</i>", parse);
			rosalin.flags["Leporine"] = 1;
		}
		else {
			Text.Add("<i>“Up for some more bunny transformation?”</i>", parse);
		}
		Text.NL();
		Text.Add("Rapidly mixing the ingredients together with practiced ease, Rosalin quickly presents you with a bottle of Leporine.", parse);
		Text.Flush();
		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();

				Items.Leporine.Use(player);

				Text.Add("<i>“Never was one for vegetable dishes,”</i> Rosalin notes, <i>“but the carrot juice does make it rather refreshing!”</i>", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Trying to get me to eat healthy food? Not gonna happen.”</i> Swallowing the refreshing drink quickly, the alchemist burps happily.", parse);
				Text.NL();

				var scenes = new EncounterTable();
				// EARS
				scenes.AddEnc(function() {
					Text.Add("A pair of floppy rabbit ears pop out of Rosalin's [rhair]. Cute!", parse);
					TF.SetRaceOne(rosalin.Ears(), Race.Rabbit);
					Text.NL();
				}, 1.0, function() { return rosalin.Ears().race != Race.Rabbit; });
				// TAIL
				scenes.AddEnc(function() {
					Text.Add("Rosalin shakes [hisher] butt at you, showing off [hisher] new fluffy bunny tail.", parse);
					TF.SetAppendage(rosalin.Back(), AppendageType.tail, Race.Rabbit, Color.brown);
					Text.NL();
				}, 1.0, function() { var tail = rosalin.HasTail(); return !tail || (tail.race != Race.Rabbit); });
				scenes.AddEnc(function() {
					parse["oneof"] = rosalin.NumCocks() > 1 ? "One of " : "";
					Text.Add("[oneof]Rosalin's [rcocks] shifts into a smooth rabbit-like cock.", parse);
					TF.SetRaceOne(rosalin.AllCocks(), Race.Rabbit);
					Text.NL();
				}, 1.0, function() {
					var unchanged = false;
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].race != Race.Rabbit) unchanged = true;
					return unchanged;
				});
				scenes.Get();

				var state = RosalinSexState.Regular;
				if(Math.random() < 0.4) {
					Text.Add("<i>“N-need to fuck!”</i> Rosalin gasps suddenly, clutching at [hisher] stomach.", parse);
					if(rosalin.FirstCock() && rosalin.FirstVag())
						state = Math.random() < 0.5 ? RosalinSexState.Heat : RosalinSexState.Rut;
					else if(rosalin.FirstCock())
						state = RosalinSexState.Rut;
					else
						state = RosalinSexState.Heat;
				}
				else {
					Text.Add("<i>“Not too bad I guess!”</i>", parse);
				}
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(state);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("Shaking your head, you decide to discard the results of the experiment. The plants around Rosalin's workbench suddenly look a little fluffier.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	// E+
	else if(item == Items.Equinium && rosalin.flags["Equinium"] == 1 && Math.random() < 0.2) {
		if(rosalin.flags["Equinium+"] == 0) {
			Text.Add("Rather than mixing the ingredients in the usual way, Rosalin grumbles a bit, sucking on [hisher] thumb, absently pouring some equine cum on top of the metal filings. <i>“You know what this needs?”</i> [heshe] asks thoughtfully, <i>“a bit more punch!”</i>", parse);
			Text.NL();
			Text.Add("Before you have opportunity to protest, [heshe] begins to pull bottle after bottle from [hisher] stash, adding some to the mixture and discarding others. The process is too rapid for you to follow, not that you are sure there actually <i>is</i> a recipe to this.", parse);
			rosalin.flags["Equinium+"] = 1;
		}
		else {
			Text.Add("<i>“Hrm, what about if I try to add this...?”</i> Off into one of [hisher] experimental moods, Rosalin pours the contents of about a dozen unmarked bottles into a pot, absentmindedly adding the ingredients you gave [himher]. You take a step back, allowing the mad alchemist room to work [hisher] misguided craft.", parse);
		}
		Text.NL();
		Text.Add("[HeShe] finishes the mixture by pouring a generous serving of equine cum on top, and stirring it until the liquid has a uniform color.", parse);
		Text.NL();
		Text.Add("<i>“And there we have it!”</i> Rosalin proudly presents you with a thick white fluid, almost like cream, smelling heavily of male musk. You aren't so sure about this one...", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();

				var checkCocks = function() {
					var hasHcock = false;
					var cocks = player.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].race == Race.Horse) hasHcock = true;
					return hasHcock;
				};

				var c1 = checkCocks();

				Items.EquiniumPlus.Use(player);

				var c2 = checkCocks();

				if(c2 && !c1)
					Text.Add("<i>“W-wow! It's so big! And in one go like that!”</i> Rosalin studies your new appendage with piqued interest, absently rubbing [hisher] hands over [hisher] body. <i>“I... I need to test this! For science!”</i>", parse);
				else
					Text.Add("<i>“T-that smell!”</i> Rosalin moans. <i>“It's so... raw!”</i> The [raceDesc] shuffles closer to you, a hungry look in [hisher] eyes.", parse);

				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();

				if(rosalin.flags["TakenEquinium+"] == 0) {
					Text.Add("<i>“Oh, can I, can I?”</i> Rosalin excitedly grabs the bottle from you, sighing as [heshe] inhales the heady aroma rising from the concoction. <i>“This smells like it'll put hair on my chest,”</i> the alchemist comments. Shrugging, [heshe] swigs the bottle, quickly swallowing its contents. A satisfied grin spreads across [hisher] face.", parse);
					Text.NL();
					Text.Add("<i>“Thick and creamy... mmm, I could get addicted to this taste.”</i> Rosalin gets a slightly concerned look, as something stirs in [hisher] groin. <i>“That's od- AAAH!”</i> Almost shredding the flimsy cloth obstructing its path, a ten-inch horse cock, complete with a broad, flared tip and a set of large, heavy balls sprouts from the surprised alchemist's crotch.", parse);
					Text.NL();
					Text.Add("Both of you look at the huge throbbing erection in awe. Rosalin looks at [hisher] cock. Then at you. Then at the cock. Then at you.", parse);

					var cock = new Cock(Race.Horse, Color.pink);
					cock.length.base    = 25;
					cock.thickness.base = 7;
					rosalin.AllCocks().push(cock);
					rosalin.flags["TakenEquinium+"] = 1;
				}
				else if(rosalin.FirstCock()) {
					Text.Add("<i>“Another one of those can't hurt... I mean, what's it going to do, give me another cock?”</i> You are not sure if [heshe] is joking or not, but [heshe] heartily chugs down the thick mixture.", parse);

					parse["s"]      = rosalin.NumCocks() > 1 ? "s" : "";
					parse["notS"]   = rosalin.NumCocks() > 1 ? "" : "s";
					parse["itThey"] = rosalin.NumCocks() > 1 ? "they" : "it";
					parse["allof"]  = rosalin.NumCocks() > 1 ? "all of " : "";

					var cocks   = rosalin.AllCocks();
					var changed = TF.SetRaceAll(cocks, Race.Horse);
					if(changed == TF.Effect.Changed) {
						parse["quantity"] = rosalin.NumCocks() > 1 ? Text.Quantify(rosalin.NumCocks()) + " of " : "";
						Text.NL();
						Text.Add("Not long after [heshe] has finished the potion, [allof]the alchemist's [rcocks] jerk[notS] to attention, hard as rock. Changing in coloration and size, [itThey] quickly transform[notS] into a [quantity]horsecock[s], complete with sheath[s] and flared tip[s].", parse);
					}

					var size = false;
					for(var i = 0; i < cocks.length; i++) {
						// Base size
						var inc = cocks[i].length.IncreaseStat(25, 100);
						var inc2 = cocks[i].thickness.IncreaseStat(7, 100);
						if(inc == null)
							inc = cocks[i].length.IncreaseStat(50, 5);
						if(inc2 == null)
							inc2 = cocks[i].thickness.IncreaseStat(12, 1);
						if(inc || inc2) size = true;
					}
					if(size) {
						Text.NL();
						Text.Add("Rosalin's [rcocks] shudder[notS], the stiff dick[s] growing significantly longer and thicker.", parse);
					}

					if(rosalin.FirstVag() && Math.random() < 0.2) {
						parse["tail"] = rosalin.HasTail() ? Text.Parse(" and lifting [hisher][rtail]", parse) : "";
						Text.NL();
						Text.Add("<i>“H-ah,”</i> the alchemist pants, [hisher] knees quivering. <i>“Would you look at that!”</i> Spinning around[tail], the former herm presents you with [hisher] crotch. Underneath [hisher] heavy balls, the skin where [heshe] previously had a vagina is smooth and unbroken.", parse);
						Text.NL();
						if(rosalin.flags["PrefGender"] == Gender.female) {
							Text.Add("Awkwardly, you ask the alchemist if she... is a he now?", parse);
							Text.NL();
							Text.Add("<i>“Just think of me as a girl with special endowments,”</i> Rosalin replies absentmindedly, <i>“I doubt this is permanent - things would get complicated if we try to keep track.”</i>", parse);
							rosalin.body.vagina = [];
						}
					}
					Text.NL();
					Text.Add("<i>“Now then, I'm feeling up for a test run,”</i> Rosalin grins, brandishing [hisher] [rcocks].", parse);
				}
				else {
					Text.Add("<i>“Hmm, so you'd like me to drink this? Even knowing what it will do to me?”</i> Rosalin grins at you smugly. <i>“Couldn't stand to be without my dick for long, huh?”</i> Not waiting to hear your response, [heshe] quickly chugs down the potion.", parse);
					Text.NL();
					Text.Add("Moaning as the effects start to set in, the alchemist gasps as a ten-inch horsecock sprouts from [hisher] groin, complete with a set of heavy, loaded balls. The large member is stiff and throbbing, ready for action.", parse);

					var cock = new Cock(Race.Horse, Color.pink);
					cock.length.base    = 25;
					cock.thickness.base = 7;
					rosalin.AllCocks().push(cock);
				}

				// Restore balls
				rosalin.Balls().count.IncreaseStat(2, 2);
				rosalin.Balls().size.IncreaseStat(7, 7);
				rosalin.Balls().cumProduction.IncreaseStat(6, 1);

				Text.NL();
				parse["s"] = rosalin.NumCocks() > 1 ? "s" : "";
				Text.Add("<i>“I need to fuck something, <b>right now</b>,”</i> the alchemist pants, [hisher] thick equine member[s] swaying as [heshe] eyes you hungrily.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Rut);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("Shaking your head, you decide to discard the results of the experiment. Perhaps that was for the best too, you decide, as the plant you pour it over suddenly springs to life, a dozen thick tentacles sprouting from it.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	// EQUINIUM
	else if(item == Items.Equinium) {
		if(rosalin.flags["Equinium"] == 0) {
			Text.Add("<i>“Some horse hair, a horse shoe... and some delicious equine... fluids.”</i> Rosalin licks [hisher] lips hungrily. <i>“With these, I can make Equinium.”</i> [HeShe] starts mixing the ingredients, showing you how each has to be prepared. Now and again, [heshe] sticks [hisher] hand in the jar containing the equine fluids, apparently taking them as a snack.", parse);
			Text.NL();
			Text.Add("<i>“Don't worry,”</i> [heshe] assures you when almost half of what you gave [himher] is consumed, <i>“I always keep a few extra of these around. Lovely stuff.”</i>", parse);
			rosalin.flags["Equinium"] = 1;
		}
		else {
			Text.Add("<i>“Oh, these again?”</i> the [raceDesc] alchemist rubs [hisher] hands together excitedly. <i>“Equinium is always a classic. The filings from the horseshoes give it a slight metallic taste, but it is quite easy to drown with the other ingredients.”</i> Humming to [himher]self, Rosalin starts brewing the potion.", parse);
		}
		Text.NL();
		Text.Add("Finishing up, Rosalin presents you with a thick, heady potion. <i>“One Equinium, ready to go!”</i>", parse);
		Text.Flush();
		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();

				Items.Equinium.Use(player);

				Text.Add("<i>“Good one, isn't it?”</i> Rosalin smiles, <i>“I added some extra toppings, just for you!”</i>", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("<i>“For me? How nice of you!”</i> Greedily clutching the bottle, Rosalin drinks the thick liquid.", parse);
				Text.NL();

				var scenes = new EncounterTable();
				// EARS
				scenes.AddEnc(function() {
					Text.Add("A pair of equine ears pop out of Rosalin's [rhair], perking up to attention. Cute!", parse);
					TF.SetRaceOne(rosalin.Ears(), Race.Horse);
					Text.NL();
				}, 1.0, function() { return rosalin.Ears().race != Race.Horse; });
				// TAIL
				scenes.AddEnc(function() {
					Text.Add("Rosalin shakes [hisher] butt at you, showing off [hisher] new horselike tail.", parse);
					TF.SetAppendage(rosalin.Back(), AppendageType.tail, Race.Horse, Color.brown);
					Text.NL();
				}, 1.0, function() { var tail = rosalin.HasTail(); return !tail || (tail.race != Race.Horse); });
				scenes.AddEnc(function() {
					parse["oneof"] = rosalin.NumCocks() > 1 ? "one of " : "";
					Text.Add("Rosalin groans slightly as [oneof][hisher] [rcocks] shifts into a more equine form, complete with a flat, flared head.", parse);
					TF.SetRaceOne(rosalin.AllCocks(), Race.Horse);
					Text.NL();
				}, 1.0, function() {
					var unchanged = false;
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].race != Race.Horse) unchanged = true;
					return unchanged;
				});
				scenes.AddEnc(function() {
					Text.Add("<i>“Ooh, that's cute!”</i> Rosalin admires [hisher] new hooves. [HeShe] experiments a bit, making clopping noises with them against the hard earth.", parse);
					TF.SetRaceOne(rosalin.Legs(), Race.Horse);
					if(rosalin.LowerBodyType() == LowerBodyType.Single) rosalin.Legs().count = 2;
					Text.NL();
				}, 1.0, function() { return rosalin.Legs().race != Race.Horse; });
				scenes.Get();

				var state = RosalinSexState.Regular;
				if(rosalin.FirstCock()) {
					parse["these"] = rosalin.NumCocks() > 1 ? "These aren't" : "This isn't";
					Text.Add("<i>“Ah, just the right stuff!”</i> The arousing effects are immediate, Rosalin's [rcocks] peeking out from beneath [hisher] clothes. <i>“[these] going to go down before I get a good fuck. You up for it?”</i> The [raceDesc] begins stroking [himher]self, awaiting your response.", parse);
					state = RosalinSexState.Rut;
				}
				else {
					Text.Add("<i>“Not bad! Can't get enough of that taste,”</i> [heshe] sighs happily.", parse);
				}
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(state);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("Shaking your head, you decide to discard the results of the experiment. Rosalin looks slightly disappointed as you pour the contents of the bottle on the ground. As you prepare to leave, you could swear you hear a quiet neigh from behind the workbench.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Lacertium) {
		if(rosalin.flags["Lacertium"] == 0) {
			Text.Add("<i>“Hoh, let's see what we have here,”</i> Rosalin sniffs the oil and eggs, wrinkling [hisher] nose. <i>“This one is going to smell a little, I'm afraid. Scalies are weird!”</i> Even so, [heshe] dutifully brews the ingredients, making sure to show you how each must be prepared and handled. <i>“Make sure the eggs haven't gone bad, it ruins the whole thing,”</i> [heshe] adds.", parse);
			Text.NL();
			Text.Add("<i>“There we go, Lacertium!”</i> When you look uncertainly at [himher], [heshe] adds, <i>“Lacertidae means ‘lizard', just so you know.”</i>", parse);
			rosalin.flags["Lacertium"] = 1;
		}
		else {
			Text.Add("<i>“One scaly-n-oily, coming up!”</i>", parse);
		}
		Text.NL();
		Text.Add("Before long, the alchemist presents you with a bottle containing a strange liquid, thick, oily and constantly shifting in color. <i>“Wonder what effect this one'll have,”</i> [heshe] muses, handing the Lacertium to you.", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				var c1 = player.NumCocks();
				Items.Lacertium.Use(player);
				if(c1 == 1 && player.NumCocks() == 2) {
					Text.Add("<i>“Mmm, that looks juicy!”</i> Rosalin eagerly licks [hisher] lips at your new twin members. <i>“I can hardly wait to give those a test run!”</i>", parse);
					Text.Flush();
					Gui.NextPrompt(function() {
						RosalinScenes.SexPrompt(RosalinSexState.Regular);
					});
				}
				else {
					Text.Add("<i>“It might leave a bit of an aftertaste,”</i> Rosalin looks thoughtful. <i>“Nothing I've tried so far works to hide it I'm afraid.”</i>", parse);
					Text.Flush();
					Gui.NextPrompt(function() {
						Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
					});
				}
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Hmm... well, what could go wrong?”</i> The alchemist shrugs, downing the oily draft.", parse);
				Text.NL();

				var scenes = new EncounterTable();
				// TAIL
				scenes.AddEnc(function() {
					Text.Add("<i>“Long, thick, scaly, aaand...”</i> Curling [hisher] new reptile tail experimentally, Rosalin confirms [hisher] guess, <i>“... prehensile. Hehe, I'm going to have a lot of fun with this.”</i>", parse);
					TF.SetAppendage(rosalin.Back(), AppendageType.tail, Race.Lizard, Color.green);
					Text.NL();
				}, 1.0, function() { var tail = rosalin.HasTail(); return !tail || (tail.race != Race.Lizard); });
				scenes.AddEnc(function() {
					Text.Add("<i>“Hmm, I rather like it,”</i> Rosalin comments on [hisher] new reptilian cock, ridged on the underside and ending in a tapered tip.", parse);
					TF.SetRaceOne(rosalin.AllCocks(), Race.Lizard);
					Text.NL();
				}, 1.0, function() {
					var unchanged = false;
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].race != Race.Lizard) unchanged = true;
					return unchanged;
				});
				scenes.AddEnc(function() {
					Text.Add("<i>“I... I have heard about this,”</i> Rosalin gasps as [hisher] [rcock] suddenly splits, two identical members forming. <i>“D-double the fun for you!”</i>", parse);
					rosalin.AllCocks().push(rosalin.FirstCock().Clone());
					Text.NL();
				}, 1.0, function() { return rosalin.NumCocks() == 1; });
				scenes.Get();

				Text.Add("<i>“Not bad, I guess, I just wish I could figure out a way to fix that oily texture...”</i> Grumbling, the alchemist broods, deep in thought.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("Shaking your head, you decide to discard the results of the experiment. The vegetation around Rosalin's workbench takes on a bright, almost metallic sheen. Some of the plants split into two identical ones, for no particular reason.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Bovia) {
		if(rosalin.flags["Bovia"] == 0) {
			Text.Add("<i>“Ah, this looks promising!”</i> Rosalin bustles around, sorting through [hisher] tools. <i>“If I can just find... here!”</i> [HeShe] proudly brandishes a whisk, procured from somewhere under the mountain of garbage on [hisher] workbench. The alchemist whistles as [heshe] prepares the milk, working up a foamy layer on top of the liquid.", parse);
			Text.NL();
			Text.Add("Pouring all the ingredients into a beaker, [heshe] puts a stopper on top of it. <i>“Gotta let it sit for a while. Gestation and all,”</i> Rosalin explains.", parse);
			rosalin.flags["Bovia"] = 1;
		}
		else {
			parse["former"] = compScore < 0.95 ? "former " : "";
			Text.Add("<i>“It's so much better than regular milk, and that's coming from a [former]catgirl!”</i>", parse);
		}
		Text.NL();
		Text.Add("Rosalin sniffs at the liquid suspiciously. <i>“Don't want to go for it if it's turned bad. Like cream, you know?”</i> Apparently satisfied with the inspection, [heshe] presents the bottled liquid to you. The alchemist even scrawled a cute picture of a cow on the sticker, while [heshe] was at it.", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				Items.Bovia.Use(player);
				if(player.Lactation()) {
					Text.Add("<i>“Would be a shame to let all that milk go to waste, wouldn't it?”</i> Rosalin eyes your dripping [breasts] hungrily.", parse);
					Text.Flush();
					Gui.NextPrompt(function() {
						RosalinScenes.SexPrompt(RosalinSexState.Regular);
					});
				}
				else {
					Text.Add("<i>“Quite refreshing, isn't it? I wonder if you could make it even more potent somehow...”</i> Rosalin muses.", parse);
					Text.Flush();
					Gui.NextPrompt(function() {
						Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
					});
				}
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("[HeShe] chugs the thick liquid down. <i>“Refreshing!”</i> [heshe] licks [hisher] lips clean.", parse);
				Text.NL();

				var scenes = new EncounterTable();
				// TAIL
				scenes.AddEnc(function() {
					Text.Add("<i>“Moo?”</i> Rosalin says, experimentally swishing [hisher] new bovine tail behind [himher].", parse);
					TF.SetAppendage(rosalin.Back(), AppendageType.tail, Race.Cow, Color.black);
					Text.NL();
				}, 1.0, function() { var tail = rosalin.HasTail(); return !tail || (tail.race != Race.Cow); });
				scenes.AddEnc(function() {
					Text.Add("<i>“Careful I don't accidentally gore you with these!”</i> Rosalin gingerly pokes at [hisher] new budding horns, feeling their sharpness.", parse);
					TF.SetAppendage(rosalin.Appendages(), AppendageType.horn, Race.Cow, Color.black, 2);
					Text.NL();
				}, 1.0, function() { var horns = rosalin.HasHorns(); return !horns || (horns.race != Race.Cow); });
				scenes.AddEnc(function() {
					Text.Add("A pair of bovine ears pop out of Rosalin's [rhair]! <i>“Moo.”</i>", parse);
					TF.SetRaceOne(rosalin.Ears(), Race.Cow);
					Text.NL();
				}, 1.0, function() { return rosalin.Ears().race != Race.Cow; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Won't these get in the way?”</i> Rosalin ponders, feeling [hisher] expanding [rbreasts].", parse);
					rosalin.FirstBreastRow().size.IncreaseStat(40, 10);
					Text.NL();
				}, 1.0, function() { return rosalin.FirstBreastRow().size.Get() < 40; });
				scenes.AddEnc(function() {
					Text.Add("Rosalin's [rnips] starts dripping milk. [HeShe] experimentally gives the liquid a taste. <i>“So yummy!”</i> [heshe] exclaims excitedly, <i>“I wonder if I can use this in cooking?”</i>", parse);
					rosalin.lactHandler.lactationRate.IncreaseStat(10, 1);
					Text.NL();
				}, 1.0, function() { return true; });

				scenes.Get();

				Text.Add("<i>“Not sure if this one is really healthy. I feel kinda... dumb.”</i> The alchemist shakes [hisher] head a bit. <i>“Ah! False alarm. Same as usual.”</i>", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("Shaking your head, you decide to discard the results of the experiment. Doused with the concoction, the nearby vegetation starts to seep a strange white liquid.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Nagazm) {
		if(rosalin.flags["Nagazm"] == 0) {
			Text.Add("<i>“A bit oily...”</i> Rosalin frowns as [heshe] prods the slimy liquid you present [himher] with. Shrugging, the alchemist grinds the other ingredients and mixes them together. As [heshe] does, the mixture slowly turns into a bubbly pink goop, exuding a putrid smell.", parse);
			Text.NL();
			Text.Add("<i>“Never could stomach snakes,”</i> [heshe] notes conversationally. <i>“I’ve heard some put them in strong alcohol. Perhaps it kills the taste.”</i> The alchemist looks excited. <i>“Aren’t you wondering what it’ll do?”</i>", parse);
			rosalin.flags["Nagazm"] = 1;
		}
		else {
			Text.Add("<i>“Another disgusting, snakey pink goop, coming up!”</i>", parse);
		}
		Text.NL();
		Text.Add("Rosalin hands you the stoppered bottle, looking expectantly at you.", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				Text.Add("Steeling yourself, you take a large swig of the pink goop.", parse);
				Text.NL();
				var body = player.LowerBodyType();
				Items.Nagazm.Use(player);
				Text.NL();
				if(body != player.LowerBodyType()) {
					Text.Add("<i>“Wow!”</i> Rosalin exclaims. <i>“That’s so cool!”</i> [HeShe] gingerly touches your new tail, caressing the scales thoughtfully.", parse);
					Text.NL();
					Text.Add("<i>“You know...”</i> [heshe] ponders, <i>“this looks like it could be fun to play with...”</i>", parse);
					Text.Flush();
					Gui.NextPrompt(function() {
						RosalinScenes.SexPrompt(RosalinSexState.Regular);
					});
				}
				else {
					Text.Add("<i>“Disgusting, isn’t it?”</i> Rosalin shudders. You burp loudly, your throat burning.", parse);
					Text.Flush();
					Gui.NextPrompt(function() {
						Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
					});
				}
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("<i>“I… I’m actually going to pass on this one. Can’t handle the taste of snake.”</i> You look incredulously at the alchemist. Apparently even [heshe] has [hisher] limits.", parse);
				Text.Flush();
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("This… doesn’t look healthy. You decide to discard the concoction, pouring it out on the ground. The nearby vegetation wriggles unsettlingly.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Canis) {
		if(rosalin.flags["Canis"] == 0) {
			Text.Add("<i>“This root could probably be used to make several different kind of potions,”</i> Rosalin muses as [heshe] studies the knotted veggie. Shrugging, [heshe] chops it up into a fine mince, mixing it with powdered bone and… biscuit. Humming to [himher]self, the alchemist adds several other ingredients at random. There is a puff of smoke as [heshe] pours some kind of liquid over the mixture.", parse);
			rosalin.flags["Canis"] = 1;
		}
		else {
			Text.Add("<i>“One doggy treat, coming up!”</i> Rosalin chirps, mixing ingredients happily.", parse);
		}
		Text.NL();
		Text.Add("<i>“All done!”</i> The alchemist presents you with an opaque, reddish liquid, smelling of wet dog.", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				Text.NL();
				Items.Canis.Use(player);
				parse["boyGirl"] = player.mfTrue("boy", "girl");
				Text.Add("<i>“Who’s a good [boyGirl], yeees!”</i> Rosalin cheers, patting you.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("The alchemist grimaces as [heshe] gulps down the reddish liquid. Apparently the taste doesn’t quite agree with [himher]. [HisHer] body has other plans though.", parse);
				Text.NL();


				var scenes = new EncounterTable();
				// TAIL
				scenes.AddEnc(function() {
					Text.Add("<i>“Hehe, it’s so fluffy!”</i> Rosalin prances around, wagging [hisher] new dog-tail happily.", parse);
					TF.SetAppendage(rosalin.Back(), AppendageType.tail, Race.Dog, Color.gray);
					Text.NL();
				}, 1.0, function() { var tail = rosalin.HasTail(); return !tail || (tail.race != Race.Dog); });
				scenes.AddEnc(function() {
					Text.Add("<i>“Woah, I can hear so clearly with these!”</i> Rosalin exclaims, touching [hisher] new canine ears.", parse);
					TF.SetRaceOne(rosalin.Ears(), Race.Dog);
					Text.NL();
				}, 1.0, function() { return rosalin.Ears().race != Race.Dog; });
				scenes.AddEnc(function() {
					parse["oneof"] = rosalin.NumCocks() > 1 ? "one of " : "";
					Text.Add("<i>“Ahn!”</i> Rosalin exclaims, moaning loudly as [hisher] hands go to [hisher] crotch. Pulling [hisher] dress up, [heshe] reveals that [oneof][hisher] [rcocks] has turned into a pointed canine cock, complete with a knot.", parse);
					var ret = {};
					TF.SetRaceOne(rosalin.AllCocks(), Race.Dog, ret);
					if(ret.bodypart) ret.bodypart.knot = 1;
					Text.NL();
				}, 1.0, function() {
					var unchanged = false;
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].race != Race.Dog) unchanged = true;
					return unchanged;
				});
				scenes.AddEnc(function() {
					Text.Add("<i>“Mm, this will be fun to play with!”</i> Rosalin moans softly as [heshe] hoists up [hisher] dress, marvelling at [hisher] thick knot.", parse);
					Text.NL();
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++) {
						if(cocks[i].knot != 1) {
							cocks[i].knot = 1;
							break;
						}
					}
				}, 1.0, function() {
					var noknot = false;
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].knot != 1) noknot = true;
					return noknot;
				});

				scenes.Get();

				Text.Add("Looks like that last one definitely got [hisher] engine going, as [heshe]’s eyeing you lustily, panting heavily.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("You don’t quite like the smell of this… let’s just pour it out. A small puff of smoke rises from the puddle of reddish liquid as it spreads over the ground. The plants around you look decidedly furrier than before. Some of them bark at you.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Lobos) {
		if(rosalin.flags["Lobos"] == 0) {
			Text.Add("<i>“Did you get this from Wolfie?”</i> Rosalin asks guardedly as [heshe] eyes the wolf pelt you present [himher] with. <i>“If you did, I’ll have to make a potion to make it grow out again.”</i>", parse);
			Text.NL();
			parse["Cale"] = cale.flags["Met2"] >= Cale.Met2.Talked ? "Cale" : "the wolf";
			Text.Add("You hurriedly assure [himher] that you wouldn’t hurt [Cale]; you got this from somewhere else. The alchemist nods to [himher]self, the question already forgotten as [heshe] starts mixing ingredients together.", parse);
			rosalin.flags["Lobos"] = 1;
		}
		else {
			Text.Add("<i>“Want another one of those huh?”</i> The alchemist hums a tune to [himher]self as [heshe] starts mixing the ingredients together.", parse);
		}
		Text.NL();
		Text.Add("<i>“Looks a bit… dull, don’t you think?”</i> Rosalin muses as [heshe] pours the concoction into a bottle, studying the gray liquid. That stuff looks like liquid mercury, it’s probably not safe to drink.", parse);
		Text.NL();
		Text.Add("<i>“Well, what do you want to do with it?”</i>", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				Items.Lobos.Use(player);
				Text.Add("<i>“Hmm,”</i> Rosalin mutters, jotting down a few observations in [hisher] notebook. <i>“Tell me, do you feel more inclined to… howl?”</i>", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Okay!”</i> the alchemist chippers, gulping down the gray liquid without hesitation.", parse);
				Text.NL();


				var scenes = new EncounterTable();
				// TAIL
				scenes.AddEnc(function() {
					Text.Add("<i>“Hehe, it’s so fluffy!”</i> Rosalin prances around, wagging [hisher] new wolf-tail happily. <i>“Makes me look dangerous!”</i>", parse);
					TF.SetAppendage(rosalin.Back(), AppendageType.tail, Race.Wolf, Color.gray);
					Text.NL();
				}, 1.0, function() { var tail = rosalin.HasTail(); return !tail || (tail.race != Race.Wolf); });
				scenes.AddEnc(function() {
					Text.Add("<i>“Woah, I can hear so clearly with these!”</i> Rosalin exclaims, touching [hisher] new canine ears.", parse);
					TF.SetRaceOne(rosalin.Ears(), Race.Wolf);
					Text.NL();
				}, 1.0, function() { return rosalin.Ears().race != Race.Wolf; });
				scenes.AddEnc(function() {
					parse["oneof"] = rosalin.NumCocks() > 1 ? "one of " : "";
					Text.Add("<i>“Ahn!”</i> Rosalin exclaims, moaning loudly as [hisher] hands go to [hisher] crotch. Pulling [hisher] dress up, [heshe] reveals that [oneof][hisher] [rcocks] has turned into a pointed canine cock, complete with a knot.", parse);
					var ret = {};
					TF.SetRaceOne(rosalin.AllCocks(), Race.Wolf, ret);
					if(ret.bodypart) ret.bodypart.knot = 1;
					Text.NL();
				}, 1.0, function() {
					var unchanged = false;
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].race != Race.Wolf) unchanged = true;
					return unchanged;
				});
				scenes.AddEnc(function() {
					Text.Add("<i>“Mm, this will be fun to play with!”</i> Rosalin moans softly as [heshe] hoists up [hisher] dress, marvelling at [hisher] thick knot.", parse);
					Text.NL();
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++) {
						if(cocks[i].knot != 1) {
							cocks[i].knot = 1;
							break;
						}
					}
				}, 1.0, function() {
					var noknot = false;
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].knot != 1) noknot = true;
					return noknot;
				});

				scenes.Get();

				Text.Add("<i>“Tastes like the moon!”</i> [heshe] exclaims happily. Whatever that means.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("The surrounding vegetation doesn’t seem to have any problem absorbing the solution. Some of the flowers take on a gray tint, but remain perky. Feral, in fact. You can swear that one dandelion is looking hungry.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Vulpinix) {
		if(rosalin.flags["Vulpinix"] == 0) {
			Text.Add("<i>“Hmm, a bunch of berries and plants huh? Wonder what I can do with this...”</i> Rosalin muses, absently reaching for some additional herbs from [hisher] collection. <i>“Perhaps a vegetable stew?”</i>", parse);
			Text.NL();
			parse["rearsDesc"] = rosalin.EarDesc(true);
			Text.Add("As the ingredients start to bubble in [hisher] pot the concoction takes on a reddish hue. The alchemist sniffs the brew suspiciously, adding a few more herbs at random. [HisHer] [rearsDesc] twitch erratically as [heshe] tastes [hisher] creation.", parse);
			rosalin.flags["Vulpinix"] = 1;
		}
		else {
			Text.Add("<i>“Ah, these again! I think I’ll try a few other herbs this time, perhaps spice up the taste a bit.”</i> The alchemist hums to [himher]self as [heshe] starts chopping up vegetables, pouring them into a boiling pot.", parse);
		}
		Text.NL();
		Text.Add("<i>“This looks promising!”</i> Rosalin exclaims, holding up the resulting bottle of opaque, red liquid.", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				Items.Vulpinix.Use(player);
				Text.Add("<i>“Well, what do you think?”</i> Rosalin asks expectantly. <i>“Perhaps I should try being a chef again? Maybe open a restaurant.”</i>", parse);
				Text.NL();
				Text.Add("...That’d certainly be an interesting - possibly lethal - venture.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Here goes!”</i> the alchemist fearlessly downs the red concoction, beads of sweat forming on [hisher] body due to the powerful alchemical solution.", parse);
				Text.NL();

				var scenes = new EncounterTable();
				// TAIL
				scenes.AddEnc(function() {
					Text.Add("<i>“Hehe, it’s so pretty, and fluffy too!”</i> Rosalin prances around, wagging [hisher] bushy fox-tail happily.", parse);
					TF.SetAppendage(rosalin.Back(), AppendageType.tail, Race.Fox, Color.gray);
					Text.NL();
				}, 1.0, function() { var tail = rosalin.HasTail(); return !tail || (tail.race != Race.Fox); });
				scenes.AddEnc(function() {
					Text.Add("<i>“Woah, I can hear so clearly with these!”</i> Rosalin exclaims, touching [hisher] new foxy ears.", parse);
					TF.SetRaceOne(rosalin.Ears(), Race.Fox);
					Text.NL();
				}, 1.0, function() { return rosalin.Ears().race != Race.Fox; });
				scenes.AddEnc(function() {
					parse["oneof"] = rosalin.NumCocks() > 1 ? "one of " : "";
					Text.Add("<i>“Ahn!”</i> Rosalin exclaims, moaning loudly as [hisher] hands go to [hisher] crotch. Pulling [hisher] dress up, [heshe] reveals that [oneof][hisher] [rcocks] has turned into a pointed canine cock, complete with a knot.", parse);
					var ret = {};
					TF.SetRaceOne(rosalin.AllCocks(), Race.Fox, ret);
					if(ret.bodypart) ret.bodypart.knot = 1;
					Text.NL();
				}, 1.0, function() {
					var unchanged = false;
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].race != Race.Fox) unchanged = true;
					return unchanged;
				});
				scenes.AddEnc(function() {
					Text.Add("<i>“Mm, this will be fun to play with!”</i> Rosalin moans softly as [heshe] hoists up [hisher] dress, marvelling at [hisher] thick knot.", parse);
					Text.NL();
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++) {
						if(cocks[i].knot != 1) {
							cocks[i].knot = 1;
							break;
						}
					}
				}, 1.0, function() {
					var noknot = false;
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].knot != 1) noknot = true;
					return noknot;
				});

				scenes.Get();

				Text.Add("<i>“Mm… not bad,”</i> [heshe] sighs luxuriously. <i>“Not enough to make me a vegetarian, but… unf. Wow. Those spices sure pack a punch. Isn’t it hot out here?”</i> [HeShe] eyes you expectantly.", parse);
				Text.Flush();

				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("On second thought, probably best to pass on this one. That much veggies can’t be healthy. The vegetation around the alchemist’s workbench perks up as you pour out the red liquid, some of them suddenly sprouting fat red berries.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Scorpius) {
		if(rosalin.flags["Scorpius"] == 0) {
			Text.Add("<i>“Where do you find this stuff?”</i> the alchemist asks curiously, holding up the large scorpion stinger. <i>“Whoops!”</i> [heshe] exclaims, hopping back as the thing lets out a spray of poisonous fluid.", parse);
			Text.NL();
			Text.Add("<i>“Maybe if I mix it with something stronger...”</i> You step back to let [himher] do [hisher] magic, mixing and pouring stuff together seemingly at random.", parse);
			rosalin.flags["Scorpius"] = 1;
		}
		else {
			Text.Add("<i>“Okay, let’s give this another go!”</i> the alchemist says, rubbing [hisher] hands together. <i>“What’s the worst thing that could happen?”</i>", parse);
		}
		Text.NL();
		Text.Add("<i>“I think I got rid of all the poison,”</i> Rosalin announces brightly as [heshe] presents you with the finished potion. Right.", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				Items.Scorpius.Use(player);
				Text.Add("Rosalin studies you for a few moments after you down the potion, counting under [hisher] breath. After ten seconds or so, [heshe] relaxes.", parse);
				Text.NL();
				Text.Add("<i>“Alright, if there aren’t any bad symptoms by now, you’re probably fine.”</i>", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Down it goes!”</i> Rosalin cheerfully exclaims as [heshe] chugs the dubious liquid.", parse);
				Text.NL();

				var scenes = new EncounterTable();
				// TAIL
				scenes.AddEnc(function() {
					Text.Add("<i>“Neat!”</i> [heshe] exclaims, flexing [hisher] new insectoid tail. The stinger at the end looks like it contains some quite potent poison… probably best to avoid that.", parse);
					TF.SetAppendage(rosalin.Back(), AppendageType.tail, Race.Scorpion, Color.black);
					Text.NL();
				}, 1.0, function() { var tail = rosalin.HasTail(); return !tail || (tail.race != Race.Scorpion); });
				//TODO: more?
				scenes.Get();

				Text.Add("[HeShe] sways back and forth for a while, letting out a small burp. <i>“I… I think I’ll sit this one out,”</i> [heshe] mutters, rubbing [hisher] head. <i>“Must be something I ate.”</i>", parse);
				Text.NL();
				Text.Add("...You probably shouldn’t feed [himher] any more of this stuff. Probably not healthy.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("...No. Drinking this might actually kill you. You pour out the vile concoction - most likely a wise move, as some of the plants right up shrivel and die.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Lepida) {
		if(rosalin.flags["Lepida"] == 0) {
			Text.Add("<i>“It’s pretty!”</i> Rosalin exclaims as [heshe] carefully handles the colorful moth-wing you handed over. [HeShe] waves the thing, releasing a puff of glittering powder. <i>“It’s like fairy dust!”</i> The alchemist turns to [hisher] workbench, starting to pick out various vials and jars.", parse);
			Text.NL();
			Text.Add("<i>“A little of this, a little of that, aaand some fairy dust!”</i> [heshe] chimes, sprinkling some glittering seasoning on the concoction.", parse);
			rosalin.flags["Lepida"] = 1;
		}
		else {
			Text.Add("<i>“Sure! I wanted to try out a different mix this time anyways.”</i> [HeShe] begins mixing the ingredients together into a beaker.", parse);
		}
		Text.NL();
		Text.Add("<i>“Mm… can’t wait to try it!”</i> Rosalin licks [hisher] lips, holding up a bottle of glittering purple liquid.", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				Items.Lepida.Use(player);
				Text.Add("Rosalin jots down some notes on a piece of paper as [heshe] observes the potion’s effect on you.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Here we go!”</i> Rosalin cheerfully chugs the purple potion, a bright smile on [hisher] face as [heshe] pours the sweet liquid down [hisher] throat.", parse);
				Text.NL();

				var scenes = new EncounterTable();
				// TAIL
				scenes.AddEnc(function() {
					Text.Add("A pair of purple fairy-like wings sprout from the alchemist’s back, exuding glittering dust as [heshe] experimentally flaps them.", parse);
					TF.SetAppendage(rosalin.Back(), AppendageType.wing, Race.Moth, Color.purple, 2);
					Text.NL();
				}, 1.0, function() { var wings = rosalin.HasWings(); return !wings || (wings.race != Race.Moth); });
				scenes.AddEnc(function() {
					Text.Add("<i>“Well, this is new,”</i> [heshe] notes, carefully touching [hisher] newly sprouted moth-like feelers. From [hisher] expression, the new appendages are very sensitive.", parse);
					TF.SetAppendage(rosalin.Appendages(), AppendageType.antenna, Race.Moth, Color.purple, 2);
					Text.NL();
				}, 1.0, function() { var antenna = rosalin.HasAntenna(); return !antenna || (antenna.race != Race.Moth); });
				scenes.AddEnc(function() {
					Text.Add("<i>“Aww… I will miss that one,”</i> the alchemist pouts, lamenting the loss of [hisher] canid knot.", parse);
					Text.NL();
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++) {
						if(cocks[i].knot != 0) {
							cocks[i].knot = 0;
							break;
						}
					}
				}, 1.0, function() {
					var knot = false;
					var cocks = rosalin.AllCocks();
					for(var i = 0; i < cocks.length; i++)
						if(cocks[i].knot != 0) knot = true;
					return knot;
				});

				scenes.Get();

				Text.Add("<i>“Mm… such a rush,”</i> Rosalin smiles dreamily, licking [hisher] lips. <i>“Makes me feel… hot.”</i>", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("You pour the glittering liquid on the plants around Rosalin’s workbench. Some of them seem to absorb the concoction, changing in color and letting out small puffs of glittering powder.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Avia) {
		if(rosalin.flags["Avia"] == 0) {
			Text.Add("<i>“Shiny,”</i> Rosalin comments, holding up the gaudy trinket you brought to the light. <i>“I suppose I could melt it down… but I don’t have a strong enough fire. I wish I knew magic,”</i> [heshe] sighs.", parse);
			Text.NL();
			Text.Add("You shudder to think of the imagery of Rosalin throwing fireballs left and right. Not to mention the distinct risk of being made to drink molten metal. It’s probably for the best that things stay the way they are.", parse);
			Text.NL();
			Text.Add("<i>“Ah well, I guess I’ll just leave it at the bottom of the pot for flavor,”</i> the alchemist shrugs.", parse);
			rosalin.flags["Avia"] = 1;
		}
		else {
			Text.Add("<i>“Let’s see if I can make a stronger one this time, I was a bit disappointed with the last one,”</i> Rosalin mutters as [heshe] gets [hisher] gear ready.", parse);
		}
		Text.NL();
		Text.Add("After some preparation, the ingredients go into a big pot and are left to stew for a while. Rosalin ponders the mixture, adding small portions of various herbs seemingly at random. Acting on some que perhaps only detectable by the alchemist, [heshe] fishes out the trinket from the potion and quickly pour the concoction into a bottle.", parse);
		Text.NL();
		Text.Add("<i>“There we go!”</i> [heshe] exclaims, looking happy with the result.", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				Items.Avia.Use(player);
				Text.Add("Rosalin notes the effects of the potion on your body, humming to [himher]self happily.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Sure, I’ll try it!”</i> Rosalin readily agrees, quickly downing the potion. As always, the alchemist is eager to see the fruit of [hisher] efforts.", parse);
				Text.NL();

				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("A pair of feathery wings sprout from [hisher] back, majestic in their own right but probably not large enough to fly with.", parse);
					TF.SetAppendage(rosalin.Back(), AppendageType.wing, Race.Avian, Color.bronze, 2);
					Text.NL();
				}, 1.0, function() { var wings = rosalin.HasWings(); return !wings || (wings.race != Race.Avian); });
				// TAIL
				scenes.AddEnc(function() {
					Text.Add("Rosalin’s tail quickly retracts, leaving no trace behind.", parse);
					Text.NL();
					Text.Add("<i>“Aww… but I liked that tail,”</i> [heshe] pouts.", parse);
					TF.RemoveAppendage(rosalin.Back(), AppendageType.tail, 1);
					Text.NL();
				}, 1.0, function() { return rosalin.HasTail(); });
				scenes.AddEnc(function() {
					Text.Add("Rosalin’s horns quickly pull back into [hisher] head, leaving no trace behind.", parse);
					TF.RemoveAppendage(rosalin.Appendages(), AppendageType.horn, 4);
					Text.NL();
				}, 1.0, function() { return rosalin.HasHorns(); });

				scenes.Get();

				Text.Add("<i>“Tastes very sweet,”</i> the alchemist comments, pursing [hisher] lips. <i>“Would go well with something salty… if you catch my drift.”</i>", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("Better skip this one. You pour out the contents next to Rosalin’s workbench, warily eyeing the now much fluffier plants around it. They tweet innocently, but seem to be largely harmless.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(item == Items.Ovis) {
		if(rosalin.flags["Ovis"] == 0) {
			Text.Add("<i>“Hmm… doesn’t smell like cow milk. Is this… sheep?”</i> Rosalin frowns as [heshe] suspiciously sniffs the bottle you give [himher]. <i>“I wonder...”</i>", parse);
			Text.NL();
			Text.Add("The alchemist busies [himher]self with the ingredients you gave [himher], mixing them together in a pot. The horn is filed down to a fine powder on a bed of grass, and worked together with the milk using a pestle. Once the concoction has simmered over the flame for a while - and several herbs of various kinds have been added - the alchemist seems happy with it.", parse);
			rosalin.flags["Ovis"] = 1;
		}
		else {
			Text.Add("<i>“One sheep-tonic, coming up!”</i> The alchemist quickly goes to work on the ingredients you brought [himher], preparing them in a way you swear subtly differs from when [heshe] last made it.", parse);
		}
		Text.NL();
		Text.Add("<i>“Well, here it is,”</i> Rosalin declares, giving you a bottle containing a thick white fluid.", parse);
		Text.Flush();

		var rosalinUnlocked = true;
		var prompt = function() {
			//[You][Rosalin][Discard]
			var options = new Array();
			options.push({ nameStr : "You",
				func : function() {
					Text.Clear();
					Items.Ovis.Use(player);
					Text.Add("<i>“Do you feel any… different?”</i> the alchemist asks you, notepad at the ready. <i>“Any urge to give up your quest and follow the masses?”</i>", parse);
					Text.Flush();
					Gui.NextPrompt(function() {
						Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
					});
				}, enabled : true,
				tooltip : "Drink the potion yourself."
			});
			options.push({ nameStr : "Rosalin",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Nu-uh,”</i> Rosalin shakes [hisher] head. <i>“I wouldn’t want to become a sheep! This stuff can make you really air-headed, I hear! I’ve some limits, you know. I couldn’t make potions if I were stupid!”</i>", parse);
					Text.NL();
					Text.Add("…[HeShe] says, wistfully eyeing the potion and licking [hisher] lips. Turning down drinking one of [hisher] own mixtures is a feat of willpower for [himher].", parse);
					Text.Flush();
					rosalinUnlocked = false;
					prompt();
				}, enabled : rosalinUnlocked,
				tooltip : "Offer the potion to Rosalin."
			});
			options.push({ nameStr : "Discard",
				func : function() {
					Text.Clear();
					Text.Add("You pour out the potion into the vegetation around Rosalin’s workbench. The mindless baa-h of the wooly plants are kind of soothing, believe it or not.", parse);
					Text.Flush();
					Gui.NextPrompt(function() {
						Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
					});
				}, enabled : true,
				tooltip : "Pour out the potion."
			});
			Gui.SetButtonsFromList(options);
		}
		prompt();
	}
	else if(item == Items.Anusol) {
		Text.Add("<i>“One butt-lotion coming up!”</i>", parse);
		Text.NL();
		Text.Add("Before long, the alchemist presents you with a bottle containing a greenish fluid. It’s somewhat oily, and almost clear-looking. It looks almost like juice from some fruit, but the lack of smell instantly throws that hypothesis out of the window.", parse);
		Text.NL();
		Text.Add("<i>“Wonder what this one’ll do,”</i> [heshe] muses, handing the Anusol to you.", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				Items.Anusol.Use(player);
				Text.Add("You take the oily green fluid a little cautiously, then slowly drink it down. No sooner have you finished off the last of it, when you drop the bottle in shock as a tingling sensation sweeps across your [skin]. Warmth emanates from deep inside of you, and your arms sweep around your stomach as you moan. ", parse);
				Text.NL();
				Text.Add("The feelings seem to be coming from your [anus]... a sort of prickling that sends pleasure coiling up your spine, making you wriggle and shake your [hips]. It grows stronger and stronger, and you pant heavily in desire. It feels like you are being fucked by the biggest, longest, hardest cock you can image - a dream cock that is ravaging your ass with unnatural expertise, blotting out everything but the feelings sweeping through you.", parse);
				Text.NL();
				parse["botArmor"] = player.LowerArmorDesc();
				Text.Add("You don’t even recognize where you are until you finally cum, snapping abruptly back to reality with your [botArmor] drenched in fluids. Rosalin simply smiles happily at you, leaving you to shuffle there in the puddle you have made.", parse);
				Text.NL();
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();

				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("The [raceDesc] lets out an excited squeal and eagerly knocks back the potion. [HisHer] whole body quivers and [heshe] nearly falls forward, hands thumping onto the desk to support [hisher] weight. [HeShe] arches [hisher] back and moans, buttocks swaying and thrusting, [rtail] flicking in agitation as [heshe] reacts to some invisible cock roughly pounding [hisher] ass.", parse);
					Text.NL();
					if(rosalin.FirstCock()) {
						parse["notS"] = rosalin.NumCocks() > 1 ? "" : "s";
						Text.Add("Rosalin’s [rcocks] stand[notS] erect, drooling thick ropes of pre-cum from [hisher] anal contractions, the potion’s effects kicking [hisher] prostate into overdrive.", parse);
						Text.NL();
					}
					if(rosalin.FirstVag()) {
						Text.Add("The potion has the [raceDesc] so hot and horny that you can see [hisher] pussy watering in sympathy, drooling a veritable waterfall of feminine fluids.", parse);
						Text.NL();
					}
					var gen = "";
					if(rosalin.FirstCock()) gen += "[rcocks] firing";
					if(rosalin.FirstCock() && rosalin.FirstVag()) gen += " and ";
					if(rosalin.FirstVag()) gen += "pussy gushing";
					parse["gen"] = Text.Parse(gen, parse);
					Text.Add("Rosalin gasps loudly, repeated sharp moans bubbling from [hisher] throat before giving voice to a high-pitched scream of ecstasy as [heshe] experiences an obvious assgasm, [gen] in sympathy. Fluids stain the ground as [heshe] just keeps writhing in pleasure, before [heshe] finally trails off in a long, low sigh, slumping bonelessly to [hisher] knees.", parse);
					Text.NL();
					Text.Add("<i>“Mmm, I just love this potion... your loss if you don’t want to give it a try,”</i> [heshe] purrs, then lets out a satisfied giggle.", parse);
				}, 1.0, function() { return true; });

				scenes.Get();

				Text.NL();
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("Shaking your head, you decide to discard the results of the experiment. Rosalin looks slightly disappointed as you pour the contents of the bottle on the ground. The plants around her lab open wide, pink-red blooms, leaking visible rivers of nectar as the potion is soaked up into them.", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}

	//TODO MORE TFS
	/*
	else if(item == Items.Lacertium) {
		if(rosalin.flags["Lacertium"] == 0) {
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			rosalin.flags["Lacertium"] = 1;
		}
		else {
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
		}
		Text.NL();
		Text.Add("", parse);
		Text.Flush();

		//[You][Rosalin][Discard]
		var options = new Array();
		options.push({ nameStr : "You",
			func : function() {
				Text.Clear();
				Items.Lacertium.Use(player);
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Drink the potion yourself."
		});
		options.push({ nameStr : "Rosalin",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
				Gui.NextPrompt(function() {
					RosalinScenes.SexPrompt(RosalinSexState.Regular);
				});
			}, enabled : true,
			tooltip : "Offer the potion to Rosalin."
		});
		options.push({ nameStr : "Discard",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
				Gui.NextPrompt(function() {
					Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
				});
			}, enabled : true,
			tooltip : "Pour out the potion."
		});
		Gui.SetButtonsFromList(options);
	}
	*/


	// Fallback
	else {
		inventory.AddItem(it);
		Gui.NextPrompt(function() {
			Alchemy.AlchemyPrompt(rosalin, party.inventory, RosalinScenes.Interact, RosalinScenes.CombineCallback);
		});
	}
}

let RosalinSexState = {
	Regular : 0,
	Heat    : 1,
	Rut     : 2
}
RosalinScenes.SexPrompt = function(state) {
	Text.Clear();

	var racescore = new RaceScore(rosalin.body);
	var compScore = rosalin.origRaceScore.Compare(racescore);

	var humanScore = new RaceScore();
	humanScore.score[Race.Human.id] = 1;
	var rHumanity = racescore.Compare(humanScore);

	var cocksInVag = player.CocksThatFit(rosalin.FirstVag());
	var p1Cock     = player.BiggestCock(cocksInVag);

	var allCocks = player.AllCocksCopy();
	for(var i = 0; i < allCocks.length; i++) {
		if(allCocks[i] == p1Cock) {
			allCocks.remove(i);
			break;
		}
	}
	var p2Cock = player.BiggestCock(allCocks);

	var parse = {
		raceDesc       : function() { return rosalin.raceDesc(compScore); },
		rbreasts    : function() { return rosalin.FirstBreastRow().Short(); },
		rnips   : function() { return rosalin.FirstBreastRow().NipsShort(); },
		rcock      : function() { return rosalin.FirstCock().Short(); },
		rCockLen       : function() { return rosalin.FirstCock().Desc().len; },
		rcockTip       : function() { return rosalin.FirstCock().TipShort(); },
		rcocks : function() { return rosalin.MultiCockDesc(); },
		rvag       : function() { return rosalin.FirstVag().Short(); },
		rclit      : function() { return rosalin.FirstVag().ClitShort(); },
		rBallsDesc     : function() { return rosalin.BallsDesc(); },
		rButtDesc      : function() { return rosalin.Butt().Short(); },
		ranus      : function() { return rosalin.Butt().AnalShort(); },
		rhair      : function() { return rosalin.Hair().Short(); },
		rtail      : function() { return rosalin.HasTail().Short(); },
		rlegs      : function() { return rosalin.LegsDesc(); },
		rskin      : function() { return rosalin.SkinDesc(); },
		rEyesDesc      : function() { return rosalin.EyeDesc() + "s"; },

		wName          : cale.name,
		wCockDesc      : function() { return cale.FirstCock().Short(); },

		playername     : player.name,
		boygirl        : player.body.Gender() == Gender.male ? "boy" : "girl",
		skinDesc       : function() { return player.SkinDesc(); },
		ballsDesc      : function() { return player.Balls().Short(); },
		breasts     : function() { return player.FirstBreastRow().Short(); },
		nipsDesc       : function() { return player.FirstBreastRow().NipsShort(); },
		vagDesc        : function() { return player.FirstVag().Short(); },
		clitDesc       : function() { return player.FirstVag().ClitShort(); },
		cock       : function() { return p1Cock.Short(); },
		cock2      : function() { return p2Cock.Short(); },
		cockTip        : function() { return p1Cock.TipShort(); },
		cockTip2       : function() { return p2Cock.TipShort(); },
		knotDesc       : function() { return p1Cock.KnotShort(); },
		knotDesc2      : function() { return p2Cock.KnotShort(); },
		tailDesc       : function() { return player.HasTail().Short(); },
		legsDesc       : function() { return player.LegsDesc(); },
		cocks  : function() { return player.MultiCockDesc(); },
		tongueDesc     : function() { return player.TongueDesc(); },
		hairDesc       : function() { return player.Hair().Short(); },
		armorDesc      : function() { return player.ArmorDesc(); },
		lowerArmorDesc : function() { return player.LowerArmorDesc(); },
		undressedReady : player.Armor() ? "undressed" : "ready"
	};
	parse = rosalin.ParserPronouns(parse);

	if(state == RosalinSexState.Rut) {
		Text.Add("You gulp uncertainly, eying the horny alchemist. Looks like [heshe] intends to use that on you...", parse);
		Text.Flush();

		//[Get fucked][Fuck her][Wolfie]
		var options = new Array();
		options.push({ nameStr : "Get fucked",
			func : function() {
				Text.Clear();
				p1Cock     = player.BiggestCock();

				Text.Add("<i>“Get ready for some rough lovin' [playername],”</i> Rosalin grins as [heshe] pushes you down on your back. Brandishing [hisher] stiff [rcock] like a battering ram, [heshe] lines [himher]self up with your crotch.", parse);
				if(player.FirstCock()) {
					parse["thisThese"] = player.NumCocks() > 1 ? "these" : "this";
					Text.Add(" <i>“Tempting, but I have no use for [thisThese] right now,”</i> the [raceDesc] alchemist callously dismisses your [cocks].", parse);
				}
				Text.NL();

				var target = BodyPartType.ass;
				if(player.FirstVag()) {
					Text.Add("Rubbing [hisher] maleness against your [vagDesc], soaking it in your lubricating juices, Rosalin muses over [hisher] options. ", parse);
					if(Math.random() < 0.75) {
						Text.Add("<i>“Bound to be a tight fit, but I'll loosen you up.”</i>", parse);
						target = BodyPartType.vagina;
					}
					else
						Text.Add("<i>“Today... I feel like using your back door.”</i>", parse);
					Text.NL();
				}
				var targetObj = (target == BodyPartType.vagina) ?
					player.FirstVag() :
					player.Butt();
				parse["targetDesc"] = (target == BodyPartType.vagina) ?
					function() { return player.FirstVag().Short(); } :
					function() { return player.Butt().AnalShort(); };

				Text.Add("[HeShe] positions [hisher] [rcockTip] at your [targetDesc], quickly soaking it in the contents of a tiny bottle procured from [hisher] bodice. <i>“Lubricant,”</i> [heshe] explains apologetically, <i>“can't go breaking my favorite toy!”</i> The alchemist pauses for a moment. <i>“Um, I think that is what it was anyways.”</i> The liquid has a slightly luminescent sheen, and feels icy cold as it drips on your [skinDesc].", parse);
				Text.NL();
				Text.Add("Eager to get started, the horny [raceDesc] prods against your opening. <i>“Now, be a good [boygirl] and. Open. Up!”</i> The last word is punctuated with a rough shove, as [hisher] [rcock] pushes its way inside your [targetDesc]. Your surprised gasp turns into an elongated moan as Rosalin begins to rapidly fuck you, not wasting any time on foreplay.", parse);
				Text.NL();

				if(target == BodyPartType.vagina) {
					Sex.Vaginal(rosalin, player);
					player.FuckVag(player.FirstVag(), rosalin.FirstCock(), 3);
					RosalinScenes.Impregnate(player, rosalin, PregnancyHandler.Slot.Vag);
				}
				else {
					Sex.Anal(rosalin, player);
					player.FuckAnal(player.Butt(), rosalin.FirstCock(), 3);
					RosalinScenes.Impregnate(player, rosalin, PregnancyHandler.Slot.Butt);
				}

				if(player.LowerBodyType() == LowerBodyType.Humanoid) {
					Text.Add("Taking a firm grip on your [legsDesc], Rosalin pushes them toward your head, splaying you out below [himher].", parse);
					Text.NL();
				}
				var looseness = targetObj.Cap() / rosalin.FirstCock().Thickness();
				if(looseness < 0.8)
					Text.Add("<i>“Fuck, so tight,”</i> [heshe] grunts, thrusting as much of [hisher] [rcock] inside you as [heshe] can fit. <i>“Gotta work you over more often, I think!”</i>", parse);
				else {
					Text.Add("<i>“Woah, seems you have been around!”</i> [heshe] exclaims, <i>“guess I'm not the first one to this hole!”</i>", parse);
					if(rosalin.FirstCock().Size() > 250)
						Text.Add(" Rosalin chuckles, thrusting [hisher] hips into you. <i>“‘Course, not sure that level of sluttiness will help, seeing what I'm packing.”</i>", parse);
				}
				Text.NL();
				Text.Add("Done with words, the [raceDesc] alchemist lets [hisher] [rcock] do the talking. Pistoning in and out of your [targetDesc], the throbbing member is starting to have a definite effect on you. Rosalin kneads the [skinDesc] of your [breasts] with [hisher] hands, pinching and pulling at your [nipsDesc].", parse);
				Text.NL();
				if(rHumanity < 0.8) {
					Text.Add("You can hardly believe how roughly [heshe] is handling you; blinded by lust, [hisher] insistent pounding is animalistic, almost feral. The alchemist has a wild look in [hisher] [rEyesDesc] as [heshe] hugs you possessively, growling <i>“Mine!”</i> into your ear.", parse);
					Text.NL();
					Text.Add("With [rCockLen] of hot meat pummeling your [targetDesc], you can hardly voice a complaint. Or do anything but moan ecstatically, really.", parse);
				}
				else
					Text.Add("While [heshe] still seems in command of [hisher] senses, Rosalin is very rough, thrusting [hisher] [rcock] inside you like there is no tomorrow.", parse);
				Text.NL();
				Text.Add("A rapid series of rough thrusts quickly has you reduced to a moaning slut, slave to your desires.", parse);
				if(player.FirstCock()) {
					parse["s"] = player.NumCocks() > 1 ? "s" : "";
					parse["notS"] = player.NumCocks() > 1 ? "" : "s";
					parse["itThem"] = player.NumCocks() > 1 ? "them" : "it";
					Text.Add(" Your own [cocks] stand[notS] at attention, pearly precum splattering from the tip[s], dripping onto your stomach. Rosalin occasionally teases you by rubbing against [itThem] with [hisher] hands, but never letting you get too excited. As if you could focus on anything but your [targetDesc] right now.", parse);
				}

				if(target == BodyPartType.vagina)
					Text.Add(" Even though the alchemist is railing you like a rutting beast, [hisher] progress is significantly eased by the clear juices flowing from your depths, each rhythmic thunk into your [targetDesc] keeping the torrid invader slick and wet.", parse);
				else {
					parse["tail"] = player.HasTail() ? Text.Parse(", soaking your [tailDesc]", parse) : "";
					Text.Add(" A clear pool of your juices is forming on the ground, fed by a small stream flowing past Rosalin's thrusting [rcock][tail]. The way your loins ache, you desperately wish you had something stuffed in there as well.", parse);
				}
				Text.NL();

				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Almost there, [playername]!”</i> the [raceDesc] howls, announcing [hisher] coming orgasm.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“F-fuuuck! C-coming!”</i> the [raceDesc] moans.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“W-with all the stuff I drink - hngh - do you think my cum will change you?”</i> the alchemist pants, grinning at the thought. <i>“Only one way to find out!”</i>", parse);
				}, 1.0, function() { return true; });

				scenes.Get();

				parse["balls"] = rosalin.HasBalls() ? Text.Parse(" and [rBallsDesc]", parse) : "";
				Text.NL();
				Text.Add("Rosalin increases [hisher] pace, rutting irregularly against your loins. By now, [heshe] has reached your innermost depths, each thrust smacking [hisher] hips[balls] against your [skinDesc]. The alchemist cries out, and you feel [hisher] [rcock] convulse inside your tight hole.", parse);
				Text.NL();
				parse["balls"] = rosalin.HasBalls() ? Text.Parse(", fresh from Rosalin's [rBallsDesc]", parse) : "";
				Text.Add("The dam released, your [targetDesc] is assaulted by load after load of hot cum[balls]. The [raceDesc] continues to rail you all the way through [hisher] climax, [hisher] body going on auto-pilot as [hisher] mind goes blank.", parse);
				Text.NL();
				if(rosalin.NumCocks() > 1) {
					parse["s"]        = rosalin.NumCocks() > 2 ? "s" : "";
					parse["notS"]     = rosalin.NumCocks() > 2 ? "" : "s";
					parse["itsTheir"] = rosalin.NumCocks() > 2 ? "their" : "its";
					Text.Add("Rosalin's other cock[s] spray[notS] [itsTheir] fertile seed all over your [skinDesc], some landing on your [breasts] and some even reaching your jaw, dribbling down in a pearly necklace.", parse);
					Text.NL();
				}
				parse["hardWet"] = player.FirstVag() ? "wet" : "hard";
				Text.Add("Filled to the brim, you are still [hardWet] and achingly aroused. The alchemist's rapid rutting left you behind, and now you need to get off, <i>badly</i>.", parse);
				Text.NL();

				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Didn't get to cum, pet?”</i> Rosalin bemoans your fate, grinning mischievously, still panting from [hisher] own climax. [HisHer] [rcock], somehow still hard, begins to move inside you, slower than before, but somehow more pleasurable. <i>“Let's fix that, shall we?”</i> the [raceDesc] purrs smugly, slowly sawing [hisher] way in and out of your [targetDesc].", parse);
					Text.NL();
					parse["cocks"] = player.FirstCock() ? Text.Parse(", your [cocks] twitching uncontrollably", parse) : "";
					Text.Add("You cannot withstand the alchemists intimate massage for long, and soon your moans turn into a drawn out cry[cocks].", parse);
					Text.NL();
					Text.Add("[HisHer] excessive energy finally spent, the alchemist collapse on top of you. A pool of spunk spreads from your abused [targetDesc], unleashed as Rosalin pulls [hisher] softening member out of you.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					parse["s"] = rosalin.NumCocks() > 1 ? "s" : "";
					parse["oneof"] = rosalin.NumCocks() > 1 ? " one of" : "";
					Text.Add("<i>“After that fuck, I don't mind giving a little back,”</i> Rosalin smiles at you. Pulling out of your [targetDesc] and leaving a large pool of cum behind [himher], the [raceDesc] straddles your face, [hisher] [rcocks] rubbing against you.", parse);
					Text.NL();
					Text.Add("<i>“Lick me, and I'll do the same for you,”</i> [heshe] orders imperiously, waiting for your [tongueDesc] to start lapping at [hisher] [rcocks] before going down on you. Under [hisher] expert ministrations, your tension is soon released in the stickiest manner possible.", parse);
					Text.NL();
					Text.Add("Rosalin licks [hisher] lips, patting you on the stomach. <i>“Good [boygirl]! One present for me...”</i> [heshe] raises [hisher] hips, lining up [hisher] cannon[s], <i>“... and one. For. You!”</i> The last words are grunted out, Rosalin's hands tight around[oneof] [hisher] cock[s]. This time, [heshe] hits you point-blank, cum splattering all over your face and [hairDesc].", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Hah... haah... oh?”</i> Rosalin pants, noticing you've yet to climax. <i>“Ah well,”</i> [heshe] shrugs as [heshe] pulls out of you, [hisher] cum leaking out from your [targetDesc]. <i>“Don't worry, gimme a few minutes and I'll have you screaming.”</i>", parse);
					Text.NL();
					Text.Add("You look at [himher] incredulously. Surely not... One look down at the alchemist's stiffening [rcocks] confirms your fears. <i>“Thought I was done? We have barely gotten started yet!”</i> Rolling you over on your stomach, Rosalin pries your [legsDesc] apart, exposing your crotch.", parse);
					Text.NL();

					parse["holes"] = player.FirstVag() ? "both of your holes." : "your bloated stomach.";
					Text.Add("<i>“Better brace yourself!”</i> Without further ado, the [raceDesc] once again spears you on [hisher] [rcock]. True to [hisher] word, over the coming hours Rosalin makes you climax more times than you can count. What feels like gallons of [hisher] spunk fill [holes] You'll be sore for days after this, but decide that you don't mind...", parse);

					player.FuckAnal(player.Butt(), rosalin.FirstCock(), 2);
					if(player.FirstVag())
						player.FuckVag(player.FirstVag(), rosalin.FirstCock(), 2);

					world.TimeStep({hour: 3});

				}, 1.0, function() { return true; });

				scenes.Get();

				Text.Flush();

				Gui.NextPrompt(function() {
					Text.Clear();

					Text.Add("<i>“Mmm... can't wait for the next round, lover,”</i> she whisper in your ear before passing out. You take a small nap of your own before getting ready to leave. The [raceDesc] alchemist is still sleeping when you leave [himher], curled up in a ball and purring contentedly.", parse);
					Text.Flush();

					world.TimeStep({hour: 1});
					player.AddLustFraction(-1);
					Gui.NextPrompt();
				});
			}, enabled : true,
			tooltip : Text.Parse("Let [himher] have [hisher] way with you.", parse)
		});
		if(rosalin.BiggestCock() && rosalin.BiggestCock().length.Get() >= 25) {
			options.push({ nameStr : "Worship",
				func : function() { RosalinScenes.CockWorship(RosalinSexState.Rut); }, enabled : true,
				tooltip : "Offer your worship to the alchemist's cock."
			});
		}
		/* TODO
		options.push({ nameStr : "Fuck her",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
			}, enabled : true,
			tooltip : ""
		});
		*/
		options.push({ nameStr : cale.name,
			func : function() {
				Text.Clear();
				Text.Add("Fuck, looks like [heshe]'s lost it. You begin to edge back from the horny [raceDesc], not really wanting to deal with [himher] right now. Rosalin follows you, [hisher] eyes glued to you, like a cat stalking a mouse. Before you know it [heshe] has you cornered between a wagon and a tent.", parse);
				Text.NL();

				parse["genDesc"] = player.FirstCock() ? function() { return player.MultiCockDesc(); } : player.FirstVag() ? function() { return player.FirstVag().Short(); } : "featureless crotch";

				// Cale is not slutty
				if(cale.Slut() <= 0) {
					Text.Add("<i>“Well well, what do we have here?”</i> a mocking voice murmurs into your ear. Surprised, you cast a glance over your shoulder. [wName] is standing just behind you, blocking your escape. You plead with him to help you out, but he just shakes his head, grinning at you. Catching you in a rough hug, the wolf-morph traps your arms to your sides, holding you in place.", parse);
					Text.NL();
					Text.Add("<i>“No running away now,”</i> he hisses maliciously in your ear, <i>“it's my job here to keep the alchemist calm, but I'd rather not deal with [himher] when [heshe] is like this.”</i> You can feel his stirring [wCockDesc] prodding you in the back, poking out from his sheath. Before you can voice a complaint, he cuts you off abruptly.", parse);
					Text.NL();
					Text.Add("<i>“Quit yapping. You are my bitch and you know it, and right now you're going to shut up and take it!”</i> Ignoring the posturing of the wolf, you gulp as the alchemist prowls toward you.", parse);
					Text.NL();
					Text.Add("<i>“Wrong, Cale. The bitch... is <b>mine</b>!”</i> Rosalin roars, pouncing on you.", parse);
					if(player.Armor())
						Text.Add(" [HeShe] easily rips away your [lowerArmorDesc], exposing your [genDesc].", parse);
					Text.NL();

					// TODO: Finish dommy scenes
					Text.Add("PLACEHOLDER: unfinished scene (dom).", parse, 'bold');
					Text.Flush();
					Gui.NextPrompt();
				}
				// "Normal" scene, -50 to +50
				else if(cale.Slut() < 30) {
					Text.Add("Out of the corner of your eye, you see [wName] passing by behind you. Grasping at the opportunity, you make a wild dash, shouldering past the surprised wolf-morph. Turning after you [wName] growls something under his breath, before it is violently crushed from him.", parse);
					Text.NL();
					Text.Add("Rosalin, rushing after you in pursuit, boulders into the poor wolf-morph, and the two of them roll around on the ground. After a brief tussle, the [raceDesc] alchemist comes out on top, panting slightly. [HeShe] moves to go after you, but stops when [heshe] notices the wolf pinned face-down underneath [himher]. Rosalin's aggressive snarl slowly turns into a wide grin as [heshe] makes a few experimental thrusts with [hisher] hips, letting [hisher] [rcocks] lightly brush against [wName]'s taint.", parse);
					Text.NL();
					Text.Add("<i>“R-rosie, let me go!”</i> the wolf-morph begs piteously, trying to reason with the alchemist. One look at Rosalin's flushed expression tells you that's not likely to work. <i>“I don't think so! You always so nice, helping me out when I get horny.”</i> The [raceDesc] leans in close, hotdogging [hisher] [rcocks] between the increasingly desperate wolf's cheeks. <i>“And right now, I'm very, very horny,”</i> [heshe] purrs.", parse);
					Text.NL();
					Text.Add("Seems you are off the hook for now, as Rosalin has found a new toy to play with. You could use this opportunity to escape, or...", parse);
					Text.Flush();

					//[Sure][Nah]
					var options = new Array();
					options.push({ nameStr : "Leave",
						func : function() {
							Text.Clear();
							Text.Add("You hurry off, leaving the pair on the ground. Looks like [wName] is in for a rough ride. He lets out a pained yelp as Rosalin gets down to business, spearing the poor wolf-morph on [hisher] [rcock]. Better avoid this area for a while.", parse);

							player.AddLustFraction(0.1);
							world.TimeStep({hour: 1});

							Text.Flush();
							Gui.NextPrompt();
						}, enabled : true,
						tooltip : "Get out of there while you still can."
					});
					options.push({ nameStr : "Watch",
						func : function() {
							Text.Clear();
							Text.Add("", parse);
							Text.NL();

							RosalinScenes.FuckCaleWatchEntryPoint();

						}, enabled : false, // TODO
						tooltip : ""
					});
					options.push({ nameStr : "Join",
						func : function() {
							Text.Clear();
							Text.Add("", parse);
							Text.NL();
							Text.Flush();
						}, enabled : false, // TODO
						tooltip : ""
					});
					Gui.SetButtonsFromList(options);

				}
				// Cale is slutty as fuck
				else {
					// TODO: FINISH SLUTTY SCENES
					Text.Add("PLACEHOLDER: unfinished scene (slutty).", parse);
					Text.Flush();
					Gui.NextPrompt();


				}
			}, enabled : true,
			tooltip : Text.Parse("Call in [wName] to stand in for you.", parse)
		});
		Gui.SetButtonsFromList(options);
	}
	else if(state == RosalinSexState.Heat) {
		Text.Add("PLACEHOLDER: Heat sex", parse);
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
		Text.NL();

		player.AddLustFraction(-1);

		Text.Flush();
		Gui.NextPrompt();
	}
	//if(state == RosalinSexState.Regular)
	else {
		Text.Add("Transformation has quite the arousing effect on the horny alchemist, by now [heshe] is probably eager for something to deal with [hisher] itch.", parse);
		Text.Flush();

		//[Sure][Nah]
		var options = new Array();
		options.push({ nameStr : "Recv. Oral",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Mm... you got me, like, all hot and bothered now,”</i> Rosalin murmurs, eyeing you hungrily. <i>“How are you going to take responsibility?”</i> Crooking your finger calling [himher] over, you start undoing your [armorDesc]. Giving you a delighted yelp, the [raceDesc] alchemist gets down on [hisher] knees, licking [hisher] lips while waiting for you to get [undressedReady].", parse);
				Text.NL();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.NL();
				Text.Add("PLACEHOLDER: Regular sex (only cock fuck scene available atm)", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Let the alchemist pleasure you orally."
		});
		if(rosalin.BiggestCock() && rosalin.BiggestCock().length.Get() >= 25) {
			options.push({ nameStr : "Worship",
				func : function() { RosalinScenes.CockWorship(RosalinSexState.Regular); }, enabled : true,
				tooltip : "Offer your worship to the alchemist's cock."
			});
		}


		if(p1Cock && rosalin.FirstVag()) {
			options.push({ nameStr : "Fuck Vag",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Hey, feeling up for a bit of fun?”</i> Rosalin coyly lifts [hisher] dress, exposing the wet slit between [hisher] [rlegs].", parse);
					if(rosalin.FirstCock())
						Text.Add(" The [raceDesc] pulls [hisher] [rcocks] aside, inviting you to use [hisher] feminine parts.", parse);
					Text.NL();

					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.Add("Grinning, you push [himher] down on [hisher] back, prying [hisher] [rlegs] apart and rubbing your [cocks] against [hisher] eager nether lips. The horny alchemist moans in appreciation, [hisher] hands busy tearing off the remainder of [hisher] clothes, baring [hisher] [rbreasts].", parse);
						Text.NL();
						var r = Math.random();
						if(r < 0.33)
							Text.Add("<i>“Mm, just shove that bad boy in there!”</i> Rosalin exclaims excitedly.", parse);
						else if(r < 0.66)
							Text.Add("<i>“I <b>need</b> you inside me!”</i> the alchemist begs you.", parse);
						else
							Text.Add("<i>“Fuck me [playername], fill me with your seed!”</i> the needy [raceDesc] begs you.", parse);
						Text.NL();
						Text.Add("You grunt as you comply with [hisher] wishes, pushing a good portion of your [cock] inside [hisher] honeypot in one thrust. Building up a rhythm, you start railing [himher] in earnest, your [cock] pushing deep inside [himher], coated by [hisher] dripping juices.", parse);
						Text.NL();

						Sex.Vaginal(player, rosalin);
						rosalin.FuckVag(rosalin.FirstVag(), p1Cock, 3);
						player.Fuck(p1Cock, 3);

						Text.Add("<i>“Yes! Yes! Yes!”</i> Rosalin screams, each of your thrusts causing waves of pleasure to surge through [hisher] body. [HisHer] [rvag] is clamping down tight around your [cock], [hisher] vaginal walls clenching sensually around your thrusting member.", parse);
						if(player.NumCocks() == 2)
							Text.Add(" You reach down, your hand jerking your other [cock2] eagerly. The [raceDesc] is going to receive a sticky gift if you have any say in the matter.", parse);
						else if(player.NumCocks() > 2)
							Text.Add(" Grasping your free [cocks] with your hands, you start preparing to drench the [raceDesc] alchemist in your seed.", parse);
						else
							Text.Add(" You grasp the [raceDesc] alchemist by the hips, seeking a better hold.", parse);

						if(rosalin.FirstBreastRow().size.Get() > 5)
							Text.Add(" Rosalin starts playing with [hisher] [rbreasts], rubbing and tweaking [hisher] [rnips].", parse);
						Text.NL();

						Text.Add("<i>“Y-you are gonna make me cuuuum-”</i> Rosalin shrieks, clenching down on your [cock]. The slut is true to [hisher] words, as you feel [hisher] juices seeping out of [hisher] ravaged hole.", parse);
						if(rosalin.FirstCock())
							Text.Add(" Rosalin's male parts also make their contribution, as [heshe] spills [hisher] seed on [hisher] stomach, staining [hisher] [rskin].", parse);
						Text.Add(" You slow your thrusts a bit, allowing [himher] to recuperate before resuming your full-on vaginal assault.", parse);
						Text.NL();
						Text.Add("Before long you feel your own climax approaching. Groaning, you deposit your load in the panting [raceDesc], your virile spunk painting [hisher] insides white.", parse);

						var cum = player.OrgasmCum();

						if(cum > 3)
							Text.Add(" Rosalin's stomach swells slightly as your overflowing seed fills [hisher] womb to the brim.", parse);
						if(p1Cock.knot)
							Text.Add(" The swell of your [knotDesc] prevents any of your seed from escaping [hisher] tunnel, effectively locking you inside [himher].", parse);
						else {
							Text.Add(" Some of your seed leaks out, trailing down [hisher] buttocks", parse);
							if(rosalin.HasTail())
								Text.Add(", pooling in the indentation of [hisher] [ranus] and [hisher] [rtail]", parse);
							Text.Add(".");
						}
						Text.NL();
						if(player.NumCocks() > 1) {
							parse["s"]        = player.NumCocks() > 1 ? "s" : "";
							parse["notS"]     = player.NumCocks() > 1 ? "" : "s";
							parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
							parse["coatingdrenching"] = cum > 3 ? "drenching" : "coating";
							Text.Add("Your other member[s] fire[notS] [itsTheir] own seed, [coatingdrenching] the alchemist in strands of white.", parse);
						}
					}, 1.0, function() { return !p1Cock.isStrapon; });
					scenes.AddEnc(function() {
						Text.Add("Spinning [himher] around and pushing [himher] down on top of a nearby barrel, you rub your [cocks] against [hisher] wet labia.", parse);
						Text.NL();
						if(p1Cock.race != Race.Human)
							Text.Add("<i>“Ooh, a bad boy,”</i> Rosalin breathlessly compliments your [cock]. <i>“Fuck me good! Fuck me like an animal!”</i>", parse);
						else
							Text.Add("<i>“Come on, what are you waiting for?”</i> [heshe] moans, shivering from your teasing.", parse);
						Text.NL();
						Text.Add("Seeing as [heshe] is practically begging for it, you amiably comply, shoving your throbbing [cock] into [hisher] waiting tunnel. The [raceDesc] gives a cute yelp as you start to repeatedly spear [himher] on your manhood, [hisher] [rlegs] trembling weakly. If it wasn't for the barrel, [heshe]'d probably be lying on the ground by now.", parse);
						Text.NL();

						Sex.Vaginal(player, rosalin);
						rosalin.FuckVag(rosalin.FirstVag(), p1Cock, 3);
						player.Fuck(p1Cock, 3);

						parse["s"]     = player.NumCocks() > 2  ? "s" : "";
						parse["isAre"] = player.NumCocks() > 2  ? "are" : "is";
						parse["both"]  = player.NumCocks() == 2 ? "both" : "two";
						parse["oneof"] = player.NumCocks() > 2  ? " one of" : "";

						if(player.NumCocks() > 1 && Math.random() < 0.5) {
							Text.Add("The alchemist's [rvag] is surprisingly stretchy, easily taking your [cock]. Your other dick[s] [isAre] hotdogged tightly between [hisher] buttocks, giving you a nasty idea...", parse);
							Text.NL();
							Text.Add("Pulling out, you ignore Rosalin's moaned complaints as you lather each of your [cocks] in [hisher] hot pussy-juices.", parse);
							Text.NL();

							var target = BodyPartType.vagina;
							var scenes = new EncounterTable();
							scenes.AddEnc(function() {
								Text.Add("Lining up again, you press [both] of your [cocks] against [hisher] eager snatch. You push in, enjoying the suddenly much tighter fit. The [raceDesc], meanwhile, is going nuts, yowling in pleasure as [hisher] [rvag] gets double the amount of cock stuffed inside it.", parse);
							}, 1.0, function() { return true; });
							scenes.AddEnc(function() {
								var target = BodyPartType.ass;
								Text.Add("Resuming your brutal conquest of [hisher] [rvag], you line up[oneof] your other cock[s] with [hisher] puckered [ranus], insistently prodding at the tight opening. Rosalin lets out a drawn out yowl as you slowly push the [cockTip2] of your [cock2] past [hisher] tight ring, sealing it inside [hisher] back door.", parse);
							}, 1.0, function() { return true; });
							scenes.Get();

							Text.Add("Your rough double penetration soon has the [raceDesc] alchemist delirious with pleasure, as [heshe] moans incoherently, alternating between begging you to stop and pleading for you to fuck [himher] faster, harder.", parse);
							Text.NL();

							parse["s"] = target == BodyPartType.vagina ? "s" : "";
							Text.Add("The horny alchemist cums before you, soaking your shaft[s] in [hisher] sweet juices.", parse);
							if(rosalin.FirstCock())
								Text.Add(" The barrel is generously coated by [hisher] twitching [rcocks], the sticky strands slowly dripping down, fertilizing the ground below.", parse);
							Text.NL();
							parse["bd"] = player.HasBalls() ? Text.Parse(" your [ballsDesc] tightening,", parse) : "";
							Text.Add("Not long after, your [cocks] throb insistently,[bd] as you feel the surge of your orgasm rising.", parse);
							if(p1Cock.knot)
								Text.Add(" Growling, you push your [knotDesc] past [hisher] feeble defenses, locking your member - and your seed - inside [hisher] twitching [rvag].", parse);
							else
								Text.Add(" Groaning, you let your [cock] erupt inside the alchemist, pumping [himher] full of your seed.", parse);
							Text.NL();

							var cum = player.OrgasmCum();

							parse["kd"] = p2Cock.knot ? Text.Parse(", the [knotDesc2] sealing it inside", parse) : "";
							if(target == BodyPartType.vagina)
								Text.Add("Your [cock2] joins its sibling, pressing inside Rosalin's tight passage[kd].", parse);
							else // butt
								Text.Add("Your [cock2] pushes its way into Rosalin's [ranus][kd].", parse);
							Text.NL();
							if(cum > 3) {
								Text.Add("The [raceDesc] moans weakly as your huge load settles in [hisher] womb, slightly distending [hisher] stomach. ", parse);

								var knots = 0;
								if(p1Cock.knot) knots++;
								if(p2Cock.knot) knots++;

								if(knots) {
									parse["s"]        = knots == 2 ? "s" : "";
									parse["someMost"] = knots == 2 ? "most" : "some";
									Text.Add("Thanks to your knot[s], [someMost] of your seed is trapped inside.", parse);
								}
								else {
									parse["s"] = target == BodyPartType.ass ? "s" : "";
									Text.Add("The passage[s] unable to contain all of your seed, much of the sticky liquid spills outside, trailing down Rosalin's [rlegs].", parse);
								}
							}
						}
						else {
							Text.Add("Gripping [hisher] hips tightly, you rail [himher] as roughly as you can, coaxed on by the [raceDesc]'s encouraging moans.", parse);
							if(player.NumCocks() > 1)
								Text.Add(" Your other cock[s] [isAre] pleasantly lodged between Rosalin's smooth buttocks, each thrust hotdogging your shaft[s].", parse);
							Text.NL();
							if(p1Cock.length.Get() > 30)
								Text.Add("<i>“N-nyaa! So big!”</i> the alchemist yowls as [heshe] is speared by your brutally large member, penetrating deep into [hisher] folds.", parse);
							else
								Text.Add("<i>“Faster! Deeper!”</i> [heshe] yelps, urging you to fuck [himher] even more roughly.", parse);
							Text.Add(" The angle is perfect for reaching deep inside [himher], and your [cock] is soon lodged in [hisher] [rvag], buried to the hilt.", parse);
							if(player.HasBalls())
								Text.Add(" The sound of your [ballsDesc] slapping against [hisher] [rButtDesc] forms a nice accompaniment to the rhythmic thuds caused by your repeated railing of the alchemist.", parse);
							Text.NL();
							Text.Add("Pounded almost into insensibility, Rosalin shudders as [hisher] orgasm overcomes [himher], coating your shaft in [hisher] sweet juices.", parse);
							if(rosalin.FirstCock())
								Text.Add(" Even untended, [hisher] [rcocks] is drooling, [hisher] wasted load dripping down the side of the barrel, fertilizing nothing but the ground.", parse);
							else
								Text.Add(" The trembling alchemist can't do anything but hug the barrel [heshe] is splayed over, holding on for dear life as you rail [himher].", parse);
							Text.NL();
							Text.Add("Keeping your pace up as long as your stamina allows it, you eventually groan, allowing your rising orgasm to surge through you. ", parse);
							if(!p1Cock.isStrapon) {
								Text.Add("The dam opened, your seed pours into the [raceDesc].", parse);
								if(p1Cock.knot)
									Text.Add(" You push your [knotDesc] inside, sealing the two of you together.", parse);
							}
							else {
								Text.Add("Shuddering, you collapse on top of the [raceDesc], utterly spent.", parse);
							}
						}
					}, 1.0, function() { return true; });
					/*
					scenes.AddEnc(function() {
						Text.Add("", parse);
						Text.NL();
					}, 1.0, function() { return true; });
					*/
					scenes.Get();

					Text.Flush();
					Gui.NextPrompt(RosalinScenes.VagAftermath);
				}, enabled : true,
				tooltip : Text.Parse("Fuck the [raceDesc] alchemist.", parse)
			});
		}

		/*
		options.push({ nameStr : "Nah",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : ""
		});
		*/
		Gui.SetButtonsFromList(options);
	}
}

RosalinScenes.CockWorship = function(sexState) {
	Text.Clear();

	var racescore = new RaceScore(rosalin.body);
	var compScore = rosalin.origRaceScore.Compare(racescore);

	var cock = rosalin.BiggestCock();

	var parse = {
		raceDesc       : function() { return rosalin.raceDesc(compScore); },
		rbreasts    : function() { return rosalin.FirstBreastRow().Short(); },
		rnips   : function() { return rosalin.FirstBreastRow().NipsShort(); },
		rcock      : function() { return cock.Short(); },
		rcockTip       : function() { return cock.TipShort(); },
		rcocks : function() { return rosalin.MultiCockDesc(); },
		rBallsDesc     : function() { return rosalin.BallsDesc(); },
		rvag       : function() { return rosalin.FirstVag().Short(); },
		rclit      : function() { return rosalin.FirstVag().ClitShort(); },
		ranus      : function() { return rosalin.Butt().AnalShort(); },
		rhair      : function() { return rosalin.Hair().Short(); },
		rtail      : function() { return rosalin.HasTail().Short(); },
		rlegs      : function() { return rosalin.LegsDesc(); },
		rskin      : function() { return rosalin.SkinDesc(); },
		rHipsDesc      : function() { return rosalin.HipsDesc(); },

		playername     : player.name,
		hairDesc       : function() { return player.Hair().Short(); },
		vagDesc        : function() { return player.FirstVag().Short(); },
		cock       : function() { return player.FirstCock().Short(); },
		cock2      : function() { return player.AllCocks()[1].Short(); },
		knotDesc       : function() { return player.FirstCock().KnotShort(); },
		cocks  : function() { return player.MultiCockDesc(); },
		eyeDesc        : function() { return player.EyeDesc(); },
		face           : function() { return player.FaceDesc(); },
		clothing       : function() { return player.ArmorDesc(); }
	};
	parse = rosalin.ParserPronouns(parse);

	parse["genDesc"] = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
	                   player.FirstVag() ? function() { return player.FirstVag().Short(); } :
	                   "featureless crotch";
	parse["notS"] = player.NumCocks() > 1 ? "" : "s";

	if(sexState == RosalinSexState.Rut)
		Text.Add("<i>“Like what you see?”</i> Rosalin purrs, jutting [hisher] hips your way. Your [eyeDesc]s hone in on [hisher] magnificent [rcock]. <i>“Don't you want to touch it? Lick it?”</i> ", parse);
	else
		Text.Add("<i>“Mmm... that felt nice,”</i> Rosalin almost audibly purrs. It's an incongruous sound given the [rcock] [heshe]'s sporting down south. ", parse);
	if(rosalin.HasBalls())
		Text.Add("[HisHer] [rBallsDesc] sway heavily below, almost oiled with the fine sheen of sweat the [raceDesc] has broken out in.", parse);
	else
		Text.Add("[HisHer] cleft trickles lubricants, the mons almost oiled with the fine sheen of sweat the [raceDesc] has broken out in.", parse);
	Text.NL();
	parse["ballsCunt"] = rosalin.HasBalls() ? Text.Parse("[rBallsDesc]", parse) : "cunt";
	parse["type"] = cock.race.qShort();
	Text.Add("[HeShe] cups [hisher] [ballsCunt] lewdly and hefts [hisher] [type] endowment with the other, unashamedly jacking [himher]self off in your direction, the [rcockTip] expanding ever-so-slightly under [hisher] ministration. ", parse);
	if(cock.Sheath())
		Text.Add("Rosalin sighs and digs a digit into [hisher] sheath, massaging [himher]self under the folds of concealing skin to further fuel [hisher] ardor. Gathering some of the moisture from inside, the [raceDesc] works it across [hisher] glistening shaft, moaning a little whenever [hisher] hands pass the ring of prepuce in the middle and pushing [himher]self toward greater pleasure.", parse);
	else
		Text.Add("Rosalin happily jerks off [hisher] [rcock], [hisher] hands rapidly pumping the erect shaft.", parse);
	Text.NL();
	parse["knees"] = player.LowerBodyType() != LowerBodyType.Single ? " onto your knees" : "";
	Text.Add("The view is rather erotic, and you find your own [genDesc] engorging quite speedily with untamed lust. Rosalin smiles as you draw a bit nearer, waving [hisher] cock back and forth tantalizingly, the unmistakable scent of musky pheromones rolling off [himher] in waves. You inhale before sighing. There's something about the way [heshe] smells ever since growing that cock that makes you just want to... want to... Mmm, you drop down[knees] with another blissful exhalation, making room so that you can inhale a more concentrated dose of [hisher] pheromones from up close.", parse);
	Text.NL();
	parse["boygirl"] = player.Gender() == Gender.male ? "boy" : "girl";
	if(sexState == RosalinSexState.Rut)
		Text.Add("<i>“That's right... good [boygirl]. Now hurry up, before I decide to ram this down your throat myself!”</i> The [raceDesc] alchemist huffs, panting with need, barely able to contain [himher]self.", parse);
	else
		Text.Add("Rosalin, still lost in self-pleasure, gradually becomes aware of you. <i>“Uh, [playername]. W-what are you doing down there?”</i> [HeShe] groans after a particularly powerful bolt of pleasure assails [himher]. <i>“J-just hurry up and do something!”</i> [heshe] stammers.", parse);
	Text.NL();
	Text.Add("As if you needed any encouragement. You open your maw, leaning forward to snare Rosalin's [rcockTip] with your tongue. [HisHer] urethra opens and leaks a droplet of sticky pre-cum onto your tongue. You swoon, stretching your jaw to accommodate the alchemist's girth, sinking the first four inches of [hisher] length inside you, its veins pulsating powerfully against your tongue. The [raceDesc] can barely contain [himher]self, and [hisher] [rHipsDesc] lurch forward of their own accord, pushing at least two more inches into your throat. You gurgle around the impeding mass of engorged arousal, your lips clinging tightly to the slick tool, massaging it with your mouth in order to bring the wonderfully endowed alchemist as much pleasure as possible.", parse);
	Text.NL();

	player.FuckOral(player.Mouth(), cock, 2);
	Sex.Blowjob(player, rosalin);

	parse["guygirl"] = rosalin.flags["PrefGender"] == Gender.male ? "guy" : "girl";
	Text.Add("<i>“Ohhh, ooooh!”</i> Rosalin cries, <i>“You know how to make a [guygirl] feel special!”</i>", parse);
	Text.NL();
	if(rosalin.HasBalls())
		Text.Add("You respond by gripping [hisher] [rBallsDesc] in your hand, rubbing your fingers across the cum factories to heft their mass and encourage them to produce more, rolling them in your palm.", parse);
	else if(rosalin.FirstVag())
		Text.Add("You respond by palming [hisher] [rvag], your thumb resting upon [hisher] [rclit], slowly ticking back and forth like the arm of a perverse metronome. [HisHer] juices run freely into your hand, anointing you with the warm secretions of [hisher] pleasure.", parse);
	Text.NL();
	parse["anim"] = cock.race != Race.Human ? " and animalistic" : "";
	Text.Add("The alchemist's marvellous genitalia are so potent[anim] that you unwittingly find yourself pushing forward, trying to cram [himher] further into your throat. It's difficult to resist, but you endure in order to more properly worship [hisher] wonderful tool. There will be time to deepthroat it when [heshe]'s about to climax.", parse);
	Text.NL();
	if(cock.Sheath())
		Text.Add("Slipping a hand into [hisher] sheath to tenderly hold [himher], you push yourself back, allowing [hisher] dong to slide out of your mouth, covered in your saliva. ", parse);
	Text.Add("A spurt of overly anxious jism escapes the tumescent prick, smearing neatly across your lips and chin as you shift positions.", parse);
	Text.NL();
	parse["hair"] = player.Hair().Bald() ? "onto your head" : Text.Parse("into your [hairDesc]", parse);
	Text.Add("Leaning forward, you assume a more submissive position, placing [hisher] cock upon your [face] so that you can truly enjoy the sheer size of it. Tipping your head to the side, you peer out from under it with one eye, meeting Rosalin's lust-addled, pleasure-drunk view. The [raceDesc]'s eyelids flutter closed and [hisher] mouth lolls open. [HisHer] [rcockTip] expands slightly, and a fat droplet of pre-cum oozes out [hair] as a reward.", parse);
	Text.NL();
	Text.Add("You giggle, tipping your head back, sliding your tongue along the underside with slow wet strokes, culminating in a movement that puts [hisher] flare flat against your tongue. The delicious flavor of [hisher] [rcock] assaults your tastebuds, while [hisher] odd musk inundates your nostrils, encouraging you to further depravity. You work one hand along [hisher] slippery length while sucking the pre from [hisher] cumslit, encouraging [himher] to produce more.", parse);
	Text.NL();
	if(sexState == RosalinSexState.Rut)
		Text.Add("<i>“Mmm, yes! Keep going... and maybe I'll fuck you later!”</i> Rosalin moans. ", parse);
	else
		Text.Add("Rosalin whimpers softly, <i>“Don't stop... don't even stop. Oh! It feels sooo good!”</i> ", parse);
	Text.Add("Saliva oozes from your mouth mixed with the accumulated sexual juices, hanging out of you in a few thin webs that cling to your front.", parse);
	Text.NL();
	if(player.FirstVag())
		Text.Add("Your [vagDesc] feels like a sordid swamp of depravity, soaking through the front of your outfit so that any passersby can see and smell just how turned on you've become by giving oral service.", parse);
	if(player.FirstCock()) {
		parse["itThey"] = player.NumCocks() > 1 ? "they are" : "it is";
		Text.Add("Your [cocks] tent[notS] powerfully, constrained and aching for touches. Right now, [itThey]n't the focus of your passion, instead acting as a pleasant, tactile reminder of how much you're enjoying the act of bringing Rosalin to culmination.", parse);
	}
	Text.NL();
	Text.Add("Rosalin grunts from your latest affections, a slightly more confident expression appearing on [hisher] face in between exhalations of bliss. <i>“If you like me this much like this.... I need more Equinium, don't I?”</i> You're too busy lavishing [hisher] [rcock] with adulation to respond. <i>“Would you like me to dose myself with it a few more times, maybe add some extra equine spunk to see if we can make it so potent that you get addicted to my pheromones? Or maybe just the taste of my cream? I can put it in any potions I make for you.”</i>", parse);
	Text.NL();
	Text.Add("That sounds lovely. Though being addicted might be a bit much, you're too turned on to think clearly. You show your agreement in the only way a horny, cock-addled mouth-slut can: by opening wide and sucking [himher] inside.", parse);
	if(cock.race.isRace(Race.Horse))
		Text.Add(" [HisHer] flare is getting so large that it nearly catches on your teeth, but you wrangle it in, gulping noisily as it slides into the back of your throat to keep yourself from gagging.", parse);
	Text.NL();
	Text.Add("[HisHer] rigid [rcock] is just soft and spongy enough to bend and slide into your throat, stretching you uncomfortably.", parse);
	if(cock.Sheath())
		Text.Add(" You carry on, not satisfied until [hisher] sheath is bunching up underneath your nose, sandwiched between your lips and [hisher] wonderful crotch.", parse);
	Text.NL();
	if(sexState == RosalinSexState.Rut)
		Text.Add("<i>“Ungh, yeah! Gonna fill you up with my cream, gonna pour it all down your slutty throat!”</i> Rosalin gasps, grabbing hold of your head, holding you in place as [heshe] ruts against you. <i>“Take it, take it all!”</i> ", parse);
	else
		Text.Add("<i>“Ohhhhhhhhhh,”</i> Rosalin croons as [heshe] grabs hold of your head, holding you in place. <i>“GonnacumgonnacumgonnacumOHGODI'MCUMMIIIINNNG!”</i> ", parse);
	Text.Add("[HisHer] hips shiver and thrust, sliding your body back into the wall, pinning you there as [heshe] mates with your throat", parse);
	if(cock.race.isRace(Race.Horse))
		Text.Add(", [hisher] tip expanding to form a tight seal.", parse);
	else
		Text.Add(".", parse);
	Text.NL();
	if(rosalin.HasBalls()) {
		Text.Add("The supple sack below [himher] heaves, lifting the cum-swollen balls rhythmically inside as their mass slightly diminishes, the weight going elsewhere. You squeeze it encouragingly", parse);
		if(cock.race.isRace(Race.Horse))
			Text.Add(", which makes [hisher] flare bloom even bigger.", parse);
		else
			Text.Add(".", parse);
		Text.NL();
	}
	Text.Add("You become aware of a churning in your belly and a soothing warm in the portions of your esophagus not currently occupied. The dawning realization brings a smile to your lips. The alchemist's cumming so hard and so deep that you don't even have the opportunity to taste [hisher] ejaculate.", parse);
	Text.NL();
	Text.Add("Your belly is being used as a tight cum-dump for the turned on [raceDesc], little more than a slowly filling sperm-tank. You can feel the pulsing ejaculations rippling through [hisher] length before they explode into you. Your belly is filling with strange, thick spooge, rounding with each virile insemination until you appear slightly pregnant from the sheer volume of [hisher] load.", parse);
	Text.NL();
	Text.Add("The pressure builds and builds until Rosalin realizes what [heshe]'s doing. [HeShe] stumbles away in a rush, still cumming, [hisher] [rcock] yanking out of your throat mid-spasm. Your tongue is covered in a juicy, salty trail. Your lips and [face] are splattered with spunk. Finally, Rosalin's panicked retreat carries [himher] into some alchemical equipment, causing [himher] to trip and fall onto [hisher] back, with [hisher] ass in the air and [hisher] dick unloading straight into [hisher] own face. [HeShe] groans as [heshe] lets out the last few squirts of jism, soaking [hisher] face and filling [hisher] mouth.", parse);
	Text.NL();
	Text.Add("Cradling your stuffed middle, you crawl after [himher] and begin to lick [himher] clean, putting every single drop of [hisher] cockslime straight into your burgeoning belly, where it belongs.", parse);
	Text.NL();
	if(player.FirstCock()) {
		parse["oneof"] = rosalin.NumCocks() > 1 ? " one of" : "";
		parse["itsTheyre"] = rosalin.NumCocks() > 1 ? "they're" : "it's";
		Text.Add("Rosalin takes some pity on you, grabbing hold of[oneof] your [cocks] and squeezing it through your [clothing]. You're so turned at this point that the touch of [hisher] hand is electric, so wonderful that your [cocks] feel[notS] like [itsTheyre] melting into a puddle of bliss, which is exactly what your undergarments are turning into. You cum out every drop of pent-up list, basting yourself in your own goo.", parse);
		Text.NL();
		if(player.CumOutput() > 3) {
			Text.Add("The amount you're shooting soon becomes too much for your beleaguered [clothing], and white begins to leak out of every crack and crevice until you lie in a puddle of your own spent spunk.", parse);
			Text.NL();
		}
	}
	else if(player.FirstVag()) {
		Text.Add("Rosalin takes some pity on you then, grabbing hold of your [vagDesc] and squeezing it through your [clothing]. You're so turned on at this point that the touch of [hisher] hand is electric, so wonderful that your [vagDesc] feels like it's liquefying into pure pleasure, leaking orgasmic delight all over the inside of your gear.", parse);
		Text.NL();
	}
	Text.Add("You hold each other in sexual bliss for a while, though Rosalin doesn't seem quite sure what to make of it when you nuzzle back into [hisher] groin, licking the last few drops from [hisher] [rcock]. [HeShe] clearly enjoys it, however. ", parse);
	Text.NL();
	Text.Add("An indeterminate amount of time later, you separate with a satisfied smile and a slow rub of your swollen belly, trying to ignore the way your [clothing] stick to you with every moment, alerting everyone with a nose to just how much of a sexual mess you are.", parse);

	Text.Flush();

	world.TimeStep({minute: 30});

	player.AddLustFraction(-1);

	Gui.NextPrompt();
}

RosalinScenes.VagAftermath = function() {
	Text.Clear();

	var racescore = new RaceScore(rosalin.body);
	var compScore = rosalin.origRaceScore.Compare(racescore);

	var parse = {
		raceDesc       : function() { return rosalin.raceDesc(compScore); },

		playername     : player.name,
		cock       : function() { return player.FirstCock().Short(); },
		cock2      : function() { return player.AllCocks()[1].Short(); },
		knotDesc       : function() { return player.FirstCock().KnotShort(); },
		cocks  : function() { return player.MultiCockDesc(); },
		armorDesc      : function() { return player.ArmorDesc(); },
		undressedReady : player.Armor() ? "undressed" : "ready"
	};
	parse = rosalin.ParserPronouns(parse);
	parse = rosalin.ParserTags(parse, "r");

	parse["itThem"] = player.NumCocks() > 1 ? "them" : "it";

	var cocks = player.AllCocks();
	var knots = 0;
	for(var i = 0; i < cocks.length; i++)
		if(cocks[i].knot) knots++;

	if(knots) {
		world.TimeStep({minute: 30});
		Text.Add("The two of you lie together, waiting for your [knotDesc] to shrink back to its usual size. While reclining, you playfully toy with the alchemist's body, coaxing small, tired moans from [himher].", parse);
		Text.NL();
	}

	Text.Add("You pull out, your [cocks] still dripping sticky fluids from your lovemaking.", parse);
	Text.NL();

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“S-so full,”</i> the [raceDesc] whimpers, rubbing [hisher] bloated stomach.", parse);
	}, 4.0, function() { return player.CumOutput() > 3; });
	scenes.AddEnc(function() {
		Text.Add("<i>“So good, love,”</i> Rosalin purrs, rubbing up against you.", parse);
	});
	scenes.AddEnc(function() {
		Text.Add("<i>“You feel so nice inside me.”</i> The alchemist snuggles against you, satisfied.", parse);
	});
	scenes.AddEnc(function() {
		Text.Add("<i>“Always up for a good fuck,”</i> Rosalin sighs, rubbing against you sleepily.", parse);
	});
	scenes.AddEnc(function() {
		Text.Add("<i>“Mm, thank you for the present,”</i> Rosalin purrs. Seemingly still entranced from the fucking she just received, the slut leans over to your [cocks] and meticulously licks [itThem] clean.", parse);
	});

	scenes.Get();

	Text.NL();
	Text.Add("You gather up your gear, getting ready to leave.", parse);
	Text.Flush();

	world.TimeStep({minute: 30});

	player.AddLustFraction(-1);

	Gui.NextPrompt();
}

RosalinScenes.FuckCaleWatchEntryPoint = function() {
	var parse = {

	};

	Text.Add("", parse);
	Text.NL();
	Text.Flush();

	Gui.NextPrompt();
}

export { Rosalin, RosalinScenes };
