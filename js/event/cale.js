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
	
	this.flags["Met"]     = 0;
	this.flags["Sexed"]   = 0;
	
	this.SetLevelBonus();
	this.RestFull();
	
	if(storage) this.FromStorage(storage);
}
Cale.prototype = new Entity();
Cale.prototype.constructor = Cale;

Cale.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.virgin) == 1;
	// Personality stats
	this.subDom.base         = parseFloat(storage.subDom)  || this.subDom.base;
	this.slut.base           = parseFloat(storage.slut)    || this.slut.base;
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
	
	if(this.flags["Met"] != 0)
		this.name = "Cale";
}

Cale.prototype.ToStorage = function() {
	var storage = {
		virgin : this.Butt().virgin ? 1 : 0
	};
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	
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
