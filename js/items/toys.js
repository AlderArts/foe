Items.Toys = {};

Items.Toys.SmallDildo = new Item("dildo0", "Small dildo");
Items.Toys.SmallDildo.price = 15;
Items.Toys.SmallDildo.Short = function() { return "A small toy, in the shape of a cock"; }
Items.Toys.SmallDildo.Long  = function() { return "About fifteen cm in length, the pleasure toy could be used by just about anyone. It is made from a slighly rubbery material."; }
Items.Toys.SmallDildo.cock = new Cock();
Items.Toys.SmallDildo.cock.thickness.base = 3;
Items.Toys.SmallDildo.cock.length.base    = 15;

Items.Toys.MediumDildo = new Item("dildo1", "Medium dildo");
Items.Toys.MediumDildo.price = 25;
Items.Toys.MediumDildo.Short = function() { return "A medium sized toy, in the shape of a cock"; }
Items.Toys.MediumDildo.Long  = function() { return "About twentyfive cm in length, the pleasure toy is made for more advanced practitioners. It is made from a slighly rubbery material."; }
Items.Toys.MediumDildo.cock = new Cock();
Items.Toys.MediumDildo.cock.thickness.base = 5;
Items.Toys.MediumDildo.cock.length.base    = 25;

Items.Toys.LargeDildo = new Item("dildo2", "Large dildo");
Items.Toys.LargeDildo.price = 40;
Items.Toys.LargeDildo.Short = function() { return "A large toy, in the shape of a cock"; }
Items.Toys.LargeDildo.Long  = function() { return "About forty cm in length, the pleasure toy is only for the most spacious orifices. It is made from a slighly rubbery material."; }
Items.Toys.LargeDildo.cock = new Cock();
Items.Toys.LargeDildo.cock.thickness.base = 8;
Items.Toys.LargeDildo.cock.length.base    = 40;

Items.Toys.ThinDildo = new Item("dildo3", "Thin dildo");
Items.Toys.ThinDildo.price = 20;
Items.Toys.ThinDildo.Short = function() { return "A long, thin toy, in the shape of a cock"; }
Items.Toys.ThinDildo.Long  = function() { return "This dildo is about twenty cm in length, but relatively thin. It is made from a slighly rubbery material."; }
Items.Toys.ThinDildo.cock = new Cock();
Items.Toys.ThinDildo.cock.thickness.base = 2;
Items.Toys.ThinDildo.cock.length.base    = 20;

Items.Toys.ButtPlug = new Item("dildo4", "Buttplug");
Items.Toys.ButtPlug.price = 20;
Items.Toys.ButtPlug.Short = function() { return "A short, thick plug"; }
Items.Toys.ButtPlug.Long  = function() { return "A short, thick plug, designed for anal play. It is made from a slighly rubbery material."; }
Items.Toys.ButtPlug.cock = new Cock();
Items.Toys.ButtPlug.cock.thickness.base = 7;
Items.Toys.ButtPlug.cock.length.base    = 7;

Items.Toys.LargeButtPlug = new Item("dildo5", "L.Buttplug");
Items.Toys.LargeButtPlug.price = 40;
Items.Toys.LargeButtPlug.Short = function() { return "A large, thick plug"; }
Items.Toys.LargeButtPlug.Long  = function() { return "A large, thick plug, designed for advanced anal play. It is made from a slighly rubbery material."; }
Items.Toys.LargeButtPlug.cock = new Cock();
Items.Toys.LargeButtPlug.cock.thickness.base = 15;
Items.Toys.LargeButtPlug.cock.length.base    = 15;

Items.Toys.AnalBeads = new Item("dildo6", "Anal beads");
Items.Toys.AnalBeads.price = 18;
Items.Toys.AnalBeads.Short = function() { return "A string of small beads"; }
Items.Toys.AnalBeads.Long  = function() { return "A set of five small beads on a string, designed for anal play."; }
Items.Toys.AnalBeads.cock = new Cock();
Items.Toys.AnalBeads.cock.thickness.base = 3;
Items.Toys.AnalBeads.cock.length.base    = 15;

Items.Toys.LargeAnalBeads = new Item("dildo7", "L.Anal beads");
Items.Toys.LargeAnalBeads.price = 23;
Items.Toys.LargeAnalBeads.Short = function() { return "A string of large beads"; }
Items.Toys.LargeAnalBeads.Long  = function() { return "A set of five large beads on a string, designed for advanced anal play."; }
Items.Toys.LargeAnalBeads.cock = new Cock();
Items.Toys.LargeAnalBeads.cock.thickness.base = 8;
Items.Toys.LargeAnalBeads.cock.length.base    = 40;

Items.Toys.EquineDildo = new Item("dildo8", "Equine dildo");
Items.Toys.EquineDildo.price = 70;
Items.Toys.EquineDildo.Short = function() { return "An immense toy, in the shape of a horsecock"; }
Items.Toys.EquineDildo.Long  = function() { return "About fifty cm in length, the pleasure toy is only for the most spacious orifices. It comes complete with a sheath and a flared head. It is made from a slighly rubbery material."; }
Items.Toys.EquineDildo.cock = new Cock();
Items.Toys.EquineDildo.cock.thickness.base = 8;
Items.Toys.EquineDildo.cock.length.base    = 50;
Items.Toys.EquineDildo.cock.race           = Race.horse;
Items.Toys.EquineDildo.cock.sheath         = 1;

Items.Toys.CanidDildo = new Item("dildo9", "Canine dildo");
Items.Toys.CanidDildo.price = 70;
Items.Toys.CanidDildo.Short = function() { return "An thick, knotted toy, in the shape of a canid cock"; }
Items.Toys.CanidDildo.Long  = function() { return "About thirty cm in length, the pleasure toy is only for the most spacious orifices. It comes complete with a thick knot. It is made from a slighly rubbery material."; }
Items.Toys.CanidDildo.cock = new Cock();
Items.Toys.CanidDildo.cock.thickness.base = 7;
Items.Toys.CanidDildo.cock.length.base    = 30;
Items.Toys.CanidDildo.cock.race           = Race.dog;
Items.Toys.CanidDildo.cock.knot           = 1;

Items.Toys.ChimeraDildo = new Item("dildo8", "Chimera");
Items.Toys.ChimeraDildo.price = 300;
Items.Toys.ChimeraDildo.Short = function() { return "An enormous toy, titled the Chimera"; }
Items.Toys.ChimeraDildo.Long  = function() { return "About sixty cm in length, the pleasure toy is only for the most spacious orifices. It combines the barbed head of a feline cock with the sheath of a horse and the knot of a canine. It is made from a slighly rubbery material."; }
Items.Toys.ChimeraDildo.cock = new Cock();
Items.Toys.ChimeraDildo.cock.thickness.base = 11;
Items.Toys.ChimeraDildo.cock.length.base    = 60;
Items.Toys.ChimeraDildo.cock.race           = Race.cat;
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
