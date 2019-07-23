/*
 * Cavalcade card suits
 */
import { Item, ItemType } from '../item';

let CardItems = {};
CardItems.Light = [];
CardItems.Light[0] = new Item("cardL1", "[L1] Lady", ItemType.Card);
CardItems.Light[0].val = 0;
CardItems.Light[0].suit = 0;
CardItems.Light[0].Short = function() { return "The Lady of Light"; }
CardItems.Light[0].Long = function() { return "The Lady of Light, a playing card from the game Cavalcade."; }
CardItems.Light[1] = new Item("cardL2", "[L2] Champion", ItemType.Card);
CardItems.Light[1].val = 1;
CardItems.Light[1].suit = 0;
CardItems.Light[1].Short = function() { return "The Champion of Light"; }
CardItems.Light[1].Long = function() { return "The Champion of Light, a playing card from the game Cavalcade."; }
CardItems.Light[2] = new Item("cardL3", "[L3] Priestess", ItemType.Card);
CardItems.Light[2].val = 2;
CardItems.Light[2].suit = 0;
CardItems.Light[2].Short = function() { return "The Priestess of Light"; }
CardItems.Light[2].Long = function() { return "The Priestess of Light, a playing card from the game Cavalcade."; }
CardItems.Light[3] = new Item("cardL4", "[L4] Steed", ItemType.Card);
CardItems.Light[3].val = 3;
CardItems.Light[3].suit = 0;
CardItems.Light[3].Short = function() { return "The Steed of Light"; }
CardItems.Light[3].Long = function() { return "The Steed of Light, a playing card from the game Cavalcade."; }
CardItems.Light[4] = new Item("cardL5", "[L5] Maiden", ItemType.Card);
CardItems.Light[4].val = 4;
CardItems.Light[4].suit = 0;
CardItems.Light[4].Short = function() { return "The Maiden of Light"; }
CardItems.Light[4].Long = function() { return "The Maiden of Light, a playing card from the game Cavalcade."; }

CardItems.Darkness = [];
CardItems.Darkness[0] = new Item("cardD1", "[D1] Queen", ItemType.Card);
CardItems.Darkness[0].val = 0;
CardItems.Darkness[0].suit = 1;
CardItems.Darkness[0].Short = function() { return "The Queen of Darkness"; }
CardItems.Darkness[0].Long = function() { return "The Queen of Darkness, a playing card from the game Cavalcade."; }
CardItems.Darkness[1] = new Item("cardD2", "[D2] Slayer", ItemType.Card);
CardItems.Darkness[1].val = 1;
CardItems.Darkness[1].suit = 1;
CardItems.Darkness[1].Short = function() { return "The Slayer of Darkness"; }
CardItems.Darkness[1].Long = function() { return "The Slayer of Darkness, a playing card from the game Cavalcade."; }
CardItems.Darkness[2] = new Item("cardD3", "[D3] Zealot", ItemType.Card);
CardItems.Darkness[2].val = 2;
CardItems.Darkness[2].suit = 1;
CardItems.Darkness[2].Short = function() { return "The Zealot of Darkness"; }
CardItems.Darkness[2].Long = function() { return "The Zealot of Darkness, a playing card from the game Cavalcade."; }
CardItems.Darkness[3] = new Item("cardD4", "[D4] Beast", ItemType.Card);
CardItems.Darkness[3].val = 3;
CardItems.Darkness[3].suit = 1;
CardItems.Darkness[3].Short = function() { return "The Beast of Darkness"; }
CardItems.Darkness[3].Long = function() { return "The Beast of Darkness, a playing card from the game Cavalcade."; }
CardItems.Darkness[4] = new Item("cardD5", "[D5] Harlot", ItemType.Card);
CardItems.Darkness[4].val = 4;
CardItems.Darkness[4].suit = 1;
CardItems.Darkness[4].Short = function() { return "The Harlot of Darkness"; }
CardItems.Darkness[4].Long = function() { return "The Harlot of Darkness, a playing card from the game Cavalcade."; }

CardItems.Shadow = [];
CardItems.Shadow[0] = new Item("cardS1", "[S1] Avatar", ItemType.Card);
CardItems.Shadow[0].val = 0;
CardItems.Shadow[0].suit = 2;
CardItems.Shadow[0].Short = function() { return "The Avatar of Shadow"; }
CardItems.Shadow[0].Long = function() { return "The Avatar of Shadow, a playing card from the game Cavalcade."; }
CardItems.Shadow[1] = new Item("cardS2", "[S2] Trickster", ItemType.Card);
CardItems.Shadow[1].val = 1;
CardItems.Shadow[1].suit = 2;
CardItems.Shadow[1].Short = function() { return "The Trickster of Shadow"; }
CardItems.Shadow[1].Long = function() { return "The Trickster of Shadow, a playing card from the game Cavalcade."; }
CardItems.Shadow[2] = new Item("cardS3", "[S3] Wanderer", ItemType.Card);
CardItems.Shadow[2].val = 2;
CardItems.Shadow[2].suit = 2;
CardItems.Shadow[2].Short = function() { return "The Wanderer of Shadow"; }
CardItems.Shadow[2].Long = function() { return "The Wanderer of Shadow, a playing card from the game Cavalcade."; }
CardItems.Shadow[3] = new Item("cardS4", "[S4] Stag", ItemType.Card);
CardItems.Shadow[3].val = 3;
CardItems.Shadow[3].suit = 2;
CardItems.Shadow[3].Short = function() { return "The Shadow Stag"; }
CardItems.Shadow[3].Long = function() { return "The Shadow Stag, a playing card from the game Cavalcade."; }
CardItems.Shadow[4] = new Item("cardS5", "[S5] Dancer", ItemType.Card);
CardItems.Shadow[4].val = 4;
CardItems.Shadow[4].suit = 2;
CardItems.Shadow[4].Short = function() { return "The Dancer of Shadow"; }
CardItems.Shadow[4].Long = function() { return "The Dancer of Shadow, a playing card from the game Cavalcade."; }

export { CardItems };
