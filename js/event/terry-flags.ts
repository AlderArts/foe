export namespace TerryFlags {
    // Note: bitmask
    export enum TF {
        NotTried   = 0,
        TriedItem  = 1,
        Rosalin    = 2,
        Jeanne     = 4,
        JeanneUsed = 8,
    }
    export enum Met {
        NotMet  = 0,
        Found   = 1,
        Caught  = 2,
        LetHer  = 2,
        StopHer = 3,
        TakeHim = 4,
    }
    export enum Saved {
        NotStarted    = 0,
        TalkedMiranda = 1,
        TalkedTwins1  = 2,
        TalkedTwins2  = 3,
        Saved         = 4,
    }
    export enum Vengeance {
        NotTriggered = 0,
        Triggered    = 1,
        Pursued      = 2,
    }
    export enum Rogue {
        Locked = 0,
        First  = 1,
        Taught = 2,
    }
    export enum Breasts {
        Flat = 0,
        Acup = 1,
        Bcup = 2,
        Ccup = 3,
        Dcup = 4,
    }
    export enum Cock {
        Regular = 0,
        Horse   = 1,
        None    = 2,
    }
    export enum Pussy {
        None   = 0,
        Virgin = 1,
        Used   = 2,
    }
    export enum MilkLevel {
        Low      = 0.5,
        Mid      = 3,
        High     = 5,
        VeryHigh = 7.5,
    }
    export enum CumLevel {
        Low      = 3,
        Mid      = 8,
        High     = 13,
        VeryHigh = 20,
    }
    export enum PersonalQuest {
        NotStarted = 0,
        Started    = 1,
        Completed  = 2,
    }
}
