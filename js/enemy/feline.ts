/*
 *
 * Wildcat, lvl 1-2
 *
 */
import * as _ from 'lodash';

import { Entity } from '../entity';
import { Images } from '../assets';
import { TF } from '../tf';
import { AppendageType } from '../body/appendage';
import { Gender } from '../body/gender';
import { Abilities } from '../abilities';
import { Element } from '../damagetype';
import { Race, RaceDesc } from '../body/race';
import { Color } from '../body/color';
import { WorldTime, GAME, TimeStep } from '../GAME';
import { SetGameState, GameState } from '../gamestate';
import { Gui } from '../gui';
import { Text } from '../text';
import { AlchemyItems } from '../items/alchemy';
import { IngredientItems } from '../items/ingredients';
import { AlchemySpecial } from '../items/alchemyspecial';
import { EncounterTable } from '../encountertable';
import { Party } from '../party';
import { Encounter } from '../combat';
import { PregnancyHandler } from '../pregnancy';
import { Sex } from '../entity-sex';
import { Cock } from '../body/cock';
import { LowerBodyType } from '../body/body';
import { Season } from '../time';

let FelinesScenes : any = {};

export class Wildcat extends Entity {
	race : RaceDesc;
	desc : string;
	isLion : boolean;

	constructor(gender : Gender, levelbonus? : number) {
		super();

		this.ID = "wildcat";

		this.race = Race.Feline;

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
		if(this.FirstVag()) {
			this.FirstVag().capacity.base = 8;
		}
		this.Butt().capacity.base = 8;
		if(Math.random() < 0.6)
			this.Butt().virgin = false;

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

		this.elementDef.dmg[Element.mWater]  = -0.5;

		this.level             = 1;
		if(Math.random() > 0.8) this.level++;
		this.level             += levelbonus || 0;
		this.sexlevel          = 1;

		this.combatExp         = this.level;
		this.coinDrop          = this.level * 4;

		this.body.SetRace(Race.Feline);
		this.body.SetBodyColor(Color.brown);
		this.body.SetEyeColor(Color.green);
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Feline, Color.brown);

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}
	
	DropTable() {
		var drops = [];
		if(Math.random() < 0.05) drops.push({ it: AlchemyItems.Felinix });
		if(Math.random() < 0.5)  drops.push({ it: IngredientItems.Whiskers });
		if(Math.random() < 0.5)  drops.push({ it: IngredientItems.HairBall });
		if(Math.random() < 0.5)  drops.push({ it: IngredientItems.CatClaw });

		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.GoatMilk });
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.SheepMilk });
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.CowMilk });
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.RawHoney });
		if(Math.random() < 0.05) drops.push({ it: IngredientItems.HorseCum });
		if(Math.random() < 0.05) drops.push({ it: IngredientItems.LizardEgg });
		if(Math.random() < 0.05) drops.push({ it: IngredientItems.Trinket });
		if(Math.random() < 0.05) drops.push({ it: IngredientItems.MFluff });

		if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Avia });
		if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Bovia });
		if(Math.random() < 0.01) drops.push({ it: AlchemySpecial.Tigris });

		return drops;
	}

	Act(encounter : any, activeChar : any) {
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Meow!");
		Text.NL();

		// Pick a random target
		var t = this.GetSingleTarget(encounter, activeChar);

		var parseVars = {
			name   : this.name,
			hisher : this.hisher(),
			tName  : t.name
		};

		var choice = Math.random();
		if(choice < 0.7)
			Abilities.Attack.Use(encounter, this, t);
		else if(choice < 0.9 && Abilities.Physical.Pierce.enabledCondition(encounter, this))
			Abilities.Physical.Pierce.Use(encounter, this, t);
		else
			Abilities.Seduction.Tease.Use(encounter, this, t);
	}

}


FelinesScenes.WildcatEnc = function(levelbonus : number) {
	var enemy = new Party();
	var r = Math.random();
	if(r < 0.2) {
		enemy.AddMember(new Wildcat(Gender.herm, levelbonus));
		enemy.AddMember(new Wildcat(Gender.male, levelbonus));
		enemy.AddMember(new Wildcat(Gender.female, levelbonus));
	}
	else if(r < 0.4) {
		enemy.AddMember(new Wildcat(Gender.male, levelbonus));
		enemy.AddMember(new Wildcat(Gender.female, levelbonus));
		enemy.AddMember(new Wildcat(Gender.female, levelbonus));
		enemy.AddMember(new Wildcat(Gender.female, levelbonus));
	}
	else {
		enemy.AddMember(new Wildcat(Gender.Random([3,4,1]), levelbonus));
		for(var i = 0; i < 3; i++) {
			if(Math.random() < 0.5)
				enemy.AddMember(new Wildcat(Gender.Random([3,4,1]), levelbonus));
		}
	}
	var enc = new Encounter(enemy);

	enc.onEncounter = FelinesScenes.Intro;
	enc.onVictory   = FelinesScenes.WinPrompt;
	enc.onLoss      = FelinesScenes.LossRegular;
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}

export class Puma extends Wildcat {
	constructor(gender : Gender, levelbonus? : number) {
		super(gender, levelbonus);

		this.ID = "puma";

		this.race = Race.Puma;

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
}

FelinesScenes.PumaEnc = function(levelbonus : number) {
	var enemy = new Party();
	var r = Math.random();
	if(r < 0.2) {
		enemy.AddMember(new Puma(Gender.herm, levelbonus));
		enemy.AddMember(new Puma(Gender.male, levelbonus));
		enemy.AddMember(new Puma(Gender.female, levelbonus));
	}
	else if(r < 0.4) {
		enemy.AddMember(new Puma(Gender.male, levelbonus));
		enemy.AddMember(new Puma(Gender.female, levelbonus));
		enemy.AddMember(new Puma(Gender.female, levelbonus));
		enemy.AddMember(new Puma(Gender.female, levelbonus));
	}
	else {
		enemy.AddMember(new Puma(Gender.Random([3,4,1]), levelbonus));
		for(var i = 0; i < 3; i++) {
			if(Math.random() < 0.5)
				enemy.AddMember(new Puma(Gender.Random([3,4,1]), levelbonus));
		}
	}
	var enc = new Encounter(enemy);

	enc.onEncounter = FelinesScenes.Intro;
	enc.onVictory   = FelinesScenes.WinPrompt;
	enc.onLoss      = FelinesScenes.LossRegular;
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}

export class Jaguar extends Wildcat {
	constructor(gender : Gender, levelbonus? : number) {
		super(gender, levelbonus);

		this.ID = "jaguar";

		this.race = Race.Jaguar;

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
}

FelinesScenes.JaguarEnc = function(levelbonus : number) {
	var enemy = new Party();
	var r = Math.random();
	if(r < 0.2) {
		enemy.AddMember(new Jaguar(Gender.herm, levelbonus));
		enemy.AddMember(new Jaguar(Gender.male, levelbonus));
		enemy.AddMember(new Jaguar(Gender.female, levelbonus));
	}
	else if(r < 0.4) {
		enemy.AddMember(new Jaguar(Gender.male, levelbonus));
		enemy.AddMember(new Jaguar(Gender.female, levelbonus));
		enemy.AddMember(new Jaguar(Gender.female, levelbonus));
		enemy.AddMember(new Jaguar(Gender.female, levelbonus));
	}
	else {
		enemy.AddMember(new Jaguar(Gender.Random([3,4,1]), levelbonus));
		for(var i = 0; i < 3; i++) {
			if(Math.random() < 0.5)
				enemy.AddMember(new Jaguar(Gender.Random([3,4,1]), levelbonus));
		}
	}
	var enc = new Encounter(enemy);

	enc.onEncounter = FelinesScenes.Intro;
	enc.onVictory   = FelinesScenes.WinPrompt;
	enc.onLoss      = FelinesScenes.LossRegular;
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}

export class Lynx extends Wildcat {
	constructor(gender : Gender, levelbonus? : number) {
		super(gender, levelbonus);
		Wildcat.call(this, gender, levelbonus);
		this.ID = "lynx";

		this.race = Race.Lynx;

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
}

FelinesScenes.LynxEnc = function(levelbonus : number) {
	var enemy = new Party();
	var r = Math.random();
	if(r < 0.2) {
		enemy.AddMember(new Lynx(Gender.herm, levelbonus));
		enemy.AddMember(new Lynx(Gender.male, levelbonus));
		enemy.AddMember(new Lynx(Gender.female, levelbonus));
	}
	else if(r < 0.4) {
		enemy.AddMember(new Lynx(Gender.male, levelbonus));
		enemy.AddMember(new Lynx(Gender.female, levelbonus));
		enemy.AddMember(new Lynx(Gender.female, levelbonus));
		enemy.AddMember(new Lynx(Gender.female, levelbonus));
	}
	else {
		enemy.AddMember(new Lynx(Gender.Random([3,4,1]), levelbonus));
		for(var i = 0; i < 3; i++) {
			if(Math.random() < 0.5)
				enemy.AddMember(new Lynx(Gender.Random([3,4,1]), levelbonus));
		}
	}
	var enc = new Encounter(enemy);

	enc.onEncounter = FelinesScenes.Intro;
	enc.onVictory   = FelinesScenes.WinPrompt;
	enc.onLoss      = FelinesScenes.LossRegular;
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}

// TODO
export class Lion extends Wildcat {
	constructor(gender : Gender, levelbonus? : number) {
		super(gender, levelbonus);

		this.ID = "lion";

		this.race = Race.Lion;

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
}



FelinesScenes.Impregnate = function(mother : Entity, father : Wildcat, slot : number) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : father,
		race   : father.race,
		num    : 3,
		time   : 24 * 24
	});
}

FelinesScenes.Intro = function() {
	var enc     = this;
	var enemy   = enc.enemy;
	var group   = enemy.Num() > 1;
	var mainCat = enemy.Get(0);

	if(Math.random() > 0.5)
		enc.onEncounter = FelinesScenes.IntroRegular;
	else
		enc.onEncounter = FelinesScenes.IntroStalking;
	enc.onEncounter();
}

FelinesScenes.IntroRegular = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	var enc     = this;
	var enemy   = enc.enemy;
	var group   = enemy.Num() > 1;
	var mainCat = enemy.Get(0);

	var parse : any = {
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
		bodyBodies : group ? "bodies" : "body",
		possesive  : group ? mainCat.possessivePlural() : mainCat.possessive(),
		GroupName  : mainCat.GroupName,
		groupName  : mainCat.groupName
	};
	parse = mainCat.ParserPronouns(parse, "m1");
	parse["Oneof"] = group ? Text.Parse("One of [groupName]", parse) : parse["m1Name"];
	parse["selfSelves"] = party.Alone() ? "self" : "selves";
	parse["grp"] = group ? ", shifting uncomfortably as your foes spread out, trying to surround you" : "";

	Text.Clear();
	Text.Add("You are wandering around the area when you come across a[groupof] lounging, cat-like creature[s]. The feline[s] [isAre] resting languidly, [itsTheir] eyes scanning the horizon lazily before they find and fixate on you. [HeShe] slowly get[notS] on [hisher] feet, stretching and flaunting [hisher] lithe, powerful [bodyBodies] at you, [hisher] eyes never leaving their target. There is no use in trying to avoid [possesive] attention. You prepare your[selfSelves] for combat[grp].", parse);
	Text.NL();
	Text.Add("[Oneof] flexes [m1hisher] claws menacingly, balancing on [m1hisher] hind legs, grinning as [m1hisher] tail sways playfully behind [m1himher]. ", parse);

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Stepping in on my turf, are you? Wrong move!”</i> With that, [m1heshe] roars and lunges toward you.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["youYourParty"] = party.Num() > 1 ? "your party" : "you";
		Text.Add("<i>“Look what the cat dragged in, ladies,”</i> [m1name] purrs confidently, [m1hisher] harem’s eyes glinting hungrily as they study [youYourParty]. <i>“...Bring it to me!”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Just when I was getting bored!”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["bitch"] = player.mfFem("", " My Bitch.");
		Text.Add("<i>“Don’t you know I rule these lands?”</i> the majestic lion puffs out his chest proudly, mane flowing in the wind. <i>“Do you know what that makes you? My prey.[bitch]”</i>", parse);
	}, 3.0, function() { return mainCat.isLion && mainCat.Gender() == Gender.male; });

	scenes.Get();
	Text.Flush();

	// Start combat
	Gui.NextPrompt(function() {
		enc.PrepCombat();
	});
}


FelinesScenes.IntroStalking = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	var enc = this;
	var p1  = party.Get(1);
	var enemy   = enc.enemy;
	var group   = enemy.Num() > 1;
	var mainCat = enemy.Get(0);

	var parse : any = {
		playername : player.name,
		desc       : mainCat.desc,
		m1name     : mainCat.nameDesc()
	};
	parse = mainCat.ParserPronouns(parse, "m1");

	Text.Clear();
	Text.Add("You get a sudden paranoid feeling as you travel across the plains. A quick survey of the area doesn’t reveal any immediate threats, but the feeling refuses to leave you.", parse);
	if(party.Num() > 1) {
		parse["name"] = p1.name;
		Text.Add(" <i>“[playername], we are being watched,”</i> [name] mutters, eyes roaming around warily.", parse);
	}
	Text.NL();
	Text.Add("A slight movement in the tall grass is the only warning you get before a [desc] springs from the undergrowth, nearly throwing you to the ground with the force of [m1hisher] pounce. You barely manage to shrug the large cat off you before [m1heshe] has a chance to bite your face off.", parse);
	Text.NL();

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		parse["erRess"] = mainCat.mfTrue("er", "ress");
		Text.Add("<i>“You are nimble, my prey!”</i> the hunt[erRess] congratulates you. <i>“But don’t get comfortable - the game has only begun.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("The creature doesn’t say anything, though you can see the glimmer of intelligence in [m1hisher] predatory gaze. A rough tongue flickers over sharp teeth, making you squirm uncomfortably.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Why don’t you just give up like good prey?”</i> [m1name] purrs as [m1heshe] circles you. <i>“You can run, you can fight, you can give in… the end result will be the same.”</i>", parse);
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

FelinesScenes.WinPrompt = function() {
	let player = GAME().player;
	SetGameState(GameState.Event, Gui);

	var enc = this;
	var enemy   = enc.enemy;
	var group   = enemy.Num() > 1;
	var mainCat = enemy.Get(0);
	var taur    = player.IsTaur();

	var parse : any = {
		oneof        : group ? " one of" : "",
		enemyEnemies : group ? "enemies" : "enemy",
		s            : group ? "s" : "",
		notS         : group ? "" : "s",
		isAre        : group ? "are" : "is",
		hisher       : group ? "their" : mainCat.hisher(),
		himher       : group ? "them" : mainCat.himher(),
		heshe        : group ? "they" : mainCat.heshe()
	};

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Your [enemyEnemies] lie[notS] defeated, rolling over on [hisher] back[s] in submission to your authority. You consider what you are going to do with the feline[s].", parse);
		if(player.LustLevel() > 0.5)
			Text.Add(" Regardless of what your head is thinking, your body has its own ideas of what it wants you to do to your fallen foe[s], beaten and helpless as [heshe] [isAre].", parse);
		Text.Flush();

		var numMales   = 0;
		var numFemales = 0;
		var numHerms   = 0;
		var male :   Wildcat = null;
		var female : Wildcat = null;
		var herm :   Wildcat = null;
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
						FelinesScenes.WinFuckVag(female, group, enc, cocksInVag, numFemales);
					}, enabled : cocksInVag,
					tooltip : "Get some pussy."
				});
			}
			if(cocksInAss.length > 0) {
				options.push({ nameStr : "Fuck ass(F)",
					func : function() {
						FelinesScenes.WinFuckButt(female, group, enc, cocksInAss);
					}, enabled : true,
					tooltip : Text.Parse("Push[oneof] [himher] down on [hisher] back and fuck [himher] in the ass.", parse)
				});
			}
			if(player.FirstCock()) {
				options.push({ nameStr : "Get blowjob(F)",
					func : function() {
						FelinesScenes.WinGetBlowjob(female, group, enc);
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
						FelinesScenes.WinFuckButt(male, group, enc, cocksInAss);
					}, enabled : true,
					tooltip : Text.Parse("Push[oneof] [himher] down on [hisher] back and fuck [himher] in the ass.", parse)
				});
			}
			if(player.FirstCock()) {
				options.push({ nameStr : "Get blowjob(M)",
					func : function() {
						FelinesScenes.WinGetBlowjob(male, group, enc);
					}, enabled : true,
					tooltip : Text.Parse("Order[oneof] [himher] to give you a blowjob.", parse)
				});
			}
			if(player.FirstVag()) {
				options.push({ nameStr : "Get fucked(M)",
					tooltip : Text.Parse("Have[oneof] [himher] fuck your pussy.", parse),
					func : function() {
						FelinesScenes.WinCatchVag(male, enemy);
					}, enabled : true
				});
			}
		}
		if(herm) {
			var cocksInVag = player.CocksThatFit(herm.FirstVag());
			var cocksInAss = player.CocksThatFit(herm.Butt());

			if(cocksInVag.length > 0) {
				options.push({ nameStr : "Fuck vag(H)",
					func : function() {
						FelinesScenes.WinFuckVag(herm, group, enc, cocksInVag, numHerms);
					}, enabled : true,
					tooltip : "Get some pussy."
				});
			}
			if(cocksInAss.length > 0) {
				options.push({ nameStr : "Fuck ass(H)",
					func : function() {
						FelinesScenes.WinFuckButt(herm, group, enc, cocksInAss);
					}, enabled : true,
					tooltip : Text.Parse("Push[oneof] [himher] down on [hisher] back and fuck [himher] in the ass.", parse)
				});
			}
			if(player.FirstCock()) {
				options.push({ nameStr : "Get blowjob(H)",
					func : function() {
						FelinesScenes.WinGetBlowjob(herm, group, enc);
					}, enabled : true,
					tooltip : Text.Parse("Order[oneof] [himher] to give you a blowjob.", parse)
				});
			}
			if(player.FirstVag()) {
				options.push({ nameStr : "Get fucked(H)",
					tooltip : Text.Parse("Have[oneof] [himher] fuck your pussy.", parse),
					func : function() {
						FelinesScenes.WinCatchVag(herm, enemy);
					}, enabled : true
				});
			}
		}
		if(group && !taur && player.FirstCock()) {
			options.push({ nameStr : "Service Cock" + (player.NumCocks() > 1 ? "s" : ""),
				func : function() {
					FelinesScenes.WinGroupService(enc, enemy);
				}, enabled : true,
				tooltip : "Cats love milk, don’t they? So how about serving these naughty pussies a bit of your male-milk?"
			});
		}
		/* TODO more
			options.push({ nameStr : "Nah",
				func : function() {
					FelinesScenes.WinFuckVag(female, enc);
				}, enabled : true,
				tooltip : ""
			});
		*/
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("You gather up your belongings and leave the defeated feline[s] behind you.", {s: group ? "s" : ""});
				Text.Flush();

				Gui.NextPrompt();
			}, enabled : true,
			tooltip : Text.Parse("Just leave [himher] and be on your way.", parse)
		});
		Gui.SetButtonsFromList(options);
	});

	Encounter.prototype.onVictory.call(enc);
}

FelinesScenes.WinCatchVag = function(mainCat : Wildcat, enemy : Party) {
	let player = GAME().player;
	var otherCats = _.filter(enemy.members, function(cat) {
		return cat != mainCat;
	});

	var herm = mainCat.FirstVag();
	var cat1 = otherCats[0];
	var group = enemy.Num() > 1;
	var group2 = enemy.Num() > 2;
	var parse : any = {
		cat : function() { return _.sample(mainCat.Race().Desc()).noun; }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	parse = Text.ParserPlural(parse, group2, "g");
	parse = mainCat.ParserTags(parse, "c");
	parse = mainCat.ParserPronouns(parse);

	if(group2) {
		parse["gheshe"] = "they";
	}
	else if(group) {
		parse["gheshe"] = cat1.heshe();
	}

	Text.Clear();
	Text.Add("Mind made up, you strip off your [armor] and ", parse);
	if(group)
		Text.Add("select the one that looks to be the most well-endowed of the group. The other[gs] you shoo away with a wave of your hand, and [gheshe] leave[gnotS] without protest.", parse);
	else
		Text.Add("pick up the submissive feline.", parse);
	Text.NL();
	Text.Add("You look the [cat] in the eye and set [himher] down on [hisher] knees, legs spread. The [cat]’s ears flatten on [hisher] head as [heshe] looks at you suspiciously, unsure of what you intend to do with [himher].", parse);
	Text.NL();
	Text.Add("All you do is smile at [himher] and pet [himher] lightly. This seems to ease the suspicious feline a bit, and [heshe] purrs at your touch. Next, you move your hands to [hisher] chest, where you gently massage [hisher] [cbreasts] and tease [hisher] nipples through [hisher] fur.", parse);
	Text.NL();
	Text.Add("The feline mewls softly in pleasure, thrusting [hisher] chest out to give you easier access, and you reward [himher] with a few more pinches on [hisher] nipples.", parse);
	Text.NL();
	Text.Add("Now that the [cat] is feeling more at ease, you decide to show [himher] what you really want. You touch [hisher] belly, then move downwards to [hisher] furry sheath, pulling it down to expose the tip of [hisher] kitty-pecker.", parse);
	Text.NL();
	Text.Add("The [cat] mewls in pleasure, sitting on [hisher] haunches and further spreading [hisher] legs to give you better access.", parse);
	Text.NL();
	Text.Add("You coax [hisher] barbed cock into an erection, feeling the weight of [hisher] balls as you think about how you’ll do this. Ultimately, you decide to lift [hisher] chin to look at you in the eyes and explain what exactly you want from [himher]. It comes as a pleasant surprise when [heshe] nods; though fairly quiet, it seems the [cat] is capable of understanding you and quickly moves to sit down and open [hisher] arms invitingly.", parse);
	Text.NL();
	Text.Add("Laughing at [hisher] eagerness, you further explain that you aren’t just going to let [himher] fuck you just yet; first, you want [himher] to do some prepping.", parse);
	Text.NL();
	Text.Add("[HeShe] looks at you in confusion, twisting [hisher] head a bit to the side.", parse);
	Text.NL();
	Text.Add("Rolling your eyes, you flat out tell [himher] that you want [himher] to lick you.", parse);
	Text.NL();
	Text.Add("Realization dawns on [hisher] eyes and [heshe] crawls towards you, kneeling before you and looking up at you as if asking permission. You nod and [heshe] smiles.", parse);
	Text.NL();
	if(player.HasBalls())
		Text.Add("[HeShe] gently brushes your [balls] away and", parse);
	else
		Text.Add("[HeShe] leans over and", parse);
	Text.Add(" sniffs your moistening [vag], licking [hisher] lips in preparation before giving your labia a soft kiss.", parse);
	Text.NL();
	Text.Add("You gasp softly in pleasure, shuddering as the [cat]’s whiskers tickle your [thighs]. Seeing your reaction, the feline mewls happily and continues to shower your nethers with soft kisses and small laps, never actually entering you, but the rough texture of [hisher] tongue is more than enough to stimulate you until you’re dripping wet.", parse);
	if(player.FirstCock())
		Text.Add(" Up above, your [cocks] stand[notS] fully erect in arousal, though the [cat] pays [itThem] no mind.", parse);
	Text.NL();
	Text.Add("The feline pussy-licker takes the opportunity to nuzzle your [vag], nosing your [clit] as you mat [hisher] snout with a smidge of your juices, which the [cat] is all too happy to lap off. As ready as you are, you still lose your balance when [heshe] finally slips inside of your folds, gently stroking your sensitive walls with [hisher] rough tongue.", parse);
	Text.NL();
	Text.Add("You wind up having to hold onto [hisher] head for support, but it seems [heshe] doesn’t mind as [heshe] continues drilling your [vag] and tasting you. [HisHer] purring sends vibrations coursing through your walls, stimulating the production of even more juices; for a moment, you think he might finish you off then and there, but since you have different plans, you push [himher] away, forcing the feline to begrudgingly stop.", parse);
	Text.NL();
	Text.Add("[HeShe] looks at you in disappointment, until you tell [himher] to sit down and prepare [himher]self for you. With a smile, [heshe] does as ordered and patiently awaits your next move.", parse);
	Text.NL();
	Text.Add("You step over [himher], smiling and panting from earlier, and lower yourself on [hisher] erect kitty-cock, aided by [hisher] soft paws.", parse);
	Text.NL();

	var virgin = player.FirstVag().virgin;

	Sex.Vaginal(mainCat, player);
	player.FuckVag(player.FirstVag(), mainCat.FirstCock(), 3);
	mainCat.Fuck(mainCat.FirstCock(), 3);

	Text.Add("As [heshe] enters you, [hisher] barbs scrap along your outer lips and you cry out in pleasure, as you continue on your way down, until you’ve taken [himher] to the hilt. [HeShe] nuzzles you softly, giving you time to adjust as you continue to pant.", parse);
	if(virgin)
		Text.Add(" You expected this to hurt more, but surprisingly you didn’t feel much pain as [heshe] tore your hymen away.", parse);
	Text.NL();
	Text.Add("Once you’re confident that you’ve adjusted yourself, you look at [himher] and nod, giving [himher] the go ahead to begin fucking you.", parse);
	Text.NL();
	Text.Add("The two of you work in tandem; you rise and fall, aided by [hisher] guiding hands, while [heshe] bucks into you whenever you make your way back down. The barbs on the tip of [hisher] cock scrape you deliciously every time you pull out, making you ever wetter. [HisHer] whiskers tickle you softly as [heshe] leans in to lick at your nipples.", parse);
	Text.NL();
	Text.Add("You stay in this dance for a while, holding onto [himher] for support as well as to guide [hisher] efforts. Steadily, you build up towards your inevitable orgasm, and you’re left with a choice… do you let [himher] cum inside you?", parse);
	Text.Flush();

	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Why not? If you do get pregnant, you’re sure your kittens would be adorable!",
		func : function() {
			Text.Clear();
			parse["b"] = player.FirstBreastRow().Size() > 2 ? Text.Parse(", pressing your [breasts] against [hisher] [cbreasts],", parse) : "";
			Text.Add("You hug [himher] tightly[b] and whisper for [himher] to cum and fill you up with [hisher] kitty-cream.", parse);
			Text.NL();

			player.OrgasmCum();

			FelinesScenes.Impregnate(player, mainCat);

			Text.Add("As if responding to your request, the feline yowls loudly and bucks against you as hard as [heshe] can. Moments later, you cry out as you feel [hisher] warm seed pumping deep into you, triggering your own orgasm as you flood your respective crotches in girl-juice.", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "It’s best not to risk it. You’re just not ready to have a little kitten.",
		func : function() {
			Text.Clear();
			Text.Add("On your next rise, you pull yourself off the [cat]’s barbed prick. [HeShe] looks at you in confusion, but you quickly come back down, letting [hisher] cock rub against your [vag].", parse);
			Text.NL();

			player.OrgasmCum();
			
			Text.Add("[HeShe] yowls loudly as [heshe] reaches [hisher] climax, spraying your front with kitty-jism. The feeling of [hisher] dick rubbing against your nethers as [hisher] barbs prickle your [clit] is enough to trigger your own orgasm, and you cry out as your femcum splashes onto the [cat]’s lap below.", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});

	Gui.Callstack.push(function() {
		if(player.FirstCock())
			Text.Add(" Your own [cocks] erupt[notS] in sympathetic orgasm, blasting [itsTheir] load[s] onto the [cat]’s [cbreasts] and chin.", parse);
		Text.NL();
		Text.Add("When you finally come down, you slump against the [cat] and the two of you fall nervelessly onto the ground, both panting for air as the feline purrs softly.", parse);
		Text.NL();
		Text.Add("After you’ve recovered enough to get back up, you look down to see the [cat] sleeping with a happy look on [hisher] face. [HeShe] looks pretty cute like this, you admit, it’s too bad you can’t stay…", parse);
		Text.NL();
		Text.Add("You grab your [armor] and put it on after cleaning yourself up, then you take one last look at the sleeping feline before leaving [himher] behind.", parse);
		Text.Flush();

		TimeStep({hour: 1});

		Gui.NextPrompt();
	})

	Gui.SetButtonsFromList(options, false, null);
}

FelinesScenes.WinFuckVag = function(cat : Wildcat, group : boolean, enc : any, cocks : Cock[], numFemales : number) {
	let player = GAME().player;
	var pCock = player.BiggestCock(cocks);

	var parse : any = {
		Name     : cat.NameDesc(),
		name     : cat.nameDesc(),
		Possessive  : cat.Possessive(),
		possessive  : cat.possessive(),
		clitCock    : cat.FirstCock() ? "clitcock" : "clit"
	};
	parse = cat.ParserPronouns(parse);
	parse = player.ParserTags(parse);

	Text.Clear();
	if(group) {
		var num = enc.enemy.Num() - 1;
		var tmpParse = {
			hisher       : group ? "their" : enc.enemy.Get(1).hisher(),
			s            : num > 1 ? "" : "s",
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
		Text.Add(" Above her pussy, her cock is rock hard, but for now you have no interest in it.", parse);
	Text.NL();
	if(!pCock.isStrapon) {
		parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
		parse["itThem"]   = player.NumCocks() > 1 ? "them" : "it";
		Text.Add("You free your stiffening [cocks] from [itsTheir] confines, stroking [itThem] lightly as you present [itThem] to your fallen foe. She whimpers slightly, but acknowledges your power over her by parting her legs further.", parse);
	}
	else  {// toy
		Text.Add("[Name] seems fascinated by your [cock], apparently never having seen such a device. She does seem to understand what it is for though as she blushes slightly and parts her legs further, beckoning you to plunge your artificial member into her waiting cleft.", parse);
	}
	Text.NL();
	parse["oneof"] = player.NumCocks() > 1 && !pCock.isStrapon ? " one of" : "";
	parse["s"]     = player.NumCocks() > 1 && !pCock.isStrapon ? "s" : "";
	Text.Add("The cat is breathing heavily as you line up[oneof] your cock[s] with her pussy, rubbing the [cockTip] against her sensitive labia. She is nice and wet already, providing you with plenty of lubrication. With a single thrust of your hips, you’ve pushed inside, her walls wrapping tightly around your shaft. You allow her a short period of time to adjust before you start moving.", parse);
	Text.NL();

	Sex.Vaginal(player, cat);
	player.Fuck(pCock, 3);

	Text.Add("The feline, used to rough but brief copulations, has little preparation for the fucking you are about to give her, moaning in surprised delight as you explore her depths with your [cock].", parse);
	if(player.NumCocks() > 1) {
		parse["s2"] = player.NumCocks() > 2 ? "s" : "";
		parse["notS2"] = player.NumCocks() > 2 ? "" : "s";
		Text.Add(" Your other cock[s2] bob[notS2] up and down, rubbing against her sensitive [clitCock] each time you thrust into her.", parse);
	}
	parse["thick"] = pCock.thickness.Get() >= 6 ? ". Although you wonder how long that is going to last - if you run into her more frequently" : "";
	Text.Add(" You grunt, complimenting her on her tightness[thick]. She only gasps in response. You can feel her heart pounding as you bottom out, your groins joined as one.", parse);
	if(player.HasBalls())
		Text.Add(" Below the tight embrace of her pussy, your balls rub against her exposed cheeks, making a promise to fill her with their stored seed.", parse);
	Text.NL();
	parse["cupSize"] = cat.FirstBreastRow().Desc().cup;
	Text.Add("All the while, your [hand]s have been busy, caressing her fluffy fur and rubbing her sensitive tummy. You take some time to tease her budding breasts - [cupSize]s by your judgement - circling her areolae with your fingers and pinching her stiff nipples. [Name] looks up at you through her thick lashes, marveling at your tender care.", parse);
	Text.NL();

	var doubleCock = false;

	Gui.Callstack.push(function() {
		Text.NL();
		if(!pCock.isStrapon) {
			Text.Add("It’s not long before you can feel a surge in your [balls], announcing the coming of your orgasm. With a final thrust, you drive yourself hips deep into the feline, shuddering as you unleash the torrent of your seed inside her.", parse);
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
			var num = doubleCock ? 3 : 2;
			if(player.NumCocks() >= num) {
				parse["s"] = player.NumCocks() > num ? "s" : "";
				parse["notS"] = player.NumCocks() > num ? "" : "s";
				parse["itsTheir"] = player.NumCocks() > num ? "their" : "its";
				Text.Add(" Your other cock[s] also discharge[notS] [itsTheir] load, coating the panting feline in your thick cum, marking her as yours.", parse);
			}
			Text.NL();
			Text.Add("<i>“Ah… almost makes me wish I was in heat...”</i> she murmurs.", parse);
			Text.NL();
			parse["s"] = player.NumCocks() >= num ? "s" : "";
			Text.Add("You pull out of [name], leaving a sloppy trail of your semen connecting your cock[s] with her gaping netherlips.", parse);
		}
		else {
			Text.Add("At long last, after you’ve had your own desires sated, you pull out of her, leaving the kitty drained but satisfied.", parse);
			Text.NL();
			Text.Add("<i>“I... I never knew that such a thing was possible,”</i> [name] remarks wondrously, studying your now quite sticky [cock]. <i>“Where could I find such a thing?”</i> You shrug, telling her where you got your artificial cock. The cat looks thoughtful, and you idly wonder what she’d do if she had one, and to whom she’d do it.", parse);
			Text.NL();
			Text.Add("These small mysteries of life.", parse);
		}
		Text.Add(" Demanding one final service from her, you have her clean you up with her tongue, licking the mixture of sexual fluids from your [cocks]. You gather your belongings and bid farewell to your brief lover, who looks at you with conflicting emotions, not sure whether to feel happy or regretful that you are leaving.", parse);
		Text.Flush();

		player.subDom.IncreaseStat(70, 1);

		TimeStep({hour: 1});

		Gui.NextPrompt();
	});


	if(player.SubDom() + Math.random() * 10 > 50) {
		Text.Add("But you shouldn’t be giving her the wrong idea here. You smirk as you flip the surprised feline over, putting her on all fours. Leaning down, you whisper that you promise to pound her into oblivion, showing her levels of pleasure she could only dream of while mating with her own kind.", parse);
		Text.NL();
		Text.Add("To drive your point home, you pull out until only your [cockTip] remains inside [name], then ram your [cock] home in one swift motion, driving the breath from her body. She is moaning helplessly after one minute of your relentless fucking. After five, her arms give out, and she crumples forward, her entire world revolving around receiving your mercilessly pistoning shaft. If not for your [hand]s supporting her hips, her trembling legs would have folded long ago.", parse);
		Text.NL();
		Text.Add("Her tail sways back and forth enticingly, twitching erratically each time you drive your [cock] inside her. Figuring it’ll serve well as a handhold, you grab on to it near the base, tugging at it when you wish to pound your rod deeper. You are rewarded with a cute, trembling mewl as the overwhelmed feline quakes beneath you, her orgasm hitting her hard.", parse);
		Text.NL();
		if(cocks.length > 1 && Math.random() > 0.5) {
			doubleCock = true;
			parse["cock2"] = function() { return cocks[1].Short(); };
			Text.Add("You are having quite a good time, but can’t help feeling a bit bummed out that only one of your [cocks] is getting the attention it craves. Without skipping a beat, you press your [cock2] down between [possessive] cheeks, hotdogging her for a bit while humming happily.", parse);
			Text.NL();
			Text.Add("Drawing your hips back, you reposition yourself so that two cocks prod at the entrance to the quivering pussy’s pussy. It’s a tight fit, but you are nothing if not insistent. Eventually, your persistence bears fruit, and your pair of dicks are welcomed inside the yowling feline’s stretchy vaginal passage. The kitty is in ecstasy, no doubt being filled like she’s never been filled before. Your hips slap against her wetly as your coitus forces the sticky juices dripping out of her overfilled cunt to overflow, liberally coating your thrusting members.", parse);
		}
		else {
			parse["seed"] = pCock.isStrapon ? "" : ", trying to milk you of your seed";
			Text.Add("You allow her a short respite before you resume your thrusting, trying to build toward your own orgasm. The little kitty is deliciously tight and willing, her cunt hungrily swallowing up your pistoning [cock][seed].", parse);
			Text.NL();
			Text.Add("For a while, you continue like that, sweating bodies rocking against each other, joined at the hip. [Possessive] tail is like a living snake, trying to escape your snug grip, though you can tell she is receiving a huge amount of pleasure from the stimulation.", parse);
		}
		parse["throbbing"] = player.FirstCock() ? " throbbing" : "";
		Text.Add(" She cries out as she reaches her second climax, her tunnel hugging your[throbbing] shaft[s] tightly. It looks like losing to you is the greatest thing the girl has had happen to her, if her encouraging moans are any indication.", parse);
		Text.NL();

		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>“Ahn, you are so <b>rough</b>!”</i> she purrs as she squirms beneath you. <i>“I <b>love</b> it! I love getting fucked by you!”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“W-whoa, taking two dicks is awesome!”</i> she moans, gasping for breath between your thrusts.", parse);
		}, 1.0, function() { return doubleCock; });
		scenes.AddEnc(function() {
			Text.Add("<i>“P-perhaps I should lose to you more often,”</i> she purrs happily. <i>“You are so good at punishing me when I’ve been a bad girl!”</i>", parse);
		}, 1.0, function() { return true; });

		scenes.Get();

		parse["breed"] = pCock.isStrapon ? "" : " and breed";
		Text.Add(" Grunting, you tell her that you’re more than happy to give it to her any time. You can always use a distraction from this whole ‘saving the world’ business, and a moaning, slutty kitty to fuck[breed] provides just that.", parse);
		if(group) {
			Text.NL();
			parse["s"] = enc.enemy.Num() > 2 ? "s" : "";
			parse["is"] = enc.enemy.Num() > 2 ? "are" : "is";
			Text.Add("[Possessive] companion[s] [is] looking on, perhaps in jealousy or apprehension, not that you care either way. If you still feel in the mood for it, perhaps you’ll give them a good fucking too.", parse);
		}

		Gui.PrintDefaultOptions();
	}
	else {
		Text.Add("No doubt you are acting quite differently from her usual mates - intimate and loving while still giving it to her hard and deep. You lean down, locking lips with the feline, your [tongue] wrestling with her rough tongue. Rolling over, you let her be on top a while, stretching back languidly as the aroused cat rides your [cock]. She moans lustfully, happily grinding her hips against yours as she willfully impales herself on you.", parse);
		Text.NL();
		Text.Add("You let your [hand]s explore her body, giving her breasts some more attention before focusing on her nethers, thumbing her [clitCock].", parse);
		if(cat.FirstCock())
			Text.Add(" She is getting quite hot and bothered, her own cock standing out stiff as a flag post, quivering at your lightest touch.", parse);
		Text.Add(" You give her a few more teasing caresses before moving on, rubbing her hips, her back, cupping her firm buttocks. Gripping her by her ass, you bounce her in your lap, drawing cute moans from the raunchy kitty.", parse);
		Text.NL();
		if(cat.FirstCock() && Math.random() > 0.5) {
			Text.Add("<i>“N-no! That’s not fair!”</i> she moans. <i>“It’s aching… can you rub it, please?”</i> Her cock is bobbing up and down, dripping pre-cum on your [belly].", parse);
			Text.Flush();

			//[Comply][Deny]
			var options = new Array();
			options.push({ nameStr : "Comply",
				func : function() {
					Text.Clear();
					Text.Add("You relent to her pleading, gripping her dick with one of your [hand]s. [Name] purrs happily, sighing with pleasure as you begin to stroke her. The hermaphrodite cat starts gyrating her hips, grinding your [cock] home while letting you jerk her off. Her feline cock is stiff as rock in your [hand], the veins standing out visibly. Near the tapered tip, tiny barbs stand out.", parse);
					Text.NL();
					Text.Add("[Possessive] eyes are closed, her tongue lolling out as she rides you. Suddenly, she gasps, letting out a long, keening moan, her paws curling up in ecstasy. Her cock throbs, twitching wildly as she orgasms, spraying her pent-up seed all over your [skin]. After firing several volleys, the dickgirl collapses on top of you, rubbing her own cum into her fur. She whispers her appreciation to you, suggesting that you should let her return the favor someday.", parse);
					Text.NL();
					Text.Add("You whisper back that you’ll consider it, before turning her over on her back, resuming your thrusting.", parse);
					Text.Flush();

					player.subDom.DecreaseStat(-20, 1);
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Jerk her off."
			});
			options.push({ nameStr : "Deny",
				func : function() {
					Text.Clear();
					Text.Add("You grin mockingly, asking her why you should do all the work. When she lifts a trembling hand to jerk herself off, you swat it away in annoyance. You tell her that you’ll maybe help her out - if she puts some effort into pleasing you. Grumbling slightly, but recognizing your authority, [name] braces herself with her quivering legs, carefully pushing herself up until only the [cockTip] remains inside her.", parse);
					Text.NL();
					Text.Add("Biting her lip, the hermaphrodite kitty drives herself down, grunting as she spears herself on your [cock]. Getting into a rhythm, she repeats the process, trying to balance herself by placing her hands on your [breasts], not trusting her trembling legs to hold her. Each time she bounces on you, her cock bobs eagerly, and she looks down at your smirking face, silently begging you to grant her relief.", parse);
					Text.NL();
					Text.Add("You keep teasing her, lightly tracing a vein on her feline dick with a single one of your fingers, flicking the barbed tip, causing a minor spray of pre to leak down the quivering shaft. [Name] is breathing heavily, still impaling herself on your [cock], moaning from the dual stimuli. Her eyes are clouded, and you can tell that she is very close to her climax.", parse);
					Text.NL();
					Text.Add("As soon as you hear [name] gasp, your hand darts forth, grasping tightly around the base of her throbbing cock. The feline opens her mouth wordlessly, failing to process what is happening, desperate to cum but unable to. She moans pitifully, her dick twitching futilely, your vice-like grip preventing even a single drop of her seed to pour out.", parse);
					Text.NL();
					Text.Add("Finally out of energy, the kitty falls over backwards, your [cock] still buried to the root inside her. You loom over her, relenting and letting go of her trembling cock as you get back to business, starting to pump her pussy again. [Name] whines pathetically, moaning as you go down on her. Thick seed slowly pours from the tip of her softening dick, pooling on her stomach.", parse);
					Text.Flush();

					player.subDom.IncreaseStat(50, 1);
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Keep teasing her, but don’t let her cum."
			});
			Gui.SetButtonsFromList(options);
		}
		else {
			Text.Add("[Name] gasps happily as you hit a particularly pleasant spot. Seizing the opportunity, you repeatedly thrust into her, relentlessly driving her toward a messy orgasm. Finally, it is too much for her to take. She collapses on top of you, her slick girly juices dripping down around your [cock].", parse);
			Text.NL();
			Text.Add("You let her recover briefly before rolling her over on her back again, continuing to pound her. She moans appreciatively, acknowledging that you put in effort to please her before taking your own pleasure.", parse);
			Text.NL();

			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				parse["IWe"] = group ? "we" : "I";
				parse["was"] = group ? "were" : "was";
				Text.Add("<i>“Y-you are quite gentle, even though [IWe] [was] hunting you...”</i> [Name] sounds perplexed at this, the prey showing mercy to the defeated hunter.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Thank you, lover,”</i> [name] purrs, caressing your [skin] tenderly.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Oh… Oh!”</i> she gasps. <i>“Don’t stop now - haah… - ah, I can’t feel my legs anymore… so good!”</i>", parse);
			}, 1.0, function() { return true; });

			scenes.Get();
			Gui.PrintDefaultOptions();
		}
	}
}

FelinesScenes.WinFuckButt = function(cat : Wildcat, group : boolean, enc : any, cocks : Cock[]) {
	let player = GAME().player;
	let party : Party = GAME().party;
	var pCock = player.BiggestCock(cocks);

	var parse : any = {
		oneof    : group ? " one of" : "",
		s        : group ? "s" : "",
		Name     : cat.NameDesc(),
		name     : cat.nameDesc(),
		Possessive  : cat.Possessive(),
		possessive  : cat.possessive(),
		clitCock    : cat.FirstCock() ? "clitcock" : "clit"
	};
	parse = cat.ParserPronouns(parse);
	parse = player.ParserTags(parse, "", pCock);

	Text.Clear();
	Text.Add("You tell[oneof] the defeated feline[s] that you are going to have some fun with [himher], motioning [himher] to roll over on [hisher] back, legs spread. [HeShe] complies, whimpering fearfully. Following your instructions, [name] pulls [hisher] ass cheeks wide, exposing [hisher] tight rosebud. The shy cat tries to block your view by curling [hisher] tail in your way, but you easily push it aside, probing [possessive] tailhole with one of your fingers, slick from your saliva.", parse);
	Text.NL();
	Text.Add("<i>“P-please,”</i> [name] whines pitifully, moaning softly as your digit slips inside. Please get right to the main course and fuck [himher] silly? If [heshe] puts it that way…", parse);
	Text.NL();
	Text.Add("In response, you thrust your finger up to the knuckle, drawing a surprised yelp from the vulnerable feline.", parse);
	if(cat.FirstCock())
		Text.Add(" [HisHer] cock twitches at the sudden intrusion, seeming far more into the prospect of [hisher] imminent buttfucking than its owner is.", parse);
	if(cat.HasBalls())
		Text.Add(" You smile, caressing [possessive] full sack. Before this is over, you are going to empty this.", parse);
	if(cat.FirstVag())
		Text.Add(" [Possessive] cunt is wet and ready, but it’ll have to wait for now. You have another target in mind.", parse);
	Text.NL();
	if(pCock.isStrapon) {
		Text.Add("While busy preparing [name], you hurriedly slip off your gear, pulling out and securing your [cock]. [Name] looks at the artificial member with confusion; though from [hisher] deep blush, you suspect that [heshe] knows full well what you intend to use it for.", parse);
	}
	else {
		parse["ItThey"] = player.NumCocks() > 1 ? "They" : "It";
		parse["isAre"]  = player.NumCocks() > 1 ? "are" : "is";
		Text.Add("While you are busy preparing [name], you hurriedly slip off your gear, pulling out your stiffening [cocks]. [ItThey] [isAre] more than ready for the task at hand, yearning to be plunged into [possessive] blissfully tight hole.", parse);
	}
	Text.NL();
	Text.Add("By now, you are thrusting two fingers into [hisher] anus, [hisher] weakening defenses soon allowing you to work in a third. [Name] moans in pleasure, [hisher] legs squirming and [hisher] tail swishing back and forth erratically.", parse);
	Text.NL();
	if(cat.FirstVag())
		Text.Add("<i>“No, that is the wrong hole!”</i> she whimpers, though she doesn’t seem as resistant as her words imply.", parse);
	else
		Text.Add("<i>“Do you intend to take me like one would a female?”</i> he pants, blushing at the alien concept.", parse);
	Text.Add(" You respond by increasing your pace, grinning at the way [name] arches [hisher] back. With a start, you realize that the horny kitty has begun to purr.", parse);
	Text.NL();
	if(cat.FirstCock()) {
		Text.Add("No matter how much [heshe] complains, [hisher] rigid shaft is betraying [hisher] true feelings. A bead of pre-cum has started to form on the barbed tip of the feline cock, much to the dismay of its owner. [Name] looks up at you hopefully, wanting you to aid [himher], but you’ve got something else in mind. Coyly, you motion [himher] to raise [hisher] head, scratching the obedient kitty behind one ear as [heshe] complies.", parse);
		Text.NL();
		Text.Add("Slowly, you guide [himher] toward [hisher] crotch, [hisher] flexible back bending to accommodate for your raunchy plan. [Name] submissively obeys, closing [hisher] eyes as [hisher] open mouth draws closer and closer to [hisher] needy cock. The feline shudders happily as [heshe] licks up [hisher] own pre, dick twitching as [hisher] rough tongue laps up the salty cream.", parse);
		Text.NL();
		Text.Add("However, instead of releasing the pressure on the back of [hisher] head, you push [himher] down further so that [hisher] lips wraps around the slick feline shaft. Only when [heshe] has swallowed every inch of [hisher] own cock do you relent, softening your grip slightly to allow [name] some room to move. Breathing heavily, you command the kitty to suck, your fingers still busy probing [hisher] rear entrance.", parse);
	}
	else {
		Text.Add("The female moans despite herself, one of her trembling hands instinctively moving toward her wet pussy. Even left untended, the feline’s snatch is brimming with her juices, begging to be bred by her dominant victor. A swat with your free [hand] cruelly denies her pleasure and she whimpers pitifully, wordlessly begging you to allow her release.", parse);
		Text.NL();
		Text.Add("[Name] holds her breath raptly as your [hand] hovers over her needy sex, only a fraction of an inch separating you and [possessive] wet netherlips. In a desperate attempt to sate herself, the horny kitty grinds back against your probing fingers, impaling herself on your digits while she arches her back, trying to brush her pussy against your teasing [hand].", parse);
		Text.NL();
		Text.Add("Mocking her eagerness, you withdraw, staying just outside the reach of her shaking hips. You tell her that she isn’t allowed to use her hands, but that you’ll grant her the use of her tongue. Her restrictions released, the feline greedily lunges for her own crotch, her back twisting and bending like an acrobat’s. [Name] shudders in pleasure as she sinks her rough, flexible organ into her folds. In a sultry voice, you commend the feline for her obedience, your fingers still busy probing [hisher] rear entrance.", parse);
	}
	Text.NL();
	Text.Add("[Possessive] flexible nature provides so many fun possibilities, but you are beginning to get riled up yourself. Time to find out if [hisher] butt is as stretchy [hisher] back! Letting [name] tend to [himher]self orally, you slowly withdraw your fingers from [hisher] stretched hole. The tight rosebud quickly clenches behind you, promising for a fun challenge ahead. No matter, you’ll soon have [himher] gaping wide.", parse);
	Text.NL();

	parse["oneof"] = player.NumCocks() > 1 && !pCock.isStrapon ? " one of" : "";
	Text.Add("The kitty gulps nervously as you line up[oneof] your [cock] with [hisher] puckered ass, though by now [hisher] fear has been all but squashed by [hisher] lust. As a further testament to this, [heshe] betrays [hisher] eagerness to be fucked by grasping [hisher] butt cheeks with [hisher] paws, spreading them wide and welcoming you to ravage [himher]. ", parse);
	if(player.sex.gAnal >= 20)
		Text.Add("Always happy to introduce another slut to the joys of anal sex as you gleefully thrust your [cock] into [hisher] butt. [HeShe] is in for quite a ride.", parse);
	else if(player.sex.gAnal > 5)
		Text.Add("With an experienced thrust of your [hips], you plunge your [cock] inside the kitty’s offered butt.", parse);
	else
		Text.Add("In your bumbling eagerness, you have to take a moment to adjust your aim before your probing [cock] pushes inside [himher].", parse);
	Text.NL();

	//#PC fucks cat
	Sex.Anal(player, cat);
	player.Fuck(pCock, 3);

	parse["catcock"] = cat.FirstCock() ? Text.Parse("around [hisher] cock", parse) : "into her cunt";
	Text.Add("At first, you are only able to force your [cockTip] past [possessive] withering defenses, but after a bit of work more and more of [hisher] anal passage falls to your advancing [cock]. Grunting with pleasure, you rock your [hips], digging deeper and deeper inside the pliant kitty. [HeShe] adapts surprisingly quick to the rough pace you set, moaning appreciatively [catcock]. [Name] seems to be having a good time so far, but you are barely getting started.", parse);
	Text.NL();
	if(pCock.length.Get() > 30)
		Text.Add("The feline is protesting every bit of the way, [hisher] cries and moans alternating between pain at being stretched wide open and the pleasure of being fucked like the subservient slut [heshe] is. Eventually, you realize that you are simply too big for [himher], not that this fact will stop you from fucking [possessive] brains out.", parse);
	else
		Text.Add("You are easily able to bottom out inside your subservient slut - easy for you, if not for [himher]. The sounds of your hips slamming against [possessive] bum echo across the wide plains, and [hisher] muffled cries of mixed pleasure and pain announcing [hisher] anal debut to everyone within earshot.", parse);
	Text.NL();
	if(player.NumCocks() > 1) {
		parse["s"] = player.NumCocks() > 2 ? "s" : "";
		parse["oneof"] = player.NumCocks() > 2 ? " one of" : "";
		parse["isAre"] = player.NumCocks() > 2 ? "are" : "is";
		parse["catcock"] = cat.FirstCock() ? Text.Parse("sucking [hisher] cock", parse) : "lapping at her cunt";
		Text.Add("Your other bobbing shaft[s] [isAre] dancing hypnotizingly in front of [possessive] half-closed eyes. Taking some time off from [catcock], [heshe] raises [hisher] head to give you a lick. The kitty runs [hisher] rough tongue along the bottom of[oneof] your other dick[s], lathering it from root to tip.", parse);
		Text.NL();
	}
	Text.NL();
	Text.Add("The two of you settle into a rhythm, with you providing thrusting power and [name] doing all [heshe] can to receive you. [HisHer] claws are digging into [hisher] furry behind, pulling [hisher] cheeks wide and opening [hisher] passage for your fervent onslaught. At some point, [name] abandons [hisher] oral enterprise, head rolling back and tongue lolling freely as [hisher] body is wrecked by wave after wave of pleasure. The cat pants rapidly, breathlessly begging you to fuck [himher] harder, deeper, to punish [himher] for being such a bad kitty.", parse);
	Text.NL();
	Text.Add("You respond with action rather than words, giving [name] just what [heshe] wants. Hoisting the flexible feline’s stretchy butt up higher, you push [hisher] legs back behind [hisher] head, the angle allowing you to go even deeper than before.", parse);
	if(cat.FirstCock())
		Text.Add(" Each violent thrust into [possessive] depths rub against [hisher] battered prostate, bringing [himher] closer and closer to a very messy climax.", parse);
	Text.NL();

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Y-you fuck like the king of the plains! S-so good!”</i> [name] moans breathlessly. Perhaps [heshe] isn’t as inexperienced at taking cocks in the ass as you thought.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Mmh… Ahn!”</i> [name] moans lustily, tail swishing back and forth erratically, the bushy tip brushing against your [skin].", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["masterMistress"] = player.mfTrue("master", "mistress");
		Text.Add("<i>“I love your cock, [masterMistress]!”</i> [name] pants breathlessly. <i>“Stretching me so wide...”</i>", parse);
	}, 1.0, function() { return true; });

	scenes.Get();

	Text.NL();
	Text.Add("With a last groaning roar, the large feline shudders in your arms, ass clenching tightly around your [cock] as [heshe] cums.", parse);
	if(cat.FirstCock())
		Text.Add(" [HisHer] precarious position puts [himher] in the direct trajectory of [hisher] seed, which jets out in long, thick strands of white, covering the kitty in [hisher] own sticky cream.", parse);
	if(cat.FirstVag())
		Text.Add(" [Possessive] pussy erupts in a tiny fountain of girlcum, small beads of the clear liquid sticking to [hisher] matted fur.", parse);
	Text.NL();
	Text.Add("You’d give [himher] a moment to recover… but you are so close yourself! Grinning feverishly, you redouble your efforts, taking great advantage of [possessive] tightening muscles and little care for [hisher] feelings. Each thrust pushes you closer and closer, until finally it all comes crashing down on you.", parse);
	Text.NL();


	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("Once [heshe] has recovered sufficiently, [name] sets to cleaning [himher]self up using [hisher] tongue. Every now and then, [heshe] pauses to eye you warily, unsure whether you are finished with [himher] or not.", parse);
		Text.NL();
		if(party.Num() == 2)
			parse["comp"] = " and " + party.Get(1).name;
		else if(party.Num() > 1)
			parse["comp"] = " and your companions";
		else
			parse["comp"] = "";
		Text.Add("Even if keeping the cat as a pet would be fun, you have to get back to your quest. You[comp] gather your gear and once again set out on your journey.", parse);
		Text.Flush();

		player.subDom.IncreaseStat(50, 1);
		TimeStep({hour: 1});

		Gui.NextPrompt();
	});


	if(!pCock.isStrapon) {
		Text.Add("Moments away from flooding [possessive] insides with your cum, you pause. Where do you want to finish?", parse);
		Text.Flush();

		var load = player.OrgasmCum();

		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("Before leaving the kitty in a panting, sticky heap, you wipe your [cocks] clean on [hisher] fur. A little more cream surely can’t hurt.", parse);

			Gui.PrintDefaultOptions();
		});

		//[Inside][Mouth][Body]
		var options = new Array();
		options.push({ nameStr : "Inside",
			func : function() {
				Text.Clear();
				Text.Add("No going back now! Grunting, you make a final thrust, pushing your [cock] deep in [possessive] formerly tight ass. [HisHer] eyes widen as [heshe] feels the first warm splatters of your seed pouring into [himher], forever marking the kitty as your slut.", parse);
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
					Text.Add("[Name] looks down in surprise at [hisher] slowly swelling stomach, astonished by your impressive output. Gulping uncertainly, [heshe] squirms a bit, though with your [cock] firmly lodged in [hisher] ass, [heshe] can do little but lie there and take it.", parse);
				}
				else {
					Text.Add("You rest for a while after cumming inside [name], letting [himher] feel your spunk settle within [himher].", parse);
				}
				Text.Add(" With a sloppy plop, you pull out your [cock], leaving behind a strand of cum connecting to [possessive] gaping asshole.", parse);

				Gui.PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("Just keep ramming [himher] until [heshe]’s leaking cum from [hisher] ears!", parse)
		});
		options.push({ nameStr : "Mouth",
			func : function() {
				Text.Clear();
				Text.Add("Just before you go over the edge, you pull out of the moaning feline, leaving [hisher] ass gaping. Jutting your [hips] forward, you take hold of the back of [possessive] head, shoving [himher] down on your [cock]. [HeShe] protests weakly, but pipes down as you pour your cream into [hisher] mouth and against the back of [hisher] throat.", parse);
				Text.NL();
				if(load > 6) {
					Text.Add("No matter how valiantly [name] tries to swallow your seed, your load is simply too big for [himher] to handle. [HisHer] stomach swells rapidly, and when [heshe] can no longer keep up, [hisher] cheeks bulge, eyes going wide as the high pressure causes your cum to jet out from [hisher] nostrils. Coughing feebly and clutching [hisher] inflated belly, [name] takes the last few blasts in the face, eyes lowered in shame.", parse);
					Text.NL();
					Text.Add("[HeShe] insists on lapping up the last quivering bead of thick cum lingering on your [cockTip], wrapping [hisher] lips around your [cock] and meekly cleaning you up.", parse);
				}
				else if(load > 3) {
					Text.Add("[Name] meekly slurps up your plentiful seed, swallowing every drop even as [hisher] belly starts to expand and strain from the immense amount of fluid being poured down [hisher] throat. When you’ve finally deposited the last of your load into the willing feline, you wait a while - letting [himher] savor the thickness of your shaft.", parse);
				}
				else {
					Text.Add("You shoot your load into [possessive] eager maw, your seed splattering across [hisher] tongue. [HeShe] looks like [heshe] is enjoying the taste, eyes half-lidded and a faint blush on [hisher] cheeks.", parse);
				}
				Text.Add(" [Name] actually sucks on the [cockTip] of your cock as you attempt to withdraw it, unwilling to let any of your seed go to waste. [HeShe] looks very satisfied, licking [hisher] lips and purring softly. [HeShe] looks very tired after the ordeal, to the point of being unable to raise [hisher] head.", parse);

				Gui.PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("Give the kitty a tasty treat as your farewell gift!", parse)
		});
		options.push({ nameStr : "Body",
			func : function() {
				Text.Clear();
				parse["s"]        = player.NumCocks() > 1 ? "s" : "";
				parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
				Text.Add("Just as you are about to blow, you pull out, leaving [possessive] ass gaping wide. Rapidly jerking your [cocks], you prepare to give [himher] a creamy shower. The panting kitty looks up at you expectantly, tongue hanging out in the hopes of catching some of your seed. With a last tug, you feel your cock[s] throb, ready to unleash [itsTheir] load.", parse);
				Text.NL();
				if(load > 6) {
					Text.Add("The first shot slams into [name] like a large, sloppy battering ram, punching the air from [hisher] lungs. After the next few, [possessive] front is thoroughly plastered in your jizz - as is the immediate area around [himher]. [HeShe] gasps for air, trying to swat off the thick ropes of spunk draping [hisher] face - only to have them replaced with your next shot. When you are done, the feline is soaked, [hisher] fur painted white from your excessive hosing.", parse);
				}
				else if(load > 3) {
					Text.Add("You use [possessive] body like an artist would a canvas, rapidly painting [himher] in thick, ropey strands of cum. Before long, [name] is covered from head to toe in your spunk. The feline looks pleasantly surprised at your massive output, licking [hisher] lips tentatively, tasting you.", parse);
				}
				else {
					Text.Add("You spill your load across [possessive] stomach, a stray strand of cum jetting farther than the other and landing across [hisher] muzzle. Draped in your spunk, [name] makes an unsteady attempt to clean [hisher] fur, only succeeding in spreading the mess and working it in.", parse);
				}

				Gui.PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("Mark the kitty as yours by showering [himher] in your seed!", parse)
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		player.AddLustFraction(-1);
		Text.Add("The base of the artificial cock grinds against your [vag], triggering your own climax. For a long while, you remain there, your [cock] buried deep inside [possessive] overstimulated colon. Both of you are panting, sweat dripping from your exhausted bodies. When you do pull out, you leave [hisher] hole gaping, twitching slightly as if grasping after the withdrawn toy.", parse);

		Gui.PrintDefaultOptions();
	}
}

FelinesScenes.WinGetBlowjob = function(cat : Wildcat, group : boolean, enc : any) {
	let player = GAME().player;
	var parse : any = {
		oneof    : group ? " one of" : "",
		s        : group ? "s" : "",
		Name     : cat.NameDesc(),
		name     : cat.nameDesc(),
		boyGirl  : cat.mfTrue("boy", "girl"),
		Possessive  : cat.Possessive(),
		possessive  : cat.possessive()
	};
	parse = cat.ParserPronouns(parse);
	parse = player.ParserTags(parse);

	Text.Clear();
	Text.Add("[Name] looks like [heshe] is about to protest when you pull out your [cocks] and commands [himher] to suck, but a displeased look from you is all it takes to change [hisher] mind. From the outcome of the fight, [name] knows very well that [heshe] cannot win against you. Looking mopey, [heshe] crawls over to you, looking up at you a bit uncertainly.", parse);
	Text.NL();
	parse["Coneof"] = player.NumCocks() > 1 ? " one of" : "";
	parse["Cs"]     = player.NumCocks() > 1 ? "s" : "";
	Text.Add("Impatient, you nod for [himher] to get to it, even stroking[Coneof] your cock[Cs], placing your other [hand] on top of [hisher] head. Taking a firm grip of [hisher] hair, you put [hisher] lips right in front of your [cockTip], instructing [himher] to be a good [boyGirl] and say aah. [Name] grudgingly agrees, licking you hesitantly. You let [himher] continue for a while before you grow bored at [hisher] apprehensive behavior, taking a firm grip at the back of [hisher] head and pushing your way inside.", parse);
	Text.NL();

	Sex.Blowjob(cat, player);
	player.Fuck(player.FirstCock(), 2);

	Text.Add("[Name] looks a bit panicked at first, but gradually gets used to the feeling of your [cock] pumping into [hisher] mouth. You can even feel [himher] trying to help you along, [hisher] sandpapery tongue playing along the shaft.", parse);
	Text.NL();
	if(cat.FirstCock())
		Text.Add("Much to your amusement, [possessive] own dick is poking out of its sheath, becoming erect even as its owner is busy sucking another person off. You point this out, much to [hisher] embarrassment, but tell [himher] that [heshe] is free to pleasure [himher]self if [heshe] wants to… just as long as [heshe] doesn’t lose track of what is important. [Name] mutters discontentedly - as much as that is possible with a cock rammed down [hisher] throat - but after a while, one of [hisher] paws strays, grasping the erect member furtively.", parse);
	else
		Text.Add("The kitty is getting quite hot and bothered. You can see that one of her hands is busy between her legs, probing her wet pussy and pinching her clit. You shrug - as long as she gets the job done, why complain?", parse);
	Text.NL();
	Text.Add("With your insistent urging and [possessive] grudging cooperation, you soon build a rhythm. ", parse);
	if(player.FirstCock().length.Get() > 35)
		Text.Add("Though [heshe] is able to swallow much of your [cock], [hisher] eyes desperately plead with you to not force [himher] to take all of your massive erection. Probably for the best, as you don’t think [heshe]’d survive the ordeal. You resolve to make the most of it, each careful thrust pushing a tiny bit more down [hisher] straining throat.", parse);
	else if(player.FirstCock().length.Get() > 20)
		Text.Add("Somehow, [name] is able to take all of your [cock], even though you see [hisher] throat bulging dangerously at the massive insertion. Sighing happily, you make a habit of pausing for a second when [possessive] lips are pressing against your crotch, making the feline growl uncomfortably.", parse);
	else
		Text.Add("[Name] is easily able to take your entire length, though it doesn’t make [himher] look any more comfortable doing it. [HeShe] probably just needs practice. Lots of practice.", parse);
	Text.NL();
	Text.Add("You tell [himher] that [heshe] is such a good cocksucker that [heshe] ought to do this more. One should always make sure to harness their talents, after all. ", parse);
	if(player.SubDom() > 30)
		Text.Add("Going on to tell [himher] that [heshe] ought to be the slut of the plains, you keep degrading [himher] playfully, driving your words home with your [cock]. By now, you’re holding [possessive] head with both hands, making sure that [heshe] can’t get away from your incessant rutting.", parse);
	else if(player.SubDom() < -30)
		Text.Add("Caressing [hisher] hair gently, you urge [himher] on, letting [himher] become confident. You sigh euphorically as you feel furred paws grip your hips, holding you in place as [name] takes the lead, sucking your [cock] like a champion.", parse);
	else
		Text.Add("Putting a bit more pressure on [name], you start rocking your hips a bit, keeping a light but firm hand on the back of [hisher] head. [HeShe] balks a little, but is somehow able to keep up.", parse);
	Text.NL();
	if(player.HasBalls()) {
		Text.Add("Much to your surprise, one of [possessive] paws hesitantly reach up to cradle your [balls], feeling their weight. Chuckling, you promise [himher] that you’ll soon give the good little kitty [hisher] cream, just like [heshe] wants. All [heshe] has to do is continue to be a good kitty.", parse);
		Text.NL();
	}
	Text.Add("You can feel that you aren’t going to last much longer as [name] has gotten quite enthusiastic about [hisher] task. You briefly consider telling [himher], but figure it’ll be more fun if [heshe] discovered it on [hisher] own.", parse);
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
			Text.Add("Just before you are about to blow, you roughly grab [name] by [hisher] hair, pulling [himher] off your [cock]. For a brief moment, [heshe] looks confused, bereft of [hisher] new favorite toy, but your intentions quickly dawn on [himher] when [heshe] sees your throbbing [cock] in its full glory.", parse);
			Text.NL();
			Text.Add("[Name] demurely closes [hisher] eyes, turns [hisher] face upward and waits for [hisher] shower. With the aid of your trusty [hand], you quickly comply, splattering your seed all over [hisher] visage.", parse);
			Text.NL();
			if(load > 6) {
				Text.Add("The force of your first blast looks like it almost knocks [name] off [hisher] knees, but [heshe] champions it out, rocking unsteadily as each shot hits [himher] like a cannonball. When you are done, [possessive] entire front is thoroughly coated in your semen, so much so that it’ll probably take at least a day to clean [hisher] fur after this.", parse);
			}
			else if(load > 3) {
				Text.Add("[HeShe] looks surprised as you spill your larger than average load on [himher], glazing not only [hisher] hair and face, but also generously coating [hisher] chest and stomach area.", parse);
			}
			else {
				Text.Add("When you are done, a generous amount of seed is coating [possessive] face and hair, dripping down on [hisher] chest.", parse);
			}
			Text.Add(" Almost absently, [name] licks [hisher] lips, tasting your sticky treat.", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true,
		tooltip : Text.Parse("Shoot your load all over [hisher] face.", parse)
	});
	options.push({ nameStr : "Mouth",
		func : function() {
			Text.Clear();
			Text.Add("You pull out until only the [cockTip] of your [cock] remains in [possessive] mouth, and then tell [himher] to start sucking. It quickly dawns on [himher] what your intention is as you start to stroke your free length, but at this point [name] seems to be resigned to [hisher] fate. If [heshe] is going to be a cocksucking slut from now on, [heshe] may as well try to enjoy it.", parse);
			Text.NL();
			if(load > 6) {
				Text.Add("[Possessive] eyes jump open in surprise as the first jet of cum all but fills [hisher] mouth. By the second shot, [hisher] cheeks are bulging, and the feline is making strangled noises as your semen flows freely down [hisher] throat. After bravely swallowing two more loads, the poor kitty gasps for air, coughing as [heshe] forces [himher]self off your [cock]. Several more shots hit the embarrassed cat right in the face, sticking to [hisher] fur in long strands. In a final urge to please you, [name] squares [hisher] shoulders and wraps [hisher] lips around your [cockTip] to take the final blast, lapping it up eagerly.", parse);
			}
			else if(load > 3) {
				Text.Add("From [possessive] surprised expression, the sheer size of your load took [himher] unprepared. [HeShe] gags slightly as your semen slides its way down [hisher] throat, excess dripping freely from [hisher] lips.", parse);
			}
			else {
				Text.Add("You grunt as you finally cum, shooting your load into [possessive] gaping maw. [HeShe] lets the semen linger for a while, some of it spilling out past [hisher] lips.", parse);
			}
			Text.Add(" With a loud pop, you pull out, and [name] swallows any of your seed still in [hisher] mouth without having to be told to.", parse);

			Gui.PrintDefaultOptions();
		}, enabled : true,
		tooltip : Text.Parse("Pour it in [hisher] mouth and let [himher] taste it.", parse)
	});
	options.push({ nameStr : "Throat",
		func : function() {
			throat = true;
			Text.Clear();
			parse["deep"] = player.FirstCock().length.Get() > 30 ? Text.Parse("wrapping as much as possible of your enormous shaft in the warm embrace of [possessive] straining mouth", parse) : Text.Parse("connecting [possessive] lips with your crotch", parse)
			Text.Add("Showing little regard for the safety of the poor kitty, you continue ramming your [cock] down [hisher] throat, ignoring [hisher] panicked pleas. So close… so close… with a final thrust, [deep], you reach your climax, your seed jetting down the feline’s waiting maw.", parse);
			Text.NL();
			if(load > 6) {
				Text.Add("If not for the fact that you are already jammed halfway down [hisher] throat, [name] would never have been able to swallow your massive load. [Possessive] eyes widen in panic as you keep pouring wad after thick wad of your seed directly into [hisher] stomach, which is beginning to swell dangerously. By the time you feel the torrent of semen abating, [possessive] tummy is swollen like as if [heshe] was pregnant. On your way out, you deposit one last glob of spunk right on [hisher] tongue, granting [himher] the privilege of your taste. [Name] looks down at [hisher] belly in wonder, rubbing it tenderly and", parse);
			}
			else if(load > 3) {
				Text.Add("It’s impossible for [name] to miss what is happening as you unload wad after thick wad of your cream down [hisher] accommodating throat. You see [hisher] eyes widen slightly as you just keep cumming and cumming, perhaps worrying if [heshe] will be able to take it all. When you are done, you rub the [cockTip] of your [cock] on [possessive] tongue, making sure that [heshe] gets a taste of you. [HeShe] looks down at [hisher] stomach apprehensively, rubbing it tenderly and", parse);
			}
			else {
				Text.Add("From your sudden twitching motions and the thick cream flowing down [hisher] throat, [name] understands what just happened. [HisHer] suspicions are confirmed when [heshe] tastes the salty tang of your sperm as you pull out, letting the [cockTip] of your [cock] rest on [hisher] tongue for a moment. [Name] looks more humiliated than discomforted,", parse);
			}
			Text.Add(" gulping as [heshe] awaits what you have in store for [himher] next.", parse);

			player.subDom.IncreaseStat(70, 1);

			Gui.PrintDefaultOptions();
		}, enabled : player.FirstCock().length.Get() > 20,
		tooltip : Text.Parse("Ram your [cock] as far down [hisher] throat as it will go.", parse)
	});
	Gui.SetButtonsFromList(options);


	Gui.Callstack.push(function() {
		Text.NL();
		if(cat.FirstCock()) {
			Text.Add("From the mess on the ground, you can tell that sometime during the process [name] shot [hisher] own load, clearly evident by the sticky strands dripping from [hisher] softening barbed cock.", parse);
			Text.NL();
		}
		Text.Add("You ask [himher] if [heshe] enjoyed [hisher] cream, not really expecting an answer.", parse);
		Text.NL();

		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>“I-it wasn’t that bad,”</i> [heshe] mutters, blushing. [Name] refuses to meet your eye.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Cleaning this up will take me all day,”</i> [name] grumbles sullenly. Apparently, [heshe] wants to get started at it right away as [heshe] starts licking your semen from [hisher] fur with [hisher] rough tongue.", parse);
		}, 1.0, function() { return !throat; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Your cream is very… thick,”</i> [name] mutters. That almost sounded like a compliment.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“So full...”</i> [heshe] moans joyfully, caressing [hisher] distended stomach.", parse);
		}, 1.0, function() { return throat && load > 3; });

		scenes.Get();

		Text.NL();
		Text.Add("Gathering up your things, you leave the satisfied feline and continue your adventures.", parse);
		Text.Flush();

		player.subDom.IncreaseStat(40, 1);
		TimeStep({minute: 30});

		Gui.NextPrompt();
	});
}


FelinesScenes.WinGroupService = function(enc : any, enemy : Party) {
	let player = GAME().player;
	var mainCat = enemy.Get(0);
	var betaCat = enemy.Get(1);
	var gammaCat = enemy.Get(2);
	var deltaCat = enemy.Get(3);
	var numCats = enemy.Num();
	var group = numCats > 2;

	var numCocks = player.NumCocks();

	var parse : any = {

	};
	parse = player.ParserTags(parse);
	parse = mainCat.ParserPronouns(parse);
	parse = betaCat.ParserPronouns(parse, "B");
	if(gammaCat)
		parse = gammaCat.ParserPronouns(parse, "G");
	if(deltaCat)
		parse = deltaCat.ParserPronouns(parse, "D");
	parse = Text.ParserPlural(parse, numCocks > 1);
	parse = Text.ParserPlural(parse, numCocks > 2, "", "2");
	parse = Text.ParserPlural(parse, group, "g");

	Text.Clear();
	Text.Add("Decision made, you quickly strip your [armor] and pick each cat up, settling them down on their knees in front of you.", parse);
	Text.NL();
	Text.Add("Once you have their undivided attention, you point to your [cocks] and utter a single order: <i>“Lick.”</i>", parse);
	Text.NL();
	Text.Add("The one that appears to be their leader leans closer to sniff at[oneof] your [cocks], then mewls softly and smiles. [HeShe] extends [hisher] tongue and begins gently lapping your [cock].", parse);
	Text.NL();

	Sex.Blowjob(mainCat, player);
	mainCat.FuckOral(mainCat.Mouth(), player.FirstCock(), 2);
	player.Fuck(player.FirstCock(), numCats); //2, 3, 4

	parse["ghisher"] = group ? "their" : betaCat.hisher();
	parse["gheshe"] = group ? "they" : betaCat.heshe();
	Text.Add("Seeing [ghisher] boss so eager, the other feline[gs] follow[gnotS] in suit. ", parse);
	if(player.NumCocks() == 1) {
		Text.Add("Unfortunately, you only got one [cock], so [gheshe]’ll have to come to an agreement if [gheshe] intend to get some cream.", parse);
		Text.NL();
		Text.Add("The cats push and pull, silently trying to get into an agreement. Their leader stops licking you to bicker with [hisher] lackey[gs] and you cough to remind them what they’re supposed to be doing here…", parse);
		Text.NL();
		Text.Add("They immediately stop their bickering and look at you apologetically, then they talk amongst themselves and seem to reach an understanding.", parse);
		Text.NL();
		Text.Add("The boss gets your glans, gently sucking and tonguing it. Despite [hisher] rough tongue, [heshe]’s careful enough that it doesn’t hurt you in the least; in fact, it feels pretty nice, in a weird kind of way. It’s as if [heshe] was tickling your [cockTip] whilst also pleasuring it… it’s hard to put into words…", parse);
		Text.NL();
		if(deltaCat)
			Text.Add("One of them is in charge of licking along the sides of your member. [DHeShe]’s not as skilled as the boss, but the warm, wet tongue feels good on your shaft all the same. ", parse);
		if(gammaCat) {
			parse["f"] = numCats > 3 ? "Another o" : "O";
			Text.Add("[f]ne decides to lay little kisses and suckles along your length. [GHisHer] whiskers tickle a bit, but it’s still a very pleasurable sensation, and [Gheshe] certainly doesn’t lose to [Ghisher] boss in terms of enthusiasm. ", parse);
		}
		parse["last"] = numCats > 2 ? "last" : "other";
		parse["friends"] = numCats > 2 ? "friends" : "boss";
		parse["k"] = player.FirstCock().Knot() ? ", right besides your knot" : "";
		Text.Add("The [last] one looks under your [cock] and ", parse);
		if(player.HasBalls())
			Text.Add("decides to nuzzle and suckle on your [balls], coaxing them into producing more tasty cream for [Bhisher] [friends].", parse);
		else if(player.FirstVag())
			Text.Add("mewls happily when [Bheshe] sees that you have a [vag] ripe for some attention. [BHeShe] immediately digs in, licking and kissing with abandon. The sudden bout of enthusiasm makes you lose balance and you almost fall, but you recover quickly enough.", parse);
		else
			Text.Add("mewls in confusion. Seeing that you have nothing for [Bhimher] to play with underneath, [Bheshe] shrugs and decides to stick to suckling and licking the base of your [cock][k].", parse);
		Text.NL();
		parse["vb"] = player.HasBalls() ? Text.Parse(" and [balls]", parse) :
			player.FirstVag() ? Text.Parse(" and [vag]", parse) : "";
		Text.Add("You let the kitties go to town on your [cock] as you’re driven ever close to the edge of your climax. Since they’re doing such a good job tending to your needs, you decide to pat them lightly on their heads. This causes them to start purring, sending wonderful vibrations coursing throughout your member[vb], further tearing at your resistance.", parse);
		Text.NL();
		Text.Add("So close to cumming, you throw a warning to your pet pussies that you’re about to blow, and they immediately react by doubling their efforts! When you’re on the very brink, the other cat[gs] clear[gnotS] the way and the boss takes you as far into [hisher] throat as [heshe] can.", parse);
		Text.NL();
		Text.Add("The act sends you over the edge and cry out in pleasure as your climax hits you like a truck.", parse);
		Text.NL();

		var cum = player.OrgasmCum();

		if(cum > 6) {
			Text.Add("You cum with such force that you nearly knock the cat currently deepthroating you off your [cock], but [heshe] perseveres until [heshe]’s gotten a few mouthfuls worth of seed.", parse);
			Text.NL();
			parse["next"] = numCats < 3 ? "other" : "next";
			Text.Add("Next, [heshe] releases you, getting blasted on [hisher] face as [heshe] steps away for the [next] cat in line for your bountiful cream.", parse);
		}
		else if(cum > 3) {
			Text.Add("You give the cat currently deepthroating you a fat load straight down [hisher] stomach before [heshe] withdraws enough to taste your subsequent loads. When [heshe]’s had a few more mouthfuls, [heshe] steps away to let the other cat[gs] have a go.", parse);
			Text.NL();
			Text.Add("Switching so suddenly earns them a jet straight on the face, but they don’t seem to mind.", parse);
		}
		else {
			Text.Add("You gasp as you cum what feels like buckets worth of virile seed!", parse);
			Text.NL();
			Text.Add("The cat boss pulls away so only your tip is inside [hisher] maw, purring as you unload into [hisher] willing throat. [HeShe] drinks [hisher] fill, then releases you, earning [himher]self a splash of seed on [hisher] face before the next cat takes over.", parse);
		}
		Text.NL();
		Text.Add("The cats rotate, each getting their turn and well-earned mouthful of spunk. By the time you’re done, they’re left mewling, licking each other’s faces clean of your sperm. Each one enjoys it as if it was the finest drink they’ve ever had...", parse);
		Text.NL();
		Text.Add("You take a seat on the ground and give yourself a few moments to rest. The cats clean themselves up and settle down for a nap. That’s not a half-bad idea… but not here. Who knows what these naughty kitties will be up to once they awaken?", parse);
		Text.NL();
		Text.Add("You quickly collect and don your [armor], then leave the sleeping felines behind.", parse);
	}
	else {
		var share = false;
		var spare = false;
		if(numCats > numCocks) {
			parse["sll"] = group ? "ll" : "s";
			Text.Add("Unfortunately, you don’t have enough cocks for all of them, so [gheshe]'[sll] have to share if everyone hopes for a turn at your [cocks].", parse);
			share = true;
		}
		else if(numCats < numCocks) {
			Text.Add("Fortunately, you got more cocks than you got willing kitties, so there’s plenty to go around. Maybe one of them will want seconds?", parse);
			spare = true;
		}
		else {
			Text.Add("Fortunately, it’s a match made in heaven; you have just enough cocks to feed each of their drooling kitty-muzzles some of your cream.", parse);
		}
		Text.NL();
		Text.Add("Their eager feline muzzles engulf each of your shafts as they begin sucking on them like hungry kittens.", parse);
		if(share)
			Text.Add(" Those that are left without a cock sit behind, patiently waiting for their turn.", parse);
		else if(spare)
			Text.Add(" Once every cat has their mouth full of dick, they spare a paw or two to stroke your remaining cock[s].", parse);
		Text.NL();
		Text.Add("You pet their heads and encourage them to suck deeper and harder. They respond by purring, sending wonderful vibrations coursing through your [cocks]. Pre seeps constantly out of each of your shafts, feeding the felines and spurring them on.", parse);
		Text.NL();
		if(share) {
			Text.Add("At about this time, the cats decide to rotate, switching their respective cocks around and shuffling so those that were standing in line have a chance to get some of your cream too. Those that wind up without a cock to suck just lick their lips and preen themselves by lapping at their paws.", parse);
			Text.NL();
		}
		else if(spare) {
			Text.Add("The cats decide it’s time to shuffle things about, so they switch their cocks around, leaving the dicks they were previously sucking exposed to the cool air as they engulf new shafts with a mewl.", parse);
			Text.NL();
		}
		Text.Add("You can feel yourself teetering on the edge of your climax, and though you warn the friendly felines, they don’t seem to hear or mind.", parse);
		Text.NL();

		var cum = player.OrgasmCum();

		if(cum > 6) {
			parse["sp"] = spare ? Text.Parse(" even as your other shaft[s2] whip[notS2] around and splatter[notS2] [hisher] body with semen", parse) : "";
			Text.Add("When you finally you cum, your explosion of pearly cream surprises the cats with its overwhelming volume. The boss holds steady, hanging on your cock and drinking it down merrily[sp]. The other cat[gs] [ghasHave] to stop [ghisher] ministrations to cough and breath, and [gheshe] winds up covered in sperm, much to [ghisher] delight.", parse);
		}
		else if(cum > 3) {
			parse["sp"] = spare ? Text.Parse(", your other cock[s2] spill[notS2] seed all over and across their bodies, but they don’t seem to care", parse) : "";
			Text.Add("You let out a cry of pleasure as your cum jets out into the felines’ waiting throats. Each one gets a hearty serving[sp].", parse);
		}
		else {
			Text.Add("Cum sprays out of your [cocks] to be quickly lapped up by the hungry cats. Not satisfied with your smaller load, they stroke and suck until you give them more. Only when they’re sure there’s absolutely no more left do they stop.", parse);
		}

		Text.NL();
		Text.Add("After you’ve come down from your orgasmic high, you watch the cats settle down on the ground, huddled together for a quick nap. While the prospect is tempting, you decide that it’d be best if you got going. This encounter wasn’t half bad, you hope you’ll see more of these friendly felines soon…", parse);
	}
	Text.Flush();

	TimeStep({minute: 30});

	Gui.NextPrompt();
}

FelinesScenes.LossRegular = function() {
	let player = GAME().player;
	let party : Party = GAME().party;

	SetGameState(GameState.Event, Gui);

	var enc = this;
	var enemy   = enc.enemy;
	var group   = enemy.Num() > 1;
	var mainCat = enemy.Get(0);

	var parse : any = {
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
		parse["comp"] = " you and " + party.Get(1).name;
	else if(party.Num() > 1)
		parse["comp"] = " you and your companions";
	else
		parse["comp"] = "";

	var numMales   = 0;
	var numFemales = 0;
	var numHerms   = 0;
	var male   : Wildcat = null;
	var female : Wildcat = null;
	var herm   : Wildcat = null;
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

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("You fall on your back,[comp] defeated by the ferocious cat[s]. ", parse);
		if(group)
			Text.Add("The felines bicker among themselves, though their argument seems to be less about what they are going to do with you than about who gets to do it first. All you can do is wait for them to decide.", parse);
		else
			Text.Add("Victorious, the feline settles down licking [hisher] fur thoughtfully, [hisher] fierce, unblinking eyes fixed on your prone form. After a tentative effort to crawl away is easily rebuked by your captor hopping over to place [himher]self in your path, you settle down and wait for what the feline will do to you. You don’t have to wait for long.", parse);

		var scenes = new EncounterTable();
		if(male) {
			scenes.AddEnc(function() {
				return FelinesScenes.LossCatchVaginal(male, group, enc);
			}, 1.0, function() { return player.FirstVag(); });
		}
		if(female) {
			var cocksInVag = player.CocksThatFit(female.FirstVag());

			scenes.AddEnc(function() {
				return FelinesScenes.LossPitchVaginal(female, group, enc, cocksInVag);
			}, 1.0, function() { return cocksInVag.length > 0; });
		}
		if(herm) {
			var cocksInVag = player.CocksThatFit(herm.FirstVag());

			scenes.AddEnc(function() {
				return FelinesScenes.LossCatchVaginal(herm, group, enc);
			}, 1.0, function() { return player.FirstVag(); });
			scenes.AddEnc(function() {
				return FelinesScenes.LossPitchVaginal(herm, group, enc, cocksInVag);
			}, 1.0, function() { return cocksInVag.length > 0; });
		}
		scenes.AddEnc(function() {
			return FelinesScenes.LossDrainMilk(mainCat, group, enc);
		}, 1.0, function() { return player.Lactation(); });
		scenes.AddEnc(function() {
			return FelinesScenes.LossPCblowsCat(mainCat, enemy);
		}, 1.0, function() { return mainCat.FirstCock(); });
		if(numMales + numHerms >= 2) {
			scenes.AddEnc(function() {
				//Double team cats. Randomly pick out cat and cat2 from available ones.
				var cat, cat2;

				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					cat = male;
					numMales--;
				}, 1.0, function() { return numMales > 0; });
				scenes.AddEnc(function() {
					cat = herm;
					numHerms--;
				}, 1.0, function() { return numHerms > 0; });
				scenes.Get();

				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					cat2 = male;
				}, 1.0, function() { return numMales > 0; });
				scenes.AddEnc(function() {
					cat2 = herm;
				}, 1.0, function() { return numHerms > 0; });
				scenes.Get();

				return FelinesScenes.LossDoubleTeam(cat, cat2, enemy.Num() > 2, enc);
			}, numMales + numHerms, function() { return true; });
		}

		var ret = scenes.Get();

		if(!ret) {
			Text.Flush();
			Gui.NextPrompt();
		}
	});
	Encounter.prototype.onLoss.call(enc);
}

FelinesScenes.LossPCblowsCat = function(mainCat : Wildcat, enemy : Party) {
	let player = GAME().player;
	var group = enemy.Num() > 1;
	var group2 = enemy.Num() > 2;
	var cat1 = enemy.Get(1);
	var herm = mainCat.FirstVag();
	var parse : any = {
		cat : function() { return _.sample(mainCat.Race().Desc()).noun; }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, group2, "g");
	parse = mainCat.ParserPronouns(parse);

	if(group2) {
		parse["ghisher"] = "their";
		parse["ghimher"] = "them";
		parse["ga"]      = "";
		parse["gheshe"]  = "they";
	}
	else if(group) {
		parse["ghisher"] = cat1.hisher();
		parse["ghimher"] = cat1.himher();
		parse["ga"]      = " a";
		parse["gheshe"]  = cat1.heshe();
	}

	Text.Clear();
	if(group) {
		Text.Add("Ultimately, what appears to be their boss grabs the smaller [cat][gs] by the scruff of [ghisher] neck[gs] and shoos [ghimher] away; seems like since they can’t reach an agreement, [ghisher] leader is pulling rank. The smaller feline[gs] glare[gnotS] at [ghisher] alpha with[ga] frustrated scowl[gs], but [gheshe] obey[gnotS].", parse);
		Text.NL();
		Text.Add("Their business settled, the [cat] leader turns to look at you, walking towards your prone form.", parse);
	}
	else {
		Text.Add("The lone [cat] walks over your prone form, examining you much like a predator does to its prey right before lunch.", parse);
	}
	Text.NL();
	if(herm) {
		Text.Add("Glancing up, you gaze at the beautiful [cat] glaring down at you. Her face is partially obscured by her round breasts, but you can make out her predatory grin. She has a flat belly, wide hips, and moves the natural grace that all felines seem to have; she’s pretty attractive, and you’d feel flattered to have the attention of such a pretty female normally, but your current predicament makes you a little less enthusiastic that she’s looking so intently at you.", parse);
		Text.NL();
		Text.Add("On her groin lies a sizeable kitty-prick, which is currently poking out of its sheath and standing at half-mast. Considering her predatory grin, and the way her shaft seems to continue to grow, you can guess what exactly she wants from you…", parse);
	}
	else  {
		Text.Add("Glancing up, you gaze at the imposing [cat] glaring down at you. He’s pretty muscular, despite clearly having an athletic build. More noticeable, however, is his semi-erect cat-cock, already poking out of its sheath as the [cat] above grins predatorily.", parse);
		Text.NL();
		Text.Add("Somehow, you can guess what exactly the feline wants from you...", parse);
	}
	Text.NL();
	parse["l"] = player.HasLegs() ? " on your knees and" : Text.Parse(" on your [legs] and", parse);
	Text.Add("Tired of waiting, [heshe] decides to take matters in [hisher] own hands. [HeShe] grabs you and pulls you up, settling you down[l] level with [hisher] now fully hardened cock.", parse);
	Text.NL();
	Text.Add("[HeShe] pets you lightly, and grabs your head, gently nudging you towards [hisher] sheath. [HisHer] tail drapes over your shoulder, looping around behind your neck to gently stroke your cheek and rub over your lips and nose. Suddenly, you’re very aware of the [cat]’s scent, particularly the musk emanating from [hisher] sex. [HeShe] smells ready...", parse);
	Text.NL();
	if(player.SubDom() < -15) {
		Text.Add("Submissive as you are, the [cat] doesn’t need to put much emphasis in what [heshe] wants from you before you look up with a smile, showing that you’re more than willing to comply.", parse);
		Text.NL();
		Text.Add("The [cat] smiles back and pets you, carefully scratching your head as you lean over to begin working on the [cat]’s balls.", parse);
	}
	else if(player.Slut() >= 30) {
		Text.Add("Well, with such a juicy treat in front of you, it’s difficult to resist… on the other hand, you can’t just give in so easily.", parse);
		Text.NL();
		Text.Add("You close your lips shut and shake your head to escape the [cat]’s grip. Initially, [heshe]’s surprised and a bit angry at your antics, hissing to show [hisher] displeasure, but when you kiss [hisher] hand, [heshe] just lets out a confused mewl.", parse);
		Text.NL();
		Text.Add("Smiling wryly, you take [hisher] hand in yours and then you proceed to fellate [hisher] index finger, tonguing the pad as you suck it deeper inside your mouth.", parse);
		Text.NL();
		Text.Add("Still confused, the [cat] lets you keep the treatment up, until [heshe] pulls the digit away with a <i>pop</i>. [HeShe] smiles down at you mischievously, like the cat that caught the proverbial mouse, and pulls you on the back of your head again as if telling you to stop beating around the bush and get on with it already.", parse);
		Text.NL();
		Text.Add("Seeing as [heshe]’s so eager for it, you guess you’ll cut the feline some slack and do what [heshe] wants.", parse);
	}
	else {
		Text.Add("Though the [cat] has made it clear that [heshe] expects you to blow [himher], you refuse. You’ve no desire to do that, and you make it clear by glaring at the feline towering above you.", parse);
		Text.NL();
		Text.Add("Seeing your defiant gaze, [heshe] raises a brow and moves [hisher] spare hand to your shoulder, grabbing it a bit more strongly than you had anticipated.", parse);
		Text.NL();
		Text.Add("Suddenly, it becomes very clear ", parse);
		if(group)
			Text.Add("just why [heshe]’s the top cat among the [cat]s.", parse);
		else
			Text.Add("just how this [cat] is able to go on alone where most other felines band together in small groups.", parse);
		Text.NL();
		Text.Add("You freeze in [hisher] grasp. Slowly, you’re made aware of [hisher] razor-sharp claws extending, gently prickling against your shoulder. Looking up, you see eye-to-eye with [hisher] imperious gaze. It’s as if [heshe] was saying ‘do it or you’ll get hurt’.", parse);
		Text.NL();
		parse["g"] = group ? Text.Parse(" and [hisher] gang", parse) : "";
		Text.Add("Normally, you’d fight back, but you still haven’t recovered from the beat down [heshe][g] gave you, so you decide to begrudgingly comply...", parse);
	}
	Text.NL();
	parse["supple"] = herm ? " supple" : "";
	Text.Add("You grab onto [hisher][supple] thighs for support and extend your tongue. You start with a small lick on [hisher] nuts, tasting them at the same time you weigh them.", parse);
	Text.NL();

	var CumLevel = {
		Light : 0,
		Mid : 1,
		High : 2
	};
	var cum = CumLevel.Light;

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("[HisHer] balls feel pretty light, all things considered, and the taste is pretty… unique. It tastes and smells like a mix of sexual fluids along with what must be this [cat]’s own musk.", parse);
		Text.NL();
		Text.Add("It dawns on you that this feline must be pretty sexually active. In fact, it hasn’t been long since [heshe]’s had a female speared on [hisher] kitty-prick. As you gently kiss an orb, drawing it into your mouth to suck on it lightly, you get a chance to really taste it.", parse);
		Text.NL();
		Text.Add("This sweet taste of pussy juice with a sour undertone of mixed cum… must’ve been quite a fuck for the fluids to have clung to this [cat]’s balls so tightly. As you consider this, you also deduce this [cat] must be very virile because as you suck on [hisher] nuts, you can feel its building weight...", parse);
		cum = CumLevel.Light;
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("This close to [hisher] balls, you can really smell [hisher] musk. It’s a strange, but not unpleasant, aroma; you recognize what must be [hisher] own scent mixed in and associate this scent to the [cat] currently purring from your ministrations. It’s strange, but you doubt you’d confuse this musk with that of any other feline.", parse);
		Text.NL();
		Text.Add("As you move in to kiss one of [hisher] orbs, you catch another powerful wave of [hisher] strong musk. It eggs you on, and just like that, the idea of sucking on [hisher] balls isn’t that bad anymore. You wonder what it’ll taste like when you get to [hisher] shaft...", parse);
		cum = CumLevel.Mid;
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("The overpowering musk emanating from this cat’s groin threatens to shut down all your senses. [HisHer] balls are taut with their liquid load, and you can tell that they’re <i>heavy</i>! It’s hard not to become aroused as you inhale more of [hisher] sex-ready pheromones.", parse);
		Text.NL();
		Text.Add("Somehow, this powerful scent eggs you on, and you become a bit more enthusiastic, moving in to suck on [hisher] balls with great fervor. Once you grow accustomed to [hisher] scent, your mind clears a little and you recover from your stupor as you slow down a bit.", parse);
		Text.NL();
		Text.Add("Judging from [hisher] demeanor, looking down at you with unparalleled lust as [heshe] pants, [hisher] shaking legs and twitching tail, you’d guess it’s been a while since this [cat]’s blown [hisher] load. And considering the intensity of [hisher] gaze, it seems [heshe] intends to make you target of [hisher] massively backed up balls...", parse);
		cum = CumLevel.High;
	}, 1.0, function() { return true; });
	scenes.Get();
	Text.NL();

	if(herm) {
		Text.Add("As you service her balls, you begin moving a hand up between her thighs, slowly inching your way towards her moist pussy. When you make contact with her folds, the [cat] shudders and hisses. Initially, you think it might be from pleasure, but when her grip tightens on your head, you immediately freeze.", parse);
		Text.NL();
		Text.Add("The herm [cat] grabs your arm and slaps it away, hissing at you threateningly. The message is clear: <i>don’t touch</i>.", parse);
		Text.NL();
		Text.Add("You lift your arms in apology and she shoves you back into her sheath.", parse);
		Text.NL();
	}
	Text.Add("Once [heshe] judges you finished with [hisher] balls, [heshe] nudges you up, as if telling you to tend to [hisher] cock next, and you comply.", parse);
	Text.NL();
	Text.Add("You start by licking [hisher] sheath, right where it meets [hisher] pink shaft, then begin making your way up [hisher] length. It feels a bit weird when you get to [hisher] barbs; the little protrusions scrape your tongue, but it doesn’t hurt. And when you finally get to the tapered tip, you catch a taste of [hisher] pre.", parse);
	Text.NL();
	if(cum == CumLevel.Light) {
		Text.Add("Your suspicions are confirmed, and the taste is remarkably similar to what it was like on [hisher] balls along with the female’s juices, except it’s much stronger. Speaking of juices, you’re pretty sure you can still taste it on this [cat]’s dick, just not as strongly as on [hisher] nuts.", parse);
		Text.NL();
		Text.Add("On [hisher] sack, the taste of dry female juice was stronger, but here on [hisher] shaft it’s the taste of male seed that’s stronger. It’s a familiar yet different taste - not too bad. You can’t help associating licking [hisher] cock to licking a lollipop, with all its different flavors...", parse);
	}
	else if(cum == CumLevel.Mid) {
		Text.Add("[HeShe] doesn’t taste half bad; in fact, you’re feeling a bit hot yourself…", parse);
		Text.NL();
		Text.Add("The musk, the purring, the beading pre, those little barbs tickling your [tongue]... All these elements mixed together serve only to excite you and egg you on as you become more enthusiastic in your licking.", parse);
		Text.NL();
		Text.Add("You practically lavish [hisher] cat-cock with licks and tender caresses, enjoying the little mewls, gasps and purrs the [cat] makes whenever you hit a sensitive spot. You only stop your assault when [heshe] holds your head and aligns the tip of [hisher] cock with your mouth, pushing against your lips.", parse);
		Text.NL();
		Text.Add("Seems like [heshe] wants something a little more involved.", parse);
	}
	else {
		Text.Add("No sooner have you licked off the first bead of pre, a small spurt of more pre catches you across your nose. With the way [hisher] shaft is throbbing, you wouldn’t be surprised if a few more feather-light touches is all [heshe] needed to blow then and there.", parse);
		Text.NL();
		Text.Add("You continue to lick along [hisher] rock-hard length, paying special attention to [hisher] bulging veins. The constant flow of pre sliding down mixes with your saliva, making for excellent lube as you run your tongue through [hisher] ticklish barbs. It’s an odd but pleasant feeling, and from the moans and mewls of pleasure, you’d guess [heshe] approves too.", parse);
		Text.NL();
		Text.Add("When you’re just getting into it, savoring [hisher] dick despite yourself, you’re suddenly held fast by the [cat] and pulled up so [heshe] can align [hisher] shaft with your mouth.", parse);
	}
	Text.NL();

	Sex.Blowjob(player, mainCat);
	player.FuckOral(player.Mouth(), mainCat.FirstCock(), 2);
	mainCat.Fuck(mainCat.FirstCock(), 2);

	Text.Add("Without further ado, you let your [tongue] roll out and take the tip of [hisher] cock inside your mouth.", parse);
	Text.NL();
	Text.Add("As soon as you have closed your lips around [hisher] tapered tip, the [cat] thrusts inside, scraping your tongue with [hisher] barbs as [heshe] begins facefucking you.", parse);
	Text.NL();

	var horns = player.HasHorns();
	parse["horns"] = horns ? horns.Short() : "";

	if(player.sexlevel < 3) {
		Text.Add("The sudden thrust surprises you, but you quickly adapt to it and begin sucking, tonguing [hisher] tip and barbs whenever you can. It’s a sloppy effort, but you think the [cat] is beyond caring at this point.", parse);
		Text.NL();
		Text.Add("With each thrust, [heshe] goes deeper into your mouth, eventually reaching the back of your throat. You can’t stop your gag reflex, and you nearly choke as [heshe] continues to facefuck you; you’re really not trained enough to do this.", parse);
		Text.NL();
		Text.Add("The [cat] doesn’t seem to care about that either. [HeShe] grabs ", parse);
		if(horns)
			Text.Add("you by the [horns]", parse);
		else
			Text.Add("the back of your head", parse);
		Text.Add(" and angles [himher]self, so on the next thrust [heshe] makes it inside your throat.", parse);
		Text.NL();
		Text.Add("It hurts! [HisHer] barbs scrape you on the first couple passes as you’re forced to deepthroat. You nearly pass out as your air supply is cut out and replaced by cock, but somehow you hang in there; after the first few thrusts, you grow used enough to the rough treatment that you manage to stabilize yourself.", parse);
	}
	else {
		parse["guygirl"] = mainCat.mfTrue("guy", "girl");
		Text.Add("Despite the suddenness of [hisher] first thrust, you barely flinch. You expected this would happen, given the [cat]’s distant gaze. Seems like your little foreplay sent the poor [guygirl] into a rut! You’d chuckle, but that’s a bit difficult when your mouth is full of cock.", parse);
		Text.NL();
		Text.Add("With each hump, [heshe] goes a little deeper into your mouth. You quickly catch on and move yourself to match [hisher] every thrust in a way that doesn’t hurt you and makes this extra pleasurable for the [cat]. The effects are visible when [heshe] ", parse);
		if(horns)
			Text.Add("grabs your [horns] for support.", parse);
		else
			Text.Add("grabs onto your head for support.", parse);
		Text.NL();
		Text.Add("From your vantage point, you can see [hisher] knees shaking so much that you’re afraid you might send the poor [cat] toppling with your skillful blowjob.", parse);
		Text.NL();
		if(player.SubDom() < -15)
			Text.Add("Well, as flattered as you are that [heshe]’s enjoying your blowjob so much, you figure you should push [himher] off the edge.", parse);
		else if(player.Slut() > 30)
			Text.Add("Well, as fun and as tasty as [heshe] is, you really can’t spend the rest of your day sucking on [hisher] dick, so you decide it’s time to make this [cat] blow.", parse);
		else
			Text.Add("Well, there’s no point in holding back - you’re not exactly doing this because you wanted - and honestly, your jaw is beginning to get tired. Time to make this kitty blow.", parse);
		Text.NL();
		Text.Add("You angle yourself and take the cat’s entire shaft down your gullet, the suction practically forming a vacuum as you use your tongue to lick along [hisher] underside. The tiny barbs do little more than tickle your throat as you subject the [cat] to what’s quite possibly the best blowjob [heshe]’ll ever have.", parse);
	}
	Text.NL();
	Text.Add("[HeShe] holds you down flush on [hisher] sheath as [hisher] balls churn against your chin, and with a loud yowl, the [cat] finally cums.", parse);
	Text.NL();

	//#cat cums in PC’s mouth

	if(cum == CumLevel.Light) {
		Text.Add("[HisHer] load is nothing special. There’s plenty of cream, but it’s nothing you can’t deal with. Within moments, the cat’s finished, and you lick [hisher] cock clean, sucking on the tip to make sure you’ve got everything.", parse);
		Text.NL();
		Text.Add("The [cat] pulls out with a wet slurp, purring in satisfaction as [heshe] pets you. You can see that [heshe]’s a bit wobbly, but still manages to remain graceful. [HeShe] leans over and gives you a lick across your lips - a thank you, perhaps? [HeShe] then turns on [hisher] heels and moves away.", parse);
		Text.NL();
		Text.Add("You breathe a sigh of relief and wipe your mouth with the back of your arm. That wasn’t so bad…", parse);
		Text.NL();
		Text.Add("Still, it was enough to tire you out even more. Maybe a quick nap would do you good. Yes, just a quick one...", parse);
	}
	else if(cum == CumLevel.Mid) {
		Text.Add("[HeShe] has a lot to give. You get several mouthfuls before [hisher] flow begins to taper off, and at the end of it, you’re left to fall nervelessly on the ground with a full belly.", parse);
		Text.NL();
		Text.Add("The [cat]’s flavor is rich inside your mouth; you’ll probably be tasting [himher] for a while. For a moment, you think you might be done until [heshe] suddenly kneels beside you, holding [hisher] dick out to you. It takes a moment for you to register that [heshe] wants you to lick [himher] clean…", parse);
		Text.NL();
		Text.Add("With a groan, you force yourself up so you can get to [hisher] cum-slathered prick. You’re a bit wobbly, but the [cat] holds you up as you get to work, licking [hisher] length and sucking on [hisher] tip to make sure you’ve got everything. Once you’re done, the cat helps you down and pats you on your belly, and then proceeds to saunter off.", parse);
		Text.NL();
		Text.Add("Lying down on the ground like this, you begin to feel the exhaustion of the battle and the oral catch up to you, and resolve to take a quick nap before you get going...", parse);
	}
	else {
		Text.Add("It’s almost as if you were being forced to swallow a river. There’s much more cum than you could hope to contain; heck, you can actually feel [hisher] nuts vibrating against your chin with the effort of pumping all that load down your throat.", parse);
		Text.NL();
		Text.Add("The first jet alone is enough to completely fill your mouth. You barely have time to begin swallowing before a second follows in suit. [HisHer] spunk winds up escaping the seal of your lips, splashing against [hisher] still churning balls and nearly drowning you.", parse);
		Text.NL();
		Text.Add("With nothing else to do, you struggle and manage to free yourself from [hisher] grasp, coughing up thick wads of cat-jism as the rest of [hisher] cum splatters all over your head, face and [armor].", parse);
		Text.NL();
		Text.Add("[HeShe] shoves [hisher] dick back into your mouth for the last couple shots. When [heshe] pulls out, you fall nervelessly on the ground, tired from the earlier battle and the massive load you were just forced to take.", parse);
		Text.NL();
		Text.Add("You close your eyes, ready for a nap, but it seems the [cat] isn’t done with you just yet. [HeShe] straddles you and lets [hisher] half-hard cock slap wetly against your face, meowing something you barely make out - an order to lick [himher] clean, you think.", parse);
		Text.NL();
		Text.Add("Nevertheless, you do just that; you poke your [tongue] out and begin licking [hisher] whole shaft, tip and balls clean. That seems to satisfy the [cat] and [heshe] gets off you to go on [hisher] way, thankfully.", parse);
		Text.NL();
		Text.Add("You lie there on the ground for a few more minutes, until darkness claims you...", parse);
	}
	Text.Flush();

	TimeStep({minute: 30});
	player.AddLustFraction(0.2);

	Gui.NextPrompt();

	return true;
}

FelinesScenes.LossCatchVaginal = function(cat : Wildcat, group : boolean, enc : any) {
	let player = GAME().player;
	var parse : any = {
		oneof    : group ? " one of" : "",
		s        : group ? "s" : "",
		Name     : cat.NameDesc(),
		name     : cat.nameDesc(),
		manherm  : cat.mfTrue("man", "herm"),
		maleherm : cat.mfTrue("male", "herm"),
		Possessive  : cat.Possessive(),
		possessive  : cat.possessive()
	};
	parse = cat.ParserPronouns(parse);
	parse = player.ParserTags(parse);

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
			parse["b"] = player.HasBalls() ? Text.Parse(" and your [balls]", parse) : "";
			Text.Add("The big cat's eyes flick down the length[s] of your [cocks][b], frowning with disapproval before [heshe] finds something more enticing.", parse);
			Text.NL();
		}
		Text.Add("<i>“My, I didn’t expect someone like you to have such a pretty flower,”</i> [heshe] says, softly caressing your [vag].", parse);
		Text.NL();
		if(dom) {
			Text.Add("You furrow your brows and tell [himher] to just get on with it already. You don't have to put up with empty flattery.", parse);
			Text.NL();
			parse["l"] = player.HasLegs() ? "maneuvering you onto all fours" : "bending you over";
			Text.Add("<i>“As you wish,”</i> [heshe] states, closing in and [l].", parse);
		}
		else {
			parse["fur"] = player.HasSkin() ? "" : Text.Parse(", though your [skin] hides the color change", parse);
			Text.Add("Despite yourself, you blush in embarrassment[fur] and ask if [heshe] really thinks so.", parse);
			Text.NL();
			Text.Add("<i>“Of course, you’re so handsome that this came as quite the shock. But not an unpleasant one,”</i> [heshe] says, grinning as [heshe] leans over to look into your eyes.", parse);
			Text.NL();
			parse["l"] = player.HasLegs() ? "maneuver you onto all fours" : "bend you over";
			Text.Add("Sheepishly, you look back into [hisher] eyes, marveling at how deep they seem to be. When [heshe] starts to [l], you eagerly comply, anxious to feel [himher] inside of you.", parse);
		}
	}
	else {
		if(player.FirstCock()) {
			parse["b"] = player.HasBalls() ? Text.Parse(" and your attendant [balls]", parse) : "";
			parse["things"] = player.HasBalls() == false && player.NumCocks() == 1 ? "a thing" : "things";
			Text.Add("[HisHer] eyes flick in surprise and more than a hint of disappointment over your [cocks][balls], clearly not expecting to see such [things] on you. As [hisher] gaze finds what [heshe] is after, though, [heshe] smiles in contentment.", parse);
			Text.NL();
		}
		Text.Add("<i>“What a pretty flower you have, beautiful,”</i> [heshe] says, reaching to softly caress your [vag].", parse);
		Text.NL();
		if(dom) {
			Text.Add("You snap back that [heshe] can spare you the flirtations, [heshe]'s already getting what [heshe] wants.", parse);
			Text.NL();
			parse["l"] = player.HasLegs() ? "maneuvering you onto all fours" : "bend you over";
			Text.Add("<i>“As you wish,”</i> [heshe] states, closing in and [l].", parse);
		}
		else {
			parse["fur"] = player.HasSkin() ? "" : Text.Parse(" through your [skin]", parse);
			Text.Add("Blushing coyly[fur], you tell [himher] that [heshe]'s quite a specimen of [manherm]hood [himher]self.", parse);
			Text.NL();
			Text.Add("<i>“Thank you, my dear. I promise this will feel good for both us,”</i> [heshe] replies, leaning over to lick at your labia.", parse);
			Text.NL();
			Text.Add("You squeal suddenly in shock, wriggling as the warm, wet flesh brushes tantalizingly against your lower lips. Shyly, you reply that you have a feeling [heshe]'ll keep [hisher] word.", parse);
			Text.NL();
			parse["l"] = player.HasLegs() ? "get on all fours" : "bend over";
			Text.Add("<i>“Of course I will. Now, be a darling and [l] for me,</i> [heshe] says, licking [hisher] lips.", parse);
			Text.NL();
			Text.Add("You hasten to obey, scrambling over on the spot and assuming the indicated position, all but presenting yourself in your eagerness.", parse);
		}
	}
	Text.NL();
	var tail = player.HasTail();
	parse["t"] = tail ? Text.Parse("and gently stroking your [tail] with the other", parse) : "";
	Text.Add("[Name] approaches you from behind, laying a hand on your [hips] [t]. Without saying a word, [heshe] leans forward to kiss your lower back, trailing soft pecks along your spine as [heshe] simultaneously aligns [himher]self with your [vag].", parse);
	Text.NL();
	parse["bitingbackUttering"] = dom ? "biting back" : "uttering";
	Text.Add("Involuntarily, you arch your back, [bitingbackUttering] a moan of desire as you feel [hisher] feather-light touch dancing down your back. You're intimately aware of the warmth of [hisher] cock as it hovers temptingly just outside your [vag], and you feel the ache for [himher] to start claiming you well inside your stomach.", parse);
	Text.NL();
	Text.Add("[HisHer] hands slide to your [butt], gripping the cheeks and spreading them apart. You’re dimly aware of [hisher] claws gently prickling you.", parse);
	Text.NL();
	parse["virgin"] = virgin ? " virgin" : "";
	Text.Add("<i>“Here I come~”</i> [name] says in a singsong voice, thrusting [himher]self into your[virgin] folds.", parse);
	Text.NL();

	Sex.Vaginal(cat, player);
	player.FuckVag(player.FirstVag(), cat.FirstCock(), 3);

	if(virgin) {
		parse["t"] = player.HasTail() ? Text.Parse("[tail]", parse) : "back";
		if(dom) {
			Text.Add("You bite your lip savagely to avoid crying out as [heshe] tears through your hymen, but you can't help the way your body quakes in pain, abused folds instinctively clamping down on [hisher] intruding member.", parse);
			Text.NL();
			Text.Add("<i>“So tight! Sorry, my dear, I didn’t think you were a virgin,”</i> [heshe] apologizes, stroking your [t]. <i>“I promise I’ll make your first time memorable,”</i> [heshe] grins, leaning over to give your back a gentle kiss.", parse);
		}
		else {
			Text.Add("You cry out in pain as your hymen is torn, your [maleherm] partner having just claimed your female virginity. Unconsciously, your body shudders at the sensations, instinctively squeezing [hisher] cock in an effort to try and keep [himher] at bay.", parse);
			Text.NL();
			Text.Add("<i>“Shh, it’ll pass, don’t worry.”</i> [heshe] softly caresses your [t], waiting for you to adjust to [hisher] girth.", parse);
		}
	}
	else {
		Text.Add("You moan unconsciously as you feel [himher] spearing inside of you, your [vag] enveloping [himher] in response. You can feel its warmth burning within you, its strange bristly surface stroking and tickling your walls in all directions. Your whole body shivers and unthinkingly you clench down on [himher].", parse);
		Text.NL();
		Text.Add("[Name] yowls as [heshe] hilts inside you, obviously enjoying [himher]self as [heshe] waits for you to adjust to [hisher] girth.", parse);
	}
	Text.NL();
	parse["herm"] = cat.mfTrue("", ", gently pressing her boobs against you");
	parse["tits"] = player.FirstBreastRow().Size() > 3 ? Text.Parse(" massage your [breasts] and ", parse) : "";
	Text.Add("Once the feline deems you ready, [heshe] begins pumping slowly. First at a slow, drawn-out rhythm, but as your juices mix with [hisher] own [heshe] hastens the pace. [Name] leans over your back[herm]. [HisHer] hands trail along your sides to gently[tits] pinch your [nips].", parse);
	Text.NL();
	parse["dom"] = dom ? "However involuntarily, y" : "Y";
	Text.Add("You shudder as [heshe] tweaks and plays with you, rewarding [himher] by clenching down on [hisher] cock. You can feel [hisher] bristles within you, each fleshy barb dragging against a different point of your inner walls with each thrust [heshe] makes. The sensation is indescribable, a strange, tickling feeling from dozens of points inside of you that only stokes the pleasure of [hisher] thrusts. [dom]ou start to thrust your [butt] back into [hisher] crotch, trying to match [hisher] rhythm, coaxing [himher] to go faster.", parse);
	Text.NL();
	Text.Add("[Possessive] thrusts grows more enthusiastic as you begin reciprocating [hisher] efforts. [HeShe] hugs your midriff, gaining more leverage so that [heshe] can pump [himher]self deeper into you. As [heshe] does so, you can feel something vibrating against your back. The sound that follows confirms your suspicion: [heshe]’s purring.", parse);
	Text.NL();
	if(dom)
		Text.Add("A flush of mingled shame and pride bubbles through you as you realize your rapist is so thoroughly enamored with your [vag], the conflicted emotions forming a knot in your guts. Still, you have to concede [heshe] is good... you're getting close yourself...", parse);
	else
		Text.Add("You smile proudly as you hear the rumbling purrs vibrating through your [skin]; to think, you're making [himher] so very happy with your body! And, oohh, you're getting so close, too! You're going to cum soon... you hope [heshe] is feeling the same...", parse);
	Text.NL();
	Text.Add("[HeShe] nuzzles into your neck, tickling you with [hisher] whiskers. <i>“I’m almost there, dear. Are you ready for this?”</i> [heshe] asks in a whisper.", parse);
	Text.NL();
	parse["reluctantly"] = dom ? " reluctantly" : "";
	Text.Add("You nod and reply that you're ready,[reluctantly] admitting that you're close to cumming too.", parse);
	Text.NL();
	parse["fem"] = player.mfFem("handsome", "pretty");
	Text.Add("<i>“Tell me, then. Where do you want me to cum? I’d be loathe to make such a [fem] girl like you pregnant against their will. Though I’m sure our kittens would be the cutest,”</i> [heshe] adds with a smile. </i>“What do you say? Would you carry my kittens?”</i>", parse);
	Text.Flush();

	//[Inside][Outside]
	var options = new Array();
	options.push({ nameStr : "Inside",
		func : function() {
			Text.Clear();
			Text.Add("<i>“I’m so glad to hear you say this, my darling. I’ll make sure to shoot as deep inside you as I can,”</i> [heshe] says, smiling as [heshe] redoubles [hisher] efforts to thrust into you.", parse);
			Text.NL();
			if(dom)
				Text.Add("Like [hisher] weak seed will be strong enough to get you pregnant in the first place, you assure yourself, even as you rock your hips back against [himher]. You're so close now that you just want to get this over with!", parse);
			else {
				parse["handsomebeautiful"] = cat.mfTrue("handsome", "beautiful");
				Text.Add("A thrill races along your spine on hearing those words. You tell [himher] that you couldn't hope for something more wonderful than to bear the kittens of such a [handsomebeautiful], virile [manherm]! For emphasis, you start to grind yourself back against [himher] with all the strength you can muster, wringing [hisher] dick with your cunt in an effort to milk [hisher] inevitable orgasm.", parse);
			}
			Text.NL();
			Text.Add("With one last powerful buck, [name] yowls and begins firing [hisher] seed deep inside you. Spurt after spurt of warm, white semen enters you, and you cannot help but moan as your [vag] is filled with cat-cream.", parse);
			Text.NL();
			Text.Add("The warm wetness inside of you triggers your own climax, and you sing out - appropriately enough - like a cat in heat as you cum. Your [vag] wrings at the cat's bristled member, your juices flowing thickly across [hisher] hilt and running down onto [hisher] balls. ", parse);
			if(player.FirstCock()) {
				parse["notS"] = player.NumCocks() > 1 ? "" : "s";
				parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
				var cum = player.OrgasmCum();
				parse["cum"] = cum > 6 ? "gushing" : cum > 3 ? "spattering" : "drizzling";
				Text.Add("Your [cocks] explode[notS] in [itsTheir] own climax, your seed [cum] onto the earth below you. ", parse);
			}
			Text.Add("You shudder and moan as the electricity of climax races through your body, singing through you until finally it seeps away, leaving behind its soothing warm afterglow.", parse);
			if(player.FirstCock()) {
				parse["l"] = player.HasLegs() ? Text.Parse("Between your [legs]", parse) : "In the valley of your crotch";
				Text.Add(" [l], your [cocks] go limp, swaying loosely down your [thighs].", parse);
			}
			Text.NL();
			Text.Add("[Name] collapses atop you, sending both of you crashing onto the ground. <i>“Ah, thanks, my dear. I really needed that,”</i> [heshe] says, licking your neck affectionately.", parse);
			Text.NL();
			if(dom) {
				Text.Add("You huff indignantly and wriggle your shoulders, telling [himher] to keep [hisher] tongue to [himher]self and to get off of you already. [HeShe] got what [heshe] was after.", parse);
				Text.NL();
				Text.Add("<i>“Defiant to the very end, I see. But I’ll do as you ask,”</i> [heshe] says, giving you a soft peck on the neck and withdrawing from your used [vag].", parse);
			}
			else {
				Text.Add("<i>“Not half as much as I did,”</i> you reply, nuzzling affectionately back as best you can from your position. One hand instinctively goes to your stomach, and you ask if [heshe] really thinks you'd be a good mother to [hisher] kittens.", parse);
				Text.NL();
				Text.Add("<i>“A sweet thing like you? Of course you will,”</i> [heshe] purrs.", parse);
				Text.NL();
				parse["t"] = player.HasTail() ? player.HasTail().Short() : "butt";
				Text.Add("The two of you stay locked in this position for a moment longer before [heshe] finally announces, <i>“I’m sorry, my dear. But I can’t stay with you.”</i> [HeShe] extracts [himher]self from your used [vag] and gently pats you on your [t].", parse);
			}
			Text.NL();
			parse["s"] = enc.enemy.Num() > 2 ? "s" : "";
			parse["comp"] = group ? Text.Parse(" calling [hisher] friend[s] over and", parse) : "";
			Text.Add("<i>“I really need to be going, but I hope to run into you again,”</i> [heshe] says,[comp] walking away.", parse);

			FelinesScenes.Impregnate(player, cat);

			Text.Flush();

			player.AddLustFraction(-1);

			Gui.NextPrompt();
		}, enabled : true,
		tooltip : Text.Parse("Tell [himher] to cum inside. You wouldn’t mind giving birth to a cute kitten or two!", parse)
	});
	options.push({ nameStr : "Outside",
		func : function() {
			Text.Clear();
			Text.Add("<i>“As you wish,”</i> [heshe] replies, thrusting into you forcefully a couple more times, then finally withdrawing and leaning back as [hisher] hands fly to [hisher] throbbing cathood, violently stroking.", parse);
			Text.NL();
			parse["t"]  = player.HasTail() ? Text.Parse(" [tail],", parse) : "";
			parse["w"] = player.HasWings() ? Text.Parse(" [wings],", parse) : "";
			Text.Add("With a yowl of satisfaction, [name] cums. Strands of white fly through the air to settle all over your [butt],[t] back,[w] and [hair]. This is one messy kitty, you think to yourself as a few more strands of warmth fall upon your prone form.", parse);
			Text.NL();
			Text.Add("You groan in frustration, feeling your own need throbbing down below. You're so close, but you can't manage to climb the edge on your own... As your [vag] flexes in frustration, you feel something warm and wet glide suddenly across your [butt]. [Name] is licking you!", parse);
			Text.NL();
			Text.Add("<i>“Don’t worry, I didn’t forget about you,”</i> you hear [himher] say as [heshe] slowly approaches your used pussy and sticks [hisher] tongue inside, penetrating you with [hisher] rough, flexible muscle and licking all over your vaginal walls.", parse);
			Text.NL();
			Text.Add("Your eyes squeeze themselves shut and you moan loudly, your cunt clamping down on the squirming intruder inside of you. It's just what you needed to push you over the edge, and with an ecstatic cry, your whole body quakes as your climax, letting your juices seep over [hisher] tongue.", parse);
			if(player.FirstCock())
				Text.Add("Ignored by both of you until now, you feel your [cocks] erupt, spraying seed across the ground below you.", parse);
			Text.NL();
			Text.Add("[Name] drinks down all of your femcum with gusto, even licking around your honeypot to ensure [heshe] gets every last drop of your sweet tasting juices.", parse);
			Text.NL();
			parse["s"] = enc.enemy.Num() > 2 ? "s" : "";
			parse["comp"] = group ? Text.Parse(", calling [hisher] companion[s] to follow after [himher]", parse) : "";
			Text.Add("<i>“Mmm, delicious,”</i> [heshe] states, licking [hisher] lips. <i>“I’ll be going now, dear. But I hope to run into you again.”</i> [HeShe] gives your [butt] a parting kiss and walks away[comp].", parse);
			Text.Flush();

			player.AddLustFraction(-1);

			Gui.NextPrompt();
		}, enabled : true,
		tooltip : Text.Parse("You don’t want to risk pregnancy. Tell [himher] to cum outside.", parse)
	});
	Gui.SetButtonsFromList(options);

	return true;
}


FelinesScenes.LossPitchVaginal = function(cat : Wildcat, group : boolean, enc : any, cocksInVag : Cock[]) {
	let player = GAME().player;
	var pCock  = player.BiggestCock(cocksInVag);
	var allCocks = player.AllCocksCopy();
	for(var i = 0; i < allCocks.length; i++) {
		if(allCocks[i] == pCock) {
			allCocks.splice(i, 1);
			break;
		}
	}
	var pCock2 : Cock;
	if(allCocks.length > 0) {
		pCock2 = player.BiggestCock(allCocks);

		for(var i = 0; i < allCocks.length; i++) {
			if(allCocks[i] == pCock2) {
				allCocks.splice(i, 1);
				break;
			}
		}
	}

	var parse : any = {
		oneof    : player.NumCocks() > 1 ? " one of" : "",
		s        : group ? "s" : "",
		Name     : cat.NameDesc(),
		name     : cat.nameDesc(),
		manherm  : cat.mfTrue("man", "herm"),
		maleherm : cat.mfTrue("male", "herm"),
		Possessive  : cat.Possessive(),
		possessive  : cat.possessive(),
		cocks2      : function() { return player.MultiCockDesc(allCocks); },
		cock2Desc   : function() { return pCock2.Short(); }
	};
	parse = cat.ParserPronouns(parse);
	parse = player.ParserTags(parse, "", pCock);

	var dom    = player.SubDom() > 0;

	Text.NL();
	Text.Add("<i>“Let’s see what you’re hiding behind this [armor].”</i> [Name] doesn’t wait for a reply before stripping you down to your birthday suit, tossing your [armor] away. Once done, she takes a step back to examine what you have to offer.", parse);
	Text.NL();
	parse["pushingRolling"] = player.LowerBodyType() == LowerBodyType.Single ? "rolling" : "pushing";
	Text.Add("[HisHer] gaze immediately settles on your [cocks]. <i>“Oh, what a juicy treat you have here. Is all of that for me? You shouldn’t have,”</i> [name] giggles, [pushingRolling] you onto your back. She extends a clawed hand to grip[oneof] your [cocks], taking extreme care not to hurt you as she gives it an experimental stroke.", parse);
	Text.NL();
	if(dom) {
		parse["blush"] = player.HasSkin() ? "" : ", or would if they could";
		Text.Add("You angrily snap at her to keep her paws to herself, trying vainly to wriggle back from her stroking fingers. Undercutting your protests and deepening your humiliation, however, is the fact that your treacherous body is already responding to her ministrations. You can feel your [cock] growing harder and firmer under her touch, the warmth of arousal building inside of you no matter how you try to stamp it down. Your cheeks flush in shame[blush]...", parse);
	}
	else {
		Text.Add("Smiling shyly, you ask if she really likes it. Almost in emphasis of your interest, your [cock] begins to grow under her fingers, arousal making it swell quickly. Your eyes rove hungrily over her form as much as you dare, hope filling you as you wonder what she has in mind for your male member. Your [tongue] dabs eagerly at your lips as you await her answer.", parse);
	}
	Text.NL();
	Text.Add("By this time, your [cock] is as hard as it's going to get - thick and strong with your desire as her fingers trace designs across its sensitive surface with playful possessiveness. Your breathing quickens involuntarily, and you watch her intently, waiting to see what she intends for you.", parse);
	Text.NL();
	parse["l"] = player.LowerBodyType() == LowerBodyType.Single ? "besides your" : "between your spread";
	parse["fem"] = player.mfFem("Y", "Despite not looking like it, y");
	Text.Add("Smirking knowingly at you, [name] kneels [l] [legs], extending her feline tongue to lap at your [cockTip] and tasting your pre. <i>“Such a thick cream...”</i> she trails off in a purr. <i>“[fem]ou are quite the stud, aren’t you?”</i> she asks teasingly.", parse);
	Text.NL();
	if(dom)
		Text.Add("Despite yourself, you feel pride at that. It's good to see that she recognizes your natural abilities. Now, if only you were the one leading, this might not be so bad...", parse);
	else
		Text.Add("You quiver at her words, a flush of mingled embarrassment, arousal and pride sweeping over you at hearing such praise from such a strong, proud woman. You have good feelings about where she's going with this...", parse);
	Text.NL();
	if(group) {
		parse["s"] = group ? "s" : "";
		Text.Add("<i>“Let’s hope you can show me a good time, unlike present company,”</i> she looks at her friend[s] in disdain. <i>“Now, where was I? Oh yes, tasty cock for the hungry cat.”</i> She licks her lips and starts crawling over your prone form until you can feel her soft, warm folds aligning with your [cock].", parse);
	}
	else {
		Text.Add("<i>“Well, I think I’ll be taking you for a ride. It’s not every day I come across such a tasty specimen as yourself, dear,”</i> [name] says, grinning. She gives your [cockTip] a kiss and crawls over your prone form until you can feel her soft, warm folds teasing your [cock] with the promise of its velvety embrace.", parse);
	}
	Text.NL();
	Text.Add("You can look your ‘partner’ right in the eye now as she poses herself over you. Moist warmth beats down on your [cockTip] from her arousal-enflamed folds, and you cannot deny your body's urge to mate with her.", parse);
	Text.NL();
	if(dom) {
		Text.Add("You may not have started this willingly, but you'll be damned if you don't seize the moment! Like lightning, your [hand]s shoot out and take her by the chin, pulling her into the roughest, fiercest kiss you can muster.", parse);
		Text.NL();
		Text.Add("Although surprised at first, it takes only an instant for [name] to close her eyes and open her mouth, purring in delight as your [tongue] enters her maw to tangle with hers. The two of you hold this moment of intimacy for an instant before she breaks away with a smile, licking her lips to savor your taste. <i>“I love prey that can take the initiative, but let’s not get sidetracked now,”</i> she states as she slowly starts her descent.", parse);
	}
	else {
		Text.Add("Your body trembles with desire, anxious to let your mistress claim you in the depths clearly so eager for your flesh. Overwhelmed by emotion, a sudden surge of boldness makes your face dart forward to steal a quick kiss on her lips. In those moments, you pour your desire into her, but then release her, hanging your head in shame at what you did, casting a sidelong glance to see what she thinks.", parse);
		Text.NL();
		Text.Add("<i>“That was nice, but we both know you can do better. Come here, there’s no need to be shy,”</i> she teases, giggling as she pull you into a kiss of her own. She licks your lips experimentally, and you respond by granting her access, allowing your tongues to stroke each other inside your mouth. [Name] holds the embrace for a moment, before breaking it with a smile, drawing a sigh of pleasure from you. <i>“This is a real kiss, dear,”</i> she says, licking her lips clean of your saliva. <i>“But let’s not get sidetracked,”</i> she adds, finally bearing down upon you.", parse);
	}
	Text.NL();
	Text.Add("Your whole body tenses as her warmth begins sliding with tantalizing slowness over your [cockTip]. You are engulfed in warm, wet flesh, surrounding and enveloping you, clinging to you even as she hungrily sucks you inside. Unthinkingly, you moan in desire, trying to buck your [hips] in an effort to feed more and more of your length inside of her.", parse);
	Text.NL();

	Sex.Vaginal(player, cat);
	player.Fuck(pCock, 3);

	Text.Add("[Possessive] own moans of pleasure matches yours, and you can hear the deep rumbling of her purrs as your hips finally connect. Your short humps make soft slapping noises as her tunnel grows wet enough to drip rivulets of femcum down your shaft. <i>“Oh, yessss…”</i> she trails off from a meow as she begins rising.", parse);
	Text.NL();
	Text.Add("Your hands reach for your partner's hips, sinking your fingers into the firm flesh of her butt cheeks for stability. With a lewd moan of your own, you start to meet her back, thrust for thrust, and then push the pace. Your [cock] is surrounded in steamy, hot, silken flesh, her walls wringing down around your length, grinding you in pursuit of pleasure.", parse);
	if(cat.FirstCock())
		Text.Add(" Her own neglected catdick slaps wetly against your belly, forgotten about in your mutual eagerness to quench the fires in her cunt.", parse);
	Text.NL();
	if(player.NumCocks() == 2) {
		Text.Add("Your [cock2Desc] rubs through the toned cheeks of her ass, poking away at the base of her flicking tail with each thrust you make. Her soft fur tickles quite pleasantly against your dick. ", parse);
	}
	else if(player.NumCocks() >= 3) {
		parse = Text.ParserPlural(parse, player.NumCocks() > 3);
		Text.Add("Your [cock2Desc] rubs through the toned cheeks of her ass, poking away at the base of her flicking tail with each thrust you make. Her soft fur tickles quite pleasantly against your dick. Meanwhile, your lower [cocks2] slap[notS] and jab[notS] against her stomach and her thighs, completely abandoned. ", parse);
	}
	var lactation = player.Lactation();
	parse["lact"] = lactation ? "purring louder when she tastes a drop of your milk" : "purring as you ream her pussy";
	Text.Add("[Name] bends down to give your [nips] a lick, [lact].", parse);
	Text.NL();
	if(lactation) {
		Text.Add("<i>“Milk!?”</i> she exclaims in surprise, giving your [breasts] a squeeze and watching in glee as a white droplet slides down your soft mound. <i>“You’ve got cream and milk? Oh my, you’re quite the find, aren’t you?”</i> she purrs appreciatively, leaning down to take on of your [nips] into her mouth and drain you of your milk.", parse);
	Text.NL();
	if(dom)
		Text.Add("That you are, you reply, before informing her that she better drink up; she's going to need her strength. For emphasis, one of your hands rises from her sweet ass and presses against the back of her head, pushing her harder against your tit. Not that she seems to need the encouragement; you moan in delight as she avidly suckles from you.", parse);
	else
		Text.Add("You tell her that you can only hope she enjoys it, moaning ecstatically as her tongue dances teasingly across your [nip], unthinkingly pushing your chest out so she will dive ever deeper into your bosom. You feel so <i>good</i>, your cock wrapped in kitty pussy, and your milk pouring into an appreciative belly...", parse);
	Text.NL();
	}
	Text.Add("As the pleasure builds up, you feel her honeypot clamping down on your [cock]. Her shaky knees and weakening legs indicate that it’s only a matter of time before she cums. You can’t say you’re lagging behind either. As her oncoming climax nears and she grows weak, you figure that you could take matters into your own hands and give her a pounding that she’ll remember for weeks. Or you could just sit back and let her cocksleeve milk you dry. Then again, you could also pull out and finish up on her chest. What do you do?", parse);
	Text.Flush();

	//[PoundHer][LayBack][TittyFuck]
	var options = new Array();
	options.push({ nameStr : "PoundHer",
		func : function() {
			Text.Clear();
			if(dom)
				Text.Add("Now <i>this</i> is something you can sink your teeth into! With a surge of motion, you force yourself forward, pushing [name] clean over and pinning her down underneath you. Baring your teeth for emphasis, you seize her soft, fur-coated thighs and hoist them upright, allowing you to start pounding her with all your might.", parse);
			else
				Text.Add("Seized by a sudden, uncharacteristic surge of aggression, you suddenly thrust yourself up against your partner. She tumbles over backwards, your own body following and pinning hers down. You steal another kiss from her, then move to raise her legs, allowing you better access to her womanly treasure. Unhindered, holding her thighs for balance, you start to thrust with as much passion and vigor as you can muster.", parse);
			Text.NL();
			Text.Add("[Name] is initially surprised by your sudden burst of enthusiasm, but whatever form of protest she might be thinking of is quickly dashed into a string of moans, yowls and screams as you pound her raw. She doesn’t struggle against your grip, more than happy to receive your rough fucking. All she does is grip the grass for balance as she tries her best to hump you back.", parse);
			Text.NL();
			parse["throughInside"] = player.HasBalls() ? "through" : "inside";
			Text.Add("Grunting with mingled pleasure and effort, you keep on fucking her with all your might; you can feel it building within you, electricity crackling [throughInside] your [balls]. You can feel the limits of your resistance fraying with every fraction of a second, until finally they snap; with a roar of pleasure, you slam yourself inside of her to the hilt and cum, holding her as tightly as you can to ensure not a drop of it goes astray.", parse);
			Text.NL();
			parse["cum"] = player.OrgasmCum() > 4 ? ", her stomach bulging from the sheer volume of your climax" : "";
			Text.Add("Finally, you have emptied yourself completely into her[cum], and you pull your [cock] free before allowing her legs to drop beside you. Breathing hard, you flop ungraciously onto the ground below you, hanging your head as you inhale and exhale in an effort to recover.", parse);
			Text.NL();
			Text.Add("It takes a moment before [name] finds the energy to stand. Once she does, she approaches you, giving you an appreciative pat on the head. <i>“That was pretty good! I can’t remember the last time I came this hard,”</i> she purrs.", parse);
			Text.NL();
			Text.Add("Looking up at the feline, you can see her lips curled in an honest smile of appreciation.", parse);
			if(cat.FirstCock())
				Text.Add("You can also see pearly strands of her own semen splashed across her tits and even speckling her face.", parse);
			Text.NL();
			Text.Add("She rubs her sore nethers, wincing a bit as she dips her finger inside to withdraw a stray dollop of your jism. Running her tongue over her lips, she unceremoniously licks finger clean, enjoying the flavor of your thick cream. <i>“Hmm, tasty!”</i> she remarks. Turning to look down at you, she grins. <i>“Sorry for not sticking around, stud. But I really must be going, so I’ll see you around,”</i> she bids you farewell, throwing a smooch at you. ", parse);
			if(cat.FirstCock() && group) {
				parse["oneof"] = enc.enemy.length > 2 ? " one of" : "";
				parse["s"]     = enc.enemy.length > 2 ? "s" : "";
				Text.NL();
				Text.Add("<i>“Oh, and don’t mind the mess,”</i> she motions at the strands of her own cum painting her bosom. <i>“I’ll have[oneof] my friend[s] clean this up,”</i> she giggles.", parse);
			}
			Text.NL();
			if(group) {
				parse["comp"] = Text.Parse(" rejoins her companion[s] and", {s: enc.enemy.length > 2 ? "s" : ""});
			}
			else
				parse["comp"] = "";
			Text.Add("You watch the cat as she[comp] wanders off into the distance. Her gait is noticeably altered by a limp; she's definitely feeling the pounding you gave her. Once you can stand again, you head off on your way as well.", parse);
			Text.Flush();

			player.subDom.IncreaseStat(50, 1);

			player.AddLustFraction(-1);

			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Let’s make sure she’ll remember you for the coming weeks!"
	});
	options.push({ nameStr : "LayBack",
		func : function() {
			Text.Clear();
			Text.Add("With a soft, moaning sigh of contentment, you allow yourself to settle back against the ground. Your own motions nearly cease, content as you are to languidly lie there and cup her buttocks in your hands, feeling the flesh squish and flex most interestingly amidst your fingers. Giving yourself over to her entirely, you submit to being used like a toy, content to allow her to bring you both to your mutual climax. Your mind goes nearly blank, casting aside everything but the weight of your feline lover atop you, the feel of her fur against your [skin], the slapping of flesh on flesh and the sensations of her milking your cock for all she's worth.", parse);
			Text.NL();
			parse["b"] = player.HasBalls() ? Text.Parse(", and your [balls] churn,", parse) : "";
			Text.Add("It doesn’t take long before you feel yourself throbbing within [possessive] vagina. Pleasure surges across your body,[b] as you spill the first jet of cum within her waiting cunt.", parse);
			Text.NL();
			parse["deep"] = pCock.length.Get() > 20 ? "forcefully jam against her cervix" : "reach as deep within her quivering pussy as possible";
			Text.Add("Your orgasm draws a startled yelp from [name], knocking her off balance and forcing her to fall onto your [cock], causing your [cockTip] to [deep]. [Name] screams in delight as you fill her to capacity. Her cunt spasms around your [cock], coaxing you to deposit as much of your fertile cream as you can manage.", parse);
			Text.NL();
			Text.Add("You are more than happy to comply with her efforts, crying out your pleasure in sync with hers as you empty yourself in her willing depths.", parse);
			if(player.FirstVag())
				Text.Add(" Your neglected [vag] pours its fluids into the thirsty earth below you.", parse);
			if(cat.FirstCock())
				Text.Add(" Ignored between you, her girl-cock sprays a thick, hot, sticky splash of jism across your stomach, smearing you both with dickcream.", parse);
			Text.Add(" Finally - inevitably - the electric thrill of ejaculation fades away and is replaced by the warmth of your afterglow.", parse);
			if(player.OrgasmCum() > 4)
				Text.Add(" You can feel her seed-distended stomach pushing against your own [belly], visibly bloated by the sheer volume of your climax.", parse);
			Text.NL();
			Text.Add("With a sigh of contentment, you settle back into the divot your body has occupied on the ground. Unthinkingly, you cradle your feline lover to give her greater comfort atop of you", parse);
			if(cat.FirstCock())
				Text.Add(" as best that's possible given the herm-seed squelching wetly between your bodies", parse);
			if(dom)
				Text.Add(". Absently, you pet her head, caressing her ears.", parse);
			else
				Text.Add(". With a smile, you nuzzle her cheek with your own, running your fingers affectionately through her hair.", parse);
			Text.NL();
			Text.Add("<i>“Ah… that was great, lover. Just what I needed,”</i> she purrs.", parse);
			var cocked = 0;
			for(var i = 0; i < enc.enemy.length; i++) {
				var c = enc.enemy[i];
				if(c == cat) continue;
				if(c.FirstCock()) cocked++;
			}
			parse["s"]   = cocked > 1 ? "s" : "";
			parse["was"] = cocked > 1 ? "were" : "was";
			if(cocked != 0)
				Text.Add(" <i>“If only my companion[s] [was] half as good as you…”</i> she rolls her eyes.", parse);
			Text.Add(" <i>“As much as I want to keep you, I think I’ll let you go this time. Don’t expect me to go easy on you just because you showed me a great time though,”</i> she explains. <i>“Though I wouldn’t mind running into you again,”</i> she adds with a smile.", parse);
			Text.NL();
			if(dom)
				Text.Add("Next time, though, you get to be on top, you reply to her.", parse);
			else
				Text.Add("You tell her that you're already looking forward to it.", parse);
			Text.Add(" Extracting herself from your used member, she stretches the kinks out of her joints and saunters away. <i>“You can clean yourself up, right? Right. See ya around, stud. Do visit me again when I’m in heat,”</i> she giggles.", parse);
			if(group) {
				parse["s"] = group ? "s" : "";
				Text.Add(" As she goes, you notice her signaling for her companion[s] to follow, which they do.", parse);
			}
			Text.Flush();

			player.subDom.DecreaseStat(-50, 1);

			player.AddLustFraction(-1);

			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "This feels too good, plus she’s won fair and square. She can finish you off herself."
	});
	options.push({ nameStr : "TittyFuck",
		func : function() {
			Text.Clear();
			if(dom)
				Text.Add("It's time to take charge of this matter. With a fierceness more becoming of you, you suddenly surge into motion, pushing the startled feline atop of you over onto her back and pinning her down with your weight.", parse);
			else
				Text.Add("It's not really like you at all, but this is one time when you need to assert yourself. Unexpecting your sudden, uncharacteristic display of defiance, [name] mounting you is unprepared when you suddenly give her a fierce shove. With surprise on your side, you are able to lever her over and pin her down underneath you.", parse);
			Text.NL();
			Text.Add("[Possessive] startled yelp is silenced as you plunge inside her deeper than ever, battering her cervix with your [cockTip], drawing a whorish moan of pleasure, and then frustration as you pull out. As quickly as you can manage, you shove your [cock] between her luxurious mounds.", parse);
			Text.NL();
			parse["b"] = player.HasBalls() ? Text.Parse("your [balls] churn", parse) : "an electric shock course through your prostate";
			Text.Add("[Name] quickly catches on to your plans, and she grips her tits and mashes them together onto your shaft. The fur of her orbs tickle you as you plaster them with your mixed fluids, groaning as you feel [b].", parse);
			Text.NL();
			Text.Add("Her breasts feel incredible on your dick, the warm flesh and its soft coating of fur tickling deliciously against your pleasure sensitive cockmeat. After a few humps, you find your limit reached. Crying out in pleasure, you bury yourself as deep into her cleavage as possible and let loose, showering her tits and her face alike.", parse);
			Text.NL();
			Text.Add("In the midst of your climax, a thought pierces the haze, and reacting on pure instinct you reach back and forcefully stuff a couple of fingers into her now-empty pussy. You drive them into the grasping walls to the knuckles, and she yowls in rapture as your action provides the last bit of stimulus she needs. Her hands fly from her tits to grab madly at the soil below her, clawing for a grip as her jaws gape in pleasure. Though most of it misses the mark, some of your seed is definitely making its way inside her open mouth.", parse);
			Text.NL();
			player.OrgasmCum();
			Text.Add("Finally - blissfully - the feelings of climax come to an end and you collapse tiredly beside your feline partner. Lying there on your side in the dirt, basking in the warmth of afterglow, you watch absently as [name] heaves for breath, making her tits jiggle quite nicely.", parse);
			Text.NL();
			Text.Add("The kitty takes a moment to catch her breath, before she starts scraping the strands of your thick cream from her face and licking her hand clean. <i>“That was unexpected,”</i> she remarks. <i>“But you did show me a good time,”</i> she adds, propping herself up on her elbows.", parse);
			if(group) {
				parse["oneof"] = enc.enemy.length > 2 ? " one of" : "";
				parse["s"] = enc.enemy.length > 2 ? "s" : "";
				Text.Add("<i>“Guess I’ll have[oneof] my friend[s] clean me up later,”</i> she says absentmindedly.", parse);
			}
			else
				Text.Add("<i>“I’ll save the rest to eat on the go,”</i> she giggles.", parse);
			Text.NL();

			if(group) {
				parse["comp"] = Text.Parse(" and calls her friend[s] to her side", {s: enc.enemy.length > 2 ? "s" : ""});
			}
			else
				parse["comp"] = "";
			Text.Add("Having said that, she gets back on her feet, languidly stretching to remove the kinks from her joint. <i>“That was pretty good, stud. But I need to get going, so I guess I’ll bump into you some other time,”</i> she winks at you, [comp] as she leaves.", parse);
			Text.Flush();

			player.subDom.IncreaseStat(20, 1);

			player.AddLustFraction(-1);

			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You’re not about to be responsible for a bastard, so you’d better pull out and finish up on her chest. You doubt she’ll mind."
	});
	Gui.SetButtonsFromList(options);

	return true;
}

FelinesScenes.LossDrainMilk = function(mainCat : Wildcat, group : boolean, enc : any) {
	let player = GAME().player;
	var parse : any = {
		name : mainCat.nameDesc()
	};
	parse = player.ParserTags(parse);
	parse = mainCat.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, group);

	var rate = player.LactHandler().Rate();
	var milk = player.Milk();
	var size = player.FirstBreastRow().Size();

	Text.NL();
	parse["l"] = group ? "The leader" : mainCat.HeShe();
	Text.Add("Satisfied that the fight’s been knocked out of you, the big cat[s] lunge[notS] at you, knocking you onto your back. [l] drops to all fours in one graceful movement, mewling softly. [HeShe] circles you a few times, sniffing the air as if trying to scent something. Exactly what is soon revealed when the feline starts nosing eagerly at your [armor]", parse);
	if(rate >= 1)
		Text.Add(" and the damp spots on it", parse);
	Text.Add(", tugging at the material until it finally gives way.", parse);
	if(group)
		Text.Add(" The other cats spread out and form a circle about you, preventing your escape - if you even had the strength to make an attempt in the first place, that is.", parse);
	Text.NL();
	if(size < 10)
		Text.Add("With your [breasts] exposed to the open air, the feline noses at them, clearly taking delight in feeling how full and firm they are with milky goodness.", parse);
	else
		Text.Add("Freed of their constraints, your [breasts] flop out, made even heavier and more turgid by their milky load. Leaning in, the feline sniffs at them a moment, then lets out a purr of satisfaction and nuzzles [hisher] cheek against the large, pillowy mound.", parse);
	Text.NL();
	Text.Add("<i>“That smell!”</i> [name] purrs, licking [hisher] lips eagerly. <i>“You’re backed up… let me help you with that...”</i> ", parse);
	if(rate >= 3) {
		Text.Add("[HisHer] delight is only made all the more clear as [heshe] stares at the milk flowing freely from your [nips], all of that delicious cream going to waste, just flowing away into nothingness. Wasting no time, [heshe] pads over and latches onto a nipple eagerly, sucking for all [heshe]’s worth, and you cry out as your nerves sing in pleasure and being stimulated thus.", parse);
	}
	else if(rate >= 1) {
		Text.Add("Slowly, the feline moves [hisher] mouth to your [breasts], eyes greedily drinking in the sight of your slowly leaking [nips]. [HeShe] meows softly, once, twice, then begins lapping at the leakage like a good little kitten, [hisher] little pink tongue darting in and out of [hisher] mouth in a blur. The little jabs of pressure against your breastflesh only serve to make you gasp in pleasure and stimulates even more milk to ooze from your nips, and before long the big cat’s suckling from you.", parse);
	}
	else {
		Text.Add("Happily, the feline meows as [heshe] takes in your full milk-jugs, licking [hisher] lips in anticipation of a good meal. Easing a paw onto the mounds of your [breasts], [heshe] presses down gently but firmly, and is rewarded with a small squirt of white cream jetting forth.", parse);
		Text.NL();
		Text.Add("<i>“Looks tasty,”</i> the big cat muses to [himher]self, taking [hisher] time to drag [hisher] tongue across your mounds before finishing with a smack of [hisher] lips. <i>“I wonder just how much milk you’re worth.”</i>", parse);
		Text.NL();
		Text.Add("Before you can reply, the feline is upon you, head bowed as [heshe] sucks furiously at your [nips] in turn. You throw your head back with a gasp as warm wetness wells up behind your nipples, and then you’re being drained in earnest.", parse);
	}
	Text.NL();
	Text.Add("You gasp as the warmth of the big cat’s mouth engulfs your [nip], then again as [heshe] begins teasing the rapidly stiffening nub of flesh with [hisher] tongue. The moist, sandpapery feel of meat against meat has you groaning wantonly, body going limp as you succumb to the pleasure of being suckled by the eager feline. Without knowing it, you’re pushing your [breasts] into the big cat’s face, eager to have more of that wondrous sensation against your skin; at the same time, you reach up with a tender arm, holding the feline’s head in place while [heshe] continues to suckle.", parse);
	Text.NL();
	var gen = "";
	if(player.FirstCock()) gen += "[cocks] stiffen";
	if(player.FirstCock() && player.FirstVag()) gen += " and ";
	if(player.FirstVag()) gen += "cunt lips throb with moist heat";
	parse["gen"] = Text.Parse(gen, parse);
	Text.Add("On [hisher] part, the big cat increases the forcefulness of [hisher] pressure at your nipple, eagerly goading out its delicious contents. Tingles of electricity run down your spine and into your groin as you feel your milk let down from all the stimulation your [breasts] are getting, and you can’t help but feel your [gen] as the feline continues [hisher] tender ministrations. Not to be outdone, you can feel a distinctive heat growing in your ribs - seems like a flush of arousal is making itself well-known…", parse);
	Text.NL();
	Text.Add("The feline’s cheeks hollow and fill, hollow and fill as [heshe] continues sampling your milk bar, alternating between each breast in turn so your [nips] don’t get sore. ", parse);
	if(size < 10) {
		Text.Add("Despite your [breasts] steadily losing their turgid, firm texture as their load is drained from them, the feline simply lifts and supports each of them in turn by pressing both mounds of boobflesh between [hisher] paws, rubbing small circles on your skin in a bid to coax out every last drop of milk that you’re worth.", parse);
	}
	else {
		Text.Add("There’s simply so much of your bountiful mounds that the poor kitty just can’t get enough of them. Mewling and purring, [heshe] brushes [hisher] whiskers back and forth against firm boobflesh, the soft tickling leaving tingles lingering on your skin. As more and more milk is drained, the firmness of your [breasts] starts to sag a little, so [heshe] steadies each ample rise with [hisher] paws as [heshe] works at coaxing that last bit of delicious cream out of you.", parse);
	}
	Text.NL();
	parse["g"] = mainCat.FirstVag() ? "huskily" : "deeply";
	Text.Add("At length, the feline breaks free with an audible pop and purrs [g], [hisher] eyes roving over your now almost-empty milk bar. <i>“You’re a delicious one,”</i> [heshe] says with a soft sigh of contentment. <i>“I wish I could bring you back and have you for breakfast every day, but I’m afraid the others probably wouldn’t stand for it. Guess I’ll just have to catch you out here and keep you all to myself.”</i>", parse);
	Text.NL();
	Text.Add("Why, is [heshe] not the kind to share?", parse);
	Text.NL();
	Text.Add("<i>“No,”</i> the feline says with a huff. <i>“I want to keep you <b>all</b> to myself.”</i>", parse);
	Text.NL();
	Text.Add("Well, then. [HeShe]’d better finish up every last drop you’ve still left to give if [heshe] wants to keep you all to [himher]self; don’t want all that milk going to waste, does [heshe]? That’d make [himher] a very wasteful cat indeed, a very wasteful and naughty cat.", parse);
	Text.NL();
	Text.Add("<i>“As you wish,”</i> the feline purrs, and dips [hisher] head a final time, nuzzling aggressively at your breasts, pressing down hard and feeling heated boobflesh squash against [hisher] cheeks. A look of pure bliss spreads across [hisher] face and [hisher] eyelids begin to droop dangerously, but [heshe] does manage to drain you of the last of your milk. After that, [heshe] pushes [himher]self off you, satiated.", parse);
	Text.NL();
	if(milk > 20) {
		Text.Add("It takes quite a bit of effort for the big cat to do so, and you realize why when you get a good glimpse of [hisher] underbelly. It’s massively swollen to the point that you can’t quite believe <i>all</i> of that is your cream - just how did all that manage to fit inside of you? Is your milk secretly condensed while in your [breasts], and then rapidly expanded when it leaks out your [nips]? The world may never know.", parse);
		Text.NL();
		Text.Add("Wobbling and trembling all over, the feline curls up beside you, [hisher] stomach massively swollen with nourishment. [HisHer] steps are unsteady, [hisher] gaze dreamy; as you watch, [heshe] lets out a massive burp and groans in satisfaction.", parse);
		Text.NL();
		Text.Add("<i>“I’ve never had so much of something that was so good,”</i> [heshe] purrs woozily. <i>“I’d love to see you again… once I’ve found somewhere to sleep this off.”</i>", parse);
	}
	else if(milk > 10) {
		Text.Add("Now that you can get a good look at the feline’s underbelly, you note that [heshe]’s grown a nice protruding potbelly, soft and wobbly as your milk sloshes about inside [hisher] stomach. Guess you were more productive than you thought… and perhaps more delicious, too.", parse);
		Text.NL();
		Text.Add("<i>“You’re very definitely a tasty treat,”</i> the feline declares with a purr and a big smile on [hisher] face, looking distinctly like the cat which got the… well, technically [heshe] <i>is</i> the cat which got the cream. As you watch, [heshe] lets out a big burp and sighs dreamily. <i>“I hope to see you soon.”</i>", parse);
	}
	else {
		Text.Add("At length, the feline finishes up with a burp, then moves to wipe off [hisher] whiskers on you. Purring [g], the big cat rubs [hisher] flank against you affectionately, then lets [hisher] tail linger on you.", parse);
		Text.NL();
		Text.Add("<i>“Satisfying, very much so. I hope to see you again.”</i>", parse);
	}
	Text.NL();
	parse["group"] = group ? Text.Parse(" with the rest of [hisher] pride", parse) : "";
	Text.Add("With that, the feline stalks off[group], leaving you to lie back and wonder if it wouldn’t be so much easier to make a living by selling your own delicious creamy goodness. At length, you recover enough to at least sit up and redress yourself, wiping the worst of the milk stains from your [skin] and [armor], then heave yourself back on your feet.", parse);
	Text.Flush();

	player.MilkDrain(15);
	player.AddLustFraction(0.5);

	Gui.NextPrompt();

	return true;
}

/*
FelinesScenes.WinPrompt = function() {
	var enc = this;
	var parse : any = {

	};

	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}
*/

FelinesScenes.LossDoubleTeam = function(cat : Wildcat, cat2 : Wildcat, group : boolean, enc : any) {
	let player = GAME().player;
	let party : Party = GAME().party;

	var parse : any = {
		name  : cat.nameDesc(),
		Name  : cat.NameDesc(),
		group : cat.groupName,
		Group : cat.GroupName,
		race  : function() { return _.sample(cat.Race().Desc()).noun; },
		PapaMama : cat.mfTrue("Papa", "Mama"),
		handsomebeautiful : player.mfFem("handsome", "beautiful"),
		boygirl : player.mfFem("boy", "girl"),
		npc2gender : cat2.mfTrue("male", "herm")
	};
	parse = player.ParserTags(parse);
	parse = cat.ParserPronouns(parse);
	parse = cat2.ParserPronouns(parse, "", "2");
	parse = Text.ParserPlural(parse, group, "g");
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

	var season = WorldTime().season;
	parse["season"] = season == Season.Winter ? "gust of chill wind blows across" :
	                  season == Season.Spring ? "sudden breeze sends dandelion fuzz tickling across" :
	                  season == Season.Summer ? "gust of wind cools" : "gust of wind tosses a few stray leaves at";

	var subby = player.SubDom() < -10;

	Text.Clear();
	Text.Add("You’re spent, there’s no more fight left in you. Your shoulders slump as you lower your [weapon] with a sigh. One of [group] - apparently the one in charge - turns toward [hisher] companion[gs] for a moment, and you briefly wonder if escape is possible. Or, at the very least, that they will allow you to go on your merry way... unmolested, as it were. The first thing you notice as [name] turns back in your direction is [hisher] rapidly stiffening cock. So much for that.", parse);
	Text.NL();
	Text.Add("The cat-morph struts over, tail swishing lazily behind [hisher] well-toned rear, kitty-prick bobbing casually in front. [Name] comes to a stop before you, [hisher] ears twitching excitedly, green feline eyes leisurely sweeping up and down your body. As [heshe] takes you in, you become keenly aware of a strong, musky scent wafting from [hisher] genitals.", parse);
	Text.NL();
	Text.Add("Now that you can view [himher] up close, it is clear that the feline member [name] possesses is quite the impressive specimen. The cat-morph slowly strokes [himher]self, barely able to wrap a paw around the girth of [hisher] appendage in all its unsheathed glory, to say nothing of the bulging scrotum underneath.", parse);
	Text.NL();
	if(subby) {
		Text.Add("Despite everything, a familiar sensation stirs in your loins. Your head swims, your mind suddenly filled with the image of taking that barbed kitty-prick deep in your ready, needy… You shake it off and return to reality.", parse);
		Text.NL();
	}
	Text.Add("<i>“Hello, [handsomebeautiful],”</i> [name] mewls. ", parse);
	if(player.Armor())
		Text.Add("[HeShe] gestures at your raiment, <i>“You know how this works.”</i> You roll your eyes as the cat-morph helps you out of your [armor]. ", parse);
	if(player.LowerArmor())
		Text.Add("Before you can react, the feline yanks your [botarmor] off. ", parse);
	Text.Add("Your captor licks [hisher] lips, purring as [heshe] admires [hisher] prize. You stand stark naked in a clump of short grass, and shudder as a [season] your [skin]. Nothing but a freshly caught morsel about to be devoured.", parse);
	if(subby)
		Text.Add(" Not that you wouldn’t mind devouring some of that big, thick kitty-cock yourself, maybe with some hot cream to wash it down with… You shake the thought away, swearing to stop doing that.", parse);
	Text.NL();
	Text.Add("<i>“You like what you see,”</i> [name] mewls. It wasn’t a question. <i>“You want us,”</i> [heshe] continues. Again, not a question. <i>“We want you, yes?”</i>", parse);
	Text.NL();
	if(subby)
		Text.Add("You lick your lips. Well, if there’s no other way…", parse);
	else
		Text.Add("You sigh. Fine, let’s get this over with.", parse);
	Text.NL();
	Text.Add("The cat-morph chuckles, still stroking [hisher] member. ", parse);
	if(subby)
		Text.Add("<i>”It’s the only way, and there’s no need for empty protests.", parse);
	else
		Text.Add("<i>“Prey always acts so defiant.", parse);
	Text.Add(" We know you want us, you’re already feeling it. Now, come to [PapaMama] and we can have a good time.”</i> You look [himher] in the eyes, but before you can issue a denial, you realize that ", parse);
	if(player.FirstCock())
		Text.Add("your [cocks] stand[notS] rigid, a dribble of pre-cum already forming on [itsTheir] tip[s].", parse);
	else
		Text.Add("your [vag] is already quite wet, slick juices beginning to drip from puffed lips.", parse);
	Text.NL();
	if(subby)
		Text.Add("[HeShe]’s right, you want – no, you need - some kitty-dick in you.", parse);
	else
		Text.Add("Damn traitorous body. Might as well make the best of a bad situation.", parse);
	Text.NL();
	Text.Add("<i>”We’re glad to hear it; now get comfortable and we’ll fuck your brains out. It’ll be fun,”</i> [PapaMama] cat purrs.", parse);
	Text.NL();
	Text.Add("As you weigh your cock-taking options, you wonder out loud why [PapaMama] refers to [himher]self in the third-person.", parse);
	Text.NL();
	Text.Add("Your vanquisher softly purrs as a devilish smirk forms about [hisher] lips. [HeShe] pulls you close, strapping dong pressed close against your [skin]. <i>“I don’t,”</i> the cat whispers in your ear.", parse);
	Text.NL();
	Text.Add("That’s when you feel another set of paws on your [hips], and a second, equally impressive slab of cat-meat poking against your [butt]. <i>”My Bitch wants to play too.”</i> You glance behind at [hisher] companion, a [npc2gender] [race] sporting a similar grin. Your eyes go wide as you realize what they have in mind.", parse);
	Text.NL();
	Text.Add("Ohhhh. Well isn’t this your lucky day? Wait, doesn’t ‘bitch’ specifically refer to…?", parse);
	Text.NL();
	Text.Add("<i>“It’s a term of endearment, don’t overthink it,”</i> [PapaMama] cat replies. You guess there’s no point in stalling any longer.", parse);
	Text.Flush();

	var breastSize = player.FirstBreastRow().Size();

	//[Present] [Ride]
	var options = [];
	options.push({nameStr : "Present",
		tooltip : Text.Parse("Get down[l] and offer your ass.", {l: player.Humanoid() ? " on all fours" : ""}),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("There is a patch of short grass nearby that looks comfortable. You kneel down, ass ", parse);
			if(player.HasTail())
				Text.Add("and [tail] ", parse);
			Text.Add("in the air for all to see, [breasts] pressed against the ground. [Group] circle around you, leering at your naked, exposed body. You imagine their cocks throbbing ever larger with each passing moment. The thought of being used for their pleasure makes your cheeks burn with shame, ", parse);
			if(subby)
				Text.Add("which only serves to get you even more aroused.", parse);
			else
				Text.Add("despite your arousal.", parse);
			Text.NL();
			Text.Add("<i>“I’m taking this end,”</i> the Bitch cat announces. [HeShe2] ", parse);
			if(player.IsNaga())
				Text.Add("straddles your [legs] ", parse);
			else
				Text.Add("kneels down behind you ", parse);
			Text.Add("and places [hisher2] paws on your [butt], slowly caressing your rump and [hips]. After hefting both cheeks with a squeeze, and dropping them to watch the jiggle, [heshe2] concludes: ", parse);
			if(player.Butt().Size() < 5)
				Text.Add("<i>“A little scrawny for my taste, but good enough I guess.”</i>", parse);
			else
				Text.Add("<i>”Thick and meaty, just the way I like ‘em!”</i>", parse);
			Text.NL();
			Text.Add("Gee, thanks.", parse);
			Text.NL();
			var gen = "";
			if(player.FirstCock()) gen += "your cock[s] to throb";
			if(player.FirstCock() && player.FirstVag()) gen += " and ";
			if(player.FirstVag()) gen += "a wetness to stir inside your [vag]";
			parse["gen"] = Text.Parse(gen, parse);
			Text.Add("[PapaMama] cat kneels before you, stroking your [ears] and head. <i>”Don’t be rude, Bitch. This one is perfect,”</i> [heshe] chides. The cat-morph gently grabs you by the [hair], pulling you up onto your hands, face level with [hisher] engorged prick. [Name]’s musk assaults your nose again, the intoxicating odors causing [gen] in response. <i>”Beggars can’t be choosers; at least you get to have your favorite part this time.”</i>", parse);
			Text.NL();
			Text.Add("<i>”Yeah, thanks for that.”</i> Bitch licks a digit and uses it to probe your [anus], causing you to squeal. <i>“You ready for me already?”</i> the feline asks you as [heshe2] slides a paw ", parse);
			if(player.IsNaga())
				Text.Add("around your lower body ", parse);
			else
				Text.Add("between your legs ", parse);
			Text.Add("to caress your ", parse);
			if(player.HasBalls())
				Text.Add("dangling sack", parse);
			else if(player.FirstVag())
				Text.Add("moist slit", parse);
			else
				Text.Add("taint", parse);
			Text.Add(". You squeal again. <i>”That sounds like a ‘yes’ to me! C’mere.”</i> With that, [name] grabs both your hips, lines up, and slowly pushes into your pucker. [HeShe2] stops almost immediately, with just the tip of [hisher2] prick inside you. Your muscles reflexively clench around the prickly barbs, quivering as they press into your sensitive sphincter. ", parse);
			if(subby)
				Text.Add("You whimper and try to push back, wanting the rest of that thick cock in you, when a sudden swat to your rear stops you in your tracks. <i>”Patience,”</i> Bitch mewls.", parse);
			else
				Text.Add("You tense up, hoping the teasing will end soon. At the very least, you hope the fucking will start.", parse);
			Text.NL();
			Text.Add("<i>“If you want the rest, you have to take this one too. It’s only fair,”</i> [PapaMama] adds, gesturing at [hisher] inviting kitty-dick. You ", parse);
			if(subby)
				Text.Add("lick your lips and open wide, taking [hisher] tip into your waiting mouth. ", parse);
			else
				Text.Add("swallow and nod, giving the tip a little lick before wrapping your lips around it. ", parse);
			Text.Add("<i>”There’s a good [boygirl], don’t be afraid,”</i> [name] half-moans as you get to sucking, your lust in full control now. Barbs tickling against your tongue, you close your eyes and draw [himher] deeper into you.", parse);
			Text.NL();

			Sex.Blowjob(player, cat);
			player.FuckOral(player.Mouth(), cat.FirstCock(), 2);
			cat.Fuck(cat.FirstCock(), 2);

			var virgin = player.Butt().virgin;
			Text.Add("<i>”All right, now it’s a spit roast!”</i> Bitch exclaims. With a grunt, [heshe2] shoves [hisher2] girth into you. ", parse);
			if(virgin)
				Text.Add("Your colon lights up in pain and pleasure as the feline invades your backdoor for the first time. ", parse);
			Text.Add("The force of [hisher2] thrust throws you forward. You gag for a moment as [PapaMama]’s cock fills you up to [hisher] sheath, but recover in time to resume sucking [himher] off. Bitch grabs both your hips and pounds you hard and steady, [hisher2] member threatening to split you in half as [name] mercilessly pounds you. The sensation would have you moaning like a whore, but with your mouth already full, you only manage a muted whimper. The vibrations from your accidental hummer are enough to set off [PapaMama] cat, who yowls and grabs you by the [hair]. [HeShe] proceeds to fuck your face as [heshe] loses [himher]self to rutting bliss.", parse);
			Text.NL();

			Sex.Anal(cat2, player);
			player.FuckAnal(player.Butt(), cat2.FirstCock(), 2);
			cat2.Fuck(cat2.FirstCock(), 2);

			Text.Add("[Name] continues [hisher2] assault on your [butt], heavy balls slapping mightily against your ass cheeks. The pounding would have you on the verge of collapse were you not held fast by the dick in your mouth. Ragged breathing and flushed cheeks are the first signs of your lustful surrender. ", parse);
			if(breastSize >= 2) {
				Text.Add("Your [breasts] ", parse);
				if(breastSize < 7.5)
					Text.Add("jiggle about ", parse);
				else
					Text.Add("swing freely ", parse);
				Text.Add("with each wild thrust. Cool air blows against your [skin], making your [nips] erect and sensitive. ", parse);
				if(player.Lactation())
					Text.Add("They begin leaking, warm milk forming a small puddle beneath you. ", parse);
			}
			if(player.FirstCock())
				Text.Add("Your cock[s] flail[notS] about, pre-cum already leaking from [itsTheir] tip[s]. ", parse);
			if(player.FirstVag())
				Text.Add("Slick juices threaten to gush from the swollen lips of your untouched cunt. ", parse);
			Text.Add("As the twin shafts continue sliding into your mouth and ass, you reach back with one [hand] to where your own bits remain untouched. But just as you are about to ", parse);
			if(player.FirstCock())
				Text.Add("wrap your fingers around[oneof] your member[s] and jerk yourself, ", parse);
			else
				Text.Add("plunge a couple digits into your needy slit, ", parse);
			Text.Add("Bitch smacks your hand away. <i>”No need for that,”</i> [heshe2] chides with a click of the cat-tongue.", parse);
			Text.NL();
			Text.Add("Hrmph.", parse);
			Text.NL();
			Text.Add("Bitch chuckles and traces a clawed digit down your spine, starting at mid-back all the way down to your ", parse);
			if(player.HasTail())
				Text.Add("tail. [HeShe2] slips around to the underside where it meets your ass crack and strokes the sensitive spot.", parse);
			else
				Text.Add("ass crack.", parse);
			Text.Add(" [Name]’s ministrations cause you to arch your back in ", parse);
			if(player.RaceCompare(Race.Feline) >= 0.4)
				Text.Add("that familiar cat-like way", parse);
			else
				Text.Add("in a cat-like fashion", parse);
			Text.Add(", and the feline uses the opportunity to plow your [anus] even harder. But you can only be fucked like an animal for so long. As your chute is raked by the latest onslaught of barbed prick, you become keenly aware of an orgasm building somewhere deep inside.", parse);
			Text.NL();
			Text.Add("<i>”You’re really into this, aren’t you?</i> [PapaMama] teases. <i>”If you need to cum, just cum, darling.”</i>", parse);
			Text.NL();
			Text.Add("With [PapaMama]’s musky phallus throbbing in your mouth, and Bitch’s deep in your bowels, that’s all you needed to hear. ", parse);
			if(player.FirstCock()) {
				Text.Add("Your cock[s] tremble[notS]", parse);
				if(player.HasBalls())
					Text.Add(" and your balls grow tense", parse);
				Text.Add(". ", parse);
			}
			if(player.FirstVag())
				Text.Add("Your cunt shudders. ", parse);
			Text.Add("You clamp down involuntarily on both cocks inside you. And you cum. ", parse);
			if(player.FirstCock())
				Text.Add("Ropes of jizz shoot from[eachof] your prick[s], splattering violently on the ground. ", parse);
			else
				Text.Add("Torrents of femcum squirt from your untouched pussy, pooling beneath you. ", parse);
			Text.Add("Your vision blurs. You hope you can hold on long enough for the others to finish.", parse);
			Text.NL();

			var cum = player.OrgasmCum();

			Text.Add("A combination purr and yowl gets your attention from behind you. <i>“Hey, hot stuff, I’m gonna cum too. You want it in or out?”</i>", parse);
			Text.NL();
			Text.Add("Hntshdd plshh. You are suddenly aware of why you shouldn’t talk with your mouth full.", parse);
			Text.NL();
			Text.Add("<i>”I heard ‘inside.’ All right, here it comes!”</i> The cock in your rear throbs once, twice, and with a squeal the cat-morph blows [hisher2] load inside you. Powerful jets of hot seed fill you up, sticky warmth spreading inside as [name] empties [hisher2] balls. With a final twitch, Bitch shoots the last of [hisher2] cream into you. [HeShe2] leans on you for support, dick still in your ass, and pants at [PapaMama], <i>”Your turn. I don’t know how you always hold out so long.”</i>", parse);
			Text.NL();

			FelinesScenes.Impregnate(player, cat2, PregnancyHandler.Slot.Butt);

			parse["h"] = player.Hair().Bald() ? "" : Text.Parse(" by the [hair]", parse);
			Text.Add("<i>”Lots of practice,”</i> [PapaMama] replies, pulling you[h] off [hisher] musky rod. <i>”See, it’s all about staying in control.”</i> [Name] wraps the other paw around [hisher] phallus, and two quick jerks later [heshe] erupts onto your face. Spurts of kitty spunk fill your nose and mouth, others arc over your head, splattering on your back. The feline lets go, allowing you to slide off the cock in your rear and collapse in the puddle of fluids, exhausted but satisfied. [HeShe] leans down, wipes a thick glob of cum from your nose and gives you a playful lick. <i>”Now, didn’t we all have a good time?”</i>", parse);
			Text.NL();
			Text.Add("We sure did. You are dimly aware of one of the felines patting your [butt] as you sink into a satisfied, yet sticky, slumber.", parse);
			Text.Flush();

			Gui.NextPrompt();
		}
	});
	if(player.FirstVag()) {
		options.push({nameStr : "Ride",
			tooltip : Text.Parse("Stuff that cock inside your [vag]. The other cat doesn’t seem interested in that hole anyway…", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("You sink to the ground, ", parse);
				if(player.IsNaga())
					Text.Add("[legs]", parse);
				else
					Text.Add("knees", parse);
				Text.Add(" nestled in the soft grass. [PapaMama] cat raises your chin with one digit and gazes deeply into your [eyes]. With a smile, [heshe] begins caressing your face with [hisher] unsheathed prick, [hisher] musk – and that of several others, you figure - driving your horniness to new heights. As [heshe] strokes your [ears] with one paw, [heshe] utters a single word: <i>“Lick.”</i>", parse);
				Text.NL();
				Text.Add("Leaning forward, you brush the bottom of [hisher] hefty sack with your [tongue], hungrily working your way around each of [hisher] furry balls. [Name] purrs as you prod and lick the base of [hisher] sheath, circling, savoring the salty mix of pre and others’ fluids. You greedily suckle the underside of [hisher] shaft, tongue raking against its prickly barbs as you slide along its length to the tip.", parse);
				Text.NL();
				if(subby)
					Text.Add("Lust gets the better of you with the promise of delicious kitty-cream bobbing invitingly at your lips. The intense desire to suckle your captor overwhelms your self-control. You open wide…", parse);
				else
					Text.Add("You have to admit, you’re really getting into this now. As your tongue dances across [PapaMama]’s meat, the urge hits to take things a step further. You give the tip a final lick, open your mouth and…", parse);
				Text.NL();
				parse["h"] = player.Hair().Bald() ? "" :  Text.Parse(" by your [hair]", parse);
				Text.Add("<i>“Slow down there, hot stuff!”</i> The feline’s mate yanks you backward[h]. <i>“I’m not gonna let you two hog all the fun,”</i> Bitch growls, [hisher] cock poking your rear as a friendly reminder that [heshe] wants to play too.", parse);
				Text.NL();
				Text.Add("<i>“Come on then,”</i> [PapaMama] purrs. [HeShe] lies prone in the grass before you, legs together, barbed prick standing invitingly erect. <i>“You waiting for an invitation? Hop on.”</i>", parse);
				Text.NL();
				Text.Add("With pleasure!", parse);
				Text.NL();
				if(player.IsNaga())
					Text.Add("You slither atop the supine cat-morph and seat yourself upon [hisher] crotch, ", parse);
				else
					Text.Add("You swing a bare leg over the supine cat-morph and straddle [himher], ", parse);
				Text.Add("your [vag] brushing against furry balls and shaft. [HeShe] slides both paws down your sides, settling on your hips, and gives them a squeeze. Another set roughly grabs both cheeks of your [butt]. The second [race] gently pushes you forward, [PapaMama] cat’s now twitching dick sending waves of pleasure through your bits. You wind up prone atop your former opponent, [breasts] squishing against [hisher] ", parse);
				if(cat.Gender() == Gender.male)
					Text.Add("fuzzy chest.", parse);
				else
					Text.Add("furred mounds.", parse);
				if(player.FirstCock())
					Text.Add(" Your own cock[s] nestle[notS] in a fluffy pile of warm, soft kitty-fur.", parse);
				Text.Add(" [HeShe] raises [hisher] lips to yours for a surprisingly tender kiss, then with a sudden shove, impales your cunt on [hisher] rigid member.", parse);
				if(player.FirstVag().virgin)
					Text.Add(" You whimper as your virginity is taken from you, not that it slows you down any.", parse);
				Text.NL();

				Sex.Vaginal(cat, player);
				player.FuckVag(player.FirstVag(), cat.FirstCock(), 2);
				cat.Fuck(cat.FirstCock(), 2);

				Text.Add("You let out an unceremonious squeal as [name]’s barbs rake the insides of your [vag]. [HeShe] grabs hold of your ass with both paws and begins slowly thrusting into your needy snatch, your [hips] gyrating with a will of their own as you match [hisher] movements.", parse);
				Text.NL();
				Text.Add("<i>“Lemme see the goods,”</i> Bitch whines. His mate responds by thrusting a little deeper inside you while spreading your ass cheeks wide, your pucker on full display. ", parse);
				if(player.HasTail())
					Text.Add("A powerful paw grips your tail, lifting it up and out of the way. ", parse);
				Text.Add("Your [anus] twitches as the tip of the second feline cock presses against it, as if begging for entry. <i>“Room for one more?”</i> Bitch asks teasingly.", parse);
				Text.NL();
				Text.Add("<i>“Just get in there already,”</i> [name] beneath you growls.", parse);
				Text.NL();
				Text.Add("Yeah, just get in there already!", parse);
				Text.NL();
				Text.Add("<i>“With pleasure!”</i> the less dominant feline exclaims. With a grunt, [heshe2] stuffs the tip of [hisher2] kitty-cock inside your waiting rosebud, its barbs sending shockwaves of pleasure through you as they slip through your sphincter. You let out a ", parse);
				if(player.Butt().virgin)
					Text.Add("sharp cry of pain as your virgin asshole is stretched, which quickly becomes a ", parse);
				Text.Add("lewd moan as the cat-morph sinks [hisher2] dick to the hilt. Then the real fucking begins.", parse);
				Text.NL();

				Sex.Anal(cat2, player);
				player.FuckAnal(player.Butt(), cat2.FirstCock(), 2);
				cat2.Fuck(cat2.FirstCock(), 2);

				Text.Add("With the feline pair now in control of both orifices, your body gives in to lust. You whine through clenched teeth as the twin cocks piston in and out of your dripping pussy and rear entrance. The sensation of being constantly stuffed - of delicious fullness - sends you into an animalistic rut, the felines’ alternating thrusts filling and emptying you in a never-ending cycle of dick-fueled ecstasy. You grind into each throbbing intruder in turn, taking as much dick into you as you can, wishing there were more [race]s around so one could fuck your mouth as well. Anything to satisfy your lusty desires.", parse);
				Text.NL();
				Text.Add("As if reading your mind, Bitch slides [hisher2] paws under your chest, ", parse);
				if(breastSize >= 2)
					Text.Add("giving your [breasts] a squeeze,", parse);
				else
					Text.Add("gripping your muscled pecs tightly,", parse);
				Text.Add(" and pulls you upright. The cat-morph fucks your ass with wild abandon, pinching your nipples and biting roughly at your neck. You grind your pussy against [PapaMama] [race], moaning loudly as you teeter on the edge of climax.", parse);
				if(player.FirstCock()) {
					Text.Add(" [PapaMama] cat ", parse);
					if(player.HasBalls())
						Text.Add("strokes your churning ballsack, then ", parse);
					Text.Add("grabs[oneof] your shaft[s] and begins quickly stroking you off, the pressure building in your loins, ready to blow.", parse);
				}
				Text.NL();
				Text.Add("There’s only so much cock you can take, and you are at your limit. Your breathing becomes ragged and catches in your throat, muscles tense and straining, ready to let loose your pent up orgasm. Bitch lifts a paw to your face, turns it to the side, leans in, and shoves [hisher2] rough tongue in your mouth.  That pushes you over the edge; you lose all sense of the world as you finally cum, sweet nectar gushing around the dick buried deep in your pussy.", parse);
				if(player.FirstCock())
					Text.Add(" Your own cock[s] ready to burst, [PapaMama] cat aims your throbbing member[s] high. Geysers of warm spunk splatter against your [breasts] and face, not stopping until you are completely drained.", parse);
				Text.NL();

				var cum = player.OrgasmCum();

				Text.Add("Your muscles reflexively clamp down on the kitty-pricks still stuffing your ass and cunt as if begging to milk them dry, their barbs pressing into your sensitive insides. That sets off both cats; in unison, they yowl, thrust, shudder, and pump their sweet cream inside you. You whimper, warmth spreading to every part of your insides as thick jets of seed fill your already stuffed holes to the brim, and more.", parse);
				Text.NL();

				FelinesScenes.Impregnate(player, cat);
				FelinesScenes.Impregnate(player, cat2, PregnancyHandler.Slot.Butt);

				Text.Add("After the pair has finished emptying themselves inside you, [PapaMama] cat pulls you close. You collapse against [himher], jizz still leaking from both orifices, a spent little fucktoy. [HeShe] pats your head and whispers, <i>“Told ya you’d have fun.”</i>", parse);
				Text.NL();
				Text.Add("As exhaustion and sleepiness overtake you, you admit you’d have to agree.", parse);
				Text.Flush();

				Gui.NextPrompt();
			}
		});
	}

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Some time later, you come to. [Group] are long gone", parse);
		if(party.coin > 0)
			Text.Add(", and a quick check of your possessions confirms some of your coin is too", parse);
		Text.Add(". Sticky and sore, yet satisfied, you collect your things and rejoin your party. Hopefully, your next encounter will be with a nice, warm bath.", parse);
		Text.Flush();

		party.coin -= 25;
		if(party.coin < 0) party.coin = 0;

		TimeStep({hour: 1});

		Gui.NextPrompt();
	});

	Gui.SetButtonsFromList(options, false, null);

	return true;
}

export { FelinesScenes };
