import * as _ from "lodash";

import { Gender } from "../body/gender";
import { EncounterTable } from "../encountertable";
import { Entity } from "../entity";
import { Player } from "../event/player";
import { GAME, TimeStep, WorldTime } from "../GAME";
import { Gui } from "../gui";
import { IStorage } from "../istorage";
import { Item } from "../item";
import { IngredientItems } from "../items/ingredients";
import { IChoice } from "../link";
import { Party } from "../party";
import { Shop } from "../shop";
import { IParse, Text } from "../text";
import { ITime } from "../time";
import { OasisFlags } from "./oasis-flags";

export class Oasis {
	public flags: any;
	public shop: Shop;
	public shopItems: Item[];
	public Shopbought: boolean;

	constructor(storage?: IStorage) {
		this.flags = {};
		this.Shopbought = false;

		// Caravan Shop
		this.shop = new Shop();
		this.flags.shop     = 0;
		this.shopItems = []; // TODO
		this.shopItems.push(IngredientItems.HorseHair);
		this.shopItems.push(IngredientItems.HorseShoe);
		this.shopItems.push(IngredientItems.HorseCum);
		this.shopItems.push(IngredientItems.RabbitFoot);
		this.shopItems.push(IngredientItems.CarrotJuice);
		this.shopItems.push(IngredientItems.Lettuce);
		this.shopItems.push(IngredientItems.Whiskers);
		this.shopItems.push(IngredientItems.HairBall);
		this.shopItems.push(IngredientItems.CatClaw);
		this.shopItems.push(IngredientItems.SnakeOil);
		this.shopItems.push(IngredientItems.LizardScale);
		this.shopItems.push(IngredientItems.LizardEgg);
		this.shopItems.push(IngredientItems.GoatMilk);
		this.shopItems.push(IngredientItems.SheepMilk);
		this.shopItems.push(IngredientItems.Ramshorn);
		this.shopItems.push(IngredientItems.CowMilk);
		this.shopItems.push(IngredientItems.CowBell);
		this.shopItems.push(IngredientItems.FreshGrass);
		this.shopItems.push(IngredientItems.CanisRoot);
		this.shopItems.push(IngredientItems.DogBone);
		this.shopItems.push(IngredientItems.DogBiscuit);
		this.shopItems.push(IngredientItems.WolfFang);
		this.shopItems.push(IngredientItems.Wolfsbane);
		this.shopItems.push(IngredientItems.FoxBerries);
		this.shopItems.push(IngredientItems.Foxglove);
		this.shopItems.push(IngredientItems.BlackGem);
		this.shopItems.push(IngredientItems.Hummus);
		this.shopItems.push(IngredientItems.SpringWater);
		this.shopItems.push(IngredientItems.Feather);
		this.shopItems.push(IngredientItems.Trinket);
		this.shopItems.push(IngredientItems.FruitSeed);
		this.shopItems.push(IngredientItems.MFluff);
		this.shopItems.push(IngredientItems.MDust);
		this.shopItems.push(IngredientItems.Stinger);
		this.shopItems.push(IngredientItems.SVenom);
		this.shopItems.push(IngredientItems.SClaw);
		this.shopItems.push(IngredientItems.TreeBark);
		this.shopItems.push(IngredientItems.AntlerChip);
		this.shopItems.push(IngredientItems.GoatFleece);
		this.shopItems.push(IngredientItems.FlowerPetal);
		this.shopItems.push(IngredientItems.RawHoney);
		this.shopItems.push(IngredientItems.BeeChitin);

		this.flags.Visit = OasisFlags.Visit.NotVisited;
		this.flags.Rakh = OasisFlags.RakhFlag.NotSeen;

		if (storage) { this.FromStorage(storage); }
	}

	public ToStorage() {
		const storage: IStorage = {};

		storage.flags   = this.flags;

		return storage;
	}

	public FromStorage(storage: IStorage) {
		// Load flags
		_.forIn(storage.flags, (value, key) => {
			this.flags[key] = parseInt(value as string, 10);
		});
	}

	public Update(step: ITime) {

	}

	public SeenRakh() {
		return this.flags.Rakh >= OasisFlags.RakhFlag.Seen;
	}
}

export namespace OasisScenes {

	export function CaravanShop(back: CallableFunction) {
		const oasis: Oasis = GAME().oasis;
		const parse: IParse = {

		};

		oasis.Shopbought = false;

		const backPrompt = () => {
			Text.Clear();
			if (oasis.Shopbought) {
				Text.Add("<i>“Thank you for your patronage!”</i>", parse);
			} else {
				Text.Add("<i>“Perhaps next time, my friend?”</i>", parse);
			}
			Text.Flush();

			back();
		};

		const buyFunc = () => {
			oasis.Shopbought = true;
			return false;
		};

		const timestamp = Math.floor(WorldTime().ToDays());
		if (oasis.flags.shop < timestamp || oasis.shop.inventory.length === 0) {
			// Randomize inventory
			oasis.shop.inventory = [];

			const num = Math.round(4 + 8 * Math.random());
			for (let i = 0; i < num; i++) {
				const it = oasis.shopItems[Math.floor(Math.random() * oasis.shopItems.length)];
				let found = false;
				for (const item of oasis.shop.inventory) {
					if (it === item.it) {
						found = true;
						break;
					}
				}
				if (found) { continue; }
				oasis.shop.AddItem(it, 5, undefined, buyFunc);
			}

			oasis.flags.shop = timestamp;
		}

		oasis.shop.Buy(backPrompt, true);
	}

	export function DesertCaravanEncounter() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const oasis: Oasis = GAME().oasis;
		let parse: IParse = {

		};
		parse = player.ParserTags(parse);

		const lizan = new Entity();
		let rand = Math.random();
		if (rand < 0.4) {
			lizan.body.DefFemale();
		} else if (rand < 0.8) {
			lizan.body.DefMale();
		} else {
			lizan.body.DefHerm();
		}
		parse = lizan.ParserPronouns(parse, "r");
		parse.rmanwoman = lizan.mfTrue("man", "woman");

		const lizan2 = new Entity();
		rand = Math.random();
		if (rand < 0.4) {
			lizan2.body.DefFemale();
		} else if (rand < 0.8) {
			lizan2.body.DefMale();
		} else {
			lizan2.body.DefHerm();
		}
		parse = lizan2.ParserPronouns(parse, "r2");
		parse.r2manwoman = lizan2.mfTrue("man", "woman");

		parse.masterdesc = lizan.Gender() === Gender.male ? "an attractive" : "a pretty";
		parse.masterdesc += " lizan with ";

		let tattoos = false;
		let piercings = false;

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			parse.masterdesc += "messy dark hair.";
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			parse.masterdesc += Text.Parse("striking blue tattoos along [rhisher] scaled arms.", parse);
			tattoos = true;
		}, 1.0, () => true);
		scenes.AddEnc(() => {
			parse.masterdesc += Text.Parse("a piercing adorning one corner of [rhisher] lips.", parse);
			piercings = true;
		}, 1.0, () => true);
		scenes.Get();

		if (lizan.Gender() !== Gender.male) {
			parse.masterdesc += " Her impressively large breasts are constrained by a tight cotton shirt.";
		}
		if (lizan.Gender() === Gender.herm) {
			parse.masterdesc += " There’s something slightly… off about her, though. There is an alarmingly large bulge in her pants, hinting at something extra not usually present on girls.";
		}

		const Direction = {
			Kingdom : 0,
			Oasis   : 1,
		};
		const direction = Math.random() > 0.5 ? Direction.Kingdom : Direction.Oasis;

		const day = WorldTime().IsDay();
		Text.Clear();

		if (day) {
			parse.dir = direction === Direction.Kingdom ? "kingdom" : "Oasis";
			Text.Add("As the sun burns overhead, you discern the thuds of many feet striking the sand on the opposite side of a large dune and, feeling curious, decide to investigate. Unsure what you’ll find, you peek cautiously over the crest of the mound. Your shoulders slump and you relax, however, as you see that it's just a caravan plodding along toward the [dir].", parse);
			Text.NL();
			if (oasis.SeenRakh()) {
				Text.Add("The caravan is pulled by strong-looking Rakhs, their webbed feet leaving wide footprints in the sand as they drag the laden sand sleds behind them. You have to admit there’s a certain majesty to a column of the reptilian beasts marching stoically through the desert.", parse);
			} else {
				Text.Add("The caravan is pulled by huge fearsome-looking reptilian creatures with webbed feet, leaving wide footprints in the sand as they drag the laden sand sleds behind them. You’ve never seen such strange beasts before… but apparently these are domesticated.", parse);
			}
			Text.NL();
			Text.Add("You decide it’s rare enough to see a friendly soul out here that any meeting is a good reason to talk. You head for the front of the procession, sand sliding under your [feet], and when you get close, the caravan master greets you with a friendly wave. You meet up with [rhimher] and exchange introductions, matching pace with the caravan.", parse);
		} else {
			Text.Add("You see the faint orange glow of campfires in the distance and, feeling curious, decide to investigate. As you get closer, you are able to distinguish the shapes of sand sleds around the central fire, ", parse);
			if (oasis.SeenRakh()) {
				Text.Add("with the massive Rakhs that pull them resting nearby.", parse);
			} else {
				Text.Add("along with some huge reptilian beasts, creatures you’ve never seen the like of before. By the looks of them, they are used to drag the sleds.", parse);
			}
			Text.Add(" A few humanoids are also sitting and chatting in quiet voices.", parse);
			Text.NL();
			Text.Add("A silhouette peers at you from the darkness beyond the fires, and you start at the glint of steel in [r2hisher] hand. <i>“Well, you don’t look hostile,”</i> the [r2manwoman] says. <i>“You can head on through, I s’pose. You’ll want to talk to the caravan master - [rheshe]’s a bit of a night bird, so you’ll find [rhimher] by the fire. You can tell you’ve got the right person by the foppish clothes [rheshe] always wears.”</i>", parse);
			Text.NL();
			Text.Add("Taking [r2hisher] advice, you find the find the [rmanwoman] and exchange greetings.", parse);
		}
		Text.NL();
		Text.Add("It turns out the master is [masterdesc]", parse);
		Text.NL();
		if (!oasis.SeenRakh()) {
			Text.Add("<i>“Is there a problem?”</i> [rheshe] asks, amused as you eye the huge beasts of burden apprehensively. <i>“Do my Rakhs frighten you?”</i>", parse);
			Text.NL();
			Text.Add("Rakhs? You admit you’ve never seen a creature like it before. The thing is stocky in build, and must weigh at least ten times as much as a horse. Thick scales cover its leathery skin, boasting of incredible toughness.", parse);
			Text.NL();
			Text.Add("<i>“You wouldn’t want to face off against a feral one, but these ones are quite docile. My tribesmen of the desert train them from when they are young. They are far better suited to this climate than horses would be.”</i> [rHeShe] affectionately scratches one of the huge reptiles on the chin, coaxing a deep contented rumble from the beast.", parse);
			Text.NL();
			oasis.flags.Rakh = OasisFlags.RakhFlag.Seen;
		}
		Text.Add("You chat a bit about what brought you here, and [rheshe] tells you a little about [rhisher] work planning the expedition and selecting goods to carry. <i>“We’re always happy to trade with a fellow traveler,”</i> [rheshe] says. <i>“We obviously can’t just unpack everything, but I’ve got a few select things set aside for occasions like these. Or if there’s anything else you need, I’d be happy to help out,”</i> [rheshe] adds with a wink, [rhisher] tail swaying back and forth in interest.", parse);
		Text.Flush();

		let busy   = false;
		let rumors = true;
		let fun    = true;

		const busyFunc = () => {
			Text.Add("It takes some time for the caravan master to calm the angry Rakh, but eventually the beast is settled, and returns to its spot, looking a little guilty. Your would-be lover heads over to you, looking physically and emotionally drained.", parse);
			Text.NL();
			Text.Add("<i>“The damned creatures are practically wild,”</i> [rheshe] tells you. <i>“They’d be too much trouble to deal with if there were any other options.”</i>", parse);
			Text.NL();
			Text.Add("You commiserate with [rhimher], and congratulate [rhimher] on dealing with the problem so neatly. Still, could [rheshe] help you out with one more thing?", parse);
			Text.NL();
			busy = false;

			TimeStep({minute: 15});
		};

		const prompt = () => {
			// [Trade][Rumors][Fun][Leave]
			const options: IChoice[] = [];
			options.push({ nameStr : "Trade",
				func() {
					Text.Clear();
					if (busy) { busyFunc(); }
					Text.Add("<i>“Here, I'll show you what I have. My main cargo is already bought and paid for, but I have some oddments lying around.”</i>", parse);
					Text.NL();
					Text.Flush();
					OasisScenes.CaravanShop(prompt);
				}, enabled : true,
				tooltip : Text.Parse("See what the caravan master has to offer.", parse),
			});
			options.push({ nameStr : "Rumors",
				func() {
					Text.Clear();
					if (busy) { busyFunc(); }
					Text.Add("You ask the caravan master if [rheshe]’s heard anything interesting lately.", parse);
					Text.NL();
					const scenes = new EncounterTable();
					scenes.AddEnc(() => {
						parse.dir = direction === Direction.Kingdom ? "Rigard" : "the Oasis";
						Text.Add("<i>“Everyone’s worried about the disappearances,”</i> [rheshe] says, looking down in concern. <i>“When we were leaving, there were at least two merchants I’d heard of whose caravans were overdue. And who knows how many were keeping quiet to try to conceal their losses.”</i> [rHeShe] sighs. <i>“Let me tell you, it’s not easy to set out knowing you might not make it. I swear everyone kept staring at [dir] like it was their dying mother till it was out of sight.”</i>", parse);
						Text.NL();
						Text.Add("Does [rheshe] know what’s happening?", parse);
						Text.NL();
						Text.Add("<i>“Not a clue. There have always been some that didn’t make it, but never this many. Something must’ve changed in the desert.”</i> [rHeShe] shrugs. <i>“Either way, the goods must flow, so we make the trip and do our best to stay vigilant.</i>", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“There’s a lot of talk going of people wanting out of the caravan business,”</i> [rheshe] says, <i>“or of wanting to switch to a route from Rigard to the Free Cities, at least. And I can relate - really, I can - insurance is going up, merchants are cutting back on shipments, guards are getting dearer… these are tough times.”</i>", parse);
						Text.NL();
						Text.Add("<i>“But the thing is, you just can’t take the Rakhs along if you’re going to the Free Cities, nor the desert tents, nor the sand sleds. You have to sell all your stuff and start anew. So what I figure is if people are looking to sell, I’ll snap up gear on the cheap, and grow the caravan.”</i>", parse);
						Text.NL();
						Text.Add("[rHeShe]’s not afraid of making the trips?", parse);
						Text.NL();
						Text.Add("<i>“Ha! I’m terrified. But in these matters, to the brave go the spoils. And besides, if I can expand, I can get more guards, and maybe if the caravan is huge enough, that will grant a measure of safety.”</i>", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“All sorts of crazy talk have sprung up since the troubles began in the desert,”</i> [rheshe] says. <i>“There’s some that want to keep their money at home, just build some buildings, start a shop, wait for the troubles to blow over. That I can understand, though I think it isn’t gonna work.”</i>", parse);
						Text.NL();
						Text.Add("<i>“Others, though… there’re perfectly respectable merchants wanting to strike up an expedition into the forest. Trade with the elves! Climb the tree to the mythical, but definitely-not-made-up city and trade with them!”</i> The caravan master rolls [rhisher] eyes in derision.", parse);
						Text.NL();
						Text.Add("<i>“Well, the more of my competition suddenly goes barking mad, the easier it is for me, I suppose.”</i>", parse);
					}, 1.0, () => true);

					scenes.Get();
					Text.NL();
					Text.Add("You nod, and thank [rhimher] for the information. What next?", parse);
					Text.Flush();
					rumors = false;

					TimeStep({minute: 10});

					prompt();
				}, enabled : rumors,
				tooltip : Text.Parse("Ask if there are any interesting rumors [rheshe] can share.", parse),
			});
			let tooltip = "It sounds like the caravan master is up for more than just trade.";
			if (lizan.Gender() === Gender.herm) {
				tooltip += " Besides, you want to play with that intriguing bulge of [rhishers]...";
			}
			options.push({ nameStr : "Fun",
				func() {
					Text.Clear();
					Text.Add("You ask the caravan master if [rheshe] would like to show you just how [rheshe] plans to help out with your needs.", parse);
					Text.NL();
					Text.Add("The caravan master’s lips spread in a mischievous grin, and [rheshe] takes your hand in [rhishers]. <i>“Come along to my cabin and I’ll provide you with a demonstration.”</i>", parse);
					Text.NL();
					if (party.Num() > 1) {
						parse.comp = party.Num() === 2 ? party.Get(1).name : "your companions";
						Text.Add("You ask [comp] to wait for a little while, and allow the master to take the lead.", parse);
						Text.NL();
					}
					Text.Add("The ‘cabin’ turns out to be a sort of small wooden wagon mounted on a pair of runners. Glancing over the rest of the caravan, you realize that it’s the only one of its kind. It seems being the caravan master has its perks.", parse);
					Text.NL();
					Text.Add("The caravan master leads you to a side door, ", parse);
					if (day) {
						Text.Add("careful to avoid the swaying tail of the Rakh pulling the structure, ", parse);
					}
					Text.Add("and after giving you a hand up, hops in behind you. The room is small but cozy, with a bed, a desk, and a hamper full of books being its main furnishings. To your surprise, the cabin ", parse);
					if (day) {
						Text.Add("is merely warm, a very welcome relief from the blistering heat outside.", parse);
					} else {
						Text.Add("is quite warm, a pleasant delight in the chill desert night.", parse);
					}
					Text.NL();
					Text.Add("The caravan master smiles, noticing your reaction. <i>“I’ve been able to buy some minor enchantments,”</i> [rheshe] explains, stroking your hand, <i>“but the most important part is that the trooma wood is porous, providing excellent insulation against the weather.”</i>", parse);
					Text.NL();
					Text.Add("As [rheshe] speaks, [rheshe] gently turns you until you’re standing face to face, barely more than a handspan apart. This close, you smell the stale scent of desert clinging to [rhimher], and can distinguish every individual scale along [rhisher] cheekbones.", parse);
					Text.NL();
					if (tattoos) {
						Text.Add("You trace your hand along the weave of blue ink twining around [rhisher] arm. To your surprise, the scales are slightly raised along it. You look up at your companion in curiosity, and find [rhimher] grinning at you.", parse);
						Text.NL();
						Text.Add("<i>“An ink made by my lizan tribesmen,”</i> [rheshe] explains, tracing [rhisher] hand up your arm in turn. <i>“A mark of honor, saying that I understand the desert… as much as it can be understood, anyway.”</i>", parse);
						Text.NL();
						Text.Add("[rHeShe] cups your chin in [rhisher] palm, and draws closer", parse);
					} else {
						Text.Add("[rHeShe] traces [rhisher] fingers along your neck before cupping your chin in [rhisher] palm, and drawing closer", parse);
					}
					Text.Add(" until you feel [rhisher] moist breath brushing against your lips. ", parse);
					if (lizan.FirstBreastRow().Size() > 3) {
						Text.Add("Her breasts press against your [breasts] as she", parse);
					} else if (player.FirstBreastRow().Size() > 3) {
						Text.Add("Your breasts press against his toned chest as he", parse);
	} else {
						Text.Add("He", parse);
	}
					Text.Add(" leans in, [rhisher] mouth pressing hungrily against yours. You wrap your arms around [rhimher], pressing your bodies tighter together, your lips parting eagerly to admit [rhisher] long, flexible tongue into your mouth.", parse);
					Text.NL();
					Text.Add("The caravan master moans in pleasure as you return the favor, tracing [rhisher] teeth with your [tongue] before pushing inside. The two of you stand locked in breathless arousal for a long minute. Your hands move down [rhisher] body, settling on [rhisher] butt and giving a firm squeeze. ", parse);
					const tail = player.HasTail();
					if (tail) {
						Text.Add("You feel the lizan’s scaled tail brushing against your leg, and instinctively your own [tail] reaches out to meet it, twining together with it.", parse);
					} else {
						Text.Add("The lizan’s scaled tail brushes against you, stroking back and forth excitedly, before twining around your [legs], gripping you tight.", parse);
					}
					Text.NL();
					Text.Add("You part for a moment, breathing heavily, a string of saliva connecting your lips. The slitted eyes looking into your [eyes] are dilated in clear arousal, and the caravan master’s strong hands move to greedily grope your body.", parse);
					Text.NL();
					Text.Add("You take the lead this time, biting playfully at [rhisher] lip. As you look up to meet [rhisher] unfocused gaze, the caravan master squirms in pleasure, making your teeth tug harder with [rhisher] movements. ", parse);
					if (piercings) {
						Text.Add("You shift your attention to the corner of [rhisher] lips, sucking the piercing into your mouth, swirling your tongue over it as you bite down a little harder. ", parse);
					}
					Text.Add("Your hapless victim moans loudly, pleasure running through [rhisher] body. You thought it was impossible to make someone orgasm from just kissing, but [rhisher] reactions almost make you want to try.", parse);
					Text.NL();
					Text.Add("Nonetheless, you decide to pull back and give [rhimher] a little break… and focus your attention elsewhere. ", parse);
					if (lizan.FirstCock()) {
						Text.Add("Your hands glide down [rhisher] body, feeling the relief of toned muscles under your fingertips, until you reach [rhisher] hips. You stroke along [rhisher] butt to the front of [rhisher] thighs, and inward. The hard pair of ridged cocks strain against the fabric of [rhisher] pants, desperately pressing into your palms.", parse);
						Text.NL();
						Text.Add("Your strokes seem to reawaken your companion, and [rheshe] grabs hold of you, pushing you firmly toward the bed. You stumble going over backwards and land softly on the mattress with an involuntary squeal. The lizan is not far behind, dropping onto hands and knees on top of you, [rhisher] snout inches away from you.", parse);
						Text.NL();
					}
					if (lizan.Gender() !== Gender.male) {
						Text.Add("You take hold of the bottom edge of the caravan master’s tunic, and pull up slowly, the tight garment catching on her voluptuous breasts. You struggle for a moment until with a final tug, it releases them to a heavy bounce. <i>“Mm, yes,”</i> she breathes out. They’re even bigger than you suspected, the tunic apparently having squeezed them tight.", parse);
						Text.NL();
					}
					if (lizan.Gender() === Gender.female) {
						Text.Add("You give your companion a shove, pushing her down onto the bed with a squeal of surprise and follow her, crouching on top of her. ", parse);
					}
					if (lizan.Gender() !== Gender.male) {
						Text.Add("You meet her eyes for a moment, licking your lips, before you find her nipple and suck it into your mouth. Massaging the other heavy breast, you lap at the lizan’s teat before rolling the rock hard nub between your lips.", parse);
						Text.NL();
						Text.Add("Your efforts are rewarded with your companion screaming loudly enough in pleasure that they probably heard the two of you in the next wagon over. She arches her back in ecstasy, pressing her breasts harder into you, apparently seeking extra stimulation.", parse);
						Text.NL();
						Text.Add("Instead, you stop your teasing for a moment, moving up face to face with the lizan. She is panting heavily with excitement, and her eyes are dilated, looking up at you desperately.", parse);
						Text.NL();
					}
					Text.Add("Both of you jump, adrenaline rapidly washing arousal from your system, as you hear a loud animal roar outside followed by the thuds of large objects hitting the sand. You hastily separate, and are fixing your clothes when someone bangs loudly on the door before throwing it open. That could have been awkward if the two of you had gotten further, though that may still have been less disappointing.", parse);
					Text.NL();
					Text.Add("<i>“A Rakh got spooked!”</i> your visitor shouts, looking like he might be getting close to panic himself.", parse);
					Text.NL();
					Text.Add("Cursing, the caravan master rushes out, and you follow [rhimher] at a more leisurely pace, closing the door behind you. ", parse);
					if (day) {
						Text.Add("It", parse);
					} else {
						Text.Add("The camp is abuzz with groggy people trying to get a handle on the commotion. Even in the dark, it", parse);
					}
					Text.Add(" does not take you long to spot the beast that disturbed your playtime. The Rakh has torn the bonds that tied it to its sled and sat down on its haunches at the crest of a low dune, glaring menacingly at the rest caravan.", parse);
					Text.NL();
					if (day) {
						Text.Add("The rest of the Rakhs have halted their progress and glance up occasionally at their wayward companion while sitting beside their sleds.", parse);
						Text.NL();
					}
					Text.Add("The Rakh snaps at any of the attendants who dare come too close, hissing angrily. When the caravan master finally arrives, [rheshe] takes a stand in front of it, and speaks in a soothing voice. After watching for a minute, you notice that the creature does seem to be calming somewhat, but you suspect this could be take a while, and all hints of an amorous mood are gone regardless.", parse);
					Text.Flush();
					fun = false;
					busy = true;

					TimeStep({minute: 40});

					prompt();
				}, enabled : fun,
				tooltip : Text.Parse(tooltip, parse),
			});
			options.push({ nameStr : "Leave",
				func() {
					TimeStep({hour: 1});
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : Text.Parse("It’s time to head out.", parse),
			});
			Gui.SetButtonsFromList(options, false, undefined);
		};
		prompt();
	}

}
