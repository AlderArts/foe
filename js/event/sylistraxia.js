/*
 * 
 * Define Sylistraxia
 * 
 */
import { Entity } from '../entity';

function Sylistraxia(storage) {
	Entity.call(this);
	this.ID = "sylistraxia";
	
	// Character stats
	this.name = "Sylistraxia";
	
	this.avatar.combat = Images.sylistraxia;
	
	this.maxHp.base        = 500;
	this.maxSp.base        = 300;
	this.maxLust.base      = 150;
	// Main stats
	this.strength.base     = 53;
	this.stamina.base      = 69;
	this.dexterity.base    = 30;
	this.intelligence.base = 62;
	this.spirit.base       = 81;
	this.libido.base       = 24;
	this.charisma.base     = 19;
	
	this.level = 10;
	this.sexlevel = 10;
	this.SetExpToLevel();
	
	this.body.DefHerm(false);
	this.FirstBreastRow().size.base = 14;
	this.Butt().buttSize.base = 7;
	this.body.SetRace(Race.Dragon);
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	
	this.SetLevelBonus();
	this.RestFull();
	
	if(storage) this.FromStorage(storage);
}
Sylistraxia.prototype = new Entity();
Sylistraxia.prototype.constructor = Sylistraxia;

Sylistraxia.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Sylistraxia.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule
Sylistraxia.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction
Sylistraxia.prototype.Interact = function() {
	Text.Clear();
	Text.Add("Rawr Imma dragon.");
	
	
	if(DEBUG) {
		Text.NL();
		Text.Add("DEBUG: relation: " + sylistraxia.relation.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: subDom: " + sylistraxia.subDom.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: slut: " + sylistraxia.slut.Get(), null, 'bold');
		Text.NL();
	}
	
	Text.Flush();
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
}
