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

Alchemy.GetRecipeDict = function(it) {
	var recipe = it.recipe;
	var recipeDict = {};

	// There's always the possibility of some items being required more than once
	recipe.forEach(function(ingredient) {
		recipeDict[ingredient.it.id] = recipeDict[ingredient.it.id] + 1 || 1;
	});

	return recipeDict;
}

Alchemy.CountBrewable = function(it, inventory) {
	var recipeDict = Alchemy.GetRecipeDict(it);
	var limitingQuota = Infinity;
	var limiters = [];
	var invDict = _.chain(inventory.ToStorage()).keyBy('it').mapValues('num').value();
	var productionSteps = []; // [{qty: 5, recipe: [...]}]

	while(!_.isEmpty(recipeDict)) {
		Object.keys(recipeDict).forEach(function(ingredient) {
			var available = invDict[ingredient];
			var quota = Math.floor(available/recipeDict[ingredient]);

			if(quota < limitingQuota) limitingQuota = quota;
		});

		for (var ingredient of Object.keys(recipeDict)){
			invDict[ingredient]-= recipeDict[ingredient] * limitingQuota;
		}

		productionSteps.push({
			recipe: recipeDict,
			qty: limitingQuota,
		});

		// invDict might get modified, recipeDict uses a clone
		recipeDict = Alchemy.AdaptRecipe(recipeDict, invDict);
	}

	return {
		qty: limitingQuota,
		limiters: limiters,
		brewFn: function(batchSize){
			Alchemy.MakeItem(it, batchSize, player, inventory);
		}
	};
}

Alchemy.AdaptRecipe = function(recipeDict, invDict) {
	var origRecipeDict = recipeDict;
	recipeDict = Object.assign({}, recipeDict);

	for (var ingredient of Object.keys(recipeDict)){
		if(recipeDict[ingredient] == 0) continue;

		var ingredientObj = ItemIds[ingredient];

		if(invDict[ingredient] >= recipeDict[ingredient]) {
			// All is well, do nothing
		} else if (_.includes(player.recipes, ingredientObj)) {
			var ingredientRecipe = Alchemy.GetRecipeDict(ingredientObj);

			// For the sake of simplicity, if there's not enough of an item to do the recipe once,
			// the leftovers are considered to be equivalent amounts of their components.
			Object.keys(ingredientRecipe).forEach(function(ingredientComponent) {
				if (invDict[ingredient] !== 0) {
					if (!invDict[ingredientComponent]) invDict[ingredientComponent] = 0;

					invDict[ingredientComponent] += ingredientRecipe[ingredientComponent];
				}

				recipeDict[ingredientComponent] =
					(recipeDict[ingredientComponent] || 0) + ingredientRecipe[ingredientComponent];
			});

			recipeDict[ingredient] = 0;
		} else {
			// Can't craft this, no need to look any further
			return {};
		}
	}

	// And just to make sure the recipe still holds up, we recurse until the recipe comes back
	// unchanged or not at all
	if (_.isEqual(recipeDict, origRecipeDict)) return recipeDict;

	var checkedRecipe = Alchemy.AdaptRecipe(recipeDict, invDict);
	return checkedRecipe;
}