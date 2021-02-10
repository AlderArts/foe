// World template
import { InitCheats } from "../../cheats";
import { DreamsScenes } from "../../content/event/dreams";
import { DarkAspect, Intro, LightAspect } from "../../content/event/introduction";
import { BullTowerLoc } from "../../content/event/outlaws/bulltower";
import { CvetaScenes } from "../../content/event/outlaws/cveta-scenes";
import { MirandaScenes } from "../../content/event/rigard/miranda-scenes";
import { BurrowsLoc, InitBurrows } from "../../content/loc/burrows-scenes";
import { DesertLoc } from "../../content/loc/desert";
import { DragonDenLoc } from "../../content/loc/dragonden";
import { FarmLoc, InitFarm } from "../../content/loc/farm-scenes";
import { ForestLoc } from "../../content/loc/forest";
import { InitGlade } from "../../content/loc/glade";
import { HighlandsLoc } from "../../content/loc/highlands";
import { KingsRoadLoc } from "../../content/loc/kingsroad";
import { LakeLoc } from "../../content/loc/lake";
import { InitNomads } from "../../content/loc/nomads";
import { InitOutlaws, OutlawsLoc } from "../../content/loc/outlaws";
import { PlainsLoc } from "../../content/loc/plains";
import { InitRigard } from "../../content/loc/rigard/rigard";
import { RigardLoc } from "../../content/loc/rigard/rigard-scenes";
import { TreeCityLoc } from "../../content/loc/treecity/treecity";
import { GAME, WORLD } from "../GAME";
import { ILocation, Locations } from "./location";

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

	world.CurrentLocation = (loc?: ILocation) => {
		loc = loc || GAME().party.location;

		if     (loc === PlainsLoc.Crossroads) {
			return Locations.Plains;
		} else if (loc === ForestLoc.Outskirts) {
			return Locations.Forest;
 		} else if (loc === DesertLoc.Drylands) {
			return Locations.Desert;
		} else if (loc === HighlandsLoc.Hills) {
			return Locations.Highlands;
 		} else if (loc === LakeLoc.Shore) {
			return Locations.Lake;
 		}

		return -1;
	};

	Intro.INIT();
	InitNomads();
	InitOutlaws();
	InitRigard();
	InitFarm();
	InitBurrows();
	InitGlade();

	MirandaScenes.INIT();
	CvetaScenes.INIT(DreamsScenes);

	InitCheats();
}
