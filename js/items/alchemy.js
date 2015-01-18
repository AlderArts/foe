

Items.Equinium = new TFItem("equin0", "Equinium");
Items.Equinium.price = 7;
Items.Equinium.lDesc = function() { return "a bottle of Equinium"; }
Items.Equinium.Short = function() { return "A bottle of Equinium"; }
Items.Equinium.Long = function() { return "A bottle labeled Equinium, with the picture of a horse on it, containing a thick, heady liquid."; }
Items.Equinium.recipe = [{it: Items.HorseShoe}, {it: Items.HorseHair}, {it: Items.HorseCum}];
// Effects
Items.Equinium.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.horse, str: "a horsecock"});
Items.Equinium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.horse, str: "equine ears"});
Items.Equinium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.horse, color: Color.brown, str: "a brown, bushy horse tail"});
Items.Equinium.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
Items.Equinium.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.4, value: true, num: 1});
Items.Equinium.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.5, ideal: 30, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.5, ideal: 6, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 30, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 8, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.DecDex, {odds: 0.2, ideal: 8, max: 1});


Items.Leporine = new TFItem("lago0", "Leporine");
Items.Leporine.price = 7;
Items.Leporine.lDesc = function() { return "a bottle of Leporine"; }
Items.Leporine.Short = function() { return "A bottle of Leporine"; }
Items.Leporine.Long = function() { return "A bottle labeled Leporine, with the picture of a rabbit on it. The fluid within is clear."; }
Items.Leporine.recipe = [{it: Items.RabbitFoot}, {it: Items.CarrotJuice}, {it: Items.Lettuce}];
// Effects
Items.Leporine.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.rabbit, str: "a bunnycock"});
Items.Leporine.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.rabbit, str: "floppy bunny ears"});
Items.Leporine.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.rabbit, color: Color.white, str: "a white, fluffy bunny tail"});
Items.Leporine.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.5, ideal: 15, max: 1});
Items.Leporine.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.5, ideal: 3, max: 1});
Items.Leporine.PushEffect(TF.ItemEffects.IncLib, {odds: 0.4, ideal: 30, max: 1});
Items.Leporine.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});


Items.Felinix = new TFItem("felin0", "Felinix");
Items.Felinix.price = 7;
Items.Felinix.lDesc = function() { return "a bottle of Felinix"; }
Items.Felinix.Short = function() { return "A bottle of Felinix"; }
Items.Felinix.Long = function() { return "A bottle labeled Felinix, with the picture of a cat on it. The fluid within is cloudy."; }
Items.Felinix.recipe = [{it: Items.Whiskers}, {it: Items.HairBall}, {it: Items.CatClaw}];
// Effects
Items.Felinix.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.cat, str: "a feline cock"});
Items.Felinix.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.cat, str: "fluffy cat ears"});
Items.Felinix.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.cat, color: Color.orange, str: "an orange, flexible feline tail"});
Items.Felinix.PushEffect(TF.ItemEffects.IncDex, {odds: 0.6, ideal: 35, max: 1});
Items.Felinix.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 25, max: 1});
Items.Felinix.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 16, max: 1});
Items.Felinix.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 8, max: 1});


Items.Lacertium = new TFItem("rept0", "Lacertium");
Items.Lacertium.price = 8;
Items.Lacertium.lDesc = function() { return "a bottle of Lacertium"; }
Items.Lacertium.Short = function() { return "A bottle of Lacertium"; }
Items.Lacertium.Long = function() { return "A bottle labeled Lacertium, with the picture of a lizard on it. The fluid within is thick and oily."; }
Items.Lacertium.recipe = [{it: Items.SnakeOil}, {it: Items.LizardScale}, {it: Items.LizardEgg}];
// Effects
Items.Lacertium.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.lizard, str: "a lizard cock"});
Items.Lacertium.PushEffect(function(target) {
	var cocks = target.AllCocks();
	if(cocks.length == 1 && cocks[0].race == Race.lizard && Math.random() < 0.1) {
		cocks.push(cocks[0].Clone());
		Text.AddOutput("[Poss] reptilian cock splits in two identical dicks!", { Poss: target.Possessive() });
		Text.Newline();
	}
});
Items.Lacertium.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
Items.Lacertium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.lizard, str: "lizard nubs"});
Items.Lacertium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.lizard, color: Color.green, str: "a green, flexible reptilian tail"});
Items.Lacertium.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.2, value: false, num: 1});
Items.Lacertium.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
Items.Lacertium.PushEffect(TF.ItemEffects.IncDex, {odds: 0.2, ideal: 25, max: 1});
Items.Lacertium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 28, max: 1});
Items.Lacertium.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 16, max: 1});


Items.Ovis = new TFItem("ovis0", "Ovis");
Items.Ovis.price = 8;
Items.Ovis.lDesc = function() { return "a bottle of Ovis"; }
Items.Ovis.Short = function() { return "A bottle of Ovis"; }
Items.Ovis.Long = function() { return "A bottle labeled Ovis, with the picture of a sheep on it. The fluid within is milky white."; }
Items.Ovis.recipe = [{it: Items.SheepMilk}, {it: Items.Ramshorn}, {it: Items.FreshGrass}];
// Effects
Items.Ovis.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.sheep, str: "sheep ears"});
Items.Ovis.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.sheep, color: Color.white, str: "a short ovine tail"});
Items.Ovis.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.2, value: false, num: 1});
Items.Ovis.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.sheep, color: Color.black, count: 2, str: "a pair of sheep horns" });
Items.Ovis.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
Items.Ovis.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 30, max: 1});
Items.Ovis.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 15, max: 1});
Items.Ovis.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal:  5, max: 1});


Items.Bovia = new TFItem("bov0", "Bovia");
Items.Bovia.price = 8;
Items.Bovia.lDesc = function() { return "a bottle of Bovia"; }
Items.Bovia.Short = function() { return "A bottle of Bovia"; }
Items.Bovia.Long = function() { return "A bottle labeled Bovia, with the picture of a cow on it. The fluid within is milky white."; }
Items.Bovia.recipe = [{it: Items.CowMilk}, {it: Items.CowBell}, {it: Items.FreshGrass}];
// Effects
Items.Bovia.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.cow, str: "a bovine cock"});
Items.Bovia.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.cow, str: "bovine ears"});
Items.Bovia.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.cow, color: Color.black, str: "a long bovine tail, ending in a tuft of black hair"});
Items.Bovia.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.cow, color: Color.black, str: "a pair of strong bovine horns!", count: 2});
Items.Bovia.PushEffect(function(target) {
	var parse = { Poss: target.Possessive() };
	if(target.FirstVag() || (target.BiggestBreasts() && target.BiggestBreasts().size.Get() > 5)) {
		var breasts = target.AllBreastRows();
		for(var i = 0; i < breasts.length; i++) {
			var diff = breasts[i].size.IncreaseStat(40, Math.random() * 5);
			if(diff) {
				Text.AddOutput("[Poss] breasts grow larger by " + diff + "cm.", parse);
				Text.Newline();
				break;
			}
		}
		
		if(Math.random() < 0.5) {
			var diff = target.lactHandler.lactationRate.IdealStat(10, 1);
			if(diff) {
				Text.AddOutput("[Poss] breasts starts to lactate more than before.", parse);
				Text.Newline();
			}
		}
		
		if(Math.random() < 0.5) {
			var diff = target.lactHandler.milkProduction.IncreaseStat(5, 1);
			if(diff) {
				Text.AddOutput("[Poss] breasts swell, as they become able to produce milk at a quicker rate.", parse);
				Text.Newline();
			}
		}
	}
});
Items.Bovia.PushEffect(TF.ItemEffects.IncStr, {odds: 0.5, ideal: 35, max: 1});
Items.Bovia.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
Items.Bovia.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 20, max: 1});
Items.Bovia.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 10, max: 1});


Items.Canis = new TFItem("dog0", "Canis");
Items.Canis.price = 8;
Items.Canis.lDesc = function() { return "a bottle of Canis"; }
Items.Canis.Short = function() { return "A bottle of Canis"; }
Items.Canis.Long = function() { return "A bottle labeled Canis, with the picture of a dog on it. The fluid within is opaque, and slightly reddish."; }
Items.Canis.recipe = [{it: Items.CanisRoot}, {it: Items.DogBone}, {it: Items.DogBiscuit}];
// Effects
Items.Canis.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.dog, str: "a canid cock"});
Items.Canis.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
Items.Canis.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.4, value: true, num: 1});
Items.Canis.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
Items.Canis.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
Items.Canis.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.dog, str: "canid ears"});
Items.Canis.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.dog, color: Color.brown, str: "a brown, fluffy dog tail!"});
Items.Canis.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
Items.Canis.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
Items.Canis.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 25, max: 1});
Items.Canis.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 10, max: 1});


Items.Lobos = new TFItem("wolf0", "Lobos");
Items.Lobos.price = 8;
Items.Lobos.lDesc = function() { return "a bottle of Lobos"; }
Items.Lobos.Short = function() { return "A bottle of Lobos"; }
Items.Lobos.Long = function() { return "A bottle labeled Lobos with the picture of a wolf on it. The fluid within is opaque, and dullish gray."; }
Items.Lobos.recipe = [{it: Items.CanisRoot}, {it: Items.WolfFang}, {it: Items.WolfPelt}];
// Effects
Items.Lobos.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.wolf, str: "a wolf cock"});
Items.Lobos.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
Items.Lobos.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.4, value: true, num: 1});
Items.Lobos.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
Items.Lobos.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
Items.Lobos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.wolf, str: "wolf ears"});
Items.Lobos.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.wolf, color: Color.gray, str: "a gray, fluffy wolf tail!"});
Items.Lobos.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 30, max: 1});
Items.Lobos.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
Items.Lobos.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
Items.Lobos.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});


Items.Vulpinix = new TFItem("fox0", "Vulpinix");
Items.Vulpinix.price = 8;
Items.Vulpinix.lDesc = function() { return "a bottle of Vulpinix"; }
Items.Vulpinix.Short = function() { return "A bottle of Vulpinix"; }
Items.Vulpinix.Long = function() { return "A bottle labeled Vulpinix, with the picture of a fox on it. The fluid within is opaque, and bright red."; }
Items.Vulpinix.recipe = [{it: Items.CanisRoot}, {it: Items.FoxBerries}, {it: Items.Foxglove}];
// Effects
Items.Vulpinix.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.fox, str: "a vulpine cock"});
Items.Vulpinix.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.4, value: true, num: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
Items.Vulpinix.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
Items.Vulpinix.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.fox, str: "vulpine ears"});
Items.Vulpinix.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.fox, color: Color.red, str: "a red, fluffy fox tail!"});
Items.Vulpinix.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 25, max: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 10, max: 1});


Items.Infernum = new TFItem("demon0", "Infernum");
Items.Infernum.price = 15;
Items.Infernum.lDesc = function() { return "a bottle of Infernum"; }
Items.Infernum.Short = function() { return "A bottle of Infernum"; }
Items.Infernum.Long = function() { return "A bottle labeled Infernum, with the picture of a demon on it. The fluid within is a thick red sludge, tainted with black bubbles."; }
Items.Infernum.recipe = [{it: Items.CorruptPlant}, {it: Items.BlackGem}, {it: Items.CorruptSeed}];
// Effects
Items.Infernum.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.2, race: Race.demon, color: Color.red, str: "plantigrade, demonic legs with clawed feet"});
Items.Infernum.PushEffect(TF.ItemEffects.SetArms, {odds: 0.2, race: Race.demon, color: Color.red, str: "demonic arms with clawed hands"});
Items.Infernum.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.demon, str: "a demon cock"});
Items.Infernum.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.demon, color: Color.red, str: "a red, spaded demon tail"});
Items.Infernum.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.demon, color: Color.red, count: 2, str: "a pair of demon horns" });
Items.Infernum.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 25, max: 1});
Items.Infernum.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 25, max: 1});
Items.Infernum.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
Items.Infernum.PushEffect(TF.ItemEffects.IncLib, {odds: 0.4, ideal: 35, max: 1});



Items.Avia = new TFItem("avian0", "Avia");
Items.Avia.price = 25;
Items.Avia.lDesc = function() { return "a bottle of Avia"; }
Items.Avia.Short = function() { return "A bottle of Avia"; }
Items.Avia.Long = function() { return "A bottle labeled Avia, with the picture of a bird on it. The fluid within is a clear, bright blue."; }
Items.Avia.recipe = [{it: Items.Feather}, {it: Items.Trinket}, {it: Items.FruitSeed}];
// Effects
Items.Avia.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.avian, str: "an avian cock"});
Items.Avia.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
Items.Avia.PushEffect(TF.ItemEffects.RemTail, {odds: 0.2, count: 1});
Items.Avia.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.2, value: false, num: 1});
Items.Avia.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.2, value: false, num: 1});
Items.Avia.PushEffect(TF.ItemEffects.SetWings, {odds: 0.4, race: Race.avian, color: Color.brown, count: 2, str: "a pair of avain wings" });


Items.Lepida = new TFItem("moth0", "Lepida");
Items.Lepida.price = 25;
Items.Lepida.lDesc = function() { return "a bottle of Lepida"; }
Items.Lepida.Short = function() { return "A bottle of Lepida"; }
Items.Lepida.Long = function() { return "A bottle labeled Lepida, with the picture of a moth on it. The fluid within is a deep purple."; }
Items.Lepida.recipe = [{it: Items.MAntenna}, {it: Items.MWing}, {it: Items.FruitSeed}];
// Effects
Items.Lepida.PushEffect(TF.ItemEffects.SetAntenna, {odds: 0.4, race: Race.moth, color: Color.purple, count: 2, str: "a pair of moth-like feelers" });
Items.Lepida.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
Items.Lepida.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.1, value: false, num: 1});
Items.Lepida.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
Items.Lepida.PushEffect(TF.ItemEffects.SetWings, {odds: 0.4, race: Race.moth, color: Color.purple, count: 2, str: "a pair of insect wings" });


Items.Scorpius = new TFItem("scorp0", "Scorpius");
Items.Scorpius.price = 25;
Items.Scorpius.lDesc = function() { return "a bottle of Scorpius"; }
Items.Scorpius.Short = function() { return "A bottle of Scorpius"; }
Items.Scorpius.Long = function() { return "A bottle labeled Scorpius, with the picture of a scorpion on it. The fluid within is a pitch black."; }
Items.Scorpius.recipe = [{it: Items.Stinger}, {it: Items.SVenom}, {it: Items.SClaw}];
// Effects
Items.Scorpius.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.scorpion, color: Color.black, str: "a black, segmented scorpion tail"});
Items.Scorpius.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.1, value: false, num: 1});
Items.Scorpius.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
Items.Scorpius.PushEffect(TF.ItemEffects.RemWings, {odds: 0.6, count: 2});
Items.Scorpius.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
Items.Scorpius.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
Items.Scorpius.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 20, max: 1});


Items.Homos = new TFItem("human0", "Homos");
Items.Homos.price = 25;
Items.Homos.lDesc = function() { return "a bottle of Homos"; }
Items.Homos.Short = function() { return "A bottle of Homos"; }
Items.Homos.Long = function() { return "A bottle labeled Homos, with the picture of a regular human on it. The fluid within is clear and colorless, like water."; }
Items.Homos.recipe = [{it: Items.Hummus}, {it: Items.SpringWater}, {it: Items.Letter}];
// Effects
Items.Homos.PushEffect(TF.ItemEffects.SetBody, {odds: 0.4, race: Race.human, str: "human body"});
Items.Homos.PushEffect(TF.ItemEffects.SetFace, {odds: 0.3, race: Race.human, str: "human face"});
Items.Homos.PushEffect(TF.ItemEffects.SetArms, {odds: 0.3, race: Race.human, str: "human arms"});
Items.Homos.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.human, str: "human legs"});
Items.Homos.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.human, str: "a human cock"});
Items.Homos.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.6, count: 2});
Items.Homos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.6, race: Race.human, str: "human ears"});
Items.Homos.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.4, value: false, num: 1});
Items.Homos.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: false, num: 1});
Items.Homos.PushEffect(TF.ItemEffects.RemTail, {odds: 0.6, count: 1});
Items.Homos.PushEffect(TF.ItemEffects.RemWings, {odds: 0.6, count: 2});
Items.Homos.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.6, count: 2});
Items.Homos.PushEffect(function(target) {
	var parse = {
		Poss : target.Possessive(),
		legsDesc : function() { return target.LegsDesc(); },
		notS : target.body.legs.count > 1 ? "s" : "",
		heshe : target.heshe(),
		has : target.has()
	};
	
	if(Math.random() < 0.6) {
		if(target.body.legs.count != 2) {
			target.body.legs.count = 2;
			target.body.legs.race = Race.human;
			Text.Add("[Poss] [legsDesc] morph[notS] until [heshe] [has] two human legs!", parse);
		}
	}
	Text.Flush();
});


Items.Virilium = new TFItem("sex0", "Virilium");
Items.Virilium.price = 100;
Items.Virilium.lDesc = function() { return "a bottle of Virilium"; }
Items.Virilium.Short = function() { return "A bottle of Virilium"; }
Items.Virilium.Long = function() { return "A bottle of potency-enhancing Virilium."; }
Items.Virilium.recipe = [{it: Items.Equinium}, {it: Items.Leporine}, {it: Items.Lobos}];
// Effects
Items.Virilium.PushEffect(TF.ItemEffects.IncLib, {odds: 0.3, ideal: 40, max: 2});
Items.Virilium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.2, ideal: 40, max: 2});
Items.Virilium.PushEffect(TF.ItemEffects.SetBalls, {odds: 0.1, ideal: 2, count: 2});
Items.Virilium.PushEffect(function(target) {
	var parse = {
		name  : target.nameDesc(),
		heshe : target.heshe(),
		is    : target.is()
	};
	target.AddLustFraction(0.5);
	target.RestoreCum(10);
	
	Text.Add("A shiver runs through [name] as [heshe] [is] hit by a wave of lust!", parse);
	Text.NL();
});
Items.Virilium.PushEffect(function(target) {
	var parse = {
		Poss: target.Possessive(),
		ballsDesc : function() { return target.BallsDesc(); },
		s      : target.HasBalls() ? "s" : "",
		notS   : target.HasBalls() ? "" : "s",
		itThey : target.HasBalls() ? "they" : "it"
	};
	if(target.HasBalls() && Math.random() < 0.4) {
		var res = target.Balls().size.IncreaseStat(10, 1);
		if(res > 0) {
			Text.Add("[Poss] balls have grown in size to [ballsDesc]!", parse);
			Text.NL();
		}
	}
	if((target.HasBalls() || target.FirstCock()) && Math.random() < 0.4) {
		var res = target.Balls().cumCap.IncreaseStat(30, 1);
		if(res > 0) {
			Text.Add("[Poss] [ballsDesc] churn[notS] as [itThey] adjust[notS] to accomodate more cum.", parse);
			Text.NL();
		}
	}
	if((target.HasBalls() || target.FirstCock()) && Math.random() < 0.3) {
		var res = target.Balls().cumProduction.IncreaseStat(3, .5, true);
		if(res > 0) {
			Text.Add("[Poss] [ballsDesc] churn[notS] as [itThey] become[s] able to produce more cum!", parse);
			Text.NL();
		}
	}
	// TODO: parse
	if((target.HasBalls() || target.FirstCock()) && Math.random() < 0.2) {
		var res = target.Balls().fertility.IncreaseStat(.7, .1, true);
	}
	Text.Flush();
});
// TODO: parse
Items.Virilium.PushEffect(function(target) {
	var parse = {};
	if(Math.random() < 0.1) {
		var res = target.body.muscleTone.IncreaseStat(.7, .1, true);
	}
	if(Math.random() < 0.1) {
		var res = target.body.femininity.DecreaseStat(-1, .1, true);
	}
	Text.Flush();
});


Items.Fertilium = new TFItem("sex1", "Fertilium");
Items.Fertilium.price = 100;
Items.Fertilium.lDesc = function() { return "a bottle of Fertilium"; }
Items.Fertilium.Short = function() { return "A bottle of Fertilium"; }
Items.Fertilium.Long = function() { return "A bottle of fertility-enhancing Fertilium."; }
Items.Fertilium.recipe = [{it: Items.Felinix}, {it: Items.Leporine}, {it: Items.Bovia}];
// Effects
Items.Fertilium.PushEffect(TF.ItemEffects.IncLib, {odds: 0.3, ideal: 40, max: 2});
Items.Fertilium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.2, ideal: 40, max: 2});
Items.Fertilium.PushEffect(TF.ItemEffects.RemBalls, {odds: 0.1, ideal: 0, count: 2});
Items.Fertilium.PushEffect(function(target) {
	var parse = {
		name  : target.nameDesc(),
		heshe : target.heshe(),
		is    : target.is()
	};
	target.AddLustFraction(0.7);
	
	Text.Add("A shiver runs through [name] as [heshe] [is] hit by a wave of lust!", parse);
	Text.NL();
});
// TODO: parse
Items.Fertilium.PushEffect(function(target) {
	var parse = {};
	if(Math.random() < 0.15) {
		var res = target.pregHandler.gestationRate.IncreaseStat(2, .2, true);
	}
	if(Math.random() < 0.2) {
		var res = target.pregHandler.fertility.IncreaseStat(.7, .1, true);
	}
	Text.Flush();
});
// TODO: parse
Items.Fertilium.PushEffect(function(target) {
	var parse = {};
	if(Math.random() < 0.1) {
		var res = target.body.muscleTone.DecreaseStat(.0, .1, true);
	}
	if(Math.random() < 0.1) {
		var res = target.body.femininity.IncreaseStat(1, .1, true);
	}
	Text.Flush();
});


//TODO Effects
Items.Testos = new TFItem("sex2", "Testos");
Items.Testos.price = 100;
Items.Testos.lDesc = function() { return "a bottle of Testos"; }
Items.Testos.Short = function() { return "A bottle of Testos"; }
Items.Testos.Long = function() { return "A bottle of pure masculinity labled Testos."; }
Items.Testos.recipe = [{it: Items.Equinium}, {it: Items.Homos}, {it: Items.Canis}];
Items.Testos.PushEffect(TF.ItemEffects.SetBalls, {odds: 0.2, ideal: 2, count: 2});
// TODO: parse
Items.Testos.PushEffect(function(target) {
	var parse = {};
	if(Math.random() < 0.1) {
		var res = target.body.muscleTone.IncreaseStat(.7, .1, true);
	}
	if(Math.random() < 0.8) {
		var res = target.body.femininity.DecreaseStat(-1, .1, true);
	}
	Text.Flush();
});
Items.Testos.PushEffect(function(target) {
	var parse = {
		Poss: target.Possessive(),
		ballsDesc : function() { return target.BallsDesc(); },
		s      : target.HasBalls() ? "s" : "",
		notS   : target.HasBalls() ? "" : "s",
		itThey : target.HasBalls() ? "they" : "it"
	};
	if(target.HasBalls() && Math.random() < 0.6) {
		var res = target.Balls().size.IncreaseStat(10, 1);
		if(res > 0) {
			Text.Add("[Poss] balls have grown in size to [ballsDesc]!", parse);
			Text.NL();
		}
	}
	Text.Flush();
});
Items.Testos.PushEffect(function(target) {
	var parse = {
		Name : target.NameDesc(),
		Poss : target.Possessive(),
		multiCockDesc : function() { return target.MultiCockDesc(); }
	};
	parse = target.ParserPronouns(parse);
	
	var vags  = target.AllVags();
	var cocks = target.AllCocks();
	if(vags.length > 0 && Math.random() < 0.2) {
		var randVag = Math.floor(Math.random() * vags.length);
		var vag = vags[randVag];
		vags.remove(randVag);
		//Clear clitcock
		if(vag.clitCock)
			vag.clitCock.vag = null;
		if(vags.length > 0) {
			Text.Add("[Name] loses one of [hisher] cunts!", parse);
		}
		else {
			Text.Add("[Poss] pussy shrinks until it disappears completely.", parse);
			if(cocks.length == 0) {
				Text.Add(" It's replaced by a brand new cock!");
				cocks.push(new Cock());
			}
		}
		Text.Flush();
	}
	else if(Math.random() < 0.5) {
		var len = false, thk = false;
		for(var i = 0; i < cocks.length; i++) {
			// Base size
			len = cocks[i].length.IncreaseStat(25, 1);
			thk = cocks[i].thickness.IncreaseStat(7, 1);
		}
		if(len || thk) {
			parse["s"]    = target.NumCocks() > 1 ? "s" : "";
			parse["notS"] = target.NumCocks() > 1 ? "" : "s";
			Text.NL();
			Text.Add("[Poss] [multiCockDesc] shudder[notS], the stiff dick[s] growing ", parse);
			if(len)
				Text.Add("longer", parse);
			if(len && thk)
				Text.Add(" and ", parse);
			if(thk)
				Text.Add("thicker", parse);
			Text.Add(".", parse);
			Text.Flush();
		}
	}
});

Items.Estros = new TFItem("sex3", "Estros");
Items.Estros.price = 100;
Items.Estros.lDesc = function() { return "a bottle of Estros"; }
Items.Estros.Short = function() { return "A bottle of Estros"; }
Items.Estros.Long = function() { return "A bottle of pure femininity labled Estros."; }
Items.Estros.recipe = [{it: Items.Vulpinix}, {it: Items.Homos}, {it: Items.Bovia}];
Items.Estros.PushEffect(TF.ItemEffects.RemBalls, {odds: 0.2, ideal: 0, count: 2});
// TODO: parse
Items.Estros.PushEffect(function(target) {
	var parse = {};
	if(Math.random() < 0.1) {
		var res = target.body.muscleTone.DecreaseStat(.0, .1, true);
	}
	if(Math.random() < 0.8) {
		var res = target.body.femininity.IncreaseStat(1, .1, true);
	}
	Text.Flush();
});
Items.Estros.PushEffect(function(target) {
	var parse = {
		Name : target.NameDesc(),
		Poss : target.Possessive(),
		multiCockDesc : function() { return target.MultiCockDesc(); }
	};
	parse = target.ParserPronouns(parse);
	
	var cocks = target.AllCocks();
	var vags  = target.AllVags();
	if(cocks.length > 0 && Math.random() < 0.2) {
		var randCock = Math.floor(Math.random() * cocks.length);
		var cock = cocks[randCock];
		cocks.remove(randCock);
		//Clear clitcock
		if(cock.vag)
			cock.vag.clitCock = null;
		if(cocks.length > 0) {
			Text.Add("[Name] loses one of [hisher] cocks!", parse);
		}
		else {
			Text.Add("[Poss] cock shrinks until it disappears completely.", parse);
			if(target.NumVags() == 0) {
				Text.Add(" It's replaced by a brand new pussy!");
				vags.push(new Vagina());
			}
		}
		Text.Flush();
	}
	/*
	else if(Math.random() < 0.5) {
		// TODO: vag capacity
	}
	*/
});
