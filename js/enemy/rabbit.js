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
		if(Math.random() < 0.9)
			this.FirstVag().virgin = false;
	}
	else {
		this.body.DefHerm(true);
		this.avatar.combat     = Images.lago_fem;
		this.FirstBreastRow().size.base = 5;
		if(Math.random() < 0.5)
			this.FirstVag().virgin = false;
	}
	this.Butt().buttSize.base = 2;
	
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
		Abilities.Attack.CastInternal(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.DAttack.CastInternal(encounter, this, t);
	else
		Abilities.Seduction.Tease.CastInternal(encounter, this, t);
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
	
	this.level             *= 1.5;
	this.sexlevel          *= 1.5;
	
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
		Abilities.Attack.CastInternal(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this))
		Abilities.Physical.CrushingStrike.CastInternal(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.CastInternal(encounter, this, t);
	else if(choice < 0.9 && Abilities.Physical.Frenzy.enabledCondition(encounter, this))
		Abilities.Physical.Frenzy.CastInternal(encounter, this, t);
	else
		Abilities.Seduction.Tease.CastInternal(encounter, this, t);
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
		Abilities.Attack.CastInternal(encounter, this, t);
	else if(choice < 0.3 && Abilities.Black.Fireball.enabledCondition(encounter, this))
		Abilities.Black.Fireball.CastInternal(encounter, this, t);
	else if(choice < 0.5 && Abilities.Black.Freeze.enabledCondition(encounter, this))
		Abilities.Black.Freeze.CastInternal(encounter, this, t);
	else if(choice < 0.7 && Abilities.Black.Bolt.enabledCondition(encounter, this))
		Abilities.Black.Bolt.CastInternal(encounter, this, t);
	else if(choice < 0.9 && Abilities.Black.Venom.enabledCondition(encounter, this))
		Abilities.Black.Venom.CastInternal(encounter, this, t);
	else
		Abilities.Seduction.Tease.CastInternal(encounter, this, t);
}


world.loc.Plains.Crossroads.enc.AddEnc(function() {
 	var enemy = new Party();
 	var alpha = burrows.GenerateLagomorphAlpha();
 	enemy.AddMember(alpha);
	enemy.AddMember(burrows.GenerateLagomorph());
	enemy.AddMember(burrows.GenerateLagomorph());
	enemy.AddMember(burrows.GenerateLagomorph());
	var enc = new Encounter(enemy);
	enc.alpha = alpha;
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.VictoryCondition = ...
	*/
	
	enc.onLoss    = Scenes.Lagomorph.GroupLossOnPlains;
	enc.onVictory = Scenes.Lagomorph.GroupWinOnPlainsPrompt;
	
	return enc;
}, 1.0);

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
	Text.Clear();
	
	var enc = this;
	enc.finalize = function() {
		Encounter.prototype.onVictory.call(enc);
	};
	
	//[Sure][Nah]
	var options = new Array();
	if(burrows.flags["Access"] == Burrows.AccessFlags.Unknown) {
		options.push({ nameStr : "Question",
			func : function() {
				Scenes.Lagomorph.GroupWinInterrorigate(enc);
			}, enabled : true,
			tooltip : "Interrorigate the leader to find out more about the rabbits."
		});
	}
	options.push({ nameStr : "Leave",
		func : function() {
			enc.finalize();
		}, enabled : true,
		tooltip : "Leave the rabbits."
	});
	Gui.SetButtonsFromList(options);
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
