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
