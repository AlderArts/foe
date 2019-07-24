/*
 * 
 * The King's road, connecting the kingdom with the free cities.
 * 
 */

import { Event, Link, EncounterTable } from '../event';
import { WorldTime } from '../worldtime';
import { Season } from '../time';

// Create namespace
let KingsRoadLoc = {
	Road         : new Event("King's road")
}

//
// Hills, main hunting grounds
//
KingsRoadLoc.Road.description = function() {
	var parse = {
		TreeFar : world.TreeFarDesc()
	};
	Text.Add("You are standing on the well-paved road leading from Rigard to the Free Cities, a major trading route on Eden. Estates and farm holds dot the landscape, which is a blend of flat plains on one side, and rougher country on the other as the gentle grasslands are swallowed by the great forest. [TreeFar]", parse);
}

KingsRoadLoc.Road.links.push(new Link(
	"Rigard", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Plains.Gate, {hour: 1});
	}
));

KingsRoadLoc.Road.events.push(new Link(
	"Scepter", function() { return burrows.flags["Access"] == Burrows.AccessFlags.Stage4; }, true,
	null,
	function() {
		Scenes.Gol.SearchForScepter();
	}
));

KingsRoadLoc.Road.enc = new EncounterTable();
KingsRoadLoc.Road.enc.AddEnc(function() {
	return Scenes.Momo.MomoEnc;
}, 1.0, function() { return momo.Wandering(); });


KingsRoadLoc.Road.enc.AddEnc(function() {
	return Scenes.Poet.Entry;
}, 1.0, function() { return true; });

KingsRoadLoc.Road.enc.AddEnc(function() {
	return Scenes.Roaming.FindSomeCoins;
}, 0.5, function() { return true; });


KingsRoadLoc.Road.enc.AddEnc(function() {
	return Scenes.Roaming.KingdomPatrol;
}, 1.0, function() { return true; });
KingsRoadLoc.Road.enc.AddEnc(function() {
	return Scenes.Roaming.Bandits;
}, 5.0, function() { return rigard.bandits; });

KingsRoadLoc.Road.enc.AddEnc(function() {
	return Scenes.Roaming.FlowerPetal;
}, 1.0, function() { return WorldTime().season != Season.Winter; });

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Wildcat",
	func    : function() {
		return Scenes.Felines.WildcatEnc(2);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Puma",
	func    : function() {
		return Scenes.Felines.PumaEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Jaguar",
	func    : function() {
		return Scenes.Felines.JaguarEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Lynx",
	func    : function() {
		return Scenes.Felines.LynxEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Equines",
	func    : function() {
		return Scenes.Equine.PairEnc(4);
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true
});

export { KingsRoadLoc };
