
import { AbilityCollection } from './ability';
import { Abilities } from './abilities';
import { Entity } from './entity';
import { Text } from './text';
import { GAME } from './GAME';
import { MirandaFlags } from './event/miranda-flags';
import { CaleFlags } from './event/nomads/cale-flags';
import { TerryFlags } from './event/terry-flags';
import { EstevanFlags } from './event/nomads/estevan-flags';
import { CvetaFlags } from './event/outlaws/cveta-flags';
import { MariaFlags } from './event/outlaws/maria-flags';
import { GlobalScenes } from './event/global';

let Jobs : any = {};

export class Job {
	name : string;
	levels : any[];
	preqs : any[];
	abilities : AbilityCollection;

	constructor(name : string) {
		this.name   = name;
		this.levels = []; // JobLevel elements
		this.preqs  = []; // Pairs of {job : Jobs["Fighter"], lvl : 3} etc
		this.abilities = new AbilityCollection("Job"); // Contains abilities available when job is used
	}
	
	Short(entity : Entity) {
		return this.name;
	}
	Unlocked(entity : Entity) {
		return true;
	}

	AddExp(entity : Entity, exp? : number, reserve? : boolean) {
		// Check for null arguments and broken links
		if(entity == null) return;
		let jd = entity.jobs[this.name];
		if(jd == null) return;
		exp = exp || 0;
		// Check for maxed out job
		let newLevel = this.levels[jd.level-1];
		if(newLevel == null) return;
		let toLevel = newLevel.expToLevel;
		if(toLevel == null) return;
		toLevel *= jd.mult;
		
		// Add xp to pool
		jd.experience += exp;
		// Loop until xp isn't higher than xp to level
		while(jd.experience >= toLevel) {
			// Reduce pool by level
			jd.experience -= toLevel;
			// Save skills/bonuses gained
			let skills = newLevel.skills;
			let bonus  = newLevel.bonus;
			let func   = newLevel.func;
			// Increase level
			jd.level++;
			
			let parse : any = {
				name : entity.NameDesc(),
				is   : entity.is(),
				lvl  : jd.level,
				job  : this.Short(entity),
				s    : entity.plural() ? "" : "s",
				has  : entity.has()
			};
			Text.NL();
			Text.Add("[name] [is] now a level [lvl] [job]!<br>", parse, 'bold');
			// Teach new skills
			if(skills) {
				// [ { ab: Ablities.Black.Fireball, set: "Spells" }, ... ]
				for(let i = 0; i < skills.length; i++) {
					let sd      = skills[i];
					let ability = sd.ab;
					let set     = sd.set;
					
					parse["ability"] = ability.name;
					
					if(!entity.abilities[set].HasAbility(ability)) {
						Text.Add("[name] [has] mastered [ability]!<br>", parse, 'bold');
					}
					entity.abilities[set].AddAbility(ability);
				}
			}
			// Apply bonuses
			if(bonus) {
				if(bonus["hp"])  { entity.maxHp.growth        += bonus["hp"];  Text.Add("HP+"   + (bonus["hp"]  /  5) + "<br>"); }
				if(bonus["sp"])  { entity.maxSp.growth        += bonus["sp"];  Text.Add("SP+"   + (bonus["sp"]  /  5) + "<br>"); }
				if(bonus["lp"])  { entity.maxLust.growth      += bonus["lp"];  Text.Add("Lust+" + (bonus["lp"]  /  5) + "<br>"); }
				if(bonus["str"]) { entity.strength.growth     += bonus["str"]; Text.Add("Str+"  + (bonus["str"] * 10) + "<br>"); }
				if(bonus["sta"]) { entity.stamina.growth      += bonus["sta"]; Text.Add("Sta+"  + (bonus["sta"] * 10) + "<br>"); }
				if(bonus["dex"]) { entity.dexterity.growth    += bonus["dex"]; Text.Add("Dex+"  + (bonus["dex"] * 10) + "<br>"); }
				if(bonus["int"]) { entity.intelligence.growth += bonus["int"]; Text.Add("Int+"  + (bonus["int"] * 10) + "<br>"); }
				if(bonus["spi"]) { entity.spirit.growth       += bonus["spi"]; Text.Add("Spi+"  + (bonus["spi"] * 10) + "<br>"); }
				if(bonus["lib"]) { entity.libido.growth       += bonus["lib"]; Text.Add("Lib+"  + (bonus["lib"] * 10) + "<br>"); }
				if(bonus["cha"]) { entity.charisma.growth     += bonus["cha"]; Text.Add("Cha+"  + (bonus["cha"] * 10) + "<br>"); }
				entity.SetLevelBonus();
			}
			// Apply special functions
			if(func) func(entity);
			// Prepare for checking next level
			newLevel = this.levels[jd.level-1];
			if(newLevel == null) { break; }
			toLevel = newLevel.expToLevel;
			if(toLevel == null) {
				jd.experience = 0;
				Text.Add("[name] [is] now a master [job]!", parse, 'bold');
				Text.NL();
				break;
			}
			toLevel *= jd.mult;
		}
		
		Text.Flush();
	}
	// Returns true if job is mastered
	Master(entity : Entity) {
		// Check for null references
		if(entity == null) return false;
		let jd = entity.jobs[this.name];
		if(jd == null) return false;
		// Check if current level is same or higher than max level
		return (jd.level > this.levels.length);
	}

	Available(entity : Entity) {
		if(entity == null) return false;
		
		for(let i = 0; i < this.preqs.length; i++) {
			// Pairs of {job : Jobs["Fighter"], lvl : 3} etc
			let preq = this.preqs[i];
			
			let job = preq.job;
			let lvl = preq.lvl || 1;
			
			if(job) {
				let jd = entity.jobs[job.name];
				if(jd == null)     return false;
				if(jd.level < lvl) return false;
			}
		}
		
		return true;
	}

}

export class JobDesc {
	job : Job;
	level : number;
	experience : number;
	mult : number;
	constructor(job : Job) {
		this.job        = job;
		this.level      = 1;
		this.experience = 0;
		this.mult       = 1;
	}
	ToStorage() {
		if(this.level <= 1 && this.experience == 0) return null;
		let storage : any = {};
		if(this.level      != 1) storage["lvl"] = Math.floor(this.level);
		if(this.experience != 0) storage["exp"] = Math.floor(this.experience);
		return storage;
	}
	FromStorage(storage : any) {
		if(storage) {
			this.level      = parseInt(storage["lvl"]) || this.level;
			this.experience = parseInt(storage["exp"]) || this.experience;
		}
	}	
};

export class JobLevel {
	expToLevel : number;
	skills : any[];
	bonus : any;
	func : any;
	constructor(expToLevel : number, skills : any[], bonus : any, func? : any) {
		this.expToLevel = expToLevel;
		this.skills     = skills; // [ { ab: Ablities.Black.Fireball, set: "Spells" }, ... ]
		this.bonus      = bonus;  // { str: 0.1, int: 0.2 ...}
		this.func       = func;   // func(entity)
	}
}



export enum JobEnum {
	Fighter   = 0,
	Scholar   = 1,
	Courtesan = 2
};

////////////
// TIER 1 //
////////////

Jobs["Fighter"] = new Job("Fighter");
Jobs["Fighter"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), Name: entity.NameDesc(), name: entity.nameDesc(), has: entity.has(), s: entity.plural() ? "" : "s"};
	return Text.Parse("As a fighter, [name] train[s] the fundamental basics of physical combat, honing [hisher] body for further specialization. [Name] [has] a broad set of attacks, but lack[s] a tactical mindset.", parse);
}
Jobs["Fighter"].abilities.AddAbility(Abilities.Physical.Bash);
Jobs["Fighter"].abilities.AddAbility(Abilities.Physical.Pierce);
Jobs["Fighter"].abilities.AddAbility(Abilities.Physical.DAttack);
Jobs["Fighter"].abilities.AddAbility(Abilities.Physical.Provoke);
Jobs["Fighter"].levels.push(new JobLevel(10,  [{ab: Abilities.Physical.Bash, set: "Skills"}], {"str" : 0.2}));
Jobs["Fighter"].levels.push(new JobLevel(20,  null, {"str" : 0.1, "sta" : 0.1}));
Jobs["Fighter"].levels.push(new JobLevel(40,  [{ab: Abilities.Physical.Pierce, set: "Skills"}], {"str" : 0.1, "dex" : 0.1}));
Jobs["Fighter"].levels.push(new JobLevel(80,  null, {"str" : 0.2}));
Jobs["Fighter"].levels.push(new JobLevel(160, [{ab: Abilities.Physical.DAttack, set: "Skills"}], {"str" : 0.1, "sta" : 0.1}));
Jobs["Fighter"].levels.push(new JobLevel(320, null, {"str" : 0.1, "dex" : 0.1}));
Jobs["Fighter"].levels.push(new JobLevel(640, [{ab: Abilities.Physical.Provoke, set: "Skills"}, {ab: Abilities.Physical.TAttack, set: "Skills"}], {"str" : 0.2, "sta" : 0.2, "dex" : 0.2, "hp" : 5}));

Jobs["Scholar"] = new Job("Scholar");
Jobs["Scholar"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), Name: entity.NameDesc(), name: entity.nameDesc(), has: entity.has(), is: entity.is()};
	return Text.Parse("As a scholar, [name] [is] a truthseeker, characterized by [hisher] curiosity and thirst for knowledge. While lacking in offensive strength, [name] [has] plenty of supportive abilities to field in combat.", parse);
}
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
Jobs["Scholar"].levels.push(new JobLevel(640, [{ab: Abilities.White.Cheer, set: "Support"}, {ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.2, "spi" : 0.2, "cha" : 0.2, "sp" : 5}));

Jobs["Courtesan"] = new Job("Courtesan");
Jobs["Courtesan"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), heshe: entity.heshe(), name: entity.nameDesc(), Poss: entity.Possessive()};
	return Text.Parse("As a playful courtesan, there is a lustful spark stirring within [name], something [heshe] has no qualms about flaunting in combat for [hisher] benefit. [Poss] teasing nature is something that one day might turn into something darker, more primal, should [heshe] give in to [hisher] lust.", parse);
}
Jobs["Courtesan"].Unlocked = function(entity : Entity) {
	let layla = GAME().layla;
	if(entity == layla) return !layla.Virgin();
	return true;
}
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
Jobs["Courtesan"].levels.push(new JobLevel(640, [{ab: Abilities.Seduction.Distract, set: "Seduce"}, {ab: Abilities.Seduction.Rut, set: "Seduce"}], {"lib" : 0.2, "cha" : 0.2, "dex" : 0.2, "lp" : 5}));

// Kiai specific
Jobs["Acolyte"] = new Job("Acolyte");
Jobs["Acolyte"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HeShe: entity.HeShe(), name: entity.nameDesc(), has: entity.has()};
	return Text.Parse("As an acolyte, [name] [has] devoted years in the service of Lady Aria, learning empathy and love for [hisher] fellow man. [HeShe] [has] a strong supportive role, but lacks offensive capabilities.", parse);
}
Jobs["Acolyte"].abilities.AddAbility(Abilities.White.Heal);
Jobs["Acolyte"].abilities.AddAbility(Abilities.White.Preach);
Jobs["Acolyte"].abilities.AddAbility(Abilities.White.Toughen);
Jobs["Acolyte"].abilities.AddAbility(Abilities.White.Empower);
Jobs["Acolyte"].abilities.AddAbility(Abilities.White.Cleanse);
Jobs["Acolyte"].levels.push(new JobLevel(10,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.2}));
Jobs["Acolyte"].levels.push(new JobLevel(20,  null, {"int" : 0.1, "spi" : 0.1}));
Jobs["Acolyte"].levels.push(new JobLevel(40,  [{ab: Abilities.White.Preach, set: "Support"}], {"int" : 0.1, "cha" : 0.1}));
Jobs["Acolyte"].levels.push(new JobLevel(80,  [{ab: Abilities.White.Cleanse, set: "Support"}], {"int" : 0.2}));
Jobs["Acolyte"].levels.push(new JobLevel(160, [{ab: Abilities.White.Toughen, set: "Support"}], {"int" : 0.1, "spi" : 0.1}));
Jobs["Acolyte"].levels.push(new JobLevel(320, null, {"int" : 0.1, "cha" : 0.1}));
Jobs["Acolyte"].levels.push(new JobLevel(640, [{ab: Abilities.White.Empower, set: "Support"}, {ab: Abilities.White.Sermon, set: "Support"}], {"int" : 0.2, "spi" : 0.2, "cha" : 0.2, "hp" : 5, "sp" : 10}));

// Cveta specific
Jobs["Songstress"] = new Job("Songstress");
Jobs["Songstress"].Long = function(entity : Entity) {
	let parse : any = {};
	return Text.Parse("All may practice hard, but some gifts are inborn and cannot be imparted through teaching. The Songstress uses the strange, magical qualities of her voice to sway the tides of battle.", parse);
}
Jobs["Songstress"].abilities.AddAbility(Abilities.Seduction.Soothe);
Jobs["Songstress"].abilities.AddAbility(Abilities.Seduction.Inflame);
Jobs["Songstress"].abilities.AddAbility(Abilities.Black.Dischord);
Jobs["Songstress"].abilities.AddAbility(Abilities.Seduction.Captivate);
Jobs["Songstress"].levels.push(new JobLevel(10,  [{ab: Abilities.Seduction.Soothe, set: "Support"}], {"spi" : 0.3}));
Jobs["Songstress"].levels.push(new JobLevel(20,  null, {"int" : 0.2, "cha" : 0.1}));
Jobs["Songstress"].levels.push(new JobLevel(40,  [{ab: Abilities.Seduction.Inflame, set: "Seduce"}], {"cha" : 0.2, "spi" : 0.1}));
Jobs["Songstress"].levels.push(new JobLevel(80,  null, {"cha" : 0.2, "lib" : 0.1}));
Jobs["Songstress"].levels.push(new JobLevel(160, [{ab: Abilities.Black.Dischord, set: "Spells"}], {"cha" : 0.1, "int" : 0.2 }));
Jobs["Songstress"].levels.push(new JobLevel(320, null, {"cha" : 0.2, "lib" : 0.1}));
Jobs["Songstress"].levels.push(new JobLevel(640, [{ab: Abilities.Seduction.Captivate, set: "Seduce"}, {ab: Abilities.Black.Scream, set: "Spells"}], {"cha" : 0.4, "lib" : 0.1}));


////////////
// TIER 2 //
////////////

Jobs["Bruiser"] = new Job("Bruiser");
Jobs["Bruiser"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HeShe: entity.HeShe(), name: entity.nameDesc(), is: entity.is(), s: entity.plural() ? "" : "s"};
	return Text.Parse("As a bruiser, [name] [is] all about brute strength, and can prove to be quite a fearsome warrior. [HeShe] can dish out a large amount of damage, but fare[s] badly against quick, evasive foes.", parse);
}
Jobs["Bruiser"].Unlocked = function(entity : Entity) {
	let miranda = GAME().miranda;
	if(entity == miranda) return true;
	return miranda.flags["Bruiser"] == MirandaFlags.Bruiser.Taught;
}
Jobs["Bruiser"].preqs.push({job : Jobs["Fighter"], lvl : 3});
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.CrushingStrike);
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.FocusStrike);
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.TAttack);
Jobs["Bruiser"].abilities.AddAbility(Abilities.Physical.GrandSlam);
Jobs["Bruiser"].levels.push(new JobLevel(20,   [{ab: Abilities.Physical.CrushingStrike, set: "Skills"}], {"str" : 0.2, "sta" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(40,   null, {"str" : 0.2, "dex" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(80,   [{ab: Abilities.Physical.FocusStrike, set: "Skills"}], {"str" : 0.2, "sta" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(160,  null, {"sta" : 0.2, "str" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(320,  [{ab: Abilities.Physical.TAttack, set: "Skills"}], {"str" : 0.2, "sta" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(640,  null, {"sta" : 0.2, "dex" : 0.1}));
Jobs["Bruiser"].levels.push(new JobLevel(1280, [{ab: Abilities.Physical.GrandSlam, set: "Skills"}, {ab: Abilities.Physical.Frenzy, set: "Skills"}], {"str" : 0.3, "sta" : 0.1, "dex" : 0.1, "hp" : 5}));

Jobs["Rogue"] = new Job("Rogue");
Jobs["Rogue"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HeShe: entity.HeShe(), name: entity.nameDesc(), s: entity.plural() ? "" : "s"};
	return Text.Parse("As a rogue, [name] fight[s] dirty, using any trick or scheme to deal decisive damage to [hisher] enemies. [HeShe] can deal large amounts of damage against distracted opponents.", parse);
}
Jobs["Rogue"].Unlocked = function(entity : Entity) {
	let cale = GAME().cale;
	let terry = GAME().terry;
	if(entity == terry) return true;
	return (cale.flags["Rogue"]  >= CaleFlags.Rogue.Taught) ||
	       (terry.flags["Rogue"] >= TerryFlags.Rogue.Taught);
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
Jobs["Rogue"].levels.push(new JobLevel(320,  [{ab: Abilities.Physical.Swift, set: "Skills"}], {"dex" : 0.2, "str" : 0.1}));
Jobs["Rogue"].levels.push(new JobLevel(640,  null, {"dex" : 0.2, "int" : 0.1}));
Jobs["Rogue"].levels.push(new JobLevel(1280, [{ab: Abilities.Physical.Backstab, set: "Skills"}, {ab: Abilities.Physical.Fade, set: "Skills"}], {"dex" : 0.3, "int" : 0.1, "cha" : 0.1}));

Jobs["Ranger"] = new Job("Ranger");
Jobs["Ranger"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HeShe: entity.HeShe(), name: entity.nameDesc(), is: entity.is()};
	return Text.Parse("As a ranger, [name] [is] a skilled hunter, well versed in ways to ensnare and distract [hisher] prey.", parse);
}
Jobs["Ranger"].Unlocked = function(entity : Entity) {
	let estevan = GAME().estevan;
	let maria = GAME().maria;
	if(estevan.flags["Ranger"] >= EstevanFlags.Ranger.Taught) return true;
	if(maria.flags["Ranger"]   >= MariaFlags.Ranger.Taught) return true;
	return false;
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
Jobs["Ranger"].levels.push(new JobLevel(1280, [{ab: Abilities.Physical.SetTrap, set: "Skills"}, {ab: Abilities.Physical.Swift, set: "Skills"}], {"int" : 0.1, "sta" : 0.1, "dex" : 0.3}));

Jobs["Squire"] = new Job("Squire");
Jobs["Squire"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HeShe: entity.HeShe(), name: entity.nameDesc(), is: entity.is()};
	//TODO Desc
	return Text.Parse("Tank", parse);
}
Jobs["Squire"].Unlocked = function(entity : Entity) {
	return false; //TODO Trainer
}
Jobs["Squire"].preqs.push({job : Jobs["Fighter"], lvl : 3});
Jobs["Squire"].abilities.AddAbility(Abilities.Physical.Provoke);
//TODO Skills
Jobs["Squire"].abilities.AddAbility(Abilities.Physical.FocusStrike);
Jobs["Squire"].abilities.AddAbility(Abilities.Physical.Hamstring);
Jobs["Squire"].abilities.AddAbility(Abilities.Physical.Taunt);
//TODO Skills
Jobs["Squire"].levels.push(new JobLevel(20,   [{ab: Abilities.Physical.Provoke, set: "Skills"}], {"sta" : 0.2, "spi" : 0.1}));
Jobs["Squire"].levels.push(new JobLevel(40,   null, {"sta" : 0.1, "dex" : 0.1, "str" : 0.1}));
Jobs["Squire"].levels.push(new JobLevel(80,   [{ab: Abilities.Physical.FocusStrike, set: "Skills"}], {"sta" : 0.2, "dex" : 0.1}));
Jobs["Squire"].levels.push(new JobLevel(160,  null, {"sta" : 0.3}));
Jobs["Squire"].levels.push(new JobLevel(320,  [{ab: Abilities.Physical.Hamstring, set: "Skills"}], {"spi" : 0.1, "sta" : 0.2}));
Jobs["Squire"].levels.push(new JobLevel(640,  null, {"spi" : 0.2, "dex" : 0.1}));
Jobs["Squire"].levels.push(new JobLevel(1280, [{ab: Abilities.Physical.Taunt, set: "Skills"}], {"spi" : 0.1, "sta" : 0.3, "dex" : 0.1}));


Jobs["Mage"] = new Job("Mage");
Jobs["Mage"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), heshe: entity.heshe(), has: entity.has(), name: entity.nameDesc(), es: entity.plural() ? "" : "es" };
	return Text.Parse("As a mage, [name] [has] taken the first steps into exploring the raw power of the elements and the chaotic force of magic. While [heshe] [has] barely begun tapping [hisher] innate potential, [name] already possess[es] formidable destructive power.", parse);
}
Jobs["Mage"].preqs.push({job : Jobs["Scholar"], lvl : 3});
Jobs["Mage"].abilities.AddAbility(Abilities.Black.Surge);
Jobs["Mage"].abilities.AddAbility(Abilities.Black.Fireball);
Jobs["Mage"].abilities.AddAbility(Abilities.Black.Freeze);
Jobs["Mage"].abilities.AddAbility(Abilities.Black.Bolt);
Jobs["Mage"].abilities.AddAbility(Abilities.White.Dispel);
Jobs["Mage"].levels.push(new JobLevel(20,   [{ab: Abilities.Black.Surge, set: "Spells"}], {"int" : 0.3}));
Jobs["Mage"].levels.push(new JobLevel(40,   null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Mage"].levels.push(new JobLevel(80,   [{ab: Abilities.Black.Fireball, set: "Spells"}], {"int" : 0.2, "sta" : 0.1}));
Jobs["Mage"].levels.push(new JobLevel(160,  null, {"int" : 0.2, "cha" : 0.1}));
Jobs["Mage"].levels.push(new JobLevel(320,  [{ab: Abilities.Black.Freeze, set: "Spells"}], {"int" : 0.2, "dex" : 0.1}));
Jobs["Mage"].levels.push(new JobLevel(640,  [{ab: Abilities.White.Dispel, set: "Support"}], {"int" : 0.1, "spi" : 0.2}));
Jobs["Mage"].levels.push(new JobLevel(1280, [{ab: Abilities.Black.Bolt, set: "Spells"}, {ab: Abilities.Black.Eruption, set: "Spells"}], {"int" : 0.4, "spi" : 0.1, "sp" : 5}));
Jobs["Mage"].Unlocked = function(entity : Entity) {
	return GlobalScenes.MagicStage1();
}

Jobs["Mystic"] = new Job("Mystic");
Jobs["Mystic"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), name: entity.nameDesc(), s: entity.plural() ? "" : "s"};
	return Text.Parse("As a mystic, [name] take[s] the first steps in mastering the  power of nature, commanding water and plants to bend to [hisher] will.", parse);
}
Jobs["Mystic"].preqs.push({job : Jobs["Scholar"], lvl : 3});
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Thorn);
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Spray);
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Spire);
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Gust);
Jobs["Mystic"].abilities.AddAbility(Abilities.Black.Venom);
Jobs["Mystic"].abilities.AddAbility(Abilities.White.Purify);
Jobs["Mystic"].levels.push(new JobLevel(20,   [{ab: Abilities.Black.Thorn, set: "Spells"}], {"sta" : 0.3}));
Jobs["Mystic"].levels.push(new JobLevel(40,   null, {"int" : 0.1, "spi" : 0.2}));
Jobs["Mystic"].levels.push(new JobLevel(80,   [{ab: Abilities.Black.Spray, set: "Spells"}], {"spi" : 0.3}));
Jobs["Mystic"].levels.push(new JobLevel(160,  [{ab: Abilities.White.Purify, set: "Support"}], {"sta" : 0.2, "spi" : 0.1}));
Jobs["Mystic"].levels.push(new JobLevel(320,  [{ab: Abilities.Black.Spire, set: "Spells"}], {"int" : 0.2, "str" : 0.1}));
Jobs["Mystic"].levels.push(new JobLevel(640,  [{ab: Abilities.Black.Gust, set: "Spells"}], {"int" : 0.1, "lib" : 0.2}));
Jobs["Mystic"].levels.push(new JobLevel(1280, [{ab: Abilities.Black.Venom, set: "Spells"}, {ab: Abilities.Black.Stalagmite, set: "Spells"}], {"spi" : 0.4, "sta" : 0.1}));
Jobs["Mystic"].Unlocked = function(entity : Entity) {
	return GlobalScenes.MagicStage1();
}

Jobs["Healer"] = new Job("Healer");
Jobs["Healer"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HisHer: entity.HisHer(), name: entity.nameDesc(), s: entity.plural() ? "" : "s"};
	return Text.Parse("As a proficient healer, [name] know[s] the bare essentials of caring for the wounded in [hisher] party, keeping them alive in any and all situations. [HisHer] healing hands can ease the pain of minor wounds and nurse people back to health.", parse);
}
Jobs["Healer"].preqs.push({job : Jobs["Scholar"], lvl : 3});
Jobs["Healer"].abilities.AddAbility(Abilities.White.Heal);
Jobs["Healer"].abilities.AddAbility(Abilities.White.Cleanse);
Jobs["Healer"].levels.push(new JobLevel(20,   null, {"spi" : 0.3}));
Jobs["Healer"].levels.push(new JobLevel(40,   null, {"int" : 0.2, "cha" : 0.1}));
Jobs["Healer"].levels.push(new JobLevel(80,   [{ab: Abilities.White.Heal, set: "Support"}], {"sta" : 0.2, "spi" : 0.1}));
Jobs["Healer"].levels.push(new JobLevel(160,  null, {"spi" : 0.2, "int" : 0.1}));
Jobs["Healer"].levels.push(new JobLevel(320,  [{ab: Abilities.White.Cleanse, set: "Support"}], {"int" : 0.3}));
Jobs["Healer"].levels.push(new JobLevel(640,  null, {"cha" : 0.2, "sta" : 0.1}));
Jobs["Healer"].levels.push(new JobLevel(1280, [{ab: Abilities.White.Recover, set: "Support"}], {"spi" : 0.4, "int" : 0.1, "sp" : 5}));
Jobs["Healer"].Unlocked = function(entity : Entity) {
	return GlobalScenes.MagicStage1();
}

Jobs["Singer"] = new Job("Singer");
Jobs["Singer"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), himher: entity.himher(), name: entity.nameDesc(), s: entity.plural() ? "" : "s"};
	return Text.Parse("As a singer, [name] can sway those around [himher] with [hisher] songs, rousing courage in [hisher] allies or inducing dismay in [hisher] foes.", parse);
}
Jobs["Singer"].preqs.push({job : Jobs["Courtesan"], lvl : 3});
//TODO Singer abilities
Jobs["Singer"].abilities.AddAbility(Abilities.Seduction.Lull);
Jobs["Singer"].levels.push(new JobLevel(20,   [{ab: Abilities.Seduction.Lull, set: "Support"}], {"spi" : 0.3}));
Jobs["Singer"].levels.push(new JobLevel(40,   null, {"int" : 0.2, "cha" : 0.1}));
Jobs["Singer"].levels.push(new JobLevel(80,   null, {"sta" : 0.2, "spi" : 0.1}));
Jobs["Singer"].levels.push(new JobLevel(160,  null, {"spi" : 0.2, "int" : 0.1}));
Jobs["Singer"].levels.push(new JobLevel(320,  null, {"int" : 0.3}));
Jobs["Singer"].levels.push(new JobLevel(640,  null, {"cha" : 0.2, "sta" : 0.1}));
Jobs["Singer"].levels.push(new JobLevel(1280, [{ab: Abilities.White.Heal, set: "Support"}], {"spi" : 0.4, "int" : 0.1}));
Jobs["Singer"].Unlocked = function(entity : Entity) {
	let cveta = GAME().cveta;
	if(entity == cveta) return true;
	return cveta.flags["Singer"] >= CvetaFlags.Singer.Taught;
}

////////////
// TIER 3 //
////////////

Jobs["Elementalist"] = new Job("Elementalist");
Jobs["Elementalist"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HisHer: entity.HisHer(), name: entity.nameDesc()};
	return Text.Parse("The elementalist is a specialist magician, being able to call on the full fury of the elements to rain down on [hisher] foes. Very effective against large groups of enemies.", parse);
}
Jobs["Elementalist"].preqs.push({job : Jobs["Mage"], lvl : 3});
Jobs["Elementalist"].abilities.AddAbility(Abilities.Black.Hailstorm);
Jobs["Elementalist"].abilities.AddAbility(Abilities.Black.Quake);
Jobs["Elementalist"].abilities.AddAbility(Abilities.Black.ThunderStorm);
Jobs["Elementalist"].abilities.AddAbility(Abilities.Black.Eruption);
Jobs["Elementalist"].levels.push(new JobLevel(40,   [{ab: Abilities.Black.Eruption, set: "Spells"}], {"int" : 0.2, "spi": 0.2}));
Jobs["Elementalist"].levels.push(new JobLevel(80,   null, {"int" : 0.3, "sta": 0.1}));
Jobs["Elementalist"].levels.push(new JobLevel(160,  [{ab: Abilities.Black.ThunderStorm, set: "Spells"}], {"int" : 0.1, "spi" : 0.3}));
Jobs["Elementalist"].levels.push(new JobLevel(320,  null, {"spi" : 0.2, "sta" : 0.2}));
Jobs["Elementalist"].levels.push(new JobLevel(640,  [{ab: Abilities.Black.Hailstorm, set: "Spells"}], {"int" : 0.4}));
Jobs["Elementalist"].levels.push(new JobLevel(1280, null, {"dex" : 0.1, "sta" : 0.1, "spi" : 0.2}));
Jobs["Elementalist"].levels.push(new JobLevel(2560, [{ab: Abilities.Black.Quake, set: "Spells"}, {ab: Abilities.Black.PrismaticBurst, set: "Spells"}], {"int" : 0.5, "spi" : 0.2, "sp" : 5}));
Jobs["Elementalist"].Unlocked = function(entity : Entity) {
	return GlobalScenes.MagicStage2();
}


Jobs["Warlock"] = new Job("Warlock");
Jobs["Warlock"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HisHer: entity.HisHer(), name: entity.nameDesc()};
	return Text.Parse("The warlock utilizes the power of darkness to weaken and drain [hisher] enemies. The warlock's curse makes [hisher] foes more susceptible to debilitating effects.", parse);
}
Jobs["Warlock"].preqs.push({job : Jobs["Mage"], lvl : 3});
Jobs["Warlock"].abilities.AddAbility(Abilities.Black.Shade);
Jobs["Warlock"].abilities.AddAbility(Abilities.Black.Lifetap);
Jobs["Warlock"].abilities.AddAbility(Abilities.Black.DrainingTouch);
Jobs["Warlock"].abilities.AddAbility(Abilities.Black.EntropicFortune);
Jobs["Warlock"].levels.push(new JobLevel(40,   [{ab: Abilities.Black.Shade, set: "Spells"}], {"sta" : 0.2, "spi" : 0.2}));
Jobs["Warlock"].levels.push(new JobLevel(80,   null, {"int" : 0.3, "lib" : 0.1}));
Jobs["Warlock"].levels.push(new JobLevel(160,  [{ab: Abilities.Black.Lifetap, set: "Spells"}], {"sta" : 0.2, "int" : 0.2}));
Jobs["Warlock"].levels.push(new JobLevel(320,  null, {"lib" : 0.2, "sta" : 0.2}));
Jobs["Warlock"].levels.push(new JobLevel(640,  [{ab: Abilities.Black.DrainingTouch, set: "Spells"}], {"int" : 0.3, "str" : 0.1}));
Jobs["Warlock"].levels.push(new JobLevel(1280, null, {"spi" : 0.3, "sta" : 0.1}));
Jobs["Warlock"].levels.push(new JobLevel(2560, [{ab: Abilities.Black.EntropicFortune, set: "Spells"}, {ab: Abilities.Black.TaintedVitality, set: "Spells"}], {"int" : 0.3, "sta" : 0.3, "spi" : 0.1, "sp" : 5}));
Jobs["Warlock"].Unlocked = function(entity : Entity) {
	return GlobalScenes.MagicStage2();
}


Jobs["Hypnotist"] = new Job("Hypnotist");
Jobs["Hypnotist"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HisHer: entity.HisHer(), name: entity.nameDesc()};
	return Text.Parse("Hypnotists utilize the alluring magic of illusion and mental suggestion to manipulate others, both on and off the battlefield. Practitioners of this advanced art require intimate familiarity of the unbridled passions that rule us all, as well as knowledge of the arcane.", parse);
}
Jobs["Hypnotist"].preqs.push({job : Jobs["Mage"], lvl : 3});
Jobs["Hypnotist"].preqs.push({job : Jobs["Courtesan"], lvl : 3});
Jobs["Hypnotist"].abilities.AddAbility(Abilities.Seduction.Sleep);
Jobs["Hypnotist"].abilities.AddAbility(Abilities.Seduction.TIllusion);
Jobs["Hypnotist"].abilities.AddAbility(Abilities.Seduction.SIllusion);
Jobs["Hypnotist"].abilities.AddAbility(Abilities.Seduction.Confuse);
Jobs["Hypnotist"].levels.push(new JobLevel(40,   [{ab: Abilities.Seduction.Sleep, set: "Support"}], {"cha" : 0.2, "lib" : 0.2}));
Jobs["Hypnotist"].levels.push(new JobLevel(80,   null, {"int" : 0.3, "cha" : 0.1}));
Jobs["Hypnotist"].levels.push(new JobLevel(160,  [{ab: Abilities.Seduction.TIllusion, set: "Support"}], {"int" : 0.2, "lib" : 0.2}));
Jobs["Hypnotist"].levels.push(new JobLevel(320,  null, {"cha" : 0.3, "int" : 0.1}));
Jobs["Hypnotist"].levels.push(new JobLevel(640,  [{ab: Abilities.Seduction.SIllusion, set: "Support"}], {"spi" : 0.2, "lib" : 0.2}));
Jobs["Hypnotist"].levels.push(new JobLevel(1280, null, {"int" : 0.1, "cha" : 0.3}));
Jobs["Hypnotist"].levels.push(new JobLevel(2560, [{ab: Abilities.Seduction.Confuse, set: "Support"}, {ab: Abilities.Seduction.Allure, set: "Support"}], {"cha" : 0.3, "lib" : 0.3, "int" : 0.2, "lp" : 5}));
Jobs["Hypnotist"].Unlocked = function(entity : Entity) {
	return GlobalScenes.MagicStage2();
}

Jobs["Eromancer"] = new Job("Eromancer");
//TODO
Jobs["Eromancer"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HisHer: entity.HisHer(), name: entity.nameDesc()};
	return Text.Parse("", parse);
}
Jobs["Eromancer"].preqs.push({job : Jobs["Mage"], lvl : 3});
Jobs["Eromancer"].preqs.push({job : Jobs["Courtesan"], lvl : 3});
//TODO
Jobs["Eromancer"].abilities.AddAbility(Abilities.White.Heal);
Jobs["Eromancer"].levels.push(new JobLevel(40,   null, {"str" : 0.2}));
Jobs["Eromancer"].levels.push(new JobLevel(80,   null, {"str" : 0.2}));
//TODO
Jobs["Eromancer"].levels.push(new JobLevel(160,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.1, "dex" : 0.1}));
Jobs["Eromancer"].levels.push(new JobLevel(320,  null, {"str" : 0.2}));
Jobs["Eromancer"].levels.push(new JobLevel(640,  null, {"str" : 0.2}));
Jobs["Eromancer"].levels.push(new JobLevel(1280, null, {"str" : 0.2}));
Jobs["Eromancer"].levels.push(new JobLevel(2560, null, {"str" : 0.2}));
Jobs["Eromancer"].Unlocked = function(entity : Entity) {
	return GlobalScenes.MagicStage2();
}

Jobs["RunicKnight"] = new Job("Runic Knight");
//TODO
Jobs["RunicKnight"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HisHer: entity.HisHer(), name: entity.nameDesc()};
	return Text.Parse("", parse);
}
Jobs["RunicKnight"].preqs.push({job : Jobs["Mystic"], lvl : 3});
Jobs["RunicKnight"].preqs.push({job : Jobs["Fighter"], lvl : 3});
//TODO
Jobs["RunicKnight"].abilities.AddAbility(Abilities.White.Heal);
Jobs["RunicKnight"].levels.push(new JobLevel(40,   null, {"str" : 0.2}));
Jobs["RunicKnight"].levels.push(new JobLevel(80,   null, {"str" : 0.2}));
//TODO
Jobs["RunicKnight"].levels.push(new JobLevel(160,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.1, "dex" : 0.1}));
Jobs["RunicKnight"].levels.push(new JobLevel(320,  null, {"str" : 0.2}));
Jobs["RunicKnight"].levels.push(new JobLevel(640,  null, {"str" : 0.2}));
Jobs["RunicKnight"].levels.push(new JobLevel(1280, null, {"str" : 0.2}));
Jobs["RunicKnight"].levels.push(new JobLevel(2560, null, {"str" : 0.2}));
Jobs["RunicKnight"].Unlocked = function(entity : Entity) {
	return GlobalScenes.MagicStage2();
}

Jobs["Bard"] = new Job("Bard");
//TODO
Jobs["Bard"].Long = function(entity : Entity) {
	let parse : any = {hisher: entity.hisher(), HisHer: entity.HisHer(), name: entity.nameDesc()};
	return Text.Parse("", parse);
}
Jobs["Bard"].preqs.push({job : Jobs["Courtesan"], lvl : 5});
Jobs["Bard"].preqs.push({job : Jobs["Singer"], lvl : 3});
//TODO
Jobs["Bard"].abilities.AddAbility(Abilities.White.Heal);
Jobs["Bard"].levels.push(new JobLevel(40,   null, {"str" : 0.2}));
Jobs["Bard"].levels.push(new JobLevel(80,   null, {"str" : 0.2}));
//TODO
Jobs["Bard"].levels.push(new JobLevel(160,  [{ab: Abilities.White.Heal, set: "Support"}], {"int" : 0.1, "dex" : 0.1}));
Jobs["Bard"].levels.push(new JobLevel(320,  null, {"str" : 0.2}));
Jobs["Bard"].levels.push(new JobLevel(640,  null, {"str" : 0.2}));
Jobs["Bard"].levels.push(new JobLevel(1280, null, {"str" : 0.2}));
Jobs["Bard"].levels.push(new JobLevel(2560, null, {"str" : 0.2}));
Jobs["Bard"].Unlocked = function(entity : Entity) {
	let cveta = GAME().cveta;
	if(entity == cveta) return true;
	return GlobalScenes.MagicStage2();
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

export { Jobs };
