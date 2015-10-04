/*
 * 
 * Define the player object (based on entity)
 * 
 */
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
	
	//this.jobs["Elementalist"]    = new JobDesc(Jobs.Elementalist);
	this.jobs["Hypnotist"] = new JobDesc(Jobs.Hypnotist);
	
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
			
			world.TimeStep({minute: minutes});
			
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

Player.prototype.PregnancyProgess = function(womb, slot, oldProgress, progress) {
	if(!womb) return;
	var num = womb.litterSize;
	var breasts = player.FirstBreastRow().Size() >= 2;
	
	var parse = {};
	parse["belly"] = player.StomachDesc();
	
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
}

// Pregnancy TODO
Player.prototype.PregnancyTrigger = function(womb, slot) {
	if(!womb) return;
	// Use unshift instead of push to make sure pregnancy doesn't interfere with scene progression
	Gui.Callstack.unshift(function() {
		womb.pregnant = false;
		var parse = {
			
		};
		var num  = womb.litterSize;
		var type = womb.pregType;
		
		parse = Text.ParserPlural(parse, num > 1);
		
		parse["num"] = Text.NumToText(num);
		parse["type"] = type;
		
		Text.Clear();
		
		if(DEBUG) {
			Text.Add("<b>Preg-debug:<br/>", parse);
			Text.Add("Num: [num]<br/>", parse);
			Text.Add("Type: [type]</b>", parse);
			Text.NL();
		}
		
		if(type == PregType.Feline)
			Text.Add("You birth [num] kitten[s].", parse);
		else if(type == PregType.Equine)
			Text.Add("You birth [num] equine bab[yIes].", parse);
		else if(type == PregType.Lagomorph)
			Text.Add("You birth [num] bunn[yIes].", parse);
		else if(type == PregType.Lizard)
			Text.Add("You birth [num] lizard bab[yIes].", parse);
		else
			Text.Add("You birth undefined offspring! BUG!", parse);
		Text.Flush();
		Gui.NextPrompt();
	});
}

// Party interaction
Player.prototype.Interact = function(switchSpot) {
	Text.Clear();
	var that = player;
	
	that.PrintDescription();
	
	var options = new Array();
	options.push({ nameStr: "Fantasize",
		func : function() {
			Text.Clear();
			Text.Add("[Placeholder] You dream about sexy things.");
			Text.Flush();
			world.TimeStep({hour : 1});
			
			that.AddLustFraction(0.5);
			
			Gui.NextPrompt(that.Interact);
		}, enabled : true,
		tooltip : "Rest a while and dream of sex."
	});
	options.push({ nameStr: "Release",
		func : function() {
			Text.Clear();
			Text.Add("[Placeholder] You masturbate fiercely, cumming buckets.");
			Text.Flush();
			world.TimeStep({minute : 10});
			
			that.OrgasmCum();
			
			Gui.NextPrompt(function() {
				that.Interact(switchSpot);
			});
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	options.push({ nameStr: "Meditate",
		func : function() {
			Text.Clear();
			Text.Add("[Placeholder] You sit down and attempt to calm your thoughts.");
			Text.Flush();
			world.TimeStep({minute : 30});
			
			that.AddLustFraction(-1);
			
			Gui.NextPrompt(function() {
				that.Interact(switchSpot);
			});
		}, enabled : true,
		tooltip : "Calm yourself."
	});
	//Equip, stats, job, switch
	that.InteractDefault(options, switchSpot, true, true, true, false);
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}

