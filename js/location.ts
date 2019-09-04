import { EncounterTable } from "./encountertable";

export interface ILocation {
    SaveSpot: any;
    wait: () => boolean;
    safe: () => boolean;
    switchSpot: () => boolean;
    SleepFunc: () => void;
    WaitFunc: () => void;
    PrintDesc: () => void;
    hunt: any[];
    enc: EncounterTable;
    SetButtons: (links?: any[]) => void;
}
