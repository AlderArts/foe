const AscheFlags = {
    Met : {
        NotMet : 0,
        Met    : 1,
    },
    Talk : {
        Shop    : 1,
        Herself : 2,
        Sister  : 4,
        Stock   : 8,
        Box     : 16,
        BoxDoll : 32,
    },
    Magic : {
        Components : 1,
        Rituals    : 2,
        Authority  : 3,
        Spirits    : 4,
    },
    Tasks : {
        Ginseng_Started : 1,
        Ginseng_Failed : 2,
        Ginseng_Succeeded : 4,
        Ginseng_Finished : 8,
        Nightshade_Started  : 16,
        Nightshade_Aquilius : 32,
        Nightshade_Succeeded : 64,
        Nightshade_Finished : 128,
        Spring_Started : 256,
        Spring_Visited : 512,
        Spring_Finished : 1024,
    },
};

export { AscheFlags };
