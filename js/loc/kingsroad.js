/*
 * 
 * The King's road, connecting the kingdom with the free cities.
 * 
 */

import { world } from '../world';
import { Event, Link, EncounterTable, Scenes } from '../event';

// Create namespace
world.loc.KingsRoad = {
	Road         : new Event("King's road")
}

//
// Hills, main hunting grounds
//
world.loc.KingsRoad.Road.description = function() {
	var parse = {
		TreeFar : world.TreeFarDesc()
	};
	Text.Add("You are standing on the well-paved road leading from Rigard to the Free Cities, a major trading route on Eden. Estates and farm holds dot the landscape, which is a blend of flat plains on one side, and rougher country on the other as the gentle grasslands are swallowed by the great forest. [TreeFar]", parse);
}

world.loc.KingsRoad.Road.links.push(new Link(
	"Rigard", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Plains.Gate, {hour: 1});
	}
));

world.loc.KingsRoad.Road.events.push(new Link(
	"Scepter", function() { return burrows.flags["Access"] == Burrows.AccessFlags.Stage4; }, true,
	null,
	function() {
		Scenes.Gol.SearchForScepter();
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

world.loc.KingsRoad.Road.enc.AddEnc(function() {
	return Scenes.Roaming.FlowerPetal;
}, 1.0, function() { return world.time.season != Season.Winter; });

world.loc.KingsRoad.Road.AddEncounter({
	nameStr : "Wildcat",
	func    : function() {
		return Scenes.Felines.WildcatEnc(2);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.KingsRoad.Road.AddEncounter({
	nameStr : "Puma",
	func    : function() {
		return Scenes.Felines.PumaEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.KingsRoad.Road.AddEncounter({
	nameStr : "Jaguar",
	func    : function() {
		return Scenes.Felines.JaguarEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.KingsRoad.Road.AddEncounter({
	nameStr : "Lynx",
	func    : function() {
		return Scenes.Felines.LynxEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.KingsRoad.Road.AddEncounter({
	nameStr : "Equines",
	func    : function() {
		return Scenes.Equine.PairEnc(4);
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true
});
