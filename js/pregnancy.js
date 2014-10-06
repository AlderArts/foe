/*
 * Pregnancy handler
 */

// TODO: Needs some timers/callbacks
function Womb() {
	// In progress offspring
	this.litterSize = 0;
	this.litterRace = Race.human;
	this.pregnant   = false;
	// TODO: TIMER
	this.progress     = 0;
	this.hoursToBirth = 0;
	this.triggered    = false;
}
Womb.prototype.Short = function() {
	return "womb";
}
Womb.prototype.Desc = function() {
	
}


function PregnancyHandler(entity, storage) {
	this.entity = entity;
	
	this.gestationRate = new Stat(1);
	this.fertility     = new Stat(0.3);
	
	if(storage) this.FromStorage(storage);
}

PregnancyHandler.Slot = {
	Vag  : 0,
	Butt : 999
};

PregnancyHandler.prototype.ToStorage = function() {
	var storage = {
		gr : this.gestationRate.base.toFixed(2),
		f  : this.fertility.base.toFixed(2)
	};
	
	var womb = [];
	
	var vags = this.entity.AllVags();
	for(var i = 0; i < vags.length; ++i) {
		var w = vags[i].womb;
		if(w && w.pregnant) {
			womb.push({
				slot : PregnancyHandler.Slot.Vag + i,
				litS : w.litterSize,
				litR : w.litterRace
			});
		}
	}
	var w = this.entity.Butt().womb;
	if(w && w.pregnant) {
		womb.push({
			slot : PregnancyHandler.Slot.Butt,
			litS : w.litterSize,
			litR : w.litterRace
		});
	}
	
	if(womb.length > 0)
		storage.womb = womb;
	
	return storage;
}

PregnancyHandler.prototype.FromStorage = function(storage) {
	storage = storage || {};
	
	if(storage.gr) this.gestationRate.base = parseFloat(storage.gr);
	if(storage.f)  this.fertility.base     = parseFloat(storage.f);
	
	if(storage.womb) {
		var vags = this.entity.AllVags();
		
		for(var i = 0; i < storage.womb.length; ++i) {
			var w    = storage.womb[i];
			var slot = parseInt(w.slot);
			var wPtr = null;
			if(slot >= PregnancyHandler.Slot.Vag && slot < PregnancyHandler.Slot.Butt) {
				var idx = slot - PregnancyHandler.Slot.Vag;
				if(idx >= 0 && idx < vags.length)
					wPtr = vags[idx];
			}
			else if(slot == PregnancyHandler.Slot.Butt)
				wPtr = this.entity.Butt().womb;
			
			if(wPtr) {
				wPtr.litterSize = parseInt(w.litS)  || wPtr.litterSize;
				wPtr.litterRace = parseInt(w.litR)  || wPtr.litterRace;
				wPtr.pregnant   = true;
				wPtr.progress   = parseFloat(w.prog);
			}
		}
	}
}

/*
 * opts:
 * 	slot   := PregnancyHandler.Slot
 */
PregnancyHandler.prototype.Womb = function(opts) {
	opts = opts || {};
	var slot = opts.slot || PregnancyHandler.Slot.Vag;
	var womb = null;
	if     (slot <  PregnancyHandler.Slot.Butt) {
		var vag = this.entity.AllVags()[slot];
		if(vag)
			womb = vag.womb;
	}
	else if(slot == PregnancyHandler.Slot.Butt) womb = this.entity.Butt().womb;
	
	if(womb == null)  return false;

	return womb;
}

/*
 * opts:
 * 	slot   := PregnancyHandler.Slot
 */
PregnancyHandler.prototype.IsPregnant = function(opts) {
	opts = opts || {};
	var slot = opts.slot || PregnancyHandler.Slot.Vag;
	var womb = this.Womb();

	return womb.pregnant;
}

/*
 * opts:
 * 	slot   := PregnancyHandler.Slot
 * 	mother := Entity
 * 	father := Entity
 * 	num    := 1,2,3...
 * 	time   := time to birth in hours
 */
PregnancyHandler.prototype.Impregnate = function(opts) {
	opts = opts || {};
	var mother = opts.mother || this.entity;
	var father = opts.father;
	
	var slot = opts.slot || PregnancyHandler.Slot.Vag;
	var womb = null;
	if     (slot <  PregnancyHandler.Slot.Butt) {
		var vag = mother.AllVags()[slot];
		if(vag)
			womb = vag.womb;
	}
	else if(slot == PregnancyHandler.Slot.Butt) womb = mother.Butt().womb;
	
	if(womb == null)  return false;
	if(womb.pregnant) return false;
	
	// TODO: Check for sterility, herbs etc
	
	var fertility = (this.fertility * father.Virility() * Math.sqrt(opts.load));
	
	if(opts.force || Math.random() < fertility) {
		
		// TODO: Adjust litterSize
		var litterSize = opts.num || 1;
		litterSize = Math.floor(litterSize);
		litterSize = Math.max(litterSize, 1);

		var litterRace = Race.human; // TODO TEMP

		var gestationPeriod = opts.time || 24; //TODO TEMP
		
		
		Sex.Preg(father, mother, litterSize);
		
		// TODO: start pregnancy
		womb.pregnant     = true;
		womb.triggered    = false;
		womb.progress     = 0;
		womb.hoursToBirth = gestationPeriod;
		womb.litterSize   = litterSize;
		womb.litterRace   = litterRace;
		
		return true;
	}
	else
		return false;
}

PregnancyHandler.prototype.Update = function(hours) {
	hours = hours || 0;
	hours *= this.gestationRate.Get();
	
	var ent = this.entity;
	
	var vags = ent.AllVags();
	for(var i = 0; i < vags.length; ++i) {
		var womb = vags[i].womb;
		if(womb.pregnant && !womb.triggered) {
			womb.progress     += (1-womb.progress) * hours / womb.hoursToBirth;
			womb.hoursToBirth -= hours;
			// Check for completion
			if(womb.hoursToBirth <= 0) {
				womb.triggered = true;
				
				// Use unshift instead of push to make sure pregnancy doesn't interfere with scene progression
				Gui.Callstack.unshift(function() {
					womb.pregnant = false;
					ent.PregnancyTrigger(womb, PregnancyHandler.Slot.Vag);
				});
			}
		}
	}
	var womb = ent.Butt().womb;
	if(womb.pregnant && !womb.triggered) {
		womb.progress     += (1-womb.progress) * hours / womb.hoursToBirth;
		womb.hoursToBirth -= hours;
		// Check for completion
		if(womb.hoursToBirth <= 0) {
			womb.triggered = true;
			
			// Use unshift instead of push to make sure pregnancy doesn't interfere with scene progression
			Gui.Callstack.unshift(function() {
				womb.pregnant = false;
				ent.PregnancyTrigger(womb, PregnancyHandler.Slot.Butt);
			});
		}
	}
}

PregnancyHandler.prototype.BellySize = function() {
	var size = 0;
	
	var vags = this.entity.AllVags();
	for(var i = 0; i < vags.length; ++i) {
		var womb = vags[i].womb;
		if(womb.pregnant) {
			//TODO: adjust for gene size
			size += womb.progress * Math.sqrt(womb.litterSize);
		}
	}
	var womb = this.entity.Butt().womb;
	if(womb.pregnant) {
		//TODO: adjust for gene size
		size += womb.progress * Math.sqrt(womb.litterSize);
	}
	
	return size;
}
