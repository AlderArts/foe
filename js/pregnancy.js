/*
 * Pregnancy handler
 */

function PregnancyHandler(entity, storage) {
	this.entity = entity;
	
	this.gestationRate = 0;
	this.fertility     = new Stat(0.3);
	
	if(storage) this.FromStorage(storage);
}

PregnancyHandler.Slot = {
	Butt : 0,
	Vag  : 1
};

PregnancyHandler.prototype.ToStorage = function() {
	var storage = {
		gr : this.gestationRate.toFixed(2),
		f  : this.fertility.base.toFixed(2)
	};
	
	return storage;
}

PregnancyHandler.prototype.FromStorage = function(storage) {
	if(storage.gr) this.gestationRate  = parseFloat(storage.gr);
	if(storage.f)  this.fertility.base = parseFloat(storage.f);
}

PregnancyHandler.prototype.Impregnate = function(opts) {
	var mother = this.entity;
	opts = opts || {};
	
	var slot = opts.slot || PregnancyHandler.Slot.Butt;
	var womb = null;
	if     (slot == PregnancyHandler.Slot.Butt) womb = mother.Butt().womb;
	else if(slot == PregnancyHandler.Slot.Vag)  womb = mother.FirstVag().womb;
	// TODO: multivag?
	
	if(!womb)         return false;
	if(womb.pregnant) return false;
	
	// TODO: Check for sterility, herbs etc
	
	var fertility = (this.fertility * father.Virility() * Math.sqrt(opts.load));
	
	if(opts.force || Math.random() < fertility) {
		womb.pregnant = true;
		
		var litterSize = opts.num || 1;
		
		Sex.Preg(father, mother, litterSize);
		
		// TODO: start pregnancy
		
		return true;
	}
	else
		return false;
}

PregnancyHandler.prototype.Update = function(step) {
	
}
