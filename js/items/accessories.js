import { Item, ItemType } from '../item';
import { StatusEffect } from '../statuseffect';

let AccItems = {};

AccItems.CrudeBook = new Item("book0", "C.Book", ItemType.Accessory);
AccItems.CrudeBook.price = 20;
AccItems.CrudeBook.Short = function() { return "Crude book"; }
AccItems.CrudeBook.Long = function() { return "A heavy book on a rather dry subject. Not a very interesting read."; }
AccItems.CrudeBook.effect.intelligence = 2;

AccItems.TrashyNovel = new Item("book1", "Trashy novel", ItemType.Accessory);
AccItems.TrashyNovel.price = 20;
AccItems.TrashyNovel.Short = function() { return "Trashy novel"; }
AccItems.TrashyNovel.Long = function() { return "A trashy hardcore romance novel of the sort terribly bored housewives might read. Features jackal-morphs heavily."; }
AccItems.TrashyNovel.effect.libido = 2;

AccItems.IronBangle = new Item("bangle0", "I.Bangle", ItemType.Accessory);
AccItems.IronBangle.price = 30;
AccItems.IronBangle.Short = function() { return "Iron bangle"; }
AccItems.IronBangle.Long = function() { return "A crude lump of iron, fashioned as a bangle. Provides minor protection from harm."; }
AccItems.IronBangle.effect.maxHp = 20;

AccItems.GoldEarring = new Item("ear0", "G.Earring", ItemType.Accessory);
AccItems.GoldEarring.price = 30;
AccItems.GoldEarring.Short = function() { return "Gold earring"; }
AccItems.GoldEarring.Long = function() { return "A golden earring. Pretty, but not terribly useful in combat."; }
AccItems.GoldEarring.effect.charisma = 2;

AccItems.RaniFavor = new Item("neck0", "Rani's favor", ItemType.Accessory);
AccItems.RaniFavor.price = 1000;
AccItems.RaniFavor.Short = function() { return "Silver necklace"; }
AccItems.RaniFavor.Long = function() { return "An elaborate silver necklace, gifted to you by Rani, prince of Rigard."; }
AccItems.RaniFavor.effect.maxHp = 100;
AccItems.RaniFavor.effect.spirit = 5;
AccItems.RaniFavor.effect.charisma = 5;

AccItems.LagonCrown = new Item("head0", "Lagon's crown", ItemType.Accessory);
AccItems.LagonCrown.price = 1250;
AccItems.LagonCrown.Short = function() { return "Lagon's crown"; }
AccItems.LagonCrown.Long = function() { return "A crown once belonging to the lagomorph king."; }
AccItems.LagonCrown.effect.maxHp = 120;
AccItems.LagonCrown.effect.maxLust = 80;
AccItems.LagonCrown.effect.strength = 4;
AccItems.LagonCrown.effect.dexterity = 6;
AccItems.LagonCrown.effect.libido = 3;

AccItems.SimpleCuffs = new Item("cuffs0", "S.Cuffs", ItemType.Accessory);
AccItems.SimpleCuffs.price = 20;
AccItems.SimpleCuffs.Short = function() { return "Simple cuffs"; }
AccItems.SimpleCuffs.Long = function() { return "Simple restraints."; }
AccItems.SimpleCuffs.effect.maxLust = 10;
AccItems.SimpleCuffs.effect.libido = 1;

AccItems.IronBuckler = new Item("buckler0", "I.Buckler", ItemType.Accessory);
AccItems.IronBuckler.price = 75;
AccItems.IronBuckler.Short = function() { return "Iron buckler"; }
AccItems.IronBuckler.Long = function() { return "A crude iron buckler, designed to protect the wearer from harm."; }
AccItems.IronBuckler.effect.maxHp = 30;
AccItems.IronBuckler.effect.stamina = 2;
AccItems.IronBuckler.effect.spirit = 1;

AccItems.SilverBuckler = new Item("buckler1", "S.Buckler", ItemType.Accessory);
AccItems.SilverBuckler.price = 500;
AccItems.SilverBuckler.Short = function() { return "Silvered buckler"; }
AccItems.SilverBuckler.Long = function() { return "A fine, silvered buckler to be strapped to one’s off-hand. Try not to use this as a plate or mirror."; }
AccItems.SilverBuckler.effect.maxHp = 120;
AccItems.SilverBuckler.effect.stamina = 5;
AccItems.SilverBuckler.effect.spirit = 5;

AccItems.SimpleCharm = new Item("charm0", "S.Charm", ItemType.Accessory);
AccItems.SimpleCharm.price = 20;
AccItems.SimpleCharm.Short = function() { return "Simple charm"; }
AccItems.SimpleCharm.Long = function() { return "A simple charm that disrupts harmful energies."; }
AccItems.SimpleCharm.effect.spirit = 2;

AccItems.GreenScentedCandle = new Item("charm1", "G.Candle", ItemType.Accessory);
AccItems.GreenScentedCandle.price = 50;
AccItems.GreenScentedCandle.Short = function() { return "Green scented candle"; }
AccItems.GreenScentedCandle.Long = function() { return "A small scented candle fashioned with nightshade, among other ingredients. Protects the holder from poison and other forces of nature."; }
AccItems.GreenScentedCandle.effect.spirit = 2;
AccItems.GreenScentedCandle.effect.dmNature = 0.5;
AccItems.GreenScentedCandle.effect.statusDef[StatusEffect.Venom] = 1;

export { AccItems };
