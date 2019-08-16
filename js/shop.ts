import * as _ from "lodash";

import { GetDEBUG } from "../app";
import { GAME } from "./GAME";
import { Gui } from "./gui";
import { Inventory } from "./inventory";
import { Item, ItemSubtype, ItemType } from "./item";
import { Party } from "./party";
import { Text } from "./text";

interface IShopInventory {
	it: Item;
	num: number;
	enabled: CallableFunction;
	func: CallableFunction;
	price: number;
}

export class Shop {
	public inventory: IShopInventory[];
	public totalBought: number;
	public totalSold: number;

	// opts
	public sellPrice: number;
	public buyPromptFunc: (it: any, cost: number, bought: boolean) => void;
	public buySuccessFunc: (it: any, cost: number, num: number) => void;
	public buyFailFunc: (it: any, cost: number, bought: boolean) => void;
	public sellPromptFunc: (it: any, cost: number, sold: boolean) => void;
	public sellSuccessFunc: (it: any, cost: number, num: number) => void;
	public sellFailFunc: (it: any, cost: number, sold: boolean) => void;

	constructor(opts: any = {}) {
		// Contains {it: Item, [num: Number], [enabled: Function], [func: Function], [price: Number]}
		// Set num to null for infinite stock
		// Set enabled to null for unconditional
		// Set func to something to have a special even trigger when buying something
		// Have func return true if the shopping should be aborted
		// price: 1 = regular price, 0.5 = half price, 2 = double price
		// How to save sold limited stock?
		this.inventory = [];

		this.totalBought = 0;
		this.totalSold = 0;

		this.sellPrice       = opts.sellPrice || 1;
		this.buyPromptFunc   = opts.buyPromptFunc;
		this.buySuccessFunc  = opts.buySuccessFunc;
		this.buyFailFunc     = opts.buyFailFunc;
		this.sellPromptFunc  = opts.sellPromptFunc;
		this.sellSuccessFunc = opts.sellSuccessFunc;
		this.sellFailFunc    = opts.sellFailFunc;
	}

	public ToStorage() {
		const storage: any = {};
		if (this.totalBought !== 0) { storage.tb = this.totalBought.toFixed(); }
		if (this.totalSold   !== 0) { storage.ts = this.totalSold.toFixed(); }
		return storage;
	}

	public FromStorage(storage: any = {}) {
		const tb = parseInt(storage.tb, 10);
		this.totalBought = !isNaN(tb) ? tb : this.totalBought;
		const ts = parseInt(storage.ts, 10);
		this.totalSold   = !isNaN(ts) ? ts : this.totalSold;
	}

	public AddItem(item: any, price: number, enabled?: CallableFunction, func?: CallableFunction, num?: number) {
		this.inventory.push({
			it      : item,
			price,
			enabled,
			func,
			num,
		});
	}

	public Buy(back: CallableFunction = Gui.PrintDefaultOptions, preventClear?: boolean) {
		const party: Party = GAME().party;

		const shop = this;

		if (!preventClear) {
			Text.Clear();
		} else {
			Text.NL();
		}

		const buyFunc = (obj: any, bought: boolean) => {
			if (obj.func) {
				const res = obj.func();
				if (res) { return; }
			}

			const cost = obj.cost;
			const num  = party.Inv().QueryNum(obj.it) || 0;

			if (shop.buyPromptFunc) { shop.buyPromptFunc(obj.it, cost, bought); } else { Text.Clear(); }
			Text.Add("Buy " + obj.it.name + " for " + cost + " coin? You are carrying " + num + ".");
			Text.Flush();

			// [name]
			const options = new Array();
			options.push({ nameStr : "Buy 1",
				func() {
					if (shop.buySuccessFunc) { shop.buySuccessFunc(obj.it, cost, 1); }
					// Remove cost
					party.coin -= cost;
					shop.totalBought += cost;
					// Add item to inv
					party.inventory.AddItem(obj.it);
					buyFunc(obj, true);
				}, enabled : party.coin >= cost,
				tooltip : "",
			});
			options.push({ nameStr : "Buy 5",
				func() {
					if (shop.buySuccessFunc) { shop.buySuccessFunc(obj.it, cost, 5); }
					// Remove cost
					party.coin -= cost * 5;
					shop.totalBought += cost * 5;
					// Add item to inv
					party.inventory.AddItem(obj.it, 5);
					buyFunc(obj, true);
				}, enabled : party.coin >= cost * 5,
				tooltip : "",
			});
			options.push({ nameStr : "Buy 10",
				func() {
					if (shop.buySuccessFunc) { shop.buySuccessFunc(obj.it, cost, 10); }
					// Remove cost
					party.coin -= cost * 10;
					shop.totalBought += cost * 10;
					// Add item to inv
					party.inventory.AddItem(obj.it, 10);
					buyFunc(obj, true);
				}, enabled : party.coin >= cost * 10,
				tooltip : "",
			});
			Gui.SetButtonsFromList(options, true, () => {
				// Recreate the menu
				// TODO: Keep page!
				if (shop.buyFailFunc) { shop.buyFailFunc(obj.it, cost, bought); }
				shop.Buy(back, true);
			});
		};

		const itemsByType: any = {};
		Inventory.ItemByBothTypes(this.inventory, itemsByType);

		const options: any[] = [];
		_.forIn(itemsByType, (itemBundle, itemTypeName) => {
			// Add main types
			Text.AddDiv("<hr>");
			Text.AddDiv(itemTypeName, null, "itemTypeHeader");
			Text.AddDiv("<hr>");
			_.forIn(itemBundle, (items, itemSubtypeName) => {
				// Add subtypes (except None type)
				if (itemSubtypeName !== ItemSubtype.None) {
					Text.AddDiv(itemSubtypeName, null, "itemSubtypeHeader");
				}
				if (items) {
					for (const item of items) {
						const it       = item.it;
						const num      = item.num;
						let enabled  = item.enabled ? item.enabled() : true;
						const cost     = GetDEBUG() ? 0 : Math.floor(item.price * it.price);
						const func     = item.func;

						enabled = enabled && (party.coin >= cost);
						Text.AddDiv("<b>" + cost + "g - </b>" + it.name + " - " + it.Short(), null, "itemName");

						options.push({ nameStr : it.name,
							func : buyFunc, enabled,
							tooltip : it.Long(),
							obj : {it: item.it, cost, func },
						});
					}
				}
			});

			Text.NL();
		});
		Text.Flush();
		Gui.SetButtonsFromList(options, true, back);
	}

	public Sell(back: CallableFunction = Gui.PrintDefaultOptions, preventClear?: boolean, customSellFunc?: CallableFunction) {
		const party: Party = GAME().party;

		const shop = this;

		if (!preventClear) {
			Text.Clear();
		} else {
			Text.NL();
		}

		if (party.inventory.items.length === 0) {
			Text.Add("You have nothing to sell.");
		}

		const sellFunc = (obj: any, havesold: boolean) => {
			if (obj.func) {
				const res = obj.func();
				if (res) { return; }
			}

			let num = obj.num;
			const cost = Math.floor(shop.sellPrice * obj.it.price);

			if (shop.sellPromptFunc) { shop.sellPromptFunc(obj.it, cost, havesold); } else { Text.Clear(); }
			Text.Add("Sell " + obj.it.name + " for " + cost + " coin? You are carrying " + num + ".");
			Text.Flush();

			const options = new Array();
			options.push({ nameStr : "Sell 1",
				func() {
					if (shop.sellSuccessFunc) { shop.sellSuccessFunc(obj.it, cost, 1); }
					// Add cash
					party.coin += cost;
					shop.totalSold += cost;
					// Remove item from inv
					party.inventory.RemoveItem(obj.it);

					if (customSellFunc) { customSellFunc(obj.it, 1); }

					num -= 1;
					if (num <= 0) {
						// Recreate the menu
						shop.Sell(back, true, customSellFunc);
					} else {
						sellFunc(obj, true);
					}
				}, enabled : true,
				tooltip : "",
			});
			options.push({ nameStr : "Sell 5",
				func() {
					const sold = Math.min(num, 5);
					if (shop.sellSuccessFunc) { shop.sellSuccessFunc(obj.it, cost, sold); }
					// Add cash
					party.coin += cost * sold;
					shop.totalSold += cost * sold;
					// Remove item from inv
					party.inventory.RemoveItem(obj.it, sold);

					if (customSellFunc) { customSellFunc(obj.it, 5); }

					num -= sold;
					if (num <= 0) {
						// Recreate the menu
						shop.Sell(back, true, customSellFunc);
					} else {
						sellFunc(obj, true);
					}
				}, enabled : true,
				tooltip : "",
			});
			options.push({ nameStr : "Sell all",
				func() {
					if (shop.sellSuccessFunc) { shop.sellSuccessFunc(obj.it, cost, num); }
					// Add cash
					party.coin += cost * num;
					shop.totalSold += cost * num;
					// Remove item from inv
					party.inventory.RemoveItem(obj.it, num);

					if (customSellFunc) { customSellFunc(obj.it, num); }

					// Recreate the menu
					// TODO: Keep page!
					shop.Sell(back, true, customSellFunc);
				}, enabled : true,
				tooltip : "",
			});
			Gui.SetButtonsFromList(options, true, () => {
				if (shop.sellFailFunc) { shop.sellFailFunc(obj.it, cost, havesold); }
				// Recreate the menu
				// TODO: Keep page!
				shop.Sell(back, true);
			});
		};

		const itemsByType: any = {};
		Inventory.ItemByBothTypes(party.Inv().items, itemsByType);

		const options: any[] = [];
		_.forIn(itemsByType, (itemBundle, itemTypeName) => {
			// Add main types, exclude quest items (can't sell quest items at shop)
			if (itemTypeName !== ItemType.Quest) {
				Text.AddDiv("<hr>");
				Text.AddDiv(itemTypeName, null, "itemTypeHeader");
				Text.AddDiv("<hr>");
			}
			_.forIn(itemBundle, (items, itemSubtypeName) => {
				// Add subtypes (except None type)
				if (itemSubtypeName !== ItemSubtype.None) {
					Text.AddDiv(itemSubtypeName, null, "itemSubtypeHeader");
				}
				if (items) {
					for (const item of items) {
						const it       = item.it;
						const num      = item.num;
						const price    = Math.floor(shop.sellPrice * it.price);

						if (price <= 0) { continue; }
						// TODO Could look better. Perhaps add 'table' functionality to text.js and use it here
						Text.AddDiv("<b>" + price + "g</b> - " + it.name + " x" + num + " - " + it.Short(), null, "itemName");

						options.push({ nameStr : it.name,
							func : sellFunc, enabled : true,
							tooltip : it.Long(),
							obj : item,
						});
					}
				}
			});
			Text.NL();
		});
		Text.Flush();
		Gui.SetButtonsFromList(options, true, back);
	}

}
