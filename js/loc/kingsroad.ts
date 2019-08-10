/*
 * 
 * The King's road, connecting the kingdom with the free cities.
 * 
 */

import { Event, Link } from '../event';
import { EncounterTable } from '../encountertable';
import { WorldTime, MoveToLocation, WORLD, GAME } from '../GAME';
import { Season } from '../time';
import { Text } from '../text';
import { EquineScenes } from '../enemy/equine';
import { FelinesScenes } from '../enemy/feline';
import { RoamingScenes } from '../event/roaming';
import { PoetScenes } from '../event/poet';
import { MomoScenes } from '../event/momo';
import { GolScenes } from '../enemy/gol';
import { BurrowsFlags } from './burrows-flags';

// Create namespace
let KingsRoadLoc = {
	Road         : new Event("King's road")
}

//
// Hills, main hunting grounds
//
KingsRoadLoc.Road.description = function() {
	var parse = {
		TreeFar : WORLD().TreeFarDesc()
	};
	Text.Add("You are standing on the well-paved road leading from Rigard to the Free Cities, a major trading route on Eden. Estates and farm holds dot the landscape, which is a blend of flat plains on one side, and rougher country on the other as the gentle grasslands are swallowed by the great forest. [TreeFar]", parse);
}

KingsRoadLoc.Road.links.push(new Link(
	"Rigard", true, true,
	null,
	function() {
		MoveToLocation(WORLD().loc.Plains.Gate, {hour: 1});
	}
));

KingsRoadLoc.Road.events.push(new Link(
	"Scepter", function() { return GAME().burrows.flags["Access"] == BurrowsFlags.AccessFlags.Stage4; }, true,
	null,
	function() {
		GolScenes.SearchForScepter();
	}
));

KingsRoadLoc.Road.enc = new EncounterTable();
KingsRoadLoc.Road.enc.AddEnc(function() {
	return MomoScenes.MomoEnc;
}, 1.0, function() { return GAME().momo.Wandering(); });


KingsRoadLoc.Road.enc.AddEnc(function() {
	return PoetScenes.Entry;
}, 1.0, function() { return true; });

KingsRoadLoc.Road.enc.AddEnc(function() {
	return RoamingScenes.FindSomeCoins;
}, 0.5, function() { return true; });


KingsRoadLoc.Road.enc.AddEnc(function() {
	return RoamingScenes.KingdomPatrol;
}, 1.0, function() { return true; });
KingsRoadLoc.Road.enc.AddEnc(function() {
	return RoamingScenes.Bandits;
}, 5.0, function() { return GAME().rigard.bandits; });

KingsRoadLoc.Road.enc.AddEnc(function() {
	return RoamingScenes.FlowerPetal;
}, 1.0, function() { return WorldTime().season != Season.Winter; });

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Wildcat",
	func    : function() {
		return FelinesScenes.WildcatEnc(2);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Puma",
	func    : function() {
		return FelinesScenes.PumaEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Jaguar",
	func    : function() {
		return FelinesScenes.JaguarEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Lynx",
	func    : function() {
		return FelinesScenes.LynxEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Equines",
	func    : function() {
		return EquineScenes.PairEnc(4);
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true
});

export { KingsRoadLoc };
