
import { Event, Link } from '../../event';
import { EncounterTable } from '../../encountertable';
import { WorldTime, MoveToLocation, GAME, WORLD } from '../../GAME';
import { VaughnScenes } from '../../event/outlaws/vaughn-scenes';
import { Text } from '../../text';
import { RigardFlags } from './rigard-flags';
import { Gui } from '../../gui';
import { TerryScenes } from '../../event/terry-scenes';
import { RigardScenes } from './rigard';
import { MirandaScenes } from '../../event/miranda-scenes';

let GateLoc = new Event("Main Gate");
let BarracksLoc = {
	common   : new Event("Barracks commons"),
	sparring : new Event("Sparring yard"),
	captains : new Event("Captains quarters")
};


//
// Gate house
//
GateLoc.description = function() {
	let rigard = GAME().rigard;

	Text.Add("The gate area is where most of the merchandise enters the city. It houses a stable for mounts and several checkpoints where you’re supposed to have your cargo inspected, though not everyone is ordered to head there. You wonder if there is an actual process for screening out shady sorts or if the watch simply chooses at random. Overall, this place seems well guarded, and you have a slight suspicion that the fact the Watch’s Barracks are located nearby might have something to do with it.");
	Text.NL();
	Text.Add("Ahead of you, the path splits into three. One path leads to the residential district, where most of the citizens live. Another path leads you to the merchant district, where most of the commerce is handled, and the merchant warehouses are located. The last path leads you toward Rigard’s richer areas - toward the Castle, which seems to be even more fortified than the front gates.");
	Text.NL();
	
	if(rigard.Krawitz["Q"] == RigardFlags.KrawitzQ.HuntingTerry) {
		Text.Add("With the lockdown, the whole place is in a near-riot, the usual commotion and clamour amplified tenfold as caravans try and fail to get past the blockade in either direction and merchants and guards argue with one another, devolving into screaming matches as much to try and be heard over the noise as from sheer frustration.");
		Text.NL();
		Text.Add("The gates certainly won't be opening anytime soon, but this is still a pretty good place for a thief to try hiding. All this chaos will easily cover someone sneaking around.");
	}
	else {
		Text.Add("Just outside the city walls are the expansive plains.");
		if(!(WorldTime().hour >= 6 && WorldTime().hour < 22)) // Nighttime
		{
			Text.Add(" It looks like the gates are shut for the night, you can't leave the city until dawn.");
		}
	}
}


GateLoc.enc = new EncounterTable();
GateLoc.enc.AddEnc(function() { return RigardScenes.Chatter;});
GateLoc.enc.AddEnc(function() { return RigardScenes.Chatter2;});
GateLoc.enc.AddEnc(function() { return RigardScenes.CityHistory;}, 1.0, function() {
	let rigard = GAME().rigard;
	return rigard.flags["CityHistory"] == 0;
});
GateLoc.enc.AddEnc(function() { return TerryScenes.ExploreGates; }, 1000000.0, function() {
	let rigard = GAME().rigard;
	return rigard.Krawitz["Q"] == RigardFlags.KrawitzQ.HuntingTerry;
});
GateLoc.onEntry = function() {
	if(Math.random() < 0.15)
		RigardScenes.Chatter(true);
	else if(Math.random() < 0.3)
		RigardScenes.Chatter2(true);
	else
		Gui.PrintDefaultOptions();
}

GateLoc.links.push(new Link(
	"Gate", true, false
));
GateLoc.links.push(new Link(
	"Residential", true, true,
	null,
	function() {
		MoveToLocation(WORLD().loc.Rigard.Residential.Street, {minute: 10});
	}
));
GateLoc.links.push(new Link(
	"Merchants", true, true,
	null,
	function() {
		MoveToLocation(WORLD().loc.Rigard.ShopStreet.Street, {minute: 10});
	}
));
GateLoc.links.push(new Link(
	"Plaza", true, true,
	null,
	function() {
		MoveToLocation(WORLD().loc.Rigard.Plaza, {minute: 20});
	}
));
GateLoc.links.push(new Link(
	"Leave", true, function() {
		let rigard = GAME().rigard;
		return (WorldTime().hour >= 6 && WorldTime().hour < 22) && !rigard.UnderLockdown();
	},
	null,
	function() {
		let rigard = GAME().rigard;
		if(rigard.Krawitz["Q"] == RigardFlags.KrawitzQ.HeistDone)
			RigardScenes.Lockdown();
		else
			MoveToLocation(WORLD().loc.Plains.Gate, {minute: 5});
	}
));
GateLoc.links.push(new Link(
	"Barracks", true, function() {
		let rigard = GAME().rigard;
		return !rigard.UnderLockdown();
	},
	null,
	function() {
		MoveToLocation(BarracksLoc.common, {minute: 5});
	}
));





//
// Barracks
//
BarracksLoc.common.description = function() {
	Text.Add("There’s always some people around in the dimly lit barracks; a few eating, playing cards or trying to catch a few minutes of shut-eye before returning to their shifts. From the broad variety on display, the city watch consists of both humans and morphs of many kinds.");
	Text.NL();
}

BarracksLoc.common.links.push(new Link(
	"Gate", true, true,
	null,
	function() {
		MoveToLocation(GateLoc, {minute: 5});
	}
));
BarracksLoc.common.links.push(new Link(
	"Yard", true, true,
	null,
	function() {
		MoveToLocation(BarracksLoc.sparring);
	}
));
BarracksLoc.common.links.push(new Link(
	"Captains", true, true,
	null,
	function() {
		MoveToLocation(BarracksLoc.captains);
	}
));

BarracksLoc.common.events.push(new Link(
	"Miranda", function() {
		let miranda = GAME().miranda;
		return miranda.IsAtLocation();
	}, true,
	function() {
		let miranda = GAME().miranda;
		if(miranda.IsAtLocation()) {
			Text.Add("You spot Miranda hanging out with a few other guards, sneaking in a few drinks.");
			Text.NL();
		}
	},
	function() {
		MirandaScenes.BarracksApproach();
	}
));
BarracksLoc.common.events.push(new Link(
	"Evidence", function() {
		return VaughnScenes.Tasks.Snitch.OnTask();
	}, function() {
		let vaughn = GAME().vaughn;
		return !vaughn.taskTimer.Expired();
	},
	function() {
		let miranda = GAME().miranda;
		let vaughn = GAME().vaughn;
		if(VaughnScenes.Tasks.Snitch.OnTask()) {
			if(vaughn.taskTimer.Expired())
				Text.Add("You were supposed to plant the evidence in the lockers here for Vaughn, but you weren't quick enough; the inspection has already happened. You should return and report to Vaughn.");
			else {
				Text.Add("This is where Vaughn told you to plant the evidence of the snitch.");
				if(miranda.flags["Snitch"] == 0)
					Text.Add(" Perhaps you could ask Miranda to help you out, as a less direct way to deal with the issue?");
			}
			Text.NL();
		}
	},
	function() {
		VaughnScenes.Tasks.Snitch.PlantEvidence();
	}
));



BarracksLoc.sparring.description = function() {
	Text.Add("The sparring yard is used by the city watch to do basic training and drills for new recruits. There are a few strawman targets and an archery range, as well as racks of wooden practice weapons of various kinds.");
	Text.NL();
}

BarracksLoc.sparring.links.push(new Link(
	"Commons", true, true,
	null,
	function() {
		MoveToLocation(BarracksLoc.common);
	}
));


//TODO
BarracksLoc.captains.description = function() {
	Text.Add("PLACEHOLDER: Capt's quarters.");
	Text.NL();
}

BarracksLoc.captains.links.push(new Link(
	"Commons", true, true,
	null,
	function() {
		MoveToLocation(BarracksLoc.common);
	}
));

export { GateLoc, BarracksLoc };
