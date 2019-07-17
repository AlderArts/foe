import { Item, Items, ItemType } from '../item';

Items.Armor = {};

Items.Armor.LeatherChest = new Item("chest0", "L.Chest", ItemType.Armor);
Items.Armor.LeatherChest.price = 40;
Items.Armor.LeatherChest.sDesc = function() { return "leather chest"; }
Items.Armor.LeatherChest.lDesc = function() { return "a simple leather breastplate"; }
Items.Armor.LeatherChest.Short = function() { return "Leather chest"; }
Items.Armor.LeatherChest.Long = function() { return "A simple leather breastplate."; }
Items.Armor.LeatherChest.subtype = ItemSubtype.TopArmor;
Items.Armor.LeatherChest.effect.defMod = 0.1;
Items.Armor.LeatherChest.effect.stamina = 1;

Items.Armor.WatchChest = new Item("chest1", "W.Uniform", ItemType.Armor);
Items.Armor.WatchChest.price = 200;
Items.Armor.WatchChest.sDesc = function() { return "watch uniform"; }
Items.Armor.WatchChest.lDesc = function() { return "a Rigard city watch uniform"; }
Items.Armor.WatchChest.Short = function() { return "Watch uniform"; }
Items.Armor.WatchChest.Long = function() { return "A Rigard city watch uniform."; }
Items.Armor.WatchChest.subtype = ItemSubtype.FullArmor;
Items.Armor.WatchChest.effect.defMod = 0.6;
Items.Armor.WatchChest.effect.stamina = 4;

Items.Armor.BronzeChest = new Item("chest2", "B.Chest", ItemType.Armor);
Items.Armor.BronzeChest.price = 150;
Items.Armor.BronzeChest.sDesc = function() { return "bronze chest"; }
Items.Armor.BronzeChest.lDesc = function() { return "a simple bronze breastplate"; }
Items.Armor.BronzeChest.Short = function() { return "Bronze chest"; }
Items.Armor.BronzeChest.Long = function() { return "A simple bronze breastplate."; }
Items.Armor.BronzeChest.subtype = ItemSubtype.TopArmor;
Items.Armor.BronzeChest.effect.defMod = 0.3;
Items.Armor.BronzeChest.effect.stamina = 2;

Items.Armor.VineBra = new Item("chest3", "V.Bra", ItemType.Armor);
Items.Armor.VineBra.price = 300;
Items.Armor.VineBra.sDesc = function() { return "vine bra"; }
Items.Armor.VineBra.lDesc = function() { return "a vine bra"; }
Items.Armor.VineBra.Short = function() { return "Vine bra"; }
Items.Armor.VineBra.Long = function() { return "A vine bra."; }
Items.Armor.VineBra.subtype = ItemSubtype.TopArmor;
Items.Armor.VineBra.effect.defMod = 0.3;
Items.Armor.VineBra.effect.stamina = 2;
Items.Armor.VineBra.effect.libido = 3;
Items.Armor.VineBra.effect.charisma = 2;

Items.Armor.LeatherPants = new Item("pants0", "L.Pants", ItemType.Armor);
Items.Armor.LeatherPants.price = 20;
Items.Armor.LeatherPants.sDesc = function() { return "leather pants"; }
Items.Armor.LeatherPants.lDesc = function() { return "a pair of simple leather pants"; }
Items.Armor.LeatherPants.Short = function() { return "Leather pants"; }
Items.Armor.LeatherPants.Long = function() { return "A pair of simple leather pants."; }
Items.Armor.LeatherPants.subtype = ItemSubtype.BotArmor;
Items.Armor.LeatherPants.effect.defMod = 0.1;
Items.Armor.LeatherPants.effect.stamina = 1;

Items.Armor.BronzeLeggings = new Item("pants1", "B.Legs", ItemType.Armor);
Items.Armor.BronzeLeggings.price = 75;
Items.Armor.BronzeLeggings.sDesc = function() { return "bronze leggings"; }
Items.Armor.BronzeLeggings.lDesc = function() { return "a pair of simple bronze leggings"; }
Items.Armor.BronzeLeggings.Short = function() { return "Bronze leggings"; }
Items.Armor.BronzeLeggings.Long = function() { return "A pair of simple bronze leggings."; }
Items.Armor.BronzeLeggings.subtype = ItemSubtype.BotArmor;
Items.Armor.BronzeLeggings.effect.defMod = 0.2;
Items.Armor.BronzeLeggings.effect.stamina = 2;

Items.Armor.VinePanties = new Item("pants2", "V.Panties", ItemType.Armor);
Items.Armor.VinePanties.price = 200;
Items.Armor.VinePanties.sDesc = function() { return "vine panties"; }
Items.Armor.VinePanties.lDesc = function() { return "a pair of vine panties"; }
Items.Armor.VinePanties.Short = function() { return "Vine panties"; }
Items.Armor.VinePanties.Long = function() { return "A pair of vine panties."; }
Items.Armor.VinePanties.subtype = ItemSubtype.BotArmor;
Items.Armor.VinePanties.effect.defMod = 0.3;
Items.Armor.VinePanties.effect.stamina = 2;
Items.Armor.VinePanties.effect.libido = 3;
Items.Armor.VinePanties.effect.charisma = 2;

Items.Armor.SimpleRobes = new Item("robe0", "S.Robe", ItemType.Armor);
Items.Armor.SimpleRobes.price = 40;
Items.Armor.SimpleRobes.sDesc = function() { return "simple robe"; }
Items.Armor.SimpleRobes.lDesc = function() { return "simple cloth robe"; }
Items.Armor.SimpleRobes.Short = function() { return "Simple robe"; }
Items.Armor.SimpleRobes.Long = function() { return "Simple cloth robe."; }
Items.Armor.SimpleRobes.subtype = ItemSubtype.TopArmor;
Items.Armor.SimpleRobes.effect.defMod = 0;
Items.Armor.SimpleRobes.effect.intelligence = 1;
Items.Armor.SimpleRobes.effect.spirit = 1;

Items.Armor.MageRobes = new Item("robe1", "M.Robe", ItemType.Armor);
Items.Armor.MageRobes.price = 200;
Items.Armor.MageRobes.sDesc = function() { return "mage robe"; }
Items.Armor.MageRobes.lDesc = function() { return "stylized magician robe"; }
Items.Armor.MageRobes.Short = function() { return "Mage robe"; }
Items.Armor.MageRobes.Long = function() { return "Stylized magician robe."; }
Items.Armor.MageRobes.subtype = ItemSubtype.TopArmor;
Items.Armor.MageRobes.effect.defMod = 0.2;
Items.Armor.MageRobes.effect.intelligence = 4;
Items.Armor.MageRobes.effect.spirit = 3;

Items.Armor.StylizedClothes = new Item("cloth0", "S.Clothes", ItemType.Armor);
Items.Armor.StylizedClothes.price = 50;
Items.Armor.StylizedClothes.sDesc = function() { return "stylized clothes"; }
Items.Armor.StylizedClothes.lDesc = function() { return "stylish clothes, with an alluring cut"; }
Items.Armor.StylizedClothes.Short = function() { return "Stylized clothes"; }
Items.Armor.StylizedClothes.Long = function() { return "Stylish clothes, with an alluring cut."; }
Items.Armor.StylizedClothes.subtype = ItemSubtype.FullArmor;
Items.Armor.StylizedClothes.effect.defMod = 0;
Items.Armor.StylizedClothes.effect.charisma = 1;
Items.Armor.StylizedClothes.effect.libido = 1;

