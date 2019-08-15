
const OutlawsFlags = {
    Met : {
        NotMet     : 0,
        Met        : 1,
        Bouqet     : 2,
        Letter     : 3,
        MetBelinda : 4,
    },

    Events : { // Bitmask
        ChowTime : 1,
        Cavalcade : 2,
        BeatMaria : 4, // Beat maria at archery
        FactFind : 8,
    },

    // Quest results
    BullTower : {
        AlaricFreed      : 1,
        StatueDestroyed  : 2,
        CaravansIgnited  : 4,
        CaravansSearched : 8,
        AnimalsFreed     : 16,
        SafeLooted       : 32,
        BlueRoses        : 64,
        ContrabandStolen : 128,
        PerfectScore     : 256,
    },

    // Quest state
    BullTowerQuest : {
        NotStarted : 0,
        Initiated  : 1,
        Completed  : 2,
        AlaricFollowup : 3,
        ZenithFollowup : 4,
    },
};

export { OutlawsFlags };
