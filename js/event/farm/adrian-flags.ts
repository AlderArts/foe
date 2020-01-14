export namespace AdrianFlags {
    export enum Met {
        NotMet  = 0,
        Shy     = 1,
        Sub     = 2,
        Dom     = 3,
    }

    // Bitmask
    export enum Flags {
        Taunted    = 1,
        Humiliated = 2,
        Encouraged = 4,
        Seduced    = 8,
    }
}
