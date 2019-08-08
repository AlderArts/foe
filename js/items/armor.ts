import { Item, ItemType, ItemSubtype } from '../item';

let ArmorItems : any = {};

ArmorItems.LeatherChest = new Item("chest0", "L.Chest", ItemType.Armor);
ArmorItems.LeatherChest.price = 40;
ArmorItems.LeatherChest.sDesc = function() { return "leather chest"; }
ArmorItems.LeatherChest.lDesc = function() { return "a simple leather breastplate"; }
ArmorItems.LeatherChest.Short = function() { return "Leather chest"; }
ArmorItems.LeatherChest.Long = function() { return "A simple leather breastplate."; }
ArmorItems.LeatherChest.subtype = ItemSubtype.TopArmor;
ArmorItems.LeatherChest.effect.defMod = 0.1;
ArmorItems.LeatherChest.effect.stamina = 1;

ArmorItems.WatchChest = new Item("chest1", "W.Uniform", ItemType.Armor);
ArmorItems.WatchChest.price = 200;
ArmorItems.WatchChest.sDesc = function() { return "watch uniform"; }
ArmorItems.WatchChest.lDesc = function() { return "a Rigard city watch uniform"; }
ArmorItems.WatchChest.Short = function() { return "Watch uniform"; }
ArmorItems.WatchChest.Long = function() { return "A Rigard city watch uniform."; }
ArmorItems.WatchChest.subtype = ItemSubtype.FullArmor;
ArmorItems.WatchChest.effect.defMod = 0.6;
ArmorItems.WatchChest.effect.stamina = 4;

ArmorItems.BronzeChest = new Item("chest2", "B.Chest", ItemType.Armor);
ArmorItems.BronzeChest.price = 150;
ArmorItems.BronzeChest.sDesc = function() { return "bronze chest"; }
ArmorItems.BronzeChest.lDesc = function() { return "a simple bronze breastplate"; }
ArmorItems.BronzeChest.Short = function() { return "Bronze chest"; }
ArmorItems.BronzeChest.Long = function() { return "A simple bronze breastplate."; }
ArmorItems.BronzeChest.subtype = ItemSubtype.TopArmor;
ArmorItems.BronzeChest.effect.defMod = 0.3;
ArmorItems.BronzeChest.effect.stamina = 2;

ArmorItems.VineBra = new Item("chest3", "V.Bra", ItemType.Armor);
ArmorItems.VineBra.price = 300;
ArmorItems.VineBra.sDesc = function() { return "vine bra"; }
ArmorItems.VineBra.lDesc = function() { return "a vine bra"; }
ArmorItems.VineBra.Short = function() { return "Vine bra"; }
ArmorItems.VineBra.Long = function() { return "A vine bra."; }
ArmorItems.VineBra.subtype = ItemSubtype.TopArmor;
ArmorItems.VineBra.effect.defMod = 0.3;
ArmorItems.VineBra.effect.stamina = 2;
ArmorItems.VineBra.effect.libido = 3;
ArmorItems.VineBra.effect.charisma = 2;

ArmorItems.LeatherPants = new Item("pants0", "L.Pants", ItemType.Armor);
ArmorItems.LeatherPants.price = 20;
ArmorItems.LeatherPants.sDesc = function() { return "leather pants"; }
ArmorItems.LeatherPants.lDesc = function() { return "a pair of simple leather pants"; }
ArmorItems.LeatherPants.Short = function() { return "Leather pants"; }
ArmorItems.LeatherPants.Long = function() { return "A pair of simple leather pants."; }
ArmorItems.LeatherPants.subtype = ItemSubtype.BotArmor;
ArmorItems.LeatherPants.effect.defMod = 0.1;
ArmorItems.LeatherPants.effect.stamina = 1;

ArmorItems.BronzeLeggings = new Item("pants1", "B.Legs", ItemType.Armor);
ArmorItems.BronzeLeggings.price = 75;
ArmorItems.BronzeLeggings.sDesc = function() { return "bronze leggings"; }
ArmorItems.BronzeLeggings.lDesc = function() { return "a pair of simple bronze leggings"; }
ArmorItems.BronzeLeggings.Short = function() { return "Bronze leggings"; }
ArmorItems.BronzeLeggings.Long = function() { return "A pair of simple bronze leggings."; }
ArmorItems.BronzeLeggings.subtype = ItemSubtype.BotArmor;
ArmorItems.BronzeLeggings.effect.defMod = 0.2;
ArmorItems.BronzeLeggings.effect.stamina = 2;

ArmorItems.VinePanties = new Item("pants2", "V.Panties", ItemType.Armor);
ArmorItems.VinePanties.price = 200;
ArmorItems.VinePanties.sDesc = function() { return "vine panties"; }
ArmorItems.VinePanties.lDesc = function() { return "a pair of vine panties"; }
ArmorItems.VinePanties.Short = function() { return "Vine panties"; }
ArmorItems.VinePanties.Long = function() { return "A pair of vine panties."; }
ArmorItems.VinePanties.subtype = ItemSubtype.BotArmor;
ArmorItems.VinePanties.effect.defMod = 0.3;
ArmorItems.VinePanties.effect.stamina = 2;
ArmorItems.VinePanties.effect.libido = 3;
ArmorItems.VinePanties.effect.charisma = 2;

ArmorItems.SimpleRobes = new Item("robe0", "S.Robe", ItemType.Armor);
ArmorItems.SimpleRobes.price = 40;
ArmorItems.SimpleRobes.sDesc = function() { return "simple robe"; }
ArmorItems.SimpleRobes.lDesc = function() { return "simple cloth robe"; }
ArmorItems.SimpleRobes.Short = function() { return "Simple robe"; }
ArmorItems.SimpleRobes.Long = function() { return "Simple cloth robe."; }
ArmorItems.SimpleRobes.subtype = ItemSubtype.TopArmor;
ArmorItems.SimpleRobes.effect.defMod = 0;
ArmorItems.SimpleRobes.effect.intelligence = 1;
ArmorItems.SimpleRobes.effect.spirit = 1;

ArmorItems.MageRobes = new Item("robe1", "M.Robe", ItemType.Armor);
ArmorItems.MageRobes.price = 200;
ArmorItems.MageRobes.sDesc = function() { return "mage robe"; }
ArmorItems.MageRobes.lDesc = function() { return "stylized magician robe"; }
ArmorItems.MageRobes.Short = function() { return "Mage robe"; }
ArmorItems.MageRobes.Long = function() { return "Stylized magician robe."; }
ArmorItems.MageRobes.subtype = ItemSubtype.TopArmor;
ArmorItems.MageRobes.effect.defMod = 0.2;
ArmorItems.MageRobes.effect.intelligence = 4;
ArmorItems.MageRobes.effect.spirit = 3;

ArmorItems.StylizedClothes = new Item("cloth0", "S.Clothes", ItemType.Armor);
ArmorItems.StylizedClothes.price = 50;
ArmorItems.StylizedClothes.sDesc = function() { return "stylized clothes"; }
ArmorItems.StylizedClothes.lDesc = function() { return "stylish clothes, with an alluring cut"; }
ArmorItems.StylizedClothes.Short = function() { return "Stylized clothes"; }
ArmorItems.StylizedClothes.Long = function() { return "Stylish clothes, with an alluring cut."; }
ArmorItems.StylizedClothes.subtype = ItemSubtype.FullArmor;
ArmorItems.StylizedClothes.effect.defMod = 0;
ArmorItems.StylizedClothes.effect.charisma = 1;
ArmorItems.StylizedClothes.effect.libido = 1;

export { ArmorItems };
