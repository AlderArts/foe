
import { Gender } from "../../body/gender";
import { Race, RaceScore } from "../../body/race";
import { EncounterTable } from "../../encountertable";
import { Event } from "../../event";
import { Fera, FeraScenes } from "../../event/fera";
import { Player } from "../../event/player";
import { GAME, MoveToLocation, WORLD, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { IChoice, Link } from "../../link";
import { Party } from "../../party";
import { IParse, Text } from "../../text";

//
// Sliken Delights
//

const ClothShopLoc = new Event("Silken Delights");

export namespace ClothShopScenes {
	export function IsOpen() {
		const rigard = GAME().rigard;
		return (WorldTime().hour >= 9 && WorldTime().hour < 20) && !rigard.UnderLockdown();
	}
}

ClothShopLoc.onEntry = () => {
	const party: Party = GAME().party;
	const rigard = GAME().rigard;
	const parse: IParse = {};

	if (party.Two()) {
		parse.comp = " and " + party.Get(1).name;
	} else if (!party.Alone()) {
		parse.comp = " and your companions";
	} else {
		parse.comp = "";
	}

	if (rigard.flags.TailorMet === 0) {
		rigard.flags.TailorMet = 1;
		Text.Clear();
		Text.Add("You[comp] walk past the two guards stationed at the intricately crafted wooden doors of the Silken Delights clothing store. Once inside, you are amazed by what you see. There are red velvet drapes along the walls, red velvet curtains on the windows, and some very expensive looking paintings hanging on the walls.", parse);
		Text.NL();
		Text.Add("There are beautiful dresses in the windows facing the street, and many tall racks of countless other types of clothes lining the large and well decorated store interior. The counter is straight ahead from the door, and draped with the same red velvet as the walls and windows. The long racks of clothes stretch down a hallway to the left as well, where you can see large shelves of shoes and four large stalls along the back wall which you assume are fitting rooms for customers.", parse);
		Text.NL();
		Text.Add("The whole store is amazingly clean, with no sign of dirt or dust anywhere. There are numerous customers in the store; most that you can see are nobles. As you[comp] walk down the main aisle toward the counter you see a tall, full-figured woman in a long, flowing blue dress with long and curly blonde hair, measuring something on the counter with a large wooden ruler. Noticing you[comp] approach, she turns her head to both sides as if looking for something.", parse);
		Text.NL();
		Text.Add("<i>“<b>Fera!</b>”</i> she yells. A few seconds later, you see a short figure with brown hair carrying a pile of clothes rushing down the fitting room hallway, heading around the corner toward the counter.", parse);
		Text.NL();
		Text.Add("As she passes you[comp], you get a good look at her and are surprised by what you see. Fera appears to be a very cute catgirl. She has brown fur with white spots, large catlike ears on her head, and you can see her tail poking out through a slit in the back of her short pink dress as she rushes past you[comp]. She places the pile of clothes she was carrying on the counter next to the blonde woman.", parse);
		Text.NL();
		Text.Add("The woman stops measuring and whacks the catgirl over the head with her ruler. <i>“What took so long?”</i> she demands angrily.", parse);
		Text.NL();
		Text.Add("<i>“I'm very sorry Miss Nexelle,”</i> Fera quickly apologizes as she rubs her head.", parse);
		Text.NL();
		Text.Add("<i>“Now go get the rest,”</i> the woman, presumably the owner of the shop, orders.", parse);
		Text.NL();
		Text.Add("<i>“Right away, Miss Nexelle,”</i> the catgirl says as she turns around and runs back the way she came. The woman takes a garment from the new pile and begins measuring it. You[comp] walk past the hat racks and arrive at the counter, and the woman appears to not even notice you. When you try to get her attention, she does not even look up as she speaks. <i>“If you are not going to make a purchase, then please do not interrupt my work. If you have basic questions or need assistance trying on something, Fera can assist you.”</i>", parse);
		Text.Flush();
		Gui.NextPrompt();
	} else {
		Gui.PrintDefaultOptions();
	}
};

ClothShopLoc.description = () => {
	const parse: IParse = {};
	Text.Add("The Silken Delights clothing shop is clearly a high-end establishment, with two private guards, red velvet curtains and expensive-looking paintings all over. The counter is straight ahead from the door, and draped with the same red velvet as the walls and windows. Long racks of clothes stretch down a hallway to the left where you can see large shelves of shoes and four large stalls along the back wall which you assume are fitting rooms for customers. The whole store is amazingly clean, with no dirt or dust anywhere. There are hat racks by the counter with all sorts of fancy looking hats.", parse);
	Text.NL();
	/*
		if(WorldTime().hour >= 20 || WorldTime().hour < 9) {
			Text.Add("The shop is currently closed, and you are asked to leave.", parse);
			Gui.NextPrompt(() => {
				MoveToLocation(world.loc.Rigard.ShopStreet.Street, {minute: 5});
			});
		}
	*/
};

/*
ClothShopLoc.enc = new EncounterTable();
ClothShopLoc.enc.AddEnc(() => RigardScenes.Plaza.LetterDelivery, 1.0, () => (WorldTime().hour >= 6 && WorldTime().hour < 21));
ClothShopLoc.enc.AddEnc(() => RigardScenes.Plaza.StatueInfo, 1.0, () => (WorldTime().hour >= 6 && WorldTime().hour < 21) && (rigard.flags["TalkedStatue"] === 0 || (party.InParty(kiakai) && kiakai.flags["TalkedStatue"] === 0)));
*/

ClothShopLoc.events.push(new Link(
	"Nexelle", true, true,
	() => {
		const tailorRand = ["the tailor", "the owner", "Miss Nexelle"];
		const parse: IParse = {
			tailorName() { return tailorRand[Math.floor(Math.random() * tailorRand.length)]; },
		};

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("You see [tailorName] sitting at the counter, cutting some fabric.", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("You can see [tailorName] measuring a garment on the counter.", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("You see [tailorName] hanging up some new dresses.", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("You can see [tailorName] rearranging some shoes on the shelves back by the fitting rooms.", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("You see [tailorName] placing some new hats on the racks by the counter.", parse);
		}, 1.0, () => true);
		scenes.Get();

		Text.NL();
	},
	() => {
		const player: Player = GAME().player;
		const fera: Fera = GAME().fera;
		const rigard = GAME().rigard;

		const nexellePrompt = () => {
			if (!ClothShopScenes.IsOpen()) {
				Text.Add("The shop is closing, and you are asked to leave.");
				Text.Flush();
				Gui.NextPrompt(() => {
					MoveToLocation(WORLD().loc.Rigard.ShopStreet.Street);
				});
				return;
			}

			const parse: IParse = {
				sirmadam : player.body.Gender() === Gender.male ? "sir" : "madam",
			};
			Text.Clear();
			Text.Add("You go over to the tailor and try to speak with her.", parse);
			Text.NL();
			Text.Add("Miss Nexelle is clearly the owner of the store, and is an assertive and particularly beautiful woman. She has long, curly blonde hair that occasionally covers half her face and one of her brown eyes. She is wearing a long blue dress, one of the finest you have ever seen, made from dyed silk with little frills along the edges. The fine dress helps show off her slim waist and impressive figure, and even more impressive chest. Her dress is cut low around her neck, so that her cleavage is clearly visible.", parse);
			Text.NL();
			Text.Add("She looks at you as you approach her.", parse);
			Text.NL();

			const human = new RaceScore();
			human.score[Race.Human.id] = 1;
			const humanScore = human.Compare(new RaceScore(player.body));

			if (humanScore > 0.9 || player.charisma.Get() >= 50) {
				Text.Add("<i>“Oh, hello, [sirmadam], I am Miss Elaine Nexelle, proprietor of Silken Delights, where we have the finest selection of apparel in Rigard. If you have any questions regarding any of our finer apparel, I would be happy to help you make a selection...”</i> she says with a smile.", parse);
			} else if (humanScore > 0.5) {
				Text.Add("<i>“Yes? Do you need something?”</i> she asks without pausing in her work.", parse);
			} else {
				Text.Add("You can feel her cold stare as you walk over. <i>“The bargain clothes are over by the door, that’s probably what you want. If you need help you should go find Fera, and remember, if you damage anything, you buy it. If you can't afford it, I'll make you work it off,”</i> she says coldly before resuming her work.", parse);
			}

			Text.Flush();
			// [Nexelle][Store][Guards][City][Fera][Fera's mom]
			const options: IChoice[] = [];

			options.push({ nameStr : "Buy",
				func() {
					rigard.ClothShop.Buy(nexellePrompt);
				}, enabled : true,
			});
			options.push({ nameStr : "Sell",
				func() {
					rigard.ClothShop.Sell(nexellePrompt);
				}, enabled : true,
			});
			options.push({ nameStr : "Nexelle",
				func() {
					Text.Clear();
					Text.Add("You ask Miss Nexelle about herself.", parse);
					Text.NL();
					Text.Add("She stops working and looks up as she sighs deeply. <i>“I really used to be someone in Rigard, back before the Merchant Guild was broken up. My family, being one of the three most influential merchant families, had a lot of power in the guild.  Fortunately, I had saved plenty of money and had built up some connections in high places so I can still afford to buy high quality materials for my shop, keep all of my equipment, and keep my guards.”</i>", parse);
					Text.Flush();
				}, enabled : true,
				tooltip : "Ask the tailor about herself.",
			});
			options.push({ nameStr : "Store",
				func() {
					Text.Clear();
					Text.Add("You ask the tailor to tell you about her store.", parse);
					Text.NL();
					Text.Add("<i>“We have the finest clothing in the city, from silk and satin to wool and leather. I buy the finest materials and make everything we sell myself and I personally guarantee the quality of our goods. My mother and grandmother ran this shop before me, and it has been in our family since even before that. If you have the money, this is the place to shop for fashionable clothing, as it has been for over a century.”</i> She smiles, clearly proud of her establishment.", parse);
					Text.Flush();
				}, enabled : true,
				tooltip : "Ask her about the store.",
			});
			options.push({ nameStr : "Guards",
				func() {
					Text.Clear();
					Text.Add("You ask Miss Nexelle about the guards she has outside her store.", parse);
					Text.NL();
					Text.Add("<i>“John and Laura have worked here for years; they worked here back when my mother ran the shop, before she died five years ago. I believe good security is important to a successful business, so I kept them on.”</i> The tailor flips her hair and scratches her head a bit. <i>“I seem to recall mother saying they used to be part of some mercenary group before they started here.”</i>", parse);
					Text.Flush();
				}, enabled : true,
				tooltip : "Ask her about the two guards outside the store.",
			});
			options.push({ nameStr : "City",
				func() {
					Text.Clear();
					Text.Add("You ask the tailor to tell you about the city.", parse);
					Text.NL();
					Text.Add("<i>“Rigard is a nice place, but I wish the Merchants' Guild was still around. Otherwise, the city is very good for my business. The residents of the city who shop here have very good taste and plenty of money. I'd avoid any of the less reputable areas of the city though. I've heard some terrible stories about people getting abducted around there.”</i> She says.", parse);
					Text.Flush();
				}, enabled : true,
				tooltip : "Ask her what she thinks of Rigard.",
			});
			options.push({ nameStr : "Fera",
				func() {
					Text.Clear();
					Text.Add("You ask her about the cute catgirl that works for her.", parse);
					Text.NL();
					Text.Add("She rolls her eyes. <i>“Fera and her mother worked here for many years. Her mother was an excellent seamstress. Though not nearly as good as me, of course.”</i> She smiles awkwardly and flips her hair away from her face. <i>“When her mother disappeared years ago, I decided that I owed it to her to take care of Fera. She can only do basic sewing and is very clumsy, so I don't pay her much, but I let her live with me, feed her, and clothe her.”</i>", parse);
					Text.NL();
					Text.Add("She looks up as she says, <i>“I only hit her to discourage her clumsiness. Her blundering damages merchandise and costs me money.”</i>", parse);
					if (fera.flags.Mom === 0) {
						fera.flags.Mom = 1;
					}
					Text.Flush();
				}, enabled : true,
				tooltip : "Ask about Fera.",
			});
			if (fera.flags.Mom === 2) {
				options.push({ nameStr : "Fera's mom",
					func() {
						Text.Clear();

						if (player.FirstVag()) {
							Text.Add("You tell Miss Nexelle how sad and lonely Fera seems to be, and ask her about Fera's mother. She stops working and stays silent for a moment. When it finally comes, her response is uncharacteristically short. <i>“I miss her too, you know...”</i> she says quietly.", parse);
						} else {
							Text.Add("You ask Miss Nexelle about Fera's mother, but she just ignores you and continues with her work.", parse);
						}

						fera.flags.Mom = 3;
						Text.Flush();
						Gui.NextPrompt(nexellePrompt);
					}, enabled : true,
					tooltip : "Talk to her about Fera's mother.",
				});
			}
			Gui.SetButtonsFromList(options, true, Gui.PrintDefaultOptions);
		};
		nexellePrompt();
	},
));

ClothShopLoc.events.push(new Link(
	"Fera", true, () => {
		const fera: Fera = GAME().fera;
		return fera.timeout.Expired();
	},
	() => {
		const parse: IParse = {};
		// FERA
		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("You see Fera sweeping the floors between the clothing racks.", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("You see Fera wiping off the velvet covered counter.", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("You see Fera run down the aisle carrying a large pile of clothes.", parse);
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			Text.Add("You can see the cute catgirl organizing some robes on the racks.", parse);
		}, 1.0, () => true);
		scenes.Get();

		Text.NL();
	},
	() => { FeraScenes.Interact(); },
));

ClothShopLoc.events.push(new Link(
	"Leave", true, true, undefined,
	() => {
		MoveToLocation(WORLD().loc.Rigard.ShopStreet.Street, {minute: 5});
	},
));

ClothShopLoc.endDescription = () => {
	const party: Party = GAME().party;
	const parse: IParse = {};

	if (WorldTime().hour >= 9 && WorldTime().hour < 12) {
		Text.Add("It is still early but there are a few customers currently in the clothing store.", parse);
	}
	if (WorldTime().hour >= 12 && WorldTime().hour < 17) {
		Text.Add("It is currently prime business hours, and the shop is filled with customers.", parse);
	}
	if (WorldTime().hour >= 17 && WorldTime().hour < 20) {
		Text.Add("It is now fairly late and the shop is almost deserted.", parse);
	}
	Text.NL();

	if (party.Two()) {
		Text.Add("[p1name] walks around while you look around.", { p1name : party.Get(1).name });
		Text.NL();
	} else if (!party.Alone()) {
		Text.Add("Your companions walk around and look through all the clothes while you shop.", parse);
		Text.NL();
	}
};

export { ClothShopLoc };
