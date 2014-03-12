Items.Weapons = {};

Items.Weapons.ShortSword = new Item("swrd0", "S.Sword");
Items.Weapons.ShortSword.price = 50;
Items.Weapons.ShortSword.Short = function() { return "short sword"; }
Items.Weapons.ShortSword.Long = function() { return "a simple short sword"; }
Items.Weapons.ShortSword.EquipType = ItemType.Weapon;
Items.Weapons.ShortSword.effect.atkMod = 0.1;
Items.Weapons.ShortSword.effect.strength = 1;
Items.Weapons.ShortSword.effect.apSlash = 1;

Items.Weapons.WoodenStaff = new Item("staff0", "W.Staff");
Items.Weapons.WoodenStaff.price = 30;
Items.Weapons.WoodenStaff.Short = function() { return "wooden staff"; }
Items.Weapons.WoodenStaff.Long = function() { return "a simple wooden staff"; }
Items.Weapons.WoodenStaff.EquipType = ItemType.Weapon;
Items.Weapons.WoodenStaff.effect.atkMod = 0;
Items.Weapons.WoodenStaff.effect.intelligence = 1;
Items.Weapons.WoodenStaff.effect.apBlunt = 1;

Items.Weapons.LWhip = new Item("whip0", "L.Whip");
Items.Weapons.LWhip.price = 40;
Items.Weapons.LWhip.Short = function() { return "leather whip"; }
Items.Weapons.LWhip.Long = function() { return "a simple leather whip"; }
Items.Weapons.LWhip.EquipType = ItemType.Weapon;
Items.Weapons.LWhip.effect.atkMod = 0;
Items.Weapons.LWhip.effect.libido = 1;
Items.Weapons.LWhip.effect.apSlash = 1;
