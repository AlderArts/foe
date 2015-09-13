
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
	Elder : 1
};

Halloween.prototype.Restore = function() {
	// Restore player/oarty
	player.FromStorage(this.player);
	party.FromStorage(this.party);
	
	world.TimeStep({hour: 8});
	
	party.location = world.loc.Plains.Nomads.Tent;
	
	party.RestFull();
}

Halloween.Loc = {
	Tent : new Event("Tent?"),
	Camp : new Event("Nomads' camp?"),
	Path : new Event("Beaten path")
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
		Text.Add("Taking a deep breath and squaring your shoulders, you peer out of the tent flaps, and blink at the scene that meets your eyes. It’s still the nomad’s camp after a fashion, it’s just that... well, everything is spookier, for lack of a better word to describe it. The light of the fire pit is still visible in the distance against a thick carpet of milky-white fog, maybe that should be your first stop once you get started.", parse);
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
			Text.Add("You see... still, if he can tell you anything, that would be much appreciated. You have to try and find a way back where you belong.", parse);
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
				Text.Add("…The last thing you remember is a single black raven feather floating down in a world of white...", parse);
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
	
	Gui.NextPrompt();
}

