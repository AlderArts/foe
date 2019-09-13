import * as _ from "lodash";

import { GetDEBUG } from "../app";
import { Encounter } from "./combat";
import { Entity } from "./entity";
import { GAME } from "./GAME";
import { Gui } from "./gui";
import { compareItemByProp, IItemQuantity, Item, ItemIds, ItemSubtype, ItemType } from "./item";
import { CombatItem } from "./items/combatitems";
import { ItemToy } from "./items/toy-item";
import { IChoice } from "./link";
import { Text } from "./text";

// Inventory
export class Inventory {

	// Divides items by their 'type'
	public static ItemByType(inv: IItemQuantity[], itemsByType?: any, usableItemsByType?: any, combatItemsByType?: any) {
		// Add all keys first. Ensures item output will be in whatever order our ItemType enum is in
		_.forIn(ItemType, (value, key) => {
			if (itemsByType) {
				itemsByType[value] = [];
			}
			if (usableItemsByType) {
				usableItemsByType[value] = [];
			}
			if (combatItemsByType) {
				combatItemsByType[value] = [];
			}
		});
		// Populate type arrays with items if they're defined
		for (const item of inv) {
			const it = item.it;
			if (itemsByType) {
				itemsByType[it.type].push(item);
			}
			if (usableItemsByType && it.Use) {
				usableItemsByType[it.type].push(item);
			}
			const itC = it as CombatItem;
			if (combatItemsByType && itC.combat) {
				combatItemsByType[it.type].push(item);
			}
		}
		// Clear empty arrays
		_.forIn(ItemType, (value, key) => {
			if (itemsByType && itemsByType[value].length === 0) {
				delete itemsByType[value];
			}
			if (usableItemsByType && usableItemsByType[value].length === 0) {
				delete usableItemsByType[value];
			}
			if (combatItemsByType && combatItemsByType[value].length === 0) {
				delete combatItemsByType[value];
			}
		});
	}
	// Divides items by their 'type' and further by their 'subtype' inside each primary type. Items WITHOUT a subtype are under property 'None'
	public static ItemByBothTypes(inv: IItemQuantity[], itemsByType: any = {}, usableItemsByType?: any, combatItemsByType?: any) {
		// Add all keys first. Ensures item output will be in whatever order our ItemType enum is in
		_.forIn(ItemType, (value, key) => {
			if (itemsByType) {
				itemsByType[value] = {};
			}
			if (usableItemsByType) {
				usableItemsByType[value] = {};
			}
			if (combatItemsByType) {
				combatItemsByType[value] = {};
			}

			_.forIn(ItemSubtype, (value2, key2) => {
				if (itemsByType) {
					itemsByType[value][value2] = [];
				}
				if (usableItemsByType) {
					usableItemsByType[value][value2] = [];
				}
				if (combatItemsByType) {
					combatItemsByType[value][value2] = [];
				}
			});
		});
		// Populate type arrays with items if they're defined
		for (const item of inv) {
			const it = item.it as CombatItem;
			if (itemsByType) {
				itemsByType[it.type][it.subtype].push(item);
			}
			if (usableItemsByType && it.Use) {
				usableItemsByType[it.type][it.subtype].push(item);
			}
			if (combatItemsByType && it.combat) {
				combatItemsByType[it.type][it.subtype].push(item);
			}
		}
		// Clear empty arrays
		_.forIn(ItemType, (itType, key) => {
			const items = itemsByType[itType];
			// Remove empty subtypes
			_.forIn(ItemSubtype, (subType, key2) => {
				if (itemsByType && items[subType].length === 0) {
					delete items[subType];
				}
				if (usableItemsByType && usableItemsByType[itType][subType].length === 0) {
					delete usableItemsByType[itType][subType];
				}
				if (combatItemsByType && combatItemsByType[itType][subType].length === 0) {
					delete combatItemsByType[itType][subType];
				}
			});

			// remove empty types
			if (itemsByType && _.keys(items).length === 0) {
				delete itemsByType[itType];
			}
			if (usableItemsByType && _.keys(usableItemsByType[itType]).length === 0) {
				delete usableItemsByType[itType];
			}
			if (combatItemsByType && _.keys(combatItemsByType[itType]).length === 0) {
				delete combatItemsByType[itType];
			}
		});
	}
	public items: IItemQuantity[];

	constructor() {
		this.items = []; // {it : Item, num : 1} pair
	}

	public ToStorage() {
		const storage: any = [];
		_.each(this.items, (item) => {
			storage.push({
				it  : item.it.id,
				num : item.num,
			});
		});
		return storage;
	}

	public FromStorage(storage: any) {
		const list: any[] = [];
		_.each(storage, (s) => {
			const item = {
				it  : ItemIds[s.it],
				num : parseInt(s.num, 10),
			};
			if (item.it) {
				list.push(item);
			}
		});
		this.items = list;
	}

	public QueryNum(item: Item) {
		for (const it of this.items) {
			if (it.it === item) {
				return it.num;
			}
		}
		return undefined;
	}

	public AddItem(item: Item, num: number = 1) {
		if (GetDEBUG()) {
			Text.NL();
			Text.Add("DEBUG: Added [num] [name] (ID: [id])", {num, name: item.name, id: item.id}, "bold");
			Text.NL();
			Text.Flush();
		}

		// Try to find if there is already an entry
		for (const it of this.items) {
			if (it.it === item) {
				it.num += num;
				return;
			}
		}
		// Item not found, add new entry
		this.items.push({it: item, num});
	}

	public RemoveItem(item: Item, num: number = 1) {
		if (GetDEBUG()) {
			Text.NL();
			Text.Add("DEBUG: Removed [num] [name] (ID: [id])", {num, name: item.name, id: item.id}, "bold");
			Text.NL();
			Text.Flush();
		}

		// Try to find a stack containing said item
		let i = 0;
		for (const it of this.items) {
			if (it.it === item) {
				it.num -= num;
				// If there are no more items in the stack, remove it
				if (it.num <= 0) {
					this.items.splice(i, 1);
				}
				return;
			}
			i++;
		}
	}

	// Todo temp
	public Print() {
		for (const item of this.items) {
			Text.Add(item.num + "x " + item.it.name + " - " + item.it.Short() + "<br>");
		}
		Text.Flush();
	}
	public ShowInventory(SetExploreButtons: CallableFunction, preventClear?: boolean) {
		const inv = this;
		inv.items.sort(compareItemByProp("name"));
		const backPrompt = () => { inv.ShowInventory(SetExploreButtons); };
		if (!preventClear) {
			Text.Clear();
		}

		const itemsByType: any = {};
		const usableItemsByType: any = {};

		Inventory.ItemByBothTypes(this.items, itemsByType, usableItemsByType);

		for (const typeKey of _.keys(itemsByType)) {
			// Add main types
			Text.AddDiv("<hr>");
			Text.AddDiv(typeKey, undefined, "itemTypeHeader");
			Text.AddDiv("<hr>");
			for (const subtypeKey of _.keys(itemsByType[typeKey])) {
				// Add subtypes (except None type)
				if (subtypeKey !== ItemSubtype.None) {
					Text.AddDiv(subtypeKey, undefined, "itemSubtypeHeader");
				}
				const items = itemsByType[typeKey][subtypeKey];
				if (items) {
					for (const item of items) {
						Text.AddDiv(item.it.name + " x" + item.num, undefined, "itemName");
					}
				}
			}
			Text.NL();
		}

		let usable: any[] = [];
		// Copy usable items into usable array
		for (const key of _.keys(usableItemsByType)) {
			for (const subtypeKey of _.keys(usableItemsByType[key])) {
				const items = usableItemsByType[key][subtypeKey];
				if (items) {
					usable = usable.concat(items);
				}
			}
		}

		const options: IChoice[] = [];
		for (const u of usable) {
			const it  = u.it;
			const num = u.num;
			options.push({
				nameStr: it.name + " x" + num,
				enabled: true,
				// tooltip: it.Long(),
				obj: it,
				func(item: Item) {
					Text.Clear();
					Text.Add(item.Long());
					Text.NL();
					Text.Add("Use [it] on which partymember?", {it: item.name});
					Text.Flush();

					const target = new Array();
					_.each(GAME().party.members, (t: Entity) => {
						target.push({
							nameStr : t.name,
							func(t: Entity) {
								Text.Clear();
								const use = t.ItemUse(item, backPrompt);
								if (use.grab) {
									if (use.consume) {
										inv.RemoveItem(item);
									}
								} else {
									if (item.Use(t).consume) { // Consume?
										inv.RemoveItem(item);
									}
									Gui.NextPrompt(backPrompt);
								}
								Text.Flush();
							},
							enabled : t.ItemUsable(item),
							obj     : t,
						});
					});

					Gui.SetButtonsFromList(target, true, backPrompt);
				},
			});
		}
		Gui.SetButtonsFromList(options);

		if (this.items.length === 0) {
			Text.Add("You are not carrying anything at the moment.");
		}
		Text.Flush();
		SetExploreButtons();
	}
	// TODO Make this use the fancy GUI!
	public CombatInventory(encounter: Encounter, entity: Entity, back?: any) {
		const inv = this;
		Text.Clear();

		const backPrompt = () => {
			inv.CombatInventory(encounter, entity, back);
		};

		const combatItemsByType: any = {};
		Inventory.ItemByBothTypes(this.items, undefined, undefined, combatItemsByType);

		let usable: any[] = [];
		// Copy usable items into usable array
		for (const key of _.keys(combatItemsByType)) {
			for (const subtypeKey of _.keys(combatItemsByType[key])) {
				const items = combatItemsByType[key][subtypeKey];
				if (items) {
					usable = usable.concat(items);
				}
			}
		}
		// Output combat items to central GUI
		for (const typeKey of _.keys(combatItemsByType)) {
			// Add main types
			Text.AddDiv("<hr>");
			Text.AddDiv(typeKey, undefined, "itemTypeHeader");
			Text.AddDiv("<hr>");
			for (const subtypeKey of _.keys(combatItemsByType[typeKey])) {
				// Add subtypes (except None type)
				if (subtypeKey !== ItemSubtype.None) {
					Text.AddDiv(subtypeKey, undefined, "itemSubtypeHeader");
				}
				const items = combatItemsByType[typeKey][subtypeKey];
				if (items) {
					for (const item of items) {
						Text.AddDiv(item.it.name + " x" + item.num, undefined, "itemName");
					}
				}
			}
			Text.NL();
		}

		// Add combat items as buttons
		const options: IChoice[] = [];
		for (const u of usable) {
			const it  = u.it;
			const num = u.num;

			// Text.Add(num + "x " + it.name + " - " + it.Short() + "<br>");
			options.push({
				nameStr: it.name,
				enabled: it.combat ? it.combat.enabledCondition(encounter, entity) : true,
				// tooltip: it.Long(),
				obj: it,
				func(item: CombatItem) {
					if (item.combat.OnSelect(encounter, entity, backPrompt, inv)) {
						Text.Clear();
						Text.Add(item.Long());
						Text.NL();
						Text.Add("Use [it] on whom?", {it: item.name});
						Text.Flush();
					}
				},
			});
		}
		Gui.SetButtonsFromList(options, true, back);

		if (options.length === 0) {
			Text.Add("You are not carrying any items usable in combat at the moment.");
		}
		Text.Flush();
	}

	public ShowEquippable(entity: Entity, type: any, backPrompt?: () => void) {
		const inv = this;
		// Populate item list
		const items: Item[] = [];
		_.each(this.items, (it) => {
			const item = it.it;
			switch (type) {
				case ItemType.Weapon:
					if (item.type === ItemType.Weapon) { items.push(item); }
					break;
				case ItemSubtype.TopArmor:
					if     (item.subtype === ItemSubtype.TopArmor) {  items.push(item); } else if (item.subtype === ItemSubtype.FullArmor) { items.push(item); }
					break;
				case ItemSubtype.BotArmor:
					if (item.subtype === ItemSubtype.BotArmor) { items.push(item); }
					break;
				case ItemSubtype.Acc1:
				case ItemSubtype.Acc2:
					if (item.type === ItemType.Accessory) { items.push(item); }
					break;
				case ItemSubtype.StrapOn:
					if (item.subtype === ItemSubtype.StrapOn) { items.push(item); }
					break;
			}
		});
		// Check if slot has an item equipped
		let hasEquip = false;
		switch (type) {
			case ItemType.Weapon:      if (entity.weaponSlot) {   hasEquip = true; } break;
			case ItemSubtype.TopArmor: if (entity.topArmorSlot) { hasEquip = true; } break;
			case ItemSubtype.BotArmor: if (entity.botArmorSlot) { hasEquip = true; } break;
			case ItemSubtype.Acc1:     if (entity.acc1Slot) {     hasEquip = true; } break;
			case ItemSubtype.Acc2:     if (entity.acc2Slot) {     hasEquip = true; } break;
			case ItemSubtype.StrapOn:  if (entity.strapOn) {      hasEquip = true; } break;
		}
		// Create de-equip function for the slot type
		const list = [];
		list.push({
			nameStr : "Dequip",
			func() {
				switch (type) {
					case ItemType.Weapon:
						if (entity.weaponSlot) { inv.AddItem(entity.weaponSlot); }
						entity.weaponSlot = undefined;
						break;
					case ItemSubtype.TopArmor:
						if (entity.topArmorSlot) { inv.AddItem(entity.topArmorSlot); }
						entity.topArmorSlot = undefined;
						break;
					case ItemSubtype.BotArmor:
						if (entity.botArmorSlot) { inv.AddItem(entity.botArmorSlot); }
						entity.botArmorSlot = undefined;
						break;
					case ItemSubtype.Acc1:
						if (entity.acc1Slot) { inv.AddItem(entity.acc1Slot); }
						entity.acc1Slot = undefined;
						break;
					case ItemSubtype.Acc2:
						if (entity.acc2Slot) { inv.AddItem(entity.acc2Slot); }
						entity.acc2Slot = undefined;
						break;
					case ItemSubtype.StrapOn:
						if (entity.strapOn) { inv.AddItem(entity.strapOn); }
						entity.strapOn = undefined;
						break;
				}
				entity.Equip();
				backPrompt();
			},
			enabled : hasEquip,
		});

		// Create button and equip item function for each item valid for the passed in 'type'
		_.each(items, (it) => {
			it.ShowEquipStats();
			Text.AddDiv("<hr>");
			list.push({
				nameStr : it.name,
				func(t: Item) {
					inv.RemoveItem(t);
					const switchType = (t.subtype !== ItemSubtype.None) ? t.subtype : t.type;
					switch (switchType) {
						case ItemType.Weapon:
							if (entity.weaponSlot) { inv.AddItem(entity.weaponSlot); }
							entity.weaponSlot = t;
							break;

						case ItemSubtype.FullArmor:
							if (entity.topArmorSlot) { inv.AddItem(entity.topArmorSlot); }
							if (entity.botArmorSlot) { inv.AddItem(entity.botArmorSlot); }
							entity.topArmorSlot = t;
							entity.botArmorSlot = undefined;
							break;

						case ItemSubtype.TopArmor:
							if (entity.topArmorSlot) { inv.AddItem(entity.topArmorSlot); }
							entity.topArmorSlot = t;
							break;

						case ItemSubtype.BotArmor:
							if (entity.botArmorSlot) { inv.AddItem(entity.botArmorSlot); }
							entity.botArmorSlot = t;
							break;

						case ItemType.Accessory:
							if (type === ItemSubtype.Acc1) {
								if (entity.acc1Slot) { inv.AddItem(entity.acc1Slot); }
								entity.acc1Slot = t;
							} else if (type === ItemSubtype.Acc2) {
								if (entity.acc2Slot) { inv.AddItem(entity.acc2Slot); }
								entity.acc2Slot = t;
							}
							break;

						case ItemSubtype.StrapOn:
							if (entity.strapOn) { inv.AddItem(entity.strapOn); }
							entity.strapOn = t as ItemToy;
							break;
					}
					entity.Equip();
					backPrompt();
				},
				enabled : true,
				obj     : it,
				tooltip : it.Long(),
			});
		});

		Text.Flush();
		Gui.SetButtonsFromList(list, true, backPrompt);
	}
}
