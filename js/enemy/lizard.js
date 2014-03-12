/*
 * 
 * Lizard, lvl 1-2
 * 
 */

function Lizard(gender) {
	Entity.call(this);
	
	if(gender == Gender.male) {
		this.avatar.combat     = Images.lizard_male;
		this.name              = "Lizard";
		this.monsterName       = "the male lizard";
		this.MonsterName       = "The male lizard";
		this.body.cock.push(new Cock());
		this.body.cock.push(new Cock());
	}
	else if(gender == Gender.female) {
		this.avatar.combat     = Images.lizard_fem;
		this.name              = "Lizard";
		this.monsterName       = "the female lizard";
		this.MonsterName       = "The female lizard";
		this.body.DefFemale();
		this.Butt().buttSize.base = 4;
		if(Math.random() < 0.9)
			this.FirstVag().virgin = false;
	}
	else {
		this.avatar.combat     = Images.lizard_fem;
		this.name              = "Lizard";
		this.monsterName       = "the herm lizard";
		this.MonsterName       = "The herm lizard";
		this.body.DefHerm(false);
		this.Butt().buttSize.base = 4;
		if(Math.random() < 0.3)
			this.FirstVag().virgin = false;
		this.body.cock.push(new Cock());
	}
	
	this.maxHp.base        = 40;
	this.maxSp.base        = 20;
	this.maxLust.base      = 25;
	// Main stats
	this.strength.base     = 10;
	this.stamina.base      = 13;
	this.dexterity.base    = 13;
	this.intelligence.base = 11;
	this.spirit.base       = 11;
	this.libido.base       = 14;
	this.charisma.base     = 15;
	
	this.level             = 1;
	if(Math.random() > 0.8) this.level = 2;
	this.sexlevel          = 1;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 4;
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.lizard, Color.brown);
	TF.SetAppendage(this.Appendages(), AppendageType.horn, Race.lizard, Color.green);
	
	this.body.SetRace(Race.lizard);
	
	this.body.SetBodyColor(Color.green);
	
	this.body.SetEyeColor(Color.blue);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Lizard.prototype = new Entity();
Lizard.prototype.constructor = Lizard;

Scenes.Lizards = {};

Lizard.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Lacertium });
	if(Math.random() < 0.5)  drops.push({ it: Items.SnakeOil });
	if(Math.random() < 0.5)  drops.push({ it: Items.LizardScale });
	if(Math.random() < 0.5)  drops.push({ it: Items.LizardEgg });
	return drops;
}

Lizard.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! Hiss!");
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
	else if(choice < 0.8 && Abilities.Physical.Pierce.enabledCondition(encounter, this))
		Abilities.Physical.Pierce.CastInternal(encounter, this, t);
	else
		Abilities.Seduction.Tease.CastInternal(encounter, this, t);
}


// MALE + FEMALE ENCOUNTER
world.loc.Desert.Drylands.enc.AddEnc(function() {
 	var enemy    = new Party();
 	var male     = new Lizard(Gender.male);
 	var female   = new Lizard(Gender.female);
	enemy.AddMember(male);
	enemy.AddMember(female);
	var enc      = new Encounter(enemy);
	enc.male     = male;
	enc.female   = female;
	
	if(Math.random() < 0.5) {
		var third = new Lizard((Math.random() > 0.5) ? Gender.male : Gender.female);
		enemy.AddMember(third);
		enc.third = third;
	}
	
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	
	enc.onEncounter = function() {
		var parse = { numQ : Text.Quantify(enemy.Num()), num : Text.NumToText(enemy.Num()) };
		
		Text.AddOutput("Walking through the broad expanse of the desert, the sun beating down on you from above, you pass through a series of immense dunes. They tower above you, almost creating a valley of sand that shields you from the harsh heat of day.", parse);
		if(party.Two()) {
			var member = party.members[1];
			Text.AddOutput(" You glance back at [name] to make sure that [heshe] isn't hurt or dehydrated and, seeing that [heshe]'s relatively okay, press on.", { name: member.name, heshe : member.heshe() });
		}
		else if(!party.Alone()) {
			Text.AddOutput(" You glance back to your party to make sure that no one is hurt or dehydrated and, seeing that they're relatively okay, press on.", parse);
		}
		Text.Newline();
		Text.AddOutput("As you near the end of the monolithic dunes, you see a [numQ] of shadows fall over you. Looking up toward the sun, you see [num] shapes. You shield your eyes with one hand, and manage to make them out...", parse);
		Text.Newline();
		Text.AddOutput("The first is a bulky, heavily muscled creature of scales and claws. His body is covered in thick, armored, yellow-green scales, and a long and powerful tail stretches out behind him. Heavyset horns jut out from the back of his head, with the hint of small spikes protruding from either side of his angular muzzle. He holds a nasty-looking spear, and two large feet spread his weight evenly on the sand.", parse);
		Text.Newline();
		Text.AddOutput("Completely nude, you can't see any sign of gender between his legs, everything likely hidden within a reptilian slit. The only reason you can even tell his gender is his companion, looking like a more slender, fairer counterpart with two, large breasts held pert by a woven bra of some material you can't make out, the space between her legs similarly clad. Black hair cascades in silken tresses around her shoulders, and her eyes are painted in an exotic fashion. She holds a slightly smaller spear, which looks more designed for cutting.", parse);
		Text.Newline();
		
		if(enc.third) {
			Text.AddOutput("Beside the two of them, a second [gender] stands, watching you. ", { gender : Gender.Desc(enc.third.body.Gender()) });
		}
		Text.AddOutput("When they realize you've spotted them, the male thrusts his spear forwards. The group surges down the slope of the sand dune toward you. It's a fight!", parse);
		
		Gui.NextPrompt(function() {
			enc.PrepCombat();
		});
	}
	
	enc.onLoss    = Scenes.Lizards.LossPrompt;
	enc.onVictory = Scenes.Lizards.WinPrompt;
	
	return enc;
}, 1.0);

Scenes.Lizards.WinPrompt = function() {
	gameState = GameState.Event;
	Text.Clear();
	
	var enc = this;
	enc.finalize = function() {
		Encounter.prototype.onVictory.call(enc);
	}
	
	Text.Clear();
	
	var parse = {
		two : enc.third ? " two" : ""
	};
	var scene;
	
	var odds = enc.third ? (enc.third.body.Gender() == Gender.male ? 0.66 : 0.33) : 0.5;
	
	// Male
	if(Math.random() < odds) {
		scene = function() { Scenes.Lizards.WinMale(enc); };
		parse["m1himher"]  = "him";
		parse["m1hisher"]  = "his";
		parse["m2hisher"]  = "her";
	}
	// Female
	else {
		scene = function() { Scenes.Lizards.WinFemale(enc); };
		parse["m1himher"]  = "her";
		parse["m1hisher"]  = "her";
		parse["m2hisher"]  = "his";
	}
	parse["m2hisherTheir"] = enc.third ? "their" : parse["m2hisher"];
	
	if(Math.random() < 0.6) {
		Text.Add("With a solid <i>thump</i>, you beat your foe to the ground. The reptile tries to scramble away, but you step in front of [m1himher], blocking [m1hisher] path. As you stop [m1himher], you see the other[two] scurry away, leaving [m2hisherTheir] companion to [m1hisher] fate...", parse);
		
		Gui.NextPrompt(function() {
			scene(enc);
		});
	}
	else {
		Text.Add("You feint one way, then strike the finishing blow to the surprised reptile in front of you. She slumps to the ground, and you move to block her escape. Suddenly you hear an alarmed hiss of breath. Turning your head, you see the beaten male looking up at you, breathing slowly. He looks to the female, then back at you.", parse);
		Text.NL();
		Text.Add("<i>\"Spare her,\"</i> he hisses. <i>\"Take... me.\"</i>", parse);
		Text.NL();
		Text.Add("You blink in pleased surprise. It seems that, this time, you have your pick of the litter...", parse);
		
		//[Male][Female]
		var options = new Array();
		options.push({ nameStr : "Male",
			func : function() { Scenes.Lizards.WinMale(enc); }, enabled : true,
			tooltip : "Listen to his pleas and take out your victory on him instead."
		});
		options.push({ nameStr : "Female",
			func : function() { Scenes.Lizards.WinFemale(enc); }, enabled : true,
			tooltip : "Ignore him and claim his female companion."
		});
		options.push({ nameStr : "Neither",
			func : function() {
				Text.NL();
				Text.Add("Rather than taking out your victory rush on your fallen foes, you opt to continue on your travels.", parse);
				Text.Flush();
				Gui.NextPrompt(enc.finalize);
			}, enabled : true,
			tooltip : "Have mercy on them."
		});
		Gui.SetButtonsFromList(options);
	}
	Text.Flush();
}

Scenes.Lizards.WinMale = function(enc) {
	var parse = {
		p1name        : function() { return party.members[1].NameDesc(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		clothesDesc   : function() { return player.ArmorDesc(); },
		numCocks      : function() { return player.MultiCockDesc(); },
		m1Name        : function() { return enc.male.NameDesc(); },
		m1name        : function() { return enc.male.nameDesc(); }
	};
	
	Text.Clear();
	Text.Add("You grin triumphantly, standing over the reptile you just trounced, looking down at him victoriously. He lays there on the ground, his chest heaving and his breath coming as a sibilant hiss. He gazes to your feet, his slitted eyes defeated.", parse);
	Text.NL();
	if(player.LustLevel() > 0.3) {
		Text.Add("You smirk at him. The creatures are known for abusing those they beat, perhaps you should return the favour?", parse);
		
		Text.NL();
		if(player.FirstCock() && player.FirstVag()) {
			Text.Add("You feel a steady ache in your quivering pussy, and a similar one as your [multiCockDesc] gently begin to throb to life. It quickly reminds you of just what you could do with the defeated reptile... What do you do?", parse);
		}
		else if(player.FirstCock()) {
			Text.Add("The steady stirring in your groin tells you that your body is more than willing... What do you do?", parse);
		}
		else if(player.FirstVag()) {
			Text.Add("The dull ache in your [vagDesc] and the feeling of your nipples hardening under your [clothesDesc] sends shivers down your spine... What do you do?", parse);
		}
		
		var options = new Array();
		if(player.FirstCock()) {
			options.push({ nameStr : "Anal",
				func : function() {
					Scenes.Lizards.WinClaimAss(enc, enc.male);
				}, enabled : true,
				tooltip : "He's not going to put up much of a fight now, why not put his ass to good use?"
			});
			options.push({ nameStr : "Blowjob",
				func : function() {
					Scenes.Lizards.WinBlowjob(enc, enc.male);
				}, enabled : true,
				tooltip : "With a muzzle that long, you bet he could take every inch..."
			});
		}
		
		//[Powerbottom][Leave]
		options.push({ nameStr : "Powerbottom",
			func : function() {
				Scenes.Lizards.WinPowerbottom(enc);
			}, enabled : true,
			tooltip : "Who says the winner has to be on top? You like a good ride, when you're in charge."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("You shake your head, looking down at [m1name]. He gazes up at you warily, as if expecting something bad to happen. Lucky for him, you're not in the mood for reptile today.", parse);
				Text.Flush();
				Gui.NextPrompt(enc.finalize);
			}, enabled : true,
			tooltip : "It's tempting, but you have better things to do than teach a reptile his place."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("You smirk in satisfaction at seeing such a creature beaten. Were you a little more in the mood, you might even be inclined to give him a taste of his own medicine, but for now you simply claim the spoils of victory and leave.", parse);
		if(party.Two()) {
			Text.NL();
			Text.Add("[p1name] joins you with a nod.", parse);
		}
		else if(!party.Alone()) {
			Text.NL();
			Text.Add("Your party joins you.", parse);
		}
		Gui.NextPrompt(enc.finalize);
	}
	Text.Flush();
}

Scenes.Lizards.WinFemale = function(enc) {
	var parse = {
		p1name        : function() { return party.members[1].NameDesc(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		clothesDesc   : function() { return player.ArmorDesc(); },
		numCocks      : function() { return player.MultiCockDesc(); },
		m1Name        : function() { return enc.female.NameDesc(); },
		m1name        : function() { return enc.female.nameDesc(); }
	};
	
	Text.Clear();
	Text.Add("You can't help but grin as you overcome the reptilian warrior who so eagerly tried to beat you down.  You stare at her for a few minutes, calming your breathing as she gazes at the ground. Her scales glint in the light, and you find yourself struck by an odd sort of attraction to the creature.", parse);
	Text.NL();
	
	if(player.LustLevel() > 0.3) {
		Text.Add("She's actually rather pretty, at least in a reptilian, monstrous way. You find your thoughts trailing to what she would feel like, then slowly to more lewd thoughts.", parse);
		Text.NL();
		if(player.FirstCock() && player.FirstVag()) {
			Text.Add("You feel a stirring in your groin, both your [multiCockDesc] and your [vagDesc] feeling flushed with heat. You bite your lip for a moment in thought, then nod, having decided.", parse);
		}
		else if(player.FirstCock()) {
			Text.Add("You feel yourself rapidly growing hard, and take a deep breath. The lizard looks up at you, her eyes seeming oddly sultry. She quickly glances back down. What do you do?", parse);
		}
		else if(player.FirstVag()) {
			Text.Add("You feel your [vagDesc] growing wet, and idly wonder what you could do with hers... The lizard looks up at you, her eyes seeming oddly sultry. She quickly glances back down. What do you do?", parse);
		}
		
		var options = new Array();
		if(player.FirstCock()) {
			options.push({ nameStr : "Anal",
				func : function() {
					Scenes.Lizards.WinClaimAss(enc, enc.female);
				}, enabled : true,
				tooltip : "She's not going to put up much of a fight now, why not put her ass to good use?"
			});
			options.push({ nameStr : "Blowjob",
				func : function() {
					Scenes.Lizards.WinBlowjob(enc, enc.female);
				}, enabled : true,
				tooltip : "With a muzzle that long, you bet she could take every inch..."
			});
		}
		
		//[Tailpeg][Leave]
		if(player.sexlevel > 2) {
			options.push({ nameStr : "Tailpeg",
				func : function() {
					Scenes.Lizards.WinTailpeg(enc);
				}, enabled : true,
				tooltip : "Your experience points out a lovely idea. Perhaps her tail could be put to a wonderful use..."
			});
		}
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("You shake your head, looking down at [m1name]. She gazes up at you warily, as if expecting something bad to happen. Lucky for her, you're not in the mood for reptile today.", parse);
				Text.Flush();
				Gui.NextPrompt(enc.finalize);
			}, enabled : true,
			tooltip : "It's tempting, but you have better things to do than teach a reptile her place."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("She's rather pretty. Not in a way that has any impact on you - merely objectively pretty, like any well-built creature might be. Uninterested, you simply claim the spoils of victory and leave her sitting there, watching you go.", parse);
		if(party.Two()) {
			Text.NL();
			Text.Add("[p1name] joins you with a nod.", parse);
		}
		else if(!party.Alone()) {
			Text.NL();
			Text.Add("Your party joins you.", parse);
		}
		Gui.NextPrompt(enc.finalize);
	}
	Text.Flush();
}

Scenes.Lizards.WinTailpeg = function(enc) {
	var enemy = enc.female;
	
	var parse = {
		p1name        : function() { return party.members[1].NameDesc(); },
		cockDesc      : function() { return player.FirstCock().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		armorDesc     : function() { return player.ArmorDesc(); },
		facedesc      : function() { return player.FaceDesc(); },
		ballsDesc     : function() { return player.BallsDesc(); },
		tailDesc      : function() { return player.HasTail().Short(); },
		bellyDesc     : function() { return player.StomachDesc(); },
		breastDesc    : function() { return player.FirstBreastRow().Short(); },
		nipsDesc      : function() { return player.FirstBreastRow().NipsShort(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		m1Name        : function() { return enemy.NameDesc(); },
		m1name        : function() { return enemy.nameDesc(); },
		m1anusDesc    : function() { return enemy.Butt().AnalShort(); },
		m1buttDesc    : function() { return enemy.Butt().Short(); },
		m1multiCockDesc : function() { return enemy.MultiCockDesc(); },
		m1breastDesc  : function() { return enemy.FirstBreastRow().Short(); }
	};
	
	Text.Clear();
	
	Text.Add("You slide forwards, your eyes set on the [m1name]'s tail. A sly thought fills your mind, and the idea sticks firmly. The reptile looks up at you, her eyes uncertain as you approach almost predator-like.", parse);
	if(player.Armor())
		Text.Add(" You slowly remove your [armorDesc], letting it fall to the floor; it would only get in the way now.", parse);
	Text.NL();
	Text.Add("[m1Name] bites her lip as you approach, your", parse);
	if(player.FirstVag())
		Text.Add(" [vagDesc] exposed to the warm air, the breeze sending a gentle thrill through your body.", parse);
	else if(player.FirstCock())
		Text.Add(" slowly hardening [multiCockDesc] twitching to life.", parse);
	else
		Text.Add(" featureless crotch bare to the world.", parse);
	Text.NL();
	Text.Add("You stop just a step shy of her, and she looks up at you from the ground, her oasis-blue eyes locking onto yours. You drop to your hands and knees, your eyes bright as you slide over the top of her. When your hands don't move to her underwear, her expression becomes slightly confused. Your hands meet her legs, her cool scales firm against your fingers. You trail them downwards, letting touch guide your hands to the base of her tail, and then lower...", parse);
	Text.NL();
	Text.Add("[m1Name]'s tail twitches back and forth, flicking in your grip as she leans backwards. Her legs slightly spread, she watches you confusedly, her mind trying to work out just what you intend to do with her. You don't leave her to wait too long, however, as your fingers near her tail's tip. You take a firm hold of it, giving her a teasing smile, before <i>pulling</i> it upwards. The reptile swallows, her eyes widening.", parse);
	Text.NL();
	Text.Add("Bringing her tail up between your legs, ", parse);
	if(player.FirstVag())
		Text.Add("you feel her whip-like, scaled tip brush against your moist [vagDesc].", parse);
	else
		Text.Add("you press her thin, green-yellow scaled tail-tip against your pucker, drawing in a breath.", parse);
	Text.NL();
	parse["sound"] = player.Race() == Race.horse ? "nicker" :
	                 (player.Race() == Race.lizard || player.Race() == Race.dragon) ? "hiss" :
	                 player.Race() == Race.feline ? "purr" :
	                 (player.Race() == Race.dog || player.Race() == Race.wolf || player.Race() == Race.fox) ? "whine" :
	                 "moan";
	Text.Add("[m1Name] tenses, before her eyeridges drop lower in thought. As understanding dawns on her, a sly look passes her muzzle, and she twitches her tail against you. The tip, so very thin, easily slips a half inch inside of you between your fingers, and you feel it wriggle just inside your body. The motion feels strange, but oddly pleasant, and you find yourself holding her tail tight, keeping it from sliding back out from your flesh. You let out a small [sound] of pleasure, and [m1name] grins in satisfaction.", parse);
	player.AddLustFraction(0.1);
	Text.NL();
	Text.Add("Gradually, you begin to feed her tail into your body, ", parse);
	var analVirgin = player.Butt().virgin;
	if(player.FirstVag()) {
		Text.Add("your heated cunt gradually filling with her thickening tail. She twitches it frequently, and you don't tell her to stop; the way it undulates and slithers through your lips sends electric thrills through your body, and you feel your wet mound squeezing tightly around the reptile's tail.", parse);
		Text.NL();
		player.FuckVag(player.FirstVag(), null, 3);
		Sex.Vaginal(enemy, player);
	}
	else {
		Text.Add("your [anusDesc] slowly stretching around it. You lift one hand, licking the palm of it, then bring it back down to lubricate her tail slightly. As you rub your saliva along the length of her scaled tail, it starts to slide in much more easily.", parse);if(player.FirstCock()) {
			parse["itThey"] = player.NumCocks() > 1 ? "they throb" : "it throbs";
			Text.Add(" Her eyes roam hungrily over your [multiCockDesc] as [itThey] to life, beginning to feel much heavier between your legs.", parse);
		}
		Text.NL();
		player.FuckAnal(player.Butt(), null, 3);
		Sex.Anal(enemy, player);
	}
	Text.Add("Thicker and thicker her tail grows, and you feel yourself slowly, achingly stretching to take the growing girth of her tail.", parse);
	Text.NL();
	
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Finally you feel her bottom out inside of you, your entrance feeling wonderfully stretched, her tail twitching now and then within the heated confines of your body. You close your eyes, taking long, slow breaths. It feels almost <i>just</i> like you imagined...", parse);
		Text.NL();
		Text.Add("Suddenly you feel, deep inside your sensitive passage, [m1name]'s tailtip <i>curve</i>. You feel your insides stretch around her as she curls the tip of her tail in a tight bend, and suddenly you can feel her serpentine tail beginning to slither back out of you. As you look down though, you see her buried as deeply in you as before... and you find yourself feeling <i>very</i> much more full. You give a soft groan, ", parse);
		if(player.HasTail())
			Text.Add("your [tailDesc] curling behind you. As you do, you realize...", parse);
		else
			Text.Add("placing one hand on your [bellyDesc].", parse);
		Text.NL();
		Text.Add("She's curling her tail around inside you! You feel your insides beginning to stretch around her tail as she doubles up inside of you, and you clench around her tightly as you can.", parse);
		Text.NL();
		if(player.FirstVag()) {
			Text.Add("You feel the slick lips of your cunt being forced wider and wider as she starts to slide yet more of her tail into you, keeping you completely filled. You spread your legs as wide as you can to try to ease the pressure, but it's no use. You find yourself stretched achingly wide, and feel your vision blur as your pussy squeezes around the lizard's cool, undulating tail.", parse);
			Text.NL();
			Text.Add("[m1Name] seems to be getting decidedly into it, and you feel her start to <i>wriggle</i> her tail inside of you. Like a living, thrashing creature it writhes inside of you, grinding against your heated walls deviously. You feel her whip-like tail-tip tickle spots deep inside of you, and your cunt clamps down around her again. Leaning forwards, you grind yourself on her tail, your cunt stretched wide as it can go...", parse);
			if(player.FirstVag().stretch.Get() < 6) {
				Text.NL();
				Text.Add("...and then she shoves in even <i>more</i>. You cry out in shock as you feel yourself stretch beyond your limits, going cross-eyed.", parse);
				player.FirstVag().stretch.IncreaseStat(6, 2);
				player.AddLustFraction(0.2);
			}
		}
		else {
			Text.Add("You feel her tail sliding deeper into your clenching sphincter, your muscles growing sore as she forces you ever wider. You sit down heavily on her tail, and she responds by stiffening it, making several more inches sink slowly into you. As her tail-tip slides back toward your entrance, you feel it brush your prostate. Though you try, you find yourself unable to stifle the soft yelp of surprise it brings.", parse);
			Text.NL();
			Text.Add("[m1Name] picks up on it immediately, a coy smile on her lips. Wordless as ever, you feel her tail slow, and her tip slither back to brush your prostate again. You fix your gaze on her, and her eyes almost dare you to object. Drawn on by the supple motions of her serpentine tail, you're not sure you want to...", parse);
			Text.NL();
			Text.Add("Suddenly her tail twitches again, and her tip <i>grinds</i> against your prostate. Your eyes widen, and she <i>shoves</i> another four inches of her now painfully thick tail into you. Pleasure blankets out the pain and you spasm on top of her, your [multiCockDesc] throbbing at attention as you press harder against her.", parse);
			if(player.Butt().stretch.Get() < 10) {
				Text.NL();
				Text.Add("You feel your [anusDesc] stretching agonizingly wide, and you know it will be a while before you feel tight again...", parse);
				player.Butt().stretch.IncreaseStat(10, 2);
				player.AddLustFraction(0.2);
			}
		}
	}, function() { return (player.FirstVag() ? (60 + player.FirstVag().stretch.Get() * 5) : (20 + player.Butt().stretch.Get() * 5)) / 100; });
	scenes.AddEnc(function() {
		Text.Add("Slowly she begins to slide it out from your body again. You feel her sinuous tail slithering out, tugging on your ", parse);
		if(player.FirstVag())
			Text.Add("slick cunt as it moves, a slick coating of your fluids on her scales.", parse);
		else
			Text.Add("clenching sphincter as it moves, making it distend outwards as she twitches it inside of you.", parse);
		Text.NL();
		Text.Add("You let your hands come forwards, taking hold of her legs to steady yourself as she slowly pulls her tail out of you... only to push it back in, equally as slow. You feel her tip sliding against your most sensitive spot, and her rough scales grinding across it leave you gasping for breath. She lets out a hiss of delight at the sight of you shuddering.", parse);
	}, function() { return Math.max((player.FirstVag() ? (40 - player.FirstVag().stretch.Get() * 5) : (80 - player.Butt().stretch.Get() * 5)) / 100, 0); });
	
	scenes.Get();
	
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("You feel her gaze on your [multiCockDesc], and realize that you're leaking precum steadily.", parse);
		Text.NL();
		if(player.NumCocks() == 2) {
			Text.Add("A small hunger in her eyes leaves you suddenly wary of her. You see one hand come forwards, reaching for your pair of pulsating dicks. Her tail twitches inside of you, and you feel yourself sliding forwards. Her fingers close around your [multiCockDesc], giving a slow, sensual <i>squeeze.</i> Perhaps two is just the right number for her...", parse);
			Text.NL();
			Text.Add("Slowly she begins to pump her hand up and down your sensitive flesh, squishing your thick shafts against each other, smearing your own precum along your lengths. All too soon though, she lets go, returning to the slow, steady pumps of her tail instead...", parse);
			Text.NL();
		}
	}
	Text.Add("[m1Name] gets an impish twinkle in her eyes, and she presses her tail gently against you. Before you can wonder what she's doing, you feel her entire tail undulate inside of you, rippling through your body. Back and forth it squirms inside you, pressing against your tender flesh. You feel a soft gurgling coming from deep inside you, and her slick tail wriggles in another inch. Your muscles stretch around her, and you bite your lip, your eyes closing.", parse);
	Text.NL();
	Text.Add("[m1Name] sets into a slow, tormenting rhythm, her undulating tail slithering in and out of your body. Each time she draws her sinuous tail out, you feel your body begin to clench... before she <i>rams</i> it back in, sending a jolt through your pelvis as she forces you open again. You rapidly feel yourself approaching your own climax as her wriggling tail teases your most intimate of spots, very deliberately.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		if(player.FirstVag()) {
			Text.Add("In and out her slick, scaly tail slides, driving into your wet cunt like a piston over and over.", parse);
			if(player.HasBalls())
				Text.Add(" Her tail lifts your [ballsDesc] up and out of the way to gain better access to your strained pussy.", parse);
			Text.NL();
			Text.Add("You feel your walls clenching down helplessly, and you find it hard to keep yourself upright on her. Her tail fills you so wonderfully that you find it hard to think straight. Her undulating tip strokes your g-spot, and the base of her thick tail grinds against your pulsing clit. <i>\"That's it, my desert flower,\"</i> she whispers then. Her tail ripples inside of you, and you can't keep back a moan. Your cunt clamps heavily down around her, and she leans forwards.", parse);
			Text.NL();
			if(player.FirstBreastRow().size.Get() > 3)
				Text.Add("Her hands suddenly lift to your [breastDesc], and you feel her cool fingers brush your [nipsDesc]. Her tail twitches inside of you again, and your pussy squeezes it tight, your fluids dripping down her tail. Then her fingers gently take hold of your breasts... and begin to squeeze, lightly tweaking your nipples as her tail keeps you almost docile, speeding toward the edge.", parse);
			Text.NL();
			Text.Add("Suddenly she <i>rams</i> her tail into you, and you feel her deepest inches make a fleshy thump against your cervix. You see double, and your wet pussy squeezes achingly around her undulating tail. You hear a loud moaning, and it takes you a few moments to realize that it's you. You feel your clit throbbing achingly, and feel yourself teetering at the edge. <i>\"Mm... The rewards of victory are yours,\"</i> she whispers. You look at her hungrily... before your hands slide down to her tail, and <i>shove</i> it deeper into you. Her tail-tip curls slightly, and you feel it stroking your g-spot relentlessly. Your eyes widen, and you feel your lips clamp down on her.", parse);
			Text.NL();
			Text.Add("You fall onto her as pleasure rips through your mind, your cunt clenching down powerfully around her tail as it continues undulating and wriggling inside of you. Your hot juices flood your passage, and then splatter out onto her tail, making a mess of her yellow-green scales. She lets out a satisfied hiss as you climax at her touches, flicking her tail deep within you. As your hands hold her tight, you ride her tail like a flexible, living sex toy, pulling the last inch out and cramming it back inside over and over, a moan plastered on your face.", parse);
			Text.NL();
			Text.Add("Harder and harder you ream yourself with her constantly moving tail, your juices gushing from your quivering cunt as your cheeks go dark red. Even when your climax begins to fade, her tail continues wriggling and twitching inside of you, keeping you going, not letting your pleasure end. You feel her tail-tip squirming so deeply inside of you, feel it slowly driving you crazy.", parse);
			Text.NL();
			Text.Add("You hump her tail desperately, trying to extract as much pleasure as physically possible as your cunt ripples around her merciless tail. Your eyes roll back in your head, and you make a wet mess of her for what feels like forever.", parse);
			Text.NL();
			Text.Add("Suddenly her tail drives you to the peak again, and you see white as your slathered cunt clamps down once more, another torrent of your juices pouring over her tail. <i>\"Cum again, my desert rose,\"</i> the lizard whispers as you ride out a second orgasm, your eyes rolling back. Still her tail wriggles, thrusting in and out of you. Her tip grinds your g-spot, and you find yourself drooling. She smirks delightedly, twisting and thrusting her tail inside you until you feel your pussy radiating an agonizing heat. You squeal out helplessly as she makes you cum a third time, impaled on her thick tail.", parse);
			Text.NL();
			Text.Add("Finally, though, you feel your muscles come back under control, feel your wet cunt begin to calm down, even with her tail continuing to flail inside of you.", parse);
		}
		// TODO: Kinda breaks for genderless
		else if(player.FirstCock()) {
			Text.Add("Slowly you feel her slender tail sliding through your heated passage, filling your rear so completely. You close your eyes, feeling your body trembling as she keeps you stretched so wide. The tip of her tail continues grinding against your prostate, twitching and flickering against it with every passing moment, keeping the pressure high.", parse);
			Text.NL();
			Text.Add("You feel your [multiCockDesc] twitching, pulsing in aching need, but the way her tail torments your nerves, simply riding her feels even better.", parse);
			if(!analVirgin)
				Text.Add(" Her tail inside of you feels so much better than the random dicks you've had plunging into you, and your cheeks burn as you grind with her.", parse);
			Text.NL();
			Text.Add("You feel [m1name] drawing her tail slowly, steadily out of you then, letting it slide free from your stretched pucker. You give a soft groan as it wriggles out of you, your eyes widening at just how much was buried deep in your gut. Though you tense your muscles in preparation for what you know is coming, you can't stifle the loud cry that comes as she <i>rams</i> her tail back into you.", parse);
			Text.NL();
			Text.Add("Before you can react beyond a quivering groan, she draws her tail back out... and then thrusts it back inside of you. Her roughly textured tail begins to batter through your entrance, fucking your slicked pucker almost violently. You spasm on top of her, your [multiCockDesc] twitching as you feel yourself begin to drip precum freely.", parse);
			Text.NL();
			Text.Add("For what feels like ages she brutally pumps her tail in and out of you, slowed only by your hands which keep her relatively under control. Finally you feel yourself approaching that plateau of pleasure in a strange way, your untouched [multiCockDesc] pulsing ever more frequently.", parse);
			Text.NL();
			Text.Add("Breathing hard, you grab hold of her tail, drawing it out for a few inches. <i>\"Make me cum,\"</i> you whisper, a simple command, before you <i>shove</i> her tail as deeply into yourself as you can manage. Your muscles burn in protest, but the pleasure rapidly overwhelms it as [m1name] complies.", parse);
			Text.NL();
			Text.Add("Her tail begins to undulate and wriggle inside of you, sliding and grinding against your prostate, massaging and jabbing against it. You feel an almost uncontrollable pressure building up behind your [ballsDesc] as she plays hell with your insides, before finally you can't take it any more.", parse);
			Text.NL();
			Text.Add("The pressure suddenly explodes inside of you, and you see stars in front of your eyes. You feel thick, hot slime pulsing through your [multiCockDesc], splattering out over [m1name]'s breasts, some even hitting her muzzle. Your whole body shakes as you cry out in ecstasy, riding her tail eagerly as it slithers around inside of you. Cumming all over her, you feel yourself clenching down on her tail with reckless abandon, as she gazes hungrily at your throbbing [multiCockDesc].", parse);
			Text.NL();
			Text.Add("Finally you feel yourself beginning to calm down, even as she continues stroking and kneading your prostate. You groan quietly, still drooling cum as her skilled tail-tip forces it from your body.", parse);
		}
		player.AddLustFraction(-1);
		Text.NL();
		Text.Add("Weakly you begin to pull her tail out of your body, sliding it back. Several inches slip free. Then a foot. Then another. Your eyes widen as you realize just how <i>deep</i> she was inside of you.", parse);
		Text.NL();
		Text.Add("Finally you feel her tip sliding free. She wriggles it just slightly, brushing your entrance one last time. You shudder in pleasure, but pull it the rest of the way out.", parse);
		Text.NL();
		Text.Add("You quickly gather your things and the spoils of victory, and cast a look at her. [m1Name] smirks coyly at you, her slick tail twitching in your direction. You blush, and turn away.", parse);
		
		if(party.Two()) {
			Text.NL();
			Text.Add("[p1name] joins you, blushing.", parse);
		}
		else if(!party.Alone()) {
			Text.NL();
			Text.Add("Your party joins you.", parse);
		}
		Text.Flush();
		Gui.NextPrompt(enc.finalize);
	});
}

Scenes.Lizards.WinClaimAss = function(enc, enemy) {
	var parse = {
		p1name        : function() { return party.members[1].NameDesc(); },
		cockDesc      : function() { return player.FirstCock().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		clothesDesc   : function() { return player.ArmorDesc(); },
		facedesc      : function() { return player.FaceDesc(); },
		ballsDesc     : function() { return player.BallsDesc(); },
		armorDesc     : function() { return player.LowerArmorDesc(); },
		m1Name        : function() { return enemy.NameDesc(); },
		m1name        : function() { return enemy.nameDesc(); },
		m1HeShe       : function() { return enemy.HeShe(); },
		m1heshe       : function() { return enemy.heshe(); },
		m1HisHer      : function() { return enemy.HisHer(); },
		m1hisher      : function() { return enemy.hisher(); },
		m1himher      : function() { return enemy.himher(); },
		m1hishers     : function() { return enemy.hishers(); },
		m1anusDesc    : function() { return enemy.Butt().AnalShort(); },
		m1buttDesc    : function() { return enemy.Butt().Short(); },
		m1multiCockDesc : function() { return enemy.MultiCockDesc(); },
		m1breastDesc  : function() { return enemy.FirstBreastRow().Short(); }
	};
	
	Text.Clear();
	
	Text.Add("You can't help but smirk slightly as you step forward, thoughts of just what to do to [m1himher] filling your head. You stop just in front of [m1name], peering down at [m1himher]. [m1HeShe] lifts [m1hisher] head, looking up at you.", parse);
	Text.NL();
	if(Math.random() < 0.8) {
		Text.Add("[m1HeShe] scowls at you, but offers no resistance as you lean forward, pushing [m1himher] over onto the ground. [m1HeShe] struggles weakly when you try to move [m1hisher] legs to expose the underside of [m1hisher] tail, but you ", parse);
		if(player.strength.Get() > enemy.strength.Get() + 20)
			Text.Add("easily overpower [m1himher], revealing [m1hisher] [m1anusDesc], taking hold of [m1hisher] legs by the knees.", parse);
		else if(player.dexterity.Get() > enemy.dexterity.Get() + 20)
			Text.Add("easily outmaneuver [m1himher], leaving [m1himher] startled as you part [m1hisher] stronger legs through sheer skill, taking hold of each one.", parse);
		else
			Text.Add("manage to pry [m1hisher] legs apart, sliding forwards as [m1heshe] grunts indignantly. [m1HisHer] scaled legs are strong in your hands, and it occurs to you that [m1heshe] might simply be going along with it to avoid your wrath.", parse);
	}
	else {
		Text.Add("[m1HeShe] looks down almost shyly and, seeming to realize your intent, slowly lies down on [m1hisher] back, drawing in a deep breath. Idly, you wonder if [m1heshe] might have a preference for this. Sensing it will be easy to put your [multiCockDesc] to good use, you step forwards, grinning at [m1himher]. You take a hold of [m1hisher] legs by the knees, and [m1heshe] gazes at you uncertainly. Pushing [m1hisher] legs further apart, you slide your hips forward, pressing your groin up against [m1name]'s [m1buttDesc]. [m1Name] looks away, [m1hisher] muzzle darkening in a slight blush that sends a delighted thrill down your spine.", parse);
	}
	Text.NL();
	
	if(player.Armor()) {
		Text.Add("You let go of one of [m1hisher] legs and place a hand on the front of your [armorDesc] and pull your [multiCockDesc] out. [m1Name] glances down, [m1hisher] eyes widening slightly as [m1heshe] sees your [multiCockDesc].", parse);
		Text.NL();
		if(enemy.body.Gender() == Gender.male)
			Text.Add("<i>\"You... you aren't gonna...\"</i> he starts, before falling silent, his slitted eyes meeting yours. You smirk at him, and he swallows heavily.", parse);
		else
			Text.Add("<i>\"I hope you know what you're doing there,\"</i> she breathes.", parse);
		Text.NL();
		Text.Add("Before [m1heshe] has a chance to muster up a new wave of energy, you take hold of [m1hisher] legs again by the knees, pushing them up and out of the way.", parse);
		Text.NL();
	}
	
	if(player.NumCocks() > 1)
		Text.Add("You let your [multiCockDesc] press up against [m1hisher] [m1anusDesc], feeling [m1hisher] cool scales against the underside of each of your throbbing cocks. [m1HisHer] eyes widen again, and [m1hisher] claws dig into the ground beneath [m1himher]. You smirk, watching [m1hisher] face in delight, imagining the thoughts [m1heshe] must be having. You'll be sure to give [m1himher] inspiration for many more, as you position your largest, pulsing dick against [m1hisher] tight [m1anusDesc]. [m1HeShe] seems a little small to fit more than one...", parse);
	else
		Text.Add("You let your [cockDesc] flop out onto [m1hisher] [m1buttDesc], watching [m1name]'s face eagerly. [m1HeShe] looks away, breathing deeply, claws clutching at the ground beneath [m1himher]. [m1Name]'s tail flicks back and forth under you, and you feel [m1himher] clench [m1hisher] jaws in anticipation.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		
		Text.Add("You grind the tip of your slowly oozing cock against [m1hisher] pucker, smearing it with your precum, ensuring that it's nice and slick. [m1Name] grunts, looking away and closing [m1hisher] eyes. Underneath you, [m1hisher] tail twitches uneasily. You contemplate toying with [m1himher] a little longer, but decide that [m1heshe]'s had enough – and you don't want to wait anymore.", parse);
		Text.NL();
		Text.Add("With a powerful heave, you <i>shove</i> [m1hisher] legs wider apart, making [m1hisher] muscles strain. [m1HeShe] cries out just as you thrust your hips forward, the tip of your dick pushing hard against [m1hisher] tight ring of muscles. The pressure builds quickly, before [m1hisher] [m1anusDesc] can't take it any more. <i>\"Oh, gods, s-stop!\"</i> [m1heshe] cries, muscles tensing. [m1HisHer] sphincter gives way, and you feel your [cockDesc] suddenly sink several inches into [m1himher], the warmth of [m1hisher] body gripping your shaft tightly.", parse);
		Text.NL();
		Text.Add("[m1HisHer] insides feel much hotter than [m1hisher] cool scales, and after the initial thrust, you start to push into [m1himher] much more slowly to simply enjoy the feeling of [m1hisher] warm passage rippling around you. [m1HisHer] strong jaws open and [m1heshe] lets out a soft groan, [m1hisher] legs trying to close.", parse);
		Text.NL();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("Your grip is too strong and your arms overpower [m1hisher] muscles, weakened by the combat, and you simply go on with a broad smile. You slide your shaft back out, feeling [m1hisher] [m1anusDesc] try to hold you tighter. Helpless under your touches, the reptile claws at the earth, a soft groan passing [m1hisher] muzzle. In and out you thrust, burying your [cockDesc] a little deeper with each buck, working yourself steadily deeper to [m1hisher] squirming body.", parse);
			Text.NL();
			Text.Add("Finally you draw your dripping dick back, only to <i>slam</i> it into [m1himher], your groin mashing up to [m1hisher] [m1anusDesc]. Your tip sinks deep into [m1himher], and [m1hisher] jaws snap open wide in a breathless moan.", parse);
			Text.NL();
			if(enemy.body.Gender() == Gender.male)
				Text.Add("He lets out a loud, hissing groan, his pair of throbbing dicks pulsing at attention.", parse);
		}, function() { return Math.min((50 + player.strength.Get() - enemy.strength.Get()) / 100, 0.95); });
		scenes.AddEnc(function() {
			Text.Add("You're startled by the sheer force of [m1hisher] legs, and they quickly overpower your arms, closing behind your back. Your body lurches toward [m1himher] and you stumble, falling forward. Your entire [cockDesc] hammers into [m1hisher] body, and the reptile's eyes snap wide open. <i>\"Aah!\"</i> [m1heshe] hisses, [m1hisher] entire body tensing. It only grips your [cockDesc] tighter, and you struggle to suppress a moan. You land on [m1hisher] stomach ", parse);
			if(enemy.body.Gender() == Gender.male)
				Text.Add("and feel his own [m1multiCockDesc] press against your belly.", parse);
			else
				Text.Add("and feel her [m1breastDesc] press against your [facedesc].", parse);
			Text.NL();
			Text.Add("You let out a grunt, quickly pressing yourself back upright, drawing your cock out as much as [m1hisher] legs allow...", parse);
		}, function() { return Math.max((50 - player.strength.Get() + enemy.strength.Get()) / 100, 0.05); });
		scenes.Get();
		
		Text.NL();
		Text.Add("Slowly you work yourself deep inside of [m1himher], humping [m1hisher] tight, reptilian rear", parse);
		if(player.HasBalls())
			Text.Add(", your [ballsDesc] dragging back and forth across [m1hisher] tail", parse);
		Text.Add(" as you let out a soft groan of your own. Before long you feel your climax growing closer, and your thrusts start to grow slower, more powerful. Finally, with one heavy <i>shove</i>, you bury your pulsing, heavy dick deep into [m1hisher] clamping sphincter. You feel your cum surging through your shaft, and grin as you feel your seed pumping deep into [m1hisher] body.", parse);
		Text.NL();
		Text.Add("<i>\"Are you- oh, <b>oh</b>!\"</i> [m1heshe] groans out, muzzle blushing a bright red.", parse);
		Text.NL();
		if(enemy.body.Gender() == Gender.male && Math.random() < (10 + player.stamina.Get()/2) / 100) {
			Text.Add("Your heavy bucks seem to have been enough to tip [m1name] over the edge as well, and he lets out a long, aching <i>groan</i>. You see his own [m1multiCockDesc] throbbing heavily and feel his [m1anusDesc] practically <i>milking</i> you of your spunk. You aim his dicks up at his chest, and watch delightedly as he sends rope after rope of his cum all over his chest, painting himself a sticky white.", parse);
			Text.NL();
		}
		
		var expMult = 3;
		if(enemy.Butt().virgin) expMult *= 3;
		player.AddLustFraction(-1);
		player.Fuck(player.FirstCock(), expMult);
		Sex.Anal(player, enemy);
		
		Text.Add("Finally spent, you slowly pull your [cockDesc] from [m1hisher] body, letting one last dribble of cum smear across [m1hisher] pucker. You slide out from between [m1hisher] legs, gathering your things. [m1Name] lets out a weak groan, laying there in the dirt, traces of your cum oozing from [m1hisher] body. Claiming your spoils, you turn to leave.", parse);
		if(party.Two()) {
			Text.NL();
			Text.Add("[p1name] joins you with a nod.", parse);
		}
		else if(!party.Alone()) {
			Text.NL();
			Text.Add("Your party joins you.", parse);
		}
		Text.Flush();
		
		Gui.NextPrompt(enc.finalize);
	});
}

Scenes.Lizards.WinBlowjob = function(enc, enemy) {
	var parse = {
		p1name        : function() { return party.members[1].NameDesc(); },
		cockDesc      : function() { return player.FirstCock().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		clothesDesc   : function() { return player.ArmorDesc(); },
		m1multiCockDesc : function() { return enemy.MultiCockDesc(); },
		m1Name        : function() { return enemy.NameDesc(); },
		m1name        : function() { return enemy.nameDesc(); },
		m1HeShe       : function() { return enemy.HeShe(); },
		m1heshe       : function() { return enemy.heshe(); },
		m1HisHer      : function() { return enemy.HisHer(); },
		m1hisher      : function() { return enemy.hisher(); },
		m1himher      : function() { return enemy.himher(); },
		m1hishers     : function() { return enemy.hishers(); }
	};
	
	Text.Clear();
	
	Text.Add("You look down at [m1name] again, feeling yourself pulsing to arousal. Luckily, there's a warm muzzle to take care of that... You smirk down at [m1himher], stepping forwards.", parse);
	if(player.Armor())
		Text.Add(" Tugging down the front of your [clothesDesc] to expose your [multiCockDesc], you let yourself swell to full hardness.", parse);
	Text.NL();
	Text.Add("Reaching down, you cup [m1hisher] muzzle, tilting it up to look at you. [m1HeShe] blushes slightly, [m1hisher] slitted, golden eyes looking away. Without another word, you push ", parse);
	if(player.NumCocks() > 1)
		Text.Add("your largest, thick shaft ", parse);
	else
		Text.Add("your thick [cockDesc] ", parse);
	Text.Add("to [m1hisher] lips, looking expectantly down at [m1himher]. <i>\"Open up,\"</i> you murmur. [m1HeShe] closes [m1hisher] eyes, taking a slow, deep breath that brushes softly across your [multiCockDesc]. [m1Name] slowly, hesitantly opens [m1hisher] jaws just enough for your heavy [cockDesc] to slide forwards... and you do.", parse);
	Text.NL();
	Text.Add("Your pulsing, heated dick slides forwards into the reptile's waiting jaws, and [m1heshe] swallows uncertainly. The feeling of [m1hisher] mouth constricting around your [cockDesc] feels wonderfully warm and wet, and you realize that [m1heshe] is covering [m1hisher] sharp teeth with [m1hisher] scaled lips.", parse);
	Text.NL();
	Text.Add("Quickly you push into [m1hisher] hungry muzzle, angling for the back of [m1hisher] throat.", parse);
	if(player.FirstCock().length.Get() > 20) {
		Text.Add(" [m1HisHer] eyes widen as it slides all the way to the back of [m1hisher] forked tongue, squishing up against [m1hisher] throat. You can feel it squeezing your [cockDesc] wetly, a slick tunnel just waiting to be taken. ", parse);
		if(player.FirstCock().length.Get() > 30)
			Text.Add("With great delight, you push even further forwards. [m1Name] lets out a startled whimper as you quickly fill [m1hisher] throat, making it stretch around your [cockDesc]. The tight feeling of [m1hisher] wet throat hugs your fleshy [cockDesc], and you find yourself rapidly humping into [m1hisher].", parse);
		else
			Text.Add("You can't quite reach though, your [cockDesc] being just a little too short. [m1Name] seems relieved.", parse);
	}
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		
		Text.Add("Soon you settle into a rhythm of drawing your [cockDesc] back, feeling [m1hisher] lips massaging and squeezing your thick shaft. [m1HisHer] tongue curls around your dick, and guides your slick cock deeper into [m1hisher] muzzle. For what seems like ages you stand there, watching [m1hisher] face as [m1heshe] suckles and nurses on your [cockDesc]. Now and then [m1heshe] glances up to meet your gaze, only to blush deeply as [m1heshe] realizes [m1heshe]'s been caught. You smirk at how much [m1heshe] seems to be secretly enjoying it.", parse);
		Text.NL();
		Text.Add("Finally, you feel yourself building up to the edge. You reach forwards, your hand quickly wrapping around one of [m1hisher] horns and <i>pull</i> [m1hisher] head forward onto your throbbing dick. [m1HisHer] eyes widen, and you feel the pressure in your groin break, a torrent of your seed pumping through your [cockDesc] and down [m1hisher] throat. The reptile's cheeks bulge as you blast your cum across [m1hisher] mouth.", parse);
		Text.NL();
		parse["s"] = player.NumCocks() > 2 ? "s" : "";
		if(player.NumCocks() > 1) {
			Text.Add("At the same time, your sticky seed spurts out across [m1hisher] face from your other pulsing shaft[s], and [m1heshe] has to close one eye.", parse);
			Text.NL();
		}
		parse["boygirl"] = enemy.body.Gender() == Gender.male ? "boy" : "girl";
		Text.Add("When your orgasm tapers down, the last vestibules of your spunk dripping through the tip of your cockDesc], you gaze down at [m1name], your cheeks flush with the afterglow of climax. <i>\"Swallow,\"</i> you order. [m1HeShe] pauses, looking up at you meekly. [m1HisHer] tail flicks in indecision behind [m1himher], before [m1heshe] takes a heavy <i>gulp</i>. You pat [m1hisher] muzzle. <i>\"Good [boygirl],\"</i> you mutter, pulling your dick from [m1hisher] muzzle. You take the spoils of the encounter, and turn to leave without another word, your pleasure taken.", parse);
		
		player.Fuck(player.FirstCock(), 2);
		Sex.Blowjob(enemy, player);
		
		player.AddLustFraction(-1);
		Gui.NextPrompt(enc.finalize);
		
		Text.Flush();
	});
}

Scenes.Lizards.WinPowerbottom = function(enc) {
	var enemy = enc.male;
	
	var parse = {
		p1name        : function() { return party.members[1].NameDesc(); },
		cockDesc      : function() { return player.FirstCock().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		buttDesc      : function() { return player.Butt().Short(); },
		clothesDesc   : function() { return player.ArmorDesc(); },
		feetDesc      : function() { return player.FeetDesc(); },
		faceDesc      : function() { return player.FaceDesc(); },
		skinDesc      : function() { return player.SkinDesc(); },
		m1cockDesc    : function() { return enemy.FirstCock().Short(); },
		m1multiCockDesc : function() { return enemy.MultiCockDesc(); },
		m1Name        : function() { return enemy.NameDesc(); },
		m1name        : function() { return enemy.nameDesc(); },
		m1anusDesc    : function() { return enemy.Butt().AnalShort(); },
		m1buttDesc    : function() { return enemy.Butt().Short(); },
		m1faceDesc    : function() { return enemy.FaceDesc(); }
	};
	
	Text.Clear();
	
	Text.Add("Your eyes drop to the reptile's groin, and you give him a broad grin. You step up to him, pushing a hand to his snout. <i>\"Lay down,\"</i> you instruct. He looks questioningly at you, but you ignore him. He's not the one who won, after all. After a moment of hesitation, he slowly lays down on his back. His legs cross just enough to cover his [m1anusDesc] from you. You smirk, finding it cute that the bulky male fears you might do something like that to him.", parse);
	Text.NL();
	if(!player.FirstCock()) {
		Text.Add("You're not even really sure what you'd do.", parse);
		Text.NL();
	}
	Text.Add("Stepping up to him, you kneel, inspecting his body. His scaled underbelly shows strongly packed muscle, barely an inch of fat on him. His arms are thick and powerful, and his strong, angular face gazes at you in uneasy curiosity. You slide forwards, and place a single finger on the faint outline of his genital slit, pressing slightly. <i>\"Get hard,\"</i> you command, dragging your finger down.", parse);
	Text.NL();
	Text.Add("[m1Name] looks at you in surprise, but makes no objection. You watch as he quickly gets himself ready, his fingers beginning to massage his slit. In short order his pair of thick, bulbous shafts push out from his slit, throbbing into the air as they grow to an almost obscene length. You swallow, imagining just what it will be like to have one moving inside you.", parse);
	
	//[Sure][Nah]
	var options = new Array();
	if(player.FirstVag()) {
		options.push({ nameStr : "Cunt",
			func : function() {
				Text.Clear();
				Text.Add("Slowly you inch forwards, moving until your rump is poised just over his slimier looking shaft, your aching cunt hovering above his reptilian, bulbous tip. He looks at you in excitement, seeming to have realized that he won't be abused today. His hand raise to help steady your hips, and you let him. Feeling his strong, scaled hands on your hips, you slowly begin to lower yourself, feeling his slick, heavy [m1cockDesc] meet the outer folds of your wet [vagDesc].", parse);
				Text.NL();
				Text.Add("You let gravity help you, and his strong hands. The pressure builds at your entrance, before you hear him let out a hiss. At the same time, his fat, hot tip pushes past the lips of your cunt, and you feel him throb powerfully inside of you. He tries to pull you down further onto his dick, but your hands grab a hold of his warningly. [m1Name] stops, seeming slightly sullen. Too bad, you think. This is <i>your</i> victory.", parse);
				Text.NL();
				Text.Add("Feeling him pulse inside of you feels exquisite. Slowly you slide further down onto him, letting inch after aching inch sink into your heated body. His slimy cock fills you quickly, and you can feel his ridges and supple bulges grinding against your folds. He feels so very hot inside of you.", parse);
				Text.NL();
				Text.Add("Quickly you feel your hips meet his, his second dick sliding up between your legs.", parse);
				if(player.FirstCock())
					Text.Add(" You playfully grind it against your own, leaving him moaning softly.", parse);
				Text.Add(" Back and forth you rock, his hands around your hips helping you both move to a steady rhythm. Before long you're both moaning softly, your cheeks red as he slides deeply inside of you.", parse);
				Text.NL();
				Text.Flush();
				
				var racescore   = new RaceScore(player.body);
				var lizardScore = new RaceScore();
				lizardScore.score[Race.lizard] = 1;
				var compScore   = racescore.Compare(lizardScore);
				
				if(compScore > 0.2) {
					Text.Add("You find yourself imagining [m1name]'s seed filling your womb... Forming eggs, laying egg after egg for the strong, reptilian warrior underneath you. You blush as the fantasies that seem only half-alien fill your mind. The thought of being seeded by such a strong, handsome male...", parse);
					
					//[Sure][Nah]
					var options = new Array();
					options.push({ nameStr : "Yes!",
						func : function() {
							Text.Clear();
							Text.Add("You grin at the reptile under you. He grins back at you, his slitted eyes watching yours. You quickly get into it, riding him steadily, grinding your heated mound against his thick [m1cockDesc]. He groans softly, his voice a sibilant hiss, and his hold tightens on your waist. You both want the same thing though, now, and soon you're each moving in unison.", parse);
							Text.NL();
							Text.Add("He presses his bulbous, fat dick deep into your body, slick fluids smearing over your clenching, rippling walls right as you push down, your body pleading for him to take you deeper. You can feel your climax closing in, and know that his won't be far away. Having his thick, custard-like spunk filling your insides as his second coats your groin sends a deeper thrill through your body than you care to admit.", parse);
							Text.NL();
							Text.Add("You moan eagerly, and he joins you with a hissed groan of passion.", parse);
							Text.NL();
							Text.Add("Finally, you feel your own climax hitting like a wave, washing through your very being. Your cunt starts to clamp down on his thick shaft, and you lean forwards, placing your hands on his chest and moaning needily. The act seems to be just enough to push him over the edge, too. Your hot, slick [vagDesc] clamps down rhythmically around his heavy shaft as it spasms as well, the two of you almost synchronizing as you sit, impaled on his dick.", parse);
							Text.NL();
							Text.Add("Thick, sticky sperm floods your passage as his other dick sprays it across your groin, while your own juices gush out around his cock, bathing his groin in your essence.", parse);
							Text.NL();
							Text.Add("After a long minute spent there, connected to each other at the hip, you come to your senses enough to pull off of him. He lets you go, watching you in a happy daze, your belly bulging slightly from the sheer volume of his spunk.", parse);
							Text.NL();
							Text.Add("You gather up your things, claiming your fair share from the battle, before slowly heading away.", parse);
							Text.NL();
							if(!party.Alone()) {
								parse["comp"] = party.Two() ? "companion" : "party";
								Text.Add("Your [comp] joins you, looking at you a little strangely.", parse);
							}
							Text.Flush();
							
							player.FuckVag(player.FirstVag(), enemy.FirstCock(), 4);
							Sex.Vaginal(enemy, player);
							
							player.AddLustFraction(-1);
							Gui.NextPrompt(enc.finalize);
						}, enabled : true,
						tooltip : "Being egg-heavy to a virile male like this one sounds perfect."
					});
					options.push({ nameStr : "No",
						func : function() {
							Text.Clear();
							Text.Add("The thought of having the lizard under you actually <i>breed</i> with you, though, is not an attractive one. He's not even close to your species. They rape enough, they can live without tainting your womb, too.", parse);
							Text.NL();
							Scenes.Lizards.WinPowerbottomDeny(enc);
						}, enabled : true,
						tooltip : "He seems handsome, but you don't want to <i>breed</i> with him..."
					});
					Gui.SetButtonsFromList(options);
				}
				else {
					Gui.NextPrompt(function() {
						Text.Clear();
						Scenes.Lizards.WinPowerbottomDeny(enc);
					});
				}
			}, enabled : true,
			tooltip : "Just thinking about that thick, ridged slab of meat between your lower lips has you wet..."
		});
	}
	options.push({ nameStr : "Ass",
		func : function() {
			Text.Clear();
			Text.Add("Slowly inching forwards, you let yourself hover just over his pair of serpentine pricks. He watches you intently, his eyes glinting. You simply look down at his powerful chest, taking a deep breath. His hands lift, coming to your hips, and you feel them take hold of you. Knowing how quickly he'll slam you down onto his slimy dicks if you let him get a good grip, you push his hands away. He'll get what he wants soon enough – on <i>your</i> time.", parse);
			Text.NL();
			Text.Add("You let out a soft breath, closing your eyes.", parse);
			Text.NL();
			if(player.FirstVag()) {
				Text.Add("Your moist cunt aches to be filled, but you want to scratch a different itch with the yellow-green reptile under you. Another reason not to let him hold your hips; he'd breed you til you blacked out if he got control, most likely.", parse);
				Text.NL();
				player.AddLustFraction(0.1);
			}
			Text.Add("Slowly you begin to lower yourself downwards, feeling his slippery, pulsing dicks press against your [buttDesc]. He lets out a hiss of breath as you feel his twin, spaded tips slide between your cheeks, squeezing them between your [buttDesc] teasingly. [m1Name] gazes steadily at you, his slitted eyes caught somewhere between being excited and frustrated.", parse);
			Text.NL();
			if(player.Butt().stretch.Get() > 5) {
				Text.Add("You decide to give him a real treat this time. Just one can't satisfy your loose hole, and you need more... and luckily for the both of you, [m1name] can accommodate. You lower yourself down, and feel his twin tips slip toward your [anusDesc]. They slip away, and you reach back with one hand. You squeeze his dicks together, and he hisses in surprise.", parse);
				Text.NL();
				Text.Add("<i>\"Careful,\"</i> he hisses. You smirk, angling him upwards, his ridged, fleshy shafts pulsing in your grip. You sit downwards, and feel his two slimy, wet tips push against your sphincter. Relaxing all of your muscles, you slowly sit down, your [feetDesc] gripping the ground on either side of his hips.", parse);
				Text.NL();
				
				player.FuckAnal(player.Butt(), enemy.FirstCock(), 2);
				Sex.Anal(enemy, player);
				
				Text.Add("The reptile's eyes widen, and he scratches at the ground as your [buttDesc] sinks down onto both of his slimy dicks at once. You can feel his immense girth stretching you <b>wide</b> open, the flexing shafts tugging at your hole with surprising strength. You can feel him flexing them both eagerly inside of you, his face quickly melting into a mask of ecstasy. <i>\"O-oh... Ah...\"</i> he whispers. You clench down <i>hard</i>, and his eyes cross as his [m1multiCockDesc] squish against each other.", parse);
				if(player.Butt().stretch.Get() > 10) {
					Text.NL();
					Text.Add("You feel your body stretching slowly around him, his twin lengths almost painfully large inside of you.", parse);
					player.Butt().stretch.IncreaseStat(10, 1);
				}
				
				player.AddLustFraction(0.2);
			}
			else {
				Text.Add("You reach back with one hand, taking hold of his twinned dicks. The look in his eyes tells you all you need to know; he might well try to thrust both into you at once, and you know how painful that would be...", parse);
				Text.NL();
				Text.Add("He lets out a hiss as you aim one away from yourself, but as his second slick, hot shaft meets your [anusDesc] that hiss melts into a croon. He bucks gently against you, but you’re ready for it, quickly rising. His yellow-green muzzle contorts in impatience. You smirk at how eager he is, so soon after being beaten.", parse);
				Text.NL();
				Text.Add("You steady yourself, feeling your tight pucker squeeze against the tip of his slimy pole. A gentle pulse, and you feel a small gush of precum ooze against your entrance, leaving a blush on your cheeks. Slowly you lower yourself, letting the pressure build against your flesh as his fat, oozing dick presses against you. After what feels like an hour of slow, aching buildup, you feel your tight ring stretch around his slippery, bulbous tip. Two inches sink into you, making your muscles burn... but the burn is worth it.", parse);
				Text.NL();
				
				player.FuckAnal(player.Butt(), enemy.FirstCock(), 4);
				Sex.Anal(enemy, player);
				
				Text.Add("<i>\"You’re so <b>tight</b>,\"</i> [m1name] hisses, his eyes lidding over. He bucks his hips again, and this time you find yourself unable to keep him out. Nearly half of his throbbing flesh sinks into you, ramming into your prostate. You moan softly yourself, clenching <i>hard</i> around him.", parse);
				Text.NL();
				if(player.FirstCock()) {
					if(player.NumCocks() > 1)
						Text.Add("Your own [multiCockDesc] jump to life, throbbing together, bumping against each other.", parse);
					else
						Text.Add("Your own [cockDesc] throbs at attention, a bead of precum already drooling from your tip.", parse);
					Text.NL();
				}
				if(player.FirstVag()) {
					if(player.libido.Get() > 40)
						Text.Add("Your slick [vagDesc] ripples around empty space, already feeling moist, your body eager for things to come.", parse);
					else
						Text.Add("Your [vagDesc] grows warmer, and you blush from the new sensation in your [buttDesc].", parse);
					Text.NL();
				}
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				if(player.LustLevel() > 0.75) {
					Text.Add("Slowly you let gravity force you downwards, feeling as inch after inch of his flesh slides into your body. His hands again come to your hips.", parse);
					Text.NL();
					Text.Add("You move to brush them away again, but pause... The look on his face is one of mounting bliss, and the pleasure that courses through your body has your veins aflame with need. You'll never be taken as hard as if you let him take you – but maybe that's a good thing...", parse);
					Text.Flush();
					
					//[Sure][Nah]
					var options = new Array();
					options.push({ nameStr : "Let him",
						func : function() {
							Text.NL();
							Text.Add("In the end, your lust wins out, and you let his claws take a grip of your hips. A broad, lusty smirk crosses his muzzle.", parse);
							Text.NL();
							Text.Add("<i>\"You want it,\"</i> he accuses. You just grin at him, licking your lips. His hands move back further, cupping your cheeks. You feel his scaled hands knead your body, squeezing tightly. His grip hurts, and you reach back to silently tell him to ease up.", parse);
							Text.NL();
							Text.Add("His hands are strong as steel though, and he holds you tightly.", parse);
							Text.NL();
							if(player.Butt().stretch.Get() > 5) {
								Text.Add("<i>\"Not many can fit both in one hole... Mmm...\"</i> his sibilant whispers come. You swallow.", parse);
							}
							else {
								Text.Add("His second dick bumps against your warm rump, and you feel his slimy precum smearing against you.", parse);
								Text.NL();
								Text.Add("<i>\"If only you coulda fitted both,\"</i> he rumbles, his eyes half lidded.", parse);
							}
							Text.NL();
								
							if(player.FirstCock()) {
								Text.Add("You feel your [multiCockDesc] jump, and precum dribbles freely. The lizard smirks at the way your own arousal shows. <i>\"Let's go faster,\"</i> he hisses amusedly.", parse);
								Text.NL();
							}
							if(player.FirstVag()) {
								Text.Add("You feel your [vagDesc] dripping, and heat rises in your cheeks. He smirks up at you, his hands groping your [buttDesc] eagerly, his fingers cool on your [skinDesc].", parse);
								Text.NL();
							}
							Text.Add("Suddenly his grip tightens, and you feel his claws draw blood. You grimace in surprise at the same time as he <i>slams</i> your body downwards.", parse);
							Text.NL();
							player.AddLustFraction(-0.05);
							Text.Add("A heavy pressure fills your body, and your [anusDesc] stretches painfully and quickly. Your eyes go wide and you feel the air burst out from your lungs as his fat, slimy ", parse);
							Text.NL();
							if(player.Butt().stretch.Get() > 5)
								Text.Add("dicks both slide deeper into you in the span of a half second. Your cheeks redden, and you feel your entire body filled with his dual dicks.", parse);
							else
								Text.Add("cock sinks deeper and deeper into your clenching hole within a second. You feel your cheeks burning as he fills you.", parse);
							Text.NL();
							Text.Add("A loud hiss of pleasure escapes his muzzle as you feel your [buttDesc] press up to his slit, and with a dull ache that spreads through your rump, you realize that he's hilted in you.", parse);
							Text.NL();
							if(player.Butt().stretch.Get() > 5)
								Text.Add("His fingers squeeze your [buttDesc] tighter, kneading your cheeks like dough as his nostrils flare. You feel yourself lifted upwards, and his ridged, bulbous cocks slip back out from your loose hole. <i>\"Oh yessss... So good,\"</i> he hisses, his eyes halfway closing.", parse);
							else
								Text.Add("You feel him groping your [buttDesc] in his powerful hands, his breathing coming raggedly as he lifts you up again, tugging his dripping length out of your body. His eyes open again and he gives a lascivious grin, licking his lips.", parse);
							Text.NL();
							Text.Add("Finally he lets go of your sore, abused cheeks with one hand, and you feel yourself begin to slide down. You take a sharp breath to fill your empty lungs, only to have it robbed from you as firm scales <i>smack</i> your tender ass. Stars burst in front of your eyes as his hand impacts your ass again... And then again, and again. He grins broadly as you let out a gasp.", parse);
							Text.NL();
							if(player.body.Gender() == Gender.female) {
								Text.Add("Despite yourself, you feel your wet cunt growing only more heated as he works your back passage, and the wet dripping from your lips onto his groin seems to fuel his mood further...", parse);
							}
							else {
								Text.Add("Despite yourself, you feel your ", parse);
								if(player.NumCocks() > 1) {
									parse["s"] = player.Butt().stretch.Get() > 5 ? "s" : "";
									Text.Add("dicks throbbing at aching attention, and can feel [m1name]'s fat dick[s] mashing against your prostate.", parse);
								}
								else {
									Text.Add("[cockDesc] throbbing at aching attention, dripping slowly onto the reptile's stomach. ", parse);
									if(player.Butt().stretch.Get() > 5)
										Text.Add("His dual cocks mash up against your prostate, sending electric tingles through your entire body.", parse);
									else
										Text.Add("[m1Name]’s heavy shaft throbs inside you, its brother pushing against your [buttDesc].", parse);
								}
								Text.NL();
								if(player.Butt().stretch.Get() > 5)
									Text.Add("As those ridged, slick appendages squish ", parse);
								else
									Text.Add("As his ridged, slimy prick squishes up ", parse);
								
								Text.Add("against your sensitive spot, your cheeks grow a darker shade of red and you feel precum forced up and through your [multiCockDesc]. [m1Name] smirks as it drips from your body, and you can't completely suppress a moan as he <i>rams</i> himself against your prostate again.", parse);
							}
							Text.NL();
							Text.Add("Up and down he lifts you and pulls you down, forcing his ", parse);
							if(player.Butt().stretch.Get() > 5)
								Text.Add("[m1multiCockDesc] through your achingly stretched [anusDesc]. You can hear wet, fleshy noises as he squeezes his throbbing dicks between your sore cheeks again.", parse);
							else
								Text.Add("slimy, wet meat through your increasingly sloppier [anusDesc]. You can feel your clenches growing weaker, feel it becoming increasingly difficult to keep him out as his bulbous ridges and strangely textured rod slides in and out of your aching hole.", parse);
							Text.NL();
							Text.Add("For what seems like ages he drives into you, hoisting you up until less than an inch remains, leaving just his spaded, slick ", parse);
							if(player.Butt().stretch.Get() > 5)
								Text.Add("tips inside of you, only for his tightly gripping claws to shove you down to the base of his throbbing spires. With his heavy shafts pulsating inside of you, you find yourself unable to hold back a quiet moan. [m1Name] smirks, grinding his hips against your [buttDesc]", parse);
							else
								Text.Add("tip lodged inside of your squeezable, [buttDesc]. His claws hold you tightly and you feel him suddenly wrenching you downwards, burying his shaft in your soft insides. Grinning in satisfaction, he grinds his groin against your [buttDesc]", parse);
							if(player.FirstCock()) {
								if(player.Butt().stretch.Get() > 5)
									Text.Add(", his [m1multiCockDesc]", parse);
								else
									Text.Add(", his slimy flesh", parse);
								Text.Add(" pressing mercilessly against your prostate. Your moans turn higher still. As he bounces you up and down in his lap, you can feel a steady pressure growing in your body, an aching heat that you realize is only growing harder to resist. Your feel your [multiCockDesc] twitch, and a steady stream of precum oozing through your urethra leaves you blushing.", parse);
								player.AddLustFraction(0.1);
							}
							else
								Text.Add(".", parse);
							Text.Flush();
							
							Gui.NextPrompt(function() {
								Text.Clear();
								if(player.Butt().stretch.Get() > 5) {
									Text.Add("With one great <i>heave</i>, he shoves you upwards, and you feel your [anusDesc] clench down around his pulsating tips. Even as they begin to twitch, you know what's coming. You relax your loose entrance as much as you can, right as you feel his firm hands pull you downwards. At the same time, he bucks his hips upwards, plunging himself into you one last time. Ridge after firm, fleshy ridge sinks into your body, and you feel his spaded tips sink deep into you, stretching your insides until they ache.", parse);
									Text.NL();
									Text.Add("His [m1multiCockDesc] spasm and pulse inside of you, and his hands squeeze your taut rump tightly.", parse);
								}
								else {
									Text.Add("[m1Name] squeezes you tightly, his powerful hands pressing in around you. His scales feel rough as he <i>shoves</i> you upwards. You feel your tight pucker clench down around his tip, trying to keep his slippery, bulbous flesh inside of you. His throbbing, spongy shaft twitches inside of you, its brother sliding wetly against your rump, slathered in his precum. His hands pull you downwards as his hips piston upwards, the reptile burying himself in you one more time. Hard, supple ridges plow into your body, making your muscles spasm.", parse);
									Text.NL();
									Text.Add("You feel both his heated dicks begin to twitch and pulse wildly, and his eyes lose focus.", parse);
								}
								Text.NL();
								Text.Add("<i>\"A-ah... Yessssss!\"</i> he hisses, his right leg kicking, making you bounce up and down in his lap.", parse);
								Text.NL();
								
								var scenes = new EncounterTable();
								scenes.AddEnc(function() {
									if(player.FirstCock()) {
										parse["s"] = player.Butt().stretch.Get() > 5 ? "s" : "";
										parse["notS"] = player.Butt().stretch.Get() > 5 ? "" : "s";
										Text.Add("As his fat, slimy tip[s] hammer[notS] against your prostate, you feel yourself clenching tighter and tighter, your whole body locking up.", parse);
										Text.NL();
									}
									Text.Add("The feeling of him sliding in and out of your body grows harder and harder to ignore, and the lizard's every thrust and hump makes your [anusDesc] <i>stretch</i> around his fat ridges. Faster and faster he rails you, until you can't hold it in anymore. You feel your head fall back, the sky looming above you, and you <i>howl</i> out as your slick hole clenches around [m1name]. You can feel the tubes running down the underside of his twin cocks bulge heavily, his potent, sticky cum quickly pumping through them and directly into ", parse);
									if(player.Butt().stretch.Get() <= 5)
										Text.Add("and onto ", parse);
									Text.Add("your body.", parse);
									Text.NL();
									Text.Add("[m1Name]'s eyes roll back in his head as he rocks with you, and you feel your already full hole flooding with hot, reptilian cum.", parse);
									Text.NL();
									if(player.Butt().stretch.Get() > 5)
										Text.Add("Through both of his fat, bulbous dicks he fills you scarily quickly, and you feel it pushing deeper into your body with fleshy, grumbling noises centered on your gut. Viscous slime gushes out from your [anusDesc] in spurts as he overfills you, and his constant thrusting smears it all over your [buttDesc].", parse);
									else
										Text.Add("His heavy dick pumps thick, sticky gouts of reptilian slime into your gut, filling you with a deep seated heat. You feel [m1name]’s second dick throbbing and jumping between your cheeks, painting your [buttDesc] with virile, gooey spunk; you feel it dripping slowly down your flesh.", parse);
									Text.NL();
									if(player.FirstVag()) {
										Text.Add("Your slick [vagDesc] spasms wildly, and you feel your legs give out from under you. As [m1name] turns your [anusDesc] shamefully messy, pleasure swamps your mind and you do the same to your [vagDesc].", parse);
										Text.NL();
									}
									if(player.FirstCock()) {
										Text.Add("At the same time, you feel thick ropes of your own seed erupting from your [multiCockDesc], splattering messily across [m1name]'s belly scales.", parse);
										Text.NL();
									}
									Text.Add("He holds you there as you both climax, bucking his hips up and into you from below, pumping his sticky slime deeper into your body and letting it drool from your sloppy hole. You hold his arms tightly as he takes you for a ride, an almost drunken look on your face as you ride out your own orgasm.", parse);
									player.AddLustFraction(-1);
									
									Text.NL();
									Text.Add("Finally he begins to slow... and with one last heavy roll of his hips he <i>drives</i> himself to the hilt, drawing a breathless moan from your lips, before he slowly begins to pull you forwards and off of him. His thick ridges stretch you wonderfully again, the motion in your back passage making your [anusDesc] distend outward. As you move, you can feel his warm spunk pooling inside of you.", parse);
									player.AddLustFraction(0.05);
									Text.NL();
									Text.Add("His powerful arms tug you forwards, his twitching meat sliding out of you as you land on his chest, resting on him.", parse);
									if(player.FirstBreastRow().size.Get() > 3)
										Text.Add(" Your breasts squish up against his chest, and he smirks at you, his snout mere inches in front of you.", parse);
									Text.NL();
									Text.Add("One scaled hand comes to your [faceDesc], and he holds you steady. Surprisingly, he pushes his own, yellow-green snout forwards... and kisses you. Your eyes widen as you find yourself unsure what to do. His forked tongue laps at your lips for a moment, before he pulls back and gives a hazy grin, only to fall back.", parse);
								}, function() { return player.LustLevel() + (player.FirstCock() ? 0.2 : 0); });
								scenes.AddEnc(function() {
									Text.Add("You feel him rocking faster and faster inside of you. His muzzle parts, and his tongue hangs out from his maw. You can feel his every thrust burying his fat, heavy ridges deeper inside of you, stretching you so achingly wide. It feels wonderful, the warm slime of his [m1multiCockDesc] sliding through your [anusDesc].", parse);
									Text.NL();
									parse["s"] = player.Butt().stretch.Get() > 5 ? "s" : "";
									parse["notS"] = player.Butt().stretch.Get() > 5 ? "" : "s";
									if(player.FirstCock()) {
										Text.Add("His fat, slick tip[s] batter[notS] your prostate, driving you harder against your own pleasure which grows harder and harder to resist. The wet slaps of his groin against you becomes hard to ignore, and you lean forwards to try and support yourself.", parse);
										Text.NL();
										Text.Add("The new angle drives you even harder, and your eyes open wide in surprise.", parse);
										Text.NL();
										player.AddLustFraction(0.1);
									}
									if(player.FirstVag()) {
										Text.Add("As he pistons himself up and into your body, you find it hard to concentrate. Your wet [vagDesc] drips onto his [m1multiCockDesc], making his thrusts come even easier, letting him slide deeper inside of you. He closes his eyes, his fat meat slotting into you relentlessly.", parse);
										Text.NL();
									}
									Text.Add("His thrusting grows shorter and shorter, and you can see his slitted eyes unfocusing. His breath comes heavily, and you can tell he's right at his limit. You wish you were at yours... Finally, with one, hard <i>thrust</i>, he slams his hips up against your [buttDesc], letting out a loud hiss of delight.", parse);
									Text.NL();
									Text.Add("Suddenly you feel his ", parse);
									if(player.Butt().stretch.Get() > 5)
										Text.Add("twin ", parse);
									else
										Text.Add("immense ", parse);
									Text.Add("dick[s] bulge, growing painfully stiff inside of you. Thick, hot slime begins to fill your [buttDesc] quickly, overfilling you in seconds. A blissfully dazed look crosses [m1name]'s [m1faceDesc] and he humps against your [buttDesc] fervently, longing moans escaping his throat.", parse);
									Text.NL();
									if(player.FirstVag())
										Text.Add("You feel your [vagDesc] clench down tightly, and a heat passes through your body... Despite his heavy thrusts, it just isn't quite enough for you to reach that tantalizing threshold. You let out a needy groan, grinding back against him futilely.", parse);
									else
										Text.Add("As hard as he cums inside of you, you don't even come close to his pleasure. You grind yourself down onto his throbbing meat, trying to push yourself over the edge, but it's not quite enough. You bring your hands down to take hold of yourself, but his hands catch yours, holding them in place... You groan in burning need.", parse);
								}, function() { return 1 - player.LustLevel() - (player.FirstCock() ? 0.2 : 0); });
								
								scenes.Get();
								
								Text.NL();
								Text.Add("You feel his spurts grow less and less, until you can't feel his hot sperm flowing any longer. His hands fall away from you.", parse);
								Text.NL();
								Text.Add("In a moment, you can see that he's passed out.", parse);
								Text.NL();
								Text.Add("Gingerly you stand up, breathing hard, your cheeks burning. As his flesh pops free from your pucker you tremble, feeling his potent slime dripping from your hole. ", parse);
								if(player.Butt().stretch.Get() > 5)
									Text.Add("Clenching your [anusDesc] as much as you can, you blush as you realize that it isn't managing to close entirely. ", parse);
								Text.Add("As [m1name]'s thick spunk drips down your legs, you gather your things, claim the spoils of victory, and make to leave...", parse);
								player.AddLustFraction(0.25);
								
								if(party.Two()) {
									Text.NL();
									Text.Add("[p1name] joins you, giving you a funny look.", parse);
								}
								else if(!party.Alone()) {
									Text.NL();
									Text.Add("Your party joins you, giving you a few funny looks.", parse);
								}
								Text.Flush();
								
								Gui.NextPrompt(enc.finalize);
							});
							
						}, enabled : true,
						tooltip : "You've already won, why not let him have a little fun with you?"
					});
					options.push({ nameStr : "Deny him",
						func : function() {
							Scenes.Lizards.WinPowerbottomAssert(enc);
						}, enabled : true,
						tooltip : "You don't like how rough he might go..."
					});
					Gui.SetButtonsFromList(options);
				}
				// Lust < 75%
				else {
					Scenes.Lizards.WinPowerbottomAssert(enc);
				}
			});
		}, enabled : true,
		tooltip : Text.Parse("There's something about having something pushing deep into your [anusDesc]...", parse)
	});
	if(options.length > 1)
		Gui.SetButtonsFromList(options);
	else
		Gui.NextPrompt(options[0].func);
	
	Text.Flush();
}

Scenes.Lizards.WinPowerbottomAssert = function(enc) {
	var enemy = enc.male;
	
	var parse = {
		p1name        : function() { return party.members[1].NameDesc(); },
		breastDesc    : function() { return player.FirstBreastRow().Short(); },
		cockDesc      : function() { return player.FirstCock().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		buttDesc      : function() { return player.Butt().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		clitDesc      : function() { return player.FirstVag().ClitShort(); },
		clothesDesc   : function() { return player.ArmorDesc(); },
		m1cockDesc    : function() { return enemy.FirstCock().Short(); },
		m1multiCockDesc : function() { return enemy.MultiCockDesc(); },
		m1Name        : function() { return enemy.NameDesc(); },
		m1name        : function() { return enemy.nameDesc(); },
		m1anusDesc    : function() { return enemy.Butt().AnalShort(); },
		m1buttDesc    : function() { return enemy.Butt().Short(); }
	};
	
	Text.Clear();
	Text.Add("You push his hands away, giving him a dark, sultry look. He lets out a low, hissing whine of discontentment. You can't help but grin, rolling your hips against his body as you stop him taking control. You know that your pleasure will be the last thing on [m1name]'s mind, and this is about <i>you</i>. You won. You clench your loose hole around his ", parse);
	if(player.Butt().stretch.Get())
		Text.Add("pair of pulsing dicks ", parse);
	else
		Text.Add("twitching, eager shaft ", parse);
	Text.Add("though, and watch as his eyes roll back in his head. You smirk at how easy he is to play with. The scent of his own lust meets your nostrils, and you inhale slowly. The way his flesh pulses inside of your [anusDesc] leaves you feeling tender.", parse);
	Text.NL();
	if(player.FirstVag()) {
		Text.Add("Your heated cunt clenches wetly, and you feel decidedly empty there, even if the sensations are definitely worth it.", parse);
		Text.NL();
	}
	if(player.FirstCock()) {
		parse["notS"] = player.NumCocks() > 1 ? "" : "s";
		Text.Add("Your [multiCockDesc] throb[notS], and you feel a shudder run down your spine as [m1name]'s own pair pulse in rhythm with yours.", parse);
		Text.NL();
	}
	parse["s"] = player.Butt().stretch.Get() > 5 ? "s" : "";
	Text.Add("[m1Name] thrusts upwards, burying his rock-solid, ridged pole[s] into your waiting passage. Your hands press down on his stomach, while his grip the ground firmly. Your [anusDesc] burns gently from the stretch, but he doesn’t let up, slowly pressing his hips upwards against you. You hear yourself groaning softly, and move yourself steadily up, keeping him from sinking in further.", parse);
	Text.NL();
	Text.Add("<i>\"Stop moving,\"</i> you order. He ignores it, trying to push himself deeper again. You grunt softly and start to pull off of him as he lets out a hiss of discontentment. You pause, feeling his spires pulse, thick spurts of slime invading your body. Suddenly [m1name] stops moving, waiting, watching you carefully. You stop pulling off of him, and he begins to slide deeper into you once more. Immediately, you pull yourself off again, feeling his slippery flesh tugging free of your loose ass. [m1Name] tenses up, coming to a halt again.", parse);
	Text.NL();
	Text.Add("<i>\"Stop, or I pull off,\"</i> you warn lowly. The lizard lets out a hiss of grudging understanding. <i>\"Are you going to be a good boy?\"</i> you whisper. He growls lowly, unhappily, but nods once. You smirk, letting one hand slide back to press his hips back to the ground. <i>\"Good answer...\"</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		
		Text.Add("Slowly, you begin to press yourself down onto him, keeping things to your own pace. The reptile under you squirms steadily, his face contorted uncomfortably as he holds himself back from bucking upwards into you. Every time he looks at you, his muzzle reddened and his breathing heavy, you give him a warning look to remind him who’s in control, and what happens if he pushes. You feel his fat ridges sinking into you, ", parse);
		if(player.Butt().stretch.Get() > 5)
			Text.Add("filling your body completely, both of his wet, slimy poles squishing together inside of you.", parse);
		else
			Text.Add("his twitching dick pulsing inside of you. His every movement sends tingles down your spine even as his second spire leaks that musky ooze onto your flesh.", parse);
		Text.NL();
		
		if(player.FirstCock()) {
			parse["s"] = player.Butt().stretch.Get() > 5 ? "s" : "";
			parse["notS"] = player.Butt().stretch.Get() > 5 ? "" : "s";
			Text.Add("His spongy, drooling tip[s] grind[notS] against your engorged prostate, and you hear a soft, fleshy squelch as you grind yourself down onto him. He lets out a hiss of pleasure as you send a slick spurt of precum from your [multiCockDesc] over his chest.", parse);
			Text.NL();
		}
		Text.Add("You set into a steady pace, lifting yourself up to his oozing tips, only to let yourself sink back down, pushing his dense flesh ", parse);
		var tail = player.HasTail();
		if(tail) {
			parse["s"] = tail.count > 1 ? "s" : "";
			Text.Add("back under your tail[s].", parse);
		}
		else
			Text.Add("into you once more.", parse);
		Text.Add(" Deeper and deeper he slides, filling your clenching passageway completely.", parse);
		if(player.Butt().stretch.Get() > 5)
			Text.Add(" Even loose as you are now, it’s a challenge to fit both of him at the same time.", parse);
		Text.NL();
		Text.Add("Each time you come close to fitting him completely, you find him just a little too thick, and have to rise again. Yet each time you stop, you find yourself fitting just a little bit more...", parse);
		Text.NL();
		if(player.Butt().stretch.Get() > 5) {
			Text.Add("[m1Name] hisses out, his eyes glazing over as he squirms underneath you, and you clench around his twin lengths, delighting in the gasp it draws from his muzzle... and the warm fluid you feel filling you. You spread your legs further, feeling the muscles in your legs stretch as [m1name] stretches other ones for you. Up and down you bounce in his lap, breathing harder with each moment, your blood pounding in your ears.", parse);
			Text.NL();
			Text.Add("He feels so big inside of you, being taken by what feels like two males at once. You can feel him getting closer...", parse);
		}
		else {
			Text.Add("[m1Name] claws at the ground in ecstasy, his shaft throbbing powerfully inside of you and making your pucker stretch. His second shaft twitches against your [buttDesc], smearing ever more of his slick, oily precum over your flesh. He moans lowly, squeezing his eyes shut as your muscles stretch to fit him.", parse);
			Text.NL();
			Text.Add("Up and down you bounce in his lap, breathing harder with each moment, your blood pounding in your ears. Your hole burns, a deep ache in your ring as it slides up and down along his bulbous meat, but the pleasure only bubbles up inside of you.", parse);
		}
		Text.NL();
		Text.Add("You feel yourself nearing the edge, too. The lizard’s thick, slimy meat moving inside of you engulfs your thoughts, the way you feel so completely filled punctuating each heartbeat. Your every motion leaves him deeper inside of you, his fleshy ridges jumping with his pulse and toying with your senses.", parse);
		Text.NL();
		if(player.FirstBreastRow() > 3) {
			Text.Add("You feel [m1name]’s hands suddenly reach forwards, groping your [breastDesc] firmly, cupping your sensitive mounds. You moan softly, pressing your melons forwards into his grip as his fingers slide forwards, coming to your stiff nipples, gently tweaking them. As you gaze at the lizard, he seems halfway drunk with pleasure, his dicks pulsing helplessly as you ride him.", parse);
			Text.NL();
		}
		if(player.FirstCock()) {
			Text.Add("You lift one hand, grabbing hold of your [multiCockDesc], stroking yourself rapidly, your eyes closing. It feels so good, you could almost...", parse);
			Text.NL();
		}
		parse["of"] = player.Butt().stretch.Get() > 5 ? "of" : "and against";
		Text.Add("You can’t hold yourself back any longer. You feel it coming already, and can’t stop yourself as his fat meat pushes deep into you, sending you over the edge. You moan loudly, <i>ramming</i> yourself down into his lap, feeling his dense cocks hilt inside [of] you as your climax erupts.", parse);

		player.AddLustFraction(-1);

		Text.NL();
		if(player.FirstCock()) {
			Text.Add("You feel thick gouts of slime erupting from your [multiCockDesc], splattering messily over [m1name]. His eyes close as you cum hard enough to paint his muzzle in your sticky seed.", parse);
			Text.NL();
		}
		if(player.FirstVag()) {
			Text.Add("Your wet cunt finally gives out, and you feel your walls clamping down tightly, a deep heat spreading from your clit. As you bounce up and down on his groin, your juices gush over him, soaking his own dicks and slit.", parse);
			Text.NL();
		}
		Text.Add("As your pucker clenches down around [m1name] over and over, he <i>howls</i> out. Helplessly he bucks upwards into you, humping against your entrance wildly and sending sharp jolts through your system. Cumming messily, you dimly feel his own twin cocks begin to throb heavily, set off by your powerful clenching. Scaled hands grip your hips, holding you down as he finishes inside your ", parse);
		if(player.Butt().stretch.Get() > 5)
			Text.Add("loose, aching hole. His twin, heavy dicks spurt inside of you, sending jet after jet of sticky lizard spunk deep into your gut. You feel yourself rapidly growing full. As his internal balls empty out inside of you, it grows too much. His slimy cum gushes out of your aching hole, still clenching to try and keep as much as possible.", parse);
		else
			Text.Add("tight, clenching hole. You feel his dicks stiffen, growing thicker right before a wet, sticky gush of reptilian sperm pumps into your body. As one dick fills you with his slimy essence, you feel warm spunk splattering between your cheeks, [m1name]’s second shaft coating you in his warmth.", parse);
		Text.NL();
		Text.Add("<i>\"Y... yes,\"</i> he hisses, pushing his hips up against you.", parse);
		Text.NL();
		Text.Add("Eventually you feel yourself coming down from that carnal high, feel the reptile under you finally taper off to small spurts, then nothing. You pant heavily, slowly getting control of yourself. [m1Name] looks covered in a sheen of sweat, laying there in the dirt. Slowly, you stand up and turn away, shaking your head.", parse);
		Text.NL();
		Text.Add("Gathering your things, you look back to [m1name], only to find that he has passed out, his twin shafts still dripping.", parse);
		Text.NL();
		Text.Add("As [m1name]'s thick spunk drips down your legs you claim the spoils of victory, making to leave...", parse);
		
		if(party.Two()) {
			Text.NL();
			Text.Add("[p1name] joins you, giving you a funny look.", parse);
		}
		else if(!party.Alone()) {
			Text.NL();
			Text.Add("Your party joins you, giving you a few funny looks.", parse);
		}
		Text.Flush();
		
		Gui.NextPrompt(enc.finalize);
	});
}

Scenes.Lizards.WinPowerbottomDeny = function(enc) {
	var enemy = enc.male;
	
	var parse = {
		p1name        : function() { return party.members[1].NameDesc(); },
		cockDesc      : function() { return player.FirstCock().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		clitDesc      : function() { return player.FirstVag().ClitShort(); },
		clothesDesc   : function() { return player.ArmorDesc(); },
		m1cockDesc    : function() { return enemy.FirstCock().Short(); },
		m1multiCockDesc : function() { return enemy.MultiCockDesc(); },
		m1Name        : function() { return enemy.NameDesc(); },
		m1name        : function() { return enemy.nameDesc(); },
		m1anusDesc    : function() { return enemy.Butt().AnalShort(); },
		m1buttDesc    : function() { return enemy.Butt().Short(); }
	};
	
	Text.Clear();
	Text.Add("You ride him for all you're worth, racing him to climax, now, hungering to get your own finish without giving him his own inside of you. You lean forwards, pressing your [clitDesc] against the ridges along his length. The added stimulation quickly begins to send your vision cloudy.", parse);
	Text.NL();
	Text.Add("Finally, you feel your [vagDesc] begin to spasm around him. You throw back your head and <i>moan</i> as your cunt begins to clench around him, losing control over your muscles as you ride him desperately. Your juices gush from your lips, making a mess of his groin as you bounce up and down on his shaft.", parse);
	Text.NL();
	
	if(Math.random() < (10 + player.strength.Get() / 2) / 100) {
		Text.Add("Finally, you pull yourself off, keeping his hands from your hips. He groans, hissing in need for you to continue, but you just gaze at him, still recovering from your own climax as your fluids drip down your leg. <i>\"H-have... fun,\"</i> you stammer, quickly collecting your things, and walking away...", parse);
	}
	else {
		Text.Add("Finally, you move to pull yourself off from him... but his hands lock firmly around your hips. You quickly try to pull his hands away, but the reptile seems spurred on with newfound strength! Realizing you rode him too long, gave him too much of a chance with your body, you can do little but squirm, trying to pull off as he humps roughly up into your spasming cunt. You see spots in front of your eyes from the stimulation, and let out a helpless moan.", parse);
		Text.NL();
		Text.Add("He grins toothily at your moaning, his bucking growing more erratic by the moment. With one last, powerful buck of his hips, he lodges his bulbous, reptilian breeding pole deep in your body, and you feel gouts of slimy, thick cum pumping into your womb. You groan, trying to pull away again, but he simply holds you there. You feel spurt after spurt filling your womb, until your stomach stretches slightly. Finally spent, he simply... lets go.", parse);
		Text.NL();
		Text.Add("You get up, staggering off of him, your cheeks flushed. How quickly he turned that around... Then again, you can't help but feel that you <i>did</i> ask for that to happen. [m1Name] smirks at you as you watch him, two fingers idly tapping his twin shafts. You gather your things and the spoils of battle, and quickly hurry away.", parse);
	}
	
	if(party.Two()) {
		Text.NL();
		Text.Add("[p1name] follows you.", parse);
	}
	else if(!party.Alone()) {
		Text.NL();
		Text.Add("Your party follows you.", parse);
	}
	Text.Flush();
	
	player.FuckVag(player.FirstVag(), enemy.FirstCock(), 3);
	Sex.Vaginal(enemy, player);
	
	player.AddLustFraction(-1);
	Gui.NextPrompt(enc.finalize);
}

Scenes.Lizards.LossPrompt = function() {
	gameState = GameState.Event;
	Text.Clear();
	
	var enc = this;
	enc.finalize = function() {
		Encounter.prototype.onLoss.call(enc);
	}
	
	var parse = {
		breastDesc : function() { return player.FirstBreastRow().Short(); },
		vagDesc    : function() { return player.FirstVag().Short(); },
		numCocks   : function() { return player.MultiCockDesc(); },
		m1Name     : function() { return enc.male.NameDesc(); },
		m1hisher   : function() { return enc.male.hisher(); },
		m1HeShe    : function() { return enc.male.HeShe(); },
		m1heshe    : function() { return enc.male.heshe(); }
	};
	
	if(player.LustLevel() > 0.6) {
		Text.AddOutput("You slump to the ground, finding it hard to keep your eyes focused on the leering, scaled creatures standing over you. Your body aches, and not just from bruises. ", parse);
		// If male
		if(player.FirstCock() && !player.FirstVag()) {
			Text.AddOutput("Your breathing comes in wheezes, and you can feel your pulse thundering in both your ears and your almost painfully aroused [numCocks].", parse);
		}
		// If female
		else if(!player.FirstCock() && player.FirstVag()) {
			Text.AddOutput("Your [breastDesc] heave and you gaze steadily at the ground for several long, tense moments, feeling your [vagDesc] beginning to stick to your clothing as slick fluids drip from it.", parse);
		}
		// If herm
		else if(player.FirstCock() && player.FirstVag()) {
			Text.AddOutput("You find it hard to concentrate through the fog being pumped through your brain by your dually aroused sexes. Your [vagDesc] quivers, and you can feel your own fluids trickling down your leg. Set to the rhythm of your cunt's slick clenching, you can feel the pulses sending shivers up and down your spine from your [numCocks].", parse);
		}
		Text.Newline();
		Text.AddOutput("[m1Name] stops in front of you, gazing down over your heaving form, a smirk on [m1hisher] face. [m1HeShe] leans down, hands reaching for your shoulders. You don't even bother to resist. The way that [m1heshe] looks at you hungrily as [m1heshe] lifts you by your shoulders, intentions deviously obvious, you can't quite manage to bring yourself to regret losing the fight...", parse);
	}
	else { // NOT AROUSED
		Text.AddOutput("The final hit knocks you down to the ground leaving you momentarily stunned. You shake your head to try to settle your scrambled thoughts, only to see two big, scaled feet stop in front of your battered body. Before you can escape, the lizard's weapon clatters to the ground and two frighteningly powerful hands hoist you up into the air, where you find yourself face to face with the leering reptile.", parse);
	}
	
	Gui.NextPrompt(function() {
		var scenes = new EncounterTable();
		
		scenes.AddEnc(function() { Scenes.Lizards.LossMale.call(enc);   });
		scenes.AddEnc(function() { Scenes.Lizards.LossFemale.call(enc); });
		
		scenes.Get();
	});
}

Scenes.Lizards.LossMale = function() {
	Text.Clear();
	
	var enc = this;
	
	var member1 = party.members[1];
	var member2 = party.members[2];
	
	var parse = {
		breastDesc : function() { return player.FirstBreastRow().Short(); },
		vagDesc    : function() { return player.FirstVag().Short(); },
		cockDesc   : function() { return player.MultiCockDesc(); },
		numCocks   : function() { return player.MultiCockDesc(); },
		faceDesc   : function() { return player.FaceDesc(); },
		m1name     : function() { return enc.male.nameDesc(); },
		m1Name     : function() { return enc.male.NameDesc(); },
		m1race     : function() { enc.male.body.RaceStr(); },
		m1hisher   : function() { return enc.male.hisher(); },
		m1HeShe    : function() { return enc.male.HeShe(); },
		m1heshe    : function() { return enc.male.heshe(); },
		m1cockDesc : function() { return enc.male.MultiCockDesc(); },
		clothesDesc : function() { return player.ArmorDesc(); },
		p1name     : function() { return member1.name; },
		p1himher   : function() { return member1.himher(); },
		p2name     : function() { return member2.name; },
		p2heshe    : function() { return member2.heshe(); },
		m2Name     : function() { return enc.female.NameDesc(); },
		m3name     : function() { return enc.third.nameDesc(); }
	};
	
	
	Text.AddOutput("The reptilian creature brings you closer, smirking at you lewdly. His slitted eyes watch you with keen interest, and you can feel them roaming lower. You dare a glance across your assailants body and see exactly what you hoped you wouldn't see. Between his potently muscled legs, his [m1cockDesc] slowly, but surely are rising to attention. You struggle mightily, squirming and thrashing to try and break free, but in your already weakened state you are no match for the reptile.", parse);
	Text.Newline();
	
	if(player.Armor()) {
		Text.AddOutput("He lifts your hands up above your head, one thick hand gripping your wrists, while his other hand draws close to your body. With a thick looking finger, he slowly tugs down the length of your [clothesDesc], letting them fall away from your bruised body, leaving them in a slump on the ground.", parse);
		Text.Newline();
		player.AddLustFraction(0.05);
	}
	
	
	
	var scenes = new EncounterTable();
	// IF FEMALE OR HERM
	scenes.AddEnc(function() {
		Text.AddOutput("With a lascivious smirk, his eyes hungrily drink in the sight of your body.", parse);
		if(player.FirstBreastRow().size.Get() >= 3) {
			Text.AddOutput(" His scaled hand comes up and roughly gropes your [breastDesc], a delighted look on his face as he plays with your exposed mounds.", parse);
		}
		Text.Newline();
		
		Text.AddOutput("His hand trails lower, rubbing over your belly. It feels slightly cool to the touch, almost as chilled as the harsh expression on his face. <i>\"What a pretty thing,\"</i> he hisses, his muzzle splitting into a grin. <i>\"Does the little girly want to be played with?\"</i> he asks, giving a sibilant chuckle.", parse);
		Text.Newline();
		
		if(player.LustLevel() < 0.5) {
			Text.AddOutput("You shake your head avidly. You are definitely not in the mood right now. <i>\"Too bad.\"</i>", parse);
		}
		else {
			Text.AddOutput("You close your eyes, trying to think of a way to say \"Yes\" without degrading yourself. Your thoughts are broken by [m1name] chuckling darkly. <i>\"Can't even bring yourself to say 'no', can you?\"</i>", parse);
		}
		Text.AddOutput(" His hand trails lower, and you look away.", parse);
		Text.Newline();
		
		if(member1 && enc.female.LustLevel() > 0.4) {
			Text.AddOutput("You see [p1name] cringing, trying to get away from the reptile pinning [p1himher] to the ground. [m2Name] grins at [p1name] lewdly, holding [p1himher] down as [m2heshe] begins to grope and tease [p1himher].", parse);
			if(member2 && enc.third) {
				Text.AddOutput(" Meanwhile, [p2name] is battering at [m3name] with one fist that [p2heshe] managed to get free, but it only seems to be egging [m3name] on further.", parse);
			}
			Text.Newline();
			player.AddLustFraction(0.05);
		}
		
		// Check for numcocks
		var cockNum = player.NumCocks();
		if(cockNum == 1) {
			Text.AddOutput("His hand stops halfway down your body, hovering just above your [cockDesc] for a moment. His eyes narrow and his nostrils flare, before his hand trails lower... He doesn't seem that interested in it this time.", parse);
		}
		else if(cockNum > 1) {
			Text.AddOutput("His hand stops just above your groin, and he smirks. His fingers hover above your [numCocks] hesitantly, before moving further down.", parse);
		}
		
		if(cockNum == 2) {
			Text.AddOutput(" <i>\"Halfway to being a [m1race]...\"</i>", parse);
		}
		Text.Newline();
		Text.AddOutput("The sudden touch of his clawed finger to your [vagDesc] startles you back to attention, and your eyes widen.", parse);
		if(player.LustLevel() < 0.5) {
			Text.AddOutput(" You struggle to get away again, kicking at him, but your fatigued body just can't muster up the strength to fight him off.", parse);
		}
		Text.AddOutput(" His finger begins to slowly rub and stroke your outer folds, slowly beginning to work itself inwards. ", parse);
		if(player.LustLevel() < 0.5) {
			Text.AddOutput("As much as you hate to admit it, his surprisingly gentle touch doesn't feel as bad as you think it should.", parse);
		}
		else {
			Text.AddOutput("You bite your lip softly, squeezing your eyes shut. His teasing, slow touches drive you further into the pink haze of lust that threatens to engulf you.", parse);
		}
		Text.Newline();
		Text.AddOutput("The lizard draws his hand away and lifts it to his muzzle. <i>\"I wonder how much it will take to make you squeal,\"</i> he leers, popping his finger into his maw. When he pulls it back out, it glistens with saliva. You try to squirm away, but his hand holding you in the air leaves you helpless. You realize there's no one around able to help you.", parse);
		Text.Newline();
		Text.AddOutput("Suddenly his finger makes contact with your [vagDesc], this time that much slicker. He smirks, pushing it a half an inch in. He begins to twist it, stroking along your folds, seeming to revel in the heat of your body.", parse);
		if(player.LustLevel() < 0.5) {
			Text.AddOutput(" Before long, you find yourself growing wet, your cheeks a deep red.", parse);
		}
		else {
			Text.AddOutput(" The slick moisture dripping from your [vagDesc] mixes with his saliva, and soon his finger has slid deep inside of you, playing with your eager hole.", parse);
		}
		Text.Newline();
		Text.AddOutput("Finally, the lizard seems to call that enough and pushes you firmly toward the ground, still holding your wrists. He forces you forwards until your [faceDesc] meets the ground, holding your wrists tightly together behind your back.", parse);
		
		// RANDOM SCENE
		Gui.NextPrompt(function() {
			Scenes.Lizards.LossMaleVagVariations.call(enc);
		});
	}, 2.0, function() { return player.FirstVag(); });
	// IF MALE OR HERM
	scenes.AddEnc(function() {
		Text.AddOutput("His eyes drift down between your legs, and his eyes narrow.", parse);
		Text.Newline();
		
		Scenes.Lizards.LossMaleCockVariations.call(enc);
	}, 1.0, function() { return player.FirstCock(); });
	
	scenes.Get();
}

Scenes.Lizards.LossMaleVagVariations = function() {
	Text.Clear();
	
	var enc = this;
	
	var member1 = party.members[1];
	
	var parse = {
		breastDesc : function() { return player.FirstBreastRow().Short(); },
		vagDesc    : function() { return player.FirstVag().Short(); },
		numCocks   : function() { return player.MultiCockDesc(); },
		buttDesc   : function() { return player.Butt().Short(); },
		anusDesc   : function() { return player.Butt().AnalShort(); },
		clitDesc   : function() { return player.FirstVag().ClitShort(); },
		playerSkin : function() { return player.SkinDesc(); },
		m1Name     : function() { return enc.male.NameDesc(); },
		m1name     : function() { return enc.male.nameDesc(); },
		m2name     : function() { return enc.female.nameDesc(); },
		m1cockDesc : function() { return enc.male.FirstCock().Short(); },
		m1multiCockDesc : function() { return enc.male.MultiCockDesc(); },
		m1hisher   : enc.male.hisher(),
		m1HeShe    : enc.male.HeShe(),
		m1heshe    : enc.male.heshe(),
		m2heshe    : enc.female.heshe(),
		m2HeShe    : enc.female.HeShe(),
		m2hisher   : enc.female.hisher(),
		p1name     : function() { return member1.name; },
		p1himher   : function() { return member1.himher(); },
		p1heshe    : function() { return member1.heshe(); }
	};
	
	
	var scenes = new EncounterTable();
	// ANAL
	scenes.AddEnc(function() {
		Text.AddOutput("He leans over your back, and you feel his heavy pair of dense shafts flop down on you, one on either cheek. His hulking form looms over you, and you feel his muzzle slide up beside your ears. <i>\"I wonder what your other hole feels like,\"</i> he whispers... before you feel his hips draw back. In one swift roll of his hips, you feel a thick, slimy <i>presence</i> spear itself through your [anusDesc], a matching one sliding up between your cheeks as the lizard's other [m1cockDesc] squishes deep inside your body.", parse);
		Text.Newline();
		
		player.FuckAnal(player.Butt(), enc.male.FirstCock(), 2);
		
		player.AddLustFraction(-0.05);
		
		Text.AddOutput("Spots burst in front of your eyes, and you find yourself clutching weakly at the air as your [anusDesc] adjusts to his aching size. A deep, satisfied rumble sounds out from his throat, and his hand squeezes your wrists together firmly. He draws his hips back, the pulsing flesh of his cock surprisingly hotter than the rest of his body. You feel it slide slickly out of your sphincter, before he bucks his hips forward again. Once more you feel a warm, heavy pressure fill your [anusDesc], and he grunts. Cool scales press up against your [buttDesc], and he rocks himself against your body, using his groin to smear the lubricating slime that covered his shaft across your rear. His other [m1cockDesc] slides against your [playerSkin], smearing his slime across your [buttDesc].", parse);
		Text.Newline();
		Text.AddOutput("Soon he picks up the pace, beginning to lose himself to the pleasure your body gives him... and before long, you find that his strangely ridged length is reaming spots you didn't quite know you had. The alien feel of his dicks both deep inside you and against your [buttDesc] gradually gets less and less uncomfortable, and by the time you feel his [m1cockDesc] throbbing powerfully inside of you, you find it hard to suppress a moan.", parse);
		Text.Newline();
		
		if(Math.random() < 0.5) {
			Text.AddOutput("Halfway through, he seems to change his mind about what he said. You feel him simply pull himself out from your stuffed [anusDesc], only to swiftly roll his hips forwards again. You feel his dual cocks push heavily against your own entrances.", parse);
			Text.Newline();
			
			if(player.LustLevel() < 0.5) {
				Text.AddOutput("Your eyes widen and you bite your lip, the reptile taking it further than you prayed. Trying to push it out of mind, you squeeze your eyes shut tight, right as you feel the pressure build.", parse);
			}
			else {
				Text.AddOutput("Your eyes cross and you close them, feeling the heat of his spaded tips push roughly against both of your entrances at the same time. Weakly you mouth, <i>\"Please...\"</i>", parse);
				Text.Newline();
				Text.AddOutput("[m1Name] grunts out his ecstatic approval, and pushes all the harder.", parse);
			}
			Text.Newline();
			Text.AddOutput("Suddenly the force of his tips against your slicked entrances grows too firm, and you feel his heated [m1multiCockDesc] spear into both your [anusDesc] and [vagDesc] simultaneously. Your eyes open in surprise, but he shoves you harder into the dirt. He pulls his hips back, then <i>rams</i> both his shafts deeper into both of your holes. Stars burst in front of your eyes again, and you feel your now slick [vagDesc] convulse around his [m1cockDesc] as his other pumps into your [anusDesc].", parse);
			Text.Newline();
			
			player.FuckVag(player.FirstVag(), enc.male.FirstCock(), 2);
			
			if(player.body.Gender() == Gender.herm) {
				Text.AddOutput("The way that his twin dicks both slide sloppily into your body, each throb making them squeeze together inside of you quickly sends your own [numCocks] pulsing to life. [m1Name] just smirks, letting out a grunt as he steadily begins to hump.", parse);
				Text.Newline();
			}
			Text.AddOutput("In and out he thrusts them, steadily working you into your own frenzy, his second dick pulsating between your slick walls, ridges grinding against your [clitDesc]. Just as you find yourself getting into it, beginning to move to his heavy rhythm and feeling his own fluids smearing around your [vagDesc] walls, he yanks himself back, popping both of his dicks free from you. With another push, you feel his first slide back into your [anusDesc], his second sliding between your cheeks again. His free hand pats your [buttDesc]. <i>\"Maybe when you win, you'll get to finish...\"</i>", parse);
			
			player.AddLustFraction(0.2);
		}
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.AddOutput("Finally, with a powerful thrust of his hips, his [m1cockDesc] slams deep into your body. [m1Name] howls out, a bestial cry that makes a shudder run down your spine. He lets go of your hands, grabbing hold of your [buttDesc], rocking his hips against you. You feel his shafts pulsing heavily, before thick, warm fluid starts to fill your [anusDesc]. Thick gouts of it splatter over your back, making a mess of you both inside and out. Deeper and deeper his seed spills into your body, until he simply... pushes you off, jerking his first [m1cockDesc] out from you and leaving you in the dirt. A few, last ropes splatter over your body as he picks up his weapon, before turning and walking away. Exhausted and quivering from your own cruelly teased arousal, you roll onto your back and consign yourself to rest.", parse);
			if(player.body.Gender() == Gender.herm) {
				Text.Newline();
				Text.AddOutput("You feel your [numCocks] pulsing in the air, but after [m1name]'s heavy romp, you can't quite summon up the energy to do more than lay there, feeling your sexes throb in time to each other.", parse);
			}
			if(!party.Alone()) {
				Text.Newline();
				Text.AddOutput("Dimly, you can hear the other reptile[s] finishing with your companion[s2], leaving [group] in a similar state...", { group: party.Two() ? "both of you" : "your entire group", s: enc.third ? "s" : "", s2: party.Two() ? "" : "s" });
			}
			
			Gui.NextPrompt(enc.finalize);
		});
		
	});
	// VAG
	scenes.AddEnc(function() {
		Text.AddOutput("Without wasting any time, he steps up behind you, his scaled feet padding against the ground. A soft growl sounds from his throat, and you feel not one, but both of his thick, pulsating dicks press against your [vagDesc]. They feel slimy against your [vagDesc], no doubt slick with the slime in the lizard's slit designed to keep his [m1multiCockDesc] ready for use. In a mildly pleasant turn of events, his flesh feels much warmer than his scales. At least it won't be an <i>entirely</i> unpleasant experience.", parse);
		Text.Newline();
		Text.AddOutput("He grinds against you for what feels like an hour, though your mind idly reasons it can't be more than a minute. Finally, he draws back... and with a single, well placed buck of his powerful hips, both of his dense, hot shafts sink halfway into your dripping [vagDesc].", parse);
		Text.Newline();
		
		player.AddLustFraction(0.1);
		
		var virgin = player.FirstVag().virgin;
		player.FuckVag(player.FirstVag(), enc.male.FirstCock(), 3);
		
		
		if(player.FirstVag().capacity.Get() > 30) {
			Text.AddOutput("It feels just right, the pair sliding easily into your [vagDesc]. The lizard gives out a groan and grinds more steadily into you, forcing just an extra inch of each into your body. It leaves your loose, sloppy cunt clenching tightly and leaves your body aching even more.", parse);
			player.AddLustFraction(0.05);
		}
		else {
			Text.AddOutput("It hurts as he forces both of them in at once. You squeeze your eyes shut, feeling your [vagDesc] stretched beyond its limits. They grind between your lips, forcing them ever wider. A deep heat floods your body as you realize how much looser you'll be if he goes on.", parse);
			player.AddLustFraction(-0.05);
		}
		Text.Newline();
		Text.AddOutput("He hunches over you, stopping with his lengths buried only halfway inside. One hand grips your head, tilting it back. You see [m1name] grinning delightedly down at you.", parse);
		Text.Newline();
		
		if(virgin) {
			Text.AddOutput("<i>\"Looks like I get to be the first to break you in... You never forget your first,\"</i> he mocks, grinding his [m1cockDesc] against your clenching walls. His free hand gropes your [buttDesc] roughly.", parse);
		}
		else if(player.FirstVag().capacity.Get() > 30) {
			Text.AddOutput("<i>\"Seems I'm not your first... Bit of a slut, aren't you? Don't bother denying it,\"</i> he smirks, drawing his throbbing dicks a quarter of the way out, before pushing them slowly back in. You feel your walls stretch around him slickly.", parse);
		}
		else {
			Text.AddOutput("<i>\"So tight... I'll fix <b>that</b>.\"</i>", parse);
		}
		Text.Newline();
		Text.AddOutput("Without another word, he <i>pushes</i> his [m1multiCockDesc] the rest of the way into your [vagDesc]. Soft, fleshy ridges along his dicks bump against your [clitDesc] in sequence, sending electric tingles up your spine. Deeper and deeper his reptilian shaft sinks into your body, and by the time his hips meet yours, you can feel his every movement through the pair of rods deep in your quivering [vagDesc].", parse);
		if(player.LustLevel() < 0.5) {
			Text.Newline();
			Text.AddOutput("You close your eyes, cheeks red. The way that his dual members pulse inside of you, each at the same time... The way that they twitch within you, grinding against each other and your walls, you can feel your own arousal building rapidly.", parse);
		}
		
		Gui.NextPrompt(function() {
			Text.Clear();
			
			Text.AddOutput("Drawing his groin back, [m1name] pulls his [m1multiCockDesc] slowly, achingly out of your cunt, each inch leaving you feeling cooler as his flesh slips out from yours. His hand tightens around your wrists, and he shoves the entirety of both of his pulsating, thick cocks into you, only to yank them back out with a fleshy squish that you can't help but blush at to hear coming from your own body. He quickly settles into roughly humping your slick passage, and the feeling of his alien lengths sliding through your [vagDesc] makes it hard to concentrate. He smirks, and it takes you a moment to realize that it's because you're moaning softly.", parse);
			Text.Newline();
			Text.AddOutput("Finally his humps grow slower, more irregular.", parse);
			Text.Newline();
			
			var scenes2 = new EncounterTable();
			scenes2.AddEnc(function() {
				Text.AddOutput("He holds you steady and buries both of his [m1cockDesc]s deep inside you, his teeth clenching tightly as his thick shafts seem to <i>pulse</i>. Your eyes go wide as he holds you there, impaled on his pulsating dicks. Helpless to stop it, you feel his sticky, gooey sperm pumping deep into your passage, squeezing past your cervix and deep into your womb. He grins toothily and gazes almost menacingly at you as the realization grips your mind. Yet even as his climax slowly tapers off, he doesn't stop railing you roughly in the dirt. His [m1multiCockDesc] slide wetly in and out of your slippery [vagDesc], steadily pushing you toward your own edge. The pressure builds and builds inside of you, the pleasure growing almost unbearable.", parse);
				Text.Newline();
				Text.AddOutput("Finally, the growing ache seems to build inside your [clitDesc], every ounce of your being focusing into a point. Your [clitDesc] feels like it grows so very hot, and spots burst in front of your eyes as his [m1multiCockDesc] pound you over the edge. You cry out up at him, his eyes boring into yours as you feel your [vagDesc] convulse around his heavy, thick shafts. Your lips clench around him and you feel the pleasure swamp your vision as your legs give out from under you, leaving you propped up by his rock solid [m1multiCockDesc]. As your [vagDesc] juices itself, he smirks, feeling your fluids make a mess of both your groins. He pulls out of your sloppy [vagDesc], letting you slump to the ground. Picking up his weapon, he turns and walks away.", parse);
				Text.Newline();
				
				player.AddLustFraction(-1);
				
				if(!party.Alone()) {
					Text.AddOutput("As you lay there with your face flushed and your breathing heavy, still feeling the slimy spunk of [m1name] dripping from your abused [vagDesc], you see [p1name] being held down by another one of the lizards. [m2HeShe] has [m2hisher] groin pressed to [p1name]'s mouth, and you can see [p1himher] looking up into the eyes of [m2name] blearily.", parse);
					if(party.Num() > 2) Text.AddOutput(" You can't see anyone else, though you can hear them...", parse);
					Text.Newline();
					if(player.FirstCock())
						Text.AddOutput("You feel precum drooling from your [numCocks], and try not to focus on the sensation too much.", parse);
					Text.Newline();
					Text.AddOutput("You pass out watching [p1name] pleasure [m2name], feeling [m1name]'s seed settling in your womb.", parse);
				}
				else {
					Text.AddOutput("You manage to pull your legs closed, but roll into the puddle you and [m1name] made.", parse);
					if(player.NumCocks() == 1)
						Text.AddOutput(" You let out a groan as a gob of precum trails up to the tip of your [cockDesc], oozing down your length.", parse);
					else if(player.NumCocks() > 1)
						Text.AddOutput("You let out a soft groan as gobs of precum trail up to the tip of your [numCocks], oozing down the length of each.", parse);
					Text.AddOutput(" Blushing shamefully, you pass out to the sensations of his seed settling in your womb.", parse);
				}
				
				player.AddLustFraction(0.05);
				Gui.NextPrompt(enc.finalize);
			});
			scenes2.AddEnc(function() {
				Text.AddOutput("He holds you in place, before letting out a hiss. <i>\"I don't want my line tainted by a weakling like you...\"</i>", parse);
				Text.Newline();
				Text.AddOutput("He slides his [m1multiCockDesc] out from your clenching, quivering cunt, dragging his tips across your lips. He snorts, before thrusting his hips forwards, his [m1multiCockDesc] sliding wetly between your cheeks, aimed over your back.", parse);
				Text.Newline();
				Text.AddOutput("Suddenly you feel thick, slimy fluid splattering over your back. Some of it hits your hands, and you think you can feel some dripping into your hair. An almost alarming amount of cum begins to drip down your back, stopping after what feels like far too long to be normal. With a satisfied hiss, the reptile releases your hands, pushing you into the ground. He snorts, picking up his weapon, turning to go. <i>\"Get a little stronger and next time I might just put you to real use,\"</i> he smirks.", parse);
				Text.Newline();
				
				if(party.Alone())
					Text.AddOutput("You manage to spot [p1name] slumped in a similar heap not too far away. [p1heshe] looks unconscious. You let out a groan, succumbing to a similar state...", parse);
				else
					Text.AddOutput("You shudder, feeling his slime dripping off your body. You close your eyes, and sleep quickly claims you.", parse);
				
				player.AddLustFraction(0.15);
				Gui.NextPrompt(enc.finalize);
			});
			scenes2.Get();
		});
	});
	
	scenes.Get();
}

Scenes.Lizards.LossMaleCockVariations = function() {
	var enc = this;
	
	var member1 = party.members[1];
	
	var parse = {
		MalesHerms : player.FirstVag() ? "Herms" : "Males",
		playerRace : function() { return player.body.RaceStr(); },
		breastDesc : function() { return player.FirstBreastRow().Short(); },
		vagDesc    : function() { return player.FirstVag().Short(); },
		numCocks   : function() { return player.MultiCockDesc(); },
		cockDesc   : function() { return player.FirstCock().Short(); },
		hairDesc   : function() { return player.Hair().Short(); },
		faceDesc   : function() { return player.FaceDesc(); },
		earDesc    : function() { return player.EarDesc(); },
		feetDesc   : function() { return player.FeetDesc(); },
		ballsDesc  : function() { return player.BallsDesc(); },
		anusDesc   : function() { return player.Butt().AnalShort(); },
		buttDesc   : function() { return player.Butt().Short(); },
		m1Name     : function() { return enc.male.NameDesc(); },
		m1name     : function() { return enc.male.nameDesc(); },
		m1hisher   : function() { return enc.male.hisher(); },
		m1HeShe    : function() { return enc.male.HeShe(); },
		m1heshe    : function() { return enc.male.heshe(); },
		m1cockDesc : function() { return enc.male.FirstCock().Short(); },
		m1multiCockDesc : function() { return enc.male.MultiCockDesc(); },
		m1anusDesc : function() { return enc.male.Butt().AnalShort(); },
		p1name     : function() { return member1.name; },
		p1hisher   : function() { return member1.hisher(); },
		p1armor    : function() { return member1.ArmorDesc(); }
	};
	
	
	var scenes = new EncounterTable();
	// DISS
	scenes.AddEnc(function() {
		if(player.FirstVag())
			Text.AddOutput("His eyes narrow uncertainly, and you hear him <i>sniff</i> a few times. Abruptly he shoves one hand down under your male attributes. You feel a finger drag across the entrance to your [vagDesc], and he snorts. <i>\"A real shame you're... spoiled,\"</i> he mutters, dropping you to the ground, picking up his weapon and walking away.", parse);
		else
			Text.AddOutput("His eyes seem to darken, and his face falls. He snorts, and drops you to the ground. <i>\"Figures, not even a cunt worth fucking,\"</i> he growls, picking up his weapon, walking away.", parse);
		Text.Newline();
		Text.AddOutput("You're not sure whether you're glad to have gotten away unscathed, or offended. Out of nowhere the butt of his weapon collides with your head, and you black out entirely.", parse);
		
		player.AddLustFraction(-0.05);
		Gui.NextPrompt(enc.finalize);
	});
	// ORAL
	scenes.AddEnc(function() {
		Text.AddOutput("He snorts, looking at you. [m1Name] glowers at you, his eyes piercing into yours.", parse);
		if(!player.FirstVag())
			Text.AddOutput(" <i>\"Guess you don't have a cunt, but a mouth's a mouth.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("He drops you to the ground. Before you can so much as push yourself into a sitting position, one scaled hand slides under your arm, the other coming to the back of your [hairDesc]. A slick, hot presence pushes against your lips and pops them open, sliding rapidly through at the same time as a second, throbbing appendage slides against your face. The sight of the reptile's groin fills your vision as one of his [m1cockDesc] fills your startled face. <i>\"Bite down and you'll <b>regret</b> it,\"</i> he warns. You gulp around his invading flesh, looking up at the menacing, armored creature staring down at you. He rumbles in approval as your mouth constricts around his [m1cockDesc].", parse);
		Text.Newline();
		Text.AddOutput("You can feel it on your tongue, sliding between your lips. His other grinds against your [faceDesc] slickly, smearing slime over it. The hand on the back of your head keeps you from pulling off of him, and the reptile's dangerous form towering above you reminds you exactly why you should be doing what he says. He holds you there, one [m1cockDesc] resting between your lips, pulsing softly on your tongue. It tastes tangy and slightly earthy, the exotic flavor smearing over your taste buds. Ridges cover the side of his heavy meat, and he wastes no time in forcing each and every one past your lips.", parse);
		Text.Newline();
		Text.AddOutput("Before long you feel his tip mash up against the back of your throat, and you gag around it. His other tip bumps against one of your [earDesc]. He chuckles, holding you in place for a second. You gulp heavily around his [m1cockDesc], your nose pressed almost to his armored groin. A heady musk fills each of your breaths. Thankfully, before it gets too bad, he rolls his hips back, looking down at you.", parse);
		Text.Newline();
		
		var scenes2 = new EncounterTable();
		scenes2.AddEnc(function() {
			if(player.body.HasLongSnout())
				Text.AddOutput("<i>\"Just the right size for my dick. You got your muzzle just for this, didn't you?\"</i>", parse);
			else
				Text.AddOutput("<i>\"What a pretty little mouth you have... Shame it's not a snout, I might be able to fit it all in, then.\"</i>", parse);
		}, 3.0);
		scenes2.AddEnc(function() {
			Text.AddOutput("<i>\"And here I thought all [playerRace]s were bad at sucking cock.\"</i>", parse);
		}, 4.0);
		scenes2.AddEnc(function() {
			Text.AddOutput("<i>\"Such a pushover. Hope you like the taste, you're going to get it every time you run into my kind.\"</i>", parse);
		}, 3.0);
		scenes2.Get();
		
		Text.AddOutput(" With a smirk, he pushes his hips forwards, burying his [m1cockDesc] into your face, letting every inch of it he can fit press into your mouth. Red faced, you close your eyes. You can't push his thick rod out from your lips, and you realize that doing poorly will just make him go even harder. What should you do?", parse);
		
		//[Give in][Resist]
		var options = new Array();
		options.push({ nameStr : "Give in",
			func : function() {
				player.AddLustFraction(0.15);
				Text.Clear();
				Text.AddOutput("With a heavy swallow that seems to leave his slime trickling down your throat, you resign yourself to pleasuring the reptile. You open your eyes, taking a deep breath as his thick rod pulls halfway out. Gazing up at him, you see him grinning toothily down at you as your tongue begins to lap at his tip. <i>\"That's better. Get sucking,\"</i> he growls. You drop your eyes shamefully, giving a mumble of assent.", parse);
				Text.Newline();
				Text.AddOutput("You push your face forward freely, taking his [m1cockDesc] deeper into your mouth. He groans softly as you willingly get into the act. He pushes his hips forwards, and you meet him halfway. His tip bumps against the back of your throat, and you carefully, gently angle your head to give him the best angle. He seems to understand exactly what you're doing, and takes full advantage of it. With a roll of his hips, the last couple of inches sink into your mouth, your lips meeting his groin. At the same time, you feel his slimy, fat [m1cockDesc] push into your throat. Your muscles protest, but he doesn't seem to care.", parse);
				Text.Newline();
				
				player.FuckOral(player.Mouth(), enc.male.FirstCock(), 2);
				
				Text.AddOutput("The side of your face feels wet with his slick fluids. You swallow reflexively, and it elicits a soft moan from him. The noise sends a thrill through your body, abashed as it is. He steps forwards, straddling your face and beginning to slowly, steadily hump your mouth. You kneel there, letting the reptile abuse your mouth freely, his scaled groin taking up your entire vision.", parse);
				Text.Newline();
				
				if(player.FirstVag())
					Text.AddOutput("You let your hand trail down to your groin, feeling tempted to join in the reptile's sensations... but the way that his shaft fills your face so entirely, its partner smearing the scaled creature's fluids over your [faceDesc] leaves you feeling an itch for something... else. Your hand trails lower, between your legs. Your fingers brush the wet folds of your [vagDesc], beginning to stroke across them, one finger just beginning to plumb your aching depths.", parse);
				else if(player.NumCocks() > 1)
					Text.AddOutput("Your hand trails down to your groin, where you let it find your favorite dick. Slowly you squeeze it, blushing yet deeper as you feel precum start to drip from multiple tips.", parse);
				else
					Text.AddOutput("You let your hand trail down to your [cockDesc], feeling yourself harden.", parse);
				Text.Newline();
				Text.AddOutput("Despite the position, the way his shaft slides over your tongue feels sinfully good. Before long, you find yourself pumping away at yourself as he pistons his heavy meat in and out of your maw. Finally, he grips your head tightly in both hands, and <i>rams</i> your face onto his crotch, his legs spread and tail arched in bliss. You feel his [m1cockDesc] spasm heavily, and thick bulges run down his shaft... emptying right into your throat. You can't even taste it, though you realize you want to. You just feel his potent cum flooding your throat, sliding down to your belly, its partner spraying sticky, oddly thick fluids across your [faceDesc]. <i>\"Drink up,\"</i> the lizard hisses, holding you there. ", parse);
				if(player.FirstVag())
					Text.AddOutput("You do so obediently, still pumping at yourself eagerly.", parse);
				else
					Text.AddOutput("You do so obediently, still fingering yourself dazedly.", parse);
				Text.Newline();
				Text.AddOutput("Finally, he lets go... and draws his [m1multiCockDesc] back. The tip of one pops from your lips, and he smirks down at you. <i>\"Next time, skip the fight, I love a good cocksucker,\"</i> he mutters. You drop to the ground, feeling mixed fluids dripping from your lips and face. You lick them up, trying to taste him. Dropping to the ground, you keep working at yourself eagerly. He picks up his weapon and turns, gesturing to the rest of his party.", parse);
				Text.Newline();
				if(!party.Alone()) {
					Text.AddOutput("The lizards leave you and your companion[s], [group] looking smugly satisfied. You doubt that you were the only one to be used...", {s: party.Two() ? "" : "s", group: enc.third ? "all" : "both"});
					Text.Newline();
				}
				Text.AddOutput("They follow him off. Just as you find yourself reaching climax, a sharp blow to your head sends you into blackness. The last thought you have before unconsciousness claims you is how badly you need to get off.", parse);
				Text.Newline();
				
				player.AddLustFraction(0.25);
				Gui.NextPrompt(enc.finalize);
			}, enabled : true,
			tooltip : "There's no point fighting with his cock already halfway down your throat..."
		});
		options.push({ nameStr : "Resist",
			func : function() {
				player.AddLustFraction(-0.05);
				Text.Clear();
				Text.AddOutput("You open your eyes, glaring up at him. He looks down at you with a glare of his own. He snorts again, and grips your head. Thrusting into your mouth roughly, you find your throat beginning to ache. He goes hard and fast, and his spaded tip digs into the muscles of your throat painfully. Even so, you don't give in. Your body is your own, and if he wants pleasure from it, then he'll have to fight for every drop.", parse);
				Text.Newline();
				Text.AddOutput("[m1Name] holds your face steady for a while more, his slimy, dripping dick grinding into your tongue and across your [faceDesc]. The taste is strange, and you can't get rid of it. It's hard to avoid gagging. Suddenly, he grips your cheeks tighter still, thrusting his hips forwards.", parse);
				Text.Newline();
				Text.AddOutput("His [m1cockDesc] rams against your throat. He smirks down at you, holding the pressure steady. Your eyes widen as you realize... he isn't pulling back! You <i>writhe</i> on his dick, but it's no use. Your throat stretches around his thick tip, and your mouth slides further down his shaft. Your lips meet his scaled groin, and he forces you to lewdly kiss it, rubbing it against your mouth. You feel his [m1cockDesc] throb again, and your eyes cross.", parse);
				Text.Newline();
				Text.AddOutput("H-he isn't. He can't be...");
				Text.Newline();
				Text.AddOutput("You swallow shamefully as you feel the first thick pulse of slime travel down his shaft, spilling into your throat. Thick, sticky ooze pumps down your gullet as he holds you there, and you can't even resist swallowing the creature's vile seed. You can feel your belly <i>filling</i> with it, even as the reptile's other shaft sends equally hot, viscous slime splattering over your face.", parse);
				Text.Newline();
				
				player.FuckOral(player.Mouth(), enc.male.FirstCock(), 1);
				
				var scenes2 = new EncounterTable();
				scenes2.AddEnc(function() {
					Text.AddOutput("Right near the end though, he jerks his hips back. Your sore throat contracts, leaving you feeling normal again. Unfortunately [m1name] is still in the throes of orgasm, and with a shift of his hips you find <i>both</i> of his fat tips pressed between your lips. You feel his sticky slime pumping across your tongue, filling your cheeks quickly. It tastes bitter and salty, and strangely thick, as though there isn't much water in it. The thick, custard-like slime fills your mouth until you're forced to swallow it just to breathe. With a sickening gulp, you feel the sludge trickling down your throat. He smirks down at you, popping his tips free as you swallow, letting the last few ropes paint your face.", parse);
					Text.Newline();
					Text.AddOutput("He pushes you to the ground, and picks up his weapon. You gulp down sweet air, looking around.", parse);
					Text.Newline();
					if(!party.Alone()) {
						Text.AddOutput("You can see that you're not the only one to have been humiliated. [p1name] has [p1hisher] [p1armor] splattered with a fluid you don't care to think about.", parse);
						Text.Newline();
					}
					Text.AddOutput("[m1Name] looks down at you. He snorts, before swinging the butt of his weapon toward you one more time. You try to dodge it, but still feel too dazed to.", parse);
					Text.Newline();
					Text.AddOutput("The blunt end strikes your temple, and you black out.", parse);
				});
				scenes2.AddEnc(function() {
					Text.AddOutput("He holds you there, each rope pumping down your throat. You look up at him, waiting for him to pull out... Yet even as his climax ends, he just holds you there. You begin to writhe, to squirm, trying to push him off. He easily overpowers you, holding you there. You gasp for air, but his [m1cockdesc] plugs your throat. You find yourself feeling faint. He smirks down at you. Dimly you hear him say, <i>\"Maybe next time you'll learn to suck better.\"</i>", parse);
					Text.Newline();
					Text.AddOutput("You pass out...", parse);
					
					player.AddLustFraction(-0.1);
				});
				scenes2.Get();
				
				Gui.NextPrompt(enc.finalize);
			}, enabled : true,
			tooltip : "You're not giving this monster pleasure without another fight!"
		});
		Gui.SetButtonsFromList(options);
	});
	// ANAL FUCK
	scenes.AddEnc(function() {
		Text.AddOutput("His eyes light up as he sees your [cockDesc]. He grins a toothy smile. <i>\"Well, looks like my lucky day. Been too many females around lately, you have no idea how much I've been wanting a chance like this.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("You don't quite know what he means, exactly, but the guesses you can make leave a sinking feeling in your stomach. He pushes you to the ground.", parse);
		Text.Newline();
		
		var scenes2 = new EncounterTable();
		// 25%, fuck him
		scenes2.AddEnc(function() {
			Text.AddOutput("His claws push your back into the ground, and his nostrils flare. His feet step on your [feetDesc], splaying your legs to either side. He comes to a crouch between your legs, looking down at you with a hungry glint in his eyes.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"What..?\"</i> you ask, letting out a quivering breath. He grins.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Shut up. Today's your lucky day. Say another word though, and I'll fuck your ass till you pass out. I don't <b>need</b> this.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("You nod quickly, quieting down. You watch on in a mixture of fear and trepidation as [m1name] focuses on your [cockDesc]. His hungry eyes watch your [cockDesc] as it rests there. One scaled hand comes up to it, and you feel cool fingers wrap around your shaft, giving it a few tentative squeezes.", parse);
			Text.Newline();
			if(player.HasBalls()) {
				Text.AddOutput("He smirks, his fingers trailing down, coming to cup your [ballsDesc]. You feel him give them a series of slow, sensual squeezes, tugging them slightly. <i>\"So warm...\"</i>", parse);
				Text.Newline();
			}
			Text.AddOutput("He draws his hand back, before licking his lips. Almost in disbelief, you watch as his head lowers down. His muzzle bumps against your [cockDesc], and you feel a warm, wet tongue flicker out, brushing against your tip. His lips part, and he draws your shaft into his mouth. A deep warmth envelops it, and he quickly begins to slurp and suckle on you. Before long, you find yourself growing helplessly hard. You don't mind too much, though.", parse);
			Text.Newline();
			
			player.AddLustFraction(0.15);
			
			if(!party.Alone()) {
				Text.AddOutput("A quick glance around at your team shows that you have by far the best fate.", parse);
				Text.Newline();
			}
			Text.AddOutput("When you find yourself at full attention, [m1name] pulls himself off, sniffing your [cockDesc] lightly, as though relishing the scent. Without a word, he slides across your body, moving toward your chest.", parse);
			Text.Newline();
			Text.AddOutput("He stops halfway, just above your groin. He grins at you. You feel a scaled hand grip your shaft, angling it upwards, and you can see his [m1anusDesc] hovering just above your [cockDesc]. <i>\"Not a word.\"</i>", parse);
			Text.Newline();
			Text.AddOutput("You clamp your mouth shut, watching in trepidation as he positions himself. Satisfied, he closes his slitted eyes, before simply... dropping. You feel your [cockDesc] meet his cool pucker, before it simply parts. Gravity does the rest, and his [m1anusDesc] quickly meets your groin. You can't hold back a sharp gasp of breath as you feel your shaft sink into his surprisingly warm confines. His tail rests between your legs, and he holds himself there with your shaft embedded inside his reptilian body.", parse);
			Text.Newline();
			
			var virgin = enc.male.Butt().virgin;
			player.Fuck(player.FirstCock(), virgin ? 5 : 3);
			enc.male.FuckAnal(enc.male.Butt(), player.FirstCock());
			
			if(virgin)
				Text.AddOutput("<i>\"Ahhh...\"</i> he hisses, slightly pained. <i>\"That it would feel so good, I had no idea...\"</i>", parse);
			else if(player.FirstCock().Size() > 75)
				Text.AddOutput("<i>\"Oh, just... right,\"</i> he hisses.", parse);
			else
				Text.AddOutput("<i>\"This all you got?\"</i> he shakes his head, seeming almost disappointed.", parse);
			Text.Newline();
			Text.AddOutput("Slowly he builds up a pace, bouncing up and down on your [cockDesc]. His hand presses against your belly as he rocks himself on your aching length, working you quickly to the edge. His own [m1multiCockDesc] bob in front of you almost hypnotically, and between the lewd motion and the pleasure of having his [m1anusDesc] squeezing around your shaft you quickly find yourself moving with him, aching for release.", parse);
			Text.Newline();
			Text.AddOutput("It comes quickly, and in just a few short minutes, you feel the bubbling pressure building to a crescendo inside you.", parse);
			if(player.HasBalls())
				Text.AddOutput(" Your [ballsDesc] tighten, and you feel [m1name] grip your hips tightly.", parse);
			Text.Newline();
			Text.AddOutput("[m1Name] leans forwards, and you feel both of his [m1cockDesc] push against your stomach. Your every muscle tenses, and you feel yourself tumbling over the edge as your spunk surges through your [cockDesc]. You feel spurt after spurt flood [m1name]'s body, and the reptile groans, his eyes fluttering open. <i>\"Yessss...\"</i> he hisses, still rocking atop you.", parse);

			Gui.NextPrompt(function() {
				Text.Clear();
				player.AddLustFraction(-1);
				
				Text.AddOutput("Finally your climax passes, and you grin at him. He smirks at you, still riding. It takes you a moment to realize that he isn't finished... and even though you feel yourself beginning to soften, he keeps up the pace. Before long, you find yourself helplessly hardening under the stimulation. Your hypersensitive [cockDesc] protests, but he doesn't seem to care.", parse);
				Text.Newline();
				Text.AddOutput("He holds you there as you writhe, trying to pull away. <i>\"Uh-uh. I won, you're <b>mine</b>, and <b>I</b> say when you stop cumming,\"</i> he growls. You can only whimper as he works your body to exhaustion...", parse);
				Text.Newline();
				parse.climaxNr = Math.floor(player.stamina.Get() / 5);
				if(parse.climaxNr < 4) parse.climaxNr = 4;
				if(parse.climaxNr > 21) parse.climaxNr = 21;
				Text.AddOutput("After your [climaxNr]th climax, you find yourself growing faint... and black out, still with [m1name] milking your [cockDesc], even though you're only shooting blanks now...", parse);
				Gui.NextPrompt(enc.finalize);
			});
		}, 1.0, function() { return player.FirstCock(); });
		// 75%, get fucked
		scenes2.AddEnc(function() {
			Text.AddOutput("His claws find your [buttDesc], and he turns you around onto your stomach. You feel him slide up behind you. <i>\"Mmh...\"</i> he groans softly.", parse);
			Text.Newline();
			Text.AddOutput("He leans over your back, and you feel his heavy [m1multiCockDesc] flop down between your pert cheeks. His hulking form looms over you, and you feel his muzzle slide up beside your ear. <i>\"[MalesHerms] feel so much better than females,\"</i> he whispers in your ear. You feel his hips draw back. In one swift roll of his hips, you feel a thick, slimy <i>presence</i> spear itself through your [anusDesc], the [m1cockDesc] squishing up deep inside your body.", parse);
			Text.Newline();
			
			player.FuckAnal(player.Butt(), enc.male.FirstCock(), 3);
			
			Text.AddOutput("Spots burst in front of your eyes, and you find yourself clutching weakly at the air as your [anusDesc] adjusts to his aching size. A deep, satisfied rumble sounds from his throat, and his hands squeeze your rump cheeks, kneading them like dough. He draws his hips back, the pulsing flesh of his cock surprisingly hotter than the rest of his body. You feel it slide slickly out of your sphincter, before he bucks his hips forward again. Once more you feel a warm, heavy pressure fill your [anusDesc], and he grunts. <i>\"Oh yeah... You feel so good... I'm gonna do this <b>every</b> time...\"</i>", parse);
			Text.Newline();
			Text.AddOutput("Cool scales press up against your [buttDesc], and he rocks himself against your body, using his groin to smear the lubricating slime that covered his shaft across your rear. Soon he picks up the pace, beginning to lose himself to the pleasure your body gives him... and before long, you find that his oddly ridged length is battering at your prostate, sending your own [cockDesc] surging to life. The alien feel of his dick deep inside you gradually gets less and less painful, and by the time you feel his [m1cockDesc] throbbing powerfully inside of you, you find it hard to suppress a moan. <i>\"That's right, you love this, little slut...\"</i>", parse);
			Text.Newline();
			
			
			if(Math.random() < 0.6) {
				Text.AddOutput("Halfway through, his right hand leaves your [buttDesc], sliding down between your legs. His cool hand wraps around your [cockDesc], and he begins to pump wildly, seemingly uncaring as to how rough he goes. Your eyes snap open wide, and you find yourself unable to keep from clenching around his thick [m1cockDesc] as he gropes your hanging shaft.", parse);
				Text.Newline();
				Text.AddOutput("That seems to be what he wanted, though, and as your wildly squeezing [anusDesc] clenches around the ridges of his [m1cockDesc], he lets go again. His free hand pats your [buttDesc]. <i>\"Maybe when you win, you'll get to finish...\"</i>", parse);
				Text.Newline();
				
				player.AddLustFraction(0.1);
			}
			
			Text.AddOutput("Finally, with a powerful thrust of his hips, his [m1cockDesc] slams deep into your body. [m1Name] howls out, a bestial cry that makes a shudder run down your spine. He roughly squeezes your [buttDesc], rocking his hips against you. You feel his two shafts pulsing heavily, before thick, warm fluid starts to coat your back and fill your [anusDesc]. Deeper and deeper his seed spills into your body, until he simply... pushes you off, jerking his [m1cockDesc] out from you and leaving you in the dirt. A few, last ropes splatter over your body as he picks up his weapon, before turning and walking away. Exhausted and quivering from your cruelly teased arousal, you roll onto your back and consign yourself to rest.", parse);
			Text.Newline();
			
			if(!party.Alone())
				Text.AddOutput("Dimly, you can hear the other reptile[s] finishing with [party], leaving [all] of you in a similar state...", { s: enc.third ? "s" : "", party: party.Two() ? member1.name : "your group", all: party.Two() ? "both" : "all" });
			player.AddLustFraction(0.2);
			Gui.NextPrompt(enc.finalize);
		}, 3.0);
		scenes2.Get();
	});
	scenes.Get();
}

Scenes.Lizards.LossFemale = function() {
	Text.Clear();
	
	var enc = this;
	var member1 = party.members[1];
	
	var parse = {
		playerName   : player.name,
		breastDesc   : function() { return player.FirstBreastRow().Short(); },
		vagDesc      : function() { return player.FirstVag().Short(); },
		clitDesc     : function() { return player.FirstVag().ClitShort(); },
		numCocks     : function() { return player.MultiCockDesc(); },
		cockDesc     : function() { return player.FirstCock().Short(); },
		armorDesc    : function() { return player.ArmorDesc(); },
		faceDesc     : function() { return player.FaceDesc(); },
		race         : function() { return player.body.RaceStr(); },
		tongueDesc   : function() { return player.TongueDesc(); },
		hairDesc     : function() { return player.Hair().Short(); },
		boygirl      : function() { return player.body.femininity.Get() > 0 ? "girl" : "boy"; },
		m1Name       : function() { return enc.female.NameDesc(); },
		m1name       : function() { return enc.female.nameDesc(); },
		m1hisher     : function() { return enc.female.hisher(); },
		m1HeShe      : function() { return enc.female.HeShe(); },
		m1heshe      : function() { return enc.female.heshe(); },
		m1breastDesc : function() { return enc.female.FirstBreastRow().Short(); },
		m1vagDesc    : function() { return enc.female.FirstVag().Short(); },
		m1clitDesc   : function() { return enc.female.FirstVag().ClitShort(); },
		p1name       : function() { return member1.name; },
		p1heshe      : function() { return member1.heshe(); },
		p1himher     : function() { return member1.himher(); }
	};
	
	
	Text.AddOutput("The reptile holds you steady, and you glance up and down the creature's body. The [m1breastDesc] she has almost hypnotize you while her hair falls silkily as she moves, and you swallow, unsure of what she might do with you.", parse);
	Text.Newline();
	if(player.Armor())
		Text.AddOutput("She looks you over before reaching out with one clawed hand. She makes short work of your [armorDesc]. ", parse);
	Text.AddOutput("With a smirk, she pushes you to the ground.", parse);
	Text.Newline();
	
	
	var scenes = new EncounterTable();
	// ORAL RAPE
	scenes.AddEnc(function() {
		Text.AddOutput("You grunt as your back hits the ground. When you look up, you see the reptile standing over you, her scant underwear already gone. She smirks down at you, your vision taken up mostly by her yellow-green scaled groin. She crouches down, straddling your face. You blush, trying to turn your head away, but her thighs close around your [faceDesc].", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Uh-uh. You're going to be a good [boygirl],\"</i> she hisses. You find your nose pressed right against her groin. This close, you can see the vague cleft where her [m1vagDesc] must be, her physiology keeping it hidden and protected from the desert sand when not in use... something she seems very keen to remedy. <i>\"Get to work...\"</i>", parse);
		Text.Newline();
		Text.AddOutput("You swallow heavily, and look up at her. She gazes down at you with a mixture of smugness and threatening expectancy. The scent of her fills your nose, and you find it hard to say no.", parse);
		Text.Newline();
		Text.AddOutput("The heady, soft aroma floods your [faceDesc], and you quiver softly at it. ", parse);
		if(player.NumAttributes(Race.lizard) > 2) {
			Text.AddOutput("Her pheromones have a potent effect on your body, and you feel heat building between your own legs. She gazes down at you knowingly, one hand lowering to trace across your brow. <i>\"That's right, just breathe deeply, let it take hold...\"</i>", parse);
			Text.Newline();
			Text.AddOutput("You blush, realizing you're falling under the spell of [m1name].", parse);
		}
		else
			Text.AddOutput("Her scent is exotic and strange, almost like a foreign spice. You find yourself entranced by it, though it doesn't have a strong effect on your body. You swallow heavily, and slowly bring your [faceDesc] toward her scaled slit.", parse);
		Text.Newline();
		Text.AddOutput("You find your tongue slipping out from between your lips, shakily bringing it to her [m1vagDesc], brushing gently against the cool folds there. She lets out a low, rumbling croon and presses herself forwards, knees on either side of your head. Her black hair tumbles forwards around her yellow-green muzzle, and she presses her scaled cunt right to your lips.", parse);
		Text.Newline();
		Text.AddOutput("You feel yourself licking softly at her slit, your [tongueDesc] sliding up against her, tasting her outer folds. Sinking deeper, you press your tongue harder against her body, and feel it slip between her moistening folds. As your wet, slick tongue slithers into her [m1vagDesc], [m1name] gives a soft moan and grinds her pussy into your mouth. Encouraged by her response, you let your tongue sink deeper into her, feeling her walls contract and squeeze down around you.", parse);
		
		player.FuckOral(player.Mouth(), enc.female.FirstVag(), 2);
		
		Gui.NextPrompt(function() {
			Text.Clear();
			
			Text.AddOutput("You press your [faceDesc] against her heated [m1vagDesc] as her legs slide closed around your head.", parse);
			Text.Newline();
			
			var horns = player.HasHorns();
			if(horns) {
				parse.hornDesc = horns.Long();
				Text.AddOutput("She reaches down and grabs onto your [hornDesc], holding on tightly and pressing you harder against her [m1vagDesc], a soft, breathy groan escaping her snout. Her eyes flutter shut, and you feel your [faceDesc] grow warm from her now wet pussy. Holding onto you by your horns, she uses your mouth almost like a personal toy, her lips clenching down around your tongue.", parse);
				Text.Newline();
				player.AddLustFraction(0.1);
			}
			
			if(player.LustLevel() > 0.6) {
				Text.AddOutput("You find it hard to contain yourself now, and you start to push deeper into her. The sensations, the scents, the achingly delectable feel of her slippery tunnel squeezing around your tongue, it's all too much. You give in to pleasuring her, finding yourself growing quickly aroused as well...", parse);
				Text.Newline();
				player.AddLustFraction(0.05);
			}
			Text.AddOutput("You flicker your tongue through her lips and begin to tongue-fuck her slick, warm vent. She gasps in surprise, and presses harder against you. You take a deep, long breath of her scents and flick your tongue upwards, trying to brush against her clit.", parse);
			Text.Newline();
			
			if(player.dexterity.Get() > 25)
				Text.AddOutput("You easily curl your tongue out from your lips, letting it slither up to [m1name]'s bud of flesh, flicking your heated muscle against it. She groans out in delight. <i>\"Oh, yesssss,\"</i> she whispers, her words slipping into a long hiss of pleasure. Her slick walls clamp around your tongue, and you soon abandon her [m1clitDesc] to plunge yourself back into her sensual, heated passage...", parse);
			else
				Text.AddOutput("Unfortunately, you're just not dextrous enough to reach... Grunting in frustration, you let your tongue slurp back into her slimy passage, tonguing her ever more deeply.", parse);
			Text.Newline();
			
			if(player.body.HasLongSnout()) {
				Text.AddOutput("Finally, you can hear her breathing growing erratic, and know she must be close. You lap at her trickling juices, slurping on her wet cunt. Her legs spasm and clench around your head, and she holds your head tightly in her hands. Suddenly, her walls squeeze tightly around you, and she lets out a long, aching moan.", parse);
				Text.Newline();
				Text.AddOutput("Before you can do anything more, she <i>rams</i> your head forwards, pushing your muzzle not against her dripping cunt, but <i>into</i> it. Your eyes snap open in surprise, but it's too late. Your nose fills with the thick, heady scent of her sex, and your tongue is forced deeper into her body.", parse);
				Text.Newline();
				Text.AddOutput("[m1Name] moans loudly, her slick walls squeezing and contracting around your snout, and you find your air supply rapidly runs out. Gulping her scent and her wet juices, you try to pleasure her now not just out of lust, but the need for her to let go and grant you air.", parse);
				Text.Newline();
				Text.AddOutput("Deeper and deeper you slurp with your tongue, grinding against her walls as she roughly humps your entire muzzle. Riding your snout, you feel her warm, slick walls squeeze rhythmically around you. You push your face forwards, and feel her cunt suddenly clench down achingly tight. <i>\"You f-feel so... so g-good... insiiiiiide!\"</i> she cries, her head tilting back. Her walls spasm powerfully around your snout, rippling and squeezing you tightly.", parse);
				Text.Newline();
				Text.AddOutput("Suddenly you feel a wet gush of fluids hit your muzzle, filling your mouth and squirting out onto your face. You force your eyes shut as [m1name] squeals in delight, her quivering cunt clamping around you. Her slick, slightly sweet fluids flooding your muzzle, you gulp them down to clear your airway.", parse);
				Text.Newline();
				Text.AddOutput("For what seems like minutes she orgasms, gushes of her slippery juices coating your face and throat. Finally, she seems to calm down... and simply pulls herself off. You gasp for air, your every breath laced with her scents.", parse);
				player.AddLustFraction(0.05);
			}
			else {
				Text.AddOutput("She grips your head tightly, grinding her pussy up and down your lips. [m1Name] moans eagerly, her eyes fluttering open and shut as you eagerly lick at her dripping cunt. Her tail flickers over your body, and you feel it brush between your legs.", parse);
				Text.Newline();
				Text.AddOutput("Spurred on by her touches, you press your tongue deeper into her, lapping and slurping at her entrance. She moans softly, humping against your face slowly. <i>\"Keep it up and I'll let you taste the waters of the desert,\"</i> she whispers. You blush and inhale her scent again.", parse);
				Text.Newline();
				Text.AddOutput("On and on you slurp at her, your tongue running up and down her warm, moist pussy lips, her hips moving against you. You reach up and hold softly onto her, steadying her motions. It seems to drive her on even further, and soon the two of you are grinding away there on the sand...", parse);
				Text.Newline();
				Text.AddOutput("Finally, her breaths begin to come less and less regularly. Her [m1breastDesc] heave and her face flushes a deep red. Suddenly her [m1vagDesc] clamps down around your tongue, and she <i>squeals</i> out as a wet torrent of reptilian juices pours over your face. You quiver, swallowing every drop that floods your mouth, as the rest mats your [hairDesc] and pools behind your head.", parse);
				Text.Newline();
				Text.AddOutput("Slowing down, she shudders in her afterglow and then gradually stands. She gazes down at you, panting heavily.", parse);
			}
			Text.Newline();
			
			Text.AddOutput("She moans softly, her cunt dripping onto your face still. You look away, and she smirks down at you through red cheeks.", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Not... oh... bad,\"</i> she pants. She collects her things - and some of your money, and then quickly heads off toward her companions.", parse);
			
			player.AddLustFraction(0.3);
			Gui.NextPrompt(enc.finalize);
		});
	}, 1.0);
	// GENDER SPECIFIC SCENES (COCK)
	scenes.AddEnc(function() {
		Text.AddOutput("Finding yourself flat on your back, she steps over you, reaching down and dropping her scant clothing.", parse);
		if(player.LustLevel() > 0.5)
			Text.AddOutput("You blush, your [numCocks] already hard from her coy behavior, and she smirks sultrily down at you. Right where she wants you, you can do little but look down as she slides over your body, straddling your hips.", parse);
		else
			Text.AddOutput("You look away, trying not to give her what she wants. But [m1name] doesn't seem to be taking 'no' for an answer, and slides across your body, straddling your hips.", parse);
		Text.Newline();
		
		if(player.FirstBreastRow().size.Get() >= 3)
			Text.AddOutput("Her hand presses to your [breastDesc], rubbing them slowly, sending delightful shivers through your body that feel more than a little shameful. At about the same time as she toys with your mounds, fingers tweaking and caressing your nipples, she lowers herself further...", parse);
		else
			Text.AddOutput("Her hand presses to your chest, rubbing it slowly as she lowers herself down further...", parse);
		Text.Newline();
		Text.AddOutput("You feel her [m1vagDesc] press against your ", parse);
		if(player.NumCocks() >= 3)
			Text.AddOutput("numerous, half-hard dicks, grinding the middle one along her folds.", parse);
		else if(player.NumCocks() == 2)
			Text.AddOutput("pair of thick shafts, her eyes lighting up in delight at the similarity to her own kinds' attributes. Her other hand slides down, and you feel her cool grip surround your twinned members. She presses them right against her [m1vagDesc], which seems suddenly more moist...", parse);
		else
			Text.AddOutput("heavy [cockDesc], letting out a coo of delight as it pushes against her entrance.", parse);
		Text.Newline();
		
		player.AddLustFraction(0.25);
		
		Text.AddOutput("She licks her lips, and leans forwards. Her tail lifts slightly, exposing her even further. You find yourself helplessly hard from her sensual touches. She reaches back and takes a hold of you, before aiming you upwards... and sitting down.", parse);
		Text.Newline();
		
		// TODO: Multidick
		if(player.NumCocks() == 2) {
			Text.AddOutput("You feel <i>both</i> of your [numCocks] push against her surprisingly wet, warm folds, before they easily part them. A heritage of taking two at once seems to have made her amazingly adapted...", parse);
			Text.Newline();
			Text.AddOutput("Your twin tips sink into the wet heat of her rippling passage, and her walls constrict around you. You feel your [numCocks] squish against each other and her silky confines, and she sinks deeper onto you. You roll your hips, letting out a soft moan as she lowers herself.", parse);
			player.AddLustFraction(0.15);
		}
		else {
			Text.AddOutput("You feel your dick push against her wet entrance, her eyes watching you hungrily before it simply slips in. A deep, rich <i>heat</i> grips your cock as it sinks into her, and you find yourself softly moaning in surprise. The gentle feel of her body clenching around your [cockDesc] leaves you panting, and you bite your lip.", parse);
		}
		Text.Newline();
		var virgin = enc.female.FirstVag().virgin;
		player.Fuck(player.FirstCock(), virgin ? 5 : 3);
		enc.female.FuckVag(enc.female.FirstVag(), player.FirstCock());
		
		if(virgin) {
			Text.AddOutput("<i>\"Consider yourself lucky on being my first,\"</i> she hisses, her voice a mixture of pleasure and pain.", parse);
			Text.Newline();
		}
		
		Gui.NextPrompt(function() {
			Text.Clear();
			
			Text.AddOutput("She smirks, sensing the power she has over you now. You reach out to pull her down further, but as soon as you touch her... she stops. You grip her hips and struggle to pull her down, ", parse);

			var odds = (10 + player.strength.Get()) / 100;
			if(odds > 0.95) odds = 0.95;
			
			if(Math.random() < odds) {
				Text.AddOutput("and her eyes open wide as you succeed. You let out a lusty moan as you feel your [numCocks] sink deeper into her body, and she lets out a surprised hiss, tilting her head back as you force pleasure into her slick love canal. She tenses up, her lips squeezing around you tantalizingly, your thick tip being stroked by her rippling, undulating muscles.", parse);
			}
			else {
				Text.AddOutput("but her strength outmatches yours, post-combat. She gives you a stern look, her muzzle curling into a growl. You meekly look down, grunting as her slick walls clench around you. She pushes your hands away, and ", parse);
				
				if(player.HasTail())
					Text.AddOutput("twines her tail with yours, using it to pull herself down onto your [numCocks].", parse);
				else
					Text.AddOutput("grips the side of your body, pulling herself down onto your [numCocks].", parse);
				Text.Newline();
				Text.AddOutput("She hisses out in delight, closing her eyes as her oddly warm, wet cunt squishes around your [numCocks], her fluids dripping down onto your groin.", parse);
			}

			Text.Newline();
			Text.AddOutput("Getting into it rapidly, she lifts one hand and gropes at her scaled, [m1breastDesc], her eyes lolling back as you sink deeper into her. She lifts her rump up a few inches, slickly pulling your [numCocks] out of her, the wet noises that accompany the act spurring you on further.", parse);
			Text.Newline();
			
			if(player.LustLevel() > 0.6)
				Text.AddOutput("Encouraged by her actions, you reach up and take her scaly, pert breasts in your hands, squeezing them tightly. She gasps in surprise, her loose pussy clenching slickly around you and you let out a soft moan, your precum spurting deeper into her. She gives a delighted moan, letting you toy with her [m1breastDesc], her eyes shut.", parse);
			else
				Text.AddOutput("She squeezes her [m1breastDesc] slowly, sensually as she rides you, and you find yourself steadily encouraged by the action - whatever else, it's very definitely naughty. You close your eyes and let out a long, shaky breath as her wet cunt milks your [numCocks] steadily.", parse);
			Text.Newline();
			Text.AddOutput("For what seems like ages she works over your [numCocks], humping and riding you with shameless abandon. You feel your cheeks flushed with heat, and find it hard to think straight through the pleasure she forced on you.", parse);

			player.AddLustFraction(0.1);
			
			Gui.NextPrompt(function() {
				Text.Clear();
				
				// TODO More than 2 cocks?
				if(player.NumCocks() == 2) {
					Text.AddOutput("Finally, you feel like you can't take it anymore. You let out an aching moan... and then another. Soon you're groaning wantonly, thrusting and humping back up into her, your twinned, slick shafts pulsing inside her. She opens her muzzle, and you hear her sibilant yet sweet voice sound out, <i>\"Cum in me... make me heavy with your eggs...\"</i>", parse);
					Text.Newline();
					Text.AddOutput("You blush as she orders you to finish inside of her.", parse);
					Text.Newline();
					
					player.AddSexExp(1);
					
					if(player.NumAttributes(Race.lizard) > 3)
						Text.AddOutput("<i>\"Our hatchlings will have the brightest scales,\"</i> she hisses, looking down at you. She seems to consider you lizard enough to breed with!", parse);
					else
						Text.AddOutput("<i>\"Such exotic hatchlings you'll give me,\"</i> she hisses, looking down at you. You can't help but blush an even deeper red.", parse);
					Text.Newline();
					Text.AddOutput("She grinds her [m1vagDesc] messily against your two dicks, moaning eagerly as you fill her nicely. Finally though, you can't bear it any longer... and with a long drawn, breathless moan of your own, you feel climax pound through your brain. Hot, sticky ropes of cum spurt out through each of your tips deep into her body, and you feel the pressure in your taint surging, making every jet of spunk so agonizingly wonderful to fill her with.", parse);
					Text.Newline();
					
					// CUM PRODUCTION
					if(player.CumOutput() > 3) {
						Text.AddOutput("You quickly feel your cum surging back around your [numCocks], the hot fluids coating your shafts as she rides you. Her belly seems to be bloating before your eyes as you pump your potent seed deep into her body... You cum and cum, unable to help yourself as you fill her to the brim, and her eyes simply glaze over in ecstasy.", parse);
						Text.Newline();
						Text.AddOutput("Harder and harder she rides you, until you hear her <i>shout</i> out to the air in bliss. Her wet, sloppy cunt tightens and squeezes around your pair of spurting cocks, trapping your seed even further. Her stomach grows even more, and by the time your own climax begins to die down, she looks mildly pregnant. Gasping for breath, she slumps forwards, laying atop you.", parse);
					}
					else {
						Text.AddOutput("Harder and harder she rides you, until you hear her <i>shout</i> out to the air in bliss. Her wet, sloppy cunt tightens and squeezes around your pair of spurting cocks, trapping your seed deep inside of her. She leans forwards, holding tightly onto you as she rides out her own climax, her juices making a mess of your groin.", parse);
					}
				}
				// NUMCOCKS != 2
				else {
					Text.AddOutput("She pulls herself up, lifting her heated vent until just your thick tip rests inside of her. You feel her [m1vagDesc] clench around your slick tip and find it hard to keep from moaning. She smirks down at you in delight, before plunging herself back onto you.", parse);
					Text.Newline();
					Text.AddOutput("You let out a loud gasp, which seems to spur her on even further.", parse);
					Text.Newline();
					
					if(player.FirstVag() && Math.random() < 0.5) {
						Text.AddOutput("She seems to be intent on tormenting you, though, and you see her hand move down behind her. You almost stop to ask her what she's doing, before you feel <i>exactly</i> what.", parse);
						Text.Newline();
						Text.AddOutput("Two, thick, scaled fingers press to your own wet lips, and she slowly massages your heated labia. You blush deeply, feeling your [cockDesc] pulse sympathetically. As she feels the way your dick spasms inside of her dripping cunt, [m1name] seems to settle on a course of action. You take a deep breath as you feel her fingers begin to rub and tease your [vagDesc].", parse);
						Text.Newline();
						Text.AddOutput("Her fingers move mercilessly, stroking up and down your folds, stopping to lightly brush your [clitDesc] with each motion. Every time she touches you, it makes your thick [cockDesc] pulse more achingly within her, and soon she's bouncing slowly up and down on your heavy dick as her fingers explore your feminine half.", parse);
						Text.Newline();
						Text.AddOutput("<i>\"Mmm...\"</i> she moans, her cunt clamping around your aching dick. She lifts herself up again, holding herself right at your tip. [m1Name] gives you a smirk... before dropping. You feel her wet passage engulf your dick right as her fingers straighten, and <i>plunge</i> into your wet [vagDesc]. Stars burst in front of your eyes, and you feel your body spasm. She groans delightedly, and begins to thrash about on your dense meat, her fingers filling your cunt to capacity.", parse);
						Text.Newline();
						Text.AddOutput("You can do little more than lay there in forced bliss as she abuses your [vagDesc], her fingers leaving you twitching and moaning in aching need. All the while, her own wet passage milks your [cockDesc] eagerly.", parse);
						Text.Newline();
						Text.AddOutput("Finally, it gets to be too much. You feel your climax approaching like a wave. Your eyes roll back, and you <i>howl</i> out in pleasure as your dick begins to spasm wildly, your legs thrashing behind [m1name] as your [vagDesc] clamps down around her fingers. Your juices gush around her fingers, pooling onto the ground quickly and leaving your [vagDesc] a mess. Your [cockDesc] throbs and spasms inside the reptile, and she lets out a delighted hiss, leaning forwards.", parse);
						Text.Newline();
						Text.AddOutput("Your entire body goes tense with the sensation of filling a warm female, as your own cunt is filled so wonderfully. Dimly you're aware of the reptile's own climax, her pussy mimicking your own as it squeezes around your dick.", parse);
					}
					// NOT THE HERM SCENE
					else {
						Text.AddOutput("Back and forth she rides you, grinding her scaled cunt against your groin with a delighted expression on her face. She lets out a hiss of lust, moving sensually atop you. Her slick walls squeeze your fat dick constantly, and you find yourself moving with her, bucking in. She drives you steadily toward the edge, and all you can think of is filling her reptilian womb with your seed, lacing her body with your sticky spunk.", parse);
						Text.Newline();
						Text.AddOutput("Her tight lips massage and squeeze your dick, and her hands again cup her breasts, groping and squeezing them. You lay there, watching shakily as you focus on pushing your hips up to hers, trying to push your [cockDesc] ever deeper.", parse);
						Text.Newline();
						
						// STAMINA CHECK
						var odds = (10 + player.stamina.Get()) / 100;
						if(Math.random() < odds) {
							Text.AddOutput("You piston your hips hard against hers... and seem to hit just the <i>right</i> spot. Her eyes snap open, and her face makes a surprised, silent 'Oh!'", parse);
							Text.Newline();
							Text.AddOutput("Suddenly her cunt contracts around your [cockDesc], and you feel her humping grow more and more desperate. Up and down, grinding herself along your breeding pole, she works herself into a frenzy. Then her legs clamp tightly around your hips, and she tilts her head back and <i>howls</i> out. You feel slick, warm fluids squirt out around your [cockDesc], and [m1name] shudders as her cunt milks you hungrily. Her eyes glazed, she pants heavily as her climaxing pussy spasms around your dick, quickly pumping you into your own climax.", parse);
						}
						else {
							Text.AddOutput("It gets harder and harder to resist the squeezing, slippery folds that stroke your [cockDesc], and you find yourself looking at [m1name]'s smug face as she watches you lose to her body. She swivels her hips, grinding your wet, sensitive tip right against her walls deep within her slick passage, and you can't help but moan eagerly.", parse);
							Text.Newline();
							Text.AddOutput("<i>\"Cum, little [race], you know you can't help yourself,\"</i> she coos, sounding delighted at your predicament. But she's right... You grunt, panting heavily, your breath getting louder and harder to control. You feel orgasm surging to take you, and there's nothing you can do. It hits you like a wall, and your hips jerk and you buck needily into her waiting cunt. She lets out a hiss of pleasure as you thrust almost mindlessly into her reptilian pussy, pumping rope after rope of thick cum into her waiting depths.", parse);
							Text.Newline();
							Text.AddOutput("Still unsatisfied however, she keeps riding you, extracting more pleasure from you, driving you harder.", parse);
						}
					}
				}
				Text.Newline();
				Text.AddOutput("Your brain awash with pleasure, you pass into the haze of afterglow, and soon simply pass out...", parse);
				player.AddLustFraction(-1);
				Text.Newline();
				if(!party.Alone()) {
					Text.AddOutput("You wake to [p1name] standing over you, shaking you gently. <i>\"[playerName], wake up!\"</i> [p1heshe] says. You groan softly, struggling to sit up. Looking a mess, you blush slightly, before thanking [p1himher] for helping you. Your party helps you gather your things, before you set off.", parse);
					player.AddLustFraction(0.05);
				}
				else
					Text.AddOutput("Some time later you awake, and find her gone. You gather your things slowly, before heading off again.", parse);
				
				Gui.NextPrompt(enc.finalize);
			});
		});
	}, 1.0, function() { return player.FirstCock(); });
	// GENDER SPECIFIC SCENES (VAG)
	scenes.AddEnc(function() {
		Text.AddOutput("FEMALE ON VAG", parse);
		Text.Newline();
		
		player.AddLustFraction(0.05);
		
		Gui.NextPrompt(enc.finalize);
	}, 1.0, function() { return false}); // TODO INSERT VAG SCENES HERE
	scenes.Get();
}

