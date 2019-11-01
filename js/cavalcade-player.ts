import { CardItem, CardSuit } from "./items/cards";

export interface ICavalcadeResult {
    score: number;
    low?: number;
    high?: number;
    stag: boolean;
    suit?: CardSuit;
}

export interface ICavalcadePlayer {
    out: boolean;
    folded: boolean;
    hand: CardItem[];
    res: ICavalcadeResult;
    purse: {coin: number};

    name: string;
    NameDesc: () => string;
    Possessive: () => string;
}
