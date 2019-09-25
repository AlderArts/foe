export namespace MariaFlags {
    export enum Met {
        ForestMeeting = 1,
        Fight         = 2,
        FightSexed    = 4,
        FightLost     = 8,
    }

    export enum Ranger {
        NotTaught = 0,
        Taught    = 1,
    }

    export enum DeadDrops {
        Alert     = 1,
        Talked    = 2,
        Completed = 4,
        PaidKid   = 8,
        SexedGuards = 16,
        ShowedRoyal = 32,
        // TODO flag for repeat, specific things
    }
}
