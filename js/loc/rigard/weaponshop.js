
//
// Weapon Shop
//

import { Event, Link, MoveToLocation } from '../../event';
import { WorldTime } from '../../worldtime';
import { Text } from '../../text';

let WeaponShopLoc = new Event("The Pale Flame");

let WeaponShopScenes = {};

WeaponShopScenes.IsOpen = function() {
	return (WorldTime().hour >= 8 && WorldTime().hour < 17) && !rigard.UnderLockdown();
}

WeaponShopLoc.description = function() {
	Scenes.Cassidy.ShopDesc();
}

WeaponShopLoc.onEntry = function() {
	var first = cassidy.flags["Met"] < Cassidy.Met.Met;
	if(first) {
		Scenes.Cassidy.First();
	}
	else if(!(cassidy.flags["Talk"] & Cassidy.Talk.MShop) && (cassidy.Relation() >= 10) && (WorldTime().hour < 12)) {
		Scenes.Cassidy.ManagingShop();
	}
	else if((cassidy.flags["Met"] == Cassidy.Met.WentBack) && (cassidy.Relation() >= 30)) {
		Scenes.Cassidy.BigReveal();
	}
	else if((cassidy.flags["Met"] == Cassidy.Met.TalkFem) && (cassidy.femTimer.Expired())) {
		Scenes.Cassidy.FemTalk2();
	}
	else if((cassidy.flags["Met"] == Cassidy.Met.BeganFem) && (cassidy.femTimer.Expired())) {
		Scenes.Cassidy.FemFinal();
	}
	else {
		PrintDefaultOptions();
	}
}

//TODO

WeaponShopLoc.events.push(new Link(
	"Cassidy", true, true, null,
	function() {
		Scenes.Cassidy.Approach();
	}
));

WeaponShopLoc.events.push(new Link(
	"Leave", true, true, null,
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 5});
	}
));

WeaponShopScenes.StreetDesc = function() {
	var parse = {};
	
	var first = cassidy.flags["Met"] < Cassidy.Met.Met;
	var open  = WeaponShopScenes.IsOpen();
	var order = (cassidy.flags["Order"] != Cassidy.Order.None) && !cassidy.orderTimer.Expired();
	
	if(first) {
		if(open)
			Text.Add("Off to the side of the main street, you spy a modest brick building, clean and definitely looking in its place along the main merchants’ row. The windows are heavily barred, but the door is wide open and a small sign in the shape of a flame-wreathed blade announces the establishment’s name: The Pale Flame.", parse);
		else
			Text.Add("Off to the side of the main merchants’ row, you spy a clean and modest building shaped from white brick. The windows are barred, and a thick steel grille has been set over the main entrance, no doubt barred from inside. Seems like opening hours are over - you’ll have to come back in the morning if you want to get in.", parse);
	}
	else {
		Text.Add("Off to one side of the main merchants’ row, you spy the familiar sight of The Pale Flame nestled amongst the other stores. ", parse);
		if(open)
			Text.Add("The windows might be barred as always, but the door is invitingly open should you wish to browse Cassidy’s wares.", parse);
		else {
			Text.Add("A grille has been drawn over the main door - which in turn has been no doubt barred from within. You’ll have to come back in the morning should you wish to browse Cassidy’s wares.", parse);
			if(order)
				Text.Add(" However, through one of the windows you spy the yellow-white blaze of the forge at work. Seems like Cassidy’s busy, all right - you can only wonder what you’ll be getting at the end of it all…", parse);
		}
	}
	Text.NL();
}

export { WeaponShopLoc, WeaponShopScenes };
