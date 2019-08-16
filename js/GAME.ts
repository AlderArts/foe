import { Time } from "./time";

let game: any = {};

export function InitGAME() {
    game = {};
}
export function GAME() {
    return game;
}

let gameCache: any = {};

export function SetGameCache(c: any) {
	gameCache = c;
}
export function GameCache() {
	return gameCache;
}

const world: any = {
	// Prototype initialization
	SaveSpots     : {},
};

world.Locations = {
	Plains    : 0,
	Forest    : 1,
	Desert    : 2,
	Highlands : 3,
	Lake      : 4,
};

export function WORLD() {
	return world;
}

let worldTime: any;

export function InitWorldTime(time: any) {
    worldTime = time;
}

export function WorldTime() {
    return worldTime;
}

export function MoveToLocation(location: any, timestep?: any, preventClear?: boolean) {
	const oldLocation = game.party.location;
	game.party.location = location;

	// Step time
	timestep = timestep || new Time();
	TimeStep(timestep);

	location.onEntry(preventClear, oldLocation);
}

// Update function (for internal game time)
export function TimeStep(step: {}) {
	worldTime.Inc(step);

	for (const ent of entityStorage) {
		if (ent.Update) { ent.Update(step); }
	}
}

// Update function (for internal game time)
export function StepToHour(hour: number, minute: number = 0) {
	const step = worldTime.TimeToHour(hour, minute);

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

let cavalcade: any;

export function SetCavalcade(c: any) {
	cavalcade = c;
}

export function GetCavalcade() {
	return cavalcade;
}

const nav: any = {};

export function NAV() {
	return nav;
}
