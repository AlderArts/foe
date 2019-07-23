// World template
import { PlainsLoc } from './loc/plains';
import { LightAspect, DarkAspect } from './event/introduction';
import { KingsRoadLoc } from './loc/kingsroad';
import { HighlandsLoc } from './loc/highlands';
import { LakeLoc } from './loc/lake';
import { OutlawsLoc } from './loc/outlaws';
import { ForestLoc } from './loc/forest';
import { DragonDenLoc } from './loc/dragonden';
import { FarmLoc, InitFarm } from './loc/farm';
import { DesertLoc } from './loc/desert';
import { BurrowsLoc, InitBurrows } from './loc/burrows';
import { TreeCityLoc } from './loc/treecity/treecity';
import { RigardLoc, InitRigard } from './loc/rigard/rigard';
import { Scenes } from './scenes';
import { InitGlade } from './loc/glade';
import { InitNomads } from './loc/nomads';

let world = {
	// Prototype initialization
	loc           : {
		Plains : PlainsLoc,
		Farm : FarmLoc,
		Burrows : BurrowsLoc,
		Forest : ForestLoc,
		Desert : DesertLoc,
		KingsRoad : KingsRoadLoc,
		Highlands : HighlandsLoc,
		Lake : LakeLoc,
		Outlaws : OutlawsLoc,
		Rigard : RigardLoc,

		DragonDen : DragonDenLoc,
		TreeCity : TreeCityLoc,

		DarkAspect : DarkAspect,
		LightAspect : LightAspect,
	},
	EntityStorage : new Array(),
	SaveSpots     : {},
};

IntroInit(world);
InitNomads(world);
InitRigard(world, Scenes);
InitFarm(world);
InitBurrows(world);
InitGlade(world);

world.Locations = {
	Plains    : 0,
	Forest    : 1,
	Desert    : 2,
	Highlands : 3,
	Lake      : 4
};

world.CurrentLocation = function(loc) {
	loc = loc || party.location;
	
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

// Update function (for animations and transitions)
world.Update = function(frametime) {
	/*
	var xDir = 0;
	var yDir = 0;
	
	if(Input.keyinput[LEFT_ARROW])  xDir--;
	if(Input.keyinput[RIGHT_ARROW]) xDir++;
	if(Input.keyinput[UP_ARROW])    yDir--;
	if(Input.keyinput[DOWN_ARROW])  yDir++;
	
	this.x += xDir * frametime * 200;
	this.y += yDir * frametime * 200;
	*/
}

// Update function (for internal game time)
world.TimeStep = function(step) {
	this.time.Inc(step);
	
	for(var i = 0; i < this.EntityStorage.length; i++)
		if(this.EntityStorage[i].Update) this.EntityStorage[i].Update(step);
}

// Update function (for internal game time)
world.StepToHour = function(hour, minute) {
	var step = world.time.TimeToHour(hour, minute);
	
	world.TimeStep(step);

	return step;
}

//TODO
world.TreeFarDesc = function() {
	return "As always, you can see the immense tree at the center of Eden towering in the distance, though you are so far away that the great canopy isn't obscuring the sky above.";
}

export { world };
