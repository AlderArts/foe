/*
 *
 * Forest
 *
 */

import { GAME, MoveToLocation, TimeStep, WORLD, WorldTime } from "../../../../engine/GAME";
import { IngredientItems } from "../../../../engine/inventory/items/ingredients";
import { QuestItems } from "../../../../engine/inventory/items/quest";
import { EncounterTable } from "../../../../engine/navigation/encountertable";
import { Event } from "../../../../engine/navigation/event";
import { Link } from "../../../../engine/navigation/link";
import { ILocForest } from "../../../../engine/navigation/location";
import { Party } from "../../../../engine/navigation/party";
import { Season } from "../../../../engine/navigation/time";
import { Text } from "../../../../engine/parser/text";
import { Gui } from "../../../../gui/gui";
import { FeralWolfScenes } from "../../../enemy/feralwolf";
import { MothgirlScenes } from "../../../enemy/mothgirl";
import { GlobalScenes } from "../../../event/global";
import { MomoScenes } from "../../../event/momo";
import { Aquilius, AquiliusScenes } from "../../../event/outlaws/aquilius";
import { MariaScenes } from "../../../event/outlaws/maria-scenes";
import { AscheTasksScenes } from "../../../event/rigard/asche-tasks";
import { RoamingScenes } from "../../../event/roaming";
import { Jeanne } from "../../../event/royals/jeanne";
import { Burrows } from "../plains/burrows";
import { BurrowsFlags } from "../plains/burrows-flags";
import { GladeLoc } from "./glade";

// Create namespace
const ForestLoc: ILocForest = {
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

		Text.Out(`Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up a particularly fresh bundle of grass. Who knows, could be useful for something.

		<b>You pick up some fresh grass.</b>`);
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

		Text.Out(`Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up a pretty flower. Who knows, could be useful for something.

		<b>You pick up a Foxglove.</b>`);
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

		Text.Out(`As you trek through the undergrowth of the deep forest, you come across a cluster of small bushes with red berries. Seeing as nothing is trying to kill you at the moment, you spend some time gathering them, figuring they could be of some use.

		<b>You pick some fox berries.</b>`);
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
		Text.Out(`Not having much else to do, you wander the outskirts of the forest for a few minutes. You pick up an odd root. Who knows, could be useful for something.

		<b>You pick up a Canis root.</b>`);
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

		Text.Out(`While wandering the forest, you come across a small spring filled with clear water. Figuring you might as well get some in case you grow thirsty, you pick out a vial from your pack.

		<b>You fill a vial with pure spring water.</b>`);
		Text.Flush();
		party.inventory.AddItem(IngredientItems.SpringWater);

		TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, () => true);
ForestLoc.Outskirts.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;
		Text.Clear();
		Text.Out(`Something catches your eye as you plod along through the undergrowth: a piece of particularly tough tree bark. It doesn’t seem to belong to any of the trees around you; someone or something must have brought it here. You give it a rap with your knuckle. The thing seems pretty resilient… maybe it has some alchemical properties?

		<b>Picked up some tree bark.</b>`);
		Text.Flush();

		party.inventory.AddItem(IngredientItems.TreeBark);

		TimeStep({minute: 15});
		Gui.NextPrompt();
	};
}, 1.0, () => true);
ForestLoc.Outskirts.enc.AddEnc(() => {
	return () => {
		const party: Party = GAME().party;

		Text.Clear();
		Text.Out(`As you walk through the forest, you find a small broken piece of a deer antler, perhaps left there in a clash between two battling studs. Well, they won’t be needing it anymore, and perhaps you can find some use for it...

		<b>Picked up part of a deer antler.</b>`);
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
		const burrows: Burrows = GAME().burrows;
		const party: Party = GAME().party;

		Text.Clear();
		Text.Out(`You find the remains of some large insect; an immense whitened husk, mostly deteriorated by the passage of time. From what you see, you wouldn’t want to meet a live one face to face. Though its lower body is a mess of chitin and a multitude of legs, the shriveled torso looks oddly human. You’d never mistake the face for that of a human, however.

		Shuddering, you pocket a small part of the chitin that still looks usable.

		<b>Received a Gol husk!</b>`);

		party.Inv().AddItem(QuestItems.GolHusk);

		if (party.Inv().QueryNum(QuestItems.GolHusk) >= 3) {
			burrows.flags.HermTrait = BurrowsFlags.TraitFlags.Gathered;
			Text.NL();
			Text.Out(`You think you've gathered enough of these for now, you should return them to Ophelia.`);
		}
		Text.Flush();

		TimeStep({minute: 15});

		Gui.NextPrompt();
	};
}, 4.0, () => {
	const burrows: Burrows = GAME().burrows;
	return burrows.Access() && burrows.flags.HermTrait === BurrowsFlags.TraitFlags.Inactive;
});

ForestLoc.Outskirts.links.push(new Link(
	"Crossroads", true, true,
	() => {
		Text.Out(`Behind you is the way back to the crossroads.<br>`);
	},
	() => {
		MoveToLocation(WORLD().loc.Plains.Crossroads, {hour: 2});
	},
));
ForestLoc.Outskirts.links.push(new Link(
	"Outlaws", () => GlobalScenes.VisitedOutlaws(), true,
	undefined,
	() => {
		MoveToLocation(WORLD().loc.Outlaws.Camp, {hour: 1});
	},
));
ForestLoc.Outskirts.links.push(new Link(
	"Glade", () => {
		const jeanne: Jeanne = GAME().jeanne;
		return jeanne.flags.Met >= 1;
	}, true,
	undefined,
	() => {
		MoveToLocation(ForestLoc.Glade, {minute: 15});
	},
));

ForestLoc.Outskirts.events.push(new Link(
	"Herbs", () => {
		const aquilius: Aquilius = GAME().aquilius;
		return aquilius.OnHerbsQuest() && !aquilius.OnHerbsQuestFinished();
	}, true,
	undefined,
	() => {
		AquiliusScenes.PickHerbs();
	},
));
ForestLoc.Outskirts.events.push(new Link(
	"Nightshade", () => AscheTasksScenes.Nightshade.IsOn() && !AscheTasksScenes.Nightshade.IsSuccess(), true,
	undefined,
	() => {
		if (AscheTasksScenes.Nightshade.HasHelpFromAquilius()) {
			AscheTasksScenes.Nightshade.FollowAquilius();
		} else {
			AscheTasksScenes.Nightshade.BlindStart();
		}
	},
));

export { ForestLoc };
