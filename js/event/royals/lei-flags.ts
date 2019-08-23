export const LeiFlags = {
    EscortTask : {
        OnTime    : 1,
        Flirted   : 2,
        WonCombat : 4,
    },

    PartyStrength : {
        LEVEL_WEAK   : 5,
        LEVEL_STRONG : 10,
    },
    Met : {
        NotMet    : 0,
        SeenInn   : 1,
        SeenGates : 2,
        KnowName  : 3,
        OnTaskEscort : 4,
        EscortFinished : 5,
        CompletedTaskEscort : 6,
    },
    Fight : {
        No         : 0,
        Submission : 1,
        Loss       : 2,
        Win        : 3,
    },
    Rel : {
        L1 : 20,
        L2 : 40,
        L3 : 60,
        L4 : 80,
    },
    Talk : { // Bitmask
        Skills : 1,
        Sex : 2,
        GuardBeating : 4,
    },
};
