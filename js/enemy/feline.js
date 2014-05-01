/*
 * 
 * Wildcat, lvl 1-2
 * 
 */

Feline = {};

Feline.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Felinix });
	if(Math.random() < 0.5)  drops.push({ it: Items.Whiskers });
	if(Math.random() < 0.5)  drops.push({ it: Items.HairBall });
	if(Math.random() < 0.5)  drops.push({ it: Items.CatClaw });
	return drops;
}

Feline.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! Meow!");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.7)
		Abilities.Attack.CastInternal(encounter, this, t);
	else if(choice < 0.9 && Abilities.Physical.Pierce.enabledCondition(encounter, this))
		Abilities.Physical.Pierce.CastInternal(encounter, this, t);
	else
		Abilities.Seduction.Tease.CastInternal(encounter, this, t);
}

Scenes.Felines = {};

function Wildcat(gender) {
	Entity.call(this);
	
	if(gender == Gender.male) {
		this.avatar.combat     = Images.wildcat_male;
		this.name              = "Wildcat";
		this.monsterName       = "the wildcat";
		this.MonsterName       = "The wildcat";
		this.body.DefMale();
	}
	else if(gender == Gender.female) {
		this.avatar.combat     = Images.wildcat_fem;
		this.name              = "Wildcat";
		this.monsterName       = "the wildcat";
		this.MonsterName       = "The wildcat";
		this.body.DefFemale();
		if(Math.random() < 0.8)
			this.FirstVag().virgin = false;
	}
	else {
		this.avatar.combat     = Images.wildcat_fem;
		this.name              = "Wildcat";
		this.monsterName       = "the wildcat";
		this.MonsterName       = "The wildcat";
		this.body.DefHerm(true);
		if(Math.random() < 0.6)
			this.FirstVag().virgin = false;
	}
	this.desc = "large wildcat";
	this.GroupName = "The wildcats";
	this.groupName = "the wildcats";
	
	this.maxHp.base        = 40;
	this.maxSp.base        = 20;
	this.maxLust.base      = 25;
	// Main stats
	this.strength.base     = 9;
	this.stamina.base      = 11;
	this.dexterity.base    = 14;
	this.intelligence.base = 11;
	this.spirit.base       = 12;
	this.libido.base       = 17;
	this.charisma.base     = 16;
	
	this.level             = 1;
	if(Math.random() > 0.8) this.level = 2;
	this.sexlevel          = 1;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 4;
	
	this.body.SetRace(Race.cat);
	this.body.SetBodyColor(Color.brown);
	this.body.SetEyeColor(Color.green);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.cat, Color.brown);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Wildcat.prototype = new Entity();
Wildcat.prototype.constructor = Wildcat;

Wildcat.prototype.DropTable = Feline.DropTable;
Wildcat.prototype.Act = Feline.Act;


// TODO
function Lion(gender) {
	Entity.call(this);
	
	this.desc = "hulking lion";
	this.GroupName = "The lions";
	this.groupName = "the lions";
	this.isLion = true;
}
Lion.prototype = new Entity();
Lion.prototype.constructor = Lion;





Scenes.Felines.Intro = function() {
	var enc     = this;
	var enemy   = enc.enemy;
	var group   = enemy.Num() > 1;
	var mainCat = enemy.Get(0);
	
	if(Math.random() > 0.5)
		enc.onEncounter = Scenes.Felines.IntroRegular;
	else
		enc.onEncounter = Scenes.Felines.IntroStalking;
	enc.onEncounter();
}

Scenes.Felines.IntroRegular = function() {
	var enc     = this;
	var enemy   = enc.enemy;
	var group   = enemy.Num() > 1;
	var mainCat = enemy.Get(0);
	
	var parse = {
		groupof    : group ? " group of" : "",
		s          : group ? "s" : "",
		notS       : group ? "" : "s",
		isAre      : group ? "are" : "is",
		itsTheir   : group ? "their" : "its",
		HeShe      : group ? "They" : mainCat.HeShe(),
		heshe      : group ? "they" : mainCat.heshe(),
		HisHer     : group ? "Their" : mainCat.HisHer(),
		hisher     : group ? "their" : mainCat.hisher(),
		m1name     : mainCat.nameDesc(),
		m1HeShe    : mainCat.HeShe(),
		m1heshe    : mainCat.heshe(),
		m1HisHer   : mainCat.HisHer(),
		m1hisher   : mainCat.hisher(),
		m1himher   : mainCat.himher(),
		bodyBodies : group ? "bodies" : "body",
		possesive  : group ? mainCat.possessivePlural() : mainCat.possessive(),
		GroupName  : mainCat.GroupName,
		groupName  : mainCat.groupName
	};
	parse["Oneof"] = group ? Text.Parse("One of [groupName]", parse) : parse["GroupName"];
	parse["selfSelves"] = party.Alone() ? "self" : "selves";
	parse["grp"] = group ? ", shifting uncomfortably as your foes spread out, trying to surround you" : "";
	
	Text.Clear();
	Text.Add("You are wandering around the area when you come across a[groupof] lounging catlike creature[s]. The feline[s] [isAre] resting languidly, [itsTheir] eyes scanning the horizon lazily before they find and fixate on you. [HeShe] slowly get[notS] on [hisher] feet, stretching and flaunting [hisher] lithe and powerful [bodyBodies] at you, [hisher] eyes never leaving their target. There is no use in trying to avoid [possesive] attention, and you prepare your[selfSelves] for combat[grp].", parse);
	Text.NL();
	Text.Add("[Oneof] flexes [m1hisher] claws menacingly, balancing on [m1hisher] hind legs, grinning as [m1hisher] tail sways playfully behind [m1himher].", parse);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>”Stepping in on my turf, are you? Wrong move!”</i> With that, [m1heshe] roars and lunges toward you.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>”Look what the cat dragged in, ladies,”</i> [m1name] purrs confidently, [m1hisher] harem’s eyes glinting hungrily as they study [youYourParty]. <i>”...Bring it to me!”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>”Just when I was getting bored!”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["bitch"] = player.mfFem("", " My Bitch.");
		Text.Add("<i>”Don’t you know I rule these lands?”</i> the majestic lion puffs out his chest proudly, mane flowing in the wind. <i>”Do you know what that makes you? My prey.[bitch]”</i>", parse);
	}, 3.0, function() { return mainCat.isLion && mainCat.Gender() == Gender.male; });
	
	scenes.Get();
	Text.Flush();
	
	// Start combat
	Gui.NextPrompt(function() {
		enc.PrepCombat();
	});
}


Scenes.Felines.IntroStalking = function() {
	var enc = this;
	var p1  = party.Get(1);
	var enemy   = enc.enemy;
	var group   = enemy.Num() > 1;
	var mainCat = enemy.Get(0);
	
	var parse = {
		playername : player.name,
		desc : mainCat.desc,
		m1name     : mainCat.nameDesc(),
		m1HeShe    : mainCat.HeShe(),
		m1heshe    : mainCat.heshe(),
		m1HisHer   : mainCat.HisHer(),
		m1hisher   : mainCat.hisher(),
		m1himher   : mainCat.himher()
	};
	
	Text.Clear();
	Text.Add("You get a sudden paranoid feeling as you walk across the plains. A quick survey of the area doesn’t reveal any immediate threats, but the feeling refuses to leave you.", parse);
	if(p1) {
		parse["name"] = p1.name;
		Text.Add(" <i>”[playername], we are being watched,”</i> [name] mutters, eyes roaming around warily.", parse);
	}
	Text.NL();
	Text.Add("A slight movement in the tall grass is the only warning you get before a [desc] springs from the undergrowth, nearly throwing you to the ground with the force of [m1hisher] pounce. You barely manage to shrug the large cat off you before [m1heshe] has a chance to bite your face off.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		parse["erRess"] = mainCat.mfTrue("er", "ress");
		Text.Add("<i>”You are nimble, my prey!”</i> the hunt[erRess] congratulates you, <i>”but don’t get comfortable, the game has only begun.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("The creature doesn’t say anything, though you can see the glimmer of intelligence in [m1hisher] predatory gaze. A rough tongue flickers over sharp teeth, making you squirm uncomfortably.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>”Why don’t you just give up like good prey?”</i> [m1name] purrs as [m1heshe] circles you. <i>”You can run, you can fight, you can give in… the end result will be the same.”</i>", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	if(group)
		Text.Add(" With a sinking heart, you spot several more shapes lurking around you. Seems like [m1heshe] doesn’t hunt alone.", parse);
	else
		Text.Add(" With that, you ready yourself for combat before [m1name] has a chance to spring on you again.", parse);
	Text.Flush();
	
	// Start combat
	Gui.NextPrompt(function() {
		enc.PrepCombat();
	});
}

Scenes.Felines.WinPrompt = function() {
	SetGameState(GameState.Event);
	
	var enc = this;
	var enemy   = enc.enemy;
	var group   = enemy.Num() > 1;
	var mainCat = enemy.Get(0);
	
	var parse = {
		oneof        : group ? " one of" : "",
		enemyEnemies : group ? "enemies" : "enemy",
		s            : group ? "s" : "",
		notS         : group ? "" : "s",
		isAre        : group ? "are" : "is",
		hisher       : group ? "their" : mainCat.hisher(),
		himher       : group ? "them" : mainCat.himher(),
		heshe        : group ? "they" : mainCat.heshe()
	};
	
	Text.Clear();
	Text.Add("Your [enemyEnemies] lie[notS] defeated, rolling over on [hisher] back[s] in submission to your authority. You consider what you are going to do with the feline[s].", parse);
	if(player.LustLevel() > 0.5)
		Text.Add(" Regardless of what your head is thinking, your body has its own ideas of what it wants you to do to your fallen foe[s], beaten and helpless as [heshe] [isAre].", parse);
	Text.Flush();
	
	var numMales   = 0;
	var numFemales = 0;
	var numHerms   = 0;
	var male       = null;
	var female     = null;
	var herm       = null;
	for(var i = 0; i < enemy.Num(); ++i) {
		var ent    = enemy.Get(i);
		var gender = ent.Gender();
		if(gender == Gender.male) {
			numMales++;
			if(male == null) male = ent;
		}
		else if(gender == Gender.female) {
			numFemales++;
			if(female == null) female = ent;
		}
		else if(gender == Gender.herm) {
			numHerms++;
			if(herm == null) herm = ent;
		}
	}
	
	var group = enemy.Num() > 1;
	
	var options = new Array();
	if(female) {
		var cocksInVag = player.CocksThatFit(mainCat.FirstVag());
		var cocksInAss = player.CocksThatFit(mainCat.Butt());
		
		if(cocksInVag.length > 0) {
			options.push({ nameStr : "Fuck vag(F)",
				func : function() {
					Scenes.Felines.WinFuckVag(female, group, enc, cocksInVag);
				}, enabled : cocksInVag,
				tooltip : "Get some pussy."
			});
		}
		if(cocksInAss.length > 0) {
			options.push({ nameStr : "Fuck ass(F)",
				func : function() {
					Scenes.Felines.WinFuckButt(female, group, enc, cocksInAss);
				}, enabled : true,
				tooltip : Text.Parse("Push[oneof] [himher] down on [hisher] back and fuck [himher] in the ass.", parse)
			});
		}
		if(player.FirstCock()) {
			options.push({ nameStr : "Get blowjob(F)",
				func : function() {
					Scenes.Felines.WinGetBlowjob(female, group, enc);
				}, enabled : true,
				tooltip : Text.Parse("Order[oneof] [himher] to give you a blowjob.", parse)
			});
		}
	}
	if(male) {
		var cocksInAss = player.CocksThatFit(mainCat.Butt());
		
		if(cocksInAss.length > 0) {
			options.push({ nameStr : "Fuck ass(M)",
				func : function() {
					Scenes.Felines.WinFuckButt(male, group, enc, cocksInAss);
				}, enabled : true,
				tooltip : Text.Parse("Push[oneof] [himher] down on [hisher] back and fuck [himher] in the ass.", parse)
			});
		}
		if(player.FirstCock()) {
			options.push({ nameStr : "Get blowjob(M)",
				func : function() {
					Scenes.Felines.WinGetBlowjob(male, group, enc);
				}, enabled : true,
				tooltip : Text.Parse("Order[oneof] [himher] to give you a blowjob.", parse)
			});
		}
	}
	if(herm) {
		var cocksInVag = player.CocksThatFit(mainCat.FirstVag());
		var cocksInAss = player.CocksThatFit(mainCat.Butt());
		
		if(cocksInVag.length > 0) {
			options.push({ nameStr : "Fuck vag(H)",
				func : function() {
					Scenes.Felines.WinFuckVag(herm, group, enc, cocksInVag);
				}, enabled : true,
				tooltip : "Get some pussy."
			});
		}
		if(cocksInAss.length > 0) {
			options.push({ nameStr : "Fuck ass(H)",
				func : function() {
					Scenes.Felines.WinFuckButt(herm, group, enc, cocksInAss);
				}, enabled : true,
				tooltip : Text.Parse("Push[oneof] [himher] down on [hisher] back and fuck [himher] in the ass.", parse)
			});
		}
		if(player.FirstCock()) {
			options.push({ nameStr : "Get blowjob(H)",
				func : function() {
					Scenes.Felines.WinGetBlowjob(herm, group, enc);
				}, enabled : true,
				tooltip : Text.Parse("Order[oneof] [himher] to give you a blowjob.", parse)
			});
		}
	}
	/*
		options.push({ nameStr : "Nah",
			func : function() {
				Scenes.Felines.WinFuckVag(female, enc);
			}, enabled : true,
			tooltip : ""
		});
	*/
	Gui.SetButtonsFromList(options);
}

Scenes.Felines.WinFuckVag = function(cat, group, enc, cocks) {
	var pCock = cocks[0];
	
	var parse = {
		Name     : cat.nameDesc(),
		name     : cat.nameDesc(),
		HeShe    : cat.HeShe(),
		heshe    : cat.heshe(),
		HisHer   : cat.HisHer(),
		hisher   : cat.hisher(),
		himher   : cat.himher(),
		Possessive  : cat.Possessive(),
		possessive  : cat.possessive(),
		cockDesc    : function() { return pCock.Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockTip     : function() { return pCock.TipShort(); },
		hand        : function() { return player.HandDesc(); },
		tongueDesc  : function() { return player.TongueDesc(); },
		stomachDesc : function() { return player.StomachDesc(); },
		skinDesc    : function() { return player.SkinDesc(); },
		breastDesc  : function() { return player.FirstBreastRow().Short(); },
		ballsDesc   : function() { return player.BallsDesc(); },
		clitCock    : cat.FirstCock() ? "clitcock" : "clit"
	};
	
	Text.Clear();
	if(group) {
		var num = enc.enemy.Num() - 1;
		var tmpParse = {
			hisher       : group ? "their" : enc.enemy.Get(1).hisher(),
			s            : num > 1 ? "s" : "",
			notS         : num > 1 ? "s" : ""
		}
		Text.Add("You pick out one of the females in particular, sauntering over to her. The other feline[s] keep[notS] [hisher] distance, but seem[notS] intent on watching whatever you are about to do.", tmpParse);
		Text.NL();
	}
	Text.Add("The she-cat whines pitifully, acknowledging her defeat as you loom over her. Her lower lips are moist and ready for you, and she looks like she knows what is coming, spreading her legs slightly and looking at you expectantly.", parse);
	if(cat.FirstCock())
		Text.Add(" Above her pussy, her cock is rock hard, but for now, you have no interest in it.", parse);
	Text.NL();
	if(!pCock.isStrapon) {
		parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
		parse["itThem"]   = player.NumCocks() > 1 ? "them" : "it";
		Text.Add("You free your stiffening [multiCockDesc] from [itsTheir] confines, stroking [itThem] lightly as you present [itThem] to your fallen foe. She whimpers slightly, but acknowledges your power over her by parting her legs further.", parse);
	}
	else  {// toy
		Text.Add("[Name] seems fascinated by your [cockDesc], apparently never having seen such a device. She does seem to understand what it is for though, as she blushes slightly and parts her legs further, beckoning you to plunge your artificial member into her waiting cleft.", parse);
	}
	Text.NL();
	parse["oneof"] = player.NumCocks() > 1 && !pCock.isStrapon ? " one of" : "";
	parse["s"]     = player.NumCocks() > 1 && !pCock.isStrapon ? "s" : ""; 
	Text.Add("The cat is breathing heavily as you line up[oneof] your cock[s] with her pussy, rubbing the [cockTip] against her sensitive labia. She is nice and wet already, providing you with plenty of lubrication. With a single thrust of your hips, you’ve pushed inside her, her walls wrapping tightly around your shaft. You allow her a short period of time to adjust before you start moving.", parse);
	Text.NL();
	Text.Add("The feline, used to rough but brief copulations, has little preparation for the fucking you are about to give her, moaning in surprised delight as you explore her depths with your [cockDesc].", parse);
	if(player.NumCocks() > 1) {
		parse["s2"] = player.NumCocks() > 2 ? "s" : "";
		parse["notS2"] = player.NumCocks() > 2 ? "" : "S";
		Text.Add(" Your other cock[s2] bob[notS2] up and down, rubbing against her sensitive [clitCock] each time you thrust into her.", parse);
	}
	parse["thick"] = pCock.thickness.Get() > 7 ? ", wondering how long that is going to last, if you run into her more frequently" : "";
	Text.Add(" You grunt, complimenting her on her tightness[thick]. She only gasps in response. You can feel her heart pounding as you bottom out, your groins joined as one.", parse);
	if(player.HasBalls())
		Text.Add(" Below the tight embrace of her pussy, your balls rub against her exposed cheeks, making a promise to fill her with their stored seed.", parse);
	Text.NL();
	parse["cupSize"] = cat.FirstBreastRow().Desc().cup;
	Text.Add("All the while, your [hand]s have been busy, caressing her fluffy fur and rubbing her sensitive tummy. You take some time to tease her budding breasts - [cupSize]s by your judgement - circling her areola with your fingers and pinching her stiff nipples. [Name] looks up at you through her thick lashes, marveling at your tender care.", parse);
	Text.NL();
	
	
	
	Gui.Callstack.push(function() {
		Text.NL();
		if(!pCock.isStrapon) {
			Text.Add("It’s not long before you can feel a surge in your [ballsDesc], announcing the coming of your orgasm. With a final thrust, you drive yourself hips deep into the feline, shuddering as you unleash the torrent of your seed inside her.", parse);
			Text.NL();
			
			var load = player.OrgasmCum();
			
			if(load > 6) {
				Text.Add("Her eyes go wide as load after massive load is pumped into her defenseless womb, making her stomach bloat slightly by the sheer amount of cum. When you are done, she looks like she’s pregnant already.", parse);
			}
			else if(load > 3) {
				Text.Add("She has a dreamy look, blushing slightly as way more seed than she expected flows into her waiting passage.", parse);
			}
			else {
				Text.Add("She sighs contently, feeling your hot seed settle deep inside her pussy.", parse);
			}
			if(player.NumCocks() > 1) {
				parse["s"] = player.NumCocks() > 2 ? "s" : "";
				parse["notS"] = player.NumCocks() > 2 ? "" : "s";
				parse["itsTheir"] = player.NumCocks() > 2 ? "their" : "its";
				Text.Add(" Your other cock[s] also discharge[notS] [itsTheir] seed, coating the panting feline in your thick cum, marking her as yours.", parse);
			}
			Text.NL();
			Text.Add("<i>”Ah… almost makes me wish I was in heat...”</i> she murmurs.", parse);
			Text.NL();
			Text.Add("You pull out of [name], leaving a sloppy trail of your semen connecting your [cockDesc] with her gaping nether lips.", parse);
		}
		else {
			Text.Add("At long last, after you’ve had your own desires sated, you pull out of her, leaving the kitty drained but satisfied.", parse);
			Text.NL();
			Text.Add("<i>”I... I never knew that such a thing was possible,”</i> [name] remarks wondrously, studying your now quite sticky [cockDesc]. <i>”Where could I find such a thing?”</i> You shrug, telling her where you got your artificial cock. The cat looks thoughtful, and you idly wonder what she’d do if she had one, and to whom she’d do it.", parse);
			Text.NL();
			Text.Add("These small mysteries of life.", parse);
		}
		Text.Add(" Demanding one final service from her, you have her clean you up with her tongue, licking the mixture of sexual fluids from your [cockDesc]. You gather your belongings and bid farewell to your brief lover, who looks at you with conflicting emotions, not sure whether to feel happy or regretful that you are leaving.", parse);
		Text.Flush();
		
		player.subDom.IncreaseStat(70, 1);
		
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt();
	});
	
	
	if(player.SubDom() + Math.random() * 10 > 50) {
		Text.Add("But you shouldn’t be giving her the wrong idea here. You smirk as you flip the surprised feline over, putting her on all fours. Leaning down, you whisper that you promise to pound her into oblivion, showing her levels of pleasure she could only dream of while mating with her own kind.", parse);
		Text.NL();
		Text.Add("To drive your point home, you pull out until only your [cockTip] remains inside [name], then ram your [cockDesc] home in one swift motion, driving the breath from her body. She is moaning helplessly after one minute of your relentless fucking. After five, her arms give out, and she crumples forward, her entire world revolving around receiving your mercilessly pistoning shaft. If not for your [hand]s supporting her hips, her trembling legs would have folded long ago.", parse);
		Text.NL();
		Text.Add("Her tail sways back and forth enticingly, twitching erratically each time you drive your [cockDesc] inside her. Figuring it’ll serve well as a handhold, you grab on to it near the base, tugging at it when you wish to pound your rod deeper. You are rewarded with a cute, trembling mewl as the overwhelmed feline quakes beneath you, her orgasm hitting her hard.", parse);
		Text.NL();
		var doubleCock = false;
		if(cocks.length > 1 && Math.random() > 0.5) {
			doubleCock = true;
			parse["cockDesc2"] = function() { return cocks[1].Short(); };
			Text.Add("You are having quite a good time, but can’t help feeling a bit bummed out that only one of your [multiCockDesc] is getting the attention it craves. Without skipping a beat, you press your [cockDesc2] down between [possessive] cheeks, hotdogging her for a bit while humming happily.", parse);
			Text.NL();
			Text.Add("Drawing your hips back, you reposition yourself so that two cocks prod at the entrance to the quivering pussy’s pussy. It’s a tight fit, but you are nothing if not insistent. Eventually, your persistence bears fruit, and your pair of dicks are welcomed inside the yowling feline’s stretchy vaginal passage. The kitty is in ecstasy, no doubt being filled like she’s never been filled before. Your hips slap against her wetly, as your coitus forces the sticky juices dripping out of her overfilled cunt to overflow, liberally coating your thrusting cocks.", parse);
		}
		else {
			parse["seed"] = pCock.isStrapon ? "" : ", trying to milk you of your seed";
			Text.Add("You allow her a short respite before you resume your thrusting, trying to build toward your own orgasm. The little kitty is deliciously tight and willing, her cunt hungrily swallowing up your pistoning [cockDesc][seed].", parse);
			Text.NL();
			Text.Add("For a while, you continue like that, sweating bodies rocking against each other, joined at the hip. [Possessive] tail is like a living snake, trying to escape your snug grip, though you can tell she is receiving a huge amount of pleasure from the stimulation.", parse);
		}
		Text.Add("She cries out as she reaches her second climax, her tunnel hugging your[throbbing] shaft[s] tightly. It looks like losing to you is the greatest thing the girl has had happen to her, if her encouraging moans are any indication.", parse);
		Text.NL();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>”Ahn, you are so <b>rough</b>!”</i> she purrs as she squirms beneath you. <i>”I <b>love</b> it! I love getting fucked by you!”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>”W-whoa, taking two dicks is awesome!”</i> she moans, gasping for breath between your thrusts.", parse);
		}, 1.0, function() { return doubleCock; });
		scenes.AddEnc(function() {
			Text.Add("<i>”P-perhaps I should lose to you more often,”</i> she purrs happily. <i>”You are so good at punishing me when I’ve been a bad girl!”</i>", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
		
		parse["breed"] = pCock.isStrapon ? "" : " and breed";
		Text.Add("Grunting, you tell her that you’re more than happy to give it to her any time. You can always use a distraction from this whole ‘saving the world’ business, and a moaning, slutty kitty to fuck[breed] provides just that.", parse);
		if(group) {
			Text.NL();
			parse["s"] = enc.enemy.Num() > 2 ? "s" : "";
			Text.Add("[Possessive] companion[s] are looking on, perhaps in jealousy or apprehension, not that you care either way. If you still feel in the mood for it, perhaps you’ll give them a good fucking too.", parse);
		}
		
		PrintDefaultOptions();
	}
	else {
		Text.Add("No doubt, you are acting quite differently from her usual mates - intimate and loving while still giving it to her hard and deep. You lean down, locking lips with the feline, your [tongueDesc] wrestling with her rough tongue. Rolling over, you let her be on top a while, stretching back languidly as the aroused cat rides your [cockDesc]. She moans lustfully, happily grinding her hips against yours as she willfully impales herself on you.", parse);
		Text.NL();
		Text.Add("You let your [hand]s explore her body, giving her breasts some more attention before focusing on her nethers, thumbing her [clitCock].", parse);
		if(cat.FirstCock())
			Text.Add(" She is getting quite hot and bothered, her own cock standing out stiff as a flag post, quivering at your lightest touch.", parse);
		Text.Add(" You give her a few more teasing caresses before moving on, rubbing her hips, her back, cupping her firm buttocks. Gripping her by her ass, you bounce her in your lap, drawing cute moans from the raunchy kitty.", parse);
		Text.NL();
		if(cat.FirstCock() && Math.random() > 0.5) {
			Text.Add("<i>”N-no! That’s not fair!”</i> she moans, <i>”it’s aching… can you rub it, please?”</i> Her cock is bobbing up and down, dripping precum on your [stomachDesc].", parse);
			Text.Flush();

			//[Comply][Deny]
			var options = new Array();
			options.push({ nameStr : "Comply",
				func : function() {
					Text.Clear();
					Text.Add("You relent to her pleading, gripping her dick with one of your [hand]s. [Name] purrs happily, sighing with pleasure as you begin to stroke her. The hermaphrodite cat starts gyrating her hips, grinding your [cockDesc] home while letting you jerk her off. Her feline cock is stiff as rock in your [hand], the veins standing out visibly. Near the tapered tip, tiny barbs stand out.", parse);
					Text.NL();
					Text.Add("[Possessive] eyes are closed, her tongue lolling out as she rides you. Suddenly, she gasps, letting out a long, keening moan, her paws curling up in ecstasy. Her cock throbs, twitching wildly as she orgasms, spraying her pent-up seed all over your [skinDesc]. After firing several volleys, the dickgirl collapses on top of you, rubbing her own seed into her fur. She whispers her appreciation to you, suggesting that you should let her return the favor some day.", parse);
					Text.NL();
					Text.Add("You whisper back that you’ll consider it, before turning her over on her back, resuming your thrusting.", parse);
					Text.Flush();
					
					player.subDom.DecreaseStat(-20, 1);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Jerk her off."
			});
			options.push({ nameStr : "Deny",
				func : function() {
					Text.Clear();
					Text.Add("You grin mockingly, asking her why you should do all the work. When she lifts a trembling hand to jerk herself off, you swat it away in annoyance. Telling her that you’ll maybe help her out, if she puts some effort into pleasing you. Grumbling slightly, but recognizing your authority, [name] braces herself with her quivering legs, carefully pushing herself up until only the [cockTip] remains inside her.", parse);
					Text.NL();
					Text.Add("Biting her lip, the hermaphrodite kitty drives herself down, grunting as she spears herself on your [cockDesc]. Getting into a rhythm, she repeats the process, trying to balance herself by placing her hands on your [breastDesc], not trusting her trembling legs to hold her. Each time she bounces on you, her cock bobs eagerly, and she looks down at your smirking face, silently begging you to grant her relief.", parse);
					Text.NL();
					Text.Add("You keep teasing her, lightly tracing a vein on her feline dick with a single one of your fingers, flicking the barbed tip, causing a minor spray of pre to leak down the quivering shaft. [Name] is breathing heavily, still impaling herself on your [cockDesc], moaning from the dual stimuli. Her eyes are clouded, and you can tell that she is very close to her climax.", parse);
					Text.NL();
					Text.Add("As soon as you hear [name] gasp, your hand darts forth, grasping tightly around the base of her throbbing cock. The feline opens her mouth wordlessly, failing to process what is happening, desperate to cum but unable to. She moans pitifully, her dick twitching futilely, your vice-like grip preventing even a single drop of her seed to pour out.", parse);
					Text.NL();
					Text.Add("Finally out of energy, the kitty falls over backwards, your [cockDesc] still buried to the root inside her. You loom over her, relenting and letting go of her trembling cock as you get back to business, starting to pump her pussy again. [Name] whines pathetically, moaning as you go down on her. Thick seed slowly pours from the tip of her softening dick, pooling on her stomach.", parse);
					Text.Flush();
					
					player.subDom.IncreaseStat(50, 1);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Keep teasing her, but don’t let her cum."
			});
			Gui.SetButtonsFromList(options);
		}
		else {
			Text.Add("[Name] gasps happily as you hit a particularly pleasant spot, and seizing the opportunity, you repeatedly thrust into her, relentlessly driving her toward a messy orgasm. Finally, it is too much for her to take, and she collapses on top of you, her slick girly juices dripping down around your [cockDesc].", parse);
			Text.NL();
			Text.Add("You let her recover briefly before rolling her over on her back again, continuing to pound her. She moans appreciatively, acknowledging that you put in effort to please her before taking your own pleasure.", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				parse["IWe"] = group ? "we" : "I";
				Text.Add("<i>”Y-you are quite gentle, even though [IWe] were hunting you...”</i> [Name] sounds perplexed at this, the prey showing mercy to the defeated hunter.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>”Thank you, lover,”</i> [name] purrs, caressing your [skinDesc] tenderly.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>”Oh… Oh!”</i> she gasps. <i>”Don’t stop now - haah… - ah, I can’t feel my legs anymore… so good!”</i>", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
			PrintDefaultOptions();
		}
	}
}

Scenes.Felines.WinFuckButt = function(cat, group, enc, cocks) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Flush();
	
	Gui.NextPrompt();
}

Scenes.Felines.WinGetBlowjob = function(cat, group, enc) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Flush();
	
	Gui.NextPrompt();
}

/*
Scenes.Felines.WinPrompt = function() {
	var enc = this;
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}
*/
