
let PerkIds : { [index:string] : Perk } = {};

export class Perk {
	id : string;
	name : string;

	constructor(id : string, name : string) {
		this.id   = id;
		this.name = name;
		
		PerkIds[id] = this;
	}
}

export namespace Perks {
	export const Virility  = new Perk("vir0", "Virility");
	export const Fertility = new Perk("fer0", "Fertility");
	export const Breeder   = new Perk("bre0", "Breeder");
	export const Fleetfoot = new Perk("flee0", "Fleetfoot");
}

export { PerkIds };
