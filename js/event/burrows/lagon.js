/*
 * 
 * Define Lagon
 * 
 */

Scenes.Lagon = {};



function Lagon(storage) {
	Entity.call(this);
	this.name = "Lagon";
	
	this.sexlevel          = 8;
	
	this.body.DefMale();
	
	this.FirstCock().thickness.base = 7;
	this.FirstCock().length.base = 38;
	this.Balls().size.base = 6;
	
	this.Butt().buttSize.base = 2;
	
	this.body.SetRace(Race.rabbit);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	this.body.SetBodyColor(Color.white);
	this.body.SetEyeColor(Color.blue);
	
	this.flags["Usurp"] = 0;
	
	if(storage) this.FromStorage(storage);
}
Lagon.prototype = new Entity();
Lagon.prototype.constructor = Lagon;

Lagon.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Lagon.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule
Lagon.prototype.IsAtLocation = function(location) {
	if(burrows.LagonDefeated()) return false; //TODO slave mode
	location = location || party.location;
	if(world.time.hour >= 9 && world.time.hour < 20)
		return (location == world.loc.Burrows.Throne);
	else
		return (location == world.loc.Burrows.Pit);
}

Lagon.Usurp = {
	FirstFight : 1,
	Defeated   : 2,
	SidedWith  : 4
}

//For first fights
function LagonRegular(tougher) {
	BossEntity.call(this);
	
	this.tougher           = tougher; //use for AI + stats
	
	this.name              = "Lagon";
	
	this.avatar.combat     = Images.lagon_r;
	//TODO tougher
	this.maxHp.base        = tougher ? 2000 : 1600;
	this.maxSp.base        = tougher ?  500 :  300;
	this.maxLust.base      = tougher ?  500 :  300;
	// Main stats
	this.strength.base     = tougher ? 100 :  80;
	this.stamina.base      = tougher ? 120 : 100;
	this.dexterity.base    = tougher ? 150 : 120;
	this.intelligence.base = tougher ?  90 :  80;
	this.spirit.base       = tougher ? 100 :  80;
	this.libido.base       = tougher ? 100 :  80;
	this.charisma.base     = tougher ?  80 :  70;
	
	this.level             = tougher ?  16 :  14;
	this.sexlevel          = 8;
	
	this.combatExp         = tougher ? 200 : 150;
	this.coinDrop          = tougher ? 500 : 300;
	
	this.body.DefMale();
	
	this.FirstCock().thickness.base = 7;
	this.FirstCock().length.base = 38;
	this.Balls().size.base = 6;
	
	this.Butt().buttSize.base = 2;
	
	this.body.SetRace(Race.rabbit);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	this.body.SetBodyColor(Color.white);
	this.body.SetEyeColor(Color.blue);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagonRegular.prototype = new BossEntity();
LagonRegular.prototype.constructor = LagonRegular;

//TODO
LagonRegular.prototype.DropTable = function() {
	var drops = [];
	drops.push({ it: Items.Leporine });
	//TODO this.tougher
	return drops;
}

LagonRegular.prototype.PhysDmgHP = function(encounter, caster, val) {
	var parse = {
		poss : caster.possessive()
	};
	
	if(Math.random() < 0.1) {
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("Before [poss] blow connects, a wall of bunnies interpose themselves, absorbing the damage for their king!", parse);
			Text.NL();
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Numerous bunnies throw themselves in the way of [poss] incoming attack, shielding their king!", parse);
			Text.NL();
		}, 1.0, function() { return true; });
		
		scenes.Get();
		Text.Flush();
		
		return false;
	}
	else
		return Entity.prototype.PhysDmgHP.call(this, encounter, caster, val);
}

//TODO
LagonRegular.prototype.Act = function(enc, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(enc, activeChar);

	var parse = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name,
		phisher : player.mfFem("his", "her")
	};

	var tougher = this.tougher;
	var enemy  = enc.enemy;
	var fallen = [];
	for(var i = 1; i < enemy.members.length; i++) {
		if(enemy.members[i].Incapacitated())
			fallen.push(enemy.members[i]);
	}
	if(fallen.length > 0 && Math.random() < 0.5) {
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>”Come to me, my children!”</i> Lagon shouts, rallying additional troops to his side.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>”The one to bring the rebel down gets to be second in line after I bang [phisher] brains out!”</i> With that, more bunnies rally to Lagon’s side.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>”Rally to your king, my children!”</i> Lagon calls out, summoning more rabbits to his side.", parse);
		}, 1.0, function() { return true; });

		scenes.Get();
		Text.NL();
		Text.Flush();
		
		for(var i = 0; i < fallen.length; i++) {
			enemy.SwitchOut(fallen[i]);
			var entity;
			if(tougher) {
				var r = Math.random();
				if(r < 0.3)
					entity = new LagomorphBrute();
				else if(r < 0.6)
					entity = new LagomorphWizard();
				else
					entity = new LagomorphElite();
			}
			else {
				if(Math.random() < 0.5)
					entity = new LagomorphAlpha();
				else
					entity = new Lagomorph();
			}
			enemy.AddMember(entity);
			
			var ent = {
				entity     : entity,
				isEnemy    : true,
				initiative : 0,
				aggro      : []};
			enc.GenerateUniqueName(entity);
			
			enc.combatOrder.push(ent);
			ent.entity.GetSingleTarget(enc, ent);
		}
	}

	var choice = Math.random();
	if(choice < 0.2 && Abilities.Physical.DirtyBlow.enabledCondition(enc, this))
		Abilities.Physical.DirtyBlow.Use(enc, this, t);
	else if(choice < 0.4 && Abilities.Physical.FocusStrike.enabledCondition(enc, this))
		Abilities.Physical.FocusStrike.Use(enc, this, t);
	else if(choice < 0.6 && Abilities.Physical.TAttack.enabledCondition(enc, this))
		Abilities.Physical.TAttack.Use(enc, this, t);
	else if(choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(enc, this))
		Abilities.Physical.DAttack.Use(enc, this, t);
	else
		Abilities.Attack.Use(enc, this, t);
}

//For final fight
function LagonBrute(scepter) {
	BossEntity.call(this);
	
	this.turns = 0;
	
	this.name              = "Lagon";
	
	this.avatar.combat     = Images.lagon_b;
	//TODO scepter
	this.maxHp.base        = 4000;
	this.maxSp.base        = 700;
	this.maxLust.base      = scepter ?  300 :  500;
	// Main stats
	this.strength.base     = scepter ? 140 : 180;
	this.stamina.base      = scepter ? 130 : 150;
	this.dexterity.base    = scepter ?  80 : 100;
	this.intelligence.base = scepter ?  40 :  60;
	this.spirit.base       = scepter ?  60 :  80;
	this.libido.base       = scepter ?  80 : 100;
	this.charisma.base     = scepter ?  50 :  60;
	
	this.level             = scepter ? 18 : 20;
	this.sexlevel          = 8;
	
	this.combatExp         = scepter ? 400 :  500;
	this.coinDrop          = scepter ? 800 : 1000;
	
	this.body.DefMale();
	
	this.FirstCock().thickness.base = 11;
	this.FirstCock().length.base = 60;
	this.Balls().size.base = 10;
	
	this.Butt().buttSize.base = 2;
	
	this.body.SetRace(Race.rabbit);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	this.body.SetBodyColor(Color.white);
	this.body.SetEyeColor(Color.red);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagonBrute.prototype = new BossEntity();
LagonBrute.prototype.constructor = LagonBrute;

//TODO
LagonBrute.prototype.DropTable = function() {
	var drops = [];
	drops.push({ it: Items.Leporine });
	return drops;
}

//TODO
LagonBrute.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var targets = this.GetPartyTarget(encounter, activeChar);
	var t = this.GetSingleTarget(encounter, activeChar);

	var parse = {
		
	};

	var first = this.turns == 0;
	this.turns++;
	var scepter = party.Inv().QueryNum(Items.Quest.Scepter);
	
	if(scepter) {
		if(first) {
			Text.Add("Lagon is just about to jump on you when Ophelia gives out a triumphant yelp. The big brute growls, clutching at his head. Whatever she’s doing with the scepter, it seems to be doing something.", parse);
			Text.Flush();
			
			this.AddHPAbs(-1000);
			this.AddSPAbs(-300);
			
			Gui.NextPrompt(function() {
				encounter.CombatTick();
			});
			return;
		}
		else if(Math.random() < 0.1) {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>”T-there, I have it!”</i> Ophelia yelps as she manages to fiddle the rod again, causing Lagon to shake his head in confusion.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Just as he’s about to make his move, something distracts the king from his target. The beast throws his eyes around the hall, trying to figure out what’s going on.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Lagon clutches his head as the scepter works its magic, distracted from his foes for a moment.", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
			Text.Flush();
			
			this.AddHPAbs(-100);
			this.AddSPAbs(-30);
			
			Gui.NextPrompt(function() {
				encounter.CombatTick();
			});
			return;
		}
	}
	
	var choice = Math.random();
	if(choice < 0.2 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.Use(encounter, this, t);
	else if(choice < 0.4 && Abilities.Physical.Frenzy.enabledCondition(encounter, this))
		Abilities.Physical.Frenzy.Use(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this))
		Abilities.Physical.CrushingStrike.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.GrandSlam.enabledCondition(encounter, this))
		Abilities.Physical.GrandSlam.Use(encounter, this, targets);
	else
		Abilities.Attack.Use(encounter, this, t);
}

//TODO
Scenes.Lagon.InteractRuler = function() {
	var parse = {
		
	};
	parse["stuttername"] = player.name[0] +"-"+ player.name;
	
	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	//[name]
	var options = new Array();
	/*
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
	if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage3 && !burrows.LagonAlly()) {
		options.push({ nameStr : "Usurp!",
			func : function() {
				Text.Clear();
				Text.Add("<i>“And what can I do for you today, traveller?”</i> Lagon leisurely regards you with a bored expression. <i>“I believe that you already bought all the needed ingredients to Ophelia; I do not have any further requests for your currently.”</i> He shakes his head. <i>“I feel the girl grows rebellious. Perhaps it’s time to throw her in the Pit together with her mother, as I should have done long ago.”</i>", parse);
				Text.NL();
				Text.Add("He’ll do no such thing. The king’s eyebrows rises in question, as if he doesn’t quite understand what he’s hearing. <i>“I was thinking out loud, not asking for advice, traveller,”</i> he rests his chin on his knuckles, studying you. <i>“Do you presume to tell me what to do? What kind of nonsense has that girl been feeding you?”</i>", parse);
				Text.NL();
				Text.Add("You contemptuously tell him that you can see him for what he is; a savage beast that needs to be put down. Fury fills Lagon’s eyes, but before he can reply, your conversation is interrupted by the arrival of Ophelia, flanked by two guards.", parse);
				Text.NL();
				Text.Add("<i>“Y-you called for me, father?”</i> she falters, her gaze flickering between the two of you, locked in your staredown. The king is the first to break eye contact, casting his furious glare at his daughter.", parse);
				Text.NL();
				Text.Add("<i>“You!”</i> he screams, jumping to his feet, his face dark with rage. <i>“This fucking rebellious bullshit ends now! I’m throwing you into the fucking Pit for the rest of your damned life you sneaky little bitch!”</i> He starts making for her, but you step into his way.", parse);
				Text.NL();
				Text.Add("<i>“[stuttername]... this… please… no...”</i> Ophelia stammers. <i>“You can’t, I told you he’s too strong!”</i> This apparently doesn’t earn her any favors with daddy.", parse);
				Text.NL();
				Text.Add("<i>“Seize her, I’ll deal with her later! You three… take care of this cretin.”</i> Lagon hops back onto his throne as his guards rush to intercept you, his gaze drilling into you. <i>“As for you… when I’m done with you, you’ll be begging for me to throw you in the pit.”</i>", parse);
				Text.NL();
				Text.Add("It’s a fight!", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Scenes.Lagon.Usurp();
				});
			}, enabled : true,
			tooltip : "Lagon’s reign has gone on long enough! Scepter or no scepter, he’s going down!"
		});
	}
	Gui.SetButtonsFromList(options, true);
}



Scenes.Lagon.PitDefianceWin = function() {
	SetGameState(GameState.Event);
	var enc = this;
	var parse = {
		
	};
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Lagon falls back, his face a mask of rage. Before you can step in to deliver the final blow, dozens of rabbits flood in your way, showering you in ineffectual punches. You try to throw them out of the way, but they are just too many. With the combined pressure of their bodies, the lagomorph mob pushes you away from their king.", parse);
		Text.NL();
		Text.Add("<i>“Don’t fucking think this is the end!”</i> Lagon roars, similarly restrained as he’s quickly carried from the hall. <i>“I’ll find you, and I’ll fucking <b>murder</b> you, little cretin!”</i> His ranting fades as his subjects retreat, leaving you a brief moment of respite. You are about to give chase when a hand on your shoulders reins you in.", parse);
		Text.NL();
		Text.Add("<i>“Quickly, come with me!”</i> Ophelia urges you, leading toward the exit. She’s very excited, hopping along with a new-found energy in her step. <i>“That was amazing!”</i> the alchemist exclaims, absentmindedly pulling you around a group of bunnies so deep into the carnal act they probably didn’t even notice the fight. <i>“I’ve never seen <b>anyone</b> stand up to father! Well, and come out of it victorious, at least.”</i>", parse);
		Text.NL();
		Text.Add("As you run, Ophelia’s gaze flickers left and right, as if she’s expecting an ambush. <i>“Gotta get out before the honor guard arrives,”</i> she mutters to herself. Why not stand and fight? You should be heading for the throne room, you counter.", parse);
		Text.NL();
		Text.Add("<i>“No, no,”</i> she shakes her head, still not quite understanding what just happened. <i>“He’s hiding his strength, he has to be. He’s trying to trap you! If you follow him, you’ll be thrown in chains!”</i> she keeps muttering to herself, but you decide to humor her for the time being. Lagon isn’t going anywhere.", parse);
		Text.NL();
		Text.Add("As you finally emerge above ground again, the alchemist takes some time to pant and wheeze before turning to face you.", parse);
		Text.NL();
		Text.Add("<i>“I… thanks,”</i> she says, bowing her head. <i>“You really saved me back there. Father’s been getting more and more out of hand… you were right to step in, and I’m grateful for it.”</i> She takes a deep breath, and slumps down on the ground. <i>“It forces my hand, however. I’ve known for a while now that this couldn’t go on, but I don’t have any ways of standing up to father on my own.”</i> Ophelia looks at you with admiration, blushing faintly. <i>“I’m not as strong, nor as brave as you.”</i>", parse);
		Text.NL();
		
		ophelia.relation.IncreaseStat(100, 25);
		ophelia.burrowsCountdown = new Time(0,0,7,0,0); //7 days
		
		Scenes.Ophelia.ScepterRequest(true);
		
		Text.Flush();
		
		lagon.flags["Usurp"] |= Lagon.Usurp.FirstFight;
		
		world.TimeStep({minute: 30});
		party.location = world.loc.Burrows.Enterance;
		
		Gui.NextPrompt();
	});
	
	Encounter.prototype.onVictory.call(enc);
}

Scenes.Lagon.PitDefianceLoss = function() {
	SetGameState(GameState.Event);
	var parse = {
		face : function() { return player.FaceDesc(); },
		tongue : function() { return player.TongueDesc(); },
		anusDesc : function() { return player.Butt().AnalShort(); },
		vagDesc : function() { return player.FirstVag().Short(); },
		cocks : function() { return player.MultiCockDesc(); }
	};
	
	parse["comp"] = party.Num() == 2 ? party.Get(1).name :
	                party.Num() >  2 ? "your companions" : "";
	
	Text.Clear();
	parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	Text.Add("You fall to the ground, exhausted from the fight. It’s no use… he’s just too strong. The taste of defeat is all the more palpable here, in the middle of the salty lake of cum fueled by hundreds of rutting rabbits. Any hopes of escape are crushed by a horde of bunnies piling up on top of you[c], the combined weight of their bodies keeping you in place.", parse);
	Text.NL();
	Text.Add("<i>“Well, that was amusing for a brief moment,”</i> Lagon chuckles, rolling his shoulders. <i>“But I’m not sure what you hoped to achieve.”</i> He hops over to you, grabbing you roughly by the chin. <i>“Did you consider that in your pitiful rebellion, you tried to deny my daughter her deepest desires? Such an unworthy cause, traveller. See? She’s so much happier without your meddling.”</i>", parse);
	Text.NL();
	Text.Add("The rabbit king forces your head to the side. Two rabbits come into view - Vena and Ophelia, the former ecstatically pounding the latter - both crying out in joyous orgasm. <i>“See how much fun they are having?”</i> he rasps in your ear. <i>“Perhaps if you are a good little slut, I’ll let you join in.”</i> Lagon effortlessly pulls you out from under the heap of bunnies, holding you by the throat in an iron grip.", parse);
	Text.NL();
	Text.Add("<i>“First, however,”</i> he grunts, his words accentuated by a heavy punch to your stomach, <i>“we need to talk about obedience.”</i> You are coughing and gasping for breath as he drops you to the ground. <i>“It’s quite simple,”</i> the royal brute continues unhurriedly as he flips you over on your stomach, making you taste salty cum. <i>“You are now lower than a worm. You’ll obey the wishes of any and all here in the burrows, be it myself or the lowest fuckslut in the Pit. This will be easy, as your orders will be quite simple. For example, <b>suck</b>.”</i>", parse);
	Text.NL();
	Text.Add("Your eyes go wide as Lagon shoves his fifteen inch monstrosity down your throat, a firm hand on your head as he continues his lecture even as he facefucks you. <i>“Now that Vena has reached perfection, I might be generous and let Ophelia experiment on <b>you</b> next.”</i> Your vision is rapidly fading as you choke on the massive shaft, eyes watering...", parse);
	Text.NL();
	
	Sex.Blowjob(player, lagon);
	player.FuckOral(player.Mouth(), lagon.FirstCock(), 3);
	lagon.Fuck(lagon.FirstCock(), 3);
	
	Text.Flush();
	
	world.TimeStep({hour : 1});
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("When you come to again, your [face] is smeared in sticky cum. Your throat feels raw, though blissfully empty, allowing sweet air to fill your lungs. The ordeal has barely just begun, however, as you feel a heavy weight on your back.", parse);
		Text.NL();
		Text.Add("<i>“You know,”</i> Lagon says conversationally as he roughly jams his cock into your protesting ass, <i>“I’ve even considered taking some of my daughter’s potions myself. The one that increases strength and size could be fun, don’t you think? As soon as I do it, I’ll be sure to test it out on you first.”</i>", parse);
		Text.NL();
		
		Sex.Anal(lagon, player);
		player.FuckAnal(player.Butt(), lagon.FirstCock(), 4);
		lagon.Fuck(lagon.FirstCock(), 4);
		
		Text.Add("You bite down your response, trying to keep hold of your sanity while the rabbit king ravages your [anusDesc]. Visions of the brutes created by Ophelia’s alchemy swims into your mind. As big as Lagon’s cock is now - something you’re rather intimately familiar with now - how big would it be once he took something like that? Three feet? Four?", parse);
		Text.NL();
		Text.Add("<i>“I’ve barely even gotten started with you, little bitch,”</i> Lagon growls, his hips a blur as he goes to town on your ass, <i>“and once I’m satisfied, once I’ve put enough loads in you to make your belly swell even larger than Vena’s, then I’ll let the rest of the Pit have you. Hundreds of bunnies fucking you without rest for days on end, and each time one of them cums in you, you’ll be reminded of your mistake; the day that you dared raise your hand against me.”</i>", parse);
		Text.NL();
		if(party.Num() > 1) {
			var p1 = party.Get(1);
			parse["s"]      = party.Num() > 2 ? "s" : "";
			parse["heshe"]  = party.Num() > 2 ? "they" : p1.heshe();
			parse["hisher"] = party.Num() > 2 ? "their" : p1.hisher();
			parse["poss"]   = party.Num() > 2 ? "your companions'" : p1.name;
			Text.Add("<i>“The same goes for your friend[s]; [heshe] too will end [hisher] days here, in the darkness of the pit.”</i> Lagon’s voice is dripping of malice as he speaks of [poss] fate.", parse);
			Text.NL();
		}
		Text.Add("In a last weak effort to defy your tormentor, you raise your head to curse him, to denounce him, but before you can blink the powerful lagomorph has shoved your face back into the jizz-pool.", parse);
		Text.NL();
		Text.Add("Gradually, your senses dull one by one, until all that remains is the taste of cum on your [tongue], the dim silhouettes writhing in carnal bliss, the incessant heat… and the gargantuan rod stretching your back door to its limits. Everything else fades in comparison. The king’s words are too much to handle, and you force yourself to focus on this one cock. Sooner or later, Lagon has to be satisfied, right? And then you will be able to rest...", parse);
		Text.NL();
		Text.Add("Yet no rest is to be had. Even after Lagon has filled you to the brim countless times, even after Vena has done the same, even when Lagon has had a second round… not even then does it stop. Bunny after bunny ravages your every hole, usually several at once, until you’re convinced that the cum leaking from you alone is enough to threaten to fill the Pit.", parse);
		Text.NL();
		if(player.FirstVag()) {
			Text.Add("Your [vagDesc] receives equal treatment to your ass; countless cocks ravage your insides, flooding your womb with virile lagomorph seed. You realize that you will most likely spend the rest of your life just like Vena - constantly pregnant, only getting a short respite from fucking when you give birth.", parse);
			Text.NL();
		}
		if(player.FirstVag()) {
			parse = Text.ParserPlural(parse, player.NumCocks() > 1);
			Text.Add("Your [cocks] [isAre] all but forgotten, though no small amount of the jizz you are bathing in comes from yourself. On Lagon’s orders, none of the other bunnies touch [itThem], though the rabbit king promises that you will get your turn if you behave like a good slut.", parse);
			Text.NL();
		}
		Text.Add("Everything blurs together as the massive orgy around you continues, your own concerns, plans and goals discarded and forever lost. The last words you hear are Lagon calling for someone to bring you a special potion; something that will make you feel even better. You can hardly wait.", parse);
		Text.NL();
		Text.Add("Time passes...", parse);
		Text.Flush();
		
		world.TimeStep({hour : 1});
	
		Gui.NextPrompt(Scenes.Lagon.BadendPit);
	});
}

Scenes.Lagon.BadendPit = function() {
	var parse = {
		
	};
	
	party.location = world.loc.Plains.Burrows.Pit;
	world.TimeStep({season: 1});
	
	Text.Clear();
	Text.Add("Whoever you were before, both physically and mentally, it’s all washed away in the orgasmic wave of ecstasy that is your every waking moment. Everywhere around you, dark shapes writhe in carnal bliss as the endless orgy of the Pit grinds on, with you as one of its central pieces.", parse);
	Text.NL();
	Text.Add("You don’t know how long you’ve been here beside Vena and Ophelia; days and weeks meld together in a mess of pleasure and cum. Much like the matriarch and her daughter, you are almost constantly pregnant, your swollen belly a temple to your dedication to your master. ", parse);
	if(!player.FirstVag())
		Text.Add("A fading memory reminds you that you were not always like this… what a horrible thing to imagine, not being able to serve your king and birth him more children. You shudder at the thought.", parse);
	else
		Text.Add("Your pussy and womb are now the property of Lagon, and whomever he chooses to fill them.", parse);
	Text.NL();
	parse["c"] = player.FirstCock() ? ", giving, receiving, it no longer matters to you" : "";
	Text.Add("Your days are filled with endless fucking[c]. All that fills your head is the next blissful orgasm, and the pleasure of knowing that you are <i>needed</i>, you serve a purpose. You and your sisters are to be the mothers of the rulers of Eden; with their rapidly growing numbers, the bunnies will soon be unstoppable.", parse);
	Text.NL();
	Text.Add("News are slow to travel down here, but your master loves to gloat about his exploits. His armies have started moving; not against Rigard, not yet, but the highland tribes are quietly submitting, one by one. Before long, the rabbits will be too many to stop; a tide of fluffy bodies washing over the walls of Rigard and breaking the city with sheer numbers. And you are one of the proud mothers of this unstoppable army.", parse);
	Text.NL();
	Text.Add("Even now, young ones kick in your womb, their growth accelerated by Ophelia’s alchemy. Strong ones too; you suspect that these might carry the brute strain, and may one day stand in the forefront of Lagon’s army. But enough of that. Until you birth your young and can be fertilized again, your duty is to relieve the breeders and be the willing receiver of any cock that wants you.", parse);
	Text.NL();
	parse["comp"] = party.Num() == 2 ? party.Get(1).name :
	                party.Num() >  2 ? "your companions" : "";
	parse["c1"] = party.Num() > 1 ? "," : " and";
	parse["c2"] = party.Num() > 1 ? Text.Parse(", and [comp]", parse) : "";
	Text.Add("Matters of politics, magic and demons are swept from your mind as another one of the bunnies plunges himself into your needy pussy; just one of dozens today. You share a warm look with Ophelia[c1] Vena[c2]. Here in the Pit, you are needed.", parse);
	Text.Flush();
	
	SetGameOverButton();
}


Scenes.Lagon.BadendBrute = function() {
	SetGameState(GameState.Event);
	
	var scepter = party.Inv().QueryNum(Items.Quest.Scepter);

	SetGameState(GameState.Event);
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("With a great roar, the mad king slams you across the chest, sending you flying though half the hall. The impact dazes you, and you’re only half aware of what’s going on around you. There seem to be a lot of screams… You try to shake the dull pain from your skull and shake your blurry vision.", parse);
	if(party.Num() == 2)
		Text.Add(" Beside you, you dimly see [name] in a similar state.", {name: party.Get(1).name});
	else if(party.Num() > 2)
		Text.Add(" Beside you, you dimly see your companions in similar states.", parse);
	Text.NL();
	Text.Add("The throne room is a scene of chaos; the still bodies of fallen bunnies everywhere. At the heart of the whirlwind of violence is the bestial Lagon, eyes burning with an unnatural flame as he indiscriminately bashes people out of his way left and right, no longer caring about distinguishing between friend and foe.", parse);
	Text.NL();
	Text.Add("Only one person remains standing against the brute - his daughter Ophelia, who stands up on shaking legs. ", parse);
	if(scepter)
		Text.Add("The scepter is gone somewhere, most likely broken and shattered against one of the walls. ", parse);
	Text.Add("<i>“Please, stop this father!”</i> she cries out, begging him.", parse);
	Text.NL();
	Text.Add("Against all odds, her plea seems to be working. Lagon pauses for a moment, a vague look of recognition in his eyes as he looks down on his daughter; a mere ant in front of a hulking giant. He leans down and picks her up in one huge paw, effortlessly lifting the squirming alchemist off the ground.", parse);
	Text.NL();
	Text.Add("<i>“Oph-elia.”</i> The name rings oddly, as if the brute is trying to remember how to form words. A wide, malicious grin spreads on Lagon’s face. For good or ill, the king’s rage has subsided for the moment. <i>“Bring… bitch.”</i> He drops her, and she falls to the ground with a loud thump. Slowly, Ophelia makes her way over to you, her spirit defeated.", parse);
	Text.NL();
	Text.Add("<i>“Please come… we must do as he tells us, or he’ll kill everyone,”</i> she urges you. She’s right. You know from experience just how quickly the beast can move; there’s no use trying to escape.", parse);
	Text.NL();
	Text.Add("Lagon is trying to sit down on his throne as you and Ophelia crawl to his feet, but it ill fits his new frame. He tries to break of the arms of the seat, but it ends up just being uncomfortable. Shrugging, the king kicks the scraps of the chair crashing into a wall. He flops down on the ground, resting on his mound of treasure. When he notices you and Ophelia, he motions you to come to his side.", parse);
	Text.NL();
	Text.Add("It quickly becomes apparent for what reason he’s called you; as you snuggle into the king’s fur, you share a look with Ophelia, only for your view to be blocked as Lagon’s titanic member slowly rises to full erection. Without hesitation, the alchemist leans down and starts caressing the king’s massive balls, which leaves the shaft to you.", parse);
	Text.NL();
	Text.Add("Your hands are trembling as they grasp the massive flesh pillar. Even for his size, Lagon’s cock is of impressive proportions, rising at least four feet from his crotch. The bulbous tip sways far above your head, huge droplets of pre splashing down on you and Ophelia. Fearfully, you trace the veins of the gargantuan shaft, caressing it from top to bottom.", parse);
	Text.NL();
	Text.Add("Lagon grunts appreciatively as you and Ophelia grind your bodies against his member. You can only hope he won’t actually try to use it on you - Vena is probably the only one that could take him as he is now. Either way, your combined efforts seem to bear fruit, as more pre continues to stream down the rigid monolith.", parse);
	Text.NL();
	Text.Add("Both you and Ophelia yelp in surprise as Lagon shifts his weight, getting up on his feet. You scramble to keep your hold on the colossal shaft, ending up hanging underneath it while Ophelia is perched on top of it. There’s little time to try to change your position before the king thrusts forward, trapping you between the floor and fifty inches of thick bunny cock. The alchemist presses her thighs against your side and leans down to kiss you, your bodies forming a tight cavern of flesh that the giant brute can use.", parse);
	Text.NL();
	Text.Add("Lagon’s thrusts grow quicker and quicker as he slides his massive member between your bodies, groaning as he unloads into the cocksleeve formed by his former enemies. The first stream of ejaculate hits you below the chin almost hard enough to knock you out. The following jets sail by just an inch above your face, the tail end of each blast leaving a thick rope of semen plastered across your face. By the time he’s finished both you and Ophelia are drenched in his cum, panting and gasping for breath.", parse);
	Text.NL();
	Text.Add("<i>“T-the Pit,”</i> Ophelia gasps. <i>“We must take him there before he needs to go again.”</i>", parse);
	Text.NL();
	Text.Add("Somehow, the two of you are able to coax the huge beast along with you, though he won’t let you escape from his reach. You move quickly, as both of you are aware of his slowly rising dick, and what he’ll demand of you when he’s ready to go again. As soon as he sees Vena, he discards Ophelia and throws himself at his mate with a lusty roar, dragging you along for the ride.", parse);
	Text.NL();
	Text.Add("Even the lagomorph matriarch gasps when Lagon impales her, her body straining to accommodate his girth. His cock dwarfs even Vena’s, and if she weren’t heavily pregnant, she’d probably have a giant bulge on her stomach. Not forgetting about you, the lagomorph king puts you on top of the matriarch, letting you care for her male parts.", parse);
	Text.NL();
	Text.Add("Time blurs as your life devolves into the fiery passion of body grinding against body. Lagon’s rage seem to have abated now that he’s satisfied, replaced by some of his former intelligence. Enough, at least, to never leave you unattended so that you can escape. You have what feels like countless lovers, often many at the same time, before the king returns to you again, feeding you a number of potions and giving you a shower of jizz.", parse);
	Text.NL();
	Text.Add("After that, things become even more fuzzy as the drugs begin to set in...", parse);
	Text.NL();
	Text.Add("Time passes…", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		world.TimeStep({season : 1});
		party.location = world.loc.Plains.Burrows.Pit;
		
		Text.Clear();
		Text.Add("At first, your new body could barely even take Vena, but the more drugs the bunnies feed you, the easier it becomes, until one day, your master is finally able to fuck you. You cry in pleasure as Lagon’s enormous shafts drills into your flexible pussy, your belly swollen from the numerous loads he’s graced you with.", parse);
		Text.NL();
		Text.Add("This is your life now. Before, there was something else… some grander purpose. You shake your head in lust-addled confusion. What purpose could be higher than this? To care for the king, to be his personal fuck-toy and breeding bitch? Already, you’ve birthed more strong soldiers for Lagon’s armies than you can count, each one quickly growing into a powerful young buck or doe.", parse);
		Text.NL();
		Text.Add("Here, beside your sisters Ophelia and Vena, you are needed.", parse);
		Text.Flush();
		
		SetGameOverButton();
	});
}

Scenes.Lagon.ReturnToBurrowsAfterFight = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Remembering how your last encounter with the lagomorph king ended, you pause at the cusp of entering the tunnel. You most likely have a fight on your hands if you proceed. Are you ready for this?", parse);
	Text.Flush();
	
	//[Enter][Leave]
	var options = new Array();
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("No… not yet.", parse);
			Text.NL();
			Text.Add("While it’s true that Lagon isn’t likely to be a major threat anytime soon, Ophelia is still in there. You wonder how she’s faring; hopefully she’s been able to stay out of trouble so far.", parse);
			if(ophelia.CountdownExpired())
				Text.Add(" It’s been a rather long time though...", parse);
			Text.Flush();
			
			world.TimeStep({minute: 5});
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You’re not ready quite yet. Lagon isn’t going anywhere."
	});
	options.push({ nameStr : "Enter",
		func : function() {
			Text.Clear();
			var toolate = ophelia.CountdownExpired();
			
			parse["comp"] = party.Num() == 2 ? party.Get(1).name :
			                party.Num() >  2 ? "your companions" : "";
			parse["c"] = party.Num() > 1 ? Text.Parse(" look at [comp] and", parse) : "";
			Text.Add("Resolute, you[c] stride into the Burrows, expecting the worst. Best be on your guard from this moment on.", parse);
			Text.NL();
			Text.Add("You meet relatively few bunnies on your way in, and those you meet scurry out of your way as soon as they see you. The tunnels reek of fear, making your heart sink further. Figuring your first order of business is to locate Ophelia, you make for her lab.", parse);
			Text.NL();
			if(toolate)
				Text.Add("It looks even worse than you first feared. The place has been sacked, crushed flasks and jars aplenty, and not a living soul around - even her usual test subjects have deserted. It doesn’t look like anyone has been here for quite a while.", parse);
			else
				Text.Add("You’re out of luck though, as the alchemist is not in here. It looks like someone has been rummaging through her stuff in a haste, and her notes are strewn all over the place. A few of her test subjects raise their heads hopefully, but look disappointed that you are not their mistress.", parse);
			Text.Add(" Troubled, you make your way back into the tunnel, only to find the path outside blocked by a wall of armed and rather serious looking bunnies. Those are probably Lagon’s elite guards… either way, they don’t seem to want to attack you immediately, merely herd you in the direction of the throne room.", parse);
			Text.NL();
			Text.Add("Well, that is what you came here for, isn’t it? Keeping a close eye on your ‘escort’, you trek deeper into the underground kingdom, muscles tense. Before long, you reach Lagon’s high seat, and the lagomorph tyrant himself. There are more guards lining the walls of the throne room than when you last visited it, though the regular civilian slut detail is also present.", parse);
			Text.NL();
			if(toolate) {
				Text.Add("Lagon is lounging in his chair, looking rather bored. His expression quickly changes as you enter the hall, and he springs up to greet you, a malicious smile playing on his lips.", parse);
				Text.NL();
				Text.Add("<i>“Ah, the prodigious traitor finally returns,”</i> the rabbit king smirks, spreading his arms invitingly. <i>“If nothing else, you have balls for coming back here, considering how last we parted.”</i> He turns around. <i>“Daughter, aren’t you happy? Soon, your old conspirator will join you in your duties. Familiar faces sure are comforting, are they not?”</i>", parse);
				Text.NL();
				Text.Add("Your heart sinks as you notice Ophelia, chained to the foot of the throne. Of her labcoat, there’s little more than rags left, and her fur is unkempt and soaked with cum. The look of despair on her face deals you another blow to the gut… the alchemist has not had a pleasant time while you were away. You can still see a spark of rebellion flash in her eyes as they meet yours, though it is but a weak flicker.", parse);
				Text.NL();
				Text.Add("Lagon is oblivious to what passed between you, but he’s not about to pass up on a moment to gloat over someone else’s misfortune. <i>“I was rather… vexed, when we last parted. My dear daughter has been oh so helpful in relieving my stress… she’s truly a diligent little slut.”</i> He cracks his knuckles.", parse);
			}
			else {
				Text.Add("Lagon is in the middle of some kind of audience as you walk in. Before him on her knees sits Ophelia, two guards flanking her. The king gives you a wide grin as you approach.", parse);
				Text.NL();
				Text.Add("<i>“Ah, and here we have our other rat, just in time! I was just about to punish my wayward daughter for her rebellion, and in walks its ringleader!”</i>", parse);
				Text.NL();
				Text.Add("<i>“[playername]!”</i> Ophelia gasps. <i>“Did they get you too?”</i> She looks confused as you shake your head resolutely.", parse);
				Text.NL();
				Text.Add("Lagon casually gives his daughter a backhanded slap, violently throwing her to the ground. Unconcerned, he continues to address you as if she never spoke. <i>“Tell me, what is the occasion? Or did you merely want to save me the trouble of hunting you down? Why not make this easy for yourself and give in… once I’m finished with you, the Pit awaits, and all your worries will fade away into endless bliss.”</i>", parse);
			}
			Text.NL();
			Text.Add("In a huge leap, Lagon launches himself into the air, coming down to rest on his throne. <i>“I can tell that you don’t think you’re here to bend the knee… but bend it shall. Bend or break.”</i> At a wave of his hand, the elite guard closes up around you, weapons at the ready.", parse);
			Text.NL();
			Text.Add("<i>“As you will both learn, however, I’m not an impossible master, nor am I unnecessarily cruel. I simply reward obedience… and punish treachery. A king must be resolute in these things, yes?”</i>", parse);
			Text.NL();
			Text.Add("It’s a fight!", parse);
			Text.Flush();
			
			world.TimeStep({minute: 30});
			
			Gui.NextPrompt(function() {
				Scenes.Lagon.Usurp(toolate);
			});
		}, enabled : true,
		tooltip : "The time has come to face off against this so called king."
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Lagon.ReturnToBurrowsAfterScepter = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Once you enter the Burrows, you’re not likely to leave until this whole business has concluded, one way or the other… are you ready for this?", parse);
	Text.Flush();
	
	//[Enter][Leave]
	var options = new Array();
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("You can’t be quite sure what’ll face you inside… if Lagon’s caught whiff of who sent you looking for the scepter, and why, there’s bound to be trouble.", parse);
			Text.NL();
			Text.Add("You decide on postponing your visit for now.", parse);
			Text.Flush();
			
			world.TimeStep({minute: 5});
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You need some more time to prepare… Lagon isn’t going anywhere."
	});
	options.push({ nameStr : "Enter",
		func : function() {
			Text.Clear();
			party.location = world.loc.Burrows.Throne;
			Text.Add("Steeling yourself, you head into the dark and dank underground. It’s unusually quiet in the tunnels, and the few bunnies you meet scurry out of sight before you can get close. At one point, you see group of heavily armed bunnies running down a side tunnel. These aren’t the usual horny and uncoordinated rabbits that fill this place; these look like Lagon’s personal guard, and they’re searching for something.", parse);
			Text.NL();
			Text.Add("<i>“Quickly, over here!”</i> you hear someone whisper from a smaller opening in the side of the tunnel. Ophelia peeks her head out, looking anxious as she waves you in. <i>“Do you have it?”</i> she keeps her voice low, but it’s strained with urgency. Relief floods her face when you nod. <i>“Father’s men… they are looking for me. We need to get to my mother as fast as we can, before they catch us!”</i>", parse);
			Text.NL();
			Text.Add("Not waiting for your reply, she drags you along, dashing from cover to cover. <i>“Shit!”</i> she mutters. Peeking around her, you see that the way ahead is blocked and guarded by a dozen soldier bunnies. <i>“We can’t go through here, but I know another way.”</i> This venture, too, proves short lived, as the way back is blocked by another patrol hurrying your way.", parse);
			Text.NL();
			Text.Add("<i>“They are herding us!”</i> Ophelia growls anxiously, pulling you down another side passage. She’s right; you’re no expert at navigating these mad tunnels, but you seem to be steadily pushed away from the Pit and towards the throne room. Then again, perhaps this is for the best.", parse);
			Text.NL();
			Text.Add("<i>“Y-you can’t face him alone, you can’t!”</i> Ophelia begs you, pulling on your arm.", parse);
			Text.NL();
			if(party.Num() > 1) {
				parse["c"] = party.Num() > 2 ? "your companions are" : party.Get(1).name + " is";
				Text.Add("You tell her that you’re not alone; [c] by your side.", parse);
			}
			else
				Text.Add("You’ll be fine, you assure her. After beating up the Gol, Lagon shouldn’t be any problems.", parse);
			Text.Add(" The alchemist doesn’t look convinced, but you have little choice but to continue heading toward the throne room.", parse);
			Text.NL();
			Text.Add("<i>“Ah, here we have the both of you,”</i> Lagon greets you as you enter the hall, lounging idly on his throne. <i>“The diligent traveller… and the rebellious daughter. Just what have you two been up to?”</i> He looks like he’s enjoying watching Ophelia squirm. Finally, the smaller bunny gathers her courage.", parse);
			Text.NL();
			Text.Add("<i>“This can’t go on father, what you are doing to mother! [playername] has been helping me… With the scepter, we can restore her, bring her back to like she was in the old days!”</i> Lagon’s eyes darken, and the alchemist falters.", parse);
			Text.NL();
			Text.Add("<i>“Have you perhaps forgot <b>why</b> Vena is the way she is?”</i> the king counters. <i>“She too wished to rebel against me… wasn’t it a nice twist of fate that it was you who provided the means for her to continue serving me as a loyal breeding slut… Ophelia, your mother is happy where she is. Would you take that away by introducing meaningless strife in my kingdom once more?”</i>", parse);
			Text.NL();
			Text.Add("<i>“Y-you… evil!”</i> Ophelia gasps, tears in her eyes. Gulping, she steels herself. <i>“I was right after all… I had hoped that you might… but no. There is only one way to end this. You have to be put down.”</i>", parse);
			Text.NL();
			Text.Add("For a moment, it’s as if Lagon hasn’t even heard her. So inconceivable are the words that come out of her mouth. <i>“And you, traveller?”</i> he turns your way. <i>“Where do you stand in all this? Are you too caught up in this foolishness, or are you willing to listen to reason?”</i>", parse);
			Text.NL();
			Text.Add("What reason?", parse);
			Text.NL();
			Text.Add("<i>“You have been a good servant… aye, my plans have progressed much quicker than anticipated thanks to your actions.”</i> The lagomorph king leans back into his seat, yawning. <i>“You have no clue on who you are dealing with if you step in here and think you have even the faintest glimmer of a chance defeating me. Why not continue working with me instead?”</i>", parse);
			Text.NL();
			Text.Add("<i>“Don’t listen to him!”</i> Ophelia pleads, eyes shifting anxiously between the two of you.", parse);
			Text.NL();
			Text.Add("<i>“Great riches await you if you choose this path…”</i> a grin plays across Lagon lips. <i>“I’ll even let you keep my daughter here as a pet. Just hand me the scepter and lay down your arms, and I’ll forgive you just this once.”</i>", parse);
			Text.Flush();
			
			//[Oppose][Stand down]
			var options = new Array();
			options.push({ nameStr : "Oppose",
				func : function() {
					Text.Clear();
					Text.Add("No, it’s not going to be that easy. You stand by Ophelia, and the king can take his offers and stuff them. You’ve had enough of his bullshit.", parse);
					Text.NL();
					Text.Add("<i>“I was willing to let bygones be bygones,”</i> Lagon sighs, shaking his head. <i>“Some harsh words were raised, perhaps you could have gotten out of it by begging my forgiveness. Or offering yourself as my grateful cock-sleeve. Alas, such rebellious war-mongers have to be put to task for their transgressions.”</i>", parse);
					Text.NL();
					Text.Add("Fuck you!", parse);
					Text.NL();
					parse["comp"] = party.Num() == 2 ? party.Get(1).name :
					                party.Num() >  2 ? "your companions" : "";
					parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
					Text.Add("<i>“Guards, put this pitiful display of misplaced chivalry to rest.”</i> The king leans back in his throne. <i>“The one that takes the traveller down will get sloppy seconds.”</i> The guards close in on you[c], weapons raised.", parse);
					Text.NL();
					Text.Add("It’s a fight!", parse);
					Text.Flush();
					
					Gui.NextPrompt(Scenes.Lagon.Usurp);
				}, enabled : true,
				tooltip : "Fuck that. Lagon is a treacherous snake, you very much doubt that he’d keep such promises… not to mention his sinister agenda."
			});
			options.push({ nameStr : "Stand down",
				func : function() {
					Text.Clear();
					Text.Add("Ophelia can hardly believe her eyes as you walk over to Lagon and hand over the scepter.", parse);
					if(party.InParty(kiakai)) {
						Text.Add(" Neither can your elven companion, who looks at you with stunned disbelief.", parse);
						kiakai.relation.DecreaseStat(-100, 10);
					}
					Text.NL();
					Text.Add("<i>“There, that wasn’t so hard, was it?”</i> the king drawls, accepting the gift. <i>“As for you,”</i> he addresses his daughter, <i>“your disobedience must be punished. I promised to turn you over to [playername]... but first, reparations must be made. Down on your knees, daughter. I have a farewell gift for you.”</i> He slowly gets up from his seat, his heavy cock dangling down between his knees.", parse);
					Text.NL();
					Text.Add("<i>“N-no! You can’t make me!”</i> Ophelia shrieks as she scrambles backward, only to be grabbed by the guards. <i>“Traitor!”</i> she screams. <i>“I trusted you, and you do this?!”</i>", parse);
					Text.NL();
					Text.Add("<i>“Bring her here.”</i> Lagon motions for the guards to drag his struggling daughter to him, a victorious grin on his face… but things aren’t meant to be that easy.", parse);
					Text.NL();
					Text.Add("In a fierce burst of strength, Ophelia pulls one of her arms free for just a second, enough for her to reach into her bodice and fish out a potions. In a last desperate effort, she downs the flask, body convulsing as the transformative takes effect.", parse);
					Text.NL();
					Text.Add("<i>“Restrain her!”</i> Lagon snaps, but it’s already too late. The alchemist’s body is rapidly growing, muscles bulging and bones cracking until she’s more than twice her regular size. Her labcoat stretches way past its limits, ripping into tiny shreds. With a great roar, the amazonian lagomorph throws off the guards as easily as if they were dolls. She looks this way and that, her crazed eyes finally falling on you.", parse);
					Text.NL();
					Text.Add("<i>“I’d say that your first order of business as my agent should be to take care of this mess,”</i> Lagon suggests, languidly returning to his throne. <i>“Now, entertain me!”</i>", parse);
					Text.NL();
					Text.Add("You ready yourself for combat as the furious she-brute bounds towards you.", parse);
					Text.NL();
					Text.Add("It’s a fight!", parse);
					Text.Flush();
					
					Gui.NextPrompt(Scenes.Lagon.OpheliaFight);
				}, enabled : true,
				tooltip : "This damn fetch-quest has gone on for too long… time you get a real reward. And if you can get it without even having to fight anyone… why not? Besides, taking Ophelia away from this place is probably the best she could ever hope for."
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true,
		tooltip : "You’re ready."
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Lagon.Usurp = function(toolate) {
	var parse = {
		
	};
	
	var enemy = new Party();
	var lagonMob = new LagonRegular(true);
	enemy.AddMember(lagonMob);
	enemy.AddMember(new LagomorphBrute());
	enemy.AddMember(new LagomorphWizard());
	enemy.AddMember(new LagomorphElite());
	var enc = new Encounter(enemy);
	enc.toolate = toolate;
	
	enc.canRun = false;
	enc.VictoryCondition = function() {
		return lagonMob.Incapacitated();
	}
	
	enc.onLoss    = Scenes.Lagon.LossToRegularLagon;
	enc.onVictory = Scenes.Lagon.WinToRegularLagon;
	
	enc.Start();
}

Scenes.Lagon.LossToRegularLagon = function() {
	SetGameState(GameState.Event);
	
	var enc = this;
	var toolate = enc.toolate;
	var scepter = party.Inv().QueryNum(Items.Quest.Scepter);
	
	var parse = {
		tongue : function() { return player.TongueDesc(); },
		breasts : function() { return player.FirstBreastRow().Short(); }
	};
	
	Text.Clear();
	Text.Add("<i>“Pathetic and predictable,”</i> Lagon yawns as you drop to the ground, shaking with exhaustion. He’s just too strong… perhaps you should never have stood up to him.", parse);
	Text.NL();
	if(toolate) {
		parse["HeShe"]  = player.mfFem("He", "She");
		parse["hisher"] = player.mfFem("his", "her");
		Text.Add("<i>“Bring the traveller over here, and remove [hisher] clothes,”</i> Lagon gestures to his guards. <i>“[HeShe] won’t be needing them any longer.”</i>", parse);
	}
	else {
		Text.Add("<i>“Bring my daughter over here too… and remove her clothes,”</i> Lagon gestures to his guards. <i>“She won’t be needing them any longer. Nor will you, traveller.”</i>", parse);
	}
	if(scepter)
		Text.Add(" With a sneer, the rabbit king adds: <i>“Oh, and bring me that scepter.”</i>", parse);
	Text.Add(" The honor guard makes short work of your equipment before they drag you before the throne.", parse);
	Text.NL();
	Text.Add("<i>“Do you see now, daughter? Your actions have brought even more pain and distress to those you hold dear. Don’t you feel the weight of your choices?”</i> Ophelia lowers her head, tears streaming down her face as she nods. <i>“And if I told you there was a way to relieve yourself of this burden, would take it?”</i> Lagon’s eyes burn with malicious fire as he regards the fallen alchemist.", parse);
	Text.NL();
	Text.Add("<i>“A-anything!”</i> she sobs, looking up hopefully. <i>“Anything to relieve this pain!”</i>", parse);
	Text.NL();
	Text.Add("<i>“Give in, daughter. Drop your foolish rebellion, your precious experiments. Relinquish your free will.”</i> The lagomorph king caresses Ophelia’s hair affectionately. <i>“After all, if you have no free will nor choices, no one can blame you for the outcome of your actions. And with this,”</i> Lagon flourishes a bottle from the pile beside the throne, <i>“you will not even remember your painful past.”</i>", parse);
	Text.NL();
	Text.Add("Ophelia’s chest falls as she sees the flask. <i>“Yes,”</i> the king continues. <i>“This is the very draught you brewed for you mother, so long ago. Drink and let all your cares drift away.”</i>", parse);
	Text.NL();
	Text.Add("The alchemist gives you one last look before accepting the potion, and it tells you everything. Deep sorrow, anguished defeat, a broken pride and a small twinge of disappointment, any hope you instilled her with utterly crushed. She averts her eyes and dutifully gulps up the concoction, stepping down from her old role and embracing her new. While there aren’t any physical changes that you can see - perhaps a widening of the hips, a swelling of the breasts - when her expression changes to one of blissful lust, the effects of the potion are clear.", parse);
	Text.NL();
	parse["comp"] = party.Num() == 2 ? party.Get(1).name :
	                party.Num() >  2 ? "your companions" : "";
	parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	Text.Add("<i>“And now, I must deal with you,”</i> Lagon says as he turns his attention to you[c], ignoring his daughter who’s happily snuggling his leg. <i>“The prodigal traveller turned traitor. I’ll offer you the same out as I gave Ophelia… but first, you need to taste true defeat.”</i> Almost purring, he motions you closer: <i>“Approach, my slut.”</i>", parse);
	Text.NL();
	Text.Add("Your mind rebels, but your body moves against your wishes, not wishing to incur his wrath. Joining Ophelia at the foot of the throne, you copy her actions, caressing the king’s feet, his legs, his thighs, licking his fur subserviently. ", parse);
	if(player.SubDom() >= 30)
		Text.Add("Only, unlike her, you can still feel the shame burning deep in your chest.", parse);
	else if(player.SubDom() >= -30)
		Text.Add("It is demeaning, but you fear this is only the start of it.", parse);
	else
		Text.Add("It comes naturally to you, but it’s still piteous for your rebellion against your master to end this way.", parse);
	Text.NL();
	Text.Add("<i>“You’ll have to do better than that,”</i> Lagon urges, though a shiver runs through his hardening cock… that big, juicy cock… Ophelia is the first one to lean forward and suckle the giant shaft, letting her tongue play along its length, but you know you can’t be idle for long. Besides, the rabbit king has a <i>lot</i> of cock, plenty for the both of you. You add your [tongue] to the mix, obediently worshipping the stiffening member.", parse);
	if(party.Num() > 1) {
		parse["isAre"] = party.Num() > 1 ? "are" : "is";
		Text.Add(" Behind you, the moans indicate that [comp] [isAre] similarly occupied with Lagon’s guards. But you can’t let that distract you.", parse);
	}
	Text.NL();
	Text.Add("<i>“Go on, daughter,”</i> Lagon encourages Ophelia. Without hesitation, the former alchemist wraps her lips around the king’s colossal rod, managing to swallow at least half of it before her protesting jaws meet resistance. The bunny’s paws are busy between her legs, and her eyes  are almost closed, her expression euphoric. She diligently soldiers on in polishing her father’s dick, but is finally forced to withdraw.", parse);
	Text.NL();
	if(player.SubDom() > 0) {
		Text.Add("<i>“Well?”</i> The king looks down on you. <i>“This isn’t the time to be prudish, little slut. Follow my daughter’s example, and you too may receive the same pleasure as she...”</i>", parse);
		Text.NL();
		Text.Add("Something fundamental clicks in your head… a shift in attitude as you surrender completely to the powerful lagomorph. There’s no use resisting anymore… that will only bring more punishment. You obediently take Ophelia’s place, sucking on the magnificent cock. Lagon is no idle participant either; he takes perverse pleasure in jolting his hips forward just when you’re not expecting it, teasing your limits.", parse);
		Text.NL();
		Text.Add("<i>“Good little slut,”</i> he praises you.", parse);
	}
	else {
		Text.Add("Knowing what’s expected of you, you take her place, almost gagging when the rabbit king idly shifts in his seat, shoving another five inches down your ambushed gullet. <i>“Not bad,”</i> Lagon comments, holding your head in place as he feeds you another three inches. <i>“Perhaps you don’t need the potion after all; you’re such a willing slut even without it.”</i>", parse);
	}
	Text.NL();
	
	Sex.Blowjob(player, lagon);
	player.FuckOral(player.Mouth(), lagon.FirstCock(), 2);
	lagon.Fuck(lagon.FirstCock(), 2);
	
	Text.Add("You do your best to service your king, but he soon grows bored of your efforts. Without warning, Lagon jumps to his feet, taking a firm grasp of your head. You’re powerless to do anything but take it as he starts to thrust, gaining in speed until the movements of his hips are a blur.", parse);
	Text.NL();
	Text.Add("<i>“Your first reward,”</i> the powerful alpha grunts, the meaning of his words quickly becoming clear as thick jets of bunny cum surge down your throat. You even get a taste of the lovely liquid as he pulls out, the final bursts landing on your tongue and splattering all over your face and [breasts]. Not wishing to be let out, Ophelia meticulously cleans Lagon’s cock, and when there’s no more seed to find there, she proceeds to lap up whatever was left on you. Leaning back into her kisses, you caress her breasts, coaxing throaty moans from the king’s daughter.", parse);
	Text.NL();
	Text.Add("<i>“A good start on your journey of redemption,”</i> your master praises you, an unexpected smile spreading on your lips as he pats your head. ", parse);
	if(scepter)
		Text.Add("If your mind hadn’t been filled by such serene warmth, you might have paid closer attention to the scepter that Lagon idly holds… it doesn’t seem important now, however. ", parse);
	Text.Add("<i>“But I’m sure you can do better...”</i> Urged by his encouraging voice, you hurriedly promise that you will do your utmost to serve him.", parse);
	Text.NL();
	Text.Add("Smiling, Lagon invites you to take a seat on his glistening cock…", parse);
	Text.NL();
	parse["c"] = party.Num() > 1 ? Text.Parse(", [comp]", parse) : "";
	Text.Add("Sensory impressions blur and fade together as the lagomorph king uses you[c] and his daughter. Countless times, he and his guards spend their seed in you, and each time you do, you lose a little more of yourself. When he finally offers you the potion he gave Ophelia, you take it willingly, and after that, you experience only bliss.", parse);
	Text.NL();
	Text.Add("Time passes...", parse);
	Text.Flush();
	
	Gui.NextPrompt(Scenes.Lagon.BadendPit);
}

Scenes.Lagon.WinToRegularLagon = function() {
	SetGameState(GameState.Event);
	
	var enc = this;
	var toolate = enc.toolate;
	var scepter = party.Inv().QueryNum(Items.Quest.Scepter);
	
	var parse = {
		
	};
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("There’s an incredulous look on Lagon’s face as he stumbles back on his throne. <i>“Worm!”</i> he screams, trying to regain his footing. <i>“Don’t think that this is the end; I was willing to let you off easy, but for this, I’ll <b>fucking murder you!</b>”</i> The lagomorph king scrambles for something in the pile of treasure surrounding his throne, coming back up with a triumphant look on his face.", parse);
		Text.NL();
		Text.Add("<i>“Hah… this was the most useful of your discoveries, my dear daughter,”</i> he gasps, wielding a potion in one of his paws. <i>“The rest of your garbage you can keep, but with this, I achieve ultimate power!”</i> With that, Lagon downs the flask in one fell swoop, his body convulsing as the transformation begins.", parse);
		Text.NL();
		Text.Add("Even the royal guards take a fearful step backwards as their king transforms into a hulking giant; a muscular monster that make the brutes of his army look like school children. A raging fire burns in the mutant’s eyes; seeking nothing but the destruction of all his enemies. Between his legs flops a dick the size of a tree trunk, supported by balls the size of coconuts.", parse);
		Text.NL();
		if(scepter) {
			Text.Add("<i>“Hand me the scepter, quickly!”</i> Ophelia yells. <i>“I’ll try to figure out how it works, perhaps it can help to subdue him!”</i> You toss her the rod, your eyes never leaving the beast.", parse);
			Text.NL();
		}
		Text.Add("With a wordless cry, the monster springs toward you, sweeping his own guards out of the way as if they were mere motes of dust. You barely have time to brace yourself before the enraged king throws himself at you.", parse);
		Text.NL();
		Text.Add("It’s a fight!", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			var enemy = new Party();
			enemy.AddMember(new LagonBrute(scepter));
			var enc = new Encounter(enemy);
			
			enc.canRun = false;
			
			enc.onLoss    = Scenes.Lagon.BadendBrute;
			enc.onVictory = Scenes.Lagon.WinToBruteLagon;
			
			enc.Start();
		});
	});
	Encounter.prototype.onVictory.call(enc);
}

Scenes.Lagon.WinToBruteLagon = function() {
	SetGameState(GameState.Event);
	
	var enc = this;
	var toolate = enc.toolate;
	var scepter = party.Inv().QueryNum(Items.Quest.Scepter);
	
	var parse = {
		playername : player.name
	};
	
	lagon.flags["Usurp"] |= Lagon.Usurp.Defeated;
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Stunned by your strength, the brute topples backward, falling like a giant tree. There is a moment of absolute silence after the lagomorph king hits the ground; everyone is frozen in time, not daring to move a muscle. Ophelia is the first one to spring to action, leaping past her father and quickly gathering a number of potions from Lagon’s stash.", parse);
		if(scepter) {
			Text.Add(" She tosses you the scepter.", parse);
			Text.NL();
			Text.Add("<i>“It won’t work against just anyone, but father’s been touched by its power before,”</i> she explains. <i>“Hold it just like that and press it to his temple, it should subdue him long enough for me to neutralize him.”</i>", parse);
			Text.NL();
			Text.Add("It’s a curious feeling… almost as if you’re sharing a mind with the lagomorph king. It’s a tangle of dark rage, looking somewhat like a nest of angry snakes writhing together, though it is surprisingly small. Resolutely, you press it down with a mental palm, keeping it in place. Lagon stops struggling.", parse);
		}
		else {
			Text.NL();
			Text.Add("<i>“Hold him down for a while. I’m going to subdue him,”</i> the alchemist promises.", parse);
		}
		Text.NL();
		Text.Add("Hurrying to your side, Ophelia quickly feeds her father one of the potions before any of the guards can gather themselves to stop her. They still seem shocked by their king’s transformation and sudden drop into madness. After some consideration, the alchemist feeds him two more, just for good measure.", parse);
		Text.NL();
		Text.Add("This time, the transformation isn’t as rapid as before. Bit by bit, Lagon shrinks down to his old size, his muscles withering until he’s even smaller than he was to begin with. <i>“I had to be sure he couldn’t get away,”</i> Ophelia explains. She leans back and gives out a ragged sigh. <i>“It’s finally over, isn’t it?”</i>", parse);
		Text.NL();
		Text.Add("You nod, giving her a pat on the shoulder.", parse);
		Text.NL();
		Text.Add("<i>“T-thank you, [playername],”</i> she blushes, leaning against you. <i>“What you did… I didn’t think it possible.”</i> As you are talking, one of the royal guards carefully makes his way over to you, stopping when you notice him. The bunny has discarded his weapon, and holds a non-threatening stance.", parse);
		Text.NL();
		Text.Add("<i>“Queen,”</i> he simply says, going down to one knee in front of Ophelia. <i>“Queen. Queen. Queen,”</i> the others echo, until the hall is ringing with their call. They quieten down when the alchemist unsteadily gets to her feet, a resolute look on her face.", parse);
		Text.NL();
		Text.Add("<i>“I’m not strong like my father, and my crimes number as many as his,”</i> she starts, her voice growing more confident as she goes on. <i>“I cannot lead you, but I can guide you until there is someone who can.”</i> She turns to you.", parse);
		Text.NL();
		
		ophelia.relation.IncreaseStat(100, 25);
		
		parse["pheshe"] = player.mfFem("he", "she");
		if(scepter) {
			Text.Add("<i>“This is all thanks to [playername]... not only that, [pheshe] carries the instrument of our salvation!”</i> The alchemist’s gaze borders on worshipful, and she invites you to join her and stand by her side.", parse);
			Text.NL();
			Text.Add("<i>“With this scepter, we can restore my mother, the matriarch Vena, to her old self!”</i> she cries out, getting a resounding cheer from the audience.", parse);
			Text.NL();
			Text.Add("<i>“Will you come with us now?”</i> she asks as she turns to you. <i>“The procedure should be quick, but the Burrows need her now.”</i>", parse);
			Text.NL();
			Text.Add("You nod, and the two of you set out for the Pit, followed by the cheering honor guard. Lagon, still unconscious and affected by your mental touch, is chained to a wall and left under a strict watch.", parse);
			Text.NL();
			
			Scenes.Vena.RestoreEntrypoint(true);
		}
		else {
			Text.Add("<i>“None of this would have been possible if not for [playername], [pheshe] deserves more praise than I.”</i> Ophelia hugs you tightly, her voice filled with adoration. When the cheers have quieted down, she turns to you.", parse);
			Text.NL();
			Text.Add("<i>“Do you think we could ask one final favor of you?”</i> she asks, her eyes lowered. <i>“The scepter that I spoke of before; the one my brother took when he left. With it, I’m certain that I could restore my mother’s mind, and everything could finally be right again. I know it’s much to ask, but… please.”</i>", parse);
			Text.NL();
			Text.Add("You tell her that if you find the scepter, you’ll bring it back here. Still, there are no guarantees. <i>“Thank you,”</i> she whispers.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("Lagon, now reduced to a shadow of his former self, is chained to a wall in the throne room. He’ll await justice there until Vena stands judgement over him. Ophelia hints that you also have a say in this, since if it weren’t for you, he’d still be on the throne. Time enough to worry about that later.", parse);
				Text.NL();
				Text.Add("<i>“I really cannot thank you enough,”</i> Ophelia bows her head again. <i>“Without you… if there’s <b>anything</b> you need at all, we are at your service.”</i> Her eyes burn with a very different kind of fire as she meets yours. <i>“<b>I</b> am at your service.”</i>", parse);
				Text.NL();
				Text.Add("On her urging, you take some of the treasure that Lagon has hoarded for himself; the lagomorphs have no need for coin, she assures you.", parse);
				Text.NL();
				Text.Add("<i>“If you find the scepter, we would be forever grateful,”</i> she concludes, giving you a kiss on the cheek before hurrying off to see her mother. You should return to her once things have quietened down a bit.", parse);
				Text.Flush();
				world.TimeStep({hour: 1});
				Gui.NextPrompt();
			});
		}
	});
	
	Encounter.prototype.onVictory.call(enc);
}

Scenes.Lagon.OpheliaFight = function() {
	var enemy = new Party();
	enemy.AddMember(new OpheliaBrute());
	var enc = new Encounter(enemy);
	
	enc.canRun = false;
	
	enc.onLoss    = Scenes.Lagon.LossToOphelia;
	enc.onVictory = Scenes.Lagon.WinToOphelia;
	
	enc.Start();
}

Scenes.Lagon.LossToOphelia = function() {
	SetGameState(GameState.Event);
	var enc = this;
	
	var parse = {
		cocks : function() { return player.MultiCockDesc(); }
	};
	
	player.AddLustFraction(1);
	
	Text.Clear();
	Text.Add("<i>“Why, this is even more entertaining than I first imagined, traveller!”</i> Lagon laughs as you drop to the ground, no longer able to fight. Perceiving this new enemy, Ophelia throws herself at her father with a mighty roar.", parse);
	Text.NL();
	Text.Add("<i>“Tell me,”</i> the king continues unhurriedly as he dodges a blow from the enraged alchemist, <i>“what use are you to me if you can’t even handle my daughter?”</i> He dodges another blow, then throws a blindingly fast high kick, hitting Ophelia squarely in the jaw. As the confused brute stands there blinking, trying to figure out what just happened, Lagon lands another flurry of blows, throwing her on her back.", parse);
	Text.NL();
	Text.Add("<i>“My agent? No, I have a far more appropriate task for you, weak little traveller.”</i> The lagomorph king languidly makes his way over to the two of you as you lie gasping on the ground. He flops down on her chest, legs straddling her sides. <i>“Say aaah!”</i> he encourages her, forcing her jaw open while he pours the contents on a large flask down her throat. Bit by bit the effects of the brutish transformation are reversed, until Ophelia looks much like her old self - except now she’s nude, her old robes mere tatters.", parse);
	Text.NL();
	Text.Add("<i>“Now, this one is for you.”</i> Lagon grins maliciously as he hops over onto your chest, driving the air out of your lungs. As you gasp for air, he forces a thick and sickly sweet liquid into your mouth, and you have no choice but to swallow. <i>“Good girl,”</i> he cheers you on. ", parse);
	if(!player.FirstVag())
		Text.Add("You try to shake your head; you’re not a girl! ", parse);
	var gen = "";
	if(player.FirstCock())
		gen += ", your gushing pussy overflowing with juices";
	if(player.FirstCock() && player.FirstVag())
		gen += " and ";
	else
		gen += ", ";
	if(player.FirstVag())
		gen += "your [cocks] spewing thick cum everywhere";
	parse["gen"] = gen;
	Text.Add("Warmth spreads through your torso, through your guts, and finally into your loins. You cry out as a spike of pleasure shoots down your spine[gen].", parse);
	Text.NL();
	Text.Add("You should be resisting - gathering your strength and striking back - but the blissful ecstasy is too much! Unable to do anything but ride it out, you lie there and whimper… only to find that the pleasure does not die down.", parse);
	Text.NL();
	parse["pussy"] = player.FirstVag() ? "your pussy" : "a pussy that wasn’t there just minutes ago";
	Text.Add("<i>“A good reaction, little slut.”</i> Lagon - that was his name, right? - Lagon’s voice sounds like it’s coming from far away, but a new sensation in your loins tells you he is indeed very close. <i>“Vena was the same when I first fed her this mixture,”</i> the bunny king continues conversationally as he drives his cock deep inside [pussy]. All your worries wither and disappear as your world narrows down to the thick shaft plunging into your nethers, indescribable pleasure rushing through your veins.", parse);
	Text.NL();
	if(!player.FirstVag()) {
		Text.Add("<b>You’ve lost your virginity.</b>", parse);
		Text.NL();
	}
	Text.Add("You are dimly aware of that the king is pouring his seed into your womb… thrice? Five times? It all blends together... As for yourself, you no longer have any idea of when your orgasms begin or end. When Lagon finally withdraws, you let out a deep longing cry, bereft of your release.", parse);
	Text.NL();
	Text.Add("<i>“Worry not, my little slut,”</i> you hear a voice whisper from afar. <i>“Soon, I’ll take you to your new home, where you can do nothing but fuck for the rest of your life.”</i> That sounds wonderful… <i>“But first, I need to show my daughter the same kindness.”</i>", parse);
	Text.NL();
	Text.Add("Jealous, you watch as Lagon pounds into Ophelia. Crawling over, you massage your friend’s breasts, suckle on her nipples, kiss her passionately. How you hope that she too can be together with you forever...", parse);
	Text.Flush();
	
	Gui.NextPrompt(Scenes.Lagon.BadendPit);
}

Scenes.Lagon.WinToOphelia = function() {
	SetGameState(GameState.Event);
	var enc = this;
	
	var parse = {
		playername : player.name,
		stuttername : player.name[0] +"-"+ player.name,
		pheshe : player.mfFem("he", "she")
	};
	
	lagon.flags["Usurp"] |= Lagon.Usurp.SidedWith;
	ophelia.flags["Met"] |= Ophelia.Met.Recruited;
	ophelia.flags["Met"] |= Ophelia.Met.Broken;
	ophelia.flags["Met"] |= Ophelia.Met.InParty;
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Lagon claps as you finally subdue the she-brute. Ophelia, no longer strong enough to keep standing, falls to the ground panting. <i>“I thought she had you there for a bit,”</i> he says unconcerned, as if he didn’t care who won the fight. <i>“I suppose you may be of some use after all.”</i>", parse);
		Text.NL();
		Text.Add("The lagomorph king tosses you two potions. <i>“As promised… I’ll let you do the honors. These will make her a bit more manageable.”</i> Well, there’s no turning back now. You feed the defeated alchemist both of the draughts and wait for the effects to set in.", parse);
		Text.NL();
		Text.Add("Gradually, Ophelia shrinks down to her former size as the new potions counter the effects of the first one. That doesn’t seem to be the only thing it does, though. The alchemist lets out a throaty moan, one of her hands going between her legs, her back arching sensually. Slowly, she opens her eyes.", parse);
		Text.NL();
		Text.Add("<i>“[stuttername]?”</i> she pants. <i>“W-what happened? Why do I feel so… aah!”</i> She gasps as she hits a particularly sweet spot. Her father traces a finger down her stomach, dipping it into her dripping snatch. Ophelia cries out in pleasure as she rides out her orgasm.", parse);
		Text.NL();
		Text.Add("<i>“[playername] is your master now, slut, and you must do anything that [pheshe] says. A much more fitting role for you than your silly experiments, no?”</i> Lagon throws you a heavy bag, clinking heavily with coins. <i>“Your reward, traveller.”</i>", parse);
		Text.NL();
		Text.Add("And what now, you ask?", parse);
		Text.NL();
		Text.Add("<i>“Start by getting this slut out of my sight,”</i> Lagon prods the still recovering bunny with his foot. <i>“I have much to do here, but I’ll call for you if I need something. Actually...”</i> He studies the scepter thoughtfully. <i>“You said you got this from Roa, didn’t you?”</i>", parse);
		Text.NL();
		Text.Add("You nod.", parse);
		Text.NL();
		Text.Add("<i>“I vaguely remember him… the little sissy, wasn’t it? Since you know where he is, go fetch him for me.”</i> Lagon chuckles as he toys with the artifact. <i>“We can’t have such disobedience go unpunished, can we?”</i>", parse);
		Text.NL();
		Text.Add("With that, you’re dismissed. Ophelia is on your heels, looking around in distracted wonder and touching herself absentmindedly. <i>“Where we go now? Can we go to the Pit? Please?”</i>", parse);
		Text.NL();
		Text.Add("You are starting to understand what Lagon meant when he said that the potions would make her easier to handle...", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	});
	
	Encounter.prototype.onVictory.call(enc);
}
