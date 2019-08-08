/*
 *
 * Town area that can be explored
 *
 */

import { EncounterTable } from '../../encountertable';
import { BrothelLoc } from './brothel';
import { InnLoc, LBScenes, RigardLB, InitLB } from './inn';
import { Shop } from '../../shop';
import { ResidentialLoc } from './residential';
import { SlumsLoc } from './slums';
import { TavernLoc } from './tavern';
import { GateLoc, BarracksLoc } from './guards';
import { ShopStreetLoc, ShopStreetScenes } from './merchants';
import { CastleLoc, NobleScenes } from './castle';
import { PlazaLoc, PlazaScenes } from './plaza';
import { KrawitzLoc, InitKrawitz } from './krawitz';
import { OddShopScenes } from './sexstore';
import { WeaponShopScenes } from './weaponshop';
import { MagicShopScenes } from './magicshop';
import { ClothShopScenes } from './clothstore';
import { ArmorShopScenes } from './armorshop';
import { Gender } from '../../body/gender';
import { InitMageTower } from './magetower';
import { Items } from '../../items';
import { Time } from '../../time';
import { Stat } from '../../stat';
import { WorldTime, MoveToLocation, GAME } from '../../GAME';
import { Gui } from '../../gui';
import { Text } from '../../text';
import { MirandaFlags } from '../../event/miranda-flags';
import { TerryFlags } from '../../event/terry-flags';

let world = null;
let Scenes = null;
export function InitRigard(w, scenes) {
	world = w;
	Scenes = scenes;
	InitLB(world, scenes);
	InitMageTower(world);
	InitKrawitz(world);
	ArmorShopScenes.CreateShop();
	MagicShopScenes.CreateShop();
};

// Create namespace
let RigardLoc = {
	Gate         : GateLoc,
	Barracks     : BarracksLoc,

	Residential   : ResidentialLoc,

	Brothel      : BrothelLoc,

	Plaza        : PlazaLoc,
	Inn          : InnLoc,
	ShopStreet   : ShopStreetLoc,

	Krawitz      : KrawitzLoc,

	Castle       : CastleLoc,

	Slums        : SlumsLoc,
	Tavern       : TavernLoc,
}

let RigardScenes = {
	OddShop : OddShopScenes,
	WeaponShop : WeaponShopScenes,
	Plaza : PlazaScenes,
	ShopStreet : ShopStreetScenes,
	MagicShop : MagicShopScenes,
	LB : LBScenes,
	ClothShop : ClothShopScenes,
	Noble : NobleScenes,
	ArmorShop : ArmorShopScenes,
};

// Class to handle global flags and logic for town
function Rigard(storage) {
	this.flags = {};

	// TODO: Store
	this.ClothShop = new Shop();
	this.ClothShop.AddItem(Items.Armor.SimpleRobes, 5);
	this.ClothShop.AddItem(Items.Armor.StylizedClothes, 5);

	this.ArmorShop = RigardScenes.ArmorShop.Shop;
	this.ArmorShopSpecial = RigardScenes.ArmorShop.SpecialShop;

	this.SexShop = new Shop();
	this.SexShop.AddItem(Items.StrapOn.PlainStrapon, 5);
	this.SexShop.AddItem(Items.StrapOn.LargeStrapon, 5);
	this.SexShop.AddItem(Items.StrapOn.CanidStrapon, 5);
	this.SexShop.AddItem(Items.StrapOn.EquineStrapon, 5);
	this.SexShop.AddItem(Items.StrapOn.ChimeraStrapon, 5);
	this.SexShop.AddItem(Items.Weapons.LWhip, 5);

	this.MagicShop = RigardScenes.MagicShop.Shop;

	// Have accessed town (not necessarily free access)
	this.flags["Visa"] = 0;
	this.flags["CityHistory"] = 0;
	this.flags["Nobles"] = 0; //Bitmask
	this.ParadeTimer = new Time();
	// Have access to royal grounds (not necessarily free access)
	this.flags["RoyalAccess"] = 0;
	this.flags["RoyalAccessTalk"] = 0;

	this.flags["TalkedStatue"] = 0;

	this.flags["TailorMet"]   = 0;
	this.flags["BuyingExp"]   = 0;
	this.flags["Scepter"]     = 0;

	this.Twopenny = {};
	this.Twopenny["Met"]   = 0;
	this.Twopenny["TShop"] = 0;

	this.LB = {};
	this.LB["Visit"]    = 0;
	this.LB["Orvin"]    = 0;
	this.LB["OTerry"]   = 0;
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
	this.Brothel["Visit"]  = 0;
	this.Brothel["MStrap"] = 0;

	this.CW = {};
	this.CW["Visit"] = 0;
	this.cwrel = new Stat(0);

	this.alianaRel = new Stat(0);
	
	this.flags["Barnaby"] = 0;

	if(storage) this.FromStorage(storage);
}

Rigard.LB = RigardLB;

Rigard.Nobles = {
	MetMajid : 1,
	Alms     : 2,
	Elodie   : 4,
	Parade   : 8,
	Buns     : 16,
	BoughtBuns : 32
};
Rigard.KrawitzQ = {
	NotStarted   : 0,
	Started      : 1,
	HeistDone    : 2,
	HuntingTerry : 3,
	CaughtTerry  : 4
};
Rigard.Barnaby = { //Bitmask
	Met     : 1,
	Blowjob : 2,
	PassedOut : 4
};

Rigard.prototype.ToStorage = function() {
	var storage = {};

	storage.flags   = this.flags;
	storage.twoP    = this.Twopenny;
	storage.Krawitz = this.Krawitz;
	storage.Brothel = this.Brothel;
	storage.CW      = this.CW;
	if(this.cwrel.base != 0)
		storage.cwrel = this.cwrel.base.toFixed();
	storage.LB      = this.LB;
	storage.LBroom  = this.LBroomTimer.ToStorage();
	storage.PT      = this.ParadeTimer.ToStorage();
	if(this.KrawitzWorkDay)
		storage.KWork   = this.KrawitzWorkDay.ToStorage();

	storage.MS = this.MagicShop.ToStorage();

	if(this.alianaRel.base != 0)
		storage.alrel = this.alianaRel.base.toFixed();

	return storage;
}

Rigard.prototype.FromStorage = function(storage) {
	storage = storage || {};
	this.LBroomTimer.FromStorage(storage.LBroom);
	this.ParadeTimer.FromStorage(storage.PT);
	if(storage.KWork) {
		this.KrawitzWorkDay = new Time();
		this.KrawitzWorkDay.FromStorage(storage.KWork);
	}
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
	for(var flag in storage.twoP)
		this.Twopenny[flag] = parseInt(storage.twoP[flag]);
	for(var flag in storage.Krawitz)
		this.Krawitz[flag] = parseInt(storage.Krawitz[flag]);
	for(var flag in storage.Brothel)
		this.Brothel[flag] = parseInt(storage.Brothel[flag]);
	for(var flag in storage.CW)
		this.CW[flag] = parseInt(storage.CW[flag]);
	if(storage.cwrel)
		this.cwrel.base = parseInt(storage.cwrel) || this.cwrel.base;
	for(var flag in storage.LB)
		this.LB[flag] = parseInt(storage.LB[flag]);

	this.MagicShop.FromStorage(storage.MS);

	if(storage.alrel)
		this.alianaRel.base = parseInt(storage.alrel) || this.alianaRel.base;
}

Rigard.prototype.Update = function(step) {
	this.LBroomTimer.Dec(step);
	this.ParadeTimer.Dec(step);
}

Rigard.prototype.Visa = function() {
	return this.flags["Visa"] != 0;
}

Rigard.prototype.Visited = function() {
	return miranda.flags["Met"] != 0;
}

Rigard.prototype.Access = function() {
	return this.Visa();
}
// TODO: add other ways
Rigard.prototype.RoyalAccess = function() {
	return this.flags["RoyalAccess"] != 0;
}
// TODO: use flags
Rigard.prototype.CastleAccess = function() {
	return false;
}

Rigard.prototype.GatesOpen = function() {
	return WorldTime().hour >= 8 && WorldTime().hour < 17;
}

Rigard.prototype.UnderLockdown = function() {
	return this.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry;
}

Rigard.prototype.MetBarnaby = function() {
	return this.flags["Barnaby"] & Rigard.Barnaby.Met;
}
Rigard.prototype.BlownBarnaby = function() {
	return this.flags["Barnaby"] & Rigard.Barnaby.Blowjob;
}

RigardScenes.CityHistory = function() {
	let rigard = GAME().rigard;
	let party = GAME().party;

	Text.Clear();
	var parse = {};

	if(party.location == RigardLoc.Plaza) {
		parse.person = "a well-dressed youngster";
		parse.finish = "After ruffling her hair,";
	}
	else if(party.location == RigardLoc.ShopStreet.street) {
		parse.person = "a cleanly-dressed young catgirl";
		parse.finish = "After scratching behind her ears,";
	}
	else if(party.location == RigardLoc.Residential.street ||
	        party.location == RigardLoc.Slums.gate) {
		parse.person = "a shabbily-dressed young doggirl";
		parse.finish = "After scratching behind her ears,";
	}
	else if(party.location == RigardLoc.Gate) {
		parse.person = "a straight-backed youngster";
		parse.finish = "After ruffling her hair,";
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
	if(party.location == RigardLoc.ShopStreet.street ||
	   party.location == RigardLoc.Residential.street ||
	   party.location == RigardLoc.Slums.gate)
		Text.Add("- although my parents tell me that's just something the humans made up - ", parse);
	Text.Add("who sometimes fought with each other, and sometimes got along. But then, in one of the weaker tribes was born Riordain, along with his twin brother Riorbane.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Riorbane was way cooler than his brother, and had lots of awesome adventures!”</i> the girl exclaims. <i>“But the adults mainly honor Riordain because he ended up founding the kingdom. I'm not sure how he did it, but he got all the humans to follow him, and they built the castle you can see over there,”</i> she tells you, waving over at the castle towering above the city, <i>“to be the capital of the new kingdom. The city was named Rigard in Riordain's honor.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Well, that was centuries and centuries ago, and the city's just been growing since then. The most recent outer walls were finished back in my grandparents' time, and you must've seen how more and more houses are spilling out past them when you came in,”</i> she finishes her story.", parse);
	Text.NL();
	Text.Add("You smile warmly at her, and thank her for telling you the story. [finish] you part ways.", parse);
	Text.Flush();

	TimeStep({minute: 20});
	Gui.NextPrompt();
}

RigardScenes.ChatterIntro = function(parse, enteringArea) {
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
	introText.AddEnc(function() {
		Text.Add("As you walk along, you overhear [aAn1] [NPC1] and [aAn2] [NPC2] talking.", parse);
	}, 1.0);
	introText.Get();
}

RigardScenes.ChatterOutro = function(parse) {
	var outroText = new EncounterTable();
	outroText.AddEnc(function() {
		Text.Add("Their conversation fades behind you as you walk on.", parse);
	});
	outroText.AddEnc(function() {
		Text.Add("Your steps take you out of hearing range of their conversation.", parse);
	});
	outroText.AddEnc(function() {
		Text.Add("A sudden surge in the noise coming from the crowd makes the rest of the conversation impossible to hear.", parse);
	}, 1.0, function() { return WorldTime().hour >= 8 && WorldTime().hour < 19; });
	outroText.AddEnc(function() {
		Text.Add("You turn a corner, and the conversation grows inaudible behind you.", parse);
	});
	outroText.AddEnc(function() {
		Text.Add("Your paths diverge, and they soon pass out of hearing range.", parse);
	});
	outroText.AddEnc(function() {
		Text.Add("They turn and enter a building, their conversation muffled behind a closed door.", parse);
	});
	outroText.Get();
}

RigardScenes.Chatter = function(enteringArea) {
	let rigard = GAME().rigard;
	let party = GAME().party;

	Text.Clear();
	var parse = {};

	var posh = false;
	
	var npcsA = [];
	var npcsB = [];
	if(party.location == RigardLoc.Plaza) {
		parse.areaname = "plaza";
		posh = true;

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
	else if(party.location == RigardLoc.ShopStreet.street) {
		parse.areaname = "merchant's district";

		npcsA.push({noun: "poor merchant", a: "a", gender: Math.random() > 0.5 ? Gender.male : Gender.female});
		npcsA.push({noun: "colorful actor", a: "a", gender: Math.random() > 0.5 ? Gender.male : Gender.female});
		npcsA.push({noun: "skinny bard", a: "a", gender: Gender.male});
		npcsA.push({noun: "ragged beggar", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
		npcsA.push({noun: "muscular farmer", a: "a", gender: Gender.male});
		var gen = Math.random() > 0.3;
		npcsA.push({noun: gen ? "guardsman" : "guardswoman", a: "a", gender: gen ? Gender.male : Gender.female});

		npcsB.push({noun: "rich merchant", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
		npcsB.push({noun: "shopping noblewoman", a: "a", gender: Gender.female});
		npcsB.push({noun: "well-dressed retainer", a: "a", gender: Gender.male});
		npcsB.push({noun: "wealthy proprietor", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
	}
	else if(party.location == RigardLoc.Residential.street ||
		    party.location == RigardLoc.Slums.gate) {
		if(party.location == RigardLoc.Residential.street)
			parse.areaname = "residential district";
		else
			parse.areaname = "slums";

		npcsA.push({noun: "filthy laborer", a: "a", gender: Gender.male});
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
	else if(party.location == RigardLoc.Gate) {
		parse.areaname = "gate district";

		npcsA.push({noun: "rugged guard", a: "a", gender: Math.random() > 0.4 ? Gender.male : Gender.female});
		npcsA.push({noun: "rookie guard", a: "a", gender: Math.random() > 0.4 ? Gender.male : Gender.female});
		npcsA.push({noun: "guard trainer", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
		npcsA.push({noun: "guard lieutenant", a: "a", gender: Math.random() > 0.2 ? Gender.male : Gender.female});
		npcsA.push({noun: "court official", a: "a", gender: Math.random() > 0.2 ? Gender.male : Gender.female});

		npcsB.push({noun: "plump farmer", a: "a", gender: Math.random() > 0.3 ? Gender.male : Gender.female});
		npcsB.push({noun: "worn-out traveler", a: "a", gender: Math.random() > 0.5 ? Gender.male : Gender.female});
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
		if(party.location == RigardLoc.Plaza)
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
	RigardScenes.ChatterIntro(parse, enteringArea);

	Text.NL();

	// Main rumor body
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“You know, the other day I heard that a new portal opened up out in the plains and a [randommanWoman] came through,”</i> the [NPC1] says.", parse);
		Text.NL();
		Text.Add("<i>“Nonsense! Everyone knows there haven't been any portals in ten years!”</i> The [NPC2] waves a hand dismissively.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Have you heard? Some merchant caravan came in yesterday from the oasis, and they say lone travelers have been disappearing out there,”</i> the [NPC1] says.", parse);
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
		Text.Add("<i>“Apparently, [rheshe]'s seen huge groups of them gathering together and just wandering around. [rHeShe]'s afraid they'll come attack his farm or something.”</i>", parse);
		Text.NL();
		Text.Add("The [NPC2] half-smiles. <i>“[rHeShe]'s afraid of a rabbit attack? Bizarre.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“I wish they'd get rid of these ridiculous security measures. It's become so annoying to get into the city or leave again,”</i> the [NPC1] complains.", parse);
		Text.NL();
		Text.Add("<i>“They're there for good reason!”</i> The [NPC2] sounds offended. <i>“You don't want the outlaws to come and murder us in our sleep, do you?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Bah, I bet it's just a small group, hiding in the woods and hunting game. How dangerous could they be?”</i>", parse);
	}, 1.0, function() { return party.location != RigardLoc.Slums.gate; });
	scenes.AddEnc(function() {
		if(poshList) {
			Text.Add("<i>“I had a chance to visit the Royal Guard the other day, you know,”</i> the [NPC1] remarks.", parse);
			Text.NL();
			Text.Add("<i>“Oh, how did it go?”</i>", parse);
			Text.NL();
			Text.Add("<i>“They were most gracious and accommodating. Just really nice people.”</i>", parse);
			Text.NL();
			Text.Add("The [NPC2] smiles in approval. <i>“I'm glad at least some in this city still understand who they're supposed to listen to.”</i>", parse);
		}
		else {
			Text.Add("<i>“Have I told you how I ran into one of those Royal Guard assholes the other day?”</i> the [NPC1] asks.", parse);
			Text.NL();
			Text.Add("<i>“No, what happened?”</i>", parse);
			Text.NL();

			var opts = [];
			opts.push("<i>“He said I was loitering, and my clothes were of a cut not allowed in the city. Ugh...”</i> [heshe1] groans in frustration. <i>“Basically, he was demanding a bribe, and I had no choice but to buy him off.”</i>");
			opts.push("<i>“He said that I was too non-human, that being so morphed is beyond Lady Aria's will. I think he was just looking for an excuse to beat me up, but I managed to run off.”</i>");
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
	// Bull tower
	if(outlaws.BullTowerCompleted() && !hasRoyalGuard) {
		if(outlaws.AlaricSaved()) {
			scenes.AddEnc(function() {
				Text.Add("<i>“So I caught the servants gossiping about something dreadful the other day,”</i> the [NPC1] says.", parse);
				Text.NL();
				Text.Add("<i>“Oh? What was it?”</i>", parse);
				Text.NL();
				Text.Add("<i>“They believe that the Royal Guard has taken to doing away with those whom they don’t like.”</i>", parse);
				Text.NL();
				Text.Add("<i>“How shocking! Truly, the envy of the poor knows no bounds.”</i>", parse);
				Text.NL();
				Text.Add("The [NPC1] shakes [hisher1] head. <i>“They’d rather conjure up stories of oppression than take a long, hard look at their own failings.”</i>", parse);
			}, 1.0, function() { return posh; });
			scenes.AddEnc(function() {
				Text.Add("<i>“I’ve heard talk that the Royal Guard have been 'disappearing' people the nobles find troublesome,”</i> the [NPC1] says.", parse);
				Text.NL();
				Text.Add("<i>“What?! You can’t be serious! I mean, I can see them shaking down someone or just beating them up, but killing them?”</i>", parse);
				Text.NL();
				Text.Add("<i>“Ssh! Not so loud! This one guy got jumped by them and survived, you see…”</i>", parse);
			}, 1.0, function() { return !posh; });
			scenes.AddEnc(function() {
				Text.Add("<i>“I’ve had word that the treasury’s coffers are running dry again.”</i>", parse);
				Text.NL();
				Text.Add("<i>“So long as it doesn’t mean raised taxes…”</i>", parse);
				Text.NL();
				Text.Add("<i>“What do you think are the chances of that? There’s been a lot of road-laying and wall-building this year. Even with just the new paving of the roads leading out of the slums, Rewyn’s going through money like a dragon.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Eh, I wouldn’t know…”</i>", parse);
				Text.NL();
				Text.Add("<i>“Have you heard the rumors that someone’s stealing from under Rewyn’s nose? Now that…”</i>", parse);
			}, 1.0, function() { return true; });
		}
		else {
			scenes.AddEnc(function() {
				Text.Add("<i>“I hear those forest outlaws are getting more dangerous these days,”</i> [NPC1] says.", parse);
				Text.NL();
				Text.Add("<i>“Dangerous? I don’t know, I haven’t seen a single one.”</i>", parse);
				Text.NL();
				Text.Add("<i>“It’s true! I heard they tried to break one of their fellows out from the clink, but the Royal Guard stopped them dead cold.”</i>", parse);
				Text.NL();
				Text.Add("<i>“And where did you hear this from? The Royal Guard?”</i>", parse);
				Text.NL();
				Text.Add("<i>“Um…”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“I heard those outlaws have been taking out royal officials,”</i> [NPC1] says. <i>“They took a guy from the royal treasury.”</i>", parse);
				Text.NL();
				Text.Add("<i>“That one? I heard about it, too. But it was this royal guard who was saying it…”</i>", parse);
				Text.NL();
				Text.Add("<i>“I know they aren’t the most trustworthy of the lot, but who else is going to report on crimes on folk in the palace?”</i>", parse);
				Text.NL();
				Text.Add("<i>“That’s true… but I still can’t bring myself to trust them. I guess it’s a dangerous time to be working for the king. Squeezed between his Highness and the people who hate him…”</i>", parse);
			}, 1.0, function() { return true; });
		}
		//Success or failure
		scenes.AddEnc(function() {
			Text.Add("<i>“I’ve heard that people are disappearing on the King’s Road now. First, it was the outlying caravan trails, now it’s the King’s Road.”</i> The [NPC1] looks a little worried. <i>“Soon, there won’t be anywhere that’s safe. It won’t be good for business if the Free Cities are cut off from Rigard.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Yeah, but look at it this way - at least it’s better to die by bandits than just vanish into the unknown. Leastways there’s a body, right?”</i>", parse);
			Text.NL();
			Text.Add("<i>“You’re asking if it’s better to die from being run through or burned alive, you dolt. Dead either way, you know?”</i> The [NPC1] sighs. <i>“The old king should never have decommissioned Bull Tower.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Those were safer times…”</i>", parse);
			Text.NL();
			Text.Add("<i>“And these aren’t. Rewyn needs to garrison it again.”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“The Royal Guard is getting really antsy about this whole outlaw thing.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Oh? I didn’t listen to Preston’s public proclamation. Wasn’t it the usual nonsense on how he’s going to eradicate vice and crime in the city? He’s given the same speech a thousand times. Sometimes, he doesn’t even change the words.”</i>", parse);
			Text.NL();
			Text.Add("<i>“No, it was something else - about how he’s taking personal charge of the move against those forest folk, since the regular guard is being completely and utterly worthless when it comes to stopping them.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I don’t know about that - I haven’t seen a single outlaw in the city…”</i>", parse);
		}, 1.0, function() { return true; });
	}

	// TODO: MORE RUMORS AFTER NIGHT INFILTRATION
	scenes.Get();

	Text.NL();
	// Outro text
	RigardScenes.ChatterOutro(parse);

	if(!enteringArea)
		TimeStep({minute: 10});

	Text.Flush();
	// Next button
	Gui.NextPrompt();
}

//New Del stuff
RigardScenes.Chatter2 = function(enteringArea) {
	let rigard = GAME().rigard;
	let party = GAME().party;
	let player = GAME().player;
	let miranda = GAME().miranda;

	Text.Clear();
	var parse = {
		playername : player.name
	};

	var npcsLower   = [];
	var npcsMiddle1 = [];
	var npcsMiddle2 = [];
	var npcsNoble   = [];

	npcsLower.push({noun: "ragged servant", a: "a"});
	npcsLower.push({noun: "tired servant", a: "a"});
	npcsLower.push({noun: "skinny bard", a: "a"});
	npcsLower.push({noun: "ragged beggar", a: "a"});
	npcsLower.push({noun: "filthy laborer", a: "a"});
	npcsLower.push({noun: "poor workman", a: "a", gender: Gender.male});
	npcsLower.push({noun: "breastfeeding mother", a: "a", gender: Gender.female});
	npcsLower.push({noun: "gaunt woman", a: "a", gender: Gender.female});
	npcsLower.push({noun: "drab farmer", a: "a"});
	npcsLower.push({noun: "bedraggled laborer", a: "a"});

	var CreateLower = function() {
		var idx = Rand(npcsLower.length);
		var npc = npcsLower[idx]; npcsLower.remove(idx);
		if(!npc.gender) npc.gender = Math.random() > 0.5 ? Gender.male : Gender.female;
		return npc;
	}

	npcsMiddle1.push({noun: "poor merchant", a: "a"});
	npcsMiddle1.push({noun: "colorful actor", a: "a", gender: Gender.male});
	npcsMiddle1.push({noun: "pudgy farmer", a: "a"});
	npcsMiddle1.push({noun: "off-duty guard", a: "an"});
	npcsMiddle1.push({noun: "pretty courtesan", a: "a", gender: Math.random() > 0.8 ? Gender.male : Gender.female});
	npcsMiddle1.push({noun: "dour worker", a: "a"});
	var gender = Math.random() > 0.5 ? Gender.male : Gender.female;
	npcsMiddle1.push({noun: "muscular trades" + gender == Gender.male ? "man" : "woman", a: "a", gender: gender});
	var gender = Math.random() > 0.5 ? Gender.male : Gender.female;
	npcsMiddle1.push({noun: "stylish " + gender == Gender.male ? "man" : "woman", a: "a", gender: gender});

	var CreateMiddle1 = function() {
		var idx = Rand(npcsMiddle1.length);
		var npc = npcsMiddle1[idx]; npcsMiddle1.remove(idx);
		if(!npc.gender) npc.gender = Math.random() > 0.5 ? Gender.male : Gender.female;
		return npc;
	}

	npcsMiddle2.push({noun: "well-off merchant", a: "a"});
	npcsMiddle2.push({noun: "plump farmer", a: "a"});
	npcsMiddle2.push({noun: "well-dressed retainer", a: "a"});
	npcsMiddle2.push({noun: "tall moneychanger", a: "a"});
	npcsMiddle2.push({noun: "guild administrator", a: "a"});
	npcsMiddle2.push({noun: "prim clerk", a: "a"});
	npcsMiddle2.push({noun: "haughty painter", a: "a"});

	var CreateMiddle2 = function() {
		var idx = Rand(npcsMiddle2.length);
		var npc = npcsMiddle2[idx]; npcsMiddle2.remove(idx);
		if(!npc.gender) npc.gender = Math.random() > 0.5 ? Gender.male : Gender.female;
		return npc;
	}

	npcsNoble.push({noun: "colorful", a: "a"});
	npcsNoble.push({noun: "wealthy", a: "a"});
	npcsNoble.push({noun: "tall", a: "a"});
	npcsNoble.push({noun: "stout", a: "a"});
	npcsNoble.push({noun: "portly", a: "a"});
	npcsNoble.push({noun: "energetic", a: "an"});
	npcsNoble.push({noun: "dour", a: "a"});
	npcsNoble.push({noun: "stylish", a: "a"});
	npcsNoble.push({noun: "stylish", a: "a"});
	npcsNoble.push({noun: "stylish", a: "a"});
	npcsNoble.push({noun: "fatherly", a: "a", gender: Gender.male});
	npcsNoble.push({noun: "motherly", a: "a", gender: Gender.female});
	npcsNoble.push({noun: "muscular", a: "a", gender: Gender.male});
	npcsNoble.push({noun: "curvy", a: "a", gender: Gender.female});

	var CreateNoble = function() {
		var idx = Rand(npcsNoble.length);
		var npc = npcsNoble[idx]; npcsNoble.remove(idx);
		if(!npc.gender) npc.gender = Math.random() > 0.5 ? Gender.male : Gender.female;
		npc.noun += " noble";
		npc.noun += (gender == Gender.male ? "man" : "woman");
		return npc;
	}

	if(party.location == RigardLoc.Plaza)
		parse.areaname = "plaza";
	else if(party.location == RigardLoc.ShopStreet.street)
		parse.areaname = "merchant's district";
	else if(party.location == RigardLoc.Residential.street)
		parse.areaname = "residential district";
	else if(party.location == RigardLoc.Slums.gate)
		parse.areaname = "slums";
	else if(party.location == RigardLoc.Gate)
		parse.areaname = "gate district";
	else if(party.location == RigardLoc.Castle.Grounds)
		parse.areaname = "royal grounds";
	else return; // Incorrect location

	var SetGenders = function(npc1, npc2) {
		npc1  = npc1  || {};
		npc2  = npc2  || {};
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
	}

	var SetRandomGender = function() {
		if(Math.random() > 0.5) {
			parse.rguygirl       = "guy";
			parse.rmanwoman      = "man";
			parse.rheshe         = "he";
			parse.rHeShe         = "He";
			parse.rhisher        = "his";
			parse.rhimher        = "him";
			parse.rhishers       = "his";
			parse.rfamo          = "fa";
			return Gender.male;
		}
		else {
			parse.rguygirl       = "girl";
			parse.rmanwoman      = "woman";
			parse.rheshe         = "she";
			parse.rHeShe         = "She";
			parse.rhisher        = "her";
			parse.rhimher        = "her";
			parse.rhishers       = "hers";
			parse.rfamo          = "mo";
			return Gender.female;
		}
	}

	var nobleArea  = party.location == RigardLoc.Plaza ? 1 :
	                 party.location == RigardLoc.ShopStreet.street ? 1 :
	                 party.location == RigardLoc.Castle.Grounds ? 1 : 0;
	var middleArea = party.location == RigardLoc.Plaza ? 1 :
	                 party.location == RigardLoc.ShopStreet.street ? 2 :
	                 party.location == RigardLoc.Residential.street ? 1 :
	                 party.location == RigardLoc.Gate ? 1 : 0;
	var lowerArea  = party.location == RigardLoc.ShopStreet.street ? 1 :
	                 party.location == RigardLoc.Residential.street ? 1 :
	                 party.location == RigardLoc.Gate ? 1 :
	                 party.location == RigardLoc.Slums.gate ? 1 : 0;

	var CreateNPC = function(lower, mid1, mid2, noble) {
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			return CreateLower();
		}, lowerArea, lower);
		scenes.AddEnc(function() {
			return CreateMiddle1();
		}, middleArea, mid1);
		scenes.AddEnc(function() {
			return CreateMiddle2();
		}, middleArea, mid2);
		scenes.AddEnc(function() {
			return CreateNoble();
		}, nobleArea, noble);
		return scenes.Get();
	}

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, true, true, false),
		           CreateNPC(true, true, true, false));

		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“Have you seen the prince and princess?”</i> the [NPC1] asks.", parse);
		Text.NL();
		Text.Add("The [NPC2] grimaces. <i>“No, I somehow have to work every time there’s any public appearance.”</i>", parse);
		Text.NL();
		Text.Add("<i>“You’re really missing out. They have such beautiful shoulder-length red hair, and such poise. Somehow, every time I see them, I can’t help but imagine what they’d be like as a couple.”</i> The [NPC1] stops, apparently realizing what [heshe1] just said.", parse);
		Text.NL();
		Text.Add("<i>“...you’re quite the pervert, aren’t you.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, Math.max(lowerArea, middleArea), function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, false, false, false),
		           CreateNPC(true, false, false, false));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“...you just gotta survive till the twins take over. They’ll raise the morphs up, make everyone’s lives better, make sure every family goes fed,”</i> the [NPC1] reassures the [NPC2].", parse);
		Text.NL();
		Text.Add("<i>“Really? That sounds like a pipe dream. Why would any noble give up their own power?”</i>", parse);
		Text.NL();
		Text.Add("<i>“I swear ‘tis true! My cousin’s friend’s sister works in the palace, and he tells me she swears whenever she encounters Rumi or Rani, they treat her very well. Obviously, they can’t say anything in support of morphs in front of Rewyn, but…”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, lowerArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, true, true, true),
		           CreateNPC(true, true, true, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“You hear about Krawitz’ wife and daughter getting it on with the servants?”</i> the [NPC1] asks.", parse);
		Text.NL();
		Text.Add("<i>“Ha, yeah, those lucky bastards! I’ve seen the pair of them in the street and, even clothed, their bodies were stunning.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I bet Krawitz is jealous of them too. No doubt in my mind that old goat was angling to sleep with both of ‘em himself.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, 1.0, function() { return rigard.Krawitz["F"] & Scenes.Krawitz.Flags.Orgy; });
	scenes.AddEnc(function() {
		Text.Add("Walking along, your eyes are drawn to a man in front of you. He reaches up to pull the hood of his cloak further down over his face, even though only a hint of his features is visible as it is.", parse);
		Text.NL();
		Text.Add("Hold on… now that you look, isn’t that Krawitz? The same paunch to his stomach, the same height, the same ratty eyes. There’s a new slump to his shoulders, however, as he hunches down beneath his hood and hurries along somewhere.", parse);
		Text.NL();
		Text.Add("You consider calling attention to him, but decide against it. He seems to be suffering enough already.", parse);
	}, 1.0, function() { return rigard.Krawitz["Q"] >= Rigard.KrawitzQ.CaughtTerry; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, true, true, false),
		           CreateNPC(true, true, true, false));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“...thief that robbed Krawitz got let out,”</i> the [NPC1] remarks.", parse);
		Text.NL();
		Text.Add("<i>“What, really? How in the world do you rob a noble and get away with it?”</i> the [NPC2] asks, then clears [hisher1] throat. <i>“Hypothetically speaking, that is.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Dunno. People are saying there were orders from up above. Sounds like Krawitz pissed off someone real powerful, and they sent the thief to get him. Almost makes you feel sorry for the bastard.”</i>", parse);
		Text.NL();
		Text.Add("The [NPC2] nods, then smiles. <i>“Almost.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, Math.max(lowerArea, middleArea), function() { return terry.flags["Saved"] >= TerryFlags.Saved.Saved; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, true, true, false),
		           CreateNPC(true, true, true, false));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“Why do they call that Royal Guard captain Preston the Shining?”</i> the [NPC1] asks.", parse);
		Text.NL();
		Text.Add("<i>“Guess you haven’t seen him, or you’d know,”</i> the [NPC2] says. <i>“Keeps his armor burnished till it could be used for a mirror.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Ah, figures it’d be something like that,”</i> the [NPC1] says, rolling [hisher1] eyes.", parse);
		Text.NL();
		Text.Add("<i>“Someday, I’d like him to walk by my window, so I can empty my chamber pot on him. Maybe we could call him Preston the Shithead then. It’d match his character better.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, Math.max(lowerArea, middleArea), function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, true, true, true),
		           CreateNPC(false, true, true, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“...noble idea to uphold morals, but Preston doesn’t understand that debauchery was always here, and it will always be here,”</i> the [NPC1] says. <i>“It is not the place of the Royal Guard to somehow try to change that.”</i>", parse);
		Text.NL();
		Text.Add("The [NPC2] nods. <i>“Heh, I heard before his father became a minister, he managed a cabaret with burlesque, special entertainment in the back - the whole package.”</i>", parse);
		Text.NL();
		Text.Add("<i>“It’s a pity his son did not take more after him.”</i> The [NPC1] grins. <i>“We could use a few more places like that.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, Math.max(nobleArea, middleArea), function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, true, true, true),
		           CreateNPC(false, true, true, true));
		SetRandomGender();
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“Have you seen the teapot in Lady’s Blessing? I swear it looks like a monster out of legend,”</i> the [NPC1] says.", parse);
		Text.NL();
		Text.Add("<i>“Aye, perhaps a small one,”</i> the [NPC2] replies. <i>“I heard that Jeanne made it. Figures an elf would make some weird plant animal thing.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Oh come, she’s not all bad. My grand[rfamo]ther used to come to her for advice all the time. And besides, the tea is really good.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Y’mean the grand[rfamo]ther that gambled half [rhisher] money away?”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, Math.max(nobleArea, middleArea), function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, true, true, true),
		           CreateNPC(false, true, true, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“...should just hire some mercenaries when we need them. I don’t want to see an ever growing standing army that slowly takes over the state,”</i> the [NPC1] says.", parse);
		Text.NL();
		Text.Add("<i>“And mercenaries are better?”</i> the [NPC2] asks. <i>“Sure, they’ll go away - once they steal everything worth stealing.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, there’s Lei. People say he’s never so much as deviated from a contract. We just need to get a bunch more like that from wherever it was he came from.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, Math.max(nobleArea, middleArea), function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, true, true, true),
		           CreateNPC(true, true, true, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“When are you finally going to go?”</i> the [NPC1] asks.", parse);
		Text.NL();
		Text.Add("<i>“This week. I swear,”</i> the [NPC2] says. After an uncomfortable moment, [heshe2] continues, <i>“Yes, yes, I know. I have said that before, but damn it Rewyn is scary.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Scary? He’s the king…”</i>", parse);
		Text.NL();
		Text.Add("<i>“Sure, but have you seen him?”</i> The [NPC2] shivers. <i>“One time, I was in the crowd watching him deliver a speech from the balcony, and his eyes looked like he was wondering if it was better if all of us were alive or dead. I can’t help but think that if I submit my petition, he’ll be likely to throw me in the dungeon for temerity as to help me.”</i>", parse);
		Text.NL();
		Text.Add("The [NPC1] laughs. <i>“Oh come on, you know he doesn’t do that,”</i> [heshe1] says, though the lilt in [hisher1] voices suggests [heshe1] isn’t entirely certain.", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, false, true, true),
		           CreateNPC(false, false, true, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“With all due respect to her majesty,”</i> the [NPC1] says, <i>“however much that is, I wish Rewyn would just keep her away from Rumi and Rani.”</i>", parse);
		Text.NL();
		Text.Add("<i>“You’d keep Rhylla away from her own children?”</i> the [NPC2] asks. <i>“Isn’t that a touch… villainous?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Look, if she were the mother of some farmer, I wouldn’t care,”</i> the [NPC1] says, sounding agitated. <i>“But it’s the future of our kingdom she’s messing with here. She spoils them, shields them from their father’s instructions, takes them with her to her backwater estates for months each year, and just spews her weird attitudes into their minds.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, when you put it that way…”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, Math.max(nobleArea, middleArea), function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, false, false, true),
		           CreateNPC(false, false, false, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“I never quite comprehend how our king got stuck with someone like Rhylla for a consort,”</i> the [NPC1] says. <i>“She has a nice enough rack, and I wouldn’t mind getting some of that butt, but really…”</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, he needed her family in the war, I think. Probably didn’t have much time to think of anything else,”</i> the [NPC2] replies.", parse);
		Text.NL();
		Text.Add("<i>“But they grow wine! Wine, for the Lady’s sake! I bet she doesn’t even have a single drop of Riordain’s blood in her…”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, nobleArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, true, true, true),
		           CreateNPC(true, true, true, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		parse["rboygirl"] = Math.random() > 0.5 ? "boy" : "girl";
		Text.NL();
		Text.Add("<i>“I heard Majid has a new pair of [rboygirl]s following him around again,”</i> the [NPC1] says. <i>“I don’t get why the king stands for it.”</i>", parse);
		Text.NL();
		Text.Add("<i>“They may be young, but they’re morphs,”</i> the [NPC2] replies. <i>“I think so long as his advisor isn’t butchering them in the courtyard, Rewyn won’t care.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I heard the way they come back… it might not be much better. He has them wear those leather outfits, and I don’t even want to know what he does behind closed doors.”</i>", parse);
		Text.NL();
		Text.Add("The [NPC2] shakes [hisher2] head, and shudders. <i>“Well, I hope that veil he wears at least prevents whatever it is he has from spreading to them. I don’t want a creepiness plague to burn through the city.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, false, false, false),
		           CreateNPC(true, false, false, false));
		SetRandomGender();
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("The [NPC1] sighs. <i>“We might have to get on with just bread for a while. My cousin cut through an alleyway yesteday evening--”</i>", parse);
		Text.NL();
		Text.Add("<i>“An’ got robbed?”</i> the [NPC2] interjects. <i>“[rHeShe] should’ve known better.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Yeah, but you know how [rheshe] is. At least [rheshe] had sense enough to carry only a few coins, or we’d be on the edge of starving.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, lowerArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, false, false, false),
		           CreateNPC(true, false, false, false));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“...finally gave my wife a raise. I think we can afford a nicer room now,”</i> the [NPC1] says.", parse);
		Text.NL();
		Text.Add("<i>“Right. Guess it’s a bit cramped for you lot right now,”</i> the [NPC2] replies.", parse);
		Text.NL();
		Text.Add("<i>“The two of us, her brother, and three children in a single room and kitchen ain’t a picnic. I’m really looking forward to going down on her without worrying the kids are watching,”</i> the [NPC1] says, then grins. <i>“Though I have to admit I’ll miss the couple living in the next room over. Hearing them going at it like bunnies always got the missus hot as hell.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, ain’t that the way of the world.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, lowerArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, false, false, false),
		           CreateNPC(true, false, false, false));
		SetRandomGender();
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“I simply love those berry pastries you make,”</i> the [NPC1] remarks. <i>“I bet if you sold them, the whole quarter would be all over them.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Aye, I’ve had the same thought, truth be told. But I’m afraid the baker’s guild would be all over me instead,”</i> the [NPC2] replies.", parse);
		Text.NL();
		Text.Add("<i>“They <b>can</b> be pretty brutal sometimes. I know this [rguygirl] in the administration office there, though. Maybe if you did [rhimher] a favor, [rheshe]’d help you out.”</i>", parse);
		Text.NL();
		Text.Add("<i>“What kinda favor?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Don’t worry, [rheshe]’s really cute. You’ll love it.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, lowerArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(true, false, false, false),
		           CreateNPC(true, false, false, false));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“It’s days like these I almost hope those hobknockers hiding in the woods would pull their dicks out of the deer and take over the city already,”</i> the [NPC1] says, a light growl in [hisher1] voice.", parse);
		Text.NL();
		Text.Add("The [NPC2] quickly glances around before responding. <i>“Shh, don’t let anyone hear you say that. Though between you and me, at least they know us morphs are as good as humans. Hell, maybe they’d even put us on top.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Ha! Wouldn’t that be the day?”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, lowerArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, false, true, false),
		           CreateNPC(false, false, true, false));
		SetRandomGender();
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“...so, [rheshe] just barged in when I was talking to the grocer, [rhisher] nose turned up to the sky, and demanded that [rheshe] be served first,”</i> the [NPC1] complains. <i>“Naturally, I protested that, noble or not, [rheshe] should wait in line, like anybody else.”</i>", parse);
		Text.NL();
		Text.Add("The [NPC2] looks sympathetic, and opens [hisher2] mouth to say something a few times, but can’t quite get a word in.", parse);
		Text.NL();
		Text.Add("<i>“So then a royal guard came and just shoved me away. Shoved! ‘The dignity of the nobility must be upheld,’ he said. What dignity, I ask you? Half of them are poorer than us, and most of them haven’t done a useful thing in their entire lives. Doesn’t this high and mighty ‘dignity’ need to be earned?”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, middleArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, false, true, false),
		           CreateNPC(false, false, true, false));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“It’s hard to save up enough leave a good amount for all my children,”</i> the [NPC1] says. <i>“I wanted them to be comfortable, but it seems like they’ll have to make their own way.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Tell me about it,”</i> the [NPC2] replies. <i>“I think I’m going to send my second daughter to the Shrine of Aria. Getting in isn’t cheap, but it sure is cheaper than getting enough together to set her up on her own.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Ha, not a bad idea! Those priests do pretty well for themselves.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, middleArea, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("As you’re walking along, you overhear a conversation between two well-dressed middle-aged men.", parse);
		Text.NL();
		Text.Add("<i>“She’s such a pretty young thing. And she loves it when my hand brushes her butt and I ‘accidentally’ give it a squeeze - especially in public.”</i> The balding man emphasizes this last remark with a deep belly laugh.", parse);
		Text.NL();
		Text.Add("<i>“Isn’t she from a poor family, though?”</i> his companion asks.", parse);
		Text.NL();
		Text.Add("<i>“Oh, of course, but she’s rich where it counts.”</i> He makes a spherical motion in front of his chest. <i>“Besides, there are upsides to poor families. Her parents didn’t like me at first, but when I mentioned my annual income they came around right quick…”</i>", parse);
	}, middleArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, true, true, false),
		           CreateNPC(false, true, true, false));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("The [NPC1] glances around secretively, and leans a little toward the [NPC2]. <i>“Last night was so much fun, you wouldn’t even believe it.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Oh?”</i>", parse);
		Text.NL();
		Text.Add("<i>“I went to the Adylay of Adows... umm... shay.”</i> [HeShe1] winks so blatantly it’s probably visible from behind [himher1].", parse);
		Text.NL();
		Text.Add("<i>“Did you visit the fox girl again?”</i> the [NPC2] asks.", parse);
		Text.NL();
		Text.Add("<i>“Shh, not so loud! The things she can do with her tail…”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, middleArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, true, true, false),
		           CreateNPC(false, true, true, false));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“I’ve found this great butcher’s store that’s opened just off Reprun street by the Plaza,”</i> the [NPC1] says. <i>“Perfect fresh cuts, and very good prices.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I have heard of that place,”</i> the [NPC2] replies, looking a little dejected, <i>“but don’t really want to go. Whenever I’m in that area, I get all these funny looks.”</i> [HeShe2] motions at [hisher2] dog ears by way of explanation.", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, middleArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, false, false, true),
		           CreateNPC(false, false, false, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“It’s simply the most dreadful case of you-know-what,”</i> the [NPC1] says, wincing theatrically.", parse);
		Text.NL();
		Text.Add("<i>“Have you considered a potion? Surely, in our day and age, such things should be easy to cure.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Ha! A potion? From whence? None of these alchemongers are to be trusted.”</i>", parse);
		Text.NL();
		Text.Add("The [NPC2] looks thoughtful. <i>“It is true, I must concede. A decade ago, I would’ve suggested that elf Jeanne, but she turned out to be as bad the rest.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, nobleArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, false, false, true),
		           CreateNPC(false, false, false, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“I had the worst experience today.”</i> The [NPC1] shudders.", parse);
		Text.NL();
		Text.Add("<i>“Why? What happened?”</i> the [NPC2] asks.", parse);
		Text.NL();
		Text.Add("<i>“I had an audience scheduled with the chancellor, and was on my way to meet him, when I ran into Majid in the hall…”</i>", parse);
		Text.NL();
		Text.Add("<i>“Oh, that really is the worst. One time, I spoke to him for half a minute, and I swear I still felt an oily film clinging to my skin after I took three baths.”</i>", parse);
		Text.NL();
		Text.Add("The [NPC1] nods emphatically. <i>“Disgusting. I don’t know how the king stands him.”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, nobleArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, false, false, true),
		           CreateNPC(false, false, false, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“...been looking, really I have, but how am I to find a match for him with his reputation?”</i> the [NPC1] demands, looking on the verge of tears. <i>“What family will trust their daughter to someone who no sooner proclaims his love for a woman than he starts cheating on her?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, have you considered looking for a family whose daughter does the same to her boyfriends?”</i> the [NPC2] suggests.", parse);
		Text.NL();
		Text.Add("<i>“What?! How could I trust my son to someone like that?”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, nobleArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, false, false, true),
		           CreateNPC(false, false, false, true));
		var gender = SetRandomGender();
		if(gender == Gender.female) {
			parse.xrsondaughter = "son";
			parse.xrheshe       = "he";
			parse.xrHeShe       = "He";
			parse.xrhisher      = "his";
			parse.xrhimher      = "him";
			parse.xrhishers     = "his";
		}
		else {
			parse.xrsondaughter = "daughter";
			parse.xrheshe       = "she";
			parse.xrHeShe       = "She";
			parse.xrhisher      = "her";
			parse.xrhimher      = "her";
			parse.xrhishers     = "hers";
		}
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“...my financial situation, you know. [rHeShe] offered me such a large dowry for my [xrsondaughter]’s hand,”</i> the [NPC1] says. <i>“It will take a stroke of fortune to makes ends meet if I refuse.”</i>", parse);
		Text.NL();
		Text.Add("The [NPC2] frowns. <i>“But having [xrhimher] marry a commoner? Truly? However much money that merchant has, isn’t that bestiality?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, I don’t know about that! Bestiality doesn’t require living with the animal, at least.”</i>", parse);
		Text.NL();
		Text.Add("The pair bursts into laughter at the remark.", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, nobleArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, false, false, true),
		           CreateNPC(false, false, false, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“So, the other day, the new girl was sweeping the floors, and you know, she has the most delicious butt,”</i> the [NPC1] says. <i>“Of course, walking by, I grabbed it and just gave it a nice, firm squeeze before moving on. And can you imagine? She raised her voice and complained!”</i>", parse);
		Text.NL();
		Text.Add("<i>“No!”</i> the [NPC2] exclaims, aghast.", parse);
		Text.NL();
		Text.Add("<i>“Yes. Said I should respect her, or some balderdash. Where’s her respect for me, I ask you? Servants just don’t know how to behave these days. Now in my pappy’s time…”</i>", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, nobleArea, function() { return true; });
	scenes.AddEnc(function() {
		SetGenders(CreateNPC(false, false, false, true),
		           CreateNPC(false, false, false, true));
		// Introductory text
		RigardScenes.ChatterIntro(parse, enteringArea);
		Text.NL();
		Text.Add("<i>“So, why did Krawitz,”</i> the [NPC1] begins, before being interrupted with an involuntary churtle from the [NPC2]. <i>“No, hear me out. Why did Krawitz skip the ball the other night?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Okay, why?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Because he’s still working on his mew look.”</i> The [NPC1] makes ears motions with [hisher1] hands above [hisher1] head, and both nobles break out in giggles.", parse);
		Text.NL();
		// Outro text
		RigardScenes.ChatterOutro(parse);
	}, nobleArea, function() { return rigard.Krawitz["F"] & Scenes.Krawitz.Flags.TF; });
	scenes.AddEnc(function() {
		Text.Add("Standing at the mouth of an alleyway, a short bulky man is chatting with a taller, broad-shouldered man. Their clothes hang a little loose on them, and are spotted with unpatched holes. The mention of rather impressive sexual acts catches your attention.", parse);
		Text.NL();
		Text.Add("<i>“So then, she took it and plunged it all the way in with a single motion,”</i> the shorter man continues.", parse);
		Text.NL();
		Text.Add("<i>“Ha, that sounds just like Raka! You really like her, huh?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Sure do. She told me with how often I come, soon I’ll be able to get a frequent visitor discount.”</i> He winces, rubbing the bridge of his nose. <i>“Truth be told, I could really use it too. I can’t go as often as I like with how much everything costs around here.”</i>", parse);
		Text.NL();
		Text.Add("The tall man nods in understanding. <i>“Aye, I’ve been trying to hold back from going to the Shadow Lady as much. I’m hoping to save up enough for a night with Bella Fiore.”</i>", parse);
		Text.NL();
		Text.Add("<i>“She’s pretty enough, but I don’t know if she’s so much better that she’s worth the price. Why not Aurea? She has the sexiest tongue…”</i>", parse);
		Text.NL();
		Text.Add("From there, their conversation devolves into a discussion of the relative merits of the girls at the brothel, and you decide to move on.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		SetRandomGender();
		Text.Add("As you’re walking along, a [rmanwoman] suddenly sprints past in front of you, pushing you roughly out of [rhisher] way. ", parse);
		if(party.Num() > 1) {
			parse["randomcompanion"] = party.GetRandom().name;
			Text.Add("[randomcompanion] grabs your arm, preventing you from falling. You grit your teeth in annoyance, glaring at the receding back of the [rmanwoman].", parse);
		}
		else {
			Text.Add("You barely catch your balance in time to avoid falling, and glare at the receding back of the [rmanwoman] in annoyance.", parse);
		}
		Text.NL();
		Text.Add("A moment later, you hear shrill whistles and the pounding of heavy boots, as the crowd parts to let through a trio of angry-looking watchmen", parse);

		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add(" led by Miranda.", parse);
			Text.NL();
			Text.Add("She glances in your direction, and manages to shout <i>“You should’ve stopped ‘em, [playername]!”</i> as she runs past. Pretty impressive observation skills on that woman to notice you while sprinting after a culprit. Or maybe she just really likes you.", parse);
		}, 1.0, function() { return !miranda.IsFollower() && !party.InParty(miranda); });
		scenes.AddEnc(function() {
			Text.Add(", who run past, huffing for air under the weight of their gear. They’re making a valiant effort, but unless the thief trips or some passerby catches [rhimher], you doubt they’ll be able to catch up.", parse);
		}, 1.0, function() { return true; });

		scenes.Get();

		Text.NL();
		Text.Add("You feel a little guilty for not catching on quickly enough to stop the thief. Perhaps you’ll do better another time.", parse);
	}, 1.0, function() { return WorldTime().hour >= 6 && WorldTime().hour < 19; });
	scenes.AddEnc(function() {
		Text.Add("A stout, flamboyantly dressed man is standing at the street corner in front of you, shouting in a boisterous voice. <i>“Have your needs been going unmet? Have you been having relationship troubles? Come visit the Shadow Lady! The finest establishment in the city! We won’t solve your problems, but you’ll sure feel better - that’s a guarantee!”</i>", parse);
		Text.NL();
		Text.Add("You’re not sure that’s quite the right way to advertise a brothel, but you can’t help but admire the man’s endurance. He shouts almost without pause, running from one recommendation into another, only occasionally taking sips from a flask in his hand to refresh himself.", parse);
		Text.NL();
		Text.Add("Perhaps your eyes linger too long on him, or you stand out in some other way, but as you draw near him, he singles you out from the crowd. <i>“You! I see that you have a lot of pent up sexual energy!”</i> he shouts loudly enough for the whole block to hear. <i>“You must come with me to the Shadow Lady, and there you will be granted release!”</i>", parse);
		Text.NL();
		Text.Add("You respond that he is most certainly mistaken, motioning for him to quiet down, and tell him that you really have things you must be about.", parse);
		Text.NL();
		Text.Add("<i>“No, you must come!”</i> He grabs your hand and you don’t react quite quickly enough to get away. <i>“If the tension bound up within you is not let out soon, you will most certainly suffer great consequences! Why, it must be months, if not years, since your last time!”</i>", parse);
		Text.Flush();

		//[Accept][Run]
		var options = new Array();
		options.push({ nameStr : "Accept",
			func : function() {
				Text.Clear();
				party.location = RigardLoc.Residential.street;
				Text.Add("Your face flushes slightly at his accusations, though it’s hard to say whether from embarrassment or anger. You curse at the little man, but tell him that if he wants you so desperately, you’ll come with him, if only he’ll stop shouting about your imagined sex life to the whole street.", parse);
				Text.NL();
				Text.Add("With your agreement secured, he grins widely, and leads on, speaking little, to your surprise. After a while, he remarks in a normal voice that there’s not much farther to go. Somehow, him holding up the agreement to be quiet so well just makes you feel all the more like you’ve been tricked.", parse);
				Text.NL();
				Text.Add("In front of you, you spot a plain sign reading ‘The Shadow Lady’ in elegant script. While approaching the large building, you see several men and women glance furtively around before darting inside, while several others exit, trying to look nonchalant. Looks like the brothel is doing a busy trade.", parse);
				Text.NL();
				Text.Add("Your escort glances through the door and exchanges a few words with someone inside before motioning for you to step through, and walking away.", parse);
				Text.Flush();

				TimeStep({minute: 30});
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Well, if he wants you so badly, you’ll come, if he’ll just be quiet."
		});
		options.push({ nameStr : "Run",
			func : function() {
				Text.Clear();
				if(party.Num() == 2)
					parse["comp"] = party.Get(1).name;
				else if(party.Num() > 2)
					parse["comp"] = "your companions";
				else
					parse["comp"] = "";

				parse["c1"] = party.Num() > 1 ? Text.Parse(", without even waiting to see if [comp] can keep up", parse) : "";
				Text.Add("You probably look a little silly, but you determinedly speed up to a jog, pushing past passersby[c1]. There are shouts about you running away because you’re afraid of intimacy behind you, but after half a minute you’re far enough that even the man’s prodigious voice begins to fade in the distance.", parse);
				Text.NL();
				parse["c2"] = party.Num() > 1 ? Text.Parse(", and wait for [comp] to catch up to you", parse) : "";
				Text.Add("After maintaining a brisk walk for a few minutes, you slow down[c2]. There. Chances are that no one around here even heard any of the shouted claims, and all they saw was you moving a bit faster than is usual.", parse);
				Text.NL();
				Text.Add("Problem. Solved.", parse);
				Text.Flush();

				TimeStep({minute: 10});
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Nope. You’re not having any of that. The best plan is to just get away from him."
		});
		Gui.SetButtonsFromList(options, false, null);

		return true;
	}, 1.0, function() { return rigard.Access() && WorldTime().hour >= 6 && WorldTime().hour < 19; });
	scenes.AddEnc(function() {
		Text.Add("A pair of elegantly dressed women are sitting together, sipping mulled wine. One of them looks to be in her early thirties, and leans forward, instructing her younger companion. <i>“I know it’s expensive, but it is of paramount importance that your children are well educated. Paramount.", parse);
		Text.NL();
		Text.Add("“They’ll need to write, count, and, most importantly, reason if they are to succeed on their own, or find a good partner for life. And besides, I bet you know just how much fun school can be,”</i> she adds, winking.", parse);
		Text.NL();
		Text.Add("The younger woman blushes prettily. <i>“W-well, actually, I went to an all-girls lyceum, so there wasn’t much fun most of the time.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Don’t tell me you let a little thing like that stop you!”</i> The older woman takes her companion’s hand in hers, and strokes her thumb over the back in slow circles. <i>“Why, in my opinion, you still had available to you the better half.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I-is that… you don’t…”</i>", parse);
		Text.NL();
		Text.Add("<i>“Come, I know a place nearby where I can explain things to you in more detail.”</i>", parse);
		Text.NL();
		Text.Add("They rise together, and you see them walk off into the crowd, holding hands. Well, they hold hands briefly, before their hands become otherwise occupied.", parse);
	}, middleArea, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("Two noblemen are walking in front of you.", parse);
		Text.NL();
		Text.Add("<i>“Look, Uly, it has always been the duty and the privilege of our class to lead the military!”</i> the younger of the two exclaims, gesturing with his hands for emphasis. Corded muscles bunch beneath his formal shirt. <i>“Saying you ‘don’t feel like it’ is spitting on our forefathers’ graves!”</i>", parse);
		Text.NL();
		Text.Add("His stout companion - Uly? - seems unperturbed. <i>“Don’t be a child, Ajax. I may not have served in the last war, but I saw it, and that’s as much service as I can bear, myself. Four of my friends died fighting, all of them braver men than you. If I have a duty to them, it is to keep living.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Ha! Is that why you’ve let yourself grow fat? It’s been years since you’ve practiced your weapons! What happened to the bow you were so famous for? Why, even the prince and princess have mastered fencing, and I am certain they are far better protected than you.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Hmph, fencing. More a game than a fighting style. Why doesn’t King Rewyn do something useful for them instead, such as appointing one of them heir. Even without the war, who knows when he could die, and then what would we do? There would be chaos.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Chaos?”</i> Ajax asks. <i>“Though I admit that their highnesses Rumi and Rani can be a touch peculiar, none would deny that they are united. I would not fancy their rule, but the succession is not a great concern as I am sure they would rule as one.”</i>", parse);
		Text.NL();
		Text.Add("<i>“And you are so sure their wishes would determine all…”</i>", parse);
		Text.NL();
		Text.Add("While you keep going straight, the two take a turn to the right, and soon pass out of earshot. You suspect that they plan to keep bickering for quite some time.", parse);
	}, nobleArea, function() { return true; });
	scenes.AddEnc(function() {
		parse["castle"] = rigard.CastleAccess() ? "the purple livery of a castle servant" : "purple livery of a fine quality";
		Text.Add("You notice a girl struggling with an already massive sack approach one of the merchants’ stalls. She wears [castle] - looks like her mistress sent her on quite the large errand.", parse);
		Text.NL();
		Text.Add("She leans in toward the man, and whispers something, too quiet for you to hear. Her cheeks turn a bright crimson, and she darts looks everywhere but at the merchant’s face.", parse);
		Text.NL();
		Text.Add("<i>“Ha! You want <b>what</b>, girl?”</i> the man asks, grinning wide. <i>“No one here carries bottles of that particular liquid!”</i>", parse);
		Text.NL();
		Text.Add("<i>“B-but sir, it is for the magician Jeanne. I fear what she might do to me if I do not bring it. I would not wish to spend my life as a toad.”</i>", parse);
		Text.NL();
		Text.Add("The merchant grins wide, his eyes sparkling. <i>“Well, tell you what then,”</i> he says, lowering his voice slightly, <i>“why don’t you hop under the counter here, and help yourself. I promise if you work at it, you’ll have a full vial in no time. I won’t even charge you,”</i> he adds with a laugh.", parse);
		Text.NL();
		Text.Add("The servant girl bites her lip, before finally glancing around, and slipping around to the merchant’s side of the counter and then underneath it. Your last glimpse of her face shows her licking her lips, an eager look in her eyes. It seems she doesn’t mind the direction her errand has taken after all.", parse);
		Text.NL();
		Text.Add("Unfortunately, the stand is solidly made, and the boards press closely together. You curse the quality carpentry. After hesitating a few seconds longer, you conclude that you’re not going to see much by standing around, and decide to move on.", parse);
	}, 1.0, function() { return party.location == RigardLoc.ShopStreet.street; });

	if(!scenes.Get()) {
		if(!enteringArea)
			TimeStep({minute: 10});

		Text.Flush();
		// Next button
		Gui.NextPrompt();
	}
}

RigardScenes.Lockdown = function() {
	let rigard = GAME().rigard;
	let party = GAME().party;
	let player = GAME().player;
	let miranda = GAME().miranda;

	var parse = {
		playername : player.name,
		merchantsCitizens : (party.location == RigardLoc.Gate) ? "merchants" : "citizens",
		assCunt : player.FirstVag() ? "cunt" : "ass"
	};
	
	parse = player.ParserTags(parse);
	rigard.Krawitz["Q"] = Rigard.KrawitzQ.HuntingTerry;

	var dom = miranda.SubDom() - player.SubDom();

	Text.Clear();
	Text.Add("As you approach the gates, you’re surprised to see them closed. There appears to be some commotion over a few [merchantsCitizens] wanting to leave. One of the guards nearby spots you and moves to talk to you, but a familiar dog-morph butts in and greets you first.", parse);
	Text.NL();
	Text.Add("<i>“Hello there, [playername]. Don’t suppose you know anything about a break in into the mansion of a Lord Krawitz, do you?”</i> Miranda questions you, tapping her chin.", parse);
	Text.NL();
	Text.Add("In times like these, it’s best to feign ignorance. You tell her you don’t know anything about any break in. What exactly happened?", parse);
	Text.NL();
	Text.Add("She frowns at your question. <i>“Some stupid thief broke in, stole a bunch of his possessions and left this,”</i> she presents a card. <i>“Personally, Krawitz had it coming. Pretty sure no one really cares if he’s been robbed blind. Not like the old fool didn’t do anything worse in his time, but the stupid thief just <b>had</b> to leave a calling card. Now the high-ups are all foaming and want the perp caught,”</i> she finishes with a sigh. <i>“And you wanna hear the cherry on top?”</i>", parse);
	Text.NL();
	Text.Add("You examine the card. Both sides have the logo of a fox throwing a raspberry, the edge reads ‘Masked Fox’.", parse);
	Text.NL();
	parse["nice"] = miranda.Attitude() >= MirandaFlags.Attitude.Neutral ? " some comforting," : "";
	Text.Add("<i>“That pompous bastard of a captain put <b>me</b> on the job - said to use my nose. That damn bastard takes me for what? A common dog!?”</i> she exclaims, infuriated. After a few moments,[nice] and a deep breath, Miranda seems to visibly calm down. She examines you and grins. ", parse);
	if(miranda.Attitude() >= MirandaFlags.Attitude.Neutral) {
		Text.Add("<i>“Say, how about you help me catch this perp? I'm sure nobody will mind it if we duck out to a few places to do some 'investigating', if you catch my drift.”</i>", parse);
		Text.NL();
		Text.Add("If this isn't a golden opportunity to throw off any suspicion on you, you don't know what it is. No better way to help cover your own tracks than to agree to help her chase down some other thief who robbed the same place. Actually, who in the world could have done that? Dismissing the matter as unimportant, you quickly convey to Miranda that you're willing to help her find the culprit.", parse);
	}
	else {
		Text.Add("<i>“You're going to help me catch this perp. Otherwise, I'm taking you in for questioning. Now, I don't expect you had anything to do with this, but the guard can be very thorough during questioning. And I could do with having some fun.”</i>", parse);
		Text.NL();
		Text.Add("Any surprise or curiosity you might have felt at her request for your help - after all, you're <b>not</b> her favorite person in the world and you know it - is swept aside by the knowledge that she means what she says.", parse);
		Text.NL();
		if(dom < 0) {
			Text.Add("You'd sooner swallow live spiders in butter than help her, but you <b>don't</b> need this sort of hassle. Certainly not when you actually <b>are</b> a criminal who raided the Krawitz manor, even if you're not the one they're actually looking for. Swallowing back your resentment, you tell Miranda that you understand what she's saying; you'll help.", parse);
		}
		else {
			Text.Add("Unconsciously, your eyes drift toward her legs, when you know her prodigious cock lies, and you lick your lips involuntarily. The... offer? Threat? in her statement is <b>so</b> very tempting... still, you mightn't be the precise criminal they're after, but you still are a criminal. You can't afford to be taken in, even by accident. You quickly assure Miranda that you'll help her.", parse);
		}
	}
	Text.NL();
	Text.Add("<i>“Knew I could count on you!</i> Miranda exclaims with a grin. <i>“Now, let’s get out of here and get started on our investigation.</i>”", parse);
	Text.NL();
	if(party.Num() > 1) {
		parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
		Text.Add("You tell [comp] to wait for you at the Lady’s Blessing. It looks like this is going to take some time.", parse);
		Text.NL();
	}

	party.SaveActiveParty();
	party.ClearActiveParty();
	party.SwitchIn(player);
	party.AddMember(miranda, true);

	if(miranda.Sexed()) {
		if(miranda.SubDom() > 25) {
			Text.Add("As you make your way past the gates, the dog-morph pulls you close by the shoulders to whisper into your [ears], <i>“Bet you can’t wait for us to have a duck down a dark corner.</i>", parse);
			Text.NL();
			if(player.SubDom() > 0)
				Text.Add("With your cockiest grin in place, you deliberately rub your [butt] back against her pelvis as best you can, quipping back that you're sure you can handle the wait better than she can. With a jaunty flick of your shoulders, you wriggle out of her grip and step out of her reach.", parse);
			else
				Text.Add("You visibly shudder in anticipation, eyes closing as you just picture the horny doberherm pinning you up against a wall and penetrating your [assCunt] with her long, throbbing mastiff-meat. Your reaction doesn't go unnoticed as Miranda grins and reaches down to squeeze your [butt] possessively before letting you go.", parse);
		}
		else {
			Text.Add("As you make your way from the gates, the dog-morph leans over to whisper into your [ears], <i>“Hey, you’re not thinking of taking advantage of me if we have to duck down a dark corner, are you?”</i>", parse);
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
	Text.Add("<i>“We should discuss a few details before we get started, so let’s go to the Maiden’s Bane and plan our moves,”</i> she says, leading you toward her favorite watering hole.", parse);
	Text.Flush();

	party.location = RigardLoc.Tavern.common;
	TimeStep({hour : 1});

	Gui.NextPrompt(function() {
		Text.Clear();
		parse["lady"] = player.Femininity() < -0.5 ? "stepping in" : "motioning for you to get inside";
		Text.Add("Miranda easily whisks you past the gate and makes a beeline for the Maiden’s Bane. The bar is crowded with all sorts of people complaining about the lockdown, but neither of you pay any attention to them. The guardswoman doesn’t bother looking for a table in this mess, instead she stops by the bar to grab a couple bottles and heads straight into the one of the available rooms in the back. <i>“Ladies first,”</i> she says, [lady].", parse);
		Text.NL();
		parse["rebutt"] = (player.Gender() == Gender.male && player.SubDom() > 25) ? "Letting that crack about 'ladies first' slip by, for now, y" : "Y";
		parse["lady"] = player.Femininity() < -0.5 ? "follow her" : "head";
		Text.Add("You should be surprised about the fact she took you to the backroom to plan... but you know Miranda better than that. [rebutt]ou [lady] inside and quickly make yourself comfortable on one of the seats within. Patiently, you wait for her to begin, wondering what the very literal watchdog has in mind for finding this mysterious thief.", parse);
		Text.NL();
		Text.Add("The sounds of the crowd outside doesn’t disappear entirely when Miranda slams the door, but it’s sufficiently muffled that you can at least talk to each other without shouting. The doggie takes a nearby chair and sets it under the door handle. <i>“For good measure,”</i> she says. <i>“Alright then, let’s get started. Do you actually know anything about the break in or should I lay it down from the very beginning?”</i> she asks, taking a seat across from you and popping the cork on her bottle.", parse);
		Text.NL();
		Text.Add("You quickly inform her that starting from the beginning would be best; the first you had heard of the break in was when she spoke to you just before.", parse);
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
			Text.Add("A pang of unease stabs into your heart; you knew it was almost inevitable that your own actions would be discovered, but so soon? Still... sounds like whoever this mystery thief is, they decided it'd be easier to just blame them for the things you did as well. Although you are relieved at the fact your own cover hasn't been blown, a part of you does still feel a little guilty about someone else taking the heat. Still, it’s in your best interest to not take the fall for your crimes. Good thing you’re helping investigate rather than being investigated yourself.", parse);
			Text.NL();
		}
		Text.Add("Clearing your throat, you declare that's quite an extensive list of crimes, but leaving a calling card? What kind of thief does that - surely, they must have known it would have given the nobles more reason to send the guards after them?", parse);
		Text.NL();
		Text.Add("Miranda takes a long swig of her drink. <i>“Beats me. Probably some sadistic asshole. Like I said, people don’t care much for Krawitz, even the nobles dislike the guy. But if a thief leaves a card mocking the Royal Guard and the City Watch, we just have to go after the prick and make an example out of them,”</i> she downs the rest of her bottle.", parse);
		Text.NL();
		Text.Add("You nod in understanding; that sort of logic certainly makes sense to you. This thief clearly has a problem with their ego if they went and stirred up the hornet's nest like this. You feel sorry for them, but they kind of brought this on themselves.", parse);
		Text.NL();
		Text.Add("<i>“Pretty sure we’ve questioned every relevant person. And we’ve had guards posted in front of all shops, so I don’t think we need to search inside. Wherever the culprit is hiding, they’re alone and haven’t received help from anyone in town, so that’s a load off our backs. Still, we gotta search the plaza, the market district, the backstreets and even the area around the gates. If you know anyone that might have an idea to cut the chase short, I’m all ears.”</i>", parse);
		Text.NL();
		Text.Add("Nothing that might help immediately springs to mind, and you admit as such to Miranda. Looks like you'll have to just get out there and start looking.", parse);
		Text.NL();

		var cocksInVag = player.CocksThatFit(miranda.FirstVag());

		if(miranda.flags["Herm"] == 0) {
			Text.Add("<i>“Before we get going, how about you help me with an itch I’m having?”</i> the guardswoman asks with a mischievous grin. It looks like the drinks are starting to take effect as the dobie’s eyes are slightly unfocused and her breathing is getting heavy.", parse);
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
			miranda.flags["Met"]  = MirandaFlags.Met.TavernAftermath;
			//[Hot]
			var options = new Array();
			options.push({ nameStr : "Neutral",
				func : function() {
					Text.Clear();
					Text.Add("Sorry, but you aren’t in to that. The herm shrugs her shoulders, apparently not unfamiliar with the reaction.", parse);
					Text.NL();
					Text.Add("<i>“I can get where you are coming from, I guess,”</i> she says as she reluctantly pulls her pants back up. <i>“Offer still stands, if you are feeling frisky later.”</i>", parse);
					Text.NL();
					Text.Add("You insist that you should probably get going. That thief isn’t going to catch himself. She chuckles, amused at your reaction. <i>“Well, let's get to it then!”</i> The two of you leave the tavern and return inside the city proper. From what you gather, you aren’t going to get out of here before the thief is caught.", parse);
					Text.Flush();

					miranda.flags["Attitude"] = MirandaFlags.Attitude.Neutral;
					Gui.PrintDefaultOptions();
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
					options.push({ nameStr : "Take charge",
						func : function() {
							Text.Clear();
							Text.Add("Smirking mischievously at her, you lift a hand to cup her chin and give her a big, wet kiss. Hungrily, you thrust your [tongue] into the warm wetness of her mouth to wrestle with her own.", parse);
							Text.NL();
							Text.Add("For several long, pleasant moments, the two of you tongue wrestle, softly moaning and mumbling your pleasure into each other's lips before you break away. Smirking down at the panting herm, a bead of pre forming at the tip of her erection, you mockingly ask her if she intends to stay dressed for this or is she going to take off the rest of her uniform? Not that you mind either way… that pretty rump of hers is good enough for the taking, after all.", parse);
							Text.NL();
							Text.Flush();

							Scenes.Miranda.TerryTavernSexSubbyVag(cocksInVag);
						}, enabled : cocksInVag.length > 0,
						tooltip : "She wants sex, but who says she has to get it on her terms? Why not take charge of scratching her itch?"
					});
					options.push({ nameStr : "Submit",
						func : function() {
							Text.Clear();
							parse["legs"] = player.HasLegs() ? " on your knees" : ""
							Text.Add("The dog-herm wastes no time in hopping on her feet, stripping off the rest of her armor as she approaches you to help you take off your [armor]. Though she fumbles with both your outfits, she has you naked in record time. Without so much as a word, she takes you by the arm and sets you down[legs] atop the cushions in the corner of the room.", parse);
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
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip : "This is hardly the time to be having fun, so tuck her doghood back in and get down to business."
					});
					Gui.SetButtonsFromList(options, false, null);
					miranda.flags["Attitude"] = MirandaFlags.Attitude.Nice;
				}, enabled : true,
				tooltip : "The way you see it, this just gives you more options. Why not indulge?"
			});
			options.push({ nameStr : "Disgusting",
				func : function() {
					Text.Clear();
					Text.Add("<i>“What? Come on! You’re not gonna pussy out on me just because I have a dick now, are you?”</i> she frowns, clearly not happy with you.", parse);
					Text.NL();
					Text.Add("When you fail to reply, she just rolls her eyes and pulls her pants back up. <i>“Typical… should’ve expected that.”</i> She walks past you, heading toward the door. <i>“You coming or you’re just going to stand there like an idiot?”</i>", parse);
					Text.NL();
					Text.Add("Jolted into action, you follow after her as she leads you out of the Maiden’s Bane and back inside Rigard’s gates.", parse);
					Text.Flush();
					miranda.flags["Attitude"] = MirandaFlags.Attitude.Hate;

					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Eww, you’re not about to touch <b>that!</b>"
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else {
			if(miranda.Attitude() >= MirandaFlags.Attitude.Neutral) {
				Text.Add("<i>“Before we get going, how about you help me with an itch I’m having?”</i> the herm dog asks with a mischievous grin.", parse);
				Text.NL();
				Text.Add("Oh, Miranda, she's just never going to change, is she? You fight back a smile as you consider the offer.", parse);
				Text.Flush();

				//[TakeCharge] [Submit] [Later]
				var options = new Array();
				options.push({ nameStr : "Take charge",
					func : function() {
						Text.Clear();
						Text.Add("Authoritatively, you push your chair back and stand up. Throwing her a proud smirk, you saunter around the tabletop toward her, your gaze never leaving hers as you close the distance. Cupping her chin in your hand, your lips descend to cover hers possessively, hungrily thrusting your [tongue] into the warm wetness of her mouth to wrestle with her own.", parse);
						Text.NL();
						Text.Add("For several long, pleasant moments, the two of you tongue wrestle, softly moaning and mumbling your pleasure into each other's lips before you break away. Smirking down at the panting herm, her erection visibly tenting her pants from this angle, you mockingly ask her how she intends to have you sex her whilst she insists on keeping that pretty rump of hers all covered up in her uniform.", parse);
						Text.Flush();

						Scenes.Miranda.TerryTavernSexSubbyVag(cocksInVag);
					}, enabled : cocksInVag.length > 0,
					tooltip : "Even if she wants sex, who says she has to get it on her terms? Why not take charge of scratching her itch?"
				});
				options.push({ nameStr : "Submit",
					func : function() {
						Text.Clear();
						parse["legs"] = player.HasLegs() ? " on your knees" : "";
						Text.Add("The dog-herm wastes no time in hopping on her feet, stripping off her armor as she approaches you to help you take off your [armor]. Though she fumbles with both your outfits she has you naked in record time. Without so much as a word, she takes you by the arm and sets you down[legs] atop the cushions in the corner of the room.", parse);
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

						Gui.PrintDefaultOptions();
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
						Text.Add("You cower in your seat, helpless to resist the authority of the herm before you. You couldn't resist her, even if she didn't have such a charge to label against you. Shyly, you stand up from your seat - unable to meet her eyes in your embarrassment - as you begin meekly stripping yourself down.", parse);

						miranda.relation.IncreaseStat(100, 5);
						player.subDom.DecreaseStat(-100, 2);
						miranda.subDom.IncreaseStat(100, 10);

						choice = Choice.Eager;

						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Give in, you have no choice but to follow her whims."
				});
				var reluctant = function() {
					Text.Add("Your blood boils in your veins at the outrage, fingers clenching, but you force yourself to swallow back the bile rising from the depths of your gut. The bitch has you over a barrel here, and you both know it. Slowly, reluctantly, you rise from your seat and start to remove your [armor].", parse);
					Gui.PrintDefaultOptions();
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
						parse["legs2"] = player.HasLegs() ? " on your knees - right here, right now - to" : " to"
						Text.Add("<i>“Perhaps I wasn’t clear,”</i> Miranda’s eyes narrow dangerously. <i>“Either you are getting down[legs2] suck my dick, or I’m hauling your ass straight to prison and performing a cavity search on you. Your choice.”</i>", parse);
						Text.NL();
						miranda.relation.DecreaseStat(-100, 10);

						reluctant();
					}, enabled : true,
					tooltip : "Just… no. This is hardly the time to even consider this. Plus you’re just not in the mood."
				});
				Gui.SetButtonsFromList(options, false, null);

				Gui.Callstack.push(function() {
					Text.NL();
					parse["legs3"] = player.HasLegs() ? " and obediently kneel there" : " obediently";
					parse["reluctantlyEagerly"] = choice == Choice.Eager ? "eagerly" : "reluctantly";
					Text.Add("Miranda's eyes never leave you, her lips curled into a smirk and her fingers brushing almost mockingly against the bulge in her trousers as she watches you finish undressing. As her gaze hungrily follows you, you [reluctantlyEagerly] head for the cushioned corner of the room[legs3], just waiting for her to claim you.", parse);
					Text.Flush();

					Scenes.Miranda.TerryTavernSexDommyBJ();
				});
			}
		}

		Gui.Callstack.push(function() {
			Gui.NextPrompt(function() {
				MoveToLocation(RigardLoc.Residential.street, {hour: 1});
			});
		});
	});
}

export { Rigard, RigardLoc, RigardScenes };
