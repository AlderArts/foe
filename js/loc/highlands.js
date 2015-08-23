/*
 * 
 * Highlands area, connects to the mountains and to the dragons' den.
 * Good hunting grounds
 * 
 */

// Create namespace
world.loc.Highlands = {
	Hills         : new Event("Hills")
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
