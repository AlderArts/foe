/*
 *
 * Mothgirl, lvl 4-6
 *
 */

import { Entity } from '../entity';
import { Images } from '../assets';
import { Element } from '../ability';
import { Color } from '../body/color';
import { TF } from '../tf';
import { AppendageType } from '../body/appendage';
import { Race } from '../body/race';
import { AlchemyItems } from '../items/alchemy';
import { IngredientItems } from '../items/ingredients';
import { Text } from '../text';
import { Abilities } from '../abilities';
import { Party } from '../party';
import { Encounter } from '../combat';
import { Gui } from '../gui';
import { SetGameState, GameState } from '../gamestate';

let MothgirlScenes = {};

function Mothgirl() {
	Entity.call(this);
	this.ID = "lusina";

	this.avatar.combat     = Images.mothgirl;
	this.name              = "Mothgirl";
	this.monsterName       = "the mothgirl";
	this.MonsterName       = "The mothgirl";
	this.body.DefFemale();

	this.FirstVag().virgin = false;
	this.Butt().virgin     = false;

	this.maxHp.base        = 120;
	this.maxSp.base        = 40;
	this.maxLust.base      = 45;
	// Main stats
	this.strength.base     = 15;
	this.stamina.base      = 14;
	this.dexterity.base    = 25;
	this.intelligence.base = 18;
	this.spirit.base       = 13;
	this.libido.base       = 20;
	this.charisma.base     = 20;

	this.elementDef.dmg[Element.mEarth]   =  0.5;
	this.elementDef.dmg[Element.mFire]    = -0.5;
	this.elementDef.dmg[Element.mThunder] = -0.5;
	this.elementDef.dmg[Element.mWind]    =  0.5;

	this.level             = 4 + Math.floor(Math.random() * 4);
	this.sexlevel          = 3;

	this.combatExp         = 5 + this.level;
	this.coinDrop          = 2 + this.level * 4;

	this.body.SetBodyColor(Color.white);

	this.body.SetEyeColor(Color.red);

	TF.SetAppendage(this.Back(), AppendageType.wing, Race.Moth, Color.purple);
	TF.SetAppendage(this.Appendages(), AppendageType.antenna, Race.Moth, Color.purple);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Mothgirl.prototype = new Entity();
Mothgirl.prototype.constructor = Mothgirl;

Mothgirl.Flags = {
	Met : 1,
	Sexed : 2
};

Mothgirl.Met = function() {
	return gameCache.flags["Moth"] & Mothgirl.Flags.Met;
}

Mothgirl.Sexed = function() {
	return gameCache.flags["Moth"] & Mothgirl.Flags.Sexed;
}

Mothgirl.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: AlchemyItems.Lepida });
	if(Math.random() < 0.5)  drops.push({ it: IngredientItems.MDust });
	if(Math.random() < 0.5)  drops.push({ it: IngredientItems.FruitSeed });
	if(Math.random() < 0.5)  drops.push({ it: IngredientItems.MFluff });

	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.Hummus });
	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.SpringWater });
	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.Letter });
	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.FreshGrass });
	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.RawHoney });
	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.BeeChitin });

	if(Math.random() < 0.05) drops.push({ it: IngredientItems.FoxBerries });
	if(Math.random() < 0.05) drops.push({ it: IngredientItems.Foxglove });
	if(Math.random() < 0.05) drops.push({ it: IngredientItems.Wolfsbane });
	if(Math.random() < 0.05) drops.push({ it: IngredientItems.Trinket });
	if(Math.random() < 0.05) drops.push({ it: IngredientItems.FlowerPetal });
	if(Math.random() < 0.05) drops.push({ it: IngredientItems.Lettuce });

	if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Avia });
	if(Math.random() < 0.02) drops.push({ it: IngredientItems.HoneyBrew });
	return drops;
}

Mothgirl.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.name + " acts! Bounce bounce!");
	Text.NL();

	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.5)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.7 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.Pierce.Use(encounter, this, t);
	else if(choice < 0.9 && Abilities.Seduction.Distract.enabledCondition(encounter, this))
		Abilities.Seduction.Distract.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}

MothgirlScenes.LoneEnc = function() {
	var enemy = new Party();
	var moth = new Mothgirl();
	enemy.AddMember(moth);
	var enc = new Encounter(enemy);
	enc.moth = moth;

	enc.coin = Math.max(Math.floor(party.coin * 0.1), 100);

	var parse = {
		legs   : function() { return player.LegsDesc(); },
		weapon : function() { return player.WeaponDesc(); },
		armor  : function() { return player.ArmorDesc(); },
		fem    : player.mfFem("handsome", "sweetheart"),
		coin   : Text.NumToText(enc.coin),
		breasts : function() { return player.FirstBreastRow().Short(); },
		cocks  : function() { return player.MultiCockDesc(); }
	};

	enc.onEncounter = function() {
		Text.Clear();
		if(!Mothgirl.Met()) {
			Text.Add("As you make your way through the overgrown forest, you start to hear a faint… buzzing? You look around for the source of the strange noise, clutching your [weapon] tight as the alien sound grows louder and louder, coming from seemingly all around you. You back up, still scanning your surroundings for a threat. Suddenly, the world is spinning. You give a helpless cry as you tumble to the ground, foot caught on a thick root. With a grunt, you flop onto your backside, staring wide-eyed into the treetops.", parse);
			Text.NL();
			Text.Add("There it is! A swirling mass of white - fluffy like a cloud - is circling you from on high, carried aloft on a set of brilliant pink wings. They look so delicate and translucent that they look like they'd be more at home on a butterfly than… whatever this is. It's human sized and fast, buzzing around too quickly for you to get a good look at it - at least until it dive-bombs you. You twist and roll, tucking your [legs] up as you tumble out of the creature's way. You jump up, readying your [weapon] as the creature banks and flies back around, executing a roll of its own before coming to a stop a few paces from you, hovering just above the ground.", parse);
			Text.NL();
			Text.Add("Now that it's stopped, you can finally get a good look at her. And what a her it is! A curvy woman flutters before you, human at first glance, save for the delicate pink wings beating behind her. Her limbs and the collar of her neck are covered in a downy white fuzz, however, as thick as wool by the looks of it. Beyond the whiteness, she's half bare: a pair of leather breeches clings tightly to her long legs, armored with hardened leather half-greaves, and crossing chains of gold coins and gemstones hang from her belt, dangling between her legs.", parse);
			Text.NL();
			Text.Add("Conversely, her large breasts and belly are uncovered, with F-cup tits proudly on display. They sway hypnotically as she hovers, occasionally giving a glimpse of a glittering pink amulet tucked between her hefty mounds, held aloft by a slim silver chain. Her fiery red eyes lock with yours, and with all your willpower you drag your gaze from the buxom body on display to the imposing two-handed sword she's leveled at you.", parse);
			Text.NL();
			Text.Add("<i>“Wh-what do you-”</i> you start to say, but are cut off as the moth-like girl flicks her sword dangerously.", parse);
			Text.NL();
			Text.Add("<i>“Don't make this hard, [fem],”</i> she says, indicating the coin pouch hanging on your belt. <i>“Stand and deliver! You're going to hand them over whether you want to or not.”</i>", parse);
			Text.NL();
			Text.Add("Are… are you seriously getting mugged? For fuck's sake! Well, what are you going to do: give her some coin, fight her, or try and bargain for a… different kind of payment?", parse);
		}
		else {
			Text.Add("As you make your way through the overgrown forest, you start to hear a faint… buzzing. You clutch your [weapon] as the moth-girl thief wings down from the treetops, brandishing her long blade. She stops a few paces from you, hovering just off the ground with breasts swaying hypnotically, wings beating blindingly fast. <i>“Back again, [fem]? Tsk. Well, you know this song and dance; toss your coins on over, if you please! Or maybe you've got something... else... worth my time?”</i>", parse);
		}
		Text.Flush();

		gameCache.flags["Moth"] |= Mothgirl.Flags.Met;

		//[Fight] [Give Money] [Trade Sex]
		var options = new Array();
		options.push({ nameStr : "Fight Her",
			func : function() {
				enc.coin = Math.min(party.coin, enc.coin);

				Text.Clear();
				Text.Add("You ready yourself for combat! The moth-girl sighs and swings her claymore into a defensive stance, saying: <i>“Tsk, you just have to do it the hard way, don't you? Oh, well… on guard!”</i>", parse);
				Text.Flush();

				// Start combat
				Gui.NextPrompt(function() {
					enc.PrepCombat();
				});
			}, enabled : true,
			tooltip : "Time to teach this fluffy slut who's boss!"
		});
		options.push({ nameStr : "Give Money",
			func : function() {
				Text.Clear();
				if(party.InParty(terry)) {
					parse = terry.ParserPronouns(parse);
					Text.Add("<i>”What? You’re just going to surrender to her!?”</i> Terry protests in indignation.", parse);
					Text.NL();
					Text.Add("You simply look at [himher] with disdain.", parse);
					Text.NL();
					Text.Add("[HeShe] sighs. <i>”Whatever... you’re the boss,”</i> [heshe] shrugs.", parse);
					Text.NL();

					terry.relation.DecreaseStat(30, -1);
				}
				Text.Add("<i>“Sure, whatever. Take it!”</i> you say, taking one of your coin pouches and tossing [coin] coins her way. She nimbly catches her ill-gotten gains, hooking the pouch onto her golden belt with a self-satisfied smile.", parse);
				Text.NL();
				Text.Add("<i>“There now, that wasn't so bad, was it?”</i> she teases, patting her big hip now laden with your coin. ", parse);
				if(Mothgirl.Sexed())
					Text.Add("Lowering her sword, the thief sashays up to you, gently batting your own [weapon] aside as she plants a surprisingly affectionate kiss on your cheek. <i>“Thanks for the donation, [fem]. Maybe bring me something nice next time, instead? Of course, I can see something I want right here,”</i> she teases, bare breasts pressing against your chest, her hand wandering down to grope your crotch. You try to grab her, but the moth-girl nimbly pirouettes out of your reach and takes wing, leaving you with a sultry wink and a long view of her pant-straining ass as she flies off. What a minx.", parse);
				else
					Text.Add("With a wink, she takes wing, calling back over her shoulder <i>“See you around, [fem]!”</i>", parse);
				Text.NL();
				Text.Add("<b>The mothgirl stole [coin] coins from you.</b>", parse);
				Text.Flush();

				party.coin -= enc.coin;

				TimeStep({minute: 30});

				Gui.NextPrompt();
			}, enabled : party.coin >= enc.coin,
			tooltip : Text.Parse("No need for violence… just take my money! Give her [coin] coins.", parse)
		});
		options.push({ nameStr : "Trade Sex",
			func : function() {
				Text.Clear();

				parse["admitLie"] = party.coin < enc.coin ? "admit" : "lie";
				parse["flaccidBurgeoning"] = party.coin < enc.coin ? "flaccid" : "burgeoning";

				Text.Add("<i>“I don't have any money on me!”</i> you [admitLie], lowering your [weapon] to draw her eye from your [flaccidBurgeoning] coin purse. You twist your lips into a sly grin, dropping your [weapon] and your [armor] in one swift stroke. <i>“Perhaps we can still make a deal…”</i>", parse);
				Text.NL();
				var gen = "";
				if(player.FirstCock())
					gen += "the bulge at your crotch";
				if(player.FirstCock() && player.FirstVag())
					gen += player.FirstBreastRow().Size() > 3 ? ", " : " and ";
				if(player.FirstVag())
					gen += "your sodden gash";
				if(player.FirstBreastRow().Size() > 3)
					gen += " and your [breasts]";
				parse["gen"] = Text.Parse(gen, parse);
				Text.Add("The moth-girl thief considers your offer for a moment, eyes hungrily scouring your bared body, lingering on [gen]. By the way her big, pink nipples start to stiffen, she obviously likes what she sees. The moth-girl sheathes her blade, licking her lips as you approach. <i>“Well, aren't you the eager one? Tsk, well, if I can't get any coin out of you... I might as well get a good fuck out of it.”</i>", parse);
				Text.NL();

				TimeStep({minute: 10});

				MothgirlScenes.Loss(enc, true);
			}, enabled : true,
			tooltip : "You're not willing to give her your money, but by the way she's eyeing you, you bet she's got other things on her mind, too."
		});
		Gui.SetButtonsFromList(options, false, null);
	}

	enc.onLoss = function() {
		SetGameState(GameState.Event, Gui);

		Gui.Callstack.push(function() {
			Text.Clear();
			Text.Add("<i>“Gah!”</i> you cry, falling onto your ass. The moth-girl clicks her tongue in disappointment while grabbing your hands and disarming you.", parse);
			Text.NL();
			parse["gen"] = player.FirstCock() ? Text.Parse("[cocks]", parse) : "sodden crotch, slick with your feminine excitement";
			parse["lust"] = player.LustLevel() > 0.7 ? "you're practically begging for it" : "It's only fun when we both enjoy it";
			Text.Add("<i>“See? We could have saved all this trouble, but now, I'll just </i>take<i> what I wanted… and maybe a little something else besides. I'd hate to let a pretty piece of ass like you slip by, after all. Oh, don't look so put out… [lust],”</i> she grins, reaching down to grab your [gen], wholly aroused at seeing her huge, bare breasts so close you that could kiss them… if you weren't about to be subjected to the moth-girl's baser intentions.", parse);
			Text.NL();

			MothgirlScenes.Loss(enc);
		});

		Encounter.prototype.onLoss.call(enc);
	}
	enc.onVictory = MothgirlScenes.WinPrompt;

	return enc;
}

MothgirlScenes.WinPrompt = function() {
	var enc = this;
	var moth = enc.moth;
	SetGameState(GameState.Event, Gui);

	var cocksInAss = player.CocksThatFit(moth.Butt(), null, 5);
	var p1cock = player.BiggestCock(cocksInAss);
	var strapon = p1cock ? p1cock.isStrapon : false;

	var parse = {
		acocks : function() { return player.MultiCockDesc(cocksInAss); }
	};
	if(strapon) parse["acocks"] = "strapon";

	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("With a cry, the moth-girl tumbles to the ground, finally beaten. She tries to scramble away from you, but you easily take hold of the downy fuzz around her neck, hefting her to her feet as you decide what to do with this bold little slut…", parse);
		Text.Flush();

		var options = new Array();
		if(player.FirstCock()) {
			options.push({ nameStr : "Titfuck",
				func : function() {
					MothgirlScenes.WinTitfuck(enc);
				}, enabled : true,
				tooltip : Text.Parse("Shove[oneof] your cock[s] between those big, succulent breasts of hers!", parse)
			});
		}
		if(p1cock) {
			options.push({ nameStr : "Anal",
				func : function() {
					MothgirlScenes.WinAnal(enc, cocksInAss);
				}, enabled : cocksInAss.length > 0,
				tooltip : Text.Parse("Stick your [acocks] in her butt!", parse)
			});
		}
		if(player.FirstVag()) {
			options.push({ nameStr : "Get Oral",
				func : function() {
					MothgirlScenes.WinCunn(enc);
				}, enabled : true,
				tooltip : Text.Parse("Play with the moth's tits and make her eat your pussy!", parse)
			});
		}
		Gui.SetButtonsFromList(options, true);
	});
	Encounter.prototype.onVictory.call(enc);
}

MothgirlScenes.WinTitfuck = function(enc) {
	var p1cock = player.BiggestCock();
	var hugecock = p1cock.Len() > 20;

	var parse = {
		breasts : function() { return player.FirstBreastRow().Short(); },
		tongue  : function() { return player.TongueDesc(); },
		armor   : function() { return player.ArmorDesc(); },
		cocks   : function() { return player.MultiCockDesc(); },
		cock    : function() { return p1cock.Short(); },
		hips    : function() { return player.HipsDesc(); },
		balls   : function() { return player.BallsDesc(); }
	};

	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	Text.Clear();
	Text.Add("As you consider what to do with the brazen moth, your eyes are constantly drawn down to the full swells of her hefty F-cups, heaving with her quickening breath. Her pink teats are nice and stiff already, and she shivers excitedly as the prominent tips brush against your clothes. You grab the moth-girl's slender shoulder, pulling her tight against you, feeling her soft tits press against your [breasts]. She gives a little gasp of surprise, trying to pull back, but you hold her firmly in place, cupping one of those succulent orbs and bringing its nub to your mouth.", parse);
	Text.NL();
	Text.Add("All her resistance turns to dust when your [tongue] flicks across the pale cherry point, and you grin as she gives a pitiful squeal of pleasure. You caress her nipple with your talented tongue, lapping across the rough, hard circle of its edge before planting a sucking kiss on the inverted promontory, rolling it between your teeth with just enough pressure to make her gasp and moan. Slowly but surely, her reversed tip peeks out from its hiding spot, rising to the tip of your tongue.", parse);
	Text.NL();
	Text.Add("She's already putty in your hands, legs trembling and heart racing as you tease her buds. You let your hand snake up, squeezing and caressing her soft flesh as it travels upward. You know what you want - and if she's half as sensitive as she seems, the wanton little moth might even like it too. You take her by the shoulder, and she puts up little resistance as you push her down to her knees. You pull off your [armor], revealing the swell of your [cocks] as [itThey] flop[notS] onto her face. She recoils, trying to twist out of your grasp, but you hold her fast on her knees, cock[s] resting hot on her cheek and twitching with your mounting excitement.", parse);
	Text.NL();
	parse["num"] = player.NumCocks() > 1 ? " one of" : "";
	Text.Add("<i>“Ugh! Get [itThem] off!”</i> she cries, turning up her nose at your turgid meat. Instead, you shift your hips and push[num] your tip[s] up to kiss her thin lips. Her protestations turn to a gurgling yelp as you plunge in, ramming your rod right into her mouth. Helpless to do anything else, the moth tries to scowl at you, but the effect is utterly lost with your [cock] shoved in her face. You lace your fingers through her thick white locks, pulling her down on your dick, loving every second of her long tongue coiling and lashing in her mouth, slathering your prick with hot, sticky spit. She chokes a bit at first, but she soon masters her gag reflex, letting your rigid member glide down her throat; it looks like she's finally getting used to the idea!", parse);
	Text.NL();
	parse["c"] = hugecock ? " and convulsing throat" : "";
	Text.Add("Your body shudders with pleasure as the moth's prehensile tongue wraps around your wang, squeezing your slick schlong like a whore's practiced cunt. Pressure builds in your loins as the moth-girl milks your [cock] with her wonderful tongue[c]. As she sucks you off, you let your hands play down her largely lithe, supple frame, slipping down her slender arms to her flat belly, then up again to her big, bouncing breasts, cupping a full, fleshy orb in either hand.", parse);
	Text.NL();
	Text.Add("She gasps as you caress her sensitive titflesh, mouth squeezing your prick even harder as your fingers find their way to her hard little teats. You roll the pink tips between your thumbs and forefingers, pinching just enough to make the moth's breath catch; you take that moment to withdraw your [cock] from the warm embrace of her mouth, grinning at the sight of her drool still bridging her lips to your well-sucked member.", parse);
	Text.NL();
	Text.Add("You give the moth-girl a little push, grinning as her bountiful bust jiggles enticingly as she flops onto her back. She grabs her boobs and spreads her legs for you, making it hard to resist just ripping her pants off and slamming yourself home in her hot, tight embrace - she really wants it now! That inviting snatch is not quite what you're after, however... You straddle her big hips, pumping your shaft as you loom over the defeated moth. She turns her cheek sharply aside, but the flush of arousal on her pale flesh betrays her true lust. Placing your hands on hers, you spread her tits so that they form an inviting valley just the right size to admit the shaft of your [cock], still dripping with her saliva.", parse);
	Text.NL();
	parse["c"] = hugecock ? ", slapping her right in the chin with your huge dong" : "";
	Text.Add("It slides easily between her heaving breasts, making the little moth shudder with anticipation as the spit-slick rod glides across her bare flesh. A little gasp escapes the thief's lips as your prick comes to rest in her cleavage, and you look aside to see her slender fingers roughly squeezing and pinching her flush nipples; she's the one to squeeze her tits firmly around your cock, enveloping it in a tight, hot vice of wet boobflesh that quakes with her every bated breath. You take a brief moment to enjoy the sensation of her quivering flesh rubbing along your engorged member before you lock your fingers over the moth's and give a powerful thrust right into the underside of her boobs[c]!", parse);
	Text.NL();
	Text.Add("The moth lets out a low, husky moan as you start to thrust into her cleavage, humping away at her warm canyon. The sensation is sublime, feeling your [cock] glide through the warm embrace of her boobs, squeezing you just as good as any pussy. The moth-girl seems to enjoy it too, breathing harder as your hips slap wetly against her tits. She starts moaning louder with every thrust until you feel her hands moving beneath yours, moving her breasts to meet your hammering [hips], thrusting them back against you to redouble your pleasure and hers.", parse);
	Text.NL();
	Text.Add("She gives an almost giddy gasp as a thick pool of pre drools from the slit of your [cock] and onto her flesh - a hot drop of musky ejaculate that draws out a primal lust from the moth as the next drop lands on the tip of her long, insectile tongue. Before you know it, the moth's got the crown of your cock utterly wrapped in her tongue, sucking up every drop of pre she can get as she relentlessly titfucks you. She's moving faster and faster in a desperate fervor, practically begging for your cum. You're inclined to give her what she wants, feeling the mounting pressure in your [balls] as the lusty bug milks your cock for everything it's worth.", parse);
	Text.NL();
	Text.Add("<i>“Give it to me!”</i> the moth cries, pumping her tits feverishly along the slick shaft of your [cock], <i>“Come on already.... I want it so bad!”</i>", parse);
	Text.NL();
	Text.Add("The desperate, greedy look she gives you over her bouncing breasts is the last straw. You grit your teeth, trying not to cry out as you feel your [cock] swelling with seed, surging toward the slutty bug. She gives a little scream of surprise as the first hot, salty load shoots her straight in the face, splattering over her writhing tongue and agape lips. She coughs and tries to turn aside, but her tongue is trapped between her tits, pinning her face in the perfect angle for a full-bore facial. You slap her boobs together as hard as you can as you give your final, climactic thrusts through the crack of her cleavage, chest heaving with exertion and ecstasy as you glaze the moth-girl's face and melons with cum.", parse);
	Text.NL();

	var cum = player.OrgasmCum();

	Text.Add("<i>“Oh, Goddess,”</i> the moth-girl breathes as your last hot, sticky squirt of semen plasters on her chin.", parse);
	Text.NL();
	Text.Add("<i>“You really know how to go right for a girl's weak spot, huh?”</i> she giggles. You cock an eyebrow at the thief, seeing her grinning dumbly as her long tongue laps your spunk off the tops of her breasts, happily swallowing your load. For someone who just lost a fight, she's sure happy about it. For your part, you give the cum-hungry bug a moment to spit-shine your rod again before grabbing your gear and staggering off, leaving her to enjoy her cum-soaked afterglow.", parse);
	Text.Flush();

	player.AddSexExp(2);

	Gui.NextPrompt();
}

MothgirlScenes.WinAnal = function(enc, cocksInAss) {
	var moth = enc.moth;
	var p1cock = player.BiggestCock(cocksInAss);
	var strapon = p1cock.isStrapon;
	var hugecock = p1cock.Len() > 50;

	var parse = {
		armor : function() { return player.ArmorDesc(); },
		cocks : function() { return player.MultiCockDesc(cocksInAss); },
		cock  : function() { return p1cock.Short(); },
		knees : function() { return player.KneesDesc(); },
		hips  : function() { return player.HipsDesc(); }
	};

	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

	Text.Clear();
	Text.Add("A wicked thought crosses your mind as you survey the curvaceous little moth. She blinks at you, still stunned, until she realizes where your gaze is going. Though held firmly in your hand, she manages to shift ever so slightly to emphasize the hefty swells of her breasts and the big cherry-pink nipples almost pressing into your [armor]. You give her a teasing smile and grab one of them, running the puffy pink areola between your fingers until her inverted teat starts to peek out. The moth blushes and chews her lip, trying to hold back a gasp of pleasure as you molest her boob.", parse);
	Text.NL();
	Text.Add("Your other hand releases her, making her beat her pretty pink wings a few times as she settles on the ground. You don't doubt she could have escaped in that moment, flown off out of your grasp - but if her little whimpers of pleasure are any indication, the thought never even crossed her mind. As a reward, you let your free hand slip up, brushing along the moth's cheek up and toward one of the tall, floppy purple feelers sprouting from her brow. If you thought she was whimpering before, she redoubles the moment your fingers brush the delicate, silk-like plumes, sending shivers of ecstasy trembling down her buxom body.", parse);
	Text.NL();
	Text.Add("<i>“If that's what you wanted,”</i> your would-be captor murmurs, slipping her arms around your waist and pulling herself flush against you, <i>“we could have just skipped the rough stuff, silly...”</i>", parse);
	Text.NL();
	Text.Add("You answer wordlessly, brushing from one of her feelers to the other, silencing her with pleasure. The way you have her now, it takes just the slightest bit of pressure to push the moth down onto her knees. She makes an adorable mewling sound, and her hands slide eagerly from your waist to your crotch, playing across the front of your [armor]. It doesn't take much direction from you to get her to pull your [armor] down and ", parse);
	if(strapon)
		Text.Add("pull on your strapon, making sure it's nice and tight around your hips.", parse);
	else
		Text.Add("wrap those soft, fluff-coated fingers of hers around your [cock].", parse);
	Text.NL();
	Text.Add("Her long tongue snakes out from between her slender lips, coiling serpent-like around the first inches of your prick and bathing you in a wonderfully wet warmth. ", parse);
	if(strapon)
		Text.Add("She", parse);
	else
		Text.Add("The combined efforts of her soft fingers and lush tongue have you hard as diamonds in moments, and she", parse);
	Text.Add(" slowly draws your dong toward her mouth, wrapping her lips around its crown and sucking it in with gusto. You suppress a shiver as her exotic tongue curls and squeezes your [cock], wringing it tightly and covering it in a thick sheen of spit. Lucky her - she'll be thankful for it later!", parse);
	Text.NL();
	Text.Add("You let the moth have her fun, slathering your prick with her mouth until it's glazed from crown to base. Satisfied with her work, you pull out of her maw, and give her another gentle push, this time down onto all fours.", parse);
	Text.NL();
	Text.Add("<i>“Aw, and I was lookin' forward to a good old fashioned titfucking,”</i> the moth girl pouts. Nevertheless, she wiggles her hips as you circle around her, teasing <i>“I guess a good, hard fuck is fine too...”</i>", parse);
	Text.NL();
	Text.Add("You answer her by reaching down and grabbing a handful of her ass through her breeches - and then yanking them down, leaving her pert behind bare for your inspection. The moth-girl flashes you an eager grin over her shoulder, fluttering her wings and reaching between her legs to spread her pussy wide and inviting. You slip down onto your [knees] behind her, taking your cock in one hand and licking the tip of the other's pointer finger.", parse);
	Text.NL();
	Text.Add("<i>“Surprise!”</i> you laugh, pressing your fingertip to the tight little star of her ass and pushing in.", parse);
	Text.NL();
	Text.Add("The moth-girl lets out a startled squeal, thrashing her wings and clenching hard around your probing digit. <i>“Wr-wr-wrong,”</i> she stammers, eyes crossing and body squirming. You let her work it out, pumping your finger in and out of her hole, smearing her anal walls with saliva.", parse);
	Text.NL();
	parse["fem"] = player.mfFem("handsome", "cutie");
	Text.Add("To the victor go the spoils, you tell her. Satisfied with your preparations, you swap your digit for your dick, planting the crown of your [cock] against the still-agape hole of the moth's asshole. Given a moment to catch her breath, the defeated bandit manages to say, <i>“Gotta... gotta give a girl a little warning there, [fem]! I didn't just stab </i>you<i> in the back, you know.”</i>", parse);
	Text.NL();
	Text.Add("You suppose that's fair. You give the moth a verbal warning this time, just before rocking your [hips] forward and pushing into her waiting hole. She cries out again, this time more in pleasure than alarm, and her whole body rocks forward with the onslaught of your [cock]. Digging your hands into the moth's behind, you grit your teeth and push yourself deep into her tight anal passage. You try to not let the overwhelming sensation get the better of you - but it's so hard not to cum right then and there, milked to completion by the thief's writhing muscles. You have to take it slow for now, easing yourself into her inch by inch.", parse);
	Text.NL();

	Sex.Anal(player, moth);
	moth.FuckAnal(moth.Butt(), p1cock, 3);
	player.Fuck(p1cock, 3);

	Text.Add("Beneath you, the moth-girl grunts and groans, digging her fingers into the forest dirt. Her big breasts press into the ground, seeming to bear more of her weight than her arms on their lush curves, and her wings flick and flutter unconsciously in response to your anal invasion. A few slow thrusts later, she manages to relax herself, finally getting used to the feeling of your [cock] in her butt. The more she relaxes, the faster you move, picking up the pace until you're slamming your [hips] in the moth's plush behind, making her ass bounce to the beat of you fucking her.", parse);
	Text.NL();
	Text.Add("It isn't long before the moth-girl's grunts of discomfort give way to loud cries of pleasure. Her fingers work furiously between her legs, alternating between teasing her clit and plunging into her drooling cunt. ", parse);
	if(cocksInAss.length > 1) {
		Text.Add("You decide to have a little mercy on her, and grab[oneof2] your other cock[s2], angling it toward her gash. She makes a delighted little squeal when you slam your second member in, and her whole body goes limp with overwhelming pleasure. ", parse);

		Sex.Vaginal(player, moth);
		moth.FuckVag(moth.FirstVag(), p1cock, 2);
		player.Fuck(p1cock, 2);
	}
	Text.Add("You hammer your hips faster and faster, pounding away at her clenching hole[s] as the familiar tightness of climax takes root in your gut.", parse);
	Text.NL();
	Text.Add("With a thunderous roar of ecstasy, you sheathe yourself ", parse);
	if(hugecock)
		Text.Add("as deep into the moth-girl as you can go", parse);
	else
		Text.Add("to the hilt in the moth", parse);
	parse["c"] = strapon ? "" : " and milk out the first squirts of seed";
	Text.Add(". She clenches down hard around you, enough to push you over the edge[c].", parse);
	Text.NL();

	var cum = player.OrgasmCum();

	if(strapon)
		Text.Add("You grit your teeth and continue thrusting as you bring yourself to orgasm at the moth's expense, hammering your strapon deep into her one last time.", parse);
	else if(cocksInAss.length > 1)
		Text.Add("You blast a thick, creamy double nut deep in the moth-girl's pussy and ass at once, filling both her holes with your spooge until it's drooling out around your pistoning members.", parse);
	else
		Text.Add("You blast a thick, creamy nut deep in the moth-girl's ass, basting her bowels with cum. She squirms under your grasp, fingers digging deep into her cunt to try and reach climax herself as you pump her full of spooge.", parse);
	parse["c"] = cocksInAss.length > 1 ? "your second cock" : "her fingers";
	Text.Add(" She joins you in orgasm a moment later, spurred on by the hard fucking: pussyjuices squirt out around [c] and she chokes back a scream as she joins you in bliss.", parse);
	Text.NL();
	parse["c"] = strapon ? "" : ", smiling to yourself at the sight of semen drooling from the moth's well-used back door";
	Text.Add("<i>“That was... different,”</i> she murmurs a moment later, still breathing hard. You answer her with a slap on the ass as you withdraw yourself from her[c]. When you pop out of her, the would-be bandit rolls onto her back and lets out a contented moan, immediately shoving her fingers down into her twat. <i>“I don't think I'm gonna be able to walk for a while...”</i> ", parse);
	Text.NL();
	Text.Add("You laugh and pat her thigh before grabbing your gear and staggering off, leaving her to enjoy her cum-soaked afterglow.", parse);
	Text.Flush();

	Gui.NextPrompt();
}

MothgirlScenes.WinCunn = function(enc) {
	var moth = enc.moth;

	var parse = {
		cocks : function() { return player.MultiCockDesc(); },
		cunt  : function() { return player.FirstVag().Short(); },
		clit  : function() { return player.FirstVag().ClitShort(); },
		butt  : function() { return player.Butt().Short(); },
		armor : function() { return player.ArmorDesc(); },
		lips  : function() { return player.LipsDesc(); },
		hips  : function() { return player.HipsDesc(); },
		legs  : function() { return player.LegsDesc(); }
	};

	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	Text.Clear();
	parse["lust"] = moth.LustLevel() > 0.5 ? "lust-addled herself" : "exhausted by combat";
	Text.Add("As you consider the beaten moth's fate, your eyes are drawn inexorably toward her pink lips and the long, prehensile appendage sheathed within. The thought of a long, lashing tongue writhing inside you sends a shiver of anticipation through your body and a hot rush of excitement through your sex. Seeing the lust in your eyes, the thief tries to struggle in your grasp, but she's too [lust] to put up anything more than a token resistance; you soon have her on her knees, face just inches from your [cunt].", parse);
	Text.NL();
	Text.Add("You slowly remove your [armor], giving the moth a good look at your slavering cunt. She makes a show of trying to pull away, but as soon as you grab her head and push it between your legs, her passions stir from rebellion to eager submission. Your body quakes with pleasure as her long, thick tongue rolls out of her mouth, teasing up along the lips of your slit. Her big, red eyes look up at you, holding your gaze as the tip of her tongue flicks across your [clit], sending an electric shock of pleasure through you. Her simplest motions make you shudder with excitement, and you push her face further into your muff, smearing your lust across her nose.", parse);
	Text.NL();

	Sex.Cunnilingus(moth, player);
	moth.Fuck(null, 2);
	player.Fuck(null, 2);

	Text.Add("The moth-girl sputters as she's submerged in your juices, lips locking with your pussy's as her tongue is pushed through the tight-clenched slit of your [cunt]. The way she moves her tongue, it's like a wet, writhing tentacle spreading your vaginal walls wide, wriggling its way through the chasm of your womanhood. Biting your lip, you spread yourself out with your fingers, easing the moth's intrusion; she takes the opportunity to push in hard and fast, wrapping her tongue through to the lips of your womb, grabbing your [butt] to pull you in on her. You gasp as the moth pulls just a little too hard. Unsteady as you are, a little force is all it takes to send you toppling down atop her, rolling with the bug through the grass until the two of you come to a standstill, straddling her big hips. She stares up at you expectantly, lips pursed over the tip of her long tongue, awaiting your pleasure.", parse);
	Text.NL();
	Text.Add("A tempting thought crosses your mind. Reaching down, you plant a hand overtop both of the moth-girl's breasts, squeezing her cherry-pink nipples between thumb and forefinger until she gives a pathetic little cry, writhing underneath you. A few tender caresses have her inverted points rising to meet you, peeking out of their hiding holes eager for you to pinch and pull them. Seeing where this is going, the moth-girl puts aside her wanton lust just long enough to shimmy out of her pants, hiking them down around her knees and leaving the slick slit of her sex bare to you, eager for your ministration.", parse);
	Text.NL();
	Text.Add("You wink and lean back, pressing your [butt] into her crotch, grinding back across the slick slit of her sex as your tit-teasing excites her cunt to drool its feminine juices across your backside. Her breath catches as one of your full cheeks brushes the summit of her clit, her whole body shuddering, legs crossing defensively as you overload her brain with disparate sources of sexual bliss.", parse);
	Text.NL();
	Text.Add("You give one of her turgid teats a tug, making her gasp and leave her mouth open just long enough for you to plant a kiss on her lips, tongue wrapping with hers, tasting yourself still lingering on her buds. She moans happily, arms wrapping around you and pulling you deeper into the kiss. With every twist and tease you lavish on her boobs, the moth gives a little gasp or moan into your mouth, her long tongue thrashing between your [lips] with her mounting pleasure.", parse);
	Text.NL();
	parse["l"] = player.LowerBodyType() != LowerBodyType.Single ? Text.Parse("between your [legs]", parse) : "in your crotch";
	parse["c"] = player.FirstCock() ? Text.Parse(" and your [cocks] dragging through the channel of her cunt, so sinfully close to penetration that you can feel the steaming heat of her boiling up around your member[s]", parse) : "";
	Text.Add("Her legs wrap around your [hips], pulling your groin down to rub against hers, your pussy grinding against her own slick slit, your juices mingling in a tangled, slimy web [l][c]. You shift your hips in response to her need, grinding her pussy as you kiss and tease her, getting the moth-babe nice and ready for the main course.", parse);
	Text.NL();
	Text.Add("When you finally break the kiss, she giggles happily, <i>“If you wanted to fuck me, we could have just skipped the rough stuff, you know. I'm all for mixing business with pleasure...”</i>", parse);
	Text.NL();
	parse["c"] = player.FirstCock() ? Text.Parse(" and cock[s]", parse) : "";
	Text.Add("You answer with a wink, cupping her cheek and giving her another kiss before shifting up her body, dragging your sexes apart. She gives a sudden, despondent moan as your slit[c] part[notS] from her dripping pussy. You crawl up her prone form, straddling her shoulders and planting your eager sex back in front of the moth's face. Teasing your clit with a few eager fingers, you spread your lips wide for her review. Now nice and turned on by your zealous foreplay, the hungry slut licks her lips at the sight of your quivering quim, tongue lancing out to taste you. You shiver with delight as the long, prehensile appendage glances across your spread lips, teasing your tender flesh. Her tip darts in, piercing your hole for just an instant before slithering out, glazed with your flowing juices. The moth crooks her finger at you, bringing you down to suckle the fem-slime from her wriggling tongue.", parse);
	Text.NL();
	Text.Add("Her tongue slips back from one set of lips and down to the other, making you squirm with a shuddering delight as the shaft of her tongue slithers past your spread pussylips and into the deep channel of your sex. You bite your lip and hold on for the ride, bucking your hips back as her tongue worms in like a thick, wet tentacle, ceaselessly rubbing and caressing your most sensitive spots. Unconsciously, you feel your hands slipping back down to the moth's ample bust, cupping the full swells of her breasts and giving them a playful squeeze. Her back arches as your twist her teats, squeezing and kneading them until a bright red flush spreads through her body, her chest heaving as pleasure takes hold of her. You're not far behind her, hips bucking back against her tongue as you use it like a thick, writhing cock to get yourself off on - liberally drenching the moth's face and chest with your flowing juices as you do so.", parse);
	Text.NL();

	var cum = player.OrgasmCum();

	Text.Add("<i>“Ooooohhhhhhh,”</i> the moth-girl coos, squirming in your relentless grasp, crying out as you molest her expansive bust. As her pleasure mounts, it's as if she loses control of her tongue; the muscle goes wild inside you, thrashing about like a fire hose, fucking its way so deep inside you can feel its tip kissing the entrance of your womb. You throw your head back, thrusting your hips down hard in return and letting your body take control, mind fading in response to the pleasure of your lovemaking. The moth joins you in orgasm - or rather, boobgasm - screaming around her extended tongue as she cums, tongue ramming so far into your [cunt] that you could swear you can feel your stomach bulging in its wake.", parse);
	Text.NL();
	Text.Add("When you come to your senses, you find yourself rolled on your back beside the moth-girl, panting hard. She grins at you, <i>“You really know how to go right for a girl's weak spot, huh?”</i> she giggles. You cock an eyebrow at the thief, seeing her grinning dumbly as her long tongue laps your fem-spunk off the tops of her breasts, happily sucking up your juices. For someone who just lost a fight, she's sure happy about it. For your part, you grab your gear before staggering off, leaving her to enjoy her cum-soaked afterglow.", parse);
	Text.Flush();

	Gui.NextPrompt();
}

MothgirlScenes.Loss = function(enc, traded) {
	var moth = enc.moth;
	var p1cock = player.BiggestCock();
	traded = traded || enc.coin <= 0;

	var parse = {
		coin    : Text.NumToText(enc.coin),
		armor   : function() { return player.ArmorDesc(); },
		legs    : function() { return player.LegsDesc(); },
		feet    : function() { return player.FeetDesc(); },
		hips    : function() { return player.HipsDesc(); },
		cocks   : function() { return player.MultiCockDesc(); },
		cock    : function() { return p1cock.Short(); },
		cockTip : function() { return p1cock.TipShort(); },
		cunt    : function() { return player.FirstVag().Short(); },
		clit    : function() { return player.FirstVag().ClitShort(); },
		butt    : function() { return player.Butt().Short(); },
		asshole : function() { return player.Butt().AnalShort(); },
		balls   : function() { return player.BallsDesc(); },
		skin    : function() { return player.SkinDesc(); },
		hair    : function() { return player.Hair().Short(); },
		breasts : function() { return player.FirstBreastRow().Short(); },
		nipples : function() { return player.FirstBreastRow().NipsShort(); },
		tongue  : function() { return player.TongueDesc(); }
	};

	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	var scenes = new EncounterTable();
	scenes.AddEnc(function() { // PC eats her out
		Text.Add("The moth-girl clicks her tongue as your wandering eyes drink in the soft mounds of her bare breasts; the secretive slits of her inverted pink nipples as they shift under your lustful gaze. She grins, planting her hands on her big hips and puffing her chest out a bit for you. <i>“Like what you see? I have to say, they're <b>definitely</b> my best assets, don't you think?”</i>", parse);
		Text.NL();
		Text.Add("You nod dumbly as the mammoth mammaries inch closer as the moth leans over you. Teasingly, she slips a finger into one of her inverted points, shivering as she swirls her digit through the slit of her nipple until the rosy point peeks out far enough for her to pinch it. While you're enthralled by the display, her other hand works its way down to her waist, thumb hooking through her belt and hiking her pants down. She steps out of them, kicking her breeches and sword out of the way and leaving herself more or less bare for you. Her hand returns upward, cupping her other breast, leaning it in give you a tantalizing look at her massive assets.", parse);
		Text.NL();
		Text.Add("<i>“Go ahead, touch 'em. I don't mind!”</i> she giggles, suddenly pushing her rack into your face and overwhelming your world in a valley of titflesh. You gasp for air as she smothers you in boobage, hands instinctively grasping for purchase on the flanks of the moth-girl's bosom. She gives a giddy little groan of pleasure, shoulders wiggling to grind her tits against your face. Blinded by the boobs, you helplessly grope at her, squeezing and cupping to try and move them off you, growing desperate as the teasing moth relentlessly reverse-motorboats you.", parse);
		Text.NL();
		Text.Add("Finally, you manage to get your head above the jiggling waves of titflesh - just in time for the moth to straddle your [legs], leaning in to push you back. You give a little gasp as she shoves you back against a nearby tree, grabbing your head at the last moment to keep you from hitting it against the hard bark... only to bury it back in her cleavage again. <i>“Mmm, that's a good slut,”</i> she teases, reaching down to grab your [butt]. <i>“Keep it up!”</i>", parse);
		Text.NL();
		Text.Add("You groan your protestations, but can't deny the warm, welcoming embrace of the moth's prodigious bust. No longer truly trapped, you relax yourself in her boob-filled embrace, letting your hands wander up along her obviously-sensitive undersides, cupping and squeezing her tits until the moth's moaning in pleasure. <i>“Juuuust like that,”</i> she purrs, stroking your [hair] and gently pushing you deeper into her bosom. You respond with a shake of your head, sending ripples through her jiggly boobs as your fingers fight their way upward to pinch her pink peaks, wringing them just enough to elicit a gasp of pained pleasure from the lusty moth.", parse);
		Text.NL();
		Text.Add("Her hand pulls you up, pushing you back against the tree; the moth lunges forward, pressing her lips to yours and pinning your hands between your [breasts] and her oversized tits, leaving you helpless but to caress her prominent nipples as you kiss her back, yielding as her long tongue demands entrance to your mouth. She maintains the kiss for but a moment, just long enough to let her tongue tease your tonsils before breaking it, lips trailing affectionate kisses down your neck and shoulders, rewarding your every pinch and caress of her breasts with a brush of her lips against your [skin] as her own hands work to strip you out of your [armor]. Eventually, her busy fingers make their way down to your crotch and ", parse);
		parse["l"] = player.LowerBodyType() != LowerBodyType.Single ? Text.Parse("between your [legs]", parse) : "in your crotch";
		if(player.FirstCock() && player.FirstVag())
			Text.Add("the combination of genitals [l], both sets unabashedly eager for sex after so much boob-play", parse);
		else if(player.FirstCock())
			Text.Add("the throbbing, eager cock[s] strain under your armor", parse);
		else
			Text.Add("the slick, wanton slit [l], already wet with your unabashed boob-lust", parse);
		parse["gen"] = player.FirstCock() ? Text.Parse("grab[oneof] your [cocks]", parse) : Text.Parse("caress your [cunt]", parse);
		parse["gen2"] = player.FirstCock() ? "wanks" : "fingers";
		Text.Add(". With a grin, the moth-girl slips a hand under your [armor] to [gen], giving it a few slow, sensual strokes as her other hand works you out of the last of your clothes around it, leaving you bare as she [gen2] you.", parse);
		Text.NL();
		Text.Add("<i>“Like that?”</i> she teases, digits working faster on your sex. <i>“I think it likes me...”</i>", parse);
		Text.NL();
		parse["gen"] = player.FirstCock() ? "pumping your prick" : "jilling your slit";
		Text.Add("You moan into her tits, pinned against the tree as you are, lavishing her nipples with affection in trade for her hand's wonderful work. She moves faster, [gen] as she starts to grind her hips against your own crotch, gaining just a little more pleasure from your body. With a mischievous grin, her free hand cups your cheek, pulling you back into a moment-long kiss... before guiding you down to one of her teats, planting your lips right on the pink disc of her areola.", parse);
		Text.NL();
		Text.Add("You suckle on the moth's tit, tongue lavishing it with licks, slurps and gentle teases between your teeth as she grinds herself against you, her ragged breath turning to sweet moans, little gasps and cries. Your hands slip down from her expansive bust, trailing across the sensitive skin of her waist and hips before slipping down to the sodden lake between your groins. The moth gives a shrill scream of pleasure as your digits bury themselves in her dripping cooch, spreading her spasming lips wide to reveal the glistening pink channel of her sex, thumbs reaching up to tease and caress the pink bulb of her clit.", parse);
		Text.NL();
		if(p1cock) {
			Text.Add("<i>“Ah... alright, alright, just... stick it in, already...”</i> the moth-girl moans, her domineering facade fading to quivering, eager sex as you bring her closer and closer to her breaking point. With a muted little gasp, the moth shifts her hips to give your throbbing member easy access to her waiting womanhood; you plunge in without hesitation, trading the wringing grasp of her fluffy fingers to the clinging, wet tightness of the thief's sodden sex.", parse);
			Text.NL();

			Sex.Vaginal(player, moth);
			moth.FuckVag(moth.FirstVag(), player.FirstCock(), 2);
			player.Fuck(player.FirstCock(), 2);

			Text.Add("Her back arches as you slide into her, biting her lower lip and fluttering her slender pink wing with every inch of cock you feed her eager pussy. Your hands let go of her well-stretched cunt and grab her ass, fingers digging into the soft, pliant flesh of her backside and pulling her down on your dick, until the moth's downy white crotch-fuzz is resting against your own slime-soaked groin, your [cock] fully buried inside her.", parse);
			Text.NL();
		}
		parse["c"] = player.FirstCock() ? " and cock" : "";
		parse['and'] = player.FirstCock() ? "," : " and"
		Text.Add("The moth's eyes roll back in mindless pleasure, hips rocking atop you, riding you for everything you're worth, tits pressing into your face until you're nearly blinded by the massive orbs of titflesh. Her movements became faster, her breath less and less steady as your mouth[and] fingers[c] work their magic on her tender body, working all her sensitive spots until she's a writhing mess of near-orgasmic bug-slut, all but begging for release. <i>“Yeah, yeah, just like that! Give it to me, baby! Yeah!”</i>", parse);
		Text.NL();
		parse["c"] = player.FirstCock() ? " and fucking" : "";
		Text.Add("You keep doing what you're doing, suckling[and] fingering[c] harder and faster until the moth throws her head back with an orgiastic scream of pleasure that echoes out around you. She roars in feminine ecstasy as fem-cum gushes out around you, smearing your crotch with her juices as she cums and cums, her orgasm lasting for what seems like a blissful eternity.", parse);
		if(player.FirstCock()) {
			Text.Add(" Her cunt spasms and squeezes so wonderfully tight around your [cock] as she orgasms, drawing you so close to the edge you can hardly think, save to grab the moth's hips and slam her down on your dick, cramming every last inch into her. She gives another shriek of pleasure, not skipping a beat as she moves her hips to bring you over too. Your fingers dig into her skin, holding the moth-slut tight as you join her in climax, blowing your load deep inside her.", parse);
			var cum = player.OrgasmCum();
		}
		else
			player.AddLustFraction(0.2);
		Text.NL();
		Text.Add("Your head falls back, chest heaving with exertion as the moth slumps forward, head resting against your [breasts]. Her wings flitter weakly behind her, arms wrapping around your neck to hold you tight. Pinned underneath a heap of warm, fuzzy moth-girl, you don't have many options but to lock your arms around her waist and return the favor, closing your eyes in momentary contentment.", parse);
		Text.NL();
		Text.Add("It's only an hour later that you wake up from you unexpected nap, rubbing the sleep out of your eyes as you stagger to your [feet], just in time to see the moth-girl standing at the edge of the clearing, getting ready to take flight. Hearing you move, she flashes a cute grin over her shoulder, wings lifting her a few inches off the ground.", parse);
		Text.NL();
		parse["trade"] = traded ? "" : ", waving her bag of coins in front of you triumphantly";
		Text.Add("<i>“Thanks for the fun, cutey!”</i> she giggles[trade] before flying off, blowing a kiss over her shoulder as she leaves.", parse);

		player.AddSexExp(2);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["guygirl"] = player.mfFem("guy", "girl");
		parse["boygirl"] = player.mfFem("boy", "girl");
		Text.Add("<i>“Mmm, hard already, huh? What's got you going so fast? Was it the thought of me being on top and riding you into the ground 'till you're begging for more... or are you just such a boobs-[guygirl] that you get a great big hard-on just from looking at these?”</i> she teases, hefting her prodigious bosom up with both hands, close enough you could reach out and lick them.", parse);
		Text.NL();
		Text.Add("She steps back before you can make up your mind, twirling around and hucking her sword belt off onto a nearby branch. Grinning lasciviously at you, the moth makes a show of turning her back to you, bending over as she wiggles out of her pants, tantalizing you with hints of her glistening sex until she finally bares it completely, letting her breeches fall to the ground. By the time her partial striptease is done, you're painfully aroused, [cocks] straining against your [armor].", parse);
		Text.NL();
		Text.Add("<i>“Like what you see?”</i> the bare, curvy moth says, striding toward you with a deliberate slowness, showing off her long, fluff-coated legs and running a hand across her pink slit. Teasingly, the moth sidles up into your lap, her ample cleavage all but pushing into your face, inviting you to suckle and tease the big, pink areola at their tips. You move to take one into your mouth, but the moth quickly pulls back, leaving you hanging as she slips down your body, dragging her chest along your form as she deftly strips you out of your [armor], making sure to tease <i>your</i> [nipples] along the way.", parse);
		Text.NL();
		Text.Add("She squeezes them between her fuzzy fingers just enough to make you wince before moving on to your belly, trailing airy kisses along your tender flesh, letting your squirm in her embrace. You reach up to guide her down, fingers lacing through her snow-white hair... and surprisingly, given her dominant attitude a moment ago, the moth flashes you a little grin and lets you push her face down into your groin, her teeth making short work of your undergarments and baring your [cocks] to her inspection.", parse);
		Text.NL();
		parse["b"] = player.HasBalls() ? Text.Parse(", the tip tickling the swell of your [balls]", parse) : Text.Parse(", the tip slithering down to tease the tight-clenched ring of your [asshole]", parse);
		Text.Add("She giggles to herself as[oneof] your [cocks] swats her in the cheek, finally freed of your clothes' restraint and as hard as a rock. Her long tongue snakes out, wrapping around the base of your [cock][b]. You shudder at her tongue's ministrations, watching as more and more of the drooling pink flesh wraps around your member, encasing it in a startlingly firm grip as the moth-babe works your cock. Eventually, she cranes her head up to plant her lips on the [cockTip] of your [cock], a tongue-slathered kiss on your crown before she opens wide and takes it.", parse);
		Text.NL();
		parse["LnotS"] = player.LowerBodyType() != LowerBodyType.Single ? "" : "s";
		Text.Add("Waves of pleasure wash over you, or through you, as the moth-girl starts to suck you off. Despite her victorious stance, she seems more than willing to let you guide her through it, your hand controlling the pace and tempo of her blowjob. Her tongue writhes around and constricts your [cock], alternating pressure and wet, sliding movements while her lips bob from crown to base, sucking you off around her overly-long appendage. The sensation is alien - and totally overwhelming. Your fingers dig into the moth's silky white hair, trying desperately to find purchase. Your [legs] squirm[LnotS] madly; wracked with over-stimulation, you desperately try to keep yourself from cumming.", parse);
		Text.NL();
		Text.Add("The moth is relentless, though, answering your desperate motions by popping her lips off your prick and leaning back, just enough to keep her tongue wrapped around you and bring her hefty rack to bear, squeezing your cock in between her pillowy breasts. She looks up and gives you an inviting wink as her hands squeeze her tits around your [cock], starting to pump you between them. Your willpower melts away in the blink of an eye, siphoned off by sinfully smooth titflesh and the sultry wet slurps of the moth-girl's mouth.", parse);
		Text.NL();
		Text.Add("With a cry of pleasure, you find yourself cumming. Your [cock] throbs between the moth's tits, making her gasp and giggle as you squirt your load out between her huge mounds. The moth grins up at you and keeps pumping, rocking her shoulders back and forth to roll your cock between her breasts until you've blown the last of your wad, completely slathering the gorge of her breasts with your seed.", parse);
		Text.NL();

		var cum = player.OrgasmCum();

		Text.Add("<i>“I just knew you were a boobs [guygirl],”</i> the thief teases, drawing her tongue off from around your shaft - and very deliberately back through the valley of her cleavage, letting it get smeared with your cum before she swallows it up, making a delightfully lewd moan as she gets a taste of you. She shifts back up to her knees, wiping her lips with the back of her hand and looking more than satisfied with her work.", parse);
		Text.NL();
		Text.Add("Thinking her done, you start to slip away, scrambling out from under the cum-basted moth - only to find her hands gripping your shoulders and shoving you against a nearby tree trunk, hard. <i>“Don't even think about it,”</i> she warns, straddling your [hips]. <i>“You're not getting off that easy!”</i>", parse);
		Text.NL();
		Text.Add("You groan, pressing yourself flush against the hard wall bark at your back. The moth-girl scoots forward, planting her big behind menacingly close to your exhausted pecker - and pushing her cum-slathered boobs into your face. You recoil at the overwhelming scent of your own semen coating her supple flesh, but there's nowhere for you to go but closer.", parse);
		Text.NL();
		Text.Add("<i>“You made a mess,”</i> she coos, one arm cupping her over-sized tits, and the other reaching back between her legs to tease your [cock] with the fuzzy tips of her fingers. <i>“Now clean it up for me... and if you're a good [boygirl], I'll help you.”</i>", parse);
		Text.NL();
		Text.Add("For emphasis, she pushes her shoulders forward, squeezing her rack together to make a little lake of your expelled spooge. You don't have much option from where you're sitting, and you quickly find yourself leaning in and licking across the curved swell of one of the moth's breasts. She shivers overtop you, chewing her lip as your [tongue] circles across her pale flesh, delving into her cleavage and lapping at the still-hot spunk on her.", parse);
		Text.NL();
		Text.Add("<i>“Oooh, just like that,”</i> she coos, wrapping her hand around your [cock] and giving it an experimental pump. You're still so sensitive after cumming that you can't help but cry out, squirming under the moth's expert ministrations. Even with your prick safely nestled in her fluffy grasp, the moth-girl can't help herself but to join you on her front side, too, letting her lengthy tongue roll out from between her rosy lips and down into her bosom. It flicks playfully across your own [tongue] before delving into a particularly thick clump of spunk clinging to one of her saucer-like nipples.", parse);
		Text.NL();
		Text.Add("Between the two of you, it doesn't take long to get the moth's tits clean enough to glisten in the light. By the time you do, you're rock hard again in her hand, and your [cockTip] is pressing into the cleft of her ass, so close to the hot gash of her sex that you can feel the warmth radiating from it.", parse);
		Text.NL();
		Text.Add("<i>“Think you can go again?”</i> the moth asks with a wink, though clearly it's less of a question and more of an enticement. Still, you put on a brave face and nod - her smile grows wider, and her hips shift back to plant the lips of her sex on the crown of your cock. The lusty moth wraps her arms around your neck, steadying herself against you and pressing her pert nips against your [breasts] as she starts to slide down your shaft.", parse);
		Text.NL();

		Sex.Vaginal(player, moth);
		moth.FuckVag(moth.FirstVag(), p1cock, 3);
		player.Fuck(p1cock, 3);

		Text.Add("For someone so enthusiastic about fucking you, she takes it nice and slow at first, easing herself into taking your [cock] ", parse);
		if(p1cock.Len() < 18)
			Text.Add("from tip to base", parse);
		else if(p1cock.Len() < 35)
			Text.Add("until her cunt is stretched to the breaking point around your girth member, and you can see your tip poking out from her belly", parse);
		else
			Text.Add(", massive behemoth that it is. She grunts and groans, desperately forcing herself down your tremendous dong until she's as mounted on your cock as she's liable to get", parse);
		Text.Add(". Once she's planted on you, it doesn't take long for the moth-girl to start moving, alternatively bouncing and grinding in your lap, mashing her boobs in your face until they completely black out your world.", parse);
		Text.NL();
		Text.Add("Your captor giggles and wiggles her shoulders, sending quakes of boobflesh slapping against your cheeks. Swallowed in warm, wet darkness, all you can do is clutch at the moth's body in a desperate attempt to hold her back. You're completely ineffectual; blind and wracked by waves of pleasure, left utterly at the moth-girl's mercy as she bounces on your cock. Your fingers find some purchase on the soft swells of her ass cheeks and you dig into them, squeezing and kneading the bandit's butt until she squeals with pleasure, moving faster in response.", parse);
		Text.NL();
		Text.Add("Her brilliant pink wings flutter madly, beating at your arms and [legs] with every pump of her hips, threatening to lift her straight off of you as she surrenders to pleasure. Her voice breaks into cute little moans and grunts: if the way her pussy's squeezing oh-so-tightly around your [cock] is any indication, she's close to the edge. You're not far behind her, stimulated by her hips pistoning you again and again into the sultry-hot folds of her gash.", parse);
		Text.NL();
		Text.Add("Sensing each other's impending climax, the moth-girl pulls her tits out of your face - only to replace them with her lips, kissing you with startling passion. The shock of the unexpected kiss sends ripples through your body, pleasurable shockwaves that culminate in your cock and spur you to release.", parse);
		Text.NL();
		parse["c"] = p1cock.Len() < 30 ? "to the hilt" : "as deep as your mammoth dick can go";
		Text.Add("The moth gives a little gasp as the first shot of seed spills into her but keeps on moving. The second spurt of cum you send splattering across the writhing walls of her pussy sends her over the edge too, breaking the kiss as she throws her head back with an exultant cry. You pull her down on your [cock], ramming yourself in [c], shooting the rest of your load deep into her. She's more than happy to take it if the way she moans and gasps is any indication!", parse);
		Text.NL();

		var cum = player.OrgasmCum();

		Text.Add("You collapse against the tree trunk, chest heaving with exertion as the moth slumps forward, head resting against your [breasts]. Her wings flitter weakly behind her, arms wrapping around your neck to hold you tight. Pinned underneath a heap of warm, fuzzy moth-girl, you don't have many options but to lock your arms around her waist and return the favor, closing your eyes in momentary contentment.", parse);
		Text.NL();
		Text.Add("It's only an hour later that you wake up from you unexpected nap, rubbing the sleep out of your eyes as you stagger to your [feet], just in time to see the moth-girl standing at the edge of the clearing, getting ready to take flight. Hearing you move, she flashes a cute grin over her shoulder, wings lifting her a few inches off the ground.", parse);
		Text.NL();
		parse["traded"] = traded ? "" : ", waving her bag of coins in front of you triumphantly";
		Text.Add("<i>“Thanks for the fun, cutey!”</i> she giggles[traded] before flying off, blowing a kiss over her shoulder as she leaves. ", parse);
	}, 1.0, function() { return player.FirstCock(); });

	scenes.Get();

	TimeStep({minute: 30});
	if(!traded) {
		Text.NL();
		Text.Add("<b>The mothgirl stole [coin] coins from you.</b>", parse);

		party.coin -= enc.coin;
	}
	Text.Flush();
	Gui.NextPrompt();
}

export { Mothgirl, MothgirlScenes };
