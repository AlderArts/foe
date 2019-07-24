/*
 * 
 * Golem boss
 * 
 */

import { BossEntity } from '../../enemy/boss';
import { Images } from '../../assets';
import { Element } from '../../ability';
import { Body } from '../../body/body';
import { Race } from '../../body/race';
import { Color } from '../../body/color';
import { Text } from '../../text';
import { Party } from '../../party';
import { Encounter } from '../../combat';
import { SetGameState, GameState } from '../../gamestate';
import { Gui } from '../../gui';

let GolemScenes = {};
GolemScenes.State = {
	NotMet       : 0,
	Met_ran      : 1,
	Lost         : 2,
	Won_noLoss   : 3,
	Won_prevLoss : 4,
	Rebuilt      : 5
};


function GolemBoss(storage) {
	BossEntity.call(this);
	this.ID = "golem";
	
	this.avatar.combat     = Images.golemboss;
	
	this.name              = "Golem";
	this.monsterName       = "the golem";
	this.MonsterName       = "The golem";
	
	// TODO Stats
	
	this.maxHp.base        = 800;
	this.maxSp.base        = 250;
	this.maxLust.base      = 100;
	// Main stats
	this.strength.base     = 40;
	this.stamina.base      = 30;
	this.dexterity.base    = 20;
	this.intelligence.base = 5;
	this.spirit.base       = 8;
	this.libido.base       = 30;
	this.charisma.base     = 20;
	
	this.elementDef.dmg[Element.mFire]    =  0.5;
	this.elementDef.dmg[Element.mIce]     =  0.5;
	this.elementDef.dmg[Element.mThunder] =  0.5;
	this.elementDef.dmg[Element.mEarth]   =   -1;
	
	this.level             = 10;
	this.sexlevel          = 2;
	
	this.combatExp         = 100;
	this.coinDrop          = 500;
	
	this.body              = new Body(this);
	
	this.body.SetRace(Race.Demon);
	
	this.body.SetBodyColor(Color.black);
	
	this.body.SetEyeColor(Color.red);
	
	this.flags["Met"] = GolemScenes.State.NotMet;

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();

	if(storage) this.FromStorage(storage);
}
GolemBoss.prototype = new BossEntity();
GolemBoss.prototype.constructor = GolemBoss;

//TODO
GolemBoss.prototype.DropTable = function() {
	var drops = [];
	drops.push({ it: Items.Weapons.MageStaff });
	drops.push({ it: Items.Armor.MageRobes });
	return drops;
}

GolemBoss.prototype.FromStorage = function(storage) {
	// Personality stats
	
	// Load flags
	this.LoadFlags(storage);
}

GolemBoss.prototype.ToStorage = function() {
	var storage = {};
	this.SaveFlags(storage);
	
	return storage;
}

GolemBoss.prototype.Act = function(encounter, activeChar) {
	// TODO: AI!
	Text.Add(this.NameDesc() + " shuffles around cumbersomely.");
	Text.NL();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);
	
	
	var choice = Math.random();
	if(choice < 0.2 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.Use(encounter, this, t);
	else if(choice < 0.4 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this))
		Abilities.Physical.CrushingStrike.Use(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.GrandSlam.enabledCondition(encounter, this))
		Abilities.Physical.GrandSlam.Use(encounter, this, party);
	else
		Abilities.Attack.Use(encounter, this, t);
}


GolemScenes.FirstApproach = function() {
	var parse = {
		s : party.Num() > 1 ? "s" : ""
	};
	
	golem.flags["Met"] = GolemScenes.State.Met_ran;
	
	Text.Clear();
	Text.Add("You apprehensively approach the ancient tower, a structure that appears to have stood in this spot for ages. From the crumbling stone, you’d guess it is much older than the walls surrounding the royal grounds, and perhaps older than the castle itself. It is somewhat surprising that it has been allowed to fall into such disrepair, considering the neat appearance of the surrounding area.", parse);
	Text.NL();
	Text.Add("Then again, perhaps any workers were dissuaded by the ethereal atmosphere surrounding the tower. You are vaguely reminded of the mound near the crossroads where you first entered into Eden - another spot where the fabric of reality seemed tenuous at best. An eerie glow emanates from windows in the upper levels of the tower, flickering between strange colors - some of which you aren’t even sure you could name.", parse);
	Text.NL();
	Text.Add("The tower doesn’t seem to have any obvious entrance, no doors or windows close to the ground level. A quick survey of the area reveals no hidden tunnels or other such means of entry. ", parse);
	if(party.Num() > 2)
		Text.Add("None of your companions are able to find any means of entry either. ", parse);
	else if(party.Num() == 2)
		Text.Add("[name] looks a bit perplexed, also unable to find any mean to enter the tower. ", {name: party.Get(1).name});
	Text.Add("There is something though…", parse);
	Text.NL();
	Text.Add("You take out the strange gemstone that you carry. It seems - for lack of a better term - more alive than before, pulsing and throbbing happily in the presence of the unsettling structure. Before you have time to further contemplate this, however, a loud rumbling noise draw your attention. For no reason apparent to you, a large portion of the tower wall has suddenly started to move.", parse);
	Text.NL();
	Text.Add("Right in front of your eyes, the stone reforms itself, piling higher and higher into a towering, vaguely humanoid shape. Behind the massive golem, the inside of the tower is wrought in impenetrable darkness. The hulking shape squares its blocky shoulders, its glowing eyes peering down at the intruder[s] in front of it. Moving sluggishly, it takes a defensive stance, blocking your way into the tower. Seems like you’ll have to fight your way through here.", parse);
	Text.Flush();
	
	GolemScenes.FightPrompt();
}

GolemScenes.FightPrompt = function() {
	var parse = {};
	//[Fight!][Leave]
	var options = new Array();
	options.push({ nameStr : "Fight!",
		func : function() {
			golem.RestFull();
			
			var enemy = new Party();
			enemy.AddMember(golem);
			var enc = new Encounter(enemy);
			enc.onRun = function() {
				Text.Clear();
				Text.Add("You make a hasty retreat, glad that the golem doesn’t seem to be interested in following you. When you’ve put a fair amount of ground between yourself and the tower, the light seems to fade from its eyes. With no threat to defend against, the automaton dissolves, its parts flowing back to their original spots. Once again, the tower wall is whole.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Castle.Grounds);
				});
			};
			enc.onLoss    = GolemScenes.OnLoss;
			enc.onVictory = GolemScenes.OnWin;
			enc.Start();
		}, enabled : true,
		tooltip : "Try to defeat the tower guardian in order to gain entry!"
	});
	options.push({ nameStr : "Leave",
		func : function() {
			MoveToLocation(world.loc.Rigard.Castle.Grounds);
		}, enabled : true,
		tooltip : "Retreat for now - it doesn’t look like it will follow you."
	});
	Gui.SetButtonsFromList(options);
}

GolemScenes.RepeatApproach = function() {
	Text.Clear();
	Text.Add("You approach the ancient old tower again, wary of its guardian. Once you are close enough, the wall gives a shudder and the hulking golem forms itself again. You’ll have to fight it if you want to get past it.");
	Text.Flush();
	
	GolemScenes.FightPrompt();
}

GolemScenes.OnWin = function() {
	var parse = {
		name       : function() { return kiakai.name; },
		hisher     : function() { return kiakai.hisher(); },
		playername : player.name
	};
	
	
	Gui.Callstack.push(function() {
		SetGameState(GameState.Event, Gui);
		
		Text.Clear();
		Text.Add("With a final shudder, the golem staggers back, unable to withstand any more punishment. As the magic that holds it together dissipates, the automaton cracks apart, crumbling into a pile of rubble.", parse);
		if(golem.flags["Met"] == GolemScenes.State.Lost)
			Text.Add(" You are slightly disappointed that the golem didn’t assume its other form, robbing you of the opportunity to return the favor.", parse);
		Text.Add(" Behind it, the dense darkness filling the interior of the tower lifts, revealing a number of strange devices and a narrow staircase leading to the upper floors.", parse);
		Text.NL();
		if(party.Num() > 2)
			parse["comp"] = " and checking on your companions";
		else if(party.Num() == 2)
			parse["comp"] = Text.Parse(" and checking on [name]", {name: party.Get(1).name});
		else
			parse["comp"] = "";
		Text.Add("After squaring your shoulders[comp], you step inside, peering around curiously at the odd furniture scattered throughout the room. There are many antiques, but they don’t look like they are of the usual style you’ve seen in Rigard. Each article looks like it was crafted from a single piece of wood, and it looks less carved and more… grown.", parse);
		Text.NL();
		if(party.InParty(kiakai)) {
			Text.Add("<i>“[playername], this is elven craftsmanship,”</i> [name] says, [hisher] voice muted. <i>“It was a long time ago, but I remember wood like this from back home...”</i>", parse);
			Text.NL();
		}
		Text.Add("After a brief survey, you continue to the next floor, which looks like it is a living room, containing several chairs and tables and a large divan with fine cloth covering it. On second thought, living room is perhaps the wrong word - it doesn’t look like anyone has been here for quite some time. There are some sort of candles providing light, but the fire doesn’t look or move naturally.", parse);
		Text.NL();
		Text.Add("The next floor contains a bedroom, and this place has clearly been in use, and not just for sleeping either. The sheets of the large bed - a beautiful piece of woodwork looking like a huge leaf - are ruffled and stained with sexual fluids. Large glass bottles containing a luminescent fluid are neatly lined up on a shelf in a nearby bookcase, stored for who knows what purpose.", parse);
		Text.NL();
		if(party.Num() > 2)
			parse["comp"] = ", followed by your companions";
		else if(party.Num() == 2)
			parse["comp"] = Text.Parse(", followed by [name]", {name: party.Get(1).name});
		else
			parse["comp"] = "";
		Text.Add("On a nightstand, there is a small pile of parchments with strange symbols scrawled on it, letters from no alphabet you recognize, elaborate arcane diagrams and charts. From the floor above, you hear a bustle of activity, and see the strange flickering light that you saw from the outside. Steeling yourself for whatever awaits you above, you continue up the final set of stairs[comp].", parse);
		Text.Flush();
		
		world.TimeStep({minute: 30});
		
		if(golem.flags["Met"] == GolemScenes.State.Lost)
			golem.flags["Met"] = GolemScenes.State.Won_prevLoss;
		else
			golem.flags["Met"] = GolemScenes.State.Won_noLoss;
		
		Gui.NextPrompt(Scenes.Jeanne.First);
	});
	Encounter.prototype.onVictory.call(this);
}

GolemScenes.OnLoss = function() {
	var parse = {
		name          : function() { return party.Get(1).name; }
	};
	
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	this.Cleanup();
	SetGameState(GameState.Event, Gui);
	
	if(party.Num() > 2)
		parse["comp"] = " and your companions";
	else if(party.Num() == 2)
		parse["comp"] = Text.Parse(" and [name]", parse);
	else
		parse["comp"] = "";
	
	
	Text.Clear();
	Text.Add("Unable to fight back any longer, you[comp] fall to the ground, defeated by the hulking golem. ", parse);
	if(golem.flags["Met"] == GolemScenes.State.Lost) {
		Text.Add("Having seen the process before doesn’t make it any less strange as the giant transforms into a perfect ebony Goddess, her body striped with pulsing red veins. Without a word or hint of an expression, the stunning animated statue closes in on you.", parse);
	}
	else {
		Text.Add("Fearfully, you wait for the last blow to fall, but the golem seems to have stopped in its tracks. The automaton has an unreadable expression in its soulless eyes, but your submission seems to have triggered something. With a loud crackling noise, the stone begins to reshape itself, compressing into a much smaller, sleeker form.", parse);
		Text.NL();
		Text.Add("Your eyebrows rise in surprise as the hulking, genderless mass of rock transforms into a quite shapely statue of black obsidian, and a decidedly female one at that. The golem is just under six feet tall, the shining rock exquisitely carved into the beautiful curves of a perfect hourglass figure. Whatever spellcaster that crafted it paid minute attention to detail, considering the creature is complete with nipples, belly button and vagina.", parse);
		Text.NL();
		Text.Add("The golem shifts slightly, breaking the illusion of being a statue. There is a red gleam emanating from the thin seams connecting the sleek layers of compressed rock, allowing it to move freely. The golem’s perfect face - a masterful piece of art surrounded by a solid mass of rigid curls so meticulously crafted that you can see each hair - is devoid of any emotions as it closes in on you, its joints moving with mechanical precision.", parse);
	}
	Text.NL();
	Text.Add("You gulp as the golem looms above you, smaller but still imposing. Straddling you, she leans down and licks your body, her tongue deceptively smooth. She seems to be secreting some sort of scented oil that she generously lathers you with. The smell is intoxicating, and every place the slick substance touches on your form tingles.", parse);
	Text.NL();
	if(player.FirstBreastRow().Size() > 3)
		Text.Add("The golem kneads your [breasts], suckling your [nips] and lathering them with her oil. Before she continues down to your [belly], you are breathing heavily, your nipples stiff with arousal.", parse);
	else
		Text.Add("The golem looks a bit surprised - as much as that is possible for a creature lacking any form of emotion - when her probing tongue reaches your flat chest. She prods at it a little, pulling on your [nips] as if expecting full breasts to suddenly sprout. When nothing happens, the automaton mechanically kneads her oil onto your chest anyway before continuing her journey down your body.", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("Your tender but expressionless lover looks a bit puzzled at your [cocks] as if not expecting [itThem] to be there. After giving [itThem] a brief examination, she promptly ignores the unfamiliar element[s]. ", parse);
	}
	var tail = player.HasTail();
	if(tail) {
		parse["s"]     = tail.count > 1 ? "s" : "";
		parse["oneof"] = tail.count > 1 ? " one of" : "";
	}
	parse["tail"] = tail ? Text.Parse(", her tongue playing along[oneof] your tail[s]") : "";
	Text.Add("Satisfied with her treatment of your front, the golem rolls you over on your stomach, her slick fingers trailing down your back[tail].", parse);
	Text.NL();
	if(golem.flags["Met"] == GolemScenes.State.Lost) {
		Text.Add("Knowing what comes next, and that struggling against it is futile, you resign yourself to the obsidian golem’s wishes. Last time wasn’t too bad, you tell yourself.", parse);
	}
	else {
		Text.Add("You try to move, but find yourself unable to budge the automaton even a fraction of an inch. Despite her slender stature, the obsidian Goddess must weigh well over a ton, and her strength has not diminished the least. Finding that struggling is futile, you resign yourself to whatever the golem has in store for you. At least she hasn’t harmed you since she changed her form.", parse);
	}
	Text.NL();
	parse["continuing"] = player.LowerBodyType() == LowerBodyType.Single ? "circling around" : "continuing";
	Text.Add("While tender yet immovable hands hold you in place, the golem explores your [butt], massaging your cheeks with her lubricating oil. Her tongue travels downward, giving your [anus] a lick before [continuing] toward your crotch.", parse);
	Text.NL();
	var target = BodyPartType.ass;
	parse["target"] = parse["anus"];
	if(player.FirstVag()) {
		target = BodyPartType.vagina;
		parse["target"] = parse["vag"];
		Text.Add("Finally finding her target, the animated stone statue plunges her oily tongue into your [vag], gently probing your insides.", parse);
	}
	else {
		parse["tightLoose"] = player.Butt().Tightness() > Orifice.Tightness.loose ? "loose" : "tight";
		Text.Add("Pausing for a bit, as if her limited intelligence is unable to process the concept of you not having a pussy, the golem apparently comes to a decision and returns her attention to your [anus], thrusting her tongue into the [tightLoose] hole.", parse);
	}
	Text.Add(" There is a low creaking, and you gasp as her tongue changes form, growing in length in order to reach even deeper inside you. Every square inch of the inside of your [target] is soon coated in the tingly oil, making it very difficult for you to form coherent thoughts. You moan despite yourself, unable to deny the pleasure you are getting from this any longer.", parse);
	Text.NL();
	Text.Add("When she deems you lubed up, the golem withdraws her tongue, shifting around behind you. You hear more of the grinding cracks indicating that the creature is reshaping itself, and feel a cool mass pressing itself between your parted cheeks. Throwing a furtive glance over your shoulder, you confirm that the golem is now sporting a nine-inch, literally rock-hard obsidian cock, and it doesn’t take a genius to guess what she means to do with it.", parse);
	Text.NL();
	Text.Add("Concepts like tight or loose means little when you have the strength of a dozen horses and weigh over a ton. The golem wants to be inside you, and there is nothing you can do about it. She starts to mechanically rock her hips, quickly burying her entire artificial member inside your [target]. While she isn’t rough, there is such strength in her thrusts that you suspect she could keep the same pace while punching holes through plate armor. Lubricated by her sense-heightening oil, you have a hard time not enjoying yourself. In fact, this feels <i>really</i> good.", parse);
	Text.NL();
	if(target == BodyPartType.vagina) {
		player.FuckVag(player.FirstVag(), golem.FirstCock(), 3);
		Sex.Vaginal(golem, player);
	}
	else {
		player.FuckAnal(player.Butt(), golem.FirstCock(), 3);
		Sex.Anal(golem, player);
	}
	
	if(player.FirstCock()) {
		Text.Add("Unbidden, your [cocks] [isAre] at full mast, neglected by the automaton. At this pace, it’s not going to be long before you have a messy accident. ", parse);
		if(target == BodyPartType.ass)
			Text.Add("Each thrust rubs her cockhead against your prostate, making your member[s] throb, aching with need. ", parse);
	}
	Text.Add("The golem keeps a slow but constant rhythm, her precise mechanical movements indicating that she could keep this up for days if need be. Through the shroud of lust and pleasure clouding your thoughts, you briefly wonder if it is even possible for the creature to tire.", parse);
	Text.NL();
	Text.Add("Just when you’ve grown accustomed to the steady tide of withdraw and thrust - resigned to the fact that the golem is much stronger than you and is going to have its way no matter what your opinions on the matter are - your lover abruptly changes her rhythm. Adjusting her stance, she plants her feet along your sides, grabbing hold of your [butt] with her iron grip. With new fervor, she starts relentlessly pounding your [target], her cock a blur as it pistons your insides.", parse);
	Text.NL();
	parse["again"] = golem.flags["Met"] == GolemScenes.State.Lost ? " again" : "";
	Text.Add("No longer capable of rational thought, you gasp for breath, moaning incoherently as the automaton fucks you. Why did you even come here[again]?", parse);
	if(golem.flags["Met"] == GolemScenes.State.Lost)
		Text.Add(" Did you just return in order for her to dominate you? Are you really that much of a slut?", parse);
	Text.Add(" Though her movements remain mechanical, she is adjusting her angle according to your response, shifting slightly until each thrust is a blinding shock of pleasure surging up your spine. You know you can’t last like this for long - you are so close to cumming...", parse);
	Text.NL();
	parse["l"] = player.LowerBodyType() == LowerBodyType.Single ? " tail gives" : " legs give";
	if(player.FirstVag())
		Text.Add("Spots dance across your vision as the golem repeatedly bumps your g-spot, her oil-soaked cock plowing your [vag] like a pillar of molten fire. Your entire body tingles electrically, almost numb from the overwhelming pleasure. With a loud moan, you convulse, your [hips] twitching as you ride out your orgasm. ", parse);
	if(player.FirstCock())
		Text.Add("Your seed splatters on the ground, jetting out from your [cocks] in thick wads. ", parse);
	parse["c"] = player.FirstCock() ? ", and you collapse in the growing pool of your own sperm" : "";
	Text.Add("Seemingly indifferent to your climax, the golem doesn’t alter her pace even slightly, riding you with undiminished speed and strength throughout your high. Your[l] out under you, unable to support you any longer[c].", parse);
	Text.NL();
	Text.Add("Gradually, you come down from the blissful heaven of sexual ecstasy. In your weakened state, you are unable to do anything but lie there and take it, grunting as the golem continues to ride you. Suddenly, the creature flips you over on your back, allowing you to see your adversary. The beautiful obsidian statue still has the same blank, expressionless face, though in your mind a small triumphant smirk is playing on her lips.", parse);
	Text.NL();
	Text.Add("There is a thin coating of oil covering her entire body, making her sleek artificial muscle and perfectly proportioned breasts shine. The perfect statue of a Goddess… with some additional parts. As if reading your mind, the golem slowly pulls out of you, her rigid shaft popping into view. With growing concern, you watch as it swells up, creaking and rumbling as it gains a few more inches in length and a fair amount of girth. With a sinking heart, you realize that she could probably at least double in size without effort. Without uttering a word, she plunges back inside you.", parse);
	Text.NL();
	Text.Add("With her newly extended cock, it is a whole new experience. You moan helplessly as your [target] is pounded into oblivion by the thick obsidian pillar, now reaching farther inside you than ever. You don’t know how long you spend like that, [legs] in the air and tongue lolling, any measure of time shattered by the ceaseless thrusting of the golem’s shaft. As another orgasm hits, you almost lose consciousness, limbs limp from your rough fucking.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 4});
	player.AddLustFraction(-1);
	player.AddHPFraction(-1);
	player.AddHPAbs(1);
	
	Gui.NextPrompt(function() {
		Text.Clear();
		parse["cc"] = player.FirstCock() ? ", covered in strands of your own seed" : "";
		Text.Add("As time passes, you come to again. You are a complete mess[cc], and tired beyond measure. At least a few hours have passed, even if your conception of time is still a bit fuzzy. You don’t see any trace of the golem, and the tower wall is once again unbroken, so you assume the guardian has returned to her original state.", parse);
		Text.NL();
		Text.Add("Still feeling shaky, you gather up your things, making a futile attempt to clean yourself up before continuing your travels.", parse);
		Text.Flush();
		
		golem.flags["Met"] = GolemScenes.State.Lost;
		
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Castle.Grounds);
		});
	});
}

export { GolemBoss, GolemScenes };
