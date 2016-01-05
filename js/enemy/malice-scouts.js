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
	this.intelligence.base = 50;
	this.spirit.base       = 45;
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
		
		options.push({nameStr : "Petting",
			tooltip : Text.Parse("Aww, what a pathetic little kitty. Why don’t you give him a scratch?", parse),
			enabled : true,
			func : function() {
				Scenes.MaliceScouts.Catboy.Petting(enc);
			}
		});
		options.push({nameStr : "Petplay",
			tooltip : Text.Parse("Play around with the kitty, put him in his place. Have him put that mouth of his to good use.", parse),
			enabled : true,
			func : function() {
				Scenes.MaliceScouts.Catboy.PetPlay(enc);
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

Scenes.MaliceScouts.Catboy.PetPlay = function(enc) {
	var catboy = enc.catboy;
	var p1cock = player.BiggestCock();
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	Text.Clear();
	Text.Add("A smile crosses your face as an idea comes to mind. Yes… yes, that should do very nicely. With how pathetic the catboy is, you bet he’ll even like it. Acting all innocent, you step forward, crook a finger under the catboy’s chin and tell him to lose the clothes. After all, animals aren’t in the habit of wearing clothes, and you’re pretty sure he’s too much of a simpering sop to be anything but one.", parse);
	Text.NL();
	Text.Add("The catboy mage looks up at you, eyes wide with alarm. <i>“No! What do you mean? I-”</i>", parse);
	Text.NL();
	Text.Add("Animals don’t talk either, you remind him as you grab him by the collar of his cloak. And those who make too much noise are badly trained, and badly trained animals often are in dire need of… well, <i>correction</i>.", parse);
	Text.NL();
	Text.Add("He’s so pathetic, he’s not even fit to wield the smallest shred of dignity. Loose and baggy as they are, the catboy’s cloak and pants come off with ease; he tries to shy away, but his token resistance is soon defeated by you taking a step forward and batting his arms away.", parse);
	Text.NL();
	Text.Add("Bad! Bad kitty!", parse);
	Text.NL();
	Text.Add("The catboy flinches a little, but his submissive nature wins out in the end and he mewls pathetically, cringing as he folds his ears flat against his head. So much for the stereotypical devil-may-care feline attitude; this fine specimen will make someone a great pet. Grabbing his tunic, you pull it off with a flourish, leaving him as naked as the day he entered the world.", parse);
	Text.NL();
	Text.Add("Truth be told, he doesn’t actually <i>look</i> that bad - under his clothes, the catboy’s a fine, long-haired specimen, his fur as white as his large, floppy ears and fluffed up against the cold highland air. Most incongruous, though, is his slightly above-average shaft and balls - the former possibly a considerable nine inches when fully engorged with bumpy, nubby protrusions running down its length and clustered on its head. He squirms and flushes as he feels your gaze on his fur, clearly desperate to cover himself as you size him up.", parse);
	Text.NL();
	Text.Add("Time to get him properly tamed, then. The hallmark of a well-trained pet is being comfortable about familiar people, after all. Reaching up to the spot between the catboy’s large, floppy ears, you give the thick fur a good scratching, making sure to let your touch play generously with his ears. He starts to groan and purr, making happy little noises in the back of his throat; once you’re certain he’s well and truly out of it, you divert one of your hands downwards to cup his balls.", parse);
	Text.NL();
	Text.Add("Hmm. They’re certainly not minotaur-sized, but on the other hand they’re very palm-filling - almost large enough to spill over the edges of your hand. A twitch of movement nearby draws your attention, and your eyes are drawn to his dick to see it swell and stiffen with his growing arousal. The nubby protrusions, too, are engorging - although not as drastically as his shaft itself - the cartilaginous nubs hardening into something more approaching the traditional barbs of a cat-cock.", parse);
	Text.NL();
	Text.Add("Aww, does he like it?", parse);
	Text.NL();
	Text.Add("The catboy just mewls and looks at you with kitten-like eyes. Well, time to move on to the next stage. Grinning, you focus on your hand still on his head and gently but firmly start pushing downwards. He gets your intentions clear as day, and happily settles down on all fours like a proper pet cat should before giving you an affectionate nuzzle of his head and rubbing his body all about your [legs].", parse);
	Text.NL();
	Text.Add("Good kitty. Good, good kitty.", parse);
	Text.NL();
	Text.Add("He mewls happily and paws at you, eager to please.", parse);
	Text.NL();
	Text.Add("Time to move on, then. You’ll need a collar for your pet kitten, something to let others know he’s a proper pet and not some stray out in the woods. Turning your attention to the catboy’s discarded clothes, you spy the belt he’d been using to hold his baggy pants up - yes, this will do very nicely. You move over, pick it up, then return to your pet’s side and fashion the belt into a makeshift collar - loose enough so that he can breathe easily, but secure enough that he won’t be accidentally slipping out of it when you’re not looking. The metal buckle is a bit loose, and jingles against itself as it moves much like a bell would.", parse);
	Text.NL();
	Text.Add("Wonderful. It’s not the best, but it’ll do for a properly claimed pet. The catboy barely makes a fuss throughout the whole process, shying away a little at first but soon warming up to the notion as you pet him some more and make general noises of approval in his direction. With a final click, you secure the collar in place and note that makeshift as it is, it’s really very fetching on him.", parse);
	Text.NL();
	Text.Add("Now, since he’s been such a good kitten, would he like a treat?", parse);
	Text.NL();
	Text.Add("An enthusiastic nod, followed by two more.", parse);
	Text.NL();
	Text.Add("Right. He’ll have to be trained to take it properly, though. First, he’ll have to learn some self-restraint… with that thought in mind, you quickly divest yourself of your [botarmor], letting your", parse);
	if(player.FirstCock() && player.FirstVag())
		Text.Add(" mixed genitalia enjoy the cool mountain breeze as they’re exposed to the elements", parse);
	else if(player.FirstVag())
		Text.Add(" juicy pussy wink at him as fabric falls away to reveal your womanhood to the world", parse);
	else if(player.FirstCock()) {
		Text.Add(" shaft[s] ", parse);
		if(player.HasBalls())
			Text.Add("and balls ", parse);
		parse["their"] = (player.NumCocks() > 1 || player.HasBalls()) ? "their" : "its";
		Text.Add("hang out and flop in the cool mountain air, finally released from [their] cramped confines", parse);
	}
	Text.Add(".", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("At the sight of your womanly flower, the catboy’s eyes go wide to sickeningly sweet proportions. The entirety of his body trembles with repressed need - he’s clearly fighting it, trying to be an obedient, good kitty in the face of your commands, but it’s a losing battle that he’s waging against his treacherous body.", parse);
		Text.NL();
		Text.Add("No! Bad kitten! He’s not going to release until you give him the go-ahead!", parse);
		Text.NL();
		Text.Add("The catboy meows piteously, but is unable to stem the rising tide that’s gathering within him. Already stiff from before, you see his cat-cock throb between his legs, looking ever bigger than before - even the barbs are fully extruded, and the slightest mountain breeze against them sends more blood rushing to his manhood.", parse);
		Text.NL();
		Text.Add("A single dollop of pre wells up on the catboy’s cockhead; he mewls again, feeling it thin out into a strand and drip onto the grass underneath him.", parse);
		Text.NL();
		Text.Add("If he dares…", parse);
		Text.NL();
		Text.Add("He makes the mistake of looking up at you again - right into the glistening lips of your cunt, ", parse);
		if(player.FirstCock())
			Text.Add("nestled underneath your [cocks]", parse);
		else
			Text.Add("not six inches from his face", parse);
		Text.Add(" and smelling heavily of sex. That’s it - unable to hold himself back any longer, the catboy flops back onto his rump and instinctively thrusts his hips forward as spooge bursts from his shaft in great gouts, his balls shrinking slightly as they empty their load to who-cares-where. Most of it lands on himself, soiling his skin and fur, but some manages to get on your [feet].", parse);
		Text.NL();
		Text.Add("Bad kitten! Now look at what he’s done - that’s a right proper mess he’s made here, and who’s going to clean it up?", parse);
		Text.NL();
		Text.Add("The catboy meows and shrinks back on himself, cringing.", parse);
		Text.NL();
		Text.Add("Him, that’s who! He can start with you, then clean himself up; that’ll be adequate punishment for such a bad kitty. Or does he need you get out the squirt bottle? Actually, it’s highly unlikely that you actually <i>have</i> a squirt bottle, but he’s just a silly kitten; he doesn’t know that.", parse);
		Text.NL();
		Text.Add("At the mere mention of a squirt bottle, your kitten goes completely prone on the floor, covering his eyes with his hands as he lands in his own puddle of cum with a soft squelch. Sighing, you step up, give him a little pat between the ears, then instruct him to hurry up and get to cleaning if he wants to make things right and have a chance at being a good kitty again.", parse);
		Text.NL();
		Text.Add("The mere suggestion is enough to get him springing into action once more. Getting up to all fours, your kitten rubs himself against your [legs], giving you a couple of nuzzles for good measure, then starts lapping up the messy spooge like milk from a saucer. Now that’s not so bad - the feel of your pussy’s damp, warm and rough tongue moving rhythmically would be so much better against your pussy - but you’ll have to exhibit a tad of self-restraint on your part if you’re going to teach him that important lesson.", parse);
		Text.NL();
		Text.Add("Before too long, he’s done, and then he starts on himself, bending his body in ways that can only be attributed to a healthy dose of feline flexibility. With that much seed, though, and how he’s gotten it all over himself lying down in that puddle of his own making, it’s going to take some time for him to be done, more than you have on hand. Besides, even if he’s trying to make amends now, he‘s been a bad kitten, and you’re not sure if he still deserves that treat any more.", parse);
		Text.NL();
		Text.Add("…Hah, interesting. Given his longer than normal cock and prodigious flexibility, you catch your kitten sucking himself off - barely so, with only the tip of his head fitting in between his lips, but he technically still <i>is</i> giving himself a blowjob. He looks up at you guiltily when he feels your gaze upon him, but you decide to let it slide - after all, you have to suppose he is cleaning himself up in a fashion.", parse);
		Text.NL();
		Text.Add("Still, you don’t have to be idle here. Since your kitten’s all hunched over sucking himself off, that leaves his tailhole open to attack - and that’s what you do, swiftly stepping around him, pulling his tail up, and jabbing a finger right into that tight, virgin pucker. Your pretty kitty, mewls in surprise, eyes going wide with shock, and almost chokes on his own barbed cat-cock.", parse);
		Text.NL();
		Text.Add("Hehe. You can tell he likes it, though, judging by the way he wiggles his body in response to you flexing your finger. Inch by inch, you sink your digit deeper into his warm tailhole, violating it and forcing it to take in something which it’s never had the pleasure of taking before. Deeper and deeper you go, until every last joint is firmly sequestered in his butt - and then you start trying to find his prostate.", parse);
		Text.NL();
		Text.Add("It doesn’t take you long for you to hit gold - the reaction from your kitten is obvious as he tries to hold back the second surge of cum that he feels welling up in his balls. Tears spring into his large, clear eyes as he realizes that he’s going to be a bad kitty again, but you give him a quick pat between the ears with your free hand and tell him that you’re giving him permission to spill his seed if need be.", parse);
		Text.NL();
		Text.Add("He seems to enjoy it a lot more after that, almost as much as you do - you can feel his body trembling as it tries to adjust to this strange, alien pleasure you’re giving him, even as he continues to suck himself off. Judging by the familiarity with which he’s going through the motions, it’s clear that this isn’t the first time he’s given himself a blowjob, and you can’t help but wonder if this is how he usually gets himself off when you’re not around to watch him…", parse);
		Text.NL();
		Text.Add("Well, that’s a thought for later. Here and now, your business is having a good time playing with your cute, subby pet, and that’s just what you go ahead and do with great relish. Feeling his cum surge again, your kitten closes his eyes and clamps his lips down tight around his barbed cocktip. His balls churn again, and then spurts of white seed are gushing from his shaft again.", parse);
		Text.NL();
		Text.Add("Try as he might, your feline pet can’t help but cough and splutter; his shaft slips free from his mouth and he struggles to contain it. That, too, is a fruitless endeavor, and before long your kitten is looking up at you again with forlorn eyes that peer through the creamy white facial he’s given himself. For a second load in so short a time, that’s quite the production he’s got going over there.", parse);
		Text.NL();
		Text.Add("Sensing that some consolation is in order, you give your pet a few more ear scritches and let him know that he hasn’t been a bad kitty this time round. Not that he’s been a <i>good</i> kitten, either, but he hasn’t been bad because what just happened wasn’t his fault. Also, seeing him like this has put you in a marginally better mood.", parse);
		Text.NL();
		Text.Add("He just mewls again and paws at his face with his hands, trying to wipe off the worst of the mess. Sheesh, even at this point, he can’t help but appear pathetic, can he? It’s almost as if it’s baked into his nature.", parse);
		Text.NL();
		Text.Add("Very well, then - you’ll let him off this time. No more freebies from you, though, so he shouldn’t get used to it!", parse);
		Text.NL();
		Text.Add("Your pet looks at you hopefully, silently promising that he won’t.", parse);
		
		player.AddLustFraction(0.4);
		player.AddSexExp(2);
	}, 3.0, function() { return player.FirstVag(); });
	scenes.AddEnc(function() {
		Text.Add("Eyeing your [cocks], the catboy ", parse);
		if(p1cock.Len() >= 30) {
			Text.Add("shudders a little at the sight of your massive cock[s]. He swallows hard and shies away a little, clearly intimidated by the thought of what you intend.", parse);
			Text.NL();
			Text.Add("He hadn’t counted on this? Well, that’s too bad for him. Yes indeed, this is a <i>big</i> treat, and you’re going to require that he eat it <i>all</i> up. Kitties who waste even the smallest portions of their treats are bad kitties, and bad kitties don’t just not get treats in the future, but they also need to be punished.", parse);
			Text.NL();
			Text.Add("He doesn’t want to be punished, does he?", parse);
			if(player.NumCocks() > 1)
				Text.Add(" You imperiously motion to the biggest of your shafts.", parse);
			Text.NL();
			Text.Add("Your kitten meows and shakes his head vigorously, the makeshift bell on his belt-collar clattering away. Yes, he knows the score. Gingerly, almost timidly, he gets off all fours and kneels in front of you, bowing his head submissively. You waggle your massive treat in his face for a few seconds, getting his attention, and smile as he takes it mid-length in both hands and opens his mouth wide.", parse);
			Text.NL();
			Text.Add("That’s right. That’s a good kitty. Now, open wide and say ‘ah’.", parse);
			Text.NL();
			Text.Add("He obeys unthinkingly, the soft tones of your voice lulling him into a sense of security. Once that cute little mouth of his is open, you thrust with everything you’ve got, slip out of his grasp, and plunge as deep into his throat as he’s capable of accommodating. The poor kitten’s eyes go wide as his breath is suddenly cut off, making piteous, strangled noises in the back of his throat as he struggles for breath, but you remain resolute in your actions; he needs to be properly trained if he’ll even make a good pet.", parse);
			if(player.NumCocks() > 1)
				Text.Add(" Your other dick[s2] grind[notS2] against his forehead, reminding the effeminate pussy that this’ll end messily for him, no matter how good he is at swallowing.", parse);
			Text.NL();
			
			Sex.Blowjob(catboy, player);
			catboy.FuckOral(catboy.Mouth(), player.FirstCock(), 2);
			player.Fuck(player.FirstCock(), 2);
			
			Text.Add("As you’d expected, your kitten gets over his surprise quickly enough, wheezing and spluttering several times but eventually settling into a rhythm that allows him to get some measure of his breath back while pleasuring you.", parse);
		}
		else if(p1cock.Len() >= 18) {
			Text.Add("seems a little unsure at the sheer sight of your stupendous shaft[s], but gets over his uncertainties soon enough and closes in. You take the moment to praise him for being such a brave kitty, ready to face a task that he very well knows might be daunting, and he practically blushes with pride.", parse);
			Text.NL();
			Text.Add("Aww, is he unaccustomed to being praised? Well, he’ll get a lot more of it if he continues proving himself to be a good, obedient kitty. Now, won’t he please go ahead and get his treat?", parse);
			Text.NL();
			Text.Add("Your pretty kitten purrs delightedly and grabs hold of[oneof] your [cocks] in both hands, closing his eyes in delight as he slides his lips over your [cockTip]. You feel it, too, waves of pleasure radiating outwards like ripples on a still pond surface. Deeper and deeper, he takes you into his mouth, breath hot against your man-meat, and it’s only after you bump against the back of his throat that he begins scraping at the underside of your shaft with his rough, warm tongue.", parse);
			if(player.NumCocks() > 1)
				Text.Add(" Feeling left out, your other cock[s2] grind[notS2] against the feline’s upturned face, dribbling [itsTheir2] sticky pre all over his soft fur.", parse);
			Text.NL();
			
			Sex.Blowjob(catboy, player);
			catboy.FuckOral(catboy.Mouth(), player.FirstCock(), 2);
			player.Fuck(player.FirstCock(), 2);
			
			Text.Add("Mm, that feels good, doesn’t it? You were already hard before, but faced with such a tender touch, the entirety of your length feels full to bursting, hard as diamonds - or at least, it <i>feels</i> that way.", parse);
			Text.NL();
			Text.Add("So, does he like his treat? Is it a yummy one?", parse);
			Text.NL();
			Text.Add("Your kitten nods vigorously, the warm and wet insides of his mouth shifting against your shaft and making you moan with delight. Well, he should know that you’re enjoying giving him this treat as much as he’s enjoying having it, so he should be an obedient kitty as much as possible in the future, yes?", parse);
			Text.NL();
			Text.Add("He purrs, and the vibrations carry through his flesh, up your rod and into your groin. Ah, the simple pleasures of life.", parse);
		}
		else {
			Text.Add("opens his mouth eagerly and without hesitation, revealing its warm, pink insides and that little sandpapery tongue of his. Mmm… you can practically feel it against your [cock] now, wrapping lovingly about the girth of[oneof] your man-meat[s] while you’re stroked to fullness…", parse);
			Text.NL();
			Text.Add("The lewd thoughts flood into your mind unbidden, coming fast and hard, and you take a moment to take a deep breath and let it all out in a happy sigh. It’s not as if your kitten’s going anywhere, anyway - he’s staring enraptured at your prick[s], watching the meaty member[s] bob up and down in time with your heartbeat. You can see him just itching to bat at[oneof] [itThem] like some kind of plaything, but he’s successfully resisting the urge so far. What a strong-willed pet you have - maybe he deserves a <i>double</i> helping of kitty treats as a reward…", parse);
			Text.NL();
			parse["it"] = player.NumCocks() > 1 ? "one" : "it";
			Text.Add("Wasting no more time, you thrust your [cocks] at the catboy, practically poking him in the face with [itThem] a few times before he manages to catch [it] in both hands and guide it into his waiting maw. Your kitten’s mouth is as warm and wet as the inside of any other hole, and his tongue as divine as you’d envisioned it to be.", parse);
			if(player.NumCocks() > 1)
				Text.Add(" Your other member[s2] grind[notS2] against his upturned face, reminding him that there’s more treats to go around.", parse);
			Text.NL();
			
			Sex.Blowjob(catboy, player);
			catboy.FuckOral(catboy.Mouth(), player.FirstCock(), 2);
			player.Fuck(player.FirstCock(), 2);
			
			Text.Add("Sure, he’s lacking in experience, but a desperate, almost childish eagerness to please manages to make up for that somewhat. Purring deeply in the back of his throat, your kitty slides your shaft in and out of his mouth a few times, leaving it glistening with his spit before commencing to lick his delicious kitty treat like a large lollipop.", parse);
			Text.NL();
			Text.Add("Now, there’s no need to be conservative with enjoying his just reward; all he needs to do is continue being a good kitty, and he’ll get more treats just like this one. He should eat up with gusto, you tell your pet as you ruffle his fur and ears. It really <i>does</i> feel very good when you do that…", parse);
			Text.NL();
			Text.Add("Obediently, he takes a deep breath, then slides his head and body forward to swallow the entirety of your [cock] up to the base, suppressing his gag reflex as your [cockTip] hits the back of his throat. Now <i>that’s</i> a trick!", parse);
		}
		Text.NL();
		Text.Add("This goes on for a little while longer as your pet continues to worship you, licking and sucking away, the natural movements of his mouth seemingly in time with the throbbing of your shaft[s]. Pleasured in such a fashion, it’s not long before you begin feeling the warning tingles of impending orgasm, and you smile at the thought of your pet discovering the creamy center of his delectable kitty treat.", parse);
		if(player.NumCocks() > 1)
			Text.Add(" The pre leaking from your unused cock[s2] might give him a hint.", parse);
		Text.NL();
		Text.Add("With the catboy’s rough, sandpapery tongue working away, you blow your load in no time at all - it happens so quickly that you’re surprised yourself. Your kitten’s eyes flick open in surprise as the first thick rope of seed explodes in his mouth; reeling instinctively, he lets go of your shaft, coughing and spluttering as you empty the rest of your tank straight onto his face.", parse);
		if(player.NumCocks() > 1)
			Text.Add(" Not to be left out, your other dick[s2] [isAre2] quick to add [itsTheir2] generous addition[s2] to his already tasty treat.", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		
		if(cum > 7) {
			Text.Add("Try as you might to hold back, you can’t slow, let alone stifle the deluge of thick, gooey cum that’s built up in ", parse);
			if(player.HasBalls())
				Text.Add("your balls", parse);
			else
				Text.Add("you", parse);
			Text.Add(". Throwing your head back from the sheer force of it all, you let out a cry as you sperm bursts free of you and gushes all over the catboy. Your poor kitty has barely enough time to try and shield himself ineffectually with an arm before the barrage of sperm hits him.", parse);
			Text.NL();
			Text.Add("And a deluge it is, a veritable flood that sweeps over the catboy and threatens to carry him off his feet and away into the distance - or at least, that’s what it <i>feels</i> like. Once you’ve started, you can scarcely stop, and the most you manage to hear from your pet is a few plaintive meows as globs upon globs of thick sperm land on his skin and fur, horribly despoiling his once-pristine vestige even further.", parse);
			Text.NL();
			Text.Add("On his part, your pet kitten doesn’t seem to care - if anything, he seems equally curious and amused by the thick coat of seed which you’re covering him with. Once he gets over his initial fear and shyness of this new situation, he quickly takes to being bathed in cum like a duck to water; he happily splashes around in the thick, sticky puddles you’re creating on the ground and rubbing his paws all over his body, smearing it across himself as if it was some kind of lotion. Come to think of it, it probably is…", parse);
			Text.NL();
			Text.Add("Nevertheless, that’s so adorably cute; there’re few things more endearing in life than a cute kitten enjoying himself for real. By the time you’re done, the catboy looks like a dribbly candle - an unevenly-shaped pillar of white with wide eyes and the faint outline of large, floppy ears.", parse);
		}
		else if(cum > 4) {
			Text.Add("Your pet instinctively averts his gaze, turning his cheek towards you - but alas, it does him little good given the force of the flow that erupts from your [cocks]. It’s got all the volume and power of a fire hose, but a lot thicker and weightier than one would expect of a fire hose’s usual fare - the first ropes of spunk to hit your kitten do so with gusto, staggering him and nearly knocking him over.", parse);
			Text.NL();
			Text.Add("Well, if that isn’t a show to watch! Not that you could’ve stopped if you wanted to - with so much sperm pent up in you, rippling waves of satiation and satisfaction course through your body as ", parse);
			if(player.HasBalls())
				Text.Add("your [balls] empty themselves with shocking speed", parse);
			else
				Text.Add("you spew string after string of virile seed", parse);
			Text.Add(" onto your poor pet kitty, making him mewl and whimper in shock and surprise as he’s momentarily blinded by having his face plastered with sperm.", parse);
			Text.NL();
			Text.Add("Oh, come now - why does he have to be so fussy about it? It’s not as if you’ve turned the squirt bottle on him, have you?", parse);
			Text.NL();
			Text.Add("The catboy just meows again as spooge runs off his face, dripping off his chin and running down his neck to stain the rest of his body. Grabbing the length of[oneof] your [cocks] with both hands, you pump back and forth desperately, wringing out every last drop of jism you have in you and sending it right onto the catboy’s face. There’s little left of his features now save for the vague outline of his head and above all odds, his ears, two vaguely triangular spooge-covered points jutting out from the top of his creamy head.", parse);
			Text.NL();
			Text.Add("At length, your ejaculation does begin to abate somewhat, but not before your pretty kitty has been thoroughly despoiled, his skin and fur covered with a glistening layer of cum that stretches from head to toe. It’s a bit uneven in parts, but that’s only to be expected - it’s not as if you’ve managed enough production to give him an even coating, alas.", parse);
			Text.NL();
			Text.Add("Finally managing to open one eye and look about him, your pet kitten meows at you curiously, pawing at you; you reach down and give him a reassuring pat on the head. There, there.", parse);
		}
		else {
			Text.Add("While your production isn’t as high as you’d hoped it would be, you nevertheless manage to come up with enough ejaculate to give your pet kitty a hearty faceful of delicious cream. He certainly seems to take an instant liking to it, his small, pink tongue darting out of his mouth and touching his lips in an experimental taste before coming out for more.", parse);
			Text.NL();
			Text.Add("Well, let him have all he wants - there’s still more where that came from.", parse);
			Text.NL();
			Text.Add("Since he’s not sucking you off any more, it’s up to you to bring yourself the rest of the way and you do just that, grabbing[oneof] your rock-solid [cocks] with both hands and pumping up and down its length furiously. It’s like this that you spend the next few moments, playing your manhood like a fiddle in a bid to wring out every last drop of cum out from you and onto your pet kitten’s face. Your breathing becomes short and labored as you ride out your orgasm, feeling the workings of your body shift and ebb. Seeing what you’re up to, the catboy leans forward and begins licking your [cockTip] once more, catching stray strands and droplets of creamy seed on his dainty little tongue, purring all the while.", parse);
			Text.NL();
			Text.Add("What a good little kitty he is, to sense your need like that and volunteer his help without you needing to ask! Surely he deserves a second helping of delectable creamy kitty treats - and right on cue, you feel a huge load coming down the pipe!", parse);
			Text.NL();
			Text.Add("Your pet kitty must have sensed it too, for he meows happily and wastes no time in locking his lips with your [cockTip], determined to not waste the treat this time. Such a good kitty - yes, yes, he deserves everything that’s coming to him!", parse);
			Text.NL();
			Text.Add("With an air-rending groan, you shake and shudder a second time, blasting gob after gob of creamy feline treat into the catboy’s mouth. It’s probably nowhere as thick and nutritious as your first load, but that’s probably for the best given your pet’s inexperience in receiving goodies like these. ", parse);
			if(player.NumCocks() > 1)
				Text.Add("Your other cock[s2] add[notS2] [itsTheir2] load to [itsTheir2] previous mess on his innocent face, soiling his fur in your seed. ", parse);
			Text.Add("You see his cheeks balloon outwards as he struggles to take all your sperm in without wasting even a single drop of his precious kitty treat, swallowing furiously, and give him yet another pat on his cum-smeared head, ruffling his hair and ears as you praise your precious little pet for trying so hard.", parse);
			Text.NL();
			Text.Add("Finishing the last of his treat, the catboy pulls away from your manhood with an audible pop and smack of his lips, wiping away a strand of seed with the back of his hand. ", parse);
			if(player.NumCocks() > 1)
				Text.Add("Taking meticulous care to not waste your sticky gift, the catboy cleans up the load you deposited on him and eagerly slurps them up, starved for more of your precious cream. ", parse);
			Text.Add("He looks up at you with wide, adoring eyes and meows, closing them in pure bliss and rubbing his head against your crotch.", parse);
			Text.NL();
			Text.Add("Aww… isn’t that so cute.", parse);
		}
		
		Text.NL();
		Text.Add("Eventually, your feline pet gets himself cleaned up a bit - from the spunk dripping off him onto the ground, if nothing else. Looking at the facial - and a bit more - that you’ve just given him, you smile at your kitten approvingly and tell him what a delightful pet he’s been.", parse);
		Text.NL();
		Text.Add("He purrs and bows his head submissively, exposing enough of his neck such that you can bestow scritches unto him. Between the makeshift collar you’ve given him and all the spooge that coats his exterior, it’s not an easy task, but you manage it nonetheless - he’s earned as much for his efforts at being a good kitten.", parse);
	}, 1.0, function() { return player.FirstCock(); });
	scenes.Get();
	
	Text.NL();
	Text.Add("All right, then - that’s enough play for today. You’ve had a bit of fun, but you’ve got other things that need doing and have to be on your way. Your pet whimpers a little, sad to see you go, but you pull on your [botarmor] and tell him firmly that he can wait for you if he wants, but he shouldn’t expect you to be back that soon.", parse);
	Text.NL();
	Text.Add("He mewls unhappily, but doesn’t try to follow when you fold up his clothes and place them neatly by the side of the road. After all, you’ve trained him better than that, and he knows he’d be a bad kitty if he disobeyed.", parse);
	Text.NL();
	Text.Add("Throwing one last look over your shoulder as you saunter back down the road, the parting sight you have of your pet is that of him sitting on his haunches, staring at you forlornly. You swallow hard - now, you can’t just take in every stray who looks like he might make a good pet - you’d be swamped in cats before long!", parse);
	Text.Flush();
	
	Gui.NextPrompt();
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
			Text.Add("Greedily, you brush the heel of your palm against one of the barbs, while taking another into your fingers and teasing it much like your other hand is doing with the catboy’s ear-fluff. He whimpers and puts up a last smidgen of resistance, feebly trying to bat your [hand]s away while his body betrays him and his hips start pushing against your fingers.", parse);
			Text.NL();
			Text.Add("<i>“No… don’t do this to me…”</i>", parse);
			Text.NL();
			Text.Add("Your only answer to that is to pump away at his shaft with renewed vigor, a motion that has him go practically catatonic with delight, his little pink tongue hanging out of the corner of his mouth, his eyes glazed over and unfocused. Wrapped about his member, your hand distinctly picks up on the increasingly powerful throbbing of the virile and desperate cat-cock in its grasp.", parse);
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
			Text.Add("<i>“No, d-don’t… don’t...”</i> he gasps. The kitty squirms helplessly as you keep relentlessly petting him without regards for his demands. He’s just so cuddly and cute! The mage has his eyes almost closed, gaze drawn into some heavenly realm not allowed mere mortals. You chuckle as he begins purring despite himself, fully giving in to his weakness.", parse);
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


