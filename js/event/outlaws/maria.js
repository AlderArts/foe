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
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 5;
	this.SetSkinColor(Color.brown);
	this.SetHairColor(Color.black);
	this.SetEyeColor(Color.blue);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = 0;

	if(storage) this.FromStorage(storage);
}
Maria.prototype = new Entity();
Maria.prototype.constructor = Maria;


Scenes.Maria = {};

// Add initial event, only trigger 6-20
world.loc.Forest.Outskirts.enc.AddEnc(function() {
	return Scenes.Maria.ForestMeeting;
}, 3.0, function() { return miranda.flags["Met"] >= Miranda.Met.Met && gameCache.flags["OutlawsRep"] == 0 && (world.time.hour >= 6 && world.time.hour < 20); });


Maria.prototype.FromStorage = function(storage) {
	this.FirstVag().virgin   = parseInt(storage.virgin) == 1;
	this.Butt().virgin       = parseInt(storage.avirgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Maria.prototype.ToStorage = function() {
	var storage = {
		virgin  : this.FirstVag().virgin ? 1 : 0,
		avirgin : this.Butt().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule
Maria.prototype.IsAtLocation = function(location) {
	return true;
}


Maria.prototype.Act = function(encounter, activeChar) {
	// TODO: AI!
	Text.AddOutput("The huntress hops around nimbly.");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);
	
	var choice = Math.random();
	
	var trap = this.combatStatus.stats[StatusEffect.Counter];
	
	if(this.HPLevel() < 0.3 && this.pots > 0) {
		this.pots--;
		Items.Combat.HPotion.UseCombatInternal(encounter, this, this);
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


// Party interaction
Maria.prototype.Interact = function() {
	Text.Clear();
	Text.Add("Rawr Imma archer.");
	
	
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
	
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
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
		Text.Add("Off in the distance, the massive tree at the center of Eden overlooks the entire verdant area, casting long shadows and slightly eclipsing the sun. This far into the forest, the trees grow close together, and even the smallest is far too tall for you to climb. All around, the sounds of the forest pound against against your ears. Up in the high branches, birds twitter at each other. Wind whistles through the limbs, brushing them against each other in a comforting melody. Dozens of unseen insects send mating songs through the air.", parse);
		Text.NL();
		Text.Add("The pleasant buzz distracts you from the soreness settling in your limbs. After a few more minutes of walking, you decide to take a break, and sit down at the base of a tree. The rough bark rubs against you through your [armorDesc]. Before long, you fall into a doze.", parse);
		Text.NL();
		Text.Add("The sound of creaking wood wakes you from your slumber. Cracking open an eye, the sight of an arrow greets you. Your eyes snap open, and you focus on the glinting tip of the arrowhead. Sliding up the shaft, then lingering on the grey-striped feathers, you look up toward the woman holding the bow. Her hands and arms are absolutely still, even under the massive tension of holding a nocked arrow.", parse);
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
				Text.Add("You've had just about enough of this presumptuous  highwaywoman. Lunging forward, you tackle the archer to the ground before she has the chance to respond.", parse);
			else {
				parse.companion = party.Two() ? "companion is" : "companions are";
				parse.their     = party.Two() ? p1.hisher() : "their";
				Text.Add("You watch as your [companion] led away ahead of you, [their] captors apparently deciding on the course of action faster than Maria. You decide you've had just about enough of the presumptuous highwaywoman, and as soon as her allies are out of sight, take your chance.", parse);
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
				Text.Add("You fall to the ground, utterly defeated. The bow woman kicks away your [weaponDesc] and levels an arrow at you. Glaring at you, she orders you to stand. As you wobble to your feet, she comes up behind you, binding your hands fast with some rope. Cold shivers run up your spine as you feel the sharp point of a knife dig into the soft flesh between your shoulder blades.", parse);
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
					Text.Add("As juiced up as she is, you have no problem pounding straight into her core. Thrashing away at her slick pussy, you lose yourself in a haze of lust and feel yourself getting closer to the edge you had been skirting after her oral earlier assault. Her walls ripple around you convulsively as she cums under the assault. Moments later you glaze her insides with your liquid lust.", parse);
					
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
	Text.Add("step back and raise your hands non-threateningly. An orange cat-morph steps forward and ties your hands behind your back, then forces you down onto the ground and ties your feet to your hands.  Shakily, the bow woman rises to her feet with the help of a red-armoured wolf-eared man. She takes the lead and heads... well, you don't know where she plans on taking you, but you're beginning to think it might not have been such a good idea to attack her.", parse);

	Text.Flush();
	Gui.NextPrompt(Scenes.Maria.ForestFollow);
}

Scenes.Maria.ForestFollow = function() {
	var parse = {};
	
	Text.Clear();
	Text.Add("You decide the best course of action is to follow Maria.", parse);
	Text.NL();
	Text.Add("Turning on her heel, Maria guides you through the massive oak trees, clambering over roots and around massive, tangled thickets with ease. She leads you through a labyrinthine assortment of vegetation, constantly switching back and forth, seemingly at random. The ground under your feet begins turning softer, and the footing becomes harder to keep the longer you follow the bowwoman.", parse);
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
		Text.Add("Once Maria finally comes back, she's followed closely by a large fox-morph wielding a greatsword. Its slung across his shoulder, resting there easily. The muscles in his arms bulge as he adjusts the way it sits on him. His russet fur ruffles in the soft wind, and you can see his muscles rippling as he moves. His yellow eyes regard you suspiciously, and his hands shift across the hilt. Maria gestures for you to follow her again, and the three of you head up over the rooty embankment. Laying eyes on the 'camp', you gasp in surprise. When you had heard a few outlaws had taken up residence in the forest, you never imagined something like this.", parse);
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
		Text.Add("Inside, a large round table dominates the room. Immediately, the map lying on it grabs your attention. Different figurines stand in seemingly random places. Paper is scattered across the map table and the floor, filled by an illegible scrawl. It almost looks like another language. A door to your left opens, and out walks a very peculiar figure.", parse);
		Text.NL();
		Text.Add("At first, you can't tell what makes him seem odd. Then it hits you. It looks almost as if all the color in his body has been drained away. His silvery hair doesn't reflect the light, but it looks like it somehow should. The stranger's hair is cut short, and sticks up in odd directions, as if he'd just been sleeping on it. His jawline is well defined, covered with a short stubble the same silvery color as his hair. A scar on his cheek travels diagonally upwards toward his temple and it pulls your attention to his eyes. The grey irises fix you with an distrustful stare. They stand out prominently against the black sclera, and his pupils contract to vertical slits for a moment.", parse);
		Text.NL();
		Text.Add("He crosses his arms, and you take notice of his unusual clothing. He wears what appears to be a mix and match of armor types the likes of which haven't seen before. His right arm is completely bare, and a long scar runs down most of it. Both the ring and pinky finger of that hand are missing, leaving the hand looking lopsided.", parse);
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
				Text.Add("He turns to Maria, fixing her with his intense gaze. <i>“I don't. This is an unusual case.”</i> Shrinking back, the bow woman looks at the floor. The monochrome man turns back to you. <i>“As for you in particular? Well... I will let you leave this time.”</i>", parse);
				Text.NL();
				
				if(Scenes.Maria.fight == 1 || Scenes.Maria.fight == 2)
					Text.Add("<i>“You beat one of my best scouts. Not something every person can say, hm? You're not part of any law enforcement, are you?”</i> Shaking your head, you let Zenith continue. <i>“Come back later then. I'll have some things to discuss with you. For now, you should head back to wherever you call home.”</i>", parse);
				else if(Scenes.Maria.fight == 3)
					Text.Add("<i>“Seems there was a bit of a misunderstanding. We bear you no ill will, unless you decide to go against us.”</i> Shaking your head, you let Zenith continue. <i>“Come back later then. I'll have some things to discuss with you. For now, you should head back to wherever you call home.”</i>", parse);
				else
					Text.Add("<i>“Since you showed no violence toward myself or my people, you are free to return if you wish. If you need supplies, feel free to speak with Tryss near the entrance to the camp the next time you come around.”</i> As if that settles the entire matter, he shoos you from the room and shuts the door behind you and Maria.", parse);
				
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
	
	gameCache.flags["OutlawsRep"] = 1;
	
	world.TimeStep({hour: 3});
	Gui.NextPrompt(PrintDefaultOptions);
}
