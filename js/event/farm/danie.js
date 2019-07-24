/*
 * 
 * Define Danie
 * 
 */
import { Entity } from '../../entity';
import { GetDEBUG } from '../../../app';
import { Race } from '../../body/race';
import { TF } from '../../tf';
import { AppendageType } from '../../body/appendage';
import { Color } from '../../body/color';

function Danie(storage) {
	Entity.call(this);
	this.ID = "danie";
	
	// Character stats
	this.name = "Danie";
	
	//this.avatar.combat = new Image();
	
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
	this.SetExpToLevel();
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 9;
	this.Butt().buttSize.base = 7;
	this.body.SetRace(Race.Sheep);
	TF.SetAppendage(this.Appendages(), AppendageType.horn, Race.Sheep, Color.gray, 2);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Sheep, Color.black);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = 0;

	if(storage) this.FromStorage(storage);
}
Danie.prototype = new Entity();
Danie.prototype.constructor = Danie;


Danie.prototype.FromStorage = function(storage) {
	this.body.FromStorage(storage.body);
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Danie.prototype.ToStorage = function() {
	var storage = {};
	
	this.SaveBodyPartial(storage, {ass: true, vag: true});
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}


// Schedule
Danie.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction
Danie.prototype.Interact = function() {
	Text.Clear();
	Text.Add("Baah Imma sheep.");
	
	
	if(GetDEBUG()) {
		Text.NL();
		Text.Add("DEBUG: relation: " + danie.relation.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: subDom: " + danie.subDom.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: slut: " + danie.slut.Get(), null, 'bold');
		Text.NL();
	}
	Text.Flush();
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
}

export { Danie };
