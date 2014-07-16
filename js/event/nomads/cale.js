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
	this.flags["Met2"]    = 0;
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
	
	if(this.flags["Met2"] != 0)
		this.name = "Cale"; // TODO: Remember to set this in the code on first meeting
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

// interaction
Scenes.Cale.Interact = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Rawr Imma wolf.");
	
	if(DEBUG) {
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: relation: " + cale.relation.Get()));
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: slut: " + cale.slut.Get()));
		Text.NL();
	}
	Text.Flush();
}

Scenes.Cale.Desc = function() {
	var parse = {
		
	};
	if(cale.flags["Met2"] == 0) {
		Text.Add("The wolf-morph from the time with Rosalin is seated near the fire, staring idly into the flames.", parse);
	}
	else {
		if(cale.Slut() >= 60)
			Text.Add("Cale is sitting by the fire, he looks at you with a lecherous look and an evil smirk. You note that he’s idly pawing his butt, while his tail wags above. The moment he spots you staring, he calls you over with a crooked finger. No doubt he’s thinking about all the fun you’ve had together.", parse);
		else if(cale.Slut() >= 30)
			Text.Add("Cale sits by the fire, idly looking at the flames dance, sometimes he glances your way and when your eyes meet he casts you a lopsided grin.", parse);
		else
			Text.Add("Cale is sitting by the fire, staring idly into the flames.", parse);
	}
	Text.NL();
}




world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	function() { return cale.name; }, function() { return cale.flags["Met"] != 0 }, true,
	function() {
		if(cale.flags["Met"] != 0)
			Scenes.Cale.Desc();
	},
	Scenes.Cale.Interact
));
