/*
 * 
 * Define Roa
 * 
 */

Scenes.Roa = {};

function Roa(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Roa";
	
	this.avatar.combat = Images.roa;
	
	this.maxHp.base        = 30;
	this.maxSp.base        = 40;
	this.maxLust.base      = 20;
	// Main stats
	this.strength.base     = 10;
	this.stamina.base      = 11;
	this.dexterity.base    = 22;
	this.intelligence.base = 17;
	this.spirit.base       = 19;
	this.libido.base       = 18;
	this.charisma.base     = 16;
	
	this.level = 1;
	this.sexlevel = 1;
	
	this.body.DefMale();
	this.FirstBreastRow().size.base = 2;
	this.Butt().buttSize.base = 3;
	this.Butt().virgin = false;
	this.body.SetRace(Race.rabbit);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = Roa.Met.NotMet;

	if(storage) this.FromStorage(storage);
}
Roa.prototype = new Entity();
Roa.prototype.constructor = Roa;

Roa.Met = {
	NotMet : 0,
	Met    : 1
};

Roa.prototype.Met = function() {
	return this.flags["Met"] >= Roa.Met.Met;
}

Roa.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Roa.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule //TODO
Roa.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction //TODO
Roa.prototype.Interact = function() {
	Text.Clear();
	Text.AddOutput("Rawr Imma bunny.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + roa.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + roa.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + roa.slut.Get()));
		Text.Newline();
	}
	
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
}

Scenes.Roa.BrothelApproach = function() {
	var parse = {
		
	};
	
	if(roa.Met()) {
		Text.Clear();
		Text.Add("PLACEHOLDER", parse);
		Text.NL();
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
		Text.Flush();
		
		Scenes.Roa.BrothelPrompt();
	}
	else
		Scenes.Roa.First();
}

Scenes.Roa.BrothelPrompt = function() {
	var parse = {
		
	};
	
	//[name]
	var options = new Array();
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	Gui.SetButtonsFromList(options, true, function() {
		PrintDefaultOptions();
	}); // TODO leave
}

Scenes.Roa.First = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}
