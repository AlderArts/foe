/*
 * 
 * The Outlaw's camp
 * 
 */

// Create namespace
world.loc.Outlaws = {
	Camp : new Event("Outlaws' camp")
}

//TODO
world.loc.Outlaws.Camp.description = function() {
	Text.Add("You are in the outlaws' camp.<br/>");
}

world.loc.Outlaws.Camp.links.push(new Link(
	"Forest", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Forest.Outskirts, {hour: 1});
	}
));

world.loc.KingsRoad.Camp.events.push(new Link(
	"", function() { return  }, true,
	function() {
		
	},
	function() {
		
	}
));

world.loc.Outlaws.Camp.endDescription = function() {
	Text.Add("What do you do?<br/>");
}
