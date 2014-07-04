/*
 * 
 * Define Adrian
 * 
 */
function Adrian(storage) {
	Entity.call(this);

	// Character stats
	this.name = "Adrian";
	
	//this.avatar.combat = new Image();
	//this.avatar.combat.src = "data/adrian_avatar.png";
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 80;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 22;
	this.dexterity.base    = 16;
	this.intelligence.base = 17;
	this.spirit.base       = 15;
	this.libido.base       = 20;
	this.charisma.base     = 18;
	
	this.level = 5;
	this.sexlevel = 3;
	
	this.body.DefMale();
	this.body.SetRace(Race.horse);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.horse, Color.brown);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = 0;

	if(storage) this.FromStorage(storage);
}
Adrian.prototype = new Entity();
Adrian.prototype.constructor = Adrian;


Adrian.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.virgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Adrian.prototype.ToStorage = function() {
	var storage = {
		virgin  : this.Butt().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}


// Schedule
Adrian.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction
Adrian.prototype.Interact = function() {
	Text.Clear();
	Text.AddOutput("Rawr Imma horse.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + adrian.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + adrian.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + adrian.slut.Get()));
		Text.Newline();
	}
	
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
}
