/*
 * 
 * Alchemy
 * 
 */
Alchemy = {};

// callback in the form of function(item)
Alchemy.AlchemyPrompt = function(alchemist, inventory, backPrompt, callback, preventClear) {
	alchemist  = alchemist  || new Entity();
	inventory  = inventory  || new Inventory();
	
	if(!preventClear)
		Text.Clear();
	Text.Add("[name] can transmute the following items:", {name: alchemist.NameDesc()});
	
	list = [];

	var Brew = function(it) {
		if (alchemist == player) {
			Alchemy.ItemDetails(it, inventory);
		} else {
			Alchemy.MakeItem(it, 1, alchemist, inventory, backPrompt, callback);
		}
	}

	alchemist.recipes.forEach(function(item) {
		var enabled = true;
		var knownRecipe = false;
		var str = Text.BoldColor(item.name) + ": ";
		item.recipe.forEach(function(component, idx) {
			var available = inventory.QueryNum(component.it) || 0;
			var enough = (available >= (component.num || 1));
			if(idx > 0) str += ", ";
			if(!enough) str += "<b>";
			str += (component.num || 1) + "/" + available + "x " + component.it.name;
			if(!enough) str += "</b>";
			enabled &= enough;
		});

		if(alchemist == player) {
			knownRecipe = true;
		} else if (_.includes(player.recipes, item)) {
			knownRecipe = true;
		}

		list.push({
			_recipeStr: str,
			nameStr: item.name,
			enabled: enabled,
			tooltip: item.Long(),
			obj:     item,
			image:   knownRecipe ? Images.imgButtonEnabled : Images.imgButtonEnabled2,
			func:    Brew,
		});
	});
	
	list = _.sortBy(list, 'nameStr');
	
	_.each(list, function(it) {
		Text.NL();
		Text.Add(it._recipeStr);
	});
	
	Gui.SetButtonsFromList(list, backPrompt, backPrompt);
	Text.Flush();
}

Alchemy.MakeItem = function(it, qty, alchemist, inventory, backPrompt, callback){
	Text.Clear();
	Text.Add("[name] mix[es] the ingredients, preparing [qty]x [item].", {name: alchemist.NameDesc(), es: alchemist.plural() ? "" : "es", item: it.name, qty: qty});
	Text.Flush();

	it.recipe.forEach(function(component) {
		inventory.RemoveItem(component.it, qty);
	});

	if(callback) {
		callback(it);
	} else {
		inventory.AddItem(it, qty);

		Gui.NextPrompt(function() {
			if(backPrompt)
				Alchemy.AlchemyPrompt(alchemist, inventory, backPrompt);
			else
				ShowAlchemy();
		});
	}
}

Alchemy.ItemDetails = function(it, inventory) {
	var batchFormats = [1, 5, 10, 25];
	var list = [];
	var brewable = Alchemy.CountBrewable(it, inventory);
	var BrewBatch = brewable.brewFn;
	var inInventory = inventory.QueryNum(it);

	var parser = {
		item: it.name,
		maxQty: brewable.qty,
		upTo: (brewable.qty > 1) ? "up to" : "",
		inInv: inInventory,
		limiters: Text.Enumerate(_.map(brewable.limiters, "name"), "or"),
	}

	Text.Clear();
	if (brewable.qty < 1) {
		Text.Add("With the ingredients you have on hand, there's not enough [limiters] for you to make any [item].", parser);
		Text.NL();
	} else {
		Text.Add("With the ingredients you have on hand, you could make [upTo] [maxQty]x [item].", parser);
		Text.NL();
		Text.Add("How much [item] do you want to make? ", parser);
		if (inInventory) Text.Add("You are already carrying [inInv].", parser);
		Text.NL();

		for(var i = 0; i < batchFormats.length; i++) {
			var format = batchFormats[i];
			var enabled = format <= brewable.qty;
			var btnTxt = "x" + format;
			list.push({
				nameStr: btnTxt,
				enabled: enabled,
				obj:     format,
				func:    BrewBatch,
			});
		}
	}

	Gui.SetButtonsFromList(list, true);
	Text.Flush();
}

Alchemy.CountBrewable = function(it, inventory) {
	var recipe = it.recipe;
	var recipeDict = {};
	var limitingQuota = Infinity;
	var limiters = [];

	// There's always the possibility of some items being required more than once
	recipe.forEach(function(ingredient) {
		recipeDict[ingredient.it.id] = recipeDict[ingredient.it.id] + 1 || 1;
	});

	Object.keys(recipeDict).forEach(function(ingredient) {
		var available = inventory.QueryNum(ItemIds[ingredient]);
		var quota = Math.floor(available/recipeDict[ingredient]);

		if(quota < limitingQuota) {
			limitingQuota = quota;
			limiters = [ItemIds[ingredient]];
		} else if (quota == limitingQuota) {
			limiters.push(ItemIds[ingredient]);
		}
	});

	return {
		qty: limitingQuota,
		limiters: limiters,
		brewFn: function(batchSize){
			Alchemy.MakeItem(it, batchSize, player, inventory);
		}
	};
}