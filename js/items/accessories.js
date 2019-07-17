import { Item, Items, ItemType } from '../item';

Items.Accessories = {};

Items.Accessories.CrudeBook = new Item("book0", "C.Book", ItemType.Accessory);
Items.Accessories.CrudeBook.price = 20;
Items.Accessories.CrudeBook.Short = function() { return "Crude book"; }
Items.Accessories.CrudeBook.Long = function() { return "A heavy book on a rather dry subject. Not a very interesting read."; }
Items.Accessories.CrudeBook.effect.intelligence = 2;

Items.Accessories.TrashyNovel = new Item("book1", "Trashy novel", ItemType.Accessory);
Items.Accessories.TrashyNovel.price = 20;
Items.Accessories.TrashyNovel.Short = function() { return "Trashy novel"; }
Items.Accessories.TrashyNovel.Long = function() { return "A trashy hardcore romance novel of the sort terribly bored housewives might read. Features jackal-morphs heavily."; }
Items.Accessories.TrashyNovel.effect.libido = 2;

Items.Accessories.IronBangle = new Item("bangle0", "I.Bangle", ItemType.Accessory);
Items.Accessories.IronBangle.price = 30;
Items.Accessories.IronBangle.Short = function() { return "Iron bangle"; }
Items.Accessories.IronBangle.Long = function() { return "A crude lump of iron, fashioned as a bangle. Provides minor protection from harm."; }
Items.Accessories.IronBangle.effect.maxHp = 20;

Items.Accessories.GoldEarring = new Item("ear0", "G.Earring", ItemType.Accessory);
Items.Accessories.GoldEarring.price = 30;
Items.Accessories.GoldEarring.Short = function() { return "Gold earring"; }
Items.Accessories.GoldEarring.Long = function() { return "A golden earring. Pretty, but not terribly useful in combat."; }
Items.Accessories.GoldEarring.effect.charisma = 2;

Items.Accessories.RaniFavor = new Item("neck0", "Rani's favor", ItemType.Accessory);
Items.Accessories.RaniFavor.price = 1000;
Items.Accessories.RaniFavor.Short = function() { return "Silver necklace"; }
Items.Accessories.RaniFavor.Long = function() { return "An elaborate silver necklace, gifted to you by Rani, prince of Rigard."; }
Items.Accessories.RaniFavor.effect.maxHp = 100;
Items.Accessories.RaniFavor.effect.spirit = 5;
Items.Accessories.RaniFavor.effect.charisma = 5;

Items.Accessories.LagonCrown = new Item("head0", "Lagon's crown", ItemType.Accessory);
Items.Accessories.LagonCrown.price = 1250;
Items.Accessories.LagonCrown.Short = function() { return "Lagon's crown"; }
Items.Accessories.LagonCrown.Long = function() { return "A crown once belonging to the lagomorph king."; }
Items.Accessories.LagonCrown.effect.maxHp = 120;
Items.Accessories.LagonCrown.effect.maxLust = 80;
Items.Accessories.LagonCrown.effect.strength = 4;
Items.Accessories.LagonCrown.effect.dexterity = 6;
Items.Accessories.LagonCrown.effect.libido = 3;

Items.Accessories.SimpleCuffs = new Item("cuffs0", "S.Cuffs", ItemType.Accessory);
Items.Accessories.SimpleCuffs.price = 20;
Items.Accessories.SimpleCuffs.Short = function() { return "Simple cuffs"; }
Items.Accessories.SimpleCuffs.Long = function() { return "Simple restraints."; }
Items.Accessories.SimpleCuffs.effect.maxLust = 10;
Items.Accessories.SimpleCuffs.effect.libido = 1;

Items.Accessories.IronBuckler = new Item("buckler0", "I.Buckler", ItemType.Accessory);
Items.Accessories.IronBuckler.price = 75;
Items.Accessories.IronBuckler.Short = function() { return "Iron buckler"; }
Items.Accessories.IronBuckler.Long = function() { return "A crude iron buckler, designed to protect the wearer from harm."; }
Items.Accessories.IronBuckler.effect.maxHp = 30;
Items.Accessories.IronBuckler.effect.stamina = 2;
Items.Accessories.IronBuckler.effect.spirit = 1;

Items.Accessories.SilverBuckler = new Item("buckler1", "S.Buckler", ItemType.Accessory);
Items.Accessories.SilverBuckler.price = 500;
Items.Accessories.SilverBuckler.Short = function() { return "Silvered buckler"; }
Items.Accessories.SilverBuckler.Long = function() { return "A fine, silvered buckler to be strapped to one’s off-hand. Try not to use this as a plate or mirror."; }
Items.Accessories.SilverBuckler.effect.maxHp = 120;
Items.Accessories.SilverBuckler.effect.stamina = 5;
Items.Accessories.SilverBuckler.effect.spirit = 5;

Items.Accessories.SimpleCharm = new Item("charm0", "S.Charm", ItemType.Accessory);
Items.Accessories.SimpleCharm.price = 20;
Items.Accessories.SimpleCharm.Short = function() { return "Simple charm"; }
Items.Accessories.SimpleCharm.Long = function() { return "A simple charm that disrupts harmful energies."; }
Items.Accessories.SimpleCharm.effect.spirit = 2;

Items.Accessories.GreenScentedCandle = new Item("charm1", "G.Candle", ItemType.Accessory);
Items.Accessories.GreenScentedCandle.price = 50;
Items.Accessories.GreenScentedCandle.Short = function() { return "Green scented candle"; }
Items.Accessories.GreenScentedCandle.Long = function() { return "A small scented candle fashioned with nightshade, among other ingredients. Protects the holder from poison and other forces of nature."; }
Items.Accessories.GreenScentedCandle.effect.spirit = 2;
Items.Accessories.GreenScentedCandle.effect.dmNature = 0.5;
Items.Accessories.GreenScentedCandle.effect.statusDef[StatusEffect.Venom] = 1;
