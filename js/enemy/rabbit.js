/*
 * 
 * Rabbit-morph lvl 1-2
 * 
 */

// TODO: Make base stats depend on Burrows flags (perhaps make a factory function?)

function Lagomorph(gender) {
	Entity.call(this);
	
	this.name              = "Lagomorph";
	this.monsterName       = "the lagomorph";
	this.MonsterName       = "The lagomorph";
	this.maxHp.base        = 30;
	this.maxSp.base        = 10;
	this.maxLust.base      = 5;
	// Main stats
	this.strength.base     = 8;
	this.stamina.base      = 9;
	this.dexterity.base    = 12;
	this.intelligence.base = 8;
	this.spirit.base       = 10;
	this.libido.base       = 17;
	this.charisma.base     = 12;
	
	this.level             = 1;
	if(Math.random() > 0.8) this.level = 2;
	this.sexlevel          = 3;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 3;
	
	if(gender == Gender.male) {
		this.body.DefMale();
		this.avatar.combat     = Images.lago_male;
	}
	else if(gender == Gender.female) {
		this.body.DefFemale();
		this.avatar.combat     = Images.lago_fem;
		this.FirstBreastRow().size.base = 5;
		this.FirstVag().virgin = false;
	}
	else {
		this.body.DefHerm(true);
		this.avatar.combat     = Images.lago_fem;
		this.FirstBreastRow().size.base = 5;
		if(Math.random() < 0.8)
			this.FirstVag().virgin = false;
	}
	this.Butt().buttSize.base = 2;
	this.Butt().virgin = false;
	
	this.body.SetRace(Race.rabbit);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	
	this.body.SetBodyColor(Color.white);
	
	this.body.SetEyeColor(Color.blue);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Lagomorph.prototype = new Entity();
Lagomorph.prototype.constructor = Lagomorph;

Scenes.Lagomorph = {};

Lagomorph.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Leporine });
	if(Math.random() < 0.5)  drops.push({ it: Items.RabbitFoot });
	if(Math.random() < 0.5)  drops.push({ it: Items.CarrotJuice });
	if(Math.random() < 0.5)  drops.push({ it: Items.Lettuce });
	return drops;
}

Lagomorph.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.6)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.DAttack.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}


function LagomorphAlpha(gender) {
	Lagomorph.call(this, gender);
	
	this.name              = "Alpha";
	this.monsterName       = "the lagomorph alpha";
	this.MonsterName       = "The lagomorph alpha";
	
	this.maxHp.base        *= 2;
	this.maxSp.base        *= 1.2;
	this.maxLust.base      *= 2;
	// Main stats
	this.strength.base     *= 1.4;
	this.stamina.base      *= 1.2;
	this.dexterity.base    *= 1.5;
	this.intelligence.base *= 1.1;
	this.spirit.base       *= 1.2;
	this.libido.base       *= 2;
	this.charisma.base     *= 1.3;
	
	this.level             = Math.floor(this.level * 1.5 + 0.5);
	this.sexlevel          = Math.floor(this.sexlevel * 1.5 + 0.5);
	
	this.combatExp         *= 2;
	this.coinDrop          *= 2;
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagomorphAlpha.prototype = new Lagomorph();
LagomorphAlpha.prototype.constructor = LagomorphAlpha;

/*
 * TODO Drop table & act for alpha
 */


function LagomorphBrute(gender) {
	gender = gender || Gender.male;
	Lagomorph.call(this, gender);
	
	this.name              = "Brute";
	this.monsterName       = "the lagomorph brute";
	this.MonsterName       = "The lagomorph brute";
	
	this.avatar.combat     = Images.lago_brute;
	
	this.maxHp.base        *= 10;
	this.maxSp.base        *= 3;
	this.maxLust.base      *= 2;
	// Main stats
	this.strength.base     *= 5;
	this.stamina.base      *= 4;
	this.dexterity.base    *= 0.9;
	this.intelligence.base *= 0.9;
	this.spirit.base       *= 2;
	this.libido.base       *= 2;
	this.charisma.base     *= 0.9;
	
	this.level             *= 3;
	this.sexlevel          *= 3;
	
	this.combatExp         *= 3;
	this.coinDrop          *= 3;
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagomorphBrute.prototype = new Lagomorph();
LagomorphBrute.prototype.constructor = LagomorphBrute;

// TODO: Drop table

LagomorphBrute.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.4)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this))
		Abilities.Physical.CrushingStrike.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.Use(encounter, this, t);
	else if(choice < 0.9 && Abilities.Physical.Frenzy.enabledCondition(encounter, this))
		Abilities.Physical.Frenzy.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}


function LagomorphWizard(gender) {
	gender = gender || Gender.male;
	Lagomorph.call(this, gender);
	
	this.avatar.combat     = Images.lago_brain;
	
	this.name              = "Wizard";
	this.monsterName       = "the lagomorph wizard";
	this.MonsterName       = "The lagomorph wizard";
	
	this.maxHp.base        *= 1.5;
	this.maxSp.base        *= 6;
	this.maxLust.base      *= 2;
	// Main stats
	this.strength.base     *= 1.2;
	this.stamina.base      *= 1.1;
	this.dexterity.base    *= 3;
	this.intelligence.base *= 5;
	this.spirit.base       *= 5;
	this.libido.base       *= 2;
	this.charisma.base     *= 2;
	
	this.level             *= 3;
	this.sexlevel          *= 3;
	
	this.combatExp         *= 3;
	this.coinDrop          *= 3;
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagomorphWizard.prototype = new Lagomorph();
LagomorphWizard.prototype.constructor = LagomorphWizard;

// TODO: Drop table

LagomorphWizard.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.1)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.3 && Abilities.Black.Fireball.enabledCondition(encounter, this))
		Abilities.Black.Fireball.Use(encounter, this, t);
	else if(choice < 0.5 && Abilities.Black.Freeze.enabledCondition(encounter, this))
		Abilities.Black.Freeze.Use(encounter, this, t);
	else if(choice < 0.7 && Abilities.Black.Bolt.enabledCondition(encounter, this))
		Abilities.Black.Bolt.Use(encounter, this, t);
	else if(choice < 0.9 && Abilities.Black.Venom.enabledCondition(encounter, this))
		Abilities.Black.Venom.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}


world.loc.Plains.Crossroads.enc.AddEnc(function() {
	var enemy = new Party();
	var enc = new Encounter(enemy);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		var alpha = burrows.GenerateLagomorphAlpha();
		enc.alpha = alpha;
		enemy.AddMember(alpha);
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		var brute = new LagomorphBrute(Gender.male);
		enc.brute = brute;
		enemy.AddMember(brute);
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
	}, 1.0, function() { return burrows.BruteActive(); });
	scenes.AddEnc(function() {
		var brainy = new LagomorphWizard(Gender.female);
		enc.brainy = brainy;
		enemy.AddMember(brainy);
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
	}, 1.0, function() { return burrows.BrainyActive(); });
	scenes.AddEnc(function() {
		var herm = new Lagomorph(Gender.herm);
		enc.herm = herm;
		enemy.AddMember(herm);
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
	}, 1.0, function() { return burrows.HermActive(); });
	
	scenes.Get();
	
	/*
	enc.canRun = false;
	enc.VictoryCondition = ...
	*/
	
	enc.onEncounter = Scenes.Lagomorph.PlainsEncounter;
	enc.onLoss      = Scenes.Lagomorph.GroupLossOnPlains;
	enc.onVictory   = Scenes.Lagomorph.GroupWinOnPlainsPrompt;
	
	return enc;
}, 1.0);

Scenes.Lagomorph.PlainsEncounter = function() {
	var enc = this;
	
	var parse = {
		earsDesc   : function() { return player.EarDesc(); },
		himherthem : party.Num() > 1 ? "them" : player.mfFem("him", "her")
	};
	
	Text.Clear();
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("As you wander about, your [earsDesc] twitch as familiar sounds reach them; soft, high-pitched moans and groans, lewd squelches and slurps, a perverse chorus that compels you to investigate. The sounds grow louder and louder as you follow them, and it doesn’t take more than a few minutes before you have uncovered the source.", parse);
		Text.NL();
		Text.Add("There before you sprawls a mass of furry bodies, writhing in the throes of indiscriminate carnal passion. A bounty of bunny-morphs are busily fucking one another, indiscriminately molesting any and every bunny in reach and being molested in turn.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("As you crest a hill, you are met by the sight of a large group of bunnies engaged in a large fuck-pile, reminiscent of the orgy in the Pit. Vena’s spawn are running rampant across the countryside, though their lack of focus make them less of a threat.", parse);
		Text.NL();
		Text.Add("That is, unless you happen to get inside their range and catch their attention.", parse);
	}, 1.0, function() { return burrows.Access(); });
	
	scenes.Get();
	
	if(enc.brainy) {
		Text.Add("<i>”Oh, will you all cut it out!”</i> screeches an indignant female voice, clearly quite unhappy with what is going on. From amongst the mass of bodies comes the figure of a female rabbit-morph, quite modestly dressed in comparison. She’s actually wearing clothes, however rudimentary in nature - little more than an improvised dress crudely sewn from scraps of salvaged cloth, and a pair of spectacles perched on her little pink nose.", parse);
		Text.NL();
		Text.Add("She steps pointedly over one rutting pair, nose twitching in disgust. <i>”Seriously, father sent us out on a scouting mission, not to gad about fucking each other! That’s what the pit is for!”</i> she complains, angrily glowering about at her companions. Her gaze shifts in your direction and she starts, a gasp of shock bubbling out between her lips.", parse);
		Text.NL();
		Text.Add("<i>”Now look what you’ve done! We’re under attack - come on, get up, get <b>up</b> you stupid sluts!”</i> she screams, violently kicking at a thrusting bunny-butt. <i>”Get [himherthem], you idiots!”</i>", parse);
		Text.NL();
		Text.Add("The kicked rabbits stir to their feet, chittering unhappily even as the female’s curses rouse others nearby to join you. Still, many more bunnies continue to happily fuck each other, the spectacle-wearing bunny cursing them even as she brandishes a stick in your direction.", parse);
		Text.NL();
		Text.Add("You have a fight on your hands!", parse);
	}
	else if(enc.brute) {
		Text.Add("<i>”Good...”</i> rumbles an alarmingly deep voice, drawing your attention to the owner. It’s a rabbit... but definitely not like the other bunnies around him. This one is a monster, easily twice the size of his compatriots, muscles bulging visibly beneath his tangled pelt. He is holding a smaller bunny in his arms, brutally thrusts into it twice, then lets out a veritable roar of pleasure. The lagomorph caught in the brute’s arm squeals in ecstasy, the sound barely audible over the brute’s roar. Sperm gushes messily from the smaller rabbit’s rear, plastering the brute’s thighs even as the bulk of it distends the rabbit’s stomach with a faux-pregnancy.", parse);
		Text.NL();
		Text.Add("Grunting casually, the bunny-brute pulls the now-bloated rabbit from his loins, revealing a half-flaccid cock easily as long as his arm bobbing in the breeze, then casually dumps his former partner atop the pile of still-fucking bunnies. At once, the brute is swarmed by eager-looking morphs, all excitedly yammering, reaching their hands for his impressive piece of fuckmeat. A self-satisfied grin crosses the brute’s features as he looks idly around, clearly ready to pick his next playmate, but then he looks right at you.", parse);
		Text.NL();
		Text.Add("An expression of dull surprise washes over the hulking lagomorph’s features, quickly chased away by a horny grin, cock rising to its full length once again. <i>”Fresh meat!”</i> he thunders, and charges impatiently towards you, his jealous groupies swarming after him. You have to defend yourself!", parse);
	}
	else if(enc.herm) {
		Text.Add("The mound of writhing bodies seems to ripple and heave, its ceaseless throes eventually throwing forth a stumbling figure, notably larger than its compatriots. The lagomorph sports a fine pair of heaving breasts upon her chest, but as she wades from the sea of bunnies, her mouth curled into an “O-shape” of pleasure, a distinctly masculine cock is revealed, an eager rabbit greedily suckling and lapping at it even as another humps away at her bouncy butt.", parse);
		Text.NL();
		Text.Add("Impatiently, the herm lagomorph wriggles, tossing back the bunny humping her ass, kicking away the one trying to suck her cock. She pouts impatiently, clearly dissatisfied with her current choice of playmates, and looks around as if hoping to see something better. She spots you and her eyes light up with glee.", parse);
		Text.NL();
		Text.Add("<i>”New sexy!”</i> she squeals happily, clapping her hands, the delighted activity drawing several curious lagomorphs to look up and see you. She hops up and down in her excitement, and then starts racing towards you, a few of the other horny bunnies abandoning their fellows to join her in your assault.", parse);
		Text.NL();
		Text.Add("You can’t run; you have to fight!", parse);
	}
	else {
		parse = enc.enemy.Get(0).ParserPronouns(parse);
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>”New catch! Reward!”</i> exclaims one of the rabbits just returning from scouting. [HeShe] rushes towards you, followed by [hisher] siblings.", parse);
			Text.NL();
			Text.Add("Looks like it’s a fight!", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("One of the dazed hoppers, having just finished inside its latest conquest, happens to look at you. Life instantly returns to the critter’s half-lidded eyes as [heshe] gets up on [hisher] feet and charges towards you, leaving a trail of juices behind. [HeShe] only stops to tug at a few others and call out to them, <i>“Fresh meat! Father happy!”</i>", parse);
			Text.NL();
			Text.Add("Seems like there’s no point in arguing, you’ll have to fight.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Noticing your arrival, a small group of sex-crazed bunnies separate from the larger pile, clambering over each other as they swarm toward you. The little critters are quick, and they have you surrounded in the blink of an eye.", parse);
			Text.NL();
			Text.Add("You ready yourself for combat!", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
	}
	Text.Flush();
	
	// Start combat
	Gui.NextPrompt(function() {
		enc.PrepCombat();
	});
}

Scenes.Lagomorph.GroupLossOnPlains = function() {
	SetGameState(GameState.Event);
	Text.Clear();
	
	var enc = this;
	enc.finalize = function() {
		Encounter.prototype.onLoss.call(enc);
	};
	
	var scenes = new EncounterTable();
	
	// TODO: Add alternate loss scene that 
	scenes.AddEnc(function() {
		Scenes.Lagomorph.GroupLossOnPlainsToBurrows(enc);
	}, 1.0, function() { return burrows.flags["Access"] == Burrows.AccessFlags.Unknown; });
	scenes.AddEnc(function() {
		enc.finalize();
		Gui.NextPrompt();
	}, 1.0, function() { return true; });
	/*
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/
	scenes.Get();
}

Scenes.Lagomorph.GroupLossOnPlainsToBurrows = function(enc) {
	var alpha = enc.alpha;
	var parse = {
		skinDesc   : function() { return player.SkinDesc(); },
		p1name     : function() { return party.members[1].name; },
		m1HeShe    : function() { return alpha.HeShe(); },
		m1heshe    : function() { return alpha.heshe(); },
		m1HisHer   : function() { return alpha.HisHer(); },
		m1hisher   : function() { return alpha.hisher(); },
		m1himher   : function() { return alpha.himher(); },
		m1cockDesc : function() { return alpha.FirstCock().Short(); }
	};
	
	Text.Clear();
	Text.Add("You try to scuttle back as the horde moves in, surrounding you on all sides. More have joined the ranks of those that defeated you, and they crowd in on you, incoherent lust filling their eyes. They pin you down, their eager paws groping you and feeling you up. It’s quite disconcerting, being mobbed by an army of humanoid bunnies with large, floppy ears, but right now you are too weak to mount any resistance.", parse);
	Text.NL();
	if(party.Two()) {
		Text.Add("A muffled shout indicate that [p1name] has also been captured by your fluffy adversaries.", parse);
		Text.NL();
	}
	else if(!party.Alone()) {
		Text.Add("Muffled shouts indicate the rest of your party have been similarly restricted.", parse);
		Text.NL();
	}
	Text.Add("The mob has started to tear off your clothes, exposing your [skinDesc] to the eager crowd. This is it, they are going to rape you, and judging by the large number of stiff cocks suddenly looming over your nude form, they are going to take hours. You briefly wonder if they hold to the trope “fucking like rabbits”, though you suspect you’ll find out shortly, whether you want to or not.", parse);
	Text.NL();
	Text.Add("Just as they are about to descend on you, a high voice shouts a short, rapt command, halting them. The horde reluctantly retract their groping hands, shuffling out of the way to reveal their leader, not too different from [m1hisher] followers, but wearing a determined look on [m1hisher] small, furred face.", parse);
	Text.NL();
	Text.Add("<i>”No!”</i> [m1heshe] repeats the order. <i>”Take back!”</i> Before you have time to puzzle over this, the mob closes in again, countless hands grabbing hold of you, hoisting you into the air.", parse);
	if(player.Weigth >= 250) {
		Text.NL();
		Text.Add("Well. Making an attempt at least. Even with their great numbers, the diminutive creatures are unable to bear the weight of your body. In a cacophony of pained yelps, your frame crashes back to the ground, only just avoiding flattening one of your captors.", parse);
		Text.NL();
		Text.Add("<i>”Heavy!”</i> the horde bemoans. <i>”Too fat!”</i> another one pipes in. How rude!", parse);
		Text.NL();
		Text.Add("The leader looks down on you, annoyed. <i>”Eat less! Run more!”</i> [m1heshe] scolds you, shaking [m1hisher] head. Without direct guidance, the crowd is starting to disperse, wandering off in different directions.", parse);
		Text.NL();
		if(alpha.FirstCock()) {
			Text.Add("Unable to enact [m1hisher] original plan, the victor instead opts to jerk off [m1hisher] [m1cockDesc], marking your defeated form with strand after strand of [m1hisher] potent load.", parse);
			Text.NL();
			Text.Add("<i>”Next time,”</i> the rabbit promises ominously. The bunny hands you some lettuce, apparently suggesting a new diet. You briefly wonder what passing travelers might think if they saw you, covered in cum and holding a piece of salad.", parse);
			Text.NL();
		}
		Text.Add("Losing interest in you, the lagomorph alpha heads off to join [m1hisher] band.", parse);
		Text.NL();
		if(party.Two()) {
			Text.Add("The retreating bunnies seem to have forgotten all about [p1name]. Your companion joins you, relieved that you made it out alright.", parse);
			Text.NL();
		}
		else if(!party.Alone()) {
			Text.Add("Your companions, seemingly forgotten in the confusion, join you and help you up.", parse);
			Text.NL();
		}
		
		Text.Add("Shaking your head, you prepare to continue your travels, which hopefully won’t include any more rape mobs in the near future.", parse);
		Text.NL();
		
		Text.Flush();
		
		world.TimeStep({minute: 20});
		
		party.inventory.AddItem(Items.Lettuce);
		player.AddLustFraction(0.3);
		
		Gui.NextPrompt();
		return;
	}
	else if(player.Weigth >= 100)
		Text.Add(" Despite your size, the rabbits have no trouble carrying you, making up for their lesser strength with their large numbers.", parse);
	else
		Text.Add(" The rabbits have no trouble carrying you, despite their size.", parse);
	Text.NL();
	Text.Add("With the alpha in the lead, you set out, your convoy loping over the rolling plains at a rapid pace. You are passed between hands several times, as the horde shares the burden of your weight, as if carrying a platter of food, with you the main course.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("The rabbits are travelling straight toward a low set of hills in the distance, an air of purpose about them. As you draw closer, you see that there are quite a number of their kind milling about the mounds, with even more passing in and out of large holes leading underground.", parse);
		Text.NL();
		if(burrows.flags["Access"] == Burrows.AccessFlags.Unknown) {
			Text.Add("<b>You discovered the Burrows.</b>", parse);
			Text.NL();
		}
		Text.Add("<i>”Leader will be pleased. Good breeding stock!”</i> the alpha bubbles jovially. With a sinking feeling you start to realize just what kind of plans the bunnies have for you. Somehow, you didn’t quite expect this was the way you’d end up - a sex slave to a bunch of stupid critters.", parse);
		Text.NL();
		Text.Flush();
		
		Scenes.Burrows.Arrival(alpha);
	});
}

Scenes.Lagomorph.GroupWinOnPlainsPrompt = function() {
	SetGameState(GameState.Event);
	
	var enc = this;
	enc.finalize = function() {
		Encounter.prototype.onVictory.call(enc);
	};
	
	var parse = {
		
	};
	
	Text.Clear();
	if(enc.brute) {
		Text.Add("The large brute looks incredulous as he lands on his butt, completely defeated. The rest of his group huddle behind him, eyeing your warily… or perhaps lustily? It seems that you have impressed them quite a bit by beating their alpha, and all they really wanted was sex. Are you willing to provide it? Or perhaps, you want to have them pull out some of their comrades from the pile that are more to your liking.", parse);
	}
	else if(enc.brainy) {
		Text.Add("The bespectacled leader of the rabbit mob sulks as you stand victorious over her.", parse);
		Text.NL();
		Text.Add("<i>”You big meanie, we just wanted to have some fun with you...”</i> she pouts, crossing her arms over her fluffy chest. Her companions are already distracted again, eyeing the rutting pile longingly.", parse);
		Text.NL();
		Text.Add("Well, if that was what they wanted, why didn’t they say so? You could have a bit of fun with this girl - she seems to be a lot sharper than her siblings - or perhaps have her companions drag someone more to your liking from the pile.", parse);
	}
	else if(enc.herm) {
		Text.Add("The hermaphrodite bunny scowls at you sulkily, her plans to rape you shattered by your stubborn resistance. Regardless, sex is even closer on her mind than before, as you can see her male parts at full mast. She blushes a bit under your gaze, and bites her lip sultrily.", parse);
		Text.NL();
		Text.Add("<i>”You… fuck? Me bad girl, punish!”</i> she moans, offering herself as her natural instincts to mate take over. She’s a girl with quite a few options, sporting both a regular pussy and a more uncommon cock. You could appease the horny rabbit’s needs… or you could have her comrades drag out some rabbits more to your liking from the pile.", parse);
	}
	else {
		Text.Add("The last of the rabbits fall before you, unable to fight on anymore. The critters still look like they want to fuck you though, so maybe - just maybe - you’ll humor them? You could deal with this group here, or have them drag out some of their comrades from the pile that are more to your liking.", parse);
	}
	
	var options = new Array();
	
	if(burrows.flags["Access"] == Burrows.AccessFlags.Unknown) {
		Text.NL();
		Text.Add("...Just what is going on here? Where are all these bunnies coming from anyways?", parse);
		
		options.push({ nameStr : "Question",
			func : function() {
				Scenes.Lagomorph.GroupWinInterrorigate(enc);
			}, enabled : true,
			tooltip : "Interrorigate the leader to find out more about the rabbits."
		});
	}
	Text.Flush();
	
	
	var group = {};
	
	group.males   = 0;
	group.females = 0;
	for(var i=0,j=enc.enemy.Num(); i<j; ++i) {
		var mob = enc.enemy.Get(i);
		if(mob.Gender() == Gender.male)   group.males++;
		if(mob.Gender() == Gender.female) group.females++;
	}
	
	if(enc.brute || enc.brainy || enc.herm) {}
	else {
		group.malegroup   = group.males > 0 && group.females == 0;
		group.femalegroup = group.females > 0 && group.males == 0;
		group.mixedgroup  = !group.malegroup && !group.femalegroup;
	}
	
	if(party.Num() == 2)
		parse["comp"] = party.Get(1).name + " is";
	else if(party.Num() > 2)
		parse["comp"] = "your companions are";
	
	// Brute TODO
	if(enc.brute) {
		/* TODO
		options.push({ nameStr : "name",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : ""
		});
		*/
	}
	// Brainy TODO
	else if(enc.brainy) {
		/* TODO
		options.push({ nameStr : "name",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : ""
		});
		*/
	}
	// Herm TODO
	else if(enc.herm) {
		/* TODO
		options.push({ nameStr : "name",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
			}, enabled : true,
			tooltip : ""
		});
		*/
	}
	
	//[Get fucked (M)]
	var tooltip = "You want to put all that bunny cock to good use and get a nice fuck. As the saying goes, they ‘fuck like rabbits’, and when one goes down, there are plenty to take his place.";
	if(party.Num() > 1)
		tooltip += " They probably won’t discriminate though, so hopefully [comp] okay with getting a thorough reaming.";
	
	options.push({ nameStr : "Get fucked (M)",
		func : function() {
			Scenes.Lagomorph.GroupWinOnPlainsGetFuckedM(enc, group);
		}, enabled : true,
		tooltip : Text.Parse(tooltip, parse)
	});
	
	/* TODO
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	*/
	
	options.push({ nameStr : "Leave",
		func : function() {
			enc.finalize();
		}, enabled : true,
		tooltip : "Leave the rabbits."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Lagomorph.GroupWinOnPlainsGetFuckedM = function(enc, group) {
	var parse = {
		playername : player.name,
		faceDesc   : function() { return player.FaceDesc(); },
		tongueDesc : function() { return player.TongueDesc(); },
		breastDesc : function() { return player.FirstBreastRow().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); }
	};
	
	Text.Clear();
	if(!group.malegroup) {
		parse["pus"] = player.FirstVag() ? " pussy and" : "";
		Text.Add("Uninterested in your current foes, you instruct them to bring you some males that want to spend their seed in a willing[pus] ass.", parse);
		if(enc.brute)
			Text.Add(" The hulking brute looks dumbfounded at your dismissal of his magnificent cock, and shuffles away, returning to the pile to sate his needs. On his way, he dislodges a group of males and sends them your direction.", parse);
		else if(enc.brainy) {
			Text.NL();
			Text.Add("<i>”I-I’m not good enough?”</i> the bespectacled rabbit tuts, fuming. <i>”Fine! I’ll find someone to fuck you!”</i> Grumbling to herself, she hops over to the pile and begins shouting orders. It seems like her message gets through, as a few bunnies head your way, cocks at the ready. Before you have a chance to thank the girl, someone grabs her and pull her into the pile. Well, she’s in good company.", parse);
		}
		else if(enc.herm) {
			Text.NL();
			Text.Add("<i>”I have cock,”</i> the herm protests, arms crossed sullenly. <i>”Me fuck you!”</i> She pouts a bit, but you manage to convince her to do as you say. Seeking to sate her own itch, the bunny returns to the pile, sending a group of eager males your way.", parse);
		}
		else { //females
			parse["s"]    = group.females > 1 ? "s" : "";
			parse["notS"] = group.females > 1 ? "" : "s";
			parse["yIes"] = group.females > 1 ? "y" : "ies";
			Text.Add(" The female[s] look[notS] a bit disappointed, but scurr[yIes] to do your bidding, bodily pulling out a few males from the larger fuck-pile.", parse);
		}
	}
	Text.NL();
	parse["be"] = player.Ears().race == Race.rabbit ? " much like your own" : "";
	Text.Add("You briefly survey the strapping young bucks lined up in front of you. The bunnies are lithe in build and covered in white fur, their heads topped by long floppy ears[be]. Thanks to their short stature, their rigid dicks are quite large in proportion to their body-size. You plan to study those delicious-looking things in much closer detail in the coming hour.", parse);
	Text.NL();
	
	var comp = party.Num() > 1;
	
	if(party.Num() == 2)
		parse["comp"] = party.Get(1).name;
	else if(party.Num() > 2)
		parse["comp"] = "your companions";
	else
		parse["comp"] = "";
	
	parse["p"] = comp ? Text.Parse(" and suggesting to [comp] to do the same", parse) : "";
	Text.Add("Removing your gear[p], you present the horny rabbits with the goods. A sultry word is all it takes for their fragile composure to break, sending the group surging toward you.", parse);
	Text.NL();
	Text.Add("The lagomorphs are not creatures that waste much time on foreplay - seeing as they spend much of their waking time fucking, you are not sure that they’ve even considered the concept - something that becomes readily apparent as two of them jump you, shoving their cocks into your mouth, filling the first hole available to them.", parse);
	Text.NL();
	
	var male = new Lagomorph(Gender.male);
	
	Sex.Blowjob(player, male);
	player.FuckOral(player.Mouth(), male.FirstCock(), 1);
	male.Fuck(male.FirstCock(), 1);
	
	if(comp) {
		Text.Add("The others are eyeing [comp] restlessly, though they don’t stride into action quite yet, hovering around you.", parse);
	}
	else {
		Text.Add("The others are circling you restlessly, and you take pity on them, stroking their cocks with your hands.", parse);
	}
	Text.NL();
	
	var target;
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		target = BodyPartType.vagina;
		parse["targetDesc"] = function() { return player.FirstVag().Short(); }
	}, 3.0, function() { return player.FirstVag(); });
	scenes.AddEnc(function() {
		target = BodyPartType.ass;
		parse["targetDesc"] = function() { return player.Butt().AnalShort(); }
	}, 1.0, function() { return true; });
	scenes.Get();
	
	Text.Add("The air is thick with the lagomorphs’ musk, the taste of their pre on your [tongueDesc] intoxicating. With your attention thus occupied, it comes as a bit of a surprise when another bunny jumps you from behind, pressing his cock between your buttcheeks and rutting against you. It doesn’t take long for him to find your [targetDesc], and once inside you, he fucks like a natural.", parse);
	Text.NL();
	
	if(target == BodyPartType.vagina) {
		Sex.Vaginal(male, player);
		player.FuckVag(player.FirstVag(), male.FirstCock(), 3);
		male.Fuck(male.FirstCock(), 3);
		
		Text.Add("The bunny bucks, pistoning his meat into your wet cleft at a blinding pace. His hips must look like a blur, judging by the speed that he’s fucking you. The lagomorph doesn’t only go for speed either, each thrust is deep enough to drive the breath from your lungs - if your airways weren’t already plugged with cock, that is. Overrun by his urge to breed, it feels like he’s trying to drill all the way into your womb.", parse);
	}
	else {
		Sex.Anal(male, player);
		player.FuckAnal(player.Butt(), male.FirstCock(), 3);
		male.Fuck(male.FirstCock(), 3);
		
		Text.Add("Eager to spend his seed, the bunny rapidly bucks his hips, pummeling your asshole. His breeding instinct might be a bit misguided, but you suspect he’s willing to fuck just about anything that moves if it gives him release. He’s sure as hell doing his damndest to get that butt of yours pregnant.", parse);
	}
	Text.NL();
	Text.Add("It’s not long before he shoots his load, pouring thick wads of hot seed into your [targetDesc]. You don’t really have a chance to be disappointed at his short fuse, as his cock is quickly replaced by another one… and there is a lot more to go around.", parse);
	Text.NL();
	Text.Add("You are distracted from the amazing feeling in your groin by your other two friends unloading their balls in your mouth and all over your [faceDesc]. Spurt after spurt of thick rabbit cum slide down your throat, or is deposited in long glistening strands on your body, dripping down on your [breastDesc].", parse);
	Text.NL();
	Text.Add("Despite you already being covered both inside and out in bunny semen, your fluffy suitors show little sign of tiring, taking turns at plugging every hole they can get their paws on. You can’t help but succumb to them, riding your pleasure high as they use you.", parse);
	if(player.FirstCock()) {
		parse["isAre"] = player.NumCocks() > 1 ? "are" : "is";
		Text.Add(" Your [multiCockDesc] [isAre] mostly left alone, though from time to time one of the bunnies plugging you will reach down and jerk you off.", parse);
	}
	Text.NL();
	
	
	if(player.FirstVag()) {
		Sex.Vaginal(male, player);
		player.FuckVag(player.FirstVag(), male.FirstCock(), 2);
		male.Fuck(male.FirstCock(), 2);
	}
	Sex.Anal(male, player);
	player.FuckAnal(player.Butt(), male.FirstCock(), 2);
	male.Fuck(male.FirstCock(), 2);
	
	// COMPANION SECTION BEGIN
	//TODO Miranda
	if(party.InParty(kiakai)) {
		parse = kiakai.ParserPronouns(parse);
		parse["name"] = kiakai.name;
		parse["priest"] = kiakai.mfTrue("priest", "priestess");
		parse["pHeShe"] = player.mfTrue("He", "She");
		parse["phisher"] = player.mfTrue("his", "her");
		parse["phimher"] = player.mfTrue("him", "her");
		parse["kanusDesc"] = function() { return kiakai.Butt().AnalShort(); }
		
		Text.Add("Meanwhile, some of the lagomorphs have approached [name], eyeing [himher] lustily. The elf’s eyes flicker to you uncertainly, and [heshe] shakes [himher]self as one of the rabbits advance on [himher].", parse);
		Text.NL();
		Text.Add("<i>”N-no! I cannot!”</i> [heshe] pipes hurriedly, blushing fiercely as [heshe] understands what they want with [himher]. The elf has yet to remove [hisher] clothes, and [heshe]’s hugging [himher]self tightly.", parse);
		Text.NL();
		Text.Add("<i>”No?”</i> The bunny looks confused, gesturing towards you. <i>”[pHeShe] ask, you no want?”</i> If there was any question about what the rabbit is referring to, his bobbing cock makes his intentions clear. [name] throws another glance your way, hurriedly averting [hisher] gaze as the bunnies on top of you add another layer of cum to your sticky coating. <i>”If no want, me go back there, yes?”</i>", parse);
		Text.NL();
		Text.Add("<i>”W-wait!”</i> [name] calls him and his friend back, face still as red as a beet. [HeShe] mutters something under [hisher] breath, finally coming to a decision. <i>”I cannot let you do that to [playername],”</i> [heshe] declares stoically, puffing up [hisher] chest. <i>”[pHeShe] takes so much on [phisher] shoulders, you will wear [phimher] out. I will share [phisher] burden,”</i> the elf announces, looking a lot less certain than [heshe] sounds.", parse);
		Text.NL();
		
		//TODO vagsex
		if(kiakai.TakeVaginalAllowed()) {
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
		}
		else if(kiakai.TakeAnalAllowed()) {
			Text.Add("[HeShe] struggles out of [hisher] clothes, dropping them on the ground beside [himher]. ", parse);
			if(kiakai.FirstVag())
				Text.Add("<i>”Y-you can only use my butt though,”</i> [name] adds, blushing as [heshe] says the words. ", parse);
			Text.Add("The two rabbits close in, pulling the consenting elf down into the grass.", parse);
			Text.NL();
			Text.Add("<i>”We make you feel good, stuff your butt nice!”</i> one of them declares as he rubs his cock against the acolyte’s cheek, pressing it in between [hisher] pliant lips. The other one circles the prone elf, crouching down behind [himher] and placing his cockhead at his lover’s [kanusDesc].", parse);
			Text.NL();
			
			Sex.Blowjob(kiakai, male);
			kiakai.FuckOral(kiakai.Mouth(), male.FirstCock(), 2);
			male.Fuck(male.FirstCock(), 2);
			
			Sex.Anal(male, kiakai);
			kiakai.FuckAnal(kiakai.Butt(), male.FirstCock(), 3);
			male.Fuck(male.FirstCock(), 3);
			
			kiakai.slut.IncreaseStat(60, 3);
			
			Text.Add("Soon, [name]’s moans join with yours as they echo across the plains. Looks like your elf has grown to like getting fucked, you should make sure [heshe] gets [hisher] fill more often...", parse);
		}
		else { //Prude
			Text.Add("<i>”...You can only use my mouth though,”</i> [name] adds, fidgeting. The elf gets down on [hisher] knees, looking up apprehensively as the two rabbits close in. One of them offers the [priest] his cock, while the other sidles up behind [himher], hugging [himher].", parse);
			Text.NL();
			Text.Add("As [name] begins to service [hisher] partner - apparently under the pretense of relieving you - the other bunny slides his paw in between the elf’s legs, ", parse);
			if(kiakai.FirstCock()) {
				parse["balls"] = kiakai.HasBalls() ? " and balls" : "";
				Text.Add("fondling [hisher] cock[balls]", parse);
			}
			if(kiakai.FirstCock() && kiakai.FirstVag())
				Text.Add(" and ", parse);
			if(kiakai.FirstVag())
				Text.Add("fingering [hisher] pussy", parse);
			Text.Add(". The acolyte of Aria arches [hisher] back, unintentionally rubbing up against the bunny’s stiff shaft.", parse);
			Text.NL();
			Text.Add("Though he looks like he feels a bit left out, the bunny restrains himself to rutting against the elf’s back, and doesn’t soil [hisher] purity.", parse);
			Text.NL();
			
			Sex.Blowjob(kiakai, male);
			kiakai.FuckOral(kiakai.Mouth(), male.FirstCock(), 2);
			male.Fuck(male.FirstCock(), 2);
			
			Text.Add("[name] seems to be putting up quite a performance… perhaps you can convince [himher] to offer you similar services, or maybe to take it a step further next time…", parse);
			
			kiakai.slut.IncreaseStat(40, 1);
		}
		Text.NL();
	}
	if(party.InParty(terry)) {
		parse = terry.ParserPronouns(parse);
		parse["foxvixen"] = terry.mfTrue("fox", "vixen");
		parse["armorDesc"] = function() { return terry.ArmorDesc(); }
		
		Text.Add("A small group of rabbits approach the [foxvixen] thief and immediately set about removing [hisher] [armorDesc].", parse);
		Text.NL();
		if(terry.Slut() < 45) {
			Text.Add("<i>”Whoa, wait you bunch of pervs! I didn’t- mmf!”</i> Terry’s protests get immediately silenced as one of the males kiss [himher] straight on the lips. ", parse);
			if(terry.PronounGender() == Gender.male)
				Text.Add("Maybe because Terry looks just so girly...", parse);
			else
				Text.Add("It seems the lagomorphs are incapable of resisting Terry’s charms...", parse);
		}
		else
			Text.Add("<i>”Hey! No need to push I’m strip- mmf!”</i> Terry has no time to finish before one of the taller bunnies decides to keep [hisher] muzzle shut with a kiss. After the initial surprise the slutty [foxvixen] is quick to kiss back. Maybe you should punish [himher] for being so forward...", parse);
		Text.NL();
		Text.Add("Your [foxvixen] is undressed in record time. [HisHer] clothing discarded carelessly as the lagomorphs push [himher] down towards the ground. ", parse);
		if(terry.Cup() < Terry.Breasts.Ccup) {
			Text.Add("One of the rabbits immediately jumps on [hisher] chest, rubbing his erect cock on the [foxvixen]’s nipples.", parse);
			if(terry.Lactation()) {
				Text.NL();
				Text.Add("A small droplet of milk beads on [hisher] nipple, and the male immediately replaces his cock with his mouth, drinking from Terry as another bunny takes the other breast. You can’t see very well from your position, but you’re pretty you can see them fapping as they suck. Looks like Terry is in for a creamy finish.", parse);
				//TODO Drink milk
			}
		}
		else {
			Text.Add("One of the rabbits immediately straddles Terry’s bosom, holding [hisher] boobs tightly together as the bunny male inserts his dick in-between the [foxvixen]’s pillowy orbs.", parse);
			if(terry.Lactation()) {
				Text.NL();
				Text.Add("A few droplets of milk moistens the lagomorph’s handpaws, and he withdraws them with a surprised squeak. A pair of his siblings quickly replace his hands with eager mouths, though. They squeeze your pet [foxvixen]’s bosom, intent on draining each orb of their liquid load.", parse);
				//TODO Drink milk
			}
		}
		Text.NL();
		if(terry.HorseCock()) {
			Text.Add("A pair of lagomorphs looks at the [foxvixen]’s enormous spire of horse-meat. Already at full mast and positively towering. The bunny-sluts are already drooling at the sight, and you’re pretty sure of their intentions when they decide to pounch on Terry’s cock. They lick and kiss the length like a long-lost lover, caressing [hisher] balls and bathing themselves on the [foxvixen]’s pre.", parse);
			Text.NL();
			
			Sex.Blowjob(male, terry);
			male.FuckOral(male.Mouth(), terry.FirstCock(), 2);
			terry.Fuck(terry.FirstCock(), 2);
		}
		else if(terry.FirstCock()) {
			Text.Add("One of the lagomorphs decides to have a taste of Terry’s cute fox-pecker. And like a practiced slut, the bunny takes the entire shaft in one long gulp. Knot and all. He suckles on Terry’s shaft with abandon, eager for some fox cream. And from the looks of it, Terry is eager to give him some too.", parse);
			Text.NL();
			
			Sex.Blowjob(male, terry);
			male.FuckOral(male.Mouth(), terry.FirstCock(), 2);
			terry.Fuck(terry.FirstCock(), 2);
		}
		var pussy = false;
		if(terry.FirstVag()) {
			var virgin = terry.FirstVag().virgin;
			parse["virgin"] = virgin ? " virgin" : "";
			Text.Add("Lifting one of the [foxvixen]’s legs, one of the bunnies easily finds Terry’s[virgin] pussy. He thrusts mercilessly, plunging his small pecker into Terry’s depths. ", parse);
			if(virgin)
				Text.Add("Robbed of [hisher] virginity, Terry screams in both pain and pleasure, muffled by the lagomorph kissing [himher].", parse);
			else
				Text.Add("Terry cries out in pleasure as the lagomorph’s sibling continues to kiss [hisher], effectively muffly [himher].", parse);
			Text.NL();
			
			Sex.Vaginal(male, terry);
			terry.FuckVag(terry.FirstVag(), male.FirstCock(), 3);
			male.Fuck(male.FirstCock(), 3);
			pussy = true;
		}
		Text.Add("The rabbit kissing Terry, decides he’s had enough, and replaces his mouth with a cock, already erect and dripping pre for the [foxvixen] to suckle. Overcome by lust, Terry wastes no time in opening [hisher] muzzle invitingly and letting the rabbit plunge his petite shaft into the [foxvixen]’s muzzle.", parse);
		Text.NL();
		if(!pussy) {
			var avirgin = terry.Butt().virgin;
			Text.Add("Terry moans as another bunny decides to play with [hisher] butt, lubing it up with tiny laps of his tongue. ", parse);
			if(avirgin) {
				Text.Add("As the lagomorph aligns his shaft, Terry immediately pushes the rabbit on top of [himher] away.", parse);
				Text.NL();
				Text.Add("<i>”No! Not my ass!”</i> [heshe] exclaims authoritatively. The bunnies crowding [himher] are stunned at [hisher] strong reaction, but quickly resume their activities. The one that was preparing to take [hisher] butt instead decides to simply stick to rimming [himher]. While the first rabbit pushes his cock against Terry’s lips once more.", parse);
				Text.NL();
			}
			else {
				Text.Add("Terry spread [hisher] legs wider, glaring lustily at the rabbit rimming [himher]. Quick to catch on, the lagomorph immediately replaces his mouth with his dick, and in a few pokes he’s plunging into the [foxvixen]’s anal passage, drawing a whorish moan from the [foxvixen]-slut.", parse);
				Text.NL();
				
				Sex.Anal(male, terry);
				terry.FuckAnal(terry.Butt(), male.FirstCock(), 3);
				male.Fuck(male.FirstCock(), 3);
			}
		}
		Text.Add("You watch as the bunnies have their fun with your pet [foxvixen] before you decide to leave them to their own device.", parse);
		Text.NL();
		
		var cum = terry.OrgasmCum();
	}
	
	//TODO Others
	// COMPANION SECTION END
	
	Text.Add("Things start melding together as the entire group deteriorates into an all out orgy.", parse);
	if(comp)
		Text.Add(" The rabbits fuck you and [comp] relentlessly, taking turns at you and shifting partners constantly.", parse);
	Text.NL();
	Text.Add("Time passes...", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		
		var cum = player.OrgasmCum(2);
		
		Text.Add("A significant amount of time later, it seems like the rabbits are finally running out of steam. Your belly is bloated with their numerous loads, cum seeping out of every orifice. Each of your lovers give you one final go before they hop off to rejoin their friends in the pile, though in their exhausted state they’ll most likely spend some time as bottoms.", parse);
		Text.NL();
		if(party.Num() == 2)
			parse["comp"] = " " + party.Get(1).name + " and";
		else if(party.Num() > 2)
			parse["comp"] = " your companions and";
		else
			parse["comp"] = "";
		Text.Add("You gather up[comp] your gear, wobbling a bit unsteadily as you re-equip yourself. In the end, you are not sure who got the most out of that engagement, you or the rabbits.", parse);
		Text.Flush();
		
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt(function() {
			enc.finalize();
		});
	});
}


Scenes.Lagomorph.GroupWinInterrorigate = function(enc) {
	var alpha = enc.alpha;
	var parse = {
		meUs       : party.Alone() ? "me" : "us",
		skinDesc   : function() { return player.SkinDesc(); },
		tongueDesc : function() { return player.TongueDesc(); },
		hairDesc   : function() { return player.Hair().Short(); },
		p1name     : function() { return party.members[1].name; },
		m1HeShe    : function() { return alpha.HeShe(); },
		m1heshe    : function() { return alpha.heshe(); },
		m1HisHer   : function() { return alpha.HisHer(); },
		m1hisher   : function() { return alpha.hisher(); },
		m1himher   : function() { return alpha.himher(); },
		m1cockDesc : function() { return alpha.FirstCock().Short(); },
		m1cockTip  : function() { return alpha.FirstCock().TipShort(); },
		m1breastDesc : function() { return alpha.FirstBreastRow().Short(); }
	};
	
	if(party.Two())
		parse["comp"] = " and " + party.members[1].name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	
	Text.Add("The rabbit horde scatters, scrambling desperately to escape your wrath. You home in on their leader, determined to get to the bottom of this. Before the beaten alpha can join [m1hisher] minions, you block off [m1hisher] path of escape.", parse);
	Text.NL();
	Text.Add("Why were you attacked? What are these critters after? How come there are so damn many of them? The alpha petulantly shakes [m1hisher] head at your questions, unwilling or unable to answer. No matter what you ask, [m1heshe] ignores you, gaze quickly flicking from side to side, looking for a chance to escape.", parse);
	Text.Flush();
	
	//[Leave][Intimidate][Seduce]
	var options = new Array();
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("Useless. You have better things to do than terrorize hapless rabbits. It’s not like beating them would be a hassle, should they prove foolish enough to challenge you again.", parse);
			Text.NL();
			Text.Add("You gather your gear and prepare to continue your journey, ignoring the frightened critter as it scurries away.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				enc.finalize();
			});
		}, enabled : true,
		tooltip : "You are just wasting time here."
	});
	options.push({ nameStr : "Intimidate",
		func : function() {
			Text.Clear();
			Text.Add("You push your defeated enemy to the ground beneath you, holding [m1himher] down by force. [m1HeShe] cringes back, growing frightened at your intimidating demeanor.", parse);
			Text.NL();
			Text.Add("<i>”Now answer!”</i> you snap. <i>”Why did you lagomorphs attack [meUs], and where are the lot of you coming from?”</i> You grab the alpha by [m1hisher] fluffy collar, preventing [m1himher] from squirming away.", parse);
			Text.NL();
			Text.Add("<i>”No! No!”</i> [m1heshe] yips, shaking [m1hisher] head desperately. You tighten your grip, fuming at [m1hisher] continued defiance. Seeing [m1hisher] eyes go even wider and almost crazy with terror, however, you realize that [m1heshe] simply doesn’t understand your questions. Perhaps a different approach is in order.", parse);
			Text.NL();
			Text.Add("<i>”You. Attack. Me.”</i> Each word is punctuated with a clear gesture, explaining your query. <i>”<b>Why?</b>”</i> The poor bunny gulps, [m1hisher] whiskers twitching nervously. [m1HeShe] is actually blushing faintly!", parse);
			Text.NL();
			Text.Add("<i>”P-pretty,”</i> [m1heshe] stammers, <i>”bring home... b-breed.”</i> Kidnap and rape, more like.", parse);
			Text.NL();
			Text.Add("<i>”Where is home?”</i> you press.", parse);
			Text.NL();
			Text.Add("<i>”N-no! Can’t!”</i> [m1heshe] moans, struggling helplessly. <i>”Lagon... hurt! Kill!”</i> No matter what you say, the defeated alpha refuses to tell you any more, afraid of something - or someone - more terrifying than you.", parse);
			Text.NL();
			Text.Add("Perhaps, though... you step back from your captive. <i>”Stay,”</i> you command. <i>”No talk? Hurt.”</i> You punctuate the last word by pointing straight at [m1hisher] rapidly drumming chest. Turning around, you make a great show of searching through your pack, pulling out various implements that could, theoretically, be applied to harm someone.", parse);
			Text.NL();
			Text.Add("A rapid patter of feet behind you tells you that your captive has finally caught on. Now to see if your bet paid off, and if the critter is as stupid as you think. You set out after your quarry, who is making a beeline across the plains for some unknown location.", parse);
			Text.NL();
			
			// TODO: Maybe a hunting check. Maybe.
			
			Text.Add("After stalking your prey at a safe distance for the better part of an hour, you draw close to a set of low hills. You slow down, as you don’t want to run straight into a trap. There seem to be a lot of lagomorphs milling around, way too many for you to handle by yourself. The alpha disappears down a large hole, set in the side of one of the central mounds, hopping down some musky underground tunnel.", parse);
			Text.NL();
			Text.Add("Just barging in doesn’t seem to be the wisest thing to do, but at least you know how to find this place again.", parse);
			Text.NL();
			Text.Add("<b>You discovered the Burrows.</b>", parse);
			Text.Flush();
			
			burrows.flags["Access"] = Burrows.AccessFlags.KnownNotVisited;
			
			Gui.NextPrompt(function() {
				enc.finalize();
			});
		}, enabled : true,
		tooltip : "Force some answers from your captive."
	});
	options.push({ nameStr : "Seduce",
		func : function() {
			Text.Clear();
			Text.Add("Rather than the stick, perhaps the carrot could prove more effective in getting your way...", parse);
			Text.NL();
			Text.Add("You sidle up to the defeated alpha, seductively caressing [m1hisher] [m1breastDesc], suggesting that you can be very... accomodating, should [m1heshe] cooperate. To illustrate your point, ", parse);
			if(alpha.FirstCock())
				Text.Add("you idly slide your fingers across [m1hisher] flaccid member, coaxing it to it’s full length. ", parse);
			else
				Text.Add("one of your hands slides between her legs, teasing open her folds. ", parse);
			Text.Add("It’s not very hard to get the rabbit desperately aroused - it’s part of [m1hisher] nature, after all.", parse);
			Text.NL();
			Text.Add("<i>”C-coop... rate?”</i> [m1heshe] pants, rutting against your hand with [m1hisher] hips. Yes... to start with, where are all these rabbits coming from? <i>”B-burrows,”</i> the alpha yips, waving dismissively off in the distance, far more interested in your hands than your questions.", parse);
			Text.NL();
			Text.Add("Much to [m1hisher] frustration, you withdraw your hands. You tell [m1himher] that you’ll show [m1himher] a <i>really</i> good time, if [m1heshe] just takes you there. The rabbit looks conflicted for a moment, juggling with the promise of sex and potentially revealing a secret. Only for a moment, though.", parse);
			Text.NL();
			Text.Add("You are dragged along by the eager alpha, who heads off across the plains, hopping about excitedly. Before long, you spot a low cluster of hills, apparently the rabbits destination.", parse);
			Text.NL();
			Text.Add("As you draw closer, you spot a large crowd of lagomorphs milling around outside, far too many for you to deal with.", parse);
			Text.NL();
			Text.Add("<b>You discovered the Burrows.</b>", parse);
			Text.NL();
			Text.Add("What should you do about your expectant companion? This close to so many of [m1hisher] kind, you probably won’t get away without putting out at least something.", parse);
			
			world.TimeStep({hour: 1});
			Text.Flush();
			
			//[Follow][Ditch]
			var options = new Array();
			options.push({ nameStr : "Follow",
				func : function() {
					Text.Clear();
					Text.Add("You nod to your guide encouragingly, telling [m1himher] to lead on. As you enter the mob, the alpha calls out a few wordless commands. An entourage quickly forms, countless hands grabbing hold of you[comp], hoisting you into the air.", parse);
					Text.NL();
					Text.Add("Things are rapidly moving out of your control, though you ruefully admit that you should probably have seen this coming. Not much you can do about it at this point - and who knows, maybe it will even prove pleasurable, as you are quite sure the alpha will demand [m1hisher] reward before long.", parse);
					Text.NL();
					Text.Flush();
					
					Gui.Callstack.push(function() {
						Scenes.Burrows.Arrival(alpha);
					});
					
					Gui.NextPrompt(function() {
						enc.finalize();
					});
				}, enabled : true,
				tooltip : "Follow the alpha into the crowd."
			});
			options.push({ nameStr : "Ditch",
				func : function() {
					Text.Clear();
					Text.Add("Rather than follow the alpha into the gathering, you pull [m1himher] off to the side, getting down on your knees in front of the short bunny-morph. The alpha moans expectantly, [m1hisher] hips twitching of their own accord in anticipation.", parse);
					Text.NL();
					if(alpha.FirstCock()) {
						Text.Add("The lagomorph is stiff as a rod and leaking pre from waiting so long, and all but erupts the second [m1heshe] feels your lips close around [m1hisher] [m1cockDesc]. Thinking that this is going to be even easier than you imagined, you lick [m1hisher] [m1cockTip] encouragingly, coaxing forth [m1hisher] seed.", parse);
						Text.NL();
						Text.Add("Yelping loudly, the lagomorph releases a torrent down your gullet, pumping what feels like gallons of hot semen into your stomach. It seems like you have gravely misjudged [m1hisher] capacity, however, as the alpha - rather than pulling out - starts rutting [m1hisher] cock, not softening one bit.", parse);
						Text.NL();
						Text.Add("[m1HeShe] hasn’t even stopped cumming before [m1heshe] is rapidly thrusting the entire length of [m1hisher] meat down the tight confines of your poor throat. Though [m1hisher] progress is greatly eased by the generous amount of lubricant [m1heshe] provided, your constricting tunnel is still protesting violently.", parse);
						Text.NL();
						Text.Add("Your eyes are watering from lack of air, when the next pinnacle of your lover’s assault sets in, pouring even more sticky white cream into your expanding stomach. Finally, [m1heshe] pulls out, letting you catch your breath again.", parse);
						Text.NL();
						Text.Add("Spent, the alpha wanders off to join the others.", parse);
					}
					else {
						Text.Add("You guide the alpha down on her back, and tell her to spread her legs. Licking your lips hungrily, you dig in, burying your [tongueDesc] in the moist cleft between her thighs. You take your time soaking up her sweet nectar, lapping at her folds and sensitive clit.", parse);
						Text.NL();
						Text.Add("The lagomorph urges you on, whimpering softly as you ravage her sex. Your lover strokes your [hairDesc], showing uncharacteristic gentleness for her usually hyperactive species. It almost makes you wish you could take this farther, but this close to the other rabbits, the risk of being discovered is too great. Who knows what they’d do if they noticed you...", parse);
						Text.NL();
						Text.Add("The alpha has no such qualms, on the other hand, crying out in pleasure for all the world to hear. Then again, you’re probably still safe, as she doesn’t seem to be the only one. By the sounds of it, there seems to be quite a lot of carnal activity going on in the large rabbit mob milling around close by.", parse);
						Text.NL();
						Text.Add("She gives one final cry as her hips start twitching, the rewards of your oral efforts trickling down one of her thighs. Shuddering, she collapses on the ground, panting incessantly for more.", parse);
						Text.NL();
						Text.Add("As much as you’d like to, this is probably your best opportunity to leave unscathed, so you quickly gather your gear, murmuring your apologies to the pining bunny. No doubt, she’ll find plenty of willing partners soon enough.", parse);
					}
					Text.NL();
					Text.Add("For the moment, you retreat back to the plains, not quite ready to tackle the burrows yet.", parse);
					Text.Flush();
					
					burrows.flags["Access"] = Burrows.AccessFlags.KnownNotVisited;
					
					Gui.NextPrompt(function() {
						enc.finalize();
					});
				}, enabled : true,
				tooltip : Text.Parse("You’re not quite ready to tackle this yet. Give the alpha what [m1heshe] wants and be off.", parse)
			});
			Gui.SetButtonsFromList(options);
			
		}, enabled : true,
		tooltip : "Entice your captive with promises of rewards."
	});
	Gui.SetButtonsFromList(options);
}
