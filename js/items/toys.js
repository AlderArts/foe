Items.Toys = {};

Items.Toys.SmallDildo = new Item("dildo0", "Small dildo", ItemType.Toy);
Items.Toys.SmallDildo.price = 15;
Items.Toys.SmallDildo.sDesc = function() { return "small dildo"; }
Items.Toys.SmallDildo.lDesc = function() { return "a small dildo"; }
Items.Toys.SmallDildo.Short = function() { return "A small toy, in the shape of a cock"; }
Items.Toys.SmallDildo.Long  = function() { return "About six inches in length, the pleasure toy could be used by just about anyone. It is made from a slightly rubbery material."; }
Items.Toys.SmallDildo.cock = new Cock();
Items.Toys.SmallDildo.subtype = ItemSubtype.Dildo;
Items.Toys.SmallDildo.cock.thickness.base = 3;
Items.Toys.SmallDildo.cock.length.base    = 12;

Items.Toys.MediumDildo = new Item("dildo1", "Medium dildo", ItemType.Toy);
Items.Toys.MediumDildo.price = 25;
Items.Toys.MediumDildo.sDesc = function() { return "dildo"; }
Items.Toys.MediumDildo.lDesc = function() { return "a dildo"; }
Items.Toys.MediumDildo.Short = function() { return "A medium sized toy, in the shape of a cock"; }
Items.Toys.MediumDildo.Long  = function() { return "About ten inches in length, the pleasure toy is made for more advanced practitioners. It is made from a slightly rubbery material."; }
Items.Toys.MediumDildo.cock = new Cock();
Items.Toys.MediumDildo.subtype = ItemSubtype.Dildo;
Items.Toys.MediumDildo.cock.thickness.base = 5;
Items.Toys.MediumDildo.cock.length.base    = 20;

Items.Toys.LargeDildo = new Item("dildo2", "Large dildo", ItemType.Toy);
Items.Toys.LargeDildo.price = 40;
Items.Toys.LargeDildo.sDesc = function() { return "large dildo"; }
Items.Toys.LargeDildo.lDesc = function() { return "a large dildo"; }
Items.Toys.LargeDildo.Short = function() { return "A large toy, in the shape of a cock"; }
Items.Toys.LargeDildo.Long  = function() { return "About eighteen inches in length, the pleasure toy is only for the most spacious orifices. It is made from a slightly rubbery material."; }
Items.Toys.LargeDildo.cock = new Cock();
Items.Toys.LargeDildo.subtype = ItemSubtype.Dildo;
Items.Toys.LargeDildo.cock.thickness.base = 8;
Items.Toys.LargeDildo.cock.length.base    = 36;

Items.Toys.ThinDildo = new Item("dildo3", "Thin dildo", ItemType.Toy);
Items.Toys.ThinDildo.price = 20;
Items.Toys.ThinDildo.sDesc = function() { return "thin dildo"; }
Items.Toys.ThinDildo.lDesc = function() { return "a thin dildo"; }
Items.Toys.ThinDildo.Short = function() { return "A long, thin toy, in the shape of a cock"; }
Items.Toys.ThinDildo.Long  = function() { return "This dildo is about eight inches in length, but relatively thin. It is made from a slightly rubbery material."; }
Items.Toys.ThinDildo.cock = new Cock();
Items.Toys.ThinDildo.subtype = ItemSubtype.Dildo;
Items.Toys.ThinDildo.cock.thickness.base = 2;
Items.Toys.ThinDildo.cock.length.base    = 16;

Items.Toys.ButtPlug = new Item("dildo4", "Buttplug", ItemType.Toy);
Items.Toys.ButtPlug.price = 20;
Items.Toys.ButtPlug.sDesc = function() { return "buttplug"; }
Items.Toys.ButtPlug.lDesc = function() { return "a buttplug"; }
Items.Toys.ButtPlug.Short = function() { return "A short, thick plug"; }
Items.Toys.ButtPlug.Long  = function() { return "A short, thick plug, designed for anal play. It is made from a slightly rubbery material."; }
Items.Toys.ButtPlug.cock = new Cock();
Items.Toys.ButtPlug.subtype = ItemSubtype.Dildo;
Items.Toys.ButtPlug.cock.thickness.base = 7;
Items.Toys.ButtPlug.cock.length.base    = 7;

Items.Toys.LargeButtPlug = new Item("dildo5", "L.Buttplug", ItemType.Toy);
Items.Toys.LargeButtPlug.price = 40;
Items.Toys.LargeButtPlug.sDesc = function() { return "large buttplug"; }
Items.Toys.LargeButtPlug.lDesc = function() { return "a large buttplug"; }
Items.Toys.LargeButtPlug.Short = function() { return "A large, thick plug"; }
Items.Toys.LargeButtPlug.Long  = function() { return "A large, thick plug, designed for advanced anal play. It is made from a slightly rubbery material."; }
Items.Toys.LargeButtPlug.cock = new Cock();
Items.Toys.LargeButtPlug.subtype = ItemSubtype.Dildo;
Items.Toys.LargeButtPlug.cock.thickness.base = 15;
Items.Toys.LargeButtPlug.cock.length.base    = 15;

Items.Toys.AnalBeads = new Item("dildo6", "Anal beads", ItemType.Toy);
Items.Toys.AnalBeads.price = 18;
Items.Toys.AnalBeads.plural = true;
Items.Toys.AnalBeads.sDesc = function() { return "anal beads"; }
Items.Toys.AnalBeads.lDesc = function() { return "a string of anal beads"; }
Items.Toys.AnalBeads.Short = function() { return "A string of small beads"; }
Items.Toys.AnalBeads.Long  = function() { return "A set of five small beads on a string, designed for anal play."; }
Items.Toys.AnalBeads.cock = new Cock();
Items.Toys.AnalBeads.subtype = ItemSubtype.Dildo;
Items.Toys.AnalBeads.cock.thickness.base = 3;
Items.Toys.AnalBeads.cock.length.base    = 15;

Items.Toys.LargeAnalBeads = new Item("dildo7", "L.Anal beads", ItemType.Toy);
Items.Toys.LargeAnalBeads.price = 23;
Items.Toys.LargeAnalBeads.plural = true;
Items.Toys.LargeAnalBeads.sDesc = function() { return "large anal beads"; }
Items.Toys.LargeAnalBeads.lDesc = function() { return "a string of large anal beads"; }
Items.Toys.LargeAnalBeads.Short = function() { return "A string of large beads"; }
Items.Toys.LargeAnalBeads.Long  = function() { return "A set of five large beads on a string, designed for advanced anal play."; }
Items.Toys.LargeAnalBeads.cock = new Cock();
Items.Toys.LargeAnalBeads.subtype = ItemSubtype.Dildo;
Items.Toys.LargeAnalBeads.cock.thickness.base = 8;
Items.Toys.LargeAnalBeads.cock.length.base    = 40;

Items.Toys.EquineDildo = new Item("dildo8", "Equine dildo", ItemType.Toy);
Items.Toys.EquineDildo.price = 70;
Items.Toys.EquineDildo.sDesc = function() { return "large equine dildo"; }
Items.Toys.EquineDildo.lDesc = function() { return "a large equine dildo"; }
Items.Toys.EquineDildo.Short = function() { return "An immense toy, in the shape of a horsecock"; }
Items.Toys.EquineDildo.Long  = function() { return "About twenty inches in length, the pleasure toy is only for the most spacious orifices. It comes complete with a sheath and a flared head. It is made from a slightly rubbery material."; }
Items.Toys.EquineDildo.cock = new Cock();
Items.Toys.EquineDildo.subtype = ItemSubtype.Dildo;
Items.Toys.EquineDildo.cock.thickness.base = 8;
Items.Toys.EquineDildo.cock.length.base    = 40;
Items.Toys.EquineDildo.cock.race           = Race.Horse;
Items.Toys.EquineDildo.cock.sheath         = 1;

Items.Toys.CanidDildo = new Item("dildo9", "Canine dildo", ItemType.Toy);
Items.Toys.CanidDildo.price = 70;
Items.Toys.CanidDildo.sDesc = function() { return "large knotted dildo"; }
Items.Toys.CanidDildo.lDesc = function() { return "a large knotted dildo"; }
Items.Toys.CanidDildo.Short = function() { return "An thick, knotted toy, in the shape of a canid cock"; }
Items.Toys.CanidDildo.Long  = function() { return "About fourteen inches in length, the pleasure toy is only for the most spacious orifices. It comes complete with a thick knot. It is made from a slightly rubbery material."; }
Items.Toys.CanidDildo.cock = new Cock();
Items.Toys.CanidDildo.subtype = ItemSubtype.Dildo;
Items.Toys.CanidDildo.cock.thickness.base = 7;
Items.Toys.CanidDildo.cock.length.base    = 28;
Items.Toys.CanidDildo.cock.race           = Race.Canine;
Items.Toys.CanidDildo.cock.knot           = 1;

Items.Toys.ChimeraDildo = new Item("dildo10", "Chimera", ItemType.Toy);
Items.Toys.ChimeraDildo.price = 300;
Items.Toys.ChimeraDildo.sDesc = function() { return "monstrous dildo"; }
Items.Toys.ChimeraDildo.lDesc = function() { return "a monstrous dildo"; }
Items.Toys.ChimeraDildo.Short = function() { return "An enormous toy, titled the Chimera"; }
Items.Toys.ChimeraDildo.Long  = function() { return "About twentyfive inches in length, the pleasure toy is only for the most spacious orifices. It combines the barbed head of a feline cock with the sheath of a horse and the knot of a canine. It is made from a slightly rubbery material."; }
Items.Toys.ChimeraDildo.cock = new Cock();
Items.Toys.ChimeraDildo.subtype = ItemSubtype.Dildo;
Items.Toys.ChimeraDildo.cock.thickness.base = 10;
Items.Toys.ChimeraDildo.cock.length.base    = 50;
Items.Toys.ChimeraDildo.cock.race           = Race.Feline;
Items.Toys.ChimeraDildo.cock.sheath         = 1;
Items.Toys.ChimeraDildo.cock.knot           = 1;

/*
 * IDEAS
 * 
 * An abundance of dildos -
 * Strap-ons (share inheritance with cock?)
 * Onaholes (share inheritance with vag?)
 * Butt plugs -
 * Anal beads
 * Ball gag
 * Whips (for spanking)
 * Collars
 * 
 * Magical variations (odd shop?)
 */
