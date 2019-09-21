/*
 *
 * Town area that can be explored
 *
 */
import * as _ from "lodash";

import { AscheScenes } from "../../event/asche-scenes";
import { AscheTasksScenes } from "../../event/asche-tasks";
import { FeraScenes } from "../../event/fera";
import { AquiliusScenes } from "../../event/outlaws/aquilius";
import { JeanneScenes } from "../../event/royals/jeanne-scenes";
import { LeiScenes } from "../../event/royals/lei-scenes";
import { LeiTaskScenes } from "../../event/royals/lei-tasks";
import { TerryScenes } from "../../event/terry-scenes";
import { WorldTime } from "../../GAME";
import { IStorage } from "../../istorage";
import { ArmorItems } from "../../items/armor";
import { StrapOnItems } from "../../items/strapon";
import { WeaponsItems } from "../../items/weapons";
import { Shop } from "../../shop";
import { Stat } from "../../stat";
import { ITime, Time } from "../../time";
import { ArmorShopScenes } from "./armorshop";
import { InitBrothel } from "./brothel";
import { InitCastle } from "./castle";
import { ClothShopScenes } from "./clothstore";
import { InitGuards } from "./guards";
import { InitLB } from "./inn";
import { InitKrawitz } from "./krawitz";
import { InitMageTower } from "./magetower";
import { MagicShopScenes } from "./magicshop";
import { InitMerchants } from "./merchants";
import { InitPlaza } from "./plaza";
import { InitResidential } from "./residential";
import { RigardFlags } from "./rigard-flags";
import { RigardScenes } from "./rigard-scenes";
import { InitSlums } from "./slums";

// Dealing with circular dependencies
export function InitRigard() {
	InitBrothel();
	InitMerchants(RigardScenes);
	InitSlums(RigardScenes);
	InitResidential(RigardScenes);
	InitGuards(RigardScenes);
	InitCastle(RigardScenes);
	InitPlaza(RigardScenes);
	FeraScenes.INIT(ClothShopScenes);
	LeiTaskScenes.INIT(LeiScenes);
	JeanneScenes.INIT(TerryScenes);
	AscheTasksScenes.INIT(AscheScenes, AquiliusScenes);
	InitLB();
	InitMageTower();
	InitKrawitz();
	MagicShopScenes.INIT(AscheScenes);
	ArmorShopScenes.CreateShop();
	MagicShopScenes.CreateShop();
}

// Class to handle global flags and logic for town
export class Rigard {
	public flags: any;
	public ClothShop: Shop;
	public ArmorShop: Shop;
	public ArmorShopSpecial: Shop;
	public SexShop: Shop;
	public MagicShop: Shop;

	public ParadeTimer: Time;
	public Twopenny: any;
	public LB: any;
	public LBroomTimer: Time;
	public RotOrvinInnTalk: number;

	public Krawitz: any;
	public KrawitzWorkDay: Time;

	public Brothel: any;

	public CW: any;
	public cwrel: Stat;

	public alianaRel: Stat;

	constructor(storage?: IStorage) {
		this.flags = {};

		// TODO: Store
		this.ClothShop = new Shop();
		this.ClothShop.AddItem(ArmorItems.SimpleRobes, 5);
		this.ClothShop.AddItem(ArmorItems.StylizedClothes, 5);

		this.ArmorShop = ArmorShopScenes.AShop();
		this.ArmorShopSpecial = ArmorShopScenes.ASpecialShop();

		this.SexShop = new Shop();
		this.SexShop.AddItem(StrapOnItems.PlainStrapon, 5);
		this.SexShop.AddItem(StrapOnItems.LargeStrapon, 5);
		this.SexShop.AddItem(StrapOnItems.CanidStrapon, 5);
		this.SexShop.AddItem(StrapOnItems.EquineStrapon, 5);
		this.SexShop.AddItem(StrapOnItems.ChimeraStrapon, 5);
		this.SexShop.AddItem(WeaponsItems.LWhip, 5);

		this.MagicShop = MagicShopScenes.MShop();

		// Have accessed town (not necessarily free access)
		this.flags.Visa = 0;
		this.flags.CityHistory = 0;
		this.flags.Nobles = 0; // Bitmask
		this.ParadeTimer = new Time();
		// Have access to royal grounds (not necessarily free access)
		this.flags.RoyalAccess = 0;
		this.flags.RoyalAccessTalk = 0;

		this.flags.TalkedStatue = 0;

		this.flags.TailorMet   = 0;
		this.flags.BuyingExp   = 0;
		this.flags.Scepter     = 0;

		this.Twopenny = {};
		this.Twopenny.Met   = 0;
		this.Twopenny.TShop = 0;

		this.LB = {};
		this.LB.Visit    = 0;
		this.LB.Orvin    = 0;
		this.LB.OTerry   = 0;
		this.LB.Orvin69  = 0;
		this.LB.CityTalk = 0;
		this.LB.RotRumor = 0;
		this.LB.Efri     = 0;
		this.LB.RoomNr   = 0;
		this.LB.RoomComp = 0;
		this.LB.Tea      = 0;
		this.LB.Lizan    = 0;
		this.LB.Elven    = 0;
		this.LB.Fairy    = 0;
		this.LB.Red      = 0;
		this.LBroomTimer    = new Time();

		// Non-permanent
		this.RotOrvinInnTalk = 0;

		this.Krawitz = {};
		this.Krawitz.Q    = RigardFlags.KrawitzQ.NotStarted; // Krawitz quest status
		this.Krawitz.F    = 0; // Aftermath flags
		this.Krawitz.Work = 0; //
		this.KrawitzWorkDay  = undefined; // Time
		this.Krawitz.Duel = 0; // 0 = no, 1 = superwin, 2 = win, 3 = loss

		this.Brothel = {};
		this.Brothel.Visit  = 0;
		this.Brothel.MStrap = 0;

		this.CW = {};
		this.CW.Visit = 0;
		this.cwrel = new Stat(0);

		this.alianaRel = new Stat(0);

		this.flags.Barnaby = 0;

		if (storage) { this.FromStorage(storage); }
	}

	public ToStorage() {
		const storage: any = {};

		storage.flags   = this.flags;
		storage.twoP    = this.Twopenny;
		storage.Krawitz = this.Krawitz;
		storage.Brothel = this.Brothel;
		storage.CW      = this.CW;
		if (this.cwrel.base !== 0) {
			storage.cwrel = this.cwrel.base.toFixed();
		}
		storage.LB      = this.LB;
		storage.LBroom  = this.LBroomTimer.ToStorage();
		storage.PT      = this.ParadeTimer.ToStorage();
		if (this.KrawitzWorkDay) {
			storage.KWork   = this.KrawitzWorkDay.ToStorage();
		}

		storage.MS = this.MagicShop.ToStorage();

		if (this.alianaRel.base !== 0) {
			storage.alrel = this.alianaRel.base.toFixed();
		}

		return storage;
	}

	public FromStorage(storage: any) {
		storage = storage || {};
		this.LBroomTimer.FromStorage(storage.LBroom);
		this.ParadeTimer.FromStorage(storage.PT);
		if (storage.KWork) {
			this.KrawitzWorkDay = new Time();
			this.KrawitzWorkDay.FromStorage(storage.KWork);
		}
		// Load flags
		_.forIn(storage.flags, (value, key) => {
			this.flags[key] = parseInt(value as string, 10);
		});
		_.forIn(storage.twoP, (value, key) => {
			this.Twopenny[key] = parseInt(value as string, 10);
		});
		_.forIn(storage.Krawitz, (value, key) => {
			this.Krawitz[key] = parseInt(value as string, 10);
		});
		_.forIn(storage.Brothel, (value, key) => {
			this.Brothel[key] = parseInt(value as string, 10);
		});
		_.forIn(storage.CW, (value, key) => {
			this.CW[key] = parseInt(value as string, 10);
		});
		if (storage.cwrel) {
			this.cwrel.base = parseInt(storage.cwrel, 10) || this.cwrel.base;
		}
		_.forIn(storage.LB, (value, key) => {
			this.LB[key] = parseInt(value as string, 10);
		});

		this.MagicShop.FromStorage(storage.MS);

		if (storage.alrel) {
			this.alianaRel.base = parseInt(storage.alrel, 10) || this.alianaRel.base;
		}
	}

	public Update(step: ITime) {
		this.LBroomTimer.Dec(step);
		this.ParadeTimer.Dec(step);
	}

	public Visa() {
		return this.flags.Visa !== 0;
	}

	public Access() {
		return this.Visa();
	}
	// TODO: add other ways
	public RoyalAccess() {
		return this.flags.RoyalAccess !== 0;
	}
	// TODO: use flags
	public CastleAccess() {
		return false;
	}

	public GatesOpen() {
		return WorldTime().hour >= 8 && WorldTime().hour < 17;
	}

	public UnderLockdown() {
		return this.Krawitz.Q === RigardFlags.KrawitzQ.HuntingTerry;
	}

	public MetBarnaby() {
		return (this.flags.Barnaby & RigardFlags.Barnaby.Met) > 0;
	}
	public BlownBarnaby() {
		return (this.flags.Barnaby & RigardFlags.Barnaby.Blowjob) > 0;
	}
}
