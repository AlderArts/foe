
var gameCache = {}

InitCache = function() {
	// Reset exploration
	LastSubmenu = null;
	
	// SAVE VERSION
	gameCache.version = parseInt(gameCache.version) || SAVE_VERSION;
	
	// TIME
	gameCache.time = gameCache.time || 
	{
		year   : 890,
		season : Season.Summer,
		day    : 0,
		hour   : 8,
		minute : 0
	};
	
	rigard   = new Rigard(gameCache.rigard);
	burrows  = new Burrows(gameCache.burrows);
	treecity = new TreeCity(gameCache.treecity);
	
	// ENTITIES
	player  = new Player(gameCache.player);
	kiakai  = new Kiakai(gameCache.kiakai);
	miranda = new Miranda(gameCache.miranda);
	lei     = new Lei(gameCache.lei);
	twins   = new Twins(gameCache.twins);
	room69  = new Room69(gameCache.room69);
	
	chief   = new Chief(gameCache.chief);
	rosalin = new Rosalin(gameCache.rosalin);
	wolfie  = new Wolfie(gameCache.wolfie);
	magnus  = new Magnus(gameCache.magnus);
	
	lagon   = new Lagon(gameCache.lagon);
	
	gwendy  = new Gwendy(gameCache.gwendy);
	danie   = new Danie(gameCache.danie);
	adrian  = new Adrian(gameCache.adrian);
	
	maria   = new Maria(gameCache.maria);
	
	fera    = new Fera(gameCache.fera);
	
	// Don't load for now
	aria        = new Aria();
	uru         = new Uru();
	sylistraxia = new Sylistraxia();
	patchwork   = new Patchwork();
	estevan     = new Estevan();
	roa         = new Roa();
	
	// Put entities in world storage
	world.EntityStorage = new Array();
	world.EntityStorage.push(player);
	world.EntityStorage.push(kiakai);
	
	world.EntityStorage.push(aria);
	world.EntityStorage.push(uru);
	world.EntityStorage.push(sylistraxia);
	
	world.EntityStorage.push(gwendy);
	world.EntityStorage.push(danie);
	world.EntityStorage.push(adrian);
	
	world.EntityStorage.push(lagon);
	
	world.EntityStorage.push(chief);
	world.EntityStorage.push(patchwork);
	world.EntityStorage.push(rosalin);
	world.EntityStorage.push(estevan);
	world.EntityStorage.push(wolfie);
	world.EntityStorage.push(magnus);
	
	world.EntityStorage.push(roa);
	world.EntityStorage.push(miranda);
	
	world.EntityStorage.push(lei);
	world.EntityStorage.push(twins.rumi);
	world.EntityStorage.push(twins.rani);
	world.EntityStorage.push(room69);

	world.EntityStorage.push(maria);
	
	world.EntityStorage.push(fera);
	
	// Stuff that also has update methods
	world.EntityStorage.push(rigard);
	
	// PARTY
	party = new Party();
	party.FromStorage(gameCache.party);
	
	// FLAGS
	gameCache.flags = gameCache.flags || {};
	
	gameCache.flags["LearnedMagic"]            = gameCache.flags["LearnedMagic"] || 0;
	
	// Intro flags
	gameCache.flags["IntroLostToImps"]         = gameCache.flags["IntroLostToImps"] || 0;
	gameCache.flags["IntroToldUruAboutMirror"] = gameCache.flags["IntroToldUruAboutMirror"] || 0;
	gameCache.flags["IntroFuckedUru"]          = gameCache.flags["IntroFuckedUru"] || 0;
	gameCache.flags["IntroFuckedByUru"]        = gameCache.flags["IntroFuckedByUru"] || 0;
	gameCache.flags["IntroOutset"]             = gameCache.flags["IntroOutset"] || Intro.Outset.SaveWorld;

	// Controls access to town
	gameCache.flags["TalkedToTownGuard"]       = gameCache.flags["TalkedToTownGuard"] || 0;
	
	// Miranda (REMOVE)
	/*
	gameCache.flags["MirandaMet"]              = gameCache.flags["MirandaMet"] || 0;
	gameCache.flags["MirandaDumped"]           = gameCache.flags["MirandaDumped"] || 0;
	gameCache.flags["MirandaGenderKnown"]      = gameCache.flags["MirandaGenderKnown"] || 0;
	gameCache.flags["MirandaFledOnFirstDate"]  = gameCache.flags["MirandaFledOnFirstDate"] || 0;
	*/
	
	// GWENDY'S FARM
	gameCache.flags["FarmFound"]      = gameCache.flags["FarmFound"] || 0;
	gameCache.flags["FarmLockout"]    = gameCache.flags["FarmLockout"] || 0;
	
	// OUTLAWS
	gameCache.flags["OutlawsRep"]     = gameCache.flags["OutlawsRep"] || 0;
}

CacheToGame = function() {
	InitCache();
	
	// Load flags
	for(var flag in gameCache.flags)
		gameCache.flags[flag] = parseInt(gameCache.flags[flag]);

	world.time = new Time(parseInt(gameCache.time.year),
	                      parseInt(gameCache.time.season),
	                      parseInt(gameCache.time.day),
	                      parseInt(gameCache.time.hour),
	                      parseInt(gameCache.time.minute));
	                      
	if(gameCache.version < 1) {
		//party.location = world.SaveSpots[gameCache.player["loc"]];
	}
	if(gameCache.version < 4) {
		kiakai.body.SetRace(Race.elf);
	}
	if(gameCache.version < 6) {
		if     (gameCache.flags["KiakaiAttitude"] == 0) gameCache.flags["KiakaiAttitude"] = Kiakai.Attitude.Nice;
		else if(gameCache.flags["KiakaiAttitude"] == 1) gameCache.flags["KiakaiAttitude"] = Kiakai.Attitude.Naughty;
		else if(gameCache.flags["KiakaiAttitude"] == 2) gameCache.flags["KiakaiAttitude"] = Kiakai.Attitude.Neutral;
	}
	if(gameCache.version < 7) {
		chief.relation.base = gameCache.flags["NomadRep"] || 0;      gameCache.flags["NomadRep"] = null;
		chief.flags["Met"]  = gameCache.flags["NomadChiefMet"] || 0; gameCache.flags["NomadChiefMet"] = null;
		gwendy.flags["Met"] = gameCache.flags["GwendyMet"] || 0;     gameCache.flags["GwendyMet"] = null;
		adrian.flags["Met"] = gameCache.flags["AdrianMet"] || 0;     gameCache.flags["AdrianMet"] = null;
		danie.flags["Met"]  = gameCache.flags["DanieMet"] || 0;      gameCache.flags["DanieMet"] = null;
		
		// Kiakai
		kiakai.flags["InitialGender"]           = gameCache.flags["KiakaiInitialGender"] || Gender.male; gameCache.flags["KiakaiInitialGender"] = null;

		kiakai.flags["Attitude"]                = gameCache.flags["KiakaiAttitude"] || Kiakai.Attitude.Neutral; gameCache.flags["KiakaiAttitude"] = null;
		kiakai.flags["AnalExp"]                 = gameCache.flags["KiakaiAnalExp"] || 0; gameCache.flags["KiakaiAnalExp"] = null;
		kiakai.flags["Sexed"]                   = gameCache.flags["KiakaiSexed"] || 0; gameCache.flags["KiakaiSexed"] = null;
		// First time dialogue
		kiakai.flags["TalkedWhyLeave"]          = gameCache.flags["KiakaiTalkedWhyLeave"] || 0; gameCache.flags["KiakaiTalkedWhyLeave"] = null;
		kiakai.flags["TalkedWhyLeaveForce"]     = gameCache.flags["KiakaiTalkedWhyLeaveForce"] || 0; gameCache.flags["KiakaiTalkedWhyLeaveForce"] = null;
		kiakai.flags["TalkedWhyLeaveLong"]      = gameCache.flags["KiakaiTalkedWhyLeaveLong"] || 0; gameCache.flags["KiakaiTalkedWhyLeaveLong"] = null;
		kiakai.flags["TalkedWhyLeaveLongReact"] = gameCache.flags["KiakaiTalkedWhyLeaveLongReact"] || 0; gameCache.flags["KiakaiTalkedWhyLeaveLongReact"] = null;
		kiakai.flags["TalkedPriest"]            = gameCache.flags["KiakaiTalkedPriest"] || 0; gameCache.flags["KiakaiTalkedPriest"] = null;
		kiakai.flags["TalkedElves"]             = gameCache.flags["KiakaiTalkedElves"] || 0; gameCache.flags["KiakaiTalkedElves"] = null;
		kiakai.flags["TalkedAria"]              = gameCache.flags["KiakaiTalkedAria"] || 0; gameCache.flags["KiakaiTalkedAria"] = null;
		kiakai.flags["TalkedUru"]               = gameCache.flags["KiakaiTalkedUru"] || 0; gameCache.flags["KiakaiTalkedUru"] = null;
		kiakai.flags["TalkedUruDA"]             = gameCache.flags["KiakaiTalkedUruDA"] || 0; gameCache.flags["KiakaiTalkedUruDA"] = null;
		kiakai.flags["TalkedAlone"]             = gameCache.flags["KiakaiTalkedAlone"] || 0; gameCache.flags["KiakaiTalkedAlone"] = null;
	}
	if(gameCache.version < 8) {
		fera.FirstVag().virgin = true;
		fera.Butt().virgin = true;
	}
	if(gameCache.version < 9) {
		player.FirstBreastRow().size.base /= 2;
		kiakai.FirstBreastRow().size.base /= 2;
		rosalin.FirstBreastRow().size.base /= 2;
	}
	if(gameCache.version < 10) {
		TF.SetRaceOne(rosalin.Eyes(), Race.cat);
		rosalin.Eyes().color = Color.green;
	}
	if(gameCache.version < 11) {
		kiakai.weaponSlot   = Items.Weapons.WoodenStaff;
		kiakai.topArmorSlot = Items.Armor.SimpleRobes;
		
		Gui.Callstack.push(function() {
			Text.Clear();

			Text.AddOutput("What profession do you wish to start as?");
			Text.Newline();
			
			var options = new Array();
			options.push({ nameStr : "Fighter",
				func : function() {
					player.flags["startJob"] = JobEnum.Fighter;
					player.currentJob           = Jobs.Fighter;
					player.strength.growth     += 0.6;
					player.stamina.growth      += 0.3;
					player.dexterity.growth    += 0.3;
					player.intelligence.growth += 0.0;
					player.spirit.growth       += 0.1;
					player.libido.growth       += 0.0;
					player.charisma.growth     += 0.1;
					player.weaponSlot   = Items.Weapons.ShortSword;
					player.topArmorSlot = Items.Armor.LeatherChest;
					player.botArmorSlot = Items.Armor.LeatherPants;
					player.acc1Slot     = Items.Accessories.IronBangle;
					player.jobs["Fighter"].mult = 0.5;
					player.Equip();
			    	PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Focused on martial abilities and strength, strives to excel in physical combat."
			});
			options.push({ nameStr : "Scholar",
				func : function() {
					player.flags["startJob"] = JobEnum.Scholar;
					player.currentJob           = Jobs.Scholar;
					player.strength.growth     += 0.0;
					player.stamina.growth      += 0.1;
					player.dexterity.growth    += 0.2;
					player.intelligence.growth += 0.6;
					player.spirit.growth       += 0.3;
					player.libido.growth       += 0.1;
					player.charisma.growth     += 0.1;
					player.weaponSlot   = Items.Weapons.WoodenStaff;
					player.topArmorSlot = Items.Armor.SimpleRobes;
					player.acc1Slot     = Items.Accessories.CrudeBook;
					player.jobs["Scholar"].mult = 0.5;
					player.jobs["Fighter"].mult = 1;
					player.Equip();
			    	PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Takes a more intellectual approach to problems, and dabbles slightly in the mystical. Starts out with several support abilities."
			});
			options.push({ nameStr : "Courtesan",
				func : function() {
					player.flags["startJob"] = JobEnum.Courtesan;
					player.currentJob           = Jobs.Courtesan;
					player.strength.growth     += 0.0;
					player.stamina.growth      += 0.0;
					player.dexterity.growth    += 0.2;
					player.intelligence.growth += 0.2;
					player.spirit.growth       += 0.0;
					player.libido.growth       += 0.5;
					player.charisma.growth     += 0.5;
					player.weaponSlot   = Items.Weapons.LWhip;
					player.topArmorSlot = Items.Armor.StylizedClothes;
					player.acc1Slot     = Items.Accessories.SimpleCuffs;
					player.jobs["Courtesan"].mult = 0.5;
					player.jobs["Fighter"].mult   = 1;
					player.Equip();
			    	PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Focused on sensual abilities and charming your foes into submission."
			});
			Gui.SetButtonsFromList(options);
		});
	}
	if(gameCache.version < 12) {
		if(player.jobs["Figther"]) {
			player.jobs["Fighter"] = player.jobs["Figther"];
			player.jobs["Figther"] = null;
		}
	}
	if(gameCache.version < 13) {
	    if(rigard.flags["KrawitzQ"]) {
	        rigard.Krawitz["Q"]      = rigard.flags["KrawitzQ"];
	        rigard.flags["KrawitzQ"] = null;
	    }
	}
}

GameToCache = function() {
	gameCache.version = SAVE_VERSION;
	// For debugging
	gameCache.build   = VERSION_STRING;
	
	gameCache.time    = world.time;
	
	gameCache.rigard   = rigard.ToStorage();
	gameCache.burrows  = burrows.ToStorage();
	gameCache.treecity = treecity.ToStorage();
	
	// Party
	gameCache.player  = player.ToStorage();
	gameCache.kiakai  = kiakai.ToStorage();
	gameCache.miranda = miranda.ToStorage();
	gameCache.lei     = lei.ToStorage();
	gameCache.twins   = twins.ToStorage();
	gameCache.room69  = room69.ToStorage();
	
	gameCache.maria   = maria.ToStorage();
	
	// Other NPCs
	gameCache.chief   = chief.ToStorage();
	gameCache.rosalin = rosalin.ToStorage();
	gameCache.wolfie  = wolfie.ToStorage();
	gameCache.magnus  = magnus.ToStorage();
	
	gameCache.lagon   = lagon.ToStorage();
	
	gameCache.gwendy  = gwendy.ToStorage();
	gameCache.adrian  = adrian.ToStorage();
	gameCache.danie   = danie.ToStorage();
	
	gameCache.fera    = fera.ToStorage();
	
	// Current party
	gameCache.party   = party.ToStorage();
	
	
	var parse = {
		name   : gameCache.player.name,
		gender : Gender.Short(player.body.Gender()),
		lvl    : gameCache.player.lvl,
		slvl   : gameCache.player.slvl,
		date   : gameCache.time.DateString()
	};
	
	gameCache.name   = 
		Text.Parse("[name]([gender]), Lvl [lvl]/[slvl], [date]", parse);
}
