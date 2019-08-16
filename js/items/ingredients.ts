import { Entity } from "../entity";
import { GAME } from "../GAME";
import { Item, ItemType } from "../item";
import { Text } from "../text";

const horseHair = new Item("equin1", "Horse hair", ItemType.Ingredient);
horseHair.price = 1;
horseHair.sDesc = () => "horse hair";
horseHair.Short = () => "Hair from a horse";
horseHair.Long = () => "The hair of a horse, consisting of long fine strands.";

const horseShoe = new Item("equin2", "Horseshoe", ItemType.Ingredient);
horseShoe.price = 1;
horseShoe.sDesc = () => "horseshoe";
horseShoe.Short = () => "A horseshoe";
horseShoe.Long = () => "A horseshoe, made of metal.";

const horseCum = new Item("equin3", "E.Fluid", ItemType.Ingredient);
horseCum.price = 2;
horseCum.sDesc = () => "sticky equine fluids";
horseCum.Long = () => "Sticky equine fluids of uncertain origin, contained in a bottle.";

const rabbitFoot = new Item("lago1", "Rabbit foot", ItemType.Ingredient);
rabbitFoot.price = 1;
rabbitFoot.sDesc = () => "lucky charm";
rabbitFoot.Short = () => "A lucky charm";
rabbitFoot.Long = () => "A lucky charm in the form of a rabbit's foot.";

const carrotJuice = new Item("lago2", "Carrot juice", ItemType.Ingredient);
carrotJuice.price = 1;
carrotJuice.sDesc = () => "carrot juice";
carrotJuice.Short = () => "A bottle of carrot juice";
carrotJuice.Long = () => "A bottle containing a deeply orange juice, made from pressed carrots.";

const lettuce = new Item("lago3", "Lettuce", ItemType.Ingredient);
lettuce.price = 1;
lettuce.sDesc = () => "lettuce";
lettuce.Short = () => "A leaf of lettuce";
lettuce.Long = () => "A leaf of lettuce, sweet, healthy and crunchy.";

const whiskers = new Item("felin1", "Whiskers", ItemType.Ingredient);
whiskers.price = 1;
whiskers.sDesc = () => "whiskers";
whiskers.Short = () => "A cat's whiskers";
whiskers.Long = () => "The whiskers from a cat of some kind.";

const hairBall = new Item("felin2", "Hair ball", ItemType.Ingredient);
hairBall.price = 1;
hairBall.sDesc = () => "hair ball";
hairBall.Short = () => "Eww...";
hairBall.Long = () => "Looks like something a cat coughed up.";

const catClaw = new Item("felin3", "Cat claw", ItemType.Ingredient);
catClaw.price = 1;
catClaw.sDesc = () => "cat claw";
catClaw.Short = () => "A claw from a cat";
catClaw.Long = () => "Sharp cat claws.";

const snakeOil = new Item("rept1", "Oil", ItemType.Ingredient);
snakeOil.price = 1;
snakeOil.sDesc = () => "snake oil";
snakeOil.Long = () => "An oil that could perhaps be used by for massage.";

const lizardScale = new Item("rept2", "L.Scale", ItemType.Ingredient);
lizardScale.price = 1;
lizardScale.sDesc = () => "lizard scale";
lizardScale.Long = () => "A brightly shining scale, polished by the desert sands.";

const lizardEgg = new Item("rept3", "L.Egg", ItemType.Ingredient);
lizardEgg.price = 2;
lizardEgg.sDesc = () => "lizard egg";
lizardEgg.Long = () => "An unfertilized lizard egg. Good for a snack.";
lizardEgg.Use = (target: Entity) => {
	target.AddHPFraction(0.02);
	const parse: any = { name: target.NameDesc(), s: target === GAME().player ? "" : "s" };
	Text.Add("[name] eat[s] a lizard egg. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
};

const snakeFang = new Item("rept4", "S.Fang", ItemType.Ingredient);
snakeFang.price = 1;
snakeFang.sDesc = () => "snake fang";
snakeFang.Long = () => "A sharp, venomous fang from some sort of reptile.";

const snakeSkin = new Item("rept5", "S.Skin", ItemType.Ingredient);
snakeSkin.price = 1;
snakeSkin.sDesc = () => "snake skin";
snakeSkin.Long = () => "The shed skin from a large snake.";

const goatMilk = new Item("goat1", "G.Milk", ItemType.Ingredient);
goatMilk.price = 2;
goatMilk.sDesc = () => "goat milk";
goatMilk.Long = () => "A bottle of goat milk.";
goatMilk.Use = (target: Entity) => {
	target.AddHPFraction(0.02);
	const parse: any = { name: target.NameDesc(), s: target === GAME().player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
};

const goatFleece = new Item("goat2", "Goat fleece", ItemType.Ingredient);
goatFleece.price = 1;
goatFleece.sDesc = () => "goat fleece";
goatFleece.Long = () => "Fleece from a goat, tough and stringy.";

const sheepMilk = new Item("ovis1", "S.Milk", ItemType.Ingredient);
sheepMilk.price = 2;
sheepMilk.sDesc = () => "sheep milk";
sheepMilk.Long = () => "A bottle of sheep milk.";
sheepMilk.Use = (target: Entity) => {
	target.AddHPFraction(0.02);
	const parse: any = { name: target.NameDesc(), s: target === GAME().player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
};

const ramshorn = new Item("ovis2", "Ramshorn", ItemType.Ingredient);
ramshorn.price = 1;
ramshorn.sDesc = () => "ramshorn";
ramshorn.Long = () => "A curled horn from a sheep.";

const cowMilk = new Item("bov1", "Milk", ItemType.Ingredient);
cowMilk.price = 2;
cowMilk.sDesc = () => "cow milk";
cowMilk.Long = () => "A bottle of ordinary cow milk.";
cowMilk.Use = (target: Entity) => {
	target.AddHPFraction(0.02);
	const parse: any = { name: target.NameDesc(), s: target === GAME().player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
};

const cowBell = new Item("bov2", "Cowbell", ItemType.Ingredient);
cowBell.price = 2;
cowBell.sDesc = () => "cowbell";
cowBell.Short = () => "A cowbell";
cowBell.Long = () => "A small bell on a string, used to call cows.";

const freshGrass = new Item("bov3", "Grass", ItemType.Ingredient);
freshGrass.price = 1;
freshGrass.sDesc = () => "fresh grass";
freshGrass.Short = () => "Fresh green grass";
freshGrass.Long = () => "A handful of green grass.";

const canisRoot = new Item("dog1", "Canis root", ItemType.Ingredient);
canisRoot.price = 1;
canisRoot.sDesc = () => "canis root";
canisRoot.Short = () => "A root";
canisRoot.Long = () => "A strange, knotty root.";

const dogBone = new Item("dog2", "Dog bone", ItemType.Ingredient);
dogBone.price = 1;
dogBone.sDesc = () => "dog bone";
dogBone.Short = () => "A dog bone";
dogBone.Long = () => "A bone, chewed to the marrow. It looks like it has been buried at least once.";

const dogBiscuit = new Item("dog3", "Biscuit", ItemType.Ingredient);
dogBiscuit.price = 3;
dogBiscuit.sDesc = () => "dog biscuit";
dogBiscuit.Short = () => "A dog biscuit";
dogBiscuit.Long = () => "A biscuit, commonly given to dogs as a reward. It doesn't taste very good.";
dogBiscuit.Use = (target: Entity) => {
	target.AddHPFraction(0.02);
	const parse: any = { name: target.NameDesc(), s: target === GAME().player ? "" : "s" };
	Text.Add("[name] chew[s] on a dog biscuit. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
};

const wolfFang = new Item("wolf2", "Fang", ItemType.Ingredient);
wolfFang.price = 1;
wolfFang.sDesc = () => "canine fang";
wolfFang.Short = () => "A canid fang";
wolfFang.Long = () => "A fang from some form of canid predator.";

const wolfsbane = new Item("wolf3", "Wolfsbane", ItemType.Ingredient);
wolfsbane.price = 3;
wolfsbane.sDesc = () => "wolfsbane";
wolfsbane.Short = () => "A wolfsbane flower";
wolfsbane.Long = () => "Wolfsbane, a poisonous flower.";

const foxBerries = new Item("fox2", "Fox berries", ItemType.Ingredient);
foxBerries.price = 1;
foxBerries.sDesc = () => "fox berries";
foxBerries.Short = () => "A handful of fox berries";
foxBerries.Long = () => "A handful of fox berries. Possibly toxic.";

const foxglove = new Item("fox3", "Foxglove", ItemType.Ingredient);
foxglove.price = 1;
foxglove.sDesc = () => "foxglove";
foxglove.Short = () => "A foxglove flower";
foxglove.Long = () => "A foxglove flower, commonly found on meadows.";

const corruptPlant = new Item("demon1", "Corrupt plant", ItemType.Ingredient);
corruptPlant.price = 0;
corruptPlant.sDesc = () => "strange plant";
corruptPlant.Short = () => "A strange plant";
corruptPlant.Long = () => "A strange plant, corrupted by some evil power.";

const blackGem = new Item("demon2", "Black gem", ItemType.Ingredient);
blackGem.price = 20;
blackGem.sDesc = () => "obsidian gem";
blackGem.Short = () => "An obsidian gem";
blackGem.Long = () => "A black gemstone. It is slightly warm to the touch.";

const corruptSeed = new Item("demon3", "Corrupt seed", ItemType.Ingredient);
corruptSeed.price = 0;
corruptSeed.sDesc = () => "corrupted seed";
corruptSeed.Long = () => "The semen of some corrupted creature, stored in a vial.";

const demonSeed = new Item("demon4", "Demon seed", ItemType.Ingredient);
demonSeed.price = 0;
demonSeed.sDesc = () => "demonic seed";
demonSeed.Long = () => "A vial filled with demon cum.";
demonSeed.Use = (target: Entity) => {
	target.AddLustFraction(0.1);
	target.RestoreCum(2);
	const parse: any = {
		name: target.NameDesc(),
		s: target === GAME().player ? "" : "s",
		hisher : target.hisher(),
	};
	Text.Add("[name] swallow[s] a vial of demonic seed. Lust courses through [hisher] veins.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
};

const hummus = new Item("human1", "Hummus", ItemType.Ingredient);
hummus.price = 2;
hummus.sDesc = () => "hummus";
hummus.Short = () => "Hummus. Looks edible";
hummus.Long = () => "Hummus: a foodlike substance.";
hummus.Use = (target: Entity) => {
	target.AddHPFraction(0.03);
	const parse: any = { name: target.NameDesc(), s: target === GAME().player ? "" : "s" };
	Text.Add("[name] eat[s] some hummus. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
};

const springWater = new Item("human2", "Spring water", ItemType.Ingredient);
springWater.price = 1;
springWater.sDesc = () => "spring water";
springWater.Short = () => "A vial of clear water";
springWater.Long = () => "A vial of pure spring water.";

const letter = new Item("human3", "Letter", ItemType.Ingredient);
letter.price = 1;
letter.sDesc = () => "letter";
letter.Short = () => "A letter";
letter.Long = () => "A miserable pile of secrets.";

const feather = new Item("avian1", "Feather", ItemType.Ingredient);
feather.price = 1;
feather.sDesc = () => "bird feather";
feather.Short = () => "A bird feather";
feather.Long = () => "The feather of some kind of bird.";

const trinket = new Item("avian2", "Trinket", ItemType.Ingredient);
trinket.price = 1;
trinket.sDesc = () => "shiny trinket";
trinket.Short = () => "A shiny trinket";
trinket.Long = () => "A shiny trinket, pretty but with little to no value.";

const fruitSeed = new Item("avian3", "Fruit seed", ItemType.Ingredient);
fruitSeed.price = 1;
fruitSeed.sDesc = () => "fruit seed";
fruitSeed.Short = () => "Seed from a fruit";
fruitSeed.Long = () => "The seed of a fruit or berry of some kind.";

const pipeLeaf = new Item("avian4", "Pipeleaf", ItemType.Ingredient);
pipeLeaf.price = 1;
pipeLeaf.sDesc = () => "pipeleaf";
pipeLeaf.Long = () => "A strong pipeleaf - a mixture of several dried herbs.";

const mFluff = new Item("moth1", "M.Fluff", ItemType.Ingredient);
mFluff.price = 1;
mFluff.sDesc = () => "moth fluff";
mFluff.Short = () => "A wad of moth fluff";
mFluff.Long = () => "The soft fluff from a moth.";

const mDust = new Item("moth2", "M.Dust", ItemType.Ingredient);
mDust.price = 1;
mDust.sDesc = () => "moth dust";
mDust.Short = () => "A measure of moth dust";
mDust.Long = () => "A measure of sparkly moth dust.";

const stinger = new Item("scorp1", "Stinger", ItemType.Ingredient);
stinger.price = 2;
stinger.sDesc = () => "scorpion stinger";
stinger.Short = () => "A stinger";
stinger.Long = () => "The stinger from some kind of insect.";

const sVenom = new Item("scorp2", "S.Venom", ItemType.Ingredient);
sVenom.price = 3;
sVenom.sDesc = () => "scorpion venom";
sVenom.Short = () => "A vial of venom";
sVenom.Long = () => "A tiny vial of unprocessed scorpion venom.";

const sClaw = new Item("scorp3", "S.Claw", ItemType.Ingredient);
sClaw.price = 2;
sClaw.sDesc = () => "black claw";
sClaw.Short = () => "A black claw";
sClaw.Long = () => "A black, menacing-looking scorpion claw.";

const treeBark = new Item("deer1", "Tree bark", ItemType.Ingredient);
treeBark.price = 1;
treeBark.sDesc = () => "tree bark";
treeBark.Short = () => "Some tree bark";
treeBark.Long = () => "A chip of tough tree bark.";

const antlerChip = new Item("deer2", "Antler chip", ItemType.Ingredient);
antlerChip.price = 1;
antlerChip.sDesc = () => "antler chip";
antlerChip.Short = () => "An antler chip";
antlerChip.Long = () => "A small chip of an antler, probably from a deer.";

const flowerPetal = new Item("plant1", "Flower petal", ItemType.Ingredient);
flowerPetal.price = 1;
flowerPetal.sDesc = () => "flower petal";
flowerPetal.Short = () => "A flower petal";
flowerPetal.Long = () => "A petal from a beautiful flower.";

const rawHoney = new Item("bee1", "Raw honey", ItemType.Ingredient);
rawHoney.price = 5;
rawHoney.sDesc = () => "raw honey";
rawHoney.Short = () => "Raw honey";
rawHoney.Long = () => "A small jar of raw honey.";
rawHoney.Use = (target: Entity) => {
	target.AddHPFraction(0.02);
	const parse: any = { name: target.NameDesc(), s: target === GAME().player ? "" : "s" };
	Text.Add("[name] eat[s] a small jar of sweet honey. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
};

const beeChitin = new Item("bee2", "Bee chitin", ItemType.Ingredient);
beeChitin.price = 1;
beeChitin.sDesc = () => "bee chitin";
beeChitin.Short = () => "Some bee chitin";
beeChitin.Long = () => "A small scrap of hard bee chitin.";

export namespace IngredientItems {
	export const HorseHair = horseHair;
	export const HorseShoe = horseShoe;
	export const HorseCum = horseCum;
	export const RabbitFoot = rabbitFoot;
	export const CarrotJuice = carrotJuice;
	export const Lettuce = lettuce;
	export const Whiskers = whiskers;
	export const HairBall = hairBall;
	export const CatClaw = catClaw;
	export const SnakeOil = snakeOil;
	export const LizardScale = lizardScale;
	export const LizardEgg = lizardEgg;
	export const SnakeFang = snakeFang;
	export const SnakeSkin = snakeSkin;
	export const GoatMilk = goatMilk;
	export const GoatFleece = goatFleece;
	export const SheepMilk = sheepMilk;
	export const Ramshorn = ramshorn;
	export const CowMilk = cowMilk;
	export const CowBell = cowBell;
	export const FreshGrass = freshGrass;
	export const CanisRoot = canisRoot;
	export const DogBone = dogBone;
	export const DogBiscuit = dogBiscuit;
	export const WolfFang = wolfFang;
	export const Wolfsbane = wolfsbane;
	export const FoxBerries = foxBerries;
	export const Foxglove = foxglove;
	export const CorruptPlant = corruptPlant;
	export const BlackGem = blackGem;
	export const CorruptSeed = corruptSeed;
	export const DemonSeed = demonSeed;
	export const Hummus = hummus;
	export const SpringWater = springWater;
	export const Letter = letter;
	export const Feather = feather;
	export const Trinket = trinket;
	export const FruitSeed = fruitSeed;
	export const PipeLeaf = pipeLeaf;
	export const MFluff = mFluff;
	export const MDust = mDust;
	export const Stinger = stinger;
	export const SVenom = sVenom;
	export const SClaw = sClaw;
	export const TreeBark = treeBark;
	export const AntlerChip = antlerChip;
	export const FlowerPetal = flowerPetal;
	export const RawHoney = rawHoney;
	export const BeeChitin = beeChitin;
}
