

world.loc.Rigard.Castle = {
	Grounds   : new Event("Royal grounds"),
	MageTower : new Event("Mage's tower"),
	Court     : new Event("Royal court"),
	Dungeon   : new Event("Dungeons")
}



//
// Castle: Grounds
//
world.loc.Rigard.Castle.Grounds.description = function() {
	Text.Add("You are standing inside the walls of the royal grounds, a lush garden dotted with fancy estates.");
	Text.NL();
}

world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Plaza", true, true,
	function() {
		Text.Add("There is a small side entrance in the outer wall you can use to leave the royal grounds and return to the city plaza.");
		Text.NL();
	},
	function() {
		MoveToLocation(world.loc.Rigard.Plaza);
	}
));
world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Court", true, false, // TODO
	function() {
		Text.Add("On top of the steep hill in front of you stands the crowning jewel of Rigard, the royal castle. It commands the strongest tactical position for miles around, protected by steep hillside on three sides, and a sheer, impassable cliff facing the river separating the city far below.");
		Text.NL();
	},
	function() {
		MoveToLocation(world.loc.Rigard.Castle.Court);
	}
));
world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Tower", true, true,
	function() {
		Text.Add("Close to one of the walls surrounding the area, an old crumbling obelisk of rock rises, strangely out of place in the neatly organized landscape. An eerie glow emanates from windows in the upper levels of the tower, a flickering light constantly changing colors.");
		Text.NL();
	},
	function() {
		MoveToLocation(world.loc.Rigard.Castle.MageTower);
	}
));
world.loc.Rigard.Castle.Grounds.links.push(new Link(
	"Jail", function() { return terry.flags["Saved"] == Terry.Saved.TalkedTwins2; }, true,
	null,
	function() {
		Scenes.Terry.Release();
	}
));
world.loc.Rigard.Castle.Grounds.endDescription = function() {
	Text.Flush();
}
