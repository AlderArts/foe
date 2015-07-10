/*
 * 
 * Define Maria
 * 
 */
function Maria(storage) {
	Entity.call(this);

	// Character stats
	this.name = "Maria";
	
	this.avatar.combat = Images.maria;
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 80;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 22;
	this.dexterity.base    = 16;
	this.intelligence.base = 17;
	this.spirit.base       = 15;
	this.libido.base       = 20;
	this.charisma.base     = 18;
	
	this.level = 5;
	this.sexlevel = 3;
	this.SetExpToLevel();
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 5;
	this.SetSkinColor(Color.brown);
	this.SetHairColor(Color.black);
	this.SetEyeColor(Color.blue);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = 0;
	this.flags["DD"] = 0; //Dead drops. Bitmask
	
	this.DDtimer = new Time();

	if(storage) this.FromStorage(storage);
}
Maria.prototype = new Entity();
Maria.prototype.constructor = Maria;

Maria.DeadDrops = {
	Alert     : 1,
	Talked    : 2,
	Completed : 4,
	PaidKid   : 8
	//TODO flag for repeat, specific things (sex, royals etc.)
};

Scenes.Maria = {};

// Add initial event, only trigger 6-20
world.loc.Forest.Outskirts.enc.AddEnc(
	function() {
		return Scenes.Maria.ForestMeeting;
	}, 3.0, function() {
		return Scenes.Global.VisitedRigardGates() &&
		       !Scenes.Global.VisitedOutlaws() &&
		       (world.time.hour >= 6 && world.time.hour < 20);
   	}
);


Maria.prototype.FromStorage = function(storage) {
	this.FirstVag().virgin   = parseInt(storage.virgin) == 1;
	this.Butt().virgin       = parseInt(storage.avirgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	
	this.DDtimer.FromStorage(storage.DDtime);
}

Maria.prototype.ToStorage = function() {
	var storage = {
		virgin  : this.FirstVag().virgin ? 1 : 0,
		avirgin : this.Butt().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	storage.DDtime = this.DDtimer.ToStorage();
	
	return storage;
}


Maria.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	this.DDtimer.Dec(step);
}

// Schedule
Maria.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Outlaws.Camp)
		return (world.time.hour >= 7 && world.time.hour < 22);
	return false;
}

Maria.prototype.EligableForDeaddropAlert = function() {
	//Only in the initial phase
	if(maria.flags["DD"] != 0) return false;
	//Only when meeting the correct conditions
	if(outlaws.flags["Met"] < Outlaws.Met.Bouqet) return false;
	//Only when meeting total Outlaws rep
	return true;
}

Maria.prototype.Act = function(encounter, activeChar) {
	// TODO: AI!
	Text.Add("The huntress hops around nimbly.");
	Text.NL();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);
	
	var choice = Math.random();
	
	var trap = this.combatStatus.stats[StatusEffect.Counter];
	
	if(this.HPLevel() < 0.3 && this.pots > 0) {
		this.pots--;
		Items.Combat.HPotion.combat.Use(encounter, this, this);
	}
	else if(choice < 0.2 && Abilities.Physical.SetTrap.enabledCondition(encounter, this) && trap == null)
		Abilities.Physical.SetTrap.Use(encounter, this);
	else if(choice < 0.4 && Abilities.Physical.Hamstring.enabledCondition(encounter, this))
		Abilities.Physical.Hamstring.Use(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.FocusStrike.enabledCondition(encounter, this))
		Abilities.Physical.FocusStrike.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Ensnare.enabledCondition(encounter, this))
		Abilities.Physical.Ensnare.Use(encounter, this, t);
	else
		Abilities.Attack.Use(encounter, this, t);
}


// Camp interaction
Scenes.Maria.CampInteract = function() {
	if(outlaws.MariasBouqetAvailable()) {
		Scenes.Outlaws.MariasBouquet();
	}
	else if(maria.flags["DD"] & Maria.DeadDrops.Alert &&
	      !(maria.flags["DD"] & Maria.DeadDrops.Talked)) {
		Scenes.Maria.DeadDropInitiation();
	}
	else {
		Text.Clear(); //TODO
		Text.Add("PLACEHOLDER. Rawr Imma archer.");
		
		
		if(DEBUG) {
			Text.NL();
			Text.Add(Text.BoldColor("DEBUG: relation: " + maria.relation.Get()));
			Text.NL();
			Text.Add(Text.BoldColor("DEBUG: subDom: " + maria.subDom.Get()));
			Text.NL();
			Text.Add(Text.BoldColor("DEBUG: slut: " + maria.slut.Get()));
			Text.NL();
		}
		Text.Flush();
		
		Scenes.Maria.CampPrompt();
	}
}

Scenes.Maria.CampPrompt = function() {
	var parse = {
		
	};
	
	//[name]
	var options = new Array();
	if(cveta.flags["Met"] == Cveta.Met.MariaTalk) {
		options.push({ nameStr : "Princess",
			func : function() {
				Scenes.Cveta.MariaTalkRepeat();
			}, enabled : cveta.WakingTime(),
			tooltip : "You've changed your mind. If Maria really can't sort out this so-called princess, maybe you can."
		});
	}
	
	if(maria.flags["DD"] & Maria.DeadDrops.Talked)
	{
		options.push({ nameStr : "Dead-Drop",
			tooltip : "So, does she want to go on a little pick-up errand?",
			func : function() {
				if(maria.flags["DD"] & Maria.DeadDrops.Completed)
					Scenes.Maria.DeadDropRepeat();
				else
					Scenes.Maria.DeadDropFirst();
			}, enabled : true
		});
	}
	
	Gui.SetButtonsFromList(options, true);
}

Scenes.Maria.ForestMeeting = function() {
	Text.Clear();
	
	var parse = {
		weaponDesc : function() { return player.WeaponDesc(); },
		armorDesc  : function() { return player.ArmorDesc(); }
	};
	
	if(!party.Alone()) {
		var member = party.Get(1);
		parse.p1name = member.name;
		parse.HeShe  = member.HeShe();
	}
	
	if(maria.flags["Met"] == 0) {
		maria.flags["Met"] = 1;
		Text.Add("Off in the distance, the massive tree at the center of Eden overlooks the entire verdant area, casting long shadows and slightly eclipsing the sun. This far into the forest, the trees grow close together, and even the smallest is far too tall for you to climb. All around, the sounds of the forest pound against your ears. Up in the high branches, birds twitter at each other. Wind whistles through the limbs, brushing them against each other in a comforting melody. Dozens of unseen insects send mating songs through the air.", parse);
		Text.NL();
		Text.Add("The pleasant buzz distracts you from the soreness settling in your limbs. After a few more minutes of walking, you decide to take a break, and sit down at the base of a tree. The rough bark rubs against you through your [armorDesc]. Before long, you fall into a doze.", parse);
		Text.NL();
		Text.Add("The sound of creaking wood wakes you from your slumber. Cracking open an eye, the sight of an arrow greets you. Your eyes snap open, and you focus on the glinting tip of the arrowhead. Sliding up the shaft, then lingering on the gray-striped feathers, you look up toward the woman holding the bow. Her hands and arms are absolutely still, even under the massive tension of holding a nocked arrow.", parse);
		Text.NL();
		Text.Add("The woman's ebony skin seems to glow slightly under the dappled light. The white shirt she wears contrasts beautifully with her dark skin, and the belts holding the billowing material close to her body accentuate the curve of her bust. Stealthily eyeing her breasts, you assume them to be E-cup, and the low cut of her shirt shows a generous handful of cleavage.", parse);
		Text.NL();
		Text.Add("A cough raises your attention to the mysterious archer's face. Full, dark lips curve into a smile underneath her straight, sharp nose. Two ice-blue eyes stare back at you. Their light color almost startling you at first. A lock of black hair falls into her eyes, and she tosses her head to move it out of the way.", parse);
		Text.NL();
		if(player.Weapon()) {
			Text.Add("<i>“Throw your weapons to the side.”</i> With an arrow less than an inch from your eye, it seems safer to comply than resist. Tossing your [weaponDesc] to the side, you stand and hold your hands up in a gesture of surrender.", parse);
			Text.NL();
		}
		
		if(party.Two()) {
			Text.Add("Out of the corner of your eye, you see other bandits, much like the one holding you hostage, holding [p1name] at weapon-point. [HeShe] has been neatly disarmed. Whoever these people are, they are well trained, and well prepared for anyone that crosses their borders.", parse);
			Text.NL();
		}
		else if(!party.Alone()) {
			parse.disarm = player.Weapon() ? ", just as you have" : "";
			Text.Add("Out of the corner of your eye, you see other bandits, much like the one holding you hostage, holding your companions at weapon-point. They've each been neatly disarmed[disarm]. Whoever these people are, they are well trained, and well prepared for anyone that crosses through their borders.", parse);
			Text.NL();
		}
		Text.Add("For a while, she walks around you, checking over your body for anything you might have hidden. Her gaze seems to hover on your ass a bit longer than needed, and you give it a slight wriggle. Satisfied that you can no longer defend yourself, the stranger steps away and lowers her bow.", parse);
		if(player.Weapon())
			Text.Add(" Grabbing your weapon, she hefts it over one shoulder.", parse);
		Text.NL();
		Text.Add("Glaring at you suspiciously, she challenges you: <i>“What are you doing here?”</i> Her voice reminds you of honey and cream; soft and luxurious.", parse);
		Text.NL();
		Text.Add("After you explain that you are simply exploring the forest, she glances at you sideways. For a while, she simply watches you, clearly debating what course of action to take. She turns the options over in her head for a few minutes before she seems to reach a decision. <i>“My name is Maria. Follow me, and I'll let Zenith decide what to do with you.”</i>", parse);
	}
	else {
		Text.Add("As you walk through the forest, the soothing sounds of birdcalls dull your senses. A few clouds drift over a lazy, warm sun. After a while, a vague sense of deja vu overtakes you, and something sets off little alarms in your mind. Continuing through the thickly forested area, a sense of foreboding follows you.", parse);
		Text.NL();
		if(player.Weapon())
			Text.Add("Your hand is already hovering near the grip of your [weaponDesc], when a sudden sharp crack grabs your attention.", parse);
		else
			Text.Add("Feeling on edge, you prepare for whatever may emerge from the forested growth. Muscles twitching and tense, the sudden cracking noise behind you nearly makes you jump.", parse);
		Text.NL();
		Text.Add("Turning on your heel, you see the archer-woman, Maria, her chocolate skin stark against her white clothing. Her bow is only half-raised, but the arrow nocked in it draws your attention. She might have tried to shoot you if you hadn't turned around.", parse);
		Text.NL();
		Text.Add("<i>“You again?”</i> she asks. <i>“Do you make a habit of getting lost this deep in the forest, or did you just want to see me again?”</i> Chuckling at her own joke, Maria raises her bow. <i>“Once may be an accident, but more than once can't be. You're coming with me.”</i>", parse);
	}
	Text.Flush();
	Scenes.Maria.ForestConfront();
}

Scenes.Maria.ForestConfront = function() {
	var parse = {
		weaponDesc : function() { return player.WeaponDesc(); },
		armorDesc  : function() { return player.ArmorDesc(); }
	};
	var p1 = party.Get(1);
	
	Scenes.Maria.fight = 0; // 0 = no, 1 = won, 2 = won, sexed, 3 = lost
	
	//[Follow][Fight][Trick]
	var options = new Array();
	options.push({ nameStr : "Follow",
		func : Scenes.Maria.ForestFollow, enabled : true,
		tooltip : "Follow her."
	});
	options.push({ nameStr : "Fight",
		func : function() {
			Text.Clear();
			if(party.Alone())
				Text.Add("You've had just about enough of this presumptuous highwaywoman. Lunging forward, you tackle the archer to the ground before she has the chance to respond.", parse);
			else {
				parse.companion = party.Two() ? "companion is" : "companions are";
				parse.their     = party.Two() ? p1.hisher() : "their";
				Text.Add("You watch as your [companion] led away ahead of you, [their] captors apparently deciding on their course of action faster than Maria. You decide you've had just about enough of the presumptuous highwaywoman, and as soon as her allies are out of sight, take your chance.", parse);
				Text.NL();
				Text.Add("You lunge forward, tackling the archer to the ground before she has the chance to respond.", parse);
			}
			Text.NL();
			if(player.Weapon())
				Text.Add("Wrenching your [weaponDesc] from her hands, you jump back and prepare to fight!", parse);
			else
				Text.Add("With surprising strength, the archer shoves you to the side. You jump back, narrowly avoiding a swift kick to the shins, and prepare to fight!", parse);
			Text.Flush();
			
		 	var enemy = new Party();
			enemy.AddMember(maria);
			var enc = new Encounter(enemy);
			
			maria.RestFull();
			
			enc.oldParty = party.members;
			party.members = [player];
			
			maria.pots = 2;
			
			enc.canRun = false;
			enc.onLoss = function() {
				SetGameState(GameState.Event);
				party.members = enc.oldParty;
				Scenes.Maria.fight = 3;
				Text.Clear();
				Text.Add("You fall to the ground, utterly defeated. The archer kicks away your [weaponDesc] and levels an arrow at you. Glaring at you, she orders you to stand. As you wobble to your feet, she comes up behind you, binding your hands fast with some rope. Cold shivers run up your spine as you feel the sharp point of a knife dig into the soft flesh between your shoulder blades.", parse);
				Text.NL();
				if(maria.LustLevel() > 0.5) {
					Text.Add("Throwing you to the ground, Maria roughly pins you to the leaf-strewn forest floor. Holding you there with a foot, she strips off her laughably tiny shorts and kneels down over you. Pressing her steaming cunt into your mouth, she orders you, <i>“Lick.”</i>", parse);
					Text.NL();
					Text.Add("Without giving you a chance to answer, she presses her juicy snatch harder against your lips. As you begin lapping at her mound, she mewls quietly, clamping her thighs down around your ears and blocking out any more sound. Penetrating her warm walls with your tongue, you drill around, thrashing against the sides of her love-tunnel.", parse);
					Text.NL();
					Text.Add("Getting a wicked idea, you bump her clit with your nose, pressing and rolling it between your nose and the inflamed, red petals of her sex. After another moment, you locate her g-spot and mercilessly drive your tongue against it. You feel Maria shaking above you, and her juices fill your mouth.", parse);
					Text.NL();
					
					Sex.Cunnilingus(player, maria);
					player.Fuck(null, 2);
					maria.Fuck(null, 2);
					
					Text.Add("Standing back up, she shakily replaces her shorts. Giving you a lecherous smile, she hauls you from the floor and pushes you forward. Bound as you are, you have no choice but to follow.", parse);
				}
				else if(maria.LustLevel() > 0.25) {
					Text.Add("As she twists the ropes one more time, tugging them to make sure they're secure and won't come loose, you notice her hands straying to other parts of your form. Turning to face her, you notice her face is flushed. Whatever you did must have had quite the effect on her. Not enough of one to save you, though.", parse);
				}
				else {
					Text.Add("<i>“Move it!”</i>", parse);
				}
				
				Text.Flush();
				Gui.NextPrompt(Scenes.Maria.ForestFollow);
			};
			enc.onVictory = function() {
				SetGameState(GameState.Event);
				party.members = enc.oldParty;
				Scenes.Maria.ForestConfrontWin();
			}
			
			Gui.NextPrompt(function() {
				enc.Start();
			});
		}, enabled : true,
		tooltip : "Try to fight your captor."
	});
	options.push({ nameStr : "Trick",
		func : function() {
			Text.Clear();
			Text.Add("Though you can't fight back, you don't want to find out where this bandit wants to take you. Tossing about a few ideas, you finally decide that the best course of action is to follow her for now. As soon as you have the chance, you will slip away. For a while, she seems dead-set on watching you, but eventually Maria's attention fades. Taking advantage of her lapse in vigilance, you easily dart the other way and escape.", parse);
			Text.NL();
			if(!party.Alone()) {
				parse.companions = party.Two() ? p1.name + " rejoins" : "your companions rejoin";
				parse.they       = party.Two() ? p1.heshe() : "they";
				Text.Add("At the edge of the forest, [companions] you. Through skill or daring, [they] escaped the archer and made it back to you. In high spirits and having successfully outwitted a cunning opponent, you leave the forest.", parse);
			}
			Text.Flush();
			// END ENCOUNTER
			world.TimeStep({hour:1});
			Gui.NextPrompt(PrintDefaultOptions);
		}, enabled : true,
		tooltip : "Try to trick Maria."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Maria.ForestConfrontWin = function() {
	var parse = {
		weaponDesc : function() { return player.WeaponDesc(); },
		armorDesc  : function() { return player.ArmorDesc(); },
		cockDesc   : function() { return player.FirstCock().Short(); },
		vagDesc    : function() { return player.FirstVag().Short(); },
		clitDesc   : function() { return player.FirstVag().ClitShort(); },
		legsDesc   : function() { return player.LegsDesc(); },
		breastDesc : function() { return player.FirstBreastRow().Short(); }
	};
	
	Text.Clear();
	Scenes.Maria.fight = 1; // Won, not sexed
	
	Text.Add("Maria collapses, unable to fight any further.", parse);
	if(maria.LustLevel() > 0.75)
		Text.Add(" The bow woman's hands reach down and pull off her ass-hugging shorts. Two fingers dive into her honeypot and begin pumping fiercely.", parse);
	Text.Add(" Murder shines in her eyes, but she is unable to fight back against you.", parse);
	Text.NL();
	
	if(player.LustLevel() > 0.3) {
		Text.Add("The burning desire in your crotch only gets hotter as you stare down at Maria. You could use her to state your lust. Do you?", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Scenes.Maria.fight = 2; // Sexed
				Text.Clear();
				Text.Add("Already beaten, the archer can't rise from the ground. Quickly, you shuffle out of your [armorDesc]. Kneeling over her, you press a knee into her stomach to keep her from moving. Reaching down, you shove two of your fingers into her mouth. Wriggling them around, you order Maria to slather them in spit. Her tongue deftly wraps around each digit and strokes up and down, jacking them off like miniature cocks.", parse);
				Text.NL();
				
				if(player.FirstCock()) {
					Text.Add("You think about how nice your cock would look between her lips instead. The thought makes your [cockDesc] twitch and harden. Removing your fingers, you shove the head between her lips. Bracing yourself on the leafy ground, you thrust into her mouth, her lips parting readily to admit you. Her tongue wrestles with the member in her mouth, running the rougher side across the bottom of your shaft.", parse);
					Text.NL();
					Text.Add("A few thrusts in, you pull out of her mouth and admire the sheen of her saliva slathered on your [cockDesc]. Turning around, you force your cock back into Maria's waiting maw. Pushing her supple legs apart with one hand, you use your spit-moistened fingers to probe her depths. At the first contact, she shudders and gasps around your [cockDesc] in her mouth.", parse);
					Text.NL();
					Text.Add("Dipping your fingers further into her tight cunny, you probe around for all her most sensitive spots. Stroking along her soft, inner walls, you end up nearly so focused that you forget the squishy sensation focused around your throbbing [cockDesc]. When she suddenly moans around you, the vibrations snap you back to the present.", parse);
					Text.NL();
					Text.Add("Pulling your fingers from the archer's wanton hole, you notice her lift her legs, begging for more of the delicious friction. Tutting softly, you circle a finger around her clit. It pokes from its hood, red and engorged. She begins bucking underneath you, but you pull away before she can cum. Pulling your [cockDesc] from her mouth, you turn around.", parse);
					Text.NL();
					Text.Add("As juiced up as she is, you have no problem pounding straight into her core. Thrashing away at her slick pussy, you lose yourself in a haze of lust and feel yourself getting closer to the edge you had been skirting after her earlier oral assault. Her walls ripple around you convulsively as she cums under the assault. Moments later you glaze her insides with your liquid lust.", parse);
					
					var cum = player.OrgasmCum();
					
					Sex.Vaginal(player, maria);
					maria.FuckVag(maria.FirstVag(), player.FirstCock(), 3);
					player.Fuck(player.FirstCock(), 3);
					
					if(player.FirstVag()) {
						Text.Add(" Your [vagDesc] clenches in sympathy, and clear girlcum runs down your [legsDesc].", parse);
					}
					Text.NL();
					Text.Add("Hot semen fills her tunnel, and a tiny bit sprays back out, trailing down her inner thighs. Pulling out of the exhausted and beaten archer, you clean yourself up and put your [armorDesc] back on.", parse);
					Text.NL();
				}
				else {
					Text.Add("Pushing her supple legs apart with one hand, you use your spit-moistened fingers to probe her depths. At the first contact, she shudders and gasps loudly. Moaning into the still forest air, she writhes under your gentle pressure.", parse);
					Text.NL();
					Text.Add("Dipping your fingers further into her tight cunny, you probe around for all her most sensitive spots. Stroking along her soft, inner walls, you curl your fingers and press against the sides of her cunt. Scissoring your fingers open, you stretch her hole wide and lean down.", parse);
					Text.NL();
					Text.Add("Tutting softly, you circle a finger around her clit. It pokes from its hood, red and engorged. Curling your tongue around her clit, you flick your organ across the little pleasure nub, revelling in her frenzied moans. Pulling your fingers from the archer's wanton hole, you notice her lift her legs, begging for more of the delicious friction. She begins bucking underneath you, but you pull away before she can cum.", parse);
					Text.NL();
					if(player.FirstVag()) {
						Text.Add("By now, your own cunt is sopping with need. Turning to face your conquest, you press your steaming honeypot into hers. Your lips slide together in just the right way, and you bump your clit against hers. The feeling shoots through you like lightning, and your mouth hangs open in an O shape.", parse);
						Text.NL();
						Text.Add("Smiling, you use one hand to hold yourself steady ", parse);
						if(player.FirstBreastRow().size.Get() > 3)
							Text.Add("and the other to aggressively grope one of your [breastDesc].", parse);
						else
							Text.Add("while the other mauls one of Maria's perfect, chocolate orbs.", parse);
						Text.Add(" Bumping your clit against Maria's again, you slide down and slip your [clitDesc] between her folds. Hot lust bubbles up in your body, and your cunny starts convulsing as you cum hard on the archer-woman's rosy folds.", parse);
						Text.NL();
						
						var cum = player.OrgasmCum();
						player.AddSexExp(3);
						maria.AddSexExp(3);
					}
					Text.Add("Standing up you clean yourself up and put back on your [armorDesc].", parse);
				}
				maria.relation.IncreaseStat(100, 5);
				
				Text.Flush();
				Gui.NextPrompt(function() {
					Text.Clear();
					Scenes.Maria.ForestAftermath();
				});
			}, enabled : true,
			tooltip : "Heck yeah! This bitch has it coming!"
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.NL();
				Text.Add("You decide that now, in the middle of the forest, is perhaps not the best time for this.", parse);
				Text.NL();
				Gui.NextPrompt(Scenes.Maria.ForestAftermath);
			}, enabled : true,
			tooltip : "This isn't the time nor place."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.NL();
		Scenes.Maria.ForestAftermath();
	}
}

Scenes.Maria.ForestAftermath = function() {
	parse = {
		weaponDesc : function() { return player.WeaponDesc(); }
	};
	
	Text.Add("Reaching for her chest, Maria pulls something small from her prodigious cleavage. As she brings it up to her mouth, you realize what it is. You lunge forward, but you're too slow to stop her from blowing into the whistle. The sharp sound cuts through the murmur of the forest. All the normal wildlife sounds cease, and you hear rustling in the undergrowth around you.", parse);
	Text.NL();
	Text.Add("As you're momentarily paralyzed with indecision, a spear flies through the air, nearly impaling you. As it smashes into the ground just to your left, the thrower emerges from the bushes. A huge, jackal-headed warrior steps into the clearing, and stares you down. Behind him, a group of animal-morphs and a few humans brandish their weapons threateningly. As strong as you are, you don't think you can beat them in a fight just now.", parse);
	Text.NL();
	if(player.Weapon())
		Text.Add("Dropping your [weaponDesc], you ", parse);
	else
		Text.Add("You ");
	Text.Add("step back and raise your hands non-threateningly. An orange cat-morph steps forward and ties your hands behind your back, then forces you down onto the ground and ties your feet to your hands. Shakily, the archer rises to her feet with the help of a red-armoured, wolf-eared man. She takes the lead and heads... well, you don't know where she plans on taking you, but you're beginning to think it might not have been such a good idea to attack her.", parse);

	Text.Flush();
	Gui.NextPrompt(Scenes.Maria.ForestFollow);
}

Scenes.Maria.ForestFollow = function() {
	var parse = {};
	
	Text.Clear();
	Text.Add("You decide the best course of action is to follow Maria.", parse);
	Text.NL();
	Text.Add("Turning on her heel, Maria guides you through the massive oak trees, clambering over roots and around massive, tangled thickets with ease. She leads you through a labyrinthine assortment of vegetation, constantly switching back and forth between trails, seemingly at random. The ground under your feet begins turning softer, and the footing becomes harder to keep the longer you follow the bowwoman.", parse);
	Text.NL();
	Text.Add("As you watch her climb up and around the huge tree roots, you are treated to the lovely sight of her generous ass swaying back and forth. Her wide hips fill out the shorts she wears very tightly, accentuating each curve of her body. Thinking it through, you realize that all her clothing is cut to accentuate her form, and draw your eyes to the more delectable parts of her body.", parse);
	Text.Flush();
	
	//[Silent][Talk][Flirt]
	var options = new Array();
	options.push({ nameStr : "Silent",
		func : function() {
			Text.Clear();
			Text.Add("Having nothing in particular to say to the archer, you simply follow her quietly. Instead of wasting your breath talking, you try to watch the path she follows in an attempt to memorize the way she's taking you. Even so, within twenty minutes you are hopelessly lost.", parse);

			Scenes.Maria.ForestCamp();
		}, enabled : true,
		tooltip : "Follow her silently."
	});
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add("At first, you stay silent, wary of the archer's wrath, but, eventually, you decide that, since you can do little else, you might as well ask her some questions. When you first speak, she jumps a little, as if she didn't expect you to speak along the way. Most of your questions she either outright ignores, or answers vaguely at best. Until, that is, you ask her about precisely where she comes from.", parse);
			Text.NL();
			Text.Add("<i>“I'm part of the outlaws out here. We're forced to live in this forest because those xenophobic assholes up at the City don't want us around. Well, that and more than one of us have broken their laws. Either we choose to live by <b>their</b> rules, or we make do with our own codes out in the forest. Some of our band were actually evicted from the city for crimes, others simply for not being pure human.”</i>", parse);
			Text.NL();
			Text.Add("She does not say any more, and the rest of your questions are answered with silence. Though she hasn't killed you, it seems she doesn't trust you enough to tell you anything.", parse);
			
			maria.relation.IncreaseStat(100, 3);
			
			Scenes.Maria.ForestCamp();
		}, enabled : true,
		tooltip : "Ask her some questions as you walk."
	});
	options.push({ nameStr : "Flirt",
		func : function() {
			Text.Clear();
			Text.Add("Watching her move her body enticingly, you strike up a conversation with the buxom bandit. First the topic stays on innocuous things. Before long, you begin talking about Maria, and you compliment her on her generous cleavage.", parse);
			Text.NL();
			
			if(Scenes.Maria.fight == 2) {
				Text.Add("Scowling at you, the archer slaps you. Stinging pain explodes across your face, and you wince, blinking back tears at the unexpected force. Ordering you to stay silent, Maria refuses to even acknowledge your existence from that point forward. You do notice, however, that her cheeks became quite flushed at your comment. You resolve to try and win her affections later, when you've made up for your offense.", parse);		
				maria.relation.IncreaseStat(100, 2);
			}
			else {
				Text.Add("Warming up slightly, Maria slows down a bit, exaggerating her motions. Each sway of her hips is accompanied by the jiggle of her breasts. Looking over at you, she smirks subtly. Though she put on this show to torment you, you notice a pink blush running up her cheeks. She likes that you're looking at her. Filing that information away for later, you take in the motion of her body, ogling her perky chest and curvaceous ass.", parse);
				maria.relation.IncreaseStat(100, 5);
			}
				
			Scenes.Maria.ForestCamp();
		}, enabled : true,
		tooltip : "You decide to flirt with the busty woman."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Maria.ForestCamp = function() {
	parse = {
		num        : Text.NumToText(party.Num() + 2),
		playername : player.name,
		HeShe      : player.mfTrue("He", "She"),
		himher     : player.mfTrue("him", "her"),
		hisher     : player.mfTrue("his", "her")
	};
	
	party.location = world.loc.Outlaws.Camp;
	
	Text.NL();
	Text.Add("She turns on you abruptly, her tits set to jiggling at the motion. She cautions you to wait here while she informs the guards of your arrival. Sitting down behind a rooty embankment, you lean against the dirt and consider your situation.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("Waiting around, you wonder exactly how you got to this part of the forest. Thinking back on the trek, you realize that there is no way for you to find your way out of the forest without Maria's help.", parse);
		if(player.Weapon())
			Text.Add(" Without your weapon, you can't force her to help you either.", parse);
		Text.Add(" Unsettled by this sudden turn of events, you nonetheless eagerly await her return. It seems she's decided to bring you to the outlaw camp you heard about. Maybe they can get you inside of the city.", parse);
		Text.NL();
		Text.Add("Once Maria finally comes back, she's followed closely by a large fox-morph wielding a greatsword. It's slung across his shoulder, resting there easily. The muscles in his arms bulge as he adjusts the way it sits on him. His russet fur ruffles in the soft wind, and you can see his muscles rippling as he moves. His yellow eyes regard you suspiciously, and his hands shift across the hilt. Maria gestures for you to follow her again, and the three of you head up over the rooty embankment. Laying eyes on the 'camp', you gasp in surprise. When you had heard a few outlaws had taken up residence in the forest, you never imagined something like this.", parse);
		Text.NL();
		Text.Add("Trees larger than most others, even this deep in the forest, block out most of the sunlight. Shafts of light scatter down through the leaves, leaving everything in a constantly shifting twilight. In front of you, a trench at least five feet wide drops straight into the ground for a ways, and the bottom holds an uncountable number of sharpened stakes. Falling down there would certainly mean death for anyone. But more impressive than any of that, is the wall.", parse);
		Text.NL();
		Text.Add("A massive wall surrounds the entire camp. It is made of whole tree trunks, wider than you are tall. Gnarled bark and huge knots cover the huge fortification. The tops of every beam are sharpened, much like those in the pit. A gap in the wall is covered by an iron grate, guarded on the outward side by a fox-morph very similar to the one glaring daggers at your back. From this far away, you can't tell what he's saying, but he shouts something to someone on the other side of the wall.", parse);
		Text.NL();
		Text.Add("Shortly after, the iron gate grinds upward, lifting just enough to let a person through. The guard by the gate and his new companion grab a large, wooden construct. A bridge. They place it over the spiked trench, and the [num] of you cross into the gateway. ", parse);
		Text.NL();
		Text.Add("The guards pick up the bridge and take it back through the gate. Inside, Maria hurries you through the camp. All around, all manner of morphs and non-morphs go about their business. The sheer number of different types astounds you. From lizard-morphs to wolf-morphs and everything between, it seems a representative of every race inhabits this bandit fort.", parse);
		Text.NL();
		Text.Add("Tents cover the ground everywhere you look. A small stream flows through the camp, and some small willow trees grow by its banks. You don't get a chance to look around further as the ebony beauty elbows you into one of the only two buildings in the camp.", parse);
		Text.NL();
		Text.Add("Inside, a large round table dominates the room. Immediately, the map lying on it grabs your attention. Different figurines stand in seemingly random places. Paper is scattered across the map table and the floor, filled by an illegible scrawl. It almost looks like another language. A door to your left opens, and out walks a very peculiar looking badger-morph.", parse);
		Text.NL();
		Text.Add("It seems that at some point his body tried to figure out which parts of him should be badger and which should be human and simply gave up. His face is mostly human, save for his nose, but small, round furry ears sit atop his head, nestled in a shock of dark black hair. The latter is divided by a single silvery-white stripe, much like that of a badger. A day’s worth of stubble covers his square jaw, and you follow the scar that starts from his chin up to his eyes, pale grey irises that fix themselves upon you distrustfully.", parse);
		Text.NL();
		Text.Add("He wears what appears to be a weird mishmash of armor types, part of a leather hauberk here, cloth padding over there, a few straps and scraps of improvised plating sewn on and holding it all together. A long scar runs down the entirety of his right arm, bare of fur. Both the ring and pinky finger of that hand are missing, leaving the hand looking lopsided, especially with the sharp claws that protrude from his fingertips. A scabbard is affixed to his belt, bearing a sturdy short sword within.", parse);
		Text.NL();
		Text.Add("A deep, sonorous bass rumbles from his chest, bringing to mind storm clouds. <i>“Maria. I see you brought a stranger to our camp.”</i> His gaze pinions your feet to the floor and you unconsciously start thinking of excuses for why you entered his territory. Before you can speak, the archer begins explaining her actions.", parse);
		Text.Flush();
		
		//[Listen][Interrupt]
		var options = new Array();
		options.push({ nameStr : "Listen",
			func : function() {
				Text.Clear();
				Text.Add("<i>“[playername] is that one we heard about from Tez'rah. The one that came from a different plane. [HeShe] didn't look so tough, so I decided to try and take [himher] down.”</i>", parse);
				Text.NL();
				
	
				// 0 = no, 1 = won, 2 = won, sexed, 3 = lost
				// IF SEXED
				if(Scenes.Maria.fight == 2) {
					Text.Add("<i>“Turns out I was wrong. [HeShe] hits pretty damn hard. After that ass-kicking, I couldn't just let [himher] go.”</i> Maria turns and glares pointedly at you. After a moment, a slight, dark flush works its way into her cheeks and she averts her eyes. <i>“What happens now is your business, Zenith.”</i>", parse);
				}
				// WON
				else if(Scenes.Maria.fight == 1) {
					Text.Add("<i>“[HeShe] actually fought better than I expected.”</i> Maria gives Zenith a pointed stare and he nods back. <i>“I'm going to need to see Aquilius after a bout like that.”</i> She seems to genuinely admire your fighting prowess, and a part of you feels proud that you managed to gain a complete stranger's respect through combat. She even ambushed you, and you still managed to fight her off.", parse);
				}
				// LOST
				else if(Scenes.Maria.fight == 3) {
					Text.Add("<i>“And I was right. [HeShe] went down like a sack of potatoes. I admire [hisher] spirit, though. That's part of why I brought [himher] back to camp.”</i>", parse);
				}
				else {
					Text.Add("<i>“[HeShe] was already close enough to camp that one of the patrols would have found [himher] soon enough if I hadn't caught [himher] first.”</i>", parse);
				}
				Text.NL();
				Text.Add("Zenith, for his part, says nothing for a while. A hand kneads the pommel of his sword in thought. When he finally speaks, the words surprise you a bit. <i>“You can return when you like. For now, you should leave. Too much adventure in one day can be bad for you.”</i> To punctuate the point, he holds up his ravaged hand.  The edge of his mouth briefly twitches into a smile before he shoos you out the door.", parse);
				Text.Flush();
				
				Gui.NextPrompt(Scenes.Maria.ForestEnd);
			}, enabled : true,
			tooltip : "Let Maria do the explaining."
		});
		options.push({ nameStr : "Interrupt",
			func : function() {
				Text.Clear();
				Text.Add("You interrupt the busty archer with a question. Facing down Zenith, you demand he explain why he has agents capturing people in the forest. For a moment, he looks at you in surprise. It quickly passes, however, replaced by a far more intimidating look of annoyance.", parse);
				Text.NL();
				Text.Add("He turns to Maria, fixing her with his intense gaze. <i>“I don’t. This is an unusual case.”</i> Shrinking back, the archer looks at the floor. The badger-morph turns back to you. <i>“As for you in particular? Well... I will let you leave this time.”</i>", parse);
				Text.NL();
				
				if(Scenes.Maria.fight == 1 || Scenes.Maria.fight == 2)
					Text.Add("<i>“You beat one of my best scouts. Not something every person can say, hm? You're not part of any law enforcement, are you?”</i> Shaking your head, you let Zenith continue. <i>“Come back later then. I'll have some things to discuss with you. For now, you should head back to wherever you call home.”</i>", parse);
				else if(Scenes.Maria.fight == 3)
					Text.Add("<i>“Seems there was a bit of a misunderstanding. We bear you no ill will, unless you decide to go against us.”</i> Shaking your head, you let Zenith continue. <i>“Come back later then. I'll have some things to discuss with you. For now, you should head back to wherever you call home.”</i>", parse);
				else
					Text.Add("<i>“Since you showed no violence towards myself or my people, you are free to return if you wish.”</i> As if that settles the entire matter, he shoos you from the room and shuts the door behind you and Maria.", parse);
				
				maria.relation.DecreaseStat(-100, 5);
				Text.Flush();
				
				Gui.NextPrompt(Scenes.Maria.ForestEnd);
			}, enabled : true,
			tooltip : "Demand an explanation for your capture."
		});
		Gui.SetButtonsFromList(options);
	});
}

Scenes.Maria.ForestEnd = function() {
	maria.RestFull();
	party.RestFull();
	
	Text.Clear();
	Text.Add("You prepare to leave, but remember that you lost your way when Maria showed you to the camp. Tapping her shoulder to get her attention, you mention the problem to her. She offers to take you back to where you met.");
	Text.NL();
	Text.Add("The journey back takes less time than the walk there had. Along the way, Maria points out small markings in the brush and on the trees, and explains how to use them to find the camp. Armed with the knowledge of the Outlaw's signs you are reasonably certain you can find your way back whenever you wish.");
	Text.Flush();
	
	party.location = world.loc.Forest.Outskirts;
	
	outlaws.flags["Met"] = Outlaws.Met.Met;
	
	world.TimeStep({hour: 3});
	Gui.NextPrompt();
}

//
//Dead drops
//
Scenes.Maria.DeadDropAlert = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("As you’re crossing the drawbridge into the outlaws’ camp, you’re stopped by one of the gate sentries just inside the camp. She looks you up and down, then clears her throat. <i>“[playername], right?”</i>", parse);
	Text.NL();
	Text.Add("Yes, that’s you. Something come up?", parse);
	Text.NL();
	Text.Add("<i>“Word has it that Maria wants to see you next time you show your face around here; we’ve instructions to let you know to go find her when you come in. Don’t know what you’ve done to excite High Command so much, but keep your head on your shoulders while talking to her, okay?”</i>", parse);
	Text.NL();
	Text.Add("That’s silly. When have you never had your head on your shoulders? Nevertheless, you thank the sentry as the drawbridge is pulled up in your wake - if Maria is looking for you, then you shouldn’t keep her waiting. If it’s about what happened last time… well, let’s see if her putting in a good word for you has worked out.", parse);
	Text.Flush();
	
	maria.flags["DD"] |= Maria.DeadDrops.Alert;
	
	world.TimeStep({minute: 15});
	
	Gui.NextPrompt();
}

//Trigger this when the player approaches Maria after having witnessed the above scene.
Scenes.Maria.DeadDropInitiation = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Taking a deep breath and squaring your shoulders, you step forward and approach Maria. She whirls around the moment you’re within earshot, then loosens up slightly as she realizes it’s you.", parse);
	Text.NL();
	Text.Add("<i>“[playername].”</i>", parse);
	Text.NL();
	Text.Add("Yes, it’s you. She called for you, and well, here you are. What’s the matter?", parse);
	Text.NL();
	Text.Add("<i>“You remember how I mentioned that I’d put in a good word for you with Zenith? Well, turns out that words aren’t enough - you’re still relatively new to us and all, even with you being given more of a head start on this trust thing than most are used to getting from him.</i>", parse);
	Text.NL();
	Text.Add("<i>“Long story short, if you’re really interested in working as an operative for us, you’ll need to start out like everyone else. Furthermore, since I was the one who stuck her neck out for you, I get the honor of showing you the ropes, at least until you’re capable of finding your way about on your own without walking straight into the guard.”</i>", parse);
	Text.NL();
	Text.Add("Maybe it’s better that way than assigning a complete stranger to your case, isn’t it? Best to have someone whom with you’ve got a little history mentor you and get past the whole ice-breaking thing?", parse);
	Text.NL();
	Text.Add("Maria rolls her eyes, but a small smile tugs at her lips. <i>“Well, when you put it that way, I guess that’s what Zenith was thinking, too. But trust me, I hope to be out of the babysitting phase as quickly as possible.</i>", parse);
	Text.NL();
	Text.Add("<i>“So, here’s what’s going to happen. We’ll get you started on the easy tasks first, and it doesn’t get much easier than dead drops.”</i>", parse);
	Text.NL();
	Text.Add("Dead drops?", parse);
	Text.NL();
	Text.Add("<i>“The basic idea’s very simple. We have a list of places where our contacts and sympathizers from around the kingdom and beyond drop off things which they want to get to us. Mostly information, but a few gifts here and there both ways aren’t out of the question. They have their people drop off their goods at a spot that we’ve agreed on beforehand, we get our people to pick them up, and the reverse happens when we’ve got something we want to hand over. Following me so far?”</i>", parse);
	Text.NL();
	Text.Add("Yeah, that sounds like pretty basic stuff.", parse);
	Text.NL();
	Text.Add("<i>“It may sound ‘pretty basic’ to you, but the correspondence contained in some of those drop-offs lets us get a better view of things that’re going on around Eden, and communicate with some of the outlying cells we have out there. They may make most of their own decisions, but still need to check in with Zenith for direction every now and then.”</i>", parse);
	Text.NL();
	Text.Add("It does sound serious, when even the lowliest and simplest of jobs carries such weight.", parse);
	Text.NL();
	Text.Add("Maria eyes you and folds her arms. <i>“No one misses the outhouse diggers, but believe me, everyone makes noise when shit starts to stink. Anyway, back to the point - we don’t always use the same ones over and over again. That’s just asking for someone to spot whoever’s making the drop-off or pick up, and then cause all sorts of trouble. Sticking to a regular schedule and being predictable in any shape or fashion is stupid, so we go through a rotation with each correspondence, arrange for new drop-off spots, reuse old ones which have been empty for a while now, so on and so forth.”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("All right, you think you get the point. When can you get started?", parse);
		Text.NL();
		Text.Add("Maria shakes her head at you. <i>“Not so fast, buster. There are a few things you’ve got to know first.</i>", parse);
		Text.NL();
		Text.Add("<i>“Number one, we go alone. Ideally, this means just you. For now, though, that means you and me. No one makes or picks up a dead drop with too many hands tagging along; that’s just asking for someone to notice you and start asking inconvenient questions. You’re not royalty and don’t need an entourage trailing along behind you everywhere you go waiting to wipe your ass if you crap your pants, so if anyone’s with you at the time, they get to hang back at camp and have some fun while you head out with me.</i>", parse);
		Text.NL();
		Text.Add("<i>“Next, I hope I’ve impressed upon you that these things are important, so there’s not going to be any dithering around once we set off. If we’re slated to go to the slums to get something from a contact, then that’s where we’re going, and we turn around and make for camp afterwards. No stopping for drinks, no wandering around, and no - well, you get the point. Each moment in between our friends making the drop and us getting to it is a moment some busybody can poke his or her nose into our business.</i>", parse);
		Text.NL();
		Text.Add("<i>“And… really, that’s about it. The rest is common sense, which I hope for your own sake you have plenty of. Do you understand me? Zenith wants to see what you can do, and how well you can do it; I stuck my neck out for you, so don’t fail me.”</i>", parse);
		Text.NL();
		Text.Add("Of course.", parse);
		Text.NL();
		Text.Add("<i>“Good. We get drop-offs all the time, so I’m not going to rush you into this - the worst thing you can do to a greenhorn is to push him or her out the window overenthusiastic and underprepared. Talk to me again when you’re ready to head out, and I’ll check the schedule, see where we can take you. Now, if there’s nothing else, I’ve got a few matters to attend to.”</i>", parse);
		Text.Flush();
		
		maria.flags["DD"] |= Maria.DeadDrops.Talked;
		
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt();
	});
}

Scenes.Maria.DeadDropFirst = function() {
	var parse = {};
	
	Text.Clear();
	Text.Add("All right, you’re ready. You tell Maria as much, and the ebony beauty looks you up and down.", parse);
	Text.NL();
	Text.Add("<i>“Are you sure?”</i> she asks. <i>“I don’t want you suddenly remembering midway that you’ve something really important that you need to be doing. Get yourself in the clear first, then we can go.”</i>", parse);
	Text.NL();
	Text.Add("Good point. Are you ready?", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "You’re about as ready as they come.",
		func : Scenes.Maria.DeadDropFirst2, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "Not just yet.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Right.”</i> Is it your imagination, or does Maria look relieved? <i>“Get yourself sorted out, then come find me again when you’re done.”</i>", parse);
			Text.NL();
			Text.Add("You nod and back away from her. Whatever it is that you’ve forgotten to do, you should get it out of the way first before returning.", parse);
			Text.Flush();
			
			Scenes.Maria.CampPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Maria.DeadDropFirst2 = function() {
	var parse = {};
	
	Text.Clear();
	Text.Add("You’ve got everything out of the way. Time to go!", parse);
	Text.NL();
	Text.Add("Maria quirks an eyebrow at you, then sighs and shakes her head resignedly. <i>“All right, let’s be off. You came at just the right time - too conveniently so, in fact, since I just got word from Zenith to bring in the latest drop. Place’s down by the slums, I’ll fill you in while we walk.”</i>", parse);
	Text.NL();
	if(party.Num() > 1) {
		var group = party.Num() > 2;
		var p1 = party.Get(1);
		parse["comp"] = group ? "your companions" : p1.name;
		if(group) {
			parse = p1.ParserPronouns(parse);
			parse["s"] = p1.plural() ? "" : "s";
		}
		else {
			parse["heshe"] = "they";
			parse["himher"] = "them";
			parse["s"] = "";
		}
			
		
		Text.Add("You take a moment to settle down [comp], telling [himher] to just kick back and relax for a moment in the camp while you run this errand. Watching [himher] trundle off into the camp’s main body to do what [heshe] need[s] to do, you fall in behind Maria, ready to set out.", parse);
		Text.NL();
	}
	Text.Add("Maria wastes no time, immediately setting off for the gates at a brisk pace with you trailing behind her. The sentries manning their positions salute as she approaches, then quickly lower the drawbridge to let the both of you pass.", parse);
	Text.NL();
	Text.Add("<i>“The slums by the city walls are where many of our operatives within Rigard proper make their drop-offs,”</i> she explains. <i>“There aren’t as many patrols in the area, we have a fair number of sympathizers, and the generally rough-and-tumble nature of the place makes getting away easy if we need to leg it.”</i>", parse);
	Text.NL();
	Text.Add("Yes, you’re getting that all down. So, what exactly is the pick-up this time?", parse);
	Text.NL();
	Text.Add("<i>“Just a little pillow talk,”</i> Maria replies as the two of you reach the forest’s edge and step onto open road proper. <i>“We have someone working for us in the local brothel, which is great for intelligence-gathering - people tend to find their tongues rather loose in that place, and in more than one way.”</i>", parse);
	Text.NL();
	Text.Add("Hmm. The rest of the journey is uneventful; you come across a couple of passers-by making their trips to and from the city, but the road is otherwise peaceful and deserted until you draw near to the edge of the slums. The tall-peaked roofs of the shanty town’s wooden buildings come into view, and Maria holds up a hand.", parse);
	Text.NL();
	Text.Add("<i>“All right, we get off the road here. Now, remember what I told you; when in doubt, just follow my lead. We shouldn’t run into any trouble, but keep your wits about you and your voice down anyway.”</i>", parse);
	Text.NL();
	Text.Add("True to her word, Maria veers off the beaten path, circling around the edges of the slums, her eyes trained on the buildings that pass her by. You follow behind her for a minute or so, and then she stops all of a sudden and points out a dilapidated, abandoned hovel to you.", parse);
	Text.NL();
	Text.Add("<i>“There,”</i> she whispers to you. <i>“We approach that one; there’s a hole in the side of that hovel in which our people at the docks make their drop-offs. Remember, don’t be nervous. Act as if you have every right to be here, and people usually will just assume that you do - this goes doubly so in the slums. Of course, those who live here are pretty good at sniffing out fakes, so you’d better put on your best show.”</i>", parse);
	Text.NL();
	Text.Add("All right. Maria sets off at a brisk, casual walk, and you do your best to mimic her as she crosses the slums’ dirt streets and approaches the hovel. As she turns a corner, though, the archer’s face turns from serious to savage, a scowl parting her full lips.", parse);
	Text.NL();
	Text.Add("<i>“You! Drop that!”</i>", parse);
	Text.NL();
	Text.Add("You hurry around the corner just as Maria breaks into a sprint, giving chase after a young mouse-morph who can’t be any older than nine or ten. The brat has a small wrapped package under his arm, and given Maria’s reaction, it has to be what you’re after today.", parse);
	Text.NL();
	parse["w"] = world.time.season == Season.Winter ? " and slush" : "";
	Text.Add("Well, nothing for it. You take off after the brat as well, joining Maria in the chase through the muddy streets of the slums. The dirt[w] is slick underfoot, the alleyways narrow, and more than one poor passerby is bowled over by the sheer force of your chase as the two of you pursue the mouse-morph through the shacks and hovels. Dogs bark and chickens flap at the commotion, and though you duck and weave as well as you can, you can’t seem to gain on him - but at least you don’t lose him, either. The streets are long and narrow with few bends, and that helps.", parse);
	Text.NL();
	Text.Add("<i>“You don’t want that!”</i> Maria shouts at the fleeing street urchin. <i>“Do you even know what’s in it?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Dunno!”</i> comes the reply as the little mouse-morph ducks and weaves between angry dockhands and donkey carts. <i>“But if yer willing to chase me for it, yer willing to buy it back, rite?”</i>", parse);
	Text.NL();
	Text.Add("Maria mutters something foul not quite under her breath, but the street urchin’s words give you an idea. If you’re really willing to pay for it… then you could end this right now, assuming you’ve the money to do so.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 4});
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Offer to buy back the package for ten coins.",
		func : function() {
			party.coin -= 10;
			
			maria.flags["DD"] |= Maria.DeadDrops.PaidKid;
			
			Text.Clear();
			Text.Add("Hey, if he’s willing to sell it back, you have the money to buy it. Doing your best not to lose sight of the little mouse-morph, you dig into your belongings for a handful of coins.", parse);
			Text.NL();
			Text.Add("Maria catches sight of what you’re doing, and shakes her head angrily. <i>“Don’t do that!”</i>", parse);
			Text.NL();
			Text.Add("Why not? You could end this right now. It’s only a few coins, and you won’t risk the little fellow giving both of you the slip.", parse);
			Text.NL();
			Text.Add("<i>“That’s not the p- look out for that stand! The point!”</i> Maria hisses through her teeth. <i>“If you buy him off, every little street urchin’s going to know that they can hold our drop-offs ransom!”</i>", parse);
			Text.NL();
			Text.Add("And if the dead drops were truly secure, street rats like him wouldn’t find them in the first place. Besides, the little bastard probably knows the slums better than either of you do, and that he just needs to get lucky once to give you the slip. On the other hand, you have to be lucky all the time, and you don’t feel very blessed today.", parse);
			Text.NL();
			Text.Add("Maria mutters something even more foul, but doesn’t stop you as you draw out a handful of coins and call out to the mouse-morph. Hearing the clink of coins and seeing the gleam of metal in your hand, he stops - but not before placing a sizeable stack of crates in between the two of you and him, ready to leap off and resume fleeing at the slightest provocation.", parse);
			Text.NL();
			Text.Add("<i>“Yeah, that’s enough. Throw it over.”</i>", parse);
			Text.NL();
			Text.Add("<i>“We’re not that stupid,”</i> Maria snaps. She glares daggers at you, but seems resigned to the choice you’ve made. <i>“Half up front, and half when you hand it over.”</i>", parse);
			Text.NL();
			Text.Add("The street urchin looks down at you from atop his perch, clearly thinking as to what to do next. His whiskers twitch as he considers Maria’s offer, then he looks at Maria and sees something in her face which brings his train of thought screeching to a halt.", parse);
			Text.NL();
			Text.Add("<i>”Okay. Half up front, half after it is. Toss it over.”</i>", parse);
			Text.NL();
			Text.Add("Well, that’s your cue. You split your handful of coins - ten in total - in half and toss it at the little brat, who tosses the wrapped package back at you in turn. You make good on the other half of your payment, and watch the street urchin scamper down from the heap to pick up his ill-gotten gains - while still keeping a healthy distance from you and Maria, of course.", parse);
			Text.NL();
			Text.Add("Thankfully, the chase and commotion haven’t attracted any onlookers; seems like the denizens of the slums are inclined to keep their heads under cover when there’s a ruckus going on near their doorsteps. Still looking like she’s bitten into something sour, Maria bends over and picks up the package, then elbows you as she tucks it away.", parse);
			Text.NL();
			Text.Add("<i>“Gah! Don’t just stand there - let’s get out of here before someone gets a close look at our faces!”</i> Without waiting for a reply, she grabs you by the arm and moves to drag you away from the scene, back through the dirt streets and under low rooftops. <i>“That drop point is as good as gone now - would’ve been anyway, but to make such a huge mess of it… and you just had to give in and take the easy way…”</i>", parse);
			Text.NL();
			Text.Add("Again, if the locals can’t actually find the drops, they can’t hold them for ransom. Maybe a rethinking of the locations <i>is</i> in order, as this whole debacle showed - had the two of you arrived a minute later,  he’d be long gone and you’d have nothing at all.", parse);
			Text.NL();
			Text.Add("<i>“Yes, but now they’ll actually be looking for them since they know there’s money in it - look, I’m not having this argument right now. Let’s get out of here and head back.”</i>", parse);
			
			PrintDefaultOptions();
		}, enabled : party.coin >= 10
	});
	options.push({ nameStr : "No",
		tooltip : "You’re not going to let this little brat hold your goods ransom.",
		func : function() {
			Text.Clear();
			Text.Add("Pay for what’s yours? Oh, the cheek of that little squirt; he’s not ransoming a single coin out of you! Still, there’s got to be some way that you can get the drop on him, and just chasing the little brat like this isn’t going to yield much in the way of results. While you have to keep on getting lucky to continue hounding him, the street urchin just has to get lucky once to give you the slip; if you’re not going to give in to his demands, you’ll need to act fast.", parse);
			Text.NL();
			Text.Add("A look at Maria’s face tells you that she concurs, and she motions to the rooftops. <i>“I’ll cut across the roofs,”</i> she tells you, slightly breathless from the chase. <i>“You herd him towards the docks. I’ll cut him off there.”</i>", parse);
			Text.NL();
			Text.Add("All right, sounds like a better plan than the one you have right now -  which is none. Maria makes a running leap for one of the low roofs, grabs its edge, and hoists herself up hand-over-foot onto the rooftops; the last sight you have of the archer is that of her dashing across the rickety, closely-spaced shanty town roofs, shortbow in hand.", parse);
			Text.NL();
			Text.Add("Alright, time for you to do your job. You can’t have been giving chase for any more than five to ten minutes, but it sure <i>feels</i> like it’s been far longer - and with the uneven roads and dodging you’re having to do, it’s sure taking the wind out of your sails more quickly than you expected. Hopefully, the docks aren’t too far away - with how things are going, you’re going to end up unlucky sooner or later.", parse);
			Text.NL();
			Text.Add("<i>“Just give up already, ya big lunkhead!”</i> the mouse-morph yells back at you. <i>“Yer good for a townie, but this thing of yers really worth a stint in the clapper?”</i>", parse);
			Text.NL();
			Text.Add("What, is he threatening you with jail? Unless he got drafted into the City Watch in the last few minutes, the only thing that this little brat is giving you is what’s rightfully yours!", parse);
			Text.NL();
			Text.Add("<i>“Finders keepers, losers weepers! ‘S the law ‘round these parts! Yer aren’t willing to pay to get this back, I’m sure someone else will!”</i>", parse);
			Text.NL();
			Text.Add("The law, that’s a joke. But anything to keep him talking and distracted - already, the dirt roads are giving way to boardwalks as you enter the pier, and you can see the lake ahead of you. Where <i>is</i> Maria? You can’t keep up the chase forever, and if the slums were bad, the docks are even worse - stacks of crates and barrels abound, not to mention all the tar and rope coils lying about, <i>and</i> then there’s the matter of the dockhands -", parse);
			Text.NL();
			Text.Add("All of a sudden, the street urchin squeals like a stuck pig, the short, sharp noise sending droves of gulls scattering in all directions. Pinning him to a nearby wooden pillar is the shaft of an arrow, driven through the side of his loose, tattered clothing. No arrowhead, but it’d definitely have caused a bloody bruise had it actually struck him.", parse);
			Text.NL();
			Text.Add("Maria!", parse);
			Text.NL();
			Text.Add("It’s a small opening, but it’s enough. As the little bastard tugs and tears away in an effort to get himself free, you close the distance and grab him in a flying tackle, tearing his clothes and sending the two of you to the ground. He sure has got quite a bit of fight left in him, biting, kicking and screaming as you pin him to the boardwalks.", parse);
			Text.NL();
			Text.Add("<i>“Cough it up and we’ll let you off easy, buster.”</i> Right on cue, Maria turns up on the scene, her shadow falling on the both of you. <i>“That’ll teach you to take things that don’t belong to you. I know living in this place is tough, but you’ve got to understand that there are some things you just don’t touch.”</i>", parse);
			Text.NL();
			Text.Add("Faced with no way out, the street urchin whimpers and goes limp, pulling out the package from his clothing. Maria reaches down and takes it from him, then glances at you. <i>“Right, it looks like the genuine article. Let him up, but watch out for any fast moves - on second thought, don’t. I’ve got you covered.”</i>", parse);
			Text.NL();
			Text.Add("You nod and get off the mouse-morph, who wastes no time struggling to his feet and legging it - but not before sticking out his tongue at the both of you and making a rude noise.", parse);
			Text.NL();
			Text.Add("<i>“Whatever helps him salvage a little of his pride,”</i> Maria says, slinging her bow on her back before folding her arms across her chest. <i>“Good job back there pinning down the little bastard, but we should clear out too before we attract too much attention.”</i>", parse);
			Text.NL();
			Text.Add("You don’t know about that - despite the chase and commotion, it looks like not that many of the locals have actually paid attention to the two of you, let alone stopped to stare. It certainly says something about the state of the slums and adjoining dock - but whether it’s that the locals are too used to violence to actually care, too wary to be overly curious about violence, or simply just plain disinterested - well, you have no idea.", parse);
			Text.NL();
			Text.Add("<i>“Come on.”</i> Maria’s voice cuts through your thoughts like a heated knife through butter. Right, right. Turning your back on the whole mess, you make do and head back, circling around the slums - you don’t want to be going back in there just yet.", parse);
			
			outlaws.relation.IncreaseStat(100, 1);
			
			PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("The two of you walk in silence side by side along the road for a while, the package still in Maria’s hands. Every now and then, she looks down at it, as if not quite sure if it’s really there; you’re just about to ask her for her two coins when she clears her throat.", parse);
		Text.NL();
		Text.Add("<i>“Well. That should put paid to that particular drop-off point. Once we get back, I need to discuss with Zenith just how safe the others are. I don’t want to go through what happened today again - there’re only so many of the City Watch, while brats like that one are everywhere.”</i>", parse);
		Text.NL();
		Text.Add("Well. One minute more and it’d be gone for good, one minute earlier and none of this unpleasantness would ever have happened.", parse);
		Text.NL();
		Text.Add("<i>“Which isn’t the point, that being whatever goes in should remain safe until we decide to pick it up within a reasonable time frame. But enough of that - let’s see what we’ve got in here.”</i>", parse);
		Text.NL();
		Text.Add("With that said, Maria quickly unties the the bundle, nimble fingers teasing apart cord and tearing open waxed paper to reveal a small sheaf of neatly-folded papers. The paper itself appears to be of fairly good quality, and you’re quite sure there’s a lingering scent of perfume of some sort, but it’s too faint to be sure of what the exact scent is. Maria’s lips move as she reads, and at length, she folds the paper back up and pockets it.", parse);
		Text.NL();
		Text.Add("What was the message, if you may ask?", parse);
		Text.NL();
		Text.Add("<i>“A note from one of our better people in Rigard,”</i> comes the reply. <i>“The City Guard’s onto us, but as expected, they’re still running around like chickens. If I didn’t know better, I’d say they’ve ducked their heads down and are hoping that this will all blow over, but they aren’t <b>completely</b> stupid, either.</i>", parse);
		Text.NL();
		Text.Add("<i>“A few more interesting bits here and there, some more pillow talk… this might come in useful later on.”</i> Maria folds up the papers and stuffs them back into her pocket. <i>“Stupid kid, trying to run off with these - if the City Watch got wind of what he was carrying, he’d be in no end of trouble. We work to free them from Rigard, and this is what we get…”</i>", parse);
		Text.NL();
		Text.Add("Well, the street urchin couldn’t have known what was in the package or that the both of you were outlaws, right? As far as he knew, he was holding a ticket to a meal, and meals are hard enough to come by in the slums.", parse);
		Text.NL();
		Text.Add("Maria sighs and shakes her head as the two of you leave the road for the forest’s edge. <i>“Yes, you’re right. Still. It’s been a long day, we’ve dithered outside for far longer than we should’ve been, and I’m not looking forward to talking to Zenith about this. Still, it’s got to be done, so nose to the grindstone and all.”</i>", parse);
		Text.NL();
		Text.Add("The remainder of your trip back passes in silence. At length you’re back within the outlaw camp, the sentries pulling in the drawbridge behind the two of you.", parse);
		Text.NL();
		parse["c"] = party.Num() > 1 ? ", gather your people" : "";
		Text.Add("<i>“All right, that’s it for today,”</i> Maria tells you. <i>“You’re dismissed - go and get a drink[c], take a nap or play some cards, whatever you do for entertainment when no one’s watching. I’ve got a report to make.”</i>", parse);
		Text.NL();
		Text.Add("Right. That wasn’t so bad in the end, was it?", parse);
		Text.NL();
		Text.Add("<i>“I’d have liked it to go much smoother,”</i> Maria snaps, then catches herself and rubs her face. <i>“Look, if you ever want to do another pick-up, just let me know. You’ve still got a little way to go before you’re skilled and trusted enough to do these on your own, and especially after what happened today…”</i>", parse);
		Text.NL();
		Text.Add("She leaves the end of that last sentence hanging and stalks away for the map building, leaving you alone to reflect on today’s events.", parse);
		Text.Flush();
		
		maria.flags["DD"] |= Maria.DeadDrops.Completed;
		outlaws.relation.IncreaseStat(100, 1);
		
		world.TimeStep({hour: 4});
		
		Gui.Nextpromt();
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

//TODO
Scenes.Maria.DeadDropRepeat = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.Flush();
}

