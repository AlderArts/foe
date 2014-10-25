


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

	var options = new Array();
	for(var i = 0; i < this.inventory.length; i++) {
		var it       = this.inventory[i].it;
		var num      = this.inventory[i].num;
		var enabled  = this.inventory[i].enabled ? this.inventory[i].enabled() : true;
		var cost     = DEBUG ? 0 : Math.floor(this.inventory[i].price * it.price);
		var func     = this.inventory[i].func;
		
		enabled = enabled && (party.coin >= cost);

		Text.AddOutput("<b>" + cost + "g - </b>" + it.name + " - " + it.Short() + "<br/>");

		options.push({ nameStr : it.name,
			func : function(obj) {
				if(obj.func) {
					var res = obj.func();
					if(res) return;
				}
				
				// Remove cost
				party.coin -= obj.cost;
				// Add item to inv
				party.inventory.AddItem(obj.it);

				Text.Clear();
				Text.AddOutput("You buy one " + obj.it.name + ".");
				
				Gui.NextPrompt(function() {
					// Recreate the menu
					// TODO: Keep page!
					shop.Buy(back);
				});
			}, enabled : enabled,
			tooltip : it.Long(),
			obj : {it: this.inventory[i].it, cost: cost, func: func }
		});
	}
	Gui.SetButtonsFromList(options, true, back);
}

Shop.prototype.Sell = function(back) {
	var shop = this;
	back = back || PrintDefaultOptions;
	
	Text.Clear();
	
	if(party.inventory.items.length == 0) {
		Text.AddOutput("You have nothing to sell.");
	}
	
	var sellFunc = function(obj) {
		if(obj.func) {
			var res = obj.func();
			if(res) return;
		}
		
		var num = obj.num;
		var cost = Math.floor(shop.sellPrice * obj.it.price);

		Text.Clear();
		Text.AddOutput("Sell " + obj.it.name + " for " + cost + " coin? You are carrying " + num + ".");
		
		var options = new Array();
		options.push({ nameStr : "Sellx1",
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
		options.push({ nameStr : "Sellx5",
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
	
	var options = new Array();
	for(var i = 0; i < party.inventory.items.length; i++) {
		var it       = party.inventory.items[i].it;
		var num      = party.inventory.items[i].num;
		var price    = Math.floor(shop.sellPrice * it.price);
		
		if(price <= 0) continue;
		
		Text.AddOutput("<b>" + price + "g -</b> " + it.name + " x" + num + " - " + it.Short() + "<br/>");

		options.push({ nameStr : it.name,
			func : sellFunc, enabled : true,
			tooltip : it.Long(),
			obj : party.inventory.items[i]
		});
	}
	Gui.SetButtonsFromList(options, true, back);
}
