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
	this.isLion = true;
}
Lion.prototype = new Entity();
Lion.prototype.constructor = Lion;







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
		GroupName  : mainCat.GroupName(),
		groupName  : mainCat.groupName()
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
	
	var options = new Array();
	if(female) {
		options.push({ nameStr : "Fuck vag(F)",
			func : function() {
				Scenes.Felines.WinFuckVag(female, enc);
			}, enabled : true,
			tooltip : "Get some pussy."
		});
		options.push({ nameStr : "Fuck ass(F)",
			func : function() {
				Scenes.Felines.WinFuckButt(female, enc);
			}, enabled : true,
			tooltip : "Push[oneof] [himher] down on [hisher] back and fuck [himher] in the ass."
		});
		options.push({ nameStr : "Get blowjob(F)",
			func : function() {
				Scenes.Felines.WinGetBlowjob(female, enc);
			}, enabled : true,
			tooltip : "Order[oneof] [himher] to give you a blowjob."
		});
	}
	if(male) {
		
		options.push({ nameStr : "Fuck ass(M)",
			func : function() {
				Scenes.Felines.WinFuckButt(male, enc);
			}, enabled : true,
			tooltip : "Push[oneof] [himher] down on [hisher] back and fuck [himher] in the ass."
		});
		options.push({ nameStr : "Get blowjob(M)",
			func : function() {
				Scenes.Felines.WinGetBlowjob(male, enc);
			}, enabled : true,
			tooltip : "Order[oneof] [himher] to give you a blowjob."
		});
	}
	if(herm) {
		options.push({ nameStr : "Fuck vag(H)",
			func : function() {
				Scenes.Felines.WinFuckVag(herm, enc);
			}, enabled : true,
			tooltip : "Get some pussy."
		});
		options.push({ nameStr : "Fuck ass(H)",
			func : function() {
				Scenes.Felines.WinFuckButt(herm, enc);
			}, enabled : true,
			tooltip : "Push[oneof] [himher] down on [hisher] back and fuck [himher] in the ass."
		});
		options.push({ nameStr : "Get blowjob(H)",
			func : function() {
				Scenes.Felines.WinGetBlowjob(herm, enc);
			}, enabled : true,
			tooltip : "Order[oneof] [himher] to give you a blowjob."
		});
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

Scenes.Felines.WinFuckVag = function(cat, enc) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}

Scenes.Felines.WinFuckButt = function(cat, enc) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}

Scenes.Felines.WinGetBlowjob = function(cat, enc) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
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
