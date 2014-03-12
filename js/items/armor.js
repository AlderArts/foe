Items.Armor = {};

Items.Armor.LeatherChest = new Item("chest0", "L.chest");
Items.Armor.LeatherChest.price = 40;
Items.Armor.LeatherChest.Short = function() { return "leather chest"; }
Items.Armor.LeatherChest.Long = function() { return "a simple leather breastplate"; }
Items.Armor.LeatherChest.EquipType = ItemType.TopArmor;
Items.Armor.LeatherChest.effect.defMod = 0.1;
Items.Armor.LeatherChest.effect.stamina = 1;

Items.Armor.LeatherPants = new Item("pants0", "L.Pants");
Items.Armor.LeatherPants.price = 20;
Items.Armor.LeatherPants.Short = function() { return "leather pants"; }
Items.Armor.LeatherPants.Long = function() { return "a pair of simple leather pants"; }
Items.Armor.LeatherPants.EquipType = ItemType.BotArmor;
Items.Armor.LeatherPants.effect.defMod = 0.1;
Items.Armor.LeatherPants.effect.stamina = 1;

Items.Armor.SimpleRobes = new Item("robe0", "S.Robes");
Items.Armor.SimpleRobes.price = 40;
Items.Armor.SimpleRobes.Short = function() { return "simple robes"; }
Items.Armor.SimpleRobes.Long = function() { return "simple cloth robes"; }
Items.Armor.SimpleRobes.EquipType = ItemType.FullArmor;
Items.Armor.SimpleRobes.effect.defMod = 0;
Items.Armor.SimpleRobes.effect.intelligence = 1;
Items.Armor.SimpleRobes.effect.spirit = 1;

Items.Armor.StylizedClothes = new Item("cloth0", "S.Clothes");
Items.Armor.StylizedClothes.price = 50;
Items.Armor.StylizedClothes.Short = function() { return "stylized clothes"; }
Items.Armor.StylizedClothes.Long = function() { return "stylish clothes, with an alluring cut"; }
Items.Armor.StylizedClothes.EquipType = ItemType.FullArmor;
Items.Armor.StylizedClothes.effect.defMod = 0;
Items.Armor.StylizedClothes.effect.charisma = 1;
Items.Armor.StylizedClothes.effect.libido = 1;

