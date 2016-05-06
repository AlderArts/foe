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
		Alchemy.MakeItem(it, 1, alchemist, inventory, backPrompt, callback);
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
		inventory.RemoveItem(component.it, component.num);
	});

	if(callback) {
		callback(it);
	} else {
		inventory.AddItem(it);

		Gui.NextPrompt(function() {
			if(backPrompt)
				Alchemy.AlchemyPrompt(alchemist, inventory, backPrompt);
			else
				ShowAlchemy();
		});
	}
}