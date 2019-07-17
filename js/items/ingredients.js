import { Item, Items, ItemType } from '../item';

Items.HorseHair = new Item("equin1", "Horse hair", ItemType.Ingredient);
Items.HorseHair.price = 1;
Items.HorseHair.sDesc = function() { return "horse hair"; }
Items.HorseHair.Short = function() { return "Hair from a horse"; }
Items.HorseHair.Long = function() { return "The hair of a horse, consisting of long fine strands."; }

Items.HorseShoe = new Item("equin2", "Horseshoe", ItemType.Ingredient);
Items.HorseShoe.price = 1;
Items.HorseShoe.sDesc = function() { return "horseshoe"; }
Items.HorseShoe.Short = function() { return "A horseshoe"; }
Items.HorseShoe.Long = function() { return "A horseshoe, made of metal."; }

Items.HorseCum = new Item("equin3", "E.Fluid", ItemType.Ingredient);
Items.HorseCum.price = 2;
Items.HorseCum.sDesc = function() { return "sticky equine fluids"; }
Items.HorseCum.Long = function() { return "Sticky equine fluids of uncertain origin, contained in a bottle."; }



Items.RabbitFoot = new Item("lago1", "Rabbit foot", ItemType.Ingredient);
Items.RabbitFoot.price = 1;
Items.RabbitFoot.sDesc = function() { return "lucky charm"; }
Items.RabbitFoot.Short = function() { return "A lucky charm"; }
Items.RabbitFoot.Long = function() { return "A lucky charm in the form of a rabbit's foot."; }

Items.CarrotJuice = new Item("lago2", "Carrot juice", ItemType.Ingredient);
Items.CarrotJuice.price = 1;
Items.CarrotJuice.sDesc = function() { return "carrot juice"; }
Items.CarrotJuice.Short = function() { return "A bottle of carrot juice"; }
Items.CarrotJuice.Long = function() { return "A bottle containing a deeply orange juice, made from pressed carrots."; }

Items.Lettuce = new Item("lago3", "Lettuce", ItemType.Ingredient);
Items.Lettuce.price = 1;
Items.Lettuce.sDesc = function() { return "lettuce"; }
Items.Lettuce.Short = function() { return "A leaf of lettuce"; }
Items.Lettuce.Long = function() { return "A leaf of lettuce, sweet, healthy and crunchy."; }



Items.Whiskers = new Item("felin1", "Whiskers", ItemType.Ingredient);
Items.Whiskers.price = 1;
Items.Whiskers.sDesc = function() { return "whiskers"; }
Items.Whiskers.Short = function() { return "A cat's whiskers"; }
Items.Whiskers.Long = function() { return "The whiskers from a cat of some kind."; }

Items.HairBall = new Item("felin2", "Hair ball", ItemType.Ingredient);
Items.HairBall.price = 1;
Items.HairBall.sDesc = function() { return "hair ball"; }
Items.HairBall.Short = function() { return "Eww..."; }
Items.HairBall.Long = function() { return "Looks like something a cat coughed up."; }

Items.CatClaw = new Item("felin3", "Cat claw", ItemType.Ingredient);
Items.CatClaw.price = 1;
Items.CatClaw.sDesc = function() { return "cat claw"; }
Items.CatClaw.Short = function() { return "A claw from a cat"; }
Items.CatClaw.Long = function() { return "Sharp cat claws."; }



Items.SnakeOil = new Item("rept1", "Oil", ItemType.Ingredient);
Items.SnakeOil.price = 1;
Items.SnakeOil.sDesc = function() { return "snake oil"; }
Items.SnakeOil.Long = function() { return "An oil that could perhaps be used by for massage."; }

Items.LizardScale = new Item("rept2", "L.Scale", ItemType.Ingredient);
Items.LizardScale.price = 1;
Items.LizardScale.sDesc = function() { return "lizard scale"; }
Items.LizardScale.Long = function() { return "A brightly shining scale, polished by the desert sands."; }

Items.LizardEgg = new Item("rept3", "L.Egg", ItemType.Ingredient);
Items.LizardEgg.price = 2;
Items.LizardEgg.sDesc = function() { return "lizard egg"; }
Items.LizardEgg.Long = function() { return "An unfertilized lizard egg. Good for a snack."; }
Items.LizardEgg.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] eat[s] a lizard egg. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

Items.SnakeFang = new Item("rept4", "S.Fang", ItemType.Ingredient);
Items.SnakeFang.price = 1;
Items.SnakeFang.sDesc = function() { return "snake fang"; }
Items.SnakeFang.Long = function() { return "A sharp, venomous fang from some sort of reptile."; }

Items.SnakeSkin = new Item("rept5", "S.Skin", ItemType.Ingredient);
Items.SnakeSkin.price = 1;
Items.SnakeSkin.sDesc = function() { return "snake skin"; }
Items.SnakeSkin.Long = function() { return "The shed skin from a large snake."; }



Items.GoatMilk = new Item("goat1", "G.Milk", ItemType.Ingredient);
Items.GoatMilk.price = 2;
Items.GoatMilk.sDesc = function() { return "goat milk"; }
Items.GoatMilk.Long = function() { return "A bottle of goat milk."; }
Items.GoatMilk.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

Items.GoatFleece = new Item("goat2", "Goat fleece", ItemType.Ingredient);
Items.GoatFleece.price = 1;
Items.GoatFleece.sDesc = function() { return "goat fleece"; }
Items.GoatFleece.Long = function() { return "Fleece from a goat, tough and stringy."; }


Items.SheepMilk = new Item("ovis1", "S.Milk", ItemType.Ingredient);
Items.SheepMilk.price = 2;
Items.SheepMilk.sDesc = function() { return "sheep milk"; }
Items.SheepMilk.Long = function() { return "A bottle of sheep milk."; }
Items.SheepMilk.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}
Items.Ramshorn = new Item("ovis2", "Ramshorn", ItemType.Ingredient);
Items.Ramshorn.price = 1;
Items.Ramshorn.sDesc = function() { return "ramshorn"; }
Items.Ramshorn.Long = function() { return "A curled horn from a sheep."; }



Items.CowMilk = new Item("bov1", "Milk", ItemType.Ingredient);
Items.CowMilk.price = 2;
Items.CowMilk.sDesc = function() { return "cow milk"; }
Items.CowMilk.Long = function() { return "A bottle of ordinary cow milk."; }
Items.CowMilk.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}
Items.CowBell = new Item("bov2", "Cowbell", ItemType.Ingredient);
Items.CowBell.price = 2;
Items.CowBell.sDesc = function() { return "cowbell"; }
Items.CowBell.Short = function() { return "A cowbell"; }
Items.CowBell.Long = function() { return "A small bell on a string, used to call cows."; }

Items.FreshGrass = new Item("bov3", "Grass", ItemType.Ingredient);
Items.FreshGrass.price = 1;
Items.FreshGrass.sDesc = function() { return "fresh grass"; }
Items.FreshGrass.Short = function() { return "Fresh green grass"; }
Items.FreshGrass.Long = function() { return "A handful of green grass."; }



Items.CanisRoot = new Item("dog1", "Canis root", ItemType.Ingredient);
Items.CanisRoot.price = 1;
Items.CanisRoot.sDesc = function() { return "canis root"; }
Items.CanisRoot.Short = function() { return "A root"; }
Items.CanisRoot.Long = function() { return "A strange, knotty root."; }

Items.DogBone = new Item("dog2", "Dog bone", ItemType.Ingredient);
Items.DogBone.price = 1;
Items.DogBone.sDesc = function() { return "dog bone"; }
Items.DogBone.Short = function() { return "A dog bone"; }
Items.DogBone.Long = function() { return "A bone, chewed to the marrow. It looks like it has been buried at least once."; }

Items.DogBiscuit = new Item("dog3", "Biscuit", ItemType.Ingredient);
Items.DogBiscuit.price = 3;
Items.DogBiscuit.sDesc = function() { return "dog biscuit"; }
Items.DogBiscuit.Short = function() { return "A dog biscuit"; }
Items.DogBiscuit.Long = function() { return "A biscuit, commonly given to dogs as a reward. It doesn't taste very good."; }
Items.DogBiscuit.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] chew[s] on a dog biscuit. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}



Items.WolfFang = new Item("wolf2", "Fang", ItemType.Ingredient);
Items.WolfFang.price = 1;
Items.WolfFang.sDesc = function() { return "canine fang"; }
Items.WolfFang.Short = function() { return "A canid fang"; }
Items.WolfFang.Long = function() { return "A fang from some form of canid predator."; }

Items.Wolfsbane = new Item("wolf3", "Wolfsbane", ItemType.Ingredient);
Items.Wolfsbane.price = 3;
Items.Wolfsbane.sDesc = function() { return "wolfsbane"; }
Items.Wolfsbane.Short = function() { return "A wolfsbane flower"; }
Items.Wolfsbane.Long = function() { return "Wolfsbane, a poisonous flower."; }



Items.FoxBerries = new Item("fox2", "Fox berries", ItemType.Ingredient);
Items.FoxBerries.price = 1;
Items.FoxBerries.sDesc = function() { return "fox berries"; }
Items.FoxBerries.Short = function() { return "A handful of fox berries"; }
Items.FoxBerries.Long = function() { return "A handful of fox berries. Possibly toxic."; }

Items.Foxglove = new Item("fox3", "Foxglove", ItemType.Ingredient);
Items.Foxglove.price = 1;
Items.Foxglove.sDesc = function() { return "foxglove"; }
Items.Foxglove.Short = function() { return "A foxglove flower"; }
Items.Foxglove.Long = function() { return "A foxglove flower, commonly found on meadows."; }



Items.CorruptPlant = new Item("demon1", "Corrupt plant", ItemType.Ingredient);
Items.CorruptPlant.price = 0;
Items.CorruptPlant.sDesc = function() { return "strange plant"; }
Items.CorruptPlant.Short = function() { return "A strange plant"; }
Items.CorruptPlant.Long = function() { return "A strange plant, corrupted by some evil power."; }

Items.BlackGem = new Item("demon2", "Black gem", ItemType.Ingredient);
Items.BlackGem.price = 20;
Items.BlackGem.sDesc = function() { return "obsidian gem"; }
Items.BlackGem.Short = function() { return "An obsidian gem"; }
Items.BlackGem.Long = function() { return "A black gemstone. It is slightly warm to the touch."; }

Items.CorruptSeed = new Item("demon3", "Corrupt seed", ItemType.Ingredient);
Items.CorruptSeed.price = 0;
Items.CorruptSeed.sDesc = function() { return "corrupted seed"; }
Items.CorruptSeed.Long = function() { return "The semen of some corrupted creature, stored in a vial."; }

Items.DemonSeed = new Item("demon4", "Demon seed", ItemType.Ingredient);
Items.DemonSeed.price = 0;
Items.DemonSeed.sDesc = function() { return "demonic seed"; }
Items.DemonSeed.Long = function() { return "A vial filled with demon cum."; }
Items.DemonSeed.Use = function(target) {
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



Items.Hummus = new Item("human1", "Hummus", ItemType.Ingredient);
Items.Hummus.price = 2;
Items.Hummus.sDesc = function() { return "hummus"; }
Items.Hummus.Short = function() { return "Hummus. Looks edible"; }
Items.Hummus.Long = function() { return "Hummus: a foodlike substance."; }
Items.Hummus.Use = function(target) {
	target.AddHPFraction(0.03);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] eat[s] some hummus. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

Items.SpringWater = new Item("human2", "Spring water", ItemType.Ingredient);
Items.SpringWater.price = 1;
Items.SpringWater.sDesc = function() { return "spring water"; }
Items.SpringWater.Short = function() { return "A vial of clear water"; }
Items.SpringWater.Long = function() { return "A vial of pure spring water."; }

Items.Letter = new Item("human3", "Letter", ItemType.Ingredient);
Items.Letter.price = 1;
Items.Letter.sDesc = function() { return "letter"; }
Items.Letter.Short = function() { return "A letter"; }
Items.Letter.Long = function() { return "A miserable pile of secrets."; }



Items.Feather = new Item("avian1", "Feather", ItemType.Ingredient);
Items.Feather.price = 1;
Items.Feather.sDesc = function() { return "bird feather"; }
Items.Feather.Short = function() { return "A bird feather"; }
Items.Feather.Long = function() { return "The feather of some kind of bird."; }

Items.Trinket = new Item("avian2", "Trinket", ItemType.Ingredient);
Items.Trinket.price = 1;
Items.Trinket.sDesc = function() { return "shiny trinket"; }
Items.Trinket.Short = function() { return "A shiny trinket"; }
Items.Trinket.Long = function() { return "A shiny trinket, pretty but with little to no value."; }

Items.FruitSeed = new Item("avian3", "Fruit seed", ItemType.Ingredient);
Items.FruitSeed.price = 1;
Items.FruitSeed.sDesc = function() { return "fruit seed"; }
Items.FruitSeed.Short = function() { return "Seed from a fruit"; }
Items.FruitSeed.Long = function() { return "The seed of a fruit or berry of some kind."; }

Items.PipeLeaf = new Item("avian4", "Pipeleaf", ItemType.Ingredient);
Items.PipeLeaf.price = 1;
Items.PipeLeaf.sDesc = function() { return "pipeleaf"; }
Items.PipeLeaf.Long = function() { return "A strong pipeleaf - a mixture of several dried herbs."; }



Items.MFluff = new Item("moth1", "M.Fluff", ItemType.Ingredient);
Items.MFluff.price = 1;
Items.MFluff.sDesc = function() { return "moth fluff"; }
Items.MFluff.Short = function() { return "A wad of moth fluff"; }
Items.MFluff.Long = function() { return "The soft fluff from a moth."; }

Items.MDust = new Item("moth2", "M.Dust", ItemType.Ingredient);
Items.MDust.price = 1;
Items.MDust.sDesc = function() { return "moth dust"; }
Items.MDust.Short = function() { return "A measure of moth dust"; }
Items.MDust.Long = function() { return "A measure of sparkly moth dust."; }



Items.Stinger = new Item("scorp1", "Stinger", ItemType.Ingredient);
Items.Stinger.price = 2;
Items.Stinger.sDesc = function() { return "scorpion stinger"; }
Items.Stinger.Short = function() { return "A stinger"; }
Items.Stinger.Long = function() { return "The stinger from some kind of insect."; }

Items.SVenom = new Item("scorp2", "S.Venom", ItemType.Ingredient);
Items.SVenom.price = 3;
Items.SVenom.sDesc = function() { return "scorpion venom"; }
Items.SVenom.Short = function() { return "A vial of venom"; }
Items.SVenom.Long = function() { return "A tiny vial of unprocessed scorpion venom."; }

Items.SClaw = new Item("scorp3", "S.Claw", ItemType.Ingredient);
Items.SClaw.price = 2;
Items.SClaw.sDesc = function() { return "black claw"; }
Items.SClaw.Short = function() { return "A black claw"; }
Items.SClaw.Long = function() { return "A black, menacing-looking scorpion claw."; }



Items.TreeBark = new Item("deer1", "Tree bark", ItemType.Ingredient);
Items.TreeBark.price = 1;
Items.TreeBark.sDesc = function() { return "tree bark"; }
Items.TreeBark.Short = function() { return "Some tree bark"; }
Items.TreeBark.Long = function() { return "A chip of tough tree bark."; }

Items.AntlerChip = new Item("deer2", "Antler chip", ItemType.Ingredient);
Items.AntlerChip.price = 1;
Items.AntlerChip.sDesc = function() { return "antler chip"; }
Items.AntlerChip.Short = function() { return "An antler chip"; }
Items.AntlerChip.Long = function() { return "A small chip of an antler, probably from a deer."; }



Items.FlowerPetal = new Item("plant1", "Flower petal", ItemType.Ingredient);
Items.FlowerPetal.price = 1;
Items.FlowerPetal.sDesc = function() { return "flower petal"; }
Items.FlowerPetal.Short = function() { return "A flower petal"; }
Items.FlowerPetal.Long = function() { return "A petal from a beautiful flower."; }



Items.RawHoney = new Item("bee1", "Raw honey", ItemType.Ingredient);
Items.RawHoney.price = 5;
Items.RawHoney.sDesc = function() { return "raw honey"; }
Items.RawHoney.Short = function() { return "Raw honey"; }
Items.RawHoney.Long = function() { return "A small jar of raw honey."; }
Items.RawHoney.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.Add("[name] eat[s] a small jar of sweet honey. It is slightly invigorating.", parse);
	Text.NL();
	Text.Flush();
	return {consume: true};
}

Items.BeeChitin = new Item("bee2", "Bee chitin", ItemType.Ingredient);
Items.BeeChitin.price = 1;
Items.BeeChitin.sDesc = function() { return "bee chitin"; }
Items.BeeChitin.Short = function() { return "Some bee chitin"; }
Items.BeeChitin.Long = function() { return "A small scrap of hard bee chitin."; }

