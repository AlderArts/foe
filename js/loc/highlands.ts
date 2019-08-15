/*
 *
 * HighlandsLoc area, connects to the mountains and to the dragons' den.
 * Good hunting grounds
 *
 */

import { EncounterTable } from "../encountertable";
import { FelinesScenes } from "../enemy/feline";
import { MaliceScoutsScenes } from "../enemy/malice-scouts";
import { ZebraShamanScenes } from "../enemy/zebra";
import { Event, Link } from "../event";
import { AscheFlags } from "../event/asche-flags";
import { AscheTasksScenes } from "../event/asche-tasks";
import { Isla, IslaScenes } from "../event/highlands/isla";
import { IslaFlags } from "../event/highlands/isla-flags";
import { MomoScenes } from "../event/momo";
import { RoamingScenes } from "../event/roaming";
import { GAME, MoveToLocation, WORLD, WorldTime } from "../GAME";
import { Gui } from "../gui";
import { Text } from "../text";
import { Season } from "../time";

// Create namespace
const HighlandsLoc = {
	Hills         : new Event("Hills"),
	Spring        : new Event("Spring"),
};

//
// Hills, main hunting grounds
//
HighlandsLoc.Hills.description = function() {
	Text.Add("The highlands are a much rougher part of Eden than the rolling plains below. A multitude of small lakes and moors dot the landscape, which looks like it had at some point been crinkled up by a large earthquake. Sheer cliffs make the area difficult to traverse, and if you don’t know where you’re going, you can easily end up having to retrace your steps.");
	Text.NL();
};

HighlandsLoc.Hills.links.push(new Link(
	"Crossroads", true, true,
	null,
	function() {
		MoveToLocation(WORLD().loc.Plains.Crossroads, {hour: 2});
	},
));
HighlandsLoc.Hills.links.push(new Link(
	"Den entrance", true, true,
	null,
	function() {
		MoveToLocation(WORLD().loc.DragonDen.Entry, {minute: 15});
	},
));

HighlandsLoc.Hills.enc = new EncounterTable();

HighlandsLoc.Hills.AddEncounter({
	nameStr : "Puma",
	func() {
		return FelinesScenes.PumaEnc(2);
	}, odds : 0.5, enc : true,
	visible : true, enabled : true, hunt : true,
});

HighlandsLoc.Hills.AddEncounter({
	nameStr : "Lynx",
	func() {
		return FelinesScenes.LynxEnc(2);
	}, odds : 0.5, enc : true,
	visible : true, enabled : true, hunt : true,
});

HighlandsLoc.Hills.AddEncounter({
	nameStr : "Zebra",
	func() {
		return ZebraShamanScenes.LoneEnc();
	}, odds : 1, enc : true,
	visible : true, enabled : true, hunt : true,
});

HighlandsLoc.Hills.AddEncounter({
	nameStr : "Catboy",
	func() {
		return MaliceScoutsScenes.Catboy.LoneEncounter(1);
	}, odds : 1, enc : true,
	visible : true, enabled : true, hunt : true,
});

HighlandsLoc.Hills.AddEncounter({
	nameStr : "Centauress",
	func() {
		return MaliceScoutsScenes.Mare.LoneEncounter(1);
	}, odds : 1, enc : true,
	visible : true, enabled : true, hunt : true,
});

HighlandsLoc.Hills.AddEncounter({
	nameStr : "Goat alchemist",
	func() {
		return MaliceScoutsScenes.Goat.LoneEncounter(1);
	}, odds : 1, enc : true,
	visible : true, enabled : true, hunt : true,
});

HighlandsLoc.Hills.AddEncounter({
	nameStr : "Scouts",
	func() {
		return MaliceScoutsScenes.Group.Encounter();
	}, odds : 1, enc : true,
	visible : true, enabled : true, hunt : true,
});

HighlandsLoc.Hills.enc.AddEnc(function() {
	return MomoScenes.MomoEnc;
}, 1.0, function() { return GAME().momo.Wandering(); });

HighlandsLoc.Hills.enc.AddEnc(function() {
	return RoamingScenes.FlowerPetal;
}, 1.0, function() { return WorldTime().season != Season.Winter; });

HighlandsLoc.Hills.events.push(new Link(
	"Ginseng", function() {
		return GAME().asche.flags.Tasks == AscheFlags.Tasks.Ginseng_Started;
	}, true,
	null,
	function() {
		AscheTasksScenes.Ginseng.Highlands();
	},
));

HighlandsLoc.Hills.events.push(new Link(
	"Spring", function() {
		// TODO Isla's string (put as loc rather than event)
		return AscheTasksScenes.Spring.IsOn() && !AscheTasksScenes.Spring.IsSuccess();
	}, true,
	null,
	function() {
		AscheTasksScenes.Spring.Highlands();
	},
));

HighlandsLoc.Hills.links.push(new Link(
	"Spring", function() {
		return Isla.Available();
	}, true,
	null,
	function() {
		MoveToLocation(HighlandsLoc.Spring, {minute: 10});
	},
));

HighlandsLoc.Spring.onEntry = function() {
	if (GAME().isla.flags.Met < IslaFlags.Met.Met) {
		IslaScenes.Introduction();
	} else {
		Gui.PrintDefaultOptions();
	}
};
HighlandsLoc.Spring.description = function() {
	const parse: any = {};

	Text.Add("You’re standing on the spring plateau. Nestled away against the mountainside with only an obscure, treacherous trail leading upwards from the foot, the place is usually empty save for the few signs of life which mark the fact that Isla’s made her home here, no matter how temporary.");
	Text.NL();
	if (WorldTime().season == Season.Winter) {
		Text.Add("Even in winter, the heat welling up from deep beneath the earth has warmed the soil to the point where the hot spring’s surrounded by a sizeable circle of green. Thickest at the spring’s rim, short blades of grass hold fast against the turning of the seasons, and clumps of tiny white wildflowers bloom from cracks in the rocky ground.");
	} else {
		Text.Add("Over the years, enough soil’s accumulated on the plateau to support some modicum of life - a thin carpet of grass, clumps of colorful mountain wildflowers, the occasional berry shrub. A flock of pigeons has gathered on the mossy stones that stand about the plateau’s rim, and flutter off at your approach.");
	}
	Text.NL();
	parse.dt = WorldTime().LightStr("clear, cloudless sky", "starry night sky");
	Text.Add("The air is crisp and clear this high up, and you’re afforded a great view of the [dt] and surrounding lands - if you squint just right, you think you can see Rigard from here.", parse);
	Text.NL();
	Text.Add("The hot spring itself is a large pool, perhaps twenty yards in diameter and a little over one and a half deep at its middle, to one at its edges. A faint veil of steam constantly rises from the lightly bubbling surface, and it certainly looks inviting, even if not explicitly magical.");
	Text.NL();
	Text.Add("While you can’t see Isla, you can definitely sense her presence. And rightly so, after all - she’s the spring’s guardian, so it’s not as if she’d leave the place for very long.");
	Text.NL();
	Text.Add("Well, what now?");
};

HighlandsLoc.Spring.links.push(new Link(
	"Leave", true, true,
	null,
	function() {
		MoveToLocation(HighlandsLoc.Hills, {minute: 10});
	},
));

HighlandsLoc.Spring.events.push(new Link(
	"Isla", true, true,
	null,
	function() {
		IslaScenes.Approach();
	},
));
HighlandsLoc.Spring.events.push(new Link(
	"Bathe", true, true,
	null,
	function() {
		IslaScenes.Bathe();
	},
));

export { HighlandsLoc };
