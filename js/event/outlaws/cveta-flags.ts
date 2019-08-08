let CvetaFlags = {
    Met : {
        NotMet       : 0,
        MariaTalk    : 1,
        FirstMeeting : 2,
        ViolinQ      : 3,
        ViolinGet    : 4,
        Available    : 5
    },
    Herself : {
        None     : 0,
        Outlaws  : 1,
        Nobility : 2,
        Mandate  : 3
    },
    Music : {
        No     : 0,
        Talked : 1
    },
    Bard : {
        No     : 0,
        Taught : 1
    },
    Singer : {
        No     : 0,
        Taught : 1
    },
    Intimate : { //Bitmask
        Introduced : 1, //seen post-bulltower performance
        Groped : 2
    },
};

export { CvetaFlags };
