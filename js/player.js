/*
 * 
 * Define the player object (based on entity)
 * 
 */
function Player(storage) {
	Entity.call(this);
	this.name = "???";
	
	// TEMP STUFF
	//this.avatar.def = "data/avatar_akbal.png";
	//this.avatar.girl = "data/avatar_elf.png";
	
	this.abilities["Special"].name = "Summon";
	
	this.currentJob = Jobs.Fighter;
	this.jobs["Fighter"]   = new JobDesc(Jobs.Fighter);
	this.jobs["Scholar"]   = new JobDesc(Jobs.Scholar);
	this.jobs["Courtesan"] = new JobDesc(Jobs.Courtesan);
	
	this.jobs["Bruiser"]   = new JobDesc(Jobs.Bruiser);
	
	this.jobs["Mage"]      = new JobDesc(Jobs.Mage);
	//this.jobs["Mystic"]    = new JobDesc(Jobs.Mystic);
	//this.jobs["Healer"]    = new JobDesc(Jobs.Healer);
	
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
		if(this.body.Gender() == Gender.male)
			this.avatar.combat = Images.pc_male;
		else
			this.avatar.combat = Images.pc_fem;
		
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
	return gameCache.flags["LearnedMagic"] != 0;
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

// Party interaction
Player.prototype.Interact = function() {
	Text.Clear();
	var that = player;
	
	that.PrintDescription();
	
	var options = new Array();
	options.push({ nameStr: "Fantasize",
		func : function() {
			Text.Clear();
			Text.AddOutput("[Placeholder] You dream about sexy things.");
			
			world.TimeStep({hour : 1});
			
			that.AddLustFraction(0.5);
			
			Gui.NextPrompt(that.Interact);
		}, enabled : true,
		tooltip : "Rest a while and dream of sex."
	});
	options.push({ nameStr: "Release",
		func : function() {
			Text.Clear();
			Text.AddOutput("[Placeholder] You masturbate fiercely, cumming buckets.");
			
			world.TimeStep({minute : 10});
			
			that.curLust = 0;
			
			Gui.NextPrompt(that.Interact);
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	options.push({ nameStr: "Meditate",
		func : function() {
			Text.Clear();
			Text.AddOutput("[Placeholder] You sit down and attempt to calm your thoughts.");
			
			world.TimeStep({minute : 30});
			
			that.curLust -= that.spirit.Get() * 3;
			if(that.curLust < 0) that.curLust = 0;
			
			Gui.NextPrompt(that.Interact);
		}, enabled : true,
		tooltip : "Calm yourself."
	});
	options.push({ nameStr: "Equip",
		func : function() {
			that.EquipPrompt(that.Interact);
		}, enabled : true
	});
	options.push({ nameStr: that.pendingStatPoints != 0 ? "Level up" : "Stats",
		func : function() {
			that.LevelUpPrompt(that.Interact);
		}, enabled : true
	});
	options.push({ nameStr: "Job",
		func : function() {
			that.JobPrompt(that.Interact);
		}, enabled : true
	});
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}

