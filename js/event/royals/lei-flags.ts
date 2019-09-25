export namespace LeiFlags {
    export enum EscortTask {
        OnTime    = 1,
        Flirted   = 2,
        WonCombat = 4,
    }

    export enum PartyStrength {
        LEVEL_WEAK   = 5,
        LEVEL_STRONG = 10,
    }
    export enum Met {
        NotMet    = 0,
        SeenInn   = 1,
        SeenGates = 2,
        KnowName  = 3,
        OnTaskEscort = 4,
        EscortFinished = 5,
        CompletedTaskEscort = 6,
    }
    export enum Fight {
        No         = 0,
        Submission = 1,
        Loss       = 2,
        Win        = 3,
    }
    export enum Rel {
        L1 = 20,
        L2 = 40,
        L3 = 60,
        L4 = 80,
    }
    export enum Talk { // Bitmask
        Skills = 1,
        Sex = 2,
        GuardBeating = 4,
    }
}
