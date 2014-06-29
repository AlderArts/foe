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
	
	this.maxHp.base        = 50;
	this.maxSp.base        = 60;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 13;
	this.stamina.base      = 10;
	this.dexterity.base    = 24;
	this.intelligence.base = 15;
	this.spirit.base       = 13;
	this.libido.base       = 15;
	this.charisma.base     = 20;
	
	this.level    = 1;
	this.sexlevel = 1;
	
	this.body.DefMale();
	this.Butt().buttSize.base = 3;
	this.FirstCock().length.base = 11;
	this.FirstCock().thickness.base = 2.5;
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
		
	if(this.flags["Met"] != 0) {
		this.name = "Terry";
		this.avatar.combat = Images.terry_c;
	}
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

Scenes.Terry = {};

Scenes.Terry.ExploreGates = function() {
	
}
Scenes.Terry.ExploreResidential = function() {
	
}
Scenes.Terry.ExploreMerchants = function() {
	
}
Scenes.Terry.ExplorePlaza = function() {
	
}

