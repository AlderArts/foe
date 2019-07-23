import { Item, ItemType } from '../item';

let IngredientItems = {};

IngredientItems.HorseHair = new Item("equin1", "Horse hair", ItemType.Ingredient);
IngredientItems.HorseHair.price = 1;
IngredientItems.HorseHair.sDesc = function() { return "horse hair"; }
IngredientItems.HorseHair.Short = function() { return "Hair from a horse"; }
IngredientItems.HorseHair.Long = function() { return "The hair of a horse, consisting of long fine strands."; }

IngredientItems.HorseShoe = new Item("equin2", "Horseshoe", ItemType.Ingredient);
IngredientItems.HorseShoe.price = 1;
IngredientItems.HorseShoe.sDesc = function() { return "horseshoe"; }
IngredientItems.HorseShoe.Short = function() { return "A horseshoe"; }
IngredientItems.HorseShoe.Long = function() { return "A horseshoe, made of metal."; }

IngredientItems.HorseCum = new Item("equin3", "E.Fluid", ItemType.Ingredient);
IngredientItems.HorseCum.price = 2;
IngredientItems.HorseCum.sDesc = function() { return "sticky equine fluids"; }
IngredientItems.HorseCum.Long = function() { return "Sticky equine fluids of uncertain origin, contained in a bottle."; }



IngredientItems.RabbitFoot = new Item("lago1", "Rabbit foot", ItemType.Ingredient);
IngredientItems.RabbitFoot.price = 1;
IngredientItems.RabbitFoot.sDesc = function() { return "lucky charm"; }
IngredientItems.RabbitFoot.Short = function() { return "A lucky charm"; }
IngredientItems.RabbitFoot.Long = function() { return "A lucky charm in the form of a rabbit's foot."; }

IngredientItems.CarrotJuice = new Item("lago2", "Carrot juice", ItemType.Ingredient);
IngredientItems.CarrotJuice.price = 1;
IngredientItems.CarrotJuice.sDesc = function() { return "carrot juice"; }
IngredientItems.CarrotJuice.Short = function() { return "A bottle of carrot juice"; }
IngredientItems.CarrotJuice.Long = function() { return "A bottle containing a deeply orange juice, made from pressed carrots."; }

IngredientItems.Lettuce = new Item("lago3", "Lettuce", ItemType.Ingredient);
IngredientItems.Lettuce.price = 1;
IngredientItems.Lettuce.sDesc = function() { return "lettuce"; }
IngredientItems.Lettuce.Short = function() { return "A leaf of lettuce"; }
IngredientItems.Lettuce.Long = function() { return "A leaf of lettuce, sweet, healthy and crunchy."; }



IngredientItems.Whiskers = new Item("felin1", "Whiskers", ItemType.Ingredient);
IngredientItems.Whiskers.price = 1;
IngredientItems.Whiskers.sDesc = function() { return "whiskers"; }
IngredientItems.Whiskers.Short = function() { return "A cat's whiskers"; }
IngredientItems.Whiskers.Long = function() { return "The whiskers from a cat of some kind."; }

IngredientItems.HairBall = new Item("felin2", "Hair ball", ItemType.Ingredient);
IngredientItems.HairBall.price = 1;
IngredientItems.HairBall.sDesc = function() { return "hair ball"; }
IngredientItems.HairBall.Short = function() { return "Eww..."; }
IngredientItems.HairBall.Long = function() { return "Looks like something a cat coughed up."; }

IngredientItems.CatClaw = new Item("felin3", "Cat claw", ItemType.Ingredient);
IngredientItems.CatClaw.price = 1;
IngredientItems.CatClaw.sDesc = function() { return "cat claw"; }
IngredientItems.CatClaw.Short = function() { return "A claw from a cat"; }
IngredientItems.CatClaw.Long = function() { return "Sharp cat claws."; }



IngredientItems.SnakeOil = new Item("rept1", "Oil", ItemType.Ingredient);
IngredientItems.SnakeOil.price = 1;
IngredientItems.SnakeOil.sDesc = function() { return "snake oil"; }
IngredientItems.SnakeOil.Long = function() { return "An oil that could perhaps be used by for massage."; }

IngredientItems.LizardScale = new Item("rept2", "L.Scale", ItemType.Ingredient);
IngredientItems.LizardScale.price = 1;
IngredientItems.LizardScale.sDesc = function() { return "lizard scale"; }
IngredientItems.LizardScale.Long = function() { return "A brightly shining scale, polished by the desert sands."; }

IngredientItems.LizardEgg = new Item("rept3", "L.Egg", ItemType.Ingredient);
IngredientItems.LizardEgg.price = 2;
IngredientItems.LizardEgg.sDesc = function() { return "lizard egg"; }
IngredientItems.LizardEgg.Long = function() { return "An unfertilized lizard egg. Good for a snack."; }
IngredientItems.LizardEgg.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] eat[s] a lizard egg. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

IngredientItems.SnakeFang = new Item("rept4", "S.Fang", ItemType.Ingredient);
IngredientItems.SnakeFang.price = 1;
IngredientItems.SnakeFang.sDesc = function() { return "snake fang"; }
IngredientItems.SnakeFang.Long = function() { return "A sharp, venomous fang from some sort of reptile."; }

IngredientItems.SnakeSkin = new Item("rept5", "S.Skin", ItemType.Ingredient);
IngredientItems.SnakeSkin.price = 1;
IngredientItems.SnakeSkin.sDesc = function() { return "snake skin"; }
IngredientItems.SnakeSkin.Long = function() { return "The shed skin from a large snake."; }



IngredientItems.GoatMilk = new Item("goat1", "G.Milk", ItemType.Ingredient);
IngredientItems.GoatMilk.price = 2;
IngredientItems.GoatMilk.sDesc = function() { return "goat milk"; }
IngredientItems.GoatMilk.Long = function() { return "A bottle of goat milk."; }
IngredientItems.GoatMilk.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

IngredientItems.GoatFleece = new Item("goat2", "Goat fleece", ItemType.Ingredient);
IngredientItems.GoatFleece.price = 1;
IngredientItems.GoatFleece.sDesc = function() { return "goat fleece"; }
IngredientItems.GoatFleece.Long = function() { return "Fleece from a goat, tough and stringy."; }


IngredientItems.SheepMilk = new Item("ovis1", "S.Milk", ItemType.Ingredient);
IngredientItems.SheepMilk.price = 2;
IngredientItems.SheepMilk.sDesc = function() { return "sheep milk"; }
IngredientItems.SheepMilk.Long = function() { return "A bottle of sheep milk."; }
IngredientItems.SheepMilk.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}
IngredientItems.Ramshorn = new Item("ovis2", "Ramshorn", ItemType.Ingredient);
IngredientItems.Ramshorn.price = 1;
IngredientItems.Ramshorn.sDesc = function() { return "ramshorn"; }
IngredientItems.Ramshorn.Long = function() { return "A curled horn from a sheep."; }



IngredientItems.CowMilk = new Item("bov1", "Milk", ItemType.Ingredient);
IngredientItems.CowMilk.price = 2;
IngredientItems.CowMilk.sDesc = function() { return "cow milk"; }
IngredientItems.CowMilk.Long = function() { return "A bottle of ordinary cow milk."; }
IngredientItems.CowMilk.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}
IngredientItems.CowBell = new Item("bov2", "Cowbell", ItemType.Ingredient);
IngredientItems.CowBell.price = 2;
IngredientItems.CowBell.sDesc = function() { return "cowbell"; }
IngredientItems.CowBell.Short = function() { return "A cowbell"; }
IngredientItems.CowBell.Long = function() { return "A small bell on a string, used to call cows."; }

IngredientItems.FreshGrass = new Item("bov3", "Grass", ItemType.Ingredient);
IngredientItems.FreshGrass.price = 1;
IngredientItems.FreshGrass.sDesc = function() { return "fresh grass"; }
IngredientItems.FreshGrass.Short = function() { return "Fresh green grass"; }
IngredientItems.FreshGrass.Long = function() { return "A handful of green grass."; }



IngredientItems.CanisRoot = new Item("dog1", "Canis root", ItemType.Ingredient);
IngredientItems.CanisRoot.price = 1;
IngredientItems.CanisRoot.sDesc = function() { return "canis root"; }
IngredientItems.CanisRoot.Short = function() { return "A root"; }
IngredientItems.CanisRoot.Long = function() { return "A strange, knotty root."; }

IngredientItems.DogBone = new Item("dog2", "Dog bone", ItemType.Ingredient);
IngredientItems.DogBone.price = 1;
IngredientItems.DogBone.sDesc = function() { return "dog bone"; }
IngredientItems.DogBone.Short = function() { return "A dog bone"; }
IngredientItems.DogBone.Long = function() { return "A bone, chewed to the marrow. It looks like it has been buried at least once."; }

IngredientItems.DogBiscuit = new Item("dog3", "Biscuit", ItemType.Ingredient);
IngredientItems.DogBiscuit.price = 3;
IngredientItems.DogBiscuit.sDesc = function() { return "dog biscuit"; }
IngredientItems.DogBiscuit.Short = function() { return "A dog biscuit"; }
IngredientItems.DogBiscuit.Long = function() { return "A biscuit, commonly given to dogs as a reward. It doesn't taste very good."; }
IngredientItems.DogBiscuit.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] chew[s] on a dog biscuit. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}



IngredientItems.WolfFang = new Item("wolf2", "Fang", ItemType.Ingredient);
IngredientItems.WolfFang.price = 1;
IngredientItems.WolfFang.sDesc = function() { return "canine fang"; }
IngredientItems.WolfFang.Short = function() { return "A canid fang"; }
IngredientItems.WolfFang.Long = function() { return "A fang from some form of canid predator."; }

IngredientItems.Wolfsbane = new Item("wolf3", "Wolfsbane", ItemType.Ingredient);
IngredientItems.Wolfsbane.price = 3;
IngredientItems.Wolfsbane.sDesc = function() { return "wolfsbane"; }
IngredientItems.Wolfsbane.Short = function() { return "A wolfsbane flower"; }
IngredientItems.Wolfsbane.Long = function() { return "Wolfsbane, a poisonous flower."; }



IngredientItems.FoxBerries = new Item("fox2", "Fox berries", ItemType.Ingredient);
IngredientItems.FoxBerries.price = 1;
IngredientItems.FoxBerries.sDesc = function() { return "fox berries"; }
IngredientItems.FoxBerries.Short = function() { return "A handful of fox berries"; }
IngredientItems.FoxBerries.Long = function() { return "A handful of fox berries. Possibly toxic."; }

IngredientItems.Foxglove = new Item("fox3", "Foxglove", ItemType.Ingredient);
IngredientItems.Foxglove.price = 1;
IngredientItems.Foxglove.sDesc = function() { return "foxglove"; }
IngredientItems.Foxglove.Short = function() { return "A foxglove flower"; }
IngredientItems.Foxglove.Long = function() { return "A foxglove flower, commonly found on meadows."; }



IngredientItems.CorruptPlant = new Item("demon1", "Corrupt plant", ItemType.Ingredient);
IngredientItems.CorruptPlant.price = 0;
IngredientItems.CorruptPlant.sDesc = function() { return "strange plant"; }
IngredientItems.CorruptPlant.Short = function() { return "A strange plant"; }
IngredientItems.CorruptPlant.Long = function() { return "A strange plant, corrupted by some evil power."; }

IngredientItems.BlackGem = new Item("demon2", "Black gem", ItemType.Ingredient);
IngredientItems.BlackGem.price = 20;
IngredientItems.BlackGem.sDesc = function() { return "obsidian gem"; }
IngredientItems.BlackGem.Short = function() { return "An obsidian gem"; }
IngredientItems.BlackGem.Long = function() { return "A black gemstone. It is slightly warm to the touch."; }

IngredientItems.CorruptSeed = new Item("demon3", "Corrupt seed", ItemType.Ingredient);
IngredientItems.CorruptSeed.price = 0;
IngredientItems.CorruptSeed.sDesc = function() { return "corrupted seed"; }
IngredientItems.CorruptSeed.Long = function() { return "The semen of some corrupted creature, stored in a vial."; }

IngredientItems.DemonSeed = new Item("demon4", "Demon seed", ItemType.Ingredient);
IngredientItems.DemonSeed.price = 0;
IngredientItems.DemonSeed.sDesc = function() { return "demonic seed"; }
IngredientItems.DemonSeed.Long = function() { return "A vial filled with demon cum."; }
IngredientItems.DemonSeed.Use = function(target) {
	target.AddLustFraction(0.1);
	target.RestoreCum(2);
	var parse = {
		name: target.NameDesc(),
		s: target == player ? "" : "s",
		hisher : target.hisher()
	};
	Text.Add("[name] swallow[s] a vial of demonic seed. Lust courses through [hisher] veins.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}



IngredientItems.Hummus = new Item("human1", "Hummus", ItemType.Ingredient);
IngredientItems.Hummus.price = 2;
IngredientItems.Hummus.sDesc = function() { return "hummus"; }
IngredientItems.Hummus.Short = function() { return "Hummus. Looks edible"; }
IngredientItems.Hummus.Long = function() { return "Hummus: a foodlike substance."; }
IngredientItems.Hummus.Use = function(target) {
	target.AddHPFraction(0.03);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] eat[s] some hummus. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

IngredientItems.SpringWater = new Item("human2", "Spring water", ItemType.Ingredient);
IngredientItems.SpringWater.price = 1;
IngredientItems.SpringWater.sDesc = function() { return "spring water"; }
IngredientItems.SpringWater.Short = function() { return "A vial of clear water"; }
IngredientItems.SpringWater.Long = function() { return "A vial of pure spring water."; }

IngredientItems.Letter = new Item("human3", "Letter", ItemType.Ingredient);
IngredientItems.Letter.price = 1;
IngredientItems.Letter.sDesc = function() { return "letter"; }
IngredientItems.Letter.Short = function() { return "A letter"; }
IngredientItems.Letter.Long = function() { return "A miserable pile of secrets."; }



IngredientItems.Feather = new Item("avian1", "Feather", ItemType.Ingredient);
IngredientItems.Feather.price = 1;
IngredientItems.Feather.sDesc = function() { return "bird feather"; }
IngredientItems.Feather.Short = function() { return "A bird feather"; }
IngredientItems.Feather.Long = function() { return "The feather of some kind of bird."; }

IngredientItems.Trinket = new Item("avian2", "Trinket", ItemType.Ingredient);
IngredientItems.Trinket.price = 1;
IngredientItems.Trinket.sDesc = function() { return "shiny trinket"; }
IngredientItems.Trinket.Short = function() { return "A shiny trinket"; }
IngredientItems.Trinket.Long = function() { return "A shiny trinket, pretty but with little to no value."; }

IngredientItems.FruitSeed = new Item("avian3", "Fruit seed", ItemType.Ingredient);
IngredientItems.FruitSeed.price = 1;
IngredientItems.FruitSeed.sDesc = function() { return "fruit seed"; }
IngredientItems.FruitSeed.Short = function() { return "Seed from a fruit"; }
IngredientItems.FruitSeed.Long = function() { return "The seed of a fruit or berry of some kind."; }

IngredientItems.PipeLeaf = new Item("avian4", "Pipeleaf", ItemType.Ingredient);
IngredientItems.PipeLeaf.price = 1;
IngredientItems.PipeLeaf.sDesc = function() { return "pipeleaf"; }
IngredientItems.PipeLeaf.Long = function() { return "A strong pipeleaf - a mixture of several dried herbs."; }



IngredientItems.MFluff = new Item("moth1", "M.Fluff", ItemType.Ingredient);
IngredientItems.MFluff.price = 1;
IngredientItems.MFluff.sDesc = function() { return "moth fluff"; }
IngredientItems.MFluff.Short = function() { return "A wad of moth fluff"; }
IngredientItems.MFluff.Long = function() { return "The soft fluff from a moth."; }

IngredientItems.MDust = new Item("moth2", "M.Dust", ItemType.Ingredient);
IngredientItems.MDust.price = 1;
IngredientItems.MDust.sDesc = function() { return "moth dust"; }
IngredientItems.MDust.Short = function() { return "A measure of moth dust"; }
IngredientItems.MDust.Long = function() { return "A measure of sparkly moth dust."; }



IngredientItems.Stinger = new Item("scorp1", "Stinger", ItemType.Ingredient);
IngredientItems.Stinger.price = 2;
IngredientItems.Stinger.sDesc = function() { return "scorpion stinger"; }
IngredientItems.Stinger.Short = function() { return "A stinger"; }
IngredientItems.Stinger.Long = function() { return "The stinger from some kind of insect."; }

IngredientItems.SVenom = new Item("scorp2", "S.Venom", ItemType.Ingredient);
IngredientItems.SVenom.price = 3;
IngredientItems.SVenom.sDesc = function() { return "scorpion venom"; }
IngredientItems.SVenom.Short = function() { return "A vial of venom"; }
IngredientItems.SVenom.Long = function() { return "A tiny vial of unprocessed scorpion venom."; }

IngredientItems.SClaw = new Item("scorp3", "S.Claw", ItemType.Ingredient);
IngredientItems.SClaw.price = 2;
IngredientItems.SClaw.sDesc = function() { return "black claw"; }
IngredientItems.SClaw.Short = function() { return "A black claw"; }
IngredientItems.SClaw.Long = function() { return "A black, menacing-looking scorpion claw."; }



IngredientItems.TreeBark = new Item("deer1", "Tree bark", ItemType.Ingredient);
IngredientItems.TreeBark.price = 1;
IngredientItems.TreeBark.sDesc = function() { return "tree bark"; }
IngredientItems.TreeBark.Short = function() { return "Some tree bark"; }
IngredientItems.TreeBark.Long = function() { return "A chip of tough tree bark."; }

IngredientItems.AntlerChip = new Item("deer2", "Antler chip", ItemType.Ingredient);
IngredientItems.AntlerChip.price = 1;
IngredientItems.AntlerChip.sDesc = function() { return "antler chip"; }
IngredientItems.AntlerChip.Short = function() { return "An antler chip"; }
IngredientItems.AntlerChip.Long = function() { return "A small chip of an antler, probably from a deer."; }



IngredientItems.FlowerPetal = new Item("plant1", "Flower petal", ItemType.Ingredient);
IngredientItems.FlowerPetal.price = 1;
IngredientItems.FlowerPetal.sDesc = function() { return "flower petal"; }
IngredientItems.FlowerPetal.Short = function() { return "A flower petal"; }
IngredientItems.FlowerPetal.Long = function() { return "A petal from a beautiful flower."; }



IngredientItems.RawHoney = new Item("bee1", "Raw honey", ItemType.Ingredient);
IngredientItems.RawHoney.price = 5;
IngredientItems.RawHoney.sDesc = function() { return "raw honey"; }
IngredientItems.RawHoney.Short = function() { return "Raw honey"; }
IngredientItems.RawHoney.Long = function() { return "A small jar of raw honey."; }
IngredientItems.RawHoney.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] eat[s] a small jar of sweet honey. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

IngredientItems.BeeChitin = new Item("bee2", "Bee chitin", ItemType.Ingredient);
IngredientItems.BeeChitin.price = 1;
IngredientItems.BeeChitin.sDesc = function() { return "bee chitin"; }
IngredientItems.BeeChitin.Short = function() { return "Some bee chitin"; }
IngredientItems.BeeChitin.Long = function() { return "A small scrap of hard bee chitin."; }

export { IngredientItems };
