import { Item, ItemType } from '../item';

let WeaponsItems = {};

WeaponsItems.Dagger = new Item("dag0", "Dagger", ItemType.Weapon);
WeaponsItems.Dagger.price = 15;
WeaponsItems.Dagger.sDesc = function() { return "dagger"; }
WeaponsItems.Dagger.lDesc = function() { return "a simple dagger"; }
WeaponsItems.Dagger.Short = function() { return "Dagger"; }
WeaponsItems.Dagger.Long = function() { return "A simple dagger."; }
WeaponsItems.Dagger.effect.atkMod  = 0.1;
WeaponsItems.Dagger.effect.dexterity = 1;
WeaponsItems.Dagger.effect.apPierce = 1;

WeaponsItems.GolClaw = new Item("dag1", "Gol claw", ItemType.Weapon);
WeaponsItems.GolClaw.price = 750;
WeaponsItems.GolClaw.sDesc = function() { return "Gol claw"; }
WeaponsItems.GolClaw.lDesc = function() { return "a dagger fashioned out of a Gol claw"; }
WeaponsItems.GolClaw.Short = function() { return "Gol claw"; }
WeaponsItems.GolClaw.Long = function() { return "A dagger fashioned out of a Gol claw."; }
WeaponsItems.GolClaw.effect.atkMod    = 0.6;
WeaponsItems.GolClaw.effect.strength  = 2;
WeaponsItems.GolClaw.effect.stamina   = 2;
WeaponsItems.GolClaw.effect.dexterity = 10;
WeaponsItems.GolClaw.effect.apPierce  = 1;
WeaponsItems.GolClaw.effect.apSlash   = 0.5;

WeaponsItems.ShortSword = new Item("swrd0", "S.Sword", ItemType.Weapon);
WeaponsItems.ShortSword.price = 50;
WeaponsItems.ShortSword.sDesc = function() { return "short sword"; }
WeaponsItems.ShortSword.lDesc = function() { return "a simple short sword"; }
WeaponsItems.ShortSword.Short = function() { return "Short sword"; }
WeaponsItems.ShortSword.Long = function() { return "A simple short sword."; }
WeaponsItems.ShortSword.effect.atkMod = 0.1;
WeaponsItems.ShortSword.effect.strength = 1;
WeaponsItems.ShortSword.effect.apSlash = 1;

WeaponsItems.KrawitzSword = new Item("swrd1", "K.Sword", ItemType.Weapon);
WeaponsItems.KrawitzSword.price = 2000;
WeaponsItems.KrawitzSword.sDesc = function() { return "fine rapier"; }
WeaponsItems.KrawitzSword.lDesc = function() { return "Krawitz' fine rapier"; }
WeaponsItems.KrawitzSword.Short = function() { return "Fine rapier"; }
WeaponsItems.KrawitzSword.Long = function() { return "Krawitz' fine rapier."; }
WeaponsItems.KrawitzSword.effect.atkMod    = 0.7;
WeaponsItems.KrawitzSword.effect.strength  = 3;
WeaponsItems.KrawitzSword.effect.dexterity = 10;
WeaponsItems.KrawitzSword.effect.apPierce  = 1;

WeaponsItems.GreatSword = new Item("swrd2", "G.Sword", ItemType.Weapon);
WeaponsItems.GreatSword.price = 100;
WeaponsItems.GreatSword.sDesc = function() { return "greatsword"; }
WeaponsItems.GreatSword.lDesc = function() { return "a large greatsword"; }
WeaponsItems.GreatSword.Short = function() { return "Greatsword"; }
WeaponsItems.GreatSword.Long = function() { return "A large greatsword."; }
WeaponsItems.GreatSword.effect.atkMod = 1;
WeaponsItems.GreatSword.effect.strength = 4;
WeaponsItems.GreatSword.effect.apSlash = 1;

WeaponsItems.Rapier = new Item("swrd3", "Rapier", ItemType.Weapon);
WeaponsItems.Rapier.price = 75;
WeaponsItems.Rapier.sDesc = function() { return "rapier"; }
WeaponsItems.Rapier.lDesc = function() { return "a rapier"; }
WeaponsItems.Rapier.Short = function() { return "Rapier"; }
WeaponsItems.Rapier.Long = function() { return "A sharp rapier."; }
WeaponsItems.Rapier.effect.atkMod    = 0.1;
WeaponsItems.Rapier.effect.dexterity = 2;
WeaponsItems.Rapier.effect.apPierce  = 1;

WeaponsItems.JeweledMageblade = new Item("swrd4", "J.Mageblade", ItemType.Weapon);
WeaponsItems.JeweledMageblade.price = 1500;
WeaponsItems.JeweledMageblade.sDesc = function() { return "jeweled mageblade"; }
WeaponsItems.JeweledMageblade.lDesc = function() { return "a short sword with rubies inlaid in the crossguard"; }
WeaponsItems.JeweledMageblade.Short = function() { return "Jeweled mageblade"; }
WeaponsItems.JeweledMageblade.Long = function() { return "A short sword with rubies inlaid in the crossguard. Brief concentration on the part of the wielder causes the edge to erupt in flame."; }
WeaponsItems.JeweledMageblade.effect.atkMod = 0.5;
WeaponsItems.JeweledMageblade.effect.maxSp = 100;
WeaponsItems.JeweledMageblade.effect.intelligence = 7;
WeaponsItems.JeweledMageblade.effect.spirit = 3;
WeaponsItems.JeweledMageblade.effect.apSlash = 1;
WeaponsItems.JeweledMageblade.effect.amFire = 0.5;

WeaponsItems.WoodenStaff = new Item("staff0", "Staff", ItemType.Weapon);
WeaponsItems.WoodenStaff.price = 15;
WeaponsItems.WoodenStaff.sDesc = function() { return "wooden staff"; }
WeaponsItems.WoodenStaff.lDesc = function() { return "a simple wooden staff"; }
WeaponsItems.WoodenStaff.Short = function() { return "Wooden staff"; }
WeaponsItems.WoodenStaff.Long = function() { return "A simple wooden staff."; }
WeaponsItems.WoodenStaff.effect.atkMod = 0;
WeaponsItems.WoodenStaff.effect.intelligence = 1;
WeaponsItems.WoodenStaff.effect.apBlunt = 1;

WeaponsItems.MageStaff = new Item("staff1", "M.Staff", ItemType.Weapon);
WeaponsItems.MageStaff.price = 200;
WeaponsItems.MageStaff.sDesc = function() { return "magician's staff"; }
WeaponsItems.MageStaff.lDesc = function() { return "a magician's staff"; }
WeaponsItems.MageStaff.Short = function() { return "Magician's staff"; }
WeaponsItems.MageStaff.Long = function() { return "A magician's staff."; }
WeaponsItems.MageStaff.effect.atkMod = 0.2;
WeaponsItems.MageStaff.effect.intelligence = 5;
WeaponsItems.MageStaff.effect.spirit = 3;
WeaponsItems.MageStaff.effect.apBlunt = 1;

WeaponsItems.AmberStaff = new Item("staff2", "A.Staff", ItemType.Weapon);
WeaponsItems.AmberStaff.price = 1000;
WeaponsItems.AmberStaff.sDesc = function() { return "amber staff"; }
WeaponsItems.AmberStaff.lDesc = function() { return "an old amber staff"; }
WeaponsItems.AmberStaff.Short = function() { return "Old amber staff"; }
WeaponsItems.AmberStaff.Long = function() { return "A weathered staff with a knob made of amber. While old, it’s still useful as a conduit for electrical energies."; }
WeaponsItems.AmberStaff.effect.atkMod = 0.5;
WeaponsItems.AmberStaff.effect.intelligence = 10;
WeaponsItems.AmberStaff.effect.spirit = 10;
WeaponsItems.AmberStaff.effect.apBlunt = 0.5;
WeaponsItems.AmberStaff.effect.amThunder = 0.5;

WeaponsItems.LWhip = new Item("whip0", "L.Whip", ItemType.Weapon);
WeaponsItems.LWhip.price = 30;
WeaponsItems.LWhip.sDesc = function() { return "leather whip"; }
WeaponsItems.LWhip.lDesc = function() { return "a simple leather whip"; }
WeaponsItems.LWhip.Short = function() { return "Leather whip"; }
WeaponsItems.LWhip.Long = function() { return "A simple leather whip."; }
WeaponsItems.LWhip.effect.atkMod  = 0;
WeaponsItems.LWhip.effect.libido  = 1;
WeaponsItems.LWhip.effect.apSlash = 1;

WeaponsItems.VineWhip = new Item("whip1", "V.Whip", ItemType.Weapon);
WeaponsItems.VineWhip.price = 300;
WeaponsItems.VineWhip.sDesc = function() { return "vine whip"; }
WeaponsItems.VineWhip.lDesc = function() { return "a whip made of vines"; }
WeaponsItems.VineWhip.Short = function() { return "Vine whip"; }
WeaponsItems.VineWhip.Long = function() { return "A whip made of vines."; }
WeaponsItems.VineWhip.effect.atkMod  = 0.2;
WeaponsItems.VineWhip.effect.libido  = 5;
WeaponsItems.VineWhip.effect.charisma = 3;
WeaponsItems.VineWhip.effect.apSlash = 1;
WeaponsItems.VineWhip.effect.amNature = 0.5;

WeaponsItems.GolWhip = new Item("whip2", "G.Whip", ItemType.Weapon);
WeaponsItems.GolWhip.price = 900;
WeaponsItems.GolWhip.sDesc = function() { return "Gol whip"; }
WeaponsItems.GolWhip.lDesc = function() { return "a whip dripping with Gol venom"; }
WeaponsItems.GolWhip.Short = function() { return "Gol whip"; }
WeaponsItems.GolWhip.Long = function() { return "A whip dripping with Gol venom."; }
WeaponsItems.GolWhip.effect.maxLust = 100;
WeaponsItems.GolWhip.effect.atkMod  = 0.8;
WeaponsItems.GolWhip.effect.libido  = 9;
WeaponsItems.GolWhip.effect.charisma = 5;
WeaponsItems.GolWhip.effect.apSlash = 1;
WeaponsItems.GolWhip.effect.amNature = 0.5;
WeaponsItems.GolWhip.effect.alust = 0.5;

WeaponsItems.OakSpear = new Item("spear0", "Oak Spear", ItemType.Weapon);
WeaponsItems.OakSpear.price = 85;
WeaponsItems.OakSpear.sDesc = function() { return "oak spear"; }
WeaponsItems.OakSpear.lDesc = function() { return "an oak spear"; }
WeaponsItems.OakSpear.Short = function() { return "Oak spear"; }
WeaponsItems.OakSpear.Long = function() { return "A shaft of treated wood with a pointed tip attached. Good for the defensive fighter in keeping your distance."; }
WeaponsItems.OakSpear.effect.atkMod   = 0.2;
WeaponsItems.OakSpear.effect.defMod   = 0.2;
WeaponsItems.OakSpear.effect.apPierce = 1;

WeaponsItems.Halberd = new Item("spear1", "Halberd", ItemType.Weapon);
WeaponsItems.Halberd.price = 115;
WeaponsItems.Halberd.sDesc = function() { return "halberd"; }
WeaponsItems.Halberd.lDesc = function() { return "a halberd"; }
WeaponsItems.Halberd.Short = function() { return "Halberd"; }
WeaponsItems.Halberd.Long = function() { return "Like a spear, but it slashes, too!"; }
WeaponsItems.Halberd.effect.atkMod   = 0.3;
WeaponsItems.Halberd.effect.defMod   = 0.3;
WeaponsItems.Halberd.effect.apPierce = 0.5;
WeaponsItems.Halberd.effect.apSlash  = 0.5;

WeaponsItems.HeavyFlail = new Item("flail0", "Heavy flail", ItemType.Weapon);
WeaponsItems.HeavyFlail.price = 125;
WeaponsItems.HeavyFlail.sDesc = function() { return "heavy flail"; }
WeaponsItems.HeavyFlail.lDesc = function() { return "a heavy flail"; }
WeaponsItems.HeavyFlail.Short = function() { return "Heavy flail"; }
WeaponsItems.HeavyFlail.Long = function() { return "A spiked wrecking ball on a stick for the offensively oriented. Hampers your ability to defend yourself, but grants considerable attacking momentum."; }
WeaponsItems.HeavyFlail.effect.atkMod    = 0.5;
WeaponsItems.HeavyFlail.effect.defMod    = -0.1;
WeaponsItems.HeavyFlail.effect.apBlunt   = 0.8;
WeaponsItems.HeavyFlail.effect.apPierce  = 0.2;
WeaponsItems.HeavyFlail.effect.dexterity = 2;
WeaponsItems.HeavyFlail.effect.strength  = 2;

WeaponsItems.WarHammer = new Item("hammer0", "Warhammer", ItemType.Weapon);
WeaponsItems.WarHammer.price = 125;
WeaponsItems.WarHammer.sDesc = function() { return "warhammer"; }
WeaponsItems.WarHammer.lDesc = function() { return "a warhammer"; }
WeaponsItems.WarHammer.Short = function() { return "Warhammer"; }
WeaponsItems.WarHammer.Long = function() { return "Unwieldy, but learn to hold this thing right and you’ll be popping skulls like overripe fruit."; }
WeaponsItems.WarHammer.effect.atkMod    = 0.6;
WeaponsItems.WarHammer.effect.apBlunt   = 1;
WeaponsItems.WarHammer.effect.dexterity = -1;
WeaponsItems.WarHammer.effect.strength  = 4;

export { WeaponsItems };
