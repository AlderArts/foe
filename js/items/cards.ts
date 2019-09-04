/*
 * Cavalcade card suits
 */
import { Item, ItemType } from "../item";

export enum CardSuit {
    Light,
    Darkness,
    Shadow,
}

export class CardItem extends Item {
    public val: number;
    public suit: CardSuit;
    public Short: () => string;
    public Long: () => string;

    constructor(id: string, name: string, value: number, suit: CardSuit) {
        super(id, name, ItemType.Card);
        this.val = value;
        this.suit = suit;
    }
}

const CardItems: any = {
    Light : [],
    Darkness : [],
    Shadow : [],
};

CardItems.Light[0] = new CardItem("cardL1", "[L1] Lady", 0, CardSuit.Light);
CardItems.Light[0].Short = () => "The Lady of Light";
CardItems.Light[0].Long = () => "The Lady of Light, a playing card from the game Cavalcade.";
CardItems.Light[1] = new CardItem("cardL2", "[L2] Champion", 1, CardSuit.Light);
CardItems.Light[1].Short = () => "The Champion of Light";
CardItems.Light[1].Long = () => "The Champion of Light, a playing card from the game Cavalcade.";
CardItems.Light[2] = new CardItem("cardL3", "[L3] Priestess", 2, CardSuit.Light);
CardItems.Light[2].Short = () => "The Priestess of Light";
CardItems.Light[2].Long = () => "The Priestess of Light, a playing card from the game Cavalcade.";
CardItems.Light[3] = new CardItem("cardL4", "[L4] Steed", 3, CardSuit.Light);
CardItems.Light[3].Short = () => "The Steed of Light";
CardItems.Light[3].Long = () => "The Steed of Light, a playing card from the game Cavalcade.";
CardItems.Light[4] = new CardItem("cardL5", "[L5] Maiden", 4, CardSuit.Light);
CardItems.Light[4].Short = () => "The Maiden of Light";
CardItems.Light[4].Long = () => "The Maiden of Light, a playing card from the game Cavalcade.";

CardItems.Darkness[0] = new CardItem("cardD1", "[D1] Queen", 0, CardSuit.Darkness);
CardItems.Darkness[0].Short = () => "The Queen of Darkness";
CardItems.Darkness[0].Long = () => "The Queen of Darkness, a playing card from the game Cavalcade.";
CardItems.Darkness[1] = new CardItem("cardD2", "[D2] Slayer", 1, CardSuit.Darkness);
CardItems.Darkness[1].Short = () => "The Slayer of Darkness";
CardItems.Darkness[1].Long = () => "The Slayer of Darkness, a playing card from the game Cavalcade.";
CardItems.Darkness[2] = new CardItem("cardD3", "[D3] Zealot", 2, CardSuit.Darkness);
CardItems.Darkness[2].Short = () => "The Zealot of Darkness";
CardItems.Darkness[2].Long = () => "The Zealot of Darkness, a playing card from the game Cavalcade.";
CardItems.Darkness[3] = new CardItem("cardD4", "[D4] Beast", 3, CardSuit.Darkness);
CardItems.Darkness[3].Short = () => "The Beast of Darkness";
CardItems.Darkness[3].Long = () => "The Beast of Darkness, a playing card from the game Cavalcade.";
CardItems.Darkness[4] = new CardItem("cardD5", "[D5] Harlot", 4, CardSuit.Darkness);
CardItems.Darkness[4].Short = () => "The Harlot of Darkness";
CardItems.Darkness[4].Long = () => "The Harlot of Darkness, a playing card from the game Cavalcade.";

CardItems.Shadow[0] = new CardItem("cardS1", "[S1] Avatar", 0, CardSuit.Shadow);
CardItems.Shadow[0].Short = () => "The Avatar of Shadow";
CardItems.Shadow[0].Long = () => "The Avatar of Shadow, a playing card from the game Cavalcade.";
CardItems.Shadow[1] = new CardItem("cardS2", "[S2] Trickster", 1, CardSuit.Shadow);
CardItems.Shadow[1].Short = () => "The Trickster of Shadow";
CardItems.Shadow[1].Long = () => "The Trickster of Shadow, a playing card from the game Cavalcade.";
CardItems.Shadow[2] = new CardItem("cardS3", "[S3] Wanderer", 2, CardSuit.Shadow);
CardItems.Shadow[2].Short = () => "The Wanderer of Shadow";
CardItems.Shadow[2].Long = () => "The Wanderer of Shadow, a playing card from the game Cavalcade.";
CardItems.Shadow[3] = new CardItem("cardS4", "[S4] Stag", 3, CardSuit.Shadow);
CardItems.Shadow[3].Short = () => "The Shadow Stag";
CardItems.Shadow[3].Long = () => "The Shadow Stag, a playing card from the game Cavalcade.";
CardItems.Shadow[4] = new CardItem("cardS5", "[S5] Dancer", 4, CardSuit.Shadow);
CardItems.Shadow[4].Short = () => "The Dancer of Shadow";
CardItems.Shadow[4].Long = () => "The Dancer of Shadow, a playing card from the game Cavalcade.";

export { CardItems };
