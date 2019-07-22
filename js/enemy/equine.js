/*
 *
 * Equine, lvl 2-3
 *
 */

import { Entity } from '../entity';

let EquineScenes = {};

function Equine(gender, levelbonus) {
	Entity.call(this);
	this.ID = "equine";

	if(gender == Gender.male) {
		this.avatar.combat     = Images.stallion;
		this.name              = "Stallion";
		this.monsterName       = "the stallion";
		this.MonsterName       = "The stallion";
		this.body.DefMale();
		this.FirstCock().thickness.base = 6;
		this.FirstCock().length.base = 32;
		this.Balls().size.base = 6;
	}
	else if(gender == Gender.female) {
		this.avatar.combat     = Images.mare;
		this.name              = "Mare";
		this.monsterName       = "the mare";
		this.MonsterName       = "The mare";
		this.body.DefFemale();
		this.FirstBreastRow().size.base = 20;
		this.Butt().buttSize.base = 7;
		if(Math.random() < 0.95)
			this.FirstVag().virgin = false;
	}
	else {
		this.avatar.combat     = Images.mare;
		this.name              = "Herm equine";
		this.monsterName       = "the herm equine";
		this.MonsterName       = "The herm equine";
		this.body.DefHerm(true);
		this.FirstCock().thickness.base = 6;
		this.FirstCock().length.base = 32;
		this.FirstBreastRow().size.base = 20;
		this.Butt().buttSize.base = 7;
		if(Math.random() < 0.8)
			this.FirstVag().virgin = false;
	}

	this.maxHp.base        = 100;
	this.maxSp.base        = 14;
	this.maxLust.base      = 15;
	// Main stats
	this.strength.base     = 18;
	this.stamina.base      = 15;
	this.dexterity.base    = 7;
	this.intelligence.base = 9;
	this.spirit.base       = 11;
	this.libido.base       = 14;
	this.charisma.base     = 12;

	this.elementDef.dmg[Element.mEarth] = 0.5;
	this.elementDef.dmg[Element.mWind]  = 0.5;
	this.elementDef.dmg[Element.pBlunt] = 0.3;

	this.level             = 2;
	if(Math.random() > 0.8) this.level++;
	this.level             += levelbonus || 0;
	this.sexlevel          = 2;

	this.combatExp         = this.level;
	this.coinDrop          = this.level * 4;

	this.body.SetRace(Race.Horse);

	this.body.SetBodyColor(Color.brown);

	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Horse, Color.brown);

	this.body.SetEyeColor(Color.green);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Equine.prototype = new Entity();
Equine.prototype.constructor = Equine;

Equine.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Equinium });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseHair });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseShoe });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseCum });

	if(Math.random() < 0.3)  drops.push({ it: Items.FreshGrass });
	if(Math.random() < 0.2)  drops.push({ it: Items.Foxglove });
	if(Math.random() < 0.2)  drops.push({ it: Items.SpringWater });
	if(Math.random() < 0.1)  drops.push({ it: Items.FlowerPetal });
	if(Math.random() < 0.1)  drops.push({ it: Items.Feather });

	if(Math.random() < 0.01) drops.push({ it: Items.Bovia });
	if(Math.random() < 0.01) drops.push({ it: Items.Ovis });
	if(Math.random() < 0.01) drops.push({ it: Items.Virilium });
	if(Math.random() < 0.01) drops.push({ it: Items.Gestarium });
	if(Math.random() < 0.01) drops.push({ it: Items.GestariumPlus });

	return drops;
}

Equine.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.name + " acts! Rawr!");
	Text.NL();
	Text.Flush();

	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.6)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}

EquineScenes.StallionImpregnate = function(mother, father, slot) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : father,
		race   : Race.Horse,
		num    : 1,
		time   : 30 * 24,
		load   : 3
	});
}

EquineScenes.PairEnc = function(levelbonus) {
	var enemy    = new Party();
	var stallion = new Equine(Gender.male, levelbonus);
	var mare     = new Equine(Gender.female, levelbonus);
	enemy.AddMember(stallion);
	enemy.AddMember(mare);
	var enc      = new Encounter(enemy);
	enc.stallion = stallion;
	enc.mare     = mare;

	enc.onEncounter = function() {
		var parse = {
			party         : !party.Alone() ? " and your party" : "",
			breastCup : enc.mare.FirstBreastRow().ShortCup()
		};

		Text.Clear();
		Text.Add("You[party] spot a strange shadow farther up one of the many paths and roads surrounding the area. Thinking that it might be dangerous, you head on a different pathway. A few moments pass and all is well. With the sound of something heavy pounding against the ground, you turn and just manage to dodge a thundering charge aimed right at you!", parse);
		Text.NL();
		Text.Add("Getting back your bearings, you[party] get into a defensive position. Getting a better look at your opponent, you are shocked to see that it is a horse, nearly seven foot tall, in the shape of a person! A more feminine shaped mare approaches and stands next to the horse morph.", parse);
		Text.NL();
		Text.Add("The stallion has a piece of crude leather tied around his waist covering most of his genitals; bits of his black orbs are clearly visible. Despite being covered, the outline of his knob forms around the cloth. His brown coat contrasts against his hair in a strange way.", parse);
		Text.NL();
		Text.Add("A muscular, peach-furred female stands next to her partner. A pair of [breastCup] perk naturally at her chest, covered by a sparse amount of leather tied around her back. Her lower set of lips are covered in a similar fashion: a brown leather thong barely covering her features. Despite her obviously feminine traits, she looks strong and firm. Her long hair flows naturally down her neck, eyes sparkling with a green shine.", parse);
		Text.NL();
		Text.Add("The two hunch down into an attacking stance. They intend to fight you!", parse);
		Text.Flush();

		// Start combat
		Gui.NextPrompt(function() {
			enc.PrepCombat();
		});
	};

	/*
	enc.canRun = false;
	enc.VictoryCondition = ...
	*/
	enc.onLoss    = EquineScenes.LossPrompt;
	enc.onVictory = EquineScenes.WinPrompt;

	return enc;
}

EquineScenes.LossPrompt = function() {
	SetGameState(GameState.Event, Gui);
	
	// this = encounter
	var enc = this;

	var parse = {
		party         : !party.Alone() ? " and your party" : "",
		hisher1       : enc.stallion.hisher(),
		heshe1        : enc.stallion.heshe(),
		HeShe1        : enc.stallion.HeShe(),
		hisher2       : enc.mare.hisher(),
		heshe2        : enc.mare.heshe(),
		HeShe2        : enc.mare.HeShe(),
		HisHer2       : enc.mare.HisHer(),
		breast2   : enc.mare.FirstBreastRow().Short(),
		nip2      : enc.mare.FirstBreastRow().NipsShort()
	};
	enc.parse = parse;
	
	var lustBonus = enc.mare.LustLevel() + enc.stallion.LustLevel();

	Gui.Callstack.push(function() {
		Text.Clear();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("You[party] collapse, unable to dispute the equine couple's victory. The two approach you, the stallion eyeing your crumpled figure with desire.", parse);
			Text.NL();
			Text.Add("<i>“You in the mood?”</i> The male questions, turned to the mare, his groin twitching in the process.", parse);
			Text.NL();
			Text.Add("<i>“You're <b>always</b> in the mood, aren't you? Maybe if you aren't satisfied with me, you should just leave.”</i> The busty female turns her back to the stallion, fuming.", parse);
			Text.NL();
			Text.Add("<i>“Yeah, okay, sure. When <b>you're</b> in the mood, you'd fuck a demon to death, but when <b>I</b> want to have some fun-”</i>", parse);
			Text.NL();
			Text.Add("The two continue to argue for quite some time, allowing you[party] to slink away unnoticed. Still, you find the loss to two bickering equines quite embarrassing.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}, 1.0);
		scenes.AddEnc(function() {
			parse["kn"] = player.HasLegs() ? " drop to your knees" : " fall to the ground";
			Text.Add("The final blow breaks your will and you grudgingly[kn], unable to fight back. Your eyes look around and you hear the telltale click of animalistic tongues.", parse);
			Text.NL();
			Text.Add("<i>“I thought they'd last a little longer than that...”</i> The mare comments, looking to [hisher2] comrade as [heshe2] finishes. ", parse);
			Text.NL();
			Text.Add("The stallion matches [hisher2] glare. <i>“I know that look.”</i> [HeShe1] takes this moment to rake [hisher1] eyes over your figure.", parse);
			Text.NL();

			if(player.NumCocks() > 0) {
				Text.Add("[HeShe1] chuckles briefly. <i>“Don't let your prey see your mouth water.”</i> The mare gives you a telling ogle.", parse);
				Text.NL();
				Text.Add("[HeShe2] replied sharply. <i>“Mind your damn business...”</i> [HisHer2] eyes stayed pinned to your figure as [heshe2] spoke. It's not that you mind the attention, but you do feel a little uneasy under those stares. ", parse);
			}
			else if(player.NumVags() > 0) {
				Text.Add("The mare gave a shrug. <i>“Well, it's your call. She can't seem to stop staring at you.”</i>", parse);
				Text.NL();
				Text.Add("You look away from the stallion after the female mentions it and feel heat rise into your cheeks. It's not your fault: his... equipment is simply not an everyday sight.", parse);
			}
			Text.NL();
			Text.Add("The two opponents grow restless with their own hesitation and finally turn to question you.", parse);
			Text.NL();

			if(player.NumCocks() > 0) {
				Text.Add("<i>“You wanna play with me?”</i> The mare smiles, approaching you while pressing her chest out. The small amount of leather covering her [breast2] pulls tightly around her [nip2], the outline quite visible.", parse);
			}
			else if(player.NumVags() > 0) {
				Text.Add("<i>“So, you wanna have some fun?”</i> The stallion questions while moving forward, closing the distance. His musk fills your nostrils, and despite how disgusting the idea might be, you can feel your insides squirm. ", parse);
			}

			if(player.LustLevel() >= 0.8) {
				Text.NL();
				Text.Add("<b>Aroused as you are, you cannot bring yourself to refuse their offer.</b>");
			}
			Text.Flush();
			// SET UP CHOICES

			//[Fuck her][Get fucked][Threesome][No]
			var options = new Array();
			if(player.NumCocks() > 0) {
				options.push({ nameStr : "Fuck her",
					func : function() {
						EquineScenes.FuckFemale(enc);
					}, enabled : true,
					tooltip : "The female equine has caught your interest, and judging from her demeanor, she likely wouldn't object."
				});
			}
			if(player.NumVags() > 0) {
				options.push({ nameStr : "Get fucked",
					func : function() {
						EquineScenes.GetFucked(enc);
					}, enabled : true,
					tooltip : "Taking on that thick horse cock looks like a challenge, but you can't let that stop you!"
				});
			}

			if(player.NumCocks() > 0) {
				options.push({ nameStr : "Threesome",
					func : function() {
						EquineScenes.Threesome1(enc);
					}, enabled : true,
					tooltip : "Why not have both of them join in? The stallion looks like he is willing to share his partner... that, and they both have parts you could play with."
				});
			}
			else if(player.NumVags() > 0) {
				options.push({ nameStr : "Threesome",
					func : function() {
						EquineScenes.Threesome2(enc);
					}, enabled : true,
					tooltip : "Why not have both of them join in? That cock looks like it could serve both you and the mare."
				});
			}
			options.push({ nameStr : "No",
				func : function() {
					parse.party = !party.Alone() ? " and wake your incapacitated party" : "";

					Text.Clear();
					Text.Add("They sigh and shrug, both looking disappointed.", parse);
					Text.NL();
					if(player.NumCocks() > 0)
						Text.Add("The mare turns to you and asks. <i>“You sure?”</i> You nod your head with certainty and turn the two away. You quickly get a hold of yourself[party] before heading out, thankful that you managed to leave with some dignity. ", parse);
					else
						Text.Add("The stallion turns away from you and scoffs. <i>“You're missing the ride of your life.”</i> You furrow your eyebrows with anger and turn away from the two. You quickly get a hold of yourself[party] before heading out, thankful that you managed to leave with some dignity.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}, enabled : player.LustLevel() < 0.8,
				tooltip : "Refuse their offer."
			});
			Gui.SetButtonsFromList(options);
		}, 1.0 + lustBonus); // Sex more likely on high lust enemies

		scenes.Get();

	});
	Encounter.prototype.onLoss.call(enc);
}

EquineScenes.FuckFemale = function(enc) {
	var parse = {		
		mobVag : function() { return enc.mare.FirstVag().Short(); }
	};
	
	parse = player.ParserTags(parse);

	Text.Clear();
	Text.Add("You greedily drink in the female's assets, eyes traveling down to her poorly-covered groin. You swear that you can see drops of moisture roll down her long, slender peach legs.", parse);
	Text.NL();
	Text.Add("<i>“I... yeah.”</i> It's the only confirmation you can release without sounding too eager.", parse);
	Text.NL();
	Text.Add("The scantily-clad mare slowly approaches you on her hooves, eyes glued to yours. Once within touching distance, without missing a beat, she puts her hand on your shoulder and eases you onto your back. Her glowing emerald gems melt your expression. ", parse);
	Text.NL();
	Text.Add("A telling feeling rises from your nethers, your [cock] poking against her milky peach skin. Your eyes feel pinned to hers, smooth locks of brown hair drifting in front of one of her eyes. Her tits press into your chest, and she gropes your groin. <i>“What are you waiting for?”</i>", parse);
	Text.NL();
	Text.Add("That is a fair question. You snap out of your haze and wrap your hands around her waist, using some of your gathered strength to turn her over. In a moment's notice, you're sitting comfortably on top of a barely dressed mare, who watches you fiddle with your [armor] and get your [cock] free of the uncomfortable prison. Once the tip's free, you feel a breeze tickle you. Briefly, you are aware that you're about to take an equine in the middle of the road. You glance behind you but the stallion is gone.", parse);
	if(!party.Alone())
		Text.Add(" Your party is also missing, but you are not too worried about it.");
	Text.NL();
	Text.Add("Quickly returning your attention to the patient mare awaiting you, your eyes travel down to her thighs and the piece of pink that sits perfectly in her canyon. She peels back the leather covering herself and you move your hand to your [cock], aiming the tip at the correct silo. It is incredibly moist, as if she has been fantasizing about you for hours. She moves her legs, curving them around your waist.", parse);
	Text.NL();
	Text.Add("With nothing else standing in your way, you put both of your palms in between her head and the cool ground. She squirms below you, her lower lips squishing against the tip. You ease inside of her hole as she releases a pent up breath. As you hilt yourself inside of her [mobVag], she moans quietly, her eyes trained on yours. The base of your [cock] is tickled by her labia, her pubic mound getting mixed up against yours.", parse);
	Text.NL();

	Sex.Vaginal(player, enc.mare);
	enc.mare.FuckVag(enc.mare.FirstVag(), player.FirstCock(), 3);
	player.Fuck(player.FirstCock(), 3);

	Text.Add("You savor the moment, but not for long. You withdraw from her hot, tight cavern, every inch enveloped in her tight embrace. The sweet, indescribable feeling of her wet flesh squeezing against yours is something simply to be experienced. Once you feel the cool air brush against the last, soaked inch of your [cock], you thrust back inside of her [mobVag]. She rocks forward, moans a little louder, and you soak up every detail of her expression. As your hips drive in and out of her, your eyes drink in every detail of her ecstatic eyes.", parse);
	Text.NL();
	Text.Add("Pistoning mercilessly, you fuck her without a care in the world. Eventually, your speed gets intense enough that she begins to call out and wraps her arms around your firm back. Her tits jiggle lewdly with every thrust and you can't resist the urge to grab her perky jugs. Your fingers grope her milk-makers, squeezing and flicking her nipples as your [cock] ravages her [mobVag]. Every moment drives you forward, the building release in your [balls] driving you deep into her channel.", parse);
	Text.NL();
	Text.Add("She moans while you rut your cock inside of the slutty hole she seduced you into. Your fingers start to lose grip of her breasts, sweat coming out of your palms. You move your hands down to her hips and clamp down on the peach skin. Her pussy squeezes wetly, squelching juices out of her slit. Every part of your [cock] is covered in her pussy lube", parse);
	if(player.HasBalls())
		Text.Add(", your balls bathed in her sweet smelling oil", parse);
	Text.Add(". She tightens her arms, screaming as her body convulses around you. She squirts, cumming on your [cock] before you even feel the need. The projecting girl-cum coats your abdomen quite nicely.", parse);
	Text.NL();
	Text.Add("The feeling of pushing your hips forward and her insides furiously stimulating every piece and section of your [cock] leaves nothing to be desired. You've been enjoying it so much; your body tells you it's time to move on. You'd feel as though your impending orgasm might be a punishment, if it wasn't going to feel so satisfying. The mare has both of her green pupils staring right into yours; you were distracted for the last few moments. Your open mouth releases breaths like your hips are dealing out thrusts. She speaks in between moans.", parse);
	Text.NL();
	Text.Add("<i>“Finish-Aaah... where you w-aaant-Oh!”</i> She struggles to speak clearly as you spear her [mobVag].", parse);
	Text.NL();
	Text.Add("Well, it looks like you have a choice. You're going to blow any second. Where are you going to do it?", parse);
	Text.Flush();

	//[Inside][Tits][Face]
	var options = new Array();
	options.push({ nameStr : "Inside",
		func : function() {
			Text.Clear();

			Text.Add("You decide to throw caution to the wind and ride it out. She moves her hands from where they once clung to your back and begins furiously rubbing her clit while juggling her own tits. Apparently, she wants a second turn, and you're not about to raise any any objections!", parse);
			Text.NL();
			parse["ba"] = player.HasBalls() ? "balls" : "load";
			Text.Add("Ignoring her pleasure, you tighten your grasp on her hips and begin to savagely fuck her. Every muscle and piece of energy inside of you driving toward one thing: filling this mare with your seed. Your [cock] swiftly begins to empty your [ba] inside of her [mobVag]. Cum paints her insides white, filling her with the sticky release. You fire countless shots off, feeling her body rock with another orgasm as you do it. Once you feel the spasms cease and the slight movements of your shaft pushing the semen out of her pussy, you can't help but look down and stare at that creampie.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "No turning back now, this feels way too good to stop!"
	});
	options.push({ nameStr : "Tits",
		func : function() {
			Text.Clear();

			Text.Add("The rawest emotion in your mind tells you that it's a bit childish, but you go for it. Finally with someone giving you free reign, you decide to take advantage of it. You feel your orgasm dangerously close, and you pull out of her slick hole, not wanting to risk losing the opportunity. ", parse);
			Text.NL();
			parse["lg"] = player.HasLegs() ? " legs over hers, kneeling" : "self over her, hovering";
			Text.Add("You swiftly position your[lg] over her abdomen, and your hand squeezes around your [cock], rapidly pulling. She seems to get the message and squeezes her juicy boobs together, giving you a lusty grin. With nothing left stopping you, your [cock] fires. White shots of cum cover her mounds, drifting all over her chest. Some misfire and hit her neck, but a vast majority of your shots land on her creamy orbs. She leans up slightly, and takes her seed covered jugs in her hands. The mare rubs your [cock] into her soft breasts, coating you in your own orgasm. She looks up at you innocently, as if she was washing a counter top instead of tit-fucking you. She removes her tits from the equation and takes your cum-covered [cock] into her mouth, cleaning you off with her fat horse tongue.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Cum all over those magnificent tits of hers!"
	});
	options.push({ nameStr : "Face",
		func : function() {
			Text.Clear();

			parse["rest"] = player.HasLegs() ? " lay your knees on her sides, against the cold stone below you" : " lightly rest your lower body over her";
			Text.Add("You give it a moment's thought and can think of no better place to choose. Your campaign of her defenseless hole is swiftly put on hold. You believe it to be thoroughly conquered, and look to fresh caverns to plunder. Pulling your [cock] out of her sloppy cunt, you climb over her legs and[rest]. She perks up, pulling herself up a little bit, as you grab the back of her head and pull her equine face toward your groin. She opens her lips and takes your [cock] into her inviting mouth.", parse);
			Text.NL();
			Text.Add("She begins lapping at your throbbing invader, her thick tongue wrapping around the tip. You buck your hips a few times and your cock begins spurting cum like never before. Not wanting to get away from your original goal, you pull yourself out of her hot mouth and continue the shelling on her face. Her heavy breathing caresses your groin as each white spurt lands - sometimes in the growing pool on her tongue, other times on her cheeks and nose.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Jack off on her face."
	});
	Gui.SetButtonsFromList(options);

	Gui.Callstack.push(function() {
		Text.Clear();

		Text.Add("<i>“Oh, that was... better than expected. You are <b>good</b>!”</i>", parse);
		Text.NL();
		Text.Add("You turn to the female, and she gives you a smirk. <i>“What was your name again, honey?”</i>", parse);
		Text.NL();
		Text.Add("You should have expected as much. After a few moments of deliberation, the mare hops to her feet. <i>“Well, I've got to clean up, but I bet I'll see you around.”</i> ", parse);
		Text.NL();
		Text.Add("After a few moments, you collect your bearings.");
		if(!party.Alone())
			Text.Add(" Your party rejoins you, and you question them as to where they went. They tell you not to worry about it, but you suspect the stallion had something to do with it!", parse);
		Text.Flush();
		player.AddLustFraction(-1);

		Gui.NextPrompt();
	});
}

EquineScenes.GetFucked = function(enc) {
	var parse = {		
		ifArmor    : player.Armor() ? "strips you down to full nudity" : "runs them down your naked body"
	};
	
	parse = player.ParserTags(parse);

	Text.Clear();

	Text.Add("Your eyes betray you and despite whatever social norms have drilled in your brain, you can't help but squirm your legs in response.", parse);
	Text.NL();
	Text.Add("The stallion notices you staring and removes the small amount of clothing he has, completely revealing the currently semi-limp horse penis. You stare, thinking for a moment that you could play your interest off as academic, but soon realize you want what he's packing. Your hands shyly reach out for the hunk of flesh.", parse);
	Text.NL();
	Text.Add("He makes no move to stop you as you slowly stroke his black shaft to full mass. You analyze every inch of the erect flagship, the veins that protrude, the ring that forms a few inches after the base of the tool. Heat radiates off of it, and you can feel your nethers dampen with every passing moment.", parse);
	Text.NL();
	Text.Add("Looking up at the stallion, your hands slowly travel up his abdomen. You stand up straight, your wrists crossing each other behind his neck. He affectionately returns the gaze, his package pressing hotly against your body. The equine takes his hands and [ifArmor].", parse);
	Text.NL();
	Text.Add("Taking control, you press the equine onto his back. He thumps against the ground with a gruff groan and you swiftly mount his chest, your legs folded between his body, lying against the cold stone. Your [vag] squelches against his muscled chest, leaving a trail of natural lube. Sensually, you push yourself back until your [butt] is pressing against his meaty rod.", parse);
	Text.NL();
	Text.Add("You take his strong hands in your grasp and press his fingers into your breasts while rubbing your backside against the sensitive shaft. Once your [vag] teases itself with rubbing his tip against it, however, you feel the irresistible urge to fill yourself to the hilt.", parse);
	Text.NL();
	Text.Add("With not a moment to spare, you give him an invitation inside, and his base RSVP's to the party in your [vag]. An ecstasy filled moment later, your womb thanks the tip for arriving. His thickness fills you to the brim, no questions asked. Your hospitality is appreciated, and he shows that appreciation by rubbing and tweaking your tits. Neither of you move as your hands press into his lower torso, savoring the moment. Your breaths become heavy and labored.", parse);
	Text.NL();

	Sex.Vaginal(enc.stallion, player);
	player.FuckVag(player.FirstVag(), enc.stallion.FirstCock(), 3);
	enc.stallion.Fuck(enc.stallion.FirstCock(), 3);

	EquineScenes.StallionImpregnate(player, enc.stallion);

	Text.Add("The experience becomes amplified as your [hips] begin sliding up, riding the stallion for everything he's worth. He grunts every time you squeeze your insides around him, and you could probably make him cry out with just the manipulation of your hips if you weren't so distracted by your own pleasure. You continue to slide just a few inches off, then wetly slam back down to his balls.", parse);
	Text.NL();
	Text.Add("Your rapid breathing starts turning into small concessions and moans. Moments pass and your pace increases, swiftly hilting yourself over and over, fingernails digging into his rough skin.", parse);
	if(player.BiggestBreasts().size.Get() > 10)
		Text.Add("Your [breasts] begin to bounce with your exuberant thrusts, giving you an even more intensified feeling when his fingers flick your erect [nips].", parse);
	Text.NL();
	Text.Add("This quick, satisfying fuck can't last forever, as you soon realize. The stallion below you begins to make the stereotypical motions, his legs tightening and cease movement, his hips bucking at your withdrawals. He's going to blow at any second. Realizing that he might go before you're ready to reap your own reward, you devise a plan. ", parse);
	Text.Flush();

	// DECISIONS

	Gui.NextPrompt(function() {
		Text.Clear();

		Text.Add("Before he's completely ready, you pull yourself off of his horse cock and turn your body around, your mouth taking deep breaths on his base while he stares at your [vag] head on. You slowly stroke a few inches above the bottom of his cock, enticing him to pay attention to your puffed lips. He gets the memo - not a moment later, you feel his fat horse tongue lap greedily at you.", parse);
		Text.NL();
		Text.Add("Your own mouth works quite well, licking at his sides while jerking the boy off. Even feeling a little generous, you suckle on his sack, fitting one testicle into your mouth and shining it with your tongue. He presses the long, shaft-like muscle into your [vag], his fingers rapidly rubbing your [clit].", parse);
		Text.NL();
		Text.Add("Failing miserably at holding up to his methods, you cry out as your [vag] clamps against his tongue, shooting girl-cum onto his muzzle. You swallow his tip and a few inches beyond that, furiously jerking the rest of his horse cock. Feeling the release come through the large rod, cum floods your mouth. At first, you try to gulp down his slightly sweet release, but it comes far too quick for that. You release his dick from your lips and the shaft shoots several ropes onto your [face] and chest. The immediate aftermath of your climax only makes you lustfully open your mouth for the falling seed.", parse);
		Text.NL();
		Text.Add("After a minute or so, you and the equine lazily get to your feet, clean up, dress, and head your different paths. When you pay more attention, you notice that the mare seems to be gone.", parse);
		if(!party.Alone())
			Text.Add(" Your party eventually meets you on the path, and when you ask them where they were, they seem unwilling to tell you. You suspect the mare had something to do with that!", parse);
		Text.Flush();

		player.AddLustFraction(-1);

		Gui.NextPrompt();
	});
}

// SCENE FOR MALES/HERMS
EquineScenes.Threesome1 = function(enc) {
	var parse = {		
		mobVag : function() { return enc.mare.FirstVag().Short(); },		
		ifBalls  : function() { return player.HasBalls() ? "r balls" : ""; }
	};
	
	parse = player.ParserTags(parse);

	Text.Clear();

	Text.Add("After a few moments of consideration, you shyly suggest that both of them participate. The stallion raises his eyebrow suggestively.", parse);
	Text.NL();
	Text.Add("<i>“As long as your offering...”</i> You two share a glance, and for a moment you consider if this might have been a bad idea. However, you look at his bulging crotch and feel butterflies in your stomach.", parse);
	Text.NL();
	parse["kne"] = player.HasLegs() ? "on your knees" : "resting on your lower body";
	Text.Add("The mare doesn't seem to mind either, and the two close in on you. You're already [kne], waiting for them to decide what to do with you. Glad that they included you on the decision making, you watch each of them peel away the pieces of clothing they had. The mare's tits are just as juicy to you as the slowly throbbing horse cock just inches from your face. Seeing as it's the closest, you wrap your hands around the hips of the stallion.", parse);
	Text.NL();
	Text.Add("The sleek cock gives off quite the musk that makes your own [cock] rise in your [armor]. You can feel the mare swiftly pull your gear off of your sides, letting the breeze tickle your tip.", parse);
	Text.NL();
	Text.Add("You place one hand on the base of the now fully erect member, feeling only slightly intimidated by its size. With little consideration, you open your hot maw and manage to fit the tip in your mouth without too much of a fight. Your jaw strains, but eventually you fit a few more inches of the thick horse cock in. Your tongue works diligently to keep it wet and lubed, to further ease the conquest of your mouth.", parse);
	Text.NL();
	Text.Add("At the same time, you feel the mare's lips wrap around your [cock]. Her fat horse tongue has no trouble covering your entire length in gobs of her saliva, and she expertly takes you into her throat.", parse);
	Text.NL();
	Text.Add("You still struggle to get half of the stud's cock in your mouth. A drop of pre-cum drips from his tip, which sweetly hits your tongue and you lap it up without a second's thought. The stallion takes his big, long fingers and wraps a hand around the back of your head. He doesn't push, but simply feeling his powerful hand sends shivers down your spine.", parse);
	Text.NL();
	Text.Add("The mare continues expertly sucking your [cock] without breaking a sweat. She even puts your [cock] in between her jugs, squeezing you with her soft, pillowy tits. You can't put much focus on the sweet feeling of her attention, but you can feel the rising orgasm climb through you.", parse);
	Text.NL();
	Text.Add("The next few moments you feel uncharacteristically exuberant about, squeezing your thumb in your palm while the fleshy invader slowly travels to the back of your mouth. Slowly, but surely, your upper lip kisses the base of the stallion's meaty rod. You feel adventurous and snake your tongue out of your lower lip, brushing the wet muscle with his sack for a moment. The choking feeling in your throat reels you back into reality and you have to pull back, letting his entire length snake out of your lips. You breathe heavily on the tip, and stare up at the recipient.", parse);
	Text.NL();
	Text.Add("You feel a similar action on your own [cock] and look down. The mare's stares up at you with those big, green orbs, a saliva line linking her recently sucking tongue to your [cock] as she huffs against you[ifBalls], tits in hand and fondling them.", parse);
	Text.NL();
	Text.Add("A brilliant idea crawls into your mind and you simply have to act on it. You reach your hands down to meet hers and with her slender digits in your hands, you pull her back as you lie down against the cold ground. Her boobs act as a fluffy air bag, bouncing off of your chest.", parse);
	Text.NL();
	Text.Add("Face to face with the mare, you stare into her eyes for a moment before she places her hands on the ground under your arms, and gives you a suggestive pose. Your hand reaches down to your [cock], and you guide yourself to her buried treasure, feeling her sloppy hole welcome you with the red carpet. She rolls her full hips into you, swallowing your [cock] inside of her tight holding cell.", parse);
	Text.NL();

	Sex.Vaginal(player, enc.mare);
	enc.mare.FuckVag(enc.mare.FirstVag(), player.FirstCock(), 3);
	player.Fuck(player.FirstCock(), 3);

	Text.Add("With her body bent over yours, you notice the stallion behind her, unsure of where to insert himself. You think it best to suggest one to him.", parse);
	Text.Flush();

	//TODO variations
	// BREAK POINT

	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You beckon the male to come around to the other side, where the mare is lolling her tongue about, while her hips are flopping eagerly against your wet [cock].", parse);
		Text.NL();
		Text.Add("He comes over at your earnest and the female looks up lustfully at the hung male. He gets on his knees, pressing forward near the mare's head. His floppy sack hangs just a few inches from your face while his hips press the tip of his horse cock to the mare's inviting maw. She takes the lengthy shaft to the back of her throat, apparently designed to take her hung species. Her thick, animalistic tongue drips saliva onto your chest.", parse);
		Text.NL();
		Text.Add("You and the stallion begin pinning her in between your cocks, your hips thrusting her into his thick pole, and his rapid throat fucking sending her thighs into yours. Both of you increase the speed of your mutual fuck, juices squelching loudly and muffed moans filling the air.", parse);
		Text.NL();
		parse["lgs"] = player.HasLegs() ? "r legs" : "";
		Text.Add("The male equine's balls above your eyes noticeably tighten, flapping back and forth from slapping the mare's chin, and you can feel yourself approaching the tidal wave as well. Rolling in and out of the deep [mobVag], you[lgs] eagerly piston ever forward.", parse);
		Text.NL();
		Text.Add("It comes quick: your [cock] begins clenching and you roughly push as deep into her cunt as you can, dumping your seed with fervor. The feeling of her [mobVag] around you contracting in climax is utter bliss. The horse cock above you follows, both of his hands tightly gripping her skull, burying his horse cock in her throat while firing off his load.", parse);
		Text.NL();
		Text.Add("Eventually, the mare pulls away from his rod while he's still shooting. She has neglected to swallow any of it, and as the tip leaves her lips, the flood of virile cum comes down her chest and begins dripping on you. The semi-erect horse cock covered in semen rises something in your stomach and you can't help but grab the base of his dick, pushing your head up and swallowing him with one lusty gulp. Your tongue works quickly, cleaning him of his release and sending the salty treat down your gullet. The mare follows your lead and you take turns cleaning him off, both of you lovingly working for the sweet reward.", parse);
		Text.NL();
		Text.Add("The scene calms down slowly, and you recollect your bearings. The two equines go their way", parse);
		if(!party.Alone())
			Text.Add(", and you go back to your party. They were knocked out from the fight, unfortunately, so they have no idea what they missed.", parse);
		else
			Text.Add(", leaving you alone again.", parse);
		Text.Flush();

		player.AddLustFraction(-1);

		Gui.NextPrompt();
	});
}

EquineScenes.Threesome2 = function(enc) {
	var parse = {		
		mobVag : function() { return enc.mare.FirstVag().Short(); }
	};
	
	parse = player.ParserTags(parse);

	Text.Clear();

	Text.Add("You suggest that both of them have some fun with you. The mare seems excited and the stallion gives both of you an approving glance. You give the mare a beckoning motion and she excitedly kneels down to your level, bringing you in for a kiss, slipping her tongue into your mouth. You have a brief skirmish with the fat muscle before you pull yourself down to the cool stone ground.", parse);
	Text.NL();
	Text.Add("You and the mare begin fondling each other's assets while stripping any pieces of clothing that remains on either of you. With both of you lying on each other, it gives the perfect view to the stallion of two pussies and asses waiting for his throbbing shaft.", parse);
	Text.NL();
	Text.Add("Distracted by the tits in your hands, you almost forget about the stallion until you feel that flat tip press up against your [vag]. You giddily continue rubbing the mare's chest, moaning into her tongue as he presses several inches inside of you.", parse);
	Text.NL();

	Sex.Vaginal(enc.stallion, player);
	player.FuckVag(player.FirstVag(), enc.stallion.FirstCock(), 3);
	enc.stallion.Fuck(enc.stallion.FirstCock(), 3);

	EquineScenes.StallionImpregnate(player, enc.stallion);

	Text.Add("The mare greedily presses her slit against his cock, rubbing her wet lips into his shaft. He presses his hands on your hips, latching onto them. The horse hilts himself inside of your [vag], your lips breaking contact with the mare as you moan into her face.", parse);
	Text.NL();
	Text.Add("After the stallion starts going a decent pace in your tight insides, the female above focuses on your [clit], rubbing the pleasure button furiously. You moan like a bitch but are quickly silenced by the mare, who presses her lips against yours once more. Instead of fighting with her thick muscle, you bend to its will and have a sweet dance in your mouth.", parse);
	Text.NL();
	Text.Add("Each of your tits rock against each other as the stallion roughly fucks your hole. He continuously makes love with your womb, your slick [vag] giving him red carpet access. With the constant and vigorous stimulation of your clitoris and the steamy thickness of the stallion filling you up to the brim, your walls convulse with an orgasm that hits much quicker than you'd like. You squeeze down on the dick inside you, trying to milk the male. He remains steadfast and waits until your body stops cumming on his horse cock before removing himself and impaling the pussy above yours. This time, the mare breaks lip contact to moan in your face.", parse);
	Text.NL();
	Text.Add("You think that it's quite fair game to give her a taste of her own medicine. Your hand moves up to her soaking wet [mobVag] and you eventually find her little pleasure bud, which you immediately begin pleasantly torturing. Her moaning maw is somewhat of an issue, however. You decide to fill her slutty mouth with three of your fingers, which she sucks on without any type of consideration. Her teeth rub against your flesh in a gentle manner.", parse);
	Text.NL();
	Text.Add("She receives the same treatment you got, her slit pounded with a foot or more of horse shaft. You can still feel a portion of his balls slap against your [clit], gobs of girl-lube dripping onto your puffy lips. The rocking feeling of her pussy being stuffed rocks against your grounded body, your nipples still gyrating against hers.", parse);
	Text.NL();
	Text.Add("With the meticulous pleasure centered on the female, it'd be foolish to think she could last very long. She clamps down around the bestial shaft inside of her, squirting cum over you and the stallion. You give a few triumphant rubs to her sensitive bud and remove your saliva covered fingers from her mouth.", parse);
	Text.NL();
	Text.Add("The stallion suddenly pulls out of the mare and for a moment you are unsure of what he's doing. Before you think of pushing the mare out of the way, you feel a cool shot hit your sore slit and several more following up. The stallion softly stroked himself to orgasm over both of your pussies, covering both in his potent seed. You and the mare have the same idea, and begin stuffing the semen into each other's cunts.", parse);
	Text.NL();
	Text.Add("Despite having quite a fun time, you and the equines part ways.", parse);
	if(!party.Alone())
		Text.Add(" Your party awakens, and questions the strange smell on your body. You ignore their probes, and head out.", parse);
	Text.Flush();

	player.AddLustFraction(-1);

	Gui.NextPrompt();
}



//TODO
EquineScenes.WinPrompt = function() {
	var enc  = this;
	SetGameState(GameState.Event, Gui);

	var parse = {

	};

	if(party.Num() == 2)
		parse["party"] = " and " + party.Get(1).name;
	else if(party.Num() > 2)
		parse["party"] = " and your companions";
	else
		parse["party"] = "";

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("You[party] stand down as the defeated equines slump to the ground, panting with exhaustion. The pair exchanges resigned glances, weakly holding hands as they brace themselves for whatever abuse you intend to inflict. The way they fidget indicates that they might even be excited by the prospect.", parse);
		Text.Flush();

		//[name]
		var options = new Array();
		if(player.FirstCock()) {
			options.push({ nameStr : "Fuck her",
				func : function() {
					EquineScenes.WinFuckHer(enc);
				}, enabled : true,
				tooltip : "This rowdy mare gave you a hard time - it’s only proper you return the favor..."
			});
			options.push({ nameStr : "Fuck him",
				func : function() {
					EquineScenes.WinFuckHim(enc);
				}, enabled : true,
				tooltip : "You’re in the mood for a little role-reversal; this time, <b>he</b> gets to be the mare."
			});
		}
		if(player.FirstVag()) {
			options.push({ nameStr : "Ride him",
				func : function() {
					EquineScenes.WinRideHimVag(enc);
				}, enabled : true,
				tooltip : "Time for a little rodeo. Mount up!"
			});
		}
		/* TODO
		options.push({ nameStr : "Leave",
			func : function() {

			}, enabled : true,
			tooltip : ""
		});
		*/

		Gui.SetButtonsFromList(options, true, function() {
			Text.NL();
			Text.Add("However, you aren't interested in taking that kind of tribute right now. You content yourself with rifling through their meager belongings, getting in a quick grope on one or the other just to hear them moan. You stow your loot and turn on your heel, leaving your foes to stare after you in confusion and relief... and perhaps a bit of disappointment.", parse);
			Text.Flush();

			Gui.NextPrompt();
		});
	});
	Encounter.prototype.onVictory.call(enc);
}

//TODO
EquineScenes.WinFuckHim = function(enc) {
	var mare     = enc.mare;
	var stallion = enc.stallion;

	var p1cock = player.BiggestCock();
	var allCocks = player.AllCocksCopy();
	for(var i = 0; i < allCocks.length; i++) {
		if(allCocks[i] == p1cock) {
			allCocks.remove(i);
			break;
		}
	}

	var parse = {		
		cocks2 : function() { return player.MultiCockDesc(allCocks); }
	};

	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

	if(party.Num() == 2)
		parse["party"] = " and " + party.Get(1).name;
	else if(party.Num() > 2)
		parse["party"] = " and your companions";
	else
		parse["party"] = "";

	var longCock = p1cock.Len() > 25;

	Text.Clear();
	Text.Add("As you[party] stand down, you can't help but glare at the prone stallion. Throughout the skirmish, something about his overconfident demeanor rubbed you the wrong way. It might behoove him to experience a dose of humility, lest that inflated sense of superiority leads him into trouble someday - or trouble into him, as it were. A sly grin creases your lips at this as you decide that the only fitting recompense would be for him to rub you the <i>right</i> way... and not with his hands, either.", parse);
	Text.NL();
	Text.Add("You pay the mare no heed as you pull her partner upright, forcing him clumsily onto his knees before you. The stallion looks up at you with a confused and slightly dazed expression, uncertain of what you want from him. His twitching, semi-erect cock - fully exposed through the ruined shreds that once formed his leather loincloth - indicates that even now, he is at least partly hoping for something of a sexual nature. Though you intend to indulge him, you are quite certain that his fantasies are a far cry from what you have planned for him.", parse);
	Text.NL();
	Text.Add("To answer his unspoken query, you unfasten your [armor] and let it fall to the ground. Loosed from [itsTheir] confines, your [cocks] spring[notS] outward and bop[notS] him on the nose, eliciting a surprised snort from the equine. You are so amused by his reaction that you almost don't notice his thick member growing a bit more rigid, but the faint movement catches your eye and causes your smirk to widen. Does the once-proud stallion swing both ways? Is he simply an exhibitionist, perhaps? Does he just like having a nice big dick in his face?", parse);
	Text.NL();
	Text.Add("Your questions make his cheeks flush red with embarrassment beneath his thin fur as his ears flatten against his skull, but he makes no reply. A thought flashes across your mind: your ", parse);
	if(player.HasBalls())
		Text.Add("[balls] are", parse);
	else
		Text.Add("crotch is", parse);
	Text.Add(" mere inches from his sensitive nose, and no doubt radiating musk from the exertion of your fight. Perhaps that is what affects him so?", parse);
	Text.NL();
	Text.Add("As an experiment, you abruptly shove your crotch forward until his nostrils are buried firmly against the base of your [cocks]", parse);
	if(player.HasBalls())
		Text.Add(", his breath caressing your [balls] and causing you to gasp", parse);
	Text.Add(". Shocked out of his stupor, the stallion tries to jerk his head away, but you tangle your fingers in his mane and pull him back into place, chastising him for moving without your permission. The friction of his muzzle against your package has awakened your [cocks], and [itThey] slowly swell[notS] and stiffen[notS]. From your vantage point, ", parse);
	if(player.NumCocks() > 2)
		Text.Add("it looks like the stallion tried to literally eat a bag of dicks - and failed.", parse);
	else if(player.NumCocks() == 2)
		Text.Add("they seem to be pointing accusingly at the stallion's eyes, as though trying to stare him down.", parse);
	else
		Text.Add("it appears as though the stallion is growing a dick from the end of his nose like a perverse rhino horn.", parse);
	Text.NL();
	Text.Add("You giggle at the sight, but another hot breath against your crotch and the equine's irritated squirming brings you back to the task at hand. You release the horse's head and he pulls away as fast as he can, allowing you to admire his humiliated fluster and the confused erection jutting upward from between his muscled thighs. Satisfied that you have established the pecking order around here, you gesture at your [cocks] with a flourish.", parse);
	Text.NL();
	Text.Add("You inform the equine that you are not quite hard enough yet, suggesting that he put his tongue to work for you. The stallion blanches at the order, but relents quickly enough after you pierce him with an icy stare of disapproval. Tentatively, he leans his muzzle a fraction closer to your throbbing meat, extending his tongue for an experimental lick. The flexible organ feels hot against your sensitive skin as he drags it upward, his inexperience plain but easy to ignore. He reaches the tip, then moves downward to start at the base again, his awkward movements speaking volumes of how odd he feels about being at the wrong end of a blowjob. It hardly matters; this is all just preparation for what comes next, you tell yourself with a smirk.", parse);
	Text.Flush();

	world.TimeStep({minute: 10});

	//[Get blown] [Fuck his ass]
	var options = new Array();
	options.push({ nameStr : "Get blown",
		tooltip : "Time to put a cock in that cocky mouth of his.",
		func : function() {
			Text.Clear();
			Text.Add("Since he's already down there, you decide to provide the stallion a thorough lesson in how to give a proper blowjob. His awkward licking would almost be endearing under different circumstances, but right now, he is little more than your plaything - and it's about time he started acting the part. Your fingers bury themselves in his mane once more, and you pull his head back just a little, forcing his gaze to meet yours.", parse);
			Text.NL();
			Text.Add("You favor him with a lascivious smile and remark that he seems to be a bit new at this. But he shouldn’t worry; by the time you’re through with him, he'll be the best cocksucker in the land. The equine shudders involuntarily at what you're suggesting, his eyes darting to anything but you, but he does not reply. The sudden jerk and throb of his pulsating prick, however, gives you an idea of the internal war he is fighting against his baser instincts. Despite your earlier irritation at his bravado, you feel a hint of sympathy for the pathetic state in which he now grovels. Your hand is suddenly soft upon his cheek, and his uncertain gaze meets yours again. Your smile is as soft as your touch, making the stallion blush red under his fur and his lower lip tremble slightly.", parse);
			Text.NL();
			Text.Add("You coo at him to relax. Putting every ounce of comfort and encouragement you can into your words, you tell him that there’s no shame in enjoying himself. Even the strongest warriors like to let someone else be the alpha once in a while. He should just let go, and make the best of it. No one will judge him for that.", parse);
			Text.NL();
			Text.Add("The stallion appears almost shocked by your statement, as if he can't fathom how you deduced his predicament. His expression wavers between apprehensive and hopeful, and he casts a glance at his mare to gauge her response. The mare, having regained some of her stamina, winks and nods in encouragement, then gets up and meanders a small distance away. The way she plops down against a nearby stump with her legs spread and begins diddling her slit informs the both of you that she is content to wait for the show to begin. Apparently, this acquiescence changes the stallion's outlook considerably; perhaps he had been worried about garnering the disdain of his companion?", parse);
			Text.NL();
			Text.Add("Either way, the nod was all he needed to re-affix his gaze upon your [cocks] with an expression more akin to wonder than his previous discomfiture. He reaches out with one hand, only to stop himself, meekly looking up at you to seek your approval. Your smile broadens and you make a gesture to indicate that he is free to indulge his curiosity. The equine swallows nervously, but returns his attention to your crotch, his thick hand touching and then wrapping around[oneof] your rigid shaft[s]. It is amusing to watch the thoughts play across his face as he gives you a few tugs and strokes, fascinated by the alien sensation of cockmeat in his hand that is not his own.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("He continues on like this for a few minutes ", parse);
				if(player.NumCocks() > 1)
					Text.Add(", exploring each of your increasingly-sensitive shafts in turn ", parse);
				Text.Add("until he gets a bit overzealous and squeezes you hard enough to cause pain, at which point you have to call him to task. He looks mortified until you reassure him, suggesting instead that he try using his mouth. But watch the teeth - he's aiming to make his mouth feel like a pussy, and he wouldn't want to put his own dick in a pussy that bites, would he? The stallion cringes at the thought, and you feel as though your point is made. He leans in to drag his tongue up the length of ", parse);
				if(player.NumCocks() > 1)
					Text.Add("the nearest of your [cocks], allowing his hands to gently pleasure your other shaft[s2] as well,", parse);
				else
					Text.Add("your throbbing shaft,", parse);
				Text.Add(" then gathers all of his courage and resolutely slurps the first few inches into his open mouth.", parse);
				Text.NL();

				Sex.Blowjob(stallion, player);
				stallion.FuckOral(stallion.Mouth(), p1cock, 2);
				player.Fuck(p1cock, 2);

				Text.Add("You gasp at the hot wetness that suddenly encompasses your shaft, the sensation of the inexperienced stud's tongue brushing the underside of your glans. The horse freezes, flattening his ears against his head and looking up at you meekly, afraid that he might have done something wrong. You scratch behind his ear and smile, assuring him that you were merely surprised, and that he should keep going. Emboldened, he resumes fellating you with all the gusto he can manage. His motions are stiff and awkward, but as you encourage and instruct him in between grunts of pleasure, he becomes more confident of his actions and settles into a sustainable rhythm. You take odd pleasure in broadening the dominant equine's horizons like this, though he seems to be doing most of the work.", parse);
				Text.NL();
				Text.Add("Quite by accident, the horse's tongue grinds against a sensitive spot on the underside of your shaft, milking a splash of pre-cum from your tip that coats the inside of his mouth. The male's eyes widen in shock, apparently having forgotten that particular mechanic of arousal. To your surprise, he doesn't pull away. Instead, a deep blush tinges his cheeks beneath his fur, and his eyes slide shut as he concentrates on trying to lick <i>around</i> your meat to clean the thick fluid from the interior of his maw. The feeling almost makes you giddy as the flexible organ's undulations milk a few more spurts from you, some of which you can feel hitting the back of his throat, causing him to swallow reflexively.", parse);
				Text.NL();
				Text.Add("Whatever initial reluctance he may have felt, it's clear that he’s truly starting to enjoy being dominated like this. The proudly-erect column of horse meat jutting out and twitching up at you and slowly oozing pre does nothing to dissuade you of the notion. The stallion's increasingly eager sucking is bringing you close to climax far faster than you had anticipated, and you tangle your fingers in his hair once again to pull him off of your meat with a loud slurping sound. He looks up at you in a daze, panting and drooling a bit as thin strands of pre-cum stretch between his lips and your tip. He tries to aim a questioning gaze up at you, but his lust-addled eyes keep wandering back down to your [cocks] that glisten[notS] with his saliva and your own lubricant.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("A wicked thought crosses your mind. Seeing at how compliant the stallion has become, you tousle his hair and tell him to behave himself for a moment while you get something <i>fun</i>. He is too bewildered to disobey as you lean toward him, your exposed package bouncing freely in the breeze. You snag the loincloth from his hips, tearing off what you don’t need until all that is left is a long strap of cloth. Giving it a quick tug to ensure its tensile quality, you twist the strap around your hands and pull it taut before your new pet’s nose so that it makes a light <i>twang</i> sound. You straighten it and begin tying a loop in one end of the material, making sure to jiggle your junk as much as possible in the equine’s face as you work. As you tie the final knot, you “accidentally” let your tip leave a slimy kiss on the end of his nose, making his nostrils flare as he huffs in your scent. The stallion cannot restrain the urge to let his tongue dart out, giving the underside of your shaft a wet caress before you can pull it away. The gesture makes you shiver involuntarily, and you offer half-chuckling, half-moaning praise for his zeal.", parse);
					Text.NL();
					Text.Add("Bending forward again, you press a hand to his muscular chest and push, forcing him to lean backwards over his folded legs until he has to support himself with both arms, stretching out his torso and putting his throbbing dick and swollen ballsack on full display. With a playful grin, you slide the makeshift lasso around the base of his genitals, lightly cinching the noose snug like a cockring on a leash. You straighten it, and give the strap an experimental pull. Something between a groan and a yelp bursts from the equine, and he has to bite his lip to keep from adding more as another tug causes his sack to bulge and the veins on his cock to vividly pulsate.", parse);
					Text.NL();
					Text.Add("To help steer him in the right direction, you offer as explanation. Time for him to show you what he's learned. If he's a good little cocksucker, you might even let him cum. You flick the loose end of the strap in your hand across the flared tip of his cock, and a visible tremor wracks his entire frame. You pull on the leash just hard enough to cut off any chance his tortured testes might have had at unleashing prematurely, and he whinnies in distress. We are clear, you take it? You accept his frantic nodding with an approving smile. Good. Well, come on then. You urge him to put that mouthpussy to work.", parse);
					Text.NL();
					Text.Add("The stallion throws himself forward and buries his long muzzle in your crotch, licking your ", parse);
					if(player.HasBalls())
						Text.Add("[balls] and ", parse);
					Text.Add("[cocks] with almost rabid fervor, teasing every inch of flesh he can reach with his tongue and hands until you are as hard as you've ever been in your life. He has completely resigned himself to being your cockslut, so there is no hint of hesitation or shame in his actions; for now, his entire world extends no further than your crotch. With one final long lick up[oneof] your shaft[notS], he lines up the tip with his mouth, his flexible muscle extended just past his lower lip to cradle your glans. Before you can react, he grabs your hips with both hands and impales his face onto your shaft all the way to the hilt.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						Text.Clear();
						if(longCock) {
							Text.Add("You gasp in shock - and with a hint of concern - as the full length of your sizable shaft squeezes through the horse's mouth and into the greater tightness of his throat. While you appreciate his enthusiasm, he may have bitten off more than he can chew, figuratively speaking. You can feel the equine gagging and swallowing convulsively around your shaft, and you consider pulling out to offer him respite, but his hands firmly hold your hips in place and refuse to let go. He seems determined to prove that he can master the task you have given him, whatever the cost. Even as tears streak from the corners of his clenched eyelids, he keeps his jaw relaxed and forces his swallowing to slow down, acclimating himself to the intrusion through sheer willpower.", parse);
							Text.NL();
							Text.Add("Once his diaphragm has calmed and his throat is no longer spasming, he pulls away just far enough to breathe, keeping as much of your dickflesh in his muzzle as he can manage. A couple of deep breaths later, he takes you all the way in again. His throat is far less reactive this time, much to his relief as well as yours, and his swallowing is less about his gag reflex and more about pleasing you. Having recovered from his brash decision, he resumes the familiar rhythm he had established prior to your interruption, although a bit slower at first. It doesn't take long for him to grow accustomed to the penetration, and he gradually quickens his pace.", parse);
						}
						else {
							Text.Add("You gasp in shock as your entire rod is suddenly engulfed in the hot, fleshy confines of the stallion's mouth. Though you are not quite well-endowed enough to give the horse a proper throat-fucking, his elongated maw makes up for it, exciting every nerve on your shaft with velvety wetness. It's clear that the equine was not fully prepared to take you all at once, as the sensation of your full length tickling the back of his tongue triggers his gag reflex.", parse);
							Text.NL();
							Text.Add("You stroke his head and offer to pull back, but his hands remain on your hips, firmly holding you in place. It would be a pity to put all his effort to waste, and he is in no danger of suffocating, so you let him handle it at his own pace. It takes a few moments of swallowing and steady breathing, but soon he seems to have his throat under control again. Having recovered from his brash decision, he resumes the familiar rhythm he had established prior to your interruption.", parse);
						}
						Text.NL();
						Text.Add("You allow yourself to relax and enjoy the sensations, your eyes sliding shut and your head tilted back as you focus on the pleasure radiating from your groin. For the first few minutes, you have to give his leash a tug or two when his enthusiasm surpasses his caution, subjecting your tender rod to an overly strong suckle or a slight tooth drubbing. Fortunately, he takes the instruction in stride and corrects himself right away, and soon you barely have need of the leash at all. You lose yourself in the ecstasy washing over you, losing track of time until you are startled by a thick finger gently penetrating your [anus], searching for your prostate", parse);
						if(player.HasBalls())
							Text.Add(" while the stallion's other hand reaches up to gently fondle your [balls]", parse);
						Text.Add(". You grit your teeth at the sensations bombarding your senses, attempting to withstand the onslaught as long as possible. A quick glance to the side tells you that the mare is still happily fingering herself into a frenzy, her own orgasm looming.", parse);
						Text.NL();
						Text.Add("You are determined to outlast the mare, so you will yourself to calm down, doing your best to hold out for just a few more seconds even as you feel your endurance crumbling. But the stallion chooses that moment to suck your length as far into his gullet as it will go, just as his searching digit finds the hard nub of arousal inside you and presses upward. The white-hot glow that spreads through your nethers kicks your body into overdrive, and both of your hands lash out to seize the stallion by the skull as you instinctively begin face-fucking him with wild abandon.", parse);
						Text.NL();
						Text.Add("Your reason and sense is gone - all that matters is filling the equine's hole with as much spunk as you can muster. A tiny voice in the back of your mind tells you that you may be injuring the inexperienced horse with such brutal humping, but the thought is quashed as he continues prodding your prostate, doing his best even now to milk you like the cocksucker you're training him to be. A few more desperate thrusts, and you groan loudly as you feel the pressure of your imminent release churning through your groin.", parse);
						Text.Flush();

						world.TimeStep({minute: 20});

						//[Cum Inside] [Cum Outside]
						var options = new Array();
						options.push({ nameStr : "Cum inside",
							tooltip : "Down the hatch!",
							func : function() {
								Text.Clear();
								parse["throatMuzzle"] = longCock ? "throat" : "muzzle";
								parse["stomachMouth"] = longCock ? "stomach" : "mouth";
								Text.Add("With a guttural roar, you shove the stallion's nose against your pelvis with brutal force, burying your length firmly in his [throatMuzzle] as white-hot cream explodes from your tip. You shudder as waves of ecstasy overtake you, your whole body shaking with each gush of sperm that blasts its way directly into your new cockslut's waiting [stomachMouth].", parse);
								Text.NL();

								var cum = player.OrgasmCum();

								if(player.NumCocks() > 2)
									Text.Add("The rest of your [cocks2] do a splendid job of glazing his face, his chest, and most everything else in the immediate vicinity. It quickly becomes a rather large mess. ", parse);
								else if(player.NumCocks() == 2)
									Text.Add("Your other cock fires additional loads indiscriminately about you, shooting wads of your spunk all over the stallion’s face and back. A particularly large pulse makes your shaft twitch back toward you, splattering your chest with a sizable splotch of your own juices. It quickly becomes a rather large mess. ", parse);

								if(longCock) {
									if(cum > 3) {
										parse["th"] = player.HasLegs() ? "r thighs" : "";
										Text.Add("Your orgasm seems endless, and the stallion's abdomen begins to distend with each pulse of your seed that pours down his gullet. With his throat plugged by your cock, there is nowhere for your massive load to escape even after his guts are packed, so his belly continues to inflate to a dangerous degree. You feel his hands tighten their grip on you[th], but he does not try to push you away despite the discomfort he is no doubt experiencing.", parse);
										Text.NL();
										Text.Add("Finally, your climax abates, and you slide your softening prick from his mouth with a loud, wet squelch. At first, the stallion does his best to keep down the pressurized load, even clamping a hand over his mouth as some of it climbs up his esophagus and splashes into his mouth. A small amount even manages to squirt out of his nostrils, but he valiantly continues his struggle until he feels your hand on his head. He looks up at you pitifully, your spunk drooling out of his nose and making his cheeks bulge, and you smile down at him with pride.", parse);
										Text.NL();
										Text.Add("Stroking between his ears, you commend him on doing so well, but instruct him to let it all out before he hurts himself. That is all the encouragement he needs. He doubles over and clenches his eyes shut as what seems like gallons spew forth from his open mouth in viscous, sticky globs. It splashes all over him and the ground, coating his legs and bulging stomach with a satin sheen and leaving him kneeling in a white pond. No longer clogged with jizz, he takes a few gasping breaths and clutches at his still-swollen middle.", parse);
									}
									else {
										Text.Add("Your mind is buzzing with the exquisite pleasure of climax, reveling in the tightness of the stallion's virgin throat. He obliges by swallowing around your shaft, milking you for every drop you can muster as his throat muscles send ripples of electricity down your sensitive flesh. You reward your pet with several blasts of thick, hot spunk, regretting only that you are too far down his gullet for him to truly savor the flavor of your gift.", parse);
										Text.NL();
										Text.Add("Finally, you are spent. You slowly extract your shaft from his mouth with a loud, wet squelch, managing to squeeze one last trickle over his tongue on your way out. He surprises you by giving your one last quick suckle before your tip slides past his lips, and he opens his maw to show you the last of your load soaking into his taste buds before dutifully swallowing the offering. You scratch between his ears and chuckle in amazement; you never expected the aggressive stud to adjust so well to being dominated.", parse);
									}
								}
								else {
									if(cum > 3) {
										Text.Add("The stallion is not prepared for the deluge that you provide him. His mouth is filled almost instantly, his cheeks bulging out while excess jizz sprays down his throat, out of his nose, and past his lips to splatter across your crotch. He does his best to swallow as much as possible, but you are simply too virile for him to handle. For every glob that makes it into his belly, another gets forcefully ejected from his mouth or nose. You moan in happiness as you empty yourself into the hapless equine, too engulfed in pleasure to give much thought to his predicament.", parse);
										Text.NL();
										Text.Add("After one last throb, your climax draws to a close, and you pull your shaft from the stallion's muzzle with a wet <i>schlick</i>. Your head clears, and you look down to survey your handiwork, smirking at the sight. The stallion is gasping for air, occasionally belching up a bit of your seed only to attempt to swallow it back down again. With as swollen as his stomach appears, you know that cannot be an easy task, but he is making a worthy effort. The outside of the equine has fared no better than the inside, with his muzzle and most of his body coated with a thick, white glaze of cum. His mouth hangs open slightly, his spunk-drenched tongue partially extended as though waiting for you to feed him your cock again. When you scratch behind his ear and indicate that you are spent, it takes a moment for your words to register in his cum-addled mind.", parse);
									}
									else {
										Text.Add("As soon as he feels the first blast hit his tongue, the stallion clamps his lips around the base of your shaft and attempts to apply light suction, determined to milk every drop out of you in any way he can. Waves of pleasure crash over you as you fire off every drop you can muster onto the equine's waiting tongue, catching a hazy glimpse of his cheeks bulging out slightly as your load tapers off to nothing. You leave your cock buried in his muzzle for a few moments, reveling in the sensation of your dick being caressed by the stallion's flexible organ even as it swims in a pool of your jizz. Spent, you slowly pull free of the long muzzle, though the equine manages to give your tip one last suckle as it retreats.", parse);
										Text.NL();
										Text.Add("Once you recover from the invigorating exertion, you favor the stallion with an appraising glance. His cheeks remain puffed out with your sperm, letting his tongue bask in the taste as he meets your gaze. He tilts his head back and opens his mouth to show you the load you bequeathed upon him, then closes it again as he swallows it all in one loud gulp. You smirk at the display, and praise him for his exemplary performance. He offers a weak smile, still trying to catch his breath after your powerful face-fucking.", parse);
									}
								}
								Text.Flush();

								world.TimeStep({minute: 10});

								Gui.NextPrompt();
							}, enabled : true
						});
						options.push({ nameStr : "Cum outside",
							tooltip : "Make him a pretty painted pony.",
							func : function() {
								Text.Clear();
								Text.Add("You pull back sharply so that your rigid shaft frees itself from the stallion's lips with an audible pop. Surprised by the sudden action, the stallion emits something between a grunt and a frustrated groan; but he can tell you are on the verge of orgasm, so he opens his mouth and lets his tongue hang out expectantly. All at once, your climax crashes over you like a tidal wave, and you cannot contain your load as it explodes from your [cocks] and arcs through the air, directly at the equine's upturned face.", parse);
								Text.NL();

								var cum = player.OrgasmCum();

								if(cum > 3) {
									Text.Add("A veritable tsunami of spooge hits the poor stud full in the mouth with such force that it rocks him backward slightly, causing him to sputter and cough. He doesn't get much respite as another blast quickly follows the first, catching him in the chin and painting his neck and chest white.", parse);
									Text.NL();
									if(player.NumCocks() > 1)
										Text.Add("The stallion is bombarded from all angles by your [cocks], spewing urethra-stretching loads in every conceivable direction, but mostly at the kneeling equine. Having managed to recover from his initial surprise, he resumes his original pose - eyes closed, mouth open, tongue out - as you coat every inch of him with your seed.", parse);
									else
										Text.Add("The stallion is bombarded by your urethra-stretching loads, coating him so thickly that some of his physical features lose definition beneath layers of viscous fluid. Having managed to recover from his initial surprise, he resumes his original pose - eyes closed, mouth open, tongue out - as your pulsating cock relentlessly hoses him down.", parse);
									Text.NL();
									Text.Add("Your whole body shudders with ecstasy, wracked from within by pleasure bordering on pain that accompanies each throbbing expulsion. The pent up pressure is so intense that your pelvis is propelled backwards with each pulse of release. In the back of your mind, you feel a modicum of pity for the equine; he has to be holding his breath beneath the deluge to keep himself from drowning.", parse);
									Text.NL();
									Text.Add("After a blissful eternity, your orgasm tapers off to a slow drip. You gradually regain your senses, drinking in deep lungfuls of air while doing your best to remain standing upright. A glance at the stallion almost makes you giggle. He is frozen in place, uncertain of whether or not he is allowed to move, while cum drips from every inch of him. Feeling benevolent, you reach over and wipe the worst of the goo from his face, and when he blinks up at you dazedly, you favor him with a warm smile. He unceremoniously swallows the sperm that pooled in his mouth and on his tongue, then expels the breath he had been holding in a great gust, offering a weak smile in return despite gasping for air.", parse);
								}
								else {
									Text.Add("You blast the equine's mouth and muzzle with as much hot, slimy seed as you can churn out. Sticky ropes crisscross his elongated countenance, slowly oozing down his cheeks and marking him as yours. His eyes slide shut and he opens his mouth wider, doing his best to catch as much on his tongue as possible.", parse);
									Text.NL();
									if(player.NumCocks() > 1)
										Text.Add("Your [cocks] add to the mess, firing off in multiple directions at once, though most still splash onto the kneeling equine. An errant shot manages to hit him square in the nostril, but he doesn't seem to notice with all of his concentration focused on lapping up your jizz. He can't help but notice, however, when another jet splatters against the flared tip of his rigid cock. The sensation on his hypersensitive organ makes his balls almost audibly swell with need, and he groans aloud.", parse);
									else
										Text.Add("You manage to aim most of your load into his eager mouth, though your cockflesh is so hypersensitive that it is almost painful to touch. As such, a few errant shots of cum catch him on the eye, in the ear, and over his broad chest as you struggle to maintain control between bolts of incredible ecstasy. He doesn't seem to notice the misfires until a stray shot hits the flared tip of his rigid cock. The sensation on his hypersensitive organ makes his balls almost audibly swell with need, and he groans aloud.", parse);
									Text.NL();
									Text.Add("After a blissful eternity, your orgasm tapers off to a slow drip. You gradually regain your senses, drinking in deep lungfuls of air while doing your best to remain standing upright. A glance at the stallion almost makes you giggle. He still hasn't moved; his tongue is still outstretched as if expecting you to gift him with more seed. Though you have none left to give, you decide to make use of him one more time. You carefully move your crotch closer to his mouth, then take a gentle hold of your softening member and rub the head against his large, soft tongue.", parse);
									Text.NL();
									Text.Add("The stallion's eyes flutter open in surprise, then they take on a smoky haze as he allows his flexible organ to be used. It is difficult to maintain your composure; the sensation is like white-hot pins and needles against your overstimulated flesh. You manage to smear one final trickle of cum across the tip of his tongue and across his upper lip before you have to pull away. Sensing that you are finished, the stud tilts his head back a bit farther to allow your cream to slide languidly down his throat. He appears to have embraced his role as your cockslut so completely that he is actually reveling in the taste of your sperm, enjoying it like a tasty treat. Finally he swallows, and looks up at you for a sign of approval. You smile, and nod.", parse);
								}
								Text.Flush();

								world.TimeStep({minute: 10});

								Gui.NextPrompt();
							}, enabled : true
						});

						Gui.Callstack.push(function() {
							Text.Clear();
							Text.Add("The equine sits back shakily on his hooves, visibly enervated by the exercise although his turgid erection indicates that he is still painfully aroused. You look down and realize that you pulled your makeshift noose taut around the equine's package whilst you came, effectively cutting off his release. Your gaze shifts to the stallion's face, grinning at the haze of lust that still fogs his eyes as he pants, his tongue lolling out a bit and strands of your sperm dripping from his chin to his chest. He has been such a good cockslut - and you did say that you might reward him if he pleased you.", parse);
							Text.NL();
							Text.Add("You glance at the forgotten mare, who seems to have fingered herself to climax quite a while ago and is reclining luxuriantly against the stump, immersed in the afterglow. No reason for her to be left out, you muse to yourself. You call out to her, beckoning for her once her languid gaze re-affixes upon you. The mare obeys, as much out of curiosity as acknowledgment of your victory, and kneels next to her partner before you, looking up at you with an expression of inquiry.", parse);
							Text.NL();
							Text.Add("You indicate that her partner seems a bit pent up. A sly grin plays across your features as you ask if she would be so kind as to help him release some… <i>pressure</i>. The mare's countenance turns sultry, and she leans to the side to give the stallion's twitching cock a long, sensual lick. She makes sure to position herself so that you get the best possible view of the action, occasionally throwing a coy glance in your direction as she services the stud. Her lips and tongue dance across his swollen shaft with the ease of much practice; she leans up to pause at his tip for dramatic effect before plunging downwards, engulfing most of his meat with a single motion.", parse);
							Text.NL();
							Text.Add("You wince a little in sympathy for her throat, but she seems accustomed to such violent penetration, and begins fellating the stallion with gusto. You watch her work for a few moments, enjoying her partner's moans as he dangles on the precipice of ecstasy, then decide that the male's tortured testes have been denied long enough. You bend down and reach under his throbbing balls, and tweak the leather strap loose.", parse);
							Text.NL();
							Text.Add("The stallion emits a strangled cry of relief as his climax launches forth with incredible speed, catching the mare completely off guard. Half of the first wave fires straight down her throat, while the other half inflates her cheeks and sprays out past the imperfect seal of her lips. She tries to pull back, but the stallion's hands clamp down on her head and force her downward until her nose is pressed against his scrotum. The mare's eyes roll back in her head as glob after glob of thick cream is injected into her guts, her abdomen bloating slightly.", parse);
							Text.NL();
							Text.Add("The bombardment on his senses finally over, the stallion emits a delirious whinny and passes out into the spoogey mud. As he topples to the side, his cock slides out of the mare's throat, leaving the female to gasp air into her starved lungs. Shaking with exhaustion, the mare tries to sit upright to meet your gaze. Lacking the strength to support herself, she collapsing atop her insensate partner. You smirk down at the jizz-covered couple, admiring the aftermath of your efforts.", parse);
							Text.NL();
							Text.Add("You chuckle at them, making a jibe about class being dismissed as you clean yourself off as best you can. Satisfied, you collect your scattered gear and return to the road[party].", parse);
							Text.Flush();

							world.TimeStep({minute: 15});

							Gui.NextPrompt();
						});

						Gui.SetButtonsFromList(options, false, null);
					});
					
				});
				
			});
			
		}, enabled : true
	});
	options.push({ nameStr : "Fuck his ass",
		tooltip : "Teach the randy pony what it <i>really</i> means to ride bareback.",
		func : function() {
			Text.Clear();
			Text.Add("You tangle your fingers in the stallion's mane and pull him toward you, taking a step backward so that he is forced to get on all fours in order to keep from face planting into your crotch. You order him to keep his ass as high in the air as he can while he services you, quelling his odd look with a quick cockslap to the cheek. Suitably cowed, the stallion resumes attending your [cocks], arching his back slightly to keep his rump pointed skyward. He even lifts his tail to drape over his lower back, though whether or not this was intentional is debatable. While the stud is otherwise occupied, you snap to get the mare's attention, beckoning her closer. She hesitantly complies, crawling toward you on all fours as her gaze flits between you and her mate's uncharacteristic behavior. You gently tilt her chin upward with one hand, forcing her to look into your eyes, and smile at her.", parse);
			Text.NL();
			Text.Add("You observe that the stallion is not usually the one being ridden, casting a meaningful glance at the stallion's hindquarters that remain on proud display as you speak. Seeing as she is in no position to argue, you ask her if she would be kind enough to assist by <i>preparing</i> him for you. The mare appears confused for a brief moment, then her ears flatten to her head and she blushes, fidgeting with uncertainty at the alien idea. Clearly, she's never been called on to perform this particular service for her mate, nor anyone else. The stallion overhears your command and pauses mid-lick, staring at the two of you with wide, apprehensive eyes. You glare at him, and a yelp catches in his throat as he hastily reapplies his tongue to your shaft, though his eyes remain somewhat frantic.", parse);
			Text.NL();
			Text.Add("You return your gaze to the mare. Though your smile has returned, there is a hint of steel behind your eyes as you look down at her. The significance is not lost upon the shapely equine, as her eyes become fearful and her lower lip trembles slightly. You brush your thumb over her lip to ease her concern, the foreboding in your gaze gone as fast as it appeared.", parse);
			Text.NL();
			Text.Add("You tell her in no uncertain terms that this isn't a request, though you keep your tone calm and even. You expect her to be a good girl and get him ready for you, lest you decide to ride <i>her</i> bareback, instead. The mare closes her eyes and swallows mightily, giving a faint nod of assent. You release her chin, and she crawls around to take position behind the stallion. You glance down and have to stifle a giggle at the stud's expression. His eyes are wide as saucers, panicking at the uncharted territory through which he is being forcefully led.", parse);
			Text.NL();
			Text.Add("His fear of reprisal from you is the only thing keeping his tongue slathering your rod with saliva and his ass bared to the heavens, though even that resolve is wavering as his hindquarters tremble and jerk anxiously. You bury your fingers into his thick mane once again, as much to reassert control as to position yourself for a little something extra. You see the stallion tense as the mare lays her hands on either side of his crack, spreading him wider to gain better access to his pucker. Without further ado, she drags her flat tongue up his taint and across his clenched asshole.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("The stallion cries out in surprise, and you seize that moment to line up[oneof] your shaft[s] with his open mouth and slide in, muffling his shock with a mouthful of cockmeat. The equine is too focused on what is happening to his hindparts to pay much attention to your intrusion, allowing you to enjoy his mouth more thoroughly as the mare tries to lick the stallion's ass into pliancy. You indulge yourself, using the stud's long muzzle as a cocksleeve to make sure you are nice and hard for the next stage of this little rodeo. His warm, wet mouth and tongue feel marvelous around you, aided by the vibrations from his occasional grunt or moan that tries to escape around your member. Assailed from both ends, the thickly-muscled equine puts forth no resistance, his eyes squeezed firmly shut as he tries to acclimate to the strange, not-entirely-unpleasant sensations.", parse);
				Text.NL();

				Sex.Blowjob(stallion, player);
				stallion.FuckOral(stallion.Mouth(), p1cock, 1);
				player.Fuck(p1cock, 1);

				Text.Add("You notice the mare's brow furrowed in concentration, as though she isn't making much progress. Considering how frantic the stallion looked earlier, you wouldn't be surprised if his rectum was locked down with a vengeance. You continue facefucking the stud as you ponder a solution. Perhaps he simply needs the right stimulation to loosen him up. You get the mare's attention, and make a couple of gestures to indicate what you're thinking. The mare understands immediately, something akin to a sultry grin replacing her prior consternation, and you see her hands withdraw from her partner's ass and disappear down below him. A moment later, the stallion's eyes rocket open, and he does his best to whinny around your cock.", parse);
				Text.NL();
				Text.Add("If his increasingly dreamy expression is any indication, it would seem the mare has taken the hint and started playing with her partner's package in an attempt to help him relax. It is apparent that she knows how to push the stud's buttons in just the right way; barely a minute has passed, and the masculine equine is involuntarily pushing his ass back against her tongue, his hips jerking forward every so often as the mare plays him like a fiddle. A few more minutes tick by, and now the stallion is so far gone that he has even begun absentmindedly sucking on your cock, becoming a slave to the pleasure he is receiving.", parse);
				Text.NL();
				Text.Add("You almost pity the poor fellow; his sex life must be a blur of hard, fast fucking that leaves no room for subtle nuances of passion and eroticism. Well, no time like the present to broaden his horizons. A faint splash of liquid hits the ground near your [feet], and you realize that the stud is firing off pre-cum thanks to the double-ended assault. But you don't want him finishing just yet - you still want to take him for a ride first.", parse);
				Text.NL();
				Text.Add("You tell him to stop, pulling your shaft from the stallion's mouth a bit too quickly. You gasp a bit as the air hitting your cock feels almost frigid after the sweltering heat of his muzzle. The mare straightens, panting slightly, while the stallion simply wavers on all fours, trying to focus on you through a haze of pleasure as he wonders why the stimulation stopped. You regard the mare with a smile, telling her that she has done a marvelous job, but now it is your turn. You give her leave to relax somewhere and enjoy the show.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("The mare smiles at you and nods her assent. She gets to her hooves and sashays toward a nearby tree stump, plopping down and leaning back against the rough wood as she spreads her legs, one hand already toying with her swelling clit. Satisfied that you'll be uninterrupted, you move behind the stallion and begin to position yourself. He seems blissfully unaware of what's coming, and even presents his ass to you as though he expected to feel a tongue across his puckered hole once again. <i>Not this time,</i> you think with a smirk, as you let[oneof] your [cocks] flop down between his ass cheeks, hotdogging through the mare's saliva to aid in penetrating the stud's virgin hole. He groans happily at the feeling of something rubbing his rectum, and you can feel his balls twitch against ", parse);
					if(player.IsNaga())
						Text.Add("your smooth scales.", parse);
					else if(player.HasBalls())
						Text.Add("your own.", parse);
					else
						Text.Add("your groin.", parse);
					Text.NL();
					Text.Add("Seeing him in such a state makes you lose what's left of your restraint, and you drop the foreplay with all haste. Taking[oneof] your shaft[s] in one hand, you use your free hand to spread the equine's tight hole as much as you can as you guide your tip to prod it open. Rubbing and pushing a little at a time, you start to ease your cockhead into the virginal opening, biting your lip with the effort. The sensation is almost too much for you; the stallion's ass is deliciously tight, and his sphincter is spasming madly around the leading edge of your intruding member. Slowly but surely, you force yourself deeper and deeper into his rump. By now, the stallion has recovered from his daze enough to realize that something is amiss, but there is little he can do to stop your relentless penetration. He digs his fingers into the grassy loam beneath him, gritting his teeth as he feels his insides being violated one inch at a time.", parse);
					Text.NL();

					Sex.Anal(player, stallion);
					stallion.FuckAnal(stallion.Butt(), p1cock, 2);
					player.Fuck(p1cock, 2);

					Text.Add("Finally, you bottom out, your [hips] pressed against his ass, and you pause a moment to allow him time to adjust. You can feel his inner muscles squeezing and contracting, sometimes involuntarily, as he does his best to acclimate to your girth. Clearly, this is a new experience for the stallion, and despite his earlier arousal, he is not yet sure of his own feelings - other than the obvious. He seems to relax slightly, and you take that as your cue to start moving. You keep it slow, uninterested in causing him more discomfort than could be expected from such an exercise. After a few minutes of gently easing yourself in and out of his still-tight anus, he emits his first real moan of pleasure.", parse);
					Text.NL();
					Text.Add("You grin, and pick up the pace a bit. The moan gets louder, punctuated by a breathy “hunh” each time you thrust into him. You adjust your position to get a better angle, and accidentally rub your cock across the hardened nub of his prostate. His voice cracks and catches in his throat, then comes out as a shuddering groan of pleasure as his member swells back to full hardness and resumes spurting globs of pre-cum into the dirt.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						Text.Clear();
						Text.Add("You quite enjoy the reaction, and tell him so. You can see his ears burn red with embarrassment, but his body is beyond his control now as your shaft continues to grind against his love button, milking so much pre from him that you wonder how his balls can produce so much. As if seeking an answer to that mystery, you reach under your own [cocks] and grab his heavy ballsack, rolling his testicles around in your hand and giving them a gentle squeeze. The stallion's ass clamps down in surprise, which forces your shaft to grind even harder against his prostate. You feel his scrotum contract in a massive effort, and the stud whinnies uncontrollably as he fires off his first orgasm. Thick ropes shoot outward with stunning speed, splashing against the ground and most of the stallion's chest and arms. His ass keeps rippling around your cock, sending pleasurable shocks through your groin and making your shaft[s] grow impossibly stiff.", parse);
						Text.NL();
						Text.Add("You give his flank a slap for being such a naughty little pony, chiding him for finishing before you. Still in the throes of climax, the stallion can only reply with garbled noises and grunts. You shrug, and without decorum or warning, resume pounding into his ass - a task made more difficult by his contracting rectal muscles. The renewed assault battering his prostate causes the stud to scream in a far higher pitch than you'd consider him capable of emitting, his entire body taut as a drum and the streams of jizz blasting from his cock increasing in power and size for another few moments.", parse);
						Text.NL();
						Text.Add("You ignore the display, focusing entirely on your own pleasure from this point forward. You jackhammer his ass with relentless fervor, closing your eyes to concentrate on the feeling of his guts massaging your sensitive flesh. The equine's orgasm tapers off, but your ceaseless thrusting keeps his spent erection rock-hard and tossing strands of spooge in various directions as it bounces. His cries have reduced to rhythmic whines and gasps, but his inner muscles continue clenching around you as if trying to milk you for your sperm. With as close as you are, it won’t take much longer.", parse);
						Text.NL();
						Text.Add("Your thrusts take on a frantic pace, each movement sending bolts of pleasure up your spine. The telltale warmth glows within you, and you strain to hold out for just a little longer, although your willpower is faltering with unnerving speed. You are surprised when the stallion reaches back with trembling hands, grabbing his own ass cheeks and spreading them wider for you, his back arching ever-so-slightly more to get you as far in as he can. The gesture, the sensations, the blissed-out look on his face… it’s all too much!", parse);
						Text.Flush();

						world.TimeStep({minute: 30});

						//[CumInside][CumOutside]
						var options = new Array();
						options.push({ nameStr : "Cum inside",
							tooltip : "Pump the slut full of cum!",
							func : function() {
								Text.Clear();
								Text.Add("The submissive display sends you over the edge; you plant your hands over his and pull him forcefully back against you as you thrust forward with pelvis-bruising force, burying your [cock] to the hilt inside his pliant hole. You cry out as a blast of hot cum travels up your shaft to explode in the equine’s bowels.", parse);
								Text.NL();

								var cum = player.OrgasmCum();

								if(cum > 3) {
									Text.Add("A veritable tsunami of spooge catches the stallion off guard, and he emits a loud grunt as the flood fills him to capacity in an instant. The feeling of your seed gushing inside him makes the equine’s prick jump, his anus squeezing you tightly as a minigasm ripples through his frame. The additional stimulation just cranks your loins into overdrive, and the stallion’s grunt becomes a wail as more and more of your thick spunk swells his gut like a balloon. But rather than pull away, the stud seems intent on proving himself to you; his hands beneath yours pull his ass even wider, and he pushes his rump against you to keep your shaft lodged all the way to the hilt. You feel him clamp down, determined not to let a drop of your load escape until you are completely spent even as his stomach expands to a dangerous level.", parse);
									Text.NL();
									if(player.NumCocks() > 1)
										Text.Add("Your unattended [cocks2] do[notEs2] [itsTheir2] best to match [itsTheir2] compatriot’s enthused issue load for load, showering the prone equine from head to hoof in layers of jism and all but plastering him to the ground. A shiver visibly runs up his spine at the sensation of being coated in your essence, and his tongue languidly slides over his face to collect a bit of the treat. Finally spent, you carefully extract yourself from his spasming asshole, milking one or two last dollops of cream onto the gaping opening as you retreat.", parse);
									else
										Text.Add("Finally, you forcefully extract yourself from his spasming asshole - more for his sake than for yours - and allow yourself the luxury of jerking what remains of your inhuman load all over the equine’s prone form. There is just enough left to give him a nice white glaze from head to hoof before you are spent.", parse);
									Text.NL();
									Text.Add("Pulling your cock out of him must have inadvertently stroked his prostate again - the stud is once more creaming himself, getting most of it on the curve of his swollen abdomen. Were he a mare, you’d think he was about to give birth with a bulge that large. The equine looks up at you woozily, his eyes attempting to focus on you without much success.", parse);
									Text.NL();
									Text.Add("You congratulate him on milking you dry, bending down to scratch him behind his cum-slathered ear. The stallion gives you an exhausted grin, then his eyes roll back in his head and he groans. His whole body trembles, and suddenly his ass becomes a geyser, shooting your sperm into the air in a viscous arc as his stomach slowly shrinks to its regular proportions. It takes a moment, but his bowels are eventually emptied of spunk, and he collapses to the ground in a quivering, well-fucked pile. You chuckle to yourself.", parse);
								}
								else {
									Text.Add("You cry out as you empty yourself inside the stallion’s sweltering ass, your [hips] rocking back and forth reflexively with each spasm of pleasure that crashes through you. The feeling of the stud’s virgin ass is exquisite - a sentiment he seems to reciprocate, if the splash of horse cum hitting the ground is any indication. His internal muscles ripple and squeeze your shaft in all the right ways, and you can’t help but savor the sensation. Spirits, it’s like he’s trying to milk your cum right out of you.", parse);
									Text.NL();
									if(player.NumCocks() > 1)
										Text.Add("Your unattended [cocks2] second[notS2] the motion, spraying your meager load across the equine’s ass and back as [itThey2] flail[notS2] about. He turns his head to look back at you and manages to catch a small dollop on the side of his mouth - which he languidly licks clean. Spent, you pull out of him, smiling at the small <i>pop</i> his pucker makes as your tip is freed from his wantonly clenching sphincter.", parse);
									else
										Text.Add("Just as your climax is tapering off, you extract yourself from his anus and jerk a few small squirts across his ass and back. Nothing like putting a finishing touch on your masterpiece, after all. An errant blob makes it as far as his face, splashing against the corner of the stud’s mouth. He languidly licks it off, appearing to savor the taste even as a blush flares across his cheeks.", parse);
									Text.NL();
									parse["kneel"] = player.HasLegs() ? "kneel" : "lower yourself";
									Text.Add("Pulling your cock out of him must have inadvertently stroked his prostate again because the stud is once again creaming himself, most of the weak load splashing into the dirt between his knees. You [kneel] beside him to make sure he wasn’t overly strained by the exercise, when you are caught off guard by his mouth around[oneof] your softening shaft[s]. Apparently, he thought you expected him to clean you off like a good little slut. Though it hadn’t been your intention, you certainly aren’t going to discourage him. Enervated as he is, he still manages to thoroughly clean your [cocks] with his tongue, and you smile down at him while scratching behind his ear. You commend him on a “job” well done, slyly adding that he’ll make a fine wife for someone, one day. ", parse);
									Text.NL();
									Text.Add("The stallion smiles wearily, rolling his eyes at the blatant jibe, but taking it with good humor. He groans, and rolls over on the ground, dozing off almost instantly. You stand and leave him to recover from the ordeal.", parse);
								}
								Text.NL();
								Text.Add("You glance at the mare - curious to hear what she thought of the show - only to see her sprawled under the tree, her legs spread wide and her pussy glistening with femlube. Apparently, she jilled herself unconscious a while ago. You must have been more entertaining than you thought. Satisfied, you gather your gear[party] and return to your travels.", parse);
								Text.Flush();

								world.TimeStep({minute: 30});

								Gui.NextPrompt();
							}, enabled : true
						});
						options.push({ nameStr : "Cum outside",
							tooltip : "Give your new slut a cum bath.",
							func : function() {
								Text.Clear();
								Text.Add("The submissive display sends you over the edge; you plant your hands over his and pull out of him forcefully, leaving his pliant hole gaped and spasming as if begging for more cock. You cry out as a blast of hot cum travels up your shaft[s], exploding from your tip[s] in a white, creamy rain.", parse);
								Text.NL();

								var cum = player.OrgasmCum();

								if(cum > 3) {
									Text.Add("The stallion is unprepared for the gallons of spooge pouring down upon him. He gasps as the first deluge crashes over his ass and back, then moans as the sticky shower continues to drench him in pulses of your heated seed. He continues spreading his ass wide open for you, ensuring that a sizable amount still gets deep inside him. He tries to turn his head to watch as you finish, and ends up getting a mouthful of sperm for his trouble - which he swallows without complaint. Apparently, he's fully resigned himself to be your bitch, what dignity he had eroded to nothing by the pleasure you have bestowed. Were your mind not occupied with the thrill of orgasm rocking your body, you would offer him more praise. For now, gratuitous amounts of sperm will have to serve as a reward until you can think straight again.", parse);
									Text.NL();
									if(player.NumCocks() > 1)
										Text.Add("Your [cocks] whitewash the prone equine from head to hoof in layers of jism, all but plastering him to the ground. A shiver visibly runs up his spine at the sensation of being coated in your essence, and his tongue languidly slides over his face to collect a bit of the treat. You even take hold of one of your shafts, aiming it downward to shoot its load directly onto the stud’s balls and sizable dong. The direct impact against his oversensitive organ causes him to whinny weakly, his entire package twitching with pleasure and leaking fresh sperm onto the ground, though it is quickly washed away by the endless flow of your inhuman load. Finally, your climax tapers off, ending with a few last globs sliding down the underside of his upraised tail to mingle with the pool of spooge that has collected in his gaped pucker.", parse);
									else
										Text.Add("Jizz sprays endlessly from your [cocks], each urethra-stretching load further painting him with your essence until every inch of him is dripping with spunk. The stallion seems drunk from the combination of orgasm and drowning in your musk, his tongue lolling out in the puddle of spooge that continues to grow around him. You aim your tip directly at his open rectum, giving it a few concentrated blasts that clearly hit something pleasurable inside him as a moan bubbles out of his mouth and through the sea of your jizz. As your tremendous issue finally tapers off, you aim the last couple of squirts directly upward, watching them arc slightly in the air and then fall onto the equine’s torso with a resounding <i>splat</i>.", parse);
									Text.NL();
									Text.Add("With a moan, the equine flops over into the pond of spooge with a wet squelch, panting heavily and soaked to the skin with a mixture of your jizz and his own. He coughs a few times as strands of spunk slide down his throat whilst he is unprepared, but otherwise he seems no worse for wear… relatively speaking. He wipes the worst of the goop from his eyes with shaky hands, trying to peer up at you through a haze of enervation. You bend down and smile at him, complimenting him on how well that particular look suits him and telling him to wear it with pride. He has earned it.", parse);
									Text.NL();
									Text.Add("The stallion gives you a facetious salute with two cream-coated fingers, then proceeds to immediately doze off. You leave him there to rest and recover, smirking to yourself at how hard it will be to get all of that mess out of his fur.", parse);
								}
								else {
									Text.Add("You fire off as much spunk as you are capable, doing your best to glaze the stallion’s back and upturned ass. With a little aim, you manage to get a few globs directly into the anus that he has so helpfully held open for you, watching as his asshole clenches around the offering as if trying to swallow it down. It seems you’ve trained him well; his ass should be much more receptive the next time you cross paths, but first you need to finish marking him as yours.", parse);
									Text.NL();
									if(player.NumCocks() > 1)
										Text.Add("Your [cocks] do their best to put a pretty white sheen all over your new slut, firing off small bursts of your seed in multiple directions and managing to get a good bit of coverage. A sudden urge strikes you, and you grab one of your cocks and aim it at the stud’s twitching sack and equine dong, marking his loins with your spunk. He emits a muffled groan at this, his member throbbing and leaking a fresh dollop of white from his tip. The stallion isn’t exactly drenched by the time you’re spent, but you’ve managed to decorate his hindquarters quite nicely. You even manage to get a shot across his lips, which he languidly licks off and swallows. His own dick is oozing onto the ground to mix with the small pool that he created during your anal intrusion.", parse);
									else
										Text.Add("You ride your climax as far as you can, jerking shots of cum across your new slut’s spread ass. His clenching sphincter looks like it is thirsty for more, so you aim a few globs into it as a reward for pleasing you so well. The stallion has raised his head from the ground, and he is looking back over his shoulder at you, his tongue lolling in blissed out euphoria. That’s an invitation you can’t refuse; you give your shaft several quick yanks, then unleash a small volley of seed that splashes across the stud’s mouth and muzzle. His tongue goes to work, languidly scooping as much of the tasty treat into his mouth as it can reach. After a couple more meager spurts across his back, your load is spent, and you let out a relieved sigh. You admire your handiwork, watching the stallion’s asshole try to swallow the sperm you fed it. His own cock is oozing onto the ground to mix with the small pool that he created during your anal intrusion.", parse);
									Text.NL();
									Text.Add("With a moan, the stallion rolls over onto his back, his large package flopping around lewdly and still dripping his seed across his abdomen. His gaping hole is slowly returning to its original form, but has yet to retract enough to keep some of your spunk from drooling out of it. He is panting with exhaustion, but there is an oddly pleased smile curving his cum-stained lips, as well as a blush across his cheeks. You bend down and smile at him as you ruffle his mane. You teasingly ask him if he is feeling proud of himself. His blush deepens, but his grin remains in place--if anything, it widens a bit. You chuckle and tell him he <i>should</i> be proud. That was quite a ride.", parse);
									Text.NL();
									Text.Add("The equine nuzzles your hand and gives you a thumbs-up… then promptly dozes off. You smirk and leave him to recover from the ordeal.", parse);
								}
								Text.NL();
								Text.Add("Casting a glance around to see what became of the mare, you see her passed out spread-eagle under the tree, her pussy and thighs glistening with moisture. Seems like she rather enjoyed the show, and overindulged herself a bit. Ah well, she only did what you told her to do. Maybe she and the stallion will have some new ways to pleasure each other from now on. Satisfied with the fruits of your labor, you gather your gear[party] and head back toward the road.", parse);
								Text.Flush();

								world.TimeStep({minute: 30});

								Gui.NextPrompt();
							}, enabled : true
						});

						Gui.SetButtonsFromList(options, false, null);
					});
					
				});
				
			});
			
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

EquineScenes.WinFuckHer = function(enc) {
	var mare     = enc.mare;
	var stallion = enc.stallion;

	var parse = {
		
	};

	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

	if(party.Num() == 2)
		parse["party"] = party.Get(1).name;
	else if(party.Num() > 2)
		parse["party"] = "your companions";
	else
		parse["party"] = "";

	Text.Clear();
	parse["l"] = player.LowerBodyType() != LowerBodyType.Single ? " between your legs" : "";
	parse["b"] = player.HasBalls() ? Text.Parse(", your [balls] feeling heavy[l]", parse) : "";
	Text.Add("Under normal circumstances, you might have just let them be and continued on your way. But as you loom over your defeated adversaries, the sight of their fit, exposed bodies incites a wave of arousal within you. Your [cocks] grow[notS] stiff with need, lust warring with what remains of your self-restraint. It is a losing battle, especially after the scent of the equines’ arousal hits you full in the face. Your hands move on their own; a quick tug exposes your pulsating package to the warm air[b]. Both horses swallow reflexively as you favor them with an excited grin. This ought to be an interesting ride.", parse);
	Text.NL();
	Text.Add("With a dismissive wave, you cordially invite the stallion to fuck off somewhere while you sate yourself with his companion. He scuttles off quickly enough, but he seems loath to completely abandon the mare. You turn your attention to the curvy form that lies before you, though a cursory glance tells you that her partner is watching the scene from a safe distance away. However coarsely the duo may address each other, it is clear they share some kind of bond. No matter; for now, you intend to enjoy yourself.", parse);
	Text.NL();
	Text.Add("You allow your [eye]s to feast upon the mare's frame, drinking in every inch of her as you draw closer. Her sizable pussy is plainly moist already, while her surprisingly pale nipples jut out toward you like beacons. Despite her lingering nervousness, she shifts her body to reveal as much flesh as possible, her expression an odd combination of lascivious and coquettish. Her shapely legs spread wider, and she wraps her arms beneath her bosom, squeezing her chest-pillows together and toying with a nipple while pretending to salvage her modesty. Though you appreciate the show, she needn't have bothered egging you on; you're as hard as iron and ready to plow into her soft, inviting folds.", parse);
	Text.NL();
	Text.Add("With a predatory growl, you drop ", parse);
	if(player.LowerBodyType() == LowerBodyType.Humanoid)
		Text.Add("to all fours and stalk ", parse);
	else if(player.LowerBodyType() == LowerBodyType.Single)
		Text.Add("onto your belly and slither ", parse);
	Text.Add("between her legs, not stopping until your [face] is suspended over hers and you are staring down into her wide, somewhat apprehensive eyes. Your [cocks] twitch[notEs] over her mons, and you enjoy the radiant heat that pulses between your respective genitals as you watch her expression grows more lustful and needy with each passing moment. Her eyes repeatedly dart down toward your crotch and then back up to meet your gaze, not understanding the lack of penetration or your reason behind it.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("It's clear that she is used to rough fucking, but rarely gets to experience foreplay of any sort. Lucky for her, you're feeling generous. In a sudden flash of movement, you press your lips to hers, teasing the surprised equine's tongue with your own. It only takes moments for the mare to relax, her eyes closing as she reciprocates your affection with a hint of relief. You smile inwardly - she has no idea what's coming next.", parse);
		Text.NL();
		Text.Add("Supporting yourself with one hand and keeping your lips firmly locked on hers, you allow your other hand to begin an up-close and personal exploration of her soft body, and the mare gasps into the kiss. Your fingers dally their way around the curvature of her velvety breasts, inching closer, but never quite touching the eager tips that all but throb with excitement. The mare throws her arms around your neck, pulling you even deeper into the kiss and whimpering at your ministrations. She bucks her hips upward, rubbing her netherlips against the underside of your [cocks] with growing intensity", parse);
		if(player.HasBalls())
			Text.Add(" until your [balls] are bouncing off of her soaked labia", parse);
		Text.Add(". You allow her to grind against you for a few moments, then you pull your hips back far enough to deny her even that small friction. She isn't getting off until <i>you</i> say so. She groans into your mouth, but stubbornly refuses to release your lips; if anything, your teasing is adding extra fervor to her side of the lip-lock. If she thinks she can coerce you into playing her way, she has a lot to learn. You're just getting warmed up.", parse);
		Text.NL();
		Text.Add("Your fingers home in on one of her swollen nipples and attack it with vigor - caressing, rolling, tugging, pinching, anything you can do to stimulate the sensitive flesh. The action bears fruit instantly as the mare arches her back off the ground, practically swamping your hand with quivering titflesh as her cry of pleasure is muffled by your mouth. You press on with relentless determination, diddling the tender nub until you think the equine woman might orgasm from that sensation alone.", parse);
		Text.NL();
		Text.Add("The thought amuses you to no end; the mare's entire sex life must be little more than a string of rough, frantic fucking, leaving her ignorant of the finer aspects of lovemaking. Her entire body seems hypersensitive and unaccustomed to genuine sensuality. Maybe you can use that to your advantage? Her frame is trembling beneath you, her broad hips humping the vacant air and her cavernous snatch drooling feminine honey into the dirt. Deciding to test your theory, you abruptly break the kiss and dart your face down to her other breast before she can react, clamping your lips around her unattended nipple and sucking <i>hard</i>.", parse);
		Text.NL();
		Text.Add("The mare goes completely rigid beneath you, her arms crushing your face into her chest, until a half-strangled scream of ecstasy explodes from her throat. Ever empathetic, her well-used cunt follows suit, gushing a veritable geyser of girl cum across your groin, your [legs], and the ground. A few aftershocks later, she goes limp and releases your head, allowing you to breathe again. You survey the results of your ministrations with a wry smirk. The mare is sprawled beneath you, tongue lolling out and eyes partly rolled back in her head. Her breasts jiggle with each sporadic breath, and her gaping slit is still twitching and expelling a small trickle of afterglow. But you've still got a long way to go before you're satisfied.", parse);
		Text.NL();
		Text.Add("You shuffle downward, letting your face hover a finger's breadth from the insensate mare's quivering labia, your mouth already watering at the sweet, slightly earthy scent of her arousal. Feeling no need to ask permission, you spread the puffy lips apart with your thumbs and sink your tongue into her love canal as far as it will reach. The insertion sets off another minigasm and the equine woman's powerful thighs squeeze your head. Her grip isn't nearly as strong as you expected, thanks to her first mind-blowing climax. Once she relaxes again and her legs fall akimbo to either side, you proceed to trace every inner crevasse of her womanhood with your [tongue], tasting her pleasant tang and feeling the muscles shudder around your flexible appendage.", parse);
		Text.NL();
		Text.Add("She serenades you with gasps and moans that drastically increase in volume as a free digit seeks out her throbbing clit and flicks it gently. Her hips buck in time with your oral attentions, signaling the approach of another orgasm. You are eager for another taste of her delicious nectar, so you do not hesitate to increase your efforts. With your tongue still buried inside her, you pinch her engorged love-button between your thumb and forefinger and tweak it back and forth until it spasms in your grip.", parse);
		Text.NL();
		Text.Add("Again, the world goes black as her thighs envelop your head, her climax just as intense as the first despite her enervated state. Your mouth is flooded with her juices until they're streaming down your chin, and you happily swallow it down. Her screams falter much quicker than before, and after her legs release you for the second time, you see that she is delirious with pleasure and mumbling incoherently between short, ragged breaths.", parse);
		Text.NL();
		Text.Add("You wipe your face and smile. Now that you've broken her in, it's time to <i>really</i> ride this slut.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("It takes a bit of effort to flip the mare over, fucked senseless as she is, but you eventually get her ass in the air. Her upper half is unresponsive, her voluminous tits pressed flat against the ground and her tongue lolling in the dirt. You have to grab onto her well-proportioned rump with both hands to keep her from falling over, but you soon have[oneof] your [cocks] lined up with the swollen pink lips of her gash that contract involuntarily as though beckoning you inside. ", parse);
			if(player.NumCocks() > 1)
				Text.Add("You grin mischievously as you line up another of your [cocks] with the tight pucker beneath her tail, rubbing the tip against her pussy lips on the way in an attempt to lube it. The sensation of her orifices’ warm, wet kisses upon your cock heads is enough to drive you crazy. ", parse);
			Text.Add("One solid thrust has you hilted inside her sodden cunt", parse);
			if(player.NumCocks() > 1)
				Text.Add(", and though her ass is not nearly as loose, her muscles are too relaxed to deny the additional invasion", parse);
			Text.Add(". The swift penetration elicits a hoarse gasp and a weak moan from the equine, but she is too exhausted to move, much less resist you.", parse);
			Text.NL();

			Sex.Vaginal(player, mare);
			mare.FuckVag(mare.FirstVag(), player.FirstCock(), 3);
			player.Fuck(player.FirstCock(), 3);

			if(player.NumCocks() > 1) {
				Sex.Anal(player, mare);
				mare.FuckAnal(mare.Butt(), player.FirstCock(), 2);
				player.Fuck(player.FirstCock(), 2);
			}

			Text.Add("Foreplay is over - this round is all about <i>your</i> pleasure. There is no need to be gentle; this bitch is used to rough fucking - her well-used pussy is utterly drenched. ", parse);
			if(player.NumCocks() > 1)
				Text.Add("Her tight asshole is also drenched from her massive orgasms, so it should be nearly as easy to fuck as her cunt. ", parse);
			Text.Add("You rut her with abandon, your crotch slapping loudly against her gropeable derriere with enough force to send impact ripples through her butt cheeks. The equine woman is so drained by her back-to-back orgasms that she barely has the strength to cry out, her exclamations reduced to inarticulate grunts and groans of pleasure. The only things keeping her hindquarters aloft are your hands on her flanks while your [cocks] thrust[notS] deeper inside her.", parse);
			Text.NL();
			Text.Add("You catch movement out of the corner of your eye. You turn your gaze to the source, only to see the mare's long forgotten companion tending to his own substantial erection. Ah... it seems the stallion rather <i>enjoys</i> watching his woman get railed by someone else. He is furiously double-fisting his immense cock, his swollen balls squirming with need and his eyes affixed to his lover's plush backside as it bounces on your [cocks]. Thrilled by the idea of cuckolding the usually dominant horse, your hips break out into a full gallop.", parse);
			Text.NL();
			Text.Add("You slam into the mare with renewed vigor, shouting <i>“Giddyup!”</i> and giving her flank a resounding slap that sets it jiggling even more, her long tail dangling listlessly down the curve of her spine. The mare can’t muster much more than a shuddering moan. You edge closer to your own peak with each thrust into the insensate equine. ", parse);
			if(player.HasBalls())
				Text.Add("You can feel your [balls] straining with the desire to expel their pent-up seed. ", parse);
			Text.Add("But you need something more. Something devastatingly dominant with which to shame the hedonistic equines. Something... <i>deeper</i>.", parse);
			Text.NL();
			Text.Add("You yank your [cocks] out of the mare's abused hole[s] so quickly that it's almost painful, then roll her onto her back once again. Her face and heaving tits are caked with cum and mud, but she is barely conscious at this point and lacks the capacity to care. Making certain that you have the stallion's full attention, you grab the limp mare by her ankles and proceed to fold her in half, pressing her legs forward and down until the tops of her hooves are touching the dirt on either side of her head.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("You position your throbbing member[s] and slide all the way in with a single stroke, marveling at how amazing her insides feel despite the looseness of her abused pussy", parse);
				if(player.NumCocks() > 1)
					Text.Add(" and now-ruined asshole", parse);
				Text.Add(". At this angle, you feel as though each thrust reaches deeper than before, and you could almost swear that your tip was butting up against the hard ring of her cervix. ", parse);
				if(player.HasBalls())
					Text.Add("The thought makes your [balls] twitch; they are eager to explode into the defenseless hole and mark her womb with as much of your spunk as they can churn out. ", parse);
				parse["a"] = player.NumCocks() > 1 ? "" : " a";
				Text.Add("You give the stallion a cocky grin. You can tell that when you climax, your [cocks] [isAre] going to paint his partner’s insides white like[a] fleshy cum-cannon[s]. From the desperate, humiliated expression on the stallion's muzzle, he is having similar thoughts, but that does not slow his hands from their feverish masturbation.", parse);
				Text.NL();
				Text.Add("The telling warmth begins to spread across your nethers and you concentrate on cramming your [cocks] as hard and deep into the equine woman's unresisting hole[s] as possible. Each thrust sends her plush breasts bouncing, the sight bringing you that much closer to unleashing your essence within her. Suddenly, you hear the sound of the stallion's almost apologetic groan of pleasure as cum fountains from his equine dong, raining down upon him and coating him in a thick film of his own pathetic seed. That is all it takes to finally push you over the edge.", parse);
				Text.NL();

				var cum = player.OrgasmCum();

				if(cum > 3) {
					Text.Add("You ram your crotch into the mare and roar as a flood of cum bursts from your [cocks], whitewashing her orifice[s] and filling [itThem] beyond capacity. Despite the size of her equine tunnel[s], you manage to make her gut swell outward a bit as you fire copious loads of spunk into her waiting canal[s].", parse);
					if(player.NumCocks() > 2)
						Text.Add(" Your other unused member[s2] hose[notS2] her down from the outside, coating every inch of her curvaceous frame with sticky jizz.", parse);
				}
				else {
					Text.Add("You ram your crotch into the mare and roar as you unload inside her, feeling her inner walls weakly spasming around your pulsating cockflesh. Her insides soak it up and beg for more, seemingly bottomless in their thirst for cum. No doubt she is accustomed to more prodigious sperm production, like that of the stallion. Your meager output is a mere drop in the bucket by comparison, but even so, you intend to give her every bit of it.", parse);
				}

				Text.NL();
				Text.Add("The mare is only vaguely aware of the sensation, emitting a small cry as another minigasm ripples through her. You release her legs and pull out just in time to send a couple of small jets splattering directly into her open mouth, and she swallows the offering instinctively.", parse);
				Text.NL();
				parse["l"] = player.LowerBodyType() != LowerBodyType.Single ? " on shaky legs" : "";
				Text.Add("It takes a few minutes to catch your breath and force yourself upright[l]. By the time you've donned your [armor] and gathered your gear, the stallion has meekly crawled back to his partner, checking to make sure she is alright. His thick cock is flaccid and forgotten between his thighs, the tip dragging in the dirt. You look behind him and have to stifle a laugh; in his haste to check on his companion, the equine left a trail of his fluids all the way from his original vantage point. You stow your mirth for later, affecting a stern expression that causes you some small difficulty to maintain and snap your fingers to get his attention. The stallion looks up at you with a quizzical expression.", parse);
				Text.NL();
				parse["cum"] = player.NumCocks() > 2 ? " adorning her figure and" : "";
				Text.Add("<i>“Clean her up,”</i> you say, gesturing at the cum[cum] dripping from her gaping pussy. <i>“The poor girl has had a long ride.”</i>", parse);
				Text.NL();
				parse["p"] = party.Num() > 1 ? Text.Parse(" rejoin [party] as you", parse) : "";
				Text.Add("The equine male stares at you blankly until understanding washes over him, and he flattens his ears against his head in embarrassment at your order. With noticeable reluctance, he leans over the mare and begins licking up your seed, wincing at the taste, but not daring to refuse you. Satisfied that you've made an impression on the pair, you turn about and[p] head back to the road.", parse);
				Text.Flush();

				Gui.NextPrompt();
			});
		});
	});
}

EquineScenes.WinRideHimVag = function(enc) {
	var mare     = enc.mare;
	var stallion = enc.stallion;

	var parse = {
		
	};
	
	parse = player.ParserTags(parse);

	Text.Clear();
	Text.Add("No matter how hard you try, you simply cannot tear your eyes away from the stallion's sizable prick as it dangles from the revealing shreds of his destroyed loincloth. You feel your nethers grow hotter at the sight, your ", parse);
	if(player.FirstCock())
		Text.Add("[cocks] and ", parse);
	Text.Add("[nips] hardening beneath your [armor] as you imagine all the different ways you could put that slab of meat to good use. The equine notices your appraisal, and his shaft begins to engorge with excitement - though whether or not the reaction is voluntary remains unclear. A mischievous gleam flashes in your eye, and you decide to give your fallen foe a ride to remember.", parse);
	Text.NL();
	Text.Add("Pointedly ignoring the mare, you strip off your [armor] slowly, putting yourself on display for the stallion in an effort to tease him erect. Your efforts hit their mark; the horse's gaze locks onto your [breasts] and [vag], ", parse);
	if(player.FirstCock())
		Text.Add("though his eyes grow wider at the sight of your [cocks] jutting toward him at half-mast. The extra equipment doesn't seem to deter him much, as is evidenced by ", parse);
	parse["br"] = player.FirstBreastRow().Size() >= 3 ? "breast" : "nipple";
	Text.Add("his thick organ quickly rising to attention and twitching with barely-concealed want. You slide your hands over your own body, toying with one [br] while sliding a few digits ", parse);
	if(player.HasBalls())
		Text.Add("under your swollen [balls] and ", parse);
	Text.Add("into your ever-moistening folds as you prepare yourself for the challenge. When you pull your lower hand away, strands of your arousal splay between your fingers like a clear, viscous web. You're as ready as you'll ever be, so now it's time to find out how much of this stud you can take. You carefully straddle the column of flesh, reaching down to rub the blunted head against your dripping sex.", parse);
	Text.NL();
	Text.Add("The stallion's cock throbs in your grip, and he is already panting from the sensation. You smirk down at him; despite his brash demeanor, it would seem that the equine is fairly inexperienced in the finer points of lovemaking. No doubt his sexual repertoire consists almost entirely of brief, feverish fucking and little else. Well, who better than you to show him what he has been missing?", parse);
	Text.NL();
	Text.Add("You prod your [vag] with his broad tip a few more times, edging him ever-so-slightly. You won't be lacking for lubrication - the combination of your soaked snatch and his exuberant emission of pre-cum has coated his swollen shaft from crest to crack with glistening moisture - so you see no point in dallying any longer.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		if(player.LowerBodyType() != LowerBodyType.Single)
			Text.Add("Your legs bend, ", parse);
		else
			Text.Add("Your powerful pelvic muscles manage to keep your torso aloft as your [vag] descends upon him, ", parse);
		Text.Add("lowering you just enough to push his flare through your netherlips and into your welcoming warmth. Both of you groan aloud, and you allow gravity to pull you farther and farther down the turgid pole. The sensation of being filled to such a degree is incredible, and it only increases with each additional inch that slides into your inviting tunnel. You can feel every contour and vein rubbing your sensitive walls as your [vag] squeezes the stallion's shaft reflexively, urging him deeper inside you to the point of no return. Your fingers seek out your [nips] and begin toying with them as your eyes slide shut in pleasure.", parse);
		Text.NL();

		Sex.Vaginal(stallion, player);
		player.FuckVag(player.FirstVag(), stallion.FirstCock(), 3);
		stallion.Fuck(stallion.FirstCock(), 3);

		parse["thighsDesc"] = (player.LowerBodyType() != LowerBodyType.Single) ? player.ThighsDesc() : "abdomen";
		parse["s"] = (player.LowerBodyType() != LowerBodyType.Single) ? "" : "s";
		Text.Add("After a blissful eternity, your [thighsDesc] finally come[s] to rest against the stallion's hips, and you pause long enough to adjust to the sizable intrusion and take a few bolstering breaths. The equine's head is lolling from side to side, his eyes rolled halfway back into his skull. His fingers dig into the grass as though he was holding on for dear life. You attempt to raise yourself up, but find that ", parse);
		if(player.LowerBodyType() != LowerBodyType.Single)
			Text.Add("your legs are rather shaky from the deep-seated pleasure of the equine insertion.", parse);
		else
			Text.Add("your abdominal muscles have become a quivering mess from the pleasure of the equine insertion.", parse);
		Text.Add(" Instead, you decide to shift forward, dragging your [nips] along the horse's chest and allowing most of his length to slip out until only the flared head remains inside you. As your [breasts] dangle above the stallion's muzzle, a sudden urge strikes you. You grab the unsuspecting equine's chin with one hand and shove one of your nipples into his mouth.", parse);
		Text.NL();
		Text.Add("Though startled at first, the stud quickly takes to his task with gusto, sucking and lapping at your hardened nub as though it contained the essence of life itself. His hands reach up to fondle you, but you slap them away; you're in the saddle this time, and he is going to play <i>your</i> way. You croon your approval of his ministrations, but remind him that you have more than one breast. He shifts his attention to your other tit without hesitating, keeping his hands obediently at his sides despite the obvious desire to touch you making his digits squirm.", parse);
		Text.NL();
		Text.Add("You let him tend your [breasts] for a bit longer, then pull back. You tell him that he did a fine job, so you will now reward him for his efforts. With that, you ease yourself back onto his still-raging erection, biting your lip as you enjoy the filling sensation once again. The stallion openly moans, his breath coming in shallow gasps. By the time your [vag] has accepted him to the hilt, his entire frame is trembling with need. You can feel his balls churning beneath you, and it becomes apparent that he is on the verge of climax just from the teasing you've done so far.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("That simply won't do. You haven't even begun to indulge yourself - you can't have him finishing the race while you're still fresh out of the gate. You reach out to give one of his nipples a hard tweak, which brings him back from the edge just enough to focus on you with bleary eyes. With a stern expression, you inform him that he is <i>not</i> allowed to cum until you say so, and failing to comply will have... consequences. The stallion's eyes grow wide with apprehension at both the order and the implied threat, but he nods acquiescence. You purr your approval and begin rocking on his rigid member", parse);
			if(player.FirstCock())
				Text.Add(", your own rock-hard [cocks] bouncing proudly over his stomach as you move", parse);
			Text.Add(". You sigh with happiness as his equine dong massages your deepest crevasses, stirring your insides in ways few could ever hope to match.", parse);
			Text.NL();
			Text.Add("You build up a steady rhythm, doing your best to keep the stallion on the edge while pleasuring yourself in the process. A rapid squelching sound catches your ear, and a quick glance at the forgotten mare reveals that she is enjoying the show. She is mauling one of her sizable tits with one hand, while the other hand feverishly frigs her sopping pussy. Before you can give the sight much thought, you feel the stallion shiver beneath you, and you slow your movements to hold him back from the release he craves.", parse);
			Text.NL();
			Text.Add("His willpower isn't nearly as strong as you'd hoped. Looks like you'll need to make the best of it. You ramp up the speed, angling your thrusts to maximize the friction against your sensitive folds while grinding your [clit] against his crotch whenever you have him hilted. You attack both of your [breasts] with a vengeance, squeezing and caressing the tender flesh and [nips] as you ride your bronco with wild abandon.", parse);
			parse = Text.ParserPlural(parse, player.NumCocks() > 1);
			if(player.FirstCock())
				Text.Add(" Your own [cocks] beg[notS] for attention, and you free one hand from your chest to wrap it around[oneof] your straining shaft[s], jerking [itThem] fast and hard. With the added stimulation, you aren't sure how much longer you can hold back.", parse);
			Text.NL();
			Text.Add("Before you can reach your peak, the equine cries out. His frame goes tense, his heavy balls contract, and he thrusts his hips upward as ecstasy overpowers his endurance like a tidal wave. A gasp escapes your lips as you suddenly feel a surge of liquid heat flowing into your lower half. Your gut becomes paunched as the thick seed floods your uterus beyond capacity, streams of off-white jizz spurting past the imperfect seal of your stretched labia and drooling down the underside of his scrotum.", parse);
			Text.NL();

			EquineScenes.StallionImpregnate(player, enc.stallion);

			Text.Add("After a few more squirts, the stallion is spent. He is sprawled limply on the ground beneath you, his tongue lolling out and his eyes almost crossed from the intense pleasure. You can feel his cock shrinking inside you and it soon flops out to allow a cascade of spunk to pour from your [vag], coating his lower body white. You click your tongue in disappointment; you were quite close to your own release - and being deprived like that has left you a little edgy. There must be some way to...", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("Your eyes fall upon the mare, who apparently managed to satisfy herself at the same time as her partner. She is panting hard, and her fingers are coated with a mix of saliva and femcum. The sight of her quivering lips and the tatters of leather dangling beneath her heaving bosom gives you a brilliant idea, and you are quick to put it into action. You raise yourself off of the stallion, then clear your throat to get the mare's attention. At her uncertain expression, you gesture at her partner's flaccid member wallowing in the puddle of spooge plastered across his navel.", parse);
				Text.NL();
				Text.Add("<i>“I wasn't finished,”</i> you tell her, your voice stern and authoritative. <i>“Get him ready for me again.”</i>", parse);
				Text.NL();
				Text.Add("The mare looks dubious, but obeys the command anyway, seemingly unwilling to risk another trouncing at your hands. She gets to work, squeezing and sucking the stallion's prick and balls with the ease of familiarity. The way she slurps down his residual seed without hesitation indicates that she must be accustomed to the taste, even when flavored with the juices of another. The stallion groans at her ministrations, shifting his hips as she expertly hits all of his favorite spots with her broad tongue. He is still too dazed to offer much response, but that will only make your plan that much easier to execute.", parse);
				Text.NL();
				Text.Add("While the mare is occupied, you amuse yourself with the dripping girl parts that she so conveniently presented in your direction. You squeeze and spread her plush ass cheeks, revealing her drooling cunny and surprisingly tight pucker. Thinking that you mean to have your way with her as well, the mare arches her back slightly and presses her ass toward you, waggling her hips as she continues to fluff the stallion’s prick. Humoring her, you slide two fingers into her humid snatch, meeting zero resistance thanks as much to the copious femlube as to the sheer size of her equine gash.", parse);
				Text.NL();
				Text.Add("The mare, still sensitive from her climax, moans appreciatively against her partner’s organ, which elicits a moan from him in turn. You diddle her inner walls for a moment or two, then slide your digits out and upward, rubbing her fluids around the ring of her anus. The equine woman gasps while her whole body tenses in surprise, and you realize that her back door must not see a lot of action. That’s <i>very</i> interesting. You offer her reassurances and encourage her to relax, stroking her clenched hole gently with your fingertips.", parse);
				Text.NL();
				Text.Add("She eventually relents, giving you free reign over her hindquarters as she begins vigorously deepthroating the stallion’s hardening member. You feel her anal ring loosen as you stroke her, and once she is focused on her task again, you press both fingers in to the second knuckle. She tenses again, her ass clamping down on your digits and her eyes bulging wide as she tries to scream, but her throat is currently stuffed with horsemeat, so all that comes out is a choked gurgle. Just to add fuel to the fire, you reach out with your free hand and give her puffy clit a sharp tweak. A violent shiver courses through her frame, her eyes roll back in her head, and you suddenly find your face and chest splattered with her juices. You hear the stallion gasping and groaning through clenched teeth - apparently her minigasm is providing some interesting stimulation to the fuckstick still lodged in her maw.", parse);
				Text.NL();
				Text.Add("After a few more twitches and spasms, the mare slumps to the side in a daze, and the stallion’s cock exits her gullet with loud slurp. Fortunately, he has not quite reached his peak, so his pillar of equine cockmeat stands tall and throbbing, glistening with the mare's saliva and a bit of early pre-cum. If your [vag] ", parse);
				if(player.FirstCock())
					Text.Add("and [cocks] ", parse);
				Text.Add("are any indication, the little diversion was arousing enough to make up for any momentum you lost to the equine male’s precipitous finale. Ignoring the barely-cognizant equine woman, you reach down to the remnants of the stallion's loincloth, yanking the primitive garment from his waist. You carefully slide a strip of the ragged leather behind his balls, looping it around the base of his scrotum and the pulsating shaft above it. Then, ever so gently, you cinch the loop tight and tie off the knot, effectively creating a makeshift cock-ring that should keep him hard for a more respectable duration — not to mention pinching his cumvein shut.", parse);
				Text.NL();
				Text.Add("The stallion's faint groan becomes a wail as his overproductive testes begin building pressure almost right away. You smirk and remind him that he must be punished for cumming before you.", parse);
				Text.NL();
				Text.Add("<i>“Time to pony up, stud,”</i> you tease him. <i>“Show me that you know more than one trick.”</i>", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("The muscly equine can only whimper and twitch as you drag one fingertip up his hypersensitive rod. You take your time repositioning your [vag] over his flat tip, enjoying the reciprocal heat that causes his cock to throb and your well-lubed slit to drip moisture down his shaft. Finally, you tire of foreplay. Without so much as a warning, you grab the equine dong and shove the first few inches inside yourself, giving yourself only a moment to adjust before sliding downward at a much quicker pace than before, until you once again have him hilted fully inside your slick honeypot.", parse);
					Text.NL();
					Text.Add("Bracing your hands against the stallion's broad chest, you put all your effort into thrusting your nethers against him, grinding his thick rod into every inch of your love canal until your nerves are vibrating with pleasure. Every push rams your diamond-hard clit into his tensed abs, sending a twinge of pain to mingle with your ecstasy and heighten the sensory overload.", parse);
					Text.NL();
					if(player.FirstCock())
						Text.Add("Your [cocks] flail[notS] violently between your bodies, shooting spurts of pre laced with the whiteness of impending orgasm. ", parse);
					if(player.HasBalls())
						Text.Add("Likewise, your swollen sack jostles about uncomfortably as you ride the equine, though the other sensations are more than enough to drown out the small discomfort and allow you to truly enjoy yourself. ", parse);
					Text.Add("You can hear him moaning with the desire to release another flood inside you. You can feel his cum factories straining against their bondage and the blistering heat of his captive member as you use it as your personal sex toy. None of that matters. You are inching closer and closer to that marvelous crescendo; already, the tell-tale tingle is spreading throughout your lower body", parse);
					if(player.LowerBodyType() != LowerBodyType.Single)
						Text.Add(", making your legs feel weak and nerveless", parse);
					Text.Add(". You refuse to let that stop you now. Gritting your teeth, you bounce on his dick like one possessed, gyrating against him as fast as you are physically capable.", parse);
					Text.NL();
					Text.Add("Out of reflex, the stallion bucks his hips upward just as you happen to be descending. The slight change in angle is enough to rub the top of his shaft against a very special spot, while the extra force pushes the flared head fractionally deeper inside your aching chasm. Lightning shoots up your spine and back down to your groin, followed by an explosion of white-hot pleasure that causes every muscle in your body to contract. Your [vag] clamps down on the stallion's prick with a death grip – tight enough to be painful, if his low whine is any indication – and you scream your climax to the heavens, clutching at your [breasts] as tremors wrack your frame from top to bottom.", parse);
					Text.NL();

					var cum = player.OrgasmCum();

					if(player.FirstCock()) {
						if(cum > 6) {
							Text.Add("Your [cocks] appear[notS] to vibrate with strain as the first urethra-stretching load boils upward and outward, exploding from your tip[s] and blasting the stallion full in the face. Having broken the seal, each successive gob fires off faster than the last, coating the equine’s upper body in a thick sheen of white goo.", parse);
							Text.NL();
							Text.Add("The stallion tries to cry out from the stimulation assaulting his shaft, but only ends up with a mouthful of jizz for his trouble, which he is forced to swallow in order to breathe. Your emissions eventually taper off, reduced to a slow trickle that mixes with the spunk pooled on his navel. Your [vag] stubbornly refuses to cease its enjoyable spasming, spurred on by the sporadic twitching of the equine’s bound cock that remains lodged firmly inside you.", parse);
						}
						else if(cum > 3) {
							Text.Add("Your [cocks] fire[notS] off globs of your salty spunk all over the stallion's torso and face, some even landing in his slightly gaping mouth. You let a shaky and fumble downward to give yourself a quick tug job, drawing out a few more spurts and triggering a minigasm aftershock.", parse);
						}
						else {
							parse["b"] = player.HasBalls() ? " contracting scrotum" : " prostate";
							Text.Add("Your [cocks] pulsate[notS] with the onset of orgasm, but your[b] is simply too dried out to produce much cum. You manage a couple of pathetic squirts that barely reach the equine’s heaving pecs, followed by a thin strand that fails to gain enough momentum to detach from the head of[oneof] your tip[s], instead dripping down to briefly connect your dick to his pelvis. As if in apology for the weak display, your [vag] continues pleasurably spasming around his shaft for another solid minute, spurred on by the sporadic twitching of the equine’s bound cock that remains lodged firmly inside you. ", parse);
						}
						Text.NL();
					}

					Text.Add("After a few long, otherworldly moments, your body can take no more and finally relaxes. You let out a huge sigh of happiness and relief, rolling off of your mount to bask in the afterglow of your hard-earned orgasm. Your reverie is interrupted by the stallion's continued whimpering, and you turn your head to regard him with annoyance. Instead, you have to smother a giggle behind your hand. It appears your cock bondage worked a little <i>too</i> well; the equine's shaft is still rigid and twitching in the air, and his scrotum looks to be turning blue beneath the fur.", parse);
					Text.NL();
					Text.Add("Despite his obvious discomfiture, the stallion has managed to refrain from touching himself or loosening the tormenting tether so as not to rouse your ire. Chuckling under your breath, you pick yourself up from the ground and situate your [armor]. As a parting shot, you nudge the languid mare awake, giving her permission to release the stallion's bindings as she tries to focus on you with bleary eyes. You make your way back to the Crossroads, but cast a glance over your shoulder when you hear the mare exclaim in surprise. A smile creases your lips as you watch the equine stud’s pent-up pressure being explosively released - all over his partner’s face.", parse);
					Text.NL();
					Text.Add("Parting shot, indeed.", parse);
					Text.Flush();

					Gui.NextPrompt();
				});
				
			});
			
		});
		
	});
}

export { Equine, EquineScenes };
