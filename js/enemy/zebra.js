/*
 * 
 * Zebra Shaman
 * 
 */

Scenes.ZebraShaman = {};

function ZebraShaman(levelbonus) {
	Entity.call(this);
	
	//this.avatar.combat     = Images.wolf; TODO
	this.name              = "Shaman";
	this.monsterName       = "the zebra shaman";
	this.MonsterName       = "The zebra shaman";
	this.body.DefMale();
	this.FirstCock().thickness.base = 7;
	this.FirstCock().length.base = 35;
	this.Balls().size.base = 6;
	
	this.maxHp.base        = 250;
	this.maxSp.base        = 150;
	this.maxLust.base      = 80;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 30;
	this.dexterity.base    = 16;
	this.intelligence.base = 30;
	this.spirit.base       = 35;
	this.libido.base       = 16;
	this.charisma.base     = 18;
	
	this.level             = 6 + Math.floor(Math.random() * 4);
	this.sexlevel          = 2;
	if(levelbonus)
		this.level += levelbonus;
	
	this.combatExp         = 6 + this.level;
	this.coinDrop          = 8 + this.level * 4;
	//TODO
	this.body.SetRace(Race.horse);
	this.body.SetBodyColor(Color.gray);
	
	this.body.SetEyeColor(Color.blue);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.horse, Color.black);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
ZebraShaman.prototype = new Entity();
ZebraShaman.prototype.constructor = ZebraShaman;

ZebraShaman.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Equinium });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseCum });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseHair });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseShoe });
	return drops;
}

ZebraShaman.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.name + " acts!");
	Text.NL();
	Text.Flush();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	//TODO
	var choice = Math.random();
	if(choice < 0.5)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.7 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.Pierce.Use(encounter, this, t);
	else if(choice < 0.95 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this))
		Abilities.Physical.CrushingStrike.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}

Scenes.ZebraShaman.LoneEnc = function(levelbonus) {
 	var enemy = new Party();
 	var zebra = new ZebraShaman(levelbonus);
	enemy.AddMember(zebra);
	var enc = new Encounter(enemy);
	enc.zebra = zebra;
	
	enc.onEncounter = Scenes.ZebraShaman.Encounter;
	enc.onVictory   = Scenes.ZebraShaman.OnWin;
	/* TODO
	enc.onLoss = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}

Scenes.ZebraShaman.Encounter = function() {
	var enc = this;
	
	var parse = {
		weapon : player.WeaponDesc()
	};
	
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"]    = party.Num()  > 1 ? Text.Parse(" and [comp]", parse) : "";
	
	Text.Clear();
	Text.Add("After wandering the rugged, uneven landscape without finding anything of note, you[c] decide it would be best to find a good spot to rest and recuperate before continuing. To get your bearings, you climb a hill to survey the environment. To your luck, you spot a watering hole located just at the bottom of a rather steep cliff nearby.", parse);
	Text.NL();
	Text.Add("You make your way down carefully so as to not lose your footing, eventually arriving at the basin of the pool. Kneeling down, you place a hand in the water. The cool sensation is enough to send a delightful shiver down your spine. You splash some of the cold water on your face to reinvigorate yourself, as well as to wash off some of the dirt and grime you may have picked up on your journey. Cupping your hands, you scoop up some water and bring it to your lips. Tilting your head back, you let it pour down your throat and quench your thirst. You drink down several more gulps of the cool liquid when, suddenly, you’re struck with a sense of dizziness. Uh oh, was there something in the water?", parse);
	Text.NL();
	Text.Add("Slowly, your mind and sight grow fuzzier, and your body grows limp. ", parse);
	if(party.Num() > 1) {
		parse["s"] = party.Num() == 2 ? "s" : "";
		parse["hisher"] = party.Num() == 2 ? party.get(1).hisher() : "their";
		Text.Add("Even [comp] seem[s] to be having some trouble with [hisher] thoughts. ", parse);
	}
	Text.Add("As you struggle to compose yourself, you hear a faint sound in the distance. At first you can’t quite understand what it is, but gradually the sound grows louder and louder. Soon you can clearly hear the sound of chanting. Looking up, you can just barely make out a figure standing before you, quite possibly the source of your current predicament.", parse);
	Text.NL();
	Text.Add("Quickly, you throw yourself to your feet with what strength you still possess and shake your head furiously, throwing some slaps in there for good measure. It does the trick. The fog the chanter puts your mind into slowly dissipates, and you get your first good glimpse at your would-be manipulator.", parse);
	Text.NL();
	Text.Add("Standing before you <i>on</i> the water is a zebra-morph, clearly a magic user by the look of things. He is cloaked in an open leather robe marked with tribal symbols and a simple loincloth to conceal his genitalia. He wears a simple rope belt around his waist which holds several small pouches, and another much larger pouch rests on his left hip held up by a shoulder strap. From the sounds it produces you get the feeling it’s stocked full of bottles, possibly filled with various concoctions.", parse);
	Text.NL();
	Text.Add("His face and body are covered in piercings and jewelry, the most notable of which is the gold nose ring that is encrusted with an ornate pattern. In his right hand he holds a rather long wooden staff tipped with a green gem that gives off an eerie glow.", parse);
	Text.NL();
	Text.Add("You step back and raise your [weapon], ready to fight. Seeing this unexpected turn of events, the zebra morph also readies his staff and prepares himself for battle.", parse);
	Text.NL();
	Text.Add("You’re fighting a Zebra Shaman!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		enc.PrepCombat();
	});
}

Scenes.ZebraShaman.OnWin = function() {
	var enc = this;
	var zebra = enc.zebra;
	SetGameState(GameState.Event);
	
	var parse = {
		weapon : player.WeaponDesc()
	};
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("The shaman collapses to his knees before you, just barely able to keep himself upright with the help of his staff. As you lower your [weapon], the shaman speaks to you. <i>“You’re quite remarkable,”</i> he grunts between labored breaths. <i>“I’ve never encountered such a strong-willed individual who could overcome my mind-bending. I... do want to apologize for my behavior, however. I had no intentions of fighting you.”</i> Oh really? That’s not how it came across to you. If he wasn’t intent on fighting or harming you, then what exactly was he doing?", parse);
		Text.NL();
		parse["scout"] = party.Num() > 1 ? "scouts" : "a scout";
		Text.Add("<i>“I feared that you were [scout] sent by Malice,”</i> he continues, <i>“so I hid myself and cast a spell, hoping to force you back the way you came. What I didn’t count on was your ability to resist my magic so well.”</i> He chuckles to himself. <i>“I’ve never seen anything quite like it.”</i>", parse);
		Text.NL();
		Text.Add("Whatever the case may be, you don’t appreciate his attempts to warp your mind. Still, there really isn’t much to prove at this point. Perhaps it would be best to leave the shaman to himself and continue on your journey.", parse);
		Text.NL();
		Text.Add("Or maybe you can coax him into having a bit of fun with you?", parse);
		Text.Flush();
		
		//[Fuck him] [Ride him] [Leave]
		var options = new Array();
		options.push({ nameStr : "Fuck him",
			func : function() {
				Scenes.ZebraShaman.OnWinFuckHim(enc);
			}, enabled : player.FirstCock(),
			tooltip : "Perhaps you can convince him to have a bit of fun with you? After all, he did assault you… letting you fuck his ass is the least he can do."
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
		Gui.SetButtonsFromList(options, true, function() {
			PrintDefaultOptions(); //TODO
		});
	});
	Encounter.prototype.onVictory.call(enc);
}

Scenes.ZebraShaman.OnWinFuckHim = function(enc) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	Gui.NextPrompt();
}

