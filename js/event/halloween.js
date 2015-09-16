
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
	party.AddMember(player);
	// Move to Halloween world
	party.location = Halloween.Loc.Tent;
	// Set up internal flags
	this.flags = 0;
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
	Carepack  : 1024
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
	// Restore player/oarty
	player.FromStorage(this.player);
	party.FromStorage(this.party);
}

Halloween.prototype.Werewolf = function() {
	return this.flags & Halloween.Flags.Werewolf;
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
	Text.Add("<i>“It’s an old custom I once had from where I came from… to have pumpkin and sweets at this time of year, often so much that you get sick of it. Pumpkin pie does both quite well, especially when you spike it a little. Well, more than a little.”</i> He grins, a rare sight. <i>“Point being, you’re more than welcome to join us - there’s a slice with your name on it if you care to show up on time.”</i>", parse);
	Text.NL();
	Text.Add("That’s very kind of him. You’ll consider taking him up on his offer.", parse);
	Text.NL();
	Text.Add("<i>“Good.”</i> The chief draws on his pipe, and blows out a long plume of smoke. <i>“We all get sick of it by the end of the season, but it’s not proper to waste perfectly good food, you know? Considering the size of our pumpkin patch, another mouth to feed is actually welcome at this point. Remember, turn up around dinnertime. Too early or too late, and there’ll be no pie for you.”</i>", parse);
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
	
	var p1 = party.Get(1);
	parse["comp"] = party.Num() == 2 ? p1.name : "your companions";
	
	Text.Clear();
	if(first) {
		Text.Add("You’re about to head into the nomads’ when the delicious scent of baked treats wafts over to you, sweet and enticing. Yep, like the chief said - that’s definitely the smell of pumpkin pie - warm honey, baked flour, melted butter and thick pumpkin all mixed together in a delectable aroma, topped with… whatever it is that they’ve spiked the pie filling with. It’s enough to make one’s mouth water, and you find yourself drawn by some inexorable magnetism towards the source of the scent.", parse);
		Text.NL();
		Text.Add("As it turns out, that happens to be a small brick oven which has been set up near the fire pit in the middle of camp. [Momo] is bent over the thing, pulling out a trio of pies from its innards - already, two sit atop the oven cooling while the last one is in [Momo2]’s hands. Each one bears thick, crumbly crust; orange-golden filling, a perfectly smooth, tantalizing surface… that, and each one is absolutely massive. Chief wasn’t lying when he said that you were more than welcome to have a slice - there’s definitely more than enough for every single one of the nomads to have some and still run the risk of ending up with leftovers.", parse);
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
			Text.Add("[Estevan] chuckles. <i>“Shucks, that’s high praise coming from him, but I guess it was expected. Good ingredients, good cook…the outcome was never truly in doubt. A good pie.”</i>", parse);
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
					Text.Add("<i>“Huh, maybe I should plant a patch of this back home,”</i> Gwendy ponders, chewing thoughtfully. <i>“I can see turning a fine profit from this!”</i>", parse);
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
		Text.Add("…And you realize that you’re absolutely stark naked.", parse);
		Text.NL();
		parse["fem"] = player.Gender() == Gender.male ? "thong" : "bra and panties";
		Text.Add("Hey, did you do something you’ll regret later? Where’s everyone? Usually there’s always some kind of bustle in the nomads’ camp, but all you get from beyond the canvas confines of your tent is deathly silence. And why’s there this skimpy-looking costume lying on the ground beside you? Shrugging, you pick it up - looks like a leather [fem] and a tattered cloak, all in garish shades of black. You must’ve gotten into some real kinky stuff last night… just what’s going on here?", parse);
		Text.NL();
		Text.Add("Taking a deep breath and squaring your shoulders, you peer out of the tent flaps, and blink at the scene that meets your eyes. It’s still the nomad’s camp after a fashion, it’s just that… well, everything is spookier, for lack of a better word to describe it. The light of the fire pit is still visible in the distance against a thick carpet of milky-white fog, maybe that should be your first stop once you get started.", parse);
		Text.NL();
		Text.Add("Maybe you’ll stay in here a little while longer, though. Gather yourself, maybe get dressed before venturing out into whatever you’ve managed to land yourself in this time…", parse);
	}
	else {
		Text.Add("You open your eyes and have a distinct sense of deja vu. There’s something familiar about this tent that you can’t quite place, about the strange sense of weightiness that pervades the air, but you can’t quite figure out what. A draft of chill air dances in from the tent flaps and caresses your [skin], and you realize that you’re stark naked.", parse);
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
			Text.Add("As you approach, the figure slowly turns to look at you, and a dry, raspy voice sounds out from under the hood.", parse);
			Text.NL();
			Text.Add("<i>“Hello, my friend! Stay awhile and listen.”</i>", parse);
			Text.NL();
			Text.Add("Poor fellow sounds like he could use a drink, but he seems friendly enough. Presented with so obvious an invitation, you greet him and ask him who he is.", parse);
			Text.NL();
			Text.Add("<i>“I’m afraid I don’t have a name, young one, but you may call me Elder. I’m the last remnant of this camp.”</i> He motions to the abandoned tents around you. <i>“And I’m afraid I don’t have much to offer, save for advice from an old man, and what little hospitality I can muster.”</i>", parse);
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
				Text.Add("<i>“As I mentioned earlier, there is an elven witch who lives in a hut in the woods who may or may not help you in your quest. Even though she is my friend, she is quite the temperamental creature, and deciding whether to trust her can be a good idea or not, depending on how fickle she is…”</i>", parse);
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
	Text.NL(); //TODO Ronnie
	Text.Add("Off in the distance, you hear a raven caw, and a faint sigh echoes through the sickly forest. Still, you press on, and eventually the trees and thorny undergrowth thin a little as you near a crossroads, one with many, many paths branching out from its heart like the spokes of a wheel. From here, you can also make out some landmarks in the distance - perhaps you’re meant to be headed to one of these?", parse);
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
/* TODO Ronnie
Halloween.Loc.Path.events.push(new Link(
	"", true, true,
	null,
	function() {
		
	}
));
*/
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
/* TODO Laggoth
Halloween.Loc.Chapel.events.push(new Link(
	"", true, true,
	null,
	function() {
		
	}
));
*/
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
	Text.Add("Right. You get the better of your instinctive aversions, and force yourself to move towards the bed; a shiver crawls down your skin as you swear the roses turn to follow your path through the room. Taking hold of the gold-trimmed velvet drapes in one hand, you draw them aside to reveal -", parse);
	Text.NL();
	if(cveta.Met()) {
		Text.Add("- Well. She may <i>look</i> like Cveta, but it clearly isn’t her. ", parse);
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
		Text.Add("- A young avian woman, by all appearances in the rich blossom of her womanhood, lounging on the bed’s rich trimmings. With her voluptuous form and the maternal airs that surround her, she cuts quite the figure - a sentiment that’s only reinforced as she looks directly at you and let out a husky, sultry hum from the back of her throat.", parse);
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
		Text.Add("<i>“Fuck this, I can’t take it any more! It’s time for your reward, cum-pump!”</i> ", parse);
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
			Text.Add("Indeed, at length, Jenna returns, adjusting her hat on her head as she casts a glance at the table.<i>“I observe you haven’t touched your tea. Might it be you’re waiting for me?”</i>", parse);
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

