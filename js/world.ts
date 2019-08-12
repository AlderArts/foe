// World template
import { PlainsLoc } from './loc/plains';
import { InitIntro, LightAspect, DarkAspect } from './event/introduction';
import { KingsRoadLoc } from './loc/kingsroad';
import { HighlandsLoc } from './loc/highlands';
import { LakeLoc } from './loc/lake';
import { OutlawsLoc, InitOutlaws } from './loc/outlaws';
import { ForestLoc } from './loc/forest';
import { DragonDenLoc } from './loc/dragonden';
import { FarmLoc, InitFarm } from './loc/farm-scenes';
import { DesertLoc } from './loc/desert';
import { BurrowsLoc, InitBurrows } from './loc/burrows-scenes';
import { TreeCityLoc } from './loc/treecity/treecity';
import { InitRigard } from './loc/rigard/rigard';
import { InitGlade } from './loc/glade';
import { InitNomads } from './loc/nomads';
import { InitMiranda } from './event/miranda-scenes';
import { BullTowerLoc } from './event/outlaws/bulltower';
import { InitCheats } from './cheats';
import { GAME, WORLD } from './GAME';
import { RigardLoc } from './loc/rigard/rigard-scenes';
import { CvetaScenes } from './event/outlaws/cveta-scenes';
import { DreamsScenes } from './event/dreams';

export function InitWorld() {
	let world = WORLD(); 
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
	
		DarkAspect : DarkAspect,
		LightAspect : LightAspect,
	};
	
	world.CurrentLocation = function(loc? : any) {
		loc = loc || GAME().party.location;
		
		if     (loc == PlainsLoc.Crossroads)
			return world.Locations.Plains;
		else if(loc == ForestLoc.Outskirts)
			return world.Locations.Forest;
		else if(loc == DesertLoc.Drylands)
			return world.Locations.Desert;
		else if(loc == HighlandsLoc.Hills)
			return world.Locations.Highlands;
		else if(loc == LakeLoc.Shore)
			return world.Locations.Lake;
		
		return -1;
	}
	
	//TODO
	world.TreeFarDesc = function() {
		return "As always, you can see the immense tree at the center of Eden towering in the distance, though you are so far away that the great canopy isn't obscuring the sky above.";
	}
	
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
