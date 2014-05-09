
Jobs = {};

Job = function(name) {
	this.name   = name;
	this.levels = []; // JobLevel elements
	this.preqs  = []; // Pairs of {job : Jobs["Fighter"], lvl : 3} etc
	this.abilities = new AbilityCollection("Job"); // Contains abilities available when job is used
}
Job.prototype.Short = function(entity) {
	return this.name;
}
Job.prototype.Unlocked = function(entity) {
	return true;
}

JobDesc = function(job) {
	this.job        = job;
	this.level      = 1;
	this.experience = 0;
	this.mult       = 1;
}
JobDesc.prototype.ToStorage = function() {
	if(this.level <= 1 && this.experience == 0) return null;
	var storage = {};
	if(this.level      != 1) storage["lvl"] = this.level;
	if(this.experience != 0) storage["exp"] = this.experience;
	return storage;
}
JobDesc.prototype.FromStorage = function(storage) {
	if(storage) {
		this.level      = parseInt(storage["lvl"]) || this.level;
		this.experience = parseInt(storage["exp"]) || this.experience;
	}
}

Job.prototype.AddExp = function(entity, exp) {
	// Check for null arguments and broken links
	if(entity == null) return;
	var jd = entity.jobs[this.name];
	if(jd == null) return;
	exp = exp || 0;
	// Check for maxed out job
	var newLevel = this.levels[jd.level-1];
	if(newLevel == null) return;
	var toLevel = newLevel.expToLevel;
	if(toLevel == null) return;
	toLevel *= jd.mult;
	
	// Add xp to pool
	jd.experience += exp;
	// Loop until xp isn't higher than xp to level
	while(jd.experience >= toLevel) {
		// Reduce pool by level
		jd.experience -= toLevel;
		// Save skills/bonuses gained
		var skills = newLevel.skills;
		var bonus  = newLevel.bonus;
		var func   = newLevel.func;
		// Increase level
		jd.level++;
		
		var parse = {
			name : entity.NameDesc(),
			is   : entity.is(),
			lvl  : jd.level,
			job  : this.Short(entity),
			s    : entity.plural() ? "" : "s",
			has  : entity.has()
		};
		Text.NL();
		Text.Add(Text.BoldColor("[name] [is] now a level [lvl] [job]!<br/>"), parse);
		// Teach new skills
		if(skills) {
			// [ { ab: Ablities.Black.Fireball, set: "Spells" }, ... ]
			for(var i = 0; i < skills.length; i++) {
				var sd      = skills[i];
				var ability = sd.ab;
				var set     = sd.set;
				
				parse["ability"] = ability.name;
				
				if(!entity.abilities[set].HasAbility(ability))
					Text.Add(Text.BoldColor("[name] [has] mastered [ability]!<br/>"), parse);
				entity.abilities[set].AddAbility(ability);
			}
		}
		// Apply bonuses
		if(bonus) {
			if(bonus["str"]) { entity.strength.growth     += bonus["str"]; Text.Add("Str+" + (bonus["str"] * 10) + "<br/>"); }
			if(bonus["sta"]) { entity.stamina.growth      += bonus["sta"]; Text.Add("Sta+" + (bonus["sta"] * 10) + "<br/>"); }
			if(bonus["dex"]) { entity.dexterity.growth    += bonus["dex"]; Text.Add("Dex+" + (bonus["dex"] * 10) + "<br/>"); }
			if(bonus["int"]) { entity.intelligence.growth += bonus["int"]; Text.Add("Int+" + (bonus["int"] * 10) + "<br/>"); }
			if(bonus["spi"]) { entity.spirit.growth       += bonus["spi"]; Text.Add("Spi+" + (bonus["spi"] * 10) + "<br/>"); }
			if(bonus["cha"]) { entity.libido.growth       += bonus["cha"]; Text.Add("Cha+" + (bonus["cha"] * 10) + "<br/>"); }
			if(bonus["lib"]) { entity.charisma.growth     += bonus["lib"]; Text.Add("Lib+" + (bonus["lib"] * 10) + "<br/>"); }
			entity.SetLevelBonus();
		}
		// Apply special functions
		if(func) func(entity);
		// Prepare for checking next level
		var newLevel = this.levels[jd.level-1];
		if(newLevel == null) break;
		toLevel = newLevel.expToLevel;
		if(toLevel == null) {
			jd.experience = 0;
			Text.Add(Text.BoldColor("[name] [is] now a master [job]!"), parse);
			Text.NL();
			break;
		}
		toLevel *= jd.mult;
	}
	
	Text.Flush();
}
// Returns true if job is mastered
Job.prototype.Master = function(entity) {
	// Check for null references
	if(entity == null) return false;
	var jd = entity.jobs[this.name];
	if(jd == null) return false;
	// Check if current level is same or higher than max level
	return (jd.level > this.levels.length);
}

Job.prototype.Available = function(entity) {
	if(entity == null) return false;
	
	for(var i = 0; i < this.preqs.length; i++) {
		// Pairs of {job : Jobs["Fighter"], lvl : 3} etc
		var preq = this.preqs[i];
		
		var job = preq.job;
		var lvl = preq.lvl || 1;
		
		if(job) {
			var jd = entity.jobs[job.name];
			if(jd == null)     return false;
			if(jd.level < lvl) return false;
		}
	}
	
	return true;
}

JobLevel = function(expToLevel, skills, bonus, func) {
	this.expToLevel = expToLevel;
	this.skills     = skills; // [ { ab: Ablities.Black.Fireball, set: "Spells" }, ... ]
	this.bonus      = bonus;  // { str: 0.1, int: 0.2 ...}
	this.func       = func;   // func(entity)
}



JobEnum = {
	Fighter   : 0,
	Scholar   : 1,
	Courtesan : 2,
	Thief     : 3
}

////////////
// TIER 1 //
////////////

Jobs["Fighter"] = new Job("Fighter");
Jobs["Fighter"].Long = function(entity) { return Text.Parse("The fighter trains the fundamental basics of physical combat, honing [hisher] body for further specialization. Has a broad set of attacks, but lacks a tactical mindset.", {hisher: entity.hisher()}); }
Jobs["Fighter"].abilities.AddAbility(Abilities.Physical.Bash);
Jobs["Fighter"].abilities.AddAbility(Abilities.Physical.Pierce);
Jobs["Fighter"].abilities.AddAbility(Abilities.Physical.DAttack);
Jobs["Fighter"].abilities.AddAbility(Abilities.Physical.CrushingStrike);
Jobs["Fighter"].levels.push(new JobLevel(10,  [{ab: Abilities.Physical.Bash, set: "Skills"}], {"str" : 0.2}));
Jobs["Fighter"].levels.push(new JobLevel(20,  null, {"str" : 0.1, "sta" : 0.1}));
Jobs["Fighter"].levels.push(new JobLevel(40,  [{ab: Abilities.Physical.Pierce, set: "Skills"}], {"str" : 0.1, "dex" : 0.1}));
Jobs["Fighter"].levels.push(new JobLevel(80,  null, {"str" : 0.2}));
Jobs["Fighter"].levels.push(new JobLevel(160, [{ab: Abilities.Physical.DAttack, set: "Skills"}], {"str" : 0.1, "sta" : 0.1}));
Jobs["Fighter"].levels.push(new JobLevel(320, null, {"str" : 0.1, "dex" : 0.1}));
Jobs["Fighter"].levels.push(new JobLevel(640, [{ab: Abilities.Physical.CrushingStrike, set: "Skills"}], {"str" : 0.2, "sta" : 0.2, "dex" : 0.2}));

Jobs["Scholar"] = new Job("Scholar");
Jobs["Scholar"].Long = function(entity) { return Text.Parse("The scholar is a truthseeker, characterized by [hisher] curiosity and thirst for knowledge. While lacking in offensive strength, the scholar has plenty of supportive abilities to field in combat.", {hisher: entity.hisher()}); }
Jobs["Scholar"].abilities.AddAbility(Abilities.White.Tirade);
Jobs["Scholar"].abilities.AddAbility(Abilities.White.FirstAid);
Jobs["Scholar"].abilities.AddAbility(Abilities.White.Pinpoint);
Jobs["Scholar"].abilities.AddAbility(Abilities.White.Cheer);

Jobs["Scholar"].abilities.AddAbility(Abilities.Black.Venom);

Jobs["Scholar"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Tirade, set: "Support"}], {"int" : 0.2}));
Jobs["Scholar"].levels.push(new JobLevel(20,  null, {"int" : 0.1, "spi" : 0.1}));
Jobs["Scholar"].levels.push(new JobLevel(40,  [{ab: Abilities.White.FirstAid, set: "Support"}], {"int" : 0.1, "dex" : 0.1}));
Jobs["Scholar"].levels.push(new JobLevel(80,  null, {"int" : 0.2}));
Jobs["Scholar"].levels.push(new JobLevel(160, [{ab: Abilities.White.Pinpoint, set: "Support"}], {"int" : 0.1, "spi" : 0.1}));
Jobs["Scholar"].levels.push(new JobLevel(320, null, {"int" : 0.1, "cha" : 0.1}));
Jobs["Scholar"].levels.push(new JobLevel(640, [{ab: Abilities.White.Cheer, set: "Support"}], {"int" : 0.2, "spi" : 0.2, "cha" : 0.2}));

Jobs["Courtesan"] = new Job("Courtesan");
Jobs["Courtesan"].Long = function(entity) { return Text.Parse("There is a lustful spark stirring within the playful courtesan, something [heshe] has no qualms about flaunting in combat for [hisher] benefit. The courtesan’s teasing nature is something that one day might turn into something darker, more primal, should [heshe] give in to [hisher] lust.", {hisher: entity.hisher(), heshe: entity.heshe()}); }
Jobs["Courtesan"].abilities.AddAbility(Abilities.Seduction.Fantasize);
Jobs["Courtesan"].abilities.AddAbility(Abilities.Seduction.Charm);
Jobs["Courtesan"].abilities.AddAbility(Abilities.Seduction.Distract);
Jobs["Courtesan"].abilities.AddAbility(Abilities.Seduction.Seduce);
Jobs["Courtesan"].levels.push(new JobLevel(10,  [{ab: Abilities.Seduction.Fantasize, set: "Seduce"}], {"lib" : 0.2}));
Jobs["Courtesan"].levels.push(new JobLevel(20,  null, {"lib" : 0.1, "cha" : 0.1}));
Jobs["Courtesan"].levels.push(new JobLevel(40,  [{ab: Abilities.Seduction.Charm, set: "Seduce"}], {"lib" : 0.1, "dex" : 0.1}));
Jobs["Courtesan"].levels.push(new JobLevel(80,  null, {"lib" : 0.2}));
Jobs["Courtesan"].levels.push(new JobLevel(160, [{ab: Abilities.Seduction.Seduce, set: "Seduce"}], {"lib" : 0.1, "cha" : 0.1}));
Jobs["Courtesan"].levels.push(new JobLevel(320, null, {"lib" : 0.1, "int" : 0.1}));
Jobs["Courtesan"].levels.push(new JobLevel(640, [{ab: Abilities.Seduction.Distract, set: "Seduce"}], {"lib" : 0.2, "cha" : 0.2, "dex" : 0.2}));

// Kiai specific
Jobs["Acolyte"] = new Job("Acolyte");
Jobs["Acolyte"].Long = function(entity) { return Text.Parse("The acolyte has devoted years in the service of Lady Aria, learning empathy and love for [hisher] fellow man. [HeShe] has a strong supportive role, but lacks offensive capabilities.", {hisher: entity.hisher(), HeShe: entity.HeShe()}); }
Jobs["Acolyte"].abilities.AddAbility(Abilities.White.Heal);
Jobs["Acolyte"].abilities.AddAbility(Abilities.White.Preach);
Jobs["Acolyte"].abilities.AddAbility(Abilities.White.Toughen);
Jobs["Acolyte"].abilities.AddAbility(Abilities.White.Empower);
Jobs["Acolyte"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.2}));
Jobs["Acolyte"].levels.push(new JobLevel(20,  null, {"int" : 0.1, "spi" : 0.1}));
Jobs["Acolyte"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.1, "cha" : 0.1}));
Jobs["Acolyte"].levels.push(new JobLevel(80,  null, {"int" : 0.2}));
Jobs["Acolyte"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.1, "spi" : 0.1}));
Jobs["Acolyte"].levels.push(new JobLevel(320, null, {"int" : 0.1, "cha" : 0.1}));
Jobs["Acolyte"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"}], {"int" : 0.2, "spi" : 0.2, "cha" : 0.2}));

////////////
// TIER 2 //
////////////

// TODO: EXP 2 LEVEL
Jobs["Bruiser"] = new Job("Bruiser");
Jobs["Bruiser"].Unlocked = function() { return true; } // TODO Tier 2 condition
Jobs["Bruiser"].Long = function(entity) { return Text.Parse("The powers stored within you are starting to rise, you feel more focused and more agile than before, MONSTERS BEWARE", {hisher: entity.hisher(), heshe: entity.heshe()}); }
Jobs["Bruiser"].preqs.push({job : Jobs["Fighter"], lvl : 3});
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.GrandSlam);
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.Taunt);
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.FocusStrike);
Jobs["Bruiser"].levels.push(new JobLevel(20,   null, {"str" : 0.3, "sta" : 0.3}));
Jobs["Bruiser"].levels.push(new JobLevel(40,   null, {"sta" : 0.3, "dex" : 0.2}));
Jobs["Bruiser"].levels.push(new JobLevel(50, [{ab: Abilities.Physical.DAttack, set: "Skills"}], {"str" : 0.2, "sta" : 0.2}));
Jobs["Bruiser"].levels.push(new JobLevel(80,   null, {"str" : 0.2, "sta" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(160,  null, {"sta" : 0.4}));
Jobs["Bruiser"].levels.push(new JobLevel(240, [{ab: Abilities.Physical.CrushingStrike, set: "Skills"}], {"str" : 0.4, "sta" : 0.4, "dex" : 0.4}));
Jobs["Bruiser"].levels.push(new JobLevel(320,  null, {"str" : 0.32, "sta" : 0.21}));
Jobs["Bruiser"].levels.push(new JobLevel(640,  null, {"sta" : 0.32, "dex" : 0.21}));
Jobs["Bruiser"].levels.push(new JobLevel(980, null, {"str" : 0.4, "sta" : 0.4, "dex" : 0.4}));

Jobs["Mage"] = new Job("Mage");
Jobs["Mage"].Long = function(entity) { return Text.Parse("The mage has taken the first steps into exploring the raw power of the elements and the chaotic force of magic. While [heshe] has barely begun tapping [hisher] innate potential, the mage already possesses a formidable destructive power.", {hisher: entity.hisher(), heshe: entity.heshe()}); }
Jobs["Mage"].preqs.push({job : Jobs["Scholar"], lvl : 3});
Jobs["Mage"].abilities.AddAbility(Abilities.Black.Surge);
Jobs["Mage"].abilities.AddAbility(Abilities.Black.Fireball);
Jobs["Mage"].abilities.AddAbility(Abilities.Black.Freeze);
Jobs["Mage"].abilities.AddAbility(Abilities.Black.Bolt);
Jobs["Mage"].levels.push(new JobLevel(20,   [{ab: Abilities.Black.Surge, set: "Spells"}], {"int" : 0.3}));
Jobs["Mage"].levels.push(new JobLevel(40,   null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Mage"].levels.push(new JobLevel(80,   [{ab: Abilities.Black.Fireball, set: "Spells"}], {"int" : 0.2, "sta" : 0.1}));
Jobs["Mage"].levels.push(new JobLevel(160,  null, {"int" : 0.2, "cha" : 0.1}));
Jobs["Mage"].levels.push(new JobLevel(320,  [{ab: Abilities.Black.Freeze, set: "Spells"}], {"int" : 0.2, "dex" : 0.1}));
Jobs["Mage"].levels.push(new JobLevel(640,  null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Mage"].levels.push(new JobLevel(980, [{ab: Abilities.Black.Bolt, set: "Spells"}], {"int" : 0.4, "spi" : 0.1}));
Jobs["Mage"].Unlocked = function(entity) {
	return gameCache.flags["LearnedMagic"] != 0;
}

Jobs["Healer"] = new Job("Healer");
Jobs["Healer"].Unlocked = function() { return true; } // TODO Tier 2 condition
Jobs["Healer"].preqs.push({job : Jobs["Scholar"], lvl : 3});
Jobs["Healer"].abilities.AddAbility(Abilities.White.Heal);
Jobs["Healer"].levels.push(new JobLevel(20,   null, {"str" : 0.2}));
Jobs["Healer"].levels.push(new JobLevel(40,   null, {"str" : 0.2}));
Jobs["Healer"].levels.push(new JobLevel(80,   [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.1, "dex" : 0.1}));
Jobs["Healer"].levels.push(new JobLevel(160,  null, {"str" : 0.2}));
Jobs["Healer"].levels.push(new JobLevel(320,  null, {"str" : 0.2}));
Jobs["Healer"].levels.push(new JobLevel(640,  null, {"str" : 0.2}));
Jobs["Healer"].levels.push(new JobLevel(980, null, {"str" : 0.2}));

Jobs["Mystic"] = new Job("Mystic");
Jobs["Mystic"].preqs.push({job : Jobs["Acolyte"], lvl : 4});
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Shimmer);
Jobs["Mystic"].Long = function(entity) { return Text.Parse("Now as a mystic, you learn to use the powers of light to aid you in battle as you devote yourself to rid the world of evil.", {hisher: entity.hisher(), HeShe: entity.HeShe()}); }
Jobs["Mystic"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.4}));
Jobs["Mystic"].levels.push(new JobLevel(20,  null, {"int" : 0.2, "spi" : 0.3}));
Jobs["Mystic"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.3, "cha" : 0.3}));
Jobs["Mystic"].levels.push(new JobLevel(80,  null, {"int" : 0.4}));
Jobs["Mystic"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.2, "spi" : 0.3}));
Jobs["Mystic"].levels.push(new JobLevel(320, null, {"int" : 0.2, "cha" : 0.2}));
Jobs["Mystic"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"}], {"int" : 0.3, "spi" : 0.3, "cha" : 0.4}));

Jobs["Corrupter"] = new Job("Corrupter");
Jobs["Corrupter"].preqs.push({job : Jobs["Acolyte"], lvl : 4} , {job : Jobs["Courtesan"], lvl : 5});
Jobs["Corrupter"].abilities.AddAbility(Abilities.Black.Shade);
Jobs["Corrupter"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.4}));
Jobs["Corrupter"].levels.push(new JobLevel(20,  null, {"int" : 0.2, "spi" : 0.3}));
Jobs["Corrupter"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.3, "cha" : 0.3}));
Jobs["Corrupter"].levels.push(new JobLevel(80,  null, {"int" : 0.4}));
Jobs["Corrupter"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.2, "spi" : 0.3}));
Jobs["Corrupter"].levels.push(new JobLevel(320, null, {"int" : 0.2, "cha" : 0.2}));
Jobs["Corrupter"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"} , {ab : Abilities.Black.Engulf, set: "Skills"}], {"int" : 0.3, "spi" : 0.3, "cha" : 0.4}));

Jobs["Harlot"] = new Job("Harlot");
Jobs["Harlot"].preqs.push({job : Jobs["Courtesan"], lvl : 6});
Jobs["Harlot"].abilities.AddAbility(Abilities.Seduction.Fantasize);
Jobs["Harlot"].abilities.AddAbility(Abilities.Seduction.Charm);
Jobs["Harlot"].abilities.AddAbility(Abilities.Seduction.Distract);
Jobs["Harlot"].abilities.AddAbility(Abilities.Seduction.Seduce);
Jobs["Harlot"].levels.push(new JobLevel(10,  [{ab: Abilities.Seduction.Fantasize, set: "Seduce"}], {"lib" : 0.2}));
Jobs["Harlot"].levels.push(new JobLevel(20,  null, {"lib" : 0.1, "cha" : 0.1}));
Jobs["Harlot"].levels.push(new JobLevel(40,  [{ab: Abilities.Seduction.Charm, set: "Seduce"}], {"lib" : 0.1, "dex" : 0.1}));
Jobs["Harlot"].levels.push(new JobLevel(80,  null, {"lib" : 0.2}));
Jobs["Harlot"].levels.push(new JobLevel(160, [{ab: Abilities.Seduction.Seduce, set: "Seduce"}], {"lib" : 0.1, "cha" : 0.1}));
Jobs["Harlot"].levels.push(new JobLevel(320, null, {"lib" : 0.1, "int" : 0.1}));
Jobs["Harlot"].levels.push(new JobLevel(640, [{ab: Abilities.Seduction.Distract, set: "Seduce"}], {"lib" : 0.2, "cha" : 0.2, "dex" : 0.2}));

////////////
// TIER 3 //
////////////



Jobs["Sage"] = new Job("Sage");
Jobs["Sage"].Unlocked = function() { return true; } // TODO Tier 3 condition
Jobs["Sage"].Long = function(entity) { return Text.Parse("The Sage has taken the first steps into exploring the raw power of the elements and the chaotic force of magic. While [heshe] has barely begun tapping [hisher] innate potential, the Sage already possesses a formidable destructive power.", {hisher: entity.hisher(), heshe: entity.heshe()}); }
Jobs["Sage"].preqs.push({job : Jobs["Mage"], lvl : 6});
Jobs["Sage"].abilities.AddAbility(Abilities.Black.Surge);
Jobs["Sage"].abilities.AddAbility(Abilities.Black.Fireball);
Jobs["Sage"].abilities.AddAbility(Abilities.Black.Freeze);
Jobs["Sage"].abilities.AddAbility(Abilities.Black.Bolt);
Jobs["Sage"].levels.push(new JobLevel(20,   [{ab: Abilities.Black.Surge, set: "Spells"}], {"int" : 0.3}));
Jobs["Sage"].levels.push(new JobLevel(40,   null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Sage"].levels.push(new JobLevel(80,   [{ab: Abilities.Black.Fireball, set: "Spells"}], {"int" : 0.2, "sta" : 0.1}));
Jobs["Sage"].levels.push(new JobLevel(160,  null, {"int" : 0.2, "cha" : 0.1}));
Jobs["Sage"].levels.push(new JobLevel(320,  [{ab: Abilities.Black.Freeze, set: "Spells"}], {"int" : 0.2, "dex" : 0.1}));
Jobs["Sage"].levels.push(new JobLevel(640,  null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Sage"].levels.push(new JobLevel(980, [{ab: Abilities.Black.Bolt, set: "Spells"}], {"int" : 0.4, "spi" : 0.1}));




// TODO: EXP 3 LEVEL
Jobs["Brawler"] = new Job("Brawler");
Jobs["Brawler"].Long = function(entity) { return Text.Parse("You slowly become more accustomed to your own strength and power and more likely to crush a rock with your bare hands", {hisher: entity.hisher(), heshe: entity.heshe()}); }
Jobs["Brawler"].Unlocked = function() { return true; } // TODO Tier 3 condition
Jobs["Brawler"].preqs.push({job : Jobs["Bruiser"], lvl : 6});
Jobs["Brawler"].abilities.AddAbility(Abilities.Physical.TAttack);
Jobs["Brawler"].abilities.AddAbility(Abilities.Physical.PileDriver);
Jobs["Brawler"].levels.push(new JobLevel(20,   null, {"str" : 0.51, "sta" : 0.42}));
Jobs["Brawler"].levels.push(new JobLevel(23, [{ab: Abilities.Physical.Taunt, set: "Skills"}], {"dex" : 0.3, "sta" : 0.4}));
Jobs["Brawler"].levels.push(new JobLevel(25,   null, {"str" : 0.49, "dex" : 0.345}));
Jobs["Brawler"].levels.push(new JobLevel(40,   null, {"sta" : 0.22, "dex" : 0.31}));
Jobs["Brawler"].levels.push(new JobLevel(50, [{ab: Abilities.Physical.GrandSlam, set: "Skills"}], {"str" : 0.4, "sta" : 0.3}));
Jobs["Brawler"].levels.push(new JobLevel(80,   null, {"str" : 0.42, "sta" : 0.413}));
Jobs["Brawler"].levels.push(new JobLevel(160,  null, {"sta" : 0.33}));
Jobs["Brawler"].levels.push(new JobLevel(240, [{ab: Abilities.Physical.FocusStrike, set: "Skills"}], {"dex" : 0.3, "str" : 0.3}));
Jobs["Brawler"].levels.push(new JobLevel(320,  null, {"str" : 0.4, "sta" : 0.51}));
Jobs["Brawler"].levels.push(new JobLevel(640,  null, {"sta" : 0.5, "dex" : 0.51}));
Jobs["Brawler"].levels.push(new JobLevel(980, null, {"str" : 0.3, "sta" : 0.63, "dex" : 0.51}));

Jobs["Apostle"] = new Job("Apostle");
Jobs["Apostle"].preqs.push({job : Jobs["Mystic"], lvl : 6});
Jobs["Apostle"].abilities.AddAbility(Abilities.Black.Glow);
Jobs["Apostle"].Long = function(entity) { return Text.Parse("You achieve a new level of enlightenment as you become more aware of the troubles around you, corruption has little affect on you as light now forms around you .", {hisher: entity.hisher(), HeShe: entity.HeShe()}); }
Jobs["Apostle"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.54}));
Jobs["Apostle"].levels.push(new JobLevel(20,  null, {"int" : 0.32, "spi" : 0.43}));
Jobs["Apostle"].levels.push(new JobLevel(30,  [{ab: Abilities.Black.Shimmer, set: "Skills"}], {"cha" : 0.654 , "spi" : 0.54}));
Jobs["Apostle"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.43, "cha" : 0.43}));
Jobs["Apostle"].levels.push(new JobLevel(80,  null, {"int" : 0.54}));
Jobs["Apostle"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.32, "spi" : 0.43}));
Jobs["Apostle"].levels.push(new JobLevel(320, null, {"int" : 0.2, "cha" : 0.2}));
Jobs["Apostle"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"}], {"int" : 0.3, "spi" : 0.3, "cha" : 0.4}));


Jobs["Defiler"] = new Job("Defiler");
Jobs["Defiler"].preqs.push({job : Jobs["Corrupter"], lvl : 8} , {job : Jobs["Harlot"], lvl : 8} , {job : Jobs["Scholar"], lvl : 8});
Jobs["Defiler"].abilities.AddAbility(Abilities.Black.Shade);
Jobs["Defiler"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.4}));
Jobs["Defiler"].levels.push(new JobLevel(20,  null, {"int" : 0.2, "spi" : 0.3}));
Jobs["Defiler"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.3, "cha" : 0.3}));
Jobs["Defiler"].levels.push(new JobLevel(80,  null, {"int" : 0.4}));
Jobs["Defiler"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.2, "spi" : 0.3}));
Jobs["Defiler"].levels.push(new JobLevel(320, null, {"int" : 0.2, "cha" : 0.2}));
Jobs["Defiler"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"} , {ab : Abilities.Black.Engulf, set: "Skills"}], {"int" : 0.3, "spi" : 0.3, "cha" : 0.4}));

Jobs["Whore"] = new Job("Whore");
Jobs["Whore"].preqs.push({job : Jobs["Harlot"], lvl : 6});
Jobs["Whore"].abilities.AddAbility(Abilities.Seduction.Fantasize);
Jobs["Whore"].abilities.AddAbility(Abilities.Seduction.Charm);
Jobs["Whore"].abilities.AddAbility(Abilities.Seduction.Distract);
Jobs["Whore"].abilities.AddAbility(Abilities.Seduction.Seduce);
Jobs["Whore"].levels.push(new JobLevel(10,  [{ab: Abilities.Seduction.Fantasize, set: "Seduce"}], {"lib" : 0.2}));
Jobs["Whore"].levels.push(new JobLevel(20,  null, {"lib" : 0.1, "cha" : 0.1}));
Jobs["Whore"].levels.push(new JobLevel(40,  [{ab: Abilities.Seduction.Charm, set: "Seduce"}], {"lib" : 0.1, "dex" : 0.1}));
Jobs["Whore"].levels.push(new JobLevel(80,  null, {"lib" : 0.2}));
Jobs["Whore"].levels.push(new JobLevel(160, [{ab: Abilities.Seduction.Seduce, set: "Seduce"}], {"lib" : 0.1, "cha" : 0.1}));
Jobs["Whore"].levels.push(new JobLevel(320, null, {"lib" : 0.1, "int" : 0.1}));
Jobs["Whore"].levels.push(new JobLevel(640, [{ab: Abilities.Seduction.Distract, set: "Seduce"}], {"lib" : 0.2, "cha" : 0.2, "dex" : 0.2}));


////////////
// TIER 4 //
////////////

Jobs["Fellatrix"] = new Job("Fellatrix");
Jobs["Fellatrix"].preqs.push({job : Jobs["Whore"], lvl : 6});
Jobs["Fellatrix"].abilities.AddAbility(Abilities.Seduction.Fantasize);
Jobs["Fellatrix"].abilities.AddAbility(Abilities.Seduction.Charm);
Jobs["Fellatrix"].abilities.AddAbility(Abilities.Seduction.Distract);
Jobs["Fellatrix"].abilities.AddAbility(Abilities.Seduction.Seduce);
Jobs["Fellatrix"].levels.push(new JobLevel(10,  [{ab: Abilities.Seduction.Fantasize, set: "Seduce"}], {"lib" : 0.2}));
Jobs["Fellatrix"].levels.push(new JobLevel(20,  null, {"lib" : 0.1, "cha" : 0.1}));
Jobs["Fellatrix"].levels.push(new JobLevel(40,  [{ab: Abilities.Seduction.Charm, set: "Seduce"}], {"lib" : 0.1, "dex" : 0.1}));
Jobs["Fellatrix"].levels.push(new JobLevel(80,  null, {"lib" : 0.2}));
Jobs["Fellatrix"].levels.push(new JobLevel(160, [{ab: Abilities.Seduction.Seduce, set: "Seduce"}], {"lib" : 0.1, "cha" : 0.1}));
Jobs["Fellatrix"].levels.push(new JobLevel(320, null, {"lib" : 0.1, "int" : 0.1}));
Jobs["Fellatrix"].levels.push(new JobLevel(640, [{ab: Abilities.Seduction.Distract, set: "Seduce"}], {"lib" : 0.2, "cha" : 0.2, "dex" : 0.2}));


Jobs["Violator"] = new Job("Violator");
Jobs["Violator"].preqs.push({job : Jobs["Defiler"], lvl : 8} , {job : Jobs["Whore"], lvl : 8} , {job : Jobs["Mage"], lvl : 8});
Jobs["Violator"].abilities.AddAbility(Abilities.Black.Shade);
Jobs["Violator"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.4}));
Jobs["Violator"].levels.push(new JobLevel(20,  null, {"int" : 0.2, "spi" : 0.3}));
Jobs["Violator"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.3, "cha" : 0.3}));
Jobs["Violator"].levels.push(new JobLevel(80,  null, {"int" : 0.4}));
Jobs["Violator"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.2, "spi" : 0.3}));
Jobs["Violator"].levels.push(new JobLevel(320, null, {"int" : 0.2, "cha" : 0.2}));
Jobs["Violator"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"} , {ab : Abilities.Black.Engulf, set: "Skills"}], {"int" : 0.3, "spi" : 0.3, "cha" : 0.4}));



Jobs["Hermit"] = new Job("Hermit");
Jobs["Hermit"].Unlocked = function() { return true; } // TODO Tier 3 condition
Jobs["Hermit"].Long = function(entity) { return Text.Parse("The Hermit has taken the first steps into exploring the raw power of the elements and the chaotic force of magic. While [heshe] has barely begun tapping [hisher] innate potential, the Hermit already possesses a formidable destructive power.", {hisher: entity.hisher(), heshe: entity.heshe()}); }
Jobs["Hermit"].preqs.push({job : Jobs["Sage"], lvl : 6});
Jobs["Hermit"].abilities.AddAbility(Abilities.Black.Surge);
Jobs["Hermit"].abilities.AddAbility(Abilities.Black.Fireball);
Jobs["Hermit"].abilities.AddAbility(Abilities.Black.Freeze);
Jobs["Hermit"].abilities.AddAbility(Abilities.Black.Bolt);
Jobs["Hermit"].levels.push(new JobLevel(20,   [{ab: Abilities.Black.Surge, set: "Spells"}], {"int" : 0.3}));
Jobs["Hermit"].levels.push(new JobLevel(40,   null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Hermit"].levels.push(new JobLevel(80,   [{ab: Abilities.Black.Fireball, set: "Spells"}], {"int" : 0.2, "sta" : 0.1}));
Jobs["Hermit"].levels.push(new JobLevel(160,  null, {"int" : 0.2, "cha" : 0.1}));
Jobs["Hermit"].levels.push(new JobLevel(320,  [{ab: Abilities.Black.Freeze, set: "Spells"}], {"int" : 0.2, "dex" : 0.1}));
Jobs["Hermit"].levels.push(new JobLevel(640,  null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Hermit"].levels.push(new JobLevel(980, [{ab: Abilities.Black.Bolt, set: "Spells"}], {"int" : 0.4, "spi" : 0.1}));



Jobs["Saint"] = new Job("Saint");
Jobs["Saint"].preqs.push({job : Jobs["Apostle"], lvl : 8});
Jobs["Saint"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.4}));
Jobs["Saint"].levels.push(new JobLevel(20,  null, {"int" : 0.2, "spi" : 0.3}));
Jobs["Saint"].levels.push(new JobLevel(30,  [{ab: Abilities.Black.Shimmer, set: "Skills"}], {"cha" : 0.54 , "spi" : 0.4}));
Jobs["Saint"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.3, "cha" : 0.3}));
Jobs["Saint"].levels.push(new JobLevel(80,  null, {"int" : 0.4}));
Jobs["Saint"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.2, "spi" : 0.3}));
Jobs["Saint"].levels.push(new JobLevel(320, null, {"int" : 0.2, "cha" : 0.2}));
Jobs["Saint"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"}], {"int" : 0.3, "spi" : 0.3, "cha" : 0.4}));



// TODO: EXP 4 LEVEL
Jobs["Gladiator"] = new Job("Gladiator");
Jobs["Gladiator"].Unlocked = function() { return true; } // TODO Tier 4 condition
Jobs["Gladiator"].preqs.push({job : Jobs["Brawler"], lvl : 8});
Jobs["Gladiator"].abilities.AddAbility(Abilities.Physical.QAttack);
Jobs["Gladiator"].levels.push(new JobLevel(20,   null, {"str" : 0.75, "sta" : 0.47}));
Jobs["Gladiator"].levels.push(new JobLevel(40,   null, {"sta" : 0.32, "dex" : 0.38}));
Jobs["Gladiator"].levels.push(new JobLevel(80,   null, {"str" : 0.52, "sta" : 0.483}));
Jobs["Gladiator"].levels.push(new JobLevel(160,  null, {"sta" : 0.38}));
Jobs["Gladiator"].levels.push(new JobLevel(320,  null, {"str" : 0.49, "sta" : 0.58}));
Jobs["Gladiator"].levels.push(new JobLevel(640,  null, {"sta" : 0.55, "dex" : 0.57}));
Jobs["Gladiator"].levels.push(new JobLevel(980, null, {"str" : 0.39, "sta" : 0.69, "dex" : 0.51}));

////////////
// TIER 5 //
////////////



Jobs["Merlin"] = new Job("Merlin");
Jobs["Merlin"].Unlocked = function() { return true; } // TODO Tier 3 condition
Jobs["Merlin"].Long = function(entity) { return Text.Parse("The Merlin has taken the first steps into exploring the raw power of the elements and the chaotic force of magic. While [heshe] has barely begun tapping [hisher] innate potential, the Merlin already possesses a formidable destructive power.", {hisher: entity.hisher(), heshe: entity.heshe()}); }
Jobs["Merlin"].preqs.push({job : Jobs["Hermit"], lvl : 8});
Jobs["Merlin"].abilities.AddAbility(Abilities.Black.Surge);
Jobs["Merlin"].abilities.AddAbility(Abilities.Black.Fireball);
Jobs["Merlin"].abilities.AddAbility(Abilities.Black.Freeze);
Jobs["Merlin"].abilities.AddAbility(Abilities.Black.Bolt);
Jobs["Merlin"].levels.push(new JobLevel(20,   [{ab: Abilities.Black.Surge, set: "Spells"}], {"int" : 0.3}));
Jobs["Merlin"].levels.push(new JobLevel(40,   null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Merlin"].levels.push(new JobLevel(80,   [{ab: Abilities.Black.Fireball, set: "Spells"}], {"int" : 0.2, "sta" : 0.1}));
Jobs["Merlin"].levels.push(new JobLevel(160,  null, {"int" : 0.2, "cha" : 0.1}));
Jobs["Merlin"].levels.push(new JobLevel(320,  [{ab: Abilities.Black.Freeze, set: "Spells"}], {"int" : 0.2, "dex" : 0.1}));
Jobs["Merlin"].levels.push(new JobLevel(640,  null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Merlin"].levels.push(new JobLevel(980, [{ab: Abilities.Black.Bolt, set: "Spells"}], {"int" : 0.4, "spi" : 0.1}));


Jobs["Breeder"] = new Job("Breeder");
Jobs["Breeder"].preqs.push({job : Jobs["Fellatrix"], lvl : 8});
Jobs["Breeder"].abilities.AddAbility(Abilities.Seduction.Fantasize);
Jobs["Breeder"].abilities.AddAbility(Abilities.Seduction.Charm);
Jobs["Breeder"].abilities.AddAbility(Abilities.Seduction.Distract);
Jobs["Breeder"].abilities.AddAbility(Abilities.Seduction.Seduce);
Jobs["Breeder"].levels.push(new JobLevel(10,  [{ab: Abilities.Seduction.Fantasize, set: "Seduce"}], {"lib" : 0.2}));
Jobs["Breeder"].levels.push(new JobLevel(20,  null, {"lib" : 0.1, "cha" : 0.1}));
Jobs["Breeder"].levels.push(new JobLevel(40,  [{ab: Abilities.Seduction.Charm, set: "Seduce"}], {"lib" : 0.1, "dex" : 0.1}));
Jobs["Breeder"].levels.push(new JobLevel(80,  null, {"lib" : 0.2}));
Jobs["Breeder"].levels.push(new JobLevel(160, [{ab: Abilities.Seduction.Seduce, set: "Seduce"}], {"lib" : 0.1, "cha" : 0.1}));
Jobs["Breeder"].levels.push(new JobLevel(320, null, {"lib" : 0.1, "int" : 0.1}));
Jobs["Breeder"].levels.push(new JobLevel(640, [{ab: Abilities.Seduction.Distract, set: "Seduce"}], {"lib" : 0.2, "cha" : 0.2, "dex" : 0.2}));


Jobs["Sinner"] = new Job("Sinner");
Jobs["Sinner"].preqs.push({job : Jobs["Violator"], lvl : 8} , {job : Jobs["Fellatrix"], lvl : 8} , {job : Jobs["Hermit"], lvl : 8});
Jobs["Sinner"].abilities.AddAbility(Abilities.Black.Shade);
Jobs["Sinner"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.4}));
Jobs["Sinner"].levels.push(new JobLevel(20,  null, {"int" : 0.2, "spi" : 0.3}));
Jobs["Sinner"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.3, "cha" : 0.3}));
Jobs["Sinner"].levels.push(new JobLevel(80,  null, {"int" : 0.4}));
Jobs["Sinner"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.2, "spi" : 0.3}));
Jobs["Sinner"].levels.push(new JobLevel(320, null, {"int" : 0.2, "cha" : 0.2}));
Jobs["Sinner"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"} , {ab : Abilities.Black.Engulf, set: "Skills"}], {"int" : 0.3, "spi" : 0.3, "cha" : 0.4}));





Jobs["Sacredkin"] = new Job("Sacredkin");
Jobs["Sacredkin"].preqs.push({job : Jobs["Saint"], lvl : 8});
Jobs["Sacredkin"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.4}));
Jobs["Sacredkin"].levels.push(new JobLevel(20,  null, {"int" : 0.2, "spi" : 0.3}));
Jobs["Sacredkin"].levels.push(new JobLevel(30,  [{ab: Abilities.Black.Shimmer, set: "Skills"}], {"cha" : 0.54 , "spi" : 0.4}));
Jobs["Sacredkin"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.3, "cha" : 0.3}));
Jobs["Sacredkin"].levels.push(new JobLevel(80,  null, {"int" : 0.4}));
Jobs["Sacredkin"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.2, "spi" : 0.3}));
Jobs["Sacredkin"].levels.push(new JobLevel(320, null, {"int" : 0.2, "cha" : 0.2}));
Jobs["Sacredkin"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"}], {"int" : 0.3, "spi" : 0.3, "cha" : 0.4}));



// TODO: EXP 5 LEVEL
Jobs["Hero"] = new Job("Hero");
Jobs["Hero"].Unlocked = function() { return true; } // TODO Tier 5 condition
Jobs["Hero"].preqs.push({job : Jobs["Gladiator"], lvl : 8});
Jobs["Hero"].abilities.AddAbility(Abilities.Physical.Foblivion);

Jobs["Hero"].levels.push(new JobLevel(20,   null, {"str" : 0.9, "sta" : 0.47}));
Jobs["Hero"].levels.push(new JobLevel(40,   null, {"sta" : 0.52, "dex" : 0.48}));
Jobs["Hero"].levels.push(new JobLevel(80,   null, {"str" : 0.72, "sta" : 0.583}));
Jobs["Hero"].levels.push(new JobLevel(160,  null, {"sta" : 0.58}));
Jobs["Hero"].levels.push(new JobLevel(320,  null, {"str" : 0.59, "sta" : 0.68}));
Jobs["Hero"].levels.push(new JobLevel(640,  null, {"sta" : 0.65, "dex" : 0.67}));
Jobs["Hero"].levels.push(new JobLevel(980, null, {"str" : 0.49, "sta" : 0.79, "dex" : 0.61}));



////////////
// TIER 6 //
////////////

Jobs["Sorcerer"] = new Job("Sorcerer");
Jobs["Sorcerer"].Unlocked = function() { return true; } // TODO Tier 3 condition
Jobs["Sorcerer"].Long = function(entity) { return Text.Parse("The Sorcerer has taken the first steps into exploring the raw power of the elements and the chaotic force of magic. While [heshe] has barely begun tapping [hisher] innate potential, the Sorcerer already possesses a formidable destructive power.", {hisher: entity.hisher(), heshe: entity.heshe()}); }
Jobs["Sorcerer"].preqs.push({job : Jobs["Merlin"], lvl : 8});
Jobs["Sorcerer"].abilities.AddAbility(Abilities.Black.Surge);
Jobs["Sorcerer"].abilities.AddAbility(Abilities.Black.Fireball);
Jobs["Sorcerer"].abilities.AddAbility(Abilities.Black.Freeze);
Jobs["Sorcerer"].abilities.AddAbility(Abilities.Black.Bolt);
Jobs["Sorcerer"].levels.push(new JobLevel(20,   [{ab: Abilities.Black.Surge, set: "Spells"}], {"int" : 0.3}));
Jobs["Sorcerer"].levels.push(new JobLevel(40,   null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Sorcerer"].levels.push(new JobLevel(80,   [{ab: Abilities.Black.Fireball, set: "Spells"}], {"int" : 0.2, "sta" : 0.1}));
Jobs["Sorcerer"].levels.push(new JobLevel(160,  null, {"int" : 0.2, "cha" : 0.1}));
Jobs["Sorcerer"].levels.push(new JobLevel(320,  [{ab: Abilities.Black.Freeze, set: "Spells"}], {"int" : 0.2, "dex" : 0.1}));
Jobs["Sorcerer"].levels.push(new JobLevel(640,  null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Sorcerer"].levels.push(new JobLevel(980, [{ab: Abilities.Black.Bolt, set: "Spells"}], {"int" : 0.4, "spi" : 0.1}));

Jobs["Broodmother"] = new Job("Broodmother");
Jobs["Broodmother"].preqs.push({job : Jobs["Breeder"], lvl : 8});
Jobs["Broodmother"].abilities.AddAbility(Abilities.Seduction.Fantasize);
Jobs["Broodmother"].abilities.AddAbility(Abilities.Seduction.Charm);
Jobs["Broodmother"].abilities.AddAbility(Abilities.Seduction.Distract);
Jobs["Broodmother"].abilities.AddAbility(Abilities.Seduction.Seduce);
Jobs["Broodmother"].levels.push(new JobLevel(10,  [{ab: Abilities.Seduction.Fantasize, set: "Seduce"}], {"lib" : 0.2}));
Jobs["Broodmother"].levels.push(new JobLevel(20,  null, {"lib" : 0.1, "cha" : 0.1}));
Jobs["Broodmother"].levels.push(new JobLevel(40,  [{ab: Abilities.Seduction.Charm, set: "Seduce"}], {"lib" : 0.1, "dex" : 0.1}));
Jobs["Broodmother"].levels.push(new JobLevel(80,  null, {"lib" : 0.2}));
Jobs["Broodmother"].levels.push(new JobLevel(160, [{ab: Abilities.Seduction.Seduce, set: "Seduce"}], {"lib" : 0.1, "cha" : 0.1}));
Jobs["Broodmother"].levels.push(new JobLevel(320, null, {"lib" : 0.1, "int" : 0.1}));
Jobs["Broodmother"].levels.push(new JobLevel(640, [{ab: Abilities.Seduction.Distract, set: "Seduce"}], {"lib" : 0.2, "cha" : 0.2, "dex" : 0.2}));

Jobs["Hellspawn"] = new Job("Hellspawn");
Jobs["Hellspawn"].preqs.push({job : Jobs["Sinner"], lvl : 8} , {job : Jobs["Breeder"], lvl : 8} , {job : Jobs["Merlin"], lvl : 8});
Jobs["Hellspawn"].abilities.AddAbility(Abilities.Black.Shade);
Jobs["Hellspawn"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.4}));
Jobs["Hellspawn"].levels.push(new JobLevel(20,  null, {"int" : 0.2, "spi" : 0.3}));
Jobs["Hellspawn"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.3, "cha" : 0.3}));
Jobs["Hellspawn"].levels.push(new JobLevel(80,  null, {"int" : 0.4}));
Jobs["Hellspawn"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.2, "spi" : 0.3}));
Jobs["Hellspawn"].levels.push(new JobLevel(320, null, {"int" : 0.2, "cha" : 0.2}));
Jobs["Hellspawn"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"} , {ab : Abilities.Black.Engulf, set: "Skills"}], {"int" : 0.3, "spi" : 0.3, "cha" : 0.4}));




Jobs["Angel"] = new Job("Angel");
Jobs["Angel"].preqs.push({job : Jobs["Sacredkin"], lvl : 8});
Jobs["Angel"].abilities.AddAbility(Abilities.Black.CTitan);
Jobs["Angel"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.4}));
Jobs["Angel"].levels.push(new JobLevel(20,  null, {"int" : 0.2, "spi" : 0.3}));
Jobs["Angel"].levels.push(new JobLevel(30,  [{ab: Abilities.Black.Shimmer, set: "Skills"}], {"cha" : 0.54 , "spi" : 0.4}));
Jobs["Angel"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.3, "cha" : 0.3}));
Jobs["Angel"].levels.push(new JobLevel(80,  null, {"int" : 0.4}));
Jobs["Angel"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.2, "spi" : 0.3}));
Jobs["Angel"].levels.push(new JobLevel(320, null, {"int" : 0.2, "cha" : 0.2}));
Jobs["Angel"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"}], {"int" : 0.3, "spi" : 0.3, "cha" : 0.4}));


// TODO: EXP 6 LEVEL
Jobs["Champion"] = new Job("Champion");
Jobs["Champion"].Unlocked = function() { return true; } // TODO Tier 6 condition
Jobs["Champion"].preqs.push({job : Jobs["Hero"], lvl : 8});
Jobs["Champion"].abilities.AddAbility(Abilities.Physical.PileDriver);

Jobs["Champion"].levels.push(new JobLevel(20,   null, {"str" : 1.5, "sta" : 0.67}));
Jobs["Champion"].levels.push(new JobLevel(40,   null, {"sta" : 0.62, "dex" : 0.68}));
Jobs["Champion"].levels.push(new JobLevel(80,   null, {"str" : 0.82, "sta" : 0.683}));
Jobs["Champion"].levels.push(new JobLevel(160,  null, {"sta" : 0.68}));
Jobs["Champion"].levels.push(new JobLevel(320,  null, {"str" : 0.79, "sta" : 0.88}));
Jobs["Champion"].levels.push(new JobLevel(640,  null, {"sta" : 0.75, "dex" : 0.77}));
Jobs["Champion"].levels.push(new JobLevel(980, null, {"str" : 0.69, "sta" : 0.89, "dex" : 0.81}));



