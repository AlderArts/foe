/*
 * 
 * Highlands area, connects to the mountains and to the dragons' den.
 * Good hunting grounds
 * 
 */

import { world } from '../world';
import { Event, Link, EncounterTable, Scenes } from '../event';

// Create namespace
world.loc.Highlands = {
	Hills         : new Event("Hills"),
	Spring        : new Event("Spring")
}

//
// Hills, main hunting grounds
//
world.loc.Highlands.Hills.description = function() {
	Text.Add("The highlands are a much rougher part of Eden than the rolling plains below. A multitude of small lakes and moors dot the landscape, which looks like it had at some point been crinkled up by a large earthquake. Sheer cliffs make the area difficult to traverse, and if you don’t know where you’re going, you can easily end up having to retrace your steps.");
	Text.NL();
}

world.loc.Highlands.Hills.links.push(new Link(
	"Crossroads", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {hour: 2});
	}
));
world.loc.Highlands.Hills.links.push(new Link(
	"Den entrance", true, true,
	null,
	function() {
		MoveToLocation(world.loc.DragonDen.Entry, {minute: 15});
	}
));

world.loc.Highlands.Hills.enc = new EncounterTable();

world.loc.Highlands.Hills.AddEncounter({
	nameStr : "Puma",
	func    : function() {
		return Scenes.Felines.PumaEnc(2);
	}, odds : 0.5, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.Highlands.Hills.AddEncounter({
	nameStr : "Lynx",
	func    : function() {
		return Scenes.Felines.LynxEnc(2);
	}, odds : 0.5, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.Highlands.Hills.AddEncounter({
	nameStr : "Zebra",
	func    : function() {
		return Scenes.ZebraShaman.LoneEnc();
	}, odds : 1, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.Highlands.Hills.AddEncounter({
	nameStr : "Catboy",
	func    : function() {
		return Scenes.MaliceScouts.Catboy.LoneEncounter(1);
	}, odds : 1, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.Highlands.Hills.AddEncounter({
	nameStr : "Centauress",
	func    : function() {
		return Scenes.MaliceScouts.Mare.LoneEncounter(1);
	}, odds : 1, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.Highlands.Hills.AddEncounter({
	nameStr : "Goat alchemist",
	func    : function() {
		return Scenes.MaliceScouts.Goat.LoneEncounter(1);
	}, odds : 1, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.Highlands.Hills.AddEncounter({
	nameStr : "Scouts",
	func    : function() {
		return Scenes.MaliceScouts.Group.Encounter();
	}, odds : 1, enc : true,
	visible : true, enabled : true, hunt : true
});

world.loc.Highlands.Hills.enc.AddEnc(function() {
	return Scenes.Momo.MomoEnc;
}, 1.0, function() { return momo.Wandering(); });

world.loc.Highlands.Hills.enc.AddEnc(function() {
	return Scenes.Roaming.FlowerPetal;
}, 1.0, function() { return world.time.season != Season.Winter; });

world.loc.Highlands.Hills.events.push(new Link(
	"Ginseng", function() {
		return asche.flags["Tasks"] == Asche.Tasks.Ginseng_Started;
	}, true,
	null,
	function() {
		Scenes.Asche.Tasks.Ginseng.Highlands();
	}
));

world.loc.Highlands.Hills.events.push(new Link(
	"Spring", function() {
		//TODO Isla's string (put as loc rather than event)
		return Scenes.Asche.Tasks.Spring.IsOn() && !Scenes.Asche.Tasks.Spring.IsSuccess();
	}, true,
	null,
	function() {
		Scenes.Asche.Tasks.Spring.Highlands();
	}
));

world.loc.Highlands.Hills.links.push(new Link(
	"Spring", function() {
		return Isla.Available();
	}, true,
	null,
	function() {
		MoveToLocation(world.loc.Highlands.Spring, {minute: 10});
	}
));


world.loc.Highlands.Spring.onEntry = function() {
	if(isla.flags["Met"] < Isla.Met.Met)
		Scenes.Isla.Introduction();
	else
		PrintDefaultOptions();
}
world.loc.Highlands.Spring.description = function() {
	var parse = {};
	
	Text.Add("You’re standing on the spring plateau. Nestled away against the mountainside with only an obscure, treacherous trail leading upwards from the foot, the place is usually empty save for the few signs of life which mark the fact that Isla’s made her home here, no matter how temporary.");
	Text.NL();
	if(world.time.season == Season.Winter)
		Text.Add("Even in winter, the heat welling up from deep beneath the earth has warmed the soil to the point where the hot spring’s surrounded by a sizeable circle of green. Thickest at the spring’s rim, short blades of grass hold fast against the turning of the seasons, and clumps of tiny white wildflowers bloom from cracks in the rocky ground.");
	else
		Text.Add("Over the years, enough soil’s accumulated on the plateau to support some modicum of life - a thin carpet of grass, clumps of colorful mountain wildflowers, the occasional berry shrub. A flock of pigeons has gathered on the mossy stones that stand about the plateau’s rim, and flutter off at your approach.");
	Text.NL();
	parse["dt"] = world.time.LightStr("clear, cloudless sky", "starry night sky");
	Text.Add("The air is crisp and clear this high up, and you’re afforded a great view of the [dt] and surrounding lands - if you squint just right, you think you can see Rigard from here.", parse);
	Text.NL();
	Text.Add("The hot spring itself is a large pool, perhaps twenty yards in diameter and a little over one and a half deep at its middle, to one at its edges. A faint veil of steam constantly rises from the lightly bubbling surface, and it certainly looks inviting, even if not explicitly magical.");
	Text.NL();
	Text.Add("While you can’t see Isla, you can definitely sense her presence. And rightly so, after all - she’s the spring’s guardian, so it’s not as if she’d leave the place for very long.");
	Text.NL();
	Text.Add("Well, what now?");
}

world.loc.Highlands.Spring.links.push(new Link(
	"Leave", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Highlands.Hills, {minute: 10});
	}
));

world.loc.Highlands.Spring.events.push(new Link(
	"Isla", true, true,
	null,
	function() {
		Scenes.Isla.Approach();
	}
));
world.loc.Highlands.Spring.events.push(new Link(
	"Bathe", true, true,
	null,
	function() {
		Scenes.Isla.Bathe();
	}
));
