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
	
	/* TODO
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	*/
	this.flags["Met"]   = Cassidy.Met.NotMet;
	
	if(storage) this.FromStorage(storage);
}
Cassidy.prototype = new Entity();
Cassidy.prototype.constructor = Cassidy;

Cassidy.Met = {
	NotMet     : 0,
	Met        : 1,
	WentBack   : 2,
	KnowGender : 3
};

Cassidy.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	//TODO Timers
}

Cassidy.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Cassidy.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

//Pronoun stuff
Cassidy.prototype.KnowGender = function() {
	return this.flags["Met"] >= Cassidy.Met.KnowGender;
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
	
	var orderReady = false; //TODO
	
	if(orderReady) {
		parse = cassidy.ParserPronouns(parse);
		parse["playername"] = player.name;
		
		Text.Add(" Your thoughts, though, are scattered by Cassidy’s voice cutting through them like one of [hisher] swords through… anything, to be honest.", parse);
		Text.NL();
		Text.Add("<i>“Hey, [playername]! I see you over there - your order’s ready to pick up, so march on over and ask about it! Don’t keep me waiting too long, else I might decide to just sell it off to make space!”</i>", parse);
	}
}
