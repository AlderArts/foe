Items.StrapOn = {};

Items.StrapOn.PlainStrapon = new Item("strapon0", "Plain strapon");
Items.StrapOn.PlainStrapon.price = 40;
Items.StrapOn.PlainStrapon.Short = function() { return "A plain strapon, shaped like a human cock"; }
Items.StrapOn.PlainStrapon.Long  = function() { return "The strapon is roughly the size and shape of an average human phallus. It is made from a slighly rubbery material. At the base, there are straps for attatching it."; }
Items.StrapOn.PlainStrapon.EquipType = ItemType.StrapOn;
Items.StrapOn.PlainStrapon.cock = new Cock();
Items.StrapOn.PlainStrapon.cock.thickness.base = 3;
Items.StrapOn.PlainStrapon.cock.length.base    = 15;
Items.StrapOn.PlainStrapon.cock.isStrapon      = true;

Items.StrapOn.LargeStrapon = new Item("strapon1", "Large strapon");
Items.StrapOn.LargeStrapon.price = 70;
Items.StrapOn.LargeStrapon.Short = function() { return "A large strapon, shaped like a human cock"; }
Items.StrapOn.LargeStrapon.Long  = function() { return "The strapon is roughly the shape of a human phallus, but very large. It is made from a slighly rubbery material. At the base, there are straps for attatching it."; }
Items.StrapOn.LargeStrapon.EquipType = ItemType.StrapOn;
Items.StrapOn.LargeStrapon.cock = new Cock();
Items.StrapOn.LargeStrapon.cock.thickness.base = 4;
Items.StrapOn.LargeStrapon.cock.length.base    = 30;
Items.StrapOn.LargeStrapon.cock.isStrapon      = true;

Items.StrapOn.EquineStrapon = new Item("strapon2", "Equine strapon");
Items.StrapOn.EquineStrapon.price = 100;
Items.StrapOn.EquineStrapon.Short = function() { return "An immense strapon, in the shape of a horsecock"; }
Items.StrapOn.EquineStrapon.Long  = function() { return "About forty cm in length, the pleasure toy is only for the most spacious orifices. It comes complete with a sheath and a flared head. It is made from a slighly rubbery material. At the base, there are straps for attatching it."; }
Items.StrapOn.EquineStrapon.EquipType = ItemType.StrapOn;
Items.StrapOn.EquineStrapon.cock = new Cock();
Items.StrapOn.EquineStrapon.cock.thickness.base = 7;
Items.StrapOn.EquineStrapon.cock.length.base    = 40;
Items.StrapOn.EquineStrapon.cock.race           = Race.horse;
Items.StrapOn.EquineStrapon.cock.sheath         = 1;
Items.StrapOn.EquineStrapon.cock.isStrapon      = true;

Items.StrapOn.CanidStrapon = new Item("strapon3", "Canid strapon");
Items.StrapOn.CanidStrapon.price = 100;
Items.StrapOn.CanidStrapon.Short = function() { return "A huge strapon with a canid knot at the base"; }
Items.StrapOn.CanidStrapon.Long  = function() { return "While not incredibly long, the dog-like strapon is very thick. It comes complete with a knot and a pointed tip. It is made from a slighly rubbery material. At the base, there are straps for attatching it."; }
Items.StrapOn.CanidStrapon.EquipType = ItemType.StrapOn;
Items.StrapOn.CanidStrapon.cock = new Cock();
Items.StrapOn.CanidStrapon.cock.thickness.base = 5;
Items.StrapOn.CanidStrapon.cock.length.base    = 25;
Items.StrapOn.CanidStrapon.cock.race           = Race.dog;
Items.StrapOn.CanidStrapon.cock.knot           = 1;
Items.StrapOn.CanidStrapon.cock.isStrapon      = true;

Items.StrapOn.ChimeraStrapon = new Item("strapon4", "Chimera strapon");
Items.StrapOn.ChimeraStrapon.price = 400;
Items.StrapOn.ChimeraStrapon.Short = function() { return "An enormous, bestial strapon"; }
Items.StrapOn.ChimeraStrapon.Long  = function() { return "About sixty cm in length, the strapon is only for the most spacious orifices. It combines the barbed head of a feline cock with the sheath of a horse and the knot of a canine. It is made from a slighly rubbery material. At the base, there are straps for attatching it."; }
Items.StrapOn.ChimeraStrapon.EquipType = ItemType.StrapOn;
Items.StrapOn.ChimeraStrapon.cock = new Cock();
Items.StrapOn.ChimeraStrapon.cock.thickness.base = 11;
Items.StrapOn.ChimeraStrapon.cock.length.base    = 60;
Items.StrapOn.ChimeraStrapon.cock.race           = Race.cat;
Items.StrapOn.ChimeraStrapon.cock.sheath         = 1;
Items.StrapOn.ChimeraStrapon.cock.knot           = 1;
Items.StrapOn.ChimeraStrapon.cock.isStrapon      = true;
