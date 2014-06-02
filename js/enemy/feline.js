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
	
	this.monsterName       = "the wildcat";
	this.MonsterName       = "The wildcat";
		
	if(gender == Gender.male) {
		this.avatar.combat     = Images.wildcat_male;
		this.name              = "Wildcat(M)";
		this.body.DefMale();
	}
	else if(gender == Gender.female) {
		this.avatar.combat     = Images.wildcat_fem;
		this.name              = "Wildcat(F)";
		this.body.DefFemale();
		if(Math.random() < 0.8)
			this.FirstVag().virgin = false;
	}
	else {
		this.avatar.combat     = Images.wildcat_fem;
		this.name              = "Wildcat(H)";
		this.body.DefHerm(true);
		if(Math.random() < 0.6)
			this.FirstVag().virgin = false;
	}
	this.desc      = "large wildcat";
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

function Puma(gender) {
	Wildcat.call(this, gender);
	
	this.monsterName = "the puma";
	this.MonsterName = "The puma";
	this.desc        = "lithe puma";
	this.GroupName   = "The pumas";
	this.groupName   = "the pumas";
	
	if(gender == Gender.male) {
		this.avatar.combat = Images.puma_male;
		this.name          = "Puma(M)";
	}
	else if(gender == Gender.female) {
		this.avatar.combat = Images.puma_fem;
		this.name          = "Puma(F)";
	}
	else {
		this.avatar.combat = Images.puma_fem;
		this.name          = "Puma(H)";
	}
}
Puma.prototype = new Wildcat();
Puma.prototype.constructor = Puma;

function Jaguar(gender) {
	Wildcat.call(this, gender);
	
	this.monsterName = "the jaguar";
	this.MonsterName = "The jaguar";
	this.desc        = "swift jaguar";
	this.GroupName   = "The jaguars";
	this.groupName   = "the jaguars";
	
	if(gender == Gender.male) {
		this.avatar.combat = Images.jaguar_male;
		this.name          = "Jaguar(M)";
	}
	else if(gender == Gender.female) {
		this.avatar.combat = Images.jaguar_fem;
		this.name          = "Jaguar(F)";
	}
	else {
		this.avatar.combat = Images.jaguar_fem;
		this.name          = "Jaguar(H)";
	}
}
Jaguar.prototype = new Wildcat();
Jaguar.prototype.constructor = Jaguar;

function Lynx(gender) {
	Wildcat.call(this, gender);
	
	this.monsterName = "the lynx";
	this.MonsterName = "The lynx";
	this.desc        = "proud lynx";
	this.GroupName   = "The lynx";
	this.groupName   = "the lynx";
	
	if(gender == Gender.male) {
		this.avatar.combat = Images.lynx_male;
		this.name          = "Lynx(M)";
	}
	else if(gender == Gender.female) {
		this.avatar.combat = Images.lynx_fem;
		this.name          = "Lynx(F)";
	}
	else {
		this.avatar.combat = Images.lynx_fem;
		this.name          = "Lynx(H)";
	}
}
Lynx.prototype = new Wildcat();
Lynx.prototype.constructor = Lynx;

// TODO
function Lion(gender) {
	Wildcat.call(this, gender);
	
	this.monsterName = "the lion";
	this.MonsterName = "The lion";
	this.desc        = "hulking lion";
	this.GroupName   = "The lions";
	this.groupName   = "the lions";
	this.isLion = true;
	
	if(gender == Gender.male) {
		//this.avatar.combat = Images.lion_male;
		this.name          = "Lion(M)";
	}
	else if(gender == Gender.female) {
		//this.avatar.combat = Images.lion_fem;
		this.name          = "Lion(F)";
	}
	else {
		//this.avatar.combat = Images.lion_fem;
		this.name          = "Lion(H)";
	}
}
Lion.prototype = new Wildcat();
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
		m1Name     : mainCat.NameDesc(),
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
	parse["Oneof"] = group ? Text.Parse("One of [groupName]", parse) : parse["m1Name"];
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
		parse["youYourParty"] = party.Num() > 1 ? "your party" : "you";
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
	
	enc.finalize = function() {
		Encounter.prototype.onVictory.call(enc);
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
	
	var options = new Array();
	if(female) {
		var cocksInVag = player.CocksThatFit(female.FirstVag());
		var cocksInAss = player.CocksThatFit(female.Butt());
		
		if(cocksInVag.length > 0) {
			options.push({ nameStr : "Fuck vag(F)",
				func : function() {
					Scenes.Felines.WinFuckVag(female, group, enc, cocksInVag, numFemales);
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
		var cocksInAss = player.CocksThatFit(male.Butt());
		
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
		var cocksInVag = player.CocksThatFit(herm.FirstVag());
		var cocksInAss = player.CocksThatFit(herm.Butt());
		
		if(cocksInVag.length > 0) {
			options.push({ nameStr : "Fuck vag(H)",
				func : function() {
					Scenes.Felines.WinFuckVag(herm, group, enc, cocksInVag, numHerms);
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
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("You gather up your belongings and leave the defeated feline[s] behind you.", {s: group ? "s" : ""});
			Text.Flush();
			
			Gui.NextPrompt(enc.finalize);
		}, enabled : true,
		tooltip : Text.Parse("Just leave [himher] and be on your way.", parse)
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Felines.WinFuckVag = function(cat, group, enc, cocks, numFemales) {
	var pCock = cocks[0];
	
	var parse = {
		Name     : cat.NameDesc(),
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
			notS         : num > 1 ? "s" : "",
			oneof        : numFemales > 1 ? " one of" : "",
			s2           : numFemales > 1 ? "s" : "",
			herm         : cat.FirstCock() ? "herm" : "female"
		}
		Text.Add("You pick out[oneof] the [herm][s2] in particular, sauntering over to her. The other feline[s] keep[notS] [hisher] distance, but seem[notS] intent on watching whatever you are about to do.", tmpParse);
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
	
	Sex.Vaginal(player, cat);
	player.Fuck(pCock, 3);
	
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
		
		Gui.NextPrompt(enc.finalize);
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
	var pCock = cocks[0];
	
	var parse = {
		oneof    : group ? " one of" : "",
		s        : group ? "s" : "",
		Name     : cat.NameDesc(),
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
		hipsDesc    : function() { return player.HipsDesc(); },
		skinDesc    : function() { return player.SkinDesc(); },
		breastDesc  : function() { return player.FirstBreastRow().Short(); },
		ballsDesc   : function() { return player.BallsDesc(); },
		clitCock    : cat.FirstCock() ? "clitcock" : "clit",
		vagDesc     : function() { return player.FirstVag() ? player.FirstVag().Short() : "crotch"; }
	};
	
	Text.Clear();
	Text.Add("You tell[oneof] the defeated feline[s] that you are going to have some fun with [himher], motioning [himher] to roll over on [hisher] back, legs spread. [HeShe] complies, whimpering fearfully. Following your instructions [name] pulls [hisher] ass cheeks wide, exposing [hisher] tight rosebud. The shy cat tries to block your view by curling [hisher] tail in your way, but you easily push it aside, probing [possessive] tailhole with one of your fingers, slick from your saliva.", parse);
	Text.NL();
	Text.Add("<i>”P-please,”</i> [name] whines pitifully, moaning softly as your digit slips inside. Please get right to the main course and fuck [himher] silly? If [heshe] puts it that way…", parse);
	Text.NL();
	Text.Add("In response, you thrust your finger in to the knuckle, drawing a surprised yelp from the vulnerable feline.", parse);
	if(cat.FirstCock())
		Text.Add(" [HisHer] cock twitches at the sudden intrusion, seeming far more into the prospect of [hisher] imminent buttfucking than its owner is.", parse);
	if(cat.HasBalls())
		Text.Add(" You smile, caressing [possessive] full sack. Before this is over, you are going to empty this.", parse);
	if(cat.FirstVag())
		Text.Add(" [Possessive] cunt is wet and ready, but it’ll have to wait for now. You have another target in mind.", parse);
	Text.NL();
	if(pCock.isStrapon) {
		Text.Add("While busy preparing [name], you hurriedly slip off your gear, pulling out and securing your [cockDesc]. [Name] looks at the artificial member with confusion, though from [hisher] deep blush, you suspect that [heshe] knows full well what you intend to use it for.", parse);
	}
	else {
		parse["ItThey"] = player.NumCocks() > 1 ? "they" : "it";
		parse["isAre"]  = player.NumCocks() > 1 ? "are" : "is";
		Text.Add("While you are busy preparing [name], you hurriedly slip off your gear, pulling out your stiffening [multiCockDesc]. [ItThey] [isAre] more than ready for the task at hand, yearning to be plunged into [possessive] blissfully tight hole.", parse);
	}
	Text.NL();
	Text.Add("By now, you are thrusting two fingers into [hisher] anus, [hisher] weakening defenses soon allowing you to work in a third. [Name] moans in pleasure, [hisher] legs squirming and [hisher] tail swishing back and forth erratically.", parse);
	Text.NL();
	if(cat.FirstVag())
		Text.Add("<i>”No, that is the wrong hole!”</i> she whimpers, though she doesn’t seem as resistant as her words imply.", parse);
	else
		Text.Add("<i>”Do you intend to take me like one would a female?”</i> he pants, blushing at the alien concept.", parse);
	Text.Add(" You respond by increasing your pace, grinning at the way [name] arches [hisher] back. With a start, you realize that the horny kitty has begun to purr.", parse);
	Text.NL();
	if(cat.FirstCock()) {
		Text.Add("No matter how much [heshe] complains, [hisher] rigid shaft is betraying [hisher] true feelings. A bead of precum has started to form on the barbed tip of the feline cock, much to the dismay of its owner. [Name] looks up at you hopefully, wanting you to aid [himher], but you’ve got something else in mind. Coyly, you motion [himher] to raise [hisher] head, scratching the obedient kitty behind one ear as [heshe] complies.", parse);
		Text.NL();
		Text.Add("Slowly, you guide [himher] toward [hisher] crotch, [hisher] flexible back bending to accommodate for your raunchy plan. [Name] submissively obey, closing [hisher] eyes as [hisher] open mouth draws closer and closer to [hisher] needy cock. The feline shudders happily as [heshe] licks up [hisher] own pre, dick twitching as [hisher] rough tongue laps up the salty cream.", parse);
		Text.NL();
		Text.Add("However, instead of releasing the pressure on the back of [hisher] head, you push [himher] down further, so that [hisher] lips wraps around the slick feline shaft. Only when [heshe] has swallowed every inch of [hisher] own cock do you relent, softening your grip slightly to allow [name] some room to move. Breathing heavily, you command the kitty to suck, your fingers still busy probing [hisher] rear entrance.", parse);
	}
	else {
		Text.Add("The female moans despite herself, one of her trembling hands instinctively moving toward her wet pussy. Even left untended, the feline’s snatch is brimming with her juices, begging to be bred by her dominant victor. A swat with your free [hand] cruelly denies her pleasure, and she whimpers pitifully, wordlessly begging you to allow her release.", parse);
		Text.NL();
		Text.Add("[Name] holds her breath raptly as your [hand] hovers over her needy sex, only a fraction of an inch separating you and [possessive] wet nether lips. In a desperate attempt to sate herself, the horny kitty grinds back against your probing fingers, impaling herself on your digits while she arches her back, trying to brush her pussy against your teasing [hand].", parse);
		Text.NL();
		Text.Add("Mocking her eagerness, you withdraw, staying just outside the reach of her shaking hips. You tell her that she isn’t allowed to use her hands, but that you’ll grant her the use of her tongue. Her restrictions released, the feline greedily lunges for her own crotch, her back twisting and bending like an acrobat’s. [Name] shudders in pleasure as she sinks her tongue into her folds. In a sultry voice, you commend the feline for her obedience, your  fingers still busy probing [hisher] rear entrance.", parse);
	}
	Text.NL();
	Text.Add("[Possessive] flexible nature provides so many fun possibilities, but you are beginning to get riled up yourself. Time to find out if [hisher] butt is as stretchy [hisher] back! Letting [name] tend to [himher]self orally, you slowly withdraw your fingers from [hisher] stretched hole. The tight rosebud quickly clenching behind you, promising for a fun challenge ahead. No matter, you’ll soon have [himher] gaping wide.", parse);
	Text.NL();
	
	parse["oneof"] = player.NumCocks() > 1 && !pCock.strapOn ? " one of" : "";
	parse["cock"] = pCock.strapOn ? pCock.Short() : player.MultiCockDesc();
	Text.Add("The kitty gulps nervously as you line up[oneof] your [cock] with [hisher] puckered ass, though by now, [hisher] fear has been all but squashed by [hisher] lust. As a further testament to this, [heshe] betrays [hisher] eagerness to be fucked by grasping [hisher] buttcheeks with [hisher] paws, spreading them wide and welcoming you to ravage [himher]. ", parse);
	if(player.sex.gAnal >= 20)
		Text.Add("Always happy to introduce another slut to the joys of anal sex, you gleefully thrust your [cockDesc] into [hisher] butt. [HeShe] is in for quite a ride.", parse);
	else if(player.sex.gAnal > 5)
		Text.Add("With an experienced thrust of your [hipsDesc], you plunge your [cockDesc] inside the kitty’s offered butt.", parse);
	else
		Text.Add("In your bumbling eagerness, you have to take a moment to adjust your aim before your probing [cockDesc] pushes inside [himher].", parse);
	Text.NL();
	
	//#PC fucks cat
	Sex.Anal(player, cat);
	player.Fuck(pCock, 3);
	
	parse["cock"] = cat.FirstCock() ? Text.Parse("around [hisher] cock", parse) : "into her cunt";
	Text.Add("At first, you are only able to force your [cockTip] past [possessive] withering defenses, but after a bit of work, more and more of [hisher] anal passage falls to your advancing [cockDesc]. Grunting with pleasure, you rock your [hipsDesc], digging deeper and deeper inside the pliant kitty. [HeShe] adapts surprisingly quickly to the rough pace you set, moaning appreciatively [cock]. [Name] seems to be having a good time so far, but you are barely getting started.", parse);
	Text.NL();
	if(pCock.length.Get() > 30)
		Text.Add("The feline is protesting every bit of the way, [hisher] cries and moans alternating between pain at being stretched wide open and the pleasure of being fucked like the subservient slut [heshe] is. Eventually you realize that you are simply too big for [himher], not that this fact will stop you from fucking [possessive] brains out.", parse);
	else
		Text.Add("You are easily able to bottom out inside your subservient slut. Easy for you, if not for [himher]. The sounds of your hips slamming against [possessive] bum echo across the wide plains, and [hisher] muffled cries of mixed pleasure and pain announcing [hisher] anal debut to everyone within earshot.", parse);
	Text.NL();
	if(player.NumCocks() > 1) {
		parse["s"] = player.NumCocks() > 2 ? "s" : "";
		parse["isAre"] = player.NumCocks() > 2 ? "are" : "is";
		parse["cock"] = cat.FirstCock() ? Text.Parse("sucking [hisher] cock", parse) : "lapping at her cunt";
		Text.Add("Your other bobbing shaft[s] [isAre] dancing hypnotizingly in front of [possessive] half-closed eyes. Taking some time off from [cock], [heshe] raises [hisher] head to give you a lick. The kitty runs [hisher] rough tongue along the bottom of[oneof] your dick[s], lathering it from root to tip.", parse);
		Text.NL();
	}
	Text.NL();
	Text.Add("The two of you settle into a rhythm, you providing thrusting power and [name] doing all [heshe] can to receive you. [HisHer] claws are digging into [hisher] furry behind, pulling [hisher] cheeks wide and opening [hisher] passage for your fervent onslaught. At some point, [name] abandons [hisher] oral enterprise, head rolling back and tongue lolling freely as [hisher] body is wrecked by wave after wave of pleasure. The cat pants rapidly, breathlessly begging you to fuck [himher] harder, deeper, to punish [himher] for being such a bad kitty.", parse);
	Text.NL();
	Text.Add("You respond with action rather than words, giving [name] just what [heshe] wants. Hoisting the flexible feline’s stretchy butt up higher, you push [hisher] legs back behind [hisher] head, the angle allowing you to go even deeper than before.", parse);
	if(cat.FirstCock())
		Text.Add(" Each violent thrust into [possessive] depths rub against [hisher] battered prostate, bringing [himher] closer and closer to a very messy climax.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>”Y-you fuck like the king of the plains! S-so good!”</i> [name] moans breathlessly. Perhaps [heshe] isn’t as inexperienced at taking cocks in the ass as you thought.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>”Mmh… Ahn!”</i> [name] moans lustily, tail swishing back and forth erratically, the bushy tip brushing against your [skinDesc].", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["masterMistress"] = player.mfTrue("master", "mistress");
		Text.Add("<i>”I love your cock, [masterMistress]!”</i> [name] pants breathlessly. <i>”Stretching me so wide...”</i>", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();

	Text.NL();
	Text.Add("With a last groaning roar, the large feline shudders in your arms, ass clenching tightly around your [cockDesc] as [heshe] cums.", parse);
	if(cat.FirstCock())
		Text.Add(" [HisHer] precarious position puts [himher] in the direct trajectory of [hisher] seed, which jets out in long, thick strands of white, covering the kitty in [hisher] own sticky cream.", parse);
	if(cat.FirstVag())
		Text.Add(" [Possessive] pussy erupts in a tiny fountain of girlcum, small beads of the clear liquid sticking to [hisher] matted fur.", parse);
	Text.NL();
	Text.Add("You’d give [himher] a moment to recover… but you are so close yourself! Grinning feverishly, you redouble your efforts, taking great advantage of [possessive] tightening muscles and little care for [hisher] feelings. Each thrust pushes you closer and closer, until finally, it all comes crashing down on you.", parse);
	Text.NL();
	
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("Once [heshe] has recovered sufficiently, [name] sets to cleaning [himher]self up using [hisher] tongue. Every now and then, [heshe] pauses to eye you warily, unsure whether you are finished with [himher] or not.", parse);
		Text.NL();
		if(party.NumTotal() == 2)
			parse["comp"] = " and " + party.Get(1).name;
		else if(party.NumTotal() > 1)
			parse["comp"] = " and your companions";
		else
			parse["comp"] = "";
		Text.Add("Even if keeping the cat as a pet would be fun, you have to get back to your quest. You[comp] gather your gear and once again set out on your journey.", parse);
		Text.Flush();
		
		player.subDom.IncreaseStat(50, 1);
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt(enc.finalize);
	});
	
	
	if(!pCock.isStrapon) {
		Text.Add("Moments away from flooding [possessive] insides with your cum, you pause. Where do you want to finish?", parse);
		Text.Flush();
		
		var load = player.OrgasmCum();
		
		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("Before leaving the kitty in a panting, sticky heap, you wipe your [multiCockDesc] clean on [hisher] fur. A little more cream surely can’t hurt.", parse);
			
			PrintDefaultOptions();
		});
		
		//[Inside][Mouth][Body]
		var options = new Array();
		options.push({ nameStr : "Inside",
			func : function() {
				Text.Clear();
				Text.Add("No going back now! Grunting, you make a final thrust, pushing your [cockDesc] deep in [possessive] formerly tight ass. [HisHer] eyes widen as [heshe] feels the first warm splatters of your seed pouring into [himher], forever marking the kitty as your slut.", parse);
				Text.NL();
				if(load > 6) {
					Text.Add("[Possessive] eyes widen further as the first few blasts all but inflate [hisher] insides, the rushing seed reaching [hisher] stomach with most of your load yet to be unleashed. Each ram of your hips deposits another massive glob of spunk into [possessive] bowels, rapidly inflating [hisher] tummy to huge proportions.", parse);
					Text.NL();
					if(load > 10) {
						Text.Add("The poor kitty gags, briefly trying to keep down the rising flood of semen rushing up [hisher] windpipe, but it is a futile effort. In a final gush, your cum fountains from [possessive] mouth, raining down on both of you. After a lot of coughing, [heshe] manages to clear [hisher] throat, allowing air to flow again.", parse);
						Text.NL();
					}
					Text.Add("[Name] carefully rubs [hisher] bloated stomach, feeling your seed settling inside [himher].", parse);
				}
				else if(load > 3) {
					Text.Add("[Name] looks down in surprise at [hisher] slowly swelling stomach, astonished by your impressive output. Gulping uncertainly, [heshe] squirms a bit, though with your [cockDesc] firmly lodged in [hisher] ass,  [heshe] can do little but lie there and take it.", parse);
				}
				else {
					Text.Add("You rest for a while after cumming inside [name], letting [himher] feel you spunk settle inside [himher].", parse);
				}
				Text.Add(" With a sloppy plop, you pull out your [cockDesc], leaving behind a strand of cum connecting to [possessive] gaping asshole.", parse);
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("Just keep ramming [himher] until [heshe]’s leaking cum from [hisher] ears!", parse)
		});
		options.push({ nameStr : "Mouth",
			func : function() {
				Text.Clear();
				Text.Add("Just before you go over the edge, you pull out of the moaning feline, leaving [hisher] ass gaping. Jutting your [hipsDesc] forward, you take hold of the back of [possessive] head, shoving [himher] down on your [cockDesc]. [HeShe] protests weakly,  but pipes down as you pour your cream into [hisher] mouth and against the back of [hisher] throat.", parse);
				Text.NL();
				if(load > 6) {
					Text.Add("No matter how valiantly [name] tries to swallow your seed, your load is simply too big for [himher] to handle. [HisHer] stomach swells rapidly, and when [heshe] can no longer keep up, [hisher] cheeks bulge, eyes going wide as the high pressure causes your cum to jet out from [hisher] nostrils. Coughing feebly and clutching [hisher] inflated belly, [name] takes the last few blasts in the face; eyes lowered in shame.", parse);
					Text.NL();
					Text.Add("[HeShe] insists on lapping up the last quivering bead of thick cum lingering on your [cockTip], wrapping [hisher] lips around your [cockDesc] and meekly cleaning you up.", parse);
				}
				else if(load > 3) {
					Text.Add("[Name] meekly slurps up your plentiful seed, swallowing every drop even as [hisher] belly starts to expand, straining from the immense amount of fluid being poured down [hisher] throat. When you’ve finally deposited the last of your last load into the willing feline, you wait a while, letting [himher] savour the thickness of your shaft.", parse);
				}
				else {
					Text.Add("You shoot your load into [possessive] eager maw, your seed splattering across [hisher] tongue. [HeShe] looks like [heshe] is enjoying the taste, eyes half-lidded and a faint blush on [hisher] cheeks.", parse);
				}
				Text.Add(" [Name] actually sucks on the [cockTip] of your cock as you attempt to withdraw it, unwilling to let any of your seed go to waste. [HeShe] looks very satisfied, licking [hisher] lips and purring softly. [HeShe] looks very tired after the ordeal, to the point of being unable to raise [hisher] head.", parse);
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("Give the kitty a tasty treat as your farewell gift!", parse)
		});
		options.push({ nameStr : "Body",
			func : function() {
				Text.Clear();
				parse["s"]        = player.NumCocks() > 1 ? "s" : "";
				parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
				Text.Add("Just as you are about to blow, you pull out, leaving [possessive] ass gaping wide. Rapidly jerking your [multiCockDesc], you prepare to give [himher] a creamy shower. The panting kitty looks up at you expectantly, tongue hanging out in the hopes of catching some of your seed. With a last tug, you feel your cock[s] throb, ready to unleash [itsTheir] load.", parse);
				Text.NL();
				if(load > 6) {
					Text.Add("The first shot slams into [name] like a large, sloppy battering ram, punching the air from [hisher] lungs. After the next few, [possessive] front is thoroughly plastered in your jizz, [himher] and the immediate area around [himher]. [HeShe] gasps for air, trying to swat off the thick ropes of spunk draping [hisher] face, only to have them replaced with your next shot. When you are done, the feline is soaked, [hisher] fur painted white from your excessive hosing.", parse);
				}
				else if(load > 3) {
					Text.Add("You use [possessive] body like an artist would a canvas, rapidly painting [himher] in thick, ropey strands of cum. Before long, [name] is covered from head to toe in your spunk. The feline looks pleasantly surprised at your massive output, licking [hisher] lips tentatively, tasting you.", parse);
				}
				else {
					Text.Add("You spill your load across [possessive] stomach, a stray strand of cum jetting farther than the other and landing across [hisher] muzzle. Draped in your spunk, [name] makes an unsteady attempt to clean [hisher] fur, only succeeding in spreading the mess and working it in.", parse);
				}
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("Mark the kitty as yours by showering [himher] in your seed!", parse)
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("The base of the artificial cock grinds against your [vagDesc], triggering your own climax. For a long while, you remain there, your [cockDesc] buried deep inside [possessive] overstimulated colon. Both of you are panting, sweat dripping from your exhausted bodies. When you do pull out, you leave [hisher] hole gaping, twitching slightly as if grasping after the withdrawn toy.", parse);
		
		PrintDefaultOptions();
	}
}

Scenes.Felines.WinGetBlowjob = function(cat, group, enc) {
	var parse = {
		oneof    : group ? " one of" : "",
		s        : group ? "s" : "",
		Name     : cat.NameDesc(),
		name     : cat.nameDesc(),
		HeShe    : cat.HeShe(),
		heshe    : cat.heshe(),
		HisHer   : cat.HisHer(),
		hisher   : cat.hisher(),
		himher   : cat.himher(),
		boyGirl  : cat.mfTrue("boy", "girl"),
		Possessive  : cat.Possessive(),
		possessive  : cat.possessive(),
		cockDesc    : function() { return player.FirstCock().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockTip     : function() { return player.FirstCock().TipShort(); },
		hand        : function() { return player.HandDesc(); },
		tongueDesc  : function() { return player.TongueDesc(); },
		stomachDesc : function() { return player.StomachDesc(); },
		hipsDesc    : function() { return player.HipsDesc(); },
		skinDesc    : function() { return player.SkinDesc(); },
		breastDesc  : function() { return player.FirstBreastRow().Short(); },
		ballsDesc   : function() { return player.BallsDesc(); },
		vagDesc     : function() { return player.FirstVag() ? player.FirstVag().Short() : "crotch"; }
	};
	
	Text.Clear();
	Text.Add("[Name] looks like [heshe] is about to protest when you pull out your [multiCockDesc] and commands [himher] to suck, but a displeased look from you is all it takes to change [hisher] mind. From the outcome of the fight, [name] knows very well that [heshe] cannot win against you. Looking mopey, [heshe] crawls over to you, looking up at you a bit uncertainly.", parse);
	Text.NL();
	Text.Add("Impatient, you nod for [himher] to get to it, even stroking[oneof] your cock[s], placing your other [hand] on top of [hisher] head. Taking a firm grip of [hisher] hair, you put [hisher] lips right in front of your [cockTip], instructing [himher] to be a good [boyGirl] and say aah. [Name] grudgingly agrees, licking you hesitantly. You let [himher] continue for a while before you grow bored at [hisher] apprehensive behavior, taking a firm grip at the back of [hisher] head and pushing your way inside.", parse);
	Text.NL();
	
	Sex.Blowjob(cat, player);
	player.Fuck(player.FirstCock(), 2);
	
	Text.Add("[Name] looks a bit panicked at first, but gradually gets used to the feeling of your [cockDesc] pumping into [hisher] mouth. You can even feel [himher] trying to help you along, [hisher] sandpapery tongue playing along the shaft.", parse);
	Text.NL();
	if(cat.FirstCock())
		Text.Add("Much to your amusement, [possessive] own cock is poking out of its sheath, becoming erect even as its owner is busy sucking another person off. You point this out, much to [hisher] embarrassment, but tell [himher] that [heshe] is free to pleasure [himher]self if [heshe] wants to… just as long as [heshe] doesn’t lose track of what is important. [Name] mutters discontentedly - as much as that is possible with a cock rammed down [hisher] throat - but after a while, one of [hisher] paws strays, grasping the erect member furtively.", parse);
	else
		Text.Add("The kitty is getting quite hot and bothered, and you can see that one of her hands is busy between her legs, probing her wet pussy and pinching her clit. You shrug - as long as she gets the job done, why complain?", parse);
	Text.NL();
	Text.Add("With your insistent urging and [possessive] grudging cooperation, you soon build a rhythm. ", parse);
	if(player.FirstCock().length.Get() > 35)
		Text.Add("Though [heshe] is able to swallow much of your [cockDesc], [hisher] eyes desperately plead with you to not force [himher] to take all of your massive erection. Probably for the best, as you don’t think [heshe]’d survive the ordeal. You resolve to make the most of it, each careful thrust pushing a tiny bit more down [hisher] straining throat.", parse);
	else if(player.FirstCock().length.Get() > 20)
		Text.Add("Somehow, [name] is able to take all of your [cockDesc], even though you see [hisher] throat bulging dangerously at the massive insertion. Sighing happily, you make a habit of pausing for a second when [possessive] lips are pressing against your crotch, making the feline growl uncomfortably.", parse);
	else
		Text.Add("[Name] is easily able to take your entire length, though it doesn’t make [himher] look any more comfortable doing it. [HeShe] probably just needs practice. Lots of practice.", parse);
	Text.NL();
	Text.Add("You tell [himher] that [heshe] is such a good cocksucker that [heshe] ought to do this more. One should always make sure to harness their talents, after all. ", parse);
	if(player.SubDom() > 30)
		Text.Add("Going on to tell [himher] that [heshe] ought to be the slut of the plains, you keep degrading [himher] playfully, driving your words home with your [cockDesc]. By now, you’re holding [possessive] head with both hands, making sure that [heshe] can’t get away from your incessant rutting.", parse);
	else if(player.SubDom() < -30)
		Text.Add("Caressing [hisher] hair gently, you urge [himher] on, letting [himher] become confident. You sigh euphorically as you feel furred paws grip your hips, holding you in place as [name] takes the lead, sucking your [cockDesc] like a champion.", parse);
	else
		Text.Add("Putting a bit more pressure on [name], you start rocking your hips a bit, keeping a light but firm hand on the back of [hisher] head. [HeShe] balks a little, but is somehow able to keep up.", parse);
	Text.NL();
	if(player.HasBalls()) {
		Text.Add("Much to your surprise, one of [possessive] paws hesitantly reach up to cradle your [ballsDesc], feeling their weight. Chuckling, you promise [himher] that you’ll soon give the good little kitty [hisher] cream, just like [heshe] wants. All [heshe] has to do is continue to be a good kitty.", parse);
		Text.NL();
	}
	Text.Add("You can feel that you aren’t going to last much longer, as [name] has gotten quite enthusiastic about [hisher] task. You briefly consider telling [himher], but figure it’ll be more fun if [heshe] discovered it on [hisher] own.", parse);
	Text.NL();
	Text.Add("Where do you want to spill your seed?", parse);
	Text.Flush();
	
	var load = player.OrgasmCum();
	var throat = false;
	
	
	
	
	//[Face][Mouth][Throat]
	var options = new Array();
	options.push({ nameStr : "Face",
		func : function() {
			Text.Clear();
			Text.Add("Just before you are about to blow, you roughly grab [name] by [hisher] hair, pulling [himher] off your [cockDesc]. For a brief moment, [heshe] looks confused, bereft of [hisher] new favorite toy, but your intentions quickly dawn on [himher] when [heshe] sees your throbbing [cockDesc] in its full glory.", parse);
			Text.NL();
			Text.Add("[Name] demurely closes [hisher] eyes, turns [hisher] face upward and waits for [hisher] shower. With the aid of your trusty [hand], you quickly comply, splattering your seed all over [hisher] visage.", parse);
			Text.NL();
			if(load > 6) {
				Text.Add("The force of your first blast looks like it almost knocks [name] off [hisher] knees, but [heshe] champions it out, rocking unsteadily as each shot hits [himher] like a cannonball. When you are done, [possessive] entire front is thoroughly coated in your semen, so much so it’ll probably take at least a day to clean [hisher] fur after this.", parse);
			}
			else if(load > 3) {
				Text.Add("[HeShe] looks surprised as you spill your larger than average load on [himher], glazing not only [hisher] hair and face, but also generously coating [hisher] chest and stomach area.", parse);
			}
			else {
				Text.Add("When you are done, a generous amount of seed is coating [possessive] face and hair, dripping down on [hisher] chest.", parse);
			}
			Text.Add(" Almost absently, [name] licks [hisher] lips, tasting your sticky treat.", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : Text.Parse("Shoot your load all over [hisher] face.", parse)
	});
	options.push({ nameStr : "Mouth",
		func : function() {
			Text.Clear();
			Text.Add("You pull out until only the [cockTip] of your [cockDesc] remains in [possessive] mouth, and then tell [himher] to start sucking. It quickly dawns on [himher] what your intention is, as you start to stroke your free length, but at this point, [name] seems to be resigned to [hisher] fate. If [heshe] is going to be a cocksucking slut from now on, [heshe] may as well try to enjoy it.", parse);
			Text.NL();
			if(load > 6) {
				Text.Add("[Possessive] eyes jump open in surprise as the first jet of cum all but fills [hisher] mouth. By the second shot, [hisher] cheeks are bulging, and the feline is making strangled noises as your semen flows freely down [hisher] throat. After bravely swallowing two more loads, the poor kitty gasps for air, coughing as [heshe] forces [himher]self off your [cockDesc]. Several more shots hit the embarrassed cat right in the face, sticking to [hisher] fur in long strands. In a final urge to please you, [name] squares [hisher] shoulders and wraps [hisher] lips around your [cockTip] to take the final blast, lapping it up eagerly.", parse);
			}
			else if(load > 3) {
				Text.Add("From [possessive] surprised expression, the sheer size of your load took [himher] unprepared. [HeShe] gags slightly as your semen slides its way down [hisher] throat, excess dripping freely from [hisher] lips.", parse);
			}
			else {
				Text.Add("You grunt as you finally come, shooting your load into [possessive] gaping maw. [HeShe] lets the semen linger for a while, some of it spilling out past [hisher] lips.", parse);
			}
			Text.Add(" With a loud pop, you pull out, and [name] swallows any of your seed still in [hisher] mouth without having to be told to.", parse);
			
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : Text.Parse("Pour it in [hisher] mouth and let [himher] taste it.", parse)
	});
	options.push({ nameStr : "Throat",
		func : function() {
			throat = true;
			Text.Clear();
			parse["deep"] = player.FirstCock().length.Get() > 30 ? Text.Parse("wrapping as much of your enormous shaft in the warm embrace of [possessive] straining mouth", parse) : Text.Parse("connecting [possessive] lips with your crotch", parse)
			Text.Add("Showing little regard for the safety of the poor kitty, you continue ramming your [cockDesc] down [hisher] throat, ignoring [hisher] panicked pleas. So close… so close… with a final thrust, [deep], you reach your climax, your seed jetting down the feline’s waiting maw.", parse);
			Text.NL();
			if(load > 6) {
				Text.Add("If not for the fact that you are already jammed halfway down [hisher] throat, [name] would never have been able to swallow your massive load. [Possessive] eyes widen in panic as you keep pouring wad after thick wad of your seed directly into [hisher] stomach, which is beginning to swell dangerously. By the time you feel the torrent of semen abating, [possessive] tummy is swollen like as if [heshe] was pregnant. On your way out, you deposit one last glob of spunk right on [hisher] tongue, granting [himher] the privilege of your taste. [Name] looks down at [hisher] stomach in wonder, rubbing it tenderly and", parse);
			}
			else if(load > 3) {
				Text.Add("It’s impossible for [name] to miss what is happening, as you unload wad after thick wad of your cream down [hisher] accommodating throat. You see [hisher] eyes widen slightly as you just keep coming and coming, perhaps worrying if [heshe] will be able to take it all. When you are done, you rub the [cockTip] of your [cockDesc] on [possessive] tongue, making sure that [heshe] gets a taste of you. [HeShe] looks down at [hisher] stomach apprehensively, rubbing it tenderly and", parse);
			}
			else {
				Text.Add("From your sudden twitching motions and the thick cream flowing down [hisher] throat, [name] understands what just happened. [HisHer] suspicions are confirmed when [heshe] tastes the salty tang of your sperm as you pull out, letting the [cockTip] of your [cockDesc] rest on [hisher] tongue for a moment. [Name] looks more humiliated than discomforted,", parse);
			}
			Text.Add(" gulping as [heshe] awaits what you have in store for [himher] next.", parse);
			
			player.subDom.IncreaseStat(70, 1);
			
			PrintDefaultOptions();
		}, enabled : player.FirstCock().length.Get() > 20,
		tooltip : Text.Parse("Ram your [cockDesc] as far down [hisher] throat as it will go.", parse)
	});
	Gui.SetButtonsFromList(options);
	
	
	Gui.Callstack.push(function() {
		Text.NL();
		if(cat.FirstCock()) {
			Text.Add("From the mess on the ground, you can tell that sometime during the process, [name] shot his own load, as evident by the sticky strands dripping from [hisher] softening barbed cock.", parse);
			Text.NL();
		}
		Text.Add("You ask [himher] if [heshe] enjoyed [hisher] cream, not really expecting an answer.", parse);
		Text.NL();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>”I-it wasn’t that bad,”</i> [heshe] mutters, blushing. [Name] refuses to meet your eye.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>”Cleaning this up will take me all day,”</i> [name] grumbles sullenly. Apparently, [heshe] wants to get started at it right away, as [heshe] starts licking your semen from [hisher] fur with [hisher] rough tongue.", parse);
		}, 1.0, function() { return !throat; });
		scenes.AddEnc(function() {
			Text.Add("<i>”Your cream is very… thick,”</i> [name] mutters. That almost sounded like a compliment.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>”So full...”</i> [heshe] moans joyfully, caressing [hisher] distended stomach.", parse);
		}, 1.0, function() { return throat && load > 3; });
		
		scenes.Get();
		
		Text.NL();
		Text.Add("Gathering up your things, you leave the satisfied feline and continue your adventures.", parse);
		Text.Flush();
		
		player.subDom.IncreaseStat(40, 1);
		world.TimeStep({minute: 30});
		
		Gui.NextPrompt(enc.finalize);
	});
}

Scenes.Felines.LossRegular = function() {
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
	
	if(party.Num() == 2)
		parse["comp"] = "you and " + party.Get(1).name;
	else if(party.Num() > 1)
		parse["comp"] = "you and your companions";
	else
		parse["comp"] = "";
	
	enc.finalize = function() {
		Encounter.prototype.onLoss.call(enc);
	};
	
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
	
	Text.Clear();
	Text.Add("You fall on your back,[comp] defeated by the ferocious cat[s]. ", parse);
	if(group)
		Text.Add("The felines bicker among themselves, though their argument seems to be less about what they are going to do with you than about who gets to do it first. All you can do is wait for them to decide.", parse);
	else
		Text.Add("Victorious, the feline settles down licking [hisher] fur thoughtfully, [hisher] fierce, unblinking eyes fixed on your prone form. After a tentative effort to crawl away is easily rebuked by your captor hopping over to place [himher]self in your path, you settle down and wait for what the feline will do to you. You don’t have to wait for long.", parse);
	Text.Flush();
	
	
	var scenes = new EncounterTable();
	if(male) {
		scenes.AddEnc(function() {
			return Scenes.Felines.LossCatchVaginal(male, group, enc);
		}, 1.0, function() { return player.FirstVag(); });
	}
	/*
	if(female) {
		scenes.AddEnc(function() {
			Text.Add("", parse);
			Text.NL();
		}, 1.0, function() { return true; });
	}
	*/
	if(herm) {
		scenes.AddEnc(function() {
			return Scenes.Felines.LossCatchVaginal(herm, group, enc);
		}, 1.0, function() { return player.FirstVag(); });
	}
	
	var ret = scenes.Get();
	
	if(!ret) {
		Gui.NextPrompt(enc.finalize);
	}
}

Scenes.Felines.LossCatchVaginal = function(cat, group, enc) {
	var parse = {
		oneof    : group ? " one of" : "",
		s        : group ? "s" : "",
		Name     : cat.NameDesc(),
		name     : cat.nameDesc(),
		HeShe    : cat.HeShe(),
		heshe    : cat.heshe(),
		HisHer   : cat.HisHer(),
		hisher   : cat.hisher(),
		himher   : cat.himher(),
		manherm  : cat.mfTrue("man", "herm"),
		maleherm : cat.mfTrue("male", "herm"),
		Possessive  : cat.Possessive(),
		possessive  : cat.possessive(),
		cockDesc    : function() { return player.FirstCock().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockTip     : function() { return player.FirstCock().TipShort(); },
		hand        : function() { return player.HandDesc(); },
		tongueDesc  : function() { return player.TongueDesc(); },
		stomachDesc : function() { return player.StomachDesc(); },
		hipsDesc    : function() { return player.HipsDesc(); },
		legsDesc    : function() { return player.LegsDesc(); },
		tailDesc    : function() { return player.HasTail().Short(); },
		wingDesc    : function() { return player.HasWings().Short(); },
		hair        : function() { return player.Hair().Short(); },
		skin        : function() { return player.SkinDesc(); },
		breastDesc  : function() { return player.FirstBreastRow().Short(); },
		nipsDesc    : function() { return player.FirstBreastRow().NipsShort(); },
		ballsDesc   : function() { return player.BallsDesc(); },
		buttDesc    : function() { return player.Butt().Short(); },
		vagDesc     : function() { return player.FirstVag() ? player.FirstVag().Short() : "crotch"; }
	};
	
	var dom    = player.SubDom() > 0;
	var virgin = player.FirstVag().virgin;
	
	Text.NL();
	Text.Add("[Name] approaches you, eyeing you with interest. From the way [heshe] is licking [hisher] lips, and the jutting erection between [hisher] legs, [hisher] intentions are quite obvious. As if you need any more proof, [heshe] takes hold of your clothing and starts trying to remove your gear.", parse);
	Text.NL();
	if(dom)
		Text.Add("You struggle in an effort to keep [himher] at bay, but you don't really have any fight left in you. Ultimately, you have no choice but to give [himher] what [heshe] wants.", parse);
	else
		Text.Add("You make no effort to stop [himher] from undressing you, and in fact you try as best you can to aid [name] in removing your clothes. You're eager for [himher] to begin, feeling your own desire kindled within you.", parse);
	Text.NL();
	parse["rump"] = player.LowerBodyType() == LowerBodyType.Single ? player.LegsDesc() : "rump";
	Text.Add("[Name] lifts your [rump], examining what you have to offer.", parse);
	Text.NL();
	if(player.Femininity() < 0) { // masculine
		if(player.FirstCock()) {
			parse["s"] = player.NumCocks() > 1 ? "s" : "";
			parse["balls"] = player.HasBalls() ? Text.Parse(" and your [ballsDesc]", parse) : "";
			Text.Add("The big cat's eyes flick down the length[s] of your [multiCockDesc][balls], frowning with disapproval before [heshe] finds something more enticing.", parse);
			Text.NL();
		}
		Text.Add("<i>”My, I didn’t expect someone like you to have such a pretty flower,”</i> [heshe] says, softly caressing your [vagDesc].", parse);
		Text.NL();
		if(dom) {
			Text.Add("You furrow your brows and tell [himher] to just get on with it already. You don't have to put up with empty flattery.", parse);
			Text.NL();
			Text.Add("<i>”As you wish,”</i> [heshe] states, stepping over and maneuvering you onto all fours.", parse);
		}
		else {
			parse["fur"] = player.HasSkin() ? "" : Text.Parse(", though your [skin] hides the color change", parse);
			Text.Add("Despite yourself, you blush in embarrassment[fur] and ask if [heshe] really thinks so.", parse);
			Text.NL();
			Text.Add("<i>”Of course, you’re so handsome that this came as quite the shock. But not an unpleasant one,”</i> [heshe] says, grinning as [heshe] leans over to look into your eyes.", parse);
			Text.NL();
			Text.Add("Sheepishly, you look back into [hisher] eyes, marveling at how deep they seem to be. When [heshe] starts to maneuver you onto all fours, you eagerly comply, anxious to feel [himher] inside of you.", parse);
		}
	}
	else {
		if(player.FirstCock()) {
			parse["balls"] = player.HasBalls() ? Text.Parse(" and your attendant [ballsDesc]", parse) : "";
			parse["things"] = player.HasBalls() == false && player.NumCocks() == 1 ? "a thing" : "things";
			Text.Add("[HisHer] eyes flick in surprise and more than a hint of disappointment over your [multiCockDesc][balls], clearly not expecting to see such [things] on you. As [hisher] eyes find what [heshe] is after, though, [heshe] smiles in contentment.", parse);
			Text.NL();
		}
		Text.Add("<i>”What a pretty flower you have, beautiful,”</i> [heshe] says, reaching to softly caress your [vagDesc].", parse);
		Text.NL();
		if(dom) {
			Text.Add("You snap back that [heshe] can spare you the flirtations, [heshe]'s already getting what [heshe] wants.", parse);
			Text.NL();
			Text.Add("<i>”As you wish,”</i> [heshe] states, stepping over and maneuvering you onto all fours.", parse);
		}
		else {
			parse["fur"] = player.HasSkin() ? "" : Text.Parse(" through your [skin]", parse);
			Text.Add("Blushing coyly[fur], you tell [himher] that [heshe]'s quite a specimen of [manherm]hood [himher]self.", parse);
			Text.NL();
			Text.Add("<i>”Thank you, my dear. I promise this will feel good for both us,”</i> [heshe] replies, leaning over to lick at your labia.", parse);
			Text.NL();
			Text.Add("You squeal suddenly in shock, wriggling as the warm, wet flesh brushes tantalisingly against your lower lips. Shyly, you reply that you have a feeling [heshe]'ll keep [hisher] word.", parse);
			Text.NL();
			Text.Add("<i>”Of course I will, now be a darling and get on all fours for me,</i> [heshe] says, licking [hisher] lips.", parse);
			Text.NL();
			Text.Add("You hasten to obey, scrambling over on the spot and assuming the indicated position, all but presenting yourself in your eagerness.", parse);
		}
	}
	Text.NL();
	var tail = player.HasTail();
	parse["tail"] = tail ? "and gently stroking your [tailDesc] with the other" : "";
	Text.Add("[Name] approaches you from behind, laying a hand on your [hipsDesc] [tail]. Without saying a word [heshe] leans forward to kiss your lower back, trailing soft pecks along your spine as [heshe] simultaneously aligns [himher]self with your [vagDesc].", parse);
	Text.NL();
	parse["bitingbackUttering"] = dom > 0 ? "biting back" : "uttering";
	Text.Add("Involuntarily you arch your back, [bitingbackUttering] a moan of desire as you feel [hisher] feather-light touch dancing down your back. You're intimately aware of the warmth of [hisher] cock as it hovers temptingly just outside your [vagDesc], and you feel the ache for [himher] to start claiming you well inside your stomach.", parse);
	Text.NL();
	Text.Add("[HisHer] hands slide to your [buttDesc], gripping the cheeks and spreading them apart. You’re dimly aware of [hisher] claws gently prickling your [skin].", parse);
	Text.NL();
	parse["virgin"] = virgin ? " virgin" : "";
	Text.Add("<i>”Here I come~”</i> [name] says in a singsong voice, thrusting himself into your[virgin] folds.", parse);
	Text.NL();
	
	Sex.Vaginal(cat, player);
	player.FuckVag(player.FirstVag(), cat.FirstCock(), 3);
	
	if(virgin) {
		parse["tail"] = player.HasTail() ? Text.Parse("[tailDesc]", parse) : "back";
		if(dom) {
			Text.Add("You bite your lip savagely to avoid crying out as [heshe] tears through your hymen, but you can't help the way your body quakes in pain, abused folds instinctively clamping down on [hisher] intruding member.", parse);
			Text.NL();
			Text.Add("<i>”So tight! Sorry my dear, I didn’t think you were a virgin,”</i> [heshe] apologizes, stroking your [tail]. <i>“I promise I’ll make your first time memorable,”</i> [heshe] grins, leaning over to give your back a gentle kiss.", parse);
		}
		else {
			Text.Add("You cry out in pain as your hymen is torn, your [maleherm] partner having just claimed your female virginity. Unconsciously, your body shudders at the sensations, instinctively squeezing [hisher] cock in an effort to try and keep [himher] at bay.", parse);
			Text.NL();
			Text.Add("<i>”Shh, it’ll pass, don’t worry.”</i> [heshe] softly caresses your [tail], waiting for you to adjust to [hisher] girth.", parse);
		}
	}
	else {
		Text.Add("You moan unconsciously as you feel [himher] spearing inside of you, your [vagDesc] enveloping [himher] in response. You can feel its warmth burning inside of you, its strange bristly surface stroking and tickling your walls in all directions. Your whole body shivers and unthinkingly you clench down on [himher].", parse);
		Text.NL();
		Text.Add("[Name] yowls as [heshe] hilts within you, obviously enjoying [himher]self as [heshe] waits for you to adjust to [hisher] girth.", parse);
	}
	Text.NL();
	parse["herm"] = cat.mfTrue("", ", gently pressing her boobs against you");
	parse["tits"] = player.FirstBreastRow().Size() > 3 ? Text.Parse(" massage your [breastDesc] and ", parse) : "";
	Text.Add("Once the feline deems you ready, [heshe] begins pumping slowly. First at a slow, drawn-out rhythm, but as your juices mix with [hisher] own, [heshe] hastens the pace. [Name] leans over your back[herm]. [HisHer] hands trail along your sides to gently[tits] pinch your [nipsDesc].", parse);
	Text.NL();
	parse["dom"] = dom ? "However involuntarily, y" : "Y";
	Text.Add("You shudder as [heshe] tweaks and plays with you, rewarding [himher] by clenching down on [hisher] cock. You can feel [hisher] bristles inside of you, each fleshy barb dragging against a different point inside of you with each thrust [heshe] makes. The sensation is indescribable, a strange tickling feeling from dozens of points inside of you that only stokes the pleasure of [hisher] thrusts. [dom]ou start to thrust your [buttDesc] back into [hisher] crotch, trying to match [hisher] rhythm, coaxing [himher] to go faster.", parse);
	Text.NL();
	Text.Add("[Possessive] thrusts grows more enthusiastic as you begin reciprocating [hisher] efforts. [HeShe] hugs your midriff, gaining more leverage so that [heshe] can pump [himher]self deeper into you. As [heshe] does so, you can feel something vibrating against your back. The sound that follows confirms your suspicion, [heshe]’s purring.", parse);
	Text.NL();
	if(dom)
		Text.Add("A flush of mingled shame and pride bubbles through you as you realise your rapist is so thoroughly enamored with your [vagDesc], the conflicted emotions forming a knot in your guts. Still, you have to concede [heshe] is good... you're getting close yourself...", parse);
	else
		Text.Add("You smile proudly as you hear the rumbling purrs vibrating through your [skin]; to think, you're making [himher] so very happy with your body! And, oohh, you're getting so close, too! You're going to cum soon... you hope [heshe] is feeling the same...", parse);
	Text.NL();
	Text.Add("[HeShe] nuzzles into your neck, tickling you with [hisher] whiskers. <i>“I’m almost there, dear. Are you ready for this?”</i> [heshe] asks in a whisper.", parse);
	Text.NL();
	parse["reluctantly"] = dom ? " reluctantly" : "";
	Text.Add("You nod and reply that you're ready,[reluctantly] admitting that you're close to cumming too.", parse);
	Text.NL();
	parse["fem"] = player.mfFem("handsome", "pretty");
	Text.Add("<i>”Tell me, then. Where do you want me to cum? I’d be loathe to make such a [fem] girl like you pregnant against their will. Though I’m sure our kittens would be the cutest,”</i> [heshe] adds with a smile. </i>“What do you say? Would you carry my kits?”</i>", parse);
	Text.Flush();
	
	//[Inside][Outside]
	var options = new Array();
	options.push({ nameStr : "Inside",
		func : function() {
			Text.Clear();
			Text.Add("<i>”I’m so glad to hear you say this, my darling. I’ll make sure to shoot as deep inside you as I can,”</i> [heshe] says, smiling as [heshe] redoubles [hisher] efforts to thrust into you.", parse);
			Text.NL();
			if(dom)
				Text.Add("Like [hisher] weak seed will be strong enough to get you pregnant in the first place, you assure yourself, even as you rock your hips back against [himher]. You so close now, you just want to get this over with!", parse);
			else {
				parse["handsomebeautiful"] = cat.mfTrue("handsome", "beautiful");
				Text.Add("A thrill races along your spine on hearing those words. You tell [himher] that you couldn't hope for something more wonderful than to bear the kittens of such a [handsomebeautiful], virile [manherm]! For emphasis, you start to grind yourself back against [himher] with all the strength you can muster, wringing [hisher] dick with your cunt in an effort to milk [hisher] inevitable orgasm.", parse);
			}
			Text.NL();
			Text.Add("With one last powerful buck, [name] yowls and begins firing [hisher] seed deep inside you. Spurt after spurt of warm, white semen enters you, and you cannot help but moan as your [vagDesc] is filled with cat-cream.", parse);
			Text.NL();
			Text.Add("The warm wetness inside of you triggers your own climax, and you sing out - appropriately enough - like a cat in heat as you cum. Your [vagDesc] wrings at the cat's bristled member, your juices flowing thickly across [hisher] hilt and running down onto [hisher] balls. ", parse);
			if(player.FirstCock()) {
				parse["notS"] = player.NumCocks() > 1 ? "" : "s";
				parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
				var cum = player.OrgasmCum();
				parse["cum"] = cum > 6 ? "gushing" : cum > 3 ? "spattering" : "drizzling";
				Text.Add("Your [multiCockDesc] explode[notS] in [itsTheir] own climax, your seed [cum] onto the earth below you. ", parse);
			}
			Text.Add("You shudder and moan as the electricity of climax races through your body, singing through you until finally it seeps away, leaving behind its soothing warm afterglow.", parse);
			if(player.FirstCock())
				Text.Add("Between your [legsDesc], your [multiCockDesc] go limp, swaying loosely between your thighs.", parse);
			Text.NL();
			Text.Add("[Name] collapses atop you, sending both of you crashing onto the ground. <i>”Ah, thanks my dear. I really needed that,”</i> [heshe] says, licking your neck affectionately.", parse);
			Text.NL();
			if(dom) {
				Text.Add("You huff indignantly and wriggle your shoulders, telling [himher] to keep [hisher] tongue to [himher]self and to get off of you already. [HeShe] got what [heshe] was after.", parse);
				Text.NL();
				Text.Add("<i>”Defiant to the very end, I see. But I’ll do as you ask,”</i> [heshe] says, giving you a soft peck on the neck and withdrawing from your used [vagDesc].", parse);
			}
			else {
				Text.Add("<i>”Not half as much as I did,”</i> you reply, nuzzling affectionately back as best you can from your position. One hand instinctively goes to your stomach, and you ask if [heshe] really thinks you'd be a good mother to [hisher] kittens.", parse);
				Text.NL();
				Text.Add("<i>”A sweet thing like you? Of course you will,”</i> [heshe] purrs.", parse);
				Text.NL();
				parse["tail"] = player.HasTail() ? player.HasTail().Short() : "butt";
				Text.Add("The two of you stay locked in this position for a moment longer before [heshe] finally announces, <i>“I’m sorry, my dear. But I can’t stay with you.”</i> [HeShe] extracts [himher]self from your used [vagDesc] and gently pats you on your [tail].", parse);
			}
			Text.NL();
			parse["s"] = enc.enemy.Num() > 2 ? "s" : "";
			parse["comp"] = group ? Text.Parse(" calling [hisher] friend[s] over and", parse) : "";
			Text.Add("<i>”I really need to be going, but I hope to run into you again,”</i> [heshe] says,[comp] walking away.", parse);
			Text.Flush();
			
			player.AddLustFraction(-1);
			
			Gui.NextPrompt(enc.finalize);
		}, enabled : true,
		tooltip : Text.Parse("Tell [himher] to cum inside. You wouldn’t mind giving birth to a cute kitten or two!", parse)
	});
	options.push({ nameStr : "Outside",
		func : function() {
			Text.Clear();
			Text.Add("<i>”As you wish”</i> [heshe] replies, thrusting into you forcefully a couple more times; then finally withdrawing and leaning back as [hisher] hands fly to [hisher] throbbing cathood, violently stroking.", parse);
			Text.NL();
			parse["tail"]  = player.HasTail() ? Text.Parse(" [tailDesc],", parse) : "";
			parse["wings"] = player.HasWings() ? Text.Parse(" [wingDesc],", parse) : "";
			Text.Add("With a yowl of satisfaction, [name] cums. Strands of white fly through the air to settle all over your [buttDesc],[tail] back,[wings] and [hair]. This is one messy kitty, you think to yourself as a few more strands of warmth fall upon your prone form.", parse);
			Text.NL();
			Text.Add("You groan in frustration, feeling your own need throbbing down below. You're so close, but you can't manage to climb the edge on your own... As your [vagDesc] flexes in frustration, you feel something warm and wet glide suddenly across your [buttDesc]. [Name] is licking you!", parse);
			Text.NL();
			Text.Add("<i>”Don’t worry, I didn’t forget about you,”</i> you hear [himher] say as [heshe] slowly approaches your used pussy and sticks [hisher] tongue inside, penetrating you with [hisher] tongue and licking all over your vaginal walls.", parse);
			Text.NL();
			Text.Add("Your eyes squeeze themselves shut and you moan loudly, your cunt clamping down on the squirming intruder inside of you. It's just what you needed to push you over the edge, and with an ecstatic cry, your whole body quakes as your climax, letting your juices seep over [hisher] tongue.", parse);
			if(player.FirstCock())
				Text.Add("Ignored by both of you until now, you feel your [multiCockDesc] erupt, spraying seed across the ground below you.", parse);
			Text.NL();
			Text.Add("[Name] drinks down all of your femcum with gusto, even licking around your honeypot to ensure [heshe] gets every last drop of your sweet-tasting juices.", parse);
			Text.NL();
			parse["s"] = enc.enemy.Num() > 2 ? "s" : "";
			parse["comp"] = group ? Text.Parse(", calling [hisher] companion[s] to follow after [himher]", parse) : "";
			Text.Add("<i>”Mmm, delicious,”</i> [heshe] states, licking [hisher] lips. <i>”I’ll be going now, dear. But I hope to run into you again.”</i> [HeShe] gives your [buttDesc] a parting kiss and walks away[comp].", parse);
			Text.Flush();
			
			player.AddLustFraction(-1);
			
			Gui.NextPrompt(enc.finalize);
		}, enabled : true,
		tooltip : Text.Parse("You don’t want to risk pregnancy. Tell [himher] to cum outside.", parse)
	});
	Gui.SetButtonsFromList(options);
	
	return true;
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
