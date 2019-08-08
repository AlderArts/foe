
let Perks : any = {};

let PerkIds : any = {};

export class Perk {
	id : string;
	name : string;
	constructor(id : string, name : string) {
		this.id   = id;
		this.name = name;
		
		PerkIds[id] = this;
	}
}




Perks.Virility  = new Perk("vir0", "Virility");
Perks.Fertility = new Perk("fer0", "Fertility");
Perks.Breeder   = new Perk("bre0", "Breeder");
Perks.Fleetfoot = new Perk("flee0", "Fleetfoot");

export { PerkIds, Perks };
