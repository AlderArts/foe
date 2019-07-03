/*
 *
 * Introductory scenes and character creation
 *
 */

Intro = {};

/*
 * Introductory scene (start of game). Entry into the attic
 */
Intro.Start = function() {
	party.SwitchIn(player);

	Intro.active = true;

	Text.Clear();

	Text.Add("You are not quite sure what draws you there, but once again, you find yourself climbing the rickety ladder leading to the attic of the old house. With a heave and a cloud of dust, you open the trapdoor and peek into the room. An alarmed caw and a flutter of wings inform you of the presence of a bird's nest somewhere in the darkness above. Guess someone still uses this place after all.");
	Text.NL();
	Text.Add("Taking a good look around, you survey the odd collection of artifacts, furniture and broken pottery that clutter the dusty attic. Some of the objects are draped in ragged pieces of cloth, and a thick coat of dust covers everything. A single ray of light sneaks its way down from a crack in the old roof, the evening sun illuminating a small part of the dusty floor boards.");
	Text.NL();
	Text.Add("You take a deep breath, taking in the musty smell of the room, and immediately regret it. As your fit of coughing subsides, you notice something that is different from the last time you were here. There, right in the circle of light, is a footprint.");
	Text.NL();
	Text.Add("An involuntary shiver runs down your spine. The house has been abandoned for at least a decade, when the owner last left on one of his travels. Faint memories of an eccentric old man come back to you; weathered, leathery skin, a short dark beard slashed with gray, and a rugged leather hat on his head. It was so long ago that the old recluse left, people even forgot his name.");
	Text.NL();
	Text.Add("As far as you know, no one but you has visited the decaying house on the hilltop since he last left it. As far as you <i>knew</i>, you correct yourself, the evidence right in front of you. Someone was here... and recently.");
	Text.NL();
	Text.Add("Peering around nervously, you climb up into the attic, taking care not to step on any of the scattered objects on the floor. You catch glimpses of old pots and plates in silver, bronze and cracked pottery, and briefly reflect on why no one has looted this place. A faint glow from the back of the room, in the direction the footprints are leading, distracts you from your musings.");
	Text.NL();
	Text.Add("Heart thumping, you carefully make your way to the back of the room where an object you have never seen before stands. It's oval and flat in shape, taller than you, standing propped up against the wall. The faint red glow seems to come from the object itself, but is muffled by the cloth covering. The footprints lead straight to the object, then stop just in front of it. You see no further signs of their owner.");
	Text.Flush();

	Gui.NextPrompt(Intro.Mirror);
}

/*
 * Found mirror
 */
Intro.Mirror = function() {
	Text.Clear();

	Text.Add("Almost as if in a trance, you reach out and grab the dry cloth, steel yourself and yank it aside. You gasp reverently and take a step back at the sight, involuntarily setting off another coughing fit. As you recover, you marvel at the object in front of you.");
	Text.NL();
	Text.Add("It is a mirror, but what a mirror! The red glow, previously muted by the covering, seems to emanate from the surface itself, giving the reflection a strange, distorted tint. A slight hint of movement in the reflected world causes you to whip your head around... nothing. Trying to calm yourself, you study the mirror more closely.");
	Text.NL();
	Text.Add("Surprised, you realize that the ornamental border of the mirror is pure gold, with expensive-looking gems set at regular intervals. The thing must be worth a fortune! Despite this, however, your attention is drawn to the surface of the mirror. The reddish tint gives the reflection of the room an almost sinister look, and imperfections in the glass bend the light in weird ways, twisting the image. As you watch in wonder, the distortions are actually subtly <i>moving</i>, slowly flowing across the surface. You must be more careful, this thing clearly has magical properties, but nothing like you have ever seen before.");
	Text.NL();
	Text.Add("The dust you stirred up on your entry is gently moving in the reflection, the distorted light giving it the look of a red mist covering the room. In the center of the reflection, you see yourself.");
	Text.Flush();

	Gui.NextPrompt(Intro.Gender);
}

/*
 * Character creation functions
 */
Intro.Gender = function() {
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("You look at yourself in the mirror... what do you see?");
	Text.Flush();

	Input.buttons[0].Setup("A man", function() {
		player.InitCharacter(Gender.male);
		Intro.BodyTypeMale();
	}, true);
	Input.buttons[1].Setup("A woman", function() {
		player.InitCharacter(Gender.female);
		Intro.BodyTypeFemale();
	}, true);
}
/* TODO: Set body type */
Intro.BodyTypeMale = function() {
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("What is your build?");
	Text.Flush();

	Input.buttons[0].Setup("Average", function() {
		player.body.DefMale(BodyTypeMale.Average);
		Intro.SkinColor();
	}, true);
	Input.buttons[1].Setup("Thin", function() {
		player.body.DefMale(BodyTypeMale.Thin);
		Intro.SkinColor();
	}, true);
	Input.buttons[2].Setup("Muscular", function() {
		player.body.DefMale(BodyTypeMale.Muscular);
		Intro.SkinColor();
	}, true);
	Input.buttons[3].Setup("Girly", function() {
		player.body.DefMale(BodyTypeMale.Girly);
		Intro.SkinColor();
	}, true);
	Input.buttons[4].Setup("Trap", function() {
		player.body.DefMale(BodyTypeMale.Trap);
		Intro.SkinColor();
	}, true);
}
/* TODO: Set body type */
Intro.BodyTypeFemale = function() {
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("What is your build?");
	Text.Flush();

	Input.buttons[0].Setup("Average", function() {
		player.body.DefFemale(BodyTypeFemale.Average);
		Intro.SkinColor();
	}, true);
	Input.buttons[1].Setup("Slim", function() {
		player.body.DefFemale(BodyTypeFemale.Slim);
		Intro.SkinColor();
	}, true);
	Input.buttons[2].Setup("Curvy", function() {
		player.body.DefFemale(BodyTypeFemale.Curvy);
		Intro.SkinColor();
	}, true);
	Input.buttons[3].Setup("Voluptous", function() {
		player.body.DefFemale(BodyTypeFemale.Voluptous);
		Intro.SkinColor();
	}, true);
	Input.buttons[4].Setup("Tomboy", function() {
		player.body.DefFemale(BodyTypeFemale.Tomboy);
		Intro.SkinColor();
	}, true);
	Input.buttons[5].Setup("Cuntboy", function() {
		player.body.DefFemale(BodyTypeFemale.Cuntboy);
		Intro.SkinColor();
	}, true);
}
Intro.SkinColor = function() {
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("What is your complexion?");
	Text.Flush();

	Input.buttons[0].Setup("White", function() {
		player.SetSkinColor(Color.white);
		Intro.HairColor();
	}, true);
	Input.buttons[1].Setup("Olive", function() {
		player.SetSkinColor(Color.olive);
		Intro.HairColor();
	}, true);
	Input.buttons[2].Setup("Brown", function() {
		player.SetSkinColor(Color.brown);
		Intro.HairColor();
	}, true);
	Input.buttons[3].Setup("Black", function() {
		player.SetSkinColor(Color.black);
		Intro.HairColor();
	}, true);
}
Intro.HairColor = function() {
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("What is the color of your hair?");
	Text.Flush();

	Input.buttons[0].Setup("Black", function() {
		player.SetHairColor(Color.black);
		Intro.EyeColor();
	}, true);
	Input.buttons[1].Setup("Brown", function() {
		player.SetHairColor(Color.brown);
		Intro.EyeColor();
	}, true);
	Input.buttons[2].Setup("Blonde", function() {
		player.SetHairColor(Color.blonde);
		Intro.EyeColor();
	}, true);
	Input.buttons[3].Setup("Red", function() {
		player.SetHairColor(Color.red);
		Intro.EyeColor();
	}, true);
	Input.buttons[4].Setup("White", function() {
		player.SetHairColor(Color.white);
		Intro.EyeColor();
	}, true);
	Input.buttons[5].Setup("Gray", function() {
		player.SetHairColor(Color.gray);
		Intro.EyeColor();
	}, true);
	Input.buttons[6].Setup("Platinum", function() {
		player.SetHairColor(Color.platinum);
		Intro.EyeColor();
	}, true);
}
Intro.EyeColor = function() {
	Text.Clear();
	Gui.ClearButtons();

	Text.Add("What is the color of your eyes?");
	Text.Flush();

	Input.buttons[0].Setup("Black", function() {
		player.SetEyeColor(Color.black);
		Intro.Review();
	}, true);
	Input.buttons[1].Setup("Brown", function() {
		player.SetEyeColor(Color.brown);
		Intro.Review();
	}, true);
	Input.buttons[2].Setup("Blue", function() {
		player.SetEyeColor(Color.blue);
		Intro.Review();
	}, true);
	Input.buttons[3].Setup("Gray", function() {
		player.SetEyeColor(Color.gray);
		Intro.Review();
	}, true);
	Input.buttons[4].Setup("Green", function() {
		player.SetEyeColor(Color.green);
		Intro.Review();
	}, true);
	Input.buttons[5].Setup("Purple", function() {
		player.SetEyeColor(Color.purple);
		Intro.Review();
	}, true);
}

Intro.Review = function() {
	Text.Clear();
	Gui.ClearButtons();

	player.PrintDescription(true);
	
	Text.Add("Is this correct?");
	Text.Flush();

	Input.buttons[0].Setup("Yes", function() {
		Intro.JobSelect();
	}, true);
	Input.buttons[1].Setup("No", function() {
		player.body = new Body(this);
		Intro.Gender();
	}, true);
}

Intro.JobSelect = function() {
	Text.Clear();
	Text.Add("What profession do you wish to start out as? You will receive a small permanent stat bonus, and a slight head start in your chosen class.");
	Text.Flush();

	//[Fighter][Scholar][Courtesan]
	var options = new Array();
	options.push({ nameStr : "Fighter",
		func : function() {
			Text.NL();
			Text.Add("You take pride in your strength and physical prowess, and hope to one day become a mighty warrior. There is still much to learn, however...");
			Text.Flush();

			player.currentJob           = Jobs.Fighter;
			player.strength.growth     += 0.6;
			player.stamina.growth      += 0.3;
			player.dexterity.growth    += 0.3;
			player.intelligence.growth += 0.0;
			player.spirit.growth       += 0.1;
			player.libido.growth       += 0.0;
			player.charisma.growth     += 0.1;
			player.flags["startJob"]    = JobEnum.Fighter;

			Gui.NextPrompt(Intro.Mirror2);
		}, enabled : true,
		tooltip : "Focused on martial abilities and strength, strives to excel in physical combat."
	});
	options.push({ nameStr : "Scholar",
		func : function() {
			Text.NL();
			Text.Add("You like to take a calculated approach to problems facing you, weighing options against each other. From books and scrolls, you have taught yourself various useful supportive abilities. There is still much to learn, however...");
			Text.Flush();

			player.currentJob           = Jobs.Scholar;
			player.strength.growth     += 0.0;
			player.stamina.growth      += 0.1;
			player.dexterity.growth    += 0.2;
			player.intelligence.growth += 0.6;
			player.spirit.growth       += 0.3;
			player.libido.growth       += 0.1;
			player.charisma.growth     += 0.1;
			player.flags["startJob"]    = JobEnum.Scholar;

			Gui.NextPrompt(Intro.Mirror2);
		}, enabled : true,
		tooltip : "Takes a more intellectual approach to problems, and dabbles slightly in the mystical. Starts out with several support abilities."
	});
	options.push({ nameStr : "Courtesan",
		func : function() {
			Text.NL();
			Text.Add("You often try to fall back on your sex appeal whenever trouble arises, relying on your natural charm to distract and seduce your foes. There is still much to learn, however...");
			Text.Flush();

			player.currentJob           = Jobs.Courtesan;
			player.strength.growth     += 0.0;
			player.stamina.growth      += 0.0;
			player.dexterity.growth    += 0.2;
			player.intelligence.growth += 0.2;
			player.spirit.growth       += 0.0;
			player.libido.growth       += 0.5;
			player.charisma.growth     += 0.5;
			player.flags["startJob"]    = JobEnum.Courtesan;

			Gui.NextPrompt(Intro.Mirror2);
		}, enabled : true,
		tooltip : "Focused on sensual abilities and charming your foes into submission."
	});
	Gui.SetButtonsFromList(options);
}


Intro.Mirror2 = function() {
	Text.Clear();

	Text.Add("You catch yourself posing in front of the mirror. Feeling slightly embarrassed, you ponder what to do. Looking closer, you notice something strange - well, stranger; crowning the mirror is a large purple gemstone, roughly the size of your fist. The thing isn't like any stone you have ever seen, glowing with a dull sheen, and the interior a roiling cloud of dense mist, swirling lazily.");
	Text.Flush();

	Gui.NextPrompt(Intro.Mirror3, "Take gem");
}

Intro.Mirror3 = function() {
	Text.Clear();

	Text.Add("Unable to resist, you reach out to grab the beautiful stone. As your fingers connect with the gemstone, something peculiar happens. The mist within the stone suddenly stops moving for a fraction of a second, before returning to its previous slow motion. You get the sense that the gem is glowing slightly brighter.");
	Text.NL();
	Text.Add("Mustering your courage, you grab the purple stone and pull it from its socket in the mirror. A jolt of energy shoots through you, leaving behind a tingling feeling. Examining the stone in wonder, you notice that it now pulses with a faint light, perfectly in sync with your heartbeat. Resolving to study it further at a later time, you pocket the gem.");
	Text.NL();
	Text.Add("<b>Acquired purple gemstone!</b>");
	Text.NL();
	Text.Add("Your eyes are drawn upward by a reddish glow. Gasping in genuine shock, you stumble back a few steps. The surface of the mirror has completely transformed. While you can still see your own reflection, the room behind you has vanished. In its place is a hellish landscape of fire and smoke. Panicking, you whip your head around, relieved to find that you are, indeed, still in the old dusty attic. Perhaps the mirror is a portal to another world? If so, it doesn't look like it leads to any place you want to visit.");
	Text.Flush();

	Gui.NextPrompt(Intro.Mirror4);
}

Intro.Mirror4 = function() {
	Text.Clear();

	Text.Add("Can you really keep this a secret? Perhaps you should leave, for now... You are stopped short as your eyes snap back to the mirror. Behind your reflection, a nightmarish creature is rising on its haunches. You get a glimpse of callused red skin streaked with black and a bizarre collection of sharp claws, horns and spikes before the hulking creature presses a clawed hand down on your shoulder.");
	Text.NL();
	Text.Add("<b>CAUGHT YOU.</b> A voice thunders inside your skull, seeming to come from everywhere around you. Panicking, you try to break away, but are held fast. You must look rather comical, struggling with an invisible assailant, but the grip on your shoulder is very real.");
	Text.NL();
	Text.Add("<b>LITTLE PET,</b> the demon chuckles in amusement, <b>OH, WHAT FUN WE SHALL HAVE.</b> In the mirror, the creature bends down ponderously - it must be at least twice your height - until you can feel its breath on your neck. A long barbed tongue snakes its way out of its mouth and down into your clothes, the rough appendage painfully scraping your soft skin and almost drawing blood.");
	Text.NL();
	Text.Add("Slowly, you are being pushed closer and closer to the reflection, an uncomfortable pressure against your back urging you forward. You instinctively pull away from it as you realize that it can only be the demon's unholy cock, stiffening as it brushes you.");
	Text.NL();
	Text.Add("As your face is roughly pressed against the surface of the mirror, you are surprised to find it soft, yielding to the pressure. Slowly, your body is pushed into the mirror, swallowing you into oblivion. Your senses go into overdrive as you are surrounded by cold swirling flames, burning and tearing at your clothes. The smell of smoke and sulfur assault your nose, and you feel the tang of hot blood on your tongue as you scream in pain. Exhaustion overcomes you, and you pass out in the whirling chaos.");
	Text.Flush();

	Gui.NextPrompt(Intro.DarkAspect);
}

/*
 * Entry into the dark world
 */
Intro.DarkAspect = function() {
	Text.Clear();

	Text.Add("Slowly, you come to as your senses return to you. You jump up in a crouch, afraid that the creature from before followed, but you seem to be completely alone. The sudden motion makes you dizzy, and you are forced to sit down again, groaning until your head stops spinning. Your naked skin rubs uncomfortably on the cracked ground.");
	Text.NL();
	Text.Add("Checking the ragged remains of your clothes, you confirm that the gemstone is somehow still in your pocket.");
	Text.NL();
	Text.Add("The stale air is surprisingly cold. Shivering and wondering what the hell you have gotten yourself into now, you rise to your feet and have a look around you.");
	Text.Flush();

	Gui.NextPrompt(function() {
		party.location = world.loc.DarkAspect.Barrens;
		gameState       = GameState.Game;
		PrintDefaultOptions();
	});
}


// Create namespace
world.loc.DarkAspect = {
	Barrens   : new Event("Barrens"),
	Mountains : new Event("Mountains"),
	Cliff     : new Event("Cliffside"),
	Peak      : new Event("Peak")
}


//
// Dark aspect dimension
//
world.loc.DarkAspect.Barrens.description = function() {
	Text.Add("You are in an unfamiliar place, an endless plain of red cracked earth, interspersed with black thorn bushes. The sky looks like something from an insane painting, vivid red streaks clashing with dark brown, gray and black clouds. Occasionally, red lightning flashes across the sky, flooding the dim and dreary wasteland with sharp light.");
	Text.NL();
}
world.loc.DarkAspect.Barrens.links.push(new Link(
	"Mountains", true, true,
	function() {
		Text.Add("In the far, far distance, you can make out a large mountain range, the impossibly high peaks hidden in the clouds. There is no sign of life anywhere.");
		Text.NL();
	},
	function() {
		Text.Clear();

		Text.Add("Seeing nothing else of interest and getting a bit cold, you start out for the mountains.");
		Text.NL();
		Text.Add("Measuring the distance, you guess that it will take you several hours to reach the foothills. Hopefully, you can find some shelter from the elements there, but you fear that your bare feet will be bloodied stumps by the time you arrive. Still, you don't really have anywhere else to go.");
		Text.NL();
		Text.Add("As you walk, you start to contemplate your situation. You are clearly not in your own world, but what is this place? Some strange hell? How exactly did the mirror transport you here? Where - you shudder - did that demon disappear to? Exposed as you are, you'd hate to run into that creature here.");
		Text.NL();
		Text.Add("As if summoned, a deafening crash behind you shatters your train of thought. Twirling around, you gape in disbelief as the earth shakes violently, huge cracks appearing. With a final roar, the ground shudders and collapses in on itself, opening a huge fiery chasm.");
		Text.NL();
		Text.Add("From the abyss rises the demon from before, but it is different this time. Limbs ablaze with a red sooty flame, the thing must be at least a hundred feet tall. It tilts its triangular head as it notices you, a far-too-wide grin spreading across its face, baring hundreds of razor sharp teeth.");
		Text.NL();
		Text.Add("<b>FOUND YOU!</b> The voice echoes triumphantly across the blazing plains. The demon starts to climb out of the chasm, the ground catching fire where the creature plants its claws. You shake yourself and turn around to run. This is <b>NOT</b> a good place to be in.");
		Text.Flush();

		Gui.NextPrompt(function() {
			Text.Clear();

			Text.Add("Terrified, you scramble along as fast as your legs can carry you, but it is clear from the shaking ground and the growing heat that the demon is gaining on you. Looking up again, the mountains appear to be no closer than before and still hopelessly out of your reach.");
			Text.NL();
			Text.Add("You can feel the demon's breath on your back, a sharp stink of sulfur. Desperately, you close your eyes and sprint as fast as you can, waiting for the inevitable demonic claw to descend on you and crush your small body. Your heart almost bursts from your chest in terror as you trip on some hidden crevice and fall forward. Instinctively rolling up your body in a tight ball, you manage to deflect most of the damage from the fall, but your breath is knocked from your body as you slam into... a rock wall?");
			Text.NL();
			Text.Add("Dizzied, you open your eyes. Far across the plains, miles away, you see the huge demon striding toward you. Looking up, you realize that you have somehow reached the foothills of the mountain. Distance doesn't seem to work the same way here... Still, you are far from out of danger.");
			Text.Flush();

			player.curSp -= 10;
			player.curHp -= 5;

			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.DarkAspect.Mountains, {minute: 5});
			});
		});
	}
));

world.loc.DarkAspect.Mountains.description = function() {
	Text.Add("You are at the base of a towering mountain range, rising like massive black pillars toward the chaotic sky. Below, on the wasteland, you can see the demon striding toward you in long steps. Behind it, fire is spreading out, the cracks from the demon's heavy footsteps opening up into an endless abyss.");
	Text.NL();
}
world.loc.DarkAspect.Mountains.links.push(new Link(
	"Peak", true, true,
	function() {
		Text.Add("The only way left to you is up, but you have no idea how to make the climb. Up close, the mountain is a sheer cliff, almost vertical.");
		Text.NL();
	},
	function() {
		Text.Clear();
		Text.Add("With no time to lose, you attempt to climb the cliff, somehow finding purchase for your fingers and toes in the ragged rock face. With difficulty, you manage to climb up a crevice, reaching a small platform. The area is about ten by ten yards large, surrounded by jagged outcroppings as sharp as swords.");
		Text.NL();
		Text.Add("The short climb has left you winded. This isn't going to work, you conclude. Looking back to where you came from, the demon seems to have reached the foothills below and has started climbing the crevice. It will reach this place in mere moments. Scrambling to find a hiding place, you duck in behind a rock, scratching yourself and drawing blood.");
		Text.NL();
		Text.Add("Peeking out from your hiding place, your hope drains as you see one of the demon's massive clawed hands crest the edge of the cliff. It has already caught up with you.");
		Text.NL();
		Text.Add("<b>DON'T RUN, PUNY HUMAN. THERE IS NO USE HIDING,</b> the booming voice announces, sounding slightly amused. <b>YOU ARE IN MY REALM NOW, THERE IS NO ESCAPE.</b> It draws itself up to rest its arms in the clearing and you get your first good look at the thing.");
		Text.NL();
		Text.Add("A multitude of spikes and horns rise from its hairless head in a chaotic mess. The demon's lipless mouth, filled with incredibly sharp teeth, is spread in a huge grin spanning the entirety of the creature's red skinned triangular head. Two sunken eyes burning like hot coals search the area, trying to find you.");
		Text.Flush();

		player.curHp -= 2;
		player.curSp -= 5;

		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("A shrill laugh startles you. While you were focusing on the demon, some strange creature has sneaked up on you from behind! The tiny red monster seems to be some kind of imp; a nude, scrawny creature with bulging eyes and a head too large for its body.");
			Text.NL();
			Text.Add("Cursing, you prepare to fight the imp, which is quickly joined by another one just like it. Together, they force you out into the open. Above you, the demon watches the spectacle with a bemused grin. <b>HAH. THIS MIGHT BE AMUSING.</b>");
			Text.Flush();

			Gui.NextPrompt(Intro.DemonFight);
		});
	}
));

Intro.DemonFight = function() {
	var parse = {

	};
	parse = player.ParserTags(parse);

	Intro.lubedFlag = false;

	Text.Clear();
	Text.Add("You are facing the giant demon and two smaller imps.");
	Text.Flush();
	Gui.NextPrompt(function() {
		var enemy = new Party();
		enemy.AddMember(new IntroDemon());
		enemy.AddMember(new Imp());
		enemy.AddMember(new Imp());
		var enc = new Encounter(enemy);
		enc.canRun = false;
		// Set a custom loss scene (imp rape)
		enc.onLoss = function() {
			uru.flags["Intro"] |= Uru.IntroFlags.LostToImps;

			Text.Clear();
			Text.Add("Exhausted from the fight, you fall to your knees, your body hurting too much to keep up. The great demon looks down on you incredulously and laughs, a grotesque hissing and thundering sound. <b>HAHAHA! YOU THOUGHT THAT YOU COULD STAND UP TO ME? YET YOU CAN'T EVEN BEAT A BUNCH OF IMPS!</b> The demon seems greatly amused by your plight, but only observes you as you squirm around, trying to get away.");
			Text.NL();
			// Count imps
			var imps = this.GetEnemyArray();
			var numImps = imps.length - 1;
			var impPlural = (numImps > 1) ? "imps" : "imp";

			// Raise downed imps
			var numDowned = enc.GetDownedEnemyArray().length;
			if(numDowned > 0) {
				Text.Add("With a flick of his hand, the demon revitalizes the fallen " + impPlural + ".");
				Text.NL();
			}

			Text.Add("The "); if(numImps > 1) Text.Add(Text.NumToText(numImps) + " ");
			Text.Add(impPlural + " snicker at you, uncertainly looking up at the demon. <b>BY ALL MEANS,</b> it waves amiably with a great clawed hand.");

			if(player.Gender() == Gender.female) {
				Text.Add(" <b>KEEP HER VIRGINITY, THOUGH,</b> the demon adds as an afterthought.");
			}
			Text.NL();

			Text.Add("Released, the " + impPlural + " gleefully jump " + (numImps > 1 ? "" : "s") + " you, pushing you to the ground on all fours.");
			Text.NL();

			impPlural = (numImps > 1) ? "One of the imps" : "The imp";
			Text.Add(impPlural + " proudly present you with its "
			+ imps[1].FirstCock().Short()
			+ ", rubbing the hard shaft in your face before forcing it into your protesting mouth. The imp proceeds to roughly face-fuck you, ignoring your garbled protests. He pulls at your [hair] until he has pushed his meatstick as far down your throat as it'll go, then pulls out and repeats the process.", parse);
			Text.NL();

			if(numImps >= 2) {
				impPlural = (numImps == 2) ? "the other imp" : "another of the imps";
				Text.Add("Meanwhile, " + impPlural
				+ " has moved behind you and grabs hold of your [butt] and pushes his "
				+ imps[2].FirstCock().Short()
				+ " against your tight back door. The going is pretty rough, but soon, he is pistoning all his length inside you, setting your poor colon on fire.", parse);
				Text.NL();

				player.FuckAnal(player.Butt(), imps[2].FirstCock(), 2);

				Intro.lubedFlag = true;
			}

			if(numImps >= 3) {
				impPlural = (numImps == 3) ? "The last of the imps" : "Another of the imps";
				Text.Add(impPlural + " considers the positioning of the other imps, then grabs the shoulder of the one pounding away at your ass. After a short garbled conversation your lust-ridden mind cannot make sense of, they seem to come to an agreement. The imp crawls in under you, taking a moment to squeeze your ");
				if(player.Gender() == Gender.female)
					Text.Add(player.FirstBreastRow().Short());
				else
					Text.Add(player.FirstCock().Short());
				Text.Add(" while he is at it. For a short, blissful moment, the cock violating your butt is removed, only to be replaced by that belonging to the imp underneath you.");
				Text.NL();
				Text.Add("As the pressure on your poor anus increase, you realize that they intend to push both of them in there. You'll be feeling this one for a week... if you live that long that is.");
				Text.NL();

				player.FuckAnal(player.Butt(), imps[3].FirstCock(), 2);
			}

			if(numImps >= 4) {
				Text.Add("The final imp seems to be content just jerking off and rubbing his cock on your body, squeezing one of your nipples with his free hand so hard that it hurts.");
				Text.NL();
			}

			impPlural = (numImps > 1) ? "imps" : "imp";
			var growsPlural = (numImps > 1) ? "grow" : "grows";
			var impPossesive = (numImps > 1) ? "imps" : "imp's";
			var impThey = (numImps > 1) ? "they are" : "he is";
			Text.Add("The " + impPossesive + " rutting " + growsPlural + " more insistent, and you can tell "
			+ impThey + " ready to blow. Any other thoughts are wiped clear as your senses - and body - are filled to the brim with imp ejaculate. The " + impPlural + " withdraw, leaving you leaking cum on the ground.");
			Text.Flush();

			Gui.NextPrompt(Intro.DemonAftermath);
		}
		// Set a custom win scene
		enc.onVictory = function() {
			Text.Clear();

			Text.Add("<b>OH?</b> the demon's voice sounds interested, <b>SO, YOU MANAGED TO SURVIVE THIS LONG? MAYBE I UNDERESTIMATED YOU SOMEWHAT...</b> You spin around, facing your overwhelming adversary. For now, it seems to be just observing you.");
			Text.NL();
			Text.Add("<b>WELL, ARE YOU NOT GOING TO CLAIM YOUR PRIZE? TAKE ADVANTAGE OF YOUR FALLEN FOE?</b> Incredulously, you realize that the demon is encouraging you to rape the fallen imps.");
			Text.NL();
			Text.Add("<i>“D-don't think I am anything like you!”</i> you snap angrily. With an annoyed flick of his hand, the demon knocks you to the ground, forcing all the air out of your lungs.");
			Text.Flush();
			Gui.NextPrompt(Intro.DemonAftermath);
		}
		// Set a custom victory condition
		enc.VictoryCondition = function() {
			var downed = true;
			for(var i = 0; i < this.enemy.members.length; i++) {
				var e = this.enemy.members[i];
				if(e.name == "Demon") continue; // Don't count the demon
				if(e.Incapacitated() == false) downed = false;
			}
			return downed;
		}
		enc.Start();
	});
}

Intro.DemonAftermath = function() {
	Text.Clear();

	Text.Add("Gasping for air, you try to crawl away as the demon looms closer to you. <b>THIS IS ONLY THE BEGINNING, PUNY ONE,</b> the demon chortles, <b>LET'S SEE WHAT ELSE I CAN DO TO YOU...</b> The demon stabs down with one claw. A blinding pain hits your forehead and your vision turns red.");
	Text.NL();
	Text.Add("As the pain slowly subsides, you realize that the demon <i>didn't</i> skewer your head on its claw. Confused, you probe your forehead with shaking fingers. They find two unfamiliar hardened protrusions, sharp and ragged. Groaning, you poke at your new demon horn stubs, noting that they are quite sensitive.");
	Text.NL();
	Text.Add("<b>JUST A TASTE,</b> the grinning demon proclaims, <b>NOW, SHOULD I TURN YOU INTO A SLAVERING INCUBUS? PERHAPS A WILLING SLUT OF A SUCCUBUS? AH, DECISIONS.</b> The creature turns its attention from you as it ponders these important topics.");
	Text.Flush();

	Intro.timesTakenDemonGift = 0;
	Intro.cuntBlocked = false;

	TF.SetAppendage(player.Appendages(), AppendageType.horn, Race.Demon, Color.red, 2);

	player.RestFull();
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.DarkAspect.Cliff, {minute: 20});
	});
}


world.loc.DarkAspect.Cliff.description = function() {
	Text.Add("You are on a small outcropping on the sheer mountainside where you fought with the imps.");
	Text.NL();
	Text.Add("The huge demon is blocking the path back down, but it seems to be ignoring you for now, no doubt cooking up new ways to torture you.");
	Text.NL();
}

// SEE IMP.JS FOR MORE LINKS

world.loc.DarkAspect.Cliff.links.push(new Link(
	"Climb", true, true,
	function() {
		Text.Add("You could try to continue the climb up, though you doubt you could escape the demon's wrath for long. Still, not much choice, is there?");
		Text.NL();
	},
	function() {
		Text.Clear();

		Text.Add("Keeping a careful eye on the hulking demon, you move closer to the cliff face, trying to search for purchase. When you have climbed a few yards up and glance back, you see that the demon is watching you out of the corner of his eye. The bastard is pretending not to notice you!");
		Text.NL();
		Text.Add("Well, you did it once before, so perhaps it will work again... closing your eyes, you wish yourself away from this place, to the peak of the mountain, <i>anywhere</i> but here. To your surprise, it actually seems to work! The burning heat that emanates from the demon is suddenly replaced by a chill wind. Opening your eyes in wonder, you survey your surroundings.");
		Text.NL();
		Text.Add("You are at the very peak of the mountain, on a flat circular plateau no more than twenty yards across. Around and above, the sky is a calm meld of red and pink, and you realize that you are far above the rioting storm clouds. In the middle of the plateau stands a throne of stone.");
		Text.NL();
		Text.Add("An angry roar from below reminds you that this is no time to enjoy the scenery, as it probably won't take too long for the demon to climb its way up here...");
		Text.Flush();

		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("No sooner has the thought passed through your mind, before the sky darkens and the mighty demon soars past you on great black wings. You fearfully back away as the creature lands on the plateau, folding its wings behind it.");
			Text.NL();
			Text.Add("<b>YOU THOUGHT THAT YOU COULD ESCAPE ME?</b> the demon roars, <b>NO MATTER WHERE, I CONTROL THIS REALM!</b> You stumble as you attempt to escape from the demon, your back ending up against the throne. The fiery creature looms closer. It seems this is it for you.");
			Text.Flush();

			Gui.NextPrompt(Intro.UruAppears);
		});
	}
));

Intro.UruAppears = function() {
	Text.Clear();

	Text.Add("A bored yawn from behind snaps you out of your dreary thoughts. A pair of high-heeled boots enters your vision - no, scratch that - a pair of feet with great spines sticking out of them. Feet, you notice, that support a pair of exceedingly well-shaped legs. Moving further up, your eyes feast on the most glorious butt you have ever seen. It is only in hindsight that you realize that the amazing creature in front of you has red-tinted skin and a tail ending in a heart-shaped tip, swaying tantalizingly in front of your nose.");
	Text.NL();
	Text.Say("assets/img/uru.png");
	Text.Add("<i>“Who controls this realm, again?”</i> the female demon purrs with a toss of her long black hair. The 100-foot tall monstrosity towering over the two of you hesitates for a moment, showing a sign of... fear? You have a short moment to register confusion before the succubus releases a jet black beam of energy from her outstretched hand, piercing a wide smoking hole in the surprised demon's chest. It tumbles backward and into the yawning abyss a dozen feet away. Slowly, its screams fade. After some time, you hear a distant booming crash, announcing its final meeting with the ground far below.");
	Text.NL();
	Text.Add("<i>“Now then,”</i> the succubus declares, as if nothing had happened. <i>“Who might you be?”</i> She twirls around and you get a good look at her. Piercing orange eyes gaze down at you from her perfect face, crowned by a pair of long, curved demon horns. Her knockers could knock you flat any day, and her hourglass figure is nothing but exquisite. Your eyes move further down to rest on her...");
	Text.NL();
	Text.Add("<b>FUCK.</b>");
	Text.NL();
	Text.Add("...Sixteen inch demonic cock, resting just above her cunt. Just your luck.");
	Text.NL();
	Text.Add("<i>“Well? It is impolite to keep a lady waiting like that you know. Also, it is rude to stare,”</i> the omnibus quips with a wicked smile.");
	Text.Flush();

	Gui.NextPrompt(Intro.ChooseName);
}

Intro.ChooseName = function() {
	Text.Clear();
	Text.Add("What is your name?");
	Text.Flush();

	var textBox = document.getElementById("textInputArea");
	textBox.value = "";
	textBox.style.visibility = "visible";
	textBox.focus();
	Input.keyDownValid = false;

	Gui.NextPrompt(function() {
		if(textBox.value == "") {
			Text.Clear();
			Text.Add("What is your name?");
			Text.NL();
			Text.Add("You must enter a name!");
			Text.Flush();
			textBox.focus();
		}
		else {
			player.name = textBox.value;
			textBox.style.visibility = "hidden";
			Input.keyDownValid = true;
			// Go to next screen
			Intro.UruSeduce();
		}
	});
}

Intro.UruSeduce = function() {
	Text.Clear();
	Text.Add("<i>“Ooh, such a pretty name,”</i> the omnibus coos, <i>“I am Uru, friendly neighborhood omnibus, at your service.”</i> She gives you a theatrical little bow, her manhood bobbing up and down in front of you. It is almost hypnotizing.");
	Text.Flush();
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.DarkAspect.Peak, {minute: 5});
	});
}


world.loc.DarkAspect.Peak.description = function() {
	Text.Add("You are at the very peak of the mountain, on a flat, circular plateau no more than twenty yards across. Around and above, the sky is a calm meld of red and pink. In the middle of the plateau stands a throne of stone.");
	Text.NL();
}
world.loc.DarkAspect.Peak.links.push(new Link(
	"Throne", true, true,
	function() {
	},
	function() {
		Text.Clear();

		Text.Add("Now that things have calmed down, you take a moment to explore the area around you. There doesn't really seem to be anything interesting on the mountaintop, beside a few broken pillars and the large throne in the middle of everything.");
		Text.NL();
		Text.Add("The throne itself is made of black rock, polished to a sheen. Veins of light blue snake their way across the surface, as if the thing was made of jet black marble. The throne has no particular ornaments on it, but you notice that the seat is uneven and strange, with unnerving protrusions poking at whoever tries to sit on it.");
		Text.NL();
		Text.Add("It doesn't look like it would be very comfortable.");
		Text.NL();
		Text.Add("Engraved in the stone are runes in a strange language, glowing faintly. You don't understand their meaning.");
		Text.Flush();
		Gui.NextPrompt(PrintDefaultOptions);
	}
));
world.loc.DarkAspect.Peak.events.push(new Link(
	"Uru", true, true,
	function() {
		Text.Add("Beside the throne stands the omnibus who saved you from the demon. She follows your moves with interest; her eyes pinned on you like a cat focusing on a toy.");
		Text.NL();
	},
	function() {
		Text.Clear();

		Text.Add("<i>“Uh, thanks,”</i> you say uncertainly, not sure how to handle a woman who can, apparently, annihilate hundred-foot demons without breaking a sweat. That, and she obviously is a demon herself.");
		Text.NL();
		Text.Add("Uru circles around you, examining you thoroughly, pinching and poking at you, an unfamiliar element. Just when things start to get a bit awkward, she takes a step back to appraise you.");
		Text.NL();
		Text.Add("<i>“You don't belong here!”</i> she announces, proud of her discovery. <i>“What are you and how did you get here?”</i>");
		Text.Flush();
		
		var options = new Array();
		options.push({ nameStr: "Demon",
			func : function() {
				Text.Clear();
				Text.Add("You explain about the demon that brought you to this realm - the demon that she just slaughtered. This doesn't seem to be the right thing to say, though, as her mood darkens noticeably. <i>“You are lying! As if that pathetic worm could bridge the gate between dimensions! Not even I...”</i> she trails off thoughtfully. <i>“There must have been something else... what was it?”</i>");
				Text.NL();
				Text.Add("Do you tell her about the mirror or not? She did kind of save your life back there.");
				Text.Flush();

				var options = new Array();
				options.push({ nameStr: "Mirror",
					func : function() {
						Text.Clear();
						Text.Add("Thinking back, the thing that sticks to your mind is the mirror you found in the attic. When you mention it, Uru perks up again. <i>“Yeah, that sounds kind of plausible, a magical artifact, no doubt. Maybe even that runt could have managed it, in that case.”</i> She purses her lips. <i>“Actually, it sounds kind of familiar... but enough about that for now, though, I want to know more about you!”</i>");
						Text.Flush();

						uru.flags["Intro"] |= Uru.IntroFlags.ToldUruAboutMirror;

						Gui.NextPrompt(Intro.UruGift);
					}, enabled : true,
					tooltip : "Why not tell her the truth about the mirror? What harm could it do?"
				});
				options.push({ nameStr: "Lie",
					func : function() {
						Text.Clear();
						Text.Add("You are not sure why, but you don't think it would be a good idea to tell her about the mirror or the gem, even if she did save you. Not trusting everyone you come across is probably a healthy attitude when you have been transported to Hell. <i>“Nothing I can think of,”</i> you shrug. <i>“That big demon just appeared out of nowhere and pulled me here.”</i> She doesn't seem particularly happy about your evasive answer.");
						Text.NL();
						Text.Add("<i>“You better not be lying, it's impolite to lie!”</i> Angrily lashing her tail about her, she fumes a bit before announcing that she wants to know more about you, instead.");
						Text.Flush();

						Gui.NextPrompt(Intro.UruGift);
					}, enabled : true,
					tooltip : "A good lie has some truth in it, telling her that the demon brought you here could probably work."
				});
				Gui.SetButtonsFromList(options);
			}, enabled : true,
			tooltip : "Explain how the demon captured and hunted you."
		});
		Gui.SetButtonsFromList(options);
	}
));

Intro.UruGift = function() {
	Text.Clear();

	Text.Add("The whole conversation feels very bizarre. The woman in front of you could easily capture the heart of any man back home - at least, were it not for her extra equipment. Though she seems a bit vapid and has an incredibly short attention span, you can't shake the feeling that you should be very careful about what you say.");
	Text.NL();
	Text.Add("It might have something to do with the fact that she killed an enormous demon without any apparent effort.");
	Text.NL();
	Text.Add("You start talking about your hometown, but she stops you after only a few sentences. <i>“No, no! I don't want to know what you were, I want to know what you will become!”</i> Perplexed, you ponder the strange question. Does she mean your wishes for the future?");
	Text.Flush();

	//TODO no impact?
	//[Power][Love][Peace]
	var options = new Array();
	options.push({ nameStr : "Power",
		func : function() {
			Text.NL();
			Text.Add("You tell her that you desire power, to be a ruler of men.");
			Text.Flush();
			Gui.NextPrompt(Intro.UruConfirmGift);
		}, enabled : true,
		tooltip : "You desire power."
	});
	options.push({ nameStr : "Love",
		func : function() {
			Text.NL();
			Text.Add("Most of all, you desire to be loved.");
			Text.Flush();
			Gui.NextPrompt(Intro.UruConfirmGift);
		}, enabled : true,
		tooltip : "You desire to be loved."
	});
	options.push({ nameStr : "Peace",
		func : function() {
			Text.NL();
			Text.Add("You desire to live peacefully, with the power to protect your friends and loved ones from harm.");
			Text.Flush();
			Gui.NextPrompt(Intro.UruConfirmGift);
		}, enabled : true,
		tooltip : "You desire a peaceful existence."
	});
	Gui.SetButtonsFromList(options);
}

Intro.UruConfirmGift = function() {
	Text.Clear();
	player.SetLevelBonus();

	Text.Add("Uru looks at you dubiously. <i>“You really think you could become someone like that?”</i> She ponders, <i>“The way I see it, you were pretty pathetic back there.”</i>");
	Text.NL();
	if(uru.flags["Intro"] & Uru.IntroFlags.LostToImps) {
		Text.Add("She giggles, <i>“Watching you get railed by imps was fun though, it looked like you enjoyed it!”</i> You blush angrily at that, it's not like you lost on purpose!");
		Text.NL();
	}

	Text.Add("After taking another measure of you again, she slowly shakes her head. <i>“No, that won't do.”</i> She reaches forward with her palm. Instinctively, you recoil from her, but her hand whips out faster than you can withdraw. <i>“Oh, don't be such a child,”</i> she fusses over you. A wave of pure energy blasts from her hand straight into your skull, shaking your very being.");
	Text.NL();
	Text.Add("You cry out in a wordless scream as you are disintegrated, hot fire burning your body to a cinder... and then she withdraws her hand. Blinking dumbly, you inspect your body. You are perfectly fine, except...");
	Text.NL();
	Text.Add("For some reason, you feel... different. You have little time to contemplate this however.");
	Text.Flush();

	Gui.NextPrompt(Intro.UruGen);
}

Intro.UruGen = function() {
	Text.Clear();

	Text.Add("<i>“Enough about you, how about me?”</i> The powerful omnibus arches her back and strikes a seductive pose. <i>“Tell me, what part of me do you like the most?”</i> Blushing, you inspect the voluptuous creature in front of you, your body filling with warmth. She looks gorgeous, all of her, from her perfect hourglass shape, to her lush, D-cup breasts, to her rounded buttocks. The sight of her aroused genitalia, both her dripping cunt and her stiffening manhood, makes you shiver in anticipation.");
	Text.NL();
	Text.Add("Giving praise where praise is due surely can't hurt?");
	Text.NL();

	player.curLust = player.Lust();

	// TODO: SEXUAL PREFERENCE INITIAL VALUES
	Text.Flush();

	var options = new Array();
	options.push({ nameStr : "Cock",
		func : function() {
			Text.Add("Uru closes in on you, a wicked smile on her face. <i>“Really now, is that so?”</i> As you nod, the object of your admiration rises to full mast. It is certainly the biggest one you've ever seen");
			if(player.Gender() == Gender.male) Text.Add(", much bigger than your own");
			Text.Add(". She licks her lips hungrily and gives her shaft a tentative stroke. <i>“How about putting it to use then?”</i>");
			Text.NL();

			Intro.UruSexChoice();
		}, enabled : true,
		tooltip : "That cock sure looks juicy..."
	});
	options.push({ nameStr : "Vagina",
		func : function() {
			Text.Add("Uru puts one leg on the seat of the throne, letting you get a closer look at her exposed female sex. Her glistening lower lips are a darker shade of red than her skin, but her inner walls are a delicious pink. <i>“All look and no touch?”</i> she teases with a naughty smile.");
			Text.NL();

			Intro.UruSexChoice();
		}, enabled : true,
		tooltip : "Her vagina is moist with juices, inviting and alluring."
	});
	options.push({ nameStr : "Ass",
		func : function() {
			Text.Add("She chuckles and places a hand on her expansive butt. <i>“I guess I make a good first impression!”</i> She turns around with a little twirl and presents her booty to you. Between her legs, you can clearly see her dripping sex - or rather, both of them. <i>“You like what you see?”</i> she challenges you with a husky voice. <i>“Why don't you try claiming it?”</i>");
			Text.NL();

			Intro.UruSexChoice();
		}, enabled : true,
		tooltip : "What wouldn't you give to tap that ass?"
	});
	options.push({ nameStr : "Breasts",
		func : function() {
			Text.Add("<i>“Oh, these inconvenient things?”</i> she asks with an exaggerated sigh that causes her D-cups to bounce in an almost hypnotic manner. Bending forward, she gives you a much closer look. <i>“Go ahead, you can touch them,”</i> she murmurs throatily, <i>“but wouldn't you rather do something more fun?”</i>");
			Text.NL();

			Intro.UruSexChoice();
		}, enabled : true,
		tooltip : "That cleavage is to die for."
	});
	Gui.SetButtonsFromList(options);
}

Intro.UruSexChoice = function() {
	Text.Add("Dimly, you realize that you are about to bang a demon - an extremely sexy demon, sure, but the detail still nags at your muddled mind.");
	Text.NL();

	// Init counter here
	Intro.timesSuckedUru = 0;
	Intro.fuckedTarget = null;

	Text.Flush();

	var options = new Array();
	options.push({ nameStr : "Fuck vagina",
		func : function() {
			uru.flags["Intro"] |= Uru.IntroFlags.FuckedUru;
			if(player.Gender() == Gender.female) {
				Gui.Callstack.push(Intro.UruSexFuckVagina);
				Intro.UruGiveClitcock();
			}
			else
				Intro.UruSexFuckVagina();
		}, enabled : true,
		tooltip : (player.Gender() == Gender.male) ? "Your cock yearns to be buried inside the omnibus, and her vagina provides a tantalizing target." : "You simply must fuck this beautiful hermaphrodite, and her vagina provides a tantalizing target. Exactly how that is supposed to work is a bit unclear."
	});
	options.push({ nameStr : "Fuck anal",
		func : function() {
			uru.flags["Intro"] |= Uru.IntroFlags.FuckedUru;
			if(player.Gender() == Gender.female) {
				Gui.Callstack.push(Intro.UruSexFuckAnal);
				Intro.UruGiveClitcock();
			}
			else
				Intro.UruSexFuckAnal();
		}, enabled : true,
		tooltip : (player.Gender() == Gender.male) ? "You can't wait to rail that tight butt. That a demonic tail is attached an inch above it only provides a slight distraction." : "That butt looks simply delicious... if only you had something to fuck it with."
	});
	options.push({ nameStr : "Get fucked",
		func : function() {
			uru.flags["Intro"] |= Uru.IntroFlags.FuckedByUru;
			Intro.UruSexGetFucked();
		}, enabled : true,
		tooltip : "Your eyes constantly stray to the thick cock between her legs. What would it be like if she used it on you?"
	});
	options.push({ nameStr : "No",
		func : Intro.UruSexDenied, enabled : true,
		tooltip : "No matter how alluring you find the demonette, you must not allow yourself to be seduced. Who knows what she might be after?"
	});
	Gui.SetButtonsFromList(options);
}

Intro.UruGiveClitcock = function() {
	Text.Clear();

	Text.Add("<i>“Heh, don't you lack the equipment for that, honey? No matter, that can easily be fixed...”</i> Before you have time to protest, the omnibus reaches down between your legs and gives your clit a gentle touch, eliciting a gasp from you. A sudden wave of pleasure fills your body and causes you to cry out and almost making you black out. Dizzied, you gasp as your gaze fall between your legs on your new equipment.");
	Text.NL();
	Text.Add("The previously rather innocent-looking button gracing your vagina has grown and swelled to a four-inch pillar as thick as an average penis. When you give your girl-cock a probing touch, the feeling makes your knees go weak, this is going to take time to get used to.");
	Text.NL();
	Text.Add("Time that the horny demon is obviously unwilling to grant you, as she unceremoniously swallows your entire length. Your mind goes blank as an unfamiliar sensation flows through your nether regions, and your new appendage erupts like a fountain into the mouth of the eager omnibus.");
	Text.NL();
	Text.Add("Panting, you realize that you have just had an orgasm. Smirking, Uru sucks out the last of your ejaculate. Idly, you wonder if the stuff is potent, though your musings are cut short as the omnibus hugs you, jamming her tongue into your mouth in a rough french kiss, forcing your own cum into your mouth. Her own rock hard dick rubs between your bodies as she pulls away. The demon licks her lips and leans back, looking at you expectantly.");
	Text.Flush();

	uru.flags["Intro"] |= Uru.IntroFlags.GotClitcock;

	// Gain clit cock
	var cc = player.FirstVag().CreateClitcock();
	cc.length.base = 14;
	player.body.cock.push(cc);

	var options = new Array();
	options.push({ nameStr : "Spit",
		func : function() {
			Text.Clear();
			Text.Add("Coughing, you spit the thick fluid on the ground. The taste is strangely sweet... ");
			if(uru.flags["Intro"] & Uru.IntroFlags.LostToImps)
				Text.Add("very different from the bitter sperm that the imps pumped you full of");
			else
				Text.Add("not that you'd know what cum usually tastes like");
			Text.Add(". The omnibus looks at you disapprovingly, like you just spilled perfectly good cream - which you kind of did.");
			Text.NL();
			Text.Add("<i>“How about giving it a test run?”</i> the succubus teases you, striking a sultry pose.");
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Ew, gross! Spit it out!"
	});
	options.push({ nameStr : "Swallow",
		func : function() {
			Text.Clear();
			player.AddSexExp(5);
			player.slut.IncreaseStat(100, 2);
			Text.Add("Surprised at yourself, you gulp down the sweet, thick substance, enjoying the flavor. It, subconsciously, makes you wonder if the omnibus tastes just as good... as you snap back to reality, the demon is grinning at you widely. <i>“Do you like it?”</i> she asks. You give her a short nod, blushing.");
			Text.NL();
			Text.Add("<i>“How about giving it a test run?”</i> the succubus teases you, striking a sultry pose.");
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Hmm, maybe this isn't so bad. You <i>are</i> feeling a bit hungry..."
	});
	Gui.SetButtonsFromList(options);


}

Intro.UruSexFuckVagina = function() {
	var parse = {

	};
	parse = player.ParserTags(parse);

	Text.Clear();

	Text.Add("You gently push the horny demon down on the black throne and spread her legs, exposing her dripping cunt. Her own aroused member proves a slight distraction, but she pulls it out of the way, giving you free access to her feminine parts. She looks at you expectantly, licking her lips and slowly stroking herself in anticipation.");
	Text.NL();
	Text.Add("Suddenly a bit nervous, you align your [cock] with her wet opening, accidentally rubbing against her own significantly larger member. Overcome by your lust, you thrust forward into her folds, eliciting a soft moan from the omnibus. You slowly push your [cock] to the hilt, greatly enjoying the feeling.", parse);
	Text.NL();

	Sex.Vaginal(player, uru);
	uru.FuckVag(uru.FirstVag(), player.FirstCock(), 5);
	player.Fuck(player.FirstCock(), 5);

	Text.Add("Gathering yourself, you get down to business and start pounding the slutty hermaphrodite as hard as your hips will let you. Her tight passage is a marvel, her insides feeling as if they are moving on their own, stroking and squeezing your length. The way things are going, you are not going to last long.");
	Text.Flush();

	var options = new Array();
	options.push({ nameStr : "Deeper",
		func : function() {
			Text.Clear();
			Text.Add("In for a penny, in for a pound. You increase your pace and make your thrusts deeper and harder, bottoming out each time you push into the demon. <i>“Yeah! Fuck me deeper!”</i> The omnibus moans loudly. <i>“Ram that shaft into my cunt!”</i> You are only too happy to oblige.");
			Text.NL();
			Text.Add("Her pussy is truly exquisite - slick and accommodating, but at the same time incredibly tight. Seeking a better angle, you push Uru's legs up beside her head, allowing you to push even harder into her depths.");
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Fuck it, keep going!"
	});
	options.push({ nameStr : "Tits",
		func : function() {
			Text.Clear();
			Text.Add("Slowing your thrusts, you let go of the demon's hips and lean to grab at her soft breasts, kneading and squeezing them as a baker would dough. After giving them a thorough massage, you switch to pinching and pulling at her pert nipples. Uru seems to definitely enjoy the attention you are giving her, moaning soft encouragements as she bites her full lips, looking up at you intently.");
			Text.NL();
			Text.Add("Leaning closer, you start to suck and bite on one nipple, while continuing to play with the other. Gasping, the omnibus urges you to stop playing around and fuck her properly.");
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Try to distract her by massaging her breasts."
	});
	options.push({ nameStr : "Suck cock",
		func : function() {
			Text.Clear();

			Intro.timesSuckedUru++;
			player.slut.IncreaseStat(100, 5);

			Sex.Blowjob(player, uru);
			player.FuckOral(player.Mouth(), uru.FirstCock(), 2);
			uru.Fuck(uru.FirstCock(), 2);

			Text.Add("Deciding that the omnibus' own cock deserves some attention, you slow your thrusting and reach down, grabbing the formidable tool with both hands. The demon's eyes snap open as you start to stroke her, sliding your hands from her thick base to the sensitive glans. You gaze deep into her eyes. She seductively crooks her finger, enticing you to come closer.");
			Text.NL();
			Text.Add("Almost hypnotized, you bend in for a kiss when suddenly, her tail whips out, encircling your throat. The pressure isn't suffocating, but you find your back inexorably twisting as she pulls your head down until you are presented with her throbbing monster, face to face.");
			Text.NL();
			Text.Add("<i>“Mmm... that is a good little slut,”</i> the omnibus moans as you start licking and sucking at her tip. <i>“Just couldn't hold yourself back, could you?”</i> she teases. One of her hands grabs your [hair] and gently, though firmly, forces you to take inch after inch of her into your mouth.", parse);
			Text.NL();
			parse["cunt"] = player.Gender() == Gender.female ? "cunt" : "ass";
			Text.Add("<i>“Once you are done, maybe I'll give you a taste - you'd like that, wouldn't you? How many inches do you think your [cunt] can take? Why don't we find out?”</i> she taunts as she forces you to slowly deepthroat her. She releases you right before you begin to choke. You gasp for air while reflexively swallowing the strands of pre-cum she has left behind.", parse);
			Text.NL();
			Text.Add("You glare at her, but all she does is offer you a wicked smile. <i>“Don't give me that look, don't you have something else to finish before I plug your other holes, hmm?”</i> Giving your head a shake, you set your mind to the task at hand.");
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Why not give her cock some attention while you are railing her?"
	});
	Gui.SetButtonsFromList(options);

	Gui.Callstack.push(function() {
		Text.Clear();
		parse["male"] = player.Gender() == Gender.male ? ", emptying the contents of your balls." : "";
		Text.Add("Your thrusts get shorter and more irregular as you approach your peak. The demon keeps egging you on, but you are too far gone to even hear her. With a final push of your hips, you hilt yourself as your [cock] erupts inside the demon[male].", parse);
		Text.NL();
		Text.Add("<i>“Mmm... not bad, I must say,”</i> she muses, caressing your [face] fondly, <i>“I don't suppose you'd let me return the favor? A girl has needs, you know...”</i>", parse);

		Text.Flush();

		var options = new Array();
		options.push({ nameStr : "Nope",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Guess not,”</i> she sighs, disappointed, as you shake your head firmly.");
				Text.NL();
				Text.Add("Totally spent, you relax your muscles and take a step backwards, only to find her legs clamped around your back, locking you together. Your [cock] is being held like a vice by the demon's vagina as she milks you for the last of your cum. The sucking pressure keeps up far longer than is comfortable for you. Alarmed, you feel as if you are losing strength. It feels like your very soul is being sucked out through your [cock].", parse);
				Text.NL();
				Text.Add("Desperate, you somehow manage to wrench free from the hermaphrodite and collapse in a heap before her.");
				Text.Flush();
				Gui.NextPrompt(Intro.UruSexAftermath);
			}, enabled : true,
			tooltip : "No way are you agreeing to that!" + (player.Gender() == Gender.male ? " Gay!" : "")
		});
		options.push({ nameStr : "Get fucked",
			func : function() {
				uru.flags["Intro"] |= Uru.IntroFlags.FuckedByUru;
				Text.Clear();
				Text.Add("To your muddled mind, this doesn't seem like such a bad idea, and you eagerly nod. With the same wicked smile, the omnibus lets go of you, allowing you to withdraw your spent [cock] from her depths, only for her to suddenly manhandle you with surprising strength until you are on all fours. <i>“No regrets, right?”</i> she murmurs into your ear. On second thought, you are not so sure anymore.", parse);
				Text.Flush();
				Gui.NextPrompt(Intro.UruSexGetFuckedPassive2);
			}, enabled : true,
			tooltip : "Well, it would only be fair to let her have some fun too... what could go wrong?"
		});
		Gui.SetButtonsFromList(options);
	});
}

Intro.UruSexFuckAnal = function() {
	var parse = {

	};
	parse = player.ParserTags(parse);

	Text.Clear();

	Text.Add("You motion for the demon to bend over the throne, to which she happily complies, resting her arms on the black stone as she wriggles her expansive booty at you. <i>“Do you see something you like?”</i> she huskily asks, as she gazes up at you with an innocent look on her face. You gulp, transfixed by her slowly gyrating behind, putting all of her assets on display.");
	Text.NL();
	Text.Add("<i>“Take me, brave hero!”</i> she moans, spreading her legs even more and offering you full access to both her holes. Above her thick demonic cock rests her slit, dripping wet. Even further up lies your target, her impossibly tight-looking ass, resting between her round butt cheeks. Her tail is swaying back and forth invitingly. Your [cock] is stiff with desire, a tiny drop of pre-cum forming at the tip, but even so, going in dry would probably not be a good idea.", parse);
	Text.NL();
	Text.Add("Licking your lips, you consider your options. You could use your own spit as makeshift lube, or maybe borrow some from her dripping pussy. Or, you could be really kinky and suck some lube from her throbbing member.");
	Text.Flush();

	// [Spit][Cunt][Suck]
	var suckeddick = false;
	var options = new Array();
	options.push({ nameStr : "Spit",
		func : function() {
			Text.Clear();
			Text.Add("Eager to get right into the action, you apply a generous glob of saliva to her anus and rub it in with the tip of your [cock]. Grabbing the demon's full buttocks, you give the supple red skin a firm squeeze before planting your [cock] between them. With long, slow strokes, you spread the makeshift lube evenly along your stiff length, hotdogging the horny demon.", parse);
			Text.NL();
			Text.Add("After a bit of this treatment, Uru starts fidgeting. <i>“No need to be gentle, you know,”</i> she reprimands you, sounding slightly annoyed, <i>“I want it rough and hard!”</i> To emphasize her desire, her long tail curls tightly around your [cock] and pulls it into position.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Saliva is the poor man's lube."
	});
	options.push({ nameStr : "Cunt",
		func : function() {
			Text.Clear();
			player.AddSexExp(1);
			parse["male"] = player.Gender() == Gender.male ? ", your balls slapping against her stiff cock" : "";
			Text.Add("Well, the omnibus seems eager to provide her own lube, so why not put it to use? You grab your [cock] and rub it against Uru's dripping honeypot, coating your entire length in sticky girl juice. The slutty demonette, mistaking your intentions, starts grinding her hips back against your erection, begging for you to penetrate her. In one smooth thrust, you hilt your [cock] inside her[male].", parse);
			Text.NL();
			Text.Add("Gods, she feels amazing! You almost forget yourself and start pumping her pussy then and there, but manage to regain control. <i>“H-hey!”</i> she complains as you withdraw from her hot tunnel. <i>“Don't stop now!”</i>");
			Text.NL();
			Text.Add("Grinning, you give her wet labia a last rub, eliciting a needy moan from your demon slut. <i>“O-oh!”</i> Uru exclaims, delighted as you adjust your aim, your [cock] prodding her soon-to-be-defiled anus.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Why not use that nice cunt to lube yourself up?"
	});
	options.push({ nameStr : "Suck",
		func : function() {
			Text.Clear();

			player.slut.IncreaseStat(100, 5);
			suckeddick = true;
			Intro.timesSuckedUru++;

			Sex.Blowjob(player, uru);
			player.FuckOral(player.Mouth(), uru.FirstCock(), 2);
			uru.Fuck(uru.FirstCock(), 2);

			Text.Add("A very wicked thought passes through your head and, with a grin, you decide to put it into action. You drop down on your knees and gently spread the demonette's legs further apart. Uru complies, peeking over her shoulder, curious about what you have in mind. You start kneading her full buttocks, pulling them apart, exposing and stretching her tail hole. A kiss and a lick to her tight pucker draws a shiver from the omnibus - but that is not your target, not yet.");
			Text.NL();
			Text.Add("Passing downward, you give Uru's female parts some attention before focusing on your main course. Firmly grabbing her immense dick with both hands, you gently pull it back until you can easily lick at the head. Unable to hold yourself back any longer, you eagerly dig into your meal. Starting with long licks from base to tip, you reverently caress the massive cock with your tongue. The omnibus is at first surprised by your attentions. <i>“Hungry little slut, aren't you,”</i> she sighs, bemusedly rolling her eyes, <i>“and here I thought I would be getting some action.”</i>");
			Text.NL();
			Text.Add("You ignore her complaints and move your focus to the tip of her bloated bitch-breaker, lapping at her urethra. Already you can taste her spunk on your tongue, a delightful mix of sweet and salty. Your senses are reeling, assaulted by not only sight and touch, but also taste and smell. You take a deep breath and eagerly swallow as much of her cock as you can manage.");
			Text.NL();

			if(uru.flags["Intro"] & Uru.IntroFlags.LostToImps)
				Text.Add("You are certainly no expert in the art of blowjobs - though you could definitely get addicted the way things are going - but the encounter with the imps has at least prepared you a little. That being said, nothing could prepare you for the sheer size of the hermaphrodite's member.");
			else
				Text.Add("Having never done this before, you are a bit uncertain on how to proceed. A combination of sucking on the head and lapping at it with your tongue seems to do the trick, though.");
			Text.NL();

			Text.Add("<i>“Mmm... ooh... suck it deeper,”</i> the quivering omnibus moans, coaxing you to swallow more of her huge demonic girl-cock. Try as you might, your gag reflex soon gets the better of you, and you are forced to back off. Changing your tactic, you keep the head inside your mouth and alternate between sucking and blowing, all the while jerking the omnibus off using both of your hands.");
			Text.NL();
			Text.Add("Eager to get to the real action, you intensify your efforts. Uru, possibly guessing your goal, nudges you on with soft moans, praising your skill. She begins to rock her hips, but the awkward position makes her unable to properly facefuck you. Still, with your combined efforts, the omnibus is soon panting with need. <i>“G-gonna blow, deep down your throat!”</i> she moans huskily. From the throbbing of her dick and the increasingly erratic movement of her hips, you can tell she isn't joking.");
			Text.NL();
			Text.Add("Planting her feet wide, she shoves as much of her dick down your throat as she can, ignoring your protests. As she reaches her climax, wave after wave of hot spunk is pumped down your gullet, making your throat sticky with demon jizz. Overwhelmed by the first few blasts, you almost forget your true purpose, opting instead to swallow as much of the delicious fluid as you can.");
			Text.NL();
			Text.Add("You realize that you don't have to worry, though, as the steady stream of cum doesn't let up. Soon, you pull away for air, allowing the demon to paint not only your face white, but also your front. Fumbling a bit, you easily manage to fill your mouth with hot jizm, fighting back the urge to swallow it immediately.");
			Text.NL();
			Text.Add("Finally, the omnibus seems to have slowed down, the stream of spunk turning into a slow trickle. You fondly caress her member one last time, before straightening and depositing your sticky cargo between her butt cheeks. You eagerly coat your [cock] from root to crown in the makeshift lube before firmly pressing the tip against Uru's coated anus.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "One way to acquire some lube could be to suck it from Uru's cock. No, that is way too lewd! ...Isn't it?"
	});
	Gui.SetButtonsFromList(options);

	Gui.Callstack.push(function() {
		Text.Clear();

		Text.Add("<i>“Ah, so this was what you had in mind,”</i> the horny demon moans appreciatively while you grind your lubed [cock] against her back door. Taking the hint, you slowly push against her tight opening. The sexual fluids coating your [cock] certainly help, but her butt is still incredibly tight. With a grunt from you, and a delighted scream from Uru, you manage to push an inch of your member inside her.", parse);
		Text.NL();

		Sex.Anal(player, uru);
		uru.FuckAnal(uru.Butt(), player.FirstCock(), 5);
		player.Fuck(player.FirstCock(), 5);

		Text.Add("You have to pause to not shoot your load immediately from the immense pressure, but the omnibus will have none of it, and immediately pushes her needy hips back forcefully, swallowing the rest of your [cock] to the hilt.", parse);
		if(player.Gender() == Gender.male)
			Text.Add(" Your swelling balls slap against her full bottom, eager to deposit their load into the willing omnibus.");
		Text.NL();
		Text.Add("Biting your lip, you start to move, hips thrusting back and forth. Her tight tunnel is gripping like a vice, yet you can move in and out of her with ease. After a few minutes of intensely ass-fucking the demon, you feel her tail curling up around one of your legs and gasp as the tip brushes against your own back door. How do you react? Ignore it, eagerly accept it or firmly deny it?");
		Text.Flush();

		var buttfucked = false;
		// [Eager][Let be][Deny]
		var options = new Array();
		options.push({ nameStr : "Eager",
			func : function() {
				Text.Clear();
				player.AddSexExp(2);
				player.slut.IncreaseStat(100, 5);
				buttfucked = true;
				Text.Add("Pausing momentarily, you plant your feet wider and reach back, parting your buttocks to ease entry. Moaning like a slut, you egg the omnibus to push it in. Chuckling at your eagerness, Uru penetrates your waiting [anus] and starts to roughly fuck you with her tail, reaching several inches deep.", parse);
				Text.NL();
				Text.Add("<i>“Don't forget about doing your part now, slut,”</i> she moans in a sultry voice, encouraging you to start moving again. <i>“Perhaps after you are done, we can switch places, huh?”</i> she grins over her shoulder.");
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Mm... that feels good..."
		});
		options.push({ nameStr : "Let be",
			func : function() {
				Text.Clear();
				player.AddSexExp(1);
				buttfucked = true;
				Text.Add("Shrugging, you continue your thrusting. The tail seems to be content with just rubbing against your anus at first, but the prodding soon becomes more incessant as she slowly pushes inside, matching her thrusts to yours.");
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "If that makes her happy, why not? You got other things on your mind - like fucking her brains out."
		});
		options.push({ nameStr : "Deny",
			func : function() {
				Text.Clear();
				Text.Add("Gently, but firmly, you grab the demon's tail and move it away. The omnibus seems annoyed for a moment, but forgets about the incident entirely as you grab hold of her hips and start to ram your [cock] even further up her butt. In no time at all, she is at your mercy, moaning for you to go faster, harder, deeper.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Screw that, you are in charge here!"
		});
		Gui.SetButtonsFromList(options);

		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("Inexperienced as you are, it is not long before your erratic thrusting brings you to your climax, basting the omnibus' anal tunnel with your white, hot spunk. Panting, you attempt to withdraw from her, only to find that you can't. <i>“Oh, you can't be done already, can you?”</i> the omnibus complains petulantly, <i>“I was just getting into it!”</i>");
			Text.NL();
			Text.Add("She sighs hopefully, <i>“I guess you wouldn't be interested in switching places?”</i>");
			if(buttfucked)
				Text.Add(" To accentuate her statement, her tail thrusts deeper inside you, mashing up against your prostate.");
			Text.Flush();

			// [Get fucked][Nope]
			var options = new Array();
			options.push({ nameStr : "Get fucked",
				func : function() {
					uru.flags["Intro"] |= Uru.IntroFlags.FuckedByUru;
					Text.Clear();
					Text.Add("To your muddled mind, this doesn't seem like such a bad idea, and you eagerly nod. With a wicked smile, the omnibus lets go of you, allowing you to withdraw your spent member. With surprising strength, she manhandles you until you are on all fours. <i>“No regrets, right?”</i> she murmurs into your ear. On second thought, you are not so sure anymore.");
					Text.Flush();
					Gui.NextPrompt(Intro.UruSexGetFuckedPassive2);
				}, enabled : true,
				tooltip : "Well, it would only be fair to let her have some fun too... what could go wrong?"
			});
			options.push({ nameStr : "Nope",
				func : function() {
					Text.Clear();
					Text.Add("<i>“I thought so,”</i> she sighs mournfully. ");
					if(suckeddick)
						Text.Add("<i>“Still, thanks for sucking me off before,”</i> she says, smiling back over her shoulder. ");
					Text.Add("Arching her back, she is still, somehow, keeping your [cock] trapped inside her. <i>“Well,”</i> she states, a determinant tone in her voice, <i>“we are just going to have to keep going then, aren't we?”</i>", parse);
					Text.NL();
					Text.Add("With that, she starts to push her hips back against you. Surprised, you fall on the ground, with the demon following, the impact almost making you cum again. Moaning, the horny slut starts to gyrate her hips, rising and falling on your [cock], still hard despite your recent climax.", parse);
					Text.Flush();
					Gui.NextPrompt(Intro.UruSexFuckAnal2);
				}, enabled : true,
				tooltip : "No way are you agreeing to that!" + (player.Gender() == Gender.male ? " Gay!" : "")
			});
			Gui.SetButtonsFromList(options);
		});
	});
}

Intro.UruSexFuckAnal2 = function() {
	var parse = {
		cock : function() { return player.FirstCock().Short(); }
	};

	Text.Clear();
	Text.Add("Later...");
	Text.Flush();

	Gui.NextPrompt(function() {
		player.AddSexExp(5);

		Text.NL();
		Text.Add("How many times has she made you climax, pumping her full of hot seed? You have completely lost count, riding on the brink of exhaustion from one orgasm to the next. ");
		if(player.Gender() == Gender.male)
			Text.Add("Your balls feel completely both numb and drained, though another load seems to be building.");
		else
			Text.Add("Even if you aren't sure of exactly <i>where</i> your ejaculate is coming from, there seems to be no lack of it.");
		Text.NL();
		Text.Add("You feel completely sapped of strength; more so than normal, you realize, quite alarmed. The last of your energy is being sucked right out through your [cock]! Too late, you realize the demon's sinister motivations. With a weak, desperate push, you manage to disentangle yourself from the hermaphrodite before she claims your soul completely.", parse);
		Text.Flush();
		Gui.NextPrompt(Intro.UruSexAftermath);
	});
}

// Intro.fuckedTarget
Intro.UruSexGetFucked = function() {
	Text.Clear();
	Text.Add("Her husky smile slowly spreads while you squirm uncomfortably under her gaze. ");

	if(player.Gender() == Gender.male) {
		Intro.fuckedTarget = BodyPartType.ass;
		Text.Add("<i>“Really now. Well, if that is what you are into, I'll make the experience one to remember,”</i> she promises with a chuckle, <i>“You might not be able to sit for a while, though.”</i>");
		Text.Flush();
		Gui.NextPrompt(Intro.UruSexGetFuckedPrep);
	}
	else {
		Text.Add("<i>“Mmm,”</i> the omnibus murmurs as she licks her lips in anticipation, <i>“Tell me, where do you want it?”</i>");
		Text.NL();
		Text.Flush();
		//[Anal][Vaginal]
		var options = new Array();
		options.push({ nameStr : "Anal",
			func : function() {
				Intro.fuckedTarget = BodyPartType.ass;
				if(player.Butt().virgin == false)
					Text.Add("<i>“Heh, getting addicted to butt-fucking, are we?”</i>");
				else
					Text.Add("<i>“Really now. Well, if that is what you are into, I'll make the experience one to remember,”</i> she promises with a chuckle, <i>“You might not be able to sit for a while, though.”</i>");
				Text.NL();
				Text.Add("You mutter something about saving yourself, but she just laughs at you. <i>“You go ahead and rationalize it however you want, my little buttslut,”</i> she states, smiling fondly at you.");
				Text.Flush();
				Gui.NextPrompt(Intro.UruSexGetFuckedPrep);
			}, enabled : true,
			tooltip : (player.Butt().virgin) ? "No way you are giving up your virginity! Taking it in the butt can't be that bad, can it?" : "Well, seeing how it is already broken in..."
		});
		options.push({ nameStr : "Vaginal",
			func : function() {
				Intro.fuckedTarget = BodyPartType.vagina;
				Intro.lubedFlag = false; // In case the imps raped you before
				Text.Add("<i>“Ah, I'll be getting a virginal treat?”</i> She slides closer until the two of you are pressed against each other, her male genitalia rubbing against your stomach.");
				Text.Flush();
				Gui.NextPrompt(Intro.UruSexGetFuckedPrep);
			}, enabled : true,
			tooltip : "You can't wait any longer... your vagina needs to be filled with cock!"
		});
		Gui.SetButtonsFromList(options);
	}
}

// Get all lubed up and ready
// Intro.lubedFlag
Intro.UruSexGetFuckedPrep = function() {
	Text.NL();
	Text.Add("<i>“Feel like saying hello?”</i> the omnibus asks with a smile, nodding downward meaningfully.");
	Text.NL();
	Text.Add("Dropping your eyes to Uru's rigid appendage, you get a sinking feeling that, maybe, you didn't think this through. Staring you right in the face is sixteen inches of stiff demon cock. Very close to your face, in fact, as you have unconsciously dropped to your knees in front of the omnibus. Licking your lips, you consider how to prepare yourself for this.");
	Text.NL();
	Text.Add("Sucking her off could provide some much needed lubrication for your upcoming reaming... or you could just get right to the action.");
	Text.Flush();

	//[Suck her][Lead][Passive]
	var options = new Array();
	options.push({ nameStr : "Suck her",
		func : function() {
			Text.NL();
			Text.Add("Deciding that it would probably be wise to lube her up before she fucks you, you lean forward, planting a kiss on her massive member.");
			Text.Flush();
			Gui.NextPrompt(Intro.UruSexGetFuckedSuck);
		}, enabled : true,
		tooltip : "How about a taste?"
	});
	options.push({ nameStr : "Lead",
		func : function() {
			Intro.UruSexGetFuckedLead();
		}, enabled : true,
		tooltip : "Take the lead and ride her."
	});
	options.push({ nameStr : "Passive",
		func : function() {
			Intro.UruSexGetFuckedPassive();
		}, enabled : true,
		tooltip : "Submit to the powerful omnibus."
	});
	Gui.SetButtonsFromList(options);
}

// Intro.timesSuckedUru
Intro.UruSexGetFuckedSuck = function() {
	Text.Clear();

	if(Intro.timesSuckedUru == 0)
		Text.Add("<i>“Oh, probably a wise move to get me lubed up,”</i> she praises you. <i>“Then again, you were probably just hungry for cock, weren't you? Just don't forget about the main course.”</i>");
	else if(Intro.timesSuckedUru == 1)
		Text.Add("<i>“Mmm...”</i> the omnibus sighs contentedly. <i>“Just can't get enough, can you?”</i> Dutifully, you lap up the remains of her last ejaculation before getting down to business.");
	else {
		Text.Add("<i>“You know what is coming,”</i> the omnibus purrs. <i>“Perhaps your plan is to lube yourself up from the other direction, hm?");
		if(Intro.fuckedTarget == BodyPartType.vagina)
			Text.Add(" You <b>do</b> know those holes aren't connected, right?");
		Text.Add("”</i> Dutifully, you lap up the remains of her last ejaculation before getting down to business.");
	}
	Text.NL();

	Sex.Blowjob(player, uru);
	player.FuckOral(player.Mouth(), uru.FirstCock(), 2);
	uru.Fuck(uru.FirstCock(), 2);

	Text.Add("Taking your time, you lather Uru's demonic meatstick from root to crown in your saliva. Deciding that you want a taste before getting penetrated, you open your jaw as far as it'll go and put the head in your mouth. A single drop of pre-cum splatters onto your tongue, hot and sticky. After sucking and licking on it for a few minutes, coaxing even more pre out of the demonette's hot fuckstick, and spreading it out evenly, you give the tip one final lick before moving back.");
	Text.NL();
	Text.Add("Uru seems to have something else in mind, however, as a gentle, though firm, grip keeps your head in place. Confused, you look up at your demonic lover's face. <i>“No-no,”</i> she chides you, <i>“can't leave it unfinished.”</i> Your muffled protests fall on deaf ears as she slowly, but insistently, starts to push inside you, inch by inch, until she is bumping against the entrance to your throat.");
	Text.NL();
	Text.Add("Your eyes almost pop out of your face as the omnibus forcefully shoves her hips forward, stuffing her entire length down your throat in one smooth thrust. She pauses there, with your lips firmly pressed against her crotch. <i>“Don't worry,”</i> she moans as she starts to move in short, rapid thrusts, <i>“a-almost there!”</i>");
	Text.NL();
	Text.Add("True to her word, load after hot load soon gushes down your sore throat. Then, not a moment too soon, she pulls out, leaving you on your knees, gasping for air. <i>“Now, don't go cleaning it all up immediately,”</i> the omnibus tells you with a chuckle as you reflect on her coated rod, still rock hard, <i>“We would have to do it all over again. Although, maybe you'd like that?”</i>");
	Text.NL();

	// Set flags
	Intro.timesSuckedUru++;
	Intro.lubedFlag = true;

	//[Suck her (again)][Lead][Passive]
	var options = new Array();

	if(Intro.timesSuckedUru >= 3) {
		Text.Add("A bit overwhelmed by the sheer cum production of the hermaphrodite demon, you worriedly caress your swelling stomach. Perhaps enough is enough.");
	}
	else { // Disable this option after 3 times total
		options.push({ nameStr : "Again",
			func : function() {
				Text.NL();
				Text.Add("Well... once more couldn't hurt.");
				Text.Flush();
				Gui.NextPrompt(Intro.UruSexGetFuckedSuck);
			}, enabled : true,
			tooltip : (Intro.timesSuckedUru < 2) ? "Mm... more!" : "You <i>need</i> her cum!"
		});
	}

	options.push({ nameStr : "Lead",
		func : function() {
			Intro.UruSexGetFuckedLead();
		}, enabled : true,
		tooltip : "Take the lead and ride her."
	});
	options.push({ nameStr : "Passive",
		func : function() {
			Intro.UruSexGetFuckedPassive();
		}, enabled : true,
		tooltip : "Submit to the powerful omnibus."
	});
	Gui.SetButtonsFromList(options);
	Text.Flush();
}

Intro.UruSexGetFuckedLead = function() {
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);

	Text.Clear();

	var uruCockDesc = function() { return uru.FirstCock().Short(); }
	if(Intro.fuckedTarget == BodyPartType.vagina)
		parse["target"] = function() { return player.FirstVag().Short(); }
	else
		parse["target"] = function() { return player.Butt().AnalShort(); }

	Text.Add("You shake your head slightly. The demon has been taking charge far too much; it's time to turn this around! Determined, you get back on your feet and push the surprised omnibus back. She lands, ass first, on the throne, cock bouncing up and down excitedly. <i>“Why, [playername]!”</i> she exclaims, delighted. <i>“Getting really forward, aren't w-”</i>", parse);
	Text.NL();
	Text.Add("You cut her off with a deep kiss as you straddle her hips, her perky " + uruCockDesc() + " rubbing against your soft undercarriage. Positioning yourself so that her cock is pointing straight at your [target], you sigh with euphoria as you ease yourself down, relishing in the feeling of the omnibus entering you.", parse);

	if(Intro.fuckedTarget == BodyPartType.ass) {
		Sex.Anal(uru, player);
		player.FuckAnal(player.Butt(), uru.FirstCock(), 5);
		uru.Fuck(uru.FirstCock(), 5);
	}
	else {
		Sex.Vaginal(uru, player);
		player.FuckVag(player.FirstVag(), uru.FirstCock(), 5);
		uru.Fuck(uru.FirstCock(), 5);
	}
	Text.NL();

	if(!Intro.lubedFlag) {
		if(Intro.fuckedTarget == BodyPartType.ass)
			Text.Add("It isn't long before you are unable to go any further, though. Barely the tip has penetrated, but it is simply too painful to force any more inside. Sensing your predicament, your demonic lover begins to slowly rock her hips, indicating for you to bear with her for a while. In a few slight thrusts, accompanied by increasingly fervent moans from the omnibus, you feel your [target] relaxing. An unnatural heat spreads from the immense pillar lodged in your behind, and you can feel large globs of sticky fluids being deposited inside your [target]. It seems the demon can make her own lube at will!", parse);
		else
			Text.Add("The going is pretty rough, but your own juices quickly coat Uru's " + uruCockDesc() + ", quickly turning the burning feeling in your loins from pain to pleasure.");
		Text.NL();
	}

	Text.Add("Spreading your legs a bit, you slowly relax, letting gravity do the work for you. You slide down a few inches until you meet resistance again. Giving it a last push, you manage to fit another half of an inch before rising off of her so only the tip remains inside. Repeating the process, you slowly work your way downward, inch by inch. Deciding to give you a hand, Uru plants her hands on your [butt], adding a bit of extra pressure on the descent.", parse);
	Text.NL();
	Text.Add("With the extra hands keeping you stable, you are free to pleasure your other assets.");
	Text.NL();

	if(player.FirstCock()) {
		Text.Add("Reaching between your legs, you give your [cock] a tug, forming a cocksleeve with the palm of your hand. You time your strokes to match your rise and fall on the demonette's " + uruCockDesc() + ", doubling the intensity of your pleasure.", parse);
	}
	else {
		Text.Add("Reaching up to fondle your [breasts], you gently cup one of the orbs. You alternate between massaging the breast and teasing the sensitive nipple, pinching and pulling it.", parse);
	}

	Text.NL();
	Text.Add("You pick up the pace, forcefully impaling your [target] on Uru's " + uruCockDesc() + ", moaning as your hips connect. Every inch of your internal passage is thoroughly filled with hot, demonic cock, the veined appendage pushing all your buttons.", parse);
	Text.NL();

	if(player.FirstCock())
		Text.Add("Gasping, you finally can't take any more, and unload your [cock] on the hermaphrodite's stomach, covering her red skin with strands of pearly white.", parse);
	else
		Text.Add("Slamming down to the hilt, your legs give away as you are left quivering, riding out the wave of your orgasm.");

	Text.NL();
	Text.Add("The omnibus gently caresses your sensitive skin while you regain your strength. <i>“Not bad, lover,”</i> she purrs contentedly, <i>“Ready for round two?”</i> Before you can mouth an exhausted protest, she lifts your [butt] a few inches, before letting gravity impale you yet again. She starts a fast-paced rhythm, roughly pumping your abused [target], pulling your tired body closer to your next climax.", parse);
	Text.NL();
	Text.Add("Before long, the omnibus cries out in pleasure, hosing a veritable river of hot sperm into you. ");
	if(Intro.timesSuckedUru >= 3)
		Text.Add("You look down at your swelling stomach incredulously; when added to your previous sticky meals, you look eight months pregnant, and you are still growing larger!");
	else
		Text.Add("Your stomach begins to swell with the sheer amount of white goo being stuffed into you, making you look slightly pregnant.");
	Text.Flush();
	Gui.NextPrompt(Intro.UruSexGetFuckedLead2);
}

Intro.UruSexGetFuckedLead2 = function() {
	var uruCockDesc = function() { return uru.FirstCock().Short(); }
	var targetDesc;
	if(Intro.fuckedTarget == BodyPartType.vagina)
		targetDesc = function() { return player.FirstVag().Short(); }
	else
		targetDesc = function() { return player.Butt().AnalShort(); }

	Text.Clear();

	Text.Add("Uru is not finished yet, however, and continues to ram her hard " + uruCockDesc() + " into your abused " + targetDesc() + " with undiminished vigor. Surfing from one orgasm to the next, you lose track of time, and almost faint.");
	Text.NL();
	Text.Add("Dimly, you feel your strength fading, going far beyond mere fatigue. The combined feeling of the highest peak of pleasure you have ever reached, contrasted against the simultaneous sense of dying, shakes your mind back into gear as you realize that something is horribly wrong.");
	Text.NL();
	Text.Add("With the last vestige of your strength, you manage to disentangle yourself from the horny demon and fall to the ground, leaking sexual fluids everywhere.");
	Text.Flush();
	Gui.NextPrompt(Intro.UruSexAftermath);
}

// Entry from willing passive fuck (choice)
Intro.UruSexGetFuckedPassive = function() {
	Text.NL();

	Text.Add("Faced with the towering manhood, you grow unsure, was this really what you wanted? The omnibus notices your distress and reaches down to fondly caress your [hair]. <i>“Don't worry, pet. Just leave everything to me,”</i> she murmurs reassuringly. She imperiously instructs you to turn around on all fours and rest your torso on the seat of the obsidian throne. You meekly comply, very nervous for what is to come, but also incredibly turned on.", {hair: player.Hair().Short()});
	Text.Flush();
	Gui.NextPrompt(Intro.UruSexGetFuckedPassive2);
}

// Get fucked from fuck scenes jump in here
Intro.UruSexGetFuckedPassive2 = function() {
	var parse = {

	};
	parse = player.ParserTags(parse);

	// If target is not already set, set it to ass for males and vagina for females
	Intro.fuckedTarget = Intro.fuckedTarget || ((player.Gender() == Gender.male) ? BodyPartType.ass : BodyPartType.vagina);

	var uruCockDesc = function() { return uru.FirstCock().Short(); }
	var targetDesc;
	var notTargetDesc;
	var target;
	if(Intro.fuckedTarget == BodyPartType.vagina) {
		target = player.FirstVag();
		targetDesc = function() { return player.FirstVag().Short(); }
		notTargetDesc = function() { return player.Butt().AnalShort(); }
	}
	else {
		target = player.Butt();
		targetDesc = function() { return player.Butt().AnalShort(); }
		if(player.Gender() == Gender.female)
			notTargetDesc = function() { return player.FirstVag().Short(); }
	}

	Text.Clear();

	Text.Add("Uru trails a single finger across your back, circling closer to your crotch and waiting " + targetDesc() + ".");

	if(target.virgin)
		Text.Add(" <i>“Looks nice and tight, at least for now,”</i> she purrs, <i>“nothing like a virgin hole to get my blood racing!”</i>");

	Text.NL();

	if(!Intro.lubedFlag) {
		Text.Add("<i>“Not to crush your expectations, but I'd better lube you up first,”</i> the omnibus mentions with a chuckle, <i>“I plan to go aaall the way with you!”</i> Giving you no chance to protest, she leans down and plants a kiss on your [butt]. ", parse);
		if(player.FirstCock())
			Text.Add("Leaning down further, she gives your [cock] a long lick from tip to root, before moving to your " + targetDesc() + ".", parse);
		else
			Text.Add("Leaning down further, she gives your " + notTargetDesc() + " a perfunctory lick before moving to your " + targetDesc() + ".");

		Text.NL();
		Text.Add("You gasp helplessly as she buries her hot tongue deep inside your  " + targetDesc() + ", slathering the tight passage in slick, demonic saliva. It feels like the appendage is growing in length and girth, slowly getting you used to the size and lubing you up, deeper and deeper. You shudder in pleasure, thinking of how much bigger her actual dick is, and how it will feel to be fucked by her.");
		Text.NL();
		Text.Add("Her prolonged ");
		if(Intro.fuckedTarget == BodyPartType.ass)
			Text.Add("rimming");
		else
			Text.Add("cunnilingus");
		Text.Add(" is almost enough to make you orgasm right then and there, but, to your displeasure, she suddenly withdraws. Stifling your protests with a sharp slap on your [butt], the amused omnibus announces that you are ready for the main course.", parse);
		Text.NL();
		Text.Add("Somehow, you don't feel ready.");
	}
	else {
		Text.Add("The omnibus gives your [butt] a playful swat and spreads your cheeks, exposing your eager " + targetDesc() + ". <i>“Since you are all prepared, why don't we skip to the good part right away?”</i> she purrs.", parse);
	}

	Text.NL();
	Text.Add("You moan like a slut as she rubs her glans against your sloppy opening, begging for her to fuck you. Humming softly, the hermaphrodite continues to tease you for a bit, almost driving you crazy with need. <i>“Don't worry, I'll take gooood care of you,”</i> she tells you as she lines her " + uruCockDesc() + " up against your helpless " + targetDesc() + ", planting her feet wider for balance.");
	Text.NL();
	Text.Add("She rocks her hips forward, painfully stretching your tight passage as the broad head makes its entry. In a moment of panic at her sheer girth, you scramble forward, but there is nowhere to go; you are squeezed between the hard stone of the obsidian throne and the hard throbbing member now buried deep in your " + targetDesc() + ". ");
	Text.NL();

	if(Intro.fuckedTarget == BodyPartType.vagina) {
		Sex.Vaginal(uru, player);
		player.FuckVag(player.FirstVag(), uru.FirstCock(), 5);
		uru.Fuck(uru.FirstCock(), 5);
	}
	else {
		Sex.Anal(uru, player);
		player.FuckAnal(player.Butt(), uru.FirstCock(), 5);
		uru.Fuck(uru.FirstCock(), 5);
	}

	Text.Add("Hardly giving you any chance to adjust, Uru begins thrusting rapidly, eliciting sweet moans from you as each thrust explores deeper and deeper, rubbing against previously untouched areas of your nethers. Inch by inch, the omnibus impales you on her rock hard fuckstick. Even as filled up as you feel, you dimly realize that she isn't even halfway inside, yet. You grit your teeth, riding waves of pain while seeking that elusive sense of pleasure, just outside your reach.");
	Text.NL();

	if(Intro.fuckedTarget == BodyPartType.vagina)
		Text.Add("<i>“Mmm... should I fuck you pregnant? Keep you around as a breeding sow for my tainted seed?”</i> the omnibus moans. You are too far gone to realize that she probably isn't joking about her intentions.");
	else
		Text.Add("<i>“Oooh, such a tight hole, a perfect fit for me,”</i> the omnibus compliments on your butt as she rails you, <i>“Granted, not for long, now.”</i> She drives her point - and her cock - home with a particularly deep thrust of her hips.");
	Text.NL();
	Text.Add("As the demonette explores deeper and deeper within you, waves of pleasure well up, rising and falling like a tide with the tip of her cock directing their flow. You completely lose track of time, your world shrinking to the sensory input of her pumping rod. At some point, you probably cum, but you can't tell exactly when.");
	Text.NL();
	Text.Add("After an excruciatingly long time, Uru finally rests her hips against your [butt]. By this point, you are reduced to a panting and moaning mess, riding the edge of your last orgasm. The demon rests a while, enjoying her dominance over you. <i>“You'll be a good slut for me from now on, won't you?”</i> she purrs, accentuating her question by slowly rocking her hips, grinding against your deepest reaches", parse);
	if(Intro.fuckedTarget == BodyPartType.vagina)
		Text.Add(", the tip of her cock rubbing and teasing the entrance to your womb.");
	else
		Text.Add(".");
	Text.NL();
	Text.Add("Hardly able to form coherent sentences, you moan something close to <i>“Yes, please, fuck me, now! Fuck me HARD!”</i> The hermaphrodite seems to get the gist of it, as she pulls until only the tip of her cock is inside you, leaving you with a heavy feeling of emptiness. The feeling quickly disappears, however, as she drives her girthy cock home in one thrust, forcing you into another orgasm.");
	Text.NL();
	Text.Add("Your mind goes blank from the rhythmic thrusting, her member rubbing against every spot and crevice inside your passage, including a few you didn't even know were there. Before long, the pole buried inside you starts to throb erratically, globs of hot pre-cum announcing Uru's pending climax. Hardly missing a beat, the omnibus increases the pace of her humping, crying out in pleasure as she releases a veritable river of spunk inside your depths.");
	Text.NL();
	Text.Add("The hot fluid painting your insides white is enough to push you over the edge, once again. As your battered mind returns to reality, you dimly realize two things: the sheer amount of semen is distending your stomach, though the torrent seems to, thankfully, be dissipating. That is less than what you could say for Uru, though, as the omnibus shows no signs of stopping, already entering her second wind.");
	Text.NL();
	Text.Add("Over what must be the better part of an hour, the omnibus continues her relentless railing of your " + targetDesc() + ". You both cum several times, your own juices dripping down your legs and splattering against the obsidian stone. Meanwhile, your belly has swollen to an unbelievable size");
	if(Intro.fuckedTarget == BodyPartType.ass)
		Text.Add(", to the point that you can taste the demon's semen.");
	else
		Text.Add(".");
	Text.NL();
	Text.Add("As you ride the roller coaster of pain and pleasure, you alternate between begging her to stop and begging for more. The demon only answers by slapping your [butt] and by fucking you even harder. During some point in the exchange of fluids, Uru has flipped you on your back, railing your mewling form relentlessly.", parse);
	Text.NL();

	if(player.FirstCock()) {
		Text.Add("You can only moan helplessly as her thrusts bring you to another orgasm, this time depositing your load all over your chest and face.");
		Text.NL();
	}

	Text.Add("Finally, it seems like the onslaught is coming to an end. After unleashing her last load into your bulging form, more than half of it splattering out uselessly around her " + uruCockDesc() + ", Uru grinds to a halt. You breathe a ragged sigh of relief, slowly recovering from the prolonged pounding. Right now, you would like nothing more than to just go to sleep.");
	Text.NL();
	Text.Add("Dimly, you shrug yourself back into consciousness, an odd feeling permeating your nether regions. Looking up, you see Uru with her eyes closed, rocking back and forth and moaning softly. Her " + uruCockDesc() + " is still firmly lodged to the hilt in your overstuffed " + targetDesc() + ", but something feels different. Alarmed, you can feel your energy draining from you, leaving you more than exhausted.");
	Text.NL();
	Text.Add("With a desperate burst of willpower you didn't know you possessed, you plant your feet on the omnibus' chest and push her back with all of your might. Struggling and flailing, your movements slow and sluggish, you try to crawl away, only to flop to the ground exhausted. Gallons of demon seed seeps from your abused " + targetDesc() + ".");
	Text.NL();
	Text.Add("Uru, a bit surprised at first, regains her composure and gaily strides over to you, fully reinvigorated.");
	Text.Flush();

	Gui.NextPrompt(Intro.UruSexAftermath);
}

Intro.UruSexDenied = function() {
	Text.Clear();

	Text.Add("You give your head a forceful shake; this is not the time, nor the place, for sex. You need to keep your wits about you, and you don't quite trust the omnibus. A wise move, it turns out.");
	Text.NL();
	Text.Add("<i>“No?”</i> she asks, looking crestfallen, her lips pursing in a sullen pout, <i>“Why not? I just wanna have some fun, it'll feel good, I promise!”</i> The horny hermaphrodite advances on you, lustfully rubbing her exposed breasts against you. You move to back off, but find yourself somehow trapped with your back against the rough stone of the obsidian throne. <i>“Just one kiss,”</i> she breathes in your ear huskily, quickly moving in to claim her prize.");
	Text.NL();
	Text.Add("The two of you lock lips for an eternal moment and you almost lose yourself in her warm embrace. You quickly find that the demoness is a great kisser, making full use of her velvety tongue and eagerly exploring every part of your mouth. You stumble a bit, you suddenly feeling weak at the knees. Alarmed, you realize that energy is rapidly being drained from your body. Somehow wrenching free, you fall to the ground, panting from the brief encounter.");
	Text.Flush();
	Gui.NextPrompt(Intro.UruSexAftermath);
}

Intro.UruSexAftermath = function() {
	var parse = {

	};
	parse = player.ParserTags(parse);

	Text.Clear();

	// Soul-sucking is tiring
	player.curSp.base = 0;

	Text.Add("<i>“Aww... and things were just starting to get fun,”</i> Uru complains as she stands above your fallen form. She trails one of her sharp nails - colored black, you idly note - down your stomach and toward your exposed crotch. <i>“There is sooo much you will tell me,”</i> she purrs, <i>“Why not start with how you got here, again? </i>");
	if(uru.flags["Intro"] & Uru.IntroFlags.ToldUruAboutMirror)
		Text.Add("<i>That mirror you talked about... where did you find it, exactly?”</i>");
	else
		Text.Add("<i>See, I'm not quite buying your original story, and I told you it was impolite to lie to me!”</i>");
	Text.NL();
	Text.Add("Cursing your lack of caution, you realize that the omnibus is far sharper than you thought at first. She has been toying with you the whole time! Chuckling, she cups your chin in one hand and fondles your cheek absentmindedly. <i>“Playing around with you for a bit was fun, but I have to investigate something. But before I go...”</i> You try to scurry away from her, but she merely smiles and crooks a clawed finger. Like being picked up by an invisible hand, you are hoisted into the air, floating about a foot above the ground, helpless.");
	Text.NL();
	Text.Add("<i>“H-how are you doing this?”</i> you gasp.");
	Text.NL();
	Text.Add("She studies you for a while, then simply wiggles her fingers at you. <i>“Magic,”</i> she tells you with a grin. Uru crosses her arms over her expansive bust and paces in a circle around your struggling form. Apparently coming to a decision, she gives your [butt] a sharp slap, leaving a stinging hand print. The feeling quickly fades, replaced with... something else.", parse);
	Text.NL();
	Text.Add("You moan as a long, thin tail sprouts from your quivering behind, snaking around wildly before you gain control of your new appendage. Forgetting yourself, you take a moment to study it, noting the dark reddish color and the spaded tip. Even suspended in the air as you are, the thing almost reaches the ground. Touching it sends shivers up your, now extended, spine.");

	TF.SetAppendage(player.Back(), AppendageType.tail, Race.Demon, Color.red);

	Text.NL();
	Text.Add("Snapping back to reality, you flinch as the omnibus looms over you, but her attention is not directed at you. The growth of your tail apparently dislodged the purple gem you were carrying from your shredded clothes. The stone now lies on the ground, emanating a dull glow.");
	Text.NL();
	Text.Add("With a curious look on her face, Uru bends down and picks up the jewel. For a moment, a look of wonderment crosses her face, illuminated by the glowing stone, though it's quickly replaced by one of triumph. Forgotten, you drop to the ground as the forces suspending you dissipate. <i>“R-really? It can be done <b>that</b> way, too?”</i> the demon wonders out loud, her thoughts far away and her eyes lost in the swirling mist deep inside the gem.");
	Text.NL();
	Text.Add("Before you have a chance to escape - not that there is anywhere to escape <i>to</i> - the omnibus rounds on you with a happy grin on her face. <i>“Do you know what this is?”</i> she asks, hopping around in a little excited dance, <i>“This is my key out of here!”</i>");
	Text.NL();
	parse["Int"] = (player.intelligence.growth > 1) ? ", your newfound smarts notwithstanding" : "";
	Text.Add("She goes on to excitedly explain, at length, how manipulating the ethereal winds <i>just so</i>, combined with the right place and time, would enable gates to other realms to be opened. <i>“And it was all hidden in this key right here!”</i> she exults. <i>“Whoever made this was a genius!”</i> Bewildered, you are once again forced to re-evaluate the fickle demon. She acts like an airhead, unable to keep her thoughts on any one thing for an extended period of time, but you could hardly follow anything of what she just said[Int].", parse);
	Text.NL();
	Text.Add("<i>“You know... maybe I should reward you for this,”</i> she muses to herself. You instinctively jerk back, not sure if you want any more 'gifts' from the demon. <i>“Oh tut, don't be like that,”</i> she chides. <i>“With some work, you could be someone with power. You've got good foundation; you've survived here this long, after all.”</i> Confused as to what she is talking about, you consider her offer.");
	Text.NL();
	Text.Add("<i>“And what if I refuse?”</i> you guardedly answer.");
	Text.NL();
	Text.Add("In the span of a second Uru's expression shifts from incredulous to angry, before settling on a smug grin. <i>“Refusing will do you no good, of course, but if you want some incentive...”</i> she pouts and sucks on one of her fingers seductively. <i>“How about... I <b>don't</b> use this key to return where you came from and burn it to the ground?”</i>");
	Text.Flush();
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("Before you have a chance to stammer a reply, a bright flash of light surges from the clear skies, focusing into a beam shining squarely on the gem in Uru's hand. Letting out a pained yelp, the omnibus drops the stone to the ground, dancing away from the light.");
		Text.NL();
		Text.Add("<i>Quickly! Grab the key!</i> a feminine voice rings inside your head, and suddenly your limbs fill with strength.");
		Text.NL();
		Text.Add("Unthinking, you throw yourself forward, snatching up the blazing jewel and coming up in a crouch. Whatever hurt the demon seemingly has no effect on you. The enraged omnibus moves as if to pounce on you, but she hesitates. Apparently, she is unable or unwilling to enter the radiant pillar of light surrounding you. <i>“That bitch! So that is how it's going to be...”</i> she states, her voice sounding muted, as if she is speaking from a great distance, <i>“No matter, it's only a question of time before I can finally leave this place, all thanks to you.”</i> Her features are a combination of malice and triumph, <i>“My offer to join me still stands... and so does my threat, should you fail to take it.”</i>");
		Text.NL();
		Text.Add("Sight and sound abandon you as you are enveloped in a blinding light. You get one last glimpse of the landscape wreathed in fire and smoke, and the smoldering orange eyes of the smiling demon, before everything fades away.");
		Text.NL();
		Text.NL();
		Text.Add("Time...");
		Text.NL();
		Text.NL();
		Text.Add("Does time pass?");
		Text.NL();
		Text.NL();
		Text.Add("Does time even have meaning in this place?");
		Text.Flush();
		Gui.NextPrompt(Intro.LightAspectDesc);
	});
}

world.loc.LightAspect = {
	Garden : new Event("Garden")
}

Intro.LightAspectDesc = function() {
	party.location = world.loc.LightAspect.Garden;
	Text.Clear();

	Text.Add("Bit by bit, you return to your senses, roused by the sound of running water and... bird song? Drowsy and confused, you try to orient yourself. Gone is the smoldering, burning wasteland and its perpetually stormy skies, replaced by a calm garden filled with flowers. You are resting on a soft bed of grass, your bruised body cushioned by the fertile loam. High above, in the clear blue skies, peculiar birds fly around, chirping and tweeting their beautiful song.");
	Text.NL();
	Text.Add("A light glow radiates from everything around you, giving the lush garden a very eerie atmosphere. Unthinking, you begin to rise, touching your small pointed horns and give your demonic tail a glance, uncomfortably aware of how out of place they are in this serene place. The purple gemstone you took from the attic lies on the ground where you awoke, though it is no longer glowing. You bend down and pick up the jewel, wincing as the motion stretches a few sore muscles.");
	if(Intro.fuckedTarget)
		Text.Add(" Thankfully, though, you seem to somehow have lost a few gallons of creamy demonic stuffing, making it considerably easier to move around.");
	Text.NL();
	Text.Add("<i>Come to me, there is not much time left...</i>");
	Text.NL();
	Text.Add("Your head snaps up as the feminine voice speaks. As before, the beautiful voice seems to emanate from everywhere at once. You do not see any sign of the speaker anywhere.");

	Intro.TalkedToBird = false;
	Text.Flush();
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.LightAspect.Garden);
	});
}







// Create namespace
world.loc.LightAspect = {
	Garden   : new Event("Garden"),
	Temple   : new Event("Temple")
}

//
// Light aspect dimension
//
world.SaveSpots["LightAspect"] = world.loc.LightAspect.Garden;
world.loc.LightAspect.Garden.SaveSpot = "LightAspect";
world.loc.LightAspect.Garden.safe = function() { return true; };
world.loc.LightAspect.Garden.description = function() {
	Text.Add("You are standing in a lush garden filled with flowers of all shapes and colors. A small stream runs nearby, its musical babbling accompanied by distant birdsong.");
	Text.NL();

	Intro.active = true;
}

world.loc.LightAspect.Garden.events.push(new Link(
	"Bird", function() { return !Intro.TalkedToBird; }, true,
	function() {
		if(!Intro.TalkedToBird)
			Text.Add(" A quick survey of the immediate area confirms that no one is nearby, except for an unusual, though innocent-looking, bird.");
	},
	function() {
		Text.Clear();

		Text.Add("You examine the strange bird wading in a nearby shallow pond. Looking closer at it you realize that it's of a species you have never seen before; a ball of fluffy blue feathers on long graceful legs, the head on its long, thin neck topped by a bright orange plume. In height, it just about reaches your knees.");
		Text.NL();
		Text.Add("You skeptically eye the creature, attracting its attention. For a while the two of you silently observe each other. Feeling slightly awkward, you quip: <i>“I don't suppose it was you who spoke just now?”</i>");
		Text.NL();
		Text.Add("The bird throws a glance toward the marble building, then turns back to you. Tilting its head slightly to the side, it gravely proclaims in a musical voice, <i>“No.”</i> You are left with a bewildered expression as the bird takes to the air and flies off.");
		Text.NL();
		Text.Add("What the heck is going on with this place?");

		Intro.TalkedToBird = true;
		Text.Flush();
		Gui.NextPrompt(PrintDefaultOptions);
	}
));

world.loc.LightAspect.Garden.links.push(new Link(
	"Temple", true, true,
	function() {
		Text.Add(" Atop a nearby hill stands some kind of large structure, constructed from blocks of white marble and overgrown with blossoming vegetation. It looks like it could be some kind of old temple, long since abandoned. A tidy pathway leads toward it, lined with bright, man-made lanterns.");
		Text.NL();
	},
	function() {
		Text.Clear();

		Text.Add("With nowhere else to go, you head down the path leading to the temple-like structure on the hill. As you get closer, you realize that the temple seems to be in surprisingly good shape. Under the overgrowth that has claimed it, the marble is smooth and untouched. In fact, as you get closer to the building, it dawns on you that the vegetation is - rather than being an effect of long disuse - actually a part of the temple itself. Blossoming vines twine artfully around marble pillars, seemingly springing from the stone.");
		Text.NL();
		Text.Add("<i>Please, come inside, we have much to talk about.</i>");
		Text.NL();
		Text.Add("Steeling yourself for whatever awaits, you step inside the temple into an open courtyard. You have little time to survey your surroundings before your eyes fall on the source of the voice, a woman who could only be described as a Goddess.");

		party.location = world.loc.LightAspect.Temple;
		Text.Flush();
		Gui.NextPrompt(function () {
			Text.Clear();
			Text.Say("assets/img/aria.png", "", "left");

			Text.Add("There is no doubt in your mind that she is indeed a Goddess; the heartachingly beautiful woman before you stands by a fountain, a worried expression on her perfect face. She is clad in a long white dress that seems to almost float above the ground, as if it were underwater. The skin on her smooth limbs is fair and unblemished, and an expanse of golden locks falls to her waist in a mass of curls. She carries herself with regal composure and is well over six feet tall.");
			Text.NL();
			Text.Add("Her dress - while tastefully chaste - exposes part of her generous bosom. Realizing that you are ogling her, your eyes rise to study her face instead. Her eyes, rather than having regular pupils, are pools of shining light, partly obscured under thick lashes. As she speaks to you once more, her full red lips do not move.");
			Text.NL();
			Text.Add("<i>Welcome, young one.</i>");
			Text.NL();
			Text.Add("She gracefully slides toward you, moving with steps so light that it almost seems like she is floating through the air.");
			Text.NL();
			Text.Add("<i>I am Aria, the ruler of this realm. I know you must have many questions, but before that, I must remove the taint from you.</i>");
			Text.Flush();
			Gui.NextPrompt(Intro.AriaPurification);
		});
	}
));

Intro.AriaPurification = function() {
	Text.Clear();

	Text.Add("As she gently places her hand on your chest, you are shrouded in light suffusing your entire body. You feel the horns on your forehead painlessly recede. At the same time you feel your tail diminish and shrink back into your body.");

	// Remove tail/horns
	player.Appendages().pop();
	player.Back().pop();

	Text.NL();

	// Clitcock TODO
	var ccIdx = player.FirstClitCockIdx();
	if(ccIdx != -1) {
		Text.Add("<i>Uhm, what about... that?</i> Aria blushes as her gaze briefly flicker to your oversized, engorged clitoris.");
		Text.NL();

		//[Remove][Keep]
		var options = new Array();
		options.push({ nameStr : "Remove",
			func : function() {
				Text.Add("After a brief moment of hesitation, you nod. Her cheeks flushed, the Goddess trails her finger down the cleft between your breasts, before uncertainly giving your clit an experimental prod. Barely stifling a moan from the touch, a twinge of regret flits through you as the appendage is enveloped in a soft glow, shrinking down to its original size.");
				Text.NL();
				Text.Add("Aria gives her head a quick shake, clearing her thoughts.");
				var cocks = player.AllCocks();
				cocks[ccIdx].vag.clitCock = null;
				cocks.remove(ccIdx);
				Text.Flush();
				Gui.NextPrompt(Intro.AriaTalk);
			}, enabled : true,
			tooltip : "You don't know what got over you... of course you don't want to have a cock!"
		});
		options.push({ nameStr : "Keep",
			func : function() {
				Text.Add("You thoughtfully bite your lower lip, studying your erect girl-cock. Deciding that you rather like it the way it is, you shake your head at the Goddess, causing her to raise an eyebrow at you but letting it pass.");
				Text.NL();
				Text.Add("Aria gives her head a quick shake, clearing her thoughts.");
				Text.Flush();
				Gui.NextPrompt(Intro.AriaTalk);
			}, enabled : true,
			tooltip : "Actually... you could grow used to this. Having a cock isn't so bad."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Gui.NextPrompt(Intro.AriaTalk);
	}
	Text.Flush();
}


Intro.AriaTalk = function() {
	Text.Clear();

	Text.Add("The whole purification process was unexpectedly tiring, leaving you weak at the knees.");
	Text.NL();
	Text.Add("<i>Now then,</i> she gestures to a marble bench nearby. <i>Please allow me to answer your questions.</i> The two of you get seated. What do you want to ask the Goddess?");

	Intro.AriaTalkedAboutAria = false;
	Intro.AriaTalkedAboutUru = false;
	Intro.AriaTalkedAboutPortals = false;

	Intro.AriaQnA();
}

Intro.AriaQnA = function() {
	Text.Flush();
	// [Aria][Uru][Portals]([Bird])
	var options = new Array();
	if(!Intro.AriaTalkedAboutAria) {
		options.push({ nameStr : "Aria",
			func : function() {
				Text.Clear();

				Text.Add("<i>“You... I guess you saved me back there. How? Why? Who <b>are</b> you, exactly... are you a Goddess?”</i> you ask, feeling self-conscious.");
				Text.NL();
				Text.Add("<i>I am Aria. I am who I am.</i> The radiant woman gazes off into the distance. <i>Before, it was simpler... fewer worlds to care for, fewer people to protect. After seeing the widespread destruction, calamity after calamity sweeping across the planes... I had to act.</i> Aria sighs. <i>I am the one who protects against the taint, and tries to abate the tides of Darkness through the ages, but it grows hard, so hard. Sometimes, I feel old and powerless, as I watch another world fall...</i>");
				Text.NL();
				Text.Add("She falls silent. <i>“Old?”</i> you protest, surely she could not be older than twenty-five! She gives you a weak smile, suddenly looking vulnerable, perhaps even tired.");
				Text.NL();
				Text.Add("<i>Yes, it was I who saved you and brought you to this place, though, not entirely of my own power. As to why... I will get to that, but there is more to talk about. Suffice to say, I wish to ask a favor of you.</i>");
				Intro.AriaTalkedAboutAria = true;

				Intro.AriaQnA();
			}, enabled : true,
			tooltip : "Just who is Aria anyways?"
		});
	}
	if(!Intro.AriaTalkedAboutUru) {
		options.push({ nameStr : "Uru",
			func : function() {
				Text.Clear();

				Text.Add("<i>“That demon... who was she?”</i> As you ask, you realize that you want to know more about the tempting yet fickle hermaphrodite, but you cannot quite pinpoint the reason. Are you just interested because of the threat she represents, or do you have some other, darker motive?");
				Text.NL();
				Text.Add("<i>Uru,</i> the Goddess frowns, looking disconcerted. <i>Beware of that one, she is very, very dangerous. Unpredictable, chaotic and - as I am sure you noticed - very powerful. The plane she inhabits... that place was once a vibrant world, full of life. All reduced to ashes, by her hand and by those who serve her.</i>");
				Text.NL();
				Text.Add("<i>Thankfully, she is unable to make portals herself, leaving her effectively sealed in that place. Who knows what harm she could do, were she to break free...</i>");
				Text.NL();
				Text.Add("Uh-oh, that does not sound good.");

				Intro.AriaTalkedAboutUru = true;

				Intro.AriaQnA();
			}, enabled : true,
			tooltip : "You can't help wanting to know more about the omnibus from before, who is she?"
		});
	}
	if(!Intro.AriaTalkedAboutPortals) {
		options.push({ nameStr : "Portals",
			func : function() {
				Text.Clear();

				Text.Add("<i>“How did I get to that place? Last thing I remember is the old attic...”</i>");
				Text.NL();
				Text.Add("<i>Opening new portals for travel between the realms of existence, while not unheard of, is usually restricted to those very powerful. You, while having a surprising innate ability for it, had a bit of help, though.</i> She gestures to the jewel in your hand.");
				Text.NL();
				Text.Add("<i>“What is it exactly?”</i> you ask.");
				Text.NL();
				Text.Add("<i>What you are holding is a kind of key, specifically constructed to make opening portals to other realms easier.</i> Aria studies the gem carefully. <i>Seeing this is a bit nostalgic,</i> she admits, <i>I have not met its maker in a very long time. For a human, he was a strange one, old Alliser.</i>");
				Text.NL();
				Text.Add("The name sounds vaguely familiar to you, though you are far more interested in the stone itself. Now that she mentions it, the stone seems to have lost its glow, the mist inside barely moving.");
				Text.NL();
				Text.Add("<i>“Could it take me home?”</i> you ask hopefully, but Aria shakes her head sadly. <i>It seems to be almost out of power. It could probably only open a portal to a realm very close to this one.</i>");

				Intro.AriaTalkedAboutPortals = true;

				Intro.AriaQnA();
			}, enabled : true,
			tooltip : "This is clearly not your own world, how were you brought here exactly?"
		});
	}
	if(Intro.TalkedToBird) {
		options.push({ nameStr : "Bird",
			func : function() {
				Text.Clear();
				Text.Add("<i>“I met a talking bird outside,”</i> you comment.");
				Text.NL();
				Text.Add("Looking at you a bit amused, Aria replies coyly. <i>After all you have been through, you find talking birds strange?</i> Guess you can't argue with that.");

				Intro.TalkedToBird = false;
				Intro.AriaQnA();
			}, enabled : true,
			tooltip : "Talking birds. You gotta be kidding me."
		});
	}
	if(options.length > 0)
		Gui.SetButtonsFromList(options);
	else
		Gui.NextPrompt(Intro.AriaEnd);
}

Intro.AriaEnd = function() {
	Text.Clear();

	Text.Add("Putting two and two together, you recall Uru's last words to you. Worried, you explain that she may, indeed, have found a way to enter other realms, possibly through the power of the gem in your hand. For a moment, the Goddess falters. <i>In that case, time is even shorter than I thought. I must act quickly.</i>");
	Text.NL();
	Text.Add("Deep in thought, the Goddess strides back and forth. You attempt to get up from the bench, but find yourself too tired. Seems that the recent physical and mental hardships have finally caught up with you.");
	Text.NL();
	Text.Add("<i>Even if Uru is loose, there is really only one place that she can go without proper tools. To the center realm... to Eden.</i> She gazes at your exhausted form thoughtfully, weighing your worth. <i>Very soon, you will find yourself tested, and I find myself wondering what choices you will make.</i>");
	Text.NL();
	Text.Add("You struggle to reply, but something seems to have caught in your throat, a sharp pain spreading across your chest. Worried, Aria hurries over to you. <i>You cannot stay here much longer. Quickly, the gem.</i> Grabbing a hold of your wrist, she gently presses the purple jewel against your chest. <i>I have done all I can for you, but now you must return to the mortal realm. You are at your limit, staying here any longer will put your life in danger.</i>");
	Text.NL();
	Text.Add("<i>The jewel should have enough power to take you to Eden,</i> she assures you. <i>Once there, one of my servants will meet you.</i> As she speaks, a bright, shining light envelops you. Aria's face fades away until all that you can see is the white light.");
	Text.NL();
	Text.Add("You float, suspended in limbo. Slowly, the emptiness around you takes on color, the deep blue of an endless summer sky.");
	Text.NL();
	Text.Add("Far below you, the light takes on a slightly different hue, a fluffy mass of white. Surprised, you realize that you are looking at a bed of clouds. A tiny dark speck appears, growing larger as you come closer. You are moving incredibly fast, although, you do not feel any wind. Below you is a small patch of land with a single tree on it, floating in the middle of a white sea.");
	Text.NL();
	Text.Add("As you get closer, your sense of scale skews as miniature mountains, lakes, cities, and forests become visible. No, wait, not miniature - the landmass is actually huge, the great tree at its center gargantuan, its crown thousands of feet above the ground.");
	Text.NL();
	Text.Add("<i>Do not be afraid,</i> Aria whispers faintly. <i>Welcome to Eden.</i>");
	Text.NL();
	Text.Add("You have no chance to reply, nor even scream, as you close in on the ground and your vision goes black.");
	Text.Flush();
	Gui.NextPrompt(Intro.NomadsWakingUp);
}

Intro.NomadsWakingUp = function() {
	Text.Clear();

	player.RestFull();
	party.location = world.loc.Plains.Nomads.Tent;
	world.TimeStep({day: 1, hour: 3});

	Text.Add("You groan as you wake up, hoping that this is not going to become a recurring theme in your life. You are lying on your back atop a pile of soft pelts, in what looks to be a circular tent made from tough animal hides. A small slanted opening near the top, obviously designed to let light in while keeping rain out, illuminates the dim interior.");
	Text.NL();
	Text.Add("As you muse on how you escaped death this time, you become aware of a warm shape pressing against you. Someone quite slim and scantily clad is lying on top of you, their hands lovingly caressing your body. A glimpse of very large purple eyes and long pointed ears peeking out under a silky mass of silver hair confirms that, whoever your bed mate is, it is no regular human.");
	Text.NL();
	Text.Say("assets/img/kiakai.png", "", "left");
	Text.Add("The elfin creature starts to sensually suck on one of your nipples, spreading a tingling feeling through your entire body. Even so close, you are not quite sure if it is male or female, either due to the poor light or their very androgynous face. As your intimate visitor slowly grinds its crotch against one of your legs, their gender suddenly becomes <i>readily</i> apparent.");
	Text.Flush();
	// [Male][Female]
	var options = new Array();
	options.push({ nameStr : "Male",
		func : function() {
			kiakai.flags["InitialGender"] = Gender.male;
			kiakai.InitCharacter(Gender.male);
			Intro.MeetingKia();
		}, enabled : true,
		tooltip : "Is that a bulge in your pants?"
	});
	options.push({ nameStr : "Female",
		func : function() {
			kiakai.flags["InitialGender"] = Gender.female;
			kiakai.InitCharacter(Gender.female);
			Intro.MeetingKia();
		}, enabled : true,
		tooltip : "Well, it <i>looks</i> like a girl..."
	});
	Gui.SetButtonsFromList(options);
}

Intro.MeetingKia = function() {
	var parse = {
		name : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);

	Text.Clear();

	Text.Add("You gently dislodge yourself from the horny elf, pushing yourself into sitting position. Your chest is bare, but someone has managed to get you into a comfortable pair of pants. A better look at your bedmate confirms that ");
	if(kiakai.Gender() == Gender.female)
		Text.Add("she is indeed a she, the soft swell of her small breasts and her slightly widened hips both telltale signs. ");
	else
		Text.Add("he is indeed a he, his flat chest, slim figure and the slight bulge between his legs being telltale signs. ");
	Text.Add("[HeShe] is clad in a pale blue robe, ending a few inches above [hisher] bared knees.", parse);
	Text.NL();
	Text.Add("<i>“Ah, you are awake!”</i> the elf announces happily. Confronted with the question as to what exactly [heshe] was doing in your beddings, and where your beddings <i>are</i> for that matter, the elf blushes slightly. <i>“L-let us not get hasty, here. I know it might look bad, but really, I am just trying to help.”</i> [HeShe] looks a bit distraught.", parse);
	Text.NL();
	Text.Add("<i>“My name is [name], and I serve Lady Aria,”</i> the slender elf tells you. <i>“I have been nursing you here since your arrival to Eden, about a day ago.”</i> You quietly consider the elf before you. [name] seems to be very somber and serious, far beyond what you would expect from someone looking as young as [himher]. You give your own name, a large number of questions already crowding in your mind.", parse);

	Intro.KiaTalkedAboutAria = false;
	Intro.KiaTalkedAboutEden = false;
	Intro.KiaTalkedAboutSelf = false;
	Intro.KiaTalkedAboutHealing = false;

	Intro.KiaQnA();
}

Intro.KiaQnA = function() {
	var parse = {
		name : kiakai.name,
		boygirl : kiakai.mfTrue("boy", "girl")
	};
	parse = kiakai.ParserPronouns(parse);

	Text.Flush();
	// [Aria][Eden][Kia/Kai]["Healing"]
	var options = new Array();
	if(!Intro.KiaTalkedAboutAria) {
		options.push({ nameStr : "Aria",
			func : function() {
				Text.Clear();

				Text.Add("<i>“The Lady informed me of your arrival, and told me to assist you,”</i> [name] tells you. <i>“She is the Light that wards against the Dark, and a great darkness is approaching. You have been granted a great task by her, the outcome of which may decide the fate of this entire realm.”</i>", parse);
				Text.NL();
				Text.Add("What is this [boygirl] talking about? <i>“As I understand it, you have already met the dark one,”</i> [name] states with a shudder. <i>“It is a blessing you survived that encounter.”</i> [HisHer] expression is grim as [heshe] looks at you.", parse);
				Text.NL();
				Text.Add("<i>“Uru seeks total conquest of all the planes, and if she manages to reach Eden, that goal will be within her reach. You have seen the destruction the demon brings, she must be stopped before it is too late. We have no time to waste.”</i>");
				Intro.KiaTalkedAboutAria = true;

				Intro.KiaQnA();
			}, enabled : true,
			tooltip : "Ok, just what is the deal with Aria?"
		});
	}
	if(!Intro.KiaTalkedAboutEden) {
		options.push({ nameStr : "Eden",
			func : function() {
				Text.Clear();

				Text.Add("You ask how it is exactly that you came to this place, and where it is. [HeShe] mentioned Eden? [name] looks surprised.", parse);
				Text.NL();
				Text.Add("<i>“The Lady must not have had much time to tell you about this place,”</i> [heshe] muses, settling down on the bedding next to you. <i>“Very well, I will tell you.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Though I do not know where you came from originally, you have passed through at least two different planes of existence on your way here. The first was the burning wasteland that is Uru's domain. Thankfully, my Lady saved you from that place before you could succumb to the demons.”</i> The elf seems very uncomfortable talking about what [heshe] clearly thinks is a place of great evil.", parse);
				Text.NL();
				Text.Add("<i>“My Lady Aria then brought you into her own realm. Ah, it was long since I saw the sacred gardens last, too long...”</i> [name] seems to space out for a bit, focusing when you urge [himher] to continue. <i>“You might have noticed that you were losing strength the longer you spent in either of those realms. They are too... spiritual, I guess the word is. Ordinary humans seem to have a hard time surviving there for so long.”</i> [HeShe] thoughtfully considers you. <i>“That you were able to do so for such a long time indicates an unusually strong affinity for traversing the planes. I believe this was why the Lady chose you.”</i>", parse);
				Text.NL();
				Text.Add("<i>“To answer your question, you are in the realm of Eden, suspended in an endless sea of clouds. The barriers between the planes of existence are quite thin here, so you could see it as something of a hub, where it is possible for portals to other realms to be opened. Usually, the ability to open such a portal is reserved to beings of great power, unless...”</i> [HeShe] pauses and tentatively takes your hand, guiding it to rest on the gemstone in your pocket.", parse);
				Text.NL();
				Text.Add("<i>“Unless they have access to a key.”</i>");

				Intro.KiaTalkedAboutEden = true;

				Intro.KiaQnA();
			}, enabled : true,
			tooltip : "What is this place?"
		});
	}
	if(!Intro.KiaTalkedAboutSelf) {
		options.push({ nameStr : kiakai.name,
			func : function() {
				Text.Clear();
				parse["title"] = kiakai.mfTrue("priest", "priestess");
				Text.Add("<i>“I have been in the service of Lady Aria for some thirty years now. I am honored to be a member of her priesthood.”</i>");
				Text.NL();
				Text.Add("Hold on. Thirty years? The slender elf hardly looks more than eighteen.");
				Text.NL();
				Text.Add("<i>“As you can see, I am of elfin descent,”</i> [name] concedes, touching one of [hisher] pointed ears. <i>“We tend to age slower than humans do. Even though I may not look that old to you, I have experienced just short of fifty winters.”</i>", parse);
				Text.NL();
				Text.Add("<i>“My Lady instructed me to help you out in your quest in any way I could,”</i> [name] assures you. <i>“Let us get along as fellow servants of our Lady!”</i> You look at the sincere [title] dubiously. It seems like [heshe] has already decided on how this relationship is going to work out.", parse);

				Intro.KiaTalkedAboutSelf = true;

				Intro.KiaQnA();
			}, enabled : true,
			tooltip : Text.Parse("How about prodding the elf to reveal a bit more about [himher]self?", {himher : kiakai.himher()})
		});
	}
	if(!Intro.KiaTalkedAboutHealing) {
		options.push({ nameStr : "'Healing'",
			func : function() {
				Text.Clear();

				Text.Add("You ask how what [heshe] was doing was in any way a form of healing. The elf looks indignant, but at least has the shame to blush a bit.", parse);
				Text.NL();
				Text.Add("<i>“I-I'll have you know that it is a sacred form of healing only taught to a select few within the temple,”</i> [heshe] blurts out, fidgeting uncomfortably as you raise an eyebrow skeptically. <i>“The Lady may have healed your spirit and cleansed you of corruption before sending you here, but your body was at the brink of death when I found you. I have had to use everything I know about healing in order to bring you back, even stooping to acts you may consider lewd.”</i>", parse);
				Text.NL();
				Text.Add("Looks like [name] is really embarrassed about the whole thing, but you grudgingly concede that [heshe] probably saved your life, whatever [hisher] methods.", parse);

				Intro.KiaTalkedAboutHealing = true;
				Intro.KiaQnA();
			}, enabled : true,
			tooltip : Text.Parse("Just what was [heshe] <i>doing</i> when you woke up? <i>Healing?</i> Really now...", parse)
		});
	}
	if(options.length > 0)
		Gui.SetButtonsFromList(options);
	else
		Gui.NextPrompt(Intro.KiaSurroundings);
}

Intro.KiaSurroundings = function() {
	var parse = {
		name : kiakai.name
	}
	Text.Clear();

	Text.Add("Your most immediate questions answered, you start to explore your surroundings a bit. The tent you are in seems to be only one of many, all gathered in a small circle. In the middle of the camp, there is a large fire pit, most likely serving as a gathering place of some sort. Right now, there does not seem to be very many people around. You spot an old man smoking a pipe, and a strange-looking woman with what looks like a pair of cat ears poking out of her hair.");
	Text.NL();
	Text.Add("In the distance, across the plains and past a few small farmsteads, you can see a large dense forest. At its center, an impossibly tall tree raises its branches, covering a good part of the sky above and dwarfing everything around it.");
	Text.NL();
	Text.Add("<i>“This campground belongs to the nomads. It tends to move around a bit, but it is neutral ground. Their chief has agreed to let us borrow this tent,”</i> [name] tells you, indicating the old man. <i>“You can return here if you ever need to rest.”</i>", parse);
	Text.Flush();
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("<i>“Now then, we must discuss how to proceed from here,”</i> the elf announces, suddenly more serious. <i>“If we are to stop Uru, we need to know how she plans to get to Eden. I think we should get that gem you carry identified by a skilled magician.”</i>");
		Text.NL();
		Text.Add("[name] paces about thoughtfully. <i>“My specialty is healing, so this is unfortunately beyond me. I know the court magician at the castle could probably help us... but that raises problems of its own. You'll understand once we get there.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Once we know how the portals work, perhaps we can find a way to block her entry. Additionally, we may find a way for you to return home!”</i> The elf looks at you expectantly.");
		Text.Flush();
		Gui.NextPrompt(Intro.KiaDecideOutset);
	});
}

Intro.Outset = {
	SaveWorld : 0,
	GoHome    : 1,
	GainPower : 2
}

Intro.KiaDecideOutset = function() {
	var parse = {
		name : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);

	Text.Clear();

	Text.Add("The time has come to consider your stance in this. Are you really going to go off on some save-the-world quest in the service of some Goddess you only met briefly? Still, finding out how the gemstone works would probably be a good idea. If you could open another one of these portals, you might be able to return home and leave all of this behind.");
	Text.NL();
	Text.Add("Or... you could open a portal to somewhere else, maybe teach Uru a lesson once you have achieved some measure of power of your own.");
	Text.NL();
	Text.Add("Either way, you will have to decide what to do with [name]. The elf seems intent on joining your quest.", parse);
	Text.NL();
	Text.Flush();

	// [Save world][Go Home][Gain Power]
	var options = new Array();
	options.push({ nameStr : "Save world",
		tooltip : "The elf seems to be earnest and the cause good, why not join each other?",
		func : function() {
			gameCache.flags["IntroOutset"] = Intro.Outset.SaveWorld;
			kiakai.flags["Attitude"] = Kiakai.Attitude.Nice;
			kiakai.relation.IncreaseStat(100, 10);

			Text.Add("You agree, the demon must be stopped, and following the advice of [name] seems like a good start, at least. You also have to find out more about this land you have found yourself stuck in.", parse);
			Text.NL();
			Text.Add("<i>“Good, let us get to it then!”</i> the elf chimes in, happy that you decided to do the right thing.");
			Text.NL();
			Text.Add("<b>[name] joins your party!</b>", parse);

			party.SwitchIn(kiakai);
			Text.Flush();
			Gui.NextPrompt(Intro.KiaNiceSex);
		}, enabled : true
	});
	options.push({ nameStr : "Go home",
		tooltip : "No... this is not your fight. Still, you seem to be stuck here, for better or worse.",
		func : function() {
			gameCache.flags["IntroOutset"] = Intro.Outset.GoHome;

			Text.Add("<i>“Look, I know you mean well, but I just want to go home,”</i> you explain to the disappointed elf. <i>“Saving the world is not my job.”</i>");
			Text.NL();
			Text.Add("<i>“I can understand how you feel, believe me,”</i> [name] says. <i>“However, that does not change my instructions from Lady Aria. I will follow you and try to help you, in any way I can.”</i>", parse);
			Text.NL();
			Text.Add("Do you want to bring [himher] along? And if so, what attitude do you take?", parse);
			Text.NL();
			Text.Flush();

			// [Accept][I'm the boss][Decline]
			var options = new Array();
			options.push({ nameStr : "Accept",
				tooltip : "A friend on the road could certainly help.",
				func : function() {
					kiakai.flags["Attitude"] = Kiakai.Attitude.Nice;
					kiakai.relation.IncreaseStat(100, 5);

					Text.Add("You accept the company of the elf, feeling glad that you will have someone along who knows the land.");
					Text.NL();
					Text.Add("<b>[name] joins your party!</b>", parse);

					party.SwitchIn(kiakai);
					Text.Flush();
					Gui.NextPrompt(Intro.KiaNiceSex);
				}, enabled : true
			});
			options.push({ nameStr : "I'm the boss",
				tooltip : Text.Parse("The elf could be useful to you, but [heshe] needs to be put in [hisher] place.", parse),
				func : function() {
					kiakai.flags["Attitude"] = Kiakai.Attitude.Naughty;
					kiakai.relation.DecreaseStat(-100, 5);

					Text.Add("<i>“You may come along if you wish, but don't think that you, or your Lady, is in charge here,”</i> you declare. [name] looks shocked for a moment, but humbly nods, content that [heshe] can follow you and help you.", parse);
					Text.NL();
					Text.Add("<b>[name] joins your party!</b>", parse);

					party.SwitchIn(kiakai);
					Text.Flush();
					Gui.NextPrompt(Intro.KiaNaughtySex);
				}, enabled : true
			});
			options.push({ nameStr : "Decline",
				tooltip : Text.Parse("You'll probably be better off on your own, could you really trust [name]?", {name : kiakai.name}),
				func : function() {
					kiakai.flags["Attitude"] = Kiakai.Attitude.Neutral;
					Text.Add("<i>“I understand,”</i> the elf nods sadly. <i>“I will try to make inquiries on my own, then. Should you ever change your mind, find me at the center, at Aria's shrine.”</i> The elf bows to you and quietly moves toward the entrance of the tent, leaving you to your own devices.");
					Text.Flush();
					Gui.NextPrompt(Intro.Finalizing);
				}, enabled : true
			});
			Gui.SetButtonsFromList(options);
		}, enabled : true
	});
	options.push({ nameStr : "Gain power",
		tooltip : "While recent events have put you in a completely unfamiliar environment, why not use this situation to your advantage? Seems like the gem you carry is an object of great power...",
		func : function() {
			gameCache.flags["IntroOutset"] = Intro.Outset.GainPower;
			player.subDom.IncreaseStat(100, 5);
			kiakai.subDom.DecreaseStat(-100, 5);
			kiakai.relation.DecreaseStat(-100, 10);

			Text.Add("<i>“That's cute and all, but this isn't how we're going to do things,”</i> you dismiss the holier-than-thou elf.");
			Text.NL();
			Text.Add("<i>“W-what?”</i> [heshe] stutters, confused by your words.", parse);
			Text.NL();
			Text.Add("<i>“Getting the know-how to use the portals is a good first step, but why not use it to our advantage, eh? If we can amass enough power, a demon or two shouldn't be a problem.”</i>");
			Text.NL();
			Text.Add("The elf gives you a long look, re-evaluating [hisher] opinion of you. <i>“You are underestimating what Uru is capable of,”</i> [heshe] says darkly. <i>“And what of me? My orders from Lady Aria remain unchanged, will you still let me help you?”</i>", parse);
			Text.NL();
			Text.Flush();

			// [I'm the boss][Decline]
			var options = new Array();
			options.push({ nameStr : "I'm the boss",
				tooltip : Text.Parse("The elf could be useful to you, but [heshe] needs to be put in [hisher] place.", parse),
				func : function() {
					kiakai.flags["Attitude"] = Kiakai.Attitude.Naughty;
					Text.Add("<i>“You may come along if you wish, but don't think that you, or your Lady, is in charge here,”</i> you declare. [name] looks shocked for a moment, but humbly nods, content that [heshe] can follow you and help you.", parse);
					Text.NL();
					Text.Add("<b>[name] joins your party!</b>", parse);

					party.SwitchIn(kiakai);
					Text.Flush();
					Gui.NextPrompt(Intro.KiaNaughtySex);
				}, enabled : true
			});
			options.push({ nameStr : "Decline",
				tooltip : "What use could the elf possibly be?",
				func : function() {
					kiakai.flags["Attitude"] = Kiakai.Attitude.Neutral;
					Text.Add("<i>“I understand,”</i> the elf nods sadly. <i>“I will try to make inquiries on my own, then. Should you ever change your mind, find me at the center, at Aria's shrine.”</i> The elf bows to you and quietly moves toward the entrance of the tent, leaving you to your own devices.");
					Text.Flush();
					Gui.NextPrompt(Intro.Finalizing);
				}, enabled : true
			});
			Gui.SetButtonsFromList(options);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options);

}

Intro.KiaNiceSex = function() {
	var parse = {
		name : kiakai.name,
		boygirl : kiakai.mfTrue("boy", "girl")
	};
	parse = kiakai.ParserPronouns(parse);
	parse = player.ParserTags(parse);

	Text.Clear();
	player.AddLustFraction(1);

	Text.Add("You are just about ready to head out, when a stirring in your nether regions makes itself known. You could ask [name] for some help with that, or try to deal with it later, yourself.", parse);
	Text.NL();
	Text.Flush();

	// [Male][Female]
	var options = new Array();
	options.push({ nameStr : kiakai.name,
		tooltip : Text.Parse("How about asking [name] to finish [hisher] healing session, you could use some release.", parse),
		func : function() {
			kiakai.flags["Sexed"]++;

			Text.Add("<i>“Actually, before we head out, could you help me with something?”</i>");
			Text.NL();
			Text.Add("<i>“I would love to aid you, what is on your mind?”</i> the elf looks at you inquiringly. You indicate that you could use some more of that healing to get your body in shape. Blushing slightly, [name] motions for you to lie on the bedding. With a naughty grin, you recline as the elven [boygirl] straddles you and begins to massage your [breasts] and nibble your nipples. You take a moment to enjoy [hisher] attentions, before gently pushing [hisher] head lower.", parse);
			Text.NL();
			Text.Add("The elf gives you a long gaze through [hisher] thick lashes, then shifts [himher]self to be propped against your side", parse);
			if(kiakai.Gender() == Gender.male)
				Text.Add(", his rising erection bumping against your thigh");
			Text.Add(". Moving [hisher] hands slowly over your stomach and toward your crotch, [name] leans over to plant a series of kisses around your navel. The elf trails lower and lower, reaching the waistline of your pants, [heshe] ceremoniously undoes them using only [hisher] teeth, then slowly pulls them off your legs.", parse);
			Text.NL();

			if(player.Gender() == Gender.female) {
				Text.Add("You shiver as the elf dips one of [hisher] fingers into your sopping wet [vag], lightly teasing your labia with [hisher] other digits.", parse);

				Sex.Cunnilingus(kiakai, player);
				kiakai.Fuck(null, 2);
				player.Fuck(null, 2);
			}
			else if(player.Gender() == Gender.male) {
				Text.Add("Your stiff [cock] springs to attention as it is bared, almost slapping the elf in the face. Using careful touches and light pecks, [name] gently nurses it to full stiffness.", parse);
				Sex.Blowjob(kiakai, player);
				kiakai.FuckOral(kiakai.Mouth(), player.FirstCock(), 2);
				player.Fuck(player.FirstCock(), 2);
			}
			else {
				Text.Add("Your [cock] springs to attention as it is bared, almost slapping the elf in the face. <i>“W-wow, I wasn't expecting it to be so... big,”</i> [name] reverently whispers. Apparently, the elf got [himher]self a good look at your unusual genitalia when clothing you, though it did not seem to prepare [himher] for your full erection. [HeShe] teases your female parts with one hand while planting hot kisses and licks on your [cock].", parse);

				Sex.Cunnilingus(kiakai, player);
				kiakai.Fuck(null, 2);
				player.Fuck(null, 2);

				Sex.Blowjob(kiakai, player);
				kiakai.FuckOral(kiakai.Mouth(), player.FirstCock(), 2);
				player.Fuck(player.FirstCock(), 2);
			}
			Text.NL();


			Text.Add("<i>“This spot seems to be very sensitive,”</i> [name] murmurs in a husky voice, responding to your soft gasps, <i>“it will require more attention.”</i> The elf hoists one of [hisher] legs over you, straddling your chest and presenting you with a few interesting bits of your own to play with. Excitedly getting down to business, [name] buries [hisher] face in your crotch, ", parse);
			if(player.Gender() == Gender.female)
				Text.Add("lapping at your sopping cunt, seemingly infatuated with the taste of your sticky nectar.");
			else
				Text.Add("lathering your [cock] from tip to root, sucking and licking as if possessed.", parse);
			Text.NL();

			Text.Add("Are you going to take advantage of your current position and get inside the sexy elf's robes? Maybe you could give [name] some oral attention, or toy with [hisher] cute butt.", parse);

			Intro.KiaNiceSex69();
		}, enabled : true
	});
	options.push({ nameStr : "Ignore",
		tooltip : "Let's try to keep focused here...",
		func : function() {
			player.AddLustFraction(-0.5);
			Text.Add("Taking a few deep breaths, you try to calm down and focus on the task at hand.");
			Gui.NextPrompt(Intro.Finalizing);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options);
}

Intro.KiaNiceSex69 = function() {
	var parse = {
		name : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	parse = kiakai.ParserTags(parse, "k");
	parse = player.ParserTags(parse);

	player.AddLustFraction(1);

	var sucking = true;
	var fingering = false;

	Text.Flush();
	var options = new Array();
	if(kiakai.NumVags() > 0) {
		options.push({ nameStr : "Vagina",
			tooltip : Text.Parse("[name] deserves some attention too, how about eating [himher] out?", parse),
			func : function() {
				Text.Clear();
				Sex.Cunnilingus(player, kiakai);
				player.Fuck(null, 1);
				kiakai.Fuck(null, 1);
				Text.Add("Deciding to return the favor, you carefully lift the hem of the elf's robe, exposing [hisher] white panties. Pulling them aside, you expose a tight pink slit, absolutely moist with female juices. Humming to yourself, you lean in to administer some 'healing' of your own. Judging from the muffled gasps down between your legs, the effort is much appreciated.", parse);
				PrintDefaultOptions();
			}, enabled : true
		});
	}
	if(kiakai.NumCocks() > 0) {
		options.push({ nameStr : "Cock",
		tooltip : Text.Parse("[name] deserves some attention too, and that cock looks rather juicy...", parse),
			func : function() {
				Text.Clear();
				Sex.Blowjob(player, kiakai);
				player.FuckOral(player.Mouth(), kiakai.FirstCock(), 1);
				kiakai.Fuck(kiakai.FirstCock(), 1);
				Text.Add("Deciding to return the favor, you carefully lift the hem of the elf's robe, exposing [hisher] white panties. Pulling them aside, you free the elf's [kcock], hard from the excitement. Humming to yourself, you lean in to administer some 'healing' of your own. Judging from the muffled gasps down between your legs, the effort is much appreciated.", parse);
				PrintDefaultOptions();
			}, enabled : true
		});
	}
	options.push({ nameStr : "Finger",
		tooltip : Text.Parse("How about getting a bit kinky? Let's see how [name] feels about a finger up [hisher] butt. Who knows, perhaps [heshe] will like it?", parse),
		func : function() {
			Text.Clear();
			player.AddSexExp(2);
			kiakai.AddSexExp(2);
			kiakai.flags["AnalExp"] = 1;
			parse["gen"] = kiakai.FirstVag() ? "wet slit" : "stiff cock";
			Text.Add("Deciding to return the favor, you carefully lift the hem of the elf's robe, exposing [hisher] white panties. Licking your lips, you pull the panties down, ignoring [name]'s [gen] for now. Aiming your attention slightly higher up, you wet one of your fingers with saliva and plunge it into [hisher] tight rosebud. Judging from the muffled gasps down between your legs, the effort is much appreciated.", parse);
			sucking = false;
			fingering = true;
			PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Nope",
		tooltip : Text.Parse("[name] seems to be doing good on [hisher] own, just enjoy it.", parse),
		func : function() {
			Text.Clear();
			Text.Add("You give [name] a few perfunctory caresses on [hisher] soft [kbutt], then lean back and enjoy your healing session. The light touches only serves to egg the elf on, redoubling [hisher] efforts.", parse);
			sucking = false;
			PrintDefaultOptions();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options);

	Gui.Callstack.push(function() {
		Text.NL();
		parse["muffled"] = sucking ? " muffled" : "";
		if(player.Gender() == Gender.male) {
			Text.Add("The elf bobs [hisher] head up and down on your rigid [cock], alternating between lapping at your sensitive cockhead and burying [hisher] nose in your sack. This new healing session of yours continues for another twenty minutes or so, until a tightening in your balls announce the arrival of your climax. You let out a[muffled] cry as your cum floods the elf's mouth, pouring your seed into [hisher] throat.", parse);
		}
		else if(player.Gender() == Gender.female) {
			Text.Add("The elf uses [hisher] tongue to gently probe your netherlips, burying it so your lips connect. [HeShe] explores your depths hungrily, sometimes poking [hisher] nose against your sensitive clit. This new healing session of yours continues for another twenty minutes or so, until a hot rush in your nethers announce the arrival of your climax. You let out a[muffled] cry as your girly fluids spill into the elf's waiting mouth.", parse);
		}
		else {
			Text.Add("The elf bobs [hisher] head up and down on your rigid [cock], alternating between lapping at the sensitive tip and burying your rod deep in [hisher] throat. Meanwhile, [hisher] hands are busy pleasuring your feminine parts, probing your slick depths. This new healing session of yours continues for another twenty minutes or so, until a rush in your nether regions announce the arrival of your climax. You let out a[muffled] cry as your cum floods the elf's mouth, pouring your seed into [hisher] gullet. At the same time, your feminine juices flow out of your slippery slit, coating [hisher] fingers in clear liquid.", parse);
		}

		Text.NL();

		if(sucking) {
			Text.Add("Your own sensual licks also bear fruit, ");
			if(kiakai.Gender() == Gender.male) Text.Add("as your tongue is splattered in salty cream from the elf's quivering cock. ");
			else Text.Add("as your tongue is battered with sweet-tasting girl-cum. ");
			Text.Add("[HisHer] head buried between your legs, [name] lets out a shuddering sigh, utterly spent.", parse);
			Text.NL();
		}
		else if(fingering) {
			Text.Add("Your own sensual touches also bear fruit, ");
			if(kiakai.Gender() == Gender.male) Text.Add("as the elf's cock suddenly stiffens and unloads a batch of sticky fluid on your chest. ");
			else Text.Add("as the elf's hips tremble, streams of clear liquid dripping from her untouched vaginal tunnel. ");
			Text.Add("Smiling, you remove three fingers from the elf's once incredibly tight back door, watching as it quickly closes up. Seems like [heshe] enjoyed it, perhaps you could convince [himher] to let you stick something else in that tight hole another time...", parse);
			Text.NL();
		}

		Text.Add("[name] swallows your fluids, licking [hisher] lips with a satisfied smile on [hisher] face before silently turning around to face you. The two of you rest for a bit, before restoring your clothes in a slightly embarrassed silence. You have a feeling that the elf would be happy healing you a few more times, were you to ask. It would seem you have found yourself quite the horny travel companion.", parse);

		kiakai.slut.IncreaseStat(100, 5);
		kiakai.relation.IncreaseStat(100, 5);
		world.TimeStep({minute: 20});
		player.AddLustFraction(-1);

		Text.Flush();
		Gui.NextPrompt(Intro.Finalizing);
	});
}

Intro.KiaNaughtySex = function() {
	var parse = {
		name : kiakai.name,
		stutterName : player.name[0] + "-" + player.name
	};
	parse = player.ParserTags(parse);
	parse = kiakai.ParserPronouns(parse);

	player.AddLustFraction(1);

	Text.Clear();

	Text.Add("You are just about ready to head out, when a stirring in your nether regions makes itself known. You could put that elf's babbling mouth to some use and put [himher] in [hisher] place, or deal with it later, yourself.", parse);
	Text.NL();
	Text.Flush();

	var options = new Array();
	if(player.FirstCock()) {
		options.push({ nameStr : "Blowjob",
			tooltip : Text.Parse("Your cock needs release, and [name] looks like [heshe] has the perfect mouth to provide it.", parse),
			func : function() {
				kiakai.flags["Sexed"]++;

				Sex.Blowjob(kiakai, player);
				kiakai.FuckOral(kiakai.Mouth(), player.FirstCock(), 4);
				player.Fuck(player.FirstCock(), 4);

				Text.Add("<i>“Before we go, you should finish what you started,”</i> you insist, smirking at the confused elf.");
				Text.NL();
				Text.Add("<i>“W-what?”</i> [name] looks bewildered. Slowly, you touch one of your fingers to [hisher] soft lips, trailing a drop of saliva as you point down to your crotch, patting the bulge in your pants meaningfully. <i>“[stutterName]! Really, that is not appropriate!”</i> the flustered elf blurts out, blushing and fidgeting with the hem of [hisher] robe, trying to hide [hisher] own arousal, <i>“We need to-”</i>", parse);
				Text.NL();
				Text.Add("<i>“[name],”</i> you cut [himher] off. <i>“If we're going to work together, we'll have to get to know each other, and know each other intimately.”</i> You gently caress the elf's feminine cheek, looking deep into [hisher] eyes, <i>“Why not take this opportunity to... get to know me better?”</i>", parse);
				Text.NL();
				Text.Add("Conflicting emotions race through the elf's eyes, but [heshe] dutifully gets down on [hisher] knees in front of you. You undo your pants and pull out your stiff [cock]. Free from its confines, the rigid rod springs out to slap [name] against [hisher] cheek, causing [himher] to wince slightly.", parse);
				Text.NL();
				Text.Add("<i>“Yes, just like that,”</i> you purr as the elf almost immediately begins to suck on your [cock], succumbing to [hisher] lust. Softly trailing your fingers through [name]'s short silky hair, you moan in approval as [heshe] lathers your length with slick saliva. [HisHer] mouth feels so good... but you are just getting started. Taking a firm grip on the back of the elf's head, you insistently push [hisher] head forward until your entire length is lodged in [hisher] throat.", parse);
				Text.NL();
				Text.Add("You close your eyes and almost forget yourself for a while, relishing in the tight velvety cocksleeve, only returning to reality when the elf's gurgling protests grow desperate, and [hisher] hands weakly push against your thighs. Relenting a little, you allow [name] enough leeway to draw a ragged breath before burying yourself in [hisher] throat again. You repeat the slow process several times over the next twenty minutes, the elf moving in and out of consciousness.", parse);
				Text.NL();
				Text.Add("As you feel the rising surge of your approaching orgasm, you increase your speed, roughly pumping in and out of your companion's throat. With a final cry, you unleash your seed down the abused passage, coating the elf white from the inside. [name] coughs as you vacate your cumdump, desperately drawing gasps of air again for the first time in a long while.", parse);
				Text.NL();
				Text.Add("Neither of you speak as you put your clothes on again. You get a feeling that your slutty companion might be receptive of more of this later, and that [heshe] will be more subdued from now on.", parse);

				player.subDom.IncreaseStat(100, 5);
				kiakai.subDom.DecreaseStat(-100, 5);
				kiakai.slut.IncreaseStat(100, 5);
				kiakai.relation.DecreaseStat(-100, 5);
				world.TimeStep({minute: 20});
				player.AddLustFraction(-1);

				Text.Flush();
				Gui.NextPrompt(Intro.Finalizing);
			}, enabled : true
		});
	}
	if(player.FirstVag()) {
		options.push({ nameStr : "Get eaten",
			tooltip : Text.Parse("Your cunt is itching for release. Straddling [name]'s face and letting [himher] eat you out should hit the spot.", parse),
			func : function() {
				kiakai.flags["Sexed"]++;

				Sex.Cunnilingus(kiakai, player);
				kiakai.Fuck(null, 4);
				player.Fuck(null, 4);

				Text.Add("<i>“Before we go, you should finish what you started,”</i> you insist, smirking at the confused elf.");
				Text.NL();
				Text.Add("<i>“W-what?”</i> [name] looks bewildered. Slowly, you touch one of your fingers to [hisher] soft lips, trailing a drop of saliva as you point down to your crotch, pointing at the damp patch in your pants meaningfully. <i>“[stutterName]! Really, that is not appropriate!”</i> the flustered elf blurts out, blushing and fidgeting with the hem of [hisher] robe, trying to hide [hisher] own arousal, <i>“We need to-”</i>", parse);
				Text.NL();
				Text.Add("<i>“[name],”</i> you cut [himher] off. <i>“If we're going to work together, we'll have to get to know each other, and know each other intimately.”</i> You gently caress the elf's feminine cheek, looking deep into [hisher] eyes, <i>“Why not take this opportunity to... get to know me better?”</i>", parse);
				Text.NL();
				Text.Add("Conflicting emotions race through the elf's eyes, but [heshe] dutifully gets down on [hisher] knees in front of you. You undo your pants, exposing your moist netherlips", parse);
				if(player.FirstCock()) Text.Add(", and freeing your stiff [cock] in the process", parse);
				Text.Add(". [HeShe] immediately gets to work, diving between your legs, tongue teasing and prodding.", parse);
				Text.NL();
				Text.Add("You enjoy [name] eating you out for a while, but having [himher] merely licking you is not going to be enough. Throwing one of your legs over the elf's shoulder, you pull [himher] closer, grinding your crotch against [hisher] face", parse);
				if(player.FirstCock()) Text.Add(", your [cock] rubbing back and forth across [hisher] forehead", parse);
				Text.Add(". [HeShe] tries to follow the motions of your hips, but a particularly rough thrust makes [himher] lose balance and fall flat on [hisher] ass.", parse);
				Text.NL();
				Text.Add("Not wasting any time, you quickly take advantage of the situation and straddle the elf's face. The next twenty minutes or so are spent with you grinding your sopping wet [vag] on [name], until you cry out and squirt your juices all over [hisher] face.", parse);
				if(player.FirstCock()) Text.Add(" Your next orgasm close, you pull back and unload your [cock], dumping long strands of pearly white cum all over the elf's face.", parse);
				Text.NL();
				Text.Add("Neither of you speak as you put your clothes on again. You get a feeling that your slutty companion might be receptive of more of this later, and that [heshe] will be more subdued from now on.", parse);

				player.subDom.IncreaseStat(100, 5);
				kiakai.subDom.DecreaseStat(-100, 5);
				kiakai.slut.IncreaseStat(100, 5);
				kiakai.relation.DecreaseStat(-100, 5);
				world.TimeStep({minute: 20});
				player.AddLustFraction(-1);

				Text.Flush();
				Gui.NextPrompt(Intro.Finalizing);
			}, enabled : true
		});
	}
	options.push({ nameStr : "Ignore",
		tooltip : "Tempting as it is to take advantage of the elf, you have other things to do.",
		func : function() {
			Text.Add("Shaking your head a bit, you refocus on the task at hand. Plenty of time to get release later, and it does not seem like the elf would be totally against helping, either.");
			Text.Flush();
			Gui.NextPrompt(Intro.Finalizing);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options);
}


Intro.Finalizing = function() {
	Text.Clear();

	var parse = {
		name  : kiakai.name,
		HeShe : kiakai.HeShe(),
		i     : party.InParty(kiakai) ? "we" : "I"
	};
	if(player.flags["startJob"] == JobEnum.Scholar)
		parse["job"] = "Scholar";
	else if(player.flags["startJob"] == JobEnum.Courtesan)
		parse["job"] = "Courtesan";
	else
		parse["job"] = "Fighter";


	Text.Add("<i>“Oh... one more thing before [i] leave.”</i>", parse);
	Text.NL();
	Text.Add("<i>“You said that you are a <b>[job]</b>, yes?”</i> You nod, confirming the statement. ", parse);
	if(player.flags["startJob"] == JobEnum.Scholar)
		Text.Add("<i>“Very interesting!”</i> [name] lights up, excited in finding a fellow knowledge seeker. <i>“There is always more to learn, and regarding this, I may be able to help you. These scrolls can also aid you, perhaps broaden your horizons?”</i> ", parse);
	else if(player.flags["startJob"] == JobEnum.Courtesan)
		Text.Add("<i>“I... cannot say I understand your way of fighting.”</i> [name]’s cheek blossom, slightly embarrassed. <i>“Should you reconsider your ways, please study these scrolls.”</i> ", parse);
	else // Fighter
		Text.Add("<i>“I am sure you must be very strong... I do not think I can help you much, as it is not my calling, but please take these scrolls, they describe other ways you can defeat your foes.”</i> ", parse);
	Text.Add("[HeShe] hands you three different scrolls, detailing the basics of physical, magical and sensual combat, and how to best get started with each of those.", parse);
	Text.NL();
	Text.Add("<i>“The chief has provided you with some equipment, you can find it in that chest over there.”</i> [name] points to a large coffer near the back of the tent. Opening it reveals ", parse);
	if(player.flags["startJob"] == JobEnum.Scholar) {
		Text.Add("a simple but robust set of robes, and some dusty old books. Beside the chest is a long wooden staff, apparently part of the set.", parse);
		player.weaponSlot   = Items.Weapons.WoodenStaff;
		player.topArmorSlot = Items.Armor.SimpleRobes;
		player.acc1Slot     = Items.Accessories.CrudeBook;
		player.jobs["Scholar"].mult = 0.5;
	}
	else if(player.flags["startJob"] == JobEnum.Courtesan) {
		Text.Add("practical yet provocative clothing, revealing without being slutty. On top of the neatly folded pile is a coiled leather whip.", parse);
		player.weaponSlot   = Items.Weapons.LWhip;
		player.topArmorSlot = Items.Armor.StylizedClothes;
		player.acc1Slot     = Items.Accessories.SimpleCuffs;
		player.jobs["Courtesan"].mult = 0.5;
	}
	else {
		Text.Add("a set of leather armor and a well maintained short sword.", parse);
		player.weaponSlot   = Items.Weapons.ShortSword;
		player.topArmorSlot = Items.Armor.LeatherChest;
		player.botArmorSlot = Items.Armor.LeatherPants;
		player.acc1Slot     = Items.Accessories.IronBangle;
		player.jobs["Fighter"].mult = 0.5;
	}
	player.Equip();
	player.RestFull();
	Text.NL();
	Text.Add("You retrieve the gear and equip yourself, ready to set out!", parse);
	Text.NL();
	Text.NL();
	Text.NL();
	Text.Add("Gathering your few possessions, you head out on your adventure, the world of Eden open before you.");
	Text.NL();
	Text.NL();
	Text.NL();
	Text.Add("<b>You are at a safe location, it might be wise to save your game here by opening the data menu.</b>");

	Text.Flush();

	Intro.active = false;

	Gui.NextPrompt(PrintDefaultOptions);
}
