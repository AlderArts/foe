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
//TODO STATS
function CatboyMage(levelbonus) {
	Entity.call(this);
	this.ID = "catboymage";
	
	this.avatar.combat     = Images.stallion;
	this.name              = "Catboy";
	this.monsterName       = "the catboy";
	this.MonsterName       = "The catboy";
	this.body.DefMale();
	this.FirstCock().thickness.base = 4;
	this.FirstCock().length.base = 19;
	this.Balls().size.base = 2;
	
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
	
	//TODO
	this.elementDef.dmg[Element.mEarth] = 0.5;
	this.elementDef.dmg[Element.mWind]  = 0.5;
	this.elementDef.dmg[Element.pBlunt] = 0.3;
	
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

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
CatboyMage.prototype = new Entity();
CatboyMage.prototype.constructor = CatboyMage;

//TODO DROPS
CatboyMage.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.1)  drops.push({ it: Items.Felinix });
	if(Math.random() < 0.02) drops.push({ it: Items.Tigris });
	if(Math.random() < 0.5)  drops.push({ it: Items.Whiskers });
	if(Math.random() < 0.5)  drops.push({ it: Items.HairBall });
	if(Math.random() < 0.5)  drops.push({ it: Items.CatClaw });
	
	if(Math.random() < 0.3)  drops.push({ it: Items.FreshGrass });
	if(Math.random() < 0.3)  drops.push({ it: Items.SpringWater });
	if(Math.random() < 0.1)  drops.push({ it: Items.Foxglove });
	if(Math.random() < 0.1)  drops.push({ it: Items.FlowerPetal });
	if(Math.random() < 0.1)  drops.push({ it: Items.FoxBerries });
	if(Math.random() < 0.1)  drops.push({ it: Items.TreeBark });
	if(Math.random() < 0.1)  drops.push({ it: Items.AntlerChip });
	if(Math.random() < 0.1)  drops.push({ it: Items.SVenom });
	if(Math.random() < 0.1)  drops.push({ it: Items.MDust });
	if(Math.random() < 0.1)  drops.push({ it: Items.RawHoney });
	if(Math.random() < 0.1)  drops.push({ it: Items.BeeChitin });
	
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

//TODO LINK
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
		Text.Add("No better time for a quick break, then, before all that walking really gets to you. The gently rounded top of a nearby hill offers a perfect spot to take a breather - high up in the midst of a stiff breeze, and with a good view of the surrounding lands to survey them and plan your next move. The grasses get taller as you move along, reaching up to perhaps mid-thigh[f], but you press on ahead and are at the top before long.", parse);
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
		Text.Add("What you flush out isn’t quite what one might have expected: instead of an animal or wild monster, what emerges into the open is a small-ish catboy, perhaps no more than five and a half feet tall. A large hood covers much of his head and hair, the garment having has large slits cut out from its fabric to accommodate the catboy’s large, white-furred ears. Bits of translucent mist fall from his fingers, marking him as the one who’d tried to ensnare you with that spell; his simple brown cloak and baggy pants billow in the stiff breeze as he yowls and tries to run away. Unfortunately for the poor catboy, the large belt at his waist with all the pouches and implements - as well as what looks like a pocket-sized spellbook - unbalance him somewhat; he loses his footing, comically trips over something hidden in the grass and plants his face into the ground.", parse);
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
	//TODO
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
		Text.Add("A loud yowl sounds from the catboy mage as he stumbles back. It’s impressive how despite his frail-looking frame, he’s managed to take as much punishment as he already has and still remain standing - you’re not exactly sure when you actually hit him in the face, but there’s blood pouring out of his nose in a frenetic nosebleed and his large, floppy ears have folded flat against his tattered hood.", parse);
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
		
		Gui.SetButtonsFromList(options, true, function() {
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		});
	});
	Encounter.prototype.onVictory.call(enc);
}
