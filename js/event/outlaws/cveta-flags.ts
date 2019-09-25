export namespace CvetaFlags {
    export enum Met {
        NotMet       = 0,
        MariaTalk    = 1,
        FirstMeeting = 2,
        ViolinQ      = 3,
        ViolinGet    = 4,
        Available    = 5,
    }
    export enum Herself {
        None     = 0,
        Outlaws  = 1,
        Nobility = 2,
        Mandate  = 3,
    }
    export enum Music {
        No     = 0,
        Talked = 1,
    }
    export enum Bard {
        No     = 0,
        Taught = 1,
    }
    export enum Singer {
        No     = 0,
        Taught = 1,
    }
    export enum Intimate { // Bitmask
        Introduced = 1, // seen post-bulltower performance
        Groped = 2,
    }

    export enum Dates { // Bitmask
        Glade = 1,
        Spring = 2,
    }
}
