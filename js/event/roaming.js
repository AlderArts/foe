
Scenes.Roaming = {};

Scenes.Roaming.FindSomeCoins = function() {
	var coin = Math.floor(5 + Math.random() * 20);
	
	var parse = {
		year    : Math.floor(world.time.year - (40 + Math.random() * 20)),
		rhisher : Math.random() < 0.5 ? "his" : "her",
		coin    : coin
	};
	
	var loc = world.CurrentLocation();
	
	parse["ground"] = loc == world.Locations.Desert ? "sand" :
	                  loc == world.Locations.Forest ? "undergrowth" :
	                  "grass";
	
	Text.Clear();
	Text.Add("You see something glistening in the [ground] just ahead and walk over curiously. To your surprise, a coin lies on the ground, apparently forgotten. Picking it up and examining it, you find the year [year] stamped on its face - it’s probably been there for some time, but you’ve seen a few even older coins still in use.", parse);
	Text.NL();
	Text.Add("A little further on, you spot another coin, and then another. You follow the trail, depositing your finds into your slowly expanding purse. Most peculiar. Not that you’re objecting.", parse);
	Text.NL();
	Text.Add("Before too long, you find the source of your enrichment. A pile of bones lies in a small hollow in the ground. All the bones you’d expect in a humanoid body seem to be present, but with the way they’ve been snapped and gnawed, it’s a little difficult to call it a skeleton.", parse);
	Text.NL();
	Text.Add("Well, there’s not much to be done about this now, though you were hoping a path of gold would lead to something more pleasant. Or at least that there would be more left in [rhisher] purse.", parse);
	Text.NL();
	Text.Add("<b>You acquire [coin] coins.</b>", parse);
	Text.Flush();
	
	party.coin += coin;
	
	Gui.NextPrompt();
}
