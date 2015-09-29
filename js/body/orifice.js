
Capacity = {
	tight  : 2,
	loose  : 5,
	gaping : 10
};

function Orifice() {
	this.capacity   = new Stat(4);
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