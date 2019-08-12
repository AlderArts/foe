
//
// Asche's
//
import * as _ from 'lodash';

import { Event, Link } from '../../event';
import { EncounterTable } from '../../encountertable';
import { Shop } from '../../shop';
import { WorldTime, MoveToLocation, GAME, WORLD } from '../../GAME';
import { Text } from '../../text';
import { Gui } from '../../gui';
import { AscheFlags } from '../../event/asche-flags';
import { CombatItems } from '../../items/combatitems';
import { AlchemyItems } from '../../items/alchemy';
import { IngredientItems } from '../../items/ingredients';
import { AccItems } from '../../items/accessories';
import { WeaponsItems } from '../../items/weapons';
import { Item } from '../../item';

let MagicShopLoc = new Event("Asche's Fanciful Trinkets");

let AscheScenes : any;

export namespace MagicShopScenes {
	export function INIT(ascheScenes : any) {
		AscheScenes = ascheScenes;
	}

	let shop : any;
	export function MShop() { return shop };

	export function IsOpen() {
		let rigard = GAME().rigard;
		return (WorldTime().hour >= 10) && !rigard.UnderLockdown();
	}

	export function CreateShop() {
		let player = GAME().player;
		var buySuccessFunc = function(item : Item, cost : number, num : number) {
			var parse : any = {};
			
			Text.Clear();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() { Text.Add("<i>“Wonderful,”</i> the jackaless says as she takes your coins, flashing you a smile in return. <i>“Remember - not to be misusing things that Asche sells customer, for her guarantee of her goods not being harmful only holds if customer is not planning to do evil with it…”</i>", parse); });
			scenes.AddEnc(function() { Text.Add("Asche’s fingers flick the beads of her abacus as she sums up your total with lightning speed. <i>“Ah… there. Well, please to be taking ownership of new possession; may it be serving customer well. If you are having doubts, please to be taking it back to Asche, who will be explaining in more detail its use.”</i>", parse); });
			scenes.AddEnc(function() { Text.Add("With an almost lazy ease, Asche works her abacus with one hand while she counts your money with the other. Satisfied, she sweeps your coins to her side of the counter, then nudges your purchase to you. <i>“Please to be enjoying purchase. Asche is happy to help you out with your needs.”</i>", parse); });
			scenes.Get();
			
			Text.NL();
		};
		var buyFailFunc = function(item : Item, cost : number, bought : boolean) {
			var parse : any = {};
			
			Text.Clear();
			if(bought) {
				Text.Add("<i>“Anything else, good customer?”</i>", parse);
			}
			else {
				var scenes = new EncounterTable();
				scenes.AddEnc(function() { Text.Add("<i>“Oh? Customer is not liking price? Asche is sorry, she cannot be lowering cost any for good customer. Price is only being in coins - while she can be asking for other forms of payment, is very bad form to be doing so… and if coins is being too much for customer, then other payment is not likely to be favored, either. Maybe customer will be picking different purchase?”</i>", parse); });
				scenes.Get();
			}
			Text.NL();
		};
		var buyPromptFunc = function(item : Item, cost : number, bought : boolean) {
			var coin = Text.NumToText(cost);
			var parse : any = {
				heshe : player.mfFem("he", "she"),
				item : item.sDesc(),
				coin : coin,
				Coin : _.capitalize(coin)
			};
			if(!bought) Text.Clear();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() { Text.Add("<i>“Ah, so that is being customer’s desire? Asche can be selling it for [coin] coins. Price is always final, unless this jackaless is saying otherwise; she is knowing the worth of her stock.”</i>", parse); });
			scenes.AddEnc(function() { Text.Add("Asche peers at the [item] you’ve picked out. <i>“Oh, that one is being sold for [coin] coins. This jackaless is thinking that customer is making very good choice, may not be helpful in all situations, but then again, what is being that way? Is customer wishing to be buying?”</i>", parse); });
			scenes.AddEnc(function() { Text.Add("<i>“Customer’s choice is not exactly being what Asche expected, but is still being very fine nevertheless. Cost of that will be [coin] coins, [heshe] will be making payment, yes?”</i>", parse); });
			scenes.Get();
			
			Text.NL();
		};
		
		shop = new Shop({
			buyPromptFunc : buyPromptFunc,
			buySuccessFunc : buySuccessFunc,
			buyFailFunc : buyFailFunc,
			sellPromptFunc : function(item : Item, cost : number, sold : boolean) {
				var coin = Text.NumToText(cost);
				var parse : any = {
					item : item.sDesc(),
					coin : coin,
					Coin : _.capitalize(coin)
				};
				
				if(!sold) Text.Clear();
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("Asche squints at your [item], prodding it with her fingertips as she mumbles something under her breath. You notice the jackal-morph’s fingertips glow a faint gold, and then she raises her eyes to meet yours.", parse);
					Text.NL();
					Text.Add("<i>“Asche values this thing at [coin] coins. Is this acceptable to customer?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("You slide your [item] over the counter to Asche, who treats it as if it were a bubbling flask of hot acid. Slipping on a pair of heavy linen gloves, the jackaless turns in about, examining it from every side until she’s finally convinced it’s not an immediate threat.", parse);
					Text.NL();
					Text.Add("<i>“Asche can offer [coin] coins for this, good customer. No more, no less. While Asche owns store, Asche also needs to buy groceries and pay taxes.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("You hand over your [item] to Asche, who raises it to her muzzle and gives it a sniff. Closing her eyes, the jackaless mumbles to herself for a few seconds, then her eyes snap open and she smiles at you.", parse);
					Text.NL();
					Text.Add("<i>“For this thing here, Asche can offer good customer [coin] coins. What does good customer say to this deal?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.Get();
				
				Text.NL();
			},
			sellSuccessFunc : function(item : Item, cost : number, num : number) {
				var parse : any = {
					hisher : player.mfFem("his", "her"),
					heshe : player.mfFem("he", "she")
				};
				
				Text.Clear();
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("The jackaless’ muzzle widens in a toothy grin as she tucks your offering away under the counter. <i>“Asche is very pleased to do business with you. Thing you just sold her will get layer of spit and polish, then find its way onto shelf. Maybe if customer is regretting decision later, [heshe] can buy it back from Asche.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Asche’s smile widens as she counts out your payment, fingers clicking away at an abacus. <i>“And that concludes sale. May good customer enjoy [hisher] newfound wealth, although hopefully not all in one place.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.Get();
				
				Text.NL();
			},
			sellFailFunc : function(item : Item, cost : number, sold : boolean) {
				var parse : any = {
					hisher : player.mfFem("his", "her"),
					himher : player.mfFem("him", "her"),
					heshe : player.mfFem("he", "she")
				};
				
				Text.Clear();
				if(sold) {
					Text.Add("<i>“Anything else for Asche, good customer?”</i>", parse);
				}
				else {
					var scenes = new EncounterTable();
					scenes.AddEnc(function() { Text.Add("Asche smiles and returns the item to you. <i>“Customer is not liking price Asche has given? Is quite natural, everyone is thinking their little personal treasure is worth more than it is. Alas, Asche cannot pay for sentimental value - is pity, but what can she do? Perhaps there is something else customer might be wanting?”</i>", parse); });
					scenes.AddEnc(function() { Text.Add("The jackal-morph smiles and casually pushes your offering back to you. <i>“Customer is to be suiting [himher]self; Asche does not force anyone to accept her prices. Maybe customer is coming back when [heshe] is changing [hisher] mind, yes?”</i>", parse); });
					scenes.Get();
				}
				
				Text.NL();
			}
		});
		
		//For magic box
		shop.potions = [
			CombatItems.HPotion,
			CombatItems.EPotion,
			CombatItems.SpeedPotion,
			AlchemyItems.Gestarium
		];
		shop.consumables = [
			CombatItems.DecoyStick,
			CombatItems.SmokeBomb,
			CombatItems.PoisonDart,
			CombatItems.LustDart
		];
		shop.ingredients = [
			IngredientItems.HorseHair,
			IngredientItems.HorseShoe,
			IngredientItems.HorseCum,
			IngredientItems.RabbitFoot,
			IngredientItems.CarrotJuice,
			IngredientItems.Lettuce,
			IngredientItems.Whiskers,
			IngredientItems.HairBall,
			IngredientItems.CatClaw,
			IngredientItems.SnakeOil,
			IngredientItems.LizardScale,
			IngredientItems.LizardEgg,
			IngredientItems.SnakeFang,
			IngredientItems.SnakeSkin,
			IngredientItems.GoatMilk,
			IngredientItems.GoatFleece,
			IngredientItems.SheepMilk,
			IngredientItems.Ramshorn,
			IngredientItems.CowMilk,
			IngredientItems.CowBell,
			IngredientItems.FreshGrass,
			IngredientItems.CanisRoot,
			IngredientItems.DogBone,
			IngredientItems.DogBiscuit,
			IngredientItems.WolfFang,
			IngredientItems.Wolfsbane,
			IngredientItems.FoxBerries,
			IngredientItems.Foxglove,
			IngredientItems.CorruptPlant,
			IngredientItems.BlackGem,
			IngredientItems.CorruptSeed,
			IngredientItems.DemonSeed,
			IngredientItems.Hummus,
			IngredientItems.SpringWater,
			IngredientItems.Letter,
			IngredientItems.Feather,
			IngredientItems.Trinket,
			IngredientItems.FruitSeed,
			IngredientItems.PipeLeaf,
			IngredientItems.MFluff,
			IngredientItems.MDust,
			IngredientItems.Stinger,
			IngredientItems.SVenom,
			IngredientItems.SClaw,
			IngredientItems.TreeBark,
			IngredientItems.AntlerChip,
			IngredientItems.FlowerPetal,
			IngredientItems.RawHoney,
			IngredientItems.BeeChitin
		];

		//Actual inventory
		shop.AddItem(CombatItems.HPotion, 5);
		shop.AddItem(CombatItems.EPotion, 5);
		shop.AddItem(CombatItems.SpeedPotion, 5);
		shop.AddItem(AlchemyItems.Gestarium, 5);
		shop.AddItem(CombatItems.DecoyStick, 5);
		shop.AddItem(CombatItems.SmokeBomb, 5);
		shop.AddItem(AccItems.CrudeBook, 5);
		shop.AddItem(AccItems.GoldEarring, 5);
		shop.AddItem(AccItems.SimpleCharm, 5);
		shop.AddItem(WeaponsItems.WoodenStaff, 5);
		shop.AddItem(WeaponsItems.MageStaff, 5);
		shop.AddItem(WeaponsItems.AmberStaff, 5);
	}
}

MagicShopLoc.description = function() {
	var parse : any = {
		
	};
	
	//TODO Technically not correct. Belongs in a RegularEntry function
	Text.Add("Stepping into the interior of the brightly-lit shop to the jingle of chimes, you are immediately surrounded by the scent of sandalwood and jasmine. Its source is easily identified: a large, porcelain, pig-shaped incense burner hanging from the ceiling by a trio of stout chains. The smell is jarring at first, but rapidly fades into the background as your nose gets used to it, and you have to admit, it definitely sets the mood of the little store.", parse);
	Text.NL();
	Text.Add("A hefty portion of the merchandise on display consists of antiques, knick-knacks, and gewgaws of all shapes, sizes and colors, most of them small pieces of jewelery supposedly charmed for one purpose or another - one to ward off illness, another to bring wealth, and yet another to make one appear more attractive. You doubt that most of them actually work, or at least function in the way that they’re intended to; nevertheless, each item has a small placard in front of it, detailing exactly what it does.", parse);
	Text.NL();
	Text.Add("On display at the front of the shop today is ", parse);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("a porcelain statuette of a rotund white cat, its left paw resting on a sack of money, while its right is held up in the air. Upon closer inspection, you find that the right arm is connected to some kind of spring mechanism, and winding up a key on its back causes the cat to wave in a welcoming fashion.", parse);
		Text.NL();
		Text.Add("A small card on the bottom of the statuette claims that it’s supposed to bring wealth and good business to its owner. Endearing as it is, you’re not even sure what the statuette is doing here, as it hardly seems magical at all.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("a rather plain-looking sword fashioned from ensorcelled glass. The item’s description states that glass swords were once widely known as terribly dangerous weapons, capable of dealing grave blows and felling even the mightiest of foes with a single stroke. The trade-off was that each weapon could only be used once, as striking an enemy often meant the blade shattering into pieces - the broken shards were designed to dig into an enemy’s flesh.", parse);
		Text.NL();
		Text.Add("This was not a problem on these weapons’ home plane due to their mass production and the abundance of glass, but where they were brought by trade, glass swords were known to be as rare as they were deadly.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("a finely woven wicker basket. So long as it’s kept supplied with magical power - or so the placard claims - one just has to reach into it to draw out a sandwich, conjured just to one’s liking, bread, filling and all. Apparently, it was created by an over-studious apprentice who didn’t just want to avoid cooking, but paled at the thought of leaving the library at all.", parse);
		Text.NL();
		Text.Add("Where exactly the sandwiches originate is best left up to one’s imagination - they’re indistinguishable from those prepared by hand in texture, smell and taste, so it can’t be too much of a problem, can it?", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("a nondescript glass flask touted as absolutely unbreakable under circumstances of normal use. There’s even a placard listing exactly how many times customers have tried to smash this particular piece: nine, apparently.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("a plain talisman of pure silver, without so much as a speck of tarnish. It’s pleasing enough to the eye as an item of jewelery, but there’s no placard on this one. Instead, a small label has been affixed to the talisman’s chain, with <b>“Danger! Unknown properties! Not for sale!”</b> written on it. Probably quite effective for drawing curious customers to the rest of the shop.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("an ensemble of attire befitting a wizard - robe, hat, staff and all. Heck, there are even some curly-toed shoes! Reading the placard, this outfit supposedly belonged to the Wizard of Yendor, although to be frank, he can’t be that great of a wizard if you’ve never heard of him, right?", parse);
	}, 1.0, function() { return true; });
	scenes.Get();
	
	Text.NL();
	Text.Add("Other trinkets are kept in a large wooden bin by the entrance, a jumbled heap of odds and ends that manage to look appropriately mystical despite their cluttered state. No doubt these are the cheaper pieces of stock that simply won’t sell, and a label says they’ve been marked down in price; the proprietress is clearly someone who doesn’t believe in just throwing things out.", parse);
	Text.NL();
	Text.Add("Last but not least is a small corner dedicated to alchemy, with racks upon racks of potions on display, each and every one of them in stoppered glass vials. Unfortunately - or perhaps fortunately, depending on one’s point of view - there aren’t any transformatives on sale. There’s also a small alchemy laboratory, which must be where the products are concocted. It’s fully equipped, not one of the makeshift rigs so beloved of amateur alchemists everywhere.", parse);
	Text.NL();
	Text.Add("Sitting behind the counter, Asche lazily sways her tail from side to side as she surveys those in the store. A large warning sign is up by the door: “Shoplifters will be -”, the last word blurred and faded to illegibility with age. Somehow, the missing word just makes the penalty sound more ominous.", parse);
}

MagicShopLoc.events.push(new Link(
	"Asche", true, true, null,
	function() {
		let player = GAME().player;
		var parse : any = {
			handsomepretty : player.mfFem("handsome", "pretty")
		};
		
		Text.Clear();
		Text.Add("You approach the counter and Asche’s ears perk up, the proprietress rousing herself with an air of barely contained enthusiasm. The jackaless’ tail swishes back and forth as she leans on the counter with her head in her hands, dark eyes fixed on you like a friendly yet mischievous puppy. <i>“Ah, [handsomepretty] customer has returned! Can Asche do something to brighten customer’s day?”</i>", parse);
		Text.Flush();
		
		AscheScenes.Prompt();
	}
));

MagicShopLoc.events.push(new Link(
	"Leave", true, true, null,
	function() {
		MoveToLocation(WORLD().loc.Rigard.ShopStreet.Street, {minute: 5});
	}
));

MagicShopLoc.onEntry = function() {
	let asche = GAME().asche;
	if(asche.flags["Met"] < AscheFlags.Met.Met)
		AscheScenes.FirstEntry();
	//TODO LINK NEW STUFF
	/*
	else if(X && rigard.Twopenny["Met"] < 2) {
		Scenes.Rigard.ArmorShop.RegularEntry(true);
	}
	*/
	else
		Gui.PrintDefaultOptions();
}

export { MagicShopLoc };
