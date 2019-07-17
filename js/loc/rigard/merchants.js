
import { world } from '../../world';
import { Event, Link, Scenes, EncounterTable } from '../../event';


Scenes.Rigard.ShopStreet = {}

//
// Merchants
//
world.loc.Rigard.ShopStreet =
{
	street       : new Event("Merchant street"),
	OddShop      : new Event("Odd shop"),
	ClothShop    : new Event("Silken Delights"),
	WeaponShop   : new Event("The Pale Flame"),
	ArmorShop    : new Event("Twopenny's"),
	AlchemyShop  : new Event("Alchemical Wonders"),
	MagicShop    : new Event("Asche's Fanciful Trinkets"),
	
	gate         : new Event("Merchants' Gate")
}


//
// Shopping street
//
world.loc.Rigard.ShopStreet.street.description = function() {
	Text.Add("The streets in this area of the city are lined with small merchant stalls and shops of all kinds. ");
	if(world.time.hour >= 6 && world.time.hour < 9)
		Text.Add("A few early birds prowl the streets as the merchant district starts to wake up. A few street vendors selling fresh foods are just opening up, and the smells of baked bread and spices fill the morning air.");
	else if(world.time.hour >= 9 && world.time.hour < 18)
		Text.Add("People of all shapes and sizes wander the streets, browsing the wares on display.");
	else
		Text.Add("Usually this place is bustling with people, but with all the shops closed for the night, no one is about.");
	Text.NL();
	
	if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry) {
		Text.Add("Most of the shops are closed, and even at the open ones there's very little activity. The occasional guard wanders past on patrol and nods absently to Miranda in recognition, but it's clear that they're a token effort at best.");
		Text.NL();
		Text.Add("Despite its calmness, indeed because of it, this actually seems like a very good place for an enterprising thief to try and hide from the eyes and arms of the law.");
		Text.NL();
	}
}

world.loc.Rigard.ShopStreet.street.enc = new EncounterTable();
world.loc.Rigard.ShopStreet.street.enc.AddEnc(function() { return Scenes.Rigard.Chatter;});
world.loc.Rigard.ShopStreet.street.enc.AddEnc(function() { return Scenes.Rigard.Chatter2;});
world.loc.Rigard.ShopStreet.street.enc.AddEnc(function() { return Scenes.Rigard.ShopStreet.Speculate;}, 1.0, function() { return (world.time.hour >= 6 && world.time.hour < 18); });
world.loc.Rigard.ShopStreet.street.enc.AddEnc(function() { return Scenes.Rigard.CityHistory;}, 1.0, function() { return rigard.flags["CityHistory"] == 0; });
world.loc.Rigard.ShopStreet.street.enc.AddEnc(function() { return Scenes.Terry.ExploreMerchants; }, 1000000.0, function() { return rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry; });
world.loc.Rigard.ShopStreet.street.onEntry = function() {
	if(Math.random() < 0.15)
		Scenes.Rigard.Chatter(true);
	else if(Math.random() < 0.3)
		Scenes.Rigard.Chatter2(true);
	else
		PrintDefaultOptions();
}

world.loc.Rigard.ShopStreet.street.links.push(new Link(
	"Gate", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Gate, {minute: 10});
	}
));
world.loc.Rigard.ShopStreet.street.links.push(new Link(
	"Residential", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Residential.street, {minute: 20});
	}
));
world.loc.Rigard.ShopStreet.street.links.push(new Link(
	"Merchants", true, false
));
world.loc.Rigard.ShopStreet.street.links.push(new Link(
	"Plaza", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Plaza, {minute: 10});
	}
));


world.loc.Rigard.ShopStreet.street.links.push(new Link(
	"Armor", true, function() { return Scenes.Rigard.ArmorShop.IsOpen(); },
	function() {
		Text.Add("You catch sight of a ramshackle shop tucked away into a cul-de-sac. An old, weather-beaten sign swings over the entrance with “Twopenny's Used Protectives” printed on it in faded paint. ");
		if(Scenes.Rigard.ArmorShop.IsOpen())
			Text.Add("The door leading in is open, although light doesn't get very far in.");
		else
			Text.Add("The shop is closed, its entrance securely padlocked and barred - perhaps the only part of the establishment that's relatively new.");
		Text.NL();
		
	},
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.ArmorShop, {minute: 5});
	}
));

world.loc.Rigard.ShopStreet.street.links.push(new Link(
	"Weapons", true, function() { return Scenes.Rigard.WeaponShop.IsOpen(); },
	function() {
		Scenes.Rigard.WeaponShop.StreetDesc();
	},
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.WeaponShop, {minute: 5});
	}
));

world.loc.Rigard.ShopStreet.street.links.push(new Link(
	"Tailor", true, function() { return Scenes.Rigard.ClothShop.IsOpen() },
	function() {
		Text.Add("There is a large two floor shop in the center of the street, with two guards watching the large, well crafted doors. The fancy sign above the door reads <i>Silken Delights</i>, and there are many beautiful and intricately crafted articles of clothing on display in the windows. The clothing store seems large, and there are pretty decorations bordering the display windows. A decorated sign next to the door informs you that the shops business hours are from 9 to 20.");
		if(!Scenes.Rigard.ClothShop.IsOpen())
			Text.Add(" The shop seems to be closed at the moment.");
		Text.NL();
	},
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.ClothShop, {minute: 5});
	}
));

world.loc.Rigard.ShopStreet.street.links.push(new Link(
	"Magic", true, function() { return Scenes.Rigard.MagicShop.IsOpen(); },
	function() {
		Text.Add("Off on a side street, a small, brightly lit building stands sandwiched between a barber shop and a bakery. The wide, glass-panelled shopfront has an impressive number of curios on display, and by the looks of it, there are many more on the shelves within. ");
		if(Scenes.Rigard.MagicShop.IsOpen())
			Text.Add("A small wooden sign in a slot in the door declares the shop to be open.");
		else
			Text.Add("The wooden sign has been turned over, declaring: “The shop is closed until it’s open once more.” Isn’t that kind of redundant?");
		Text.NL();
	},
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.MagicShop, {minute: 5});
	}
));

world.loc.Rigard.ShopStreet.street.links.push(new Link(
	"Odd shop", true, function() { return Scenes.Rigard.OddShop.IsOpen(); },
	function() {
		Text.Add("One particular shop catch your eye. A garish sign hanging outside announce it the 'Shoppe of oddities', though from just the exterior, it is a bit unclear what is actually on sale.");
		if(!Scenes.Rigard.OddShop.IsOpen())
			Text.Add(" A small paper stapled to the front door states that the shop is 'Cloosd' at the moment.");
		Text.Add("<br>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.OddShop, {minute: 5});
	}
));

world.loc.Rigard.ShopStreet.street.events.push(new Link(
	"Scepter", function() { return rigard.flags["Scepter"] != 0 && burrows.flags["Access"] < Burrows.AccessFlags.Stage5; }, true,
	null,
	function() {
		Scenes.Rigard.ShopStreet.Scepter();
	}
));

world.loc.Rigard.ShopStreet.street.events.push(new Link(
	"Violin", function() { return !rigard.UnderLockdown() && cveta.flags["Met"] == Cveta.Met.ViolinQ; }, function() { return party.coin >= 500; },
	null,
	function() {
		var parse = {
			playername : player.name,
			sirmadam : player.mfFem("sir", "madam")
		};
		
		cveta.flags["Met"] = Cveta.Met.ViolinGet;
		
		Text.Clear();
		Text.Add("Walking down the length of the Merchants’ Street, you keep an eye out for the store that Cveta mentioned. It’s not too hard to find, being just across the street from Silken Delights, wedged in between a confectioner’s and haberdashers’. It’s a crooked little thing, slightly out of place in the finery of many of the other shops in the district, but a look at the antiques displayed in the shop window suggests that its dinginess is part of its marketing. After all, where better to find deals on such knick-knacks than in small corner stores like these? Even the letters on the sign, “Rintell’s”, have been made to resemble spidery writing, rather than being printed onto the wood like they reveal themselves to be on closer inspection.", parse);
		Text.NL();
		parse["comp"] = party.Num() == 2 ? party.Get(1).name :
		                party.Num() >  2 ? "your companions" : "";
		parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
		Text.Add("Hoping someone else hasn’t come in already and bought the violin in question, you push open the door and step through, sending the bells affixed to the door to chiming. The interior of the shop is slightly musty but well-ventilated and equally brightly lit, and numerous pieces of merchandise are on display- on shelves for the smaller pieces, and in glass cases for the bulkier ones. There’re also some which <i>aren’t</i> on display- instead being packed away in boxes, which are currently being shuffled around by a young, bespectacled lion-morph who can’t be any more than twenty, dressed in a pair of simple white overalls. He looks up at you[c] as you approach, dusts off his hands and gives you a smile.", parse);
		Text.NL();
		Text.Add("<i>“Welcome to Rintell’s, curio extraordinaire, [sirmadam]. I am Dio Rintell, and can I help you? Perhaps you are just browsing, or maybe you have come for a conversation piece with which to spruce up your living room?”</i> He waggles a paw at the back of his shop, past the old paintings, seasoned instruments and antique dinnerware, amongst other things. <i>“Please forgive me for the state of the store. I’ve been taking inventory for the last couple of days and cleaning out some of the dustier spots. Grandpa was adamant about the store’s old image, but I think it’s time it had a makeover to appeal to the new tastes in Rigard’s upper crust.”</i>", parse);
		Text.NL();
		Text.Add("Wait. His grandfather <i>was</i> adamant?", parse);
		Text.NL();
		Text.Add("<i>“Umm… well, yes,”</i> Dio admits, scratching at his mane. <i>“Old Grandpa passed away scarcely less than a week ago, and left the place to me ‘cause Dad was already established where he was, and I always loved the old store. He never was the best bookkeeper, though, which is why I’ve been busy making lists and balancing figures for the last couple of days. Then there was the matter of the solicitor and getting enough coin to make claiming the inheritance smooth and easy, what with me being a morph and all, but…", parse);
		Text.NL();
		Text.Add("“Bah, I shouldn’t be troubling you with my personal problems. If you want to look around, feel free to do so; wouldn’t have opened for business otherwise, would I? You find something you like, just tell me, and if it doesn’t have a price tag then I’ll look in the books for one.”</i>", parse);
		Text.NL();
		parse["c"] = party.Num() > 1 ? Text.Parse(", leaving [comp] behind to admire the wonders of ancient clay mugs and candle-holders fashioned from preserved skulls,", parse) : "";
		Text.Add("Sounds like a plan. You head for the back of the store[c] and make a beeline for the antique instruments lying about there. Dio clearly hasn’t gotten around to cleaning up this part of his inheritance yet, and wedged between an accordion and a huge, tarnished tuba is the only violin in the place. You lift it up, open the leather case and brush off the worst of the dust on the instrument’s varnished wood, looking for the maker’s mark somewhere on it. Sure enough, your efforts are rewarded with a faded seal near its bottom with the letters ‘GRA’ within it. This must be the violin Cveta sent you after!", parse);
		Text.NL();
		Text.Add("<i>“Oh-ho, that’s a fine piece indeed.”</i> You turn to find Dio struggling under a small mountain of cymbals, which he carefully sets down by an antique piano before pulling out a pocketbook from his overalls and flipping through its pages. <i>“Old Grandpa valued this one at… let’s see… five hundred coins, no more, no less. Full-bodied, mellow, solid construction - the strings in the bow and body could use replacing, but that’s only to be expected. With these old instruments, Grandpa always told me, the wood’s always the most important.”", parse);
		Text.NL();
		Text.Add("“Again, five hundred coins if you want it, case, bow and all.”</i>", parse);
		Text.NL();
		Text.Add("You look at the lion-morph’s earnest face, and wonder if you should tell him the truth lest it weigh on your conscience…", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				Text.Add("Damn. Sure, Cveta did say the proprietor was going to try and cheat you, but that wasn’t Dio - that was his grandfather, and the old coot’s dead and buried now. Pulling off that sort of trick when he’s clearly new to the game- well, it’s not going to be easy on your conscience. Steeling yourself, you show Dio the maker’s mark on the bottom of the violin, explain what you think it is, and tell him that the instrument is probably worth a good deal more than his grandfather thought it was.", parse);
				Text.NL();
				Text.Add("<i>“Oh my,”</i> Dio says after a moment’s stunned silence. <i>“An honest customer. And Grandpa always said that the whole business was a game of nickel-and-diming…”</i> He thinks a moment more. <i>“Tell me, [sirmadam], if you don’t mind me asking - just what do you intend to do with this lovely instrument here?”</i>", parse);
				Text.NL();
				Text.Add("Well, no better answer than the truth, is there? You tell Dio that the violin’s going to be restored and played in performances, and he mashes his paws together appreciatively, a huge grin on his leonine muzzle.", parse);
				Text.NL();
				Text.Add("<i>“Very well! Five hundred coins it is anyway, and give my regards to the fine musician who will be pulling those strings! I’m not going to miss coins that I’d never have even thought of if you hadn’t told me about them, am I?”</i>", parse);
				Text.NL();
				Text.Add("Seems like honesty <b>does</b> pay off, or at least in this case, it did. Dio leads you to the store counter, where he takes your money and records the sale in his pocketbook in impeccable handwriting before thrusting the violin and its accessories into your arms.", parse);
				Text.NL();
				if(party.InParty(kiakai)) {
					parse["name"] = kiakai.name;
					Text.Add("<i>“You did a good deed today.”</i>", parse);
					Text.NL();
					Text.Add("Despite the weight of the violin case in your arms, you manage to turn just enough to see [name] beaming at you.", parse);
					Text.NL();
					Text.Add("<i>“I saw it all, [playername]. And it is proof that not everyone is out to take advantage of another’s kindness. Would this happen more often- then Eden would be a far better place.”</i>", parse);
					Text.NL();
					Text.Add("You nod, and prepare to head out of the antique shop. Yes, you won’t have that burden on your conscience.", parse);
					Text.NL();
					kiakai.relation.IncreaseStat(100, 3);
				}
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Tell the young lion-morph the violin is worth more than his grandfather’s valuation."
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("Remembering Cveta’s words, you nod and follow Dio to the counter before counting out his payment. The lion-morph watches the small pile of coins grow steadily, then sweeps them into a drawer before making a note in his pocketbook.", parse);
				Text.NL();
				Text.Add("<i>“Wonderful, my first sale!”</i> He’s practically beaming now, and reaches out to grab your hand and give it a mighty shake. <i>“And it’s all thanks to my first customer! I’m a little surprised that you didn’t try to haggle the price down - Grandpa always said that antiques collectors are the biggest skinflints on all the worlds - but I’m not going to complain! Thank you kindly again, - oh, I didn’t catch your name.”</i>", parse);
				Text.NL();
				Text.Add("Smiling weakly at the lion-morph, you assure him that it’s not needed, and quickly slip out of the door before he can ask any more inconvenient and awkward questions.", parse);
				Text.NL();
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Pay Dio’s asking price for the violin."
		});
		Gui.Callstack.push(function() {
			Text.Add("Now that you have the violin in your possession, maybe you ought to hurry and get it back to Cveta so you don’t have to lug it about with you. It’s not that the instrument’s exceptionally heavy - how much is a violin supposed to weigh, anyway? - but with an antique like this, it’s bound to be fragile!", parse);
			Text.Flush();
			
			party.coin -= 500;
			party.Inv().AddItem(Items.Quest.Violin);
			
			Gui.NextPrompt();
		});
		Gui.SetButtonsFromList(options, false, null);
	}
));

world.loc.Rigard.ShopStreet.street.events.push(new Link(
	"Martello", function() { return room69.flags["Hinges"] == Room69.HingesFlags.TalkedToGoldsmith || room69.flags["Hinges"] == Room69.HingesFlags.TalkedToSmith; }, function() { return world.time.hour >= 9 && world.time.hour < 18; },
	function() {
		if(room69.flags["Hinges"] == Room69.HingesFlags.TalkedToGoldsmith) {
			Text.Add("You could ask the smith Martello to make gilded hinges for Sixtynine’s door.");
			Text.NL();
		}
		else if(room69.flags["Hinges"] == Room69.HingesFlags.TalkedToSmith) {
			Text.Add("You could ask the smith Martello how the work on the gilded hinges for Sixtynine’s door is progressing.");
			Text.NL();
		}
	},
	function() {
		Text.Clear();
		if(room69.flags["Hinges"] == Room69.HingesFlags.TalkedToGoldsmith) {
			Text.Add("You ask around and quickly find your way to Martello’s smithy. It’s plain, especially after the goldsmith’s establishment, but seems well-kept and prosperous enough.");
			Text.NL();
			Text.Add("Inside, you are met by the smith’s assistant, and, when he hears your request, forced to wait for a few minutes for Martello to finish up with his current task. You hear clanging from the forge room, and it seems that the man is observing one of his apprentices work on a horseshoe, checking her technique.");
			Text.NL();
			var parse = {
				str : player.Str() > 35 ?
				", and you return it in kind, your hands briefly locking in an immovable bond. The smith smiles at you, in apparent approval" :
				", and you shake your hand a little to adjust your joints once he releases you"
			};
			Text.Add("After a few minutes, Martello comes around to greet you. His handshake is like a vice[str]. You explain what you need to him, and he scratches his beard, thinking it over.", parse);
			Text.NL();
			Text.Add("<i>“Shouldn’t be a problem. A bit tricky to work the gold leaf like that, but I’ll manage,”</i> he tells you. <i>“Hundred twenty coins, and I’ll have ‘em for you within a day or so.”</i>");
			Text.Flush();
			
			//[Pay][Leave]
			var options = new Array();
			options.push({ nameStr : "Pay",
				func : function() {
					Text.Clear();
					
					party.coin -= 120;
					
					Text.Add("<b>You pay 120 gold.</b>", parse);
					Text.NL();
					Text.Add("You agree to the price, and shake hands on it. Martello asks his assistant to make a note in the workbook, and says he’ll have your hinges ready as fast as he can - you should come by to pick them up then.", parse);
					Text.NL();
					Text.Add("<b>You should come back later to retrieve the hinges.</b>", parse);
					Text.Flush();
					
					room69.flags["Hinges"] = Room69.HingesFlags.TalkedToSmith;
					
					world.TimeStep({hour: 1});
					Gui.NextPrompt();
				}, enabled : party.coin >= 120,
				tooltip : "Pay 120 coins for the hinges."
			});
			options.push({ nameStr : "Leave",
				func : PrintDefaultOptions, enabled : true,
				tooltip : "Leave for now. You can always get the hinges later."
			});
			Gui.SetButtonsFromList(options);
		}
		else {
			Text.Add("The smith's assistant remembers your order, and promptly brings it out for you after greeting you.");
			Text.NL();
			Text.Add("You examine the hinges, turning them over in your hands. Very hinge-like. The gilding is well done - were it not for the light weight, you could very easily believe these are actually made of gold.");
			Text.NL();
			Text.Add("Seeing no problem with the order, you thank the assistant, and head out. Looks like you can fulfill Sixtynine's request now, if you want. Which you probably do, unless you can think of another pressing use for gilded door hinges...");
			Text.Flush();
			
			room69.flags["Hinges"] = Room69.HingesFlags.HaveHinges;
			Gui.NextPrompt();
		}
	}
));

Scenes.Rigard.ShopStreet.Speculate = function() {
	
	var stalls = ["stall", "booth", "stand"];
	var Sdescs = ["shabby-looking", "colorful", "neatly-decorated", "well-kept", "well-used", "plain"];
	var Mdescs = ["an agitated-looking merchant", "a wildly gesticulating merchant", "an excited-looking merchant", "a desperate-looking merchant"];
	
	var parse = {
		p1name       : party.Get(1).name,
		stall        : function() { return stalls[Math.floor(Math.random() * stalls.length)]; },
		stallDesc    : function() { return Sdescs[Math.floor(Math.random() * Sdescs.length)]; },
		merchantDesc : function() { return Mdescs[Math.floor(Math.random() * Mdescs.length)]; },
		address      : function() { return Math.random() < 0.4 ? "my friend" : player.mfFem("sir", "madam"); }
	};
	
	// TODO: FUNCTION?
	var coins  = Math.floor(100 * (1 + Math.random()));
	parse["x"] = Text.NumToText(coins);
	
	var trueFalseDeal = Math.random() < 0.5 ? 1 : -1;
	var buyingSkill = Math.min(0.01 * (0.625 * player.Int() + 2 * rigard.flags["BuyingExp"]), 0.5);
	var buyingProb = 0.5 + buyingSkill * trueFalseDeal;
	var buying = Math.random() < buyingProb;
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		parse["wares"] = "cheeses";
		parse["waresContainer"] = "parcel of cheeses";
		parse["waresProblem"] = "they are hard, and barely edible";
		
		parse["s"]         = "s";
		parse["notS"]      = "";
		parse["itThey"]    = "they";
		parse["itThem"]    = "them";
		parse["itThese"]   = "these";
		parse["thisThese"] = "these";
		parse["itsTheir"]  = "their";
		
		waresExam = function() {
			Text.Add("You ask for a sample of the cheese, and, with a smile, the merchant leans over to cut you a small piece of one of them, ", parse);
			if(buying) {
				if(trueFalseDeal == 1 && Math.random() < 2 * buyingSkill)
					Text.Add("but as [heshe]'s about to use [hisher] knife, you stop [himher] at the last moment. You point to a different cheese, and ask for a slice of that instead. [HeShe] shrugs indifferently, and proceeds to cut you a piece from the cheese you asked for.", parse);
				else
					Text.Add("handing it to you on the tip of a tiny fork.", parse);
				Text.NL();
				Text.Add("You put the piece in your mouth, careful to fully gauge the flavor, and you have to admit it really is as good as the merchant had promised.", parse);
			}
			else {
				Text.Add("but as [heshe]'s about to use [hisher] knife, you stop [himher] at the last moment. You point to a different cheese, and ask for a slice of that instead. [HeShe] bites [hisher] lip, eyes narrowing in apparent consternation, but proceeds to cut a tiny piece from the cheese you asked for.", parse);
				Text.NL();
				Text.Add("You put the little piece in your mouth, careful to fully gauge the flavor, but you have to spit it out almost immediately in disgust. It's as hard as a rock, and tastes like some cow manure had found its way in.", parse);
			}
		};
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["wares"] = "velvet";
		parse["waresContainer"] = "bundles of velvet";
		parse["waresProblem"] = "it's threadbare, and fragile";
		
		parse["s"]         = "";
		parse["notS"]      = "s";
		parse["itThey"]    = "it";
		parse["itThem"]    = "it";
		parse["itThese"]   = "it";
		parse["thisThese"] = "this";
		parse["itsTheir"]  = "its";
		
		waresExam = function() {
			Text.Add("You lean over to inspect the fabric, running your fingers ", parse);
			if(buying) {
				if(trueFalseDeal == 1 && Math.random() < 2 * buyingSkill) {
					Text.Add("carefully over it, compressing it, and stretching it out. It is soft, yet firm, feeling nice and solid beneath your fingers.", parse);
					Text.NL();
					Text.Add("Brushing your hand over it one last time, you confirm it's really as good as the merchant claimed.", parse);
				}
				else {
					Text.Add("over it. You brush your hand over the cloth, and it certainly feels soft and luxurious in your grasp. It seems like it's really as good as the merchant claimed.", parse);
				}
			}
			else {
				Text.Add("carefully over it, compressing it, and stretching it out. It seems to give a little more than you expect from velvet, and, puzzled, you lift up a corner of the fabric, peering at it against the sun.", parse);
				Text.NL();
				Text.Add("Light shines through in places, exposing the threadbare, worn stitching. If clothes were made out of this, they'd probably tear in hours!", parse);
			}
		};
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["wares"] = "wines";
		parse["waresContainer"] = "jugs of wine";
		parse["waresProblem"] = "they are watered down, and hardly fit for consumption";
		
		parse["s"]         = "s";
		parse["notS"]      = "";
		parse["itThey"]    = "they";
		parse["itThem"]    = "them";
		parse["itThese"]   = "these";
		parse["thisThese"] = "these";
		parse["itsTheir"]  = "their";
		
		waresExam = function() {
			Text.Add("You ask for a sample of the wine, and, with a smile, the merchant leans over toward a jug on [hisher] right, ", parse);
			
			if(buying) {
				if(trueFalseDeal == 1 && Math.random() < 2 * buyingSkill)
					Text.Add("but as he's about to dip a small cup in the jug, you stop [himher] at the last moment. You point to a different jug, and ask for a sample of that instead. [HeShe] shrugs indifferently, and proceeds to get you a cup from the jug you asked for.", parse);
				else
					Text.Add("and dips a small cup into it, passing you the sample.", parse);
				Text.NL();
				Text.Add("You put the wine in your mouth, careful to fully gauge the flavor, and have to admit that it really is marvelous. You swirl it around your tongue, finally swallowing it, almost regretfully.", parse);
			}
			else {
				Text.Add("but as he's about to dip a small cup in the jug, you stop [himher] at the last moment. You point to a different jug, and ask for a sample of that instead. [HeShe] bites [hisher] lip, eyes narrowing in apparent consternation, but proceeds to dip the cup shallowly into the vessel you asked for.", parse);
				Text.NL();
				Text.Add("You put the wine in your mouth, careful to fully gauge the flavor, but ", parse);
				if(Math.random() < 0.5)
					Text.Add("there's no wine flavor to be found. The wine has been watered down to the point where it's about as tasty as water. Stale, muddy water.", parse);
				else
					Text.Add("you have to spit it out almost immediately in disgust. It tastes rancid, and you swear you feel some sort of slime coating the surface. You have to wonder if something died in the wine barrel.", parse);
			}
		};
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["wares"] = "oil";
		parse["waresContainer"] = "jugs of oil";
		parse["waresProblem"] = "it's acrid, and oddly slimy";
		
		parse["s"]         = "";
		parse["notS"]      = "s";
		parse["itThey"]    = "it";
		parse["itThem"]    = "it";
		parse["itThese"]   = "it";
		parse["thisThese"] = "this";
		parse["itsTheir"]  = "its";
		
		waresExam = function() {
			Text.Add("You ask for a sample of the oil, and, with a smile, the merchant leans over toward a jug on [hisher] right, explaining that this is top cooking grade parnaseed oil. ", parse);
			
			if(buying) {
				if(trueFalseDeal == 1 && Math.random() < 2 * buyingSkill)
					Text.Add("Before [heshe] can pour your sample, you interrupt [himher], and point to a different jug instead. [HeShe] shrugs indifferently, and proceeds to to ladle you a small portion of oil into a flat cup for you from the vessel you asked for.", parse);
				else
					Text.Add("[HeShe] ladles a little into a flat cup and passes it to you.", parse);
				Text.NL();
				Text.Add("You swirl your finger around the cup and find that the oil has a perfect consistency, and is a pleasant clear color. Bringing your fingertip to your tongue, you are rewarded with a pleasant smell and a delicious oily taste. You almost feel like it'd be a waste to cook with the oil when you could just eat it with bread.", parse);
			}
			else {
				Text.Add("Before [heshe] can pour your sample, you interrupt [himher], and point to a different jug instead. [HeShe] bites [hisher] lip, eyes narrowing in apparent consternation, but proceeds to ladle you a thin layer of oil into a flat cup for you from the vessel you asked for.", parse);
				Text.NL();
				if(Math.random() < 0.5)
					Text.Add("You swirl your finger around in the oil, and it seems to stick to your skin correctly. You bring your fingertip to touch your tongue, however, and have to immediately pull away, desperately wishing there was some way to get the disgusting acrid taste out of your mouth.", parse);
				else
					Text.Add("You swirl your finger around in the oil, and it feels more like slime than anything you'd want to cook with. Looking more closely, you also see small black flecks swimming around in the stuff. You were thinking of tasting it, but at this point you're not sure you'd survive the experience.", parse);
			}
		};
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	if(Math.random() < 0.7) {
		parse["HeShe"]   = "He";
		parse["heshe"]   = "he";
		parse["HisHer"]  = "His";
		parse["hisher"]  = "his";
		parse["himher"]  = "him";
		parse["hishers"] = "his";
	}
	else {
		parse["HeShe"]   = "She";
		parse["heshe"]   = "she";
		parse["HisHer"]  = "Her";
		parse["hisher"]  = "her";
		parse["himher"]  = "her";
		parse["hishers"] = "hers";
	}
	
	parse["comp"] = party.Two() ? Text.Parse(", [p1name] trailing behind you", parse) : !party.Alone() ? ", your companions trailing behind you" : "";
	parse["comp2"] = party.Two() ? Text.Parse(", [p1name] helping your carry the excess", parse) : !party.Alone() ? ", your companions helping you carry the excess" : "";
	
	Text.Clear();
	Text.Add("You decide to take a walk through the center of the market and see if there's anything interesting happening. You pass along rows of stalls, a merchant behind each one, many shouting out about the quality of their wares to the passing masses.", parse);
	Text.NL();
	Text.Add("Ahead of you, you spot a [stallDesc] [stall] with [merchantDesc] behind it. Not many people seem to be paying attention to [himher] yet, but, feeling curious, you decide to come closer[comp].", parse);
	Text.NL();
	Text.Add("The merchant looks up at you, a sickly smile on [hisher] lips, hope apparent in [hisher] eyes.", parse);
	Text.NL();
	
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“You've made the right choice coming to see my goods, [address]!”</i> [heshe] tells you. <i>“I have the finest [wares] in the city, at the lowest price[s]!”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“I must congratulate you, [address]!”</i> [heshe] says. <i>“You have just found the best chance to buy some fine [wares] you'll see all day!”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Welcome to my humble shop, [address]!”</i> [heshe] exclaims. <i>“You will find that I have the best [wares] at the lowest price[s] you'll see this week!”</i>", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("You ask the merchant why [heshe]'s selling so cheaply if [hisher] goods really are so wonderful.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“You see, I must sadly embark with a caravan soon. I simply do not have the time to sell [itThese] at the price [itThey] deserve[notS].”</i> [HeShe] indicates the [wares] in front of [himher], sniffling theatrically. <i>“It is a great pity that I must practically give [itThem] away.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“It is my misfortune that I must repay my creditors in a little over an hour, and until I sell these, I won't have the money!”</i> [HeShe] sounds genuinely distraught. <i>“So, I must dump [thisThese] [wares] at well below [itsTheir] true worth.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“You see, [address],”</i> [heshe] says, leaning in conspiratorially, <i>“I really have to pack up and get out of here before the next tax audit, if you catch my meaning. So, though [thisThese] [wares] is worth a lot more, I just have to dump all my stock as quickly as possible and go.”</i> [HeShe] grimaces, clearly finding the prospect distasteful.", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	if(party.coin < coins) {
		Text.NL();
		Text.Add("<b>You don't have enough money to consider speculating on the merchant's wares right now.</b>", parse);
	}
	Text.Flush();
	
	var notBuyingVars = Math.random() < 2 * buyingSkill ?
	function() {
		waresExam();
		Text.NL();
		Text.Add("You stiffly tell the merchant that you won't be purchasing any of <i>that</i>. Or probably anything else from [himher]. Ever. [HeShe] looks a little chagrined", parse);
	} :
	function() {
		Text.Add("You look over the [wares], but can't see any defects in [itThem]. Nonetheless, something about the merchant's desperation rang false with you. You suspect there's some problem that you just couldn't quite spot, and decline [hisher] offer. [HeShe] looks a little disappointed", parse);
	};
	var buyingTrueVars = function() {
		waresExam();
		Text.NL();
		Text.Add("Your nod contentedly at the merchant, and purchase a good amount of the [wares] from [himher], careful not to spend too much coin on the risky investment. As you're leaving, you see a line of other customers behind you, and the merchant is cleaned out in minutes.", parse);
		Text.NL();
		Text.Add("You spend most of an hour, walking around the marketplace, looking a little comical with your [waresContainer][comp2], until you finally find customers for the goods and manage to turn a tidy profit.", parse);
	};
	var buyingFalseVars = function() {
		parse["randomheshe"] = Math.random() < 0.5 ? "he" : "she";
		waresExam();
		Text.NL();
		Text.Add("Your nod contentedly at the merchant, and purchase a good amount of the [wares] from [himher], careful not to spend too much coin on the risky investment. As you're leaving, you see a line of other customers behind you, and the merchant is cleaned out in minutes.", parse);
		Text.NL();
		Text.Add("You set out walking around the marketplace, looking a little comical with your [waresContainer][comp2], trying to find customers to sell to. Unfortunately, when you do find someone who's interested, [randomheshe] tests the [wares] you bought, and finds that [waresProblem]. You run to find the merchant who had sold you the stuff, but, as you had half suspected, [heshe] is long gone.", parse);
		Text.NL();
		Text.Add("You spend most of an hour doing your best to sell off the defective goods, and manage to do so, although you're forced to take a substantial loss relative to what you paid.", parse);
	};
	
	//[Inquire][Ignore]
	var options = new Array();
	options.push({ nameStr : "Inquire",
		func : function() {
			Text.Clear();
			if(buying) {
				if(trueFalseDeal == 1) {
					buyingTrueVars();
					
					Text.NL();
					Text.Add("You feel like you've learned something from your successful speculation.", parse);
					Text.NL();
					Text.Add("<b>You gain [x] coins!</b>", parse);
					party.coin += coins;
					world.TimeStep({hour : 1});
				}
				else {
					buyingFalseVars();
					Text.NL();
					Text.Add("Although you're upset about the money you lost, you feel like you've still learned something from your misadventure.", parse);
					Text.NL();
					Text.Add("<b>You lose [x] coins!</b>", parse);
					party.coin -= coins;
					world.TimeStep({hour : 1});
				}
			}
			else {
				notBuyingVars();
				Text.Add(", but immediately starts calling out to the other passersby, hoping to still make that quick sale.", parse);
				Text.NL();
				Text.Add("Although you didn't buy anything, you still feel like you've learned something from the experience.", parse);
				world.TimeStep({minute : 20});
			}
			rigard.flags["BuyingExp"]++;
			player.intelligence.IncreaseStat(40, 0.5);
			
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : party.coin >= coins,
		tooltip : Text.Parse("Perhaps there is some profit to be made here (requires [x] coins).", parse)
	});
	options.push({ nameStr : "Ignore",
		func : function() {
			Text.Clear();
			Text.Add("You tell [himher] that you really have no use for [wares], and walk on, deciding you'd rather not bother trying to speculate on the price.", parse);
			Text.Flush();
			world.TimeStep({minute: 10});
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You aren't particularly interested in following up on this right now."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Rigard.ShopStreet.Scepter = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Following Roa’s direction, you seek out the establishment of the merchant who swindled him out of Lagon’s scepter. It’s a rather small, nondescript shop, set on a side street away from the bustle of the main street. On the front door - which seems locked and barred - there is a notice telling you the proprietor is away on business to the free cities.", parse);
	Text.NL();
	Text.Add("There is also a date proclaiming the expected return date, long since expired. You don’t think you’ll find any more clues here - nor do you find it likely the merchant would leave a valuable item such as the scepter just lying around - perhaps you need to head toward his destination in order to find out the fate of the merchant.", parse);
	Text.NL();
	Text.Add("<b>Perhaps you should search along the King's Road.</b>", parse);
	Text.Flush();
	
	world.TimeStep({minute: 15});
	
	rigard.flags["Scepter"] = 0;
	
	Gui.NextPrompt()
}

