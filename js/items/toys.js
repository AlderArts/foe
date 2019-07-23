import { Item, ItemType, ItemSubtype } from '../item';
import { Cock } from '../body/cock';
import { Race } from '../body/race';

let ToysItems = {};

ToysItems.SmallDildo = new Item("dildo0", "Small dildo", ItemType.Toy);
ToysItems.SmallDildo.price = 15;
ToysItems.SmallDildo.sDesc = function() { return "small dildo"; }
ToysItems.SmallDildo.lDesc = function() { return "a small dildo"; }
ToysItems.SmallDildo.Short = function() { return "A small toy, in the shape of a cock"; }
ToysItems.SmallDildo.Long  = function() { return "About six inches in length, the pleasure toy could be used by just about anyone. It is made from a slightly rubbery material."; }
ToysItems.SmallDildo.cock = new Cock();
ToysItems.SmallDildo.subtype = ItemSubtype.Dildo;
ToysItems.SmallDildo.cock.thickness.base = 3;
ToysItems.SmallDildo.cock.length.base    = 12;

ToysItems.MediumDildo = new Item("dildo1", "Medium dildo", ItemType.Toy);
ToysItems.MediumDildo.price = 25;
ToysItems.MediumDildo.sDesc = function() { return "dildo"; }
ToysItems.MediumDildo.lDesc = function() { return "a dildo"; }
ToysItems.MediumDildo.Short = function() { return "A medium sized toy, in the shape of a cock"; }
ToysItems.MediumDildo.Long  = function() { return "About ten inches in length, the pleasure toy is made for more advanced practitioners. It is made from a slightly rubbery material."; }
ToysItems.MediumDildo.cock = new Cock();
ToysItems.MediumDildo.subtype = ItemSubtype.Dildo;
ToysItems.MediumDildo.cock.thickness.base = 5;
ToysItems.MediumDildo.cock.length.base    = 20;

ToysItems.LargeDildo = new Item("dildo2", "Large dildo", ItemType.Toy);
ToysItems.LargeDildo.price = 40;
ToysItems.LargeDildo.sDesc = function() { return "large dildo"; }
ToysItems.LargeDildo.lDesc = function() { return "a large dildo"; }
ToysItems.LargeDildo.Short = function() { return "A large toy, in the shape of a cock"; }
ToysItems.LargeDildo.Long  = function() { return "About eighteen inches in length, the pleasure toy is only for the most spacious orifices. It is made from a slightly rubbery material."; }
ToysItems.LargeDildo.cock = new Cock();
ToysItems.LargeDildo.subtype = ItemSubtype.Dildo;
ToysItems.LargeDildo.cock.thickness.base = 8;
ToysItems.LargeDildo.cock.length.base    = 36;

ToysItems.ThinDildo = new Item("dildo3", "Thin dildo", ItemType.Toy);
ToysItems.ThinDildo.price = 20;
ToysItems.ThinDildo.sDesc = function() { return "thin dildo"; }
ToysItems.ThinDildo.lDesc = function() { return "a thin dildo"; }
ToysItems.ThinDildo.Short = function() { return "A long, thin toy, in the shape of a cock"; }
ToysItems.ThinDildo.Long  = function() { return "This dildo is about eight inches in length, but relatively thin. It is made from a slightly rubbery material."; }
ToysItems.ThinDildo.cock = new Cock();
ToysItems.ThinDildo.subtype = ItemSubtype.Dildo;
ToysItems.ThinDildo.cock.thickness.base = 2;
ToysItems.ThinDildo.cock.length.base    = 16;

ToysItems.ButtPlug = new Item("dildo4", "Buttplug", ItemType.Toy);
ToysItems.ButtPlug.price = 20;
ToysItems.ButtPlug.sDesc = function() { return "buttplug"; }
ToysItems.ButtPlug.lDesc = function() { return "a buttplug"; }
ToysItems.ButtPlug.Short = function() { return "A short, thick plug"; }
ToysItems.ButtPlug.Long  = function() { return "A short, thick plug, designed for anal play. It is made from a slightly rubbery material."; }
ToysItems.ButtPlug.cock = new Cock();
ToysItems.ButtPlug.subtype = ItemSubtype.Dildo;
ToysItems.ButtPlug.cock.thickness.base = 7;
ToysItems.ButtPlug.cock.length.base    = 7;

ToysItems.LargeButtPlug = new Item("dildo5", "L.Buttplug", ItemType.Toy);
ToysItems.LargeButtPlug.price = 40;
ToysItems.LargeButtPlug.sDesc = function() { return "large buttplug"; }
ToysItems.LargeButtPlug.lDesc = function() { return "a large buttplug"; }
ToysItems.LargeButtPlug.Short = function() { return "A large, thick plug"; }
ToysItems.LargeButtPlug.Long  = function() { return "A large, thick plug, designed for advanced anal play. It is made from a slightly rubbery material."; }
ToysItems.LargeButtPlug.cock = new Cock();
ToysItems.LargeButtPlug.subtype = ItemSubtype.Dildo;
ToysItems.LargeButtPlug.cock.thickness.base = 15;
ToysItems.LargeButtPlug.cock.length.base    = 15;

ToysItems.AnalBeads = new Item("dildo6", "Anal beads", ItemType.Toy);
ToysItems.AnalBeads.price = 18;
ToysItems.AnalBeads.plural = true;
ToysItems.AnalBeads.sDesc = function() { return "anal beads"; }
ToysItems.AnalBeads.lDesc = function() { return "a string of anal beads"; }
ToysItems.AnalBeads.Short = function() { return "A string of small beads"; }
ToysItems.AnalBeads.Long  = function() { return "A set of five small beads on a string, designed for anal play."; }
ToysItems.AnalBeads.cock = new Cock();
ToysItems.AnalBeads.subtype = ItemSubtype.Dildo;
ToysItems.AnalBeads.cock.thickness.base = 3;
ToysItems.AnalBeads.cock.length.base    = 15;

ToysItems.LargeAnalBeads = new Item("dildo7", "L.Anal beads", ItemType.Toy);
ToysItems.LargeAnalBeads.price = 23;
ToysItems.LargeAnalBeads.plural = true;
ToysItems.LargeAnalBeads.sDesc = function() { return "large anal beads"; }
ToysItems.LargeAnalBeads.lDesc = function() { return "a string of large anal beads"; }
ToysItems.LargeAnalBeads.Short = function() { return "A string of large beads"; }
ToysItems.LargeAnalBeads.Long  = function() { return "A set of five large beads on a string, designed for advanced anal play."; }
ToysItems.LargeAnalBeads.cock = new Cock();
ToysItems.LargeAnalBeads.subtype = ItemSubtype.Dildo;
ToysItems.LargeAnalBeads.cock.thickness.base = 8;
ToysItems.LargeAnalBeads.cock.length.base    = 40;

ToysItems.EquineDildo = new Item("dildo8", "Equine dildo", ItemType.Toy);
ToysItems.EquineDildo.price = 70;
ToysItems.EquineDildo.sDesc = function() { return "large equine dildo"; }
ToysItems.EquineDildo.lDesc = function() { return "a large equine dildo"; }
ToysItems.EquineDildo.Short = function() { return "An immense toy, in the shape of a horsecock"; }
ToysItems.EquineDildo.Long  = function() { return "About twenty inches in length, the pleasure toy is only for the most spacious orifices. It comes complete with a sheath and a flared head. It is made from a slightly rubbery material."; }
ToysItems.EquineDildo.cock = new Cock();
ToysItems.EquineDildo.subtype = ItemSubtype.Dildo;
ToysItems.EquineDildo.cock.thickness.base = 8;
ToysItems.EquineDildo.cock.length.base    = 40;
ToysItems.EquineDildo.cock.race           = Race.Horse;
ToysItems.EquineDildo.cock.sheath         = 1;

ToysItems.CanidDildo = new Item("dildo9", "Canine dildo", ItemType.Toy);
ToysItems.CanidDildo.price = 70;
ToysItems.CanidDildo.sDesc = function() { return "large knotted dildo"; }
ToysItems.CanidDildo.lDesc = function() { return "a large knotted dildo"; }
ToysItems.CanidDildo.Short = function() { return "An thick, knotted toy, in the shape of a canid cock"; }
ToysItems.CanidDildo.Long  = function() { return "About fourteen inches in length, the pleasure toy is only for the most spacious orifices. It comes complete with a thick knot. It is made from a slightly rubbery material."; }
ToysItems.CanidDildo.cock = new Cock();
ToysItems.CanidDildo.subtype = ItemSubtype.Dildo;
ToysItems.CanidDildo.cock.thickness.base = 7;
ToysItems.CanidDildo.cock.length.base    = 28;
ToysItems.CanidDildo.cock.race           = Race.Canine;
ToysItems.CanidDildo.cock.knot           = 1;

ToysItems.ChimeraDildo = new Item("dildo10", "Chimera", ItemType.Toy);
ToysItems.ChimeraDildo.price = 300;
ToysItems.ChimeraDildo.sDesc = function() { return "monstrous dildo"; }
ToysItems.ChimeraDildo.lDesc = function() { return "a monstrous dildo"; }
ToysItems.ChimeraDildo.Short = function() { return "An enormous toy, titled the Chimera"; }
ToysItems.ChimeraDildo.Long  = function() { return "About twentyfive inches in length, the pleasure toy is only for the most spacious orifices. It combines the barbed head of a feline cock with the sheath of a horse and the knot of a canine. It is made from a slightly rubbery material."; }
ToysItems.ChimeraDildo.cock = new Cock();
ToysItems.ChimeraDildo.subtype = ItemSubtype.Dildo;
ToysItems.ChimeraDildo.cock.thickness.base = 10;
ToysItems.ChimeraDildo.cock.length.base    = 50;
ToysItems.ChimeraDildo.cock.race           = Race.Feline;
ToysItems.ChimeraDildo.cock.sheath         = 1;
ToysItems.ChimeraDildo.cock.knot           = 1;

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

export { ToysItems };
