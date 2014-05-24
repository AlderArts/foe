/*
 * 
 * Town area that can be explored
 * 
 */

// Create namespace
world.loc.Rigard = {
	Gate         : new Event("Main Gate"),
	Barracks     : 
	{
		common   : new Event("Barracks commons"),
		sparring : new Event("Sparring yard"),
		captains : new Event("Captains quarters")
	},
	
	
	
	Residental   :
	{
		street   : new Event("Residental street"), // Will also contain gate to slums
		tavern   : new Event("Maidens' bane"),
		miranda  : new Event("Miranda's house")
	},
	
	Brothel      :
	{
		brothel  : new Event("Brothel"),
		cellar   : new Event("Brothel: Cellar")
	},
	
	Plaza        : new Event("Plaza"),
	Inn          :
	{
		common    : new Event("Lady's Blessing"),
		backroom  : new Event("Back room"),
		cellar    : new Event("Cellar"),
		room      : new Event(function() { return "Room " + rigard.LB["RoomNr"]; }),
		room69    : new Event("Room 369"),
		penthouse : new Event("Penthouse")
	},
	
	Slums        :
	{
		gate     : new Event("Peasants' Gate")
	},
	Tavern       :
	{
		common   : new Event("Maidens' Bane")
	}
}

Scenes.Rigard = {};

// Class to handle global flags and logic for town
function Rigard(storage) {
	this.flags = {};
	
	// TODO: Store
	this.ClothShop = new Shop();
	this.ClothShop.AddItem(Items.Equinium, 5);
	
	// Have accessed town (not necessarily free access)
	this.flags["Visa"] = 0;
	this.flags["CityHistory"] = 0;
	// Have access to royal grounds (not necessarily free access)
	this.flags["RoyalAccess"] = 0;
	this.flags["RoyalAccessTalk"] = 0;
	
	this.flags["TalkedStatue"] = 0;
	
	this.flags["TailorMet"]   = 0;
	this.flags["BuyingExp"]   = 0;
	
	
	this.LB = {};
	this.LB["Visit"]    = 0;
	this.LB["Orvin"]    = 0;
	this.LB["Orvin69"]  = 0;
	this.LB["CityTalk"] = 0;
	this.LB["RotRumor"] = 0;
	this.LB["Efri"]     = 0;
	this.LB["RoomNr"]   = 0;
	this.LB["Tea"]      = 0;
	this.LB["Lizan"]    = 0;
	this.LB["Elven"]    = 0;
	this.LB["Fairy"]    = 0;
	this.LB["Red"]      = 0;
	this.LBroomTimer    = new Time();
	
	// Non-permanent
	this.RotOrvinInnTalk = 0;
	
	this.Krawitz = {};
    this.Krawitz["Q"]    = 0; // Krawitz quest status
    this.Krawitz["Work"] = 0; // 
    this.KrawitzWorkDay  = null; // Time
	this.Krawitz["Duel"] = 0; // 0 = no, 1 = superwin, 2 = win, 3 = loss
	
	if(storage) this.FromStorage(storage);
}

Rigard.prototype.ToStorage = function() {
	var storage = {};
	
	storage.flags   = this.flags;
    storage.Krawitz = this.Krawitz;
	storage.LB      = this.LB;
	storage.LBroom  = this.LBroomTimer.ToStorage();
	if(this.KrawitzWorkDay)
		storage.KWork   = this.KrawitzWorkDay.ToStorage();
	
	return storage;
}

Rigard.prototype.FromStorage = function(storage) {
	this.LBroomTimer.FromStorage(storage.LBroom);
	if(storage.KWork) {
		this.KrawitzWorkDay = new Time();
		this.KrawitzWorkDay.FromStorage(storage.KWork);
	}
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
    for(var flag in storage.Krawitz)
        this.Krawitz[flag] = parseInt(storage.Krawitz[flag]);
	for(var flag in storage.LB)
		this.LB[flag] = parseInt(storage.LB[flag]);
}

Rigard.prototype.Update = function(step) {
	this.LBroomTimer.Dec(step);
}

Rigard.prototype.Visa = function() {
	return this.flags["Visa"] != 0;
}

// TODO: add other ways
Rigard.prototype.Access = function() {
	return this.Visa();
}

Rigard.prototype.GatesOpen = function() {
	return world.time.hour >= 8 && world.time.hour < 5;
}

Scenes.Rigard.CityHistory = function() {
	Text.Clear();
	var parse = {};
	
	if(party.location == world.loc.Rigard.Plaza) {
		parse.person = "a well-dressed youngster";
		parse.finish = "after ruffling her hair,";
	}
	else if(party.location == world.loc.Rigard.ShopStreet.street) {
		parse.person = "a cleanly-dressed young cat-girl";
		parse.finish = "after scratching behind her ears,";
	}
	else if(party.location == world.loc.Rigard.Residental.street ||
		    party.location == world.loc.Rigard.Slums.gate) {
		parse.person = "a shabbily-dressed young dog-girl";
		parse.finish = "after scratching behind her ears,";
    }
	else if(party.location == world.loc.Rigard.Gate) {
		parse.person = "a straight-backed youngster";
		parse.finish = "after ruffling her hair,";
	}
	
	// Disable the scene from proccing more times
	rigard.flags["CityHistory"] = 1;
	
	Text.Add("You're walking through the streets, looking around, when you're approached by [person].", parse);
	Text.NL();
	Text.Add("<i>\"You're new here, aren't you?\"</i> she asks. <i>\"Everyone else just walks past everything without even glancing, but you're constantly looking around!\"</i>", parse);
	Text.NL();
	Text.Add("You admit that you're indeed new to the city.", parse);
	Text.NL();
	Text.Add("<i>\"Want me to show you around? I've got nothing better to do just now anyway.\"</i>", parse);
	Text.NL();
	Text.Add("You politely decline, saying you mostly know where things are, but ask if she could tell you about the history of the city.", parse);
	Text.NL();
	Text.Add("<i>\"Mm... well, I'm not much for that sort of thing,\"</i> she tells you, <i>\"but everyone knows the story of the founding! Wanna hear that?\"</i> When you nod your agreement, she continues. <i>\"A long long time ago, this land was only inhabited by scattered tribes of pure humans ", parse);
	// If morph
	if(party.location == world.loc.Rigard.ShopStreet.street ||
	   party.location == world.loc.Rigard.Residental.street ||
	   party.location == world.loc.Rigard.Slums.gate)
		Text.Add("- although my parents tell me that's just something the humans made up - ", parse);
	Text.Add("who sometimes fought with each other, and sometimes got along. But then, in one of the weaker tribes was born Riordain, along with his twin brother Riorbane.\"</i>", parse);
	Text.NL();
	Text.Add("<i>\"Riorbane was way cooler than his brother, and had lots of awesome adventures!\"</i> the girl exclaims. <i>\"But the adults mainly honor Riordain because he ended up founding the kingdom. I'm not sure how he did it, but he got all the humans to follow him, and they built the castle you can see over there,\"</i> she tells you, waving over at the castle towering above the city, <i>\"to be the capital of the new kingdom. The city was named Rigard in Riordain's honor.\"</i>", parse);
	Text.NL();
	Text.Add("<i>\"Well, that was centuries and centuries ago, and the city's just been growing since then. The most recent outer walls were finished back in my grandparents' time, and you must've seen how more and more houses are spilling out past them when you came in,\"</i> she finishes her story.", parse);
	Text.NL();
	Text.Add("You smile warmly at her, and thank her for telling you the story, and, [finish] you part ways.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 20});
}

Scenes.Rigard.Chatter = function(enteringArea) {
	Text.Clear();
	var parse = {};
	
	var npcsA = [];
	var npcsB = [];
	if(party.location == world.loc.Rigard.Plaza) {
		parse.areaname = "plaza";
		
		npcsA.push({noun: "old nobleman", a: "an", gender: Gender.male});
		npcsA.push({noun: "wealthy merchant", a: "a", gender: Math.random() > 0.2 ? Gender.male : Gender.female});
		npcsA.push({noun: "old noblewoman", a: "an", gender: Gender.female});
		npcsA.push({noun: "young nobleman", a: "a", gender: Gender.male});
		npcsA.push({noun: "well-dressed retainer", a: "a", gender: Gender.male});
		npcsA.push({noun: "priest", a: "a", gender: Gender.male});
		npcsA.push({noun: "priestess", a: "a", gender: Gender.female});
		npcsA.push({noun: "royal guard", a: "a", gender: Math.random() > 0.2 ? Gender.male : Gender.female, royalGuard: true});
		
		npcsB.push({noun: "ragged servant", a: "a", gender: Gender.male});
		npcsB.push({noun: "errand boy", a: "an", gender: Gender.male});
		npcsB.push({noun: "ornate page", a: "an", gender: Gender.male});
		npcsB.push({noun: "colorful actor", a: "a", gender: Math.random() > 0.5 ? Gender.male : Gender.female});
		npcsB.push({noun: "tired servant", a: "a", gender: Gender.male});
		npcsB.push({noun: "tired maid", a: "a", gender: Gender.female});
	}
	else if(party.location == world.loc.Rigard.ShopStreet.street) {
		parse.areaname = "merchant's district";
		
		npcsA.push({noun: "poor merchant", a: "a", gender: Math.random() > 0.5 ? Gender.male : Gender.female});
		npcsA.push({noun: "colorful actor", a: "a", gender: Math.random() > 0.5 ? Gender.male : Gender.female});
		npcsA.push({noun: "skinny bard", a: "a", gender: Gender.male});
		npcsA.push({noun: "ragged beggar", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
		npcsA.push({noun: "muscular farmer", a: "a", gender: Gender.male});
		npcsA.push({noun: "city guard", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
		
		npcsB.push({noun: "rich merchant", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
		npcsB.push({noun: "shopping noblewoman", a: "a", gender: Gender.female});
		npcsB.push({noun: "well-dressed retainer", a: "a", gender: Gender.male});
		npcsB.push({noun: "wealthy proprietor", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
	}
	else if(party.location == world.loc.Rigard.Residental.street ||
		    party.location == world.loc.Rigard.Slums.gate) {
		if(party.location == world.loc.Rigard.Residental.street)
			parse.areaname = "residental district";
		else
			parse.areaname = "slums";
		
		npcsA.push({noun: "filthy labourer", a: "a", gender: Gender.male});
		npcsA.push({noun: "poor workman", a: "a", gender: Gender.male});
		npcsA.push({noun: "breastfeeding mother", a: "a", gender: Gender.female});
		npcsA.push({noun: "gaunt woman", a: "a", gender: Gender.female});
		npcsA.push({noun: "lean adolescent", a: "a", gender: Math.random() > 0.5 ? Gender.male : Gender.female});
		npcsA.push({noun: "fisherman", a: "a", gender: Gender.male});
		
		npcsB.push({noun: "stooped man", a: "a", gender: Gender.male});
		npcsB.push({noun: "half-naked woman", a: "a", gender: Gender.female});
		npcsB.push({noun: "cloaked man", a: "a", gender: Gender.male});
		npcsB.push({noun: "disfigured man", a: "a", gender: Gender.male});
		npcsB.push({noun: "flamboyant man", a: "a", gender: Gender.male});
		npcsB.push({noun: "washerwoman", a: "a", gender: Gender.female});
		npcsB.push({noun: "seamstress", a: "a", gender: Gender.female});
	}
	else if(party.location == world.loc.Rigard.Gate) {
		parse.areaname = "gate district";
		
		npcsA.push({noun: "rugged guard", a: "a", gender: Math.random() > 0.4 ? Gender.male : Gender.female});
		npcsA.push({noun: "rookie guard", a: "a", gender: Math.random() > 0.4 ? Gender.male : Gender.female});
		npcsA.push({noun: "guard trainer", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
		npcsA.push({noun: "guard lieutenant", a: "a", gender: Math.random() > 0.2 ? Gender.male : Gender.female});
		npcsA.push({noun: "court official", a: "a", gender: Math.random() > 0.2 ? Gender.male : Gender.female});
		
		npcsB.push({noun: "plump farmer", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
		npcsB.push({noun: "worn-out traveller", a: "a", gender: Math.random() > 0.5 ? Gender.male : Gender.female});
		npcsB.push({noun: "poor merchant", a: "a", gender: Math.random() > 0.5 ? Gender.male : Gender.female});
		npcsB.push({noun: "wandering bard", a: "a", gender: Gender.male});
		npcsB.push({noun: "tired messenger", a: "a", gender: Math.random() > 0.4 ? Gender.male : Gender.female});
	}
	else return; // Incorrect location
	
	// Pick two random npcs, from the same list
	var npc1, npc2; var poshList = false;
	if(Math.random() > 0.5) {
		var idx = Rand(npcsA.length);
		npc1 = npcsA[idx]; npcsA.remove(idx);
		npc2 = npcsA[Rand(npcsA.length)];
		if(party.location == world.loc.Rigard.Plaza)
			poshList = true;
	}
	else {
		var idx = Rand(npcsB.length);
		npc1 = npcsB[idx]; npcsB.remove(idx);
		npc2 = npcsB[Rand(npcsB.length)];
	}
	var hasRoyalGuard = npc1.royalGuard || npc2.royalGuard;
	
	parse.NPC1     = npc1.noun;
	parse.aAn1     = npc1.a;
	parse.heshe1   = npc1.gender == Gender.male ? "he" : "she";
	parse.HeShe1   = npc1.gender == Gender.male ? "He" : "She";
	parse.hisher1  = npc1.gender == Gender.male ? "his" : "her";
	parse.himher1  = npc1.gender == Gender.male ? "him" : "her";
	parse.hishers1 = npc1.gender == Gender.male ? "his" : "hers";
	
	parse.NPC2     = npc2.noun;
	parse.aAn2     = npc2.a;
	parse.heshe2   = npc2.gender == Gender.male ? "he" : "she";
	parse.HeShe2   = npc2.gender == Gender.male ? "He" : "She";
	parse.hisher2  = npc2.gender == Gender.male ? "his" : "her";
	parse.himher2  = npc2.gender == Gender.male ? "him" : "her";
	parse.hishers2 = npc2.gender == Gender.male ? "his" : "hers";
	
	if(Math.random() > 0.5) {
		parse.randommanWoman = "man";
		parse.rheshe         = "he";
		parse.rHeShe         = "He";
		parse.rhisher        = "his";
		parse.rhimher        = "him";
		parse.rhishers       = "his";
	}
	else {
		parse.randommanWoman = "woman";
		parse.rheshe         = "she";
		parse.rHeShe         = "She";
		parse.rhisher        = "her";
		parse.rhimher        = "her";
		parse.rhishers       = "hers";
	}
	
	// Introductory text
	var introText = new EncounterTable();
	introText.AddEnc(function() {
		Text.AddOutput("As you are entering the area, you overhear [aAn1] [NPC1] and [aAn2] [NPC2] talking.", parse);
	}, 1.0, enteringArea);
	introText.AddEnc(function() {
		Text.AddOutput("Coming back to the core of the [areaname], you can't help but overhear [aAn1] [NPC1] and [aAn2] [NPC2] talking.", parse);
	}, 1.0, !enteringArea);
	introText.AddEnc(function() {
		Text.AddOutput("Walking along the street, you overhear a conversation between [aAn1] [NPC1] and [aAn2] [NPC2].", parse);
	}, 1.0);
	introText.Get();
	
	Text.Newline();
	
	// Main rumor body
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.AddOutput("<i>\"You know, the other day I heard that a new portal opened up out in the plains and a [randommanWoman] came through,\"</i> the [NPC1] says.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Nonsense! Everyone knows there haven't been any portals in ten years!\"</i> The [NPC2] waves a hand dismissively.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.AddOutput("<i>\"Have you heard? Some merchant caravan came in yesterday from the oasis, and they say lone travellers have been disappearing out there,\"</i> the [NPC1] says.", parse);
		Text.Newline();
		var opts = [];
		opts.push("The [NPC2] shakes his head dismissively. <i>\"Bah, they probably just wandered off into the dunes like fools and died where their bodies will never be found.\"</i>");
		opts.push("<i>\"Greedy bastards are probably just making up stories so they'll have an excuse to drive up prices. It's never enough for them,\"</i> the [NPC2] responds.");
		opts.push("<i>\"That does sound bad. What other mess is stirring in this poor land?\"</i> the [NPC2] answers, looking dejected.");
		Text.AddOutput(opts[Rand(opts.length)], parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.AddOutput("<i>\"You know, I bought some fish from a [randommanWoman] who comes in from over by the lake yesterday, and [rheshe] saw the strangest thing,\"</i> the [NPC1] says.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Oh? Fishermen have the best tales.\"</i> The [NPC2] rolls [hisher2] eyes.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Don't be that way! [rHeShe] said [rheshe] saw a woman emerge from the lake, but when [rheshe] looked at her, her lower body was that of a fish! And then--\"</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.AddOutput("<i>\"I spoke to one of the farmers at the market the other day, and [rheshe]'s been complaining about rabbits,\"</i> the [NPC1] remarks.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Rabbits? Really?\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Apparently [rheshe]'s seen huge groups of them gathering together and just wandering around. [rHeShe]'s afraid they'll come attack his farm or something.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("The [NPC2] half-smiles. <i>\"[rHeShe]'s afraid of a rabbit attack? Bizarre.\"</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.AddOutput("<i>\"I wish they'd get rid of these ridiculous security measures. It's become so annoying to get into the city or leave again,\"</i> the [NPC1] complains.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"They're there for good reason!\"</i> The [NPC2] sounds offended. <i>\"You don't want the outlaws to come and murder us in our sleep, do you?\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Bah, I bet it's just a small group, hiding in the woods and hunting game. How dangerous could they be?\"</i>", parse);
	}, 1.0, function() { return party.location != world.loc.Rigard.Slums.gate; });
	scenes.AddEnc(function() {
		if(poshList) {
			Text.AddOutput("<i>\"I had a chance to visit the royal guard the other day, you know,\"</i> the [NPC1] remarks.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Oh, how did it go?\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"They were most gracious and accommodating. Just really nice people.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("The [NPC2] smiles in approval. <i>\"I'm glad at least some in this city still understand who they're supposed to listen to.\"</i>", parse);
		}
		else {
			Text.AddOutput("<i>\"Have I told you how I ran into one of those royal guard assholes the other day?\"</i> the [NPC1] asks.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"No, what happened?\"</i>", parse);
			Text.Newline();
			
			var opts = [];
			opts.push("<i>\"He said I was loitering, and my clothes were of a cut not allowed in the city. Ugh...\"</i> [heshe1] groans in frustration. <i>\"Basically, he was demanding a bribe, and I had no choice but to buy him off.\"</i>");
			opts.push("<i>\"He said that I was too non-human, that being so morphed is beyond lady Aria's will. I think he was just looking for an excuse to beat me up, but I managed to run off.\"</i>");
			opts.push("<i>\"He said my kind didn't belong here. I think that stupid noble I got into an argument with last week just sent him to harass me.\"</i> [HeShe1] sounds disgusted.");
			opts.push("<i>\"He said I had best stay away from my favorite merchant's shop. I think [rheshe]'s in competition with some noble, and they sent the guard to try and drive [rhimher] out of business.\"</i>");
			Text.AddOutput(opts[Rand(opts.length)], parse);
		}
	}, 1.0, function() { return !hasRoyalGuard; });
	// KRAWITZ RUMORS
	scenes.AddEnc(function() {
		// 0 = no, 1 = superwin, 2 = win, 3 = loss
		Text.AddOutput("<i>\"Have you heard? Lord Krawitz fought a duel out in the middle of a street,\"</i> the [NPC1] says.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Oh? How'd it go?\"</i>", parse);
		Text.Newline();
		if(rigard.flags["Duel"] == 1) {
			Text.AddOutput("<i>\"He got annihilated! I heard his clothes were in shreds and he has a scar on his cheek to show for the trouble.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("The [NPC2] beams happily. <i>\"It's about time someone showed that bastard what for!\"</i>", parse);
		}
		else if(rigard.flags["Duel"] == 2) {
			Text.AddOutput("<i>\"I was told it was a spectacular fight! His opponent just barely managed to beat him in the end, and he was just really angry and slunk off.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("The [NPC2] smiles in pleasure. <i>\"It's about time someone put that bastard in his place.\"</i>", parse);
		}
		else { // Loss, 3
			Text.AddOutput("<i>\"He won quite convincingly, unfortunately.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("The [NPC2] shakes [hisher2] head in disappointment. <i>\"He might be a bastard, but you have to hand it to him - he's a master with that blade.\"</i>", parse);
		}
	}, 1.0, function() { return rigard.flags["Duel"] != 0; });
	// TODO: MORE RUMORS AFTER NIGHT INFILTRATION
	scenes.Get();
	
	Text.Newline();
	// Outro text
	var outroText = new EncounterTable();
	outroText.AddEnc(function() {
		Text.AddOutput("Their conversation fades behind you as you walk on.", parse);
	});
	outroText.AddEnc(function() {
		Text.AddOutput("Your steps take you out of hearing range of their conversation.", parse);
	});
	outroText.AddEnc(function() {
		Text.AddOutput("A sudden surge in the noise coming from the crowd makes the rest of the conversation impossible to hear.", parse);
	}, 1.0, function() { return world.time.hour >= 8 && world.time.hour < 19; });
	outroText.AddEnc(function() {
		Text.AddOutput("You turn a corner, and the conversation grows inaudible behind you.", parse);
	});
	outroText.Get();
	
	if(!enteringArea)
		world.TimeStep({minute: 10});
	
	// Next button
	Gui.NextPrompt();
}

