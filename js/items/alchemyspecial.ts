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
import { Text } from "../text";
import { TF, TFItem } from "../tf";
import { AlchemyItems } from "./alchemy";
import { IngredientItems } from "./ingredients";

const equiniumPlus = new TFItem("equin+", "Equinium+");
equiniumPlus.price = 100;
equiniumPlus.lDesc = () => "a bottle of Equinium+";
equiniumPlus.Short = () => "A bottle of Equinium+";
equiniumPlus.Long = () => "A bottle of Equinium, potent enough to significantly change your body. The fluid inside is creamy, smelling of male musk.";
// TODO recipe
equiniumPlus.recipe = [{it: AlchemyItems.Equinium, num: 3}, {it: IngredientItems.HorseHair}, {it: IngredientItems.HorseCum}];
// Effects
equiniumPlus.PushEffect(TF.ItemEffects.SetEars, {odds: 0.8, race: Race.Horse, str: "equine ears"});
equiniumPlus.PushEffect(TF.ItemEffects.SetTail, {odds: 0.8, race: Race.Horse, color: Color.brown, str: "a brown, bushy horse tail"});
equiniumPlus.PushEffect((target: Entity) => {
	const parse: any = {
		name: target.NameDesc(),
		s: target === GAME().player ? "" : "s",
		possessive: target.possessive(),
		Possessive: target.Possessive(),
		multiCockDesc() { return target.MultiCockDesc(); },
	};
	const cocks = target.AllCocks();
	// Create new cock
	if (cocks.length === 0) {
		const cock = new Cock(Race.Horse, Color.pink);
		cock.length.base    = 25;
		cock.thickness.base = 7;
		cocks.push(cock);
		Text.Add("[name] grow[s] a huge horsecock!", parse);
		Text.NL();
	} else if (TF.SetRaceAll(cocks, Race.Horse)) {
		if (cocks.length > 1) {
			Text.Add("All of [possessive] cocks turn into horsecocks!", parse);
		} else {
			Text.Add("[Possessive] cock turns into a horsecock!", parse);
		}
		Text.NL();
	}
	let len = false;
	let thk = false;
	for (const cock of cocks) {
		// Base size
		let inc  = cock.length.IncreaseStat(25, 100);
		let inc2 = cock.thickness.IncreaseStat(7, 100);
		if (inc === null) {
			inc = cock.length.IncreaseStat(50, 5);
		}
		if (inc2 === null) {
			inc2 = cock.thickness.IncreaseStat(12, 1);
		}
		len = len || (inc > 0);
		thk = thk || (inc2 > 0);
	}
	if (len || thk) {
		parse.s    = target.NumCocks() > 1 ? "s" : "";
		parse.notS = target.NumCocks() > 1 ? "" : "s";
		Text.NL();
		Text.Add("[Possessive] [multiCockDesc] shudder[notS], the stiff dick[s] growing significantly ", parse);
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
	}
	Text.Flush();
});
equiniumPlus.PushEffect(TF.ItemEffects.SetCover, {odds: 0.8, value: Genitalia.Cover.Sheath});
equiniumPlus.PushEffect(TF.ItemEffects.SetBalls, {ideal: 2, count: 2});
equiniumPlus.PushEffect(TF.ItemEffects.IncStr, {odds: 0.4, ideal: 50, max: 3});
equiniumPlus.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 50, max: 3});
equiniumPlus.PushEffect(TF.ItemEffects.DecInt, {odds: 0.2, ideal: 20, max: 1});
equiniumPlus.PushEffect(TF.ItemEffects.DecDex, {odds: 0.2, ideal: 20, max: 1});
equiniumPlus.PushEffect(TF.ItemEffects.SetBody, {odds: 0.4, race: Race.Horse, str: "an equine shape"});
equiniumPlus.PushEffect(TF.ItemEffects.SetFace, {odds: 0.3, race: Race.Horse, str: "a horse-like face"});
equiniumPlus.PushEffect(TF.ItemEffects.SetArms, {odds: 0.3, race: Race.Horse, str: "furred equine arms"});
equiniumPlus.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Horse, str: "furred equine legs, with hooves"});
equiniumPlus.PushEffect(TF.ItemEffects.DecFem, {odds: 0.3, ideal: -1, max: .2, male: true});
equiniumPlus.PushEffect(TF.ItemEffects.IncTone, {odds: 0.3, ideal: 1, max: .1 });
equiniumPlus.PushEffect(TF.ItemEffects.DecHips, {odds: 0.2, ideal: HipSize.Medium, max: 1});

// TODO
const tigris = new TFItem("felin+0", "Tigris");
tigris.price = 100;
tigris.lDesc = () => "a bottle of Tigris";
tigris.Short = () => "A bottle of Tigris";
tigris.Long = () => "A bottle labeled Tigris, with the picture of a large cat on it. The fluid within is a strange mixture of black and orange.";
// TODO ingredients
tigris.recipe = [{it: AlchemyItems.Felinix}, {it: IngredientItems.HairBall}, {it: IngredientItems.CatClaw}];
// Effects
tigris.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.4, race: Race.Feline, str: "rough, cat-like tongue"});
tigris.PushEffect(TF.ItemEffects.SetBody, {odds: 0.4, race: Race.Tiger, str: "a feline shape, complete with fur"});
tigris.PushEffect(TF.ItemEffects.SetFace, {odds: 0.3, race: Race.Tiger, str: "a cat-like face"});
tigris.PushEffect(TF.ItemEffects.SetArms, {odds: 0.3, race: Race.Tiger, str: "furred cat arms, with soft paws"});
tigris.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.3, race: Race.Tiger, str: "furred cat legs, with soft paws"});
tigris.PushEffect(TF.ItemEffects.SetCock, {odds: 0.6, race: Race.Tiger, str: "a feline cock"});
tigris.PushEffect(TF.ItemEffects.SetEars, {odds: 0.6, race: Race.Tiger, str: "fluffy cat ears"});
tigris.PushEffect(TF.ItemEffects.SetTail, {odds: 0.6, race: Race.Tiger, color: Color.orange, str: "a striped, flexible feline tail"});
tigris.PushEffect(TF.ItemEffects.IncDex, {odds: 0.3, ideal: 35, max: 2});
tigris.PushEffect(TF.ItemEffects.IncStr, {odds: 0.5, ideal: 45, max: 2});
tigris.PushEffect(TF.ItemEffects.IncCha, {odds: 0.3, ideal: 25, max: 2});
tigris.PushEffect(TF.ItemEffects.IncSta, {odds: 0.2, ideal: 40, max: 2});
tigris.PushEffect(TF.ItemEffects.DecInt, {odds: 0.1, ideal: 25, max: 1});
tigris.PushEffect(TF.ItemEffects.DecFem, {odds: 0.2, ideal: -.7, max: .1, male: true});
tigris.PushEffect(TF.ItemEffects.IncTone, {odds: 0.2, ideal: .9, max: .1 });
tigris.PushEffect(TF.ItemEffects.DecHips, {odds: 0.3, ideal: HipSize.Medium, max: 1});
tigris.PushEffect(TF.ItemEffects.IncCockLen, {odds: 0.4, ideal: 25, max: 2 });
tigris.PushEffect(TF.ItemEffects.IncCockThk, {odds: 0.4, ideal: 6, max: 1 });

const infernumPlus = new TFItem("demon+", "Infernum+");
infernumPlus.price = 100;
infernumPlus.lDesc = () => "a bottle of Infernum+";
infernumPlus.Short = () => "A bottle of Infernum+";
infernumPlus.Long = () => "A bottle of extra potent Infernum, with the picture of a large, decidedly male demon on it. The fluid within is a thick black sludge, reeking of corruption.";
infernumPlus.recipe = [{it: AlchemyItems.Infernum}, {it: IngredientItems.BlackGem}, {it: IngredientItems.DemonSeed, num: 3}];
// Effects
infernumPlus.PushEffect((target: Entity) => {
	const parse: any = {
		name: target.NameDesc(),
		s: target === GAME().player ? "" : "s",
		possessive: target.possessive(),
		Possessive: target.Possessive(),
		multiCockDesc() { return target.MultiCockDesc(); },
	};
	const cocks = target.AllCocks();
	// Create new cock
	if (Math.random() < 0.5 && target.NumCocks() < 5) {
		const cock = new Cock(Race.Demon, Color.red);
		cock.length.base    = 20;
		cock.thickness.base = 4;
		cocks.push(cock);
		Text.Add("[name] grow[s] a demonic cock!", parse);
		Text.NL();
	} else if (cocks.length > 0 && TF.SetRaceAll(cocks, Race.Demon)) {
		if (cocks.length > 1) {
			Text.Add("All of [possessive] cocks turn into demonic cocks!", parse);
		} else {
			Text.Add("[Possessive] cock turns into a demonic cock!", parse);
		}
		Text.NL();
	}
	if (cocks.length > 0) {
		let size = false;
		for (const cock of cocks) {
			// Base size
			let inc  = cock.length.IncreaseStat(20, 100);
			let inc2 = cock.thickness.IncreaseStat(4, 100);
			if (inc === null) {
				inc  = cock.length.IncreaseStat(30, 2);
			}
			if (inc2 === null) {
				inc2 = cock.thickness.IncreaseStat(6, 1);
			}
			if (inc || inc2) { size = true; }
		}
		if (size) {
			parse.s    = target.NumCocks() > 1 ? "s" : "";
			parse.notS = target.NumCocks() > 1 ? "" : "s";
			Text.NL();
			Text.Add("[Possessive] [multiCockDesc] shudder[notS], the stiff dick[s] growing significantly longer and thicker.", parse);
		}
	}
	Text.Flush();
});
infernumPlus.PushEffect(TF.ItemEffects.SetBody, {odds: 0.3, race: Race.Demon, color: Color.red, str: "a fully demonic form"});
infernumPlus.PushEffect(TF.ItemEffects.SetLegs, {odds: 0.5, race: Race.Demon, color: Color.red, str: "plantigrade, demonic legs with clawed feet"});
infernumPlus.PushEffect(TF.ItemEffects.SetArms, {odds: 0.5, race: Race.Demon, color: Color.red, str: "demonic arms with clawed hands"});
infernumPlus.PushEffect(TF.ItemEffects.SetTail, {odds: 0.6, race: Race.Demon, color: Color.red, str: "a red, spaded demon tail"});
infernumPlus.PushEffect(TF.ItemEffects.SetHorn, {odds: 0.6, race: Race.Demon, color: Color.red, count: 4, str: "a pair of demon horns" });
infernumPlus.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.6, race: Race.Demon, str: "long and flexible tongue"});
infernumPlus.PushEffect(TF.ItemEffects.IncSta, {odds: 0.4, ideal: 35, max: 2});
infernumPlus.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 35, max: 2});
infernumPlus.PushEffect(TF.ItemEffects.IncInt, {odds: 0.4, ideal: 40, max: 2});
infernumPlus.PushEffect(TF.ItemEffects.IncLib, {odds: 0.8, ideal: 55, max: 2});
infernumPlus.PushEffect(TF.ItemEffects.IncFem, {odds: 0.2, ideal: 1, max: .25, female: true});
infernumPlus.PushEffect(TF.ItemEffects.DecFem, {odds: 0.2, ideal: -1, max: .25, male: true});

const nagazm = new TFItem("naga0", "Nagazm");
nagazm.price = 7;
nagazm.lDesc = () => "a bottle of Nagazm";
nagazm.Short = () => "A bottle of Nagazm";
nagazm.Long  = () => "A bottle with a pink, bubbly liquid, labeled Nagasm. It has the picture of a snake on it.";
nagazm.recipe = [{it: IngredientItems.SnakeOil}, {it: IngredientItems.SnakeFang}, {it: IngredientItems.SnakeSkin}];
// Effects
nagazm.PushEffect((target: Entity) => {
	const parse: any = {
		Poss : target.Possessive(),
		legsDesc() { return target.LegsDesc(); },
		s : target.body.legs.count > 1 ? "" : "s",
	};

	if (Math.random() < 0.4) {
		if (target.body.legs.count !== 0 && target.body.legs.race !== Race.Snake) {
			TF.ItemEffects.RemTail(target, {count: -1});

			Text.Add("[Poss] [legsDesc] turn[s] into a long serpentine tail!", parse);
			Text.NL();

			target.body.legs.count = 0;
			target.body.legs.race  = Race.Snake;
		}
	}
	Text.Flush();
});
nagazm.PushEffect(TF.ItemEffects.RemBalls, {odds: 0.5, ideal: 0, count: 2});
nagazm.PushEffect((target: Entity) => {
	const parse: any = { Name: target.NameDesc(), s: target.plural() ? "" : "s" };

	if (Math.random() < 0.5) {
		const vags  = target.AllVags();
		const cocks = target.AllCocks();
		if (vags.length < 1 && !target.HasBalls()) {
			vags.push(new Vagina());
			parse.vag = vags[0].Short();
			Text.Add("[Name] grow[s] a brand new [vag]!", parse);
			Text.NL();
		} else if (cocks.length < 1) {
			cocks.push(new Cock());
			parse.cock = cocks[0].Short();
			Text.Add("[Name] grow[s] a brand new [cock]!", parse);
			Text.NL();
		}
	}
	Text.Flush();
});
nagazm.PushEffect((target: Entity) => {
	// TODO: Race check like in Lacertium? What race are Naga penises?
	// TODO: Other prerequisites? No testicles? Hermaphroditism?
	const cocks = target.AllCocks();
	if (cocks.length === 1 && Math.random() < 0.1) {
		const parse: any = { Poss: target.Possessive(), cockDesc: cocks[0].Short()};
		cocks.push(cocks[0].Clone());
		Text.Add("[Poss] [cockDesc] splits in two identical dicks!", parse);
		Text.NL();
		Text.Flush();
	}
});
// TODO: Naga eyes? From descr in scenes: "faintly glowing" "vivid, angular magenta eyes"
// TODO: Snake tongue? "a long, forked tongue"
nagazm.PushEffect(TF.ItemEffects.SetTongue, {odds: 0.4, race: Race.Snake, str: "long, serpentine tongue"});
nagazm.PushEffect(TF.ItemEffects.SetEars, {odds: 0.4, race: Race.Elf, str: "elongated, pointy ears"});
nagazm.PushEffect(TF.ItemEffects.SetCover, {odds: 0.4, value: Genitalia.Cover.Slit});
nagazm.PushEffect(TF.ItemEffects.IncLib, {odds: 0.5, ideal: 40, max: 1});
nagazm.PushEffect(TF.ItemEffects.IncCha, {odds: 0.4, ideal: 40, max: 1});
nagazm.PushEffect(TF.ItemEffects.IncDex, {odds: 0.4, ideal: 30, max: 1});
nagazm.PushEffect(TF.ItemEffects.IncSpi, {odds: 0.4, ideal: 30, max: 1});
nagazm.PushEffect(TF.ItemEffects.DecStr, {odds: 0.2, ideal: 20, max: 1});
nagazm.PushEffect(TF.ItemEffects.DecSta, {odds: 0.2, ideal: 20, max: 1});
nagazm.PushEffect(TF.ItemEffects.IncFem, {odds: 0.3, ideal: .9, max: .1});
nagazm.PushEffect(TF.ItemEffects.IncHips, {odds: 0.3, ideal: HipSize.VeryWide, max: 2});
nagazm.PushEffect(TF.ItemEffects.IncBreastSize, {odds: 0.6, ideal: 26, max: 2, female: true });
nagazm.PushEffect(TF.ItemEffects.IncCockLen, {odds: 0.6, ideal: 30, max: 3 });
nagazm.PushEffect(TF.ItemEffects.IncCockThk, {odds: 0.6, ideal: 8, max: 1 });

const taurico = new TFItem("taur0", "Taurico");
taurico.price = 7;
taurico.lDesc = () => "a bottle of Taurico";
taurico.Short = () => "A bottle of Taurico";
taurico.Long  = () => "A bottle filled with a strange, jelly-like substance. It has a picture of a centaur on it.";
taurico.recipe = [{it: IngredientItems.HorseShoe}, {it: IngredientItems.CanisRoot}, {it: IngredientItems.Ramshorn}];
// Effects
taurico.PushEffect((target: Entity) => {
	const parse: any = {
		Poss : target.Possessive(),
		legsDesc() { return target.LegsDesc(); },
		race() { return target.body.legs.race.qShort(); },
		s : target.body.legs.count > 1 ? "" : "s",
	};

	if (Math.random() < 1.0) { // TODO
		if (target.body.legs.count <= 4) {
			target.body.legs.count = 4;

			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				target.body.legs.race = Race.Horse;
			}, 2.0, () => true);
			scenes.AddEnc(() => {
				target.body.legs.race = Race.Wolf;
			}, 1.0, () => true);
			scenes.AddEnc(() => {
				target.body.legs.race = Race.Sheep;
			}, 1.0, () => true);
			scenes.Get();

			Text.Add("[Poss] lower body morphs until it has four [race] legs!", parse);
		}
	}
	Text.Flush();
});

const androgyn = new TFItem("trap0", "Androgyn");
androgyn.price = 25;
androgyn.lDesc = () => "a bottle of Androgyn";
androgyn.Short = () => "A bottle of Androgyn";
androgyn.Long  = () => "A bottle containing a sparkling pink fluid. It’s glowing slightly.";
androgyn.recipe = [{it: AlchemyItems.Testos}, {it: AlchemyItems.Estros}, {it: IngredientItems.SpringWater}];
// Effects
androgyn.PushEffect(TF.ItemEffects.IdealFem, {odds: 0.8, minRange: -.1, maxRange: .3, max: .3});
androgyn.PushEffect(TF.ItemEffects.DecTone, {odds: 0.8, ideal: 0, max: .3 });
androgyn.PushEffect(TF.ItemEffects.IdealHips, {odds: 0.2, ideal: HipSize.Medium - 1, max: 3});
androgyn.PushEffect(TF.ItemEffects.SetIdealBreastSize, {odds: 0.6, ideal: 1, max: 5});
androgyn.PushEffect(TF.ItemEffects.DecCockLen, {odds: 0.8, ideal: 10, max: 4 });
androgyn.PushEffect(TF.ItemEffects.DecCockThk, {odds: 0.8, ideal: 3, max: 2 });
androgyn.PushEffect(TF.ItemEffects.DecBallSize, {odds: 0.8, ideal: 1, max: 4 });

const anusol = new TFItem("anal0", "Anusol");
anusol.price = 25;
anusol.lDesc = () => "a bottle of Anusol";
anusol.Short = () => "A bottle of Anusol";
anusol.Long  = () => "A bottle labeled Anusol, filled with an oily-looking dark green fluid. It increases anal sensitivity.";
anusol.recipe = [{it: IngredientItems.SnakeOil}, {it: IngredientItems.SpringWater}, {it: IngredientItems.FruitSeed}];
// Effects
anusol.PushEffect((target: Entity) => {
	let parse: any = {
		botArmor : target.LowerArmorDesc(),
		Poss : target.Possessive(),
	};
	parse = target.ParserTags(parse);

	const cum = target.OrgasmCum();

	if (target === GAME().player) {
		Text.Add("You raise the bottle to your lips and tip the contents down your throat. The oily green elixir disappears smoothly enough, leaving behind a somewhat greasy aftertaste and a lingering taste of sweetness.", parse);
		Text.NL();
		Text.Add("A quivering sensation erupts from your [anus], and you moan despite yourself, feeling your pucker wrinkle and flex as if it were being stretched by some ethereal phallus.", parse);

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("You can feel yourself stretching wider than ever before, and with an ease you previously lacked. You just know that your ass can take bigger insertions now than it could before.", parse);

			target.Butt().capacity.IncreaseStat(10, 1);
		}, 1.0, () => target.Butt().capacity.Get() < 10);
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("Around it, you can feel your butt beginning to grow, swelling out slightly. You now have a [butt]!", parse);

			target.Butt().buttSize.IncreaseStat(10, 1);
		}, 1.0, () => target.Butt().Size() < 10);
		scenes.Get();

		Text.NL();
		Text.Add("The sensation just keeps growing stronger and stronger, pleasure washing over your whole body as your [anus] is stimulated without mercy.", parse);
		if (target.FirstCock()) {
			Text.Add(" Your [cocks] grows painfully erect, stiff and throbbing within your [botArmor] as your prostate is twitched and rolled by the magic washing through your body.", parse);
		}
		if (target.FirstVag()) {
			Text.Add(" Your [vag] starts to water in sympathy, drooling fluids down your [legs] as the pleasure sets it flowing.", parse);
		}
		Text.NL();
		Text.Add("Eventually, the sensations grow beyond your ability to resist. Your whole body quakes and you cry out as climax washes through you, barely able to keep from falling over at the sharpness of your pleasure. When it flows away, you are left panting for breath, your [botArmor] stained with your juices.", parse);
	} else {
		parse.name = target.name;
		parse = target.ParserPronouns(parse);

		Text.Add("[name] drinks down the oily elixir with a slight grimace, flicking [hisher] tongue at the aftertaste. [HeShe] pauses for a second, eyes narrowing in surprise, only to then widen in shock. [HeShe] lets out a startled gasp, nearly pitching [himher]self into your arms, and then [heshe] moans, arching [hisher] back.", parse);
		Text.NL();
		parse.c = target.FirstCock() ? Text.Parse(", [hisher] own [cocks] growing visibly erect from the stimulation", parse) : "";
		Text.Add("[HisHer] [butt] starts to thrust and shake, as if grinding back against some ethereal cock[c]. Faster and faster [heshe] goes, picking up the pace, whimpering in abstract pleasure.", parse);
		Text.NL();
		Text.Add("After a few moments of this show, [heshe] cries out, arching [hisher] back as [heshe] visibly climaxes, staining [hisher] [botArmor] and the ground beneath with sexual fluids. Eventually, [heshe] runs dry and shudders to a stop, panting for breath.", parse);
		Text.NL();

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("[Poss] butt swells out, gaining a bit in size.", parse);
			target.Butt().buttSize.IncreaseStat(10, 1);
		}, 1.0, () => target.Butt().Size() < 10);
		scenes.AddEnc(() => {
			Text.Add("Curious to see if it worked, you approach [name] and pull [hisher] [botArmor] aside, reaching in with your hand to examine [hisher] [anus].", parse);
			Text.NL();
			Text.Add("Your probing touch reveals that [hisher] ass is much stretchier than it was before. It looks like the potion has increased [name]’s anal capacity.", parse);
			target.Butt().capacity.IncreaseStat(10, 1);
		}, 1.0, () => target.Butt().capacity.Get() < 10);

		scenes.Get();
	}
});

const anusolPlus = new TFItem("anal1", "Anusol+");
anusolPlus.price = 25;
anusolPlus.lDesc = () => "a bottle of Anusol+";
anusolPlus.Short = () => "A bottle of Anusol+";
anusolPlus.Long  = () => "A bottle labled Anusol+, filled with a thick and slimy-looking blue fluid. It’s supposed to make anal sex out of this world for the drinker.";
anusolPlus.recipe = [{it: IngredientItems.SnakeOil}, {it: IngredientItems.SpringWater}, {it: AlchemyItems.Gestarium}];
// Effects
anusolPlus.PushEffect((target: Entity) => {
	let parse: any = {
		botArmor : target.LowerArmorDesc(),
		Poss : target.Possessive(),
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
	const mpreg = target.pregHandler.MPregEnabled();

	if (target === GAME().player) {
		Text.Add("The potion is just as thick and slimy as it looks; it flows down your throat like drinking blue custard, practically thick enough to chew. But you persist and eventually the last drop disappears down your gullet. With a sigh of relief, you wipe your lips, feeling a tingling in your belly.", parse);
		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("Prickling erupts in your [anus], and you moan unthinkingly at the sensation. Your anus flexes and clenches uncontrollably, as if stretching to wrap itself around some phantasmal phallus. You can feel yourself stretching wider, and wider, a sensation that isn’t painful as you’d expect. When the prickling fades away, the stretched feeling remains, and you just know you’re more elastic now.", parse);
			target.Butt().capacity.IncreaseStat(15, 3);
		}, 1.0, () => target.Butt().capacity.Get() < 15);
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("Your butt swells out, gaining a bit in size.", parse);
			target.Butt().buttSize.IncreaseStat(15, 3);
		}, 1.0, () => target.Butt().buttSize.Get() < 15);
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("A strange warmth suddenly blossoms in the pit of your stomach. Instinctively, you wrap your hands around your belly, feeling the warmth growing hotter with each breath. A strange bloating sensation fills you, but it’s not entirely unpleasant... in fact, when it fades away as suddenly as it appeared, you find yourself idly wishing for its return.", parse);
			target.pregHandler.mpreg = true;
		}, 1.0, () => !mpreg);
		scenes.Get();
	} else {
		parse.name = target.name;
		parse = target.ParserPronouns(parse);

		Text.Add("[name] takes the vial and chugs it down, visibly struggling to swallow the near-gelatinous potion. When [heshe] is done, [heshe] wipes [hisher] mouth with a grimace.", parse);
		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("[name] groans suddenly, hands flying back to clap over [hisher] [butt], shaking [hisher] hips and thrusting backwards as if responding to the thrusts of some ethereal lover.", parse);
			target.Butt().capacity.IncreaseStat(15, 3);
		}, 1.0, () => target.Butt().capacity.Get() < 15);
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("[Poss] butt swells out, gaining a bit in size.", parse);
			target.Butt().buttSize.IncreaseStat(15, 3);
		}, 1.0, () => target.Butt().buttSize.Get() < 15);
		scenes.AddEnc(() => {
			Text.NL();
			Text.Add("[name] groans, deep and longing, [hisher] arms wrapping themselves protectively around [hisher] stomach, hands brushing protectively over [hisher] belly.", parse);
			target.pregHandler.mpreg = true;
		}, 1.0, () => !mpreg);
		scenes.Get();
	}
});

export namespace AlchemySpecial {
	export const EquiniumPlus = equiniumPlus;
	export const Tigris = tigris;
	export const InfernumPlus = infernumPlus;
	export const Nagazm = nagazm;
	export const Taurico = taurico;
	export const Androgyn = androgyn;
	export const Anusol = anusol;
	export const AnusolPlus = anusolPlus;
}
