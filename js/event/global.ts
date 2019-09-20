import { GAME, GameCache } from "../GAME";
import { DryadGladeFlags } from "../loc/glade-flags";
import { OutlawsFlags } from "./outlaws/outlaws-flags";

export namespace GlobalScenes {

	export function VisitedRigardGates(): boolean {
		return GAME().miranda.Met();
	}

	export function VisitedOutlaws(): boolean {
		return GAME().outlaws.flags.Met >= OutlawsFlags.Met.Met;
	}

	export function MetJeanne(): boolean {
		return GAME().jeanne.flags.Met !== 0;
	}

	export function DefeatedOrchid(): boolean {
		return GAME().glade.flags.Visit >= DryadGladeFlags.Visit.DefeatedOrchid;
	}

	export function PortalsOpen(): boolean {
		return GameCache().flags.Portals !== 0;
	}

	// Learned from Jeanne/Magnus
	export function MagicStage1(): boolean {
		return GameCache().flags.LearnedMagic !== 0;
	}

	// Learned from Jeanne
	export function MagicStage2(): boolean {
		return GameCache().flags.LearnedMagic >= 3;
	}

	export function TreeFarDesc() {
		return "As always, you can see the immense tree at the center of Eden towering in the distance, though you are so far away that the great canopy isn't obscuring the sky above.";
	}

}
