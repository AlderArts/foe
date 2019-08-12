/*
 *
 * Town area that can be explored
 *
 */

import { InitBrothel } from './brothel';
import { InitLB } from './inn';
import { Shop } from '../../shop';
import { InitResidential } from './residential';
import { InitSlums } from './slums';
import { InitGuards } from './guards';
import { InitMerchants } from './merchants';
import { InitCastle } from './castle';
import { InitPlaza } from './plaza';
import { InitKrawitz } from './krawitz';
import { MagicShopScenes } from './magicshop';
import { ArmorShopScenes } from './armorshop';
import { InitMageTower } from './magetower';
import { Time } from '../../time';
import { Stat } from '../../stat';
import { WorldTime, GAME } from '../../GAME';
import { RigardFlags } from './rigard-flags';
import { ArmorItems } from '../../items/armor';
import { StrapOnItems } from '../../items/strapon';
import { WeaponsItems } from '../../items/weapons';
import { RigardScenes } from './rigard-scenes';
import { InitFera } from '../../event/fera';
import { LeiTaskScenes } from '../../event/royals/lei-tasks';
import { LeiScenes } from '../../event/royals/lei-scenes';

// Dealing with circular dependencies
export function InitRigard() {
	InitBrothel();
	InitMerchants(RigardScenes);
	InitSlums(RigardScenes);
	InitResidential(RigardScenes);
	InitGuards(RigardScenes);
	InitCastle(RigardScenes);
	InitPlaza(RigardScenes);
	InitFera(RigardScenes);
	LeiTaskScenes.INIT(LeiScenes);
	InitLB();
	InitMageTower();
	InitKrawitz();
	ArmorShopScenes.CreateShop();
	MagicShopScenes.CreateShop();
};

// Class to handle global flags and logic for town
export class Rigard {
	flags : any;
	ClothShop : Shop;
	ArmorShop : Shop;
	ArmorShopSpecial : Shop;
	SexShop : Shop;
	MagicShop : Shop;
	
	ParadeTimer : Time;
	Twopenny : any;
	LB : any;
	LBroomTimer : Time;
	RotOrvinInnTalk : number;

	Krawitz : any;
	KrawitzWorkDay : Time;

	Brothel : any;

	CW : any;
	cwrel : Stat;

	alianaRel : Stat;

	constructor(storage? : any) {
		this.flags = {};

		// TODO: Store
		this.ClothShop = new Shop();
		this.ClothShop.AddItem(ArmorItems.SimpleRobes, 5);
		this.ClothShop.AddItem(ArmorItems.StylizedClothes, 5);

		this.ArmorShop = ArmorShopScenes.Shop;
		this.ArmorShopSpecial = ArmorShopScenes.SpecialShop;

		this.SexShop = new Shop();
		this.SexShop.AddItem(StrapOnItems.PlainStrapon, 5);
		this.SexShop.AddItem(StrapOnItems.LargeStrapon, 5);
		this.SexShop.AddItem(StrapOnItems.CanidStrapon, 5);
		this.SexShop.AddItem(StrapOnItems.EquineStrapon, 5);
		this.SexShop.AddItem(StrapOnItems.ChimeraStrapon, 5);
		this.SexShop.AddItem(WeaponsItems.LWhip, 5);

		this.MagicShop = MagicShopScenes.Shop;

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
		this.Krawitz["Q"]    = RigardFlags.KrawitzQ.NotStarted; // Krawitz quest status
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

	ToStorage() {
		var storage : any = {};
	
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
	
	FromStorage(storage : any) {
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
	
	Update(step : number) {
		this.LBroomTimer.Dec(step);
		this.ParadeTimer.Dec(step);
	}
	
	Visa() {
		return this.flags["Visa"] != 0;
	}
	
	Visited() {
		return GAME().miranda.flags["Met"] != 0;
	}
	
	Access() {
		return this.Visa();
	}
	// TODO: add other ways
	RoyalAccess() {
		return this.flags["RoyalAccess"] != 0;
	}
	// TODO: use flags
	CastleAccess() {
		return false;
	}
	
	GatesOpen() {
		return WorldTime().hour >= 8 && WorldTime().hour < 17;
	}
	
	UnderLockdown() {
		return this.Krawitz["Q"] == RigardFlags.KrawitzQ.HuntingTerry;
	}
	
	MetBarnaby() {
		return this.flags["Barnaby"] & RigardFlags.Barnaby.Met;
	}
	BlownBarnaby() {
		return this.flags["Barnaby"] & RigardFlags.Barnaby.Blowjob;
	}
}
