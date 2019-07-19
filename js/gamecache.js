import { SetLastSubmenu } from "./exploration";

let gameCache = {};
let GAME = {};

let InitCache = function() {
	// Reset exploration
	SetLastSubmenu(null);
	Intro.active = false;

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

	// Reset everything
	GAME = {};

	GAME.rigard   = new Rigard(gameCache.rigard);
	GAME.farm     = new Farm(gameCache.farm);
	GAME.burrows  = new Burrows(gameCache.burrows);
	GAME.glade    = new DryadGlade(gameCache.glade);
	GAME.treecity = new TreeCity(gameCache.treecity);
	GAME.oasis    = new Oasis(gameCache.oasis);
	GAME.nursery  = new Nursery(gameCache.nursery);

	// ENTITIES
	GAME.player  = new Player(gameCache.player);
	GAME.kiakai  = new Kiakai(gameCache.kiakai);
	GAME.miranda = new Miranda(gameCache.miranda);
	GAME.terry   = new Terry(gameCache.terry);
	GAME.zina    = new Zina(gameCache.zina);
	GAME.momo    = new Momo(gameCache.momo);
	GAME.lei     = new Lei(gameCache.lei);
	GAME.twins   = new Twins(gameCache.twins);
	GAME.room69  = new Room69(gameCache.room69);

	GAME.chief   = new Chief(gameCache.chief);
	GAME.rosalin = new Rosalin(gameCache.rosalin);
	GAME.cale    = new Cale(gameCache.wolfie);
	GAME.estevan = new Estevan(gameCache.estevan);
	GAME.magnus  = new Magnus(gameCache.magnus);
	GAME.patchwork = new Patchwork(gameCache.patches);

	GAME.lagon   = new Lagon(gameCache.lagon);
	GAME.ophelia = new Ophelia(gameCache.ophelia);
	GAME.vena    = new Vena(gameCache.vena);
	GAME.roa     = new Roa(gameCache.roa);

	GAME.gwendy  = new Gwendy(gameCache.gwendy);
	GAME.danie   = new Danie(gameCache.danie);
	GAME.adrian  = new Adrian(gameCache.adrian);
	GAME.layla   = new Layla(gameCache.layla);

	GAME.isla    = new Isla(gameCache.isla);

	GAME.outlaws  = new Outlaws(gameCache.outlaws);
	GAME.aquilius = new Aquilius(gameCache.aquilius);
	GAME.maria    = new Maria(gameCache.maria);
	GAME.cveta    = new Cveta(gameCache.cveta);
	GAME.vaughn   = new Vaughn(gameCache.vaughn);

	GAME.fera    = new Fera(gameCache.fera);
	GAME.asche   = new Asche(gameCache.asche);
	GAME.cassidy = new Cassidy(gameCache.cass);

	GAME.jeanne  = new Jeanne(gameCache.jeanne);
	GAME.golem   = new GolemBoss(gameCache.golem);

	GAME.orchid  = new OrchidBoss(gameCache.orchid);

	GAME.ravenmother = new RavenMother(gameCache.raven);
	GAME.uru         = new Uru(gameCache.uru);

	GAME.lucille     = new Lucille(gameCache.lucille);
	GAME.belinda     = new Belinda(gameCache.belinda);
	// Themerooms
	GAME.bastet      = new Bastet(gameCache.bastet);
	GAME.gryphons    = new Gryphons(gameCache.gryphons);
	GAME.fireblossom = new Fireblossom(gameCache.fb);

	// Don't load for now
	GAME.aria        = new Aria();
	GAME.sylistraxia = new Sylistraxia();
	GAME.ches        = new Ches(); //TODO

	world.EntityStorage = new Array();

	// Stuff that also has update methods
	world.EntityStorage.push(rigard);
	world.EntityStorage.push(farm);
	world.EntityStorage.push(glade);
	world.EntityStorage.push(oasis);
	world.EntityStorage.push(outlaws);
	world.EntityStorage.push(nursery);

	// Put entities in world storage
	world.EntityStorage.push(player);
	world.EntityStorage.push(kiakai);
	world.EntityStorage.push(miranda);
	world.EntityStorage.push(terry);
	world.EntityStorage.push(zina);
	world.EntityStorage.push(momo);
	world.EntityStorage.push(lei);
	world.EntityStorage.push(twins);
	world.EntityStorage.push(twins.rumi);
	world.EntityStorage.push(twins.rani);
	world.EntityStorage.push(room69);

	world.EntityStorage.push(chief);
	world.EntityStorage.push(rosalin);
	world.EntityStorage.push(cale);
	world.EntityStorage.push(estevan);
	world.EntityStorage.push(magnus);
	world.EntityStorage.push(patchwork);

	world.EntityStorage.push(lagon);
	world.EntityStorage.push(ophelia);
	world.EntityStorage.push(vena);
	world.EntityStorage.push(roa);

	world.EntityStorage.push(gwendy);
	world.EntityStorage.push(danie);
	world.EntityStorage.push(adrian);
	world.EntityStorage.push(layla);

	world.EntityStorage.push(isla);

	world.EntityStorage.push(aquilius);
	world.EntityStorage.push(maria);
	world.EntityStorage.push(cveta);
	world.EntityStorage.push(vaughn);

	world.EntityStorage.push(fera);
	world.EntityStorage.push(asche);
	world.EntityStorage.push(cassidy);

	world.EntityStorage.push(jeanne);
	world.EntityStorage.push(golem);

	world.EntityStorage.push(orchid);

	world.EntityStorage.push(ravenmother);

	world.EntityStorage.push(aria);
	world.EntityStorage.push(uru);
	world.EntityStorage.push(sylistraxia);

	world.EntityStorage.push(ches);
	world.EntityStorage.push(lucille);
	world.EntityStorage.push(belinda);
	world.EntityStorage.push(bastet);
	world.EntityStorage.push(gryphons);
	world.EntityStorage.push(Fireblossom);

	// PARTY
	GAME.party = new Party();
	GAME.party.FromStorage(gameCache.party);

	// FLAGS
	gameCache.flags = gameCache.flags || {};

	gameCache.flags["LearnedMagic"]            = gameCache.flags["LearnedMagic"] || 0;
	gameCache.flags["Portals"]                 = gameCache.flags["Portals"] || 0;

	// Intro flags
	gameCache.flags["IntroOutset"]             = gameCache.flags["IntroOutset"] || Intro.Outset.SaveWorld;

	gameCache.flags["NagaVenom"]      = gameCache.flags["NagaVenom"] || 0;
	gameCache.flags["NagaMate"]       = gameCache.flags["NagaMate"] || 0;

	gameCache.flags["Moth"]      = gameCache.flags["Moth"] || 0;

	//Halloween event
	gameCache.flags["HW"] = gameCache.flags["HW"] || 0;

	if(GAME.burrows.flags["Access"] >= Burrows.AccessFlags.Stage5) GAME.rigard.flags["Scepter"] = 0;
}

let CacheToGame = function() {
	InitCache();

	// Load flags
	for(var flag in gameCache.flags)
		gameCache.flags[flag] = parseInt(gameCache.flags[flag]);

	world.time = new Time(parseInt(gameCache.time.year),
	                      parseInt(gameCache.time.season),
	                      parseInt(gameCache.time.day),
	                      parseInt(gameCache.time.hour),
	                      parseInt(gameCache.time.minute));

	// Adjust for old save formats
	if(gameCache.version < 4) {
		GAME.kiakai.body.SetRace(Race.Elf);
	}
	if(gameCache.version < 6) {
		if     (gameCache.flags["KiakaiAttitude"] == 0) gameCache.flags["KiakaiAttitude"] = Kiakai.Attitude.Nice;
		else if(gameCache.flags["KiakaiAttitude"] == 1) gameCache.flags["KiakaiAttitude"] = Kiakai.Attitude.Naughty;
		else if(gameCache.flags["KiakaiAttitude"] == 2) gameCache.flags["KiakaiAttitude"] = Kiakai.Attitude.Neutral;
	}
	if(gameCache.version < 7) {
		GAME.chief.relation.base = gameCache.flags["NomadRep"] || 0;      gameCache.flags["NomadRep"] = null;
		GAME.chief.flags["Met"]  = gameCache.flags["NomadChiefMet"] || 0; gameCache.flags["NomadChiefMet"] = null;
		GAME.gwendy.flags["Met"] = gameCache.flags["GwendyMet"] || 0;     gameCache.flags["GwendyMet"] = null;
		GAME.adrian.flags["Met"] = gameCache.flags["AdrianMet"] || 0;     gameCache.flags["AdrianMet"] = null;
		GAME.danie.flags["Met"]  = gameCache.flags["DanieMet"] || 0;      gameCache.flags["DanieMet"] = null;

		// Kiakai
		GAME.kiakai.flags["InitialGender"]           = gameCache.flags["KiakaiInitialGender"] || Gender.male; gameCache.flags["KiakaiInitialGender"] = null;

		GAME.kiakai.flags["Attitude"]                = gameCache.flags["KiakaiAttitude"] || Kiakai.Attitude.Neutral; gameCache.flags["KiakaiAttitude"] = null;
		GAME.kiakai.flags["AnalExp"]                 = gameCache.flags["KiakaiAnalExp"] || 0; gameCache.flags["KiakaiAnalExp"] = null;
		GAME.kiakai.flags["Sexed"]                   = gameCache.flags["KiakaiSexed"] || 0; gameCache.flags["KiakaiSexed"] = null;
		// First time dialogue
		GAME.kiakai.flags["TalkedWhyLeave"]          = gameCache.flags["KiakaiTalkedWhyLeave"] || 0; gameCache.flags["KiakaiTalkedWhyLeave"] = null;
		GAME.kiakai.flags["TalkedWhyLeaveForce"]     = gameCache.flags["KiakaiTalkedWhyLeaveForce"] || 0; gameCache.flags["KiakaiTalkedWhyLeaveForce"] = null;
		GAME.kiakai.flags["TalkedWhyLeaveLong"]      = gameCache.flags["KiakaiTalkedWhyLeaveLong"] || 0; gameCache.flags["KiakaiTalkedWhyLeaveLong"] = null;
		GAME.kiakai.flags["TalkedWhyLeaveLongReact"] = gameCache.flags["KiakaiTalkedWhyLeaveLongReact"] || 0; gameCache.flags["KiakaiTalkedWhyLeaveLongReact"] = null;
		GAME.kiakai.flags["TalkedPriest"]            = gameCache.flags["KiakaiTalkedPriest"] || 0; gameCache.flags["KiakaiTalkedPriest"] = null;
		GAME.kiakai.flags["TalkedElves"]             = gameCache.flags["KiakaiTalkedElves"] || 0; gameCache.flags["KiakaiTalkedElves"] = null;
		GAME.kiakai.flags["TalkedAria"]              = gameCache.flags["KiakaiTalkedAria"] || 0; gameCache.flags["KiakaiTalkedAria"] = null;
		GAME.kiakai.flags["TalkedUru"]               = gameCache.flags["KiakaiTalkedUru"] || 0; gameCache.flags["KiakaiTalkedUru"] = null;
		GAME.kiakai.flags["TalkedUruDA"]             = gameCache.flags["KiakaiTalkedUruDA"] || 0; gameCache.flags["KiakaiTalkedUruDA"] = null;
		GAME.kiakai.flags["TalkedAlone"]             = gameCache.flags["KiakaiTalkedAlone"] || 0; gameCache.flags["KiakaiTalkedAlone"] = null;
	}
	if(gameCache.version < 8) {
		GAME.fera.FirstVag().virgin = true;
		GAME.fera.Butt().virgin = true;
	}
	if(gameCache.version < 9) {
		GAME.player.FirstBreastRow().size.base /= 2;
		GAME.kiakai.FirstBreastRow().size.base /= 2;
		GAME.rosalin.FirstBreastRow().size.base /= 2;
	}
	if(gameCache.version < 10) {
		TF.SetRaceOne(GAME.rosalin.Eyes(), Race.Feline);
		GAME.rosalin.Eyes().color = Color.green;
	}
	if(gameCache.version < 11) {
		GAME.kiakai.weaponSlot   = Items.Weapons.WoodenStaff;
		GAME.kiakai.topArmorSlot = Items.Armor.SimpleRobes;

		Gui.Callstack.push(function() {
			Text.Clear();
			Text.Add("What profession do you wish to start as?");
			Text.Flush();

			var options = new Array();
			options.push({ nameStr : "Fighter",
				func : function() {
					GAME.player.flags["startJob"] = JobEnum.Fighter;
					GAME.player.currentJob           = Jobs.Fighter;
					GAME.player.strength.growth     += 0.6;
					GAME.player.stamina.growth      += 0.3;
					GAME.player.dexterity.growth    += 0.3;
					GAME.player.intelligence.growth += 0.0;
					GAME.player.spirit.growth       += 0.1;
					GAME.player.libido.growth       += 0.0;
					GAME.player.charisma.growth     += 0.1;
					GAME.player.weaponSlot   = Items.Weapons.ShortSword;
					GAME.player.topArmorSlot = Items.Armor.LeatherChest;
					GAME.player.botArmorSlot = Items.Armor.LeatherPants;
					GAME.player.acc1Slot     = Items.Accessories.IronBangle;
					GAME.player.jobs["Fighter"].mult = 0.5;
					GAME.player.Equip();
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Focused on martial abilities and strength, strives to excel in physical combat."
			});
			options.push({ nameStr : "Scholar",
				func : function() {
					GAME.player.flags["startJob"] = JobEnum.Scholar;
					GAME.player.currentJob           = Jobs.Scholar;
					GAME.player.strength.growth     += 0.0;
					GAME.player.stamina.growth      += 0.1;
					GAME.player.dexterity.growth    += 0.2;
					GAME.player.intelligence.growth += 0.6;
					GAME.player.spirit.growth       += 0.3;
					GAME.player.libido.growth       += 0.1;
					GAME.player.charisma.growth     += 0.1;
					GAME.player.weaponSlot   = Items.Weapons.WoodenStaff;
					GAME.player.topArmorSlot = Items.Armor.SimpleRobes;
					GAME.player.acc1Slot     = Items.Accessories.CrudeBook;
					GAME.player.jobs["Scholar"].mult = 0.5;
					GAME.player.jobs["Fighter"].mult = 1;
					GAME.player.Equip();
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Takes a more intellectual approach to problems, and dabbles slightly in the mystical. Starts out with several support abilities."
			});
			options.push({ nameStr : "Courtesan",
				func : function() {
					GAME.player.flags["startJob"] = JobEnum.Courtesan;
					GAME.player.currentJob           = Jobs.Courtesan;
					GAME.player.strength.growth     += 0.0;
					GAME.player.stamina.growth      += 0.0;
					GAME.player.dexterity.growth    += 0.2;
					GAME.player.intelligence.growth += 0.2;
					GAME.player.spirit.growth       += 0.0;
					GAME.player.libido.growth       += 0.5;
					GAME.player.charisma.growth     += 0.5;
					GAME.player.weaponSlot   = Items.Weapons.LWhip;
					GAME.player.topArmorSlot = Items.Armor.StylizedClothes;
					GAME.player.acc1Slot     = Items.Accessories.SimpleCuffs;
					GAME.player.jobs["Courtesan"].mult = 0.5;
					GAME.player.jobs["Fighter"].mult   = 1;
					GAME.player.Equip();
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Focused on sensual abilities and charming your foes into submission."
			});
			Gui.SetButtonsFromList(options);
		});
	}
	if(gameCache.version < 12) {
		if(GAME.player.jobs["Figther"]) {
			GAME.player.jobs["Fighter"] = GAME.player.jobs["Figther"];
			GAME.player.jobs["Figther"] = null;
		}
	}
	if(gameCache.version < 13) {
		if(GAME.rigard.flags["KrawitzQ"]) {
			GAME.rigard.Krawitz["Q"]      = GAME.rigard.flags["KrawitzQ"];
			GAME.rigard.flags["KrawitzQ"] = null;
		}
	}
	if(gameCache.version < 14) {
		GAME.miranda.flags["Herm"] = (GAME.miranda.flags["Met"] >= Miranda.Met.TavernAftermath) ? 1 : 0;
	}
	if(gameCache.version < 15) {
		if(GAME.rigard.Krawitz["Q"] >= Rigard.KrawitzQ.HeistDone)
			GAME.twins.flags["Met"] = Twins.Met.Access;
	}
	if(gameCache.version < 16) {
		if(GAME.golem.flags["Met"] > Scenes.Golem.State.Lost)
			GAME.jeanne.flags["Met"] = 1;
	}
	if(gameCache.version < 17) {
		GAME.terry.flags["PrefGender"] = Gender.male;
	}
	if(gameCache.version < 19) {
		GAME.player.SetExpToLevel();
		GAME.kiakai.SetExpToLevel();
		GAME.terry.SetExpToLevel();
		GAME.miranda.SetExpToLevel();
	}
	if(gameCache.version < 20) {
		if(GAME.golem.flags["Met"] >= Scenes.Golem.State.Won_noLoss) {
			GAME.party.Inv().AddItem(Items.Weapons.MageStaff);
			GAME.party.Inv().AddItem(Items.Armor.MageRobes);
		}
		if(GAME.glade.flags["Visit"] >= DryadGlade.Visit.DefeatedOrchid) {
			GAME.party.Inv().AddItem(Items.Weapons.VineWhip);
			GAME.party.Inv().AddItem(Items.Armor.VineBra);
			GAME.party.Inv().AddItem(Items.Armor.VinePanties);
			GAME.party.Inv().AddItem(Items.Estros);
		}
	}
	if(gameCache.version < 21) {
		if(GAME.player.body.vagina[0])
			GAME.player.body.vagina[0].capacity.base = 5;
		GAME.player.body.ass.capacity.base = 4;
		if(GAME.kiakai.body.vagina[0])
			GAME.kiakai.body.vagina[0].capacity.base = 5;
		GAME.kiakai.body.ass.capacity.base = 4;
		if(GAME.rosalin.body.vagina[0])
			GAME.rosalin.body.vagina[0].capacity.base = 5;
		GAME.rosalin.body.ass.capacity.base = 4;
	}
	if(gameCache.version < 22) {
		var vag = GAME.terry.flags["vag"];
		if(vag != Terry.Pussy.None) {
			GAME.terry.body.vagina = [];
			GAME.terry.body.vagina.push(new Vagina());
			if(vag == Terry.Pussy.Used)
				GAME.terry.FirstVag().virgin = false;
		}
	}
	if(gameCache.version < 23) {
		// OUTLAWS
		GAME.outlaws.relation.base = gameCache.flags["OutlawsRep"] || 0;
		gameCache.flags["OutlawsRep"] = null;
	}
	if(gameCache.version < 24) {
		// GWENDY'S FARM
		GAME.farm.flags["Visit"] = gameCache.flags["FarmFound"] || 0;
		gameCache.flags["FarmFound"] = null;
	}
	if(gameCache.version < 25) {
		// LAYLA LEVEL PACING
		GAME.layla.SetExpToLevel();
	}
	if(gameCache.version < 26) {
		// URU INTRO FLAGS
		GAME.uru.flags["Intro"] |= gameCache.flags["IntroLostToImps"] ? Uru.IntroFlags.LostToImps : 0;
		GAME.uru.flags["Intro"] |= gameCache.flags["IntroToldUruAboutMirror"] ? Uru.IntroFlags.ToldUruAboutMirror : 0;
		GAME.uru.flags["Intro"] |= gameCache.flags["IntroFuckedUru"] ? Uru.IntroFlags.FuckedUru : 0;
		GAME.uru.flags["Intro"] |= gameCache.flags["IntroFuckedByUru"] ? Uru.IntroFlags.FuckedByUru : 0;
	}
	if(gameCache.version < 27) {
		// OUTLAWS
		if(GAME.outlaws.Rep() > 0) GAME.outlaws.flags["Met"] = Outlaws.Met.Met;
	}
	if(gameCache.version < 28) {
		// LEI TASKS
		if(GAME.lei.flags["Met"] > Lei.Met.KnowName) GAME.lei.flags["Met"] = Lei.Met.KnowName;
	}
	if(gameCache.version < 29) {
		// LAGON DEFEATED FLAGS (clear unused)
		GAME.lagon.flags["Usurp"] &= 0x7;
	}
}

let GameToCache = function() {
	gameCache.version  = SAVE_VERSION;
	// For debugging
	gameCache.build    = VERSION_STRING;

	gameCache.time     = world.time;

	gameCache.rigard   = GAME.rigard.ToStorage();
	gameCache.farm     = GAME.farm.ToStorage();
	gameCache.burrows  = GAME.burrows.ToStorage();
	gameCache.glade    = GAME.glade.ToStorage();
	gameCache.treecity = GAME.treecity.ToStorage();
	gameCache.oasis    = GAME.oasis.ToStorage();
	gameCache.nursery  = GAME.nursery.ToStorage();

	// Party
	gameCache.player  = GAME.player.ToStorage();
	gameCache.kiakai  = GAME.kiakai.ToStorage();
	gameCache.miranda = GAME.miranda.ToStorage();
	gameCache.terry   = GAME.terry.ToStorage();
	gameCache.zina    = GAME.zina.ToStorage();
	gameCache.momo    = GAME.momo.ToStorage();
	gameCache.lei     = GAME.lei.ToStorage();
	gameCache.twins   = GAME.twins.ToStorage();
	gameCache.room69  = GAME.room69.ToStorage();

	gameCache.outlaws  = GAME.outlaws.ToStorage();
	gameCache.aquilius = GAME.aquilius.ToStorage();
	gameCache.maria    = GAME.maria.ToStorage();
	gameCache.cveta    = GAME.cveta.ToStorage();
	gameCache.vaughn   = GAME.vaughn.ToStorage();

	// Other NPCs
	gameCache.chief    = GAME.chief.ToStorage();
	gameCache.rosalin  = GAME.rosalin.ToStorage();
	gameCache.wolfie   = GAME.cale.ToStorage();
	gameCache.estevan  = GAME.estevan.ToStorage();
	gameCache.magnus   = GAME.magnus.ToStorage();
	gameCache.patches  = GAME.patchwork.ToStorage();

	gameCache.lagon    = GAME.lagon.ToStorage();
	gameCache.ophelia  = GAME.ophelia.ToStorage();
	gameCache.vena     = GAME.vena.ToStorage();
	gameCache.roa      = GAME.roa.ToStorage();

	gameCache.gwendy   = GAME.gwendy.ToStorage();
	gameCache.adrian   = GAME.adrian.ToStorage();
	gameCache.danie    = GAME.danie.ToStorage();
	gameCache.layla    = GAME.layla.ToStorage();

	gameCache.isla     = GAME.isla.ToStorage();

	gameCache.fera     = GAME.fera.ToStorage();
	gameCache.asche    = GAME.asche.ToStorage();
	gameCache.cass     = GAME.cassidy.ToStorage();

	gameCache.jeanne   = GAME.jeanne.ToStorage();
	gameCache.golem    = GAME.golem.ToStorage();

	gameCache.orchid   = GAME.orchid.ToStorage();

	gameCache.raven    = GAME.ravenmother.ToStorage();
	gameCache.uru      = GAME.uru.ToStorage();

	gameCache.lucille  = GAME.lucille.ToStorage();
	gameCache.belinda  = GAME.belinda.ToStorage();
	gameCache.bastet   = GAME.bastet.ToStorage();
	gameCache.gryphons = GAME.gryphons.ToStorage();
	gameCache.fb       = GAME.fireblossom.ToStorage();
	/*
	gameCache.aria        = GAME.aria.ToStorage();
	gameCache.sylistraxia = GAME.sylistraxia.ToStorage();
	gameCache.ches    = GAME.ches.ToStorage();
	*/

	// Current party
	gameCache.party   = GAME.party.ToStorage();


	var parse = {
		name   : gameCache.player.name,
		gender : Gender.Short(GAME.player.body.Gender()),
		lvl    : gameCache.player.lvl,
		slvl   : gameCache.player.slvl,
		date   : gameCache.time.DateString()
	};

	gameCache.name = Text.Parse("[name]([gender]), Lvl [lvl]/[slvl], [date]", parse);
}

function ClearCache() {
	gameCache = {};
}

export { GAME, gameCache, InitCache, CacheToGame, GameToCache, ClearCache };
