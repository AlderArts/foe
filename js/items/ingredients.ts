import { Item, ItemType } from '../item';
import { GAME } from '../GAME';
import { Text } from '../text';
import { Entity } from '../entity';


let horseHair = new Item("equin1", "Horse hair", ItemType.Ingredient);
horseHair.price = 1;
horseHair.sDesc = function() { return "horse hair"; }
horseHair.Short = function() { return "Hair from a horse"; }
horseHair.Long = function() { return "The hair of a horse, consisting of long fine strands."; }

let horseShoe = new Item("equin2", "Horseshoe", ItemType.Ingredient);
horseShoe.price = 1;
horseShoe.sDesc = function() { return "horseshoe"; }
horseShoe.Short = function() { return "A horseshoe"; }
horseShoe.Long = function() { return "A horseshoe, made of metal."; }

let horseCum = new Item("equin3", "E.Fluid", ItemType.Ingredient);
horseCum.price = 2;
horseCum.sDesc = function() { return "sticky equine fluids"; }
horseCum.Long = function() { return "Sticky equine fluids of uncertain origin, contained in a bottle."; }



let rabbitFoot = new Item("lago1", "Rabbit foot", ItemType.Ingredient);
rabbitFoot.price = 1;
rabbitFoot.sDesc = function() { return "lucky charm"; }
rabbitFoot.Short = function() { return "A lucky charm"; }
rabbitFoot.Long = function() { return "A lucky charm in the form of a rabbit's foot."; }

let carrotJuice = new Item("lago2", "Carrot juice", ItemType.Ingredient);
carrotJuice.price = 1;
carrotJuice.sDesc = function() { return "carrot juice"; }
carrotJuice.Short = function() { return "A bottle of carrot juice"; }
carrotJuice.Long = function() { return "A bottle containing a deeply orange juice, made from pressed carrots."; }

let lettuce = new Item("lago3", "Lettuce", ItemType.Ingredient);
lettuce.price = 1;
lettuce.sDesc = function() { return "lettuce"; }
lettuce.Short = function() { return "A leaf of lettuce"; }
lettuce.Long = function() { return "A leaf of lettuce, sweet, healthy and crunchy."; }



let whiskers = new Item("felin1", "Whiskers", ItemType.Ingredient);
whiskers.price = 1;
whiskers.sDesc = function() { return "whiskers"; }
whiskers.Short = function() { return "A cat's whiskers"; }
whiskers.Long = function() { return "The whiskers from a cat of some kind."; }

let hairBall = new Item("felin2", "Hair ball", ItemType.Ingredient);
hairBall.price = 1;
hairBall.sDesc = function() { return "hair ball"; }
hairBall.Short = function() { return "Eww..."; }
hairBall.Long = function() { return "Looks like something a cat coughed up."; }

let catClaw = new Item("felin3", "Cat claw", ItemType.Ingredient);
catClaw.price = 1;
catClaw.sDesc = function() { return "cat claw"; }
catClaw.Short = function() { return "A claw from a cat"; }
catClaw.Long = function() { return "Sharp cat claws."; }



let snakeOil = new Item("rept1", "Oil", ItemType.Ingredient);
snakeOil.price = 1;
snakeOil.sDesc = function() { return "snake oil"; }
snakeOil.Long = function() { return "An oil that could perhaps be used by for massage."; }

let lizardScale = new Item("rept2", "L.Scale", ItemType.Ingredient);
lizardScale.price = 1;
lizardScale.sDesc = function() { return "lizard scale"; }
lizardScale.Long = function() { return "A brightly shining scale, polished by the desert sands."; }

let lizardEgg = new Item("rept3", "L.Egg", ItemType.Ingredient);
lizardEgg.price = 2;
lizardEgg.sDesc = function() { return "lizard egg"; }
lizardEgg.Long = function() { return "An unfertilized lizard egg. Good for a snack."; }
lizardEgg.Use = function(target : Entity) {
	target.AddHPFraction(0.02);
	var parse : any = { name: target.NameDesc(), s: target == GAME().player ? "" : "s" };
	Text.Add("[name] eat[s] a lizard egg. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

let snakeFang = new Item("rept4", "S.Fang", ItemType.Ingredient);
snakeFang.price = 1;
snakeFang.sDesc = function() { return "snake fang"; }
snakeFang.Long = function() { return "A sharp, venomous fang from some sort of reptile."; }

let snakeSkin = new Item("rept5", "S.Skin", ItemType.Ingredient);
snakeSkin.price = 1;
snakeSkin.sDesc = function() { return "snake skin"; }
snakeSkin.Long = function() { return "The shed skin from a large snake."; }



let goatMilk = new Item("goat1", "G.Milk", ItemType.Ingredient);
goatMilk.price = 2;
goatMilk.sDesc = function() { return "goat milk"; }
goatMilk.Long = function() { return "A bottle of goat milk."; }
goatMilk.Use = function(target : Entity) {
	target.AddHPFraction(0.02);
	var parse : any = { name: target.NameDesc(), s: target == GAME().player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

let goatFleece = new Item("goat2", "Goat fleece", ItemType.Ingredient);
goatFleece.price = 1;
goatFleece.sDesc = function() { return "goat fleece"; }
goatFleece.Long = function() { return "Fleece from a goat, tough and stringy."; }


let sheepMilk = new Item("ovis1", "S.Milk", ItemType.Ingredient);
sheepMilk.price = 2;
sheepMilk.sDesc = function() { return "sheep milk"; }
sheepMilk.Long = function() { return "A bottle of sheep milk."; }
sheepMilk.Use = function(target : Entity) {
	target.AddHPFraction(0.02);
	var parse : any = { name: target.NameDesc(), s: target == GAME().player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

let ramshorn = new Item("ovis2", "Ramshorn", ItemType.Ingredient);
ramshorn.price = 1;
ramshorn.sDesc = function() { return "ramshorn"; }
ramshorn.Long = function() { return "A curled horn from a sheep."; }



let cowMilk = new Item("bov1", "Milk", ItemType.Ingredient);
cowMilk.price = 2;
cowMilk.sDesc = function() { return "cow milk"; }
cowMilk.Long = function() { return "A bottle of ordinary cow milk."; }
cowMilk.Use = function(target : Entity) {
	target.AddHPFraction(0.02);
	var parse : any = { name: target.NameDesc(), s: target == GAME().player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

let cowBell = new Item("bov2", "Cowbell", ItemType.Ingredient);
cowBell.price = 2;
cowBell.sDesc = function() { return "cowbell"; }
cowBell.Short = function() { return "A cowbell"; }
cowBell.Long = function() { return "A small bell on a string, used to call cows."; }

let freshGrass = new Item("bov3", "Grass", ItemType.Ingredient);
freshGrass.price = 1;
freshGrass.sDesc = function() { return "fresh grass"; }
freshGrass.Short = function() { return "Fresh green grass"; }
freshGrass.Long = function() { return "A handful of green grass."; }



let canisRoot = new Item("dog1", "Canis root", ItemType.Ingredient);
canisRoot.price = 1;
canisRoot.sDesc = function() { return "canis root"; }
canisRoot.Short = function() { return "A root"; }
canisRoot.Long = function() { return "A strange, knotty root."; }

let dogBone = new Item("dog2", "Dog bone", ItemType.Ingredient);
dogBone.price = 1;
dogBone.sDesc = function() { return "dog bone"; }
dogBone.Short = function() { return "A dog bone"; }
dogBone.Long = function() { return "A bone, chewed to the marrow. It looks like it has been buried at least once."; }

let dogBiscuit = new Item("dog3", "Biscuit", ItemType.Ingredient);
dogBiscuit.price = 3;
dogBiscuit.sDesc = function() { return "dog biscuit"; }
dogBiscuit.Short = function() { return "A dog biscuit"; }
dogBiscuit.Long = function() { return "A biscuit, commonly given to dogs as a reward. It doesn't taste very good."; }
dogBiscuit.Use = function(target : Entity) {
	target.AddHPFraction(0.02);
	var parse : any = { name: target.NameDesc(), s: target == GAME().player ? "" : "s" };
	Text.Add("[name] chew[s] on a dog biscuit. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}



let wolfFang = new Item("wolf2", "Fang", ItemType.Ingredient);
wolfFang.price = 1;
wolfFang.sDesc = function() { return "canine fang"; }
wolfFang.Short = function() { return "A canid fang"; }
wolfFang.Long = function() { return "A fang from some form of canid predator."; }

let wolfsbane = new Item("wolf3", "Wolfsbane", ItemType.Ingredient);
wolfsbane.price = 3;
wolfsbane.sDesc = function() { return "wolfsbane"; }
wolfsbane.Short = function() { return "A wolfsbane flower"; }
wolfsbane.Long = function() { return "Wolfsbane, a poisonous flower."; }



let foxBerries = new Item("fox2", "Fox berries", ItemType.Ingredient);
foxBerries.price = 1;
foxBerries.sDesc = function() { return "fox berries"; }
foxBerries.Short = function() { return "A handful of fox berries"; }
foxBerries.Long = function() { return "A handful of fox berries. Possibly toxic."; }

let foxglove = new Item("fox3", "Foxglove", ItemType.Ingredient);
foxglove.price = 1;
foxglove.sDesc = function() { return "foxglove"; }
foxglove.Short = function() { return "A foxglove flower"; }
foxglove.Long = function() { return "A foxglove flower, commonly found on meadows."; }



let corruptPlant = new Item("demon1", "Corrupt plant", ItemType.Ingredient);
corruptPlant.price = 0;
corruptPlant.sDesc = function() { return "strange plant"; }
corruptPlant.Short = function() { return "A strange plant"; }
corruptPlant.Long = function() { return "A strange plant, corrupted by some evil power."; }

let blackGem = new Item("demon2", "Black gem", ItemType.Ingredient);
blackGem.price = 20;
blackGem.sDesc = function() { return "obsidian gem"; }
blackGem.Short = function() { return "An obsidian gem"; }
blackGem.Long = function() { return "A black gemstone. It is slightly warm to the touch."; }

let corruptSeed = new Item("demon3", "Corrupt seed", ItemType.Ingredient);
corruptSeed.price = 0;
corruptSeed.sDesc = function() { return "corrupted seed"; }
corruptSeed.Long = function() { return "The semen of some corrupted creature, stored in a vial."; }

let demonSeed = new Item("demon4", "Demon seed", ItemType.Ingredient);
demonSeed.price = 0;
demonSeed.sDesc = function() { return "demonic seed"; }
demonSeed.Long = function() { return "A vial filled with demon cum."; }
demonSeed.Use = function(target : Entity) {
	target.AddLustFraction(0.1);
	target.RestoreCum(2);
	var parse : any = {
		name: target.NameDesc(),
		s: target == GAME().player ? "" : "s",
		hisher : target.hisher()
	};
	Text.Add("[name] swallow[s] a vial of demonic seed. Lust courses through [hisher] veins.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}



let hummus = new Item("human1", "Hummus", ItemType.Ingredient);
hummus.price = 2;
hummus.sDesc = function() { return "hummus"; }
hummus.Short = function() { return "Hummus. Looks edible"; }
hummus.Long = function() { return "Hummus: a foodlike substance."; }
hummus.Use = function(target : Entity) {
	target.AddHPFraction(0.03);
	var parse : any = { name: target.NameDesc(), s: target == GAME().player ? "" : "s" };
	Text.Add("[name] eat[s] some hummus. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

let springWater = new Item("human2", "Spring water", ItemType.Ingredient);
springWater.price = 1;
springWater.sDesc = function() { return "spring water"; }
springWater.Short = function() { return "A vial of clear water"; }
springWater.Long = function() { return "A vial of pure spring water."; }

let letter = new Item("human3", "Letter", ItemType.Ingredient);
letter.price = 1;
letter.sDesc = function() { return "letter"; }
letter.Short = function() { return "A letter"; }
letter.Long = function() { return "A miserable pile of secrets."; }



let feather = new Item("avian1", "Feather", ItemType.Ingredient);
feather.price = 1;
feather.sDesc = function() { return "bird feather"; }
feather.Short = function() { return "A bird feather"; }
feather.Long = function() { return "The feather of some kind of bird."; }

let trinket = new Item("avian2", "Trinket", ItemType.Ingredient);
trinket.price = 1;
trinket.sDesc = function() { return "shiny trinket"; }
trinket.Short = function() { return "A shiny trinket"; }
trinket.Long = function() { return "A shiny trinket, pretty but with little to no value."; }

let fruitSeed = new Item("avian3", "Fruit seed", ItemType.Ingredient);
fruitSeed.price = 1;
fruitSeed.sDesc = function() { return "fruit seed"; }
fruitSeed.Short = function() { return "Seed from a fruit"; }
fruitSeed.Long = function() { return "The seed of a fruit or berry of some kind."; }

let pipeLeaf = new Item("avian4", "Pipeleaf", ItemType.Ingredient);
pipeLeaf.price = 1;
pipeLeaf.sDesc = function() { return "pipeleaf"; }
pipeLeaf.Long = function() { return "A strong pipeleaf - a mixture of several dried herbs."; }



let mFluff = new Item("moth1", "M.Fluff", ItemType.Ingredient);
mFluff.price = 1;
mFluff.sDesc = function() { return "moth fluff"; }
mFluff.Short = function() { return "A wad of moth fluff"; }
mFluff.Long = function() { return "The soft fluff from a moth."; }

let mDust = new Item("moth2", "M.Dust", ItemType.Ingredient);
mDust.price = 1;
mDust.sDesc = function() { return "moth dust"; }
mDust.Short = function() { return "A measure of moth dust"; }
mDust.Long = function() { return "A measure of sparkly moth dust."; }



let stinger = new Item("scorp1", "Stinger", ItemType.Ingredient);
stinger.price = 2;
stinger.sDesc = function() { return "scorpion stinger"; }
stinger.Short = function() { return "A stinger"; }
stinger.Long = function() { return "The stinger from some kind of insect."; }

let sVenom = new Item("scorp2", "S.Venom", ItemType.Ingredient);
sVenom.price = 3;
sVenom.sDesc = function() { return "scorpion venom"; }
sVenom.Short = function() { return "A vial of venom"; }
sVenom.Long = function() { return "A tiny vial of unprocessed scorpion venom."; }

let sClaw = new Item("scorp3", "S.Claw", ItemType.Ingredient);
sClaw.price = 2;
sClaw.sDesc = function() { return "black claw"; }
sClaw.Short = function() { return "A black claw"; }
sClaw.Long = function() { return "A black, menacing-looking scorpion claw."; }



let treeBark = new Item("deer1", "Tree bark", ItemType.Ingredient);
treeBark.price = 1;
treeBark.sDesc = function() { return "tree bark"; }
treeBark.Short = function() { return "Some tree bark"; }
treeBark.Long = function() { return "A chip of tough tree bark."; }

let antlerChip = new Item("deer2", "Antler chip", ItemType.Ingredient);
antlerChip.price = 1;
antlerChip.sDesc = function() { return "antler chip"; }
antlerChip.Short = function() { return "An antler chip"; }
antlerChip.Long = function() { return "A small chip of an antler, probably from a deer."; }



let flowerPetal = new Item("plant1", "Flower petal", ItemType.Ingredient);
flowerPetal.price = 1;
flowerPetal.sDesc = function() { return "flower petal"; }
flowerPetal.Short = function() { return "A flower petal"; }
flowerPetal.Long = function() { return "A petal from a beautiful flower."; }



let rawHoney = new Item("bee1", "Raw honey", ItemType.Ingredient);
rawHoney.price = 5;
rawHoney.sDesc = function() { return "raw honey"; }
rawHoney.Short = function() { return "Raw honey"; }
rawHoney.Long = function() { return "A small jar of raw honey."; }
rawHoney.Use = function(target : Entity) {
	target.AddHPFraction(0.02);
	var parse : any = { name: target.NameDesc(), s: target == GAME().player ? "" : "s" };
	Text.Add("[name] eat[s] a small jar of sweet honey. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

let beeChitin = new Item("bee2", "Bee chitin", ItemType.Ingredient);
beeChitin.price = 1;
beeChitin.sDesc = function() { return "bee chitin"; }
beeChitin.Short = function() { return "Some bee chitin"; }
beeChitin.Long = function() { return "A small scrap of hard bee chitin."; }

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
