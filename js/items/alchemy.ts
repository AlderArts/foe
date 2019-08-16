import * as _ from "lodash";

import { HipSize } from "../body/body";
import { Cock } from "../body/cock";
import { Color } from "../body/color";
import { Genitalia } from "../body/genitalia";
import { Race } from "../body/race";
import { Vagina } from "../body/vagina";
import { EncounterTable } from "../encountertable";
import { Entity } from "../entity";
import { GAME } from "../GAME";
import { PregnancyLevel, Womb } from "../pregnancy";
import { Status } from "../statuseffect";
import { Text } from "../text";
import { TF, TFItem } from "../tf";
import { IngredientItems } from "./ingredients";

const equinium = new TFItem("equin0", "Equinium");
equinium.price = 7;
equinium.lDesc = () => "a bottle of Equinium";
equinium.Short = () => "A bottle of Equinium";
equinium.Long = () => "A bottle labeled Equinium, with the picture of a horse on it, containing a thick, heady liquid.";
equinium.recipe = [{it: IngredientItems.HorseShoe}, {it: IngredientItems.HorseHair}, {it: IngredientItems.HorseCum}];
// Effects
equinium.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Horse, str: "a horsecock"});
equinium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Horse, str: "equine ears"});
equinium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Horse, color: Color.brown, str: "a brown, bushy horse tail"});
equinium.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
equinium.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Sheath});
equinium.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.5, ideal: 30, max: 1});
equinium.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.5, ideal: 6, max: 1});
equinium.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 30, max: 1});
equinium.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
equinium.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 8, max: 1});
equinium.PushEffect(TF.ItemEffects.DecDex, {odds: 0.2, ideal: 8, max: 1});
equinium.PushEffect(TF.ItemEffects.DecFem, {odds: 0.2, ideal: -.8, max: .1, male: true});
equinium.PushEffect(TF.ItemEffects.IncTone, {odds: 0.2, ideal: .9, max: .1 });
equinium.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});

const leporine = new TFItem("lago0", "Leporine");
leporine.price = 7;
leporine.lDesc = () => "a bottle of Leporine";
leporine.Short = () => "A bottle of Leporine";
leporine.Long = () => "A bottle labeled Leporine, with the picture of a rabbit on it. The fluid within is clear.";
leporine.recipe = [{it: IngredientItems.RabbitFoot}, {it: IngredientItems.CarrotJuice}, {it: IngredientItems.Lettuce}];
// Effects
leporine.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Rabbit, str: "a bunnycock"});
leporine.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Rabbit, str: "floppy bunny ears"});
leporine.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Rabbit, color: Color.white, str: "a white, fluffy bunny tail"});
leporine.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.5, ideal: 15, max: 1});
leporine.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.5, ideal: 3, max: 1});
leporine.PushEffect(TF.ItemEffects.IncLib, {odds: 0.4, ideal: 30, max: 1});
leporine.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
leporine.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: .5, max: .1});
leporine.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
leporine.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Thin, max: 1});
leporine.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 6, max: 2 });

const felinix = new TFItem("felin0", "Felinix");
felinix.price = 7;
felinix.lDesc = () => "a bottle of Felinix";
felinix.Short = () => "A bottle of Felinix";
felinix.Long = () => "A bottle labeled Felinix, with the picture of a cat on it. The fluid within is cloudy.";
felinix.recipe = [{it: IngredientItems.Whiskers}, {it: IngredientItems.HairBall}, {it: IngredientItems.CatClaw}];
// Effects
felinix.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Feline, str: "rough, cat-like tongue"});
felinix.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Feline, str: "a feline cock"});
felinix.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Feline, str: "fluffy cat ears"});
felinix.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Feline, color: Color.orange, str: "an orange, flexible feline tail"});
felinix.PushEffect(TF.ItemEffects.IncDex, {odds: 0.6, ideal: 35, max: 1});
felinix.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 25, max: 1});
felinix.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 16, max: 1});
felinix.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 8, max: 1});
felinix.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
felinix.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0.1, max: .1 });
felinix.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Thin, max: 1});
felinix.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 6, max: 2 });

const lacertium = new TFItem("rept0", "Lacertium");
lacertium.price = 8;
lacertium.lDesc = () => "a bottle of Lacertium";
lacertium.Short = () => "A bottle of Lacertium";
lacertium.Long = () => "A bottle labeled Lacertium, with the picture of a lizard on it. The fluid within is thick and oily.";
lacertium.recipe = [{it: IngredientItems.SnakeOil}, {it: IngredientItems.LizardScale}, {it: IngredientItems.LizardEgg}];
// Effects
lacertium.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Lizard, str: "long, serpentine tongue"});
lacertium.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Lizard, str: "a lizard cock"});
lacertium.PushEffect((target: Entity) => {
	const cocks = target.AllCocks();
	if (cocks.length === 1 && cocks[0].race === Race.Lizard && Math.random() < 0.1) {
		cocks.push(cocks[0].Clone());
		Text.Add("[Poss] reptilian cock splits in two identical dicks!", { Poss: target.Possessive() });
		Text.NL();
		Text.Flush();
	}
});
lacertium.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
lacertium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Lizard, str: "lizard nubs"});
lacertium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Lizard, color: Color.green, str: "a green, flexible reptilian tail"});
lacertium.PushEffect(TF.ItemEffects.SetCover, {odds: 0.2, value: Genitalia.Cover.Slit});
lacertium.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
lacertium.PushEffect(TF.ItemEffects.IncDex, {odds: 0.2, ideal: 25, max: 1});
lacertium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 28, max: 1});
lacertium.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 16, max: 1});
lacertium.PushEffect(TF.ItemEffects.DecSpi, {odds: 0.1, ideal: 20, max: 1});
lacertium.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
lacertium.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.3, ideal: 20, max: 2 });
lacertium.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.3, ideal: 4, max: 1 });

const ovis = new TFItem("ovis0", "Ovis");
ovis.price = 8;
ovis.lDesc = () => "a bottle of Ovis";
ovis.Short = () => "A bottle of Ovis";
ovis.Long = () => "A bottle labeled Ovis, with the picture of a sheep on it. The fluid within is milky white.";
ovis.recipe = [{it: IngredientItems.SheepMilk}, {it: IngredientItems.Ramshorn}, {it: IngredientItems.FreshGrass}];
// Effects
ovis.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Sheep, str: "sheep ears"});
ovis.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Sheep, color: Color.white, str: "a short ovine tail"});
ovis.PushEffect(TF.ItemEffects.SetCover, {odds: 0.2, value: Genitalia.Cover.NoCover});
ovis.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Sheep, color: Color.black, count: 2, str: "a pair of sheep horns" });
ovis.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
ovis.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 30, max: 1});
ovis.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 15, max: 1});
ovis.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal:  5, max: 1});
ovis.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
ovis.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});
ovis.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 0.4, ideal: 16, max: 2, female: true });

const bovia = new TFItem("bov0", "Bovia");
bovia.price = 8;
bovia.lDesc = () => "a bottle of Bovia";
bovia.Short = () => "A bottle of Bovia";
bovia.Long = () => "A bottle labeled Bovia, with the picture of a cow on it. The fluid within is milky white.";
bovia.recipe = [{it: IngredientItems.CowMilk}, {it: IngredientItems.CowBell}, {it: IngredientItems.FreshGrass}];
// Effects
bovia.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Cow, str: "broad, cow-like tongue"});
bovia.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Cow, str: "a bovine cock"});
bovia.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Cow, str: "bovine ears"});
bovia.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Cow, color: Color.black, str: "a long bovine tail, ending in a tuft of black hair"});
bovia.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Cow, color: Color.black, str: "a pair of strong bovine horns!", count: 2});
bovia.PushEffect((target: Entity) => {
	const parse: any = { Poss: target.Possessive() };
	const breasts = target.BiggestBreasts();
	if (target.FirstVag() || (breasts && breasts.size.Get() > 5)) {
		if (Math.random() < 0.5) {
			const diff = target.lactHandler.lactationRate.IdealStat(10, 1);
			if (diff) {
				Text.Add("[Poss] breasts start to lactate more than before.", parse);
				Text.NL();
			}
		}

		if (Math.random() < 0.5) {
			const diff = target.lactHandler.milkProduction.IncreaseStat(5, 1);
			if (diff) {
				Text.Add("[Poss] breasts swell, as they become able to produce milk at a quicker rate.", parse);
				Text.NL();
			}
		}
	}
	Text.Flush();
});
bovia.PushEffect(TF.ItemEffects.IncStr, {odds: 0.5, ideal: 35, max: 1});
bovia.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
bovia.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 20, max: 1});
bovia.PushEffect(TF.ItemEffects.IncLib, {odds: 0.3, ideal: 25, max: 1});
bovia.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 10, max: 1});
bovia.PushEffect(TF.ItemEffects.DecDex, {odds: 0.1, ideal: 15, max: 1});
bovia.PushEffect(TF.ItemEffects.IncFem, {odds: 0.3, ideal: 1, max: .1});
bovia.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.1, rangeMax: 0.3, max: .1 });
bovia.PushEffect(TF.ItemEffects.IncHips, {odds: 0.3, ideal: HipSize.VeryWide, max: 2});
bovia.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 1, ideal: 40, max: 5, female: true });

const caprinium = new TFItem("goat0", "Caprinium");
caprinium.price = 8;
caprinium.lDesc = () => "a bottle of Caprinium";
caprinium.Short = () => "A bottle of Caprinium";
caprinium.Long = () => "A bottle filled with a thick white fluid. It has a picture of a goat on it.";
caprinium.recipe = [{it: IngredientItems.GoatMilk}, {it: IngredientItems.FreshGrass}, {it: IngredientItems.GoatFleece}];
// Effects
caprinium.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Goat, str: "caprine ears"});
caprinium.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Goat, color: Color.gray, str: "a short caprine tail"});
caprinium.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Goat, color: Color.black, str: "a pair of curved goat horns!", count: 2});
caprinium.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Goat, str: "fleece-covered caprine legs, with hooves"});
caprinium.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
caprinium.PushEffect(TF.ItemEffects.IncSta, {odds: 0.3, ideal: 25, max: 1});
caprinium.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 35, max: 1});
caprinium.PushEffect(TF.ItemEffects.DecCha, {odds: 0.1, ideal: 15, max: 1});
caprinium.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
caprinium.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: .5, max: .1});
caprinium.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.3, rangeMax: 0.7, max: .1 });
caprinium.PushEffect(TF.ItemEffects.DecBreastSize, {odds: .6, ideal: 2, max: 3 });

const canis = new TFItem("dog0", "Canis");
canis.price = 8;
canis.lDesc = () => "a bottle of Canis";
canis.Short = () => "A bottle of Canis";
canis.Long = () => "A bottle labeled Canis, with the picture of a dog on it. The fluid within is opaque, and slightly reddish.";
canis.recipe = [{it: IngredientItems.CanisRoot}, {it: IngredientItems.DogBone}, {it: IngredientItems.DogBiscuit}];
// Effects
canis.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Dog, str: "dog-like tongue"});
canis.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Dog, str: "a canid cock"});
canis.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
canis.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Sheath});
canis.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
canis.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
canis.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Dog, str: "canid ears"});
canis.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Dog, color: Color.brown, str: "a brown, fluffy dog tail!"});
canis.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
canis.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
canis.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 25, max: 1});
canis.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 10, max: 1});
canis.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.2, rangeMax: 0.5, max: .1 });
canis.PushEffect(TF.ItemEffects.IncCockLen, {odds: 0.4, ideal: 20, max: 2 });
canis.PushEffect(TF.ItemEffects.IncCockThk, {odds: 0.4, ideal: 5, max: 1 });

const lobos = new TFItem("wolf0", "Lobos");
lobos.price = 8;
lobos.lDesc = () => "a bottle of Lobos";
lobos.Short = () => "A bottle of Lobos";
lobos.Long = () => "A bottle labeled Lobos with the picture of a wolf on it. The fluid within is opaque, and dullish gray.";
lobos.recipe = [{it: IngredientItems.CanisRoot}, {it: IngredientItems.WolfFang}, {it: IngredientItems.Wolfsbane}];
// Effects
lobos.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Wolf, str: "a wolf cock"});
lobos.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
lobos.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Sheath});
lobos.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
lobos.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
lobos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Wolf, str: "wolf ears"});
lobos.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Wolf, color: Color.gray, str: "a gray, fluffy wolf tail!"});
lobos.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 30, max: 1});
lobos.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 30, max: 1});
lobos.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
lobos.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
lobos.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
lobos.PushEffect(TF.ItemEffects.DecCha, {odds: 0.1, ideal: 10, max: 1});
lobos.PushEffect(TF.ItemEffects.DecFem, {odds: 0.1, ideal: -.7, max: .1, male: true});
lobos.PushEffect(TF.ItemEffects.IncTone, {odds: 0.1, ideal: .8, max: .1 });
lobos.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});
lobos.PushEffect(TF.ItemEffects.IncCockLen, {odds: 0.4, ideal: 24, max: 2 });
lobos.PushEffect(TF.ItemEffects.IncCockThk, {odds: 0.4, ideal: 6, max: 1 });

const vulpinix = new TFItem("fox0", "Vulpinix");
vulpinix.price = 8;
vulpinix.lDesc = () => "a bottle of Vulpinix";
vulpinix.Short = () => "A bottle of Vulpinix";
vulpinix.Long = () => "A bottle labeled Vulpinix, with the picture of a fox on it. The fluid within is opaque, and bright red.";
vulpinix.recipe = [{it: IngredientItems.CanisRoot}, {it: IngredientItems.FoxBerries}, {it: IngredientItems.Foxglove}];
// Effects
vulpinix.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Fox, str: "a vulpine cock"});
vulpinix.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: true, num: 1});
vulpinix.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Sheath});
vulpinix.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
vulpinix.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.2, count: 2});
vulpinix.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Fox, str: "vulpine ears"});
vulpinix.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Fox, color: Color.red, str: "a red, fluffy fox tail!"});
vulpinix.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 25, max: 1});
vulpinix.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
vulpinix.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
vulpinix.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 10, max: 1});
vulpinix.PushEffect(TF.ItemEffects.DecSpi, {odds: 0.1, ideal: 15, max: 1});
vulpinix.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.1, rangeMax: 0.4, max: .1 });
vulpinix.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Thin, max: 2});
vulpinix.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 6, max: 2 });
vulpinix.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.3, ideal: 19, max: 2 });
vulpinix.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.3, ideal: 4, max: 1 });

const infernum = new TFItem("demon0", "Infernum");
infernum.price = 15;
infernum.lDesc = () => "a bottle of Infernum";
infernum.Short = () => "A bottle of Infernum";
infernum.Long = () => "A bottle labeled Infernum, with the picture of a demon on it. The fluid within is a thick red sludge, tainted with black bubbles.";
infernum.recipe = [{it: IngredientItems.CorruptPlant}, {it: IngredientItems.BlackGem}, {it: IngredientItems.CorruptSeed}];
// Effects
infernum.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Demon, str: "long and flexible tongue"});
infernum.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.2, race: Race.Demon, color: Color.red, str: "plantigrade, demonic legs with clawed feet"});
infernum.PushEffect(TF.ItemEffects.SetArms, {odds: 0.2, race: Race.Demon, color: Color.red, str: "demonic arms with clawed hands"});
infernum.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Demon, str: "a demon cock"});
infernum.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Demon, color: Color.red, str: "a red, spaded demon tail"});
infernum.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Demon, color: Color.red, count: 2, str: "a pair of demon horns" });
infernum.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 25, max: 1});
infernum.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 25, max: 1});
infernum.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
infernum.PushEffect(TF.ItemEffects.IncLib, {odds: 0.4, ideal: 35, max: 1});
infernum.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: .8, max: .1, female: true});
infernum.PushEffect(TF.ItemEffects.DecFem, {odds: 0.1, ideal: -.8, max: .1, male: true});

const avia = new TFItem("avian0", "Avia");
avia.price = 25;
avia.lDesc = () => "a bottle of Avia";
avia.Short = () => "A bottle of Avia";
avia.Long = () => "A bottle labeled Avia, with the picture of a bird on it. The fluid within is a clear, bright blue.";
avia.recipe = [{it: IngredientItems.Feather}, {it: IngredientItems.Trinket}, {it: IngredientItems.FruitSeed}];
// Effects
avia.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Avian, str: "an avian cock"});
avia.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
avia.PushEffect(TF.ItemEffects.RemTail, {odds: 0.2, count: 1});
avia.PushEffect(TF.ItemEffects.SetCover, {odds: 0.2, value: Genitalia.Cover.NoCover});
avia.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.2, value: false, num: 1});
avia.PushEffect(TF.ItemEffects.SetWings, {odds: 0.4, race: Race.Avian, color: Color.brown, count: 2, str: "a pair of avian wings" });
avia.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.2, rangeMin: -.2, rangeMax: .2, max: .1});
avia.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
avia.PushEffect(TF.ItemEffects.DecSta, {odds: 0.1, ideal: 15, max: 1});
avia.PushEffect(TF.ItemEffects.DecCha, {odds: 0.1, ideal: 15, max: 1});
avia.PushEffect(TF.ItemEffects.IncDex, {odds: 0.3, ideal: 35, max: 1});
avia.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 40, max: 1});
avia.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.2, ideal: 30, max: 1});
avia.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.4, ideal: 2, max: 2 });

const lepida = new TFItem("moth0", "Lepida");
lepida.price = 10;
lepida.lDesc = () => "a bottle of Lepida";
lepida.Short = () => "A bottle of Lepida";
lepida.Long = () => "A bottle labeled Lepida, with the picture of a moth on it. The fluid within is a deep purple.";
lepida.recipe = [{it: IngredientItems.MFluff}, {it: IngredientItems.MDust}, {it: IngredientItems.FruitSeed}];
// Effects
lepida.PushEffect(TF.ItemEffects.SetAntenna, {odds: 0.4, race: Race.Moth, color: Color.purple, count: 2, str: "a pair of moth-like feelers" });
lepida.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Moth, str: "long and flexible tongue"});
lepida.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.2, count: 2});
lepida.PushEffect(TF.ItemEffects.SetCover, {odds: 0.1, value: Genitalia.Cover.NoCover});
lepida.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
lepida.PushEffect(TF.ItemEffects.SetWings, {odds: 0.4, race: Race.Moth, color: Color.purple, count: 2, str: "a pair of insect wings" });
lepida.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 35, max: 1});
lepida.PushEffect(TF.ItemEffects.IncSta, {odds: 0.3, ideal: 25, max: 1});
lepida.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 30, max: 1});
lepida.PushEffect(TF.ItemEffects.DecDex, {odds: 0.1, ideal: 15, max: 1});
lepida.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
lepida.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: .8, max: .1});
lepida.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
lepida.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});
lepida.PushEffect(TF.ItemEffects.DecCockLen, {odds: 0.3, ideal: 15, max: 2 });
lepida.PushEffect(TF.ItemEffects.DecCockThk, {odds: 0.3, ideal: 3, max: 1 });

const scorpius = new TFItem("scorp0", "Scorpius");
scorpius.price = 10;
scorpius.lDesc = () => "a bottle of Scorpius";
scorpius.Short = () => "A bottle of Scorpius";
scorpius.Long = () => "A bottle labeled Scorpius, with the picture of a scorpion on it. The fluid within is a pitch black.";
scorpius.recipe = [{it: IngredientItems.Stinger}, {it: IngredientItems.SVenom}, {it: IngredientItems.SClaw}];
// Effects
scorpius.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Scorpion, color: Color.black, str: "a black, segmented scorpion tail"});
scorpius.PushEffect(TF.ItemEffects.SetCover, {odds: 0.1, value: Genitalia.Cover.NoCover});
scorpius.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
scorpius.PushEffect(TF.ItemEffects.RemWings, {odds: 0.6, count: 2});
scorpius.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
scorpius.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 30, max: 1});
scorpius.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 20, max: 1});
scorpius.PushEffect(TF.ItemEffects.DecLib, {odds: 0.1, ideal: 15, max: 1});
scorpius.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: .7, max: .1});
scorpius.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0.1, rangeMax: 0.3, max: .1 });
scorpius.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});

const cerventine = new TFItem("deer0", "Cerventine");
cerventine.price = 10;
cerventine.lDesc = () => "a bottle of Cerventine";
cerventine.Short = () => "A bottle of Cerventine";
cerventine.Long = () => "A bottle filled with a soft brown liquid. It has a picture of a deer on it.";
cerventine.recipe = [{it: IngredientItems.FreshGrass}, {it: IngredientItems.TreeBark}, {it: IngredientItems.AntlerChip}];
// Effects
cerventine.PushEffect(TF.ItemEffects.SetCover, {odds: 0.1, value: Genitalia.Cover.Sheath});
cerventine.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.1, value: false, num: 1});
cerventine.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Deer, str: "a cervine cock"});
cerventine.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Deer, str: "cervine ears"});
cerventine.PushEffect(TF.ItemEffects.SetTail, {odds: 0.4, race: Race.Deer, color: Color.brown, str: "a short cervine tail"});
cerventine.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.4, race: Race.Deer, color: Color.brown, str: "a pair of deer antlers!", count: 2});
cerventine.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Deer, str: "smooth cervine legs, with cloven hooves"});
cerventine.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 1});
cerventine.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 30, max: 1});
cerventine.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.3, ideal: 25, max: 1});
cerventine.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 15, max: 1});
cerventine.PushEffect(TF.ItemEffects.DecSta, {odds: 0.1, ideal: 20, max: 1});
cerventine.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: .5, max: .1});
cerventine.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0, rangeMax: 0.2, max: .1 });
cerventine.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});
cerventine.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.2, ideal: 17, max: 1});
cerventine.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.2, ideal: 4, max: 1});

const honeyBrew = new TFItem("bee0", "Honey brew");
honeyBrew.price = 10;
honeyBrew.lDesc = () => "a jar of Honey brew";
honeyBrew.Short = () => "A jar of Honey brew";
honeyBrew.Long = () => "A jar filled with liquid honey, incredibly sweet and potent.";
honeyBrew.recipe = [{it: IngredientItems.RawHoney}, {it: IngredientItems.FlowerPetal}, {it: IngredientItems.BeeChitin}];
// Effects
honeyBrew.PushEffect(TF.ItemEffects.SetAntenna, {odds: 0.4, race: Race.Bee, color: Color.black, count: 2, str: "a pair of bee antenna" });
honeyBrew.PushEffect(TF.ItemEffects.SetWings, {odds: 0.4, race: Race.Bee, color: Color.white, count: 2, str: "a pair of bee wings" });
honeyBrew.PushEffect(TF.ItemEffects.SetAbdomen, {odds: 0.4, race: Race.Bee, color: Color.yellow, count: 1, str: "a striped bee abdomen" });
honeyBrew.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
honeyBrew.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 25, max: 1});
honeyBrew.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 40, max: 1});
honeyBrew.PushEffect(TF.ItemEffects.DecStr, {odds: 0.1, ideal: 20, max: 1});
honeyBrew.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 15, max: 1});
honeyBrew.PushEffect(TF.ItemEffects.IncFem, {odds: 0.4, ideal: .9, max: .1});
honeyBrew.PushEffect(TF.ItemEffects.IdealTone, {odds: 0.2, rangeMin: 0, rangeMax: 0.2, max: .1 });
honeyBrew.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});

const florium = new TFItem("plant0", "Florium");
florium.price = 10;
florium.lDesc = () => "a bottle of Florium";
florium.Short = () => "A bottle of Florium";
florium.Long = () => "A bottle filled with a green fluid. It smells of flowers.";
florium.recipe = [{it: IngredientItems.Foxglove}, {it: IngredientItems.FlowerPetal}, {it: IngredientItems.TreeBark}];
// Effects
florium.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Plant, str: "a veiny tentacle cock"});
florium.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Plant, str: "long, vine-like tentacle tongue"});
florium.PushEffect(TF.ItemEffects.IncInt, {odds: 0.3, ideal: 25, max: 1});
florium.PushEffect(TF.ItemEffects.IncLib, {odds: 0.4, ideal: 40, max: 1});
florium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 30, max: 1});
florium.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.2, ideal: 25, max: 1});
florium.PushEffect(TF.ItemEffects.DecStr, {odds: 0.1, ideal: 15, max: 1});
florium.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 15, max: 1});
florium.PushEffect(TF.ItemEffects.DecDex, {odds: 0.2, ideal: 20, max: 1});
florium.PushEffect(TF.ItemEffects.IncFem, {odds: 0.4, ideal: .9, max: .1});
florium.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1 });
florium.PushEffect(TF.ItemEffects.IncHips, {odds: 0.2, ideal: HipSize.Wide, max: 1});
florium.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 0.2, ideal: 20, max: 2, female: true});
/*
 * TODO

Effects:
Plant hair?
Green eyes

 */

const homos = new TFItem("human0", "Homos");
homos.price = 25;
homos.lDesc = () => "a bottle of Homos";
homos.Short = () => "A bottle of Homos";
homos.Long = () => "A bottle labeled Homos, with the picture of a regular human on it. The fluid within is clear and colorless, like water.";
homos.recipe = [{it: IngredientItems.Hummus}, {it: IngredientItems.SpringWater}, {it: IngredientItems.Letter}];
// Effects
homos.PushEffect(TF.ItemEffects.SetBody, {odds: 0.4, race: Race.Human, str: "human body"});
homos.PushEffect(TF.ItemEffects.SetFace, {odds: 0.3, race: Race.Human, str: "human face"});
homos.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.3, race: Race.Human, str: "human tongue"});
homos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Human, str: "human ears"});
homos.PushEffect(TF.ItemEffects.SetArms, {odds: 0.3, race: Race.Human, str: "human arms"});
homos.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Human, str: "human legs"});
homos.PushEffect(TF.ItemEffects.SetCock, {odds: 0.4, race: Race.Human, str: "a human cock"});
homos.PushEffect(TF.ItemEffects.RemHorn, {odds: 0.6, count: 2});
homos.PushEffect(TF.ItemEffects.SetEars, {odds: 0.6, race: Race.Human, str: "human ears"});
homos.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.NoCover});
homos.PushEffect(TF.ItemEffects.SetKnot, {odds: 0.4, value: false, num: 1});
homos.PushEffect(TF.ItemEffects.RemTail, {odds: 0.6, count: 1});
homos.PushEffect(TF.ItemEffects.RemWings, {odds: 0.6, count: 2});
homos.PushEffect(TF.ItemEffects.RemAntenna, {odds: 0.6, count: 2});
homos.PushEffect(TF.ItemEffects.RemAbdomen, {odds: 0.6, count: 1});
homos.PushEffect((target: Entity) => {
	const parse: any = {
		Poss : target.Possessive(),
		legsDesc() { return target.LegsDesc(); },
		notS : target.body.legs.count > 1 ? "s" : "",
		heshe : target.heshe(),
		has : target.has(),
	};

	if (Math.random() < 0.6) {
		if (target.body.legs.count !== 2) {
			target.body.legs.count = 2;
			target.body.legs.race = Race.Human;
			Text.Add("[Poss] [legsDesc] morph[notS] until [heshe] [has] two human legs!", parse);
		}
	}
	Text.Flush();
});
homos.PushEffect(TF.ItemEffects.SetIdealCockLen, {odds: 0.3, ideal: 20, max: 2 });
homos.PushEffect(TF.ItemEffects.SetIdealCockThk, {odds: 0.3, ideal: 4, max: 1 });

const virilium = new TFItem("sex0", "Virilium");
virilium.price = 100;
virilium.lDesc = () => "a bottle of Virilium";
virilium.Short = () => "A bottle of Virilium";
virilium.Long = () => "A bottle of potency-enhancing Virilium.";
virilium.recipe = [{it: equinium}, {it: leporine}, {it: lobos}];
// Effects
virilium.PushEffect(TF.ItemEffects.IncLib, {odds: 0.3, ideal: 40, max: 2});
virilium.PushEffect(TF.ItemEffects.IncCha, {odds: 0.2, ideal: 40, max: 2});
virilium.PushEffect(TF.ItemEffects.SetBalls, {odds: 0.1, ideal: 2, count: 2});
virilium.PushEffect((target: Entity) => {
	const parse: any = {
		name  : target.nameDesc(),
		heshe : target.heshe(),
		is    : target.is(),
	};
	target.AddLustFraction(0.5);
	target.RestoreCum(10);

	Text.Add("A shiver runs through [name] as [heshe] [is] hit by a wave of lust!", parse);
	Text.NL();
});
virilium.PushEffect((target: Entity) => {
	const parse: any = {
		Poss: target.Possessive(),
		ballsDesc() { return target.BallsDesc(); },
		s      : target.HasBalls() ? "s" : "",
		notS   : target.HasBalls() ? "" : "s",
		itThey : target.HasBalls() ? "they" : "it",
	};
	if (target.HasBalls() && Math.random() < 0.4) {
		const res = target.Balls().size.IncreaseStat(14, 1);
		if (res > 0) {
			Text.Add("[Poss] balls have grown in size to [ballsDesc]!", parse);
			Text.NL();
		}
	}
	if ((target.HasBalls() || target.FirstCock()) && Math.random() < 0.4) {
		const res = target.Balls().cumCap.IncreaseStat(30, 1);
		if (res > 0) {
			Text.Add("[Poss] [ballsDesc] churn[notS] as [itThey] adjust[notS] to accomodate more cum.", parse);
			Text.NL();
		}
	}
	if ((target.HasBalls() || target.FirstCock()) && Math.random() < 0.3) {
		const res = target.Balls().cumProduction.IncreaseStat(3, .5, true);
		if (res > 0) {
			Text.Add("[Poss] [ballsDesc] churn[notS] as [itThey] become[s] able to produce more cum!", parse);
			Text.NL();
		}
	}
	// TODO: parse
	if ((target.HasBalls() || target.FirstCock()) && Math.random() < 0.2) {
		const res = target.Balls().fertility.IncreaseStat(.7, .1, true);
	}
	Text.Flush();
});
virilium.PushEffect(TF.ItemEffects.IncTone, {odds: 0.1, ideal: .7, max: .1});
virilium.PushEffect(TF.ItemEffects.DecFem, {odds: 0.1, ideal: -1, max: .1});

const testos = new TFItem("sex2", "Testos");
testos.price = 100;
testos.lDesc = () => "a bottle of Testos";
testos.Short = () => "A bottle of Testos";
testos.Long = () => "A bottle of pure masculinity labled Testos.";
testos.recipe = [{it: equinium}, {it: homos}, {it: canis}];
testos.PushEffect(TF.ItemEffects.IncTone, {odds: 0.3, ideal: .7, max: .1});
testos.PushEffect(TF.ItemEffects.DecFem, {odds: 0.4, ideal: -1, max: .1});
testos.PushEffect(TF.ItemEffects.DecBreastSize, {odds: 0.7, ideal: 0, max: 6 });
testos.PushEffect((target: Entity) => {
	const parse: any = {
		Name: target.NameDesc(),
		Poss: target.Possessive(),
		ballsDesc() { return target.BallsDesc(); },
		s      : target.HasBalls() ? "s" : "",
		notS   : target.HasBalls() ? "" : "s",
		notS2  : target.plural()   ? "" : "s",
		itThey : target.HasBalls() ? "they" : "it",
	};
	if (target.HasBalls() && Math.random() < 0.6) {
		const res = target.Balls().size.IncreaseStat(14, 1);
		if (res > 0) {
			Text.Add("[Poss] balls have grown in size!", parse);
			Text.NL();
		}
	}
	if (!target.HasBalls() && target.FirstCock() && Math.random() < 0.5) {
		target.Balls().count.base = 2;
		target.Balls().size.base  = 3;
		Text.Add("[Name] grow[notS2] a pair of average testicles.", parse);
		Text.NL();
	}
	Text.Flush();
});
testos.PushEffect((target: Entity) => {
	let parse: any = {
		Name : target.NameDesc(),
		poss : target.possessive(),
		Poss : target.Possessive(),
		multiCockDesc() { return target.MultiCockDesc(); },
	};
	parse = target.ParserPronouns(parse);

	const vags  = target.AllVags();
	const cocks = target.AllCocks();
	if (vags.length > 0 && Math.random() < 0.4) {
		const randVag = Math.floor(Math.random() * vags.length);
		const vag = vags[randVag];

		if (!vag.womb.pregnant) {
			vag.capacity.DecreaseStat(1, 1);

			if (vag.capacity.Get() <= 2) {
				vags.splice(randVag, 1);
				// Clear clitcock
				if (vag.clitCock) {
					vag.clitCock.vag = undefined;
				}
				if (vags.length > 0) {
					Text.Add("[Name] loses one of [hisher] cunts!", parse);
				} else {
					Text.Add("[Poss] pussy shrinks until it disappears completely.", parse);
					if (cocks.length === 0) {
						Text.Add(" It's replaced by a brand new cock!");
						cocks.push(new Cock());
					}
				}
			} else {
				if (vags.length > 0) {
					Text.Add("One of [poss] pussies shrinks, becoming tighter.", parse);
				} else {
					Text.Add("[Poss] pussy shrinks, becoming tighter.", parse);
				}
			}
			Text.Flush();
		}
	}
	if (Math.random() < 0.75) {
		let len = false;
		let thk = false;
		for (const cock of cocks) {
			// Base size
			len = len || (cock.length.IncreaseStat(35, 1) > 0);
			thk = thk || (cock.thickness.IncreaseStat(10, .5) > 0);
		}
		if (len || thk) {
			parse.s    = target.NumCocks() > 1 ? "s" : "";
			parse.notS = target.NumCocks() > 1 ? "" : "s";
			Text.NL();
			Text.Add("[Poss] [multiCockDesc] shudder[notS], the stiff dick[s] growing ", parse);
			if (len) {
				Text.Add("longer", parse);
			}
			if (len && thk) {
				Text.Add(" and ", parse);
			}
			if (thk) {
				Text.Add("thicker", parse);
			}
			Text.Add(".", parse);
			Text.Flush();
		}
	}
});

const estros = new TFItem("sex3", "Estros");
estros.price = 100;
estros.lDesc = () => "a bottle of Estros";
estros.Short = () => "A bottle of Estros";
estros.Long = () => "A bottle of pure femininity labled Estros.";
estros.recipe = [{it: vulpinix}, {it: homos}, {it: bovia}];
estros.PushEffect(TF.ItemEffects.DecTone, {odds: 0.2, ideal: 0, max: .1});
estros.PushEffect(TF.ItemEffects.IncFem, {odds: 0.8, ideal: 1, max: .1});
estros.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 0.4, ideal: 20, max: 3 });
estros.PushEffect((target: Entity) => {
	const parse: any = {
		Poss: target.Possessive(),
		notS: target.plural() ? "" : "s",
	};
	if (target.HasBalls() && Math.random() < 0.6) {
		const res = target.Balls().size.DecreaseStat(1, 1);
		if (target.Balls().size.Get() <= 1) {
			target.Balls().count.base = 0;
			Text.Add("[Poss] balls shrivel and disappear completely!", parse);
			Text.NL();
		} else {
			Text.Add("[Poss] balls have shrunk in size!", parse);
			Text.NL();
		}
	}
	Text.Flush();
});
estros.PushEffect((target: Entity) => {
	let parse: any = {
		Name : target.NameDesc(),
		Poss : target.Possessive(),
		multiCockDesc() { return target.MultiCockDesc(); },
	};
	parse = target.ParserPronouns(parse);

	const cocks = target.AllCocks();
	const vags  = target.AllVags();
	if (cocks.length > 0 && Math.random() < 0.4) {
		const randCock = Math.floor(Math.random() * cocks.length);
		const cock = cocks[randCock];

		cock.length.DecreaseStat(5, 1);
		cock.thickness.DecreaseStat(1, .5);

		if (cock.Len() <= 7 || cock.Thickness() <= 2) {
			cocks.splice(randCock, 1);
			// Clear clitcock
			if (cock.vag) {
				cock.vag.clitCock = undefined;
			}
			if (cocks.length > 0) {
				Text.Add("[Name] loses one of [hisher] cocks!", parse);
			} else {
				Text.Add("[Poss] cock shrinks until it disappears completely.", parse);
				if (target.NumVags() === 0) {
					Text.Add(" It's replaced by a brand new pussy!");
					vags.push(new Vagina());
				}
			}
		} else {
			parse = Text.ParserPlural(parse, target.NumCocks() > 1);
			Text.Add("[Poss] [multiCockDesc] shudder[notS],[oneof] the stiff dick[s] shrinking in girth and length.", parse);
		}
		Text.Flush();
	}
	if (Math.random() < 0.75) {
		let growth = false;
		for (const vag of vags) {
			growth = growth || (vag.capacity.IncreaseStat(10, .5) > 0);
		}
		if (growth) {
			parse = Text.ParserPlural(parse, target.NumVags() > 1);
			Text.Add("[Poss] cunt[s] shudder[notS], growing looser.", parse);
			Text.Flush();
		}
	}
});

const infertilium = new TFItem("sex4", "Infertilium");
infertilium.isTF = false;
infertilium.price = 15;
infertilium.lDesc = () => "a bottle of Infertilium";
infertilium.Short = () => "A bottle of Infertilium";
infertilium.Long = () => "A small, unmarked glass vial that feels cool to the touch. Drinking this will render the drinker practically sterile for one day.";
// TODO infertilium.recipe = [{it: felinix}, {it: leporine}, {it: bovia}];
infertilium.useStr = (target: Entity) => {
	let parse: any = {
		Name: target.NameDesc(),
		name: target.nameDesc(),
	};
	parse = target.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, target.plural());

	Text.Add("[Name] uncork[notS] the vial and drink[notS] down the liquid within. It’s surprisingly clear and refreshing, and goes down without a hitch. ", parse);
	if (target.FirstCock() || target.FirstVag()) {
		Text.Add("Quickly, [name] feel[notS] [hisher] loins cooling down. Seems like [heshe] ", parse);
		const preg = target.PregHandler().IsPregnant();
		if (target.FirstVag() || target.PregHandler().MPregEnabled()) {
			if (preg) {
				Text.Add("is a little too late, though - since [heshe] [isAre] already pregnant, the potion has no effect on [hisher] womb.", parse);
			} else {
				Text.Add("won’t be getting knocked up while the potion is in effect.", parse);
			}

			if (target.FirstCock()) {
				if (preg) {
					Text.Add(" At least, though, [heshe] ", parse);
				} else {
					Text.Add(" Furthermore, [heshe] ", parse);
				}
			}
		}
		if (target.FirstCock()) {
			Text.Add("will be firing blanks for a little bit, until the potion’s worn off.", parse);
		}
	} else {
		Text.Add("However, there appears to be no effect whatsoever, mostly because of the fact that there’s nothing for the potion to act upon. Guess that wasn’t such a good idea.", parse);
	}
	Text.NL();
	Text.Flush();

	target.AddLustFraction(-0.5);

	Status.Limp(target, {hours: 24, fer: 0.05});
};
// Effects
infertilium.PushEffect(TF.ItemEffects.DecLib, {odds: 0.2, ideal: 15, max: 1});

const infertiliumPlus = new TFItem("sex5", "Infertilium+");
infertiliumPlus.isTF = false;
infertiliumPlus.price = 25;
infertiliumPlus.lDesc = () => "a bottle of Infertilium+";
infertiliumPlus.Short = () => "A bottle of Infertilium+";
infertiliumPlus.Long = () => "A small, unmarked glass vial with a thin sheen of frost clinging to its sides. Drinking this will render the drinker practically sterile for five days.";
// TODO infertiliumPlus.recipe = [{it: felinix}, {it: leporine}, {it: bovia}];
infertiliumPlus.useStr = (target: Entity) => {
	let parse: any = {
		Name: target.NameDesc(),
		name: target.nameDesc(),
	};
	parse = target.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, target.plural());

	Text.Add("[Name] uncork[notS] the vial and drink[notS] down the liquid within. It’s so cold that it numbs the tongue and throat as it goes down, but [name] manage[notS] to swallow it all, albeit with a little difficulty. ", parse);
	if (target.FirstCock() || target.FirstVag()) {
		Text.Add("Quickly, [name] feel[notS] [hisher] loins cooling down, lustful thoughts rapidly leaving [himher]. Seems like [heshe] ", parse);
		const preg = target.PregHandler().IsPregnant();
		if (target.FirstVag() || target.PregHandler().MPregEnabled()) {
			if (preg) {
				Text.Add("is a little too late, though - since [heshe] [isAre] already pregnant, the potion has no effect on [hisher] womb, however strong it might be.", parse);
			} else {
				Text.Add("won’t be getting knocked up for a good long time now. Practically frigid, as the name suggests.", parse);
			}

			if (target.FirstCock()) {
				if (preg) {
					Text.Add(" At least, though, [heshe] ", parse);
				} else {
					Text.Add(" Furthermore, [heshe] ", parse);
				}
			}
		}
		if (target.FirstCock()) {
			Text.Add("will be firing blanks for quite a while until the potion’s effects finally fade.", parse);
		}
	} else {
		Text.Add("However, there appears to be no effect whatsoever, mostly because of the fact that there’s nothing for the potion to act upon. Ugh, what a waste.", parse);
	}
	Text.NL();
	Text.Add("Nevertheless, the potion’s effects won’t last forever, so [name] would probably do well to keep an eye on [himher]self if [heshe] want[notS] to avoid sowing or growing any bastards by accident.", parse);
	Text.NL();
	Text.Flush();

	target.AddLustFraction(-1);

	Status.Limp(target, {hours: 24 * 5, fer: 0.01});
};
// Effects
infertiliumPlus.PushEffect(TF.ItemEffects.DecLib, {odds: 0.75, ideal: 15, max: 2});

const fertilium = new TFItem("sex6", "Fertilium");
const fertiliumcommonUse = (target: Entity) => {
	let parse: any = {
		name: target.nameDesc(),
		lowerArmor: target.LowerArmorDesc(),
	};
	parse = target.ParserPronouns(parse);
	parse = target.ParserTags(parse);
	parse = Text.ParserPlural(parse, target.NumCocks() > 1);

	const ret = true; // Set to false if the pot is refused

	if (target === GAME().player) {
		let gen = "";
		if (target.FirstCock()) { gen += "[cocks]"; }
		if (target.FirstCock() && target.FirstVag()) { gen += " and "; }
		if (target.FirstVag()) { gen += "[vag]"; }
		parse.gen = Text.Parse(gen, parse);
		Text.Add("You open the vial of Fertilium, and immediately your nostrils are assaulted by the potion’s sickly sweet scent. Slowly, you take an experimental sip, reeling at the potion’s equally cloying taste. Better get this done with quickly. You upend the vial and gulp down the liquid in one big chug, coughing at the aftertaste as you dispose of the vial. It takes a few moments, but surely enough you feel a deep warmth flow throughout your body, focusing on your [gen].", parse);
		if (target.FirstCock()) {
			Text.NL();
			Text.Add("Your [lowerArmor] suddenly feels very tight as your [cocks] grow erect, wetness gathering on [itsTheir] tip[s] as you begin leaking pre. Hmm, you could certainly use a warm wet hole to plug right about now…", parse);
		}
		if (target.FirstVag()) {
			Text.NL();
			Text.Add("A sudden, unbearable ache causes your [vag] to immediately moisten up, trickling your arousal into your [lowerArmor]. Your mind is suddenly filled with thoughts about being pregnant. You need a stud to fuck you and fill you with thick, heavy baby batter to make this bothersome itch go away!", parse);
		}
	} else { // Default
		Text.Add("As [name] opens the vial of Fertilium, you can immediately smell the sweet scent emanating for the liquid within. [HeShe] tips the vial, downing the liquid in a single chug. Moments later, you see [name] shudder as [hisher] face becomes flushed with arousal.", parse);
		if (target.FirstCock()) {
			Text.Add(" Looking down between [hisher] legs you see a bulge forming, followed by wetness where the tip[s] of [hisher] [cocks] [isAre] straining against [hisher] garments.", parse);
		}
		if (target.FirstVag()) {
			Text.Add(" The scent of female in heat assaults your nostrils, and your eyes immediately turn to [name]. From the way [heshe]’s shuffling and rubbing [hisher] thighs together, you’d guess this potion just made [himher] go into heat.", parse);
		}
	}

	Text.NL();
	Text.Flush();

	return ret;
};
fertilium.price = 15;
fertilium.lDesc = () => "a bottle of Fertilium";
fertilium.Short = () => "A bottle of Fertilium";
fertilium.Long = () => "A vial containing a sweet-smelling pink liquid. On the label there’s the picture of a man having sex with a woman, pouring her swelling belly full of virile seed. Its purpose seems to be to enhance potency.";
// TODO fertilium.recipe = [{it: felinix}, {it: leporine}, {it: bovia}];
fertilium.Use = (target: Entity) => {
	if (fertiliumcommonUse(target)) {
		target.AddLustFraction(0.5);

		Status.Aroused(target, {hours: 24, fer: 2});

		TF.ItemEffects.IncLib(target, {odds: 0.3, ideal: 40, max: 1});

		return {consume: true};
	} else {
		return {consume: false};
	}
};

const fertiliumPlus = new TFItem("sex7", "Fertilium+");
fertiliumPlus.price = 25;
fertiliumPlus.lDesc = () => "a bottle of Fertilium+";
fertiliumPlus.Short = () => "A bottle of Fertilium+";
fertiliumPlus.Long = () => "A vial containing a cloyingly sweet-smelling pink liquid. On the label there’s the picture of a man having sex with a woman, pouring her obscenely swollen belly full of virile seed. Its purpose seems to be to greatly enhance potency.";
// TODO fertiliumPlus.recipe = [{it: felinix}, {it: leporine}, {it: bovia}];
fertiliumPlus.Use = (target: Entity) => {
	if (fertiliumcommonUse(target)) {
		target.AddLustFraction(1);

		Status.Aroused(target, {hours: 5 * 24, fer: 3});

		TF.ItemEffects.IncLib(target, {odds: 0.5, ideal: 45, max: 2});

		return {consume: true};
	} else {
		return {consume: false};
	}
};

const gestarium = new TFItem("preg0", "Gestarium");
gestarium.price = 50;
gestarium.lDesc = () => "a bottle of Gestarium";
gestarium.Short = () => "A bottle of Gestarium";
gestarium.Long  = () => "A small vial of thick, clear liquid. Drinking this while pregnant will cause the drinker’s pregnancy to advance somewhat.";
gestarium.recipe = [{it: fertilium}, {it: estros}, {it: bovia}];
// Effects
gestarium.PushEffect((target: Entity) => {
	let parse: any = {
		Name : target.NameDesc(),
		name : target.nameDesc(),
		Poss : target.Possessive(),
		poss : target.possessive(),
	};
	parse = target.ParserTags(parse);
	parse = target.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, target.plural());

	Text.Add("Unstoppering the vial, [name] drink[notS] the viscous liquid in one gulp. It tastes faintly of raw egg yolk with a texture to match, but goes down smoothly without a hitch.", parse);
	Text.NL();
	const isPreg = target.pregHandler.PregnantWombs();
	const wombs = _.filter(isPreg, (w) => {
		return w.progress < 1;
	});
	if (isPreg.length > 0) {
		if (wombs.length > 0) {
			Text.Add("Nothing happens for a moment, and then [poss] hands fly to [hisher] [belly] as a comforting warmth takes root in its lower depths, slowly spreading outwards to fill [hisher] womb.", parse);
			Text.NL();

			gestariumBellyGrowth(target, wombs, parse);
		} else {
			parse._is = target.plural() ? "'re" : " is";
			Text.Add("While a faint gurgle sounds from within [poss] [belly], the skin visibly trembling, [hisher] pregnancy doesn’t grow any further. Seems like [name][_is] fit to pop any moment - best to get somewhere safe for the birth, lest you have to do the deed at an inconvenient time…", parse);
		}
	} else {
		Text.Add("Moments tick by, but nothing happens. Maybe drinking this while not pregnant wasn’t the best of ideas… ", parse);
	}
	Text.NL();
});

const gestariumBellyGrowth = (target: Entity, wombs: Womb[], parse: any) => {
	const size = target.pregHandler.BellySize();

	if (size < 0.1) {
		Text.Add("Gradually, [name] become[notS] aware of a faint pressure deep within [hisher] lower belly, palpable waves of contentment radiating from within even as the skin quavers and pulses to reflect the changes taking place within.", parse);
	} else if (size < 0.3) {
		Text.Add("Slowly, the warmth turns to pressure, and [name] look[notS] down to find the gentle swell of [hisher] baby bump pushing outward. Almost unnoticeable before, it’s becoming less and less so with each passing moment as the life growing inside begins to push against [poss] womb in earnest.", parse);
 } else if (size < 0.5) {
		Text.Add("[Name] let[notS] out a gentle, quivering sigh as the warmth begins to push outward and clutch[notEs] [hisher] belly as butterflies erupt in the pit of [hisher] stomach. Pulsating with steady growth, [poss] baby bump begins to spread [hisher] hands apart as the potion’s effects take hold and cause the offspring within to mature rapidly. It’s not that big yet, but how large will it be when this is over?", parse);
 } else if (size < 0.8) {
		Text.Add("A soft moan escapes [poss] mouth as [hisher] tummy, already obviously pregnant, begins to fill out even more thanks to the potion’s effects.", parse);
 } else if (size < 1.2) {
		Text.Add("[Name] pant[notS] and gasp[notS] as the feeling of being so full of life floods [hisher] senses; shamelessly, [heshe] rub[notS] [hisher] hands of the burgeoning swell of [hisher] [belly] as it fills out beautifully. Already heavily pregnant and being filled with even more life by the moment, one can only guess at where the growth will stop…", parse);
 } else if (size < 1.6) {
		Text.Add("Slowly, almost reluctantly, the potion’s effects take hold, and [name] moan[notS] unabashedly at the wondrous sensations coursing through [hisher] body, centered about [hisher] womb. Already stretched taut, the skin about [hisher] pregnant belly grows thinner and thinner as the life within grows bigger and bigger, heavier and heavier…", parse);
 } else if (size < 2.0) {
		Text.Add("An ominous rumble resounds from deep within [poss] womb, the usually taut skin of [hisher] womb quivering like jelly as energy gathers in preparation for what’s to come. It doesn’t take long, either - before you know it, [poss] pregnancy is swelling forth before your very eyes, a rapid, pulsating growth. Pushing out and then shrinking in a little, pushing out and then shrinking in a little, [poss] oversized pregnancy already looks overdue with twins, and it’s still getting bigger…", parse);
 } else if (size < 3.0) {
		Text.Add("Clutching [hisher] monstrous pregnancy, [name] huff[notS] and puff[notS], openly panting as the potion acts on the new life developing within [himher]. Staggering a little as [hisher] center of balance begins to shift once more, [name] run[notS] a hand over the taut [skin] that covers the swell of [hisher] pregnancy, delighting in the growth that’s taking place.", parse);
 } else {
		Text.Add("It seems impossible that [name] could get any larger, yet that’s exactly what happens. Lost in the sheer bliss of warmth and growth, [name] [isAre] certainly in a motherly way as the potion takes hold on [hisher] burgeoning womb. Tightly stretched skin creaks as [poss] growth accelerates, and you can’t help but wonder if [name] [isAre] about to burst…", parse);
 }
	Text.Add(" ");

	const womb = _.sample(wombs);
	const oldProgress = womb.progress;

	// growth
	womb.progress     += 0.2;
	const hours = 0.2 * womb.hoursToBirth / (1 - oldProgress);
	womb.hoursToBirth -= hours;

	const newSize = target.pregHandler.BellySize();

	if (newSize < 0.3) {
		Text.Add("When the sensation passes, [poss] belly has grown ever so slightly outward, the barest of bumps to mark [poss] pregnancy. Even with the potion’s help, it’ll probably be a little while before the new life within is ready to emerge into the world.", parse);
	} else if (newSize < 0.5) {
		Text.Add("With the growth over, [poss] pregnant bump has settled into a small protrusion - now plainly visible, but still concealable if [heshe] [wasWere] to wear loose-fitting clothes. There’s still plenty of room in [poss] womb for [hisher] offspring to grow, if need be…", parse);
 } else if (newSize < 0.8) {
		Text.Add("A gurgle sounds from within [poss] [belly], marking the end of the potion-induced growth spurt. [Name] very obviously look[notS] pregnant now - [hisher] belly is impossible to hide, a protruding bump that sticks out in front of [himher]. There’s some weight to it, but it doesn’t look <i>heavy</i> yet - although one wonders if that’s going to change as time passes.", parse);
 } else if (newSize < 1.2) {
		Text.Add("After the growth spurt’s passed, [name] [isAre] left holding a very huggable pregnant belly: full, rounded and looking as large as a full-term pregnancy - perhaps a little more. With all the added weight, [name] [hasHave] shifted [hisher] stance a little to deal with [hisher] lower center of gravity.", parse);
 } else if (newSize < 1.6) {
		Text.Add("By the time [poss] womb has calmed once more, [name] [isAre] massive - perhaps the size of a mother carrying full-term twins, give or take a month or so.Tapering off at its peak, [poss] belly juts out before [himher], round and full.", parse);
 } else if (newSize < 2.0) {
		Text.Add("The extent to which [poss] belly swells is a little worrisome - well, more than a little worrisome. [HeShe] [isAre] already so large, [hisher] hands barely able to fully encircle the massive maternal mound that juts from [hisher] midesction - just how much longer is this pregnancy going to take, and more importantly, how much bigger [isAre] [name] going to grow?", parse);
		Text.NL();
		Text.Add("You can only suppose that [poss] body knows what’s it’s doing and hasn’t bitten off more than it can chew, but even so…", parse);
	} else if (newSize < 3.0) {
		Text.Add("With how heavy [name] already [isAre], all the growth that’s just taken place has made [himher] truly rounded, [hisher] [belly] a massive, swollen dome of impending life. [Poss] skin creaks dangerously as the last spurts of growth take place, but the potion has truly done its job well, allowing [name] to stretch easily and clearly to deal with the rapid maturation of [hisher] young.", parse);
		Text.NL();
		Text.Add("For [poss] own sake, though, hopefully the birthing moment isn’t too far off…", parse);
	} else {
		Text.Add("Utterly and massively pregnant, you can only wonder how [name] manage[notS] to remain standing as the potion’s effects finally run their course. Ripe and full to the point of bursting, [heshe] can’t even reach around the new contours of [hisher] pregnancy. It can’t be long now, can it? Can it?", parse);
 }

	// PC only, since these are more internal feelings than anything else. Play these if the player progresses from one stage to another. I believe it’s impossible for the PC to jump any more than 1 stage from a potion, so things should be fine.
	// Could a separate one be made for followers?
	if (target === GAME().player) {
		const newProgress = womb.progress;

		if (oldProgress < PregnancyLevel.Level2 && newProgress >= PregnancyLevel.Level2) {
			Text.NL();
			Text.Add("The growth is accompanied by a pleasant surprise: the vague queasiness that’d been plaguing you quickly vanishes, to be replaced by a warm glow of contentment. It’s faint, but you have the feeling it’ll be growing…", parse);
		} else if (oldProgress < PregnancyLevel.Level3 && newProgress >= PregnancyLevel.Level3) {
			Text.NL();
			if (target.FirstBreastRow().Size() >= 2) {
				Text.Add("As your womb has grown, so have your breasts - and the sensation of pressure within them, your boobflesh having perked up. With a faint dribble of warmth, you look down to discover a small white bead welling up on each of your nipples before falling away.", parse);
				Text.NL();
				Text.Add("That’s not all, though. ", parse);
			}
			if (womb.IsEgg()) {
				parse = Text.ParserPlural(parse, womb.litterSize > 1);
				Text.Add("As your belly has grown outwards, so [hasHave] the egg[s] within your womb; you feel a faint tickle of hard shell roll about in your lower belly as they shift into their new positions. While you can’t really feel [itThem] most of the time, it’s nevertheless reassuring to know that [itsTheyre] getting closer to the moment of laying…", parse);
			} else {
				Text.Add("Accompanying your potion-induced growth spurt is a faint flutter of movement from within your lower belly; you wonder at first if it’s just your imagination, but another faint stirring quashes that doubt. Seems like the life growing within you has decided to make itself known in no uncertain terms.", parse);
			}
		} else if (oldProgress < PregnancyLevel.Level4 && newProgress >= PregnancyLevel.Level4) {
			Text.NL();
			Text.Add("Hugging your now-bigger belly, you’re rewarded with ", parse);
			if (womb.IsEgg()) {
				Text.Add("a jab from within as your newly-enlarged eggs jostle for space within your settling womb. Things are getting pretty crowded in there, by the feel of things - you wait a little while for your womb to calm and adjust to its new load, then get ready to be on your way.", parse);
			} else {
				Text.Add("a powerful kick from within your [belly], aimed squarely at your hands. Seems like the life you’re bearing is getting quite active now, birth can’t be that far away. Well, hopefully - judging by that last kick and the squirming that’s going on inside you, you’re going to end up perpetually winded if this keeps up all the time.", parse);
			}
		} else if (oldProgress < PregnancyLevel.Level5 && newProgress >= PregnancyLevel.Level5) {
			Text.NL();
			Text.Add("With the final pulses of growth, you feel a weight slip downwards from your [belly], nestling snugly against your pelvis and weighing heavily against your cervix. Uh-oh - it seems like you’re really, <i>really</i> close to popping now… best to get yourself to a safe spot to do the deed, lest your body decides to do it anyway at the most inconvenient time…", parse);
		}
	}

	if (Math.random() < 0.5) {
		const breasts = target.FirstBreastRow();
		const hipSize = target.body.HipSize();
		const buttSize = target.Butt().Size();
		const lact = target.LactHandler().Rate();
		const production = target.LactHandler().Production();

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("[Poss] baby bump isn’t the only thing that’s growing, changing. With the sudden surge of hormones and fertile energy coursing through [name], [poss] [breasts] begin to tingle and turn tender.", parse);

			const growth = breasts.Size() < 12.5;

			if (growth) {
				Text.Add(" Without further warning, they suddenly balloon outwards, maturing in a potion-induced growth spurt!");
				Text.NL();

				breasts.size.IncreaseStat(12.5, 2.5);

				parse.cups = breasts.ShortCup();
				Text.Add("When the sudden breast expansion fades, [name] [isAre] sporting a pair of [cups], [hisher] mammaries now more capable of nourishing the brood growing within [himher].", parse);
			}
			if (production < 3 && Math.random() < 0.5) {
				Text.NL();
				Text.Add("[Poss] can feel [hisher] breasts swelling slightly, as [heshe] become[notS] able to produce milk at a quicker rate.", parse);
				target.lactHandler.milkProduction.IncreaseStat(3, 1);
			}
			if (lact < 5 && Math.random() < 0.5) { // #if Lactation rate increase occurs
				Text.NL();
				if (growth) {
					Text.Add("The changes aren’t done, though. ");
				}
				Text.Add("Gentle heat gathers just behind [poss] nipples, sending tendrils of warmth into the breasts beneath. Boobflesh trembles and nipples stiffen as milk ducts mature and multiply within [poss] milk-makers, increasing the rate at which [heshe] can produce baby food.", parse);

				target.lactHandler.lactationRate.IncreaseStat(5, 1);
			}
		}, 1.0, () => (lact < 5) || (production < 3) || (breasts.Size() < 12.5));
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("As [poss] baby bump finishes its growth, though, another change is taking place. With a faint creaking and shifting, [name] find[notS] [hisher] stance widening as [hisher] hips widen and butt plumps up, the comforting warmth moving downwards from [hisher] lower belly and working its magic there.", parse);
			Text.NL();
			Text.Add("Seems like [poss] body is thinking ahead - this will definitely help with the eventual birth, although in the meantime, [name] also look[notS] very much more motherly and fertile…", parse);

			target.body.torso.hipSize.IncreaseStat(HipSize.VeryWide, 1);
			target.Butt().buttSize.IncreaseStat(15, 1);
		}, 1.0, () => (hipSize < HipSize.VeryWide) || (buttSize < 15));
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("Last but not least, [poss] breasts, already firm, turn practically turgid and sensitive - the reason for that soon becomes clear as a bead of rich cream wells up from each nipple before falling away. Seems like the potion was nice enough to fill up [poss] baby-feeders to the brim, ready for a nice milking… or whatever else [heshe] may have in mind.", parse);

			target.lactHandler.FillMilk(1);
		}, 1.0, () => true);

		scenes.Get();
	}
};

const gestariumPlus = new TFItem("sex1", "Gestarium+");
gestariumPlus.price = 100;
gestariumPlus.lDesc = () => "a bottle of Gestarium+";
gestariumPlus.Short = () => "A bottle of Gestarium+";
gestariumPlus.Long = () => "A bottle of fertility-enhancing Gestarium+.";
gestariumPlus.recipe = [{it: felinix}, {it: leporine}, {it: bovia}];
// Effects
gestariumPlus.PushEffect(TF.ItemEffects.IncLib, {odds: 0.3, ideal: 40, max: 2});
gestariumPlus.PushEffect(TF.ItemEffects.IncCha, {odds: 0.2, ideal: 40, max: 2});
gestariumPlus.PushEffect((target: Entity) => {
	const parse: any = {
		Poss: target.Possessive(),
		notS: target.plural() ? "" : "s",
	};
	if (target.HasBalls() && Math.random() < 0.6) {
		const res = target.Balls().size.DecreaseStat(1, 1);
		if (target.Balls().size.Get() <= 1) {
			target.Balls().count.base = 0;
			Text.Add("[Poss] balls shrivel and disappear completely!", parse);
			Text.NL();
		} else {
			Text.Add("[Poss] balls have shrunk in size!", parse);
			Text.NL();
		}
	}
	Text.Flush();
});
gestariumPlus.PushEffect((target: Entity) => {
	const parse: any = {
		name  : target.nameDesc(),
		heshe : target.heshe(),
		is    : target.is(),
	};
	target.AddLustFraction(0.7);

	Text.Add("A shiver runs through [name] as [heshe] [is] hit by a wave of lust!", parse);
	Text.NL();
});
gestariumPlus.PushEffect((target: Entity) => {
	let parse: any = {
		name : target.nameDesc(),
		poss : target.possessive(),
	};
	parse = target.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, target.plural());
	// No effect if not vialble
	if (!target.FirstVag() && !target.PregHandler().MPregEnabled()) {
		Text.Add("A rumble runs through [poss] belly, but [heshe] lack[notS] the organs for the potion to fully take hold.", parse);
		Text.NL();
	} else {
		if (Math.random() < 0.3) {
			const res = target.pregHandler.gestationRate.IncreaseStat(3, .2, true);
			if (res) {
				Text.Add("A rumble runs through [poss] belly as [hisher] womb quickens. From now on, pregnancies are going to be quicker for [name]!", parse);
				Text.NL();
			}
		}
		if (Math.random() < 0.4) {
			const res = target.pregHandler.fertility.IncreaseStat(.8, .1, true);
			if (res) {
				Text.Add("A rumble runs through [poss] belly as [hisher] womb quickens. From now on, [name] [isAre] going to be more receptive to impregnation!", parse);
				Text.NL();
			}
		}
	}
	Text.Flush();
});
gestariumPlus.PushEffect(TF.ItemEffects.DecTone, {odds: 0.1, ideal: 0, max: .1});
gestariumPlus.PushEffect(TF.ItemEffects.IncFem, {odds: 0.1, ideal: 1, max: .1});

export namespace AlchemyItems {
	export const Equinium = equinium;
	export const Leporine = leporine;
	export const Felinix = felinix;
	export const Lacertium = lacertium;
	export const Ovis = ovis;
	export const Bovia = bovia;
	export const Caprinium = caprinium;
	export const Canis = canis;
	export const Lobos = lobos;
	export const Vulpinix = vulpinix;
	export const Infernum = infernum;
	export const Avia = avia;
	export const Lepida = lepida;
	export const Scorpius = scorpius;
	export const Cerventine = cerventine;
	export const HoneyBrew = honeyBrew;
	export const Florium = florium;
	export const Homos = homos;
	export const Virilium = virilium;
	export const Gestarium = gestarium;
	export const GestariumPlus = gestariumPlus;
	export const Testos = testos;
	export const Estros = estros;
	export const Infertilium = infertilium;
	export const InfertiliumPlus = infertiliumPlus;
	export const Fertilium = fertilium;
	export const FertiliumPlus = fertiliumPlus;
}
