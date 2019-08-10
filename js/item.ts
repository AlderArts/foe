import * as _ from 'lodash';

import { DamageType } from './damagetype';
import { StatusEffect, Status } from './statuseffect';
import { Entity } from './entity';
import { Text } from './text';

let ItemIds : any = {};
//Represents the overall category an item falls under.
let ItemType : {[index:string] : string } = {
	Weapon     : "Weapons",
	Armor      : "Armors",
	Accessory  : "Accessories",
	Potion     : "Potions",
	Card       : "Cards",
	Ingredient : "Ingredients",
	Quest      : "Quest Items",
	Toy        : "Toys",
	Misc       : "Misc", //Default catch all for all items. Should strive to not have this on any items though.
};
//Represents a second level of categorization for items.
//FIXME Attempt to remove Acc1/Acc2 from here. They can exist on entity, but shouldn't exist as a type in items.
let ItemSubtype : {[index:string] : any } = {
	FullArmor : "Full Armors",
	TopArmor  : "Top Armors",
	BotArmor  : "Bottom Armors",
	Acc1      : 5,
	Acc2      : 6,
	StrapOn   : "Strapons",
	Dildo	  : "Dildos",
	None	  : "None", //Should be default case for all items
};

export class Item {
	id : string;
	name : string;
	type : any;
	image : any;
	price : number;
	subtype : any;
	recipe : any[];
	Use : any;
	effect : any;
	isTF : boolean;

	constructor(id : string, name : string, type : any) {
		//Required (An item will always have these)
		this.id     = id;
		this.name   = name;
		this.type   = type || ItemType.Misc;

		//Optional, with default
		this.image  = new Image(); // TODO This sounds interesting, so i'll look into it later.
		this.price  = 0;
		this.subtype = ItemSubtype.None;
		// Alchemical recipe, an array of {it: Item, num: Number} pairs
		this.recipe = []; //TODO Maybe should be set to null. I'll look into how recipes are used later.

		//Optional, No default (don't forget your null checks if you're working with these!)
		//function(target)
		this.Use        = null;


		/*
		* effect = {
		*   maxHp
		*   maxSp
		*   maxLust
		*   strength
		*   stamina
		*   dexterity
		*   intelligence
		*   spirit
		*   libido
		*   charisma
		*
		*   atkMod
		*   defMod
		*   statusDef
		* }
		*/
		this.effect = {};
		this.effect.statusDef = [];

		if(!id) {
			console.log("Item '" + name + "' has no id.");
		}
		if(ItemIds[id]) {
			console.log("Item '" + id + "' is already registered.");
		}
		ItemIds[id] = this;
	}

	//function(target)
	Equip(target : Entity) {
		if(this.effect.maxHp)        target.maxHp.bonus         += this.effect.maxHp;
		if(this.effect.maxSp)        target.maxSp.bonus         += this.effect.maxSp;
		if(this.effect.maxLust)      target.maxLust.bonus       += this.effect.maxLust;

		if(this.effect.strength)     target.strength.bonus      += this.effect.strength;
		if(this.effect.stamina)      target.stamina.bonus       += this.effect.stamina;
		if(this.effect.dexterity)    target.dexterity.bonus     += this.effect.dexterity;
		if(this.effect.intelligence) target.intelligence.bonus  += this.effect.intelligence;
		if(this.effect.spirit)       target.spirit.bonus        += this.effect.spirit;

		if(this.effect.libido)       target.libido.bonus        += this.effect.libido;
		if(this.effect.charisma)     target.charisma.bonus      += this.effect.charisma;

		if(this.effect.atkMod)       target.atkMod += this.effect.atkMod;
		if(this.effect.defMod)       target.defMod += this.effect.defMod;

		// Elemental attack
		target.elementAtk.Add(new DamageType({
			pSlash   : this.effect.apSlash,
			pBlunt   : this.effect.apBlunt,
			pPierce  : this.effect.apPierce,
			mVoid    : this.effect.amVoid,
			mFire    : this.effect.amFire,
			mIce     : this.effect.amIce,
			mThunder : this.effect.amThunder,
			mEarth   : this.effect.amEarth,
			mWater   : this.effect.amWater,
			mWind    : this.effect.amWind,
			mLight   : this.effect.amLight,
			mDark    : this.effect.amDark,
			mNature  : this.effect.amNature,
			lust     : this.effect.alust
		}));

		// Elemental defense
		target.elementDef.Add(new DamageType({
			pSlash   : this.effect.dpSlash,
			pBlunt   : this.effect.dpBlunt,
			pPierce  : this.effect.dpPierce,
			mVoid    : this.effect.dmVoid,
			mFire    : this.effect.dmFire,
			mIce     : this.effect.dmIce,
			mThunder : this.effect.dmThunder,
			mEarth   : this.effect.dmEarth,
			mWater   : this.effect.dmWater,
			mWind    : this.effect.dmWind,
			mLight   : this.effect.dmLight,
			mDark    : this.effect.dmDark,
			mNature  : this.effect.dmNature,
			lust     : this.effect.dlust
		}));
		
		if(this.effect.statusDef.length > 0) {
			for(var i = 0; i < StatusEffect.LAST; i++) {
				var inc = this.effect.statusDef[i];
				if(inc) {
					if(target.statusDefGear[i]) {
						target.statusDefGear[i] += inc;
					}
					else {
						target.statusDefGear[i] = inc;
					}
				}
			}
		}
	}

	ShowEquipStats() {
		Text.AddDiv("["+this.name+"]", null, "itemTypeHeader");
		Text.AddDiv(this.Short(), null, "itemSubtypeHeader");
		if(this.effect.atkMod) Text.AddDiv("Atk: " + this.effect.atkMod, null, "itemName");
		if(this.effect.defMod) Text.AddDiv("Def: " + this.effect.defMod, null, "itemName");

		if(this.effect.apSlash)   Text.AddDiv("Slash.Atk: "   + this.effect.apSlash,   null, "itemName");
		if(this.effect.apBlunt)   Text.AddDiv("Blunt.Atk: "   + this.effect.apBlunt,   null, "itemName");
		if(this.effect.apPierce)  Text.AddDiv("Pierce.Atk: "  + this.effect.apPierce,  null, "itemName");
		if(this.effect.amVoid)    Text.AddDiv("Void.Atk: "    + this.effect.amVoid,    null, "itemName");
		if(this.effect.amFire)    Text.AddDiv("Fire.Atk: "    + this.effect.amFire,    null, "itemName");
		if(this.effect.amIce)     Text.AddDiv("Ice.Atk: "     + this.effect.amIce,     null, "itemName");
		if(this.effect.amThunder) Text.AddDiv("Thunder.Atk: " + this.effect.amThunder, null, "itemName");
		if(this.effect.amEarth)   Text.AddDiv("Earth.Atk: "   + this.effect.amEarth,   null, "itemName");
		if(this.effect.amWater)   Text.AddDiv("Water.Atk: "   + this.effect.amWater,   null, "itemName");
		if(this.effect.amWind)    Text.AddDiv("Wind.Atk: "    + this.effect.amWind,    null, "itemName");
		if(this.effect.amLight)   Text.AddDiv("Light.Atk: "   + this.effect.amLight,   null, "itemName");
		if(this.effect.amDark)    Text.AddDiv("Dark.Atk: "    + this.effect.amDark,    null, "itemName");
		if(this.effect.amNature)  Text.AddDiv("Nature.Atk: "  + this.effect.amNature,  null, "itemName");
		if(this.effect.alust)     Text.AddDiv("Lust.Atk: "    + this.effect.alust,     null, "itemName");

		if(this.effect.dpSlash)   Text.AddDiv("Slash.Def: "   + this.effect.dpSlash,   null, "itemName");
		if(this.effect.dpBlunt)   Text.AddDiv("Blunt.Def: "   + this.effect.dpBlunt,   null, "itemName");
		if(this.effect.dpPierce)  Text.AddDiv("Pierce.Def: "  + this.effect.dpPierce,  null, "itemName");
		if(this.effect.dmVoid)    Text.AddDiv("Void.Def: "    + this.effect.dmVoid,    null, "itemName");
		if(this.effect.dmFire)    Text.AddDiv("Fire.Def: "    + this.effect.dmFire,    null, "itemName");
		if(this.effect.dmIce)     Text.AddDiv("Ice.Def: "     + this.effect.dmIce,     null, "itemName");
		if(this.effect.dmThunder) Text.AddDiv("Thunder.Def: " + this.effect.dmThunder, null, "itemName");
		if(this.effect.dmEarth)   Text.AddDiv("Earth.Def: "   + this.effect.dmEarth,   null, "itemName");
		if(this.effect.dmWater)   Text.AddDiv("Water.Def: "   + this.effect.dmWater,   null, "itemName");
		if(this.effect.dmWind)    Text.AddDiv("Wind.Def: "    + this.effect.dmWind,    null, "itemName");
		if(this.effect.dmLight)   Text.AddDiv("Light.Def: "   + this.effect.dmLight,   null, "itemName");
		if(this.effect.dmDark)    Text.AddDiv("Dark.Def: "    + this.effect.dmDark,    null, "itemName");
		if(this.effect.dmNature)  Text.AddDiv("Nature.Def: "  + this.effect.dmNature,  null, "itemName");
		if(this.effect.dlust)     Text.AddDiv("Lust.Def: "    + this.effect.dlust,     null, "itemName");

		if(this.effect.maxHp)        Text.AddDiv("HP: "  + this.effect.maxHp,        null, "itemName");
		if(this.effect.maxSp)        Text.AddDiv("SP: "  + this.effect.maxSp,        null, "itemName");
		if(this.effect.maxLust)      Text.AddDiv("LP: "  + this.effect.maxLust,      null, "itemName");
		if(this.effect.strength)     Text.AddDiv("Str: " + this.effect.strength,     null, "itemName");
		if(this.effect.stamina)      Text.AddDiv("Sta: " + this.effect.stamina,      null, "itemName");
		if(this.effect.dexterity)    Text.AddDiv("Dex: " + this.effect.dexterity,    null, "itemName");
		if(this.effect.intelligence) Text.AddDiv("Int: " + this.effect.intelligence, null, "itemName");
		if(this.effect.spirit)       Text.AddDiv("Spi: " + this.effect.spirit,       null, "itemName");
		if(this.effect.libido)       Text.AddDiv("Lib: " + this.effect.libido,       null, "itemName");
		if(this.effect.charisma)     Text.AddDiv("Cha: " + this.effect.charisma,     null, "itemName");
		
		for(var i = 0; i < StatusEffect.LAST; i++) {
			if(this.effect.statusDef[i]) {
				Text.AddDiv(Status.Keys[i] + ".Def: " + this.effect.statusDef[i], null, "itemName");
			}
		}
	}

	sDesc() { return this.name; }
	lDesc() { return this.name; }
	Short() { return _.capitalize(this.sDesc()); }
	Long() { return _.capitalize(this.lDesc()); }

}

//TODO Possibly reformat items array to just contain items instead of [{it:item, num:x}], so this function be can made a generic Array.prototype.sortByProp for sorting any array of objects by prop.
function compareItemByProp(p : any){
	return function(a : any, b : any){
		return (a.it[p] > b.it[p]) ? 1 : (a.it[p] < b.it[p]) ? -1 : 0;
	}
}

export { ItemType, ItemSubtype, ItemIds, compareItemByProp };
