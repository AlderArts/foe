Items.Weapons = {};

Items.Weapons.Dagger = new Item("dag0", "Dagger");
Items.Weapons.Dagger.price = 25;
Items.Weapons.Dagger.short = function() { return "dagger"; }
Items.Weapons.Dagger.long = function() { return "a simple dagger"; }
Items.Weapons.Dagger.Short = function() { return "Dagger"; }
Items.Weapons.Dagger.Long = function() { return "A simple dagger."; }
Items.Weapons.Dagger.EquipType = ItemType.Weapon;
Items.Weapons.Dagger.effect.atkMod  = 0.1;
Items.Weapons.Dagger.effect.dexterity = 1;
Items.Weapons.Dagger.effect.apPierce = 1;

Items.Weapons.ShortSword = new Item("swrd0", "S.Sword");
Items.Weapons.ShortSword.price = 50;
Items.Weapons.ShortSword.short = function() { return "short sword"; }
Items.Weapons.ShortSword.long = function() { return "a simple short sword"; }
Items.Weapons.ShortSword.Short = function() { return "Short sword"; }
Items.Weapons.ShortSword.Long = function() { return "A simple short sword."; }
Items.Weapons.ShortSword.EquipType = ItemType.Weapon;
Items.Weapons.ShortSword.effect.atkMod = 0.1;
Items.Weapons.ShortSword.effect.strength = 1;
Items.Weapons.ShortSword.effect.apSlash = 1;

Items.Weapons.KrawitzSword = new Item("swrd1", "K.Sword");
Items.Weapons.KrawitzSword.price = 2000;
Items.Weapons.KrawitzSword.short = function() { return "fine rapier"; }
Items.Weapons.KrawitzSword.long = function() { return "Krawitz' fine rapier"; }
Items.Weapons.KrawitzSword.Short = function() { return "Fine rapier"; }
Items.Weapons.KrawitzSword.Long = function() { return "Krawitz' fine rapier."; }
Items.Weapons.KrawitzSword.EquipType = ItemType.Weapon;
Items.Weapons.KrawitzSword.effect.atkMod    = 0.7;
Items.Weapons.KrawitzSword.effect.strength  = 3;
Items.Weapons.KrawitzSword.effect.dexterity = 10;
Items.Weapons.KrawitzSword.effect.apPierce  = 1;

Items.Weapons.GreatSword = new Item("swrd2", "G.Sword");
Items.Weapons.GreatSword.price = 100;
Items.Weapons.GreatSword.short = function() { return "greatsword"; }
Items.Weapons.GreatSword.long = function() { return "a large greatsword"; }
Items.Weapons.GreatSword.Short = function() { return "Greatsword"; }
Items.Weapons.GreatSword.Long = function() { return "A large greatsword."; }
Items.Weapons.GreatSword.EquipType = ItemType.Weapon;
Items.Weapons.GreatSword.effect.atkMod = 1;
Items.Weapons.GreatSword.effect.strength = 4;
Items.Weapons.GreatSword.effect.apSlash = 1;

Items.Weapons.WoodenStaff = new Item("staff0", "W.Staff");
Items.Weapons.WoodenStaff.price = 30;
Items.Weapons.WoodenStaff.short = function() { return "wooden staff"; }
Items.Weapons.WoodenStaff.long = function() { return "a simple wooden staff"; }
Items.Weapons.WoodenStaff.Short = function() { return "Wooden staff"; }
Items.Weapons.WoodenStaff.Long = function() { return "A simple wooden staff."; }
Items.Weapons.WoodenStaff.EquipType = ItemType.Weapon;
Items.Weapons.WoodenStaff.effect.atkMod = 0;
Items.Weapons.WoodenStaff.effect.intelligence = 1;
Items.Weapons.WoodenStaff.effect.apBlunt = 1;

Items.Weapons.LWhip = new Item("whip0", "L.Whip");
Items.Weapons.LWhip.price = 40;
Items.Weapons.LWhip.short = function() { return "leather whip"; }
Items.Weapons.LWhip.long = function() { return "a simple leather whip"; }
Items.Weapons.LWhip.Short = function() { return "Leather whip"; }
Items.Weapons.LWhip.Long = function() { return "A simple leather whip."; }
Items.Weapons.LWhip.EquipType = ItemType.Weapon;
Items.Weapons.LWhip.effect.atkMod  = 0;
Items.Weapons.LWhip.effect.libido  = 1;
Items.Weapons.LWhip.effect.apSlash = 1;
