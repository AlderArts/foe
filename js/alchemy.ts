import * as _ from 'lodash';

import { Images } from "./assets";
import { Inventory } from "./inventory";
import { Text } from "./text";
import { Gui } from "./gui";
import { GAME, NAV } from "./GAME";
import { Entity } from './entity';
import { ItemIds, Item } from './item';

/*
 * 
 * Alchemy
 * 
 */
export namespace Alchemy {

	// callback in the form of function(item)
	export function Prompt(alchemist? : Entity, inventory? : Inventory, backPrompt? : any, callback? : any, preventClear? : boolean) {
		alchemist  = alchemist  || new Entity();
		inventory  = inventory  || new Inventory();
		
		if(!preventClear)
			Text.Clear();
		Text.Add("[name] can transmute the following items:", {name: alchemist.NameDesc()});
		
		let list : any[] = [];

		let Brew = function(brewable : any) {
			if (alchemist == GAME().player) {
				ItemDetails(brewable, inventory);
			} else {
				brewable.brewFn(1, backPrompt, callback);
			}
		}

		alchemist.recipes.forEach(function(item) {
			let knownRecipe = false;

			let brewable = CountBrewable(item, inventory, alchemist);
			let shallowQty = brewable.steps[0].qty;
			let deepExtra = brewable.qty - shallowQty;
			let enabled  = !(!brewable.qty);

			let str = Text.Bold(item.name);
			str += " ("+ shallowQty + ((deepExtra) ? " + " + deepExtra : "") +")"  + ": ";
			item.recipe.forEach(function(component, idx) {
				let available = inventory.QueryNum(component.it) || 0;
				let enough = (available >= (component.num || 1));
				if(idx > 0) str += ", ";
				if(!enough) str += "<b>";
				str += (component.num || 1) + "/" + available + "x " + component.it.name;
				if(!enough) str += "</b>";
			});

			if(alchemist == GAME().player) {
				knownRecipe = true;
			} else if (_.includes(GAME().player.recipes, item)) {
				knownRecipe = true;
			}

			list.push({
				_recipeStr: str,
				nameStr: item.name,
				enabled: enabled,
				tooltip: item.Long(),
				obj:     brewable,
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
}

function MakeItem(it : Item, qty : number, alchemist : Entity, inventory : Inventory, backPrompt : CallableFunction, callback : CallableFunction) {
	Text.Clear();
	Text.Add("[name] mix[es] the ingredients, preparing [qty]x [item].", {name: alchemist.NameDesc(), es: alchemist.plural() ? "" : "es", item: it.name, qty: qty});
	Text.Flush();

	if(callback) {
		callback(it);
	} else {
		inventory.AddItem(it, qty);

		Gui.NextPrompt(function() {
			if(backPrompt)
				Alchemy.Prompt(alchemist, inventory, backPrompt);
			else
				NAV().ShowAlchemy();
		});
	}
};

function ItemDetails(brewable : any, inventory : Inventory) {
	let batchFormats = [1, 5, 10, 25];
	let list = [];
	let BrewBatch = brewable.brewFn;
	let inInventory = inventory.QueryNum(brewable.it);

	let parser = {
		item: brewable.it.name,
		maxQty: brewable.qty,
		upTo: (brewable.qty > 1) ? "up to" : "",
		inInv: inInventory,
	}

	Text.Clear();

	Text.Add("With the ingredients you have on hand, you could make [upTo] [maxQty]x [item].", parser);
	Text.NL();
	Text.Add("How much [item] do you want to make? ", parser);
	if (inInventory) Text.Add("You are already carrying [inInv].", parser);
	Text.NL();

	for(let i = 0; i < batchFormats.length; i++) {
		let format = batchFormats[i];
		let enabled = format <= brewable.qty;
		let btnTxt = "x" + format;
		list.push({
			nameStr: btnTxt,
			enabled: enabled,
			obj:     format,
			func:    BrewBatch,
		});
	}
	// Add a "brew all", for the maximum number of brews
	list.push({
		nameStr: "All (x" + brewable.qty + ")",
		enabled: true,
		obj:     brewable.qty,
		func:    BrewBatch,
	});

	Gui.SetButtonsFromList(list, true);
	Text.Flush();
}

function GetRecipeDict(it : Item) {
	let recipe = it.recipe;
	let recipeDict : any = {};

	// There's always the possibility of some items being required more than once
	recipe.forEach(function(ingredient) {
		if(!recipeDict[ingredient.it.id]) recipeDict[ingredient.it.id] = 0;
		recipeDict[ingredient.it.id] =+ (ingredient.num || 1);
	});

	return recipeDict;
}

function CountBrewable(it : Item, inventory : Inventory, alchemist : Entity) {
	let recipeDict = GetRecipeDict(it);
	let invDict = _.chain(inventory.ToStorage()).keyBy('it').mapValues('num').value();
	let productionSteps : any[] = []; // [{qty: 5, recipe: [...]}]

	while(!_.isEmpty(recipeDict)) {
		let limitingQuota = Infinity;

		_.keys(recipeDict).forEach(function(ingredient) {
			// Might cause divisions by zero otherwise.
			if(recipeDict[ingredient] === 0) delete recipeDict[ingredient];
		});

		_.keys(recipeDict).forEach(function(ingredient) {
			let available = invDict[ingredient];
			// FIXME : Unavailable items may be listed as "NaN" when building the dict, workaround
			if (!_.isFinite(available)) {
				available = 0;
				invDict[ingredient] = 0;
			}
			let quota = Math.floor(available/recipeDict[ingredient]);

			if(quota < limitingQuota) limitingQuota = quota;
		});

		_.keys(recipeDict).forEach(function(ingredient) {
			invDict[ingredient] -= recipeDict[ingredient] * limitingQuota;
		});
		
		productionSteps.push({
			recipe: recipeDict,
			qty: limitingQuota,
		});

		// invDict might get modified, recipeDict uses a clone
		recipeDict = AdaptRecipe(recipeDict, invDict, alchemist);
	}

	return {
		it: it,
		qty: _.map(productionSteps, 'qty').reduce(function(sum, qty) {
			return sum += qty;
		}, 0),
		steps: productionSteps,
		brewFn: function(batchSize : number, backPrompt : any, callback : any, mockRemove : boolean) {
			let amountProduced = 0;
			productionSteps.some(function(step) {
				let qty = Math.min(batchSize - amountProduced, step.qty);
				if(!mockRemove) {
					_.keys(step.recipe).forEach(function(componentId) {
						inventory.RemoveItem(ItemIds[componentId], step.recipe[componentId] * qty);
					});
				}

				amountProduced += qty;
				return (amountProduced >= batchSize);
			});

			MakeItem(it, amountProduced, alchemist, inventory, backPrompt, callback);
		},
	};
}

function AdaptRecipe(recipeDict : any, invDict : any, alchemist : Entity) : any {
	let origRecipeDict = recipeDict;
	recipeDict = _.assign({}, recipeDict);

	let keys = _.keys(recipeDict);
	for(let i = 0; i < keys.length; i++) {
		let ingredient = keys[i];
		if(recipeDict[ingredient] == 0) continue;

		let ingredientObj = ItemIds[ingredient];

		if(invDict[ingredient] >= recipeDict[ingredient]) {
			// All is well, do nothing
		} else if (_.includes(alchemist.recipes, ingredientObj)) {
			let ingredientRecipe = GetRecipeDict(ingredientObj);

			// Set the amount for that ingredient to however many we have left
			let missingAmount = recipeDict[ingredient] - invDict[ingredient];
			recipeDict[ingredient] = invDict[ingredient]; // Most likely 0

			_.keys(ingredientRecipe).forEach(function(ingredientComponent) {
				if(!recipeDict[ingredientComponent]) recipeDict[ingredientComponent] = 0;

				// If item X is needed 3 times for a recipe, all of its ingredients are also needed 3 times.
				// If we need it 3 times but missingAmount is 1, only add the ingredients 1 time.
				// The extra 2 times are for the next iteration
				recipeDict[ingredientComponent] += ingredientRecipe[ingredientComponent]*missingAmount;
			});
		} else {
			// Can't craft this, no need to look any further
			return {};
		}
	}

	// And just to make sure the recipe still holds up, we recurse until the recipe comes back
	// unchanged or not at all
	if (_.isEqual(recipeDict, origRecipeDict)) return recipeDict;

	let checkedRecipe = AdaptRecipe(recipeDict, invDict, alchemist);
	return checkedRecipe;
}
