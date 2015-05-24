
//
// Asche's
//

Scenes.Rigard.MagicShop = {}
Scenes.Rigard.MagicShop.IsOpen = function() {
	return (world.time.hour >= 10) && !rigard.UnderLockdown();
}

world.loc.Rigard.ShopStreet.MagicShop.description = function() {
	var parse = {
		
	};
	
	Text.Add("Stepping into the interior of the brightly-lit shop to the jingle of chimes, you are immediately surrounded by the scent of sandalwood and jasmine. Its source is easily identified: a large, porcelain, pig-shaped incense burner hanging from the ceiling by a trio of stout chains. The smell is jarring at first, but rapidly fades into the background as your nose gets used to it, and you have to admit, it definitely sets the mood of the little store.", parse);
	Text.NL();
	Text.Add("A hefty portion of the merchandise on display consists of antiques, knick-knacks, and gewgaws of all shapes, sizes and colors, most of them small pieces of jewellery supposedly charmed for one purpose or another - one to ward off illness, another to bring wealth, and yet another to make one appear more attractive. You doubt that most of them actually work, or at least function in the way that they’re intended to; nevertheless, each item has a small placard in front of it, detailing exactly what it does.", parse);
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
		Text.Add("a plain talisman of pure silver, without so much as a speck of tarnish. It’s pleasing enough to the eye as an item of jewellery, but there’s no placard on this one. Instead, a small label has been affixed to the talisman’s chain, with <b>“Danger! Unknown properties! Not for sale!”</b> written on it. Probably quite effective for drawing curious customers to the rest of the shop.", parse);
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

world.loc.Rigard.ShopStreet.MagicShop.events.push(new Link(
	"Asche", true, true, null,
	function() {
		var parse = {
			handsomepretty : player.mfFem("handsome", "pretty")
		};
		
		Text.Clear();
		Text.Add("You approach the counter and Asche’s ears perk up, the proprietress rousing herself with an air of barely contained enthusiasm. The jackaless’ tail swishes back and forth as she leans on the counter with her head in her hands, dark eyes fixed on you like a friendly yet mischievous puppy. <i>“Ah, [handsomepretty] customer has returned! Can Asche do something to brighten customer’s day?”</i>", parse);
		Text.Flush();
		
		Scenes.Asche.Prompt();
	}
));

world.loc.Rigard.ShopStreet.MagicShop.events.push(new Link(
	"Leave", true, true, null,
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 5});
	}
));

/* TODO
[Buy][Sell][Specialties][Donovan][Back]
 */
world.loc.Rigard.ShopStreet.MagicShop.onEntry = function() {
	if(asche.flags["Met"] < Asche.Met.Met)
		Scenes.Asche.FirstEntry();
	//TODO LINK NEW STUFF
	/*
	else if(X && rigard.Twopenny["Met"] < 2) {
		Scenes.Rigard.ArmorShop.RegularEntry(true);
	}
	*/
	else
		PrintDefaultOptions();
}
