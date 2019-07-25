
import { Stat } from '../stat';
import { Womb } from '../pregnancy';
import { Text } from '../text';

var Capacity = {
	tight  : 2,
	loose  : 5,
	gaping : 10
};

function Orifice() {
	this.capacity   = new Stat(6);
	this.minStretch = new Stat(1);
	this.stretch    = new Stat(1);
	this.womb       = new Womb();
	this.virgin     = true;
}


Orifice.Tightness = {
	tight    : 1,
	flexible : 2,
	loose    : 3,
	gaping   : 4
}

Orifice.prototype.ToStorage = function(full) {
	var storage = {
		cap    : this.capacity.base.toFixed(2),
		str    : this.stretch.base.toFixed(2),
		virgin : this.virgin ? 1 : 0
	};
	if(full) {
		storage.mstr = this.minStretch.base.toFixed(2);
	}
	return storage;
}

Orifice.prototype.FromStorage = function(storage) {
	storage = storage || {};
	this.capacity.base   = parseFloat(storage.cap)  || this.capacity.base;
	this.minStretch.base = parseFloat(storage.mstr) || this.minStretch.base;
	this.stretch.base    = parseFloat(storage.str)  || this.stretch.base;
	this.virgin          = storage.hasOwnProperty("virgin") ? parseInt(storage.virgin) == 1 : this.virgin;
}

Orifice.prototype.Capacity = function() {
	return this.capacity.Get();
}
Orifice.prototype.Cap = function() {
	return this.capacity.Get() * this.stretch.Get();
}
Orifice.prototype.Pregnant = function() {
	return this.womb.pregnant;
}
// TODO
Orifice.prototype.Fits = function(cock, extension) {
	extension = extension || 0;
	return cock.Thickness() <= (this.Cap() + extension);
}
Orifice.prototype.Tightness = function() {
	return this.stretch.Get();
}
Orifice.prototype.HandleStretchOverTime = function(hours) {
	//TODO rate
	this.stretch.DecreaseStat(this.minStretch.Get(), hours * 0.05);
}

Orifice.prototype.StretchOrifice = function(entity, cock, silent) {
	var parse = {
		poss : entity.Possessive(),
		or   : this.holeDesc()
	};
	
	var stretch = this.Tightness();
	var thk     = cock.Thickness();
	var cap     = this.Cap();
	var ratio   = thk / cap;
	
	if(ratio < 0.5)
		this.stretch.IncreaseStat(Orifice.Tightness.flexible, 0.25);
	else if(ratio < 1)
		this.stretch.IncreaseStat(Orifice.Tightness.loose, 0.5);
	else
		this.stretch.IncreaseStat(Orifice.Tightness.gaping, 0.75);
	
	if(!silent) {
		var stretch2 = this.Tightness();
		if(stretch < Orifice.Tightness.flexible && stretch2 >= Orifice.Tightness.flexible) {
			Text.Add("<b>[poss] [or] has become loose.</b>", parse);
			Text.NL();
		}
		if(stretch < Orifice.Tightness.loose && stretch2 >= Orifice.Tightness.loose) {
			Text.Add("<b>[poss] [or] has become gaping.</b>", parse);
			Text.NL();
		}
	}
}

//Should be overridden
Orifice.prototype.holeDesc = function() {
	return "ORIFICE";
}

export {Orifice, Capacity};
