import * as _ from "lodash";

import { DamageType } from "./damagetype";
import { Entity } from "./entity";
import { Status, StatusEffect } from "./statuseffect";
import { Text } from "./text";

export interface IItemQuantity {
	it: Item;
	num?: number;
}

const ItemIds: any = {};
// Represents the overall category an item falls under.
export enum ItemType {
	Weapon     = "Weapons",
	Armor      = "Armors",
	Accessory  = "Accessories",
	Potion     = "Potions",
	Card       = "Cards",
	Ingredient = "Ingredients",
	Quest      = "Quest Items",
	Toy        = "Toys",
	Misc       = "Misc", // Default catch all for all items. Should strive to not have this on any items though.
}
// Represents a second level of categorization for items.
// FIXME Attempt to remove Acc1/Acc2 from here. They can exist on entity, but shouldn't exist as a type in items.
export enum ItemSubtype {
	FullArmor = "Full Armors",
	TopArmor  = "Top Armors",
	BotArmor  = "Bottom Armors",
	Acc1      = 5,
	Acc2      = 6,
	StrapOn   = "Strapons",
	Dildo	  = "Dildos",
	None	  = "None", // Should be default case for all items
}

export class Item {
	public id: string;
	public name: string;
	public type: ItemType;
	public image: any;
	public price: number;
	public subtype: ItemSubtype;
	public recipe: IItemQuantity[];
	public Use: any;
	public effect: any;
	public isTF: boolean;

	constructor(id: string, name: string, type: ItemType) {
		// Required (An item will always have these)
		this.id     = id;
		this.name   = name;
		this.type   = type || ItemType.Misc;

		// Optional, with default
		this.image  = new Image(); // TODO This sounds interesting, so i'll look into it later.
		this.price  = 0;
		this.subtype = ItemSubtype.None;
		// Alchemical recipe, an array of {it: Item, num: Number} pairs
		this.recipe = [];

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

		if (!id) {
			// console.log("Item '" + name + "' has no id.");
		}
		if (ItemIds[id]) {
			// console.log("Item '" + id + "' is already registered.");
		}
		ItemIds[id] = this;
	}

	// function(target)
	public Equip(target: Entity) {
		if (this.effect.maxHp) {        target.maxHp.bonus         += this.effect.maxHp; }
		if (this.effect.maxSp) {        target.maxSp.bonus         += this.effect.maxSp; }
		if (this.effect.maxLust) {      target.maxLust.bonus       += this.effect.maxLust; }

		if (this.effect.strength) {     target.strength.bonus      += this.effect.strength; }
		if (this.effect.stamina) {      target.stamina.bonus       += this.effect.stamina; }
		if (this.effect.dexterity) {    target.dexterity.bonus     += this.effect.dexterity; }
		if (this.effect.intelligence) { target.intelligence.bonus  += this.effect.intelligence; }
		if (this.effect.spirit) {       target.spirit.bonus        += this.effect.spirit; }

		if (this.effect.libido) {       target.libido.bonus        += this.effect.libido; }
		if (this.effect.charisma) {     target.charisma.bonus      += this.effect.charisma; }

		if (this.effect.atkMod) {       target.atkMod += this.effect.atkMod; }
		if (this.effect.defMod) {       target.defMod += this.effect.defMod; }

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
			lust     : this.effect.alust,
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
			lust     : this.effect.dlust,
		}));

		if (this.effect.statusDef.length > 0) {
			for (let i = 0; i < StatusEffect.LAST; i++) {
				const inc = this.effect.statusDef[i];
				if (inc) {
					if (target.statusDefGear[i]) {
						target.statusDefGear[i] += inc;
					} else {
						target.statusDefGear[i] = inc;
					}
				}
			}
		}
	}

	public ShowEquipStats() {
		Text.AddDiv("[" + this.name + "]", undefined, "itemTypeHeader");
		Text.AddDiv(this.Short(), undefined, "itemSubtypeHeader");
		if (this.effect.atkMod) { Text.AddDiv("Atk: " + this.effect.atkMod, undefined, "itemName"); }
		if (this.effect.defMod) { Text.AddDiv("Def: " + this.effect.defMod, undefined, "itemName"); }

		if (this.effect.apSlash) {   Text.AddDiv("Slash.Atk: "   + this.effect.apSlash,   undefined, "itemName"); }
		if (this.effect.apBlunt) {   Text.AddDiv("Blunt.Atk: "   + this.effect.apBlunt,   undefined, "itemName"); }
		if (this.effect.apPierce) {  Text.AddDiv("Pierce.Atk: "  + this.effect.apPierce,  undefined, "itemName"); }
		if (this.effect.amVoid) {    Text.AddDiv("Void.Atk: "    + this.effect.amVoid,    undefined, "itemName"); }
		if (this.effect.amFire) {    Text.AddDiv("Fire.Atk: "    + this.effect.amFire,    undefined, "itemName"); }
		if (this.effect.amIce) {     Text.AddDiv("Ice.Atk: "     + this.effect.amIce,     undefined, "itemName"); }
		if (this.effect.amThunder) { Text.AddDiv("Thunder.Atk: " + this.effect.amThunder, undefined, "itemName"); }
		if (this.effect.amEarth) {   Text.AddDiv("Earth.Atk: "   + this.effect.amEarth,   undefined, "itemName"); }
		if (this.effect.amWater) {   Text.AddDiv("Water.Atk: "   + this.effect.amWater,   undefined, "itemName"); }
		if (this.effect.amWind) {    Text.AddDiv("Wind.Atk: "    + this.effect.amWind,    undefined, "itemName"); }
		if (this.effect.amLight) {   Text.AddDiv("Light.Atk: "   + this.effect.amLight,   undefined, "itemName"); }
		if (this.effect.amDark) {    Text.AddDiv("Dark.Atk: "    + this.effect.amDark,    undefined, "itemName"); }
		if (this.effect.amNature) {  Text.AddDiv("Nature.Atk: "  + this.effect.amNature,  undefined, "itemName"); }
		if (this.effect.alust) {     Text.AddDiv("Lust.Atk: "    + this.effect.alust,     undefined, "itemName"); }

		if (this.effect.dpSlash) {   Text.AddDiv("Slash.Def: "   + this.effect.dpSlash,   undefined, "itemName"); }
		if (this.effect.dpBlunt) {   Text.AddDiv("Blunt.Def: "   + this.effect.dpBlunt,   undefined, "itemName"); }
		if (this.effect.dpPierce) {  Text.AddDiv("Pierce.Def: "  + this.effect.dpPierce,  undefined, "itemName"); }
		if (this.effect.dmVoid) {    Text.AddDiv("Void.Def: "    + this.effect.dmVoid,    undefined, "itemName"); }
		if (this.effect.dmFire) {    Text.AddDiv("Fire.Def: "    + this.effect.dmFire,    undefined, "itemName"); }
		if (this.effect.dmIce) {     Text.AddDiv("Ice.Def: "     + this.effect.dmIce,     undefined, "itemName"); }
		if (this.effect.dmThunder) { Text.AddDiv("Thunder.Def: " + this.effect.dmThunder, undefined, "itemName"); }
		if (this.effect.dmEarth) {   Text.AddDiv("Earth.Def: "   + this.effect.dmEarth,   undefined, "itemName"); }
		if (this.effect.dmWater) {   Text.AddDiv("Water.Def: "   + this.effect.dmWater,   undefined, "itemName"); }
		if (this.effect.dmWind) {    Text.AddDiv("Wind.Def: "    + this.effect.dmWind,    undefined, "itemName"); }
		if (this.effect.dmLight) {   Text.AddDiv("Light.Def: "   + this.effect.dmLight,   undefined, "itemName"); }
		if (this.effect.dmDark) {    Text.AddDiv("Dark.Def: "    + this.effect.dmDark,    undefined, "itemName"); }
		if (this.effect.dmNature) {  Text.AddDiv("Nature.Def: "  + this.effect.dmNature,  undefined, "itemName"); }
		if (this.effect.dlust) {     Text.AddDiv("Lust.Def: "    + this.effect.dlust,     undefined, "itemName"); }

		if (this.effect.maxHp) {        Text.AddDiv("HP: "  + this.effect.maxHp,        undefined, "itemName"); }
		if (this.effect.maxSp) {        Text.AddDiv("SP: "  + this.effect.maxSp,        undefined, "itemName"); }
		if (this.effect.maxLust) {      Text.AddDiv("LP: "  + this.effect.maxLust,      undefined, "itemName"); }
		if (this.effect.strength) {     Text.AddDiv("Str: " + this.effect.strength,     undefined, "itemName"); }
		if (this.effect.stamina) {      Text.AddDiv("Sta: " + this.effect.stamina,      undefined, "itemName"); }
		if (this.effect.dexterity) {    Text.AddDiv("Dex: " + this.effect.dexterity,    undefined, "itemName"); }
		if (this.effect.intelligence) { Text.AddDiv("Int: " + this.effect.intelligence, undefined, "itemName"); }
		if (this.effect.spirit) {       Text.AddDiv("Spi: " + this.effect.spirit,       undefined, "itemName"); }
		if (this.effect.libido) {       Text.AddDiv("Lib: " + this.effect.libido,       undefined, "itemName"); }
		if (this.effect.charisma) {     Text.AddDiv("Cha: " + this.effect.charisma,     undefined, "itemName"); }

		for (let i = 0; i < StatusEffect.LAST; i++) {
			if (this.effect.statusDef[i]) {
				Text.AddDiv(Status.Keys[i] + ".Def: " + this.effect.statusDef[i], undefined, "itemName");
			}
		}
	}

	public sDesc() { return this.name; }
	public lDesc() { return this.name; }
	public Short() { return _.capitalize(this.sDesc()); }
	public Long() { return _.capitalize(this.lDesc()); }

}

// TODO Possibly reformat items array to just contain items instead of [{it:item, num:x}], so this function be can made a generic Array.prototype.sortByProp for sorting any array of objects by prop.
function compareItemByProp(p: any) {
	return (a: any, b: any) => {
		return (a.it[p] > b.it[p]) ? 1 : (a.it[p] < b.it[p]) ? -1 : 0;
	};
}

export { ItemIds, compareItemByProp };
