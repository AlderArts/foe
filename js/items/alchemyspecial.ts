import * as _ from 'lodash';

import { TF, TFItem } from '../tf';
import { Genitalia } from '../body/genitalia';
import { HipSize } from '../body/body';
import { AlchemyItems } from './alchemy';
import { IngredientItems } from './ingredients';
import { Race } from '../body/race';
import { Color } from '../body/color';
import { Cock } from '../body/cock';
import { Vagina } from '../body/vagina';
import { EncounterTable } from '../encountertable';
import { GAME } from '../GAME';
import { Text } from '../text';
import { Entity } from '../entity';

let AlchemySpecial : any = {};

AlchemySpecial.EquiniumPlus = new TFItem("equin+", "Equinium+");
AlchemySpecial.EquiniumPlus.price = 100;
AlchemySpecial.EquiniumPlus.lDesc = function() { return "a bottle of Equinium+"; }
AlchemySpecial.EquiniumPlus.Short = function() { return "A bottle of Equinium+"; }
AlchemySpecial.EquiniumPlus.Long = function() { return "A bottle of Equinium, potent enough to significantly change your body. The fluid inside is creamy, smelling of male musk."; }
//TODO recipe
AlchemySpecial.EquiniumPlus.recipe = [{it: AlchemyItems.Equinium, num: 3}, {it: IngredientItems.HorseHair}, {it: IngredientItems.HorseCum}];
// Effects
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.SetEars, {odds: 0.8, race: Race.Horse, str: "equine ears"});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.SetTail, {odds: 0.8, race: Race.Horse, color: Color.brown, str: "a brown, bushy horse tail"});
AlchemySpecial.EquiniumPlus.PushEffect(function(target : Entity) {
	var parse : any = {
		name: target.NameDesc(),
		s: target == GAME().player ? "" : "s",
		possessive: target.possessive(),
		Possessive: target.Possessive(),
		multiCockDesc : function() { return target.MultiCockDesc(); }
	};
	var cocks = target.AllCocks();
	// Create new cock
	if(cocks.length == 0) {
		var cock = new Cock(Race.Horse, Color.pink);
		cock.length.base    = 25;
		cock.thickness.base = 7;
		cocks.push(cock);
		Text.Add("[name] grow[s] a huge horsecock!", parse);
		Text.NL();
	}
	else if(TF.SetRaceAll(cocks, Race.Horse)) {
		if(cocks.length > 1)
			Text.Add("All of [possessive] cocks turn into horsecocks!", parse);
		else
			Text.Add("[Possessive] cock turns into a horsecock!", parse);
		Text.NL();
	}
	var len = false, thk = false;
	for(var i = 0; i < cocks.length; i++) {
		// Base size
		var inc  = cocks[i].length.IncreaseStat(25, 100);
		var inc2 = cocks[i].thickness.IncreaseStat(7, 100);
		if(inc == null)
			inc = cocks[i].length.IncreaseStat(50, 5);
		if(inc2 == null)
			inc2 = cocks[i].thickness.IncreaseStat(12, 1);
		len = len || (inc > 0);
		thk = thk || (inc2 > 0);
	}
	if(len || thk) {
		parse["s"]    = target.NumCocks() > 1 ? "s" : "";
		parse["notS"] = target.NumCocks() > 1 ? "" : "s";
		Text.NL();
		Text.Add("[Possessive] [multiCockDesc] shudder[notS], the stiff dick[s] growing significantly ", parse);
		if(len)
			Text.Add("longer", parse);
		if(len && thk)
			Text.Add(" and ", parse);
		if(thk)
			Text.Add("thicker", parse);
		Text.Add(".", parse);
	}
	Text.Flush();
});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.SetCover, {odds: 0.8, value: Genitalia.Cover.Sheath});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.SetBalls, {ideal: 2, count: 2});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 50, max: 3});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 50, max: 3});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 20, max: 1});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.DecDex, {odds: 0.2, ideal: 20, max: 1});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.SetBody, {odds: 0.4, race: Race.Horse, str: "an equine shape"});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.SetFace, {odds: 0.3, race: Race.Horse, str: "a horse-like face"});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.SetArms, {odds: 0.3, race: Race.Horse, str: "furred equine arms"});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Horse, str: "furred equine legs, with hooves"});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.DecFem, {odds: 0.3, ideal: -1, max: .2, male: true});
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.IncTone, {odds: 0.3, ideal: 1, max: .1 });
AlchemySpecial.EquiniumPlus.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});



//TODO
AlchemySpecial.Tigris = new TFItem("felin+0", "Tigris");
AlchemySpecial.Tigris.price = 100;
AlchemySpecial.Tigris.lDesc = function() { return "a bottle of Tigris"; }
AlchemySpecial.Tigris.Short = function() { return "A bottle of Tigris"; }
AlchemySpecial.Tigris.Long = function() { return "A bottle labeled Tigris, with the picture of a large cat on it. The fluid within is a strange mixture of black and orange."; }
//TODO ingredients
AlchemySpecial.Tigris.recipe = [{it: AlchemyItems.Felinix}, {it: IngredientItems.HairBall}, {it: IngredientItems.CatClaw}];
// Effects
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.4, race: Race.Feline, str: "rough, cat-like tongue"});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.SetBody, {odds: 0.4, race: Race.Tiger, str: "a feline shape, complete with fur"});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.SetFace, {odds: 0.3, race: Race.Tiger, str: "a cat-like face"});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.SetArms, {odds: 0.3, race: Race.Tiger, str: "furred cat arms, with soft paws"});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Tiger, str: "furred cat legs, with soft paws"});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.SetCock, {odds: 0.6, race: Race.Tiger, str: "a feline cock"});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.SetEars, {odds: 0.6, race: Race.Tiger, str: "fluffy cat ears"});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.SetTail, {odds: 0.6, race: Race.Tiger, color: Color.orange, str: "a striped, flexible feline tail"});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.IncDex, {odds: 0.3, ideal: 35, max: 2});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.IncStr, {odds: 0.5, ideal: 45, max: 2});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 25, max: 2});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.IncSta, {odds: 0.2, ideal: 40, max: 2});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.DecInt, {odds: 0.1, ideal: 25, max: 1});
AlchemySpecial.Tigris.PushEffect(function(target : Entity) {
	var parse : any = {
		name: target.NameDesc(),
		s: target == GAME().player ? "" : "s",
		possessive: target.possessive(),
		Possessive: target.Possessive()
	};
	var cocks = target.AllCocks();
	/* TODO
	for(var i = 0; i < cocks.length; i++) {
		var cock = cocks[i];
		if(cock.sheath == 0 && Math.random() < 0.4) {
			parse["cock"] = cock.Short();
			Text.Add("[Possessive] [cock] is encased in a soft, furry sheath!", parse);
			Text.NL();
		}
	}
	*/
	Text.Flush();
});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.DecFem, {odds: 0.2, ideal: -.7, max: .1, male: true});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.IncTone, {odds: 0.2, ideal: .9, max: .1 });
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.DecHips, {odds: 0.3, ideal: HipSize.Medium, max: 1});
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.IncCockLen, {odds: 0.4, ideal: 25, max: 2 });
AlchemySpecial.Tigris.PushEffect(TF.ItemEffects.IncCockThk, {odds: 0.4, ideal: 6, max: 1 });


AlchemySpecial.InfernumPlus = new TFItem("demon+", "Infernum+");
AlchemySpecial.InfernumPlus.price = 100;
AlchemySpecial.InfernumPlus.lDesc = function() { return "a bottle of Infernum+"; }
AlchemySpecial.InfernumPlus.Short = function() { return "A bottle of Infernum+"; }
AlchemySpecial.InfernumPlus.Long = function() { return "A bottle of extra potent Infernum, with the picture of a large, decidedly male demon on it. The fluid within is a thick black sludge, reeking of corruption."; }
AlchemySpecial.InfernumPlus.recipe = [{it: AlchemyItems.Infernum}, {it: IngredientItems.BlackGem}, {it: IngredientItems.DemonSeed, num: 3}];
// Effects
AlchemySpecial.InfernumPlus.PushEffect(function(target : Entity) {
	var parse : any = {
		name: target.NameDesc(),
		s: target == GAME().player ? "" : "s",
		possessive: target.possessive(),
		Possessive: target.Possessive(),
		multiCockDesc : function() { return target.MultiCockDesc(); }
	};
	var cocks = target.AllCocks();
	// Create new cock
	if(Math.random() < 0.5 && target.NumCocks() < 5) {
		var cock = new Cock(Race.Demon, Color.red);
		cock.length.base    = 20;
		cock.thickness.base = 4;
		cocks.push(cock);
		Text.Add("[name] grow[s] a demonic cock!", parse);
		Text.NL();
	}
	else if(cocks.length > 0 && TF.SetRaceAll(cocks, Race.Demon)) {
		if(cocks.length > 1)
			Text.Add("All of [possessive] cocks turn into demonic cocks!", parse);
		else
			Text.Add("[Possessive] cock turns into a demonic cock!", parse);
		Text.NL();
	}
	if(cocks.length > 0) {
		var size = false;
		for(var i = 0; i < cocks.length; i++) {
			// Base size
			var inc  = cocks[i].length.IncreaseStat(20, 100);
			var inc2 = cocks[i].thickness.IncreaseStat(4, 100);
			if(inc == null)
				inc  = cocks[i].length.IncreaseStat(30, 2);
			if(inc2 == null)
				inc2 = cocks[i].thickness.IncreaseStat(6, 1);
			if(inc || inc2) size = true;
		}
		if(size) {
			parse["s"]    = target.NumCocks() > 1 ? "s" : "";
			parse["notS"] = target.NumCocks() > 1 ? "" : "s";
			Text.NL();
			Text.Add("[Possessive] [multiCockDesc] shudder[notS], the stiff dick[s] growing significantly longer and thicker.", parse);
		}
	}
	Text.Flush();
});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.SetBody, {odds: 0.3, race: Race.Demon, color: Color.red, str: "a fully demonic form"});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.5, race: Race.Demon, color: Color.red, str: "plantigrade, demonic legs with clawed feet"});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.SetArms, {odds: 0.5, race: Race.Demon, color: Color.red, str: "demonic arms with clawed hands"});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.SetTail, {odds: 0.6, race: Race.Demon, color: Color.red, str: "a red, spaded demon tail"});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.6, race: Race.Demon, color: Color.red, count: 4, str: "a pair of demon horns" });
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.6, race: Race.Demon, str: "long and flexible tongue"});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 35, max: 2});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 2});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 40, max: 2});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.IncLib, {odds: 0.8, ideal: 55, max: 2});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: 1, max: .25, female: true});
AlchemySpecial.InfernumPlus.PushEffect(TF.ItemEffects.DecFem, {odds: 0.2, ideal: -1, max: .25, male: true});


AlchemySpecial.Nagazm = new TFItem("naga0", "Nagazm");
AlchemySpecial.Nagazm.price = 7;
AlchemySpecial.Nagazm.lDesc = function() { return "a bottle of Nagazm"; }
AlchemySpecial.Nagazm.Short = function() { return "A bottle of Nagazm"; }
AlchemySpecial.Nagazm.Long  = function() { return "A bottle with a pink, bubbly liquid, labeled Nagasm. It has the picture of a snake on it."; }
AlchemySpecial.Nagazm.recipe = [{it: IngredientItems.SnakeOil}, {it: IngredientItems.SnakeFang}, {it: IngredientItems.SnakeSkin}];
// Effects
AlchemySpecial.Nagazm.PushEffect(function(target : Entity) {
	var parse : any = {
		Poss : target.Possessive(),
		legsDesc : function() { return target.LegsDesc(); },
		s : target.body.legs.count > 1 ? "" : "s"
	};
	
	if(Math.random() < 0.4) {
		if(target.body.legs.count != 0 && target.body.legs.race != Race.Snake) {
			TF.ItemEffects.RemTail(target, {count: -1});
			
			Text.Add("[Poss] [legsDesc] turn[s] into a long serpentine tail!", parse);
			Text.NL();
			
			target.body.legs.count = 0;
			target.body.legs.race  = Race.Snake;
		}
	}
	Text.Flush();
});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.RemBalls, {odds: 0.5, ideal: 0, count: 2});
AlchemySpecial.Nagazm.PushEffect(function(target : Entity) {
	var parse : any = { Name: target.NameDesc(), s: target.plural() ? "" : "s" };
	
	if (Math.random() < 0.5) {
		var vags  = target.AllVags();
		var cocks = target.AllCocks();
		if (vags.length < 1 && !target.HasBalls()) {
			vags.push(new Vagina());
			parse["vag"] = vags[0].Short();
			Text.Add("[Name] grow[s] a brand new [vag]!", parse);
			Text.NL();
		}
		else if (cocks.length < 1) {
			cocks.push(new Cock());
			parse["cock"] = cocks[0].Short();
			Text.Add("[Name] grow[s] a brand new [cock]!", parse);
			Text.NL();
		}
	}
	Text.Flush();
});
AlchemySpecial.Nagazm.PushEffect(function(target : Entity) {
	// TODO: Race check like in Lacertium? What race are Naga penises?
	// TODO: Other prerequisites? No testicles? Hermaphroditism?
	var cocks = target.AllCocks();
	if(cocks.length == 1 && Math.random() < 0.1) {
		var parse : any = { Poss: target.Possessive(), cockDesc: cocks[0].Short()};
		cocks.push(cocks[0].Clone());
		Text.Add("[Poss] [cockDesc] splits in two identical dicks!", parse);
		Text.NL();
		Text.Flush();
	}
});
// TODO: Naga eyes? From descr in scenes: "faintly glowing" "vivid, angular magenta eyes"
// TODO: Snake tongue? "a long, forked tongue"
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.4, race: Race.Snake, str: "long, serpentine tongue"});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Elf, str: "elongated, pointy ears"});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Slit});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.IncLib, {odds: 0.5, ideal: 40, max: 1});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 40, max: 1});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 20, max: 1});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 20, max: 1});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.IncFem, {odds: 0.3, ideal: .9, max: .1});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.IncHips, {odds: 0.3, ideal: HipSize.VeryWide, max: 2});
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 0.6, ideal: 26, max: 2, female: true });
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.IncCockLen, {odds: 0.6, ideal: 30, max: 3 });
AlchemySpecial.Nagazm.PushEffect(TF.ItemEffects.IncCockThk, {odds: 0.6, ideal: 8, max: 1 });


AlchemySpecial.Taurico = new TFItem("taur0", "Taurico");
AlchemySpecial.Taurico.price = 7;
AlchemySpecial.Taurico.lDesc = function() { return "a bottle of Taurico"; }
AlchemySpecial.Taurico.Short = function() { return "A bottle of Taurico"; }
AlchemySpecial.Taurico.Long  = function() { return "A bottle filled with a strange, jelly-like substance. It has a picture of a centaur on it."; }
AlchemySpecial.Taurico.recipe = [{it: IngredientItems.HorseShoe}, {it: IngredientItems.CanisRoot}, {it: IngredientItems.Ramshorn}];
// Effects
AlchemySpecial.Taurico.PushEffect(function(target : Entity) {
	var parse : any = {
		Poss : target.Possessive(),
		legsDesc : function() { return target.LegsDesc(); },
		race : function() { return target.body.legs.race.qShort(); },
		s : target.body.legs.count > 1 ? "" : "s"
	};
	
	if(Math.random() < 1.0) { //TODO
		if(target.body.legs.count <= 4) {
			target.body.legs.count = 4;
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				target.body.legs.race = Race.Horse;
			}, 2.0, function() { return true; });
			scenes.AddEnc(function() {
				target.body.legs.race = Race.Wolf;
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				target.body.legs.race = Race.Sheep;
			}, 1.0, function() { return true; });
			scenes.Get();
			
			Text.Add("[Poss] lower body morphs until it has four [race] legs!", parse);
		}
	}
	Text.Flush();
});


AlchemySpecial.Androgyn = new TFItem("trap0", "Androgyn");
AlchemySpecial.Androgyn.price = 25;
AlchemySpecial.Androgyn.lDesc = function() { return "a bottle of Androgyn"; }
AlchemySpecial.Androgyn.Short = function() { return "A bottle of Androgyn"; }
AlchemySpecial.Androgyn.Long  = function() { return "A bottle containing a sparkling pink fluid. It’s glowing slightly."; }
AlchemySpecial.Androgyn.recipe = [{it: AlchemyItems.Testos}, {it: AlchemyItems.Estros}, {it: IngredientItems.SpringWater}];
// Effects
AlchemySpecial.Androgyn.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.8, minRange: -.1, maxRange: .3, max: .3});
AlchemySpecial.Androgyn.PushEffect(TF.ItemEffects.DecTone, {odds: 0.8, ideal: 0, max: .3 });
AlchemySpecial.Androgyn.PushEffect(TF.ItemEffects.IdealHips, {odds: 0.2, ideal: HipSize.Medium-1, max: 3});
AlchemySpecial.Androgyn.PushEffect(TF.ItemEffects.SetIdealBreastSize, {odds: 0.6, ideal: 1, max: 5});
AlchemySpecial.Androgyn.PushEffect(TF.ItemEffects.DecCockLen, {odds: 0.8, ideal: 10, max: 4 });
AlchemySpecial.Androgyn.PushEffect(TF.ItemEffects.DecCockThk, {odds: 0.8, ideal: 3, max: 2 });
AlchemySpecial.Androgyn.PushEffect(TF.ItemEffects.DecBallSize, {odds: 0.8, ideal: 1, max: 4 });


AlchemySpecial.Anusol = new TFItem("anal0", "Anusol");
AlchemySpecial.Anusol.price = 25;
AlchemySpecial.Anusol.lDesc = function() { return "a bottle of Anusol"; }
AlchemySpecial.Anusol.Short = function() { return "A bottle of Anusol"; }
AlchemySpecial.Anusol.Long  = function() { return "A bottle labeled Anusol, filled with an oily-looking dark green fluid. It increases anal sensitivity."; }
AlchemySpecial.Anusol.recipe = [{it: IngredientItems.SnakeOil}, {it: IngredientItems.SpringWater}, {it: IngredientItems.FruitSeed}];
// Effects
AlchemySpecial.Anusol.PushEffect(function(target : Entity) {
	var parse : any = {
		botArmor : target.LowerArmorDesc(),
		Poss : target.Possessive()
	};
	parse = target.ParserTags(parse);
	
	var cum = target.OrgasmCum();
	
	if(target == GAME().player) {
		Text.Add("You raise the bottle to your lips and tip the contents down your throat. The oily green elixir disappears smoothly enough, leaving behind a somewhat greasy aftertaste and a lingering taste of sweetness.", parse);
		Text.NL();
		Text.Add("A quivering sensation erupts from your [anus], and you moan despite yourself, feeling your pucker wrinkle and flex as if it were being stretched by some ethereal phallus.", parse);
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("You can feel yourself stretching wider than ever before, and with an ease you previously lacked. You just know that your ass can take bigger insertions now than it could before.", parse);
			
			target.Butt().capacity.IncreaseStat(10, 1);
		}, 1.0, function() { return target.Butt().capacity.Get() < 10; });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("Around it, you can feel your butt beginning to grow, swelling out slightly. You now have a [butt]!", parse);
			
			target.Butt().buttSize.IncreaseStat(10, 1);
		}, 1.0, function() { return target.Butt().Size() < 10; });
		scenes.Get();
		
		Text.NL();
		Text.Add("The sensation just keeps growing stronger and stronger, pleasure washing over your whole body as your [anus] is stimulated without mercy.", parse);
		if(target.FirstCock())
			Text.Add(" Your [cocks] grows painfully erect, stiff and throbbing within your [botArmor] as your prostate is twitched and rolled by the magic washing through your body.", parse);
		if(target.FirstVag())
			Text.Add(" Your [vag] starts to water in sympathy, drooling fluids down your [legs] as the pleasure sets it flowing.", parse);
		Text.NL();
		Text.Add("Eventually, the sensations grow beyond your ability to resist. Your whole body quakes and you cry out as climax washes through you, barely able to keep from falling over at the sharpness of your pleasure. When it flows away, you are left panting for breath, your [botArmor] stained with your juices.", parse);
	}
	else {
		parse["name"] = target.name;
		parse = target.ParserPronouns(parse);
		
		Text.Add("[name] drinks down the oily elixir with a slight grimace, flicking [hisher] tongue at the aftertaste. [HeShe] pauses for a second, eyes narrowing in surprise, only to then widen in shock. [HeShe] lets out a startled gasp, nearly pitching [himher]self into your arms, and then [heshe] moans, arching [hisher] back.", parse);
		Text.NL();
		parse["c"] = target.FirstCock() ? Text.Parse(", [hisher] own [cocks] growing visibly erect from the stimulation", parse) : "";
		Text.Add("[HisHer] [butt] starts to thrust and shake, as if grinding back against some ethereal cock[c]. Faster and faster [heshe] goes, picking up the pace, whimpering in abstract pleasure.", parse);
		Text.NL();
		Text.Add("After a few moments of this show, [heshe] cries out, arching [hisher] back as [heshe] visibly climaxes, staining [hisher] [botArmor] and the ground beneath with sexual fluids. Eventually, [heshe] runs dry and shudders to a stop, panting for breath.", parse);
		Text.NL();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("[Poss] butt swells out, gaining a bit in size.", parse);
			target.Butt().buttSize.IncreaseStat(10, 1);
		}, 1.0, function() { return target.Butt().Size() < 10; });
		scenes.AddEnc(function() {
			Text.Add("Curious to see if it worked, you approach [name] and pull [hisher] [botArmor] aside, reaching in with your hand to examine [hisher] [anus].", parse);
			Text.NL();
			Text.Add("Your probing touch reveals that [hisher] ass is much stretchier than it was before. It looks like the potion has increased [name]’s anal capacity.", parse);
			target.Butt().capacity.IncreaseStat(10, 1);
		}, 1.0, function() { return target.Butt().capacity.Get() < 10; });
		
		scenes.Get();
	}
});



AlchemySpecial.AnusolPlus = new TFItem("anal1", "Anusol+");
AlchemySpecial.AnusolPlus.price = 25;
AlchemySpecial.AnusolPlus.lDesc = function() { return "a bottle of Anusol+"; }
AlchemySpecial.AnusolPlus.Short = function() { return "A bottle of Anusol+"; }
AlchemySpecial.AnusolPlus.Long  = function() { return "A bottle labled Anusol+, filled with a thick and slimy-looking blue fluid. It’s supposed to make anal sex out of this world for the drinker."; }
AlchemySpecial.AnusolPlus.recipe = [{it: IngredientItems.SnakeOil}, {it: IngredientItems.SpringWater}, {it: AlchemyItems.Gestarium}];
// Effects
AlchemySpecial.AnusolPlus.PushEffect(function(target : Entity) {
	var parse : any = {
		botArmor : target.LowerArmorDesc(),
		Poss : target.Possessive()
	};
	parse = target.ParserTags(parse);
	/* TODO
#if (!Mpreg enabled)
Increase Anal capacity (100%)
Increase Anal wetness (100%)
Mpreg enabled (100%)
Trigger heat (10%)
#else
Increase Anal capacity (65%)
Increase Anal wetness (65%)
Trigger heat (10%)
#converge
	 */
	var mpreg = target.pregHandler.MPregEnabled();
	
	if(target == GAME().player) {
		Text.Add("The potion is just as thick and slimy as it looks; it flows down your throat like drinking blue custard, practically thick enough to chew. But you persist and eventually the last drop disappears down your gullet. With a sigh of relief, you wipe your lips, feeling a tingling in your belly.", parse);
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("Prickling erupts in your [anus], and you moan unthinkingly at the sensation. Your anus flexes and clenches uncontrollably, as if stretching to wrap itself around some phantasmal phallus. You can feel yourself stretching wider, and wider, a sensation that isn’t painful as you’d expect. When the prickling fades away, the stretched feeling remains, and you just know you’re more elastic now.", parse);
			target.Butt().capacity.IncreaseStat(15, 3);
		}, 1.0, function() { return target.Butt().capacity.Get() < 15; });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("Your butt swells out, gaining a bit in size.", parse);
			target.Butt().buttSize.IncreaseStat(15, 3);
		}, 1.0, function() { return target.Butt().buttSize.Get() < 15; });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("A strange warmth suddenly blossoms in the pit of your stomach. Instinctively, you wrap your hands around your belly, feeling the warmth growing hotter with each breath. A strange bloating sensation fills you, but it’s not entirely unpleasant... in fact, when it fades away as suddenly as it appeared, you find yourself idly wishing for its return.", parse);
			target.pregHandler.mpreg = true;
		}, 1.0, function() { return !mpreg; });
		scenes.Get();
	}
	else {
		parse["name"] = target.name;
		parse = target.ParserPronouns(parse);
		
		Text.Add("[name] takes the vial and chugs it down, visibly struggling to swallow the near-gelatinous potion. When [heshe] is done, [heshe] wipes [hisher] mouth with a grimace.", parse);
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("[name] groans suddenly, hands flying back to clap over [hisher] [butt], shaking [hisher] hips and thrusting backwards as if responding to the thrusts of some ethereal lover.", parse);
			target.Butt().capacity.IncreaseStat(15, 3);
		}, 1.0, function() { return target.Butt().capacity.Get() < 15; });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("[Poss] butt swells out, gaining a bit in size.", parse);
			target.Butt().buttSize.IncreaseStat(15, 3);
		}, 1.0, function() { return target.Butt().buttSize.Get() < 15; });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("[name] groans, deep and longing, [hisher] arms wrapping themselves protectively around [hisher] stomach, hands brushing protectively over [hisher] belly.", parse);
			target.pregHandler.mpreg = true;
		}, 1.0, function() { return !mpreg; });
		scenes.Get();
	}
});

export { AlchemySpecial };
