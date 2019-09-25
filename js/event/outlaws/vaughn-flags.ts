export namespace VaughnFlags {
    export enum Met {
        NotAvailable = 0,
        Met = 1,
        // Task 1
        OnTaskLockpicks = 2,
        LockpicksElodie = 3,
        CompletedLockpicks = 4,
        // Task 2
        OnTaskSnitch = 5,
        SnitchMirandaSuccess = 6,
        SnitchWatchhousFail = 7,
        SnitchWatchhousSuccess = 8,
        CompletedSnitch = 10,
        // Task 3
        OnTaskPoisoning = 11,
        PoisoningFail = 12,
        PoisoningSucceed = 13,
        CompletedPoisoning = 14,
        // TODO= tasks
    }
    export enum Talk { // Bitmask
        Himself = 1,
        Past    = 2,
        Fiancee = 4,
        Sex     = 8,
        Confront = 16,
        ConfrontFollowup = 32,
    }
    export enum TalkWar {
        Beginnings = 1,
        Wartime    = 2,
        Desertion  = 3,
        Afterwards = 4,
    }
    export enum Sex {
        Titfuck = 1,
    }

    // Bitmask
    export enum Poisoning {
        Poison = 1,
        Aphrodisiac = 2,
        Success = 4,
        LeftItToTerry = 8,
        LeftItToTwins = 16,
        JoinedOrgy = 32,
        Used69 = 64,
        LeftItToLei = 128,
    }
}
