import { Item, Items, ItemType, ItemSubtype } from '../item';
import { Cock } from '../body/cock';

Items.StrapOn = {};

Items.StrapOn.PlainStrapon = new Item("strapon0", "Plain strap-on", ItemType.Toy);
Items.StrapOn.PlainStrapon.price = 40;
Items.StrapOn.PlainStrapon.sDesc = function() { return "plain strap-on"; }
Items.StrapOn.PlainStrapon.lDesc = function() { return "a plain strap-on"; }
Items.StrapOn.PlainStrapon.Short = function() { return "A plain strap-on, shaped like a human cock"; }
Items.StrapOn.PlainStrapon.Long  = function() { return "The strap-on is roughly the size and shape of an average human phallus. It is made from a slightly rubbery material. At the base, there are straps for attatching it."; }
Items.StrapOn.PlainStrapon.subtype = ItemSubtype.StrapOn;
Items.StrapOn.PlainStrapon.cock = new Cock();
Items.StrapOn.PlainStrapon.cock.thickness.base = 3;
Items.StrapOn.PlainStrapon.cock.length.base    = 15;
Items.StrapOn.PlainStrapon.cock.isStrapon      = true;

Items.StrapOn.LargeStrapon = new Item("strapon1", "Large strap-on", ItemType.Toy);
Items.StrapOn.LargeStrapon.price = 70;
Items.StrapOn.LargeStrapon.sDesc = function() { return "large strap-on"; }
Items.StrapOn.LargeStrapon.lDesc = function() { return "a large strap-on"; }
Items.StrapOn.LargeStrapon.Short = function() { return "A large strap-on, shaped like a human cock"; }
Items.StrapOn.LargeStrapon.Long  = function() { return "The strap-on is roughly the shape of a human phallus, but very large. It is made from a slightly rubbery material. At the base, there are straps for attatching it."; }
Items.StrapOn.LargeStrapon.subtype = ItemSubtype.StrapOn;
Items.StrapOn.LargeStrapon.cock = new Cock();
Items.StrapOn.LargeStrapon.cock.thickness.base = 4;
Items.StrapOn.LargeStrapon.cock.length.base    = 30;
Items.StrapOn.LargeStrapon.cock.isStrapon      = true;

Items.StrapOn.EquineStrapon = new Item("strapon2", "Equine strap-on", ItemType.Toy);
Items.StrapOn.EquineStrapon.price = 100;
Items.StrapOn.EquineStrapon.sDesc = function() { return "equine strap-on"; }
Items.StrapOn.EquineStrapon.lDesc = function() { return "an equine strap-on"; }
Items.StrapOn.EquineStrapon.Short = function() { return "An immense strap-on in the shape of a horsecock"; }
Items.StrapOn.EquineStrapon.Long  = function() { return "About twenty inches in length, the pleasure toy is only for the most spacious orifices. It comes complete with a sheath and a flared head. It is made from a slightly rubbery material. At the base, there are straps for attatching it."; }
Items.StrapOn.EquineStrapon.subtype = ItemSubtype.StrapOn;
Items.StrapOn.EquineStrapon.cock = new Cock();
Items.StrapOn.EquineStrapon.cock.thickness.base = 8;
Items.StrapOn.EquineStrapon.cock.length.base    = 40;
Items.StrapOn.EquineStrapon.cock.race           = Race.Horse;
Items.StrapOn.EquineStrapon.cock.isStrapon      = true;

Items.StrapOn.CanidStrapon = new Item("strapon3", "Canid strap-on", ItemType.Toy);
Items.StrapOn.CanidStrapon.price = 100;
Items.StrapOn.CanidStrapon.sDesc = function() { return "knotted strap-on"; }
Items.StrapOn.CanidStrapon.lDesc = function() { return "a knotted strap-on"; }
Items.StrapOn.CanidStrapon.Short = function() { return "A huge strap-on with a canid knot at the base"; }
Items.StrapOn.CanidStrapon.Long  = function() { return "While not incredibly long, the dog-like strap-on is very thick. It comes complete with a knot and a pointed tip. It is made from a slightly rubbery material. At the base, there are straps for attatching it."; }
Items.StrapOn.CanidStrapon.subtype = ItemSubtype.StrapOn;
Items.StrapOn.CanidStrapon.cock = new Cock();
Items.StrapOn.CanidStrapon.cock.thickness.base = 7;
Items.StrapOn.CanidStrapon.cock.length.base    = 24;
Items.StrapOn.CanidStrapon.cock.race           = Race.Canine;
Items.StrapOn.CanidStrapon.cock.knot           = 1;
Items.StrapOn.CanidStrapon.cock.isStrapon      = true;

Items.StrapOn.ChimeraStrapon = new Item("strapon4", "Chimera strap-on", ItemType.Toy);
Items.StrapOn.ChimeraStrapon.price = 400;
Items.StrapOn.ChimeraStrapon.sDesc = function() { return "monstrous strap-on"; }
Items.StrapOn.ChimeraStrapon.lDesc = function() { return "a monstrous strap-on"; }
Items.StrapOn.ChimeraStrapon.Short = function() { return "An enormous, bestial strap-on"; }
Items.StrapOn.ChimeraStrapon.Long  = function() { return "About twentyfive inches in length, the strap-on is only for the most spacious orifices. It combines the barbed head of a feline cock with the sheath of a horse and the knot of a canine. It is made from a slightly rubbery material. At the base, there are straps for attatching it."; }
Items.StrapOn.ChimeraStrapon.subtype = ItemSubtype.StrapOn;
Items.StrapOn.ChimeraStrapon.cock = new Cock();
Items.StrapOn.ChimeraStrapon.cock.thickness.base = 10;
Items.StrapOn.ChimeraStrapon.cock.length.base    = 50;
Items.StrapOn.ChimeraStrapon.cock.race           = Race.Feline;
Items.StrapOn.ChimeraStrapon.cock.knot           = 1;
Items.StrapOn.ChimeraStrapon.cock.isStrapon      = true;
