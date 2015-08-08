

Items.Equinium = new TFItem("equin0", "Equinium");
Items.Equinium.price = 7;
Items.Equinium.lDesc = function() { return "a bottle of Equinium"; }
Items.Equinium.Short = function() { return "A bottle of Equinium"; }
Items.Equinium.Long = function() { return "A bottle labeled Equinium, with the picture of a horse on it, containing a thick, heady liquid."; }
Items.Equinium.recipe = [{it: Items.HorseShoe}, {it: Items.HorseHair}, {it: Items.HorseCum}];
// Effects
Items.Equinium.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Horse, str: "a horsecock"});
Items.Equinium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Horse, str: "equine ears"});
Items.Equinium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Horse, color: Color.brown, str: "a brown, bushy horse tail"});
Items.Equinium.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
Items.Equinium.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.4, value: true, num: 1});
Items.Equinium.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.5, ideal: 30, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.5, ideal: 6, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 30, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 8, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.DecDex, {odds: 0.2, ideal: 8, max: 1});
Items.Equinium.PushEffect(TF.ItemEffects.DecFem, {odds: 0.2, ideal: -.8, max: .1, male: true});
Items.Equinium.PushEffect(TF.ItemEffects.IncTone, {odds: 0.2, ideal: .9, max: .1 });
Items.Equinium.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});


Items.Leporine = new TFItem("lago0", "Leporine");
Items.Leporine.price = 7;
Items.Leporine.lDesc = function() { return "a bottle of Leporine"; }
Items.Leporine.Short = function() { return "A bottle of Leporine"; }
Items.Leporine.Long = function() { return "A bottle labeled Leporine, with the picture of a rabbit on it. The fluid within is clear."; }
Items.Leporine.recipe = [{it: Items.RabbitFoot}, {it: Items.CarrotJuice}, {it: Items.Lettuce}];
// Effects
Items.Leporine.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Rabbit, str: "a bunnycock"});
Items.Leporine.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Rabbit, str: "floppy bunny ears"});
Items.Leporine.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Rabbit, color: Color.white, str: "a white, fluffy bunny tail"});
Items.Leporine.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.5, ideal: 15, max: 1});
Items.Leporine.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.5, ideal: 3, max: 1});
Items.Leporine.PushEffect(TF.ItemEffects.IncLib, {odds: 0.4, ideal: 30, max: 1});
Items.Leporine.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
Items.Leporine.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: .5, max: .1});
Items.Leporine.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
Items.Leporine.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Thin, max: 1});
Items.Leporine.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 6, max: 2 });


Items.Felinix = new TFItem("felin0", "Felinix");
Items.Felinix.price = 7;
Items.Felinix.lDesc = function() { return "a bottle of Felinix"; }
Items.Felinix.Short = function() { return "A bottle of Felinix"; }
Items.Felinix.Long = function() { return "A bottle labeled Felinix, with the picture of a cat on it. The fluid within is cloudy."; }
Items.Felinix.recipe = [{it: Items.Whiskers}, {it: Items.HairBall}, {it: Items.CatClaw}];
// Effects
Items.Felinix.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Feline, str: "a feline cock"});
Items.Felinix.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Feline, str: "fluffy cat ears"});
Items.Felinix.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Feline, color: Color.orange, str: "an orange, flexible feline tail"});
Items.Felinix.PushEffect(TF.ItemEffects.IncDex, {odds: 0.6, ideal: 35, max: 1});
Items.Felinix.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 25, max: 1});
Items.Felinix.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 16, max: 1});
Items.Felinix.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 8, max: 1});
Items.Felinix.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
Items.Felinix.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0.1, max: .1 });
Items.Felinix.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Thin, max: 1});
Items.Felinix.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 6, max: 2 });


Items.Lacertium = new TFItem("rept0", "Lacertium");
Items.Lacertium.price = 8;
Items.Lacertium.lDesc = function() { return "a bottle of Lacertium"; }
Items.Lacertium.Short = function() { return "A bottle of Lacertium"; }
Items.Lacertium.Long = function() { return "A bottle labeled Lacertium, with the picture of a lizard on it. The fluid within is thick and oily."; }
Items.Lacertium.recipe = [{it: Items.SnakeOil}, {it: Items.LizardScale}, {it: Items.LizardEgg}];
// Effects
Items.Lacertium.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Lizard, str: "a lizard cock"});
Items.Lacertium.PushEffect(function(target) {
	var cocks = target.AllCocks();
	if(cocks.length == 1 && cocks[0].race == Race.Lizard && Math.random() < 0.1) {
		cocks.push(cocks[0].Clone());
		Text.Add("[Poss] reptilian cock splits in two identical dicks!", { Poss: target.Possessive() });
		Text.NL();
		Text.Flush();
	}
});
Items.Lacertium.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
Items.Lacertium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Lizard, str: "lizard nubs"});
Items.Lacertium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Lizard, color: Color.green, str: "a green, flexible reptilian tail"});
Items.Lacertium.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.2, value: false, num: 1});
Items.Lacertium.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
Items.Lacertium.PushEffect(TF.ItemEffects.IncDex, {odds: 0.2, ideal: 25, max: 1});
Items.Lacertium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 28, max: 1});
Items.Lacertium.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 16, max: 1});
Items.Lacertium.PushEffect(TF.ItemEffects.DecSpi, {odds: 0.1, ideal: 20, max: 1});
Items.Lacertium.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});


Items.Ovis = new TFItem("ovis0", "Ovis");
Items.Ovis.price = 8;
Items.Ovis.lDesc = function() { return "a bottle of Ovis"; }
Items.Ovis.Short = function() { return "A bottle of Ovis"; }
Items.Ovis.Long = function() { return "A bottle labeled Ovis, with the picture of a sheep on it. The fluid within is milky white."; }
Items.Ovis.recipe = [{it: Items.SheepMilk}, {it: Items.Ramshorn}, {it: Items.FreshGrass}];
// Effects
Items.Ovis.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Sheep, str: "sheep ears"});
Items.Ovis.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Sheep, color: Color.white, str: "a short ovine tail"});
Items.Ovis.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.2, value: false, num: 1});
Items.Ovis.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Sheep, color: Color.black, count: 2, str: "a pair of sheep horns" });
Items.Ovis.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
Items.Ovis.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 30, max: 1});
Items.Ovis.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 15, max: 1});
Items.Ovis.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal:  5, max: 1});
Items.Ovis.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
Items.Ovis.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});
Items.Ovis.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 0.4, ideal: 16, max: 2, female: true });


Items.Bovia = new TFItem("bov0", "Bovia");
Items.Bovia.price = 8;
Items.Bovia.lDesc = function() { return "a bottle of Bovia"; }
Items.Bovia.Short = function() { return "A bottle of Bovia"; }
Items.Bovia.Long = function() { return "A bottle labeled Bovia, with the picture of a cow on it. The fluid within is milky white."; }
Items.Bovia.recipe = [{it: Items.CowMilk}, {it: Items.CowBell}, {it: Items.FreshGrass}];
// Effects
Items.Bovia.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Cow, str: "a bovine cock"});
Items.Bovia.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Cow, str: "bovine ears"});
Items.Bovia.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Cow, color: Color.black, str: "a long bovine tail, ending in a tuft of black hair"});
Items.Bovia.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Cow, color: Color.black, str: "a pair of strong bovine horns!", count: 2});
Items.Bovia.PushEffect(function(target) {
	var parse = { Poss: target.Possessive() };
	if(target.FirstVag() || (target.BiggestBreasts() && target.BiggestBreasts().size.Get() > 5)) {
		if(Math.random() < 0.5) {
			var diff = target.lactHandler.lactationRate.IdealStat(10, 1);
			if(diff) {
				Text.Add("[Poss] breasts start to lactate more than before.", parse);
				Text.NL();
			}
		}
		
		if(Math.random() < 0.5) {
			var diff = target.lactHandler.milkProduction.IncreaseStat(5, 1);
			if(diff) {
				Text.Add("[Poss] breasts swell, as they become able to produce milk at a quicker rate.", parse);
				Text.NL();
			}
		}
	}
	Text.Flush();
});
Items.Bovia.PushEffect(TF.ItemEffects.IncStr, {odds: 0.5, ideal: 35, max: 1});
Items.Bovia.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
Items.Bovia.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 20, max: 1});
Items.Bovia.PushEffect(TF.ItemEffects.IncLib, {odds: 0.3, ideal: 25, max: 1});
Items.Bovia.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 10, max: 1});
Items.Bovia.PushEffect(TF.ItemEffects.DecDex, {odds: 0.1, ideal: 15, max: 1});
Items.Bovia.PushEffect(TF.ItemEffects.IncFem, {odds: 0.3, ideal: 1, max: .1});
Items.Bovia.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.1, rangeMax: 0.3, max: .1 });
Items.Bovia.PushEffect(TF.ItemEffects.IncHips, {odds: 0.3, ideal: HipSize.VeryWide, max: 2});
Items.Bovia.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 1, ideal: 40, max: 5, female: true });


Items.Caprinium = new TFItem("goat0", "Caprinium");
Items.Caprinium.price = 25;
Items.Caprinium.lDesc = function() { return "a bottle of Caprinium"; }
Items.Caprinium.Short = function() { return "A bottle of Caprinium"; }
Items.Caprinium.Long = function() { return "A bottle filled with a thick white fluid. It has a picture of a goat on it."; }
Items.Caprinium.recipe = [{it: Items.GoatMilk}, {it: Items.FreshGrass}, {it: Items.GoatFleece}];
// Effects
Items.Caprinium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Goat, str: "caprine ears"});
Items.Caprinium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Goat, color: Color.gray, str: "a short caprine tail"});
Items.Caprinium.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Goat, color: Color.black, str: "a pair of curved goat horns!", count: 2});
Items.Caprinium.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Goat, str: "fleece-covered caprine legs, with hooves"});
Items.Caprinium.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
Items.Caprinium.PushEffect(TF.ItemEffects.IncSta, {odds: 0.3, ideal: 25, max: 1});
Items.Caprinium.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 35, max: 1});
Items.Caprinium.PushEffect(TF.ItemEffects.DecCha, {odds: 0.1, ideal: 15, max: 1});
Items.Caprinium.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
Items.Caprinium.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: .5, max: .1});
Items.Caprinium.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.3, rangeMax: 0.7, max: .1 });
Items.Caprinium.PushEffect(TF.ItemEffects.DecBreastSize, {odds: .6, ideal: 2, max: 3 });


Items.Canis = new TFItem("dog0", "Canis");
Items.Canis.price = 8;
Items.Canis.lDesc = function() { return "a bottle of Canis"; }
Items.Canis.Short = function() { return "A bottle of Canis"; }
Items.Canis.Long = function() { return "A bottle labeled Canis, with the picture of a dog on it. The fluid within is opaque, and slightly reddish."; }
Items.Canis.recipe = [{it: Items.CanisRoot}, {it: Items.DogBone}, {it: Items.DogBiscuit}];
// Effects
Items.Canis.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Dog, str: "a canid cock"});
Items.Canis.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
Items.Canis.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.4, value: true, num: 1});
Items.Canis.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
Items.Canis.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
Items.Canis.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Dog, str: "canid ears"});
Items.Canis.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Dog, color: Color.brown, str: "a brown, fluffy dog tail!"});
Items.Canis.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
Items.Canis.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
Items.Canis.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 25, max: 1});
Items.Canis.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 10, max: 1});
Items.Canis.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.2, rangeMax: 0.5, max: .1 });


Items.Lobos = new TFItem("wolf0", "Lobos");
Items.Lobos.price = 8;
Items.Lobos.lDesc = function() { return "a bottle of Lobos"; }
Items.Lobos.Short = function() { return "A bottle of Lobos"; }
Items.Lobos.Long = function() { return "A bottle labeled Lobos with the picture of a wolf on it. The fluid within is opaque, and dullish gray."; }
Items.Lobos.recipe = [{it: Items.CanisRoot}, {it: Items.WolfFang}, {it: Items.Wolfsbane}];
// Effects
Items.Lobos.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Wolf, str: "a wolf cock"});
Items.Lobos.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
Items.Lobos.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.4, value: true, num: 1});
Items.Lobos.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
Items.Lobos.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
Items.Lobos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Wolf, str: "wolf ears"});
Items.Lobos.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Wolf, color: Color.gray, str: "a gray, fluffy wolf tail!"});
Items.Lobos.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 30, max: 1});
Items.Lobos.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
Items.Lobos.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
Items.Lobos.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
Items.Lobos.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
Items.Lobos.PushEffect(TF.ItemEffects.DecCha, {odds: 0.1, ideal: 10, max: 1});
Items.Lobos.PushEffect(TF.ItemEffects.DecFem, {odds: 0.1, ideal: -.7, max: .1, male: true});
Items.Lobos.PushEffect(TF.ItemEffects.IncTone, {odds: 0.1, ideal: .8, max: .1 });
Items.Lobos.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});


Items.Vulpinix = new TFItem("fox0", "Vulpinix");
Items.Vulpinix.price = 8;
Items.Vulpinix.lDesc = function() { return "a bottle of Vulpinix"; }
Items.Vulpinix.Short = function() { return "A bottle of Vulpinix"; }
Items.Vulpinix.Long = function() { return "A bottle labeled Vulpinix, with the picture of a fox on it. The fluid within is opaque, and bright red."; }
Items.Vulpinix.recipe = [{it: Items.CanisRoot}, {it: Items.FoxBerries}, {it: Items.Foxglove}];
// Effects
Items.Vulpinix.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Fox, str: "a vulpine cock"});
Items.Vulpinix.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.4, value: true, num: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
Items.Vulpinix.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
Items.Vulpinix.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Fox, str: "vulpine ears"});
Items.Vulpinix.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Fox, color: Color.red, str: "a red, fluffy fox tail!"});
Items.Vulpinix.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 25, max: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 10, max: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.DecSpi, {odds: 0.1, ideal: 15, max: 1});
Items.Vulpinix.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.1, rangeMax: 0.4, max: .1 });
Items.Vulpinix.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Thin, max: 2});
Items.Vulpinix.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 6, max: 2 });


Items.Infernum = new TFItem("demon0", "Infernum");
Items.Infernum.price = 15;
Items.Infernum.lDesc = function() { return "a bottle of Infernum"; }
Items.Infernum.Short = function() { return "A bottle of Infernum"; }
Items.Infernum.Long = function() { return "A bottle labeled Infernum, with the picture of a demon on it. The fluid within is a thick red sludge, tainted with black bubbles."; }
Items.Infernum.recipe = [{it: Items.CorruptPlant}, {it: Items.BlackGem}, {it: Items.CorruptSeed}];
// Effects
Items.Infernum.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.2, race: Race.Demon, color: Color.red, str: "plantigrade, demonic legs with clawed feet"});
Items.Infernum.PushEffect(TF.ItemEffects.SetArms, {odds: 0.2, race: Race.Demon, color: Color.red, str: "demonic arms with clawed hands"});
Items.Infernum.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Demon, str: "a demon cock"});
Items.Infernum.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Demon, color: Color.red, str: "a red, spaded demon tail"});
Items.Infernum.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Demon, color: Color.red, count: 2, str: "a pair of demon horns" });
Items.Infernum.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 25, max: 1});
Items.Infernum.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 25, max: 1});
Items.Infernum.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
Items.Infernum.PushEffect(TF.ItemEffects.IncLib, {odds: 0.4, ideal: 35, max: 1});
Items.Infernum.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: .8, max: .1, female: true});
Items.Infernum.PushEffect(TF.ItemEffects.DecFem, {odds: 0.1, ideal: -.8, max: .1, male: true});


Items.Avia = new TFItem("avian0", "Avia");
Items.Avia.price = 25;
Items.Avia.lDesc = function() { return "a bottle of Avia"; }
Items.Avia.Short = function() { return "A bottle of Avia"; }
Items.Avia.Long = function() { return "A bottle labeled Avia, with the picture of a bird on it. The fluid within is a clear, bright blue."; }
Items.Avia.recipe = [{it: Items.Feather}, {it: Items.Trinket}, {it: Items.FruitSeed}];
// Effects
Items.Avia.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Avian, str: "an avian cock"});
Items.Avia.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
Items.Avia.PushEffect(TF.ItemEffects.RemTail, {odds: 0.2, count: 1});
Items.Avia.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.2, value: false, num: 1});
Items.Avia.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.2, value: false, num: 1});
Items.Avia.PushEffect(TF.ItemEffects.SetWings, {odds: 0.4, race: Race.Avian, color: Color.brown, count: 2, str: "a pair of avain wings" });
Items.Avia.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
Items.Avia.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
Items.Avia.PushEffect(TF.ItemEffects.DecSta, {odds: 0.1, ideal: 15, max: 1});
Items.Avia.PushEffect(TF.ItemEffects.DecCha, {odds: 0.1, ideal: 15, max: 1});
Items.Avia.PushEffect(TF.ItemEffects.IncDex, {odds: 0.3, ideal: 35, max: 1});
Items.Avia.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 40, max: 1});
Items.Avia.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.2, ideal: 30, max: 1});
Items.Avia.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 2, max: 2 });


Items.Lepida = new TFItem("moth0", "Lepida");
Items.Lepida.price = 25;
Items.Lepida.lDesc = function() { return "a bottle of Lepida"; }
Items.Lepida.Short = function() { return "A bottle of Lepida"; }
Items.Lepida.Long = function() { return "A bottle labeled Lepida, with the picture of a moth on it. The fluid within is a deep purple."; }
Items.Lepida.recipe = [{it: Items.MFluff}, {it: Items.MDust}, {it: Items.FruitSeed}];
// Effects
Items.Lepida.PushEffect(TF.ItemEffects.SetAntenna, {odds: 0.4, race: Race.Moth, color: Color.purple, count: 2, str: "a pair of moth-like feelers" });
Items.Lepida.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
Items.Lepida.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.1, value: false, num: 1});
Items.Lepida.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
Items.Lepida.PushEffect(TF.ItemEffects.SetWings, {odds: 0.4, race: Race.Moth, color: Color.purple, count: 2, str: "a pair of insect wings" });
Items.Lepida.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 35, max: 1});
Items.Lepida.PushEffect(TF.ItemEffects.IncSta, {odds: 0.3, ideal: 25, max: 1});
Items.Lepida.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 30, max: 1});
Items.Lepida.PushEffect(TF.ItemEffects.DecDex, {odds: 0.1, ideal: 15, max: 1});
Items.Lepida.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
Items.Lepida.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: .8, max: .1});
Items.Lepida.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
Items.Lepida.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});


Items.Scorpius = new TFItem("scorp0", "Scorpius");
Items.Scorpius.price = 25;
Items.Scorpius.lDesc = function() { return "a bottle of Scorpius"; }
Items.Scorpius.Short = function() { return "A bottle of Scorpius"; }
Items.Scorpius.Long = function() { return "A bottle labeled Scorpius, with the picture of a scorpion on it. The fluid within is a pitch black."; }
Items.Scorpius.recipe = [{it: Items.Stinger}, {it: Items.SVenom}, {it: Items.SClaw}];
// Effects
Items.Scorpius.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Scorpion, color: Color.black, str: "a black, segmented scorpion tail"});
Items.Scorpius.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.1, value: false, num: 1});
Items.Scorpius.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
Items.Scorpius.PushEffect(TF.ItemEffects.RemWings, {odds: 0.6, count: 2});
Items.Scorpius.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
Items.Scorpius.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
Items.Scorpius.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 20, max: 1});
Items.Scorpius.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
Items.Scorpius.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: .7, max: .1});
Items.Scorpius.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.1, rangeMax: 0.3, max: .1 });
Items.Scorpius.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});


Items.Cerventine = new TFItem("deer0", "Cerventine");
Items.Cerventine.price = 25;
Items.Cerventine.lDesc = function() { return "a bottle of Cerventine"; }
Items.Cerventine.Short = function() { return "A bottle of Cerventine"; }
Items.Cerventine.Long = function() { return "A bottle filled with a soft brown liquid. It has a picture of a deer on it."; }
Items.Cerventine.recipe = [{it: Items.FreshGrass}, {it: Items.TreeBark}, {it: Items.AntlerChip}];
// Effects
Items.Cerventine.PushEffect(TF.ItemEffects.SetSheath, {odds: 0.1, value: true, num: 1});
Items.Cerventine.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
Items.Cerventine.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Deer, str: "a cervine cock"});
Items.Cerventine.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Deer, str: "cervine ears"});
Items.Cerventine.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Deer, color: Color.brown, str: "a short cervine tail"});
Items.Cerventine.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Deer, color: Color.brown, str: "a pair of deer antlers!", count: 2});
Items.Cerventine.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Deer, str: "smooth cervine legs, with cloven hooves"});
Items.Cerventine.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
Items.Cerventine.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 30, max: 1});
Items.Cerventine.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.3, ideal: 25, max: 1});
Items.Cerventine.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 15, max: 1});
Items.Cerventine.PushEffect(TF.ItemEffects.DecSta, {odds: 0.1, ideal: 20, max: 1});
Items.Cerventine.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: .5, max: .1});
Items.Cerventine.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0, rangeMax: 0.2, max: .1 });
Items.Cerventine.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});
Items.Cerventine.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.2, ideal: 17, max: 1});
Items.Cerventine.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.2, ideal: 4, max: 1});


Items.Homos = new TFItem("human0", "Homos");
Items.Homos.price = 25;
Items.Homos.lDesc = function() { return "a bottle of Homos"; }
Items.Homos.Short = function() { return "A bottle of Homos"; }
Items.Homos.Long = function() { return "A bottle labeled Homos, with the picture of a regular human on it. The fluid within is clear and colorless, like water."; }
Items.Homos.recipe = [{it: Items.Hummus}, {it: Items.SpringWater}, {it: Items.Letter}];
// Effects
Items.Homos.PushEffect(TF.ItemEffects.SetBody, {odds: 0.4, race: Race.Human, str: "human body"});
Items.Homos.PushEffect(TF.ItemEffects.SetFace, {odds: 0.3, race: Race.Human, str: "human face"});
Items.Homos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Human, str: "human ears"});
Items.Homos.PushEffect(TF.ItemEffects.SetArms, {odds: 0.3, race: Race.Human, str: "human arms"});
Items.Homos.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Human, str: "human legs"});
Items.Homos.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Human, str: "a human cock"});
Items.Homos.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.6, count: 2});
Items.Homos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.6, race: Race.Human, str: "human ears"});
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
			target.body.legs.race = Race.Human;
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
		var res = target.Balls().size.IncreaseStat(14, 1);
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
Items.Virilium.PushEffect(TF.ItemEffects.IncTone, {odds: 0.1, ideal: .7, max: .1});
Items.Virilium.PushEffect(TF.ItemEffects.DecFem, {odds: 0.1, ideal: -1, max: .1});


Items.Fertilium = new TFItem("sex1", "Fertilium");
Items.Fertilium.price = 100;
Items.Fertilium.lDesc = function() { return "a bottle of Fertilium"; }
Items.Fertilium.Short = function() { return "A bottle of Fertilium"; }
Items.Fertilium.Long = function() { return "A bottle of fertility-enhancing Fertilium."; }
Items.Fertilium.recipe = [{it: Items.Felinix}, {it: Items.Leporine}, {it: Items.Bovia}];
// Effects
Items.Fertilium.PushEffect(TF.ItemEffects.IncLib, {odds: 0.3, ideal: 40, max: 2});
Items.Fertilium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.2, ideal: 40, max: 2});
Items.Fertilium.PushEffect(function(target) {
	var parse = {
		Poss: target.Possessive(),
		notS: target.plural() ? "" : "s"
	};
	if(target.HasBalls() && Math.random() < 0.6) {
		var res = target.Balls().size.DecreaseStat(1, 1);
		if(target.Balls().size.Get() <= 1) {
			target.Balls().count.base = 0;
			Text.Add("[Poss] balls shrivel and disappear completely!", parse);
			Text.NL();
		}
		else {
			Text.Add("[Poss] balls have shrunk in size!", parse);
			Text.NL();
		}
	}
	Text.Flush();
});
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
Items.Fertilium.PushEffect(TF.ItemEffects.DecTone, {odds: 0.1, ideal: 0, max: .1});
Items.Fertilium.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: 1, max: .1});


//TODO Effects
Items.Testos = new TFItem("sex2", "Testos");
Items.Testos.price = 100;
Items.Testos.lDesc = function() { return "a bottle of Testos"; }
Items.Testos.Short = function() { return "A bottle of Testos"; }
Items.Testos.Long = function() { return "A bottle of pure masculinity labled Testos."; }
Items.Testos.recipe = [{it: Items.Equinium}, {it: Items.Homos}, {it: Items.Canis}];
Items.Testos.PushEffect(TF.ItemEffects.IncTone, {odds: 0.3, ideal: .7, max: .1});
Items.Testos.PushEffect(TF.ItemEffects.DecFem, {odds: 0.3, ideal: -1, max: .1});
Items.Testos.PushEffect(function(target) {
	var parse = {
		Name: target.NameDesc(),
		Poss: target.Possessive(),
		ballsDesc : function() { return target.BallsDesc(); },
		s      : target.HasBalls() ? "s" : "",
		notS   : target.HasBalls() ? "" : "s",
		notS2  : target.plural()   ? "" : "s",
		itThey : target.HasBalls() ? "they" : "it"
	};
	if(target.HasBalls() && Math.random() < 0.6) {
		var res = target.Balls().size.IncreaseStat(14, 1);
		if(res > 0) {
			Text.Add("[Poss] balls have grown in size!", parse);
			Text.NL();
		}
	}
	if(!target.HasBalls() && target.FirstCock() && Math.random() < 0.5) {
		target.Balls().count.base = 2;
		target.Balls().size.base  = 3;
		Text.Add("[Name] grow[notS2] a pair of average testicles.", parse);
		Text.NL();
	}
	Text.Flush();
});
Items.Testos.PushEffect(function(target) {
	var parse = {
		Name : target.NameDesc(),
		poss : target.possessive(),
		Poss : target.Possessive(),
		multiCockDesc : function() { return target.MultiCockDesc(); }
	};
	parse = target.ParserPronouns(parse);
	
	var vags  = target.AllVags();
	var cocks = target.AllCocks();
	if(vags.length > 0 && Math.random() < 0.4) {
		var randVag = Math.floor(Math.random() * vags.length);
		var vag = vags[randVag];
		
		vag.capacity.DecreaseStat(1, 1);
		
		if(vag.capacity.Get() <= 2)
		{
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
		}
		else {
			if(vags.length > 0)
				Text.Add("One of [poss] pussies shrinks, becoming tighter.", parse);
			else
				Text.Add("[Poss] pussy shrinks, becoming tighter.", parse);
		}
		Text.Flush();
	}
	if(Math.random() < 0.75) {
		var len = false, thk = false;
		for(var i = 0; i < cocks.length; i++) {
			// Base size
			len |= cocks[i].length.IncreaseStat(35, 1);
			thk |= cocks[i].thickness.IncreaseStat(10, .5);
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
Items.Estros.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1});
Items.Estros.PushEffect(TF.ItemEffects.IncFem, {odds: 0.8, ideal: 1, max: .1});
Items.Estros.PushEffect(function(target) {
	var parse = {
		Poss: target.Possessive(),
		notS: target.plural() ? "" : "s"
	};
	if(target.HasBalls() && Math.random() < 0.6) {
		var res = target.Balls().size.DecreaseStat(1, 1);
		if(target.Balls().size.Get() <= 1) {
			target.Balls().count.base = 0;
			Text.Add("[Poss] balls shrivel and disappear completely!", parse);
			Text.NL();
		}
		else {
			Text.Add("[Poss] balls have shrunk in size!", parse);
			Text.NL();
		}
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
	if(cocks.length > 0 && Math.random() < 0.4) {
		var randCock = Math.floor(Math.random() * cocks.length);
		var cock = cocks[randCock];
		
		cock.length.DecreaseStat(5, 1);
		cock.thickness.DecreaseStat(1, .5);
		
		if(cock.Len() <= 7 || cock.Thickness() <= 2)
		{
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
		}
		else {
			parse = Text.ParserPlural(parse, target.NumCocks() > 1);
			Text.Add("[Poss] [multiCockDesc] shudder[notS],[oneof] the stiff dick[s] shrinking in girth and length.", parse);
		}
		Text.Flush();
	}
	if(Math.random() < 0.75) {
		var growth = false;
		for(var i = 0; i < vags.length; i++) {
			growth |= vags[i].capacity.IncreaseStat(10, .5);
		}
		if(growth) {
			parse = Text.ParserPlural(parse, target.NumVags() > 1);
			Text.Add("[Poss] cunt[s] shudder[notS], growing looser.", parse);
			Text.Flush();
		}
	}
});
