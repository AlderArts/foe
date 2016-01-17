/*
Tier 1 Malice scouts and outriders
*/

Scenes.MaliceScouts = {};
Scenes.MaliceScouts.Catboy = {};
Scenes.MaliceScouts.Mare = {};

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
		level = 12;
	}, 2.0, function() { return true; });
	scenes.AddEnc(function() {
		level = 13;
	}, 1.0, function() { return true; });
	scenes.Get();
	
	this.level             = level + (levelbonus || 0);
	this.sexlevel          = 0;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 5;
	
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


/*
 * 
 * Centaur Mare, lvl 9-13
 * 
 */
function CentaurMare(levelbonus) {
	Entity.call(this);
	this.ID = "centaurmare";
	
	this.avatar.combat     = Images.centaur_mare;
	this.name              = "Centauress";
	this.monsterName       = "the centauress";
	this.MonsterName       = "The centauress";
	this.body.DefFemale();
	this.FirstVag().virgin = false;
	this.Butt().virgin     = false;
	
	this.maxHp.base        = 1000;
	this.maxSp.base        = 400;
	this.maxLust.base      = 400;
	// Main stats
	// High stamina, dex. Mid str, int, spi, libido. Low cha.
	this.strength.base     = 40;
	this.stamina.base      = 50;
	this.dexterity.base    = 45;
	this.intelligence.base = 35;
	this.spirit.base       = 35;
	this.libido.base       = 30;
	this.charisma.base     = 15;
	
	this.elementDef.dmg[Element.mEarth]  = 0.5;
	
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
		level = 12;
	}, 2.0, function() { return true; });
	scenes.AddEnc(function() {
		level = 13;
	}, 1.0, function() { return true; });
	scenes.Get();
	
	this.level             = level + (levelbonus || 0);
	this.sexlevel          = 0;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 5;
	
	this.body.SetRace(Race.Horse);
	
	this.body.SetBodyColor(Color.brown);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Horse, Color.black);
	
	this.body.SetEyeColor(Color.blue);

	this.weaponSlot   = Items.Weapons.OakSpear;
	this.topArmorSlot = Items.Armor.BronzeChest;
	this.botArmorSlot = Items.Armor.BronzeLeggings;
	
	this.Equip();
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
CentaurMare.prototype = new Entity();
CentaurMare.prototype.constructor = CentaurMare;

CentaurMare.prototype.DropTable = function() {
	var drops = [];
	
	if(Math.random() < 0.1)  drops.push({ it: Items.Equinium });
	if(Math.random() < 0.05) drops.push({ it: Items.Taurico });
	if(Math.random() < 0.01) drops.push({ it: Items.EquiniumPlus });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseHair });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseShoe });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseCum });
	
	if(Math.random() < 0.3)  drops.push({ it: Items.FruitSeed });
	if(Math.random() < 0.2)  drops.push({ it: Items.Hummus });
	if(Math.random() < 0.2)  drops.push({ it: Items.SpringWater });
	if(Math.random() < 0.1)  drops.push({ it: Items.FlowerPetal });
	if(Math.random() < 0.1)  drops.push({ it: Items.Wolfsbane });
	
	if(Math.random() < 0.05) drops.push({ it: Items.Weapons.OakSpear });
	if(Math.random() < 0.05) drops.push({ it: Items.Armor.BronzeChest });
	if(Math.random() < 0.05) drops.push({ it: Items.Toys.EquineDildo });
	if(Math.random() < 0.05) drops.push({ it: Items.Combat.HPotion });
	if(Math.random() < 0.05) drops.push({ it: Items.Combat.LustDart });
	
	if(Math.random() < 0.01) drops.push({ it: Items.Caprinium });
	if(Math.random() < 0.01) drops.push({ it: Items.Cerventine });
	if(Math.random() < 0.01) drops.push({ it: Items.Estros });
	if(Math.random() < 0.01) drops.push({ it: Items.Fertilium });
	if(Math.random() < 0.01) drops.push({ it: Items.FertiliumPlus });
	
	return drops;
}

CentaurMare.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.name + " acts! Hyaaah!");
	Text.NL();
	Text.Flush();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);
	
	var that = this;

	var scenes = new EncounterTable();
	
	scenes.AddEnc(function() {
		Abilities.Attack.Use(encounter, that, t);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Abilities.Physical.Bash.Use(encounter, that, t);
	}, 2.0, function() { return Abilities.Physical.Bash.enabledCondition(encounter, that); });
	scenes.AddEnc(function() {
		Abilities.Physical.CrushingStrike.Use(encounter, that, t);
	}, 3.0, function() { return Abilities.Physical.CrushingStrike.enabledCondition(encounter, that); });
	scenes.AddEnc(function() {
		Abilities.Physical.FocusStrike.Use(encounter, that, t);
	}, 2.0, function() { return Abilities.Physical.FocusStrike.enabledCondition(encounter, that); });
	/* TODO Taunt attack? (focus)
	scenes.AddEnc(function() {
		Abilities.Physical.TAttack.Use(encounter, that, t);
	}, 3.0, function() { return Abilities.Physical.TAttack.enabledCondition(encounter, that); });
	*/
	scenes.Get();
}


// CATBOY SCENES
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
		Text.Add("Wandering of the foothills of the Highlands for about an hour, you don’t find anything of note amongst the rocky ground and tall grasses. The air is crisp and the [day] upon you; although you’re starting to feel the rigors of the hard, uneven ground[f], there’s a certain quality to it that you nevertheless find quite refreshing and invigorating.", parse);
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
		if(player.FirstVag()) {
			options.push({nameStr : "Pity fuck",
				tooltip : Text.Parse("Take pity on the poor guy and let him have it.", parse),
				enabled : true,
				func : function() {
					Scenes.MaliceScouts.Catboy.PityFuck(enc, true);
				}
			});
		}
		/* TODO (fuck him)
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

Scenes.MaliceScouts.Catboy.PityFuck = function(enc, win) {
	var catboy = enc.catboy;
	var p1cock = player.BiggestCock();
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	Text.Clear();
	if(win) {
		Text.Add("Shit, this kitty-boy is so sad, you can’t even believe such a wretched little cumrag is possible. Several spirits of utter misfortune must have conspired to produce him, and even so…", parse);
		Text.NL();
		Text.Add("The catboy’s ears perk up at your words. <i>“Sad enough for pity sex?”</i>", parse);
		Text.NL();
		Text.Add("Well, technically it might be possible for someone to be so pathetic and hopeless that they go all the way around to be actually sexy, but unfortunately for him, he hasn’t quite gotten to that point yet - he’ll have to be a lot more of a loser before he even approaches that point. It’s like… like drinking so much coffee that your sobriety wraps about itself and you end up in whatever the opposite of drunk is.", parse);
		Text.NL();
		Text.Add("His ears flatten again. <i>“Oh.”</i>", parse);
		Text.NL();
		Text.Add("Come on, he has to try. You’re quite sure that he’s much, much worse, isn’t he? If he wants, he can start with the light stuff and work his way deeper. So, when was the last time he kissed a girl? He’ll have to get waaaay more pathetic to turn you on, that’s for sure.", parse);
		Text.NL();
		Text.Add("His brow furrows weakly. <i>“Um… I don’t remember…”</i>", parse);
		Text.NL();
		Text.Add("Does he not remember because he forgot when was the last time he locked lips, or is it because he’s actually never kissed anyone save for maybe his own mother?", parse);
		Text.NL();
		Text.Add("He flushes and looks away. <i>“All right, you got me. I’ve never kissed an actual girl before… and before you mention it, I’ve never kissed a guy, either.”</i>", parse);
		Text.NL();
		Text.Add("That’s better, although still pretty far off the mark. What else has he got to prove how much of a pathetic wimp he is?", parse);
		Text.NL();
		Text.Add("<i>“Hmm… let me think... “</i> He gasps all of a sudden. <i>“I know! I know! I secretly collect life-size cushions with erotic art on them! Things like nude catgirls in seductive and suggestive poses! I’ve given them all names… don’t tell the alchemist, though. He’d be mad.”</i>", parse);
		Text.NL();
		Text.Add("All right, that <i>is</i> pretty pathetic - just listening to that was enough to make your stomach turn and a creepy feeling crawl all over your body. He’ll have to do just a bit better, though…", parse);
		Text.NL();
		Text.Add("<i>“Hmm.”</i> He thinks a moment more. <i>“Well, there was that time when Meredith demanded that I finally learn to be a man, and so she went ahead and got me a night with one of the whores amongst the camp followers…”</i> he hesitates, coughs and whimpers.", parse);
		Text.NL();
		Text.Add("Yes? What happened?", parse);
		Text.NL();
		Text.Add("<i>“So she’d just gotten undressed, you see, and came over to do the same to me. She’d just gotten my pants down to about my knees when her fingers just brushed against my cock, and… and… I just came right there and then before anything even happened.”</i>", parse);
		Text.NL();
		Text.Add("Oh fuck, now that <i>is</i> wretched.", parse);
		Text.NL();
		Text.Add("<i>“She didn’t even bother to put her clothes back on, just ran out of the place to tell her sisters about what’d just happened, and they all started laughing, and more people came, which just meant they got to hear about it, and that drew more people…”</i> He bursts into a flood of tears that run down his cheeks. <i>“I’m such a useless piece of shit… I’m sure even Malice himself knows how much of a loser I am. He’d boot me straight out of camp or order me turned into a cocksleeve, only I’m too lowly and pathetic to even warrant his notice.”</i>", parse);
		Text.NL();
		Text.Add("Fine, fine, you’ve heard enough; he can come over. You want to see just how badly someone can fuck. Lying down on the ground, you beckon the catboy forward with a “come hither” finger, a predatory grin on your face.", parse);
	}
	else {
		Text.Add("Astonished, the catboy stares down at his furry paw-hands disbelievingly, clearly uncertain as to whether his victory was for real or just some figment of his imagination. He pinches his cheeks a few times, then his arm, and finally his tail before reluctantly admitting that yes, this is real and it is happening.", parse);
		Text.NL();
		Text.Add("Well? He beat you fair and square. Isn’t he going to finish what he started?", parse);
		Text.NL();
		Text.Add("<i>“Umm… I’m not sure what happens next. I didn’t think that far ahead.”</i>", parse);
		Text.NL();
		Text.Add("What?", parse);
		Text.NL();
		Text.Add("<i>“Err… I was told by my friend to go out there and be a man, you see… and if I didn’t become a man, I shouldn’t bother to head back, that this was the last straw and I was a total loser if I couldn’t even get this simple thing done. So…”</i> he hesitates a little more. <i>“I’m not sure what happens next. He just said to go and beat up some likely-looking traveler, and he stopped there.”</i>", parse);
		Text.NL();
		Text.Add("There’s a moment of uncomfortable silence as you digest this, and the catboy mage flicks his eyes this way and that.", parse);
		Text.NL();
		Text.Add("<i>“Hey, my magic was pretty good, wasn’t it?”</i>", parse);
		Text.NL();
		Text.Add("Seeing as how he’s the one still standing, you kinda have to agree with that.", parse);
		Text.NL();
		Text.Add("More silence.", parse);
		Text.NL();
		Text.Add("Look, does he even know what his friend <i>meant</i> by being a man?", parse);
		Text.NL();
		Text.Add("<i>“Um… I think I have some idea, but I’m not entirely sure on the details. Whenever I ask, everyone seems to get flustered and shy away from me, especially the girls.”</i>", parse);
		Text.NL();
		Text.Add("Gah. Sure, he may be a pathetic loser, but since you lost to him, what does that make <i>you</i>? Fine, fine; since you’ve stalled long enough for some strength to return to your limbs, guess you’ll just have to show this young feline friend exactly what it means to be a man. With any chance, you’ll also discover just how badly someone can fuck.", parse);
	}
	Text.NL();
	Text.Add("Hesitantly, the catboy closes the distance between you. Despite his usual spineless demeanor, you can see that he’s trying to be brave and resolute about it - too bad that “trying” simply isn’t going to be enough. After all, there is only do or do not, no “try”. The moment he kneels down within arm’s reach, you shoot out your hand and catch him by the collar of his shirt.", parse);
	Text.NL();
	Text.Add("<i>“Hey! What-”</i>", parse);
	Text.NL();
	Text.Add("You’re going to teach him to be a man; in short, you’re going to give him a pity fuck. Isn’t that what he wanted?", parse);
	Text.NL();
	Text.Add("<i>“Y-yes, but-”</i>", parse);
	Text.NL();
	Text.Add("Sure, it <i>is</i> a pity fuck and you’re going to make sure that you take every opportunity to remind him of that fact, but considering how pathetic he is, he should be thankful to just be able to get his dick wet.", parse);
	Text.NL();
	Text.Add("The catboy mewls and whimpers, holding his face in his hands with his large, fluffy ears pressed flat against his hair. Right, that seems to shut him up well enough; time to get to business. With a flourish, you rip down the waistband of his baggy pants, pulling it about his knees and revealing his junk and balls hanging free for all who want to take a gander.", parse);
	Text.NL();
	Text.Add("Hey, so he likes to go commando, does he?", parse);
	Text.NL();
	Text.Add("<i>“H-hey! What business of it is yours what I wear under my clothes?”</i>", parse);
	Text.NL();
	Text.Add("That’s nice; might that be the beginnings of a spine developing in him?", parse);
	Text.NL();
	Text.Add("The catboy does his best to remain resolute, but eventually breaks down under your withering gaze. You just smirk and study his tackle a little more closely; on such an effeminate guy, the catboy mage is surprisingly well-endowed. About nine inches of feline cock stands at attention before you, stiff and turgid in every sense of the word as it twitches in time with his heartbeat. This goes double for the soft cartilaginous barbs of pleasure interspersed along its length - teasing one of them elicits a plaintive, needy mewl from the catboy, and a small dribble of pre works its way out from the tip of his manhood. Truly hopeless; you’ve barely touched him and he’s already fit to bust.", parse);
	Text.NL();
	Text.Add("Come to think of it, what <i>would</i> happen if you did just that?", parse);
	Text.NL();
	Text.Add("<i>“W-what are you thinking?”</i>", parse);
	Text.NL();
	Text.Add("Oh, nothing much. You just need him to kneel atop you, straddle your chest for a bit.", parse);
	Text.NL();
	Text.Add("He clearly doesn’t like the idea and makes to shuffle away, but you sit up and grab him by one of his large ears, tugging until he mewls plaintively and complies, shedding his pants in the process.", parse);
	Text.NL();
	Text.Add("See? That wasn’t so bad. He’s going to have to get bigger balls if he wants to be an actual man instead of a cringing cat only fit for being a cocksleeve.", parse);
	Text.NL();
	Text.Add("<i>“Um, they’re already pretty heavy… it’s why I prefer to let them loose instead of packing them up like that, it gets really uncomfortable… I was once considering a potion to make them more manageable, but Meredith laughed and asked if I really wanted to be less of a man than I already was…”</i>", parse);
	Text.NL();
	Text.Add("All right, you meant that figuratively, and you did <i>not</i> need to know that snippet of information. The catboy mage is already pretty stiff, but rapidly becomes even more so when you take his maleness in hand; the pleasure-nubs rapidly swell from small pimple-like bumps into something actually approaching barbs. Grinning, you rub the soft spines one at a time, taking care to tease them between thumb and forefinger. There’s a moment of tension, a moment of electricity in the air, and then a huge dollop of pre plops out of the tip of his cock.", parse);
	Text.NL();
	Text.Add("Well, you can’t blame him for not having had experience. You’ll just have to get this over with before he just blows his load all over you. The catboy is quite light, and it doesn’t take much strength for you to shift him into a more proper position.", parse);
	Text.NL();
	Text.Add("Now, maybe you should start slowly. Considering how the catboy’s face is utterly flushed and - yep, he’s actually bleeding from his nose, just a thin trickle, but it’s there. He looks at you dumbfounded for a bit, then realizes why you’re staring at him and summons the willpower to daub at his face with a sleeve.", parse);
	Text.NL();
	Text.Add("Now, does he understand what missionary is?", parse);
	Text.NL();
	Text.Add("<i>“Kinda sorta.”</i>", parse);
	Text.NL();
	Text.Add("Kinda sorta?", parse);
	Text.NL();
	Text.Add("The blush intensifies, and you feel the feline cock against your skin strain at its physical confines, desperate with desire. <i>“Um, I’ve read books… so I’m pretty good on the theory, just not the practical aspect of things…”</i>", parse);
	Text.NL();
	Text.Add("Oh-kay…", parse);
	Text.NL();
	Text.Add("<i>“I mean, I’ve even memorized how to do the grand pincer movement!”</i> He brightens up a little. <i>“I’ve practiced a lot, just not with anyone…”</i>", parse);
	Text.NL();
	Text.Add("Then who or what… wait, you probably shouldn’t give too much thought to that. He’s already gone around from being so pathetic that he’s sexy; you don’t need him to come full circle and go back to being utterly pathetic again. Look, you’ve drawn this out long enough; he should just stuff it in you before he shoots himself in the foot again.", parse);
	Text.NL();
	Text.Add("<i>“Wha…?”</i>", parse);
	Text.NL();
	Text.Add("Just stuff it in already!", parse);
	Text.NL();
	
	Sex.Vaginal(catboy, player);
	player.FuckVag(player.FirstVag(), catboy.FirstCock(), 3);
	catboy.Fuck(catboy.FirstCock(), 3);
	
	Text.Add("The snappiness finally gets to him, and he rushes to obey, stuffing your [vag] full of cat cock. The petals of your womanly flower bump against each soft, nubby barb as he stretches you wide, sad green eyes going wide with a mixture of awe and instinctual desire as your inner walls pulse and flex against his manhood.", parse);
	Text.NL();
	Text.Add("<i>“Ah! I think - I think I’m going to-”</i>", parse);
	Text.NL();
	Text.Add("No, he’s not going to. He’s going to pack it in and hold on for as long as he can. If he dares to blow his load before you give him the go-ahead, he’s going to regret it.", parse);
	Text.NL();
	Text.Add("<i>“I… I’ll try…”</i> The way his voice is trembling and eyes are crossed doesn’t inspire great confidence in his abilities.", parse);
	Text.NL();
	Text.Add("Do or do not. There is no try.", parse);
	Text.NL();
	Text.Add("He just mewls piteously and continues thrusting. You have to admit, there’s at least some potential there; the way his barbs caress at your folds, the way his fingers grip at your waist. It’s not as if he’s ugly or not well-endowed; if only he could find it in himself to be more assertive, a little more forceful instead of cringing all the time which frankly is a huge turn-off.", parse);
	Text.NL();
	Text.Add("Well, he just needs to grow a spine, damn it. If he’s going to get any pleasure out of this, he’s going to have to <i>work</i> for it. Even as you’re thinking this, he stops his thrusting for a moment, fingers tightening as he prepares to-", parse);
	Text.NL();
	Text.Add("No! Bad!", parse);
	Text.NL();
	Text.Add("The catboy’s body tenses again and he manages to fight back the rising tide, but by the looks of it, he won’t be able to hold the line much longer. One supposes it’s a miracle that he’s already lasted this long… but you’re going to push him to his limits.", parse);
	Text.NL();
	Text.Add("In and out. In and out. If there were a textbook example of a pity fuck, well, this is it. The catboy looks as if he’s enjoying himself, inasmuch as one can enjoy himself while being utterly terrified. You would liked to have enjoyed yourself a little more, but them’s the breaks, as they say.", parse);
	Text.NL();
	Text.Add("Unfortunately for the poor catboy, he can’t take it anymore. The entirety of his lithe frame shakes and shudders as he blows his load into you with a resounding yowl, balls visibly deflating in the process. With how much there is, the spunk quickly fills up your cunt, then forces its way into your womb. Squelching noises rise from your hips as the catboy’s body runs on automatic, pounding away with an intensity that’s most uncharacteristic of his lithe body.", parse);
	Text.NL();
	
	Scenes.MaliceScouts.Catboy.Impregnate(player, catboy);
	
	Text.Add("<i>“Ah! Ah! Ah!”</i> He’s still going at it - even though the stream of seed has slowed, it’s a good minute or so before he finally finishes up, his body sagging with exhaustion. It certainly looks like he’s put everything he had into it; sweat sheens on his brow and drips down his body. Eventually, though, even he has to give up and withdraws from you with a wet, sucking sound.", parse);
	Text.NL();
	Text.Add("Well, he’s a man now. How does that make him feel?", parse);
	Text.NL();
	Text.Add("The catboy winces and rubs his temples; his ears twitch this way and that. <i>“A little dizzy.”</i>", parse);
	Text.NL();
	Text.Add("Aah, that happens sometimes. It’ll pass soon enough.", parse);
	Text.NL();
	Text.Add("<i>“Um, well.”</i> He looks down at his now-deflating cock, at the dribble of spunk oozing out from your [vag], and then at you. <i>“Thanks.”</i>", parse);
	Text.NL();
	Text.Add("He shouldn’t get used to this. Not everyone is going to be as nice as you are.", parse);
	Text.NL();
	Text.Add("<i>“Oh, don’t I know that.”</i> He mutters to himself.", parse);
	Text.NL();
	Text.Add("It would really help if he stood up for himself more… can he do that for you? He doesn’t need to start kicking asses and taking names all at once, but maybe he should start watching out for himself instead of letting others push him about all the time. He’d be a lot more sexy then, you can assure him of that.", parse);
	Text.NL();
	Text.Add("He perks up. <i>“I’ll do my best!”</i>", parse);
	Text.NL();
	Text.Add("Right, right. Now if he doesn’t mind, he needs to get lost for a bit?", parse);
	Text.NL();
	Text.Add("<i>“Um… not immediately!”</i>", parse);
	Text.NL();
	Text.Add("An admirable attempt, but he needs to be more forceful about it.", parse);
	Text.NL();
	Text.Add("<i>“No!”</i>", parse);
	Text.NL();
	Text.Add("<b>Much</b> better.", parse);
	Text.NL();
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	Text.Add("Business taken care of, the two of you part ways, and you[c] continue on your journey.", parse);
	Text.Flush();
	
	player.subDom.IncreaseStat(50, 1);
	
	Gui.NextPrompt();
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
	Text.Add("Well, there’s no reason you shouldn’t let that all out. Pausing your scritching for a moment, you reach for the catboy’s pants with a hand and yank them down hard to his knees, revealing a thick and throbbing cat-cock complete with spines along its length. It’s not <i>huge</i>, but is nevertheless large enough to look out of place on the catboy mage’s slight, effeminate frame. Thick, pulsating veins wrap about its surface, joining one feline barb to another - just as your thumb brushes against the catboy’s delicate ear-tufts, he shudders from head to toe and looses a small squirt of pre from the tip of his maleness.", parse);
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
		
		scenes.AddEnc(function() {
			Scenes.MaliceScouts.Catboy.PityFuck(enc, false);
			return true;
		}, 1.0, function() { return player.FirstVag() && player.Femininity() > 0.3; });
		scenes.AddEnc(function() {
			Scenes.MaliceScouts.Catboy.GetMilked(enc);
			return true;
		}, 1.0, function() { return player.Lactation(); });
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

Scenes.MaliceScouts.Catboy.GetMilked = function(enc) {
	var catboy = enc.catboy;
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	Text.Clear();
	Text.Add("While the catboy is thinking, he suddenly stops and sniffs at the air. Once, twice, and then he closes his eyes to better concentrate on the source of whatever he’s sensed. Slowly, he turns his head to follow it, stoops down a little, and then his eyelids flick open again.", parse);
	Text.NL();
	Text.Add("Oh. The exertion of the battle <i>has</i> squished your [breasts] about a bit, causing them to leak into your [armor], creating two damp blotches, wet and still spreading. A gentle, sweet smell rises from your chest, and it’s this that the adorable little kitty cat has traced back to its origins, his small, pink tongue running over his lips as the full realization of what he’s seeing hits home.", parse);
	Text.NL();
	Text.Add("<i>“Whoa, you’ve got milk!”</i> The catboy mage’s eyes practically bulge at the sight of your leaky, milk-laden [breasts], and he makes a pathetic little sound in the back of his throat. <i>“Hnnnn… I’ve got to have a sip… but then, I’m supposed to be out here learning to be a man... “</i>", parse);
	Text.NL();
	Text.Add("You’d have shaken your head in disbelief at the sight of a full-grown man literally drooling over the thought of breast milk, but calling this guy a man is probably stretching it.", parse);
	Text.NL();
	Text.Add("<i>“<b>Hnnnnnn!!!</b> I’ve been dying for some now, never managed to get any since Malice waded in and started bossing people around…”</i>", parse);
	Text.NL();
	Text.Add("By now, he’s sweating bullets and biting his nails as his tail thrashes madly behind him. Somehow, you get the idea that this desperate craving in response to the mere idea of warm milk isn’t a completely voluntary thing.", parse);
	Text.NL();
	Text.Add("Screw it. It’s better than getting raped by a complete loser, and you do eerily get the impression that you’ll regret it if you insist on refusing the catboy his milk. Beckoning to the mage with an outstretched finger, you make sure his full attention is on your rack, then pull off your [armor]. Almost as if anticipation what you’re about to do, your [nips] seem bigger, fuller and darker than usual; the catboy himself is just trembling from head to toe and chewing his lips furiously as sweat beads on his brow.", parse);
	Text.NL();
	Text.Add("It would be comical if it weren’t so utterly pathetic.", parse);
	Text.NL();
	Text.Add("At last, the inevitable happens; the catboy’s entire body coils like a large spring, and he pounces forward to land on you with a soft thump and a ruffle of loose fabric. Wasting no time, the effeminate feline happily opens his mouth in an “O” and throws himself forward, latching onto your breast with surprising ferocity and sucking for all he’s worth.", parse);
	Text.NL();
	Text.Add("Pleasant tingles run through the lady lump in question, spreading out into the rest of your chest as his warm lips begin applying pressure to get your milk flowing; it’s clear he’s no stranger to this. Try as you might, you can’t help but grin and take the chance to run your fingers through his white hair and large, fluffy ears; he purrs gloriously, eyes closing in pure bliss as you tuck him against your breast while he nurses.", parse);
	Text.NL();
	var lactation = player.LactHandler().Rate();
	if(lactation <= 1) {
		Text.Add("Continuing to mewl to himself, the catboy suckles harder and harder until your feel your milk let down in a flush of warmth from the base of your breast; a pleasant trickle of your milky goodness runs from your nipple into his mouth. Although there’s not that much to be had, his rough, sandpapery tongue rubs against your [nip] until you’re a moaning wreck, coaxing every last drop of nourishing cream that you’ve to spare.", parse);
		Text.NL();
		Text.Add("It’s not long before the first tap runs dry, and the kitty cat of a mage moves onto the next, repeating the process with gusto. All cross-eyed and dreamy, the poor guy looks like he’s having the time of his life draining you dry; you just don’t have the heart to stop him even if you had the mind to do so.", parse);
	}
	else if(lactation <= 3) {
		Text.Add("The catboy pulls hard on your nipple, but it’s unnecessary considering how eager your milk is to let down. It flows and gushes into the catboy’s mouth, leaving you feeling wonderfully maternal as a warm stream joins the base of your breast to your [nip], leaving you gasping in delight to mirror the catboy’s bliss. Ah, this is the life…", parse);
		Text.NL();
		Text.Add("With how ferocious the catboy is, it’s not long before you’re down and out despite the considerable reserves you’d started with. Not enough for the catboy mage, though - fighting you seems to have worked up an appetite in him, and he goes straight for your other nipple, attacking it with an increasingly maddened ferocity as you feel your milk let down again.", parse);
		Text.NL();
		Text.Add("You have to wonder at his desperate love of milk - sure, he’s a cat, but even so he’s fitting the stereotype a bit <i>too</i> comfortably… oh well, it does take all sorts to make a world. The suckling goes on nearly as long as it did with the first, until he finally finishes and pulls away with a pop. Your [breasts] do feel much lighter now, and he continues eyeing you hungrily even as his stomach gurgles from all the cream he’s taken from you.", parse);
	}
	else {
		Text.Add("The catboy suckles hard momentarily, and winds up sputtering at the flood of milk that jets out of your nipple in response. Backed up for goodness knows how long, your lady lumps revel as much as your feline friend in their long-awaited release. Breast milk gushes over his face, wetting his hair and fur, and he can only look on with ravenous pleasure at what he's started.", parse);
		Text.NL();
		Text.Add("Wasting no time, the catboy leans forward and latches back on, his throat swallowing visibly and often as he gulps away, struggling to keep up with your production as you let down in earnest, a torrent of warmth joining the base of your breast to the nipple.  His arms worm their way around your back and lock together in an effort to hold onto you even as your milk squirts out from the corners of his mouth with glorious gusto, forcing himself to either drink or drown in your engulfing flow.", parse);
		Text.NL();
		Text.Add("Lost in all the milk he could ever need or want, the catboy mage purrs away blissfully as he dutifully nurses, somehow managing to keep up with your production. His stomach gurgles noisily as if begins to swell with your cream, but he doesn’t care one bit.", parse);
		Text.NL();
		Text.Add("Gee, this cat sure does like his cream, doesn’t he?", parse);
		Text.NL();
		Text.Add("The suckling goes on and on, until your milk slows to a reasonable trickle.  Content to have drained one milk spout, the catboy mage detaches himself with a wet pop, smacking his lips before moving on to the next milk tank on your chest. His hunger hasn’t diminished any as he applies the same vigorous ministrations as he did with your first breast, gleefully massaging the firm titflesh with his lips and sending pleasant vibrations racing through you with each deepthroated purr he makes.", parse);
		Text.NL();
		Text.Add("Ah… despite your knowledge that the catboy is supposed to be, well, your rapist, it’s an uphill battle to not just lie back, close your eyes, and revel in the ungodly sensations of having your milky burden relieved in the best possible way.", parse);
	}
	player.MilkDrain(30);
	Text.NL();
	Text.Add("Eventually, though, you’ve been absolutely drained, ", parse);
	if(lactation > 3) {
		Text.Add("your breasts having deflated by a good two or three cup sizes in the process. This change is only temporary, though - you can feel your milk makers revving up their production once more, a gushing sensation filling your chest as they do their best to ensure that your tits are always full, turgid and deliciously milky.", parse);
		Text.NL();
		Text.Add("On his part, the catboy looks absolutely ecstatic, if not exactly sated. His milk-swollen tummy wobbles dangerously with each movement he makes, and he can’t stop purring to himself with each breath he draws.", parse);
	}
	else if(lactation > 1) {
		Text.Add("your breasts having shrunk half or perhaps even a whole cup size now that they’ve been emptied. Not for long, though - you can feel a sensation of churning warmth in your chest as your [breasts] hurry to replace what you’ve lost to the catboy. Bit by bit, they start to grow fat and full again - it’ll be a little while before they’re back at full capacity, but the feeling in the meantime is just wondrous.", parse);
	}
	else {
		Text.Add("an overwhelming sensation of relief washing over you as the nursing comes to an end.", parse);
	}
	Text.Add(" On his part, the catboy looks up at you and licks his milky lips; there’s a bit of cream left on your [breasts] and he laps that right up, his little pink tongue flicking in and out of his mouth like a kitten lapping from a saucer.", parse);
	Text.NL();
	Text.Add("There’s a good kitty, you murmur as you give the catboy a weak scratch between his large, snow-white ears. There’s a very good, and very hungry kitty indeed.", parse);
	Text.NL();
	Text.Add("He purrs and swipes his tail at you. It tickles.", parse);
	Text.NL();
	Text.Add("Aww, that’s so cute. Like it or not, though, you’re getting quite sleepy - first from being beaten up like that, then having your nourishment drained from you. The gentle scraping of the catboy’s tongue against your increasingly sensitive titflesh and nipples is heavenly, and it’s a little hard to think straight…", parse);
	Text.NL();
	Text.Add("You wake up a little while later on the windy hilltop, the magical bindings having long since evaporated from your limbs. There’s no sign of the catboy mage, but your exposed and drained lady lumps are proof enough that he wasn’t just a figment of your imagination.", parse);
	Text.NL();
	Text.Add("Well… that could have been worse. For example, the catboy could have remembered that he was out here to “become a man”, whatever that meant - with how pathetic-looking he was, though, you probably don’t want word to get out that you lost to him. Picking yourself off the ground, you get your [armor] in shape and prepare to be on your way.", parse);
	Text.Flush();
	
	player.AddLustFraction(0.2);
	player.AddSexExp(1);
	
	Gui.NextPrompt();
}











Scenes.MaliceScouts.Mare.LoneEncounter = function(levelbonus) {
	var enemy    = new Party();
 	var mare     = new CentaurMare(levelbonus);
	enemy.AddMember(mare);
	var enc      = new Encounter(enemy);
	enc.mare     = mare;
	
	enc.onEncounter = function() {
		var parse = {
			
		};
		parse = player.ParserTags(parse);

		Text.Clear();
		parse["oneself"] = player.HasLegs() ? "one’s feet" : "oneself";
		Text.Add("This part of the Highlands that you’re currently exploring is more well-traveled than most. Enough, at least, for a proper mountain trail to have materialized amongst the hills and valleys; it twists and winds its way amongst the highland downs, rarely making a straight line between two points, but the extra distance is worth not having to cut [oneself] on the rocky trails and plateaus.", parse);
		Text.NL();
		Text.Add("There’s no sign of who maintains these roads - if anything, it looks like they’ve been made by many, many feet and wheels simply trampling out the path until the grass won’t grow there anymore.", parse);
		Text.NL();
		Text.Add("All of a sudden, your attention is drawn by the sounds of hooves clopping on the road’s hard surface. At first, you think it’s someone on horseback, but as the figure draws closer you realize that your initial assessment was close, but not quite on the mark. It’s a centaur mare, her human half slightly tanned with her equine half a shiny chestnut brown, her long black hair pulled back in a tightly-knotted braid. A quite literal breastplate - it has to be so, to accommodate her generous mammaries - shields her front half; perhaps it was magnificent once, but time and use have worn away the swirly engravings and taken away any shine it might have once had, leaving it slightly dented but functional. Behind that, barding clearly intended for a warhorse, but the thin, overlapping plates of steel have been refitted to suit a centaur better.", parse);
		Text.NL();
		Text.Add("In her hand, a long, sharp spear; on the other arm, a buckler of leather and hardened wood. There’s some slight muscle definition to her human portion that speaks of training and experience, but not quite enough to be considered bulk.", parse);
		Text.NL();
		Text.Add("Slowly, the centaur mare canters up to you and stops in the middle of the road, blocking your advance. <i>“Halt, traveler.”</i>", parse);
		Text.NL();
		Text.Add("Okay, okay, you’ve stopped. What does she want? This isn’t a hold-up or anything along those lines, is it?", parse);
		Text.NL();
		Text.Add("She scowls. You note that her spear is shaking slightly, her eyes a little wider than you’d expect, her breathing a little too deep. And not to mention, there’s an odd scent in the air that you can’t quite put words to…", parse);
		Text.NL();
		Text.Add("<i>“No,”</i> she replies, then scowls. <i>“I need a fuck.”</i>", parse);
		Text.NL();
		Text.Add("Um, come again? She needs a <i>what</i>?", parse);
		Text.NL();
		Text.Add("<i>“I said, I need a fuck. I don’t care how I get it, I just need a good fucking, and you’re the only outsider I’ve seen all day.”</i> The centaur mare lowers her spear at you such that its head is level with your chest. <i>“Now, I don’t want to have to fight you, but I will if I have to. I’m going to ask once, and once only - I’m fucking desperate, and what with my poor body meaning not being able to reach my own pussy means I’ve to turn to others. So, are you going to get me off out of your own free will, or am I going to have to make you do it for me?”</i>", parse);
		Text.NL();
		Text.Add("Right. Um…", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = [];
		options.push({nameStr : "Yes",
			tooltip : Text.Parse("Oh, why not? She’s clearly in a bad spot.", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("The mare visibly sags in relief, her shoulders slumping as she puts away her weapon. <i>“Thanks for being reasonable,”</i> she mumbles, her body now quaking ever so slightly with repressed need. <i>“Shit, just thinking about it is already getting me all wet - not that I don’t like this body of mine, but some days it just wants to do something at the most inconvenient times, if you get what I mean.”</i>", parse);
				Text.NL();
				Text.Add("Oh, you understand perfectly.", parse);
				Text.NL();
				Text.Add("<i>“Let’s find a spot off the road for this, then. Hope you’re not too alarmed by my tastes…”</i>", parse);
				Text.NL();
				Text.Add("Without any warning, the centaur mare charges at you, catching you by surprise and sending you sprawling to the ground dazed. She looms over you, spear in hand, then drops her weapon onto the grass and smiles down at you.", parse);
				Text.NL();
				Text.Add("<i>“Phew, sorry about that; hope I didn’t hurt you too badly. Just had to get that out of my system before we began fucking like a bunch of fucking animals.”</i> She pauses a moment and draws a deep breath, panting away - whether from heat or exertion is anyone’s guess. <i>“Damn it, it’s already getting to my vocabulary. Let’s just hurry up and scratch this itch of mine before it gets very much worse.”</i>", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					world.TimeStep({hour: 1});
					Text.Clear();
					Scenes.MaliceScouts.Mare.LossEntry(enc);
				});
			}
		});
		options.push({nameStr : "No",
			tooltip : Text.Parse("No thanks, you’re just not feeling up to it today.", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("You do your best to explain to the centaur mare that you’re really not interested in the offer she’s soliciting for, but she won’t have any of it.", parse);
				Text.NL();
				Text.Add("<i>“See?”</i> she rails, waving her buckler at the heavens. <i>“You ask them nicely, maybe even say ‘please’ and ‘thank you’, and it’s not as if there’s any meaningful difference in the end anyway! You want to do it the hard way, lowlander? I’ll give you the hard way, then! Mmm… hard… fuck, not right now!”</i>", parse);
				Text.NL();
				Text.Add("Her expression turns steely, and you barely have enough time to throw yourself aside as she levels her spear at you and charges!", parse);
				Text.NL();
				Text.Add("<b>It’s a fight!</b>", parse);
				Text.Flush();
				
				// Start combat
				Gui.NextPrompt(function() {
					enc.PrepCombat();
				});
			}
		});
		Gui.SetButtonsFromList(options, false, null);
	};
	
	/*
	enc.canRun = false;
	enc.VictoryCondition = ...
	*/
	enc.onLoss    = Scenes.MaliceScouts.Mare.LossPrompt;
	enc.onVictory = Scenes.MaliceScouts.Mare.WinPrompt;
	
	return enc;
}

Scenes.MaliceScouts.Mare.WinPrompt = function() {
	var enc  = this;
	SetGameState(GameState.Event);
	
	var parse = {
		
	};
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Unable to keep on fighting any longer, the centaur mare sinks to her knees - all four of them - and makes little urgent noises in the back of her throat. Despite being soundly beaten, it looks like her desperate need hasn’t diminished any from the combat. Letting her spear and shield fall to the grassy ground with soft thuds, the centaur wiggles her rump, and when you half-circle around her to investigate you can see a dark streak of wetness running down her hind legs as her flanks heave.", parse);
		Text.NL();
		Text.Add("<i>“Well,”</i> she mumbles. <i>“You’ve gone and beaten me, lowlander. Why don’t you go ahead and humiliate me further by just walking away? Just walk away, and leave me to wallow in my...”</i>", parse);
		Text.NL();
		Text.Add("The centaur mare’s words cut off, but she continues grumbling under her breath, crossing her arms under the bulges on her breastplate. What will you do now?", parse);
		Text.Flush();
		
		//[Walk away][Fuck][Fist]
		var options = [];
		
		if(player.FirstCock()) {
			var p1cock = player.BiggestCock();
			options.push({nameStr : "Fuck",
				tooltip : Text.Parse("Give her what she wants - but on your terms.", parse),
				enabled : function() { return player.HasLegs() && p1cock.Len() >= 25; }, //Gotta have legs and a 10" cock
				func : function() {
					Scenes.MaliceScouts.Mare.WinFuck(enc);
				}
			});
		}
		options.push({nameStr : "Fist",
			tooltip : Text.Parse("Literally pound the mare’s pussy.", parse),
			enabled : true,
			func : function() {
				Scenes.MaliceScouts.Mare.WinFist(enc);
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
			Text.Add("Yeah. Either horses aren’t quite your style, or you’re just not feeling up to it today. Either way, since she was so kind to point it out to you, you’re going to do just that - humiliate her by just walking away after having soundly thrashed the stuffing out of her.", parse);
			Text.NL();
			Text.Add("As you turn to leave, she blinks in surprise and calls out to you. <i>“Wait, what are you doing?”</i>", parse);
			Text.NL();
			Text.Add("Why, you’re just leaving like she told you to.", parse);
			Text.NL();
			Text.Add("<i>“No! You’re not supposed to actually <b>listen</b> to what I just said, you’re supposed to do the opposite of -”</i> the mare blurts out, then rubs her temples and heaves a huge sigh. <i>“Fucking reverse psychology.”</i>", parse);
			Text.NL();
			Text.Add("Okay, then! You’re going to do the opposite of what she just said and do the opposite of the opposite, which is just… well, would you know it, just walking away and leaving her in the dust. Bye!", parse);
			Text.NL();
			Text.Add("The centaur mare glares at you with all the viciousness of a cauldron fit to bubble over, but doesn’t have the strength to follow up on the desire writ large on her face. You give her a cheery smile and wave, then skip on down the road, leaving her in the dust.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		});
	});
	Encounter.prototype.onVictory.call(enc);
}

Scenes.MaliceScouts.Mare.WinFuck = function(enc) {
	var mare   = enc.mare;
	var p1cock = player.BiggestCock();
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("Aww, she just wants some desperate relief. Really, getting a standing dildo of some sort would be far more efficient than waylaying travelers on the road and asking for a fuck. Or even just asking nicely instead of demanding it… catch more flies with honey than vinegar and all that. Did that ever occur to her?", parse);
	Text.NL();
	Text.Add("The centaur mare mumbles something under her breath, then replies. <i>“It is the proud ethos of my people that -”</i>", parse);
	Text.NL();
	Text.Add("Okay, okay, you get the idea just where this is going. Let’s just get this over with. Circling around to the centaur’s hindquarters, you take your own sweet time studying her butt, making sure she feels your gaze on her rump before you whip out your fingers and shamelessly grab that sexy rear of hers.", parse);
	Text.NL();
	Text.Add("Of course, touching isn’t enough - far from it - and you make sure to dig in as far as you can, past the thin layer of fat and into the solid, athletic muscle of her butt, clenching and squeezing with your digits fingers before moving onto the other half and repeating the same process. The centaur’s body shudders, her flanks heaving even more than before, and she desperately cranes her neck in a bid to try and look at just what you’re doing.", parse);
	Text.NL();
	Text.Add("And you’ve barely even gotten started here.", parse);
	Text.NL();
	Text.Add("<i>“Didn’t you want to get this over with?”</i>", parse);
	Text.NL();
	Text.Add("Yes, but proper procedures must be followed, mustn’t they? You’ve got to inspect any and all horseflesh before settling on a decision.", parse);
	Text.NL();
	Text.Add("The centaur mare swallows hard and turns her gaze forward. All the better for you, then - grabbing hold of one butt cheek in each hand, you force them apart, revealing the centaur’s equine cunt. Like the dark streaks down her legs suggest, it winks and drips at you, making her heated need all the more evident to you.", parse);
	Text.NL();
	Text.Add("Geez. And there are <i>no</i> centaur men in camp who wouldn’t happily service her?", parse);
	Text.NL();
	Text.Add("<i>“Not that I haven’t pestered over and over again already,”</i> comes the very grumpy reply. <i>“Do you think I do this out of boredom?”</i>", parse);
	Text.NL();
	Text.Add("Hrrmph. ", parse);
	if(player.IsTaur()) {
		Text.Add("Well, it looks like all the goods check out. Time to get down to business, then - you take a moment to take aim, then rear up and get mounted on the mare. She lets out a sharp breath as your weight descends upon her - not a surprise, since you did just beat the stuffing out of her - but her body is sturdy with a strong constitution, and before long you’ve got yourself all nicely mounted up atop her.", parse);
		Text.NL();
		if(p1cock.Len() >= 38) {
			Text.Add("Even for someone of equine proportions, your tackle is a force to be reckoned with", parse);
			if(p1cock.race.isRace(Race.Horse))
				Text.Add(", especially since it’s appropriately shaped for the task at hand", parse);
			Text.Add(". The mare’s walls clench needily about your member as it slides deeper and deeper into her, no doubt sending palpable waves of satisfaction and satiation as you fill her insides with rock-hard cock. She’s so well-lubed up from her own juices that you have scarcely any problem plunging into her nethers until you’re hilted well and deep, man-meat firmly wrapped up in mare-meat.", parse);
			Text.NL();
			
			Sex.Vaginal(player, mare);
			mare.FuckVag(mare.FirstVag(), p1cock, 4);
			player.Fuck(p1cock, 4);
			
			Text.Add("<i>“Shit,”</i> she murmurs, then heaves a trembling sigh at finally having something huge enough to fully stuff that deep, juicy cunt of hers. <i>“Now that’s something. Finally, someone who can actually fill me.”</i>", parse);
			Text.NL();
			Text.Add("Why, you only seek to please.", parse);
			Text.NL();
			Text.Add("The centaur mare simply snorts at that, but she doesn’t say anything more. Very well, then - you grin and concentrate on proving that you’re more than a worthwhile fuck for what her sensibilities must be demanding of her.", parse);
		}
		else {
			Text.Add("Grinning, you take a few moments to tease her pussy lips with your [cockTip], causing a burst of clear girl-cum to erupt from her equine pussy. Yeah, it looks like you won’t be needing any additional lube for this one.", parse);
			Text.NL();
			Text.Add("<i>“Just hurry up and put it inside me already, you bastard!”</i>", parse);
			Text.NL();
			Text.Add("Bah, she’s in no position to make demands, you’ll take your time if you please. The mare just bucks up against you, trying to take you into her; she manages to grind against your [cockTip] a few times, but you keep your distance and she only manages to ramp up her already considerable arousal and anticipation by no small amount.", parse);
			Text.NL();
			Text.Add("At last, when you’re sure that your [cock] is as stiff and large as it’ll ever be - thanks in no small part to the desperate scent of sex wafting up from the mare’s sweaty body - you lean forward and slide your shaft into the centaur’s oozing cunt. It eagerly devours your man-meat with a wet slurping sound, and you’re in.", parse);
			Text.NL();
			
			Sex.Vaginal(player, mare);
			mare.FuckVag(mare.FirstVag(), p1cock, 4);
			player.Fuck(p1cock, 4);
			
			Text.Add("<i>“Ffff-”</i>the centaur mare looks fit to bust even as her inner walls try to grasp at your tackle, which you unfortunately have to admit is at least a little too small for the cavernous tunnel which she possesses. <i>“Shit, you’ve got so much body - would it really kill you to find a potion or something and make yourself, I don’t know, more proportional?”</i>", parse);
			Text.NL();
			Text.Add("Hey, a small dick is better than no dick. Or is she going to look a gift horse in the mouth?", parse);
			Text.NL();
			Text.Add("There’s more grumbling, but you cut it short with a quick thrust of your shaft, turning it into a moan.", parse);
		}
		Text.NL();
		Text.Add("At the same time, you run your hands up the centaur’s human torso, up from her belly and up to her breastplate, tugging at the leather straps that hold it in place. She eagerly aids you in that endeavor, and before long both halves of armor clatter on the ground, giving you clean access to her plump, oh-so-human breasts.", parse);
		Text.NL();
		Text.Add("Mm - her nipples and areolae are dark and lovely, enough to provide sharp contrast against even her tanned skin. Rock-hard, they protrude proudly from her lady lumps, which themselves are swollen and tender from arousal. Yes, they’re definitely bigger since you’ve mounted her - not very much so, but still enough for the difference to be perceptible.", parse);
		Text.NL();
		Text.Add("Taking each plump nipple between thumb and forefinger, you tease them in tandem, the centaur mare’s inner walls quivering and sliding against your shaft with each back-and-forth motion. Instinctively, she arches her back to push her breasts into your hands, clearly wanting more; seeing no reason to deny her, you start clenching and squeezing all the breastflesh your hands can gather. It’s not milking her - she’s not producing any milk to drain - but it sure is coming close. From the growing heat in the centaur mare’s chest, it’s clear that she is more than happy to receive such attentions, and she half-turns to look back at you with a softer gaze this time, biting her lip furiously.", parse);
		Text.NL();
		Text.Add("Time to seize the moment, then. You nuzzle and kiss at her neck briefly before your arousal builds to the point that you're just grunting and panting in her ear; she's certainly enjoying being mounted and stuffed as much as you are in doing the stuffing.  With her deep cunt squeezing and gripping around as much of your manhood as it can get, you're both quite content to focus on fucking.", parse);
		Text.NL();
		Text.Add("With such stimulation, it doesn’t take long before you feel your seed well up ", parse);
		if(player.HasBalls())
			Text.Add("and your balls churn ominously ", parse);
		Text.Add("as your body prepares for release. Still, it’s not as if you can do anything but the inevitable at this point - you can only close your eyes and grasp tightly at your tauric lover’s torso as orgasm descends upon you.", parse);
		Text.NL();
		Text.Add("Sensing the first signs that you’re about to blow, the centaur mare’s body reacts just as quickly, driving her mind over the edge with a loud whinny of delight that echoes about the hilly countryside. Her body tenses in preparation to receive your load, and so you dump it all into her in a wonderfully glorious fashion. Her cunt squeezes about your shaft, desperately milking you for all you’re worth, but it’s not as if you need any extra encouragement to do your best.", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		
		if(cum >= 8) {
			Text.Add("You’re not exactly sure how long you spend unloading your seed into the centaur mare, but you know what they say - time flies when you’re having fun. As the first rush of spunk floods the mare’s tunnel, she gasps orgasmically and writhes in your grasp, thrown into ecstasy by the sheer sensation of being filled with baby batter like this.", parse);
			Text.NL();
			Text.Add("With such a high volume that’s pouring out of your [cock]", parse);
			if(p1cock.Knot())
				Text.Add(" and a knot to keep it in to boot", parse);
			Text.Add(", the poor centaur’s womb doesn’t stand a chance. Her cunt fills with spunk almost immediately, the sheer pressure of being stuffed so deeply forcing her cervix apart to admit torrents upon torrents of your seed into her freshly heated oven.", parse);
			Text.NL();
			Text.Add("No way you’re stopping now! The centaur mare gasps in alarm as her belly begins to bloat and distend downwards as you continue to cum, but you grip her tightly and comfortingly, the closeness of your tauric body to her own seeming to impart some measure of comfort to her as her underbelly inflates to obscene proportions with your sperm.", parse);
			Text.NL();
			Text.Add("With so much spunk expended, you’d be surprised if you haven’t already seeded a foal or two on her baby bag. Maybe three, if luck is on your side, but hey, that’d certainly put her out of commission for a while now.", parse);
			Text.NL();
			Text.Add("When you’re done, the centaur mare is so swollen that her equine underbelly is almost touching the ground. She quavers a moment, then heaves a huge sigh of relief.", parse);
			Text.NL();
			Text.Add("<i>“Fuuuuuck. Now <b>that</b> was what I needed. See? If you were going to do that, then you didn’t need to beat me up in the first place.”</i>", parse);
			Text.NL();
			Text.Add("Yeah, you can definitely agree with her. Question, though - now, how is she going to be getting back to her camp, her tribe, or wherever she lives?", parse);
			Text.NL();
			Text.Add("<i>“Heh. I wasn’t expecting to get back for some time anyway. Maybe…”</i> she breathes a deep sigh and adjusts herself to better bear your weight. <i>“Bah, I won’t be missed for a while anyway. This was most definitely worth it - I don’t think I’ll be feeling so fucking needy for a while now.”</i>", parse);
		}
		else if(cum >= 5) {
			Text.Add("You spend a fairly long while giving the mare a good taste of your wild oats. Of course, it doesn’t <i>seem</i> that long, but as they say - time flies when you’re having fun. At the first rush of spunk into her, the centaur mare gasps and closes her eyes, relief clearly washing over her entire form as she instinctively moves to accept your seed.", parse);
			Text.NL();
			Text.Add("<i>“Fuuuuck,”</i> the mare groans, pushing her massive hips against you in a bid to ensure that as much of you as she can take is in her. <i>“Fuuuuuuuck.”</i>", parse);
			Text.NL();
			Text.Add("Yes, yes, that’s what you’re doing to her right now.", parse);
			Text.NL();
			Text.Add("She moans again and rolls her hindquarters some more, little nickers coming from her mouth amidst flutters of breath. Uncertainly, the centaur mare summons up enough presence of mind to glance back at you, and you notice that her face is a delightful shade of hearty red.", parse);
			Text.NL();
			Text.Add("More and more spunk courses through your [cock] and fills her cunt", parse);
			if(p1cock.Knot())
				Text.Add(" held firmly in place by your bloated, swollen knot such that there’s no chance of any going to waste", parse);
			Text.Add(". Slowly but gradually, the centaur mare’s underbelly begins to grow round and heavy, stretching with the load you’re forcing into her womb. You see her bite her lip a little uncertainly at the queer sensations of being filled this way, but a hearty grope to her firm breasts is enough to take her mind off such trivialities and back to the business of fucking.", parse);
			Text.NL();
			Text.Add("Faster and faster the both of you move, riding out the crest of your high, until she herself reaches hers just as yours is starting to die down. With a savage push against you, the centaur mare stamps at the ground and screams into the cool highland air, her fists clenched into tight, white-knuckled balls. Those deep inner walls pulse and shift against your shaft, coaxing it into the depths of her warm, slippery embrace.", parse);
			Text.NL();
			Text.Add("At last, though, the bliss finally begins to die down, leaving the two of you panting. The centaur mare shifts her weight a little, clearly unused to the load of sperm she’s now carrying inside her - large enough to look as if there’s already a lovely little foal growing inside her.", parse);
			Text.NL();
			Text.Add("<i>“Huh,”</i> she huffs, sweat running down her flanks and torso. <i>“Well, that’s going to be one hell of a weight to carry back to camp.”</i>", parse);
			Text.NL();
			Text.Add("And that’s one hell of a weight you won’t be lugging around with you.", parse);
			Text.NL();
			Text.Add("<i>“Well then, it’s a good thing that I won’t be expected around camp for a bit just yet,”</i> she replies with a number of heavy sighs. <i>“That, and with any luck it’ll be a good long while before I’m itching for a fuck again.”</i>", parse);
		}
		else {
			Text.Add("You grit your teeth and close your eyes as you pound the centaur mare again and again, giving her equine half a good taste of the wild oats you have on offer. Rope after rope of thick, hot cum passes from your [cock] into her waiting pussy, which flexes and clenches as it slurps it up greedily. Maybe there’s not as much as you might have hoped there would be, but there’s far more than enough to put a foal into her baby bag if it came to that.", parse);
			Text.NL();
			Text.Add("Come to think of it, <i>will</i> it come to that? Who knows? It’s not as if you’re likely to see this particular centaur mare again, after all.", parse);
			Text.NL();
			Text.Add("Keeping that thought in mind, you redouble your efforts in hammering yourself against the centaur, pounding her equine pussy as if the energy and ferocity of your copulation will make up for your modest load. Who knows? Maybe it will.", parse);
			Text.NL();
			Text.Add("On her part, the centaur mare responds eagerly to your enthusiasm, pushing her hindquarters against you to meet your thrusts. Juices slap and squelch wetly and messily as the two of you spiral into an increasingly frenzied bout of rutting and she seamlessly picks up the dying crest of your pleasure with her own, cunt walls trembling and flexing with a primal need to gather up all the seed you’ve so kindly given her.", parse);
			Text.NL();
			Text.Add("Moments tick by, and eventually the two of you relax a little, joints and muscles loosening as the high passes and afterglow begins to set in. The centaur mare mumbles something to herself, then reaches back to pat her flank and let out a long, contented sigh.", parse);
			Text.NL();
			Text.Add("<i>“Fuck, that was just what I needed - really hit the spot there,”</i> she says as she wipes the sweat off her brow. <i>“Not the best I’ve had, that’s for sure, but it was still pretty damn good.”</i>", parse);
			Text.NL();
			Text.Add("Oh, she doesn’t need to be modest, really.", parse);
			Text.NL();
			Text.Add("A snort. <i>“Fine, take it as you will.”</i>", parse);
		}
		Text.NL();
		Text.Add("When you're done and feel you’ve had enough, you pull out with a wet slurp and dismount, enjoying the sight of her creamy, well-fucked cunt. She seems quite pleased after her release, tail raised to show off those cum-stained lips of her equine pussy.", parse);
		if(cum >= 5)
			Text.Add(" For a moment, you wonder if all the spunk you just pumped into her is going to blow back out in a small geyser of white, creamy fury, but by some small miracle both her womb and cunt hold, with little more than a trickle of spunk oozing down her hindquarters.", parse);
		Text.NL();
		Text.Add("She catches you eyeing her cum-stained cunt, and turns up the corner of her mouth in a small smile. <i>“Enjoying your handiwork?”</i>", parse);
		Text.NL();
		Text.Add("Why not? It’s something to be proud of.", parse);
		Text.NL();
		Text.Add("<i>“Still don’t get why you were going to go to all this trouble if you were going to fuck me anyway. Could’ve just cut to the chase and gotten down to business.”</i>", parse);
		Text.NL();
		Text.Add("Hey, maybe it’s just an elaborate form of foreplay to turn you on, or maybe you just wanted to be sure that she was too tired to pull off some kind of tricksy stunt on you while you were fucking her. Highlanders are supposed to have their ways, after all.", parse);
		Text.NL();
		Text.Add("She huffs at that and reaches for her spear and shield, leaning her weight on the former in a bid to get about. It’s not very successful - she manages to totter for a few steps before having to sink back down onto the grass. Sure, you’d just beaten the stuffing out of her <i>and</i> then replaced it with a fresh stuffing of spunk, but you didn’t expect her to be <i>that</i> worn-down from all that attention.", parse);
		Text.NL();
		Text.Add("<i>“I’ll be fine.”</i> The mare waves you off. <i>“Go ahead and trot back to the lowlands or wherever you came from; all I need is to catch my breath and I’ll be fine.”</i>", parse);
		Text.NL();
		Text.Add("If she says so, then. With one last look back at the centaur mare, you turn and head on past her and down the road.", parse);
	}
	else { // Biped
		Text.Add("Well, it looks like everything’s where it should be and she’s in good health. No reason not to go ahead with your plan, then - finding a hollow log nearby, you heft it over and secure it solidly on the ground. With it, you’re able to get a proper boost up in order to properly get at her hindquarters - what with not being a taur and all - giving that firm horseflesh of hers a resounding smack with the flat of your palm.", parse);
		Text.NL();
		Text.Add("She yelps. <i>“H-hey!”</i>", parse);
		Text.NL();
		Text.Add("Why, did that feel good? It’d be a crime to leave her unbalanced so… smiling sweetly, you aim for her other butt cheek and give it a sharp slap, too. A soft moan escapes unbidden from the centaur mare - she stifles it quickly, but her juicy cunt betrays her as the dark streaks trickling down her hind legs grow ever so slightly.", parse);
		Text.NL();
		Text.Add("Oh, all right. You’ll not tease her anymore than is strictly necessary. The centaur mare’s swollen, drooling pussy lips make for a large, easy target, and you get all lined up, grinding your [cockTip] against them until she’s squealing and bucking against you, inadvertently getting you all lubed up with her juices.", parse);
		Text.NL();
		Text.Add("No time like the present, then. With a mighty thrust, you slide your man-meat into the centaur’s heated folds, ", parse);
		if(p1cock.Len() >= 38) {
			Text.Add("fitting her deep tunnel like a sleeve - almost as if you were made for this.", parse);
			if(p1cock.race.isRace(Race.Horse))
				Text.Add(" That goes double considering the equine tackle you’re packing at the moment - suited in both shape and size, as it were.", parse);
			Text.NL();
			
			Sex.Vaginal(player, mare);
			mare.FuckVag(mare.FirstVag(), p1cock, 3);
			player.Fuck(p1cock, 3);
			
			Text.Add("<i>“Damn,”</i> the centaur mare says with a satisfied sigh. <i>“It’s been a good long while since I’ve found a shaft capable of actually filling me.”</i>", parse);
			Text.NL();
			Text.Add("Why, are there no guy centaurs around?", parse);
			Text.NL();
			Text.Add("<i>“I’d have to get in line to see those who <b>are</b> in camp. Now shut up and fuck.”</i>", parse);
		}
		else {
			Text.Add("eventually bottoming out in her cavernous cunt.", parse);
			Text.NL();
			
			Sex.Vaginal(player, mare);
			mare.FuckVag(mare.FirstVag(), p1cock, 3);
			player.Fuck(p1cock, 3);
			
			Text.Add("<i>“Wait, that’s all you’ve got?”</i>", parse);
			Text.NL();
			Text.Add("Why, is it not enough? Some cock is better than no cock - would she rather have that?", parse);
			Text.NL();
			Text.Add("A sigh, followed by what might be the faintest trace of a pout <i>“Well, no…”</i>", parse);
			Text.NL();
			Text.Add("You shrug and keep on working away at it. Sure, her body might be clearly signaling that it could do with more than what it’s currently receiving, but it’s not as if you can do much about that - not right now, in any case.", parse);
		}
		Text.NL();
		Text.Add("Soon enough, you settle into a steady rhythm, pounding away to the musky smell of sex and squelching of juices. ", parse);
		if(player.HasBalls())
			Text.Add("Your [balls], full of sperm waiting to be unleashed, slap heavily against her butt cheeks as you grip her hindquarters to steady yourself", parse);
		else
			Text.Add("Your pounding is so ferocious that you’ve to widen your stance a little and grip her hindquarters tightly as you steady yourself against the mare’s powerful bucking", parse);
		Text.Add(" - and frankly speaking, what fine ass cheeks they are. Round and plump, yet with firm muscle supporting them from underneath and pushing them up, you have to admit that they’re fine pieces of horseflesh indeed. So fine, in fact, that you can’t help but palm them - an action which the centaur returns by way of pushing herself eagerly against you.", parse);
		Text.NL();
		Text.Add("Now that’s an invitation if you ever had one. It would be a shame to turn down that advance, so you shift your grasp from her hips to her ass, shamelessly squeezing, kneading, rolling that juicy horseflesh in your hands even as the centaur mare’s inner walls quiver and slide along your [cock] as you continue to fuck her silly.", parse);
		Text.NL();
		Text.Add("After a while, though, you feel that it’s time to move on to greener pastures. You can’t reach her human breasts - your arms aren’t quite long enough for that - but you <i>can</i> reach down to her underbelly and tweak her mare nipples. On her part, the centaur mare reaches up to her chest, and cupping her bosom, begins to molest herself with wanton, shameless abandon, half-turning so that you can get a good side view of her boobsterbation.", parse);
		Text.NL();
		Text.Add("<i>“Like what you see?”</i> she asks, tacking a whorish moan onto the end of her question. When no response is forthcoming, the centaur mare shrugs and redoubles her efforts. Her human mammaries seem to be far more sensitive and pleasure-inducing than her equine ones, by all appearances, and you grit your teeth and make sure you don’t start falling behind.", parse);
		Text.NL();
		Text.Add("<i>“Keep up, lowlander!”</i> the centaur mare yells as the two of you buck and writhe against each other with increasing, warlike ferocity. <i>“If you can beat me, sure you have the staying power for this!”</i>", parse);
		Text.NL();
		Text.Add("You’re doing what you can! The centaur mare looks back at you once more, and little hisses of heated breath escape from between her gritted teeth as she throws a determined glare in your direction.", parse);
		Text.NL();
		parse["b"] = player.HasBalls() ? "r balls" : "";
		Text.Add("Guess what? You’re determined, too! With her deep cunt squeezing and gripping around as much of your manhood as it can get, you can practically feel the cum being sucked out of you, drawn out of you[b] by the insistent suction being applied to your shaft.", parse);
		Text.NL();
		Text.Add("Subjected to such an intense fucking, you quickly feel yourself approaching your peak despite your best efforts to hold on. Sensing that you don’t have much time left, you desperately smash your hips against the centaur mare’s in a furious bout of fucking, trying to get her to break down before you do.", parse);
		Text.NL();
		Text.Add("She wins - barely. With a final thrust of your [cock] into the centaur mare’s warm, inviting insides, you groan aloud and blow your load straight into the centaur mare", parse);
		if(player.HasBalls())
			Text.Add(", balls churning and squelching audibly as they disgorge their cargo with terrible efficiency", parse);
		Text.Add(". She squeals and whinnies, her voice ringing in the cool highland air, and presses herself against you in a bid to take your seed.", parse);
		if(p1cock.Knot())
			Text.Add(" Even now, you feel your knot swelling and growing, greedily tying the two of you together, corking her cunt to make sure that as little of your sperm escapes as possible.", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		
		if(cum >= 8) {
			Text.Add("And what a load this one is. The deluge of spunk that’s been kept in reserve within you jets from your [cockTip] like water from a fire hose, an overwhelming sensation of delight washing over your entire body as you feel thick, hot jism run down the entirety of your shaft, down, down, down -", parse);
			Text.NL();
			Text.Add("- Clearly, the mare feels it too, for she lets out a loud whinny of orgasming delight just before her equine underbelly begins to bloat with your seed, her cervix unable to withstand the pressure of so much cum being forced into her that it has to no choice but to allow the flood into her heated, waiting womb, your bodies working together to ensure she receives your fertile cock cream.", parse);
			Text.NL();
			Text.Add("Bigger and bigger the centaur grows, almost as if gripped by some kind of unnatural pregnancy, ballooning away with your cum. Blushing furiously with a strawberry-red flush that covers her face and reaches all the way into her breasts, the mare pants lustily as the fires in her body are finally quenched by the liquid warmth pouring into her.", parse);
			Text.NL();
			Text.Add("<i>“Damn,”</i> the centaur mare manages to choke out after a little while, when your flow begins to abate somewhat and the two of you can think straight again. <i>“That was something.”</i>", parse);
			Text.NL();
			Text.Add("You look around to her huge, cum-inflated equine underbelly, so taut, round and low that it brushes against the grass as it sloshes from side to side as she tries to move. Yeah, that’s definitely something all right.", parse);
			Text.NL();
			Text.Add("<i>“Aren’t going to be moving about very much, not when I’m filled up like this.”</i> A sigh. <i>“But I guess it’s worth it if it means that I won’t be squirming around for a long time. Not as if I’m expected back in camp any time soon, anyway.”</i>", parse);
		}
		else if(cum >= 5) {
			Text.Add("The load that blasts out of your [cockTip] is certainly respectable, certainly heavy enough for you to palpably feel the rush of thick, liquid warmth that gushes through your manhood before erupting out into the centaur mare’s cunt. The feel of your hot spunk flooding her insides is enough to send the mare careening over the edge of pleasure and she goes down wildly, sweat pouring off her flanks as she shakes and trembles with sated need and desire.", parse);
			Text.NL();
			Text.Add("<i>“Fuuuuuck,”</i> she moans, her breasts heaving as she gasps great lungfuls of air. The centaur mare’s sex-swollen breasts bob up and down on her chests, nipples as hard as diamonds, and you have little doubt that her mare ones down below are as equally stiff. <i>“Fuck this. Fuck it all.”</i>", parse);
			Text.NL();
			Text.Add("Your only desire is to serve. So yes, you’ll fuck her.", parse);
			Text.NL();
			Text.Add("Filled to the brim with your sperm, the centaur mare’s only response is to moan and shift her weight as her equine underbelly begins to swell outwards, growing lower and rounder as if there’s already a foal growing unnaturally fast in her. Of course, you know it’s just cum from the way it sloshes around, but one can’t deny that it’s quite the satisfying sight.", parse);
			Text.NL();
			Text.Add("Eventually, your flow begins to ebb a little - although it’s far from stopped - and the centaur mare sighs in satisfaction. <i>“Well. Won’t <b>this</b> get a few odd looks when I return to camp.”</i>", parse);
		}
		else {
			Text.Add("Greedily, you press yourself against the fine piece of equine horseflesh that the centaur mare is, determined to give her a good taste of your wild oats. As you pump and thrust away, trying to get your sperm in as deep as you can, she on her part rears up against you to take it all into her cavernous pussy, the muscles of her inner walls undulating against and massaging your shaft. Sure, there’s not as much as one might have hoped, but one takes what one can get.", parse);
			Text.NL();
			Text.Add("<i>“Is that all you’ve got?”</i> the centaur mare says as your flow begins to ebb and falter. <i>“Sheesh, maybe I should have just let you pass by and jumped the next idiot with a dick to come down the road.”</i>", parse);
			Text.NL();
			Text.Add("She sure wasn’t holding that line of thought when she jumped <i>you</i>, though.", parse);
			Text.NL();
			Text.Add("<i>“Oh, just shut up and focus on fucking me.”</i>", parse);
		}
		Text.NL();
		Text.Add("Eventually, though, ", parse);
		if(player.HasBalls())
			Text.Add("your [balls] exhaust themselves", parse);
		else
			Text.Add("you exhaust yourself", parse);
		Text.Add(", the last of your available sperm dribbling out to join what you’ve already put deep in the mare. Winded and breathing hard, you wait for yourself to soften ", parse);
		if(p1cock.Knot())
			Text.Add("and your knot to deflate ", parse);
		Text.Add("enough for you to be able to pull out. There’s a loud, wet pop followed by the unsettling noise of slick juices, and you’re free.", parse);
		if(cum >= 5)
			Text.Add(" Despite your initial apprehensions, her cunt holds against the internal pressure of her cumflated womb with little more than a slight trickle that soon comes to a stop. Hah, seems like she’s going to be carrying your load about for a while, then.", parse);
		Text.NL();
		Text.Add("<i>“So, question.”</i>", parse);
		Text.NL();
		Text.Add("Yes?", parse);
		Text.NL();
		Text.Add("<i>“If you were going to fuck me anyway, why bother with beating me up in the first place? Is that your kink or what?”</i>", parse);
		Text.NL();
		Text.Add("You shrug; she stares at you with steely eyes before shrugging herself and picking up her spear and shield, leaning her weight on the former. She staggers a few steps, totters, and then sinks onto the ground with a small sigh.", parse);
		Text.NL();
		Text.Add("<i>“Welp, guess you did a number on me. I’ll just wait here for a bit until I get my breath back. For what it was worth… you were an okay fuck, lowlander.”</i>", parse);
		Text.NL();
		Text.Add("Merely okay? Next time, you’re just going to beat the stuffing out of her and leave her to work out her lusts by herself - assuming you ever run into her again, that is.", parse);
		Text.NL();
		Text.Add("<i>“Sheesh, don’t be so sore about it - it’s not in the way of my people to gush over or flatter others.”</i> The centaur mare sighs. <i>“Word of advice - I think you’d look a lot more fetching on four legs instead of two, but of course I’m biased.”</i>", parse);
		Text.NL();
		Text.Add("Heh. You’ll keep that in mind, then. Quickly, you tidy yourself off as best as you can, dust the dirt off your feet, then are on your way down the highland road.", parse);
	}
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt();
}


Scenes.MaliceScouts.Mare.WinFist = function(enc) {
	var mare   = enc.mare;
	var p1cock = player.BiggestCock();
	var parse = {
		
	};
	parse = player.ParserTags(parse);

	Text.Clear();
	Text.Add("Huh. She just wants to let loose a bit of steam, doesn’t she?", parse);
	Text.NL();
	Text.Add("The centaur mare just huffs. <i>“Whatever you’re going to do, do it. If you’re not going to make a move, then just get on down the road and leave me be.”</i>", parse);
	Text.NL();
	Text.Add("Ha ha - there’s no need to get her jimmies all rustled up and be so prissy about things. You’re sure that her people have a proud warrior people ethos going on that requires her to be such an uptight stick all of the time, but you’re sure that she can let her hair down now. After all, you <i>did</i> beat the stuffing out of her - and what better excuse is there for her current predicament than that?", parse);
	Text.NL();
	Text.Add("The centaur mare attempts to twist her lips into a scowl, but the renewed trickle of girl-cum down her equine hind legs betrays her thoughts, or at the very least, her instinctive desires. Musky and clearly smelling of arousal, it beckons you to her swollen and puffy pussy lips, slightly parted and just begging to be penetrated.", parse);
	Text.NL();
	Text.Add("Time to get started, then. Circling around behind the centaur mare, you take your time in inspecting her like a prize pony at a show fair. Placing your hands on her well-toned rump, you let out a contented sigh of victory at her firm yet pliable ass cheeks, reveling in the sheer sensation of healthy fat supported by an athletic musculature. Soft horsehair runs under your fingertips, and you raise her tail and force her ass cheeks apart, fully exposing the centaur mare’s pussy to full view.", parse);
	Text.NL();
	Text.Add("She gasps as the shock of cool air hits her wet, toasty pussy, and you see her innards clench, a fresh stream of girl-cum oozing down her rear as she makes a strangled noise in the back of her throat and color rises into her chest and cheeks.", parse);
	Text.NL();
	Text.Add("<i>“Come on, lowlander,”</i> she snarls through clenched teeth. <i>“There’s no need to keep anyone waiting.”</i>", parse);
	Text.NL();
	Text.Add("Hah, so she says. ", parse);
	if(p1cock) {
		Text.Add("Sure, you might have the equipment to do so, but you’re not in the mood for getting your dick wet today", parse);
		if(p1cock.Len() < 20)
			Text.Add(" - that, or you’re too well aware that you’d be completely insufficient for the satiation of the mare’s carnal needs", parse);
		Text.Add(". No, instead you have a much better idea, and you’re certain that the mare will be on board with you once you’re in.", parse);
	}
	else {
		Text.Add("It’s not like you have the equipment to do things the orthodox way… but then again, it’s not as if you ever had that in mind from the get go, right? No, you’ve got something better in mind to slake the mare’s desperate thirst, and you’re fairly certain she’ll be on board with you once she gets a taste of what you intend to serve up.", parse);
	}
	Text.NL();
	Text.Add("Slowly, you run two fingertips across the mare’s wet petals, lightly touching them with just the slightest hint of pressure. The centaur mare stiffens her entire body, drawing a sharp breath; you grin and work your way up her womanly flower until you’re faced with her love-button. Fat and swollen with her desperate arousal, it peeks out from under its hood stiffly; you take it between thumb and forefinger, slowly rubbing circles across the glistening nub of flesh, occasionally taking a moment to grind your thumb back and forth across its tip.", parse);
	Text.NL();
	Text.Add("The reaction is immediate - you move to the side just in time to avoid a squirt of clear girl-cum jet from her cunt and splash to the grass behind you. Trembling at all four knees, the centaur mare lets out a desperate, whorish moan, her eyes closed and fists balled so tightly her knuckles have turned white.", parse);
	Text.NL();
	Text.Add("Heh heh. Now <i>that’s</i> better. All right, then - now that she’s got a proper perspective and attitude about things, you’ll give her the relief that she was willing to fight you for.", parse);
	Text.NL();
	Text.Add("Bit by bit, you sink two fingers into the centaur mare’s cunt, enveloping them in wet horsey heat. Sensing the intrusion into her most intimate place, the centaur mare’s muscles pulse and flex, trying to draw what they imagine is a cock deeper into her cavernous pussy.", parse);
	Text.NL();
	Text.Add("However, you stay your hand, resisting the temptation to dive straight into the mare. Patience, patience - you force your breathing to remain calm and measured as you massage the mare’s inner walls with both fingers, occasionally spreading them wide so as to stretch her out a bit, get her more flexible and receptive to what you intend later. Barely able to remain standing, the mare wiggles desperately against your hand, letting loose juices that trickle down your wrist before falling to the ground.", parse);
	Text.NL();
	Text.Add("<i>“Spirits above, just fuck me already.”</i> It’s clear that instead of satiating her lusts, your foreplay has only served to exponentially ignite them further. <i>“Damn it, what are you waiting for? Are you dragging things out just to see me squirm?”</i>", parse);
	Text.NL();
	Text.Add("You were just waiting for her to say the magic word.", parse);
	Text.NL();
	Text.Add("<i>“Fuck you!”</i>", parse);
	Text.NL();
	Text.Add("Nope, that’s not the magic word. Come on, you’re pretty sure that she knows it - everyone does, unless they were brought up in a barn.", parse);
	Text.NL();
	Text.Add("The centaur mare half-turns to look back at you, biting her lip, and something in her eyes seems to snap. <i>“Please?”</i>", parse);
	Text.NL();
	Text.Add("And <i>there’s</i> the magic word. Seriously, if she’d just bothered with asking at the outset instead of jumping other people and trying to rape them, you suspect that she’d have gotten a much more favorable response to her advances. And since she’s now asked so nicely, you see no reason not to give her what she wants.", parse);
	Text.NL();
	Text.Add("Two fingers quickly become three, then four, until your entire fist has sunk into the mare’s pussy with a loud squelch of juices. True to its equine nature, her cunt stretches and gapes to admit the entirety of your hand, the sudden straining of her muscles eliciting a cry of pleasure from her lips.", parse);
	Text.NL();
	Text.Add("You’re only just getting started, though. Even as the centaur mare’s pussy tries to clamp down on your fist with vice-like vigor, you spread your palm within her inner walls, clenching and unclenching your fingers as her slick tunnel pushes and slides against your hand. It’s just so wet, warm and <i>slick</i> that you almost pity the mare for having to deal with this on a regular basis and yet have no means of actually satisfying herself under her own power.", parse);
	Text.NL();
	Text.Add("What a pity, indeed. Good thing that you’re here to scratch that itch, then!", parse);
	Text.NL();
	Text.Add("It’s not an actual, massive equine shaft, but your fist and forearm are a pretty good approximation, judging by how the centaur mare nickers. Her inner walls continue to squeeze and ripple against your arm as you push more and more of it into her, stopping just past your wrist before beginning to pull out again. She’s just as toned and muscular on the inside as she is on the outside, and you can’t help but wonder why the centaur men wherever she lives wouldn’t want a piece of her. ", parse);
	if(player.IsTaur())
		Text.Add("Yeah, you may be not quite in the mood for that kind of fun right now, but surely <i>all</i> the tauric guys can’t be having a headache <i>all</i> the time.", parse);
	else
		Text.Add("You know you would, if you were on four legs instead of two. It’s such a waste, to be honest.", parse);
	Text.NL();
	Text.Add("<i>“H-hey!”</i> the centaur mare says as you move to extract your fist. <i>“You’re not going to pull out already, are you? Come on!”</i>", parse);
	Text.NL();
	Text.Add("Whatever made her think that you were anywhere near done? Really, all she needs to do is to just stand there and relax, anything else is a bonus. Don’t worry about performance, take a load off and enjoy the show!", parse);
	Text.NL();
	Text.Add("<i>“I can’t -”</i> her words are cut off mid-sentence as you gather your strength and literally punch into her cunt, driving your arm through those meat curtains and lodging yourself up to the elbow in fine horseflesh.", parse);
	Text.NL();
	Text.Add("Her eyes wide and mouth formed into a small ‘o’, the centaur mare dances on the spot for a few seconds, her hooves trampling the grass underfoot - you’re a little worried that she might bolt and take you with her, but her lust eventually overcomes the shock of the sudden penetration and she pushes her hindquarters against you.", parse);
	Text.NL();
	Text.Add("<i>“Ah! Ah!”</i>", parse);
	Text.NL();
	Text.Add("Feels good, doesn’t it? Bracing your [feet] on the grassy ground, you pull your arm out of the centaur mare - it’s a bit of effort considering how reluctant she is to let you go, but you pull back such that only your wrist still remains in her. Taking a deep breath, you shift your weight and lunge forward, a loud squelch sounding in the air as you pound her pussy with your fist. This time, you sink in almost all the way to your shoulder, and feel a satisfying hardness as you hit her cervix.", parse);
	Text.NL();
	Text.Add("Fully stuffed by way of being impaled on your arm, the centaur mare whinnies while you jiggle your limb up and down, to and fro, stretching her cunt for what’s going to come next. Once you’re sure you have a good footing, you begin jackhammering her insides with your fist, making sure to spread your fingers every so often for maximum effect. ", parse);
	Text.NL();
	Text.Add("Slick, glistening juices and slurping sounds abound as you throw your weight back and forth, withdrawing to your wrist before lunging forward to hammer at her cervix like a battering ram at the gates. The centaur mare completely loses it at this point - she can barely remain standing, and screams her arousal like a cheap, overacting whore over the mountains and foothills. With how loud she is, you’re pretty sure that everyone will be able to hear you for miles - not that you care, or that you could back out now even if you did.", parse);
	Text.NL();
	Text.Add("Feebly, the centaur mare tries to reciprocate your efforts, but you’re moving too quickly and she’s simply too addled by her mounting lust that there’s no way she’s keeping up with you. Feminine honey oozes out from around your arm, dripping onto the grass at a steady rate, and the slow trembling in her body alerts you to her impending orgasm.", parse);
	Text.NL();
	Text.Add("Best to let it all out, then. Grinning widely, you give the centaur mare one good final thrust, twisting and wiggling your arm in her heated depths like some kind of tentacle. Her entire body tenses for a split second, and then her love-tunnel is gripping tightly at your limb as waves of orgiastic pleasure cascade through her form, leaving her a quivering wreck. Unable to keep standing, the centaur mare collapses on her knees, dragging you to the ground with her even as the puddle of slick juices she’s standing in continues to grow.", parse);
	Text.NL();
	Text.Add("Time to get out of here, then - your job is done. One last surge of effort has you free of her, your glistening fist emerging from the centaur’s now-gaping cunt with a pop and spray of girl-cum. Looking down at the centaur mare, you can’t help but feel at least a small amount of satisfaction as she whines and groans, the aftershocks of her tremendous orgasm carrying her a good way with their momentum before she finally comes to a panting, wheezing stop.", parse);
	Text.NL();
	Text.Add("Did she enjoy herself?", parse);
	Text.NL();
	Text.Add("<i>“Fuck.”</i>", parse);
	Text.NL();
	Text.Add("You’ll take that as a yes. Did this sate her, and does that mean that she won’t be troubling people on the highland roads for a little while now?", parse);
	Text.NL();
	Text.Add("<i>“Fuck. Fuck. Fuck.”</i> The centaur mare’s underbelly heaves in and out as she looks at you with stupid, glazed-over eyes. Compared to the proud warrior race girl schtick she was trying to pull off earlier, this suits her so much better. Either way, having had some much-needed relief for her heated cunt, she looks to be in no condition to be menacing the roads, so you’ve probably done the Highlands a public service. Go you!", parse);
	Text.NL();
	Text.Add("Pumping in and out of the mare for that long did take quite a bit out of you as well, but you’re able to stroll on over to the centaur’s human half and give her a pat on the head with your cum-stained hand, then wipe your arm off all over her face and torso, as if you were applying some kind of lewd war-paint on her.", parse);
	Text.NL();
	Text.Add("There, much better! Smiling, you turn your back on the dazed centaur, leaving her by the roadside behind you. Before long, you are on your way.", parse);
	Text.Flush();
	
	player.AddSexExp(2);
	player.AddLustFraction(0.5);
	
	Gui.NextPrompt();
}

Scenes.MaliceScouts.Mare.LossPrompt = function() {
	SetGameState(GameState.Event);
	Text.Clear();
	
	// this = encounter
	enc = this;
	
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("There’s something about a huge mass of horseflesh that has a sense of weight and inevitability about it, one that you get a very keen appreciation for when the centaur mare charges and blindsides you, knocking ", parse);
		if(player.weapon)
			Text.Add("your [weapon] out of your [hand]s", parse);
		else
			Text.Add("the wind out of you", parse);
		Text.Add(" and sending you reeling. Before you know it, she’s got the tip of her spear a hair’s breadth away from your throat.", parse);
		Text.NL();
		Text.Add("<i>“I told you that I’d <b>make</b> you service me if it came down to that, and so it has.”</i> She draws a deep breath of cool highland air to steady her words, shaking with mounting arousal, and continues. <i>“You fought well - or at least, as well as you could - but your strength has failed you. I hope that you’ve the good sense to acquiesce, or if not, at least submit to your fate.”</i>", parse);
		Text.NL();
		Text.Add("And what if you don’t?", parse);
		Text.NL();
		Text.Add("The centaur mare licks her lips. <i>“Then like it or not, I will take whatever I want from you anyway.”</i>", parse);
		Text.NL();
		
		var armor = "";
		if(player.Armor() || !player.LowerArmor()) armor += "[armor]";
		if(player.Armor() && player.LowerArmor()) armor += " followed by your ";
		if(player.LowerArmor()) armor += "[botarmor]";
		parse["arm"] = Text.Parse(armor, parse);
		
		Text.Add("Your concentration is so focused on her spear-tip that you don’t notice one of her hooved forefeet lashing out, catching you soundly on the chest and sending you sprawling onto your back. Before you know it, she’s tossed aside her spear and shield and is on you, pawing messily at your [arm] in a frantic bid to get it off. It takes somewhat longer than one would expect thanks to how haphazardly she’s grabbing at the material, but eventually the lot is off and you’re at her mercy.", parse);
		Text.NL();
		Scenes.MaliceScouts.Mare.LossEntry(enc);
	});
	Encounter.prototype.onLoss.call(enc);
}

Scenes.MaliceScouts.Mare.LossEntry = function(enc) {
	//TODO More Loss Scenes
	var scenes = new EncounterTable();

	scenes.AddEnc(function() {
		Scenes.MaliceScouts.Mare.LossFacesit(enc);
	}, 1.0, function() { return true; });
	
	/* TODO
	scenes.AddEnc(function() {
		
	}, 1.0, function() { return true; });
	*/
	scenes.Get();
}


Scenes.MaliceScouts.Mare.LossFacesit = function(enc) {
	var parse = {
		
	};
	parse = player.ParserTags(parse);

	Text.Add("Out of breath, the centaur mare pauses for a moment and considers you on the ground as she takes a moment to recover.", parse);
	Text.NL();
	Text.Add("<i>“Fuck. How to make sure this one won’t run away while fucking me.”</i> Another moment of hesitation as her eyes dart this way and that - guess she hasn’t actually thought anywhere past “waylay and beat up travelers on the road”, eh?", parse);
	Text.NL();
	Text.Add("<i>“Shut up,”</i> she replies, a scowl on her face. <i>“I’m trying to think.”</i>", parse);
	Text.NL();
	Text.Add("She scratches her head, looks around a little more, and then her eyes fall upon a large, flat-sided boulder a little ways to the side of the road. <i>“Guess that’ll have to do.”</i>", parse);
	Text.NL();
	Text.Add("Guess <i>what</i> will have to do? Before you can ask the question, though, the centaur mare’s grabbed you by the scruff of your neck and has begun dragging you towards the boulder. Of course, you’re obligated to put up a token resistance - which, of course, is ultimately ineffectual as she hoists you upright and pushes your back against the boulder’s smooth, flat side.", parse);
	Text.NL();
	Text.Add("Okay, now what?", parse);
	Text.NL();
	Text.Add("<i>“Don’t get lippy with me,”</i> the centaur mare snarls. <i>“Just because I need you to pleasure me doesn’t mean I can’t break a limb or two while at it.”</i>", parse);
	Text.NL();
	Text.Add("Twisting her neck so she can keep an eye on you, the mare turns about such that her shapely equine rear is directly facing you. Even like this, you can see her cunny winking at you from between her hindquarters, literally wet and dripping with arousal. There’s only a moment to wonder what she’s up to when she bucks backward forcefully, sandwiching you between a rock and a weighty mass of horseflesh.", parse);
	Text.NL();
	Text.Add("<i>“There’s no way you’re getting out from under this,”</i> she tells you as you put up yet another round of token struggle. <i>“You can enjoy it, or not, but either way the end result is the same.”</i>", parse);
	Text.NL();
	Text.Add("With that said, she wiggles her rounded rear all over your torso, giving you a good feel of all that supple, solid horseflesh rolling over your [skin], spreading her scent all over you. That goes doubly so for the musk rising from her juicy pussy - although it’s still some distance from your face, the very air itself is saturated with the needy scent of sex. You can’t escape it - the pervading aura forces its way into your nostrils and down your throat, making you cough and splutter a bit even as the centaur mare continues grinding against you.", parse);
	Text.NL();
	Text.Add("Another thrust up against you, and the mare has her ass cheeks spread wide, her cunny winking and dripping with heated need as she slides it further and further up, leaving a slick trail of girl-cum along the length of your body. Without warning, she shifts her weight again, and now she’s got your face well up and against her butt, her womanly flower overflowing with nectar and barely an inch or two from your lips.", parse);
	Text.NL();
	Text.Add("You can’t breathe! While you can get just enough air to avoid passing out - if you struggle to fill your lungs - the bulk of the mare’s supple butt cheeks are pressed into your face. All you can smell - or even taste - is her sex, and there’s no way to escape that overpowering scent now, so close as you are to its source.", parse);
	Text.NL();
	Text.Add("<i>“Lick,”</i> the centaur mare commands in an authoritative voice - or at least, as authoritative as one can get when one’s practically riddled with need. <i>“I’m sorry, but I can’t risk you getting away. The sooner you’re done, the sooner you can be released.”</i>", parse);
	Text.NL();
	Text.Add("Nothing for it, then. Gingerly, you brush the tip of your [tongue] across her mare folds, and taste her feminine nectar for real. Back and forth, back and forth, you begin teasing the centaur mare’s labia with your tongue-tip, quick touches and flicks that while providing enough sensation, also harbor the promise of so much more.", parse);
	Text.NL();
	Text.Add("The centaur mare shifts her weight again, her voice trembling. <i>“T-there’s no need to bother with foreplay. Just get to it already!”</i>", parse);
	Text.NL();
	Text.Add("She may have beaten you and may be forcing you to eat her out, but at least this is something you still have control over. Taking your time, you lap at her love-button like a kitten at a saucer of milk, with much the same effect - the centaur mare nickers and moans as you continue your tender ministrations, juices practically gushing down her cunt, dribbling down your chin and running down her legs, but the sheer bulk of her body and barding is ensuring that you still aren’t going anywhere in a hurry.", parse);
	Text.NL();
	Text.Add("Fine, now that you’re done with the appetizers, time to get on with the main course. You pause a moment beforehand to get all the air you can, then press your lips to her juicy cunt and start licking. With her rump in your face, you can’t quite see her face, but you can definitely <i>hear</i> her scream in a mixture of release and relief as she’s given a reprieve from her desperate lusts.", parse);
	Text.NL();
	Text.Add("<i>“Fuck,”</i> she groans. <i>“Fuuuuck. That’s it, yes. That’s. Just. It.”</i>", parse);
	Text.NL();
	Text.Add("Great! Since she liked that, who wants to bet she wants even more! You work your tongue over the centaur mare's cunny and dive into it shamelessly, putting all your strength into it as you do your best to bring her to climax as quickly as possible. One has to admit, the taste of the mare's hot juices is deliciously arousing despite the circumstances, and you lap up as much of it as you can get.", parse);
	Text.NL();
	Text.Add("Hot and sticky, the scent and taste of her nectar overwhelms your senses, blinding you to pretty much everything else but the mare and her pussy. The more you lick away, the faster and freer it flows, and with her ass pressed up against your face, you can feel the muscles beneath shifting, flexing, squeezing as you drive her closer and closer to finally letting loose all that pent-up sexual energy she’s got in her body.", parse);
	Text.NL();
	Text.Add("At long last, you break down the last of the centaur mare’s inhibitions and she cums with a loud whinny of release, stamping at the ground with her hooved forefeet as shockwaves of ecstasy travel up and down the length of her body. Hot and sticky with girl-cum, you pant for breath as she finally pulls her ass away and collapses onto her knees and equine underbelly, her head bowed as she balls her fists and groans needily.", parse);
	Text.NL();
	Text.Add("My, my, wasn’t she just so pent-up - it must have taken an iron will for her to have held it back for so long. As you look on, the centaur mare cums not once but twice more from the aftershocks of her first orgasm, needing no further stimulation on your part - the sheer rush from the release of all that sexual energy is enough to drive her over the edge. Squirt after squirt of nectar lands on the grass, wetting it until her hind legs are in a messy puddle of her own sexual fluids.", parse);
	Text.NL();
	Text.Add("<i>“Shit,”</i> she groans, then looks back at you. Her lips move and she tries to say something, but all that comes out is a bunch of garbled nonsense - she tries this a few more times, then finally gives up and shuts her yap. Well, it’s not as if you’d had have the energy to carry on a meaningful conversation anyway - it’s all you can do to slump down on the ground, sliding down the boulder’s smooth surface until the you can feel the cool grass beneath you.", parse);
	Text.NL();
	Text.Add("And just like that, it’s over. It’s clear that the centaur mare has gotten some much-needed relief for her heat-filled cunt - hopefully by taking one for the team, she won’t be harassing travelers on the Highlands roads for some time now. Quick and dirty, with perhaps no real pleasure from the deed, but what needs to be done has been done.", parse);
	Text.NL();
	
	var armor = "";
	if(player.Armor() || !player.LowerArmor()) armor += "[armor]";
	if(player.Armor() && player.LowerArmor()) armor += " followed by your ";
	if(player.LowerArmor()) armor += "[botarmor]";
	parse["arm"] = Text.Parse(armor, parse);
	
	Text.Add("Seems there nothing left for you here now. Leaving the centaur mare to recover in her own time, you gather your [arm] and are on your way. Before long, you crest the next hill, and the centaur vanishes from sight.", parse);
	Text.Flush();
	
	player.AddSexExp(2);
	player.AddLustFraction(0.5);
	
	Gui.NextPrompt();
}
