Items.Armor = {};

Items.Armor.LeatherChest = new Item("chest0", "L.Chest");
Items.Armor.LeatherChest.price = 40;
Items.Armor.LeatherChest.short = function() { return "leather chest"; }
Items.Armor.LeatherChest.long = function() { return "a simple leather breastplate"; }
Items.Armor.LeatherChest.Short = function() { return "Leather chest"; }
Items.Armor.LeatherChest.Long = function() { return "A simple leather breastplate."; }
Items.Armor.LeatherChest.EquipType = ItemType.TopArmor;
Items.Armor.LeatherChest.effect.defMod = 0.1;
Items.Armor.LeatherChest.effect.stamina = 1;

Items.Armor.WatchChest = new Item("chest1", "W.Uniform");
Items.Armor.WatchChest.price = 200;
Items.Armor.WatchChest.short = function() { return "watch uniform"; }
Items.Armor.WatchChest.long = function() { return "a Rigard city watch uniform"; }
Items.Armor.WatchChest.Short = function() { return "Watch uniform"; }
Items.Armor.WatchChest.Long = function() { return "A Rigard city watch uniform."; }
Items.Armor.WatchChest.EquipType = ItemType.FullArmor;
Items.Armor.WatchChest.effect.defMod = 0.5;
Items.Armor.WatchChest.effect.stamina = 3;

Items.Armor.LeatherPants = new Item("pants0", "L.Pants");
Items.Armor.LeatherPants.price = 20;
Items.Armor.LeatherPants.short = function() { return "leather pants"; }
Items.Armor.LeatherPants.long = function() { return "a pair of simple leather pants"; }
Items.Armor.LeatherPants.Short = function() { return "Leather pants"; }
Items.Armor.LeatherPants.Long = function() { return "A pair of simple leather pants."; }
Items.Armor.LeatherPants.EquipType = ItemType.BotArmor;
Items.Armor.LeatherPants.effect.defMod = 0.1;
Items.Armor.LeatherPants.effect.stamina = 1;

Items.Armor.SimpleRobes = new Item("robe0", "S.Robes");
Items.Armor.SimpleRobes.price = 40;
Items.Armor.SimpleRobes.short = function() { return "simple robes"; }
Items.Armor.SimpleRobes.long = function() { return "simple cloth robes"; }
Items.Armor.SimpleRobes.Short = function() { return "Simple robes"; }
Items.Armor.SimpleRobes.Long = function() { return "Simple cloth robes."; }
Items.Armor.SimpleRobes.EquipType = ItemType.FullArmor;
Items.Armor.SimpleRobes.effect.defMod = 0;
Items.Armor.SimpleRobes.effect.intelligence = 1;
Items.Armor.SimpleRobes.effect.spirit = 1;

Items.Armor.StylizedClothes = new Item("cloth0", "S.Clothes");
Items.Armor.StylizedClothes.price = 50;
Items.Armor.StylizedClothes.short = function() { return "stylized clothes"; }
Items.Armor.StylizedClothes.long = function() { return "stylish clothes, with an alluring cut"; }
Items.Armor.StylizedClothes.Short = function() { return "Stylized clothes"; }
Items.Armor.StylizedClothes.Long = function() { return "Stylish clothes, with an alluring cut."; }
Items.Armor.StylizedClothes.EquipType = ItemType.FullArmor;
Items.Armor.StylizedClothes.effect.defMod = 0;
Items.Armor.StylizedClothes.effect.charisma = 1;
Items.Armor.StylizedClothes.effect.libido = 1;

