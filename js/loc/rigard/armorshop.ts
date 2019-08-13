
//
// Armor Shop
//
import * as _ from 'lodash';

import { Event, Link } from '../../event';
import { EncounterTable } from '../../encountertable';
import { Shop } from '../../shop';
import { WorldTime, MoveToLocation, GAME, WORLD } from '../../GAME';
import { Text } from '../../text';
import { Gui } from '../../gui';
import { Item } from '../../item';
import { Party } from '../../party';
import { AccItems } from '../../items/accessories';
import { ArmorItems } from '../../items/armor';

let ArmorShopLoc = new Event("Twopenny's");

let aShop : any;
let aSpecialShop : any;

ArmorShopLoc.description = function() {
	var parse : any = {};
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() { parse["sign"] = "NO REFUNDS"; });
	scenes.AddEnc(function() { parse["sign"] = "PROTECT YOUR VULNERABLES"; });
	scenes.AddEnc(function() { parse["sign"] = "NO EXCHANGES"; });
	scenes.AddEnc(function() { parse["sign"] = "GUARANTEED SATISFACTION"; });
	scenes.AddEnc(function() { parse["sign"] = "NO HAGGLING"; });
	scenes.AddEnc(function() { parse["sign"] = "CAVEAT EMPTOR"; });
	scenes.AddEnc(function() { parse["sign"] = "YOU BREAK IT, YOU BUY IT"; });
	scenes.AddEnc(function() { parse["sign"] = "WATCH YOUR BELONGINGS"; });
	scenes.AddEnc(function() { parse["sign"] = "NO LOITERING"; });
	scenes.AddEnc(function() { parse["sign"] = "NO STRANGE ACTIVITIES WITH THE DISPLAYS"; });
	scenes.AddEnc(function() { parse["sign"] = "NO TAKEBACKS"; });
	scenes.AddEnc(function() { parse["sign"] = "WE ARE NOT RESPONSIBLE FOR INJURY OR LOSS"; });
	scenes.Get();
	
	Text.Add("To say that the interior of Twopenny’s is cluttered would be an understatement. Looking around, you’re greeted by racks, stands, and shelves of varying sizes and states of fullness, ranging from stacked to bursting. Everything seems to have been arranged to fit as much merchandise in as little space as possible - helmets are stacked up in a corner, suits of half-plate lie arranged on racks, and the lighter pieces hang from hooks on the walls. Accompanying all this is the smell of old fabric and oil, rising until it escapes from small, barred windows set high in the walls.", parse);
	Text.NL();
	Text.Add("There doesn’t seem to be much in the way of organization - which is perhaps to be expected, given how the shop gets its stock - though there does at least seem to be a broad categorization of armor types and where on one’s body they’re supposed to go. Shelves groan under the weight of shields. Sabatons catering to all kinds of feet have been set out as if they were simple shoes, though not all of them come in pairs.", parse);
	Text.NL();
	Text.Add("The end result of the shop’s barely controlled chaos is a claustrophobic interior, with just enough space between displays to get around. In fact, the only place which <i>isn’t</i> occupied is a small counter by the door at which Donovan sits, watching his customers come and go. He rarely seems to move from that spot during opening hours, and must do his stock-taking and inventory only after the doors are closed. ", parse);
	if(WorldTime().hour < 12)
		Text.Add("Although it’s early in the morning, a goodly number of customers have come in, hoping to find a good deal before they’re all snapped up. ", parse);
	else if(WorldTime().hour < 16)
		Text.Add("The afternoon rush has made the already cramped store even more so, leaving the aisles thoroughly blocked with people. ", parse);
	else
		Text.Add("While most of the customers have headed home, a few still linger in the aisles, taking advantage of the relative peace and quiet to browse to their hearts’ content. ", parse);
	Text.Add("The store’s clientele is largely comprised of morphs, perhaps because the proprietor is one of their number, or more likely because his goods are more affordable to them.", parse);
	Text.NL();
	Text.Add("Whatever the case, you get the feeling that you’d better inspect everything you’re thinking of buying before actually parting with your money, especially with the sign above Donovan that declares ‘[sign]’ in big red letters.", parse);
	Text.NL();
	Text.Add("You weigh your options.", parse);
}

ArmorShopLoc.events.push(new Link(
	"Donovan", true, true, null,
	function() {
		ArmorShopScenes.Prompt();
	}
));

ArmorShopLoc.events.push(new Link(
	"Leave", true, true, null,
	function() {
		MoveToLocation(WORLD().loc.Rigard.ShopStreet.Street, {minute: 5});
	}
));

/*
[Buy][Sell][Specialties][Donovan][Back]
*/
ArmorShopLoc.onEntry = function() {
	let rigard = GAME().gwendy;
	if(rigard.Twopenny["Met"] < 1)
		ArmorShopScenes.FirstEntry();
	//TODO LINK NEW STUFF
	/*
	else if(X && rigard.Twopenny["Met"] < 2) {
		ArmorShopScenes.RegularEntry(true);
	}
	*/
	else
		ArmorShopScenes.RegularEntry(false);
}


export namespace ArmorShopScenes {
	export function IsOpen() {
		return (WorldTime().hour >= 9 && WorldTime().hour < 20) && !GAME().rigard.UnderLockdown();
	}

	export function AShop() {
		return aShop;
	}
	export function ASpecialShop() {
		return aSpecialShop;
	}

	export function CreateShop() {
		let player = GAME().player;
		
		var buySuccessFunc = function(item : Item, cost : number, num : number) {
			var parse : any = {
				sirmadam : player.mfTrue("sir", "madam")
			};
			
			Text.Clear();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() { Text.Add("<i>“Wonderful,”</i> Donovan says, making your money disappear somewhere on his person - you can’t tell where, he moves so quickly. <i>“I’d advise you to check your brand-new acquisition before leaving the premises. Once you’re out the doors, I’m not going to entertain any requests for refunds.”</i>", parse); });
			scenes.AddEnc(function() { Text.Add("Donovan’s smile doesn’t shift in the slightest as he counts and pockets your money with astounding speed. <i>“And thank you for shopping with us today, [sirmadam]. I’m sure your new purchase will serve you better than it did its previous owner.”</i>", parse); });
			scenes.AddEnc(function() { Text.Add("<i>“A very fine choice.”</i> Donovan pockets your money, then pulls out a small notebook and stub of pencil to record the sale. <i>“I’m sure that you’ll want something new, something stronger, something flashier in good time, so drop by every now and then. We rotate our stock on a regular basis.”</i>", parse); });
			scenes.AddEnc(function() { Text.Add("Donovan beams as he makes your money rapidly vanish into thin air - or at least, that’s what it looks like. <i>“An excellent decision. With all these strange goings-on beyond the city walls, I’m sure that a little extra protection can’t hurt when it comes to your vitals. Keep yourself safe, [sirmadam], and come back soon!”</i>", parse); });
			scenes.Get();
			
			Text.NL();
		};
		var buyFailFunc = function(item : Item, cost : number, bought : boolean) {
			var parse : any = {
				sirmadam : player.mfTrue("sir", "madam")
			};
			
			Text.Clear();
			if(bought) {
				Text.Add("<i>“Anything else, [sirmadam]?”</i>", parse);
			}
			else {
				var scenes = new EncounterTable();
				scenes.AddEnc(function() { Text.Add("A flicker of disappointment flashes across Donovan’s face, but he recovers with all the ease of an experienced salesman, quickly returning to his pleasant demeanor. <i>“Well, such a pity! Is there anything else I can do for you, [sirmadam]?”</i>", parse); });
				scenes.AddEnc(function() { Text.Add("<i>“Oh? Changed your mind? Well, I guess it wouldn’t have looked that good on you anyway.”</i> Donovan rubs his paws. <i>“Tell me, [sirmadam], would you be interested in looking at something else?”</i>", parse); });
				scenes.AddEnc(function() { Text.Add("Donovan winces, but clears his throat and pretends nothing happened. <i>“Oh. Well, you don’t want to do impulse buys, anyway - I want to my customers to leave truly happy with their purchases. Think I could interest you in something else?”</i>", parse); });
				scenes.AddEnc(function() { Text.Add("<i>“That one not to your liking? Was it the shine? The size? Or maybe it was a bad fit?”</i> Without waiting for your reply, Donovan begins to let both his gaze and paws wander about the aisles once more. <i>“Well, [sirmadam], don’t worry if that one didn’t quite tickle your fancy. I’ve got some more surprises waiting in the back…”</i>", parse); });
				scenes.Get();
			}
			Text.NL();
		};
		
		var shop = new Shop({
			buyPromptFunc : function(item : Item, cost : number, bought : boolean) {
				var coin = Text.NumToText(cost);
				var parse : any = {
					sirmadam : player.mfTrue("sir", "madam"),
					item : item.sDesc(),
					coin : coin,
					Coin : _.capitalize(coin)
				};
				if(!bought) Text.Clear();
				var scenes = new EncounterTable();
				scenes.AddEnc(function() { Text.Add("Donovan peers at your selection. <i>“Oh, [item]?” That’s a very lovely choice. Don’t mind the spot there, the previous owner wasn’t that good at dodging swords. How’s [coin] coins sound to you? A very fair deal, if I dare say so.”</i>", parse); });
				scenes.AddEnc(function() { Text.Add("<i>“That’s a very fine [item] you’ve picked out there, [sirmadam]. Used to belong to a little old lady, hardly ever used, she only put it on during weekends to watch her son in the city watch parades.”</i> Donovan rubs his paws together. <i>“[Coin] coins, and it’s yours.”</i>", parse); });
				scenes.AddEnc(function() { Text.Add("<i>“You’re thinking of making this [item] your very own, [sirmadam]? Can’t recommend this one enough - last owner had a sudden identity crisis and went off to be a cat or bat or rat or something. Whatever they ended up as, it didn’t fit him any more. Or her. Or it. You get the point.  Anyway, it’ll be [coin] coins if you want it.”</i>", parse); });
				scenes.AddEnc(function() { Text.Add("<i>“Oh, you have a good eye there. This [item] here’s City Watch surplus, seems like they didn’t have that many recruits in that size last year. You want to make it yours? [Coin] coins. Trust me, you won’t regret it.”</i>", parse); });
				scenes.AddEnc(function() { Text.Add("<i>“Excellent specimen of [item] you’ve got there, vintage - no, antique, even. I’d rather not call it battered; it’s got <b>character</b>, and that’s the important thing. Stood the test of time, it has, and it can be yours for only [coin] coins.”</i>", parse); });
				scenes.Get();
				
				Text.NL();
			},
			buySuccessFunc : buySuccessFunc,
			buyFailFunc : buyFailFunc,
			sellPromptFunc : function(item : Item, cost : number, sold: boolean) {
				var coin = Text.NumToText(cost);
				var parse : any = {
					sirmadam : player.mfTrue("sir", "madam"),
					item : item.sDesc(),
					coin : coin,
					Coin : _.capitalize(coin)
				};
				
				if(!sold) Text.Clear();
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Hmm.”</i> Donovan takes your [item] and lays it out on the counter, running his paws over it. <i>“I see. Age, quality, metallic flexibility, thaumatheurgical mileage, quadratic tensiles, number of reticulated splines… well, all things considered, I’ll give you [coin] coins for it. How’s that sound to you?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("As you present your [item], Donovan takes it from your hands and lays it out on the counter. He makes a show of appraising your offering, rapping it with his knuckles, sniffing away with whiskers twitching - for a moment, you wonder if he’s actually going to lick it - then straightens and adjusts his tie.", parse);
					Text.NL();
					Text.Add("<i>“For you, [coin] coins. Sound good?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Donovan watches you like a hawk as you lay out your [item] before him. <i>“Lovely little piece you’ve got there, [sirmadam] - truly a lovely little piece. Gotta say, though - [coin] coins is what I’m willing to do for it. That good with you?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("You set out [item] on the counter and wait for Donovan to appraise it, a process that takes a few minutes. The stoat-morph is nothing if not thorough, and turns back to you in good time.", parse);
					Text.NL();
					Text.Add("<i>“[Coin] coins.”</i>", parse);
					Text.NL();
					Text.Add("That’s all?", parse);
					Text.NL();
					Text.Add("Donovan nods solemnly. <i>“That’s all, [sirmadam]. Selling armor isn’t like selling cake or buns at the market, you know.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.Get();
				
				Text.NL();
			},
			sellSuccessFunc : function(item : Item, cost : number, num : number) {
				var parse : any = {
					sirmadam : player.mfTrue("sir", "madam")
				};
				
				Text.Clear();
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Very good. I’ll just take it… and here’s your bit.”</i>", parse);
					Text.NL();
					Text.Add("He drops a small pile of coins into your palm, and you take the time to count out every single one; something about the way he did it made you feel like you just had to. Donovan gives you an encouraging smile and wave - or at least, you <i>think</i> it’s meant to be encouraging - and coughs. <i>“Well! Anything else you need, [sirmadam]?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Excellent. Let me just wrap this up… and there we go. Your well-earned coin, [sirmadam].”</i>", parse);
					Text.NL();
					Text.Add("Donovan drops a handful of coins into your palm with a soft clink, and you take the time to count out your payment before pocketing it. <i>“This’ll make someone else very happy down the road, I’m sure. Well! Now that that’s over with, might you need something else?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.Get();
				
				Text.NL();
			},
			sellFailFunc : function(item : Item, cost : number, sold: boolean) {
				var parse : any = {
					sirmadam : player.mfTrue("sir", "madam"),
					item : item.sDesc()
				};
				
				Text.Clear();
				if(sold) {
					Text.Add("<i>“Do you have anything else for me, [sirmadam]?”</i>", parse);
				}
				else {
					var scenes = new EncounterTable();
					scenes.AddEnc(function() { Text.Add("Donovan shrugs. <i>“Sorry we couldn’t do business, but I don’t haggle. My prices are what they are - already cutting my own throat on most of my deals as it is. Sometimes, a man gets tired of eating watery gruel and cabbage for dinner every night, you know? Well, anything else I can do for you?”</i>", parse); });
					scenes.AddEnc(function() { Text.Add("<i>“Changed your mind? I’m afraid I can’t go any higher on that; I’m already one to two months’ operating expenses from selling sausages in buns at the plaza. Still… is there anything I can do for you, since you’re here?”</i>", parse); });
					scenes.AddEnc(function() { Text.Add("<i>“Sorry, [sirmadam]. I can’t go any higher on that. Can’t make exceptions, won’t play favorites, gotta treat all customers with respect. You ever change your mind about changing your mind, and I’ll be more than happy to take it off your hands.”</i>", parse); });
					scenes.AddEnc(function() { Text.Add("Donovan lets out a small sigh as he pushes your [item] back to you and straightens his tie. <i>“Pity we couldn’t see eye-to-eye, [sirmadam]. Still, I’ll be here if you ever change your mind, so there’s no rush. Can I help you with something else?”</i>", parse); });
					scenes.Get();
				}
				
				Text.NL();
			}
		});
		
		var specialShop = new Shop({
			buyPromptFunc : function(item : Item, cost : number) {
				var coin = Text.NumToText(cost);
				var parse : any = {
					sirmadam : player.mfTrue("sir", "madam"),
					item : item.sDesc(),
					coin : coin,
					Coin : _.capitalize(coin)
				};
				var scenes = new EncounterTable();
				scenes.AddEnc(function() { Text.Add("<i>“Oh-ho. I see you’ve a fine eye! That just happens to be a very rare and valuable [item] from another plane. Guaranteed to be free of any untoward ancient curses and the like - that’s the risk you run when you buy mysterious antiques from piddling little stores in street corners, but not my fine establishment. As for the price… how about [coin] coins? I’m cutting my own throat on this deal, I am!”</i>", parse); });
				scenes.AddEnc(function() { Text.Add("<i>“That? It’s a very fine [item] indeed. You don’t want to know what I had to go through just to get it. Really. Honestly. Don’t ask, okay? Not asking? Being very quiet? Very good. That’ll be [coin] coins if you want it.”</i>", parse); });
				scenes.AddEnc(function() { Text.Add("<i>“Now, what you have in your hands is a particularly exquisite specimen of [item]. There aren’t that many around these days - it’s said that none have been made since Riordane’s time. Of course, those are just rumors - or are they? In any case, it’ll be [coin] coins for it.”</i>", parse); });
				scenes.AddEnc(function() {
					Text.Add("<i>“What you’re holding there, my friend, is a limited edition [item]. There weren’t very many of those made back in the day, and I daresay that they’re pre-tty rare of late. Things fall apart, you know. You certainly won’t find one just lying around in just any old store - save for mine, of course.</i>", parse);
					Text.NL();
					Text.Add("<i>“Price? Price? Oh, that silly thing,”</i> Donovan says with a wave of a hand, as if it’s nothing important at all. <i>“Just for you, I’d say… [coin] coins? That sound good to you?”</i>", parse);
				}, 1.0, function() { return true; });
				
				scenes.Get();
				
				Text.NL();
			},
			buySuccessFunc : buySuccessFunc,
			buyFailFunc : buyFailFunc
		});

		shop.AddItem(ArmorItems.LeatherChest, 5);
		shop.AddItem(ArmorItems.LeatherPants, 5);
		shop.AddItem(ArmorItems.BronzeChest, 5);
		shop.AddItem(ArmorItems.BronzeLeggings, 5);
		shop.AddItem(AccItems.IronBangle, 5);
		shop.AddItem(AccItems.IronBuckler, 5);
		
		aShop = shop;
		aSpecialShop = specialShop;
	}


	export function FirstEntry() {
		let party : Party = GAME().party;
		let rigard = GAME().rigard;
		let terry = GAME().terry;

		var parse : any = {
			
		};
		
		rigard.Twopenny["Met"] = 1;
		
		Text.Clear();
		Text.Add("Is this the first time you’ve seen this particular establishment? You’re not entirely sure; from the outside, it looks like any other store in the poorer part of the merchants’ district - what was once clearly the exterior of a fine, upstanding establishment has a look of slight neglect and disrepair. You wouldn’t go so far as to call it dilapidated - this <i>is</i> still the merchants’ district, after all - but it’s certainly seen better days. The flagstones on the street outside are well-worn, the plaster on the walls is flaking, and the glass panes on the small, high windows look as if no one’s cleaned them for a year.", parse);
		Text.NL();
		Text.Add("The sign above the doorway declares: <i>TWOPENNY’S USED PROTECTIVES</i>, followed at the bottom by smaller lettering: <i>Authorized dealer in second-hand armor for all your defensive needs. We buy and sell!</i> It would almost be encouraging, if not for the fact that the paint on the sign is faded and peeling. Still, there’s a healthy flow of customers in and out of the store, and you notice that most of them happen to be morphs of one sort or another.", parse);
		Text.NL();
		if(party.InParty(terry)) {
			parse["foxvixen"] = terry.mfPronoun("fox", "vixen");
			Text.Add("<i>“If you asked me, this almost looks like a fence’s setup,”</i> Terry muses, the [foxvixen] staring up at the old sign. <i>“And I do mean ‘almost’, since no actual fence would be this obvious about it. Trust me, I’d know. But these types of stores are a great place to start and end a heist - gear up, do the job, then dispose of the evidence by selling it to some shmuck who thinks he’s the one getting the good deal.”</i>", parse);
			Text.NL();
			Text.Add("Somehow, Terry’s words don’t exactly inspire confidence in you.", parse);
			Text.NL();
		}
		Text.Add("Well, what’s the worst that could happen? After all, you’re just here to browse - who knows, you might even find a good deal amongst all the trash. Joining the flow of customers into the store, you step through the doorway and enter a world very different from the street outside.", parse);
		Text.NL();
		Text.Add("The first thing that strikes you is the smell that hangs in the air. Part oil, part metal, part sweat and all stink, it’s very noticeable the moment one passes the threshold into the shop’s dingy interior. It’s not <i>bad</i>, not enough to drive anyone off, but it constantly niggles at the back of the mind like an unscratchable itch between the shoulder blades.", parse);
		Text.NL();
		Text.Add("The next thing that strikes you is simply how much <i>stuff</i> there is in this place. Piled on shelves, hoisted on racks, stacked against the walls, there’s simply so much metal, leather, and tough cloth within these four walls that the aisles are barely wide enough for a single person to squeeze through. There don’t seem to be any fitting rooms proper, but the customers who ply the shelves appear to be having a wonderful time trying on wooden helmets and pulling on thick leather boots in a grand free for all.", parse);
		Text.NL();
		Text.Add("It’s small. It’s dingy, dusty, and poorly lit, but at the very least the atmosphere in here is relaxed, if not welcoming.", parse);
		Text.NL();
		Text.Add("<i>“Hello, hello! A new face!”</i>", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("You turn to find the voice’s owner - a rather short stoat-morph - leaning on a counter by the entrance, the bright purple tie about his neck looking quite out of place squeezed between his faded gray vest and stained undershirt. He stares intently at you for a moment, clearly sizing you up. His face splits into a huge grin and he takes a deep breath, puffing out his chest.", parse);
			Text.NL();
			Text.Add("<i>“Well, what do we have here? A new face in my store - welcome to Twopenny’s Used Protectives! I’m Donovan Twopenny, and I’ve been in business for ten years running! Still haven’t driven me out of the trade, even if they came close once or twice!”</i>", parse);
			Text.NL();
			Text.Add("That’s… nice. What does he do here?", parse);
			Text.NL();
			Text.Add("<i>“Well, let’s say you have to leave the city one day, go on a grand adventure! But there are horrible things beyond the walls of Rigard, things with claws and teeth and tentacles! That’s not to mention the nasty people who’re really interested in turning you into a pincushion and making off with all your money… such a horrible fate!”</i>", parse);
			Text.NL();
			Text.Add("Well, you have to admit that his words are true, even if the delivery inspires no small amount of eye-rolling.", parse);
			Text.NL();
			Text.Add("<i>“So you want some good digs in to protect your vulnerable bits! That makes sense, everyone wants some protection for their vulnerables! Only problem is, a spanking brand-new set is going to cost you an arm and a leg, maybe a spleen as well, and you simply haven’t got that much on you! To make things worse, they only come in bundles, so you don’t really need the gauntlets but end up paying for them anyway!</i>", parse);
			Text.NL();
			Text.Add("<i>“Well, this is where I come in! Buying and selling used armor at great prices, only the bits you need, no more, no less! If you’re going up against a nasty slug thing that wants to dribble all over your ankles, you probably won’t need that helmet! That slug wants to eat your brain? Better keep the helmet and lose the boots! Best deals, best prices, all day, just doing my job helping old pieces find new life!”</i>", parse);
			Text.NL();
			Text.Add("Well, then. Does he mind if you browse?", parse);
			Text.NL();
			Text.Add("<i>“Do I mind? Do I mind? Of course I don’t mind! In fact, I’d love it if you stayed and did just that - who knows, you might find the piece that you never knew you needed but must have right now!”</i> The slinky little stoat deflates a little, exhausted by his little speech. <i>”Just tell me if you find something you like, okay? I’ve got to take a look at this piece -”</i> he waggles a hand at a catboy who’s come up to the counter with a pair of padded gloves- “<i>for a bit.”</i>", parse);
			Text.NL();
			Text.Add("Well, then. Now that your eyes have adjusted a little better to the shop’s gloomy interior, it’s time to take a look around… ", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		});
	}


	export function RegularEntry(newStock : boolean) {
		let rigard = GAME().rigard;

		var parse : any = {
			
		};
		
		Text.Clear();
		if(newStock) {
			Text.Add("Stepping in through the door, you feel Donovan’s eyes upon you the moment you cross the threshold. <i>“Ah, there you are, my most valued customer! I trust that you’re in good health today?</i>", parse);
			Text.NL();
			Text.Add("<i>“You’ve come at just the right time. Thanks to all this business, I’ve had more people coming in to trade in their old bits and pieces - which means a greater selection for you. Why don’t you take a look and see if anything catches your fancy? Well. Hopefully. Probably. Maybe?</i>", parse);
			Text.NL();
			Text.Add("<i>“The point is that there’s more to see, and more to buy, so don’t be shy and give it a try!”</i>", parse);
			
			rigard.Twopenny["Met"]++;
		}
		else {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Donovan rolls his gaze upward from the counter as you step in. <i>“Welcome, welcome! What can I do for you today? A good set of boots? A metal codpiece? Something more exotic? Or maybe you’re just here to browse?”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Oh, look! Who should enter but my favorite customer!”</i> You turn to find Donovan looking intently towards you, the stoat-morph wearing a truly ear-splitting grin on his face. <i>“Come in, come in, I’m sure you’ll like the selection we have on the floor today.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Oh, marvellous - it’s… um… you again! Have you been adventuring? You certainly look like you’ve been adventuring; you’ve got that marvellous glow about you that says ‘yes! I have been out there taking asses and names alike!’ It’s marvellous, isn’t it?”</i> Donovan pauses a moment to catch his breath. <i>“Well, just don’t forget your old friend Donovan, will you? Take a moment to check out my stock - you’ll need it out there.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Donovan turns on you the moment you step in through the door. <i>“Good day, my dear friend! How fine you’re looking today - did you lose weight? I hope you did, because that means you’ll be able to try on a few more pieces! I hope you find what you’re looking for and not… something that isn’t what you’re looking for!”</i>", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
		}
		Text.NL();
		
		Gui.PrintDefaultOptions(true);
	}

	export function Prompt() {
		let player = GAME().player;
		let rigard = GAME().rigard;

		var parse : any = {
			sirmadam : player.mfFem("sir", "madam"),
			heshe : player.mfFem("he", "she")
		};
		
		Text.Clear();
		Text.Add("Donovan looks up as you approach the counter. <i>“Yes, do you need some special attention, my good [sirmadam]?”</i>", parse);
		Text.NL();
		Text.Add("Donovan is a somewhat short stoat-morph, standing at about five feet tall - not painfully short, but enough that most of his customers have to at least tilt their heads down to speak with him eye-to-eye. Dressed in a faded vest and stained undershirt which contrast with the garish purple tie he’s got wrapped about his neck, he’s covered from head to toe in a coat of light brown fur that gives way to white at the front of his neck and torso. With its gold tarnished and leather faded, his belt speaks of being well past its sell-by date - and his pants and boots aren’t in much better shape, either.", parse);
		Text.NL();
		Text.Add("Black, beady eyes peer out at the world, while round, twitchy ears swivel toward unexpected sounds. He keeps his whiskers short and well-trimmed, their neatness contrasting with the rest of his appearance. His face is usually split into a grin that displays his full set of sharp little teeth, and he certainly seems to be the most enthusiastic fellow when it comes to pushing his goods onto others. Perhaps a little <i>too</i> enthusiastic… or can there be such a thing when it comes to a salesman?", parse);
		Text.NL();
		Text.Add("Just look at that honest face and feel that firm handshake - you can trust him!", parse);
		Text.Flush();
		var prompt = function() {
			//[name]
			var options = new Array();
			options.push({ nameStr : "Buy",
				func : function() {
					Text.Clear();
					var scenes = new EncounterTable();
					scenes.AddEnc(function() { Text.Add("Donovan’s eyes light up, the stoat suddenly alert and excitable. <i>“A purchase? Marvellous! What can I interest you in today, then?”</i>", parse); });
					scenes.AddEnc(function() { Text.Add("Upon hearing your intentions, Donovan’s smile splits into a grin worthy of a shark. <i>“What excellent timing. There’re some lovely pieces I’d like to show you. Adventuring’s a dangerous job, you know, gotta protect your joints and all… might get an arrow in one of them, and that’d be the end of your stint in the business.”</i>", parse); });
					scenes.AddEnc(function() { Text.Add("<i>“Oh, the good [sirmadam] wants to buy something, does [heshe]?”</i> Donovan says with a chuckle. <i>“Well then, you’ve come to just the right place. Let me show you something of what we’ve got today…”</i>", parse); });
					scenes.AddEnc(function() { Text.Add("<i>“Oh, glorious, a customer!”</i> You have to admit, with an approach like that, the stoat-morph is doing a very nice job of making you feel like you’re wanted here… or at least, faking the appropriate attitude. <i>“And what can I get you today?”</i>", parse); });
					scenes.Get();
					
					rigard.ArmorShop.Buy(function() {
						Text.Clear();
						Text.Add("<i>“Right, I see, I see.”</i> The weaselly little stoat doesn’t even miss a beat. <i>“Well then, anything else I can help you with?”</i>", parse);
						Text.Flush();
						prompt();
					}, true);
				}, enabled : true
			});
			options.push({ nameStr : "Sell",
				func : function() {
					Text.Clear();
					var scenes = new EncounterTable();
					scenes.AddEnc(function() { Text.Add("<i>“Ah! You have something you’d like me to take off your hands? Something too old, a little out of fashion, or maybe you’re outgrowing your first breastplate? Oh, no need to be shy, it happens.”</i> He rubs his paws together.", parse); });
					scenes.AddEnc(function() { Text.Add("<i>“Oh, in need of a bit of spare change? Well, I’ll be pleased to buy your old bits and pieces for a very fair and reasonable price.”</i> He gives you a nod and grin. <i>“Just let me take a look at it, and I’ll give you a quote.”</i>", parse); });
					scenes.AddEnc(function() { Text.Add("<i>“You’d like me to have a look at something? Well, we here at Twopenny’s only accept the best. Make sure your goods are in serviceable condition.”</i> Donovan coughs very deliberately.", parse); });
					scenes.AddEnc(function() { Text.Add("<i>“Looking to sell something? Remember the rules, then; always remember the rules. Don’t want to have to report my favorite customer to the watch, that would be a terrible, horrible thing for me to have to do, but I’d have to do it anyway.”</i>", parse); });
					scenes.Get();
					Text.NL();
					Text.Add("<i>“A word of warning: I’d make sure I really wanted to let go of my stuff, if I were you. Once sold, I don’t do buybacks.”</i>", parse);

					rigard.ArmorShop.Sell(function() {
						Text.Clear();
						Text.Add("<i>“Right, I see, I see.”</i> The weaselly little stoat doesn’t even miss a beat. <i>“Well then, anything else I can help you with?”</i>", parse);
						Text.Flush();
						prompt();
					}, true);
				}, enabled : true
			});
			options.push({ nameStr : "Specials",
				func : function() {
					Text.Clear();
					var scenes = new EncounterTable();
					scenes.AddEnc(function() { Text.Add("<i>“Ah! I see, I see. You’re looking for something special today, aren’t you, my good [sirmadam]? Well, I’m sure I can hook you up with something one way or the other, just let me check what’s in the back.”</i>", parse); });
					scenes.AddEnc(function() { Text.Add("<i>“Thinking of making a big purchase today?”</i> The stoat reaches up and scratches his little round ears; you can practically see the gears turning in his head. Well, in Donovan’s case, it’s more of a cash register, but the point still stands. <i>“Well, I’m the one you should be looking for when it comes to spending lots of money in one place! Let me show you what I’ve in the back, and we can get started!”</i>", parse); });
					scenes.AddEnc(function() { Text.Add("Donovan grins, and you can swear light’s glinting off his teeth despite the gloom of his shop. <i>“So you’re looking for something out of the ordinary? Well… have a look at these! Blessed by a bona fide shaman straight out of the highlands… or was it cursed by the shaman and <b>then</b> blessed twenty minutes later? Fellow must have been hitting the good stuff! If only I could afford that…”</i>", parse); });
					scenes.Get();
					
					rigard.ArmorShopSpecial.Buy(function() {
						Text.Clear();
						Text.Add("<i>“Right, I see, I see.”</i> The weaselly little stoat doesn’t even miss a beat. <i>“Well then, anything else I can help you with?”</i>", parse);
						Text.Flush();
						prompt();
					}, true);
				}, enabled : false //TODO enable
			});
			options.push({ nameStr : "Talk",
				func : function() {
					Text.Clear();
					Text.Add("Donovan scratches his head and looks at the small crowd in his establishment. <i>“Eh, well, since there’s no one wanting my attention right now… sure, why not? Just so you know, though, anyone else comes up while we’re talking, I gotta tend to them.”</i>", parse);
					Text.Flush();
					
					ArmorShopScenes.Talk(prompt);
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, true);
		};
		prompt();
	}

	export function Talk(backFunc : any) {
		let player = GAME().player;
		let rigard = GAME().rigard;

		var parse : any = {
			sirmadam : player.mfFem("sir", "madam")
		};
		
		//[Shop][Himself][Business][Back]
		var options = new Array();
		options.push({ nameStr : "Shop",
			func : function() {
				Text.Clear();
				Text.Add("<i>“The store? It’s a long story. Got my start twenty years ago as a street lad, back during the war. Couldn’t have been more than seven or eight then… but you know, it was a bad time. Bodies started turning up on the streets all of a sudden, and little old me thought that there were plenty of things going to waste. Oh, most of the common stuff - coin purses and the like - were quickly snatched up, but there’s plenty of value to be had in a good pair of boots, and no one really notices yet another dirty brat. I’d bring in boots and clothes and things, Ma would clean off the blood with her special mixture of wood ash, fat and lye, maybe mend them a little, and we’d sell them good as new.”</i>", parse);
				Text.NL();
				Text.Add("So, he robbed corpses?", parse);
				Text.NL();
				Text.Add("Donovan shrugs. <i>“Pride doesn’t do one much good when you’re hungry and all, and you’ve to have pride first if you’re going to be feeling shame. Not as if they were going to be needing their boots where they’d gone.</i>", parse);
				Text.NL();
				Text.Add("<i>“Of course, the war couldn’t last forever, and my days of pulling the boots off dead people came to an end. Still, that gave me an idea: I’d go down to the richer parts of Rigard with my wheelbarrow and dig through the hobnobs’ trash for anything that could still be used or even mended; then turn those over in the poorer parts of town for a tidy sum. Oh, there were plenty of others with the same idea, but you’ve to be as sly as young old me to evade the patrols seeking to keep out the riff-raff. You wouldn’t imagine the stuff rich people throw away without thinking… once found a whole gold necklace some lady threw straight into the trash because it didn’t match her eyes or skin or something, I can only guess. That one got me a cart to push around instead of a wheelbarrow, a cart of my very own.”</i>", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("<i>“Well, after a handful of years, it got so that the servants at the various estates knew me by sight; they were practically lining up to have me to take away their garbage so they didn’t have to do it themselves. I had something put away by then, and decided to take a risk and trade in my cart for a store, which-”</i> he waggles a hand at the stuffed shelves- <i>“brings us to today.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Now, even though I don’t make my goods myself - haven’t got the physique for it, really - I know something of what I’m selling, so don’t try to hock stuff that’s only fit for scrap onto me. Well, I’ll still buy it, but I’ll only pay scrap prices. It’s only fair.</i>", parse);
					Text.NL();
					Text.Add("<i>“Other thing I won’t buy is stolen goods - no one wants the City Watch or Royal Guard coming around, asking all sorts of inconvenient questions and scaring off the customers. Very bad for business, that sort of unpleasantness is - I’ve had to close the shop after really big heists just so I don’t fall under suspicion. The city watch knows that while I may bend the law a little every now and then, I’m not about to break it through and through, and I’d like to keep it that way.”</i>", parse);
					Text.Flush();
					
					if(rigard.Twopenny["TShop"] < 1)
						rigard.Twopenny["TShop"] = 1;
					
					ArmorShopScenes.Talk(backFunc);
				});
			}, enabled : true,
			tooltip : "Oh, won’t he regale you with the story of his shop?"
		});
		options.push({ nameStr : "Himself",
			func : function() {
				Text.Clear();
				Text.Add("Donovan eyes you. <i>“Eh? Me? Never mind me, I’m just your usual everyday guy… seriously. Sure, I had an exciting childhood, but anyone who lived through the war as a kid had one whether they wanted it or not. It came with the package and all.”</i>", parse);
				Text.NL();
				Text.Add("You look at him. He looks at you.", parse);
				Text.NL();
				Text.Add("<i>“Seriously, I don’t have a sob story to tell, or some long history you could write a book about. Everyone’s got ups and downs in their lives, but it doesn’t make you special. I just try to get by, you know? Once poor, pulling myself up by one’s bootstraps and all. Most of the stuff I have on sale here has more interesting tales to tell than I do; if you’re into that kind of thing then maybe you should pick something out for yourself.”</i>", parse);
				Text.Flush();
			}, enabled : true,
			tooltip : "Ask Donovan about himself."
		});
		options.push({ nameStr : "Business",
			func : function() {
				Text.Clear();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("Donovan waves off your question with an easy grin. <i>“Eh, it’s fine. Doesn’t matter, really - I’m used to times when dinner is rice gruel and cabbage soup every day, and that’s still better than nothing. Weeeelll… if you really want to help out, you could always buy something…”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Fine, just fine. It’s not like I ever get shaken down, unlike Silken Delights on the other end of the district. I’m just not worth the time for what little money I can cough up, you know? That’s one of the benefits of being a-”</i> he takes great care to pronounce every syllable- <i>“small-medium enterprise.”</i>", parse);
					Text.NL();
					Text.Add("Does he know what that means? Does it even have a meaning?", parse);
					Text.NL();
					Text.Add("Donovan shrugs. <i>“Buggered if I know, [sirmadam], but it sounds nice and most people don’t want to appear stupid, so they just smile and nod along.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Decently. You win some, you lose some. I’ve managed to win often enough to stay in business for over ten years, so take that as you will.”</i>", parse);
					Text.NL();
					Text.Add("That’s an interesting way to put it, even if it is a rather lackadaisical way of doing business.", parse);
					Text.NL();
					Text.Add("<i>“You’ve got to be able to spy and grab opportunities the moment they pop up, that’s the way to be a successful businessman. I wasn’t very good at it back in the day and still aren’t the best, but I’ve gotten better over the years.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Pretty good, I’d say. I’d love to be rich - who wouldn’t? - but I’ve given up that dream long ago. Now, I just want to be able to die of old age in my bed, which is a lot more than most of my folks managed. You want your friend Mister Twopenny to live a little longer, maybe you can buy something today?”</i>", parse);
				}, 1.0, function() { return true; });
				
				scenes.Get();
				Text.Flush();
			}, enabled : true,
			tooltip : "So, how’s business these days?"
		});
		if(rigard.Twopenny["TShop"] >= 1) {
			options.push({ nameStr : "City Watch",
				func : function() {
					Text.Clear();
					Text.Add("<i>“It’s quite a complicated thing,”</i> Donovan replies, scratching his head.", parse);
					Text.NL();
					Text.Add("Well, maybe he can try explaining.", parse);
					Text.NL();
					Text.Add("<i>“Well, like I said, [sirmadam], I follow a few simple rules here and there. Don’t buy stolen property, don’t buy things that’ll get me into trouble, keep an eye out for people trying to push off that kind of stuff onto me and let the watch know. Very simple. They do what they can to keep Preston’s gang from coming here - not that they turn up in this part of the district that often these days - and pass along any decommissioned odds and ends from their armory. It’s… far more complicated than that, but it’s the gist of how things work.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Like everything else in life, [sirmadam], it’s a little give and take,”</i> Donovan continues. <i>“A long and complicated relationship. You can’t have everything your way, but most situations can really be made out such that everyone comes out at least a little ahead. Being a morph doesn’t mean I can’t weasel my way through the cracks no one thought to fill, though.”</i>", parse);
					Text.Flush();
				}, enabled : true,
				tooltip : "So, being a morph and all, does he get into trouble often?"
			});
		}
		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("<i>“Oh, you'd rather talk business?”</i> Donovan rubs his furry hands together and smiles. <i>“That's my favorite topic, so don't you worry about changing the subject on me!”</i>", parse);
			Text.Flush();
			backFunc();
		});
	}
}

export { ArmorShopLoc };
