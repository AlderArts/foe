import { EncounterTable } from "../encountertable";
import { Party } from "../party";
import { Encounter } from "../combat";
import { GameState, SetGameState } from "../gamestate";
import { Gender } from "../body/gender";
import { WorldTime, TimeStep, GAME, WORLD } from "../GAME";
import { Gui } from "../gui";
import { Text } from "../text";
import { IngredientItems } from "../items/ingredients";
import { Entity } from "../entity";
import { Bandit } from "../enemy/bandit";
import { WeaponsItems } from "../items/weapons";
import { AccItems } from "../items/accessories";

let RoamingScenes : any = {};

RoamingScenes.FlowerPetal = function() {
	let party : Party = GAME().party;
	var parse : any = {
		
	};
	
	Text.Clear();
	Text.Add("You come across a stand of beautiful flowers, hidden in the grass. The color is vibrant and enticing… perhaps they have some alchemical properties?", parse);
	Text.NL();
	Text.Add("<b>You picked up some colorful flower petals.</b>", parse);
	Text.Flush();
	
	party.inventory.AddItem(IngredientItems.FlowerPetal);
	
	TimeStep({minute: 15});
	Gui.NextPrompt();
};

RoamingScenes.FindSomeCoins = function() {
	let party : Party = GAME().party;
	let world = WORLD();

	var coin = Math.floor(5 + Math.random() * 20);
	
	var parse : any = {
		year    : Math.floor(WorldTime().year - (40 + Math.random() * 20)),
		rhisher : Math.random() < 0.5 ? "his" : "her",
		coin    : coin
	};
	
	var loc = world.CurrentLocation();
	
	parse["ground"] = loc == world.Locations.Desert ? "sand" :
	                  loc == world.Locations.Forest ? "undergrowth" :
	                  "grass";
	
	Text.Clear();
	Text.Add("You see something glistening in the [ground] just ahead and walk over curiously. To your surprise, a coin lies on the ground, apparently forgotten. Picking it up and examining it, you find the year [year] stamped on its face - it’s probably been there for some time, but you’ve seen a few even older coins still in use.", parse);
	Text.NL();
	Text.Add("A little further on, you spot another coin, and then another. You follow the trail, depositing your finds into your slowly expanding purse. Most peculiar. Not that you’re objecting.", parse);
	Text.NL();
	Text.Add("Before too long, you find the source of your enrichment. A pile of bones lies in a small hollow in the ground. All the bones you’d expect in a humanoid body seem to be present, but with the way they’ve been snapped and gnawed, it’s a little difficult to call it a skeleton.", parse);
	Text.NL();
	Text.Add("Well, there’s not much to be done about this now, though you were hoping a path of gold would lead to something more pleasant. Or at least that there would be more left in [rhisher] purse.", parse);
	Text.NL();
	Text.Add("<b>You acquire [coin] coins.</b>", parse);
	Text.Flush();
	
	party.coin += coin;
	
	Gui.NextPrompt();
}

RoamingScenes.KingdomPatrol = function(entering : boolean) {
	let player = GAME().player;
	let party : Party = GAME().party;
	let rigard = GAME().rigard;
	let terry = GAME().terry;
	let kiakai = GAME().kiakai;
	let lei = GAME().lei;
	let world = WORLD();

	var parse : any = {
		playername : player.name
	};
	
	var bonus = party.location == world.loc.KingsRoad.Road;
	
	Text.Clear();
	if(entering)
		Text.Add("As you make your way to the plains,", parse);
	else
		Text.Add("While you’re looking around,", parse);
	Text.Add(" you spot a squad of a dozen mounted men heading your way. Judging by their uniforms, they’re soldiers from one of the kingdom’s patrols.", parse);
	Text.NL();
	
	var capt = new Entity();
	if(Math.random() < 0.3)
		capt.body.DefFemale();
	else
		capt.body.DefMale();
	var gender = capt.Gender();
	
	parse = capt.ParserPronouns(parse, "r");
	parse["rmanwoman"] = capt.mfTrue("man", "woman");
	
	var scenes = new EncounterTable();
	
	scenes.AddEnc(function() {
		rigard.bandits = RoamingScenes.BanditsGen(capt, bonus ? 3 : 0);
		parse["rbanditsdesc"] = rigard.bandits.desc;
		
		Text.Add("The [rmanwoman] at the front of the group waves for [rhisher] companions to wait, and rides up to you on [rhisher] own. [rHeShe] is a young, pure human [rmanwoman] and is wearing new looking armor, though dirt staining the tabard points to heavier recent use.", parse);
		Text.NL();
		Text.Add("<i>“We’ve received reports of a few bandits raiding the farms in this area,”</i> [rheshe] says without preamble, <i>“and were sent here to investigate. I have been told it’s [rbanditsdesc]. Have you seen them around here?”</i> [rHeShe] doesn’t sound too happy with the job, glancing around, as if [rheshe] just wants to get this conversation over with.", parse);
		Text.NL();
		Text.Add("You respond that you haven’t seen them, but you’ll keep an eye out.", parse);
		Text.NL();
		Text.Add("<i>“All right, thank you.”</i> [rHeShe] looks almost relieved by your response. <i>“Well, report to us if you find them. We’ll get right on it.”</i>", parse);
		Text.NL();
		Text.Add("You nod, and [rheshe] returns to [rhisher] men, presumably planning to resume their search. The sergeant doesn’t seem all that eager to do the task, but at least [rheshe]’s working on it.", parse);
		Text.NL();
		Text.Add("Perhaps you really should just locate the bandits for them.", parse);
		Text.Flush();
		Gui.NextPrompt();
	}, 2.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("They shout for you to halt, and you decide to comply and wait while they ride up to you. Up close, you see that their armor is covered in scratches and dents, though it seems well maintained for its age. Their leader, a burly [rmanwoman] with gray hairs peeking from underneath [rhisher] helmet dismounts and regards you with a bored expression.", parse);
		Text.NL();
		Text.Add("[rHeShe] introduces [rhimher]self as a sergeant of the armed forces of Rigard before getting down to business. <i>“What are you doing here?”</i> [rheshe] asks. <i>“You’re not farmers, you’re not traders, and judging by your weapons, you’re not laborers.”</i>", parse);
		Text.Flush();
		
		//[Adventurers][Bandits!]
		var options = new Array();
		options.push({ nameStr : "Adventurers",
			func : function() {
				Text.Clear();
				Text.Add("You tell the sergeant that you are adventurers, and you’re here as part of your quest. Okay, it might not be an <i>essential</i> part of your quest, but there’s no reason to tell [rhimher] that.", parse);
				Text.NL();
				Text.Add("The sergeant’s lips curl into a frown. <i>“Really? I know your kind. Think you’re on some Goddess-sent mission to restore ancient powers and save the world, I bet.”</i>", parse);
				Text.NL();
				Text.Add("Well… yes, that’s about it, actually.", parse);
				Text.NL();
				Text.Add("<i>“I knew it! I’ve seen plenty like you. Some go into people’s houses and search through their vases and barrels, claiming anything they find. Others just crouch down and snatch up anything lying around whenever their hosts’ backs are turned.”</i>", parse);
				Text.NL();
				Text.Add("<i>“You’re always thinking the whole world is made just for you!”</i> [rheshe] jabs a finger at your chest, glaring. <i>“I’m sorely tempted to have a few men follow you just to make sure you don’t get up to any mischief, but I have none to spare, more’s the pity.”</i>", parse);
				Text.NL();
				
				var humanity = player.Humanity();
				
				parse["human"] = humanity > 0.8 ? " human" : "...";
				Text.Add("[rHeShe] sighs, lowering [rhisher] hand. <i>“So, I guess you can go. <b>Try</b> to be a decent[human] being, though? Please?”</i>", parse);
				Text.NL();
				Text.Add("You nod with some relief, and the sergeant turns to mount and leave. <i>“Oh, and no, I will not have sex with you,”</i> [rheshe] throws back in your direction, before riding off.", parse);
				Text.NL();
				if(party.InParty(terry)) {
					parse["himher"] = terry.himher();
					Text.Add("<i>“I never realized adventurers were so much like thieves!”</i> Terry remarks, grinning. <i>“Sounds like I can put my skills to good use.”</i>", parse);
					Text.NL();
					Text.Add("You tell [himher] that you’ll consider it, at least when you find suitable vases to loot.", parse);
				}
				else if(terry.Recruited()) {
					parse["himher"] = terry.himher();
					Text.Add("You wonder if Terry would appreciate these apparent similarities of [hisher] old profession and the new one.", parse);
				}
				
				var inc = player.charisma.IncreaseStat(30, 1);
				
				if(inc > 0) {
					Text.NL();
					Text.Add("<b>You feel like you’ve learned a little about how not to offend people from the sergeant’s rant, making you a bit more charismatic!</b>", parse);
				}
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : Text.Parse("Tell [rhimher] that you’re adventurers.", parse)
		});
		options.push({ nameStr : "Bandits!",
			func : function() {
				Text.Clear();
				Text.Add("Trying to keep a straight face, you proclaim that you are bandits, here to murder, rape, and kill!", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					parse["name"] = kiakai.name;
					parse["himher"] = kiakai.himher();
					Text.Add("<i>“B-but, [playername],”</i> [name] protests, before you wave to shush [himher].", parse);
					Text.NL();
				}, 1.0, function() { return party.InParty(kiakai); });
				scenes.AddEnc(function() {
					parse["hisher"] = terry.himher();
					Text.Add("Terry’s staring wide-eyed from beside you. Looks like an admission of guilt is not to [hisher] taste.", parse);
					Text.NL();
				}, 1.0, function() { return party.InParty(terry); });
				
				scenes.Get();
				
				Text.Add("The sergeant lets out a breath of frustration, looking, if anything, more bored than before. <i>“I’ve run into plenty of bandits before, and I gotta tell you I’ve never once had them tell me that.”</i> [rHeShe] scratches [rhisher] chin. <i>“At least without having the numbers on me. Who I do get that line from is young punks who think they can’t die over a shitty joke.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I’m fining you fifteen coins for wasting my time. I call it the ‘not killing you for being an idiot’ tax.”</i>", parse);
				Text.NL();
				if(party.coin >= 15) {
					Text.Add("You grumble a little at [rhimher] being unable to take a joke, but faced with the [rmanwoman]’s menacing glare, grudgingly agree to pay up. It's not worth getting in trouble with the kingdom to avoid a petty fine. The coins neatly disappear from your hand into [rhisher] purse.", parse);
					Text.NL();
					Text.Add("<i>“Pleasure doing business with you.”</i> The sergeant says, spitting to the side. <i>“Do respect the bloody soldiers, though. Or don’t, I suppose, I could always use more ale… or a new punching bag.”</i>", parse);
					party.coin -= 15;
				}
				else {
					Text.Add("Feeling a little embarrassed, you tell [rhimher] that you don’t actually have 15 coins.", parse);
					Text.NL();
					Text.Add("<i>“Hold still,”</i> [rheshe] commands. The sergeant pats you down roughly, spending perhaps a moment too long checking your butt. <i>“Hrm. Fine, I’m not in this to rob the broke. You can go, I guess.”</i>", parse);
					Text.NL();
					Text.Add("As you turn to leave, [rheshe] gives you a solid wack upside the head. <i>“Respect the bloody soldiers, though. We’re not here to mess around.”</i>", parse);
				}
				Text.NL();
				Text.Add("Well, that didn’t exactly go well, but perhaps there were worse ways that proclaiming yourself a bandit could have ended. Perhaps expecting soldiers to laugh along was a little over-optimistic.", parse);
				if(party.InParty(lei)) {
					Text.NL();
					Text.Add("Lei looks at you with a smug grin on his face. <i>“That was an excellent example of how speaking untruth is a bad idea. Though I must admit that most people who choose to lie at least select lies that are favorable to themselves.”</i>", parse);
					Text.NL();
					Text.Add("You glare at him in annoyance. Looks like someone even got to feel superior.", parse);
				}
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : Text.Parse("Tell [rhimher] that you’re bandits. It'd be pretty funny to see [rhisher] reaction, right?", parse)
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return party.Num() > 1; });
	
	scenes.Get();
}

RoamingScenes.BanditsGen = function(capt : Entity, levelbonus : number) {
	var CreateBandit = function() {
		var rand = Math.random();
		var gender = rand < 0.5 ? Gender.male :
		             rand < 0.9 ? Gender.female : Gender.herm;
		return new Bandit(gender, levelbonus);
	};
	
	var colors = ["red", "blue", "green", "beige", "purple", "yellow", "orange", "puce"];
	var color = colors[Math.floor(Math.random() * colors.length)];
	var items = ["bandanas", "overcoats", "bowler hats", "pantaloons", "gloves"];
	var item = items[Math.floor(Math.random() * items.length)];
	
	var rclothing = color + " " + item;
	
	var num = 2 + Math.ceil(Math.random() * 4);
	
	var enemy = new Party();
	var males   = 0;
	var females = 0;
	for(var i = 0; i < num; ++i) {
		let bandit = CreateBandit();
		if(bandit.Gender() == Gender.male)
			males++;
		else
			females++;
		enemy.AddMember(bandit);
	}
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		return "call each other by ridiculous nicknames";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		return "are all men";
	}, 1.0, function() { return females == 0; });
	scenes.AddEnc(function() {
		return "are all women";
	}, 1.0, function() { return males == 0; });
	scenes.AddEnc(function() {
		return "are well armed";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		return "are fond of stealing livestock";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		return "have only recently appeared around here";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		return "have a peculiar smell about them";
	}, 1.0, function() { return true; });
	
	var desc = scenes.Get();
	
	var enc : any = new Encounter(enemy);
	enc.canRun      = false;
	enc.onEncounter = RoamingScenes.BanditsOnEncounter;
	enc.onLoss      = RoamingScenes.BanditsLoss;
	enc.onVictory   = RoamingScenes.BanditsWin;
	
	enc.leader = enemy.Get(0);
	enc.desc = Text.Parse("a small group, certainly not more than half a dozen. Apparently, they all wear [rclothing] and " + desc, {rclothing : rclothing});
	enc.rclothing = rclothing;
	enc.capt = capt;
	
	enc.OnIncapacitate = function(entity : Entity) {
		Encounter.prototype.OnIncapacitate.call(this, entity);
		var enc = this;
		var enemy = enc.enemy;
		
		var found = false;
		for(var i = 0; i < enemy.Num(); ++i) {
			if(enemy.Get(i) == entity) {
				found = true;
				break;
			}
		}
		
		if(found) {
			for(var i = 0; i < enemy.reserve.length; i++) {
				var bandit = enemy.reserve[i];
				if(!bandit.Incapacitated()) {
					enemy.SwitchOut(entity);
					enemy.SwitchIn(bandit);

					var ent : any = {
						entity     : bandit,
						isEnemy    : true,
						initiative : 0,
						aggro      : [],
					};

					enc.combatOrder.push(ent);
					ent.entity.GetSingleTarget(enc, ent);

					enc.Callstack.push(function() {
						var parse : any = {};
						Text.Clear();
						parse["hisher"] = entity.hisher();
						Text.Add("Another bandit pushes through the interior door, replacing [hisher] fallen comrade.", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							enc.CombatTick();
						});
					});
					break;
				}
			}
		}
	}
	
	return enc;
}

RoamingScenes.Bandits = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	let rigard = GAME().rigard;
	let bandits = rigard.bandits;

	var parse : any = {
		rclothing : bandits.rclothing
	};
	
	rigard.bandits = null;
	
	Text.Clear();
	Text.Add("As you make your way, the fields around you grow wilder, more unkempt. After walking for a few minutes more, it’s hard to imagine that anyone works the land here at all. Wild grass reaches almost to your waist, and weeds sprout in prickly bushes.", parse);
	Text.NL();
	Text.Add("You’re not sure why, but it seems that cultivation has been abandoned in this area. A little further, at the top of a small incline, you spot a derelict farmhouse, confirming your guess. Its roof is tilted at an odd angle, and where glass windows must have once been, empty holes gape onto its interior.", parse);
	Text.NL();
	Text.Add("To your surprise, ", parse);
	if(WorldTime().hour >= 8 && WorldTime().hour < 20)
		Text.Add("you notice an orange flicker on the open window shutter.", parse);
	else
		Text.Add("a warm orange glow pours out the windows.", parse);
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"] = party.Num() > 1 ? Text.Parse(", [comp] in tow", parse) : "";
	Text.Add(" Someone’s burning a fire inside. Curious, you approach to investigate[c]. As you get closer, you hear a sheep braying somewhere on the other side of the house. Deciding to take no chances with the sort of desperate men who would live in such a desperate place, you crouch down by the window, and after listening for a moment, peek inside.", parse);
	Text.NL();
	parse["num"] = bandits.enemy.NumTotal() > 3 ? "four" : "three";
	var males   = 0;
	var females = 0;
	var num = Math.min(bandits.enemy.NumTotal(), 4);
	for(var i = 0; i < num; ++i) {
		var bandit = bandits.enemy.Get(i);
		if(bandit.Gender() == Gender.male)
			males++;
		else
			females++;
	}
	num = bandits.enemy.NumTotal();
	parse["genders"] = males == 0 ? "women" :
	                   females == 0 ? "men" :
	                   "men and women";
	Text.Add("You see a dusty room with furniture that’s on the edge of falling apart. Around a table at one end are [num] [genders], conversing conspiratorially. They seem to be discussing something about ", parse);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("the lay of the land around the local farms, and which farmers have been doing the best.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("which marinade is best for mutton, and whether they can get their hands on some lemons around here.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("who gets to sleep with whom tonight. One of them argues vociferously for one big cuddle pile.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("morality. You mostly zone out through the boring conversation, but you do catch one mentioning getting what’s theirs.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("whether they can keep staying there or need to move.", parse);
	}, 1.0, function() { return true; });
	scenes.Get();
	
	Text.NL();
	Text.Add("Even in this abandoned place, they keep their voices low, so you do not hear many details of what is said.", parse);
	if(num > 4) {
		parse["num2"] = num > 5 ? "two people" : "person";
		Text.Add(" You also notice the sounds of another [num2] moving around in a room in the back.", parse);
	}
	Text.NL();
	Text.Add("Suddenly, your eyes are drawn to the [rclothing] they’re all wearing. Wasn’t that the sign the sergeant told you to watch for? They must be the bandits that have been harassing the local farms!", parse);
	Text.NL();
	Text.Add("You duck back out of sight. Okay, so what should you do about them?", parse);
	Text.Flush();
	
	//[Report][Attack][Extort][Leave]
	var options = new Array();
	options.push({ nameStr : "Report",
		func : function() {
			parse = bandits.capt.ParserPronouns(parse, "r");
			
			Text.Clear();
			Text.Add("You sneak away from the farm, darting glances over your shoulder to make sure you haven’t been noticed. The tall grass lends you some cover, but you still feel like you’re about to get an arrow in the back.", parse);
			Text.NL();
			Text.Add("Once you are away, it does not take you long to find the patrol. You knock on the door of a farm near the spot you met them, hoping the farmer will know where they went, but instead, the sergeant opens the door.", parse);
			Text.NL();
			Text.Add("<i>“Oh, we’ve met, haven’t we?”</i> [rheshe] asks. <i>“We’ve ‘ad to take a break to rest up here, you see. While protecting these farmers, of course.”</i> [rHeShe] glances to the side, [rhisher] cheeks flushing pink. <i>“But what brings you here, in any case?”</i>", parse);
			Text.NL();
			Text.Add("Looking more carefully, you notice that it’s not just [rhisher] cheeks that are flushed. The sergeant’s nose is quite red as well, and a strong smell of liquor assaults your nose. Well, they might not be in the best condition to take on the bandits right now, but they do have a lot more men, so they probably won’t lose, at least.", parse);
			Text.NL();
			Text.Add("Not seeing much of an alternative at this point, you tell the sergeant that you found the bandits, and explain how to locate the abandoned farm. Just in case, you tell [rhisher] second-in-command as well, who seems a little more sober at least.", parse);
			Text.NL();
			Text.Add("<i>“Thank ye, really,”</i> the sergeant tells you. <i>“That’s quite a help. We’ll get there and clear them out, have no fear! Right after we rest up a li’l more, anyway.”</i> [rHeShe] scratches [rhisher] chin, eyes going out of focus before snapping back. <i>“Oh! Right, here, have a reward for your help.”</i>", parse);
			Text.NL();
			Text.Add("You accept the handful of coins, and transfer them to your pouch, thanking the sergeant. Your task here done, you head out to resume your travels.", parse);
			Text.NL();
			Text.Add("<b>You receive 10 coins as a reward for the information.</b>", parse);
			Text.Flush();
			
			party.coin += 10;
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Your job here is done. You can report their location to the kingdom patrol and they’ll take care of the matter."
	});
	parse["num"] = Text.NumToText(num);
	options.push({ nameStr : "Attack",
		func : function() {
			Text.Clear();
			if(party.Num() == 2)
				Text.Add("[name] shadowing your steps, you", {name: party.Get(1).name});
			else if(party.Num() > 2)
				Text.Add("Your companions a step behind you, you", parse);
			else
				Text.Add("You", parse);
			Text.Add(" bust down the door, sending it screeching open on rusted hinges. As [num] startled faces look up at you from around the table, you step inside, readying yourself for combat.", parse);
			Text.NL();
			Text.Add("It takes the bandits a moment to react, and by then you’re upon them!", parse);
			bandits.Start();
		}, enabled : true,
		tooltip : Text.Parse("There’s no need to get help - you’ll take out the [num] bandits here and now.", parse)
	});
	options.push({ nameStr : "Extort",
		func : function() {
			Text.Clear();
			parse["c"] = party.Num() == 2 ? Text.Parse(", while [name] steps up into the doorway behind you", {name: party.Get(1).name}) :
			             party.Num() > 2 ? ", while your companions frame you in the doorway" : "";
			
			Text.Add("Squaring your shoulders and doing your best to look menacing, you rap once on the farm door, before pushing it open with a loud screech of grating hinges. Taking a step inside, you are greeted by [num] scowling faces[c].", parse);
			Text.NL();
			
			var success = (player.Cha() + Math.random() * 20) >= 40;
			
			if(success) {
				Text.Add("In the foreword of your speech, you explain that you do understand that everyone must make a living in this world, and that you fully understand their decisions. From there, you proceed to remark that, however, their chosen path entails some additional costs of doing business, to wit, payment for the maintenance of secrecy.", parse);
				Text.NL();
				Text.Add("You don’t know whether it’s because of your seemingly fearless appearance or the crime boss mannerisms you’ve done your best to imitate, but the bandits quickly surrender before your verbiage, clearly outgunned. They hand over a decent payment and see you out the door, bowing and scraping the whole way. Not only does crime apparently pay, but you can’t help but think that it’s quite fun too.", parse);
				Text.NL();
				var inc = player.charisma.IncreaseStat(40, 1);
				parse["inc"] = inc ? ", and the experience taught you a little about the art of persuasion" : "";
				Text.Add("<b>You successfully convinced the bandits to hand over 20 coin in hush money[inc].</b>", parse);
				Text.Flush();
				
				
				party.coin += 20;
				
				Gui.NextPrompt();
			}
			else {
				Text.Add("You do your best to sound intimidating, but your speech comes out sounding like you’re a child trying to threaten the bully with telling the teacher on him. As you might have expected, the bandits look more angry than anything, and when you try to back out and change course, one of them steps between you and the door.", parse);
				Text.NL();
				Text.Add("Looks like you’ll have to fight your way out!", parse);
				bandits.Start();
			}
		}, enabled : true,
		tooltip : "You’re quite willing to leave them alone, if only they’ll pay you a little bit of compensation. Now to convince them..."
	});
	options.push({ nameStr : "Leave",
		func : Gui.PrintDefaultOptions, enabled : true,
		tooltip : "This isn’t worth the bother - just leave them alone."
	});
	Gui.SetButtonsFromList(options, false, null);
}

RoamingScenes.BanditsOnEncounter = function() {
	var enc = this;
	var parse : any = {};
	
	var num = this.enemy.NumTotal();
	if(num > 4) {
		Text.NL();
		var bandit = this.enemy.Get(4);
		parse["s"]      = num > 5 ? "s" : "";
		parse["crowd"]  = num > 5 ? "crowd around" : "tries to push through";
		parse["heshe"]  = num > 5 ? "they" : bandit.heshe();
		parse["hisher"] = num > 5 ? "their" : bandit.hisher();
		Text.Add("The bandit[s] in the back room [crowd] the door, but can’t quite find the space to join battle in this crowded chamber. You suspect [heshe]’ll replace [hisher] comrades when you defeat them.", parse);
		Text.Flush();
		
		// Start combat
		Gui.NextPrompt(function() {
			enc.PrepCombat();
		});
	}
	else {
		Text.Flush();
		Gui.NextPrompt(function() {
			enc.PrepCombat();
		});
	}
}

RoamingScenes.BanditsLoss = function() {
	let party : Party = GAME().party;
	
	SetGameState(GameState.Event, Gui);
	
	var enc = this;
	
	var bandits = enc.enemy;
	var num = bandits.NumTotal();
	
	var fallen = 0;
	var first = null;
	for(var i = 0; i < num; ++i) {
		var bandit = bandits.Get(i);
		if(bandit.Incapacitated()) fallen++;
		else first = first || bandit;
	}
	var remaining = num - fallen;
	
	var parse : any = {
		comp : party.Num() > 1 ? "your party" : "you"
	};
	
	parse = first.ParserPronouns(parse);
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("With [comp] finally down, the", parse);
		if(remaining > 1) {
			parse["remaining"] = fallen > 0 ? " remaining" : "";
			Text.Add("[remaining] bandits stand panting around the room, weapons sagging in slack hands.", parse);
		}
		else
			Text.Add("remaining bandit leans on the table for support, letting [hisher] weapon slip out of [hisher] slack grip.", parse);
		if(fallen >= 2)
			Text.Add(" Barely conscious, you manage a slight smile. At least you gave them a hell of a fight.", parse);
		parse["num"] = remaining > 1 ? "One of the bandits" : "The bandit";
		Text.Add(" [num] approaches after finally catching [hisher] breath and gives you a solid kick in the ribs, making air rush out of you in a pained gasp.", parse);
		Text.NL();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>“Y’thought you could just waltz in here, beat us up, and take our stuff, did ye?”</i> [HeShe] punctuates [hisher] demand with another kick. <i>“Well, that ain’t how it works. We’re the big dogs ‘round here. We ain’t taking shit from the kingdom, we ain’t taking shit from you, we ain’t taking shit from no one!”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Who sent you? Huh?”</i> Before you can attempt to wheeze out an answer, another kick drives the air out from your lungs. <i>“Was it Rewyn? Or,”</i> [heshe] slows thoughtfully, <i>“did those slimy bastards not understand that ‘no’ means no. We ain’t bowing to any man. <b>They</b> are gonna bow to <b>us</b>.”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.Get();
		
		Text.NL();
		Text.Add("The rest of the speech runs together in your mind, with kicks blessedly interrupted by long stretches of useless ranting. ", parse);
		Text.NL();
		Text.Add("After a while, you must lose consciousness because the next time you can think clearly, your eyes are opening on a field of overgrown grass. Your ribs ache and you are bruised all over, but fortunately your insides feel intact. After a minute or two, you even gather the willpower to get up, your body screaming in protest.", parse);
		Text.NL();
		parse["comp"] = party.Num() == 2 ? party.Get(1).name + " is" : "Your companions are";
		parse["c"] = party.Num() > 1 ? Text.Parse(" [comp] lying in the grass close by, apparently also stirring slowly to wakefulness.", parse) : "";
		Text.Add("The farm is in sight, its door ajar, the building now looking well and truly abandoned.[c] It seems the bandits decided to spare you, and look for a new hideout.", parse);
		Text.NL();
		Text.Add("Things could have definitely turned out worse. They could have also turned out a whole lot better.", parse);
		if(party.coin >= 0) {
			Text.NL();
			var coin = Math.min(party.coin, 25);
			parse["coin"] = coin;
			parse["s"] = coin > 1 ? "s" : "";
			
			party.coin -= coin;
			
			Text.Add("<b>You lose [coin] coin[s]! Good thing you had the foresight to hide most of your spare possessions nearby before attacking, though you aren’t quite sure why you didn’t just hide all of them.</b>", parse);
		}
		Text.Flush();
		
		Gui.NextPrompt();
	});
	
	Encounter.prototype.onLoss.call(enc);
}

RoamingScenes.BanditsWin = function() {
	let party : Party = GAME().party;
	
	SetGameState(GameState.Event, Gui);
	
	var enc = this;
	
	var bandits = enc.enemy;
	var num = bandits.NumTotal();
	
	var parse : any = {
		
	};
	
	parse = bandits.GetRandom(true, true).ParserPronouns(parse);
	
	parse["comp"]  = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["comp2"] = party.Num() == 2 ? "The two of you" : "You all";
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("The last bandit falls, as you stand winded but triumphant over your defeated adversaries. ", parse);
		if(party.Num() > 1) {
			Text.Add("You exchange euphoric grins with [comp]. [comp2] did well.", parse);
		}
		else
			Text.Add("A euphoric grin twists your lips.", parse);
		Text.Flush();
		
		var fucked = false;
		var looted = false;
		
		var prompt = function() {
			//[Fuck][Loot][Leave]
			var options = new Array();
			// TODO
			options.push({ nameStr : "Fuck",
				func : function() {
					Text.Clear();
					Text.Add("", parse);
					Text.NL();
					Text.Flush();
					fucked = true;
					prompt();
				}, enabled : false && fucked == false,
				tooltip : ""
			});
			options.push({ nameStr : "Loot",
				func : function() {
					Text.Clear();
					Text.Add("And to the victor go the spoils. You meticulously search the bandits, patting them down and making a neat pile of coins and chipped weapons on the table. ", parse);
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.Add("One of them even has a pretty gold earring that you carefully unhook from [hisher] ear.", parse);
						party.Inv().AddItem(AccItems.GoldEarring);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("You pull eight throwing knives off one of them - you counted. Some say you can never have too many knives, but surely this many must’ve weighed [himher] down.", parse);
						party.Inv().AddItem(WeaponsItems.Dagger);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("Though you wouldn’t touch most of the weapons for fear of gangrene, one of the swords actually looks passable. Maybe you can put it to use.", parse);
						party.Inv().AddItem(WeaponsItems.ShortSword);
					}, 1.0, function() { return true; });
					
					scenes.Get();
					
					Text.NL();
					Text.Add("Done with the body search, you tie your semi-conscious adversaries up. You still need to check for a stash, and it wouldn’t do to have them getting in the way.", parse);
					Text.NL();
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						Text.Add("You shake your captives, demanding information, but they groggily insist they haven’t hidden anything. As if you’d believe that!", parse);
						Text.NL();
						Text.Add("You carefully explore the house, but there’s nothing. You tap your knuckles along the walls, listening for hollows. Nothing. You walk around the farm outside, looking for freshly dug earth. Still nothing! Well, actually, a few sheep and hens, but is that really all they managed to steal? What a disappointment.", parse);
						Text.NL();
						if(WorldTime().hour < 6 || WorldTime().hour >= 20)
							Text.Add("You wonder if you’ve missed something in the dark, but no, the light should have been enough for your investigation. ", parse);
						Text.Add("Frustrated, you curse out the bandits for incompetence and content yourself with gathering up your little pile of loot from the table. That much will have to do.", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("You shake your captives, demanding information, but they insist they haven’t hidden anything. A quaver of uncertainty in the responses, and eyes impulsively darting toward a window tip you off to the deceit, however.", parse);
						Text.NL();
						if(WorldTime().hour < 6 || WorldTime().hour >= 20)
							Text.Add("Grabbing the bandits’ oil lantern and checking", parse);
						else
							Text.Add("Checking", parse);
						Text.Add(" outside, you find a barely noticeable patch of low grass that looks to have been uprooted and then replanted. You grab a shovel and do not have to dig long before you strike something hard and wooden with a thud.", parse);
						Text.NL();
						Text.Add("Five minutes later, you’ve dug around the object, and pull a small box out of the shallow hole. It’s heavy for its size, and you hear the pleasant jingle of coins inside. You head back inside and pour the contents of the box out on the table alongside your other loot, nicely increasing the pile.", parse);
						Text.NL();
						Text.Add("You politely thank the bandits, and pack away your earnings, as they glare at you in frustration. Not a bad haul, if you do say so yourself.", parse);
						
						var coin = 30 + Math.floor(Math.random() * 50);
						
						Text.NL();
						Text.Add("<b>You pick up an additional [coin] coins!</b>", {coin: coin});
						
						party.coin += coin;
					}, 1.0, function() { return true; });
					
					scenes.Get();
					
					looted = true;
					Text.Flush();
					prompt();
				}, enabled : looted == false,
				tooltip : "Loot everything!"
			});
			options.push({ nameStr : "Leave",
				func : function() {
					Text.Clear();
					if(fucked || looted) {
						Text.Add("Your main tasks complete, you check on the stolen livestock around the farm, making sure all the animals ", parse);
						if(WorldTime().hour >= 8 && WorldTime().hour < 20)
							Text.Add("are free to roam and graze.", parse);
						else
							Text.Add("will be free to roam and graze in the morning.", parse);
						Text.NL();
						Text.Add("As you head out, you decide you’ll tell a kingdom patrol where to find the animals and the bandits when you see one. In the meanwhile, the animals should be fine for a day or two. The bandits should as well - after all, you double checked their bonds.", parse);
					}
					else {
						Text.Add("You meticulously tie up the bandits, securing them to the furniture, and making sure the ropes don’t allow them any freedom of movement. They can sit there until the proper authorities come to pick them up.", parse);
						Text.NL();
						Text.Add("As you head out, you decide you’ll tell a kingdom patrol where to find them when you see one. It shouldn’t be too long until you see one, and in the worst case scenario, well, they can stew there for a day or two.", parse);
					}
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "You’re mostly done here - it’s time to head out."
			});
			Gui.SetButtonsFromList(options, false, null);
		};
		prompt();
	});
	
	Encounter.prototype.onVictory.call(enc);
}

export { RoamingScenes };
