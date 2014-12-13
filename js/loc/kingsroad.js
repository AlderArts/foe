/*
 * 
 * The King's road, connecting the kingdom with the free cities.
 * 
 */

// Create namespace
world.loc.KingsRoad = {
	Road         : new Event("King's road")
}

//
// Hills, main hunting grounds
//
world.loc.KingsRoad.Road.description = function() {
	Text.AddOutput("You are standing on the King's road, which connects Rigard and the free cities.<br/>");
}

world.loc.KingsRoad.Road.links.push(new Link(
	"Rigard", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Plains.Gate, {hour: 1});
	}
));

world.loc.KingsRoad.Road.enc = new EncounterTable();
world.loc.KingsRoad.Road.enc.AddEnc(function() {
	return Scenes.Momo.MomoEnc;
}, 1.0, function() { return momo.Wandering(); });


world.loc.KingsRoad.Road.enc.AddEnc(function() {
	return Scenes.Poet.Entry;
}, 1.0, function() { return true; });

world.loc.KingsRoad.Road.enc.AddEnc(function() {
	return Scenes.Roaming.FindSomeCoins;
}, 0.5, function() { return true; });


world.loc.KingsRoad.Road.enc.AddEnc(function() {
	return Scenes.Roaming.KingdomPatrol;
}, 1.0, function() { return true; });
world.loc.KingsRoad.Road.enc.AddEnc(function() {
	return Scenes.Roaming.Bandits;
}, 5.0, function() { return rigard.bandits; });


world.loc.KingsRoad.Road.AddEncounter({
	nameStr : "Wildcat",
	func    : function() {
		return Scenes.Felines.WildcatEnc();
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.KingsRoad.Road.AddEncounter({
	nameStr : "Puma",
	func    : function() {
		return Scenes.Felines.PumaEnc();
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.KingsRoad.Road.AddEncounter({
	nameStr : "Jaguar",
	func    : function() {
		return Scenes.Felines.JaguarEnc();
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.KingsRoad.Road.AddEncounter({
	nameStr : "Lynx",
	func    : function() {
		return Scenes.Felines.LynxEnc();
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.KingsRoad.Road.AddEncounter({
	nameStr : "Equines",
	func    : function() {
		return Scenes.Equine.PairEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true
});


world.loc.KingsRoad.Road.endDescription = function() {
	Text.AddOutput("What do you do?<br/>");
}
