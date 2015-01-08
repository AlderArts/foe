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
	Text.Add("This place looks hilly. Looks good for hunting.<br/>");
}

world.loc.Highlands.Hills.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.Add("Behind you is the way back to the crossroads.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {hour: 2});
	}
));
world.loc.Highlands.Hills.links.push(new Link(
	"Den entrance", true, true,
	function() {
		Text.Add("A sheer cliffside rise in the distance. Somehow, it gives off an ominous feeling. ");
	},
	function() {
		MoveToLocation(world.loc.DragonDen.Entry, {minute: 15});
	}
));

world.loc.Highlands.Hills.enc = new EncounterTable();

world.loc.Highlands.Hills.AddEncounter({
	nameStr : "Puma",
	func    : function() {
		return Scenes.Felines.PumaEnc(2);
	}, odds : 0.5, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.Highlands.Hills.AddEncounter({
	nameStr : "Lynx",
	func    : function() {
		return Scenes.Felines.LynxEnc(2);
	}, odds : 0.5, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.Highlands.Hills.enc.AddEnc(function() {
	return Scenes.Momo.MomoEnc;
}, 1.0, function() { return momo.Wandering(); });

world.loc.Highlands.Hills.endDescription = function() {
	Text.Add("What do you do?<br/>");
}
