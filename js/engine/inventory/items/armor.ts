import { Item, ItemSubtype, ItemType } from "../item";

const leatherChest = new Item("chest0", "L.Chest", ItemType.Armor);
leatherChest.price = 40;
leatherChest.sDesc = () => "leather chest";
leatherChest.lDesc = () => "a simple leather breastplate";
leatherChest.Short = () => "Leather chest";
leatherChest.Long = () => "A simple leather breastplate.";
leatherChest.subtype = ItemSubtype.TopArmor;
leatherChest.effect.defMod = 0.1;
leatherChest.effect.stamina = 1;

const watchChest = new Item("chest1", "W.Uniform", ItemType.Armor);
watchChest.price = 200;
watchChest.sDesc = () => "watch uniform";
watchChest.lDesc = () => "a Rigard city watch uniform";
watchChest.Short = () => "Watch uniform";
watchChest.Long = () => "A Rigard city watch uniform.";
watchChest.subtype = ItemSubtype.FullArmor;
watchChest.effect.defMod = 0.6;
watchChest.effect.stamina = 4;

const bronzeChest = new Item("chest2", "B.Chest", ItemType.Armor);
bronzeChest.price = 150;
bronzeChest.sDesc = () => "bronze chest";
bronzeChest.lDesc = () => "a simple bronze breastplate";
bronzeChest.Short = () => "Bronze chest";
bronzeChest.Long = () => "A simple bronze breastplate.";
bronzeChest.subtype = ItemSubtype.TopArmor;
bronzeChest.effect.defMod = 0.3;
bronzeChest.effect.stamina = 2;

const vineBra = new Item("chest3", "V.Bra", ItemType.Armor);
vineBra.price = 300;
vineBra.sDesc = () => "vine bra";
vineBra.lDesc = () => "a vine bra";
vineBra.Short = () => "Vine bra";
vineBra.Long = () => "A vine bra.";
vineBra.subtype = ItemSubtype.TopArmor;
vineBra.effect.defMod = 0.3;
vineBra.effect.stamina = 2;
vineBra.effect.libido = 3;
vineBra.effect.charisma = 2;

const leatherPants = new Item("pants0", "L.Pants", ItemType.Armor);
leatherPants.price = 20;
leatherPants.sDesc = () => "leather pants";
leatherPants.lDesc = () => "a pair of simple leather pants";
leatherPants.Short = () => "Leather pants";
leatherPants.Long = () => "A pair of simple leather pants.";
leatherPants.subtype = ItemSubtype.BotArmor;
leatherPants.effect.defMod = 0.1;
leatherPants.effect.stamina = 1;

const bronzeLeggings = new Item("pants1", "B.Legs", ItemType.Armor);
bronzeLeggings.price = 75;
bronzeLeggings.sDesc = () => "bronze leggings";
bronzeLeggings.lDesc = () => "a pair of simple bronze leggings";
bronzeLeggings.Short = () => "Bronze leggings";
bronzeLeggings.Long = () => "A pair of simple bronze leggings.";
bronzeLeggings.subtype = ItemSubtype.BotArmor;
bronzeLeggings.effect.defMod = 0.2;
bronzeLeggings.effect.stamina = 2;

const vinePanties = new Item("pants2", "V.Panties", ItemType.Armor);
vinePanties.price = 200;
vinePanties.sDesc = () => "vine panties";
vinePanties.lDesc = () => "a pair of vine panties";
vinePanties.Short = () => "Vine panties";
vinePanties.Long = () => "A pair of vine panties.";
vinePanties.subtype = ItemSubtype.BotArmor;
vinePanties.effect.defMod = 0.3;
vinePanties.effect.stamina = 2;
vinePanties.effect.libido = 3;
vinePanties.effect.charisma = 2;

const simpleRobes = new Item("robe0", "S.Robe", ItemType.Armor);
simpleRobes.price = 40;
simpleRobes.sDesc = () => "simple robe";
simpleRobes.lDesc = () => "simple cloth robe";
simpleRobes.Short = () => "Simple robe";
simpleRobes.Long = () => "Simple cloth robe.";
simpleRobes.subtype = ItemSubtype.TopArmor;
simpleRobes.effect.defMod = 0;
simpleRobes.effect.intelligence = 1;
simpleRobes.effect.spirit = 1;

const mageRobes = new Item("robe1", "M.Robe", ItemType.Armor);
mageRobes.price = 200;
mageRobes.sDesc = () => "mage robe";
mageRobes.lDesc = () => "stylized magician robe";
mageRobes.Short = () => "Mage robe";
mageRobes.Long = () => "Stylized magician robe.";
mageRobes.subtype = ItemSubtype.TopArmor;
mageRobes.effect.defMod = 0.2;
mageRobes.effect.intelligence = 4;
mageRobes.effect.spirit = 3;

const stylizedClothes = new Item("cloth0", "S.Clothes", ItemType.Armor);
stylizedClothes.price = 50;
stylizedClothes.sDesc = () => "stylized clothes";
stylizedClothes.lDesc = () => "stylish clothes, with an alluring cut";
stylizedClothes.Short = () => "Stylized clothes";
stylizedClothes.Long = () => "Stylish clothes, with an alluring cut.";
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
