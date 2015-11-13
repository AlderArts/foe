/*
 * 
 * Define Cassidy
 * 
 */

Scenes.Cassidy = {};

function Cassidy(storage) {
	Entity.call(this);
	this.ID = "cassidy";
	
	// Character stats
	this.name = "Cassidy";
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 2;
	this.body.SetRace(Race.Salamander);
	
	/* TODO
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	*/
	this.flags["Met"]   = Cassidy.Met.NotMet;
	
	if(storage) this.FromStorage(storage);
}
Cassidy.prototype = new Entity();
Cassidy.prototype.constructor = Cassidy;

Cassidy.Met = {
	NotMet     : 0,
	Met        : 1,
	WentBack   : 2,
	KnowGender : 3
};

Cassidy.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	//TODO Timers
}

Cassidy.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Cassidy.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}


//Pronoun stuff
Cassidy.prototype.KnowGender = function() {
	return this.flags["Met"] >= Cassidy.Met.KnowGender;
}

Cassidy.prototype.heshe = function() {
	if(this.KnowGender()) return "she";
	else return "he";
}
Cassidy.prototype.HeShe = function() {
	if(this.KnowGender()) return "She";
	else return "He";
}
Cassidy.prototype.himher = function() {
	if(this.KnowGender()) return "her";
	else return "him";
}
Cassidy.prototype.HimHer = function() {
	if(this.KnowGender()) return "Her";
	else return "Him";
}
Cassidy.prototype.hisher = function() {
	if(this.KnowGender()) return "her";
	else return "his";
}
Cassidy.prototype.HisHer = function() {
	if(this.KnowGender()) return "Her";
	else return "His";
}
Cassidy.prototype.hishers = function() {
	if(this.KnowGender()) return "hers";
	else return "his";
}
Cassidy.prototype.mfPronoun = function(male, female) {
	if(this.KnowGender()) return female;
	else return male;
}



// Scenes

Scenes.Cassidy.First = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.Flush();
}


