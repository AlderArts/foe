// World template
import { InitCheats } from "./cheats";
import { DreamsScenes } from "./event/dreams";
import { DarkAspect, InitIntro, LightAspect } from "./event/introduction";
import { InitMiranda } from "./event/miranda-scenes";
import { BullTowerLoc } from "./event/outlaws/bulltower";
import { CvetaScenes } from "./event/outlaws/cveta-scenes";
import { GAME, WORLD } from "./GAME";
import { BurrowsLoc, InitBurrows } from "./loc/burrows-scenes";
import { DesertLoc } from "./loc/desert";
import { DragonDenLoc } from "./loc/dragonden";
import { FarmLoc, InitFarm } from "./loc/farm-scenes";
import { ForestLoc } from "./loc/forest";
import { InitGlade } from "./loc/glade";
import { HighlandsLoc } from "./loc/highlands";
import { KingsRoadLoc } from "./loc/kingsroad";
import { LakeLoc } from "./loc/lake";
import { InitNomads } from "./loc/nomads";
import { InitOutlaws, OutlawsLoc } from "./loc/outlaws";
import { PlainsLoc } from "./loc/plains";
import { InitRigard } from "./loc/rigard/rigard";
import { RigardLoc } from "./loc/rigard/rigard-scenes";
import { TreeCityLoc } from "./loc/treecity/treecity";

export function InitWorld() {
	const world = WORLD();
	world.loc = {
		Plains : PlainsLoc,
		Farm : FarmLoc,
		Burrows : BurrowsLoc,
		Forest : ForestLoc,
		Desert : DesertLoc,
		KingsRoad : KingsRoadLoc,
		Highlands : HighlandsLoc,
		Lake : LakeLoc,
		Outlaws : OutlawsLoc,
		BullTower : BullTowerLoc,
		Rigard : RigardLoc,

		DragonDen : DragonDenLoc,
		TreeCity : TreeCityLoc,

		DarkAspect,
		LightAspect,
	};

	world.CurrentLocation = function(loc?: any) {
		loc = loc || GAME().party.location;

		if     (loc == PlainsLoc.Crossroads) {
			return world.Locations.Plains;
		}
		else if (loc == ForestLoc.Outskirts) {
			return world.Locations.Forest;
 }
		else if (loc == DesertLoc.Drylands) {
			return world.Locations.Desert;
 }
		else if (loc == HighlandsLoc.Hills) {
			return world.Locations.Highlands;
 }
		else if (loc == LakeLoc.Shore) {
			return world.Locations.Lake;
 }

		return -1;
	};

	// TODO
	world.TreeFarDesc = function() {
		return "As always, you can see the immense tree at the center of Eden towering in the distance, though you are so far away that the great canopy isn't obscuring the sky above.";
	};

	InitIntro();
	InitNomads();
	InitOutlaws();
	InitRigard();
	InitFarm();
	InitBurrows();
	InitGlade();

	InitMiranda();
	CvetaScenes.INIT(DreamsScenes);

	InitCheats();
}
