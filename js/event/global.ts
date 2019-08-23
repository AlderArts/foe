import { GAME, GameCache } from "../GAME";
import { DryadGladeFlags } from "../loc/glade-flags";
import { OutlawsFlags } from "./outlaws/outlaws-flags";

export namespace GlobalScenes {

	export function VisitedRigardGates() {
		return GAME().miranda.Met();
	}

	export function VisitedOutlaws() {
		return GAME().outlaws.flags.Met >= OutlawsFlags.Met.Met;
	}

	export function MetJeanne() {
		return GAME().jeanne.flags.Met !== 0;
	}

	export function DefeatedOrchid() {
		return GAME().glade.flags.Visit >= DryadGladeFlags.Visit.DefeatedOrchid;
	}

	export function PortalsOpen() {
		return GameCache().flags.Portals !== 0;
	}

	// Learned from Jeanne/Magnus
	export function MagicStage1() {
		return GameCache().flags.LearnedMagic !== 0;
	}

	// Learned from Jeanne
	export function MagicStage2() {
		return GameCache().flags.LearnedMagic >= 3;
	}

}
