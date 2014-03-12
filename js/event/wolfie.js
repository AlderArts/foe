/*
 * 
 * Define Wolfie
 * 
 */
function Wolfie(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Wolfie";
	// Later Volg
	
	this.body.DefMale();
	this.body.SetRace(Race.wolf);
	this.SetSkinColor(Color.gray);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.wolf, Color.gray);
	this.FirstCock().length.base = 25;
	this.FirstCock().thickness.base = 5;
	
	this.flags["Met"]     = 0;
	this.flags["Sexed"]   = 0;
	
	this.SetLevelBonus();
	this.RestFull();
	
	if(storage) this.FromStorage(storage);
}
Wolfie.prototype = new Entity();
Wolfie.prototype.constructor = Wolfie;

Wolfie.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.virgin) == 1;
	// Personality stats
	this.subDom.base         = parseFloat(storage.subDom)  || this.subDom.base;
	this.slut.base           = parseFloat(storage.slut)    || this.slut.base;
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Wolfie.prototype.ToStorage = function() {
	var storage = {
		virgin : this.Butt().virgin ? 1 : 0
	};
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	
	return storage;
}

Scenes.Wolfie = {};

// Schedule
Wolfie.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction
Scenes.Wolfie.Interact = function() {
	Text.Clear();
	Text.AddOutput("Rawr Imma wolf.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + wolfie.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + wolfie.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + wolfie.slut.Get()));
		Text.Newline();
	}
}
