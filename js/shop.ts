import { GetDEBUG } from "../app";
import { Gui } from "./gui";
import { Text } from "./text";
import { ItemType, ItemSubtype, Item } from "./item";
import { Inventory } from "./inventory";
import { GAME } from "./GAME";
import { Party } from "./party";

interface ShopInventory {
	it : Item;
	num : number;
	enabled : CallableFunction;
	func : CallableFunction;
	price : number;
}

export class Shop {
	inventory : ShopInventory[];
	totalBought : number;
	totalSold : number;

	//opts
	sellPrice : number;
	buyPromptFunc : (it: any, cost: number, bought: boolean) => void;
	buySuccessFunc : (it: any, cost: number, num: number) => void;
	buyFailFunc : (it: any, cost: number, bought: boolean) => void;
	sellPromptFunc : (it: any, cost: number, sold: boolean) => void;
	sellSuccessFunc : (it: any, cost: number, num: number) => void;
	sellFailFunc : (it: any, cost: number, sold: boolean) => void;

	constructor(opts : any = {}) {
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

	ToStorage() {
		let storage : any = {};
		if(this.totalBought != 0) storage.tb = this.totalBought.toFixed();
		if(this.totalSold   != 0) storage.ts = this.totalSold.toFixed();
		return storage;
	}

	FromStorage(storage : any = {}) {
		this.totalBought = !isNaN(parseInt(storage.tb)) ? parseInt(storage.tb) : this.totalBought;
		this.totalSold   = !isNaN(parseInt(storage.ts)) ? parseInt(storage.ts) : this.totalSold;
	}

	AddItem(item : any, price : number, enabled? : CallableFunction, func? : CallableFunction, num? : number) {
		this.inventory.push({
			it      : item,
			price   : price,
			enabled : enabled,
			func    : func,
			num     : num
		});
	}

	Buy(back : CallableFunction = Gui.PrintDefaultOptions, preventClear? : boolean) {
		let party : Party = GAME().party;

		var shop = this;

		if(!preventClear)
			Text.Clear();
		else
			Text.NL();

		var buyFunc = function(obj : any, bought : boolean) {
			if(obj.func) {
				var res = obj.func();
				if(res) return;
			}

			var cost = obj.cost;
			var num  = party.Inv().QueryNum(obj.it) || 0;

			if(shop.buyPromptFunc) shop.buyPromptFunc(obj.it, cost, bought);
			else Text.Clear();
			Text.Add("Buy " + obj.it.name + " for " + cost + " coin? You are carrying " + num + ".");
			Text.Flush();

			//[name]
			var options = new Array();
			options.push({ nameStr : "Buy 1",
				func : function() {
					if(shop.buySuccessFunc) shop.buySuccessFunc(obj.it, cost, 1);
					// Remove cost
					party.coin -= cost;
					shop.totalBought += cost;
					// Add item to inv
					party.inventory.AddItem(obj.it);
					buyFunc(obj, true);
				}, enabled : party.coin >= cost,
				tooltip : ""
			});
			options.push({ nameStr : "Buy 5",
				func : function() {
					if(shop.buySuccessFunc) shop.buySuccessFunc(obj.it, cost, 5);
					// Remove cost
					party.coin -= cost*5;
					shop.totalBought += cost*5;
					// Add item to inv
					party.inventory.AddItem(obj.it, 5);
					buyFunc(obj, true);
				}, enabled : party.coin >= cost*5,
				tooltip : ""
			});
			options.push({ nameStr : "Buy 10",
				func : function() {
					if(shop.buySuccessFunc) shop.buySuccessFunc(obj.it, cost, 10);
					// Remove cost
					party.coin -= cost*10;
					shop.totalBought += cost*10;
					// Add item to inv
					party.inventory.AddItem(obj.it, 10);
					buyFunc(obj, true);
				}, enabled : party.coin >= cost*10,
				tooltip : ""
			});
			Gui.SetButtonsFromList(options, true, function() {
				// Recreate the menu
				// TODO: Keep page!
				if(shop.buyFailFunc) shop.buyFailFunc(obj.it, cost, bought);
				shop.Buy(back, true);
			});
		};

		let itemsByType : any = {};
		Inventory.ItemByBothTypes(this.inventory, itemsByType);

		let options = [];
		for(var typeKey in itemsByType) {
			//Add main types
			Text.AddDiv("<hr>");
			Text.AddDiv(typeKey, null, "itemTypeHeader");
			Text.AddDiv("<hr>");
			for(var subtypeKey in itemsByType[typeKey]){
				//Add subtypes (except None type)
				if(subtypeKey != ItemSubtype.None)
					Text.AddDiv(subtypeKey, null, "itemSubtypeHeader");
				var items = itemsByType[typeKey][subtypeKey];
				if(items) {
					for(var i=0; i < items.length; i++) {
						var it       = items[i].it;
						var num      = items[i].num;
						var enabled  = items[i].enabled ? items[i].enabled() : true;
						var cost     = GetDEBUG() ? 0 : Math.floor(items[i].price * it.price);
						var func     = items[i].func;

						enabled = enabled && (party.coin >= cost);
						Text.AddDiv("<b>" + cost + "g - </b>" + it.name + " - " + it.Short(), null, "itemName");

						options.push({ nameStr : it.name,
							func : buyFunc, enabled : enabled,
							tooltip : it.Long(),
							obj : {it: items[i].it, cost: cost, func: func }
						});
					}
				}
			}

			Text.NL();
		}
		Text.Flush();
		Gui.SetButtonsFromList(options, true, back);
	}

	Sell(back : CallableFunction = Gui.PrintDefaultOptions, preventClear? : boolean, customSellFunc? : CallableFunction) {
		let party : Party = GAME().party;

		var shop = this;

		if(!preventClear)
			Text.Clear();
		else
			Text.NL();

		if(party.inventory.items.length == 0) {
			Text.Add("You have nothing to sell.");
		}

		var sellFunc = function(obj : any, havesold : boolean) {
			if(obj.func) {
				var res = obj.func();
				if(res) return;
			}

			var num = obj.num;
			var cost = Math.floor(shop.sellPrice * obj.it.price);

			if(shop.sellPromptFunc) shop.sellPromptFunc(obj.it, cost, havesold);
			else Text.Clear();
			Text.Add("Sell " + obj.it.name + " for " + cost + " coin? You are carrying " + num + ".");
			Text.Flush();

			var options = new Array();
			options.push({ nameStr : "Sell 1",
				func : function() {
					if(shop.sellSuccessFunc) shop.sellSuccessFunc(obj.it, cost, 1);
					// Add cash
					party.coin += cost;
					shop.totalSold += cost;
					// Remove item from inv
					party.inventory.RemoveItem(obj.it);

					if(customSellFunc) customSellFunc(obj.it, 1);

					num -= 1;
					if(num <= 0) {
						// Recreate the menu
						shop.Sell(back, true, customSellFunc);
					}
					else
						sellFunc(obj, true);
				}, enabled : true,
				tooltip : ""
			});
			options.push({ nameStr : "Sell 5",
				func : function() {
					var sold = Math.min(num, 5);
					if(shop.sellSuccessFunc) shop.sellSuccessFunc(obj.it, cost, sold);
					// Add cash
					party.coin += cost * sold;
					shop.totalSold += cost * sold;
					// Remove item from inv
					party.inventory.RemoveItem(obj.it, sold);

					if(customSellFunc) customSellFunc(obj.it, 5);

					num -= sold;
					if(num <= 0) {
						// Recreate the menu
						shop.Sell(back, true, customSellFunc);
					}
					else
						sellFunc(obj, true);
				}, enabled : true,
				tooltip : ""
			});
			options.push({ nameStr : "Sell all",
				func : function() {
					if(shop.sellSuccessFunc) shop.sellSuccessFunc(obj.it, cost, num);
					// Add cash
					party.coin += cost * num;
					shop.totalSold += cost * num;
					// Remove item from inv
					party.inventory.RemoveItem(obj.it, num);

					if(customSellFunc) customSellFunc(obj.it, num);

					// Recreate the menu
					// TODO: Keep page!
					shop.Sell(back, true, customSellFunc);
				}, enabled : true,
				tooltip : ""
			});
			Gui.SetButtonsFromList(options, true, function() {
				if(shop.sellFailFunc) shop.sellFailFunc(obj.it, cost, havesold);
				// Recreate the menu
				// TODO: Keep page!
				shop.Sell(back, true);
			});
		};


		let itemsByType : any = {};
		Inventory.ItemByBothTypes(party.Inv().items, itemsByType);


		let options = [];
		for(var typeKey in itemsByType) {
			//Add main types, exclude quest items (can't sell quest items at shop)
			if(typeKey != ItemType.Quest){
				Text.AddDiv("<hr>");
				Text.AddDiv(typeKey, null, "itemTypeHeader");
				Text.AddDiv("<hr>");
			}
			for(var subtypeKey in itemsByType[typeKey]){
				//Add subtypes (except None type)
				if(subtypeKey != ItemSubtype.None)
					Text.AddDiv(subtypeKey, null, "itemSubtypeHeader");
				var items = itemsByType[typeKey][subtypeKey];
				if(items) {
					for(var i=0; i < items.length; i++) {
						var it       = items[i].it;
						var num      = items[i].num;
						var price    = Math.floor(shop.sellPrice * it.price);

						if(price <= 0) continue;
						//TODO Could look better. Perhaps add 'table' functionality to text.js and use it here
						Text.AddDiv("<b>"+price + "g</b> - " + it.name + " x" + num + " - " + it.Short(), null, "itemName");

						options.push({ nameStr : it.name,
							func : sellFunc, enabled : true,
							tooltip : it.Long(),
							obj : items[i]
						});
					}
				}
			}
			Text.NL();
		}
		Text.Flush();
		Gui.SetButtonsFromList(options, true, back);
	}

}
