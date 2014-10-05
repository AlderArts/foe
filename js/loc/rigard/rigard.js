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
		miranda  : new Event("Miranda's house"),
		mDungeon : new Event("Miranda's dungeon")
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
		gate     : new Event("Peasants' Gate"),
		docks    : new Event("Docks")
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
	this.ClothShop.AddItem(Items.Armor.SimpleRobes, 5);
	this.ClothShop.AddItem(Items.Armor.StylizedClothes, 5);
	
	this.ArmorShop = new Shop();
	this.ArmorShop.AddItem(Items.Armor.LeatherChest, 5);
	this.ArmorShop.AddItem(Items.Armor.LeatherPants, 5);
	this.ArmorShop.AddItem(Items.Armor.BronzeChest, 5);
	this.ArmorShop.AddItem(Items.Armor.BronzeLeggings, 5);
	
	this.WeaponShop = new Shop();
	this.WeaponShop.AddItem(Items.Weapons.Dagger, 5);
	this.WeaponShop.AddItem(Items.Weapons.Rapier, 5);
	this.WeaponShop.AddItem(Items.Weapons.WoodenStaff, 5);
	this.WeaponShop.AddItem(Items.Weapons.ShortSword, 5);
	this.WeaponShop.AddItem(Items.Weapons.GreatSword, 5);
	
	this.SexShop = new Shop();
	this.SexShop.AddItem(Items.StrapOn.PlainStrapon, 5);
	this.SexShop.AddItem(Items.StrapOn.LargeStrapon, 5);
	this.SexShop.AddItem(Items.StrapOn.CanidStrapon, 5);
	this.SexShop.AddItem(Items.StrapOn.EquineStrapon, 5);
	this.SexShop.AddItem(Items.StrapOn.ChimeraStrapon, 5);
	this.SexShop.AddItem(Items.Weapons.LWhip, 5);
	
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
	this.LB["RoomComp"] = 0;
	this.LB["Tea"]      = 0;
	this.LB["Lizan"]    = 0;
	this.LB["Elven"]    = 0;
	this.LB["Fairy"]    = 0;
	this.LB["Red"]      = 0;
	this.LBroomTimer    = new Time();
	
	// Non-permanent
	this.RotOrvinInnTalk = 0;
	
	this.Krawitz = {};
    this.Krawitz["Q"]    = Rigard.KrawitzQ.NotStarted; // Krawitz quest status
    this.Krawitz["F"]    = 0; // Aftermath flags
    this.Krawitz["Work"] = 0; // 
    this.KrawitzWorkDay  = null; // Time
	this.Krawitz["Duel"] = 0; // 0 = no, 1 = superwin, 2 = win, 3 = loss
	
	this.Brothel = {};
	this.Brothel["Visit"] = 0;
	
	if(storage) this.FromStorage(storage);
}

Rigard.KrawitzQ = {
	NotStarted   : 0,
	Started      : 1,
	HeistDone    : 2,
	HuntingTerry : 3,
	CaughtTerry  : 4
};

Rigard.prototype.ToStorage = function() {
	var storage = {};
	
	storage.flags   = this.flags;
    storage.Krawitz = this.Krawitz;
    storage.Brothel = this.Brothel;
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
    for(var flag in storage.Brothel)
        this.Brothel[flag] = parseInt(storage.Brothel[flag]);
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
// TODO: add other ways
Rigard.prototype.RoyalAccess = function() {
	return this.flags["RoyalAccess"] != 0;
}

Rigard.prototype.GatesOpen = function() {
	return world.time.hour >= 8 && world.time.hour < 17;
}

Rigard.prototype.UnderLockdown = function() {
	return rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry;
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
	Text.Add("<i>“You're new here, aren't you?”</i> she asks. <i>“Everyone else just walks past everything without even glancing, but you're constantly looking around!”</i>", parse);
	Text.NL();
	Text.Add("You admit that you're indeed new to the city.", parse);
	Text.NL();
	Text.Add("<i>“Want me to show you around? I've got nothing better to do just now anyway.”</i>", parse);
	Text.NL();
	Text.Add("You politely decline, saying you mostly know where things are, but ask if she could tell you about the history of the city.", parse);
	Text.NL();
	Text.Add("<i>“Mm... well, I'm not much for that sort of thing,”</i> she tells you, <i>“but everyone knows the story of the founding! Wanna hear that?”</i> When you nod your agreement, she continues. <i>“A long long time ago, this land was only inhabited by scattered tribes of pure humans ", parse);
	// If morph
	if(party.location == world.loc.Rigard.ShopStreet.street ||
	   party.location == world.loc.Rigard.Residental.street ||
	   party.location == world.loc.Rigard.Slums.gate)
		Text.Add("- although my parents tell me that's just something the humans made up - ", parse);
	Text.Add("who sometimes fought with each other, and sometimes got along. But then, in one of the weaker tribes was born Riordain, along with his twin brother Riorbane.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Riorbane was way cooler than his brother, and had lots of awesome adventures!”</i> the girl exclaims. <i>“But the adults mainly honor Riordain because he ended up founding the kingdom. I'm not sure how he did it, but he got all the humans to follow him, and they built the castle you can see over there,”</i> she tells you, waving over at the castle towering above the city, <i>“to be the capital of the new kingdom. The city was named Rigard in Riordain's honor.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Well, that was centuries and centuries ago, and the city's just been growing since then. The most recent outer walls were finished back in my grandparents' time, and you must've seen how more and more houses are spilling out past them when you came in,”</i> she finishes her story.", parse);
	Text.NL();
	Text.Add("You smile warmly at her, and thank her for telling you the story, and, [finish] you part ways.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 20});
	Gui.NextPrompt();
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
		Text.Add("As you are entering the area, you overhear [aAn1] [NPC1] and [aAn2] [NPC2] talking.", parse);
	}, 1.0, enteringArea);
	introText.AddEnc(function() {
		Text.Add("Coming back to the core of the [areaname], you can't help but overhear [aAn1] [NPC1] and [aAn2] [NPC2] talking.", parse);
	}, 1.0, !enteringArea);
	introText.AddEnc(function() {
		Text.Add("Walking along the street, you overhear a conversation between [aAn1] [NPC1] and [aAn2] [NPC2].", parse);
	}, 1.0);
	introText.Get();
	
	Text.NL();
	
	// Main rumor body
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“You know, the other day I heard that a new portal opened up out in the plains and a [randommanWoman] came through,”</i> the [NPC1] says.", parse);
		Text.NL();
		Text.Add("<i>“Nonsense! Everyone knows there haven't been any portals in ten years!”</i> The [NPC2] waves a hand dismissively.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Have you heard? Some merchant caravan came in yesterday from the oasis, and they say lone travellers have been disappearing out there,”</i> the [NPC1] says.", parse);
		Text.NL();
		var opts = [];
		opts.push("The [NPC2] shakes his head dismissively. <i>“Bah, they probably just wandered off into the dunes like fools and died where their bodies will never be found.”</i>");
		opts.push("<i>“Greedy bastards are probably just making up stories so they'll have an excuse to drive up prices. It's never enough for them,”</i> the [NPC2] responds.");
		opts.push("<i>“That does sound bad. What other mess is stirring in this poor land?”</i> the [NPC2] answers, looking dejected.");
		Text.Add(opts[Rand(opts.length)], parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“You know, I bought some fish from a [randommanWoman] who comes in from over by the lake yesterday, and [rheshe] saw the strangest thing,”</i> the [NPC1] says.", parse);
		Text.NL();
		Text.Add("<i>“Oh? Fishermen have the best tales.”</i> The [NPC2] rolls [hisher2] eyes.", parse);
		Text.NL();
		Text.Add("<i>“Don't be that way! [rHeShe] said [rheshe] saw a woman emerge from the lake, but when [rheshe] looked at her, her lower body was that of a fish! And then--”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“I spoke to one of the farmers at the market the other day, and [rheshe]'s been complaining about rabbits,”</i> the [NPC1] remarks.", parse);
		Text.NL();
		Text.Add("<i>“Rabbits? Really?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Apparently [rheshe]'s seen huge groups of them gathering together and just wandering around. [rHeShe]'s afraid they'll come attack his farm or something.”</i>", parse);
		Text.NL();
		Text.Add("The [NPC2] half-smiles. <i>“[rHeShe]'s afraid of a rabbit attack? Bizarre.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“I wish they'd get rid of these ridiculous security measures. It's become so annoying to get into the city or leave again,”</i> the [NPC1] complains.", parse);
		Text.NL();
		Text.Add("<i>“They're there for good reason!”</i> The [NPC2] sounds offended. <i>“You don't want the outlaws to come and murder us in our sleep, do you?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Bah, I bet it's just a small group, hiding in the woods and hunting game. How dangerous could they be?”</i>", parse);
	}, 1.0, function() { return party.location != world.loc.Rigard.Slums.gate; });
	scenes.AddEnc(function() {
		if(poshList) {
			Text.Add("<i>“I had a chance to visit the royal guard the other day, you know,”</i> the [NPC1] remarks.", parse);
			Text.NL();
			Text.Add("<i>“Oh, how did it go?”</i>", parse);
			Text.NL();
			Text.Add("<i>“They were most gracious and accommodating. Just really nice people.”</i>", parse);
			Text.NL();
			Text.Add("The [NPC2] smiles in approval. <i>“I'm glad at least some in this city still understand who they're supposed to listen to.”</i>", parse);
		}
		else {
			Text.Add("<i>“Have I told you how I ran into one of those royal guard assholes the other day?”</i> the [NPC1] asks.", parse);
			Text.NL();
			Text.Add("<i>“No, what happened?”</i>", parse);
			Text.NL();
			
			var opts = [];
			opts.push("<i>“He said I was loitering, and my clothes were of a cut not allowed in the city. Ugh...”</i> [heshe1] groans in frustration. <i>“Basically, he was demanding a bribe, and I had no choice but to buy him off.”</i>");
			opts.push("<i>“He said that I was too non-human, that being so morphed is beyond lady Aria's will. I think he was just looking for an excuse to beat me up, but I managed to run off.”</i>");
			opts.push("<i>“He said my kind didn't belong here. I think that stupid noble I got into an argument with last week just sent him to harass me.”</i> [HeShe1] sounds disgusted.");
			opts.push("<i>“He said I had best stay away from my favorite merchant's shop. I think [rheshe]'s in competition with some noble, and they sent the guard to try and drive [rhimher] out of business.”</i>");
			Text.Add(opts[Rand(opts.length)], parse);
		}
	}, 1.0, function() { return !hasRoyalGuard; });
	// KRAWITZ RUMORS
	scenes.AddEnc(function() {
		// 0 = no, 1 = superwin, 2 = win, 3 = loss
		Text.Add("<i>“Have you heard? Lord Krawitz fought a duel out in the middle of a street,”</i> the [NPC1] says.", parse);
		Text.NL();
		Text.Add("<i>“Oh? How'd it go?”</i>", parse);
		Text.NL();
		if(rigard.Krawitz["Duel"] == 1) {
			Text.Add("<i>“He got annihilated! I heard his clothes were in shreds and he has a scar on his cheek to show for the trouble.”</i>", parse);
			Text.NL();
			Text.Add("The [NPC2] beams happily. <i>“It's about time someone showed that bastard what for!”</i>", parse);
		}
		else if(rigard.Krawitz["Duel"] == 2) {
			Text.Add("<i>“I was told it was a spectacular fight! His opponent just barely managed to beat him in the end, and he was just really angry and slunk off.”</i>", parse);
			Text.NL();
			Text.Add("The [NPC2] smiles in pleasure. <i>“It's about time someone put that bastard in his place.”</i>", parse);
		}
		else { // Loss, 3
			Text.Add("<i>“He won quite convincingly, unfortunately.”</i>", parse);
			Text.NL();
			Text.Add("The [NPC2] shakes [hisher2] head in disappointment. <i>“He might be a bastard, but you have to hand it to him - he's a master with that blade.”</i>", parse);
		}
	}, 1.0, function() { return rigard.Krawitz["Duel"] != 0; });
	// TODO: MORE RUMORS AFTER NIGHT INFILTRATION
	scenes.Get();
	
	Text.NL();
	// Outro text
	var outroText = new EncounterTable();
	outroText.AddEnc(function() {
		Text.Add("Their conversation fades behind you as you walk on.", parse);
	});
	outroText.AddEnc(function() {
		Text.Add("Your steps take you out of hearing range of their conversation.", parse);
	});
	outroText.AddEnc(function() {
		Text.Add("A sudden surge in the noise coming from the crowd makes the rest of the conversation impossible to hear.", parse);
	}, 1.0, function() { return world.time.hour >= 8 && world.time.hour < 19; });
	outroText.AddEnc(function() {
		Text.Add("You turn a corner, and the conversation grows inaudible behind you.", parse);
	});
	outroText.Get();
	
	if(!enteringArea)
		world.TimeStep({minute: 10});
	
	Text.Flush();
	// Next button
	Gui.NextPrompt();
}

Scenes.Rigard.Lockdown = function() {
	var parse = {
		playername : player.name,
		merchantsCitizens : (party.location == world.loc.Rigard.Gate) ? "merchants" : "citizens",
		earDesc : function() { return player.EarDesc(); },
		buttDesc : function() { return player.Butt().Short(); },
		assCunt : player.FirstVag() ? "cunt" : "ass",
		tongueDesc : function() { return player.TongueDesc(); },
		armorDesc : function() { return player.ArmorDesc(); }
	};
	
	rigard.Krawitz["Q"] = Rigard.KrawitzQ.HuntingTerry;
	
	var dom = miranda.SubDom() - player.SubDom();
	
	Text.Clear();
	Text.Add("As you approach the gates you’re surprised to see them closed. There appears to be some commotion over a few [merchantsCitizens] wanting to leave. One of the guards nearby spots you and moves to talk to you, but a familiar dog-morph butts in and greets you first.", parse);
	Text.NL();
	Text.Add("<i>“Hello there [playername]. Don’t suppose you know anything about a break-in into the mansion of a Lord Krawitz, do you?”</i> Miranda questions you, tapping her chin.", parse);
	Text.NL();
	Text.Add("In times like these it’s best to feign ignorance. You tell her you don’t know anything about any break in. What exactly happened?", parse);
	Text.NL();
	Text.Add("She frowns at your question. <i>“Some stupid thief broke in, stole a bunch of his possessions and left this,”</i> she presents a card. <i>“Personally, Krawitz had it coming. Pretty sure no one really cares if he’s been robbed blind. Not like the old fool didn’t do anything worse in his time, but the stupid thief just <b>had</b> to leave a calling card. Now the high-ups are all foaming and want the perp caught,”</i> she finishes with a sigh. <i>“And you wanna hear the cherry on top?”</i>", parse);
	Text.NL();
	Text.Add("You examine the card. Both sides have the logo of a fox throwing a raspberry, the edge reads ‘Masked Fox’.", parse);
	Text.NL();
	parse["nice"] = miranda.Attitude() >= Miranda.Attitude.Neutral ? " some comforting," : "";
	Text.Add("<i>“That pompous bastard of a captain put <b>me</b> on the job. Said to use my nose. That damn bastard takes me for what? A common dog!?”</i> she exclaims, infuriated. After a few moments,[nice] and a deep breath Miranda seems to visibly calm down. She examines you and grins. ", parse);
	if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
		Text.Add("<i>“Say, how about you help me catch this perp? I'm sure nobody will mind it if we duck out to a few places to do some 'investigating', if you catch my drift.”</i>", parse);
		Text.NL();
		Text.Add("If this isn't a golden opportunity to throw off any suspicion on you, you don't know what it is. No better way to help cover your own tracks than to agree to help her chase down some other thief who robbed the same place. Actually, who in the world could have done that? Dismissing the matter as unimportant, you quickly convey to Miranda that you're willing to help her find the culprit.", parse);
	}
	else {
		Text.Add("<i>“You're going to help me catch this perp. Otherwise I'm taking you in for questioning. Now, I don't expect you had anything to do with this, but the guard can be very thorough during questioning. And I could do with having some fun.”</i>", parse);
		Text.NL();
		Text.Add("Any surprise or curiosity you might have felt at her request for your help - after all, you're <b>not</b> her favorite person in the world and you know it - is swept aside by the knowledge that she means what she says.", parse);
		Text.NL();
		if(dom < 0) {
			Text.Add("You'd sooner swallow live spiders in butter than help her, but you <b>don't</b> need this sort of hassle. Certainly not when you actually <b>are</b> a criminal who raided the Krawitz manor, even if you're not the one they're actually looking for. Swallowing back your resentment, you tell Miranda that you understand what she's saying; you'll help.", parse);
		}
		else {
			Text.Add("Unconsciously, your eyes drift towards her legs, when you know her prodigious cock lies, and you lick your lips involuntarily. The... offer? threat? in her statement is <b>so</b> very tempting... still, you mightn't be the precise criminal they're after, but you still are a criminal. You can't afford to be taken in, even by accident. You quickly assure Miranda that you'll help her.", parse);
		}
	}
	Text.NL();
	Text.Add("<i>“Knew I could count on you!</i> Miranda exclaims with a grin. <i>“Now let’s get out of here and get started on our investigation.</i>”", parse);
	Text.NL();
	if(party.Num() > 1) {
		parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
		Text.Add("You tell [comp] to wait for you at the Lady’s Blessing, looks like this is going to take some time.", parse);
		Text.NL();
	}
	
	party.SaveActiveParty();
	party.ClearActiveParty();
	party.SwitchIn(player);
	party.AddMember(miranda);
	
	if(miranda.Sexed()) {
		if(miranda.SubDom() > 25) {
			Text.Add("As you make your way past the gates, the dog-morph pulls you close by the shoulders to whisper into your [earDesc], <i>“Bet you can’t wait for us to have a duck down a dark corner.</i>", parse);
			Text.NL();
			if(player.SubDom() > 0)
				Text.Add("With your cockiest grin in place, you deliberately rub your [buttDesc] back against her pelvis as best you can, quipping back that you're sure you can handle the wait better than she can. With a jaunty flick of your shoulders, you wriggle out of her grip and step out of her reach.", parse);
			else
				Text.Add("Your visibly shudder in anticipation, eyes closing as you just picture the horny dober-herm pinning you up against a wall and penetrating your [assCunt] with her long, throbbing mastiff-meat. Your reaction doesn't go unnoticed, Miranda grinning and reaching down to squeeze your [buttDesc] possessively before letting you go.", parse);
		}
		else {
			Text.Add("As you make your way from the gates, the dog-morph leans over to whisper into your [earDesc], <i>“Hey, you’re not thinking of taking advantage of me if we have to duck down a dark corner, are you?”</i>", parse);
			Text.NL();
			if(player.SubDom() > 0)
				Text.Add("Like she doesn't want you to do that, you smirk back, fingers trailing teasingly over the toned curves of her buttocks before giving her a short squeeze of admiration.", parse);
			else
				Text.Add("You hasten to assure her that you would never do such a thing... unless she wanted you to, of course.", parse);
			Text.NL();
			Text.Add("<i>“Just letting you know that I’m cool with that if you do,”</i> she says, giving you a peck on the cheek before moving away.", parse);
		}
		Text.NL();
	}
	else {
		Text.Add("Miranda takes you through the gates, heading into the slums of Rigard. Looks like she has a destination in mind. ", parse);
	}
	Text.Add("Adjusting yourself to your impromptu drafting, you ask the dog-morph if she has a plan as to where to begin.", parse);
	Text.NL();
	Text.Add("<i>“We should discuss a few details before we get started. So, let’s go to the Maiden’s Bane and plan our moves,”</i> she says, leading you towards her favorite watering hole.", parse);
	Text.Flush();
	
	party.location = world.loc.Rigard.Tavern.common;
	world.TimeStep({hour : 1});
	
	Gui.NextPrompt(function() {
		Text.Clear();
		parse["lady"] = player.Femininity() < -0.5 ? "stepping in" : "motioning for you to get inside";
		Text.Add("Miranda easily whisks you past the gate and makes a beeline for the Maiden’s Bane. The bar is crowded with all sorts of people complaining about the lockdown, but neither of you pay any attention to them. The guardswoman doesn’t bother looking for a table in this mess, instead she stops by the bar to grab a couple bottles and heads straight into the one of the available rooms in the back. <i>“Ladies first,”</i> she says, [lady].", parse);
		Text.NL();
		parse["rebutt"] = (player.Gender() == Gender.male && player.SubDom() > 25) ? "Letting that crack about ladies first' slip by, for now, y" : "Y";
		parse["lady"] = player.Femininity() < -0.5 ? "follow her" : "head";
		Text.Add("You should be surprised about the fact she took you to the backroom to plan... but you know Miranda better than that. [rebutt]ou [lady] inside and quickly make yourself comfortable on one of the seats within. Patiently you wait for her to begin, wondering what the very literal watch-dog has in mind for finding this mysterious thief.", parse);
		Text.NL();
		Text.Add("The sounds of the crowd outside doesn’t disappear entirely when Miranda slams the door, but it’s sufficiently muffled that you can at least talk to each other without shouting. The doggie takes a nearby chair and sets it under the door handle. <i>“For good measure,”</i> she says. <i>“Alright then, let’s get started. Do you actually know anything about the break in or should I lay it down from the very beginning?”</i> she asks, taking a seat across from you and popping the cork on her bottle.", parse);
		Text.NL();
		Text.Add("You quickly inform her that starting from the beginning would be best; the first you had heard of the break-in was when she spoke to you just before.", parse);
		Text.NL();
		Text.Add("<i>“It’s really not that complicated. Someone decided that they’ve had enough of old Krawitz and broke in to pay their respects. Let me list the charges for you,”</i> she clears her throat. <i>“They stole a few art pieces, a statue, several coins, defaced a few paintings, messed up the old man’s room, stole some wine, ", parse);
		if(rigard.Krawitz["F"] & Scenes.Krawitz.Flags.Clothes != 0)
			Text.Add("impersonated a member of the staff, ", parse);
		if(rigard.Krawitz["F"] & Scenes.Krawitz.Flags.Binder != 0)
			Text.Add("stole a few important documents, ", parse);
		if(rigard.Krawitz["F"] & Scenes.Krawitz.Flags.Sword != 0)
			Text.Add("made away with his family heirloom, ", parse);
		if(rigard.Krawitz["F"] & Scenes.Krawitz.Flags.SpikedLadies != 0)
			Text.Add("drugged his daughter and his wife, ", parse);
		if(rigard.Krawitz["F"] & Scenes.Krawitz.Flags.Sex != 0)
			Text.Add("had sex with them, ", parse);
		if(rigard.Krawitz["F"] & Scenes.Krawitz.Flags.SpikedServants != 0)
			Text.Add("drugged the entire staff, ", parse);
		if(rigard.Krawitz["F"] & Scenes.Krawitz.Flags.Orgy != 0)
			Text.Add("invited the drugged staff to get it on with the drugged ladies, ", parse);
		if(rigard.Krawitz["F"] & Scenes.Krawitz.Flags.TF != 0)
			Text.Add("poured a transformative in the old fool’s food, ", parse);
		Text.Add("and last but not least, they also left that damn card mocking us all.”</i>", parse);
		Text.NL();
		
		if(rigard.Krawitz["F"] != 0) {
			Text.Add("A pang of unease stabs into your heart; you knew it was almost inevitable that your own actions would be discovered, but so soon? Still... sounds like whoever this mystery thief is, they decided it'd be easier to just blame them for the things you did as well. Although you are relieved at the fact your own cover hasn't been blown, a part of you does still feel a little guilty about someone else taking the blame. Still, it’s in your best interest to not take the fall for your crimes. Good thing you’re helping investigate rather than being investigated yourself.", parse);
			Text.NL();
		}
		Text.Add("Clearing your throat, you declare that's quite an extensive list of crimes. But leaving a calling card? What kind of thief does that - surely they must have known it would have given the nobles more reason to send the guards after them?", parse);
		Text.NL();
		Text.Add("Miranda takes a long swig of her drink. <i>“Beats me. Probably some sadistic asshole. Like I said, people don’t care much for Krawitz, even the nobles dislike the guy. But if a thief leaves a card mocking the royal guard and the city watch, we just have to go after the prick and make an example out of them,”</i> she downs the rest of her bottle.", parse);
		Text.NL();
		Text.Add("You nod in understanding; that sort of logic certainly makes sense to you. This thief clearly has a problem with their ego if they went and stirred up the hornet's nest like this. You feel sorry for them, but they kind of brought this on themselves.", parse);
		Text.NL();
		Text.Add("<i>“Pretty sure we’ve questioned every relevant person. And we’ve had guards posted in front of all shops. So I don’t think we need to search inside. Wherever the culprit is hiding, they’re alone and haven’t received help from anyone in town. So that’s a load off our backs. Still, we gotta search the plaza, the market district, the backstreets and even the area around the Gates. So if you know anyone that might have an idea to cut the chase short, I’m all ears.”</i>", parse);
		Text.NL();
		Text.Add("Nothing that might help immediately springs to mind, and you admit as such to Miranda. Looks like you'll have to just get out there and start looking.", parse);
		Text.NL();
		
		var cocksInVag = player.CocksThatFit(miranda.FirstVag());
		
		if(miranda.flags["Herm"] == 0) {
			Text.Add("<i>“Before we get going, how about you help me with an itch I’m having?”</i> the guardswoman asks with a mischievous grin. It looks like the drinks are starting to take effect, as the dobie’s eyes are slightly unfocused and her breathing is getting heavy.", parse);
			Text.NL();
			Text.Add("Oh? An itch, huh? What kind of itch, you ask her with a knowing grin. Looks like your new partner is in heat.", parse);
			Text.NL();
			Text.Add("<i>“This kind,”</i> Miranda smiles as she pulls down her pants, revealing a rock hard, eleven inch cock. The canid member is red in color, has a pointed tip drooling a ridiculous amount of pre. At its base, there is a thick knot, resting just above her - no, his? - heavy sack.", parse);
			Text.NL();
			Text.Add("W-what!? She’s a guy?", parse);
			Text.NL();
			Text.Add("Miranda rolls her eyes at your reaction and unceremoniously lifts her balls out of the way, displaying rapidly moistening puffy lips behind.", parse);
			Text.NL();
			Text.Add("So, she’s actually a herm? You… you’re not sure how you feel about that, actually.", parse);
			Text.NL();
			Text.Add("<i>“Well? Now that my secret is out, would you mind getting ‘down to business’?”</i> Miranda grins. <i>“I’m not gonna be able to do any proper work before this is taken care of.”</i>", parse);
			Text.NL();
			Text.Add("<b>You now know Miranda is a herm (duh).</b>", parse);
			Text.Flush();
			
			miranda.flags["Herm"] = 1;
			miranda.flags["Met"]  = Miranda.Met.TavernAftermath;
			//[Hot]
			var options = new Array();
			options.push({ nameStr : "Neutral",
				func : function() {
					Text.Clear();
					Text.Add("Sorry, but you aren’t in to that. The herm shrugs her shoulders, apparently not unfamiliar with the reaction.", parse);
					Text.NL();
					Text.Add("<i>“I can get where you are coming from, I guess,”</i> she says as she reluctantly pulls her pants back up. <i>“Offer still stands, if you are feeling frisky later.”</i>", parse);
					Text.NL();
					Text.Add("You insist that you should probably get going. That thief isn’t going to catch himself. She chuckles, amused at your reaction. <i>“Well, lets get to it then!”</i> The two of you leave the tavern and return inside the city proper. From what you gather, you aren’t going to get out of here before the thief is caught.", parse);
					Text.Flush();
					
					miranda.flags["Attitude"] = Miranda.Attitude.Neutral;
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Not really your thing, sorry."
			});
			options.push({ nameStr : "Hot",
				func : function() {
					Text.Clear();
					Text.Add("Stepping around the table, you grab onto her shaft, giving it a quick stroke and drawing a moan from Miranda. <i>“I take it this means that you - ooh! - like what you see?”</i> she breathes, looking down on you with half-closed eyes.", parse);
					Text.NL();
					Text.Add("Yes, you have to admit. This is very <i>interesting</i> indeed. Now that you have a proper ‘grasp’ of the situation, what should you do about her?", parse);
					Text.Flush();
					
					//[TakeCharge]
					var options = new Array();
					options.push({ nameStr : "TakeCharge",
						func : function() {
							Text.Clear();
							Text.Add("Smirking mischievously at her, you lift a hand to cup her chin and give her a big, wet kiss. Hungrily, you thrust your [tongueDesc] into the warm wetness of her mouth to wrestle with her own.", parse);
							Text.NL();
							Text.Add("For several long, pleasant moments the two of you tongue-wrestle, softly moaning and mumbling your pleasure into each other's lips, before you release her. Smirking down at the panting herm, a bead of pre forming at the tip of her erection. You mockingly ask her if she intends to stay dressed for this or is she going to take off the rest of her uniform? Not that you mind either way… that pretty rump of hers is good enough for the taking, after all.", parse);
							Text.NL();
							Text.Flush();
							
							Scenes.Miranda.TerryTavernSexSubbyVag(cocksInVag);
						}, enabled : cocksInVag.length > 0,
						tooltip : "She wants sex, but who says she has to get it on her terms? Why not take charge of scratching her itch?"
					});
					options.push({ nameStr : "Submit",
						func : function() {
							Text.Clear();
							Text.Add("The dog-herm wastes no time in hopping on her feet, stripping off the rest of her armor as she approaches you to help you take off your [armorDesc]. Though she fumbles with both your outfits she has you naked in record time. Without so much as a word, she takes you by the arm and sets you down on your knees atop the cushions in the corner of the room.", parse);
							Text.NL();
							Text.Flush();
							
							Scenes.Miranda.TerryTavernSexDommyBJ();
						}, enabled : true,
						tooltip : "If she wants her itch scratched, then she can come and get it."
					});
					options.push({ nameStr : "Later",
						func : function() {
							Text.Clear();
							Text.Add("You carefully tuck her cock in and pull her pants up. The two of you have a thief to catch, after all.", parse);
							Text.NL();
							Text.Add("<i>“Aww,”</i> Miranda pouts.", parse);
							Text.NL();
							Text.Add("Rolling your eyes, you smirk and tell her you two can get back to this… later.", parse);
							Text.NL();
							Text.Add("<i>“Good, I’m holding you to that promise,”</i> she replies, following after you as you exit the Maiden’s Bane and move back inside the gates.", parse);
							Text.Flush();
							PrintDefaultOptions();
						}, enabled : true,
						tooltip : "This is hardly the time to be having fun, so tuck her doghood back in and get down to business."
					});
					Gui.SetButtonsFromList(options, false, null);
					miranda.flags["Attitude"] = Miranda.Attitude.Nice;
				}, enabled : true,
				tooltip : "The way you see it, this just gives you more options. Why not indulge?"
			});
			options.push({ nameStr : "Disgusting",
				func : function() {
					Text.Clear();
					Text.Add("<i>“What? Come on! You’re not gonna pussy out on me just because I have a dick now, are you?”</i> she frowns, clearly not happy with you.", parse);
					Text.NL();
					Text.Add("When you fail to reply she just rolls her eyes and pulls her pants back up. <i>“Typical… should’ve expected that.”</i> She walks past you, heading towards the door. <i>“You coming or you’re just going to stand there like an idiot?”</i>", parse);
					Text.NL();
					Text.Add("Jolted into action, you follow after her, as she leads you out of the Maiden’s Bane and back inside Rigard’s gates.", parse);
					Text.Flush();
					miranda.flags["Attitude"] = Miranda.Attitude.Hate;
					
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Eww, you’re not about to touch <b>that!</b>"
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else {
			if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
				Text.Add("<i>“Before we get going, how about you help me with an itch I’m having?”</i> the herm dog asks with a mischievous grin.", parse);
				Text.NL();
				Text.Add("Oh, Miranda, she's just never going to change, is she? You fight back a smile as you consider the offer.", parse);
				Text.Flush();
				
				//[TakeCharge] [Submit] [Later]
				var options = new Array();
				options.push({ nameStr : "TakeCharge",
					func : function() {
						Text.Clear();
						Text.Add("Authoritatively, you push your chair back and stand up. Throwing her a proud smirk, you saunter around the tabletop towards her, your gaze never leaving hers as you close the distance. Cupping her chin in your hand, your lips descend to cover hers possessively, hungrily thrusting your [tongueDesc] into the warm wetness of her mouth to wrestle with her own.", parse);
						Text.NL();
						Text.Add("For several long, pleasant moments the two of you tongue-wrestle, softly moaning and mumbling your pleasure into each other's lips, before you release her. Smirking down at the panting herm, her erection visibly tenting her pants from this angle, you mockingly ask her how she intends to have you sex her whilst she insists on keeping that pretty rump of hers all covered up in her uniform.", parse);
						Text.Flush();
						
						Scenes.Miranda.TerryTavernSexSubbyVag(cocksInVag);
					}, enabled : cocksInVag.length > 0,
					tooltip : "Even if she wants sex, who says she has to get it on her terms? Why not take charge of scratching her itch?"
				});
				options.push({ nameStr : "Submit",
					func : function() {
						Text.Clear();
						Text.Add("The dog-herm wastes no time in hopping on her feet, stripping off her armor as she approaches you to help you take off your [armorDesc]. Though she fumbles with both your outfits she has you naked in record time. Without so much as a word, she takes you by the arm and sets you down on your knees atop the cushions in the corner of the room.", parse);
						Text.Flush();
						
						Scenes.Miranda.TerryTavernSexDommyBJ();
					}, enabled : true,
					tooltip : "If she wants her itch scratched, then she can come and get it."
				});
				options.push({ nameStr : "Later",
					func : function() {
						Text.Clear();
						Text.Add("You scold Miranda for her suggestion. The thief isn’t going to catch himself, after all. No nookie for now.", parse);
						Text.NL();
						Text.Add("<i>“Aww,”</i> Miranda pouts.", parse);
						Text.NL();
						Text.Add("Rolling your eyes, you smirk and tell her you two can get back to this… later.", parse);
						Text.NL();
						Text.Add("<i>“Good, I’m holding you to that promise,”</i> she replies, following after you as you exit the Maiden’s Bane and move back inside the gates.", parse);
						Text.Flush();
						
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "This is hardly the time to be having fun. The two of you have a thief to catch."
				});
				Gui.SetButtonsFromList(options, false, null);
			}
			else { // Nasty
				Text.Add("<i>“Alright then, let’s get to work. You can start off by stripping down,”</i> she orders you.", parse);
				Text.NL();
				Text.Add("Your head whips around to look at her, your shock written on your face.", parse);
				Text.NL();
				Text.Add("<i>“Make no mistake, this is what I called you here for. If I’m going to be working overtime to catch this thief, then I’m damn well getting a kicker out of it. Now strip before you go from partner to suspect.”</i>", parse);
				Text.Flush();
				
				var Choice = {
					Reluctant: 0,
					Eager: 1
				}
				var choice = Choice.Reluctant;
				//[Submit][Reluctant][Refuse]
				var options = new Array();
				options.push({ nameStr : "Submit",
					func : function() {
						Text.Clear();
						Text.Add("You cower in your seat, helpless to resist the authority of the herm before you. You couldn't resist her, even if she didn't have such a charge to label against you. Shyly you stand up from your seat, unable to meet her eyes in your embarrassment as you begin meekly stripping yourself down.", parse);
						
						miranda.relation.IncreaseStat(100, 5);
						player.subDom.DecreaseStat(-100, 2);
						miranda.subDom.IncreaseStat(100, 10);
						
						choice = Choice.Eager;
						
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Give in, you have no choice but to follow her whims."
				});
				var reluctant = function() {
					Text.Add("Your blood boils in your veins at the outrage, fingers clenching, but you force yourself to swallow back the bile rising from the depths of your gut. The bitch has you over a barrel here, and you both know it. Slowly, reluctantly, you rise from your seat and start to remove your [armorDesc].", parse);
					PrintDefaultOptions();
				};
				options.push({ nameStr : "Reluctant",
					func : function() {
						Text.Clear();
						reluctant();
						player.subDom.DecreaseStat(-100, 1);
						miranda.subDom.IncreaseStat(100, 5);
					}, enabled : true,
					tooltip : "As much as it rails you, you are in no position to refuse her. You could very well end up in prison for this."
				});
				options.push({ nameStr : "Refuse",
					func : function() {
						Text.Clear();
						Text.Add("<i>“Perhaps I wasn’t clear,”</i> Miranda’s eyes narrow dangerously. <i>“Either you are getting down on your knees right here, right now, and suck my dick, or I’m hauling your ass straight to prison and performing a cavity search on you. Your choice.”</i>", parse);
						Text.NL();
						miranda.relation.DecreaseStat(-100, 10);
						
						reluctant();
					}, enabled : true,
					tooltip : "Just… no. This is hardly the time to even consider this. Plus you’re just not in the mood."
				});
				Gui.SetButtonsFromList(options, false, null);
				
				Gui.Callstack.push(function() {
					Text.NL();
					parse["reluctantlyEagerly"] = choice == Choice.Eager ? "eagerly" : "reluctantly";
					Text.Add("Miranda's eyes never leave you, her lips curled into a smirk and her fingers brushing almost mockingly against the bulge in her trousers as she watches you finish undressing. As her gaze hungrily follows you, you [reluctantlyEagerly] head for the cushioned corner of the room and obediently kneel there, just waiting for her to claim you.", parse);
					Text.Flush();
					
					Scenes.Miranda.TerryTavernSexDommyBJ();
				});
			}
		}
		
		Gui.Callstack.push(function() {
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Residental.street, {hour: 1});
			});
		});
	});
}

