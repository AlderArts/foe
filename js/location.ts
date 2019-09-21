import { EncounterTable } from "./encountertable";
import { Link } from "./link";

export interface ILocationEnc {
	nameStr?: string|(() => string);
	desc?: string|(() => void);
	func?: (obj: any) => any;
	cond?: boolean|(() => boolean);
	visible?: boolean|(() => boolean);
	enabled?: boolean|(() => boolean);
	odds?: number|(() => number);
	obj?: any;
	enc?: boolean;
	hunt?: boolean;
}

export interface ILocation {
    SaveSpot: string;
    wait: () => boolean;
    safe: () => boolean;
    switchSpot: () => boolean;
    SleepFunc: () => void;
    WaitFunc: () => void;
    DrunkHandler: () => void;
    PrintDesc: () => void;
    description: () => void;
    endDescription: () => void;
    onEntry: (preventClear?: boolean, from?: ILocation) => void;
    events: Link[];
    links: Link[];
    hunt: Link[];
    enc: EncounterTable;
    SetButtons: (links?: Link[]) => void;
    AddEncounter: (enc: ILocationEnc) => void;
}

export enum Locations {
	Plains    = 0,
	Forest    = 1,
	Desert    = 2,
	Highlands = 3,
	Lake      = 4,
}

export interface IWorld {
    loc?: ILocations;
    SaveSpots: {[index: string]: ILocation};
    CurrentLocation?: (loc?: ILocation) => any;
}

export interface ILocations {
    Plains: ILocPlains;
    Farm: ILocFarm;
    Burrows: ILocBurrows;
    Forest: ILocForest;
    Desert: ILocDesert;
    KingsRoad: ILocKingsroad;
    Highlands: ILocHighlands;
    Lake: ILocLake;
    Outlaws: ILocOutlaws;
    BullTower: ILocBullTower;
    Rigard: ILocRigard;

    DragonDen: ILocDragonDen;
    TreeCity: ILocation;

    DarkAspect: ILocDarkAspect;
    LightAspect: ILocLightAspect;
}

export interface ILocPlains {
	Nomads: ILocNomads;
	Crossroads: ILocation;
	Portals: ILocation;
	Gate: ILocation;
}

export interface ILocFarm {
	Fields: ILocation;
	Barn: ILocation;
	Loft: ILocation;
}

export interface ILocNomads {
	Tent: ILocation;
	Fireplace: ILocation;
	Nursery: ILocation;
}

export interface ILocBurrows {
	Entrance: ILocation;
	Tunnels: ILocation;
	Pit: ILocation;
	Lab: ILocation;
	Throne: ILocation;
	LagonCell: ILocation;
}

export interface ILocOutlaws {
	Camp: ILocation;
	Infirmary: ILocation;
}

export interface ILocForest {
	Outskirts: ILocation;
	Glade: ILocation;
}

export interface ILocBullTower {
	Courtyard: ILocBullTowerCourtyard;
	Building: ILocBullTowerBuilding;
}

interface ILocBullTowerCourtyard {
	Yard: ILocation;
	Pens: ILocation;
	Caravans: ILocation;
}

interface ILocBullTowerBuilding {
	Hall: ILocation;
	Cell: ILocation;
	Office: ILocation;
	Warehouse: ILocation;
	Watchtower: ILocation;
}

export interface ILocHighlands {
	Hills: ILocation;
	Spring: ILocation;
}

export interface ILocKingsroad {
	Road: ILocation;
}

export interface ILocDesert {
	Drylands: ILocation;
}

export interface ILocLake {
	Shore: ILocation;
}

export interface ILocDragonDen {
	Entry: ILocation;
}

export interface ILocDarkAspect {
	Barrens: ILocation;
	Mountains: ILocation;
	Cliff: ILocation;
	Peak: ILocation;
}

export interface ILocLightAspect {
	Garden: ILocation;
	Temple: ILocation;
}

export interface ILocRigard {
	Gate: ILocation;
	Barracks: ILocRigardBarracks;
	Residential: ILocRigardResidential;
	Brothel: ILocRigardBrothel;
	Plaza: ILocation;
	Inn: ILocRigardInn;
	ShopStreet: ILocRigardShops;
	Krawitz: ILocRigardKrawitz;
	Castle: ILocRigardCastle;
	Slums: ILocRigardSlums;
	Tavern: ILocRigardTavern;
}

export interface ILocRigardBarracks {
	Common: ILocation;
	Sparring: ILocation;
	Captains: ILocation;
}

export interface ILocRigardResidential {
	Street: ILocation;
	Tavern: ILocation;
	Miranda: ILocation;
	MDungeon: ILocation;
}

export interface ILocRigardBrothel {
	Brothel: ILocation;
	Cellar: ILocation;
}

export interface ILocRigardInn {
	Common: ILocation;
	Backroom: ILocation;
	Cellar: ILocation;
	Room: ILocation;
	Room69: ILocation;
	Penthouse: ILocation;
}

export interface ILocRigardShops {
	Street: ILocation;
	OddShop: ILocation;
	ClothShop: ILocation;
	WeaponShop: ILocation;
	ArmorShop: ILocation;
	AlchemyShop: ILocation;
	MagicShop: ILocation;
	Gate: ILocation;
}

export interface ILocRigardKrawitz {
	Street: ILocation;
	Servants: ILocation;
	Grounds: ILocation;
	Bathhouse: ILocation;
	Mansion: ILocRigardKrawitzMansion;
}

interface ILocRigardKrawitzMansion {
	Hall: ILocation;
	Study: ILocation;
	Kitchen: ILocation;
	Storeroom: ILocation;
}

export interface ILocRigardCastle {
	Grounds: ILocation;
	MageTower: ILocation;
	Court: ILocation;
	Dungeon: ILocation;
}

export interface ILocRigardSlums {
	Gate: ILocation;
	Docks: ILocation;
}

export interface ILocRigardTavern {
	Common: ILocation;
}
