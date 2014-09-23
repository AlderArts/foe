
Items.HorseHair = new Item("equin1", "Horse hair");
Items.HorseHair.price = 1;
Items.HorseHair.Short = function() { return "Hair from a horse"; }
Items.HorseHair.Long = function() { return "The hair of a horse, consisting of long fine strands."; }

Items.HorseShoe = new Item("equin2", "Horseshoe");
Items.HorseShoe.price = 1;
Items.HorseShoe.Short = function() { return "A horseshoe"; }
Items.HorseShoe.Long = function() { return "A horseshoe, made of metal."; }

Items.HorseCum = new Item("equin3", "E.Fluid");
Items.HorseCum.price = 2;
Items.HorseCum.Short = function() { return "Sticky equine fluids"; }
Items.HorseCum.Long = function() { return "Sticky equine fluids of uncertain origin, contained in a bottle."; }



Items.RabbitFoot = new Item("lago1", "Rabbit foot");
Items.RabbitFoot.price = 1;
Items.RabbitFoot.Short = function() { return "A lucky charm"; }
Items.RabbitFoot.Long = function() { return "A lucky charm in the form of a rabbit's foot."; }

Items.CarrotJuice = new Item("lago2", "Carrot juice");
Items.CarrotJuice.price = 1;
Items.CarrotJuice.Short = function() { return "A bottle of carrot juice"; }
Items.CarrotJuice.Long = function() { return "A bottle containing a deeply orange juice, made from pressed carrots."; }

Items.Lettuce = new Item("lago3", "Lettuce");
Items.Lettuce.price = 1;
Items.Lettuce.Short = function() { return "A leaf of lettuce"; }
Items.Lettuce.Long = function() { return "A leaf of lettuce, sweet, healthy and crunchy."; }



Items.Whiskers = new Item("felin1", "Whiskers");
Items.Whiskers.price = 1;
Items.Whiskers.Short = function() { return "A cat's whiskers"; }
Items.Whiskers.Long = function() { return "The whiskers from a cat of some kind."; }

Items.HairBall = new Item("felin2", "Hair ball");
Items.HairBall.price = 1;
Items.HairBall.Short = function() { return "Eww..."; }
Items.HairBall.Long = function() { return "Looks like something a cat coughed up."; }

Items.CatClaw = new Item("felin3", "Cat claw");
Items.CatClaw.price = 1;
Items.CatClaw.Short = function() { return "A claw from a cat"; }
Items.CatClaw.Long = function() { return "Sharp cat claws."; }



Items.SnakeOil = new Item("rept1", "Oil");
Items.SnakeOil.price = 1;
Items.SnakeOil.Short = function() { return "Snake oil"; }
Items.SnakeOil.Long = function() { return "An oil that could perhaps be used by for massage."; }

Items.LizardScale = new Item("rept2", "L.Scale");
Items.LizardScale.price = 1;
Items.LizardScale.Short = function() { return "Lizard scale"; }
Items.LizardScale.Long = function() { return "A brightly shining scale, polished by the desert sands."; }

Items.LizardEgg = new Item("rept3", "L.Egg");
Items.LizardEgg.price = 2;
Items.LizardEgg.Short = function() { return "Lizard egg"; }
Items.LizardEgg.Long = function() { return "An unfertilized lizard egg. Good for a snack."; }
Items.LizardEgg.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.AddOutput("[name] eat[s] a lizard egg. It is slightly invigorating.", parse);
	Text.Newline();
	
	return {consume: true};
}

Items.SnakeFang = new Item("rept4", "S.Fang");
Items.SnakeFang.price = 1;
Items.SnakeFang.Short = function() { return "Snake fang"; }
Items.SnakeFang.Long = function() { return "A sharp, venomous fang from some sort of reptile."; }

Items.SnakeSkin = new Item("rept5", "S.Skin");
Items.SnakeSkin.price = 1;
Items.SnakeSkin.Short = function() { return "Snake skin"; }
Items.SnakeSkin.Long = function() { return "The shed skin from a large snake."; }



// TODO: GOAT TF

Items.GoatMilk = new Item("goat1", "G.Milk");
Items.GoatMilk.price = 2;
Items.GoatMilk.Short = function() { return "Goat milk"; }
Items.GoatMilk.Long = function() { return "A bottle of goat milk."; }
Items.GoatMilk.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.AddOutput("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.Newline();
	
	return {consume: true};
}



Items.SheepMilk = new Item("ovis1", "S.Milk");
Items.SheepMilk.price = 2;
Items.SheepMilk.Short = function() { return "Sheep milk"; }
Items.SheepMilk.Long = function() { return "A bottle of sheep milk."; }
Items.SheepMilk.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.AddOutput("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.Newline();
	
	return {consume: true};
}
Items.Ramshorn = new Item("ovis2", "Ramshorn");
Items.Ramshorn.price = 1;
Items.Ramshorn.Short = function() { return "Ramshorn"; }
Items.Ramshorn.Long = function() { return "A curled horn from a sheep."; }



Items.CowMilk = new Item("bov1", "Milk");
Items.CowMilk.price = 2;
Items.CowMilk.Short = function() { return "Cow milk"; }
Items.CowMilk.Long = function() { return "A bottle of ordinary cow milk."; }
Items.CowMilk.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.AddOutput("[name] drink[s] a bottle of milk. It is slightly invigorating.", parse);
	Text.Newline();
	
	return {consume: true};
}
Items.CowBell = new Item("bov2", "Cowbell");
Items.CowBell.price = 2;
Items.CowBell.Short = function() { return "A cowbell"; }
Items.CowBell.Long = function() { return "A small bell on a string, used to call cows."; }

Items.FreshGrass = new Item("bov3", "Grass");
Items.FreshGrass.price = 1;
Items.FreshGrass.Short = function() { return "Fresh green grass"; }
Items.FreshGrass.Long = function() { return "A handful of green grass."; }



Items.CanisRoot = new Item("dog1", "Canis root");
Items.CanisRoot.price = 1;
Items.CanisRoot.Short = function() { return "A root"; }
Items.CanisRoot.Long = function() { return "A strange, knotty root."; }

Items.DogBone = new Item("dog2", "Dog bone");
Items.DogBone.price = 1;
Items.DogBone.Short = function() { return "A dog bone"; }
Items.DogBone.Long = function() { return "A bone, chewed to the marrow. It looks like it has been buried at least once."; }

Items.DogBiscuit = new Item("dog3", "Biscuit");
Items.DogBiscuit.price = 3;
Items.DogBiscuit.Short = function() { return "A dog biscuit"; }
Items.DogBiscuit.Long = function() { return "A biscuit, commonly given to dogs as a reward. It doesn't taste very good."; }
Items.DogBiscuit.Use = function(target) {
	target.AddHPFraction(0.02);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.AddOutput("[name] chew[s] on a dog biscuit. It is slightly invigorating.", parse);
	Text.Newline();
	
	return {consume: true};
}



Items.WolfFang = new Item("wolf2", "Fang");
Items.WolfFang.price = 1;
Items.WolfFang.Short = function() { return "A canid fang"; }
Items.WolfFang.Long = function() { return "A fang from some form of canid predator."; }

Items.WolfPelt = new Item("wolf3", "Wolf pelt");
Items.WolfPelt.price = 3;
Items.WolfPelt.Short = function() { return "A wolf pelt"; }
Items.WolfPelt.Long = function() { return "The rough pelt of a wolf."; }



Items.FoxBerries = new Item("fox2", "Fox berries");
Items.FoxBerries.price = 1;
Items.FoxBerries.Short = function() { return "A handful of fox berries"; }
Items.FoxBerries.Long = function() { return "A handful of fox berries. Possibly toxic."; }

Items.Foxglove = new Item("fox3", "Foxglove");
Items.Foxglove.price = 1;
Items.Foxglove.Short = function() { return "A foxglove flower"; }
Items.Foxglove.Long = function() { return "A foxglove flower, commonly found on meadows."; }



Items.CorruptPlant = new Item("demon1", "Corrupt plant");
Items.CorruptPlant.price = 0;
Items.CorruptPlant.Short = function() { return "A strange plant"; }
Items.CorruptPlant.Long = function() { return "A strange plant, corrupted by some evil power."; }

Items.BlackGem = new Item("demon2", "Black gem");
Items.BlackGem.price = 20;
Items.BlackGem.Short = function() { return "An obsidian gem"; }
Items.BlackGem.Long = function() { return "A black gemstone. It is slightly warm to the touch."; }

Items.CorruptSeed = new Item("demon3", "Corrupt seed");
Items.CorruptSeed.price = 0;
Items.CorruptSeed.Short = function() { return "Corrupted seed"; }
Items.CorruptSeed.Long = function() { return "The semen of some corrupted creature, stored in a vial."; }

Items.DemonSeed = new Item("demon4", "Demon seed");
Items.DemonSeed.price = 0;
Items.DemonSeed.Short = function() { return "Demonic seed"; }
Items.DemonSeed.Long = function() { return "A vial filled with demon cum."; }
Items.DemonSeed.Use = function(target) {
	target.AddLustFraction(0.1);
	target.RestoreCum(2);
	var parse = {
		name: target.NameDesc(),
		s: target == player ? "" : "s",
		hisher : target.hisher()
	};
	Text.AddOutput("[name] swallow[s] a vial of demonic seed. Lust courses through [hisher] veins.", parse);
	Text.Newline();
	return {consume: true};
}



Items.Hummus = new Item("human1", "Hummus");
Items.Hummus.price = 2;
Items.Hummus.Short = function() { return "Hummus. Looks edible"; }
Items.Hummus.Long = function() { return "Hummus: a foodlike substance."; }
Items.Hummus.Use = function(target) {
	target.AddHPFraction(0.03);
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s" };
	Text.AddOutput("[name] eat[s] some hummus. It is slightly invigorating.", parse);
	Text.Newline();
	return {consume: true};
}

Items.SpringWater = new Item("human2", "Spring water");
Items.SpringWater.price = 1;
Items.SpringWater.Short = function() { return "A vial of clear water"; }
Items.SpringWater.Long = function() { return "A vial of pure spring water."; }

Items.BloodVial = new Item("human3", "Blood");
Items.BloodVial.price = 0;
Items.BloodVial.Short = function() { return "A vial of blood"; }
Items.BloodVial.Long = function() { return "A vial of red blood."; }



Items.Feather = new Item("avian1", "Feather");
Items.Feather.price = 1;
Items.Feather.Short = function() { return "A bird feather"; }
Items.Feather.Long = function() { return "The feather of some kind of bird."; }

Items.Trinket = new Item("avian2", "Trinket");
Items.Trinket.price = 1;
Items.Trinket.Short = function() { return "A shiny trinket"; }
Items.Trinket.Long = function() { return "A shiny trinket, pretty but with little to no value."; }

Items.FruitSeed = new Item("avian3", "Fruit seed");
Items.FruitSeed.price = 1;
Items.FruitSeed.Short = function() { return "Seed from a fruit"; }
Items.FruitSeed.Long = function() { return "The seed of a fruit or berry of some kind."; }



Items.MAntenna = new Item("moth1", "M.Feeler");
Items.MAntenna.price = 1;
Items.MAntenna.Short = function() { return "A moth feeler"; }
Items.MAntenna.Long = function() { return "The feeler from some kind of moth."; }

Items.MWing = new Item("moth2", "M.Wing");
Items.MWing.price = 1;
Items.MWing.Short = function() { return "A moth wing"; }
Items.MWing.Long = function() { return "A flimsy moth wing, looks very fragile."; }



Items.Stinger = new Item("scorp1", "Stinger");
Items.Stinger.price = 2;
Items.Stinger.Short = function() { return "A stinger"; }
Items.Stinger.Long = function() { return "The stinger from some kind of insect."; }

Items.SVenom = new Item("scorp2", "S.Venom");
Items.SVenom.price = 3;
Items.SVenom.Short = function() { return "A vial of venom"; }
Items.SVenom.Long = function() { return "A tiny vial of unprocessed scorpion venom."; }

Items.SClaw = new Item("scorp3", "S.Claw");
Items.SClaw.price = 2;
Items.SClaw.Short = function() { return "A black claw"; }
Items.SClaw.Long = function() { return "A black, menacing-looking scorpion claw."; }

