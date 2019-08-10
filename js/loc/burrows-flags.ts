let BurrowsFlags = {
    AccessFlags : {
        Unknown           : 0, //TODO: maybe redo burrows intro
        KnownNotVisited   : 1,
        Visited           : 2, //talked to Lagon
        Stage1            : 3, //turned in first ingredient
        Stage2            : 4, //turned in second ingredient
        Stage3            : 5, //turned in final ingredient
        Stage4            : 6, //talked to Roa about scepter
        Stage5            : 7, //confronted Gol
        QuestlineComplete : 8  //confronted Lagon and sided with him or Ophelia
    },

    Traits : {
        Brute  : 0,
        Herm   : 1,
        Brainy : 2
    },

    TraitFlags : {
        Inactive         : 0,
        Gathered         : 1,
        Active           : 2
    },
};

export { BurrowsFlags };
