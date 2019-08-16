
import { Event, Link } from "../../event";
import { GolemScenes } from "../../event/royals/golem";
import { GolemFlags } from "../../event/royals/golem-flags";
import { JeanneScenes } from "../../event/royals/jeanne-scenes";
import { GAME, MoveToLocation, WORLD } from "../../GAME";
import { Gui } from "../../gui";
import { Text } from "../../text";

export function InitMageTower() {
	WORLD().SaveSpots.Jeanne = MageTowerLoc;
}

//
// Castle: Mage tower
//
const MageTowerLoc = new Event("Mage's tower");

MageTowerLoc.SaveSpot = "Jeanne";
MageTowerLoc.safe = () => true;
MageTowerLoc.description = () => {
	Text.Add("You are standing on the top floor of Jeanne’s tower, inside the court mage’s study.");
	Text.NL();
};

MageTowerLoc.links.push(new Link(
	"Grounds", true, true,
	undefined,
	() => {
		MoveToLocation(WORLD().loc.Rigard.Castle.Grounds);
	},
));
MageTowerLoc.events.push(new Link(
	"Jeanne", () => {
		const jeanne = GAME().jeanne;
		return jeanne.IsAtLocation(MageTowerLoc);
	}, true,
	() => {
		const jeanne = GAME().jeanne;
		if (jeanne.IsAtLocation(MageTowerLoc)) {
			Text.Add("The sleepless magician is busy with some experiment or other, poring over some documents over by her workbench. The elf is stunning as always, her long pink hair flowing down her back in thick curls.");
			Text.NL();
		}
	},
	() => {
		JeanneScenes.Interact();
	},
));
MageTowerLoc.events.push(new Link(
	"Golem", () => {
		const golem = GAME().golem;
		return golem.flags.Met >= GolemFlags.State.Rebuilt;
	}, true,
	() => {
		const golem = GAME().golem;
		if (golem.flags.Met >= GolemFlags.State.Rebuilt) {
			Text.Add("The obsidian golem is standing near the wall, silent and unmoving.");
			Text.NL();
		}
	},
	() => {
		// TODO
	},
));
MageTowerLoc.endDescription = () => {
	Text.Add("Around the room, there are a lot of strange devices and alchemical tools strewn about, many of which you have no idea what their uses are.");
	Text.NL();
	Text.Add("The strange light that can be seen from outside the tower originates from a set of crystals mounted in an intricate lattice of metal, standing on one of the tables. The crystals glow with an inner ethereal light, pulsing irregularly, almost as if they are alive.");
	Text.Flush();
};

MageTowerLoc.onEntry = () => {
	const golem = GAME().golem;
	const golemState = golem.flags.Met;
	if (golemState === GolemFlags.State.NotMet) {
		GolemScenes.FirstApproach();
	} else if (golemState < GolemFlags.State.Won_noLoss) {
		GolemScenes.RepeatApproach();
 	} else {
		Gui.PrintDefaultOptions();
 	}
};

export { MageTowerLoc };
