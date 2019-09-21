/*
 *
 * The King's road, connecting the kingdom with the free cities.
 *
 */

import { EncounterTable } from "../encountertable";
import { EquineScenes } from "../enemy/equine";
import { FelinesScenes } from "../enemy/feline";
import { GolScenes } from "../enemy/gol";
import { Event } from "../event";
import { GlobalScenes } from "../event/global";
import { MomoScenes } from "../event/momo";
import { PoetScenes } from "../event/poet";
import { RoamingScenes } from "../event/roaming";
import { GAME, MoveToLocation, WORLD, WorldTime } from "../GAME";
import { Link } from "../link";
import { ILocKingsroad } from "../location";
import { IParse, Text } from "../text";
import { Season } from "../time";
import { BurrowsFlags } from "./burrows-flags";

// Create namespace
const KingsRoadLoc: ILocKingsroad = {
	Road         : new Event("King's road"),
};

//
// Hills, main hunting grounds
//
KingsRoadLoc.Road.description = () => {
	const parse: IParse = {
		TreeFar : GlobalScenes.TreeFarDesc(),
	};
	Text.Add("You are standing on the well-paved road leading from Rigard to the Free Cities, a major trading route on Eden. Estates and farm holds dot the landscape, which is a blend of flat plains on one side, and rougher country on the other as the gentle grasslands are swallowed by the great forest. [TreeFar]", parse);
};

KingsRoadLoc.Road.links.push(new Link(
	"Rigard", true, true,
	undefined,
	() => {
		MoveToLocation(WORLD().loc.Plains.Gate, {hour: 1});
	},
));

KingsRoadLoc.Road.events.push(new Link(
	"Scepter", () => GAME().burrows.flags.Access === BurrowsFlags.AccessFlags.Stage4, true,
	undefined,
	() => {
		GolScenes.SearchForScepter();
	},
));

KingsRoadLoc.Road.enc = new EncounterTable();
KingsRoadLoc.Road.enc.AddEnc(() => {
	return MomoScenes.MomoEnc;
}, 1.0, () => GAME().momo.Wandering());

KingsRoadLoc.Road.enc.AddEnc(() => {
	return PoetScenes.Entry;
}, 1.0, () => true);

KingsRoadLoc.Road.enc.AddEnc(() => {
	return RoamingScenes.FindSomeCoins;
}, 0.5, () => true);

KingsRoadLoc.Road.enc.AddEnc(() => {
	return RoamingScenes.KingdomPatrol;
}, 1.0, () => true);
KingsRoadLoc.Road.enc.AddEnc(() => {
	return RoamingScenes.Bandits;
}, 5.0, () => GAME().rigard.bandits);

KingsRoadLoc.Road.enc.AddEnc(() => {
	return RoamingScenes.FlowerPetal;
}, 1.0, () => WorldTime().season !== Season.Winter);

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Wildcat",
	func() {
		return FelinesScenes.WildcatEnc(2);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true,
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Puma",
	func() {
		return FelinesScenes.PumaEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true,
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Jaguar",
	func() {
		return FelinesScenes.JaguarEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true,
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Lynx",
	func() {
		return FelinesScenes.LynxEnc(3);
	}, odds : 0.25, enc : true,
	visible : true, enabled : true, hunt : true,
});

KingsRoadLoc.Road.AddEncounter({
	nameStr : "Equines",
	func() {
		return EquineScenes.PairEnc(4);
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true,
});

export { KingsRoadLoc };
