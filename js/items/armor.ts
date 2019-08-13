import { Item, ItemType, ItemSubtype } from '../item';

let leatherChest = new Item("chest0", "L.Chest", ItemType.Armor);
leatherChest.price = 40;
leatherChest.sDesc = function() { return "leather chest"; }
leatherChest.lDesc = function() { return "a simple leather breastplate"; }
leatherChest.Short = function() { return "Leather chest"; }
leatherChest.Long = function() { return "A simple leather breastplate."; }
leatherChest.subtype = ItemSubtype.TopArmor;
leatherChest.effect.defMod = 0.1;
leatherChest.effect.stamina = 1;

let watchChest = new Item("chest1", "W.Uniform", ItemType.Armor);
watchChest.price = 200;
watchChest.sDesc = function() { return "watch uniform"; }
watchChest.lDesc = function() { return "a Rigard city watch uniform"; }
watchChest.Short = function() { return "Watch uniform"; }
watchChest.Long = function() { return "A Rigard city watch uniform."; }
watchChest.subtype = ItemSubtype.FullArmor;
watchChest.effect.defMod = 0.6;
watchChest.effect.stamina = 4;

let bronzeChest = new Item("chest2", "B.Chest", ItemType.Armor);
bronzeChest.price = 150;
bronzeChest.sDesc = function() { return "bronze chest"; }
bronzeChest.lDesc = function() { return "a simple bronze breastplate"; }
bronzeChest.Short = function() { return "Bronze chest"; }
bronzeChest.Long = function() { return "A simple bronze breastplate."; }
bronzeChest.subtype = ItemSubtype.TopArmor;
bronzeChest.effect.defMod = 0.3;
bronzeChest.effect.stamina = 2;

let vineBra = new Item("chest3", "V.Bra", ItemType.Armor);
vineBra.price = 300;
vineBra.sDesc = function() { return "vine bra"; }
vineBra.lDesc = function() { return "a vine bra"; }
vineBra.Short = function() { return "Vine bra"; }
vineBra.Long = function() { return "A vine bra."; }
vineBra.subtype = ItemSubtype.TopArmor;
vineBra.effect.defMod = 0.3;
vineBra.effect.stamina = 2;
vineBra.effect.libido = 3;
vineBra.effect.charisma = 2;

let leatherPants = new Item("pants0", "L.Pants", ItemType.Armor);
leatherPants.price = 20;
leatherPants.sDesc = function() { return "leather pants"; }
leatherPants.lDesc = function() { return "a pair of simple leather pants"; }
leatherPants.Short = function() { return "Leather pants"; }
leatherPants.Long = function() { return "A pair of simple leather pants."; }
leatherPants.subtype = ItemSubtype.BotArmor;
leatherPants.effect.defMod = 0.1;
leatherPants.effect.stamina = 1;

let bronzeLeggings = new Item("pants1", "B.Legs", ItemType.Armor);
bronzeLeggings.price = 75;
bronzeLeggings.sDesc = function() { return "bronze leggings"; }
bronzeLeggings.lDesc = function() { return "a pair of simple bronze leggings"; }
bronzeLeggings.Short = function() { return "Bronze leggings"; }
bronzeLeggings.Long = function() { return "A pair of simple bronze leggings."; }
bronzeLeggings.subtype = ItemSubtype.BotArmor;
bronzeLeggings.effect.defMod = 0.2;
bronzeLeggings.effect.stamina = 2;

let vinePanties = new Item("pants2", "V.Panties", ItemType.Armor);
vinePanties.price = 200;
vinePanties.sDesc = function() { return "vine panties"; }
vinePanties.lDesc = function() { return "a pair of vine panties"; }
vinePanties.Short = function() { return "Vine panties"; }
vinePanties.Long = function() { return "A pair of vine panties."; }
vinePanties.subtype = ItemSubtype.BotArmor;
vinePanties.effect.defMod = 0.3;
vinePanties.effect.stamina = 2;
vinePanties.effect.libido = 3;
vinePanties.effect.charisma = 2;

let simpleRobes = new Item("robe0", "S.Robe", ItemType.Armor);
simpleRobes.price = 40;
simpleRobes.sDesc = function() { return "simple robe"; }
simpleRobes.lDesc = function() { return "simple cloth robe"; }
simpleRobes.Short = function() { return "Simple robe"; }
simpleRobes.Long = function() { return "Simple cloth robe."; }
simpleRobes.subtype = ItemSubtype.TopArmor;
simpleRobes.effect.defMod = 0;
simpleRobes.effect.intelligence = 1;
simpleRobes.effect.spirit = 1;

let mageRobes = new Item("robe1", "M.Robe", ItemType.Armor);
mageRobes.price = 200;
mageRobes.sDesc = function() { return "mage robe"; }
mageRobes.lDesc = function() { return "stylized magician robe"; }
mageRobes.Short = function() { return "Mage robe"; }
mageRobes.Long = function() { return "Stylized magician robe."; }
mageRobes.subtype = ItemSubtype.TopArmor;
mageRobes.effect.defMod = 0.2;
mageRobes.effect.intelligence = 4;
mageRobes.effect.spirit = 3;

let stylizedClothes = new Item("cloth0", "S.Clothes", ItemType.Armor);
stylizedClothes.price = 50;
stylizedClothes.sDesc = function() { return "stylized clothes"; }
stylizedClothes.lDesc = function() { return "stylish clothes, with an alluring cut"; }
stylizedClothes.Short = function() { return "Stylized clothes"; }
stylizedClothes.Long = function() { return "Stylish clothes, with an alluring cut."; }
stylizedClothes.subtype = ItemSubtype.FullArmor;
stylizedClothes.effect.defMod = 0;
stylizedClothes.effect.charisma = 1;
stylizedClothes.effect.libido = 1;

export namespace ArmorItems {
    export const LeatherChest = leatherChest;
    export const WatchChest = watchChest;
    export const BronzeChest = bronzeChest;
    export const VineBra = vineBra;
    export const LeatherPants = leatherPants;
    export const BronzeLeggings = bronzeLeggings;
    export const VinePanties = vinePanties;
    export const SimpleRobes = simpleRobes;
    export const MageRobes = mageRobes;
    export const StylizedClothes = stylizedClothes;
}
