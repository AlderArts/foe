/*
 * 
 * Define the player object (based on entity)
 * 
 */

import { Entity, DrunkLevel } from '../entity';
import { GetDEBUG } from '../../app';
import { Gender } from '../body/gender';
import { Jobs, JobDesc, JobEnum } from '../job';
import { EncounterTable } from '../event';
import { Gui } from '../gui';
import { Text } from '../text';
import { PregnancyLevel } from '../pregnancy';
import { Perks } from '../perks';
import { MasturbationScenes } from './masturbation';
import { MeditationScenes } from './meditation';
import { Images } from '../assets';
import { TimeStep } from '../GAME';

function Player(storage) {
	Entity.call(this);
	this.ID = "player";
	this.name = "???";
	
	this.abilities["Special"].name = "Summon";
	
	this.currentJob = Jobs.Fighter;
	this.jobs["Fighter"]   = new JobDesc(Jobs.Fighter);
	this.jobs["Scholar"]   = new JobDesc(Jobs.Scholar);
	this.jobs["Courtesan"] = new JobDesc(Jobs.Courtesan);
	
	this.jobs["Bruiser"]   = new JobDesc(Jobs.Bruiser);
	this.jobs["Rogue"]     = new JobDesc(Jobs.Rogue);
	this.jobs["Ranger"]    = new JobDesc(Jobs.Ranger);
	
	this.jobs["Mage"]      = new JobDesc(Jobs.Mage);
	this.jobs["Mystic"]    = new JobDesc(Jobs.Mystic);
	this.jobs["Healer"]    = new JobDesc(Jobs.Healer);
	
	this.jobs["Elementalist"] = new JobDesc(Jobs.Elementalist);
	this.jobs["Warlock"]      = new JobDesc(Jobs.Warlock);
	this.jobs["Hypnotist"]    = new JobDesc(Jobs.Hypnotist);
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 30;
	this.maxLust.base      = 30;
	this.strength.base     = 12;
	this.stamina.base      = 12;
	this.dexterity.base    = 12;
	this.intelligence.base = 12;
	this.spirit.base       = 12;
	this.libido.base       = 12;
	
	this.charisma.base     = 12;
	
	this.level        = 1;
	this.sexlevel     = 1;
	
	this.flags["startJob"] = JobEnum.Fighter;
	
	this.summons = [];
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
	
	if(storage) {
		this.FromStorage(storage);
		this.InitCharacter(this.Gender());
		
		if(this.flags["startJob"] == JobEnum.Scholar)
			this.jobs["Scholar"].mult = 0.5;
		else if(this.flags["startJob"] == JobEnum.Courtesan)
			this.jobs["Courtesan"].mult = 0.5;
		else
			this.jobs["Fighter"].mult = 0.5;
	}
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.ItemUsable = function(item) {
	return true;
}

Player.prototype.InitCharacter = function(gender) {
	if(gender == Gender.male)
		this.avatar.combat = Images.pc_male;
	else
		this.avatar.combat = Images.pc_fem;
}

// Grammar
Player.prototype.nameDesc = function() {
	return "you";
}
Player.prototype.NameDesc = function() {
	return "You";
}
Player.prototype.possessive = function() {
	return "your";
}
Player.prototype.Possessive = function() {
	return "Your";
}
Player.prototype.heshe = function() {
	return "you";
}
Player.prototype.HeShe = function() {
	return "You";
}
Player.prototype.himher = function() {
	return "you";
}
Player.prototype.HimHer = function() {
	return "You";
}
Player.prototype.hisher = function() {
	return "your";
}
Player.prototype.HisHer = function() {
	return "Your";
}
Player.prototype.hishers = function() {
	return "yours";
}
Player.prototype.has = function() {
	return "have";
}
Player.prototype.is = function() {
	return "are";
}
Player.prototype.plural = function() {
	return true;
}

Player.prototype.Magic = function() {
	return Scenes.Global.MagicStage1();
}

Player.prototype.HandleDrunknessOverTime = function(hours, suppressText) {
	var oldLevel = this.drunkLevel;
	this.drunkLevel -= this.DrunkRecoveryRate() * hours;
	if(this.drunkLevel < 0) this.drunkLevel = 0;
	
	if(!suppressText) {
		if(this.drunkLevel < DrunkLevel.Sober && oldLevel >= DrunkLevel.Sober) {
			Text.NL();
			Text.Add("Some time has passed, and your inebriation has completely cleared up. Your mind is clear, your reflexes are quick, and you have regained your ability to distinguish the ugly from the beautiful.");
			Text.Flush();
		}
		else if(this.drunkLevel < DrunkLevel.Tipsy && oldLevel >= DrunkLevel.Tipsy) {
			Text.NL();
			Text.Add("Some time has passed, and you feel almost sober. You’re only a bit slow, and your inhibitions are only a little looser than usual.");
			Text.Flush();
		}
		else if(this.drunkLevel < DrunkLevel.Sloshed && oldLevel >= DrunkLevel.Sloshed) {
			Text.NL();
			Text.Add("Some time has passed, and you have regained a bit of your senses from your drunken near-stupor. You are still stumbling a little, and would have trouble not hitting yourself with a sword, but it’s getting better. Everyone still looks beautiful, though.");
			Text.Flush();
		}
	}
}

// Return true if passed out
Player.prototype.Drink = function(drink, suppressText) {
	var oldLevel = this.drunkLevel;
	this.drunkLevel += drink / Math.log(this.Sta());
	
	if(!suppressText) {
		//Compare this.drunkLevel and oldLevel
		if(this.drunkLevel > DrunkLevel.Drunk && oldLevel <= DrunkLevel.Drunk) {
			Text.NL();
			Text.Add("That last drink was a bit too much for you. You feel your vision narrowing, darkness creeping in from the corners, and desperately try to grab on to something as your consciousness fades.");
			Text.Flush();
			
			var remaining = this.drunkLevel - 0.8;
			var minutes   = Math.floor(remaining / this.DrunkRecoveryRate() * 60);
			
			TimeStep({minute: minutes});
			
			Gui.NextPrompt(party.location.DrunkHandler);
			
			return true;
		}
		else if(this.drunkLevel > DrunkLevel.Sloshed && oldLevel <= DrunkLevel.Sloshed) {
			Text.NL();
			Text.Add("Well, that last drink might be pushing it. You barely notice anything outside the center of your vision, and desperately grasp on to something solid to avoid falling down. Everyone around you is so gorgeous, though!");
		}
		else if(this.drunkLevel > DrunkLevel.Tipsy && oldLevel <= DrunkLevel.Tipsy) {
			Text.NL();
			Text.Add("With that drink, you’re beginning to really feel the spirits coursing through your blood. It’s getting a little tricky to keep your balance, and your vision is a little blurry, but the blurriness does make everyone look quite nice.");
		}
		else if(this.drunkLevel > DrunkLevel.Sober && oldLevel <= DrunkLevel.Sober) {
			Text.NL();
			Text.Add("After that drink, you feel a little slower, a little duller. It’s not a degree that would make a real difference, but it’s there. You do feel a little braver as well.");
		}
		Text.Flush();
	}
	return (this.drunkLevel > DrunkLevel.Drunk);
}

Player.prototype.LactationProgress = function(oldMilk, newMilk, lactationRate) {
	if(oldMilk < 0.5 && newMilk >= 0.5) {
		Gui.Callstack.unshift(function() {
			var parse = {
				breasts : player.FirstBreastRow().Short()
			};
			Text.Clear();
			Text.Add("A new weight in your [breasts] draws your attention, and you gently test them with a finger. While they haven’t actually <i>grown</i> that much, they’re definitely fuller, perkier and more tender than before; if you close your eyes and lay a palm across the curve of one, you can feel the faint pulsing of your baby feeders hard at production. At least you’ve still got some way to go until they’re full up.", parse);
			Text.Flush();
			Gui.NextPrompt();
		});
	}
	if(oldMilk < 0.9 && newMilk >= 0.9) {
		Gui.Callstack.unshift(function() {
			var parse = {
				breasts : function() { return player.FirstBreastRow().Short(); },
				nips: player.FirstBreastRow().NipsShort()
			};
			
			Text.Clear();
			Text.Add("The weight and pressure in your [breasts] is considerable now, your [nips] stiff from the constant tingling just behind them. Their rich, delicious contents wobbling and sloshing with each step you take, your [breasts] remind you that they’re approaching their limit on how much they can hold - you ought to drain yourself somehow if you don’t want to start leaking all over the place.", parse);
			Text.Flush();
			Gui.NextPrompt();
		});
	}
	// Trigger start of lactation
	if(oldMilk < 1 && newMilk >= 1 && lactationRate != 0) {
		Gui.Callstack.unshift(function() {
			var parse = {
				breasts : function() { return player.FirstBreastRow().Short(); },
				nips: player.FirstBreastRow().NipsShort()
			};
			
			Text.Clear();
			if(lactationRate < 1) {
				Text.Add("At last, the pressure is too much for your nipples to bear. Moaning softly, you grab your [breasts] as a thin thread of warmth works its way out of your [nips] and bursts out into open air. Since you haven’t bothered to drain your breasts of their milky load, your body’s decided to do it for you, and it doesn’t much care for silly things like propriety.", parse);
				Text.NL();
				Text.Add("Or did you let it build up to this point on purpose?", parse);
				Text.NL();
				Text.Add("Either way, you’ve begun to visibly lactate, and are likely to stay that way until your breasts have drained themselves to a more acceptable level - or you get more storage space.", parse);
			}
			else if(lactationRate < 3) {
				Text.Add("Seems like your [breasts] are quite the productive things. With your latest increase in milky goodness, you’re definitely starting to feel like quite the cow-morph; two steady streams of white trickle gently from your [nips] and running down the curve of your breasts before finally seeping into your clothes.", parse);
				Text.NL();
				Text.Add("You have to admit, it’s quite arousing - especially now that you can feel the pulsing pumping with which fresh cream pours from you. Of course, it comes at the cost of propriety…", parse);
				Text.NL();
				Text.Add("In any case, you’re getting quite overfull now - maybe some release would be a nice relief, especially with how weighty you’re getting.", parse);
			}
			else { // > 3
				Text.Add("Okay, now maybe this is getting just a <i>little</i> over the top. With how much milk your [breasts] are producing, there’s a veritable river of white cream gushing from each of your [nips], the constant pressure within driving the streams a considerable and embarrassing distance. The constant stimulation weighs heavily on your mind, and the slightest touch on your fat, engorged breasts only worsens the situation, in addition to causing no small end of discomfort.", parse);
				Text.NL();
				Text.Add("You really ought to get yourself milked… or at least find a place until all of this passes.", parse);
			}
			Text.Flush();
			Gui.NextPrompt();
		});
	}
	// Trigger end of lactaction
	if(oldMilk > 0 && newMilk <= 0) {
		Gui.Callstack.unshift(function() {
			var parse = {
				nips: player.FirstBreastRow().NipsShort()
			};
			
			Text.Clear();
			Text.Add("With a few final drops, the pressure behind your [nips] eases, and the warm flow finally stops. Seems like you’ve dried up - you’ll either need to get pregnant or use a little alchemical help if you want to turn your mammaries milky once more.", parse);
			Text.Flush();
			Gui.NextPrompt();
		});
	}
}

Player.prototype.LactationDesc = function(parse) {
	if(!this.lactHandler.CanLactate()) {
		return;
	}
	
	parse["nips"] = this.FirstBreastRow().NipsShort();
	parse["breasts"] = this.FirstBreastRow().Short();
	var rate = this.lactHandler.Rate();
	
	if(this.Lactation()) {
		parse["toparmor"] = this.ArmorDesc();
		if(rate > 3) {
			parse["ua"] = this.Armor() ? Text.Parse(" under your [toparmor]", parse) : "";
			Text.Add(" Milk practically gushes from your [nips], soaking your clothing and leaving a faintly sweet smell in its wake. There’s no way you’re going to be hiding this at all - or the contours of your [breasts] as the wet fabric clings to you[ua], leaving little to the imagination.", parse);
		}
		else if(rate > 1) {
			parse["ua"] = this.Armor() ? Text.Parse(" At least your [toparmor] manages to conceal it reasonably well, although it still is uncomfortable down there.", parse) : "";
			Text.Add(" Small streams of milk flow from your [nips], staining your clothing and creating a distinct wet blotch on the fabric.[ua] You feel like a good milking should probably be in order when you can get a moment to yourself.", parse);
		}
		else {
			Text.Add(" Beads of fresh, white cream well up on your [nips] intermittently. Forced out from the pressure within your [breasts], they cling on for as long as they can before rolling off and seeping into your clothing. While it takes a little time for the wetness to build up, you get there just fine in the end.", parse);
		}
	}
	else if(rate > 0) {
		var level = this.lactHandler.MilkLevel();
		if(level >= 0.9)
			Text.Add(" Your [breasts] are fat and full, a distinct sensation of pressure behind your [nips] as they approach their capacity. Distinctly tender from their engorged state, they jiggle slightly with each step you take, a side-effect of holding all that weight.", parse);
		else if(level >= 0.5)
			Text.Add(" Tingling and sensitive, there’s a distinct feeling of full sloshiness in your [breasts] as you go about your business. There’s much less sag and a lot more perkiness to them now, a welcome side effect of being filled like that.", parse);
	}
}

Player.prototype.PregnancyProgess = function(womb, slot, oldProgress, progress) {
	if(!womb) return;
	var num = womb.litterSize;
	var breasts = player.FirstBreastRow().Size() >= 2;
	
	var parse = {};
	parse["belly"] = player.StomachDesc();
	
	if(progress > PregnancyLevel.Level1 && oldProgress <= PregnancyLevel.Level1) {
		Gui.Callstack.unshift(function() {
			Text.Clear();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Ugh, you feel nauseous and a little dizzy.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You feel positively sick to your stomach.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Are you getting fatter?", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You feel strangely peaceable with the world at large.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You feel nice and warm all over.", parse);
			}, 1.0, function() { return true; });
			if(num >= 3) {
				scenes.AddEnc(function() {
					Text.Add("A particularly powerful wave of nausea hits you, and you barely manage to prevent yourself from throwing up on the spot.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("A strange warm pressure emanates from your lower belly, pushing outwards insistently.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("You’ve been feeling extra hungry as of late. Maybe you should watch what you eat lest you put on weight…", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("For some reason, you feel irrationally cheerful today. Let the world beware, lest it risk suffering from your hugs!", parse);
				}, 1.0, function() { return true; });
			}
			
			scenes.Get();
			Text.Flush();
			Gui.NextPrompt();
		});
	}
	
	if(progress > PregnancyLevel.Level2 && oldProgress <= PregnancyLevel.Level2) {
		Gui.Callstack.unshift(function() {
			Text.Clear();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("You put your hands on the gentle swell of your pregnancy and feel content.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Your breasts tingle and churn, working to prepare themselves for feeding your offspring.", parse);
			}, 1.0, function() { return breasts; });
			scenes.AddEnc(function() {
				Text.Add("Your growing pregnancy fills your womb with a gentle warmth and gives you a positively radiant glow.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("There’s no mistaking the firm swell on your midriff - you’re pregnant.", parse);
			}, 1.0, function() { return true; });
			if(num >= 3) {
				scenes.AddEnc(function() {
					Text.Add("The swell of your pregnancy’s a little bigger than what you’ve expected, considering what impregnated you. Should you be worried?", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Your moods have been really all over the place lately. Animated, frustrated, then melancholy - and all before lunchtime, too!", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("A sudden wave of fulfilled contentment radiates outwards from your lower belly, causing you to stop and savor it before it passes.", parse);
				}, 1.0, function() { return true; });
			}
			if(womb.IsEgg()) {
				scenes.AddEnc(function() {
					Text.Add("You can faintly feel your eggs inside of you, a small hardness like marbles of a sort.", parse);
				}, 1.0, function() { return true; });
			}
			else {
				scenes.AddEnc(function() {
					Text.Add("A faint flutter of movement from within your lower belly draws your attention, and you gently rub the swell of your midriff.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					parse["ren"]      = num > 1 ? "ren" : "";
					parse["s"]        = num > 1 ? "s" : "";
					parse["notS"]     = num > 1 ? "" : "s";
					parse["ItsTheir"] = num > 1 ? "Their" : "Its";
					Text.Add("You stop and hold your [belly] as your unborn child[ren] stir[notS] within. [ItsTheir] movement[s] may be faint now, but promises to grow stronger, much to your delight.", parse);
				}, 1.0, function() { return true; });
			}
			
			scenes.Get();
			Text.Flush();
			Gui.NextPrompt();
		});
	}
	
	if(progress > PregnancyLevel.Level3 && oldProgress <= PregnancyLevel.Level3) {
		Gui.Callstack.unshift(function() {
			Text.Clear();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("You have a sudden urge to cradle your [belly].", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				parse["breasts"] = player.FirstBreastRow().Short();
				Text.Add("Your [breasts] are starting to feel fuller, though not overly so yet.", parse);
			}, 1.0, function() { return breasts; });
			scenes.AddEnc(function() {
				Text.Add("Your belly has gotten to the size that you’ve taken to sleeping on your side most, if not all of the time now.", parse);
			}, 1.0, function() { return true; });
			if(num >= 3) {
				scenes.AddEnc(function() {
					Text.Add("The weight of your pregnancy is starting to get to you. You’re starting to feel a little awkward and clumsy.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("The skin about your midsection is starting to get quite stretched. You’ve heard they sell oils for that… not that you’d be able to get your hands on some with any regularity while on the road.", parse);
				}, 1.0, function() { return true; });
			}
			if(womb.IsEgg()) {
				scenes.AddEnc(function() {
					parse["s"]        = num > 1 ? "s" : "";
					Text.Add("You can distinctly feel the egg[s] in your womb now, hard shells pressing against your soft insides.", parse);
				}, 1.0, function() { return true; });
			}
			else {
				scenes.AddEnc(function() {
					Text.Add("The movement within your [belly] is getting stronger and more distinct, a sure sign of your unborn progeny’s good health.", parse);
				}, 1.0, function() { return true; });
			}
			
			scenes.Get();
			Text.Flush();
			Gui.NextPrompt();
		});
	}
	
	if(progress > PregnancyLevel.Level4 && oldProgress <= PregnancyLevel.Level4) {
		Gui.Callstack.unshift(function() {
			Text.Clear();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Rubbing your [belly] gently, you’re made distinctly aware of the fact that your pregnancy is approaching its end.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				parse["breasts"] = player.FirstBreastRow().Short();
				Text.Add("The pressure within your [breasts] is starting to get a little intense - you’d probably leak if someone squeezed them…", parse);
			}, 1.0, function() { return breasts; });
			scenes.AddEnc(function() {
				Text.Add("You take a moment to savor your burgeoning pregnancy, rubbing your hands all over the sensitive skin of your [belly].", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You’ve noticed that you’re now carrying the weight of your pregnancy a little differently, more of its weight now focused on your hips.", parse);
			}, 1.0, function() { return true; });
			if(num >= 3) {
				scenes.AddEnc(function() {
					Text.Add("The sensations of warmth and fullness radiating from your womb make it a little hard to think straight. All right, more than a little hard.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Pausing a moment to catch your breath, you close your eyes and bask in the warm glow of fulfillment that inexplicably fills your world. Yes… this is what you were made for.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Weighty as it can be, your [belly] is throwing off your center of gravity, forcing you to adjust your posture to compensate.", parse);
				}, 1.0, function() { return true; });
			}
			if(womb.IsEgg()) {
				scenes.AddEnc(function() {
					Text.Add("The clutch growing inside you is quite prominent now, the eggs shifting and knocking against each other as they roll around in your womb. You have to be careful how you lie down, lest the hard shells jab at your tender insides.", parse);
				}, 1.0, function() { return true; });
			}
			else {
				scenes.AddEnc(function() {
					Text.Add("A powerful kick against your insides knocks the breath out of you, leaving you gasping and winded while you recover. Hey… there was no need for that!", parse);
				}, 1.0, function() { return true; });
			}
			
			scenes.Get();
			Text.Flush();
			Gui.NextPrompt();
		});
	}
	
	if(progress > PregnancyLevel.Level5 && oldProgress <= PregnancyLevel.Level5) {
		Gui.Callstack.unshift(function() {
			Text.Clear();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Out of nowhere, your [belly] squeezes down hard, the motion causing it to visibly contract and sending you huffing for breath. While there aren’t any follow-up contractions, it’s still a sign that you should probably get yourself somewhere safe… ", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Your womb suddenly shifts and pulses, your offspring dropping further into and pressing harder against your pelvis. Birth can’t be far away…", parse);
			}, 1.0, function() { return true; });
			if(num >= 3) {
				scenes.AddEnc(function() {
					Text.Add("Shifting and pulsing, your womb complains about the sheer amount of life it’s having to hold. Birth is practically imminent now…", parse);
				}, 1.0, function() { return true; });
			}
			if(womb.IsEgg()) {
				scenes.AddEnc(function() {
					Text.Add("The constant weight of your clutch weighs on your mind, distracting you from your thoughts. You should really just lay and be done with it already…", parse);
				}, 1.0, function() { return true; });
			}
			else {
				scenes.AddEnc(function() {
					parse["yIes"] = num > 1 ? "ies" : "y";
					parse["notS"] = num > 1 ? "" : "s";
					Text.Add("The constant squirming and shifting within your [belly] has you a little worried. It’s clear that your bab[yIes] want[notS] out at this point, and all that’s required is for your body to cooperate…", parse);
				}, 1.0, function() { return true; });
			}
			
			scenes.Get();
			Text.Flush();
			Gui.NextPrompt();
		});
	}
}

Player.prototype.CanGiveBirth = function() {
	return GAME().party.location.safe();
}

// Pregnancy TODO
Player.prototype.PregnancyTrigger = function(womb, slot) {
	if(!womb) return;
	// Use unshift instead of push to make sure pregnancy doesn't interfere with scene progression
	Gui.Callstack.unshift(function() {
		womb.pregnant = false;
		var parse = {
			
		};
		parse = GAME().player.ParserTags(parse);
		
		var num  = womb.litterSize;
		var race = womb.race;
		var egg  = womb.IsEgg();
		var lact = GAME().player.FirstBreastRow().Size() >= 2;
		
		parse = Text.ParserPlural(parse, num > 1);
		
		Text.Clear();
		
		parse["num"] = Text.NumToText(num);
		parse["type"] = race.name;
		parse["newborn"] = egg ? "egg" : "newborn";
		
		if(GetDEBUG()) {
			Text.Add("<b>Preg-debug:<br>", parse);
			Text.Add("Num: [num]<br>", parse);
			Text.Add("Type: [type]</b>", parse);
			Text.NL();
		}
		
		// #Initiation block
		
		parse["v"] = slot != PregnancyHandler.Slot.Butt ? parse["vag"] : "womb";
		Text.Add("All of a sudden, a warm trickle of fluid erupts from your [v] and runs down your [thighs], followed by a sharp pain in your lower belly.", parse);
		Text.NL();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<b>You’ve gone into labor!</b>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<b>It’s time to give birth!</b>", parse);
		}, 1.0, function() { return true; });
		scenes.Get();
		
		Text.NL();
		Text.Add("Even as the first contractions grip your womb and you feel its contents descend ever lower, you hurriedly find a place to settle down and do the deed, clearing a spot for your progeny to safely enter the world.", parse);
		
		var partynum = GAME().party.location.switchSpot() ? party.NumTotal() : party.Num();
		var comp = party.Get(1);
		
		if(partynum == 2 && comp) {
			parse["comp"] = comp.name;
			parse = comp.ParserPronouns(parse);
			Text.Add(" [comp] is more than willing to give you your space, excusing [himher]self as [heshe] waits nearby anxiously.", parse);
		}
		else if(partynum > 2) {
			Text.Add(" Your companions are more than willing to give you your space, excusing themselves as they wait nearby anxiously.", parse);
		}
		Text.NL();
		
		// #Labour block (Birthsize comes into play here)
		var birthsize = GAME().player.body.torso.hipSize.Get() / 4;
		birthsize /= womb.geneSize || 1;
		if(GAME().player.HasPerk(Perks.Breeder)) birthsize *= 1.5;
		
		Text.Add("It’s not long before labor begins in earnest. Even as you pant and puff, you can feel your contractions coming on more strongly and at quicker intervals, picking up the pace even as your cervix begins to dilate to allow new life to enter the world.", parse);
		Text.NL();
		if(birthsize < 0.75) { //difficult
			Text.Add("Goddess forbid, the birth is agonizing! With such a big baby and small hips on you for it to fit through, your womb is working overtime, straining with all its might to bring your child into the world. Beads of sweat drip from your forehead and gather on your [skin] as you alternate between gritting your teeth and groaning with effort - try as you might, you can’t help but think of horror stories involving women dying in childbed…", parse);
			Text.NL();
			Text.Add("Thankfully, though, you don’t fall to that most ignoble end. Bit by painful bit, your pregnant womb works to birth your offspring, nudging it gradually through your tunnel over the course of many hours. It’s almost enough for you to swear to never have sex again, but by and large your child emerges, still slick with birth fluids. Panting and delirious with the trial you’ve just undergone, you collapse back to the ground for a moment, barely having enough presence of mind to gather the newborn in your arms. If you’re ever going to go through this again, maybe you should consider a potion or two to make the process easier…", parse);
		}
		else if(birthsize < 1.25) { //normal
			Text.Add("It’s nothing that you didn’t expect, but the birth pangs wracking your body are still enough for you to squeeze your eyes shut and try to put your mind elsewhere while your body does what it has to.", parse);
			Text.NL();
			Text.Add("It doesn’t work.", parse);
			Text.NL();
			Text.Add("Groaning and panting, your [breasts] heaving with effort, you place your hands on your [belly] as it contracts visibly with each push. Like it or not, you can <i>feel</i> your insides stretching as your child slowly descends through your tunnel, slowly making its way into the outside world. It’s all you can do to grit your teeth and go with the flow, and you don’t even manage that as you feel your child crown, bringing the whole experience to a peak.", parse);
			Text.NL();
			Text.Add("Thankfully, your labor’s much easier from there on out. Gasping and sweating, you push the rest of your child out of you with a few more furious contractions, and gently gather the newborn in your arms before settling back to rest a moment.", parse);
		}
		else if(birthsize < 2) { //easy
			Text.Add("You clench your teeth and lie back as you feel the baby’s head drop into your birth canal, your cervix fully dilated and stretched to admit your offspring into the world. While the effort is tiring and your womb visibly pulses with each set of contractions that seizes your [belly], it doesn’t feel <i>that</i> painful or discomfiting, but more exhausting than anything else.", parse);
			Text.NL();
			Text.Add("Faster and faster the contractions come, each one smoothly pushing the contents of your womb further downwards and towards the light of day. You breathe deeply and steadily, and the eventual delivery comes with surprising speed - one moment you’re feeling your child passing through your hips, and the next moment you’re picking up a tiny newborn from amidst a small puddle of afterbirth and fluids, marveling at the small miracle that’s taken place.", parse);
		}
		else { //very easy
			Text.Add("Ha! Your wide, fertile hips laugh at the notion of birth. With ample space for your baby to pass through and a powerful womb to match, your labor lacks the barest smidgen of pain and isn’t even that tiring. Sure, it’s not <i>effortless</i> - you can see your [belly] pulsing and squeezing away with each set of contractions that passes through your body, but it’s hardly the screaming affair that so many other mothers have to go through.", parse);
			Text.NL();
			Text.Add("No, the predominant feeling that you’re getting throughout this whole process is a sensation of wondrous satisfaction, growing stronger as you feel your child pass through your fully dilated cervix and begin slipping through your birthing canal. Breathing deeply, you cradle the swell of your [belly] and coo softly, feeling the weight in your pelvis drop lower and lower with each set of contractions. Before long, you feel the pressure give as your child crowns; another tremendous push on your part, and warm wetness spills out to the floor in the form of a puddle of afterbirth and fluids.", parse);
			Text.NL();
			Text.Add("Gloriously relieved, you gather up the latest addition to your family, resting the newborn on your slightly smaller belly as you take a moment to catch your breath.", parse);
		}
		Text.Add(" Congratulations, you’re now the mother of a young [type]!", parse);
		Text.NL();
		if(num > 1) {
			Text.Add("It’s not over yet, though! Just as you’re about to take a breather, another set of contractions grips you, and you feel another baby begin its descent through your hips and into the world. Your face taut with effort, you gently set down your child, and begin the arduous process of birthing your little one’s brothers and sisters, no matter how many they may be.", parse);
			Text.NL();
			Text.Add("At least the birthing isn’t as tiring this time around - the first child out of your womb has eased the way for the rest to follow. Still by the time you’re done with it all, you’re absolutely exhausted and left holding a total of [num] [newborn]s.", parse);
			Text.NL();
		}
		
		/* TODO
		#Mob-specific block
		//Use this in lieu of nursing block, if present.
		//Mostly going to be used for egg pregnancies.
		
		(mob specific block goes here)
		(If mammal, suckle. If egg… um… do something?)
		(Define this in the mob’s doc itself, or in a separate section below?)
		*/
		
		//#Nursing block - fallback
		// else if TODO
		if(!egg && lact) {
			var milk = GAME().player.Milk();
			
			parse["m"] = num > 1 ? " one at a time" : "";
			parse["ren"] = num > 1 ? "ren" : "";
			Text.Add("When you feel you’ve recovered enough from the birth, you raise your bab[yIes] to your breasts[m], letting the new addition[s] to your family suckle from your milky teats. Sighing softly, you lean back and let the simple, wonderful sensations of having your nipples worked and feeling your milk let down wash over you. ", parse);
			if(milk < 5) { //less milk
				Text.Add("While there isn’t much to go around, you nevertheless have enough milk to satiate your child[ren] before you run dry. For now, that is. Still, it’s a bit worrying, especially if you’re planning to do this more often in the future…", parse);
			}
			else if(milk < 15) { //much milk
				Text.Add("Delicious mouthfuls of rich cream pour out of your nipples, and you bite back the temptation to moan as your [breasts] are put to the purpose they were made for. Your child[ren] suckle[notS] greedily at your breast, and all you need to do is bask in the warm glow of motherhood while nature takes its course.", parse);
				Text.NL();
				Text.Add("Eventually, though, you do run dry, but a faint tingling at the base of your [breasts] lets you know that your breasts will be more than full and ready for the next feeding…", parse);
			}
			else { //mega milk
				Text.Add("With your [breasts] being as bountiful as they are, there’s no worry about you not being able to feed your new brood. No matter how much your nipples are squeezed, milked and suckled, there’s a seemingly inexhaustible supply of nourishment to be had, an overflowing font of rich cream. While your [breasts] are a little less tender now, you have a feeling they’ll probably fill right back up soon… ", parse);
			}
			
			GAME().player.MilkDrain(15);
			
			Text.NL();
			Text.Add("Hugging your newborn[s], you burp the little one[s] and turn your attention to what needs to be done next.", parse);
			Text.NL();
		}
		
		//TODO
		// #Follower father talk block. Use only if specified, else ignore. (Defined in follower documents)
		
		TimeStep({hour: 4});
		
		//#Post-partum care block
		NurseryScenes.CareBlock(womb);
	});
}


// Party interaction
Player.prototype.Interact = function(switchSpot) {
	Text.Clear();
	var that = GAME().player;
	
	that.PrintDescription();
	
	var options = new Array();
	options.push({ nameStr: "Fantasize",
		func : function() {
			Text.Clear();
			Text.Add("[Placeholder] You dream about sexy things.");
			Text.Flush();
			TimeStep({hour : 1});
			
			that.AddLustFraction(0.5);
			
			Gui.NextPrompt(that.Interact);
		}, enabled : true,
		tooltip : "Rest a while and dream of sex."
	});
	options.push({ nameStr: "Release",
		func : function() {
			MasturbationScenes.Entry();
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	options.push({ nameStr: "Meditate",
		func : function() {
			MeditationScenes.Entry();
		}, enabled : true,
		tooltip : "Calm yourself through meditation."
	});
	//Equip, stats, job, switch
	that.InteractDefault(options, switchSpot, true, true, true, false);
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}

export { Player };
