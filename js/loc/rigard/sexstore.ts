
//
// Shop of oddities
//

import { Event } from "../../event";
import { GAME, MoveToLocation, WORLD, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { IChoice, Link } from "../../link";
import { IParse, Text } from "../../text";

const OddShopLoc = new Event("Odd shop");

OddShopLoc.description = () => {
	Text.Add("You are in the odd shop.<br>");
};

OddShopLoc.events.push(new Link(
	"Shopkeeper", true, true, undefined,
	() => {
		OddShopScenes.Prompt();
	},
));

OddShopLoc.events.push(new Link(
	"Leave", true, true, undefined,
	() => {
		MoveToLocation(WORLD().loc.Rigard.ShopStreet.Street, {minute: 5});
	},
));

export namespace OddShopScenes {

	export function IsOpen() {
		const rigard = GAME().rigard;
		return (WorldTime().hour >= 9 && WorldTime().hour < 18) && !rigard.UnderLockdown();
	}

	export function Prompt() {
		const rigard = GAME().rigard;

		const parse: IParse = {

		};

		Text.Clear();
		Text.Add("This is pretty placeholder", parse);
		Text.NL();
		Text.Flush();
		const prompt = () => {
			// [name]
			const options: IChoice[] = [];
			options.push({ nameStr : "Buy",
				func() {
					rigard.SexShop.Buy(prompt);
				}, enabled : true,
			});
			options.push({ nameStr : "Sell",
				func() {
					rigard.SexShop.Sell(prompt);
				}, enabled : true,
			});
			Gui.SetButtonsFromList(options, true);
		};
		prompt();
	}

}

export { OddShopLoc };
