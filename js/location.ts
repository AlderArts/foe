import { EncounterTable } from "./encountertable";

export interface ILocation {
    SaveSpot: string;
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
