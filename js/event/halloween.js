
//Will be used for temporary variable storage.
function Halloween() {
	// Save player/party
	this.player = player.ToStorage();
	this.party = party.ToStorage();
	// Remove all equipment/items/coin
	player.Strip();
	player.topArmorSlot = Items.Halloween.SkimpyCostume;
	player.Equip();
	party.coin = 0;
	party.inventory = new Inventory();
	// Set up temp party
	party.ClearActiveParty();
	party.SwitchIn(player);
	// Move to Halloween world
	party.location = Halloween.Loc.Tent;
	// Set up internal flags
	this.flags = 0;
	this.ronnie = Halloween.Ronnie.NotMet;
}

Halloween.Flags = {
	Elder     : 1,
	Kiai      : 2,
	Werewolf  : 4,
	Graveyard : 8,
	Chapel    : 16,
	Lenka     : 32,
	WitchHut  : 64,
	Jenna     : 128,
	Broomfuck : 256,
	PatchesPW : 512,
	Carepack  : 1024,
	Laggoth   : 2048
};
Halloween.Ronnie = {
	NotMet  : 0,
	Removed : 1,
	PCBeta  : 2,
	PCAlpha : 3
};

Halloween.PW = function() {
	return "Klaatu Barada Nikto";
}

//Note: checks real time date
Halloween.IsSeason = function() {
	// Always allow debug
	if(DEBUG) return true;
	
	// Halloween season is 14 oct - 14 nov
	var date  = new Date(); //Get current datetime
	var month = date.getMonth(); //month, 0-11
	var day   = date.getDate(); //day, 1-31
	
	if((month ==  9) && (day >= 14)) return true;
	if((month == 10) && (day <  14)) return true;
	
	return false;
}

Halloween.prototype.Restore = function() {
	// Restore player/party
	_.remove(world.EntityStorage, function(e) {
		return e == player;
	});
	player = new Player(this.player);
	world.EntityStorage.push(player);
	party = new Party(this.party);
}

Halloween.prototype.Werewolf = function() {
	return this.flags & Halloween.Flags.Werewolf;
}
Halloween.prototype.RonnieAvailable = function() {
	return this.ronnie != Halloween.Ronnie.Removed;
}

Halloween.Loc = {
	Tent : new Event("Tent?"),
	Camp : new Event("Nomads' camp?"),
	Path : new Event("Beaten path"),
	Graveyard : new Event("Graveyard"),
	Chapel : new Event("Burned chapel"),
	WitchHut : new Event("Witch's hut")
};

// gameCache.flags["HW"]
Halloween.State = { //Bitmask for globally tracked flag
	Intro : 1,
	Pie   : 2
};

Scenes.Halloween = {};

//Trigger this on stepping into the Nomads’ for the first time when season is active.
Scenes.Halloween.PieIntro = function() {
	var parse = {
		
	};
	
	Text.Clear();
	parse["day"] = world.time.LightStr("day", "evening");
	Text.Add("As you step into the nomads’ camp and pass by the fire pit, you spy the chief waving you over. The old man is surrounded by fragrant smoke, as always, but he appears unusually animated this [day] - for him, that is. You cross over to where he’s sitting, and he slaps a rough palm against an empty space on the log by his side, inviting you to take a seat.", parse);
	Text.NL();
	Text.Add("<i>“Shan’t take up much of your time,”</i> he begins. <i>“Just want you to know that we’re going to be having pumpkin pie after supper every night for the season.”</i>", parse);
	Text.NL();
	Text.Add("Is there any special reason the nomads do this?", parse);
	Text.NL();
	Text.Add("<i>“It’s an old custom they had where I came from… to have pumpkin and sweets at this time of year, often so much that you get sick of it. Pumpkin pie does both quite well, especially when you spike it a little. Well, more than a little.”</i> He grins - a rare sight. <i>“Point being, you’re more than welcome to join us - there’s a slice with your name on it if you care to show up on time.”</i>", parse);
	Text.NL();
	Text.Add("That’s very kind of him. You’ll consider taking him up on his offer.", parse);
	Text.NL();
	Text.Add("<i>“Good.”</i> The chief draws on his pipe, and blows out a long plume of smoke. <i>“We all get sick of it by the end of the season, but it’s not proper to waste perfectly good food, you know? Considering the size of our pumpkin patch, another mouth to feed is actually welcome at this point. Remember: turn up around dinnertime. Too early or too late, and there’ll be no pie for you.”</i>", parse);
	Text.NL();
	Text.Add("Okay, okay, you’ll show up on time. Anything else?", parse);
	Text.NL();
	parse["p"] = Scenes.Global.PortalsOpen() ? "Don’t forget our deal" : "Good luck getting that rock of yours working";
	Text.Add("<i>“No. [p].”</i> With that, the chief turns his attention back to the fire. There’s nothing else for you here, so you get up and head off into the camp.", parse);
	Text.Flush();
	
	gameCache.flags["HW"] |= Halloween.State.Intro;
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

//#add “pie” option to nomads’ camp from 17-22 pm when Halloween season/debug is active.
world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	"Pumpkin Pie", function() {
		if(!(gameCache.flags["HW"] & Halloween.State.Intro)) return false;
		// Correct time of day
		if((world.time.hour < 17) || (world.time.hour >= 22)) return false;
		
		return Halloween.IsSeason();
	}, true,
	null,
	function() {
		Scenes.Halloween.PumpkinPie();
	}
));

Scenes.Halloween.PumpkinPie = function() {
	var parse = {
		playername : player.name
	};
	
	var first = !(gameCache.flags["HW"] & Halloween.State.Pie);
	gameCache.flags["HW"] |= Halloween.State.Pie;
	
	parse["Momo"] = momo.AtCamp() ? "Momo" :
		cale.Met() ? "Cale" : "A wolf morph";
	parse["Momo2"] = momo.AtCamp() ? "Momo" :
		cale.Met() ? "Cale" : "the wolf";
	parse["hisher"] = momo.AtCamp() ? "her" : "his";
	
	var p1 = party.Get(1);
	parse["comp"] = party.Num() == 2 ? p1.name : "your companions";
	
	Text.Clear();
	if(first) {
		Text.Add("You’re about to head into the nomads’ when the delicious scent of baked treats wafts over to you, sweet and enticing. Yep, like the chief said - that’s definitely the smell of pumpkin pie - warm honey, baked flour, melted butter and thick pumpkin all mixed together in a delectable aroma, topped with… whatever it is that they’ve spiked the pie filling with. It’s enough to make one’s mouth water, and you find yourself drawn by some inexorable magnetism towards the source of the scent.", parse);
		Text.NL();
		Text.Add("As it turns out, that happens to be a small brick oven which has been set up near the fire pit in the middle of camp. [Momo] is bent over the thing, pulling out a trio of pies from its innards - already, two sit atop the oven cooling while the last one is in [hisher] hands. Each one bears thick, crumbly crust; orange-golden filling, a perfectly smooth, tantalizing surface… that, and each one is absolutely massive. Chief wasn’t lying when he said that you were more than welcome to have a slice - there’s definitely more than enough for every single one of the nomads to have some and still run the risk of ending up with leftovers.", parse);
		Text.NL();
		Text.Add("<i>“Come to join us, youngster?”</i>", parse);
		Text.NL();
		Text.Add("You turn to find the chief standing beside you, leaning on a cane he’s procured from somewhere. At least he doesn’t have his pipe on him for once - hard to eat and smoke at the same time, after all.", parse);
		Text.NL();
		Text.Add("Yes, it simply smelled so good that you had to come down and take a look.", parse);
		Text.NL();
		Text.Add("<i>“Don’t worry, you’ll get to hate it after weeks of the stuff. Enjoy it while it lasts.”</i>", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("With that, he wanders off in the direction of the fire pit, cane tapping against the ground in time with his steps. What a sourpuss - you’re more than willing to turn your attention back to the gigantic pies. Apparently, you’re not the only one who’s been drawn by the inviting scent; the entire population of the camp is slowly but surely converging on your position, lured by the promise of pie.", parse);
			Text.NL();
			Text.Add("<i>“Sorry there isn’t any cream to finish it off with,”</i> [Momo2] says, dropping the last pie on the oven’s top with a solid thunk from the tray. <i>“We’re a bit short on that.”</i>", parse);
			Text.NL();
			Text.Add("Nah, it smells like it’s good enough to shovel into your face by the spoonful, cream or no.", parse);
			Text.NL();
			parse["Rosalin"] = rosalin.Met() ? "Rosalin" : "The camp's resident catgirl";
			Text.Add("[Rosalin] huffs and rubs her still-aching limbs. <i>“I still don’t see why everyone tied me up this afternoon.”</i>", parse);
			Text.NL();
			parse["Estevan"] = estevan.Met() ? "Estevan" : "the satyr";
			Text.Add("<i>“Because you wanted to help with the baking,”</i> [Estevan] replies with a sigh.", parse);
			Text.NL();
			Text.Add("<i>“But I had my special frosting all ready to go!”</i>", parse);
			Text.NL();
			Text.Add("<i>“That’s <b>exactly</b> why we had to do it. We’d like to enjoy some pie without ending up with six arms and three legs by the end of the night.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Will you youngsters pipe down!”</i> In comes the chief, the crowd automatically parting to admit his wrinkled presence. <i>“Gets so that an old man can’t hear himself think… well, looks like everyone’s here. No reason to delay it any longer - Estevan, if you’d please?”</i>", parse);
			Text.NL();
			Text.Add("The satyr nods, and slowly draws a hunting knife from his belt, handing it to the chief hilt-first. The chief grasps it with a firm grip, then steps towards the oven where the trio of pies await appraisal.", parse);
			Text.NL();
			Text.Add("<i>“Fork, please.”</i>", parse);
			Text.NL();
			Text.Add("Someone - you don’t see who - hands him one, and he reaches down with the knife, cutting through crust and filling with agonizing slowness and precision. Spearing the resultant morsel with his fork and lifting it to his mouth, the chief chews thoughtfully.", parse);
			Text.NL();
			parse["cook"] = momo.AtCamp() ? " Taking you on as a cook was one of the better decisions I’ve made in my time." : "";
			Text.Add("<i>“Hmm. Decent.”</i> He spoons another forkful of crust and pumpkin filling into his mouth, careful not to get any on his beard. <i>“No, in fact, I’ll say it’s pretty good.[cook]”</i>", parse);
			Text.NL();
			parse["Estevan"] = estevan.Met() ? "Estevan" : "The satyr";
			Text.Add("[Estevan] chuckles. <i>“Shucks, that’s high praise coming from him, but I guess it was expected. Good ingredients, good cook… the outcome was never truly in doubt. A good pie.”</i>", parse);
			Text.NL();
			Text.Add("With a nod and grin, the chief brandishes both knife and fork. <i>“Very well. Come and get it, you youngsters! I can’t eat all of this on my own at my age, you know.”</i>", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("Not that anyone needs any more telling. Cale comes up with a stack of cheap-looking plates, and everyone lines up for their slice of the massive pies. The chief takes great relish in serving up delicious cuts of crust and filling, and if anyone’s portion is bigger than anyone else’s, no one complains.", parse);
				Text.NL();
				parse["Magnus"] = magnus.Met() ? "Magnus munches away, the young magician" : "a young, nerdy looking man pipes up. He doesn't seem to have any reservations about it it though, as he's";
				Text.Add("<i>“So let me get this straight. We’re going to be having this every evening for weeks on end?”</i> [Magnus] stuffing his face at a rate which gives hope that he’ll actually put some meat on that scrawny frame of his. A few crumbs have landed on his glasses, and he removes them momentarily to flick off the offending scraps.", parse);
				Text.NL();
				parse["Cale"] = cale.Met() ? "Cale" : "The wolf";
				Text.Add("[Cale] nods. <i>“That’s right. Although it’s expected that everyone will be taking turns baking, so someone’ll have to teach you to do it. You need to spend at least a little time away from those books of yours.”</i>", parse);
				Text.NL();
				parse["Magnus"] = magnus.Met() ? "Magnus" : "The bookish man";
				parse["mage"] = magnus.Met() ? "mage" : "man";
				Text.Add("[Magnus] looks a little unsure at the prospect, but the pull of pumpkin pie is enough to overcome the young [mage]’s reservations about working with his hands. <i>“I suppose. Practical experience is just another way of learning.”</i>", parse);
				Text.NL();
				parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
				parse["c2"] = party.Num() == 2 ? " both" :
					party.Num() > 2 ? " all" : "";
				Text.Add("Eventually, the line moves ahead to the point where you[c] are up next, and you[c2] get served a slice of the delectable dessert. Still warm to the touch, the slice you’ve been served beckons, its wedge-shaped form fitting easily into the palm of your hand.", parse);
				Text.NL();
				Text.Add("Mmm, tasty.", parse);
				Text.NL();
				Text.Add("Seeing as how everyone’s enjoying delicious pumpkin pie, there’s no reason for you to miss out on the fun, too! Gleefully, you open your jaws as wide as possible and cram as much of the delicious treat as you can into your mouth, leaving barely enough room left over for you to chew. The wonderful flavors of pumpkin and caramelized honey dance upon your tongue with just the right texture, and enjoying it with everyone about you only makes it taste better. Sure, the filling might have burnt your tongue a little with how well it’s kept warm and how quickly you’ve wolfed it down, but it was worth it, there’s no question of that.", parse);
				Text.NL();
				if(party.InParty(kiakai, true)) {
					parse["name"] = kiakai.name;
					Text.Add("<i>“Rather… ah, heavy,”</i> [name] notes, holding back a hiccup. <i>“It was delicious though, do you not agree, [playername]?”</i>", parse);
					Text.NL();
				}
				if(party.InParty(miranda, true)) {
					Text.Add("<i>“This stuff’s good!”</i> Miranda exclaims, licking her lips clean of pie crust. <i>“Any chance for seconds?”</i>", parse);
					Text.NL();
				}
				if(party.InParty(gwendy, true)) {
					Text.Add("<i>“Huh, maybe I should plant a patch back home,”</i> Gwendy ponders, chewing thoughtfully. <i>“I can see turning a fine profit from this!”</i>", parse);
					Text.NL();
				}
				if(party.InParty(layla, true)) {
					Text.Add("You glance at Layla and ask her if she’s enjoying the pie.", parse);
					Text.NL();
					Text.Add("She nods emphatically. <i>“Ish vewy gwood.”</i>", parse);
					Text.NL();
					if(party.InParty(gwendy, true)) {
						Text.Add("<i>“Layla, don’t talk with your mouth full,”</i> Gwendy interjects.", parse);
						Text.NL();
						Text.Add("<i>“Sowwy!”</i> the chimera replies.", parse);
						Text.NL();
					}
				}
				if(party.InParty(terry, true)) {
					Text.Add("<i>“This ain’t too bad. Could get used to eating this every once in a while,”</i> Terry says, taking another bite.", parse);
					Text.NL();
				}
				/* TODO
				if(party.InParty(mayflower, true)) {
					Text.Add("<i>“I’ll pass, thank you,”</i> Mayflower says, pushing away a slice. <i>“Not a fan of pumpkin.”</i>", parse);
					Text.NL();
				}
				if(party.InParty(ezra, true)) {
					Text.Add("<i>“Hmm, delicious!”</i> Ezra says, chewing down a mouthful. <i>“Maybe I should keep some for the children back at the orphanage.”</i>", parse);
					Text.NL();
				}
				if(party.InParty(jin, true)) {
					Text.Add("<i>“It’s heavy,”</i> Jin says flatly. Despite her complaint, she doesn’t stop eating…", parse);
					Text.NL();
					Text.Add("<i>“What?”</i> she asks, looking annoyed at your scrutiny.", parse);
					Text.NL();
					Text.Add("Part of you feels like you should point out that if she doesn’t like it, she shouldn’t continue eating it… but on second thought, it’s best not to.", parse);
					Text.NL();
				}
				*/
				Text.Add("However light and fluffy the pie might be on your tongue, though, it sits in your stomach like a leaden weight, and whatever the nomads spiked the filling with didn’t help very much, either. By your third slice of pie, you’re feeling pleasantly warm and full inside, and more than a little drowsy. Sleep is sounding more and more like a good idea, and your overburdened stomach agrees…", parse);
				Text.NL();
				parse["c"] = party.Num() > 1 ? Text.Parse(" [comp] and", parse) : "";
				Text.Add("Although there’s still plenty of life in the party, there <i>are</i> a few who’ve slipped off to sleep off the heavy meal, so you feel no shame in deciding to call it a night. Saying goodbye to[c] the nomads still up and about, you stumble in an approximate beeline for your tent, and are asleep before you even hit the bedroll.", parse);
				Text.Flush();
				
				world.TimeStep({hour: 1});
				
				Gui.NextPrompt(function() {
					Scenes.Halloween.EnterDream(true);
				});
			});
		});
	}
	else {
		Text.Add("Mmm, is that pumpkin pie you smell baking? Why yes, it is - down by the fire pit is the familiar sight of the brick oven, a steady plume of smoke rising from it as ", parse);
		
		var scenes = new EncounterTable();
		
		scenes.AddEnc(function() {
			parse["Magnus"] = magnus.Met() ? "Magnus" : "the scrawny young man";
			parse["Cale"] = cale.Met() ? "Cale" : "the wolf morph";
			Text.Add("[Magnus] tends to the flames under [Cale]’s watchful eye.", parse);
			Text.NL();
			Text.Add("<i>“I still don’t see why I can’t use magic. It would be so much easier to heat the oven that way.”</i>", parse);
			Text.NL();
			Text.Add("<i>“And as I’ve told you so many times, It’s not just the heat and ingredients, but the wood smoke that imparts a certain flavor and aroma to the pie. There’s a reason we do things a certain way, so you can just follow what I say for now.”</i>", parse);
			Text.NL();
			parse["Magnus"] = magnus.Met() ? "Magnus" : "the young man";
			Text.Add("Yes, seems like [Magnus] is clearly still quite unused to working with his hands.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			parse["Estevan"] = estevan.Met() ? "Estevan" : "the satyr hunter";
			Text.Add("[Estevan] looks over his handiwork. Judging by the number of empty bottles lying by the oven’s side, you can only hope that the satyr hasn’t put <i>all</i> of that into the pies…", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("the nomad chief paces back and forth in front of the oven with surprising alacrity for a man his age. He doesn’t look at the oven, but every so often he stops and sniffs the air, testing it with his nose.", parse);
			Text.NL();
			Text.Add("Clearly an old hand at this business, if he can tell when the pies are done by smell alone.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			parse["Patchwork"] = patchwork.Met() ? "Patchwork" : "the odd merchant";
			parse["Patches"] = patchwork.Met() ? "Patches" : "the merchant";
			Text.Add("[Patchwork] watches over the baking pies through that strange telescope. Shrouded in all that heavy clothing, doesn’t [Patches] feel hot at all? How’s the crust and filling made without getting all that cloth dirty, anyway? How are the pies handled with no obvious hands with which to do the handling?", parse);
			Text.NL();
			Text.Add("The world may never know.", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
		
		Text.NL();
		Text.Add("Such thoughts, though, are wiped from your mind when the warm scent of delicious pumpkin pie’s carried to you on the wind, replaced by memories of that delicious taste and sense of satiation.", parse);
		Text.NL();
		parse["hishers"] = p1 ? p1.hishers() : "theirs";
		parse["c"] = party.Num() > 1 ? Text.Parse(", [comp] soon receiving [hishers] as well", parse) : "";
		
		Text.Add("Don’t mind if you do, then! With your opportune moment of arrival, you soon find yourself at the head of a rapidly growing line, and are served your wonderful pie[c]. It’s every bit as wonderful as you remember it being, and soon enough, you feel the strong liquor in the pie filling beginning to take effect. Nevertheless, you manage to down two more slices, and then wobble off to your tent, clutching at your stuffed stomach. You’ll just sleep off this food coma in a bit… ", parse);
		Text.Flush();
		
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt(function() {
			Scenes.Halloween.EnterDream(false);
		});
	}
}

Scenes.Halloween.EnterDream = function(first) {
	var parse = {
		skin : player.SkinDesc()
	};
	
	Scenes.Halloween.HW = new Halloween();
	
	Text.Clear();
	if(first) {
		Text.Add("Ugh. Where are you? Right, you had some pumpkin pie and went back to your tent for a lie-down…", parse);
		Text.NL();
		Text.Add("Groaning, you flick open your eyes. How long have you been out? They sure put a lot of wine into that pie filling, it feels like… the inside of your mouth tastes like dry fur, and there’s a difference in the air. Hmm, it’s chillier than you expected…", parse);
		Text.NL();
		Text.Add("…And you realize that you’re stark naked.", parse);
		Text.NL();
		parse["fem"] = player.Gender() == Gender.male ? "thong" : "bra and panties";
		Text.Add("Hey, did you do something you’ll regret later? Where’s everyone? Usually there’s always some kind of bustle in the nomads’ camp, but all you get from beyond the canvas confines of your tent is deathly silence. And why’s there this skimpy-looking costume lying on the ground beside you? Shrugging, you pick it up - looks like a leather [fem] and a tattered cloak, all in garish shades of black. You must’ve gotten into some real kinky stuff last night… just what’s going on here?", parse);
		Text.NL();
		Text.Add("Taking a deep breath and squaring your shoulders, you peer out of the tent flaps, and blink at the scene that meets your eyes. It’s still the nomad’s camp after a fashion, it’s just that… well, everything is spookier, for lack of a better word to describe it. The light of the fire pit is still visible in the distance against a thick carpet of milky-white fog, maybe that should be your first stop once you get started.", parse);
		Text.NL();
		Text.Add("Maybe you’ll stay in here a little while longer, though. Gather yourself, maybe get dressed before venturing out into whatever you’ve managed to land yourself in this time…", parse);
	}
	else {
		Text.Add("You open your eyes and have a distinct sense of déjà vu. There’s something familiar about this tent that you can’t quite place, about the strange sense of weightiness that pervades the air, but you can’t quite figure out what. A draft of chill air dances in from the tent flaps and caresses your [skin], and you realize that you’re stark naked.", parse);
		Text.NL();
		Text.Add("Well, good thing that someone’s left some clothes here, even if they look more like pieces of a costume, rather than any practical clothing. Shrugging, you grab them from the ground where they lie - <i>some</i> clothing’s better than no clothing at beating the cold, at any rate.", parse);
		Text.NL();
		Text.Add("Time to head out and face what lies beyond…", parse);
	}
	Text.Flush();
	
	Gui.NextPrompt();
}


Halloween.Loc.Tent.description = function() {
	Text.Add("The interior of the tent is dim, with a few rays of moonlight reaching inside through the tattered canvas. Various pots, pans and other cooking utensils are packed away in an open wooden chest draped in spiderwebs. There is little actual furniture besides that; a few rugs rolled out to protect bare feet and a set of bed rolls are free for you to use. Everything has a tattered and frayed look to it.");
}

Halloween.Loc.Tent.links.push(new Link(
	"Outside", true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.Camp);
	}
));

Halloween.Loc.Camp.description = function() {
	Text.Add("The small gathering of tents look very much like the nomads’ camp, but something is off. It’s hard to see for all the milky fog around, but from time to time, you can see the full moon poking out in the midnight sky. Long grass rustles in a gentle, silent breeze that also sends the leaves on the twisted, gnarled trees aflutter.");
	Text.NL();
	Text.Add("A dark hooded shape is huddled by the smoldering ashes of the fire pit, but aside from that, the camp seems deserted. The tent you woke up in is nearby, though you doubt you’d be able to go back to sleep.");
	Text.NL();
	Text.Add("In the distance, you hear the howling of a wolf. You can’t shake the feeling that you’re being watched.");
}

Halloween.Loc.Camp.links.push(new Link(
	"Tent", true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.Tent);
	}
));

Halloween.Loc.Camp.links.push(new Link(
	"Path", true, true,
	null,
	function() {
		if(Scenes.Halloween.HW.flags & Halloween.Flags.Elder)
			MoveToLocation(Halloween.Loc.Path);
		else {
			Text.Clear();
			Text.Add("The night is cold and dark, and you dare not leave the camp without a light.");
			Text.Flush();
			
			Gui.NextPrompt();
		}
	}
));

Halloween.Loc.Camp.events.push(new Link(
	function() {
		if(Scenes.Halloween.HW.flags & Halloween.Flags.Elder)
			return "Elder";
		else
			return "Figure";
	}, true, true,
	null,
	function() {
		var parse = {
			
		};
		
		var first = !(Scenes.Halloween.HW.flags & Halloween.Flags.Elder);
		Scenes.Halloween.HW.flags |= Halloween.Flags.Elder;
		
		Text.Clear();
		if(first) {
			Text.Add("Your eyes still adjusting to the dim light and head still pounding, you stagger towards the fire pit. There’s something familiar about the figure seated on the log, poking at the embers of the dying fire with a cane.", parse);
			Text.NL();
			Text.Add("As you approach, the figure slowly turns to look at you, and a dry, raspy voice sounds from under the hood.", parse);
			Text.NL();
			Text.Add("<i>“Hello, my friend! Stay awhile and listen.”</i>", parse);
			Text.NL();
			Text.Add("Poor fellow sounds like he could use a drink, but he seems friendly enough. Presented with so obvious an invitation, you greet him and ask him who he is.", parse);
			Text.NL();
			Text.Add("<i>“I don’t have a name, young one, but you may call me... Elder. I’m the last remnant of this camp.”</i> He motions to the abandoned tents around you. <i>“And I’m afraid I don’t have much to offer, save for advice from an old man, and what little hospitality I can muster.”</i>", parse);
			Text.NL();
			Text.Add("You thank him for his hospitality, and make yourself comfortable on the log beside him. Once you have settled down, the hooded figure speaks again.", parse);
			Text.NL();
			Text.Add("<i>“Tell me, young one. You look new about these parts, how did you to come by this camp?”</i>", parse);
			Text.NL();
			Text.Add("Well, it’s strange; you just woke up in that tent over there a few moments ago. But you swear that when you went to sleep, you were somewhere else entirely.", parse);
			Text.NL();
			Text.Add("The Elder chuckles. <i>“Then perhaps you haven’t left at all.”</i>", parse);
			Text.NL();
			Text.Add("What’s that supposed to mean?", parse);
			Text.NL();
			Text.Add("<i>“What I’m saying, young one, is that there are many ways one can perceive reality, and perhaps that’s what happened to you. Maybe you haven’t moved at all, maybe you’re still where you belong, but right now you’re just seeing it from a different angle.”</i>", parse);
			Text.NL();
			Text.Add("…Okay…", parse);
			Text.NL();
			Text.Add("<i>“Of course, I suppose that doesn’t help you feeling lost and out of place…”</i> he trails off.", parse);
			Text.NL();
			Text.Add("Not really, no. Can he tell you anything about this place? Where you can go from here?", parse);
			Text.NL();
			Text.Add("<i>“I’m afraid there isn’t much I can say about this place, young one. As old as I am, I have only been outside this camp a handful of times.”</i>", parse);
			Text.NL();
			Text.Add("You see… still, if he can tell you anything, that would be much appreciated. You have to try and find a way back where you belong.", parse);
			Text.NL();
			Text.Add("<i>“There is a legend that says that the ravens flock together where reality is at its weakest. Perhaps if you’re trying to go home, it would be worth a shot trying to find this place.”</i>", parse);
			Text.NL();
			Text.Add("So, look for the ravens? Well, that’s a better lead than you had before. You offer the Elder your sincere thanks for his help, and then rise from your seat, ready to set off in search of the ravens.", parse);
			Text.NL();
			Text.Add("<i>“Hold up, young one. I would accompany you in your journey, but I’m afraid I would only slow you down… still, it’s dangerous to go alone. Take this,”</i> he says, handing you an old iron lantern.", parse);
			Text.NL();
			Text.Add("Gratefully, you reach out and take the old, heavy, blackened lantern by its iron ring. Its weight is noticeable in your grip, solid and reassuring.", parse);
			Text.NL();
			Text.Add("<i>“This lantern will guide you through this misty night. It’s not much, but it’s better than nothing. And you should also take this.”</i> He procures a small box from underneath his robes.", parse);
			Text.NL();
			Text.Add("<i>“This is an old relic passed down in my family; it’s a special stake meant to vanquish evil. Word is that this stake is a weapon blessed with the blood of a virgin before she ascended to godhood.”</i>", parse);
			Text.NL();
			Text.Add("That sounds useful indeed. You thank the elder for his generosity, even as you reach out to open the latches. When you lift the box’s lid, though, what’s inside looks nothing like the stake you were expecting. It’s a large, intricately polished dildo, made from dark red rubber. It’s so realistic that for a moment you would swear it was a real disembodied cock.", parse);
			Text.NL();
			Text.Add("Bemused, you take the ‘stake’ from its box, turning it over in your hands, and show it to the Elder.", parse);
			Text.NL();
			Text.Add("<i>“May it keep you safe in your journey, young one.”</i>", parse);
			Text.NL();
			Text.Add("For a moment, you wonder if the Elder is playing some kind of joke on you, but he seems so sincere. You can’t really do anything but shrug your shoulders and play along, so you thank him again and stow the dildo away. With lantern and ‘stake’ now in your possession, you ask the Elder if he can give you any more advice before you go hunting for the ravens.", parse);
			Text.NL();
			Text.Add("<i>“An old friend of mine might be able to help you more. She lives in a hut out in the woods, and is a bit eccentric, but she’s a good person. Perhaps you should try visiting her?”</i>", parse);
			Text.NL();
			Text.Add("You thank him for all the help he’s given you. It looks like it’s time you started looking for those ravens. Lantern clutched tightly in your hand, you start to walk away from the campfire.", parse);
			Text.NL();
			Text.Add("<i>“Remember, I know of many myths and legends that may contain answers to questions that may arise in your journeys. If you come across challenges and questions to which you desire knowledge, seek me out and I will tell you what I can. Stay safe, young one.”</i> And with that, he returns to tending to the dying embers of the campfire.", parse);
			
			party.Inv().AddItem(Items.Halloween.Lantern);
			party.Inv().AddItem(Items.Halloween.Stake);
		}
		else {
			Text.Add("Crouching down so that you’re on level with the robed figure, you ask if he’s any advice to dispense forthwith. He thinks a moment, then replies:", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>“Sometimes, skill and quick thinking may not be enough. At times, you may require specialized equipment to deal with the dangers of this land, or maybe you just need to be lucky.”</i> The Elder chuckles.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Do not stray from the path in the woods; there are bestial monsters which dwell amongst the trees. That which may seem to be is often not. It may be possible to turn a curse upon itself.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Remember, the ravens will lead you into the light. Follow them if you tire of this place.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“One should always beware of one’s own creations. The phrase ‘Stop now! I am your master and you must obey me!’ has been the last words of many a fool.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Remember, if you ever find yourself in a bind, it may be helpful to open as many options as possible beforehand so you have space to maneuver. Forewarned is forearmed, but forethought is far better.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Sometimes, honesty and innocence is the best policy. There are those who bank on your suspicion to trick you into behaving exactly as they would like you to. Remain one step ahead as always.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Demons are powerful creatures, and as such going up against one directly is a fool’s errand. However, they all have a point of weakness somewhere in their persona… deducing that weakness and exploiting it to its fullest is key, perhaps even the only way to defeating them.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“As I mentioned earlier, there is an elven witch who lives in a hut in the woods who may or may not help you in your quest. Even though she is my friend, she is quite the temperamental creature, and deciding whether to trust her can be a good idea or not, considering how fickle she is…”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“The rank and file of the undead are really slow-witted, I hear. I know of some creatures that believe you can’t see them if they can’t see you, but they believe that they can’t see you if you can’t see them! I know it sounds rather absurd, but truth is stranger than fiction.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“There is a kindly alchemist who lives in an old house up on a hill. If you are in need of it, she may lend you shelter for the night. Her abode may be menacing in appearance, but I’m sure it’s completely safe.”</i>", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
		}
		Text.Flush();
		
		Gui.NextPrompt();
	}
));

Halloween.Loc.Path.description = function() {
	var parse = {
		feet : player.FeetDesc()
	};
	
	Text.Add("This dry, dusty path winds its way through the trees, twisting and turning under gnarled branches and over knobbly roots as it leads… well, somewhere. You’re not quite sure <i>exactly</i> where, but your [feet] seem to have taken on a life of their own, ferrying you down the path to your fate. Come to think of it, you’re not even sure where all the trees came from - they just seem to have sprung up all of a sudden to block out as much moonlight as they can with their twisted, thinly-leafed branches.", parse);
	Text.NL();
	Text.Add("Off in the distance, you hear a raven caw, and a faint sigh echoes through the sickly forest. Still, you press on, and eventually the trees and thorny undergrowth thin a little as you near a crossroads, one with many, many paths branching out from its heart like the spokes of a wheel. From here, you can also make out some landmarks in the distance - perhaps you’re meant to be headed to one of these?", parse);
}

Halloween.Loc.Path.onEntry = function() {
	if(Scenes.Halloween.HW.RonnieAvailable() && Math.random() < 0.5)
		Scenes.Halloween.Ronnie();
	else
		PrintDefaultOptions();
}

Halloween.Loc.Path.links.push(new Link(
	"Camp", true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.Camp);
	}
));
Halloween.Loc.Path.links.push(new Link(
	function() {
		return Scenes.Halloween.HW.flags & Halloween.Flags.WitchHut ? "Witch's hut" : "Hut?";
	}, true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.WitchHut);
	}
));
Halloween.Loc.Path.links.push(new Link(
	"Graveyard", true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.Graveyard);
	}
));

Halloween.Loc.Path.events.push(new Link(
	"Beta", function() {
		return Scenes.Halloween.HW.ronnie == Halloween.Ronnie.PCAlpha;
	}, true,
	null,
	function() {
		var parse = {
			
		};
		parse = player.ParserTags(parse);
		
		Text.Clear();
		Text.Add("Feeling the urge for your beta’s attendance, you throw back your head and utter a piercing howl, which echoes off into the wilderness. Your ears prick up, listening intently, and a few moments later you are rewarded by a softer howl of acknowledgement.", parse);
		Text.NL();
		Text.Add("You fold your arms across your chest and wait patiently. Within a minute or less, excited barking and a chorus of cracking branches and rustling undergrowth heralds the arrival of Ronnie. Your cute little white-furred beta bounds into the road and skids to a halt in the dust at your feet, panting lightly as he looks up at you with expectant eyes.", parse);
		Text.NL();
		Text.Add("Of course, now that you have him... what do you want to do with him?", parse);
		Text.Flush();
		
		//[Fuck][Dismiss]
		var options = new Array();
		options.push({ nameStr : "Fuck",
			tooltip : "Time to scratch an itch.",
			func : function() {
				Text.Clear();
				Text.Add("Grinning lustfully, you present your half-erect cock to your beta, gesturing towards it.", parse);
				Text.NL();
				Text.Add("Ronnie wags his tail and barks his acknowledgement. He strides forth to sniff your male musk, reveling in the scent for a moment before he licks his lips and gets to work.", parse);
				Text.NL();
				Text.Add("He starts by lapping your balls, moistening each orb as he lets your shaft drape across his muzzle.", parse);
				Text.NL();
				Text.Add("You moan appreciatively, feeling your lupine cock jump at his touch. Growling softly, you reach down and scratch his ears, eager to see what he’ll do next.", parse);
				Text.NL();
				Text.Add("Sensing your approval, he moves onto your [cock], first licking the base where your knot still has to fully form, then lapping his way up your shaft until the tip.", parse);
				Text.NL();
				Text.Add("Your breath comes in short, sharp pants as he works, pleasure slowly growing as his tongue coats your cock in warm saliva, making the slightest breeze tickle you wonderfully.", parse);
				Text.NL();
				Text.Add("He focuses on your pointed tip, circling your cumvein and lapping any dollops of pre that form. His panting breath washes over your member, getting increasingly more erratic as he draws nearer, until you feel his lips gently close around your cock.", parse);
				Text.NL();
				Text.Add("You hiss softly, feeling yourself growing almost painfully hard. Your muscles flex and tense as Ronnie suckles at your cock, slowly bobbing his head back and forth along your length. When your whole body starts to tremble with pleasure, you finally act.", parse);
				Text.NL();
				Text.Add("Reaching down, you gently but firmly push Ronnie free of your dick. The bemused beta looks up at you, a strand of glistening saliva still linking his bottom lip to your cocktip, but you have your reasons. With a few commanding barks and some gestures, you indicate for him to get into position, like a good little bitch.", parse);
				Text.NL();
				Text.Add("Ronnie wags his tail and barks his acknowledgement, turning around to present you with his rear and raising it as high as he can.", parse);
				Text.NL();
				Text.Add("Such a good boy. Your fingers run down his spine, affectionately scratching him, and grinning as he shudders like a pet dog at your touch. You grab his girlish, wide hips and kneel behind him, letting your [cock] rest on his taint.", parse);
				Text.NL();
				Text.Add("Ronnie’s tail wags as he grinds back at you, eager to be of use to his alpha like the good boy-slut he is.", parse);
				Text.NL();
				
				Scenes.Halloween.RonniePitch();
			}, enabled : true
		});
		options.push({ nameStr : "Dismiss",
			tooltip : "You don’t actually need him. Give him a pat and then send him off again.",
			func : function() {
				Text.Clear();
				Text.Add("You reach down and playfully tussle Ronnie’s ears, the beta werewolf groaning luxuriantly as you pet his head. Graciously, you allow Ronnie a chance to catch his breath, leisurely petting and stroking him until he’s calmed down, and then indicate the woods, telling him that he’s free to go.", parse);
				Text.NL();
				Text.Add("Ronnie barks in acknowledgement, wagging his tail as he turns and heads out into the woods.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
));

Scenes.Halloween.Ronnie = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("This dry, dusty path winds its way through the trees, twisting and turning under gnarled branches and over knobbly roots as it leads… well, somewhere. You’re not quite sure <i>exactly</i> where, but your [feet] seem to have taken on a life of their own, ferrying you down the path to your fate. Come to think of it, you’re not even sure where all the trees came from - they just seem to have sprung up all of a sudden to block out as much moonlight as they can with their twisted, thinly-leafed branches.", parse);
	// Check out what's going on with Ronnie and select correct path
	var first = Scenes.Halloween.HW.ronnie == Halloween.Ronnie.NotMet;
	
	if(first) {
		Scenes.Halloween.RonnieFirst();
	}
	else if(Scenes.Halloween.HW.ronnie == Halloween.Ronnie.PCBeta) {
		Text.Add("Your ears perk up as a familiar sound echoes to you out of the wilderness; your cute little alpha is calling to you! Unable to resist his need for you, you howl back to let him know that you heard, and then lope off into the wilderness to find him.", parse);
		Text.NL();
		Text.Add("It doesn’t take long for you to find Ronnie, the white werewolf waiting impatiently in a small glade. He gives you a bared-teeth grin, and you obediently kneel before him in submission, getting down on all fours.", parse);
		Text.NL();
		Text.Add("Your alpha walks over, gently scratching you behind the ears as he drops on fours himself, circling you to sniff and nose your butt.", parse);
		Text.NL();
		Text.Add("You growl contentedly as he scratches that little itch, and can’t help but shake your [butt] in his face as Ronnie sniffs your butt. You know this is just a little foreplay; he’s going to fuck your ass like an alpha, regardless of how you might feel on the matter.", parse);
		Text.NL();
		Text.Add("Still, you can’t escape the thought that it doesn’t have to be this way. You’re bigger, stronger and faster than he is. If you wanted to, you could easily overthrow him, take over as alpha. It is a rather tempting thought.", parse);
		Text.NL();
		parse["v"] = player.FirstVag() ? " and glossing over your cunt" : "";
		Text.Add("A yip escapes your lips as Ronnie’s warm, wet tongue slathers a wad of spittle over your asscrack, slurping up your taint[v] before it starts to drill its way into your [anus]. Even if you were of a mind to stop him, Ronnie’s too good at this, giving you a thorough coating of natural lube both inside and out.", parse);
		Text.NL();
		Text.Add("Satisfied with his work, Ronnie mounts you, grabbing your hips and pulling you against him as he leans over your back, pointy cock-tip nested on your [anus].", parse);
		Text.NL();
		Text.Add("As he starts to grind, teasing your opening, you realize that if you were of a mind to take charge, now would be the moment to strike...", parse);
		Text.Flush();
		
		//[Fight!][Submit!]
		var options = new Array();
		options.push({ nameStr : "Submit!",
			tooltip : "Let alpha Ronnie fuck your ass!",
			func : function() {
				Text.Clear();
				Text.Add("With a soft, lupine churr, you eagerly grind your ass back against Ronnie’s teasing cock. You’re happy here, as Ronnie’s beta, and right now, you want your ass full of his magnificent shaft.", parse);
				if(player.PregHandler().MPregEnabled())
					Text.Add(" The thought of presenting your alpha with your belly bulging full of his pups makes a warm glow fill your body, and you tremble in anticipation of the seeding he’s about to give you.", parse);
				Text.NL();
				Text.Add("The white werewolf licks the nape of your neck and begins pushing inside you.", parse);
				Text.NL();
				Scenes.Halloween.RonnieCatch();
			}, enabled : true
		});
		options.push({ nameStr : "Fight!",
			tooltip : "It’s time for a new alpha!",
			func : Scenes.Halloween.RonnieReversal, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else { // Alpha
		Text.Add("Shuffling from the bushes nearby catches your attention. As your head flicks towards the source, a deliciously familiar scent fills your nostrils. Grinning heartily, you call for Ronnie to come out, like a good little beta.", parse);
		Text.NL();
		Text.Add("The white-furred werewolf immediately thrusts his way into the cleared path, a shy but hopeful expression on his face. He meekly lopes over to you, and you reward him by scratching him behind the ear. You want to laugh at the silly grin on his face as his tongue lolls out between slack jaws.", parse);
		Text.NL();
		Text.Add("He nuzzles your hand for an instant, before turning to lick it affectionately.", parse);
		Text.NL();
		Text.Add("You smile and pet his head with the other hand. Such a good boy... now, what do you want to do with him? Since he sought you out, it’s clear he’s in need of a good fuck, but do you want to scratch an itch yourself?", parse);
		Text.Flush();
		
		//[Yes] [No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : "He’s here, you’re both horny, why fight it?",
			func : function() {
				Text.Clear();
				Scenes.Halloween.RonniePitch();
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : "He’ll have to go and take care of himself, you don’t have time to play.",
			func : function() {
				Text.Clear();
				Text.Add("With a sharp bark and a few gestures, you convey to Ronnie that you’re not interested in ‘playtime’ at the moment.", parse);
				Text.NL();
				Text.Add("Ronnie whines, ears drooping and tail tucked between his legs.", parse);
				Text.NL();
				Text.Add("You lightly cuff him over the ear and point towards the wilderness, telling him to leave.", parse);
				Text.NL();
				Text.Add("He barks his obedience, like a good beta, but doesn’t hide the disappointed tone as he trots out back into the wood from whence he came.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

Scenes.Halloween.RonnieFirst = function() {
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	Text.Add("As you make your way along the path, your [skin] begins to crawl. Faintly, you can hear the sound of heavy breathing, underscored by leaves rustling underfoot. Someone else is out there... and they’re getting closer.", parse);
	Text.NL();
	Text.Add("For lack of a better option, you pull out the ‘stake’ that the Elder gave you and brandish it like a makeshift sword, wielding it defensively as best you can and wishing you had something better.", parse);
	Text.NL();
	Text.Add("A bush nearby shakes and shudders, audibly crunching as something forces its way through its depths. You bite your lip and hold your breath; this is it! ...And then you exhale quietly, putting down your ‘stake’ as you see who it is that’s just come blundering through the undergrowth.", parse);
	Text.NL();
	if(roa.Met())
		Text.Add("It’s... Roa! Surprisingly overdressed by his standards, the effeminate little bunnyboi has covered his girlishly pretty frame with a simple, homespun tunic and a pair of much-patched blue overalls. His bunny-like feet stick out at the tattered ends of his pants, clearly unable or unwilling to go to the extent of wearing shoes, and a small rucksack sits on his back.", parse);
	else
		Text.Add("It’s a rabbit-morph - either a very pretty boy, or a very flat girl. Probably the former, given the typically lapine ampleness of the bulge in his much-patched blue overalls. Surprisingly, despite wearing pants and a simple homespun tunic, he goes barefoot. A small rucksack filled with who-knows-what sits on his back.", parse);
	Text.NL();
	Text.Add("<i>“Waah! Pleasedon’tkillme! I’m not even tasty!”</i> He cries out, cowering in fear.", parse);
	Text.NL();
	Text.Add("You snort in amused disdain, tucking your ‘stake’ away again before assuring the pitiful morph that you’re not going to hurt him.", parse);
	Text.NL();
	Text.Add("Still shaking, the lagomorph looks at you through a gap in his fingers. <i>“Y-you aren’t?”</i>", parse);
	Text.NL();
	Text.Add("Smiling gently, you assure him that you aren’t - you’re just a traveler, and you have a suspicion that’s what he is, too.", parse);
	Text.NL();
	Text.Add("<i>“Oh, that’s a relief!”</i> he says, allowing himself to take a deep breath. <i>“I’m Ronnie.”</i>", parse);
	Text.NL();
	Text.Add("You’re [playername].", parse);
	Text.NL();
	Text.Add("<i>“Pleased to meet you, [playername],”</i> he says, offering a hand.", parse);
	Text.NL();
	Text.Add("Reaching out and taking it, you help him to his feet and gently shake it, telling him that it’s nice to meet him too.", parse);
	Text.NL();
	Text.Add("<i>“If it’s not too bothersome, can I trouble you for a second?”</i>", parse);
	Text.NL();
	Text.Add("Curious, you ask him what the matter is.", parse);
	Text.NL();
	Text.Add("<i>“I’m not actually a traveler. I’m just a farmhand, and I lost a sheep; she ran into this scary forest… you haven’t seen her, by any chance?”</i>", parse);
	Text.NL();
	Text.Add("A lost sheep? No, you haven’t seen anything on this road except him.", parse);
	
	var beenAround = false;
	if(Scenes.Halloween.HW.flags & Halloween.Flags.Graveyard) beenAround = true;
	if(Scenes.Halloween.HW.flags & Halloween.Flags.WitchHut) beenAround = true;
	
	if(beenAround)
		Text.Add(" You’ve been around, too, but you’ve never come across a sheep in your travels.", parse);
	Text.NL();
	Text.Add("<i>“Oh… well, that’s a bummer.”</i> He sighs.", parse);
	Text.NL();
	Text.Add("Before you can make a comment on the matter, you hear something echoing from deeper in the forest: the long, lonely, echoing howl of a wolf. When you look back at Ronnie, the bunny is visibly shaking, almost on the verge of tears in his fear.", parse);
	Text.NL();
	Text.Add("<i>“Wolves! I hate wolves! I hate this damn forest!”</i> he exclaims. <i>“Oh, Dory! Why didn’t you run for the plains!”</i>", parse);
	Text.NL();
	Text.Add("Looking at the whimpering farmer, you wonder if maybe you should offer him a hand - he’s clearly in <i>way</i> over his head. On the other hand, do you <i>really</i> want to be tramping around a creepy forest with a total stranger, looking for some brainless bit of undercooked mutton?", parse);
	Text.Flush();
	
	//[Help] [Wish luck]
	var options = new Array();
	options.push({ nameStr : "Help",
		tooltip : "How can you possibly ignore someone in need?",
		func : function() {
			Text.Clear();
			Text.Add("Smiling warmly, you reach out and give the bunny a friendly clasp on the shoulder, offering him your help in finding his missing animal.", parse);
			Text.NL();
			Text.Add("<i>“R-really!?”</i>", parse);
			Text.NL();
			Text.Add("Yes, really. Now, does he have any idea where to start looking? It’s not really a good idea to just go wandering into the woods at random, after all.", parse);
			Text.NL();
			Text.Add("<i>“I-I have no idea. I just saw her entering the forest, and when I came running, she was already gone!”</i>", parse);
			Text.NL();
			Text.Add("Okay, then, does he have any idea the sort of places she might go? Does he know anything about this forest?", parse);
			Text.NL();
			Text.Add("<i>“Uh… well… I know it’s pretty dangerous, and no one comes here. They say this forest is cursed.”</i>", parse);
			Text.NL();
			Text.Add("Not very helpful... well, looks like the two of you will just have to pick a direction and start walking. Does he have any suggestions?", parse);
			Text.NL();
			Text.Add("The lagomorph simply shrugs helplessly.", parse);
			Text.NL();
			Text.Add("Alright then... looking around, you pick a direction at random and start walking, Ronnie meekly following along behind you.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("You don’t know how long it’s been since the two of you have started out. You’ve just walked on and on through these dark, creepy woods in search of Ronnie’s missing Dory, but haven’t found so much as a scrap of torn wool to prove the sheep was ever here.", parse);
				Text.NL();
				Text.Add("You shoulder aside some dense underbrush, barging your way through and stumbling into a small open pocket in the forest. Although you look around instinctively, there’s no sign of Dory here, either. Just some relatively short, soft grass and a fallen tree - a pretty standard clearing.", parse);
				Text.NL();
				Text.Add("<i>“S-sorry, [playername], but can we please stop for a moment? My feet are killing me...”</i>", parse);
				Text.NL();
				Text.Add("You’re feeling a little worn down yourself. You nod and tell Ronnie to go ahead and sit down.", parse);
				Text.NL();
				Text.Add("<i>“Thanks,”</i> he says, dropping his rucksack and sitting on the soft grass. He takes a moment to massage his feet.", parse);
				Text.NL();
				Text.Add("You take this opportunity to settle yourself against the fallen tree for a moment, enjoying the chance to take a load off and catch your breath. Idly, you look back at your lapine traveling companion, then realize he’s staring up at the sky for some reason.", parse);
				Text.NL();
				Text.Add("Following his gaze, you find yourself staring at the biggest, roundest full moon you can ever recall seeing: a great round orb of beautiful snow white that hangs in the sky, casting its own unearthly light to the ground below. It’s quite a pretty sight, and you enjoy it for a few long moments before looking back at Ronnie.", parse);
				Text.NL();
				Text.Add("To your bemusement, the rabbit is staring fixedly at the moon, trembling as if caught by a fever. Concerned, you call out to him, asking if he’s alright.", parse);
				Text.NL();
				Text.Add("The lagomorph doesn’t give even the slightest sign that he heard you, instead remaining locked onto the sight of the moon. Worried, you push yourself upright and hurry over to him, reaching out and placing a hand on his shoulder.", parse);
				Text.NL();
				Text.Add("Now he snaps around to face you, and you almost stumble back at the sight of those eyes - red as blood, empty and hungry. He just stares at you, blank and empty, even as he rises to his feet.", parse);
				Text.NL();
				Text.Add("And then he starts to change...", parse);
				Text.NL();
				Text.Add("His rabbit-like muzzle begins to stretch and narrow, as if invisible hands were roughly pulling on his nose. His lips curl back, revealing teeth that are twisting in their gums; growing longer, sharper, and more like fangs. His ears shrink, sharpening at their points, whilst his tail grows longer and thinner.", parse);
				Text.NL();
				Text.Add("He starts to swell, visibly growing before your eyes. You can hear fabric ripping, seams popping as his formerly petite, girlish frame puts on muscle and mass. His shirt bursts into tatters as he literally grows out of it, his pants legs tearing from the cuffs up, until his expanding waistline breaks it open.", parse);
				Text.NL();
				Text.Add("Incongruously, his boxers remain clinging to his loins, letting you see it deform as his maleness grows increasingly large. His underwear tears, but not fast enough; he fastens newly clawed fingers on the obstructive garment and tears it into shreds, letting a foot-long and throbbingly erect canine cock and sizable balls flop into the cool night air.", parse);
				Text.NL();
				Text.Add("Nearly double his former size, and several times his original weight, the cute little bunnyboi is gone now. Instead, what’s facing you is a hulking, feral-looking wolf-morph, with only its white fur hinting at its origins. Ronnie has turned into a werewolf!", parse);
				Text.NL();
				Text.Add("The rabbit-turned-wolf sniffs the air before sinking to the floor, bracing himself on fours as he growls menacingly, his eyes set on his prey… <i>you</i>.", parse);
				Text.NL();
				Text.Add("You only have a moment to figure out a course of action - what can you do to save yourself?!", parse);
				Text.Flush();
				
				//[Fight!] [Flee!] [Squeaky Bone!]
				var options = new Array();
				options.push({ nameStr : "Fight!",
					tooltip : "He’d catch you in a heartbeat, you have to fight!",
					func : function() {
						Text.Clear();
						Text.Add("With no better weapon available to you, you grab the dildo-stake that the Elder gave you and brandish it like a club, waiting for the werewolf to make the first move. Your every sinew tenses, readying your body to defend itself against a coming attack.", parse);
						Text.NL();
						Text.Add("Ronnie pounces on you, claws ready to strike as he growls ferociously.", parse);
						Text.NL();
						Text.Add("You lunge forward, trying to weave between the werewolf’s flailing paws as you smack him over the head with your dildo. You put every bit of strength into the blow that you can muster, the sex-toy audibly clonking off of Ronnie’s lupine skull.", parse);
						Text.NL();
						Text.Add("He visibly staggers at the impact, but it’s not enough to stop him. The white-furred wolfman crashes into you hard enough to knock you off your feet. The two of you hit the ground in a flailing fumble of limbs, pain screaming through your brain as his claws rake over your sides.", parse);
						Text.NL();
						parse["l"] = player.HasLegs() ? "" : " the equivalent of";
						Text.Add("As best you can, you deliver[l] a sound kick to his nuts. Yelping sharply in pain, Ronnie rolls off of you, giving you a chance to scramble back upright again.", parse);
						Text.NL();
						Text.Add("Stumbling and whining in pain, the werewolf holds his sore nads, too busy with the pain to pay any attention to you.", parse);
						Text.NL();
						Text.Add("Seizing this opportunity, you tighten your grip on your ‘stake’ and charge at him, shouting at the top of your lungs.", parse);
						Text.NL();
						Text.Add("Looking up at you, Ronnie swipes the air, growling threateningly as he half-runs, half-limps his way into the woods.", parse);
						Text.NL();
						Text.Add("You watch the werewolf flee, letting the triumph wash over you like a soothing balm; that wasn’t so hard after all! You should have known that ", parse);
						if(roa.Met())
							Text.Add("Roa is just a wimp, even in a wolf’s body.", parse);
						else
							Text.Add("a rabbit-turned-wolf is still a rabbit at heart.", parse);
						Text.Add(" Your sides still hurt a little where he clawed you, but considering how that could have ended up, it’s not so bad.", parse);
						Text.NL();
						Text.Add("As you think that, your brow furrows at a sudden stab of pain from your sides. Your vision starts to blur as your hand clasps the slowly bleeding furrows in your [skin]. A sickly heat washes over your body, a fever that springs out of nowhere - what... what’s happening to you?", parse);
						Text.NL();
						Text.Add("You try to step forward, staggering like a dying elk, before your treacherous [feet] trip you over and you fall to the ground. Sweat beads your skin as you claw fitfully at the ground, trembles wracking your frame. Your body is... changing, shifting around you, but in your dizzy, delirious state, you can’t tell what’s happening to you...", parse);
						Text.NL();
						
						var hasCock = player.FirstCock();
						
						Scenes.Halloween.WerewolfTF();
						
						Text.NL();
						Text.Add("The blood rushes through your veins, coursing through your limbs; you’ve never felt so alive! Unable to hold back your joy, you throw back your head, baying your wonder to the beautiful moon above until it feels like the trees around you are trembling from the vibrancy of your cry.", parse);
						Text.NL();
						Text.Add("Panting with the effort, you rise to your feet, licking your chops as you take in the clearing - so clear and bright, to your new eyes! As you scan your surroundings, you realize that you can <i>smell</i> Ronnie’s passage - to your new senses, he might as well leave a glowing trail that snakes off into the undergrowth.", parse);
						Text.NL();
						parse["new"] = hasCock ? "" : " new";
						Text.Add("For a moment, you wonder if you ought to hunt down the white werewolf and... thank him properly for your magnificent new body. Your[new] cock throbs eagerly at the thought. Still, maybe you should just leave him be; there’s so much else you could hunt for in these woods!", parse);
						Text.Flush();
						
						//[Chase] [Leave]
						var options = new Array();
						options.push({ nameStr : "Chase",
							tooltip : "To the hunt! You need a new bitch!",
							func : function() {
								Text.Clear();
								Text.Add("With a howl of joy and anticipation, you bound off after the transformed rabbit, crashing through the wilderness in hot pursuit.", parse);
								Text.NL();
								Text.Add("The scent trail leads you on through the darkness, under bushes and over stumps, growing stronger and stronger all the while. You race through the woods until the scent becomes overpowering, forcing you to halt as your keen ears pick up sounds from ahead. Your quarry!", parse);
								Text.NL();
								Text.Add("Slowly and carefully, with the patience of a born predator, you creep through the undergrowth until you can see your prey. Ronnie is hunkered down on some soft moss, a low squat with his legs splayed so he can massage his still tender balls. The wind blows from him to you, keeping your scent from his nose, and he’s so busy that he hasn’t heard you yet.", parse);
								Text.NL();
								Text.Add("A wolfish grin spreads across your face as you coil, ready to lunge forward. Ronnie’s ears twitch, and you pounce! Charging out of the undergrowth and howling, you hurl through the air, knocking Ronnie to the ground.", parse);
								Text.NL();
								Text.Add("The smaller werewolf growls and struggles, but he’s no match for your superior strength, and you quickly have him pinned.", parse);
								Text.NL();
								Text.Add("You growl softly in response, baring your teeth in a predatory smile. Hungrily, you reach down and grab his balls - the white wolf immediately settles down at that, fearful of what you might do to his tender maleness. Staring into his eyes, still grinning, you gently knead his balls, then reach up to stroke his sheath.", parse);
								Text.NL();
								Text.Add("Your grin only widens as you feel his shaft slowly slide out of hiding, wet, soft and vulnerable under your palm. You tenderly stroke it, feeling it harden in excitement as Ronnie starts to relax. That’s a good boy... but you’re not the one playing the bitch this time.", parse);
								Text.NL();
								Text.Add("Confident that Ronnie’s not going to run, you ease yourself off of him. His confused whine gives way to a surprised yip as you flip him over onto his belly and then pin him down again. You growl huskily in the depths of your throat, authoritatively nipping the back of his ear as you pull his hips, letting you grind your cock against his ass.", parse);
								Text.NL();
								Text.Add("Much to your surprise, Ronnie grinds back rather than struggle, what a slut!", parse);
								Text.NL();
								Text.Add("Well, you’ll not look a gift bitch in the ass. Time to show who’s the <b>real</b> alpha around here...", parse);
								Text.Flush();
								
								Gui.NextPrompt(function() {
									Text.Clear();
									Scenes.Halloween.RonniePitch();
								});
							}, enabled : true
						});
						options.push({ nameStr : "Leave",
							tooltip : "Let’s see what else is out there, waiting to be chased!",
							func : function() {
								Text.Clear();
								Text.Add("Shaking your head, you turn and head back the way you came - with your new nose, it’s easy to find your path. Let Ronnie go; you have other places to explore.", parse);
								Text.Flush();
								
								Scenes.Halloween.HW.ronnie = Halloween.Ronnie.Removed;
								
								Gui.NextPrompt();
							}, enabled : true
						});
						Gui.SetButtonsFromList(options, false, null);
					}, enabled : true
				});
				options.push({ nameStr : "Flee!",
					tooltip : "Run away! Run, run, run!",
					func : function() {
						Text.Clear();
						Text.Add("Unthinkingly, you spin around and sprint for your life, fleeing your transformed companion as fast as you possibly can. From behind you, that awful sound of a wolf on the hunt splits the air and you can hear him bounding after you.", parse);
						Text.NL();
						Text.Add("Try as you might, you just don’t stand a chance; with a flying leap, the werewolf slams into you, knocking you to the ground in a tangle of limbs. You try to wriggle free, but the big, bad wolf atop you has you well and truly pinned for the moment.", parse);
						Text.NL();
						Text.Add("Ronnie wastes no time; he shreds your skimpy clothes with his sharp claws in an instant, tossing the remains aside without a care.", parse);
						Text.NL();
						Text.Add("Sparks of pain prickling across your skin where his claws drew blood in their enthusiasm, you try to crawl away across the ground whilst Ronnie is distracted with the remnants of your clothes, but he quickly returns his attentions to you.", parse);
						Text.NL();
						Text.Add("Those big, clawed hands grab your [hips] roughly, prickling you with their sharp tips and he pulls you back towards him.", parse);
						Text.NL();
						Text.Add("Struggle as you might, he easily manhandles you into position. He doesn’t stop until he has you truly pinned under him, your [butt] thrust into the air as if you were a bitch in heat offering yourself to an alpha dog.", parse);
						Text.NL();
						Text.Add("...Which is almost certainly what he thinks you are, come to think of it...", parse);
						Text.NL();
						Text.Add("Your [skin] crawls as his hot breath gusts over the back of your neck, saliva dripping messily onto your back as he pants atop you. You are all too aware of his arms gripping your wrists, and of his throbbing slab of wolfmeat sandwiching your buttcheeks.", parse);
						Text.NL();
						Text.Add("You start and let out a gasp of shocked disgust as Ronnie’s warm, wet tongue laps the back of your neck. He nips you, just hard enough that you can feel it break the skin. He pulls back atop you, his furry mass hot on your back as he starts to shift around, clearly ready to penetrate.", parse);
						Text.NL();
						if(player.FirstVag()) {
							Text.Add("You can feel his long, pointy cock rubbing against your folds, and the touch of it makes you clench down instinctively. However, although he does grind your labia a little, he moves on - it seems he has a different target in mind.", parse);
							Text.NL();
							Text.Add("Ronnie’s cock drags up your taint, gliding through your butt-crack until you can feel it poking at your [anus], confirming your sneaking suspicions.", parse);
						}
						else {
							Text.Add("You can feel his cock, hard and wet and pointy-tipped, butting insistently against your ass. It grinds against your taint before worming its way through your butt cleavage, not stopping until he’s gotten himself aligned with the only hole you have to penetrate back there.", parse);
						}
						Text.NL();
						Text.Add("He growls when he finally feels your pucker on the pointy tip of his canine member, adjusting himself to softly thrust against your hole - not yet penetrating, just pushing his tip against your [anus] as he tests its elasticity.", parse);
						Text.NL();
						Text.Add("A wave of heat washes through your body, making your senses swim as you swoon. You feel so... dizzy; the world is spinning around you, a feverish heat burning through your veins...", parse);
						Text.NL();
						Text.Add("In its wake, it leaves a strange sort of numbness; you can barely feel Ronnie as he ardently pokes at your ass, teasing his way inside your slackened anus. Your head feels so heavy that you can barely hold it up, your gaze falling to your hands laying spread-fingered on the ground.", parse);
						Text.NL();
						Text.Add("...Are your nails growing?", parse);
						Text.NL();
						Text.Add("Waves of... something; pain? Pleasure? You can’t tell. They overwhelm you with their intensity as you feel your whole body shifting, warping, <i>changing</i> on you. You’re so lost in the sensations, you can’t pinpoint what is happening to you; all that you know is that it feels <b>good</b>...", parse);
						Text.NL();
						
						Scenes.Halloween.WerewolfTF();
						
						Text.NL();
						Text.Add("Warm wetness splashes against your [anus], trickling down your taint to drool onto your swaying, apple-sized balls, and jars you back to your senses. Atop you, Ronnie has been eagerly grinding away, too lost in his own pleasure to notice your transformation.", parse);
						Text.NL();
						Text.Add("He feels so light and dainty now; hardly a burden at all. If you wanted, you could easily throw him off of your back... maybe even turn the tables.", parse);
						Text.NL();
						Text.Add("Then again, maybe you don’t want to. Maybe you’re happy to let him claim you as his bitch; this beautiful new body is his gift to you, after all, you don’t want to be ungrateful...", parse);
						Text.Flush();
						
						//[Fight] [Submit]
						var options = new Array();
						options.push({ nameStr : "Fight",
							tooltip : "You’re no runt’s bitch! It’s time you teach that pup his place in this pack.",
							func : Scenes.Halloween.RonnieReversal, enabled : true
						});
						options.push({ nameStr : "Submit",
							tooltip : "There’s a certain thrill in being taken by the smaller wolf, and you do owe him for your current form… Maybe it wouldn’t hurt to be his beta.",
							func : function() {
								Text.Clear();
								Text.Add("Whining softly, you lower your head meekly to the ground, hungrily grinding your hips back on your beautiful white alpha’s cock, ready and eager to be marked as belonging to him.", parse);
								Text.NL();
								Text.Add("The smaller wolf leans over your back to gently lick the back of your neck, pressing his shaft harder into your puckered hole.", parse);
								Text.NL();
								
								Scenes.Halloween.RonnieCatch();
							}, enabled : true
						});
						Gui.SetButtonsFromList(options, false, null);
					}, enabled : true
				});
				if(party.Inv().QueryNum(Items.Halloween.SqueakyToy)) {
					options.push({ nameStr : "Squeaky Bone!",
						tooltip : "It’s a long shot, but maybe you can distract him with a doggie toy.",
						func : function() {
							Text.Clear();
							Text.Add("Without a second thought, you pull the squeaking rubber bone from your possessions and hold it aloft before giving it a sharp squeeze, to see what will happen.", parse);
							Text.NL();
							Text.Add("Much to your surprise, the transformed Ronnie immediately drops his threatening stance, jumping happily from one side to the other as his tail wags happily. He barks at you for a moment, before sitting on his haunches, eyeing the squeaky toy as if it was the most interesting thing in the world.", parse);
							Text.NL();
							Text.Add("You can’t help the grin that spreads across your features at the sight. Well now, he likes this, does he?", parse);
							Text.NL();
							Text.Add("Ronnie barks happily, panting excitedly.", parse);
							Text.NL();
							Text.Add("Alright then, catch! And with that, you toss the toy past him.", parse);
							Text.NL();
							Text.Add("The werewolf barks and immediately turns to chase after the toy; he pounces it and bites it, the squeaky noises only seem to make his tail wag faster. He shakes the toy in his mouth a bit, gnawing and enjoying the noises for a moment, before he spins and brings the toy back to you.", parse);
							Text.NL();
							Text.Add("The sight is just too amusing; the fearsome predator reduced to an overgrown puppy dog. You happily pick it up and spin it off across the glade again, watching Ronnie’s lupine legs blur as he scrambles off after it again, only to return it to you.", parse);
							Text.NL();
							Text.Add("A surprisingly enjoyable few minutes whizz past as you play fetch with the transformed Ronnie. On your next throw, you get a bit too enthusiastic, and the toy goes whistling out of the glade and into the woods beyond. Ronnie goes racing off after it, barking his heart out... and never comes back.", parse);
							Text.NL();
							Text.Add("You can hear him, crashing around and barking, but he just doesn’t come back. Instead, the sound of him fades into the distance - you think he startled a squirrel or something, and is busy chasing it. Looks like he’s gone for good, now.", parse);
							Text.NL();
							Text.Add("With a shrug of your shoulders, you turn and start making your way back to the road proper. Ronnie should be just fine out there on his own, no need to worry.", parse);
							Text.Flush();
							
							party.Inv().RemoveItem(Items.Halloween.SqueakyToy);
							
							Scenes.Halloween.HW.ronnie = Halloween.Ronnie.Removed;
							
							Gui.NextPrompt();
						}, enabled : true
					});
				}
				Gui.SetButtonsFromList(options, false, null);
			});
		}, enabled : true
	});
	options.push({ nameStr : "Wish luck",
		tooltip : "Let him find his own damn sheep, you have more important things to do.",
		func : function() {
			Text.Clear();
			Text.Add("As politely as you can, you wish Ronnie luck in finding his Dory. You’d like to help, but you have problems of your own to handle.", parse);
			Text.NL();
			Text.Add("<i>“Oh! Of course! Sorry for taking your time, and thank you.”</i>", parse);
			Text.NL();
			Text.Add("It’s alright. Good luck finding that sheep.", parse);
			Text.NL();
			Text.Add("<i>“Okay, Ronnie… you can do this,”</i> he says, taking a deep breath and bounding away through the forest.", parse);
			Text.NL();
			Text.Add("You watch him vanish into the darkness, and then turn and start walking your own path.", parse);
			Text.Flush();
			
			Scenes.Halloween.HW.ronnie = Halloween.Ronnie.Removed;
			
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Halloween.WerewolfTF = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	//TODO
	var blessed = false; //Scenes.Halloween.HW.flags & Halloween.Flags.Nadirmasomething...
	
	if(player.FirstCock()) {
		Text.Add("Your [cocks] [isAre] hard and throbbing against your belly, aching with the fire that is burning through you. ", parse);
		if(player.HasBalls()) {
			Text.Add("You can feel your [balls] throbbing, churning up seed with an almost painful urgency.", parse);
			if(player.Balls().BallSize() < 5)
				Text.Add(" They seem to be growing bigger, literally bloating up with sperm.", parse);
		}
		else
			Text.Add("There’s a strange pressure below your cock[s], a feeling of something swelling and growing beneath you. You shuffle your legs to give it room; it feels like a pair of apples swaying down between your legs. It’s heavy and a little awkward, but it also feels really good...", parse);
	}
	else {
		Text.Add("Pleasure washes through your belly as once-flat flesh stretches and grows. You can’t think of the words to describe how it feels as something long and hard, yet soft, forces its way out of your body. You can feel the breeze gusting across it, making your nerves sing at the touch. Two heavy, round things fall from your loins, making you spread your legs to give them room, bringing with them a strange feeling of liquid weight.", parse);
	}
	Text.NL();
	
	if(player.Femininity() > 0.3 || blessed) {
		if(player.FirstVag()) {
			Text.Add("Your [vag] flutters and ripples, clenching wetly around an invisible partner, burning with the desire to be used.", parse);
		}
		else {
			Text.Add("Behind your balls, you can feel yourself opening up, stretching into something wet and warm, but which feels so good. You feel yourself aching with the need to be filled by something, and to fill something in kind.", parse);
			player.body.vagina.push(new Vagina());
		}
		Text.NL();
		if(blessed && player.FirstBreastRow().Size() < 10) { // E-Cup
			Text.Add("You swear you can hear a voice in your head whispering, <i>“Yes, come on, bigger; we can do better than this,”</i>, but all you can really focus on is the glorious warmth enveloping your [breasts]. You thrust your chest out with a moan as you feel them swell and bulge, blossoming into a truly spectacular display of womanhood.", parse);
			
			//Grow breasts
			_.each(player.AllBreastRows(), function(breast) {
				if(breast.size.base < 10) breast.size.base = 10;
			});
		}
		else if(player.FirstBreastRow().Size() < 7.5) { // D-Cup
			Text.Add("Warmth centers on your chest, like ghostly fingers caressing your [breasts], and the feeling makes you moan joyfully. You can feel yourself growing, your [breasts] swelling into a glorious set of ripe womanly melons.", parse);
			
			//Grow breasts
			_.each(player.AllBreastRows(), function(breast) {
				if(breast.size.base < 7.5) breast.size.base = 7.5;
			});
		}
		else {
			Text.Add("Tingles of warmth dance along your [breasts], making you groan luxuriantly as your [nips] stiffen.", parse);
		}
		Text.NL();
		Text.Add("As swiftly as it came to you, the dizziness fades away. The world snaps back into place with glorious quality; you feel better than ever before, more alive.", parse);
		Text.NL();
		Text.Add("It seems Ronnie was a little too careless with his fangs and claws; he’s passed his glorious condition on to you!", parse);
		Text.NL();
		Text.Add("You have turned into a magnificent specimen of a she-wolf; covered from head to toe in long, sleek, glossy black fur, your lithe frame is built for speed, but still visibly ripples with power. You can feel the strength twitching in every limb, curling under your belly. The night, once so dark and frightening, has opened up to you; your sense of smell heightened, revealing secrets once obscured to you, and your eyes piercing the darkness that once left you fit and frail.", parse);
		Text.NL();
		Text.Add("You are a gorgeous specimen of female wolfdom... although, in your own opinion, rather improved by the addition of the massive turgid wolf-cock pulsing between your legs.", parse);
		Text.NL();
		Text.Add("Your whole body is just seething with power - feral and sensual all at the same time - and for a moment, you allow yourself to be lost in its embrace.", parse);
	}
	else {
		if(player.FirstVag()) {
			Text.Add("Your [vag] squeezes itself tightly, clenching harder than it’s ever done before. You... you’re not sure, but you think that it’s <b>shrinking</b>. There’s a strange tightening sensation behind your taint, and then... nothing. It’s gone now.", parse);
			Text.NL();
			Text.Add("Strange... you don’t really miss it.", parse);
			Text.NL();
		}
		if(player.FirstBreastRow().Size() > 2) {
			Text.Add("A weird prickling feeling comes from your chest, a tingling that runs over your [breasts]. The weight you’ve become so accustomed to feeling hanging from your front is dwindling... are they shrinking?", parse);
			Text.NL();
		}
		Text.Add("As swiftly as it came to you, the dizziness fades away. The world snaps back into place with glorious quality; you feel better than ever before, more alive.", parse);
		Text.NL();
		Text.Add("It seems Ronnie was a little too careless with his fangs and claws; he’s passed his glorious condition on to you!", parse);
		Text.NL();
		Text.Add("You have turned into a truly intimidating specimen of a werewolf. Muscles visibly bulge along your limbs and midriff, rippling with the slightest tweaking of your sinews. You are stacked to make any fan of male muscle drool, and the mighty bitch-breaker you can feel swaying under your hips is sure to knock ‘em dead.", parse);
		Text.NL();
		Text.Add("Covered from head to toe in sleek, glossy black fur, you are one gorgeous hunk of wolf, and you feel even more powerful than you look. Confidence burns within you, your new senses opening up a world that you couldn’t have dreamed of before. The slightest noise, the faintest scent, these speak volumes to you now.", parse);
		Text.NL();
		Text.Add("Your rapture in your new body is overwhelming, and you allow yourself to be lost in the fog of bliss, for the moment.", parse);
		
		//Body stuff, remove vag
		player.body.vagina = [];
		_.each(player.AllCocks(), function(cock) {
			cock.vag = null;
		});
		//Shrink breasts
		_.each(player.AllBreastRows(), function(breast) {
			if(breast.size.base > 2) breast.size.base = 2;
		});
	}
	
	//Items/clothes
	party.Inv().RemoveItem(Items.Halloween.SkimpyCostume); //Temp measure
	player.topArmorSlot = Items.Halloween.WerewolfHide;
	player.weaponSlot = Items.Halloween.WerewolfClaw;
	player.Equip();
	
	//Werewolf TF
	//===========
	
	// Size
	player.body.height.base = 210;
	player.body.weigth.base = 120;
	player.body.muscleTone.IncreaseStat(0.8, 1);
	
	// Regular body
	player.body.legs.count = 2;
	player.body.arms.count = 2;
	
	// Fix cock/s
	var cocks = player.AllCocks();
	if(cocks.length == 0) {
		var cock = new Cock(Race.Wolf, Color.red);
		cocks.push(cock);
	}
	_.each(cocks, function(cock) {
		if(cock.Len() < 25) cock.length.base    = 25;
		if(cock.Thickness() < 7) cock.thickness.base = 7;
		cock.knot = 1;
		cock.color = Color.red;
	});
	
	// Fix balls
	var balls = player.Balls();
	if(balls.count < 2) balls.count = 2;
	if(balls.size.base < 5) balls.size.base = 5;
	
	// Add/modify tail
	TF.SetAppendage(player.Back(), AppendageType.tail, Race.Wolf, Color.black);
	// Set skin and eye color
	player.SetSkinColor(Color.black);
	player.SetEyeColor(Color.yellow);
	
	// Set race (sets everything)
	player.body.SetRace(Race.Wolf);
	
	// Set flags
	Scenes.Halloween.HW.flags |= Halloween.Flags.Werewolf;
}

Scenes.Halloween.RonniePitch = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	var first = Scenes.Halloween.HW.ronnie != Halloween.Ronnie.PCAlpha;
	Scenes.Halloween.HW.ronnie = Halloween.Ronnie.PCAlpha;
	
	Text.Add("As slowly and patiently as you can bring yourself to go, you grind your massive throbbing wolfhood between your beta’s round buttcheeks. Each stroke rubs around the wrinkled opening of his tailhole, working the very tip of your cock against his opening, but never quite penetrating.", parse);
	Text.NL();
	Text.Add("Ronnie bucks back in excitement, trying his best to push you inside. He whines pitifully when he fails to impale himself.", parse);
	Text.NL();
	Text.Add("Growling softly in your excitement, you deem that both of you have had enough foreplay. One powerful hand closes on his shoulder for a little extra leverage as you lean over, drawing him closer so that you can thrust yourself into his ass.", parse);
	Text.NL();
	Text.Add("A high-pitched whimper escapes Ronnie’s lips as you penetrate him; his backdoor opens to you with surprising grace, almost effortlessly swallowing the first few inches of your massive cock. He’s warm and tight around you, muscles twitching and wrinkling in ways that stoke your excitement, but when you push inside, there’s so much <i>give</i> in him...", parse);
	Text.NL();
	if(first)
		Text.Add("Well, well; it looks like this isn’t Ronnie’s first ride on a cock - no wonder your beta was so eager to have you inside of him! Well, since he wants this so badly, you’re happy to oblige; you wonder how much of you that he can take...", parse);
	else
		Text.Add("Such a slutty little puppy; how could he have ever thought to pretend to be an alpha, when he’s so in love with getting stuffed up the butt? Well, you’re a loving alpha, so you’ll give him what he wants: your [cock] to the very hilt, right up his ass and filling him with a breeder’s delight of semen!", parse);
	Text.NL();
	Text.Add("Driven by that thought, you surge forward, thrusting yourself more than halfway inside of him in a single powerful jerk of your hips. Ronnie yips loudly in pleasure, whining deliciously as you fill his ass, and the sound of your bitchboi beta’s pleasure stokes your inner alpha.", parse);
	Text.NL();
	Text.Add("With an ardent growl, you wrap your arms around Ronnie’s waist and hoist the startled wolf into the air, pulling him into your lap as you hold him up by the knees. Gravity does its work, roughly pulling your beta completely down your shaft, making him squirm deliciously against you as he is filled to the brim.", parse);
	Text.NL();
	Text.Add("Almost purring in lust, you thrust your hips, your mighty lupine body hoisting Ronnie into the air before gravity pulls him back, each thrust roughly battering his prostate. Meek as you please, Ronnie whimpers and wriggles, but makes no effort to try and struggle free. You can see his cock, over his shoulder; it’s harder than ever before, spurting pre-cum each time he lands in your lap.", parse);
	Text.NL();
	Text.Add("What a delicious little bitchboi; he was just born for this, wasn’t he? To have an alpha wolf pounding his ass, making him writhe and squirm like the bitch in heat he is at heart...", parse);
	Text.NL();
	Text.Add("Ronnie pants and growls in pleasure, unable to do much more than hold onto your arms for support, face contorted into a silly smile as he basks in delirious pleasure.", parse);
	Text.NL();
	Text.Add("Eager little bitch... well, if he’s enjoying this so much, then he can do some of the work himself. With that thought in mind, and holding your puppy tightly so he doesn’t fall off, you settle down on the ground, shuffling on the soft leaf litter for a comfortable position. Leaning forward, you growl into Ronnie’s ear, telling him to start bouncing. You want to see just how badly he wants your cum.", parse);
	Text.NL();
	Text.Add("The white werewolf doesn’t hesitate, following your orders eagerly, like a good beta. He places a hand on your muscular thighs, rising and falling awkwardly at first, but quickly settling into a more comfy position for the both you.", parse);
	Text.NL();
	Text.Add("You growl approvingly, warmth dancing along your dick as Ronnie bucks away. Through the haze of pleasure clouding your vision, you can see your beta’s hands pumping away eagerly at his own cock, and your lip curls in disapproval. As long as you lead this pack, then Ronnie’s first duties should be to <i>your</i> pleasure.", parse);
	Text.NL();
	Text.Add("With a chiding snarl, you grab Ronnie’s wrists and pull them behind his back; not hard enough to hurt him, but with a roughness that lets him know you won’t tolerate dissent.", parse);
	Text.NL();
	Text.Add("Ronnie yelps and stops in an instant.", parse);
	Text.NL();
	Text.Add("You tell him that if he wants to cum, he’ll have to make the most of your cock, the words rumbling up from the depths of your chest.", parse);
	Text.NL();
	Text.Add("When your words finally sink in, he whines in reply and tries to pull his wrists away from your grasp.", parse);
	Text.NL();
	Text.Add("You just tighten your grip until he can feel your fingers squeezing his bones, snarling in warning.", parse);
	Text.NL();
	Text.Add("Having no choice but to obey, the smaller werewolf adjusts himself as best as he can. Without his arms to support himself, he’s forced to put all his weight in his legs and knees. You doubt that’ll be a problem for the white werewolf, but his position is still very awkward.", parse);
	Text.NL();
	Text.Add("His legs shake with effort as he tries his best to rise and fall on your canine mast; this causes his own hips to shake, which sends wonderful vibrations coursing through your shaft. In addition, the effort also forces him to clench his ass, making his insides feel tighter than ever.", parse);
	Text.NL();
	Text.Add("You have no doubt that he’d probably perform better if you’d let him go, but you’re enjoying the added pleasure of the smaller werewolf doing all he can to pleasure you as he’s punished for his misbehavior, plus you can just catch the faintest glimpse of his own cock, now harder than ever. Seems like he’s enjoying his predicament way too much… you might have to come up with a better punishment sometime, but for now you resolve to just lie back and enjoy your beta’s tight, vibrating butthole.", parse);
	Text.NL();
	Text.Add("Long, blissful minutes pass as you lie back and allow your bitchboi to hump and grind away atop your cock. Tingles of pleasure crackle across your skin, making your fur stand on end. Your heart hammers in your chest, breath coming in short, sharp pants as the sensations grow stronger and stronger still - oh, you’re getting close...", parse);
	Text.NL();
	Text.Add("And that’s when Ronnie’s ecstatic howl jars you back to your senses. You can feel his ass clamping down on your cock like a velvet-lined vice, the sensation almost - but not quite enough - to bring you to climax in turn as he messily cums in front of you.", parse);
	Text.NL();
	Text.Add("What a naughty beta, cumming before his alpha - what, does he think he’s going to get away with not getting you off as well? Time to show him how wrong he is...", parse);
	Text.NL();
	Text.Add("With a lustful roar, you violently throw yourself forward. The startled beta barely has time to yelp as you pitch him to the ground, roughly pinning him to the ground so firmly that his face is forced into the grass. Growling in your lust, you start to thrust your hips with all your might, forcefully pounding Ronnie’s ass as you grind your swollen knot against his too-tight pucker.", parse);
	Text.NL();
	Text.Add("Ronnie whines in pure enjoyment, bucking back at you with as much force as his tired muscles are able to.", parse);
	Text.NL();
	Text.Add("Inevitably, through sheer determination, you manage to push hard enough that your slutty beta’s ass stretches around and engulfs your knot, sucking the bloated bulb of flesh completely inside. The feeling of warm, tight flesh clamping down around it, mercilessly squeezing it in its vice-like grip, makes spots dance in front of your eyes. With a great howl of pleasure, the dam inside of you breaks and you empty yourself into Ronnie’s ass.", parse);
	Text.NL();
	Text.Add("The smaller werewolf goes slack, whining and trembling as he enjoys your liquid load filling him.", parse);
	Text.NL();
	Text.Add("Lost in the bliss of emptying your aching, overstuffed balls, you squeeze Ronnie tight against you, grinding your crotch to his ass as you fill him fuller and fuller yet. Pleasure sweeps through you, drowning you in a tide of pure carnal satiation, and only when the flood recedes and leaves the warmth of afterglow to keep you company do you come back to your senses.", parse);
	Text.NL();
	Text.Add("Ronnie looks well and truly filled at this point; with your oversized knot held tight in his trained slutty ass, not so much as a drop has escaped, leaving him with a belly like a pregnant woman’s. The round jism-filled orb brushes against the ground, smeared with Ronnie’s own cum at having been violated so thoroughly.", parse);
	Text.NL();
	Text.Add("Sighing in release, you loosen your hold. With an affectionate smile, you gently scratch Ronnie behind the ears. He may be a naughty beta at times, but you love him all the more when he behaves himself.", parse);
	Text.NL();
	Text.Add("Ronnie’s tail begins wagging, softly hitting your side.", parse);
	Text.NL();
	Text.Add("Tired and satisfied, you gently topple the pair of you to the grass, spooning your smaller white beta as you wait for your knot to shrink down.", parse);
	Text.NL();
	Text.Add("Long, pleasant minutes pass, until finally you can pull your slumping dick from Ronnie’s asshole; buttslut that he is, Ronnie still can’t hope to just spring back in the face of your assault. His hole gapes in an almost perfect mold of your impressive wolfhood, a river of thick semen seeping from his stretched opening.", parse);
	Text.NL();
	parse["v"] = player.FirstVag() ? " and still slick-lipped cunt" : "";
	Text.Add("Stretching stiff joints, you pad silently around to Ronnie’s face and present your wet, musky, half-erect maleness[v] to him. With a rumble in the back of your throat, you curtly order him to clean you up.", parse);
	Text.NL();
	Text.Add("The white werewolf lifts his head off the ground, tail wagging tiredly as he crawls over to you and begins gently lapping your shaft.", parse);
	Text.NL();
	Text.Add("You growl softly in pleasure; that’s a good boy, get it all off...", parse);
	Text.NL();
	Text.Add("With your beta’s diligence, you soon find yourself clean as a whistle. You pull your cock free of his lapping tongue, watching as his panting face droops back to the ground. Reaching down to ruffle his ears affectionately one last time, you turn and set off on your way again, happily leaving him to digest his titanic liquid repast.", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}

Scenes.Halloween.RonnieCatch = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Scenes.Halloween.HW.ronnie = Halloween.Ronnie.PCBeta;
	
	Text.Add("You moan deep and low as your alpha gently but firmly penetrates you; his thick, throbbing cock slowly spreading you open as it glides deeper and deeper inside. You can feel every vein, every ridge and crinkle as it pushes inside of you. Your tail wags in pure bliss, absently thudding against his middle as you push back against him, trying to guide him further inside.", parse);
	Text.NL();
	Text.Add("Ronnie hilts himself, all the way to the knot, then stops to give you time to adjust. While waiting, he bends over and begins gently licking the nape of your neck.", parse);
	Text.NL();
	Text.Add("Shivers race across your skin, your glossy black fur standing on end at your alpha’s touch. You groan appreciatively, arching your back in an instinctive effort to expose more of your neck to his hungry caresses. Your own cock is starting to throb with need beneath you, the first drops of pre-cum spattering on the thirsty ground below.", parse);
	if(player.FirstVag())
		Text.Add(" Even your neglected cunt is tingling with desire, flushing wet as it squeezes down in sympathy with your ass.", parse);
	Text.NL();
	Text.Add("Your alpha growls softly, gently biting your neck where he’d been licking a few moments ago. It doesn’t hurt even if you can feel the pressure of his sharp teeth, but even if it did you have no reason for alarm; your instincts tell you all you need to know: this is a mating bite.", parse);
	Text.NL();
	Text.Add("You stretch yourself out, tingling all over as your alpha begins to thrust away, truly mating with you. His cock slides back and forth through your stretched ring, the friction gnawing away at your mind, his own heavy seed-laden balls gently batting against your even-larger orbs. Ronnie’s arms tighten themselves possessively around your body, his hands starting to stroke through the fur of your stomach as he blindly explores his beta.", parse);
	Text.NL();
	Text.Add("Without hesitation, Ronnie gropes for your chest.", parse);
	if(player.FirstBreastRow().Size() >= 2)
		Text.Add(" You hear a faint growl of approval as his hands find the lush roundness of your breasts, fingers greedily cupping each round, fluffy orb. You purr in approval as he eagerly squeezes and kneads your [breasts], luxuriating in his ardor before he gives them a final squeeze and moves on.", parse);
	Text.NL();
	Text.Add("With surprising dexterity, his long claws begin to stroke your [nips], their sharp tips just forceful enough that their pinprick sends shudders of pleasure along your spine. You whimper quietly as he teases you, the gentle touch the perfect counterpoint to his efforts on your ass.", parse);
	Text.NL();
	Text.Add("Ronnie’s thrusts grow more intense, his cock throbs inside you, and you can tell that his knot is rapidly growing to its full size. His hands leave your nipples and he releases your neck, licking where he bit you affectionately as he positions himself to thrust into you more forcefully. It seems your alpha is just about ready to try and knot his bitch.", parse);
	Text.NL();
	Text.Add("Lost in the throes of lust, you arch your back and growl enticingly, thrusting your ass back in blatant invitation. You want to be filled - you <b>need</b> to be filled, like the bitch you are! Cock and cum, you want to be <b>stuffed</b> with everything your alpha can give you!", parse);
	Text.NL();
	Text.Add("The smaller werwolf pushes against your [anus] with each powerful pump of his hips, trying his best to knot his beta. He tries again and again, and with every attempt you feel yourself being pried open just a little wider, his knot pushing just a little harder. You continue to push back, until he bites the nape of your neck once more, his hold on your hips tighten to stop all movement, and he thrusts with all his might one last time.", parse);
	Text.NL();
	Text.Add("You yelp in pleasured pain as your ass is forced open, Ronnie’s glorious knot finally managing to squeeze inside your gaping hole. Your body is awash in the fires of passion, lust all consuming, but it’s not enough to cum!", parse);
	Text.NL();
	Text.Add("Dimly, you are aware of Ronnie clambering atop your back in his eagerness, his hips thrusting desperately in his need. And then, your wonderful, generous alpha’s hands close around the straining, drooling length of your own cock, vigorously pumping away to help you to cum.", parse);
	Text.NL();
	parse["v"] = player.FirstVag() ? " mixed" : "";
	parse["v2"] = player.FirstVag() ? " as your cunt adds its own spray to the mixture" : "";
	Text.Add("That does it for both of you; your howls of ecstasy ring out in unison as both of you erupt. Your own seed spatters across the thirsty ground, forming a great sodden puddle of[v] sexual fluids[v2]. But Ronnie’s cum has nowhere to go but inside of you, pouring furiously into your bowels and swirling up into your stomach.", parse);
	Text.NL();
	Text.Add("By the time Ronnie grunts and sighs softly, you feel so very full... it’s glorious. You’re panting with the exertion of your climax, almost steaming in the cool night air, held aloft mostly because Ronnie hasn’t deigned to let you down yet.", parse);
	Text.NL();
	Text.Add("But your alpha... he doesn’t seem to be finished with you yet. Maybe it’s the rabbit in him, but you can feel him in your ass, still hard and throbbing as if he hadn’t ever climaxed.", parse);
	Text.NL();
	Text.Add("With a grunt of effort, Ronnie clambers off of you. Like a dog, he pivots as he hits the ground, leaving the pair of you still ass to ass, held together by his knot. He growls, deep and soft, grinding his ass back against your own.", parse);
	Text.NL();
	Text.Add("A second surge of liquid warmth erupts inside of you as he cums again. Thick jets of seed spray through your guts, joining those of his last climax. And then he spews forth his seed a third time, trembling so violently it almost sends both of you to the ground. You can feel your belly bulging, your alpha’s generous deposits of semen sloshing around as you sway.", parse);
	Text.NL();
	Text.Add("For a moment, you wonder just how much more he’s going to give you... and then you realize that he’s fallen still. You can feel him going soft inside of you, his knot slowly deflating... it looks like he’s had enough.", parse);
	Text.NL();
	Text.Add("Ronnie takes a step forward, pulling away from your used backdoor. A huge cascade of white werewolf semen falls from your abused hole, and your alpha turns to look at the scene with a proud air of satisfaction. He has mated his beta and filled his bitch.", parse);
	Text.NL();
	Text.Add("Weak at the knees, you allow yourself to slide to the ground, rolling slightly to the side in order to spare your sensitive, over-stuffed stomach. Your tongue lolls freely from your jaws as you pant tiredly, the silly grin of the truly fucked senseless painted broadly across your lupine face.", parse);
	Text.NL();
	Text.Add("Looking at your alpha, you see the white werewolf bent over himself, casually licking his half-erect cock clean. Once he’s finished, he bounds over and nuzzles you affectionately for a moment, before dashing away towards the woods.", parse);
	Text.NL();
	Text.Add("You sigh tiredly, closing your eyes and letting the strength creep back into your limbs. When you feel ready to go, you pick yourself up, shake yourself off, and slowly lope back towards the dusty road from whence you came, feeling quite satisfied yourself.", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}

Scenes.Halloween.RonnieReversal = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("With a ferocious growl, you spring up from the ground, catapulting the unwitting white wolf from your back. He hits the ground with a dainty yelp, further cementing his unfitness to command. You loom over him, noting that for all his increased stature, he’s still the puny, delicate little girly-boy in comparison to you.", parse);
	Text.NL();
	Text.Add("Ronnie’s eyes widen as he gazes at your new form. Though he growls threateningly at you in a pitiful show of dominance, you can smell the fear and apprehension emanating from the smaller werewolf, as well as his lust.", parse);
	Text.NL();
	Text.Add("Unhesitatingly, you stride towards him, reaching down to grab the scruff of his neck with one powerful hand and hoist him clearly into the air to look you in the eye. Your hackles rise as you growl in command, a deep baritone rumble that just <b>dares</b> him to try and oppose you.", parse);
	Text.NL();
	Text.Add("His ears immediately flatten on his skull, any thought of challenging you immediately leaving him, and he whines plaintively.", parse);
	Text.NL();
	Text.Add("That’s a good bitch. Now, you think it was time you cemented your new role...", parse);
	Text.NL();
	Text.Add("You lower Ronnie back to the ground and then roughly push his shoulders, throwing him to all fours. The sight of his ass up in the air makes your cock throb harder and you lick your lips, growling softly as you grab him by the hips and grind your massive wolfhood between his surprisingly pert, perky buttcheeks.", parse);
	Text.NL();
	Text.Add("The smaller werewolf whines softly and grinds back, much to your surprise. It seems you didn’t even need to <i>mark him</i> to make it clear who runs this little pack of yours… but still, it would set a bad example if you just let him off the hook now, and from the looks of it, he wants this too!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Scenes.Halloween.RonniePitch();
	});
}

Halloween.Loc.Path.events.push(new Link(
	"Ravens", true, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		Text.Add("A caw of a raven draws your attention, and you look up. Through the thick canopy of twisted branches, you note that flocks of ravens are swarming in the inky sky, lit by the pale silvery light of the moon. You wonder where they are going, and decide to find out, shuffling your way along the dirt path, following the ravens to their ultimate destination…", parse);
		Text.NL();
		Text.Add("Strange. The further you walk along this path, the more insubstantial the world about you gets - gnarled trees and thorny undergrowth seeming to dissolve into the fog that surrounds you. The heavy, oppressive aura to the air begins to lift, and everything seems to be getting brighter. You have the feeling that if you continue, you won’t be heading back anytime soon…", parse);
		Text.NL();
		Text.Add("Will you continue following the ravens?", parse);
		Text.Flush();
		
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : "Reach for the end of the road.",
			func : function() {
				Text.Clear();
				Text.Add("Yeah, you’re getting out of here. One, two, three more steps, and a light suddenly grows, engulfing the world around you, blotting out even the ravens’ cawing…", parse);
				Text.NL();
				Text.Add("…The last thing you remember is a single black raven feather floating down in a world of white…", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Scenes.Halloween.WakingUp(false);
				});
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : "Turn back. You still have work to be done here.",
			func : function() {
				Text.Clear();
				Text.Add("As tempting as it is to leave this place, you force yourself to turn around and head back to the crossroads. You have business left here, and it wouldn’t do to leave it unfinished - as everyone knows, leaving business unfinished only leads to bad things happening.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
));

Halloween.Loc.Graveyard.description = function() {
	Text.Add("The graveyard you’re standing in right now is appropriately grim. Surrounded by a low, moss-covered stone wall, the only sign of life in this forsaken place are the handful of ravens perched on the remains of old, scraggly trees - the branches bare, the wood dead and dry. They caw angrily at you, then flap off to join the other ravens to wherever they’re going.");
	Text.NL();
	Text.Add("The wall aside, the construction of this graveyard is quite haphazard. Tombstones and graves lie hither and thither, some of them with freshly turned earth before them. Others have bouquets set before them, but the flowers are long dead and rotting. A few lamps would have provided illumination, no one’s been here to light them, so all you have to go on by is moonlight.");
	Text.NL();
	Text.Add("Deep in the heart of the graveyard lies a sinister-looking mausoleum. You can see a faint light flickering from within. A stone path leads to a nearby chapel, although there’s not much of it left.");
}

Halloween.Loc.Graveyard.links.push(new Link(
	"Path", true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.Path);
	}
));
Halloween.Loc.Graveyard.links.push(new Link(
	"Chapel", true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.Chapel);
	}
));

Halloween.Loc.Graveyard.onEntry = function() {
	var repeat = Scenes.Halloween.HW.flags & Halloween.Flags.Graveyard;
	Scenes.Halloween.HW.flags |= Halloween.Flags.Graveyard;
	
	if(repeat && (Math.random() < 0.5))
		PrintDefaultOptions();
	else
		Scenes.Halloween.Kiai();
}

Scenes.Halloween.Kiai = function() {
	var parse = {
		name : kiakai.name
	};
	var gender = kiakai.flags["InitialGender"];
	parse = kiakai.ParserPronouns(parse, "", gender);
	
	var werewolf = Scenes.Halloween.HW.Werewolf();
	
	var first = !(Scenes.Halloween.HW.flags & Halloween.Flags.Kiai);
	Scenes.Halloween.HW.flags |= Halloween.Flags.Kiai;
	
	Text.Clear();
	if(first) {
		Text.Add("Pacing through a graveyard tends to be disturbing even during the day, but nighttime turns it downright sinister, especially with a graveyard as run-down as this one. It’s clear that the grounds have been neglected for some time - out of the corner of your eye, you spy an abandoned shack by the wall that might have once housed a groundskeeper, but nothing lives there now save for spiders and the occasional bat. Ravens perched on tombstones croak at you as you move down the path through the graveyard, their beady little eyes watching every step of your progress.", parse);
		Text.NL();
		Text.Add("Then, without warning, they take flight, rising into the moonlit sky in a dark cloud of wings and feathers. The sudden alarm puts you on guard - what could have startled the birds so?", parse);
		Text.NL();
		Text.Add("The answer comes not from around you, but rather, <i>under</i> you. It begins as a soft scrabbling at first, then grows louder and louder until the earth atop the graves parts to reveal hands. And attached to them are arms, which are attached to shoulders, which are attached to… well, you get the point. One by one, elven zombies emerge from the cold, sodden earth, what looks like tens, no, hundreds of them possessed of an unearthly hunger…", parse);
		Text.NL();
		Text.Add("…Except, well, they don’t really <i>look</i> like zombies. The stitches are drawn on their skin in pencil and crayon, and what you originally took for the discoloration of rot is just a smattering of paint. Are you really in such a low-budget production that you can’t even get a proper cast of zombies to attack you? At least some expense could have gone towards getting some tattered rags for them to wear, lend the scene some ambience, but no… apparently, you’ve bummed out on getting a lazy writer and an equally worthless production cast, leading to every single one of the elf zombies being completely and utterly naked.", parse);
		if(player.Slut() >= 50)
			Text.Add(" Or maybe that’s not such a bad thing, when you think about it a little more…", parse);
		Text.NL();
		Text.Add("As one, the elven zombies take up a bone-chilling moan as they begin shambling towards you, arms outstretched and reaching for you in the classical pose of the living dead.", parse);
		Text.NL();
		Text.Add("<i>“…Sex…”</i>", parse);
		Text.NL();
		if(player.Slut() >= 50) {
			Text.Add("Hey, that doesn’t sound like too bad of an idea, to be honest. It’s not as if they actually <i>look</i> dead, anyway - in fact, some of the elves are quite sexy, and the others… well, you can’t get everything you want in a gangbang. Or maybe you can, but there aren’t enough holes in you to take them all.", parse);
			Text.NL();
			Text.Add("Still, maybe this would be better somewhere more comfortable. You vaguely remember hearing somewhere that having fun in a graveyard leads to all sorts of things growing in all sorts of places, and that’d put a crimp on future fun.", parse);
		}
		else {
			Text.Add("All right, now <i>that’s</i> disturbing. Zombies moaning and groaning in hunger for the flesh of the living is one thing, but them moaning and groaning for an entirely different sort of hunger is just <i>wrong</i>, no matter how you slice it.", parse);
		}
		Text.NL();
		Text.Add("Try as you might, though, you can’t seem to find a way out of the circle of zombies that’s erupted all around you; while they might be slow, there’re simply so many of them that evading all the zombies might be problematic.", parse);
		Text.NL();
		Text.Add("To make things worse, at their head is [name]. You’d recognize [himher] anywhere, the poor elf’s violet eyes soulless and empty, devoid of personality, thrall to the hunger that animates [hisher] husk of a body.", parse);
		Text.NL();
		Text.Add("<i>“…Brains…”</i>", parse);
		Text.NL();
		Text.Add("Well, it’s nice to know that <i>someone</i> has [hisher] priorities right.", parse);
		Text.NL();
		Text.Add("<i>“…Fuck out… brains…”</i>", parse);
		Text.NL();
		parse["gen"] = gender == Gender.male ? "massive boner" : "oozing cunt and engorged clit";
		parse["w"] = werewolf ? " even with your werewolf strength" : "";
		Text.Add("Oh-kay. Well, that’s nice. Judging by the [gen] [name]’s sporting, looks like [heshe] means it, too. Right - with the zombies closing in and looking to force you into sating their uh, hunger, you’d probably be best looking for a way out of this. It’s clear that there’s too many of them for you to fight directly[w], so you’d better actually use your brains for once.", parse);
	}
	else {
		Text.Add("As you enter the graveyard once more, you look around cautiously for signs of zombie elves. Right, no sign of the lustful undead in sight - maybe you can get to where you’re going without -", parse);
		Text.NL();
		Text.Add("<i>“…Fuck?”</i>", parse);
		Text.NL();
		Text.Add("Oh, fuck. How <i>do</i> the things manage to get so close without you noticing? With all the slow shambling they do, you’d have imagined you’d have heard them coming a long way away, but nooooo…", parse);
		Text.NL();
		Text.Add("As you look on, more and more of those damned elf zombies are popping up from places you thought impossible - under the eaves of old buildings, behind trees, from behind low gravestones and more. Why, it’s almost as if they were waiting for you to return and render yourself vulnerable…", parse);
		Text.NL();
		Text.Add("Ugh. Fine. How are you going to get rid of these pests this time?", parse);
	}
	Text.Flush();
	
	//[Run][Item]
	var options = new Array();
	options.push({ nameStr : "Run",
		tooltip : "Come on, they’re slow, shambling things. If you can’t outrun them, you need to cut back on the carbs.",
		func : Scenes.Halloween.KiaiRun, enabled : true
	});
	options.push({ nameStr : "Item",
		tooltip : "Maybe there’s something on you that could help.",
		func : function() {
			Text.Clear();
			Text.Add("Right, right. You rummage about in your possessions, seeing if there’s anything you could use in order to get you out of this bind. Alternatively, if you don’t have anything on you to your liking, there are other things you could do…", parse);
			Text.Flush();
			
			//[Stake][Holy Water][Garlic][Shades][Dog Bone][Run]
			var options = new Array();
			options.push({ nameStr : "Stake",
				tooltip : "Put the weapon you received to good use!",
				func : function() {
					Text.Clear();
					Text.Add("Right, the stake! You draw out the stake the Elder gave you, complete with its rubber fixing, and advance upon the nearest zombie - a rather buxom specimen of a young elf woman, had she not been a zombie. Gathering all your strength, you thrust your blessed weapon straight for the vile creature’s heart -", parse);
					Text.NL();
					Text.Add("- And end up slightly embarrassed as it catches in the zombie’s cleavage, a perfect fit for the length and breadth of your stake. Grunting, you do your best to extricate it from its current predicament, but with not much success; all you manage to do is to wiggle your “stake” around quite a bit, eliciting whorish moans from the zombie in question. Seeing as how they’re missing out on a good bit of fun, that only encourages the other zombies to redouble their pace, practically creeping up on you while you continue your efforts to retrieve your weapon.", parse);
					Text.NL();
					Text.Add("Alas, it dawns on you too late that stakes are supposed to be used against vampires, not zombies. Sure, they’re both undead, but that’s like saying that cats are dogs because they both walk on all fours.", parse);
					Scenes.Halloween.KiaiGangrape();
				}, enabled : true
			});
			if(party.Inv().QueryNum(Items.Halloween.HolyWater)) {
				options.push({ nameStr : "Holy Water",
					tooltip : "Holy water’s supposed to be good against the undead, isn’t it?",
					func : function() {
						Text.Clear();
						Text.Add("Rummaging about in your possessions, you feel your fingers close about the canteen of holy water in your possession. Or is that “holee”? When the walking dead are advancing upon you, who cares? Unscrewing the top off the canteen, you hurl the holy water at the nearest zombie at hand.", parse);
						Text.NL();
						Text.Add("What happens next wasn’t exactly what you expected of water: the moment the clear liquid comes into contact with the zombie in question, it erupts in a sheen of deep blue flames.", parse);
						Text.NL();
						Text.Add("<i>“… Melting! Melting!”</i> And sure enough, the zombie <i>is</i> melting, leaving little more than a small puddle of bubbling goo where it once stood. Well, that was disturbing - or downright comical, depending on how you look at it. It also seems that the few hundred other zombies immediately surrounding you found the sight as morbid as you did, for they now begin swarming you with renewed determination - and oh, hey, look! You only had one canteen of “Holee water”, and you just spent it all on that one zombie!", parse);
						Text.NL();
						Text.Add("Well, that was pretty silly, you can’t help but think as the zombies close in on you. Sure, if there’d been just that one zombie you might’ve gotten off scot-free, but against a whole horde?", parse);
						Text.NL();
						Text.Add("Naaaah. Oh well, it’s something to remember for next time.", parse);
						Scenes.Halloween.KiaiGangrape();
					}, enabled : true
				});
			}
			if(party.Inv().QueryNum(Items.Halloween.Garlic)) {
				options.push({ nameStr : "Garlic",
					tooltip : "Maybe the garlic can help you here. It repels evil, right?",
					func : function() {
						Text.Clear();
						Text.Add("Thinking quickly, you draw the string of garlic out from the pack and hang it around your neck. While its reputation for warding off evil is most commonly associated with vampires, you’re pretty sure it extends to zombies as well - or so you hope. The string of bulbs isn’t just heavy - it stinks to high heaven with you just wearing it, and already you can see the zombies nearest to you shrinking back from the overpowering stench.", parse);
						Text.NL();
						Text.Add("<i>“…Ew…”</i>", parse);
						Text.NL();
						Text.Add("<i>“Stinks…”</i>", parse);
						Text.NL();
						Text.Add("And by the looks of it, a potent libido-killer, too. The formerly sex-crazed fiends can’t back away from you quickly enough, boners going limp and cunts drying out as they scramble over each other in their haste to get away from you. If nothing else, this proves that bad smells are a certain turn-off - not that anyone with a smidgen of common sense needed that proven. Within a handful of minutes, the zombies are gone, turned neatly away by the power of root vegetables.", parse);
						Text.NL();
						Text.Add("That seems to handle that, then. You’re not going to spend the rest of the night with this thing around your neck, so you slip it off and replace it in your bag - but nevertheless keep it within easy reach if the zombies ever decide to get frisky again.", parse);
						Text.Flush();
						
						Gui.NextPrompt();
					}, enabled : true
				});
			}
			if(party.Inv().QueryNum(Items.Halloween.Shades)) {
				options.push({ nameStr : "Shades",
					tooltip : "The shades! You're not sure how they will work against the zombies, but perhaps it's time to try your luck...",
					func : function() {
						Text.Clear();
						Text.Add("You slip on the shades, and instantly feel cooler. About twenty percent cooler, to be exact. Zombies are so dumb that if you can’t see them, they think they can’t see you… that’s how the invisibility charm works, right?", parse);
						Text.NL();
						Text.Add("It works. Or at least, it seems to work. Instead of all their moaning and wobbling about, every single zombie in the graveyard suddenly stands stiffly stock-still, as if suddenly possessed by some dread force. Great, you can deal with that, so long as they’re not trying to violate you.", parse);
						Text.NL();
						Text.Add("You take a step back, and your breath catches in your throat as every single zombie on the cold earth takes a step back. A step forward, and so do they follow. A few more experimental movements later, and you’re pretty sure that so long as you keep these things on, the zombies are compelled to mirror your every movement. Now that’s something that you weren’t told… although it does give you an idea. Still a little unsure about this whole thing - you know, just in case the zombies are trying to lull you into a false sense of security with their behavior - you break into the first steps of a dance number.", parse);
						Text.NL();
						Text.Add("Against all common sense, it works. It really works. As one, the elven zombies act as your literal horde of backup dancers, and even better, a horde of backup dancers that won’t complain if you miss a beat or two. Or twenty, for that matter. Arms swinging, head swaying, you start towards the cemetery's exit, each and every one of the naked elf zombies falling in position behind you; you can’t help but wonder just what someone actually seeing you at this point would think. Sure, whether you’re actually any <i>good</i> at your improvised dance steps is another matter, but the fact that you have a horde of stepping, swinging zombie elf dancers in your wake should earn you some points, right?", parse);
						Text.NL();
						Text.Add("Out the cemetery gates, and onto the beaten path. When you reach the crossroads, you stop, and let the dancing horde of zombies tromp on their merry way to who-knows-where, you don’t know. So long as they’re not in your hair anymore - and they’re <i>probably</i> not heading in the direction of the camp - you couldn’t care where they ended up. Still dancing and shaking away, the zombies recede into the mists; the last you see of them is zombie [name] looking back and giving you a wink from [hisher] “rotting” face, before the lot is gone.", parse);
						Text.NL();
						Text.Add("Now <i>that</i> was a thriller.", parse);
						Text.NL();
						Text.Add("All right, enough play, time to get back to work. Once you’re absolutely sure the zombies aren’t going to be coming back, you slip off the shades and return to the now zombie-free cemetery to ponder your next move.", parse);
						Text.Flush();
						
						Gui.NextPrompt();
					}, enabled : true
				});
			}
			if(party.Inv().QueryNum(Items.Halloween.SqueakyToy)) {
				options.push({ nameStr : "Dog Bone",
					tooltip : "Do zombies like to play fetch?",
					func : function() {
						Text.Clear();
						Text.Add("Picking out the squeaky toy bone from your possessions, you brandish it aloft and press on it a few times. Ringing in the emptiness of the moonlit night, the squeaky noise sure gets the attention of every single zombie in the cemetery. Moaning angrily, the elf zombies redouble their efforts to get to you; you sure caught their attention well enough.", parse);
						Text.NL();
						Text.Add("All right, then. Straining, you wind back your arm and give the bone a good, hefty throw, sending the squeaky toy arcing through the air where it lands in the long grass amongst the headstones. However, the zombies seem less interested in the squeaky bone toy, than they do in you.", parse);
						Text.NL();
						Text.Add("You know, maybe that wasn’t the best of ideas. Zombies aren’t especially known for their love of playing fetch.", parse);
						Text.NL();
						Text.Add("Those just happen to be your last thoughts before the first of the shamblers sneaks up on you and lunges with arms outstretched, followed by five, ten, fifteen of its undead brethren.", parse);
						Scenes.Halloween.KiaiGangrape();
					}, enabled : true
				});
			}
			options.push({ nameStr : "Run",
				tooltip : "Uhh... on second thought, just run away.",
				func : Scenes.Halloween.KiaiRun, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Halloween.KiaiRun = function() {
	var parse = {
		
	};
	var werewolf = Scenes.Halloween.HW.Werewolf();
	
	Text.Clear();
	Text.Add("Oh, come on - this particular brand of zombie isn’t particularly fast, and it’s not as if you’re <i>completely</i> surrounded yet. Quickly, you look for an opening in the elven undead closing in on you, and make a run for it.", parse);
	Text.NL();
	parse["w"] = werewolf ? ", especially when you move that quickly on all fours" : "";
	Text.Add("As you expected, the slow-witted and bodied things don’t manage to catch up with you[w]. A few of them make a grab for you as you barrel by, but they’re too slow and you easily push them out of the way, breaking through the circle of zombies about you.", parse);
	Text.NL();
	Text.Add("It’s only when you’re sure that you’re in the clear that you slow down to catch your breath and look behind you. The elf zombies are still milling about amongst the gravestones, but at least they aren’t actively pursuing you anymore. They’re still down there, though, so it’s more than likely you’ll have to deal with them again at some point if you do head down amongst the headstones again later on.", parse);
	Text.Flush();
	
	var dest = Halloween.Loc.Path;
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		dest = Halloween.Loc.Path;
	}, 1.0, function() { return true; });
	/* TODO #randomly move PC to the mausoleum, burnt chapel or beaten path.
	scenes.AddEnc(function() {
		dest = Halloween.Loc.Mausoleum;
	}, 1.0, function() { return true; });
	*/
	scenes.AddEnc(function() {
		dest = Halloween.Loc.Chapel;
	}, 1.0, function() { return true; });
	scenes.Get();
	
	Gui.NextPrompt(function() {
		party.location = dest;
		PrintDefaultOptions();
	});
}

Scenes.Halloween.KiaiGangrape = function() {
	var parse = {
		name : kiakai.name
	};
	var gender = kiakai.flags["InitialGender"];
	parse = kiakai.ParserPronouns(parse, "", gender);
	parse = player.ParserTags(parse);
	
	var vag = player.FirstVag();
	
	var werewolf = Scenes.Halloween.HW.Werewolf();
	
	Text.NL();
	parse["w"] = werewolf ? " despite your werewolf strength" : "";
	parse["w2"] = werewolf ? "" : ", easily ripping apart your stripperiffic costume with their cold fingers";
	Text.Add("The first of the zombies comes into contact with you, and you shiver. The whole scene seems so comical - what with the zombies and their penciled-on stitches and makeup discoloration - but the fact that their numerous elfin hands are grabbing at your body, dragging you down to the ground[w] with their sheer numbers. You fight back as best as you can, but despite their individual frailness and lithe forms, the zombie elves easily overpower you and hold you prone[w2].", parse);
	Text.NL();
	Text.Add("<i>“…So horny… must fuck…”</i>", parse);
	Text.NL();
	Text.Add("Like water parting before a ship’s prow, the zombie horde flows apart to admit an undead [name], who promptly shambles up to you and comes to a stop at your [feet]. Now that you can see [himher] a little more clearly, the elf is actually…", parse);
	Text.NL();
	Text.Add("…Grinning? That’s not quite like -", parse);
	Text.NL();
	parse["l"] = player.HasLegs() ? " and force your legs apart" : "";
	Text.Add("Your thoughts are brought to a quick halt as zombie elves on either side of you grab your [thighs] with cold, rough hands[l], presenting you to their leader. A chill runs down your spine as [heshe] sizes you up with cold, unseeing eyes, so very different from that of the [name] you know.", parse);
	Text.NL();
	parse["v"] = vag ? "" : Text.Parse(" has the zombies turn you over and spread your ass cheeks before [heshe]", parse);
	parse["gen"] = vag ? parse["vag"] : parse["anus"];
	Text.Add("<i>“Prepare… ass…”</i> zombie [name] moans in a deathly, sepulchral voice. The other zombie elves are more than willing to echo the motion, those not involved in holding you down groaning and lurching all about. You swallow hard as [name] gets down on [hisher] knees, sizes you up, then[v] rams [hisher] fist straight into your [gen] without so much as spreading it apart with [hisher] fingers first. Not that the thickness of [hisher] fist and forearm makes any difference with the unnatural strength the usually frail-looking elf possesses in this form; your [gen] barely resists [hisher] intrusion, putting up a token twinge of complaint before giving up and allowing the intrusive appendage free entrance.", parse);
	Text.NL();
	Text.Add("Ugh! No lube is bad enough, but zombie [name]’s touch - well, it isn’t exactly <i>life</i>-draining, but with how cold it is it may as well have been as such. You gasp as [name]’s brutally violates your warm innards with [hisher] clammy fist, squirming and struggling instinctively against the <i>thing</i> that’s sucking all the heat out of your body.] It’s clear that [heshe]’s doing this in the most humiliating way possible, perhaps to make a lesson out of you to all the watching zombies - who by this time are openly fondling themselves to the spectacle of [name]’s arm pumping in and out of you with ruthless efficiency.", parse);
	Text.NL();
	if(vag)
		Text.Add("The friction of the undead elf’s wrist and forearm against your love-button sends a pleasant shiver down your spine, warmth blossoming in your nethers - before it’s quickly sucked away by [name]’s ice-cold touch. Still, the momentary flicker of pleasure is only heightened by the rough nature of the intrusion, your inner walls desperately trying to produce enough lube to keep up with the brutal fist-fucking you’re getting.", parse);
	else
		Text.Add("[name]’s wrist and forearm scrape against your sphincter as [heshe] rams in and out of you, and you wriggle and rock your hips in time to [hisher] brutal fist-fucking, trying to find a rhythm that will minimize the pain and sensations of having your anal walls stretched so wide. In response, [name] grins that evil grin of [hishers] again and breaks up the rhythm, twisting and turning inside your ass, sending you writhing in both ecstasy and agony, tears running down your cheeks as [heshe] spreads [hisher] fingers inside you, literally hollowing you out with [hisher] icy touch.", parse);
	Text.NL();
	Text.Add("<i>“…Share… suffering…”</i> zombie [name] gasps, roiling, icy mist starting to pour from [hisher] jaws. The chant is quickly taken up by the other zombie elves, who press in on you; you’re keenly aware of the fact that you’re about to be… well, whatever these cartoonish zombies have planned for you, it can’t be very good.", parse);
	Text.NL();
	Text.Add("Well, what a way to go.", parse);
	Text.NL();
	Text.Add("You nearly choke on the massive cock that your gullet suddenly finds itself stuffed with - in your current position, you can’t be sure exactly which of the milling elf zombies it belongs to, but it’s as bitterly cold as the fist currently lodged in your [gen], perhaps even more so. Stiff and rigid as an icicle, all nine inches of icy cockflesh begin pumping in and out of your throat and mouth with inhuman strength, numbing your innards from this side, too. Perfectly spit roasted in this manner, the last vestiges of resistance give in even as the rest of the zombie horde lays their deathly hands on you.", parse);
	Text.NL();
	Text.Add("Bereft of any extra holes or protrusions, the horny dead have to settle for grinding their sexual organs against any part of you that they can get ahold of; cocks and cunts rub back and forth against your [skin], leaving it slick with cold cum in a matter of moments. The deathly rattles of these so-called undead ring in your ears even as cock and fist alike work in tandem on either side of your body, one thrusting as the other pulls out, making sure that you’re always experiencing some form of icy suffering. Perhaps you would scream, but as always there’s the problem of all that elf cock between your lips. Oh well.", parse);
	Text.NL();
	Text.Add("Then it begins: streams of spunk arc through the air to land on you, splattering on your [skin] as the zombies reach climax. Clear female nectar squirts upon your form, mixing in with masculine seed; the flow is never ending, never abating. When the elf zombies by your side are spent, there’re always more jostling for their turn at you, grinding against the slick, cum-coated effigy you soon become. The cock in your mouth explodes, sending bitterly cold semen dribbling out of your mouth and into the grass below; it’s quickly replaced by a new one all fresh and eager to pick up where the last one left off.", parse);
	Text.NL();
	Text.Add("The only constant throughout this whole ordeal is [name]’s fist ramming into your [gen], ever faithful, ever… well, it’s not agonizing. In fact, you don’t think you feel much of anything anymore.", parse);
	Text.NL();
	Text.Add("Zombies: if they fuck you, you turn into one of them. Basic monster knowledge, that. You last sight before you pass out is that of [name]’s innocent yet downright cruel face, welcoming you into the ranks of the horny dead.", parse);
	Text.Flush();
	
	//BAD END
	Gui.NextPrompt(function() {
		Scenes.Halloween.WakingUp(true);
	});
}

Halloween.Loc.Chapel.description = function() {
	var first = !(Scenes.Halloween.HW.flags & Halloween.Flags.Chapel);
	Scenes.Halloween.HW.flags |= Halloween.Flags.Chapel;
	
	if(first) {
		Text.Add("Curious, you follow the stone path up to the chapel, and as you draw closer, you quickly realize why it’s in its current crumbling state. There’s clearly been a fire here at some point in time - charred timbers and blackened stone lie exposed amongst the ruins, and half the roof is missing, allowing bright moonlight to pour in from above. Nevertheless, you still need your lantern to light up the darker corners, especially towards the chapel’s interior.");
		Text.NL();
		Text.Add("Well, at least it doesn’t look like the place will collapse in on you anytime soon, despite its decrepit state, so you could explore a little if you choose to do so.");
	}
	else {
		Text.Add("Following the stone path to the burnt-out chapel once more, you step through the doorway and survey the area again.");
	}
	Text.NL();
	Text.Add("Regardless of who or what was once worshipped here, the sanctity of this place has most certainly been fouled. It’s not so much an actual smell than an aura of oppression that presses against you and makes you instinctively want to cringe - the burned pews and broken, grimy remains of the windows don’t help, either. As for the smell, it’s all old soot and ashes, another reminder of what must have happened here long ago.");
	Text.NL();
	Text.Add("There seem to be a couple of options open to you here: press on ahead and towards the chapel’s altar, or duck into the sacristy, which appears relatively intact.");
}

Halloween.Loc.Chapel.links.push(new Link(
	"Graveyard", true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.Graveyard);
	}
));
Halloween.Loc.Chapel.events.push(new Link(
	"Altar", true, function() {
		return !(Scenes.Halloween.HW.flags & Halloween.Flags.Laggoth);
	},
	function() {
		if(!(Scenes.Halloween.HW.flags & Halloween.Flags.Laggoth)) {
			Text.NL();
			Text.Add("The altar up ahead is lit up by a hellish glow. The source of the evil plaguing the chapel must be there!");
		}
	},
	function() {
		Scenes.Halloween.Laggoth();
	}
));

Scenes.Halloween.Laggoth = function() {
	var parse = {
		
	};
	
	Scenes.Halloween.HW.flags |= Halloween.Flags.Laggoth;
	
	var werewolf = Scenes.Halloween.HW.Werewolf();
	
	Text.Clear();
	Text.Add("Steeling yourself, you creep up through the charred pews towards the altar, taking advantage of what little cover the remains of the burned chapel afford to conceal your approach. The closer you draw to your destination, the stronger the stink of sulfur and brimstone becomes, until it’s thick in the air and your throat feels like it’s being seared with hellfire each time you draw a breath. Doubts begin to creep into your mind as to whether you’re doing the right thing in confronting this evil - no sense in throwing your life away needlessly - but you cautiously raise your head just above the barrier of blackened wood you’re behind to take in the situation.", parse);
	Text.NL();
	Text.Add("It’s certainly a hellish one, that’s for sure. Most of the high arched windows have been smashed into pieces, although there’s no sign of the glass debris that one would have expected. Perhaps they were shattered outwards, instead of inwards? If the pews were charred, there’s practically no furniture left standing, save perhaps the occasional pile of ash. In the place of the altar is a garish throne of a thousand skulls, each of them vaguely human. That can’t be very comfortable to sit on, especially when you can see the paint peeling and no one’s bothered to remove the price tags from most of them.", parse);
	Text.NL();
	Text.Add("Nevertheless, it doesn’t seem to bother the hulking figure sprawled out lazily on it. You squint a little, trying to make out who it is through the heat-hazed air, and it looks to be… ", parse);
	if(burrows.Access()) //#if Lagon met - same line
		Text.Add("Lagon? There <i>is</i> something similar about this figure and the lagomorph despot you know, something about the face that strikes you as too similar for comfort. Still, there’s little doubt that this <i>isn’t</i> the ruler of the burrows himself - the reddish orange fur should have tipped you off, let alone the crown that sits on his head or the stubby little horns that jut from his brow. He clutches a pitchfork in his right hand, and by the looks of it, he knows how to use it.", parse);
	else
		Text.Add("some sort of anthropomorphic rabbit demon, as far as you can tell. The crown perched on his head suggests that he’s a monarch of some sort, held in place by the twin horns which jut out from either side of his brow. Burning orange-red fur covers much of his body, and in his right hand, he clutches a rather impressive-looking and dangerously pointy pitchfork.", parse);
	Text.NL();
	Text.Add("Of course, that’s not to mention the massive two foot long cock and grapefruit-sized balls that this demonic monarch is sporting… or the hulking, muscle-bound body the aforementioned are attached to. You’re just about to duck back into hiding and plan what to do next when the demon king raises his head and sniffs the air.", parse);
	Text.NL();
	Text.Add("<i>“Fee, fi, fo, fum!<br/>", parse);
	Text.Add("“I sense an ass for my cum!<br/>", parse);
	Text.Add("“Be it alive, or be it dead,<br/>", parse);
	Text.Add("“I’ll… um… uh…”</i>", parse);
	Text.NL();
	Text.Add("Pausing in the middle of his impromptu rhyme, the demon king looks thoughtful and scratches his head with a finger. You can practically <i>see</i> the gears turning in his head - the only way things could have been more obvious would be if he’d gone completely cross-eyed. At last, he eventually gives up and rams the base of his pitchfork against the chapel’s floor, creating a terrible racket that echoes through the chapel’s empty halls.", parse);
	Text.NL();
	Text.Add("<i>“Get up! Get up, you lazy bastards! Your master demands you get up!”</i>", parse);
	Text.NL();
	Text.Add("As you watch, tiny rabbit-like imps - each one no taller than your knee - start swarming out from a pit in the chapel’s floor just behind and a little to the left of the demon king’s throne. There must be at least a couple hundred of them, perhaps more, and they all move with a certain reluctance that suggests that they aren’t quite happy to respond to their lord’s summons.", parse);
	Text.NL();
	Text.Add("<i>“How may we serve you, oh Lord?”</i> they chorus.", parse);
	Text.NL();
	Text.Add("Another smash of the pitchfork against the ground. <i>“That’s Super Ultra Delicious Wonderful Sexy Lord to you, wimps.”</i>", parse);
	Text.NL();
	Text.Add("<i>“How may we serve you, oh Super Ultra Delicious Wonderful Sexy Lord?”</i>", parse);
	Text.NL();
	Text.Add("The demon king roars, casting his burning visage across the terrified imps. <i>“No, no! You got it wrong! It’s Super DoublePlus Good Handsome Studly Lord! Why do I surround myself with idiots like you?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Because you’re our Supercalifragilisticexpialidocious ruler, oh Lord?”</i>", parse);
	Text.NL();
	Text.Add("A snort. <i>“Well, at least you chumps got it right on the third try, so perhaps you aren’t completely useless. All right, I smell a mortal ass somewhere in here, and it’s been three days since you lot brought in the last one! Your king demands that you bring it back so that I may engage in c… hmm… coterie? Cunninglus? Cotton? C-uh…”</i>", parse);
	Text.NL();
	Text.Add("<i>“Coitus?”</i> one of the bunny-imps pipes up nervously.", parse);
	Text.NL();
	parse["HeShe"] = player.mfFem("He", "She");
	parse["hisher"] = player.mfFem("his", "her");
	Text.Add("<i>“Yes, that’s the word. Bring the mortal to me! Now! [HeShe]’s hiding right over there! I <b>smell</b> [hisher] fear! A bit like chocolate, come to think of it.”</i>", parse);
	Text.NL();
	Text.Add("Busted! Your heart sinks like a stone as the demon king points a finger right at you. Dismissed by their master, the imp bunnies move like a horde of fire ants, swarming over the blackened floor and charred pews to get at you. There’s no hope of escape - for such small creatures, they certainly move fast, a number of them breaking off from the main body of imps to cut off your path to the exit. ", parse);
	if(werewolf)
		Text.Add("You howl and claw at the imps in bestial fury, but to little avail; the more of the little bastards you shake off from your fur, the more clamber onto you while your attention is occupied elsewhere. They’re just like ticks… only without the bloodsucking. ", parse);
	Text.Add("The remainder of the tiny imp lagomorphs quickly encircle your position, not quite touching you, but quickly herding you out of the pews and forward to where their king is waiting.", parse);
	Text.NL();
	Text.Add("<i>“So, what do we have here? Another mortal, it seems!”</i>", parse);
	Text.NL();
	Text.Add("Another? There were others here before?", parse);
	Text.NL();
	Text.Add("<i>“Naturally.”</i> The demon king sniffs. <i>“Allow me to introduce myself,”</i> he begins, moving a hand to his breast in what you think is supposed to be a dignified manner. <i>“I am His Highness Laggoth the Super Great Limited-Edition Superlative Risque, Ruler of The Pit - or this one, anyway - and Prince of the Aspect of Insufficient Light.”</i>", parse);
	Text.NL();
	Text.Add("Wait, that’s Laggoth the Super Great… what was it again?", parse);
	Text.NL();
	Text.Add("<i>“Hmph. If my full name and title are too much for your puny mortal in - uh, in, in in something…”</i>", parse);
	Text.NL();
	Text.Add("Intellect?", parse);
	Text.NL();
	Text.Add("<i>“Yes!”</i> Laggoth roars, sending the imps to cringing. <i>“If my full name and title are too much for your puny mortal intellect, then you may simply address me as Lord Laggoth.”</i>", parse);
	Text.NL();
	Text.Add("<i>“He never gets the super bit of his title right,”</i> one of the imps nearest to you whispers. <i>“Just play along with whatever he makes up on the spot and you’ll probably be all right. Probably.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Now! What business brings you to the seat of my throne on this plane?”</i>", parse);
	Text.Flush();
	
	//[Curiosity][Treasure][Fight Evil][Don’t Answer]
	var options = new Array();
	options.push({ nameStr : "Curiosity",
		tooltip : "You were just wandering about, no biggie.",
		func : function() {
			Text.Clear();
			Text.Add("Oh, no particular reason. You were just out here in the middle of the night, saw this burned chapel and thought to yourself that it might just be a nice place to do a little exploring.", parse);
			Text.NL();
			Text.Add("To your mild surprise, the demon king buys it lock, stock and barrel. <i>“Exploring? Exploring? How typical of you mortals to stick your noses into places where you don’t belong. Well, your curiosity has only led you to your doom!”</i>", parse);
			PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Treasure",
		tooltip : "You were here in hopes of nabbing some sweet loot.",
		func : function() {
			Text.Clear();
			Text.Add("Laggoth sneers at your answer. <i>“Not once in my long captivity in the Pit did I doubt that the greed of mortals would free me from my prison. Even after that, it seems that this particular trait will be downfall of your kind. No! You will not find any treasure remaining in this place, fool. Instead, all you will find is your doom!”</i>", parse);
			PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Fight Evil",
		tooltip : "You’re here to vanquish the forces of insufficient light!",
		func : function() {
			Text.Clear();
			Text.Add("You answer that you’re here to fight the evil lurking in the chapel - that is, Laggoth himself.", parse);
			Text.NL();
			Text.Add("The demon king’s laughter is loud and raucous. <i>“AH HA HA HA HA! HO HO HO HO! Ha! Ha! Ha!”</i> A few moments to catch his breath and more than a little wheezing, followed by much thumping of his furry, barrel-like chest. <i>“Oh dear. Oh dear. Oh dear.”</i>", parse);
			Text.NL();
			Text.Add("What’s so funny?", parse);
			Text.NL();
			Text.Add("<i>“Pitiful mortals, always running around with their stupid little toys. I’ve seen it all - holy water, daggers, whips with the souls of dead females in them, axes.”</i> The demon king strikes a pose on his throne, flexing his enormous muscles to show them off to you. There’s little doubt that he’s quite proud of his appearance, perhaps even vain. <i>“There is <b>nothing</b> that can hurt me, fool, so don’t even try! Here before my throne, you are at my mercy! Mine!”</i>", parse);
			Text.NL();
			Text.Add("Absolutely nothing?", parse);
			Text.NL();
			Text.Add("<i>“None except my only weakness, but you’ll never discover it. I’ll take delight in your pitiful attempts to figure it out before I’m done with you.”</i>", parse);
			PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Don’t Answer",
		tooltip : "Just keep mum, you don’t want to let on more than you already have.",
		func : function() {
			Text.Clear();
			Text.Add("Not intending to let on any more than you absolutely have to, you stare at the demon king in stony silence - or at least, as stony as you can muster while having to endure the sulfurous reek coming off him.", parse);
			Text.NL();
			Text.Add("<i>“Not one for answering questions, are we?”</i> the demon king continues with a sneer.", parse);
			Text.NL();
			Text.Add("No, you’re not one for answering questions.", parse);
			Text.NL();
			Text.Add("<i>“Struggle all you want against my magnificent presence, mortal! It will all be in vain in the end, for there is nothing that can harm me! Well, save for my only weakness, but you’ll never discover that in a thousand years!”</i>", parse);
			PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("He really does have a penchant for the melodramatic, doesn’t he?", parse);
		Text.NL();
		Text.Add("<i>“What’s that?”</i>", parse);
		Text.NL();
		Text.Add("What’s what?", parse);
		Text.NL();
		Text.Add("<i>“That word you used. Melo-something or the other.”</i>", parse);
		Text.NL();
		Text.Add("You fight the urge to hold your head in your hands. You don’t have the time for this nonsense; if he’s going to be this thick, this conversation is going to take all night. It might be played to your advantage - there might be some way you could trick this “Super Amazing Incredible One-Time-Offer Low-Cost” demon lord into at least letting you off, but that won’t do much if you die of frustration and boredom beforehand.", parse);
		Text.NL();
		Text.Add("So… just what does he want anyway?", parse);
		Text.NL();
		Text.Add("Laggoth glowers at you. <i>“A proper handjob, for starters.”</i>", parse);
		Text.NL();
		Text.Add("What?", parse);
		Text.NL();
		Text.Add("The demon king points at his two foot long cock. <i>“You wouldn’t believe how worthless these imps are. Until I start my conquest and actually get my hands on some more of you mortals, I’m stuck with them… and they can’t do a fuck worth a fuck. Isn’t that right?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Yes, oh Super Marvelous Fascinating Unbelievable Lurid one,”</i> the rabbit-imps chorus morosely.", parse);
		Text.NL();
		Text.Add("<i>“What was that? I didn’t quite hear you. Something about boiling the lot of you in hot oil?”</i>", parse);
		Text.NL();
		Text.Add("The imps mumble their answer yet again, louder this time. By now, it’s quite plain to you that they don’t follow their tyrannical leader out of any love for him… hm. That could be an interesting tidbit of information that might come in useful later.", parse);
		Text.NL();
		Text.Add("<i>“That’ll do. That’ll do.”</i> Despite his words, though, it doesn’t sound like Laggoth is very satisfied with his minions’ response. <i>“Now, since what I require of you is to spread word of the impending terror and conquest that is about to befall this world, as well as of my sexy physique, I shall permit you to ask a few questions.”</i>", parse);
		Text.NL();
		Text.Add("You are most utterly and completely bowled over by his great magnanimity.", parse);
		Text.NL();
		Text.Add("<i>“That. Whatever… that is.”</i> It seems like your sarcasm went completely over Laggoth’s head, kept on sailing, and eventually vanished into the great beyond.", parse);
		Text.Flush();
		
		Scenes.Halloween.LaggothQnA({});
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Halloween.LaggothQnA = function(opts) {
	var parse = {
		
	};
	
	//[Preferences][Conquest][Imps]
	var options = new Array();
	if(!opts.pref) {
		options.push({ nameStr : "Preferences",
			tooltip : "So, what’s he into anyway?",
			func : function() {
				Text.Clear();
				Text.Add("Laggoth looks a little startled at the question, the demon king narrowing his burning eyes. <i>“What’s it to you?”</i>", parse);
				Text.NL();
				Text.Add("Whoa, seems like he got all defensive at the question. Since you’re not going to get out of this without servicing the demon king in some manner, you thought that you might as well cater to his tastes a bit, give him more reason to be merciful with you. It’s not a very convincing lie - or at least, not to you, but you doubt that you need to be amazingly convincing when it comes to Laggoth.", parse);
				Text.NL();
				Text.Add("<i>“Hmph. As I said, you could give me a proper handjob.”</i>", parse);
				Text.NL();
				Text.Add("Surely that’s not the <i>only</i> thing he’s ever had in his existence, though. You can definitely see how that man-muscle of his might have trouble fitting in most orifices, but there are other things he could have done. Sure, he probably can’t have his cock sucked by most, but how about licked? Or maybe a little giving of oral on his part? Does he have a lady fiend friend to have some fun with? How about some catching?", parse);
				Text.NL();
				Text.Add("Lagon scowls, clearly suppressing a wince. <i>“Are you trying to say that I’m inexperienced, foolish mortal? You tread dangerously close to the edge of doom with your reckless tongue.”</i>", parse);
				Text.NL();
				Text.Add("Oh no no no no no, you’re sure that a big studly brute like him has plenty of experience. Perhaps you could put it in a nicer way - could he stand to be more adventurous?", parse);
				Text.NL();
				Text.Add("<i>“I am a Lord of the Pit!”</i> Laggoth roars, his long ears flopping about in his fury. <i>“A Prince of Insufficient Light! I do not give; I receive my due tribute from those who grovel at my feet! Grovel! Grovel!”</i>", parse);
				Text.NL();
				Text.Add("Oh, so that means he <b>does</b> catch anal after all? After all, it <i>is</i> counted as receiving, isn’t it?", parse);
				Text.NL();
				Text.Add("<i>“No!”</i> The ferocity of Laggoth’s roar sends a few of his imp minions scrambling for cover and almost blows you over. Guess you’ve bruised his particularly tender ego one too many times - or is there something more to it?", parse);
				Text.NL();
				Text.Add("<i>“You’re not going to speak any more of this.”</i>", parse);
				Text.NL();
				Text.Add("Fine, fine. Time to move on…", parse);
				Text.Flush();
				
				opts.pref = true;
				Scenes.Halloween.LaggothQnA(opts);
			}, enabled : true
		});
	}
	if(!opts.conq) {
		options.push({ nameStr : "Conquest",
			tooltip : "He really means to rule the entirety of this plane, eh? Any particular reason why?",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Because,”</i> Laggoth replies with full confidence, <i>“that’s what we Lords of the Pit do.”</i>", parse);
				Text.NL();
				Text.Add("Is that right? So, it’s something demon kings do, just like how salmon swim upstream to mate, puppies always end up as sluts, and mysterious rings always get found by entirely the wrong people?", parse);
				Text.NL();
				Text.Add("<i>“Yes, that is right! Cower, brief mortal! Cower in fear of your inevitable demise before my invincible, immortal and invulnerable power. The entirety of this world shall be plunged into insufficient light, and I will… uh… um…”</i>", parse);
				Text.NL();
				Text.Add("Look, you get the point. It’s not his fault really, if he hasn’t thought things through, it’s only because he’s a doer, not a thinker.", parse);
				Text.NL();
				Text.Add("<i>“…Do something about it! That’s right, I will do something about it! And then the world will pros… prostitute itself before my feet!”</i>", parse);
				Text.NL();
				Text.Add("Maybe the word he’s looking for is ‘prostrate’.", parse);
				Text.NL();
				Text.Add("Laggoth scowls. <i>“Yes. That. The armies of Insufficient Light shall sweep across this puny plane, and none shall be able to stand in our path! Go forth and herald my coming to your fellow mortals, and let them know that their only hope is to die, or live on as my slaves!”</i>", parse);
				Text.NL();
				Text.Add("That’s a nice thought, but why should you do it?", parse);
				Text.NL();
				Text.Add("<i>“Else they might get it into their minds to try something heroic, and the price of real estate goes down really fast if there aren’t enough slaves for everyone. You know, it’s not just location, location, location. So yes. My torments may spare your kind for a little while just yet.”</i>", parse);
				Text.Flush();
				
				opts.conq = true;
				Scenes.Halloween.LaggothQnA(opts);
			}, enabled : true
		});
	}
	if(!opts.imps) {
		options.push({ nameStr : "Imps",
			tooltip : "If he’s really that great and powerful, why’s all he got at his command a handful of imps?",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Why? Are you trying to tell me that my underlings are somehow inferior?”</i>", parse);
				Text.NL();
				Text.Add("Aw, come on. <i>Everyone</i> knows that imps are pretty much the punching bag of demonkind.", parse);
				Text.NL();
				Text.Add("<i>“We can settle this right now, you know,”</i> Laggoth replies, a nasty smile on the demonic bunny’s face. <i>“Hey, you lot down there! This mortal says that you’re inferior and pathetic! Surely you’re not going to take that insult lying down!”</i>", parse);
				Text.NL();
				Text.Add("The assembled imps glance at each other.", parse);
				Text.NL();
				Text.Add("<i>“Eh, I don’t know…”</i>", parse);
				Text.NL();
				Text.Add("<i>“I’d rather not do it…”</i>", parse);
				Text.NL();
				Text.Add("<i>“Will I get hazard pay for this?”</i>", parse);
				Text.NL();
				Text.Add("Bah. If you’d known the little buggers would be such reluctant minions, you’d have just pushed through them and made a break for it. Still, it just goes to confirm your suspicions that they’ve no love for their master.", parse);
				Text.NL();
				Text.Add("<b><i>“I said, you’re not going to take that insult lying down!”</i></b>", parse);
				Text.NL();
				Text.Add("<i>“No, oh Super Gracious Hyper Hung Happy Lord. We weren’t going to take it lying down; in fact, after you’ve sent the mortal off, we’re going to write a very strongly-worded letter to the nearest mortal leader.”</i>", parse);
				Text.NL();
				Text.Add("Laggoth’s face twists, and you wonder if the demon king is going to start bellowing again, but he instead slumps in his throne and plants his head straight onto his hands. <i>“All right, all right, you win, mortal. I got this bunch of useless idiots because Phil took all the succubi and I lost the coin toss for the bruisers, so I got these fellows as the last pick. They’re not the best, but they’re what I’ve got to work with.”</i>", parse);
				Text.NL();
				Text.Add("Aww. You could almost feel sorry for the poor bastard - then you remember that he’s an egoistic tyrannical asshole bent on conquering the world, and not too smart a one at that.", parse);
				Text.Flush();
				
				opts.imps = true;
				Scenes.Halloween.LaggothQnA(opts);
			}, enabled : true
		});
	}
	if(options.length > 0)
		Gui.SetButtonsFromList(options, false, null);
	else {
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("<i>“Enough talk!”</i> Laggoth suddenly roars, slapping a meaty hand down on the armrest of his throne. <i>“Have at you - oh, wait, that’s the wrong one, I was reserving that for the guy with the whip. Enough talk! I tire of this; minions, it is time! Prepare my cock!”</i>", parse);
			Text.NL();
			Text.Add("Showing a spark of enthusiasm for the first time, the imps quickly take up the call, echoing their master as a half-dozen of the demonic bunnies clamber atop his knees and begin stroking off his immense shaft. Working away like… like… to be honest, you don’t really want to give too much thought as to what a bunch of imps stroking off a huge demonic dick looks like. Or maybe you do, in which cause you’re quite the morbid fellow, aren’t you?", parse);
			Text.NL();
			Text.Add("Long story short, Laggoth’s already third leg-esque pole grows ever stiffer and larger, veins as thick as your fingers starting to rise on its surface. One knows what they say about bunnies and sex, but this is practically ridiculous - it’s not hard to see why the poor bastard is stuck with shitty handjobs. Hard to find a sleeve for a monster that large, especially when it twitches and quivers in that most unsettling fashion.", parse);
			Text.NL();
			Text.Add("<i>“The cock is prepared, oh Super Awesome Prodigious Extraordinary Unique Lord! We -”</i>", parse);
			Text.NL();
			Text.Add("The imp in question is shut up by a literal cockslap to the face as Laggoth rises from his throne, his ponderous pounder swaying from side to side as he approaches you, the flared tip of his shaft less than a hand’s span from your face.", parse);
			Text.NL();
			Text.Add("<i>“Now, mortal! Get to it! You shall have the honor of being amongst the first to sample the terror which awaits this puny plane!”</i>", parse);
			Text.NL();
			Text.Add("Gee… talk about a large ham. Or a big dick, as it were. It doesn’t look like there’s any running from your potentially sticky situation, so what do you do now?", parse);
			Text.Flush();
			
			//[Comfort][Resign][Distract]
			var options = new Array();
			options.push({ nameStr : "Comfort",
				tooltip : "It’s clear that Laggoth’s clearly trying a bit too hard at this demon king gig. He must be having a hard time to be overcompensating this much.",
				func : function() {
					Text.Clear();
					Text.Add("Look, you know this must be hard on him.", parse);
					Text.NL();
					Text.Add("<i>“Hard?!”</i> Laggoth roars, his cock and balls practically bouncing up and down from how… vigorous his motions are. <i>“I’ll have you know that I’m hard all over! I am hardness exam… examination!”</i>", parse);
					Text.NL();
					Text.Add("Exemplified.", parse);
					Text.NL();
					Text.Add("<i>“What you just said, brief mortal! And now for your insolence, I will crush you and -”</i>", parse);
					Text.NL();
					Text.Add("Yes, yes, you get the point. But you didn’t mean hard as in solid, you meant hard as in not easy. Or perhaps being inclined to be miserable would be more accurate. Come to think of it, how long has it been since he’s had a break? A day off from this whole “crush, kill and destroy” thing he does as a lord of the Pit?", parse);
					Text.NL();
					Text.Add("<i>“Uh… um…”</i> Laggoth practically goes cross-eyed as he tries to recall that little bit of trivia. <i>“I don’t quite remember…”</i>", parse);
					Text.NL();
					Text.Add("<i>“One thousand, two hundred and seventy-four years, o Super Amazing Fascinating Desirable Provocative Lord,”</i> one of the imps pipes up from behind you. <i>“And two hundred and four days, three hours, and twenty-seven minutes.”</i>", parse);
					Text.NL();
					Text.Add("See? He hasn’t had a vacation for so long - that just proves your point. It’s great that he takes his work seriously and really puts his back into it, but all this overtime is killing his productivity. Sure, his imps may be too terrified to be frank with him, but he really does need to shape up, lest he ship out. The first step to solving a problem is admitting it exists in the first place - and if he looks at himself in a serious light, he’s in far from the best situation he could be in at the moment. Off on a backwater plane like this, with a bunch of minions that no one else wanted, lurking around in a burned shell in the middle of a graveyard instead of some dark and foreboding fortress - seriously, now. Pathetic doesn’t even begin to describe how terrible his current situation is. He needs to stop covering up for his inadequacies so he can work at bettering himself.", parse);
					Text.NL();
					Text.Add("Deathly silence reigns in the chapel’s scorched halls, and the imps fidget uncomfortably. The stench of brimstone and sulfur grows a little, then dies down. At long last, Laggoth tears his gaze from you, the demonic bunny king burying his face in his palms.", parse);
					Text.NL();
					Text.Add("There’s something sobering about seeing an eight-foot beast hunched over on his throne like that. Heavy is the head who wears the crown, as the saying goes.", parse);
					Text.NL();
					Text.Add("<i>“All right, all right. It’s… it’s no use trying to deny it any more. I <b>am</b> pretty much hopeless. Can’t do anything right… I try so hard, and still nothing seems to work out.”</i>", parse);
					Text.NL();
					Text.Add("As you said, you can see that he’s putting effort into this whole demon lord business. His main problem is that he needs to work smarter, not harder - at the very least, he could stand to be less of a large ham.", parse);
					Text.NL();
					Text.Add("Laggorth frowns, looking genuinely puzzled. <i>“But I’m not made of pork.”</i>", parse);
					Text.NL();
					Text.Add("Not <i>that</i> kind of ham. He just needs to tone it down a little - just like his cock, bigger isn’t always better. No point having a dick that massive when no one can accommodate its length or girth, or if it gets in the way all the time. There are potions for that these days.", parse);
					Text.NL();
					Text.Add("But yes. Take for example, his title. No point having a large mouthful like that when he can’t even keep it straight. Best to have something short and simple like “the doomed”, “the wrathful”, or somesuch. Something which people can easily remember and pass along. It’s just hard to take a self-professed demon lord seriously when he’s being this overblown, and the first step to being a true terror is being taken seriously.", parse);
					Text.NL();
					Text.Add("<i>“Huh. So that’s what Phil’s been going on about all the time.”</i>", parse);
					Text.NL();
					Text.Add("That, and he could also stand to have a better relationship with his underlings. Maybe they’d be more inclined to stick their necks out for him if he’d try and cultivate some sort of rapport with them. You’re not asking him to be all chummy with the imps - that’d just be playing peasant and obviously contrived - but a more paternalistic outlook towards those he has responsibility for and power over wouldn’t be a bad start. The whole “lord it over your minions with an iron fist” thing may be perceived as common, but there’s a reason why such dark overlords tend to become hero fodder in the end.", parse);
					Text.NL();
					Text.Add("There’s a long silence as the demon king mulls this over.", parse);
					Text.NL();
					Text.Add("<i>“Look, mortal,”</i> Laggoth says at last, his voice a low rumble. <i>“I know I’m not the brightest torch in the box, even if people don’t tend to say it out to my face. It’s not as if I haven’t at least heard some of what you just told me. But the way you put it… well, I’ve got to think about it for some time, and got some questions to ask of my own people. Maybe try again and put my best foot forward the next time.”</i>", parse);
					Text.NL();
					Text.Add("That’s nice to hear.", parse);
					Text.NL();
					Text.Add("<i>“Yeah…”</i> the demon king hefts his ponderous member up with both hands. <i>“Not much point in this schlong of mine being so big if it keeps on dragging me down. It’s when you said that, then it all clicked together.”</i>", parse);
					Text.NL();
					Text.Add("Well… he <i>is</i> a bunny, even if he’s a burning, hellish one. In hindsight, it shouldn’t have been that much of a surprise, but you’re glad that you got through to him.", parse);
					Text.NL();
					Text.Add("<i>“I ought to take a break,”</i> Laggoth continues. <i>“Spend a couple years in one of the lower planes, think this through, make some changes to my life and try again with a bigger goal in mind than some little backwater plane. Stop trying to prove myself and actually go out and do it.”</i>", parse);
					Text.NL();
					Text.Add("Yes, yes, that’s the ticket. If he wouldn’t mind?", parse);
					Text.NL();
					Text.Add("Supporting his dangling schlong with a hand, the demon king stands and kicks his throne, which promptly crumbles into a pile of foul-smelling dust. <i>“Guess I oughta thank you.”</i>", parse);
					Text.NL();
					Text.Add("The pleasure’s yours, but whatever for?", parse);
					Text.NL();
					Text.Add("Laggoth begins to make for the pit in the back of the chapel, then stops and thinks a moment. <i>“I guess it’s because no one’s ever bothered talking to me like this before. It’s all either terrified cowering on the part of you mortals, or sneering when I go to those cocktail parties the others throw… I guess I just needed a voice of reason.”</i>", parse);
					Text.NL();
					Text.Add("Well, if he figured that out for himself, he can’t be <i>completely</i> dumb.", parse);
					Text.NL();
					Text.Add("<i>“Anyway! I ought to be going. Should get started on that vacation.”</i> For the first time since you’ve met him, Laggoth seems truly pleased. <i>“Don’t think we’ll be seeing each other again, but if we do, you’ll be seeing a newer, better me.”</i>", parse);
					Text.NL();
					Text.Add("Yeah, hope it works out for him. You watch as Demonic bunny king and minions all file straight into the burning pit, which then closes up with a grinding of earth and brick. The hellish light eventually fades, and then you’re standing all alone by the altar’s remains, the last of the brimstone-and-sulfur smell beginning to fade.", parse);
					Text.NL();
					Text.Add("Welp, that’s one great evil dealt with, even if it was in a rather unorthodox manner. Laggoth wasn’t such a bad guy, after all… although you don’t envy whoever’s going to have to deal with him after his makeover.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true
			});
			options.push({ nameStr : "Resign",
				tooltip : "Yeah… when you look at it, a handjob isn’t that big of a deal. You shouldn’t have come here without properly preparing yourself, anyway.",
				func : function() {
					Text.Clear();
					Text.Add("Eh, a handjob isn’t too bad a thing. He could’ve demanded to stick that monster of his into you, and that would’ve been something else altogether, but Laggoth seems to be a reasonable fellow - for a demon king, anyway. ", parse);
					Text.NL();
					Text.Add("Stepping up to the throne, you kneel down and get to work, shifting Laggoth’s schlong so it’s supported by his thigh. Three feet long and perhaps eight inches across, the demon king’s massive member provides ample space for you to start stroking away, moving your gentle touch along the entire length of his shaft from hilt to base. Reclining in his throne, Laggoth grunts and shifts, doing his best to keep his imposing and dignified airs. The poor bastard’s definitely got a serious case of overfilled balls, though, and you have no doubt he won’t be able to hold back for too long.", parse);
					Text.NL();
					Text.Add("With that thought in mind, you begin to increase the pace of your stroking, your palms moving in a zigzag fashion in a bid to cover as much ground as possible. Doing your best, you rub the sensitive points, you tickle the urethra and give gentle squeezes to the ridge of his glans with your palm as your hand slowly works its way up and down the massive cock it's grinding against. Before long, bubbles of pre start working their way up from the demon king’s balls, a viscous, steaming liquid that sizzles in the most disquieting fashion as it hits the ground. Instinctively, you cup a little between your fingers to serve as lubricant - it’s hot, but not painfully so - and soon Laggoth is sinking back into his throne, hips thrust forward in a bid to give you complete access to his shaft.", parse);
					Text.NL();
					Text.Add("That’s awfully nice of him! Soft squelches arise from your fingers as you continue working away at the mountain of manflesh that is Laggoth’s cock, feeling his pulse distinct under your fingers and veins bulging with pressure. As impossible as it might seem, his cock is trying to become even harder, <i>more</i> engorged, and you’re faintly aware that the stench of burning brimstone is only getting stronger in the air. When you’re done here, maybe a recommendation of some good cologne would help… surely as a demon king he’d be able to get some on his hands.", parse);
					Text.NL();
					Text.Add("Laggoth moans, and you smile in victory as the demon king gives in to the pleasure radiating outwards from his cock, dropping all pretense to airs as you continue stroking him off. Even the imp bunnies are just standing around, unsure how to deal with the sight of their lord and master so… so… <i>vulnerable</i>. Bubbling has turned to beading where his pre-cum is concerned, and you gather a little more in a hand before starting to work on his weighty balls. One hand still running along his shaft, the other moving down to his ballsack, you heft each of the demon king’s weighty nuts in turn, jiggling them up and down while you caress the head of his cock, bringing all his pent-up frustrations closer and closer to release.", parse);
					Text.NL();
					Text.Add("<i>“No! This isn’t… possible… how…”</i>", parse);
					Text.NL();
					Text.Add("His muscle-bound chest heaving, Laggoth groans and twists in his throne, pumping his cum-slick stiffy back and forth in your grip. All three feet of demonic bunny-dick forms a magical rod from which you control the demon king, and you can practically feel his balls churning with anticipation of release, his scrotum drawing taut about their sizeable weight. The squelching noises from your lewd act only grow louder and louder as your hands become a blur, thanks to the pre-cum that’s openly drooling from his tip, streamers of hellish seed hanging from his bloated cockhead and oozing to the ground below.", parse);
					Text.NL();
					Text.Add("He likes it, doesn’t he?", parse);
					Text.NL();
					Text.Add("<i>“Yes! I mean, no… how can I be reduced to thus by a mere mortal?”</i> Laggoth pants. <i>“Even my imps… even my imps can’t manage this, and they have so many hands…”</i>", parse);
					Text.NL();
					Text.Add("The point is to work smarter, not harder. More doesn’t always mean better; in fact, like his cock, there can actually be a point where it gets in the way. Doesn’t he know about diminishing returns?", parse);
					Text.NL();
					Text.Add("<i>“Dimi… what?”</i>", parse);
					Text.NL();
					Text.Add("Oh, right. You shouldn’t have expected him to be able to think, especially now of all times. Time to turn him into a blubbering fool - and you do this by bending your head down to his shaft and run your tongue along the length of the swollen, bulging veins that crisscross his cock. Laggoth whines wordlessly as you lick his massive dick like a massive lollipop, and while the thin coating of pre you’re using as lubricant isn’t exactly the most delicious thing you’ve ever tasted, it’s nonetheless bearable enough for you to hold your nose and get the job done.", parse);
					Text.NL();
					Text.Add("Well, time to finish up, then. Your body swaying in time with Laggoth’s furious, rhythmic thrusts, you give him a few more jerks - once, twice, thrice - and then there’s the unmistakable welling up of cum at the base of his shaft, the audible wet churning from within his balls as seed readies itself for imminent release. You barely have time to step back and out of the way before Laggoth roars and blows his load; you can practically see the cum-slit on the tip of his towering rod open up before a voluminous geyser of steaming seed fountains out onto the floor. The imp bunnies scream as gobs upon gobs of demonic sperm pelt down upon them like a rain of fire, gallons of the stuff blasting forth from their king’s cock and rendering them awash with jizz; some of them practically end up swimming in the stuff before it sloughs off thickly and flows away into the burnt pews.", parse);
					Text.NL();
					Text.Add("Panting and moaning like the stud in rut that he is, Laggoth twists to and fro in his throne, convulsing with pleasure and sending the spray of semen from his shaft arcing from side to side. Grinning, you doubly redouble your efforts, firmly encircling his shaft as best as you can with your hands and pumping up and down, desperately trying to milk the demon king for all he’s worth. The way Laggoth’s cock twitches and throbs in your hand, the feel of his cum rising through his man-meat - you’re going to give him the best handjob he’s ever had in all of the planes.", parse);
					Text.NL();
					Text.Add("Laggoth may be a bunny, but even he has his limits. Slowly, the gushing cum dies down to streamers, and from there to an oozing dribble. When he’s finally done, he’s turned the entirety of the burned chapel to a mess - even with all of his sperm spread out evenly on the floor, it’s high enough for his imp minions to wade through, and you’re only spared from having to squelch through it by standing on the base of his throne. A number of walls have suffered the wrath of his explosive cumshots, seed oozing down them like ghostly ectoplasm, and for a moment or two, the stench of brimstone is drowned out by the salty smell of jizm.", parse);
					Text.NL();
					Text.Add("At last, the demon king slumps in his throne, his erection visibly softening even as it leaks like an old faucet, his balls utterly spent. He tries to look at you, then groans and rolls his eyes skyward, his lungs heaving.", parse);
					Text.NL();
					Text.Add("<i>“Fuuuuuck.”</i>", parse);
					Text.NL();
					Text.Add("Yes, that’s what he just did. How was it?", parse);
					Text.NL();
					Text.Add("<i>“Good, good. Not bad for a mortal.”</i>", parse);
					Text.NL();
					Text.Add("Oh come on, you know you’re better than that.", parse);
					Text.NL();
					Text.Add("Laggoth raises a finger and look like he’s about to say something, but must’ve forgotten what it was, for he opens and shuts his mouth several times before groaning and giving up. <i>“Fuck. You know what? A place that gives handjobs as good as this should continue to give them out. I’m going back and asking for a reassignment - it’s not as if I shouldn’t be asking for somewhere more suited to stretch my wings, instead of some podunk backwater no-name plane.”</i>", parse);
					Text.NL();
					Text.Add("Yeah, he should do just that, move on with life. Seek greater heights!", parse);
					Text.NL();
					Text.Add("Laggoth grunts in reply, and tries to heft himself out of his throne. It doesn’t work - he’s simply too spent for that, the load he blew too great. Even the imp bunnies are groaning and simply lying down in the sea of cum their magnificent monarch has created, unable to do much else. Sure, the lot’ll eventually drain into the pit in the back, but it’ll probably take a long, long time.", parse);
					Text.NL();
					Text.Add("Anything else he has to say before you go?", parse);
					Text.NL();
					Text.Add("<i>“I… you have my permission to depart, mortal! Fear my… um… graciousness and feel my tender mercy at… sparing your plane… uggh… fuck…”</i>", parse);
					Text.NL();
					Text.Add("A final, pained gasp escapes Laggoth’s lungs, and the demon king collapses into his throne, utterly insensate. A cursory examination reveals that he’s not dead, just out of it… still, if he <i>had</i> died, what a way to go!", parse);
					Text.NL();
					Text.Add("Welp, that’s one point for you, and none for the evil demonic lagomorphs out of the pit. You’d call this quite the victory… as soon as you can find someplace to wash up. Turning on your heel, you wade through the sticky cum coating the floor and are off.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true
			});
			options.push({ nameStr : "Distract",
				tooltip : "You’re pretty sure you’ve figured out Laggoth’s weakness and think you can get him to look away for a moment.",
				func : Scenes.Halloween.LaggothDistract, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		});
	}
}

Scenes.Halloween.LaggothDistract = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Right. You step up to Laggoth, but have absolutely no intention of servicing the demon king’s tool in any way, shape or form. Despite his boasting to the contrary, you’re pretty sure you’ve figured out Laggoth’s weakness, and all you have to do is to get him to drop his guard for a moment or two while you put your plan into action. Given how vain he is, that shouldn’t be a problem…", parse);
	Text.NL();
	Text.Add("<i>“Stroke it, mortal,”</i> Laggoth grunts, leaning back in his throne. The demonic bunny king thrusts his hips forward to jab the three foot engorged shaft between his legs at you, and you can swear that the foul brimstone smell is coming directly from his long, glistening length.", parse);
	Text.NL();
	Text.Add("Well, fuck that. You’re not going to touch that monster, let alone give him a handjob. A nasty glint in your eye, you step up a little closer than intended, reach up, and knock Laggoth’s silly little crown clean off his head and onto the floor. The demon king clearly wasn’t expecting such an audacious move, for he makes no more to stop you - until it’s too late to do so. Time seems to slow as the little golden crown teeters, falls, and bounces off the foot of Laggoth’s throne before clattering to the floor and coming to a stop.", parse);
	Text.NL();
	Text.Add("There’s a sharp whistle in the room as every single imp present simultaneously draws breath.", parse);
	Text.NL();
	Text.Add("<i>“My crown!”</i> Laggoth roars, fury in his eyes. Bending forward - albeit with some difficulty owing to his massive prick - the demon king scrambles for his crown, his eyes completely off you. Now’s your chance to do what you need to do and help yourself defeat the enemy!", parse);
	Text.NL();
	Text.Add("…You hope. Now, let’s see as to whether your guess as to Laggoth’s weakness was right…", parse);
	Text.Flush();
	
	//[Holy Water][Stake][Garlic][Bread]
	var options = new Array();
	if(party.Inv().QueryNum(Items.Halloween.HolyWater)) {
		options.push({ nameStr : "Holy Water",
			tooltip : "Holy water should be effective against demons. Splash it on him!",
			func : function() {
				Text.Clear();
				Text.Add("Pulling the canteen of “Holee Water” out of your possessions, you quickly unscrew the top while Laggoth’s attention is occupied and upend it all over the demon king. The clear liquid washes its way over the demon king’s body, erupting into large plumes of blue holy flame that consume his entire form.", parse);
				Text.NL();
				Text.Add("<i>“Nooo!”</i> he cries, flailing about in a futile bid to put out the flames. <i>“What have you done!”</i>", parse);
				Text.NL();
				Text.Add("What have you done, indeed. Why, you’ve discovered his only weakness. You know, the one which he was so certain you wouldn’t be able to figure out. How does it feel now?", parse);
				Text.NL();
				Text.Add("<i>“Fool! Imbecile! That was most assuredly <b>not</b> my weakness!”</i>", parse);
				Text.NL();
				Text.Add("So, it was something else altogether?", parse);
				Text.NL();
				Text.Add("<i><b>“Yes!”</b></i>", parse);
				Text.NL();
				Text.Add("Well, it seems like he doesn’t very much like what’s happening to him at the moment, so you’ll just leave it at that.", parse);
				Text.NL();
				Text.Add("<i>“Curse you, mortal! Curse youuuuuu!”</i>", parse);
				Text.NL();
				Text.Add("Is it just you, or is Laggoth’s voice getting higher? Yes, it definitely is, and that’s not the only thing that’s changing about the demon king: as the flames continue to consume him, an interesting change gradually comes over his form. Hard edges begin to soften and fill out even as his defined musculature begins to vanish, replaced by a smooth, toned form. Panting and moaning with lust, the demon king drops to his knees and moans as he squirms on the ground, unable to withstand the sheer desire that’s rushing through his system.", parse);
				Text.NL();
				Text.Add("As you watch, the transformation begins rippling outwards from the demon king’s core, ramping up in speed as the process begins to get going. Muscle melts away from his midsection, chiseled abs sinking into his stomach as his midsection reforms itself into a curvaceous, toned waist. That extra mass is pushed both away in both directions: upwards into his chest, and downward towards his legs.", parse);
				Text.NL();
				Text.Add("You can’t believe your eyes, and lick your lips appreciatively as the demon king’s hips slowly begin plump up, his thighs parting as they’re forced apart by his now child-bearing hips. More and more of the mass from his waist flows into his buttocks, bringing with them a firm jiggle; you can see their solid, rounded shapes wobble ever so slightly as he wriggles on the floor. All in all, he’s definitely looking a lot more fecund now, what with all the fertile preparation.", parse);
				Text.NL();
				Text.Add("<i>“Noooo…”</i> Laggoth wails in between lustful pants and moans. He grabs his chest with his hands, desperately pushing down, but to no avail: more and more of his masculine features are melting away under the holy water’s influence as his firm pectorals grow soft and begin to rise with extra mass, the nipples capping them swelling to keep in proportion with his new breasts. Bigger and bigger his newfound lady lumps swell, from a B to a C and then jumping in a surge of growth straight to DDs. Yet - perhaps in a nod to the rock-solid muscle they grew from - his large, sumptuous breasts remain firm and perky, seemingly unencumbered by their prodigious size. Tentatively, Laggoth tests one of his swollen, puffy nipples between thumb and forefinger, and practically convulses on the floor in a fit of insatiable craving, his libido gone off the charts.", parse);
				Text.NL();
				Text.Add("Why, you think he - or rather, she - looks a lot better like this. If she’s going to be so bitchy, then she might as well look the part, yes?", parse);
				Text.NL();
				Text.Add("<i>“Curse you! How dare…”</i> the former demon king mewls, but you cut her off with a lazy wave of your hand. Your lecherous grin only widens as Laggoth’s face begins to change too, the once-strong masculine features becoming gentle and feminine while long locks of dark hair flow from her head. Square jaw and adam’s apple vanish, to be replaced with a smooth, pointed chin, wide eyes and long eyelashes.", parse);
				Text.NL();
				Text.Add("Not that down below has been spared, either. As the ghostly blue flames shift to Laggoth’s legs, you watch in satisfaction as her thighs begin to round out and soften to match her hips and butt, her calves and feet becoming daintier. But most of all is the spot that the transformation has saved for last: her nethers. One twitch, two twitches, three, and Laggoth’s enormous three-foot shaft begins to shrink into his body, vanishing away at a slow but steady pace.", parse);
				Text.NL();
				Text.Add("<i>“No! Noo…”</i> Laggoth pants out as she grabs her receding dick. For all her stroking and rubbing, though, there’s no way that she can stop it from withdrawing into her body, all three feet of erect manflesh withering away without a care in the world. At the same time, her balls draw tight against her groin, the hefty orbs disappearing into her lower belly one by one - you can actually see the bumps move upwards before finally vanishing, their virility no doubt converted to fertility as they become the ovaries for the demon queen’s freshly-grown womb. Laggoth is poised on the brink, and the tiny nudge required to tip her over comes from a fresh bulge in her lower belly that extends into groin. Moaning like a whore in heat, the demon queen sticks a furry hand between her legs and rubs away furiously as the bulge continues to grow, and finally, all that pent up vaginal flesh breaks out into the world. A squirt of fresh juices and an orgasm - the newly-minted doe’s very first - accompanies the blossoming of Laggoth’s womanly flower, and you can see the tiny remnants of her once-proud rod peek out from under her hood, now reduced to a perky and sensitive love-button.", parse);
				Text.NL();
				Text.Add("Finally, the last of the flames die down, and you step back to appreciate what you’ve made. Mm… she looks perfectly breedable, and doubly so considering she’s a bunny. All of Laggoth’s once-proud virility has been converted by the holy water to delicious, lush fertility, and a look back at the imps and their massive erections tells you that the cohorts are in agreement with you.", parse);
				Text.NL();
				Text.Add("<i>“Minions!”</i> Laggoth’s voice doesn’t travel very well, alas, on account of the mewls and moans she’s making as she explores her sensitive new femininity. <i>“I command you to… oooooh… avenge your master!”</i>", parse);
				Text.NL();
				Text.Add("The imps don’t move. Instead, their gazes are transfixed on Laggoth, and as one, the horde of demonic bunnies starts moving towards the throne.", parse);
				Text.NL();
				Text.Add("<i>“Minions?”</i>", parse);
				Text.NL();
				Text.Add("The little buggers don’t waste any time. Scampering up and onto their former master, each and every one of the imps jostle and shove against each other, vying for the best spot on this sweet chunk of female flesh. Well, best to leave them to it - smiling at a job well-done, you turn your back on the rather one-sided orgy and make to leave the chapel. The last sight you have of the now demon queen is that of two of her imps trying to fit their shafts into her tight, elastic cunt at once, one sliding his entire body through her bountiful breasts and several just grinding against her soft, hellish fur. There’s no doubt that after tonight, Laggoth will no doubt have a very different outlook on life.", parse);
				
				party.Inv().RemoveItem(Items.Halloween.HolyWater);
				
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
	}
	options.push({ nameStr : "Stake",
		tooltip : "That “stake” of yours is your only hope! Nail the demon king with your holy stake!",
		func : function() {
			Text.Clear();
			Text.Add("That’s it - the stake! Pulling the holy weapon out from your pack, you seize the opportunity by the throat and plunge the blessed dildo deep into Laggoth’s waiting pucker, putting all of your strength into the blow and ramming it in as far as it’ll go. There’s a brief moment of silence as time seems to slow to a crawl… and then the demon king roars and flails as he bursts into an enormous plume of sickly orange-green flames and acrid smoke. Groaning, he slumps to the floor face down with his ass raised high in the air, the blessed dildo still sticking up from between his butt cheeks, untouched by the flames and unsullied by ash.", parse);
			Text.NL();
			Text.Add("<i>“Curse you, mortal!”</i> Laggoth rasps, clawing at the ground with his hands in naked desperation. <i>“How did you know my only weakness?”</i>", parse);
			Text.NL();
			Text.Add("Well, when you think about it, it’s simple, really. He let off enough clues as to what it was… you weren’t exactly sure, but you did know that it involved anal sex. And since that “stake” of yours was the only thing that could do the job with any modicum of efficacy…", parse);
			Text.NL();
			Text.Add("Laggoth opens his mouth to speak, but what emerges from his lips is a hair-raising, hellish roar. A giant cloud of strange dark gas rises from the demon king’s prone form, leaching outwards from his fur, and then dissipates into the night air. Finally able to command some form of sense into his limbs, Laggoth reaches between his butt cheeks, wrenches the dildo from his asshole, and flings it onto the throne.", parse);
			Text.NL();
			Text.Add("<i>“Now you pay, mortal! For this insult, you meet your end in my crucible of hellfire!”</i> With an appropriately dramatic gesture - made somewhat less so by the fact that he’s still walking funny thanks to a stretched asshole - Laggoth raises his hands and waggles his fingers.", parse);
			Text.NL();
			Text.Add("Nothing happens.", parse);
			Text.NL();
			Text.Add("Looking more than a little concerned, the demon king raises his hands and tries again. <i>“Meet your end in my crucible of hellfire!”</i>", parse);
			Text.NL();
			Text.Add("Nope, nothing, nada.", parse);
			Text.NL();
			Text.Add("Raising his arms - a gesture which requires a bit of effort - Laggoth turns his gaze to the sky, fingers clawed as if reaching up to milk a giant cow. <i>“Noooooooo! My power! This cannot be!”</i>", parse);
			Text.NL();
			Text.Add("Well, seems like it is. Whatever he was expecting to do, he isn’t doing it - seems like he’s pretty impotent at the moment. Guess hitting him the vulnerables really stripped him of his powers, didn’t it?", parse);
			Text.NL();
			Text.Add("<i>“You haven’t bested me yet, mortal!”</i> Laggoth snarls, slapping his crown back on his head. <i>“Minions! Your Super Ultra Delicious Wonderful Good Lord and master demands that you rend the flesh off this puny mortal this instant!”</i>", parse);
			Text.NL();
			parse["heshe"] = player.mfFem("he", "she");
			Text.Add("<i>“Eh, I dunno,”</i> one of the imps pipes up. <i>“If [heshe]’s so puny, then why aren’t you doing the smiting yourself?”</i>", parse);
			Text.NL();
			Text.Add("<i>“If he can’t smite the puny mortal, doesn’t that mean he’s even weaker than one?”</i>", parse);
			Text.NL();
			Text.Add("<i>“No!”</i> Laggoth roars. <i>“I will not countenance such treasonous talk here before my throne! I command you - that’s right, all of you - to deal with this troublemaker right n- hey, what are you doing -”</i>", parse);
			Text.NL();
			Text.Add("The imps sure can move quickly when they put their mind to it, that’s for sure. Like fire ants up a tree, they now swarm the powerless demon king with much the same effect; while Laggoth roars and kicks away, sending imps flying, there’re simply too many of them for him to handle all at once. Despite the considerable size difference between master and minions, the former is quickly brought to his knees by the latter.", parse);
			Text.NL();
			Text.Add("<i>“Wow,”</i> an imp chitters as Laggoth topples to the ground with a crash. <i>“Never thought it’d be this simple.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Well, he doesn’t have his dark powers any more. We’ve got the mortal to thank for that.”</i>", parse);
			Text.NL();
			Text.Add("As one, the imps turn to you and start clapping. It’s a little weird, being congratulated in this manner, but you can understand it - they can’t have had a very pleasant existence in Laggoth’s eternal servitude. Finished, the imps turn their attention as one to a struggling Laggoth, and get to work.", parse);
			Text.NL();
			Text.Add("Yeah, they were definitely faking their incompetence earlier on. Quickly dividing a portion of their number into four groups of six, they work together to pin down the demon king’s limbs, their combined strength more than a match for the now-powerless Laggoth.", parse);
			Text.NL();
			Text.Add("<i>“No! Let me go! I command you to let me go! Treasonous scoundrels! Worms! You will be nothing without me! Do you understand? Nothing!”</i>", parse);
			Text.NL();
			Text.Add("<i>“Eh, we’ll take that chance.”</i> With that, an imp wanders up to you. <i>“Y’know, mortal… mind if we borrow that stake of yours? We’ll return it once we’re done; you can watch if you like.”</i>", parse);
			Text.NL();
			Text.Add("Oh, most certainly. You hand the imp the “stake”, then stand back to watch the fun. Brandishing it aloft, the little fellow hurries back to his fellows, and you barely conceal your glee as three of them heft the “stake” aloft, take aim, and ram it with all their might into Laggoth’s already stretched anus.", parse);
			Text.NL();
			Text.Add("The demon king roars, but is it from pain? All the same, his mutineering minions set about violating his asshole in the most thorough fashion possible; for someone who looks like he can dish it out very well, Laggoth sure can’t take it. Your so-called stake’s nowhere near the size of his massive member, but he roars and claws at the ground like a beast in agony, knuckles turning white. At least the other imps soon shut him up by stuffing their cocks into his mouth - three of them vying for the dubious honor of having their former despot suck them off all at once.", parse);
			Text.NL();
			Text.Add("It certainly is a group effort, if nothing else; the groups of imps rotate themselves, alternating between holding Laggoth down, reaming his ass, getting sucked off, or just standing there and jerking themselves off while playing the voyeur. Faster and faster your holy stake goes, deeper and deeper into his ass, and Laggoth’s cries grow less pained and more impassioned as his asshole adjusts to its new conformations. Despite his best efforts to hide it, his body betrays him: his hips start to gyrate in rhythm with the imps’ thrusts, his eyes rolling back in his head as pain slowly gives way to pleasure and reluctance gives way to eagerness.", parse);
			Text.NL();
			Text.Add("Well, well! You didn’t know the demon king was such an enthusiastic buttslut. Laggoth’s shaft bulges under him, desperately trying to attain its full length and girth while squashed under his weight, its straining and heaving a testament to his arousal. His cries are growing louder and louder through the gag of cocks in his mouth, his butt pounding away at the “stake” mashing itself against his prostate - more and more imps are required to hold down his form as it convulses with pleasure. With a final aching groan of release, the demon king cums vigorously - while you can’t see much of what’s happening, the rapidly growing pool of cum expanding outwards from his prone form is good enough for you. Considering the size of his balls, it’s little wonder that it only stops when it’s completely encircled the throne, slowly draining into the pit round the back.", parse);
			Text.NL();
			Text.Add("Chittering to themselves, the imp bunnies heave, and the “stake” pops out from Laggoth’s well-used asshole, smelling distinctly more of brimstone and sulfur than it was before it went in. Two of their number squelch through the thick cum puddle to return it to you, then go on their merry way.", parse);
			Text.NL();
			Text.Add("<i>“Don’t worry about us, mortal. We’ll handle this bastard and make sure he gets it good for aeons of keeping us down. This is a pretty nice plane, really, and you locals make good booze. We don’t want to conquer it - there’s something about not being conquered and trod under burning hooves that make people really want to knock out the good drinks.”</i>", parse);
			Text.NL();
			Text.Add("Well, once the word gets around that they stopped their master from going out and reducing this place to a hellish wasteland, you’re sure the locals will be more than willing to ply them with drink. Giving the imps one final wave, you turn and leave the altar, secure in the knowledge of a job well done.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true
	});
	if(party.Inv().QueryNum(Items.Halloween.Garlic)) {
		options.push({ nameStr : "Garlic",
			tooltip : "Garlic is supposed to ward off evil… let’s see if it’s strong enough to ward off this evil.",
			func : function() {
				Text.Clear();
				Text.Add("A determined glint in your eye, you bring out the string of garlic from your pack and wave it about. Gah, it stinks, almost as bad as the sulfurous stench that pervades the air! Nevertheless, you hold it out, hoping that it’ll… well… do something. Anything?", parse);
				Text.NL();
				Text.Add("Grumbling, Laggoth retrieves his crown the ground and plonks it back on his head, his gaze burning through you. <i>“Wretch! What is this? Hey, it actually smells pretty good.”</i>", parse);
				Text.NL();
				Text.Add("As you watch in equal parts amazement and horror, Laggoth yanks the string of garlic from your hands, tears a bulb off the end and pops it into his mouth raw. A loud crunching sound echoes in the chapel’s ruined halls as he chews away furiously and thoughtfully before swallowing.", parse);
				Text.NL();
				Text.Add("<i>“Hmm. Not bad, if a little on the light side, if I may say so. Perhaps this plane is not completely unworthy; I think I’ll subjugate instead of crush it. Perhaps find out where this plant is grown. However, this offering will not save you, mortal. For subjecting me to such a humiliation in front of my subjects, you deserve the most terrible of punishments, reserved only for those who dare cross me, the Super Delicious Amazing Wonderful Hot Lord of the Pit! Normally, I would fuck my way straight through you and into the next slut beyond, but there is an even worse fate… I sentence you to be cast into the Pit!”</i>", parse);
				
				Scenes.Halloween.LaggothPit();
			}, enabled : true
		});
	}
	if(party.Inv().QueryNum(Items.Halloween.Bread)) {
		options.push({ nameStr : "Bread",
			tooltip : "That stick of bread you have… it’s perfectly useable as a club. Go to town!",
			func : function() {
				Text.Clear();
				Text.Add("Yes! That stick of hard, stale bread in your hands… it looks like the sort of thing which could brain a minotaur and then go for seconds on anyone nearby. For goodness’ sake, the thing’s practically fossilized!", parse);
				Text.NL();
				Text.Add("Wielding it on one end like a club, you heave with all your might to raise the stale loaf over your head and bring it down on the demon king’s. Time slows for a moment as the bread sails down in a majestic arc, blurring through the air as it hurtles towards its unprotected target. Occupied with the task of retrieving his fallen crown, Laggoth doesn’t even begin to notice the inevitable…", parse);
				Text.NL();
				Text.Add("With a loud crack, the end of the stale loaf lands squarely on the demon king’s noggin and shatters into several chunks and a lot of stale, moldy breadcrumbs. You’re left holding the remains of the broken baguette in your hands and feeling rather silly about yourself. Come on, what did you expect was going to happen? A stale loaf of bread against a demon king? That was a rather poor choice in retrospect.", parse);
				Text.NL();
				Text.Add("Brushing his fur free of stray breadcrumbs, Laggoth plonks his crown back on his head and rounds on you, looking absolutely bestial at the moment. <i>“How <b>dare</b> you, mortal! You dare bring bread into my lair? You must fry! Not to mention the whole humiliating the Super Duper Ultra Wonderful Prominent Lord at the same time… I was going to let you off with a simple cock-stroking and maybe a little licking, but such insolence calls for extreme measures! To the Pit with this wretch!”</i>", parse);
				
				Scenes.Halloween.LaggothPit();
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Halloween.LaggothPit = function() {
	var parse = {
		skin : player.SkinDesc()
	};
	
	var werewolf = Scenes.Halloween.HW.Werewolf();
	
	Text.NL();
	Text.Add("<i>“The Pit! The Pit!”</i> The imps chant.", parse);
	Text.NL();
	Text.Add("<i>“Yes!”</i> Laggoth roars, pausing in between each word for dramatic effect, and raising his hands as if reaching up to milk a giant cow. <i><b>“TO. THE. PIT!”</i></b>", parse);
	Text.NL();
	Text.Add("Before you can react, the horde of imp bunnies has already swarmed you, quite literally sweeping you off your feet. ", parse);
	if(werewolf) {
		Text.Add("You howl and struggle against your captors, knocking away a few of the imps with your unnatural strength, but the imps are like a liquid, flowing and bending around your attacks while coming back around on the other side.", parse);
		Text.NL();
		Text.Add("Of course, even if you’d managed to extract yourself from the imps’ hold, there’s always the matter of the demon king himself. Strong as you might be as a werewolf, there’s no way you’re outmatching the brutish demon king.", parse);
	}
	else {
		Text.Add("You struggle against your captors, but to little avail. Individually the imp bunnies might be weak, but together they’re quite the formidable force and clearly used to working together against larger opponents. Quickly splitting off into groups, they work at pinning your limbs into immobility while the others hoist you aloft.", parse);
	}
	Text.NL();
	Text.Add("While all this is happening, Laggoth is jerking himself off, the demon king clearly taking no small amount of perverse pleasure in your helplessness. <i>“Your pathetic struggles are no match against even the lowliest of my minions, mortal. Perhaps you should have thought of that before you chose to defy me in so pathetic a manner. The Pit shall disabuse of that notion quickly enough!”</i>", parse);
	Text.NL();
	Text.Add("Right. The Pit. That thing right in the back of the chapel, the thing with the burning orange light and reeking stench? Don’t mind if you give it a pass, please.", parse);
	Text.NL();
	Text.Add("<i>“I revel in your misery, mortal! But first, could you please take this customer satisfaction survey so that we can better provide better service to the yet-to-be terrorized?”</i>", parse);
	Text.NL();
	Text.Add("What?", parse);
	Text.NL();
	Text.Add("<i>“On a scale of one to ten, how helpless do you feel at the moment?”</i>", parse);
	Text.NL();
	Text.Add("Well, you’ve just been surrounded and made at the mercy of a bunch of what are purportedly the punching bags of demonkind, so… maybe a seven or eight? A little on the high side, since this is being served with a side dish of humiliation.", parse);
	Text.NL();
	Text.Add("<i>“And how terrified are you?”</i>", parse);
	Text.NL();
	Text.Add("Well, you’re lying here quite peacefully, and not a gibbering wreck. In fact, you’re still giving coherent answers to stupid questions like these, so no, you aren’t very terrified. Maybe a two or three out of ten.", parse);
	Text.NL();
	Text.Add("<i>“If you could change anything about your experience about being conquered by a demon horde from the depths of the lower planes, what would you choose to change, aside from not being conquered, of course.”</i>", parse);
	Text.NL();
	Text.Add("Now that’s a tricky one, since the obvious question’s been taken out. Maybe tone down the obvious evil just a little? At least to the point where it isn’t becoming hilariously overblown?", parse);
	Text.NL();
	Text.Add("<i>“What do you mean? I did everything by the book! See?”</i> With a flourish, Laggoth pulls out a rather thick, dusty tome out from behind him and waves it in your face. On closer inspection, it’s got a large unhappy smiley on the cover, followed by the title “Evil made easy in twelve steps.” Yep that would explain things. <i>“The company manual is never wrong.”</i>", parse);
	Text.NL();
	Text.Add("Nah, there’s this “discretion” thing one needs to take into account. Right now, he’s being pretty overblown, and that’s working against him.", parse);
	Text.NL();
	Text.Add("<i>“We’ll take your feedback into careful consideration. Now…”</i> Laggoth clears his throat.  <i>“No more delays! <b>TO. THE. PIT!”</b></i>", parse);
	Text.NL();
	Text.Add("Squealing with delight, the imps waste no time hoisting you over to the edge of the infernal chasm. Laggoth follows you all the way, taking his time and grinning like a madman as he continues jerking himself off to the sight of you being carried to the Pit’s edge and tossed down in the most unceremonious fashion. As you fall, the demon king unloads a torrent of spooge down after you, splattering you in a heavy stream of burning spunk. It burns at your flesh and sears your [skin] as you tumble further and further down into the bottomless abyss, Laggoth’s mocking laughter echoing clearly in the walls of the Pit…", parse);
	Text.NL();
	Text.Add("Now… that was pretty anticlimactic. But then again, everything about Laggoth wasn’t all it was made out to be.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Scenes.Halloween.WakingUp(true); 
	});
}

Halloween.Loc.Chapel.events.push(new Link(
	"Sacristy", true, function() {
		return !(Scenes.Halloween.HW.flags & Halloween.Flags.Lenka);
	},
	null,
	function() {
		Scenes.Halloween.Sacristy();
	}
));

Scenes.Halloween.Sacristy = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Cautiously, you approach the charred doorway that leads into the chapel’s sacristy and take a look around. Whatever treasures might have been stored here have mostly been looted - there are a couple of paintings on the wall, smeared into obscurity with soot and ash, their frames blackened from heat. Shelves and cupboards stand empty gathering dust, and thin beams of bright moonlight filter in through the windows of multicolored stained glass. There’s a chill draft in the room, too, although you can’t quite figure where it’s coming from.", parse);
	Text.NL();
	Text.Add("The smell of old ash and soot ends here, though, replaced by a sickly sweet smell - as your eyes adjust to the dim, colored light of the room, you realize that the walls and parts of the ceiling are covered with roses. Large, black roses that grow from vicious-looking, thorny stems have found purchase in the chapel’s old masonry, each and every one of the sinisterly beautiful blossoms in full bloom. The woody stems that they grow from are an extremely deep shade of brown, tinged with red; their thorns glisten with some kind of disquieting liquid as they spread outwards throughout the room. It’s almost as if they’re - well, they <i>are</i> alive, just in a different way than most roses are…", parse);
	Text.NL();
	Text.Add("Slowly, you follow the roses to their origin, the one point from which they fan out: a stately four-poster bed that definitely looks utterly out of place in the sacristy. You’re pretty sure that definitely wasn’t here when this place burned down. Not only does it look utterly and irreverently out of place in this once sacred place, there’s also not a single mark on the rich ebony bedframe - nor on the heavy crimson drapes that obscure your view of anyone or anything that might be inside.", parse);
	Text.NL();
	Text.Add("Coupled with the sweet, alluring scent coming from the roses, the sight of this elegant, stately bed evokes a certain feeling of apprehension in you. Something tells you that approaching the bed without a plan would a bad idea…", parse);
	Text.NL();
	Text.Add("Will you do so anyway?", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Time to face whatever lurks here.",
		func : Scenes.Halloween.Lenka, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "This isn’t something you want to get tangled up with.",
		func : function() {
			Text.Clear();
			Text.Add("The roses, the thorns, the scent, the bed… you’re not quite sure that you’ll be able to handle whatever it is that’s hidden behind the drapes. Not just yet, anyway - you’re not running away, it’s merely a tactical retreat that you’re beating here. Slowly, you back away from the defiled, overgrown sacristy and once you’re out of sight of the doorway, make a dash for the pews.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Halloween.Lenka = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var werewolf = Scenes.Halloween.HW.Werewolf();
	var p1cock = player.BiggestCock();
	
	Scenes.Halloween.HW.flags |= Halloween.Flags.Lenka;
	
	Text.Clear();
	Text.Add("Right. You get the better of your instinctive aversions, and force yourself to move towards the bed; a shiver crawls down your skin as you swear the roses turn to follow your path through the room. Taking hold of the gold-trimmed velvet drapes in one hand, you draw them aside to reveal", parse);
	if(cveta.Met()) {
		Text.Add("... well. She may <i>look</i> like Cveta, but it clearly isn’t her. ", parse);
		/* TODO Cveta Brood levels
		if() //#if brood level = 6 - same line
			Text.Add("It’s true that their bodies are equally curvaceous, but there’s definitely something off about the way this one carries herself. This bird’s acting far more forward and suggestive as opposed to Cveta’s usual reserved nature, as evidenced by the ‘come hither’ look she’s giving you.", parse);
		else if() //#else if brood level >=3 - same line
			Text.Add("Her body is far more… ah, developed than Cveta’s currently is, but perhaps it’s a hint of what the songstress might look like in the future when her maternal nature’s fully blossomed. Still, her attitude and demeanor are completely off, her pose far more forward and suggestive as opposed to Cveta’s usual reserved nature. Slowly, she turns her gaze upon you and beckons you forward with a finger.", parse);
		else
		*/
			Text.Add("For one, instead of Cveta’s thin and waifish form, the avian woman lounging on the plush pillows and downy mattress is extremely voluptuous. It’s almost as if everything you knew about the songstress was inverted to create an evil twin of her - a very sexy evil twin, judging by the nasty grin and sultry “come hither” look she’s giving you.", parse);
	}
	else {
		Text.Add(" a young avian woman, by all appearances in the rich blossom of her womanhood, lounging on the bed’s rich trimmings. With her voluptuous form and the maternal airs that surround her, she cuts quite the figure - a sentiment that’s only reinforced as she looks directly at you and let out a husky, sultry hum from the back of her throat.", parse);
	}
	Text.NL();
	Text.Add("As she lies belly down on the mattress, you can make out a goodly number of details about her shamelessly advertised body. Her almost absurd hourglass figure is shaped by the swell of her hefty breasts - somewhere in the region of a high D or low DD - and more importantly, the wide, curvaceous hips and large, firm rump which blatantly advertise her prodigious fertility for all who care to look. By the looks of her, If she’s not already a mother, then it won’t take much effort to make her one. Stretching along the contours of her waist, the avian woman’s hair reaches in a river of bloody crimson all the way to her deliciously rounded rump, where the job’s taken over by her long, elegant tailfeathers.", parse);
	Text.NL();
	Text.Add("The feathers which coat her body are just a slightly lighter shade of the same color to differentiate them from her hair, save for the wide expanse of her powerful wings which lie splayed out to either side of the bed - each and every one of her flight feathers is a deep, glossy black. Jagged veins of burning purple stretch out from the shaft of each feather, lending her wings a soft, unholy glow.", parse);
	Text.NL();
	Text.Add("Noticing you taking her in, the avian woman reclines further into the soft, comfortable bed and stretches out on the sheets, displaying herself for you. Once she’s sure she has your undivided attention, she reaches down with a gloved hand - her black, arm-length velvet gloves being the only clothing she’s wearing - and traces a finger across the prominent line of her gash, swollen with heat and fecundity. To top it all off, a lopsided halo of infernal blood-red flames circles her brow, flickering away merrily with the occasional crackle. A demoness of some sort, then, you realize with shock; a fallen angel.", parse);
	Text.NL();
	Text.Add("<i>“Mm,”</i> she says with a chirp as she fixes deep emerald eyes on you, her voice as sultry and cloyingly sweet as the roses which surround her bed. <i>“What do we have here? How fortuitous; I was actually thinking I might have to get up to find a nice big cock for my purposes, and one delivers itself to my bedside! You brave the dead and demons alike to reach this place; surely your bravery must be rewarded! Why don’t you show me what you’ve got?”</i>", parse);
	Text.NL();
	if(!player.FirstCock()) {
		Text.Add("Surely she must be mistaken. You don’t have a cock, let alone a nice big one like she looks like she’s expecting.", parse);
		Text.NL();
		Text.Add("<i>“Oh, I can fix that,”</i> she drawls lazily. <i>“Now, get up here and don’t keep me waiting.”</i>", parse);
		Text.NL();
	}
	parse["c"] = werewolf ? "" : " strip off your costume and";
	Text.Add("Try as you might, there’s something about the avian demoness’ words that makes you really, <i>really</i> want to obey her. Part of you instinctively screams danger about this, but the greater part is consumed by a slavish need to cater to her every whim and desire. Not quite understanding what you’re doing, you[c] approach the bedside for her inspection.", parse);
	Text.NL();
	Text.Add("<i>“Allow me to introduce myself, my beautiful cum-pump. I am Lenka, Mother of Shadows - or at least, I will be once I can get some seed into me to create a lovely brood.”</i> She rolls over on her back and rubs her flat, slightly concave midriff for emphasis. <i>“Been quite busy settling in, you know…no time to go out and procure a male’s vital essence…”</i>", parse);
	Text.NL();
	Text.Add("Hey, you’re not a -", parse);
	Text.NL();
	Text.Add("Lenka snaps her gloved fingers, and your mouth feels like it’s been stuffed with a large hairball, effectively preventing you from saying another word. <i>“I don’t remember asking you to speak, cum-pump. I need you for breeding, not for talking - now let’s cut to the chase and see what we’re dealing with here.”</i> She turns her gaze to your exposed groin.", parse);
	Text.NL();
	if(p1cock) {
		if((p1cock.Len() >= 40) && (p1cock.Thickness() >= 5)) {
			Text.Add("<i>“Ooh.”</i> Lenka chirps and whistles appreciatively, rubbing her soft, full palms against your shaft in a bid to grasp as much cock as she can hold at once. <i>“That’s big, but there isn’t a dick so big that Mama Lenka can’t handle, so you’re not getting out of your duties that way, my dear.”</i>", parse);
			Text.NL();
			Text.Add("You’re pretty sure you didn’t have <i>that</i> in mind when you decided to make your tackle that impressive. Unfortunately, your protests go unnoticed by the avian demoness, who has her tongue hanging out her beak, practically giddy with anticipation of the dicking she’s dreaming of receiving from you.", parse);
		}
		else if((p1cock.Len() >= 20) && p1cock.Thickness() >= 5) {
			Text.Add("<i>“Ah, very satisfactory,”</i> she says with a giggle, <i>“but I’d like to appraise the goods in full.”</i>", parse);
			Text.NL();
			Text.Add("Wait, what does she mean?", parse);
			Text.NL();
			Text.Add("<i>“You’re really horny right now,”</i> the avian demoness whispers. <i>“Really, really horny.”</i>", parse);
			Text.NL();
			Text.Add("Just saying it in that sweet syrupy voice of hers somehow makes it real - in a moment, your [cocks] [isAre] achingly erect, straining at their tethers to reach the hand Lenka is snaking towards [itThem].", parse);
			Text.NL();
			parse["mc"] = player.NumCocks() > 1 ? "each shaft’s" : "your";
			parse["k"] = p1cock.Knot() ? ", then moves to gather your swollen knot in a hand, rubbing her palm all over it and making you dream of sticking that knot in her and filling her full of seed" : "";
			Text.Add("<i>“Ah, so eager,”</i> she whispers, running thumb and finger over the ridge of [mc] glans[k]. <i>“So obedient. That’ll do, my darling cum-pump. That’ll do just fine.”</i>", parse);
		}
		else {
			parse["biggest"] = player.NumCocks() > 1 ? " biggest" : "";
			Text.Add("<i>“Tch, is that all you’ve got? Good thing Mama Lenka’s here to give you a hand.”</i> Lazily, the avian demoness reaches out with a gloved hand and takes hold of your[biggest] [cock], her delicate-looking digits wrapping themselves about the shaft of man-meat with surprising strength. Once she has a firm grip, she presses fingers and thumb ever so slightly into your manflesh, running them across its contours.", parse);
			Text.NL();
			parse["all"] = player.NumCocks() > 1 ? " all" : "";
			Text.Add("The effect is instantaneous, with your [cocks][all] becoming fully engorged promptly. Lenka giggles before rewarding you with a few rapid strokes of her hand, fingers pumping up and down your length. <i>“Stay standing.”</i>", parse);
			Text.NL();
			Text.Add("Despite you shaking and shuddering, weakness creeping into your form, there’s something in the avian demoness’ honeyed voice that compels your body to obey. You can only gasp in pleasure, wonder - and a little fear - as she grabs you by the glans and begins tugging on the shaft in question, each gentle yank coaxing more and more manflesh out of your groin to be added to your phallus.", parse);
			if(player.NumCocks() > 1)
				Text.Add(" It’s a bit of a shame she didn’t do the same for your other shaft[s]...", parse);
			Text.NL();
			Text.Add("Nevertheless, Lenka doesn’t stop until you’re measuring a whole seven inches from base to tip, whereupon she croons and takes a moment to admire her handiwork.", parse);
			
			p1cock.length.IncreaseStat(18, 100);
			p1cock.thickness.IncreaseStat(5, 100);
		}
	}
	else {
		Text.Add("Ha! Joke’s on her; you don’t have any man-meat to speak of. This revelation doesn’t faze Lenka any, though, as the avian woman - or perhaps more correctly, avian demoness - simply chuckles and runs a fingertip in a small circle about the smooth skin of your groin.", parse);
		Text.NL();
		Text.Add("<i>“Oh dear. Well, no issue there; you’ll be producing issue just fine before long.”</i>", parse);
		Text.NL();
		parse["v"] = player.FirstVag() ? Text.Parse(" just above your [vag]", parse) : "";
		var canine = player.Race().isRace(Race.Canine);
		parse["k"] = canine ? ", complete with a knot at the base" : "";
		Text.Add("You have just enough time to wonder what she means before the lingering sensation of her touch grows red hot, dark magics gathering in your nethers. Your groin clenches, internal changes beginning and soon pushing out of your body[v] to form a brand new cock[k]. You groan and shudder as blood rushes to your new appendage, filling it as thick and straight as a ramrod even as it grows before your eyes. ", parse);
		Text.NL();
		Text.Add("Three inches, four, five… it’s only when your brand new shaft is a whole seven inches long and one and a half across that its development stops, leaving it twitching and aching to be used.", parse);
		
		p1cock = new Cock();
		p1cock.length.IncreaseStat(18, 100);
		p1cock.thickness.IncreaseStat(5, 100);
		if(canine) p1cock.knot = 1;
		
		player.body.cock.push(p1cock);
		
		// Reset tags
		parse = player.ParserTags(parse);
	}
	Text.NL();
	Text.Add("That dealt with, the avian demoness turns her attentions just a little lower. ", parse);
	if(player.HasBalls()) {
		var size = player.Balls().BallSize();
		if(size >= 12) {
			Text.Add("Crooning in delight, she palms each of your [balls] in turn, her nipples stiff and protruding from her chest feathers in response to her mounting excitement. <i>“Yes… yes, these will be very adequate. So much seed… such big broods these will create. You want it, don’t you? To feel your cum flooding my womb and thoroughly impregnating me? To blast off every last drop of your seed and have it all sucked up to create plenty of chicks?”</i>", parse);
			Text.NL();
			Text.Add("You feel like smiling and nodding is the right thing to do, so you do just that. Lenka chirps in approval, the avian demoness reaching up to caress your cheek with the back of a hand.", parse);
			Text.NL();
			Text.Add("<i>“There, you’re learning. There’s no reason to deny yourself what you want, to fuck silly a perfectly breedable female who explicitly wants to bear your spawn. Isn’t that every red-blooded man’s dream?”</i>", parse);
		}
		else if(size >= 8) {
			Text.Add("She takes her time appraising your seed factories, humming to herself and toying with your ballsack from time to time. Gentle strokes, quick caresses… they shouldn’t have been much, but even the lightest touch from the avian demoness is enough to set your [balls] churning in anticipation. Unbidden, lewd thoughts begin to invade your mind, thoughts of emptying your balls into her baby-making hole, of seeing her belly swell and ripen with pregnancy…", parse);
			Text.NL();
			Text.Add("This place <i>is</i> having an effect on you, and it’s not just the heavy floral scent in the air.", parse);
			Text.NL();
			Text.Add("Purring to herself, Lenka rolls your [balls] about in her hands, gently kneading and testing away. You’d never really thought about how <i>heavy</i> they were before now, or just how <i>full</i> they are… and come to think of it, they’re feeling even fuller as she continues her ministrations.", parse);
			Text.NL();
			Text.Add("<i>“Oh, you poor thing,”</i> Lenka purrs. <i>“All pent-up like that - how long has it been since you last had any release? Far too long, it looks like. Don’t worry, Mama Lenka will make sure that from now on, your balls will be drained on a regular basis. Isn’t that wonderful?”</i>", parse);
		}
		else {
			Text.Add("Upon seeing your [balls], the avian demoness clicks her tongue and shakes her head. <i>“Oh, no no no no,”</i> she says with a sultry sigh that sends her bountiful chest heaving. <i>“These simply will not do; I simply can’t have any cum-pump of mine running dry before the fun’s even halfway done. Happily, Mama Lenka can improve those for you. Wouldn’t you like your balls to be improved, cum-pump?”</i>", parse);
			Text.NL();
			Text.Add("Dreamily, you reply that you indeed agree with her most wholeheartedly, although you’re not quite sure what it is that you’re agreeing with…", parse);
			Text.NL();
			Text.Add("Lenka practically purrs in delight. <i>“Let’s begin, then. No point wasting time.”</i>", parse);
			Text.NL();
			Text.Add("Reaching out, the avian demoness takes your seed factories in the palm of her hand, curling her fingers just so that she’s firmly cupping your balls. The feel of black velvet against scrotal skin is heavenly, no, almost orgasmic, and you can’t help but dribble a little pre from your [cockTip] at her touch. Dark tendrils of energy rise from Lenka’s fingertips, curling as they rise and penetrate your nutsack, seeping into your [balls].", parse);
			Text.NL();
			Text.Add("If her touch was heavenly, feeling her rolls your balls in her hand is divine altogether. Soon, your scrotum is feeling uncomfortably taut as your balls begun to swell; you can <i>feel</i> them growing weightier, stronger, more virile. You can practically imagine your little swimmers getting more and more agitated as they start running out of room, desperately seeking release…", parse);
			Text.NL();
			Text.Add("<i>“Mm… more seed for me to suck out and grow my brood with,”</i> Lenka croons melodiously as she looks upon your inflating testicles with undisguised approval. Her simpering shouldn’t fool you, you know it’s an act - and yet it works anyway. At least you’re not the only one getting turned on by all this - Lenka herself is openly caressing her lower belly with a free hand, the avian demoness panting heavily as she dreams of being impregnated with your sperm.", parse);
			Text.NL();
			Text.Add("It’s only when your balls are amply sized that she deigns to let the growth stop, giving them one last affectionate caress before moving on.", parse);
			
			player.Balls().size.IncreaseStat(8, 100);
		}
	}
	else {
		Text.Add("<i>“Tch, lacking in the most important department,”</i> Lenka says sourly. <i>“Well, I’ll just have to fix that.”</i>", parse);
		Text.NL();
		Text.Add("Without warning, her fingers snake out, running along the underside of your [cocks] down to [itsTheir] base to draw some sort of symbol on your skin. Nothing happens at first, then an ominous squirming begins in your groin as internal changes begin. Skin and flesh quickly loosen to form a brand new scrotum, then you’re wracked from head to toe in spasms of sheer pleasure.", parse);
		Text.NL();
		if(player.FirstVag()) {
			Text.Add("You can’t be completely certain, but you swear you can <i>feel</i> your ovaries swelling, growing as internal pressure mounts, then… dividing and changing…", parse);
			Text.NL();
		}
		Text.Add("Moments later, a fresh pair of amply-sized balls pops out beneath your [cocks], already churning with seed as they prepare themselves for business.", parse);
		Text.NL();
		Text.Add("<i>“Much better,”</i> Lenka says, cupping your newfound assets in the palm of a hand and rolling them about as she tests their weight. The feel of velvet against stretched, sensitive skin is practically divine, and the avian demoness titters and giggles. <i>“Much, much better. Don’t you agree, cum-pump?”</i>", parse);
		
		player.Balls().size.IncreaseStat(8, 100);
		player.Balls().count.IncreaseStat(2, 100);
	}
	Text.NL();
	if(player.HasPerk(Perks.Breeder)) {
		Text.Add("<i>“And so exceptionally virile, too.”</i> Sniffing at you and letting out a long, appreciative sigh, Lenka trails her fingers over her lower belly, just above where her cum-hungry womb lies, then lets her fingers run down to her cunt. Eyes trained on your [balls], the avian demoness openly caresses her wet slit in front of you, then moans lewdly, her breathing growing harder and faster by the moment.", parse);
		Text.NL();
		Text.Add("<i>“Fuck this, I can’t take it anymore! It’s time for your reward, cum-pump!”</i> ", parse);
	}
	Text.Add("Greedily, Lenka rolls over to make space for you on the expansive bed. <i>“Get in here, you. I command you to breed me, to fertilize each one of my eagerly waiting eggs and create monsters to terrorize the world with. You’ll love me, and nothing else; you’ll have the honor of fathering the first of my many, many lovely children.</i>", parse);
	Text.NL();
	Text.Add("<i>“Stay here, and be my breeding stud for the rest of eternity; stay here, and watch the fruit of my womb bring all of existence to its knees.”</i>", parse);
	Text.NL();
	parse["w"] = werewolf ? " animal" : "";
	Text.Add("Between the magic of her voice and the cloying, captivating scent of the black roses that fill the former sacristy, you can feel the last vestiges of resistance crumbling away. The fact that Lenka is oh-so-perfectly breedable doesn’t help, either; your[w] hindbrain is screaming at you to go and make babies with this glorious specimen of formerly heavenly fecundity. The bed, it’s so firm, soft and comfortable, surpassed only by your mistress-wife’s presence beside you.", parse);
	Text.NL();
	Text.Add("A last, tiny voice in your mind screams that this fallen symbol of feminine, fertile perfection isn’t your mistress or your wife, but is quickly snuffed out when Lenka pulls you into her embrace. Her feathers, gloriously hot - each one burns with the infernal fires of the Dark Aspect, and you lovingly reach up to straighten her flaming halo, only to have it fall back into its original lopsided position once your fingers leave it.", parse);
	Text.NL();
	Text.Add("<i>“Don’t bother, silly,”</i> Lenka chides. <i>“It’s been like that since forever; I’ve never been able to set it straight. Now, come here and let Mama Lenka give you a very special hug.”</i>", parse);
	Text.NL();
	Text.Add("Yes, yes… you want this. Anything that magical voice commands of you. The avian demoness shoves you back into the mattress, then pounces on you, nuzzling you aggressively with her beak. Her scent - practically indistinguishable from that of the roses - fills the world, and her soft, teardrop-shaped breasts push against your body, warm with promise, her nipples stiff and erect. You can <i>feel</i> her heat-filled breeding hole grind against your stomach, leaving a trail of slick moistness, wet feathers spreading her girl-cum like a paintbrush. Butterflies erupt in your stomach, and in this moment, you want nothing more than to have the honor of servicing this fertility goddess kneeling on the mattress in front of you.", parse);
	Text.NL();
	Text.Add("Lenka giggles, then her deep emerald eyes gleam with predatory hunger. Before you know it, she’s atop you, pinning you on your back to the mattress while your throbbing, engorged cock pokes up between her perfectly shaped thighs. With deliberate slowness and no small restraint on her part, the avian demoness grinds the thick, prominent lips of her pussy against your glans. You can’t help but cry out as pre-cum oozes from your [cockTip], triggered by the hot moistness of her baby-making hole.", parse);
	Text.NL();
	Text.Add("Lazily, Lenka leans forwards and plants her hands on your collarbone, letting you get a good look at just how her ample assets jiggle and sway under her. <i>“You want to be my cum-pump, don’t you? A good little source of seed for my hungry womb.”</i>", parse);
	Text.NL();
	Text.Add("Oh yes, yes, that’s what you want.", parse);
	Text.NL();
	Text.Add("<i>“Beg for it.”</i>", parse);
	Text.NL();
	Text.Add("Please, won’t she let you be her cum-pump?", parse);
	Text.NL();
	Text.Add("She slaps you, but you barely feel it. <i>“Beg harder!”</i>", parse);
	Text.NL();
	Text.Add("Tears come unbidden to your eyes at the fury of that commanding voice. Please… will she let you be her breeding stud?", parse);
	Text.NL();
	Text.Add("<i>“That’s much better. Now, fertilize me.”</i>", parse);
	Text.NL();
	Text.Add("With a trill of pleasure, Lenka leans her weight forward and guides your cock into her.", parse);
	if(player.NumCocks() > 1)
		Text.Add(" Your remaining shaft[s2] get[notS2] pushed to the side, unloved and unwanted, but who cares? You’d get rid of them this moment if that’s what your mistress commanded.", parse);
	Text.NL();
	parse["knot"] = p1cock.Knot() ? "knot" : "groin";
	Text.Add("Lenka’s glorious pussy stretches wide and devours the entirety of your man-meat, slurping and sucking as she impales herself upon your member with wanton glee, not stopping until her mound is grinding against your [knot].", parse);
	Text.NL();
	if((p1cock.Len() >= 40) || (p1cock.Thickness() >= 8)) {
		Text.Add("How… how did she fit all of that inside her without so much as a bump on her slim belly? It defies all logic!", parse);
		Text.NL();
		Text.Add("Lenka sneers. <i>“I told you there’s no cock that Mama Lenka can’t take, my dear cum-pump. Now just lie back and enjoy the ride while I suck out all your semen.”</i>", parse);
		Text.NL();
	}
	Text.Add("She starts off slow at first, hands caressing, hips gyrating, but the pace soon picks up and your avian lover is soon riding you with passion and energy - perhaps too much. The bed creaks under her vigorous efforts to force your cum out of you, and she leans forward to nibble at your neck with the cruel hooked tip of her beak - perhaps it’s a the equivalent of a kiss, or perhaps it’s a warning.", parse);
	Text.NL();
	Text.Add("You couldn’t care less what she does. There is something about the avian demoness’ walls and womb that’s utterly unlike any other female. The squelching noises as she rides you are only to be expected, but what isn’t is the way her cunt greedily and actively milks you with a life of its own, pressing against the shaft in its grasp, throbbing and pulsing about every ridge and vein of your manhood. Even your pre-cum isn’t spared - every last drop is channeled up her pulsing, flexing cunt into her.", parse);
	Text.NL();
	if(p1cock.Len() >= 20) {
		Text.Add("All of a sudden, you hit something, but whatever it is, the obstruction soon gives way, allowing your [cock] to sink even further into Lenka’s depths. Dimly, you’re aware that you must’ve hit her cervix - and that she easily opened it up to allow you direct access to her baby bag. All the better to put that cum directly where it’s needed, after all.", parse);
		Text.NL();
	}
	Text.Add("You can’t take much more of this, not with your avian lover’s pussy holding your shaft in a dead stranglehold. Already, your cock is twitching inside her, your balls swollen and churning as they approach their moment of release. It’s practically a given that you’re going to cum now, one way or the other…", parse);
	Text.NL();
	Text.Add("But some small portion of your senses return to you. You look up to find Lenka’s face contorted in a mixture of equal parts ecstasy, anticipation and sheer, orgasmic pleasure at the thought of being pregnant. Seems like her hold on your mind has slipped just a little, enough for you to consider resisting.", parse);
	Text.NL();
	Text.Add("At this point, though, will it make any difference? You don’t know…", parse);
	Text.Flush();
	
	//[Submit][Resist]
	var options = new Array();
	options.push({ nameStr : "Submit",
		tooltip : "It’s hopeless. Might as well just lie back and enjoy your new life as a fallen angel’s breeding slave.",
		func : function() {
			Text.Clear();
			Text.Add("Oh, what’s the use. Lying here in this oh-so-comfortable bed, having your cock milked by someone both skilled and eager, for the express purpose of bearing as many of your offspring as possible… and for all eternity, too. There are far worse fates than this, you realize as the gentle haze descends upon your senses once more and snuffs out your last spark or resistance. Far worse fates…", parse);
			Text.NL();
			if(player.FirstBreastRow().Size() >= 2)
				Text.Add("Lenka steadies herself by grabbing your [breasts], greedily and roughly fondling the soft, sensitive flesh. Perhaps a bit too roughly - you whimper and mewl in protest as she squeezes down hard in a bid to get at your [nips], but that only seems to encourage the avian demoness’ lusts.", parse);
			else
				Text.Add("Lenka steadies herself by planting her hands on your chest, ostensibly for support but unabashedly taking the chance to get a feel for your body. The avian demoness makes a pleasant, humming noise in the back of her throat - she must like what she feels.", parse);
			Text.NL();
			parse["knot"] = p1cock.Knot() ? "knot" : "cock";
			Text.Add("All of a sudden, you groan, a shudder running through the entirety of your body, and realize that you’re about to blow. Lenka’s body seems to recognize this as well, and her cunt clenches tightly about your swollen [knot], determined not to let a single drop of seed go to waste. This in turn sends you careening over the edge, and you cry out as you feel your cum rise through your shaft, ready to explode into the avian demoness.", parse);
			Text.NL();
			if(player.NumCocks() > 1) {
				Text.Add("Your other shaft[s2] throb[notS2] and pulsate[notS2] too, but nothing comes out despite the overwhelming pleasure you’re experiencing. She really <i>is</i> serious about taking in <i>all</i> your seed.", parse);
				Text.NL();
			}
			parse["len"] = p1cock.Len() >= 20 ? "womb" : "cunt";
			Text.Add("With a cry of pleasure that sends you writhing under your avian lover, you throw your head back and begin blowing your load straight into her heated [len]. Quickly realizing what’s happening, her body draws you into her as far as you will go, encouraging your seed to go where it’s most needed. Your groins mash and grind together, hips moving frantically with the effort of mating.", parse);
			Text.NL();
			Text.Add("Your orgasm seems to last forever, your cock pumping more and more seed into Lenka even as she sings out in triumphant victory at the sensation of hot, slippery baby batter flooding her warm, receptive oven, ready to be baked into delicious little buns. How long does this go on? How long do you ride this wave of pleasure? You can’t tell, not through the fog that clouds your mind; there’s no sign that your shaft is softening as she continues to ride you brutally. Despite the absurd amounts of cum you must’ve forced into her at this point, Lenka’s womb swallows it all without missing a beat, her belly remaining flat and trim throughout the whole process, her lush inner walls amazingly tight about your erection.", parse);
			Text.NL();
			Text.Add("At last, you fire off your last few spurts of cum, feeling utterly drained and lifeless from the exertions you’ve just been through. It’s only when she’s sure that you’re utterly spent that Lenka lifts herself off you, both her cervix and cunt lips sealing themselves ironshod-tight to prevent so much a single drop of your seed escaping. Surveying your panting, moaning form and slowly softening dick, the avian demoness croons and leans down on all fours over you to nuzzle you in the crook of your chin.", parse);
			Text.NL();
			Text.Add("<i>“Mm, that wasn’t so bad, cum-pump,”</i> she croons. <i>“I sensed the very moment your seed took root, and it was glorious. You’ll do just fine, don’t worry.”</i>", parse);
			Text.NL();
			Text.Add("Already? You glance down at the avian demoness’ heavy breasts, swaying slightly under her. Unchanged, her midriff retains its gentle concave, but her milk-makers are ever so slightly fuller, firmer, <i>bigger</i>, the nipples jutting through her feathers ever so slightly darkened. Slowly, Lenka shifts her weight back to her knees, arching her back to better show off her sensuous body, and as she runs her gloved hands across her sides you notice that her belly’s no longer concave, but flat instead.", parse);
			Text.NL();
			Text.Add("She may not be showing yet, but her breasts are definitely starting up milk production. Panting softly, her breasts heaving, Lenka caresses her lower belly, and when she’s done, she’s sporting the slightest of baby bumps, the fruit of your coupling beginning to make itself known.", parse);
			Text.NL();
			parse["v"] = player.FirstVag() ? "" : " grow a pussy on you and";
			Text.Add("The avian demoness gathers locks of her long, blood-red hair and toys idly with them. <i>“It’s a shame you can’t feel what I’m feeling, but perhaps that doesn’t matter. Maybe when I get more cum-pumps, I’ll[v] let you have a go, too. Then you can have a nice, rounded belly like me.”</i>", parse);
			Text.NL();
			Text.Add("You moan like a whore in heat. When put forward by that tantalizing, honeyed voice, the idea is the most arousing you’ve ever come across. To be like your mistress-wife, your belly big and round, bearing young for her… it’s more than you could ever have hoped for.", parse);
			Text.NL();
			Text.Add("A peal of soft song emanating from her throat, Lenka settles back and concentrates on the task of incubating your seed. The going is slow at first, but the process quickly speeds up; the slight swell of her midriff rapidly expands into an undeniable baby bump, jutting slightly forward as the fruit of her womb swells forth with gusto. Crooning, she slowly passes her hands along her pregnant tummy, fingers reaching through crimson feathers to touch increasingly stretched skin, and with each loving stroke you can <i>see</i> her belly rounding and filling with unholy life.", parse);
			Text.NL();
			Text.Add("<i>“You have strong seed,”</i> she whispers. <i>“I’ll show you why they call me <b>Mama</b> Lenka.”</i>", parse);
			Text.NL();
			Text.Add("Her belly isn’t just growing forward now; it’s also growing outwards until she’s looking about six or seven months along, her breasts swelling and filling with milk to match, her nipples darkening as they bulge and become fat ready to be used for feeding. On any other woman, such sudden growth would be alarming, but the avian demoness takes an intense, perverse pleasure in her unearthly fecundity; her breath comes in ragged gasps, her body hot and flushed with excitement. Without warning, she’s all over you again, thrusting the fertile swell of her pregnancy in your face.", parse);
			Text.NL();
			Text.Add("<i>“Show some appreciation for what you made, will you?”</i> she says with a wicked grin. <i>“It is your seed growing in there, after all.”</i>", parse);
			Text.NL();
			Text.Add("Yes… anything to make her happy. Reaching up, you sink your fingers through Lenka’s feathers and make contact with the rounded curves of her swollen womb. It feels so warm and good to the touch… perfectly suited for your planted seed to sprout and ripen into full, large fruit. Her baby bag pulses rhythmically as it works away at shaping new life, and your heart overflows with joy at the flutters of motion that come from within.", parse);
			Text.NL();
			Text.Add("Of course, the fact that you’re rubbing your hands all over her baby bump doesn’t mean it stops growing; on the contrary, your touch seems to accelerate the process even more than her own does. Before your very eyes, Lenka’s belly swells out to the size of a full-term pregnancy, her belly button first rising into line with the fertile, womanly swell of her tummy, then popping out from the sheer pressure of the numerous chicks within.", parse);
			Text.NL();
			Text.Add("<i>“Oof,”</i> she croons as small bumps rise on the stretched skin of her heavily pregnant belly. There’s a short pause, and then her face settles in a look of pure pleasure as the squirming and shifting within becomes stronger as your young mature before your eyes. <i>“They’re really active.”</i>", parse);
			Text.NL();
			Text.Add("They’re? Oh… you stop your touching and caressing for a moment to let that sink in, even as Lenka’s full belly balloons to the point that she’s undeniably pregnant with multiples. Low and heavy, her pregnancy rests on her knees, a fleshy shelf for her heavily engorged breasts, and your avian lover closes her eyes and hums a few notes of a wordless tune as she gleefully hugs her stuffed baby bag. Demoness or no, you have to admit that she looks really maternal at this point, her tender, gently leaking nipples making her even more so. Her protruding tummy already looks like it’s full term with twins, and showing no signs of slowing.", parse);
			Text.NL();
			Text.Add("Consumed by the sheer joy of impending motherhood, Lenka cries out and sings gloriously as she feels the lives within her continue to mature and develop. With her this big, her belly and breasts have settled into rhythmic pulsing growth: With each breath she draws, the avian demoness’ curves swell; with each exhalation, they shrink, but end up a little bigger than they were before. In and out, in and out; slowly, Lenka’s overstuffed uterus grows to the size of being overdue with twins, then is well on her way to looking full term with triplets. She’s practically panting and wailing, unable to think of anything but the babies growing inside her, feeling their constant kicking and squirming and revelling in her incredible sense of maternity.", parse);
			Text.NL();
			Text.Add("But… just how big is she going to get? Your question is answered as Lenka’s growth slowly comes to a stop, leaving her moaning and breathless, seemingly overdue with triplets, constantly squirming and kicking with and eagerness to be unleashed upon the world. With how massive and inhumanly gravid her midsection is, she makes the bed look more like a nest than a bed proper, and can’t seem to get enough of you rubbing her pregnancy. Her breasts leak constantly, a steady stream of milk pouring from her nipples as her breasts kick into overdrive in preparation for all the feeding they’ll have to do.", parse);
			Text.NL();
			Text.Add("<i>“Ohhh… it’s time. I can feel the shells hardening.”</i>", parse);
			Text.NL();
			Text.Add("Uh-oh.", parse);
			Text.NL();
			Text.Add("<i> “Help me get into position, cum-pump,”</i> Lenka commands. You’re only too happy to be given the chance to obey your mistress-wife’s orders, and although her belly makes her ungainly, you’re able to do a she wishes. Just as with her pregnancy, the avian demoness takes a perverse, almost orgasmic amount of pleasure from the process of birthing her brood. She gets into a comfortable position on the bed, legs spread and then... puts her hand between her thighs and starts masturbating.", parse);
			Text.NL();
			Text.Add("The laying is an easy affair, but not surprising considering Lenka’s broodmother-worthy hips; it happens almost as soon as she sets her mind to it. First, her belly visibly drops as her young prepare to enter the world, their weight settling on her hips even as her usually tight cervix begins to give way. Gradually, the contents of her womb shift lower and lower with each contraction, accompanied by her lustful moans and pants; her netherlips bulge and part with the egg rapidly crowning, then slipping out of her as she orgasms, leaving a sticky mess on the sheets.", parse);
			Text.NL();
			Text.Add("Wow. Looking at the sheer size of that womb-straining egg… and she’s got more of those in her? You can’t help but feel elated that you were part of this process, that this incredible fertility goddess picked you, out of all who could have stumbled upon this place, to father her firstborn spawn.", parse);
			Text.NL();
			Text.Add("Two more orgasms later, an equal number of huge matte-black eggs are resting beside their sibling, smelling faintly of that same, sickly, cloying sweet scent that pervades the room. Chirping tenderly, Lenka pats the eggs as they begin to hatch, cracks running along their surface until the shells break open and small, dark vaguely bird-like shapes spill out from within, still damp with egg fluids. Mother of Shadows indeed…", parse);
			Text.NL();
			Text.Add("A satisfied smile on her face, Lenka takes her brood into her arms and sets them against her breast one by one, giving each their turn to suckle as much as they want.", parse);
			Text.NL();
			Text.Add("Before your eyes, the dark shapes grow in leaps and bounds, soon sitting on their demon mother’s lap instead of being held by her. Baby fluff falls to the ground, dissolving in wisps of vile smoke as proper flight feathers and plumage emerge; they empty eyes and dark wings blaze a deep violet with unholy energy. For some reason, you can’t help but notice that the black roses have started to creep beyond the sacristy’s confines, the blossoms ever so much more deadly and beautiful, the thorns they hide so much more vicious…", parse);
			Text.NL();
			Text.Add("<i>“Go,”</i> Lenka whispers to her trio of firstborn, the seething masses of vaguely bird-shaped shadow now fully grown. Already, the remnants of her pregnant belly are fading away, her midriff rapidly returning to its old slender shape, her womb preparing itself to be seeded again. <i>“You’ll soon have many brothers and sisters to join you.”</i>", parse);
			Text.NL();
			Text.Add("A soft flutter of wings, and they are gone, melding seamlessly into the darkness. Humming to herself, Lenka takes her time cleaning up; removing both eggshell fragments and messy fluids with a snap of her gloved fingers, making sure to move her goddess-worthy body just so to inflame your addled desires. At long last, though, she’s done, and the avian demoness settles back on the bed, eyes gleaming predatorily as she turns her gaze on you.", parse);
			Text.NL();
			Text.Add("<i>“Giddy up, cum-pump. We’ve still got lots of work to do.”</i>", parse);
			Text.NL();
			Text.Add("Time moves in a blur of breeding, your balls never seeming to run dry despite each massive load you shoot off into your lascivious mistress-wife. Time and time again her womb grows monstrously heavy with child; time and time again more of her dark offspring are sent out into the world, masses of shadow and energy poised to terrorize and destroy. Sometimes, they return bearing gifts for their loving mother; others bring slaves for breeding, but no matter how many others offer up their seed to her, you know that you’re your mistress-wife’s first and favorite.", parse);
			Text.NL();
			Text.Add("Around you, the black roses grow from their heart under the elegant bed; you dimly realize that they’ve already consumed the entirety of the burnt-out chapel in their vicious, thorny grip. In your more lucid moments, when your mistress-wife’s voice isn’t present to command your attention and demand that she be bred, you dimly wonder if they’ll eventually spread to consume everything in the world…", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Scenes.Halloween.WakingUp(true);
			});
		}, enabled : true
	});
	options.push({ nameStr : "Resist",
		tooltip : "No! You’ve got to fight this!",
		func : function() {
			Text.Clear();
			Text.Add("No! The realization that this demoness was somehow screwing with your mind only fuels the sudden spark of anger that flares in your breast, and… and…", parse);
			Text.NL();
			Text.Add("…You just have to summon up enough strength to actually do anything through the haze of exquisite pleasure that saps your will to do anything useful…", parse);
			Text.NL();
			Text.Add("There!", parse);
			Text.NL();
			Text.Add("With every last ounce of strength you can muster against the chains binding your will, you grab this so-called “Mother of Shadows” and shove her off-balance, hoping to pry your shaft free of the vice-like grip her pussy has on it.", parse);
			Text.NL();
			Text.Add("To your surprise, it works. There’s no small amount of resistance, but she was clearly distracted with all the fucking that’s going on, and your [cock] pops free with a wet, disquieting noise. Happily, your balls decide that this is the moment to discharge their load, and they do so with great gusto. Rope after rope of thick white semen erupts from your [cockTip], splattering all over Lenka. It gets onto her face, between her breasts, into her feathers - hosing her down everywhere except where it needs to go, really.", parse);
			Text.NL();
			Text.Add("A shriek sounds from the avian demoness, but it’s not one of anger, but rather, desperation. Denied the satisfaction of having warm cum pumped directly into her baby bag, Lenka is desperately trying to save the spilled seed, scraping it off her, scooping it in her hands, thrusting her cum-coated fingers into herself, perhaps hoping to have much the same effect as a turkey baster…", parse);
			Text.NL();
			Text.Add("Now’s your chance! There’s no time to lose - you tear down one of the heavy velvet drapes from the bed and while Lenka’s distracted, grab the avian demoness by the collarbone and wind the fabric tightly about her beak, capping off the binding with a good, solid knot. It amazes you how frail she seems now - just how much of the demoness’ strength was in your own mind?", parse);
			Text.NL();
			Text.Add("Finally realizing what’s happening, Lenka makes muffled squawks of protest, but you’re done binding her wrists together with the drapes. Ugh… you can’t believe you came <i>that</i> close to expelling your seed directly into her - and who knows what might have happened then?", parse);
			Text.NL();
			Text.Add("Now, the only question is: what do you do?", parse);
			Text.Flush();
			
			//[Flee][Turn Tables]
			var options = new Array();
			options.push({ nameStr : "Flee",
				tooltip : "You don’t want to push your luck. Get out of here!",
				func : function() {
					Text.Clear();
					Text.Add("Screw this, you’ve had just about enough of this demoness and her insidious way of affecting one’s mind. Taking care not to tread on any of the thorny rose vines, you nip on out of the former sacristy as quickly as you can while Lenka struggles against her bonds. You’d do well not to return here, because she’s going to be furious when she finally gets free… ", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true
			});
			options.push({ nameStr : "Turn Tables",
				tooltip : "Seeing the demoness tied up like this gives you an idea… if she wants your cum so badly, she can take it in her butt.",
				func : function() {
					Text.Clear();
					Text.Add("A grin spreads across your [face] as a particularly nasty thought comes to mind: since this lusty hussy wants your seed so much, you’re more than willing to give it to her - in the entirely wrong place, of course. Besides, her bird-butt is jiggling so prettily as she squirms about on the sheets, trying to free herself from her bonds; it’d be a shame not to get a good, firm handful of those.", parse);
					Text.NL();
					Text.Add("Another muffled squawk of protest comes from Lenka as you force her face-down into the plush bed, but it seems that so long as the avian demoness can’t sing or speak, you’re free from whatever hold her voice has on you. Good, all you need to do is to make sure the bindings don’t slip. Thus reassured, you place one hand on each of her ample ass cheeks and spread them apart, brushing aside tailfeathers to get an unobstructed view of that tight and likely virgin butthole. Lenka’s vigorous wiggling only strengthens your resolve to pay her back for almost managing to turn you into her breeding slave, and with great deliberation, you insert a finger into her pucker, wiggling it about just a little.", parse);
					Text.NL();
					Text.Add("The reaction is immediate. A muffled wail sounds from the avian demoness’ beak as her wriggling grows stronger - she’s clearly unused to the intrusion - but the luxurious drapes are very well-made and hold fast. Her loss, your gain. Still, maybe you’ll be a <i>little</i> merciful; her feathers are still slick with your cum, and you gather a little of it on your fingertips and spread it about her asshole. Just a tiny bit of lube to avoid <i>completely</i> ruining her butthole.", parse);
					Text.NL();
					Text.Add("Just a little…", parse);
					Text.NL();
					Text.Add("Okay, that’s enough.", parse);
					Text.NL();
					Text.Add("Lenka positively <i>squeals</i> as you ram your sizeable shaft into her pucker with brutal force, her sphincter no longer virgin. It strains to accommodate your [cockTip], then finally gives way as you squeeze and push your way into her back door. Piteous noises, perhaps for mercy, come from the avian demoness’ throat, but you’re determined to show her as much as she was willing to show you.", parse);
					Text.NL();
					Text.Add("Which is none, of course.", parse);
					Text.NL();
					parse["c"] = player.NumCocks() > 1 ? Text.Parse(" and loose cock[s2]", parse) : "";
					Text.Add("The resultant fucking is short, sharp and brutal - made even more so by Lenka’s attempts to fight you off. Your balls[c] slapping against the avian demoness’ lush rump, you pound her asshole ruthlessly, mashing yourself with such force and energy that beads of sweat begin collecting on your [skin]. The orgasm, when it comes, is as explosive as the first, with surprising results - Lenka practically screams into her gag and her once seductive eyes practically pop out from her head as you empty your load into her. Slowly, her stomach begins to swell as you flood her digestive system with your cum, rounding out her tummy into a noticeable paunch.", parse);
					Text.NL();
					if(player.NumCocks() > 1) {
						Text.Add("Your other shaft[s2] explode[notS2] as well, covering her in a second coating of baby batter to join the first, slick and gloriously sticky. She’s going to need a lot of effort to get that all out of her feathers.", parse);
						Text.NL();
					}
					Text.Add("With a final wail, Lenka’s eyes roll back into her head, and she collapses insensate on the bed, worn out by the savaging of her asshole. You extract your shaft with a pop, then turn and hurry out of the former sacristy as quickly as you can manage, careful not to tread on any of the thorns on your way out. Best not to return here, considering the close shave that you had this time round - if you hadn’t seized the moment, you might have still been in there, a slavish breeding stud to a demoness’ whims…", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

Halloween.Loc.WitchHut.description = function() {
	var first = !(Scenes.Halloween.HW.flags & Halloween.Flags.WitchHut);
	Scenes.Halloween.HW.flags |= Halloween.Flags.WitchHut;
	
	if(first) {
		Text.Add("The path you’ve chosen eventually ends at a small hut nestled amidst the twisted trees. Built from wood planks and roofed with thatch, it doesn’t look much bigger than the size of a single bedroom; the window shutters might be stuck with grime and age, but thin shafts of bright light manage to worm their way through anyway. A squat stone chimney pours a steady stream of smoke into the air, and you waste no time in stepping up and knocking on the door.");
		Text.NL();
		Text.Add("<i>“Come in! Open, locks, whoever knocks!”</i>");
		Text.NL();
		Text.Add("Well, that’s an invitation if you ever had one. You take hold of the handle, push open the door, and step into a different world altogether.");
		Text.NL();
		Text.Add("The first thing that strikes you about the hut’s interior is how big it is - plainly more so than its outside. It’s certainly enough to hold a massive hearth and equally impressive cauldron bubbling and frothing over the fire, racks upon racks of strange specimens in jars, and a good amount of homely furnishing.");
	}
	else {
		Text.Add("You head up to the witch’s hut once more, and knowing you’re invited, push open the door and step into light and warmth.");
	}
	Text.NL();
	Text.Add("Seated at a rich mahogany table in the middle of the room are two figures: the first being an elf with pink hair, dressed from head to toe in quite the stereotypical witch’s costume, complete with a pointy hat. The second is… well, you can’t quite tell what he, she or it is under the dark, swarthy garments the figure’s clothed itself in. The two of them are sharing some tea at the table, but only one of them’s actually drinking anything…");
	Text.NL();
	Text.Add("Curled up in the witch’s lap, a black cat looks up at you and caws angrily, leaping to the floor and scampering for the safety of the shadows. Huh. Then again, it’s a cat; antisocialness is only expected of the creature.");
	Text.NL();
	Text.Add("What do you do now?");
}

Halloween.Loc.WitchHut.links.push(new Link(
	"Outside", true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.Path);
	}
));

Halloween.Loc.WitchHut.events.push(new Link(
	"Trader", true, true,
	null,
	function() {
		Scenes.Halloween.Patches();
	}
));

Halloween.Loc.WitchHut.events.push(new Link(
	function() {
		return (Scenes.Halloween.HW.flags & Halloween.Flags.Jenna) ? "Jenna" : "Witch";
	}, true, true,
	null,
	function() {
		Scenes.Halloween.Jenna();
	}
));

Scenes.Halloween.Jenna = function() {
	var parse = {
		playername : player.name,
		heshe : player.mfTrue("he", "she")
	};
	
	var first = !(Scenes.Halloween.HW.flags & Halloween.Flags.Jenna);
	Scenes.Halloween.HW.flags |= Halloween.Flags.Jenna;
	
	Text.Clear();
	if(first) {
		Text.Add("<i>“By the pricking of my thumbs, something sexy this way comes.”</i>", parse);
		Text.NL();
		Text.Add("As you approach, the witch sets down her tea and smiles at you. Despite the traditional witch’s garb, she actually looks quite stunning: a tall, pointy hat sits atop a full head of thick, curly pink hair, coupled with a figure-hugging robe of black silk that shows off her motherly form and patched, tattered cloak to keep her warm. At a first glance, there’s a wart on her nose, but on further inspection, it turns out to be a glued-on fake. The pointed tips of her ears suggest that she’s an elf of some sort - it’d definitely explain why she appears to be so young, at the very least.", parse);
		Text.NL();
		Text.Add("Oh, sexy, are you?", parse);
		Text.NL();
		Text.Add("The witch nods, the movement sending her generous bosom jiggling slightly. <i>“Hail, [playername]! Hail, [heshe] who would transverse the dark roads of this realm! Hail, [heshe] who shall confront and vanquish the evil that lies dormant, or else become its servile fucktoy!”</i>", parse);
		Text.NL();
		Text.Add("You glance at the cloth-wrapped figure across the table, but he, she or it hasn’t moved so much as a muscle in response to the witch’s words. For all you know, it might very well be a statue under there. The teacup set before it hasn’t been so much as touched in the slightest, its contents cold and stale, although that in turn doesn’t bother the witch any.", parse);
		Text.NL();
		parse["slut"] = player.Slut() >= 50 ? " like something you could get behind! Or under, depending on where evil likes it." : "… um…";
		Text.Add("Vanquish evil, or else become its servile fucktoy? That sounds[slut]", parse);
		Text.NL();
		Text.Add("The witch nods. <i>“So has the great and powerful Jenna spoken. Which is of course, me. Come now, parched my throat is from the speaking, and tea is much desired for the drinking. Join us, please, in our elegant repose, such that we can study the one whom fate has chose.”</i>", parse);
		Text.NL();
		Text.Add("While you take a seat at the table, the witch rises and saunters over to a small kitchenette against the wall. Try as you might, you can’t help but notice that she walks with a sexy, swinging gait thanks to her curvaceous form, her hair swaying to and fro as it brushes against her ripe, grabbable ass. Wonder if that’s the way all witches around these parts look like… it’d certainly make sense for one to use magic to spruce up one’s appearance a little.", parse);
		Text.NL();
		Text.Add("Your thoughts are interrupted by the clink of china and smell of hot water, and before long, the witch’s returned with a freshly-brewed pot of tea, with two cups already poured. One of these she sets before you, another she reserves for herself, and she’s about to take her seat once more when a look of alarm crosses her face.", parse);
		Text.NL();
		Text.Add("<i>“The cauldron, alack! It does overboil! I must see to it, lest I waste many nights of toil!”</i>", parse);
		Text.NL();
		Text.Add("Without wasting another moment, the witch hurries off to the hearth and cauldron - letting you get yet another good look at her ample assets, but more importantly, leaving the tea unattended. Hm…", parse);
		Text.NL();
		Text.Add("Do you trust the witch and drink from your own cup, or play it safe and switch yours with hers? They look identical, after all.", parse);
		Text.Flush();
		
		Scenes.Halloween.JennaSwitchPrompt({});
	}
	else if(Scenes.Halloween.HW.flags & Halloween.Flags.Broomfuck) {
		Text.Add("Looking up from her tea, Jenna shakes her head, the elven witch’s long, pink bangs swaying in time with the motions of her head.", parse);
		Text.NL();
		Text.Add("<i>“Nothing’s left for you in this place<br/>", parse);
		Text.Add("Countless terrors you tonight will face<br/>", parse);
		Text.Add("Go forth, bold one! Make utmost haste<br/>", parse);
		Text.Add("For there is scarce time for you to waste.”</i>", parse);
		Text.NL();
		Text.Add("With that, she returns to her tea. Yeah, you ought to be making a move.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	}
	else { // REPEAT, not fucked
		Text.Add("You approach the great and powerful Jenna once more, and the witch raises her head to look you in the eye.", parse);
		Text.NL();
		Text.Add("<i>“My earlier offer that you spurned;<br/>", parse);
		Text.Add("Have you reconsidered and thus returned?”</i>", parse);
		Text.Flush();
		
		//[Sure][Nah]
		var options = new Array();
		options.push({ nameStr : "Sure",
			tooltip : "Yeah, you changed your mind.",
			func : function() {
				Text.Clear();
				Scenes.Halloween.JennaBroomfuck();
			}, enabled : true
		});
		options.push({ nameStr : "Nah",
			tooltip : "Answer’s still no, sorry.",
			func : function() {
				Text.Clear();
				Text.Add("Thanks for the offer, but you’ll still decline.", parse);
				Text.NL();
				Text.Add("Jenna tilts her head at you and looks as if she’s about to say something, but returns to her tea. You don’t blame her - speaking in rhyme must be tough on the elven witch.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

Scenes.Halloween.JennaSwitchPrompt = function(opts) {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	//[Switch][Don’t Switch][Trader]
	var options = new Array();
	
	options.push({ nameStr : "Switch",
		tooltip : "The witch’s up to no good. Switch the teacups.",
		func : function() {
			Text.Clear();
			Text.Add("Yeaah… you don’t trust this Jenna witch one bit. She probably messed with your tea or something… just to be on the safe side, you’ll switch the drinks. If she isn’t trying to pull any shenanigans, no harm done, and if she is… well.", parse);
			Text.NL();
			Text.Add("You cast a guilty glance at the trader in their colorful patchwork clothes, but as always, there’s neither sound nor motion from the many folds of cloth. Is there even something in there, or is it just a dummy?", parse);
			Text.NL();
			Text.Add("Bah…", parse);
			Text.NL();
			Text.Add("One last look to make sure the witch is properly preoccupied - she’s currently bent over her cauldron, that ripe, juicy ass of hers straining against her black dress, begging, yearning to be free. Hah. A quick movement, and the exchange is made; you sit back and wait for the show to begin.", parse);
			Text.NL();
			Text.Add("Indeed, at length, Jenna returns, adjusting her hat on her head as she casts a glance at the table. <i>“I observe you haven’t touched your tea. Might it be you’re waiting for me?”</i>", parse);
			Text.NL();
			Text.Add("Naturally. It would be impolite otherwise, wouldn’t it?", parse);
			Text.NL();
			Text.Add("Perhaps you’d been expecting more of a reaction from the witch, but she simply takes her seat and raises her teacup to her lips. You do the same, of course, trying to watch her discreetly out of the corner of your eye. The tea definitely tastes like it wasn’t brewed with any simple tea leaves - there’s a slightly spicy aftertaste you just can’t place…", parse);
			Text.NL();
			Text.Add("Without warning, a sudden, immense wave of lust crashes into you, making it hard to so much as sit up straight. Moaning aloud as fire blossoms in your chest and nethers, you barely feel yourself slump to the ground as ", parse);
			if(player.FirstCock())
				Text.Add("your [cocks] engorge to the point of painfulness fully erect and twitching in the air", parse);
			if(player.FirstCock() && player.FirstVag())
				Text.Add(", and ", parse);
			if(player.FirstVag())
				Text.Add("your [vag] becomes flush with heat, your insides squirming and churning in their desire to take in a nice big cock within your heated depths", parse);
			Text.Add(". There’s a sigh, and you become briefly aware of someone standing above you, watching you pant and mewl in desire.", parse);
			Text.NL();
			Text.Add("<i>“Let that be a lesson learned<br/>", parse);
			Text.Add("To know that although trust is earned<br/>", parse);
			Text.Add("Doubting others with needless cause<br/>", parse);
			Text.Add("Often results in friendships lost<br/>", parse);
			Text.Add("Take only what is truly yours<br/>", parse);
			Text.Add("Lest a punishment is par for the course<br/>", parse);
			Text.Add("As it happens, you’re in luck<br/>", parse);
			Text.Add("I need someone for my broomstick to fuck.”</i>", parse);
			Text.NL();
			
			Scenes.Halloween.JennaBroomfuck();
		}, enabled : true
	});
	options.push({ nameStr : "Don’t Switch",
		tooltip : "Trust the witch and drink your own tea.",
		func : function() {
			Text.Clear();
			Text.Add("Eh, it doesn’t do to be suspicious of everyone all the time. Picking up your cup, you drain it of its contents - the tea is sweet and refreshing, although you’re fairly sure that this wasn’t brewed from your run-of-the-mill tea leaves.", parse);
			Text.NL();
			Text.Add("Hey, that wasn’t so bad after all. You pour yourself another cup from the teapot, with much the same effect. At length, the witch returns from her cauldron, notices her cup, and picks it up to dump the contents into the sink.", parse);
			Text.NL();
			Text.Add("Hey, isn’t she going to drink that? Seems like a bit of a waste.", parse);
			Text.NL();
			Text.Add("<i>“Suffer not a cup of tea gone cold: the taste, the smell, they be stale and old,”</i> comes the muttered reply. At length, she returns with a new china cup and pours herself another serving from the pot. The two of you finish your drinks, and you thank the witch for the tea.", parse);
			Text.NL();
			Text.Add("<i>“The tea was good, that did you say? Then my hospitality you can repay. Traveler, of you I must ask a boon; I must finish my brew before the new moon.”</i>", parse);
			Text.NL();
			Text.Add("Uh…", parse);
			Text.NL();
			Text.Add("A frown creases the witch’s lovely face. <i>“Damn it, I just need to get a potion done before the month is out and need your help. There, understand that?”</i>", parse);
			Text.NL();
			Text.Add("Much better, thank you.", parse);
			Text.NL();
			Text.Add("<i>“Seriously, talking in rhyme all the time tires me out, that I can say without a doubt. Well?”</i>", parse);
			Text.NL();
			Text.Add("Just what does the great and powerful Jenna need you to do, anyway?", parse);
			Text.NL();
			Text.Add("<i>“You ask, then close in and harken<br/>", parse);
			Text.Add("Of my task before the moon darkens<br/>", parse);
			Text.Add("Of my task before the moon darkens<br/>", parse);
			Text.Add("Of dark and dire straits<br/>", parse);
			Text.Add("Of the impending doom which awaits.<br/>", parse);
			Text.Add("Approaching soon is the witching hour<br/>", parse);
			Text.Add("Of the darkest day, when evil’s power<br/>", parse);
			Text.Add("Surges forth and covers the land<br/>", parse);
			Text.Add("Wreaks havoc and chaos by its hand.<br/>", parse);
			Text.Add("Seven nights seven I have woven the threads<br/>", parse);
			Text.Add("As fine as silk and as heavy as lead<br/>", parse);
			Text.Add("My enchantment to ward the innocent from the sight<br/>", parse);
			Text.Add("From the dread horrors poised to stalk the night.<br/>", parse);
			Text.Add("Alas, there is one last ingredient left<br/>", parse);
			Text.Add("One essential item of which my spell is bereft<br/>", parse);
			Text.Add("Distilled essence from a slut<br/>", parse);
			Text.Add("The juices of one deep in rut<br/>", parse);
			Text.Add("Gathered fresh while in the throes of pleasure<br/>", parse);
			Text.Add("Ten thimblefuls, such is the measure<br/>", parse);
			Text.Add("Of this essence which I need<br/>", parse);
			Text.Add("Be it a woman’s nectar or a man’s seed<br/>", parse);
			Text.Add("Yet today you come to my door<br/>", parse);
			Text.Add("Perhaps you are what I need, and more<br/>", parse);
			Text.Add("Lay yourself down, and at my behest<br/>", parse);
			Text.Add("From you this essence my broom will wrest<br/>", parse);
			Text.Add("In a twisting, turning, orgasmic ride<br/>", parse);
			Text.Add("Pleasure both without and inside<br/>", parse);
			Text.Add("For your service, I will handsomely pay<br/>", parse);
			Text.Add("you with treasures you will need today.<br/>", parse);
			Text.Add("If agreeable to you is this deal<br/>", parse);
			Text.Add("Then with a kiss on my lips mark it sealed!”</i>", parse);
			Text.NL();
			Text.Add("Well, that’s quite the interesting proposal. To agree or not to agree, that is the question…", parse);
			Text.Flush();
			
			Scenes.Halloween.JennaAgreePrompt({});
		}, enabled : true
	});
	if(!opts.trader) {
		options.push({ nameStr : "Trader",
			tooltip : "See if the trader has anything to say.",
			func : function() {
				Text.Clear();
				Text.Add("You turn your eyes questioningly towards the trader at your side and their colorful patchwork robes. Surely there <i>has</i> to be some kind of reaction you can get out of them, right?", parse);
				Text.NL();
				Text.Add("Right?", parse);
				Text.NL();
				Text.Add("Despite all your staring and even a friendly wave, there’s still no response from the trader. Well, fine. If they’re not talking to you, then they’re not going to be tattling if you get up to any shenanigans, either. No help, no harm - you can deal with that just fine.", parse);
				Text.NL();
				Text.Add("Now, what to do?", parse);
				Text.Flush();
				
				opts.trader = true;
				
				Scenes.Halloween.JennaSwitchPrompt(opts);
			}, enabled : true
		});
	}
	
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Halloween.JennaAgreePrompt = function(opts) {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	var werewolf = Scenes.Halloween.HW.Werewolf();
	
	//[Agree][Don’t Agree][...What?]
	var options = new Array();
	options.push({ nameStr : "Agree",
		tooltip : "Yeah, sure. You suppose you could agree to that...",
		func : function() {
			Text.Clear();
			Text.Add("You know what? That sure sounds kinky. Yeah, one for broomstick fuckings, please. Without hesitation, you lunge forward and plant a deep kiss on Jenna’s lips with such force that her witch’s hat falls off her head and floats to the ground. She doesn’t care as she leans into you and returns the kiss with equal vigor, your tongues wrestling, her ample milk cans pressing against your [breasts] as her weight presses against you. After what seems like forever, she pulls away with an audible pop and whispers into your ear.", parse);
			Text.NL();
			if(werewolf) {
				Text.Add("<i>“I’ve got a treat just made for a mutt<br/>", parse);
				Text.Add("Get down on the ground and prepare your butt.”</i>", parse);
			}
			else {
				Text.Add("<i>“I’ll bespell this place to prevent a mess<br/>", parse);
				Text.Add("You, in the meantime, can go and undress.”</i>", parse);
			}
			Text.NL();
			parse["w"] = werewolf ? "" : " stripping yourself of your clothing before";
			Text.Add("You’re only more than eager to do as Jenna asks,[w] getting down on the wooden floor, head down and ass high in the air, ripe for the taking.", parse);
			Text.NL();
			
			Scenes.Halloween.JennaBroomfuck();
		}, enabled : true
	});
	options.push({ nameStr : "Don’t Agree",
		tooltip : "That doesn’t sound like something you’d like to engage in.",
		func : function() {
			Text.Clear();
			Text.Add("No, nein, nope, nada. This place is weird enough, but you’re drawing the line here.", parse);
			Text.NL();
			Text.Add("<i>“I’d reward you, you know; they’re quite good pickings. It’s not as if you’ll be avoiding a whole bunch of dickings. Take your chances, if you will; I’ll see you later when you’ve had your fill.”</i>", parse);
			Text.NL();
			Text.Add("Uh, yeah.", parse);
			Text.NL();
			Text.Add("<i>“I’ll still be here if you reconsider, but I’d suggest that you not dither. Your time with us grows direly short; you will see what your choices begot.”</i> With that, the witch settles back in her seat and stares into her teacup, as if trying to read the future in the dregs.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true
	});
	if(!opts.what) {
		options.push({ nameStr : "...What?",
			tooltip : "Uh, you don’t quite get what was said.",
			func : function() {
				Text.Clear();
				Text.Add("Wait wait wait wait wait. She wants to <b>what</b>?", parse);
				Text.NL();
				Text.Add("<i>“Have my broom fuck you and collect your sexual fluids for use in my spell,”</i> Jenna replies matter-of-factly.", parse);
				Text.NL();
				Text.Add("That’s so much better than that convoluted poem she just did. Not that it was much of a poem, of course, there’s no meter to it at all.", parse);
				Text.NL();
				Text.Add("<i>“Well, will you do it?”</i>", parse);
				Text.Flush();
				
				opts.what = true;
				
				Scenes.Halloween.JennaAgreePrompt(opts);
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Halloween.JennaBroomfuck = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Scenes.Halloween.HW.flags |= Halloween.Flags.Broomfuck;
	
	var werewolf = Scenes.Halloween.HW.Werewolf();
	
	Text.Add("Jenna appraises you with a critical eye, then dances over to her cauldron.", parse);
	Text.NL();
	Text.Add("<i>“Thrice has the horsecock expended itself.<br/>", parse);
	Text.Add("Thrice and once the bitch has been bred.<br/>", parse);
	Text.Add("The slut moans, ‘I’m coming, I’m coming!’”</i>", parse);
	Text.NL();
	Text.Add("At a beckon of the elven witch’s finger, an old broom flies over from behind the door you entered by, a faint pink glow about its length as her magic animates it. The pink glow only grows brighter as Jenna takes it in her hands, rubbing her palms across its tip; slowly, the ordinary-looking handle changes like putty under her fingers to resemble… why yes, it’s a massive horsecock, almost as thick as your arm and complete with flared tip. Jenna runs her hands up and down the shaft a few times, and ridges and veins surface on the makeshift dildo; guess she’s going all the way and making sure you’re going to have a <i>good</i> time.", parse);
	Text.NL();
	Text.Add("<i>“Lubus Maximus,”</i> Jenna mutters. Great gouts of scented liquid shoot from the elven witch’s fingertips, utterly drenching the shaft of her broomstick; the rest splatters on your ass and rolls down your skin in the most disconcerting fashion, eventually pooling on the ground. Without further ado, Jenna mutters another phrase, and her broomstick rushes forward, forcefully planting its tip squarely in your [anus] with a wet squelch of conjured lube. The force of its entry is more than enough to knock the air out of your lungs, and you can feel your ass clench as the magical phallus adjusts its size to fit you snugly. As the pumping and thrusting begins, your [hips] forced back and forth by the horsecock handle’s vigorous assault, Jenna begins chanting by the cauldron’s side:", parse);
	Text.NL();
	Text.Add("<i>“Round about the cauldron go;<br/>", parse);
	Text.Add("In the anal beads throw.<br/>", parse);
	Text.Add("Hairball of vulgar, oversexed feline<br/>", parse);
	Text.Add("Days and nights has ten and nine<br/>", parse);
	Text.Add("Lain unloved, lustful and hot,<br/>", parse);
	Text.Add("Boil thou first in the charmed pot.”</i>", parse);
	Text.NL();
	Text.Add("You try to keep up, but the horsecock handle pounding away into your ass has you gasping for breath and your eyes rolling back into your head. It’s thick enough for you to feel like you’re fit to burst any moment, but not <i>actually</i> end up that way, thank goodness. Eventually, though, the broom handle settles into something of a rhythm, pressing every last inch of itself that you can take into your ass while your butt contracts powerfully about the intrusion - whether to better feel it, or in a desperate bid to prevent it from going further into your ass, that’s anyone’s guess. All this time, Jenna has been adding some more reagents to her spell:", parse);
	Text.NL();
	Text.Add("<i>“Three hairs from a puppyslut’s cooch,<br/>", parse);
	Text.Add("Into the cauldron to simmer and poach;<br/>", parse);
	Text.Add("Blood of ant-girl red and gold,<br/>", parse);
	Text.Add("Dark liquid bearing strength untold,<br/>", parse);
	Text.Add("Adder's fork and gol queen’s sting,<br/>", parse);
	Text.Add("Lizan’s egg and moth-girl’s wing,<br/>", parse);
	Text.Add("Bring forth power fit for lording<br/>", parse);
	Text.Add("Into my charm of potent warding.”</i>", parse);
	Text.NL();
	parse["w"] = werewolf ? " your already bestial muzzle" : "";
	Text.Add("The gathered arousal is spreading through the rest of your body, sweat beading on your [skin] as you pant and whine,[w] unable to articulate words but knowing what you desperately want more of. Already, your hands feel weak, but you nevertheless move a hand to your [nips] and start rubbing away - it just feels so <i>good</i>, and it’s not fair that only your back half is getting any attention…", parse);
	Text.NL();
	Text.Add("Off in what seems like the far distance, Jenna continues to stir her cauldron, which is now frothing violently:", parse);
	Text.NL();
	Text.Add("<i>“Scale of dragon, tooth of wolf,<br/>", parse);
	Text.Add("Demonic draft, maw and gulf<br/>", parse);
	Text.Add("Of a freshly-fed fat cunt snake<br/>", parse);
	Text.Add("Doomed with eternal thirst to slake.<br/>", parse);
	Text.Add("The load of a vixen cumslut<br/>", parse);
	Text.Add("Drug-addled and lost in rut,<br/>", parse);
	Text.Add("Slippery and slimy, sweet and slick,<br/>", parse);
	Text.Add("Make my magic brew nice and thick.”</i>", parse);
	Text.NL();
	parse["gen"] = player.FirstCock() ? parse["cocks"] : parse["vag"];
	var gen = "";
	if(player.FirstCock()) gen += "milking your [cocks]";
	if(player.FirstCock() && player.FirstVag()) gen += " and ";
	if(player.FirstVag()) gen += "thrusting into your [vag]";
	parse["gen2"] = Text.Parse(gen, parse);
	Text.Add("Out of nowhere, something brushes against your [gen], and you gasp at the sudden, unexpected sensation, arching your back out of instinct. Then it’s there again, and again, until invisible hands are [gen2] with brutal efficiency, determined to extract every last drop of fresh love-juice that your body can offer up. Working in tandem with the enchanted broomstick pounding away at your sphincter, the ghostly force quickly ignites the fire in your belly into a raging inferno of hot excitement that consumes every inch of your being.", parse);
	Text.NL();
	Text.Add("You can’t take it anymore, moaning like the needy whore that you are. One last strangled cry of pleasure escapes your lips, and then sweet, sweet release, your lower body shuddering and buckling under your weight from the exhilaration of it all.", parse);
	Text.NL();
	if(player.NumCocks() > 1) {
		Text.Add("Your [cocks] blast[s] gout after gout of fresh spunk from [itsTheir] [cockTip], an overflowing fountain that gushes forth, borne of your ecstasy. The invisible hands milking you don’t let up, instead doubly redoubling their stroking in an effort to drain you as dry as hay, not stopping until the last drop of your semen has been wrung from your [cockTip].", parse);
		Text.NL();
	}
	if(player.FirstVag()) {
		Text.Add("Shortly after, the invisible forces working at your cunt fall into time with the broomstick pounding at your ass, one pushing in while the other pulls away. You close your eyes and mewl as it nudges at your cervix, threatening to force it apart and invade your womb, but that’s not all; it’s spreading outwards, running across the petals of your womanly flower and teasing them as it goes. At last, it finds your clit, and you dig your fingers into the floor and scream aloud as you feel a gentle back-and-forth motion run across that moist nub of sensitive flesh.", parse);
		Text.NL();
		Text.Add("It’s too much for you to bear. If you weren’t already on the ground, you’d have been knocked flat onto it, but as you are you settle for squirting a delicious stream of clear girl-cum onto the ground beneath you, a stream that’s soon joined by another as a second orgasm wracks your body, leaving you weak and breathless.", parse);
		Text.NL();
	}
	Text.Add("At a simple hand gesture from Jenna, the sexual fluids pooled on the ground gather themselves into orbs, rising off the ground and floating over to the elven witch before disappearing into her cauldron. All of a sudden, the bubbling intensifies, and the flames heating the witch’s cauldron turn a ghostly shade of pale blue as the froth comes in contact with them, hissing and spitting all the way.", parse);
	Text.NL();
	Text.Add("<i>“Honey from twenty horny zil<br/>", parse);
	Text.Add("Add to crushed pussyblossom pill<br/>", parse);
	Text.Add("Finally, fresh essence of desire<br/>", parse);
	Text.Add("Burning fiercer than raging fire,<br/>", parse);
	Text.Add("More potent than the finest rum,<br/>", parse);
	Text.Add("To this spell I add warm cum.<br/>", parse);
	Text.Add("Simmer and stir, then boil it all<br/>", parse);
	Text.Add("Steam and smoke, fill my hall!”</i>", parse);
	Text.NL();
	Text.Add("With a <i>fwoosh</i> that fills the entirety of the witch’s hut, a great column of pink smoke rises from the cauldron’s open mouth, spreading outwards before slowly creeping out through the windows and chimney. Slowly, the invisible hands tending to you fade away, and the broomstick pulls itself out of your ass with a slick slurp, leaving a sensation of coolness as chill air invades your gaping asshole.", parse);
	Text.NL();
	Text.Add("At last, the smoke fades somewhat - or at least, enough for you to make out Jenna coming up to you. She’s doused the flame under the cauldron, and stops by your side to give you a pat on the head. You note that the broomstick’s in her hand once more, with absolutely no trace of it ever having been a gigantic wooden horsecock. Maybe that’s for the better.", parse);
	Text.NL();
	Text.Add("<i>“Oh, well done! I commend your pains;<br/>", parse);
	Text.Add("And everyone shall share in the gains;<br/>", parse);
	Text.Add("For I shall now weave my spell<br/>", parse);
	Text.Add("Pulling threads and fixing well<br/>", parse);
	Text.Add("Power to fight this dark hell.”</i>", parse);
	Text.NL();
	Text.Add("Ugh. What just happened?", parse);
	Text.NL();
	Text.Add("<i>“A deed without a name,”</i> Jenna declares proudly. <i>“Come now, then, can you stand, or shall I have to lend you a hand?”</i>", parse);
	Text.NL();
	Text.Add("Right, right. A hand it is. You accept the proffered limb gratefully, and stagger upright with Jenna’s help. Ugh - you’re probably not going to be sitting down for a bit after this. Maybe walk funny a little.", parse);
	Text.NL();
	if(Scenes.Halloween.HW.flags & Halloween.Flags.Carepack) {
		Text.Add("<i>“I’d be the first to offer recompense, but you’ve already claimed your reward - hence; your sole reward this night shall this be: the joy of being buttfucked, and a limp for all to see.”</i>", parse);
		Text.NL();
		Text.Add("What? That’s kinda cheap.", parse);
		Text.NL();
		Text.Add("<i>“The chest held all I had to give,”</i> the witch shrugs, gesturing toward her taciturn companion. <i>“Don’t pout, you’ll live.”</i>", parse);
		Text.NL();
		Text.Add("Fine...", parse);
	}
	else {
		Text.Add("<i>“And now, remuneration for your help. Speak these words to our friend by the table, and they’ll give you what you need.”</i>", parse);
		Text.NL();
		Text.Add("You’re all ears, then. What’re the magic words?", parse);
		Text.NL();
		Text.Add("<b><i>“[pw].”</i></b>", {pw: Halloween.PW()});
		Text.NL();
		if(Scenes.Halloween.HW.flags & Halloween.Flags.PatchesPW) {
			Text.Add("H-hold on... you've heard that before. <i>That's</i> what it was?!", parse);
		}
		else {
			Text.Add("<b>(You should probably write this down somewhere for future reference, so you don’t have to do this again. Unless you really want to, that is.)</b>", parse);
			Text.NL();
			Text.Add("Right, got it.", parse);
		}
	}
	Text.NL();
	Text.Add("<i>“Now go! Go forth and face the terrors of the night! Bring to them your noble, righteous fight! Or you can fuck them silly until the beasts give in; it’s the same thing in the end, really.”</i>", parse);
	Text.NL();
	if(player.Slut() >= 50)
		Text.Add("Why, that sounds like quite the entrancing and exhilarating adventure that lies ahead of you! One full of ghosts and goblins… can you fuck a ghost? Won’t be from lack of trying, that’s for sure!", parse);
	else
		Text.Add("Um, okay. You’ll keep that in mind if all else fails.", parse);
	Text.Add(" Welp, there’s nothing left for you here, unless you still have yet to receive your reward. Besides, your ass has recovered enough for you to at least duckwalk to the door without too much grimacing… you really ought to be on your way, if you don’t have any more business in this place.", parse);
	Text.Flush();
	
	Scenes.Halloween.HW.flags |= Halloween.Flags.PatchesPW;
		
	Gui.NextPrompt();
}

Scenes.Halloween.Patches = function() {
	var knowsPatches = patchwork.Met();
	var patchesGender = patchwork.KnowGender();
	var gotCarepack = Scenes.Halloween.HW.flags & Halloween.Flags.Carepack;
	var hasPassword = Scenes.Halloween.HW.flags & Halloween.Flags.PatchesPW;
	
	var parse = {
		Patches : knowsPatches ? "Patches" : "the trader",
		harpymerchant : patchesGender ? "harpy" : "merchant",
		playername : player.name
	};
	parse = patchwork.ParserPronouns(parse);
	
	Text.Clear();
	if(gotCarepack) {
		Text.Add("You try to strike up another conversation with [Patches], but [heshe] ignores you, [hisher] mind somewhere else… possibly in another world altogether.", parse);
		Text.Flush();
		Gui.NextPrompt();
		return;
	}
	
	parse["pshe"] = patchesGender ? "she’s" : "they’re";
	parse["s"] = patchesGender ? "s" : "";
	
	if(knowsPatches) {
		Text.Add("You’re not sure at first, but after a moment, you’re convinced; it’s Patches! What’s that crazy [harpymerchant] doing here? ", parse);
		Text.NL();
		Text.Add("[HeShe] incline[s] [hisher] head as you greet [himher], offering you a quiet, <i>“[playername]”</i> in acknowledgement. When you ask [himher] what [pshe] doing here, though, [heshe] just stare[s] back at you silently.", parse);
		Text.NL();
		if(patchesGender)
			Text.Add("You don’t know why she’s being so standoffish, but eventually you give up. You know how stubborn this silly harpy can be, especially about her mysterious character. Once you’ve stopped trying, she tilts her head and says something to you.", parse);
		else
			Text.Add("Looks like the usually tight-lipped merchant is feeling even less talkative than usual. Seeing that you’re getting nowhere, you reluctantly give in, mentally cursing eccentric peddlers. You’re so caught up in your private grousing that you almost miss it when they finally say something to you.", parse);
	}
	else {
		Text.Add("You turn to the figure in its colorful patchwork robes, and wonder if there’s actually anyone in there or not. For all you know, it could be a stand. Or a scarecrow. Or… well, anything that’s stands rigidly upright.", parse);
		Text.NL();
		Text.Add("Hello?", parse);
		Text.NL();
		Text.Add("No response.", parse);
		Text.NL();
		Text.Add("Anyone in there?", parse);
		Text.NL();
		Text.Add("The robed figure suddenly moves to <i>look</i> at you… though you don’t think he, or she, or whatever it is can see you when their entire face is covered by the patched robes...", parse);
	}
	Text.NL();
	Text.Add("<i>“Password?”</i> a feminine voice asks.", parse);
	Text.Flush();
	
	var success = function() {
		Text.NL();
		Text.Add("<i>“Correct,”</i> [heshe] says, shuffling to move out of the way.", parse);
		Text.NL();
		Text.Add("Out from under [hisher] robes, you see a chest she seemed to have been perched on. Well, it seems remembering that weird password paid off after all! Let’s see what you got...", parse);
		Text.NL();
		Text.Add("The first thing to emerge from the chest as you start enthusiastically rummaging amongst its contents is a canteen. It’s an old-fashioned circular thing made out of what looks like tin; so battered, dinged, and scratched that it’s honestly a minor miracle it still holds water. Somebody has attempted to write on it, smeared ink just managing to spell out the words <i>Holee Water</i> on its front. Sure enough, when you give it a shake, you can hear water sloshing around inside.", parse);
		Text.NL();
		Text.Add("Okay… not the most promising start, but maybe it’ll come in handy somewhere. Worst comes to the worst, you can always drink it when you’re thirsty, right?", parse);
		Text.NL();
		Text.Add("<i>“That’s all I have, use it with care,”</i> the trader comments.", parse);
		Text.NL();
		Text.Add("Putting it aside, you resume fishing through the chest’s contents again... ah, now here’s something a little more promising; a necklace of garlic bulbs on thick, knotted string. Phew! The smell is enough to make <i>you</i> gag, never mind what it’s supposed to do to vampires and other evil spirits.", parse);
		Text.NL();
		parse["witch"] = Scenes.Halloween.HW.flags & Halloween.Flags.Jenna ? "Jenna" : "the witch";
		Text.Add("<i>“A garlic a day helps keep the salesmen at bay; their offerings disgust me and I don’t want to pay,”</i> you hear [witch] chime in.", parse);
		Text.NL();
		Text.Add("You tuck that away <i>very</i> carefully and keep looking.", parse);
		Text.NL();
		Text.Add("The next item you bring forth is a set of glasses, with very wide lenses of smoked glass. These would block out most of the light were you to wear them, and would certainly make your eyes impossible to see. Still, what possible use could these have?", parse);
		Text.NL();
		Text.Add("<i>“It’s an invisibility charm, but only works on zombies,”</i> the robed figure explains.", parse);
		Text.NL();
		Text.Add("...Okay. Well, you guess zombies aren’t exactly known for their intelligence. You tuck the glasses away and keep looking, only to turn up a sizeable loaf of bread. Very <i>old</i> bread. It’s not moldy, but it’s so stale you could probably knock someone out by hitting them with it, it’s that hard.", parse);
		Text.NL();
		Text.Add("Looking at [witch] or [Patches] only earns you a shrug from both.", parse);
		Text.NL();
		Text.Add("Since you are getting this stuff for free, you can’t complain too much. Pushing it aside, you resume looking. The next item to emerge from the depths of the chest is a small book - a diary, with the name “Jenna” written on the front and a rather tacky amount of pink love hearts and XOXO’s scribbled across its cover.", parse);
		Text.NL();
		Text.Add("<i>“I’ll be taking that,”</i> [witch] says, immediately grabbing the diary from your hands and hugging it close to her chest. <i>“This wasn’t meant for mortal eyes...”</i>", parse);
		Text.NL();
		Text.Add("...You are starting to feel less than confident in what they’ve decided to give you. It’s looking more and more like they just threw in random junk. Holding your tongue, you start looking for something else; you have a feeling you’ve almost seen everything now.", parse);
		Text.NL();
		Text.Add("One more item brushes your fingers, and you pull it into the light; a sizable fake rubber bone. When your fingers tighten on it, it squeaks plaintively.", parse);
		Text.NL();
		
		var werewolf = Scenes.Halloween.HW.Werewolf();
		
		if(werewolf) {
			Text.Add("Squeaky bone! Get it-get it-get it-get it!", parse);
			Text.NL();
			Text.Add("Your prey squeaks and squeals, drowning out the growls that rumble from your throat as you bite and gnaw it for all you’re worth, shaking your head with such ferocity that your ears audibly flap in the wind.", parse);
			Text.NL();
			Text.Add("Triumphant over your enemy, you chew it contentedly, the bone squeaking meekly in your ears.", parse);
			Text.NL();
			Text.Add("And then you realize just what you’re doing. Blushing under the fur of your lupine muzzle, you gingerly extract the doggy toy from between your teeth and tuck it away, unable to look Jenna or [Patches] in the face.", parse);
			Text.NL();
			Text.Add("Desperately trying to cover it up, you return to digging through the chest once more.", parse);
		}
		else {
			Text.Add("Baffled by its inclusion, you squeak it a few times, as if doing so might reveal some hidden magic. But no, it’s just a doggy toy. Maybe there’s something else left in here...", parse);
		}
		Text.NL();
		Text.Add("One final item remains, brushing against your fingertips before you pull it into the light of the cabin. It’s a small pocket notebook, with silver letters against an unadorned black leather cover. The title reads “Practical Guide to Monster Slaying”.", parse);
		Text.NL();
		Text.Add("Now <b>this</b> sounds useful! Eager for advice, you flick it open. Spread across the first two pages, in huge, bold letters, are the words <b>DON’T PANIC!</b>.", parse);
		Text.NL();
		Text.Add("Well, that’s fairly reasonable advice. Eager to see what else is in here, you flick to the next page. And then the next. And the next. You skim through the book until you have gone from cover to cover, and all you find are blank pages. Baffled, you turn to the cabin’s occupants and ask where the rest of the advice is.", parse);
		Text.NL();
		Text.Add("<i>“That’s the only tip the writer had time to write before he was engulfed by a swarm of rabid bats,”</i> [Patches] explains.", parse);
		Text.NL();
		Text.Add("Jenna nods. <i>“Such a pity, an end most raw, to succumb to neither specter nor monster, but to nature’s dread claw.”</i>", parse);
		Text.NL();
		Text.Add("Oh. Well... that’s depressing. Still, it’s pretty good advice, all things considered.", parse);
		Text.NL();
		parse["w"] = werewolf ? "you’re wearing nothing save your furry birthday suit" : "your skimpy outfit";
		Text.Add("How did you manage to pocket all of this considering [w]? The world may never know, but you do so anyway.", parse);
		Text.Flush();
		
		Scenes.Halloween.HW.flags |= Halloween.Flags.Carepack;
		
		party.Inv().AddItem(Items.Halloween.HolyWater);
		party.Inv().AddItem(Items.Halloween.Garlic);
		party.Inv().AddItem(Items.Halloween.Shades);
		party.Inv().AddItem(Items.Halloween.Bread);
		party.Inv().AddItem(Items.Halloween.SqueakyToy);
		party.Inv().AddItem(Items.Halloween.Guide);
		
		Gui.NextPrompt();
	};
	var failure = function() {
		Text.NL();
		Text.Add("<i>“Wrong.”</i>", parse);
		Text.NL();
		if(patchwork.flags["Met"] >= Patchwork.Met.Met2) {
			Text.Add("Wait, <b>what</b>!? Patches <i>never</i> cared about the specifics of the password before - so long as you at least made the effort of humoring [himher], [heshe] would always let you off the hook for trying. ", parse);
			Text.NL();
			parse["isare"] = patchesGender ? "is" : "are";
			Text.Add("From the way [heshe] [isare] looking at you, it’s clear that won’t be the case this time. You’ll have to find the ‘real’ password somewhere if you expect to do business.", parse);
		}
		else {
			Text.Add("Well, that accomplished nothing. Obviously, whoever this weirdo is, they’re serious about this whole password nonsense. If you want to see what they have to offer you, you’ll have to find this password of theirs somewhere out there.", parse);
		}
		Text.Flush();
		
		Gui.NextPrompt();
	};
	
	//[Give Password][Say anything][Leave]
	var options = new Array();
	if(hasPassword) {
		options.push({ nameStr : "Give Password",
			tooltip : Text.Parse("Alright, you found something that may be a password. Let’s try it and see what [heshe] think[s].", parse),
			func : function() {
				Text.Clear();
				Text.Add("Well... lets see how this goes... [pw]?", {pw: Halloween.PW()});
				success();
			}, enabled : true
		});
	}
	options.push({ nameStr : "Input",
		tooltip : "Try to input password.",
		func : function() {
			Text.Clear();
			Text.Add("So, how about...", parse);
			Text.Flush();
			
			var textBox = document.getElementById("textInputArea");
			textBox.value = "";
			textBox.style.visibility = "visible";
			textBox.focus();
			Input.keyDownValid = false;
			
			Gui.NextPrompt(function() {
				var truePw = Halloween.PW().toLowerCase();
				var pw     = textBox.value.toLowerCase();
				textBox.style.visibility = "hidden";
				Input.keyDownValid = true;
				
				Text.Clear();
				Text.Add("...[pw]?", {pw: textBox.value});
				if(truePw == pw)
					success();
				else
					failure();
			});
		}, enabled : true
	});
	options.push({ nameStr : "Say Anything",
		tooltip : knowsPatches ? "Patches never changes; same old game. Just make something up and you know she’ll buy it." : "They can’t seriously expect you to know some cockamamie password. Just try spouting some gibberish, that ought to satisfy them.",
		func : function() {
			Text.Clear();
			Text.Add("You spout some random gibberish... [pw]?", { pw : Scenes.Patchwork.PW() });
			failure();
		}, enabled : true
	});
	options.push({ nameStr : "Leave",
		tooltip : "There’s nothing more you can do here, you might as well get going.",
		func : function() {
			Text.Clear();
			parse["p"] = knowsPatches ? ", beyond a nod of the head" : "";
			Text.Add("You say goodbye to [Patches], even though you don’t get a response in return[p], and leave [himher] be.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Halloween.WakingUp = function(badend) {
	var parse = {
		
	};
	
	Text.Clear();
	if(badend) {
		Text.Add("You sit bolt upright in your bedroll, sweating profusely and gasping for breath until you realize that whatever just happened, it was all but a dream, a nightmare. Fragments of memory claw at the edges of your consciousness, but whatever was in the pumpkin pie you ate is quickly chasing even that from your mind.", parse);
		Text.NL();
		Text.Add("Ugh. Your skull pounds, and the inside of your mouth feels like it’s been coated with dry dog hair. Time to wash up and make yourself presentable if you’re going to be facing a new day.", parse);
	}
	else {
		Text.Add("Your eyes flicker open, and you realize that you’re in your tent at the nomad’s camp - you must’ve dozed off here to sleep off the heavy pie you had last night. Odd, though. You faintly recall some kind of strange dream you had, but the details elude you, no matter how much you try to remember them. As least you don’t feel that badly affected by the copious amounts of liquor that must have been baked into that pie.", parse);
		Text.NL();
		Text.Add("Oh well, if the dream was important, it’ll probably show up again. Time to wake up and get started on your day.", parse);
	}
	Text.Flush();
	
	Scenes.Halloween.HW.Restore();
	//Sleep
	world.TimeStep({hour: 8});
	party.RestFull();
	//Return to Eden
	party.location = world.loc.Plains.Nomads.Tent;
	
	Gui.NextPrompt();
}

