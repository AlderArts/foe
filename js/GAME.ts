import { IWorld } from "./location";
import { ITime, Time } from "./time";

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

const world: IWorld = {
	// Prototype initialization
	SaveSpots     : {},
};

export function WORLD() {
	return world;
}

let worldTime: Time;

export function InitWorldTime(time: Time) {
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
export function TimeStep(step: ITime) {
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
