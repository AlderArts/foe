/*
 * 
 * Effect, contains a timer, callback function and parameters
 * 
 */
function Effect(funcCode, timer, obj) {
	this.code = funcCode;
	this.func = EffectCodeToFunc[funcCode];
	timer = timer || {};
	this.timer = new Time(timer.year, timer.season, timer.day, timer.hour, timer.minute);
	this.obj = obj;
}

Effect.prototype.ToStorage = function() {
	var storage = {};
	storage.func  = this.code;
	storage.timer = this.timer.ToStorage();
	storage.obj   = this.obj;
	return storage;
}

EffectFromStorage = function(storage) {
	var timer = new Time();
	timer.FromStorage(storage.timer);
	return new Effect(parseInt(storage.func), timer, storage.obj);
}

var EffectFuncCodes = {
	PregnancyRegular : 0
}

var EffectCodeToFunc = {};

// TODO
EffectCodeToFunc[EffectFuncCodes.PregnancyRegular] = function(obj) {
	Text.Add("Preggo! " + obj.mother);
	Text.Flush();
	Gui.NextPrompt();
	return true;
}
