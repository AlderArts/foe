import * as _ from "lodash";

import { Images } from "./assets";
import { Entity } from "./entity";
import { GAME, NAV } from "./GAME";
import { Gui } from "./gui";
import { Inventory } from "./inventory";
import { Item, ItemIds } from "./item";
import { Text } from "./text";

/*
 *
 * Alchemy
 *
 */
export namespace Alchemy {

	// callback in the form of function(item)
	export function Prompt(alchemist?: Entity, inventory?: Inventory, backPrompt?: any, callback?: any, preventClear?: boolean) {
		alchemist  = alchemist  || new Entity();
		inventory  = inventory  || new Inventory();

		if (!preventClear) {
			Text.Clear();
		}
		Text.Add("[name] can transmute the following items:", {name: alchemist.NameDesc()});

		let list: any[] = [];

		const Brew = (brewable: any) => {
			if (alchemist === GAME().player) {
				ItemDetails(brewable, inventory);
			} else {
				brewable.brewFn(1, backPrompt, callback);
			}
		};

		alchemist.recipes.forEach((item) => {
			let knownRecipe = false;

			const brewable = CountBrewable(item, inventory, alchemist);
			const shallowQty = brewable.steps[0].qty;
			const deepExtra = brewable.qty - shallowQty;
			const enabled  = !(!brewable.qty);

			let str = Text.Bold(item.name);
			str += " (" + shallowQty + ((deepExtra) ? " + " + deepExtra : "") + ")"  + ": ";
			item.recipe.forEach((component, idx) => {
				const available = inventory.QueryNum(component.it) || 0;
				const enough = (available >= (component.num || 1));
				if (idx > 0) { str += ", "; }
				if (!enough) { str += "<b>"; }
				str += (component.num || 1) + "/" + available + "x " + component.it.name;
				if (!enough) { str += "</b>"; }
			});

			if (alchemist === GAME().player) {
				knownRecipe = true;
			} else if (_.includes(GAME().player.recipes, item)) {
				knownRecipe = true;
			}

			list.push({
				_recipeStr: str,
				nameStr: item.name,
				enabled,
				tooltip: item.Long(),
				obj:     brewable,
				image:   knownRecipe ? Images.imgButtonEnabled : Images.imgButtonEnabled2,
				func:    Brew,
			});
		});

		list = _.sortBy(list, "nameStr");

		_.each(list, (it) => {
			Text.NL();
			Text.Add(it._recipeStr);
		});

		Gui.SetButtonsFromList(list, backPrompt, backPrompt);
		Text.Flush();
	}
}

function MakeItem(it: Item, qty: number, alchemist: Entity, inventory: Inventory, backPrompt: CallableFunction, callback: CallableFunction) {
	Text.Clear();
	Text.Add("[name] mix[es] the ingredients, preparing [qty]x [item].", {name: alchemist.NameDesc(), es: alchemist.plural() ? "" : "es", item: it.name, qty});
	Text.Flush();

	if (callback) {
		callback(it);
	} else {
		inventory.AddItem(it, qty);

		Gui.NextPrompt(() => {
			if (backPrompt) {
				Alchemy.Prompt(alchemist, inventory, backPrompt);
			} else {
				NAV().ShowAlchemy();
			}
		});
	}
}

function ItemDetails(brewable: any, inventory: Inventory) {
	const batchFormats = [1, 5, 10, 25];
	const list = [];
	const BrewBatch = brewable.brewFn;
	const inInventory = inventory.QueryNum(brewable.it);

	const parser = {
		item: brewable.it.name,
		maxQty: brewable.qty,
		upTo: (brewable.qty > 1) ? "up to" : "",
		inInv: inInventory,
	};

	Text.Clear();

	Text.Add("With the ingredients you have on hand, you could make [upTo] [maxQty]x [item].", parser);
	Text.NL();
	Text.Add("How much [item] do you want to make? ", parser);
	if (inInventory) { Text.Add("You are already carrying [inInv].", parser); }
	Text.NL();

	for (const format of batchFormats) {
		const enabled = format <= brewable.qty;
		const btnTxt = "x" + format;
		list.push({
			nameStr: btnTxt,
			enabled,
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

function GetRecipeDict(it: Item) {
	const recipe = it.recipe;
	const recipeDict: any = {};

	// There's always the possibility of some items being required more than once
	recipe.forEach((ingredient) => {
		if (!recipeDict[ingredient.it.id]) { recipeDict[ingredient.it.id] = 0; }
		recipeDict[ingredient.it.id] = + (ingredient.num || 1);
	});

	return recipeDict;
}

function CountBrewable(it: Item, inventory: Inventory, alchemist: Entity) {
	let recipeDict = GetRecipeDict(it);
	const invDict = _.chain(inventory.ToStorage()).keyBy("it").mapValues("num").value();
	const productionSteps: any[] = []; // [{qty: 5, recipe: [...]}]

	while (!_.isEmpty(recipeDict)) {
		let limitingQuota = Infinity;

		_.keys(recipeDict).forEach((ingredient) => {
			// Might cause divisions by zero otherwise.
			if (recipeDict[ingredient] === 0) { delete recipeDict[ingredient]; }
		});

		_.keys(recipeDict).forEach((ingredient) => {
			let available = invDict[ingredient];
			// FIXME : Unavailable items may be listed as "NaN" when building the dict, workaround
			if (!_.isFinite(available)) {
				available = 0;
				invDict[ingredient] = 0;
			}
			const quota = Math.floor(available / recipeDict[ingredient]);

			if (quota < limitingQuota) { limitingQuota = quota; }
		});

		_.keys(recipeDict).forEach((ingredient) => {
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
		it,
		qty: _.map(productionSteps, "qty").reduce((sum, qty) => {
			return sum += qty;
		}, 0),
		steps: productionSteps,
		brewFn(batchSize: number, backPrompt: any, callback: any, mockRemove: boolean) {
			let amountProduced = 0;
			productionSteps.some((step) => {
				const qty = Math.min(batchSize - amountProduced, step.qty);
				if (!mockRemove) {
					_.keys(step.recipe).forEach((componentId) => {
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

function AdaptRecipe(recipeDict: any, invDict: any, alchemist: Entity): any {
	const origRecipeDict = recipeDict;
	recipeDict = _.assign({}, recipeDict);

	const keys = _.keys(recipeDict);
	for (const ingredient of keys) {
		if (recipeDict[ingredient] === 0) { continue; }

		const ingredientObj = ItemIds[ingredient];

		if (invDict[ingredient] >= recipeDict[ingredient]) {
			// All is well, do nothing
		} else if (_.includes(alchemist.recipes, ingredientObj)) {
			const ingredientRecipe = GetRecipeDict(ingredientObj);

			// Set the amount for that ingredient to however many we have left
			const missingAmount = recipeDict[ingredient] - invDict[ingredient];
			recipeDict[ingredient] = invDict[ingredient]; // Most likely 0

			_.keys(ingredientRecipe).forEach((ingredientComponent) => {
				if (!recipeDict[ingredientComponent]) { recipeDict[ingredientComponent] = 0; }

				// If item X is needed 3 times for a recipe, all of its ingredients are also needed 3 times.
				// If we need it 3 times but missingAmount is 1, only add the ingredients 1 time.
				// The extra 2 times are for the next iteration
				recipeDict[ingredientComponent] += ingredientRecipe[ingredientComponent] * missingAmount;
			});
		} else {
			// Can't craft this, no need to look any further
			return {};
		}
	}

	// And just to make sure the recipe still holds up, we recurse until the recipe comes back
	// unchanged or not at all
	if (_.isEqual(recipeDict, origRecipeDict)) { return recipeDict; }

	const checkedRecipe = AdaptRecipe(recipeDict, invDict, alchemist);
	return checkedRecipe;
}
