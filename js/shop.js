


function Shop(sellPrice) {
	// Contains {it: Item, [num: Number], [enabled: Function], [func: Function], [price: Number]}
	// Set num to null for infinite stock
	// Set enabled to null for unconditional
	// Set func to something to have a special even trigger when buying something
	// Have func return true if the shopping should be aborted
	// price: 1 = regular price, 0.5 = half price, 2 = double price
	// How to save sold limited stock?
	this.inventory = [];
	this.sellPrice = sellPrice || 1;
}

Shop.prototype.AddItem = function(item, price, enabled, func, num) {
	this.inventory.push({
		it      : item,
		price   : price,
		enabled : enabled,
		func    : func,
		num     : num
	});
}

Shop.prototype.Buy = function(back, preventClear) {
	var shop = this;
	back = back || PrintDefaultOptions;
	
	if(!preventClear)
		Text.Clear();
		
	var buyFunc = function(obj) {
		if(obj.func) {
			var res = obj.func();
			if(res) return;
		}
		
		var cost = obj.cost;
		var num  = party.Inv().QueryNum(obj.it) || 0;
		
		Text.Clear();
		Text.Add("Buy " + obj.it.name + " for " + cost + " coin? You are carrying " + num + ".");
		Text.Flush();
		
		//[name]
		var options = new Array();
		options.push({ nameStr : "Buy 1",
			func : function() {
				// Remove cost
				party.coin -= cost;
				// Add item to inv
				party.inventory.AddItem(obj.it);
				buyFunc(obj);
			}, enabled : party.coin >= cost,
			tooltip : ""
		});
		options.push({ nameStr : "Buy 5",
			func : function() {
				// Remove cost
				party.coin -= cost*5;
				// Add item to inv
				party.inventory.AddItem(obj.it, 5);
				buyFunc(obj);
			}, enabled : party.coin >= cost*5,
			tooltip : ""
		});
		options.push({ nameStr : "Buy 10",
			func : function() {
				// Remove cost
				party.coin -= cost*10;
				// Add item to inv
				party.inventory.AddItem(obj.it, 10);
				buyFunc(obj);
			}, enabled : party.coin >= cost*10,
			tooltip : ""
		});
		Gui.SetButtonsFromList(options, true, function() {
			// Recreate the menu
			// TODO: Keep page!
			shop.Buy(back);
		});
	};
	
	var itemsByType = {};
	Inventory.ItemByType(this.inventory, itemsByType);
	
	var options = [];
	for(var key in itemsByType) {
		Text.Add("<b>"+Item.TypeToStr(parseInt(key)) + ":</b>");
		var items = itemsByType[key];
		if(items) {
			for(var i=0; i < items.length; i++) {
				
				var it       = items[i].it;
				var num      = items[i].num;
				var enabled  = items[i].enabled ? items[i].enabled() : true;
				var cost     = DEBUG ? 0 : Math.floor(items[i].price * it.price);
				var func     = items[i].func;
				
				enabled = enabled && (party.coin >= cost);
		
				Text.Add("<br/><b>" + cost + "g - </b>" + it.name + " - " + it.Short());
		
				options.push({ nameStr : it.name,
					func : buyFunc, enabled : enabled,
					tooltip : it.Long(),
					obj : {it: items[i].it, cost: cost, func: func }
				});
			}
		}
		Text.NL();
	}
	Text.Flush();
	Gui.SetButtonsFromList(options, true, back);
}

Shop.prototype.Sell = function(back, preventClear) {
	var shop = this;
	back = back || PrintDefaultOptions;
	
	if(!preventClear)
		Text.Clear();
	
	if(party.inventory.items.length == 0) {
		Text.Add("You have nothing to sell.");
	}
	
	var sellFunc = function(obj) {
		if(obj.func) {
			var res = obj.func();
			if(res) return;
		}
		
		var num = obj.num;
		var cost = Math.floor(shop.sellPrice * obj.it.price);

		Text.Clear();
		Text.Add("Sell " + obj.it.name + " for " + cost + " coin? You are carrying " + num + ".");
		Text.Flush();
		
		var options = new Array();
		options.push({ nameStr : "Sell 1",
			func : function() {
				// Add cash
				party.coin += cost;
				// Remove item from inv
				party.inventory.RemoveItem(obj.it);
				
				num -= 1;
				if(num <= 0) {
					// Recreate the menu
					// TODO: Keep page!
					shop.Sell(back);
				}
				else
					sellFunc(obj);
			}, enabled : true,
			tooltip : ""
		});
		options.push({ nameStr : "Sell 5",
			func : function() {
				var sold = Math.min(num, 5);
				// Add cash
				party.coin += cost * sold;
				// Remove item from inv
				party.inventory.RemoveItem(obj.it, sold);
				
				num -= sold;
				if(num <= 0) {
					// Recreate the menu
					// TODO: Keep page!
					shop.Sell(back);
				}
				else
					sellFunc(obj);
			}, enabled : true,
			tooltip : ""
		});
		options.push({ nameStr : "Sell all",
			func : function() {
				// Add cash
				party.coin += cost * num;
				// Remove item from inv
				party.inventory.RemoveItem(obj.it, num);
				
				// Recreate the menu
				// TODO: Keep page!
				shop.Sell(back);
			}, enabled : true,
			tooltip : ""
		});
		Gui.SetButtonsFromList(options, true, function() {
			// Recreate the menu
			// TODO: Keep page!
			shop.Sell(back);
		});
	};
	
	
	var itemsByType = {};
	Inventory.ItemByType(party.Inv().items, itemsByType);
	
	
	var options = [];
	for(var key in itemsByType) {
		Text.Add("<b>"+Item.TypeToStr(parseInt(key)) + ":</b>");
		var items = itemsByType[key];
		if(items) {
			for(var i=0; i < items.length; i++) {
				var it       = items[i].it;
				var num      = items[i].num;
				var price    = Math.floor(shop.sellPrice * it.price);
				
				if(price <= 0) continue;
				
				Text.Add("<br/><b>" + price + "g -</b> " + it.name + " x" + num + " - " + it.Short());
		
				options.push({ nameStr : it.name,
					func : sellFunc, enabled : true,
					tooltip : it.Long(),
					obj : items[i]
				});
			}
		}
		Text.NL();
	}
	Text.Flush();
	Gui.SetButtonsFromList(options, true, back);
}
