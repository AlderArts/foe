/*
 * 
 * Define Estevan
 * 
 */
function Estevan(storage) {
	Entity.call(this);
	
	
	this.name         = "Estevan";
	
	this.body.DefMale();
	this.body.SetRace(Race.satyr);
	this.SetSkinColor(Color.olive);
	TF.SetAppendage(this.Back(), AppendageType.horn, Race.satyr, Color.black, 2);
	
	this.SetLevelBonus();
	this.RestFull();
	
	
	if(storage) this.FromStorage(storage);
}
Estevan.prototype = new Entity();
Estevan.prototype.constructor = Estevan;

Estevan.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Estevan.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	storage.flags = this.flags;
	
	return storage;
}

Scenes.Estevan = {};

Scenes.Estevan.Interact = function() {
	Text.Clear();
	Text.AddOutput("You approach the satyr, but he doesn't look implemented yet.");

	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + estevan.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + estevan.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + estevan.slut.Get()));
		Text.Newline();
	}

	Gui.NextPrompt();
}

world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	"Estevan", function() { return (world.time.hour >= 14 || world.time.hour < 2); }, true,
	function() {
		if(!(world.time.hour >= 14 || world.time.hour < 2)) return;
		
		Text.AddOutput("Talk to the satyr hunter? ");
		Text.Newline();
	},
	Scenes.Estevan.Interact
));
