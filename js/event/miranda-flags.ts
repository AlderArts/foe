const MirandaFlags = {
    Attitude : {
        Hate    : -2,
        Dismiss : -1,
        Neutral : 0,
        Nice    : 1,
    },

    Met : {
        NotMet : 0,
        Met    : 1,
        Tavern : 2,
        TavernAftermath : 3,
    },

    Talk : {
        Kids : 1,
    },

    Public : {
        Nothing : 0,
        Oral    : 1,
        Sex     : 2,
        Other   : 3,
        Orgy    : 4,
    },

    Snitch : { // Bitmask
        SnitchedOnSnitch : 1,
        Sexed : 2,
        RefusedSex : 4,
    },

    Bruiser : {
        No       : 0,
        Progress : 1,
        Taught   : 2,
    },
};

export { MirandaFlags };
