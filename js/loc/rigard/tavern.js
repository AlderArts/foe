





//
// Tavern
//
world.loc.Rigard.Tavern.common.description = function() {
	Text.Add("You are in the tavern called the Maidens' Bane. The dim lighting makes it hard to make out details, and the heavy smell of hard alcohol mixed with bile stings your nostrils. Along the bar is a row of stools, a lot of them partly broken or mended - either missing a supporting peg, or the cushion is torn open with the material picked out, making the seat lumpy and hard.");
	Text.NL();
	Text.Add("In the main dining area there are tables, most of them covered in the leftover dishes, foods and half-drunk mugs of other patrons. There are spills and stains on the tables that look as though they have been there for several weeks, with no hope of getting cleaned up anytime soon. On the wall opposite of the bar there are booths, where it looks like couples could go for some public privacy. For true privacy, there are a few back rooms deeper inside the tavern.");
	Text.NL();
	Text.Add("The omnipresent bartender is a tall equine, perpetually busy with wiping a mug that doesn’t ever seem to get any cleaner.");
	Text.NL();
	
	Text.Flush();
}

world.loc.Rigard.Tavern.common.links.push(new Link(
	"Slums", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 10});
	}
));

world.loc.Rigard.Tavern.common.endDescription = function() {
	
}

world.loc.Rigard.Tavern.common.onEntry = function() {
	if(kyna.flags["Met"] == Kyna.MetFlags.NotMet && world.time.hour > 17 && Math.random() < 0.2) {
		Scenes.Kyna.Intro();
	}
	else {
		PrintDefaultOptions();
	}
}
