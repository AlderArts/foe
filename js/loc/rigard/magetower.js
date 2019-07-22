

import { world } from '../../world';
import { Event, Link } from '../../event';

//
// Castle: Mage tower
//
let MageTowerLoc = new Event("Mage's tower");

world.SaveSpots["Jeanne"] = MageTowerLoc;
MageTowerLoc.SaveSpot = "Jeanne";
MageTowerLoc.safe = function() { return true; };
MageTowerLoc.description = function() {
	Text.Add("You are standing on the top floor of Jeanne’s tower, inside the court mage’s study.");
	Text.NL();
}

MageTowerLoc.links.push(new Link(
	"Grounds", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Castle.Grounds);
	}
));
MageTowerLoc.events.push(new Link(
	"Jeanne", function() { return jeanne.IsAtLocation(MageTowerLoc); }, true,
	function() {
		if(jeanne.IsAtLocation(MageTowerLoc)) {
			Text.Add("The sleepless magician is busy with some experiment or other, poring over some documents over by her workbench. The elf is stunning as always, her long pink hair flowing down her back in thick curls.");
			Text.NL();
		}
	},
	function() {
		Scenes.Jeanne.Interact();
	}
));
MageTowerLoc.events.push(new Link(
	"Golem", function() { return golem.flags["Met"] >= Scenes.Golem.State.Rebuilt; }, true,
	function() {
		if(golem.flags["Met"] >= Scenes.Golem.State.Rebuilt) {
			Text.Add("The obsidian golem is standing near the wall, silent and unmoving.");
			Text.NL();
		}
	},
	function() {
		//TODO
	}
));
MageTowerLoc.endDescription = function() {
	Text.Add("Around the room, there are a lot of strange devices and alchemical tools strewn about, many of which you have no idea what their uses are.");
	Text.NL();
	Text.Add("The strange light that can be seen from outside the tower originates from a set of crystals mounted in an intricate lattice of metal, standing on one of the tables. The crystals glow with an inner ethereal light, pulsing irregularly, almost as if they are alive.");
	Text.Flush();
}

MageTowerLoc.onEntry = function() {
	var golemState = golem.flags["Met"];
	if(golemState == Scenes.Golem.State.NotMet)
		Scenes.Golem.FirstApproach();
	else if(golemState < Scenes.Golem.State.Won_noLoss)
		Scenes.Golem.RepeatApproach();
	else
		PrintDefaultOptions();
}

export { MageTowerLoc };
