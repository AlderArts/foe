/*
 * 
 * Define Cale
 * 
 */
function Cale(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Wolfie";
	
	this.body.DefMale();
	this.body.SetRace(Race.wolf);
	this.SetSkinColor(Color.gray);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.wolf, Color.gray);
	this.FirstCock().length.base = 23;
	this.FirstCock().thickness.base = 5;
	
	this.flags["Met"]     = Cale.Met.NotMet;
	this.flags["Sexed"]   = 0;
	
	this.SetLevelBonus();
	this.RestFull();
	
	if(storage) this.FromStorage(storage);
}
Cale.prototype = new Entity();
Cale.prototype.constructor = Cale;

Cale.Met = {
	NotMet : 0,
	First  : 1,
	YouTookRosalin  : 1,
	CaleTookRosalin : 2,
	SharedGotFucked : 3,
	SharedFuckedHim : 4,
	SharedOnlyRosie : 5
};

Cale.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.virgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	
	if(this.flags["Met"] != 0)
		this.name = "Cale";
}

Cale.prototype.ToStorage = function() {
	var storage = {
		virgin : this.Butt().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

Scenes.Cale = {};

// Schedule
Cale.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction
Scenes.Cale.Interact = function() {
	Text.Clear();
	Text.AddOutput("Rawr Imma wolf.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + cale.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + cale.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + cale.slut.Get()));
		Text.Newline();
	}
}
