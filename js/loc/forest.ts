/*
 *
 * Forest
 *
 */

import { EncounterTable } from "../encountertable";
import { FeralWolfScenes } from "../enemy/feralwolf";
import { MothgirlScenes } from "../enemy/mothgirl";
import { Event, Link } from "../event";
import { AscheTasksScenes } from "../event/asche-tasks";
import { GlobalScenes } from "../event/global";
import { MomoScenes } from "../event/momo";
import { AquiliusScenes } from "../event/outlaws/aquilius";
import { MariaScenes } from "../event/outlaws/maria-scenes";
import { RoamingScenes } from "../event/roaming";
import { GAME, MoveToLocation, TimeStep, WORLD, WorldTime } from "../GAME";
import { Gui } from "../gui";
import { IngredientItems } from "../items/ingredients";
import { QuestItems } from "../items/quest";
import { Party } from "../party";
import { Text } from "../text";
import { Season } from "../time";
import { BurrowsFlags } from "./burrows-flags";
import { GladeLoc } from "./glade";

// Create namespace
const ForestLoc = {
	Outskirts         : new Event("Forest outskirts"),
	Glade             : GladeLoc,
};

//
// Forest
//

ForestLoc.Outskirts.description = () => {
	Text.Add("You are at the outskirts of a deep forest. With trees and stuff.<br>");
};

ForestLoc.Outskirts.enc = new EncounterTable();
ForestLoc.Outskirts.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;
		Text.Clear();

		Text.Add("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up a particularly fresh bundle of grass. Who knows, could be useful for something.");
		Text.NL();
		Text.Add("You pick up some fresh grass.", null, "bold");
		Text.Flush();
		party.inventory.AddItem(IngredientItems.FreshGrass);

		TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, () => WorldTime().season !== Season.Winter);
ForestLoc.Outskirts.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;
		Text.Clear();

		Text.Add("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up a pretty flower. Who knows, could be useful for something.");
		Text.NL();
		Text.Add("You pick up a Foxglove.", null, "bold");
		Text.Flush();
		party.inventory.AddItem(IngredientItems.Foxglove);

		TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, () => WorldTime().season !== Season.Winter);
ForestLoc.Outskirts.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;
		Text.Clear();

		Text.Add("As you trek through the undergrowth of the deep forest, you come across a cluster of small bushes with red berries. Seeing as nothing is trying to kill you at the moment, you spend some time gathering them, figuring they could be of some use.");
		Text.NL();
		Text.Add("You pick some fox berries.", null, "bold");
		Text.Flush();
		party.inventory.AddItem(IngredientItems.FoxBerries);

		TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, () => WorldTime().season !== Season.Winter);
ForestLoc.Outskirts.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;
		Text.Clear();

		Text.Add("Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up an odd root. Who knows, could be useful for something.");
		Text.NL();
		Text.Add("You pick up a Canis root.", null, "bold");
		Text.Flush();
		party.inventory.AddItem(IngredientItems.CanisRoot);

		TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, () => WorldTime().season !== Season.Winter);
ForestLoc.Outskirts.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;
		Text.Clear();

		Text.Add("While wandering the forest, you come across a small spring filled with clear water. Figuring you might as well get some in case you grow thirsty, you pick out a vial from your pack.");
		Text.NL();
		Text.Add("You fill a vial with pure spring water.", null, "bold");
		Text.Flush();
		party.inventory.AddItem(IngredientItems.SpringWater);

		TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, () => true);
ForestLoc.Outskirts.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;
		const parse: any = {

		};
		Text.Clear();
		Text.Add("Something catches your eye as you plod along through the undergrowth: a piece of particularly tough tree bark. It doesn’t seem to belong to any of the trees around you; someone or something must have brought it here. You give it a rap with your knuckle. The thing seems pretty resilient… maybe it has some alchemical properties?", parse);
		Text.NL();
		Text.Add("<b>Picked up some tree bark.</b>", parse);
		Text.Flush();

		party.inventory.AddItem(IngredientItems.TreeBark);

		TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, () => true);
ForestLoc.Outskirts.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;
		const parse: any = {

		};
		Text.Clear();
		Text.Add("As you walk through the forest, you find a small broken piece of a deer antler, perhaps left there in a clash between two battling studs. Well, they won’t be needing it anymore, and perhaps you can find some use for it...", parse);
		Text.NL();
		Text.Add("<b>Picked up part of a deer antler.</b>", parse);
		Text.Flush();

		party.inventory.AddItem(IngredientItems.AntlerChip);

		TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, () => true);
ForestLoc.Outskirts.enc.AddEnc(() => {
	return RoamingScenes.FlowerPetal;
}, 1.0, () => WorldTime().season !== Season.Winter);

// Add initial Maria event, only trigger 6-20
ForestLoc.Outskirts.enc.AddEnc(
	() => {
		return MariaScenes.ForestMeeting;
	}, 3.0, () => {
		return GlobalScenes.VisitedRigardGates() &&
		       !GlobalScenes.VisitedOutlaws() &&
		       (WorldTime().hour >= 6 && WorldTime().hour < 20);
	},
);

// Temp mothgirl enemy
ForestLoc.Outskirts.AddEncounter({
	nameStr : "Mothgirl",
	func() {
		return MothgirlScenes.LoneEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true,
});

ForestLoc.Outskirts.AddEncounter({
	nameStr : "Wolf",
	func() {
		return FeralWolfScenes.LoneEnc();
	}, odds : 1.0, enc : true,
	visible : true, enabled : true, hunt : true,
});

ForestLoc.Outskirts.enc.AddEnc(() => {
	return MomoScenes.MomoEnc;
}, 1.0, () => GAME().momo.Wandering());

ForestLoc.Outskirts.enc.AddEnc(() => {
	return RoamingScenes.FindSomeCoins;
}, 0.5, () => true);

ForestLoc.Outskirts.enc.AddEnc(() => {
	return () => {
		const burrows = GAME().burrows;
		const party: Party = GAME().party;
		const parse: any = {

		};

		Text.Clear();
		Text.Add("You find the remains of some large insect; an immense whitened husk, mostly deteriorated by the passage of time. From what you see, you wouldn’t want to meet a live one face to face. Though its lower body is a mess of chitin and a multitude of legs, the shriveled torso looks oddly human. You’d never mistake the face for that of a human, however.", parse);
		Text.NL();
		Text.Add("Shuddering, you pocket a small part of the chitin that still looks usable.", parse);
		Text.NL();
		Text.Add("<b>Received a Gol husk!</b>", parse);
		Text.Flush();

		party.Inv().AddItem(QuestItems.GolHusk);

		if (party.Inv().QueryNum(QuestItems.GolHusk) >= 3) {
			burrows.flags.HermTrait = BurrowsFlags.TraitFlags.Gathered;
			Text.NL();
			Text.Add("You think you've gathered enough of these for now, you should return them to Ophelia.", parse);
		}
		Text.Flush();

		TimeStep({minute: 15});

		Gui.NextPrompt();
	};
}, 4.0, () => {
	const burrows = GAME().burrows;
	return burrows.Access() && burrows.flags.HermTrait === BurrowsFlags.TraitFlags.Inactive;
});

ForestLoc.Outskirts.links.push(new Link(
	"Crossroads", true, true,
	() => {
		Text.Add("Behind you is the way back to the crossroads.<br>");
	},
	() => {
		MoveToLocation(WORLD().loc.Plains.Crossroads, {hour: 2});
	},
));
ForestLoc.Outskirts.links.push(new Link(
	"Outlaws", () => GlobalScenes.VisitedOutlaws(), true,
	null,
	() => {
		MoveToLocation(WORLD().loc.Outlaws.Camp, {hour: 1});
	},
));
ForestLoc.Outskirts.links.push(new Link(
	"Glade", () => {
		const jeanne = GAME().jeanne;
		return jeanne.flags.Met >= 1;
	}, true,
	null,
	() => {
		MoveToLocation(ForestLoc.Glade, {minute: 15});
	},
));

ForestLoc.Outskirts.events.push(new Link(
	"Herbs", () => {
		const aquilius = GAME().aquilius;
		return aquilius.OnHerbsQuest() && !aquilius.OnHerbsQuestFinished();
	}, true,
	null,
	() => {
		AquiliusScenes.PickHerbs();
	},
));
ForestLoc.Outskirts.events.push(new Link(
	"Nightshade", () => AscheTasksScenes.Nightshade.IsOn() && !AscheTasksScenes.Nightshade.IsSuccess(), true,
	null,
	() => {
		if (AscheTasksScenes.Nightshade.HasHelpFromAquilius()) {
			AscheTasksScenes.Nightshade.FollowAquilius();
		} else {
			AscheTasksScenes.Nightshade.BlindStart();
		}
	},
));

export { ForestLoc };
