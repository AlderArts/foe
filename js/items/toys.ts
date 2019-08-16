import { Race } from "../body/race";
import { ItemSubtype } from "../item";
import { ItemToy } from "./toy-item";

const smallDildo = new ItemToy("dildo0", "Small dildo", ItemSubtype.Dildo);
smallDildo.price = 15;
smallDildo.sDesc = () => "small dildo";
smallDildo.lDesc = () => "a small dildo";
smallDildo.Short = () => "A small toy, in the shape of a cock";
smallDildo.Long  = () => "About six inches in length, the pleasure toy could be used by just about anyone. It is made from a slightly rubbery material.";
smallDildo.cock.thickness.base = 3;
smallDildo.cock.length.base    = 12;

const mediumDildo = new ItemToy("dildo1", "Medium dildo", ItemSubtype.Dildo);
mediumDildo.price = 25;
mediumDildo.sDesc = () => "dildo";
mediumDildo.lDesc = () => "a dildo";
mediumDildo.Short = () => "A medium sized toy, in the shape of a cock";
mediumDildo.Long  = () => "About ten inches in length, the pleasure toy is made for more advanced practitioners. It is made from a slightly rubbery material.";
mediumDildo.cock.thickness.base = 5;
mediumDildo.cock.length.base    = 20;

const largeDildo = new ItemToy("dildo2", "Large dildo", ItemSubtype.Dildo);
largeDildo.price = 40;
largeDildo.sDesc = () => "large dildo";
largeDildo.lDesc = () => "a large dildo";
largeDildo.Short = () => "A large toy, in the shape of a cock";
largeDildo.Long  = () => "About eighteen inches in length, the pleasure toy is only for the most spacious orifices. It is made from a slightly rubbery material.";
largeDildo.cock.thickness.base = 8;
largeDildo.cock.length.base    = 36;

const thinDildo = new ItemToy("dildo3", "Thin dildo", ItemSubtype.Dildo);
thinDildo.price = 20;
thinDildo.sDesc = () => "thin dildo";
thinDildo.lDesc = () => "a thin dildo";
thinDildo.Short = () => "A long, thin toy, in the shape of a cock";
thinDildo.Long  = () => "This dildo is about eight inches in length, but relatively thin. It is made from a slightly rubbery material.";
thinDildo.cock.thickness.base = 2;
thinDildo.cock.length.base    = 16;

const buttPlug = new ItemToy("dildo4", "Buttplug", ItemSubtype.Dildo);
buttPlug.price = 20;
buttPlug.sDesc = () => "buttplug";
buttPlug.lDesc = () => "a buttplug";
buttPlug.Short = () => "A short, thick plug";
buttPlug.Long  = () => "A short, thick plug, designed for anal play. It is made from a slightly rubbery material.";
buttPlug.cock.thickness.base = 7;
buttPlug.cock.length.base    = 7;

const largeButtPlug = new ItemToy("dildo5", "L.Buttplug", ItemSubtype.Dildo);
largeButtPlug.price = 40;
largeButtPlug.sDesc = () => "large buttplug";
largeButtPlug.lDesc = () => "a large buttplug";
largeButtPlug.Short = () => "A large, thick plug";
largeButtPlug.Long  = () => "A large, thick plug, designed for advanced anal play. It is made from a slightly rubbery material.";
largeButtPlug.cock.thickness.base = 15;
largeButtPlug.cock.length.base    = 15;

const analBeads = new ItemToy("dildo6", "Anal beads", ItemSubtype.Dildo);
analBeads.price = 18;
analBeads.plural = true;
analBeads.sDesc = () => "anal beads";
analBeads.lDesc = () => "a string of anal beads";
analBeads.Short = () => "A string of small beads";
analBeads.Long  = () => "A set of five small beads on a string, designed for anal play.";
analBeads.cock.thickness.base = 3;
analBeads.cock.length.base    = 15;

const largeAnalBeads = new ItemToy("dildo7", "L.Anal beads", ItemSubtype.Dildo);
largeAnalBeads.price = 23;
largeAnalBeads.plural = true;
largeAnalBeads.sDesc = () => "large anal beads";
largeAnalBeads.lDesc = () => "a string of large anal beads";
largeAnalBeads.Short = () => "A string of large beads";
largeAnalBeads.Long  = () => "A set of five large beads on a string, designed for advanced anal play.";
largeAnalBeads.cock.thickness.base = 8;
largeAnalBeads.cock.length.base    = 40;

const equineDildo = new ItemToy("dildo8", "Equine dildo", ItemSubtype.Dildo);
equineDildo.price = 70;
equineDildo.sDesc = () => "large equine dildo";
equineDildo.lDesc = () => "a large equine dildo";
equineDildo.Short = () => "An immense toy, in the shape of a horsecock";
equineDildo.Long  = () => "About twenty inches in length, the pleasure toy is only for the most spacious orifices. It comes complete with a sheath and a flared head. It is made from a slightly rubbery material.";
equineDildo.cock.thickness.base = 8;
equineDildo.cock.length.base    = 40;
equineDildo.cock.race           = Race.Horse;

const canidDildo = new ItemToy("dildo9", "Canine dildo", ItemSubtype.Dildo);
canidDildo.price = 70;
canidDildo.sDesc = () => "large knotted dildo";
canidDildo.lDesc = () => "a large knotted dildo";
canidDildo.Short = () => "An thick, knotted toy, in the shape of a canid cock";
canidDildo.Long  = () => "About fourteen inches in length, the pleasure toy is only for the most spacious orifices. It comes complete with a thick knot. It is made from a slightly rubbery material.";
canidDildo.cock.thickness.base = 7;
canidDildo.cock.length.base    = 28;
canidDildo.cock.race           = Race.Canine;
canidDildo.cock.knot           = 1;

const chimeraDildo = new ItemToy("dildo10", "Chimera", ItemSubtype.Dildo);
chimeraDildo.price = 300;
chimeraDildo.sDesc = () => "monstrous dildo";
chimeraDildo.lDesc = () => "a monstrous dildo";
chimeraDildo.Short = () => "An enormous toy, titled the Chimera";
chimeraDildo.Long  = () => "About twentyfive inches in length, the pleasure toy is only for the most spacious orifices. It combines the barbed head of a feline cock with the sheath of a horse and the knot of a canine. It is made from a slightly rubbery material.";
chimeraDildo.cock.thickness.base = 10;
chimeraDildo.cock.length.base    = 50;
chimeraDildo.cock.race           = Race.Feline;
chimeraDildo.cock.knot           = 1;

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

export namespace ToysItems {
    export const SmallDildo = smallDildo;
    export const MediumDildo = mediumDildo;
    export const LargeDildo = largeDildo;
    export const ThinDildo = thinDildo;
    export const ButtPlug = buttPlug;
    export const LargeButtPlug = largeButtPlug;
    export const AnalBeads = analBeads;
    export const LargeAnalBeads = largeAnalBeads;
    export const EquineDildo = equineDildo;
    export const CanidDildo = canidDildo;
    export const ChimeraDildo = chimeraDildo;
}
