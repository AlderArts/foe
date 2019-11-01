
//
// Weapon Shop
//

import { Event } from "../../event";
import { Cassidy } from "../../event/cassidy";
import { CassidyFlags } from "../../event/cassidy-flags";
import { CassidyScenes } from "../../event/cassidy-scenes";
import { GAME, MoveToLocation, WORLD, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { Link } from "../../link";
import { IParse, Text } from "../../text";

const WeaponShopLoc = new Event("The Pale Flame");

WeaponShopLoc.description = () => {
	CassidyScenes.ShopDesc();
};

WeaponShopLoc.onEntry = () => {
	const cassidy: Cassidy = GAME().cassidy;
	const first = cassidy.flags.Met < CassidyFlags.Met.Met;
	if (first) {
		CassidyScenes.First();
	} else if (!(cassidy.flags.Talk & CassidyFlags.Talk.MShop) && (cassidy.Relation() >= 10) && (WorldTime().hour < 12)) {
		CassidyScenes.ManagingShop();
	} else if ((cassidy.flags.Met === CassidyFlags.Met.WentBack) && (cassidy.Relation() >= 30)) {
		CassidyScenes.BigReveal();
	} else if ((cassidy.flags.Met === CassidyFlags.Met.TalkFem) && (cassidy.femTimer.Expired())) {
		CassidyScenes.FemTalk2();
	} else if ((cassidy.flags.Met === CassidyFlags.Met.BeganFem) && (cassidy.femTimer.Expired())) {
		CassidyScenes.FemFinal();
	} else {
		Gui.PrintDefaultOptions();
	}
};

// TODO

WeaponShopLoc.events.push(new Link(
	"Cassidy", true, true, undefined,
	() => {
		CassidyScenes.Approach();
	},
));

WeaponShopLoc.events.push(new Link(
	"Leave", true, true, undefined,
	() => {
		MoveToLocation(WORLD().loc.Rigard.ShopStreet.Street, {minute: 5});
	},
));

export namespace WeaponShopScenes {

	export function IsOpen() {
		const rigard = GAME().rigard;
		return (WorldTime().hour >= 8 && WorldTime().hour < 17) && !rigard.UnderLockdown();
	}

	export function StreetDesc() {
		const cassidy: Cassidy = GAME().cassidy;
		const parse: IParse = {};

		const first = cassidy.flags.Met < CassidyFlags.Met.Met;
		const open  = WeaponShopScenes.IsOpen();
		const order = (cassidy.flags.Order !== CassidyFlags.Order.None) && !cassidy.orderTimer.Expired();

		if (first) {
			if (open) {
				Text.Add("Off to the side of the main street, you spy a modest brick building, clean and definitely looking in its place along the main merchants’ row. The windows are heavily barred, but the door is wide open and a small sign in the shape of a flame-wreathed blade announces the establishment’s name: The Pale Flame.", parse);
			} else {
				Text.Add("Off to the side of the main merchants’ row, you spy a clean and modest building shaped from white brick. The windows are barred, and a thick steel grille has been set over the main entrance, no doubt barred from inside. Seems like opening hours are over - you’ll have to come back in the morning if you want to get in.", parse);
			}
		} else {
			Text.Add("Off to one side of the main merchants’ row, you spy the familiar sight of The Pale Flame nestled amongst the other stores. ", parse);
			if (open) {
				Text.Add("The windows might be barred as always, but the door is invitingly open should you wish to browse Cassidy’s wares.", parse);
			} else {
				Text.Add("A grille has been drawn over the main door - which in turn has been no doubt barred from within. You’ll have to come back in the morning should you wish to browse Cassidy’s wares.", parse);
				if (order) {
					Text.Add(" However, through one of the windows you spy the yellow-white blaze of the forge at work. Seems like Cassidy’s busy, all right - you can only wonder what you’ll be getting at the end of it all…", parse);
				}
			}
		}
		Text.NL();
	}

}

export { WeaponShopLoc };
