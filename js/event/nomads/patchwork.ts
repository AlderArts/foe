/*
 *
 * Define Patchwork
 *
 */
import { GetDEBUG } from "../../../app";
import { Gender } from "../../body/gender";
import { Entity } from "../../entity";
import { GAME } from "../../GAME";
import { Gui } from "../../gui";
import { IStorage } from "../../istorage";
import { AlchemyItems } from "../../items/alchemy";
import { CombatItems } from "../../items/combatitems";
import { IngredientItems } from "../../items/ingredients";
import { ToysItems } from "../../items/toys";
import { IChoice } from "../../link";
import { Shop } from "../../shop";
import { IParse, Text } from "../../text";

export const PatchworkFlags = {
	Met : {
		NotMet     : 0,
		Met        : 1,
		Met2       : 2,
		KnowGender : 3,
	},
};

export class Patchwork extends Entity {
	public Shop: Shop;

	constructor(storage?: IStorage) {
		super();

		this.ID = "patchwork";

		this.name = "Patches";

		this.body.DefFemale();
		// TODO body

		/*
		* Set up patchworks shop
		*/
		this.Shop = new Shop();

		this.Shop.AddItem(CombatItems.HPotion, 5, undefined, PatchworkScenes.BuyFunc);

		this.Shop.AddItem(AlchemyItems.Equinium, 5, undefined, PatchworkScenes.BuyFunc);
		// this.Shop.AddItem(IngredientItems.HorseHair, 5, undefined, PatchworkScenes.BuyFunc);
		this.Shop.AddItem(IngredientItems.HorseShoe, 5, undefined, PatchworkScenes.BuyFunc);
		// this.Shop.AddItem(IngredientItems.HorseCum, 5, undefined, PatchworkScenes.BuyFunc);

		this.Shop.AddItem(AlchemyItems.Leporine, 5, undefined, PatchworkScenes.BuyFunc);
		this.Shop.AddItem(IngredientItems.RabbitFoot, 5, undefined, PatchworkScenes.BuyFunc);
		// this.Shop.AddItem(IngredientItems.CarrotJuice, 5, undefined, PatchworkScenes.BuyFunc);
		// this.Shop.AddItem(IngredientItems.Lettuce, 5, undefined, PatchworkScenes.BuyFunc);

		this.Shop.AddItem(AlchemyItems.Felinix, 5, undefined, PatchworkScenes.BuyFunc);
		// this.Shop.AddItem(IngredientItems.Whiskers, 5, undefined, PatchworkScenes.BuyFunc);
		this.Shop.AddItem(IngredientItems.HairBall, 5, undefined, PatchworkScenes.BuyFunc);
		// this.Shop.AddItem(IngredientItems.CatClaw, 5, undefined, PatchworkScenes.BuyFunc);

		this.Shop.AddItem(IngredientItems.CowBell, 5, undefined, PatchworkScenes.BuyFunc);

		this.Shop.AddItem(IngredientItems.DogBiscuit, 5, undefined, PatchworkScenes.BuyFunc);

		this.Shop.AddItem(IngredientItems.Trinket, 5, undefined, PatchworkScenes.BuyFunc);
		this.Shop.AddItem(IngredientItems.Feather, 5, undefined, PatchworkScenes.BuyFunc);
		this.Shop.AddItem(IngredientItems.FruitSeed, 5, undefined, PatchworkScenes.BuyFunc);

		this.Shop.AddItem(IngredientItems.Hummus, 5, undefined, PatchworkScenes.BuyFunc);

		this.Shop.AddItem(AlchemyItems.Fertilium, 5, undefined, PatchworkScenes.BuyFunc);
		this.Shop.AddItem(AlchemyItems.FertiliumPlus, 5, undefined, PatchworkScenes.BuyFunc);

		this.Shop.AddItem(AlchemyItems.Infertilium, 5, undefined, PatchworkScenes.BuyFunc);
		this.Shop.AddItem(AlchemyItems.InfertiliumPlus, 5, undefined, PatchworkScenes.BuyFunc);

		this.Shop.AddItem(ToysItems.SmallDildo, 5, undefined, PatchworkScenes.BuyFunc);

		this.flags = {};
		this.flags.Met = PatchworkFlags.Met.NotMet;

		if (storage) { this.FromStorage(storage); }
	}

	public KnowGender() {
		return this.flags.Met >= PatchworkFlags.Met.KnowGender;
	}
	public Met() {
		return this.flags.Met >= PatchworkFlags.Met.Met;
	}

	public FromStorage(storage: IStorage) {
		this.body.FromStorage(storage.body);
		this.LoadPersonalityStats(storage);
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);
	}

	public ToStorage() {
		const storage: IStorage = {};

		this.SaveBodyPartial(storage, {ass: true, vag: true});

		this.SavePersonalityStats(storage);
		this.SaveFlags(storage);
		this.SaveSexFlags(storage);

		return storage;
	}

	public PronounGender() {
		return this.flags.Met >= PatchworkFlags.Met.KnowGender ? Gender.female : Gender.male;
	}

	public heshe() {
		const gender = this.PronounGender();
		if (gender === Gender.male) { return "they"; } else { return "she"; }
	}
	public HeShe() {
		const gender = this.PronounGender();
		if (gender === Gender.male) { return "They"; } else { return "She"; }
	}
	public himher() {
		const gender = this.PronounGender();
		if (gender === Gender.male) { return "them"; } else { return "her"; }
	}
	public HimHer() {
		const gender = this.PronounGender();
		if (gender === Gender.male) { return "Them"; } else { return "Her"; }
	}
	public hisher() {
		const gender = this.PronounGender();
		if (gender === Gender.male) { return "their"; } else { return "her"; }
	}
	public HisHer() {
		const gender = this.PronounGender();
		if (gender === Gender.male) { return "Their"; } else { return "Her"; }
	}
	public hishers() {
		const gender = this.PronounGender();
		if (gender === Gender.male) { return "theirs"; } else { return "hers"; }
	}
	public mfPronoun(male: string, female: string) {
		const gender = this.PronounGender();
		if (gender === Gender.male) { return male; } else { return female; }
	}
}

export namespace PatchworkScenes {

	export function Interact() {
		const patchwork: Patchwork = GAME().patchwork;
		let parse: IParse = {};
		parse = patchwork.ParserPronouns(parse);

		Text.Clear();
		if (patchwork.flags.Met < PatchworkFlags.Met.Met) {
			Text.Add("You make your way toward the mysterious robed peddler and their makeshift shop, near the campfire. Even as you get right up to them, they remain as enigmatic as before; the robes they wear are so all-encompassing, you can’t make out anything about their features. You’re pretty sure that whatever’s under there is humanoid, but that’s as far as you’d dare to venture.", parse);
			Text.NL();
			Text.Add("Wide, flared sleeves completely swallow their arms and hands alike, whilst the hem trails along the ground, preventing even the slightest glimpse of their feet. A raised neck - a shawl, maybe, but it’s hard to tell where any part of the robe ends and another begins - combines with a low-fallen hood to completely obscure the face. And all over, patches of fabric, a dazzling array of pattern-fragments and colors, scattered about without any semblance of rhyme or reason.", parse);
			Text.NL();
			Text.Add("Some of the many patches look to have been added to preserve the life of the robes beneath, others to extend the original fabric and make it even more shrouding. A few folds of fabric suggest that some might have been added as makeshift pockets, and as far as you know, some of the more colorful ones may have even been added for decoration.", parse);
			Text.NL();
			Text.Add("The robed figure turns to look at you. <i>“You’re new,”</i> a muffled voice states.", parse);
			Text.NL();
			Text.Add("You’re about to introduce yourself when a small telescope emerges from the sea of patched cloth, extending until it’s a bit too close for comfort. You can see what looks like an eye through the lens. It swoops over you in a quick examination before retracting back into the robes.", parse);
			Text.NL();
			Text.Add("<i>“Welcome to my shop, stranger. What’s your business?”</i>", parse);
			Text.NL();
			Text.Add("The oddity of the merchant has you pausing for a moment, considering if you really want to do business with them after all.", parse);
			Text.Flush();
			PatchworkScenes.Prompt();
		} else if (patchwork.flags.Met < PatchworkFlags.Met.Met2) {
			Text.Add("With a little trepidation, you approach the eccentric peddler in their patchworked robes again, asking if they are willing to do business with you.", parse);
			Text.NL();
			Text.Add("<i>“Password?”</i>", parse);
			Text.NL();
			Text.Add("Password? You blink in confusion, then remember what the strange shopkeeper told you last time. Oh, yes, the password... now, what was it...?", parse);
			Text.Flush();

			const next = () => {
				Text.Clear();
				Text.Add("<i>“Close enough, what’s your business stranger?”</i>", parse);
				Text.NL();
				Text.Add("You blink slowly; they went to the trouble of demanding a password, and now they don’t even care if it’s the right one or not? Oh well... what did you want to do, anyway?", parse);
				Text.Flush();
				PatchworkScenes.Prompt();
			};

			// [Umm…][Something like…][Err…]
			const options: IChoice[] = [];
			options.push({ nameStr : "[Umm…]",
				func : next, enabled : true,
				tooltip : "What was it now?",
			});
			options.push({ nameStr : "[Was it…]",
				func : next, enabled : true,
				tooltip : "What was it now?",
			});
			options.push({ nameStr : "[Err…]",
				func : next, enabled : true,
				tooltip : "What was it now?",
			});
			Gui.SetButtonsFromList(options, false, undefined);
		} else {
			Text.Add("<i>“Password?”</i> the shady merchant asks.", parse);
			Text.NL();
			Text.Add("You shrug your shoulders, and spit out whatever random words pop into your head. You know [heshe]’ll let you shop just for playing along with whatever this silly game of [hishers] is.", parse);
			Text.NL();
			Text.Add("<i>“Close enough, what’s your business stranger?”</i>", parse);

			if (GetDEBUG()) {
				Text.NL();
				Text.Add("DEBUG: relation: " + patchwork.relation.Get(), undefined, "bold");
				Text.NL();
				Text.Add("DEBUG: subDom: " + patchwork.subDom.Get(), undefined, "bold");
				Text.NL();
				Text.Add("DEBUG: slut: " + patchwork.slut.Get(), undefined, "bold");
			}

			Text.Flush();
			PatchworkScenes.Prompt();
		}
	}

	export function PW() {
		const words = [
		"trinket", "bauble", "coin", "feather", "bird", "raven", "hemp", "pin", "yarn", "stone", "gem", "fish", "jelly", "goop", "key", "stitches", "clamp", "charm", "nymph", "blue", "red", "yellow", "green", "purple", "orange", "apple", "sauce", "gloom", "pockets", "gym", "scales", "shoe", "song", "groom", "bee", "wasp", "honey", "store", "laundry", "underwear", "cog", "long", "cat", "watch", "pineapple", "juice", "squawk", "fluffy tails", "dust", "hugs", "belly", "bomb", "pump", "grease",
		];

		const getWord = () => {
			const idx = Math.floor(Math.random() * words.length);
			const word = words[idx];
			words.splice(idx, 1);
			return word;
		};

		return getWord() + " " + getWord() + " " + getWord();
	}

	export function BuyFunc() {
		const patchwork: Patchwork = GAME().patchwork;
		patchwork.relation.IncreaseStat(10, 1);
		return false;
	}

	export function Prompt() {
		const patchwork: Patchwork = GAME().patchwork;
		let parse: IParse = {
			notS : patchwork.mfPronoun("", "s"),
		};
		parse = patchwork.ParserPronouns(parse);

		const options: IChoice[] = [];

		options.push({ nameStr : "Talk",
			func() {
				Text.Clear();
				Text.Add("[Placeholder] I'ma shopkeeper.");
			}, enabled : false, // TODO
		});
		options.push({ nameStr : "Buy",
			func() {
				Text.Clear();
				Text.Add("<i>“What are ya buying?”</i> [heshe] ask[notS], opening [hisher] robes to show you the item-lined pockets.", parse);
				Text.NL();
				patchwork.Shop.Buy(() => {
					Text.Clear();
					Text.Add("<i>“If you are in need of something, you will return.”</i>");
					Text.Flush();
					PatchworkScenes.Prompt();
				}, true);
			}, enabled : true,
		});
		options.push({ nameStr : "Sell",
			func() {
				Text.Clear();
				Text.Add("<i>“What are ya selling?”</i> [heshe] ask[notS], [hisher] telescopic monocle extending past [hisher] robes to examine your goods.", parse);
				Text.NL();
				patchwork.Shop.Sell(() => {
					Text.Clear();
					Text.Add("<i>“If you find something of interest, bring it back to me.”</i>");
					Text.Flush();
					PatchworkScenes.Prompt();
				}, true);
			}, enabled : true,
		});

		Gui.SetButtonsFromList(options, true, () => {
			parse.pw = PatchworkScenes.PW();

			Text.Clear();
			if (patchwork.flags.Met < PatchworkFlags.Met.Met) {
				Text.Add("<i>“Wait,”</i> the creature calls as you’re about to turn. <i>“The password for next time is: [pw]. Remember it or no business for you, stranger.”</i>", parse);
				Text.NL();
				Text.Add("Lets see… [pw], huh? Privately noting the oddity of requiring a password to do business to yourself, you assure the mysterious merchant you will remember it.", parse);
				patchwork.flags.Met = PatchworkFlags.Met.Met;
			} else if (patchwork.flags.Met < PatchworkFlags.Met.Met2) {
				Text.Add("<i>“Next time’s password is: [pw].”</i>", parse);
				Text.NL();
				Text.Add("Slowly you nod your head, dryly assuring them that you have it... but privately, you ask yourself if you really need it; so long as you play along, it looks like they’ll accept whatever you say.", parse);
				patchwork.flags.Met = PatchworkFlags.Met.Met2;
			} else {
				Text.Add("<i>“Next time’s password is: [pw].”</i>", parse);
				Text.NL();
				Text.Add("You nod your head, and assure them you have it.", parse);
			}
			Text.Flush();

			Gui.NextPrompt();
		});
	}

	export function Desc() {
		const patchwork: Patchwork = GAME().patchwork;
		let parse: IParse = {
			notS : patchwork.mfPronoun("", "s"),
			dont : patchwork.mfPronoun("don’t", "doesn’t"),
		};
		parse = patchwork.ParserPronouns(parse);

		if (!patchwork.Met()) {
			Text.Add("A strange individual wearing a patchwork robe has set up shop close to the campfire. ");
		} else {
			Text.Add("Patchwork the peddler is standing by the campfire. You have the distinct feeling [heshe] know[notS] you’re here, even if [heshe] [dont] seem to be moving at the moment. ", parse);
		}
		Text.NL();
	}

}
