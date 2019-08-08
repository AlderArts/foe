import { Time } from "./time";

let game : any = {};

export function InitGAME() {
    game = {};
}
export function GAME() {
    return game;
}

let gameCache : any = {};

export function SetGameCache(c : any) {
	gameCache = c;
}
export function GameCache() {
	return gameCache;
}

let world : any = {
	// Prototype initialization
	SaveSpots     : {},
};

world.Locations = {
	Plains    : 0,
	Forest    : 1,
	Desert    : 2,
	Highlands : 3,
	Lake      : 4
};

export function WORLD() {
	return world;
}

let worldTime : any = null;

export function InitWorldTime(time : any) {
    worldTime = time;
}

export function WorldTime() {
    return worldTime;
}

export function MoveToLocation(location : any, timestep? : any, preventClear? : boolean) {
	var oldLocation = game.party.location;
	game.party.location = location;

	// Step time
	timestep = timestep || new Time();
	TimeStep(timestep);

	location.onEntry(preventClear, oldLocation);
}

// Update function (for internal game time)
export function TimeStep(step : {}) {
	worldTime.Inc(step);
	
	for(let ent of entityStorage)
		if(ent.Update) ent.Update(step);
}

// Update function (for internal game time)
export function StepToHour(hour : number, minute : number) {
	let step = worldTime.TimeToHour(hour, minute);
	
	TimeStep(step);

	return step;
}

let entityStorage = new Array();

export function EntityStorage() {
    return entityStorage;
}

export function InitEntityStorage() {
    entityStorage = new Array();
}
