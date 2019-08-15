import { Item, ItemType } from "../item";
import { StatusEffect } from "../statuseffect";

const crudeBook = new Item("book0", "C.Book", ItemType.Accessory);
crudeBook.price = 20;
crudeBook.Short = function() { return "Crude book"; };
crudeBook.Long = function() { return "A heavy book on a rather dry subject. Not a very interesting read."; };
crudeBook.effect.intelligence = 2;

const trashyNovel = new Item("book1", "Trashy novel", ItemType.Accessory);
trashyNovel.price = 20;
trashyNovel.Short = function() { return "Trashy novel"; };
trashyNovel.Long = function() { return "A trashy hardcore romance novel of the sort terribly bored housewives might read. Features jackal-morphs heavily."; };
trashyNovel.effect.libido = 2;

const ironBangle = new Item("bangle0", "I.Bangle", ItemType.Accessory);
ironBangle.price = 30;
ironBangle.Short = function() { return "Iron bangle"; };
ironBangle.Long = function() { return "A crude lump of iron, fashioned as a bangle. Provides minor protection from harm."; };
ironBangle.effect.maxHp = 20;

const goldEarring = new Item("ear0", "G.Earring", ItemType.Accessory);
goldEarring.price = 30;
goldEarring.Short = function() { return "Gold earring"; };
goldEarring.Long = function() { return "A golden earring. Pretty, but not terribly useful in combat."; };
goldEarring.effect.charisma = 2;

const raniFavor = new Item("neck0", "Rani's favor", ItemType.Accessory);
raniFavor.price = 1000;
raniFavor.Short = function() { return "Silver necklace"; };
raniFavor.Long = function() { return "An elaborate silver necklace, gifted to you by Rani, prince of Rigard."; };
raniFavor.effect.maxHp = 100;
raniFavor.effect.spirit = 5;
raniFavor.effect.charisma = 5;

const lagonCrown = new Item("head0", "Lagon's crown", ItemType.Accessory);
lagonCrown.price = 1250;
lagonCrown.Short = function() { return "Lagon's crown"; };
lagonCrown.Long = function() { return "A crown once belonging to the lagomorph king."; };
lagonCrown.effect.maxHp = 120;
lagonCrown.effect.maxLust = 80;
lagonCrown.effect.strength = 4;
lagonCrown.effect.dexterity = 6;
lagonCrown.effect.libido = 3;

const simpleCuffs = new Item("cuffs0", "S.Cuffs", ItemType.Accessory);
simpleCuffs.price = 20;
simpleCuffs.Short = function() { return "Simple cuffs"; };
simpleCuffs.Long = function() { return "Simple restraints."; };
simpleCuffs.effect.maxLust = 10;
simpleCuffs.effect.libido = 1;

const ironBuckler = new Item("buckler0", "I.Buckler", ItemType.Accessory);
ironBuckler.price = 75;
ironBuckler.Short = function() { return "Iron buckler"; };
ironBuckler.Long = function() { return "A crude iron buckler, designed to protect the wearer from harm."; };
ironBuckler.effect.maxHp = 30;
ironBuckler.effect.stamina = 2;
ironBuckler.effect.spirit = 1;

const silverBuckler = new Item("buckler1", "S.Buckler", ItemType.Accessory);
silverBuckler.price = 500;
silverBuckler.Short = function() { return "Silvered buckler"; };
silverBuckler.Long = function() { return "A fine, silvered buckler to be strapped to one’s off-hand. Try not to use this as a plate or mirror."; };
silverBuckler.effect.maxHp = 120;
silverBuckler.effect.stamina = 5;
silverBuckler.effect.spirit = 5;

const simpleCharm = new Item("charm0", "S.Charm", ItemType.Accessory);
simpleCharm.price = 20;
simpleCharm.Short = function() { return "Simple charm"; };
simpleCharm.Long = function() { return "A simple charm that disrupts harmful energies."; };
simpleCharm.effect.spirit = 2;

const greenScentedCandle = new Item("charm1", "G.Candle", ItemType.Accessory);
greenScentedCandle.price = 50;
greenScentedCandle.Short = function() { return "Green scented candle"; };
greenScentedCandle.Long = function() { return "A small scented candle fashioned with nightshade, among other ingredients. Protects the holder from poison and other forces of nature."; };
greenScentedCandle.effect.spirit = 2;
greenScentedCandle.effect.dmNature = 0.5;
greenScentedCandle.effect.statusDef[StatusEffect.Venom] = 1;

export namespace AccItems {
    export const CrudeBook = crudeBook;
    export const TrashyNovel = trashyNovel;
    export const IronBangle = ironBangle;
    export const GoldEarring = goldEarring;
    export const RaniFavor = raniFavor;
    export const LagonCrown = lagonCrown;
    export const SimpleCuffs = simpleCuffs;
    export const IronBuckler = ironBuckler;
    export const SilverBuckler = silverBuckler;
    export const SimpleCharm = simpleCharm;
    export const GreenScentedCandle = greenScentedCandle;
}
