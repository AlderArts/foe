/*
Tier 1 Malice scouts and outriders
*/

Scenes.MaliceScouts = {};
Scenes.MaliceScouts.Catboy = {};

/*
 * 
 * Catboy Mage, lvl 9-13
 * 
 */
function CatboyMage(levelbonus) {
	Entity.call(this);
	this.ID = "catboymage";
	
	this.avatar.combat     = Images.catboy;
	this.name              = "Catboy";
	this.monsterName       = "the catboy";
	this.MonsterName       = "The catboy";
	this.body.DefMale();
	this.FirstCock().thickness.base = 4;
	this.FirstCock().length.base = 19;
	this.Balls().size.base = 2;
	
	this.maxHp.base        = 500;
	this.maxSp.base        = 800;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 25;
	this.dexterity.base    = 30;
	this.intelligence.base = 60;
	this.spirit.base       = 55;
	this.libido.base       = 20;
	this.charisma.base     = 15;
	
	this.elementDef.dmg[Element.mWater]  = -0.5;
	
	var level = 0;
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		level = 9;
	}, 4.0, function() { return true; });
	scenes.AddEnc(function() {
		level = 10;
	}, 5.0, function() { return true; });
	scenes.AddEnc(function() {
		level = 11;
	}, 3.0, function() { return true; });
	scenes.AddEnc(function() {
		level = 9;
	}, 2.0, function() { return true; });
	scenes.AddEnc(function() {
		level = 13;
	}, 1.0, function() { return true; });
	scenes.Get();
	
	this.level             = level + (levelbonus || 0);
	this.sexlevel          = 0;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 4;
	
	this.body.SetRace(Race.Feline);
	
	this.body.SetBodyColor(Color.white);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Feline, Color.white);
	
	this.body.SetEyeColor(Color.green);

	this.weaponSlot   = Items.Weapons.MageStaff;
	this.topArmorSlot = Items.Armor.MageRobes;
	
	this.Equip();
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
CatboyMage.prototype = new Entity();
CatboyMage.prototype.constructor = CatboyMage;

CatboyMage.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.1)  drops.push({ it: Items.Felinix });
	if(Math.random() < 0.02) drops.push({ it: Items.Tigris });
	if(Math.random() < 0.5)  drops.push({ it: Items.Whiskers });
	if(Math.random() < 0.5)  drops.push({ it: Items.HairBall });
	if(Math.random() < 0.5)  drops.push({ it: Items.CatClaw });
	
	if(Math.random() < 0.01) drops.push({ it: Items.Bovia });
	if(Math.random() < 0.1)  drops.push({ it: Items.GoatMilk });
	if(Math.random() < 0.1)  drops.push({ it: Items.SheepMilk });
	if(Math.random() < 0.1)  drops.push({ it: Items.CowMilk });
	if(Math.random() < 0.05) drops.push({ it: Items.LizardEgg });
	if(Math.random() < 0.05) drops.push({ it: Items.MFluff });
	
	if(Math.random() < 0.3)  drops.push({ it: Items.FreshGrass });
	if(Math.random() < 0.3)  drops.push({ it: Items.SpringWater });
	if(Math.random() < 0.1)  drops.push({ it: Items.Foxglove });
	if(Math.random() < 0.1)  drops.push({ it: Items.TreeBark });
	if(Math.random() < 0.1)  drops.push({ it: Items.RawHoney });
	
	if(Math.random() < 0.05) drops.push({ it: Items.Wolfsbane });
	if(Math.random() < 0.05) drops.push({ it: Items.Ramshorn });
	
	if(Math.random() < 0.01) drops.push({ it: Items.BlackGem });
	if(Math.random() < 0.01) drops.push({ it: Items.CorruptPlant });
	if(Math.random() < 0.01) drops.push({ it: Items.CorruptSeed });
	if(Math.random() < 0.01) drops.push({ it: Items.DemonSeed });
	
	return drops;
}

CatboyMage.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.name + " acts! Meow!");
	Text.NL();
	Text.Flush();
	
	// Pick a random target
	var targets = this.GetPartyTarget(encounter, activeChar);
	var t = this.GetSingleTarget(encounter, activeChar);
	
	this.turnCounter = this.turnCounter || 0;
	
	var first = (this.turnCounter == 0);
	this.turnCounter++;
	
	if(first) {
		Items.Combat.DecoyStick.combat.Use(encounter, this);
		return;
	}
	
	var that = this;

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Abilities.Attack.Use(encounter, that, t);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Items.Combat.DecoyStick.combat.Use(encounter, that);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Items.Combat.HPotion.combat.Use(encounter, that);
	}, 1.0, function() { return that.HPLevel() < 0.5; });
	scenes.AddEnc(function() {
		Abilities.Black.Bolt.Use(encounter, that, t);
	}, 3.0, function() { return Abilities.Black.Bolt.enabledCondition(encounter, that); });
	scenes.AddEnc(function() {
		Abilities.Black.Eruption.Use(encounter, that, targets);
	}, 4.0, function() { return Abilities.Black.Eruption.enabledCondition(encounter, that); });
	scenes.AddEnc(function() {
		Abilities.Black.ThunderStorm.Use(encounter, that, targets);
	}, 3.0, function() { return Abilities.Black.ThunderStorm.enabledCondition(encounter, that); });
	scenes.Get();
}

/* TODO
Scenes.MaliceScouts.Catboy.Impregnate = function(mother, father, slot) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : father,
		race   : Race.Feline,
		num    : 1,
		time   : 30 * 24,
		load   : 2
	});
}
*/

Scenes.MaliceScouts.Catboy.LoneEncounter = function(levelbonus) {
	var enemy    = new Party();
 	var catboy   = new CatboyMage(levelbonus);
	enemy.AddMember(catboy);
	var enc      = new Encounter(enemy);
	enc.catboy   = catboy;
	
	enc.onEncounter = function() {
		var parse = {
			day : world.time.LightStr("sun beats down warmly", "moon shines softly")
		};
		parse = player.ParserTags(parse);

		Text.Clear();
		parse["f"] = player.HasLegs() ? " in your feet" : "";
		Text.Add("Wandering of the foothills of the highlands for about an hour, you don’t find anything of note amongst the rocky ground and tall grasses. The air is crisp and the [day] upon you; although you’re starting to feel the rigors of the hard, uneven ground[f], there’s a certain quality to it that you nevertheless find quite refreshing and invigorating.", parse);
		Text.NL();
		parse["f"] = player.HasLegs() ? " - or perhaps where your thighs would have been, if you’d had any" : "";
		Text.Add("No better time for a quick break, then, before all that traveling really gets to you. The gently rounded top of a nearby hill offers a perfect spot to take a breather - high up in the midst of a stiff breeze, and with a good view of the surrounding lands to survey them and plan your next move. The grasses get taller as you move along, reaching up to perhaps mid-thigh[f], but you press on ahead and are at the top before long.", parse);
		Text.NL();
		Text.Add("Yes, this is indeed the life. Shrugging off your possessions, you ", parse);
		if(party.Num() > 1) {
			if(party.Num() == 2)
				parse["comp"] = party.Get(1).name;
			else
				parse["comp"] = "your companions";
			Text.Add("and [comp] ", parse);
		}
		Text.Add("lounge around for a bit to recuperate, closing your eyes to feel the wind on your [skin] and simply savoring the wonder of the great outdoors. As you’re reveling in the natural sensations, though, something else makes itself known to you - cold and clammy as it winds about your arms and body…", parse);
		Text.NL();
		Text.Add("Opening your eyes with a start, you quickly realize that tendrils of a mist-like substance have risen out of a particularly thick patch of grass and begun curling about your arms and body, pushing at you as they begin to tighten. Thankfully, they’re still largely immaterial, and you easily manage to break free with a bit of concentrated effort. Readying your [weapon], you spring into action with a yell and leap at the tall grass.", parse);
		Text.NL();
		Text.Add("What you flush out isn’t quite what one might have expected: instead of an animal or wild monster, what emerges into the open is a small-ish catboy, perhaps no more than five and a half feet tall. A large hood covers much of his head and hair, the garment having large slits cut out from its fabric to accommodate the catboy’s large, white-furred ears. Bits of translucent mist fall from his fingers, marking him as the one who’d tried to ensnare you with that spell; his simple brown cloak and baggy pants billow in the stiff breeze as he yowls and tries to run away. Unfortunately for the poor catboy, the large belt at his waist with all the pouches and implements - as well as what looks like a pocket-sized spellbook - unbalance him somewhat; he loses his footing, comically trips over something hidden in the grass and plants his face into the ground.", parse);
		Text.NL();
		Text.Add("You almost feel sorry for the poor, effeminate guy. Almost. He did try to truss you up with magical bindings on the sly, after all.", parse);
		Text.NL();
		Text.Add("The catboy desperately attempts to right himself as you approach, his snowy-furred tail thrashing to and fro as he gathers magic into the palm of his hand. Fear, practically pouring off him like a waterfall, turns into a kind of grim determination as he quickly concludes he’s being cornered.", parse);
		Text.NL();
		Text.Add("<i>“Went out to prove that I’m worthy of being a man,”</i> he mutters to himself as he brushes dirt off his threadbare shirt. <i>“And I’m going to do it!”</i>", parse);
		Text.NL();
		Text.Add("<b>It’s a fight, although you wonder if it really has to be one…</b>", parse);
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
	enc.onLoss    = Scenes.MaliceScouts.Catboy.LossPrompt;
	enc.onVictory = Scenes.MaliceScouts.Catboy.WinPrompt;
	
	return enc;
}

Scenes.MaliceScouts.Catboy.WinPrompt = function() {
	var enc  = this;
	SetGameState(GameState.Event);
	
	var parse = {
		
	};
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("A loud yowl sounds from the catboy mage as he stumbles back. It’s impressive how despite his frail-looking frame, he’s managed to take as much punishment as he already has and still remain standing. You’re not exactly sure when you actually hit him in the face, but there’s blood pouring out of his nose in a frenetic nosebleed and his large, floppy ears have folded flat against his tattered hood.", parse);
		Text.NL();
		Text.Add("<i>“Okay, okay, you win,”</i> he mumbles in a distinctly nasal voice, no thanks to his nosebleed. <i>“Maybe being captured isn’t so bad, after all. At least I’ll be able to get away from everything.”</i> He holds out a hand as if about to fashion a spell, then thinks the better of it and lets it fall to his side.", parse);
		Text.NL();
		Text.Add("So… now that you’re talking like reasonable people… just what in the seven hells was he doing, anyway?", parse);
		Text.NL();
		Text.Add("He blows his nose into his hands and looks aghast at the bloody mess that results, his tail drooping. <i>“You want to know?”</i>", parse);
		Text.NL();
		Text.Add("Yes.", parse);
		Text.NL();
		Text.Add("<i>“You really want to know?”</i>", parse);
		Text.NL();
		Text.Add("Given that he was going to ensnare you, no doubt for whatever nefarious purposes he had in mind, you’d like to think you’re owed a small courtesy for not thrashing him within an inch of his life like he deserves.", parse);
		Text.NL();
		Text.Add("Upon hearing this, the catboy shrinks back even more and mewls pathetically. Actual fright, or an attempt to play off your emotions? Who knows? <i>“Um, well, you see, the others at the camp said I needed to go out and be a man, if you know what I mean… really aren’t enough camp followers to go around, and to be honest I’m not really very good at this sort of thing…”</i>", parse);
		Text.NL();
		Text.Add("You motion for him to go on, and to stop mumbling.", parse);
		Text.NL();
		Text.Add("<i>“So I thought that if I actually went and did it with an outsider, at least word wouldn’t spread about how useless I am…”</i>", parse);
		Text.NL();
		Text.Add("Right. You’re seeing how this is shaping up. ", parse);
		if(party.Num() > 1) {
			parse["s"] = party.Num() > 2 ? "s" : "";
			Text.Add("Maybe he should’ve, you don’t know, at least not picked a target which would leave him outnumbered?", parse);
			Text.NL();
			Text.Add("<i>“Didn’t see your friend[s] there. Grass was tall.”</i>", parse);
			Text.NL();
		}
		Text.Add("Yeah, hopeless. What’re you going to do with this poor sop?", parse);
		Text.Flush();
		
		var options = [];
		
		options.push({nameStr : "Pet",
			tooltip : Text.Parse("Aww, what a pathetic little kitty. Why don’t you give him a scratch?", parse),
			enabled : true,
			func : function() {
				Scenes.MaliceScouts.Catboy.Petting(enc);
			}
		});
		/* TODO
		options.push({nameStr : "",
			tooltip : Text.Parse("", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
			}
		});
		*/
		
		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("This doesn’t have anything on you. Whatever’s been going on between this catboy and his friends, it’s nothing that you want any part of. If he wants to be a man, he can go learn to be one somewhere else.", parse);
			Text.NL();
			Text.Add("You dismiss the poor bastard with a wave of your hand, and he scurries off instantly, moving surprisingly fast as his thin legs carry him over the next hill and out of sight. Hopefully, he’s learned something from this, although you’re not going to hold out hope for that.", parse);
			Text.Flush();
			Gui.NextPrompt();
		});
	});
	Encounter.prototype.onVictory.call(enc);
}

Scenes.MaliceScouts.Catboy.Petting = function(enc) {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("An idea comes into your mind, and you hold out your hands as you advance upon the catboy mage, waggling your fingers suggestively. The poor bastard’s eyes widen in fear as you close the distance between the two of you, grinning like a madman.", parse);
	Text.NL();
	Text.Add("<i>“W-what do you intend?”</i>", parse);
	Text.NL();
	Text.Add("Oh, nothing much. But those large, white ears of his are so fuzzy, you can’t help but want to give them a good petting.", parse);
	Text.NL();
	Text.Add("Before the poor schlub can react, you’ve gone and thrown off his hood and stuck a hand atop his head, fingers running through his grayish-white hair and finding those large, fuzzy ears of his. Mm… they’re every bit as nice and pleasant to the touch as they look, and just being in contact with them makes you feel all warm and good inside.", parse);
	Text.NL();
	Text.Add("The catboy instantly breaks into a cold sweat at your touch, his voice going as weak as his knees. You feel him give a little push against your hand, but then he rapidly catches himself and draws away. <i>“H-hey! S-stop it!”</i>", parse);
	Text.NL();
	Text.Add("Now, why should you? If he didn’t want them to be fondled, then they shouldn’t be so large. Considering that he was attempting to truss you up with magical bonds and rape you while you were helpless, he’s getting off lightly with a bit of ear-scratching, isn’t he? One way or the other, he’s not in any position to be making demands of you.", parse);
	Text.NL();
	Text.Add("The poor bastard looks down at his sandaled feet. <i>“Well, yeah…”</i>", parse);
	Text.NL();
	Text.Add("Then that settles things. If he doesn’t like it that much, maybe he should lie back and think of Eden?", parse);
	Text.NL();
	Text.Add("The catboy gives a plaintive whimper-meow and hangs his head. You’re not going to drag this any further, and take the opportunity to thrust your fingers straight between his sprightly ears. Slowly, you begin to rub large, lazy circles through his hair and fur, eliciting pitiful mewls from the catboy mage; he resists for a few seconds, and then is unable to help himself as he presses himself against your palm, eyes fluttering closed as he begs for more. Sure, he might be a mage, but there’s no chance he’ll be casting any spells in his current euphoric state of mind.", parse);
	Text.NL();
	Text.Add("Heh. Whether by accident or design, it seems like you’ve found this guy’s weakness. Smirking, you increase the vigor of your stroking and rubbing, feeling the catboy’s fear and unhappiness dissolve away under your increased attentions. It’s clear from the way his knees are shaking that he won’t be able to stay standing much longer, so you place your hand on his shoulder and guide him to the ground. He’s more than willing to obey, sprawling on the soft grass with his belly up and tail wrapped about one thigh, his entire being practically putty in your hands so long as you keep on giving him more and more of those exquisite scritches.", parse);
	Text.NL();
	Text.Add("What a poor bastard. With a weakness like this, it’s little wonder that he’s being mercilessly teased for being a pushover; to be honest, he should embrace his nature, not defy it. You lavish some more attention on the catboy’s ears, both hands working in tandem to cover every inch of those pointy, fluffy peaks before turning in and about to tease at the bushy tufts of fur in their insides.", parse);
	Text.NL();
	Text.Add("That certainly hits the spot. A desperate, needy caterwaul escapes the catboy mage’s lips as his slight form quakes with repressed pleasure; his breath comes hot and heavy even as you notice that his formerly baggy pants are tenting, the fabric growing tight with evidence of his mounting arousal. As you watch, the very peak of the tent grows ever higher as something strains within…", parse);
	Text.NL();
	Text.Add("Well, there’s no reason you shouldn’t let that all out. Pausing your scritching for a moment, you reach for the catboy’s pants with a hand and yank them down hard to his knees, revealing a thick and throbbing cat-cock complete with barbs along its length. It’s not <i>huge</i>, but is nevertheless large enough to look out of place on the catboy mage’s slight, effeminate frame. Thick, pulsating veins wrap about its surface, joining one feline barb to another - just as your thumb brushes against the catboy’s delicate ear-tufts, he shudders from head to toe and looses a small squirt of pre from the tip of his maleness.", parse);
	Text.NL();
	Text.Add("<i>“There’s a good kitty,”</i> you whisper to the catboy as focus your attentions on his ear-tufts, rubbing the fine hairs between thumb and forefinger. <i>“There’s a very, very good kitty.”</i>", parse);
	Text.NL();
	Text.Add("He yowls again, his member twitching as it strains against its fleshy confines, trying to get even bigger than what its physical form will allow. Heh, it’s just like the rest of him - a grand spirit constrained by the body it inhabits… as you watch, pre starts oozing down its length, glistening all the while…", parse);
	Text.Flush();
	
	//[Handjob][Tease]
	var options = [];
	options.push({nameStr : "Handjob",
		tooltip : Text.Parse("Why not give the poor pent-up kitty a hand?", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("Hey, you may not have made him a man like he wanted, but you’ve still made him feel very, very good. Leaving one hand to continue teasing and prodding at the catboy’s ears, you seize his considerable maleness in the other, stroking him off with an up-and-down pumping motion. The cartilaginous barbs along his shaft push into your palms, every bit as hard as the rest of his cock; you tighten your grip, feeling them dig into your flesh.", parse);
			Text.NL();
			Text.Add("Oooh…", parse);
			Text.NL();
			Text.Add("Greedily, you brush the heel of your palm against one of the barbs, while taking another into your fingers and teasing it much like your other hand is doing with the catboy’s ear-fluff. He whimpers and puts up a last smidgen of resistance, feebly trying to bat your hands away while his body betrays him and his hips start pushing against your fingers.", parse);
			Text.NL();
			Text.Add("<i>“No… don’t do this to me…”</i>", parse);
			Text.NL();
			Text.Add("Your only answer to that is to pump away at his shaft with renewed vigor, a motion that has him go practically catatonic with delight, his little pink tongue hanging out of the corner of his mouth, his eyes glazed over and unfocused. Wrapped about his shaft, your hand distinctly picks up on the increasingly powerful throbbing of the virile and desperate cat-cock in its grasp.", parse);
			Text.NL();
			Text.Add("Dividing your attention between the catboy’s ears and his shaft, you begin to stroke him off in earnest; your effeminate friend responds instinctively, mirroring each tug on his manhood with a thrust of his hips. The catboy pants and mewls, his chest heaving and straining with each gasp and moan, need and desperation welling up as his cock continues to strain at your fingers. Soon, your hand is soaked with feline seed as he grows dangerously close to release, brain completely scrambled by the conflicting sensations of comfort and arousal coming from both ends of his body.", parse);
			Text.NL();
			Text.Add("<i>“Now, now,”</i> you whisper, giving the catboy one final brush of his head and ears. <i>“There’s no need to get all excited.”</i>", parse);
			Text.NL();
			Text.Add("That tiny bit of stimulation is enough to push the poor catboy over the brink of ecstasy. With a mewling yelp, a thick stream of spunk spews from his manhood and arcs through the air in a slimy spray, coming to rest in a sticky shower a good three or four feet away from him. Spirits, you can swear that his nutsack visibly deflates with the release - which really isn’t that surprising, considering how little release he must get in the course of his daily life.", parse);
			Text.NL();
			parse["manwoman"] = player.mfTrue("man", "woman");
			Text.Add("Undeterred by the literally sticky situation that you’re faced with, you grab the catboy’s shaft once more and pump away furiously like a [manwoman] possessed, squelching sounds rising from your fingers as you work away diligently. The poor bastard writhes on the ground as he continues to blow his load all over the grass and your hands; the flow continues unabated for a good fraction of a minute before it begins to show signs of dying down.", parse);
			Text.NL();
			Text.Add("All good things must eventually come to an end, though, and the catboy’s torrential ejaculation slowly dies down to a dribble that runs down his maleness and onto your fingers. You clench your fist about his slowly softening shaft, feeling the thick spunk squish and burble, then wipe your digits clean on his clothes. The catboy himself is utterly drained, ears twisting this way and that as he pants away with the occasional groan of exhaustion.", parse);
			Text.NL();
			player.AddSexExp(2);
			PrintDefaultOptions();
		}
	});
	options.push({nameStr : "Tease",
		tooltip : Text.Parse("That, from just an ear rub? Let’s find out just how much of a hair-trigger he is...", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("Teasingly, you tell the catboy that he really is a hair-trigger - all this from just an ear rub?", parse);
			Text.NL();
			Text.Add("<i>“C-can’t help it!”</i> he manages to get out. <i>“P-please, don’t-”</i>", parse);
			Text.NL();
			Text.Add("Don’t what? Do this?", parse);
			Text.NL();
			Text.Add("<i>“A-aah!”</i> the feline yelps, arching his back as you pinch his sensitive ears. The magician’s staff throbs erratically in response to your teasing, sending a gout of sticky white pre that mats his snowy fur.", parse);
			Text.NL();
			Text.Add("<i>“No, d-don’t… don’t...”</i> he gasps. The kitty squirms helplessly as you keep relentlessly petting him without regards for his demands. He’s just so cuddly and cute! The mage has his eyes almost closed, eyes drawn into some heavenly realm not allowed mere mortals. You chuckle as he begins purring despite himself, fully giving in to his weakness.", parse);
			Text.NL();
			Text.Add("<i>“Don’t… stop,”</i> he mewls pleadingly. There’s a good, honest pussy!", parse);
			Text.NL();
			Text.Add("Spurred by the now placated feline’s squirming, you work up his shirt to expose his belly, covered in soft white fur. He’s slender, hardly a hint of muscle visible. Once again, you’re struck by the wonders of magic - that such power could be wielded by someone with as delicate a frame as this!", parse);
			Text.NL();
			Text.Add("As you sink your [hand] into the fur on his tummy, you are rewarded with the biggest gasp yet. The catboy arches his back, throbbing kitty-cock hard as a rock. This guy is just full of weak spots!", parse);
			Text.NL();
			Text.Add("You hum to yourself while you pet your kitty, keeping yourself amused by alternating your teasing between his sensitive ears and vulnerable stomach. The snowy feline is growing more and more excited by the minute, purring and squirming in your grasp. Finally, your gentle torture becomes too much for him and he cries out, hips thrusting impotently at the air as his seed sprays all over himself. You quickly retract your belly-rubber, not wishing a shower of spunk all over you.", parse);
			Text.NL();
			Text.Add("The catboy is less lucky in this regard as most of his own fountaining seed lands right back down on him, splattering all over his fur and leaving him a sticky mess. After quite an impressive climax for someone his size, the shuddering kitty simmers down, collapsing in a heap.", parse);
			Text.NL();
			player.AddSexExp(1);
			PrintDefaultOptions();
		}
	});
	
	Gui.Callstack.push(function() {
		Text.Add("See? That wasn’t so bad after all. He may not have become a man in the sense that he might have put it, but he most certainly had a bit of fun, didn’t he?", parse);
		Text.NL();
		Text.Add("The catboy mewls and flicks his tail.", parse);
		Text.NL();
		Text.Add("Now there’s a good kitty. You tousle his hair, and his still-twitching dick makes the extra effort to let loose a few more spurts of cum before giving up completely and flopping down to join the rest of him.", parse);
		Text.NL();
		Text.Add("Looking good, then. With how peaceful this windy hilltop is, it’s probably safe to leave this mewling, drooling wreck as he is. Nothing’s probably going to come across him… and if something <i>does</i>, well, maybe he’ll actually get his chance to learn to be a man.", parse);
		Text.NL();
		Text.Add("With that, you get yourself cleaned up and prepare to go on your way.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.MaliceScouts.Catboy.LossPrompt = function() {
	SetGameState(GameState.Event);
	Text.Clear();
	
	// this = encounter
	var enc = this;
	
	var parse = {
		
	};
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Slight as the catboy may be, the raw destructive force of his magics is too much for you to you bear. Bruised and battered from sheer force, your body finally gives up the ghost and buckles under its own weight, sending you toppling to the ground. Before you can recover, more tendrils of that same magical mist wind about your limbs, quickly solidifying and trussing you up like a pig in a poke.", parse);
		if(party.Num() > 1) {
			if(party.Num() > 2) {
				parse["comp"]    = "your companions";
				parse["notS"]    = "";
				parse["heshe"]   = "they";
				parse["hasHave"] = "have";
			}
			else {
				var p1 = party.Get(1);
				parse["comp"]    = p1.name;
				parse["notS"]    = "s";
				parse["heshe"]   = p1.heshe();
				parse["hasHave"] = "has";
			}
			Text.Add(" A quick glance at [comp] reveal[notS] that [heshe] [hasHave] pretty much befallen the same fate, restrained with magical bonds identical to the ones which you now bear.", parse);
		}
		Text.NL();
		Text.Add("Hesitantly, uncertainly, the catboy approaches you, panting from the tussle you’ve just gone through. He distinctly avoids looking you in the eye as he reaches into a pocket in his baggy pants and pulls out a small slip of paper.", parse);
		Text.NL();
		Text.Add("<i>“Hmm, what to do now… okay, that’s ambush done, and now subdue…”</i> he draws out a stub of pencil and ticks the items off the list. <i>“And right at number four is become a man, so… hey, he left the third step out, there’re only just question marks here!”</i> The catboy flicks his large, fluffy ears and grumbles irritably, tail swishing about as he pockets the paper. <i>“Guess he wanted me to figure it out for myself…”</i>", parse);
		Text.NL();
		Text.Add("Oh, great. Not only are you facing an unappealing rapist, you’re facing an unappealing rapist who <i>doesn’t even know what he’s doing</i>. You don’t think things can get any worse from here on out… can they?", parse);
		Text.NL();
		
		//TODO Scenes
		//Return true for valid scenes, indicating successful scene proc
		
		var scenes = new EncounterTable();
		/* TODO
		scenes.AddEnc(function() {
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			return true;
		}, 1.0, function() { return true; });
		*/
		var ret = scenes.Get();
		
		// Default fallback
		if(!ret) {
			Text.Add("He looks you up and down a few times, scratching his head intermittently, and then mumbles to himself. <i>“Don’t think this is what he meant by that… guess I’ll have to find another one. Oh, bother.”</i>", parse);
			Text.NL();
			Text.Add("With that, he shuffles off, leaving you in the lurch to recover on your own time. That’s quite a while thanks to the magical beating he gave you, but at length you do manage to get up - albeit shakily - without anything else coming to harass you in the meantime.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}
	});
	Encounter.prototype.onLoss.call(enc);
}
