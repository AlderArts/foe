/*
 * 
 * Define Cassidy
 * 
 */

Scenes.Cassidy = {};

function Cassidy(storage) {
	Entity.call(this);
	this.ID = "cassidy";
	
	// Character stats
	this.name = "Cassidy";
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 2;
	this.body.SetRace(Race.Salamander);
	
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	
	this.flags["Met"]   = Cassidy.Met.NotMet;
	
	this.flags["Order"] = Cassidy.Order.None;
	this.orderTimer = new Time();
	
	//Shop stuff
	this.shop = Scenes.Cassidy.CreateShop();
	this.flags["shop"]     = 0;
	this.shopItems = [];
	this.shopItems.push(Items.Weapons.Dagger);
	this.shopItems.push(Items.Weapons.Rapier);
	this.shopItems.push(Items.Weapons.WoodenStaff);
	this.shopItems.push(Items.Weapons.ShortSword);
	this.shopItems.push(Items.Weapons.GreatSword);
	
	if(storage) this.FromStorage(storage);
}
Cassidy.prototype = new Entity();
Cassidy.prototype.constructor = Cassidy;

Cassidy.Met = {
	NotMet     : 0,
	Met        : 1,
	AskedBack  : 2,
	WentBack   : 3,
	KnowGender : 4,
	//TODO TalkFem
	Feminized  : 5
};

Cassidy.Order = {
	None : 0
};

Cassidy.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	
	this.orderTimer.Dec(step);
}

Cassidy.prototype.FromStorage = function(storage) {
	this.Butt().virgin     = parseInt(storage.avirgin) == 1;
	this.FirstVag().virgin = parseInt(storage.virgin)  == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	
	this.orderTimer.FromStorage(storage.oTime);
}

Cassidy.prototype.ToStorage = function() {
	var storage = {
		avirgin : this.Butt().virgin ? 1 : 0,
		virgin  : this.FirstVag().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	storage.oTime = this.orderTimer.ToStorage();
	
	return storage;
}

//Pronoun stuff
Cassidy.prototype.KnowGender = function() {
	return this.flags["Met"] >= Cassidy.Met.KnowGender;
}
Cassidy.prototype.Feminized = function() {
	return this.flags["Met"] >= Cassidy.Met.Feminized;
}

Cassidy.prototype.heshe = function() {
	if(this.KnowGender()) return "she";
	else return "he";
}
Cassidy.prototype.HeShe = function() {
	if(this.KnowGender()) return "She";
	else return "He";
}
Cassidy.prototype.himher = function() {
	if(this.KnowGender()) return "her";
	else return "him";
}
Cassidy.prototype.HimHer = function() {
	if(this.KnowGender()) return "Her";
	else return "Him";
}
Cassidy.prototype.hisher = function() {
	if(this.KnowGender()) return "her";
	else return "his";
}
Cassidy.prototype.HisHer = function() {
	if(this.KnowGender()) return "Her";
	else return "His";
}
Cassidy.prototype.hishers = function() {
	if(this.KnowGender()) return "hers";
	else return "his";
}
Cassidy.prototype.mfPronoun = function(male, female) {
	if(this.KnowGender()) return female;
	else return male;
}



// Scenes

Scenes.Cassidy.First = function() {
	var parse = {
		playername : player.name
	};
	
	cassidy.flags["Met"] = Cassidy.Met.Met;
	
	Text.Clear();
	Text.Add("Stepping through the open door, you’re greeted by a discernible rise in temperature, as well as the faint smell of smoke - and all this despite the draft you feel flowing in with you. The reason for the heat soon becomes clear, though: a massive forge in the back of the storefront, currently blazing away with yellowish-white flames that’re painful to look directly at. Still, you can vaguely make out a figure amidst it all…", parse);
	Text.NL();
	Text.Add("<i>“Oops! Sorry about that, ace! Was a slow day and thought no one was coming in - I’m just about done, anyway.”</i>", parse);
	Text.NL();
	Text.Add("There’s a faint clink, followed by a loud hiss as clouds of steam erupt into existence before being quickly sucked away by the forge’s hood. When steam and smoke clear, the fire’s died down a little, and you’re able to see who’s addressing you.", parse);
	Text.NL();
	Text.Add("It’s a… boy? Girl? You look over the soot-streaked figure standing before you a few times before deciding that in all probability, he’s a boy. His body’s thin and lanky - not quite the ideal specimen of masculinity, but definitely lacking in the proportions that would mark him as feminine. Voice… a bit ambiguous, but that and the short cut of his fiery red hair… yeah, he’s a guy. A bit androgynous on the side, but it takes all kinds to make a world.", parse);
	Text.NL();
	Text.Add("Besides, there are more interesting details about this fellow for you to take in. His face and torso aside, it’s clear that he’s not human - his arms and legs are coated in a layer of bright red scales, and a long, clearly prehensile reptilian tail swishes lazily behind him. As you look on, he sets down the sword blank and smith’s hammer in his hands, then wipes the worst of the soot off his face and grins at you with a mouthful of slightly pointed teeth.", parse);
	Text.NL();
	Text.Add("<i>“Hey! Are we going to stare at each other all day, or what?”</i>", parse);
	Text.NL();
	Text.Add("Uh… whoa. Hey there. You were just curious about the shop, and decided to step in to take a look…", parse);
	Text.NL();
	Text.Add("A flick of the tail, a wave of a hand. <i>“Oh, look all you want. Not as if I’ve got anything to hide - I’m pretty proud of this place, y’know. Name’s Cassidy, and I run The Pale Flame. You can call me Cass if you like, though.”</i>", parse);
	Text.NL();
	Text.Add("Ah, right. Where are your manners? You quickly introduce yourself.", parse);
	Text.NL();
	Text.Add("<i>“Nice to meet’cha, then, [playername]. You don’t see that very many new faces around Rigard these days… which makes it all the better when you do get to meet someone new. Yeah, I’m a sally-mander. Oh, you don’t need to be bashful about it; I caught you staring just now. It’s perfectly fine to be a little curious when meeting new people, you know.”</i>", parse);
	Text.NL();
	Text.Add("A salamander?", parse);
	Text.NL();
	Text.Add("<i>“Oh, sure. Like this.”</i> Cassidy holds up his fingers, each one tipped with a small, pointed claw. <i>“And like this.”</i> He points down to the similarly-equipped toes and tough, leathery soles of his bare feet. <i>“And best of all, like this.”</i> Before you know it, he’s seized the smith’s hammer he’d just set down with the tip of his tail, waggling it about before setting it down again. <i>“See?”</i>", parse);
	Text.NL();
	Text.Add("Yeah, you see all right. A salamander.", parse);
	Text.NL();
	Text.Add("Cassidy chuckles and sets a hand on the burning coals, leaning lazily against the forge. <i>“Yeah, ace. I know it tends to worry some people, so I like to get these things cleared up when I meet someone new - especially new customers.”</i>", parse);
	Text.NL();
	Text.Add("Customers… that’s right. You came in here to browse. So… The Pale Flame, was it? The sign over the door?", parse);
	Text.NL();
	Text.Add("<i>“You caught sight of it just now, did you? Dad named the place after the hottest of flames, in which he forged the best of his works. We’re mainly a weaponsmith’s here… although I <i>do</i> do armor for the City Watch, it’s all by special order. That was what I was working on when you came in - thought that since I’d had a slow day, I’d catch up on some work instead of lazing about.”</i>", parse);
	Text.NL();
	Text.Add("A weaponsmith, eh? Sounds like a place you’ll have cause to visit often.", parse);
	Text.NL();
	Text.Add("<i>“You don’t say. Eden’s a dangerous place in parts, and you need my goods, so browse up and buy up, like they say! You don’t need to ask what I sell, each and every one of my pieces speak for themselves!”</i>", parse);
	Text.NL();
	Text.Add("You’ll see about that…", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}

// The Pale Flame interior
Scenes.Cassidy.ShopDesc = function() {
	var parse = {};
	
	Text.Add("You’re standing on the shop floor of The Pale Flame. Racks upon racks of implements of assorted death stand in lines and hang on the walls, each and every one of them dust-free and labeled with their name and make. Stabbing, impaling, bludgeoning, crushing, bleeding out, slashing - you name it, and it’s likely Cassidy that has it on display on the floor.", parse);
	Text.NL();
	if(world.time.hour < 11)
		Text.Add("At this hour in the morning, most of Cass’ customers are here on contracted orders rather than walk-in purchases. With how many runners are coming in and out the front door, it sure seems like the salamander’s doing a brisk business. You count amongst them a few members of the City Watch, but most of the standing orders appear to be for mercenary outfits you don’t quite recognize.", parse);
	else if(world.time.hour < 15)
		Text.Add("Now that the morning crowd has thinned a little, people have come in off the street to browse Cassidy’s wares. The bulk of the clientele meander about the racks near the door where the more utilitarian pieces are on display, but there are a few amongst Cass’ clientele who’re richly dressed. These hang around the back, where the more exquisite pieces are displayed in glass cases - weapons made for show, rather than function.", parse);
	else
		Text.Add("Business is beginning to wind down as the sunlight grows long and evening approaches, but there’re still a few prospective customers browsing the racks.", parse);
	Text.NL();
	Text.Add("The shop itself is kept impeccably neat and organized. Walls of white, faded brick have been kept absolutely spotless, giving the shop a simple charm of its own; no additional decorations are required, for Cassidy’s creations are works of art in and of themselves. You catch sight of a ", parse);
	
	var scenes = new EncounterTable();
	
	scenes.AddEnc(function() {
		Text.Add("shining steel sword upon one of the display racks - but the love with which it’s been fashioned is evident. The grip‘s been wrapped in quality leather, the crossguard’s been embossed with a fine floral pattern, but you get the impression that for the modicum of refinement that’s been imparted to it, this is still a very functional weapon.", parse);
		Text.NL();
		Text.Add("A few words have been etched into a plaque attached to its rack:", parse);
		Text.NL();
		Text.Add("<i>Gold spends, friends leave and booze runs dry,</i><br/>", parse);
		Text.Add("<i>But I am a companion for life.</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("hefty battle axe, a weapon for those who don’t need the control, yet want to see things get messy when the blade does connect. Seems like Cass couldn’t help but put a few finishing touches on an otherwise bland project; swirling grooves cover the axe’s crescent head, forming a strangely mesmerizing pattern that gives you a headache when you stare at it for too long.", parse);
		Text.NL();
		Text.Add("A few words have been etched into a plaque attached to its rack:", parse);
		Text.NL();
		Text.Add("<i>You and I, we shall fight as one.</i><br/>", parse);
		Text.Add("<i>We shall live - or die - as one.</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("war hammer, a truly imposing weapon almost as long as you’re tall - something tells you that this weapon wasn’t designed for someone your size. A slightly rounded flat on one end of the tempered steel head for crushing, a curved spike on the other for gouging - one can only wonder at the being that would wield this to the full extent of its potential.", parse);
		Text.NL();
		Text.Add("A few words have been etched into a plaque attached to its rack:", parse);
		Text.NL();
		Text.Add("<i>Be brave and trust in my strength.</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("slender rapier. Keen edge, sharp point - it looks like it weighs practically nothing at all compared to other weapons of its size. The handguard has been decorated with a bronze floral pattern laid on the outside, and the rest of it is bright, shining steel.", parse);
		Text.NL();
		Text.Add("A few words have been etched into a plaque attached to its rack:", parse);
		Text.NL();
		Text.Add("<i>Keep your wit sharp</i><br/>", parse);
		Text.Add("<i>But keep me sharper still.</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("massive flail. The make is deceptively simple - little more than a handle of treated wood, an imposing spiked steel ball, and a stout length of chain connecting the two, but the sheer size and weight of the ball is more than enough to assure you of its efficacy. To make a long story short, a brutish weapon for a brute.", parse);
		Text.NL();
		Text.Add("A few words have been etched into a plaque attached to its rack:", parse);
		Text.NL();
		Text.Add("<i>Me?</i><br/>", parse);
		Text.Add("<i>Just keep walking and swinging</i><br/>", parse);
		Text.Add("<i>and walking and swinging</i><br/>", parse);
		Text.Add("<i>and walking and swinging</i><br/>", parse);
		Text.Add("<i>and crack!</i><br/>", parse);
		Text.Add("<i>Smashed skulls!</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("firm oaken spear. The treated wood of its haft carries no varnish, yet merely touching it gives you the impression that it’s as strong as steel. The ugly barbed head affixed to its end promises much in the way of pain, too - both on insertion and removal.", parse);
		Text.NL();
		Text.Add("<i>I turn the direst of situations around</i><br/>", parse);
		Text.Add("<i>Keep them at bay and you, safe and sound.</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("hefty greatsword, the exact sort of thing you can see Miranda swinging about with a little too much enthusiasm. It also looks solidly built enough to withstand any punishment the dobie might leave in her wake… but that’s another matter altogether. It’s hard. It’s sharp. It’s perfectly made for skewering small things and slicing larger ones in two. Cassidy really went to the wall on this one, you can tell.", parse);
		Text.NL();
		Text.Add("A few words have been etched into a plaque attached to its rack:", parse);
		Text.NL();
		Text.Add("<i>There are times when a strong word suffices.</i><br/>", parse);
		Text.Add("<i>I exist for other times.</i>", parse);
	}, 1.0, function() { return miranda.flags["Bruiser"] >= Miranda.Bruiser.Taught; });
	scenes.AddEnc(function() {
		Text.Add("cruel-looking dagger with a serrated edge and a gilded hilt. Amethysts have been set into sockets on the hilt, and though the steel blade is sharp, it fails to catch the light as you look upon it from different angles.", parse);
		Text.NL();
		Text.Add("A few words have been etched into a plaque attached to its rack:", parse);
		Text.NL();
		Text.Add("<i>At your hip,</i><br/>", parse);
		Text.Add("<i>I you keep.</i><br/>", parse);
		Text.Add("<i>In your hand,</i><br/>", parse);
		Text.Add("<i>Lives I reap.</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("well-made halberd. Edge and point gleaming, the flat of its blade decorated with an intricate sun pattern; it certainly looks like a well-balanced weapon, as far as you know these things.", parse);
		Text.NL();
		Text.Add("A few words have been etched into a plaque attached to its rack:", parse);
		Text.NL();
		Text.Add("<i>Bear me, and with each blow, you shall not fall.</i><br/>", parse);
		Text.Add("<i>Unbowed.</i><br/>", parse);
		Text.Add("<i>Unbroken.</i><br/>", parse);
		Text.Add("<i>Undeterred.</i>", parse);
	}, 1.0, function() { return true; });
	scenes.Get();
	
	Text.NL();
	Text.Add("Tearing your eyes away from Cassidy’s wares, you turn your attention to the rest of the storefront. The counter is there, nestled by the door, but Cassidy isn’t there most of the time anyway. Where the salamander is tends to be by the forge, a massive stone cylinder ringed with runes, although whether they serve any practical purpose or are just for show, only Cass knows. A stone hood channels the smoke away, and a strange foot-operated mechanism works the bellows to feed the flames.", parse);
	Text.NL();
	Text.Add("Of course, the forge isn’t alone - there’s also an anvil, a quenching trough, and a small holding rack for Cass’ tools, amongst other things. Even when not in use, there’s a sense of intense heat which lingers about the forge, keeping would-be meddlers away from the salamander’s workspace.", parse);
	Text.NL();
	Text.Add("Last but not least, there’s a small door in the back wall, which no doubt leads to Cass’ living quarters.", parse);
	Text.NL();
	Text.Add("You pause a moment, and weigh your options.", parse);
	
	var orderReady = (cassidy.flags["Order"] != Cassidy.Order.None) && cassidy.orderTimer.Expired();
	
	if(orderReady) {
		parse = cassidy.ParserPronouns(parse);
		parse["playername"] = player.name;
		
		Text.Add(" Your thoughts, though, are scattered by Cassidy’s voice cutting through them like one of [hisher] swords through… anything, to be honest.", parse);
		Text.NL();
		Text.Add("<i>“Hey, [playername]! I see you over there - your order’s ready to pick up, so march on over and ask about it! Don’t keep me waiting too long, else I might decide to just sell it off to make space!”</i>", parse);
	}
}

Scenes.Cassidy.Approach = function() {
	var parse = {
		
	};
	parse = cassidy.ParserPronouns(parse);
	
	Text.Clear();
	Text.Add("Approaching the shop counter, you call for Cassidy. ", parse);
	
	var scenes = new EncounterTable();
	
	scenes.AddEnc(function() {
		Text.Add("[HeShe]’s currently mounting another one of the shop’s impressive displays - looking at [himher], if [heshe] were human [heshe] wouldn’t be able to lift <i>that</i> over [hisher] head like that.", parse);
		Text.NL();
		Text.Add("Nevertheless, Cass takes [hisher] time in finishing up before responding to your summons, making sure everything is solidly in place and bolted down before joining you.", parse);
		Text.NL();
		Text.Add("<i>“Oh hey, it’s you, ace! You needed me for something?”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("Cassidy’s currently at the forge - you can’t quite make out what it is that [heshe]’s heating in the flames, but whatever it is, it’s a good five minutes or so before Cass finally deigns to set it aside and let it cool, gripping it with a pair of long-handled tongs and setting it aside.", parse);
		Text.NL();
		Text.Add("It’s only with that done that the salamander can turn to you, pulling down [hisher] goggles about [hisher] neck, stopping the bellows and stepping over to join you at the counter.", parse);
		Text.NL();
		Text.Add("<i>“Sorry ‘bout that, ace. Some things can’t be dropped midway.”</i>", parse);
		Text.NL();
		Text.Add("Oh, you understand perfectly. In fact, if anyone should be apologizing, it should be you.", parse);
		Text.NL();
		Text.Add("Cass holds up a hand. <i>“Let’s not get drawn into one of those, okay? Now, you needed me for something?”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("You don’t have long to wait - Cassidy appears soon enough, [hisher] tail dragging on the ground as [heshe] mumbles to [himher]self, a thick daybook in [hisher] hands. Noticing you, [heshe] slams it on the counter and shoves it aside. <i>“You came just in time, ace! I was going to have to - well, it doesn’t matter anymore. You called for me, right?”</i>", parse);
		Text.NL();
		Text.Add("Yep, you sure did.", parse);
		Text.NL();
		Text.Add("<i>“Great! What did you need?”</i>", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	Text.Flush();
	
	Scenes.Cassidy.Prompt();
}

Scenes.Cassidy.Prompt = function() {
	var parse = {
		playername : player.name
	};
	parse = cassidy.ParserPronouns(parse);
	
	var options = new Array();
	
	options.push({ nameStr : "Appearance",
		tooltip : "Give the salamander a once-over.",
		func : Scenes.Cassidy.Appearance, enabled : true
	});
	options.push({ nameStr : "Talk",
		tooltip : "Chat a bit with Cassidy.",
		func : function() {
			Text.Clear();
			if(cassidy.Relation() >= 30) {
				Text.Add("Cass perks up at the suggestion. <i>“Oh, sure! I don’t mind, so long as you understand that I’ve got to break it off if a customer comes round. Gotta watch the time, too… it always seems to fly by when I’m chatting with you.</i>", parse);
				Text.NL();
				Text.Add("<i>“So… got anything in mind you wanna discuss?”</i>", parse);
			}
			else {
				Text.Add("<i>“So, you wanna chat a bit?”</i> Cassidy scratches [hisher] chin in exaggerated thought. <i>“Don’t think I’d mind, I guess. The things that need doing, there’s time to get them done; the things that I don’t wanna do, I guess this is as good an excuse as any to put them off a bit.</i>", parse);
				Text.NL();
				Text.Add("<i>“So! What you got in mind, ace?”</i>", parse);
			}
			Text.Flush();
			Scenes.Cassidy.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Buy",
		tooltip : "See what Cass has for sale on the racks today.",
		func : function() {
			Text.Clear();
			Text.Add("You decide to browse through the racks, displays and glass cases, checking out what Cassidy’s set out on the shop floor today: an assortment of keen edges, sharp points and weighty bludgeons. All of them have been bolted to their displays, and a small sign helpfully instructs you that the displays are just that, and to ask about any purchases you’d like to make.", parse);
			Text.NL();
			Text.Add("Hmm, does anything catch your eye?", parse);
			Text.Flush();
			
			Scenes.Cassidy.ShopBuy();
		}, enabled : true
	});
	options.push({ nameStr : "Sell",
		tooltip : "Hock your excess stuff onto the sally-mander.",
		func : function() {
			//TODO Restrict item type?
			//Cassidy will buy spare weapons and armour off your hands.
			Text.Clear();
			Text.Add("You call Cassidy over, and the salamander wastes no time in sauntering over to the counter, plopping down on it like [heshe] owns the place - which [heshe] does. <i>“So, you’re looking to sell something, ace? Gonna say it one more time, so we’re on the level - I don’t do resale, so I’m only going to buy anything you hock off onto me at scrap values. If you’re cool with that, then we can do business.</i>", parse);
			Text.NL();
			Text.Add("<i>“Now, you wanted me to look at something?”</i>", parse);
			Text.Flush();
			
			Scenes.Cassidy.ShopSell();
		}, enabled : true
	});
	if(cassidy.flags["Met"] < Cassidy.Met.AskedBack) {
		options.push({ nameStr : "Hang Out",
			tooltip : "Ask Cassidy if he’d like to hang out with you for a bit after work.",
			func : function() {
				Text.Clear();
				Text.Add("Leaning forward, you ask if Cass would like to join you for a drink sometime in the evening, after the shop’s closed. Maybe somewhere nice, like the Lady’s Blessing? They have very good drinks there, after all.", parse);
				Text.NL();
				Text.Add("Cassidy arches an eyebrow at you and coughs loudly", parse);
				if(player.Femininity() < 0 && player.Relation() >= 10)
					Text.Add(", wiping soot off his scales as if he’d just noticed it", parse);
				Text.Add(". <i>“Hey hey hey. Wait a minute, ace. You’re asking me to hang out with you?”</i>", parse);
				Text.NL();
				Text.Add("That’s about the long and short of it, yes. Hit the Lady’s Blessing, maybe go out for a few drinks, that kind of thing. ", parse);
				if(cassidy.Relation() < 10) {
					Text.Add("Cass laughs heartily. <i>“Gee, I haven’t been asked that for some time now. Gotta admit, it’s a little flattering. Well, more than a little flattering.</i>", parse);
					Text.NL();
					parse["guygirl"] = player.mfFem("guy", "girl");
					Text.Add("<i>“But seriously, though. I’m sure you’re a very nice [guygirl] and all, but see… I guess I don’t know you well enough for this sort of thing. I mean, I’m not that good at parties and all. When I was little, those kinds of get-togethers always ended up with me and the other guy just staring at each other awkwardly, not sure what to say… I’d really like to avoid that kind of situation, ace.”</i>", parse);
					Text.NL();
					Text.Add("So, that’s a no?", parse);
					Text.NL();
					Text.Add("<i>“Yeah, it’s a no.”</i> Cassidy leans further forward, until you’re aware of just how short the distance between your faces is, and how deep his golden eyes are. <i>“Sorry, ace. That’s how the coal crumbles.”</i>", parse);
				}
				else { //Rel 10+
					Text.Add("<i>“Shit. Well…”</i> Cass bites his lip and looks down at the counter, suddenly very interested in the grain of the wood as he scratches his unruly mop of hair. <i>“I would want to, but there are a few things…”</i>", parse);
					Text.NL();
					Text.Add("Huh? What things?", parse);
					Text.NL();
					Text.Add("<i>“First off, I don’t usually drink. Only for special occasions, and even then I measure that stuff out. We sally-manders, we can’t really handle our drink. Well, we <b>can</b> start, and we <b>can</b> keep going, but stopping… that’s the hard part. It’s a weakness of ours - my great-grandma was a notorious drunkard, which caused my grandma to end up being absolutely disgusted with her mother. So… no drink.”</i>", parse);
					Text.NL();
					Text.Add("Oh-kay…", parse);
					Text.NL();
					Text.Add("<i>“Second thing is… I don’t really like to go out on the town. It’s not just that there’s still work to be done even after I close shop, I’d just rather stay in if there’s nothing in particular that needs my attention out there.”</i>", parse);
					Text.NL();
					Text.Add("Oh…", parse);
					Text.NL();
					Text.Add("Cass takes a deep breath. <i>“But as grandma would say, if you can’t go to the mountain, move the mountain to you. Sure, going out is hard on me, but I wouldn’t mind if you’d want to stay in with me sometime after I close the shop, yeah? Sit around, have a bite to eat, chat a bit, maybe watch me at work? The company would be appreciated - I know it’s probably not what you had in mind, but I really just do feel more comfortable in here than out somewhere like the Lady’s Blessing.”</i>", parse);
					Text.NL();
					Text.Add("Ah… well, that’s an option, too.", parse);
					Text.NL();
					Text.Add("<i>“Trust me,”</i> Cassidy replies, regaining a little of his usual cheery demeanor. <i>“I can make this far more interesting than just staring at each other over mugs of cheap - or even worse, stupidly overpriced - warm drink. You want to stay in with me, ace, you just come in an hour or two before the shop closes - that’s three in the afternoon and onwards - and just hang around until closing time, okay?”</i>", parse);
					Text.NL();
					Text.Add("Yeah, that sounds like a plan. You’ll ask again later, okay?", parse);
					Text.NL();
					Text.Add("<i>“Yeah, sure. Looking forward to it, ace!”</i>", parse);
					Text.NL();
					Text.Add("<b>You may now Head Inside the back with Cassidy near closing time.</b>", parse);
					
					cassidy.flags["Met"] = Cassidy.Met.AskedBack;
				}
				Text.Flush();
				
				world.TimeStep({minute: 15});
				
				Scenes.Cassidy.Prompt();
			}, enabled : true
		});
	}
	else { // Go out back
		options.push({ nameStr : "Head Inside",
			tooltip : "So, does Cass want to stay in with you after closing shop?",
			func : function() {
				Text.Clear();
				if(world.time.hour < 15) {
					Text.Add("You were just about to pop the question, but catch yourself mid-sentence. Yeah, Cass <i>did</i> say to come an hour or two before closing time - this is probably too early for that. If you asked now, you’d just get a refusal and annoy Cassidy in the process. Best to wait this one out; patience is a virtue, after all.", parse);
					Text.Flush();
					Scenes.Cassidy.Prompt();
				}
				else {
					Scenes.Cassidy.HeadInside();
				}
			}, enabled : true
		});
	}
	
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Later!”</i> After wishing you luck, the salamander disappears back into [hisher] shop.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	});
}

Scenes.Cassidy.Appearance = function() {
	var parse = {
		
	};
	parse = cassidy.ParserPronouns(parse);
	
	Text.Clear();
	Text.Add("Cassidy the salamander - or “sally-mander”, as [heshe] pronounces it - is a bit of an oddity for a smith. Standing at five feet and seven inches, [hisher] face and torso are human, but [hisher] arms and legs are distinctly reptilian, with thick red scales covering them like a suit of flexible armor. A fiery, prehensile tail swishes gaily behind [himher], as animated as [heshe] usually is and burning with a merry, bright orange glow, although the heat doesn’t seem to get any more than pleasantly warm.", parse);
	Text.NL();
	Text.Add("Cass’ hair is a fiery red, and sits upon [hisher] head like a disheveled mop of wavy locks. ", parse);
	if(cassidy.Feminized())
		Text.Add("Even though she’s grown it out a bit to better fit the new her, it’s still short enough to not get in her way at the forge and fit nicely into a hairnet to boot.", parse);
	else
		Text.Add("Rather than keep it groomed with all the exhausting work [heshe] does, Cass has chosen to snip it short instead and have it end just below [hisher] ears, saving [himher] the trouble of tidying it up.", parse);
	Text.NL();
	Text.Add("A few stray strands fall from [hisher] brow and over [hisher] eyes, prompting [himher] to brush them away with a sweep of [hisher] fingers. Moving onto Cassidy’s face, you can’t help but feel that [hisher] features ", parse);
	if(cassidy.Feminized())
		Text.Add("are pleasantly feminine. Not that they’ve actually <i>changed</i> any, but now that you know the truth of her sex and the surrounding dressing has changed, you have to admit that her face’s much better suited in a clearly feminine frame than a effeminate boy’s.", parse);
	else if(cassidy.KnowGender())
		Text.Add("look a little more fitting, now that you know that she’s actually a girl. Once the fact that she’s a tomboy has sunk in, the rest of the puzzle has fallen into place about the missing piece - she looks a lot more natural and comfortable now.", parse);
	else
		Text.Add("are quite androgynous, although that’s probably not his fault. It takes all kinds to make a world… and unfortunately, it would seem that young men with effeminate faces are one of them. Well, at least Cass isn’t a sourpuss about it, judging from how much he smiles and grins.", parse);
	Text.NL();
	Text.Add("A smattering of tiny, flexible scales are scattered all over Cassidy’s cheeks, chest and collarbone, reminding you of freckles. Completing the ensemble is a pair of goggles which hangs around Cass’ neck - [heshe] usually uses them to shield [hisher] eyes from soot and ash while working the forge, although right now they’re just for show.", parse);
	Text.NL();
	Text.Add("As usual, Cass is wearing [hisher] forge outfit, consisting of a thick apron, a tunic, and boyish shorts held up by a large belt - all of them fashioned from leather of some sort. That makes sense, considering the heat the runed forge is able to generate; while Cass may be impervious to heat as a salamander, that protection isn’t shared by [hisher] clothes. Padded gloves shield [hisher] hands from wayward blows from [hisher] hammer, their fingers open to let [hisher] short, sharp claws through. Similarly, [heshe] goes around barefoot - those claws on [hisher] toes would easily rip any footwear to shreds, and anything that would pierce the tough pads on Cass’ feet wouldn’t be stopped by a boot sole, anyway.", parse);
	Text.NL();
	Text.Add("Most of Cass is streaked and smeared with soot and ash, badges of [hisher] time at [hisher] craft that [heshe] wears with pride. ", parse);
	if(cassidy.Feminized()) {
		Text.Add("Now that Cass is looking more like a proper girl, you can see the gentle humps of her lady lumps from under her tunic. They’re not very large - somewhere in the region of large As or small Bs - but she’s been moved out of reverse trap territory. That’s the sweet spot - large enough to avoid being mistaken for a boy, and small enough to not get in her way at her craft.", parse);
		Text.NL();
		Text.Add("Yeah, and those hips, the way they pull at her shorts… definitely a tomboyish girl now, instead of an effeminate guy. No way anyone’s making that mistake now.", parse);
		Text.NL();
		Text.Add("<i>“H-hey!”</i>Cassidy hisses at you despite herself, her cheeks beginning to color as she notices you ogling her. <i>“I didn’t do this so you could lech at me in public, you know!”</i>", parse);
		Text.NL();
		Text.Add("Hey, didn’t she once say her body isn’t something she should feel ashamed of? She may not be voluptuous, but even a boyish girl like her has her own charms. It’s just a tool like any other.", parse);
		Text.NL();
		Text.Add("Cass lowers her eyes and mumbles something not quite under her breath, her cheeks reddening even more.", parse);
	}
	if(cassidy.KnowGender()) {
		Text.Add("Now that you know Cass is a girl, a number of oddities fall into place: the almost invisible rises on her chest you always assumed was muscle from working at the forge, the way she walks… her frame is still thin, her hips slender and boyish, but it’s true that she wouldn’t be able to work as effectively at the forge if she were a busty bimbo, what with those assets getting in the way.", parse);
		Text.NL();
		Text.Add("Yeah, it’s understandable why you initially mistook her for a boy… and that far from being the only one to do so; it’s actually quite a common thing.", parse);
	}
	else {
		Text.Add("He definitely doesn’t look like your stereotypical blacksmith - his shoulders are a little too rounded, his build on the lanky side rather than the stout, built-like-a-barrel body you’d expect. In fact, he looks dangerously close to looking quite effeminate… but you guess appearances are deceiving.", parse);
	}
	Text.NL();
	Text.Add("Despite not having a lot of meat, there’s a lot of power in those salamander limbs of Cassidy’s. There has to be, for [himher] to effectively beat and hammer [hisher] goods into shape; what muscles exist under skin and scale are tough and wiry, packed with power just waiting to be let loose.", parse);
	Text.NL();
	Text.Add("All in all, Cass is as cheerful and calm as ever - back straight, head up, and tail off the floor. Just being around [himher], you’re quickly discovering [hisher] mood is quite infectious…", parse);
	Text.Flush();
}

Scenes.Cassidy.TalkPrompt = function() {
	var parse = {
		
	};
	parse = cassidy.ParserPronouns(parse);
	
	//[What’s Up?][Shop][Back]
	var options = new Array();
	options.push({ nameStr : "What’s Up?",
		tooltip : Text.Parse("So… has [heshe] heard anything new?", parse),
		func : function() {
			Text.Clear();
			Text.Add("<i>“New? New? Lemme think…”</i> Cassidy drums [hisher] claws on the counter and taps [hisher] tail on the floor - both of them in time - as [heshe] furrows [hisher] brow in thought.", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			
			// ACT 1 STUFF
			scenes.AddEnc(function() {
				Text.Add("Perhaps you could help [himher] along. Business been good lately?", parse);
				Text.NL();
				Text.Add("Cass looks a little uncertain at that question, the tip of [hisher] tail twitching nervously. At last, [heshe] sighs. <i>“It’s… been better. Oh, don’t get me wrong, I’ve no worries about making enough to get by comfortably. But I wouldn’t be honest with myself if I didn’t admit my margins have been falling of late.”</i>", parse);
				Text.NL();
				Text.Add("Is there any particular reason?", parse);
				Text.NL();
				Text.Add("<i>“Yeah, material costs. Caravans supposed to be vanishing and all of late, so what does make it through goes up in price. It’s troubling - working with the ordinary stuff just keeps me going, but not being able to work at all? Ugh. I’d go out of my mind with boredom in no time flat.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“The rules coming out of the castle have been crazy of late, ace. I’d stay out of notice if I were you.”</i>", parse);
				Text.NL();
				Text.Add("Yeah, you noticed when you tried to get into Rigard.", parse);
				Text.NL();
				Text.Add("<i>“That’s not the least of them, but…”</i> Cassidy eventually lets [hisher] voice trail off, and sighs. <i>“I suppose Preston remembers the favor that my dad did for him and closes one eye.”</i>", parse);
				Text.NL();
				Text.Add("Oh? A favor?", parse);
				Text.NL();
				Text.Add("<i>“Of course, duh. Dad made that breastplate he loves to tote around. Fellow still comes in every so often to have it touched up - I’m not complaining, he tends to overpay me.”</i>", parse);
				Text.NL();
				Text.Add("Huh. Does Preston know that?", parse);
				Text.NL();
				Text.Add("<i>“I don’t go about overcharging folks, y’know. Nah, he knows he’s overpaying me, but does it to show off how deep his pockets are. Like I said, I don’t mind. He gets to feel all hoity-toity, and I stay further in the black. Everyone wins.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“There’s a rumor going around town. Hearsay has it that a portal opened up and someone fell through.”</i>", parse);
				Text.NL();
				Text.Add("You feign surprise as best as you can. Oh?", parse);
				Text.NL();
				Text.Add("<i>“Yeah. It’s funny that when my dad was born, this wouldn’t be so much as blinked at, but now it’s some kinda big thing. Familiarity breeds contempt, as they say.”</i>", parse);
				Text.NL();
				Text.Add("So… what <i>is</i> it that [heshe]’s heard about this portal-person, anyway?", parse);
				Text.NL();
				parse["pheshe"] = player.mfFem("he", "she");
				Text.Add("<i>“Anything and everything. That [pheshe]’s supposed to save the world - that ranks up right there with destroying it, too. That the space-time thingy is getting unstable. That Eden sure is getting more dangerous, and that it’s an omen that you should bet on the lottery next week. That kind of good stuff.”</i>", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
			
			cassidy.relation.IncreaseStat(10, 1);
			world.TimeStep({minute: 10});
			
			Text.Flush();
			Scenes.Cassidy.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Shop",
		tooltip : Text.Parse("So… The Pale Flame. Sounds like it’s got a bit of history.", parse),
		func : function() {
			Text.Clear();
			Text.Add("<i>“It does,”</i> Cass replies. <i>“There might not be as much history floating about this place as there is about… say, Rigard Castle - it’s not as if I inherited the forge from my father’s father’s father’s father, who in turn got it from his mother’s grandfather on his father’s side. You know, that kind of lineage the nobles like to tote around. Nevertheless, it’s <b>my</b> history and my dad’s, and I’m proud enough of it that I don’t mind telling the story every now and then.”</i>", parse);
			Text.NL();
			Text.Add("Sounds like [heshe] really likes that bit of history.", parse);
			Text.NL();
			Text.Add("Cassidy puffs out [hisher] chest proudly. Not very impressive, but it’s the thought that counts, isn’t it? <i>“Like I said, it’s mine. You’ve gotta know where you come from, both the good and the bad; it’s only then that you don’t have to go wherever you’re going blind.</i>", parse);
			Text.NL();
			Text.Add("<i>“Anyways, I’m rambling a bit. Dad set up this place back in the day, some time ‘fore I was born. That was kinda about thirty, forty years ago? Grandma knew that we ‘manders were supposed to have an instinctive knack for working metal - and while she never did have the chance to do it herself, she found the nearest smith and got Dad apprenticed to a fellow in Afaris once he could walk, lift and carry. Out the door and doing useful work, like he did with me, too.”</i>", parse);
			Text.NL();
			Text.Add("Right. You motion for Cass to go on.", parse);
			Text.NL();
			Text.Add("<i>“It really is quite straightforward, to be honest. Unsurprisingly, dad shows lots of aptitude for the forge. He works hard, shows oodles of promise, and soon enough, it’s time for him to come in on his own.</i>", parse);
			Text.NL();
			Text.Add("<i>“Now, he isn’t inheriting his master’s forge - in those rural places, the only real way to do that is to marry the smith’s daughter, and dad’s old master has already got that covered with a son of his own. It looks like dad’s going to be stuck as a forgehand for the rest of his life, but then his old master knew some people in the merchants’ guild down in Rigard, and vouches for dad’s workmanship.”</i>", parse);
			Text.NL();
			Text.Add("Cass’ dad must’ve made quite the impression for that to happen.", parse);
			Text.NL();
			Text.Add("A smile. <i>“Not surprising, ace. Talent in the blood plus hard work in the soul? A winning combination, that’s what that is. The merchants’ guild agreed to loan dad the sum needed to get started at very reasonable rates; their investment wasn’t poorly made, as he paid off the loan within two years. Wasn’t a small sum, either. In the end, he turned out to be more skilled than his old master was. There’s nothing better for a teacher than to see your student grow beyond you.”</i>", parse);
			Text.Flush();
			world.TimeStep({minute: 5});
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("Did he get any trouble during the civil war? If he looked anything like Cass does, he’d have been in a boatload of trouble… that, and his affiliation with the merchants’ guild would’ve painted a target on his back, wouldn’t it?", parse);
				Text.NL();
				Text.Add("<i>“Naaaah. The Royal Guard gets a fair number of their armaments straight from here. If they roughed up dad, they’d have been shooting themselves in the foot. It’s not as if he got off unscathed, true, but it was almost nothing compared to what some suffered.</i>", parse);
				Text.NL();
				Text.Add("<i>“It’s like there’s this unspoken agreement,”</i> Cassidy continues, flashing you one of [hisher] winning, pointy-toothed grins. <i>“They say to each other, ‘whatever happens, don’t touch The Pale Flame’. Not to boast, but we sally-manders are just <b>that</b> good. I suppose it also helped that dad had the smarts to keep his head down and not cause trouble, especially with a kid running around the place and another on the way.”</i>", parse);
				Text.NL();
				Text.Add("Not too bad an idea. Having children can settle down people a lot.", parse);
				Text.NL();
				Text.Add("<i>“He really was a good guy. You see those little blurbs by each of the displays? Dad started that little habit of trying to bring out the personality of each piece he made, and I’ve tried to keep the custom going. Anyways, time comes when he wants to retire, and my brother has other ideas… so it’s up to me to keep the family business running, I guess. He stays for a couple months to make sure I don’t mess things up, then takes mom and heads back to the hills to enjoy his dotage.”</i>", parse);
				Text.NL();
				Text.Add("That’s quite the tale.", parse);
				Text.NL();
				Text.Add("<i>“It’s the short version, I’d say; I’m on the clock, after all. Maybe when we have the time, I’ll sit you down and give you the long story.”</i>", parse);
				Text.Flush();
				
				cassidy.relation.IncreaseStat(10, 1);
				world.TimeStep({minute: 5});
				
				Scenes.Cassidy.TalkPrompt();
			});
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("Cass shrugs in an easy, lazy motion and leans on the counter. <i>“Sure! Need anything else?”</i>", parse);
		Text.Flush();
		
		Scenes.Cassidy.Prompt();
	});
}

Scenes.Cassidy.ShopBuy = function() {
	var parse = {};
	
	Scenes.Cassidy.Shopbought = false;
	
	var backPrompt = function() {
		Text.Clear();
		if(Scenes.Cassidy.Shopbought)
			Text.Add("Nah, that’ll be all. You’ve made enough purchases for right now.", parse);
		else
			Text.Add("On second thought, maybe you’re not going to buy anything today after all. Impulse purchases are hardly the wisest of actions, and thrift is a virtue, right?", parse);
		Text.Flush();
		
		Scenes.Cassidy.Prompt();
	}
	
	var buyFunc = function() {
		Scenes.Cassidy.Shopbought = true;
		return false;
	}
	
	var timestamp = Math.floor(world.time.ToDays());
	if(cassidy.flags["shop"] < timestamp || cassidy.shop.inventory.length == 0) {
		// Randomize inventory
		cassidy.shop.inventory = [];
		
		var shopPool = _.clone(cassidy.shopItems);
		
		var num = _.random(4, 7);
		_.times(num, function() {
			var it = _.sample(shopPool);
			if(!it) return false;
			_.pull(shopPool, it);
			
			cassidy.shop.AddItem(it, 5, null, buyFunc);
		});
		
		cassidy.flags["shop"] = timestamp;
	}
	
	cassidy.shop.Buy(backPrompt, true);
}

Scenes.Cassidy.ShopSell = function() {
	var parse = {};
	parse = cassidy.ParserPronouns(parse);
	
	Scenes.Cassidy.Shopsold = false;
	
	var backPrompt = function() {
		Text.Clear();
		if(Scenes.Cassidy.Shopsold) {
			Text.Add("That’s all you’ve got at the moment.", parse);
			Text.NL();
			Text.Add("<i>“Okay, then. You’re the boss. Anything else you need here?”</i>", parse);
		}
		else
			Text.Add("Cass just rolls [hisher] eyes at you and shrugs in [hisher] easygoing manner. <i>“Changed your mind, ace? Okay, then! I’ve got a bit of other stuff to do, but just call for me again if you need anything else!”</i>", parse);
		Text.Flush();
		
		Scenes.Cassidy.Prompt();
	}
	
	var sellFunc = function() {
		Scenes.Cassidy.Shopsold = true;
		return false;
	}
	
	cassidy.shop.Sell(backPrompt, true, sellFunc);
}

Scenes.Cassidy.CreateShop = function() {
	return new Shop({
		buyPromptFunc : function(item, cost, bought) {
			var coin = Text.NumToText(cost);
			var parse = {
				item : item.sDesc(),
				coin : coin
			};
			parse = cassidy.ParserPronouns(parse);
			if(!bought) {
				Text.Clear();
				Text.Add("Right. Stepping up to Cassidy, you inquire about buying the [item] for yourself, if it’s not too much of a bother. ", parse);
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Nah, it’s no bother - always happy to serve a reasonable customer. For you, that’ll be [coin] coins.”</i>", parse);
					Text.NL();
					Text.Add("For you? Why, you feel so special and treasured!", parse);
					Text.NL();
					Text.Add("Cass shows you [hisher] teeth. <i>“Thing about you, ace? Sometimes, I can’t tell if you’re serious or kidding. But yeah, [coin] coins, them’s the breaks. You want it?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Oh, that’s a good choice you have there,”</i> Cass replies, studying you up and down as if you were a really tasty morsel. <i>“Really fits you - you look braver just holding it. How about [coin] coins?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Cassidy frowns. <i>“That one? I didn’t think - well, if you want to… [coin] coins if you wanna take that baby of mine home, I guess.”</i>", parse);
					Text.NL();
					Text.Add("Hey, why the sudden reluctance? This is a shop, isn’t it?", parse);
					Text.NL();
					Text.Add("The salamander grins weakly and looks away, unable to meet your eyes. <i>“Yeah, I get that. Problem is, well, it’s sometimes hard to see them go… look, if you want her, just pay up and you can have her.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.Get();
				Text.NL();
			}
		},
		buySuccessFunc : function(item, cost, num) {
			var parse = {
				num : num > 1 ? "them" : "it",
				her : num > 1 ? "them" : "her",
				y   : num > 1 ? "ies" : "y"
			};
			parse = cassidy.ParserPronouns(parse);
			
			Text.Clear();
			Text.Add("<i>“Gotcha. Give me a moment, and I’ll have [num] ready for you.”</i>", parse);
			Text.NL();
			Text.Add("As you watch, Cass nips over to the racks behind the counter and draws out what you selected from [hisher] stock, holding [num] up for your inspection.", parse);
			Text.NL();
			Text.Add("<i>“You wanna make sure there’s nothing wrong with [her] before I wrap [her] up?”</i>", parse);
			Text.NL();
			Text.Add("Nah, it’s fine. You’ll trust [himher].", parse);
			Text.NL();
			Text.Add("<i>“All right then, ace! You take good care of my bab[y], you hear?”</i> Before too long, Cass passes you a small bundle wrapped in oilcloth. <i>“Hope you have a good time together!”</i>", parse);
			Text.NL();
			Text.Add("<i>“Right! You want anything else?”</i>", parse);
			Text.NL();
			
			cassidy.relation.IncreaseStat(30, 2);
		},
		buyFailFunc : function(item, cost, bought) {
			var parse = {
				
			};
			parse = cassidy.ParserPronouns(parse);
			
			Text.Clear();
			Text.Add("Hmm. On second thought, maybe not.", parse);
			Text.NL();
			Text.Add("<i>“Changed your mind?”</i> Cass’ tail seems a little warmer and more agitated than normal - its tip twitches to and fro on the ground. <i>“Anything wrong with it?”</i>", parse);
			Text.NL();
			Text.Add("No, no, there’s nothing wrong with [hisher] workmanship. You just thought better of it, that’s all.", parse);
			Text.NL();
			Text.Add("<i>“Oh, all right then. If you say so.”</i> Cass still looks worried and unsure, but you guess that just shows how seriously [heshe] takes [hisher] work. <i>“You still interested in something?”</i>", parse);
			Text.NL();
		},
		sellPromptFunc : function(item, cost, sold) {
			var coin = Text.NumToText(cost);
			var parse = {
				item : item.sDesc(),
				coin : coin
			};
			parse = cassidy.ParserPronouns(parse);
			
			if(!sold) {
				Text.Clear();
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("Cass throws your proffered item a quick glance of [hisher] expert eye. <i>“Yeah, ace. For that, I’ll do [coin] coins, perfectly reasonable price to me. Sound good to you?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Cass makes a show of examining your proffered item, then grins and snaps [hisher] fingers with an audible click of [hisher] claws. <i>“Okay, here’s my offer: [coin] coins. Deal, or no deal?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Cass looks down at your offering. <i>“Hmm. Hmmmmmmm.”</i>", parse);
					Text.NL();
					Text.Add("Hmm?", parse);
					Text.NL();
					Text.Add("<i>“Hmm.”</i> [HeShe] looks up at you. <i>“I guess I can do [coin] coins, if you’d like. Scrap value isn’t usually worth a lot.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.Get();
				
				Text.NL();
			}
		},
		sellSuccessFunc : function(item, cost, num) {
			var parse = {
				
			};
			parse = cassidy.ParserPronouns(parse);
			
			Text.Clear();
			Text.Add("Sure, some price is better than no price, after all. You pass your offering over to Cass, who lazily grabs it with [hisher] tail and tosses into the scrap heap with a bunch all the other waste waiting to be reforged.", parse);
			Text.NL();
			Text.Add("<i>“That’ll do, that’ll do… damn, I really hate bookkeeping…”</i> the salamander mutters as [heshe] scribbles in a ledger, then slams it shut and counts out your money. <i>“Okay, there I go, and here you are. Enjoy!”</i> ", parse);
			Text.NL();
		},
		sellFailFunc : function(item, cost, sold) {
			var parse = {
				item : item.sDesc()
			};
			parse = cassidy.ParserPronouns(parse);
			
			Text.Clear();
			Text.Add("<i>“Eh? Suit yourself,”</i> Cass replies with a shrug. <i>“I guess it’s a better fate than being taken apart and melted down for scrap...there’s still some use out of it, really. You want to sell anything else?”</i>", parse);
			Text.NL();
		}
	});
}

Scenes.Cassidy.HeadInside = function() {
	var parse = {
		playername : player.name
	};
	parse = cassidy.ParserPronouns(parse);
	
	Text.Add("So, does [heshe] want to stay in a bit with you after work?", parse);
	Text.NL();
	if(cassidy.Relation() >= 50) {
		Text.Add("Crossing over to your side of the counter, Cass breaks out into a big smile and hugs you tightly, [hisher] tail practically ablaze with amber light.", parse);
		Text.NL();
		Text.Add("<i>“Yeah, ace. I’ve been waiting for you to ask - been looking forward to it for a while. Just let me close up the shop, and I’ll be with you in a jiffy.”</i>", parse);
	}
	else if(cassidy.Relation() >= 30) {
		Text.Add("<i>“Sure! I always enjoy your little visits, you know. For someone who isn’t family to see me and yet not on business… it’s much appreciated.”</i>", parse);
		Text.NL();
		Text.Add("Of course. You, naturally, have the same sentiments [heshe] does.", parse);
		Text.NL();
		Text.Add("<i>“Ah! Not flattery, my greatest weakness!”</i> Cass balls a fist and playfully punches you in the chest. <i>“Okay, ace. Just give me some time to close up the shop, and I’ll be with you.”</i>", parse);
	}
	else {
		Text.Add("Cassidy smiles at the suggestion, drumming [hisher] claws on the counter. <i>“Yeah, sure. It’s nice to have company over; being able to talk to people in a place I’m comfortable in is a nice thing to be able to do. I was about to start closing up the shop anyway.”</i>", parse);
	}
	Text.NL();
	Text.Add("Cassidy is good to [hisher] word. With how meticulous the salamander is about everything [heshe] does, it’s little wonder that the process of closing up takes all the way from now until closing time. The forge has to be cooled, the displays set and dusted, the books balanced and finally, the last customers ushered out the door. It’s only then that Cass bars it with the two of you inside, then turns to you.", parse);
	Text.NL();
	Text.Add("<i>“Thanks for waiting, [playername]. Let’s head into the back.”</i>", parse);
	Text.NL();
	Text.Add("Without another word, Cassidy heads for the little door in the back of the shop, grasping the handle in a scaly hand and yanking it open. [HeShe] steps inside, then grins and gestures for you to follow.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	
	scenes.AddEnc(function() {
		Text.Add("<i>“Come on in,”</i> [heshe] says. <i>“I won’t bite. Or maybe I will, but not very hard. Don’t worry about it.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Welp, I’m officially inviting you in. Grandma always said it was important to properly invite guests in when you had them over; helps make them feel at ease amongst other things. So don’t be shy, okay?”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Welcome to my humble abode. I -”</i> Cassidy hasn’t finished the second sentence before [heshe] drops the faux-serious voice and breaks out into a fit of chuckles. <i>“Aah, I can’t do this with a straight face. Sorry, granddad. But yeah, come on in, ace! No point standing out there.”</i>  ", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	var first = cassidy.flags["Met"] < Cassidy.Met.WentBack;
	
	if(first) {
		cassidy.flags["Met"] = Cassidy.Met.WentBack;
		Text.Add("Tailing closely behind Cassidy, you step into what looks to be a small-ish living room-cum-kitchen - there’s a grated fireplace in one corner of the room, a dining table situated close by to let diners back in both warmth and light of the flames whilst they eat.", parse);
		Text.NL();
		Text.Add("On the opposite end of the room, a small kitchen - like the forge, it has a hood to draw away the grease and fumes of cooking, and that aside, it’s quite well-equipped. Racks of preserves line the walls alongside a small grain bin; it seems that Cassidy’s tastes in food lie along the spicy. There’re also two doors on either side of the room, each leading to different bedrooms.", parse);
		Text.NL();
		Text.Add("<i>“That one on the left is where mom and dad slept, and I shared the other with big brother when we were growing up. Since everyone’s gone now, I’ve moved into dad’s room, and the old one’s been turned into a store.”</i>", parse);
		Text.NL();
		Text.Add("Right. In between the two, a handful of decorations: a small painting of two salamanders against a mountain backdrop, presumably Cassidy’s grandparents. A few lumps of colorful minerals you don’t quite recognize on a mantlepiece; a few metallic, the rest crystalline.", parse);
		Text.NL();
		Text.Add("And finally, in a place of honor above the fireplace, a truly beautiful blade, three and a half feet of the purest, shining steel you have ever seen. The hilt is fashioned of bronze, with gold inlays along the outside of the crossguard. They may have depicted something once, but now they’ve been faded beyond recognition.", parse);
		Text.NL();
		Text.Add("Cass’ voice cuts through your thoughts. <i>“Like it?”</i>", parse);
		Text.NL();
		Text.Add("It truly is a beautiful blade, yes.", parse);
		Text.NL();
		Text.Add("The salamander grins. <i>“We’re pretty proud of that piece, because it’s got a bunch of history with us sally-manders. You see, there’s this ancient legend about grandma’s old world that she used to tell me.</i>", parse);
		Text.NL();
		Text.Add("<i>“As the story goes, a pair of salamander master smiths - they were brothers to boot - sought out a great dragon, stole from his horde the first steel that world had ever seen, and forged it into a magic sword.  It was so beautiful, the legend went, that the local spirit of that world took it for her own and gave it to the greatest of her champions for generations: once even to their own descendants.”</i>", parse);
		Text.NL();
		Text.Add("Wow.", parse);
		Text.NL();
		Text.Add("Shaking his head, Cassidy grips you lightly by the shoulders, but firmly enough that you can feel his claws pricking you. <i>“No need to look so amazed, ace. That up there’s probably not the real deal. As with any famous thingamajig, forgeries were soon made and foisted upon the unwitting; this is probably one of them.”</i>", parse);
		Text.NL();
		Text.Add("A forgery? But it indeed is a work of art…", parse);
		Text.NL();
		Text.Add("<i>“Well, duh.”</i> Cass lets go of your shoulders, rolls his eyes and claps his hands, a smack that resounds in the stillness of the room. <i>“You’re trying to make a passable fake of a beautiful sword, of course it’s got to be beautiful.”</i>", parse);
		Text.NL();
		Text.Add("Oh. Then why is it in that place of honor?", parse);
		Text.NL();
		Text.Add("<i>“Because it’s one of the few things grandma took from her old world. She might’ve had good claws, but she needed a proper weapon for the road. I dunno how great-granddad came across the blade, but she swiped it from him the night she left for good. Later on, when dad left for Rigard to start The Pale Flame, she gave it to him to keep him safe on the road. And now that dad’s retired…”</i>", parse);
		Text.NL();
		Text.Add("Ah, you see.", parse);
		Text.NL();
		Text.Add("<i>“It may not be any magical sword,”</i> Cass replies after a small pause. <i>“But it’s ours, we’ve got history with it, and I’ll be damned if it doesn’t look great hanging there. Whatever it got up to in the past, its days are now over.</i>", parse);
		Text.NL();
		Text.Add("<i>“Anyways! Enough talking about the past, let’s get to business!</i>", parse);
		
		world.TimeStep({minute: 30});
	}
	else {
		Text.Add("You’ve been invited in; no need to hold back. Stepping past the threshold, you enter to meet the familiar sight of Cassidy’s dining room.", parse);
	}
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Just make yourself comfortable at the table,”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“You know, that table looks much better now. It was always made for more than one, after all,”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Don’t mind the mess, I was in a hurry this morning and didn’t manage to do any cleaning up.”</i>", parse);
		Text.NL();
		Text.Add("What mess?", parse);
		Text.NL();
		Text.Add("<i>“This mess! Look, just sit down for a bit,”</i>", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.Add(" Cass tells you. <i>“I’ll be back in a jiffy with a bite and a drink.”</i>", parse);
	Text.NL();
	Text.Add("With that, the salamander nips over to the kitchen. [HeShe]’s good to [hisher] word - before long, Cassidy is lounging on the seat across you, a plate of cold curried buns and a pitcher of water on the table.", parse);
	Text.NL();
	Text.Add("<i>“Not too much, now. Or at least, if you want to be having dinner later.”</i>", parse);
	Text.NL();
	Text.Add("Who is [heshe], your mother? [HeShe]’s far from old enough for that.", parse);
	Text.NL();
	Text.Add("<i>“Suit yourself, ace; I hope you brought a big appetite. Now,”</i> [heshe] pours [himher]self a glass from the pitcher, <i>“What’cha wanna do this evening? Chat a bit and do some catching up? Have some proper food?”</i>", parse);
	if(cassidy.KnowGender() && cassidy.Relation() >= 50) {
		Text.NL();
		Text.Add("Silence.", parse);
		Text.NL();
		Text.Add("<i>“H-hey. That look in your eye. You’re thinking of something else, aren’tcha, ace?”</i> Cassidy’s voice chokes a little. <i>“I’ll just have you know that I don’t blush that easy…”</i>", parse);
		Text.NL();
		Text.Add("You didn’t say anything, you know. Maybe it was all just her imagination?", parse);
		Text.NL();
		Text.Add("<i>“If you wanna just skip all that funny business and get down to it…”</i> the salamander cracks her knuckles. <i>“I’m not gonna back down from a challenge either, ace.”</i>", parse);
	}
	Text.Flush();
	
	world.TimeStep({minute: 15});
	
	Scenes.Cassidy.InsidePrompt();
}

//TODO PLACEHOLDER
Scenes.Cassidy.InsidePrompt = function() {
	var parse = {
		playername : player.name
	};
	parse = cassidy.ParserPronouns(parse);
	
	//[name]
	var options = new Array();
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
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
		Text.Flush();
		
		//TODO Move out
		Gui.NextPrompt();
	});
}

/* TODO

 */
