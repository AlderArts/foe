import { TF, TFItem } from '../tf';
import { Genitalia } from '../body/genitalia';
import { HipSize } from '../body/body';

Items.EquiniumPlus = new TFItem("equin+", "Equinium+");
Items.EquiniumPlus.price = 100;
Items.EquiniumPlus.lDesc = function() { return "a bottle of Equinium+"; }
Items.EquiniumPlus.Short = function() { return "A bottle of Equinium+"; }
Items.EquiniumPlus.Long = function() { return "A bottle of Equinium, potent enough to significantly change your body. The fluid inside is creamy, smelling of male musk."; }
//TODO recipe
Items.EquiniumPlus.recipe = [{it: Items.Equinium, num: 3}, {it: Items.HorseHair}, {it: Items.HorseCum}];
// Effects
Items.EquiniumPlus.PushEffect(TF.ItemEffects.SetEars, {odds: 0.8, race: Race.Horse, str: "equine ears"});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.SetTail, {odds: 0.8, race: Race.Horse, color: Color.brown, str: "a brown, bushy horse tail"});
Items.EquiniumPlus.PushEffect(function(target) {
	var parse = {
		name: target.NameDesc(),
		s: target == player ? "" : "s",
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
		len |= inc;
		thk |= inc2;
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
Items.EquiniumPlus.PushEffect(TF.ItemEffects.SetCover, {odds: 0.8, value: Genitalia.Cover.Sheath});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.SetBalls, {ideal: 2, count: 2});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 50, max: 3});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 50, max: 3});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 20, max: 1});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.DecDex, {odds: 0.2, ideal: 20, max: 1});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.SetBody, {odds: 0.4, race: Race.Horse, str: "an equine shape"});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.SetFace, {odds: 0.3, race: Race.Horse, str: "a horse-like face"});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.SetArms, {odds: 0.3, race: Race.Horse, str: "furred equine arms"});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Horse, str: "furred equine legs, with hooves"});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.DecFem, {odds: 0.3, ideal: -1, max: .2, male: true});
Items.EquiniumPlus.PushEffect(TF.ItemEffects.IncTone, {odds: 0.3, ideal: 1, max: .1 });
Items.EquiniumPlus.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});



//TODO
Items.Tigris = new TFItem("felin+0", "Tigris");
Items.Tigris.price = 100;
Items.Tigris.lDesc = function() { return "a bottle of Tigris"; }
Items.Tigris.Short = function() { return "A bottle of Tigris"; }
Items.Tigris.Long = function() { return "A bottle labeled Tigris, with the picture of a large cat on it. The fluid within is a strange mixture of black and orange."; }
//TODO ingredients
Items.Tigris.recipe = [{it: Items.Felinix}, {it: Items.HairBall}, {it: Items.CatClaw}];
// Effects
Items.Tigris.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.4, race: Race.Feline, str: "rough, cat-like tongue"});
Items.Tigris.PushEffect(TF.ItemEffects.SetBody, {odds: 0.4, race: Race.Tiger, str: "a feline shape, complete with fur"});
Items.Tigris.PushEffect(TF.ItemEffects.SetFace, {odds: 0.3, race: Race.Tiger, str: "a cat-like face"});
Items.Tigris.PushEffect(TF.ItemEffects.SetArms, {odds: 0.3, race: Race.Tiger, str: "furred cat arms, with soft paws"});
Items.Tigris.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Tiger, str: "furred cat legs, with soft paws"});
Items.Tigris.PushEffect(TF.ItemEffects.SetCock, {odds: 0.6, race: Race.Tiger, str: "a feline cock"});
Items.Tigris.PushEffect(TF.ItemEffects.SetEars, {odds: 0.6, race: Race.Tiger, str: "fluffy cat ears"});
Items.Tigris.PushEffect(TF.ItemEffects.SetTail, {odds: 0.6, race: Race.Tiger, color: Color.orange, str: "a striped, flexible feline tail"});
Items.Tigris.PushEffect(TF.ItemEffects.IncDex, {odds: 0.3, ideal: 35, max: 2});
Items.Tigris.PushEffect(TF.ItemEffects.IncStr, {odds: 0.5, ideal: 45, max: 2});
Items.Tigris.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 25, max: 2});
Items.Tigris.PushEffect(TF.ItemEffects.IncSta, {odds: 0.2, ideal: 40, max: 2});
Items.Tigris.PushEffect(TF.ItemEffects.DecInt, {odds: 0.1, ideal: 25, max: 1});
Items.Tigris.PushEffect(function(target) {
	var parse = {
		name: target.NameDesc(),
		s: target == player ? "" : "s",
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
Items.Tigris.PushEffect(TF.ItemEffects.DecFem, {odds: 0.2, ideal: -.7, max: .1, male: true});
Items.Tigris.PushEffect(TF.ItemEffects.IncTone, {odds: 0.2, ideal: .9, max: .1 });
Items.Tigris.PushEffect(TF.ItemEffects.DecHips, {odds: 0.3, ideal: HipSize.Medium, max: 1});
Items.Tigris.PushEffect(TF.ItemEffects.IncCockLen, {odds: 0.4, ideal: 25, max: 2 });
Items.Tigris.PushEffect(TF.ItemEffects.IncCockThk, {odds: 0.4, ideal: 6, max: 1 });


Items.InfernumPlus = new TFItem("demon+", "Infernum+");
Items.InfernumPlus.price = 100;
Items.InfernumPlus.lDesc = function() { return "a bottle of Infernum+"; }
Items.InfernumPlus.Short = function() { return "A bottle of Infernum+"; }
Items.InfernumPlus.Long = function() { return "A bottle of extra potent Infernum, with the picture of a large, decidedly male demon on it. The fluid within is a thick black sludge, reeking of corruption."; }
Items.InfernumPlus.recipe = [{it: Items.Infernum}, {it: Items.BlackGem}, {it: Items.DemonSeed, num: 3}];
// Effects
Items.InfernumPlus.PushEffect(function(target) {
	var parse = {
		name: target.NameDesc(),
		s: target == player ? "" : "s",
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
Items.InfernumPlus.PushEffect(TF.ItemEffects.SetBody, {odds: 0.3, race: Race.Demon, color: Color.red, str: "a fully demonic form"});
Items.InfernumPlus.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.5, race: Race.Demon, color: Color.red, str: "plantigrade, demonic legs with clawed feet"});
Items.InfernumPlus.PushEffect(TF.ItemEffects.SetArms, {odds: 0.5, race: Race.Demon, color: Color.red, str: "demonic arms with clawed hands"});
Items.InfernumPlus.PushEffect(TF.ItemEffects.SetTail, {odds: 0.6, race: Race.Demon, color: Color.red, str: "a red, spaded demon tail"});
Items.InfernumPlus.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.6, race: Race.Demon, color: Color.red, count: 4, str: "a pair of demon horns" });
Items.InfernumPlus.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.6, race: Race.Demon, str: "long and flexible tongue"});
Items.InfernumPlus.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 35, max: 2});
Items.InfernumPlus.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 2});
Items.InfernumPlus.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 40, max: 2});
Items.InfernumPlus.PushEffect(TF.ItemEffects.IncLib, {odds: 0.8, ideal: 55, max: 2});
Items.InfernumPlus.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: 1, max: .25, female: true});
Items.InfernumPlus.PushEffect(TF.ItemEffects.DecFem, {odds: 0.2, ideal: -1, max: .25, male: true});


Items.Nagazm = new TFItem("naga0", "Nagazm");
Items.Nagazm.price = 7;
Items.Nagazm.lDesc = function() { return "a bottle of Nagazm"; }
Items.Nagazm.Short = function() { return "A bottle of Nagazm"; }
Items.Nagazm.Long  = function() { return "A bottle with a pink, bubbly liquid, labeled Nagasm. It has the picture of a snake on it."; }
Items.Nagazm.recipe = [{it: Items.SnakeOil}, {it: Items.SnakeFang}, {it: Items.SnakeSkin}];
// Effects
Items.Nagazm.PushEffect(function(target) {
	var parse = {
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
Items.Nagazm.PushEffect(TF.ItemEffects.RemBalls, {odds: 0.5, ideal: 0, count: 2});
Items.Nagazm.PushEffect(function(target) {
	var parse = { Name: target.NameDesc(), s: target.plural() ? "" : "s" };
	
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
Items.Nagazm.PushEffect(function(target) {
	// TODO: Race check like in Lacertium? What race are Naga penises?
	// TODO: Other prerequisites? No testicles? Hermaphroditism?
	var cocks = target.AllCocks();
	if(cocks.length == 1 && Math.random() < 0.1) {
		var parse = { Poss: target.Possessive(), cockDesc: cocks[0].Short()};
		cocks.push(cocks[0].Clone());
		Text.Add("[Poss] [cockDesc] splits in two identical dicks!", parse);
		Text.NL();
		Text.Flush();
	}
});
// TODO: Naga eyes? From descr in scenes: "faintly glowing" "vivid, angular magenta eyes"
// TODO: Snake tongue? "a long, forked tongue"
Items.Nagazm.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.4, race: Race.Snake, str: "long, serpentine tongue"});
Items.Nagazm.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Elf, str: "elongated, pointy ears"});
Items.Nagazm.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Slit});
Items.Nagazm.PushEffect(TF.ItemEffects.IncLib, {odds: 0.5, ideal: 40, max: 1});
Items.Nagazm.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 40, max: 1});
Items.Nagazm.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
Items.Nagazm.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
Items.Nagazm.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 20, max: 1});
Items.Nagazm.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 20, max: 1});
Items.Nagazm.PushEffect(TF.ItemEffects.IncFem, {odds: 0.3, ideal: .9, max: .1});
Items.Nagazm.PushEffect(TF.ItemEffects.IncHips, {odds: 0.3, ideal: HipSize.VeryWide, max: 2});
Items.Nagazm.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 0.6, ideal: 26, max: 2, female: true });
Items.Nagazm.PushEffect(TF.ItemEffects.IncCockLen, {odds: 0.6, ideal: 30, max: 3 });
Items.Nagazm.PushEffect(TF.ItemEffects.IncCockThk, {odds: 0.6, ideal: 8, max: 1 });


Items.Taurico = new TFItem("taur0", "Taurico");
Items.Taurico.price = 7;
Items.Taurico.lDesc = function() { return "a bottle of Taurico"; }
Items.Taurico.Short = function() { return "A bottle of Taurico"; }
Items.Taurico.Long  = function() { return "A bottle filled with a strange, jelly-like substance. It has a picture of a centaur on it."; }
Items.Taurico.recipe = [{it: Items.HorseShoe}, {it: Items.CanisRoot}, {it: Items.Ramshorn}];
// Effects
Items.Taurico.PushEffect(function(target) {
	var parse = {
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


Items.Androgyn = new TFItem("trap0", "Androgyn");
Items.Androgyn.price = 25;
Items.Androgyn.lDesc = function() { return "a bottle of Androgyn"; }
Items.Androgyn.Short = function() { return "A bottle of Androgyn"; }
Items.Androgyn.Long  = function() { return "A bottle containing a sparkling pink fluid. It’s glowing slightly."; }
Items.Androgyn.recipe = [{it: Items.Testos}, {it: Items.Estros}, {it: Items.SpringWater}];
// Effects
Items.Androgyn.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.8, minRange: -.1, maxRange: .3, max: .3});
Items.Androgyn.PushEffect(TF.ItemEffects.DecTone, {odds: 0.8, ideal: 0, max: .3 });
Items.Androgyn.PushEffect(TF.ItemEffects.IdealHips, {odds: 0.2, ideal: HipSize.Medium-1, max: 3});
Items.Androgyn.PushEffect(TF.ItemEffects.SetIdealBreastSize, {odds: 0.6, ideal: 1, max: 5});
Items.Androgyn.PushEffect(TF.ItemEffects.DecCockLen, {odds: 0.8, ideal: 10, max: 4 });
Items.Androgyn.PushEffect(TF.ItemEffects.DecCockThk, {odds: 0.8, ideal: 3, max: 2 });
Items.Androgyn.PushEffect(TF.ItemEffects.DecBallSize, {odds: 0.8, ideal: 1, max: 4 });


Items.Gestarium = new TFItem("preg0", "Gestarium");
Items.Gestarium.price = 50;
Items.Gestarium.lDesc = function() { return "a bottle of Gestarium"; }
Items.Gestarium.Short = function() { return "A bottle of Gestarium"; }
Items.Gestarium.Long  = function() { return "A small vial of thick, clear liquid. Drinking this while pregnant will cause the drinker’s pregnancy to advance somewhat."; }
Items.Gestarium.recipe = [{it: Items.Fertilium}, {it: Items.Estros}, {it: Items.Bovia}];
// Effects
Items.Gestarium.PushEffect(function(target) {
	var parse = {
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
			
			Items.Gestarium.BellyGrowth(target, wombs, parse);
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

Items.Gestarium.BellyGrowth = function(target, wombs, parse) {
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
	if(target == player) {
		var newProgress = womb.progress;
		
		if(oldProgress < PregnancyLevel.Level2 && newProgress >= PregnancyHandler.Level2) {
			Text.NL();
			Text.Add("The growth is accompanied by a pleasant surprise: the vague queasiness that’d been plaguing you quickly vanishes, to be replaced by a warm glow of contentment. It’s faint, but you have the feeling it’ll be growing…", parse);
		}
		else if(oldProgress < PregnancyLevel.Level3 && newProgress >= PregnancyHandler.Level3) {
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
		else if(oldProgress < PregnancyLevel.Level4 && newProgress >= PregnancyHandler.Level4) {
			Text.NL();
			Text.Add("Hugging your now-bigger belly, you’re rewarded with ", parse);
			if(womb.IsEgg())
				Text.Add("a jab from within as your newly-enlarged eggs jostle for space within your settling womb. Things are getting pretty crowded in there, by the feel of things - you wait a little while for your womb to calm and adjust to its new load, then get ready to be on your way.", parse);
			else
				Text.Add("a powerful kick from within your [belly], aimed squarely at your hands. Seems like the life you’re bearing is getting quite active now, birth can’t be that far away. Well, hopefully - judging by that last kick and the squirming that’s going on inside you, you’re going to end up perpetually winded if this keeps up all the time.", parse);
		}
		else if(oldProgress < PregnancyLevel.Level5 && newProgress >= PregnancyHandler.Level5) {
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


Items.Anusol = new TFItem("anal0", "Anusol");
Items.Anusol.price = 25;
Items.Anusol.lDesc = function() { return "a bottle of Anusol"; }
Items.Anusol.Short = function() { return "A bottle of Anusol"; }
Items.Anusol.Long  = function() { return "A bottle labeled Anusol, filled with an oily-looking dark green fluid. It increases anal sensitivity."; }
Items.Anusol.recipe = [{it: Items.SnakeOil}, {it: Items.SpringWater}, {it: Items.FruitSeed}];
// Effects
Items.Anusol.PushEffect(function(target) {
	var parse = {
		botArmor : target.LowerArmorDesc(),
		Poss : target.Possessive()
	};
	parse = target.ParserTags(parse);
	
	var cum = target.OrgasmCum();
	
	if(target == player) {
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



Items.AnusolPlus = new TFItem("anal1", "Anusol+");
Items.AnusolPlus.price = 25;
Items.AnusolPlus.lDesc = function() { return "a bottle of Anusol+"; }
Items.AnusolPlus.Short = function() { return "A bottle of Anusol+"; }
Items.AnusolPlus.Long  = function() { return "A bottle labled Anusol+, filled with a thick and slimy-looking blue fluid. It’s supposed to make anal sex out of this world for the drinker."; }
Items.AnusolPlus.recipe = [{it: Items.SnakeOil}, {it: Items.SpringWater}, {it: Items.Gestarium}];
// Effects
Items.AnusolPlus.PushEffect(function(target) {
	var parse = {
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
	
	if(target == player) {
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
