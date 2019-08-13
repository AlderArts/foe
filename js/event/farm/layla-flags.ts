export namespace LaylaFlags {
    export enum Met {
        NotMet = 0,//Never seen
        First  = 1,//Met at least once, not defeated
        Won    = 2,//Defeated
        Farm   = 3,//Talked to at farm, not in party
        Party  = 4,//Recruited to party
        Talked = 5 //Talked to her in party
    }

    export enum Talk {
        Sex    = 1, //Talked about sex
        Origin = 2
    }
}
