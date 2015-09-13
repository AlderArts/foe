
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
	Elder : 1,
	Kiai : 2,
	Werewolf : 4
};

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
	Graveyard : new Event("Graveyard")
};

// gameCache.flags["HW"]
Halloween.State = { //Bitmask for globally tracked flag
	Intro : 1,
	Pie : 2
};

Scenes.Halloween = {};

//TODO Kind of odd req.
//TODO Possibly clear flag?
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

/* TODO
 * #add “pie” option to nomads’ camp from 17-22 pm when Halloween season/debug is active.
[Pumpkin Pie]
 */
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

/* TODO
Halloween.Loc.Graveyard.events.push(new Link(
	"", true, true,
	null,
	function() {
		
	}
));

Halloween.Loc.Graveyard.enc = new EncounterTable();
Halloween.Loc.Graveyard.enc.AddEnc(function() {
	return function() {
		
	};
}, 1.0, function() { return true; });
*/

//TODO LINK
//TODO //Have Kiai show up as a random encounter when entering the graveyard from any direction.
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
	scenes.AddEnc(function() {
		dest = Halloween.Loc.Chapel;
	}, 1.0, function() { return true; });
	*/
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

