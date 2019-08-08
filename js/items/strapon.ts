import { Item, ItemType, ItemSubtype } from '../item';
import { Cock } from '../body/cock';
import { Race } from '../body/race';

let StrapOnItems : any  = {};

StrapOnItems.PlainStrapon = new Item("strapon0", "Plain strap-on", ItemType.Toy);
StrapOnItems.PlainStrapon.price = 40;
StrapOnItems.PlainStrapon.sDesc = function() { return "plain strap-on"; }
StrapOnItems.PlainStrapon.lDesc = function() { return "a plain strap-on"; }
StrapOnItems.PlainStrapon.Short = function() { return "A plain strap-on, shaped like a human cock"; }
StrapOnItems.PlainStrapon.Long  = function() { return "The strap-on is roughly the size and shape of an average human phallus. It is made from a slightly rubbery material. At the base, there are straps for attatching it."; }
StrapOnItems.PlainStrapon.subtype = ItemSubtype.StrapOn;
StrapOnItems.PlainStrapon.cock = new Cock();
StrapOnItems.PlainStrapon.cock.thickness.base = 3;
StrapOnItems.PlainStrapon.cock.length.base    = 15;
StrapOnItems.PlainStrapon.cock.isStrapon      = true;

StrapOnItems.LargeStrapon = new Item("strapon1", "Large strap-on", ItemType.Toy);
StrapOnItems.LargeStrapon.price = 70;
StrapOnItems.LargeStrapon.sDesc = function() { return "large strap-on"; }
StrapOnItems.LargeStrapon.lDesc = function() { return "a large strap-on"; }
StrapOnItems.LargeStrapon.Short = function() { return "A large strap-on, shaped like a human cock"; }
StrapOnItems.LargeStrapon.Long  = function() { return "The strap-on is roughly the shape of a human phallus, but very large. It is made from a slightly rubbery material. At the base, there are straps for attatching it."; }
StrapOnItems.LargeStrapon.subtype = ItemSubtype.StrapOn;
StrapOnItems.LargeStrapon.cock = new Cock();
StrapOnItems.LargeStrapon.cock.thickness.base = 4;
StrapOnItems.LargeStrapon.cock.length.base    = 30;
StrapOnItems.LargeStrapon.cock.isStrapon      = true;

StrapOnItems.EquineStrapon = new Item("strapon2", "Equine strap-on", ItemType.Toy);
StrapOnItems.EquineStrapon.price = 100;
StrapOnItems.EquineStrapon.sDesc = function() { return "equine strap-on"; }
StrapOnItems.EquineStrapon.lDesc = function() { return "an equine strap-on"; }
StrapOnItems.EquineStrapon.Short = function() { return "An immense strap-on in the shape of a horsecock"; }
StrapOnItems.EquineStrapon.Long  = function() { return "About twenty inches in length, the pleasure toy is only for the most spacious orifices. It comes complete with a sheath and a flared head. It is made from a slightly rubbery material. At the base, there are straps for attatching it."; }
StrapOnItems.EquineStrapon.subtype = ItemSubtype.StrapOn;
StrapOnItems.EquineStrapon.cock = new Cock();
StrapOnItems.EquineStrapon.cock.thickness.base = 8;
StrapOnItems.EquineStrapon.cock.length.base    = 40;
StrapOnItems.EquineStrapon.cock.race           = Race.Horse;
StrapOnItems.EquineStrapon.cock.isStrapon      = true;

StrapOnItems.CanidStrapon = new Item("strapon3", "Canid strap-on", ItemType.Toy);
StrapOnItems.CanidStrapon.price = 100;
StrapOnItems.CanidStrapon.sDesc = function() { return "knotted strap-on"; }
StrapOnItems.CanidStrapon.lDesc = function() { return "a knotted strap-on"; }
StrapOnItems.CanidStrapon.Short = function() { return "A huge strap-on with a canid knot at the base"; }
StrapOnItems.CanidStrapon.Long  = function() { return "While not incredibly long, the dog-like strap-on is very thick. It comes complete with a knot and a pointed tip. It is made from a slightly rubbery material. At the base, there are straps for attatching it."; }
StrapOnItems.CanidStrapon.subtype = ItemSubtype.StrapOn;
StrapOnItems.CanidStrapon.cock = new Cock();
StrapOnItems.CanidStrapon.cock.thickness.base = 7;
StrapOnItems.CanidStrapon.cock.length.base    = 24;
StrapOnItems.CanidStrapon.cock.race           = Race.Canine;
StrapOnItems.CanidStrapon.cock.knot           = 1;
StrapOnItems.CanidStrapon.cock.isStrapon      = true;

StrapOnItems.ChimeraStrapon = new Item("strapon4", "Chimera strap-on", ItemType.Toy);
StrapOnItems.ChimeraStrapon.price = 400;
StrapOnItems.ChimeraStrapon.sDesc = function() { return "monstrous strap-on"; }
StrapOnItems.ChimeraStrapon.lDesc = function() { return "a monstrous strap-on"; }
StrapOnItems.ChimeraStrapon.Short = function() { return "An enormous, bestial strap-on"; }
StrapOnItems.ChimeraStrapon.Long  = function() { return "About twentyfive inches in length, the strap-on is only for the most spacious orifices. It combines the barbed head of a feline cock with the sheath of a horse and the knot of a canine. It is made from a slightly rubbery material. At the base, there are straps for attatching it."; }
StrapOnItems.ChimeraStrapon.subtype = ItemSubtype.StrapOn;
StrapOnItems.ChimeraStrapon.cock = new Cock();
StrapOnItems.ChimeraStrapon.cock.thickness.base = 10;
StrapOnItems.ChimeraStrapon.cock.length.base    = 50;
StrapOnItems.ChimeraStrapon.cock.race           = Race.Feline;
StrapOnItems.ChimeraStrapon.cock.knot           = 1;
StrapOnItems.ChimeraStrapon.cock.isStrapon      = true;

export { StrapOnItems };
