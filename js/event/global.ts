import { GameCache, GAME } from "../GAME";
import { OutlawsFlags } from "./outlaws/outlaws-flags";
import { DryadGladeFlags } from "../loc/glade-flags";

let GlobalScenes : any = {};

GlobalScenes.VisitedRigardGates = function() {
	return GAME().miranda.Met();
}

GlobalScenes.VisitedOutlaws = function() {
	return GAME().outlaws.flags["Met"] >= OutlawsFlags.Met.Met;
}

GlobalScenes.MetJeanne = function() {
	return GAME().jeanne.flags["Met"] != 0;
}

GlobalScenes.DefeatedOrchid = function() {
	return GAME().glade.flags["Visit"] >= DryadGladeFlags.Visit.DefeatedOrchid;
}

GlobalScenes.PortalsOpen = function() {
	return GameCache().flags["Portals"] != 0;
}

// Learned from Jeanne/Magnus
GlobalScenes.MagicStage1 = function() {
	return GameCache().flags["LearnedMagic"] != 0;
}

// Learned from Jeanne
GlobalScenes.MagicStage2 = function() {
	return GameCache().flags["LearnedMagic"] >= 3;
}

export { GlobalScenes };
