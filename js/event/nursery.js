
function Nursery(storage) {
	this.kids = [];
	this.flags = {};
	
	if(storage) this.FromStorage(storage);
}

Nursery.prototype.ToStorage = function() {
	var storage = {};
	if(this.TotalKids() > 0) {
		var kids = [];
		_.each(this.kids, function(kid) {
			kids.push(kid.ToStorage());
		});
		storage.kids = kids;
	}
	var flags = {};
	for(var flag in this.flags) {
		if(this.flags[flag] != 0)
			flags[flag] = this.flags[flag];
	}
	storage.flags = flags;
	
	return storage;
}

Nursery.prototype.FromStorage = function(storage) {
	var that = this;
	storage = storage || {};
	var kids = storage.kids;
	_.each(kids, function(kid) {
		var k = new Nursery.Kid(kid);
		that.kids.push(k);
	});
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Nursery.prototype.PCbirthed = function() {
	var ret = [];
	_.each(this.kids, function(kid) {
		if(kid.mother == "player") ret.push(kid);
	});
	return ret;
}
Nursery.prototype.PCfathered = function() {
	var ret = [];
	_.each(this.kids, function(kid) {
		if(kid.father == "player") ret.push(kid);
	});
	return ret;
}
Nursery.prototype.TotalKids = function() {
	return this.kids.length;
}


Nursery.Kid = function(storage) {
	this.mother = null;
	this.father = null;
	this.num    = 1;
	this.race   = Race.Human;
	
	if(storage) this.FromStorage(storage);
}

Nursery.Kid.prototype.ToStorage = function() {
	var storage = {};
	if(this.mother) storage.m  = this.mother;
	if(this.father) storage.f  = this.father;
	if(this.num)    storage.nr = this.num.toFixed();
	if(this.race != Race.Human) storage.r = this.race.id.toFixed();
	return storage;
}

Nursery.Kid.prototype.FromStorage = function(storage) {
	storage = storage || {};
	if(storage.m)  this.mother = storage.m;
	if(storage.f)  this.father = storage.f;
	if(storage.nr) this.num    = parseInt(storage.nr);
	this.race = (storage.r === undefined) ? this.race : RaceDesc.IdToRace[parseInt(storage.r)];
}

Scenes.Nursery = {};

Scenes.Nursery.PrintPCbirthed = function() {
	var kids = nursery.PCbirthed();
	
	var parse = {};
	
	if(kids.length > 0) {
		Text.Add("<b>You’ve given birth to:</b>", parse);
		Text.NL();
		_.each(kids, function(kid) {
			parse["Num"] = _.capitalize(Text.NumToText(kid.num));
			parse["ren"] = kid.num > 1 ? "ren" : "";
			parse["race"] = kid.race.qShort()
			Text.Add("[Num] [race] child[ren]", parse);
			var father = Entity.IdToEntity(kid.father);
			if(father) {
				Text.Add(", fathered by " + father.name);
			}
			Text.Add(".<br/>", parse);
		});
		parse["number"] = Text.NumToText(kids.length);
		parse["ren"] = kids.length > 1 ? "ren" : "";
		Text.Add("<br/>For a total of [number] child[ren].", parse);
		Text.NL();
	}
}

Scenes.Nursery.PrintPCfathered = function() {
	var kids = nursery.PCfathered();
	
	if(kids.length > 0) {
		Text.Add("<b>You’ve fathered:</b>", parse);
		Text.NL();
		_.each(kids, function(kid) {
			parse["Num"] = _.capitalize(Text.NumToText(kid.num));
			parse["ren"] = kid.num > 1 ? "ren" : "";
			parse["race"] = kid.race.qShort()
			Text.Add("[Num] [race] child[ren]", parse);
			var mother = Entity.IdToEntity(kid.mother);
			if(mother) {
				Text.Add(", birthed by " + mother.name);
			}
			Text.Add(".<br/>", parse);
		});
		parse["number"] = Text.NumToText(kids.length);
		parse["ren"] = kids.length > 1 ? "ren" : "";
		Text.Add("<br/>For a total of [number] child[ren].", parse);
		Text.NL();
	}
}


// Pre gemstead


// TODO Post gemstead
