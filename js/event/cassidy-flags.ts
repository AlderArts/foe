let CassidyFlags = {
    Met : {
        NotMet     : 0,
        Met        : 1,
        AskedBack  : 2,
        WentBack   : 3,
        KnowGender : 4,
        TalkFem    : 5,
        BeganFem   : 6,
        Feminized  : 7
    },

    Talk : {
        Salamanders : 1,
        Family      : 2,
        Loner       : 4,
        MShop       : 8, //One off manage the shop event
        Forge       : 16,
        SexIndoor   : 32,
        Spar        : 64,
        Model       : 128
    },

    Order : {
        None : 0
    },
};

export { CassidyFlags };
