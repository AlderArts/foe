
let Perks = {};

let PerkIds = {};

function Perk(id, name) {
	this.id   = id;
	this.name = name;
	
	PerkIds[id] = this;
}




Perks.Virility  = new Perk("vir0", "Virility");
Perks.Fertility = new Perk("fer0", "Fertility");
Perks.Breeder   = new Perk("bre0", "Breeder");
Perks.Fleetfoot = new Perk("flee0", "Fleetfoot");

export { Perk, PerkIds, Perks };
