/*
 * 
 * Define Terry
 * 
 */
function Terry(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Thief";
	
	this.avatar.combat = Images.terry;
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 10;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 23;
	this.stamina.base      = 19;
	this.dexterity.base    = 19;
	this.intelligence.base = 12;
	this.spirit.base       = 11;
	this.libido.base       = 24;
	this.charisma.base     = 14;
	
	this.level    = 1;
	this.sexlevel = 1;
	
	this.body.DefMale();
	this.Butt().buttSize.base = 7;
	this.FirstCock().length.base = 28;
	this.FirstCock().thickness.base = 7;
	this.body.SetRace(Race.fox);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = 0;
	
	if(storage) this.FromStorage(storage);
}
Terry.prototype = new Entity();
Terry.prototype.constructor = Terry;

Terry.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.virgin) == 1;
	this.subDom.base         = parseFloat(storage.subDom)  || this.subDom.base;
	this.slut.base           = parseFloat(storage.slut)    || this.slut.base;
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
	for(var flag in storage.sex)
		this.sex[flag] = parseInt(storage.sex[flag]);
}

Terry.prototype.ToStorage = function() {
	var storage = {
		virgin : this.Butt().virgin ? 1 : 0
	};
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	storage.sex   = this.SaveSexStats();
	
	return storage;
}
