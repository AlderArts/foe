
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
	if(this.level      != 1) storage["lvl"] = Math.floor(this.level);
	if(this.experience != 0) storage["exp"] = Math.floor(this.experience);
	return storage;
}
JobDesc.prototype.FromStorage = function(storage) {
	if(storage) {
		this.level      = parseInt(storage["lvl"]) || this.level;
		this.experience = parseInt(storage["exp"]) || this.experience;
	}
}

Job.prototype.AddExp = function(entity, exp, reserve) {
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
			if(bonus["lib"]) { entity.libido.growth     += bonus["lib"]; Text.Add("Lib+" + (bonus["lib"] * 10) + "<br/>"); }
			if(bonus["cha"]) { entity.charisma.growth       += bonus["cha"]; Text.Add("Cha+" + (bonus["cha"] * 10) + "<br/>"); }
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
	Courtesan : 2
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
Jobs["Bruiser"].Long = function(entity) { return Text.Parse("The bruiser is all about brute strength, a can prove to be quite a fearsome warrior. [HeShe] can dish out a large amount of damage, but fares badly against quick, evasive foes.", {hisher: entity.hisher(), HeShe: entity.HeShe()}); }
Jobs["Bruiser"].Unlocked = function(entity) {
	if(entity == miranda) return true;
	return false;
} // TODO Tier 2 condition
Jobs["Bruiser"].preqs.push({job : Jobs["Fighter"], lvl : 3});
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.Provoke);
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.FocusStrike);
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.TAttack);
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.GrandSlam);
Jobs["Bruiser"].levels.push(new JobLevel(20,   [{ab: Abilities.Physical.Provoke, set: "Skills"}], {"str" : 0.1, "sta" : 0.2}));
Jobs["Bruiser"].levels.push(new JobLevel(40,   null, {"sta" : 0.2, "dex" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(80,   [{ab: Abilities.Physical.FocusStrike, set: "Skills"}], {"str" : 0.2, "sta" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(160,  null, {"sta" : 0.3}));
Jobs["Bruiser"].levels.push(new JobLevel(320,  [{ab: Abilities.Physical.TAttack, set: "Skills"}], {"str" : 0.2, "sta" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(640,  null, {"sta" : 0.2, "dex" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(1280, [{ab: Abilities.Physical.GrandSlam, set: "Skills"}], {"str" : 0.1, "sta" : 0.3, "dex" : 0.1}));

Jobs["Rogue"] = new Job("Rogue");
Jobs["Rogue"].Long = function(entity) { return Text.Parse("The rogue fights dirty, using any trick or scheme to deal decisive damage to [hisher] enemies. [HeShe] can deal large amounts of damage against distracted opponents.", {hisher: entity.hisher(), HeShe: entity.HeShe()}); }
Jobs["Rogue"].Unlocked = function(entity) {
	if(entity == terry) return true;
	return (cale.flags["Rogue"]  == Cale.Rogue.Taught) ||
	       (terry.flags["Rogue"] == Terry.Rogue.Taught);
}
Jobs["Rogue"].preqs.push({job : Jobs["Fighter"], lvl : 3});
Jobs["Rogue"].abilities.AddAbility(Abilities.Physical.DirtyBlow);
Jobs["Rogue"].abilities.AddAbility(Abilities.Physical.Kicksand);
Jobs["Rogue"].abilities.AddAbility(Abilities.Physical.Swift);
Jobs["Rogue"].abilities.AddAbility(Abilities.Physical.Backstab);
Jobs["Rogue"].levels.push(new JobLevel(20,   [{ab: Abilities.Physical.DirtyBlow, set: "Skills"}], {"dex" : 0.3}));
Jobs["Rogue"].levels.push(new JobLevel(40,   null, {"dex" : 0.2, "int" : 0.1}));
Jobs["Rogue"].levels.push(new JobLevel(80,   [{ab: Abilities.Physical.Kicksand, set: "Skills"}], {"cha" : 0.2, "lib" : 0.1}));
Jobs["Rogue"].levels.push(new JobLevel(160,  null, {"dex" : 0.3}));
Jobs["Rogue"].levels.push(new JobLevel(320,  [{ab: Abilities.Physical.Swift, set: "Support"}], {"dex" : 0.2, "str" : 0.1}));
Jobs["Rogue"].levels.push(new JobLevel(640,  null, {"dex" : 0.2, "int" : 0.1}));
Jobs["Rogue"].levels.push(new JobLevel(1280, [{ab: Abilities.Physical.Backstab, set: "Skills"}], {"dex" : 0.3, "int" : 0.1, "cha" : 0.1}));

Jobs["Ranger"] = new Job("Ranger");
Jobs["Ranger"].Long = function(entity) { return Text.Parse("The ranger is a skilled hunter, well versed in ways to ensnare and distract [hisher] prey.", {hisher: entity.hisher(), HeShe: entity.HeShe()}); }
Jobs["Ranger"].Unlocked = function(entity) {
	return (estevan.flags["Ranger"] >= Estevan.Ranger.Taught); //TODO Maria?
}
Jobs["Ranger"].preqs.push({job : Jobs["Fighter"], lvl : 3});
Jobs["Ranger"].abilities.AddAbility(Abilities.Physical.Ensnare);
Jobs["Ranger"].abilities.AddAbility(Abilities.Physical.FocusStrike);
Jobs["Ranger"].abilities.AddAbility(Abilities.Physical.Hamstring);
Jobs["Ranger"].abilities.AddAbility(Abilities.Physical.SetTrap);
Jobs["Ranger"].levels.push(new JobLevel(20,   [{ab: Abilities.Physical.Ensnare, set: "Skills"}], {"dex" : 0.2, "spi" : 0.1}));
Jobs["Ranger"].levels.push(new JobLevel(40,   null, {"sta" : 0.1, "dex" : 0.2}));
Jobs["Ranger"].levels.push(new JobLevel(80,   [{ab: Abilities.Physical.FocusStrike, set: "Skills"}], {"int" : 0.2, "dex" : 0.1}));
Jobs["Ranger"].levels.push(new JobLevel(160,  null, {"dex" : 0.3}));
Jobs["Ranger"].levels.push(new JobLevel(320,  [{ab: Abilities.Physical.Hamstring, set: "Skills"}], {"int" : 0.1, "sta" : 0.2}));
Jobs["Ranger"].levels.push(new JobLevel(640,  null, {"spi" : 0.2, "dex" : 0.1}));
Jobs["Ranger"].levels.push(new JobLevel(1280, [{ab: Abilities.Physical.SetTrap, set: "Skills"}], {"int" : 0.1, "sta" : 0.1, "dex" : 0.3}));


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
Jobs["Mage"].levels.push(new JobLevel(1280, [{ab: Abilities.Black.Bolt, set: "Spells"}], {"int" : 0.4, "spi" : 0.1}));
Jobs["Mage"].Unlocked = function(entity) {
	return gameCache.flags["LearnedMagic"] >= 1;
}

Jobs["Mystic"] = new Job("Mystic");
Jobs["Mystic"].Long = function(entity) { return Text.Parse("The mystic takes the first steps in mastering the  power of nature, commanding water and plants to bend to [hisher] will.", {hisher: entity.hisher()}); }
Jobs["Mystic"].preqs.push({job : Jobs["Scholar"], lvl : 3});
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Thorn);
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Spray);
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Spire);
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Gust);
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Venom);
Jobs["Mystic"].levels.push(new JobLevel(20,   [{ab: Abilities.Black.Thorn, set: "Spells"}], {"sta" : 0.3}));
Jobs["Mystic"].levels.push(new JobLevel(40,   null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Mystic"].levels.push(new JobLevel(80,   [{ab: Abilities.Black.Spray, set: "Spells"}], {"spi" : 0.3}));
Jobs["Mystic"].levels.push(new JobLevel(160,  null, {"sta" : 0.2, "spi" : 0.1}));
Jobs["Mystic"].levels.push(new JobLevel(320,  [{ab: Abilities.Black.Spire, set: "Spells"}], {"int" : 0.2, "str" : 0.1}));
Jobs["Mystic"].levels.push(new JobLevel(640,  [{ab: Abilities.Black.Gust, set: "Spells"}], {"int" : 0.1, "lib" : 0.2}));
Jobs["Mystic"].levels.push(new JobLevel(1280, [{ab: Abilities.Black.Venom, set: "Spells"}], {"spi" : 0.4, "sta" : 0.1}));
Jobs["Mystic"].Unlocked = function(entity) {
	return gameCache.flags["LearnedMagic"] >= 1;
}

Jobs["Healer"] = new Job("Healer");
Jobs["Healer"].Long = function(entity) { return Text.Parse("A proficient healer knows the bare essentials of caring for the wounded in [hisher] party, keeping them alive in any and all situations. [HisHer] healing hands can ease the pain of minor wounds and nurse people back to health.", {hisher: entity.hisher(), HisHer: entity.HisHer()}); }
Jobs["Healer"].preqs.push({job : Jobs["Scholar"], lvl : 3});
Jobs["Healer"].abilities.AddAbility(Abilities.White.Detox);
Jobs["Healer"].abilities.AddAbility(Abilities.White.Cool);
Jobs["Healer"].abilities.AddAbility(Abilities.White.Warm);
Jobs["Healer"].abilities.AddAbility(Abilities.White.Heal);
Jobs["Healer"].levels.push(new JobLevel(20,   [{ab: Abilities.White.Detox, set: "Support"}], {"spi" : 0.3}));
Jobs["Healer"].levels.push(new JobLevel(40,   null, {"int" : 0.2, "cha" : 0.1}));
Jobs["Healer"].levels.push(new JobLevel(80,   [{ab: Abilities.White.Cool, set: "Support"}], {"sta" : 0.2, "spi" : 0.1}));
Jobs["Healer"].levels.push(new JobLevel(160,  null, {"spi" : 0.2, "int" : 0.1}));
Jobs["Healer"].levels.push(new JobLevel(320,  [{ab: Abilities.White.Warm, set: "Support"}], {"int" : 0.3}));
Jobs["Healer"].levels.push(new JobLevel(640,  null, {"cha" : 0.2, "sta" : 0.1}));
Jobs["Healer"].levels.push(new JobLevel(1280, [{ab: Abilities.White.Heal, set: "Support"}], {"spi" : 0.4, "int" : 0.1}));
Jobs["Healer"].Unlocked = function(entity) {
	return gameCache.flags["LearnedMagic"] >= 1;
}

////////////
// TIER 3 //
////////////

Jobs["Elementalist"] = new Job("Elementalist");
//TODO
Jobs["Elementalist"].Long = function(entity) { return Text.Parse("", {hisher: entity.hisher(), HisHer: entity.HisHer()}); }
Jobs["Elementalist"].preqs.push({job : Jobs["Mage"], lvl : 3});
//TODO
Jobs["Elementalist"].abilities.AddAbility(Abilities.White.Heal);
Jobs["Elementalist"].levels.push(new JobLevel(20,   null, {"str" : 0.2}));
Jobs["Elementalist"].levels.push(new JobLevel(40,   null, {"str" : 0.2}));
//TODO
Jobs["Elementalist"].levels.push(new JobLevel(80,   [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.1, "dex" : 0.1}));
Jobs["Elementalist"].levels.push(new JobLevel(160,  null, {"str" : 0.2}));
Jobs["Elementalist"].levels.push(new JobLevel(320,  null, {"str" : 0.2}));
Jobs["Elementalist"].levels.push(new JobLevel(640,  null, {"str" : 0.2}));
Jobs["Elementalist"].levels.push(new JobLevel(1280, null, {"str" : 0.2}));
Jobs["Elementalist"].Unlocked = function(entity) {
	return gameCache.flags["LearnedMagic"] >= 3;
}

////////////
// TIER 4 //
////////////


////////////
// TIER 5 //
////////////


////////////
// TIER 6 //
////////////


