export namespace MirandaFlags {
    export enum Attitude {
        Hate    = -2,
        Dismiss = -1,
        Neutral = 0,
        Nice    = 1,
    }

    export enum Met {
        NotMet = 0,
        Met    = 1,
        Tavern = 2,
        TavernAftermath = 3,
    }

    export enum Talk {
        Kids = 1,
    }

    export enum Public {
        Nothing = 0,
        Oral    = 1,
        Sex     = 2,
        Other   = 3,
        Orgy    = 4,
    }

    export enum Snitch { // Bitmask
        SnitchedOnSnitch = 1,
        Sexed = 2,
        RefusedSex = 4,
    }

    export enum Bruiser {
        No       = 0,
        Progress = 1,
        Taught   = 2,
    }
}
