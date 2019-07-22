
import { Event, Link } from '../event';
import { Inventory } from '../inventory';
import { world } from '../world';
import { GetDEBUG } from '../../app';

let HalloweenScenes = {};

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
	this.harthon = 0;
	this.harthonPreg = 0; //0-5, 5 kit is born
	this.nadirma = 0;
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
	Laggoth   : 2048,
	Mausoleum : 4096,
	TRoom     : 8192,
	NadirMa   : 16384
};
Halloween.Ronnie = {
	NotMet  : 0,
	Removed : 1,
	PCBeta  : 2,
	PCAlpha : 3
};
Halloween.Harthon = {
	Met          : 1,
	Thrall       : 2,
	ThrallCalled : 4,
	Feminized    : 8,
	BJ           : 16
};
Halloween.NadirMa = {
	GaveCock  : 1,
	GaveBalls : 2,
	SaidNo    : 4
};

Halloween.PW = function() {
	return "Klaatu Barada Nikto";
}

//Note: checks real time date
Halloween.IsSeason = function() {
	// Always allow debug
	if(GetDEBUG()) return true;
	
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

Halloween.CockParser = function(parse) {
	parse = parse || {};
	if(!player.FirstCock()) {
		parse["cocks"] = "stake-strapon";
		parse["cock"] = "stake-strapon";
		parse["cockTip"] = "tip";
	}
	return parse;
}

Halloween.prototype.HarthonParser = function(parse) {
	parse = parse || {};
	var fem = this.harthon & Halloween.Harthon.Feminized;
	parse["mastermistress"] = player.mfTrue("master", "mistress");
	parse["MasterMistress"] = player.mfTrue("Master", "Mistress");
	parse["foxvixen"] = fem ? "vixen" : "fox";
	parse["LordLady"] = fem ? "Lady" : "Lord";
	parse["HeShe"] = fem ? "She" : "He";
	parse["heshe"] = fem ? "she" : "he";
	parse["HisHer"] = fem ? "Her" : "His";
	parse["hisher"] = fem ? "her" : "his";
	parse["hishers"] = fem ? "hers" : "his";
	parse["himher"] = fem ? "her" : "him";
	return parse;
}

Halloween.Loc = {
	Tent : new Event("Tent?"),
	Camp : new Event("Nomads' camp?"),
	Path : new Event("Beaten path"),
	Graveyard : new Event("Graveyard"),
	Mausoleum : new Event("Mausoleum"),
	TortureRoom : new Event("Torture room"),
	Chapel : new Event("Burned chapel"),
	WitchHut : new Event("Witch's hut")
};

// gameCache.flags["HW"]
Halloween.State = { //Bitmask for globally tracked flag
	Intro : 1,
	Pie   : 2
};


//Trigger this on stepping into the Nomads’ for the first time when season is active.
HalloweenScenes.PieIntro = function() {
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

HalloweenScenes.PumpkinPie = function() {
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
					HalloweenScenes.EnterDream(true);
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
			HalloweenScenes.EnterDream(false);
		});
	}
}

HalloweenScenes.EnterDream = function(first) {
	var parse = {
		skin : player.SkinDesc()
	};
	
	HalloweenScenes.HW = new Halloween();
	
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
		if(HalloweenScenes.HW.flags & Halloween.Flags.Elder)
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
		if(HalloweenScenes.HW.flags & Halloween.Flags.Elder)
			return "Elder";
		else
			return "Figure";
	}, true, true,
	null,
	function() {
		var parse = {
			
		};
		
		var first = !(HalloweenScenes.HW.flags & Halloween.Flags.Elder);
		HalloweenScenes.HW.flags |= Halloween.Flags.Elder;
		
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
	if(HalloweenScenes.HW.RonnieAvailable() && Math.random() < 0.5)
		HalloweenScenes.Ronnie();
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
		return HalloweenScenes.HW.flags & Halloween.Flags.WitchHut ? "Witch's hut" : "Hut?";
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
	"Thrall", function() {
		return HalloweenScenes.HW.harthon & Halloween.Harthon.Thrall;
	}, true,
	null,
	function() {
		HalloweenScenes.HarthonThrall();
	}
));

Halloween.Loc.Path.events.push(new Link(
	"Beta", function() {
		return HalloweenScenes.HW.ronnie == Halloween.Ronnie.PCAlpha;
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
				
				HalloweenScenes.RonniePitch();
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

HalloweenScenes.Ronnie = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("This dry, dusty path winds its way through the trees, twisting and turning under gnarled branches and over knobbly roots as it leads… well, somewhere. You’re not quite sure <i>exactly</i> where, but your [feet] seem to have taken on a life of their own, ferrying you down the path to your fate. Come to think of it, you’re not even sure where all the trees came from - they just seem to have sprung up all of a sudden to block out as much moonlight as they can with their twisted, thinly-leafed branches.", parse);
	Text.NL();
	// Check out what's going on with Ronnie and select correct path
	var first = HalloweenScenes.HW.ronnie == Halloween.Ronnie.NotMet;
	
	if(first) {
		HalloweenScenes.RonnieFirst();
	}
	else if(HalloweenScenes.HW.ronnie == Halloween.Ronnie.PCBeta) {
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
				HalloweenScenes.RonnieCatch();
			}, enabled : true
		});
		options.push({ nameStr : "Fight!",
			tooltip : "It’s time for a new alpha!",
			func : HalloweenScenes.RonnieReversal, enabled : true
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
				HalloweenScenes.RonniePitch();
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

HalloweenScenes.RonnieFirst = function() {
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
	if(HalloweenScenes.HW.flags & Halloween.Flags.Graveyard) beenAround = true;
	if(HalloweenScenes.HW.flags & Halloween.Flags.WitchHut) beenAround = true;
	
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
						
						HalloweenScenes.WerewolfTF();
						
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
									HalloweenScenes.RonniePitch();
								});
							}, enabled : true
						});
						options.push({ nameStr : "Leave",
							tooltip : "Let’s see what else is out there, waiting to be chased!",
							func : function() {
								Text.Clear();
								Text.Add("Shaking your head, you turn and head back the way you came - with your new nose, it’s easy to find your path. Let Ronnie go; you have other places to explore.", parse);
								Text.Flush();
								
								HalloweenScenes.HW.ronnie = Halloween.Ronnie.Removed;
								
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
						
						HalloweenScenes.WerewolfTF();
						
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
							func : HalloweenScenes.RonnieReversal, enabled : true
						});
						options.push({ nameStr : "Submit",
							tooltip : "There’s a certain thrill in being taken by the smaller wolf, and you do owe him for your current form… Maybe it wouldn’t hurt to be his beta.",
							func : function() {
								Text.Clear();
								Text.Add("Whining softly, you lower your head meekly to the ground, hungrily grinding your hips back on your beautiful white alpha’s cock, ready and eager to be marked as belonging to him.", parse);
								Text.NL();
								Text.Add("The smaller wolf leans over your back to gently lick the back of your neck, pressing his shaft harder into your puckered hole.", parse);
								Text.NL();
								
								HalloweenScenes.RonnieCatch();
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
							
							HalloweenScenes.HW.ronnie = Halloween.Ronnie.Removed;
							
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
			
			HalloweenScenes.HW.ronnie = Halloween.Ronnie.Removed;
			
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.WerewolfTF = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	//TODO
	var blessed = false; //HalloweenScenes.HW.flags & Halloween.Flags.Nadirmasomething...
	
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
	HalloweenScenes.HW.flags |= Halloween.Flags.Werewolf;
}

HalloweenScenes.RonniePitch = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	var first = HalloweenScenes.HW.ronnie != Halloween.Ronnie.PCAlpha;
	HalloweenScenes.HW.ronnie = Halloween.Ronnie.PCAlpha;
	
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

HalloweenScenes.RonnieCatch = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	HalloweenScenes.HW.ronnie = Halloween.Ronnie.PCBeta;
	
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

HalloweenScenes.RonnieReversal = function() {
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
		HalloweenScenes.RonniePitch();
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
					HalloweenScenes.WakingUp(false);
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
Halloween.Loc.Graveyard.links.push(new Link(
	"Mausoleum", true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.Mausoleum);
	}
));

Halloween.Loc.Graveyard.onEntry = function() {
	var repeat = HalloweenScenes.HW.flags & Halloween.Flags.Graveyard;
	HalloweenScenes.HW.flags |= Halloween.Flags.Graveyard;
	
	if(repeat && (Math.random() < 0.5))
		PrintDefaultOptions();
	else
		HalloweenScenes.Kiai();
}

HalloweenScenes.Kiai = function() {
	var parse = {
		name : kiakai.name
	};
	var gender = kiakai.flags["InitialGender"];
	parse = kiakai.ParserPronouns(parse, "", "", gender);
	
	var werewolf = HalloweenScenes.HW.Werewolf();
	
	var first = !(HalloweenScenes.HW.flags & Halloween.Flags.Kiai);
	HalloweenScenes.HW.flags |= Halloween.Flags.Kiai;
	
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
		func : HalloweenScenes.KiaiRun, enabled : true
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
					HalloweenScenes.KiaiGangrape();
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
						HalloweenScenes.KiaiGangrape();
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
						HalloweenScenes.KiaiGangrape();
					}, enabled : true
				});
			}
			options.push({ nameStr : "Run",
				tooltip : "Uhh... on second thought, just run away.",
				func : HalloweenScenes.KiaiRun, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.KiaiRun = function() {
	var parse = {
		
	};
	var werewolf = HalloweenScenes.HW.Werewolf();
	
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
	scenes.AddEnc(function() {
		dest = Halloween.Loc.Mausoleum;
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		dest = Halloween.Loc.Chapel;
	}, 1.0, function() { return true; });
	scenes.Get();
	
	Gui.NextPrompt(function() {
		party.location = dest;
		PrintDefaultOptions();
	});
}

HalloweenScenes.KiaiGangrape = function() {
	var parse = {
		name : kiakai.name
	};
	var gender = kiakai.flags["InitialGender"];
	parse = kiakai.ParserPronouns(parse, "", "", gender);
	parse = player.ParserTags(parse);
	
	var vag = player.FirstVag();
	
	var werewolf = HalloweenScenes.HW.Werewolf();
	
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
		HalloweenScenes.WakingUp(true);
	});
}


Halloween.Loc.Mausoleum.description = function() {
	var first = !(HalloweenScenes.HW.flags & Halloween.Flags.Mausoleum);
	if(first) {
		Text.Add("Curiosity gets the best of you and you decide to investigate.");
		Text.NL();
		Text.Add("Once you’re past the first flight of stairs, you realize that this isn’t exactly a mausoleum, it’s more of a dungeon. Rows of cells line both sides of the long hallway you find yourself in, some of them inhabited by spiders, others by rats, and a few of them containing the remains of what you suppose was once a prisoner.");
		Text.NL();
		Text.Add("You check the cells and find that you can’t move the doors. Even if they were unlocked, you doubt you’d be able to force them open without tools, the joints of the barred doors having long since succumbed to rust and the wear and tear of long years without maintenance.");
		Text.NL();
		Text.Add("You can only imagine what it was like for the prisoners, withering away in this abandoned place…");
		Text.NL();
		Text.Add("Shaking your head to rid yourself of such thoughts, you press on. For some reason, the torches are still lit in the long, winding hallway, and you soon find yourself in what looks like a storage room of some sort.");
		HalloweenScenes.HW.flags |= Halloween.Flags.Mausoleum;
	}
	else {
		Text.Add("You walk down the familiar flight of stairs, walking along the rows of abandoned cells until you reach the storage.");
	}
	Text.NL();
	Text.Add("The copious amount of spiderwebs aside, there are a couple tables lining the walls. One of them holds several bags that smell of something old and rotten; another holds various ancient scrolls, which you’re loathe to touch lest they crumble into dust.");
	Text.NL();
	Text.Add("There’s a rusty chest on a corner and stacks of crates in absolute disrepair, some of them lie shattered under the weight of other boxes, their contents long since pilfered by robbers or the many rats scurrying about.");
	Text.NL();
	Text.Add("On one of the walls, you spy a heavy-looking wooden door. It’s held shut by a wooden bar.");
	Text.NL();
	Text.Add("Aside from the door, only one object stands out in this abandoned storage. ");
	if(HalloweenScenes.HW.harthon & Halloween.Harthon.Met)
		Text.Add("The black coffin that sat there is now gone, moved away to who knows where, the only trace of its presence being the spot framed by the dust of the storage.");
	else
		Text.Add("One is a black coffin, seemingly out of place with how well it’s maintained compared to everything else. Just approaching it fills you with dread.");
}

Halloween.Loc.Mausoleum.links.push(new Link(
	"Leave", true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.Graveyard);
	}
));
Halloween.Loc.Mausoleum.links.push(new Link(
	function() {
		return (HalloweenScenes.HW.flags & Halloween.Flags.TRoom) ? "Torture room" : "Door";
	}, true, true,
	null,
	function() {
		MoveToLocation(Halloween.Loc.TortureRoom);
	}
));

Halloween.Loc.Mausoleum.events.push(new Link(
	"Coffin", function() {
		return !(HalloweenScenes.HW.harthon & Halloween.Harthon.Met);
	}, true,
	null,
	function() {
		HalloweenScenes.HarthonFirst();
	}
));


Halloween.Loc.TortureRoom.description = function() {
	var first = !(HalloweenScenes.HW.flags & Halloween.Flags.TRoom);
	HalloweenScenes.HW.flags |= Halloween.Flags.TRoom;
	
	Text.Add("Your first impression of the chamber is that it’s some kind of dungeon. A second impression confirms it, although a rather different sort of dungeon than you had initially believed.");
	Text.NL();
	Text.Add("Whoever stocked this room must have been quite the BDSM fanatic. Flickering torches keep everything in a sinisterly array of light and dark, shifting shadows adding an air of menace even with the lack of bodily harm threatened. Several tables are laid out, all with either arrays of heavy leather straps fixed to them, rotating bases, or both. A rack - repurposed for less lethal interrogations - sits in one corner, whilst a large rocking horse sits in another.");
	Text.NL();
	Text.Add("The walls are bedecked with all kinds of tools of sexual humiliation and punishment. Whips and cat-o-nine-tails in more styles than you had ever seen in one place before. Intricately crafted paddles, pegs, gags and masks. And in pride of place, sex toys: beads, vibrators, and especially dildos, the latter in an array of shapes and sheer sizes that ");
	if(player.Slut() < 50)
		Text.Add("makes you flush and cast your eyes away, unable to look at them.");
	else
		Text.Add("makes even an experienced slut like you look at them a little askance.");
	Text.NL();
	Text.Add("Aside from all of the sexual paraphernalia, the room is pretty much empty. The only thing of interest lies at the center of the room; an expensive-looking urn fashioned in the likeness of a dog. It’s carved with ancient drawings and glyphs you couldn’t hope to puzzle out.");
}

Halloween.Loc.TortureRoom.links.push(new Link(
	"Leave", true, true,
	null,
	function() {
		Text.Clear();
		if(player.Slut() < 50)
			Text.Add("You’re more than happy to leave this creepy place and all these perverted devices to keep gathering dust.");
		else
			Text.Add("Although you can’t resist casting an appreciative eye over the many delicious toys scattered around, you ultimately shrug your shoulders and leave. They’re just no fun when there’s nobody else to play with.");
		Text.Flush();
		
		Gui.NextPrompt(function() {
			MoveToLocation(Halloween.Loc.Mausoleum);
		});
	}
));

Halloween.Loc.TortureRoom.events.push(new Link(
	"Urn", function() {
		return !(HalloweenScenes.HW.flags & Halloween.Flags.NadirMa);
	}, true,
	null,
	function() {
		HalloweenScenes.NadirMaApproach();
	}
));

HalloweenScenes.NadirMaApproach = function() {
	var parse = {
		
	};
	Text.Clear();
	Text.Add("It certainly doesn’t look very fancy. Roughly a foot tall and about four inches across, and made from undecorated clay, it wouldn’t go amiss on a bar somewhere filled with roasted nuts or pickled eggs. The most unusual thing about it is the presence of a few small engravings, depicting hieroglyphs you can’t decipher, and its lid. Someone went to the trouble of sculpting a small bust of a canid’s head - you think it’s a jackal, but you’re not sure - and fitting it atop the urn as a plug.", parse);
	Text.NL();
	Text.Add("As you reach for the plug, you’re overcome with a powerful sense of dread. Something about this urn just exhales an ominous vibe… Should you really open it?", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "It’s just a damned jar, what are you afraid of? What could go wrong?",
		func : function() {
			HalloweenScenes.NadirMa();
		}, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "No, you’re not going to fall for this. Let sleeping evils lie.",
		func : function() {
			PrintDefaultOptions();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.NadirMa = function() {
	var werewolf = HalloweenScenes.HW.Werewolf();
	
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	HalloweenScenes.HW.flags |= Halloween.Flags.NadirMa;
	
	Text.Clear();
	Text.Add("Having made your decision, you wrap your hands around the muzzle and give the head a good twist to break the seal. There’s a faint hiss of displaced air, and then you lift the lid and carefully place it aside before stepping closer and peering within.", parse);
	Text.NL();
	Text.Add("Whatever you might have been expecting... you’re underwhelmed. The darkness of the chamber works to obscure most of the urn’s depths, but you can faintly make out something wet and shimmering with the stray traces of light that make it through its clay lips.", parse);
	Text.NL();
	Text.Add("Something about the muffled gleam makes you uneasy... and then, you swear you see something <b>move</b> inside!", parse);
	Text.NL();
	Text.Add("Startled, you skip backwards as a spout of chocolate-brown substance erupts from inside of the urn. It gushes over the rim and spills down over its sides, forcing you to scurry away as it puddles on the stone floor.", parse);
	Text.NL();
	Text.Add("The urn ceases its unnatural fountain only when a great pool of warm, brown, viscous liquid is rippling on the ground. As if you needed further proof of its unearthly origin, it begins to well upwards, bubbles forming streamers that twine around each other like magical vines, supporting each other as they climb towards the ceiling.", parse);
	Text.NL();
	Text.Add("Before your amazed eyes, the liquid forms the shape of a humanoid being... and then, its color changes; from the earthen hue of the liquid to more lively-looking tones, until what stands before you is no simulacra, but a flesh-and-blood creature.", parse);
	Text.NL();
	if(miranda.Met())
		Text.Add("What stands before you now is a trim, toned, female dobermorph whose ample curves offset the muscles of a trained fighter. She looks exactly like Miranda, save for one key detail - the very noticeable emptiness between her thighs. Whoever or whatever this creature is, she lacks the impressive maleness that Miranda takes such pride in.", parse);
	else
		Text.Add("It’s a statuesque and <i>very</i> amply female canine-morph - a doberman, you think. Though her naked breasts are full, and even from here you can make out the lusciousness of her buttocks, her belly is flat and toned, and her limbs visibly ripple with power. Whoever this is, she’s not just a pretty face.", parse);
	Text.NL();
	Text.Add("As you finish your observations, the statuesque figure suddenly begins to move. Long, toned arms pivot, reaching for the ceiling as she stretches until she is up on her toes, the act thrusting out her ample bosom even more. Her mouth falls open in a jaw-cracking yawn, the noise echoing through the mausoleum as she twists her shoulders. Rich green eyes open, gazing blearily about the chamber as she dreamily smacks her lips, scratching quite indelicately at her shapely rump.", parse);
	Text.NL();
	Text.Add("Before you can think to move, her gaze falls on you and she visibly snaps fully awake, eyes sharpening as she takes in the sight of you.", parse);
	Text.NL();
	Text.Add("<i>“Well, what do we have here?”</i> she says, sashaying towards you with a predatory smile.", parse);
	Text.NL();
	parse["proverbial"] = player.HasLegs() ? "" : " proverbial";
	Text.Add("Something in the way she looks at you makes your skin crawl; there’s a hunger there that seems sexual, but with something ever so slightly <i>off</i> about it. You find yourself swallowing a lump that rises in your throat, unable to bring yourself to meet her gaze as you take a[proverbial] step back. Instead, you focus your gaze firmly on her feet, watching her strut towards you.", parse);
	Text.NL();
	Text.Add("She chuckles at your reaction. <i>“What’s the problem? Feeling shy?”</i>", parse);
	Text.NL();
	Text.Add("Feeling defensive, you assure her that it’s not so much shyness as uncertainty about where to look. She’s rather...underdressed.", parse);
	Text.NL();
	Text.Add("<i>“Oh? So you are the type that gets nervous around naked women? How cute!”</i> She chuckles once more. <i>“Alright then, if you can’t bear to look at my naked body, I think I can do something about it.”</i>", parse);
	Text.NL();
	Text.Add("Confused, you look up from the floor you have been so busily inspecting as the naked dobermorph raises a hand with a lazy wave. The urn behind her - from which she recently emerged - visibly rocks on its base, clattering softly against the stone floor. It shudders violently, and then goes still as what looks like a huge, off-white serpent suddenly erupts from its depths!", parse);
	Text.NL();
	Text.Add("As the serpent lashes through the air, curling towards the strange canid female, you realize your first impression was mistaken. It’s not a snake at all, but a great mass of long, linen bandages, all clustered together and moving with a single will.", parse);
	Text.NL();
	Text.Add("On reaching the dobermorph, the bandages start to break apart, becoming a linen hydra that starts to envelop her frame. They twine themselves sinuously around her limbs, crisscrossing bands that form diamond-like gaps of exposed fur. They curl over her chest, looping past her breasts rather than over them.", parse);
	Text.NL();
	Text.Add("The overall effect is reminiscent of some sort of bondage gear, serving to emphasize her womanhood rather than to obscure it. About the only concession to modesty is at her hips. There, the bandages intricately twine around themselves, circling her waist and diving down through her buttock cleavage before rising up to join the circle, forming a skimpy pair of panties made purely from bandages.", parse);
	Text.NL();
	Text.Add("The dobermorph makes a few poses, examining herself with a smile. <i>“There. Is this better?”</i>", parse);
	Text.NL();
	Text.Add("Since she’s clearly not hostile, you feel the tension draining out of your body. Looking her in the eye, you dryly note that you’d guess it’s better. A little. You rather thought she was going to put some actual clothes on, not just tie a few ribbons on to show herself off some more.", parse);
	Text.NL();
	Text.Add("<i>“Humph, you’re one to talk.”</i> She makes a gesture at you. ", parse);
	if(werewolf) {
		Text.Add("<i>“You walk around completely in the buff, showing off all your naughty bits to anyone that cares to look,”</i> she adds with a smirk.", parse);
		Text.NL();
		Text.Add("Well, it’s different in your case. People don’t make much clothing that fits someone with your proportions, and you have a certain difficulty in putting them on. You wriggle your fingers, emphasizing the long, sharp claws tipping them, to make it clear what that difficulty might be. Besides, the fur hides everything important on you anyway.", parse);
		Text.NL();
		Text.Add("<i>“Not that beautiful pair of jewels you have dangling there,”</i> she points at your crotch, chuckling at her own remark.", parse);
		Text.NL();
		Text.Add("...Okay, she’s got a point there.", parse);
		Text.NL();
		Text.Add("<i>“Make no mistake, cutie. I’m not criticizing you; in fact, I love the whole birthday suit look you got going there. It’s really… <b>interesting</b>.”</i> She grins.", parse);
	}
	else {
		Text.Add("<i>“You walk around with these skimpy clothes that leave <b>very</b> little to the imagination. So what if I’m a bit more… showy? ”</i> she adds with a smirk.", parse);
		Text.NL();
		Text.Add("You’re just making do with what you have, though. These are the only clothes you’ve been able to find. She looked like she could have whipped up a lot more coverage out of all those bandages of hers, though.", parse);
		Text.NL();
		Text.Add("<i>“Oh? I could have? And who are you to make that claim? You act as if you know me well...”</i>", parse);
		Text.NL();
		Text.Add("You quickly apologize; you don’t know her well, but she manipulated those bandages with such skill, you were sure she could have dressed herself up with them however she wished, if she felt it necessary.", parse);
		Text.NL();
		Text.Add("The dobermorph chuckles. <i>“Apologies accepted. But really, I just wanted to match your style. It’s not fair that I’m the only one getting all the eye candy.”</i> She grins.", parse);
	}
	Text.NL();
	Text.Add("<i>“I believe we haven’t introduced ourselves yet. I would surely remember a cutie like yourself. What’s your name?”</i>", parse);
	Text.NL();
	Text.Add("Seeing no harm in answering, you tell the morph that your name is [playername].", parse);
	Text.NL();
	Text.Add("<i>“Pleasure meeting you, [playername]. I am Nadir-Ma.”</i>", parse);
	Text.NL();
	Text.Add("It’s nice to meet her.", parse);
	Text.NL();
	Text.Add("<i>“Now that we’re acquainted, [playername], how about we talk business?”</i>", parse);
	Text.NL();
	Text.Add("Puzzled, you ask her what she means.", parse);
	Text.NL();
	Text.Add("<i>“You see, I’ve been stuck inside that jar for the better part of a millennium, and I’m feeling just a little bit pent up.”</i>", parse);
	Text.NL();
	Text.Add("Wait, is she going where you think she’s going?", parse);
	Text.NL();
	parse["wo"] = player.mfTrue("", "wo");
	Text.Add("<i>“And now I’m faced with such a delicious looking [wo]man… it’s just too much to bear, trust me. I’m already wet!”</i> she shamelessly declares touching the wet bandages covering her honeypot.", parse);
	Text.NL();
	Text.Add("...Yeah, you suspected that’s where she was going.", parse);
	Text.NL();
	Text.Add("<i>“How about you be a gentle[wo]man and help a girl relieve some tension?”</i>", parse);
	Text.NL();
	Text.Add("Well, it’s not like you can’t understand where she’s coming from. That’s a <b>long</b> time to go without getting any sex. Wouldn’t it be nice to help her out, like she asked you to? On the other hand... she’s clearly something supernatural. Getting that close to her mightn’t be a good idea...", parse);
	Text.Flush();
	
	var prompt1 = function() {
		Text.Clear();
		Text.Add("You tell Nadir-Ma that you’d be more than happy to help her relieve some tension.", parse);
		Text.NL();
		Text.Add("<i>“Excellent answer, cutie. But before we get down to it, I’ll have you ‘serve’ me for a little bit.”</i>", parse);
		Text.NL();
		Text.Add("Oh? Sounds like someone has something particular in mind...", parse);
		Text.NL();
		Text.Add("<i>“Just a little foreplay to get us going.”</i>", parse);
		Text.NL();
		if(player.LustLevel() < 0.35) {
			Text.Add("Well, you certainly don’t have any complaints about that, but you thought she was already raring to go, herself.", parse);
			Text.NL();
			Text.Add("<i>“Well, I really am. But I’ve been waiting over a thousand years for this, so I think I can wait a few minutes longer.”</i>", parse);
			Text.NL();
			Text.Add("You can only admire her patience. If that’s what she wants to do, you’re happy to oblige.", parse);
		}
		else {
			Text.Add("Foreplay...? Does she <i>really</i> need it? You’re ready to get straight to the good stuff!", parse);
			Text.NL();
			Text.Add("<i>“Patience, mortal. You’re about to lay with a Goddess. That’s not a chance most mortals get. Plus, I’ve been waiting for over a thousand years; surely you can wait a little longer?”</i>", parse);
			Text.NL();
			Text.Add("There is something to be said for savoring the moment. You’ll follow her lead, in that case.", parse);
		}
		Text.NL();
		Text.Add("<i>“Very well; first of all, I need to prepare myself. Normally, I’d have my servants do that for me, but we seem to have a little problem,”</i> she says, motioning to the room around you.", parse);
		Text.NL();
		Text.Add("Namely that there’s nobody here except you and her?", parse);
		Text.NL();
		Text.Add("<i>“Precisely. During all these years I’ve been stuck in that cramped little jar, I’ve never had room to even groom myself, so I’d really like to get a few things taken care of. And since there’s no one here but you and me, I’ll have you act as my servant. Okay?”</i>", parse);
		Text.Flush();
		
		var prompt2 = function() {
			Text.Clear();
			Text.Add("You give the matter a moment’s thought and decide that it sounds agreeable. With a nod of emphasis, you tell Nadir-Ma that she just needs to tell you what to do.", parse);
			Text.NL();
			Text.Add("<i>“Excellent, cutie. ", parse);
			if(werewolf) {
				Text.Add("Normally, I’d be asking you to take off your clothes, but since you’re already naked, how about you put on a little show for me? Do a few sexy poses so I can see exactly what I’m working with?”</i>", parse);
				Text.NL();
				Text.Add("A soft growl of contentment rumbles in your chest. Your long claws curl into half-fists as you pump your arms; first upwards, and then downwards, flaunting the impressive swell of your biceps. You twist your hips and stretch, lewdly thrusting the impressive lupine package swaying between your thighs.", parse);
				Text.NL();
				Text.Add("Your lips curl into a feral smile as you look at Nadir-Ma, confident she must be pleased with your efforts.", parse);
				Text.NL();
				Text.Add("<i>“That’s nice and all, but I did say I want to see <b>everything</b>. That means also showing me your tail.”</i> She grins.", parse);
				Text.NL();
				Text.Add("Huh? ...Oh, well, if that’s what she wants.", parse);
				Text.NL();
				Text.Add("Obligingly, you spin on the spot, bending over to better show off your [butt] as you proudly wag your tail, letting her watch it slowly arc back and forth across your buttocks.", parse);
				Text.NL();
				Text.Add("<i>“That’s more like it,”</i> she says, looking you over appreciatively. <i>“You have a very nice rump, cutie. Should show it off more often.”</i>", parse);
				Text.NL();
				Text.Add("Your tail wags faster at the compliment, and you thank her for appreciating the view.", parse);
				Text.NL();
				Text.Add("<i>“That’s enough of that. Since you’ve been such a good puppy, I think you deserve a reward.”</i>", parse);
			}
			else {
				Text.Add("First of all, let’s get you off those skimpy clothes of yours. My servants wore none, and you certainly don’t need them right now. But don’t just take them off, put on a show for me.”</i>", parse);
				Text.NL();
				parse["br"] = player.mfTrue("", " even as you remove the bikini covering them");
				parse["thongpanties"] = player.mfTrue("thong", "panties");
				Text.Add("That’s a fair enough request. With slow, deliberate motions, you begin removing your cloak and stick out your chest, emphasizing your [breasts][br]. Your arms sweep slowly around your frame in languid, delicate motions, the arc of their spiral drawing the eye to examine every inch of you. You shake your hips slowly from side to side, twisting and turning in a perverse little dance, slowly turning so that Nadir-Ma can admire the curves of your [butt], even as you begin peeling off your [thongpanties].", parse);
				Text.NL();
				var gen = "";
				if(player.FirstCock()) gen += "[cocks]";
				if(player.FirstCock() && player.FirstVag()) gen += " and ";
				if(player.FirstVag()) gen += "[vag]";
				parse["gen"] = Text.Parse(gen, parse);
				Text.Add("Fabric drifts into a little pile at your [feet] before you kick it aside, an exaggerated twirl that flamboyantly exposes your [gen]. Slowly, you look up at the dobermorph, waiting to see her reaction.", parse);
				Text.NL();
				Text.Add("She applauds you. <i>“Very good. That was a nice show, so how about I give you a little reward?”</i>", parse);
			}
			Text.NL();
			Text.Add("Standing up as tall as you can, you smile and thank Nadir-Ma for her generosity.", parse); 
			Text.NL();
			Text.Add("<i>“You’re welcome, cutie! Now... ", parse);
			if(!player.FirstCock()) {
				Text.Add("let’s make a few changes to this nice body of yours.”</i> She grins.", parse);
				Text.NL();
				Text.Add("Changes? Like what? What’s wrong with your body?", parse);
				Text.NL();
				Text.Add("<i>“Well, how do you expect us to have sex when you have so little to offer up front?”</i>", parse);
				Text.NL();
				Text.Add("Puzzled, you fish out your ‘stake’ and present it to her, telling her that if she really needs something hard inside of her, this would work. Besides, there’s plenty of fun ", parse);
				if(player.Gender() == Gender.female)
					Text.Add("two girls", parse);
				else
					Text.Add("a girl like her and a guy like you", parse);
				Text.Add(" can have on their own, no cocks required.", parse);
				Text.NL();
				Text.Add("<i>“Yes, of course. But after being stuck inside a cramped jar for more than a few years, I think I deserve to have the real thing, right cutie?”</i>", parse);
				Text.NL();
				Text.Add("But wouldn’t a dildo like yours suffice?", parse);
				Text.NL();
				Text.Add("<i>“As much fun as it would be, I don’t want to just use a toy. I want to feel a real cock inside me, a real cock than can pump me full of real cum. Besides, imagine how good it’d feel to have my tight, wet pussy wrapped around your meat.”</i>", parse);
				Text.NL();
				Text.Add("From the dreamy look on Nadir-Ma’s face, it seems quite evident that she has her heart set on this. You aren’t going to change her mind; all you can do is decide whether you’re going to agree with her plan to change your body more to her liking.", parse);
				Text.Flush();
				
				var prompt3 = function() {
					HalloweenScenes.HW.nadirma |= Halloween.NadirMa.GaveCock;
					
					// ADD COCK
					var cock = new Cock();
					cock.length.base = 33;
					cock.thickness.base = 6;
					player.body.cock.push(cock);
					
					//Reset parser
					parse = player.ParserTags(parse);
					
					Text.Clear();
					Text.Add("<i>“Excellent! Stay still.”</i>", parse);
					Text.NL();
					Text.Add("Obediently, you hold your position, watching curiously to see how the magical dobermorph will change you to her liking. Nadir-Ma regally gestures with her hands, and you watch with a politely impressed look as some of her bandages uncurl from around her body and stretch out towards you.", parse);
					Text.NL();
					parse["boygirl"] = player.mfTrue("boy", "girl");
					Text.Add("With a sinuous grace that is mildly disconcerting, the bandages twine themselves around you like fabric tentacles. They gently fall on your [hips] and drape themselves across your loins, rapidly twining themselves into a fairly well-designed set of panties. Maybe not the flashiest of lingerie in the world, but a [boygirl] can’t be too choosy in circumstances like these, right?", parse);
					Text.NL();
					Text.Add("The line strands reaching between your crotch and Nadir-Ma’s body snap, just an inch or two from your new garment. The bandages retract back to their place on their owner’s body - you’d question why she doesn’t seem to have diminished her own clothing at all, but that’s hardly the weirdest thing about this situation.", parse);
					Text.NL();
					Text.Add("You wonder what your new underwear has to do with Nadir-Ma’s plans for you; a question that is promptly answered when a wave of warmth pulses through your body, emanating from your panties and sweeping through you. Caught off guard despite yourself, you moan softly; it feels... it feels <b>good</b>.", parse);
					Text.NL();
					Text.Add("Nadir-Ma’s smile burns itself into your subconscious, even as the rest of you is lost in the feeling washing through your bones. It pulses like some alien heart, concentrating its warmth over your crotch. You can feel your [vag] dampening slightly, but more than that... you can feel something <i>growing</i> there.", parse);
					Text.NL();
					Text.Add("You puff and pant, gasping quietly as the bandages grow tighter, and tighter. They squeeze your sensitive, shifting flesh in a deceptive grip, and yet you just keep on growing!", parse);
					Text.NL();
					parse["p"] = player.HasLegs() ? "" : " proverbial";
					Text.Add("The sudden snap of fabric echoes in your ear like a thunderclap. First, one bandage gives way, brushing against your [legs] as it sways in the breeze, and then another follows suit, a third hot on its heels. And the thing between your[p] thighs keeps on growing bigger, until finally your panties burst asunder.", parse);
					Text.NL();
					Text.Add("There, bouncing proudly as it swells to its full glory, is a sizable human cock. It has to be at least thirteen inches long, two inches thick and very sensitive; you shiver at the pleasant tingle that crawls across your [skin] as a gentle breeze wafts over your new appendage.", parse);
					Text.NL();
					Text.Add("<i>“You look <b>much</b> better now, cutie. And much more fun too.”</i> She chuckles.", parse);
					Text.NL();
					Text.Add("You declare that you’re glad that she approves, idly stroking your new appendage and enjoying the tingles that race along your spine at your own touch.", parse);
					Text.NL();
					Text.Add("<i>“Now… why don’t you kneel and present yourself to me?”</i>", parse);
					Text.NL();
					HalloweenScenes.NadirMaCont(parse);
				}
				
				//[Yes] [No]
				var options = new Array();
				options.push({ nameStr : "Yes",
					tooltip : "It might not be so bad to have a cock of your own. Would be more fun to stick into things than a toy, that’s for sure.",
					func : prompt3, enabled : true
				});
				options.push({ nameStr : "No",
					tooltip : "Nobody is changing your body, no matter who they think they are.",
					func : function() {
						Text.Clear();
						HalloweenScenes.NadirMaNoEntry(parse, prompt3);
					}, enabled : true
				});
				Gui.SetButtonsFromList(options, false, null);
			}
			else {
				Text.Add("why don’t you kneel and present yourself to me?”</i>", parse);
				Text.NL();
				HalloweenScenes.NadirMaCont(parse);
			}
		}
		
		//[Yes] [No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : "Well, it’s a reasonable enough request, and it’s not like it should take much effort, right?",
			func : prompt2, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : "You’re nobody’s servant, not even for a piece of tail like her.",
			func : function() {
				Text.Clear();
				HalloweenScenes.NadirMaNoEntry(parse, prompt2);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	
	//[Yes] [No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "She’s attractive, she’s polite and she’s clearly very willing. You can certainly think of worse partners to have.",
		func : prompt1, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "If something’s too good to be true, it certainly is. No chance.",
		func : function() {
			Text.Clear();
			HalloweenScenes.NadirMaNoEntry(parse, prompt1);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.NadirMaCont = function(parse) {
	var p1cock = player.BiggestCock();
	
	Text.Add("Well, if that’s what she wants. You carefully lower yourself to the ground, adjusting your stance until you are settled firmly, your [cocks] outthrust before you.", parse);
	Text.NL();
	parse["boygirl"] = player.mfTrue("boy", "girl");
	Text.Add("<i>“Good [boygirl]!”</i> She says patting you on the head. <i>“This is a great position for you,”</i> she says, sitting on the table before you.", parse);
	Text.NL();
	Text.Add("You watch, understanding swiftly dawning as the near-naked dobermorph imperiously raises one of her paw-like feet. It arcs delicately through the air, settling against the base of your shaft with just enough pressure that you can feel it. With a slow, deliberate motion, she starts to stroke the underside of your cock with the tip of her toe.", parse);
	Text.NL();
	Text.Add("<i>“You should feel honored. It’s not every day that a Goddess rewards a servant by letting their shaft touch her feet.”</i>", parse);
	Text.NL();
	Text.Add("Grunting softly, you absently assure her that you do feel honored. It’s a little hard to focus on her words; she surprisingly good at this! She keeps up a steady, measured pace; not so fast that you can’t savor the feel of her dainty digit gliding across your soft, tender skin, but not so slow that you can’t get excited by it. Her toenails are cut short, but just long enough that the drag of it adds to the pleasure she’s bringing you.", parse);
	Text.NL();
	Text.Add("When she rubs the very tip of your glans with the underside of her toe, you shudder, squirming as your [skin] tingles uncontrollably.", parse);
	Text.NL();
	Text.Add("<i>“Ah ah! No moving!”</i> she reprimands you.", parse);
	Text.NL();
	Text.Add("You moan an apology, feeling her pinch the base between two toes in reprimand. Smirking, she resumes sweeping along your shaft, your cock trapped between her toes. She expertly uses them to squeeze and caress you, milking you with the care of someone who’s done this before.", parse);
	Text.NL();
	Text.Add("It’s little surprise that you start to leak like a faucet, thick ropes of pre-cum seeping over Nadir-Ma’s delicious toes and dribbling down between them.", parse);
	Text.NL();
	Text.Add("Nadir-Ma further spices things up by adding her other foot to the mix, with one focused on pleasuring your [cockTip] and the other one stroking your shaft.", parse);
	Text.NL();
	parse["goo"] = player.IsGoo() ? " No pun intended." : "";
	Text.Add("Your senses sing under the dobermorph’s assault, a duet of pleasure that leaves you putty in her paws.[goo] Pre-cum spouts and gushes, bubbling thickly over the toes dabbling at your [cockTip] and being massaged into your length by her other sweeping foot. You start to groan and grunt, feeling your heart pounding in your chest; you don’t know how much longer you can hold out like this... you’re going to cum, you can just <b>feel</b> it...", parse);
	Text.NL();
	Text.Add("<i>“Alright, I think that’s enough,”</i> she says, removing her feet from your throbbing [cock].", parse);
	Text.NL();
	Text.Add("You can no more stop the disappointed, heartfelt mewl of dismay that escapes your lips than you can stop breathing. ", parse);
	if(player.SubDom() < 25)
		Text.Add("Meekly, you look up at her with the most simpering expression you can manage, wordlessly pleading for her to grant you release.", parse);
	else
		Text.Add("Angrily, your head snaps up to face her, wordlessly demanding an explanation as to what she thinks she’s doing.", parse);
	Text.NL();
	Text.Add("<i>“That’s enough of a reward, don’t you think so, cutie? If you want more, then you’ll have to serve me more,”</i> she states matter-of-factly.", parse);
	Text.NL();
	if(player.SubDom() < 25)
		Text.Add("That sounds fair to you. Nodding your head in a docile fashion, you ask how you may serve her pleasure.", parse);
	else
		Text.Add("Well... you won’t say you’re exactly thrilled, but it is fair. Sighing, you ask what she wants you to do.", parse);
	Text.NL();
	Text.Add("<i>“Well, you made quite the mess.”</i> She lifts her feet, wiggling her toes to show you the cum covering each digit. <i>“How about you start by cleaning this up?”</i>", parse);
	Text.Flush();
	
	var prompt = function() {
		Text.Clear();
		Text.Add("Nadir-Ma grins at you. <i>“Good answer, cutie. Come now and clean your mistress’ feet. It’s not everyday that a mere mortal like you gets to clean a Goddess’ foot!”</i>", parse);
		Text.NL();
		if(player.SubDom() < 35) {
			Text.Add("Smiling softly to yourself, you meekly extend your hands and carefully take one beautiful, pre-cum smeared paw between them. Holding it as if it were a precious flower, you tenderly draw it closer before lowering your face to it.", parse);
			Text.NL();
			Text.Add("Your [tongue] slides out over your lips, curling delicately down before sweeping across the top of Nadir-Ma’s paw. With such a slow, deep lick, you have ample time to register every nuance of her flavor; the salty sweetness of the pre-cum, mingling with a strange, musky flavor that just has to be her. All undercut by the faintest oily aftertaste; her fur, maybe?", parse);
			Text.NL();
			Text.Add("Whatever, it’s more than enough for you to happily keep licking, steadily lapping away at the beautiful dobermorph’s paw.", parse);
		}
		else {
			Text.Add("You puff out your cheeks and sigh at her attitude. But if this is going to be done, you may as well get it over with now. Though not rude enough to be a brute about it, the indelicacy with which you snatch up the dobermorph’s paw makes it clear that you are less than thrilled to be doing this.", parse);
			Text.NL();
			Text.Add("Hesitantly, you flick out your tongue and brush it quickly over Nadir-Ma’s foot. Even with that quick taste, you shudder as the flavor hits you. You can hardly believe you’re doing this, and for a moment, you consider refusing... then the aching throb of your [cocks] convince[notS] you otherwise.", parse);
			Text.NL();
			Text.Add("Grimacing distastefully, you start to lap away at the dobermorph’s paw, trying to get it clean as quickly as possible so you can avoid tasting more than you have to.", parse);
		}
		Text.NL();
		Text.Add("<i>“That’s pretty good, servant, but don’t forget my other foot.”</i>", parse);
		Text.NL();
		Text.Add("You nod absently, putting down the fairly clean paw you were just bent over and reaching for the second.", parse);
		Text.NL();
		Text.Add("She grins. <i>“Since you’re down there, and doing such a good job, how about a massage too? Actually, how about you just worship my feet? It’s been such a long time since I had a servant worship me like the Goddess I am...”</i>", parse);
		Text.NL();
		if(player.SubDom() < 35)
			Text.Add("Oh, but of course! Smiling happily, you eagerly turn to your task.", parse);
		else
			Text.Add("Do you really have to? Glancing upwards, you sigh to yourself. Of course you do. Well, let’s just get this over with.", parse);
		Text.NL();
		Text.Add("Lifting Nadir-Ma’s paw to your mouth, you gently kiss each dainty toe in turn, suckling softly as you deepen the liplock. An approving giggle bubbles down to you from above, the dobermorph playfully wriggling her toes in your mouth. With your hands, you gently stroke the rest of her foot, tenderly massaging her ankles as you start to lick her pads.", parse);
		Text.NL();
		Text.Add("<i>“Hmm, this is some excellent service you’re giving me here, cutie. If you keep this up, I might have to wind up rewarding you.”</i>", parse);
		Text.NL();
		if(player.SubDom() < 35)
			Text.Add("Oh, you wouldn’t presume to ask for something like a reward, not for something like this. But if she insists...", parse);
		else
			Text.Add("Well, that makes this a little more bearable. You wonder what she has in mind...", parse);
		Text.Add(" Spurred on by her words, you resume your efforts with renewed zeal, licking and kissing, stroking and sucking, worshipping her foot with the ardent fervor of a true believer.", parse);
		Text.NL();
		Text.Add("Nadir-Ma giggles. <i>“That’s good, but it’s enough for this foot. Do my other one and I’ll reward you handsomely.”</i> She grins.", parse);
		Text.NL();
		Text.Add("With those words ringing in your [ears], you don’t hesitate for a second to transfer your attentions back to where they came from. You only stop suckling and massaging when Nadir-Ma herself interrupts your worship by gently drawing her paw from your grasp. You look up at her expectantly, waiting hungrily for what she’ll say and do next.", parse);
		Text.NL();
		Text.Add("<i>“Very good, cutie. You’ve earned your reward. Why don’t you lie down on the table and make[oneof] your [cocks] available for me? I promise you’ll love this.”</i>", parse);
		Text.NL();
		Text.Add("Eagerly, you haul yourself off of the floor. Nadir-Ma daintily slips off of the table, giving you ample space in which to take her place. You lie down on your back, shifting your [legs] so that your dribbling [cocks] [isAre] thrust towards the ceiling, blatantly exposed for the dobermorph’s appraisal.", parse);
		Text.NL();
		Text.Add("Giggling, Nadir-Ma leans over and lets your [cock] drag along her bosom.", parse);
		Text.NL();
		Text.Add("You groan deeply in approval; you like where this is going.", parse);
		Text.NL();
		Text.Add("She moves her breasts to sandwich your shaft in their rich fullness, moving them up and down as she strokes you with her boobs.", parse);
		Text.NL();
		Text.Add("You arch your back, lifting yourself off of the table; that feels <i>sooo</i> good! Oh, yes, you’re glad you were a good [boygirl] now.", parse);
		Text.NL();
		Text.Add("Next, she moves far down enough to expose your [cockTip], which she promptly takes into her mouth and begins tonguing expertly.", parse);
		Text.NL();
		Text.Add("A strangled, wheezing squeal fights its way out of your clenched throat. Oh, god!", parse);
		Text.NL();
		Text.Add("<i>“It’s been so long since I’ve had such a nice cock to play with. I’m just giddy with anticipation!”</i> she says, giving your [cockTip] another lick.", parse);
		Text.NL();
		Text.Add("You are in heaven; that’s the only way you can possibly hope to describe your situation. Nadir-Ma’s wonderfully soft breasts swallow your cock, the luxuriant fur on them adding a delightfully ticklish edge as they brush up and down. Her tongue darts back and forth with devilish enthusiasm, striking spots you don’t even remember <i>having</i>.", parse);
		Text.NL();
		Text.Add("With such a wonderful partner doing all this to you, you’d find yourself on the brink within a few minutes. With your previous arousal, it takes barely half that time before your whole body is twitching, on the verge of what you know would be one of the biggest orgasms you’ve ever had in your life...", parse);
		Text.NL();
		Text.Add("<i>“Getting ready to cum? Well, I’m not done playing yet.”</i>", parse);
		Text.NL();
		parse["k"] = p1cock.Knot() ? ", just behind your swelling knot" : "";
		Text.Add("A dismal moan bubbles from your throat as, before your disbelieving eyes, a bandage snakes out from Nadir-Ma’s enchanted apparel. With perverse grace, it slithers through the air and brushes against the base of your cock[k]. In an instant, it twines itself around your sensitive flesh, tying itself so tightly that you haven’t a hope of getting off.", parse);
		Text.NL();
		Text.Add("You turn a pleading eye towards Nadir-Ma, but the doberman is oblivious to your desperation. Instead, she goes right back to what she was doing, only slower and more teasing.", parse);
		Text.NL();
		Text.Add("You are helpless beneath her feminine wiles. Your cock throbs so hard that it feels like it’s going to burst, the tightness inside as your seed boils to a froth. You writhe and you squirm, pleading with Nadir-Ma to end it already, and to let you cum.", parse);
		Text.NL();
		Text.Add("<i>“Okay, I’m ready for my snack! Cum for me!”</i> She says, sucking on your tip and flicking her fingers on the bandages holding your cumvein shut, disintegrating them almost instantly.", parse);
		Text.NL();
		Text.Add("You need no further invitation; no sooner has the bandage crumbled into nothingness than the first cascade of cum erupts from your depths, roaring through your abused cock and exploding into Nadir-Ma’s mouth. The sweeping surge of sensation scatters your thoughts like flotsam before a tidal wave, leaving you barely cognizant enough to wonder how the dobermorph is so easily guzzling your generous serving of baby batter. All your thoughts are focused on riding out this monstrous climax without your mind breaking into pieces in the process.", parse);
		Text.NL();
		Text.Add("Finally, inevitably, you run dry, and you fall back against the table with a hollow groan of release. Panting desperately for breath, you are barely aware of your surroundings, too occupied with hauling life-giving air back into your lungs.", parse);
		Text.NL();
		Text.Add("Nadir-Ma removes herself from your spent [cock], wiping her mouth and licking her hand clean. <i>“Hmm, tasty.”</i>", parse);
		Text.NL();
		Text.Add("You manage a dull groan of happiness at her appraisal.", parse);
		Text.NL();
		if(player.HasBalls()) {
			Text.Add("<i>“That was a nice load, cutie, but you could stand to be more productive. Can’t keep a Goddess hungry, can you?”</i>", parse);
			Text.NL();
			Text.Add("...Probably not. Bemused, you lift your head and manage to weakly ask her what she intends to do about it.", parse);
			Text.NL();
			Text.Add("Smiling mischievously, Nadir-Ma cradles your [balls] in her palms and uses one of her enchanted bandages to wrap them into a cozy warmer.", parse);
			Text.NL();
			Text.Add("You hiss sharply as a strange tingling sensation washes over your [balls]. Your [cocks] immediately rise[notS] to the occasion once again as the weird yet pleasant feeling courses through you, sweeping away the fatigue of your recent climax and letting you feel more alert and alive than before.", parse);
			Text.NL();
			Text.Add("<i>“That should do it,”</i> she says, pulling the bandages off your [balls].", parse);
			Text.NL();
			HalloweenScenes.NadirMaCont2(parse);
		}
		else {
			Text.Add("<i>“Not bad, but there was way too little for my taste. You need to be more productive, cutie. And I have a feeling your lack of proper balls is to blame,”</i> she says, pointing to the base of your [cocks].", parse);
			Text.NL();
			Text.Add("...Maybe? You guess she has a point.", parse);
			Text.NL();
			if(HalloweenScenes.HW.nadirma & Halloween.NadirMa.GaveCock) {
				Text.Add("...Oh. She plans on changing that for you, doesn’t she?", parse);
				Text.NL();
				Text.Add("<i>“Good guess, cutie.”</i> She giggles.", parse);
			}
			else {
				Text.Add("So, what is she implying? It sounds like she has something in mind.", parse);
				Text.NL();
				Text.Add("<i>“If you don’t have balls, all we gotta do is give you a pair.”</i>", parse);
				Text.NL();
				Text.Add("Can she <b>do</b> that?! Looking at her, though, she seems quite confident about it, and you have a sneaking suspicion that she really can.", parse);
			}
			Text.NL();
			Text.Add("<i>“So, how about it, cutie? Ready to grow a pair?”</i>", parse);
			Text.Flush();
			
			var prompt2 = function() {
				HalloweenScenes.HW.nadirma |= Halloween.NadirMa.GaveBalls;
				
				//ADD BALLS
				player.Balls().count.base = 2;
				player.Balls().size.base = 6;
				
				Text.Clear();
				Text.Add("<i>“Excellent! Let’s begin right away!”</i>", parse);
				Text.NL();
				if(HalloweenScenes.HW.nadirma & Halloween.NadirMa.GaveCock) {
					Text.Add("With a recognizable gesture, the dobermorph sends her bandages undulating out again. You watch as they wrap themselves around your loins for the second time tonight, forming themselves into a familiar set of panties - save for the hole expertly woven to spare your cock, of course.", parse);
					Text.NL();
					parse["proverbial"] = player.HasLegs() ? "" : " proverbial";
					Text.Add("You moan in lazy bliss as a familiar warmth seeps through your body, pleasantly tingling you from head to[proverbial] toe. Your cock stiffens, rising up as the warmth pulses from your enchanted undies, pussy dampening as you feel yourself starting to grow inside of them again.", parse);
					Text.NL();
					Text.Add("Lost in pleasure as you are, you can’t help but laugh and chant for your new flesh to grow, grow, grow! Each strand of linen that ruptures at the strain of trying to contain your swelling flesh becomes a trophy, and when your panties finally burst into tatters, you feel a huge sense of pride that mingles with your release as your new flesh flops into view.", parse);
				}
				else {
					Text.Add("You watch entranced as Nadir-Ma gives a regal gesture, some of her bandages lazily flowing away from her body like linen serpents. They delicately loop and curl around your loins, intricately wrapping themselves around your naked nethers until they have taken a recognizably lingerie-like form.", parse);
					Text.NL();
					Text.Add("The dobermorph smiles proudly, the bandages connecting to your new panties snapping off and curling back to her. Weirdly, her own covering hasn’t diminished at all, but then, that’s hardly the strangest thing about this situation.", parse);
					Text.NL();
					Text.Add("You wonder what your new underwear has to do with Nadir-Ma’s plans for you - a question that is promptly answered when a wave of warmth pulses through your body, emanating from your panties and sweeping through you. Caught off guard despite yourself, you moan softly; it feels... it feels <b>good</b>.", parse);
					Text.NL();
					Text.Add("Nadir-Ma’s smile burns itself into your subconscious, even as the rest of you is lost in the feeling washing through your bones. It pulses like some alien heart, concentrating its warmth over your crotch. You can feel your [vag] dampening and your cock swelling erect once again, but more than that... you can feel something <i>growing</i> there.", parse);
					Text.NL();
					Text.Add("You puff and pant, gasping quietly as the bandages grow tighter, and tighter. They squeeze your sensitive, shifting flesh in a deceptive grip, and yet you just keep on growing!", parse);
					Text.NL();
					parse["proverbial"] = player.HasLegs() ? "" : " proverbial";
					Text.Add("The sudden snap of fabric echoes in your ear like a thunderclap. First, one bandage gives way, brushing against your [legs] as it sways in the breeze, and then another follows suit, a third hot on its heels. And the thing between your[proverbial] thighs keeps on growing bigger, until finally your panties burst asunder.", parse);
				}
				Text.NL();
				Text.Add("A great pair of plum-sized balls now sways below your [cocks], skin stretched taut over nuts filled with a fresh load of cum, just waiting to be shot into Nadir-Ma’s hungry holes.", parse);
				Text.NL();
				HalloweenScenes.NadirMaCont2(parse);
			}
			
			//[Yes] [No]
			var options = new Array();
			options.push({ nameStr : "Yes",
				tooltip : "Well, you really do look kind of odd with a cock and no balls to go with it. Let’s get fixed up.",
				func : prompt2, enabled : true
			});
			options.push({ nameStr : "No",
				tooltip : "No way; the cock is one thing, but you don’t need a pair of ugly balls hanging over your cunt too!",
				func : function() {
					Text.Clear();
					HalloweenScenes.NadirMaNoEntry(parse, prompt2);
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}
	}
	
	//[Yes] [No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "It’s not really that big a deal, certainly not in the face of finally getting to cum!",
		func : prompt, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "Gross! You’re not licking cum off of anything, especially not off of someone’s foot!",
		func : function() {
			Text.Clear();
			HalloweenScenes.NadirMaNoEntry(parse, prompt);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.NadirMaCont2 = function(parse) {
	var werewolf = HalloweenScenes.HW.Werewolf();
	
	Text.Add("<i>“I’ll go get a little something while you produce more tasty cum for me,”</i> Nadir-Ma says, walking around the table and moving out of your field of vision.", parse);
	Text.NL();
	parse["b"] = (HalloweenScenes.HW.nadirma & Halloween.NadirMa.GaveBalls) ? "" : "ly tweaked";
	Text.Add("You nod absently, too caught up with rubbing your new[b] balls to really pay much attention. They feel so heavy, and so sensitive! You bite your lip as even brushing them sends tingles racing along your spine.", parse);
	Text.NL();
	Text.Add("And you don’t think they’re done growing yet; you swear that you can feel them filling up with cum, your sack stretching tighter as it bloats with seed. Oh, how you want to be plugged into a warm, wet, willing hole and emptying yourself...", parse);
	Text.NL();
	Text.Add("<i>“Alright, cutie. Since you’re eager for more,”</i> she motions at your erect [cocks], <i>“how about we play a little game?”</i>", parse);
	Text.NL();
	Text.Add("Looking back up at the returned dobermorph, you ask her what sort of game she has in mind.", parse);
	Text.NL();
	Text.Add("<i>“I’ll put this inside your ass.”</i> She shows you the dildo. <i>“And play with it like this.”</i> She snaps her fingers, making the dildo spin around in her hand. <i>“While you pleasure me.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Get me to cum first, and you win, but if you cum before me, you lose!”</i> She grins. <i>“So, what will it be, cutie?”</i>", parse);
	Text.Flush();
	
	var prompt = function() {
		var p1cock = player.BiggestCock();
		Text.Clear();
		Text.Add("<i>“Great, let’s get started then!”</i> she says merrily, approaching you and gently grasping[oneof] your [cocks].", parse);
		Text.NL();
		parse["chosen"] = player.NumCocks() > 1 ? " chosen" : "";
		Text.Add("You gasp softly, moaning as Nadir-Ma’s mouth closes teasingly around just the [cockTip] of your[chosen] dick. Her plump lips squish deliciously as they clamp around the base of your glans, her tongue tickling the sensitive dickflesh inside her warm, wet maw.", parse);
		Text.NL();
		Text.Add("When the dobermorph’s slender fingers wrap themselves tenderly around your [balls], you groan deeply, shuddering slightly as she caresses you. With expert touches, she coaxes you into a warm, comforting veil of bliss...", parse);
		Text.NL();
		Text.Add("When she suddenly squeezes your balls, it comes as a complete shock. You can’t help instinctively spurting cum into her mouth; just a trifle, compared to what you gave her before, but more than enough that you can feel the liquid seed gushing up your shaft.", parse);
		Text.NL();
		Text.Add("Without saying a word, Nadir-Ma pulls away and grabs the dildo. She then begins covering the dildo with your cum, slickening it until it’s covered by a nice layer of seed. <i>“Hmmhmm, now it’s ready. Get on fours and show me your cute backdoor, cutie!”</i>", parse);
		Text.NL();
		parse["t"] = player.HasTail() ? Text.Parse(", [tail] curled up out of the way for her", parse) : "";
		Text.Add("You roll over as best you can, sliding around atop the table until you have assumed the position as instructed. You look back at her over your shoulder[t], expectantly waiting for her to get started.", parse);
		Text.NL();
		Text.Add("Nadir-Ma leans over and gives one of your butt cheeks a kiss.", parse);
		Text.NL();
		if(player.SubDom() < 45)
			Text.Add("You give her a soft, embarrassed laugh, unable to keep a blush from warming your other set of cheeks.", parse);
		else
			Text.Add("You smirk proudly at her obvious appreciation of your ass.", parse);
		Text.NL();
		Text.Add("Then she licks your taint, probing your [anus] with her tongue, and drilling her way inside.", parse);
		Text.NL();
		if(player.Slut() < 40) {
			Text.Add("You squeal in dismay; this is a little more than you bargained for! You try to clamp down, clenching your ass as tightly as possible, but the dobermorph’s skilled tongue effortlessly worms its way inside.", parse);
			Text.NL();
			Text.Add("You moan helplessly, cheeks burning as your traitorous [cocks] stand[notS] at attention; this is so gross! But... it’s also arousing...", parse);
		}
		else {
			Text.Add("You moan, deep and low, lustily sighing as the dobermorph’s squirming tongue wriggles its sloppy way deeper and deeper into your asshole. Mmm, yes, she really knows how to eat anus all right! You discretely grind back against her, pushing your [butt] into her face so that Nadir-Ma can get as deep into your back passage as possible.", parse);
		}
		Text.NL();
		Text.Add("After she’s done, she places the tip of dildo, still slick with your cum, and begins pushing it inside.", parse);
		Text.NL();
		Text.Add("You grunt and groan, eyes rolling back into your head as she slowly coaxes the toy inside of you. It pierces you in the most intimate way, spreading you mercilessly as she drives it inside. She doesn’t stop until the very last few inches of it have disappeared up your ass, leaving you intimately aware of the solid mass of fake-cock buried inside of you.", parse);
		Text.NL();
		Text.Add("<i>“There we go. That’s a perfect fit!”</i> She says proudly, patting your ass. <i>“Now, hop off the table and give me room.”</i>", parse);
		Text.NL();
		Text.Add("Slowly, you haul yourself off of the table; each motion jostles the dildo up your ass, making moving an awkward process. You can feel it blocking your muscles as you move, sending tingles up your spine, causing you to take things slowly and carefully.", parse);
		Text.NL();
		Text.Add("Once on the floor, you stand upright, shifting slightly as you try to adjust to the mass wedged inside of you whilst waiting for Nadir-Ma’s next command.", parse);
		Text.NL();
		Text.Add("The dobermorph lies down on the table and spreads her legs, sparing a pair of fingers to hold her pussy lips open for your viewing pleasure. <i>“You’ll eat me out, and remember that if you cum before I do, you lose. Now, let the games begin!”</i> she says happily as she snaps her fingers, working her magic on the toy embedded in your anus.", parse);
		Text.NL();
		Text.Add("You manage to bite back the yelp as the dildo starts to buzz, a deliciously, ticklish tingling that you cannot ignore, but you can push to the back of your mind. Settling between Nadir-Ma’s thighs, you bend in and extend your [tongue], starting to glide it across her pearl-pink netherlips.", parse);
		Text.NL();
		Text.Add("Rivulets of thick feminine honey greet your probing tongue, already drooling in lazy yet copious streams from between her parted labia. You don’t know why she’s so wet already, but that just makes your job easier. You hope. With great care, you slowly slide your tongue between each fold, feeling the ridges and creases of her pussy before sloppily lapping at the thick river pouring from her center.", parse);
		Text.NL();
		Text.Add("Nadir-Ma giggles. <i>“That’s good, honey. But you can be a bit more… enthusiastic if you want. Or maybe you want some incentive? I think I’ll give you some anyway,”</i> she says, snapping her fingers again.", parse);
		Text.NL();
		Text.Add("This time, you yelp as the toy inside your ass moves in a very unexpected way - it literally spins around in your hole, as if it was gyrating inside you. It brushes firmly against your prostate, the vibrations rippling through the sensitive organ and making your own [cocks] jolt. Pre-cum starts to bubble from your aching tip[s], and you grit your teeth as you try to force the pleasure at bay.", parse);
		Text.NL();
		Text.Add("Desperate to hold out, you dive into the dobermorph’s muff with renewed vigor. The sound of your own lewd slurping and squelching fills your ears as you gobble and lap at Nadir-Ma’s cunt. Her wet, drooling petals smear their nectar across your chin and cheeks, but you ignore it, instead worming your tongue deeply into her oozing tunnel.", parse);
		Text.NL();
		Text.Add("<i>“That’s it, cutie! Some more incentive for you!”</i> She turns the dial up one more stage. <i>“Almost there!”</i> she cries, panting.", parse);
		Text.NL();
		Text.Add("The only thing that keeps you from screaming as her blasted toy kicks it up higher is the fact you currently have a mouthful of mutt-muff. Feeling you are about to explode as the spinning, vibrating toy mashes itself against your prostate, almost audibly buzzing against your anal walls, you desperately gorge yourself on Nadir-Ma’s cunt. You lick and kiss, suckle and smack, slurp and gulp and lap as if your life depends on it...", parse);
		Text.NL();
		Text.Add("<i>“I’m cumming!”</i> Nadir-Ma cries, thighs closing around your head to hold you in place as her pussy spasm and squirts the dobermorph’s femcum right on your face.", parse);
		Text.NL();
		Text.Add("Trapped where you are, you have no recourse but to try and drink the juice sluicing down your throat, its sweet taste flooding your brain, but incapable of drowning out the sensations of her toy buzzing around in your butt.", parse);
		Text.NL();
		Text.Add("<i>“Ah… good job, cutie,”</i> she says, turning off the dildo.", parse);
		Text.NL();
		Text.Add("You slump to the floor, panting for breath, feeling more frustrated than relieved; you’re so close that it’s almost painful, even the slow ebbing of lust as it bleeds away a near-torturous experience.", parse);
		Text.NL();
		parse["k"] = p1cock.Knot() ? ", knot included" : "";
		Text.Add("<i>“Now, about your reward...”</i> Nadir-Ma suddenly hoists you up as if you weighed nothing and lays you down on the table. In one smooth move, she climbs on the table and aligns[oneof] your [cocks] with her juice-dripping pussy. <i>“You’ll get to fuck a Goddess.”</i> And with that, she lets gravity take its course, impaling herself on your shaft all the way to hilt[k].", parse);
		Text.NL();
		Text.Add("You cry out in pleasure, a strangled gasp of pure lust at being so directly enveloped within her. The heat of her drooling cunt swallows your senses, and for a moment, it’s as if there’s nothing but her cooch greedily devouring your cock, slurping back and forth along your length as she bounces atop you.", parse);
		Text.NL();
		Text.Add("<i>“Fuck me, cutie! Fuck me good, and fill me with all that you have here in these treasures of yours!”</i> she cries, grabbing and gently massaging your balls.", parse);
		Text.NL();
		Text.Add("You scream in ecstatic frustration; <b>sooo</b> close! You just can’t -", parse);
		Text.NL();
		Text.Add("<i>“Here’s a little help for you!”</i> she cries between moans, her magic finally unleashing the dildo to its full frenzy.", parse);
		Text.NL();
		Text.Add("That’s the last straw; howling like ", parse);
		if(werewolf)
			Text.Add("the animal you are,", parse);
		else
			Text.Add("an animal,", parse);
		Text.Add(" you explode inside of Nadir-Ma’s sopping cunt, your tidal wave of seed mixing with her own geyser of femjism; a swirling, seething deluge of juices that somehow vanishes without a trace into her greedy pussy.", parse);
		Text.NL();
		Text.Add("You thrust away with all you have, mindlessly pouring every last drop of semen you have to give into the dobermorph’s twat. She swallows it all, and still wants more, relentlessly milking you until even your reserves of climax run dry. As you collapse atop the table, too limp to move, you can still feel her pussy suckling around your dick. But you’re so tired... you can’t get more than half-hard, even when faced with a juicy cunt like hers.", parse);
		Text.NL();
		parse["k"] = p1cock.Knot() ? " tugging on your knot and eventually" : "";
		Text.Add("<i>“Hmm, yes. I really needed that. It’s been <b>so</b> long since I got fucked this well… Ah, cutie, you’re the best...”</i> she trails off, turning off the dildo and[k] pulling herself off your [cock]. A thick stream of semen leaks from her pussy, and she happily dips a finger in and takes it to her mouth to taste it. <i>“Tastes like a piece of heaven...”</i>", parse);
		Text.NL();
		Text.Add("You groan softly. Somehow, you find the energy to thank her for the compliment, and tell her that you’re happy to please.", parse);
		Text.NL();
		Text.Add("<i>“No, cutie. Thank you,”</i> she says, crawling over to you and pulling you into a hot, passionate kiss.", parse);
		Text.NL();
		Text.Add("You happily melt into the liplock, cautiously wrapping your arms around the happy self-proclaimed Goddess as she thrusts her tongue into your mouth. It was quite a trip getting here, but for now, you’re content to just lie here in her bountiful, pleasantly fluffy embrace.", parse);
		Text.NL();
		Text.Add("You don’t know how long it takes until Nadir-Ma breaks the kiss, but you gently part your arms and let her sit up, happy to watch her bountiful breasts jiggling as she rears above you.", parse);
		Text.NL();
		Text.Add("<i>“You did a really good job packing me full of semen. I don’t think there’s any room left in my womb.”</i> She giggles. <i>“If I was any ordinary girl, I’d be pregnant for sure. However, that’s not the case with Goddesses.”</i> She grins, winking at you.", parse);
		Text.NL();
		Text.Add("Grinning tiredly, you assure her that you’re happy to have helped her.", parse);
		Text.NL();
		Text.Add("<i>“In any case, you did such a good job that I think you deserve a little more in terms of reward.”</i>", parse);
		Text.NL();
		Text.Add("Perking up, you look at her quizzically, wondering what she has in mind for you.", parse);
		Text.NL();
		Text.Add("<i>“But first, maybe we should get that dildo out of your ass, unless you’d like to keep it there?”</i> she suggests with a mischievous grin.", parse);
		Text.NL();
		if(player.Slut() < 15)
			Text.Add("No. Not a chance. You want this thing out of you, and you want it out <b>now</b>!", parse);
		else if(player.Slut() < 35)
			Text.Add("Well, it is kind of fun to have it up there... but you do have places to go, so it’s probably better if she takes it out.", parse);
		else
			Text.Add("You’re so very tempted to tell her to just leave it there; you’d <b>love</b> to have this little beauty stuffed up your ass as you go exploring. But... it’s her toy; you’d have to be a real jerk to take it from her, especially when she has so much fun to catch up on. So, you tell her to pull it out.", parse);
		Text.NL();
		Text.Add("Nadir-Ma grabs the butt-end of the dildo and begins pulling it out, dragging it slowly so you can feel every little inch that slips out; when it’s finally gone, you feel kinda empty…", parse);
		Text.NL();
		Text.Add("<i>“Alrighty then, come here,”</i> she says, taking a seat on the table beside you and tapping her lap. <i>“Have a drink, and receive my blessing.”</i> She grins, squeezing one of her pillowy breasts until a drop of brownish liquid seeps out of her nipple.", parse);
		Text.NL();
		Text.Add("That... is a rather unsettling color for milk. Then again, she looked a little like that when she first came out of her jar, didn’t she? Hesitantly, you push yourself up off of the table and slide into her lap, feeling the stickiness under your butt from her recent climax.", parse);
		Text.NL();
		Text.Add("The dobermorph patiently watches you, still grinning as she holds her breast out to you expectantly. You swallow nervously, and then raise your mouth to her dripping nipple and wrap your lips around it, letting the fluid slowly trickle over your tongue.", parse);
		Text.NL();
		Text.Add("...Wow. This actually tastes pretty good! It’s warm and rich, but with a sweetness you’re hard-pressed to place. Velvety on your tongue, it makes you feel good just to have it steeping in your mouth.", parse);
		Text.NL();
		Text.Add("You happily swallow the first mouthful, feeling it softly blaze a trail down into your stomach, and then start to suckle in earnest. One hand reaches up to caress Nadir-Ma’s luscious breast, gently kneading the soft flesh to coax her strange, chocolatey milk forth, even as you busily gulp and slurp what fluid flows into your mouth.", parse);
		Text.NL();
		Text.Add("<i>“That’s it, cutie. Drink deep and you’ll become even cuter!”</i> She grins, holding you against her bosom as her other hand travels lower to caress[oneof] your [cocks].", parse);
		Text.NL();
		Text.Add("More than willing to comply, you drink deeply of the dobermorph’s bounty, feeling the intoxicating warmth blossoming in your belly and spreading through your body. You feel so safe and content here, just lying in her arms, happy to drink until your Goddess deigns to stop you.", parse);
		Text.NL();
		if(werewolf) {
			if(player.FirstBreastRow().Size() < 12.5) {
				Text.Add("Your [breasts] tingle deliciously, a strange tightness filling your [skin] as they stiffen. Absently, you realize that your boobs are growing bigger, swelling from their former size into lush, pillowy E-cups that jiggle wonderfully with each mouthful you swallow.", parse);
				Text.NL();
				Text.Add("<i>“Hmm, you look much better like this, cutie. Plus you’ll come to love the feeling you get when someone grabs you like this,”</i> she says, quickly moving a hand up to squeeze one of your tits.", parse);
				Text.NL();
				Text.Add("A muffled mewl of pleasure escapes you as you wriggle in Nadir-Ma’s grip. Mmm, that does feel good...", parse);
				Text.NL();
			}
			if(player.Balls().BallSize() < 5) {
				parse["h"] = player.HasHair() ? Text.Parse(" and making your [hair] stand on end", parse) : "";
				Text.Add("Your [balls] prickle beneath your swaying [cocks], sending shivers up your spine[h]. You squirm in Nadir-Ma’s lap, the wetness under your ass not helping as you feel your nuts bulging.", parse);
				Text.NL();
				Text.Add("You don’t have words to describe the sensation as cum boils and froths inside the taut skin of your sack, making your balls bloat until they feel as round and full as ripe apples. Liquid weight churns inside your overstuffed scrotum, settling down but still leaving you intimately aware of the new girth down there.", parse);
				Text.NL();
				Text.Add("<i>“With a pair this full, I bet you could knock up an entire village.”</i> She chuckles, massaging your newly-grown orbs.", parse);
				Text.NL();
				Text.Add("You can’t say for sure if it is the mental image or the blissful feeling of her fingers ghosting over your tight, sensitive flesh that makes you mewl in pleasure around her nipple.", parse);
				Text.NL();
			}
		}
		else {
			if(player.FirstBreastRow().Size() < 10) {
				Text.Add("The [skin] of your [breasts] tingles as a strange tightness washes over them, making you wriggle and squirm in Nadir-Ma’s lap. Absently, you realize that your breasts are <i>growing</i>, getting bigger and bigger with each mouthful of sweet chocolate milk that you swallow. Only when a pair of bountiful DD-cups bounce on your chest does the tightness end, suggesting that this is as big as they will grow.", parse);
				Text.NL();
				Text.Add("<i>“These love-pillows of yours fit you nicely, cutie.”</i> Nadir-Ma chuckles, lifting a hand to massage your [breasts].", parse);
				Text.NL();
				Text.Add("You smile proudly around the dobermorph’s nipple, thirst not yet quenched even as you squirm appreciatively at her groping fingers.", parse);
				Text.NL();
			}
			if(player.Balls().BallSize() < 4) {
				parse["proverbial"] = player.HasLegs() ? "" : " proverbial";
				Text.Add("A prickling sensation in your [balls] makes your [skin] crawl, spurring you to suck harder and deeper at the dobermorph’s delicious breasts. You can literally feel your balls bloating between your[proverbial] thighs, skin stretching taut as they grow bigger and bigger. Only when they have swollen to the size of ripe plums does the feeling of cum frothing to a boil beneath the surface fade away.", parse);
				Text.NL();
				Text.Add("<i>“Can’t have my best servant frolic about without a decent package now, can I?”</i> she asks, gently patting your nuts.", parse);
				Text.NL();
				Text.Add("You wriggle happily in her lap at the attention; you do feel better now with her generous gift.", parse);
				Text.NL();
			}
		}
		var p1cock = player.BiggestCock();
		if(player.NumCocks() > 1) {
			Text.Add("Your [cocks] stand erect in your lap, twitching as you feel them starting to tingle. You wriggle and squirm as if ants are crawling all over you, but somehow, you just can’t bring yourself to let go of Nadir-Ma’s teat and the liquid goodness it is sharing with you.", parse);
			Text.NL();
			Text.Add("Shifting in her lap, you manage to look down at your cocks, which you realize are starting to rub together. They slide back and forth against each other with unnatural flexibility, squeezing together tighter and tighter, so that it’s hard to tell where one cock ends and another begins.", parse);
			Text.NL();
			Text.Add("...In fact, you realize that you really can’t tell anymore. It’s like... like your dicks are fusing together!", parse);
			Text.NL();
			Text.Add("<i>“Don’t worry, cutie. <b>One</b> is the magic number of dicks you’ll need when I’m done with you.”</i> She grins.", parse);
			Text.NL();
			
			//#Pick PC’s biggest cock and make it cock number 1, all other cocks disappear.
			
			player.body.cock = [p1cock];
			
			parse = player.ParserTags(parse);
			parse = Text.ParserPlural(parse, player.NumCocks() > 1);
			parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
			
			Text.Add("Looking at your loins, you can’t help but agree with the canine Goddess. Really, what do you need more than one cock for? Better to take one hole at a time and do it well than to waste half your seed or more just spewing it over the ground! Eagerly, you watch as your over-abundant nethers reshape themselves into something more elegant.", parse);
			Text.NL();
			if(p1cock.Len() < 38 || p1cock.Thickness() < 7) {
				Text.Add("Moments later, your [cock] stands alone at your crotch once the other[s2] [hasHave2] disappeared - though not without leaving a parting gift. Your cock swells and grows, getting bigger and fatter, until a proud fifteen inches long shaft pulsates in your lap, its two and a half inch girth aching to stretch some lucky soul around its broad width and make them scream in pleasure.", parse);
			}
			else {
				parse["wo"] = player.mfTrue("", "wo");
				Text.Add("When it is all over, your [cock] stands alone and triumphant in your lap, having vanquished its unworthy rival[s]. Now you <i>truly</i> feel like a [wo]man!", parse);
			}
			Text.NL();
		}
		else if(p1cock.Len() < 38 || p1cock.Thickness() < 7) {
			Text.Add("Your cock tingles and twitches, your [skin] prickling wonderfully as you rise to your full glory. It throbs ardently in your lap, a strange tightness that makes you squirm. It feels as if your dick’s skin is too small for it...", parse);
			Text.NL();
			Text.Add("Nadir-Ma grabs your shaft and begins stroking it slowly. <i>“C’mon, cutie, grow up for me.”</i>", parse);
			Text.NL();
			Text.Add("Moaning around the dobermorph’s nipple, you thrust fervently into her palm, eager to comply. Oh, yes, you want to grow for her!", parse);
			Text.NL();
			parse["l"] = player.HasLegs() ? " between your thighs" : "";
			Text.Add("Dimly, you can feel yourself stretching and swelling, your cock getting bigger and fatter as the canine Goddess carefully guides its growth. When the tightness fades, a mighty [cock] juts[l], fifteen inches long and two and a half inches thick.", parse);
			Text.NL();
			Text.Add("From the smile on her face, Nadir-Ma is quite satisfied with your new tool. She strokes it one last time and then lets it go.", parse);
			Text.NL();
		}
		//Inc cock size
		p1cock.length.IncreaseStat(38, 100);
		p1cock.thickness.IncreaseStat(7, 100);
		
		if(!player.FirstVag()) {
			Text.Add("You can feel a prickling sensation behind your [balls], building in intensity until you squirm irritably in Nadir-Ma’s lap, suckling grumpily at her delicious tit.", parse);
			Text.NL();
			Text.Add("Nadir-Ma reaches behind your balls to gently stroke your tender flesh. <i>“Relax, cutie. Just relax and you’ll feel good.”</i>", parse);
			Text.NL();
			Text.Add("Shivering, you lay yourself against the dobermorph’s breast and allow her to stroke you. Her touch is strangely soothing, yet as she brushes her fingers over your flesh, each pass sends the faintest spark of pleasure crackling through your nerves.", parse);
			Text.NL();
			Text.Add("It’s a weird mixture of feelings that lulls you into a stupor, only to bring you back to reality with a jump when you feel her fingertip gliding through a cleft that wasn’t there before!", parse);
			Text.NL();
			Text.Add("<i>“Brace yourself, this is going to hurt a little.”</i>", parse);
			Text.NL();
			Text.Add("Without further ado, the Goddess slips her fingers inside, deliberately pressing against an unfamiliar barrier. You can feel it tearing as she steadily pushes her way inside, making you mewl in pain and instinctively clench down.", parse);
			Text.NL();
			
			var vag = new Vagina();
			vag.virgin = false;
			player.body.vagina.push(vag);
			
			Text.Add("<b>You have lost your virginity.</b>", parse);
			Text.NL();
			Text.Add("The kindly dobermorph ignores your protestations, gently working your innards with her touch. As her fingers slide around your new netherlips, the pain is dulled until it slips away entirely, leaving only the first inklings of soothing pleasure.", parse);
			Text.NL();
			Text.Add("<i>“There, there, the pain is gone,”</i> she says, rubbing your head softly. <i>“From now on, there’ll only be pleasure for you, cutie.”</i>", parse);
			Text.NL();
			Text.Add("You sigh lustily and absently nod your agreement before taking her nipple again. Pleasure sounds good... especially if it promises to be like what she’s doing down there now.", parse);
			Text.NL();
			Text.Add("Contentment fills you as Nadir-Ma’s wonderful fingers stretch and twirl your depths, making sure everything is in working order inside you before she pulls them out. You watch her lazily lick herself clean, savoring the juices smeared across her digits.", parse);
			Text.NL();
		}
		Text.Add("Seized by a sudden incredible thirst, you start to suck as if your very life depends on it. Your Goddess’ moans and sighs barely register, falling on deaf ears as you greedily guzzle and gorge at her tit.", parse);
		Text.NL();
		Text.Add("Nadir-Ma giggles. <i>“Oh, you servants are all the same. Once you get a taste, you never want to let go… normally, I’d be stopping you here, but I think you deserve to go all the way. It’s been a long time, and you did do everything I asked of you; good servants like you are hard to come by. Go ahead then, cutie, drink your fill. Your Goddess’ body is nothing if not bountiful, and I’ll be damned if I can’t at least feed my best girl.”</i>", parse);
		Text.NL();
		Text.Add("Enthralled by your Goddess’ generosity, you eagerly suckle harder, anxious to draw as much of the rich, life-giving nectar from her bosom as she will deign to give you.", parse);
		Text.NL();
		parse["h"] = player.HasHair() ? "through your hair" : "over your shaven scalp";
		parse["h2"] = player.HasHair() ? " Her digits playfully intertwine with your locks, sweeping down through them." : "";
		parse["h3"] = player.HasHair() ? " the length of your hair - down" : "";
		var wings = player.HasWings();
		parse["wings"] = wings ? wings.Short() : "";
		parse["w"] = wings ? Text.Parse(", between your [wings]", parse) : "";
		Text.Add("Dimly, you can see her smiling down at you as she reaches out and clasps your cheeks, running her fingers over your face as much as she can. Her hands curl across your cheekbones, sweeping up your temples and then start to run [h].[h2] You can feel her digits dragging down[h3] and down, from the top of your skull down over your shoulders[w], across the small of your back, not stopping until you feel them playfully brush your ass.", parse);
		Text.NL();
		Text.Add("You smile proudly around the dobermorph’s nipple as she starts to openly grope your butt. Rich and full, perky and firm, it’s a beautiful little eye-catcher. Naturally, her hands sweep further in, encompassing the strong, wide bones of your child-bearing hips; you have a body made for birthing beautiful, healthy children, and from somewhere deep inside, the alien lament that your Goddess lacks a cock with which to bless you with some pups of her own surfaces.", parse);
		Text.NL();
		if(player.HasTail())
			Text.Add("Your [tail] wags happily, swaying over your ass, and Nadir-Ma smiles at the sight. It only swishes faster when she reaches around to play with it, scratching its base before creeping down between your plump, squeezable buttocks.", parse);
		else
			Text.Add("Nadir-Ma caresses your hips, visibly savoring their curves as she feels the strength and potential in them. But your hips cannot hold the attention of a Goddess like her for long, and inevitably she drifts back to your ass, her delicate fingers creeping down the crevasse of your buttock cleavage.", parse);
		Text.NL();
		Text.Add("The Goddess’ long, slender digit begins to poke at your asshole, slowly rubbing circles around the puckered orifice, letting it feel her pressure before she starts to press on it for real. With the inexorable might of a true queen, she drives on; even were you of a mind to resist, you would be unable to keep her from spreading you open as she pushes herself in to the very knuckle.", parse);
		Text.NL();
		Text.Add("A brief flicker of confusion crosses your mind; why are you so <b>tight</b>? Didn’t you just have her favorite toy buried to the hilt in your ass a few minutes ago?", parse);
		Text.NL();
		Text.Add("Nadir-Ma’s finger twitches, brushing feather-softly against your prostate, and the confusion vanishes into ether. What does it matter, when it feels this good?", parse);
		Text.NL();
		Text.Add("The Goddess just smiles knowingly, continuing to twist her wrist and tickle your innards with her finger; it feels so good, but you want more, you <b>need</b> more!", parse);
		Text.NL();
		Text.Add("Nadir-Ma’s eyes glitter like dark stars above you, her smile wrapped across her pretty face as she delicately draws her finger from your anus. You don’t have more than a moment to lament being empty before she drives back in again - two digits, this time.", parse);
		Text.NL();
		Text.Add("You expect your body to betray you and resist your Goddess, but, to your awe, it does no such thing. Nadir-Ma’s two fingers slide inside of you without the slightest resistance, easily spreading you open with each twitch and flex of her wrist. You can feel her stretching you  wider than ever, and yet you know you can fit more - that you <b>want</b> more...", parse);
		Text.NL();
		Text.Add("<i>“Gotta make sure you’re able to have fun back here too. What kind of servant would you be if you couldn’t do anal during an orgy?”</i>", parse);
		Text.NL();
		Text.Add("If you didn’t have a mouth filled with the most delicious tit you’ve ever sucked, you’d heartily agree with your Goddess’ assessment. As it is, you settle for just nodding proudly, already imagining the fun you and your new butt can get up to after this.", parse);
		Text.NL();
		Text.Add("Nadir-Ma smiles, and demurely draws her digits from your asshole. Patiently, she runs her hands down over your [legs], her soft palms soothing on your delicate [skin] as she feels the dainty contours of your lower limbs. She doesn’t stop until she reaches your [feet], playfully brushing them with ticklish passes of her fingers.", parse);
		Text.NL();
		Text.Add("Finally, the strange craving fades as mysteriously as it arrived, and you settle down again. You gently open your mouth and allow the now-dry nipple to pop wetly from between your lips, your thirst well and truly sated.", parse);
		Text.NL();
		Text.Add("<i>“Aww, aren’t you the prettiest girl ever? Now you’re a cutie for real, cutie.”</i>", parse);
		Text.NL();
		Text.Add("You blink up at her, absently smiling. Her words sound so nice, but... you don’t really understand what she means.", parse);
		Text.NL();
		Text.Add("<i>“Come here, I’ll show you what I mean.”</i> She grins, getting back on her feet and motioning to the storage room.", parse);
		Text.NL();
		Text.Add("Wondering what she has in mind, you quietly pick yourself up and follow along, trying not to ogle her juicy butt <i>too</i> much as she silently pads along.", parse);
		Text.NL();
		Text.Add("<i>“Well, I suppose it’s around here somewhere... ”</i> she trails off, digging through some of the old, dusty rags. <i>“Aha!”</i> Nadir-Ma picks up a full body mirror and sets it up against the wall. <i>“Take a look, cutie,”</i> she says, stepping aside.", parse);
		Text.NL();
		Text.Add("You immediately step forward to see what she was talking about.", parse);
		Text.NL();
		parse["toes"] = player.HasLegs() ? "toes" : parse["feet"];
		if(werewolf)
			Text.Add("...Wow. Nadir-Ma is right; you’re absolutely <b>stunning</b>! Your body remains the same, a strong and proud she-wolf, but there’s no denying your raw femininity either. From the delicate curves of your muzzle, down to the dainty toes of your paws, you are one gorgeous wolfess. Huge breasts jiggle enticingly on your chest, rising and falling with each breath, and your silky tail swishes above big, round, gropable butt cheeks. Even the mighty wolf-cock already jutting from your loins only emphasizes your feral sexuality.", parse);
		else
			Text.Add("...Oh, baby. Is that really you? You’re <b>gorgeous</b>! A picture of utter womanhood, from your plump cock-sucking lips down to your dainty little [toes]. Long, sleek hair cascades down your back, shimmering against your beautiful [skin], highlighting curves fit to die for. You push out one baby-making hip, pouting critically as you watch the way your plump tits and your big, fat [cock] bounce with the movement, and then smile in admiration; you are just a fucking <b>machine</b>, aren’t you?", parse);
		Text.NL();
		Text.Add("Licking your lips lasciviously, your hand unthinkingly reaches for your [cock], already outthrust and drooling with desire at the vision of loveliness staring back at you from the mirror.", parse);
		Text.NL();
		Text.Add("Nadir-Ma laughs. <i>“Such a horny little servant...”</i> she trails off, hugging you from behind.", parse);
		Text.NL();
		Text.Add("You simply smile stupidly and nod your agreement, still fixated on your reflection. You only look away when you feel the dobermorph’s warm, delicate hand insistently brushing away your hand. As you look down, her dainty fingers wrap around your cock, even that simple contact enough to make you moan with pleasure.", parse);
		Text.NL();
		Text.Add("<i>“Now, I wouldn’t be much of a Goddess if I wasn’t willing to give my best girl a hand, would I?”</i>", parse);
		Text.NL();
		Text.Add("Well, you wouldn’t say that -", parse);
		Text.NL();
		Text.Add("<i>“It’ll just be a quick handjob though. I got places to be, things to see, people to fuck.”</i> She giggles. <i>“And I’m willing to bet you do too, but for now enjoy your Goddess’ touch.”</i>", parse);
		Text.NL();
		Text.Add("Before you can think of a response to that, she starts to stroke your shaft. With the ease of a true expert, her fingers glide back and forth along your skin, caressing every special spot without fail. Each digit unerringly seeks out a particular crease, ridge or crinkle, reducing your brain to a warm puddle of fuck. You can’t possibly hold out much longer...", parse);
		Text.NL();
		parse["proverbial"] = player.HasLegs() ? "" : " proverbial";
		Text.Add("And then, all of a sudden, your Goddess releases you. Your plaintive whine dies on your lips as she fiercely spins you around on your[proverbial] heel and pulls you into a deep kiss. The heat of her floods your mind, the taste of her washing over your tongue, and you don’t have a chance in hell of stopping what happens next.", parse);
		Text.NL();
		Text.Add("Your overheated cock explodes like a poorly-capped geyser, your [balls] spewing their frothing, churning contents over the dobermorph’s belly. Gush after gut-clenching gush pours from you, surging over Nadir-Ma’s stomach, spattering against the underside of her tits and washing over her thighs, yet she keeps kissing you until you finally run dry. Your cock belches one last gobbet of seed over the dobie’s now-white torso and goes limp; only then does she let you go.", parse);
		Text.NL();
		Text.Add("Nadir-Ma chuckles. <i>“I can see you’re putting those big balls of yours to good use,”</i> she teases, swiping a finger over her cum-caked belly and sucking on her digit. <i>“Tasty!”</i>", parse);
		Text.NL();
		Text.Add("Sheepishly, you apologize for making such a mess of her beautiful, clean fur like that. You just couldn’t help yourself when she kissed you like that.", parse);
		Text.NL();
		Text.Add("<i>“Nah, don’t worry about that, bestie. It’s just a little cum.”</i> She chuckles. <i>“Plus I don’t mind; feels kinda nice to have your servant’s appreciation covering you,”</i> she adds, rubbing your seed into her fur, one hand slipping down to rub her labia, another hiking up to spread your cream onto her breasts.", parse);
		Text.NL();
		Text.Add("You watch her lathering your jism into her fur with hungry eyes, licking your lips as your cock proudly swells again. Nothing like seeing someone enjoy the fruits of your loins to put you in a generous mood... unless it’s watching such ample curves being shaken and stroked in the process.", parse);
		Text.NL();
		Text.Add("Nadir-Ma pays you no attention, instead continuing to spread your cum across her body. As you watch, it fades away, leaving her fur looking glossier and silkier than it did before.", parse);
		Text.NL();
		Text.Add("<i>“Hmm, so tasty!”</i>", parse);
		Text.NL();
		Text.Add("Licking your lips, you tell her that if she thinks it’s so tasty, she’s welcome to have some more. You’ll even let her have it straight from the tap, if she wants...", parse);
		Text.NL();
		Text.Add("The dobermorph waves you off. <i>“Sorry, cutie, but I did tell you that was just a quickie and I’d be gone. I’ve got other subjects to visit too, y’know?”</i>", parse);
		Text.NL();
		Text.Add("You wilt slightly at her words, but accept it graciously. She’s already been so generous to you; she should go and share her gifts with other lucky souls as well.", parse);
		Text.NL();
		Text.Add("<i>“I’ll be going now, but I might call on you again in the future. So make sure you’re ready when I do. And keep that boner prepped for me! Ciao!”</i> She blows you a kiss and hurries out of the storage room.", parse);
		Text.NL();
		if(werewolf) {
			Text.Add("You watch her disappear through the door, her steps swiftly fading even with your sensitive hearing. You lazily run your fingers through your silky fur, and then lope off out of the chamber; there’s got to be some lucky souls out there ready to pound a fine bitch... or, better yet, to get pounded by a bitch, heh.", parse);
		}
		else {
			Text.Add("By the time you have pulled your so-called clothes back on, there isn’t the faintest sign of your divine dobermorph lover. But as you admire the way you fill out your tattered clothes, you must admit she certainly left you with some splendid gifts to remember her by.", parse);
			Text.NL();
			Text.Add("Bolstered by that thought, you set off once again; the night is young, and you are hot.", parse);
		}
		Text.Flush();
		
		Gui.NextPrompt();
	}
	
	//[Yes] [No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "What the hell, after all that’s gone on so far, what’s a little buttplay between friends? Tell her that she can go right ahead.",
		func : prompt, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "Uh-uh, no way, your ass is strictly exit only! You draw the line here!",
		func : function() {
			Text.Clear();
			HalloweenScenes.NadirMaNoEntry(parse, prompt);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.NadirMaNoEntry = function(parse, func) {
	Text.Clear();
	
	var first = !(HalloweenScenes.HW.nadirma & Halloween.NadirMa.SaidNo);
	HalloweenScenes.HW.nadirma |= Halloween.NadirMa.SaidNo;
	
	if(first) {
		Text.Add("As politely as you can, you shake your head and decline the offer.", parse);
		Text.NL();
		Text.Add("Nadir-Ma chuckles softly. <i>“Excuse me? For a moment there I thought you refused me.“</i>", parse);
		Text.NL();
		Text.Add("What is she, deaf? You take a breath and prepare to repeat yourself.", parse);
		Text.NL();
		Text.Add("<i>“Before you wind up saying anything you might regret, I should warn you that I <b>hate</b> it when people say no to me. And it’s not a very bright idea to deny a Goddess when she’s been stuck in a jar for very long. I might get angry, you know?”</i> She smiles.", parse);
		Text.NL();
		Text.Add("You’d have to be a complete and total idiot to not notice the hint of fang in her grin, or the menace underlying her words. Whoever she is - and whatever, you can’t forget that whole manifestation business - she really doesn’t like to be told ‘no’. Maybe going along with her wishes might be the smart choice here...", parse);
		Text.Flush();
		
		//[Obey] [Defy]
		var options = new Array();
		options.push({ nameStr : "Obey",
			tooltip : "Best not to piss off someone who’s obviously supernatural.",
			func : function() {
				Text.Clear();
				Text.Add("Swallowing your pride, you put on your best apologetic smile and tell her that you didn’t mean it. You’ll be happy to do what she wants.", parse);
				Text.NL();
				Text.Add("<i>“Of course you will.”</i> She laughs merrily.", parse);
				Text.Flush();
				Gui.NextPrompt(func);
			}, enabled : true
		});
		options.push({ nameStr : "Defy",
			tooltip : "You don’t care who or what she is, no means no!",
			func : function() {
				Text.Clear();
				Text.Add("Looking her straight in the eye, you tell her that you said no, and you meant it.", parse);
				Text.NL();
				HalloweenScenes.NadirMaNoEntry(parse);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("Nadir-Ma’s face turns to a scowl of pure anger. <i>“How <b>dare</b> you refuse me!”</i> Her voice thunders around the storage room.", parse);
		/* TODO
#if Bandages - same line
Her previously discarded bandages immediately wrap themselves around her body as if they were snakes pouncing on their prey.
#converge
		 */
		Text.NL();
		Text.Add("The urge to take a step back flashes through your mind, before you discard it. Folding your arms across your [breasts], you chastise the angry dobermorph that you said no. Who does she think she is, to be a throwing a tantrum like this?", parse);
		Text.NL();
		Text.Add("<i>“I am a Goddess!”</i> she exclaims. Wind booms around the room, snuffing out the torches and slamming the door behind you. The darkness lasts only an instant, before an eerie green flame lights up each torch.", parse);
		Text.NL();
		Text.Add("You have a sinking feeling about all this...", parse);
		Text.NL();
		Text.Add("Without a second thought, you turn and race for the door. You grab the latch and pull with all your might, groaning with the effort... but you can’t budge it an inch. A darkly amused chuckle from behind makes you swallow, and turn to face the outraged dobermorph.", parse);
		Text.NL();
		Text.Add("The eldritch flames cast their eerie light over her, making her fur shine with its own unnatural radiance. You can make out every inch of her... and see that something isn’t normal. Her panties are starting to bulge out, fabric distending as if something were growing inside of them.", parse);
		Text.NL();
		Text.Add("Whatever it is, it just keeps on swelling, getting bigger and bigger by the moment. It pushes out of her cunt until the bandages can’t take any more. First, one snaps completely, fluttering forlornly between her knees. And then the others swiftly follow, torn asunder by the mass growing between her loins.", parse);
		Text.NL();
		Text.Add("When you can see what it is, your jaw drops in surprise. It’s a dick. Rather, it’s a full set of male genitalia; two throbbing balls that completely obscure the doberherm’s womanhood, the sheath above disgorging a long, thick, dripping doggie-dong now that it’s no longer constrained by her shredded panties. Pre-cum visibly drools down its tip, dripping onto the floor beneath her.", parse);
		Text.NL();
		Text.Add("<i>“Come here and show me that pretty ass of yours, mortal. I’ll put you back in your place: underneath me, with my cock lodged deep inside you, and you begging while I make you my bitch!”</i>", parse);
		Text.NL();
		Text.Add("The lustfully sneering morph suddenly springs at you. You throw yourself aside, narrowly evading her efforts to pounce, but when you try to scramble upright, you feel something wrap around your [legs].", parse);
		Text.NL();
		Text.Add("Looking back, you see some of Nadir-Ma’s bandages have lashed out from her body like cloth tentacles, ensnaring you; before you can even process that image, more of them spring for you. They wrap around your wrists, binding them together and sending you toppling to the ground, even as more work to completely entrap your [legs]. You struggle desperately, but you can’t break them apart; you’re completely helpless!", parse);
		Text.NL();
		Text.Add("<i>“Gotcha!”</i> she exclaims triumphantly, reeling you in as she sends more bandages to bind you.", parse);
		Text.NL();
		parse["lisAre"] = player.HasLegs() ? "are" : "is";
		Text.Add("You pull and wriggle and squirm, trying your best to fight it off as Nadir-Ma’s enchanted linen coils around you, but it’s no use. Your arms are pulled behind your back and knotted together, incapable of exerting any leverage. Bandages twine themselves over your [breasts] and [belly], forming bondage patterns that hold the whole mess together, even as your [legs] [lisAre] made similarly useless.", parse);
		Text.NL();
		Text.Add("For added insult, a final roll of cloth loops its way around your face, sealing your mouth shut and cutting off any attempts you might make to speak. When it’s all done, you can still wriggle feebly, but that is the extent of your options. Nadir-Ma has you right where she wants you.", parse);
		Text.NL();
		Text.Add("The dobermorph hoists you over her shoulder, carrying you to a rotating table and dumping you on top of it. With a few extra motions, she sends more bandages to loop around you and secure you tightly.", parse);
		Text.NL();
		HalloweenScenes.NadirMaBadend(parse);
	}
}

HalloweenScenes.NadirMaBadend = function() {
	var werewolf = HalloweenScenes.HW.Werewolf();
	
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	Text.Add("You wouldn’t call your position painful, but it’s not comfortable, either. You are flat on your chest and knees, your [butt] thrust up into the air for all the world to see. And you have a pretty good idea of what Nadir-Ma has in mind for you, with this pose...", parse);
	Text.NL();
	parse["gen"] = player.FirstVag() ? parse["vag"] : "taint";
	Text.Add("<i>“Now that’s a pretty sight. I wonder where I should start...”</i> She steps over you, grinding her rock-hard member against your [gen]. <i>“It’s been so long. Maybe I should just let loose and ravage you until you’re nothing more than a used cum-bucket? Or should I savor this moment and fuck you so thoroughly that you’ll have my cock burned into your mind for eternity...”</i>", parse);
	Text.NL();
	Text.Add("Even as she muses, she continues to idly grind her hips against yours. You can feel the warmth of her throbbing maleness as it slides against your most intimate parts, so close you’d swear you can feel her heartbeat. It brushes you tantalizingly, almost playfully, smearing a gloss of musky pre-cum over your loins with its passage.", parse);
	Text.NL();
	var gen = "";
	if(player.FirstCock()) gen += "your [cocks] starting to stiffen as the blood rushes to [itThem]";
	if(player.FirstCock() && player.FirstVag()) gen += " and ";
	if(player.FirstVag()) gen += "your [vag] starting to dampen, wrinkling in anticipation as her glans brushes along your folds";
	parse["gen"] = Text.Parse(gen, parse);
	Text.Add("Despite everything else about the situation, you can’t help yourself but respond to the doberherm’s treatment. You can feel [gen].", parse);
	Text.NL();
	Text.Add("Nadir-Ma laughs out loud when she feels the telltale signs of your arousal. <i>“I knew it! A Goddess always knows! You’re enjoying this!”</i> she accuses.", parse);
	Text.NL();
	if(player.SubDom() > 0) {
		Text.Add("You go to shout that it’s not true, that you hate this, but with your gag in place, all that comes out are muffled grunts and rumbles. Instead, you try to convey your message by shaking your head.", parse);
		Text.NL();
		Text.Add("<i>“It’s no use denying it! Even if you say no, your body says yes!”</i>", parse);
		Text.NL();
		Text.Add("Unable to fight back, you just groan in frustration, letting your head loll resentfully on the table.", parse);
	}
	else {
		Text.Add("Despite how strongly she came on before, this is straight out of one of your wet dreams. Already starting to forget yourself, you let out an aroused moan that’s clear even through your gag, nodding happily in agreement.", parse);
		Text.NL();
		Text.Add("<i>“Don’t worry, my bitch. We’re just getting started,”</i> she says, giving you a slap on your butt.", parse);
		Text.NL();
		Text.Add("Your whole body jolts in that delicious mix of pleasure and pain at her touch. An appreciative laugh buffets your gag and you do your best to give your butt a flirty little shake.", parse);
	}
	Text.NL();
	Text.Add("The doberherm roughly grabs your ass, spreading your butt cheeks apart to check out your [anus]. <i>“Now <b>this</b> is a tempting target!”</i>", parse);
	Text.NL();
	if(player.SubDom() > 0) {
		Text.Add("The pain from her manhandling sparks a fresh spurt of resentment and you squirm angrily on the tabletop, trying to shout your protests through your gag as you vainly attempt to wriggle out of her grasp.", parse);
	}
	else {
		Text.Add("Mewling lustfully, you shake your hips and squirm across the tabletop, trying to crawl away from her... but not trying <b>too</b> hard.", parse);
	}
	Text.NL();
	Text.Add("<i>“Yes! Keep at it, bitch! Your resistance only makes my penis harder!”</i>", parse);
	Text.NL();
	Text.Add("She grinds her cock against you one last time, and then suddenly she pulls away, leaving you tingling from her touch. Your confusion at her actions doesn’t last long, however; warm breath gusts over your vulnerable flesh, making your [skin] crawl as you feel her canid nose sniffing audibly at your clenched butthole.", parse);
	Text.NL();
	Text.Add("<i>“Such a tasty morsel you are! Don’t mind if I do!”</i> She lets her drooling mouth open and begins lapping your taint.", parse);
	Text.NL();
	if(player.Slut() > 25) {
		Text.Add("You try to scream your revulsion as her warm, wet tongue slides across your ass crack - ew! What does she think she’s doing?!", parse);
		Text.NL();
		Text.Add("Grossed out, you writhe and squirm, but her bindings have you stuck fast. The doberherm pays no attention to your lack of enthusiasm, instead steadily lapping away at your ass.", parse);
		Text.NL();
		Text.Add("To your shame, you actually start to enjoy it, the slow passing of tongueflesh over your soft [skin] making your arousal grow, coaxing you to relax despite yourself...", parse);
		Text.NL();
		Text.Add("And that’s when her tongue suddenly dives into your vulnerable [anus]. Even through your gag, your stunned bellow is quite audible, and Nadir-Ma chuckles as you try to clamp down and squeeze her out of there. Oh, god, it’s so soft and slimy... you can’t seem to get a grip on it, and she just keeps drilling deeper and deeper, worming her way into crannies you didn’t even know you had...", parse);
		Text.NL();
		Text.Add("You can feel your cheeks burn as you realize that, despite everything, this is actually feeling pretty good - it’s turning you on to have this... this... woman, licking at your asshole.", parse);
	}
	else {
		parse["guygirl"] = player.mfTrue("guy", "girl");
		Text.Add("You moan appreciatively through your gag as Nadir-Ma’s tongue glides across your ass crack. She may have her flaws, but she definitely knows how to make a [guygirl] feel <i>good</i>. You almost wish you weren’t gagged just so you could tell her what a good job she’s doing; she knows her way around an asshole!", parse);
		Text.NL();
		Text.Add("Nadir-Ma seems to understand what you’re thinking. Her tongue dances across your taint, caressing you as she slowly spirals her way towards your pucker. Mischievously, you clench yourself shut; not too tight, just enough that she has to work in order to wriggle her way in.", parse);
		Text.NL();
		Text.Add("Mmm... oh, yes, she feels sooo good inside of you. Warm, wet flesh worms into your most intimate of crevices, expertly stroking every last delicious spot, making you shudder in pleasure with the slightest of touches.", parse);
	}
	Text.NL();
	Text.Add("Nadir-Ma withdraws with a pop, a thin string of saliva linking her lips to your winking anus. Laughing, she wipes her mouth on her bandages and hops on the table, aligning her throbbing member with your saliva-lubed ass. <i>“Any last words, bitch?”</i>", parse);
	Text.NL();
	Text.Add("Your reply is swallowed by your gag; all that comes out are a few indecipherable mutters.", parse);
	Text.NL();
	Text.Add("<i>“That’s what I thought.”</i> She pushes forward in a mighty thrust, sinking almost half of her member into your [anus].", parse);
	Text.NL();
	Text.Add("A strangled howl nearly blows the gag out of your mouth as she so roughly violates you. Fire dances through your asshole at being so suddenly penetrated... so big; it feels like she’s nearly splitting you apart!", parse);
	Text.NL();
	Text.Add("<i>“Hmm, yes. I’m loving this! C’mon bitch! Tighten up for me!”</i> she yells, giving your butt another resounding slap.", parse);
	Text.NL();
	Text.Add("You moan deep and low, a near sob of effort. Unthinkingly, you clench down around her member, trying to ignore the burning as you do so. You can feel her heartbeat through the throbbing of her cock, her pre-cum seeping steadily into your depths, almost but not quite soothing the sensation of being so stretched.", parse);
	Text.NL();
	Text.Add("<i>“Yes, just like that!”</i> she says as she thrusts once more, burying even more of her shaft inside you.", parse);
	Text.NL();
	Text.Add("You rock at the impact, groaning as you feel her cock pushing deeper inside, spreading you further with each effort. How much more does she have to put inside of you? You don’t know if you can take much more!", parse);
	Text.NL();
	Text.Add("With the last thrust, you feel her knot push against your stretched sphincter; she’s forceful, but thankfully makes no effort to tie you. <i>“There, you took it all like a good bitch. Since I’m such a generous mistress, I’ll give you moment to adjust.”</i>", parse);
	Text.NL();
	Text.Add("Quick to grab this opportunity, you start inhaling and exhaling, trying to keep your breathing steady as you coax your body to accept this violation of its capacity. Slowly, you can feel your heart resume its normal pace.", parse);
	Text.NL();
	Text.Add("<i>“Time’s up!”</i> she declares, pulling away in preparation to slam into you again.", parse);
	Text.NL();
	Text.Add("Oh no...", parse);
	Text.NL();
	Text.Add("You do your best, but still, you can barely brace yourself before she hammers herself home again, the meaty spike of her girl-cock splitting you open again. In that single, powerful thrust, she buries herself to the knot, holding herself there for maybe three seconds before pulling herself free with equal roughness - only to slam herself back into you again. And again. And again...", parse);
	Text.NL();
	Text.Add("Heedless of your whimpering or wriggling, she keeps on fucking you rough and hard. It hurts, at first, to be used like this... but with each thrust, you can take it a little easier than the one before. A warmth starts to spread through you, pooling in your ass and then trickling down your spine. In its wake, pleasure begins to replace pain; on her next thrust, you can’t hold back a soft, lustful moan.", parse);
	Text.NL();
	Text.Add("<i>“What is that I just heard?”</i>", parse);
	Text.NL();
	Text.Add("All you give her is muffled murmurs.", parse);
	Text.NL();
	Text.Add("Nadir-Ma chuckles. <i>“Here, let me take care of this.”</i> With a wave of her hand, she wills the bandages to release your mouth.", parse);
	Text.NL();
	Text.Add("You gasp as you can finally breathe through your mouth again. You pant softly, trying to catch your breath, but Nadir-Ma’s next thrust knocks the air from your lungs, forcing another pleased moan from your lips.", parse);
	Text.NL();
	Text.Add("<i>“Hmm, such a delicious sound! C’mon, moan for me!”</i> she says, grinding her knot against your used [anus].", parse);
	Text.NL();
	Text.Add("With such encouragement, you can’t even think about resisting. You moan again, deliberately this time, doing your best to emphasize how good it feels now to be so full, so well used.", parse);
	Text.NL();
	Text.Add("<i>“That’s a good bitch! Now here’s your reward!”</i> she says, groaning with effort as she pumps into you with renewed vigor.", parse);
	Text.NL();
	Text.Add("The two of you grunt and groan in unison, a crescendo of raw, animal lust as she hungrily pounds your ass. You can feel her cock throbbing, her knot bulging with need, the only warning you get before she thrusts as deeply as she can without tying you and explodes.", parse);
	Text.NL();
	Text.Add("Thick, hot musky girl-seed pours into your gaping ass, swirling down into your belly. You can feel the weight of it, liquid and sloppy as she paints your innards white. By the time she grunts in satisfaction, you can feel it sloshing inside of you. But you can’t feel her going slack... not by a long shot.", parse);
	Text.NL();
	Text.Add("As soon as she’s done, Nadir-Ma pulls out, letting her seed drip in a thick stream from your gaping hole. A weak, final spurt of cum clings to your butt as she steps off the table.", parse);
	Text.NL();
	Text.Add("You pant slowly, feeling your heart returning to its normal pace, still throbbing with unsated pleasure. Without warning, the doberherm spins the table around, your vision rippling as you are twirled like a cooked turkey. When you blink your eyes, you realize you are facing Nadir-Ma now, your face on level with her crotch, and your vision filled with the sight of her half-erect, cum-dripping maleness.", parse);
	Text.NL();
	Text.Add("<i>“We’re just getting warmed up, my bitch. I figured you could use a snack after last round, and I could use some cleaning up, so get to work!”</i> she orders, slapping your face with her half-erect cock and letting the cum-soaked length rest on your cheek.", parse);
	Text.NL();
	if(player.SubDom() > 0)
		Text.Add("Well and truly broken at this point, the thought of resistance doesn’t even cross your mind. Instead, you meekly open your mouth and twist your face slightly, gently drawing her cock between your lips.", parse);
	else
		Text.Add("You need no further instruction, already opening your mouth and drawing her tasty treat inside, happy for a chance to really taste her dick.", parse);
	Text.NL();
	Text.Add("<i>“And if I feel teeth, you’d better be ready for some <b>hard</b> punishment, the likes only a Goddess could give.”</i>", parse);
	Text.NL();
	parse["boygirl"] = player.mfTrue("boy", "girl");
	if(player.SubDom() > 0)
		Text.Add("A fearful tremor wracks your body; no more, please, no more. You keep your eyes downcast, trying to look as docile and obedient as you can.", parse);
	else
		Text.Add("If you weren’t distracted by the tasty treat in your mouth, you’d probably snort derisively. As if you would do something like that! You’re a <b>good</b> [boygirl]!", parse);
	Text.NL();
	Text.Add("The taste of her - thick and musky, with a just a little smokiness that you try not to think too hard about - fills your mouth. Gently, you suckle at her cock like a baby at the teat, your [tongueTip] occasionally flicking against her pointy tip, but content to leave the bulk of the work to your pulsing lips and cheeks. You can feel her starting to throb against your tongue, slowly growing harder and harder as you work.", parse);
	Text.NL();
	Text.Add("As she grows more erect, you suck harder and work your tongue more, eagerly coaxing her upright again. The salty-spice of her cum gives way to a taste that can only be her flesh, a surprisingly pleasant experience that only stokes your eagerness to suckle at her dick. A perverse hint of pride raises its head as you realize she’s fully hard again, pulsating eagerly against your tongue as pre-cum starts to pool at the bottom of your mouth.", parse);
	Text.NL();
	Text.Add("<i>“Good work, but I think you can do better than this,”</i> she says, taking a step forward and burying her shaft all the way to the knot down your throat.", parse);
	Text.NL();
	Text.Add("Though a small part of you tries to keep positive, reminding you of how much worse it would be had she actually knotted your mouth, it’s drowned out by the rest of you. Even without her knot, Nadir-Ma’s mammoth fuckmeat is more than enough to pose a very real problem to your ability to breathe...", parse);
	Text.NL();
	Text.Add("<i>“Come on, bitch. Put those throat muscles to work!”</i>", parse);
	Text.NL();
	Text.Add("Desperate for air, you try your hardest to do as she tells you. Your lips suck desperately at her knot, your tongue squirming feebly as it is crushed to the floor of your mouth by the sheer weight of dickflesh crammed inside. And all the while, your throat clenches and squeezes, trying vainly to milk Nadir-Ma’s cock.", parse);
	Text.NL();
	Text.Add("Amazingly - impossibly - you swear you can feel her growing even <b>bigger</b> and harder than before, swelling up until she has completely blocked off your throat. You’re starting to feel lightheaded, the world spinning around you...", parse);
	Text.NL();
	Text.Add("With an indelicate grunt, Nadir-Ma suddenly tugs herself free of your mouth. Air, blessed air pours down your gullet and you greedily drink until your head spins. The doberherm watches you patiently as you gasp and pant, until she judges you’ve recovered.", parse);
	Text.NL();
	Text.Add("You don’t realize how tempting a target you present until, on your next gasp, your inhalation brings Nadir-Ma’s cock jamming itself back into your mouth. With a pleased bark, it bulges and then explodes, hot jets of doggy-cream painting your gullet white as they pour down your throat. You can feel your stomach gurgling, growing tight and heavy under this massive liquid repast; by the time Nadir-Ma runs dry a second time, you’re sure you’ve put on a few pounds, and that if you were wearing actual clothes, they’d be uncomfortably tight around the belly.", parse);
	Text.NL();
	Text.Add("Nadir-Ma pulls out with a chuckle. <i>“How’d you like your treat?”</i>", parse);
	Text.NL();
	Text.Add("You just groan, stifling a soft burp as the air and cum you swallowed settles in your belly.", parse);
	Text.NL();
	Text.Add("<i>“Well, you’re not done yet. You still have to clean up my balls,”</i> she says, pushing her orbs right on your face.", parse);
	Text.NL();
	Text.Add("Tiredly, but not so tired as to disobey, you open your mouth and extend your tongue, starting to softly lap at the cum-caked girl-balls you have been presented. After all you have just swallowed, you barely register the taste of her thick musk in your mouth; it’s just that normal to you now.", parse);
	Text.NL();
	Text.Add("What is less normal is how the skin of Nadir-Ma’s nutsack is still stretched taut over its contents, and you’d swear that as you gently suck on one, you can feel it swelling between your lips. Even after cumming twice, Nadir-Ma isn’t sated <b>yet</b>, and as if to rub your lack of success in relieving her in your face, a fat bead of pre-cum drips onto your nose from her throbbing cock above.", parse);
	Text.NL();
	Text.Add("<i>“That’s good enough,”</i> she says, taking a step back. She leans down to look in your tired eyes and grins predatorily.", parse);
	Text.NL();
	Text.Add("<i>“What’s this? Already tired?”</i>", parse);
	Text.NL();
	Text.Add("You pause for a moment, thinking how to answer that. Truthfully, your stomach quakes and your orifices clench at the thought of another bone-jarring pounding like the two you have just received. On the other hand, an answer she didn’t want to hear is what got you into this mess in the first place!", parse);
	Text.NL();
	Text.Add("Calculating your odds, you decide to bite the bullet. Doing the best to hide the tiredness from your eyes, you shake your head and assure her that you’re fine, that you can keep going as long as she wants.", parse);
	Text.NL();
	Text.Add("<i>“Great! I was thinking about giving you some time before we got to the next part, but since you’re fine, let’s get right to it.”</i>", parse);
	Text.NL();
	Text.Add("Your head sinks back to the tabletop. You and your big mouth...", parse);
	Text.NL();
	Text.Add("With a kick, Nadir-Ma sends the table spinning again, stopping it just as your butt is back to facing her. She hops on the table and unceremoniously sticks her dick back inside your well-used asshole.", parse);
	Text.NL();
	Text.Add("In your gaping, cum-slick condition, there’s not the slightest resistance to her impalement of you. You simply moan softly as she fills you up again, the spark of pleasure cutting through the fog of fatigue shrouding your brain. You absently note that, just like last time, she stops just short of fully penetrating you, letting you feel the solid weight of her knot grinding against your gaping hole.", parse);
	Text.NL();
	Text.Add("<i>“Hmm, I love your ass, bitch. Think I’ll keep you around for a while.”</i>", parse);
	Text.NL();
	Text.Add("Anything that you might have to say on that matter is cut off when she bucks inside of you, forcing another quiet moan from your throat. Nadir-Ma doesn’t seem to notice your less than enthusiastic response to her efforts; she just happily humps away at your ass, treating you as little more than a fleshy onahole in her quest to empty herself for a third and hopefully final time.", parse);
	Text.NL();
	Text.Add("You can hear her panting as her lust builds, and you can certainly feel the force increase as she starts to truly slap her hips against your own. A bestial growl rumbles up her throat as she truly pounds you, battering your ass in an effort to cram the bloated bulb of her knot through your too-tight opening.", parse);
	Text.NL();
	Text.Add("<i>“Come on, bitch. Just open up and take it, you know you want it!”</i>", parse);
	Text.NL();
	Text.Add("You moan plaintively; you’re trying to open up more for her, really you are, but she’s just so <b>BIG</b>!", parse);
	Text.NL();
	Text.Add("<i>“Guess I haven’t been pounding you hard enough then!”</i>", parse);
	Text.NL();
	Text.Add("Despite everything, you still have enough in you to scream in equal parts pleasure and pain as she suddenly drives herself home with a strength you didn’t know she had. You can <b>feel</b> your pucker being forced open, stretching to the brink of tearing as her knot slowly, agonizingly, forces its way inside.", parse);
	Text.NL();
	Text.Add("You have no words to describe the sheer <b>fullness</b> you feel as your ass manages to swallow the doberherm’s mighty knot, clamping down around it in an air-tight seal. It hurts, but it feels so <b>good</b> at the same time...", parse);
	Text.NL();
	Text.Add("And not just for you, either; Nadir-Ma’s ecstatic howl nearly deafens you as she cums, firing ropes of seed down your ass with such force that you can feel them hammering into your belly, twice as long as she did the last time she came inside of you.", parse);
	Text.NL();
	Text.Add("<i>“Yes, that’s a good bitch,”</i> the dobermorph says, patting you on the back. <i>“You’re definitely a keeper.”</i>", parse);
	Text.NL();
	Text.Add("Panting weakly, you try to sound grateful at her praise.", parse);
	Text.NL();
	Text.Add("<i>“I think I’ll keep you around forever instead of just for a while.”</i>", parse);
	Text.NL();
	Text.Add("F-forever?!", parse);
	Text.NL();
	Text.Add("<i>“Yes, you’ll be with me forever… as part of me.”</i>", parse);
	Text.NL();
	Text.Add("Chills run down your spine, beads of sweat pouring from your body. You saw her shapeshifting, yes, but that’s not possible! Is it?!", parse);
	Text.NL();
	Text.Add("<i>“Rejoice, bitch. It’s not everyday a lowly mortal is invited to join with a Goddess.”</i> Nadir-Ma motions for her bandages to release you from the table, and she hoists you into the air and onto her lap, sitting down on the table that held you not moments ago.", parse);
	Text.NL();
	if(player.SubDom() > 0)
		Text.Add("She hasn’t broken your spirit so badly that you’re just going to sit here and take this! You try to make a move, to break free somehow, but disoriented, exhausted and weighed down by cum, you haven’t a chance of getting out of her arms.", parse);
	else
		Text.Add("You croon in bliss, happily snuggling into your Goddess’s lap. You’ve always wanted someone stronger to take care of you, and what greater care and comfort could there be than to be of one flesh with your master forever?", parse);
	Text.NL();
	parse["own"] = player.HasLegs() ? "own" : parse["legs"];
	Text.Add("She hugs you from behind, grabbing your hands in hers and willing her bandages to wrap around your arms, binding them with hers. Her legs do the same to your [own], and the bindings covering her chest repeat the motion over your [breasts]. In no time, you’re tied to her, fully aware of the heat emanating from her body as she presses her [breasts] to your back.", parse);
	Text.NL();
	if(player.SubDom() > 0)
		Text.Add("Shouting in protest, you try to pull free of her bonds, to escape her amorous clutches.", parse);
	else
		Text.Add("Moaning in desire, you snuggle up to her, anxious to become one.", parse);
	Text.Add(" The bindings around your frame grow tighter, ensuring you cannot get so much as an inch away from Nadir-Ma. You can feel her body under you changing... softening. You try to think of a simile, and the best you can come up with is sitting in a couch of half-melted butter, especially as you remember the ooze-like mass the doberherm was when she originally appeared.", parse);
	Text.NL();
	Text.Add("Nadir-Ma’s cock plunges into your ass with preternatural flexibility, sliding into your depths with an ease that has less to do than you’d think with how well she stretched you out before. Looking down, you can see the ooze-like substances of her limbs starting to creep across your [skin], feel its tight, wet warmth as it envelops you, absorbs you...", parse);
	Text.NL();
	Text.Add("<i>“Relax, bitch. There’s nothing you can do about it now; in fact, there was never anything you could’ve done at all. Your fate was sealed the moment you thought it wise to say ‘no’ to the great Nadir-Ma. Besides… you’ll love it! I promise you.”</i>", parse);
	Text.NL();
	if(player.SubDom() > 0)
		Text.Add("You very much doubt that! But it’s not as if you can change your fate now... all you can do is hope that there’s some truth in what she says.", parse);
	else
		Text.Add("You sigh lustily, impatient for this to be over already. Just being this connected feels <i>sooo</i> good; you can’t wait to truly be made one with her.", parse);
	Text.NL();
	var wings = player.HasWings();
	parse["wings"] = wings ? wings.Short() : "";
	parse["w"] = wings ? Text.Parse(", coating over your [wings] in the process", parse) : "";
	Text.Add("Inexorable as the tide, Nadir-Ma’s amorphous flesh creeps around you. You can feel the lush softness of her breasts as they push against your back, slowly squishing against your spine before seeping around your shoulders[w]. Her cock throbs inside of you as you sink further and further into her lap, her balls joining her dick in your belly as her thighs envelop your own.", parse);
	Text.NL();
	parse["h"] = player.HasHair() ? "through your hair" : "over your baldness";
	Text.Add("Soon, all that remains of you is your face, and even that is being pulled into her neck. Her warmth is all-encompassing, creeping with deceptive sluggishness to devour this last lingering fragment of you. Streamers of glutinous slime ooze [h] and drip down over your [eyes], blinding you. You can feel it melting over and into your [ears], covering your nose, seeping over your chin. Your mouth takes one final gasp for air... and then it too is gone.", parse);
	Text.NL();
	Text.Add("You know nothing but darkness...", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You open your eyes to gaze at the walls of the torture room, previously lit by the greenish flames that appeared when you got Nadir-Ma angry. However, the greenish glow is gone now, having been replaced by the warm orange of regular burning flames.", parse);
		Text.NL();
		Text.Add("Confused, you look around, but there’s no sign of Nadir-Ma. Slowly, feeling uncertain about your own body, you push yourself upright, staggering a little. She must have really fucked you good; you’re all off-balance.", parse);
		Text.NL();
		Text.Add("Groaning softly, you rub your brow with your hand - and then stop, starting in horror. That is <b>not</b> your hand. In fact, neither is the other one, and when you take a look down, you don’t recognize yourself - a mirror, you need a mirror!", parse);
		Text.NL();
		Text.Add("On that thought, you stride quickly towards the storage room, where you know a mirror can be found. For a heartbeat, you find yourself wondering <i>how</i> you know that, but you dismiss the matter; you need to see what’s happened to you.", parse);
		Text.NL();
		Text.Add("Moments later, you are standing before a full-body mirror, gaping at yourself. Or, rather, at your <b>new</b> self. Staring back at you out of the mirror is Nadir-Ma’s face; she really did absorb you. But... it doesn’t look like the merger was entirely one way. Once you get over the shock, you’re sure Nadir-Ma’s body has changed as well.", parse);
		Text.NL();
		Text.Add("But when you try to get closer for a better look, you find you can’t move. You can’t swing your arm, you can’t lift your leg, you can’t even blink! It’s as if your body has turned against you all of a sudden!", parse);
		Text.NL();
		Text.Add("<i>“Hello, bitch. Enjoying the new look?”</i> You… Nadir-Ma asks.", parse);
		Text.NL();
		if(player.SubDom() > 0) {
			Text.Add("You monster! Let me out of here - give me my body back!", parse);
			Text.NL();
			Text.Add("...You want to scream, but you can’t speak.", parse);
			Text.NL();
			Text.Add("<i>“Tsk, tsk.”</i> The doberherm waves a finger at the reflection in the mirror. <i>“Silly bitch, it’s not <b>your</b> body, it’s <b>our</b> body now. And let’s not forget who’s in control here. Me!”</i> She says, pointing a thumb at herself.", parse);
			Text.NL();
			Text.Add("This is a nightmare...", parse);
			Text.NL();
			Text.Add("<i>“Oh, it’s no nightmare, bitch. If anything, it’s a dream come true for you. I promise to let you have some fun of your own once in a while, but for now? Just sit back and let your mistress take care of everything. Give me a few days and I’ll have you loving every second of being me!”</i>", parse);
			Text.NL();
			Text.Add("...Do you really have a choice?", parse);
			Text.NL();
			Text.Add("<i>“No, you don’t. But that’s why you’re the bitch and I’m the Goddess. Now, let’s have a look at what’s new on our body...”</i>", parse);
		}
		else {
			Text.Add("You try to purr your approval, to thank her for making you into something so beautiful, but you can’t seem to get your voice to work, to your dismay.", parse);
			Text.NL();
			Text.Add("Nadir-Ma grins. <i>“There’s no need to speak, bitch. I can hear your thoughts just fine, and you’re welcome. I told you that you’d love it!”</i>", parse);
			Text.NL();
			Text.Add("And she was right; mmm, it feels so good to be here, under her beautiful skin, walking around seeing the world through her lovely eyes.", parse);
			Text.NL();
			Text.Add("<i>“But you haven’t even begun to fathom what this delicious body of ours is capable of. Just sit back like the good bitch that you are, and let your mistress take control.”</i>", parse);
			Text.NL();
			Text.Add("Mmm, you can’t wait...", parse);
			Text.NL();
			Text.Add("<i>“Ah, but first? Let’s examine the changes...”</i>", parse);
			Text.NL();
			Text.Add("Oh, yes, please. You want to see how your old body has helped your beautiful mistress become even more magnificent.", parse);
		}
		Text.NL();
		if(werewolf) {
			Text.Add("If the old Nadir-Ma was intimidating in her blend of strength and sexuality, then the new her is a true monster. She easily stands at least a foot taller than she used to, and muscles visibly ripple up and down her limbs. She has visible biceps, and thighs that look like they could crack nuts. Even her belly is ripped, with a visible six-pack defined through the tight fur.", parse);
			Text.NL();
			Text.Add("She flexes a bit, then whistles. <i>“Not bad, I kinda like the new muscular look...”</i>", parse);
			Text.NL();
			Text.Add("But your little “makeover” hasn’t been purely physical, either. Her sexiness has been kicked up a couple of notches, too. Her firm, round breasts have to be an E-cup, easily, and her hips have broadened into a pair of wide, sexy flares that help keep her womanly figure. Her butt’s also picked up just the right sort of weight; big and round, but firm and toned.", parse);
			Text.NL();
			Text.Add("Not that she looks like she’s inclined to let any cocks near her ass, especially with the beast between her <b>own</b> legs. You thought the old Nadir-Ma was sporting an imposing package, but this new model... if she’s not at least twice the size she was, you don’t know what you’re talking about. What a monster... does she even have her pussy anymore?", parse);
			Text.NL();
			Text.Add("As if to prove a point, she reaches between her legs, pushing her balls aside and pushing a finger into her moist slit.", parse);
			Text.NL();
			Text.Add("A spark of pleasure snaps through your brain; you’d hiss at the feeling if you had control over the tongue.", parse);
			Text.NL();
			Text.Add("<i>“That answers your question, bitch?”</i>", parse);
			Text.NL();
			Text.Add("It certainly does... but it seems she’s picked up a bit of extra bitchy-ness herself... you don’t remember her nails being this long and, well, claw-like before. The tail idly flexing over her ass is definitely not the stumpy little doberman’s tail she had before. And you can’t quite put your finger on it, but there’s a hint of wolf around her face too.", parse);
			Text.NL();
			Text.Add("<i>“All welcome changes, bitch. I guess the werewolf in you somehow got to me, but no matter. I like the whole ‘wild beast’ look I got going now.”</i>", parse);
			Text.NL();
			Text.Add("It does suit her well.", parse);
		}
		else {
			Text.Add("There is absolutely no question, once you take a proper look, that you <i>really</i> did Nadir-Ma’s body good! It’s like absorbing you gave her a concentrated dose of pure sex appeal booster.", parse);
			Text.NL();
			Text.Add("<i>“Not gonna argue with you there, bitch. Seems like you really did me some good.”</i>", parse);
			Text.NL();
			Text.Add("The first thing to catch your eyes are her - and, technically, your - new breasts. Nadir-Ma was surprisingly busty for her build before, but now, she’s incredible; these pumpkin-sized babies have to be at <i>least</i> an F-cup, and though they clearly show the weight of themselves in how they sit, they’re not sagging down to her belly, either. Just the right blend of soft and firm to be appealing.", parse);
			Text.NL();
			Text.Add("<i>“Imagine how good these would feel during a titjob,”</i> she says, hefting her heavy bosom.", parse);
			Text.NL();
			Text.Add("A passenger in Nadir-Ma’s mind as you are, you can feel her doing so, and your ‘voice’ is lost in a wave of blissful murmuring. It feels good just to have her touching them, fingers sinking into their lushness; you can only imagine what it’d feel like for someone with their junk wrapped inside of them.", parse);
			Text.NL();
			Text.Add("<i>“I bet it’d be heaven, but now that we know what’s change up here, how about we check what’s going on down below?”</i>", parse);
			Text.NL();
			Text.Add("Of course, what’s a little up top without something down below to go with it? As the doberherm pivots slightly, checking herself out in the mirror, you can only marvel at how her hips have blossomed, spreading into a gloriously fuckable set of broodmother’s hips. You can’t imagine any straight guy who wouldn’t want to just grab onto those and start fucking as if his life depended on it.", parse);
			Text.NL();
			Text.Add("<i>“Hmm, yes. I get what you’re saying, but it’d be hard finding a bitch that’d deserve the honor.”</i>", parse);
			Text.NL();
			Text.Add("Of course, that’s not all the adjustment she got down below. Talk about baby got back... Nadir-Ma’s ass was pretty hot before, but you can’t imagine a soul failing to notice this glorious bubble-butt now. So big and round and firm... you’d bet good money she could probably carry a full ale stein from one end of a bar to the other by parking it on her butt, no hands needed.", parse);
			Text.NL();
			Text.Add("<i>“I do like big butts, and having one of my own only makes things all the sweeter.”</i>", parse);
			Text.NL();
			Text.Add("A good thing she likes it, because... well, it’s not the only part of her that seems to have gotten a little fluffier.", parse);
			Text.NL();
			Text.Add("<i>“Really? Elaborate, bitch.”</i>", parse);
			Text.NL();
			Text.Add("Well, she used to be trim and toned - not a bodybuilder, but still sort of femininely buff. Now, she looks... softer. There’s no hint of that “I work out a lot” leanness to her frame now; it’s all delicate, womanly curves.", parse);
			Text.NL();
			Text.Add("Nadir-Ma laughs at your remark. <i>“Oh, my little bitch, you crack me up. Take a look at this.”</i> She flexes her arm. <i>“You should feel it, looks can be deceiving. Even if I look all soft and cuddly, don’t you dare doubt my fury when I’m denied what I want.”</i>", parse);
			Text.NL();
			Text.Add("You certainly don’t doubt that. Sneaking one last look in the mirror, you study the voluptuous doberherm’s loins, before metaphorically shrugging your shoulders. You’re pretty sure she hasn’t lost anything down there with this sudden upsurge of femininity, but you don’t think she’s really grown any there, either.", parse);
			Text.NL();
			Text.Add("<i>“I guess so, but that doesn’t matter. Having a big dick is good and all, but how you use it is also important.”</i>", parse);
			Text.NL();
			Text.Add("Well, you doubt there’s any man or otherwise alive who can use their dick the way she can.", parse);
		}
		Text.NL();
		Text.Add("<i>“Well, I guess we’ve seen enough. Think it’s time to see how the outside world fares, right sister?”</i>", parse);
		Text.NL();
		Text.Add("Confusion wells within you; she can’t be talking to you, surely? As you puzzle it over, you realize you can feel something else in this strange limbo-state you now exist in. Something soft and fluffy brushing against you - teasingly, enough to let you feel it, but not enough to get a clear grip on what it is.", parse);
		Text.NL();
		Text.Add("<i>“Yes, I agree. Maybe we’ll find more worshippers and get them to build our temple again,”</i> the ‘sister’ says.", parse);
		Text.NL();
		Text.Add("Nadir-Ma chuckles. <i>“Yes, yes. I’ll let you handle that, sis. Switch with me.”</i>", parse);
		Text.NL();
		parse["monstrous"] = werewolf ? " monstrous" : "";
		Text.Add("Darkness takes you as Nadir-Ma covers her eyes. A strange tingling sensation runs through your borrowed senses; somehow, you can <i>feel</i> Nadir-Ma’s[monstrous] cock fading away and being absorbed into her body, leaving her all-female once more.", parse);
		Text.NL();
		Text.Add("Nadir-Ma’s eyes open, and you feel... different. You don’t have the words to describe it, but somehow, you know that “the sister” has taken over, and that Nadir-Ma - at least, the Nadir-Ma who brought you inside - has retreated into the limbo in which you dwell. You can feel her... a bit <i>too</i> well, actually. It’s like she’s surrounding you, wrapping you in silken coils, embracing your every inch...", parse);
		Text.NL();
		Text.Add("It’s a strange feeling...", parse);
		Text.NL();
		Text.Add("<i>“Call me if someone gets any bright ideas, till then, I’ll be inside bitch,”</i> Nadir-Ma says.", parse);
		Text.NL();
		Text.Add("<i>“Of course, sis,”</i> the sister replies, grinning.", parse);
		Text.NL();
		Text.Add("‘Inside’ of you? What in the world is that supposed to mean?", parse);
		Text.NL();
		Text.Add("Before you have finished the thought, you get your answer. It’s like... there are no words to describe accurately what’s happening to you. You can feel the breeze on Nadir-Ma’s fur, the stone under her feet, her fingers leisurely exploring her newly improved body. But you can also feel her arms wrapped around you, her hot breath on the back of your neck... her cock sliding effortlessly inside of you, filling you as she starts to pump away with all of her previous enthusiasm and then some.", parse);
		Text.NL();
		Text.Add("Your thoughts are getting so cloudy; all you can think of is how good this feels, all you can feel is Nadir-Ma as she fucks you. ‘Sister’ and body fade away into nothingness; there is just the endless darkness, the huge cock inside you, and the endless hunger of the woman splitting you on it...", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			HalloweenScenes.WakingUp(true);
		});
	});
}

HalloweenScenes.HarthonFirst = function() {
	var werewolf = HalloweenScenes.HW.Werewolf();
	
	var parse = {
		playername : player.name,
		skin : function() { return player.SkinDesc(); },
		feet : function() { return player.FeetDesc(); }
	};
	
	var first = !(HalloweenScenes.HW.harthon & Halloween.Harthon.Met);
	HalloweenScenes.HW.harthon |= Halloween.Harthon.Met;
	
	Text.Clear();
	Text.Add("You approach the large, black-wooded coffin and look it over. This is some quality construction, though fairly unadorned; there’s a small emblem of a fox rampant before a moon towards the coffin’s head, but apart from that, it’s undecorated. This close to it, the feeling of unease is stronger than ever, nervousness making your guts churn.", parse);
	Text.NL();
	Text.Add("You tell yourself to calm down; it’s just a coffin, and clearly from someone who was pretty rich. There might be something of value inside. Nerves suitably steeled, you grab the rim of the lid and start to push...", parse);
	Text.NL();
	Text.Add("The <b>crash</b> of wood on stone as the lid falls to the floor is almost deafening as it echoes throughout the mausoleum. The cacophony makes you wince instinctively; that sounded loud enough to wake the dead!", parse);
	Text.NL();
	Text.Add("<i>“Wretch!”</i>", parse);
	Text.NL();
	Text.Add("You jump in place - what the hell was that?!", parse);
	Text.NL();
	Text.Add("<i>“How darest thou defile the place of my resting! Hast thine parents taught thou no manners!?”</i>", parse);
	Text.NL();
	Text.Add("A chill wind suddenly howls through the chamber, shivers racing down your spine as you instinctively hug yourself for warmth. Frail wisps of vapor start to rise from the open coffin, spilling down its sides and seeping across the floor. More and more mist pours from its depths, until your [feet] are lost in the sea of thick fumes, which rise to the ceiling and greedily swallow the light.", parse);
	Text.NL();
	Text.Add("Panicked, you back away from the coffin as quickly as possible. It’s hard, though, because you can scarcely see your hand in front of your face at this point.", parse);
	Text.NL();
	Text.Add("<i>“Very well, I shall have to teach thee a lesson!”</i>", parse);
	Text.NL();
	Text.Add("You take another step backwards - only to feel something press against your back. With a start, you leap forward, spinning in place to try and see who - or what - you bumped into. The wind howls around you again, whipping the mist into a frenzy before vanishing as swiftly as it came - and taking the vapors with it. Now you can see again - and see who it was you bumped into.", parse);
	Text.NL();
	if(terry.Recruited()) {
		parse["ch"] = terry.Changed() ? " At least, he’s the spitting image of Terry’s original form." : "";
		Text.Add("It’s... Terry?[ch] The somewhat effeminate golden-furred fox is dressed in a dapper three-piece suit, offset by a long, elegant cape; black on the exterior, but with flashes of a sanguine interior. His upper canines have elongated; even when his mouth is closed, you can see them framing the sides of his muzzle.", parse);
	}
	else {
		Text.Add("It’s some sort of anthropomorphic fox. Handsome, if a little effeminate, with piercing blue eyes, elegantly groomed crimson hair, and golden fur. He’s dressed fit for a nobleman in an expertly tailored three-piece suit, with a long black cape draped over his shoulders. He seems to have a bit of an overbite, though; even here and now, you can see his long upper canines peeking out between his lips.", parse);
	}
	Text.NL();
	Text.Add("<i>“What is thy name, mortal wretch?”</i> he asks in a commanding tone.", parse);
	Text.NL();
	Text.Add("You are [playername] - <i>who</i> is he?", parse);
	Text.NL();
	Text.Add("<i>“I am Lord Terraphilius Harthon the First, but you can call me Master,”</i> he adds with a sinister grin.", parse);
	Text.NL();
	Text.Add("All of a sudden, the fox’s eyes begin to glow with a deep, bloody red light. It strikes your brain with all the subtlety of a brick, slamming into your eyes and making you stagger with the sheer force of will that you feel emanating from the vulpine monster. The world flickers at the edge of your vision, your thoughts begin to feel hazy…", parse);
	Text.Flush();
	
	//[Fight!] [Submit!] [Flee!] [Use garlic!]
	var options = new Array();
	options.push({ nameStr : "Fight!",
		tooltip : "You aren’t going to let some crazy fox make a slave out of you!",
		func : function() {
			Text.Clear();
			if(werewolf) {
				Text.Add("You throw your head back and howl like the beast you are before springing forward, swiping your claws at the vampiric vulpine.", parse);
				Text.NL();
				Text.Add("Lord Harthon isn’t amused, and easily dodges every single swipe of your claws. Eventually, he tires of your struggle and grabs your wrist, twisting it painfully as he forces you onto your knees.", parse);
				Text.NL();
				Text.Add("<i>“Thou art no more than a savage beast. There is no elegance, no discipline in the way you fight. Cease this fruitless struggle now and become mine!”</i> he cries, releasing you and grabbing you by the ears, pulling you so you’re looking straight into his red eyes.", parse);
			}
			else {
				Text.Add("With your fiercest battle cry, you lash out with your fists in an attempt to drive back the revealed vampire.", parse);
				Text.NL();
				Text.Add("Lord Harthon easily sidesteps you and grabs your arms, forcing you to halt midswing. You can’t help but let out a hiss of pain as long, slender fingers lock around your wrists like iron shackles; no matter how hard you tug, you can’t pull free. Without the slightest effort, he squeezes until you can feel your <i>bones</i> grinding together, the pain forcing you to the ground.", parse);
				Text.NL();
				Text.Add("<i>“Cease this pointless struggle; you are as good as mine!”</i> he says with a predatory grin, releasing you and grabbing you by the sides of your head as he forces you to look straight into his eyes.", parse);
			}
			Text.NL();
			Text.Add("The vampire’s burning crimson gaze fills your world, your vision swimming as it sears into your skull. Your thoughts blur, running like melting candle-wax... you try to fight it, but you can’t stop it... and soon, you don’t know why you are trying to fight it.", parse);
			Text.NL();
			HalloweenScenes.HarthonBadend();
		}, enabled : true
	});
	options.push({ nameStr : "Submit!",
		tooltip : "Yes, give in, serve him...",
		func : function() {
			Text.Clear();
			Text.Add("A smile of purest ignorant bliss washes across your face as you give yourself over to your Master’s will. You can feel your thoughts blurring, a wonderfully soft fog creeping over your mind, drowning out everything but the need to obey your Master...", parse);
			Text.NL();
			HalloweenScenes.HarthonBadend();
		}, enabled : true
	});
	options.push({ nameStr : "Flee!",
		tooltip : "Time to run for it!",
		func : function() {
			Text.Clear();
			parse["w"] = werewolf ? ", dropping to all fours for an extra burst of speed" : "";
			Text.Add("With a shake of your head, you spin around and bolt for the stairway out of this forsaken place[w].", parse);
			Text.NL();
			
			//#code note: There’s a random chance you’ll fail. Being a werewolf boosts your chance of escaping tho.
			var success = Math.random() < (werewolf ? 0.75 : 0.5);
			
			if(success) {
				Text.Add("As the dark shadows of the mausoleum recede in your wake, a sepulchral laugh follows you, cold and mocking. Lungs bursting with effort, you hurtle up the stairs, narrowly avoiding slipping several times. Only when the cool night air of the cemetery brushes against your [skin] do you dare to skid to a halt, plowing a short trail through the dirt, and look behind you.", parse);
				Text.NL();
				Text.Add("A few mocking tongues of mist dance within the doorway of the mausoleum, but they make no move to follow you, eventually seeping back down into the depths of the earth. It looks like you made a clean getaway... this time.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(Halloween.Loc.Graveyard);
				});
			}
			else {
				Text.Add("But to no avail; there is a blur of motion, and then suddenly, Lord Harthon is in your way. You try to stop, but you are going too fast; you crash bodily into him, but the vampire might as well be a stone wall, leaving you sprawling at his feet.", parse);
				Text.NL();
				Text.Add("Dazed, you can’t defend yourself as he reaches down and grabs your head, iron-solid fingers forcing you to face him and stare into the depths of his eyes... his burning, blood-red eyes. Eyes that you lose yourself in, feeling them drinking your thoughts, swallowing your very soul... you can’t... you don’t want...", parse);
				Text.NL();
				Text.Add("...To leave him.", parse);
				Text.NL();
				HalloweenScenes.HarthonBadend();
			}
		}, enabled : true
	});
	if(party.Inv().QueryNum(Items.Halloween.Garlic)) {
		options.push({ nameStr : "Use garlic!",
			tooltip : "That pack the merchant gave you; it’s your only hope!",
			func : function() {
				Text.Clear();
				Text.Add("With a surge of willpower, and no small amount of desperation, you lunge for the pack that you received from the witch. Plunging your hand inside, fortune smiles as you immediately find the key to your survival. With a triumphant shout, you withdraw the strung-together bulbs of garlic, brandishing the aromatic ornament at the vulpine vampire.", parse);
				Text.NL();
				Text.Add("The vampire recoils, hissing and covering his face as he distances himself. <i>“Wretch! Put that away! Thou hast no idea what thou art doing!”</i>", parse);
				Text.NL();
				Text.Add("Wrong! You know <b>exactly</b> what you’re doing! The haze of the vampire’s eyes has vanished from your mind, letting fresh strength flood your limbs. Determined not to give him a second chance, you advance on him, garlic outstretched.", parse);
				Text.NL();
				Text.Add("<i>“No! Get away!”</i> He swipes at you, cape outstretched, trying to knock the garlic out of your grasp.", parse);
				Text.NL();
				Text.Add("You dodge the vampire’s feeble flailing, continuing to press on until he trips on his own cape, tumbling clumsily onto his backside. Whilst he is stunned, you seize the advantage and lunge forward in turn, slipping the garlic necklace neatly around the vulpine’s neck.", parse);
				Text.NL();
				Text.Add("After all, what better way to ensure he can’t hope to attack you again?", parse);
				Text.NL();
				Text.Add("<i>“Noooooo!”</i> he cries, darkness engulfing him for a moment and then dissipating into thin mist, leaving only the now powerless vampire fox behind.", parse);
				Text.NL();
				Text.Add("You watch the fallen vampire cautiously, his eyes wide and staring at nothing, his tongue lolling from his mouth as he pants desperately.", parse);
				Text.NL();
				Text.Add("<i>“P-please...”</i>", parse);
				Text.NL();
				Text.Add("Surprise washes over you at the desperate tone in the once-proud monster’s voice. Could the garlic really be having so strong an effect on him? ...Not that you’re inclined to take it off of him just yet.", parse);
				Text.NL();
				Text.Add("<i>“I need...”</i>", parse);
				Text.NL();
				Text.Add("He needs... what?", parse);
				Text.NL();
				Text.Add("<i>“Please fuck me!”</i> he begs, moaning in wanton lust as you finally spot his erection tenting his pants.", parse);
				Text.NL();
				Text.Add("...Well, that’s not what you expected. Talk about a turn over. He definitely won’t be bothering you anymore. You could just walk away. Then again, he really seems to <i>need</i> your help; could you really just leave him here, stuck like this? And even if sexing him isn’t to your taste, maybe something else from that pack could help you?", parse);
				Text.Flush();
				
				HalloweenScenes.HarthonDefeatedPrompt();
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.HarthonDefeatedPrompt = function() {
	var werewolf = HalloweenScenes.HW.Werewolf();
	var femHarthon = HalloweenScenes.HW.harthon & Halloween.Harthon.Feminized;
	
	var parse = {
		
	};
	
	parse = HalloweenScenes.HW.HarthonParser(parse);
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	parse = Halloween.CockParser(parse);
	
	//[Sex][Holy Water][Leave]
	var options = new Array();
	options.push({ nameStr : "Sex",
		tooltip : "How could you possibly turn this over? Let’s see if this vampire is the sex god they like to say they are...",
		func : function() {
			Text.Clear();
			
			HalloweenScenes.HW.harthon |= Halloween.Harthon.Thrall;
			
			if(player.FirstCock())
				Text.Add("You recall for a moment that the Elder gave you a “stake” to use on the creatures of the night... then you dismiss it. Looking at the lustful [foxvixen] here, you’d say you have all the “stake” you need at your crotch.", parse);
			else
				Text.Add("Luckily for Harthon that the Elder gave you just the sort of stake [heshe] needs for this. You grab the dildo and carefully fix it into place.", parse);
			Text.NL();
			Text.Add("Harthon can only look up at you and mewl weakly as you approach. ", parse);
			if(werewolf) {
				Text.Add("With your mighty claws, [hisher] elegant suit offers little challenge. So caught up in [hisher] lust is the [foxvixen] that [heshe] doesn’t even protest in the slightest when you reduce [hisher] finery to tattered ribbons. Your tongue lolls between your jaws, ravenously slurping around your lips as you drink in the sight of [himher], naked and exposed. You’re going to enjoy this...", parse);
				if(femHarthon) {
					Text.NL();
					Text.Add("You just need to decide which little hole to ravage.", parse);
				}
			}
			else {
				parse["v"] = femHarthon ? " and newly formed cunt" : "";
				Text.Add("Getting Harthon’s clothes off without disturbing the garlic around [hisher] neck isn’t easy, but fortunately for you, those buttons down [hisher] top come in handy. The once-proud vulpine vampire writhes shamelessly before you, deliberately flaunting [hisher] tight little ass[v].", parse);
				Text.NL();
				Text.Add("This is going to be fun...", parse);
			}
			Text.Flush();
			
			//[Ass] [Pussy]
			var options = new Array();
			if(femHarthon) {
				options.push({ nameStr : "Pussy",
					tooltip : "How could you resist breaking in her new pussy?",
					func : function() {
						Text.Clear();
						if(werewolf)
							Text.Add("Fortunately, you don’t need to worry about undressing in turn. Your fur keeps you modest when you need it, but doesn’t get in the way when you don’t.", parse);
						else
							Text.Add("You quickly shed your clothes, casting them next to Harthon’s own, feeling almost as eager for this as the vampiress herself.", parse);
						Text.NL();
						Text.Add("Reaching down, you pull the supine vampire into your arms, Harthon promptly wrapping her arms around you for support. You carry the vixen to the most comfortable spot you can see and then settle down, draping her across your lap.", parse);
						Text.NL();
						Text.Add("Lady Harthon goes along without protest, all she does is pant and grind against[oneof] your [cocks]. <i>“P-please...”</i>", parse);
						Text.NL();
						Text.Add("Hush, now; you’ll give her what she needs. Your hands close on the vulpine’s perky rear, groping the luscious buttocks as you manhandle her into position.", parse);
						Text.NL();
						if(player.FirstCock())
							Text.Add("You can feel the heat emanating from her puffy netherlips, a faint drizzle of feminine juices already dribbling over your [cockTip] as it slides teasingly against her cunt. She feels soft and wet as you slowly guide yourself inside of her, until you can feel yourself pressing against her hymen.", parse);
						else
							Text.Add("As you sweep your strap-on against the vixen’s new cunt, she moans hungrily and grinds her hips against you, helping you to align the tip of the stake with her hole. Carefully, you start to push inside, trying to avoid popping her cherry too roughly.", parse);
						Text.NL();
						Text.Add("<i>“Go on, I need this,”</i> she pleads with a pout.", parse);
						Text.NL();
						Text.Add("Thus reassured, you push on, sliding inside of Harthon’s pussy until you can feel her membrane tear around your invading shaft. You can feel her tremble, see her biting her lip to keep from crying out at the pain, and you stop to let her adjust. Your arms fold themselves around the newly-deflowered vixen, hugging her and her ample bosom to your chest to offer her what comfort you can.", parse);
						Text.NL();
						Text.Add("Holding onto her like this, something weird happens. For a moment, your vision goes dark and you feel something flow over your body. Initially, you feel dizzy, but right afterward you feel a new surge of energy. It’s as if a new kind of power has taken hold of you, and becomes a part of you. Experimentally, you try focusing it on the vixen currently riding your [cock].", parse);
						Text.NL();
						Text.Add("She locks up, as if her mind had gone blank for an instant, and you feel something change between the two of you. Terraphilius… no… Terry has changed, becoming malleable. Instinctively, you know it. You’ve made her your thrall…", parse);
						Text.NL();
						Text.Add("This was unexpected, but it could be fun too. You’ll have to explore this new power when you can, but for now you have more pressing matters at hand...", parse);
						Text.NL();
						HalloweenScenes.HarthonPitchVag(parse);
					}, enabled : true
				});
			}
			options.push({ nameStr : "Ass",
				tooltip : Text.Parse("That lovely ass of [hishers] is far too tempting to pass up.", parse),
				func : function() {
					Text.Clear();
					if(werewolf) {
						Text.Add("Fortunately, you don’t need to worry about undressing in turn. Your fur keeps you modest when you need it, but doesn’t get in the way when you don’t.", parse);
					}
					else {
						Text.Add("You quickly shed your clothes, casting them next to Harthon’s own, feeling almost as eager for this as the vampire [himher]self.", parse);
					}
					Text.NL();
					Text.Add("Reaching down, you pull the supine vampire into your arms, Harthon promptly wrapping [hisher] arms around you for support. You carry the [foxvixen] to the most comfortable spot you can see and then settle down, draping [himher] across your lap.", parse);
					Text.NL();
					Text.Add("[LordLady] Harthon goes along without protest, all [heshe] does is pant and grind against[oneof] your [cocks]. <i>“P-please...”</i>", parse);
					Text.NL();
					Text.Add("Hush, now; you’ll give [himher] what [heshe] needs. Your hands close on the vulpine’s perky rear, groping the luscious buttocks as you manhandle [himher] into position.", parse);
					Text.NL();
					if(femHarthon)
						Text.Add("The newly-made vixen actually whimpers in protest as your cock drags across the puffy, leaking folds of her new cunt and slides between her thighs to about her asshole. As horny as she is, though, it seems she’s well past the point of caring where she gets fucked, so long as she is.", parse);
					else
						Text.Add("Lost in his lust, the fox can’t even look disgruntled as your [cockTip] slides along his taint to press itself against his virgin hole. Indeed, he actually seems to get even harder at his imminent buggering, pre-cum dripping onto your belly as his cock throbs in anticipation.", parse);
					Text.NL();
					Text.Add("There’s no need to delay; [heshe]’s clearly more than ready for this, and so you slowly lower the [foxvixen] onto your [cock].", parse);
					Text.NL();
					Text.Add("The vampiric [foxvixen] moans in abandon, pushing against you to take in more and more of you. Even though you meet some resistance from [hisher] backdoor, the entry is still easy.", parse);
					Text.NL();
					Text.Add("Pleasantly surprised at this turn of events, you still don’t let it go to your head. You’re going to thoroughly enjoy spearing this former ‘master of the night’ up [hisher] asshole, but there’s no need to be a monster about it.", parse);
					Text.NL();
					parse["mc"] = player.NumCocks() > 1 ? Text.Parse(", even as its ignored sibling[s2] poke[notS2] into [hisher] buttock cleavage", parse) : "";
					Text.Add("With this thought in mind, you keep your pace as slow and gentle as the two of you can tolerate. You continue, coaxing inch after inch inside until [hisher] plush butt is nestling gently in your lap, your cock buried to the very hilt[mc].", parse);
					Text.NL();
					Text.Add("As you penetrate the vampire’s tender backdoor, something weird happens. For a moment, your vision goes dark and you feel something flow over your body. Initially, you feel dizzy, but right afterward you feel a new surge of energy. It’s as if a new kind of power has taken hold of you, and becomes a part of you. Experimentally, you try focusing it on the [foxvixen] currently riding your [cock].", parse);
					Text.NL();
					Text.Add("[HeShe] locks up, as if [hisher] mind had gone blank for an instant, and you feel something change between the two of you. Terraphilius… no… Terry has changed, becoming malleable. Instinctively, you know it. You’ve made [himher] your thrall…", parse);
					Text.NL();
					Text.Add("This was unexpected, but it could be fun too. You’ll have to explore this new power when you can, but for now you have more pressing matters at hand...", parse);
					Text.NL();
					HalloweenScenes.HarthonPitchAnal(parse);
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true
	});
	if(party.Inv().QueryNum(Items.Halloween.HolyWater) &&
		!(HalloweenScenes.HW.harthon & Halloween.Harthon.Feminized)) {
		options.push({ nameStr : "Holy Water",
			tooltip : "If the garlic did this, what might the Holy Water do? Can’t hurt to give it a shot.",
			func : function() {
				Text.Clear();
				Text.Add("Doing your best to ignore the mewling, panting vampire before you, you pull out the Holee Water canteen. No matter how much you look at it, it still looks like a cheap knock-off; does it even hold what it claims to?", parse);
				Text.NL();
				Text.Add("But what can it hurt, right?", parse);
				Text.NL();
				Text.Add("<i>“W-what are you doing?”</i> the panting vampire fox asks.", parse);
				Text.NL();
				Text.Add("As you unscrew the canteen lid, you idly tell him that you’re just getting something that should help him... cool off.", parse);
				Text.NL();
				Text.Add("When Harthon sees the label, his eyes go wide. <i>“You can’t use that on me! Do you have any idea what holy water does to vampires!?”</i> he protests, trying to crawl away in vain.", parse);
				Text.NL();
				Text.Add("No, you don’t know. But let’s find out!", parse);
				Text.NL();
				Text.Add("That said, you close the distance between you and the scrabbling ‘nobleman’ and upend the canteen over his head, dousing him liberally with its contents.", parse);
				Text.NL();
				Text.Add("The vulpine vampire howls in anguish as the water cascades over his fine, feminine features, and barely a second later, he bursts into flames! Ghostly blue fire swirls over him, devouring his form in a heartbeat as it sweeps down his frame from head to toes. The fox-sized inferno flickers for a few seconds, and is then dispersed by a great cloud of steam, forcing you to cover your eyes.", parse);
				Text.NL();
				Text.Add("When the steam has dissipated, you cautiously look back at Lord Harthon... or, more accurately, <i>Lady</i> Harthon. The former fox has transformed into a vixen!", parse);
				Text.NL();
				Text.Add("<i>“Y-you idiot! Look at what you did!”</i> the lord-turned-lady protests. Her voice hasn’t changed much, but then again she was pretty gender-ambiguous before, save for her choice in attire. Speaking of which, that suit of hers seems to be under major strain in containing her newly enlarged bosom.", parse);
				Text.NL();
				Text.Add("You can see what you did just fine; she makes quite the gorgeous vixen.", parse);
				Text.NL();
				Text.Add("<i>“Damn you, mortal! How am I- Ahn!”</i> she moans, interrupted by her own lust. <i>“F-fuck it! I don’t care! Just fuck me, please!”</i>", parse);
				Text.NL();
				Text.Add("As ‘Lady’ Harthon writhes, her legs splayed casually, you can see the crotch of her pants growing damp with arousal. You could put her out of her misery, if you wanted to...", parse);
				
				HalloweenScenes.HW.harthon |= Halloween.Harthon.Feminized;
				party.Inv().RemoveItem(Items.Halloween.HolyWater);
				
				Text.Flush();
				
				HalloweenScenes.HarthonDefeatedPrompt();
			}, enabled : true
		});
	}
	options.push({ nameStr : "Leave",
		tooltip : Text.Parse("...Yeah, like you’re going to fuck a horny vampire. [HeShe]’ll bite you the second [heshe]’s done cumming.", parse),
		func : function() {
			Text.Clear();
			Text.Add("Mind made up, you spin around and make for the stairwell leading out of this dank pit. “Lord” Harthon’s pitiful pleas echoing in your ears as you ascend, until finally they are swallowed by the earth as you step forth into the cemetery once again.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(Halloween.Loc.Graveyard);
			});
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.HarthonPitchAnal = function(parse) {
	var p1cock = player.BiggestCock();
	var femHarthon = HalloweenScenes.HW.harthon & Halloween.Harthon.Feminized;
	
	if(p1cock)
		Text.Add("Your senses are awash in bliss as Terry’s warmth envelops you. [HisHer] hot tunnel squeezes your [cock] in a tight embrace, inundating every inch of your shaft without mercy. Each beat of [hisher] heart makes [hisher] asshole flex, squeezing you gently with a tightness that is just shy of being painful. However, as [heshe] adjusts, [heshe] loosens up just enough to ensure that there is only pleasure at being wrapped inside of [himher].", parse);
	else
		Text.Add("Naturally, you don’t get much out of being buried inside of Terry’s tailhole. Your toy is quite something, but it’s not <i>that</i> realistic.", parse);
	Text.NL();
	Text.Add("Of course, the rest of your senses have plenty to enjoy as well. [HisHer] warm, fuzzy butt cheeks are settled heavily in your lap, [hisher] bushy tail gently brushing your [legs] as it shifts. As [heshe] pants softly, quietly whimpering as [heshe] attempts to adjust to being filled by your cock, you can hear everything that escapes [hisher] mouth.", parse);
	Text.NL();
	Text.Add("You drink in the sight of the [foxvixen]’s face, brow furrowed as [heshe] tries to comprehend the things that you’re making [himher] feel, reveling in the sense of power that it brings you. ", parse);
	if(femHarthon)
		Text.Add("Of course, those beautiful big boobs bouncing with each move she makes are quite an enjoyable sight in their own right. ", parse);
	Text.Add("Still, as pleasant as this is, you think it’d be more fun if Terry would just relax a little...", parse);
	Text.NL();
	Text.Add("Smiling sweetly, you reach up and caress the [foxvixen]’s chin, gently stroking [hisher] muzzle before drawing [himher] down into a kiss. [HisHer] lips are velvety soft and deliciously warm on your own, Terry melting meekly into your embrace.", parse);
	Text.NL();
	Text.Add("You hold [himher] there as long as you can, and then tenderly let [himher] go. Looking [himher] in the eye, you ask if [heshe] is okay, now?", parse);
	Text.NL();
	Text.Add("Terry nods in response, clenching [hisher] butt instinctively to grip your [cock].", parse);
	Text.NL();
	parse["boygirl"] = femHarthon ? "girl" : "boy";
	Text.Add("Good [boygirl]. Now, why doesn’t [heshe] start moving for you? You’ll give [himher] some tips where [heshe] needs them, but you want to see just what [heshe] can do when [heshe] puts [hisher] mind to it.", parse);
	Text.NL();
	Text.Add("[HeShe] doesn’t seem too thrilled by the idea, but doesn’t protest. <i>“Yes, [mastermistress],”</i> [heshe] says as [heshe] begin lifting [himher]self.", parse);
	Text.NL();
	Text.Add("Smiling, you slide your hands across [hisher] form, fingers curling possessively around the lush roundness of [hisher] butt. You don’t interfere with Terry’s ascent; you simply keep them there so you can offer guidance...", parse);
	Text.NL();
	Text.Add("Besides, [hisher] butt is just too irresistible for you to <b>not</b> give it a grope while you can. Mischief twinkles in your eyes as you lasciviously squeeze the perky cheeks you’re caressing.", parse);
	Text.NL();
	Text.Add("Terry shudders, groaning as [heshe] works [hisher] ass on your lap.", parse);
	Text.NL();
	Text.Add("That’s the way; take it easy at first, let [hisher] tunnel get used to being stretched like this. Such a good thrall...", parse);
	Text.NL();
	Text.Add("Terry mewls softly at your words, ", parse);
	if(femHarthon)
		Text.Add("a bead of wetness glinting as it slides between her clenched netherlips,", parse);
	else
		Text.Add("his cock gently poking you as it slips from his sheath,", parse);
	Text.Add(" slowly pumping [hisher] hips as [heshe] rises and falls in your lap. Inch by inch, [heshe] takes your [cock], and then [heshe] gives it back. Slowly, [hisher] thrusts grow faster as [hisher] confidence builds, eyes screwed up tightly in concentration and pleasure.", parse);
	Text.NL();
	Text.Add("That’s your [boygirl]; still, perhaps a little assistance is in order? Just something to boost [hisher] performance some.", parse);
	Text.NL();
	parse["c"] = p1cock ? Text.Parse(", and biting back a shudder as the [foxvixen]’s ass gives your cock a good squeeze", parse) : "";
	Text.Add("Closing your eyes[c], you start to concentrate, reaching down to the power you stole from the former king of the night. It stirs eagerly in the depths of your soul, and you cast strands of power out over your vulpine lover, ensnaring [hisher] luscious butt cheeks in a web of magic.", parse);
	Text.NL();
	Text.Add("Terry’s eyes widen and [heshe] gasps. [HeShe] looks at you, recognizing [hisher] former power now gripping [himher] so tightly.", parse);
	Text.NL();
	Text.Add("You just smile back, warm and comforting, even as you weave your will into Terry’s flesh. [HeShe]’s already nice and tight, but there’s just a few little tweaks you can make here... some lube would be nice...", parse);
	Text.NL();
	parse["c"] = p1cock ? Text.Parse(" soaking into your [cock] and", parse) : "";
	Text.Add("The vampiric [foxvixen] moans as a ripple of pleasure runs through [hisher] anus and spreads throughout [hisher] body. Through [hisher] clenching muscles, you can feel liquid warmth[c] seeping out around [hisher] spread entrance. The scent of female in heat permeates the air, ", parse);
	if(femHarthon)
		Text.Add("even stronger than her natural scent.", parse);
	else
		Text.Add("completely overpowering Terry’s male musk.", parse);
	Text.Add(" You give a few experimental thrusts and find that you can move much better now, the satisfying squelch of flesh on moist flesh only adds to your lust.", parse);
	Text.NL();
	Text.Add("<i>“M-my ass, what did yo- oh!”</i>", parse);
	Text.NL();
	Text.Add("You easily slide back out of Terry’s ass, not bothering to hide the grin on your lips at cutting [himher] off so suddenly. Instead, you gently shush [himher], asking if this doesn’t feel better now.", parse);
	Text.NL();
	Text.Add("<i>“Yes,”</i> [heshe] admits, barely suppressing another moan. <i>“It feels so much better! Ah!”</i>", parse);
	Text.NL();
	Text.Add("You thought it would. [HeShe] feels so much better now. Still, perhaps a dash more control over [hisher] muscles; yes, that would <i>really</i> help things out there...", parse);
	Text.NL();
	Text.Add("<i>“Control?”</i>", parse);
	Text.NL();
	Text.Add("Absently, you nod your head, already stirring Terry’s former power and directing its flow back into [hisher] butt. ", parse);
	if(p1cock)
		Text.Add("You can <b>feel</b> the shudder that races through [himher], a ripple that spreads through every inch of [hisher] clenched asshole like a wave across the shore. Terry’s ass squeezes and flexes with impossible acuity, molding to every ridge, crease and wrinkle of your [cock].", parse);
	else
		Text.Add("Despite the lack of connection to your cock, you can practically feel the way Terry’s ass clenches down on it, almost sucking it free of its bindings as it molds itself around the faux-phallus with impossible flexibility.", parse);
	Text.NL();
	Text.Add("<i>“Hng! Ah! This… Ahn! H-how many more changes are you going to make bef - ah! - before you’re happy!?”</i>", parse);
	Text.NL();
	Text.Add("Oh, you think you’re quite done with changes. Now, does [heshe] think [heshe]’s ready to put all your hard work to good use, hmm?", parse);
	Text.NL();
	Text.Add("Terry wiggles a bit on your lap, clenching and adjusting to the changes you just made to [hisher] body. <i>“Ahn! It feels so much more sensitive...”</i>", parse);
	Text.NL();
	Text.Add("You thought that this would make this a bit more enjoyable for [himher]. What does [heshe] think of seeing how it feels when [heshe] really lets [himher]self go with it?", parse);
	Text.NL();
	Text.Add("<i>“Well… okay, [mastermistress].”</i>", parse);
	Text.NL();
	parse["fake"] = p1cock ? "" : " fake";
	Text.Add("With closed eyes, the [foxvixen] starts to pump away on your shaft again; slowly, at first, but steadily building up in speed and enthusiasm. [HisHer] jaws fall open soundlessly as [heshe] clenches and releases, milking your[fake] member with rapidly growing expertise. From the way ", parse);
	if(femHarthon)
		Text.Add("her netherlips are steadily drooling female lubricant between their puckered labia, glazed with sexual juices until they glitter,", parse);
	else
		Text.Add("his cock is bouncing in his lap, dribbling pre-cum onto your belly with each flick of ample foxhood,", parse);
	Text.Add(" you can tell that [heshe] finds [hisher] new ass a lot more fun to fuck with.", parse);
	Text.NL();
	if(p1cock) {
		Text.Add("Surrounded by Terry’s magically augmented flesh, you are lost in your own perverse flavor of heaven. Warm, wet walls rhythmically pulse and squeeze, milking your [cock] with inhuman dexterity. Not an inch of your shaft goes untouched, smothered in hot, juicy asshole and caressed utterly.", parse);
		Text.NL();
		Text.Add("You know that you can’t hold out much longer...", parse);
	}
	else {
		Text.Add("Even though your cock is nothing but a toy, you can still feel your heart racing. Watching Terry’s eager plunge into depravity fills you with perverse pride. The feel of [hisher] weight thumping rhythmically into your lap draws you deeper down the abyss of pleasure that your thrall is sinking into.", parse);
		Text.NL();
		Text.Add("And through it all, your ears resound with the squelching, sucking sound of [hisher] juicy tunnel greedily devouring your fake-cock, the perverse noises stoking your own desire to the boiling point.", parse);
		Text.NL();
		Text.Add("If Terry cums, you’re certain that you will follow in short order...", parse);
	}
	Text.NL();
	Text.Add("Terry [himher]self looks just about to pop. [HeShe] has a distant look in [hisher] eyes, tongue lolling out as [heshe] pants in lust, [hisher] hips quiver as [heshe] moves erratically on your shaft.", parse);
	Text.NL();
	Text.Add("Yes, that’s it, cum!", parse);
	Text.NL();
	
	var cleanup = false;
	
	Text.Add("The former lord of the night cries out a shrill cry ", parse);
	if(femHarthon) {
		Text.Add("fitting of the vixen he’s become.", parse);
		Text.NL();
		Text.Add("Her boobs bounce hypnotically on her chest as she quakes in your lap. Her glistening netherlips spray their honey with abandon, thick ropes of glistening goo raining down into your lap as they spatter on her thighs, matting the fur there with thick streamers. The scent of sex fills the air, enveloping you like a thick fog.", parse);
	}
	else {
		Text.Add("fit for a female.", parse);
		Text.NL();
		Text.Add("His aching cock explodes into a fountain of cum, great ropes of semen erupting from its tip. The off-white jets of thick, sticky fox-seed sprays freely; some spatter across the once-proud vampire’s belly, but the bulk of it hits you.", parse);
		Text.NL();
		Text.Add("Liquid heat washes across you as Terry’s cum paints your [breasts], oozing freely down your body as it ", parse);
		if(player.HasFur())
			Text.Add("mats your fur into a thick tangle of sex-scented knots.", parse);
		else
			Text.Add("paints intricate patterns across your [skin].", parse);
		Text.NL();
		Text.Add("Thoroughly drenched with your lover’s cum, the scent of his ecstasy fills your nostrils, drowning your brain in a boiling fog of sex-scented mist.", parse);
		
		cleanup = true;
	}
	Text.NL();
	Text.Add("With such a sight before you, the sounds of Terry’s bliss in your ears, the scent of [himher] filling your nose, it’s no wonder that your self-control fails. ", parse);
	if(p1cock) {
		parse["c"] = player.NumCocks() > 1 ? Text.Parse(" even as your other neglected cock[s2] spray[notS2] seed onto [hisher] generous ass", parse) : "";
		Text.Add("Your [cock] explodes inside of [himher], thick jets rushing into [hisher] overstuffed colon[c].", parse);
		Text.NL();
		Text.Add("Clinging to your lover for support, your world fades away to the feel of [himher] wrapped around your dick, greedily milking you dry and ensuring that [heshe] swallows up every last drop you have to give [himher]. And you are feeling in quite a generous mood...", parse);
	}
	else {
		Text.Add("Your own neglected [vag] clenches hard, envious of the delicious toy invading your lover’s tailhole. Spurts of female honey gush over your [thighs], sliding wetly down your [legs] as you instinctively buck into Terry’s ass.", parse);
	}
	Text.NL();
	Text.Add("Inevitably, your body runs dry, leaving you struggling to catch your breath as the wave of orgasm recedes and warm afterglow takes its place. You absently cradle the similarly drained Terry in your arms, and the sound of [hisher] quiet panting brings a smile to your lips. Playfully, you note that Terry’s quite the little buttslut, with a bit of encouragement; such a mess [heshe]’s made.", parse);
	Text.NL();
	Text.Add("[HeShe] laughs softly. <i>“Sorry, [mastermistress], but it’s all your fault.”</i>", parse);
	Text.NL();
	Text.Add("You take pride in that fact; it’s quite flattering to see [himher] getting off so hard for you. But still, that doesn’t change the fact that [heshe]’s gotten you all dirty. Now, [heshe]’s going to be a good little [boygirl] and clean you up, isn’t [heshe]?", parse);
	Text.NL();
	Text.Add("<i>“I guess I have to,”</i> [heshe] says, sighing softly.", parse);
	Text.NL();
	Text.Add("With an understanding smile, you gently capture [hisher] chin and draw [himher] into a soft kiss. You hold [himher] for several long, pleasant moments, and then slowly release [himher], still smiling. Such a good [boygirl]; [heshe] really knows how to make you happy.", parse);
	Text.NL();
	Text.Add("Terry smiles back. <i>“Thank you, [mastermistress]. Maybe this won’t be so bad...”</i> Having said that, the [foxvixen] begins picking [himher]self up.", parse);
	Text.NL();
	if(p1cock && p1cock.Knot()) {
		Text.Add("You can feel [himher] tugging as [heshe] tries to pull free of your swollen knot. [HisHer] face contorts as [heshe] pulls with all [hisher] might, forcing you to pull away in turn lest [heshe] simply drag you along the ground, but finally the two of you manage to pull free.", parse);
		Text.NL();
		Text.Add("No sooner has your sodden knot wetly popped from the [foxvixen]’s butt than a great cascade of white escapes from [hisher] well-used ass. The sudden combination of popping and froth puts you in mind of someone uncorking a bottle of champagne, and you hide the smirk that mental image gives you.", parse);
	}
	else {
		Text.Add("With a soft groan, Terry’s butt slides free of your dripping dick, a glistening strand of cum linking your glans to [hisher] gaping hole. With your plug removed, streamers of white begin to flow from the [foxvixen]’s ass without mercy; despite [hisher] efforts to contain it all, it seeps down over [hisher] thighs and softly speckles your lap.", parse);
		Text.NL();
		Text.Add("No matter. [HeShe] was just about to clean you up, after all. Besides, it’s quite gratifying to see such... visual proof of how well you fucked [himher].", parse);
	}
	Text.NL();
	Text.Add("Terry takes a moment to rub [hisher] sore rump and assess the damage.", parse);
	if(cleanup) {
		Text.Add(" He sighs once he sees that you’re completely plastered with his seed, but then he steels himself and crawls over you.", parse);
		Text.NL();
		Text.Add("His first target is your [breasts], he starts by softly lapping your nipples before moving to the area around. ", parse);
		if(player.FirstBreastRow().Size() >= 2)
			Text.Add("From your vantage point, you can see the fox has a smile on his face; it seems he enjoys licking your breasts, not that you’re complaining. Terry’s dexterous tongue finds and cleans every bit of his spent seed easily enough, though you’re not sure your teats needed a second pass.", parse);
		else
			Text.Add("The fox doesn’t take too long to clean up every little trace of his cum, his dexterous tongue easily laps everything in a few passes.", parse);
		Text.NL();
		Text.Add("Next, he moves to your belly, gently licking the area around your navel before sticking his tongue into your belly-button. It tickles, and he seems to enjoy your reaction, but he doesn’t tease you for long before he gets up and looks at his last task.", parse);
	}
	Text.NL();
	Text.Add("[HeShe] looks at your [cock], covered in a mixture of anal juices and cum. You can see [hisher] nose flaring as [heshe] smells the musk. It’s too dark to see, but you bet [heshe]’s blushing under [hisher] fur.", parse);
	Text.NL();
	Text.Add("Smiling warmly, you adjust your [legs] slightly to make your cock more accessible and then gesture towards it in invitation. It’s not going to clean itself up, after all.", parse);
	Text.NL();
	Text.Add("This springs Terry into action. [HeShe] kneels before you, leaning over to gently lick your [cockTip].", parse);
	Text.NL();
	Text.Add("That’s a good [boygirl]. You watch as Terry slowly licks [hisher] way down your cock, rising back to the top only to open [hisher] mouth and swallow your length.", parse);
	Text.NL();
	Text.Add("Though initially reluctant, Terry eases [himher]self into a nice rhythm in no time.", parse);
	Text.NL();
	if(p1cock)
		Text.Add("You can feel the warm wetness of Terry’s mouth gently pulsing around your [cock]; not enough to really get you hard again, but enough to feel good on your sensitive cock. A hint of stiffness creeps back into your maleness, but that’s as far as it goes as the [foxvixen] carefully sucks you clean.", parse);
	else
		Text.Add("You watch Terry fellating your toy with a smile; from a once-proud king of the night to this. Quite a fall. But you’re not gauche enough to rub it in Terry’s face; you just enjoy the gentle ego-stroking as [heshe] gulps and slurps [hisher] way back and forth along your fake dick.", parse);
	Text.NL();
	Text.Add("Eventually, you figure Terry’s had enough, and gently tell [himher] that [heshe] can stop now.", parse);
	Text.NL();
	Text.Add("The [foxvixen] stops, wiping [hisher] mouth with the back of [hisher] arm. <i>“Is this enough, [mastermistress]?”</i>", parse);
	Text.NL();
	Text.Add("You purse your lips, feigning contemplation as you study the glistening [cock] in your lap, admiring the sheen of light on its newly-sucked length. You hold your peace for a few moments, giving Terry the chance to sweat a little, and then smile contentedly as you announce your satisfaction. If [heshe] wants to, [heshe] can leave now.", parse);
	Text.NL();
	var pregStage = HalloweenScenes.HW.harthonPreg;
	parse["p"] = pregStage >= 5 ? " and your daughter" : "";
	Text.Add("<i>“Yes, [mastermistress],”</i> Terry says, bowing slightly before moving to pick up [hisher] things[p].", parse);
	Text.NL();
	Text.Add("Before the limping [foxvixen] can get out of reach, you playfully pet [hisher] delicious, cum-dribbling ass. Mischievously, you muse aloud that you hate to see [himher] go, but you <b>love</b> to watch [himher] leave!", parse);
	Text.NL();
	Text.Add("<i>“Umm… thank you?”</i>", parse);
	Text.NL();
	
	var outside = party.location != Halloween.Loc.Mausoleum;
	parse["outside"] = outside ? "into the bushes" : "outside";
	parse["outside2"] = outside ? " above you" : "";
	Text.Add("You smile and brush it away, wishing your vulpine lover well. Terry nods softly and resumes what [heshe] was doing before you interrupted [himher]. Suitably equipped, [heshe] steps [outside] to transform into a bat. Once the flying fox has wended [hisher] way into the eternal night[outside2], you pick yourself up, dust yourself off, and set off on your own.", parse);
	Text.Flush();
	Gui.NextPrompt();
}

HalloweenScenes.HarthonPitchVag = function(parse) {
	var p1cock = player.BiggestCock();
	var werewolf = HalloweenScenes.HW.Werewolf();
	
	//Impregnate
	if(p1cock) {
		if(HalloweenScenes.HW.harthonPreg < 1)
			HalloweenScenes.HW.harthonPreg = 1;
	}
	
	Text.Add("Terry takes a small moment to feel your [cock] deeply embedded inside her, then begins moving her hips, up and down, grind a little bit, then repeat. She keeps a steady pace, moaning each time your rod scrapes her vaginal walls.", parse);
	Text.NL();
	Text.Add("You start to answer her movements in kind, your [hips] steadily thrusting back into hers. You can feel the weight of her on your cock, feel it as it slowly works its way deeper into her pussy, and it makes you quiver with desire.", parse);
	Text.NL();
	Text.Add("Your arms tighten around Terry’s back, delightfully squishing her plump D-cups against your own [breasts]. You can feel her nipples, stiff with arousal, rubbing against your own [nips] with each breath either of you take and sending tingles racing across your [skin]. A soft growl of pleasure bubbles from your lips before you hungrily lean in and kiss your beloved thrall.", parse);
	Text.NL();
	parse["k"] = p1cock && p1cock.Knot() ? ", insistently pushing against your rapidly growing knot" : "";
	Text.Add("Terry replies in kind, kissing you back as she grinds her hips against your own[k]. After a short while, she breaks the liplock, panting for air as she clings to you.", parse);
	Text.NL();
	Text.Add("Oh, she likes that, doesn’t she? She likes being stuffed so full of cock, ", parse);
	if(p1cock)
		Text.Add("milking you dry until her belly grows big and round,", parse);
	else
		Text.Add("your fake toy stretching her out like the slut she is,", parse);
	Text.Add(" doesn’t she? Well, you’re happy to give her everything she wants, everything she <b>needs</b>!", parse);
	Text.NL();
	Text.Add("Growling like ", parse);
	if(werewolf)
		Text.Add("the beast that you are,", parse);
	else
		Text.Add("a wild animal,", parse);
	Text.Add(" you squeeze the vixen’s plush ass for all your worth and start to really pound her dripping cunt. Terry mewls and squirms, bucking at the wonderful sensations roaring through her hips, surging up her spine to melt her brain into a mush of pure pleasure.", parse);
	Text.NL();
	if(p1cock) {
		if(p1cock.Knot()) {
			parse["cockRace"] = p1cock.race.qShort();
			Text.Add("You can feel the blood rushing through your knot, making it swell with such urgency you’d swear you can hear your own flesh creaking. The burning need to bury it into Terry’s snatch fills you, building on the tingles racing down your [cockRace] shaft.", parse);
			Text.NL();
			Text.Add("Unable to consider backing down, you force your cock against the vixen’s tight, sodden snatch with all the strength you can muster. Her whines of pain-tinged pleasure fall on deaf ears, for you are lost to your urges. You <i>have</i> to get it inside - you <b>will</b> get it inside!", parse);
			Text.NL();
			Text.Add("Your world fades to a blurred jumble of sensations. Terry’s voice ringing in your ears as her cunt stretches wide around your bloated knot. The tight wetness clamping down around your swollen bulb. Thick, liquid warmth inundating your [cock] as the vixen’s climax washes over your steaming flesh. The sheer bliss as you launch volley after volley of seed into her ripe, fertile depths.", parse);
			Text.NL();
			Text.Add("When you snap back to your senses, you are lying against Terry’s shoulder, supporting her even as she supports you. You both puff heavily for breath, panting even as the comforting warmth of afterglow seeps through your bellies.", parse);
			Text.NL();
			Text.Add("Terry’s breath gusts across your [skin], gently tickling you, but she makes no motion to pull away from you. Looks like she’s too worn out to do anything other but lie in your arms and recover. Not that you’re complaining; you’re pretty spent yourself...", parse);
		}
		else {
			parse["mc"] = player.NumCocks() > 1 ? Text.Parse(", its neglected sibling[s2] responding in kind", parse) : "";
			parse["c"] = p1cock.Volume() > 400 ? ", her belly visibly bulging at the sheer size of your invading dick," : "";
			Text.Add("You can feel the throbbing coming from your [cock][mc], and you know that you can’t hold it off much longer. Growling softly to yourself, you thrust yourself as deeply into Terry’s warm, dripping snatch as you possibly can[c] and allow yourself to erupt inside of her.", parse);
			Text.NL();
			Text.Add("Terry bucks and heaves, arching her back as the sensation of your hot jism splashing around her inner walls sparks her own climax. Her high-pitched howl of pleasure echoes in your ears as her juices gush over your lap, mingling with the seed flowing between her stretched netherlips.", parse);
			Text.NL();
			Text.Add("Lost in the throes of your pleasure, you hold the vixen tightly in your arms, completely oblivious to anything but your need to empty yourself into her warm, welcoming depths.", parse);
			Text.NL();
			Text.Add("Your climax pounds through your brain like a thunderstorm, scattering everything in its wake until finally, inevitably, it blows itself out. Still reeling from the sensations that have wracked your body, you cling absently to Terry for support, the two of you panting for breath, mutually too exhausted to move.", parse);
		}
	}
	else {
		Text.Add("Even though the [cock] you are pounding Terry’s cunt with isn’t attached to you in the fundamental sense, you can still feel your heart pounding and your [vag] squeezing in sympathy. The vixen’s helplessness, the look of pleasure sweeping over her face, scattering all thought in its wake; it’s intoxicating.", parse);
		Text.NL();
		Text.Add("You want to make her cum, good and hard, so she’ll never forget what you did to her. You want to hear her screaming your name, begging for you to use her like the loyal little thrall that she is. And you’re going to get it...", parse);
		Text.NL();
		Text.Add("<i>“M-[mastermistress]!”</i> the vampire vixen cries in-between moans.", parse);
		Text.NL();
		parse["wo"] = player.mfTrue("", "wo");
		Text.Add("Yes, yes, that’s it! Bucking your hips like a [wo]man possessed, you thrust your [cock] in to the very hilt, grinding against the spots that you know from intimate experience work best. Your heart hammers against your ribcage as you pant harshly, feeling your hunger grow.", parse);
		Text.NL();
		Text.Add("<i>“Ahn!”</i> she cries out, draping herself over you as she hugs you as tightly as she can, her small claws digging into your back.", parse);
		Text.NL();
		Text.Add("The sparks as your lover’s nails rake across your [skin] ignites the flame burning within you. Your [vag] squeezes down around a phantasmal member as your whole body shakes with pleasure. Even as your juices gush between your clenched netherlips, Terry’s cry rings out in your ears as she messily cums in your lap, sucking your [cock] as deep inside as she possibly can.", parse);
		Text.NL();
		Text.Add("Holding onto your thrall for dear life, you give yourself over to the waves of pleasure washing through you, shuddering your way through mutual climax. By the time the tide recedes, leaving only the comforting warmth of afterglow in its wake, Terry is limply sprawled in your arms, panting for breath.", parse);
		Text.NL();
		Text.Add("Looks like you wore her out... well, you’ll be nice and let her recover here. It feels kind of nice to have her in your arms like this, anyway.", parse);
	}
	Text.Flush();
	
	var pregStage = HalloweenScenes.HW.harthonPreg;
	
	Gui.NextPrompt(function() {
		Text.Clear();
		parse["k"] = p1cock && p1cock.Knot() ? ", and with your knot now-deflated" : "";
		Text.Add("Eventually, Terry stirs restlessly in your arms, making a feeble effort to climb from your lap. Feeling recovered yourself[k], you slowly guide her to the ground and pull your [cock] free with a wet slurp.", parse);
		Text.NL();
		parse["bloated"] = (pregStage > 0 && pregStage < 5) ? " bloated" : "";
		Text.Add("Hesitantly pushing yourself off the ground, you admire the[bloated] vixen’s supine form and, as best you can, the thick glaze of sexual juices adorning your cock. With great care, you saunter around to Terry’s head, cheerfully noting that it looked like she had quite a lot of fun with that.", parse);
		Text.NL();
		Text.Add("Her only reply is to nod weakly.", parse);
		Text.NL();
		Text.Add("Well, you’re glad that she enjoyed that. You’ll be happy to send her on her way... but first, since she had so much fun making you all messy, she’s going to be a good thrall and clean you up before she goes, isn’t she?", parse);
		Text.NL();
		Text.Add("You gently swing your pelvis, making your [cock] jab lightly in the direction of her face, for emphasis.", parse);
		Text.NL();
		Text.Add("Terry’s quick to catch on, and though she doesn’t seem too thrilled by the idea, she picks herself up and settles on her knees, gently grabbing your [cock] and leaning over to begin lapping at it.", parse);
		Text.NL();
		if(p1cock)
			Text.Add("Though the touch of her tongue on your overheated flesh is enough to send a shiver running down your spine, you can tell that her heart isn’t in this. She’s obedient enough, but clearly not enjoying this as much as you hoped she would.", parse);
		else
			Text.Add("Though she doesn’t hesitate to follow your orders, it’s plain to see that she’s not enjoying herself at all. Her licks are short and perfunctory, not so crass as to blatantly try and get it over and done with, but clearly done without any real care.", parse);
		Text.NL();
		Text.Add("Well, you can’t be having that. A thrall should enjoy servicing her [mastermistress]...", parse);
		Text.NL();
		Text.Add("Without a second thought, you reach within for the dark power that you claimed from the former lord of the night. It stirs eagerly to your call, and you gently cast it out over your vulpine thrall. Terry stiffens, eyes going wide, ears pricking up and fur bristling as you bathe her in the power of your will.", parse);
		Text.NL();
		Text.Add("You can <b>feel</b> her hesitancy melting away, her lust igniting like a roaring inferno that consumes her very being. She wants the juices smeared across your [cock] - she <b>needs</b> them, if she’s going to quench the hunger gnawing at her.", parse);
		Text.NL();
		Text.Add("Watching the vixen twitch and shiver, hungrily licking her lips as she stares fixedly at your loins, you allow the power to recede from her.", parse);
		if(pregStage == 1)
			Text.Add(" Before you leave her, though, something makes you pause for a moment - a strange little spark that seems to be emanating from Terry’s belly. Inquisitively, you let a tendril of power brush against her, and what you find brings a brief smile to your lips. Seems your lovemaking has borne fruit; your seed has taken root inside of the vixen’s womb.", parse);
		Text.NL();
		Text.Add("After your little <i>readjustment,</i> Terry becomes much more enthusiastic, lapping and sucking on your cock like a baby on a teat. She moves her tongue expertly to service the underside of your [cock], moaning in pleasure as she takes you as far as she can.", parse);
		Text.NL();
		Text.Add("You moan softly, praising Terry on her efforts. Such a good little vixen; she’ll have you all cleaned up in no time, won’t she?", parse);
		Text.NL();
		Text.Add("A muffled grunt of assent - at least, you take it as such - is all the answer you get as Terry busily gobbles down your dick. ", parse);
		if(p1cock) {
			Text.Add("A fresh wave of pleasure assaults your senses as she all but inhales your sensitive flesh. You can feel yourself starting to harden in her mouth as she molests you, and if you don’t stop her soon, she’s going to be getting a proper taste of you.", parse);
			Text.NL();
			Text.Add("Though, really, is there any reason not to let her quench her thirst on your cum? You’re not that pressed for time, are you?", parse);
			Text.Flush();
			
			//[Let her] [Stop her]
			var options = new Array();
			options.push({ nameStr : "Let her",
				tooltip : "Why not let her enjoy herself? Might make her more eager the next time.",
				func : function() {
					Text.Clear();
					Text.Add("Moaning softly, you close your eyes and happily bask in Terry’s efforts. Mmm, she’s quite a good little cock-sucker; but then, what more would you expect of a slutty little ex-vampire, hmm? Pleasure washes over you, and all too soon you are emptying a second dose of your seed into Terry’s greedy mouth, the vixen avidly sucking down every last drop.", parse);
					Text.NL();
					Text.Add("Opening your eyes, you sigh in pleasure as you tenderly draw your now-flaccid cock from Terry’s gently suckling lips. As your [cockTip] smears a last glaze of cum on her lips, you absently reach out and lift the haze that you draped across her mind, restoring her to her senses.", parse);
					Text.NL();
					Text.Add("For a moment, the vampire vixen seems disoriented, but after shaking her head, she recovers. Noticing the last smear of cum on her lips, she wipes it with a finger then looks up at you. <i>“Are you satisfied, [mastermistress]?”</i>", parse);
					Text.NL();
					Text.Add("Very much so. She’s quite a skilled little cum-sucker; you’re very pleased with her efforts.", parse);
					Text.NL();
					Text.Add("<i>“Thank you, [mastermistress].”</i> She smiles.", parse);
					Text.NL();
					Text.Add("Credit is given where credit is due. You don’t need her for anything else at the moment, so she may leave if she wants.", parse);
					Text.NL();
					Text.Add("<i>“Yes, [mastermistress].”</i> She gets up on her feet and grabs her cloak, putting it on. ", parse);
					if(pregStage >= 5)
						Text.Add("She takes a moment to grab your daughter and rock the baby in her arms before leaving through the bushes.", parse);
					else
						Text.Add("She turns to wave you goodbye and then departs beyond the bushes.", parse);
					Text.NL();
					Text.Add("<i>“Umm… call me again soon, [mastermistress],”</i> she says, before darting away.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true
			});
			options.push({ nameStr : "Stop her",
				tooltip : "You have places to be, it’s time to put an end to this.",
				func : function() {
					HalloweenScenes.HarthonPitchVagStop(parse);
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else {
			Text.Add("Seems you might have used a touch too much power; she’s completely oblivious to the fact that your toy, realistic as it may be, isn’t going to deliver her any of the salty gooey goodness that she’s after.", parse);
			Text.NL();
			Text.Add("Time to snap her out of this...", parse);
			Text.Flush();
			// #goto Stop her
			HalloweenScenes.HarthonPitchVagStop(parse);
		}
		
	});
}

HalloweenScenes.HarthonPitchVagStop = function(parse) {
	Text.Clear();
	Text.Add("Decision made, you sharply pull back from Terry’s thirsty mouth, your spittle-slick [cock] wetly popping free of her pursed lips.", parse);
	Text.NL();
	Text.Add("<i>“Wha- did I do something wrong, [mastermistress]?”</i> she asks in confusion, lapping her lips to get every last trace of your taste.", parse);
	Text.NL();
	Text.Add("You assure her that she did nothing wrong, but you are satisfied with her efforts so far. It’s time for her to stop.", parse);
	Text.NL();
	Text.Add("<i>“Stop? You don’t want me to finish cleaning you up, [mastermistress]? If I did a good job then, can I finish?”</i> she asks, licking her lips.", parse);
	Text.NL();
	Text.Add("You’re quite certain that she’s finished already. There’s no need for her to get carried away here.", parse);
	Text.NL();
	Text.Add("<i>“But-”</i>", parse);
	Text.NL();
	Text.Add("That is <i>enough</i>. She may go now.", parse);
	Text.NL();
	var pregStage = HalloweenScenes.HW.harthonPreg;
	parse["p"] = pregStage >= 5 ? " Then she grabs your daughter, rocking the baby in her arm." : "";
	Text.Add("<i>“I… yes, [mastermistress],”</i> she says, visibly disappointed. She gets up on her feet and collects her cloak, donning it in one smooth move.[p]", parse);
	Text.NL();
	Text.Add("Quietly, you reach out and remove the lingering traces of your dark power from Terry’s mind. Once you have reclaimed it, you thank her for her efforts; you look forward to doing that again some time.", parse);
	Text.NL();
	Text.Add("Terry looks at you and bows once, before hurriedly leaving beyond the bushes.", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}

HalloweenScenes.HarthonBadend = function() {
	var werewolf = HalloweenScenes.HW.Werewolf();
	
	var parse = {
		playername : player.name,
		boygirl : player.mfFem("boy", "girl")
	};
	parse = player.ParserTags(parse);
	
	Text.Add("<i>“Yes, good [boygirl]. Gaze deep into the eyes of thy Master, and surrender thyself completely to my will.”</i>", parse);
	Text.NL();
	Text.Add("You grin brainlessly, content to do just that, absently affirming your Master’s wishes. You could just stay here forever, basking in his beautiful eyes...", parse);
	Text.NL();
	Text.Add("Time fades into a meaningless procession of seconds. You become aware of it only when the light bleeds from Master Harthon’s eyes, restoring them to their wonderful, inviting blueness. His fingers gently release you, and though a flicker of disappointment flashes in your mind, it is drowned by your happiness.", parse);
	Text.NL();
	Text.Add("Smiling broadly, you sketch your most reverent bow, asking how you may be of service to your Master.", parse);
	Text.NL();
	Text.Add("Lord Harthon smiles. <i>“Perhaps thou art not completely lacking in manners, thrall.”</i>", parse);
	Text.NL();
	Text.Add("You thank your Master for his gracious approval.", parse);
	Text.NL();
	Text.Add("<i>“Very well, first thou shalt start by putting my coffin lid back into its rightful place.”</i>", parse);
	Text.NL();
	Text.Add("At once, Master!", parse);
	Text.NL();
	Text.Add("Obediently, you hurry over to the coffin and take hold of the lid. Straining with all your might, you heave it back into place, proud of your efforts as you align its edges just so for Master Harthon.", parse);
	Text.NL();
	parse["v"] = player.FirstVag() ? Text.Parse(" and [vag]", parse) : "";
	if(werewolf) {
		Text.Add("<i>“Thou art naught but a wild beast; it is clear to see from thy lack of trappings.”</i>", parse);
		Text.NL();
		Text.Add("You whimper softly and look down at the floor, ears flattened against your skull at Master Harthon’s disapproval.", parse);
		Text.NL();
		Text.Add("<i>“Nevertheless, we shall see if thou art a loyal dog or merely a mangy mutt. Sit!”</i> he commands.", parse);
		Text.NL();
		Text.Add("You immediately fall to the floor, parking your [butt] obediently on the cool stone and looking up hopefully at him.", parse);
		Text.NL();
		Text.Add("<i>“Good [boygirl],”</i> Master Harthon says, patting you lightly. <i>“Now roll!”</i>", parse);
		Text.NL();
		Text.Add("You yip softly in pleasure at his touch, and then obediently flop over onto your back and roll over, spinning in circles over the floor before finishing with your belly facing up.", parse);
		Text.NL();
		Text.Add("<i>“Good, good. Perhaps thou art a good pet after all. Good pets are deserving of a boon.”</i>", parse);
		Text.NL();
		Text.Add("You let out a pleased chuff at the prospect, your tail wagging enthusiastically.", parse);
		Text.NL();
		Text.Add("<i>“Roll back on all fours and present thyself for me.”</i>", parse);
		Text.NL();
		Text.Add("A soft grunt of desire escapes you as you accept this. At once, you spring back over onto all fours, thrusting your [butt] out for the Master’s appraisal. Silence hangs over you like a shroud for a second, before you realize your mistake. Shifting your weight slightly to better support yourself on just your knees, you reach back with your hands and cup your buttocks, spreading them open so that the Master can observe your [anus][v].", parse);
	}
	else {
		Text.Add("<i>“Thy trappings are hardly becoming of a thrall. Strip!”</i> he commands.", parse);
		Text.NL();
		Text.Add("Without even hesitating to answer him, you immediately start tearing at your costume, hurling it off with abandon until you are naked and exposed as you can possibly get.", parse);
		Text.NL();
		Text.Add("<i>“Thou aren’t so bad looking, thrall. Perhaps I can find a use for one such as thyself...”</i>", parse);
		Text.NL();
		Text.Add("Thank you, Master Harthon. You are honored by his praise.", parse);
		Text.NL();
		Text.Add("<i>“Very good, now present thyself like a good thrall and await thine master’s judgement.”</i>", parse);
		Text.NL();
		Text.Add("You nod obediently, and quickly settle on all fours as best you can before reaching back to spread your [butt] apart, baring your [anus][v] for your master’s approval.", parse);
	}
	Text.NL();
	Text.Add("As you wait there, with your face hanging over the floor, you can hear the faintest whisper of cloth on cloth as your Master slowly undresses. Warmth flushes through your belly, but you are a good thrall and keep your gaze fixed on the stone beneath you - not so fixed that you don’t see when one elegant bare paw steps gracefully into your field of vision.", parse);
	Text.NL();
	Text.Add("Quiet hums greet your ears, and you can just make out the swish of your Master’s tail as he looks you over, before padding daintily away. You can hear him circling you, appraising every inch, and you suck in a breath, hoping that he will like what he sees.", parse);
	if(player.HasTail())
		Text.Add(" Your [tail] wags in nervous excitement, and you can’t hold it back no matter how you try.", parse);
	Text.NL();
	Text.Add("Master Harthon finishes his inspection then puts both hands on your [butt], groping your cheeks in further appraisal. <i>“Yes, this will do fine.”</i>", parse);
	Text.NL();
	Text.Add("You smile proudly, so happy that Master likes you, subtly pushing back so he can fully enjoy your [butt].", parse);
	Text.NL();
	Text.Add("The vampire fox presses his sheath to your back, rubbing it against your butt as his member begins peeking out.", parse);
	Text.NL();
	Text.Add("A shiver runs along your spine, and you moan softly to yourself in lust as you feel the vulpine vampire’s member pressed against your [skin]. With each pass, you can feel him growing, more and more; soft, warm, damp cockflesh passing through your buttock cleavage as he leisurely grinds his hips.", parse);
	Text.NL();
	Text.Add("<i>“How do you like your master’s shaft, thrall?”</i>", parse);
	Text.NL();
	Text.Add("You groan heartily, assuring him that you love it, that it feels so good pressed against you.", parse);
	Text.NL();
	Text.Add("<i>“Perhaps you were hoping for more? You’d like more wouldn’t you, my thrall?”</i>", parse);
	Text.NL();
	Text.Add("Oh... yes, yes, please, Master! You want more - you <b>need</b> more!", parse);
	Text.NL();
	Text.Add("Harthon chuckles. <i>“As expected of a bitch in heat. Thou cannot help but beg for more from your master. Very well, thrall. I shall grant you more, but you’ll have to work for it.”</i>", parse);
	Text.NL();
	parse["facemuzzle"] = werewolf ? "muzzle" : "face";
	Text.Add("So saying, he steps away from your behind and circles around you, stopping just before you. His dainty, graceful feet mere inches from your [facemuzzle].", parse);
	Text.NL();
	Text.Add("Without a thought, you bend down as far as you can and start rapturously kissing your Master’s beautiful, elegant little paws. Your [tongue] lolls over your lips, swiping eagerly over his toes, filling your mouth with the salty prickle of sweat and the unquestionable taste of him.", parse);
	Text.NL();
	Text.Add("<i>“Now is not the time to worship thine master’s feet, thrall. Your attentions are needed elsewhere...”</i>", parse);
	Text.NL();
	Text.Add("You slowly lift your head, sweeping your gaze up Master’s legs until you are level with his cock, which juts invitingly towards you. With a hungry moan, you open your mouth and start to lean forward, anxious to taste him, only for your Master to stop you with a gesture.", parse);
	Text.NL();
	Text.Add("<i>“Not yet, thrall. Thy [hand]s, use thy [hand]s.”</i>", parse);
	Text.NL();
	Text.Add("You nod meekly and immediately let go of your ass to do as instructed. He feels so warm between your fingers, and his flesh is soft as velvet; you can only dream of the pleasure you will feel when it slides up your ass. A shiver washes over you at the thought and you eagerly start to caress your Master’s magnificent maleness. If only it was a little bigger...", parse);
	Text.NL();
	Text.Add("It pulsates in your grip, and you gasp softly in marvel as it grows in your hand. Avidly, you stroke the turgid foxhood, watching in amazement as it begins to stretch and swell, getting longer and harder with each pass.", parse);
	Text.NL();
	Text.Add("Within a few moments, you are holding over a foot of hot, dripping fox-cock in your hands. The smell of it fills your nostrils as pre-cum drools over your fingers, leaving them wonderfully slick and sticky. Ohhh... it smells so good; you want to lick it, to suck it, to feed it down your throat and milk your Master until he fills your belly fit to burst with his wonderful seed... but your Master has commanded you keep your tongue to yourself, and you would <b>never</b> disobey him.", parse);
	Text.NL();
	Text.Add("<i>“That’s quite enough, thrall. I suppose this is big enough to sate thine perverted dreams?”</i>", parse);
	Text.NL();
	Text.Add("Oh, yes, yes Master, this is truly the stuff of dreams.", parse);
	Text.NL();
	Text.Add("<i>“Then back on fours with you; it’s time to make you truly mine.”</i>", parse);
	Text.NL();
	Text.Add("Although you hesitate for a second, torn by the pain of abandoning so wonderful a cock, you obey without qualms. Back on all fours, you eagerly display yourself for Master Harthon, anxious for him to grace you with it.", parse);
	Text.NL();
	Text.Add("The vampiric fox wastes no time, he circles you, grabs your [butt] and immediately rams half his cock up your [anus]. You howl at the sudden penetration despite yourself, gasping out your gratitude to Master for being so generous.", parse);
	Text.NL();
	Text.Add("<i>“Relax,”</i> he says, pulling back in preparation for another thrust.", parse);
	Text.NL();
	Text.Add("You inhale deeply and then exhale, allowing yourself to go limp. You love Master, you trust Master; he will give you only pleasure. Such is your confidence that your body effortlessly complies, and on Master Harthon’s next thrust, you feel him plunge inside until only the bulge of his burgeoning knot keeps his hips from slapping against your [butt].", parse);
	Text.NL();
	Text.Add("As soon as you’ve adjusted to his girth, Harthon begins moving. He batters your puckered hole with his knot each time he thrusts, working your butt as he increases his tempo until he’s a blur.", parse);
	Text.NL();
	Text.Add("The sounds of flesh grinding on flesh echoes in the empty mausoleum, followed by the grunts and moans of a fox and his bitch in the throes of a savage mating. At one point, you feel his grip shift from your butt to your hips, holding you down like a dog as he redoubles his efforts and begins truly pushing to knot you.", parse);
	Text.NL();
	Text.Add("You howl and moan beneath your Master, trying your best to play the part of the vixen in heat for him. The smell of him in your nostrils, the feel of him on your back, inside of you - you <b>need</b> this! You’ve never felt such pure <b>want</b> in your life; you could die happily after this, if it meant never having to go without this bliss again. Pleasure crashes through your body like a tidal wave, shattering the meager barricades of consciousness and sweeping your thoughts along into a deep, dark abyss of desire. There is no room in your head for thought; only the pleasure and the love you feel for him - for your Master.", parse);
	Text.NL();
	Text.Add("After what feels like an eternity, he finally pushes his knot in, howling as he lets his seed flow into your bowels.", parse);
	Text.NL();
	Text.Add("The feel of your Master gifting you with his seed is the final catalyst for you, and your body wracks itself with climax as you cum in turn. Every time you think that you have wrung yourself dry, he blasts forth another spurt of cum, detonating another explosion of pleasure inside of you. Only when your Master finally ends his climax does your own die in its wake.", parse);
	Text.NL();
	Text.Add("Harthon slumps atop you, still holding you tight as he grinds into you, firing off a few more ropes of cum. You can feel his balls, tightly pressed to your [butt], churning with the effort of pumping even more cream into you.", parse);
	Text.NL();
	Text.Add("You sigh in longing, content to lie here; this where you were <b>meant</b> to be. Senses awash in bliss, you don’t register Master Harthon nuzzling your neck until his lips press themselves against the [skin], soft and tender.", parse);
	Text.NL();
	Text.Add("His tongue glides against your neck, lapping with gentle insistence, and you wriggle slightly beneath him to expose yourself, offering him your throat. To be held and mated by your master, then offer him your blood… there’s nothing that could equal the bliss you feel right now.", parse);
	Text.NL();
	Text.Add("<i>“No, thrall.”</i>", parse);
	Text.NL();
	Text.Add("Your heart squeezes in your chest, as if clutched by claws of purest ice. In your despair, you cry out, asking what you have done wrong; why will he not drink from you?", parse);
	Text.NL();
	Text.Add("<i>“You’re too good to eat. I will not drink from you and leave you an empty husk. Instead, I shall keep you with me, forever, as my loyal slave and fucktoy.”</i>", parse);
	Text.NL();
	Text.Add("Your whole body goes stiff as his words sink in. You know that he is wise, loving, and generous, but this... reverently, you ask if he truly means it. Will he keep you forever?", parse);
	Text.NL();
	parse["v"] = player.FirstVag() ? "Y" : "And with a few adjustments, y";
	Text.Add("<i>“A lord needs an heir. [v]ou’ll do just fine.”</i>", parse);
	Text.NL();
	Text.Add("You moan throatily in desire, mind awash in beautiful images of your future. Your fingers brush against your belly, already envisioning it ripe and swollen with Lord Harthon’s child, feeling them kick and squirm impatiently inside you. Blissfully, you vow that you will give him whole litters of children, as many heirs as he could ever want.", parse);
	Text.NL();
	Text.Add("Harthon chuckles, his shaft throbs inside you and you feel another jet fire within you. <i>“I love this reaction of yours, my thrall, but before that, I wish to enjoy your body to its fullest,”</i> he says, tugging to try and pull himself off your used backdoor.", parse);
	Text.NL();
	Text.Add("You gasp and moan as your Master tries to free himself; even though you try to help him escape your depths, his knot is just too big. Each tug sends sparks crackling into your brain, warmth flooding your bowels as another rope of seed erupts inside of you.", parse);
	Text.NL();
	Text.Add("Each pull draws him further and further out of you until finally, he pops free as one final spurt of semen splashes against your gaping ass and trickles down the canyon of your cleavage.", parse);
	Text.NL();
	Text.Add("<i>“Turn around and lick me clean, thrall. Drink deep and become a proper vessel for my seed.”</i>", parse);
	Text.NL();
	Text.Add("Desire throbs inside of you, a sense of unsated <b>need</b> churning in your belly. Clumsy, limbs still weak from his efforts, you shuffle around to face your Master. The sight of his cock, still gloriously hard and smeared in semen, sends a flood of vigor pouring through your veins.", parse);
	Text.NL();
	Text.Add("Revitalized, you lunge forward, gobbling half of his cock in a single mouthful, eyes sinking shut as you start to suckle for all your worth. His taste floods you, cum starting to seep over your tongue and flow into your belly, and it’s still not enough; you need <b>more</b>.", parse);
	Text.NL();
	Text.Add("You lose count of how many hours you spend tending to your Master. He feeds you, then demands you pleasure him, worship him, and you gladly do it with a smile on your face.", parse);
	Text.NL();
	Text.Add("You do everything he asks of you: sitting on his wonderful member, giving him a massage, enjoying his rich taste... Without realizing it, you eventually change into a form more suited to bear his heirs.", parse);
	Text.NL();
	Text.Add("Through his dark power and some help from other sources, you become a beautiful vixen, with rich autumn fur, bountiful breasts, large breedable hips and a luxurious tail which seems made to entice your Master to use you in all the right ways.", parse);
	Text.NL();
	Text.Add("Amidst the wild sex and fervent fucking, you eventually feel it: his seed penetrates your innermost sanctum, impregnating your unworthy eggs with his sacred heirs. And as you notify him of this, he praises you and you feel him redouble his efforts, fucking you with renewed vigor. And you rejoice; you know that you have fulfilled your duty for your Master, but he will never get rid of you. He’ll always keep you as his enthralled bride, ripe, eager to fuck and ready to pop out more heirs.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		HalloweenScenes.WakingUp(true); 
	});
}

Halloween.Loc.Chapel.description = function() {
	var first = !(HalloweenScenes.HW.flags & Halloween.Flags.Chapel);
	HalloweenScenes.HW.flags |= Halloween.Flags.Chapel;
	
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

//#Shows up simply as “Thrall” in Beaten Path, and that’s about the only location you may call Harthon until we expand on the halloween world.
HalloweenScenes.HarthonThrall = function() {
	var werewolf = HalloweenScenes.HW.Werewolf();
	var femHarthon = HalloweenScenes.HW.harthon & Halloween.Harthon.Feminized;
	
	var parse = {
		phisher : player.mfTrue("his", "her")
	};
	parse = HalloweenScenes.HW.HarthonParser(parse);
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	parse = Halloween.CockParser(parse);
	
	Text.Clear();
	if(werewolf)
		Text.Add("You inhale slowly and purposefully, filling your lungs and then letting your commanding howl split the cool night air. Your cry echoes into the darkness, a mighty alpha’s summons to [phisher] loyal thrall.", parse);
	else
		Text.Add("You stop and close your eyes, focusing on the dark power you got from the former [LordLady] Harthon. Through it, you can feel your connection to your thrall, and you call out to [himher] in the night; a silent whisper meant only for [hisher] ears.", parse);
	Text.NL();
	Text.Add("It takes a few moments, but sure enough you hear the flapping wings of a bat; it lands nearby and right afterwards, you see the bushes rustle and out of them emerges your thrall, Terry.", parse);
	Text.NL();
	if(femHarthon) {
		Text.Add("The former fox has adapted quite well to her new lot in life. She carries herself proudly, totally unabashed in the beautifully feminine form she exposes to you, naked save for the cape that trails down her back. Full, heavy D-cup breasts rise and fall on her chest as she breathes, the pink pearl of her womanhood peeking into visibility when she shifts her thighs. Her long, bushy tail gently sweeps through the air behind her, a leisurely wagging motion as she takes in the sight of you.", parse);
		
		var pregStage = HalloweenScenes.HW.harthonPreg;
		if(pregStage > 0)
			Text.NL();

		if(pregStage >= 5)
			Text.Add("She practically glows with maternal beauty, a lovingly proud smile writ across her features as she gazes down on the little bundle of black-and-red fluff in her arms. Your daughter coos softly, clumsily rooting for one of her mother’s nipples and greedily starting to suckle, her little tail wagging as she drinks her fill.", parse);
		else if(pregStage >= 4)
			Text.Add("Her white-furred belly has swollen out hugely, a great gravid orb that sits heavily on her hips; only her lingering vampiric strength keeps her from the typical pregnant waddle. You can see the taut flesh deform as your unborn kit stretches inside of her, the proud vampiress grinning at you as she rubs the spot where it kicked.", parse);
		else if(pregStage >= 3)
			Text.Add("The vixen’s belly is round and full now, swelling steadily with child, your seed having unquestionably taken root inside of her. The former fox seems to have taken to motherhood with great aplomb, smiling sweetly as she gently pats her growing bump.", parse);
		else if(pregStage >= 2)
			Text.Add("The once svelte vixen is now sporting quite a blatant potbelly, obvious at a glance to anyone who looks her way. She seems completely unconcerned by it, and indeed seems to flaunt it almost as readily as she does her lovely breasts.", parse);
		else if(pregStage >= 1)
			Text.Add("The first signs of your seed taking root have become apparent, the vixen’s trim belly now visibly paunched as her womb starts to fill with life. It’s small and subtle, for now, but you know that it will grow with time.", parse);
	}
	else {
		Text.Add("Even though he’s naked, save for the cape gently swishing behind him, the former lord still carries himself proudly. Indeed, he flaunts his nakedness, letting the shadows glide sensuously across his graceful, almost girlishly beautiful frame, dappling at the dainty but virile maleness between his loins. He may be bound to you, now, but you can still see the remnants of the seductive predator of the night he once was.", parse);
	}
	Text.NL();
	Text.Add("<i>“You called, [mastermistress]?”</i>", parse);
	Text.NL();
	Text.Add("You most certainly did, and you are glad that [heshe] responded so quickly.", parse);
	Text.NL();
	
	var first = !(HalloweenScenes.HW.harthon & Halloween.Harthon.ThrallCalled);
	
	if(first) {
		HalloweenScenes.HW.harthon |= Halloween.Harthon.ThrallCalled;
		Text.Add("You can’t help but give the vampire [foxvixen] a once-over, studying the way the moonlight hits [hisher] fur.", parse);
		Text.NL();
		Text.Add("<i>“What?”</i>", parse);
		Text.NL();
		Text.Add("You hasten to assure [himher] that it’s nothing. It’s just... well, you were expecting something more.", parse);
		Text.NL();
		Text.Add("<i>“Something more? What do you mean?”</i>", parse);
		Text.NL();
		Text.Add("You’re not sure… Maybe you were expecting [heshe]’d sparkle in the light or something.", parse);
		Text.NL();
		Text.Add("Terry sighs. <i>“With all due respect, [mastermistress], but that’s just retarded. Vampires are creatures of the night, why the hell would we sparkle?”</i> [heshe] asks indignantly.", parse);
		Text.NL();
		Text.Add("Well, [heshe] <i>does</i> have fur like marble and gold... but, on reflection, that is kind of a stupid image. You apologize for thinking of it.", parse);
		Text.NL();
		Text.Add("<i>“I-it’s alright. For your information, I do take care of my fur. I only use top of line fur care products, and I’m very proud of how soft and silky it feels,”</i> [heshe] says, puffing [hisher] chest out.", parse);
		Text.NL();
		Text.Add("[HeShe] has every right to be proud; [heshe]’s so sleek and shiny looking. And certainly lots of fun to cuddle, too.", parse);
	}
	
	var pregStage = HalloweenScenes.HW.harthonPreg;
	if(pregStage > 0 && pregStage < 6)
		HalloweenScenes.HW.harthonPreg++;
	
	if(HalloweenScenes.HW.harthonPreg == 5) {
		Text.Add("<i>“So… how may I serv- Ah!”</i> The vixen suddenly places a hand on her belly.", parse);
		Text.NL();
		
		//#goto Harthon gives birth
		HalloweenScenes.HarthonBirth(parse);
	}
	else {
		Text.Add("<i>“So… how may I serve you, [mastermistress]?”</i>", parse);
		Text.Flush();
		HalloweenScenes.HarthonThrallPrompt(parse);
	}
}

//TODO
HalloweenScenes.HarthonThrallPrompt = function(parse) {
	var werewolf = HalloweenScenes.HW.Werewolf();
	var femHarthon = HalloweenScenes.HW.harthon & Halloween.Harthon.Feminized;
	
	var pregStage = HalloweenScenes.HW.harthonPreg;
	
	//[Sex][Talk][Holy Water][Dismiss]
	var options = new Array();
	options.push({ nameStr : "Sex",
		tooltip : Text.Parse("[HeShe] may serve you... most intimately", parse),
		func : function() {
			Text.Clear();
			Text.Add("You inform the [foxvixen] that you desire [hisher]... personal attendance.", parse);
			Text.NL();
			Text.Add("Upon hearing your words, ", parse);
			if(pregStage >= 5) {
				Text.Add("Terry removes her cloak and wraps the baby in it. She kisses the kit on the forehead then uses what little remains of her dark power to lull the young one to sleep. The vampire vixen smiles for a few moments, before setting her daughter down on a stump nearby, where she can keep an eye on her.", parse);
				Text.NL();
				Text.Add("<i>“She should be safe there,”</i> she says, before turning to you. <i>“So, what exactly do you want of me, [mastermistress]? Do you want my pussy? My butt? Or maybe do you want me to lick you?”</i>", parse);
			}
			else {
				Text.Add("Terry removes [hisher] cloak, folding it neatly before setting it down on a stump nearby.", parse);
				Text.NL();
				parse["v"] = femHarthon ? " Do you want my pussy?" : "";
				Text.Add("<i>“So, what exactly do you want me to do, [mastermistress]?[v] Do you want my butt? Or do you want me to suck on you?”</i>", parse);
			}
			Text.Flush();
			
			//[Pussy][Ass][Blowjob]
			var options = new Array();
			if(femHarthon) {
				options.push({ nameStr : "Pussy",
					tooltip : "You want that sweet pussy of hers.",
					func : function() {
						parse["preg"] = (pregStage > 0 && pregStage < 5) ? ", beneath the gravid swell of her belly" : "";
						
						Text.Clear();
						Text.Add("Looking down the vixen’s body[preg], your gaze falls on her womanhood. You dab the [tongueTip] of your [tongue] at your lips as you tell Terry that you want to know her like the woman she is.", parse);
						Text.NL();
						Text.Add("<i>“Very well, [mastermistress]. Why don’t you make yourself comfortable?”</i>", parse);
						Text.NL();
						parse["w"] = werewolf ? "" : " remove your clothes and";
						Text.Add("Such a good thrall. You[w] ", parse);
						if(player.FirstCock()) {
							Text.Add("find a comfy spot to sit down, adjusting yourself so your lovely thrall has access to your [cocks].", parse);
							Text.NL();
							parse["l"] = player.Humanoid() ? "pushing your legs apart" : Text.Parse("adjusting your [legs]", parse)
							Text.Add("Terry smiles as she saunters over to your position, kneeling before you and [l] so she can lean closer.", parse);
							Text.NL();
							Text.Add("She starts by gently caressing[oneof] your [cocks], then leaning down for a soft kiss on your [cockTip].", parse);
							Text.NL();
							Text.Add("You murmur in appreciation as you savor the vixen’s velvety lips. A jolt of pleasure runs through your member, and you can feel yourself hardening as her touch coaxes your heart to beat faster.", parse);
							Text.NL();
							Text.Add("Next, she crawls a little closer, nestling your [cock] in the valley of her breasts before she starts pushing both luscious orbs together to give you a titjob.", parse);
							Text.NL();
							Text.Add("The soft warmth of her boobflesh, combined with the silken soft feel of her fur tickling your shaft is enough to make you moan in anticipation. With such lavish treatment, you quickly grow to full mast. The cold air of the night tickles your [cockTip] as Terry continues to wrap the rest you in her velvety cocoon.", parse);
							Text.NL();
							Text.Add("Still, you don’t have to put up with the cold for long. The vixen lowers her muzzle and takes your tip in, gently tonguing it with practiced ease. It’s wonderful, and had you not made different plans for this booty call, you might’ve let her finish.", parse);
							Text.NL();
							Text.Add("The vampire vixen hums as she feels the first spurt of pre catch on her tongue, and that’s when she releases you. It’s somewhat disappointing that your thrall decided to let you go just as you were starting to really enjoy it, but you still give her an appreciative pat for remembering what you’re here for.", parse);
							Text.NL();
							Text.Add("<i>“I think you’re ready, [mastermistress].”</i> She giggles, getting back on her feet.", parse);
						}
						else {
							Text.Add("attach your <i>stake</i> to its slot, then find a comfy spot to sit and wait for Terry’s next move.", parse);
						}
						Text.NL();
						Text.Add("Terry saunters over to you, carefully lowering herself so your [cock] is nestled between her moist pussy lips; from the looks of it, she’s just as eager for this as you are.", parse);
						Text.NL();
						Text.Add("<i>“[MasterMistress]?”</i>", parse);
						Text.NL();
						Text.Add("Tone sharpened by impatience, you give her permission to proceed. Her obedience is normally so admirable, but in your current state, the anticipation is almost painful.", parse);
						Text.NL();
						Text.Add("In one quick swoop, she slides along your length and lets your [cockTip] pop inside her warm honeypot.", parse);
						Text.NL();
						parse["g"] = (pregStage > 0 && pregStage < 5) ? " gravid" : "";
						Text.Add("Eagerly, you reach up and catch her by her ample hips, the warm, wet tightness of her around your [cockTip] spurring you to help her. The[g] vulpine moans softly, glad of the support, and the two of you together slowly guide her down your length.", parse);
						Text.NL();
						if(player.FirstCock())
							Text.Add("You can feel her talented pussy rippling around your cock, drawing each inch of male flesh home where it belongs as you help her support her weight. The feel of her washes over your dick and spirals up your spine. Every beat of her heart and flex of her muscles echoes in your mind, an intimate joining that only fuels your hunger for her.", parse);
						else
							Text.Add("Although you may not get quite the same benefit as someone with a real cock, you can still feel every inch of Terry’s progress as she slowly guides herself down your artificial length. You can feel your anticipation building with each moment that goes by, every little moan and grunt that escapes her lips stoking your desire further.", parse);
						Text.NL();
						Text.Add("When her plush butt finally settles into your lap, it’s almost disappointing. Almost. Because now you know the fun can really begin.", parse);
						Text.NL();
						HalloweenScenes.HarthonPitchVag(parse);
					}, enabled : true
				});
			}
			options.push({ nameStr : "Ass",
				tooltip : Text.Parse("[HisHer] sexy ass is far too good to pass up.", parse),
				func : function() {
					Text.Clear();
					parse["w"] = werewolf ? ", like the predator that you are" : "";
					Text.Add("Instead of answering Terry with words, you slowly stalk towards [himher][w], circling around to [hisher] rear. If your actions confuse your thrall, [heshe] keeps [hisher] thoughts to [himher]self, obediently standing there as you take your desired position.", parse);
					Text.NL();
					if(femHarthon) {
						parse["c"] = werewolf ? "" : " remove your costume and";
						Text.Add("Your pretty little vixen has a perfectly pretty little butt; round, plump and juicy, it’s like a fuzzy golden peach, just begging to be squeezed. The thought is enough to make you lick your chops, even as you[c] ", parse);
						if(player.FirstCock())
							Text.Add("lasciviously stroke[oneof] your [cocks], coaxing it into standing at attention.", parse);
						else
							Text.Add("carefully fix your ‘stake’ into place.", parse);
					}
					else {
						Text.Add("Nowhere else does your lovely pet foxy’s daintiness give way to effeminacy better than his butt. Those round, shapely cheeks and wide hips give him an amusingly womanly swish to his walk. He has an ass that’s just begging to be fucked... and you have every intention of doing so.", parse);
						Text.NL();
						parse["c"] = werewolf ? "" : " peel off your skimpy outfit and";
						Text.Add("You almost start to salivate at the thought as you[c] ", parse);
						if(player.FirstCock())
							Text.Add("stroke yourself, coaxing[oneof] your [cocks] erect to begin.", parse);
						else
							Text.Add("snap your trusty ‘stake’ into place.", parse);
					}
					Text.NL();
					Text.Add("Your eyes fix on Terry’s gently swishing tail, just waiting for the moment. Oblivious to your wicked intentions, the [foxvixen] finally drops [hisher] guard, and you seize that moment to pounce!", parse);
					Text.NL();
					Text.Add("<i>“Eep!”</i> The [foxvixen] jumps at your sudden grab.", parse);
					Text.NL();
					parse["former"] = femHarthon ? " former" : "";
					Text.Add("You can’t hold back a chuckle at the[former] fox’s surprisingly girlish scream, even as you lecherously caress [hisher] ample ass. It’s truly yummy to squeeze; big and soft enough that you can sink into it, but with an underlying firmness that makes it fun to knead.", parse);
					Text.NL();
					if(player.FirstCock()) {
						Text.Add("Your hands creep around to Terry’s hips reluctantly, holding [himher] in place so that you can start to hump away at [hisher] butt. The lusciously squishy bum-flesh feels even better on your dick than it did in your hands, luxuriantly soft fur adding a wonderful ticklish feeling to each stroking pass through [hisher] cleft.", parse);
						Text.NL();
						Text.Add("Your heart begins to pound in anticipation, your male pride swelling to its full magnificence as you minister to the both of you. Your breathing starts to come sharp and short as your excitement builds; you could almost cum just by doing this!", parse);
						Text.NL();
						Text.Add("But no... you want to plunge this ‘stake’ of yours where it belongs: to the very hilt in the former [LordLady]’s ass. You lick your lips hungrily at the very thought.", parse);
					}
					else {
						Text.Add("Still molesting [himher], you bring your hips in closer so that you can grind your [cock] through the canyon of the vampire’s ass cleavage, ensuring that [heshe] cannot mistake what your intentions are.", parse);
						Text.NL();
						Text.Add("Terry grinds back, making it all too clear that the [foxvixen] isn’t unappreciative of your advances. <i>“Ahn!”</i>", parse);
						Text.NL();
						Text.Add("Such a perverted little vampire; [heshe]’s looking forward to getting ‘staked’! Well, you’re happy to oblige [himher]...", parse);
					}
					Text.NL();
					parse["spreading"] = player.HasLegs() ? "spreading" : "adjusting";
					Text.Add("Your eyes dart around, looking for a convenient spot. Seeing a large, flat boulder, you make your way there, a hand gently stroking Terry’s tail to coax [himher] into following you. You settle yourself atop the boulder, as comfortably as you can, [spreading] your [legs] to grant the [foxvixen] access. ", parse);
					Text.NL();
					Text.Add("Smirking, you coolly tell Terry to sit down, one hand leisurely brushing your [cock] to show exactly where you want [himher] to sit.", parse);
					Text.NL();
					Text.Add("<i>“Yes, [mastermistress],”</i> the [foxvixen] says with a smile, sauntering towards you.", parse);
					Text.NL();
					parse["boygirl"] = femHarthon ? "girl" : "boy";
					Text.Add("That’s a good [boygirl]...", parse);
					Text.NL();
					Text.Add("Terry steps over you, letting your [cock] drag along [hisher] thighs, until the [cockTip] pokes behind [himher] to nestle in [hisher] butt cleavage.", parse);
					Text.NL();
					Text.Add("With a hungry grin, you grab [himher] by the hips, holding [himher] fast while you realign your [cockTip] and then thrust it home. Hot, tight flesh wraps around your dick as you spear into the [foxvixen]’s ass, slowly spreading [himher] open as you work your way deeper inside.", parse);
					Text.NL();
					Text.Add("Your thrall’s wanton moans of pleasure are like music to your ears, [heshe] might actually be enjoying this way too much… but what’s the harm in letting the vampire [foxvixen] have a little fun?", parse);
					Text.NL();
					parse["f"] = femHarthon ? ", D-cup tits jiggling heavily as she does" : "";
					Text.Add("With a soft grunt of effort, you slowly draw Terry down, pushing inch after glorious inch of prickflesh into the once-so-proud vampire’s tight little asshole. [HeShe] arches [hisher] back as you grind deeper[f], but this only spurs your efforts on.", parse);
					Text.NL();
					Text.Add("You can’t stop, you <b>won’t</b> stop; deeper and deeper you push, until finally [hisher] sexy ass is nestling heavily in your lap, your [cock] buried to the hilt inside of [himher].", parse);
					Text.NL();
					HalloweenScenes.HarthonPitchAnal(parse);
				}, enabled : true
			});
			options.push({ nameStr : "Blowjob",
				tooltip : Text.Parse("You want to put [hisher] sucking skills to good use.", parse),
				func : function() {
					Text.Clear();
					
					var first = !(HalloweenScenes.HW.harthon & Halloween.Harthon.BJ);
					HalloweenScenes.HW.harthon |= Halloween.Harthon.BJ;
					
					if(first) {
						Text.Add("Looking at Terry’s mouth, you know what you want [himher] to do. Still, although you’re confident in [hisher] sucking skills, you’re not going to just stick it in and hope for the best. Pursing your lips thoughtfully, you tell Terry to open [hisher] mouth.", parse);
						Text.NL();
						Text.Add("Terry looks at you in confusion, but does as ordered.", parse);
						Text.NL();
						Text.Add("Without a word, you move in to take a better look at the vulpine vampire’s mouth, determined to see if there is a way you can exploit [hisher] skills in a more sexual way.", parse);
						Text.NL();
						Text.Add("What you see there makes you stare in surprise, looking even harder than before. Terry’s fangs are gone! ...Well, alright, [hisher] canines are still longer than a human’s, but they’re not the exaggerated blood-letting stilettos that they were originally.", parse);
						Text.NL();
						Text.Add("You don’t recall them changing before, and so you wonder for a moment what happened. Then you dismiss it as not mattering; this makes things so much easier for you.", parse);
						Text.NL();
						Text.Add("Nodding to yourself in satisfaction, you tell Terry that [heshe] can get down on [hisher] knees now - and keep [hisher] mouth open.", parse);
						Text.NL();
						Text.Add("The [foxvixen]’s ears flatten at that, but [heshe] does as ordered all the same.", parse);
					}
					else {
						Text.Add("With the absence of the vulpine vampire’s formerly intimidating teeth, you know just what you want to do. Unable to keep the lustful grin from your own lips, you tell Terry to open [hisher] mouth and get down on [hisher] knees.", parse);
						Text.NL();
						Text.Add("[HeShe] sighs in resignation and proceeds to do as ordered.", parse);
					}
					Text.NL();
					parse["c"] = werewolf ? "" : " twitch aside the rags obscuring your maleness and";
					Text.Add("Smiling at the [foxvixen]’s prompt obedience, you[c] move closer. Your hand glides lazily back and forth along[oneof] your [cocks], coaxing into a proper erection before you can deliver it. Aligning it with Terry’s warm, wet mouth, you carefully slide the first few inches between [hisher] jaws, feeling the softness of [hisher] tongue as it brushes the sensitive underside of your shaft.", parse);
					Text.NL();
					Text.Add("Terry looks up at you as you feed [himher] your [cock] without so much as blinking.", parse);
					Text.NL();
					if(first)
						Text.Add("You are more than a little underwhelmed by the lack of enthusiasm Terry is showing you. Oh well, maybe [heshe]’ll warm up to it if you give [himher] a chance?", parse);
					else
						Text.Add("Again? Is [heshe] seriously going to make you go through this every single time? But you’ll be nice and give [himher] a chance to get into this on [hisher] own before you bring out your trump card.", parse);
					Text.NL();
					Text.Add("You start to thrust your hips back and forth, rocking slightly as you slowly stroke your pulsating member along Terry’s mouth. You push the [cockTip] in until you are just shy of Terry’s throat, then leisurely draw back. The feeling of [hisher] tongue under your cock makes you shiver, the slight roughness of [hisher] taste buds rippling along your sensitive skin making your heartbeat quicken.", parse);
					Text.NL();
					if(first) {
						Text.Add("Still, despite your gentle efforts to coax the [foxvixen] into participating... nothing. [HeShe] won’t even close [hisher] mouth on your cock.", parse);
						Text.NL();
						Text.Add("A disdainful sneer curls your lip; you will <b>not</b> be having this from your thrall. You start to reach within, feeling for the power that you earned through right of conquest. Even as you let it build within your metaphysical grasp, you taunt Terry; what kind of vampire does [heshe] think [heshe] is? Whoever heard of a vampire that was so <i>awful</i> at sucking?", parse);
						Text.NL();
						Text.Add("The [foxvixen] frowns at your taunting, but otherwise displays no reaction.", parse);
						Text.NL();
						Text.Add("No matter. This should change [hisher] mind soon enough.", parse);
					}
					else {
						Text.Add("But it seems Terry is a stubborn one on this. Or maybe [heshe] likes it when you turn [hisher] power against [himher]?", parse);
						Text.NL();
						Text.Add("Either way, if [heshe]’s going to force you to <b>make</b> [himher] get into this, then so be it.", parse);
						Text.NL();
						Text.Add("Without a moment’s hesitation, you reach inside of you, calling the power to you with practiced ease, shaping it in preparation for your next step.", parse);
					}
					Text.NL();
					Text.Add("At first, there’s a look of confusion in the former vampire’s face, but it quickly shifts towards a flustered gaze as [heshe] looks up at you. [HisHer] mouth begins salivating profusely, quickly soaking your length as [heshe] finally begins moving [hisher] tongue. There is a sense of urgency as [heshe] settles into a rather quick rhythm, bobbing [hisher] head to taste more of you.", parse);
					Text.NL();
					Text.Add("As the vulpine’s efforts send tingles racing along your skin, you smile to yourself. A little sensitivity boost to his mouth, some adjustments to your own personal flavor - and, of course, a massive surge of thirst that only your cum can quench - and Terry is finally getting into this for real.", parse);
					Text.NL();
					Text.Add("A sudden flick of the vulpine’s tongue snaps you out of your little reverie, making you moan in glee. Mmm; when [hisher] heart is in it, Terry is <b>quite</b> the cock-sucker!", parse);
					Text.NL();
					if(player.HasBalls()) {
						Text.Add("While [hisher] mouth handles your [cock], [hisher] hands move to massage your [balls], coaxing your seed factories into producing a load big enough to sate [hisher] terrible thirst.", parse);
						Text.NL();
					}
					Text.Add("Grinning shamelessly, you praise Terry for being such a good little thrall; you knew that [heshe] could suck cock like a champion, if [heshe] would just put the effort in. You’re so glad that [heshe] decided to stop messing around and get down to serious business.", parse);
					Text.NL();
					Text.Add("[HeShe] simply continues to suck; the only sign that [heshe] heard you is the slight flicking of one of [hisher] ears.", parse);
					Text.NL();
					Text.Add("With Terry’s mouth otherwise occupied, you’re quite happy to just sit back and enjoy Terry’s efforts. You occasionally thrust your hips, but with the [foxvixen]’s new enthusiasm, you can gladly leave the bulk of the work to [himher].", parse);
					Text.NL();
					Text.Add("The lewd slurps and sucks of Terry’s lips greedily wrapped around your dick echo softly in the cool night air. Your breathing comes in short, sharp pants, and tightness wells up ", parse);
					if(player.HasBalls())
						Text.Add("in your aching [balls]", parse);
					else
						Text.Add("at the base of your spine", parse);
					Text.Add(". You know that you can’t hold out much longer.", parse);
					Text.NL();
					Text.Add("Your whole body trembles, eyes squeezing tight as pleasure creeps along your nerves. Feeling your reserves starting to crumble, you shout for Terry to take it all, like the greedy little cum-dumpster [heshe] is, and then give yourself over to climax hammering at your self-control.", parse);
					Text.NL();
					Text.Add("A muffled, liquid gurgle is the only answer that you get, but lost as you are in the depths of pleasure, even that falls on deaf ears. You are barely aware of driving your cock as deep into Terry’s mouth as it can possibly go, the compelled [foxvixen] gulping it down without hesitation, eager to ensure that not a single drop escapes [hisher] thirsty gullet.", parse);
					Text.NL();
					Text.Add("You shudder and squirm, writhing like a worm on a hook as your tame vampire greedily guzzles down your dick-cream, sucking and slurping until you feel that [heshe]’s going to ", parse);
					if(player.HasBalls())
						Text.Add("suck your balls out through your shaft.", parse);
					else
						Text.Add("slurp up your spine like a noodle.", parse);
					Text.Add(" Caught by your own ploy, you desperately reach for the power within you, breaking the enchantment you laid on your formerly-reluctant pet.", parse);
					Text.NL();
					Text.Add("Terry promptly gags and splutters, pulling free of your loins in time for one final meager splash of cum to spatter across [hisher] lips. You stumble backwards, nearly falling flat on your [butt] as Terry shudders and spits, distastefully pawing at the mess on [hisher] face.", parse);
					Text.NL();
					Text.Add("Once you can breathe evenly again, you grin wryly and quip that could have gone a little better. However, all things considered, you’re not complaining about what happened; [heshe] is <b>truly</b> a cocksucking fiend from hell, if [heshe] wants to be.", parse);
					Text.NL();
					Text.Add("<i>“Thank you, [mastermistress]...”</i> [heshe] trails off, less than pleased.", parse);
					Text.NL();
					Text.Add("Smiling, you reach down and help the [foxvixen] to [hisher] feet before pulling [himher] into a tender hug. Heedless of the smears of your own seed still caking Terry’s lips, you sweetly press your mouth against [hishers], holding [himher] to you until [heshe] slowly kisses back. Only when that pesky need for air raises its head do you break the liplock, though you still hold [himher] in your arms.", parse);
					Text.NL();
					Text.Add("Despite [himher]self, the [foxvixen] licks [hisher] lips, trying to catch a little of your lingering taste. <i>“I… thank you, [mastermistress]?”</i>", parse);
					Text.NL();
					Text.Add("It was nothing.", parse);
					Text.NL();
					parse["p"] = pregStage >= 5 ? " and your daughter" : "";
					Text.Add("Terry smiles before turning to retrieve [hisher] cloak[p].", parse);
					Text.NL();
					Text.Add("<i>“I’ll be waiting for your next call, [mastermistress].”</i>", parse);
					Text.NL();
					Text.Add("You look forward to seeing [himher] again.", parse);
					Text.NL();
					Text.Add("[HeShe] bows softly, then moves beyond the bushes.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : player.FirstCock()
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true
	});
	/* TODO Talk
	options.push({ nameStr : "name",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}, enabled : true
	});
	*/
	if(!femHarthon && party.Inv().QueryNum(Items.Halloween.HolyWater)) {
		options.push({ nameStr : "Holy Water",
			tooltip : "You wish to conduct a little experiment.",
			func : function() {
				Text.Clear();
				Text.Add("Reaching into your belongings, you retrieve the canteen of “Holee Water”, and then tell your thrall to hold still.", parse);
				Text.NL();
				Text.Add("<i>“What is this? W-what are you planning?”</i>", parse);
				Text.NL();
				Text.Add("You assure him that there’s nothing to worry about, even as you deftly unscrew the cap. You just want to see what happens if you splash him with this, that’s all.", parse);
				Text.NL();
				Text.Add("The vampiric fox hisses, jumping back in a defensive stance. <i>“That’s holy water! Do you have any idea what that does to vampires? Is making me your thrall not enough for you!?”</i> he protests.", parse);
				Text.NL();
				Text.Add("No, you <b>don’t</b> know what it does to vampires, but you intend to find out one way or another.", parse);
				Text.NL();
				Text.Add("<i>“Not on me, you aren’t!”</i> he says, turning on his heels and preparing to bolt.", parse);
				Text.NL();
				Text.Add("You don’t even have to think about it; the dark power wells up within you, and you focus this power into a single command: <b>”Stay!”</b>", parse);
				Text.NL();
				Text.Add("Terry stops in his tracks, setting his feet down side by side and unable to move. <i>“Yes, [mastermistress],”</i> he says involuntarily.", parse);
				Text.NL();
				Text.Add("You shake your head forlornly as you leisurely approach the immobilized vampire, scolding him for being such a naughty boy. Idly swishing the canteen in your hand, you stand in front of your thrall and order him to remove his cape.", parse);
				Text.NL();
				Text.Add("<i>“Yes, [mastermistress],”</i> he promptly replies, obeying you at once. He takes off his cape and folds it neatly, setting it down on a nearby stump.", parse);
				Text.NL();
				Text.Add("You nod in satisfaction. That’s better; more what you’d expect from your thrall. You command him to kneel before you.", parse);
				Text.NL();
				Text.Add("Terry obeys without protest, kneeling before you. Though he doesn’t say anything, you can tell from his expression that he’s really nervous.", parse);
				Text.NL();
				Text.Add("Half-kneeling in turn, you stroke Terry’s face softly, gently telling him to relax. Everything will be fine, so long as he stays calm.", parse);
				Text.NL();
				Text.Add("<i>“H-how can I relax when you’re going-”</i>", parse);
				Text.NL();
				Text.Add("You tap into the dark power you stole from the former lord, letting it carry your will as you tell him to <b>relax</b>.", parse);
				Text.NL();
				Text.Add("<i>“Yes, [mastermistress].”</i> The effect is almost instantaneous, Terry takes a deep breath and his breathing evens out as he grows more relaxed.", parse);
				Text.NL();
				Text.Add("That’s a good boy. You affectionately stroke Terry’s ears, and then turn your attention to the canteen in your other hand.", parse);
				Text.NL();
				Text.Add("Since Terry’s being so cooperative, rather than just dumping the liquid over his head, you decide to apply it to him yourself. First, you gather some of the liquid in the canteen on your hand. As soon as it’s out of the canteen, it begins to glow blue, and you see an azure flame emerge. At first you’re somewhat alarmed, but when you see that the fire doesn’t burn and that it’s merely lukewarm, your worry dissipates.", parse);
				Text.NL();
				Text.Add("You begin with Terry’s head, massaging the flaming liquid into his scalp, covering his head with the bluish glow of the holy flames. Little by little the flames dissipate, leaving behind only Terry’s silky locks of red hair.", parse);
				Text.NL();
				Text.Add("The next target is the vampire’s face; he closes his eyes and you massage the liquid into his fur. You can feel his features changing under your touch, shifting from their previous androgynous form into something more feminine. With your thumb, you stroke his lips as if applying lipstick to the fox, and you feel them become plumper, softer, and more inviting. By the time you’re done, Terry is left with puffy lips that are just perfect for kissing… or sucking cock.", parse);
				Text.NL();
				Text.Add("A soft mewl bubbles from Terry’s new mouth, already sounding more womanly. It brings a smile to your face, but you’re not done yet.", parse);
				Text.NL();
				Text.Add("Drifting lower, you slowly sluice the fiery water over Terry’s chest, eagerly groping it in the process. His flesh feels like clay in your hands as you work. Cupped fingers scoop one pectoral, making it rise under your palm. With great care, you knead and caress, making it fatter and fuller, supporting it as it starts to droop under its own weight. Using your forefingers and thumbs, you pinch and tease his nipple, making it swell into a delicious little pearl.", parse);
				Text.NL();
				Text.Add("When you feel it’s big enough, you stop for a moment, admiring the plump, perky breast you have molded. It’s a thing of beauty... but you can’t leave him lopsided like this!", parse);
				Text.NL();
				Text.Add("Smiling to yourself, you diligently turn your attention to Terry’s other breast and lavish it with the same treatment, not stopping until a matching set of D-cups rise and fall with each breath your pet takes.", parse);
				Text.NL();
				Text.Add("After taking a moment to admire your handiwork, you eagerly let your hands trail down along Terry’s belly, carrying with them the magical water that’s making this all possible. There’s not really a lot to do here; the soon-to-be ex-male already sports a girlishly trim, toned belly. But you still make the effort, slathering him with hands and massaging his midriff.", parse);
				Text.NL();
				Text.Add("Terry moans at your touch, visibly quivering, and you wonder for a second what the magic may be doing to him, deep inside. For a moment, the urge to rush ahead to the best part wells up inside of you, but you force it down. This is something to savor, to enjoy to the fullest. It will be all the sweeter for having waited.", parse);
				Text.NL();
				Text.Add("Leisurely, you stalk around your mewling, panting vixen-to-be, kneeling down beside him. More of the holy water sluices down his back, flowing over his tail and through the cleft of his buttocks, making him moan as it seeps through his fur.", parse);
				Text.NL();
				Text.Add("Your hands circle his waist, stroking and pinching; in all honesty, there’s very little room for improvement here. The fox has quite a set of hips on him already... still, you delight in making what changes you can. A little tug here, and a little pull there, and you spread him wider, giving him even more of a girlish waistline and hips more suited for birthing.", parse);
				Text.NL();
				Text.Add("With lecherous glee, you caress your thrall’s butt. So ripe, so round, so fully packed; even as you eagerly molest them, you can think of little to do to improve them. Ultimately, you decide that he needs no further treatment here; it would be a shame to ruin something so wonderful by trying too hard to “fix” it, after all.", parse);
				Text.NL();
				Text.Add("Terry yelps as your hand cracks playfully against his butt.", parse);
				Text.NL();
				Text.Add("The canteen is quite drained, but you have enough to spare for a few last touchups before the grand finale. You pour a careful measure of holy water over Terry’s tail, lathering the ethereal fluid into dense, bushy fur and leaving it softer, shinier and sleeker from its magical rinse-out.", parse);
				Text.NL();
				Text.Add("Hugging the increasingly effeminate vulpine’s waist, you start to sluice holy water down each slender leg. Your hands coast up and down, savoring the firm muscle in each dainty thigh, feeling it lose just those few pesky inches as you pass across it. Demurely, he raises first one foot and then the other, letting you rub some of the excess water between his toes.", parse);
				Text.NL();
				Text.Add("And now... now, there’s just one last trace of the old Terry to take care of. Licking your lips, you peer around Terry’s hips as your hands reach for his cock.", parse);
				Text.NL();
				Text.Add("Despite everything, despite knowing that it’s about to be erased from his body, Terry’s manhood is standing proudly erect, throbbing with need as a small streamer of pre-cum seeps from its tip. The fingers of your first hand, dripping with some of the last of the holy water, close around the vulpine cock, whilst your other closes around his ball-sack.", parse);
				Text.NL();
				Text.Add("Terry moans incoherently as your fingers play with his balls, kneading them and rolling them around on your palm. With each pass of your digits, you can feel them shrinking smaller and smaller. The cleft between the two nuts starts to sink into Terry’s body, slowly opening into soft, delicate tissue as your hand works its magic.", parse);
				Text.NL();
				Text.Add("But your other hand isn’t idle, either. It strokes back and forth along Terry’s cock, thumb rubbing at the rim of his sheath and fingers caressing the tender underside. Although your vision isn’t the clearest from where you are, you can <b>feel</b> what you are doing to him. You can feel his manhood shrinking, growing smaller and smaller each time you stroke downwards. You can feel his sheath starting to stretch, rising up into the beginnings of a clitoral hood as your thumb tugs it upwards.", parse);
				Text.NL();
				Text.Add("A chorus of ecstatic mewls and moans fill your ears as you work, pre-cum flowing sticky and sluggish over your fingers. With deceptive slowness, Terry’s old maleness shrinks away into his body.", parse);
				Text.NL();
				Text.Add("His nuts are barely present now, just soft lumps to either side of the wet cleft you have opened. With utmost care, you massage its edge with one hand, slowly tweaking and stroking. You can feel them smoothing out, shedding fur for naked flesh as you tenderly coax them into their true form; juicy, puffy labia.", parse);
				Text.NL();
				Text.Add("His cock, still oozing pre-cum along his folds, is nothing more than a glans just barely peeking from beneath his stretched hood. As you rub it with your thumb, you can feel it shrinking smaller and smaller, until it slowly creeps away back into hiding.", parse);
				Text.NL();
				//Terry turns female HERE
				Text.Add("Gently, you press into Terry’s gash, slowly kneading the soft, vulnerable flesh. As you push, you can feel it giving way, opening up into a waiting love tunnel. First, one finger fits inside, and then a second, both vanishing to the knuckle. Terry trembles and whimpers, teeth clicking in sensory overload as you finish sculpting her inside and out.", parse);
				Text.NL();
				if(werewolf)
					Text.Add("You can <b>smell</b> the changes flowing through her; masculine musk almost entirely swallowed by the sweet scent of femininity. It makes your cock ache in need, trembles of anxiety sweeping over your hulking lupine frame, but you hold it at bay. Just a little more...", parse);
				else
					Text.Add("Terry is even starting to <b>smell</b> different; a distinctly feminine scent starting to fill your nostrils as you approach the pinnacle of your efforts. You savor the sexual bouquet, even as you continue to tweak her new canal.", parse);
				Text.NL();
				Text.Add("Only when you add the third finger does the magic take place. Terry arches her back and howls like a bitch in heat. Her folds spasm under your touch, her tunnel clenching down on the intruding digits with crushing force as she is wracked by her first female orgasm.", parse);
				Text.NL();
				Text.Add("Patiently, you sit there and wait, riding out her efforts until the panting vixen slumps against you. Her pussy falls slack and you withdraw your hands, wetly slurping as you pull them from her passage.", parse);
				Text.NL();
				Text.Add("Smiling to yourself at the sight of her honey glistening on your fingers, you lift them to your mouth and savor the sweet taste of success.", parse);
				Text.NL();
				Text.Add("Mmm, delicious; she truly is the sweetest thing you’ve ever tasted. As you praise the newly-made vixen, you rise from your position behind her, strutting around to better admire your handiwork.", parse);
				Text.NL();
				Text.Add("<i>“I can’t believe you did this to me...”</i>", parse);
				Text.NL();
				Text.Add("There’s no need for her to be upset, you say, laying a hand on her shoulder. She was just a pretty-boy as a fox, but as a vixen? She’s stunning, sexy, and simply beautiful to look at.", parse);
				Text.NL();
				Text.Add("<i>“You really mean that?”</i> she asks, looking up at you.", parse);
				Text.NL();
				Text.Add("Of course you do! As her [mastermistress], you’re very happy with her changes. And you have a feeling that you can <i>persuade</i> her into enjoying her changes as well, you add with a sly smile.", parse);
				Text.NL();
				if(player.FirstCock()) {
					Text.Add("You look pointedly downwards, Terry obediently following your gaze to your throbbing erection[s]. She blinks in surprise as you capture her hand and tenderly wrap her fingers around[oneof] your length[s].", parse);
					Text.NL();
					Text.Add("This is for her, you cheerfully announce. Does she see what she’s doing to you with her gorgeous new body?", parse);
					Text.NL();
					Text.Add("It’s a bit difficult, but with a little help from the moonlight you can just barely see the hint of a blush under her fur...", parse);
					Text.NL();
					Text.Add("Feigning ignorance to her reaction, you ask her if she’s going to take responsibility for this, like a good thrall should.", parse);
					Text.NL();
					Text.Add("She gives your [cock] a few light strokes, enjoying the way you throb in her grasp. <i>“If that’s your wish [mastermistress], I guess I wouldn’t have a choice,”</i> she says with a smile.", parse);
					Text.NL();
					Text.Add("That’s <i>exactly</i> what you wish for her to do.", parse);
				}
				else {
					Text.Add("Without taking your eyes off of her, you reach into your gear with a free hand and retrieve the trusty ‘stake’ that the elder gave you. You playfully poke her in the side with it, capturing her attention as you present it to her.", parse);
					Text.NL();
					Text.Add("Mischievously, you ask if she remembers being ‘smote’ with this before.", parse);
					Text.NL();
					Text.Add("<i>“Uh, yeah...”</i>", parse);
					Text.NL();
					Text.Add("Well, how does she think it’ll feel next time, now that she’s got a body just made for being smitten with this?", parse);
					Text.NL();
					Text.Add("<i>“Well, I’ll admit I’m at least a little curious,”</i> she says, biting her lower lip.", parse);
					Text.NL();
					Text.Add("You were hoping she’d say that. With purposeful movements, you slot the ‘stake’ into place at your loins, the click as it fits together audible in the stillness. Running your fingers enticingly along it, you sweetly ask if Terry would like to give the new her a proper welcome.", parse);
					Text.NL();
					Text.Add("The vixen smiles at that. <i>“Yes, [mastermistress].”</i>", parse);
				}
				Text.NL();
				Text.Add("Your eyes dart around, until you spot a cozy little place for you to sit. Without preamble, you make your way there, the newly vixenified Terry obediently padding along in your wake. You settle yourself on the ground, adjusting your [legs] to properly expose your [cocks] to your thrall, and look up at her expectantly.", parse);
				Text.NL();
				Text.Add("Terry smiles and steps over you, lowering herself and carefully adjusting your [cock] so it’s nestled between her puffy nethers, just barely entering her.", parse);
				Text.NL();
				Text.Add("You find yourself holding your breath in anticipation.", parse);
				Text.NL();
				Text.Add("The vampire vixen takes a deep breath to steel herself, then begins making her way down your shaft.", parse);
				Text.NL();
				Text.Add("Quickly, you reach up to the vixen atop you, one hand at her hip and another taking her hand. As carefully as you can, you help her to support her weight, slowly coaxing her down your shaft, but keeping her from falling faster than she can handle it.", parse);
				Text.NL();
				parse["c"] = player.FirstCock() ? "" : ", even through the barrier of your fake cock";
				Text.Add("With an almost glacial pace, she takes the first few inches inside, until you can feel her hymen holding you back[c]. The two of you pause for a second, the vixen panting softly as she visibly steels herself, and then she pushes herself down.", parse);
				Text.NL();
				Text.Add("You can feel her virginity tear asunder on your member, and though she does her best to hold it back, Terry can’t smother a pitiful yelp of pain, bright red blood beading her lip where she’s bitten it.", parse);
				Text.NL();
				Text.Add("With little else that you can do, you squeeze her hand, offering her what comfort you can through your contact. Terry breathes heavily, halting her descent as she adjusts to the feel of being stretched in her new sex.", parse);
				Text.NL();
				Text.Add("Then, she takes another deep breath and starts moving again, not stopping until she is seated firmly in your lap.", parse);
				Text.NL();
				
				HalloweenScenes.HW.harthon |= Halloween.Harthon.Feminized = true;
				party.Inv().RemoveItem(Items.Halloween.HolyWater);
				
				HalloweenScenes.HarthonPitchVag(parse);
			}, enabled : true
		});
	}
	options.push({ nameStr : "Dismiss",
		tooltip : Text.Parse("That will be all, for the moment. [HeShe] is free to leave now.", parse),
		func : function() {
			Text.Clear();
			Text.Add("You shake your head and tell Terry that you don’t need anything right now.", parse);
			Text.NL();
			Text.Add("The [foxvixen] sighs. <i>“Very well, [mastermistress]. If you need me, just call.”</i>", parse);
			Text.NL();
			Text.Add("With that said, [heshe] turns around and walks into the bushes. They rustle softly, and then a small, black bat erupts from their depths, chittering quietly as it flaps away into the darkness. All too soon, it is lost to sight, Terry having returned to [hisher] element.", parse);
			Text.NL();
			Text.Add("With your thrall dismissed, you turn your attention back to the road stretching before you.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.HarthonBirth = function(parse) {
	var werewolf = HalloweenScenes.HW.Werewolf();
	
	Text.Add("What’s wrong?!", parse);
	Text.NL();
	Text.Add("<i>“I-I think my water broke...”</i>", parse);
	Text.NL();
	Text.Add("The vixen’s words sear into your brain; the baby’s coming!? Desperate to help, you ask her what you can do, already sweeping toward her and grabbing hold of her as she staggers.", parse);
	Text.NL();
	Text.Add("<i>“Just find a place where I can lie down.”</i>", parse);
	Text.NL();
	Text.Add("You nod your head absently, even as you scan your surroundings. Spotting a sizeable mound of soft, dry dead leaves, you carefully lead your laboring mother-to-be over to it. Without hesitating, you unpin her cloak from around her neck and spread it over the leaves, forming a makeshift mattress to cushion her on before you help her down onto the ground.", parse);
	Text.NL();
	Text.Add("<i>“Thanks,”</i> she says, already starting to pant softly.", parse);
	Text.NL();
	Text.Add("You gently take her hand in yours, squeezing her fingers as you nestle down on the cloak beside her. With your free hand, you rub her shoulders, telling her how you’re so proud to have a thrall like her, obedient and beautiful, a perfect jewel of femininity. And now she’s going to be a good girl and bring your kit into the world for you, isn’t she?", parse);
	Text.NL();
	Text.Add("<i>“Y-yes, [mastermistress]. Ah...”</i>", parse);
	Text.NL();
	Text.Add("You squeeze Terry’s hand for support as she winces, tail twitching irritably. You carefully place your free hand on her belly, feeling the tightness of her stretched muscles. Those contractions are coming much more frequently now, aren’t they? She’ll be a mother soon... but first, she’s going to have to put a little work in before her baby can get here.", parse);
	Text.NL();
	Text.Add("Terry groans at the mere thought, but puts up no resistance as you gently drape her over your [thighs]. She looks up at you from your lap, eyes wide with a hint of fear, but ultimately trusting. You smile down at her, gently squeeze her fingers for assurance, and tell her to start pushing when you say so.", parse);
	Text.NL();
	Text.Add("The vampire vixen nods, yelping as one of her contractions rocks her body.", parse);
	Text.NL();
	Text.Add("Time fades into an abstract concept as the two of you sit there. The former fox grunts and groans, pushing with all her might in an effort to free her stubborn kit from the confines of her overstretched womb. You do your best to coax her along, helping her to control her breathing, occasionally mopping the sweat from her brow, praising her efforts and assuring her that it will all be worth it in the end.", parse);
	Text.NL();
	Text.Add("Inevitably, things finish as they must. Terry pants loudly, takes a deep breath, and then pushes with all her might, finally voicing a thin, strained scream of effort... and being answered in turn by a small, but enthusiastic, wail from down between her legs.", parse);
	Text.NL();
	Text.Add("You clench her hand, grinning like an idiot as you praise Terry; she’s done it! Her baby’s here! Oh, what a brave, strong, beautiful thrall you have.", parse);
	Text.NL();
	Text.Add("<i>“T-thanks, [mastermistress],”</i> she says, still out of breath. <i>“Get the baby, use my cloak.”</i>", parse);
	Text.NL();
	Text.Add("You nod your understanding and carefully slide your lap out from under the tired vixen’s head. Terry pants as she lies there on the leaves, wriggling slightly as you slowly pull the cape out from under her before approaching her legs.", parse);
	Text.NL();
	Text.Add("Sprawled between the vampiress’ legs, little fists clenched and shaking as it continues to howl at being thrust from its warm home, your baby is fluffy, covered in slime, and at once both adorable and disgusting. A grin of paternal pride stretches across your face as you carefully scoop the little one into your arms, using Terry’s cloak as a makeshift blanket.", parse);
	Text.NL();
	Text.Add("The vampire vixen has given you a beautiful little baby girl; black where her mother is golden, and red where her mother is white. She sobs fitfully as you bundle her up, gently shushing her. ", parse);
	if(werewolf)
		Text.Add("From somewhere deep inside of you, an urge to lick her clean surfaces. The little vixen kit looms large in your vision before you catch yourself, slurping your tongue back into your mouth. Damn these lupine instincts. Instead, you carefully and deliberately towel her down with the cloak before wrapping her in its drier portion.", parse);
	else
		Text.Add("Using Terry’s cloak like a towel, you wipe the worst of the birth-fluids from her velvety infant’s fur, then carefully wrap her up into a neat bundle.", parse);
	Text.NL();
	Text.Add("Baby now bundled up, you turn back to Terry, who is watching you impatiently. Proudly, you inform her that she’s given you a beautiful little girl, and tenderly pass her daughter to her.", parse);
	Text.NL();
	Text.Add("Terry takes one look at the little vixen, smiling softly as she leads the baby to one of her breasts.", parse);
	Text.NL();
	Text.Add("You watch, feeling the pride grow inside you as your little girl eagerly roots for a nipple and starts to suckle. As she takes her first meal, you carefully seat yourself back down beside Terry, absently stroking the vixen’s hair as you watch your daughter nurse. Eventually, the little one fills her belly; she yawns softly and snuggles in close to Terry’s fur, the proud mother gently cuddling her close.", parse);
	Text.NL();
	Text.Add("She’s a beautiful girl, just like her mother, you inform Terry. You ask her if she has a name for the little one.", parse);
	Text.NL();
	Text.Add("<i>“No, I’ve never thought about what I’d call a daughter.”</i>", parse);
	Text.NL();
	Text.Add("So, what would she have called her son?", parse);
	Text.NL();
	Text.Add("<i>“Lord Terraphilius Harthon The Second,”</i> she replies with a smile.", parse);
	Text.NL();
	Text.Add("Well... you kind of expected that. That’s the sort of guy she was. Still, this little cutey needs a name of her own, and that just won’t do. You carefully stroke your daughter’s ears, watching them flick at a touch. After a few moments thought, you turn to Terry with a smile.", parse);
	Text.NL();
	Text.Add("Elizabeth. Lady Elizabeth Harthon. What does she think of that name?", parse);
	Text.NL();
	Text.Add("<i>“Lady Elizabeth Harthon has a nice ring to it. I like it!”</i>", parse);
	Text.NL();
	Text.Add("Then Elizabeth will be her name. You bend down and kiss Terry, planting a soft and affectionate smooch on her lips. When she has her strength back, she should take little Elizabeth and go get some proper rest; the two of them will need it.", parse);
	Text.NL();
	Text.Add("<i>“Yes, [mastermistress].”</i>", parse);
	Text.NL();
	Text.Add("That’s a good girl - a good pair of girls.", parse);
	Text.NL();
	Text.Add("You tenderly hold Terry’s head up and slide forward, allowing her to use your lap as a pillow. The vampiress is so tired that she just smiles thankfully. The three of you sit there in peaceful quiet, until Terry starts to fidget on your lap. You help her off, and the new mother slowly walks into the bushes. You watch as they rustle, before a large bat erupts from the leaves and flaps its way skyward, a much smaller baby bat clinging to its belly-fur as it vanishes into the darkness.", parse);
	Text.NL();
	Text.Add("You watch them as they go, and then get up, ready to head off on your way yourself.", parse);
	Text.Flush();
	Gui.NextPrompt();
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
		return !(HalloweenScenes.HW.flags & Halloween.Flags.Laggoth);
	},
	function() {
		if(!(HalloweenScenes.HW.flags & Halloween.Flags.Laggoth)) {
			Text.NL();
			Text.Add("The altar up ahead is lit up by a hellish glow. The source of the evil plaguing the chapel must be there!");
		}
	},
	function() {
		HalloweenScenes.Laggoth();
	}
));

HalloweenScenes.Laggoth = function() {
	var parse = {
		
	};
	
	HalloweenScenes.HW.flags |= Halloween.Flags.Laggoth;
	
	var werewolf = HalloweenScenes.HW.Werewolf();
	
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
	Text.Add("<i>“Fee, fi, fo, fum!<br>", parse);
	Text.Add("“I sense an ass for my cum!<br>", parse);
	Text.Add("“Be it alive, or be it dead,<br>", parse);
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
		
		HalloweenScenes.LaggothQnA({});
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.LaggothQnA = function(opts) {
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
				HalloweenScenes.LaggothQnA(opts);
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
				HalloweenScenes.LaggothQnA(opts);
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
				HalloweenScenes.LaggothQnA(opts);
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
				func : HalloweenScenes.LaggothDistract, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		});
	}
}

HalloweenScenes.LaggothDistract = function() {
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
				
				HalloweenScenes.LaggothPit();
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
				
				HalloweenScenes.LaggothPit();
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.LaggothPit = function() {
	var parse = {
		skin : player.SkinDesc()
	};
	
	var werewolf = HalloweenScenes.HW.Werewolf();
	
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
		HalloweenScenes.WakingUp(true); 
	});
}

Halloween.Loc.Chapel.events.push(new Link(
	"Sacristy", true, function() {
		return !(HalloweenScenes.HW.flags & Halloween.Flags.Lenka);
	},
	null,
	function() {
		HalloweenScenes.Sacristy();
	}
));

HalloweenScenes.Sacristy = function() {
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
		func : HalloweenScenes.Lenka, enabled : true
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

HalloweenScenes.Lenka = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var werewolf = HalloweenScenes.HW.Werewolf();
	var p1cock = player.BiggestCock();
	
	HalloweenScenes.HW.flags |= Halloween.Flags.Lenka;
	
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
	Text.Add("Yes, yes… you want this. Anything that magical voice commands of you. The avian demoness shoves you back into the mattress, then pounces on you, nuzzling you aggressively with her beak. Her scent - practically indistinguishable from that of the roses - fills the world, and her soft, teardrop-shaped breasts push against your body, warm with promise, her nipples stiff and erect. You can <i>feel</i> her heat-filled breeding hole grind against your stomach, leaving a trail of slick moistness, wet feathers spreading her girl-cum like a paintbrush. Butterflies erupt in your stomach, and in this moment, you want nothing more than to have the honor of servicing this fertility Goddess kneeling on the mattress in front of you.", parse);
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
			Text.Add("Wow. Looking at the sheer size of that womb-straining egg… and she’s got more of those in her? You can’t help but feel elated that you were part of this process, that this incredible fertility Goddess picked you, out of all who could have stumbled upon this place, to father her firstborn spawn.", parse);
			Text.NL();
			Text.Add("Two more orgasms later, an equal number of huge matte-black eggs are resting beside their sibling, smelling faintly of that same, sickly, cloying sweet scent that pervades the room. Chirping tenderly, Lenka pats the eggs as they begin to hatch, cracks running along their surface until the shells break open and small, dark vaguely bird-like shapes spill out from within, still damp with egg fluids. Mother of Shadows indeed…", parse);
			Text.NL();
			Text.Add("A satisfied smile on her face, Lenka takes her brood into her arms and sets them against her breast one by one, giving each their turn to suckle as much as they want.", parse);
			Text.NL();
			Text.Add("Before your eyes, the dark shapes grow in leaps and bounds, soon sitting on their demon mother’s lap instead of being held by her. Baby fluff falls to the ground, dissolving in wisps of vile smoke as proper flight feathers and plumage emerge; they empty eyes and dark wings blaze a deep violet with unholy energy. For some reason, you can’t help but notice that the black roses have started to creep beyond the sacristy’s confines, the blossoms ever so much more deadly and beautiful, the thorns they hide so much more vicious…", parse);
			Text.NL();
			Text.Add("<i>“Go,”</i> Lenka whispers to her trio of firstborn, the seething masses of vaguely bird-shaped shadow now fully grown. Already, the remnants of her pregnant belly are fading away, her midriff rapidly returning to its old slender shape, her womb preparing itself to be seeded again. <i>“You’ll soon have many brothers and sisters to join you.”</i>", parse);
			Text.NL();
			Text.Add("A soft flutter of wings, and they are gone, melding seamlessly into the darkness. Humming to herself, Lenka takes her time cleaning up; removing both eggshell fragments and messy fluids with a snap of her gloved fingers, making sure to move her Goddess-worthy body just so to inflame your addled desires. At long last, though, she’s done, and the avian demoness settles back on the bed, eyes gleaming predatorily as she turns her gaze on you.", parse);
			Text.NL();
			Text.Add("<i>“Giddy up, cum-pump. We’ve still got lots of work to do.”</i>", parse);
			Text.NL();
			Text.Add("Time moves in a blur of breeding, your balls never seeming to run dry despite each massive load you shoot off into your lascivious mistress-wife. Time and time again her womb grows monstrously heavy with child; time and time again more of her dark offspring are sent out into the world, masses of shadow and energy poised to terrorize and destroy. Sometimes, they return bearing gifts for their loving mother; others bring slaves for breeding, but no matter how many others offer up their seed to her, you know that you’re your mistress-wife’s first and favorite.", parse);
			Text.NL();
			Text.Add("Around you, the black roses grow from their heart under the elegant bed; you dimly realize that they’ve already consumed the entirety of the burnt-out chapel in their vicious, thorny grip. In your more lucid moments, when your mistress-wife’s voice isn’t present to command your attention and demand that she be bred, you dimly wonder if they’ll eventually spread to consume everything in the world…", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				HalloweenScenes.WakingUp(true);
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
	var first = !(HalloweenScenes.HW.flags & Halloween.Flags.WitchHut);
	HalloweenScenes.HW.flags |= Halloween.Flags.WitchHut;
	
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
		HalloweenScenes.Patches();
	}
));

Halloween.Loc.WitchHut.events.push(new Link(
	function() {
		return (HalloweenScenes.HW.flags & Halloween.Flags.Jenna) ? "Jenna" : "Witch";
	}, true, true,
	null,
	function() {
		HalloweenScenes.Jenna();
	}
));

HalloweenScenes.Jenna = function() {
	var parse = {
		playername : player.name,
		heshe : player.mfTrue("he", "she")
	};
	
	var first = !(HalloweenScenes.HW.flags & Halloween.Flags.Jenna);
	HalloweenScenes.HW.flags |= Halloween.Flags.Jenna;
	
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
		
		HalloweenScenes.JennaSwitchPrompt({});
	}
	else if(HalloweenScenes.HW.flags & Halloween.Flags.Broomfuck) {
		Text.Add("Looking up from her tea, Jenna shakes her head, the elven witch’s long, pink bangs swaying in time with the motions of her head.", parse);
		Text.NL();
		Text.Add("<i>“Nothing’s left for you in this place<br>", parse);
		Text.Add("Countless terrors you tonight will face<br>", parse);
		Text.Add("Go forth, bold one! Make utmost haste<br>", parse);
		Text.Add("For there is scarce time for you to waste.”</i>", parse);
		Text.NL();
		Text.Add("With that, she returns to her tea. Yeah, you ought to be making a move.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	}
	else { // REPEAT, not fucked
		Text.Add("You approach the great and powerful Jenna once more, and the witch raises her head to look you in the eye.", parse);
		Text.NL();
		Text.Add("<i>“My earlier offer that you spurned;<br>", parse);
		Text.Add("Have you reconsidered and thus returned?”</i>", parse);
		Text.Flush();
		
		//[Sure][Nah]
		var options = new Array();
		options.push({ nameStr : "Sure",
			tooltip : "Yeah, you changed your mind.",
			func : function() {
				Text.Clear();
				HalloweenScenes.JennaBroomfuck();
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

HalloweenScenes.JennaSwitchPrompt = function(opts) {
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
			Text.Add("<i>“Let that be a lesson learned<br>", parse);
			Text.Add("To know that although trust is earned<br>", parse);
			Text.Add("Doubting others with needless cause<br>", parse);
			Text.Add("Often results in friendships lost<br>", parse);
			Text.Add("Take only what is truly yours<br>", parse);
			Text.Add("Lest a punishment is par for the course<br>", parse);
			Text.Add("As it happens, you’re in luck<br>", parse);
			Text.Add("I need someone for my broomstick to fuck.”</i>", parse);
			Text.NL();
			
			HalloweenScenes.JennaBroomfuck();
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
			Text.Add("<i>“You ask, then close in and harken<br>", parse);
			Text.Add("Of my task before the moon darkens<br>", parse);
			Text.Add("Of my task before the moon darkens<br>", parse);
			Text.Add("Of dark and dire straits<br>", parse);
			Text.Add("Of the impending doom which awaits.<br>", parse);
			Text.Add("Approaching soon is the witching hour<br>", parse);
			Text.Add("Of the darkest day, when evil’s power<br>", parse);
			Text.Add("Surges forth and covers the land<br>", parse);
			Text.Add("Wreaks havoc and chaos by its hand.<br>", parse);
			Text.Add("Seven nights seven I have woven the threads<br>", parse);
			Text.Add("As fine as silk and as heavy as lead<br>", parse);
			Text.Add("My enchantment to ward the innocent from the sight<br>", parse);
			Text.Add("From the dread horrors poised to stalk the night.<br>", parse);
			Text.Add("Alas, there is one last ingredient left<br>", parse);
			Text.Add("One essential item of which my spell is bereft<br>", parse);
			Text.Add("Distilled essence from a slut<br>", parse);
			Text.Add("The juices of one deep in rut<br>", parse);
			Text.Add("Gathered fresh while in the throes of pleasure<br>", parse);
			Text.Add("Ten thimblefuls, such is the measure<br>", parse);
			Text.Add("Of this essence which I need<br>", parse);
			Text.Add("Be it a woman’s nectar or a man’s seed<br>", parse);
			Text.Add("Yet today you come to my door<br>", parse);
			Text.Add("Perhaps you are what I need, and more<br>", parse);
			Text.Add("Lay yourself down, and at my behest<br>", parse);
			Text.Add("From you this essence my broom will wrest<br>", parse);
			Text.Add("In a twisting, turning, orgasmic ride<br>", parse);
			Text.Add("Pleasure both without and inside<br>", parse);
			Text.Add("For your service, I will handsomely pay<br>", parse);
			Text.Add("you with treasures you will need today.<br>", parse);
			Text.Add("If agreeable to you is this deal<br>", parse);
			Text.Add("Then with a kiss on my lips mark it sealed!”</i>", parse);
			Text.NL();
			Text.Add("Well, that’s quite the interesting proposal. To agree or not to agree, that is the question…", parse);
			Text.Flush();
			
			HalloweenScenes.JennaAgreePrompt({});
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
				
				HalloweenScenes.JennaSwitchPrompt(opts);
			}, enabled : true
		});
	}
	
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.JennaAgreePrompt = function(opts) {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	var werewolf = HalloweenScenes.HW.Werewolf();
	
	//[Agree][Don’t Agree][...What?]
	var options = new Array();
	options.push({ nameStr : "Agree",
		tooltip : "Yeah, sure. You suppose you could agree to that...",
		func : function() {
			Text.Clear();
			Text.Add("You know what? That sure sounds kinky. Yeah, one for broomstick fuckings, please. Without hesitation, you lunge forward and plant a deep kiss on Jenna’s lips with such force that her witch’s hat falls off her head and floats to the ground. She doesn’t care as she leans into you and returns the kiss with equal vigor, your tongues wrestling, her ample milk cans pressing against your [breasts] as her weight presses against you. After what seems like forever, she pulls away with an audible pop and whispers into your ear.", parse);
			Text.NL();
			if(werewolf) {
				Text.Add("<i>“I’ve got a treat just made for a mutt<br>", parse);
				Text.Add("Get down on the ground and prepare your butt.”</i>", parse);
			}
			else {
				Text.Add("<i>“I’ll bespell this place to prevent a mess<br>", parse);
				Text.Add("You, in the meantime, can go and undress.”</i>", parse);
			}
			Text.NL();
			parse["w"] = werewolf ? "" : " stripping yourself of your clothing before";
			Text.Add("You’re only more than eager to do as Jenna asks,[w] getting down on the wooden floor, head down and ass high in the air, ripe for the taking.", parse);
			Text.NL();
			
			HalloweenScenes.JennaBroomfuck();
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
				
				HalloweenScenes.JennaAgreePrompt(opts);
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

HalloweenScenes.JennaBroomfuck = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	HalloweenScenes.HW.flags |= Halloween.Flags.Broomfuck;
	
	var werewolf = HalloweenScenes.HW.Werewolf();
	
	Text.Add("Jenna appraises you with a critical eye, then dances over to her cauldron.", parse);
	Text.NL();
	Text.Add("<i>“Thrice has the horsecock expended itself.<br>", parse);
	Text.Add("Thrice and once the bitch has been bred.<br>", parse);
	Text.Add("The slut moans, ‘I’m coming, I’m coming!’”</i>", parse);
	Text.NL();
	Text.Add("At a beckon of the elven witch’s finger, an old broom flies over from behind the door you entered by, a faint pink glow about its length as her magic animates it. The pink glow only grows brighter as Jenna takes it in her hands, rubbing her palms across its tip; slowly, the ordinary-looking handle changes like putty under her fingers to resemble… why yes, it’s a massive horsecock, almost as thick as your arm and complete with flared tip. Jenna runs her hands up and down the shaft a few times, and ridges and veins surface on the makeshift dildo; guess she’s going all the way and making sure you’re going to have a <i>good</i> time.", parse);
	Text.NL();
	Text.Add("<i>“Lubus Maximus,”</i> Jenna mutters. Great gouts of scented liquid shoot from the elven witch’s fingertips, utterly drenching the shaft of her broomstick; the rest splatters on your ass and rolls down your skin in the most disconcerting fashion, eventually pooling on the ground. Without further ado, Jenna mutters another phrase, and her broomstick rushes forward, forcefully planting its tip squarely in your [anus] with a wet squelch of conjured lube. The force of its entry is more than enough to knock the air out of your lungs, and you can feel your ass clench as the magical phallus adjusts its size to fit you snugly. As the pumping and thrusting begins, your [hips] forced back and forth by the horsecock handle’s vigorous assault, Jenna begins chanting by the cauldron’s side:", parse);
	Text.NL();
	Text.Add("<i>“Round about the cauldron go;<br>", parse);
	Text.Add("In the anal beads throw.<br>", parse);
	Text.Add("Hairball of vulgar, oversexed feline<br>", parse);
	Text.Add("Days and nights has ten and nine<br>", parse);
	Text.Add("Lain unloved, lustful and hot,<br>", parse);
	Text.Add("Boil thou first in the charmed pot.”</i>", parse);
	Text.NL();
	Text.Add("You try to keep up, but the horsecock handle pounding away into your ass has you gasping for breath and your eyes rolling back into your head. It’s thick enough for you to feel like you’re fit to burst any moment, but not <i>actually</i> end up that way, thank goodness. Eventually, though, the broom handle settles into something of a rhythm, pressing every last inch of itself that you can take into your ass while your butt contracts powerfully about the intrusion - whether to better feel it, or in a desperate bid to prevent it from going further into your ass, that’s anyone’s guess. All this time, Jenna has been adding some more reagents to her spell:", parse);
	Text.NL();
	Text.Add("<i>“Three hairs from a puppyslut’s cooch,<br>", parse);
	Text.Add("Into the cauldron to simmer and poach;<br>", parse);
	Text.Add("Blood of ant-girl red and gold,<br>", parse);
	Text.Add("Dark liquid bearing strength untold,<br>", parse);
	Text.Add("Adder's fork and gol queen’s sting,<br>", parse);
	Text.Add("Lizan’s egg and moth-girl’s wing,<br>", parse);
	Text.Add("Bring forth power fit for lording<br>", parse);
	Text.Add("Into my charm of potent warding.”</i>", parse);
	Text.NL();
	parse["w"] = werewolf ? " your already bestial muzzle" : "";
	Text.Add("The gathered arousal is spreading through the rest of your body, sweat beading on your [skin] as you pant and whine,[w] unable to articulate words but knowing what you desperately want more of. Already, your hands feel weak, but you nevertheless move a hand to your [nips] and start rubbing away - it just feels so <i>good</i>, and it’s not fair that only your back half is getting any attention…", parse);
	Text.NL();
	Text.Add("Off in what seems like the far distance, Jenna continues to stir her cauldron, which is now frothing violently:", parse);
	Text.NL();
	Text.Add("<i>“Scale of dragon, tooth of wolf,<br>", parse);
	Text.Add("Demonic draft, maw and gulf<br>", parse);
	Text.Add("Of a freshly-fed fat cunt snake<br>", parse);
	Text.Add("Doomed with eternal thirst to slake.<br>", parse);
	Text.Add("The load of a vixen cumslut<br>", parse);
	Text.Add("Drug-addled and lost in rut,<br>", parse);
	Text.Add("Slippery and slimy, sweet and slick,<br>", parse);
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
	Text.Add("<i>“Honey from twenty horny zil<br>", parse);
	Text.Add("Add to crushed pussyblossom pill<br>", parse);
	Text.Add("Finally, fresh essence of desire<br>", parse);
	Text.Add("Burning fiercer than raging fire,<br>", parse);
	Text.Add("More potent than the finest rum,<br>", parse);
	Text.Add("To this spell I add warm cum.<br>", parse);
	Text.Add("Simmer and stir, then boil it all<br>", parse);
	Text.Add("Steam and smoke, fill my hall!”</i>", parse);
	Text.NL();
	Text.Add("With a <i>fwoosh</i> that fills the entirety of the witch’s hut, a great column of pink smoke rises from the cauldron’s open mouth, spreading outwards before slowly creeping out through the windows and chimney. Slowly, the invisible hands tending to you fade away, and the broomstick pulls itself out of your ass with a slick slurp, leaving a sensation of coolness as chill air invades your gaping asshole.", parse);
	Text.NL();
	Text.Add("At last, the smoke fades somewhat - or at least, enough for you to make out Jenna coming up to you. She’s doused the flame under the cauldron, and stops by your side to give you a pat on the head. You note that the broomstick’s in her hand once more, with absolutely no trace of it ever having been a gigantic wooden horsecock. Maybe that’s for the better.", parse);
	Text.NL();
	Text.Add("<i>“Oh, well done! I commend your pains;<br>", parse);
	Text.Add("And everyone shall share in the gains;<br>", parse);
	Text.Add("For I shall now weave my spell<br>", parse);
	Text.Add("Pulling threads and fixing well<br>", parse);
	Text.Add("Power to fight this dark hell.”</i>", parse);
	Text.NL();
	Text.Add("Ugh. What just happened?", parse);
	Text.NL();
	Text.Add("<i>“A deed without a name,”</i> Jenna declares proudly. <i>“Come now, then, can you stand, or shall I have to lend you a hand?”</i>", parse);
	Text.NL();
	Text.Add("Right, right. A hand it is. You accept the proffered limb gratefully, and stagger upright with Jenna’s help. Ugh - you’re probably not going to be sitting down for a bit after this. Maybe walk funny a little.", parse);
	Text.NL();
	if(HalloweenScenes.HW.flags & Halloween.Flags.Carepack) {
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
		if(HalloweenScenes.HW.flags & Halloween.Flags.PatchesPW) {
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
	
	HalloweenScenes.HW.flags |= Halloween.Flags.PatchesPW;
		
	Gui.NextPrompt();
}

HalloweenScenes.Patches = function() {
	var knowsPatches = patchwork.Met();
	var patchesGender = patchwork.KnowGender();
	var gotCarepack = HalloweenScenes.HW.flags & Halloween.Flags.Carepack;
	var hasPassword = HalloweenScenes.HW.flags & Halloween.Flags.PatchesPW;
	
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
		parse["witch"] = HalloweenScenes.HW.flags & Halloween.Flags.Jenna ? "Jenna" : "the witch";
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
		
		var werewolf = HalloweenScenes.HW.Werewolf();
		
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
		
		HalloweenScenes.HW.flags |= Halloween.Flags.Carepack;
		
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

HalloweenScenes.WakingUp = function(badend) {
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
	
	HalloweenScenes.HW.Restore();
	//Sleep
	world.TimeStep({hour: 8});
	party.RestFull();
	//Return to Eden
	party.location = world.loc.Plains.Nomads.Tent;
	
	Text.NL();
	Text.Add("You feel full. The good food makes you think you can better focus on learning new things.", parse, 'bold');
	
	_.each(party.members, function(ent) {
		Status.Full(ent, {hours: 12, exp: 1.1});
	});
	
	Text.Flush();
	
	Gui.NextPrompt();
}

export { Halloween, HalloweenScenes };
