
//
// Armor Shop
//

Scenes.Rigard.ArmorShop = {};
Scenes.Rigard.ArmorShop.IsOpen = function() {
	return (world.time.hour >= 9 && world.time.hour < 18) && !rigard.UnderLockdown();
}


world.loc.Rigard.ShopStreet.ArmorShop.description = function() {
	Text.AddOutput("You are in the armor shop.<br/>");
}

world.loc.Rigard.ShopStreet.ArmorShop.events.push(new Link(
	"Shopkeeper", true, true, null,
	function() {
		Scenes.Rigard.ArmorShop.Prompt();
	}
));

world.loc.Rigard.ShopStreet.ArmorShop.events.push(new Link(
	"Leave", true, true, null,
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 5});
	}
));

world.loc.Rigard.ShopStreet.ArmorShop.endDescription = function() {
	Text.AddOutput("Where you go?<br/>");
}

Scenes.Rigard.ArmorShop.Prompt = function() {
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
				rigard.ArmorShop.Buy(prompt);
			}, enabled : true
		});
		options.push({ nameStr : "Sell",
			func : function() {
				rigard.ArmorShop.Sell(prompt);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, true);
	};
	prompt();
}
