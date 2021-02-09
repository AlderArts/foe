export namespace AdrianFlags {
    export enum Met {
        NotMet  = 0,
        Shy     = 1,
        Sub     = 2,
        Dom     = 3,
    }

    export enum EPlus {
        NotStarted = 0,
    }

    // Bitmask
    export enum Flags {
        TalkedGwendy = 1,
        Taunted      = 2,
        Humiliated   = 4,
        Encouraged   = 8,
        Seduced      = 16,
    }
}
