Items.Accessories = {};

Items.Accessories.CrudeBook = new Item("book0", "C.Book");
Items.Accessories.CrudeBook.price = 20;
Items.Accessories.CrudeBook.Short = function() { return "crude book"; }
Items.Accessories.CrudeBook.Long = function() { return "a heavy book on a rather dry subject. Not a very interesting read."; }
Items.Accessories.CrudeBook.EquipType = ItemType.Accessory;
Items.Accessories.CrudeBook.effect.intelligence = 1;

Items.Accessories.IronBangle = new Item("bangle0", "I.Bangle");
Items.Accessories.IronBangle.price = 30;
Items.Accessories.IronBangle.Short = function() { return "iron bangle"; }
Items.Accessories.IronBangle.Long = function() { return "a crude lump of iron, fashioned as a bangle. Provides minor protection from harm."; }
Items.Accessories.IronBangle.EquipType = ItemType.Accessory;
Items.Accessories.IronBangle.effect.maxHp = 20;

Items.Accessories.SimpleCuffs = new Item("cuffs0", "S.Cuffs");
Items.Accessories.SimpleCuffs.price = 20;
Items.Accessories.SimpleCuffs.Short = function() { return "simple cuffs"; }
Items.Accessories.SimpleCuffs.Long = function() { return "simple restraints"; }
Items.Accessories.SimpleCuffs.EquipType = ItemType.Accessory;
Items.Accessories.SimpleCuffs.effect.maxLust = 10;
Items.Accessories.SimpleCuffs.effect.libido = 1;

