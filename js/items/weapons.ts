import { Item, ItemType } from '../item';

let dagger = new Item("dag0", "Dagger", ItemType.Weapon);
dagger.price = 15;
dagger.sDesc = function() { return "dagger"; }
dagger.lDesc = function() { return "a simple dagger"; }
dagger.Short = function() { return "Dagger"; }
dagger.Long = function() { return "A simple dagger."; }
dagger.effect.atkMod  = 0.1;
dagger.effect.dexterity = 1;
dagger.effect.apPierce = 1;

let golClaw = new Item("dag1", "Gol claw", ItemType.Weapon);
golClaw.price = 750;
golClaw.sDesc = function() { return "Gol claw"; }
golClaw.lDesc = function() { return "a dagger fashioned out of a Gol claw"; }
golClaw.Short = function() { return "Gol claw"; }
golClaw.Long = function() { return "A dagger fashioned out of a Gol claw."; }
golClaw.effect.atkMod    = 0.6;
golClaw.effect.strength  = 2;
golClaw.effect.stamina   = 2;
golClaw.effect.dexterity = 10;
golClaw.effect.apPierce  = 1;
golClaw.effect.apSlash   = 0.5;

let shortSword = new Item("swrd0", "S.Sword", ItemType.Weapon);
shortSword.price = 50;
shortSword.sDesc = function() { return "short sword"; }
shortSword.lDesc = function() { return "a simple short sword"; }
shortSword.Short = function() { return "Short sword"; }
shortSword.Long = function() { return "A simple short sword."; }
shortSword.effect.atkMod = 0.1;
shortSword.effect.strength = 1;
shortSword.effect.apSlash = 1;

let krawitzSword = new Item("swrd1", "K.Sword", ItemType.Weapon);
krawitzSword.price = 2000;
krawitzSword.sDesc = function() { return "fine rapier"; }
krawitzSword.lDesc = function() { return "Krawitz' fine rapier"; }
krawitzSword.Short = function() { return "Fine rapier"; }
krawitzSword.Long = function() { return "Krawitz' fine rapier."; }
krawitzSword.effect.atkMod    = 0.7;
krawitzSword.effect.strength  = 3;
krawitzSword.effect.dexterity = 10;
krawitzSword.effect.apPierce  = 1;

let greatSword = new Item("swrd2", "G.Sword", ItemType.Weapon);
greatSword.price = 100;
greatSword.sDesc = function() { return "greatsword"; }
greatSword.lDesc = function() { return "a large greatsword"; }
greatSword.Short = function() { return "Greatsword"; }
greatSword.Long = function() { return "A large greatsword."; }
greatSword.effect.atkMod = 1;
greatSword.effect.strength = 4;
greatSword.effect.apSlash = 1;

let rapier = new Item("swrd3", "Rapier", ItemType.Weapon);
rapier.price = 75;
rapier.sDesc = function() { return "rapier"; }
rapier.lDesc = function() { return "a rapier"; }
rapier.Short = function() { return "Rapier"; }
rapier.Long = function() { return "A sharp rapier."; }
rapier.effect.atkMod    = 0.1;
rapier.effect.dexterity = 2;
rapier.effect.apPierce  = 1;

let jeweledMageblade = new Item("swrd4", "J.Mageblade", ItemType.Weapon);
jeweledMageblade.price = 1500;
jeweledMageblade.sDesc = function() { return "jeweled mageblade"; }
jeweledMageblade.lDesc = function() { return "a short sword with rubies inlaid in the crossguard"; }
jeweledMageblade.Short = function() { return "Jeweled mageblade"; }
jeweledMageblade.Long = function() { return "A short sword with rubies inlaid in the crossguard. Brief concentration on the part of the wielder causes the edge to erupt in flame."; }
jeweledMageblade.effect.atkMod = 0.5;
jeweledMageblade.effect.maxSp = 100;
jeweledMageblade.effect.intelligence = 7;
jeweledMageblade.effect.spirit = 3;
jeweledMageblade.effect.apSlash = 1;
jeweledMageblade.effect.amFire = 0.5;

let woodenStaff = new Item("staff0", "Staff", ItemType.Weapon);
woodenStaff.price = 15;
woodenStaff.sDesc = function() { return "wooden staff"; }
woodenStaff.lDesc = function() { return "a simple wooden staff"; }
woodenStaff.Short = function() { return "Wooden staff"; }
woodenStaff.Long = function() { return "A simple wooden staff."; }
woodenStaff.effect.atkMod = 0;
woodenStaff.effect.intelligence = 1;
woodenStaff.effect.apBlunt = 1;

let mageStaff = new Item("staff1", "M.Staff", ItemType.Weapon);
mageStaff.price = 200;
mageStaff.sDesc = function() { return "magician's staff"; }
mageStaff.lDesc = function() { return "a magician's staff"; }
mageStaff.Short = function() { return "Magician's staff"; }
mageStaff.Long = function() { return "A magician's staff."; }
mageStaff.effect.atkMod = 0.2;
mageStaff.effect.intelligence = 5;
mageStaff.effect.spirit = 3;
mageStaff.effect.apBlunt = 1;

let amberStaff = new Item("staff2", "A.Staff", ItemType.Weapon);
amberStaff.price = 1000;
amberStaff.sDesc = function() { return "amber staff"; }
amberStaff.lDesc = function() { return "an old amber staff"; }
amberStaff.Short = function() { return "Old amber staff"; }
amberStaff.Long = function() { return "A weathered staff with a knob made of amber. While old, it’s still useful as a conduit for electrical energies."; }
amberStaff.effect.atkMod = 0.5;
amberStaff.effect.intelligence = 10;
amberStaff.effect.spirit = 10;
amberStaff.effect.apBlunt = 0.5;
amberStaff.effect.amThunder = 0.5;

let lWhip = new Item("whip0", "L.Whip", ItemType.Weapon);
lWhip.price = 30;
lWhip.sDesc = function() { return "leather whip"; }
lWhip.lDesc = function() { return "a simple leather whip"; }
lWhip.Short = function() { return "Leather whip"; }
lWhip.Long = function() { return "A simple leather whip."; }
lWhip.effect.atkMod  = 0;
lWhip.effect.libido  = 1;
lWhip.effect.apSlash = 1;

let vineWhip = new Item("whip1", "V.Whip", ItemType.Weapon);
vineWhip.price = 300;
vineWhip.sDesc = function() { return "vine whip"; }
vineWhip.lDesc = function() { return "a whip made of vines"; }
vineWhip.Short = function() { return "Vine whip"; }
vineWhip.Long = function() { return "A whip made of vines."; }
vineWhip.effect.atkMod  = 0.2;
vineWhip.effect.libido  = 5;
vineWhip.effect.charisma = 3;
vineWhip.effect.apSlash = 1;
vineWhip.effect.amNature = 0.5;

let golWhip = new Item("whip2", "G.Whip", ItemType.Weapon);
golWhip.price = 900;
golWhip.sDesc = function() { return "Gol whip"; }
golWhip.lDesc = function() { return "a whip dripping with Gol venom"; }
golWhip.Short = function() { return "Gol whip"; }
golWhip.Long = function() { return "A whip dripping with Gol venom."; }
golWhip.effect.maxLust = 100;
golWhip.effect.atkMod  = 0.8;
golWhip.effect.libido  = 9;
golWhip.effect.charisma = 5;
golWhip.effect.apSlash = 1;
golWhip.effect.amNature = 0.5;
golWhip.effect.alust = 0.5;

let oakSpear = new Item("spear0", "Oak Spear", ItemType.Weapon);
oakSpear.price = 85;
oakSpear.sDesc = function() { return "oak spear"; }
oakSpear.lDesc = function() { return "an oak spear"; }
oakSpear.Short = function() { return "Oak spear"; }
oakSpear.Long = function() { return "A shaft of treated wood with a pointed tip attached. Good for the defensive fighter in keeping your distance."; }
oakSpear.effect.atkMod   = 0.2;
oakSpear.effect.defMod   = 0.2;
oakSpear.effect.apPierce = 1;

let halberd = new Item("spear1", "Halberd", ItemType.Weapon);
halberd.price = 115;
halberd.sDesc = function() { return "halberd"; }
halberd.lDesc = function() { return "a halberd"; }
halberd.Short = function() { return "Halberd"; }
halberd.Long = function() { return "Like a spear, but it slashes, too!"; }
halberd.effect.atkMod   = 0.3;
halberd.effect.defMod   = 0.3;
halberd.effect.apPierce = 0.5;
halberd.effect.apSlash  = 0.5;

let heavyFlail = new Item("flail0", "Heavy flail", ItemType.Weapon);
heavyFlail.price = 125;
heavyFlail.sDesc = function() { return "heavy flail"; }
heavyFlail.lDesc = function() { return "a heavy flail"; }
heavyFlail.Short = function() { return "Heavy flail"; }
heavyFlail.Long = function() { return "A spiked wrecking ball on a stick for the offensively oriented. Hampers your ability to defend yourself, but grants considerable attacking momentum."; }
heavyFlail.effect.atkMod    = 0.5;
heavyFlail.effect.defMod    = -0.1;
heavyFlail.effect.apBlunt   = 0.8;
heavyFlail.effect.apPierce  = 0.2;
heavyFlail.effect.dexterity = 2;
heavyFlail.effect.strength  = 2;

let warHammer = new Item("hammer0", "Warhammer", ItemType.Weapon);
warHammer.price = 125;
warHammer.sDesc = function() { return "warhammer"; }
warHammer.lDesc = function() { return "a warhammer"; }
warHammer.Short = function() { return "Warhammer"; }
warHammer.Long = function() { return "Unwieldy, but learn to hold this thing right and you’ll be popping skulls like overripe fruit."; }
warHammer.effect.atkMod    = 0.6;
warHammer.effect.apBlunt   = 1;
warHammer.effect.dexterity = -1;
warHammer.effect.strength  = 4;

export namespace WeaponsItems {
    export const Dagger = dagger;
    export const GolClaw = golClaw;
    export const ShortSword = shortSword;
    export const KrawitzSword = krawitzSword;
    export const GreatSword = greatSword;
    export const Rapier = rapier;
    export const JeweledMageblade = jeweledMageblade;
    export const WoodenStaff = woodenStaff;
    export const MageStaff = mageStaff;
    export const AmberStaff = amberStaff;
    export const LWhip = lWhip;
    export const VineWhip = vineWhip;
    export const GolWhip = golWhip;
    export const OakSpear = oakSpear;
    export const Halberd = halberd;
    export const HeavyFlail = heavyFlail;
    export const WarHammer = warHammer;
}
