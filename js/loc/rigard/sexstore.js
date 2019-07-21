
//
// Shop of oddities
//

import { world } from '../../world';
import { Event, Link, Scenes } from '../../event';

let OddShopLoc = new Event("Odd shop");

Scenes.Rigard.OddShop = {};
Scenes.Rigard.OddShop.IsOpen = function() {
	return (world.time.hour >= 9 && world.time.hour < 18) && !rigard.UnderLockdown();
}

OddShopLoc.description = function() {
	Text.Add("You are in the odd shop.<br>");
}

OddShopLoc.events.push(new Link(
	"Shopkeeper", true, true, null,
	function() {
		Scenes.Rigard.OddShop.Prompt();
	}
));

OddShopLoc.events.push(new Link(
	"Leave", true, true, null,
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 5});
	}
));

Scenes.Rigard.OddShop.Prompt = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("This is pretty placeholder", parse);
	Text.NL();
	Text.Flush();
	var prompt = function() {
		//[name]
		var options = new Array();
		options.push({ nameStr : "Buy",
			func : function() {
				rigard.SexShop.Buy(prompt);
			}, enabled : true
		});
		options.push({ nameStr : "Sell",
			func : function() {
				rigard.SexShop.Sell(prompt);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, true);
	};
	prompt();
}

export { OddShopLoc };
