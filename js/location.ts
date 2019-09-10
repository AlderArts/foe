import { EncounterTable } from "./encountertable";

export interface ILocation {
    SaveSpot: string;
    wait: () => boolean;
    safe: () => boolean;
    switchSpot: () => boolean;
    SleepFunc: () => void;
    WaitFunc: () => void;
    PrintDesc: () => void;
    description: () => void;
    onEntry: (x?: any, from?: ILocation) => void;
    events: any[];
    links: any[];
    hunt: any[];
    enc: EncounterTable;
    SetButtons: (links?: any[]) => void;
    AddEncounter: (enc: any) => void;
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
    SaveSpots: any;
    CurrentLocation?: (loc?: ILocation) => any;
}

export interface ILocations {
    Plains: ILocPlains;
    Farm: ILocFarm;
    Burrows: ILocBurrows;
    Forest: ILocForest;
    Desert: any;
    KingsRoad: any;
    Highlands: any;
    Lake: any;
    Outlaws: ILocOutlaws;
    BullTower: any;
    Rigard: any;

    DragonDen: any;
    TreeCity: any;

    DarkAspect: any;
    LightAspect: any;
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
