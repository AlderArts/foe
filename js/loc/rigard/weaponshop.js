
//
// Weapon Shop
//

Scenes.Rigard.WeaponShop = {};
Scenes.Rigard.WeaponShop.IsOpen = function() {
	return (world.time.hour >= 9 && world.time.hour < 18) && !rigard.UnderLockdown();
}

world.loc.Rigard.ShopStreet.WeaponShop.description = function() {
	Text.AddOutput("You are in the weapon shop.<br/>");
}

world.loc.Rigard.ShopStreet.WeaponShop.events.push(new Link(
	"Shopkeeper", true, true, null,
	function() {
		Scenes.Rigard.WeaponShop.Prompt();
	}
));

world.loc.Rigard.ShopStreet.WeaponShop.events.push(new Link(
	"Leave", true, true, null,
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 5});
	}
));

world.loc.Rigard.ShopStreet.WeaponShop.endDescription = function() {
	Text.AddOutput("Where you go?<br/>");
}

Scenes.Rigard.WeaponShop.Prompt = function() {
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
				rigard.WeaponShop.Buy(prompt);
			}, enabled : true
		});
		options.push({ nameStr : "Sell",
			func : function() {
				rigard.WeaponShop.Sell(prompt);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, true);
	};
	prompt();
}
