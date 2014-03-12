/*
 * 
 * Alchemy
 * 
 */
Alchemy = {};

// callback in the form of function(item)
Alchemy.AlchemyPrompt = function(alchemist, inventory, backPrompt, callback) {
	alchemist  = alchemist  || new Entity();
	inventory  = inventory  || new Inventory();
	
	Text.Clear();
	Text.AddOutput("[name] can transmute the following items:", {name: alchemist.NameDesc()});
	Text.Newline();
	
	list = [];
	for(var i = 0; i < alchemist.recipes.length; i++) {
		var item = alchemist.recipes[i];
		var enabled = true;
		var str = Text.BoldColor(item.name) + ": ";
		for(var j = 0; j < item.Recipe.length; j++) {
			var component = item.Recipe[j];
			str     += (component.num || 1) + "x " + component.it.name + " ";
			enabled &= (inventory.QueryNum(component.it) >= (component.num || 1));
		}
		Text.AddOutput(str);
		Text.Newline();
		
		list.push({
			nameStr: item.name,
			enabled: enabled,
			tooltip: item.Long(),
			obj:     item,
			func: function(it) {
				Text.Clear();
				Text.AddOutput("[name] mixes the ingredients, preparing 1x [item].", {name: alchemist.NameDesc(), item: it.name});
				
				for(var j = 0; j < it.Recipe.length; j++) {
					var ingredient = it.Recipe[j];
					inventory.RemoveItem(ingredient.it, ingredient.num);
				}
				
				if(callback) {
					callback(it);
				}
				else {
					inventory.AddItem(it);
				
					Gui.NextPrompt(function() {
						if(backPrompt)
							Alchemy.AlchemyPrompt(alchemist, inventory, backPrompt);
						else
							ShowAlchemy();
					});
				}
			}
		});
	}
	Gui.SetButtonsFromList(list, backPrompt, backPrompt);
}
