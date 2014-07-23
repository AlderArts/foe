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
	this.LoadFlags(storage);
}

Estevan.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

Scenes.Estevan = {};

Scenes.Estevan.Interact = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("You approach the satyr, but he doesn't look implemented yet.", parse);

	
	if(DEBUG) {
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: relation: " + estevan.relation.Get()));
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: subDom: " + estevan.subDom.Get()));
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: slut: " + estevan.slut.Get()));
		Text.NL();
	}
	/*
	Text.NL();
	Text.Add("", parse);
	*/
	Text.Flush();
	
	Gui.NextPrompt();
}

world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	"Estevan", function() { return (world.time.hour >= 14 || world.time.hour < 2); }, true,
	function() {
		if(!(world.time.hour >= 14 || world.time.hour < 2)) return;
		
		Text.Add("Talk to the satyr hunter? ");
		Text.NL();
	},
	Scenes.Estevan.Interact
));
