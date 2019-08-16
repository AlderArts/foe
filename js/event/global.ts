import { GAME, GameCache } from "../GAME";
import { DryadGladeFlags } from "../loc/glade-flags";
import { OutlawsFlags } from "./outlaws/outlaws-flags";

const GlobalScenes: any = {};

GlobalScenes.VisitedRigardGates = () => {
	return GAME().miranda.Met();
};

GlobalScenes.VisitedOutlaws = () => {
	return GAME().outlaws.flags.Met >= OutlawsFlags.Met.Met;
};

GlobalScenes.MetJeanne = () => {
	return GAME().jeanne.flags.Met !== 0;
};

GlobalScenes.DefeatedOrchid = () => {
	return GAME().glade.flags.Visit >= DryadGladeFlags.Visit.DefeatedOrchid;
};

GlobalScenes.PortalsOpen = () => {
	return GameCache().flags.Portals !== 0;
};

// Learned from Jeanne/Magnus
GlobalScenes.MagicStage1 = () => {
	return GameCache().flags.LearnedMagic !== 0;
};

// Learned from Jeanne
GlobalScenes.MagicStage2 = () => {
	return GameCache().flags.LearnedMagic >= 3;
};

export { GlobalScenes };
