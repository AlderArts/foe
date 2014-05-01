/*
 * 
 * Equine, lvl 2-3
 * 
 */

function Equine(gender) {
	Entity.call(this);
	
	if(gender == Gender.male) {
		this.avatar.combat     = Images.stallion;
		this.name              = "Stallion";
		this.monsterName       = "the stallion";
		this.MonsterName       = "The stallion";
		this.body.DefMale();
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
	
	this.level             = 2;
	if(Math.random() > 0.8) this.level = 3;
	this.sexlevel          = 2;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 4;
	
	this.body.SetRace(Race.horse);
	
	this.body.SetBodyColor(Color.brown);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.horse, Color.brown);
	
	this.body.SetEyeColor(Color.green);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Equine.prototype = new Entity();
Equine.prototype.constructor = Equine;

Scenes.Equine = {};

Equine.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Equinium });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseHair });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseShoe });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseCum });
	return drops;
}

Equine.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! Rawr!");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.6)
		Abilities.Attack.CastInternal(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.CastInternal(encounter, this, t);
	else
		Abilities.Seduction.Tease.CastInternal(encounter, this, t);
}

// MALE + FEMALE ENCOUNTER
world.loc.Plains.Crossroads.enc.AddEnc(function() {
 	var enemy    = new Party();
 	var stallion = new Equine(Gender.male);
 	var mare     = new Equine(Gender.female);
	enemy.AddMember(stallion);
	enemy.AddMember(mare);
	var enc      = new Encounter(enemy);
	enc.stallion = stallion;
	enc.mare     = mare;
	
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	
	enc.onEncounter = function() {
		var parse = {
			party         : !party.Alone() ? " and your party" : "",
			breastDescCup : enc.mare.FirstBreastRow().ShortCup()
		};
		
		Text.AddOutput("You[party] spot a strange shadow farther up one of the many paths and roads surrounding the area. Thinking that it might be dangerous, you head on a different pathway. A few moments pass and all is well. With the sound of something heavy pounding against the ground, you turn and just manage to dodge a thundering charge aimed right at you!", parse);
		Text.Newline();
		Text.AddOutput("Getting back your bearings, you[party] get into a defensive position. Getting a better look at your opponent, you are shocked to see that it is a horse, nearly seven foot tall, in the shape of a person! A more feminine shaped mare approaches and stands next to the horse morph.", parse);
		Text.Newline();
		Text.AddOutput("The stallion has a piece of crude leather tied around his waist covering most of his genitals; bits of his black orbs are clearly visible. Despite being covered, the outline of his knob forms around the cloth. His brown coat contrasts against his hair in a strange way.", parse);
		Text.Newline();
		Text.AddOutput("A muscular, peach-furred female stands next to her partner. A pair of [breastDescCup] perk naturally at her chest, covered by a sparse amount of leather tied around her back. Her lower set of lips are covered in a similar fashion, a brown leather thong barely covering her features. Despite her obviously feminine traits, she looks strong and firm. Her long hair flows naturally down her neck, eyes sparkling with a green shine.", parse);
		Text.Newline();
		Text.AddOutput("The two hunch down into an attacking stance. They intend to fight you!", parse);
		
		// Start combat
		Gui.NextPrompt(function() {
			enc.PrepCombat();
		});
	};
	
	enc.onLoss = Scenes.Equine.LossPrompt;
	
	return enc;
}, 1.0);

Scenes.Equine.LossPrompt = function() {
	SetGameState(GameState.Event);
	Text.Clear();
	
	// this = encounter
	var enc = this;
	enc.finalize = function() {
		Encounter.prototype.onLoss.call(enc);
	};
	
	var parse = {
		party         : !party.Alone() ? " and your party" : "",
		hisher1       : enc.stallion.hisher(),
		heshe1        : enc.stallion.heshe(),
		HeShe1        : enc.stallion.HeShe(),
		hisher2       : enc.mare.hisher(),
		heshe2        : enc.mare.heshe(),
		HeShe2        : enc.mare.HeShe(),
		HisHer2       : enc.mare.HisHer(),
		breastDesc2   : enc.mare.FirstBreastRow().Short(),
		nipDesc2      : enc.mare.FirstBreastRow().NipsShort()
	};
	enc.parse = parse;
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.AddOutput("You[party] collapse, unable to dispute the equine couple's victory. The two approach you, the stallion eying your crumpled figure with desire.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"You in the mood?\"</i> The male questions, turned to the mare, his groin twitching in the process.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"You're <b>always</b> in the mood, aren't you? Maybe if you aren't satisfied with me, you should  just leave.\"</i> The busty female turns her back to the stallion, fuming.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Yeah, okay, sure. When <b>you're</b> in the mood, you'd fuck a demon to death, but when <b>I</b> want to have some fun-\"</i>", parse);
		Text.Newline();
		Text.AddOutput("The two continue to argue for quite some time, allowing you[party] to slink away unnoticed. Still, you find the loss to two bickering equines quite embarrassing.", parse);
		
		Gui.NextPrompt(enc.finalize);
	}, 1.0);
	scenes.AddEnc(function() {
		Text.AddOutput("The final blow breaks your will and you grudgingly drop to your knees, unable to fight back. Your eyes look around and you hear the telltale click of animalistic tongues.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"I thought they'd last a little longer than that...\"</i> The mare comments, looking to [hisher2] comrade as [heshe2] finishes. ", parse);
		Text.Newline();
		Text.AddOutput("The stallion matches [hisher2] glare. <i>\"I know that look.\"</i> [HeShe1] takes this moment to rake [hisher1] eyes over your figure.", parse);
		Text.Newline();
		
		if(player.NumCocks() > 0) {
			Text.AddOutput("[HeShe1] chuckles briefly. <i>\"Don't let your prey see your mouth water.\"</i> The mare gives you a telling ogle.", parse);
			Text.Newline();
			Text.AddOutput("[HeShe2] replied sharply. <i>\"Mind your damn business...\"</i> [HisHer2] eyes stayed pinned to your figure as [heshe2] spoke. It's not that you mind the attention, but you do feel a little uneasy under those stares. ", parse);
		}
		else if(player.NumVags() > 0) {
			Text.AddOutput("The mare gave a shrug. <i>\"Well, it's your call. She can't seem to stop staring at you.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("You look away from the stallion after the female mentions it and feel heat rise into your cheeks. It's not your fault: his... equipment is simply not an everyday sight.", parse);
		}
		Text.Newline();
		Text.AddOutput("The two opponents grow restless with their own hesitation and finally turn to question you.", parse);
		Text.Newline();
		
		if(player.NumCocks() > 0) {
			Text.AddOutput("<i>\"You wanna play with me?\"</i> The mare smiles, approaching you while pressing her chest out. The small amount of leather covering her [breastDesc2] pulls tightly around her [nipDesc2], the outline quite visible.", parse);
		}
		else if(player.NumVags() > 0) {
			Text.AddOutput("<i>\"So, you wanna have some fun?\"</i> The stallion questions while moving forward, closing the distance. His musk fills your nostrils, and despite how disgusting the idea might be, you can feel your insides squirm. ", parse);
		}
		
		if(player.LustLevel() >= 0.8) {
			Text.Newline();
			Text.AddOutput("<b>Aroused as you are, you cannot bring yourself to refuse their offer.</b>");
		}
		
		// SET UP CHOICES
		
		//[Fuck her][Get fucked][Threesome][No]
		var options = new Array();
		if(player.NumCocks() > 0) {
			options.push({ nameStr : "Fuck her",
				func : Scenes.Equine.FuckFemale, obj : enc, enabled : true,
				tooltip : "The female equine has caught your interest, and judging from her demeanor, she likely wouldn't object."
			});
		}
		if(player.NumVags() > 0) {
			options.push({ nameStr : "Get fucked",
				func : Scenes.Equine.GetFucked, obj : enc, enabled : true,
				tooltip : "Taking on that thick horse cock looks like a challenge, but you can't let that stop you!"
			});
		}
		
		if(player.NumCocks() > 0) {
			options.push({ nameStr : "Threesome",
				func : Scenes.Equine.Threesome1, obj : enc, enabled : true,
				tooltip : "Why not have both of them join in? The stallion looks like he is willing to share his partner... that, and they both have parts you could play with."
			});
		}
		else if(player.NumVags() > 0) {
			options.push({ nameStr : "Threesome",
				func : Scenes.Equine.Threesome2, obj : enc, enabled : true,
				tooltip : "Why not have both of them join in? That cock looks like it could serve both you and the mare."
			});
		}
		options.push({ nameStr : "No",
			func : function() {
				parse.party = !party.Alone() ? " and wake your incapacitated party" : "";
				
				Text.Clear();
				Text.AddOutput("They sigh and shrug, both looking disappointed.", parse);
				Text.Newline();
				if(player.NumCocks() > 0)		
					Text.AddOutput("The mare turns to you and asks. <i>\"You sure?\"</i> You nod your head with certainty and turn the two away. You quickly get a hold of yourself[party] before heading out, thankful that you managed to leave with some dignity. ", parse);
				else
					Text.AddOutput("The stallion turns away from you and scoffs. <i>\"You're missing the ride of your life.\"</i> You furrow your eyebrows with anger and turn away from the two. You quickly get a hold of yourself[party] before heading out, thankful that you managed to leave with some dignity.", parse);
				Gui.NextPrompt(enc.finalize);
			}, enabled : player.LustLevel() < 0.8,
			tooltip : "Refuse their offer."
		});
		Gui.SetButtonsFromList(options);
	}, 1.0);
	
	scenes.Get();
}

Scenes.Equine.FuckFemale = function(enc) {
	var parse = {
		cockDesc : function() { return player.FirstCock().Short(); },
		pants    : player.ArmorDesc(),
		mobVagDesc : function() { return enc.mare.FirstVag().Short(); }
	};
	
	Text.Clear();
	Text.AddOutput("You greedily drink in the female's assets, eyes traveling down to her poorly-covered groin. You swear you can see drops of moisture travel down her long, slender, peach legs.", parse);
	Text.Newline();
	Text.AddOutput("<i> \"I... yeah.\"</i> It's the only confirmation you can release without sounding too eager.", parse);
	Text.Newline();
	Text.AddOutput("The scantily-clad mare slowly approaches you on her hooves, eyes glued to yours. Once within touching distance, without missing a beat, she puts her hand on your shoulder and eases you onto your back. Her glowing emerald gems melt your expression. ", parse);
	Text.Newline();
	Text.AddOutput("A telling feeling rises from your nethers, your [cockDesc] poking against her milky peach skin. Your eyes feel pinned to hers, smooth locks of brown hair drifting in front of one of her eyes. Her tits press into your chest, and she gropes your groin. <i>\"What are you waiting for?\"</i>", parse);
	Text.Newline();
	Text.AddOutput("That is a fair question. You snap out of your haze and wrap your hands around her waist, using some of your gathered strength to turn her over. In a moment's notice, you're sitting comfortably on top of a barely dressed mare, who watches you fiddle with your [pants] and get your [cockDesc] free of the uncomfortable prison. Once the tip's free, you feel a breeze tickle you. Briefly, you are aware that you're about to take an equine in the middle of the road. You glance behind you but the stallion is gone.", parse);
	if(!party.Alone())
		Text.AddOutput(" Your party is also missing, but you are not too worried about it.");
	Text.Newline();
	Text.AddOutput("Quickly returning your attention to the patient mare awaiting you, your eyes travel down to her thighs and the piece of pink that sits perfectly in her canyon. She peels back the leather covering herself and you move your hand to your [cockDesc], aiming the tip at the correct silo. It is incredibly moist, as if she has been fantasizing about you for hours. She moves her legs, curving them around your waist.", parse);
	Text.Newline();
	Text.AddOutput("With nothing else standing in your way, you put both of your palms in between her head and the cool ground. She squirms below you, her lower lips squishing against the tip. You ease inside of her hole as she releases a pent up breath. As you hilt yourself inside of her [mobVagDesc], she moans quietly, her eyes trained on yours. The base of your [cockDesc] is tickled by her labia, her pubic mound getting mixed up against yours.", parse);
	Text.Newline();
	
	Sex.Vaginal(player, enc.mare);
	player.Fuck(player.FirstCock(), 3);
	
	Text.AddOutput("You savor the moment, but not for long. You withdraw from her hot, tight cavern, every inch feeling her every rip. The sweet, indescribable feeling of her wet flesh squeezing against yours is something simply to be experienced. Once you feel the cool air brush against the last, soaked inch of your [cockDesc], you thrust back inside of her [mobVagDesc]. She rocks forward, moans a little louder, and you soak up every detail of her expression. As your hips drive in and out of her, your eyes drink in every detail of her ecstatic eyes.", parse);
	Text.Newline();
	Text.AddOutput("Pistoning mercilessly, you fuck her without a care in the world. Eventually your speed gets intense enough that she begins to call out and wraps her arms around your firm back. Her tits jiggle lewdly with every thrust and you can't resist the urge to grab her perky jugs. Your fingers grope her milk-makers, squeezing and flicking her nipples as your [cockDesc] ravages her [mobVagDesc]. Every moment drives you forward, the building release in your balls driving you deep into her channel.", parse);
	Text.Newline();
	Text.AddOutput("She moans while you rut your cock inside of the slutty hole she seduced you into. Your fingers start to lose grip of her breasts, sweat coming out of your palms. You move your hands down to her hips and clamp down on the peach skin. Her pussy squeezes wetly, squelching juices out of her slit. Every part of your [cockDesc] is covered in her pussy lube", parse);
	if(player.HasBalls())
		Text.AddOutput(", your balls bathed in her sweet smelling oil", parse);
	Text.AddOutput(". She tightens her arms around you, screaming, her eyes shut firmly as her body convulses around you. She squirts, cumming on your [cockDesc] before you even feel the need. The projecting girl-cum coats your abdomen quite nicely.", parse);
	Text.Newline();
	Text.AddOutput("The feeling of pushing your hips forward and her insides furiously stimulating every piece and section of your [cockDesc] leaves nothing to be desired. You've been enjoying it so much; your body tells you it's time to move on. You'd feel as though your impending orgasm might be a punishment, if it wasn't going to feel so satisfying. The mare has both of her green pupils staring right into yours; you were distracted for the last few moments. Your open mouth releases breaths like your hips are dealing out thrusts. She speaks in between moans.", parse);
	Text.Newline();
	Text.AddOutput("<i>\"Finish-Aaah... where you w-aaant-Oh!\"</i> She struggles to speak clearly as you spear her [mobVagDesc].", parse);
	Text.Newline();
	Text.AddOutput("Well, it looks like you have a choice. You're going to blow any second. Where are you going to do it?", parse);

	//[Inside][Tits][Face]
	var options = new Array();
	options.push({ nameStr : "Inside",
		func : function() {
			Text.Clear();
			
			Text.AddOutput("You decide to throw caution to the wind and ride it out. She moves her hands from where they once clung to your back and begins furiously rubbing her clit while juggling her own tits. Apparently she wants a second turn, and you're not raising any objections!", parse);
			Text.Newline();
			Text.AddOutput("Ignoring her pleasure, you tighten your grasp on her hips and begin to savagely fuck her. Every muscle and piece of energy inside of you driving toward one thing: filling this mare with your seed. Your [cockDesc] swiftly begins to empty your balls inside of her [mobVagDesc]. Cum paints her insides white, filling her with the sticky release. You fire countless shots off, feeling her body rock with another orgasm as you do it. Once you feel the spasms cease and the slight movements of your shaft pushing the cum out of her pussy, you can't help but look down and stare at that creampie.", parse);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "No turning back now, this feels way too good to stop!"
	});
	options.push({ nameStr : "Tits",
		func : function() {
			Text.Clear();
			
			Text.AddOutput("The rawest emotion in your mind tells you that it's a bit childish, but you go for it. Finally with someone giving you free reign, you decide to take advantage of it. You feel your orgasm dangerously close, and you pull out of her slick hole, not wanting to risk losing the opportunity. ", parse);
			Text.Newline();
			Text.AddOutput("You swiftly position your legs over hers, kneeling over her abdomen, and your hand squeezes around your [cockDesc], rapidly pulling. She seems to get the message and squeezes her juicy tits together, giving you a lusty grin. With nothing left stopping you, your [cockDesc] fires. White shots of cum cover her tits, drifting all over her chest. Some misfire and hit her neck, but a vast majority of your shots land on her creamy tits. She leans up slightly, and takes her seed covered jugs in her hands. The mare rubs your [cockDesc] into her soft breasts, coating you in your own orgasm. She looks up at you innocently, as if she was washing a counter top instead of tit-fucking you. She removes her jugs from the equation and takes your cum-covered [cockDesc] into her mouth, cleaning you off with her fat horse tongue.", parse);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Cum all over those magnificent tits of hers!"
	});
	options.push({ nameStr : "Face",
		func : function() {
			Text.Clear();
			
			Text.AddOutput("You give it a moment's thought and can think of no better place to choose. Your campaign of her defenseless hole is swiftly put on hold. You believe it to be thoroughly conquered, and look to fresh caverns to plunder. Pulling your [cockDesc] out of her sloppy cunt, you climb over her legs and lay your knees on her sides, against the cold stone below you. She perks up, pulling herself up a little bit, as you grab the back of her head and pull her equine face toward your groin. She opens her lips and takes your [cockDesc] into her inviting mouth.", parse);
			Text.Newline();
			Text.AddOutput("She begins lapping at your throbbing invader, her thick tongue wrapping around the tip. You buck your hips a few times and your cock begins spurting cum like never before. Not wanting to get away from your original goal, you pull yourself out of her hot mouth and continue the shelling on her face. Her heavy breaths cover your groin as each white spurt lands - sometimes in the growing pool on her tongue, other times on her cheeks and nose.", parse);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Jack off on her face."
	});
	Gui.SetButtonsFromList(options);

	Gui.Callstack.push(function() {
		Text.Clear();
		
		Text.AddOutput("<i>\"Oh, that was... better than expected. You are <b>good</b>!\"</i>", parse);
		Text.Newline();
		Text.AddOutput("You turn to the female, and she gives you a smirk. <i>\"What was your name again, honey?\"</i>", parse);
		Text.Newline();
		Text.AddOutput("You should have expected as much. After a few moments of deliberation, the mare hops to her feet. <i>\"Well, I've got to clean up. But I bet I'll see you around.\"</i> ", parse);
		Text.Newline();
		Text.AddOutput("After a few moments you collect your bearings.");
		if(!party.Alone())
			Text.AddOutput(" Your party rejoins you, and you question them as to where they went. They tell you not to worry about it, but you suspect the stallion had something to do with it!", parse);
			
		player.AddLustFraction(-1);
		
		Gui.NextPrompt(enc.finalize);
	});
}

Scenes.Equine.GetFucked = function(enc) {
	var parse = {
		cockDesc   : function() { return player.FirstCock().Short(); },
		vagDesc    : function() { return player.FirstVag().Short(); },
		clitDesc   : function() { return player.FirstVag().ClitShort(); },
		buttDesc   : function() { return player.Butt().Short(); },
		breastDesc : function() { return player.BiggestBreasts().Short(); },
		nipsDesc   : function() { return player.BiggestBreasts().NipsShort(); },
		pants      : player.ArmorDesc(),
		ifArmor    : player.Armor() ? "strips you down to full nudity" : "runs his hands down your naked body"
	};
	
	Text.Clear();
	
	Text.AddOutput("Your eyes betray you and despite whatever social norms have drilled in your brain, you can't help but squirm your legs in response.", parse);
	Text.Newline();
	Text.AddOutput("The stallion notices you staring and removes the small amount of clothing he has, completely revealing the currently semi-limp horse penis. You stare, thinking for a moment that you could play your interest off as academic, but soon realize you want what he's packing. Your hands shyly reach out for the hunk of flesh.", parse);
	Text.Newline();
	Text.AddOutput("He makes no move to stop you as you slowly stroke his black shaft to full mass. You analyze every inch of the erect flagship, the veins that protrude, the ring that forms a few inches after the base of the tool. Heat radiates off of it, you can feel your nethers damp with every passing moment.", parse);
	Text.Newline();
	Text.AddOutput("Looking up at the stallion, your hands slowly travel up his abdomen. You stand up straight, your wrists crossing each other behind his neck. He affectionately returns the gaze, his package pressing hotly against your body. The equine takes his hands and [ifArmor].", parse);
	Text.Newline();
	Text.AddOutput("Taking control, you press the equine onto his back. He thumps against the ground with a gruff groan and you swiftly mount his chest, your legs folded between his body, lying against the cold stone. Your [vagDesc] squelches against his muscled chest leaving a trail of natural lube. Sensually, you push yourself back, until your [buttDesc] are pressing against his meaty rod.", parse);
	Text.Newline();
	Text.AddOutput("You take his strong hands in your grasp and press his fingers into your breasts while rubbing your backside against the sensitive shaft. Once your [vagDesc] teases itself with rubbing his tip against it, however, you feel the irresistible urge to fill yourself to the hilt.", parse);
	Text.Newline();
	Text.AddOutput("With not a moment to spare, you give him an invitation inside, and his base RSVP's to the party in your [vagDesc]. An ecstasy filled moment later, your womb thanks the tip for arriving. His thickness fills you to the brim, no questions asked. Your hospitality is appreciated, and he shows that appreciation by rubbing and tweaking your tits. Neither of you move as your hands press into his lower torso, savoring the moment. Your breaths become heavy and labored.", parse);
	Text.Newline();
	
	Sex.Vaginal(enc.stallion, player);
	player.FuckVag(player.FirstVag(), enc.stallion.FirstCock(), 3);
	
	Text.AddOutput("The experience becomes amplified as your hips begin sliding up, riding the stallion for everything he's worth. He grunts every time you squeeze your insides around him, and you could probably make him cry out with just the manipulation of your hips if you weren't so distracted by your own pleasure. You continue to slide just a few inches off, then wetly slam back down to his balls.", parse);
	Text.Newline();
	Text.AddOutput("Your rapid breaths start turning into small concessions and moans. Moments pass and your pace increases, swiftly hilting yourself over and over, fingernails digging into his rough skin.", parse);
	if(player.BiggestBreasts().size.Get() > 10)
		Text.AddOutput("Your [breastDesc] begin to bounce with your exuberant thrusts, giving you an even more intensified feeling when his fingers flick your erect [nipsDesc].", parse);
	Text.Newline();
	Text.AddOutput("This quick, satisfying fuck can't last forever, as you soon realize. The stallion below you begins to make the stereotypical motions, his legs tightening and cease movement, his hips bucking at your withdrawals. He's going to blow at any second. Realizing that he might go before you're ready to reap your own reward, you devise a plan. ", parse);
	Text.Newline();
	
	// DESICIONS
	
	Gui.NextPrompt(function() {
		Text.Clear();
		
		Text.AddOutput("Before he's completely ready, you pull yourself off of his horse cock and turn your body around, your mouth taking deep breaths on his base while he stares at your [vagDesc] head on. You slowly stroke a few inches above the bottom of his cock, enticing him to pay attention to your puffed lips. He gets the memo, and not a moment later you feel his fat horse tongue lap greedily at you.", parse);
		Text.Newline();
		Text.AddOutput("Your own mouth works quite well, licking at his sides while jerking the boy off. Even feeling a little generous, you suckle on his sack, fitting one testicle into your mouth and shining it with your tongue. He presses the long, shaft-like muscle into your [vagDesc], his fingers rapidly rubbing your [clitDesc].", parse);
		Text.Newline();
		Text.AddOutput("Failing miserably at holding up to his methods, you cry out as your [vagDesc] clamps against his tongue, shooting girl-cum onto his muzzle. You swallow his tip and a few inches beyond that, furiously jerking the rest of his horse cock. Feeling the release come through the large rod, cum floods your mouth. At first, you try to gulp down his slightly sweet release, but it comes far too quick for that. You release his cock from your lips and the shaft shoots several ropes onto your expression, even on your chest. The immediate aftermath of your climax only makes you lustfully open your mouth for the falling seed.", parse);
		Text.Newline();
		Text.AddOutput("After a minute or so, you and the equine lazily get to your feet, clean up, redress, and head your different paths. When you pay more attention, you notice that the mare seems to be gone.", parse);
		if(!party.Alone())
			Text.AddOutput(" Your party eventually meets you on the path, and when you ask them where they were, they seem unwilling to tell you. You suspect the mare had something to do with that!", parse);
			
		player.AddLustFraction(-1);
		
		Gui.NextPrompt(enc.finalize);
	});
}

// SCENE FOR MALES/HERMS
Scenes.Equine.Threesome1 = function(enc) {
	var parse = {
		cockDesc : function() { return player.FirstCock().Short(); },
		mobVagDesc : function() { return enc.mare.FirstVag().Short(); },
		pants    : player.ArmorDesc(),
		armorDesc: player.ArmorDesc(),
		ifBalls  : function() { return player.HasBalls() ? "r balls" : ""; }
	};
	
	Text.Clear();
	
	Text.AddOutput("After a few moments of consideration, you shyly suggest that both of them participate. The stallion raises his eyebrow suggestively.", parse);
	Text.Newline();
	Text.AddOutput("<i>\"As long as your offering...\"</i> You two share a glance, and for a moment you consider if this might have been a bad idea. However, you look at his bulging crotch and feel butterflies in your stomach.", parse);
	Text.Newline();
	Text.AddOutput("The mare doesn't seem to mind either, and the two close in on you. You're already on your knees, from where you sat, waiting for them to decide what to do with you. Glad that they included you on the decision making, you watch each of them peel away the pieces of clothing they had. The mare's tits are just as juicy to you as the slowly throbbing horse cock just inches from your face. Seeing as it's the closest, you wrap your hands around the hips of the stallion.", parse);
	Text.Newline();
	Text.AddOutput("The sleek cock gives off quite the musk that makes your own [cockDesc] rise in your [armorDesc]. You can feel the mare swiftly pull your [pants] off of your sides, letting the breeze tickle your tip.", parse);
	Text.Newline();
	Text.AddOutput("You place one hand on the base of the now fully erect member, feeling only slightly intimidated by its size. With little consideration, you open your hot maw and manage to fit the tip in your mouth without too much of a fight. Your jaw strains, but eventually you fit a few more inches of the thick horse cock in. Your tongue works diligently to keep it wet and lubed, to further ease the conquest of your mouth.", parse);
	Text.Newline();
	Text.AddOutput("At the same time, you feel the mare's lips wrap around your [cockDesc]. Her fat horse tongue has no trouble covering your entire length in gobs of her saliva, and she expertly takes you into her throat.", parse);
	Text.Newline();
	Text.AddOutput("You still struggle to get half of the stud's cock in your mouth. A drop of pre-cum drips from his tip, which sweetly hits your tongue and you lap it up without a second's thought. The stallion takes his big, long fingers and wraps a hand around the back of your head. He doesn't push, but simply feeling his powerful hand sends shivers down your spine.", parse);
	Text.Newline();
	Text.AddOutput("The mare continues expertly sucking your [cockDesc] without breaking a sweat. She even puts your [cockDesc] in between her jugs, squeezing you with her soft, pillowy tits. You can't put much focus on the sweet feeling of her attention, but you can feel the rising orgasm climb through you.", parse);
	Text.Newline();
	Text.AddOutput("The next few moments you feel uncharacteristically exuberant about, squeezing your thumb in your palm while the fleshy invader slowly travels to the back of your mouth. Slowly, but surely, your upper lip kisses the base of the stallion's meaty rod. You feel adventurous and snake your tongue out of your lower lip, brushing the wet muscle with his sack for a moment. The choking feeling in your throat reels you back into reality and you have to pull back, letting his entire length snake out of your lips. You breathe heavily on the tip, and stare up at the recipient.", parse);
	Text.Newline();
	Text.AddOutput("You feel a similar action on your own [cockDesc] and look down. The mare's stares up at you with those big, green orbs, a saliva line linking her recently sucking tongue to your [cockDesc] as she huffs against you[ifBalls], tits in hand and fondling them.", parse);
	Text.Newline();
	Text.AddOutput("A brilliant idea crawls into your mind and you simply have to act on it. You reach your hands down to meet hers and with her slender digits in your hands, you pull her back as you lay down against the cold ground. Her boobs act as a fluffy air bag, bouncing off of your chest.", parse);
	Text.Newline();
	Text.AddOutput("Face to face with the mare you stare into her eyes for a moment, before she places her hands on the ground under your arms, and gives you a suggestive pose. Your hand reaches down to your [cockDesc], and you guide yourself to her buried treasure, feeling her sloppy hole welcome you with the red carpet. She rolls her full hips into you, swallowing your [cockDesc] inside of her tight holding cell.", parse);
	Text.Newline();
	
	Sex.Vaginal(player, enc.mare);
	player.Fuck(player.FirstCock(), 3);
	
	Text.AddOutput("With her body bent over yours, you notice the stallion behind her, unsure of where to insert himself. You think it best to suggest one to him.", parse);
	Text.Newline();
	
	//TODO variations
	// BREAK POINT
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.AddOutput("You beckon the male to come around to the other side, where the mare is lolling her tongue about, while her hips are flopping eagerly against your wet [cockDesc].", parse);
		Text.Newline();
		Text.AddOutput("He comes over at your earnest and the female looks up lustfully at the hung male. He gets on his knees, pressing forward near the mare's head. His floppy sack hangs just a few inches from your face while his hips press the tip of his horse cock to the mare's inviting maw. She takes the lengthy shaft to the back of her throat, apparently designed to take her hung species. Her thick, animalistic tongue drips saliva onto your chest.", parse);
		Text.Newline();
		Text.AddOutput("You and the stallion begin pinning her in between your cocks, your hips thrusting her into his thick pole, and his rapid throat fucking sending her thighs into yours. Both of you increase the speed of your mutual fuck, juices squelching loudly and muffed moans filling the air.", parse);
		Text.Newline();
		Text.AddOutput("The male equine's balls above your eyes noticeably tighten, flapping back and forth from slapping the mare's chin, and you can feel yourself approaching the tidal wave as well. Rolling in and out of the deep [mobVagDesc], your legs eagerly piston ever forward.", parse);
		Text.Newline();
		Text.AddOutput("It comes quick: your [cockDesc] begins clenching and you roughly push as deep into her cunt as you can, dumping your seed with fervor. The feeling of her [mobVagDesc] around you contracting in climax is utter bliss. The horse cock above you follows, both of his hands tightly gripping her skull, burying his horse cock in her throat while firing off his load.", parse);
		Text.Newline();
		Text.AddOutput("Eventually the mare pulls away from his rod while he's still shooting. She has neglected to swallow any of it, and as the tip leaves her lips, the flood of virile cum comes down her chest and begins dripping on you. The semi-erect horse cock covered in semen rises something in your stomach and you can't help but grab the base of his dick, pushing your head up and swallowing him with one lusty gulp. Your tongue works quickly, cleaning him of his release and sending the salty treat down your gullet. The mare follows your lead and you take turns cleaning him off, both of you lovingly working for the sweet reward.", parse);
		Text.Newline();
		Text.AddOutput("The scene calms down slowly, and you recollect your bearings. The two equines go their way", parse);
		if(!party.Alone())
			Text.AddOutput(", and you go back to your party. They were knocked out from the fight, unfortunately, so they have no idea what they missed.", parse);
		else
			Text.AddOutput(", leaving you alone again.", parse);
			
		player.AddLustFraction(-1);
		
		Gui.NextPrompt(enc.finalize);
	});
}

Scenes.Equine.Threesome2 = function(enc) {
	var parse = {
		cockDesc   : function() { return player.FirstCock().Short(); },
		vagDesc    : function() { return player.FirstVag().Short(); },
		clitDesc   : function() { return player.FirstVag().ClitShort(); },
		buttDesc   : function() { return player.Butt().Short(); },
		breastDesc : function() { return player.BiggestBreasts().Short(); },
		nipsDesc   : function() { return player.BiggestBreasts().NipsShort(); },
		pants      : player.ArmorDesc(),
		armorDesc  : player.ArmorDesc(),
		mobVagDesc : function() { return enc.mare.FirstVag().Short(); }
	};
	
	Text.Clear();
	
	Text.AddOutput("You suggest that both of them have some fun with you. The mare seems excited and the stallion gives both of you an approving glance. You give the mare a beckoning motion and she excitedly kneels down to your level, bringing you in for a kiss, slipping her tongue into your mouth. You have a brief skirmish with the fat muscle before you pull yourself down to the cool stone ground.", parse);
	Text.Newline();
	Text.AddOutput("You and the mare begin fondling each other's assets while stripping any pieces of clothing that remains on either of you. With both of you laying on each other, it gives the perfect view to the stallion of two pussies and asses waiting for his throbbing shaft.", parse);
	Text.Newline();
	Text.AddOutput("Distracted by the tits in your hands, you almost forget about the stallion, until you feel that flat tip press up against your [vagDesc]. You giddily continue rubbing the mare's chest, moaning into her tongue as he presses several inches inside of you.", parse);
	Text.Newline();
	
	Sex.Vaginal(enc.stallion, player);
	player.FuckVag(player.FirstVag(), enc.stallion.FirstCock());
	
	Text.AddOutput("The mare greedily presses her slit against his cock, rubbing her wet lips into his shaft. He presses his hands on your hips, latching onto them. The horse hilts himself inside of your [vagDesc], your lips breaking contact with the mare as you moan into her face.", parse);
	Text.Newline();
	Text.AddOutput("After the stallion starts going a decent pace in your tight insides, the female above focuses on your [clitDesc], rubbing the pleasure button furiously. You moan like a bitch but are quickly silenced by the mare, who presses her lips against yours once more. Instead of fighting with her thick muscle, you bend to its will and have a sweet dance in your mouth.", parse);
	Text.Newline();
	Text.AddOutput("Each of your tits rock against each other as the stallion roughly fucks your hole. He continuously makes love with your womb, your slick [vagDesc] giving him red carpet access. With the constant and vigorous stimulation of your clitoris and the steamy thickness of the stallion filling you up to the brim, your walls convulse with an orgasm that hits much quicker than you'd like. You squeeze down on the cock inside you, trying to milk the male. He remains steadfast and waits until your body stops cumming on his horse cock before removing himself and impaling the pussy above yours. This time, the mare breaks lip contact to moan in your face.", parse);
	Text.Newline();
	Text.AddOutput("You think that it's quite fair game to give her a piece of her medicine. Your hand moves up to her soaking wet [mobVagDesc] and you eventually find her little pleasure bud, which you immediately begin pleasantly torturing. Her moaning maw is somewhat of an issue, however. You decide to fill her slutty mouth with three of your fingers, which she sucks on without any type of consideration. Her teeth rub against your flesh in a gentle manner.", parse);
	Text.Newline();
	Text.AddOutput("She receives the same treatment you got, her slit pounded with a foot or more of horse shaft. You can still feel a portion of his balls slap against your [clitDesc], gobs of girl-lube dripping onto your puffy lips. The rocking feeling of her pussy being stuffed rocks against your grounded body, your nipples still gyrating against hers.", parse);
	Text.Newline();
	Text.AddOutput("With the meticulous pleasure centered on the female it'd be foolish to think she could last very long. She clamps down around the bestial shaft inside of her, squirting cum over you and the stallion. You give a few triumphant rubs to her sensitive bud and remove your saliva covered fingers from her mouth.", parse);
	Text.Newline();
	Text.AddOutput("The stallion suddenly pulls out of the mare and for a moment you are unsure of what he's doing. Before you think of pushing the mare out of the way, you feel a cool shot hit your sore slit and several more following up. The stallion softly stroked himself to orgasm over both of your pussies, covering both in his potent seed. You and the mare have the same idea, and begin stuffing the semen into each other's cunts.", parse);
	Text.Newline();
	Text.AddOutput("Despite having quite a fun time, you and the equines part ways.", parse);
	if(!party.Alone())
		Text.AddOutput(" Your party awakens, and questions the strange smell on your body. You ignore their probes, and head out.", parse);
		
	player.AddLustFraction(-1);

	Gui.NextPrompt(enc.finalize);
}



