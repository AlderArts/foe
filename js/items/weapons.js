import { Item, Items, ItemType } from '../item';

Items.Weapons = {};

Items.Weapons.Dagger = new Item("dag0", "Dagger", ItemType.Weapon);
Items.Weapons.Dagger.price = 15;
Items.Weapons.Dagger.sDesc = function() { return "dagger"; }
Items.Weapons.Dagger.lDesc = function() { return "a simple dagger"; }
Items.Weapons.Dagger.Short = function() { return "Dagger"; }
Items.Weapons.Dagger.Long = function() { return "A simple dagger."; }
Items.Weapons.Dagger.effect.atkMod  = 0.1;
Items.Weapons.Dagger.effect.dexterity = 1;
Items.Weapons.Dagger.effect.apPierce = 1;

Items.Weapons.GolClaw = new Item("dag1", "Gol claw", ItemType.Weapon);
Items.Weapons.GolClaw.price = 750;
Items.Weapons.GolClaw.sDesc = function() { return "Gol claw"; }
Items.Weapons.GolClaw.lDesc = function() { return "a dagger fashioned out of a Gol claw"; }
Items.Weapons.GolClaw.Short = function() { return "Gol claw"; }
Items.Weapons.GolClaw.Long = function() { return "A dagger fashioned out of a Gol claw."; }
Items.Weapons.GolClaw.effect.atkMod    = 0.6;
Items.Weapons.GolClaw.effect.strength  = 2;
Items.Weapons.GolClaw.effect.stamina   = 2;
Items.Weapons.GolClaw.effect.dexterity = 10;
Items.Weapons.GolClaw.effect.apPierce  = 1;
Items.Weapons.GolClaw.effect.apSlash   = 0.5;

Items.Weapons.ShortSword = new Item("swrd0", "S.Sword", ItemType.Weapon);
Items.Weapons.ShortSword.price = 50;
Items.Weapons.ShortSword.sDesc = function() { return "short sword"; }
Items.Weapons.ShortSword.lDesc = function() { return "a simple short sword"; }
Items.Weapons.ShortSword.Short = function() { return "Short sword"; }
Items.Weapons.ShortSword.Long = function() { return "A simple short sword."; }
Items.Weapons.ShortSword.effect.atkMod = 0.1;
Items.Weapons.ShortSword.effect.strength = 1;
Items.Weapons.ShortSword.effect.apSlash = 1;

Items.Weapons.KrawitzSword = new Item("swrd1", "K.Sword", ItemType.Weapon);
Items.Weapons.KrawitzSword.price = 2000;
Items.Weapons.KrawitzSword.sDesc = function() { return "fine rapier"; }
Items.Weapons.KrawitzSword.lDesc = function() { return "Krawitz' fine rapier"; }
Items.Weapons.KrawitzSword.Short = function() { return "Fine rapier"; }
Items.Weapons.KrawitzSword.Long = function() { return "Krawitz' fine rapier."; }
Items.Weapons.KrawitzSword.effect.atkMod    = 0.7;
Items.Weapons.KrawitzSword.effect.strength  = 3;
Items.Weapons.KrawitzSword.effect.dexterity = 10;
Items.Weapons.KrawitzSword.effect.apPierce  = 1;

Items.Weapons.GreatSword = new Item("swrd2", "G.Sword", ItemType.Weapon);
Items.Weapons.GreatSword.price = 100;
Items.Weapons.GreatSword.sDesc = function() { return "greatsword"; }
Items.Weapons.GreatSword.lDesc = function() { return "a large greatsword"; }
Items.Weapons.GreatSword.Short = function() { return "Greatsword"; }
Items.Weapons.GreatSword.Long = function() { return "A large greatsword."; }
Items.Weapons.GreatSword.effect.atkMod = 1;
Items.Weapons.GreatSword.effect.strength = 4;
Items.Weapons.GreatSword.effect.apSlash = 1;

Items.Weapons.Rapier = new Item("swrd3", "Rapier", ItemType.Weapon);
Items.Weapons.Rapier.price = 75;
Items.Weapons.Rapier.sDesc = function() { return "rapier"; }
Items.Weapons.Rapier.lDesc = function() { return "a rapier"; }
Items.Weapons.Rapier.Short = function() { return "Rapier"; }
Items.Weapons.Rapier.Long = function() { return "A sharp rapier."; }
Items.Weapons.Rapier.effect.atkMod    = 0.1;
Items.Weapons.Rapier.effect.dexterity = 2;
Items.Weapons.Rapier.effect.apPierce  = 1;

Items.Weapons.JeweledMageblade = new Item("swrd4", "J.Mageblade", ItemType.Weapon);
Items.Weapons.JeweledMageblade.price = 1500;
Items.Weapons.JeweledMageblade.sDesc = function() { return "jeweled mageblade"; }
Items.Weapons.JeweledMageblade.lDesc = function() { return "a short sword with rubies inlaid in the crossguard"; }
Items.Weapons.JeweledMageblade.Short = function() { return "Jeweled mageblade"; }
Items.Weapons.JeweledMageblade.Long = function() { return "A short sword with rubies inlaid in the crossguard. Brief concentration on the part of the wielder causes the edge to erupt in flame."; }
Items.Weapons.JeweledMageblade.effect.atkMod = 0.5;
Items.Weapons.JeweledMageblade.effect.maxSp = 100;
Items.Weapons.JeweledMageblade.effect.intelligence = 7;
Items.Weapons.JeweledMageblade.effect.spirit = 3;
Items.Weapons.JeweledMageblade.effect.apSlash = 1;
Items.Weapons.JeweledMageblade.effect.amFire = 0.5;

Items.Weapons.WoodenStaff = new Item("staff0", "Staff", ItemType.Weapon);
Items.Weapons.WoodenStaff.price = 15;
Items.Weapons.WoodenStaff.sDesc = function() { return "wooden staff"; }
Items.Weapons.WoodenStaff.lDesc = function() { return "a simple wooden staff"; }
Items.Weapons.WoodenStaff.Short = function() { return "Wooden staff"; }
Items.Weapons.WoodenStaff.Long = function() { return "A simple wooden staff."; }
Items.Weapons.WoodenStaff.effect.atkMod = 0;
Items.Weapons.WoodenStaff.effect.intelligence = 1;
Items.Weapons.WoodenStaff.effect.apBlunt = 1;

Items.Weapons.MageStaff = new Item("staff1", "M.Staff", ItemType.Weapon);
Items.Weapons.MageStaff.price = 200;
Items.Weapons.MageStaff.sDesc = function() { return "magician's staff"; }
Items.Weapons.MageStaff.lDesc = function() { return "a magician's staff"; }
Items.Weapons.MageStaff.Short = function() { return "Magician's staff"; }
Items.Weapons.MageStaff.Long = function() { return "A magician's staff."; }
Items.Weapons.MageStaff.effect.atkMod = 0.2;
Items.Weapons.MageStaff.effect.intelligence = 5;
Items.Weapons.MageStaff.effect.spirit = 3;
Items.Weapons.MageStaff.effect.apBlunt = 1;

Items.Weapons.AmberStaff = new Item("staff2", "A.Staff", ItemType.Weapon);
Items.Weapons.AmberStaff.price = 1000;
Items.Weapons.AmberStaff.sDesc = function() { return "amber staff"; }
Items.Weapons.AmberStaff.lDesc = function() { return "an old amber staff"; }
Items.Weapons.AmberStaff.Short = function() { return "Old amber staff"; }
Items.Weapons.AmberStaff.Long = function() { return "A weathered staff with a knob made of amber. While old, it’s still useful as a conduit for electrical energies."; }
Items.Weapons.AmberStaff.effect.atkMod = 0.5;
Items.Weapons.AmberStaff.effect.intelligence = 10;
Items.Weapons.AmberStaff.effect.spirit = 10;
Items.Weapons.AmberStaff.effect.apBlunt = 0.5;
Items.Weapons.AmberStaff.effect.amThunder = 0.5;

Items.Weapons.LWhip = new Item("whip0", "L.Whip", ItemType.Weapon);
Items.Weapons.LWhip.price = 30;
Items.Weapons.LWhip.sDesc = function() { return "leather whip"; }
Items.Weapons.LWhip.lDesc = function() { return "a simple leather whip"; }
Items.Weapons.LWhip.Short = function() { return "Leather whip"; }
Items.Weapons.LWhip.Long = function() { return "A simple leather whip."; }
Items.Weapons.LWhip.effect.atkMod  = 0;
Items.Weapons.LWhip.effect.libido  = 1;
Items.Weapons.LWhip.effect.apSlash = 1;

Items.Weapons.VineWhip = new Item("whip1", "V.Whip", ItemType.Weapon);
Items.Weapons.VineWhip.price = 300;
Items.Weapons.VineWhip.sDesc = function() { return "vine whip"; }
Items.Weapons.VineWhip.lDesc = function() { return "a whip made of vines"; }
Items.Weapons.VineWhip.Short = function() { return "Vine whip"; }
Items.Weapons.VineWhip.Long = function() { return "A whip made of vines."; }
Items.Weapons.VineWhip.effect.atkMod  = 0.2;
Items.Weapons.VineWhip.effect.libido  = 5;
Items.Weapons.VineWhip.effect.charisma = 3;
Items.Weapons.VineWhip.effect.apSlash = 1;
Items.Weapons.VineWhip.effect.amNature = 0.5;

Items.Weapons.GolWhip = new Item("whip2", "G.Whip", ItemType.Weapon);
Items.Weapons.GolWhip.price = 900;
Items.Weapons.GolWhip.sDesc = function() { return "Gol whip"; }
Items.Weapons.GolWhip.lDesc = function() { return "a whip dripping with Gol venom"; }
Items.Weapons.GolWhip.Short = function() { return "Gol whip"; }
Items.Weapons.GolWhip.Long = function() { return "A whip dripping with Gol venom."; }
Items.Weapons.GolWhip.effect.maxLust = 100;
Items.Weapons.GolWhip.effect.atkMod  = 0.8;
Items.Weapons.GolWhip.effect.libido  = 9;
Items.Weapons.GolWhip.effect.charisma = 5;
Items.Weapons.GolWhip.effect.apSlash = 1;
Items.Weapons.GolWhip.effect.amNature = 0.5;
Items.Weapons.GolWhip.effect.alust = 0.5;

Items.Weapons.OakSpear = new Item("spear0", "Oak Spear", ItemType.Weapon);
Items.Weapons.OakSpear.price = 85;
Items.Weapons.OakSpear.sDesc = function() { return "oak spear"; }
Items.Weapons.OakSpear.lDesc = function() { return "an oak spear"; }
Items.Weapons.OakSpear.Short = function() { return "Oak spear"; }
Items.Weapons.OakSpear.Long = function() { return "A shaft of treated wood with a pointed tip attached. Good for the defensive fighter in keeping your distance."; }
Items.Weapons.OakSpear.effect.atkMod   = 0.2;
Items.Weapons.OakSpear.effect.defMod   = 0.2;
Items.Weapons.OakSpear.effect.apPierce = 1;

Items.Weapons.Halberd = new Item("spear1", "Halberd", ItemType.Weapon);
Items.Weapons.Halberd.price = 115;
Items.Weapons.Halberd.sDesc = function() { return "halberd"; }
Items.Weapons.Halberd.lDesc = function() { return "a halberd"; }
Items.Weapons.Halberd.Short = function() { return "Halberd"; }
Items.Weapons.Halberd.Long = function() { return "Like a spear, but it slashes, too!"; }
Items.Weapons.Halberd.effect.atkMod   = 0.3;
Items.Weapons.Halberd.effect.defMod   = 0.3;
Items.Weapons.Halberd.effect.apPierce = 0.5;
Items.Weapons.Halberd.effect.apSlash  = 0.5;

Items.Weapons.HeavyFlail = new Item("flail0", "Heavy flail", ItemType.Weapon);
Items.Weapons.HeavyFlail.price = 125;
Items.Weapons.HeavyFlail.sDesc = function() { return "heavy flail"; }
Items.Weapons.HeavyFlail.lDesc = function() { return "a heavy flail"; }
Items.Weapons.HeavyFlail.Short = function() { return "Heavy flail"; }
Items.Weapons.HeavyFlail.Long = function() { return "A spiked wrecking ball on a stick for the offensively oriented. Hampers your ability to defend yourself, but grants considerable attacking momentum."; }
Items.Weapons.HeavyFlail.effect.atkMod    = 0.5;
Items.Weapons.HeavyFlail.effect.defMod    = -0.1;
Items.Weapons.HeavyFlail.effect.apBlunt   = 0.8;
Items.Weapons.HeavyFlail.effect.apPierce  = 0.2;
Items.Weapons.HeavyFlail.effect.dexterity = 2;
Items.Weapons.HeavyFlail.effect.strength  = 2;

Items.Weapons.WarHammer = new Item("hammer0", "Warhammer", ItemType.Weapon);
Items.Weapons.WarHammer.price = 125;
Items.Weapons.WarHammer.sDesc = function() { return "warhammer"; }
Items.Weapons.WarHammer.lDesc = function() { return "a warhammer"; }
Items.Weapons.WarHammer.Short = function() { return "Warhammer"; }
Items.Weapons.WarHammer.Long = function() { return "Unwieldy, but learn to hold this thing right and you’ll be popping skulls like overripe fruit."; }
Items.Weapons.WarHammer.effect.atkMod    = 0.6;
Items.Weapons.WarHammer.effect.apBlunt   = 1;
Items.Weapons.WarHammer.effect.dexterity = -1;
Items.Weapons.WarHammer.effect.strength  = 4;

