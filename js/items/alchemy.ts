import * as _ from 'lodash';

import { Item, ItemType } from '../item';
import { TF, TFItem } from '../tf';
import { Genitalia } from '../body/genitalia';
import { HipSize } from '../body/body';
import { IngredientItems } from './ingredients';
import { Race } from '../body/race';
import { Color } from '../body/color';
import { GAME } from '../GAME';
import { Text } from '../text';
import { Entity } from '../entity';
import { Status } from '../statuseffect';
import { Vagina } from '../body/vagina';
import { Cock } from '../body/cock';
import { EncounterTable } from '../encountertable';
import { PregnancyLevel, Womb } from '../pregnancy';

let AlchemyItems : any = {};

AlchemyItems.Equinium = new TFItem("equin0", "Equinium");
AlchemyItems.Equinium.price = 7;
AlchemyItems.Equinium.lDesc = function() { return "a bottle of Equinium"; }
AlchemyItems.Equinium.Short = function() { return "A bottle of Equinium"; }
AlchemyItems.Equinium.Long = function() { return "A bottle labeled Equinium, with the picture of a horse on it, containing a thick, heady liquid."; }
AlchemyItems.Equinium.recipe = [{it: IngredientItems.HorseShoe}, {it: IngredientItems.HorseHair}, {it: IngredientItems.HorseCum}];
// Effects
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Horse, str: "a horsecock"});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Horse, str: "equine ears"});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Horse, color: Color.brown, str: "a brown, bushy horse tail"});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Sheath});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.5, ideal: 30, max: 1});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.5, ideal: 6, max: 1});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 8, max: 1});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.DecDex, {odds: 0.2, ideal: 8, max: 1});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.DecFem, {odds: 0.2, ideal: -.8, max: .1, male: true});
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.IncTone, {odds: 0.2, ideal: .9, max: .1 });
AlchemyItems.Equinium.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});


AlchemyItems.Leporine = new TFItem("lago0", "Leporine");
AlchemyItems.Leporine.price = 7;
AlchemyItems.Leporine.lDesc = function() { return "a bottle of Leporine"; }
AlchemyItems.Leporine.Short = function() { return "A bottle of Leporine"; }
AlchemyItems.Leporine.Long = function() { return "A bottle labeled Leporine, with the picture of a rabbit on it. The fluid within is clear."; }
AlchemyItems.Leporine.recipe = [{it: IngredientItems.RabbitFoot}, {it: IngredientItems.CarrotJuice}, {it: IngredientItems.Lettuce}];
// Effects
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Rabbit, str: "a bunnycock"});
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Rabbit, str: "floppy bunny ears"});
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Rabbit, color: Color.white, str: "a white, fluffy bunny tail"});
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.5, ideal: 15, max: 1});
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.5, ideal: 3, max: 1});
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.IncLib, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: .5, max: .1});
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Thin, max: 1});
AlchemyItems.Leporine.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 6, max: 2 });


AlchemyItems.Felinix = new TFItem("felin0", "Felinix");
AlchemyItems.Felinix.price = 7;
AlchemyItems.Felinix.lDesc = function() { return "a bottle of Felinix"; }
AlchemyItems.Felinix.Short = function() { return "A bottle of Felinix"; }
AlchemyItems.Felinix.Long = function() { return "A bottle labeled Felinix, with the picture of a cat on it. The fluid within is cloudy."; }
AlchemyItems.Felinix.recipe = [{it: IngredientItems.Whiskers}, {it: IngredientItems.HairBall}, {it: IngredientItems.CatClaw}];
// Effects
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Feline, str: "rough, cat-like tongue"});
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Feline, str: "a feline cock"});
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Feline, str: "fluffy cat ears"});
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Feline, color: Color.orange, str: "an orange, flexible feline tail"});
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.IncDex, {odds: 0.6, ideal: 35, max: 1});
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 25, max: 1});
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 16, max: 1});
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 8, max: 1});
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0.1, max: .1 });
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Thin, max: 1});
AlchemyItems.Felinix.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 6, max: 2 });


AlchemyItems.Lacertium = new TFItem("rept0", "Lacertium");
AlchemyItems.Lacertium.price = 8;
AlchemyItems.Lacertium.lDesc = function() { return "a bottle of Lacertium"; }
AlchemyItems.Lacertium.Short = function() { return "A bottle of Lacertium"; }
AlchemyItems.Lacertium.Long = function() { return "A bottle labeled Lacertium, with the picture of a lizard on it. The fluid within is thick and oily."; }
AlchemyItems.Lacertium.recipe = [{it: IngredientItems.SnakeOil}, {it: IngredientItems.LizardScale}, {it: IngredientItems.LizardEgg}];
// Effects
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Lizard, str: "long, serpentine tongue"});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Lizard, str: "a lizard cock"});
AlchemyItems.Lacertium.PushEffect(function(target : Entity) {
	var cocks = target.AllCocks();
	if(cocks.length == 1 && cocks[0].race == Race.Lizard && Math.random() < 0.1) {
		cocks.push(cocks[0].Clone());
		Text.Add("[Poss] reptilian cock splits in two identical dicks!", { Poss: target.Possessive() });
		Text.NL();
		Text.Flush();
	}
});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Lizard, str: "lizard nubs"});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Lizard, color: Color.green, str: "a green, flexible reptilian tail"});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.SetCover, {odds: 0.2, value: Genitalia.Cover.Slit});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.IncDex, {odds: 0.2, ideal: 25, max: 1});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 28, max: 1});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 16, max: 1});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.DecSpi, {odds: 0.1, ideal: 20, max: 1});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.3, ideal: 20, max: 2 });
AlchemyItems.Lacertium.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.3, ideal: 4, max: 1 });


AlchemyItems.Ovis = new TFItem("ovis0", "Ovis");
AlchemyItems.Ovis.price = 8;
AlchemyItems.Ovis.lDesc = function() { return "a bottle of Ovis"; }
AlchemyItems.Ovis.Short = function() { return "A bottle of Ovis"; }
AlchemyItems.Ovis.Long = function() { return "A bottle labeled Ovis, with the picture of a sheep on it. The fluid within is milky white."; }
AlchemyItems.Ovis.recipe = [{it: IngredientItems.SheepMilk}, {it: IngredientItems.Ramshorn}, {it: IngredientItems.FreshGrass}];
// Effects
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Sheep, str: "sheep ears"});
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Sheep, color: Color.white, str: "a short ovine tail"});
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.SetCover, {odds: 0.2, value: Genitalia.Cover.NoCover});
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Sheep, color: Color.black, count: 2, str: "a pair of sheep horns" });
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 30, max: 1});
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 15, max: 1});
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal:  5, max: 1});
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});
AlchemyItems.Ovis.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 0.4, ideal: 16, max: 2, female: true });


AlchemyItems.Bovia = new TFItem("bov0", "Bovia");
AlchemyItems.Bovia.price = 8;
AlchemyItems.Bovia.lDesc = function() { return "a bottle of Bovia"; }
AlchemyItems.Bovia.Short = function() { return "A bottle of Bovia"; }
AlchemyItems.Bovia.Long = function() { return "A bottle labeled Bovia, with the picture of a cow on it. The fluid within is milky white."; }
AlchemyItems.Bovia.recipe = [{it: IngredientItems.CowMilk}, {it: IngredientItems.CowBell}, {it: IngredientItems.FreshGrass}];
// Effects
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Cow, str: "broad, cow-like tongue"});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Cow, str: "a bovine cock"});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Cow, str: "bovine ears"});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Cow, color: Color.black, str: "a long bovine tail, ending in a tuft of black hair"});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Cow, color: Color.black, str: "a pair of strong bovine horns!", count: 2});
AlchemyItems.Bovia.PushEffect(function(target : Entity) {
	var parse = { Poss: target.Possessive() };
	var breasts = target.BiggestBreasts();
	if(target.FirstVag() || (breasts && breasts.size.Get() > 5)) {
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
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.IncStr, {odds: 0.5, ideal: 35, max: 1});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 20, max: 1});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.IncLib, {odds: 0.3, ideal: 25, max: 1});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 10, max: 1});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.DecDex, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.IncFem, {odds: 0.3, ideal: 1, max: .1});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.1, rangeMax: 0.3, max: .1 });
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.IncHips, {odds: 0.3, ideal: HipSize.VeryWide, max: 2});
AlchemyItems.Bovia.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 1, ideal: 40, max: 5, female: true });


AlchemyItems.Caprinium = new TFItem("goat0", "Caprinium");
AlchemyItems.Caprinium.price = 8;
AlchemyItems.Caprinium.lDesc = function() { return "a bottle of Caprinium"; }
AlchemyItems.Caprinium.Short = function() { return "A bottle of Caprinium"; }
AlchemyItems.Caprinium.Long = function() { return "A bottle filled with a thick white fluid. It has a picture of a goat on it."; }
AlchemyItems.Caprinium.recipe = [{it: IngredientItems.GoatMilk}, {it: IngredientItems.FreshGrass}, {it: IngredientItems.GoatFleece}];
// Effects
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Goat, str: "caprine ears"});
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Goat, color: Color.gray, str: "a short caprine tail"});
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Goat, color: Color.black, str: "a pair of curved goat horns!", count: 2});
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Goat, str: "fleece-covered caprine legs, with hooves"});
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.IncSta, {odds: 0.3, ideal: 25, max: 1});
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 35, max: 1});
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.DecCha, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: .5, max: .1});
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.3, rangeMax: 0.7, max: .1 });
AlchemyItems.Caprinium.PushEffect(TF.ItemEffects.DecBreastSize, {odds: .6, ideal: 2, max: 3 });


AlchemyItems.Canis = new TFItem("dog0", "Canis");
AlchemyItems.Canis.price = 8;
AlchemyItems.Canis.lDesc = function() { return "a bottle of Canis"; }
AlchemyItems.Canis.Short = function() { return "A bottle of Canis"; }
AlchemyItems.Canis.Long = function() { return "A bottle labeled Canis, with the picture of a dog on it. The fluid within is opaque, and slightly reddish."; }
AlchemyItems.Canis.recipe = [{it: IngredientItems.CanisRoot}, {it: IngredientItems.DogBone}, {it: IngredientItems.DogBiscuit}];
// Effects
AlchemyItems.Canis.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Dog, str: "dog-like tongue"});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Dog, str: "a canid cock"});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Sheath});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Dog, str: "canid ears"});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Dog, color: Color.brown, str: "a brown, fluffy dog tail!"});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 25, max: 1});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 10, max: 1});
AlchemyItems.Canis.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.2, rangeMax: 0.5, max: .1 });
AlchemyItems.Canis.PushEffect(TF.ItemEffects.IncCockLen, {odds: 0.4, ideal: 20, max: 2 });
AlchemyItems.Canis.PushEffect(TF.ItemEffects.IncCockThk, {odds: 0.4, ideal: 5, max: 1 });


AlchemyItems.Lobos = new TFItem("wolf0", "Lobos");
AlchemyItems.Lobos.price = 8;
AlchemyItems.Lobos.lDesc = function() { return "a bottle of Lobos"; }
AlchemyItems.Lobos.Short = function() { return "A bottle of Lobos"; }
AlchemyItems.Lobos.Long = function() { return "A bottle labeled Lobos with the picture of a wolf on it. The fluid within is opaque, and dullish gray."; }
AlchemyItems.Lobos.recipe = [{it: IngredientItems.CanisRoot}, {it: IngredientItems.WolfFang}, {it: IngredientItems.Wolfsbane}];
// Effects
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Wolf, str: "a wolf cock"});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Sheath});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Wolf, str: "wolf ears"});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Wolf, color: Color.gray, str: "a gray, fluffy wolf tail!"});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.DecCha, {odds: 0.1, ideal: 10, max: 1});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.DecFem, {odds: 0.1, ideal: -.7, max: .1, male: true});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.IncTone, {odds: 0.1, ideal: .8, max: .1 });
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.IncCockLen, {odds: 0.4, ideal: 24, max: 2 });
AlchemyItems.Lobos.PushEffect(TF.ItemEffects.IncCockThk, {odds: 0.4, ideal: 6, max: 1 });


AlchemyItems.Vulpinix = new TFItem("fox0", "Vulpinix");
AlchemyItems.Vulpinix.price = 8;
AlchemyItems.Vulpinix.lDesc = function() { return "a bottle of Vulpinix"; }
AlchemyItems.Vulpinix.Short = function() { return "A bottle of Vulpinix"; }
AlchemyItems.Vulpinix.Long = function() { return "A bottle labeled Vulpinix, with the picture of a fox on it. The fluid within is opaque, and bright red."; }
AlchemyItems.Vulpinix.recipe = [{it: IngredientItems.CanisRoot}, {it: IngredientItems.FoxBerries}, {it: IngredientItems.Foxglove}];
// Effects
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Fox, str: "a vulpine cock"});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Sheath});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Fox, str: "vulpine ears"});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Fox, color: Color.red, str: "a red, fluffy fox tail!"});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 25, max: 1});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 10, max: 1});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.DecSpi, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.1, rangeMax: 0.4, max: .1 });
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Thin, max: 2});
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 6, max: 2 });
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.3, ideal: 19, max: 2 });
AlchemyItems.Vulpinix.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.3, ideal: 4, max: 1 });


AlchemyItems.Infernum = new TFItem("demon0", "Infernum");
AlchemyItems.Infernum.price = 15;
AlchemyItems.Infernum.lDesc = function() { return "a bottle of Infernum"; }
AlchemyItems.Infernum.Short = function() { return "A bottle of Infernum"; }
AlchemyItems.Infernum.Long = function() { return "A bottle labeled Infernum, with the picture of a demon on it. The fluid within is a thick red sludge, tainted with black bubbles."; }
AlchemyItems.Infernum.recipe = [{it: IngredientItems.CorruptPlant}, {it: IngredientItems.BlackGem}, {it: IngredientItems.CorruptSeed}];
// Effects
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Demon, str: "long and flexible tongue"});
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.2, race: Race.Demon, color: Color.red, str: "plantigrade, demonic legs with clawed feet"});
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.SetArms, {odds: 0.2, race: Race.Demon, color: Color.red, str: "demonic arms with clawed hands"});
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Demon, str: "a demon cock"});
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Demon, color: Color.red, str: "a red, spaded demon tail"});
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Demon, color: Color.red, count: 2, str: "a pair of demon horns" });
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 25, max: 1});
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 25, max: 1});
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.IncLib, {odds: 0.4, ideal: 35, max: 1});
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: .8, max: .1, female: true});
AlchemyItems.Infernum.PushEffect(TF.ItemEffects.DecFem, {odds: 0.1, ideal: -.8, max: .1, male: true});


AlchemyItems.Avia = new TFItem("avian0", "Avia");
AlchemyItems.Avia.price = 25;
AlchemyItems.Avia.lDesc = function() { return "a bottle of Avia"; }
AlchemyItems.Avia.Short = function() { return "A bottle of Avia"; }
AlchemyItems.Avia.Long = function() { return "A bottle labeled Avia, with the picture of a bird on it. The fluid within is a clear, bright blue."; }
AlchemyItems.Avia.recipe = [{it: IngredientItems.Feather}, {it: IngredientItems.Trinket}, {it: IngredientItems.FruitSeed}];
// Effects
AlchemyItems.Avia.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Avian, str: "an avian cock"});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.RemTail, {odds: 0.2, count: 1});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.SetCover, {odds: 0.2, value: Genitalia.Cover.NoCover});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.2, value: false, num: 1});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.SetWings, {odds: 0.4, race: Race.Avian, color: Color.brown, count: 2, str: "a pair of avian wings" });
AlchemyItems.Avia.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
AlchemyItems.Avia.PushEffect(TF.ItemEffects.DecSta, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.DecCha, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.IncDex, {odds: 0.3, ideal: 35, max: 1});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 40, max: 1});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.2, ideal: 30, max: 1});
AlchemyItems.Avia.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 2, max: 2 });


AlchemyItems.Lepida = new TFItem("moth0", "Lepida");
AlchemyItems.Lepida.price = 10;
AlchemyItems.Lepida.lDesc = function() { return "a bottle of Lepida"; }
AlchemyItems.Lepida.Short = function() { return "A bottle of Lepida"; }
AlchemyItems.Lepida.Long = function() { return "A bottle labeled Lepida, with the picture of a moth on it. The fluid within is a deep purple."; }
AlchemyItems.Lepida.recipe = [{it: IngredientItems.MFluff}, {it: IngredientItems.MDust}, {it: IngredientItems.FruitSeed}];
// Effects
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.SetAntenna, {odds: 0.4, race: Race.Moth, color: Color.purple, count: 2, str: "a pair of moth-like feelers" });
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Moth, str: "long and flexible tongue"});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.SetCover, {odds: 0.1, value: Genitalia.Cover.NoCover});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.SetWings, {odds: 0.4, race: Race.Moth, color: Color.purple, count: 2, str: "a pair of insect wings" });
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 35, max: 1});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.IncSta, {odds: 0.3, ideal: 25, max: 1});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.DecDex, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: .8, max: .1});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.DecCockLen, {odds: 0.3, ideal: 15, max: 2 });
AlchemyItems.Lepida.PushEffect(TF.ItemEffects.DecCockThk, {odds: 0.3, ideal: 3, max: 1 });


AlchemyItems.Scorpius = new TFItem("scorp0", "Scorpius");
AlchemyItems.Scorpius.price = 10;
AlchemyItems.Scorpius.lDesc = function() { return "a bottle of Scorpius"; }
AlchemyItems.Scorpius.Short = function() { return "A bottle of Scorpius"; }
AlchemyItems.Scorpius.Long = function() { return "A bottle labeled Scorpius, with the picture of a scorpion on it. The fluid within is a pitch black."; }
AlchemyItems.Scorpius.recipe = [{it: IngredientItems.Stinger}, {it: IngredientItems.SVenom}, {it: IngredientItems.SClaw}];
// Effects
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Scorpion, color: Color.black, str: "a black, segmented scorpion tail"});
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.SetCover, {odds: 0.1, value: Genitalia.Cover.NoCover});
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.RemWings, {odds: 0.6, count: 2});
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 20, max: 1});
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: .7, max: .1});
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.1, rangeMax: 0.3, max: .1 });
AlchemyItems.Scorpius.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});


AlchemyItems.Cerventine = new TFItem("deer0", "Cerventine");
AlchemyItems.Cerventine.price = 10;
AlchemyItems.Cerventine.lDesc = function() { return "a bottle of Cerventine"; }
AlchemyItems.Cerventine.Short = function() { return "A bottle of Cerventine"; }
AlchemyItems.Cerventine.Long = function() { return "A bottle filled with a soft brown liquid. It has a picture of a deer on it."; }
AlchemyItems.Cerventine.recipe = [{it: IngredientItems.FreshGrass}, {it: IngredientItems.TreeBark}, {it: IngredientItems.AntlerChip}];
// Effects
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.SetCover, {odds: 0.1, value: Genitalia.Cover.Sheath});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Deer, str: "a cervine cock"});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Deer, str: "cervine ears"});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Deer, color: Color.brown, str: "a short cervine tail"});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Deer, color: Color.brown, str: "a pair of deer antlers!", count: 2});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Deer, str: "smooth cervine legs, with cloven hooves"});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.3, ideal: 25, max: 1});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 15, max: 1});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.DecSta, {odds: 0.1, ideal: 20, max: 1});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: .5, max: .1});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0, rangeMax: 0.2, max: .1 });
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.2, ideal: 17, max: 1});
AlchemyItems.Cerventine.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.2, ideal: 4, max: 1});


AlchemyItems.HoneyBrew = new TFItem("bee0", "Honey brew");
AlchemyItems.HoneyBrew.price = 10;
AlchemyItems.HoneyBrew.lDesc = function() { return "a jar of Honey brew"; }
AlchemyItems.HoneyBrew.Short = function() { return "A jar of Honey brew"; }
AlchemyItems.HoneyBrew.Long = function() { return "A jar filled with liquid honey, incredibly sweet and potent."; }
AlchemyItems.HoneyBrew.recipe = [{it: IngredientItems.RawHoney}, {it: IngredientItems.FlowerPetal}, {it: IngredientItems.BeeChitin}];
// Effects
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.SetAntenna, {odds: 0.4, race: Race.Bee, color: Color.black, count: 2, str: "a pair of bee antenna" });
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.SetWings, {odds: 0.4, race: Race.Bee, color: Color.white, count: 2, str: "a pair of bee wings" });
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.SetAbdomen, {odds: 0.4, race: Race.Bee, color: Color.yellow, count: 1, str: "a striped bee abdomen" });
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 25, max: 1});
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 40, max: 1});
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.DecStr, {odds: 0.1, ideal: 20, max: 1});
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 15, max: 1});
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.IncFem, {odds: 0.4, ideal: .9, max: .1});
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0, rangeMax: 0.2, max: .1 });
AlchemyItems.HoneyBrew.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});


AlchemyItems.Florium = new TFItem("plant0", "Florium");
AlchemyItems.Florium.price = 10;
AlchemyItems.Florium.lDesc = function() { return "a bottle of Florium"; }
AlchemyItems.Florium.Short = function() { return "A bottle of Florium"; }
AlchemyItems.Florium.Long = function() { return "A bottle filled with a green fluid. It smells of flowers."; }
AlchemyItems.Florium.recipe = [{it: IngredientItems.Foxglove}, {it: IngredientItems.FlowerPetal}, {it: IngredientItems.TreeBark}];
// Effects
AlchemyItems.Florium.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Plant, str: "a veiny tentacle cock"});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Plant, str: "long, vine-like tentacle tongue"});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.IncInt, {odds: 0.3, ideal: 25, max: 1});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.IncLib, {odds: 0.4, ideal: 40, max: 1});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 30, max: 1});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.2, ideal: 25, max: 1});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.DecStr, {odds: 0.1, ideal: 15, max: 1});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 15, max: 1});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.DecDex, {odds: 0.2, ideal: 20, max: 1});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.IncFem, {odds: 0.4, ideal: .9, max: .1});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
AlchemyItems.Florium.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});
AlchemyItems.Florium.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 0.2, ideal: 20, max: 2, female: true});
/*
 * TODO

Effects:
Plant hair?
Green eyes

 */


AlchemyItems.Homos = new TFItem("human0", "Homos");
AlchemyItems.Homos.price = 25;
AlchemyItems.Homos.lDesc = function() { return "a bottle of Homos"; }
AlchemyItems.Homos.Short = function() { return "A bottle of Homos"; }
AlchemyItems.Homos.Long = function() { return "A bottle labeled Homos, with the picture of a regular human on it. The fluid within is clear and colorless, like water."; }
AlchemyItems.Homos.recipe = [{it: IngredientItems.Hummus}, {it: IngredientItems.SpringWater}, {it: IngredientItems.Letter}];
// Effects
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetBody, {odds: 0.4, race: Race.Human, str: "human body"});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetFace, {odds: 0.3, race: Race.Human, str: "human face"});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Human, str: "human tongue"});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Human, str: "human ears"});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetArms, {odds: 0.3, race: Race.Human, str: "human arms"});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Human, str: "human legs"});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Human, str: "a human cock"});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.6, count: 2});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.6, race: Race.Human, str: "human ears"});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.NoCover});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: false, num: 1});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.RemTail, {odds: 0.6, count: 1});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.RemWings, {odds: 0.6, count: 2});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.6, count: 2});
AlchemyItems.Homos.PushEffect(TF.ItemEffects.RemAbdomen, {odds: 0.6, count: 1});
AlchemyItems.Homos.PushEffect(function(target : Entity) {
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
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.3, ideal: 20, max: 2 });
AlchemyItems.Homos.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.3, ideal: 4, max: 1 });


AlchemyItems.Virilium = new TFItem("sex0", "Virilium");
AlchemyItems.Virilium.price = 100;
AlchemyItems.Virilium.lDesc = function() { return "a bottle of Virilium"; }
AlchemyItems.Virilium.Short = function() { return "A bottle of Virilium"; }
AlchemyItems.Virilium.Long = function() { return "A bottle of potency-enhancing Virilium."; }
AlchemyItems.Virilium.recipe = [{it: AlchemyItems.Equinium}, {it: AlchemyItems.Leporine}, {it: AlchemyItems.Lobos}];
// Effects
AlchemyItems.Virilium.PushEffect(TF.ItemEffects.IncLib, {odds: 0.3, ideal: 40, max: 2});
AlchemyItems.Virilium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.2, ideal: 40, max: 2});
AlchemyItems.Virilium.PushEffect(TF.ItemEffects.SetBalls, {odds: 0.1, ideal: 2, count: 2});
AlchemyItems.Virilium.PushEffect(function(target : Entity) {
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
AlchemyItems.Virilium.PushEffect(function(target : Entity) {
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
AlchemyItems.Virilium.PushEffect(TF.ItemEffects.IncTone, {odds: 0.1, ideal: .7, max: .1});
AlchemyItems.Virilium.PushEffect(TF.ItemEffects.DecFem, {odds: 0.1, ideal: -1, max: .1});


AlchemyItems.Gestarium = new TFItem("preg0", "Gestarium");
AlchemyItems.Gestarium.price = 50;
AlchemyItems.Gestarium.lDesc = function() { return "a bottle of Gestarium"; }
AlchemyItems.Gestarium.Short = function() { return "A bottle of Gestarium"; }
AlchemyItems.Gestarium.Long  = function() { return "A small vial of thick, clear liquid. Drinking this while pregnant will cause the drinker’s pregnancy to advance somewhat."; }
AlchemyItems.Gestarium.recipe = [{it: AlchemyItems.Fertilium}, {it: AlchemyItems.Estros}, {it: AlchemyItems.Bovia}];
// Effects
AlchemyItems.Gestarium.PushEffect(function(target : Entity) {
	var parse : any = {
		Name : target.NameDesc(),
		name : target.nameDesc(),
		Poss : target.Possessive(),
		poss : target.possessive()
	};
	parse = target.ParserTags(parse);
	parse = target.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, target.plural());
	
	Text.Add("Unstoppering the vial, [name] drink[notS] the viscous liquid in one gulp. It tastes faintly of raw egg yolk with a texture to match, but goes down smoothly without a hitch.", parse);
	Text.NL();
	var isPreg = target.pregHandler.PregnantWombs();
	var wombs = _.filter(isPreg, function(w) {
		return w.progress < 1;
	});
	if(isPreg.length > 0) {
		if(wombs.length > 0) {
			Text.Add("Nothing happens for a moment, and then [poss] hands fly to [hisher] [belly] as a comforting warmth takes root in its lower depths, slowly spreading outwards to fill [hisher] womb.", parse);
			Text.NL();
			
			AlchemyItems.Gestarium.BellyGrowth(target, wombs, parse);
		}
		else {
			parse["_is"] = target.plural() ? "'re" : " is";
			Text.Add("While a faint gurgle sounds from within [poss] [belly], the skin visibly trembling, [hisher] pregnancy doesn’t grow any further. Seems like [name][_is] fit to pop any moment - best to get somewhere safe for the birth, lest you have to do the deed at an inconvenient time…", parse);
		}
	}
	else {
		Text.Add("Moments tick by, but nothing happens. Maybe drinking this while not pregnant wasn’t the best of ideas… ", parse);
	}
	Text.NL();
});

AlchemyItems.Gestarium.BellyGrowth = function(target : Entity, wombs : Womb[], parse : any) {
	var size = target.pregHandler.BellySize();
	
	if(size < 0.1)
		Text.Add("Gradually, [name] become[notS] aware of a faint pressure deep within [hisher] lower belly, palpable waves of contentment radiating from within even as the skin quavers and pulses to reflect the changes taking place within.", parse);
	else if(size < 0.3)
		Text.Add("Slowly, the warmth turns to pressure, and [name] look[notS] down to find the gentle swell of [hisher] baby bump pushing outward. Almost unnoticeable before, it’s becoming less and less so with each passing moment as the life growing inside begins to push against [poss] womb in earnest.", parse);
	else if(size < 0.5)
		Text.Add("[Name] let[notS] out a gentle, quivering sigh as the warmth begins to push outward and clutch[notEs] [hisher] belly as butterflies erupt in the pit of [hisher] stomach. Pulsating with steady growth, [poss] baby bump begins to spread [hisher] hands apart as the potion’s effects take hold and cause the offspring within to mature rapidly. It’s not that big yet, but how large will it be when this is over?", parse);
	else if(size < 0.8)
		Text.Add("A soft moan escapes [poss] mouth as [hisher] tummy, already obviously pregnant, begins to fill out even more thanks to the potion’s effects.", parse);
	else if(size < 1.2)
		Text.Add("[Name] pant[notS] and gasp[notS] as the feeling of being so full of life floods [hisher] senses; shamelessly, [heshe] rub[notS] [hisher] hands of the burgeoning swell of [hisher] [belly] as it fills out beautifully. Already heavily pregnant and being filled with even more life by the moment, one can only guess at where the growth will stop…", parse);
	else if(size < 1.6)
		Text.Add("Slowly, almost reluctantly, the potion’s effects take hold, and [name] moan[notS] unabashedly at the wondrous sensations coursing through [hisher] body, centered about [hisher] womb. Already stretched taut, the skin about [hisher] pregnant belly grows thinner and thinner as the life within grows bigger and bigger, heavier and heavier…", parse);
	else if(size < 2.0)
		Text.Add("An ominous rumble resounds from deep within [poss] womb, the usually taut skin of [hisher] womb quivering like jelly as energy gathers in preparation for what’s to come. It doesn’t take long, either - before you know it, [poss] pregnancy is swelling forth before your very eyes, a rapid, pulsating growth. Pushing out and then shrinking in a little, pushing out and then shrinking in a little, [poss] oversized pregnancy already looks overdue with twins, and it’s still getting bigger…", parse);
	else if(size < 3.0)
		Text.Add("Clutching [hisher] monstrous pregnancy, [name] huff[notS] and puff[notS], openly panting as the potion acts on the new life developing within [himher]. Staggering a little as [hisher] center of balance begins to shift once more, [name] run[notS] a hand over the taut [skin] that covers the swell of [hisher] pregnancy, delighting in the growth that’s taking place.", parse);
	else
		Text.Add("It seems impossible that [name] could get any larger, yet that’s exactly what happens. Lost in the sheer bliss of warmth and growth, [name] [isAre] certainly in a motherly way as the potion takes hold on [hisher] burgeoning womb. Tightly stretched skin creaks as [poss] growth accelerates, and you can’t help but wonder if [name] [isAre] about to burst…", parse);
	Text.Add(" ");
	
	var womb = _.sample(wombs);
	var oldProgress = womb.progress;

	// growth
	womb.progress     += 0.2;
	var hours = 0.2 * womb.hoursToBirth / (1-oldProgress);
	womb.hoursToBirth -= hours;
	
	var newSize = target.pregHandler.BellySize();
	
	if(newSize < 0.3)
		Text.Add("When the sensation passes, [poss] belly has grown ever so slightly outward, the barest of bumps to mark [poss] pregnancy. Even with the potion’s help, it’ll probably be a little while before the new life within is ready to emerge into the world.", parse);
	else if(newSize < 0.5)
		Text.Add("With the growth over, [poss] pregnant bump has settled into a small protrusion - now plainly visible, but still concealable if [heshe] [wasWere] to wear loose-fitting clothes. There’s still plenty of room in [poss] womb for [hisher] offspring to grow, if need be…", parse);
	else if(newSize < 0.8)
		Text.Add("A gurgle sounds from within [poss] [belly], marking the end of the potion-induced growth spurt. [Name] very obviously look[notS] pregnant now - [hisher] belly is impossible to hide, a protruding bump that sticks out in front of [himher]. There’s some weight to it, but it doesn’t look <i>heavy</i> yet - although one wonders if that’s going to change as time passes.", parse);
	else if(newSize < 1.2)
		Text.Add("After the growth spurt’s passed, [name] [isAre] left holding a very huggable pregnant belly: full, rounded and looking as large as a full-term pregnancy - perhaps a little more. With all the added weight, [name] [hasHave] shifted [hisher] stance a little to deal with [hisher] lower center of gravity.", parse);
	else if(newSize < 1.6)
		Text.Add("By the time [poss] womb has calmed once more, [name] [isAre] massive - perhaps the size of a mother carrying full-term twins, give or take a month or so.Tapering off at its peak, [poss] belly juts out before [himher], round and full.", parse);
	else if(newSize < 2.0) {
		Text.Add("The extent to which [poss] belly swells is a little worrisome - well, more than a little worrisome. [HeShe] [isAre] already so large, [hisher] hands barely able to fully encircle the massive maternal mound that juts from [hisher] midesction - just how much longer is this pregnancy going to take, and more importantly, how much bigger [isAre] [name] going to grow?", parse);
		Text.NL();
		Text.Add("You can only suppose that [poss] body knows what’s it’s doing and hasn’t bitten off more than it can chew, but even so…", parse);
	}
	else if(newSize < 3.0) {
		Text.Add("With how heavy [name] already [isAre], all the growth that’s just taken place has made [himher] truly rounded, [hisher] [belly] a massive, swollen dome of impending life. [Poss] skin creaks dangerously as the last spurts of growth take place, but the potion has truly done its job well, allowing [name] to stretch easily and clearly to deal with the rapid maturation of [hisher] young.", parse);
		Text.NL();
		Text.Add("For [poss] own sake, though, hopefully the birthing moment isn’t too far off…", parse);
	}
	else
		Text.Add("Utterly and massively pregnant, you can only wonder how [name] manage[notS] to remain standing as the potion’s effects finally run their course. Ripe and full to the point of bursting, [heshe] can’t even reach around the new contours of [hisher] pregnancy. It can’t be long now, can it? Can it?", parse);
	
	//PC only, since these are more internal feelings than anything else. Play these if the player progresses from one stage to another. I believe it’s impossible for the PC to jump any more than 1 stage from a potion, so things should be fine.
	//Could a separate one be made for followers?
	if(target == GAME().player) {
		var newProgress = womb.progress;
		
		if(oldProgress < PregnancyLevel.Level2 && newProgress >= PregnancyLevel.Level2) {
			Text.NL();
			Text.Add("The growth is accompanied by a pleasant surprise: the vague queasiness that’d been plaguing you quickly vanishes, to be replaced by a warm glow of contentment. It’s faint, but you have the feeling it’ll be growing…", parse);
		}
		else if(oldProgress < PregnancyLevel.Level3 && newProgress >= PregnancyLevel.Level3) {
			Text.NL();
			if(target.FirstBreastRow().Size() >= 2) {
				Text.Add("As your womb has grown, so have your breasts - and the sensation of pressure within them, your boobflesh having perked up. With a faint dribble of warmth, you look down to discover a small white bead welling up on each of your nipples before falling away.", parse);
				Text.NL();
				Text.Add("That’s not all, though. ", parse);
			}
			if(womb.IsEgg()) {
				parse = Text.ParserPlural(parse, womb.litterSize > 1);
				Text.Add("As your belly has grown outwards, so [hasHave] the egg[s] within your womb; you feel a faint tickle of hard shell roll about in your lower belly as they shift into their new positions. While you can’t really feel [itThem] most of the time, it’s nevertheless reassuring to know that [itsTheyre] getting closer to the moment of laying…", parse);
			}
			else
				Text.Add("Accompanying your potion-induced growth spurt is a faint flutter of movement from within your lower belly; you wonder at first if it’s just your imagination, but another faint stirring quashes that doubt. Seems like the life growing within you has decided to make itself known in no uncertain terms.", parse);
		}
		else if(oldProgress < PregnancyLevel.Level4 && newProgress >= PregnancyLevel.Level4) {
			Text.NL();
			Text.Add("Hugging your now-bigger belly, you’re rewarded with ", parse);
			if(womb.IsEgg())
				Text.Add("a jab from within as your newly-enlarged eggs jostle for space within your settling womb. Things are getting pretty crowded in there, by the feel of things - you wait a little while for your womb to calm and adjust to its new load, then get ready to be on your way.", parse);
			else
				Text.Add("a powerful kick from within your [belly], aimed squarely at your hands. Seems like the life you’re bearing is getting quite active now, birth can’t be that far away. Well, hopefully - judging by that last kick and the squirming that’s going on inside you, you’re going to end up perpetually winded if this keeps up all the time.", parse);
		}
		else if(oldProgress < PregnancyLevel.Level5 && newProgress >= PregnancyLevel.Level5) {
			Text.NL();
			Text.Add("With the final pulses of growth, you feel a weight slip downwards from your [belly], nestling snugly against your pelvis and weighing heavily against your cervix. Uh-oh - it seems like you’re really, <i>really</i> close to popping now… best to get yourself to a safe spot to do the deed, lest your body decides to do it anyway at the most inconvenient time…", parse);
		}
	}
	
	if(Math.random() < 0.5) {
		var breasts = target.FirstBreastRow();
		var hipSize = target.body.HipSize();
		var buttSize = target.Butt().Size();
		var lact = target.LactHandler().Rate();
		var production = target.LactHandler().Production();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("[Poss] baby bump isn’t the only thing that’s growing, changing. With the sudden surge of hormones and fertile energy coursing through [name], [poss] [breasts] begin to tingle and turn tender.", parse);
			
			var growth = breasts.Size() < 12.5;
			
			if(growth) {
				Text.Add(" Without further warning, they suddenly balloon outwards, maturing in a potion-induced growth spurt!");
				Text.NL();
				
				breasts.size.IncreaseStat(12.5, 2.5);
				
				parse["cups"] = breasts.ShortCup();
				Text.Add("When the sudden breast expansion fades, [name] [isAre] sporting a pair of [cups], [hisher] mammaries now more capable of nourishing the brood growing within [himher].", parse);
			}
			if(production < 3 && Math.random() < 0.5) {
				Text.NL();
				Text.Add("[Poss] can feel [hisher] breasts swelling slightly, as [heshe] become[notS] able to produce milk at a quicker rate.", parse);
				target.lactHandler.milkProduction.IncreaseStat(3, 1);
			}
			if(lact < 5 && Math.random() < 0.5) { //#if Lactation rate increase occurs
				Text.NL();
				if(growth)
					Text.Add("The changes aren’t done, though. ");
				Text.Add("Gentle heat gathers just behind [poss] nipples, sending tendrils of warmth into the breasts beneath. Boobflesh trembles and nipples stiffen as milk ducts mature and multiply within [poss] milk-makers, increasing the rate at which [heshe] can produce baby food.", parse);
				
				target.lactHandler.lactationRate.IncreaseStat(5, 1);
			}
		}, 1.0, function() { return (lact < 5) || (production < 3) || (breasts.Size() < 12.5); });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("As [poss] baby bump finishes its growth, though, another change is taking place. With a faint creaking and shifting, [name] find[notS] [hisher] stance widening as [hisher] hips widen and butt plumps up, the comforting warmth moving downwards from [hisher] lower belly and working its magic there.", parse);
			Text.NL();
			Text.Add("Seems like [poss] body is thinking ahead - this will definitely help with the eventual birth, although in the meantime, [name] also look[notS] very much more motherly and fertile…", parse);
			
			target.body.torso.hipSize.IncreaseStat(HipSize.VeryWide, 1);
			target.Butt().buttSize.IncreaseStat(15, 1);
		}, 1.0, function() { return (hipSize < HipSize.VeryWide) || (buttSize < 15); });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("Last but not least, [poss] breasts, already firm, turn practically turgid and sensitive - the reason for that soon becomes clear as a bead of rich cream wells up from each nipple before falling away. Seems like the potion was nice enough to fill up [poss] baby-feeders to the brim, ready for a nice milking… or whatever else [heshe] may have in mind.", parse);
			
			target.lactHandler.FillMilk(1);
		}, 1.0, function() { return true; });
		
		scenes.Get();
	}
}



AlchemyItems.GestariumPlus = new TFItem("sex1", "Gestarium+");
AlchemyItems.GestariumPlus.price = 100;
AlchemyItems.GestariumPlus.lDesc = function() { return "a bottle of Gestarium+"; }
AlchemyItems.GestariumPlus.Short = function() { return "A bottle of Gestarium+"; }
AlchemyItems.GestariumPlus.Long = function() { return "A bottle of fertility-enhancing Gestarium+."; }
AlchemyItems.GestariumPlus.recipe = [{it: AlchemyItems.Felinix}, {it: AlchemyItems.Leporine}, {it: AlchemyItems.Bovia}];
// Effects
AlchemyItems.GestariumPlus.PushEffect(TF.ItemEffects.IncLib, {odds: 0.3, ideal: 40, max: 2});
AlchemyItems.GestariumPlus.PushEffect(TF.ItemEffects.IncCha, {odds: 0.2, ideal: 40, max: 2});
AlchemyItems.GestariumPlus.PushEffect(function(target : Entity) {
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
AlchemyItems.GestariumPlus.PushEffect(function(target : Entity) {
	var parse = {
		name  : target.nameDesc(),
		heshe : target.heshe(),
		is    : target.is()
	};
	target.AddLustFraction(0.7);
	
	Text.Add("A shiver runs through [name] as [heshe] [is] hit by a wave of lust!", parse);
	Text.NL();
});
AlchemyItems.GestariumPlus.PushEffect(function(target : Entity) {
	var parse = {
		name : target.nameDesc(),
		poss : target.possessive()
	};
	parse = target.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, target.plural());
	// No effect if not vialble
	if(!target.FirstVag() && !target.PregHandler().MPregEnabled()) {
		Text.Add("A rumble runs through [poss] belly, but [heshe] lack[notS] the organs for the potion to fully take hold.", parse);
		Text.NL();
	}
	else {
		if(Math.random() < 0.3) {
			var res = target.pregHandler.gestationRate.IncreaseStat(3, .2, true);
			if(res) {
				Text.Add("A rumble runs through [poss] belly as [hisher] womb quickens. From now on, pregnancies are going to be quicker for [name]!", parse);
				Text.NL();
			}
		}
		if(Math.random() < 0.4) {
			var res = target.pregHandler.fertility.IncreaseStat(.8, .1, true);
			if(res) {
				Text.Add("A rumble runs through [poss] belly as [hisher] womb quickens. From now on, [name] [isAre] going to be more receptive to impregnation!", parse);
				Text.NL();
			}
		}
	}
	Text.Flush();
});
AlchemyItems.GestariumPlus.PushEffect(TF.ItemEffects.DecTone, {odds: 0.1, ideal: 0, max: .1});
AlchemyItems.GestariumPlus.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: 1, max: .1});


AlchemyItems.Testos = new TFItem("sex2", "Testos");
AlchemyItems.Testos.price = 100;
AlchemyItems.Testos.lDesc = function() { return "a bottle of Testos"; }
AlchemyItems.Testos.Short = function() { return "A bottle of Testos"; }
AlchemyItems.Testos.Long = function() { return "A bottle of pure masculinity labled Testos."; }
AlchemyItems.Testos.recipe = [{it: AlchemyItems.Equinium}, {it: AlchemyItems.Homos}, {it: AlchemyItems.Canis}];
AlchemyItems.Testos.PushEffect(TF.ItemEffects.IncTone, {odds: 0.3, ideal: .7, max: .1});
AlchemyItems.Testos.PushEffect(TF.ItemEffects.DecFem, {odds: 0.4, ideal: -1, max: .1});
AlchemyItems.Testos.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.7, ideal: 0, max: 6 });
AlchemyItems.Testos.PushEffect(function(target : Entity) {
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
AlchemyItems.Testos.PushEffect(function(target : Entity) {
	var parse : any = {
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
		
		if(!vag.womb.pregnant) {
			vag.capacity.DecreaseStat(1, 1);
			
			if(vag.capacity.Get() <= 2)
			{
				vags.splice(randVag, 1);
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
	}
	if(Math.random() < 0.75) {
		var len = false, thk = false;
		for(var i = 0; i < cocks.length; i++) {
			// Base size
			len = len || (cocks[i].length.IncreaseStat(35, 1) > 0);
			thk = thk || (cocks[i].thickness.IncreaseStat(10, .5) > 0);
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

AlchemyItems.Estros = new TFItem("sex3", "Estros");
AlchemyItems.Estros.price = 100;
AlchemyItems.Estros.lDesc = function() { return "a bottle of Estros"; }
AlchemyItems.Estros.Short = function() { return "A bottle of Estros"; }
AlchemyItems.Estros.Long = function() { return "A bottle of pure femininity labled Estros."; }
AlchemyItems.Estros.recipe = [{it: AlchemyItems.Vulpinix}, {it: AlchemyItems.Homos}, {it: AlchemyItems.Bovia}];
AlchemyItems.Estros.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1});
AlchemyItems.Estros.PushEffect(TF.ItemEffects.IncFem, {odds: 0.8, ideal: 1, max: .1});
AlchemyItems.Estros.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 0.4, ideal: 20, max: 3 });
AlchemyItems.Estros.PushEffect(function(target : Entity) {
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
AlchemyItems.Estros.PushEffect(function(target : Entity) {
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
			cocks.splice(randCock, 1);
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
			growth = growth || (vags[i].capacity.IncreaseStat(10, .5) > 0);
		}
		if(growth) {
			parse = Text.ParserPlural(parse, target.NumVags() > 1);
			Text.Add("[Poss] cunt[s] shudder[notS], growing looser.", parse);
			Text.Flush();
		}
	}
});


AlchemyItems.Infertilium = new TFItem("sex4", "Infertilium");
AlchemyItems.Infertilium.isTF = false;
AlchemyItems.Infertilium.price = 15;
AlchemyItems.Infertilium.lDesc = function() { return "a bottle of Infertilium"; }
AlchemyItems.Infertilium.Short = function() { return "A bottle of Infertilium"; }
AlchemyItems.Infertilium.Long = function() { return "A small, unmarked glass vial that feels cool to the touch. Drinking this will render the drinker practically sterile for one day."; }
//TODO AlchemyItems.Infertilium.recipe = [{it: AlchemyItems.Felinix}, {it: AlchemyItems.Leporine}, {it: AlchemyItems.Bovia}];
AlchemyItems.Infertilium.useStr = function(target : Entity) {
	var parse = {
		Name: target.NameDesc(),
		name: target.nameDesc()
	};
	parse = target.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, target.plural());
	
	Text.Add("[Name] uncork[notS] the vial and drink[notS] down the liquid within. It’s surprisingly clear and refreshing, and goes down without a hitch. ", parse);
	if(target.FirstCock() || target.FirstVag()) {
		Text.Add("Quickly, [name] feel[notS] [hisher] loins cooling down. Seems like [heshe] ", parse);
		var preg = target.PregHandler().IsPregnant();
		if(target.FirstVag() || target.PregHandler().MPregEnabled()) {
			if(preg)
				Text.Add("is a little too late, though - since [heshe] [isAre] already pregnant, the potion has no effect on [hisher] womb.", parse);
			else
				Text.Add("won’t be getting knocked up while the potion is in effect.", parse);
			
			if(target.FirstCock()) {
				if(preg)
					Text.Add(" At least, though, [heshe] ", parse);
				else
					Text.Add(" Furthermore, [heshe] ", parse);
			}
		}
		if(target.FirstCock())
			Text.Add("will be firing blanks for a little bit, until the potion’s worn off.", parse);
	}
	else {
		Text.Add("However, there appears to be no effect whatsoever, mostly because of the fact that there’s nothing for the potion to act upon. Guess that wasn’t such a good idea.", parse);
	}
	Text.NL();
	Text.Flush();
	
	target.AddLustFraction(-0.5);
	
	Status.Limp(target, {hours: 24, fer: 0.05});
};
// Effects
AlchemyItems.Infertilium.PushEffect(TF.ItemEffects.DecLib, {odds: 0.2, ideal: 15, max: 1});


AlchemyItems.InfertiliumPlus = new TFItem("sex5", "Infertilium+");
AlchemyItems.InfertiliumPlus.isTF = false;
AlchemyItems.InfertiliumPlus.price = 25;
AlchemyItems.InfertiliumPlus.lDesc = function() { return "a bottle of Infertilium+"; }
AlchemyItems.InfertiliumPlus.Short = function() { return "A bottle of Infertilium+"; }
AlchemyItems.InfertiliumPlus.Long = function() { return "A small, unmarked glass vial with a thin sheen of frost clinging to its sides. Drinking this will render the drinker practically sterile for five days."; }
//TODO AlchemyItems.InfertiliumPlus.recipe = [{it: AlchemyItems.Felinix}, {it: AlchemyItems.Leporine}, {it: AlchemyItems.Bovia}];
AlchemyItems.InfertiliumPlus.useStr = function(target : Entity) {
	var parse = {
		Name: target.NameDesc(),
		name: target.nameDesc()
	};
	parse = target.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, target.plural());
	
	Text.Add("[Name] uncork[notS] the vial and drink[notS] down the liquid within. It’s so cold that it numbs the tongue and throat as it goes down, but [name] manage[notS] to swallow it all, albeit with a little difficulty. ", parse);
	if(target.FirstCock() || target.FirstVag()) {
		Text.Add("Quickly, [name] feel[notS] [hisher] loins cooling down, lustful thoughts rapidly leaving [himher]. Seems like [heshe] ", parse);
		var preg = target.PregHandler().IsPregnant();
		if(target.FirstVag() || target.PregHandler().MPregEnabled()) {
			if(preg)
				Text.Add("is a little too late, though - since [heshe] [isAre] already pregnant, the potion has no effect on [hisher] womb, however strong it might be.", parse);
			else
				Text.Add("won’t be getting knocked up for a good long time now. Practically frigid, as the name suggests.", parse);
			
			if(target.FirstCock()) {
				if(preg)
					Text.Add(" At least, though, [heshe] ", parse);
				else
					Text.Add(" Furthermore, [heshe] ", parse);
			}
		}
		if(target.FirstCock())
			Text.Add("will be firing blanks for quite a while until the potion’s effects finally fade.", parse);
	}
	else {
		Text.Add("However, there appears to be no effect whatsoever, mostly because of the fact that there’s nothing for the potion to act upon. Ugh, what a waste.", parse);
	}
	Text.NL();
	Text.Add("Nevertheless, the potion’s effects won’t last forever, so [name] would probably do well to keep an eye on [himher]self if [heshe] want[notS] to avoid sowing or growing any bastards by accident.", parse);
	Text.NL();
	Text.Flush();
	
	target.AddLustFraction(-1);
	
	Status.Limp(target, {hours: 24*5, fer: 0.01});
};
// Effects
AlchemyItems.InfertiliumPlus.PushEffect(TF.ItemEffects.DecLib, {odds: 0.75, ideal: 15, max: 2});


AlchemyItems.Fertilium = new Item("sex6", "Fertilium", ItemType.Potion);
AlchemyItems.Fertilium.commonUse = function(target : Entity) {
	var parse : any = {
		name: target.nameDesc(),
		lowerArmor: target.LowerArmorDesc()
	};
	parse = target.ParserPronouns(parse);
	parse = target.ParserTags(parse);
	parse = Text.ParserPlural(parse, target.NumCocks() > 1);
	
	var ret = true; // Set to false if the pot is refused
	
	if(target == GAME().player) {
		var gen = "";
		if(target.FirstCock()) gen += "[cocks]";
		if(target.FirstCock() && target.FirstVag()) gen += " and ";
		if(target.FirstVag()) gen += "[vag]";
		parse["gen"] = Text.Parse(gen, parse);
		Text.Add("You open the vial of Fertilium, and immediately your nostrils are assaulted by the potion’s sickly sweet scent. Slowly, you take an experimental sip, reeling at the potion’s equally cloying taste. Better get this done with quickly. You upend the vial and gulp down the liquid in one big chug, coughing at the aftertaste as you dispose of the vial. It takes a few moments, but surely enough you feel a deep warmth flow throughout your body, focusing on your [gen].", parse);
		if(target.FirstCock()) {
			Text.NL();
			Text.Add("Your [lowerArmor] suddenly feels very tight as your [cocks] grow erect, wetness gathering on [itsTheir] tip[s] as you begin leaking pre. Hmm, you could certainly use a warm wet hole to plug right about now…", parse);
		}
		if(target.FirstVag()) {
			Text.NL();
			Text.Add("A sudden, unbearable ache causes your [vag] to immediately moisten up, trickling your arousal into your [lowerArmor]. Your mind is suddenly filled with thoughts about being pregnant. You need a stud to fuck you and fill you with thick, heavy baby batter to make this bothersome itch go away!", parse);
		}
	}
	/* TODO followers
	else if(target == X) {
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
	}
	*/
	else { // Default
		Text.Add("As [name] opens the vial of Fertilium, you can immediately smell the sweet scent emanating for the liquid within. [HeShe] tips the vial, downing the liquid in a single chug. Moments later, you see [name] shudder as [hisher] face becomes flushed with arousal.", parse);
		if(target.FirstCock())
			Text.Add(" Looking down between [hisher] legs you see a bulge forming, followed by wetness where the tip[s] of [hisher] [cocks] [isAre] straining against [hisher] garments.", parse);
		if(target.FirstVag())
			Text.Add(" The scent of female in heat assaults your nostrils, and your eyes immediately turn to [name]. From the way [heshe]’s shuffling and rubbing [hisher] thighs together, you’d guess this potion just made [himher] go into heat.", parse);
	}
	
	Text.NL();
	Text.Flush();
	
	return ret;
}
AlchemyItems.Fertilium.price = 15;
AlchemyItems.Fertilium.lDesc = function() { return "a bottle of Fertilium"; }
AlchemyItems.Fertilium.Short = function() { return "A bottle of Fertilium"; }
AlchemyItems.Fertilium.Long = function() { return "A vial containing a sweet-smelling pink liquid. On the label there’s the picture of a man having sex with a woman, pouring her swelling belly full of virile seed. Its purpose seems to be to enhance potency."; }
//TODO AlchemyItems.Fertilium.recipe = [{it: AlchemyItems.Felinix}, {it: AlchemyItems.Leporine}, {it: AlchemyItems.Bovia}];
AlchemyItems.Fertilium.Use = function(target : Entity) {
	if(AlchemyItems.Fertilium.commonUse(target)) {
		target.AddLustFraction(0.5);

		Status.Aroused(target, {hours: 24, fer: 2});
		
		TF.ItemEffects.IncLib(target, {odds: 0.3, ideal: 40, max: 1});
		
		return {consume: true};
	}
	else
		return {consume: false};
};


AlchemyItems.FertiliumPlus = new Item("sex7", "Fertilium+", ItemType.Potion);
AlchemyItems.FertiliumPlus.price = 25;
AlchemyItems.FertiliumPlus.lDesc = function() { return "a bottle of Fertilium+"; }
AlchemyItems.FertiliumPlus.Short = function() { return "A bottle of Fertilium+"; }
AlchemyItems.FertiliumPlus.Long = function() { return "A vial containing a cloyingly sweet-smelling pink liquid. On the label there’s the picture of a man having sex with a woman, pouring her obscenely swollen belly full of virile seed. Its purpose seems to be to greatly enhance potency."; }
//TODO AlchemyItems.FertiliumPlus.recipe = [{it: AlchemyItems.Felinix}, {it: AlchemyItems.Leporine}, {it: AlchemyItems.Bovia}];
AlchemyItems.FertiliumPlus.Use = function(target : Entity) {
	if(AlchemyItems.Fertilium.commonUse(target)) {
		target.AddLustFraction(1);

		Status.Aroused(target, {hours: 5*24, fer: 3});
		
		TF.ItemEffects.IncLib(target, {odds: 0.5, ideal: 45, max: 2});
		
		return {consume: true};
	}
	else
		return {consume: false};
};

export { AlchemyItems };
