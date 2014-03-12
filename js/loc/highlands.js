/*
 * 
 * Highlands area, connects to the mountains and to the dragons' den.
 * Good hunting grounds
 * 
 */

// Create namespace
world.loc.Highlands = {
	Hills         : new Event("Hills")
}

//
// Hills, main hunting grounds
//
world.loc.Highlands.Hills.description = function() {
	Text.AddOutput("This place looks hilly. Looks good for hunting.<br/>");
}

world.loc.Highlands.Hills.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.AddOutput("Behind you is the way back to the crossroads.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));
world.loc.Highlands.Hills.links.push(new Link(
	"Den entrance", true, true,
	function() {
		Text.AddOutput("A sheer cliffside rise in the distance. Somehow, it gives off an ominous feeling. ");
	},
	function() {
		MoveToLocation(world.loc.DragonDen.Entry, {minute: 15});
	}
));

world.loc.Highlands.Hills.endDescription = function() {
	Text.AddOutput("What do you do?<br/>");
}
