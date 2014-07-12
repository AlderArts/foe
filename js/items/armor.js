Items.Armor = {};

Items.Armor.LeatherChest = new Item("chest0", "L.Chest");
Items.Armor.LeatherChest.price = 40;
Items.Armor.LeatherChest.sDesc = function() { return "leather chest"; }
Items.Armor.LeatherChest.lDesc = function() { return "a simple leather breastplate"; }
Items.Armor.LeatherChest.Short = function() { return "Leather chest"; }
Items.Armor.LeatherChest.Long = function() { return "A simple leather breastplate."; }
Items.Armor.LeatherChest.EquipType = ItemType.TopArmor;
Items.Armor.LeatherChest.effect.defMod = 0.1;
Items.Armor.LeatherChest.effect.stamina = 1;

Items.Armor.WatchChest = new Item("chest1", "W.Uniform");
Items.Armor.WatchChest.price = 200;
Items.Armor.WatchChest.sDesc = function() { return "watch uniform"; }
Items.Armor.WatchChest.lDesc = function() { return "a Rigard city watch uniform"; }
Items.Armor.WatchChest.Short = function() { return "Watch uniform"; }
Items.Armor.WatchChest.Long = function() { return "A Rigard city watch uniform."; }
Items.Armor.WatchChest.EquipType = ItemType.FullArmor;
Items.Armor.WatchChest.effect.defMod = 0.5;
Items.Armor.WatchChest.effect.stamina = 3;

Items.Armor.BronzeChest = new Item("chest2", "B.Chest");
Items.Armor.BronzeChest.price = 150;
Items.Armor.BronzeChest.sDesc = function() { return "bronze chest"; }
Items.Armor.BronzeChest.lDesc = function() { return "a simple bronze breastplate"; }
Items.Armor.BronzeChest.Short = function() { return "Bronze chest"; }
Items.Armor.BronzeChest.Long = function() { return "A simple bronze breastplate."; }
Items.Armor.BronzeChest.EquipType = ItemType.TopArmor;
Items.Armor.BronzeChest.effect.defMod = 0.3;
Items.Armor.BronzeChest.effect.stamina = 2;

Items.Armor.LeatherPants = new Item("pants0", "L.Pants");
Items.Armor.LeatherPants.price = 20;
Items.Armor.LeatherPants.sDesc = function() { return "leather pants"; }
Items.Armor.LeatherPants.lDesc = function() { return "a pair of simple leather pants"; }
Items.Armor.LeatherPants.Short = function() { return "Leather pants"; }
Items.Armor.LeatherPants.Long = function() { return "A pair of simple leather pants."; }
Items.Armor.LeatherPants.EquipType = ItemType.BotArmor;
Items.Armor.LeatherPants.effect.defMod = 0.1;
Items.Armor.LeatherPants.effect.stamina = 1;

Items.Armor.BronzeLeggings = new Item("pants1", "B.Legs");
Items.Armor.BronzeLeggings.price = 20;
Items.Armor.BronzeLeggings.sDesc = function() { return "bronze leggings"; }
Items.Armor.BronzeLeggings.lDesc = function() { return "a pair of simple bronze leggings"; }
Items.Armor.BronzeLeggings.Short = function() { return "Bronze leggings"; }
Items.Armor.BronzeLeggings.Long = function() { return "A pair of simple bronze leggings."; }
Items.Armor.BronzeLeggings.EquipType = ItemType.BotArmor;
Items.Armor.BronzeLeggings.effect.defMod = 0.2;
Items.Armor.BronzeLeggings.effect.stamina = 2;

Items.Armor.SimpleRobes = new Item("robe0", "S.Robes");
Items.Armor.SimpleRobes.price = 40;
Items.Armor.SimpleRobes.sDesc = function() { return "simple robes"; }
Items.Armor.SimpleRobes.lDesc = function() { return "simple cloth robes"; }
Items.Armor.SimpleRobes.Short = function() { return "Simple robes"; }
Items.Armor.SimpleRobes.Long = function() { return "Simple cloth robes."; }
Items.Armor.SimpleRobes.EquipType = ItemType.FullArmor;
Items.Armor.SimpleRobes.effect.defMod = 0;
Items.Armor.SimpleRobes.effect.intelligence = 1;
Items.Armor.SimpleRobes.effect.spirit = 1;

Items.Armor.StylizedClothes = new Item("cloth0", "S.Clothes");
Items.Armor.StylizedClothes.price = 50;
Items.Armor.StylizedClothes.sDesc = function() { return "stylized clothes"; }
Items.Armor.StylizedClothes.lDesc = function() { return "stylish clothes, with an alluring cut"; }
Items.Armor.StylizedClothes.Short = function() { return "Stylized clothes"; }
Items.Armor.StylizedClothes.Long = function() { return "Stylish clothes, with an alluring cut."; }
Items.Armor.StylizedClothes.EquipType = ItemType.FullArmor;
Items.Armor.StylizedClothes.effect.defMod = 0;
Items.Armor.StylizedClothes.effect.charisma = 1;
Items.Armor.StylizedClothes.effect.libido = 1;

